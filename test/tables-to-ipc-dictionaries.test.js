// Regression tests: `tablesToIPC` with Dictionary columns across tables.
//
// Two bugs in the multi-table path, both hit by vgi-rpc's HTTP exchange,
// which streams a zero-row log/metadata batch and then a result batch built
// independently (so with its own dictionary values):
//
//  1. Crash. Dictionary ids were resolved by object identity: the id map was
//     built from the first *data* table's dictionary value types and applied
//     to the *first* table's schema. A leading zero-row table therefore left
//     the schema's dictionary id undefined, and encoding threw
//     `TypeError: Cannot convert undefined to a BigInt`.
//
//  2. Silent corruption. Only the first data table's dictionary was emitted,
//     so later tables' indices resolved against the wrong values:
//     ['a'] followed by ['b'] decoded as ['a', 'a'].
//
// The fix assigns ids by field position and emits each table's dictionary
// (as a replacement before that table's first record batch when it differs),
// the stream-format behaviour Apache Arrow JS's writer has.
import { describe, it, expect } from 'vitest';
import { tableFromIPC as arrowJSTableFromIPC } from 'apache-arrow';
import {
  Table,
  columnFromArray,
  dictionary,
  field,
  int8,
  int32,
  struct,
  tableFromColumns,
  tableFromIPC,
  tablesToIPC,
  utf8,
} from '../src/index.js';
import { decodeIPC } from '../src/decode/decode-ipc.js';

const dictType = () => dictionary(utf8(), int8());

/** A one-column table built the way vgi-typescript builds batches. */
function dictTable(values, name = 'c') {
  const col = columnFromArray(values, dictType());
  return new Table({ version: 5, endianness: 0, fields: [field(name, col.type, true, null)], metadata: null }, [col]);
}

/** A zero-row table (no record batches), optionally carrying batch metadata. */
function emptyTable(metadata) {
  const t = dictTable([]);
  if (metadata) t._vgiRecordMetadata = metadata;
  return t;
}

/** Decode with flechette and with Apache Arrow JS; both must agree. */
function decodeBoth(bytes, name = 'c') {
  const flechette = Array.from(tableFromIPC(bytes).getChild(name).toArray());
  const arrowJS = arrowJSTableFromIPC(bytes).getChild(name)?.toArray();
  return { flechette, arrowJS: arrowJS ? Array.from(arrowJS) : [] };
}

/** Count the dictionary batch messages in an IPC stream. */
function dictionaryMessages(bytes) {
  return decodeIPC(bytes).dictionaries.length;
}

describe('tablesToIPC dictionaries', () => {
  it('encodes a leading zero-row table before a dictionary data table', () => {
    const bytes = tablesToIPC([emptyTable(), dictTable(['a', null])], { format: 'stream' });
    expect(decodeBoth(bytes)).toEqual({ flechette: ['a', null], arrowJS: ['a', null] });
  });

  it('encodes the vgi-rpc shape: metadata-only batch, then data', () => {
    const md = new Map([['vgi_rpc.log_level', 'WARN']]);
    const bytes = tablesToIPC([emptyTable(md), dictTable([null])], { format: 'stream' });
    const decoded = decodeIPC(bytes);
    expect(decoded.records.length).toBe(2);
    expect(decoded.records[0].length).toBe(0);
    expect(decoded.records[0].metadata).toEqual(md);
    expect(decodeBoth(bytes)).toEqual({ flechette: [null], arrowJS: [null] });
  });

  it('keeps each table\'s own dictionary values', () => {
    const bytes = tablesToIPC([dictTable(['a']), dictTable(['b', 'c']), dictTable([null, 'a'])], {
      format: 'stream',
    });
    expect(decodeBoth(bytes)).toEqual({
      flechette: ['a', 'b', 'c', null, 'a'],
      arrowJS: ['a', 'b', 'c', null, 'a'],
    });
  });

  it('handles an all-null dictionary table followed by values', () => {
    const bytes = tablesToIPC([dictTable([null]), dictTable(['a'])], { format: 'stream' });
    expect(decodeBoth(bytes)).toEqual({ flechette: [null, 'a'], arrowJS: [null, 'a'] });
  });

  it('emits a shared dictionary column once', () => {
    const col = columnFromArray(['x', 'y'], dictType());
    const t1 = tableFromColumns({ c: col });
    const t2 = tableFromColumns({ c: col });
    const bytes = tablesToIPC([t1, t2], { format: 'stream' });
    expect(dictionaryMessages(bytes)).toBe(1);
    expect(decodeBoth(bytes).flechette).toEqual(['x', 'y', 'x', 'y']);
  });

  it('emits one replacement per table whose dictionary differs', () => {
    const bytes = tablesToIPC([dictTable(['a']), dictTable(['b']), dictTable(['c'])], { format: 'stream' });
    expect(dictionaryMessages(bytes)).toBe(3);
  });

  it('assigns ids by field position across several dictionary fields', () => {
    const make = (a, b) =>
      tableFromColumns({
        n: columnFromArray([1], int32()),
        a: columnFromArray([a], dictType()),
        b: columnFromArray([b], dictType()),
      });
    const bytes = tablesToIPC([make('a1', 'b1'), make('a2', 'b2')], { format: 'stream' });
    const decoded = tableFromIPC(bytes);
    expect(Array.from(decoded.getChild('a').toArray())).toEqual(['a1', 'a2']);
    expect(Array.from(decoded.getChild('b').toArray())).toEqual(['b1', 'b2']);
    const arrowJS = arrowJSTableFromIPC(bytes);
    expect(Array.from(arrowJS.getChild('b').toArray())).toEqual(['b1', 'b2']);
  });

  it('handles dictionaries nested in a struct', () => {
    const type = struct([field('d', dictType())]);
    const make = (v) => tableFromColumns({ s: columnFromArray([{ d: v }], type) });
    const bytes = tablesToIPC([make('p'), make('q')], { format: 'stream' });
    const rows = tableFromIPC(bytes).getChild('s').toArray().map((r) => r.d);
    expect(rows).toEqual(['p', 'q']);
  });

  it('defines empty dictionaries when only metadata-only batches are sent', () => {
    const md = new Map([['k', 'v']]);
    const bytes = tablesToIPC([emptyTable(md), emptyTable(md)], { format: 'stream' });
    const decoded = tableFromIPC(bytes);
    expect(decoded.numRows).toBe(0);
    expect(dictionaryMessages(bytes)).toBe(1);
  });

  it('honours positional batchMetadata', () => {
    const md = new Map([['pos', '1']]);
    const bytes = tablesToIPC([dictTable(['a']), dictTable(['b'])], { format: 'stream', batchMetadata: [undefined, md] });
    const decoded = decodeIPC(bytes);
    expect(decoded.records[0].metadata ?? null).toBe(null);
    expect(decoded.records[1].metadata).toEqual(md);
  });

  it('refuses dictionary replacement in the file format', () => {
    expect(() => tablesToIPC([dictTable(['a']), dictTable(['b'])], { format: 'file' })).toThrow(/file format/);
    const col = columnFromArray(['x'], dictType());
    const shared = tablesToIPC([tableFromColumns({ c: col }), tableFromColumns({ c: col })], { format: 'file' });
    expect(Array.from(tableFromIPC(shared).getChild('c').toArray())).toEqual(['x', 'x']);
  });
});
