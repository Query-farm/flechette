import { ValidityBuilder } from './validity.js';
/**
 * Builder for batches of binary-typed data.
 */
export declare class BinaryBuilder extends ValidityBuilder {
    toOffset: typeof import("../../util/numbers.js").identity | typeof import("../../util/numbers.js").toBigInt;
    offsets: import("../buffer.js").Buffer;
    values: import("../buffer.js").Buffer;
    pos: number;
    constructor(type: any, ctx: any);
    init(): this;
    set(value: any, index: any): void;
    done(): {
        length: number;
        nullCount: number;
        type: any;
        validity: import("../../types.js").TypedArray;
        offsets: import("../../types.js").TypedArray;
        values: import("../../types.js").TypedArray;
    };
}
