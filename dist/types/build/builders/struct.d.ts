import { ValidityBuilder } from './validity.js';
/**
 * Abstract class for building list-typed data batches.
 */
export declare class AbstractStructBuilder extends ValidityBuilder {
    children: any;
    constructor(type: any, ctx: any);
    init(): this;
    done(): {
        length: number;
        nullCount: number;
        type: any;
        validity: import("../../types.js").TypedArray;
        children: any;
    };
}
/**
 * Builder for struct-typed data batches.
 */
export declare class StructBuilder extends AbstractStructBuilder {
    setters: any;
    constructor(type: any, ctx: any);
    set(value: any, index: any): void;
}
