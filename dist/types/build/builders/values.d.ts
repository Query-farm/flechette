import { ValidityBuilder } from './validity.js';
/**
 * Builder for data batches that can be accessed directly as typed arrays.
 */
export declare class DirectBuilder extends ValidityBuilder {
    values: import("../buffer.js").Buffer;
    constructor(type: any, ctx: any);
    init(): this;
    /**
     * @param {*} value
     * @param {number} index
     * @returns {boolean | void}
     */
    set(value: any, index: number): boolean | void;
    done(): {
        length: number;
        nullCount: number;
        type: any;
        validity: import("../../types.js").TypedArray;
        values: import("../../types.js").TypedArray;
    };
}
/**
 * Builder for int64/uint64 data batches written as bigints.
 */
export declare class Int64Builder extends DirectBuilder {
    set(value: any, index: any): void;
}
/**
 * Builder for data batches whose values must pass through a transform
 * function prior to be written to a backing buffer.
 */
export declare class TransformBuilder extends DirectBuilder {
    transform: any;
    constructor(type: any, ctx: any, transform: any);
    set(value: any, index: any): void;
}
