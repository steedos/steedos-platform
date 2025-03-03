
import {
  ASYNC_COLLECTION_METHODS,
  getAsyncMethodName,
  CLIENT_ONLY_METHODS
} from "./minimongo/constants.js";
import { MongoConnection } from './mongo_connection.js';
// import MongoInternals from './mongo_driver.js';

// Define interfaces and types
// interface IConnectionOptions {
//   oplogUrl?: string;
//   [key: string]: unknown;  // Changed from 'any' to 'unknown' for better type safety
// }

// interface IMongoInternals {
//   RemoteCollectionDriver: typeof RemoteCollectionDriver;
//   defaultRemoteCollectionDriver: () => RemoteCollectionDriver;
// }

// More specific typing for collection methods
// type MongoMethodFunction = (...args: unknown[]) => unknown;
// interface ICollectionMethods {
//   [key: string]: MongoMethodFunction;
// }

// Type for MongoConnection
// interface IMongoClient {
//   connect: () => Promise<void>;
// }

// interface IMongoConnection {
//   client: IMongoClient;
//   [key: string]: MongoMethodFunction | IMongoClient;
// }

// declare global {
//   namespace NodeJS {
//     interface ProcessEnv {
//       MONGO_URL: string;
//       MONGO_OPLOG_URL?: string;
//     }
//   }

//   const MongoInternals: IMongoInternals;
//   const Meteor: {
//     startup: (callback: () => Promise<void>) => void;
//   };
// }

class RemoteCollectionDriver {

  static REMOTE_COLLECTION_METHODS = [
    'createCappedCollectionAsync',
    'dropIndexAsync',
    'ensureIndexAsync',
    'createIndexAsync',
    'countDocuments',
    'dropCollectionAsync',
    'estimatedDocumentCount',
    'find',
    'findOneAsync',
    'insertAsync',
    'rawCollection',
    'removeAsync',
    'updateAsync',
    'upsertAsync',
  ];

  constructor(mongoUrl, options) {
    this.mongo = new MongoConnection(mongoUrl, options);
  }

  open(name) {
    const ret = {};

    // Handle remote collection methods
    RemoteCollectionDriver.REMOTE_COLLECTION_METHODS.forEach((method) => {
      // Type assertion needed because we know these methods exist on MongoConnection
      const mongoMethod = this.mongo[method];
      ret[method] = mongoMethod.bind(this.mongo, name);

      if (!ASYNC_COLLECTION_METHODS.includes(method)) return;

      const asyncMethodName = getAsyncMethodName(method);
      ret[asyncMethodName] = (...args) => ret[method](...args);
    });

    // Handle client-only methods
    CLIENT_ONLY_METHODS.forEach((method) => {
      ret[method] = (...args) => {
        throw new Error(
          `${method} is not available on the server. Please use ${getAsyncMethodName(
            method
          )}() instead.`
        );
      };
    });

    return ret;
  }
}



export { RemoteCollectionDriver };