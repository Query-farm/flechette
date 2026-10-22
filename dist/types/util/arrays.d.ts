import type { Int64ArrayConstructor, IntArrayConstructor, IntegerArray, TypedArray } from '../types.js';
/**
 * @import { Int64ArrayConstructor, IntArrayConstructor, IntegerArray, TypedArray } from '../types.js'
 */
export declare const uint8Array: Uint8ArrayConstructor;
export declare const uint16Array: Uint16ArrayConstructor;
export declare const uint32Array: Uint32ArrayConstructor;
export declare const uint64Array: BigUint64ArrayConstructor;
export declare const int8Array: Int8ArrayConstructor;
export declare const int16Array: Int16ArrayConstructor;
export declare const int32Array: Int32ArrayConstructor;
export declare const int64Array: BigInt64ArrayConstructor;
export declare const float32Array: Float32ArrayConstructor;
export declare const float64Array: Float64ArrayConstructor;
/**
 * Check if an input value is an ArrayBuffer or SharedArrayBuffer,
 * applicable cross-realms.
 * @param {unknown} data
 * @returns {data is ArrayBufferLike}
 */
export declare function isArrayBufferLike(data: unknown): data is ArrayBufferLike;
/**
 * Check in an input value is a Uint8Array, applicable cross-realms.
 * @param {unknown} value
 * @returns {value is Uint8Array}
 */
export declare function isUint8Array(value: unknown): value is Uint8Array;
/**
 * Return the appropriate typed array constructor for the given
 * integer type metadata.
 * @param {number} bitWidth The integer size in bits.
 * @param {boolean} signed Flag indicating if the integer is signed.
 * @returns {IntArrayConstructor}
 */
export declare function intArrayType(bitWidth: number, signed: boolean): IntArrayConstructor;
/**
 * Check if a value is a typed array, applicable cross-realms.
 * @param {unknown} value The value to check.
 * @returns {value is TypedArray}
 *  True if value is a typed array, false otherwise.
 */
export declare function isTypedArray(value: unknown): value is TypedArray;
/**
 * Check if a value is either a standard array or typed array.
 * @param {*} value The value to check.
 * @returns {value is (Array | TypedArray)}
 *  True if value is an array, false otherwise.
 */
export declare function isArray(value: any): value is (any[] | TypedArray);
/**
 * Check if a value is an array type (constructor) for 64-bit integers,
 * one of BigInt64Array or BigUint64Array.
 * @param {*} value The value to check.
 * @returns {value is Int64ArrayConstructor}
 *  True if value is a 64-bit array type, false otherwise.
 */
export declare function isInt64ArrayType(value: any): value is Int64ArrayConstructor;
/**
 * Resolve the backing typed-array constructor for a data type. Flechette's
 * own types carry it as `values`; a foreign (e.g. arrow-js) type object spells
 * it `ArrayType`. Falling back lets the builders accept either, so passing an
 * arrow-js type to `columnFromArray` no longer silently allocates a Uint8Array
 * (which corrupts the values).
 * @param {*} type The data type.
 * @returns {*} The typed-array constructor, or undefined.
 */
export declare function arrayTypeOf(type: any): any;
/**
 * Determine the correct index into an offset array for a given
 * full column row index. Assumes offset indices can be manipulated
 * as 32-bit signed integers.
 * @param {IntegerArray} offsets The offsets array.
 * @param {number} index The full column row index.
 */
export declare function bisect(offsets: IntegerArray, index: number): number;
/**
 * Return a 64-bit aligned version of the array.
 * @template {TypedArray} T
 * @param {T} array The array.
 * @param {number} length The current array length.
 * @returns {T} The aligned array.
 */
export declare function align<T extends TypedArray>(array: T, length?: number): T;
/**
 * Resize a typed array to exactly the specified length.
 * @template {TypedArray} T
 * @param {T} array The array.
 * @param {number} newLength The new length.
 * @param {number} [offset] The offset at which to copy the old array.
 * @returns {T} The resized array.
 */
export declare function resize<T extends TypedArray>(array: T, newLength: number, offset?: number): T;
/**
 * Grow a typed array to accommdate a minimum index. The array size is
 * doubled until it exceeds the minimum index.
 * @template {TypedArray} T
 * @param {T} array The array.
 * @param {number} index The minimum index.
 * @param {boolean} [shift] Flag to shift copied bytes to back of array.
 * @returns {T} The resized array.
 */
export declare function grow<T extends TypedArray>(array: T, index: number, shift?: boolean): T;
