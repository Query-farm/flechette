import type { DataType, ExtractionOptions } from '../types.js';
import type { BuilderContext, DictionaryContext } from './types.js';
import type { BatchBuilder } from './builders/batch.js';
/**
 * Create a context object for shared builder state.
 * @param {ExtractionOptions} [options]  Batch extraction options.
 * @param {DictionaryContext} [dictionaries] Context object for tracking dictionaries.
 * @returns {BuilderContext}
 */
export declare function builderContext(options?: ExtractionOptions, dictionaries?: DictionaryContext): BuilderContext;
/**
 * Returns a batch builder for the given type and builder context.
 * @param {DataType} type A data type.
 * @param {BuilderContext} [ctx] A builder context.
 * @returns {BatchBuilder}
 */
export declare function builder(type: DataType, ctx?: BuilderContext): BatchBuilder;
