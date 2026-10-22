import { BatchBuilder } from './batch.js';
/**
 * Abstract class for building union-typed data batches.
 */
export declare class AbstractUnionBuilder extends BatchBuilder {
    children: any;
    typeMap: any;
    lookup: any;
    nullCount: number;
    typeIds: import("../buffer.js").Buffer;
    constructor(type: any, ctx: any);
    init(): this;
    set(value: any, index: any): void;
    done(): {
        length: number;
        nullCount: number;
        type: any;
        typeIds: import("../../types.js").TypedArray;
        children: any;
    };
}
/**
 * Builder for sparse union-typed data batches.
 */
export declare class SparseUnionBuilder extends AbstractUnionBuilder {
    update(value: any, index: any, child: any): void;
}
/**
 * Builder for dense union-typed data batches.
 */
export declare class DenseUnionBuilder extends AbstractUnionBuilder {
    offsets: import("../buffer.js").Buffer;
    init(): this;
    update(value: any, index: any, child: any): void;
    done(): {
        length: number;
        nullCount: number;
        type: any;
        typeIds: import("../../types.js").TypedArray;
        children: any;
        offsets: import("../../types.js").TypedArray;
    };
}
