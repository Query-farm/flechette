import { describe, it, expect } from "vitest";
import { tableFromIPC as arrowJSTableFromIPC } from 'apache-arrow';
import {
  columnFromArray,
  int32,
  utf8,
  tableFromColumns,
  tableFromIPC,
  tablesToIPC,
  concatTables,
} from '../src/index.js';

function makeTable(rows) {
  return tableFromColumns({
    n: columnFromArray(rows.map(r => r.n), int32()),
    s: columnFromArray(rows.map(r => r.s), utf8()),
  });
}

describe('tablesToIPC', () => {
  it('round-trips a single table (delegates to tableToIPC)', () => {
    const t = makeTable([{ n: 1, s: 'a' }, { n: 2, s: 'b' }]);
    const bytes = tablesToIPC([t], { format: 'stream' });
    const decoded = tableFromIPC(bytes, { useBigInt: true });
    expect(decoded.numRows).toBe(2);
    expect(Array.from(decoded.getChild('n'))).toEqual([1, 2]);
    expect(Array.from(decoded.getChild('s'))).toEqual(['a', 'b']);
  });

  it('emits a multi-batch stream when given multiple tables', () => {
    const t1 = makeTable([{ n: 1, s: 'a' }, { n: 2, s: 'b' }]);
    const t2 = makeTable([{ n: 3, s: 'c' }]);
    const t3 = makeTable([{ n: 4, s: 'd' }, { n: 5, s: 'e' }, { n: 6, s: 'f' }]);

    const bytes = tablesToIPC([t1, t2, t3], { format: 'stream' });
    const decoded = tableFromIPC(bytes, { useBigInt: true });

    // All rows from all input tables, in order.
    expect(decoded.numRows).toBe(6);
    expect(Array.from(decoded.getChild('n'))).toEqual([1, 2, 3, 4, 5, 6]);
    expect(Array.from(decoded.getChild('s'))).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);

    // The decoded table's underlying column has 3 batches (one per input).
    expect(decoded.getChild('n').data.length).toBe(3);
  });

  it('arrow-js can read the multi-batch stream', () => {
    const t1 = makeTable([{ n: 10, s: 'x' }]);
    const t2 = makeTable([{ n: 20, s: 'y' }]);
    const bytes = tablesToIPC([t1, t2], { format: 'stream' });
    const arrowJS = arrowJSTableFromIPC(bytes);
    expect(arrowJS.numRows).toBe(2);
    expect(arrowJS.getChildAt(0).get(0)).toBe(10);
    expect(arrowJS.getChildAt(0).get(1)).toBe(20);
    expect(arrowJS.getChildAt(1).get(0)).toBe('x');
    expect(arrowJS.getChildAt(1).get(1)).toBe('y');
  });

  it('rejects empty input', () => {
    expect(() => tablesToIPC([], { format: 'stream' })).toThrow();
  });

  it('rejects mismatched field count', () => {
    const t1 = tableFromColumns({ a: columnFromArray([1], int32()) });
    const t2 = tableFromColumns({
      a: columnFromArray([1], int32()),
      b: columnFromArray([2], int32()),
    });
    expect(() => tablesToIPC([t1, t2], { format: 'stream' })).toThrow(/2 fields, expected 1/);
  });

  it('rejects mismatched field names', () => {
    const t1 = tableFromColumns({ a: columnFromArray([1], int32()) });
    const t2 = tableFromColumns({ b: columnFromArray([2], int32()) });
    expect(() => tablesToIPC([t1, t2], { format: 'stream' })).toThrow(/'b', expected 'a'/);
  });
});

describe('concatTables', () => {
  it('returns the input unchanged for a single table', () => {
    const t = makeTable([{ n: 1, s: 'a' }]);
    expect(concatTables([t])).toBe(t);
  });

  it('combines per-column batches across inputs', () => {
    const t1 = makeTable([{ n: 1, s: 'a' }]);
    const t2 = makeTable([{ n: 2, s: 'b' }]);
    const merged = concatTables([t1, t2]);
    expect(merged.numRows).toBe(2);
    expect(merged.getChild('n').data.length).toBe(2);
    expect(merged.getChild('s').data.length).toBe(2);
  });

  it('throws on empty input', () => {
    expect(() => concatTables([])).toThrow();
  });
});
