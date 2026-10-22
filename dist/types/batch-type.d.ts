import type { DataType, ExtractionOptions, Metadata } from './types.js';
/**
 * Return a batch constructor for the given data type and extraction options.
 * @param {DataType} type The data type.
 * @param {ExtractionOptions} options The extraction options.
 * @param {Metadata | null} [metadata] Custom field metadata, used to
 *  identify extension types such as GeoArrow WKB and WKT geometries.
 */
export declare function batchType(type: DataType, options?: ExtractionOptions, metadata?: Metadata | null): any;
