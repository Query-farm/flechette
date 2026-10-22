import { BatchBuilder } from './batch.js';
/**
 * Builder for validity bitmaps within batches.
 */
export declare class ValidityBuilder extends BatchBuilder {
    nullCount: number;
    validity: import("../buffer.js").Bitmap;
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
    };
}
