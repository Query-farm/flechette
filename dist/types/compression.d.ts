import type { Codec, CompressionType_ } from './types.js';
/**
 * Return an error message for a missing codec.
 * @param {CompressionType_} type The codec type.
 */
export declare function missingCodec(type: CompressionType_): string;
/**
 * Register a codec to use for compressing or decompressing Arrow buffers.
 * @param {CompressionType_} type The compression type.
 * @param {Codec} codec The codec implementation.
 */
export declare function setCompressionCodec(type: CompressionType_, codec: Codec): void;
/**
 * Returns a compression codec for the provided type, or null if not found.
 * Compression codecs must first be registered using *setCompressionCodec*.
 * @param {CompressionType_ | null} [type] The compression type.
 * @returns {Codec | null} The compression codec, or null if not registered.
 */
export declare function getCompressionCodec(type?: CompressionType_ | null): Codec | null;
/**
 * Decompress an Arrow buffer, return decompressed bytes and region metadata.
 * @param {Uint8Array} body The message body.
 * @param {{ offset: number, length: number }} region Buffer region metadata.
 * @param {Codec} codec A compression codec.
 * @returns {{ bytes: Uint8Array, offset: number, length: number }}
 */
export declare function decompressBuffer(body: Uint8Array, { offset, length }: {
    offset: number;
    length: number;
}, codec: Codec): {
    bytes: Uint8Array;
    offset: number;
    length: number;
};
/**
 * Compress an Arrow buffer, return encoded bytes. If the compression does
 * not decrease the overall length, retains uncompressed bytes.
 * @param {Uint8Array} bytes The byte buffer to compress.
 * @param {Codec} codec A compression codec.
 */
export declare function compressBuffer(bytes: Uint8Array, codec: Codec): Uint8Array<ArrayBuffer>;
