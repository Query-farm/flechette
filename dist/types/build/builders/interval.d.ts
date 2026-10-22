import { ValidityBuilder } from './validity.js';
/**
 * Builder for day/time interval-typed data batches.
 */
export declare class IntervalDayTimeBuilder extends ValidityBuilder {
    values: import("../buffer.js").Buffer;
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
/**
 * Builder for month/day/nano interval-typed data batches.
 */
export declare class IntervalMonthDayNanoBuilder extends ValidityBuilder {
    values: import("../buffer.js").Buffer;
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
