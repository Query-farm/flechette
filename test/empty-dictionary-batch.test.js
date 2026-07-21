// Regression test: a zero-row table with a Dictionary (ENUM) column, encoded
// with `batchMetadata`, must round-trip through flechette's own reader.
//
// `columnFromValues` only pushes a batch when it saw at least one row
// (`if (row) next(b)`), so a zero-length column has `column.data.length === 0`.
// `assembleDictionaryBatches` reaches dictionaries via `col.data[0]`, so it
// finds none and leaves `idMap` empty — while `tableToIPC`'s `batchMetadata`
// path still synthesises an empty RecordBatch (so the metadata has a message
// to ride on) and `assembleSchema` still stamps a dictionary id onto the
// schema. The stream therefore declared a dictionary id that no
// DictionaryBatch message ever defined, and reading it back threw
// `TypeError: undefined is not an object (evaluating 'dictionary.cache')`.
// DuckDB rejected the same stream.
//
// This is hit on every VGI HTTP exchange init: the stream-state token rides
// exactly such a zero-row metadata-only batch.
//
// The fix synthesises matching empty DictionaryBatch messages and registers
// their ids in `idMap`, so the schema and the messages agree.
import { describe, it, expect } from 'vitest';
import { tableFromIPC } from '../src/decode/table-from-ipc.js';
import { tableToIPC } from '../src/encode/table-to-ipc.js';
import { tableFromColumns } from '../src/build/table-from-columns.js';
import { columnFromValues } from '../src/build/column-from-values.js';
import { dictionary, utf8, int32, int64, struct, list, field } from '../src/data-types.js';
import { Type } from '../src/constants.js';

/** Encode a zero-row table with per-batch metadata, then read it back. */
function roundtrip(columns, metadata) {
  const table = tableFromColumns(columns);
  expect(table.numRows).toBe(0);
  const bytes = tableToIPC(table, { format: 'stream', batchMetadata: [metadata] });
  return tableFromIPC(bytes);
}

describe('empty dictionary batches', () => {
  it('round-trips a zero-row dictionary column carrying batch metadata', () => {
    const md = new Map([['vgi-stream-state', 'token']]);
    const type = dictionary(utf8(), int32());
    const col = columnFromValues([], type);
    // precondition: a zero-length column emits no batches at all
    expect(col.data.length).toBe(0);

    const table = roundtrip([['enum', col]], md);
    expect(table.numRows).toBe(0);
    expect(table.numCols).toBe(1);
    expect(table.getChild('enum').type.typeId).toBe(Type.Dictionary);
    expect(table.toColumns().enum).toEqual([]);
    // the batch metadata the empty batch exists to carry survives
    expect(table._vgiRecordMetadata).toEqual(md);
  });

  it('emits one dictionary batch per distinct dictionary id', () => {
    const table = tableFromColumns([
      ['a', columnFromValues([], dictionary(utf8(), int32()))],
      ['b', columnFromValues([], dictionary(utf8(), int32()))]
    ]);
    const bytes = tableToIPC(table, {
      format: 'stream',
      batchMetadata: [new Map([['k', 'v']])]
    });
    const back = tableFromIPC(bytes);
    expect(back.numRows).toBe(0);
    expect(back.numCols).toBe(2);
    // distinct dictionary value types must get distinct ids
    const ids = back.schema.fields.map(f => f.type.id);
    expect(new Set(ids).size).toBe(2);
  });

  it('round-trips zero-row dictionaries nested in struct and list columns', () => {
    const md = new Map([['k', 'v']]);
    const table = roundtrip([
      ['plain', columnFromValues([], int64())],
      ['s', columnFromValues([], struct([
        field('e', dictionary(utf8(), int32()))
      ]))],
      ['l', columnFromValues([], list(field('e', dictionary(utf8(), int32()))))]
    ], md);
    expect(table.numRows).toBe(0);
    expect(table.numCols).toBe(3);
    expect(table._vgiRecordMetadata).toEqual(md);
  });

  it('leaves a non-empty dictionary table unchanged', () => {
    const table = tableFromColumns([
      ['enum', columnFromValues(['a', 'b', 'a'], dictionary(utf8(), int32()))]
    ]);
    const bytes = tableToIPC(table, {
      format: 'stream',
      batchMetadata: [new Map([['k', 'v']])]
    });
    const back = tableFromIPC(bytes);
    expect(back.numRows).toBe(3);
    expect(back.toColumns().enum).toEqual(['a', 'b', 'a']);
    expect(back._vgiRecordMetadata).toEqual(new Map([['k', 'v']]));
  });
});
