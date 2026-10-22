import { ValidityBuilder } from './validity.js';
/**
 * Builder for batches of decimal-typed data (64-bits or more).
 */
export declare class DecimalBuilder extends ValidityBuilder {
    scale: number;
    stride: number;
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
