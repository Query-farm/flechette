import type { DictionaryType } from '../../types.js';
import type { BuilderContext, DictionaryContext, DictionaryValues } from '../types.js';
import { ValidityBuilder } from './validity.js';
/**
 * Create a context object for managing dictionary builders.
 * @returns {DictionaryContext}
 */
export declare function dictionaryContext(): DictionaryContext;
/**
 * Builder helper for creating dictionary values.
 * @param {DictionaryType} type The dictionary data type.
 * @param {BuilderContext} ctx The builder context.
 * @returns {DictionaryValues}
 */
export declare function dictionaryValues(type: DictionaryType, ctx: BuilderContext): DictionaryValues;
/**
 * Builder for dictionary-typed data batches.
 */
export declare class DictionaryBuilder extends ValidityBuilder {
    dict: any;
    values: import("../buffer.js").Buffer;
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
    batch(): any;
}
