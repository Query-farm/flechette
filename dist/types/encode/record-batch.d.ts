import type { BodyCompression, RecordBatch } from '../types.js';
import type { Builder } from './builder.js';
/**
 * @param {Builder} builder
 * @param {RecordBatch} batch
 * @param {BodyCompression | null} [compression]
 * @returns {number}
 */
export declare function encodeRecordBatch(builder: Builder, batch: RecordBatch, compression?: BodyCompression | null): number;
