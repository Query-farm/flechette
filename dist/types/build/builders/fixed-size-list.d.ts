import { ValidityBuilder } from './validity.js';
/**
 * Builder for fixed-size-list-typed data batches.
 */
export declare class FixedSizeListBuilder extends ValidityBuilder {
    child: any;
    stride: any;
    constructor(type: any, ctx: any);
    init(): this;
    set(value: any, index: any): void;
    done(): {
        length: number;
        nullCount: number;
        type: any;
        validity: import("../../types.js").TypedArray;
        children: any[];
    };
}
