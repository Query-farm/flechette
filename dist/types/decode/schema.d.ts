import type { Schema, Version_ } from '../types.js';
/**
 * Decode a table schema describing the fields and their data types.
 * @param {Uint8Array} buf A byte buffer of binary Arrow IPC data
 * @param {number} index The starting index in the byte buffer
 * @param {Version_} version Arrow version value
 * @returns {Schema} The schema
 */
export declare function decodeSchema(buf: Uint8Array, index: number, version: Version_): Schema;
