import { ValidityBuilder } from './validity.js';
/**
 * Builder for fixed-size-binary-typed data batches.
 */
export declare class FixedSizeBinaryBuilder extends ValidityBuilder {
    stride: any;
    values: import("../buffer.js").Buffer;
    constructor(type: any, ctx: any);
    init(): this;
    set(value: any, index: any): void;
    done(): {
        length: number;
        nullCount: number;
        type: any;
        validity: import("../../types.js").TypedArray;
        values: import("../../types.js").TypedArray;
    };
}
