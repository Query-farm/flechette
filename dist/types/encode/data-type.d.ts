import type { DataType } from '../types.js';
import type { Builder } from './builder.js';
/**
 * Encode a data type into a flatbuffer.
 * @param {Builder} builder
 * @param {DataType} type
 * @returns {number} The offset at which the data type is written.
 */
export declare function encodeDataType(builder: Builder, type: DataType): number;
