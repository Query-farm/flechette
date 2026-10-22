import type { Metadata } from '../types.js';
/**
 * Decode custom metadata consisting of key-value string pairs.
 * @param {Uint8Array} buf A byte buffer of binary Arrow IPC data
 * @param {number} index The starting index in the byte buffer
 * @returns {Metadata | null} The custom metadata map
 */
export declare function decodeMetadata(buf: Uint8Array, index: number): Metadata | null;
