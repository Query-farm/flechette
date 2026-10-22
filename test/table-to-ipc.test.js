import { describe, it, expect } from "vitest";
import { readFile } from 'node:fs/promises';
import { Version, columnFromArray, dateMillisecond, list, struct, field, tableFromColumns, tableFromIPC, tableToIPC } from '../src/index.js';
import * as dataMethods from './util/data.js';

const files = [
  'flights.arrows',
  'scrabble.arrows',
  'convert.arrows',
  'decimal_test.arrows'
];

describe('tableToIPC', () => {
  it('preserves raw Date64 milliseconds in nested IPC data', () => {
    const type = list(struct([field('date', dateMillisecond())]));
    const values = [[{ date: -1n }, { date: 1745152496123n }], null, []];
    const table = tableFromColumns({ values: columnFromArray(values, type) });
    for (const format of ['stream', 'file']) {
      const decoded = tableFromIPC(tableToIPC(table, { format }));
      expect(Array.from(decoded.getChild('values'))).toEqual([
        [{ date: -1 }, { date: 1745152496123 }], null, []
      ]);
    }
  });

  for (const [name, method] of Object.entries(dataMethods)) {
    it(`encodes ${name} data`, async () => {
      const data = await method();
      data.forEach(({ bytes }) => testEncode(bytes, 'stream'));
      data.forEach(({ bytes }) => testEncode(bytes, 'file'));
    });
  }

  for (const file of files) {
    it(`encodes ${file}`, async () => {
      const bytes = new Uint8Array(await readFile(`test/data/${file}`));
      testEncode(bytes, 'stream', true);
      testEncode(bytes, 'file', true);
    });
  }

  it('throws on inconsistent batch sizes', () => {
    const a = columnFromArray([1, 2, 3, 4, 5], null);
    const b = columnFromArray([1, 2, 3, 4, 5], null, { maxBatchRows: 2 });
    expect(() => tableToIPC(tableFromColumns({ a, b }))).throws();
    expect(() => tableToIPC(tableFromColumns({ b, a }))).throws();
  });
});

function testEncode(bytes, format = 'stream', primitive = false) {
  // load table
  const table = tableFromIPC(bytes);

  // ensure complete schema, override version
  const schema = {
    endianness: 0,
    metadata: null,
    ...table.schema,
    version: Version.V5
  };

  // encode table to ipc bytes
  const ipc = tableToIPC(table, { format });

  // parse ipc bytes to get a "round-trip" table
  const round = tableFromIPC(ipc);

  // check schema and shape equality
  expect(round.schema).toStrictEqual(schema);
  expect(round.numRows).toBe(table.numRows);
  expect(round.numCols).toBe(table.numCols);

  // check extracted value equality
  for (let i = 0; i < table.numCols; ++i) {
    const r = round.getChildAt(i).toArray();
    const t = table.getChildAt(i).toArray();
    if (primitive) {
      // check values ourselves to reduce overhead
      // provides massive speed up for large tables
      const n = table.numRows;
      let count = 0;
      for (let row = 0; row < n; ++row) {
        if (r[row] === t[row]) ++count;
      }
      expect(count).toBe(n);
    } else {
      expect(r).toStrictEqual(t);
    }
  }
}
