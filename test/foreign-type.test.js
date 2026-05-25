import { describe, it, expect } from "vitest";
import { columnFromArray, tableFromColumns, tableToIPC, tableFromIPC } from '../src/index.js';
import { Type } from '../src/constants.js';

// Type objects produced by *other* Arrow implementations (notably arrow-js,
// `@query-farm/apache-arrow`) follow the Arrow spec field names: an Int carries
// `bitWidth` + `isSigned` + `ArrayType` (the typed-array constructor), whereas
// flechette's own types use `bitWidth` + `signed` + `values`. flechette should
// accept either so a foreign type passed to columnFromArray builds the correct
// buffer (not a Uint8Array, which corrupts the values) and encodes the correct
// signedness (not silently unsigned).
const foreignInt = (bitWidth, isSigned, ArrayType) => ({
  typeId: Type.Int, bitWidth, isSigned, ArrayType,
});
const foreignFloat = (precision, ArrayType) => ({
  typeId: Type.Float, precision, ArrayType,
});

function roundtrip(values, type) {
  const col = columnFromArray(values, type, { useBigInt: true });
  const ipc = tableToIPC(tableFromColumns({ x: col }), { format: 'stream' });
  const back = tableFromIPC(ipc);
  return { field: back.schema.fields[0], values: Array.from(back.getChild('x')) };
}

describe('foreign (arrow-js-style) type objects', () => {
  it('preserves signedness and values for a signed Int32 (isSigned/ArrayType)', () => {
    const { field, values } = roundtrip([5, 10, 3, 0], foreignInt(32, true, Int32Array));
    expect(field.type.typeId).toBe(Type.Int);
    expect(field.type.bitWidth).toBe(32);
    expect(field.type.signed).toBe(true);
    expect(values).toStrictEqual([5, 10, 3, 0]);
  });

  it('preserves an unsigned Int32', () => {
    const { field, values } = roundtrip([5, 10, 3], foreignInt(32, false, Uint32Array));
    expect(field.type.bitWidth).toBe(32);
    expect(field.type.signed).toBe(false);
    expect(values).toStrictEqual([5, 10, 3]);
  });

  it('preserves a signed Int8 (e.g. a dictionary index type)', () => {
    const { field, values } = roundtrip([-1, 0, 2], foreignInt(8, true, Int8Array));
    expect(field.type.bitWidth).toBe(8);
    expect(field.type.signed).toBe(true);
    expect(values).toStrictEqual([-1, 0, 2]);
  });

  it('preserves Float64 values (ArrayType without `values`)', () => {
    const { field, values } = roundtrip([51.5, 4.2, -1.25], foreignFloat(2, Float64Array));
    expect(field.type.typeId).toBe(Type.Float);
    expect(values).toStrictEqual([51.5, 4.2, -1.25]);
  });
});
