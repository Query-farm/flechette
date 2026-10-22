import { BatchBuilder } from './batch.js';
/**
 * Builder for run-end-encoded-typed data batches.
 */
export declare class RunEndEncodedBuilder extends BatchBuilder {
    children: any;
    pos: number;
    key: any;
    value: any;
    constructor(type: any, ctx: any);
    init(): this;
    next(): void;
    set(value: any, index: any): void;
    done(): {
        length: number;
        nullCount: number;
        type: any;
        children: any;
    };
}
