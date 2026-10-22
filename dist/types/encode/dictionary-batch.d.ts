import type { BodyCompression, DictionaryBatch } from '../types.js';
import type { Builder } from './builder.js';
/**
 * @param {Builder} builder
 * @param {DictionaryBatch} dictionaryBatch
 * @param {BodyCompression | null} compression
 * @returns {number}
 */
export declare function encodeDictionaryBatch(builder: Builder, dictionaryBatch: DictionaryBatch, compression: BodyCompression | null): number;
