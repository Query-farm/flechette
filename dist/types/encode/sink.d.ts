export declare class Sink {
    /**
     * Write bytes to this sink.
     * @param {Uint8Array} bytes The byte buffer to write.
     */
    write(bytes: Uint8Array): void;
    /**
     * Write padding bytes (zeroes) to this sink.
     * @param {number} byteCount The number of padding bytes.
     */
    pad(byteCount: number): void;
    /**
     * @returns {Uint8Array | null}
     */
    finish(): Uint8Array | null;
}
export declare class MemorySink extends Sink {
    buffers: any[];
    /**
     * A sink that collects bytes in memory.
     */
    constructor();
    /**
     * Write bytes
     * @param {Uint8Array} bytes
     */
    write(bytes: Uint8Array): void;
    /**
     * @returns {Uint8Array}
     */
    finish(): Uint8Array;
}
