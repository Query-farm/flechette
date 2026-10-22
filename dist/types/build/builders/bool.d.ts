import { ValidityBuilder } from './validity.js';
/**
 * Builder for batches of bool-typed data.
 */
export declare class BoolBuilder extends ValidityBuilder {
    values: import("../buffer.js").Bitmap;
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
