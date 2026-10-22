import { ValidityBuilder } from './validity.js';
/**
 * Abstract class for building list data batches.
 */
export declare class AbstractListBuilder extends ValidityBuilder {
    child: any;
    offsets: import("../buffer.js").Buffer;
    toOffset: typeof import("../../util/numbers.js").identity | typeof import("../../util/numbers.js").toBigInt;
    pos: number;
    constructor(type: any, ctx: any, child: any);
    init(): this;
    done(): {
        length: number;
        nullCount: number;
        type: any;
        validity: import("../../types.js").TypedArray;
        offsets: import("../../types.js").TypedArray;
        children: any[];
    };
}
/**
 * Builder for list-typed data batches.
 */
export declare class ListBuilder extends AbstractListBuilder {
    constructor(type: any, ctx: any);
    set(value: any, index: any): void;
}
