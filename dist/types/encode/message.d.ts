/**
 * Write an IPC message to the builder sink.
 * @param {Builder} builder
 * @param {MessageHeader_} headerType
 * @param {number} headerOffset
 * @param {number} bodyLength
 * @param {Block[]} [blocks]
 * @param {number} [metadataOffset] FlatBuffer offset to a `[KeyValue]` vector
 *  for the message-level `custom_metadata` field. Pass 0 (or omit) to
 *  encode no metadata, matching the pre-feature behaviour.
 */
export function writeMessage(builder: Builder, headerType: MessageHeader_, headerOffset: number, bodyLength: number, blocks?: Block[], metadataOffset?: number): void;
import type { Builder } from './builder.js';
import type { MessageHeader_ } from '../types.js';
import type { Block } from '../types.js';
