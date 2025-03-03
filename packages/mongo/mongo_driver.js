/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2025-02-20 13:18:20
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2025-02-28 16:06:27
 * @FilePath: /steedos-platform-3.0/packages/mongo/mongo_driver.js
 * @Description: 
 */
import { OplogHandle } from './oplog_tailing.js';
import { MongoConnection } from './mongo_connection.js';
import { OplogObserveDriver } from './oplog_observe_driver.js';
import { MongoDB } from './mongo_common.js';
import { RemoteCollectionDriver } from './remote_collection_driver.js'
import once from 'lodash.once';
import LocalCollection from './minimongo/local_collection.js';
import DDPServer from './ddp-server/livedata_server.js';

// const MongoInternals = global.MongoInternals = {};
const MongoInternals = {};

MongoInternals.__packageName = 'mongo';

MongoInternals.NpmModules = {
  mongodb: {
    version: "3.7.4",
    module: MongoDB
  }
};

// Older version of what is now available via
// MongoInternals.NpmModules.mongodb.module.  It was never documented, but
// people do use it.
// XXX COMPAT WITH 1.0.3.2
MongoInternals.NpmModule = new Proxy(MongoDB, {
  get(target, propertyKey, receiver) {
    if (propertyKey === 'ObjectID') {
      Meteor.deprecate(
        `Accessing 'MongoInternals.NpmModule.ObjectID' directly is deprecated. ` +
        `Use 'MongoInternals.NpmModule.ObjectId' instead.`
      );
    }
    return Reflect.get(target, propertyKey, receiver);
  },
});

MongoInternals.OplogHandle = OplogHandle;

MongoInternals.Connection = MongoConnection;

MongoInternals.OplogObserveDriver = OplogObserveDriver;

// This is used to add or remove EJSON from the beginning of everything nested
// inside an EJSON custom type. It should only be called on pure JSON!


// Ensure that EJSON.clone keeps a Timestamp as a Timestamp (instead of just
// doing a structural clone).
// XXX how ok is this? what if there are multiple copies of MongoDB loaded?
MongoDB.Timestamp.prototype.clone = function () {
  // Timestamps should be immutable.
  return this;
};

// Listen for the invalidation messages that will trigger us to poll the
// database for changes. If this selector specifies specific IDs, specify them
// here, so that updates to different specific IDs don't cause us to poll.
// listenCallback is the same kind of (notification, complete) callback passed
// to InvalidationCrossbar.listen.

export const listenAll = async function (cursorDescription, listenCallback) {
  const listeners = [];
  await forEachTrigger(cursorDescription, function (trigger) {
    listeners.push(DDPServer._InvalidationCrossbar.listen(
      trigger, listenCallback));
  });

  return {
    stop: function () {
      listeners.forEach(function (listener) {
        listener.stop();
      });
    }
  };
};

export const forEachTrigger = async function (cursorDescription, triggerCallback) {
  const key = {collection: cursorDescription.collectionName};
  const specificIds = LocalCollection._idsMatchedBySelector(
    cursorDescription.selector);
  if (specificIds) {
    for (const id of specificIds) {
      await triggerCallback(Object.assign({id: id}, key));
    }
    await triggerCallback(Object.assign({dropCollection: true, id: null}, key));
  } else {
    await triggerCallback(key);
  }
  // Everyone cares about the database being dropped.
  await triggerCallback({ dropDatabase: true });
};



// XXX We probably need to find a better way to expose this. Right now
// it's only used by tests, but in fact you need it in normal
// operation to interact with capped collections.
MongoInternals.MongoTimestamp = MongoDB.Timestamp;


// Assign the class to MongoInternals
MongoInternals.RemoteCollectionDriver = RemoteCollectionDriver;

// Create the singleton RemoteCollectionDriver only on demand
MongoInternals.defaultRemoteCollectionDriver = once(() => {
  const connectionOptions = {};
  const mongoUrl = process.env.MONGO_URL;

  if (!mongoUrl) {
    throw new Error("MONGO_URL must be set in environment");
  }
  console.log('oplogUrl:', process.env.MONGO_OPLOG_URL);
  if (process.env.MONGO_OPLOG_URL) {
    connectionOptions.oplogUrl = process.env.MONGO_OPLOG_URL;
  }

  const driver = new RemoteCollectionDriver(mongoUrl, connectionOptions);

  // Initialize database connection on startup
  // Meteor.startup(async (): Promise<void> => {
  //   await driver.mongo.client.connect();
  // });

  return driver;
});

export default MongoInternals;
