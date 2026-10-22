import { AbstractListBuilder } from './list.js';
/**
 * Builder for map-typed data batches.
 */
export declare class MapBuilder extends AbstractListBuilder {
    constructor(type: any, ctx: any);
    set(value: any, index: any): void;
}
