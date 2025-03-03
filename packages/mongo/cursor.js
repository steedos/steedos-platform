// import { ASYNC_CURSOR_METHODS, getAsyncMethodName } from 'meteor/minimongo/constants';
import { ASYNC_CURSOR_METHODS, getAsyncMethodName } from './minimongo/constants.js';
import { replaceMeteorAtomWithMongo, replaceTypes } from './mongo_common.js';
import LocalCollection from './minimongo/local_collection.js';
// import { CursorDescription } from './cursor_description.js';
// import { ObserveCallbacks, ObserveChangesCallbacks } from './types.js';
import Mongo from './collection/collection.js';

// interface MongoInterface {
//   rawCollection: (collectionName: string) => any;
//   _createAsynchronousCursor: (cursorDescription: CursorDescription, options: CursorOptions) => any;
//   _observeChanges: (cursorDescription: CursorDescription, ordered: boolean, callbacks: any, nonMutatingCallbacks?: boolean) => any;
// }

// interface CursorOptions {
//   selfForIteration: Cursor<any>;
//   useTransform: boolean;
// }

/**
 * @class Cursor
 *
 * The main cursor object returned from find(), implementing the documented
 * Mongo.Collection cursor API.
 *
 * Wraps a CursorDescription and lazily creates an AsynchronousCursor
 * (only contacts MongoDB when methods like fetch or forEach are called).
 */
export class Cursor {
  // public _mongo: MongoInterface;
  // public _cursorDescription: CursorDescription;
  // public _synchronousCursor: any | null;

  constructor(mongo, cursorDescription) {
    this._mongo = mongo;
    this._cursorDescription = cursorDescription;
    this._synchronousCursor = null;
  }

  async countAsync(){
    const collection = this._mongo.rawCollection(this._cursorDescription.collectionName);
    return await collection.countDocuments(
      replaceTypes(this._cursorDescription.selector, replaceMeteorAtomWithMongo),
      replaceTypes(this._cursorDescription.options, replaceMeteorAtomWithMongo),
    );
  }

  count() {
    throw new Error(
      "count() is not available on the server. Please use countAsync() instead."
    );
  }

  getTransform() {
    return this._cursorDescription.options.transform;
  }

  _publishCursor(sub) {
    const collection = this._cursorDescription.collectionName;
    return Mongo.Collection._publishCursor(this, sub, collection);
  }

  _getCollectionName() {
    return this._cursorDescription.collectionName;
  }

  observe(callbacks) {
    return LocalCollection._observeFromObserveChanges(this, callbacks);
  }

  async observeAsync(callbacks) {
    return new Promise(resolve => resolve(this.observe(callbacks)));
  }

  observeChanges(callbacks, options) {
    // const ordered = LocalCollection._observeChangesCallbacksAreOrdered(callbacks);
    const ordered = true;
    return this._mongo._observeChanges(
      this._cursorDescription,
      ordered,
      callbacks,
      options.nonMutatingCallbacks
    );
  }

  async observeChangesAsync(callbacks, options) {
    return this.observeChanges(callbacks, options);
  }
}

// Add cursor methods dynamically
[
  ...ASYNC_CURSOR_METHODS, 
  Symbol.iterator, Symbol.asyncIterator].forEach(methodName => {
  if (methodName === 'count') return;

  (Cursor.prototype)[methodName] = function(this_cursor, ...args) {
    const cursor = setupAsynchronousCursor(this_cursor, methodName);
    return cursor[methodName](...args);
  };

  if (methodName === Symbol.iterator || methodName === Symbol.asyncIterator) return;

  const methodNameAsync = getAsyncMethodName(methodName);

  (Cursor.prototype)[methodNameAsync] = function(this_cursor, ...args) {
    return this[methodName](...args);
  };
});

function setupAsynchronousCursor(cursor, method) {
  if (cursor._cursorDescription.options.tailable) {
    throw new Error(`Cannot call ${String(method)} on a tailable cursor`);
  }

  if (!cursor._synchronousCursor) {
    cursor._synchronousCursor = cursor._mongo._createAsynchronousCursor(
      cursor._cursorDescription,
      {
        selfForIteration: cursor,
        useTransform: true,
      }
    );
  }

  return cursor._synchronousCursor;
}