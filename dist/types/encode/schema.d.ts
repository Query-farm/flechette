import type { Schema } from '../types.js';
import type { Builder } from './builder.js';
/**
 * @param {Builder} builder
 * @param {Schema} schema
 * @returns {number}
 */
export declare function encodeSchema(builder: Builder, schema: Schema): number;
