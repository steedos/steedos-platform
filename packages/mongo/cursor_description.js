/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2025-02-20 13:18:20
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2025-02-28 15:06:19
 * @FilePath: /steedos-platform-3.0/packages/mongo/cursor_description.js
 * @Description: 
 */
// interface CursorOptions {
//   limit?: number;
//   skip?: number;
//   sort?: Record<string, 1 | -1>;
//   fields?: Record<string, 1 | 0>;
//   projection?: Record<string, 1 | 0>;
//   disableOplog?: boolean;
//   _disableOplog?: boolean;
//   tailable?: boolean;
//   transform?: (doc: any) => any;
// }

/**
 * Represents the arguments used to construct a cursor.
 * Used as a key for cursor de-duplication.
 *
 * All properties must be either:
 * - JSON-stringifiable, or
 * - Not affect observeChanges output (e.g., options.transform functions)
 */
import Mongo from './collection/collection.js';
export class CursorDescription {
  // collectionName: string;
  // selector: Record<string, any>;
  // options: CursorOptions;

  constructor(collectionName, selector, options) {
    this.collectionName = collectionName;
    // @ts-ignore
    this.selector = Mongo.Collection._rewriteSelector(selector);
    this.options = options || {};
  }
}