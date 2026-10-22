import type { DictionaryBatch, Version_ } from '../types.js';
/**
 * Decode a dictionary batch.
 * @param {Uint8Array} buf A byte buffer of binary Arrow IPC data
 * @param {number} index The starting index in the byte buffer
 * @param {Version_} version Arrow version value
 * @returns {DictionaryBatch} The dictionary batch
 */
export declare function decodeDictionaryBatch(buf: Uint8Array, index: number, version: Version_): DictionaryBatch;
