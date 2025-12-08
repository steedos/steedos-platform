(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var NpmModuleMongodb = Package['npm-mongo'].NpmModuleMongodb;
var NpmModuleMongodbVersion = Package['npm-mongo'].NpmModuleMongodbVersion;
var AllowDeny = Package['allow-deny'].AllowDeny;
var Random = Package.random.Random;
var EJSON = Package.ejson.EJSON;
var LocalCollection = Package.minimongo.LocalCollection;
var Minimongo = Package.minimongo.Minimongo;
var DDP = Package['ddp-client'].DDP;
var DDPServer = Package['ddp-server'].DDPServer;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var DiffSequence = Package['diff-sequence'].DiffSequence;
var MongoID = Package['mongo-id'].MongoID;
var check = Package.check.check;
var Match = Package.check.Match;
var ECMAScript = Package.ecmascript.ECMAScript;
var Decimal = Package['mongo-decimal'].Decimal;
var _ = Package.underscore._;
var MaxHeap = Package['binary-heap'].MaxHeap;
var MinHeap = Package['binary-heap'].MinHeap;
var MinMaxHeap = Package['binary-heap'].MinMaxHeap;
var Hook = Package['callback-hook'].Hook;
var meteorInstall = Package.modules.meteorInstall;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var MongoInternals, MongoConnection, CursorDescription, Cursor, listenAll, forEachTrigger, OPLOG_COLLECTION, idForOp, OplogHandle, ObserveMultiplexer, ObserveHandle, PollingObserveDriver, OplogObserveDriver, Mongo, selector, callback, options;

var require = meteorInstall({"node_modules":{"meteor":{"mongo":{"mongo_driver.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/mongo/mongo_driver.js                                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
!function (module1) {
  let DocFetcher;
  module1.link("./doc_fetcher.js", {
    DocFetcher(v) {
      DocFetcher = v;
    }

  }, 0);

  /**
   * Provide a synchronous Collection API using fibers, backed by
   * MongoDB.  This is only for use on the server, and mostly identical
   * to the client API.
   *
   * NOTE: the public API methods must be run within a fiber. If you call
   * these outside of a fiber they will explode!
   */
  var MongoDB = NpmModuleMongodb;

  var Future = Npm.require('fibers/future');

  MongoInternals = {};
  MongoInternals.NpmModules = {
    mongodb: {
      version: NpmModuleMongodbVersion,
      module: MongoDB
    }
  }; // Older version of what is now available via
  // MongoInternals.NpmModules.mongodb.module.  It was never documented, but
  // people do use it.
  // XXX COMPAT WITH 1.0.3.2

  MongoInternals.NpmModule = MongoDB; // This is used to add or remove EJSON from the beginning of everything nested
  // inside an EJSON custom type. It should only be called on pure JSON!

  var replaceNames = function (filter, thing) {
    if (typeof thing === "object" && thing !== null) {
      if (_.isArray(thing)) {
        return _.map(thing, _.bind(replaceNames, null, filter));
      }

      var ret = {};

      _.each(thing, function (value, key) {
        ret[filter(key)] = replaceNames(filter, value);
      });

      return ret;
    }

    return thing;
  }; // Ensure that EJSON.clone keeps a Timestamp as a Timestamp (instead of just
  // doing a structural clone).
  // XXX how ok is this? what if there are multiple copies of MongoDB loaded?


  MongoDB.Timestamp.prototype.clone = function () {
    // Timestamps should be immutable.
    return this;
  };

  var makeMongoLegal = function (name) {
    return "EJSON" + name;
  };

  var unmakeMongoLegal = function (name) {
    return name.substr(5);
  };

  var replaceMongoAtomWithMeteor = function (document) {
    if (document instanceof MongoDB.Binary) {
      var buffer = document.value(true);
      return new Uint8Array(buffer);
    }

    if (document instanceof MongoDB.ObjectID) {
      return new Mongo.ObjectID(document.toHexString());
    }

    if (document instanceof MongoDB.Decimal128) {
      return Decimal(document.toString());
    }

    if (document["EJSON$type"] && document["EJSON$value"] && _.size(document) === 2) {
      return EJSON.fromJSONValue(replaceNames(unmakeMongoLegal, document));
    }

    if (document instanceof MongoDB.Timestamp) {
      // For now, the Meteor representation of a Mongo timestamp type (not a date!
      // this is a weird internal thing used in the oplog!) is the same as the
      // Mongo representation. We need to do this explicitly or else we would do a
      // structural clone and lose the prototype.
      return document;
    }

    return undefined;
  };

  var replaceMeteorAtomWithMongo = function (document) {
    if (EJSON.isBinary(document)) {// This does more copies than we'd like, but is necessary because
      // MongoDB.BSON only looks like it takes a Uint8Array (and doesn't actually
      // serialize it correctly).
      // return new MongoDB.Binary(Buffer.from(document));
    }

    if (document instanceof Mongo.ObjectID) {
      return new MongoDB.ObjectID(document.toHexString());
    }

    if (document instanceof MongoDB.Timestamp) {
      // For now, the Meteor representation of a Mongo timestamp type (not a date!
      // this is a weird internal thing used in the oplog!) is the same as the
      // Mongo representation. We need to do this explicitly or else we would do a
      // structural clone and lose the prototype.
      return document;
    }

    if (document instanceof Decimal) {
      return MongoDB.Decimal128.fromString(document.toString());
    }

    if (EJSON._isCustomType(document)) {
      return replaceNames(makeMongoLegal, EJSON.toJSONValue(document));
    } // It is not ordinarily possible to stick dollar-sign keys into mongo
    // so we don't bother checking for things that need escaping at this time.


    return undefined;
  };

  var replaceTypes = function (document, atomTransformer) {
    if (typeof document !== 'object' || document === null) return document;
    var replacedTopLevelAtom = atomTransformer(document);
    if (replacedTopLevelAtom !== undefined) return replacedTopLevelAtom;
    var ret = document;

    _.each(document, function (val, key) {
      var valReplaced = replaceTypes(val, atomTransformer);

      if (val !== valReplaced) {
        // Lazy clone. Shallow copy.
        if (ret === document) ret = _.clone(document);
        ret[key] = valReplaced;
      }
    });

    return ret;
  };

  let STEEDOS_MONGODB_MONITOR_COMMANDS = false;
  let SLOW_QUERY_THRESHOLD_MS = 300;

  if (process.env.STEEDOS_MONGODB_SLOW_QUERY_THRESHOLD) {
    STEEDOS_MONGODB_MONITOR_COMMANDS = true;
    SLOW_QUERY_THRESHOLD_MS = Number(process.env.STEEDOS_MONGODB_SLOW_QUERY_THRESHOLD);
  }

  let STEEDOS_MONGODB_OPLOG_MONITOR_COMMANDS = false;
  let OPLOG_SLOW_QUERY_THRESHOLD_MS = 300;

  if (process.env.STEEDOS_MONGODB_SLOW_QUERY_THRESHOLD) {
    STEEDOS_MONGODB_OPLOG_MONITOR_COMMANDS = true;
    OPLOG_SLOW_QUERY_THRESHOLD_MS = Number(process.env.STEEDOS_MONGODB_OPLOG_SLOW_QUERY_THRESHOLD);
  } // 存储进行中的命令，用于计算耗时


  const runningCommands = new Map();

  function connectAndMonitor(client) {
    // 1. 监听 Command Started 事件
    client.on('commandStarted', event => {
      // 记录命令开始时间
      runningCommands.set(event.requestId, {
        startTime: Date.now(),
        commandName: event.commandName,
        databaseName: event.databaseName,
        command: event.command // 可以在这里记录 event.command 等信息

      });
    }); // 2. 监听 Command Succeeded 事件

    client.on('commandSucceeded', event => {
      const commandInfo = runningCommands.get(event.requestId);
      if (!commandInfo) return;
      const duration = Date.now() - commandInfo.startTime;
      runningCommands.delete(event.requestId);

      if (commandInfo.databaseName === 'local') {
        if (STEEDOS_MONGODB_OPLOG_MONITOR_COMMANDS && duration >= OPLOG_SLOW_QUERY_THRESHOLD_MS) {
          console.warn("\uD83D\uDEA8 Meteor Mongodb \u6162\u67E5\u8BE2\u68C0\u6D4B\u5230 (\u6210\u529F):");
          console.warn("   \u547D\u4EE4: ".concat(commandInfo.commandName));
          console.warn("   \u8017\u65F6: ".concat(duration, " ms"));
          console.warn("   \u6570\u636E\u5E93: ".concat(commandInfo.databaseName));
          console.warn("   command: ".concat(JSON.stringify(commandInfo.command)));
        }
      } else {
        if (duration >= SLOW_QUERY_THRESHOLD_MS) {
          console.warn("\uD83D\uDEA8 Meteor Mongodb \u6162\u67E5\u8BE2\u68C0\u6D4B\u5230 (\u6210\u529F):");
          console.warn("   \u547D\u4EE4: ".concat(commandInfo.commandName));
          console.warn("   \u8017\u65F6: ".concat(duration, " ms"));
          console.warn("   \u6570\u636E\u5E93: ".concat(commandInfo.databaseName));
          console.warn("   command: ".concat(JSON.stringify(commandInfo.command)));
        }
      }
    }); // 3. 监听 Command Failed 事件

    client.on('commandFailed', event => {
      const commandInfo = runningCommands.get(event.requestId);
      if (!commandInfo) return;
      const duration = Date.now() - commandInfo.startTime;
      runningCommands.delete(event.requestId); // 失败的命令也可能是慢操作

      if (commandInfo.databaseName === 'local') {
        if (STEEDOS_MONGODB_OPLOG_MONITOR_COMMANDS && duration >= OPLOG_SLOW_QUERY_THRESHOLD_MS) {
          console.error("\u274C \u6162\u64CD\u4F5C\u68C0\u6D4B\u5230 (\u5931\u8D25):");
          console.error("   \u547D\u4EE4: ".concat(commandInfo.commandName));
          console.error("   \u8017\u65F6: ".concat(duration, " ms"));
          console.error("   \u9519\u8BEF: ".concat(event.failure.message));
          console.error("   command: ".concat(commandInfo.command));
        }
      } else {
        if (duration >= SLOW_QUERY_THRESHOLD_MS) {
          console.error("\u274C \u6162\u64CD\u4F5C\u68C0\u6D4B\u5230 (\u5931\u8D25):");
          console.error("   \u547D\u4EE4: ".concat(commandInfo.commandName));
          console.error("   \u8017\u65F6: ".concat(duration, " ms"));
          console.error("   \u9519\u8BEF: ".concat(event.failure.message));
          console.error("   command: ".concat(commandInfo.command));
        }
      }
    });
  }

  MongoConnection = function (url, options) {
    var self = this;
    options = options || {};
    self._observeMultiplexers = {};
    self._onFailoverHook = new Hook();
    var mongoOptions = Object.assign({
      // Reconnect on error.
      autoReconnect: true,
      // Try to reconnect forever, instead of stopping after 30 tries (the
      // default), with each attempt separated by 1000ms.
      reconnectTries: Infinity,
      ignoreUndefined: true,
      // Required to silence deprecation warnings with mongodb@3.1.1.
      useNewUrlParser: true
    }, Mongo._connectionOptions); // Disable the native parser by default, unless specifically enabled
    // in the mongo URL.
    // - The native driver can cause errors which normally would be
    //   thrown, caught, and handled into segfaults that take down the
    //   whole app.
    // - Binary modules don't yet work when you bundle and move the bundle
    //   to a different platform (aka deploy)
    // We should revisit this after binary npm module support lands.

    if (!/[\?&]native_?[pP]arser=/.test(url)) {
      mongoOptions.native_parser = false;
    }

    if (STEEDOS_MONGODB_MONITOR_COMMANDS) {
      mongoOptions.monitorCommands = true;
    } // Internally the oplog connections specify their own poolSize
    // which we don't want to overwrite with any user defined value


    if (_.has(options, 'poolSize')) {
      // If we just set this for "server", replSet will override it. If we just
      // set it for replSet, it will be ignored if we're not using a replSet.
      mongoOptions.poolSize = options.poolSize;
    }

    self.db = null; // We keep track of the ReplSet's primary, so that we can trigger hooks when
    // it changes.  The Node driver's joined callback seems to fire way too
    // often, which is why we need to track it ourselves.

    self._primary = null;
    self._oplogHandle = null;
    self._docFetcher = null;
    var connectFuture = new Future();
    MongoDB.connect(url, mongoOptions, Meteor.bindEnvironment(function (err, client) {
      if (err) {
        throw err;
      }

      if (STEEDOS_MONGODB_MONITOR_COMMANDS) {
        connectAndMonitor(client);
      }

      var db = client.db(); // First, figure out what the current primary is, if any.

      if (db.serverConfig.isMasterDoc) {
        self._primary = db.serverConfig.isMasterDoc.primary;
      }

      db.serverConfig.on('joined', Meteor.bindEnvironment(function (kind, doc) {
        if (kind === 'primary') {
          if (doc.primary !== self._primary) {
            self._primary = doc.primary;

            self._onFailoverHook.each(function (callback) {
              callback();
              return true;
            });
          }
        } else if (doc.me === self._primary) {
          // The thing we thought was primary is now something other than
          // primary.  Forget that we thought it was primary.  (This means
          // that if a server stops being primary and then starts being
          // primary again without another server becoming primary in the
          // middle, we'll correctly count it as a failover.)
          self._primary = null;
        }
      })); // Allow the constructor to return.

      connectFuture['return']({
        client,
        db
      });
    }, connectFuture.resolver() // onException
    )); // Wait for the connection to be successful (throws on failure) and assign the
    // results (`client` and `db`) to `self`.

    Object.assign(self, connectFuture.wait());

    if (options.oplogUrl && !Package['disable-oplog']) {
      self._oplogHandle = new OplogHandle(options.oplogUrl, self.db.databaseName);
      self._docFetcher = new DocFetcher(self);
    }
  };

  MongoConnection.prototype.close = function () {
    var self = this;
    if (!self.db) throw Error("close called before Connection created?"); // XXX probably untested

    var oplogHandle = self._oplogHandle;
    self._oplogHandle = null;
    if (oplogHandle) oplogHandle.stop(); // Use Future.wrap so that errors get thrown. This happens to
    // work even outside a fiber since the 'close' method is not
    // actually asynchronous.

    Future.wrap(_.bind(self.client.close, self.client))(true).wait();
  }; // Returns the Mongo Collection object; may yield.


  MongoConnection.prototype.rawCollection = function (collectionName) {
    var self = this;
    if (!self.db) throw Error("rawCollection called before Connection created?");
    var future = new Future();
    self.db.collection(collectionName, future.resolver());
    return future.wait();
  };

  MongoConnection.prototype._createCappedCollection = function (collectionName, byteSize, maxDocuments) {
    var self = this;
    if (!self.db) throw Error("_createCappedCollection called before Connection created?");
    var future = new Future();
    self.db.createCollection(collectionName, {
      capped: true,
      size: byteSize,
      max: maxDocuments
    }, future.resolver());
    future.wait();
  }; // This should be called synchronously with a write, to create a
  // transaction on the current write fence, if any. After we can read
  // the write, and after observers have been notified (or at least,
  // after the observer notifiers have added themselves to the write
  // fence), you should call 'committed()' on the object returned.


  MongoConnection.prototype._maybeBeginWrite = function () {
    var fence = DDPServer._CurrentWriteFence.get();

    if (fence) {
      return fence.beginWrite();
    } else {
      return {
        committed: function () {}
      };
    }
  }; // Internal interface: adds a callback which is called when the Mongo primary
  // changes. Returns a stop handle.


  MongoConnection.prototype._onFailover = function (callback) {
    return this._onFailoverHook.register(callback);
  }; //////////// Public API //////////
  // The write methods block until the database has confirmed the write (it may
  // not be replicated or stable on disk, but one server has confirmed it) if no
  // callback is provided. If a callback is provided, then they call the callback
  // when the write is confirmed. They return nothing on success, and raise an
  // exception on failure.
  //
  // After making a write (with insert, update, remove), observers are
  // notified asynchronously. If you want to receive a callback once all
  // of the observer notifications have landed for your write, do the
  // writes inside a write fence (set DDPServer._CurrentWriteFence to a new
  // _WriteFence, and then set a callback on the write fence.)
  //
  // Since our execution environment is single-threaded, this is
  // well-defined -- a write "has been made" if it's returned, and an
  // observer "has been notified" if its callback has returned.


  var writeCallback = function (write, refresh, callback) {
    return function (err, result) {
      if (!err) {
        // XXX We don't have to run this on error, right?
        try {
          refresh();
        } catch (refreshErr) {
          if (callback) {
            callback(refreshErr);
            return;
          } else {
            throw refreshErr;
          }
        }
      }

      write.committed();

      if (callback) {
        callback(err, result);
      } else if (err) {
        throw err;
      }
    };
  };

  var bindEnvironmentForWrite = function (callback) {
    return Meteor.bindEnvironment(callback, "Mongo write");
  };

  MongoConnection.prototype._insert = function (collection_name, document, callback) {
    var self = this;

    var sendError = function (e) {
      if (callback) return callback(e);
      throw e;
    };

    if (collection_name === "___meteor_failure_test_collection") {
      var e = new Error("Failure test");
      e._expectedByTest = true;
      sendError(e);
      return;
    }

    if (!(LocalCollection._isPlainObject(document) && !EJSON._isCustomType(document))) {
      sendError(new Error("Only plain objects may be inserted into MongoDB"));
      return;
    }

    var write = self._maybeBeginWrite();

    var refresh = function () {
      Meteor.refresh({
        collection: collection_name,
        id: document._id
      });
    };

    callback = bindEnvironmentForWrite(writeCallback(write, refresh, callback));

    try {
      var collection = self.rawCollection(collection_name);
      collection.insert(replaceTypes(document, replaceMeteorAtomWithMongo), {
        safe: true
      }, callback);
    } catch (err) {
      write.committed();
      throw err;
    }
  }; // Cause queries that may be affected by the selector to poll in this write
  // fence.


  MongoConnection.prototype._refresh = function (collectionName, selector) {
    var refreshKey = {
      collection: collectionName
    }; // If we know which documents we're removing, don't poll queries that are
    // specific to other documents. (Note that multiple notifications here should
    // not cause multiple polls, since all our listener is doing is enqueueing a
    // poll.)

    var specificIds = LocalCollection._idsMatchedBySelector(selector);

    if (specificIds) {
      _.each(specificIds, function (id) {
        Meteor.refresh(_.extend({
          id: id
        }, refreshKey));
      });
    } else {
      Meteor.refresh(refreshKey);
    }
  };

  MongoConnection.prototype._remove = function (collection_name, selector, callback) {
    var self = this;

    if (collection_name === "___meteor_failure_test_collection") {
      var e = new Error("Failure test");
      e._expectedByTest = true;

      if (callback) {
        return callback(e);
      } else {
        throw e;
      }
    }

    var write = self._maybeBeginWrite();

    var refresh = function () {
      self._refresh(collection_name, selector);
    };

    callback = bindEnvironmentForWrite(writeCallback(write, refresh, callback));

    try {
      var collection = self.rawCollection(collection_name);

      var wrappedCallback = function (err, driverResult) {
        callback(err, transformResult(driverResult).numberAffected);
      };

      collection.remove(replaceTypes(selector, replaceMeteorAtomWithMongo), {
        safe: true
      }, wrappedCallback);
    } catch (err) {
      write.committed();
      throw err;
    }
  };

  MongoConnection.prototype._dropCollection = function (collectionName, cb) {
    var self = this;

    var write = self._maybeBeginWrite();

    var refresh = function () {
      Meteor.refresh({
        collection: collectionName,
        id: null,
        dropCollection: true
      });
    };

    cb = bindEnvironmentForWrite(writeCallback(write, refresh, cb));

    try {
      var collection = self.rawCollection(collectionName);
      collection.drop(cb);
    } catch (e) {
      write.committed();
      throw e;
    }
  }; // For testing only.  Slightly better than `c.rawDatabase().dropDatabase()`
  // because it lets the test's fence wait for it to be complete.


  MongoConnection.prototype._dropDatabase = function (cb) {
    var self = this;

    var write = self._maybeBeginWrite();

    var refresh = function () {
      Meteor.refresh({
        dropDatabase: true
      });
    };

    cb = bindEnvironmentForWrite(writeCallback(write, refresh, cb));

    try {
      self.db.dropDatabase(cb);
    } catch (e) {
      write.committed();
      throw e;
    }
  };

  MongoConnection.prototype._update = function (collection_name, selector, mod, options, callback) {
    var self = this;

    if (!callback && options instanceof Function) {
      callback = options;
      options = null;
    }

    if (collection_name === "___meteor_failure_test_collection") {
      var e = new Error("Failure test");
      e._expectedByTest = true;

      if (callback) {
        return callback(e);
      } else {
        throw e;
      }
    } // explicit safety check. null and undefined can crash the mongo
    // driver. Although the node driver and minimongo do 'support'
    // non-object modifier in that they don't crash, they are not
    // meaningful operations and do not do anything. Defensively throw an
    // error here.


    if (!mod || typeof mod !== 'object') throw new Error("Invalid modifier. Modifier must be an object.");

    if (!(LocalCollection._isPlainObject(mod) && !EJSON._isCustomType(mod))) {
      throw new Error("Only plain objects may be used as replacement" + " documents in MongoDB");
    }

    if (!options) options = {};

    var write = self._maybeBeginWrite();

    var refresh = function () {
      self._refresh(collection_name, selector);
    };

    callback = writeCallback(write, refresh, callback);

    try {
      var collection = self.rawCollection(collection_name);
      var mongoOpts = {
        safe: true
      }; // Add support for filtered positional operator

      if (options.arrayFilters !== undefined) mongoOpts.arrayFilters = options.arrayFilters; // explictly enumerate options that minimongo supports

      if (options.upsert) mongoOpts.upsert = true;
      if (options.multi) mongoOpts.multi = true; // Lets you get a more more full result from MongoDB. Use with caution:
      // might not work with C.upsert (as opposed to C.update({upsert:true}) or
      // with simulated upsert.

      if (options.fullResult) mongoOpts.fullResult = true;
      var mongoSelector = replaceTypes(selector, replaceMeteorAtomWithMongo);
      var mongoMod = replaceTypes(mod, replaceMeteorAtomWithMongo);

      var isModify = LocalCollection._isModificationMod(mongoMod);

      if (options._forbidReplace && !isModify) {
        var err = new Error("Invalid modifier. Replacements are forbidden.");

        if (callback) {
          return callback(err);
        } else {
          throw err;
        }
      } // We've already run replaceTypes/replaceMeteorAtomWithMongo on
      // selector and mod.  We assume it doesn't matter, as far as
      // the behavior of modifiers is concerned, whether `_modify`
      // is run on EJSON or on mongo-converted EJSON.
      // Run this code up front so that it fails fast if someone uses
      // a Mongo update operator we don't support.


      let knownId;

      if (options.upsert) {
        try {
          let newDoc = LocalCollection._createUpsertDocument(selector, mod);

          knownId = newDoc._id;
        } catch (err) {
          if (callback) {
            return callback(err);
          } else {
            throw err;
          }
        }
      }

      if (options.upsert && !isModify && !knownId && options.insertedId && !(options.insertedId instanceof Mongo.ObjectID && options.generatedId)) {
        // In case of an upsert with a replacement, where there is no _id defined
        // in either the query or the replacement doc, mongo will generate an id itself.
        // Therefore we need this special strategy if we want to control the id ourselves.
        // We don't need to do this when:
        // - This is not a replacement, so we can add an _id to $setOnInsert
        // - The id is defined by query or mod we can just add it to the replacement doc
        // - The user did not specify any id preference and the id is a Mongo ObjectId,
        //     then we can just let Mongo generate the id
        simulateUpsertWithInsertedId(collection, mongoSelector, mongoMod, options, // This callback does not need to be bindEnvironment'ed because
        // simulateUpsertWithInsertedId() wraps it and then passes it through
        // bindEnvironmentForWrite.
        function (error, result) {
          // If we got here via a upsert() call, then options._returnObject will
          // be set and we should return the whole object. Otherwise, we should
          // just return the number of affected docs to match the mongo API.
          if (result && !options._returnObject) {
            callback(error, result.numberAffected);
          } else {
            callback(error, result);
          }
        });
      } else {
        if (options.upsert && !knownId && options.insertedId && isModify) {
          if (!mongoMod.hasOwnProperty('$setOnInsert')) {
            mongoMod.$setOnInsert = {};
          }

          knownId = options.insertedId;
          Object.assign(mongoMod.$setOnInsert, replaceTypes({
            _id: options.insertedId
          }, replaceMeteorAtomWithMongo));
        }

        collection.update(mongoSelector, mongoMod, mongoOpts, bindEnvironmentForWrite(function (err, result) {
          if (!err) {
            var meteorResult = transformResult(result);

            if (meteorResult && options._returnObject) {
              // If this was an upsert() call, and we ended up
              // inserting a new doc and we know its id, then
              // return that id as well.
              if (options.upsert && meteorResult.insertedId) {
                if (knownId) {
                  meteorResult.insertedId = knownId;
                } else if (meteorResult.insertedId instanceof MongoDB.ObjectID) {
                  meteorResult.insertedId = new Mongo.ObjectID(meteorResult.insertedId.toHexString());
                }
              }

              callback(err, meteorResult);
            } else {
              callback(err, meteorResult.numberAffected);
            }
          } else {
            callback(err);
          }
        }));
      }
    } catch (e) {
      write.committed();
      throw e;
    }
  };

  var transformResult = function (driverResult) {
    var meteorResult = {
      numberAffected: 0
    };

    if (driverResult) {
      var mongoResult = driverResult.result; // On updates with upsert:true, the inserted values come as a list of
      // upserted values -- even with options.multi, when the upsert does insert,
      // it only inserts one element.

      if (mongoResult.upserted) {
        meteorResult.numberAffected += mongoResult.upserted.length;

        if (mongoResult.upserted.length == 1) {
          meteorResult.insertedId = mongoResult.upserted[0]._id;
        }
      } else {
        meteorResult.numberAffected = mongoResult.n;
      }
    }

    return meteorResult;
  };

  var NUM_OPTIMISTIC_TRIES = 3; // exposed for testing

  MongoConnection._isCannotChangeIdError = function (err) {
    // Mongo 3.2.* returns error as next Object:
    // {name: String, code: Number, errmsg: String}
    // Older Mongo returns:
    // {name: String, code: Number, err: String}
    var error = err.errmsg || err.err; // We don't use the error code here
    // because the error code we observed it producing (16837) appears to be
    // a far more generic error code based on examining the source.

    if (error.indexOf('The _id field cannot be changed') === 0 || error.indexOf("the (immutable) field '_id' was found to have been altered to _id") !== -1) {
      return true;
    }

    return false;
  };

  var simulateUpsertWithInsertedId = function (collection, selector, mod, options, callback) {
    // STRATEGY: First try doing an upsert with a generated ID.
    // If this throws an error about changing the ID on an existing document
    // then without affecting the database, we know we should probably try
    // an update without the generated ID. If it affected 0 documents,
    // then without affecting the database, we the document that first
    // gave the error is probably removed and we need to try an insert again
    // We go back to step one and repeat.
    // Like all "optimistic write" schemes, we rely on the fact that it's
    // unlikely our writes will continue to be interfered with under normal
    // circumstances (though sufficiently heavy contention with writers
    // disagreeing on the existence of an object will cause writes to fail
    // in theory).
    var insertedId = options.insertedId; // must exist

    var mongoOptsForUpdate = {
      safe: true,
      multi: options.multi
    };
    var mongoOptsForInsert = {
      safe: true,
      upsert: true
    };
    var replacementWithId = Object.assign(replaceTypes({
      _id: insertedId
    }, replaceMeteorAtomWithMongo), mod);
    var tries = NUM_OPTIMISTIC_TRIES;

    var doUpdate = function () {
      tries--;

      if (!tries) {
        callback(new Error("Upsert failed after " + NUM_OPTIMISTIC_TRIES + " tries."));
      } else {
        collection.update(selector, mod, mongoOptsForUpdate, bindEnvironmentForWrite(function (err, result) {
          if (err) {
            callback(err);
          } else if (result && result.result.n != 0) {
            callback(null, {
              numberAffected: result.result.n
            });
          } else {
            doConditionalInsert();
          }
        }));
      }
    };

    var doConditionalInsert = function () {
      collection.update(selector, replacementWithId, mongoOptsForInsert, bindEnvironmentForWrite(function (err, result) {
        if (err) {
          // figure out if this is a
          // "cannot change _id of document" error, and
          // if so, try doUpdate() again, up to 3 times.
          if (MongoConnection._isCannotChangeIdError(err)) {
            doUpdate();
          } else {
            callback(err);
          }
        } else {
          callback(null, {
            numberAffected: result.result.upserted.length,
            insertedId: insertedId
          });
        }
      }));
    };

    doUpdate();
  };

  _.each(["insert", "update", "remove", "dropCollection", "dropDatabase"], function (method) {
    MongoConnection.prototype[method] = function ()
    /* arguments */
    {
      var self = this;
      return Meteor.wrapAsync(self["_" + method]).apply(self, arguments);
    };
  }); // XXX MongoConnection.upsert() does not return the id of the inserted document
  // unless you set it explicitly in the selector or modifier (as a replacement
  // doc).


  MongoConnection.prototype.upsert = function (collectionName, selector, mod, options, callback) {
    var self = this;

    if (typeof options === "function" && !callback) {
      callback = options;
      options = {};
    }

    return self.update(collectionName, selector, mod, _.extend({}, options, {
      upsert: true,
      _returnObject: true
    }), callback);
  };

  MongoConnection.prototype.find = function (collectionName, selector, options) {
    var self = this;
    if (arguments.length === 1) selector = {};
    return new Cursor(self, new CursorDescription(collectionName, selector, options));
  };

  MongoConnection.prototype.findOne = function (collection_name, selector, options) {
    var self = this;
    if (arguments.length === 1) selector = {};
    options = options || {};
    options.limit = 1;
    return self.find(collection_name, selector, options).fetch()[0];
  }; // We'll actually design an index API later. For now, we just pass through to
  // Mongo's, but make it synchronous.


  MongoConnection.prototype._ensureIndex = function (collectionName, index, options) {
    try {
      var self = this; // We expect this function to be called at startup, not from within a method,
      // so we don't interact with the write fence.

      var collection = self.rawCollection(collectionName);
      var future = new Future();
      var indexName = collection.ensureIndex(index, options, future.resolver());
      future.wait();
    } catch (Exception) {}
  };

  MongoConnection.prototype._dropIndex = function (collectionName, index) {
    var self = this; // This function is only used by test code, not within a method, so we don't
    // interact with the write fence.

    var collection = self.rawCollection(collectionName);
    var future = new Future();
    var indexName = collection.dropIndex(index, future.resolver());
    future.wait();
  }; // CURSORS
  // There are several classes which relate to cursors:
  //
  // CursorDescription represents the arguments used to construct a cursor:
  // collectionName, selector, and (find) options.  Because it is used as a key
  // for cursor de-dup, everything in it should either be JSON-stringifiable or
  // not affect observeChanges output (eg, options.transform functions are not
  // stringifiable but do not affect observeChanges).
  //
  // SynchronousCursor is a wrapper around a MongoDB cursor
  // which includes fully-synchronous versions of forEach, etc.
  //
  // Cursor is the cursor object returned from find(), which implements the
  // documented Mongo.Collection cursor API.  It wraps a CursorDescription and a
  // SynchronousCursor (lazily: it doesn't contact Mongo until you call a method
  // like fetch or forEach on it).
  //
  // ObserveHandle is the "observe handle" returned from observeChanges. It has a
  // reference to an ObserveMultiplexer.
  //
  // ObserveMultiplexer allows multiple identical ObserveHandles to be driven by a
  // single observe driver.
  //
  // There are two "observe drivers" which drive ObserveMultiplexers:
  //   - PollingObserveDriver caches the results of a query and reruns it when
  //     necessary.
  //   - OplogObserveDriver follows the Mongo operation log to directly observe
  //     database changes.
  // Both implementations follow the same simple interface: when you create them,
  // they start sending observeChanges callbacks (and a ready() invocation) to
  // their ObserveMultiplexer, and you stop them by calling their stop() method.


  CursorDescription = function (collectionName, selector, options) {
    var self = this;
    self.collectionName = collectionName;
    self.selector = Mongo.Collection._rewriteSelector(selector);
    self.options = options || {};
  };

  Cursor = function (mongo, cursorDescription) {
    var self = this;
    self._mongo = mongo;
    self._cursorDescription = cursorDescription;
    self._synchronousCursor = null;
  };

  _.each(['forEach', 'map', 'fetch', 'count', Symbol.iterator], function (method) {
    Cursor.prototype[method] = function () {
      var self = this; // You can only observe a tailable cursor.

      if (self._cursorDescription.options.tailable) throw new Error("Cannot call " + method + " on a tailable cursor");

      if (!self._synchronousCursor) {
        self._synchronousCursor = self._mongo._createSynchronousCursor(self._cursorDescription, {
          // Make sure that the "self" argument to forEach/map callbacks is the
          // Cursor, not the SynchronousCursor.
          selfForIteration: self,
          useTransform: true
        });
      }

      return self._synchronousCursor[method].apply(self._synchronousCursor, arguments);
    };
  }); // Since we don't actually have a "nextObject" interface, there's really no
  // reason to have a "rewind" interface.  All it did was make multiple calls
  // to fetch/map/forEach return nothing the second time.
  // XXX COMPAT WITH 0.8.1


  Cursor.prototype.rewind = function () {};

  Cursor.prototype.getTransform = function () {
    return this._cursorDescription.options.transform;
  }; // When you call Meteor.publish() with a function that returns a Cursor, we need
  // to transmute it into the equivalent subscription.  This is the function that
  // does that.


  Cursor.prototype._publishCursor = function (sub) {
    var self = this;
    var collection = self._cursorDescription.collectionName;
    return Mongo.Collection._publishCursor(self, sub, collection);
  }; // Used to guarantee that publish functions return at most one cursor per
  // collection. Private, because we might later have cursors that include
  // documents from multiple collections somehow.


  Cursor.prototype._getCollectionName = function () {
    var self = this;
    return self._cursorDescription.collectionName;
  };

  Cursor.prototype.observe = function (callbacks) {
    var self = this;
    return LocalCollection._observeFromObserveChanges(self, callbacks);
  };

  Cursor.prototype.observeChanges = function (callbacks) {
    var self = this;
    var methods = ['addedAt', 'added', 'changedAt', 'changed', 'removedAt', 'removed', 'movedTo'];

    var ordered = LocalCollection._observeChangesCallbacksAreOrdered(callbacks); // XXX: Can we find out if callbacks are from observe?


    var exceptionName = ' observe/observeChanges callback';
    methods.forEach(function (method) {
      if (callbacks[method] && typeof callbacks[method] == "function") {
        callbacks[method] = Meteor.bindEnvironment(callbacks[method], method + exceptionName);
      }
    });
    return self._mongo._observeChanges(self._cursorDescription, ordered, callbacks);
  };

  MongoConnection.prototype._createSynchronousCursor = function (cursorDescription, options) {
    var self = this;
    options = _.pick(options || {}, 'selfForIteration', 'useTransform');
    var collection = self.rawCollection(cursorDescription.collectionName);
    var cursorOptions = cursorDescription.options;
    var mongoOptions = {
      sort: cursorOptions.sort,
      limit: cursorOptions.limit,
      skip: cursorOptions.skip,
      projection: cursorOptions.fields
    }; // Do we want a tailable cursor (which only works on capped collections)?

    if (cursorOptions.tailable) {
      // We want a tailable cursor...
      mongoOptions.tailable = true; // ... and for the server to wait a bit if any getMore has no data (rather
      // than making us put the relevant sleeps in the client)...

      mongoOptions.awaitdata = true; // ... and to keep querying the server indefinitely rather than just 5 times
      // if there's no more data.

      mongoOptions.numberOfRetries = -1; // And if this is on the oplog collection and the cursor specifies a 'ts',
      // then set the undocumented oplog replay flag, which does a special scan to
      // find the first document (instead of creating an index on ts). This is a
      // very hard-coded Mongo flag which only works on the oplog collection and
      // only works with the ts field.

      if (cursorDescription.collectionName === OPLOG_COLLECTION && cursorDescription.selector.ts) {
        mongoOptions.oplogReplay = true;
      }
    }

    var dbCursor = collection.find(replaceTypes(cursorDescription.selector, replaceMeteorAtomWithMongo), mongoOptions);

    if (typeof cursorOptions.maxTimeMs !== 'undefined') {
      dbCursor = dbCursor.maxTimeMS(cursorOptions.maxTimeMs);
    }

    if (typeof cursorOptions.hint !== 'undefined') {
      dbCursor = dbCursor.hint(cursorOptions.hint);
    }

    return new SynchronousCursor(dbCursor, cursorDescription, options);
  };

  var SynchronousCursor = function (dbCursor, cursorDescription, options) {
    var self = this;
    options = _.pick(options || {}, 'selfForIteration', 'useTransform');
    self._dbCursor = dbCursor;
    self._cursorDescription = cursorDescription; // The "self" argument passed to forEach/map callbacks. If we're wrapped
    // inside a user-visible Cursor, we want to provide the outer cursor!

    self._selfForIteration = options.selfForIteration || self;

    if (options.useTransform && cursorDescription.options.transform) {
      self._transform = LocalCollection.wrapTransform(cursorDescription.options.transform);
    } else {
      self._transform = null;
    }

    self._synchronousCount = Future.wrap(dbCursor.count.bind(dbCursor));
    self._visitedIds = new LocalCollection._IdMap();
  };

  _.extend(SynchronousCursor.prototype, {
    // Returns a Promise for the next object from the underlying cursor (before
    // the Mongo->Meteor type replacement).
    _rawNextObjectPromise: function () {
      const self = this;
      return new Promise((resolve, reject) => {
        self._dbCursor.next((err, doc) => {
          if (err) {
            reject(err);
          } else {
            resolve(doc);
          }
        });
      });
    },
    // Returns a Promise for the next object from the cursor, skipping those whose
    // IDs we've already seen and replacing Mongo atoms with Meteor atoms.
    _nextObjectPromise: function () {
      return Promise.asyncApply(() => {
        var self = this;

        while (true) {
          var doc = Promise.await(self._rawNextObjectPromise());
          if (!doc) return null;
          doc = replaceTypes(doc, replaceMongoAtomWithMeteor);

          if (!self._cursorDescription.options.tailable && _.has(doc, '_id')) {
            // Did Mongo give us duplicate documents in the same cursor? If so,
            // ignore this one. (Do this before the transform, since transform might
            // return some unrelated value.) We don't do this for tailable cursors,
            // because we want to maintain O(1) memory usage. And if there isn't _id
            // for some reason (maybe it's the oplog), then we don't do this either.
            // (Be careful to do this for falsey but existing _id, though.)
            if (self._visitedIds.has(doc._id)) continue;

            self._visitedIds.set(doc._id, true);
          }

          if (self._transform) doc = self._transform(doc);
          return doc;
        }
      });
    },
    // Returns a promise which is resolved with the next object (like with
    // _nextObjectPromise) or rejected if the cursor doesn't return within
    // timeoutMS ms.
    _nextObjectPromiseWithTimeout: function (timeoutMS) {
      const self = this;

      if (!timeoutMS) {
        return self._nextObjectPromise();
      }

      const nextObjectPromise = self._nextObjectPromise();

      const timeoutErr = new Error('Client-side timeout waiting for next object');
      const timeoutPromise = new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          reject(timeoutErr);
        }, timeoutMS);
      });
      return Promise.race([nextObjectPromise, timeoutPromise]).catch(err => {
        if (err === timeoutErr) {
          self.close();
        }

        throw err;
      });
    },
    _nextObject: function () {
      var self = this;
      return self._nextObjectPromise().await();
    },
    forEach: function (callback, thisArg) {
      var self = this; // Get back to the beginning.

      self._rewind(); // We implement the loop ourself instead of using self._dbCursor.each,
      // because "each" will call its callback outside of a fiber which makes it
      // much more complex to make this function synchronous.


      var index = 0;

      while (true) {
        var doc = self._nextObject();

        if (!doc) return;
        callback.call(thisArg, doc, index++, self._selfForIteration);
      }
    },
    // XXX Allow overlapping callback executions if callback yields.
    map: function (callback, thisArg) {
      var self = this;
      var res = [];
      self.forEach(function (doc, index) {
        res.push(callback.call(thisArg, doc, index, self._selfForIteration));
      });
      return res;
    },
    _rewind: function () {
      var self = this; // known to be synchronous

      self._dbCursor.rewind();

      self._visitedIds = new LocalCollection._IdMap();
    },
    // Mostly usable for tailable cursors.
    close: function () {
      var self = this;

      self._dbCursor.close();
    },
    fetch: function () {
      var self = this;
      return self.map(_.identity);
    },
    count: function () {
      let applySkipLimit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var self = this;
      return self._synchronousCount(applySkipLimit).wait();
    },
    // This method is NOT wrapped in Cursor.
    getRawObjects: function (ordered) {
      var self = this;

      if (ordered) {
        return self.fetch();
      } else {
        var results = new LocalCollection._IdMap();
        self.forEach(function (doc) {
          results.set(doc._id, doc);
        });
        return results;
      }
    }
  });

  SynchronousCursor.prototype[Symbol.iterator] = function () {
    var self = this; // Get back to the beginning.

    self._rewind();

    return {
      next() {
        const doc = self._nextObject();

        return doc ? {
          value: doc
        } : {
          done: true
        };
      }

    };
  }; // Tails the cursor described by cursorDescription, most likely on the
  // oplog. Calls docCallback with each document found. Ignores errors and just
  // restarts the tail on error.
  //
  // If timeoutMS is set, then if we don't get a new document every timeoutMS,
  // kill and restart the cursor. This is primarily a workaround for #8598.


  MongoConnection.prototype.tail = function (cursorDescription, docCallback, timeoutMS) {
    var self = this;
    if (!cursorDescription.options.tailable) throw new Error("Can only tail a tailable cursor");

    var cursor = self._createSynchronousCursor(cursorDescription);

    var stopped = false;
    var lastTS;

    var loop = function () {
      var doc = null;

      while (true) {
        if (stopped) return;

        try {
          doc = cursor._nextObjectPromiseWithTimeout(timeoutMS).await();
        } catch (err) {
          // There's no good way to figure out if this was actually an error from
          // Mongo, or just client-side (including our own timeout error). Ah
          // well. But either way, we need to retry the cursor (unless the failure
          // was because the observe got stopped).
          doc = null;
        } // Since we awaited a promise above, we need to check again to see if
        // we've been stopped before calling the callback.


        if (stopped) return;

        if (doc) {
          // If a tailable cursor contains a "ts" field, use it to recreate the
          // cursor on error. ("ts" is a standard that Mongo uses internally for
          // the oplog, and there's a special flag that lets you do binary search
          // on it instead of needing to use an index.)
          lastTS = doc.ts;
          docCallback(doc);
        } else {
          var newSelector = _.clone(cursorDescription.selector);

          if (lastTS) {
            newSelector.ts = {
              $gt: lastTS
            };
          }

          cursor = self._createSynchronousCursor(new CursorDescription(cursorDescription.collectionName, newSelector, cursorDescription.options)); // Mongo failover takes many seconds.  Retry in a bit.  (Without this
          // setTimeout, we peg the CPU at 100% and never notice the actual
          // failover.

          Meteor.setTimeout(loop, 100);
          break;
        }
      }
    };

    Meteor.defer(loop);
    return {
      stop: function () {
        stopped = true;
        cursor.close();
      }
    };
  };

  MongoConnection.prototype._observeChanges = function (cursorDescription, ordered, callbacks) {
    var self = this;

    if (cursorDescription.options.tailable) {
      return self._observeChangesTailable(cursorDescription, ordered, callbacks);
    } // You may not filter out _id when observing changes, because the id is a core
    // part of the observeChanges API.


    if (cursorDescription.options.fields && (cursorDescription.options.fields._id === 0 || cursorDescription.options.fields._id === false)) {
      throw Error("You may not observe a cursor with {fields: {_id: 0}}");
    }

    var observeKey = EJSON.stringify(_.extend({
      ordered: ordered
    }, cursorDescription));
    var multiplexer, observeDriver;
    var firstHandle = false; // Find a matching ObserveMultiplexer, or create a new one. This next block is
    // guaranteed to not yield (and it doesn't call anything that can observe a
    // new query), so no other calls to this function can interleave with it.

    Meteor._noYieldsAllowed(function () {
      if (_.has(self._observeMultiplexers, observeKey)) {
        multiplexer = self._observeMultiplexers[observeKey];
      } else {
        firstHandle = true; // Create a new ObserveMultiplexer.

        multiplexer = new ObserveMultiplexer({
          ordered: ordered,
          onStop: function () {
            delete self._observeMultiplexers[observeKey];
            observeDriver.stop();
          }
        });
        self._observeMultiplexers[observeKey] = multiplexer;
      }
    });

    var observeHandle = new ObserveHandle(multiplexer, callbacks);

    if (firstHandle) {
      var matcher, sorter;

      var canUseOplog = _.all([function () {
        // At a bare minimum, using the oplog requires us to have an oplog, to
        // want unordered callbacks, and to not want a callback on the polls
        // that won't happen.
        return self._oplogHandle && !ordered && !callbacks._testOnlyPollCallback;
      }, function () {
        // We need to be able to compile the selector. Fall back to polling for
        // some newfangled $selector that minimongo doesn't support yet.
        try {
          matcher = new Minimongo.Matcher(cursorDescription.selector);
          return true;
        } catch (e) {
          // XXX make all compilation errors MinimongoError or something
          //     so that this doesn't ignore unrelated exceptions
          return false;
        }
      }, function () {
        // ... and the selector itself needs to support oplog.
        return OplogObserveDriver.cursorSupported(cursorDescription, matcher);
      }, function () {
        // And we need to be able to compile the sort, if any.  eg, can't be
        // {$natural: 1}.
        if (!cursorDescription.options.sort) return true;

        try {
          sorter = new Minimongo.Sorter(cursorDescription.options.sort);
          return true;
        } catch (e) {
          // XXX make all compilation errors MinimongoError or something
          //     so that this doesn't ignore unrelated exceptions
          return false;
        }
      }], function (f) {
        return f();
      }); // invoke each function


      var driverClass = canUseOplog ? OplogObserveDriver : PollingObserveDriver;
      observeDriver = new driverClass({
        cursorDescription: cursorDescription,
        mongoHandle: self,
        multiplexer: multiplexer,
        ordered: ordered,
        matcher: matcher,
        // ignored by polling
        sorter: sorter,
        // ignored by polling
        _testOnlyPollCallback: callbacks._testOnlyPollCallback
      }); // This field is only set for use in tests.

      multiplexer._observeDriver = observeDriver;
    } // Blocks until the initial adds have been sent.


    multiplexer.addHandleAndSendInitialAdds(observeHandle);
    return observeHandle;
  }; // Listen for the invalidation messages that will trigger us to poll the
  // database for changes. If this selector specifies specific IDs, specify them
  // here, so that updates to different specific IDs don't cause us to poll.
  // listenCallback is the same kind of (notification, complete) callback passed
  // to InvalidationCrossbar.listen.


  listenAll = function (cursorDescription, listenCallback) {
    var listeners = [];
    forEachTrigger(cursorDescription, function (trigger) {
      listeners.push(DDPServer._InvalidationCrossbar.listen(trigger, listenCallback));
    });
    return {
      stop: function () {
        _.each(listeners, function (listener) {
          listener.stop();
        });
      }
    };
  };

  forEachTrigger = function (cursorDescription, triggerCallback) {
    var key = {
      collection: cursorDescription.collectionName
    };

    var specificIds = LocalCollection._idsMatchedBySelector(cursorDescription.selector);

    if (specificIds) {
      _.each(specificIds, function (id) {
        triggerCallback(_.extend({
          id: id
        }, key));
      });

      triggerCallback(_.extend({
        dropCollection: true,
        id: null
      }, key));
    } else {
      triggerCallback(key);
    } // Everyone cares about the database being dropped.


    triggerCallback({
      dropDatabase: true
    });
  }; // observeChanges for tailable cursors on capped collections.
  //
  // Some differences from normal cursors:
  //   - Will never produce anything other than 'added' or 'addedBefore'. If you
  //     do update a document that has already been produced, this will not notice
  //     it.
  //   - If you disconnect and reconnect from Mongo, it will essentially restart
  //     the query, which will lead to duplicate results. This is pretty bad,
  //     but if you include a field called 'ts' which is inserted as
  //     new MongoInternals.MongoTimestamp(0, 0) (which is initialized to the
  //     current Mongo-style timestamp), we'll be able to find the place to
  //     restart properly. (This field is specifically understood by Mongo with an
  //     optimization which allows it to find the right place to start without
  //     an index on ts. It's how the oplog works.)
  //   - No callbacks are triggered synchronously with the call (there's no
  //     differentiation between "initial data" and "later changes"; everything
  //     that matches the query gets sent asynchronously).
  //   - De-duplication is not implemented.
  //   - Does not yet interact with the write fence. Probably, this should work by
  //     ignoring removes (which don't work on capped collections) and updates
  //     (which don't affect tailable cursors), and just keeping track of the ID
  //     of the inserted object, and closing the write fence once you get to that
  //     ID (or timestamp?).  This doesn't work well if the document doesn't match
  //     the query, though.  On the other hand, the write fence can close
  //     immediately if it does not match the query. So if we trust minimongo
  //     enough to accurately evaluate the query against the write fence, we
  //     should be able to do this...  Of course, minimongo doesn't even support
  //     Mongo Timestamps yet.


  MongoConnection.prototype._observeChangesTailable = function (cursorDescription, ordered, callbacks) {
    var self = this; // Tailable cursors only ever call added/addedBefore callbacks, so it's an
    // error if you didn't provide them.

    if (ordered && !callbacks.addedBefore || !ordered && !callbacks.added) {
      throw new Error("Can't observe an " + (ordered ? "ordered" : "unordered") + " tailable cursor without a " + (ordered ? "addedBefore" : "added") + " callback");
    }

    return self.tail(cursorDescription, function (doc) {
      var id = doc._id;
      delete doc._id; // The ts is an implementation detail. Hide it.

      delete doc.ts;

      if (ordered) {
        callbacks.addedBefore(id, doc, null);
      } else {
        callbacks.added(id, doc);
      }
    });
  }; // XXX We probably need to find a better way to expose this. Right now
  // it's only used by tests, but in fact you need it in normal
  // operation to interact with capped collections.


  MongoInternals.MongoTimestamp = MongoDB.Timestamp;
  MongoInternals.Connection = MongoConnection;
}.call(this, module);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"oplog_tailing.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/mongo/oplog_tailing.js                                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let NpmModuleMongodb;
module.link("meteor/npm-mongo", {
  NpmModuleMongodb(v) {
    NpmModuleMongodb = v;
  }

}, 0);

var Future = Npm.require('fibers/future');

const {
  Timestamp
} = NpmModuleMongodb;
OPLOG_COLLECTION = 'oplog.rs';
var TOO_FAR_BEHIND = process.env.METEOR_OPLOG_TOO_FAR_BEHIND || 2000;
var TAIL_TIMEOUT = +process.env.METEOR_OPLOG_TAIL_TIMEOUT || 30000;

var showTS = function (ts) {
  return "Timestamp(" + ts.getHighBits() + ", " + ts.getLowBits() + ")";
};

idForOp = function (op) {
  if (op.op === 'd') return op.o._id;else if (op.op === 'i') return op.o._id;else if (op.op === 'u') return op.o2._id;else if (op.op === 'c') throw Error("Operator 'c' doesn't supply an object with id: " + EJSON.stringify(op));else throw Error("Unknown op: " + EJSON.stringify(op));
};

OplogHandle = function (oplogUrl, dbName) {
  var self = this;
  self._oplogUrl = oplogUrl;
  self._dbName = dbName;
  self._oplogLastEntryConnection = null;
  self._oplogTailConnection = null;
  self._stopped = false;
  self._tailHandle = null;
  self._readyFuture = new Future();
  self._crossbar = new DDPServer._Crossbar({
    factPackage: "mongo-livedata",
    factName: "oplog-watchers"
  });
  self._baseOplogSelector = {
    ns: new RegExp("^(?:" + [Meteor._escapeRegExp(self._dbName + "."), Meteor._escapeRegExp("admin.$cmd")].join("|") + ")"),
    $or: [{
      op: {
        $in: ['i', 'u', 'd']
      }
    }, // drop collection
    {
      op: 'c',
      'o.drop': {
        $exists: true
      }
    }, {
      op: 'c',
      'o.dropDatabase': 1
    }, {
      op: 'c',
      'o.applyOps': {
        $exists: true
      }
    }]
  }; // Data structures to support waitUntilCaughtUp(). Each oplog entry has a
  // MongoTimestamp object on it (which is not the same as a Date --- it's a
  // combination of time and an incrementing counter; see
  // http://docs.mongodb.org/manual/reference/bson-types/#timestamps).
  //
  // _catchingUpFutures is an array of {ts: MongoTimestamp, future: Future}
  // objects, sorted by ascending timestamp. _lastProcessedTS is the
  // MongoTimestamp of the last oplog entry we've processed.
  //
  // Each time we call waitUntilCaughtUp, we take a peek at the final oplog
  // entry in the db.  If we've already processed it (ie, it is not greater than
  // _lastProcessedTS), waitUntilCaughtUp immediately returns. Otherwise,
  // waitUntilCaughtUp makes a new Future and inserts it along with the final
  // timestamp entry that it read, into _catchingUpFutures. waitUntilCaughtUp
  // then waits on that future, which is resolved once _lastProcessedTS is
  // incremented to be past its timestamp by the worker fiber.
  //
  // XXX use a priority queue or something else that's faster than an array

  self._catchingUpFutures = [];
  self._lastProcessedTS = null;
  self._onSkippedEntriesHook = new Hook({
    debugPrintExceptions: "onSkippedEntries callback"
  });
  self._entryQueue = new Meteor._DoubleEndedQueue();
  self._workerActive = false;

  self._startTailing();
};

_.extend(OplogHandle.prototype, {
  stop: function () {
    var self = this;
    if (self._stopped) return;
    self._stopped = true;
    if (self._tailHandle) self._tailHandle.stop(); // XXX should close connections too
  },
  onOplogEntry: function (trigger, callback) {
    var self = this;
    if (self._stopped) throw new Error("Called onOplogEntry on stopped handle!"); // Calling onOplogEntry requires us to wait for the tailing to be ready.

    self._readyFuture.wait();

    var originalCallback = callback;
    callback = Meteor.bindEnvironment(function (notification) {
      originalCallback(notification);
    }, function (err) {
      Meteor._debug("Error in oplog callback", err);
    });

    var listenHandle = self._crossbar.listen(trigger, callback);

    return {
      stop: function () {
        listenHandle.stop();
      }
    };
  },
  // Register a callback to be invoked any time we skip oplog entries (eg,
  // because we are too far behind).
  onSkippedEntries: function (callback) {
    var self = this;
    if (self._stopped) throw new Error("Called onSkippedEntries on stopped handle!");
    return self._onSkippedEntriesHook.register(callback);
  },
  // Calls `callback` once the oplog has been processed up to a point that is
  // roughly "now": specifically, once we've processed all ops that are
  // currently visible.
  // XXX become convinced that this is actually safe even if oplogConnection
  // is some kind of pool
  waitUntilCaughtUp: function () {
    var self = this;
    if (self._stopped) throw new Error("Called waitUntilCaughtUp on stopped handle!"); // Calling waitUntilCaughtUp requries us to wait for the oplog connection to
    // be ready.

    self._readyFuture.wait();

    var lastEntry;

    while (!self._stopped) {
      // We need to make the selector at least as restrictive as the actual
      // tailing selector (ie, we need to specify the DB name) or else we might
      // find a TS that won't show up in the actual tail stream.
      try {
        lastEntry = self._oplogLastEntryConnection.findOne(OPLOG_COLLECTION, self._baseOplogSelector, {
          fields: {
            ts: 1
          },
          sort: {
            $natural: -1
          }
        });
        break;
      } catch (e) {
        // During failover (eg) if we get an exception we should log and retry
        // instead of crashing.
        Meteor._debug("Got exception while reading last entry", e);

        Meteor._sleepForMs(100);
      }
    }

    if (self._stopped) return;

    if (!lastEntry) {
      // Really, nothing in the oplog? Well, we've processed everything.
      return;
    }

    var ts = lastEntry.ts;
    if (!ts) throw Error("oplog entry without ts: " + EJSON.stringify(lastEntry));

    if (self._lastProcessedTS && ts.lessThanOrEqual(self._lastProcessedTS)) {
      // We've already caught up to here.
      return;
    } // Insert the future into our list. Almost always, this will be at the end,
    // but it's conceivable that if we fail over from one primary to another,
    // the oplog entries we see will go backwards.


    var insertAfter = self._catchingUpFutures.length;

    while (insertAfter - 1 > 0 && self._catchingUpFutures[insertAfter - 1].ts.greaterThan(ts)) {
      insertAfter--;
    }

    var f = new Future();

    self._catchingUpFutures.splice(insertAfter, 0, {
      ts: ts,
      future: f
    });

    f.wait();
  },
  _startTailing: function () {
    var self = this; // First, make sure that we're talking to the local database.

    var mongodbUri = Npm.require('mongodb-uri');

    if (mongodbUri.parse(self._oplogUrl).database !== 'local') {
      throw Error("$MONGO_OPLOG_URL must be set to the 'local' database of " + "a Mongo replica set");
    } // We make two separate connections to Mongo. The Node Mongo driver
    // implements a naive round-robin connection pool: each "connection" is a
    // pool of several (5 by default) TCP connections, and each request is
    // rotated through the pools. Tailable cursor queries block on the server
    // until there is some data to return (or until a few seconds have
    // passed). So if the connection pool used for tailing cursors is the same
    // pool used for other queries, the other queries will be delayed by seconds
    // 1/5 of the time.
    //
    // The tail connection will only ever be running a single tail command, so
    // it only needs to make one underlying TCP connection.


    self._oplogTailConnection = new MongoConnection(self._oplogUrl, {
      poolSize: 1
    }); // XXX better docs, but: it's to get monotonic results
    // XXX is it safe to say "if there's an in flight query, just use its
    //     results"? I don't think so but should consider that

    self._oplogLastEntryConnection = new MongoConnection(self._oplogUrl, {
      poolSize: 1
    }); // Now, make sure that there actually is a repl set here. If not, oplog
    // tailing won't ever find anything!
    // More on the isMasterDoc
    // https://docs.mongodb.com/manual/reference/command/isMaster/

    var f = new Future();

    self._oplogLastEntryConnection.db.admin().command({
      ismaster: 1
    }, f.resolver());

    var isMasterDoc = f.wait();

    if (!(isMasterDoc && isMasterDoc.setName)) {
      throw Error("$MONGO_OPLOG_URL must be set to the 'local' database of " + "a Mongo replica set");
    } // Find the last oplog entry.


    var lastOplogEntry = self._oplogLastEntryConnection.findOne(OPLOG_COLLECTION, {}, {
      sort: {
        $natural: -1
      },
      fields: {
        ts: 1
      }
    });

    var oplogSelector = _.clone(self._baseOplogSelector);

    if (lastOplogEntry) {
      // Start after the last entry that currently exists.
      oplogSelector.ts = {
        $gt: lastOplogEntry.ts
      }; // If there are any calls to callWhenProcessedLatest before any other
      // oplog entries show up, allow callWhenProcessedLatest to call its
      // callback immediately.

      self._lastProcessedTS = lastOplogEntry.ts;
    }

    var cursorDescription = new CursorDescription(OPLOG_COLLECTION, oplogSelector, {
      tailable: true
    }); // Start tailing the oplog.
    //
    // We restart the low-level oplog query every 30 seconds if we didn't get a
    // doc. This is a workaround for #8598: the Node Mongo driver has at least
    // one bug that can lead to query callbacks never getting called (even with
    // an error) when leadership failover occur.

    self._tailHandle = self._oplogTailConnection.tail(cursorDescription, function (doc) {
      self._entryQueue.push(doc);

      self._maybeStartWorker();
    }, TAIL_TIMEOUT);

    self._readyFuture.return();
  },
  _maybeStartWorker: function () {
    var self = this;
    if (self._workerActive) return;
    self._workerActive = true;
    Meteor.defer(function () {
      // May be called recursively in case of transactions.
      function handleDoc(doc) {
        if (doc.ns === "admin.$cmd") {
          if (doc.o.applyOps) {
            // This was a successful transaction, so we need to apply the
            // operations that were involved.
            let nextTimestamp = doc.ts;
            doc.o.applyOps.forEach(op => {
              // See https://github.com/meteor/meteor/issues/10420.
              if (!op.ts) {
                op.ts = nextTimestamp;
                nextTimestamp = nextTimestamp.add(Timestamp.ONE);
              }

              handleDoc(op);
            });
            return;
          }

          throw new Error("Unknown command " + EJSON.stringify(doc));
        }

        const trigger = {
          dropCollection: false,
          dropDatabase: false,
          op: doc
        };

        if (typeof doc.ns === "string" && doc.ns.startsWith(self._dbName + ".")) {
          trigger.collection = doc.ns.slice(self._dbName.length + 1);
        } // Is it a special command and the collection name is hidden
        // somewhere in operator?


        if (trigger.collection === "$cmd") {
          if (doc.o.dropDatabase) {
            delete trigger.collection;
            trigger.dropDatabase = true;
          } else if (_.has(doc.o, "drop")) {
            trigger.collection = doc.o.drop;
            trigger.dropCollection = true;
            trigger.id = null;
          } else {
            throw Error("Unknown command " + EJSON.stringify(doc));
          }
        } else {
          // All other ops have an id.
          trigger.id = idForOp(doc);
        }

        self._crossbar.fire(trigger);
      }

      try {
        while (!self._stopped && !self._entryQueue.isEmpty()) {
          // Are we too far behind? Just tell our observers that they need to
          // repoll, and drop our queue.
          if (self._entryQueue.length > TOO_FAR_BEHIND) {
            var lastEntry = self._entryQueue.pop();

            self._entryQueue.clear();

            self._onSkippedEntriesHook.each(function (callback) {
              callback();
              return true;
            }); // Free any waitUntilCaughtUp() calls that were waiting for us to
            // pass something that we just skipped.


            self._setLastProcessedTS(lastEntry.ts);

            continue;
          }

          const doc = self._entryQueue.shift(); // Fire trigger(s) for this doc.


          handleDoc(doc); // Now that we've processed this operation, process pending
          // sequencers.

          if (doc.ts) {
            self._setLastProcessedTS(doc.ts);
          } else {
            throw Error("oplog entry without ts: " + EJSON.stringify(doc));
          }
        }
      } finally {
        self._workerActive = false;
      }
    });
  },
  _setLastProcessedTS: function (ts) {
    var self = this;
    self._lastProcessedTS = ts;

    while (!_.isEmpty(self._catchingUpFutures) && self._catchingUpFutures[0].ts.lessThanOrEqual(self._lastProcessedTS)) {
      var sequencer = self._catchingUpFutures.shift();

      sequencer.future.return();
    }
  },
  //Methods used on tests to dinamically change TOO_FAR_BEHIND
  _defineTooFarBehind: function (value) {
    TOO_FAR_BEHIND = value;
  },
  _resetTooFarBehind: function () {
    TOO_FAR_BEHIND = process.env.METEOR_OPLOG_TOO_FAR_BEHIND || 2000;
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"observe_multiplex.js":function module(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/mongo/observe_multiplex.js                                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var Future = Npm.require('fibers/future');

ObserveMultiplexer = function (options) {
  var self = this;
  if (!options || !_.has(options, 'ordered')) throw Error("must specified ordered");
  Package['facts-base'] && Package['facts-base'].Facts.incrementServerFact("mongo-livedata", "observe-multiplexers", 1);
  self._ordered = options.ordered;

  self._onStop = options.onStop || function () {};

  self._queue = new Meteor._SynchronousQueue();
  self._handles = {};
  self._readyFuture = new Future();
  self._cache = new LocalCollection._CachingChangeObserver({
    ordered: options.ordered
  }); // Number of addHandleAndSendInitialAdds tasks scheduled but not yet
  // running. removeHandle uses this to know if it's time to call the onStop
  // callback.

  self._addHandleTasksScheduledButNotPerformed = 0;

  _.each(self.callbackNames(), function (callbackName) {
    self[callbackName] = function ()
    /* ... */
    {
      self._applyCallback(callbackName, _.toArray(arguments));
    };
  });
};

_.extend(ObserveMultiplexer.prototype, {
  addHandleAndSendInitialAdds: function (handle) {
    var self = this; // Check this before calling runTask (even though runTask does the same
    // check) so that we don't leak an ObserveMultiplexer on error by
    // incrementing _addHandleTasksScheduledButNotPerformed and never
    // decrementing it.

    if (!self._queue.safeToRunTask()) throw new Error("Can't call observeChanges from an observe callback on the same query");
    ++self._addHandleTasksScheduledButNotPerformed;
    Package['facts-base'] && Package['facts-base'].Facts.incrementServerFact("mongo-livedata", "observe-handles", 1);

    self._queue.runTask(function () {
      self._handles[handle._id] = handle; // Send out whatever adds we have so far (whether or not we the
      // multiplexer is ready).

      self._sendAdds(handle);

      --self._addHandleTasksScheduledButNotPerformed;
    }); // *outside* the task, since otherwise we'd deadlock


    self._readyFuture.wait();
  },
  // Remove an observe handle. If it was the last observe handle, call the
  // onStop callback; you cannot add any more observe handles after this.
  //
  // This is not synchronized with polls and handle additions: this means that
  // you can safely call it from within an observe callback, but it also means
  // that we have to be careful when we iterate over _handles.
  removeHandle: function (id) {
    var self = this; // This should not be possible: you can only call removeHandle by having
    // access to the ObserveHandle, which isn't returned to user code until the
    // multiplex is ready.

    if (!self._ready()) throw new Error("Can't remove handles until the multiplex is ready");
    delete self._handles[id];
    Package['facts-base'] && Package['facts-base'].Facts.incrementServerFact("mongo-livedata", "observe-handles", -1);

    if (_.isEmpty(self._handles) && self._addHandleTasksScheduledButNotPerformed === 0) {
      self._stop();
    }
  },
  _stop: function (options) {
    var self = this;
    options = options || {}; // It shouldn't be possible for us to stop when all our handles still
    // haven't been returned from observeChanges!

    if (!self._ready() && !options.fromQueryError) throw Error("surprising _stop: not ready"); // Call stop callback (which kills the underlying process which sends us
    // callbacks and removes us from the connection's dictionary).

    self._onStop();

    Package['facts-base'] && Package['facts-base'].Facts.incrementServerFact("mongo-livedata", "observe-multiplexers", -1); // Cause future addHandleAndSendInitialAdds calls to throw (but the onStop
    // callback should make our connection forget about us).

    self._handles = null;
  },
  // Allows all addHandleAndSendInitialAdds calls to return, once all preceding
  // adds have been processed. Does not block.
  ready: function () {
    var self = this;

    self._queue.queueTask(function () {
      if (self._ready()) throw Error("can't make ObserveMultiplex ready twice!");

      self._readyFuture.return();
    });
  },
  // If trying to execute the query results in an error, call this. This is
  // intended for permanent errors, not transient network errors that could be
  // fixed. It should only be called before ready(), because if you called ready
  // that meant that you managed to run the query once. It will stop this
  // ObserveMultiplex and cause addHandleAndSendInitialAdds calls (and thus
  // observeChanges calls) to throw the error.
  queryError: function (err) {
    var self = this;

    self._queue.runTask(function () {
      if (self._ready()) throw Error("can't claim query has an error after it worked!");

      self._stop({
        fromQueryError: true
      });

      self._readyFuture.throw(err);
    });
  },
  // Calls "cb" once the effects of all "ready", "addHandleAndSendInitialAdds"
  // and observe callbacks which came before this call have been propagated to
  // all handles. "ready" must have already been called on this multiplexer.
  onFlush: function (cb) {
    var self = this;

    self._queue.queueTask(function () {
      if (!self._ready()) throw Error("only call onFlush on a multiplexer that will be ready");
      cb();
    });
  },
  callbackNames: function () {
    var self = this;
    if (self._ordered) return ["addedBefore", "changed", "movedBefore", "removed"];else return ["added", "changed", "removed"];
  },
  _ready: function () {
    return this._readyFuture.isResolved();
  },
  _applyCallback: function (callbackName, args) {
    var self = this;

    self._queue.queueTask(function () {
      // If we stopped in the meantime, do nothing.
      if (!self._handles) return; // First, apply the change to the cache.
      // XXX We could make applyChange callbacks promise not to hang on to any
      // state from their arguments (assuming that their supplied callbacks
      // don't) and skip this clone. Currently 'changed' hangs on to state
      // though.

      self._cache.applyChange[callbackName].apply(null, EJSON.clone(args)); // If we haven't finished the initial adds, then we should only be getting
      // adds.


      if (!self._ready() && callbackName !== 'added' && callbackName !== 'addedBefore') {
        throw new Error("Got " + callbackName + " during initial adds");
      } // Now multiplex the callbacks out to all observe handles. It's OK if
      // these calls yield; since we're inside a task, no other use of our queue
      // can continue until these are done. (But we do have to be careful to not
      // use a handle that got removed, because removeHandle does not use the
      // queue; thus, we iterate over an array of keys that we control.)


      _.each(_.keys(self._handles), function (handleId) {
        var handle = self._handles && self._handles[handleId];
        if (!handle) return;
        var callback = handle['_' + callbackName]; // clone arguments so that callbacks can mutate their arguments

        callback && callback.apply(null, EJSON.clone(args));
      });
    });
  },
  // Sends initial adds to a handle. It should only be called from within a task
  // (the task that is processing the addHandleAndSendInitialAdds call). It
  // synchronously invokes the handle's added or addedBefore; there's no need to
  // flush the queue afterwards to ensure that the callbacks get out.
  _sendAdds: function (handle) {
    var self = this;
    if (self._queue.safeToRunTask()) throw Error("_sendAdds may only be called from within a task!");
    var add = self._ordered ? handle._addedBefore : handle._added;
    if (!add) return; // note: docs may be an _IdMap or an OrderedDict

    self._cache.docs.forEach(function (doc, id) {
      if (!_.has(self._handles, handle._id)) throw Error("handle got removed before sending initial adds!");
      var fields = EJSON.clone(doc);
      delete fields._id;
      if (self._ordered) add(id, fields, null); // we're going in order, so add at end
      else add(id, fields);
    });
  }
});

var nextObserveHandleId = 1;

ObserveHandle = function (multiplexer, callbacks) {
  var self = this; // The end user is only supposed to call stop().  The other fields are
  // accessible to the multiplexer, though.

  self._multiplexer = multiplexer;

  _.each(multiplexer.callbackNames(), function (name) {
    if (callbacks[name]) {
      self['_' + name] = callbacks[name];
    } else if (name === "addedBefore" && callbacks.added) {
      // Special case: if you specify "added" and "movedBefore", you get an
      // ordered observe where for some reason you don't get ordering data on
      // the adds.  I dunno, we wrote tests for it, there must have been a
      // reason.
      self._addedBefore = function (id, fields, before) {
        callbacks.added(id, fields);
      };
    }
  });

  self._stopped = false;
  self._id = nextObserveHandleId++;
};

ObserveHandle.prototype.stop = function () {
  var self = this;
  if (self._stopped) return;
  self._stopped = true;

  self._multiplexer.removeHandle(self._id);
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"doc_fetcher.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/mongo/doc_fetcher.js                                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  DocFetcher: () => DocFetcher
});

var Fiber = Npm.require('fibers');

class DocFetcher {
  constructor(mongoConnection) {
    this._mongoConnection = mongoConnection; // Map from op -> [callback]

    this._callbacksForOp = new Map();
  } // Fetches document "id" from collectionName, returning it or null if not
  // found.
  //
  // If you make multiple calls to fetch() with the same op reference,
  // DocFetcher may assume that they all return the same document. (It does
  // not check to see if collectionName/id match.)
  //
  // You may assume that callback is never called synchronously (and in fact
  // OplogObserveDriver does so).


  fetch(collectionName, id, op, callback) {
    const self = this;
    check(collectionName, String);
    check(op, Object); // If there's already an in-progress fetch for this cache key, yield until
    // it's done and return whatever it returns.

    if (self._callbacksForOp.has(op)) {
      self._callbacksForOp.get(op).push(callback);

      return;
    }

    const callbacks = [callback];

    self._callbacksForOp.set(op, callbacks);

    Fiber(function () {
      try {
        var doc = self._mongoConnection.findOne(collectionName, {
          _id: id
        }) || null; // Return doc to all relevant callbacks. Note that this array can
        // continue to grow during callback excecution.

        while (callbacks.length > 0) {
          // Clone the document so that the various calls to fetch don't return
          // objects that are intertwingled with each other. Clone before
          // popping the future, so that if clone throws, the error gets passed
          // to the next callback.
          callbacks.pop()(null, EJSON.clone(doc));
        }
      } catch (e) {
        while (callbacks.length > 0) {
          callbacks.pop()(e);
        }
      } finally {
        // XXX consider keeping the doc around for a period of time before
        // removing from the cache
        self._callbacksForOp.delete(op);
      }
    }).run();
  }

}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"polling_observe_driver.js":function module(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/mongo/polling_observe_driver.js                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var POLLING_THROTTLE_MS = +process.env.METEOR_POLLING_THROTTLE_MS || 50;
var POLLING_INTERVAL_MS = +process.env.METEOR_POLLING_INTERVAL_MS || 10 * 1000;

PollingObserveDriver = function (options) {
  var self = this;
  self._cursorDescription = options.cursorDescription;
  self._mongoHandle = options.mongoHandle;
  self._ordered = options.ordered;
  self._multiplexer = options.multiplexer;
  self._stopCallbacks = [];
  self._stopped = false;
  self._synchronousCursor = self._mongoHandle._createSynchronousCursor(self._cursorDescription); // previous results snapshot.  on each poll cycle, diffs against
  // results drives the callbacks.

  self._results = null; // The number of _pollMongo calls that have been added to self._taskQueue but
  // have not started running. Used to make sure we never schedule more than one
  // _pollMongo (other than possibly the one that is currently running). It's
  // also used by _suspendPolling to pretend there's a poll scheduled. Usually,
  // it's either 0 (for "no polls scheduled other than maybe one currently
  // running") or 1 (for "a poll scheduled that isn't running yet"), but it can
  // also be 2 if incremented by _suspendPolling.

  self._pollsScheduledButNotStarted = 0;
  self._pendingWrites = []; // people to notify when polling completes
  // Make sure to create a separately throttled function for each
  // PollingObserveDriver object.

  self._ensurePollIsScheduled = _.throttle(self._unthrottledEnsurePollIsScheduled, self._cursorDescription.options.pollingThrottleMs || POLLING_THROTTLE_MS
  /* ms */
  ); // XXX figure out if we still need a queue

  self._taskQueue = new Meteor._SynchronousQueue();
  var listenersHandle = listenAll(self._cursorDescription, function (notification) {
    // When someone does a transaction that might affect us, schedule a poll
    // of the database. If that transaction happens inside of a write fence,
    // block the fence until we've polled and notified observers.
    var fence = DDPServer._CurrentWriteFence.get();

    if (fence) self._pendingWrites.push(fence.beginWrite()); // Ensure a poll is scheduled... but if we already know that one is,
    // don't hit the throttled _ensurePollIsScheduled function (which might
    // lead to us calling it unnecessarily in <pollingThrottleMs> ms).

    if (self._pollsScheduledButNotStarted === 0) self._ensurePollIsScheduled();
  });

  self._stopCallbacks.push(function () {
    listenersHandle.stop();
  }); // every once and a while, poll even if we don't think we're dirty, for
  // eventual consistency with database writes from outside the Meteor
  // universe.
  //
  // For testing, there's an undocumented callback argument to observeChanges
  // which disables time-based polling and gets called at the beginning of each
  // poll.


  if (options._testOnlyPollCallback) {
    self._testOnlyPollCallback = options._testOnlyPollCallback;
  } else {
    var pollingInterval = self._cursorDescription.options.pollingIntervalMs || self._cursorDescription.options._pollingInterval || // COMPAT with 1.2
    POLLING_INTERVAL_MS;
    var intervalHandle = Meteor.setInterval(_.bind(self._ensurePollIsScheduled, self), pollingInterval);

    self._stopCallbacks.push(function () {
      Meteor.clearInterval(intervalHandle);
    });
  } // Make sure we actually poll soon!


  self._unthrottledEnsurePollIsScheduled();

  Package['facts-base'] && Package['facts-base'].Facts.incrementServerFact("mongo-livedata", "observe-drivers-polling", 1);
};

_.extend(PollingObserveDriver.prototype, {
  // This is always called through _.throttle (except once at startup).
  _unthrottledEnsurePollIsScheduled: function () {
    var self = this;
    if (self._pollsScheduledButNotStarted > 0) return;
    ++self._pollsScheduledButNotStarted;

    self._taskQueue.queueTask(function () {
      self._pollMongo();
    });
  },
  // test-only interface for controlling polling.
  //
  // _suspendPolling blocks until any currently running and scheduled polls are
  // done, and prevents any further polls from being scheduled. (new
  // ObserveHandles can be added and receive their initial added callbacks,
  // though.)
  //
  // _resumePolling immediately polls, and allows further polls to occur.
  _suspendPolling: function () {
    var self = this; // Pretend that there's another poll scheduled (which will prevent
    // _ensurePollIsScheduled from queueing any more polls).

    ++self._pollsScheduledButNotStarted; // Now block until all currently running or scheduled polls are done.

    self._taskQueue.runTask(function () {}); // Confirm that there is only one "poll" (the fake one we're pretending to
    // have) scheduled.


    if (self._pollsScheduledButNotStarted !== 1) throw new Error("_pollsScheduledButNotStarted is " + self._pollsScheduledButNotStarted);
  },
  _resumePolling: function () {
    var self = this; // We should be in the same state as in the end of _suspendPolling.

    if (self._pollsScheduledButNotStarted !== 1) throw new Error("_pollsScheduledButNotStarted is " + self._pollsScheduledButNotStarted); // Run a poll synchronously (which will counteract the
    // ++_pollsScheduledButNotStarted from _suspendPolling).

    self._taskQueue.runTask(function () {
      self._pollMongo();
    });
  },
  _pollMongo: function () {
    var self = this;
    --self._pollsScheduledButNotStarted;
    if (self._stopped) return;
    var first = false;
    var newResults;
    var oldResults = self._results;

    if (!oldResults) {
      first = true; // XXX maybe use OrderedDict instead?

      oldResults = self._ordered ? [] : new LocalCollection._IdMap();
    }

    self._testOnlyPollCallback && self._testOnlyPollCallback(); // Save the list of pending writes which this round will commit.

    var writesForCycle = self._pendingWrites;
    self._pendingWrites = []; // Get the new query results. (This yields.)

    try {
      newResults = self._synchronousCursor.getRawObjects(self._ordered);
    } catch (e) {
      if (first && typeof e.code === 'number') {
        // This is an error document sent to us by mongod, not a connection
        // error generated by the client. And we've never seen this query work
        // successfully. Probably it's a bad selector or something, so we should
        // NOT retry. Instead, we should halt the observe (which ends up calling
        // `stop` on us).
        self._multiplexer.queryError(new Error("Exception while polling query " + JSON.stringify(self._cursorDescription) + ": " + e.message));

        return;
      } // getRawObjects can throw if we're having trouble talking to the
      // database.  That's fine --- we will repoll later anyway. But we should
      // make sure not to lose track of this cycle's writes.
      // (It also can throw if there's just something invalid about this query;
      // unfortunately the ObserveDriver API doesn't provide a good way to
      // "cancel" the observe from the inside in this case.


      Array.prototype.push.apply(self._pendingWrites, writesForCycle);

      Meteor._debug("Exception while polling query " + JSON.stringify(self._cursorDescription), e);

      return;
    } // Run diffs.


    if (!self._stopped) {
      LocalCollection._diffQueryChanges(self._ordered, oldResults, newResults, self._multiplexer);
    } // Signals the multiplexer to allow all observeChanges calls that share this
    // multiplexer to return. (This happens asynchronously, via the
    // multiplexer's queue.)


    if (first) self._multiplexer.ready(); // Replace self._results atomically.  (This assignment is what makes `first`
    // stay through on the next cycle, so we've waited until after we've
    // committed to ready-ing the multiplexer.)

    self._results = newResults; // Once the ObserveMultiplexer has processed everything we've done in this
    // round, mark all the writes which existed before this call as
    // commmitted. (If new writes have shown up in the meantime, there'll
    // already be another _pollMongo task scheduled.)

    self._multiplexer.onFlush(function () {
      _.each(writesForCycle, function (w) {
        w.committed();
      });
    });
  },
  stop: function () {
    var self = this;
    self._stopped = true;

    _.each(self._stopCallbacks, function (c) {
      c();
    }); // Release any write fences that are waiting on us.


    _.each(self._pendingWrites, function (w) {
      w.committed();
    });

    Package['facts-base'] && Package['facts-base'].Facts.incrementServerFact("mongo-livedata", "observe-drivers-polling", -1);
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"oplog_observe_driver.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/mongo/oplog_observe_driver.js                                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let oplogV2V1Converter;
module.link("./oplog_v2_converter", {
  oplogV2V1Converter(v) {
    oplogV2V1Converter = v;
  }

}, 0);

var Future = Npm.require('fibers/future');

var PHASE = {
  QUERYING: "QUERYING",
  FETCHING: "FETCHING",
  STEADY: "STEADY"
}; // Exception thrown by _needToPollQuery which unrolls the stack up to the
// enclosing call to finishIfNeedToPollQuery.

var SwitchedToQuery = function () {};

var finishIfNeedToPollQuery = function (f) {
  return function () {
    try {
      f.apply(this, arguments);
    } catch (e) {
      if (!(e instanceof SwitchedToQuery)) throw e;
    }
  };
};

var currentId = 0; // OplogObserveDriver is an alternative to PollingObserveDriver which follows
// the Mongo operation log instead of just re-polling the query. It obeys the
// same simple interface: constructing it starts sending observeChanges
// callbacks (and a ready() invocation) to the ObserveMultiplexer, and you stop
// it by calling the stop() method.

OplogObserveDriver = function (options) {
  var self = this;
  self._usesOplog = true; // tests look at this

  self._id = currentId;
  currentId++;
  self._cursorDescription = options.cursorDescription;
  self._mongoHandle = options.mongoHandle;
  self._multiplexer = options.multiplexer;

  if (options.ordered) {
    throw Error("OplogObserveDriver only supports unordered observeChanges");
  }

  var sorter = options.sorter; // We don't support $near and other geo-queries so it's OK to initialize the
  // comparator only once in the constructor.

  var comparator = sorter && sorter.getComparator();

  if (options.cursorDescription.options.limit) {
    // There are several properties ordered driver implements:
    // - _limit is a positive number
    // - _comparator is a function-comparator by which the query is ordered
    // - _unpublishedBuffer is non-null Min/Max Heap,
    //                      the empty buffer in STEADY phase implies that the
    //                      everything that matches the queries selector fits
    //                      into published set.
    // - _published - Min Heap (also implements IdMap methods)
    var heapOptions = {
      IdMap: LocalCollection._IdMap
    };
    self._limit = self._cursorDescription.options.limit;
    self._comparator = comparator;
    self._sorter = sorter;
    self._unpublishedBuffer = new MinMaxHeap(comparator, heapOptions); // We need something that can find Max value in addition to IdMap interface

    self._published = new MaxHeap(comparator, heapOptions);
  } else {
    self._limit = 0;
    self._comparator = null;
    self._sorter = null;
    self._unpublishedBuffer = null;
    self._published = new LocalCollection._IdMap();
  } // Indicates if it is safe to insert a new document at the end of the buffer
  // for this query. i.e. it is known that there are no documents matching the
  // selector those are not in published or buffer.


  self._safeAppendToBuffer = false;
  self._stopped = false;
  self._stopHandles = [];
  Package['facts-base'] && Package['facts-base'].Facts.incrementServerFact("mongo-livedata", "observe-drivers-oplog", 1);

  self._registerPhaseChange(PHASE.QUERYING);

  self._matcher = options.matcher;
  var projection = self._cursorDescription.options.fields || {};
  self._projectionFn = LocalCollection._compileProjection(projection); // Projection function, result of combining important fields for selector and
  // existing fields projection

  self._sharedProjection = self._matcher.combineIntoProjection(projection);
  if (sorter) self._sharedProjection = sorter.combineIntoProjection(self._sharedProjection);
  self._sharedProjectionFn = LocalCollection._compileProjection(self._sharedProjection);
  self._needToFetch = new LocalCollection._IdMap();
  self._currentlyFetching = null;
  self._fetchGeneration = 0;
  self._requeryWhenDoneThisQuery = false;
  self._writesToCommitWhenWeReachSteady = []; // If the oplog handle tells us that it skipped some entries (because it got
  // behind, say), re-poll.

  self._stopHandles.push(self._mongoHandle._oplogHandle.onSkippedEntries(finishIfNeedToPollQuery(function () {
    self._needToPollQuery();
  })));

  forEachTrigger(self._cursorDescription, function (trigger) {
    self._stopHandles.push(self._mongoHandle._oplogHandle.onOplogEntry(trigger, function (notification) {
      Meteor._noYieldsAllowed(finishIfNeedToPollQuery(function () {
        var op = notification.op;

        if (notification.dropCollection || notification.dropDatabase) {
          // Note: this call is not allowed to block on anything (especially
          // on waiting for oplog entries to catch up) because that will block
          // onOplogEntry!
          self._needToPollQuery();
        } else {
          // All other operators should be handled depending on phase
          if (self._phase === PHASE.QUERYING) {
            self._handleOplogEntryQuerying(op);
          } else {
            self._handleOplogEntrySteadyOrFetching(op);
          }
        }
      }));
    }));
  }); // XXX ordering w.r.t. everything else?

  self._stopHandles.push(listenAll(self._cursorDescription, function (notification) {
    // If we're not in a pre-fire write fence, we don't have to do anything.
    var fence = DDPServer._CurrentWriteFence.get();

    if (!fence || fence.fired) return;

    if (fence._oplogObserveDrivers) {
      fence._oplogObserveDrivers[self._id] = self;
      return;
    }

    fence._oplogObserveDrivers = {};
    fence._oplogObserveDrivers[self._id] = self;
    fence.onBeforeFire(function () {
      var drivers = fence._oplogObserveDrivers;
      delete fence._oplogObserveDrivers; // This fence cannot fire until we've caught up to "this point" in the
      // oplog, and all observers made it back to the steady state.

      self._mongoHandle._oplogHandle.waitUntilCaughtUp();

      _.each(drivers, function (driver) {
        if (driver._stopped) return;
        var write = fence.beginWrite();

        if (driver._phase === PHASE.STEADY) {
          // Make sure that all of the callbacks have made it through the
          // multiplexer and been delivered to ObserveHandles before committing
          // writes.
          driver._multiplexer.onFlush(function () {
            write.committed();
          });
        } else {
          driver._writesToCommitWhenWeReachSteady.push(write);
        }
      });
    });
  })); // When Mongo fails over, we need to repoll the query, in case we processed an
  // oplog entry that got rolled back.


  self._stopHandles.push(self._mongoHandle._onFailover(finishIfNeedToPollQuery(function () {
    self._needToPollQuery();
  }))); // Give _observeChanges a chance to add the new ObserveHandle to our
  // multiplexer, so that the added calls get streamed.


  Meteor.defer(finishIfNeedToPollQuery(function () {
    self._runInitialQuery();
  }));
};

_.extend(OplogObserveDriver.prototype, {
  _addPublished: function (id, doc) {
    var self = this;

    Meteor._noYieldsAllowed(function () {
      var fields = _.clone(doc);

      delete fields._id;

      self._published.set(id, self._sharedProjectionFn(doc));

      self._multiplexer.added(id, self._projectionFn(fields)); // After adding this document, the published set might be overflowed
      // (exceeding capacity specified by limit). If so, push the maximum
      // element to the buffer, we might want to save it in memory to reduce the
      // amount of Mongo lookups in the future.


      if (self._limit && self._published.size() > self._limit) {
        // XXX in theory the size of published is no more than limit+1
        if (self._published.size() !== self._limit + 1) {
          throw new Error("After adding to published, " + (self._published.size() - self._limit) + " documents are overflowing the set");
        }

        var overflowingDocId = self._published.maxElementId();

        var overflowingDoc = self._published.get(overflowingDocId);

        if (EJSON.equals(overflowingDocId, id)) {
          throw new Error("The document just added is overflowing the published set");
        }

        self._published.remove(overflowingDocId);

        self._multiplexer.removed(overflowingDocId);

        self._addBuffered(overflowingDocId, overflowingDoc);
      }
    });
  },
  _removePublished: function (id) {
    var self = this;

    Meteor._noYieldsAllowed(function () {
      self._published.remove(id);

      self._multiplexer.removed(id);

      if (!self._limit || self._published.size() === self._limit) return;
      if (self._published.size() > self._limit) throw Error("self._published got too big"); // OK, we are publishing less than the limit. Maybe we should look in the
      // buffer to find the next element past what we were publishing before.

      if (!self._unpublishedBuffer.empty()) {
        // There's something in the buffer; move the first thing in it to
        // _published.
        var newDocId = self._unpublishedBuffer.minElementId();

        var newDoc = self._unpublishedBuffer.get(newDocId);

        self._removeBuffered(newDocId);

        self._addPublished(newDocId, newDoc);

        return;
      } // There's nothing in the buffer.  This could mean one of a few things.
      // (a) We could be in the middle of re-running the query (specifically, we
      // could be in _publishNewResults). In that case, _unpublishedBuffer is
      // empty because we clear it at the beginning of _publishNewResults. In
      // this case, our caller already knows the entire answer to the query and
      // we don't need to do anything fancy here.  Just return.


      if (self._phase === PHASE.QUERYING) return; // (b) We're pretty confident that the union of _published and
      // _unpublishedBuffer contain all documents that match selector. Because
      // _unpublishedBuffer is empty, that means we're confident that _published
      // contains all documents that match selector. So we have nothing to do.

      if (self._safeAppendToBuffer) return; // (c) Maybe there are other documents out there that should be in our
      // buffer. But in that case, when we emptied _unpublishedBuffer in
      // _removeBuffered, we should have called _needToPollQuery, which will
      // either put something in _unpublishedBuffer or set _safeAppendToBuffer
      // (or both), and it will put us in QUERYING for that whole time. So in
      // fact, we shouldn't be able to get here.

      throw new Error("Buffer inexplicably empty");
    });
  },
  _changePublished: function (id, oldDoc, newDoc) {
    var self = this;

    Meteor._noYieldsAllowed(function () {
      self._published.set(id, self._sharedProjectionFn(newDoc));

      var projectedNew = self._projectionFn(newDoc);

      var projectedOld = self._projectionFn(oldDoc);

      var changed = DiffSequence.makeChangedFields(projectedNew, projectedOld);
      if (!_.isEmpty(changed)) self._multiplexer.changed(id, changed);
    });
  },
  _addBuffered: function (id, doc) {
    var self = this;

    Meteor._noYieldsAllowed(function () {
      self._unpublishedBuffer.set(id, self._sharedProjectionFn(doc)); // If something is overflowing the buffer, we just remove it from cache


      if (self._unpublishedBuffer.size() > self._limit) {
        var maxBufferedId = self._unpublishedBuffer.maxElementId();

        self._unpublishedBuffer.remove(maxBufferedId); // Since something matching is removed from cache (both published set and
        // buffer), set flag to false


        self._safeAppendToBuffer = false;
      }
    });
  },
  // Is called either to remove the doc completely from matching set or to move
  // it to the published set later.
  _removeBuffered: function (id) {
    var self = this;

    Meteor._noYieldsAllowed(function () {
      self._unpublishedBuffer.remove(id); // To keep the contract "buffer is never empty in STEADY phase unless the
      // everything matching fits into published" true, we poll everything as
      // soon as we see the buffer becoming empty.


      if (!self._unpublishedBuffer.size() && !self._safeAppendToBuffer) self._needToPollQuery();
    });
  },
  // Called when a document has joined the "Matching" results set.
  // Takes responsibility of keeping _unpublishedBuffer in sync with _published
  // and the effect of limit enforced.
  _addMatching: function (doc) {
    var self = this;

    Meteor._noYieldsAllowed(function () {
      var id = doc._id;
      if (self._published.has(id)) throw Error("tried to add something already published " + id);
      if (self._limit && self._unpublishedBuffer.has(id)) throw Error("tried to add something already existed in buffer " + id);
      var limit = self._limit;
      var comparator = self._comparator;
      var maxPublished = limit && self._published.size() > 0 ? self._published.get(self._published.maxElementId()) : null;
      var maxBuffered = limit && self._unpublishedBuffer.size() > 0 ? self._unpublishedBuffer.get(self._unpublishedBuffer.maxElementId()) : null; // The query is unlimited or didn't publish enough documents yet or the
      // new document would fit into published set pushing the maximum element
      // out, then we need to publish the doc.

      var toPublish = !limit || self._published.size() < limit || comparator(doc, maxPublished) < 0; // Otherwise we might need to buffer it (only in case of limited query).
      // Buffering is allowed if the buffer is not filled up yet and all
      // matching docs are either in the published set or in the buffer.

      var canAppendToBuffer = !toPublish && self._safeAppendToBuffer && self._unpublishedBuffer.size() < limit; // Or if it is small enough to be safely inserted to the middle or the
      // beginning of the buffer.

      var canInsertIntoBuffer = !toPublish && maxBuffered && comparator(doc, maxBuffered) <= 0;
      var toBuffer = canAppendToBuffer || canInsertIntoBuffer;

      if (toPublish) {
        self._addPublished(id, doc);
      } else if (toBuffer) {
        self._addBuffered(id, doc);
      } else {
        // dropping it and not saving to the cache
        self._safeAppendToBuffer = false;
      }
    });
  },
  // Called when a document leaves the "Matching" results set.
  // Takes responsibility of keeping _unpublishedBuffer in sync with _published
  // and the effect of limit enforced.
  _removeMatching: function (id) {
    var self = this;

    Meteor._noYieldsAllowed(function () {
      if (!self._published.has(id) && !self._limit) throw Error("tried to remove something matching but not cached " + id);

      if (self._published.has(id)) {
        self._removePublished(id);
      } else if (self._unpublishedBuffer.has(id)) {
        self._removeBuffered(id);
      }
    });
  },
  _handleDoc: function (id, newDoc) {
    var self = this;

    Meteor._noYieldsAllowed(function () {
      var matchesNow = newDoc && self._matcher.documentMatches(newDoc).result;

      var publishedBefore = self._published.has(id);

      var bufferedBefore = self._limit && self._unpublishedBuffer.has(id);

      var cachedBefore = publishedBefore || bufferedBefore;

      if (matchesNow && !cachedBefore) {
        self._addMatching(newDoc);
      } else if (cachedBefore && !matchesNow) {
        self._removeMatching(id);
      } else if (cachedBefore && matchesNow) {
        var oldDoc = self._published.get(id);

        var comparator = self._comparator;

        var minBuffered = self._limit && self._unpublishedBuffer.size() && self._unpublishedBuffer.get(self._unpublishedBuffer.minElementId());

        var maxBuffered;

        if (publishedBefore) {
          // Unlimited case where the document stays in published once it
          // matches or the case when we don't have enough matching docs to
          // publish or the changed but matching doc will stay in published
          // anyways.
          //
          // XXX: We rely on the emptiness of buffer. Be sure to maintain the
          // fact that buffer can't be empty if there are matching documents not
          // published. Notably, we don't want to schedule repoll and continue
          // relying on this property.
          var staysInPublished = !self._limit || self._unpublishedBuffer.size() === 0 || comparator(newDoc, minBuffered) <= 0;

          if (staysInPublished) {
            self._changePublished(id, oldDoc, newDoc);
          } else {
            // after the change doc doesn't stay in the published, remove it
            self._removePublished(id); // but it can move into buffered now, check it


            maxBuffered = self._unpublishedBuffer.get(self._unpublishedBuffer.maxElementId());
            var toBuffer = self._safeAppendToBuffer || maxBuffered && comparator(newDoc, maxBuffered) <= 0;

            if (toBuffer) {
              self._addBuffered(id, newDoc);
            } else {
              // Throw away from both published set and buffer
              self._safeAppendToBuffer = false;
            }
          }
        } else if (bufferedBefore) {
          oldDoc = self._unpublishedBuffer.get(id); // remove the old version manually instead of using _removeBuffered so
          // we don't trigger the querying immediately.  if we end this block
          // with the buffer empty, we will need to trigger the query poll
          // manually too.

          self._unpublishedBuffer.remove(id);

          var maxPublished = self._published.get(self._published.maxElementId());

          maxBuffered = self._unpublishedBuffer.size() && self._unpublishedBuffer.get(self._unpublishedBuffer.maxElementId()); // the buffered doc was updated, it could move to published

          var toPublish = comparator(newDoc, maxPublished) < 0; // or stays in buffer even after the change

          var staysInBuffer = !toPublish && self._safeAppendToBuffer || !toPublish && maxBuffered && comparator(newDoc, maxBuffered) <= 0;

          if (toPublish) {
            self._addPublished(id, newDoc);
          } else if (staysInBuffer) {
            // stays in buffer but changes
            self._unpublishedBuffer.set(id, newDoc);
          } else {
            // Throw away from both published set and buffer
            self._safeAppendToBuffer = false; // Normally this check would have been done in _removeBuffered but
            // we didn't use it, so we need to do it ourself now.

            if (!self._unpublishedBuffer.size()) {
              self._needToPollQuery();
            }
          }
        } else {
          throw new Error("cachedBefore implies either of publishedBefore or bufferedBefore is true.");
        }
      }
    });
  },
  _fetchModifiedDocuments: function () {
    var self = this;

    Meteor._noYieldsAllowed(function () {
      self._registerPhaseChange(PHASE.FETCHING); // Defer, because nothing called from the oplog entry handler may yield,
      // but fetch() yields.


      Meteor.defer(finishIfNeedToPollQuery(function () {
        while (!self._stopped && !self._needToFetch.empty()) {
          if (self._phase === PHASE.QUERYING) {
            // While fetching, we decided to go into QUERYING mode, and then we
            // saw another oplog entry, so _needToFetch is not empty. But we
            // shouldn't fetch these documents until AFTER the query is done.
            break;
          } // Being in steady phase here would be surprising.


          if (self._phase !== PHASE.FETCHING) throw new Error("phase in fetchModifiedDocuments: " + self._phase);
          self._currentlyFetching = self._needToFetch;
          var thisGeneration = ++self._fetchGeneration;
          self._needToFetch = new LocalCollection._IdMap();
          var waiting = 0;
          var fut = new Future(); // This loop is safe, because _currentlyFetching will not be updated
          // during this loop (in fact, it is never mutated).

          self._currentlyFetching.forEach(function (op, id) {
            waiting++;

            self._mongoHandle._docFetcher.fetch(self._cursorDescription.collectionName, id, op, finishIfNeedToPollQuery(function (err, doc) {
              try {
                if (err) {
                  Meteor._debug("Got exception while fetching documents", err); // If we get an error from the fetcher (eg, trouble
                  // connecting to Mongo), let's just abandon the fetch phase
                  // altogether and fall back to polling. It's not like we're
                  // getting live updates anyway.


                  if (self._phase !== PHASE.QUERYING) {
                    self._needToPollQuery();
                  }
                } else if (!self._stopped && self._phase === PHASE.FETCHING && self._fetchGeneration === thisGeneration) {
                  // We re-check the generation in case we've had an explicit
                  // _pollQuery call (eg, in another fiber) which should
                  // effectively cancel this round of fetches.  (_pollQuery
                  // increments the generation.)
                  self._handleDoc(id, doc);
                }
              } finally {
                waiting--; // Because fetch() never calls its callback synchronously,
                // this is safe (ie, we won't call fut.return() before the
                // forEach is done).

                if (waiting === 0) fut.return();
              }
            }));
          });

          fut.wait(); // Exit now if we've had a _pollQuery call (here or in another fiber).

          if (self._phase === PHASE.QUERYING) return;
          self._currentlyFetching = null;
        } // We're done fetching, so we can be steady, unless we've had a
        // _pollQuery call (here or in another fiber).


        if (self._phase !== PHASE.QUERYING) self._beSteady();
      }));
    });
  },
  _beSteady: function () {
    var self = this;

    Meteor._noYieldsAllowed(function () {
      self._registerPhaseChange(PHASE.STEADY);

      var writes = self._writesToCommitWhenWeReachSteady;
      self._writesToCommitWhenWeReachSteady = [];

      self._multiplexer.onFlush(function () {
        _.each(writes, function (w) {
          w.committed();
        });
      });
    });
  },
  _handleOplogEntryQuerying: function (op) {
    var self = this;

    Meteor._noYieldsAllowed(function () {
      self._needToFetch.set(idForOp(op), op);
    });
  },
  _handleOplogEntrySteadyOrFetching: function (op) {
    var self = this;

    Meteor._noYieldsAllowed(function () {
      var id = idForOp(op); // If we're already fetching this one, or about to, we can't optimize;
      // make sure that we fetch it again if necessary.

      if (self._phase === PHASE.FETCHING && (self._currentlyFetching && self._currentlyFetching.has(id) || self._needToFetch.has(id))) {
        self._needToFetch.set(id, op);

        return;
      }

      if (op.op === 'd') {
        if (self._published.has(id) || self._limit && self._unpublishedBuffer.has(id)) self._removeMatching(id);
      } else if (op.op === 'i') {
        if (self._published.has(id)) throw new Error("insert found for already-existing ID in published");
        if (self._unpublishedBuffer && self._unpublishedBuffer.has(id)) throw new Error("insert found for already-existing ID in buffer"); // XXX what if selector yields?  for now it can't but later it could
        // have $where

        if (self._matcher.documentMatches(op.o).result) self._addMatching(op.o);
      } else if (op.op === 'u') {
        // we are mapping the new oplog format on mongo 5
        // to what we know better, $set
        op.o = oplogV2V1Converter(op.o); // Is this a modifier ($set/$unset, which may require us to poll the
        // database to figure out if the whole document matches the selector) or
        // a replacement (in which case we can just directly re-evaluate the
        // selector)?
        // oplog format has changed on mongodb 5, we have to support both now
        // diff is the format in Mongo 5+ (oplog v2)

        var isReplace = !_.has(op.o, '$set') && !_.has(op.o, 'diff') && !_.has(op.o, '$unset'); // If this modifier modifies something inside an EJSON custom type (ie,
        // anything with EJSON$), then we can't try to use
        // LocalCollection._modify, since that just mutates the EJSON encoding,
        // not the actual object.

        var canDirectlyModifyDoc = !isReplace && modifierCanBeDirectlyApplied(op.o);

        var publishedBefore = self._published.has(id);

        var bufferedBefore = self._limit && self._unpublishedBuffer.has(id);

        if (isReplace) {
          self._handleDoc(id, _.extend({
            _id: id
          }, op.o));
        } else if ((publishedBefore || bufferedBefore) && canDirectlyModifyDoc) {
          // Oh great, we actually know what the document is, so we can apply
          // this directly.
          var newDoc = self._published.has(id) ? self._published.get(id) : self._unpublishedBuffer.get(id);
          newDoc = EJSON.clone(newDoc);
          newDoc._id = id;

          try {
            LocalCollection._modify(newDoc, op.o);
          } catch (e) {
            if (e.name !== "MinimongoError") throw e; // We didn't understand the modifier.  Re-fetch.

            self._needToFetch.set(id, op);

            if (self._phase === PHASE.STEADY) {
              self._fetchModifiedDocuments();
            }

            return;
          }

          self._handleDoc(id, self._sharedProjectionFn(newDoc));
        } else if (!canDirectlyModifyDoc || self._matcher.canBecomeTrueByModifier(op.o) || self._sorter && self._sorter.affectedByModifier(op.o)) {
          self._needToFetch.set(id, op);

          if (self._phase === PHASE.STEADY) self._fetchModifiedDocuments();
        }
      } else {
        throw Error("XXX SURPRISING OPERATION: " + op);
      }
    });
  },
  // Yields!
  _runInitialQuery: function () {
    var self = this;
    if (self._stopped) throw new Error("oplog stopped surprisingly early");

    self._runQuery({
      initial: true
    }); // yields


    if (self._stopped) return; // can happen on queryError
    // Allow observeChanges calls to return. (After this, it's possible for
    // stop() to be called.)

    self._multiplexer.ready();

    self._doneQuerying(); // yields

  },
  // In various circumstances, we may just want to stop processing the oplog and
  // re-run the initial query, just as if we were a PollingObserveDriver.
  //
  // This function may not block, because it is called from an oplog entry
  // handler.
  //
  // XXX We should call this when we detect that we've been in FETCHING for "too
  // long".
  //
  // XXX We should call this when we detect Mongo failover (since that might
  // mean that some of the oplog entries we have processed have been rolled
  // back). The Node Mongo driver is in the middle of a bunch of huge
  // refactorings, including the way that it notifies you when primary
  // changes. Will put off implementing this until driver 1.4 is out.
  _pollQuery: function () {
    var self = this;

    Meteor._noYieldsAllowed(function () {
      if (self._stopped) return; // Yay, we get to forget about all the things we thought we had to fetch.

      self._needToFetch = new LocalCollection._IdMap();
      self._currentlyFetching = null;
      ++self._fetchGeneration; // ignore any in-flight fetches

      self._registerPhaseChange(PHASE.QUERYING); // Defer so that we don't yield.  We don't need finishIfNeedToPollQuery
      // here because SwitchedToQuery is not thrown in QUERYING mode.


      Meteor.defer(function () {
        self._runQuery();

        self._doneQuerying();
      });
    });
  },
  // Yields!
  _runQuery: function (options) {
    var self = this;
    options = options || {};
    var newResults, newBuffer; // This while loop is just to retry failures.

    while (true) {
      // If we've been stopped, we don't have to run anything any more.
      if (self._stopped) return;
      newResults = new LocalCollection._IdMap();
      newBuffer = new LocalCollection._IdMap(); // Query 2x documents as the half excluded from the original query will go
      // into unpublished buffer to reduce additional Mongo lookups in cases
      // when documents are removed from the published set and need a
      // replacement.
      // XXX needs more thought on non-zero skip
      // XXX 2 is a "magic number" meaning there is an extra chunk of docs for
      // buffer if such is needed.

      var cursor = self._cursorForQuery({
        limit: self._limit * 2
      });

      try {
        cursor.forEach(function (doc, i) {
          // yields
          if (!self._limit || i < self._limit) {
            newResults.set(doc._id, doc);
          } else {
            newBuffer.set(doc._id, doc);
          }
        });
        break;
      } catch (e) {
        if (options.initial && typeof e.code === 'number') {
          // This is an error document sent to us by mongod, not a connection
          // error generated by the client. And we've never seen this query work
          // successfully. Probably it's a bad selector or something, so we
          // should NOT retry. Instead, we should halt the observe (which ends
          // up calling `stop` on us).
          self._multiplexer.queryError(e);

          return;
        } // During failover (eg) if we get an exception we should log and retry
        // instead of crashing.


        Meteor._debug("Got exception while polling query", e);

        Meteor._sleepForMs(100);
      }
    }

    if (self._stopped) return;

    self._publishNewResults(newResults, newBuffer);
  },
  // Transitions to QUERYING and runs another query, or (if already in QUERYING)
  // ensures that we will query again later.
  //
  // This function may not block, because it is called from an oplog entry
  // handler. However, if we were not already in the QUERYING phase, it throws
  // an exception that is caught by the closest surrounding
  // finishIfNeedToPollQuery call; this ensures that we don't continue running
  // close that was designed for another phase inside PHASE.QUERYING.
  //
  // (It's also necessary whenever logic in this file yields to check that other
  // phases haven't put us into QUERYING mode, though; eg,
  // _fetchModifiedDocuments does this.)
  _needToPollQuery: function () {
    var self = this;

    Meteor._noYieldsAllowed(function () {
      if (self._stopped) return; // If we're not already in the middle of a query, we can query now
      // (possibly pausing FETCHING).

      if (self._phase !== PHASE.QUERYING) {
        self._pollQuery();

        throw new SwitchedToQuery();
      } // We're currently in QUERYING. Set a flag to ensure that we run another
      // query when we're done.


      self._requeryWhenDoneThisQuery = true;
    });
  },
  // Yields!
  _doneQuerying: function () {
    var self = this;
    if (self._stopped) return;

    self._mongoHandle._oplogHandle.waitUntilCaughtUp(); // yields


    if (self._stopped) return;
    if (self._phase !== PHASE.QUERYING) throw Error("Phase unexpectedly " + self._phase);

    Meteor._noYieldsAllowed(function () {
      if (self._requeryWhenDoneThisQuery) {
        self._requeryWhenDoneThisQuery = false;

        self._pollQuery();
      } else if (self._needToFetch.empty()) {
        self._beSteady();
      } else {
        self._fetchModifiedDocuments();
      }
    });
  },
  _cursorForQuery: function (optionsOverwrite) {
    var self = this;
    return Meteor._noYieldsAllowed(function () {
      // The query we run is almost the same as the cursor we are observing,
      // with a few changes. We need to read all the fields that are relevant to
      // the selector, not just the fields we are going to publish (that's the
      // "shared" projection). And we don't want to apply any transform in the
      // cursor, because observeChanges shouldn't use the transform.
      var options = _.clone(self._cursorDescription.options); // Allow the caller to modify the options. Useful to specify different
      // skip and limit values.


      _.extend(options, optionsOverwrite);

      options.fields = self._sharedProjection;
      delete options.transform; // We are NOT deep cloning fields or selector here, which should be OK.

      var description = new CursorDescription(self._cursorDescription.collectionName, self._cursorDescription.selector, options);
      return new Cursor(self._mongoHandle, description);
    });
  },
  // Replace self._published with newResults (both are IdMaps), invoking observe
  // callbacks on the multiplexer.
  // Replace self._unpublishedBuffer with newBuffer.
  //
  // XXX This is very similar to LocalCollection._diffQueryUnorderedChanges. We
  // should really: (a) Unify IdMap and OrderedDict into Unordered/OrderedDict
  // (b) Rewrite diff.js to use these classes instead of arrays and objects.
  _publishNewResults: function (newResults, newBuffer) {
    var self = this;

    Meteor._noYieldsAllowed(function () {
      // If the query is limited and there is a buffer, shut down so it doesn't
      // stay in a way.
      if (self._limit) {
        self._unpublishedBuffer.clear();
      } // First remove anything that's gone. Be careful not to modify
      // self._published while iterating over it.


      var idsToRemove = [];

      self._published.forEach(function (doc, id) {
        if (!newResults.has(id)) idsToRemove.push(id);
      });

      _.each(idsToRemove, function (id) {
        self._removePublished(id);
      }); // Now do adds and changes.
      // If self has a buffer and limit, the new fetched result will be
      // limited correctly as the query has sort specifier.


      newResults.forEach(function (doc, id) {
        self._handleDoc(id, doc);
      }); // Sanity-check that everything we tried to put into _published ended up
      // there.
      // XXX if this is slow, remove it later

      if (self._published.size() !== newResults.size()) {
        console.error('The Mongo server and the Meteor query disagree on how ' + 'many documents match your query. Cursor description: ', self._cursorDescription);
        throw Error("The Mongo server and the Meteor query disagree on how " + "many documents match your query. Maybe it is hitting a Mongo " + "edge case? The query is: " + EJSON.stringify(self._cursorDescription.selector));
      }

      self._published.forEach(function (doc, id) {
        if (!newResults.has(id)) throw Error("_published has a doc that newResults doesn't; " + id);
      }); // Finally, replace the buffer


      newBuffer.forEach(function (doc, id) {
        self._addBuffered(id, doc);
      });
      self._safeAppendToBuffer = newBuffer.size() < self._limit;
    });
  },
  // This stop function is invoked from the onStop of the ObserveMultiplexer, so
  // it shouldn't actually be possible to call it until the multiplexer is
  // ready.
  //
  // It's important to check self._stopped after every call in this file that
  // can yield!
  stop: function () {
    var self = this;
    if (self._stopped) return;
    self._stopped = true;

    _.each(self._stopHandles, function (handle) {
      handle.stop();
    }); // Note: we *don't* use multiplexer.onFlush here because this stop
    // callback is actually invoked by the multiplexer itself when it has
    // determined that there are no handles left. So nothing is actually going
    // to get flushed (and it's probably not valid to call methods on the
    // dying multiplexer).


    _.each(self._writesToCommitWhenWeReachSteady, function (w) {
      w.committed(); // maybe yields?
    });

    self._writesToCommitWhenWeReachSteady = null; // Proactively drop references to potentially big things.

    self._published = null;
    self._unpublishedBuffer = null;
    self._needToFetch = null;
    self._currentlyFetching = null;
    self._oplogEntryHandle = null;
    self._listenersHandle = null;
    Package['facts-base'] && Package['facts-base'].Facts.incrementServerFact("mongo-livedata", "observe-drivers-oplog", -1);
  },
  _registerPhaseChange: function (phase) {
    var self = this;

    Meteor._noYieldsAllowed(function () {
      var now = new Date();

      if (self._phase) {
        var timeDiff = now - self._phaseStartTime;
        Package['facts-base'] && Package['facts-base'].Facts.incrementServerFact("mongo-livedata", "time-spent-in-" + self._phase + "-phase", timeDiff);
      }

      self._phase = phase;
      self._phaseStartTime = now;
    });
  }
}); // Does our oplog tailing code support this cursor? For now, we are being very
// conservative and allowing only simple queries with simple options.
// (This is a "static method".)


OplogObserveDriver.cursorSupported = function (cursorDescription, matcher) {
  // First, check the options.
  var options = cursorDescription.options; // Did the user say no explicitly?
  // underscored version of the option is COMPAT with 1.2

  if (options.disableOplog || options._disableOplog) return false; // skip is not supported: to support it we would need to keep track of all
  // "skipped" documents or at least their ids.
  // limit w/o a sort specifier is not supported: current implementation needs a
  // deterministic way to order documents.

  if (options.skip || options.limit && !options.sort) return false; // If a fields projection option is given check if it is supported by
  // minimongo (some operators are not supported).

  if (options.fields) {
    try {
      LocalCollection._checkSupportedProjection(options.fields);
    } catch (e) {
      if (e.name === "MinimongoError") {
        return false;
      } else {
        throw e;
      }
    }
  } // We don't allow the following selectors:
  //   - $where (not confident that we provide the same JS environment
  //             as Mongo, and can yield!)
  //   - $near (has "interesting" properties in MongoDB, like the possibility
  //            of returning an ID multiple times, though even polling maybe
  //            have a bug there)
  //           XXX: once we support it, we would need to think more on how we
  //           initialize the comparators when we create the driver.


  return !matcher.hasWhere() && !matcher.hasGeoQuery();
};

var modifierCanBeDirectlyApplied = function (modifier) {
  return _.all(modifier, function (fields, operation) {
    return _.all(fields, function (value, field) {
      return !/EJSON\$/.test(field);
    });
  });
};

MongoInternals.OplogObserveDriver = OplogObserveDriver;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"oplog_v2_converter.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/mongo/oplog_v2_converter.js                                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  oplogV2V1Converter: () => oplogV2V1Converter
});

function join(prefix, key) {
  return prefix ? "".concat(prefix, ".").concat(key) : key;
}

const arrayOperatorKeyRegex = /^(a|[su]\d+)$/;

function isArrayOperatorKey(field) {
  return arrayOperatorKeyRegex.test(field);
}

function isArrayOperator(operator) {
  return operator.a === true && Object.keys(operator).every(isArrayOperatorKey);
}

function flattenObjectInto(target, source, prefix) {
  if (Array.isArray(source) || typeof source !== 'object' || source === null || source instanceof Mongo.ObjectID) {
    target[prefix] = source;
  } else {
    const entries = Object.entries(source);

    if (entries.length) {
      entries.forEach((_ref) => {
        let [key, value] = _ref;
        flattenObjectInto(target, value, join(prefix, key));
      });
    } else {
      target[prefix] = source;
    }
  }
}

const logDebugMessages = !!process.env.OPLOG_CONVERTER_DEBUG;

function convertOplogDiff(oplogEntry, diff, prefix) {
  if (logDebugMessages) {
    console.log("convertOplogDiff(".concat(JSON.stringify(oplogEntry), ", ").concat(JSON.stringify(diff), ", ").concat(JSON.stringify(prefix), ")"));
  }

  Object.entries(diff).forEach((_ref2) => {
    let [diffKey, value] = _ref2;

    if (diffKey === 'd') {
      // Handle `$unset`s.
      if (oplogEntry.$unset === null || oplogEntry.$unset === undefined) {
        oplogEntry.$unset = {};
      }

      Object.keys(value).forEach(key => {
        oplogEntry.$unset[join(prefix, key)] = true;
      });
    } else if (diffKey === 'i') {
      // Handle (potentially) nested `$set`s.
      if (oplogEntry.$set === null || oplogEntry.$set === undefined) {
        oplogEntry.$set = {};
      }

      flattenObjectInto(oplogEntry.$set, value, prefix);
    } else if (diffKey === 'u') {
      // Handle flat `$set`s.
      if (oplogEntry.$set === null || oplogEntry.$set === undefined) {
        oplogEntry.$set = {};
      }

      Object.entries(value).forEach((_ref3) => {
        let [key, value] = _ref3;
        oplogEntry.$set[join(prefix, key)] = value;
      });
    } else {
      // Handle s-fields.
      const key = diffKey.slice(1);

      if (isArrayOperator(value)) {
        // Array operator.
        Object.entries(value).forEach((_ref4) => {
          let [position, value] = _ref4;

          if (position === 'a') {
            return;
          }

          const positionKey = join(join(prefix, key), position.slice(1));

          if (position[0] === 's') {
            convertOplogDiff(oplogEntry, value, positionKey);
          } else if (value === null) {
            if (oplogEntry.$unset === null || oplogEntry.$unset === undefined) {
              oplogEntry.$unset = {};
            }

            oplogEntry.$unset[positionKey] = true;
          } else {
            if (oplogEntry.$set === null || oplogEntry.$set === undefined) {
              oplogEntry.$set = {};
            }

            oplogEntry.$set[positionKey] = value;
          }
        });
      } else if (key) {
        // Nested object.
        convertOplogDiff(oplogEntry, value, join(prefix, key));
      }
    }
  });
}

function oplogV2V1Converter(oplogEntry) {
  // Pass-through v1 and (probably) invalid entries.
  if (oplogEntry.$v !== 2 || !oplogEntry.diff) {
    return oplogEntry;
  }

  const convertedOplogEntry = {
    $v: 2
  };
  convertOplogDiff(convertedOplogEntry, oplogEntry.diff, '');
  return convertedOplogEntry;
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"local_collection_driver.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/mongo/local_collection_driver.js                                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  LocalCollectionDriver: () => LocalCollectionDriver
});
const LocalCollectionDriver = new class LocalCollectionDriver {
  constructor() {
    this.noConnCollections = Object.create(null);
  }

  open(name, conn) {
    if (!name) {
      return new LocalCollection();
    }

    if (!conn) {
      return ensureCollection(name, this.noConnCollections);
    }

    if (!conn._mongo_livedata_collections) {
      conn._mongo_livedata_collections = Object.create(null);
    } // XXX is there a way to keep track of a connection's collections without
    // dangling it off the connection object?


    return ensureCollection(name, conn._mongo_livedata_collections);
  }

}();

function ensureCollection(name, collections) {
  return name in collections ? collections[name] : collections[name] = new LocalCollection(name);
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"remote_collection_driver.js":function module(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/mongo/remote_collection_driver.js                                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
MongoInternals.RemoteCollectionDriver = function (mongo_url, options) {
  var self = this;
  self.mongo = new MongoConnection(mongo_url, options);
};

_.extend(MongoInternals.RemoteCollectionDriver.prototype, {
  open: function (name) {
    var self = this;
    var ret = {};

    _.each(['find', 'findOne', 'insert', 'update', 'upsert', 'remove', '_ensureIndex', '_dropIndex', '_createCappedCollection', 'dropCollection', 'rawCollection'], function (m) {
      ret[m] = _.bind(self.mongo[m], self.mongo, name);
    });

    return ret;
  }
}); // Create the singleton RemoteCollectionDriver only on demand, so we
// only require Mongo configuration if it's actually used (eg, not if
// you're only trying to receive data from a remote DDP server.)


MongoInternals.defaultRemoteCollectionDriver = _.once(function () {
  var connectionOptions = {};
  var mongoUrl = process.env.MONGO_URL;

  if (process.env.MONGO_OPLOG_URL) {
    connectionOptions.oplogUrl = process.env.MONGO_OPLOG_URL;
  }

  if (!mongoUrl) throw new Error("MONGO_URL must be set in environment");
  return new MongoInternals.RemoteCollectionDriver(mongoUrl, connectionOptions);
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"collection.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/mongo/collection.js                                                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
!function (module1) {
  let _objectSpread;

  module1.link("@babel/runtime/helpers/objectSpread2", {
    default(v) {
      _objectSpread = v;
    }

  }, 0);
  // options.connection, if given, is a LivedataClient or LivedataServer
  // XXX presently there is no way to destroy/clean up a Collection

  /**
   * @summary Namespace for MongoDB-related items
   * @namespace
   */
  Mongo = {};
  /**
   * @summary Constructor for a Collection
   * @locus Anywhere
   * @instancename collection
   * @class
   * @param {String} name The name of the collection.  If null, creates an unmanaged (unsynchronized) local collection.
   * @param {Object} [options]
   * @param {Object} options.connection The server connection that will manage this collection. Uses the default connection if not specified.  Pass the return value of calling [`DDP.connect`](#ddp_connect) to specify a different server. Pass `null` to specify no connection. Unmanaged (`name` is null) collections cannot specify a connection.
   * @param {String} options.idGeneration The method of generating the `_id` fields of new documents in this collection.  Possible values:
  
   - **`'STRING'`**: random strings
   - **`'MONGO'`**:  random [`Mongo.ObjectID`](#mongo_object_id) values
  
  The default id generation technique is `'STRING'`.
   * @param {Function} options.transform An optional transformation function. Documents will be passed through this function before being returned from `fetch` or `findOne`, and before being passed to callbacks of `observe`, `map`, `forEach`, `allow`, and `deny`. Transforms are *not* applied for the callbacks of `observeChanges` or to cursors returned from publish functions.
   * @param {Boolean} options.defineMutationMethods Set to `false` to skip setting up the mutation methods that enable insert/update/remove from client code. Default `true`.
   */

  Mongo.Collection = function Collection(name, options) {
    if (!name && name !== null) {
      Meteor._debug("Warning: creating anonymous collection. It will not be " + "saved or synchronized over the network. (Pass null for " + "the collection name to turn off this warning.)");

      name = null;
    }

    if (name !== null && typeof name !== "string") {
      throw new Error("First argument to new Mongo.Collection must be a string or null");
    }

    if (options && options.methods) {
      // Backwards compatibility hack with original signature (which passed
      // "connection" directly instead of in options. (Connections must have a "methods"
      // method.)
      // XXX remove before 1.0
      options = {
        connection: options
      };
    } // Backwards compatibility: "connection" used to be called "manager".


    if (options && options.manager && !options.connection) {
      options.connection = options.manager;
    }

    options = _objectSpread({
      connection: undefined,
      idGeneration: 'STRING',
      transform: null,
      _driver: undefined,
      _preventAutopublish: false
    }, options);

    switch (options.idGeneration) {
      case 'MONGO':
        this._makeNewID = function () {
          var src = name ? DDP.randomStream('/collection/' + name) : Random.insecure;
          return new Mongo.ObjectID(src.hexString(24));
        };

        break;

      case 'STRING':
      default:
        this._makeNewID = function () {
          var src = name ? DDP.randomStream('/collection/' + name) : Random.insecure;
          return src.id();
        };

        break;
    }

    this._transform = LocalCollection.wrapTransform(options.transform);
    if (!name || options.connection === null) // note: nameless collections never have a connection
      this._connection = null;else if (options.connection) this._connection = options.connection;else if (Meteor.isClient) this._connection = Meteor.connection;else this._connection = Meteor.server;

    if (!options._driver) {
      // XXX This check assumes that webapp is loaded so that Meteor.server !==
      // null. We should fully support the case of "want to use a Mongo-backed
      // collection from Node code without webapp", but we don't yet.
      // #MeteorServerNull
      if (name && this._connection === Meteor.server && typeof MongoInternals !== "undefined" && MongoInternals.defaultRemoteCollectionDriver) {
        options._driver = MongoInternals.defaultRemoteCollectionDriver();
      } else {
        const {
          LocalCollectionDriver
        } = require("./local_collection_driver.js");

        options._driver = LocalCollectionDriver;
      }
    }

    this._collection = options._driver.open(name, this._connection);
    this._name = name;
    this._driver = options._driver;

    this._maybeSetUpReplication(name, options); // XXX don't define these until allow or deny is actually used for this
    // collection. Could be hard if the security rules are only defined on the
    // server.


    if (options.defineMutationMethods !== false) {
      try {
        this._defineMutationMethods({
          useExisting: options._suppressSameNameError === true
        });
      } catch (error) {
        // Throw a more understandable error on the server for same collection name
        if (error.message === "A method named '/".concat(name, "/insert' is already defined")) throw new Error("There is already a collection named \"".concat(name, "\""));
        throw error;
      }
    } // autopublish


    if (Package.autopublish && !options._preventAutopublish && this._connection && this._connection.publish) {
      this._connection.publish(null, () => this.find(), {
        is_auto: true
      });
    }
  };

  Object.assign(Mongo.Collection.prototype, {
    _maybeSetUpReplication(name, _ref) {
      let {
        _suppressSameNameError = false
      } = _ref;
      const self = this;

      if (!(self._connection && self._connection.registerStore)) {
        return;
      } // OK, we're going to be a slave, replicating some remote
      // database, except possibly with some temporary divergence while
      // we have unacknowledged RPC's.


      const ok = self._connection.registerStore(name, {
        // Called at the beginning of a batch of updates. batchSize is the number
        // of update calls to expect.
        //
        // XXX This interface is pretty janky. reset probably ought to go back to
        // being its own function, and callers shouldn't have to calculate
        // batchSize. The optimization of not calling pause/remove should be
        // delayed until later: the first call to update() should buffer its
        // message, and then we can either directly apply it at endUpdate time if
        // it was the only update, or do pauseObservers/apply/apply at the next
        // update() if there's another one.
        beginUpdate(batchSize, reset) {
          // pause observers so users don't see flicker when updating several
          // objects at once (including the post-reconnect reset-and-reapply
          // stage), and so that a re-sorting of a query can take advantage of the
          // full _diffQuery moved calculation instead of applying change one at a
          // time.
          if (batchSize > 1 || reset) self._collection.pauseObservers();
          if (reset) self._collection.remove({});
        },

        // Apply an update.
        // XXX better specify this interface (not in terms of a wire message)?
        update(msg) {
          if (Meteor.isClient) {
            try {
              if (!msg) {
                throw new Error("mongo update message is undefined. collection name is " + self._name);
              }
            } catch (error) {
              console.error(error, msg);
            }
          }

          var mongoId = MongoID.idParse(msg.id);

          var doc = self._collection.findOne(mongoId); // Is this a "replace the whole doc" message coming from the quiescence
          // of method writes to an object? (Note that 'undefined' is a valid
          // value meaning "remove it".)


          if (msg.msg === 'replace') {
            var replace = msg.replace;

            if (!replace) {
              if (doc) self._collection.remove(mongoId);
            } else if (!doc) {
              self._collection.insert(replace);
            } else {
              // XXX check that replace has no $ ops
              self._collection.update(mongoId, replace);
            }

            return;
          } else if (msg.msg === 'added') {
            if (doc) {
              throw new Error("Expected not to find a document already present for an add");
            }

            self._collection.insert(_objectSpread({
              _id: mongoId
            }, msg.fields));
          } else if (msg.msg === 'removed') {
            if (!doc) throw new Error("Expected to find a document already present for removed");

            self._collection.remove(mongoId);
          } else if (msg.msg === 'changed') {
            if (!doc) throw new Error("Expected to find a document to change");
            const keys = Object.keys(msg.fields);

            if (keys.length > 0) {
              var modifier = {};
              keys.forEach(key => {
                const value = msg.fields[key];

                if (EJSON.equals(doc[key], value)) {
                  return;
                }

                if (typeof value === "undefined") {
                  if (!modifier.$unset) {
                    modifier.$unset = {};
                  }

                  modifier.$unset[key] = 1;
                } else {
                  if (!modifier.$set) {
                    modifier.$set = {};
                  }

                  modifier.$set[key] = value;
                }
              });

              if (Object.keys(modifier).length > 0) {
                self._collection.update(mongoId, modifier);
              }
            }
          } else {
            throw new Error("I don't know how to deal with this message");
          }
        },

        // Called at the end of a batch of updates.
        endUpdate() {
          self._collection.resumeObservers();
        },

        // Called around method stub invocations to capture the original versions
        // of modified documents.
        saveOriginals() {
          self._collection.saveOriginals();
        },

        retrieveOriginals() {
          return self._collection.retrieveOriginals();
        },

        // Used to preserve current versions of documents across a store reset.
        getDoc(id) {
          return self.findOne(id);
        },

        // To be able to get back to the collection from the store.
        _getCollection() {
          return self;
        }

      });

      if (!ok) {
        const message = "There is already a collection named \"".concat(name, "\"");

        if (_suppressSameNameError === true) {
          // XXX In theory we do not have to throw when `ok` is falsy. The
          // store is already defined for this collection name, but this
          // will simply be another reference to it and everything should
          // work. However, we have historically thrown an error here, so
          // for now we will skip the error only when _suppressSameNameError
          // is `true`, allowing people to opt in and give this some real
          // world testing.
          console.warn ? console.warn(message) : console.log(message);
        } else {
          throw new Error(message);
        }
      }
    },

    ///
    /// Main collection API
    ///
    _getFindSelector(args) {
      if (args.length == 0) return {};else return args[0];
    },

    _getFindOptions(args) {
      var self = this;

      if (args.length < 2) {
        return {
          transform: self._transform
        };
      } else {
        check(args[1], Match.Optional(Match.ObjectIncluding({
          fields: Match.Optional(Match.OneOf(Object, undefined)),
          sort: Match.Optional(Match.OneOf(Object, Array, Function, undefined)),
          limit: Match.Optional(Match.OneOf(Number, undefined)),
          skip: Match.Optional(Match.OneOf(Number, undefined))
        })));
        return _objectSpread({
          transform: self._transform
        }, args[1]);
      }
    },

    /**
     * @summary Find the documents in a collection that match the selector.
     * @locus Anywhere
     * @method find
     * @memberof Mongo.Collection
     * @instance
     * @param {MongoSelector} [selector] A query describing the documents to find
     * @param {Object} [options]
     * @param {MongoSortSpecifier} options.sort Sort order (default: natural order)
     * @param {Number} options.skip Number of results to skip at the beginning
     * @param {Number} options.limit Maximum number of results to return
     * @param {MongoFieldSpecifier} options.fields Dictionary of fields to return or exclude.
     * @param {Boolean} options.reactive (Client only) Default `true`; pass `false` to disable reactivity
     * @param {Function} options.transform Overrides `transform` on the  [`Collection`](#collections) for this cursor.  Pass `null` to disable transformation.
     * @param {Boolean} options.disableOplog (Server only) Pass true to disable oplog-tailing on this query. This affects the way server processes calls to `observe` on this query. Disabling the oplog can be useful when working with data that updates in large batches.
     * @param {Number} options.pollingIntervalMs (Server only) When oplog is disabled (through the use of `disableOplog` or when otherwise not available), the frequency (in milliseconds) of how often to poll this query when observing on the server. Defaults to 10000ms (10 seconds).
     * @param {Number} options.pollingThrottleMs (Server only) When oplog is disabled (through the use of `disableOplog` or when otherwise not available), the minimum time (in milliseconds) to allow between re-polling when observing on the server. Increasing this will save CPU and mongo load at the expense of slower updates to users. Decreasing this is not recommended. Defaults to 50ms.
     * @param {Number} options.maxTimeMs (Server only) If set, instructs MongoDB to set a time limit for this cursor's operations. If the operation reaches the specified time limit (in milliseconds) without the having been completed, an exception will be thrown. Useful to prevent an (accidental or malicious) unoptimized query from causing a full collection scan that would disrupt other database users, at the expense of needing to handle the resulting error.
     * @param {String|Object} options.hint (Server only) Overrides MongoDB's default index selection and query optimization process. Specify an index to force its use, either by its name or index specification. You can also specify `{ $natural : 1 }` to force a forwards collection scan, or `{ $natural : -1 }` for a reverse collection scan. Setting this is only recommended for advanced users.
     * @returns {Mongo.Cursor}
     */
    find() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      // Collection.find() (return all docs) behaves differently
      // from Collection.find(undefined) (return 0 docs).  so be
      // careful about the length of arguments.
      return this._collection.find(this._getFindSelector(args), this._getFindOptions(args));
    },

    /**
     * @summary Finds the first document that matches the selector, as ordered by sort and skip options. Returns `undefined` if no matching document is found.
     * @locus Anywhere
     * @method findOne
     * @memberof Mongo.Collection
     * @instance
     * @param {MongoSelector} [selector] A query describing the documents to find
     * @param {Object} [options]
     * @param {MongoSortSpecifier} options.sort Sort order (default: natural order)
     * @param {Number} options.skip Number of results to skip at the beginning
     * @param {MongoFieldSpecifier} options.fields Dictionary of fields to return or exclude.
     * @param {Boolean} options.reactive (Client only) Default true; pass false to disable reactivity
     * @param {Function} options.transform Overrides `transform` on the [`Collection`](#collections) for this cursor.  Pass `null` to disable transformation.
     * @returns {Object}
     */
    findOne() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return this._collection.findOne(this._getFindSelector(args), this._getFindOptions(args));
    }

  });
  Object.assign(Mongo.Collection, {
    _publishCursor(cursor, sub, collection) {
      var observeHandle = cursor.observeChanges({
        added: function (id, fields) {
          sub.added(collection, id, fields);
        },
        changed: function (id, fields) {
          sub.changed(collection, id, fields);
        },
        removed: function (id) {
          sub.removed(collection, id);
        }
      }); // We don't call sub.ready() here: it gets called in livedata_server, after
      // possibly calling _publishCursor on multiple returned cursors.
      // register stop callback (expects lambda w/ no args).

      sub.onStop(function () {
        observeHandle.stop();
      }); // return the observeHandle in case it needs to be stopped early

      return observeHandle;
    },

    // protect against dangerous selectors.  falsey and {_id: falsey} are both
    // likely programmer error, and not what you want, particularly for destructive
    // operations. If a falsey _id is sent in, a new string _id will be
    // generated and returned; if a fallbackId is provided, it will be returned
    // instead.
    _rewriteSelector(selector) {
      let {
        fallbackId
      } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      // shorthand -- scalars match _id
      if (LocalCollection._selectorIsId(selector)) selector = {
        _id: selector
      };

      if (Array.isArray(selector)) {
        // This is consistent with the Mongo console itself; if we don't do this
        // check passing an empty array ends up selecting all items
        throw new Error("Mongo selector can't be an array.");
      }

      if (!selector || '_id' in selector && !selector._id) {
        // can't match anything
        return {
          _id: fallbackId || Random.id()
        };
      }

      return selector;
    }

  });
  Object.assign(Mongo.Collection.prototype, {
    // 'insert' immediately returns the inserted document's new _id.
    // The others return values immediately if you are in a stub, an in-memory
    // unmanaged collection, or a mongo-backed collection and you don't pass a
    // callback. 'update' and 'remove' return the number of affected
    // documents. 'upsert' returns an object with keys 'numberAffected' and, if an
    // insert happened, 'insertedId'.
    //
    // Otherwise, the semantics are exactly like other methods: they take
    // a callback as an optional last argument; if no callback is
    // provided, they block until the operation is complete, and throw an
    // exception if it fails; if a callback is provided, then they don't
    // necessarily block, and they call the callback when they finish with error and
    // result arguments.  (The insert method provides the document ID as its result;
    // update and remove provide the number of affected docs as the result; upsert
    // provides an object with numberAffected and maybe insertedId.)
    //
    // On the client, blocking is impossible, so if a callback
    // isn't provided, they just return immediately and any error
    // information is lost.
    //
    // There's one more tweak. On the client, if you don't provide a
    // callback, then if there is an error, a message will be logged with
    // Meteor._debug.
    //
    // The intent (though this is actually determined by the underlying
    // drivers) is that the operations should be done synchronously, not
    // generating their result until the database has acknowledged
    // them. In the future maybe we should provide a flag to turn this
    // off.

    /**
     * @summary Insert a document in the collection.  Returns its unique _id.
     * @locus Anywhere
     * @method  insert
     * @memberof Mongo.Collection
     * @instance
     * @param {Object} doc The document to insert. May not yet have an _id attribute, in which case Meteor will generate one for you.
     * @param {Function} [callback] Optional.  If present, called with an error object as the first argument and, if no error, the _id as the second.
     */
    insert(doc, callback) {
      // Make sure we were passed a document to insert
      if (!doc) {
        throw new Error("insert requires an argument");
      } // Make a shallow clone of the document, preserving its prototype.


      doc = Object.create(Object.getPrototypeOf(doc), Object.getOwnPropertyDescriptors(doc));

      if ('_id' in doc) {
        if (!doc._id || !(typeof doc._id === 'string' || doc._id instanceof Mongo.ObjectID)) {
          throw new Error("Meteor requires document _id fields to be non-empty strings or ObjectIDs");
        }
      } else {
        let generateId = true; // Don't generate the id if we're the client and the 'outermost' call
        // This optimization saves us passing both the randomSeed and the id
        // Passing both is redundant.

        if (this._isRemoteCollection()) {
          const enclosing = DDP._CurrentMethodInvocation.get();

          if (!enclosing) {
            generateId = false;
          }
        }

        if (generateId) {
          doc._id = this._makeNewID();
        }
      } // On inserts, always return the id that we generated; on all other
      // operations, just return the result from the collection.


      var chooseReturnValueFromCollectionResult = function (result) {
        if (doc._id) {
          return doc._id;
        } // XXX what is this for??
        // It's some iteraction between the callback to _callMutatorMethod and
        // the return value conversion


        doc._id = result;
        return result;
      };

      const wrappedCallback = wrapCallback(callback, chooseReturnValueFromCollectionResult);

      if (this._isRemoteCollection()) {
        const result = this._callMutatorMethod("insert", [doc], wrappedCallback);

        return chooseReturnValueFromCollectionResult(result);
      } // it's my collection.  descend into the collection object
      // and propagate any exception.


      try {
        // If the user provided a callback and the collection implements this
        // operation asynchronously, then queryRet will be undefined, and the
        // result will be returned through the callback instead.
        const result = this._collection.insert(doc, wrappedCallback);

        return chooseReturnValueFromCollectionResult(result);
      } catch (e) {
        if (callback) {
          callback(e);
          return null;
        }

        throw e;
      }
    },

    /**
     * @summary Modify one or more documents in the collection. Returns the number of matched documents.
     * @locus Anywhere
     * @method update
     * @memberof Mongo.Collection
     * @instance
     * @param {MongoSelector} selector Specifies which documents to modify
     * @param {MongoModifier} modifier Specifies how to modify the documents
     * @param {Object} [options]
     * @param {Boolean} options.multi True to modify all matching documents; false to only modify one of the matching documents (the default).
     * @param {Boolean} options.upsert True to insert a document if no matching documents are found.
     * @param {Function} [callback] Optional.  If present, called with an error object as the first argument and, if no error, the number of affected documents as the second.
     */
    update(selector, modifier) {
      for (var _len3 = arguments.length, optionsAndCallback = new Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
        optionsAndCallback[_key3 - 2] = arguments[_key3];
      }

      const callback = popCallbackFromArgs(optionsAndCallback); // We've already popped off the callback, so we are left with an array
      // of one or zero items

      const options = _objectSpread({}, optionsAndCallback[0] || null);

      let insertedId;

      if (options && options.upsert) {
        // set `insertedId` if absent.  `insertedId` is a Meteor extension.
        if (options.insertedId) {
          if (!(typeof options.insertedId === 'string' || options.insertedId instanceof Mongo.ObjectID)) throw new Error("insertedId must be string or ObjectID");
          insertedId = options.insertedId;
        } else if (!selector || !selector._id) {
          insertedId = this._makeNewID();
          options.generatedId = true;
          options.insertedId = insertedId;
        }
      }

      selector = Mongo.Collection._rewriteSelector(selector, {
        fallbackId: insertedId
      });
      const wrappedCallback = wrapCallback(callback);

      if (this._isRemoteCollection()) {
        const args = [selector, modifier, options];
        return this._callMutatorMethod("update", args, wrappedCallback);
      } // it's my collection.  descend into the collection object
      // and propagate any exception.


      try {
        // If the user provided a callback and the collection implements this
        // operation asynchronously, then queryRet will be undefined, and the
        // result will be returned through the callback instead.
        return this._collection.update(selector, modifier, options, wrappedCallback);
      } catch (e) {
        if (callback) {
          callback(e);
          return null;
        }

        throw e;
      }
    },

    /**
     * @summary Remove documents from the collection
     * @locus Anywhere
     * @method remove
     * @memberof Mongo.Collection
     * @instance
     * @param {MongoSelector} selector Specifies which documents to remove
     * @param {Function} [callback] Optional.  If present, called with an error object as its argument.
     */
    remove(selector, callback) {
      selector = Mongo.Collection._rewriteSelector(selector);
      const wrappedCallback = wrapCallback(callback);

      if (this._isRemoteCollection()) {
        return this._callMutatorMethod("remove", [selector], wrappedCallback);
      } // it's my collection.  descend into the collection object
      // and propagate any exception.


      try {
        // If the user provided a callback and the collection implements this
        // operation asynchronously, then queryRet will be undefined, and the
        // result will be returned through the callback instead.
        return this._collection.remove(selector, wrappedCallback);
      } catch (e) {
        if (callback) {
          callback(e);
          return null;
        }

        throw e;
      }
    },

    // Determine if this collection is simply a minimongo representation of a real
    // database on another server
    _isRemoteCollection() {
      // XXX see #MeteorServerNull
      return this._connection && this._connection !== Meteor.server;
    },

    /**
     * @summary Modify one or more documents in the collection, or insert one if no matching documents were found. Returns an object with keys `numberAffected` (the number of documents modified)  and `insertedId` (the unique _id of the document that was inserted, if any).
     * @locus Anywhere
     * @method upsert
     * @memberof Mongo.Collection
     * @instance
     * @param {MongoSelector} selector Specifies which documents to modify
     * @param {MongoModifier} modifier Specifies how to modify the documents
     * @param {Object} [options]
     * @param {Boolean} options.multi True to modify all matching documents; false to only modify one of the matching documents (the default).
     * @param {Function} [callback] Optional.  If present, called with an error object as the first argument and, if no error, the number of affected documents as the second.
     */
    upsert(selector, modifier, options, callback) {
      if (!callback && typeof options === "function") {
        callback = options;
        options = {};
      }

      return this.update(selector, modifier, _objectSpread({}, options, {
        _returnObject: true,
        upsert: true
      }), callback);
    },

    // We'll actually design an index API later. For now, we just pass through to
    // Mongo's, but make it synchronous.
    _ensureIndex(index, options) {
      var self = this;
      if (!self._collection._ensureIndex) throw new Error("Can only call _ensureIndex on server collections");

      self._collection._ensureIndex(index, options);
    },

    _dropIndex(index) {
      var self = this;
      if (!self._collection._dropIndex) throw new Error("Can only call _dropIndex on server collections");

      self._collection._dropIndex(index);
    },

    _dropCollection() {
      var self = this;
      if (!self._collection.dropCollection) throw new Error("Can only call _dropCollection on server collections");

      self._collection.dropCollection();
    },

    _createCappedCollection(byteSize, maxDocuments) {
      var self = this;
      if (!self._collection._createCappedCollection) throw new Error("Can only call _createCappedCollection on server collections");

      self._collection._createCappedCollection(byteSize, maxDocuments);
    },

    /**
     * @summary Returns the [`Collection`](http://mongodb.github.io/node-mongodb-native/3.0/api/Collection.html) object corresponding to this collection from the [npm `mongodb` driver module](https://www.npmjs.com/package/mongodb) which is wrapped by `Mongo.Collection`.
     * @locus Server
     * @memberof Mongo.Collection
     * @instance
     */
    rawCollection() {
      var self = this;

      if (!self._collection.rawCollection) {
        throw new Error("Can only call rawCollection on server collections");
      }

      return self._collection.rawCollection();
    },

    /**
     * @summary Returns the [`Db`](http://mongodb.github.io/node-mongodb-native/3.0/api/Db.html) object corresponding to this collection's database connection from the [npm `mongodb` driver module](https://www.npmjs.com/package/mongodb) which is wrapped by `Mongo.Collection`.
     * @locus Server
     * @memberof Mongo.Collection
     * @instance
     */
    rawDatabase() {
      var self = this;

      if (!(self._driver.mongo && self._driver.mongo.db)) {
        throw new Error("Can only call rawDatabase on server collections");
      }

      return self._driver.mongo.db;
    }

  }); // Convert the callback to not return a result if there is an error

  function wrapCallback(callback, convertResult) {
    return callback && function (error, result) {
      if (error) {
        callback(error);
      } else if (typeof convertResult === "function") {
        callback(error, convertResult(result));
      } else {
        callback(error, result);
      }
    };
  }
  /**
   * @summary Create a Mongo-style `ObjectID`.  If you don't specify a `hexString`, the `ObjectID` will generated randomly (not using MongoDB's ID construction rules).
   * @locus Anywhere
   * @class
   * @param {String} [hexString] Optional.  The 24-character hexadecimal contents of the ObjectID to create
   */


  Mongo.ObjectID = MongoID.ObjectID;
  /**
   * @summary To create a cursor, use find. To access the documents in a cursor, use forEach, map, or fetch.
   * @class
   * @instanceName cursor
   */

  Mongo.Cursor = LocalCollection.Cursor;
  /**
   * @deprecated in 0.9.1
   */

  Mongo.Collection.Cursor = Mongo.Cursor;
  /**
   * @deprecated in 0.9.1
   */

  Mongo.Collection.ObjectID = Mongo.ObjectID;
  /**
   * @deprecated in 0.9.1
   */

  Meteor.Collection = Mongo.Collection; // Allow deny stuff is now in the allow-deny package

  Object.assign(Meteor.Collection.prototype, AllowDeny.CollectionPrototype);

  function popCallbackFromArgs(args) {
    // Pull off any callback (or perhaps a 'callback' variable that was passed
    // in undefined, like how 'upsert' does it).
    if (args.length && (args[args.length - 1] === undefined || args[args.length - 1] instanceof Function)) {
      return args.pop();
    }
  }
}.call(this, module);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"connection_options.js":function module(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/mongo/connection_options.js                                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/**
 * @summary Allows for user specified connection options
 * @example http://mongodb.github.io/node-mongodb-native/3.0/reference/connecting/connection-settings/
 * @locus Server
 * @param {Object} options User specified Mongo connection options
 */
Mongo.setConnectionOptions = function setConnectionOptions(options) {
  check(options, Object);
  Mongo._connectionOptions = options;
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

require("/node_modules/meteor/mongo/mongo_driver.js");
require("/node_modules/meteor/mongo/oplog_tailing.js");
require("/node_modules/meteor/mongo/observe_multiplex.js");
require("/node_modules/meteor/mongo/doc_fetcher.js");
require("/node_modules/meteor/mongo/polling_observe_driver.js");
require("/node_modules/meteor/mongo/oplog_observe_driver.js");
require("/node_modules/meteor/mongo/oplog_v2_converter.js");
require("/node_modules/meteor/mongo/local_collection_driver.js");
require("/node_modules/meteor/mongo/remote_collection_driver.js");
require("/node_modules/meteor/mongo/collection.js");
require("/node_modules/meteor/mongo/connection_options.js");

/* Exports */
Package._define("mongo", {
  MongoInternals: MongoInternals,
  Mongo: Mongo
});

})();

//# sourceURL=meteor://💻app/packages/mongo.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvbW9uZ28vbW9uZ29fZHJpdmVyLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9tb25nby9vcGxvZ190YWlsaW5nLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9tb25nby9vYnNlcnZlX211bHRpcGxleC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvbW9uZ28vZG9jX2ZldGNoZXIuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL21vbmdvL3BvbGxpbmdfb2JzZXJ2ZV9kcml2ZXIuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL21vbmdvL29wbG9nX29ic2VydmVfZHJpdmVyLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9tb25nby9vcGxvZ192Ml9jb252ZXJ0ZXIuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL21vbmdvL2xvY2FsX2NvbGxlY3Rpb25fZHJpdmVyLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9tb25nby9yZW1vdGVfY29sbGVjdGlvbl9kcml2ZXIuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL21vbmdvL2NvbGxlY3Rpb24uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL21vbmdvL2Nvbm5lY3Rpb25fb3B0aW9ucy5qcyJdLCJuYW1lcyI6WyJEb2NGZXRjaGVyIiwibW9kdWxlMSIsImxpbmsiLCJ2IiwiTW9uZ29EQiIsIk5wbU1vZHVsZU1vbmdvZGIiLCJGdXR1cmUiLCJOcG0iLCJyZXF1aXJlIiwiTW9uZ29JbnRlcm5hbHMiLCJOcG1Nb2R1bGVzIiwibW9uZ29kYiIsInZlcnNpb24iLCJOcG1Nb2R1bGVNb25nb2RiVmVyc2lvbiIsIm1vZHVsZSIsIk5wbU1vZHVsZSIsInJlcGxhY2VOYW1lcyIsImZpbHRlciIsInRoaW5nIiwiXyIsImlzQXJyYXkiLCJtYXAiLCJiaW5kIiwicmV0IiwiZWFjaCIsInZhbHVlIiwia2V5IiwiVGltZXN0YW1wIiwicHJvdG90eXBlIiwiY2xvbmUiLCJtYWtlTW9uZ29MZWdhbCIsIm5hbWUiLCJ1bm1ha2VNb25nb0xlZ2FsIiwic3Vic3RyIiwicmVwbGFjZU1vbmdvQXRvbVdpdGhNZXRlb3IiLCJkb2N1bWVudCIsIkJpbmFyeSIsImJ1ZmZlciIsIlVpbnQ4QXJyYXkiLCJPYmplY3RJRCIsIk1vbmdvIiwidG9IZXhTdHJpbmciLCJEZWNpbWFsMTI4IiwiRGVjaW1hbCIsInRvU3RyaW5nIiwic2l6ZSIsIkVKU09OIiwiZnJvbUpTT05WYWx1ZSIsInVuZGVmaW5lZCIsInJlcGxhY2VNZXRlb3JBdG9tV2l0aE1vbmdvIiwiaXNCaW5hcnkiLCJmcm9tU3RyaW5nIiwiX2lzQ3VzdG9tVHlwZSIsInRvSlNPTlZhbHVlIiwicmVwbGFjZVR5cGVzIiwiYXRvbVRyYW5zZm9ybWVyIiwicmVwbGFjZWRUb3BMZXZlbEF0b20iLCJ2YWwiLCJ2YWxSZXBsYWNlZCIsIlNURUVET1NfTU9OR09EQl9NT05JVE9SX0NPTU1BTkRTIiwiU0xPV19RVUVSWV9USFJFU0hPTERfTVMiLCJwcm9jZXNzIiwiZW52IiwiU1RFRURPU19NT05HT0RCX1NMT1dfUVVFUllfVEhSRVNIT0xEIiwiTnVtYmVyIiwiU1RFRURPU19NT05HT0RCX09QTE9HX01PTklUT1JfQ09NTUFORFMiLCJPUExPR19TTE9XX1FVRVJZX1RIUkVTSE9MRF9NUyIsIlNURUVET1NfTU9OR09EQl9PUExPR19TTE9XX1FVRVJZX1RIUkVTSE9MRCIsInJ1bm5pbmdDb21tYW5kcyIsIk1hcCIsImNvbm5lY3RBbmRNb25pdG9yIiwiY2xpZW50Iiwib24iLCJldmVudCIsInNldCIsInJlcXVlc3RJZCIsInN0YXJ0VGltZSIsIkRhdGUiLCJub3ciLCJjb21tYW5kTmFtZSIsImRhdGFiYXNlTmFtZSIsImNvbW1hbmQiLCJjb21tYW5kSW5mbyIsImdldCIsImR1cmF0aW9uIiwiZGVsZXRlIiwiY29uc29sZSIsIndhcm4iLCJKU09OIiwic3RyaW5naWZ5IiwiZXJyb3IiLCJmYWlsdXJlIiwibWVzc2FnZSIsIk1vbmdvQ29ubmVjdGlvbiIsInVybCIsIm9wdGlvbnMiLCJzZWxmIiwiX29ic2VydmVNdWx0aXBsZXhlcnMiLCJfb25GYWlsb3Zlckhvb2siLCJIb29rIiwibW9uZ29PcHRpb25zIiwiT2JqZWN0IiwiYXNzaWduIiwiYXV0b1JlY29ubmVjdCIsInJlY29ubmVjdFRyaWVzIiwiSW5maW5pdHkiLCJpZ25vcmVVbmRlZmluZWQiLCJ1c2VOZXdVcmxQYXJzZXIiLCJfY29ubmVjdGlvbk9wdGlvbnMiLCJ0ZXN0IiwibmF0aXZlX3BhcnNlciIsIm1vbml0b3JDb21tYW5kcyIsImhhcyIsInBvb2xTaXplIiwiZGIiLCJfcHJpbWFyeSIsIl9vcGxvZ0hhbmRsZSIsIl9kb2NGZXRjaGVyIiwiY29ubmVjdEZ1dHVyZSIsImNvbm5lY3QiLCJNZXRlb3IiLCJiaW5kRW52aXJvbm1lbnQiLCJlcnIiLCJzZXJ2ZXJDb25maWciLCJpc01hc3RlckRvYyIsInByaW1hcnkiLCJraW5kIiwiZG9jIiwiY2FsbGJhY2siLCJtZSIsInJlc29sdmVyIiwid2FpdCIsIm9wbG9nVXJsIiwiUGFja2FnZSIsIk9wbG9nSGFuZGxlIiwiY2xvc2UiLCJFcnJvciIsIm9wbG9nSGFuZGxlIiwic3RvcCIsIndyYXAiLCJyYXdDb2xsZWN0aW9uIiwiY29sbGVjdGlvbk5hbWUiLCJmdXR1cmUiLCJjb2xsZWN0aW9uIiwiX2NyZWF0ZUNhcHBlZENvbGxlY3Rpb24iLCJieXRlU2l6ZSIsIm1heERvY3VtZW50cyIsImNyZWF0ZUNvbGxlY3Rpb24iLCJjYXBwZWQiLCJtYXgiLCJfbWF5YmVCZWdpbldyaXRlIiwiZmVuY2UiLCJERFBTZXJ2ZXIiLCJfQ3VycmVudFdyaXRlRmVuY2UiLCJiZWdpbldyaXRlIiwiY29tbWl0dGVkIiwiX29uRmFpbG92ZXIiLCJyZWdpc3RlciIsIndyaXRlQ2FsbGJhY2siLCJ3cml0ZSIsInJlZnJlc2giLCJyZXN1bHQiLCJyZWZyZXNoRXJyIiwiYmluZEVudmlyb25tZW50Rm9yV3JpdGUiLCJfaW5zZXJ0IiwiY29sbGVjdGlvbl9uYW1lIiwic2VuZEVycm9yIiwiZSIsIl9leHBlY3RlZEJ5VGVzdCIsIkxvY2FsQ29sbGVjdGlvbiIsIl9pc1BsYWluT2JqZWN0IiwiaWQiLCJfaWQiLCJpbnNlcnQiLCJzYWZlIiwiX3JlZnJlc2giLCJzZWxlY3RvciIsInJlZnJlc2hLZXkiLCJzcGVjaWZpY0lkcyIsIl9pZHNNYXRjaGVkQnlTZWxlY3RvciIsImV4dGVuZCIsIl9yZW1vdmUiLCJ3cmFwcGVkQ2FsbGJhY2siLCJkcml2ZXJSZXN1bHQiLCJ0cmFuc2Zvcm1SZXN1bHQiLCJudW1iZXJBZmZlY3RlZCIsInJlbW92ZSIsIl9kcm9wQ29sbGVjdGlvbiIsImNiIiwiZHJvcENvbGxlY3Rpb24iLCJkcm9wIiwiX2Ryb3BEYXRhYmFzZSIsImRyb3BEYXRhYmFzZSIsIl91cGRhdGUiLCJtb2QiLCJGdW5jdGlvbiIsIm1vbmdvT3B0cyIsImFycmF5RmlsdGVycyIsInVwc2VydCIsIm11bHRpIiwiZnVsbFJlc3VsdCIsIm1vbmdvU2VsZWN0b3IiLCJtb25nb01vZCIsImlzTW9kaWZ5IiwiX2lzTW9kaWZpY2F0aW9uTW9kIiwiX2ZvcmJpZFJlcGxhY2UiLCJrbm93bklkIiwibmV3RG9jIiwiX2NyZWF0ZVVwc2VydERvY3VtZW50IiwiaW5zZXJ0ZWRJZCIsImdlbmVyYXRlZElkIiwic2ltdWxhdGVVcHNlcnRXaXRoSW5zZXJ0ZWRJZCIsIl9yZXR1cm5PYmplY3QiLCJoYXNPd25Qcm9wZXJ0eSIsIiRzZXRPbkluc2VydCIsInVwZGF0ZSIsIm1ldGVvclJlc3VsdCIsIm1vbmdvUmVzdWx0IiwidXBzZXJ0ZWQiLCJsZW5ndGgiLCJuIiwiTlVNX09QVElNSVNUSUNfVFJJRVMiLCJfaXNDYW5ub3RDaGFuZ2VJZEVycm9yIiwiZXJybXNnIiwiaW5kZXhPZiIsIm1vbmdvT3B0c0ZvclVwZGF0ZSIsIm1vbmdvT3B0c0Zvckluc2VydCIsInJlcGxhY2VtZW50V2l0aElkIiwidHJpZXMiLCJkb1VwZGF0ZSIsImRvQ29uZGl0aW9uYWxJbnNlcnQiLCJtZXRob2QiLCJ3cmFwQXN5bmMiLCJhcHBseSIsImFyZ3VtZW50cyIsImZpbmQiLCJDdXJzb3IiLCJDdXJzb3JEZXNjcmlwdGlvbiIsImZpbmRPbmUiLCJsaW1pdCIsImZldGNoIiwiX2Vuc3VyZUluZGV4IiwiaW5kZXgiLCJpbmRleE5hbWUiLCJlbnN1cmVJbmRleCIsIkV4Y2VwdGlvbiIsIl9kcm9wSW5kZXgiLCJkcm9wSW5kZXgiLCJDb2xsZWN0aW9uIiwiX3Jld3JpdGVTZWxlY3RvciIsIm1vbmdvIiwiY3Vyc29yRGVzY3JpcHRpb24iLCJfbW9uZ28iLCJfY3Vyc29yRGVzY3JpcHRpb24iLCJfc3luY2hyb25vdXNDdXJzb3IiLCJTeW1ib2wiLCJpdGVyYXRvciIsInRhaWxhYmxlIiwiX2NyZWF0ZVN5bmNocm9ub3VzQ3Vyc29yIiwic2VsZkZvckl0ZXJhdGlvbiIsInVzZVRyYW5zZm9ybSIsInJld2luZCIsImdldFRyYW5zZm9ybSIsInRyYW5zZm9ybSIsIl9wdWJsaXNoQ3Vyc29yIiwic3ViIiwiX2dldENvbGxlY3Rpb25OYW1lIiwib2JzZXJ2ZSIsImNhbGxiYWNrcyIsIl9vYnNlcnZlRnJvbU9ic2VydmVDaGFuZ2VzIiwib2JzZXJ2ZUNoYW5nZXMiLCJtZXRob2RzIiwib3JkZXJlZCIsIl9vYnNlcnZlQ2hhbmdlc0NhbGxiYWNrc0FyZU9yZGVyZWQiLCJleGNlcHRpb25OYW1lIiwiZm9yRWFjaCIsIl9vYnNlcnZlQ2hhbmdlcyIsInBpY2siLCJjdXJzb3JPcHRpb25zIiwic29ydCIsInNraXAiLCJwcm9qZWN0aW9uIiwiZmllbGRzIiwiYXdhaXRkYXRhIiwibnVtYmVyT2ZSZXRyaWVzIiwiT1BMT0dfQ09MTEVDVElPTiIsInRzIiwib3Bsb2dSZXBsYXkiLCJkYkN1cnNvciIsIm1heFRpbWVNcyIsIm1heFRpbWVNUyIsImhpbnQiLCJTeW5jaHJvbm91c0N1cnNvciIsIl9kYkN1cnNvciIsIl9zZWxmRm9ySXRlcmF0aW9uIiwiX3RyYW5zZm9ybSIsIndyYXBUcmFuc2Zvcm0iLCJfc3luY2hyb25vdXNDb3VudCIsImNvdW50IiwiX3Zpc2l0ZWRJZHMiLCJfSWRNYXAiLCJfcmF3TmV4dE9iamVjdFByb21pc2UiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsIm5leHQiLCJfbmV4dE9iamVjdFByb21pc2UiLCJfbmV4dE9iamVjdFByb21pc2VXaXRoVGltZW91dCIsInRpbWVvdXRNUyIsIm5leHRPYmplY3RQcm9taXNlIiwidGltZW91dEVyciIsInRpbWVvdXRQcm9taXNlIiwidGltZXIiLCJzZXRUaW1lb3V0IiwicmFjZSIsImNhdGNoIiwiX25leHRPYmplY3QiLCJhd2FpdCIsInRoaXNBcmciLCJfcmV3aW5kIiwiY2FsbCIsInJlcyIsInB1c2giLCJpZGVudGl0eSIsImFwcGx5U2tpcExpbWl0IiwiZ2V0UmF3T2JqZWN0cyIsInJlc3VsdHMiLCJkb25lIiwidGFpbCIsImRvY0NhbGxiYWNrIiwiY3Vyc29yIiwic3RvcHBlZCIsImxhc3RUUyIsImxvb3AiLCJuZXdTZWxlY3RvciIsIiRndCIsImRlZmVyIiwiX29ic2VydmVDaGFuZ2VzVGFpbGFibGUiLCJvYnNlcnZlS2V5IiwibXVsdGlwbGV4ZXIiLCJvYnNlcnZlRHJpdmVyIiwiZmlyc3RIYW5kbGUiLCJfbm9ZaWVsZHNBbGxvd2VkIiwiT2JzZXJ2ZU11bHRpcGxleGVyIiwib25TdG9wIiwib2JzZXJ2ZUhhbmRsZSIsIk9ic2VydmVIYW5kbGUiLCJtYXRjaGVyIiwic29ydGVyIiwiY2FuVXNlT3Bsb2ciLCJhbGwiLCJfdGVzdE9ubHlQb2xsQ2FsbGJhY2siLCJNaW5pbW9uZ28iLCJNYXRjaGVyIiwiT3Bsb2dPYnNlcnZlRHJpdmVyIiwiY3Vyc29yU3VwcG9ydGVkIiwiU29ydGVyIiwiZiIsImRyaXZlckNsYXNzIiwiUG9sbGluZ09ic2VydmVEcml2ZXIiLCJtb25nb0hhbmRsZSIsIl9vYnNlcnZlRHJpdmVyIiwiYWRkSGFuZGxlQW5kU2VuZEluaXRpYWxBZGRzIiwibGlzdGVuQWxsIiwibGlzdGVuQ2FsbGJhY2siLCJsaXN0ZW5lcnMiLCJmb3JFYWNoVHJpZ2dlciIsInRyaWdnZXIiLCJfSW52YWxpZGF0aW9uQ3Jvc3NiYXIiLCJsaXN0ZW4iLCJsaXN0ZW5lciIsInRyaWdnZXJDYWxsYmFjayIsImFkZGVkQmVmb3JlIiwiYWRkZWQiLCJNb25nb1RpbWVzdGFtcCIsIkNvbm5lY3Rpb24iLCJUT09fRkFSX0JFSElORCIsIk1FVEVPUl9PUExPR19UT09fRkFSX0JFSElORCIsIlRBSUxfVElNRU9VVCIsIk1FVEVPUl9PUExPR19UQUlMX1RJTUVPVVQiLCJzaG93VFMiLCJnZXRIaWdoQml0cyIsImdldExvd0JpdHMiLCJpZEZvck9wIiwib3AiLCJvIiwibzIiLCJkYk5hbWUiLCJfb3Bsb2dVcmwiLCJfZGJOYW1lIiwiX29wbG9nTGFzdEVudHJ5Q29ubmVjdGlvbiIsIl9vcGxvZ1RhaWxDb25uZWN0aW9uIiwiX3N0b3BwZWQiLCJfdGFpbEhhbmRsZSIsIl9yZWFkeUZ1dHVyZSIsIl9jcm9zc2JhciIsIl9Dcm9zc2JhciIsImZhY3RQYWNrYWdlIiwiZmFjdE5hbWUiLCJfYmFzZU9wbG9nU2VsZWN0b3IiLCJucyIsIlJlZ0V4cCIsIl9lc2NhcGVSZWdFeHAiLCJqb2luIiwiJG9yIiwiJGluIiwiJGV4aXN0cyIsIl9jYXRjaGluZ1VwRnV0dXJlcyIsIl9sYXN0UHJvY2Vzc2VkVFMiLCJfb25Ta2lwcGVkRW50cmllc0hvb2siLCJkZWJ1Z1ByaW50RXhjZXB0aW9ucyIsIl9lbnRyeVF1ZXVlIiwiX0RvdWJsZUVuZGVkUXVldWUiLCJfd29ya2VyQWN0aXZlIiwiX3N0YXJ0VGFpbGluZyIsIm9uT3Bsb2dFbnRyeSIsIm9yaWdpbmFsQ2FsbGJhY2siLCJub3RpZmljYXRpb24iLCJfZGVidWciLCJsaXN0ZW5IYW5kbGUiLCJvblNraXBwZWRFbnRyaWVzIiwid2FpdFVudGlsQ2F1Z2h0VXAiLCJsYXN0RW50cnkiLCIkbmF0dXJhbCIsIl9zbGVlcEZvck1zIiwibGVzc1RoYW5PckVxdWFsIiwiaW5zZXJ0QWZ0ZXIiLCJncmVhdGVyVGhhbiIsInNwbGljZSIsIm1vbmdvZGJVcmkiLCJwYXJzZSIsImRhdGFiYXNlIiwiYWRtaW4iLCJpc21hc3RlciIsInNldE5hbWUiLCJsYXN0T3Bsb2dFbnRyeSIsIm9wbG9nU2VsZWN0b3IiLCJfbWF5YmVTdGFydFdvcmtlciIsInJldHVybiIsImhhbmRsZURvYyIsImFwcGx5T3BzIiwibmV4dFRpbWVzdGFtcCIsImFkZCIsIk9ORSIsInN0YXJ0c1dpdGgiLCJzbGljZSIsImZpcmUiLCJpc0VtcHR5IiwicG9wIiwiY2xlYXIiLCJfc2V0TGFzdFByb2Nlc3NlZFRTIiwic2hpZnQiLCJzZXF1ZW5jZXIiLCJfZGVmaW5lVG9vRmFyQmVoaW5kIiwiX3Jlc2V0VG9vRmFyQmVoaW5kIiwiRmFjdHMiLCJpbmNyZW1lbnRTZXJ2ZXJGYWN0IiwiX29yZGVyZWQiLCJfb25TdG9wIiwiX3F1ZXVlIiwiX1N5bmNocm9ub3VzUXVldWUiLCJfaGFuZGxlcyIsIl9jYWNoZSIsIl9DYWNoaW5nQ2hhbmdlT2JzZXJ2ZXIiLCJfYWRkSGFuZGxlVGFza3NTY2hlZHVsZWRCdXROb3RQZXJmb3JtZWQiLCJjYWxsYmFja05hbWVzIiwiY2FsbGJhY2tOYW1lIiwiX2FwcGx5Q2FsbGJhY2siLCJ0b0FycmF5IiwiaGFuZGxlIiwic2FmZVRvUnVuVGFzayIsInJ1blRhc2siLCJfc2VuZEFkZHMiLCJyZW1vdmVIYW5kbGUiLCJfcmVhZHkiLCJfc3RvcCIsImZyb21RdWVyeUVycm9yIiwicmVhZHkiLCJxdWV1ZVRhc2siLCJxdWVyeUVycm9yIiwidGhyb3ciLCJvbkZsdXNoIiwiaXNSZXNvbHZlZCIsImFyZ3MiLCJhcHBseUNoYW5nZSIsImtleXMiLCJoYW5kbGVJZCIsIl9hZGRlZEJlZm9yZSIsIl9hZGRlZCIsImRvY3MiLCJuZXh0T2JzZXJ2ZUhhbmRsZUlkIiwiX211bHRpcGxleGVyIiwiYmVmb3JlIiwiZXhwb3J0IiwiRmliZXIiLCJjb25zdHJ1Y3RvciIsIm1vbmdvQ29ubmVjdGlvbiIsIl9tb25nb0Nvbm5lY3Rpb24iLCJfY2FsbGJhY2tzRm9yT3AiLCJjaGVjayIsIlN0cmluZyIsInJ1biIsIlBPTExJTkdfVEhST1RUTEVfTVMiLCJNRVRFT1JfUE9MTElOR19USFJPVFRMRV9NUyIsIlBPTExJTkdfSU5URVJWQUxfTVMiLCJNRVRFT1JfUE9MTElOR19JTlRFUlZBTF9NUyIsIl9tb25nb0hhbmRsZSIsIl9zdG9wQ2FsbGJhY2tzIiwiX3Jlc3VsdHMiLCJfcG9sbHNTY2hlZHVsZWRCdXROb3RTdGFydGVkIiwiX3BlbmRpbmdXcml0ZXMiLCJfZW5zdXJlUG9sbElzU2NoZWR1bGVkIiwidGhyb3R0bGUiLCJfdW50aHJvdHRsZWRFbnN1cmVQb2xsSXNTY2hlZHVsZWQiLCJwb2xsaW5nVGhyb3R0bGVNcyIsIl90YXNrUXVldWUiLCJsaXN0ZW5lcnNIYW5kbGUiLCJwb2xsaW5nSW50ZXJ2YWwiLCJwb2xsaW5nSW50ZXJ2YWxNcyIsIl9wb2xsaW5nSW50ZXJ2YWwiLCJpbnRlcnZhbEhhbmRsZSIsInNldEludGVydmFsIiwiY2xlYXJJbnRlcnZhbCIsIl9wb2xsTW9uZ28iLCJfc3VzcGVuZFBvbGxpbmciLCJfcmVzdW1lUG9sbGluZyIsImZpcnN0IiwibmV3UmVzdWx0cyIsIm9sZFJlc3VsdHMiLCJ3cml0ZXNGb3JDeWNsZSIsImNvZGUiLCJBcnJheSIsIl9kaWZmUXVlcnlDaGFuZ2VzIiwidyIsImMiLCJvcGxvZ1YyVjFDb252ZXJ0ZXIiLCJQSEFTRSIsIlFVRVJZSU5HIiwiRkVUQ0hJTkciLCJTVEVBRFkiLCJTd2l0Y2hlZFRvUXVlcnkiLCJmaW5pc2hJZk5lZWRUb1BvbGxRdWVyeSIsImN1cnJlbnRJZCIsIl91c2VzT3Bsb2ciLCJjb21wYXJhdG9yIiwiZ2V0Q29tcGFyYXRvciIsImhlYXBPcHRpb25zIiwiSWRNYXAiLCJfbGltaXQiLCJfY29tcGFyYXRvciIsIl9zb3J0ZXIiLCJfdW5wdWJsaXNoZWRCdWZmZXIiLCJNaW5NYXhIZWFwIiwiX3B1Ymxpc2hlZCIsIk1heEhlYXAiLCJfc2FmZUFwcGVuZFRvQnVmZmVyIiwiX3N0b3BIYW5kbGVzIiwiX3JlZ2lzdGVyUGhhc2VDaGFuZ2UiLCJfbWF0Y2hlciIsIl9wcm9qZWN0aW9uRm4iLCJfY29tcGlsZVByb2plY3Rpb24iLCJfc2hhcmVkUHJvamVjdGlvbiIsImNvbWJpbmVJbnRvUHJvamVjdGlvbiIsIl9zaGFyZWRQcm9qZWN0aW9uRm4iLCJfbmVlZFRvRmV0Y2giLCJfY3VycmVudGx5RmV0Y2hpbmciLCJfZmV0Y2hHZW5lcmF0aW9uIiwiX3JlcXVlcnlXaGVuRG9uZVRoaXNRdWVyeSIsIl93cml0ZXNUb0NvbW1pdFdoZW5XZVJlYWNoU3RlYWR5IiwiX25lZWRUb1BvbGxRdWVyeSIsIl9waGFzZSIsIl9oYW5kbGVPcGxvZ0VudHJ5UXVlcnlpbmciLCJfaGFuZGxlT3Bsb2dFbnRyeVN0ZWFkeU9yRmV0Y2hpbmciLCJmaXJlZCIsIl9vcGxvZ09ic2VydmVEcml2ZXJzIiwib25CZWZvcmVGaXJlIiwiZHJpdmVycyIsImRyaXZlciIsIl9ydW5Jbml0aWFsUXVlcnkiLCJfYWRkUHVibGlzaGVkIiwib3ZlcmZsb3dpbmdEb2NJZCIsIm1heEVsZW1lbnRJZCIsIm92ZXJmbG93aW5nRG9jIiwiZXF1YWxzIiwicmVtb3ZlZCIsIl9hZGRCdWZmZXJlZCIsIl9yZW1vdmVQdWJsaXNoZWQiLCJlbXB0eSIsIm5ld0RvY0lkIiwibWluRWxlbWVudElkIiwiX3JlbW92ZUJ1ZmZlcmVkIiwiX2NoYW5nZVB1Ymxpc2hlZCIsIm9sZERvYyIsInByb2plY3RlZE5ldyIsInByb2plY3RlZE9sZCIsImNoYW5nZWQiLCJEaWZmU2VxdWVuY2UiLCJtYWtlQ2hhbmdlZEZpZWxkcyIsIm1heEJ1ZmZlcmVkSWQiLCJfYWRkTWF0Y2hpbmciLCJtYXhQdWJsaXNoZWQiLCJtYXhCdWZmZXJlZCIsInRvUHVibGlzaCIsImNhbkFwcGVuZFRvQnVmZmVyIiwiY2FuSW5zZXJ0SW50b0J1ZmZlciIsInRvQnVmZmVyIiwiX3JlbW92ZU1hdGNoaW5nIiwiX2hhbmRsZURvYyIsIm1hdGNoZXNOb3ciLCJkb2N1bWVudE1hdGNoZXMiLCJwdWJsaXNoZWRCZWZvcmUiLCJidWZmZXJlZEJlZm9yZSIsImNhY2hlZEJlZm9yZSIsIm1pbkJ1ZmZlcmVkIiwic3RheXNJblB1Ymxpc2hlZCIsInN0YXlzSW5CdWZmZXIiLCJfZmV0Y2hNb2RpZmllZERvY3VtZW50cyIsInRoaXNHZW5lcmF0aW9uIiwid2FpdGluZyIsImZ1dCIsIl9iZVN0ZWFkeSIsIndyaXRlcyIsImlzUmVwbGFjZSIsImNhbkRpcmVjdGx5TW9kaWZ5RG9jIiwibW9kaWZpZXJDYW5CZURpcmVjdGx5QXBwbGllZCIsIl9tb2RpZnkiLCJjYW5CZWNvbWVUcnVlQnlNb2RpZmllciIsImFmZmVjdGVkQnlNb2RpZmllciIsIl9ydW5RdWVyeSIsImluaXRpYWwiLCJfZG9uZVF1ZXJ5aW5nIiwiX3BvbGxRdWVyeSIsIm5ld0J1ZmZlciIsIl9jdXJzb3JGb3JRdWVyeSIsImkiLCJfcHVibGlzaE5ld1Jlc3VsdHMiLCJvcHRpb25zT3ZlcndyaXRlIiwiZGVzY3JpcHRpb24iLCJpZHNUb1JlbW92ZSIsIl9vcGxvZ0VudHJ5SGFuZGxlIiwiX2xpc3RlbmVyc0hhbmRsZSIsInBoYXNlIiwidGltZURpZmYiLCJfcGhhc2VTdGFydFRpbWUiLCJkaXNhYmxlT3Bsb2ciLCJfZGlzYWJsZU9wbG9nIiwiX2NoZWNrU3VwcG9ydGVkUHJvamVjdGlvbiIsImhhc1doZXJlIiwiaGFzR2VvUXVlcnkiLCJtb2RpZmllciIsIm9wZXJhdGlvbiIsImZpZWxkIiwicHJlZml4IiwiYXJyYXlPcGVyYXRvcktleVJlZ2V4IiwiaXNBcnJheU9wZXJhdG9yS2V5IiwiaXNBcnJheU9wZXJhdG9yIiwib3BlcmF0b3IiLCJhIiwiZXZlcnkiLCJmbGF0dGVuT2JqZWN0SW50byIsInRhcmdldCIsInNvdXJjZSIsImVudHJpZXMiLCJsb2dEZWJ1Z01lc3NhZ2VzIiwiT1BMT0dfQ09OVkVSVEVSX0RFQlVHIiwiY29udmVydE9wbG9nRGlmZiIsIm9wbG9nRW50cnkiLCJkaWZmIiwibG9nIiwiZGlmZktleSIsIiR1bnNldCIsIiRzZXQiLCJwb3NpdGlvbiIsInBvc2l0aW9uS2V5IiwiJHYiLCJjb252ZXJ0ZWRPcGxvZ0VudHJ5IiwiTG9jYWxDb2xsZWN0aW9uRHJpdmVyIiwibm9Db25uQ29sbGVjdGlvbnMiLCJjcmVhdGUiLCJvcGVuIiwiY29ubiIsImVuc3VyZUNvbGxlY3Rpb24iLCJfbW9uZ29fbGl2ZWRhdGFfY29sbGVjdGlvbnMiLCJjb2xsZWN0aW9ucyIsIlJlbW90ZUNvbGxlY3Rpb25Ecml2ZXIiLCJtb25nb191cmwiLCJtIiwiZGVmYXVsdFJlbW90ZUNvbGxlY3Rpb25Ecml2ZXIiLCJvbmNlIiwiY29ubmVjdGlvbk9wdGlvbnMiLCJtb25nb1VybCIsIk1PTkdPX1VSTCIsIk1PTkdPX09QTE9HX1VSTCIsIl9vYmplY3RTcHJlYWQiLCJkZWZhdWx0IiwiY29ubmVjdGlvbiIsIm1hbmFnZXIiLCJpZEdlbmVyYXRpb24iLCJfZHJpdmVyIiwiX3ByZXZlbnRBdXRvcHVibGlzaCIsIl9tYWtlTmV3SUQiLCJzcmMiLCJERFAiLCJyYW5kb21TdHJlYW0iLCJSYW5kb20iLCJpbnNlY3VyZSIsImhleFN0cmluZyIsIl9jb25uZWN0aW9uIiwiaXNDbGllbnQiLCJzZXJ2ZXIiLCJfY29sbGVjdGlvbiIsIl9uYW1lIiwiX21heWJlU2V0VXBSZXBsaWNhdGlvbiIsImRlZmluZU11dGF0aW9uTWV0aG9kcyIsIl9kZWZpbmVNdXRhdGlvbk1ldGhvZHMiLCJ1c2VFeGlzdGluZyIsIl9zdXBwcmVzc1NhbWVOYW1lRXJyb3IiLCJhdXRvcHVibGlzaCIsInB1Ymxpc2giLCJpc19hdXRvIiwicmVnaXN0ZXJTdG9yZSIsIm9rIiwiYmVnaW5VcGRhdGUiLCJiYXRjaFNpemUiLCJyZXNldCIsInBhdXNlT2JzZXJ2ZXJzIiwibXNnIiwibW9uZ29JZCIsIk1vbmdvSUQiLCJpZFBhcnNlIiwicmVwbGFjZSIsImVuZFVwZGF0ZSIsInJlc3VtZU9ic2VydmVycyIsInNhdmVPcmlnaW5hbHMiLCJyZXRyaWV2ZU9yaWdpbmFscyIsImdldERvYyIsIl9nZXRDb2xsZWN0aW9uIiwiX2dldEZpbmRTZWxlY3RvciIsIl9nZXRGaW5kT3B0aW9ucyIsIk1hdGNoIiwiT3B0aW9uYWwiLCJPYmplY3RJbmNsdWRpbmciLCJPbmVPZiIsImZhbGxiYWNrSWQiLCJfc2VsZWN0b3JJc0lkIiwiZ2V0UHJvdG90eXBlT2YiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzIiwiZ2VuZXJhdGVJZCIsIl9pc1JlbW90ZUNvbGxlY3Rpb24iLCJlbmNsb3NpbmciLCJfQ3VycmVudE1ldGhvZEludm9jYXRpb24iLCJjaG9vc2VSZXR1cm5WYWx1ZUZyb21Db2xsZWN0aW9uUmVzdWx0Iiwid3JhcENhbGxiYWNrIiwiX2NhbGxNdXRhdG9yTWV0aG9kIiwib3B0aW9uc0FuZENhbGxiYWNrIiwicG9wQ2FsbGJhY2tGcm9tQXJncyIsInJhd0RhdGFiYXNlIiwiY29udmVydFJlc3VsdCIsIkFsbG93RGVueSIsIkNvbGxlY3Rpb25Qcm90b3R5cGUiLCJzZXRDb25uZWN0aW9uT3B0aW9ucyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLE1BQUlBLFVBQUo7QUFBZUMsU0FBTyxDQUFDQyxJQUFSLENBQWEsa0JBQWIsRUFBZ0M7QUFBQ0YsY0FBVSxDQUFDRyxDQUFELEVBQUc7QUFBQ0gsZ0JBQVUsR0FBQ0csQ0FBWDtBQUFhOztBQUE1QixHQUFoQyxFQUE4RCxDQUE5RDs7QUFBZjs7Ozs7Ozs7QUFTQSxNQUFJQyxPQUFPLEdBQUdDLGdCQUFkOztBQUNBLE1BQUlDLE1BQU0sR0FBR0MsR0FBRyxDQUFDQyxPQUFKLENBQVksZUFBWixDQUFiOztBQUdBQyxnQkFBYyxHQUFHLEVBQWpCO0FBRUFBLGdCQUFjLENBQUNDLFVBQWYsR0FBNEI7QUFDMUJDLFdBQU8sRUFBRTtBQUNQQyxhQUFPLEVBQUVDLHVCQURGO0FBRVBDLFlBQU0sRUFBRVY7QUFGRDtBQURpQixHQUE1QixDLENBT0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0FLLGdCQUFjLENB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QUNDLG1CQUZaOztBQUtBLFdBQVNKLG1CQUFULENBQTZCaFIsSUFBN0IsRUFBbUM7QUFDakM7QUFDQTtBQUNBLFFBQUlBLElBQUksQ0FBQ3hRLE1BQUwsS0FDQ3dRLElBQUksQ0FBQ0EsSUFBSSxDQUFDeFEsTUFBTCxHQUFjLENBQWYsQ0FBSixLQUEwQjNLLFNBQTFCLElBQ0FtYixJQUFJLENBQUNBLElBQUksQ0FBQ3hRLE1BQUwsR0FBYyxDQUFmLENBQUosWUFBaUN4QixRQUZsQyxDQUFKLEVBRWlEO0FBQy9DLGFBQU9nUyxJQUFJLENBQUNuQyxHQUFMLEVBQVA7QUFDRDtBQUNGOzs7Ozs7Ozs7Ozs7QUNseEJEOzs7Ozs7QUFNQXhaLEtBQUssQ0FBQ2d0QixvQkFBTixHQUE2QixTQUFTQSxvQkFBVCxDQUErQnpwQixPQUEvQixFQUF3QztBQUNuRW9aLE9BQUssQ0FBQ3BaLE9BQUQsRUFBVU0sTUFBVixDQUFMO0FBQ0E3RCxPQUFLLENBQUNvRSxrQkFBTixHQUEyQmIsT0FBM0I7QUFDRCxDQUhELEMiLCJmaWxlIjoiL3BhY2thZ2VzL21vbmdvLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBQcm92aWRlIGEgc3luY2hyb25vdXMgQ29sbGVjdGlvbiBBUEkgdXNpbmcgZmliZXJzLCBiYWNrZWQgYnlcbiAqIE1vbmdvREIuICBUaGlzIGlzIG9ubHkgZm9yIHVzZSBvbiB0aGUgc2VydmVyLCBhbmQgbW9zdGx5IGlkZW50aWNhbFxuICogdG8gdGhlIGNsaWVudCBBUEkuXG4gKlxuICogTk9URTogdGhlIHB1YmxpYyBBUEkgbWV0aG9kcyBtdXN0IGJlIHJ1biB3aXRoaW4gYSBmaWJlci4gSWYgeW91IGNhbGxcbiAqIHRoZXNlIG91dHNpZGUgb2YgYSBmaWJlciB0aGV5IHdpbGwgZXhwbG9kZSFcbiAqL1xuXG52YXIgTW9uZ29EQiA9IE5wbU1vZHVsZU1vbmdvZGI7XG52YXIgRnV0dXJlID0gTnBtLnJlcXVpcmUoJ2ZpYmVycy9mdXR1cmUnKTtcbmltcG9ydCB7IERvY0ZldGNoZXIgfSBmcm9tIFwiLi9kb2NfZmV0Y2hlci5qc1wiO1xuXG5Nb25nb0ludGVybmFscyA9IHt9O1xuXG5Nb25nb0ludGVybmFscy5OcG1Nb2R1bGVzID0ge1xuICBtb25nb2RiOiB7XG4gICAgdmVyc2lvbjogTnBtTW9kdWxlTW9uZ29kYlZlcnNpb24sXG4gICAgbW9kdWxlOiBNb25nb0RCXG4gIH1cbn07XG5cbi8vIE9sZGVyIHZlcnNpb24gb2Ygd2hhdCBpcyBub3cgYXZhaWxhYmxlIHZpYVxuLy8gTW9uZ29JbnRlcm5hbHMuTnBtTW9kdWxlcy5tb25nb2RiLm1vZHVsZS4gIEl0IHdhcyBuZXZlciBkb2N1bWVudGVkLCBidXRcbi8vIHBlb3BsZSBkbyB1c2UgaXQuXG4vLyBYWFggQ09NUEFUIFdJVEggMS4wLjMuMlxuTW9uZ29JbnRlcm5hbHMuTnBtTW9kdWxlID0gTW9uZ29EQjtcblxuLy8gVGhpcyBpcyB1c2VkIHRvIGFkZCBvciByZW1vdmUgRUpTT04gZnJvbSB0aGUgYmVnaW5uaW5nIG9mIGV2ZXJ5dGhpbmcgbmVzdGVkXG4vLyBpbnNpZGUgYW4gRUpTT04gY3VzdG9tIHR5cGUuIEl0IHNob3VsZCBvbmx5IGJlIGNhbGxlZCBvbiBwdXJlIEpTT04hXG52YXIgcmVwbGFjZU5hbWVzID0gZnVuY3Rpb24gKGZpbHRlciwgdGhpbmcpIHtcbiAgaWYgKHR5cGVvZiB0aGluZyA9PT0gXCJvYmplY3RcIiAmJiB0aGluZyAhPT0gbnVsbCkge1xuICAgIGlmIChfLmlzQXJyYXkodGhpbmcpKSB7XG4gICAgICByZXR1cm4gXy5tYXAodGhpbmcsIF8uYmluZChyZXBsYWNlTmFtZXMsIG51bGwsIGZpbHRlcikpO1xuICAgIH1cbiAgICB2YXIgcmV0ID0ge307XG4gICAgXy5lYWNoKHRoaW5nLCBmdW5jdGlvbiAodmFsdWUsIGtleSkge1xuICAgICAgcmV0W2ZpbHRlcihrZXkpXSA9IHJlcGxhY2VOYW1lcyhmaWx0ZXIsIHZhbHVlKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmV0O1xuICB9XG4gIHJldHVybiB0aGluZztcbn07XG5cbi8vIEVuc3VyZSB0aGF0IEVKU09OLmNsb25lIGtlZXBzIGEgVGltZXN0YW1wIGFzIGEgVGltZXN0YW1wIChpbnN0ZWFkIG9mIGp1c3Rcbi8vIGRvaW5nIGEgc3RydWN0dXJhbCBjbG9uZSkuXG4vLyBYWFggaG93IG9rIGlzIHRoaXM/IHdoYXQgaWYgdGhlcmUgYXJlIG11bHRpcGxlIGNvcGllcyBvZiBNb25nb0RCIGxvYWRlZD9cbk1vbmdvREIuVGltZXN0YW1wLnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uICgpIHtcbiAgLy8gVGltZXN0YW1wcyBzaG91bGQgYmUgaW1tdXRhYmxlLlxuICByZXR1cm4gdGhpcztcbn07XG5cbnZhciBtYWtlTW9uZ29MZWdhbCA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBcIkVKU09OXCIgKyBuYW1lOyB9O1xudmFyIHVubWFrZU1vbmdvTGVnYWwgPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gbmFtZS5zdWJzdHIoNSk7IH07XG5cbnZhciByZXBsYWNlTW9uZ29BdG9tV2l0aE1ldGVvciA9IGZ1bmN0aW9uIChkb2N1bWVudCkge1xuICBpZiAoZG9jdW1lbnQgaW5zdGFuY2VvZiBNb25nb0RCLkJpbmFyeSkge1xuICAgIHZhciBidWZmZXIgPSBkb2N1bWVudC52YWx1ZSh0cnVlKTtcbiAgICByZXR1cm4gbmV3IFVpbnQ4QXJyYXkoYnVmZmVyKTtcbiAgfVxuICBpZiAoZG9jdW1lbnQgaW5zdGFuY2VvZiBNb25nb0RCLk9iamVjdElEKSB7XG4gICAgcmV0dXJuIG5ldyBNb25nby5PYmplY3RJRChkb2N1bWVudC50b0hleFN0cmluZygpKTtcbiAgfVxuICBpZiAoZG9jdW1lbnQgaW5zdGFuY2VvZiBNb25nb0RCLkRlY2ltYWwxMjgpIHtcbiAgICByZXR1cm4gRGVjaW1hbChkb2N1bWVudC50b1N0cmluZygpKTtcbiAgfVxuICBpZiAoZG9jdW1lbnRbXCJFSlNPTiR0eXBlXCJdICYmIGRvY3VtZW50W1wiRUpTT04kdmFsdWVcIl0gJiYgXy5zaXplKGRvY3VtZW50KSA9PT0gMikge1xuICAgIHJldHVybiBFSlNPTi5mcm9tSlNPTlZhbHVlKHJlcGxhY2VOYW1lcyh1bm1ha2VNb25nb0xlZ2FsLCBkb2N1bWVudCkpO1xuICB9XG4gIGlmIChkb2N1bWVudCBpbnN0YW5jZW9mIE1vbmdvREIuVGltZXN0YW1wKSB7XG4gICAgLy8gRm9yIG5vdywgdGhlIE1ldGVvciByZXByZXNlbnRhdGlvbiBvZiBhIE1vbmdvIHRpbWVzdGFtcCB0eXBlIChub3QgYSBkYXRlIVxuICAgIC8vIHRoaXMgaXMgYSB3ZWlyZCBpbnRlcm5hbCB0aGluZyB1c2VkIGluIHRoZSBvcGxvZyEpIGlzIHRoZSBzYW1lIGFzIHRoZVxuICAgIC8vIE1vbmdvIHJlcHJlc2VudGF0aW9uLiBXZSBuZWVkIHRvIGRvIHRoaXMgZXhwbGljaXRseSBvciBlbHNlIHdlIHdvdWxkIGRvIGFcbiAgICAvLyBzdHJ1Y3R1cmFsIGNsb25lIGFuZCBsb3NlIHRoZSBwcm90b3R5cGUuXG4gICAgcmV0dXJuIGRvY3VtZW50O1xuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59O1xuXG52YXIgcmVwbGFjZU1ldGVvckF0b21XaXRoTW9uZ28gPSBmdW5jdGlvbiAoZG9jdW1lbnQpIHtcbiAgaWYgKEVKU09OLmlzQmluYXJ5KGRvY3VtZW50KSkge1xuICAgIC8vIFRoaXMgZG9lcyBtb3JlIGNvcGllcyB0aGFuIHdlJ2QgbGlrZSwgYnV0IGlzIG5lY2Vzc2FyeSBiZWNhdXNlXG4gICAgLy8gTW9uZ29EQi5CU09OIG9ubHkgbG9va3MgbGlrZSBpdCB0YWtlcyBhIFVpbnQ4QXJyYXkgKGFuZCBkb2Vzbid0IGFjdHVhbGx5XG4gICAgLy8gc2VyaWFsaXplIGl0IGNvcnJlY3RseSkuXG4gICAgLy8gcmV0dXJuIG5ldyBNb25nb0RCLkJpbmFyeShCdWZmZXIuZnJvbShkb2N1bWVudCkpO1xuICB9XG4gIGlmIChkb2N1bWVudCBpbnN0YW5jZW9mIE1vbmdvLk9iamVjdElEKSB7XG4gICAgcmV0dXJuIG5ldyBNb25nb0RCLk9iamVjdElEKGRvY3VtZW50LnRvSGV4U3RyaW5nKCkpO1xuICB9XG4gIGlmIChkb2N1bWVudCBpbnN0YW5jZW9mIE1vbmdvREIuVGltZXN0YW1wKSB7XG4gICAgLy8gRm9yIG5vdywgdGhlIE1ldGVvciByZXByZXNlbnRhdGlvbiBvZiBhIE1vbmdvIHRpbWVzdGFtcCB0eXBlIChub3QgYSBkYXRlIVxuICAgIC8vIHRoaXMgaXMgYSB3ZWlyZCBpbnRlcm5hbCB0aGluZyB1c2VkIGluIHRoZSBvcGxvZyEpIGlzIHRoZSBzYW1lIGFzIHRoZVxuICAgIC8vIE1vbmdvIHJlcHJlc2VudGF0aW9uLiBXZSBuZWVkIHRvIGRvIHRoaXMgZXhwbGljaXRseSBvciBlbHNlIHdlIHdvdWxkIGRvIGFcbiAgICAvLyBzdHJ1Y3R1cmFsIGNsb25lIGFuZCBsb3NlIHRoZSBwcm90b3R5cGUuXG4gICAgcmV0dXJuIGRvY3VtZW50O1xuICB9XG4gIGlmIChkb2N1bWVudCBpbnN0YW5jZW9mIERlY2ltYWwpIHtcbiAgICByZXR1cm4gTW9uZ29EQi5EZWNpbWFsMTI4LmZyb21TdHJpbmcoZG9jdW1lbnQudG9TdHJpbmcoKSk7XG4gIH1cbiAgaWYgKEVKU09OLl9pc0N1c3RvbVR5cGUoZG9jdW1lbnQpKSB7XG4gICAgcmV0dXJuIHJlcGxhY2VOYW1lcyhtYWtlTW9uZ29MZWdhbCwgRUpTT04udG9KU09OVmFsdWUoZG9jdW1lbnQpKTtcbiAgfVxuICAvLyBJdCBpcyBub3Qgb3JkaW5hcmlseSBwb3NzaWJsZSB0byBzdGljayBkb2xsYXItc2lnbiBrZXlzIGludG8gbW9uZ29cbiAgLy8gc28gd2UgZG9uJ3QgYm90aGVyIGNoZWNraW5nIGZvciB0aGluZ3MgdGhhdCBuZWVkIGVzY2FwaW5nIGF0IHRoaXMgdGltZS5cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn07XG5cbnZhciByZXBsYWNlVHlwZXMgPSBmdW5jdGlvbiAoZG9jdW1lbnQsIGF0b21UcmFuc2Zvcm1lcikge1xuICBpZiAodHlwZW9mIGRvY3VtZW50ICE9PSAnb2JqZWN0JyB8fCBkb2N1bWVudCA9PT0gbnVsbClcbiAgICByZXR1cm4gZG9jdW1lbnQ7XG5cbiAgdmFyIHJlcGxhY2VkVG9wTGV2ZWxBdG9tID0gYXRvbVRyYW5zZm9ybWVyKGRvY3VtZW50KTtcbiAgaWYgKHJlcGxhY2VkVG9wTGV2ZWxBdG9tICE9PSB1bmRlZmluZWQpXG4gICAgcmV0dXJuIHJlcGxhY2VkVG9wTGV2ZWxBdG9tO1xuXG4gIHZhciByZXQgPSBkb2N1bWVudDtcbiAgXy5lYWNoKGRvY3VtZW50LCBmdW5jdGlvbiAodmFsLCBrZXkpIHtcbiAgICB2YXIgdmFsUmVwbGFjZWQgPSByZXBsYWNlVHlwZXModmFsLCBhdG9tVHJhbnNmb3JtZXIpO1xuICAgIGlmICh2YWwgIT09IHZhbFJlcGxhY2VkKSB7XG4gICAgICAvLyBMYXp5IGNsb25lLiBTaGFsbG93IGNvcHkuXG4gICAgICBpZiAocmV0ID09PSBkb2N1bWVudClcbiAgICAgICAgcmV0ID0gXy5jbG9uZShkb2N1bWVudCk7XG4gICAgICByZXRba2V5XSA9IHZhbFJlcGxhY2VkO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiByZXQ7XG59O1xubGV0IFNURUVET1NfTU9OR09EQl9NT05JVE9SX0NPTU1BTkRTID0gZmFsc2U7XG5sZXQgU0xPV19RVUVSWV9USFJFU0hPTERfTVMgPSAzMDA7XG5pZihwcm9jZXNzLmVudi5TVEVFRE9TX01PTkdPREJfU0xPV19RVUVSWV9USFJFU0hPTEQpe1xuICBTVEVFRE9TX01PTkdPREJfTU9OSVRPUl9DT01NQU5EUyA9IHRydWU7XG4gIFNMT1dfUVVFUllfVEhSRVNIT0xEX01TID0gTnVtYmVyKHByb2Nlc3MuZW52LlNURUVET1NfTU9OR09EQl9TTE9XX1FVRVJZX1RIUkVTSE9MRCk7XG59XG5cbmxldCBTVEVFRE9TX01PTkdPREJfT1BMT0dfTU9OSVRPUl9DT01NQU5EUyA9IGZhbHNlO1xubGV0IE9QTE9HX1NMT1dfUVVFUllfVEhSRVNIT0xEX01TID0gMzAwO1xuaWYocHJvY2Vzcy5lbnYuU1RFRURPU19NT05HT0RCX1NMT1dfUVVFUllfVEhSRVNIT0xEKXtcbiAgU1RFRURPU19NT05HT0RCX09QTE9HX01PTklUT1JfQ09NTUFORFMgPSB0cnVlO1xuICBPUExPR19TTE9XX1FVRVJZX1RIUkVTSE9MRF9NUyA9IE51bWJlcihwcm9jZXNzLmVudi5TVEVFRE9TX01PTkdPREJfT1BMT0dfU0xPV19RVUVSWV9USFJFU0hPTEQpO1xufVxuXG4vLyDlrZjlgqjov5vooYzkuK3nmoTlkb3ku6TvvIznlKjkuo7orqHnrpfogJfml7ZcbmNvbnN0IHJ1bm5pbmdDb21tYW5kcyA9IG5ldyBNYXAoKTtcblxuZnVuY3Rpb24gY29ubmVjdEFuZE1vbml0b3IoY2xpZW50KSB7XG4gICAgLy8gMS4g55uR5ZCsIENvbW1hbmQgU3RhcnRlZCDkuovku7ZcbiAgICBjbGllbnQub24oJ2NvbW1hbmRTdGFydGVkJywgKGV2ZW50KSA9PiB7XG4gICAgICAgIC8vIOiusOW9leWRveS7pOW8gOWni+aXtumXtFxuICAgICAgICBydW5uaW5nQ29tbWFuZHMuc2V0KGV2ZW50LnJlcXVlc3RJZCwgeyBcbiAgICAgICAgICAgIHN0YXJ0VGltZTogRGF0ZS5ub3coKSxcbiAgICAgICAgICAgIGNvbW1hbmROYW1lOiBldmVudC5jb21tYW5kTmFtZSxcbiAgICAgICAgICAgIGRhdGFiYXNlTmFtZTogZXZlbnQuZGF0YWJhc2VOYW1lLFxuICAgICAgICAgICAgY29tbWFuZDogZXZlbnQuY29tbWFuZFxuICAgICAgICAgICAgLy8g5Y+v5Lul5Zyo6L+Z6YeM6K6w5b2VIGV2ZW50LmNvbW1hbmQg562J5L+h5oGvXG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gMi4g55uR5ZCsIENvbW1hbmQgU3VjY2VlZGVkIOS6i+S7tlxuICAgIGNsaWVudC5vbignY29tbWFuZFN1Y2NlZWRlZCcsIChldmVudCkgPT4ge1xuICAgICAgICBjb25zdCBjb21tYW5kSW5mbyA9IHJ1bm5pbmdDb21tYW5kcy5nZXQoZXZlbnQucmVxdWVzdElkKTtcbiAgICAgICAgaWYgKCFjb21tYW5kSW5mbykgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IGR1cmF0aW9uID0gRGF0ZS5ub3coKSAtIGNvbW1hbmRJbmZvLnN0YXJ0VGltZTtcbiAgICAgICAgcnVubmluZ0NvbW1hbmRzLmRlbGV0ZShldmVudC5yZXF1ZXN0SWQpO1xuICAgICAgICBpZihjb21tYW5kSW5mby5kYXRhYmFzZU5hbWUgPT09ICdsb2NhbCcpe1xuICAgICAgICAgIGlmIChTVEVFRE9TX01PTkdPREJfT1BMT0dfTU9OSVRPUl9DT01NQU5EUyAmJiBkdXJhdGlvbiA+PSBPUExPR19TTE9XX1FVRVJZX1RIUkVTSE9MRF9NUykge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKGDwn5qoIE1ldGVvciBNb25nb2RiIOaFouafpeivouajgOa1i+WIsCAo5oiQ5YqfKTpgKTtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgICAg5ZG95LukOiAke2NvbW1hbmRJbmZvLmNvbW1hbmROYW1lfWApO1xuICAgICAgICAgICAgY29uc29sZS53YXJuKGAgICDogJfml7Y6ICR7ZHVyYXRpb259IG1zYCk7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYCAgIOaVsOaNruW6kzogJHtjb21tYW5kSW5mby5kYXRhYmFzZU5hbWV9YCk7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYCAgIGNvbW1hbmQ6ICR7SlNPTi5zdHJpbmdpZnkoY29tbWFuZEluZm8uY29tbWFuZCl9YCk7XG4gICAgICAgICAgfVxuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICBpZiAoZHVyYXRpb24gPj0gU0xPV19RVUVSWV9USFJFU0hPTERfTVMpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2Fybihg8J+aqCBNZXRlb3IgTW9uZ29kYiDmhaLmn6Xor6Lmo4DmtYvliLAgKOaIkOWKnyk6YCk7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYCAgIOWRveS7pDogJHtjb21tYW5kSW5mby5jb21tYW5kTmFtZX1gKTtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgICAg6ICX5pe2OiAke2R1cmF0aW9ufSBtc2ApO1xuICAgICAgICAgICAgY29uc29sZS53YXJuKGAgICDmlbDmja7lupM6ICR7Y29tbWFuZEluZm8uZGF0YWJhc2VOYW1lfWApO1xuICAgICAgICAgICAgY29uc29sZS53YXJuKGAgICBjb21tYW5kOiAke0pTT04uc3RyaW5naWZ5KGNvbW1hbmRJbmZvLmNvbW1hbmQpfWApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBcbiAgICB9KTtcblxuICAgIC8vIDMuIOebkeWQrCBDb21tYW5kIEZhaWxlZCDkuovku7ZcbiAgICBjbGllbnQub24oJ2NvbW1hbmRGYWlsZWQnLCAoZXZlbnQpID0+IHtcbiAgICAgICAgY29uc3QgY29tbWFuZEluZm8gPSBydW5uaW5nQ29tbWFuZHMuZ2V0KGV2ZW50LnJlcXVlc3RJZCk7XG4gICAgICAgIGlmICghY29tbWFuZEluZm8pIHJldHVybjtcblxuICAgICAgICBjb25zdCBkdXJhdGlvbiA9IERhdGUubm93KCkgLSBjb21tYW5kSW5mby5zdGFydFRpbWU7XG4gICAgICAgIHJ1bm5pbmdDb21tYW5kcy5kZWxldGUoZXZlbnQucmVxdWVzdElkKTtcbiAgICAgICAgXG4gICAgICAgIC8vIOWksei0peeahOWRveS7pOS5n+WPr+iDveaYr+aFouaTjeS9nFxuICAgICAgICBpZihjb21tYW5kSW5mby5kYXRhYmFzZU5hbWUgPT09ICdsb2NhbCcpe1xuICAgICAgICAgIGlmIChTVEVFRE9TX01PTkdPREJfT1BMT0dfTU9OSVRPUl9DT01NQU5EUyAmJiBkdXJhdGlvbiA+PSBPUExPR19TTE9XX1FVRVJZX1RIUkVTSE9MRF9NUykge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihg4p2MIOaFouaTjeS9nOajgOa1i+WIsCAo5aSx6LSlKTpgKTtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYCAgIOWRveS7pDogJHtjb21tYW5kSW5mby5jb21tYW5kTmFtZX1gKTtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYCAgIOiAl+aXtjogJHtkdXJhdGlvbn0gbXNgKTtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYCAgIOmUmeivrzogJHtldmVudC5mYWlsdXJlLm1lc3NhZ2V9YCk7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGAgICBjb21tYW5kOiAke2NvbW1hbmRJbmZvLmNvbW1hbmR9YCk7XG4gICAgICAgICAgfVxuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICBpZiAoZHVyYXRpb24gPj0gU0xPV19RVUVSWV9USFJFU0hPTERfTVMpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihg4p2MIOaFouaTjeS9nOajgOa1i+WIsCAo5aSx6LSlKTpgKTtcbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihgICAg5ZG95LukOiAke2NvbW1hbmRJbmZvLmNvbW1hbmROYW1lfWApO1xuICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGAgICDogJfml7Y6ICR7ZHVyYXRpb259IG1zYCk7XG4gICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYCAgIOmUmeivrzogJHtldmVudC5mYWlsdXJlLm1lc3NhZ2V9YCk7XG4gICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYCAgIGNvbW1hbmQ6ICR7Y29tbWFuZEluZm8uY29tbWFuZH1gKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuXG5Nb25nb0Nvbm5lY3Rpb24gPSBmdW5jdGlvbiAodXJsLCBvcHRpb25zKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIHNlbGYuX29ic2VydmVNdWx0aXBsZXhlcnMgPSB7fTtcbiAgc2VsZi5fb25GYWlsb3Zlckhvb2sgPSBuZXcgSG9vaztcblxuICB2YXIgbW9uZ29PcHRpb25zID0gT2JqZWN0LmFzc2lnbih7XG4gICAgLy8gUmVjb25uZWN0IG9uIGVycm9yLlxuICAgIGF1dG9SZWNvbm5lY3Q6IHRydWUsXG4gICAgLy8gVHJ5IHRvIHJlY29ubmVjdCBmb3JldmVyLCBpbnN0ZWFkIG9mIHN0b3BwaW5nIGFmdGVyIDMwIHRyaWVzICh0aGVcbiAgICAvLyBkZWZhdWx0KSwgd2l0aCBlYWNoIGF0dGVtcHQgc2VwYXJhdGVkIGJ5IDEwMDBtcy5cbiAgICByZWNvbm5lY3RUcmllczogSW5maW5pdHksXG4gICAgaWdub3JlVW5kZWZpbmVkOiB0cnVlLFxuICAgIC8vIFJlcXVpcmVkIHRvIHNpbGVuY2UgZGVwcmVjYXRpb24gd2FybmluZ3Mgd2l0aCBtb25nb2RiQDMuMS4xLlxuICAgIHVzZU5ld1VybFBhcnNlcjogdHJ1ZSxcbiAgfSwgTW9uZ28uX2Nvbm5lY3Rpb25PcHRpb25zKTtcblxuICAvLyBEaXNhYmxlIHRoZSBuYXRpdmUgcGFyc2VyIGJ5IGRlZmF1bHQsIHVubGVzcyBzcGVjaWZpY2FsbHkgZW5hYmxlZFxuICAvLyBpbiB0aGUgbW9uZ28gVVJMLlxuICAvLyAtIFRoZSBuYXRpdmUgZHJpdmVyIGNhbiBjYXVzZSBlcnJvcnMgd2hpY2ggbm9ybWFsbHkgd291bGQgYmVcbiAgLy8gICB0aHJvd24sIGNhdWdodCwgYW5kIGhhbmRsZWQgaW50byBzZWdmYXVsdHMgdGhhdCB0YWtlIGRvd24gdGhlXG4gIC8vICAgd2hvbGUgYXBwLlxuICAvLyAtIEJpbmFyeSBtb2R1bGVzIGRvbid0IHlldCB3b3JrIHdoZW4geW91IGJ1bmRsZSBhbmQgbW92ZSB0aGUgYnVuZGxlXG4gIC8vICAgdG8gYSBkaWZmZXJlbnQgcGxhdGZvcm0gKGFrYSBkZXBsb3kpXG4gIC8vIFdlIHNob3VsZCByZXZpc2l0IHRoaXMgYWZ0ZXIgYmluYXJ5IG5wbSBtb2R1bGUgc3VwcG9ydCBsYW5kcy5cbiAgaWYgKCEoL1tcXD8mXW5hdGl2ZV8/W3BQXWFyc2VyPS8udGVzdCh1cmwpKSkge1xuICAgIG1vbmdvT3B0aW9ucy5uYXRpdmVfcGFyc2VyID0gZmFsc2U7XG4gIH1cblxuICBpZiAoU1RFRURPU19NT05HT0RCX01PTklUT1JfQ09NTUFORFMpe1xuICAgIG1vbmdvT3B0aW9ucy5tb25pdG9yQ29tbWFuZHMgPSB0cnVlXG4gIH1cblxuICAvLyBJbnRlcm5hbGx5IHRoZSBvcGxvZyBjb25uZWN0aW9ucyBzcGVjaWZ5IHRoZWlyIG93biBwb29sU2l6ZVxuICAvLyB3aGljaCB3ZSBkb24ndCB3YW50IHRvIG92ZXJ3cml0ZSB3aXRoIGFueSB1c2VyIGRlZmluZWQgdmFsdWVcbiAgaWYgKF8uaGFzKG9wdGlvbnMsICdwb29sU2l6ZScpKSB7XG4gICAgLy8gSWYgd2UganVzdCBzZXQgdGhpcyBmb3IgXCJzZXJ2ZXJcIiwgcmVwbFNldCB3aWxsIG92ZXJyaWRlIGl0LiBJZiB3ZSBqdXN0XG4gICAgLy8gc2V0IGl0IGZvciByZXBsU2V0LCBpdCB3aWxsIGJlIGlnbm9yZWQgaWYgd2UncmUgbm90IHVzaW5nIGEgcmVwbFNldC5cbiAgICBtb25nb09wdGlvbnMucG9vbFNpemUgPSBvcHRpb25zLnBvb2xTaXplO1xuICB9XG5cbiAgc2VsZi5kYiA9IG51bGw7XG4gIC8vIFdlIGtlZXAgdHJhY2sgb2YgdGhlIFJlcGxTZXQncyBwcmltYXJ5LCBzbyB0aGF0IHdlIGNhbiB0cmlnZ2VyIGhvb2tzIHdoZW5cbiAgLy8gaXQgY2hhbmdlcy4gIFRoZSBOb2RlIGRyaXZlcidzIGpvaW5lZCBjYWxsYmFjayBzZWVtcyB0byBmaXJlIHdheSB0b29cbiAgLy8gb2Z0ZW4sIHdoaWNoIGlzIHdoeSB3ZSBuZWVkIHRvIHRyYWNrIGl0IG91cnNlbHZlcy5cbiAgc2VsZi5fcHJpbWFyeSA9IG51bGw7XG4gIHNlbGYuX29wbG9nSGFuZGxlID0gbnVsbDtcbiAgc2VsZi5fZG9jRmV0Y2hlciA9IG51bGw7XG5cblxuICB2YXIgY29ubmVjdEZ1dHVyZSA9IG5ldyBGdXR1cmU7XG4gIE1vbmdvREIuY29ubmVjdChcbiAgICB1cmwsXG4gICAgbW9uZ29PcHRpb25zLFxuICAgIE1ldGVvci5iaW5kRW52aXJvbm1lbnQoXG4gICAgICBmdW5jdGlvbiAoZXJyLCBjbGllbnQpIHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChTVEVFRE9TX01PTkdPREJfTU9OSVRPUl9DT01NQU5EUyl7XG4gICAgICAgICAgY29ubmVjdEFuZE1vbml0b3IoY2xpZW50KVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGRiID0gY2xpZW50LmRiKCk7XG5cbiAgICAgICAgLy8gRmlyc3QsIGZpZ3VyZSBvdXQgd2hhdCB0aGUgY3VycmVudCBwcmltYXJ5IGlzLCBpZiBhbnkuXG4gICAgICAgIGlmIChkYi5zZXJ2ZXJDb25maWcuaXNNYXN0ZXJEb2MpIHtcbiAgICAgICAgICBzZWxmLl9wcmltYXJ5ID0gZGIuc2VydmVyQ29uZmlnLmlzTWFzdGVyRG9jLnByaW1hcnk7XG4gICAgICAgIH1cblxuICAgICAgICBkYi5zZXJ2ZXJDb25maWcub24oXG4gICAgICAgICAgJ2pvaW5lZCcsIE1ldGVvci5iaW5kRW52aXJvbm1lbnQoZnVuY3Rpb24gKGtpbmQsIGRvYykge1xuICAgICAgICAgICAgaWYgKGtpbmQgPT09ICdwcmltYXJ5Jykge1xuICAgICAgICAgICAgICBpZiAoZG9jLnByaW1hcnkgIT09IHNlbGYuX3ByaW1hcnkpIHtcbiAgICAgICAgICAgICAgICBzZWxmLl9wcmltYXJ5ID0gZG9jLnByaW1hcnk7XG4gICAgICAgICAgICAgICAgc2VsZi5fb25GYWlsb3Zlckhvb2suZWFjaChmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChkb2MubWUgPT09IHNlbGYuX3ByaW1hcnkpIHtcbiAgICAgICAgICAgICAgLy8gVGhlIHRoaW5nIHdlIHRob3VnaHQgd2FzIHByaW1hcnkgaXMgbm93IHNvbWV0aGluZyBvdGhlciB0aGFuXG4gICAgICAgICAgICAgIC8vIHByaW1hcnkuICBGb3JnZXQgdGhhdCB3ZSB0aG91Z2h0IGl0IHdhcyBwcmltYXJ5LiAgKFRoaXMgbWVhbnNcbiAgICAgICAgICAgICAgLy8gdGhhdCBpZiBhIHNlcnZlciBzdG9wcyBiZWluZyBwcmltYXJ5IGFuZCB0aGVuIHN0YXJ0cyBiZWluZ1xuICAgICAgICAgICAgICAvLyBwcmltYXJ5IGFnYWluIHdpdGhvdXQgYW5vdGhlciBzZXJ2ZXIgYmVjb21pbmcgcHJpbWFyeSBpbiB0aGVcbiAgICAgICAgICAgICAgLy8gbWlkZGxlLCB3ZSdsbCBjb3JyZWN0bHkgY291bnQgaXQgYXMgYSBmYWlsb3Zlci4pXG4gICAgICAgICAgICAgIHNlbGYuX3ByaW1hcnkgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pKTtcblxuICAgICAgICAvLyBBbGxvdyB0aGUgY29uc3RydWN0b3IgdG8gcmV0dXJuLlxuICAgICAgICBjb25uZWN0RnV0dXJlWydyZXR1cm4nXSh7IGNsaWVudCwgZGIgfSk7XG4gICAgICB9LFxuICAgICAgY29ubmVjdEZ1dHVyZS5yZXNvbHZlcigpICAvLyBvbkV4Y2VwdGlvblxuICAgIClcbiAgKTtcblxuICAvLyBXYWl0IGZvciB0aGUgY29ubmVjdGlvbiB0byBiZSBzdWNjZXNzZnVsICh0aHJvd3Mgb24gZmFpbHVyZSkgYW5kIGFzc2lnbiB0aGVcbiAgLy8gcmVzdWx0cyAoYGNsaWVudGAgYW5kIGBkYmApIHRvIGBzZWxmYC5cbiAgT2JqZWN0LmFzc2lnbihzZWxmLCBjb25uZWN0RnV0dXJlLndhaXQoKSk7XG5cbiAgaWYgKG9wdGlvbnMub3Bsb2dVcmwgJiYgISBQYWNrYWdlWydkaXNhYmxlLW9wbG9nJ10pIHtcbiAgICBzZWxmLl9vcGxvZ0hhbmRsZSA9IG5ldyBPcGxvZ0hhbmRsZShvcHRpb25zLm9wbG9nVXJsLCBzZWxmLmRiLmRhdGFiYXNlTmFtZSk7XG4gICAgc2VsZi5fZG9jRmV0Y2hlciA9IG5ldyBEb2NGZXRjaGVyKHNlbGYpO1xuICB9XG59O1xuXG5Nb25nb0Nvbm5lY3Rpb24ucHJvdG90eXBlLmNsb3NlID0gZnVuY3Rpb24oKSB7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICBpZiAoISBzZWxmLmRiKVxuICAgIHRocm93IEVycm9yKFwiY2xvc2UgY2FsbGVkIGJlZm9yZSBDb25uZWN0aW9uIGNyZWF0ZWQ/XCIpO1xuXG4gIC8vIFhYWCBwcm9iYWJseSB1bnRlc3RlZFxuICB2YXIgb3Bsb2dIYW5kbGUgPSBzZWxmLl9vcGxvZ0hhbmRsZTtcbiAgc2VsZi5fb3Bsb2dIYW5kbGUgPSBudWxsO1xuICBpZiAob3Bsb2dIYW5kbGUpXG4gICAgb3Bsb2dIYW5kbGUuc3RvcCgpO1xuXG4gIC8vIFVzZSBGdXR1cmUud3JhcCBzbyB0aGF0IGVycm9ycyBnZXQgdGhyb3duLiBUaGlzIGhhcHBlbnMgdG9cbiAgLy8gd29yayBldmVuIG91dHNpZGUgYSBmaWJlciBzaW5jZSB0aGUgJ2Nsb3NlJyBtZXRob2QgaXMgbm90XG4gIC8vIGFjdHVhbGx5IGFzeW5jaHJvbm91cy5cbiAgRnV0dXJlLndyYXAoXy5iaW5kKHNlbGYuY2xpZW50LmNsb3NlLCBzZWxmLmNsaWVudCkpKHRydWUpLndhaXQoKTtcbn07XG5cbi8vIFJldHVybnMgdGhlIE1vbmdvIENvbGxlY3Rpb24gb2JqZWN0OyBtYXkgeWllbGQuXG5Nb25nb0Nvbm5lY3Rpb24ucHJvdG90eXBlLnJhd0NvbGxlY3Rpb24gPSBmdW5jdGlvbiAoY29sbGVjdGlvbk5hbWUpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIGlmICghIHNlbGYuZGIpXG4gICAgdGhyb3cgRXJyb3IoXCJyYXdDb2xsZWN0aW9uIGNhbGxlZCBiZWZvcmUgQ29ubmVjdGlvbiBjcmVhdGVkP1wiKTtcblxuICB2YXIgZnV0dXJlID0gbmV3IEZ1dHVyZTtcbiAgc2VsZi5kYi5jb2xsZWN0aW9uKGNvbGxlY3Rpb25OYW1lLCBmdXR1cmUucmVzb2x2ZXIoKSk7XG4gIHJldHVybiBmdXR1cmUud2FpdCgpO1xufTtcblxuTW9uZ29Db25uZWN0aW9uLnByb3RvdHlwZS5fY3JlYXRlQ2FwcGVkQ29sbGVjdGlvbiA9IGZ1bmN0aW9uIChcbiAgICBjb2xsZWN0aW9uTmFtZSwgYnl0ZVNpemUsIG1heERvY3VtZW50cykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgaWYgKCEgc2VsZi5kYilcbiAgICB0aHJvdyBFcnJvcihcIl9jcmVhdGVDYXBwZWRDb2xsZWN0aW9uIGNhbGxlZCBiZWZvcmUgQ29ubmVjdGlvbiBjcmVhdGVkP1wiKTtcblxuICB2YXIgZnV0dXJlID0gbmV3IEZ1dHVyZSgpO1xuICBzZWxmLmRiLmNyZWF0ZUNvbGxlY3Rpb24oXG4gICAgY29sbGVjdGlvbk5hbWUsXG4gICAgeyBjYXBwZWQ6IHRydWUsIHNpemU6IGJ5dGVTaXplLCBtYXg6IG1heERvY3VtZW50cyB9LFxuICAgIGZ1dHVyZS5yZXNvbHZlcigpKTtcbiAgZnV0dXJlLndhaXQoKTtcbn07XG5cbi8vIFRoaXMgc2hvdWxkIGJlIGNhbGxlZCBzeW5jaHJvbm91c2x5IHdpdGggYSB3cml0ZSwgdG8gY3JlYXRlIGFcbi8vIHRyYW5zYWN0aW9uIG9uIHRoZSBjdXJyZW50IHdyaXRlIGZlbmNlLCBpZiBhbnkuIEFmdGVyIHdlIGNhbiByZWFkXG4vLyB0aGUgd3JpdGUsIGFuZCBhZnRlciBvYnNlcnZlcnMgaGF2ZSBiZWVuIG5vdGlmaWVkIChvciBhdCBsZWFzdCxcbi8vIGFmdGVyIHRoZSBvYnNlcnZlciBub3RpZmllcnMgaGF2ZSBhZGRlZCB0aGVtc2VsdmVzIHRvIHRoZSB3cml0ZVxuLy8gZmVuY2UpLCB5b3Ugc2hvdWxkIGNhbGwgJ2NvbW1pdHRlZCgpJyBvbiB0aGUgb2JqZWN0IHJldHVybmVkLlxuTW9uZ29Db25uZWN0aW9uLnByb3RvdHlwZS5fbWF5YmVCZWdpbldyaXRlID0gZnVuY3Rpb24gKCkge1xuICB2YXIgZmVuY2UgPSBERFBTZXJ2ZXIuX0N1cnJlbnRXcml0ZUZlbmNlLmdldCgpO1xuICBpZiAoZmVuY2UpIHtcbiAgICByZXR1cm4gZmVuY2UuYmVnaW5Xcml0ZSgpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB7Y29tbWl0dGVkOiBmdW5jdGlvbiAoKSB7fX07XG4gIH1cbn07XG5cbi8vIEludGVybmFsIGludGVyZmFjZTogYWRkcyBhIGNhbGxiYWNrIHdoaWNoIGlzIGNhbGxlZCB3aGVuIHRoZSBNb25nbyBwcmltYXJ5XG4vLyBjaGFuZ2VzLiBSZXR1cm5zIGEgc3RvcCBoYW5kbGUuXG5Nb25nb0Nvbm5lY3Rpb24ucHJvdG90eXBlLl9vbkZhaWxvdmVyID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gIHJldHVybiB0aGlzLl9vbkZhaWxvdmVySG9vay5yZWdpc3RlcihjYWxsYmFjayk7XG59O1xuXG5cbi8vLy8vLy8vLy8vLyBQdWJsaWMgQVBJIC8vLy8vLy8vLy9cblxuLy8gVGhlIHdyaXRlIG1ldGhvZHMgYmxvY2sgdW50aWwgdGhlIGRhdGFiYXNlIGhhcyBjb25maXJtZWQgdGhlIHdyaXRlIChpdCBtYXlcbi8vIG5vdCBiZSByZXBsaWNhdGVkIG9yIHN0YWJsZSBvbiBkaXNrLCBidXQgb25lIHNlcnZlciBoYXMgY29uZmlybWVkIGl0KSBpZiBub1xuLy8gY2FsbGJhY2sgaXMgcHJvdmlkZWQuIElmIGEgY2FsbGJhY2sgaXMgcHJvdmlkZWQsIHRoZW4gdGhleSBjYWxsIHRoZSBjYWxsYmFja1xuLy8gd2hlbiB0aGUgd3JpdGUgaXMgY29uZmlybWVkLiBUaGV5IHJldHVybiBub3RoaW5nIG9uIHN1Y2Nlc3MsIGFuZCByYWlzZSBhblxuLy8gZXhjZXB0aW9uIG9uIGZhaWx1cmUuXG4vL1xuLy8gQWZ0ZXIgbWFraW5nIGEgd3JpdGUgKHdpdGggaW5zZXJ0LCB1cGRhdGUsIHJlbW92ZSksIG9ic2VydmVycyBhcmVcbi8vIG5vdGlmaWVkIGFzeW5jaHJvbm91c2x5LiBJZiB5b3Ugd2FudCB0byByZWNlaXZlIGEgY2FsbGJhY2sgb25jZSBhbGxcbi8vIG9mIHRoZSBvYnNlcnZlciBub3RpZmljYXRpb25zIGhhdmUgbGFuZGVkIGZvciB5b3VyIHdyaXRlLCBkbyB0aGVcbi8vIHdyaXRlcyBpbnNpZGUgYSB3cml0ZSBmZW5jZSAoc2V0IEREUFNlcnZlci5fQ3VycmVudFdyaXRlRmVuY2UgdG8gYSBuZXdcbi8vIF9Xcml0ZUZlbmNlLCBhbmQgdGhlbiBzZXQgYSBjYWxsYmFjayBvbiB0aGUgd3JpdGUgZmVuY2UuKVxuLy9cbi8vIFNpbmNlIG91ciBleGVjdXRpb24gZW52aXJvbm1lbnQgaXMgc2luZ2xlLXRocmVhZGVkLCB0aGlzIGlzXG4vLyB3ZWxsLWRlZmluZWQgLS0gYSB3cml0ZSBcImhhcyBiZWVuIG1hZGVcIiBpZiBpdCdzIHJldHVybmVkLCBhbmQgYW5cbi8vIG9ic2VydmVyIFwiaGFzIGJlZW4gbm90aWZpZWRcIiBpZiBpdHMgY2FsbGJhY2sgaGFzIHJldHVybmVkLlxuXG52YXIgd3JpdGVDYWxsYmFjayA9IGZ1bmN0aW9uICh3cml0ZSwgcmVmcmVzaCwgY2FsbGJhY2spIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChlcnIsIHJlc3VsdCkge1xuICAgIGlmICghIGVycikge1xuICAgICAgLy8gWFhYIFdlIGRvbid0IGhhdmUgdG8gcnVuIHRoaXMgb24gZXJyb3IsIHJpZ2h0P1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmVmcmVzaCgpO1xuICAgICAgfSBjYXRjaCAocmVmcmVzaEVycikge1xuICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICBjYWxsYmFjayhyZWZyZXNoRXJyKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgcmVmcmVzaEVycjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB3cml0ZS5jb21taXR0ZWQoKTtcbiAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgIGNhbGxiYWNrKGVyciwgcmVzdWx0KTtcbiAgICB9IGVsc2UgaWYgKGVycikge1xuICAgICAgdGhyb3cgZXJyO1xuICAgIH1cbiAgfTtcbn07XG5cbnZhciBiaW5kRW52aXJvbm1lbnRGb3JXcml0ZSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICByZXR1cm4gTWV0ZW9yLmJpbmRFbnZpcm9ubWVudChjYWxsYmFjaywgXCJNb25nbyB3cml0ZVwiKTtcbn07XG5cbk1vbmdvQ29ubmVjdGlvbi5wcm90b3R5cGUuX2luc2VydCA9IGZ1bmN0aW9uIChjb2xsZWN0aW9uX25hbWUsIGRvY3VtZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKSB7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICB2YXIgc2VuZEVycm9yID0gZnVuY3Rpb24gKGUpIHtcbiAgICBpZiAoY2FsbGJhY2spXG4gICAgICByZXR1cm4gY2FsbGJhY2soZSk7XG4gICAgdGhyb3cgZTtcbiAgfTtcblxuICBpZiAoY29sbGVjdGlvbl9uYW1lID09PSBcIl9fX21ldGVvcl9mYWlsdXJlX3Rlc3RfY29sbGVjdGlvblwiKSB7XG4gICAgdmFyIGUgPSBuZXcgRXJyb3IoXCJGYWlsdXJlIHRlc3RcIik7XG4gICAgZS5fZXhwZWN0ZWRCeVRlc3QgPSB0cnVlO1xuICAgIHNlbmRFcnJvcihlKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoIShMb2NhbENvbGxlY3Rpb24uX2lzUGxhaW5PYmplY3QoZG9jdW1lbnQpICYmXG4gICAgICAgICFFSlNPTi5faXNDdXN0b21UeXBlKGRvY3VtZW50KSkpIHtcbiAgICBzZW5kRXJyb3IobmV3IEVycm9yKFxuICAgICAgXCJPbmx5IHBsYWluIG9iamVjdHMgbWF5IGJlIGluc2VydGVkIGludG8gTW9uZ29EQlwiKSk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIHdyaXRlID0gc2VsZi5fbWF5YmVCZWdpbldyaXRlKCk7XG4gIHZhciByZWZyZXNoID0gZnVuY3Rpb24gKCkge1xuICAgIE1ldGVvci5yZWZyZXNoKHtjb2xsZWN0aW9uOiBjb2xsZWN0aW9uX25hbWUsIGlkOiBkb2N1bWVudC5faWQgfSk7XG4gIH07XG4gIGNhbGxiYWNrID0gYmluZEVudmlyb25tZW50Rm9yV3JpdGUod3JpdGVDYWxsYmFjayh3cml0ZSwgcmVmcmVzaCwgY2FsbGJhY2spKTtcbiAgdHJ5IHtcbiAgICB2YXIgY29sbGVjdGlvbiA9IHNlbGYucmF3Q29sbGVjdGlvbihjb2xsZWN0aW9uX25hbWUpO1xuICAgIGNvbGxlY3Rpb24uaW5zZXJ0KHJlcGxhY2VUeXBlcyhkb2N1bWVudCwgcmVwbGFjZU1ldGVvckF0b21XaXRoTW9uZ28pLFxuICAgICAgICAgICAgICAgICAgICAgIHtzYWZlOiB0cnVlfSwgY2FsbGJhY2spO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICB3cml0ZS5jb21taXR0ZWQoKTtcbiAgICB0aHJvdyBlcnI7XG4gIH1cbn07XG5cbi8vIENhdXNlIHF1ZXJpZXMgdGhhdCBtYXkgYmUgYWZmZWN0ZWQgYnkgdGhlIHNlbGVjdG9yIHRvIHBvbGwgaW4gdGhpcyB3cml0ZVxuLy8gZmVuY2UuXG5Nb25nb0Nvbm5lY3Rpb24ucHJvdG90eXBlLl9yZWZyZXNoID0gZnVuY3Rpb24gKGNvbGxlY3Rpb25OYW1lLCBzZWxlY3Rvcikge1xuICB2YXIgcmVmcmVzaEtleSA9IHtjb2xsZWN0aW9uOiBjb2xsZWN0aW9uTmFtZX07XG4gIC8vIElmIHdlIGtub3cgd2hpY2ggZG9jdW1lbnRzIHdlJ3JlIHJlbW92aW5nLCBkb24ndCBwb2xsIHF1ZXJpZXMgdGhhdCBhcmVcbiAgLy8gc3BlY2lmaWMgdG8gb3RoZXIgZG9jdW1lbnRzLiAoTm90ZSB0aGF0IG11bHRpcGxlIG5vdGlmaWNhdGlvbnMgaGVyZSBzaG91bGRcbiAgLy8gbm90IGNhdXNlIG11bHRpcGxlIHBvbGxzLCBzaW5jZSBhbGwgb3VyIGxpc3RlbmVyIGlzIGRvaW5nIGlzIGVucXVldWVpbmcgYVxuICAvLyBwb2xsLilcbiAgdmFyIHNwZWNpZmljSWRzID0gTG9jYWxDb2xsZWN0aW9uLl9pZHNNYXRjaGVkQnlTZWxlY3RvcihzZWxlY3Rvcik7XG4gIGlmIChzcGVjaWZpY0lkcykge1xuICAgIF8uZWFjaChzcGVjaWZpY0lkcywgZnVuY3Rpb24gKGlkKSB7XG4gICAgICBNZXRlb3IucmVmcmVzaChfLmV4dGVuZCh7aWQ6IGlkfSwgcmVmcmVzaEtleSkpO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIE1ldGVvci5yZWZyZXNoKHJlZnJlc2hLZXkpO1xuICB9XG59O1xuXG5Nb25nb0Nvbm5lY3Rpb24ucHJvdG90eXBlLl9yZW1vdmUgPSBmdW5jdGlvbiAoY29sbGVjdGlvbl9uYW1lLCBzZWxlY3RvcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjaykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgaWYgKGNvbGxlY3Rpb25fbmFtZSA9PT0gXCJfX19tZXRlb3JfZmFpbHVyZV90ZXN0X2NvbGxlY3Rpb25cIikge1xuICAgIHZhciBlID0gbmV3IEVycm9yKFwiRmFpbHVyZSB0ZXN0XCIpO1xuICAgIGUuX2V4cGVjdGVkQnlUZXN0ID0gdHJ1ZTtcbiAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgIHJldHVybiBjYWxsYmFjayhlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgZTtcbiAgICB9XG4gIH1cblxuICB2YXIgd3JpdGUgPSBzZWxmLl9tYXliZUJlZ2luV3JpdGUoKTtcbiAgdmFyIHJlZnJlc2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgc2VsZi5fcmVmcmVzaChjb2xsZWN0aW9uX25hbWUsIHNlbGVjdG9yKTtcbiAgfTtcbiAgY2FsbGJhY2sgPSBiaW5kRW52aXJvbm1lbnRGb3JXcml0ZSh3cml0ZUNhbGxiYWNrKHdyaXRlLCByZWZyZXNoLCBjYWxsYmFjaykpO1xuXG4gIHRyeSB7XG4gICAgdmFyIGNvbGxlY3Rpb24gPSBzZWxmLnJhd0NvbGxlY3Rpb24oY29sbGVjdGlvbl9uYW1lKTtcbiAgICB2YXIgd3JhcHBlZENhbGxiYWNrID0gZnVuY3Rpb24oZXJyLCBkcml2ZXJSZXN1bHQpIHtcbiAgICAgIGNhbGxiYWNrKGVyciwgdHJhbnNmb3JtUmVzdWx0KGRyaXZlclJlc3VsdCkubnVtYmVyQWZmZWN0ZWQpO1xuICAgIH07XG4gICAgY29sbGVjdGlvbi5yZW1vdmUocmVwbGFjZVR5cGVzKHNlbGVjdG9yLCByZXBsYWNlTWV0ZW9yQXRvbVdpdGhNb25nbyksXG4gICAgICAgICAgICAgICAgICAgICAgIHtzYWZlOiB0cnVlfSwgd3JhcHBlZENhbGxiYWNrKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgd3JpdGUuY29tbWl0dGVkKCk7XG4gICAgdGhyb3cgZXJyO1xuICB9XG59O1xuXG5Nb25nb0Nvbm5lY3Rpb24ucHJvdG90eXBlLl9kcm9wQ29sbGVjdGlvbiA9IGZ1bmN0aW9uIChjb2xsZWN0aW9uTmFtZSwgY2IpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIHZhciB3cml0ZSA9IHNlbGYuX21heWJlQmVnaW5Xcml0ZSgpO1xuICB2YXIgcmVmcmVzaCA9IGZ1bmN0aW9uICgpIHtcbiAgICBNZXRlb3IucmVmcmVzaCh7Y29sbGVjdGlvbjogY29sbGVjdGlvbk5hbWUsIGlkOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBkcm9wQ29sbGVjdGlvbjogdHJ1ZX0pO1xuICB9O1xuICBjYiA9IGJpbmRFbnZpcm9ubWVudEZvcldyaXRlKHdyaXRlQ2FsbGJhY2sod3JpdGUsIHJlZnJlc2gsIGNiKSk7XG5cbiAgdHJ5IHtcbiAgICB2YXIgY29sbGVjdGlvbiA9IHNlbGYucmF3Q29sbGVjdGlvbihjb2xsZWN0aW9uTmFtZSk7XG4gICAgY29sbGVjdGlvbi5kcm9wKGNiKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHdyaXRlLmNvbW1pdHRlZCgpO1xuICAgIHRocm93IGU7XG4gIH1cbn07XG5cbi8vIEZvciB0ZXN0aW5nIG9ubHkuICBTbGlnaHRseSBiZXR0ZXIgdGhhbiBgYy5yYXdEYXRhYmFzZSgpLmRyb3BEYXRhYmFzZSgpYFxuLy8gYmVjYXVzZSBpdCBsZXRzIHRoZSB0ZXN0J3MgZmVuY2Ugd2FpdCBmb3IgaXQgdG8gYmUgY29tcGxldGUuXG5Nb25nb0Nvbm5lY3Rpb24ucHJvdG90eXBlLl9kcm9wRGF0YWJhc2UgPSBmdW5jdGlvbiAoY2IpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIHZhciB3cml0ZSA9IHNlbGYuX21heWJlQmVnaW5Xcml0ZSgpO1xuICB2YXIgcmVmcmVzaCA9IGZ1bmN0aW9uICgpIHtcbiAgICBNZXRlb3IucmVmcmVzaCh7IGRyb3BEYXRhYmFzZTogdHJ1ZSB9KTtcbiAgfTtcbiAgY2IgPSBiaW5kRW52aXJvbm1lbnRGb3JXcml0ZSh3cml0ZUNhbGxiYWNrKHdyaXRlLCByZWZyZXNoLCBjYikpO1xuXG4gIHRyeSB7XG4gICAgc2VsZi5kYi5kcm9wRGF0YWJhc2UoY2IpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgd3JpdGUuY29tbWl0dGVkKCk7XG4gICAgdGhyb3cgZTtcbiAgfVxufTtcblxuTW9uZ29Db25uZWN0aW9uLnByb3RvdHlwZS5fdXBkYXRlID0gZnVuY3Rpb24gKGNvbGxlY3Rpb25fbmFtZSwgc2VsZWN0b3IsIG1vZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLCBjYWxsYmFjaykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgaWYgKCEgY2FsbGJhY2sgJiYgb3B0aW9ucyBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XG4gICAgY2FsbGJhY2sgPSBvcHRpb25zO1xuICAgIG9wdGlvbnMgPSBudWxsO1xuICB9XG5cbiAgaWYgKGNvbGxlY3Rpb25fbmFtZSA9PT0gXCJfX19tZXRlb3JfZmFpbHVyZV90ZXN0X2NvbGxlY3Rpb25cIikge1xuICAgIHZhciBlID0gbmV3IEVycm9yKFwiRmFpbHVyZSB0ZXN0XCIpO1xuICAgIGUuX2V4cGVjdGVkQnlUZXN0ID0gdHJ1ZTtcbiAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgIHJldHVybiBjYWxsYmFjayhlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgZTtcbiAgICB9XG4gIH1cblxuICAvLyBleHBsaWNpdCBzYWZldHkgY2hlY2suIG51bGwgYW5kIHVuZGVmaW5lZCBjYW4gY3Jhc2ggdGhlIG1vbmdvXG4gIC8vIGRyaXZlci4gQWx0aG91Z2ggdGhlIG5vZGUgZHJpdmVyIGFuZCBtaW5pbW9uZ28gZG8gJ3N1cHBvcnQnXG4gIC8vIG5vbi1vYmplY3QgbW9kaWZpZXIgaW4gdGhhdCB0aGV5IGRvbid0IGNyYXNoLCB0aGV5IGFyZSBub3RcbiAgLy8gbWVhbmluZ2Z1bCBvcGVyYXRpb25zIGFuZCBkbyBub3QgZG8gYW55dGhpbmcuIERlZmVuc2l2ZWx5IHRocm93IGFuXG4gIC8vIGVycm9yIGhlcmUuXG4gIGlmICghbW9kIHx8IHR5cGVvZiBtb2QgIT09ICdvYmplY3QnKVxuICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgbW9kaWZpZXIuIE1vZGlmaWVyIG11c3QgYmUgYW4gb2JqZWN0LlwiKTtcblxuICBpZiAoIShMb2NhbENvbGxlY3Rpb24uX2lzUGxhaW5PYmplY3QobW9kKSAmJlxuICAgICAgICAhRUpTT04uX2lzQ3VzdG9tVHlwZShtb2QpKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIFwiT25seSBwbGFpbiBvYmplY3RzIG1heSBiZSB1c2VkIGFzIHJlcGxhY2VtZW50XCIgK1xuICAgICAgICBcIiBkb2N1bWVudHMgaW4gTW9uZ29EQlwiKTtcbiAgfVxuXG4gIGlmICghb3B0aW9ucykgb3B0aW9ucyA9IHt9O1xuXG4gIHZhciB3cml0ZSA9IHNlbGYuX21heWJlQmVnaW5Xcml0ZSgpO1xuICB2YXIgcmVmcmVzaCA9IGZ1bmN0aW9uICgpIHtcbiAgICBzZWxmLl9yZWZyZXNoKGNvbGxlY3Rpb25fbmFtZSwgc2VsZWN0b3IpO1xuICB9O1xuICBjYWxsYmFjayA9IHdyaXRlQ2FsbGJhY2sod3JpdGUsIHJlZnJlc2gsIGNhbGxiYWNrKTtcbiAgdHJ5IHtcbiAgICB2YXIgY29sbGVjdGlvbiA9IHNlbGYucmF3Q29sbGVjdGlvbihjb2xsZWN0aW9uX25hbWUpO1xuICAgIHZhciBtb25nb09wdHMgPSB7c2FmZTogdHJ1ZX07XG4gICAgLy8gQWRkIHN1cHBvcnQgZm9yIGZpbHRlcmVkIHBvc2l0aW9uYWwgb3BlcmF0b3JcbiAgICBpZiAob3B0aW9ucy5hcnJheUZpbHRlcnMgIT09IHVuZGVmaW5lZCkgbW9uZ29PcHRzLmFycmF5RmlsdGVycyA9IG9wdGlvbnMuYXJyYXlGaWx0ZXJzO1xuICAgIC8vIGV4cGxpY3RseSBlbnVtZXJhdGUgb3B0aW9ucyB0aGF0IG1pbmltb25nbyBzdXBwb3J0c1xuICAgIGlmIChvcHRpb25zLnVwc2VydCkgbW9uZ29PcHRzLnVwc2VydCA9IHRydWU7XG4gICAgaWYgKG9wdGlvbnMubXVsdGkpIG1vbmdvT3B0cy5tdWx0aSA9IHRydWU7XG4gICAgLy8gTGV0cyB5b3UgZ2V0IGEgbW9yZSBtb3JlIGZ1bGwgcmVzdWx0IGZyb20gTW9uZ29EQi4gVXNlIHdpdGggY2F1dGlvbjpcbiAgICAvLyBtaWdodCBub3Qgd29yayB3aXRoIEMudXBzZXJ0IChhcyBvcHBvc2VkIHRvIEMudXBkYXRlKHt1cHNlcnQ6dHJ1ZX0pIG9yXG4gICAgLy8gd2l0aCBzaW11bGF0ZWQgdXBzZXJ0LlxuICAgIGlmIChvcHRpb25zLmZ1bGxSZXN1bHQpIG1vbmdvT3B0cy5mdWxsUmVzdWx0ID0gdHJ1ZTtcblxuICAgIHZhciBtb25nb1NlbGVjdG9yID0gcmVwbGFjZVR5cGVzKHNlbGVjdG9yLCByZXBsYWNlTWV0ZW9yQXRvbVdpdGhNb25nbyk7XG4gICAgdmFyIG1vbmdvTW9kID0gcmVwbGFjZVR5cGVzKG1vZCwgcmVwbGFjZU1ldGVvckF0b21XaXRoTW9uZ28pO1xuXG4gICAgdmFyIGlzTW9kaWZ5ID0gTG9jYWxDb2xsZWN0aW9uLl9pc01vZGlmaWNhdGlvbk1vZChtb25nb01vZCk7XG5cbiAgICBpZiAob3B0aW9ucy5fZm9yYmlkUmVwbGFjZSAmJiAhaXNNb2RpZnkpIHtcbiAgICAgIHZhciBlcnIgPSBuZXcgRXJyb3IoXCJJbnZhbGlkIG1vZGlmaWVyLiBSZXBsYWNlbWVudHMgYXJlIGZvcmJpZGRlbi5cIik7XG4gICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gV2UndmUgYWxyZWFkeSBydW4gcmVwbGFjZVR5cGVzL3JlcGxhY2VNZXRlb3JBdG9tV2l0aE1vbmdvIG9uXG4gICAgLy8gc2VsZWN0b3IgYW5kIG1vZC4gIFdlIGFzc3VtZSBpdCBkb2Vzbid0IG1hdHRlciwgYXMgZmFyIGFzXG4gICAgLy8gdGhlIGJlaGF2aW9yIG9mIG1vZGlmaWVycyBpcyBjb25jZXJuZWQsIHdoZXRoZXIgYF9tb2RpZnlgXG4gICAgLy8gaXMgcnVuIG9uIEVKU09OIG9yIG9uIG1vbmdvLWNvbnZlcnRlZCBFSlNPTi5cblxuICAgIC8vIFJ1biB0aGlzIGNvZGUgdXAgZnJvbnQgc28gdGhhdCBpdCBmYWlscyBmYXN0IGlmIHNvbWVvbmUgdXNlc1xuICAgIC8vIGEgTW9uZ28gdXBkYXRlIG9wZXJhdG9yIHdlIGRvbid0IHN1cHBvcnQuXG4gICAgbGV0IGtub3duSWQ7XG4gICAgaWYgKG9wdGlvbnMudXBzZXJ0KSB7XG4gICAgICB0cnkge1xuICAgICAgICBsZXQgbmV3RG9jID0gTG9jYWxDb2xsZWN0aW9uLl9jcmVhdGVVcHNlcnREb2N1bWVudChzZWxlY3RvciwgbW9kKTtcbiAgICAgICAga25vd25JZCA9IG5ld0RvYy5faWQ7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMudXBzZXJ0ICYmXG4gICAgICAgICEgaXNNb2RpZnkgJiZcbiAgICAgICAgISBrbm93bklkICYmXG4gICAgICAgIG9wdGlvbnMuaW5zZXJ0ZWRJZCAmJlxuICAgICAgICAhIChvcHRpb25zLmluc2VydGVkSWQgaW5zdGFuY2VvZiBNb25nby5PYmplY3RJRCAmJlxuICAgICAgICAgICBvcHRpb25zLmdlbmVyYXRlZElkKSkge1xuICAgICAgLy8gSW4gY2FzZSBvZiBhbiB1cHNlcnQgd2l0aCBhIHJlcGxhY2VtZW50LCB3aGVyZSB0aGVyZSBpcyBubyBfaWQgZGVmaW5lZFxuICAgICAgLy8gaW4gZWl0aGVyIHRoZSBxdWVyeSBvciB0aGUgcmVwbGFjZW1lbnQgZG9jLCBtb25nbyB3aWxsIGdlbmVyYXRlIGFuIGlkIGl0c2VsZi5cbiAgICAgIC8vIFRoZXJlZm9yZSB3ZSBuZWVkIHRoaXMgc3BlY2lhbCBzdHJhdGVneSBpZiB3ZSB3YW50IHRvIGNvbnRyb2wgdGhlIGlkIG91cnNlbHZlcy5cblxuICAgICAgLy8gV2UgZG9uJ3QgbmVlZCB0byBkbyB0aGlzIHdoZW46XG4gICAgICAvLyAtIFRoaXMgaXMgbm90IGEgcmVwbGFjZW1lbnQsIHNvIHdlIGNhbiBhZGQgYW4gX2lkIHRvICRzZXRPbkluc2VydFxuICAgICAgLy8gLSBUaGUgaWQgaXMgZGVmaW5lZCBieSBxdWVyeSBvciBtb2Qgd2UgY2FuIGp1c3QgYWRkIGl0IHRvIHRoZSByZXBsYWNlbWVudCBkb2NcbiAgICAgIC8vIC0gVGhlIHVzZXIgZGlkIG5vdCBzcGVjaWZ5IGFueSBpZCBwcmVmZXJlbmNlIGFuZCB0aGUgaWQgaXMgYSBNb25nbyBPYmplY3RJZCxcbiAgICAgIC8vICAgICB0aGVuIHdlIGNhbiBqdXN0IGxldCBNb25nbyBnZW5lcmF0ZSB0aGUgaWRcblxuICAgICAgc2ltdWxhdGVVcHNlcnRXaXRoSW5zZXJ0ZWRJZChcbiAgICAgICAgY29sbGVjdGlvbiwgbW9uZ29TZWxlY3RvciwgbW9uZ29Nb2QsIG9wdGlvbnMsXG4gICAgICAgIC8vIFRoaXMgY2FsbGJhY2sgZG9lcyBub3QgbmVlZCB0byBiZSBiaW5kRW52aXJvbm1lbnQnZWQgYmVjYXVzZVxuICAgICAgICAvLyBzaW11bGF0ZVVwc2VydFdpdGhJbnNlcnRlZElkKCkgd3JhcHMgaXQgYW5kIHRoZW4gcGFzc2VzIGl0IHRocm91Z2hcbiAgICAgICAgLy8gYmluZEVudmlyb25tZW50Rm9yV3JpdGUuXG4gICAgICAgIGZ1bmN0aW9uIChlcnJvciwgcmVzdWx0KSB7XG4gICAgICAgICAgLy8gSWYgd2UgZ290IGhlcmUgdmlhIGEgdXBzZXJ0KCkgY2FsbCwgdGhlbiBvcHRpb25zLl9yZXR1cm5PYmplY3Qgd2lsbFxuICAgICAgICAgIC8vIGJlIHNldCBhbmQgd2Ugc2hvdWxkIHJldHVybiB0aGUgd2hvbGUgb2JqZWN0LiBPdGhlcndpc2UsIHdlIHNob3VsZFxuICAgICAgICAgIC8vIGp1c3QgcmV0dXJuIHRoZSBudW1iZXIgb2YgYWZmZWN0ZWQgZG9jcyB0byBtYXRjaCB0aGUgbW9uZ28gQVBJLlxuICAgICAgICAgIGlmIChyZXN1bHQgJiYgISBvcHRpb25zLl9yZXR1cm5PYmplY3QpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCByZXN1bHQubnVtYmVyQWZmZWN0ZWQpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgcmVzdWx0KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgfSBlbHNlIHtcblxuICAgICAgaWYgKG9wdGlvbnMudXBzZXJ0ICYmICFrbm93bklkICYmIG9wdGlvbnMuaW5zZXJ0ZWRJZCAmJiBpc01vZGlmeSkge1xuICAgICAgICBpZiAoIW1vbmdvTW9kLmhhc093blByb3BlcnR5KCckc2V0T25JbnNlcnQnKSkge1xuICAgICAgICAgIG1vbmdvTW9kLiRzZXRPbkluc2VydCA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIGtub3duSWQgPSBvcHRpb25zLmluc2VydGVkSWQ7XG4gICAgICAgIE9iamVjdC5hc3NpZ24obW9uZ29Nb2QuJHNldE9uSW5zZXJ0LCByZXBsYWNlVHlwZXMoe19pZDogb3B0aW9ucy5pbnNlcnRlZElkfSwgcmVwbGFjZU1ldGVvckF0b21XaXRoTW9uZ28pKTtcbiAgICAgIH1cblxuICAgICAgY29sbGVjdGlvbi51cGRhdGUoXG4gICAgICAgIG1vbmdvU2VsZWN0b3IsIG1vbmdvTW9kLCBtb25nb09wdHMsXG4gICAgICAgIGJpbmRFbnZpcm9ubWVudEZvcldyaXRlKGZ1bmN0aW9uIChlcnIsIHJlc3VsdCkge1xuICAgICAgICAgIGlmICghIGVycikge1xuICAgICAgICAgICAgdmFyIG1ldGVvclJlc3VsdCA9IHRyYW5zZm9ybVJlc3VsdChyZXN1bHQpO1xuICAgICAgICAgICAgaWYgKG1ldGVvclJlc3VsdCAmJiBvcHRpb25zLl9yZXR1cm5PYmplY3QpIHtcbiAgICAgICAgICAgICAgLy8gSWYgdGhpcyB3YXMgYW4gdXBzZXJ0KCkgY2FsbCwgYW5kIHdlIGVuZGVkIHVwXG4gICAgICAgICAgICAgIC8vIGluc2VydGluZyBhIG5ldyBkb2MgYW5kIHdlIGtub3cgaXRzIGlkLCB0aGVuXG4gICAgICAgICAgICAgIC8vIHJldHVybiB0aGF0IGlkIGFzIHdlbGwuXG4gICAgICAgICAgICAgIGlmIChvcHRpb25zLnVwc2VydCAmJiBtZXRlb3JSZXN1bHQuaW5zZXJ0ZWRJZCkge1xuICAgICAgICAgICAgICAgIGlmIChrbm93bklkKSB7XG4gICAgICAgICAgICAgICAgICBtZXRlb3JSZXN1bHQuaW5zZXJ0ZWRJZCA9IGtub3duSWQ7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChtZXRlb3JSZXN1bHQuaW5zZXJ0ZWRJZCBpbnN0YW5jZW9mIE1vbmdvREIuT2JqZWN0SUQpIHtcbiAgICAgICAgICAgICAgICAgIG1ldGVvclJlc3VsdC5pbnNlcnRlZElkID0gbmV3IE1vbmdvLk9iamVjdElEKG1ldGVvclJlc3VsdC5pbnNlcnRlZElkLnRvSGV4U3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgbWV0ZW9yUmVzdWx0KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgbWV0ZW9yUmVzdWx0Lm51bWJlckFmZmVjdGVkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FsbGJhY2soZXJyKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pKTtcbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICB3cml0ZS5jb21taXR0ZWQoKTtcbiAgICB0aHJvdyBlO1xuICB9XG59O1xuXG52YXIgdHJhbnNmb3JtUmVzdWx0ID0gZnVuY3Rpb24gKGRyaXZlclJlc3VsdCkge1xuICB2YXIgbWV0ZW9yUmVzdWx0ID0geyBudW1iZXJBZmZlY3RlZDogMCB9O1xuICBpZiAoZHJpdmVyUmVzdWx0KSB7XG4gICAgdmFyIG1vbmdvUmVzdWx0ID0gZHJpdmVyUmVzdWx0LnJlc3VsdDtcblxuICAgIC8vIE9uIHVwZGF0ZXMgd2l0aCB1cHNlcnQ6dHJ1ZSwgdGhlIGluc2VydGVkIHZhbHVlcyBjb21lIGFzIGEgbGlzdCBvZlxuICAgIC8vIHVwc2VydGVkIHZhbHVlcyAtLSBldmVuIHdpdGggb3B0aW9ucy5tdWx0aSwgd2hlbiB0aGUgdXBzZXJ0IGRvZXMgaW5zZXJ0LFxuICAgIC8vIGl0IG9ubHkgaW5zZXJ0cyBvbmUgZWxlbWVudC5cbiAgICBpZiAobW9uZ29SZXN1bHQudXBzZXJ0ZWQpIHtcbiAgICAgIG1ldGVvclJlc3VsdC5udW1iZXJBZmZlY3RlZCArPSBtb25nb1Jlc3VsdC51cHNlcnRlZC5sZW5ndGg7XG5cbiAgICAgIGlmIChtb25nb1Jlc3VsdC51cHNlcnRlZC5sZW5ndGggPT0gMSkge1xuICAgICAgICBtZXRlb3JSZXN1bHQuaW5zZXJ0ZWRJZCA9IG1vbmdvUmVzdWx0LnVwc2VydGVkWzBdLl9pZDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbWV0ZW9yUmVzdWx0Lm51bWJlckFmZmVjdGVkID0gbW9uZ29SZXN1bHQubjtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbWV0ZW9yUmVzdWx0O1xufTtcblxuXG52YXIgTlVNX09QVElNSVNUSUNfVFJJRVMgPSAzO1xuXG4vLyBleHBvc2VkIGZvciB0ZXN0aW5nXG5Nb25nb0Nvbm5lY3Rpb24uX2lzQ2Fubm90Q2hhbmdlSWRFcnJvciA9IGZ1bmN0aW9uIChlcnIpIHtcblxuICAvLyBNb25nbyAzLjIuKiByZXR1cm5zIGVycm9yIGFzIG5leHQgT2JqZWN0OlxuICAvLyB7bmFtZTogU3RyaW5nLCBjb2RlOiBOdW1iZXIsIGVycm1zZzogU3RyaW5nfVxuICAvLyBPbGRlciBNb25nbyByZXR1cm5zOlxuICAvLyB7bmFtZTogU3RyaW5nLCBjb2RlOiBOdW1iZXIsIGVycjogU3RyaW5nfVxuICB2YXIgZXJyb3IgPSBlcnIuZXJybXNnIHx8IGVyci5lcnI7XG5cbiAgLy8gV2UgZG9uJ3QgdXNlIHRoZSBlcnJvciBjb2RlIGhlcmVcbiAgLy8gYmVjYXVzZSB0aGUgZXJyb3IgY29kZSB3ZSBvYnNlcnZlZCBpdCBwcm9kdWNpbmcgKDE2ODM3KSBhcHBlYXJzIHRvIGJlXG4gIC8vIGEgZmFyIG1vcmUgZ2VuZXJpYyBlcnJvciBjb2RlIGJhc2VkIG9uIGV4YW1pbmluZyB0aGUgc291cmNlLlxuICBpZiAoZXJyb3IuaW5kZXhPZignVGhlIF9pZCBmaWVsZCBjYW5ub3QgYmUgY2hhbmdlZCcpID09PSAwXG4gICAgfHwgZXJyb3IuaW5kZXhPZihcInRoZSAoaW1tdXRhYmxlKSBmaWVsZCAnX2lkJyB3YXMgZm91bmQgdG8gaGF2ZSBiZWVuIGFsdGVyZWQgdG8gX2lkXCIpICE9PSAtMSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxudmFyIHNpbXVsYXRlVXBzZXJ0V2l0aEluc2VydGVkSWQgPSBmdW5jdGlvbiAoY29sbGVjdGlvbiwgc2VsZWN0b3IsIG1vZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gIC8vIFNUUkFURUdZOiBGaXJzdCB0cnkgZG9pbmcgYW4gdXBzZXJ0IHdpdGggYSBnZW5lcmF0ZWQgSUQuXG4gIC8vIElmIHRoaXMgdGhyb3dzIGFuIGVycm9yIGFib3V0IGNoYW5naW5nIHRoZSBJRCBvbiBhbiBleGlzdGluZyBkb2N1bWVudFxuICAvLyB0aGVuIHdpdGhvdXQgYWZmZWN0aW5nIHRoZSBkYXRhYmFzZSwgd2Uga25vdyB3ZSBzaG91bGQgcHJvYmFibHkgdHJ5XG4gIC8vIGFuIHVwZGF0ZSB3aXRob3V0IHRoZSBnZW5lcmF0ZWQgSUQuIElmIGl0IGFmZmVjdGVkIDAgZG9jdW1lbnRzLFxuICAvLyB0aGVuIHdpdGhvdXQgYWZmZWN0aW5nIHRoZSBkYXRhYmFzZSwgd2UgdGhlIGRvY3VtZW50IHRoYXQgZmlyc3RcbiAgLy8gZ2F2ZSB0aGUgZXJyb3IgaXMgcHJvYmFibHkgcmVtb3ZlZCBhbmQgd2UgbmVlZCB0byB0cnkgYW4gaW5zZXJ0IGFnYWluXG4gIC8vIFdlIGdvIGJhY2sgdG8gc3RlcCBvbmUgYW5kIHJlcGVhdC5cbiAgLy8gTGlrZSBhbGwgXCJvcHRpbWlzdGljIHdyaXRlXCIgc2NoZW1lcywgd2UgcmVseSBvbiB0aGUgZmFjdCB0aGF0IGl0J3NcbiAgLy8gdW5saWtlbHkgb3VyIHdyaXRlcyB3aWxsIGNvbnRpbnVlIHRvIGJlIGludGVyZmVyZWQgd2l0aCB1bmRlciBub3JtYWxcbiAgLy8gY2lyY3Vtc3RhbmNlcyAodGhvdWdoIHN1ZmZpY2llbnRseSBoZWF2eSBjb250ZW50aW9uIHdpdGggd3JpdGVyc1xuICAvLyBkaXNhZ3JlZWluZyBvbiB0aGUgZXhpc3RlbmNlIG9mIGFuIG9iamVjdCB3aWxsIGNhdXNlIHdyaXRlcyB0byBmYWlsXG4gIC8vIGluIHRoZW9yeSkuXG5cbiAgdmFyIGluc2VydGVkSWQgPSBvcHRpb25zLmluc2VydGVkSWQ7IC8vIG11c3QgZXhpc3RcbiAgdmFyIG1vbmdvT3B0c0ZvclVwZGF0ZSA9IHtcbiAgICBzYWZlOiB0cnVlLFxuICAgIG11bHRpOiBvcHRpb25zLm11bHRpXG4gIH07XG4gIHZhciBtb25nb09wdHNGb3JJbnNlcnQgPSB7XG4gICAgc2FmZTogdHJ1ZSxcbiAgICB1cHNlcnQ6IHRydWVcbiAgfTtcblxuICB2YXIgcmVwbGFjZW1lbnRXaXRoSWQgPSBPYmplY3QuYXNzaWduKFxuICAgIHJlcGxhY2VUeXBlcyh7X2lkOiBpbnNlcnRlZElkfSwgcmVwbGFjZU1ldGVvckF0b21XaXRoTW9uZ28pLFxuICAgIG1vZCk7XG5cbiAgdmFyIHRyaWVzID0gTlVNX09QVElNSVNUSUNfVFJJRVM7XG5cbiAgdmFyIGRvVXBkYXRlID0gZnVuY3Rpb24gKCkge1xuICAgIHRyaWVzLS07XG4gICAgaWYgKCEgdHJpZXMpIHtcbiAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcihcIlVwc2VydCBmYWlsZWQgYWZ0ZXIgXCIgKyBOVU1fT1BUSU1JU1RJQ19UUklFUyArIFwiIHRyaWVzLlwiKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbGxlY3Rpb24udXBkYXRlKHNlbGVjdG9yLCBtb2QsIG1vbmdvT3B0c0ZvclVwZGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJpbmRFbnZpcm9ubWVudEZvcldyaXRlKGZ1bmN0aW9uIChlcnIsIHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChyZXN1bHQgJiYgcmVzdWx0LnJlc3VsdC5uICE9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBudW1iZXJBZmZlY3RlZDogcmVzdWx0LnJlc3VsdC5uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9Db25kaXRpb25hbEluc2VydCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgfVxuICB9O1xuXG4gIHZhciBkb0NvbmRpdGlvbmFsSW5zZXJ0ID0gZnVuY3Rpb24gKCkge1xuICAgIGNvbGxlY3Rpb24udXBkYXRlKHNlbGVjdG9yLCByZXBsYWNlbWVudFdpdGhJZCwgbW9uZ29PcHRzRm9ySW5zZXJ0LFxuICAgICAgICAgICAgICAgICAgICAgIGJpbmRFbnZpcm9ubWVudEZvcldyaXRlKGZ1bmN0aW9uIChlcnIsIHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBmaWd1cmUgb3V0IGlmIHRoaXMgaXMgYVxuICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBcImNhbm5vdCBjaGFuZ2UgX2lkIG9mIGRvY3VtZW50XCIgZXJyb3IsIGFuZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiBzbywgdHJ5IGRvVXBkYXRlKCkgYWdhaW4sIHVwIHRvIDMgdGltZXMuXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChNb25nb0Nvbm5lY3Rpb24uX2lzQ2Fubm90Q2hhbmdlSWRFcnJvcihlcnIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9VcGRhdGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVtYmVyQWZmZWN0ZWQ6IHJlc3VsdC5yZXN1bHQudXBzZXJ0ZWQubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydGVkSWQ6IGluc2VydGVkSWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgfTtcblxuICBkb1VwZGF0ZSgpO1xufTtcblxuXy5lYWNoKFtcImluc2VydFwiLCBcInVwZGF0ZVwiLCBcInJlbW92ZVwiLCBcImRyb3BDb2xsZWN0aW9uXCIsIFwiZHJvcERhdGFiYXNlXCJdLCBmdW5jdGlvbiAobWV0aG9kKSB7XG4gIE1vbmdvQ29ubmVjdGlvbi5wcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uICgvKiBhcmd1bWVudHMgKi8pIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgcmV0dXJuIE1ldGVvci53cmFwQXN5bmMoc2VsZltcIl9cIiArIG1ldGhvZF0pLmFwcGx5KHNlbGYsIGFyZ3VtZW50cyk7XG4gIH07XG59KTtcblxuLy8gWFhYIE1vbmdvQ29ubmVjdGlvbi51cHNlcnQoKSBkb2VzIG5vdCByZXR1cm4gdGhlIGlkIG9mIHRoZSBpbnNlcnRlZCBkb2N1bWVudFxuLy8gdW5sZXNzIHlvdSBzZXQgaXQgZXhwbGljaXRseSBpbiB0aGUgc2VsZWN0b3Igb3IgbW9kaWZpZXIgKGFzIGEgcmVwbGFjZW1lbnRcbi8vIGRvYykuXG5Nb25nb0Nvbm5lY3Rpb24ucHJvdG90eXBlLnVwc2VydCA9IGZ1bmN0aW9uIChjb2xsZWN0aW9uTmFtZSwgc2VsZWN0b3IsIG1vZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgaWYgKHR5cGVvZiBvcHRpb25zID09PSBcImZ1bmN0aW9uXCIgJiYgISBjYWxsYmFjaykge1xuICAgIGNhbGxiYWNrID0gb3B0aW9ucztcbiAgICBvcHRpb25zID0ge307XG4gIH1cblxuICByZXR1cm4gc2VsZi51cGRhdGUoY29sbGVjdGlvbk5hbWUsIHNlbGVjdG9yLCBtb2QsXG4gICAgICAgICAgICAgICAgICAgICBfLmV4dGVuZCh7fSwgb3B0aW9ucywge1xuICAgICAgICAgICAgICAgICAgICAgICB1cHNlcnQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgIF9yZXR1cm5PYmplY3Q6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgIH0pLCBjYWxsYmFjayk7XG59O1xuXG5Nb25nb0Nvbm5lY3Rpb24ucHJvdG90eXBlLmZpbmQgPSBmdW5jdGlvbiAoY29sbGVjdGlvbk5hbWUsIHNlbGVjdG9yLCBvcHRpb25zKSB7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSlcbiAgICBzZWxlY3RvciA9IHt9O1xuXG4gIHJldHVybiBuZXcgQ3Vyc29yKFxuICAgIHNlbGYsIG5ldyBDdXJzb3JEZXNjcmlwdGlvbihjb2xsZWN0aW9uTmFtZSwgc2VsZWN0b3IsIG9wdGlvbnMpKTtcbn07XG5cbk1vbmdvQ29ubmVjdGlvbi5wcm90b3R5cGUuZmluZE9uZSA9IGZ1bmN0aW9uIChjb2xsZWN0aW9uX25hbWUsIHNlbGVjdG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSlcbiAgICBzZWxlY3RvciA9IHt9O1xuXG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBvcHRpb25zLmxpbWl0ID0gMTtcbiAgcmV0dXJuIHNlbGYuZmluZChjb2xsZWN0aW9uX25hbWUsIHNlbGVjdG9yLCBvcHRpb25zKS5mZXRjaCgpWzBdO1xufTtcblxuLy8gV2UnbGwgYWN0dWFsbHkgZGVzaWduIGFuIGluZGV4IEFQSSBsYXRlci4gRm9yIG5vdywgd2UganVzdCBwYXNzIHRocm91Z2ggdG9cbi8vIE1vbmdvJ3MsIGJ1dCBtYWtlIGl0IHN5bmNocm9ub3VzLlxuTW9uZ29Db25uZWN0aW9uLnByb3RvdHlwZS5fZW5zdXJlSW5kZXggPSBmdW5jdGlvbiAoY29sbGVjdGlvbk5hbWUsIGluZGV4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucykge1xuICB0cnkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAvLyBXZSBleHBlY3QgdGhpcyBmdW5jdGlvbiB0byBiZSBjYWxsZWQgYXQgc3RhcnR1cCwgbm90IGZyb20gd2l0aGluIGEgbWV0aG9kLFxuICAgIC8vIHNvIHdlIGRvbid0IGludGVyYWN0IHdpdGggdGhlIHdyaXRlIGZlbmNlLlxuICAgIHZhciBjb2xsZWN0aW9uID0gc2VsZi5yYXdDb2xsZWN0aW9uKGNvbGxlY3Rpb25OYW1lKTtcbiAgICB2YXIgZnV0dXJlID0gbmV3IEZ1dHVyZTtcbiAgICB2YXIgaW5kZXhOYW1lID0gY29sbGVjdGlvbi5lbnN1cmVJbmRleChpbmRleCwgb3B0aW9ucywgZnV0dXJlLnJlc29sdmVyKCkpO1xuICAgIGZ1dHVyZS53YWl0KCk7XG4gIH0gY2F0Y2ggKEV4Y2VwdGlvbikge1xuICAgIFxuICB9XG59O1xuTW9uZ29Db25uZWN0aW9uLnByb3RvdHlwZS5fZHJvcEluZGV4ID0gZnVuY3Rpb24gKGNvbGxlY3Rpb25OYW1lLCBpbmRleCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgLy8gVGhpcyBmdW5jdGlvbiBpcyBvbmx5IHVzZWQgYnkgdGVzdCBjb2RlLCBub3Qgd2l0aGluIGEgbWV0aG9kLCBzbyB3ZSBkb24ndFxuICAvLyBpbnRlcmFjdCB3aXRoIHRoZSB3cml0ZSBmZW5jZS5cbiAgdmFyIGNvbGxlY3Rpb24gPSBzZWxmLnJhd0NvbGxlY3Rpb24oY29sbGVjdGlvbk5hbWUpO1xuICB2YXIgZnV0dXJlID0gbmV3IEZ1dHVyZTtcbiAgdmFyIGluZGV4TmFtZSA9IGNvbGxlY3Rpb24uZHJvcEluZGV4KGluZGV4LCBmdXR1cmUucmVzb2x2ZXIoKSk7XG4gIGZ1dHVyZS53YWl0KCk7XG59O1xuXG4vLyBDVVJTT1JTXG5cbi8vIFRoZXJlIGFyZSBzZXZlcmFsIGNsYXNzZXMgd2hpY2ggcmVsYXRlIHRvIGN1cnNvcnM6XG4vL1xuLy8gQ3Vyc29yRGVzY3JpcHRpb24gcmVwcmVzZW50cyB0aGUgYXJndW1lbnRzIHVzZWQgdG8gY29uc3RydWN0IGEgY3Vyc29yOlxuLy8gY29sbGVjdGlvbk5hbWUsIHNlbGVjdG9yLCBhbmQgKGZpbmQpIG9wdGlvbnMuICBCZWNhdXNlIGl0IGlzIHVzZWQgYXMgYSBrZXlcbi8vIGZvciBjdXJzb3IgZGUtZHVwLCBldmVyeXRoaW5nIGluIGl0IHNob3VsZCBlaXRoZXIgYmUgSlNPTi1zdHJpbmdpZmlhYmxlIG9yXG4vLyBub3QgYWZmZWN0IG9ic2VydmVDaGFuZ2VzIG91dHB1dCAoZWcsIG9wdGlvbnMudHJhbnNmb3JtIGZ1bmN0aW9ucyBhcmUgbm90XG4vLyBzdHJpbmdpZmlhYmxlIGJ1dCBkbyBub3QgYWZmZWN0IG9ic2VydmVDaGFuZ2VzKS5cbi8vXG4vLyBTeW5jaHJvbm91c0N1cnNvciBpcyBhIHdyYXBwZXIgYXJvdW5kIGEgTW9uZ29EQiBjdXJzb3Jcbi8vIHdoaWNoIGluY2x1ZGVzIGZ1bGx5LXN5bmNocm9ub3VzIHZlcnNpb25zIG9mIGZvckVhY2gsIGV0Yy5cbi8vXG4vLyBDdXJzb3IgaXMgdGhlIGN1cnNvciBvYmplY3QgcmV0dXJuZWQgZnJvbSBmaW5kKCksIHdoaWNoIGltcGxlbWVudHMgdGhlXG4vLyBkb2N1bWVudGVkIE1vbmdvLkNvbGxlY3Rpb24gY3Vyc29yIEFQSS4gIEl0IHdyYXBzIGEgQ3Vyc29yRGVzY3JpcHRpb24gYW5kIGFcbi8vIFN5bmNocm9ub3VzQ3Vyc29yIChsYXppbHk6IGl0IGRvZXNuJ3QgY29udGFjdCBNb25nbyB1bnRpbCB5b3UgY2FsbCBhIG1ldGhvZFxuLy8gbGlrZSBmZXRjaCBvciBmb3JFYWNoIG9uIGl0KS5cbi8vXG4vLyBPYnNlcnZlSGFuZGxlIGlzIHRoZSBcIm9ic2VydmUgaGFuZGxlXCIgcmV0dXJuZWQgZnJvbSBvYnNlcnZlQ2hhbmdlcy4gSXQgaGFzIGFcbi8vIHJlZmVyZW5jZSB0byBhbiBPYnNlcnZlTXVsdGlwbGV4ZXIuXG4vL1xuLy8gT2JzZXJ2ZU11bHRpcGxleGVyIGFsbG93cyBtdWx0aXBsZSBpZGVudGljYWwgT2JzZXJ2ZUhhbmRsZXMgdG8gYmUgZHJpdmVuIGJ5IGFcbi8vIHNpbmdsZSBvYnNlcnZlIGRyaXZlci5cbi8vXG4vLyBUaGVyZSBhcmUgdHdvIFwib2JzZXJ2ZSBkcml2ZXJzXCIgd2hpY2ggZHJpdmUgT2JzZXJ2ZU11bHRpcGxleGVyczpcbi8vICAgLSBQb2xsaW5nT2JzZXJ2ZURyaXZlciBjYWNoZXMgdGhlIHJlc3VsdHMgb2YgYSBxdWVyeSBhbmQgcmVydW5zIGl0IHdoZW5cbi8vICAgICBuZWNlc3NhcnkuXG4vLyAgIC0gT3Bsb2dPYnNlcnZlRHJpdmVyIGZvbGxvd3MgdGhlIE1vbmdvIG9wZXJhdGlvbiBsb2cgdG8gZGlyZWN0bHkgb2JzZXJ2ZVxuLy8gICAgIGRhdGFiYXNlIGNoYW5nZXMuXG4vLyBCb3RoIGltcGxlbWVudGF0aW9ucyBmb2xsb3cgdGhlIHNhbWUgc2ltcGxlIGludGVyZmFjZTogd2hlbiB5b3UgY3JlYXRlIHRoZW0sXG4vLyB0aGV5IHN0YXJ0IHNlbmRpbmcgb2JzZXJ2ZUNoYW5nZXMgY2FsbGJhY2tzIChhbmQgYSByZWFkeSgpIGludm9jYXRpb24pIHRvXG4vLyB0aGVpciBPYnNlcnZlTXVsdGlwbGV4ZXIsIGFuZCB5b3Ugc3RvcCB0aGVtIGJ5IGNhbGxpbmcgdGhlaXIgc3RvcCgpIG1ldGhvZC5cblxuQ3Vyc29yRGVzY3JpcHRpb24gPSBmdW5jdGlvbiAoY29sbGVjdGlvbk5hbWUsIHNlbGVjdG9yLCBvcHRpb25zKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgc2VsZi5jb2xsZWN0aW9uTmFtZSA9IGNvbGxlY3Rpb25OYW1lO1xuICBzZWxmLnNlbGVjdG9yID0gTW9uZ28uQ29sbGVjdGlvbi5fcmV3cml0ZVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgc2VsZi5vcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbn07XG5cbkN1cnNvciA9IGZ1bmN0aW9uIChtb25nbywgY3Vyc29yRGVzY3JpcHRpb24pIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIHNlbGYuX21vbmdvID0gbW9uZ287XG4gIHNlbGYuX2N1cnNvckRlc2NyaXB0aW9uID0gY3Vyc29yRGVzY3JpcHRpb247XG4gIHNlbGYuX3N5bmNocm9ub3VzQ3Vyc29yID0gbnVsbDtcbn07XG5cbl8uZWFjaChbJ2ZvckVhY2gnLCAnbWFwJywgJ2ZldGNoJywgJ2NvdW50JywgU3ltYm9sLml0ZXJhdG9yXSwgZnVuY3Rpb24gKG1ldGhvZCkge1xuICBDdXJzb3IucHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgLy8gWW91IGNhbiBvbmx5IG9ic2VydmUgYSB0YWlsYWJsZSBjdXJzb3IuXG4gICAgaWYgKHNlbGYuX2N1cnNvckRlc2NyaXB0aW9uLm9wdGlvbnMudGFpbGFibGUpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgY2FsbCBcIiArIG1ldGhvZCArIFwiIG9uIGEgdGFpbGFibGUgY3Vyc29yXCIpO1xuXG4gICAgaWYgKCFzZWxmLl9zeW5jaHJvbm91c0N1cnNvcikge1xuICAgICAgc2VsZi5fc3luY2hyb25vdXNDdXJzb3IgPSBzZWxmLl9tb25nby5fY3JlYXRlU3luY2hyb25vdXNDdXJzb3IoXG4gICAgICAgIHNlbGYuX2N1cnNvckRlc2NyaXB0aW9uLCB7XG4gICAgICAgICAgLy8gTWFrZSBzdXJlIHRoYXQgdGhlIFwic2VsZlwiIGFyZ3VtZW50IHRvIGZvckVhY2gvbWFwIGNhbGxiYWNrcyBpcyB0aGVcbiAgICAgICAgICAvLyBDdXJzb3IsIG5vdCB0aGUgU3luY2hyb25vdXNDdXJzb3IuXG4gICAgICAgICAgc2VsZkZvckl0ZXJhdGlvbjogc2VsZixcbiAgICAgICAgICB1c2VUcmFuc2Zvcm06IHRydWVcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNlbGYuX3N5bmNocm9ub3VzQ3Vyc29yW21ldGhvZF0uYXBwbHkoXG4gICAgICBzZWxmLl9zeW5jaHJvbm91c0N1cnNvciwgYXJndW1lbnRzKTtcbiAgfTtcbn0pO1xuXG4vLyBTaW5jZSB3ZSBkb24ndCBhY3R1YWxseSBoYXZlIGEgXCJuZXh0T2JqZWN0XCIgaW50ZXJmYWNlLCB0aGVyZSdzIHJlYWxseSBub1xuLy8gcmVhc29uIHRvIGhhdmUgYSBcInJld2luZFwiIGludGVyZmFjZS4gIEFsbCBpdCBkaWQgd2FzIG1ha2UgbXVsdGlwbGUgY2FsbHNcbi8vIHRvIGZldGNoL21hcC9mb3JFYWNoIHJldHVybiBub3RoaW5nIHRoZSBzZWNvbmQgdGltZS5cbi8vIFhYWCBDT01QQVQgV0lUSCAwLjguMVxuQ3Vyc29yLnByb3RvdHlwZS5yZXdpbmQgPSBmdW5jdGlvbiAoKSB7XG59O1xuXG5DdXJzb3IucHJvdG90eXBlLmdldFRyYW5zZm9ybSA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMuX2N1cnNvckRlc2NyaXB0aW9uLm9wdGlvbnMudHJhbnNmb3JtO1xufTtcblxuLy8gV2hlbiB5b3UgY2FsbCBNZXRlb3IucHVibGlzaCgpIHdpdGggYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSBDdXJzb3IsIHdlIG5lZWRcbi8vIHRvIHRyYW5zbXV0ZSBpdCBpbnRvIHRoZSBlcXVpdmFsZW50IHN1YnNjcmlwdGlvbi4gIFRoaXMgaXMgdGhlIGZ1bmN0aW9uIHRoYXRcbi8vIGRvZXMgdGhhdC5cblxuQ3Vyc29yLnByb3RvdHlwZS5fcHVibGlzaEN1cnNvciA9IGZ1bmN0aW9uIChzdWIpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB2YXIgY29sbGVjdGlvbiA9IHNlbGYuX2N1cnNvckRlc2NyaXB0aW9uLmNvbGxlY3Rpb25OYW1lO1xuICByZXR1cm4gTW9uZ28uQ29sbGVjdGlvbi5fcHVibGlzaEN1cnNvcihzZWxmLCBzdWIsIGNvbGxlY3Rpb24pO1xufTtcblxuLy8gVXNlZCB0byBndWFyYW50ZWUgdGhhdCBwdWJsaXNoIGZ1bmN0aW9ucyByZXR1cm4gYXQgbW9zdCBvbmUgY3Vyc29yIHBlclxuLy8gY29sbGVjdGlvbi4gUHJpdmF0ZSwgYmVjYXVzZSB3ZSBtaWdodCBsYXRlciBoYXZlIGN1cnNvcnMgdGhhdCBpbmNsdWRlXG4vLyBkb2N1bWVudHMgZnJvbSBtdWx0aXBsZSBjb2xsZWN0aW9ucyBzb21laG93LlxuQ3Vyc29yLnByb3RvdHlwZS5fZ2V0Q29sbGVjdGlvbk5hbWUgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgcmV0dXJuIHNlbGYuX2N1cnNvckRlc2NyaXB0aW9uLmNvbGxlY3Rpb25OYW1lO1xufTtcblxuQ3Vyc29yLnByb3RvdHlwZS5vYnNlcnZlID0gZnVuY3Rpb24gKGNhbGxiYWNrcykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHJldHVybiBMb2NhbENvbGxlY3Rpb24uX29ic2VydmVGcm9tT2JzZXJ2ZUNoYW5nZXMoc2VsZiwgY2FsbGJhY2tzKTtcbn07XG5cbkN1cnNvci5wcm90b3R5cGUub2JzZXJ2ZUNoYW5nZXMgPSBmdW5jdGlvbiAoY2FsbGJhY2tzKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdmFyIG1ldGhvZHMgPSBbXG4gICAgJ2FkZGVkQXQnLFxuICAgICdhZGRlZCcsXG4gICAgJ2NoYW5nZWRBdCcsXG4gICAgJ2NoYW5nZWQnLFxuICAgICdyZW1vdmVkQXQnLFxuICAgICdyZW1vdmVkJyxcbiAgICAnbW92ZWRUbydcbiAgXTtcbiAgdmFyIG9yZGVyZWQgPSBMb2NhbENvbGxlY3Rpb24uX29ic2VydmVDaGFuZ2VzQ2FsbGJhY2tzQXJlT3JkZXJlZChjYWxsYmFja3MpO1xuXG4gIC8vIFhYWDogQ2FuIHdlIGZpbmQgb3V0IGlmIGNhbGxiYWNrcyBhcmUgZnJvbSBvYnNlcnZlP1xuICB2YXIgZXhjZXB0aW9uTmFtZSA9ICcgb2JzZXJ2ZS9vYnNlcnZlQ2hhbmdlcyBjYWxsYmFjayc7XG4gIG1ldGhvZHMuZm9yRWFjaChmdW5jdGlvbiAobWV0aG9kKSB7XG4gICAgaWYgKGNhbGxiYWNrc1ttZXRob2RdICYmIHR5cGVvZiBjYWxsYmFja3NbbWV0aG9kXSA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIGNhbGxiYWNrc1ttZXRob2RdID0gTWV0ZW9yLmJpbmRFbnZpcm9ubWVudChjYWxsYmFja3NbbWV0aG9kXSwgbWV0aG9kICsgZXhjZXB0aW9uTmFtZSk7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gc2VsZi5fbW9uZ28uX29ic2VydmVDaGFuZ2VzKFxuICAgIHNlbGYuX2N1cnNvckRlc2NyaXB0aW9uLCBvcmRlcmVkLCBjYWxsYmFja3MpO1xufTtcblxuTW9uZ29Db25uZWN0aW9uLnByb3RvdHlwZS5fY3JlYXRlU3luY2hyb25vdXNDdXJzb3IgPSBmdW5jdGlvbihcbiAgICBjdXJzb3JEZXNjcmlwdGlvbiwgb3B0aW9ucykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIG9wdGlvbnMgPSBfLnBpY2sob3B0aW9ucyB8fCB7fSwgJ3NlbGZGb3JJdGVyYXRpb24nLCAndXNlVHJhbnNmb3JtJyk7XG5cbiAgdmFyIGNvbGxlY3Rpb24gPSBzZWxmLnJhd0NvbGxlY3Rpb24oY3Vyc29yRGVzY3JpcHRpb24uY29sbGVjdGlvbk5hbWUpO1xuICB2YXIgY3Vyc29yT3B0aW9ucyA9IGN1cnNvckRlc2NyaXB0aW9uLm9wdGlvbnM7XG4gIHZhciBtb25nb09wdGlvbnMgPSB7XG4gICAgc29ydDogY3Vyc29yT3B0aW9ucy5zb3J0LFxuICAgIGxpbWl0OiBjdXJzb3JPcHRpb25zLmxpbWl0LFxuICAgIHNraXA6IGN1cnNvck9wdGlvbnMuc2tpcCxcbiAgICBwcm9qZWN0aW9uOiBjdXJzb3JPcHRpb25zLmZpZWxkc1xuICB9O1xuXG4gIC8vIERvIHdlIHdhbnQgYSB0YWlsYWJsZSBjdXJzb3IgKHdoaWNoIG9ubHkgd29ya3Mgb24gY2FwcGVkIGNvbGxlY3Rpb25zKT9cbiAgaWYgKGN1cnNvck9wdGlvbnMudGFpbGFibGUpIHtcbiAgICAvLyBXZSB3YW50IGEgdGFpbGFibGUgY3Vyc29yLi4uXG4gICAgbW9uZ29PcHRpb25zLnRhaWxhYmxlID0gdHJ1ZTtcbiAgICAvLyAuLi4gYW5kIGZvciB0aGUgc2VydmVyIHRvIHdhaXQgYSBiaXQgaWYgYW55IGdldE1vcmUgaGFzIG5vIGRhdGEgKHJhdGhlclxuICAgIC8vIHRoYW4gbWFraW5nIHVzIHB1dCB0aGUgcmVsZXZhbnQgc2xlZXBzIGluIHRoZSBjbGllbnQpLi4uXG4gICAgbW9uZ29PcHRpb25zLmF3YWl0ZGF0YSA9IHRydWU7XG4gICAgLy8gLi4uIGFuZCB0byBrZWVwIHF1ZXJ5aW5nIHRoZSBzZXJ2ZXIgaW5kZWZpbml0ZWx5IHJhdGhlciB0aGFuIGp1c3QgNSB0aW1lc1xuICAgIC8vIGlmIHRoZXJlJ3Mgbm8gbW9yZSBkYXRhLlxuICAgIG1vbmdvT3B0aW9ucy5udW1iZXJPZlJldHJpZXMgPSAtMTtcbiAgICAvLyBBbmQgaWYgdGhpcyBpcyBvbiB0aGUgb3Bsb2cgY29sbGVjdGlvbiBhbmQgdGhlIGN1cnNvciBzcGVjaWZpZXMgYSAndHMnLFxuICAgIC8vIHRoZW4gc2V0IHRoZSB1bmRvY3VtZW50ZWQgb3Bsb2cgcmVwbGF5IGZsYWcsIHdoaWNoIGRvZXMgYSBzcGVjaWFsIHNjYW4gdG9cbiAgICAvLyBmaW5kIHRoZSBmaXJzdCBkb2N1bWVudCAoaW5zdGVhZCBvZiBjcmVhdGluZyBhbiBpbmRleCBvbiB0cykuIFRoaXMgaXMgYVxuICAgIC8vIHZlcnkgaGFyZC1jb2RlZCBNb25nbyBmbGFnIHdoaWNoIG9ubHkgd29ya3Mgb24gdGhlIG9wbG9nIGNvbGxlY3Rpb24gYW5kXG4gICAgLy8gb25seSB3b3JrcyB3aXRoIHRoZSB0cyBmaWVsZC5cbiAgICBpZiAoY3Vyc29yRGVzY3JpcHRpb24uY29sbGVjdGlvbk5hbWUgPT09IE9QTE9HX0NPTExFQ1RJT04gJiZcbiAgICAgICAgY3Vyc29yRGVzY3JpcHRpb24uc2VsZWN0b3IudHMpIHtcbiAgICAgIG1vbmdvT3B0aW9ucy5vcGxvZ1JlcGxheSA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgdmFyIGRiQ3Vyc29yID0gY29sbGVjdGlvbi5maW5kKFxuICAgIHJlcGxhY2VUeXBlcyhjdXJzb3JEZXNjcmlwdGlvbi5zZWxlY3RvciwgcmVwbGFjZU1ldGVvckF0b21XaXRoTW9uZ28pLFxuICAgIG1vbmdvT3B0aW9ucyk7XG5cbiAgaWYgKHR5cGVvZiBjdXJzb3JPcHRpb25zLm1heFRpbWVNcyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBkYkN1cnNvciA9IGRiQ3Vyc29yLm1heFRpbWVNUyhjdXJzb3JPcHRpb25zLm1heFRpbWVNcyk7XG4gIH1cbiAgaWYgKHR5cGVvZiBjdXJzb3JPcHRpb25zLmhpbnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgZGJDdXJzb3IgPSBkYkN1cnNvci5oaW50KGN1cnNvck9wdGlvbnMuaGludCk7XG4gIH1cblxuICByZXR1cm4gbmV3IFN5bmNocm9ub3VzQ3Vyc29yKGRiQ3Vyc29yLCBjdXJzb3JEZXNjcmlwdGlvbiwgb3B0aW9ucyk7XG59O1xuXG52YXIgU3luY2hyb25vdXNDdXJzb3IgPSBmdW5jdGlvbiAoZGJDdXJzb3IsIGN1cnNvckRlc2NyaXB0aW9uLCBvcHRpb25zKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgb3B0aW9ucyA9IF8ucGljayhvcHRpb25zIHx8IHt9LCAnc2VsZkZvckl0ZXJhdGlvbicsICd1c2VUcmFuc2Zvcm0nKTtcblxuICBzZWxmLl9kYkN1cnNvciA9IGRiQ3Vyc29yO1xuICBzZWxmLl9jdXJzb3JEZXNjcmlwdGlvbiA9IGN1cnNvckRlc2NyaXB0aW9uO1xuICAvLyBUaGUgXCJzZWxmXCIgYXJndW1lbnQgcGFzc2VkIHRvIGZvckVhY2gvbWFwIGNhbGxiYWNrcy4gSWYgd2UncmUgd3JhcHBlZFxuICAvLyBpbnNpZGUgYSB1c2VyLXZpc2libGUgQ3Vyc29yLCB3ZSB3YW50IHRvIHByb3ZpZGUgdGhlIG91dGVyIGN1cnNvciFcbiAgc2VsZi5fc2VsZkZvckl0ZXJhdGlvbiA9IG9wdGlvbnMuc2VsZkZvckl0ZXJhdGlvbiB8fCBzZWxmO1xuICBpZiAob3B0aW9ucy51c2VUcmFuc2Zvcm0gJiYgY3Vyc29yRGVzY3JpcHRpb24ub3B0aW9ucy50cmFuc2Zvcm0pIHtcbiAgICBzZWxmLl90cmFuc2Zvcm0gPSBMb2NhbENvbGxlY3Rpb24ud3JhcFRyYW5zZm9ybShcbiAgICAgIGN1cnNvckRlc2NyaXB0aW9uLm9wdGlvbnMudHJhbnNmb3JtKTtcbiAgfSBlbHNlIHtcbiAgICBzZWxmLl90cmFuc2Zvcm0gPSBudWxsO1xuICB9XG5cbiAgc2VsZi5fc3luY2hyb25vdXNDb3VudCA9IEZ1dHVyZS53cmFwKGRiQ3Vyc29yLmNvdW50LmJpbmQoZGJDdXJzb3IpKTtcbiAgc2VsZi5fdmlzaXRlZElkcyA9IG5ldyBMb2NhbENvbGxlY3Rpb24uX0lkTWFwO1xufTtcblxuXy5leHRlbmQoU3luY2hyb25vdXNDdXJzb3IucHJvdG90eXBlLCB7XG4gIC8vIFJldHVybnMgYSBQcm9taXNlIGZvciB0aGUgbmV4dCBvYmplY3QgZnJvbSB0aGUgdW5kZXJseWluZyBjdXJzb3IgKGJlZm9yZVxuICAvLyB0aGUgTW9uZ28tPk1ldGVvciB0eXBlIHJlcGxhY2VtZW50KS5cbiAgX3Jhd05leHRPYmplY3RQcm9taXNlOiBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHNlbGYuX2RiQ3Vyc29yLm5leHQoKGVyciwgZG9jKSA9PiB7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXNvbHZlKGRvYyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9LFxuXG4gIC8vIFJldHVybnMgYSBQcm9taXNlIGZvciB0aGUgbmV4dCBvYmplY3QgZnJvbSB0aGUgY3Vyc29yLCBza2lwcGluZyB0aG9zZSB3aG9zZVxuICAvLyBJRHMgd2UndmUgYWxyZWFkeSBzZWVuIGFuZCByZXBsYWNpbmcgTW9uZ28gYXRvbXMgd2l0aCBNZXRlb3IgYXRvbXMuXG4gIF9uZXh0T2JqZWN0UHJvbWlzZTogYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICB2YXIgZG9jID0gYXdhaXQgc2VsZi5fcmF3TmV4dE9iamVjdFByb21pc2UoKTtcblxuICAgICAgaWYgKCFkb2MpIHJldHVybiBudWxsO1xuICAgICAgZG9jID0gcmVwbGFjZVR5cGVzKGRvYywgcmVwbGFjZU1vbmdvQXRvbVdpdGhNZXRlb3IpO1xuXG4gICAgICBpZiAoIXNlbGYuX2N1cnNvckRlc2NyaXB0aW9uLm9wdGlvbnMudGFpbGFibGUgJiYgXy5oYXMoZG9jLCAnX2lkJykpIHtcbiAgICAgICAgLy8gRGlkIE1vbmdvIGdpdmUgdXMgZHVwbGljYXRlIGRvY3VtZW50cyBpbiB0aGUgc2FtZSBjdXJzb3I/IElmIHNvLFxuICAgICAgICAvLyBpZ25vcmUgdGhpcyBvbmUuIChEbyB0aGlzIGJlZm9yZSB0aGUgdHJhbnNmb3JtLCBzaW5jZSB0cmFuc2Zvcm0gbWlnaHRcbiAgICAgICAgLy8gcmV0dXJuIHNvbWUgdW5yZWxhdGVkIHZhbHVlLikgV2UgZG9uJ3QgZG8gdGhpcyBmb3IgdGFpbGFibGUgY3Vyc29ycyxcbiAgICAgICAgLy8gYmVjYXVzZSB3ZSB3YW50IHRvIG1haW50YWluIE8oMSkgbWVtb3J5IHVzYWdlLiBBbmQgaWYgdGhlcmUgaXNuJ3QgX2lkXG4gICAgICAgIC8vIGZvciBzb21lIHJlYXNvbiAobWF5YmUgaXQncyB0aGUgb3Bsb2cpLCB0aGVuIHdlIGRvbid0IGRvIHRoaXMgZWl0aGVyLlxuICAgICAgICAvLyAoQmUgY2FyZWZ1bCB0byBkbyB0aGlzIGZvciBmYWxzZXkgYnV0IGV4aXN0aW5nIF9pZCwgdGhvdWdoLilcbiAgICAgICAgaWYgKHNlbGYuX3Zpc2l0ZWRJZHMuaGFzKGRvYy5faWQpKSBjb250aW51ZTtcbiAgICAgICAgc2VsZi5fdmlzaXRlZElkcy5zZXQoZG9jLl9pZCwgdHJ1ZSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChzZWxmLl90cmFuc2Zvcm0pXG4gICAgICAgIGRvYyA9IHNlbGYuX3RyYW5zZm9ybShkb2MpO1xuXG4gICAgICByZXR1cm4gZG9jO1xuICAgIH1cbiAgfSxcblxuICAvLyBSZXR1cm5zIGEgcHJvbWlzZSB3aGljaCBpcyByZXNvbHZlZCB3aXRoIHRoZSBuZXh0IG9iamVjdCAobGlrZSB3aXRoXG4gIC8vIF9uZXh0T2JqZWN0UHJvbWlzZSkgb3IgcmVqZWN0ZWQgaWYgdGhlIGN1cnNvciBkb2Vzbid0IHJldHVybiB3aXRoaW5cbiAgLy8gdGltZW91dE1TIG1zLlxuICBfbmV4dE9iamVjdFByb21pc2VXaXRoVGltZW91dDogZnVuY3Rpb24gKHRpbWVvdXRNUykge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGlmICghdGltZW91dE1TKSB7XG4gICAgICByZXR1cm4gc2VsZi5fbmV4dE9iamVjdFByb21pc2UoKTtcbiAgICB9XG4gICAgY29uc3QgbmV4dE9iamVjdFByb21pc2UgPSBzZWxmLl9uZXh0T2JqZWN0UHJvbWlzZSgpO1xuICAgIGNvbnN0IHRpbWVvdXRFcnIgPSBuZXcgRXJyb3IoJ0NsaWVudC1zaWRlIHRpbWVvdXQgd2FpdGluZyBmb3IgbmV4dCBvYmplY3QnKTtcbiAgICBjb25zdCB0aW1lb3V0UHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IHRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHJlamVjdCh0aW1lb3V0RXJyKTtcbiAgICAgIH0sIHRpbWVvdXRNUyk7XG4gICAgfSk7XG4gICAgcmV0dXJuIFByb21pc2UucmFjZShbbmV4dE9iamVjdFByb21pc2UsIHRpbWVvdXRQcm9taXNlXSlcbiAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgIGlmIChlcnIgPT09IHRpbWVvdXRFcnIpIHtcbiAgICAgICAgICBzZWxmLmNsb3NlKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgfSk7XG4gIH0sXG5cbiAgX25leHRPYmplY3Q6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgcmV0dXJuIHNlbGYuX25leHRPYmplY3RQcm9taXNlKCkuYXdhaXQoKTtcbiAgfSxcblxuICBmb3JFYWNoOiBmdW5jdGlvbiAoY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAvLyBHZXQgYmFjayB0byB0aGUgYmVnaW5uaW5nLlxuICAgIHNlbGYuX3Jld2luZCgpO1xuXG4gICAgLy8gV2UgaW1wbGVtZW50IHRoZSBsb29wIG91cnNlbGYgaW5zdGVhZCBvZiB1c2luZyBzZWxmLl9kYkN1cnNvci5lYWNoLFxuICAgIC8vIGJlY2F1c2UgXCJlYWNoXCIgd2lsbCBjYWxsIGl0cyBjYWxsYmFjayBvdXRzaWRlIG9mIGEgZmliZXIgd2hpY2ggbWFrZXMgaXRcbiAgICAvLyBtdWNoIG1vcmUgY29tcGxleCB0byBtYWtlIHRoaXMgZnVuY3Rpb24gc3luY2hyb25vdXMuXG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgdmFyIGRvYyA9IHNlbGYuX25leHRPYmplY3QoKTtcbiAgICAgIGlmICghZG9jKSByZXR1cm47XG4gICAgICBjYWxsYmFjay5jYWxsKHRoaXNBcmcsIGRvYywgaW5kZXgrKywgc2VsZi5fc2VsZkZvckl0ZXJhdGlvbik7XG4gICAgfVxuICB9LFxuXG4gIC8vIFhYWCBBbGxvdyBvdmVybGFwcGluZyBjYWxsYmFjayBleGVjdXRpb25zIGlmIGNhbGxiYWNrIHlpZWxkcy5cbiAgbWFwOiBmdW5jdGlvbiAoY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIHJlcyA9IFtdO1xuICAgIHNlbGYuZm9yRWFjaChmdW5jdGlvbiAoZG9jLCBpbmRleCkge1xuICAgICAgcmVzLnB1c2goY2FsbGJhY2suY2FsbCh0aGlzQXJnLCBkb2MsIGluZGV4LCBzZWxmLl9zZWxmRm9ySXRlcmF0aW9uKSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlcztcbiAgfSxcblxuICBfcmV3aW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgLy8ga25vd24gdG8gYmUgc3luY2hyb25vdXNcbiAgICBzZWxmLl9kYkN1cnNvci5yZXdpbmQoKTtcblxuICAgIHNlbGYuX3Zpc2l0ZWRJZHMgPSBuZXcgTG9jYWxDb2xsZWN0aW9uLl9JZE1hcDtcbiAgfSxcblxuICAvLyBNb3N0bHkgdXNhYmxlIGZvciB0YWlsYWJsZSBjdXJzb3JzLlxuICBjbG9zZTogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHNlbGYuX2RiQ3Vyc29yLmNsb3NlKCk7XG4gIH0sXG5cbiAgZmV0Y2g6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgcmV0dXJuIHNlbGYubWFwKF8uaWRlbnRpdHkpO1xuICB9LFxuXG4gIGNvdW50OiBmdW5jdGlvbiAoYXBwbHlTa2lwTGltaXQgPSBmYWxzZSkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICByZXR1cm4gc2VsZi5fc3luY2hyb25vdXNDb3VudChhcHBseVNraXBMaW1pdCkud2FpdCgpO1xuICB9LFxuXG4gIC8vIFRoaXMgbWV0aG9kIGlzIE5PVCB3cmFwcGVkIGluIEN1cnNvci5cbiAgZ2V0UmF3T2JqZWN0czogZnVuY3Rpb24gKG9yZGVyZWQpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgaWYgKG9yZGVyZWQpIHtcbiAgICAgIHJldHVybiBzZWxmLmZldGNoKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciByZXN1bHRzID0gbmV3IExvY2FsQ29sbGVjdGlvbi5fSWRNYXA7XG4gICAgICBzZWxmLmZvckVhY2goZnVuY3Rpb24gKGRvYykge1xuICAgICAgICByZXN1bHRzLnNldChkb2MuX2lkLCBkb2MpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9XG4gIH1cbn0pO1xuXG5TeW5jaHJvbm91c0N1cnNvci5wcm90b3R5cGVbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIC8vIEdldCBiYWNrIHRvIHRoZSBiZWdpbm5pbmcuXG4gIHNlbGYuX3Jld2luZCgpO1xuXG4gIHJldHVybiB7XG4gICAgbmV4dCgpIHtcbiAgICAgIGNvbnN0IGRvYyA9IHNlbGYuX25leHRPYmplY3QoKTtcbiAgICAgIHJldHVybiBkb2MgPyB7XG4gICAgICAgIHZhbHVlOiBkb2NcbiAgICAgIH0gOiB7XG4gICAgICAgIGRvbmU6IHRydWVcbiAgICAgIH07XG4gICAgfVxuICB9O1xufTtcblxuLy8gVGFpbHMgdGhlIGN1cnNvciBkZXNjcmliZWQgYnkgY3Vyc29yRGVzY3JpcHRpb24sIG1vc3QgbGlrZWx5IG9uIHRoZVxuLy8gb3Bsb2cuIENhbGxzIGRvY0NhbGxiYWNrIHdpdGggZWFjaCBkb2N1bWVudCBmb3VuZC4gSWdub3JlcyBlcnJvcnMgYW5kIGp1c3Rcbi8vIHJlc3RhcnRzIHRoZSB0YWlsIG9uIGVycm9yLlxuLy9cbi8vIElmIHRpbWVvdXRNUyBpcyBzZXQsIHRoZW4gaWYgd2UgZG9uJ3QgZ2V0IGEgbmV3IGRvY3VtZW50IGV2ZXJ5IHRpbWVvdXRNUyxcbi8vIGtpbGwgYW5kIHJlc3RhcnQgdGhlIGN1cnNvci4gVGhpcyBpcyBwcmltYXJpbHkgYSB3b3JrYXJvdW5kIGZvciAjODU5OC5cbk1vbmdvQ29ubmVjdGlvbi5wcm90b3R5cGUudGFpbCA9IGZ1bmN0aW9uIChjdXJzb3JEZXNjcmlwdGlvbiwgZG9jQ2FsbGJhY2ssIHRpbWVvdXRNUykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIGlmICghY3Vyc29yRGVzY3JpcHRpb24ub3B0aW9ucy50YWlsYWJsZSlcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW4gb25seSB0YWlsIGEgdGFpbGFibGUgY3Vyc29yXCIpO1xuXG4gIHZhciBjdXJzb3IgPSBzZWxmLl9jcmVhdGVTeW5jaHJvbm91c0N1cnNvcihjdXJzb3JEZXNjcmlwdGlvbik7XG5cbiAgdmFyIHN0b3BwZWQgPSBmYWxzZTtcbiAgdmFyIGxhc3RUUztcbiAgdmFyIGxvb3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGRvYyA9IG51bGw7XG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIGlmIChzdG9wcGVkKVxuICAgICAgICByZXR1cm47XG4gICAgICB0cnkge1xuICAgICAgICBkb2MgPSBjdXJzb3IuX25leHRPYmplY3RQcm9taXNlV2l0aFRpbWVvdXQodGltZW91dE1TKS5hd2FpdCgpO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIC8vIFRoZXJlJ3Mgbm8gZ29vZCB3YXkgdG8gZmlndXJlIG91dCBpZiB0aGlzIHdhcyBhY3R1YWxseSBhbiBlcnJvciBmcm9tXG4gICAgICAgIC8vIE1vbmdvLCBvciBqdXN0IGNsaWVudC1zaWRlIChpbmNsdWRpbmcgb3VyIG93biB0aW1lb3V0IGVycm9yKS4gQWhcbiAgICAgICAgLy8gd2VsbC4gQnV0IGVpdGhlciB3YXksIHdlIG5lZWQgdG8gcmV0cnkgdGhlIGN1cnNvciAodW5sZXNzIHRoZSBmYWlsdXJlXG4gICAgICAgIC8vIHdhcyBiZWNhdXNlIHRoZSBvYnNlcnZlIGdvdCBzdG9wcGVkKS5cbiAgICAgICAgZG9jID0gbnVsbDtcbiAgICAgIH1cbiAgICAgIC8vIFNpbmNlIHdlIGF3YWl0ZWQgYSBwcm9taXNlIGFib3ZlLCB3ZSBuZWVkIHRvIGNoZWNrIGFnYWluIHRvIHNlZSBpZlxuICAgICAgLy8gd2UndmUgYmVlbiBzdG9wcGVkIGJlZm9yZSBjYWxsaW5nIHRoZSBjYWxsYmFjay5cbiAgICAgIGlmIChzdG9wcGVkKVxuICAgICAgICByZXR1cm47XG4gICAgICBpZiAoZG9jKSB7XG4gICAgICAgIC8vIElmIGEgdGFpbGFibGUgY3Vyc29yIGNvbnRhaW5zIGEgXCJ0c1wiIGZpZWxkLCB1c2UgaXQgdG8gcmVjcmVhdGUgdGhlXG4gICAgICAgIC8vIGN1cnNvciBvbiBlcnJvci4gKFwidHNcIiBpcyBhIHN0YW5kYXJkIHRoYXQgTW9uZ28gdXNlcyBpbnRlcm5hbGx5IGZvclxuICAgICAgICAvLyB0aGUgb3Bsb2csIGFuZCB0aGVyZSdzIGEgc3BlY2lhbCBmbGFnIHRoYXQgbGV0cyB5b3UgZG8gYmluYXJ5IHNlYXJjaFxuICAgICAgICAvLyBvbiBpdCBpbnN0ZWFkIG9mIG5lZWRpbmcgdG8gdXNlIGFuIGluZGV4LilcbiAgICAgICAgbGFzdFRTID0gZG9jLnRzO1xuICAgICAgICBkb2NDYWxsYmFjayhkb2MpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIG5ld1NlbGVjdG9yID0gXy5jbG9uZShjdXJzb3JEZXNjcmlwdGlvbi5zZWxlY3Rvcik7XG4gICAgICAgIGlmIChsYXN0VFMpIHtcbiAgICAgICAgICBuZXdTZWxlY3Rvci50cyA9IHskZ3Q6IGxhc3RUU307XG4gICAgICAgIH1cbiAgICAgICAgY3Vyc29yID0gc2VsZi5fY3JlYXRlU3luY2hyb25vdXNDdXJzb3IobmV3IEN1cnNvckRlc2NyaXB0aW9uKFxuICAgICAgICAgIGN1cnNvckRlc2NyaXB0aW9uLmNvbGxlY3Rpb25OYW1lLFxuICAgICAgICAgIG5ld1NlbGVjdG9yLFxuICAgICAgICAgIGN1cnNvckRlc2NyaXB0aW9uLm9wdGlvbnMpKTtcbiAgICAgICAgLy8gTW9uZ28gZmFpbG92ZXIgdGFrZXMgbWFueSBzZWNvbmRzLiAgUmV0cnkgaW4gYSBiaXQuICAoV2l0aG91dCB0aGlzXG4gICAgICAgIC8vIHNldFRpbWVvdXQsIHdlIHBlZyB0aGUgQ1BVIGF0IDEwMCUgYW5kIG5ldmVyIG5vdGljZSB0aGUgYWN0dWFsXG4gICAgICAgIC8vIGZhaWxvdmVyLlxuICAgICAgICBNZXRlb3Iuc2V0VGltZW91dChsb29wLCAxMDApO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgTWV0ZW9yLmRlZmVyKGxvb3ApO1xuXG4gIHJldHVybiB7XG4gICAgc3RvcDogZnVuY3Rpb24gKCkge1xuICAgICAgc3RvcHBlZCA9IHRydWU7XG4gICAgICBjdXJzb3IuY2xvc2UoKTtcbiAgICB9XG4gIH07XG59O1xuXG5Nb25nb0Nvbm5lY3Rpb24ucHJvdG90eXBlLl9vYnNlcnZlQ2hhbmdlcyA9IGZ1bmN0aW9uIChcbiAgICBjdXJzb3JEZXNjcmlwdGlvbiwgb3JkZXJlZCwgY2FsbGJhY2tzKSB7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICBpZiAoY3Vyc29yRGVzY3JpcHRpb24ub3B0aW9ucy50YWlsYWJsZSkge1xuICAgIHJldHVybiBzZWxmLl9vYnNlcnZlQ2hhbmdlc1RhaWxhYmxlKGN1cnNvckRlc2NyaXB0aW9uLCBvcmRlcmVkLCBjYWxsYmFja3MpO1xuICB9XG5cbiAgLy8gWW91IG1heSBub3QgZmlsdGVyIG91dCBfaWQgd2hlbiBvYnNlcnZpbmcgY2hhbmdlcywgYmVjYXVzZSB0aGUgaWQgaXMgYSBjb3JlXG4gIC8vIHBhcnQgb2YgdGhlIG9ic2VydmVDaGFuZ2VzIEFQSS5cbiAgaWYgKGN1cnNvckRlc2NyaXB0aW9uLm9wdGlvbnMuZmllbGRzICYmXG4gICAgICAoY3Vyc29yRGVzY3JpcHRpb24ub3B0aW9ucy5maWVsZHMuX2lkID09PSAwIHx8XG4gICAgICAgY3Vyc29yRGVzY3JpcHRpb24ub3B0aW9ucy5maWVsZHMuX2lkID09PSBmYWxzZSkpIHtcbiAgICB0aHJvdyBFcnJvcihcIllvdSBtYXkgbm90IG9ic2VydmUgYSBjdXJzb3Igd2l0aCB7ZmllbGRzOiB7X2lkOiAwfX1cIik7XG4gIH1cblxuICB2YXIgb2JzZXJ2ZUtleSA9IEVKU09OLnN0cmluZ2lmeShcbiAgICBfLmV4dGVuZCh7b3JkZXJlZDogb3JkZXJlZH0sIGN1cnNvckRlc2NyaXB0aW9uKSk7XG5cbiAgdmFyIG11bHRpcGxleGVyLCBvYnNlcnZlRHJpdmVyO1xuICB2YXIgZmlyc3RIYW5kbGUgPSBmYWxzZTtcblxuICAvLyBGaW5kIGEgbWF0Y2hpbmcgT2JzZXJ2ZU11bHRpcGxleGVyLCBvciBjcmVhdGUgYSBuZXcgb25lLiBUaGlzIG5leHQgYmxvY2sgaXNcbiAgLy8gZ3VhcmFudGVlZCB0byBub3QgeWllbGQgKGFuZCBpdCBkb2Vzbid0IGNhbGwgYW55dGhpbmcgdGhhdCBjYW4gb2JzZXJ2ZSBhXG4gIC8vIG5ldyBxdWVyeSksIHNvIG5vIG90aGVyIGNhbGxzIHRvIHRoaXMgZnVuY3Rpb24gY2FuIGludGVybGVhdmUgd2l0aCBpdC5cbiAgTWV0ZW9yLl9ub1lpZWxkc0FsbG93ZWQoZnVuY3Rpb24gKCkge1xuICAgIGlmIChfLmhhcyhzZWxmLl9vYnNlcnZlTXVsdGlwbGV4ZXJzLCBvYnNlcnZlS2V5KSkge1xuICAgICAgbXVsdGlwbGV4ZXIgPSBzZWxmLl9vYnNlcnZlTXVsdGlwbGV4ZXJzW29ic2VydmVLZXldO1xuICAgIH0gZWxzZSB7XG4gICAgICBmaXJzdEhhbmRsZSA9IHRydWU7XG4gICAgICAvLyBDcmVhdGUgYSBuZXcgT2JzZXJ2ZU11bHRpcGxleGVyLlxuICAgICAgbXVsdGlwbGV4ZXIgPSBuZXcgT2JzZXJ2ZU11bHRpcGxleGVyKHtcbiAgICAgICAgb3JkZXJlZDogb3JkZXJlZCxcbiAgICAgICAgb25TdG9wOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgZGVsZXRlIHNlbGYuX29ic2VydmVNdWx0aXBsZXhlcnNbb2JzZXJ2ZUtleV07XG4gICAgICAgICAgb2JzZXJ2ZURyaXZlci5zdG9wKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgc2VsZi5fb2JzZXJ2ZU11bHRpcGxleGVyc1tvYnNlcnZlS2V5XSA9IG11bHRpcGxleGVyO1xuICAgIH1cbiAgfSk7XG5cbiAgdmFyIG9ic2VydmVIYW5kbGUgPSBuZXcgT2JzZXJ2ZUhhbmRsZShtdWx0aXBsZXhlciwgY2FsbGJhY2tzKTtcblxuICBpZiAoZmlyc3RIYW5kbGUpIHtcbiAgICB2YXIgbWF0Y2hlciwgc29ydGVyO1xuICAgIHZhciBjYW5Vc2VPcGxvZyA9IF8uYWxsKFtcbiAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gQXQgYSBiYXJlIG1pbmltdW0sIHVzaW5nIHRoZSBvcGxvZyByZXF1aXJlcyB1cyB0byBoYXZlIGFuIG9wbG9nLCB0b1xuICAgICAgICAvLyB3YW50IHVub3JkZXJlZCBjYWxsYmFja3MsIGFuZCB0byBub3Qgd2FudCBhIGNhbGxiYWNrIG9uIHRoZSBwb2xsc1xuICAgICAgICAvLyB0aGF0IHdvbid0IGhhcHBlbi5cbiAgICAgICAgcmV0dXJuIHNlbGYuX29wbG9nSGFuZGxlICYmICFvcmRlcmVkICYmXG4gICAgICAgICAgIWNhbGxiYWNrcy5fdGVzdE9ubHlQb2xsQ2FsbGJhY2s7XG4gICAgICB9LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIFdlIG5lZWQgdG8gYmUgYWJsZSB0byBjb21waWxlIHRoZSBzZWxlY3Rvci4gRmFsbCBiYWNrIHRvIHBvbGxpbmcgZm9yXG4gICAgICAgIC8vIHNvbWUgbmV3ZmFuZ2xlZCAkc2VsZWN0b3IgdGhhdCBtaW5pbW9uZ28gZG9lc24ndCBzdXBwb3J0IHlldC5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBtYXRjaGVyID0gbmV3IE1pbmltb25nby5NYXRjaGVyKGN1cnNvckRlc2NyaXB0aW9uLnNlbGVjdG9yKTtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIC8vIFhYWCBtYWtlIGFsbCBjb21waWxhdGlvbiBlcnJvcnMgTWluaW1vbmdvRXJyb3Igb3Igc29tZXRoaW5nXG4gICAgICAgICAgLy8gICAgIHNvIHRoYXQgdGhpcyBkb2Vzbid0IGlnbm9yZSB1bnJlbGF0ZWQgZXhjZXB0aW9uc1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyAuLi4gYW5kIHRoZSBzZWxlY3RvciBpdHNlbGYgbmVlZHMgdG8gc3VwcG9ydCBvcGxvZy5cbiAgICAgICAgcmV0dXJuIE9wbG9nT2JzZXJ2ZURyaXZlci5jdXJzb3JTdXBwb3J0ZWQoY3Vyc29yRGVzY3JpcHRpb24sIG1hdGNoZXIpO1xuICAgICAgfSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBBbmQgd2UgbmVlZCB0byBiZSBhYmxlIHRvIGNvbXBpbGUgdGhlIHNvcnQsIGlmIGFueS4gIGVnLCBjYW4ndCBiZVxuICAgICAgICAvLyB7JG5hdHVyYWw6IDF9LlxuICAgICAgICBpZiAoIWN1cnNvckRlc2NyaXB0aW9uLm9wdGlvbnMuc29ydClcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBzb3J0ZXIgPSBuZXcgTWluaW1vbmdvLlNvcnRlcihjdXJzb3JEZXNjcmlwdGlvbi5vcHRpb25zLnNvcnQpO1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgLy8gWFhYIG1ha2UgYWxsIGNvbXBpbGF0aW9uIGVycm9ycyBNaW5pbW9uZ29FcnJvciBvciBzb21ldGhpbmdcbiAgICAgICAgICAvLyAgICAgc28gdGhhdCB0aGlzIGRvZXNuJ3QgaWdub3JlIHVucmVsYXRlZCBleGNlcHRpb25zXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XSwgZnVuY3Rpb24gKGYpIHsgcmV0dXJuIGYoKTsgfSk7ICAvLyBpbnZva2UgZWFjaCBmdW5jdGlvblxuXG4gICAgdmFyIGRyaXZlckNsYXNzID0gY2FuVXNlT3Bsb2cgPyBPcGxvZ09ic2VydmVEcml2ZXIgOiBQb2xsaW5nT2JzZXJ2ZURyaXZlcjtcbiAgICBvYnNlcnZlRHJpdmVyID0gbmV3IGRyaXZlckNsYXNzKHtcbiAgICAgIGN1cnNvckRlc2NyaXB0aW9uOiBjdXJzb3JEZXNjcmlwdGlvbixcbiAgICAgIG1vbmdvSGFuZGxlOiBzZWxmLFxuICAgICAgbXVsdGlwbGV4ZXI6IG11bHRpcGxleGVyLFxuICAgICAgb3JkZXJlZDogb3JkZXJlZCxcbiAgICAgIG1hdGNoZXI6IG1hdGNoZXIsICAvLyBpZ25vcmVkIGJ5IHBvbGxpbmdcbiAgICAgIHNvcnRlcjogc29ydGVyLCAgLy8gaWdub3JlZCBieSBwb2xsaW5nXG4gICAgICBfdGVzdE9ubHlQb2xsQ2FsbGJhY2s6IGNhbGxiYWNrcy5fdGVzdE9ubHlQb2xsQ2FsbGJhY2tcbiAgICB9KTtcblxuICAgIC8vIFRoaXMgZmllbGQgaXMgb25seSBzZXQgZm9yIHVzZSBpbiB0ZXN0cy5cbiAgICBtdWx0aXBsZXhlci5fb2JzZXJ2ZURyaXZlciA9IG9ic2VydmVEcml2ZXI7XG4gIH1cblxuICAvLyBCbG9ja3MgdW50aWwgdGhlIGluaXRpYWwgYWRkcyBoYXZlIGJlZW4gc2VudC5cbiAgbXVsdGlwbGV4ZXIuYWRkSGFuZGxlQW5kU2VuZEluaXRpYWxBZGRzKG9ic2VydmVIYW5kbGUpO1xuXG4gIHJldHVybiBvYnNlcnZlSGFuZGxlO1xufTtcblxuLy8gTGlzdGVuIGZvciB0aGUgaW52YWxpZGF0aW9uIG1lc3NhZ2VzIHRoYXQgd2lsbCB0cmlnZ2VyIHVzIHRvIHBvbGwgdGhlXG4vLyBkYXRhYmFzZSBmb3IgY2hhbmdlcy4gSWYgdGhpcyBzZWxlY3RvciBzcGVjaWZpZXMgc3BlY2lmaWMgSURzLCBzcGVjaWZ5IHRoZW1cbi8vIGhlcmUsIHNvIHRoYXQgdXBkYXRlcyB0byBkaWZmZXJlbnQgc3BlY2lmaWMgSURzIGRvbid0IGNhdXNlIHVzIHRvIHBvbGwuXG4vLyBsaXN0ZW5DYWxsYmFjayBpcyB0aGUgc2FtZSBraW5kIG9mIChub3RpZmljYXRpb24sIGNvbXBsZXRlKSBjYWxsYmFjayBwYXNzZWRcbi8vIHRvIEludmFsaWRhdGlvbkNyb3NzYmFyLmxpc3Rlbi5cblxubGlzdGVuQWxsID0gZnVuY3Rpb24gKGN1cnNvckRlc2NyaXB0aW9uLCBsaXN0ZW5DYWxsYmFjaykge1xuICB2YXIgbGlzdGVuZXJzID0gW107XG4gIGZvckVhY2hUcmlnZ2VyKGN1cnNvckRlc2NyaXB0aW9uLCBmdW5jdGlvbiAodHJpZ2dlcikge1xuICAgIGxpc3RlbmVycy5wdXNoKEREUFNlcnZlci5fSW52YWxpZGF0aW9uQ3Jvc3NiYXIubGlzdGVuKFxuICAgICAgdHJpZ2dlciwgbGlzdGVuQ2FsbGJhY2spKTtcbiAgfSk7XG5cbiAgcmV0dXJuIHtcbiAgICBzdG9wOiBmdW5jdGlvbiAoKSB7XG4gICAgICBfLmVhY2gobGlzdGVuZXJzLCBmdW5jdGlvbiAobGlzdGVuZXIpIHtcbiAgICAgICAgbGlzdGVuZXIuc3RvcCgpO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xufTtcblxuZm9yRWFjaFRyaWdnZXIgPSBmdW5jdGlvbiAoY3Vyc29yRGVzY3JpcHRpb24sIHRyaWdnZXJDYWxsYmFjaykge1xuICB2YXIga2V5ID0ge2NvbGxlY3Rpb246IGN1cnNvckRlc2NyaXB0aW9uLmNvbGxlY3Rpb25OYW1lfTtcbiAgdmFyIHNwZWNpZmljSWRzID0gTG9jYWxDb2xsZWN0aW9uLl9pZHNNYXRjaGVkQnlTZWxlY3RvcihcbiAgICBjdXJzb3JEZXNjcmlwdGlvbi5zZWxlY3Rvcik7XG4gIGlmIChzcGVjaWZpY0lkcykge1xuICAgIF8uZWFjaChzcGVjaWZpY0lkcywgZnVuY3Rpb24gKGlkKSB7XG4gICAgICB0cmlnZ2VyQ2FsbGJhY2soXy5leHRlbmQoe2lkOiBpZH0sIGtleSkpO1xuICAgIH0pO1xuICAgIHRyaWdnZXJDYWxsYmFjayhfLmV4dGVuZCh7ZHJvcENvbGxlY3Rpb246IHRydWUsIGlkOiBudWxsfSwga2V5KSk7XG4gIH0gZWxzZSB7XG4gICAgdHJpZ2dlckNhbGxiYWNrKGtleSk7XG4gIH1cbiAgLy8gRXZlcnlvbmUgY2FyZXMgYWJvdXQgdGhlIGRhdGFiYXNlIGJlaW5nIGRyb3BwZWQuXG4gIHRyaWdnZXJDYWxsYmFjayh7IGRyb3BEYXRhYmFzZTogdHJ1ZSB9KTtcbn07XG5cbi8vIG9ic2VydmVDaGFuZ2VzIGZvciB0YWlsYWJsZSBjdXJzb3JzIG9uIGNhcHBlZCBjb2xsZWN0aW9ucy5cbi8vXG4vLyBTb21lIGRpZmZlcmVuY2VzIGZyb20gbm9ybWFsIGN1cnNvcnM6XG4vLyAgIC0gV2lsbCBuZXZlciBwcm9kdWNlIGFueXRoaW5nIG90aGVyIHRoYW4gJ2FkZGVkJyBvciAnYWRkZWRCZWZvcmUnLiBJZiB5b3Vcbi8vICAgICBkbyB1cGRhdGUgYSBkb2N1bWVudCB0aGF0IGhhcyBhbHJlYWR5IGJlZW4gcHJvZHVjZWQsIHRoaXMgd2lsbCBub3Qgbm90aWNlXG4vLyAgICAgaXQuXG4vLyAgIC0gSWYgeW91IGRpc2Nvbm5lY3QgYW5kIHJlY29ubmVjdCBmcm9tIE1vbmdvLCBpdCB3aWxsIGVzc2VudGlhbGx5IHJlc3RhcnRcbi8vICAgICB0aGUgcXVlcnksIHdoaWNoIHdpbGwgbGVhZCB0byBkdXBsaWNhdGUgcmVzdWx0cy4gVGhpcyBpcyBwcmV0dHkgYmFkLFxuLy8gICAgIGJ1dCBpZiB5b3UgaW5jbHVkZSBhIGZpZWxkIGNhbGxlZCAndHMnIHdoaWNoIGlzIGluc2VydGVkIGFzXG4vLyAgICAgbmV3IE1vbmdvSW50ZXJuYWxzLk1vbmdvVGltZXN0YW1wKDAsIDApICh3aGljaCBpcyBpbml0aWFsaXplZCB0byB0aGVcbi8vICAgICBjdXJyZW50IE1vbmdvLXN0eWxlIHRpbWVzdGFtcCksIHdlJ2xsIGJlIGFibGUgdG8gZmluZCB0aGUgcGxhY2UgdG9cbi8vICAgICByZXN0YXJ0IHByb3Blcmx5LiAoVGhpcyBmaWVsZCBpcyBzcGVjaWZpY2FsbHkgdW5kZXJzdG9vZCBieSBNb25nbyB3aXRoIGFuXG4vLyAgICAgb3B0aW1pemF0aW9uIHdoaWNoIGFsbG93cyBpdCB0byBmaW5kIHRoZSByaWdodCBwbGFjZSB0byBzdGFydCB3aXRob3V0XG4vLyAgICAgYW4gaW5kZXggb24gdHMuIEl0J3MgaG93IHRoZSBvcGxvZyB3b3Jrcy4pXG4vLyAgIC0gTm8gY2FsbGJhY2tzIGFyZSB0cmlnZ2VyZWQgc3luY2hyb25vdXNseSB3aXRoIHRoZSBjYWxsICh0aGVyZSdzIG5vXG4vLyAgICAgZGlmZmVyZW50aWF0aW9uIGJldHdlZW4gXCJpbml0aWFsIGRhdGFcIiBhbmQgXCJsYXRlciBjaGFuZ2VzXCI7IGV2ZXJ5dGhpbmdcbi8vICAgICB0aGF0IG1hdGNoZXMgdGhlIHF1ZXJ5IGdldHMgc2VudCBhc3luY2hyb25vdXNseSkuXG4vLyAgIC0gRGUtZHVwbGljYXRpb24gaXMgbm90IGltcGxlbWVudGVkLlxuLy8gICAtIERvZXMgbm90IHlldCBpbnRlcmFjdCB3aXRoIHRoZSB3cml0ZSBmZW5jZS4gUHJvYmFibHksIHRoaXMgc2hvdWxkIHdvcmsgYnlcbi8vICAgICBpZ25vcmluZyByZW1vdmVzICh3aGljaCBkb24ndCB3b3JrIG9uIGNhcHBlZCBjb2xsZWN0aW9ucykgYW5kIHVwZGF0ZXNcbi8vICAgICAod2hpY2ggZG9uJ3QgYWZmZWN0IHRhaWxhYmxlIGN1cnNvcnMpLCBhbmQganVzdCBrZWVwaW5nIHRyYWNrIG9mIHRoZSBJRFxuLy8gICAgIG9mIHRoZSBpbnNlcnRlZCBvYmplY3QsIGFuZCBjbG9zaW5nIHRoZSB3cml0ZSBmZW5jZSBvbmNlIHlvdSBnZXQgdG8gdGhhdFxuLy8gICAgIElEIChvciB0aW1lc3RhbXA/KS4gIFRoaXMgZG9lc24ndCB3b3JrIHdlbGwgaWYgdGhlIGRvY3VtZW50IGRvZXNuJ3QgbWF0Y2hcbi8vICAgICB0aGUgcXVlcnksIHRob3VnaC4gIE9uIHRoZSBvdGhlciBoYW5kLCB0aGUgd3JpdGUgZmVuY2UgY2FuIGNsb3NlXG4vLyAgICAgaW1tZWRpYXRlbHkgaWYgaXQgZG9lcyBub3QgbWF0Y2ggdGhlIHF1ZXJ5LiBTbyBpZiB3ZSB0cnVzdCBtaW5pbW9uZ29cbi8vICAgICBlbm91Z2ggdG8gYWNjdXJhdGVseSBldmFsdWF0ZSB0aGUgcXVlcnkgYWdhaW5zdCB0aGUgd3JpdGUgZmVuY2UsIHdlXG4vLyAgICAgc2hvdWxkIGJlIGFibGUgdG8gZG8gdGhpcy4uLiAgT2YgY291cnNlLCBtaW5pbW9uZ28gZG9lc24ndCBldmVuIHN1cHBvcnRcbi8vICAgICBNb25nbyBUaW1lc3RhbXBzIHlldC5cbk1vbmdvQ29ubmVjdGlvbi5wcm90b3R5cGUuX29ic2VydmVDaGFuZ2VzVGFpbGFibGUgPSBmdW5jdGlvbiAoXG4gICAgY3Vyc29yRGVzY3JpcHRpb24sIG9yZGVyZWQsIGNhbGxiYWNrcykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgLy8gVGFpbGFibGUgY3Vyc29ycyBvbmx5IGV2ZXIgY2FsbCBhZGRlZC9hZGRlZEJlZm9yZSBjYWxsYmFja3MsIHNvIGl0J3MgYW5cbiAgLy8gZXJyb3IgaWYgeW91IGRpZG4ndCBwcm92aWRlIHRoZW0uXG4gIGlmICgob3JkZXJlZCAmJiAhY2FsbGJhY2tzLmFkZGVkQmVmb3JlKSB8fFxuICAgICAgKCFvcmRlcmVkICYmICFjYWxsYmFja3MuYWRkZWQpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ2FuJ3Qgb2JzZXJ2ZSBhbiBcIiArIChvcmRlcmVkID8gXCJvcmRlcmVkXCIgOiBcInVub3JkZXJlZFwiKVxuICAgICAgICAgICAgICAgICAgICArIFwiIHRhaWxhYmxlIGN1cnNvciB3aXRob3V0IGEgXCJcbiAgICAgICAgICAgICAgICAgICAgKyAob3JkZXJlZCA/IFwiYWRkZWRCZWZvcmVcIiA6IFwiYWRkZWRcIikgKyBcIiBjYWxsYmFja1wiKTtcbiAgfVxuXG4gIHJldHVybiBzZWxmLnRhaWwoY3Vyc29yRGVzY3JpcHRpb24sIGZ1bmN0aW9uIChkb2MpIHtcbiAgICB2YXIgaWQgPSBkb2MuX2lkO1xuICAgIGRlbGV0ZSBkb2MuX2lkO1xuICAgIC8vIFRoZSB0cyBpcyBhbiBpbXBsZW1lbnRhdGlvbiBkZXRhaWwuIEhpZGUgaXQuXG4gICAgZGVsZXRlIGRvYy50cztcbiAgICBpZiAob3JkZXJlZCkge1xuICAgICAgY2FsbGJhY2tzLmFkZGVkQmVmb3JlKGlkLCBkb2MsIG51bGwpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjYWxsYmFja3MuYWRkZWQoaWQsIGRvYyk7XG4gICAgfVxuICB9KTtcbn07XG5cbi8vIFhYWCBXZSBwcm9iYWJseSBuZWVkIHRvIGZpbmQgYSBiZXR0ZXIgd2F5IHRvIGV4cG9zZSB0aGlzLiBSaWdodCBub3dcbi8vIGl0J3Mgb25seSB1c2VkIGJ5IHRlc3RzLCBidXQgaW4gZmFjdCB5b3UgbmVlZCBpdCBpbiBub3JtYWxcbi8vIG9wZXJhdGlvbiB0byBpbnRlcmFjdCB3aXRoIGNhcHBlZCBjb2xsZWN0aW9ucy5cbk1vbmdvSW50ZXJuYWxzLk1vbmdvVGltZXN0YW1wID0gTW9uZ29EQi5UaW1lc3RhbXA7XG5cbk1vbmdvSW50ZXJuYWxzLkNvbm5lY3Rpb24gPSBNb25nb0Nvbm5lY3Rpb247XG4iLCJ2YXIgRnV0dXJlID0gTnBtLnJlcXVpcmUoJ2ZpYmVycy9mdXR1cmUnKTtcblxuaW1wb3J0IHsgTnBtTW9kdWxlTW9uZ29kYiB9IGZyb20gXCJtZXRlb3IvbnBtLW1vbmdvXCI7XG5jb25zdCB7IFRpbWVzdGFtcCB9ID0gTnBtTW9kdWxlTW9uZ29kYjtcblxuT1BMT0dfQ09MTEVDVElPTiA9ICdvcGxvZy5ycyc7XG5cbnZhciBUT09fRkFSX0JFSElORCA9IHByb2Nlc3MuZW52Lk1FVEVPUl9PUExPR19UT09fRkFSX0JFSElORCB8fCAyMDAwO1xudmFyIFRBSUxfVElNRU9VVCA9ICtwcm9jZXNzLmVudi5NRVRFT1JfT1BMT0dfVEFJTF9USU1FT1VUIHx8IDMwMDAwO1xuXG52YXIgc2hvd1RTID0gZnVuY3Rpb24gKHRzKSB7XG4gIHJldHVybiBcIlRpbWVzdGFtcChcIiArIHRzLmdldEhpZ2hCaXRzKCkgKyBcIiwgXCIgKyB0cy5nZXRMb3dCaXRzKCkgKyBcIilcIjtcbn07XG5cbmlkRm9yT3AgPSBmdW5jdGlvbiAob3ApIHtcbiAgaWYgKG9wLm9wID09PSAnZCcpXG4gICAgcmV0dXJuIG9wLm8uX2lkO1xuICBlbHNlIGlmIChvcC5vcCA9PT0gJ2knKVxuICAgIHJldHVybiBvcC5vLl9pZDtcbiAgZWxzZSBpZiAob3Aub3AgPT09ICd1JylcbiAgICByZXR1cm4gb3AubzIuX2lkO1xuICBlbHNlIGlmIChvcC5vcCA9PT0gJ2MnKVxuICAgIHRocm93IEVycm9yKFwiT3BlcmF0b3IgJ2MnIGRvZXNuJ3Qgc3VwcGx5IGFuIG9iamVjdCB3aXRoIGlkOiBcIiArXG4gICAgICAgICAgICAgICAgRUpTT04uc3RyaW5naWZ5KG9wKSk7XG4gIGVsc2VcbiAgICB0aHJvdyBFcnJvcihcIlVua25vd24gb3A6IFwiICsgRUpTT04uc3RyaW5naWZ5KG9wKSk7XG59O1xuXG5PcGxvZ0hhbmRsZSA9IGZ1bmN0aW9uIChvcGxvZ1VybCwgZGJOYW1lKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgc2VsZi5fb3Bsb2dVcmwgPSBvcGxvZ1VybDtcbiAgc2VsZi5fZGJOYW1lID0gZGJOYW1lO1xuXG4gIHNlbGYuX29wbG9nTGFzdEVudHJ5Q29ubmVjdGlvbiA9IG51bGw7XG4gIHNlbGYuX29wbG9nVGFpbENvbm5lY3Rpb24gPSBudWxsO1xuICBzZWxmLl9zdG9wcGVkID0gZmFsc2U7XG4gIHNlbGYuX3RhaWxIYW5kbGUgPSBudWxsO1xuICBzZWxmLl9yZWFkeUZ1dHVyZSA9IG5ldyBGdXR1cmUoKTtcbiAgc2VsZi5fY3Jvc3NiYXIgPSBuZXcgRERQU2VydmVyLl9Dcm9zc2Jhcih7XG4gICAgZmFjdFBhY2thZ2U6IFwibW9uZ28tbGl2ZWRhdGFcIiwgZmFjdE5hbWU6IFwib3Bsb2ctd2F0Y2hlcnNcIlxuICB9KTtcbiAgc2VsZi5fYmFzZU9wbG9nU2VsZWN0b3IgPSB7XG4gICAgbnM6IG5ldyBSZWdFeHAoXCJeKD86XCIgKyBbXG4gICAgICBNZXRlb3IuX2VzY2FwZVJlZ0V4cChzZWxmLl9kYk5hbWUgKyBcIi5cIiksXG4gICAgICBNZXRlb3IuX2VzY2FwZVJlZ0V4cChcImFkbWluLiRjbWRcIiksXG4gICAgXS5qb2luKFwifFwiKSArIFwiKVwiKSxcblxuICAgICRvcjogW1xuICAgICAgeyBvcDogeyAkaW46IFsnaScsICd1JywgJ2QnXSB9IH0sXG4gICAgICAvLyBkcm9wIGNvbGxlY3Rpb25cbiAgICAgIHsgb3A6ICdjJywgJ28uZHJvcCc6IHsgJGV4aXN0czogdHJ1ZSB9IH0sXG4gICAgICB7IG9wOiAnYycsICdvLmRyb3BEYXRhYmFzZSc6IDEgfSxcbiAgICAgIHsgb3A6ICdjJywgJ28uYXBwbHlPcHMnOiB7ICRleGlzdHM6IHRydWUgfSB9LFxuICAgIF1cbiAgfTtcblxuICAvLyBEYXRhIHN0cnVjdHVyZXMgdG8gc3VwcG9ydCB3YWl0VW50aWxDYXVnaHRVcCgpLiBFYWNoIG9wbG9nIGVudHJ5IGhhcyBhXG4gIC8vIE1vbmdvVGltZXN0YW1wIG9iamVjdCBvbiBpdCAod2hpY2ggaXMgbm90IHRoZSBzYW1lIGFzIGEgRGF0ZSAtLS0gaXQncyBhXG4gIC8vIGNvbWJpbmF0aW9uIG9mIHRpbWUgYW5kIGFuIGluY3JlbWVudGluZyBjb3VudGVyOyBzZWVcbiAgLy8gaHR0cDovL2RvY3MubW9uZ29kYi5vcmcvbWFudWFsL3JlZmVyZW5jZS9ic29uLXR5cGVzLyN0aW1lc3RhbXBzKS5cbiAgLy9cbiAgLy8gX2NhdGNoaW5nVXBGdXR1cmVzIGlzIGFuIGFycmF5IG9mIHt0czogTW9uZ29UaW1lc3RhbXAsIGZ1dHVyZTogRnV0dXJlfVxuICAvLyBvYmplY3RzLCBzb3J0ZWQgYnkgYXNjZW5kaW5nIHRpbWVzdGFtcC4gX2xhc3RQcm9jZXNzZWRUUyBpcyB0aGVcbiAgLy8gTW9uZ29UaW1lc3RhbXAgb2YgdGhlIGxhc3Qgb3Bsb2cgZW50cnkgd2UndmUgcHJvY2Vzc2VkLlxuICAvL1xuICAvLyBFYWNoIHRpbWUgd2UgY2FsbCB3YWl0VW50aWxDYXVnaHRVcCwgd2UgdGFrZSBhIHBlZWsgYXQgdGhlIGZpbmFsIG9wbG9nXG4gIC8vIGVudHJ5IGluIHRoZSBkYi4gIElmIHdlJ3ZlIGFscmVhZHkgcHJvY2Vzc2VkIGl0IChpZSwgaXQgaXMgbm90IGdyZWF0ZXIgdGhhblxuICAvLyBfbGFzdFByb2Nlc3NlZFRTKSwgd2FpdFVudGlsQ2F1Z2h0VXAgaW1tZWRpYXRlbHkgcmV0dXJucy4gT3RoZXJ3aXNlLFxuICAvLyB3YWl0VW50aWxDYXVnaHRVcCBtYWtlcyBhIG5ldyBGdXR1cmUgYW5kIGluc2VydHMgaXQgYWxvbmcgd2l0aCB0aGUgZmluYWxcbiAgLy8gdGltZXN0YW1wIGVudHJ5IHRoYXQgaXQgcmVhZCwgaW50byBfY2F0Y2hpbmdVcEZ1dHVyZXMuIHdhaXRVbnRpbENhdWdodFVwXG4gIC8vIHRoZW4gd2FpdHMgb24gdGhhdCBmdXR1cmUsIHdoaWNoIGlzIHJlc29sdmVkIG9uY2UgX2xhc3RQcm9jZXNzZWRUUyBpc1xuICAvLyBpbmNyZW1lbnRlZCB0byBiZSBwYXN0IGl0cyB0aW1lc3RhbXAgYnkgdGhlIHdvcmtlciBmaWJlci5cbiAgLy9cbiAgLy8gWFhYIHVzZSBhIHByaW9yaXR5IHF1ZXVlIG9yIHNvbWV0aGluZyBlbHNlIHRoYXQncyBmYXN0ZXIgdGhhbiBhbiBhcnJheVxuICBzZWxmLl9jYXRjaGluZ1VwRnV0dXJlcyA9IFtdO1xuICBzZWxmLl9sYXN0UHJvY2Vzc2VkVFMgPSBudWxsO1xuXG4gIHNlbGYuX29uU2tpcHBlZEVudHJpZXNIb29rID0gbmV3IEhvb2soe1xuICAgIGRlYnVnUHJpbnRFeGNlcHRpb25zOiBcIm9uU2tpcHBlZEVudHJpZXMgY2FsbGJhY2tcIlxuICB9KTtcblxuICBzZWxmLl9lbnRyeVF1ZXVlID0gbmV3IE1ldGVvci5fRG91YmxlRW5kZWRRdWV1ZSgpO1xuICBzZWxmLl93b3JrZXJBY3RpdmUgPSBmYWxzZTtcblxuICBzZWxmLl9zdGFydFRhaWxpbmcoKTtcbn07XG5cbl8uZXh0ZW5kKE9wbG9nSGFuZGxlLnByb3RvdHlwZSwge1xuICBzdG9wOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIGlmIChzZWxmLl9zdG9wcGVkKVxuICAgICAgcmV0dXJuO1xuICAgIHNlbGYuX3N0b3BwZWQgPSB0cnVlO1xuICAgIGlmIChzZWxmLl90YWlsSGFuZGxlKVxuICAgICAgc2VsZi5fdGFpbEhhbmRsZS5zdG9wKCk7XG4gICAgLy8gWFhYIHNob3VsZCBjbG9zZSBjb25uZWN0aW9ucyB0b29cbiAgfSxcbiAgb25PcGxvZ0VudHJ5OiBmdW5jdGlvbiAodHJpZ2dlciwgY2FsbGJhY2spIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgaWYgKHNlbGYuX3N0b3BwZWQpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYWxsZWQgb25PcGxvZ0VudHJ5IG9uIHN0b3BwZWQgaGFuZGxlIVwiKTtcblxuICAgIC8vIENhbGxpbmcgb25PcGxvZ0VudHJ5IHJlcXVpcmVzIHVzIHRvIHdhaXQgZm9yIHRoZSB0YWlsaW5nIHRvIGJlIHJlYWR5LlxuICAgIHNlbGYuX3JlYWR5RnV0dXJlLndhaXQoKTtcblxuICAgIHZhciBvcmlnaW5hbENhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgY2FsbGJhY2sgPSBNZXRlb3IuYmluZEVudmlyb25tZW50KGZ1bmN0aW9uIChub3RpZmljYXRpb24pIHtcbiAgICAgIG9yaWdpbmFsQ2FsbGJhY2sobm90aWZpY2F0aW9uKTtcbiAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICBNZXRlb3IuX2RlYnVnKFwiRXJyb3IgaW4gb3Bsb2cgY2FsbGJhY2tcIiwgZXJyKTtcbiAgICB9KTtcbiAgICB2YXIgbGlzdGVuSGFuZGxlID0gc2VsZi5fY3Jvc3NiYXIubGlzdGVuKHRyaWdnZXIsIGNhbGxiYWNrKTtcbiAgICByZXR1cm4ge1xuICAgICAgc3RvcDogZnVuY3Rpb24gKCkge1xuICAgICAgICBsaXN0ZW5IYW5kbGUuc3RvcCgpO1xuICAgICAgfVxuICAgIH07XG4gIH0sXG4gIC8vIFJlZ2lzdGVyIGEgY2FsbGJhY2sgdG8gYmUgaW52b2tlZCBhbnkgdGltZSB3ZSBza2lwIG9wbG9nIGVudHJpZXMgKGVnLFxuICAvLyBiZWNhdXNlIHdlIGFyZSB0b28gZmFyIGJlaGluZCkuXG4gIG9uU2tpcHBlZEVudHJpZXM6IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBpZiAoc2VsZi5fc3RvcHBlZClcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbGxlZCBvblNraXBwZWRFbnRyaWVzIG9uIHN0b3BwZWQgaGFuZGxlIVwiKTtcbiAgICByZXR1cm4gc2VsZi5fb25Ta2lwcGVkRW50cmllc0hvb2sucmVnaXN0ZXIoY2FsbGJhY2spO1xuICB9LFxuICAvLyBDYWxscyBgY2FsbGJhY2tgIG9uY2UgdGhlIG9wbG9nIGhhcyBiZWVuIHByb2Nlc3NlZCB1cCB0byBhIHBvaW50IHRoYXQgaXNcbiAgLy8gcm91Z2hseSBcIm5vd1wiOiBzcGVjaWZpY2FsbHksIG9uY2Ugd2UndmUgcHJvY2Vzc2VkIGFsbCBvcHMgdGhhdCBhcmVcbiAgLy8gY3VycmVudGx5IHZpc2libGUuXG4gIC8vIFhYWCBiZWNvbWUgY29udmluY2VkIHRoYXQgdGhpcyBpcyBhY3R1YWxseSBzYWZlIGV2ZW4gaWYgb3Bsb2dDb25uZWN0aW9uXG4gIC8vIGlzIHNvbWUga2luZCBvZiBwb29sXG4gIHdhaXRVbnRpbENhdWdodFVwOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIGlmIChzZWxmLl9zdG9wcGVkKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2FsbGVkIHdhaXRVbnRpbENhdWdodFVwIG9uIHN0b3BwZWQgaGFuZGxlIVwiKTtcblxuICAgIC8vIENhbGxpbmcgd2FpdFVudGlsQ2F1Z2h0VXAgcmVxdXJpZXMgdXMgdG8gd2FpdCBmb3IgdGhlIG9wbG9nIGNvbm5lY3Rpb24gdG9cbiAgICAvLyBiZSByZWFkeS5cbiAgICBzZWxmLl9yZWFkeUZ1dHVyZS53YWl0KCk7XG4gICAgdmFyIGxhc3RFbnRyeTtcblxuICAgIHdoaWxlICghc2VsZi5fc3RvcHBlZCkge1xuICAgICAgLy8gV2UgbmVlZCB0byBtYWtlIHRoZSBzZWxlY3RvciBhdCBsZWFzdCBhcyByZXN0cmljdGl2ZSBhcyB0aGUgYWN0dWFsXG4gICAgICAvLyB0YWlsaW5nIHNlbGVjdG9yIChpZSwgd2UgbmVlZCB0byBzcGVjaWZ5IHRoZSBEQiBuYW1lKSBvciBlbHNlIHdlIG1pZ2h0XG4gICAgICAvLyBmaW5kIGEgVFMgdGhhdCB3b24ndCBzaG93IHVwIGluIHRoZSBhY3R1YWwgdGFpbCBzdHJlYW0uXG4gICAgICB0cnkge1xuICAgICAgICBsYXN0RW50cnkgPSBzZWxmLl9vcGxvZ0xhc3RFbnRyeUNvbm5lY3Rpb24uZmluZE9uZShcbiAgICAgICAgICBPUExPR19DT0xMRUNUSU9OLCBzZWxmLl9iYXNlT3Bsb2dTZWxlY3RvcixcbiAgICAgICAgICB7ZmllbGRzOiB7dHM6IDF9LCBzb3J0OiB7JG5hdHVyYWw6IC0xfX0pO1xuICAgICAgICBicmVhaztcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gRHVyaW5nIGZhaWxvdmVyIChlZykgaWYgd2UgZ2V0IGFuIGV4Y2VwdGlvbiB3ZSBzaG91bGQgbG9nIGFuZCByZXRyeVxuICAgICAgICAvLyBpbnN0ZWFkIG9mIGNyYXNoaW5nLlxuICAgICAgICBNZXRlb3IuX2RlYnVnKFwiR290IGV4Y2VwdGlvbiB3aGlsZSByZWFkaW5nIGxhc3QgZW50cnlcIiwgZSk7XG4gICAgICAgIE1ldGVvci5fc2xlZXBGb3JNcygxMDApO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzZWxmLl9zdG9wcGVkKVxuICAgICAgcmV0dXJuO1xuXG4gICAgaWYgKCFsYXN0RW50cnkpIHtcbiAgICAgIC8vIFJlYWxseSwgbm90aGluZyBpbiB0aGUgb3Bsb2c/IFdlbGwsIHdlJ3ZlIHByb2Nlc3NlZCBldmVyeXRoaW5nLlxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciB0cyA9IGxhc3RFbnRyeS50cztcbiAgICBpZiAoIXRzKVxuICAgICAgdGhyb3cgRXJyb3IoXCJvcGxvZyBlbnRyeSB3aXRob3V0IHRzOiBcIiArIEVKU09OLnN0cmluZ2lmeShsYXN0RW50cnkpKTtcblxuICAgIGlmIChzZWxmLl9sYXN0UHJvY2Vzc2VkVFMgJiYgdHMubGVzc1RoYW5PckVxdWFsKHNlbGYuX2xhc3RQcm9jZXNzZWRUUykpIHtcbiAgICAgIC8vIFdlJ3ZlIGFscmVhZHkgY2F1Z2h0IHVwIHRvIGhlcmUuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG5cbiAgICAvLyBJbnNlcnQgdGhlIGZ1dHVyZSBpbnRvIG91ciBsaXN0LiBBbG1vc3QgYWx3YXlzLCB0aGlzIHdpbGwgYmUgYXQgdGhlIGVuZCxcbiAgICAvLyBidXQgaXQncyBjb25jZWl2YWJsZSB0aGF0IGlmIHdlIGZhaWwgb3ZlciBmcm9tIG9uZSBwcmltYXJ5IHRvIGFub3RoZXIsXG4gICAgLy8gdGhlIG9wbG9nIGVudHJpZXMgd2Ugc2VlIHdpbGwgZ28gYmFja3dhcmRzLlxuICAgIHZhciBpbnNlcnRBZnRlciA9IHNlbGYuX2NhdGNoaW5nVXBGdXR1cmVzLmxlbmd0aDtcbiAgICB3aGlsZSAoaW5zZXJ0QWZ0ZXIgLSAxID4gMCAmJiBzZWxmLl9jYXRjaGluZ1VwRnV0dXJlc1tpbnNlcnRBZnRlciAtIDFdLnRzLmdyZWF0ZXJUaGFuKHRzKSkge1xuICAgICAgaW5zZXJ0QWZ0ZXItLTtcbiAgICB9XG4gICAgdmFyIGYgPSBuZXcgRnV0dXJlO1xuICAgIHNlbGYuX2NhdGNoaW5nVXBGdXR1cmVzLnNwbGljZShpbnNlcnRBZnRlciwgMCwge3RzOiB0cywgZnV0dXJlOiBmfSk7XG4gICAgZi53YWl0KCk7XG4gIH0sXG4gIF9zdGFydFRhaWxpbmc6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgLy8gRmlyc3QsIG1ha2Ugc3VyZSB0aGF0IHdlJ3JlIHRhbGtpbmcgdG8gdGhlIGxvY2FsIGRhdGFiYXNlLlxuICAgIHZhciBtb25nb2RiVXJpID0gTnBtLnJlcXVpcmUoJ21vbmdvZGItdXJpJyk7XG4gICAgaWYgKG1vbmdvZGJVcmkucGFyc2Uoc2VsZi5fb3Bsb2dVcmwpLmRhdGFiYXNlICE9PSAnbG9jYWwnKSB7XG4gICAgICB0aHJvdyBFcnJvcihcIiRNT05HT19PUExPR19VUkwgbXVzdCBiZSBzZXQgdG8gdGhlICdsb2NhbCcgZGF0YWJhc2Ugb2YgXCIgK1xuICAgICAgICAgICAgICAgICAgXCJhIE1vbmdvIHJlcGxpY2Egc2V0XCIpO1xuICAgIH1cblxuICAgIC8vIFdlIG1ha2UgdHdvIHNlcGFyYXRlIGNvbm5lY3Rpb25zIHRvIE1vbmdvLiBUaGUgTm9kZSBNb25nbyBkcml2ZXJcbiAgICAvLyBpbXBsZW1lbnRzIGEgbmFpdmUgcm91bmQtcm9iaW4gY29ubmVjdGlvbiBwb29sOiBlYWNoIFwiY29ubmVjdGlvblwiIGlzIGFcbiAgICAvLyBwb29sIG9mIHNldmVyYWwgKDUgYnkgZGVmYXVsdCkgVENQIGNvbm5lY3Rpb25zLCBhbmQgZWFjaCByZXF1ZXN0IGlzXG4gICAgLy8gcm90YXRlZCB0aHJvdWdoIHRoZSBwb29scy4gVGFpbGFibGUgY3Vyc29yIHF1ZXJpZXMgYmxvY2sgb24gdGhlIHNlcnZlclxuICAgIC8vIHVudGlsIHRoZXJlIGlzIHNvbWUgZGF0YSB0byByZXR1cm4gKG9yIHVudGlsIGEgZmV3IHNlY29uZHMgaGF2ZVxuICAgIC8vIHBhc3NlZCkuIFNvIGlmIHRoZSBjb25uZWN0aW9uIHBvb2wgdXNlZCBmb3IgdGFpbGluZyBjdXJzb3JzIGlzIHRoZSBzYW1lXG4gICAgLy8gcG9vbCB1c2VkIGZvciBvdGhlciBxdWVyaWVzLCB0aGUgb3RoZXIgcXVlcmllcyB3aWxsIGJlIGRlbGF5ZWQgYnkgc2Vjb25kc1xuICAgIC8vIDEvNSBvZiB0aGUgdGltZS5cbiAgICAvL1xuICAgIC8vIFRoZSB0YWlsIGNvbm5lY3Rpb24gd2lsbCBvbmx5IGV2ZXIgYmUgcnVubmluZyBhIHNpbmdsZSB0YWlsIGNvbW1hbmQsIHNvXG4gICAgLy8gaXQgb25seSBuZWVkcyB0byBtYWtlIG9uZSB1bmRlcmx5aW5nIFRDUCBjb25uZWN0aW9uLlxuICAgIHNlbGYuX29wbG9nVGFpbENvbm5lY3Rpb24gPSBuZXcgTW9uZ29Db25uZWN0aW9uKFxuICAgICAgc2VsZi5fb3Bsb2dVcmwsIHtwb29sU2l6ZTogMX0pO1xuICAgIC8vIFhYWCBiZXR0ZXIgZG9jcywgYnV0OiBpdCdzIHRvIGdldCBtb25vdG9uaWMgcmVzdWx0c1xuICAgIC8vIFhYWCBpcyBpdCBzYWZlIHRvIHNheSBcImlmIHRoZXJlJ3MgYW4gaW4gZmxpZ2h0IHF1ZXJ5LCBqdXN0IHVzZSBpdHNcbiAgICAvLyAgICAgcmVzdWx0c1wiPyBJIGRvbid0IHRoaW5rIHNvIGJ1dCBzaG91bGQgY29uc2lkZXIgdGhhdFxuICAgIHNlbGYuX29wbG9nTGFzdEVudHJ5Q29ubmVjdGlvbiA9IG5ldyBNb25nb0Nvbm5lY3Rpb24oXG4gICAgICBzZWxmLl9vcGxvZ1VybCwge3Bvb2xTaXplOiAxfSk7XG5cbiAgICAvLyBOb3csIG1ha2Ugc3VyZSB0aGF0IHRoZXJlIGFjdHVhbGx5IGlzIGEgcmVwbCBzZXQgaGVyZS4gSWYgbm90LCBvcGxvZ1xuICAgIC8vIHRhaWxpbmcgd29uJ3QgZXZlciBmaW5kIGFueXRoaW5nIVxuICAgIC8vIE1vcmUgb24gdGhlIGlzTWFzdGVyRG9jXG4gICAgLy8gaHR0cHM6Ly9kb2NzLm1vbmdvZGIuY29tL21hbnVhbC9yZWZlcmVuY2UvY29tbWFuZC9pc01hc3Rlci9cbiAgICB2YXIgZiA9IG5ldyBGdXR1cmU7XG4gICAgc2VsZi5fb3Bsb2dMYXN0RW50cnlDb25uZWN0aW9uLmRiLmFkbWluKCkuY29tbWFuZChcbiAgICAgIHsgaXNtYXN0ZXI6IDEgfSwgZi5yZXNvbHZlcigpKTtcbiAgICB2YXIgaXNNYXN0ZXJEb2MgPSBmLndhaXQoKTtcblxuICAgIGlmICghKGlzTWFzdGVyRG9jICYmIGlzTWFzdGVyRG9jLnNldE5hbWUpKSB7XG4gICAgICB0aHJvdyBFcnJvcihcIiRNT05HT19PUExPR19VUkwgbXVzdCBiZSBzZXQgdG8gdGhlICdsb2NhbCcgZGF0YWJhc2Ugb2YgXCIgK1xuICAgICAgICAgICAgICAgICAgXCJhIE1vbmdvIHJlcGxpY2Egc2V0XCIpO1xuICAgIH1cblxuICAgIC8vIEZpbmQgdGhlIGxhc3Qgb3Bsb2cgZW50cnkuXG4gICAgdmFyIGxhc3RPcGxvZ0VudHJ5ID0gc2VsZi5fb3Bsb2dMYXN0RW50cnlDb25uZWN0aW9uLmZpbmRPbmUoXG4gICAgICBPUExPR19DT0xMRUNUSU9OLCB7fSwge3NvcnQ6IHskbmF0dXJhbDogLTF9LCBmaWVsZHM6IHt0czogMX19KTtcblxuICAgIHZhciBvcGxvZ1NlbGVjdG9yID0gXy5jbG9uZShzZWxmLl9iYXNlT3Bsb2dTZWxlY3Rvcik7XG4gICAgaWYgKGxhc3RPcGxvZ0VudHJ5KSB7XG4gICAgICAvLyBTdGFydCBhZnRlciB0aGUgbGFzdCBlbnRyeSB0aGF0IGN1cnJlbnRseSBleGlzdHMuXG4gICAgICBvcGxvZ1NlbGVjdG9yLnRzID0geyRndDogbGFzdE9wbG9nRW50cnkudHN9O1xuICAgICAgLy8gSWYgdGhlcmUgYXJlIGFueSBjYWxscyB0byBjYWxsV2hlblByb2Nlc3NlZExhdGVzdCBiZWZvcmUgYW55IG90aGVyXG4gICAgICAvLyBvcGxvZyBlbnRyaWVzIHNob3cgdXAsIGFsbG93IGNhbGxXaGVuUHJvY2Vzc2VkTGF0ZXN0IHRvIGNhbGwgaXRzXG4gICAgICAvLyBjYWxsYmFjayBpbW1lZGlhdGVseS5cbiAgICAgIHNlbGYuX2xhc3RQcm9jZXNzZWRUUyA9IGxhc3RPcGxvZ0VudHJ5LnRzO1xuICAgIH1cblxuICAgIHZhciBjdXJzb3JEZXNjcmlwdGlvbiA9IG5ldyBDdXJzb3JEZXNjcmlwdGlvbihcbiAgICAgIE9QTE9HX0NPTExFQ1RJT04sIG9wbG9nU2VsZWN0b3IsIHt0YWlsYWJsZTogdHJ1ZX0pO1xuXG4gICAgLy8gU3RhcnQgdGFpbGluZyB0aGUgb3Bsb2cuXG4gICAgLy9cbiAgICAvLyBXZSByZXN0YXJ0IHRoZSBsb3ctbGV2ZWwgb3Bsb2cgcXVlcnkgZXZlcnkgMzAgc2Vjb25kcyBpZiB3ZSBkaWRuJ3QgZ2V0IGFcbiAgICAvLyBkb2MuIFRoaXMgaXMgYSB3b3JrYXJvdW5kIGZvciAjODU5ODogdGhlIE5vZGUgTW9uZ28gZHJpdmVyIGhhcyBhdCBsZWFzdFxuICAgIC8vIG9uZSBidWcgdGhhdCBjYW4gbGVhZCB0byBxdWVyeSBjYWxsYmFja3MgbmV2ZXIgZ2V0dGluZyBjYWxsZWQgKGV2ZW4gd2l0aFxuICAgIC8vIGFuIGVycm9yKSB3aGVuIGxlYWRlcnNoaXAgZmFpbG92ZXIgb2NjdXIuXG4gICAgc2VsZi5fdGFpbEhhbmRsZSA9IHNlbGYuX29wbG9nVGFpbENvbm5lY3Rpb24udGFpbChcbiAgICAgIGN1cnNvckRlc2NyaXB0aW9uLFxuICAgICAgZnVuY3Rpb24gKGRvYykge1xuICAgICAgICBzZWxmLl9lbnRyeVF1ZXVlLnB1c2goZG9jKTtcbiAgICAgICAgc2VsZi5fbWF5YmVTdGFydFdvcmtlcigpO1xuICAgICAgfSxcbiAgICAgIFRBSUxfVElNRU9VVFxuICAgICk7XG4gICAgc2VsZi5fcmVhZHlGdXR1cmUucmV0dXJuKCk7XG4gIH0sXG5cbiAgX21heWJlU3RhcnRXb3JrZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgaWYgKHNlbGYuX3dvcmtlckFjdGl2ZSkgcmV0dXJuO1xuICAgIHNlbGYuX3dvcmtlckFjdGl2ZSA9IHRydWU7XG5cbiAgICBNZXRlb3IuZGVmZXIoZnVuY3Rpb24gKCkge1xuICAgICAgLy8gTWF5IGJlIGNhbGxlZCByZWN1cnNpdmVseSBpbiBjYXNlIG9mIHRyYW5zYWN0aW9ucy5cbiAgICAgIGZ1bmN0aW9uIGhhbmRsZURvYyhkb2MpIHtcbiAgICAgICAgaWYgKGRvYy5ucyA9PT0gXCJhZG1pbi4kY21kXCIpIHtcbiAgICAgICAgICBpZiAoZG9jLm8uYXBwbHlPcHMpIHtcbiAgICAgICAgICAgIC8vIFRoaXMgd2FzIGEgc3VjY2Vzc2Z1bCB0cmFuc2FjdGlvbiwgc28gd2UgbmVlZCB0byBhcHBseSB0aGVcbiAgICAgICAgICAgIC8vIG9wZXJhdGlvbnMgdGhhdCB3ZXJlIGludm9sdmVkLlxuICAgICAgICAgICAgbGV0IG5leHRUaW1lc3RhbXAgPSBkb2MudHM7XG4gICAgICAgICAgICBkb2Muby5hcHBseU9wcy5mb3JFYWNoKG9wID0+IHtcbiAgICAgICAgICAgICAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9tZXRlb3IvbWV0ZW9yL2lzc3Vlcy8xMDQyMC5cbiAgICAgICAgICAgICAgaWYgKCFvcC50cykge1xuICAgICAgICAgICAgICAgIG9wLnRzID0gbmV4dFRpbWVzdGFtcDtcbiAgICAgICAgICAgICAgICBuZXh0VGltZXN0YW1wID0gbmV4dFRpbWVzdGFtcC5hZGQoVGltZXN0YW1wLk9ORSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaGFuZGxlRG9jKG9wKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duIGNvbW1hbmQgXCIgKyBFSlNPTi5zdHJpbmdpZnkoZG9jKSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB0cmlnZ2VyID0ge1xuICAgICAgICAgIGRyb3BDb2xsZWN0aW9uOiBmYWxzZSxcbiAgICAgICAgICBkcm9wRGF0YWJhc2U6IGZhbHNlLFxuICAgICAgICAgIG9wOiBkb2MsXG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKHR5cGVvZiBkb2MubnMgPT09IFwic3RyaW5nXCIgJiZcbiAgICAgICAgICAgIGRvYy5ucy5zdGFydHNXaXRoKHNlbGYuX2RiTmFtZSArIFwiLlwiKSkge1xuICAgICAgICAgIHRyaWdnZXIuY29sbGVjdGlvbiA9IGRvYy5ucy5zbGljZShzZWxmLl9kYk5hbWUubGVuZ3RoICsgMSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJcyBpdCBhIHNwZWNpYWwgY29tbWFuZCBhbmQgdGhlIGNvbGxlY3Rpb24gbmFtZSBpcyBoaWRkZW5cbiAgICAgICAgLy8gc29tZXdoZXJlIGluIG9wZXJhdG9yP1xuICAgICAgICBpZiAodHJpZ2dlci5jb2xsZWN0aW9uID09PSBcIiRjbWRcIikge1xuICAgICAgICAgIGlmIChkb2Muby5kcm9wRGF0YWJhc2UpIHtcbiAgICAgICAgICAgIGRlbGV0ZSB0cmlnZ2VyLmNvbGxlY3Rpb247XG4gICAgICAgICAgICB0cmlnZ2VyLmRyb3BEYXRhYmFzZSA9IHRydWU7XG4gICAgICAgICAgfSBlbHNlIGlmIChfLmhhcyhkb2MubywgXCJkcm9wXCIpKSB7XG4gICAgICAgICAgICB0cmlnZ2VyLmNvbGxlY3Rpb24gPSBkb2Muby5kcm9wO1xuICAgICAgICAgICAgdHJpZ2dlci5kcm9wQ29sbGVjdGlvbiA9IHRydWU7XG4gICAgICAgICAgICB0cmlnZ2VyLmlkID0gbnVsbDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJVbmtub3duIGNvbW1hbmQgXCIgKyBFSlNPTi5zdHJpbmdpZnkoZG9jKSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gQWxsIG90aGVyIG9wcyBoYXZlIGFuIGlkLlxuICAgICAgICAgIHRyaWdnZXIuaWQgPSBpZEZvck9wKGRvYyk7XG4gICAgICAgIH1cblxuICAgICAgICBzZWxmLl9jcm9zc2Jhci5maXJlKHRyaWdnZXIpO1xuICAgICAgfVxuXG4gICAgICB0cnkge1xuICAgICAgICB3aGlsZSAoISBzZWxmLl9zdG9wcGVkICYmXG4gICAgICAgICAgICAgICAhIHNlbGYuX2VudHJ5UXVldWUuaXNFbXB0eSgpKSB7XG4gICAgICAgICAgLy8gQXJlIHdlIHRvbyBmYXIgYmVoaW5kPyBKdXN0IHRlbGwgb3VyIG9ic2VydmVycyB0aGF0IHRoZXkgbmVlZCB0b1xuICAgICAgICAgIC8vIHJlcG9sbCwgYW5kIGRyb3Agb3VyIHF1ZXVlLlxuICAgICAgICAgIGlmIChzZWxmLl9lbnRyeVF1ZXVlLmxlbmd0aCA+IFRPT19GQVJfQkVISU5EKSB7XG4gICAgICAgICAgICB2YXIgbGFzdEVudHJ5ID0gc2VsZi5fZW50cnlRdWV1ZS5wb3AoKTtcbiAgICAgICAgICAgIHNlbGYuX2VudHJ5UXVldWUuY2xlYXIoKTtcblxuICAgICAgICAgICAgc2VsZi5fb25Ta2lwcGVkRW50cmllc0hvb2suZWFjaChmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gRnJlZSBhbnkgd2FpdFVudGlsQ2F1Z2h0VXAoKSBjYWxscyB0aGF0IHdlcmUgd2FpdGluZyBmb3IgdXMgdG9cbiAgICAgICAgICAgIC8vIHBhc3Mgc29tZXRoaW5nIHRoYXQgd2UganVzdCBza2lwcGVkLlxuICAgICAgICAgICAgc2VsZi5fc2V0TGFzdFByb2Nlc3NlZFRTKGxhc3RFbnRyeS50cyk7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zdCBkb2MgPSBzZWxmLl9lbnRyeVF1ZXVlLnNoaWZ0KCk7XG5cbiAgICAgICAgICAvLyBGaXJlIHRyaWdnZXIocykgZm9yIHRoaXMgZG9jLlxuICAgICAgICAgIGhhbmRsZURvYyhkb2MpO1xuXG4gICAgICAgICAgLy8gTm93IHRoYXQgd2UndmUgcHJvY2Vzc2VkIHRoaXMgb3BlcmF0aW9uLCBwcm9jZXNzIHBlbmRpbmdcbiAgICAgICAgICAvLyBzZXF1ZW5jZXJzLlxuICAgICAgICAgIGlmIChkb2MudHMpIHtcbiAgICAgICAgICAgIHNlbGYuX3NldExhc3RQcm9jZXNzZWRUUyhkb2MudHMpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBFcnJvcihcIm9wbG9nIGVudHJ5IHdpdGhvdXQgdHM6IFwiICsgRUpTT04uc3RyaW5naWZ5KGRvYykpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgc2VsZi5fd29ya2VyQWN0aXZlID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG5cbiAgX3NldExhc3RQcm9jZXNzZWRUUzogZnVuY3Rpb24gKHRzKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHNlbGYuX2xhc3RQcm9jZXNzZWRUUyA9IHRzO1xuICAgIHdoaWxlICghXy5pc0VtcHR5KHNlbGYuX2NhdGNoaW5nVXBGdXR1cmVzKSAmJiBzZWxmLl9jYXRjaGluZ1VwRnV0dXJlc1swXS50cy5sZXNzVGhhbk9yRXF1YWwoc2VsZi5fbGFzdFByb2Nlc3NlZFRTKSkge1xuICAgICAgdmFyIHNlcXVlbmNlciA9IHNlbGYuX2NhdGNoaW5nVXBGdXR1cmVzLnNoaWZ0KCk7XG4gICAgICBzZXF1ZW5jZXIuZnV0dXJlLnJldHVybigpO1xuICAgIH1cbiAgfSxcblxuICAvL01ldGhvZHMgdXNlZCBvbiB0ZXN0cyB0byBkaW5hbWljYWxseSBjaGFuZ2UgVE9PX0ZBUl9CRUhJTkRcbiAgX2RlZmluZVRvb0ZhckJlaGluZDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICBUT09fRkFSX0JFSElORCA9IHZhbHVlO1xuICB9LFxuICBfcmVzZXRUb29GYXJCZWhpbmQ6IGZ1bmN0aW9uKCkge1xuICAgIFRPT19GQVJfQkVISU5EID0gcHJvY2Vzcy5lbnYuTUVURU9SX09QTE9HX1RPT19GQVJfQkVISU5EIHx8IDIwMDA7XG4gIH1cbn0pO1xuIiwidmFyIEZ1dHVyZSA9IE5wbS5yZXF1aXJlKCdmaWJlcnMvZnV0dXJlJyk7XG5cbk9ic2VydmVNdWx0aXBsZXhlciA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICBpZiAoIW9wdGlvbnMgfHwgIV8uaGFzKG9wdGlvbnMsICdvcmRlcmVkJykpXG4gICAgdGhyb3cgRXJyb3IoXCJtdXN0IHNwZWNpZmllZCBvcmRlcmVkXCIpO1xuXG4gIFBhY2thZ2VbJ2ZhY3RzLWJhc2UnXSAmJiBQYWNrYWdlWydmYWN0cy1iYXNlJ10uRmFjdHMuaW5jcmVtZW50U2VydmVyRmFjdChcbiAgICBcIm1vbmdvLWxpdmVkYXRhXCIsIFwib2JzZXJ2ZS1tdWx0aXBsZXhlcnNcIiwgMSk7XG5cbiAgc2VsZi5fb3JkZXJlZCA9IG9wdGlvbnMub3JkZXJlZDtcbiAgc2VsZi5fb25TdG9wID0gb3B0aW9ucy5vblN0b3AgfHwgZnVuY3Rpb24gKCkge307XG4gIHNlbGYuX3F1ZXVlID0gbmV3IE1ldGVvci5fU3luY2hyb25vdXNRdWV1ZSgpO1xuICBzZWxmLl9oYW5kbGVzID0ge307XG4gIHNlbGYuX3JlYWR5RnV0dXJlID0gbmV3IEZ1dHVyZTtcbiAgc2VsZi5fY2FjaGUgPSBuZXcgTG9jYWxDb2xsZWN0aW9uLl9DYWNoaW5nQ2hhbmdlT2JzZXJ2ZXIoe1xuICAgIG9yZGVyZWQ6IG9wdGlvbnMub3JkZXJlZH0pO1xuICAvLyBOdW1iZXIgb2YgYWRkSGFuZGxlQW5kU2VuZEluaXRpYWxBZGRzIHRhc2tzIHNjaGVkdWxlZCBidXQgbm90IHlldFxuICAvLyBydW5uaW5nLiByZW1vdmVIYW5kbGUgdXNlcyB0aGlzIHRvIGtub3cgaWYgaXQncyB0aW1lIHRvIGNhbGwgdGhlIG9uU3RvcFxuICAvLyBjYWxsYmFjay5cbiAgc2VsZi5fYWRkSGFuZGxlVGFza3NTY2hlZHVsZWRCdXROb3RQZXJmb3JtZWQgPSAwO1xuXG4gIF8uZWFjaChzZWxmLmNhbGxiYWNrTmFtZXMoKSwgZnVuY3Rpb24gKGNhbGxiYWNrTmFtZSkge1xuICAgIHNlbGZbY2FsbGJhY2tOYW1lXSA9IGZ1bmN0aW9uICgvKiAuLi4gKi8pIHtcbiAgICAgIHNlbGYuX2FwcGx5Q2FsbGJhY2soY2FsbGJhY2tOYW1lLCBfLnRvQXJyYXkoYXJndW1lbnRzKSk7XG4gICAgfTtcbiAgfSk7XG59O1xuXG5fLmV4dGVuZChPYnNlcnZlTXVsdGlwbGV4ZXIucHJvdG90eXBlLCB7XG4gIGFkZEhhbmRsZUFuZFNlbmRJbml0aWFsQWRkczogZnVuY3Rpb24gKGhhbmRsZSkge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIC8vIENoZWNrIHRoaXMgYmVmb3JlIGNhbGxpbmcgcnVuVGFzayAoZXZlbiB0aG91Z2ggcnVuVGFzayBkb2VzIHRoZSBzYW1lXG4gICAgLy8gY2hlY2spIHNvIHRoYXQgd2UgZG9uJ3QgbGVhayBhbiBPYnNlcnZlTXVsdGlwbGV4ZXIgb24gZXJyb3IgYnlcbiAgICAvLyBpbmNyZW1lbnRpbmcgX2FkZEhhbmRsZVRhc2tzU2NoZWR1bGVkQnV0Tm90UGVyZm9ybWVkIGFuZCBuZXZlclxuICAgIC8vIGRlY3JlbWVudGluZyBpdC5cbiAgICBpZiAoIXNlbGYuX3F1ZXVlLnNhZmVUb1J1blRhc2soKSlcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbid0IGNhbGwgb2JzZXJ2ZUNoYW5nZXMgZnJvbSBhbiBvYnNlcnZlIGNhbGxiYWNrIG9uIHRoZSBzYW1lIHF1ZXJ5XCIpO1xuICAgICsrc2VsZi5fYWRkSGFuZGxlVGFza3NTY2hlZHVsZWRCdXROb3RQZXJmb3JtZWQ7XG5cbiAgICBQYWNrYWdlWydmYWN0cy1iYXNlJ10gJiYgUGFja2FnZVsnZmFjdHMtYmFzZSddLkZhY3RzLmluY3JlbWVudFNlcnZlckZhY3QoXG4gICAgICBcIm1vbmdvLWxpdmVkYXRhXCIsIFwib2JzZXJ2ZS1oYW5kbGVzXCIsIDEpO1xuXG4gICAgc2VsZi5fcXVldWUucnVuVGFzayhmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLl9oYW5kbGVzW2hhbmRsZS5faWRdID0gaGFuZGxlO1xuICAgICAgLy8gU2VuZCBvdXQgd2hhdGV2ZXIgYWRkcyB3ZSBoYXZlIHNvIGZhciAod2hldGhlciBvciBub3Qgd2UgdGhlXG4gICAgICAvLyBtdWx0aXBsZXhlciBpcyByZWFkeSkuXG4gICAgICBzZWxmLl9zZW5kQWRkcyhoYW5kbGUpO1xuICAgICAgLS1zZWxmLl9hZGRIYW5kbGVUYXNrc1NjaGVkdWxlZEJ1dE5vdFBlcmZvcm1lZDtcbiAgICB9KTtcbiAgICAvLyAqb3V0c2lkZSogdGhlIHRhc2ssIHNpbmNlIG90aGVyd2lzZSB3ZSdkIGRlYWRsb2NrXG4gICAgc2VsZi5fcmVhZHlGdXR1cmUud2FpdCgpO1xuICB9LFxuXG4gIC8vIFJlbW92ZSBhbiBvYnNlcnZlIGhhbmRsZS4gSWYgaXQgd2FzIHRoZSBsYXN0IG9ic2VydmUgaGFuZGxlLCBjYWxsIHRoZVxuICAvLyBvblN0b3AgY2FsbGJhY2s7IHlvdSBjYW5ub3QgYWRkIGFueSBtb3JlIG9ic2VydmUgaGFuZGxlcyBhZnRlciB0aGlzLlxuICAvL1xuICAvLyBUaGlzIGlzIG5vdCBzeW5jaHJvbml6ZWQgd2l0aCBwb2xscyBhbmQgaGFuZGxlIGFkZGl0aW9uczogdGhpcyBtZWFucyB0aGF0XG4gIC8vIHlvdSBjYW4gc2FmZWx5IGNhbGwgaXQgZnJvbSB3aXRoaW4gYW4gb2JzZXJ2ZSBjYWxsYmFjaywgYnV0IGl0IGFsc28gbWVhbnNcbiAgLy8gdGhhdCB3ZSBoYXZlIHRvIGJlIGNhcmVmdWwgd2hlbiB3ZSBpdGVyYXRlIG92ZXIgX2hhbmRsZXMuXG4gIHJlbW92ZUhhbmRsZTogZnVuY3Rpb24gKGlkKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgLy8gVGhpcyBzaG91bGQgbm90IGJlIHBvc3NpYmxlOiB5b3UgY2FuIG9ubHkgY2FsbCByZW1vdmVIYW5kbGUgYnkgaGF2aW5nXG4gICAgLy8gYWNjZXNzIHRvIHRoZSBPYnNlcnZlSGFuZGxlLCB3aGljaCBpc24ndCByZXR1cm5lZCB0byB1c2VyIGNvZGUgdW50aWwgdGhlXG4gICAgLy8gbXVsdGlwbGV4IGlzIHJlYWR5LlxuICAgIGlmICghc2VsZi5fcmVhZHkoKSlcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbid0IHJlbW92ZSBoYW5kbGVzIHVudGlsIHRoZSBtdWx0aXBsZXggaXMgcmVhZHlcIik7XG5cbiAgICBkZWxldGUgc2VsZi5faGFuZGxlc1tpZF07XG5cbiAgICBQYWNrYWdlWydmYWN0cy1iYXNlJ10gJiYgUGFja2FnZVsnZmFjdHMtYmFzZSddLkZhY3RzLmluY3JlbWVudFNlcnZlckZhY3QoXG4gICAgICBcIm1vbmdvLWxpdmVkYXRhXCIsIFwib2JzZXJ2ZS1oYW5kbGVzXCIsIC0xKTtcblxuICAgIGlmIChfLmlzRW1wdHkoc2VsZi5faGFuZGxlcykgJiZcbiAgICAgICAgc2VsZi5fYWRkSGFuZGxlVGFza3NTY2hlZHVsZWRCdXROb3RQZXJmb3JtZWQgPT09IDApIHtcbiAgICAgIHNlbGYuX3N0b3AoKTtcbiAgICB9XG4gIH0sXG4gIF9zdG9wOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIC8vIEl0IHNob3VsZG4ndCBiZSBwb3NzaWJsZSBmb3IgdXMgdG8gc3RvcCB3aGVuIGFsbCBvdXIgaGFuZGxlcyBzdGlsbFxuICAgIC8vIGhhdmVuJ3QgYmVlbiByZXR1cm5lZCBmcm9tIG9ic2VydmVDaGFuZ2VzIVxuICAgIGlmICghIHNlbGYuX3JlYWR5KCkgJiYgISBvcHRpb25zLmZyb21RdWVyeUVycm9yKVxuICAgICAgdGhyb3cgRXJyb3IoXCJzdXJwcmlzaW5nIF9zdG9wOiBub3QgcmVhZHlcIik7XG5cbiAgICAvLyBDYWxsIHN0b3AgY2FsbGJhY2sgKHdoaWNoIGtpbGxzIHRoZSB1bmRlcmx5aW5nIHByb2Nlc3Mgd2hpY2ggc2VuZHMgdXNcbiAgICAvLyBjYWxsYmFja3MgYW5kIHJlbW92ZXMgdXMgZnJvbSB0aGUgY29ubmVjdGlvbidzIGRpY3Rpb25hcnkpLlxuICAgIHNlbGYuX29uU3RvcCgpO1xuICAgIFBhY2thZ2VbJ2ZhY3RzLWJhc2UnXSAmJiBQYWNrYWdlWydmYWN0cy1iYXNlJ10uRmFjdHMuaW5jcmVtZW50U2VydmVyRmFjdChcbiAgICAgIFwibW9uZ28tbGl2ZWRhdGFcIiwgXCJvYnNlcnZlLW11bHRpcGxleGVyc1wiLCAtMSk7XG5cbiAgICAvLyBDYXVzZSBmdXR1cmUgYWRkSGFuZGxlQW5kU2VuZEluaXRpYWxBZGRzIGNhbGxzIHRvIHRocm93IChidXQgdGhlIG9uU3RvcFxuICAgIC8vIGNhbGxiYWNrIHNob3VsZCBtYWtlIG91ciBjb25uZWN0aW9uIGZvcmdldCBhYm91dCB1cykuXG4gICAgc2VsZi5faGFuZGxlcyA9IG51bGw7XG4gIH0sXG5cbiAgLy8gQWxsb3dzIGFsbCBhZGRIYW5kbGVBbmRTZW5kSW5pdGlhbEFkZHMgY2FsbHMgdG8gcmV0dXJuLCBvbmNlIGFsbCBwcmVjZWRpbmdcbiAgLy8gYWRkcyBoYXZlIGJlZW4gcHJvY2Vzc2VkLiBEb2VzIG5vdCBibG9jay5cbiAgcmVhZHk6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgc2VsZi5fcXVldWUucXVldWVUYXNrKGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChzZWxmLl9yZWFkeSgpKVxuICAgICAgICB0aHJvdyBFcnJvcihcImNhbid0IG1ha2UgT2JzZXJ2ZU11bHRpcGxleCByZWFkeSB0d2ljZSFcIik7XG4gICAgICBzZWxmLl9yZWFkeUZ1dHVyZS5yZXR1cm4oKTtcbiAgICB9KTtcbiAgfSxcblxuICAvLyBJZiB0cnlpbmcgdG8gZXhlY3V0ZSB0aGUgcXVlcnkgcmVzdWx0cyBpbiBhbiBlcnJvciwgY2FsbCB0aGlzLiBUaGlzIGlzXG4gIC8vIGludGVuZGVkIGZvciBwZXJtYW5lbnQgZXJyb3JzLCBub3QgdHJhbnNpZW50IG5ldHdvcmsgZXJyb3JzIHRoYXQgY291bGQgYmVcbiAgLy8gZml4ZWQuIEl0IHNob3VsZCBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgcmVhZHkoKSwgYmVjYXVzZSBpZiB5b3UgY2FsbGVkIHJlYWR5XG4gIC8vIHRoYXQgbWVhbnQgdGhhdCB5b3UgbWFuYWdlZCB0byBydW4gdGhlIHF1ZXJ5IG9uY2UuIEl0IHdpbGwgc3RvcCB0aGlzXG4gIC8vIE9ic2VydmVNdWx0aXBsZXggYW5kIGNhdXNlIGFkZEhhbmRsZUFuZFNlbmRJbml0aWFsQWRkcyBjYWxscyAoYW5kIHRodXNcbiAgLy8gb2JzZXJ2ZUNoYW5nZXMgY2FsbHMpIHRvIHRocm93IHRoZSBlcnJvci5cbiAgcXVlcnlFcnJvcjogZnVuY3Rpb24gKGVycikge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBzZWxmLl9xdWV1ZS5ydW5UYXNrKGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChzZWxmLl9yZWFkeSgpKVxuICAgICAgICB0aHJvdyBFcnJvcihcImNhbid0IGNsYWltIHF1ZXJ5IGhhcyBhbiBlcnJvciBhZnRlciBpdCB3b3JrZWQhXCIpO1xuICAgICAgc2VsZi5fc3RvcCh7ZnJvbVF1ZXJ5RXJyb3I6IHRydWV9KTtcbiAgICAgIHNlbGYuX3JlYWR5RnV0dXJlLnRocm93KGVycik7XG4gICAgfSk7XG4gIH0sXG5cbiAgLy8gQ2FsbHMgXCJjYlwiIG9uY2UgdGhlIGVmZmVjdHMgb2YgYWxsIFwicmVhZHlcIiwgXCJhZGRIYW5kbGVBbmRTZW5kSW5pdGlhbEFkZHNcIlxuICAvLyBhbmQgb2JzZXJ2ZSBjYWxsYmFja3Mgd2hpY2ggY2FtZSBiZWZvcmUgdGhpcyBjYWxsIGhhdmUgYmVlbiBwcm9wYWdhdGVkIHRvXG4gIC8vIGFsbCBoYW5kbGVzLiBcInJlYWR5XCIgbXVzdCBoYXZlIGFscmVhZHkgYmVlbiBjYWxsZWQgb24gdGhpcyBtdWx0aXBsZXhlci5cbiAgb25GbHVzaDogZnVuY3Rpb24gKGNiKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHNlbGYuX3F1ZXVlLnF1ZXVlVGFzayhmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoIXNlbGYuX3JlYWR5KCkpXG4gICAgICAgIHRocm93IEVycm9yKFwib25seSBjYWxsIG9uRmx1c2ggb24gYSBtdWx0aXBsZXhlciB0aGF0IHdpbGwgYmUgcmVhZHlcIik7XG4gICAgICBjYigpO1xuICAgIH0pO1xuICB9LFxuICBjYWxsYmFja05hbWVzOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIGlmIChzZWxmLl9vcmRlcmVkKVxuICAgICAgcmV0dXJuIFtcImFkZGVkQmVmb3JlXCIsIFwiY2hhbmdlZFwiLCBcIm1vdmVkQmVmb3JlXCIsIFwicmVtb3ZlZFwiXTtcbiAgICBlbHNlXG4gICAgICByZXR1cm4gW1wiYWRkZWRcIiwgXCJjaGFuZ2VkXCIsIFwicmVtb3ZlZFwiXTtcbiAgfSxcbiAgX3JlYWR5OiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3JlYWR5RnV0dXJlLmlzUmVzb2x2ZWQoKTtcbiAgfSxcbiAgX2FwcGx5Q2FsbGJhY2s6IGZ1bmN0aW9uIChjYWxsYmFja05hbWUsIGFyZ3MpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgc2VsZi5fcXVldWUucXVldWVUYXNrKGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIElmIHdlIHN0b3BwZWQgaW4gdGhlIG1lYW50aW1lLCBkbyBub3RoaW5nLlxuICAgICAgaWYgKCFzZWxmLl9oYW5kbGVzKVxuICAgICAgICByZXR1cm47XG5cbiAgICAgIC8vIEZpcnN0LCBhcHBseSB0aGUgY2hhbmdlIHRvIHRoZSBjYWNoZS5cbiAgICAgIC8vIFhYWCBXZSBjb3VsZCBtYWtlIGFwcGx5Q2hhbmdlIGNhbGxiYWNrcyBwcm9taXNlIG5vdCB0byBoYW5nIG9uIHRvIGFueVxuICAgICAgLy8gc3RhdGUgZnJvbSB0aGVpciBhcmd1bWVudHMgKGFzc3VtaW5nIHRoYXQgdGhlaXIgc3VwcGxpZWQgY2FsbGJhY2tzXG4gICAgICAvLyBkb24ndCkgYW5kIHNraXAgdGhpcyBjbG9uZS4gQ3VycmVudGx5ICdjaGFuZ2VkJyBoYW5ncyBvbiB0byBzdGF0ZVxuICAgICAgLy8gdGhvdWdoLlxuICAgICAgc2VsZi5fY2FjaGUuYXBwbHlDaGFuZ2VbY2FsbGJhY2tOYW1lXS5hcHBseShudWxsLCBFSlNPTi5jbG9uZShhcmdzKSk7XG5cbiAgICAgIC8vIElmIHdlIGhhdmVuJ3QgZmluaXNoZWQgdGhlIGluaXRpYWwgYWRkcywgdGhlbiB3ZSBzaG91bGQgb25seSBiZSBnZXR0aW5nXG4gICAgICAvLyBhZGRzLlxuICAgICAgaWYgKCFzZWxmLl9yZWFkeSgpICYmXG4gICAgICAgICAgKGNhbGxiYWNrTmFtZSAhPT0gJ2FkZGVkJyAmJiBjYWxsYmFja05hbWUgIT09ICdhZGRlZEJlZm9yZScpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkdvdCBcIiArIGNhbGxiYWNrTmFtZSArIFwiIGR1cmluZyBpbml0aWFsIGFkZHNcIik7XG4gICAgICB9XG5cbiAgICAgIC8vIE5vdyBtdWx0aXBsZXggdGhlIGNhbGxiYWNrcyBvdXQgdG8gYWxsIG9ic2VydmUgaGFuZGxlcy4gSXQncyBPSyBpZlxuICAgICAgLy8gdGhlc2UgY2FsbHMgeWllbGQ7IHNpbmNlIHdlJ3JlIGluc2lkZSBhIHRhc2ssIG5vIG90aGVyIHVzZSBvZiBvdXIgcXVldWVcbiAgICAgIC8vIGNhbiBjb250aW51ZSB1bnRpbCB0aGVzZSBhcmUgZG9uZS4gKEJ1dCB3ZSBkbyBoYXZlIHRvIGJlIGNhcmVmdWwgdG8gbm90XG4gICAgICAvLyB1c2UgYSBoYW5kbGUgdGhhdCBnb3QgcmVtb3ZlZCwgYmVjYXVzZSByZW1vdmVIYW5kbGUgZG9lcyBub3QgdXNlIHRoZVxuICAgICAgLy8gcXVldWU7IHRodXMsIHdlIGl0ZXJhdGUgb3ZlciBhbiBhcnJheSBvZiBrZXlzIHRoYXQgd2UgY29udHJvbC4pXG4gICAgICBfLmVhY2goXy5rZXlzKHNlbGYuX2hhbmRsZXMpLCBmdW5jdGlvbiAoaGFuZGxlSWQpIHtcbiAgICAgICAgdmFyIGhhbmRsZSA9IHNlbGYuX2hhbmRsZXMgJiYgc2VsZi5faGFuZGxlc1toYW5kbGVJZF07XG4gICAgICAgIGlmICghaGFuZGxlKVxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgdmFyIGNhbGxiYWNrID0gaGFuZGxlWydfJyArIGNhbGxiYWNrTmFtZV07XG4gICAgICAgIC8vIGNsb25lIGFyZ3VtZW50cyBzbyB0aGF0IGNhbGxiYWNrcyBjYW4gbXV0YXRlIHRoZWlyIGFyZ3VtZW50c1xuICAgICAgICBjYWxsYmFjayAmJiBjYWxsYmFjay5hcHBseShudWxsLCBFSlNPTi5jbG9uZShhcmdzKSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSxcblxuICAvLyBTZW5kcyBpbml0aWFsIGFkZHMgdG8gYSBoYW5kbGUuIEl0IHNob3VsZCBvbmx5IGJlIGNhbGxlZCBmcm9tIHdpdGhpbiBhIHRhc2tcbiAgLy8gKHRoZSB0YXNrIHRoYXQgaXMgcHJvY2Vzc2luZyB0aGUgYWRkSGFuZGxlQW5kU2VuZEluaXRpYWxBZGRzIGNhbGwpLiBJdFxuICAvLyBzeW5jaHJvbm91c2x5IGludm9rZXMgdGhlIGhhbmRsZSdzIGFkZGVkIG9yIGFkZGVkQmVmb3JlOyB0aGVyZSdzIG5vIG5lZWQgdG9cbiAgLy8gZmx1c2ggdGhlIHF1ZXVlIGFmdGVyd2FyZHMgdG8gZW5zdXJlIHRoYXQgdGhlIGNhbGxiYWNrcyBnZXQgb3V0LlxuICBfc2VuZEFkZHM6IGZ1bmN0aW9uIChoYW5kbGUpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgaWYgKHNlbGYuX3F1ZXVlLnNhZmVUb1J1blRhc2soKSlcbiAgICAgIHRocm93IEVycm9yKFwiX3NlbmRBZGRzIG1heSBvbmx5IGJlIGNhbGxlZCBmcm9tIHdpdGhpbiBhIHRhc2shXCIpO1xuICAgIHZhciBhZGQgPSBzZWxmLl9vcmRlcmVkID8gaGFuZGxlLl9hZGRlZEJlZm9yZSA6IGhhbmRsZS5fYWRkZWQ7XG4gICAgaWYgKCFhZGQpXG4gICAgICByZXR1cm47XG4gICAgLy8gbm90ZTogZG9jcyBtYXkgYmUgYW4gX0lkTWFwIG9yIGFuIE9yZGVyZWREaWN0XG4gICAgc2VsZi5fY2FjaGUuZG9jcy5mb3JFYWNoKGZ1bmN0aW9uIChkb2MsIGlkKSB7XG4gICAgICBpZiAoIV8uaGFzKHNlbGYuX2hhbmRsZXMsIGhhbmRsZS5faWQpKVxuICAgICAgICB0aHJvdyBFcnJvcihcImhhbmRsZSBnb3QgcmVtb3ZlZCBiZWZvcmUgc2VuZGluZyBpbml0aWFsIGFkZHMhXCIpO1xuICAgICAgdmFyIGZpZWxkcyA9IEVKU09OLmNsb25lKGRvYyk7XG4gICAgICBkZWxldGUgZmllbGRzLl9pZDtcbiAgICAgIGlmIChzZWxmLl9vcmRlcmVkKVxuICAgICAgICBhZGQoaWQsIGZpZWxkcywgbnVsbCk7IC8vIHdlJ3JlIGdvaW5nIGluIG9yZGVyLCBzbyBhZGQgYXQgZW5kXG4gICAgICBlbHNlXG4gICAgICAgIGFkZChpZCwgZmllbGRzKTtcbiAgICB9KTtcbiAgfVxufSk7XG5cblxudmFyIG5leHRPYnNlcnZlSGFuZGxlSWQgPSAxO1xuT2JzZXJ2ZUhhbmRsZSA9IGZ1bmN0aW9uIChtdWx0aXBsZXhlciwgY2FsbGJhY2tzKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgLy8gVGhlIGVuZCB1c2VyIGlzIG9ubHkgc3VwcG9zZWQgdG8gY2FsbCBzdG9wKCkuICBUaGUgb3RoZXIgZmllbGRzIGFyZVxuICAvLyBhY2Nlc3NpYmxlIHRvIHRoZSBtdWx0aXBsZXhlciwgdGhvdWdoLlxuICBzZWxmLl9tdWx0aXBsZXhlciA9IG11bHRpcGxleGVyO1xuICBfLmVhY2gobXVsdGlwbGV4ZXIuY2FsbGJhY2tOYW1lcygpLCBmdW5jdGlvbiAobmFtZSkge1xuICAgIGlmIChjYWxsYmFja3NbbmFtZV0pIHtcbiAgICAgIHNlbGZbJ18nICsgbmFtZV0gPSBjYWxsYmFja3NbbmFtZV07XG4gICAgfSBlbHNlIGlmIChuYW1lID09PSBcImFkZGVkQmVmb3JlXCIgJiYgY2FsbGJhY2tzLmFkZGVkKSB7XG4gICAgICAvLyBTcGVjaWFsIGNhc2U6IGlmIHlvdSBzcGVjaWZ5IFwiYWRkZWRcIiBhbmQgXCJtb3ZlZEJlZm9yZVwiLCB5b3UgZ2V0IGFuXG4gICAgICAvLyBvcmRlcmVkIG9ic2VydmUgd2hlcmUgZm9yIHNvbWUgcmVhc29uIHlvdSBkb24ndCBnZXQgb3JkZXJpbmcgZGF0YSBvblxuICAgICAgLy8gdGhlIGFkZHMuICBJIGR1bm5vLCB3ZSB3cm90ZSB0ZXN0cyBmb3IgaXQsIHRoZXJlIG11c3QgaGF2ZSBiZWVuIGFcbiAgICAgIC8vIHJlYXNvbi5cbiAgICAgIHNlbGYuX2FkZGVkQmVmb3JlID0gZnVuY3Rpb24gKGlkLCBmaWVsZHMsIGJlZm9yZSkge1xuICAgICAgICBjYWxsYmFja3MuYWRkZWQoaWQsIGZpZWxkcyk7XG4gICAgICB9O1xuICAgIH1cbiAgfSk7XG4gIHNlbGYuX3N0b3BwZWQgPSBmYWxzZTtcbiAgc2VsZi5faWQgPSBuZXh0T2JzZXJ2ZUhhbmRsZUlkKys7XG59O1xuT2JzZXJ2ZUhhbmRsZS5wcm90b3R5cGUuc3RvcCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBpZiAoc2VsZi5fc3RvcHBlZClcbiAgICByZXR1cm47XG4gIHNlbGYuX3N0b3BwZWQgPSB0cnVlO1xuICBzZWxmLl9tdWx0aXBsZXhlci5yZW1vdmVIYW5kbGUoc2VsZi5faWQpO1xufTtcbiIsInZhciBGaWJlciA9IE5wbS5yZXF1aXJlKCdmaWJlcnMnKTtcblxuZXhwb3J0IGNsYXNzIERvY0ZldGNoZXIge1xuICBjb25zdHJ1Y3Rvcihtb25nb0Nvbm5lY3Rpb24pIHtcbiAgICB0aGlzLl9tb25nb0Nvbm5lY3Rpb24gPSBtb25nb0Nvbm5lY3Rpb247XG4gICAgLy8gTWFwIGZyb20gb3AgLT4gW2NhbGxiYWNrXVxuICAgIHRoaXMuX2NhbGxiYWNrc0Zvck9wID0gbmV3IE1hcDtcbiAgfVxuXG4gIC8vIEZldGNoZXMgZG9jdW1lbnQgXCJpZFwiIGZyb20gY29sbGVjdGlvbk5hbWUsIHJldHVybmluZyBpdCBvciBudWxsIGlmIG5vdFxuICAvLyBmb3VuZC5cbiAgLy9cbiAgLy8gSWYgeW91IG1ha2UgbXVsdGlwbGUgY2FsbHMgdG8gZmV0Y2goKSB3aXRoIHRoZSBzYW1lIG9wIHJlZmVyZW5jZSxcbiAgLy8gRG9jRmV0Y2hlciBtYXkgYXNzdW1lIHRoYXQgdGhleSBhbGwgcmV0dXJuIHRoZSBzYW1lIGRvY3VtZW50LiAoSXQgZG9lc1xuICAvLyBub3QgY2hlY2sgdG8gc2VlIGlmIGNvbGxlY3Rpb25OYW1lL2lkIG1hdGNoLilcbiAgLy9cbiAgLy8gWW91IG1heSBhc3N1bWUgdGhhdCBjYWxsYmFjayBpcyBuZXZlciBjYWxsZWQgc3luY2hyb25vdXNseSAoYW5kIGluIGZhY3RcbiAgLy8gT3Bsb2dPYnNlcnZlRHJpdmVyIGRvZXMgc28pLlxuICBmZXRjaChjb2xsZWN0aW9uTmFtZSwgaWQsIG9wLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgY2hlY2soY29sbGVjdGlvbk5hbWUsIFN0cmluZyk7XG4gICAgY2hlY2sob3AsIE9iamVjdCk7XG5cbiAgICAvLyBJZiB0aGVyZSdzIGFscmVhZHkgYW4gaW4tcHJvZ3Jlc3MgZmV0Y2ggZm9yIHRoaXMgY2FjaGUga2V5LCB5aWVsZCB1bnRpbFxuICAgIC8vIGl0J3MgZG9uZSBhbmQgcmV0dXJuIHdoYXRldmVyIGl0IHJldHVybnMuXG4gICAgaWYgKHNlbGYuX2NhbGxiYWNrc0Zvck9wLmhhcyhvcCkpIHtcbiAgICAgIHNlbGYuX2NhbGxiYWNrc0Zvck9wLmdldChvcCkucHVzaChjYWxsYmFjayk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgY2FsbGJhY2tzID0gW2NhbGxiYWNrXTtcbiAgICBzZWxmLl9jYWxsYmFja3NGb3JPcC5zZXQob3AsIGNhbGxiYWNrcyk7XG5cbiAgICBGaWJlcihmdW5jdGlvbiAoKSB7XG4gICAgICB0cnkge1xuICAgICAgICB2YXIgZG9jID0gc2VsZi5fbW9uZ29Db25uZWN0aW9uLmZpbmRPbmUoXG4gICAgICAgICAgY29sbGVjdGlvbk5hbWUsIHtfaWQ6IGlkfSkgfHwgbnVsbDtcbiAgICAgICAgLy8gUmV0dXJuIGRvYyB0byBhbGwgcmVsZXZhbnQgY2FsbGJhY2tzLiBOb3RlIHRoYXQgdGhpcyBhcnJheSBjYW5cbiAgICAgICAgLy8gY29udGludWUgdG8gZ3JvdyBkdXJpbmcgY2FsbGJhY2sgZXhjZWN1dGlvbi5cbiAgICAgICAgd2hpbGUgKGNhbGxiYWNrcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgLy8gQ2xvbmUgdGhlIGRvY3VtZW50IHNvIHRoYXQgdGhlIHZhcmlvdXMgY2FsbHMgdG8gZmV0Y2ggZG9uJ3QgcmV0dXJuXG4gICAgICAgICAgLy8gb2JqZWN0cyB0aGF0IGFyZSBpbnRlcnR3aW5nbGVkIHdpdGggZWFjaCBvdGhlci4gQ2xvbmUgYmVmb3JlXG4gICAgICAgICAgLy8gcG9wcGluZyB0aGUgZnV0dXJlLCBzbyB0aGF0IGlmIGNsb25lIHRocm93cywgdGhlIGVycm9yIGdldHMgcGFzc2VkXG4gICAgICAgICAgLy8gdG8gdGhlIG5leHQgY2FsbGJhY2suXG4gICAgICAgICAgY2FsbGJhY2tzLnBvcCgpKG51bGwsIEVKU09OLmNsb25lKGRvYykpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHdoaWxlIChjYWxsYmFja3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGNhbGxiYWNrcy5wb3AoKShlKTtcbiAgICAgICAgfVxuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgLy8gWFhYIGNvbnNpZGVyIGtlZXBpbmcgdGhlIGRvYyBhcm91bmQgZm9yIGEgcGVyaW9kIG9mIHRpbWUgYmVmb3JlXG4gICAgICAgIC8vIHJlbW92aW5nIGZyb20gdGhlIGNhY2hlXG4gICAgICAgIHNlbGYuX2NhbGxiYWNrc0Zvck9wLmRlbGV0ZShvcCk7XG4gICAgICB9XG4gICAgfSkucnVuKCk7XG4gIH1cbn1cbiIsInZhciBQT0xMSU5HX1RIUk9UVExFX01TID0gK3Byb2Nlc3MuZW52Lk1FVEVPUl9QT0xMSU5HX1RIUk9UVExFX01TIHx8IDUwO1xudmFyIFBPTExJTkdfSU5URVJWQUxfTVMgPSArcHJvY2Vzcy5lbnYuTUVURU9SX1BPTExJTkdfSU5URVJWQUxfTVMgfHwgMTAgKiAxMDAwO1xuXG5Qb2xsaW5nT2JzZXJ2ZURyaXZlciA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICBzZWxmLl9jdXJzb3JEZXNjcmlwdGlvbiA9IG9wdGlvbnMuY3Vyc29yRGVzY3JpcHRpb247XG4gIHNlbGYuX21vbmdvSGFuZGxlID0gb3B0aW9ucy5tb25nb0hhbmRsZTtcbiAgc2VsZi5fb3JkZXJlZCA9IG9wdGlvbnMub3JkZXJlZDtcbiAgc2VsZi5fbXVsdGlwbGV4ZXIgPSBvcHRpb25zLm11bHRpcGxleGVyO1xuICBzZWxmLl9zdG9wQ2FsbGJhY2tzID0gW107XG4gIHNlbGYuX3N0b3BwZWQgPSBmYWxzZTtcblxuICBzZWxmLl9zeW5jaHJvbm91c0N1cnNvciA9IHNlbGYuX21vbmdvSGFuZGxlLl9jcmVhdGVTeW5jaHJvbm91c0N1cnNvcihcbiAgICBzZWxmLl9jdXJzb3JEZXNjcmlwdGlvbik7XG5cbiAgLy8gcHJldmlvdXMgcmVzdWx0cyBzbmFwc2hvdC4gIG9uIGVhY2ggcG9sbCBjeWNsZSwgZGlmZnMgYWdhaW5zdFxuICAvLyByZXN1bHRzIGRyaXZlcyB0aGUgY2FsbGJhY2tzLlxuICBzZWxmLl9yZXN1bHRzID0gbnVsbDtcblxuICAvLyBUaGUgbnVtYmVyIG9mIF9wb2xsTW9uZ28gY2FsbHMgdGhhdCBoYXZlIGJlZW4gYWRkZWQgdG8gc2VsZi5fdGFza1F1ZXVlIGJ1dFxuICAvLyBoYXZlIG5vdCBzdGFydGVkIHJ1bm5pbmcuIFVzZWQgdG8gbWFrZSBzdXJlIHdlIG5ldmVyIHNjaGVkdWxlIG1vcmUgdGhhbiBvbmVcbiAgLy8gX3BvbGxNb25nbyAob3RoZXIgdGhhbiBwb3NzaWJseSB0aGUgb25lIHRoYXQgaXMgY3VycmVudGx5IHJ1bm5pbmcpLiBJdCdzXG4gIC8vIGFsc28gdXNlZCBieSBfc3VzcGVuZFBvbGxpbmcgdG8gcHJldGVuZCB0aGVyZSdzIGEgcG9sbCBzY2hlZHVsZWQuIFVzdWFsbHksXG4gIC8vIGl0J3MgZWl0aGVyIDAgKGZvciBcIm5vIHBvbGxzIHNjaGVkdWxlZCBvdGhlciB0aGFuIG1heWJlIG9uZSBjdXJyZW50bHlcbiAgLy8gcnVubmluZ1wiKSBvciAxIChmb3IgXCJhIHBvbGwgc2NoZWR1bGVkIHRoYXQgaXNuJ3QgcnVubmluZyB5ZXRcIiksIGJ1dCBpdCBjYW5cbiAgLy8gYWxzbyBiZSAyIGlmIGluY3JlbWVudGVkIGJ5IF9zdXNwZW5kUG9sbGluZy5cbiAgc2VsZi5fcG9sbHNTY2hlZHVsZWRCdXROb3RTdGFydGVkID0gMDtcbiAgc2VsZi5fcGVuZGluZ1dyaXRlcyA9IFtdOyAvLyBwZW9wbGUgdG8gbm90aWZ5IHdoZW4gcG9sbGluZyBjb21wbGV0ZXNcblxuICAvLyBNYWtlIHN1cmUgdG8gY3JlYXRlIGEgc2VwYXJhdGVseSB0aHJvdHRsZWQgZnVuY3Rpb24gZm9yIGVhY2hcbiAgLy8gUG9sbGluZ09ic2VydmVEcml2ZXIgb2JqZWN0LlxuICBzZWxmLl9lbnN1cmVQb2xsSXNTY2hlZHVsZWQgPSBfLnRocm90dGxlKFxuICAgIHNlbGYuX3VudGhyb3R0bGVkRW5zdXJlUG9sbElzU2NoZWR1bGVkLFxuICAgIHNlbGYuX2N1cnNvckRlc2NyaXB0aW9uLm9wdGlvbnMucG9sbGluZ1Rocm90dGxlTXMgfHwgUE9MTElOR19USFJPVFRMRV9NUyAvKiBtcyAqLyk7XG5cbiAgLy8gWFhYIGZpZ3VyZSBvdXQgaWYgd2Ugc3RpbGwgbmVlZCBhIHF1ZXVlXG4gIHNlbGYuX3Rhc2tRdWV1ZSA9IG5ldyBNZXRlb3IuX1N5bmNocm9ub3VzUXVldWUoKTtcblxuICB2YXIgbGlzdGVuZXJzSGFuZGxlID0gbGlzdGVuQWxsKFxuICAgIHNlbGYuX2N1cnNvckRlc2NyaXB0aW9uLCBmdW5jdGlvbiAobm90aWZpY2F0aW9uKSB7XG4gICAgICAvLyBXaGVuIHNvbWVvbmUgZG9lcyBhIHRyYW5zYWN0aW9uIHRoYXQgbWlnaHQgYWZmZWN0IHVzLCBzY2hlZHVsZSBhIHBvbGxcbiAgICAgIC8vIG9mIHRoZSBkYXRhYmFzZS4gSWYgdGhhdCB0cmFuc2FjdGlvbiBoYXBwZW5zIGluc2lkZSBvZiBhIHdyaXRlIGZlbmNlLFxuICAgICAgLy8gYmxvY2sgdGhlIGZlbmNlIHVudGlsIHdlJ3ZlIHBvbGxlZCBhbmQgbm90aWZpZWQgb2JzZXJ2ZXJzLlxuICAgICAgdmFyIGZlbmNlID0gRERQU2VydmVyLl9DdXJyZW50V3JpdGVGZW5jZS5nZXQoKTtcbiAgICAgIGlmIChmZW5jZSlcbiAgICAgICAgc2VsZi5fcGVuZGluZ1dyaXRlcy5wdXNoKGZlbmNlLmJlZ2luV3JpdGUoKSk7XG4gICAgICAvLyBFbnN1cmUgYSBwb2xsIGlzIHNjaGVkdWxlZC4uLiBidXQgaWYgd2UgYWxyZWFkeSBrbm93IHRoYXQgb25lIGlzLFxuICAgICAgLy8gZG9uJ3QgaGl0IHRoZSB0aHJvdHRsZWQgX2Vuc3VyZVBvbGxJc1NjaGVkdWxlZCBmdW5jdGlvbiAod2hpY2ggbWlnaHRcbiAgICAgIC8vIGxlYWQgdG8gdXMgY2FsbGluZyBpdCB1bm5lY2Vzc2FyaWx5IGluIDxwb2xsaW5nVGhyb3R0bGVNcz4gbXMpLlxuICAgICAgaWYgKHNlbGYuX3BvbGxzU2NoZWR1bGVkQnV0Tm90U3RhcnRlZCA9PT0gMClcbiAgICAgICAgc2VsZi5fZW5zdXJlUG9sbElzU2NoZWR1bGVkKCk7XG4gICAgfVxuICApO1xuICBzZWxmLl9zdG9wQ2FsbGJhY2tzLnB1c2goZnVuY3Rpb24gKCkgeyBsaXN0ZW5lcnNIYW5kbGUuc3RvcCgpOyB9KTtcblxuICAvLyBldmVyeSBvbmNlIGFuZCBhIHdoaWxlLCBwb2xsIGV2ZW4gaWYgd2UgZG9uJ3QgdGhpbmsgd2UncmUgZGlydHksIGZvclxuICAvLyBldmVudHVhbCBjb25zaXN0ZW5jeSB3aXRoIGRhdGFiYXNlIHdyaXRlcyBmcm9tIG91dHNpZGUgdGhlIE1ldGVvclxuICAvLyB1bml2ZXJzZS5cbiAgLy9cbiAgLy8gRm9yIHRlc3RpbmcsIHRoZXJlJ3MgYW4gdW5kb2N1bWVudGVkIGNhbGxiYWNrIGFyZ3VtZW50IHRvIG9ic2VydmVDaGFuZ2VzXG4gIC8vIHdoaWNoIGRpc2FibGVzIHRpbWUtYmFzZWQgcG9sbGluZyBhbmQgZ2V0cyBjYWxsZWQgYXQgdGhlIGJlZ2lubmluZyBvZiBlYWNoXG4gIC8vIHBvbGwuXG4gIGlmIChvcHRpb25zLl90ZXN0T25seVBvbGxDYWxsYmFjaykge1xuICAgIHNlbGYuX3Rlc3RPbmx5UG9sbENhbGxiYWNrID0gb3B0aW9ucy5fdGVzdE9ubHlQb2xsQ2FsbGJhY2s7XG4gIH0gZWxzZSB7XG4gICAgdmFyIHBvbGxpbmdJbnRlcnZhbCA9XG4gICAgICAgICAgc2VsZi5fY3Vyc29yRGVzY3JpcHRpb24ub3B0aW9ucy5wb2xsaW5nSW50ZXJ2YWxNcyB8fFxuICAgICAgICAgIHNlbGYuX2N1cnNvckRlc2NyaXB0aW9uLm9wdGlvbnMuX3BvbGxpbmdJbnRlcnZhbCB8fCAvLyBDT01QQVQgd2l0aCAxLjJcbiAgICAgICAgICBQT0xMSU5HX0lOVEVSVkFMX01TO1xuICAgIHZhciBpbnRlcnZhbEhhbmRsZSA9IE1ldGVvci5zZXRJbnRlcnZhbChcbiAgICAgIF8uYmluZChzZWxmLl9lbnN1cmVQb2xsSXNTY2hlZHVsZWQsIHNlbGYpLCBwb2xsaW5nSW50ZXJ2YWwpO1xuICAgIHNlbGYuX3N0b3BDYWxsYmFja3MucHVzaChmdW5jdGlvbiAoKSB7XG4gICAgICBNZXRlb3IuY2xlYXJJbnRlcnZhbChpbnRlcnZhbEhhbmRsZSk7XG4gICAgfSk7XG4gIH1cblxuICAvLyBNYWtlIHN1cmUgd2UgYWN0dWFsbHkgcG9sbCBzb29uIVxuICBzZWxmLl91bnRocm90dGxlZEVuc3VyZVBvbGxJc1NjaGVkdWxlZCgpO1xuXG4gIFBhY2thZ2VbJ2ZhY3RzLWJhc2UnXSAmJiBQYWNrYWdlWydmYWN0cy1iYXNlJ10uRmFjdHMuaW5jcmVtZW50U2VydmVyRmFjdChcbiAgICBcIm1vbmdvLWxpdmVkYXRhXCIsIFwib2JzZXJ2ZS1kcml2ZXJzLXBvbGxpbmdcIiwgMSk7XG59O1xuXG5fLmV4dGVuZChQb2xsaW5nT2JzZXJ2ZURyaXZlci5wcm90b3R5cGUsIHtcbiAgLy8gVGhpcyBpcyBhbHdheXMgY2FsbGVkIHRocm91Z2ggXy50aHJvdHRsZSAoZXhjZXB0IG9uY2UgYXQgc3RhcnR1cCkuXG4gIF91bnRocm90dGxlZEVuc3VyZVBvbGxJc1NjaGVkdWxlZDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBpZiAoc2VsZi5fcG9sbHNTY2hlZHVsZWRCdXROb3RTdGFydGVkID4gMClcbiAgICAgIHJldHVybjtcbiAgICArK3NlbGYuX3BvbGxzU2NoZWR1bGVkQnV0Tm90U3RhcnRlZDtcbiAgICBzZWxmLl90YXNrUXVldWUucXVldWVUYXNrKGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYuX3BvbGxNb25nbygpO1xuICAgIH0pO1xuICB9LFxuXG4gIC8vIHRlc3Qtb25seSBpbnRlcmZhY2UgZm9yIGNvbnRyb2xsaW5nIHBvbGxpbmcuXG4gIC8vXG4gIC8vIF9zdXNwZW5kUG9sbGluZyBibG9ja3MgdW50aWwgYW55IGN1cnJlbnRseSBydW5uaW5nIGFuZCBzY2hlZHVsZWQgcG9sbHMgYXJlXG4gIC8vIGRvbmUsIGFuZCBwcmV2ZW50cyBhbnkgZnVydGhlciBwb2xscyBmcm9tIGJlaW5nIHNjaGVkdWxlZC4gKG5ld1xuICAvLyBPYnNlcnZlSGFuZGxlcyBjYW4gYmUgYWRkZWQgYW5kIHJlY2VpdmUgdGhlaXIgaW5pdGlhbCBhZGRlZCBjYWxsYmFja3MsXG4gIC8vIHRob3VnaC4pXG4gIC8vXG4gIC8vIF9yZXN1bWVQb2xsaW5nIGltbWVkaWF0ZWx5IHBvbGxzLCBhbmQgYWxsb3dzIGZ1cnRoZXIgcG9sbHMgdG8gb2NjdXIuXG4gIF9zdXNwZW5kUG9sbGluZzogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIC8vIFByZXRlbmQgdGhhdCB0aGVyZSdzIGFub3RoZXIgcG9sbCBzY2hlZHVsZWQgKHdoaWNoIHdpbGwgcHJldmVudFxuICAgIC8vIF9lbnN1cmVQb2xsSXNTY2hlZHVsZWQgZnJvbSBxdWV1ZWluZyBhbnkgbW9yZSBwb2xscykuXG4gICAgKytzZWxmLl9wb2xsc1NjaGVkdWxlZEJ1dE5vdFN0YXJ0ZWQ7XG4gICAgLy8gTm93IGJsb2NrIHVudGlsIGFsbCBjdXJyZW50bHkgcnVubmluZyBvciBzY2hlZHVsZWQgcG9sbHMgYXJlIGRvbmUuXG4gICAgc2VsZi5fdGFza1F1ZXVlLnJ1blRhc2soZnVuY3Rpb24oKSB7fSk7XG5cbiAgICAvLyBDb25maXJtIHRoYXQgdGhlcmUgaXMgb25seSBvbmUgXCJwb2xsXCIgKHRoZSBmYWtlIG9uZSB3ZSdyZSBwcmV0ZW5kaW5nIHRvXG4gICAgLy8gaGF2ZSkgc2NoZWR1bGVkLlxuICAgIGlmIChzZWxmLl9wb2xsc1NjaGVkdWxlZEJ1dE5vdFN0YXJ0ZWQgIT09IDEpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJfcG9sbHNTY2hlZHVsZWRCdXROb3RTdGFydGVkIGlzIFwiICtcbiAgICAgICAgICAgICAgICAgICAgICBzZWxmLl9wb2xsc1NjaGVkdWxlZEJ1dE5vdFN0YXJ0ZWQpO1xuICB9LFxuICBfcmVzdW1lUG9sbGluZzogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIC8vIFdlIHNob3VsZCBiZSBpbiB0aGUgc2FtZSBzdGF0ZSBhcyBpbiB0aGUgZW5kIG9mIF9zdXNwZW5kUG9sbGluZy5cbiAgICBpZiAoc2VsZi5fcG9sbHNTY2hlZHVsZWRCdXROb3RTdGFydGVkICE9PSAxKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiX3BvbGxzU2NoZWR1bGVkQnV0Tm90U3RhcnRlZCBpcyBcIiArXG4gICAgICAgICAgICAgICAgICAgICAgc2VsZi5fcG9sbHNTY2hlZHVsZWRCdXROb3RTdGFydGVkKTtcbiAgICAvLyBSdW4gYSBwb2xsIHN5bmNocm9ub3VzbHkgKHdoaWNoIHdpbGwgY291bnRlcmFjdCB0aGVcbiAgICAvLyArK19wb2xsc1NjaGVkdWxlZEJ1dE5vdFN0YXJ0ZWQgZnJvbSBfc3VzcGVuZFBvbGxpbmcpLlxuICAgIHNlbGYuX3Rhc2tRdWV1ZS5ydW5UYXNrKGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYuX3BvbGxNb25nbygpO1xuICAgIH0pO1xuICB9LFxuXG4gIF9wb2xsTW9uZ286IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgLS1zZWxmLl9wb2xsc1NjaGVkdWxlZEJ1dE5vdFN0YXJ0ZWQ7XG5cbiAgICBpZiAoc2VsZi5fc3RvcHBlZClcbiAgICAgIHJldHVybjtcblxuICAgIHZhciBmaXJzdCA9IGZhbHNlO1xuICAgIHZhciBuZXdSZXN1bHRzO1xuICAgIHZhciBvbGRSZXN1bHRzID0gc2VsZi5fcmVzdWx0cztcbiAgICBpZiAoIW9sZFJlc3VsdHMpIHtcbiAgICAgIGZpcnN0ID0gdHJ1ZTtcbiAgICAgIC8vIFhYWCBtYXliZSB1c2UgT3JkZXJlZERpY3QgaW5zdGVhZD9cbiAgICAgIG9sZFJlc3VsdHMgPSBzZWxmLl9vcmRlcmVkID8gW10gOiBuZXcgTG9jYWxDb2xsZWN0aW9uLl9JZE1hcDtcbiAgICB9XG5cbiAgICBzZWxmLl90ZXN0T25seVBvbGxDYWxsYmFjayAmJiBzZWxmLl90ZXN0T25seVBvbGxDYWxsYmFjaygpO1xuXG4gICAgLy8gU2F2ZSB0aGUgbGlzdCBvZiBwZW5kaW5nIHdyaXRlcyB3aGljaCB0aGlzIHJvdW5kIHdpbGwgY29tbWl0LlxuICAgIHZhciB3cml0ZXNGb3JDeWNsZSA9IHNlbGYuX3BlbmRpbmdXcml0ZXM7XG4gICAgc2VsZi5fcGVuZGluZ1dyaXRlcyA9IFtdO1xuXG4gICAgLy8gR2V0IHRoZSBuZXcgcXVlcnkgcmVzdWx0cy4gKFRoaXMgeWllbGRzLilcbiAgICB0cnkge1xuICAgICAgbmV3UmVzdWx0cyA9IHNlbGYuX3N5bmNocm9ub3VzQ3Vyc29yLmdldFJhd09iamVjdHMoc2VsZi5fb3JkZXJlZCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgaWYgKGZpcnN0ICYmIHR5cGVvZihlLmNvZGUpID09PSAnbnVtYmVyJykge1xuICAgICAgICAvLyBUaGlzIGlzIGFuIGVycm9yIGRvY3VtZW50IHNlbnQgdG8gdXMgYnkgbW9uZ29kLCBub3QgYSBjb25uZWN0aW9uXG4gICAgICAgIC8vIGVycm9yIGdlbmVyYXRlZCBieSB0aGUgY2xpZW50LiBBbmQgd2UndmUgbmV2ZXIgc2VlbiB0aGlzIHF1ZXJ5IHdvcmtcbiAgICAgICAgLy8gc3VjY2Vzc2Z1bGx5LiBQcm9iYWJseSBpdCdzIGEgYmFkIHNlbGVjdG9yIG9yIHNvbWV0aGluZywgc28gd2Ugc2hvdWxkXG4gICAgICAgIC8vIE5PVCByZXRyeS4gSW5zdGVhZCwgd2Ugc2hvdWxkIGhhbHQgdGhlIG9ic2VydmUgKHdoaWNoIGVuZHMgdXAgY2FsbGluZ1xuICAgICAgICAvLyBgc3RvcGAgb24gdXMpLlxuICAgICAgICBzZWxmLl9tdWx0aXBsZXhlci5xdWVyeUVycm9yKFxuICAgICAgICAgIG5ldyBFcnJvcihcbiAgICAgICAgICAgIFwiRXhjZXB0aW9uIHdoaWxlIHBvbGxpbmcgcXVlcnkgXCIgK1xuICAgICAgICAgICAgICBKU09OLnN0cmluZ2lmeShzZWxmLl9jdXJzb3JEZXNjcmlwdGlvbikgKyBcIjogXCIgKyBlLm1lc3NhZ2UpKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBnZXRSYXdPYmplY3RzIGNhbiB0aHJvdyBpZiB3ZSdyZSBoYXZpbmcgdHJvdWJsZSB0YWxraW5nIHRvIHRoZVxuICAgICAgLy8gZGF0YWJhc2UuICBUaGF0J3MgZmluZSAtLS0gd2Ugd2lsbCByZXBvbGwgbGF0ZXIgYW55d2F5LiBCdXQgd2Ugc2hvdWxkXG4gICAgICAvLyBtYWtlIHN1cmUgbm90IHRvIGxvc2UgdHJhY2sgb2YgdGhpcyBjeWNsZSdzIHdyaXRlcy5cbiAgICAgIC8vIChJdCBhbHNvIGNhbiB0aHJvdyBpZiB0aGVyZSdzIGp1c3Qgc29tZXRoaW5nIGludmFsaWQgYWJvdXQgdGhpcyBxdWVyeTtcbiAgICAgIC8vIHVuZm9ydHVuYXRlbHkgdGhlIE9ic2VydmVEcml2ZXIgQVBJIGRvZXNuJ3QgcHJvdmlkZSBhIGdvb2Qgd2F5IHRvXG4gICAgICAvLyBcImNhbmNlbFwiIHRoZSBvYnNlcnZlIGZyb20gdGhlIGluc2lkZSBpbiB0aGlzIGNhc2UuXG4gICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShzZWxmLl9wZW5kaW5nV3JpdGVzLCB3cml0ZXNGb3JDeWNsZSk7XG4gICAgICBNZXRlb3IuX2RlYnVnKFwiRXhjZXB0aW9uIHdoaWxlIHBvbGxpbmcgcXVlcnkgXCIgK1xuICAgICAgICAgICAgICAgICAgICBKU09OLnN0cmluZ2lmeShzZWxmLl9jdXJzb3JEZXNjcmlwdGlvbiksIGUpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFJ1biBkaWZmcy5cbiAgICBpZiAoIXNlbGYuX3N0b3BwZWQpIHtcbiAgICAgIExvY2FsQ29sbGVjdGlvbi5fZGlmZlF1ZXJ5Q2hhbmdlcyhcbiAgICAgICAgc2VsZi5fb3JkZXJlZCwgb2xkUmVzdWx0cywgbmV3UmVzdWx0cywgc2VsZi5fbXVsdGlwbGV4ZXIpO1xuICAgIH1cblxuICAgIC8vIFNpZ25hbHMgdGhlIG11bHRpcGxleGVyIHRvIGFsbG93IGFsbCBvYnNlcnZlQ2hhbmdlcyBjYWxscyB0aGF0IHNoYXJlIHRoaXNcbiAgICAvLyBtdWx0aXBsZXhlciB0byByZXR1cm4uIChUaGlzIGhhcHBlbnMgYXN5bmNocm9ub3VzbHksIHZpYSB0aGVcbiAgICAvLyBtdWx0aXBsZXhlcidzIHF1ZXVlLilcbiAgICBpZiAoZmlyc3QpXG4gICAgICBzZWxmLl9tdWx0aXBsZXhlci5yZWFkeSgpO1xuXG4gICAgLy8gUmVwbGFjZSBzZWxmLl9yZXN1bHRzIGF0b21pY2FsbHkuICAoVGhpcyBhc3NpZ25tZW50IGlzIHdoYXQgbWFrZXMgYGZpcnN0YFxuICAgIC8vIHN0YXkgdGhyb3VnaCBvbiB0aGUgbmV4dCBjeWNsZSwgc28gd2UndmUgd2FpdGVkIHVudGlsIGFmdGVyIHdlJ3ZlXG4gICAgLy8gY29tbWl0dGVkIHRvIHJlYWR5LWluZyB0aGUgbXVsdGlwbGV4ZXIuKVxuICAgIHNlbGYuX3Jlc3VsdHMgPSBuZXdSZXN1bHRzO1xuXG4gICAgLy8gT25jZSB0aGUgT2JzZXJ2ZU11bHRpcGxleGVyIGhhcyBwcm9jZXNzZWQgZXZlcnl0aGluZyB3ZSd2ZSBkb25lIGluIHRoaXNcbiAgICAvLyByb3VuZCwgbWFyayBhbGwgdGhlIHdyaXRlcyB3aGljaCBleGlzdGVkIGJlZm9yZSB0aGlzIGNhbGwgYXNcbiAgICAvLyBjb21tbWl0dGVkLiAoSWYgbmV3IHdyaXRlcyBoYXZlIHNob3duIHVwIGluIHRoZSBtZWFudGltZSwgdGhlcmUnbGxcbiAgICAvLyBhbHJlYWR5IGJlIGFub3RoZXIgX3BvbGxNb25nbyB0YXNrIHNjaGVkdWxlZC4pXG4gICAgc2VsZi5fbXVsdGlwbGV4ZXIub25GbHVzaChmdW5jdGlvbiAoKSB7XG4gICAgICBfLmVhY2god3JpdGVzRm9yQ3ljbGUsIGZ1bmN0aW9uICh3KSB7XG4gICAgICAgIHcuY29tbWl0dGVkKCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSxcblxuICBzdG9wOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHNlbGYuX3N0b3BwZWQgPSB0cnVlO1xuICAgIF8uZWFjaChzZWxmLl9zdG9wQ2FsbGJhY2tzLCBmdW5jdGlvbiAoYykgeyBjKCk7IH0pO1xuICAgIC8vIFJlbGVhc2UgYW55IHdyaXRlIGZlbmNlcyB0aGF0IGFyZSB3YWl0aW5nIG9uIHVzLlxuICAgIF8uZWFjaChzZWxmLl9wZW5kaW5nV3JpdGVzLCBmdW5jdGlvbiAodykge1xuICAgICAgdy5jb21taXR0ZWQoKTtcbiAgICB9KTtcbiAgICBQYWNrYWdlWydmYWN0cy1iYXNlJ10gJiYgUGFja2FnZVsnZmFjdHMtYmFzZSddLkZhY3RzLmluY3JlbWVudFNlcnZlckZhY3QoXG4gICAgICBcIm1vbmdvLWxpdmVkYXRhXCIsIFwib2JzZXJ2ZS1kcml2ZXJzLXBvbGxpbmdcIiwgLTEpO1xuICB9XG59KTtcbiIsImltcG9ydCB7IG9wbG9nVjJWMUNvbnZlcnRlciB9IGZyb20gJy4vb3Bsb2dfdjJfY29udmVydGVyJztcblxudmFyIEZ1dHVyZSA9IE5wbS5yZXF1aXJlKCdmaWJlcnMvZnV0dXJlJyk7XG5cbnZhciBQSEFTRSA9IHtcbiAgUVVFUllJTkc6IFwiUVVFUllJTkdcIixcbiAgRkVUQ0hJTkc6IFwiRkVUQ0hJTkdcIixcbiAgU1RFQURZOiBcIlNURUFEWVwiXG59O1xuXG4vLyBFeGNlcHRpb24gdGhyb3duIGJ5IF9uZWVkVG9Qb2xsUXVlcnkgd2hpY2ggdW5yb2xscyB0aGUgc3RhY2sgdXAgdG8gdGhlXG4vLyBlbmNsb3NpbmcgY2FsbCB0byBmaW5pc2hJZk5lZWRUb1BvbGxRdWVyeS5cbnZhciBTd2l0Y2hlZFRvUXVlcnkgPSBmdW5jdGlvbiAoKSB7fTtcbnZhciBmaW5pc2hJZk5lZWRUb1BvbGxRdWVyeSA9IGZ1bmN0aW9uIChmKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgIGYuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZiAoIShlIGluc3RhbmNlb2YgU3dpdGNoZWRUb1F1ZXJ5KSlcbiAgICAgICAgdGhyb3cgZTtcbiAgICB9XG4gIH07XG59O1xuXG52YXIgY3VycmVudElkID0gMDtcblxuLy8gT3Bsb2dPYnNlcnZlRHJpdmVyIGlzIGFuIGFsdGVybmF0aXZlIHRvIFBvbGxpbmdPYnNlcnZlRHJpdmVyIHdoaWNoIGZvbGxvd3Ncbi8vIHRoZSBNb25nbyBvcGVyYXRpb24gbG9nIGluc3RlYWQgb2YganVzdCByZS1wb2xsaW5nIHRoZSBxdWVyeS4gSXQgb2JleXMgdGhlXG4vLyBzYW1lIHNpbXBsZSBpbnRlcmZhY2U6IGNvbnN0cnVjdGluZyBpdCBzdGFydHMgc2VuZGluZyBvYnNlcnZlQ2hhbmdlc1xuLy8gY2FsbGJhY2tzIChhbmQgYSByZWFkeSgpIGludm9jYXRpb24pIHRvIHRoZSBPYnNlcnZlTXVsdGlwbGV4ZXIsIGFuZCB5b3Ugc3RvcFxuLy8gaXQgYnkgY2FsbGluZyB0aGUgc3RvcCgpIG1ldGhvZC5cbk9wbG9nT2JzZXJ2ZURyaXZlciA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgc2VsZi5fdXNlc09wbG9nID0gdHJ1ZTsgIC8vIHRlc3RzIGxvb2sgYXQgdGhpc1xuXG4gIHNlbGYuX2lkID0gY3VycmVudElkO1xuICBjdXJyZW50SWQrKztcblxuICBzZWxmLl9jdXJzb3JEZXNjcmlwdGlvbiA9IG9wdGlvbnMuY3Vyc29yRGVzY3JpcHRpb247XG4gIHNlbGYuX21vbmdvSGFuZGxlID0gb3B0aW9ucy5tb25nb0hhbmRsZTtcbiAgc2VsZi5fbXVsdGlwbGV4ZXIgPSBvcHRpb25zLm11bHRpcGxleGVyO1xuXG4gIGlmIChvcHRpb25zLm9yZGVyZWQpIHtcbiAgICB0aHJvdyBFcnJvcihcIk9wbG9nT2JzZXJ2ZURyaXZlciBvbmx5IHN1cHBvcnRzIHVub3JkZXJlZCBvYnNlcnZlQ2hhbmdlc1wiKTtcbiAgfVxuXG4gIHZhciBzb3J0ZXIgPSBvcHRpb25zLnNvcnRlcjtcbiAgLy8gV2UgZG9uJ3Qgc3VwcG9ydCAkbmVhciBhbmQgb3RoZXIgZ2VvLXF1ZXJpZXMgc28gaXQncyBPSyB0byBpbml0aWFsaXplIHRoZVxuICAvLyBjb21wYXJhdG9yIG9ubHkgb25jZSBpbiB0aGUgY29uc3RydWN0b3IuXG4gIHZhciBjb21wYXJhdG9yID0gc29ydGVyICYmIHNvcnRlci5nZXRDb21wYXJhdG9yKCk7XG5cbiAgaWYgKG9wdGlvbnMuY3Vyc29yRGVzY3JpcHRpb24ub3B0aW9ucy5saW1pdCkge1xuICAgIC8vIFRoZXJlIGFyZSBzZXZlcmFsIHByb3BlcnRpZXMgb3JkZXJlZCBkcml2ZXIgaW1wbGVtZW50czpcbiAgICAvLyAtIF9saW1pdCBpcyBhIHBvc2l0aXZlIG51bWJlclxuICAgIC8vIC0gX2NvbXBhcmF0b3IgaXMgYSBmdW5jdGlvbi1jb21wYXJhdG9yIGJ5IHdoaWNoIHRoZSBxdWVyeSBpcyBvcmRlcmVkXG4gICAgLy8gLSBfdW5wdWJsaXNoZWRCdWZmZXIgaXMgbm9uLW51bGwgTWluL01heCBIZWFwLFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgIHRoZSBlbXB0eSBidWZmZXIgaW4gU1RFQURZIHBoYXNlIGltcGxpZXMgdGhhdCB0aGVcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICBldmVyeXRoaW5nIHRoYXQgbWF0Y2hlcyB0aGUgcXVlcmllcyBzZWxlY3RvciBmaXRzXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgaW50byBwdWJsaXNoZWQgc2V0LlxuICAgIC8vIC0gX3B1Ymxpc2hlZCAtIE1pbiBIZWFwIChhbHNvIGltcGxlbWVudHMgSWRNYXAgbWV0aG9kcylcblxuICAgIHZhciBoZWFwT3B0aW9ucyA9IHsgSWRNYXA6IExvY2FsQ29sbGVjdGlvbi5fSWRNYXAgfTtcbiAgICBzZWxmLl9saW1pdCA9IHNlbGYuX2N1cnNvckRlc2NyaXB0aW9uLm9wdGlvbnMubGltaXQ7XG4gICAgc2VsZi5fY29tcGFyYXRvciA9IGNvbXBhcmF0b3I7XG4gICAgc2VsZi5fc29ydGVyID0gc29ydGVyO1xuICAgIHNlbGYuX3VucHVibGlzaGVkQnVmZmVyID0gbmV3IE1pbk1heEhlYXAoY29tcGFyYXRvciwgaGVhcE9wdGlvbnMpO1xuICAgIC8vIFdlIG5lZWQgc29tZXRoaW5nIHRoYXQgY2FuIGZpbmQgTWF4IHZhbHVlIGluIGFkZGl0aW9uIHRvIElkTWFwIGludGVyZmFjZVxuICAgIHNlbGYuX3B1Ymxpc2hlZCA9IG5ldyBNYXhIZWFwKGNvbXBhcmF0b3IsIGhlYXBPcHRpb25zKTtcbiAgfSBlbHNlIHtcbiAgICBzZWxmLl9saW1pdCA9IDA7XG4gICAgc2VsZi5fY29tcGFyYXRvciA9IG51bGw7XG4gICAgc2VsZi5fc29ydGVyID0gbnVsbDtcbiAgICBzZWxmLl91bnB1Ymxpc2hlZEJ1ZmZlciA9IG51bGw7XG4gICAgc2VsZi5fcHVibGlzaGVkID0gbmV3IExvY2FsQ29sbGVjdGlvbi5fSWRNYXA7XG4gIH1cblxuICAvLyBJbmRpY2F0ZXMgaWYgaXQgaXMgc2FmZSB0byBpbnNlcnQgYSBuZXcgZG9jdW1lbnQgYXQgdGhlIGVuZCBvZiB0aGUgYnVmZmVyXG4gIC8vIGZvciB0aGlzIHF1ZXJ5LiBpLmUuIGl0IGlzIGtub3duIHRoYXQgdGhlcmUgYXJlIG5vIGRvY3VtZW50cyBtYXRjaGluZyB0aGVcbiAgLy8gc2VsZWN0b3IgdGhvc2UgYXJlIG5vdCBpbiBwdWJsaXNoZWQgb3IgYnVmZmVyLlxuICBzZWxmLl9zYWZlQXBwZW5kVG9CdWZmZXIgPSBmYWxzZTtcblxuICBzZWxmLl9zdG9wcGVkID0gZmFsc2U7XG4gIHNlbGYuX3N0b3BIYW5kbGVzID0gW107XG5cbiAgUGFja2FnZVsnZmFjdHMtYmFzZSddICYmIFBhY2thZ2VbJ2ZhY3RzLWJhc2UnXS5GYWN0cy5pbmNyZW1lbnRTZXJ2ZXJGYWN0KFxuICAgIFwibW9uZ28tbGl2ZWRhdGFcIiwgXCJvYnNlcnZlLWRyaXZlcnMtb3Bsb2dcIiwgMSk7XG5cbiAgc2VsZi5fcmVnaXN0ZXJQaGFzZUNoYW5nZShQSEFTRS5RVUVSWUlORyk7XG5cbiAgc2VsZi5fbWF0Y2hlciA9IG9wdGlvbnMubWF0Y2hlcjtcbiAgdmFyIHByb2plY3Rpb24gPSBzZWxmLl9jdXJzb3JEZXNjcmlwdGlvbi5vcHRpb25zLmZpZWxkcyB8fCB7fTtcbiAgc2VsZi5fcHJvamVjdGlvbkZuID0gTG9jYWxDb2xsZWN0aW9uLl9jb21waWxlUHJvamVjdGlvbihwcm9qZWN0aW9uKTtcbiAgLy8gUHJvamVjdGlvbiBmdW5jdGlvbiwgcmVzdWx0IG9mIGNvbWJpbmluZyBpbXBvcnRhbnQgZmllbGRzIGZvciBzZWxlY3RvciBhbmRcbiAgLy8gZXhpc3RpbmcgZmllbGRzIHByb2plY3Rpb25cbiAgc2VsZi5fc2hhcmVkUHJvamVjdGlvbiA9IHNlbGYuX21hdGNoZXIuY29tYmluZUludG9Qcm9qZWN0aW9uKHByb2plY3Rpb24pO1xuICBpZiAoc29ydGVyKVxuICAgIHNlbGYuX3NoYXJlZFByb2plY3Rpb24gPSBzb3J0ZXIuY29tYmluZUludG9Qcm9qZWN0aW9uKHNlbGYuX3NoYXJlZFByb2plY3Rpb24pO1xuICBzZWxmLl9zaGFyZWRQcm9qZWN0aW9uRm4gPSBMb2NhbENvbGxlY3Rpb24uX2NvbXBpbGVQcm9qZWN0aW9uKFxuICAgIHNlbGYuX3NoYXJlZFByb2plY3Rpb24pO1xuXG4gIHNlbGYuX25lZWRUb0ZldGNoID0gbmV3IExvY2FsQ29sbGVjdGlvbi5fSWRNYXA7XG4gIHNlbGYuX2N1cnJlbnRseUZldGNoaW5nID0gbnVsbDtcbiAgc2VsZi5fZmV0Y2hHZW5lcmF0aW9uID0gMDtcblxuICBzZWxmLl9yZXF1ZXJ5V2hlbkRvbmVUaGlzUXVlcnkgPSBmYWxzZTtcbiAgc2VsZi5fd3JpdGVzVG9Db21taXRXaGVuV2VSZWFjaFN0ZWFkeSA9IFtdO1xuXG4gIC8vIElmIHRoZSBvcGxvZyBoYW5kbGUgdGVsbHMgdXMgdGhhdCBpdCBza2lwcGVkIHNvbWUgZW50cmllcyAoYmVjYXVzZSBpdCBnb3RcbiAgLy8gYmVoaW5kLCBzYXkpLCByZS1wb2xsLlxuICBzZWxmLl9zdG9wSGFuZGxlcy5wdXNoKHNlbGYuX21vbmdvSGFuZGxlLl9vcGxvZ0hhbmRsZS5vblNraXBwZWRFbnRyaWVzKFxuICAgIGZpbmlzaElmTmVlZFRvUG9sbFF1ZXJ5KGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYuX25lZWRUb1BvbGxRdWVyeSgpO1xuICAgIH0pXG4gICkpO1xuXG4gIGZvckVhY2hUcmlnZ2VyKHNlbGYuX2N1cnNvckRlc2NyaXB0aW9uLCBmdW5jdGlvbiAodHJpZ2dlcikge1xuICAgIHNlbGYuX3N0b3BIYW5kbGVzLnB1c2goc2VsZi5fbW9uZ29IYW5kbGUuX29wbG9nSGFuZGxlLm9uT3Bsb2dFbnRyeShcbiAgICAgIHRyaWdnZXIsIGZ1bmN0aW9uIChub3RpZmljYXRpb24pIHtcbiAgICAgICAgTWV0ZW9yLl9ub1lpZWxkc0FsbG93ZWQoZmluaXNoSWZOZWVkVG9Qb2xsUXVlcnkoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHZhciBvcCA9IG5vdGlmaWNhdGlvbi5vcDtcbiAgICAgICAgICBpZiAobm90aWZpY2F0aW9uLmRyb3BDb2xsZWN0aW9uIHx8IG5vdGlmaWNhdGlvbi5kcm9wRGF0YWJhc2UpIHtcbiAgICAgICAgICAgIC8vIE5vdGU6IHRoaXMgY2FsbCBpcyBub3QgYWxsb3dlZCB0byBibG9jayBvbiBhbnl0aGluZyAoZXNwZWNpYWxseVxuICAgICAgICAgICAgLy8gb24gd2FpdGluZyBmb3Igb3Bsb2cgZW50cmllcyB0byBjYXRjaCB1cCkgYmVjYXVzZSB0aGF0IHdpbGwgYmxvY2tcbiAgICAgICAgICAgIC8vIG9uT3Bsb2dFbnRyeSFcbiAgICAgICAgICAgIHNlbGYuX25lZWRUb1BvbGxRdWVyeSgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBBbGwgb3RoZXIgb3BlcmF0b3JzIHNob3VsZCBiZSBoYW5kbGVkIGRlcGVuZGluZyBvbiBwaGFzZVxuICAgICAgICAgICAgaWYgKHNlbGYuX3BoYXNlID09PSBQSEFTRS5RVUVSWUlORykge1xuICAgICAgICAgICAgICBzZWxmLl9oYW5kbGVPcGxvZ0VudHJ5UXVlcnlpbmcob3ApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgc2VsZi5faGFuZGxlT3Bsb2dFbnRyeVN0ZWFkeU9yRmV0Y2hpbmcob3ApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSkpO1xuICAgICAgfVxuICAgICkpO1xuICB9KTtcblxuICAvLyBYWFggb3JkZXJpbmcgdy5yLnQuIGV2ZXJ5dGhpbmcgZWxzZT9cbiAgc2VsZi5fc3RvcEhhbmRsZXMucHVzaChsaXN0ZW5BbGwoXG4gICAgc2VsZi5fY3Vyc29yRGVzY3JpcHRpb24sIGZ1bmN0aW9uIChub3RpZmljYXRpb24pIHtcbiAgICAgIC8vIElmIHdlJ3JlIG5vdCBpbiBhIHByZS1maXJlIHdyaXRlIGZlbmNlLCB3ZSBkb24ndCBoYXZlIHRvIGRvIGFueXRoaW5nLlxuICAgICAgdmFyIGZlbmNlID0gRERQU2VydmVyLl9DdXJyZW50V3JpdGVGZW5jZS5nZXQoKTtcbiAgICAgIGlmICghZmVuY2UgfHwgZmVuY2UuZmlyZWQpXG4gICAgICAgIHJldHVybjtcblxuICAgICAgaWYgKGZlbmNlLl9vcGxvZ09ic2VydmVEcml2ZXJzKSB7XG4gICAgICAgIGZlbmNlLl9vcGxvZ09ic2VydmVEcml2ZXJzW3NlbGYuX2lkXSA9IHNlbGY7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgZmVuY2UuX29wbG9nT2JzZXJ2ZURyaXZlcnMgPSB7fTtcbiAgICAgIGZlbmNlLl9vcGxvZ09ic2VydmVEcml2ZXJzW3NlbGYuX2lkXSA9IHNlbGY7XG5cbiAgICAgIGZlbmNlLm9uQmVmb3JlRmlyZShmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBkcml2ZXJzID0gZmVuY2UuX29wbG9nT2JzZXJ2ZURyaXZlcnM7XG4gICAgICAgIGRlbGV0ZSBmZW5jZS5fb3Bsb2dPYnNlcnZlRHJpdmVycztcblxuICAgICAgICAvLyBUaGlzIGZlbmNlIGNhbm5vdCBmaXJlIHVudGlsIHdlJ3ZlIGNhdWdodCB1cCB0byBcInRoaXMgcG9pbnRcIiBpbiB0aGVcbiAgICAgICAgLy8gb3Bsb2csIGFuZCBhbGwgb2JzZXJ2ZXJzIG1hZGUgaXQgYmFjayB0byB0aGUgc3RlYWR5IHN0YXRlLlxuICAgICAgICBzZWxmLl9tb25nb0hhbmRsZS5fb3Bsb2dIYW5kbGUud2FpdFVudGlsQ2F1Z2h0VXAoKTtcblxuICAgICAgICBfLmVhY2goZHJpdmVycywgZnVuY3Rpb24gKGRyaXZlcikge1xuICAgICAgICAgIGlmIChkcml2ZXIuX3N0b3BwZWQpXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgICB2YXIgd3JpdGUgPSBmZW5jZS5iZWdpbldyaXRlKCk7XG4gICAgICAgICAgaWYgKGRyaXZlci5fcGhhc2UgPT09IFBIQVNFLlNURUFEWSkge1xuICAgICAgICAgICAgLy8gTWFrZSBzdXJlIHRoYXQgYWxsIG9mIHRoZSBjYWxsYmFja3MgaGF2ZSBtYWRlIGl0IHRocm91Z2ggdGhlXG4gICAgICAgICAgICAvLyBtdWx0aXBsZXhlciBhbmQgYmVlbiBkZWxpdmVyZWQgdG8gT2JzZXJ2ZUhhbmRsZXMgYmVmb3JlIGNvbW1pdHRpbmdcbiAgICAgICAgICAgIC8vIHdyaXRlcy5cbiAgICAgICAgICAgIGRyaXZlci5fbXVsdGlwbGV4ZXIub25GbHVzaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHdyaXRlLmNvbW1pdHRlZCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRyaXZlci5fd3JpdGVzVG9Db21taXRXaGVuV2VSZWFjaFN0ZWFkeS5wdXNoKHdyaXRlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICApKTtcblxuICAvLyBXaGVuIE1vbmdvIGZhaWxzIG92ZXIsIHdlIG5lZWQgdG8gcmVwb2xsIHRoZSBxdWVyeSwgaW4gY2FzZSB3ZSBwcm9jZXNzZWQgYW5cbiAgLy8gb3Bsb2cgZW50cnkgdGhhdCBnb3Qgcm9sbGVkIGJhY2suXG4gIHNlbGYuX3N0b3BIYW5kbGVzLnB1c2goc2VsZi5fbW9uZ29IYW5kbGUuX29uRmFpbG92ZXIoZmluaXNoSWZOZWVkVG9Qb2xsUXVlcnkoXG4gICAgZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi5fbmVlZFRvUG9sbFF1ZXJ5KCk7XG4gICAgfSkpKTtcblxuICAvLyBHaXZlIF9vYnNlcnZlQ2hhbmdlcyBhIGNoYW5jZSB0byBhZGQgdGhlIG5ldyBPYnNlcnZlSGFuZGxlIHRvIG91clxuICAvLyBtdWx0aXBsZXhlciwgc28gdGhhdCB0aGUgYWRkZWQgY2FsbHMgZ2V0IHN0cmVhbWVkLlxuICBNZXRlb3IuZGVmZXIoZmluaXNoSWZOZWVkVG9Qb2xsUXVlcnkoZnVuY3Rpb24gKCkge1xuICAgIHNlbGYuX3J1bkluaXRpYWxRdWVyeSgpO1xuICB9KSk7XG59O1xuXG5fLmV4dGVuZChPcGxvZ09ic2VydmVEcml2ZXIucHJvdG90eXBlLCB7XG4gIF9hZGRQdWJsaXNoZWQ6IGZ1bmN0aW9uIChpZCwgZG9jKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIE1ldGVvci5fbm9ZaWVsZHNBbGxvd2VkKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBmaWVsZHMgPSBfLmNsb25lKGRvYyk7XG4gICAgICBkZWxldGUgZmllbGRzLl9pZDtcbiAgICAgIHNlbGYuX3B1Ymxpc2hlZC5zZXQoaWQsIHNlbGYuX3NoYXJlZFByb2plY3Rpb25Gbihkb2MpKTtcbiAgICAgIHNlbGYuX211bHRpcGxleGVyLmFkZGVkKGlkLCBzZWxmLl9wcm9qZWN0aW9uRm4oZmllbGRzKSk7XG5cbiAgICAgIC8vIEFmdGVyIGFkZGluZyB0aGlzIGRvY3VtZW50LCB0aGUgcHVibGlzaGVkIHNldCBtaWdodCBiZSBvdmVyZmxvd2VkXG4gICAgICAvLyAoZXhjZWVkaW5nIGNhcGFjaXR5IHNwZWNpZmllZCBieSBsaW1pdCkuIElmIHNvLCBwdXNoIHRoZSBtYXhpbXVtXG4gICAgICAvLyBlbGVtZW50IHRvIHRoZSBidWZmZXIsIHdlIG1pZ2h0IHdhbnQgdG8gc2F2ZSBpdCBpbiBtZW1vcnkgdG8gcmVkdWNlIHRoZVxuICAgICAgLy8gYW1vdW50IG9mIE1vbmdvIGxvb2t1cHMgaW4gdGhlIGZ1dHVyZS5cbiAgICAgIGlmIChzZWxmLl9saW1pdCAmJiBzZWxmLl9wdWJsaXNoZWQuc2l6ZSgpID4gc2VsZi5fbGltaXQpIHtcbiAgICAgICAgLy8gWFhYIGluIHRoZW9yeSB0aGUgc2l6ZSBvZiBwdWJsaXNoZWQgaXMgbm8gbW9yZSB0aGFuIGxpbWl0KzFcbiAgICAgICAgaWYgKHNlbGYuX3B1Ymxpc2hlZC5zaXplKCkgIT09IHNlbGYuX2xpbWl0ICsgMSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkFmdGVyIGFkZGluZyB0byBwdWJsaXNoZWQsIFwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKHNlbGYuX3B1Ymxpc2hlZC5zaXplKCkgLSBzZWxmLl9saW1pdCkgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICBcIiBkb2N1bWVudHMgYXJlIG92ZXJmbG93aW5nIHRoZSBzZXRcIik7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgb3ZlcmZsb3dpbmdEb2NJZCA9IHNlbGYuX3B1Ymxpc2hlZC5tYXhFbGVtZW50SWQoKTtcbiAgICAgICAgdmFyIG92ZXJmbG93aW5nRG9jID0gc2VsZi5fcHVibGlzaGVkLmdldChvdmVyZmxvd2luZ0RvY0lkKTtcblxuICAgICAgICBpZiAoRUpTT04uZXF1YWxzKG92ZXJmbG93aW5nRG9jSWQsIGlkKSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZSBkb2N1bWVudCBqdXN0IGFkZGVkIGlzIG92ZXJmbG93aW5nIHRoZSBwdWJsaXNoZWQgc2V0XCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2VsZi5fcHVibGlzaGVkLnJlbW92ZShvdmVyZmxvd2luZ0RvY0lkKTtcbiAgICAgICAgc2VsZi5fbXVsdGlwbGV4ZXIucmVtb3ZlZChvdmVyZmxvd2luZ0RvY0lkKTtcbiAgICAgICAgc2VsZi5fYWRkQnVmZmVyZWQob3ZlcmZsb3dpbmdEb2NJZCwgb3ZlcmZsb3dpbmdEb2MpO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuICBfcmVtb3ZlUHVibGlzaGVkOiBmdW5jdGlvbiAoaWQpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgTWV0ZW9yLl9ub1lpZWxkc0FsbG93ZWQoZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi5fcHVibGlzaGVkLnJlbW92ZShpZCk7XG4gICAgICBzZWxmLl9tdWx0aXBsZXhlci5yZW1vdmVkKGlkKTtcbiAgICAgIGlmICghIHNlbGYuX2xpbWl0IHx8IHNlbGYuX3B1Ymxpc2hlZC5zaXplKCkgPT09IHNlbGYuX2xpbWl0KVxuICAgICAgICByZXR1cm47XG5cbiAgICAgIGlmIChzZWxmLl9wdWJsaXNoZWQuc2l6ZSgpID4gc2VsZi5fbGltaXQpXG4gICAgICAgIHRocm93IEVycm9yKFwic2VsZi5fcHVibGlzaGVkIGdvdCB0b28gYmlnXCIpO1xuXG4gICAgICAvLyBPSywgd2UgYXJlIHB1Ymxpc2hpbmcgbGVzcyB0aGFuIHRoZSBsaW1pdC4gTWF5YmUgd2Ugc2hvdWxkIGxvb2sgaW4gdGhlXG4gICAgICAvLyBidWZmZXIgdG8gZmluZCB0aGUgbmV4dCBlbGVtZW50IHBhc3Qgd2hhdCB3ZSB3ZXJlIHB1Ymxpc2hpbmcgYmVmb3JlLlxuXG4gICAgICBpZiAoIXNlbGYuX3VucHVibGlzaGVkQnVmZmVyLmVtcHR5KCkpIHtcbiAgICAgICAgLy8gVGhlcmUncyBzb21ldGhpbmcgaW4gdGhlIGJ1ZmZlcjsgbW92ZSB0aGUgZmlyc3QgdGhpbmcgaW4gaXQgdG9cbiAgICAgICAgLy8gX3B1Ymxpc2hlZC5cbiAgICAgICAgdmFyIG5ld0RvY0lkID0gc2VsZi5fdW5wdWJsaXNoZWRCdWZmZXIubWluRWxlbWVudElkKCk7XG4gICAgICAgIHZhciBuZXdEb2MgPSBzZWxmLl91bnB1Ymxpc2hlZEJ1ZmZlci5nZXQobmV3RG9jSWQpO1xuICAgICAgICBzZWxmLl9yZW1vdmVCdWZmZXJlZChuZXdEb2NJZCk7XG4gICAgICAgIHNlbGYuX2FkZFB1Ymxpc2hlZChuZXdEb2NJZCwgbmV3RG9jKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBUaGVyZSdzIG5vdGhpbmcgaW4gdGhlIGJ1ZmZlci4gIFRoaXMgY291bGQgbWVhbiBvbmUgb2YgYSBmZXcgdGhpbmdzLlxuXG4gICAgICAvLyAoYSkgV2UgY291bGQgYmUgaW4gdGhlIG1pZGRsZSBvZiByZS1ydW5uaW5nIHRoZSBxdWVyeSAoc3BlY2lmaWNhbGx5LCB3ZVxuICAgICAgLy8gY291bGQgYmUgaW4gX3B1Ymxpc2hOZXdSZXN1bHRzKS4gSW4gdGhhdCBjYXNlLCBfdW5wdWJsaXNoZWRCdWZmZXIgaXNcbiAgICAgIC8vIGVtcHR5IGJlY2F1c2Ugd2UgY2xlYXIgaXQgYXQgdGhlIGJlZ2lubmluZyBvZiBfcHVibGlzaE5ld1Jlc3VsdHMuIEluXG4gICAgICAvLyB0aGlzIGNhc2UsIG91ciBjYWxsZXIgYWxyZWFkeSBrbm93cyB0aGUgZW50aXJlIGFuc3dlciB0byB0aGUgcXVlcnkgYW5kXG4gICAgICAvLyB3ZSBkb24ndCBuZWVkIHRvIGRvIGFueXRoaW5nIGZhbmN5IGhlcmUuICBKdXN0IHJldHVybi5cbiAgICAgIGlmIChzZWxmLl9waGFzZSA9PT0gUEhBU0UuUVVFUllJTkcpXG4gICAgICAgIHJldHVybjtcblxuICAgICAgLy8gKGIpIFdlJ3JlIHByZXR0eSBjb25maWRlbnQgdGhhdCB0aGUgdW5pb24gb2YgX3B1Ymxpc2hlZCBhbmRcbiAgICAgIC8vIF91bnB1Ymxpc2hlZEJ1ZmZlciBjb250YWluIGFsbCBkb2N1bWVudHMgdGhhdCBtYXRjaCBzZWxlY3Rvci4gQmVjYXVzZVxuICAgICAgLy8gX3VucHVibGlzaGVkQnVmZmVyIGlzIGVtcHR5LCB0aGF0IG1lYW5zIHdlJ3JlIGNvbmZpZGVudCB0aGF0IF9wdWJsaXNoZWRcbiAgICAgIC8vIGNvbnRhaW5zIGFsbCBkb2N1bWVudHMgdGhhdCBtYXRjaCBzZWxlY3Rvci4gU28gd2UgaGF2ZSBub3RoaW5nIHRvIGRvLlxuICAgICAgaWYgKHNlbGYuX3NhZmVBcHBlbmRUb0J1ZmZlcilcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICAvLyAoYykgTWF5YmUgdGhlcmUgYXJlIG90aGVyIGRvY3VtZW50cyBvdXQgdGhlcmUgdGhhdCBzaG91bGQgYmUgaW4gb3VyXG4gICAgICAvLyBidWZmZXIuIEJ1dCBpbiB0aGF0IGNhc2UsIHdoZW4gd2UgZW1wdGllZCBfdW5wdWJsaXNoZWRCdWZmZXIgaW5cbiAgICAgIC8vIF9yZW1vdmVCdWZmZXJlZCwgd2Ugc2hvdWxkIGhhdmUgY2FsbGVkIF9uZWVkVG9Qb2xsUXVlcnksIHdoaWNoIHdpbGxcbiAgICAgIC8vIGVpdGhlciBwdXQgc29tZXRoaW5nIGluIF91bnB1Ymxpc2hlZEJ1ZmZlciBvciBzZXQgX3NhZmVBcHBlbmRUb0J1ZmZlclxuICAgICAgLy8gKG9yIGJvdGgpLCBhbmQgaXQgd2lsbCBwdXQgdXMgaW4gUVVFUllJTkcgZm9yIHRoYXQgd2hvbGUgdGltZS4gU28gaW5cbiAgICAgIC8vIGZhY3QsIHdlIHNob3VsZG4ndCBiZSBhYmxlIHRvIGdldCBoZXJlLlxuXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJCdWZmZXIgaW5leHBsaWNhYmx5IGVtcHR5XCIpO1xuICAgIH0pO1xuICB9LFxuICBfY2hhbmdlUHVibGlzaGVkOiBmdW5jdGlvbiAoaWQsIG9sZERvYywgbmV3RG9jKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIE1ldGVvci5fbm9ZaWVsZHNBbGxvd2VkKGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYuX3B1Ymxpc2hlZC5zZXQoaWQsIHNlbGYuX3NoYXJlZFByb2plY3Rpb25GbihuZXdEb2MpKTtcbiAgICAgIHZhciBwcm9qZWN0ZWROZXcgPSBzZWxmLl9wcm9qZWN0aW9uRm4obmV3RG9jKTtcbiAgICAgIHZhciBwcm9qZWN0ZWRPbGQgPSBzZWxmLl9wcm9qZWN0aW9uRm4ob2xkRG9jKTtcbiAgICAgIHZhciBjaGFuZ2VkID0gRGlmZlNlcXVlbmNlLm1ha2VDaGFuZ2VkRmllbGRzKFxuICAgICAgICBwcm9qZWN0ZWROZXcsIHByb2plY3RlZE9sZCk7XG4gICAgICBpZiAoIV8uaXNFbXB0eShjaGFuZ2VkKSlcbiAgICAgICAgc2VsZi5fbXVsdGlwbGV4ZXIuY2hhbmdlZChpZCwgY2hhbmdlZCk7XG4gICAgfSk7XG4gIH0sXG4gIF9hZGRCdWZmZXJlZDogZnVuY3Rpb24gKGlkLCBkb2MpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgTWV0ZW9yLl9ub1lpZWxkc0FsbG93ZWQoZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi5fdW5wdWJsaXNoZWRCdWZmZXIuc2V0KGlkLCBzZWxmLl9zaGFyZWRQcm9qZWN0aW9uRm4oZG9jKSk7XG5cbiAgICAgIC8vIElmIHNvbWV0aGluZyBpcyBvdmVyZmxvd2luZyB0aGUgYnVmZmVyLCB3ZSBqdXN0IHJlbW92ZSBpdCBmcm9tIGNhY2hlXG4gICAgICBpZiAoc2VsZi5fdW5wdWJsaXNoZWRCdWZmZXIuc2l6ZSgpID4gc2VsZi5fbGltaXQpIHtcbiAgICAgICAgdmFyIG1heEJ1ZmZlcmVkSWQgPSBzZWxmLl91bnB1Ymxpc2hlZEJ1ZmZlci5tYXhFbGVtZW50SWQoKTtcblxuICAgICAgICBzZWxmLl91bnB1Ymxpc2hlZEJ1ZmZlci5yZW1vdmUobWF4QnVmZmVyZWRJZCk7XG5cbiAgICAgICAgLy8gU2luY2Ugc29tZXRoaW5nIG1hdGNoaW5nIGlzIHJlbW92ZWQgZnJvbSBjYWNoZSAoYm90aCBwdWJsaXNoZWQgc2V0IGFuZFxuICAgICAgICAvLyBidWZmZXIpLCBzZXQgZmxhZyB0byBmYWxzZVxuICAgICAgICBzZWxmLl9zYWZlQXBwZW5kVG9CdWZmZXIgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcbiAgLy8gSXMgY2FsbGVkIGVpdGhlciB0byByZW1vdmUgdGhlIGRvYyBjb21wbGV0ZWx5IGZyb20gbWF0Y2hpbmcgc2V0IG9yIHRvIG1vdmVcbiAgLy8gaXQgdG8gdGhlIHB1Ymxpc2hlZCBzZXQgbGF0ZXIuXG4gIF9yZW1vdmVCdWZmZXJlZDogZnVuY3Rpb24gKGlkKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIE1ldGVvci5fbm9ZaWVsZHNBbGxvd2VkKGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYuX3VucHVibGlzaGVkQnVmZmVyLnJlbW92ZShpZCk7XG4gICAgICAvLyBUbyBrZWVwIHRoZSBjb250cmFjdCBcImJ1ZmZlciBpcyBuZXZlciBlbXB0eSBpbiBTVEVBRFkgcGhhc2UgdW5sZXNzIHRoZVxuICAgICAgLy8gZXZlcnl0aGluZyBtYXRjaGluZyBmaXRzIGludG8gcHVibGlzaGVkXCIgdHJ1ZSwgd2UgcG9sbCBldmVyeXRoaW5nIGFzXG4gICAgICAvLyBzb29uIGFzIHdlIHNlZSB0aGUgYnVmZmVyIGJlY29taW5nIGVtcHR5LlxuICAgICAgaWYgKCEgc2VsZi5fdW5wdWJsaXNoZWRCdWZmZXIuc2l6ZSgpICYmICEgc2VsZi5fc2FmZUFwcGVuZFRvQnVmZmVyKVxuICAgICAgICBzZWxmLl9uZWVkVG9Qb2xsUXVlcnkoKTtcbiAgICB9KTtcbiAgfSxcbiAgLy8gQ2FsbGVkIHdoZW4gYSBkb2N1bWVudCBoYXMgam9pbmVkIHRoZSBcIk1hdGNoaW5nXCIgcmVzdWx0cyBzZXQuXG4gIC8vIFRha2VzIHJlc3BvbnNpYmlsaXR5IG9mIGtlZXBpbmcgX3VucHVibGlzaGVkQnVmZmVyIGluIHN5bmMgd2l0aCBfcHVibGlzaGVkXG4gIC8vIGFuZCB0aGUgZWZmZWN0IG9mIGxpbWl0IGVuZm9yY2VkLlxuICBfYWRkTWF0Y2hpbmc6IGZ1bmN0aW9uIChkb2MpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgTWV0ZW9yLl9ub1lpZWxkc0FsbG93ZWQoZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGlkID0gZG9jLl9pZDtcbiAgICAgIGlmIChzZWxmLl9wdWJsaXNoZWQuaGFzKGlkKSlcbiAgICAgICAgdGhyb3cgRXJyb3IoXCJ0cmllZCB0byBhZGQgc29tZXRoaW5nIGFscmVhZHkgcHVibGlzaGVkIFwiICsgaWQpO1xuICAgICAgaWYgKHNlbGYuX2xpbWl0ICYmIHNlbGYuX3VucHVibGlzaGVkQnVmZmVyLmhhcyhpZCkpXG4gICAgICAgIHRocm93IEVycm9yKFwidHJpZWQgdG8gYWRkIHNvbWV0aGluZyBhbHJlYWR5IGV4aXN0ZWQgaW4gYnVmZmVyIFwiICsgaWQpO1xuXG4gICAgICB2YXIgbGltaXQgPSBzZWxmLl9saW1pdDtcbiAgICAgIHZhciBjb21wYXJhdG9yID0gc2VsZi5fY29tcGFyYXRvcjtcbiAgICAgIHZhciBtYXhQdWJsaXNoZWQgPSAobGltaXQgJiYgc2VsZi5fcHVibGlzaGVkLnNpemUoKSA+IDApID9cbiAgICAgICAgc2VsZi5fcHVibGlzaGVkLmdldChzZWxmLl9wdWJsaXNoZWQubWF4RWxlbWVudElkKCkpIDogbnVsbDtcbiAgICAgIHZhciBtYXhCdWZmZXJlZCA9IChsaW1pdCAmJiBzZWxmLl91bnB1Ymxpc2hlZEJ1ZmZlci5zaXplKCkgPiAwKVxuICAgICAgICA/IHNlbGYuX3VucHVibGlzaGVkQnVmZmVyLmdldChzZWxmLl91bnB1Ymxpc2hlZEJ1ZmZlci5tYXhFbGVtZW50SWQoKSlcbiAgICAgICAgOiBudWxsO1xuICAgICAgLy8gVGhlIHF1ZXJ5IGlzIHVubGltaXRlZCBvciBkaWRuJ3QgcHVibGlzaCBlbm91Z2ggZG9jdW1lbnRzIHlldCBvciB0aGVcbiAgICAgIC8vIG5ldyBkb2N1bWVudCB3b3VsZCBmaXQgaW50byBwdWJsaXNoZWQgc2V0IHB1c2hpbmcgdGhlIG1heGltdW0gZWxlbWVudFxuICAgICAgLy8gb3V0LCB0aGVuIHdlIG5lZWQgdG8gcHVibGlzaCB0aGUgZG9jLlxuICAgICAgdmFyIHRvUHVibGlzaCA9ICEgbGltaXQgfHwgc2VsZi5fcHVibGlzaGVkLnNpemUoKSA8IGxpbWl0IHx8XG4gICAgICAgIGNvbXBhcmF0b3IoZG9jLCBtYXhQdWJsaXNoZWQpIDwgMDtcblxuICAgICAgLy8gT3RoZXJ3aXNlIHdlIG1pZ2h0IG5lZWQgdG8gYnVmZmVyIGl0IChvbmx5IGluIGNhc2Ugb2YgbGltaXRlZCBxdWVyeSkuXG4gICAgICAvLyBCdWZmZXJpbmcgaXMgYWxsb3dlZCBpZiB0aGUgYnVmZmVyIGlzIG5vdCBmaWxsZWQgdXAgeWV0IGFuZCBhbGxcbiAgICAgIC8vIG1hdGNoaW5nIGRvY3MgYXJlIGVpdGhlciBpbiB0aGUgcHVibGlzaGVkIHNldCBvciBpbiB0aGUgYnVmZmVyLlxuICAgICAgdmFyIGNhbkFwcGVuZFRvQnVmZmVyID0gIXRvUHVibGlzaCAmJiBzZWxmLl9zYWZlQXBwZW5kVG9CdWZmZXIgJiZcbiAgICAgICAgc2VsZi5fdW5wdWJsaXNoZWRCdWZmZXIuc2l6ZSgpIDwgbGltaXQ7XG5cbiAgICAgIC8vIE9yIGlmIGl0IGlzIHNtYWxsIGVub3VnaCB0byBiZSBzYWZlbHkgaW5zZXJ0ZWQgdG8gdGhlIG1pZGRsZSBvciB0aGVcbiAgICAgIC8vIGJlZ2lubmluZyBvZiB0aGUgYnVmZmVyLlxuICAgICAgdmFyIGNhbkluc2VydEludG9CdWZmZXIgPSAhdG9QdWJsaXNoICYmIG1heEJ1ZmZlcmVkICYmXG4gICAgICAgIGNvbXBhcmF0b3IoZG9jLCBtYXhCdWZmZXJlZCkgPD0gMDtcblxuICAgICAgdmFyIHRvQnVmZmVyID0gY2FuQXBwZW5kVG9CdWZmZXIgfHwgY2FuSW5zZXJ0SW50b0J1ZmZlcjtcblxuICAgICAgaWYgKHRvUHVibGlzaCkge1xuICAgICAgICBzZWxmLl9hZGRQdWJsaXNoZWQoaWQsIGRvYyk7XG4gICAgICB9IGVsc2UgaWYgKHRvQnVmZmVyKSB7XG4gICAgICAgIHNlbGYuX2FkZEJ1ZmZlcmVkKGlkLCBkb2MpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gZHJvcHBpbmcgaXQgYW5kIG5vdCBzYXZpbmcgdG8gdGhlIGNhY2hlXG4gICAgICAgIHNlbGYuX3NhZmVBcHBlbmRUb0J1ZmZlciA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuICAvLyBDYWxsZWQgd2hlbiBhIGRvY3VtZW50IGxlYXZlcyB0aGUgXCJNYXRjaGluZ1wiIHJlc3VsdHMgc2V0LlxuICAvLyBUYWtlcyByZXNwb25zaWJpbGl0eSBvZiBrZWVwaW5nIF91bnB1Ymxpc2hlZEJ1ZmZlciBpbiBzeW5jIHdpdGggX3B1Ymxpc2hlZFxuICAvLyBhbmQgdGhlIGVmZmVjdCBvZiBsaW1pdCBlbmZvcmNlZC5cbiAgX3JlbW92ZU1hdGNoaW5nOiBmdW5jdGlvbiAoaWQpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgTWV0ZW9yLl9ub1lpZWxkc0FsbG93ZWQoZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCEgc2VsZi5fcHVibGlzaGVkLmhhcyhpZCkgJiYgISBzZWxmLl9saW1pdClcbiAgICAgICAgdGhyb3cgRXJyb3IoXCJ0cmllZCB0byByZW1vdmUgc29tZXRoaW5nIG1hdGNoaW5nIGJ1dCBub3QgY2FjaGVkIFwiICsgaWQpO1xuXG4gICAgICBpZiAoc2VsZi5fcHVibGlzaGVkLmhhcyhpZCkpIHtcbiAgICAgICAgc2VsZi5fcmVtb3ZlUHVibGlzaGVkKGlkKTtcbiAgICAgIH0gZWxzZSBpZiAoc2VsZi5fdW5wdWJsaXNoZWRCdWZmZXIuaGFzKGlkKSkge1xuICAgICAgICBzZWxmLl9yZW1vdmVCdWZmZXJlZChpZCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG4gIF9oYW5kbGVEb2M6IGZ1bmN0aW9uIChpZCwgbmV3RG9jKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIE1ldGVvci5fbm9ZaWVsZHNBbGxvd2VkKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBtYXRjaGVzTm93ID0gbmV3RG9jICYmIHNlbGYuX21hdGNoZXIuZG9jdW1lbnRNYXRjaGVzKG5ld0RvYykucmVzdWx0O1xuXG4gICAgICB2YXIgcHVibGlzaGVkQmVmb3JlID0gc2VsZi5fcHVibGlzaGVkLmhhcyhpZCk7XG4gICAgICB2YXIgYnVmZmVyZWRCZWZvcmUgPSBzZWxmLl9saW1pdCAmJiBzZWxmLl91bnB1Ymxpc2hlZEJ1ZmZlci5oYXMoaWQpO1xuICAgICAgdmFyIGNhY2hlZEJlZm9yZSA9IHB1Ymxpc2hlZEJlZm9yZSB8fCBidWZmZXJlZEJlZm9yZTtcblxuICAgICAgaWYgKG1hdGNoZXNOb3cgJiYgIWNhY2hlZEJlZm9yZSkge1xuICAgICAgICBzZWxmLl9hZGRNYXRjaGluZyhuZXdEb2MpO1xuICAgICAgfSBlbHNlIGlmIChjYWNoZWRCZWZvcmUgJiYgIW1hdGNoZXNOb3cpIHtcbiAgICAgICAgc2VsZi5fcmVtb3ZlTWF0Y2hpbmcoaWQpO1xuICAgICAgfSBlbHNlIGlmIChjYWNoZWRCZWZvcmUgJiYgbWF0Y2hlc05vdykge1xuICAgICAgICB2YXIgb2xkRG9jID0gc2VsZi5fcHVibGlzaGVkLmdldChpZCk7XG4gICAgICAgIHZhciBjb21wYXJhdG9yID0gc2VsZi5fY29tcGFyYXRvcjtcbiAgICAgICAgdmFyIG1pbkJ1ZmZlcmVkID0gc2VsZi5fbGltaXQgJiYgc2VsZi5fdW5wdWJsaXNoZWRCdWZmZXIuc2l6ZSgpICYmXG4gICAgICAgICAgc2VsZi5fdW5wdWJsaXNoZWRCdWZmZXIuZ2V0KHNlbGYuX3VucHVibGlzaGVkQnVmZmVyLm1pbkVsZW1lbnRJZCgpKTtcbiAgICAgICAgdmFyIG1heEJ1ZmZlcmVkO1xuXG4gICAgICAgIGlmIChwdWJsaXNoZWRCZWZvcmUpIHtcbiAgICAgICAgICAvLyBVbmxpbWl0ZWQgY2FzZSB3aGVyZSB0aGUgZG9jdW1lbnQgc3RheXMgaW4gcHVibGlzaGVkIG9uY2UgaXRcbiAgICAgICAgICAvLyBtYXRjaGVzIG9yIHRoZSBjYXNlIHdoZW4gd2UgZG9uJ3QgaGF2ZSBlbm91Z2ggbWF0Y2hpbmcgZG9jcyB0b1xuICAgICAgICAgIC8vIHB1Ymxpc2ggb3IgdGhlIGNoYW5nZWQgYnV0IG1hdGNoaW5nIGRvYyB3aWxsIHN0YXkgaW4gcHVibGlzaGVkXG4gICAgICAgICAgLy8gYW55d2F5cy5cbiAgICAgICAgICAvL1xuICAgICAgICAgIC8vIFhYWDogV2UgcmVseSBvbiB0aGUgZW1wdGluZXNzIG9mIGJ1ZmZlci4gQmUgc3VyZSB0byBtYWludGFpbiB0aGVcbiAgICAgICAgICAvLyBmYWN0IHRoYXQgYnVmZmVyIGNhbid0IGJlIGVtcHR5IGlmIHRoZXJlIGFyZSBtYXRjaGluZyBkb2N1bWVudHMgbm90XG4gICAgICAgICAgLy8gcHVibGlzaGVkLiBOb3RhYmx5LCB3ZSBkb24ndCB3YW50IHRvIHNjaGVkdWxlIHJlcG9sbCBhbmQgY29udGludWVcbiAgICAgICAgICAvLyByZWx5aW5nIG9uIHRoaXMgcHJvcGVydHkuXG4gICAgICAgICAgdmFyIHN0YXlzSW5QdWJsaXNoZWQgPSAhIHNlbGYuX2xpbWl0IHx8XG4gICAgICAgICAgICBzZWxmLl91bnB1Ymxpc2hlZEJ1ZmZlci5zaXplKCkgPT09IDAgfHxcbiAgICAgICAgICAgIGNvbXBhcmF0b3IobmV3RG9jLCBtaW5CdWZmZXJlZCkgPD0gMDtcblxuICAgICAgICAgIGlmIChzdGF5c0luUHVibGlzaGVkKSB7XG4gICAgICAgICAgICBzZWxmLl9jaGFuZ2VQdWJsaXNoZWQoaWQsIG9sZERvYywgbmV3RG9jKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gYWZ0ZXIgdGhlIGNoYW5nZSBkb2MgZG9lc24ndCBzdGF5IGluIHRoZSBwdWJsaXNoZWQsIHJlbW92ZSBpdFxuICAgICAgICAgICAgc2VsZi5fcmVtb3ZlUHVibGlzaGVkKGlkKTtcbiAgICAgICAgICAgIC8vIGJ1dCBpdCBjYW4gbW92ZSBpbnRvIGJ1ZmZlcmVkIG5vdywgY2hlY2sgaXRcbiAgICAgICAgICAgIG1heEJ1ZmZlcmVkID0gc2VsZi5fdW5wdWJsaXNoZWRCdWZmZXIuZ2V0KFxuICAgICAgICAgICAgICBzZWxmLl91bnB1Ymxpc2hlZEJ1ZmZlci5tYXhFbGVtZW50SWQoKSk7XG5cbiAgICAgICAgICAgIHZhciB0b0J1ZmZlciA9IHNlbGYuX3NhZmVBcHBlbmRUb0J1ZmZlciB8fFxuICAgICAgICAgICAgICAgICAgKG1heEJ1ZmZlcmVkICYmIGNvbXBhcmF0b3IobmV3RG9jLCBtYXhCdWZmZXJlZCkgPD0gMCk7XG5cbiAgICAgICAgICAgIGlmICh0b0J1ZmZlcikge1xuICAgICAgICAgICAgICBzZWxmLl9hZGRCdWZmZXJlZChpZCwgbmV3RG9jKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIC8vIFRocm93IGF3YXkgZnJvbSBib3RoIHB1Ymxpc2hlZCBzZXQgYW5kIGJ1ZmZlclxuICAgICAgICAgICAgICBzZWxmLl9zYWZlQXBwZW5kVG9CdWZmZXIgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoYnVmZmVyZWRCZWZvcmUpIHtcbiAgICAgICAgICBvbGREb2MgPSBzZWxmLl91bnB1Ymxpc2hlZEJ1ZmZlci5nZXQoaWQpO1xuICAgICAgICAgIC8vIHJlbW92ZSB0aGUgb2xkIHZlcnNpb24gbWFudWFsbHkgaW5zdGVhZCBvZiB1c2luZyBfcmVtb3ZlQnVmZmVyZWQgc29cbiAgICAgICAgICAvLyB3ZSBkb24ndCB0cmlnZ2VyIHRoZSBxdWVyeWluZyBpbW1lZGlhdGVseS4gIGlmIHdlIGVuZCB0aGlzIGJsb2NrXG4gICAgICAgICAgLy8gd2l0aCB0aGUgYnVmZmVyIGVtcHR5LCB3ZSB3aWxsIG5lZWQgdG8gdHJpZ2dlciB0aGUgcXVlcnkgcG9sbFxuICAgICAgICAgIC8vIG1hbnVhbGx5IHRvby5cbiAgICAgICAgICBzZWxmLl91bnB1Ymxpc2hlZEJ1ZmZlci5yZW1vdmUoaWQpO1xuXG4gICAgICAgICAgdmFyIG1heFB1Ymxpc2hlZCA9IHNlbGYuX3B1Ymxpc2hlZC5nZXQoXG4gICAgICAgICAgICBzZWxmLl9wdWJsaXNoZWQubWF4RWxlbWVudElkKCkpO1xuICAgICAgICAgIG1heEJ1ZmZlcmVkID0gc2VsZi5fdW5wdWJsaXNoZWRCdWZmZXIuc2l6ZSgpICYmXG4gICAgICAgICAgICAgICAgc2VsZi5fdW5wdWJsaXNoZWRCdWZmZXIuZ2V0KFxuICAgICAgICAgICAgICAgICAgc2VsZi5fdW5wdWJsaXNoZWRCdWZmZXIubWF4RWxlbWVudElkKCkpO1xuXG4gICAgICAgICAgLy8gdGhlIGJ1ZmZlcmVkIGRvYyB3YXMgdXBkYXRlZCwgaXQgY291bGQgbW92ZSB0byBwdWJsaXNoZWRcbiAgICAgICAgICB2YXIgdG9QdWJsaXNoID0gY29tcGFyYXRvcihuZXdEb2MsIG1heFB1Ymxpc2hlZCkgPCAwO1xuXG4gICAgICAgICAgLy8gb3Igc3RheXMgaW4gYnVmZmVyIGV2ZW4gYWZ0ZXIgdGhlIGNoYW5nZVxuICAgICAgICAgIHZhciBzdGF5c0luQnVmZmVyID0gKCEgdG9QdWJsaXNoICYmIHNlbGYuX3NhZmVBcHBlbmRUb0J1ZmZlcikgfHxcbiAgICAgICAgICAgICAgICAoIXRvUHVibGlzaCAmJiBtYXhCdWZmZXJlZCAmJlxuICAgICAgICAgICAgICAgICBjb21wYXJhdG9yKG5ld0RvYywgbWF4QnVmZmVyZWQpIDw9IDApO1xuXG4gICAgICAgICAgaWYgKHRvUHVibGlzaCkge1xuICAgICAgICAgICAgc2VsZi5fYWRkUHVibGlzaGVkKGlkLCBuZXdEb2MpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoc3RheXNJbkJ1ZmZlcikge1xuICAgICAgICAgICAgLy8gc3RheXMgaW4gYnVmZmVyIGJ1dCBjaGFuZ2VzXG4gICAgICAgICAgICBzZWxmLl91bnB1Ymxpc2hlZEJ1ZmZlci5zZXQoaWQsIG5ld0RvYyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIFRocm93IGF3YXkgZnJvbSBib3RoIHB1Ymxpc2hlZCBzZXQgYW5kIGJ1ZmZlclxuICAgICAgICAgICAgc2VsZi5fc2FmZUFwcGVuZFRvQnVmZmVyID0gZmFsc2U7XG4gICAgICAgICAgICAvLyBOb3JtYWxseSB0aGlzIGNoZWNrIHdvdWxkIGhhdmUgYmVlbiBkb25lIGluIF9yZW1vdmVCdWZmZXJlZCBidXRcbiAgICAgICAgICAgIC8vIHdlIGRpZG4ndCB1c2UgaXQsIHNvIHdlIG5lZWQgdG8gZG8gaXQgb3Vyc2VsZiBub3cuXG4gICAgICAgICAgICBpZiAoISBzZWxmLl91bnB1Ymxpc2hlZEJ1ZmZlci5zaXplKCkpIHtcbiAgICAgICAgICAgICAgc2VsZi5fbmVlZFRvUG9sbFF1ZXJ5KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImNhY2hlZEJlZm9yZSBpbXBsaWVzIGVpdGhlciBvZiBwdWJsaXNoZWRCZWZvcmUgb3IgYnVmZmVyZWRCZWZvcmUgaXMgdHJ1ZS5cIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcbiAgX2ZldGNoTW9kaWZpZWREb2N1bWVudHM6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgTWV0ZW9yLl9ub1lpZWxkc0FsbG93ZWQoZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi5fcmVnaXN0ZXJQaGFzZUNoYW5nZShQSEFTRS5GRVRDSElORyk7XG4gICAgICAvLyBEZWZlciwgYmVjYXVzZSBub3RoaW5nIGNhbGxlZCBmcm9tIHRoZSBvcGxvZyBlbnRyeSBoYW5kbGVyIG1heSB5aWVsZCxcbiAgICAgIC8vIGJ1dCBmZXRjaCgpIHlpZWxkcy5cbiAgICAgIE1ldGVvci5kZWZlcihmaW5pc2hJZk5lZWRUb1BvbGxRdWVyeShmdW5jdGlvbiAoKSB7XG4gICAgICAgIHdoaWxlICghc2VsZi5fc3RvcHBlZCAmJiAhc2VsZi5fbmVlZFRvRmV0Y2guZW1wdHkoKSkge1xuICAgICAgICAgIGlmIChzZWxmLl9waGFzZSA9PT0gUEhBU0UuUVVFUllJTkcpIHtcbiAgICAgICAgICAgIC8vIFdoaWxlIGZldGNoaW5nLCB3ZSBkZWNpZGVkIHRvIGdvIGludG8gUVVFUllJTkcgbW9kZSwgYW5kIHRoZW4gd2VcbiAgICAgICAgICAgIC8vIHNhdyBhbm90aGVyIG9wbG9nIGVudHJ5LCBzbyBfbmVlZFRvRmV0Y2ggaXMgbm90IGVtcHR5LiBCdXQgd2VcbiAgICAgICAgICAgIC8vIHNob3VsZG4ndCBmZXRjaCB0aGVzZSBkb2N1bWVudHMgdW50aWwgQUZURVIgdGhlIHF1ZXJ5IGlzIGRvbmUuXG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBCZWluZyBpbiBzdGVhZHkgcGhhc2UgaGVyZSB3b3VsZCBiZSBzdXJwcmlzaW5nLlxuICAgICAgICAgIGlmIChzZWxmLl9waGFzZSAhPT0gUEhBU0UuRkVUQ0hJTkcpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJwaGFzZSBpbiBmZXRjaE1vZGlmaWVkRG9jdW1lbnRzOiBcIiArIHNlbGYuX3BoYXNlKTtcblxuICAgICAgICAgIHNlbGYuX2N1cnJlbnRseUZldGNoaW5nID0gc2VsZi5fbmVlZFRvRmV0Y2g7XG4gICAgICAgICAgdmFyIHRoaXNHZW5lcmF0aW9uID0gKytzZWxmLl9mZXRjaEdlbmVyYXRpb247XG4gICAgICAgICAgc2VsZi5fbmVlZFRvRmV0Y2ggPSBuZXcgTG9jYWxDb2xsZWN0aW9uLl9JZE1hcDtcbiAgICAgICAgICB2YXIgd2FpdGluZyA9IDA7XG4gICAgICAgICAgdmFyIGZ1dCA9IG5ldyBGdXR1cmU7XG4gICAgICAgICAgLy8gVGhpcyBsb29wIGlzIHNhZmUsIGJlY2F1c2UgX2N1cnJlbnRseUZldGNoaW5nIHdpbGwgbm90IGJlIHVwZGF0ZWRcbiAgICAgICAgICAvLyBkdXJpbmcgdGhpcyBsb29wIChpbiBmYWN0LCBpdCBpcyBuZXZlciBtdXRhdGVkKS5cbiAgICAgICAgICBzZWxmLl9jdXJyZW50bHlGZXRjaGluZy5mb3JFYWNoKGZ1bmN0aW9uIChvcCwgaWQpIHtcbiAgICAgICAgICAgIHdhaXRpbmcrKztcbiAgICAgICAgICAgIHNlbGYuX21vbmdvSGFuZGxlLl9kb2NGZXRjaGVyLmZldGNoKFxuICAgICAgICAgICAgICBzZWxmLl9jdXJzb3JEZXNjcmlwdGlvbi5jb2xsZWN0aW9uTmFtZSwgaWQsIG9wLFxuICAgICAgICAgICAgICBmaW5pc2hJZk5lZWRUb1BvbGxRdWVyeShmdW5jdGlvbiAoZXJyLCBkb2MpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICBNZXRlb3IuX2RlYnVnKFwiR290IGV4Y2VwdGlvbiB3aGlsZSBmZXRjaGluZyBkb2N1bWVudHNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnIpO1xuICAgICAgICAgICAgICAgICAgICAvLyBJZiB3ZSBnZXQgYW4gZXJyb3IgZnJvbSB0aGUgZmV0Y2hlciAoZWcsIHRyb3VibGVcbiAgICAgICAgICAgICAgICAgICAgLy8gY29ubmVjdGluZyB0byBNb25nbyksIGxldCdzIGp1c3QgYWJhbmRvbiB0aGUgZmV0Y2ggcGhhc2VcbiAgICAgICAgICAgICAgICAgICAgLy8gYWx0b2dldGhlciBhbmQgZmFsbCBiYWNrIHRvIHBvbGxpbmcuIEl0J3Mgbm90IGxpa2Ugd2UncmVcbiAgICAgICAgICAgICAgICAgICAgLy8gZ2V0dGluZyBsaXZlIHVwZGF0ZXMgYW55d2F5LlxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5fcGhhc2UgIT09IFBIQVNFLlFVRVJZSU5HKSB7XG4gICAgICAgICAgICAgICAgICAgICAgc2VsZi5fbmVlZFRvUG9sbFF1ZXJ5KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIXNlbGYuX3N0b3BwZWQgJiYgc2VsZi5fcGhhc2UgPT09IFBIQVNFLkZFVENISU5HXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIHNlbGYuX2ZldGNoR2VuZXJhdGlvbiA9PT0gdGhpc0dlbmVyYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gV2UgcmUtY2hlY2sgdGhlIGdlbmVyYXRpb24gaW4gY2FzZSB3ZSd2ZSBoYWQgYW4gZXhwbGljaXRcbiAgICAgICAgICAgICAgICAgICAgLy8gX3BvbGxRdWVyeSBjYWxsIChlZywgaW4gYW5vdGhlciBmaWJlcikgd2hpY2ggc2hvdWxkXG4gICAgICAgICAgICAgICAgICAgIC8vIGVmZmVjdGl2ZWx5IGNhbmNlbCB0aGlzIHJvdW5kIG9mIGZldGNoZXMuICAoX3BvbGxRdWVyeVxuICAgICAgICAgICAgICAgICAgICAvLyBpbmNyZW1lbnRzIHRoZSBnZW5lcmF0aW9uLilcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5faGFuZGxlRG9jKGlkLCBkb2MpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgICB3YWl0aW5nLS07XG4gICAgICAgICAgICAgICAgICAvLyBCZWNhdXNlIGZldGNoKCkgbmV2ZXIgY2FsbHMgaXRzIGNhbGxiYWNrIHN5bmNocm9ub3VzbHksXG4gICAgICAgICAgICAgICAgICAvLyB0aGlzIGlzIHNhZmUgKGllLCB3ZSB3b24ndCBjYWxsIGZ1dC5yZXR1cm4oKSBiZWZvcmUgdGhlXG4gICAgICAgICAgICAgICAgICAvLyBmb3JFYWNoIGlzIGRvbmUpLlxuICAgICAgICAgICAgICAgICAgaWYgKHdhaXRpbmcgPT09IDApXG4gICAgICAgICAgICAgICAgICAgIGZ1dC5yZXR1cm4oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBmdXQud2FpdCgpO1xuICAgICAgICAgIC8vIEV4aXQgbm93IGlmIHdlJ3ZlIGhhZCBhIF9wb2xsUXVlcnkgY2FsbCAoaGVyZSBvciBpbiBhbm90aGVyIGZpYmVyKS5cbiAgICAgICAgICBpZiAoc2VsZi5fcGhhc2UgPT09IFBIQVNFLlFVRVJZSU5HKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIHNlbGYuX2N1cnJlbnRseUZldGNoaW5nID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICAvLyBXZSdyZSBkb25lIGZldGNoaW5nLCBzbyB3ZSBjYW4gYmUgc3RlYWR5LCB1bmxlc3Mgd2UndmUgaGFkIGFcbiAgICAgICAgLy8gX3BvbGxRdWVyeSBjYWxsIChoZXJlIG9yIGluIGFub3RoZXIgZmliZXIpLlxuICAgICAgICBpZiAoc2VsZi5fcGhhc2UgIT09IFBIQVNFLlFVRVJZSU5HKVxuICAgICAgICAgIHNlbGYuX2JlU3RlYWR5KCk7XG4gICAgICB9KSk7XG4gICAgfSk7XG4gIH0sXG4gIF9iZVN0ZWFkeTogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBNZXRlb3IuX25vWWllbGRzQWxsb3dlZChmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLl9yZWdpc3RlclBoYXNlQ2hhbmdlKFBIQVNFLlNURUFEWSk7XG4gICAgICB2YXIgd3JpdGVzID0gc2VsZi5fd3JpdGVzVG9Db21taXRXaGVuV2VSZWFjaFN0ZWFkeTtcbiAgICAgIHNlbGYuX3dyaXRlc1RvQ29tbWl0V2hlbldlUmVhY2hTdGVhZHkgPSBbXTtcbiAgICAgIHNlbGYuX211bHRpcGxleGVyLm9uRmx1c2goZnVuY3Rpb24gKCkge1xuICAgICAgICBfLmVhY2god3JpdGVzLCBmdW5jdGlvbiAodykge1xuICAgICAgICAgIHcuY29tbWl0dGVkKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0sXG4gIF9oYW5kbGVPcGxvZ0VudHJ5UXVlcnlpbmc6IGZ1bmN0aW9uIChvcCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBNZXRlb3IuX25vWWllbGRzQWxsb3dlZChmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLl9uZWVkVG9GZXRjaC5zZXQoaWRGb3JPcChvcCksIG9wKTtcbiAgICB9KTtcbiAgfSxcbiAgX2hhbmRsZU9wbG9nRW50cnlTdGVhZHlPckZldGNoaW5nOiBmdW5jdGlvbiAob3ApIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgTWV0ZW9yLl9ub1lpZWxkc0FsbG93ZWQoZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGlkID0gaWRGb3JPcChvcCk7XG4gICAgICAvLyBJZiB3ZSdyZSBhbHJlYWR5IGZldGNoaW5nIHRoaXMgb25lLCBvciBhYm91dCB0bywgd2UgY2FuJ3Qgb3B0aW1pemU7XG4gICAgICAvLyBtYWtlIHN1cmUgdGhhdCB3ZSBmZXRjaCBpdCBhZ2FpbiBpZiBuZWNlc3NhcnkuXG4gICAgICBpZiAoc2VsZi5fcGhhc2UgPT09IFBIQVNFLkZFVENISU5HICYmXG4gICAgICAgICAgKChzZWxmLl9jdXJyZW50bHlGZXRjaGluZyAmJiBzZWxmLl9jdXJyZW50bHlGZXRjaGluZy5oYXMoaWQpKSB8fFxuICAgICAgICAgICBzZWxmLl9uZWVkVG9GZXRjaC5oYXMoaWQpKSkge1xuICAgICAgICBzZWxmLl9uZWVkVG9GZXRjaC5zZXQoaWQsIG9wKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAob3Aub3AgPT09ICdkJykge1xuICAgICAgICBpZiAoc2VsZi5fcHVibGlzaGVkLmhhcyhpZCkgfHxcbiAgICAgICAgICAgIChzZWxmLl9saW1pdCAmJiBzZWxmLl91bnB1Ymxpc2hlZEJ1ZmZlci5oYXMoaWQpKSlcbiAgICAgICAgICBzZWxmLl9yZW1vdmVNYXRjaGluZyhpZCk7XG4gICAgICB9IGVsc2UgaWYgKG9wLm9wID09PSAnaScpIHtcbiAgICAgICAgaWYgKHNlbGYuX3B1Ymxpc2hlZC5oYXMoaWQpKVxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImluc2VydCBmb3VuZCBmb3IgYWxyZWFkeS1leGlzdGluZyBJRCBpbiBwdWJsaXNoZWRcIik7XG4gICAgICAgIGlmIChzZWxmLl91bnB1Ymxpc2hlZEJ1ZmZlciAmJiBzZWxmLl91bnB1Ymxpc2hlZEJ1ZmZlci5oYXMoaWQpKVxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImluc2VydCBmb3VuZCBmb3IgYWxyZWFkeS1leGlzdGluZyBJRCBpbiBidWZmZXJcIik7XG5cbiAgICAgICAgLy8gWFhYIHdoYXQgaWYgc2VsZWN0b3IgeWllbGRzPyAgZm9yIG5vdyBpdCBjYW4ndCBidXQgbGF0ZXIgaXQgY291bGRcbiAgICAgICAgLy8gaGF2ZSAkd2hlcmVcbiAgICAgICAgaWYgKHNlbGYuX21hdGNoZXIuZG9jdW1lbnRNYXRjaGVzKG9wLm8pLnJlc3VsdClcbiAgICAgICAgICBzZWxmLl9hZGRNYXRjaGluZyhvcC5vKTtcbiAgICAgIH0gZWxzZSBpZiAob3Aub3AgPT09ICd1Jykge1xuICAgICAgICAgLy8gd2UgYXJlIG1hcHBpbmcgdGhlIG5ldyBvcGxvZyBmb3JtYXQgb24gbW9uZ28gNVxuICAgICAgICAvLyB0byB3aGF0IHdlIGtub3cgYmV0dGVyLCAkc2V0XG4gICAgICAgIG9wLm8gPSBvcGxvZ1YyVjFDb252ZXJ0ZXIob3AubylcbiAgICAgICAgLy8gSXMgdGhpcyBhIG1vZGlmaWVyICgkc2V0LyR1bnNldCwgd2hpY2ggbWF5IHJlcXVpcmUgdXMgdG8gcG9sbCB0aGVcbiAgICAgICAgLy8gZGF0YWJhc2UgdG8gZmlndXJlIG91dCBpZiB0aGUgd2hvbGUgZG9jdW1lbnQgbWF0Y2hlcyB0aGUgc2VsZWN0b3IpIG9yXG4gICAgICAgIC8vIGEgcmVwbGFjZW1lbnQgKGluIHdoaWNoIGNhc2Ugd2UgY2FuIGp1c3QgZGlyZWN0bHkgcmUtZXZhbHVhdGUgdGhlXG4gICAgICAgIC8vIHNlbGVjdG9yKT9cbiAgICAgICAgLy8gb3Bsb2cgZm9ybWF0IGhhcyBjaGFuZ2VkIG9uIG1vbmdvZGIgNSwgd2UgaGF2ZSB0byBzdXBwb3J0IGJvdGggbm93XG4gICAgICAgIC8vIGRpZmYgaXMgdGhlIGZvcm1hdCBpbiBNb25nbyA1KyAob3Bsb2cgdjIpXG4gICAgICAgIHZhciBpc1JlcGxhY2UgPSAhXy5oYXMob3AubywgJyRzZXQnKSAmJiAhXy5oYXMob3AubywgJ2RpZmYnKSAmJiAhXy5oYXMob3AubywgJyR1bnNldCcpOyBcbiAgICAgICAgLy8gSWYgdGhpcyBtb2RpZmllciBtb2RpZmllcyBzb21ldGhpbmcgaW5zaWRlIGFuIEVKU09OIGN1c3RvbSB0eXBlIChpZSxcbiAgICAgICAgLy8gYW55dGhpbmcgd2l0aCBFSlNPTiQpLCB0aGVuIHdlIGNhbid0IHRyeSB0byB1c2VcbiAgICAgICAgLy8gTG9jYWxDb2xsZWN0aW9uLl9tb2RpZnksIHNpbmNlIHRoYXQganVzdCBtdXRhdGVzIHRoZSBFSlNPTiBlbmNvZGluZyxcbiAgICAgICAgLy8gbm90IHRoZSBhY3R1YWwgb2JqZWN0LlxuICAgICAgICB2YXIgY2FuRGlyZWN0bHlNb2RpZnlEb2MgPVxuICAgICAgICAgICFpc1JlcGxhY2UgJiYgbW9kaWZpZXJDYW5CZURpcmVjdGx5QXBwbGllZChvcC5vKTtcblxuICAgICAgICB2YXIgcHVibGlzaGVkQmVmb3JlID0gc2VsZi5fcHVibGlzaGVkLmhhcyhpZCk7XG4gICAgICAgIHZhciBidWZmZXJlZEJlZm9yZSA9IHNlbGYuX2xpbWl0ICYmIHNlbGYuX3VucHVibGlzaGVkQnVmZmVyLmhhcyhpZCk7XG5cbiAgICAgICAgaWYgKGlzUmVwbGFjZSkge1xuICAgICAgICAgIHNlbGYuX2hhbmRsZURvYyhpZCwgXy5leHRlbmQoe19pZDogaWR9LCBvcC5vKSk7XG4gICAgICAgIH0gZWxzZSBpZiAoKHB1Ymxpc2hlZEJlZm9yZSB8fCBidWZmZXJlZEJlZm9yZSkgJiZcbiAgICAgICAgICAgICAgICAgICBjYW5EaXJlY3RseU1vZGlmeURvYykge1xuICAgICAgICAgIC8vIE9oIGdyZWF0LCB3ZSBhY3R1YWxseSBrbm93IHdoYXQgdGhlIGRvY3VtZW50IGlzLCBzbyB3ZSBjYW4gYXBwbHlcbiAgICAgICAgICAvLyB0aGlzIGRpcmVjdGx5LlxuICAgICAgICAgIHZhciBuZXdEb2MgPSBzZWxmLl9wdWJsaXNoZWQuaGFzKGlkKVxuICAgICAgICAgICAgPyBzZWxmLl9wdWJsaXNoZWQuZ2V0KGlkKSA6IHNlbGYuX3VucHVibGlzaGVkQnVmZmVyLmdldChpZCk7XG4gICAgICAgICAgbmV3RG9jID0gRUpTT04uY2xvbmUobmV3RG9jKTtcblxuICAgICAgICAgIG5ld0RvYy5faWQgPSBpZDtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgTG9jYWxDb2xsZWN0aW9uLl9tb2RpZnkobmV3RG9jLCBvcC5vKTtcbiAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBpZiAoZS5uYW1lICE9PSBcIk1pbmltb25nb0Vycm9yXCIpXG4gICAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgICAgICAvLyBXZSBkaWRuJ3QgdW5kZXJzdGFuZCB0aGUgbW9kaWZpZXIuICBSZS1mZXRjaC5cbiAgICAgICAgICAgIHNlbGYuX25lZWRUb0ZldGNoLnNldChpZCwgb3ApO1xuICAgICAgICAgICAgaWYgKHNlbGYuX3BoYXNlID09PSBQSEFTRS5TVEVBRFkpIHtcbiAgICAgICAgICAgICAgc2VsZi5fZmV0Y2hNb2RpZmllZERvY3VtZW50cygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzZWxmLl9oYW5kbGVEb2MoaWQsIHNlbGYuX3NoYXJlZFByb2plY3Rpb25GbihuZXdEb2MpKTtcbiAgICAgICAgfSBlbHNlIGlmICghY2FuRGlyZWN0bHlNb2RpZnlEb2MgfHxcbiAgICAgICAgICAgICAgICAgICBzZWxmLl9tYXRjaGVyLmNhbkJlY29tZVRydWVCeU1vZGlmaWVyKG9wLm8pIHx8XG4gICAgICAgICAgICAgICAgICAgKHNlbGYuX3NvcnRlciAmJiBzZWxmLl9zb3J0ZXIuYWZmZWN0ZWRCeU1vZGlmaWVyKG9wLm8pKSkge1xuICAgICAgICAgIHNlbGYuX25lZWRUb0ZldGNoLnNldChpZCwgb3ApO1xuICAgICAgICAgIGlmIChzZWxmLl9waGFzZSA9PT0gUEhBU0UuU1RFQURZKVxuICAgICAgICAgICAgc2VsZi5fZmV0Y2hNb2RpZmllZERvY3VtZW50cygpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBFcnJvcihcIlhYWCBTVVJQUklTSU5HIE9QRVJBVElPTjogXCIgKyBvcCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG4gIC8vIFlpZWxkcyFcbiAgX3J1bkluaXRpYWxRdWVyeTogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBpZiAoc2VsZi5fc3RvcHBlZClcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIm9wbG9nIHN0b3BwZWQgc3VycHJpc2luZ2x5IGVhcmx5XCIpO1xuXG4gICAgc2VsZi5fcnVuUXVlcnkoe2luaXRpYWw6IHRydWV9KTsgIC8vIHlpZWxkc1xuXG4gICAgaWYgKHNlbGYuX3N0b3BwZWQpXG4gICAgICByZXR1cm47ICAvLyBjYW4gaGFwcGVuIG9uIHF1ZXJ5RXJyb3JcblxuICAgIC8vIEFsbG93IG9ic2VydmVDaGFuZ2VzIGNhbGxzIHRvIHJldHVybi4gKEFmdGVyIHRoaXMsIGl0J3MgcG9zc2libGUgZm9yXG4gICAgLy8gc3RvcCgpIHRvIGJlIGNhbGxlZC4pXG4gICAgc2VsZi5fbXVsdGlwbGV4ZXIucmVhZHkoKTtcblxuICAgIHNlbGYuX2RvbmVRdWVyeWluZygpOyAgLy8geWllbGRzXG4gIH0sXG5cbiAgLy8gSW4gdmFyaW91cyBjaXJjdW1zdGFuY2VzLCB3ZSBtYXkganVzdCB3YW50IHRvIHN0b3AgcHJvY2Vzc2luZyB0aGUgb3Bsb2cgYW5kXG4gIC8vIHJlLXJ1biB0aGUgaW5pdGlhbCBxdWVyeSwganVzdCBhcyBpZiB3ZSB3ZXJlIGEgUG9sbGluZ09ic2VydmVEcml2ZXIuXG4gIC8vXG4gIC8vIFRoaXMgZnVuY3Rpb24gbWF5IG5vdCBibG9jaywgYmVjYXVzZSBpdCBpcyBjYWxsZWQgZnJvbSBhbiBvcGxvZyBlbnRyeVxuICAvLyBoYW5kbGVyLlxuICAvL1xuICAvLyBYWFggV2Ugc2hvdWxkIGNhbGwgdGhpcyB3aGVuIHdlIGRldGVjdCB0aGF0IHdlJ3ZlIGJlZW4gaW4gRkVUQ0hJTkcgZm9yIFwidG9vXG4gIC8vIGxvbmdcIi5cbiAgLy9cbiAgLy8gWFhYIFdlIHNob3VsZCBjYWxsIHRoaXMgd2hlbiB3ZSBkZXRlY3QgTW9uZ28gZmFpbG92ZXIgKHNpbmNlIHRoYXQgbWlnaHRcbiAgLy8gbWVhbiB0aGF0IHNvbWUgb2YgdGhlIG9wbG9nIGVudHJpZXMgd2UgaGF2ZSBwcm9jZXNzZWQgaGF2ZSBiZWVuIHJvbGxlZFxuICAvLyBiYWNrKS4gVGhlIE5vZGUgTW9uZ28gZHJpdmVyIGlzIGluIHRoZSBtaWRkbGUgb2YgYSBidW5jaCBvZiBodWdlXG4gIC8vIHJlZmFjdG9yaW5ncywgaW5jbHVkaW5nIHRoZSB3YXkgdGhhdCBpdCBub3RpZmllcyB5b3Ugd2hlbiBwcmltYXJ5XG4gIC8vIGNoYW5nZXMuIFdpbGwgcHV0IG9mZiBpbXBsZW1lbnRpbmcgdGhpcyB1bnRpbCBkcml2ZXIgMS40IGlzIG91dC5cbiAgX3BvbGxRdWVyeTogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBNZXRlb3IuX25vWWllbGRzQWxsb3dlZChmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoc2VsZi5fc3RvcHBlZClcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICAvLyBZYXksIHdlIGdldCB0byBmb3JnZXQgYWJvdXQgYWxsIHRoZSB0aGluZ3Mgd2UgdGhvdWdodCB3ZSBoYWQgdG8gZmV0Y2guXG4gICAgICBzZWxmLl9uZWVkVG9GZXRjaCA9IG5ldyBMb2NhbENvbGxlY3Rpb24uX0lkTWFwO1xuICAgICAgc2VsZi5fY3VycmVudGx5RmV0Y2hpbmcgPSBudWxsO1xuICAgICAgKytzZWxmLl9mZXRjaEdlbmVyYXRpb247ICAvLyBpZ25vcmUgYW55IGluLWZsaWdodCBmZXRjaGVzXG4gICAgICBzZWxmLl9yZWdpc3RlclBoYXNlQ2hhbmdlKFBIQVNFLlFVRVJZSU5HKTtcblxuICAgICAgLy8gRGVmZXIgc28gdGhhdCB3ZSBkb24ndCB5aWVsZC4gIFdlIGRvbid0IG5lZWQgZmluaXNoSWZOZWVkVG9Qb2xsUXVlcnlcbiAgICAgIC8vIGhlcmUgYmVjYXVzZSBTd2l0Y2hlZFRvUXVlcnkgaXMgbm90IHRocm93biBpbiBRVUVSWUlORyBtb2RlLlxuICAgICAgTWV0ZW9yLmRlZmVyKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2VsZi5fcnVuUXVlcnkoKTtcbiAgICAgICAgc2VsZi5fZG9uZVF1ZXJ5aW5nKCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSxcblxuICAvLyBZaWVsZHMhXG4gIF9ydW5RdWVyeTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgdmFyIG5ld1Jlc3VsdHMsIG5ld0J1ZmZlcjtcblxuICAgIC8vIFRoaXMgd2hpbGUgbG9vcCBpcyBqdXN0IHRvIHJldHJ5IGZhaWx1cmVzLlxuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAvLyBJZiB3ZSd2ZSBiZWVuIHN0b3BwZWQsIHdlIGRvbid0IGhhdmUgdG8gcnVuIGFueXRoaW5nIGFueSBtb3JlLlxuICAgICAgaWYgKHNlbGYuX3N0b3BwZWQpXG4gICAgICAgIHJldHVybjtcblxuICAgICAgbmV3UmVzdWx0cyA9IG5ldyBMb2NhbENvbGxlY3Rpb24uX0lkTWFwO1xuICAgICAgbmV3QnVmZmVyID0gbmV3IExvY2FsQ29sbGVjdGlvbi5fSWRNYXA7XG5cbiAgICAgIC8vIFF1ZXJ5IDJ4IGRvY3VtZW50cyBhcyB0aGUgaGFsZiBleGNsdWRlZCBmcm9tIHRoZSBvcmlnaW5hbCBxdWVyeSB3aWxsIGdvXG4gICAgICAvLyBpbnRvIHVucHVibGlzaGVkIGJ1ZmZlciB0byByZWR1Y2UgYWRkaXRpb25hbCBNb25nbyBsb29rdXBzIGluIGNhc2VzXG4gICAgICAvLyB3aGVuIGRvY3VtZW50cyBhcmUgcmVtb3ZlZCBmcm9tIHRoZSBwdWJsaXNoZWQgc2V0IGFuZCBuZWVkIGFcbiAgICAgIC8vIHJlcGxhY2VtZW50LlxuICAgICAgLy8gWFhYIG5lZWRzIG1vcmUgdGhvdWdodCBvbiBub24temVybyBza2lwXG4gICAgICAvLyBYWFggMiBpcyBhIFwibWFnaWMgbnVtYmVyXCIgbWVhbmluZyB0aGVyZSBpcyBhbiBleHRyYSBjaHVuayBvZiBkb2NzIGZvclxuICAgICAgLy8gYnVmZmVyIGlmIHN1Y2ggaXMgbmVlZGVkLlxuICAgICAgdmFyIGN1cnNvciA9IHNlbGYuX2N1cnNvckZvclF1ZXJ5KHsgbGltaXQ6IHNlbGYuX2xpbWl0ICogMiB9KTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGN1cnNvci5mb3JFYWNoKGZ1bmN0aW9uIChkb2MsIGkpIHsgIC8vIHlpZWxkc1xuICAgICAgICAgIGlmICghc2VsZi5fbGltaXQgfHwgaSA8IHNlbGYuX2xpbWl0KSB7XG4gICAgICAgICAgICBuZXdSZXN1bHRzLnNldChkb2MuX2lkLCBkb2MpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuZXdCdWZmZXIuc2V0KGRvYy5faWQsIGRvYyk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmIChvcHRpb25zLmluaXRpYWwgJiYgdHlwZW9mKGUuY29kZSkgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgLy8gVGhpcyBpcyBhbiBlcnJvciBkb2N1bWVudCBzZW50IHRvIHVzIGJ5IG1vbmdvZCwgbm90IGEgY29ubmVjdGlvblxuICAgICAgICAgIC8vIGVycm9yIGdlbmVyYXRlZCBieSB0aGUgY2xpZW50LiBBbmQgd2UndmUgbmV2ZXIgc2VlbiB0aGlzIHF1ZXJ5IHdvcmtcbiAgICAgICAgICAvLyBzdWNjZXNzZnVsbHkuIFByb2JhYmx5IGl0J3MgYSBiYWQgc2VsZWN0b3Igb3Igc29tZXRoaW5nLCBzbyB3ZVxuICAgICAgICAgIC8vIHNob3VsZCBOT1QgcmV0cnkuIEluc3RlYWQsIHdlIHNob3VsZCBoYWx0IHRoZSBvYnNlcnZlICh3aGljaCBlbmRzXG4gICAgICAgICAgLy8gdXAgY2FsbGluZyBgc3RvcGAgb24gdXMpLlxuICAgICAgICAgIHNlbGYuX211bHRpcGxleGVyLnF1ZXJ5RXJyb3IoZSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRHVyaW5nIGZhaWxvdmVyIChlZykgaWYgd2UgZ2V0IGFuIGV4Y2VwdGlvbiB3ZSBzaG91bGQgbG9nIGFuZCByZXRyeVxuICAgICAgICAvLyBpbnN0ZWFkIG9mIGNyYXNoaW5nLlxuICAgICAgICBNZXRlb3IuX2RlYnVnKFwiR290IGV4Y2VwdGlvbiB3aGlsZSBwb2xsaW5nIHF1ZXJ5XCIsIGUpO1xuICAgICAgICBNZXRlb3IuX3NsZWVwRm9yTXMoMTAwKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc2VsZi5fc3RvcHBlZClcbiAgICAgIHJldHVybjtcblxuICAgIHNlbGYuX3B1Ymxpc2hOZXdSZXN1bHRzKG5ld1Jlc3VsdHMsIG5ld0J1ZmZlcik7XG4gIH0sXG5cbiAgLy8gVHJhbnNpdGlvbnMgdG8gUVVFUllJTkcgYW5kIHJ1bnMgYW5vdGhlciBxdWVyeSwgb3IgKGlmIGFscmVhZHkgaW4gUVVFUllJTkcpXG4gIC8vIGVuc3VyZXMgdGhhdCB3ZSB3aWxsIHF1ZXJ5IGFnYWluIGxhdGVyLlxuICAvL1xuICAvLyBUaGlzIGZ1bmN0aW9uIG1heSBub3QgYmxvY2ssIGJlY2F1c2UgaXQgaXMgY2FsbGVkIGZyb20gYW4gb3Bsb2cgZW50cnlcbiAgLy8gaGFuZGxlci4gSG93ZXZlciwgaWYgd2Ugd2VyZSBub3QgYWxyZWFkeSBpbiB0aGUgUVVFUllJTkcgcGhhc2UsIGl0IHRocm93c1xuICAvLyBhbiBleGNlcHRpb24gdGhhdCBpcyBjYXVnaHQgYnkgdGhlIGNsb3Nlc3Qgc3Vycm91bmRpbmdcbiAgLy8gZmluaXNoSWZOZWVkVG9Qb2xsUXVlcnkgY2FsbDsgdGhpcyBlbnN1cmVzIHRoYXQgd2UgZG9uJ3QgY29udGludWUgcnVubmluZ1xuICAvLyBjbG9zZSB0aGF0IHdhcyBkZXNpZ25lZCBmb3IgYW5vdGhlciBwaGFzZSBpbnNpZGUgUEhBU0UuUVVFUllJTkcuXG4gIC8vXG4gIC8vIChJdCdzIGFsc28gbmVjZXNzYXJ5IHdoZW5ldmVyIGxvZ2ljIGluIHRoaXMgZmlsZSB5aWVsZHMgdG8gY2hlY2sgdGhhdCBvdGhlclxuICAvLyBwaGFzZXMgaGF2ZW4ndCBwdXQgdXMgaW50byBRVUVSWUlORyBtb2RlLCB0aG91Z2g7IGVnLFxuICAvLyBfZmV0Y2hNb2RpZmllZERvY3VtZW50cyBkb2VzIHRoaXMuKVxuICBfbmVlZFRvUG9sbFF1ZXJ5OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIE1ldGVvci5fbm9ZaWVsZHNBbGxvd2VkKGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChzZWxmLl9zdG9wcGVkKVxuICAgICAgICByZXR1cm47XG5cbiAgICAgIC8vIElmIHdlJ3JlIG5vdCBhbHJlYWR5IGluIHRoZSBtaWRkbGUgb2YgYSBxdWVyeSwgd2UgY2FuIHF1ZXJ5IG5vd1xuICAgICAgLy8gKHBvc3NpYmx5IHBhdXNpbmcgRkVUQ0hJTkcpLlxuICAgICAgaWYgKHNlbGYuX3BoYXNlICE9PSBQSEFTRS5RVUVSWUlORykge1xuICAgICAgICBzZWxmLl9wb2xsUXVlcnkoKTtcbiAgICAgICAgdGhyb3cgbmV3IFN3aXRjaGVkVG9RdWVyeTtcbiAgICAgIH1cblxuICAgICAgLy8gV2UncmUgY3VycmVudGx5IGluIFFVRVJZSU5HLiBTZXQgYSBmbGFnIHRvIGVuc3VyZSB0aGF0IHdlIHJ1biBhbm90aGVyXG4gICAgICAvLyBxdWVyeSB3aGVuIHdlJ3JlIGRvbmUuXG4gICAgICBzZWxmLl9yZXF1ZXJ5V2hlbkRvbmVUaGlzUXVlcnkgPSB0cnVlO1xuICAgIH0pO1xuICB9LFxuXG4gIC8vIFlpZWxkcyFcbiAgX2RvbmVRdWVyeWluZzogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIGlmIChzZWxmLl9zdG9wcGVkKVxuICAgICAgcmV0dXJuO1xuICAgIHNlbGYuX21vbmdvSGFuZGxlLl9vcGxvZ0hhbmRsZS53YWl0VW50aWxDYXVnaHRVcCgpOyAgLy8geWllbGRzXG4gICAgaWYgKHNlbGYuX3N0b3BwZWQpXG4gICAgICByZXR1cm47XG4gICAgaWYgKHNlbGYuX3BoYXNlICE9PSBQSEFTRS5RVUVSWUlORylcbiAgICAgIHRocm93IEVycm9yKFwiUGhhc2UgdW5leHBlY3RlZGx5IFwiICsgc2VsZi5fcGhhc2UpO1xuXG4gICAgTWV0ZW9yLl9ub1lpZWxkc0FsbG93ZWQoZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHNlbGYuX3JlcXVlcnlXaGVuRG9uZVRoaXNRdWVyeSkge1xuICAgICAgICBzZWxmLl9yZXF1ZXJ5V2hlbkRvbmVUaGlzUXVlcnkgPSBmYWxzZTtcbiAgICAgICAgc2VsZi5fcG9sbFF1ZXJ5KCk7XG4gICAgICB9IGVsc2UgaWYgKHNlbGYuX25lZWRUb0ZldGNoLmVtcHR5KCkpIHtcbiAgICAgICAgc2VsZi5fYmVTdGVhZHkoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNlbGYuX2ZldGNoTW9kaWZpZWREb2N1bWVudHMoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcblxuICBfY3Vyc29yRm9yUXVlcnk6IGZ1bmN0aW9uIChvcHRpb25zT3ZlcndyaXRlKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHJldHVybiBNZXRlb3IuX25vWWllbGRzQWxsb3dlZChmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBUaGUgcXVlcnkgd2UgcnVuIGlzIGFsbW9zdCB0aGUgc2FtZSBhcyB0aGUgY3Vyc29yIHdlIGFyZSBvYnNlcnZpbmcsXG4gICAgICAvLyB3aXRoIGEgZmV3IGNoYW5nZXMuIFdlIG5lZWQgdG8gcmVhZCBhbGwgdGhlIGZpZWxkcyB0aGF0IGFyZSByZWxldmFudCB0b1xuICAgICAgLy8gdGhlIHNlbGVjdG9yLCBub3QganVzdCB0aGUgZmllbGRzIHdlIGFyZSBnb2luZyB0byBwdWJsaXNoICh0aGF0J3MgdGhlXG4gICAgICAvLyBcInNoYXJlZFwiIHByb2plY3Rpb24pLiBBbmQgd2UgZG9uJ3Qgd2FudCB0byBhcHBseSBhbnkgdHJhbnNmb3JtIGluIHRoZVxuICAgICAgLy8gY3Vyc29yLCBiZWNhdXNlIG9ic2VydmVDaGFuZ2VzIHNob3VsZG4ndCB1c2UgdGhlIHRyYW5zZm9ybS5cbiAgICAgIHZhciBvcHRpb25zID0gXy5jbG9uZShzZWxmLl9jdXJzb3JEZXNjcmlwdGlvbi5vcHRpb25zKTtcblxuICAgICAgLy8gQWxsb3cgdGhlIGNhbGxlciB0byBtb2RpZnkgdGhlIG9wdGlvbnMuIFVzZWZ1bCB0byBzcGVjaWZ5IGRpZmZlcmVudFxuICAgICAgLy8gc2tpcCBhbmQgbGltaXQgdmFsdWVzLlxuICAgICAgXy5leHRlbmQob3B0aW9ucywgb3B0aW9uc092ZXJ3cml0ZSk7XG5cbiAgICAgIG9wdGlvbnMuZmllbGRzID0gc2VsZi5fc2hhcmVkUHJvamVjdGlvbjtcbiAgICAgIGRlbGV0ZSBvcHRpb25zLnRyYW5zZm9ybTtcbiAgICAgIC8vIFdlIGFyZSBOT1QgZGVlcCBjbG9uaW5nIGZpZWxkcyBvciBzZWxlY3RvciBoZXJlLCB3aGljaCBzaG91bGQgYmUgT0suXG4gICAgICB2YXIgZGVzY3JpcHRpb24gPSBuZXcgQ3Vyc29yRGVzY3JpcHRpb24oXG4gICAgICAgIHNlbGYuX2N1cnNvckRlc2NyaXB0aW9uLmNvbGxlY3Rpb25OYW1lLFxuICAgICAgICBzZWxmLl9jdXJzb3JEZXNjcmlwdGlvbi5zZWxlY3RvcixcbiAgICAgICAgb3B0aW9ucyk7XG4gICAgICByZXR1cm4gbmV3IEN1cnNvcihzZWxmLl9tb25nb0hhbmRsZSwgZGVzY3JpcHRpb24pO1xuICAgIH0pO1xuICB9LFxuXG5cbiAgLy8gUmVwbGFjZSBzZWxmLl9wdWJsaXNoZWQgd2l0aCBuZXdSZXN1bHRzIChib3RoIGFyZSBJZE1hcHMpLCBpbnZva2luZyBvYnNlcnZlXG4gIC8vIGNhbGxiYWNrcyBvbiB0aGUgbXVsdGlwbGV4ZXIuXG4gIC8vIFJlcGxhY2Ugc2VsZi5fdW5wdWJsaXNoZWRCdWZmZXIgd2l0aCBuZXdCdWZmZXIuXG4gIC8vXG4gIC8vIFhYWCBUaGlzIGlzIHZlcnkgc2ltaWxhciB0byBMb2NhbENvbGxlY3Rpb24uX2RpZmZRdWVyeVVub3JkZXJlZENoYW5nZXMuIFdlXG4gIC8vIHNob3VsZCByZWFsbHk6IChhKSBVbmlmeSBJZE1hcCBhbmQgT3JkZXJlZERpY3QgaW50byBVbm9yZGVyZWQvT3JkZXJlZERpY3RcbiAgLy8gKGIpIFJld3JpdGUgZGlmZi5qcyB0byB1c2UgdGhlc2UgY2xhc3NlcyBpbnN0ZWFkIG9mIGFycmF5cyBhbmQgb2JqZWN0cy5cbiAgX3B1Ymxpc2hOZXdSZXN1bHRzOiBmdW5jdGlvbiAobmV3UmVzdWx0cywgbmV3QnVmZmVyKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIE1ldGVvci5fbm9ZaWVsZHNBbGxvd2VkKGZ1bmN0aW9uICgpIHtcblxuICAgICAgLy8gSWYgdGhlIHF1ZXJ5IGlzIGxpbWl0ZWQgYW5kIHRoZXJlIGlzIGEgYnVmZmVyLCBzaHV0IGRvd24gc28gaXQgZG9lc24ndFxuICAgICAgLy8gc3RheSBpbiBhIHdheS5cbiAgICAgIGlmIChzZWxmLl9saW1pdCkge1xuICAgICAgICBzZWxmLl91bnB1Ymxpc2hlZEJ1ZmZlci5jbGVhcigpO1xuICAgICAgfVxuXG4gICAgICAvLyBGaXJzdCByZW1vdmUgYW55dGhpbmcgdGhhdCdzIGdvbmUuIEJlIGNhcmVmdWwgbm90IHRvIG1vZGlmeVxuICAgICAgLy8gc2VsZi5fcHVibGlzaGVkIHdoaWxlIGl0ZXJhdGluZyBvdmVyIGl0LlxuICAgICAgdmFyIGlkc1RvUmVtb3ZlID0gW107XG4gICAgICBzZWxmLl9wdWJsaXNoZWQuZm9yRWFjaChmdW5jdGlvbiAoZG9jLCBpZCkge1xuICAgICAgICBpZiAoIW5ld1Jlc3VsdHMuaGFzKGlkKSlcbiAgICAgICAgICBpZHNUb1JlbW92ZS5wdXNoKGlkKTtcbiAgICAgIH0pO1xuICAgICAgXy5lYWNoKGlkc1RvUmVtb3ZlLCBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgc2VsZi5fcmVtb3ZlUHVibGlzaGVkKGlkKTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBOb3cgZG8gYWRkcyBhbmQgY2hhbmdlcy5cbiAgICAgIC8vIElmIHNlbGYgaGFzIGEgYnVmZmVyIGFuZCBsaW1pdCwgdGhlIG5ldyBmZXRjaGVkIHJlc3VsdCB3aWxsIGJlXG4gICAgICAvLyBsaW1pdGVkIGNvcnJlY3RseSBhcyB0aGUgcXVlcnkgaGFzIHNvcnQgc3BlY2lmaWVyLlxuICAgICAgbmV3UmVzdWx0cy5mb3JFYWNoKGZ1bmN0aW9uIChkb2MsIGlkKSB7XG4gICAgICAgIHNlbGYuX2hhbmRsZURvYyhpZCwgZG9jKTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBTYW5pdHktY2hlY2sgdGhhdCBldmVyeXRoaW5nIHdlIHRyaWVkIHRvIHB1dCBpbnRvIF9wdWJsaXNoZWQgZW5kZWQgdXBcbiAgICAgIC8vIHRoZXJlLlxuICAgICAgLy8gWFhYIGlmIHRoaXMgaXMgc2xvdywgcmVtb3ZlIGl0IGxhdGVyXG4gICAgICBpZiAoc2VsZi5fcHVibGlzaGVkLnNpemUoKSAhPT0gbmV3UmVzdWx0cy5zaXplKCkpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignVGhlIE1vbmdvIHNlcnZlciBhbmQgdGhlIE1ldGVvciBxdWVyeSBkaXNhZ3JlZSBvbiBob3cgJyArXG4gICAgICAgICAgJ21hbnkgZG9jdW1lbnRzIG1hdGNoIHlvdXIgcXVlcnkuIEN1cnNvciBkZXNjcmlwdGlvbjogJyxcbiAgICAgICAgICBzZWxmLl9jdXJzb3JEZXNjcmlwdGlvbik7XG4gICAgICAgIHRocm93IEVycm9yKFxuICAgICAgICAgIFwiVGhlIE1vbmdvIHNlcnZlciBhbmQgdGhlIE1ldGVvciBxdWVyeSBkaXNhZ3JlZSBvbiBob3cgXCIgK1xuICAgICAgICAgICAgXCJtYW55IGRvY3VtZW50cyBtYXRjaCB5b3VyIHF1ZXJ5LiBNYXliZSBpdCBpcyBoaXR0aW5nIGEgTW9uZ28gXCIgK1xuICAgICAgICAgICAgXCJlZGdlIGNhc2U/IFRoZSBxdWVyeSBpczogXCIgK1xuICAgICAgICAgICAgRUpTT04uc3RyaW5naWZ5KHNlbGYuX2N1cnNvckRlc2NyaXB0aW9uLnNlbGVjdG9yKSk7XG4gICAgICB9XG4gICAgICBzZWxmLl9wdWJsaXNoZWQuZm9yRWFjaChmdW5jdGlvbiAoZG9jLCBpZCkge1xuICAgICAgICBpZiAoIW5ld1Jlc3VsdHMuaGFzKGlkKSlcbiAgICAgICAgICB0aHJvdyBFcnJvcihcIl9wdWJsaXNoZWQgaGFzIGEgZG9jIHRoYXQgbmV3UmVzdWx0cyBkb2Vzbid0OyBcIiArIGlkKTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBGaW5hbGx5LCByZXBsYWNlIHRoZSBidWZmZXJcbiAgICAgIG5ld0J1ZmZlci5mb3JFYWNoKGZ1bmN0aW9uIChkb2MsIGlkKSB7XG4gICAgICAgIHNlbGYuX2FkZEJ1ZmZlcmVkKGlkLCBkb2MpO1xuICAgICAgfSk7XG5cbiAgICAgIHNlbGYuX3NhZmVBcHBlbmRUb0J1ZmZlciA9IG5ld0J1ZmZlci5zaXplKCkgPCBzZWxmLl9saW1pdDtcbiAgICB9KTtcbiAgfSxcblxuICAvLyBUaGlzIHN0b3AgZnVuY3Rpb24gaXMgaW52b2tlZCBmcm9tIHRoZSBvblN0b3Agb2YgdGhlIE9ic2VydmVNdWx0aXBsZXhlciwgc29cbiAgLy8gaXQgc2hvdWxkbid0IGFjdHVhbGx5IGJlIHBvc3NpYmxlIHRvIGNhbGwgaXQgdW50aWwgdGhlIG11bHRpcGxleGVyIGlzXG4gIC8vIHJlYWR5LlxuICAvL1xuICAvLyBJdCdzIGltcG9ydGFudCB0byBjaGVjayBzZWxmLl9zdG9wcGVkIGFmdGVyIGV2ZXJ5IGNhbGwgaW4gdGhpcyBmaWxlIHRoYXRcbiAgLy8gY2FuIHlpZWxkIVxuICBzdG9wOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIGlmIChzZWxmLl9zdG9wcGVkKVxuICAgICAgcmV0dXJuO1xuICAgIHNlbGYuX3N0b3BwZWQgPSB0cnVlO1xuICAgIF8uZWFjaChzZWxmLl9zdG9wSGFuZGxlcywgZnVuY3Rpb24gKGhhbmRsZSkge1xuICAgICAgaGFuZGxlLnN0b3AoKTtcbiAgICB9KTtcblxuICAgIC8vIE5vdGU6IHdlICpkb24ndCogdXNlIG11bHRpcGxleGVyLm9uRmx1c2ggaGVyZSBiZWNhdXNlIHRoaXMgc3RvcFxuICAgIC8vIGNhbGxiYWNrIGlzIGFjdHVhbGx5IGludm9rZWQgYnkgdGhlIG11bHRpcGxleGVyIGl0c2VsZiB3aGVuIGl0IGhhc1xuICAgIC8vIGRldGVybWluZWQgdGhhdCB0aGVyZSBhcmUgbm8gaGFuZGxlcyBsZWZ0LiBTbyBub3RoaW5nIGlzIGFjdHVhbGx5IGdvaW5nXG4gICAgLy8gdG8gZ2V0IGZsdXNoZWQgKGFuZCBpdCdzIHByb2JhYmx5IG5vdCB2YWxpZCB0byBjYWxsIG1ldGhvZHMgb24gdGhlXG4gICAgLy8gZHlpbmcgbXVsdGlwbGV4ZXIpLlxuICAgIF8uZWFjaChzZWxmLl93cml0ZXNUb0NvbW1pdFdoZW5XZVJlYWNoU3RlYWR5LCBmdW5jdGlvbiAodykge1xuICAgICAgdy5jb21taXR0ZWQoKTsgIC8vIG1heWJlIHlpZWxkcz9cbiAgICB9KTtcbiAgICBzZWxmLl93cml0ZXNUb0NvbW1pdFdoZW5XZVJlYWNoU3RlYWR5ID0gbnVsbDtcblxuICAgIC8vIFByb2FjdGl2ZWx5IGRyb3AgcmVmZXJlbmNlcyB0byBwb3RlbnRpYWxseSBiaWcgdGhpbmdzLlxuICAgIHNlbGYuX3B1Ymxpc2hlZCA9IG51bGw7XG4gICAgc2VsZi5fdW5wdWJsaXNoZWRCdWZmZXIgPSBudWxsO1xuICAgIHNlbGYuX25lZWRUb0ZldGNoID0gbnVsbDtcbiAgICBzZWxmLl9jdXJyZW50bHlGZXRjaGluZyA9IG51bGw7XG4gICAgc2VsZi5fb3Bsb2dFbnRyeUhhbmRsZSA9IG51bGw7XG4gICAgc2VsZi5fbGlzdGVuZXJzSGFuZGxlID0gbnVsbDtcblxuICAgIFBhY2thZ2VbJ2ZhY3RzLWJhc2UnXSAmJiBQYWNrYWdlWydmYWN0cy1iYXNlJ10uRmFjdHMuaW5jcmVtZW50U2VydmVyRmFjdChcbiAgICAgIFwibW9uZ28tbGl2ZWRhdGFcIiwgXCJvYnNlcnZlLWRyaXZlcnMtb3Bsb2dcIiwgLTEpO1xuICB9LFxuXG4gIF9yZWdpc3RlclBoYXNlQ2hhbmdlOiBmdW5jdGlvbiAocGhhc2UpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgTWV0ZW9yLl9ub1lpZWxkc0FsbG93ZWQoZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIG5vdyA9IG5ldyBEYXRlO1xuXG4gICAgICBpZiAoc2VsZi5fcGhhc2UpIHtcbiAgICAgICAgdmFyIHRpbWVEaWZmID0gbm93IC0gc2VsZi5fcGhhc2VTdGFydFRpbWU7XG4gICAgICAgIFBhY2thZ2VbJ2ZhY3RzLWJhc2UnXSAmJiBQYWNrYWdlWydmYWN0cy1iYXNlJ10uRmFjdHMuaW5jcmVtZW50U2VydmVyRmFjdChcbiAgICAgICAgICBcIm1vbmdvLWxpdmVkYXRhXCIsIFwidGltZS1zcGVudC1pbi1cIiArIHNlbGYuX3BoYXNlICsgXCItcGhhc2VcIiwgdGltZURpZmYpO1xuICAgICAgfVxuXG4gICAgICBzZWxmLl9waGFzZSA9IHBoYXNlO1xuICAgICAgc2VsZi5fcGhhc2VTdGFydFRpbWUgPSBub3c7XG4gICAgfSk7XG4gIH1cbn0pO1xuXG4vLyBEb2VzIG91ciBvcGxvZyB0YWlsaW5nIGNvZGUgc3VwcG9ydCB0aGlzIGN1cnNvcj8gRm9yIG5vdywgd2UgYXJlIGJlaW5nIHZlcnlcbi8vIGNvbnNlcnZhdGl2ZSBhbmQgYWxsb3dpbmcgb25seSBzaW1wbGUgcXVlcmllcyB3aXRoIHNpbXBsZSBvcHRpb25zLlxuLy8gKFRoaXMgaXMgYSBcInN0YXRpYyBtZXRob2RcIi4pXG5PcGxvZ09ic2VydmVEcml2ZXIuY3Vyc29yU3VwcG9ydGVkID0gZnVuY3Rpb24gKGN1cnNvckRlc2NyaXB0aW9uLCBtYXRjaGVyKSB7XG4gIC8vIEZpcnN0LCBjaGVjayB0aGUgb3B0aW9ucy5cbiAgdmFyIG9wdGlvbnMgPSBjdXJzb3JEZXNjcmlwdGlvbi5vcHRpb25zO1xuXG4gIC8vIERpZCB0aGUgdXNlciBzYXkgbm8gZXhwbGljaXRseT9cbiAgLy8gdW5kZXJzY29yZWQgdmVyc2lvbiBvZiB0aGUgb3B0aW9uIGlzIENPTVBBVCB3aXRoIDEuMlxuICBpZiAob3B0aW9ucy5kaXNhYmxlT3Bsb2cgfHwgb3B0aW9ucy5fZGlzYWJsZU9wbG9nKVxuICAgIHJldHVybiBmYWxzZTtcblxuICAvLyBza2lwIGlzIG5vdCBzdXBwb3J0ZWQ6IHRvIHN1cHBvcnQgaXQgd2Ugd291bGQgbmVlZCB0byBrZWVwIHRyYWNrIG9mIGFsbFxuICAvLyBcInNraXBwZWRcIiBkb2N1bWVudHMgb3IgYXQgbGVhc3QgdGhlaXIgaWRzLlxuICAvLyBsaW1pdCB3L28gYSBzb3J0IHNwZWNpZmllciBpcyBub3Qgc3VwcG9ydGVkOiBjdXJyZW50IGltcGxlbWVudGF0aW9uIG5lZWRzIGFcbiAgLy8gZGV0ZXJtaW5pc3RpYyB3YXkgdG8gb3JkZXIgZG9jdW1lbnRzLlxuICBpZiAob3B0aW9ucy5za2lwIHx8IChvcHRpb25zLmxpbWl0ICYmICFvcHRpb25zLnNvcnQpKSByZXR1cm4gZmFsc2U7XG5cbiAgLy8gSWYgYSBmaWVsZHMgcHJvamVjdGlvbiBvcHRpb24gaXMgZ2l2ZW4gY2hlY2sgaWYgaXQgaXMgc3VwcG9ydGVkIGJ5XG4gIC8vIG1pbmltb25nbyAoc29tZSBvcGVyYXRvcnMgYXJlIG5vdCBzdXBwb3J0ZWQpLlxuICBpZiAob3B0aW9ucy5maWVsZHMpIHtcbiAgICB0cnkge1xuICAgICAgTG9jYWxDb2xsZWN0aW9uLl9jaGVja1N1cHBvcnRlZFByb2plY3Rpb24ob3B0aW9ucy5maWVsZHMpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGlmIChlLm5hbWUgPT09IFwiTWluaW1vbmdvRXJyb3JcIikge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIFdlIGRvbid0IGFsbG93IHRoZSBmb2xsb3dpbmcgc2VsZWN0b3JzOlxuICAvLyAgIC0gJHdoZXJlIChub3QgY29uZmlkZW50IHRoYXQgd2UgcHJvdmlkZSB0aGUgc2FtZSBKUyBlbnZpcm9ubWVudFxuICAvLyAgICAgICAgICAgICBhcyBNb25nbywgYW5kIGNhbiB5aWVsZCEpXG4gIC8vICAgLSAkbmVhciAoaGFzIFwiaW50ZXJlc3RpbmdcIiBwcm9wZXJ0aWVzIGluIE1vbmdvREIsIGxpa2UgdGhlIHBvc3NpYmlsaXR5XG4gIC8vICAgICAgICAgICAgb2YgcmV0dXJuaW5nIGFuIElEIG11bHRpcGxlIHRpbWVzLCB0aG91Z2ggZXZlbiBwb2xsaW5nIG1heWJlXG4gIC8vICAgICAgICAgICAgaGF2ZSBhIGJ1ZyB0aGVyZSlcbiAgLy8gICAgICAgICAgIFhYWDogb25jZSB3ZSBzdXBwb3J0IGl0LCB3ZSB3b3VsZCBuZWVkIHRvIHRoaW5rIG1vcmUgb24gaG93IHdlXG4gIC8vICAgICAgICAgICBpbml0aWFsaXplIHRoZSBjb21wYXJhdG9ycyB3aGVuIHdlIGNyZWF0ZSB0aGUgZHJpdmVyLlxuICByZXR1cm4gIW1hdGNoZXIuaGFzV2hlcmUoKSAmJiAhbWF0Y2hlci5oYXNHZW9RdWVyeSgpO1xufTtcblxudmFyIG1vZGlmaWVyQ2FuQmVEaXJlY3RseUFwcGxpZWQgPSBmdW5jdGlvbiAobW9kaWZpZXIpIHtcbiAgcmV0dXJuIF8uYWxsKG1vZGlmaWVyLCBmdW5jdGlvbiAoZmllbGRzLCBvcGVyYXRpb24pIHtcbiAgICByZXR1cm4gXy5hbGwoZmllbGRzLCBmdW5jdGlvbiAodmFsdWUsIGZpZWxkKSB7XG4gICAgICByZXR1cm4gIS9FSlNPTlxcJC8udGVzdChmaWVsZCk7XG4gICAgfSk7XG4gIH0pO1xufTtcblxuTW9uZ29JbnRlcm5hbHMuT3Bsb2dPYnNlcnZlRHJpdmVyID0gT3Bsb2dPYnNlcnZlRHJpdmVyO1xuIiwiXG5cbmZ1bmN0aW9uIGpvaW4ocHJlZml4LCBrZXkpIHtcbiAgICByZXR1cm4gcHJlZml4ID8gYCR7cHJlZml4fS4ke2tleX1gIDoga2V5O1xufVxuXG5jb25zdCBhcnJheU9wZXJhdG9yS2V5UmVnZXggPSAvXihhfFtzdV1cXGQrKSQvO1xuXG5mdW5jdGlvbiBpc0FycmF5T3BlcmF0b3JLZXkoZmllbGQpIHtcbiAgICByZXR1cm4gYXJyYXlPcGVyYXRvcktleVJlZ2V4LnRlc3QoZmllbGQpO1xufVxuXG5mdW5jdGlvbiBpc0FycmF5T3BlcmF0b3Iob3BlcmF0b3IpIHtcbiAgICByZXR1cm4gb3BlcmF0b3IuYSA9PT0gdHJ1ZSAmJiBPYmplY3Qua2V5cyhvcGVyYXRvcikuZXZlcnkoaXNBcnJheU9wZXJhdG9yS2V5KTtcbn1cblxuZnVuY3Rpb24gZmxhdHRlbk9iamVjdEludG8odGFyZ2V0LCBzb3VyY2UsIHByZWZpeCkge1xuICAgIGlmIChBcnJheS5pc0FycmF5KHNvdXJjZSkgfHwgdHlwZW9mIHNvdXJjZSAhPT0gJ29iamVjdCcgfHwgc291cmNlID09PSBudWxsIHx8XG4gICAgICAgIHNvdXJjZSBpbnN0YW5jZW9mIE1vbmdvLk9iamVjdElEKSB7XG4gICAgICAgIHRhcmdldFtwcmVmaXhdID0gc291cmNlO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGVudHJpZXMgPSBPYmplY3QuZW50cmllcyhzb3VyY2UpO1xuICAgICAgICBpZiAoZW50cmllcy5sZW5ndGgpIHtcbiAgICAgICAgZW50cmllcy5mb3JFYWNoKChba2V5LCB2YWx1ZV0pID0+IHtcbiAgICAgICAgICAgIGZsYXR0ZW5PYmplY3RJbnRvKHRhcmdldCwgdmFsdWUsIGpvaW4ocHJlZml4LCBrZXkpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRhcmdldFtwcmVmaXhdID0gc291cmNlO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5jb25zdCBsb2dEZWJ1Z01lc3NhZ2VzID0gISFwcm9jZXNzLmVudi5PUExPR19DT05WRVJURVJfREVCVUc7XG5cbmZ1bmN0aW9uIGNvbnZlcnRPcGxvZ0RpZmYob3Bsb2dFbnRyeSwgZGlmZiwgcHJlZml4KSB7XG4gICAgaWYgKGxvZ0RlYnVnTWVzc2FnZXMpIHtcbiAgICAgICAgY29uc29sZS5sb2coYGNvbnZlcnRPcGxvZ0RpZmYoJHtKU09OLnN0cmluZ2lmeShvcGxvZ0VudHJ5KX0sICR7SlNPTi5zdHJpbmdpZnkoZGlmZil9LCAke0pTT04uc3RyaW5naWZ5KHByZWZpeCl9KWApO1xuICAgIH1cblxuICAgIE9iamVjdC5lbnRyaWVzKGRpZmYpLmZvckVhY2goKFtkaWZmS2V5LCB2YWx1ZV0pID0+IHtcbiAgICAgICAgaWYgKGRpZmZLZXkgPT09ICdkJykge1xuICAgICAgICAvLyBIYW5kbGUgYCR1bnNldGBzLlxuICAgICAgICBpZiAob3Bsb2dFbnRyeS4kdW5zZXQgPT09IG51bGwgfHwgb3Bsb2dFbnRyeS4kdW5zZXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgb3Bsb2dFbnRyeS4kdW5zZXQgPSB7fTtcbiAgICAgICAgfVxuICAgICAgICBPYmplY3Qua2V5cyh2YWx1ZSkuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgICAgb3Bsb2dFbnRyeS4kdW5zZXRbam9pbihwcmVmaXgsIGtleSldID0gdHJ1ZTtcbiAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAoZGlmZktleSA9PT0gJ2knKSB7XG4gICAgICAgIC8vIEhhbmRsZSAocG90ZW50aWFsbHkpIG5lc3RlZCBgJHNldGBzLlxuICAgICAgICBpZiAob3Bsb2dFbnRyeS4kc2V0ID09PSBudWxsIHx8IG9wbG9nRW50cnkuJHNldCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBvcGxvZ0VudHJ5LiRzZXQgPSB7fTtcbiAgICAgICAgfVxuICAgICAgICBmbGF0dGVuT2JqZWN0SW50byhvcGxvZ0VudHJ5LiRzZXQsIHZhbHVlLCBwcmVmaXgpO1xuICAgICAgICB9IGVsc2UgaWYgKGRpZmZLZXkgPT09ICd1Jykge1xuICAgICAgICAvLyBIYW5kbGUgZmxhdCBgJHNldGBzLlxuICAgICAgICBpZiAob3Bsb2dFbnRyeS4kc2V0ID09PSBudWxsIHx8IG9wbG9nRW50cnkuJHNldCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBvcGxvZ0VudHJ5LiRzZXQgPSB7fTtcbiAgICAgICAgfVxuICAgICAgICBPYmplY3QuZW50cmllcyh2YWx1ZSkuZm9yRWFjaCgoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICAgICAgICBvcGxvZ0VudHJ5LiRzZXRbam9pbihwcmVmaXgsIGtleSldID0gdmFsdWU7XG4gICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBIYW5kbGUgcy1maWVsZHMuXG4gICAgICAgIGNvbnN0IGtleSA9IGRpZmZLZXkuc2xpY2UoMSk7XG4gICAgICAgIGlmIChpc0FycmF5T3BlcmF0b3IodmFsdWUpKSB7XG4gICAgICAgICAgICAvLyBBcnJheSBvcGVyYXRvci5cbiAgICAgICAgICAgIE9iamVjdC5lbnRyaWVzKHZhbHVlKS5mb3JFYWNoKChbcG9zaXRpb24sIHZhbHVlXSkgPT4ge1xuICAgICAgICAgICAgaWYgKHBvc2l0aW9uID09PSAnYScpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHBvc2l0aW9uS2V5ID0gam9pbihqb2luKHByZWZpeCwga2V5KSwgcG9zaXRpb24uc2xpY2UoMSkpO1xuICAgICAgICAgICAgaWYgKHBvc2l0aW9uWzBdID09PSAncycpIHtcbiAgICAgICAgICAgICAgICBjb252ZXJ0T3Bsb2dEaWZmKG9wbG9nRW50cnksIHZhbHVlLCBwb3NpdGlvbktleSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHZhbHVlID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgaWYgKG9wbG9nRW50cnkuJHVuc2V0ID09PSBudWxsIHx8IG9wbG9nRW50cnkuJHVuc2V0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBvcGxvZ0VudHJ5LiR1bnNldCA9IHt9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBvcGxvZ0VudHJ5LiR1bnNldFtwb3NpdGlvbktleV0gPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAob3Bsb2dFbnRyeS4kc2V0ID09PSBudWxsIHx8IG9wbG9nRW50cnkuJHNldCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgb3Bsb2dFbnRyeS4kc2V0ID0ge307XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG9wbG9nRW50cnkuJHNldFtwb3NpdGlvbktleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKGtleSkge1xuICAgICAgICAgICAgLy8gTmVzdGVkIG9iamVjdC5cbiAgICAgICAgICAgIGNvbnZlcnRPcGxvZ0RpZmYob3Bsb2dFbnRyeSwgdmFsdWUsIGpvaW4ocHJlZml4LCBrZXkpKTtcbiAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBvcGxvZ1YyVjFDb252ZXJ0ZXIob3Bsb2dFbnRyeSkge1xuICAvLyBQYXNzLXRocm91Z2ggdjEgYW5kIChwcm9iYWJseSkgaW52YWxpZCBlbnRyaWVzLlxuICBpZiAob3Bsb2dFbnRyeS4kdiAhPT0gMiB8fCAhb3Bsb2dFbnRyeS5kaWZmKSB7XG4gICAgcmV0dXJuIG9wbG9nRW50cnk7XG4gIH1cblxuICBjb25zdCBjb252ZXJ0ZWRPcGxvZ0VudHJ5ID0geyAkdjogMiB9O1xuICBjb252ZXJ0T3Bsb2dEaWZmKGNvbnZlcnRlZE9wbG9nRW50cnksIG9wbG9nRW50cnkuZGlmZiwgJycpO1xuICByZXR1cm4gY29udmVydGVkT3Bsb2dFbnRyeTtcbn0iLCIvLyBzaW5nbGV0b25cbmV4cG9ydCBjb25zdCBMb2NhbENvbGxlY3Rpb25Ecml2ZXIgPSBuZXcgKGNsYXNzIExvY2FsQ29sbGVjdGlvbkRyaXZlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMubm9Db25uQ29sbGVjdGlvbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICB9XG5cbiAgb3BlbihuYW1lLCBjb25uKSB7XG4gICAgaWYgKCEgbmFtZSkge1xuICAgICAgcmV0dXJuIG5ldyBMb2NhbENvbGxlY3Rpb247XG4gICAgfVxuXG4gICAgaWYgKCEgY29ubikge1xuICAgICAgcmV0dXJuIGVuc3VyZUNvbGxlY3Rpb24obmFtZSwgdGhpcy5ub0Nvbm5Db2xsZWN0aW9ucyk7XG4gICAgfVxuXG4gICAgaWYgKCEgY29ubi5fbW9uZ29fbGl2ZWRhdGFfY29sbGVjdGlvbnMpIHtcbiAgICAgIGNvbm4uX21vbmdvX2xpdmVkYXRhX2NvbGxlY3Rpb25zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICB9XG5cbiAgICAvLyBYWFggaXMgdGhlcmUgYSB3YXkgdG8ga2VlcCB0cmFjayBvZiBhIGNvbm5lY3Rpb24ncyBjb2xsZWN0aW9ucyB3aXRob3V0XG4gICAgLy8gZGFuZ2xpbmcgaXQgb2ZmIHRoZSBjb25uZWN0aW9uIG9iamVjdD9cbiAgICByZXR1cm4gZW5zdXJlQ29sbGVjdGlvbihuYW1lLCBjb25uLl9tb25nb19saXZlZGF0YV9jb2xsZWN0aW9ucyk7XG4gIH1cbn0pO1xuXG5mdW5jdGlvbiBlbnN1cmVDb2xsZWN0aW9uKG5hbWUsIGNvbGxlY3Rpb25zKSB7XG4gIHJldHVybiAobmFtZSBpbiBjb2xsZWN0aW9ucylcbiAgICA/IGNvbGxlY3Rpb25zW25hbWVdXG4gICAgOiBjb2xsZWN0aW9uc1tuYW1lXSA9IG5ldyBMb2NhbENvbGxlY3Rpb24obmFtZSk7XG59XG4iLCJNb25nb0ludGVybmFscy5SZW1vdGVDb2xsZWN0aW9uRHJpdmVyID0gZnVuY3Rpb24gKFxuICBtb25nb191cmwsIG9wdGlvbnMpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBzZWxmLm1vbmdvID0gbmV3IE1vbmdvQ29ubmVjdGlvbihtb25nb191cmwsIG9wdGlvbnMpO1xufTtcblxuXy5leHRlbmQoTW9uZ29JbnRlcm5hbHMuUmVtb3RlQ29sbGVjdGlvbkRyaXZlci5wcm90b3R5cGUsIHtcbiAgb3BlbjogZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIHJldCA9IHt9O1xuICAgIF8uZWFjaChcbiAgICAgIFsnZmluZCcsICdmaW5kT25lJywgJ2luc2VydCcsICd1cGRhdGUnLCAndXBzZXJ0JyxcbiAgICAgICAncmVtb3ZlJywgJ19lbnN1cmVJbmRleCcsICdfZHJvcEluZGV4JywgJ19jcmVhdGVDYXBwZWRDb2xsZWN0aW9uJyxcbiAgICAgICAnZHJvcENvbGxlY3Rpb24nLCAncmF3Q29sbGVjdGlvbiddLFxuICAgICAgZnVuY3Rpb24gKG0pIHtcbiAgICAgICAgcmV0W21dID0gXy5iaW5kKHNlbGYubW9uZ29bbV0sIHNlbGYubW9uZ28sIG5hbWUpO1xuICAgICAgfSk7XG4gICAgcmV0dXJuIHJldDtcbiAgfVxufSk7XG5cblxuLy8gQ3JlYXRlIHRoZSBzaW5nbGV0b24gUmVtb3RlQ29sbGVjdGlvbkRyaXZlciBvbmx5IG9uIGRlbWFuZCwgc28gd2Vcbi8vIG9ubHkgcmVxdWlyZSBNb25nbyBjb25maWd1cmF0aW9uIGlmIGl0J3MgYWN0dWFsbHkgdXNlZCAoZWcsIG5vdCBpZlxuLy8geW91J3JlIG9ubHkgdHJ5aW5nIHRvIHJlY2VpdmUgZGF0YSBmcm9tIGEgcmVtb3RlIEREUCBzZXJ2ZXIuKVxuTW9uZ29JbnRlcm5hbHMuZGVmYXVsdFJlbW90ZUNvbGxlY3Rpb25Ecml2ZXIgPSBfLm9uY2UoZnVuY3Rpb24gKCkge1xuICB2YXIgY29ubmVjdGlvbk9wdGlvbnMgPSB7fTtcblxuICB2YXIgbW9uZ29VcmwgPSBwcm9jZXNzLmVudi5NT05HT19VUkw7XG5cbiAgaWYgKHByb2Nlc3MuZW52Lk1PTkdPX09QTE9HX1VSTCkge1xuICAgIGNvbm5lY3Rpb25PcHRpb25zLm9wbG9nVXJsID0gcHJvY2Vzcy5lbnYuTU9OR09fT1BMT0dfVVJMO1xuICB9XG5cbiAgaWYgKCEgbW9uZ29VcmwpXG4gICAgdGhyb3cgbmV3IEVycm9yKFwiTU9OR09fVVJMIG11c3QgYmUgc2V0IGluIGVudmlyb25tZW50XCIpO1xuXG4gIHJldHVybiBuZXcgTW9uZ29JbnRlcm5hbHMuUmVtb3RlQ29sbGVjdGlvbkRyaXZlcihtb25nb1VybCwgY29ubmVjdGlvbk9wdGlvbnMpO1xufSk7XG4iLCIvLyBvcHRpb25zLmNvbm5lY3Rpb24sIGlmIGdpdmVuLCBpcyBhIExpdmVkYXRhQ2xpZW50IG9yIExpdmVkYXRhU2VydmVyXG4vLyBYWFggcHJlc2VudGx5IHRoZXJlIGlzIG5vIHdheSB0byBkZXN0cm95L2NsZWFuIHVwIGEgQ29sbGVjdGlvblxuXG4vKipcbiAqIEBzdW1tYXJ5IE5hbWVzcGFjZSBmb3IgTW9uZ29EQi1yZWxhdGVkIGl0ZW1zXG4gKiBAbmFtZXNwYWNlXG4gKi9cbk1vbmdvID0ge307XG5cbi8qKlxuICogQHN1bW1hcnkgQ29uc3RydWN0b3IgZm9yIGEgQ29sbGVjdGlvblxuICogQGxvY3VzIEFueXdoZXJlXG4gKiBAaW5zdGFuY2VuYW1lIGNvbGxlY3Rpb25cbiAqIEBjbGFzc1xuICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgVGhlIG5hbWUgb2YgdGhlIGNvbGxlY3Rpb24uICBJZiBudWxsLCBjcmVhdGVzIGFuIHVubWFuYWdlZCAodW5zeW5jaHJvbml6ZWQpIGxvY2FsIGNvbGxlY3Rpb24uXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucy5jb25uZWN0aW9uIFRoZSBzZXJ2ZXIgY29ubmVjdGlvbiB0aGF0IHdpbGwgbWFuYWdlIHRoaXMgY29sbGVjdGlvbi4gVXNlcyB0aGUgZGVmYXVsdCBjb25uZWN0aW9uIGlmIG5vdCBzcGVjaWZpZWQuICBQYXNzIHRoZSByZXR1cm4gdmFsdWUgb2YgY2FsbGluZyBbYEREUC5jb25uZWN0YF0oI2RkcF9jb25uZWN0KSB0byBzcGVjaWZ5IGEgZGlmZmVyZW50IHNlcnZlci4gUGFzcyBgbnVsbGAgdG8gc3BlY2lmeSBubyBjb25uZWN0aW9uLiBVbm1hbmFnZWQgKGBuYW1lYCBpcyBudWxsKSBjb2xsZWN0aW9ucyBjYW5ub3Qgc3BlY2lmeSBhIGNvbm5lY3Rpb24uXG4gKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5pZEdlbmVyYXRpb24gVGhlIG1ldGhvZCBvZiBnZW5lcmF0aW5nIHRoZSBgX2lkYCBmaWVsZHMgb2YgbmV3IGRvY3VtZW50cyBpbiB0aGlzIGNvbGxlY3Rpb24uICBQb3NzaWJsZSB2YWx1ZXM6XG5cbiAtICoqYCdTVFJJTkcnYCoqOiByYW5kb20gc3RyaW5nc1xuIC0gKipgJ01PTkdPJ2AqKjogIHJhbmRvbSBbYE1vbmdvLk9iamVjdElEYF0oI21vbmdvX29iamVjdF9pZCkgdmFsdWVzXG5cblRoZSBkZWZhdWx0IGlkIGdlbmVyYXRpb24gdGVjaG5pcXVlIGlzIGAnU1RSSU5HJ2AuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBvcHRpb25zLnRyYW5zZm9ybSBBbiBvcHRpb25hbCB0cmFuc2Zvcm1hdGlvbiBmdW5jdGlvbi4gRG9jdW1lbnRzIHdpbGwgYmUgcGFzc2VkIHRocm91Z2ggdGhpcyBmdW5jdGlvbiBiZWZvcmUgYmVpbmcgcmV0dXJuZWQgZnJvbSBgZmV0Y2hgIG9yIGBmaW5kT25lYCwgYW5kIGJlZm9yZSBiZWluZyBwYXNzZWQgdG8gY2FsbGJhY2tzIG9mIGBvYnNlcnZlYCwgYG1hcGAsIGBmb3JFYWNoYCwgYGFsbG93YCwgYW5kIGBkZW55YC4gVHJhbnNmb3JtcyBhcmUgKm5vdCogYXBwbGllZCBmb3IgdGhlIGNhbGxiYWNrcyBvZiBgb2JzZXJ2ZUNoYW5nZXNgIG9yIHRvIGN1cnNvcnMgcmV0dXJuZWQgZnJvbSBwdWJsaXNoIGZ1bmN0aW9ucy5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gb3B0aW9ucy5kZWZpbmVNdXRhdGlvbk1ldGhvZHMgU2V0IHRvIGBmYWxzZWAgdG8gc2tpcCBzZXR0aW5nIHVwIHRoZSBtdXRhdGlvbiBtZXRob2RzIHRoYXQgZW5hYmxlIGluc2VydC91cGRhdGUvcmVtb3ZlIGZyb20gY2xpZW50IGNvZGUuIERlZmF1bHQgYHRydWVgLlxuICovXG5Nb25nby5Db2xsZWN0aW9uID0gZnVuY3Rpb24gQ29sbGVjdGlvbihuYW1lLCBvcHRpb25zKSB7XG4gIGlmICghbmFtZSAmJiAobmFtZSAhPT0gbnVsbCkpIHtcbiAgICBNZXRlb3IuX2RlYnVnKFwiV2FybmluZzogY3JlYXRpbmcgYW5vbnltb3VzIGNvbGxlY3Rpb24uIEl0IHdpbGwgbm90IGJlIFwiICtcbiAgICAgICAgICAgICAgICAgIFwic2F2ZWQgb3Igc3luY2hyb25pemVkIG92ZXIgdGhlIG5ldHdvcmsuIChQYXNzIG51bGwgZm9yIFwiICtcbiAgICAgICAgICAgICAgICAgIFwidGhlIGNvbGxlY3Rpb24gbmFtZSB0byB0dXJuIG9mZiB0aGlzIHdhcm5pbmcuKVwiKTtcbiAgICBuYW1lID0gbnVsbDtcbiAgfVxuXG4gIGlmIChuYW1lICE9PSBudWxsICYmIHR5cGVvZiBuYW1lICE9PSBcInN0cmluZ1wiKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgXCJGaXJzdCBhcmd1bWVudCB0byBuZXcgTW9uZ28uQ29sbGVjdGlvbiBtdXN0IGJlIGEgc3RyaW5nIG9yIG51bGxcIik7XG4gIH1cblxuICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLm1ldGhvZHMpIHtcbiAgICAvLyBCYWNrd2FyZHMgY29tcGF0aWJpbGl0eSBoYWNrIHdpdGggb3JpZ2luYWwgc2lnbmF0dXJlICh3aGljaCBwYXNzZWRcbiAgICAvLyBcImNvbm5lY3Rpb25cIiBkaXJlY3RseSBpbnN0ZWFkIG9mIGluIG9wdGlvbnMuIChDb25uZWN0aW9ucyBtdXN0IGhhdmUgYSBcIm1ldGhvZHNcIlxuICAgIC8vIG1ldGhvZC4pXG4gICAgLy8gWFhYIHJlbW92ZSBiZWZvcmUgMS4wXG4gICAgb3B0aW9ucyA9IHtjb25uZWN0aW9uOiBvcHRpb25zfTtcbiAgfVxuICAvLyBCYWNrd2FyZHMgY29tcGF0aWJpbGl0eTogXCJjb25uZWN0aW9uXCIgdXNlZCB0byBiZSBjYWxsZWQgXCJtYW5hZ2VyXCIuXG4gIGlmIChvcHRpb25zICYmIG9wdGlvbnMubWFuYWdlciAmJiAhb3B0aW9ucy5jb25uZWN0aW9uKSB7XG4gICAgb3B0aW9ucy5jb25uZWN0aW9uID0gb3B0aW9ucy5tYW5hZ2VyO1xuICB9XG5cbiAgb3B0aW9ucyA9IHtcbiAgICBjb25uZWN0aW9uOiB1bmRlZmluZWQsXG4gICAgaWRHZW5lcmF0aW9uOiAnU1RSSU5HJyxcbiAgICB0cmFuc2Zvcm06IG51bGwsXG4gICAgX2RyaXZlcjogdW5kZWZpbmVkLFxuICAgIF9wcmV2ZW50QXV0b3B1Ymxpc2g6IGZhbHNlLFxuICAgICAgLi4ub3B0aW9ucyxcbiAgfTtcblxuICBzd2l0Y2ggKG9wdGlvbnMuaWRHZW5lcmF0aW9uKSB7XG4gIGNhc2UgJ01PTkdPJzpcbiAgICB0aGlzLl9tYWtlTmV3SUQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgc3JjID0gbmFtZSA/IEREUC5yYW5kb21TdHJlYW0oJy9jb2xsZWN0aW9uLycgKyBuYW1lKSA6IFJhbmRvbS5pbnNlY3VyZTtcbiAgICAgIHJldHVybiBuZXcgTW9uZ28uT2JqZWN0SUQoc3JjLmhleFN0cmluZygyNCkpO1xuICAgIH07XG4gICAgYnJlYWs7XG4gIGNhc2UgJ1NUUklORyc6XG4gIGRlZmF1bHQ6XG4gICAgdGhpcy5fbWFrZU5ld0lEID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHNyYyA9IG5hbWUgPyBERFAucmFuZG9tU3RyZWFtKCcvY29sbGVjdGlvbi8nICsgbmFtZSkgOiBSYW5kb20uaW5zZWN1cmU7XG4gICAgICByZXR1cm4gc3JjLmlkKCk7XG4gICAgfTtcbiAgICBicmVhaztcbiAgfVxuXG4gIHRoaXMuX3RyYW5zZm9ybSA9IExvY2FsQ29sbGVjdGlvbi53cmFwVHJhbnNmb3JtKG9wdGlvbnMudHJhbnNmb3JtKTtcblxuICBpZiAoISBuYW1lIHx8IG9wdGlvbnMuY29ubmVjdGlvbiA9PT0gbnVsbClcbiAgICAvLyBub3RlOiBuYW1lbGVzcyBjb2xsZWN0aW9ucyBuZXZlciBoYXZlIGEgY29ubmVjdGlvblxuICAgIHRoaXMuX2Nvbm5lY3Rpb24gPSBudWxsO1xuICBlbHNlIGlmIChvcHRpb25zLmNvbm5lY3Rpb24pXG4gICAgdGhpcy5fY29ubmVjdGlvbiA9IG9wdGlvbnMuY29ubmVjdGlvbjtcbiAgZWxzZSBpZiAoTWV0ZW9yLmlzQ2xpZW50KVxuICAgIHRoaXMuX2Nvbm5lY3Rpb24gPSBNZXRlb3IuY29ubmVjdGlvbjtcbiAgZWxzZVxuICAgIHRoaXMuX2Nvbm5lY3Rpb24gPSBNZXRlb3Iuc2VydmVyO1xuXG4gIGlmICghb3B0aW9ucy5fZHJpdmVyKSB7XG4gICAgLy8gWFhYIFRoaXMgY2hlY2sgYXNzdW1lcyB0aGF0IHdlYmFwcCBpcyBsb2FkZWQgc28gdGhhdCBNZXRlb3Iuc2VydmVyICE9PVxuICAgIC8vIG51bGwuIFdlIHNob3VsZCBmdWxseSBzdXBwb3J0IHRoZSBjYXNlIG9mIFwid2FudCB0byB1c2UgYSBNb25nby1iYWNrZWRcbiAgICAvLyBjb2xsZWN0aW9uIGZyb20gTm9kZSBjb2RlIHdpdGhvdXQgd2ViYXBwXCIsIGJ1dCB3ZSBkb24ndCB5ZXQuXG4gICAgLy8gI01ldGVvclNlcnZlck51bGxcbiAgICBpZiAobmFtZSAmJiB0aGlzLl9jb25uZWN0aW9uID09PSBNZXRlb3Iuc2VydmVyICYmXG4gICAgICAgIHR5cGVvZiBNb25nb0ludGVybmFscyAhPT0gXCJ1bmRlZmluZWRcIiAmJlxuICAgICAgICBNb25nb0ludGVybmFscy5kZWZhdWx0UmVtb3RlQ29sbGVjdGlvbkRyaXZlcikge1xuICAgICAgb3B0aW9ucy5fZHJpdmVyID0gTW9uZ29JbnRlcm5hbHMuZGVmYXVsdFJlbW90ZUNvbGxlY3Rpb25Ecml2ZXIoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgeyBMb2NhbENvbGxlY3Rpb25Ecml2ZXIgfSA9XG4gICAgICAgIHJlcXVpcmUoXCIuL2xvY2FsX2NvbGxlY3Rpb25fZHJpdmVyLmpzXCIpO1xuICAgICAgb3B0aW9ucy5fZHJpdmVyID0gTG9jYWxDb2xsZWN0aW9uRHJpdmVyO1xuICAgIH1cbiAgfVxuXG4gIHRoaXMuX2NvbGxlY3Rpb24gPSBvcHRpb25zLl9kcml2ZXIub3BlbihuYW1lLCB0aGlzLl9jb25uZWN0aW9uKTtcbiAgdGhpcy5fbmFtZSA9IG5hbWU7XG4gIHRoaXMuX2RyaXZlciA9IG9wdGlvbnMuX2RyaXZlcjtcblxuICB0aGlzLl9tYXliZVNldFVwUmVwbGljYXRpb24obmFtZSwgb3B0aW9ucyk7XG5cbiAgLy8gWFhYIGRvbid0IGRlZmluZSB0aGVzZSB1bnRpbCBhbGxvdyBvciBkZW55IGlzIGFjdHVhbGx5IHVzZWQgZm9yIHRoaXNcbiAgLy8gY29sbGVjdGlvbi4gQ291bGQgYmUgaGFyZCBpZiB0aGUgc2VjdXJpdHkgcnVsZXMgYXJlIG9ubHkgZGVmaW5lZCBvbiB0aGVcbiAgLy8gc2VydmVyLlxuICBpZiAob3B0aW9ucy5kZWZpbmVNdXRhdGlvbk1ldGhvZHMgIT09IGZhbHNlKSB7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuX2RlZmluZU11dGF0aW9uTWV0aG9kcyh7XG4gICAgICAgIHVzZUV4aXN0aW5nOiBvcHRpb25zLl9zdXBwcmVzc1NhbWVOYW1lRXJyb3IgPT09IHRydWVcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAvLyBUaHJvdyBhIG1vcmUgdW5kZXJzdGFuZGFibGUgZXJyb3Igb24gdGhlIHNlcnZlciBmb3Igc2FtZSBjb2xsZWN0aW9uIG5hbWVcbiAgICAgIGlmIChlcnJvci5tZXNzYWdlID09PSBgQSBtZXRob2QgbmFtZWQgJy8ke25hbWV9L2luc2VydCcgaXMgYWxyZWFkeSBkZWZpbmVkYClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGVyZSBpcyBhbHJlYWR5IGEgY29sbGVjdGlvbiBuYW1lZCBcIiR7bmFtZX1cImApO1xuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxuICB9XG5cbiAgLy8gYXV0b3B1Ymxpc2hcbiAgaWYgKFBhY2thZ2UuYXV0b3B1Ymxpc2ggJiZcbiAgICAgICEgb3B0aW9ucy5fcHJldmVudEF1dG9wdWJsaXNoICYmXG4gICAgICB0aGlzLl9jb25uZWN0aW9uICYmXG4gICAgICB0aGlzLl9jb25uZWN0aW9uLnB1Ymxpc2gpIHtcbiAgICB0aGlzLl9jb25uZWN0aW9uLnB1Ymxpc2gobnVsbCwgKCkgPT4gdGhpcy5maW5kKCksIHtcbiAgICAgIGlzX2F1dG86IHRydWUsXG4gICAgfSk7XG4gIH1cbn07XG5cbk9iamVjdC5hc3NpZ24oTW9uZ28uQ29sbGVjdGlvbi5wcm90b3R5cGUsIHtcbiAgX21heWJlU2V0VXBSZXBsaWNhdGlvbihuYW1lLCB7XG4gICAgX3N1cHByZXNzU2FtZU5hbWVFcnJvciA9IGZhbHNlXG4gIH0pIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBpZiAoISAoc2VsZi5fY29ubmVjdGlvbiAmJlxuICAgICAgICAgICBzZWxmLl9jb25uZWN0aW9uLnJlZ2lzdGVyU3RvcmUpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gT0ssIHdlJ3JlIGdvaW5nIHRvIGJlIGEgc2xhdmUsIHJlcGxpY2F0aW5nIHNvbWUgcmVtb3RlXG4gICAgLy8gZGF0YWJhc2UsIGV4Y2VwdCBwb3NzaWJseSB3aXRoIHNvbWUgdGVtcG9yYXJ5IGRpdmVyZ2VuY2Ugd2hpbGVcbiAgICAvLyB3ZSBoYXZlIHVuYWNrbm93bGVkZ2VkIFJQQydzLlxuICAgIGNvbnN0IG9rID0gc2VsZi5fY29ubmVjdGlvbi5yZWdpc3RlclN0b3JlKG5hbWUsIHtcbiAgICAgIC8vIENhbGxlZCBhdCB0aGUgYmVnaW5uaW5nIG9mIGEgYmF0Y2ggb2YgdXBkYXRlcy4gYmF0Y2hTaXplIGlzIHRoZSBudW1iZXJcbiAgICAgIC8vIG9mIHVwZGF0ZSBjYWxscyB0byBleHBlY3QuXG4gICAgICAvL1xuICAgICAgLy8gWFhYIFRoaXMgaW50ZXJmYWNlIGlzIHByZXR0eSBqYW5reS4gcmVzZXQgcHJvYmFibHkgb3VnaHQgdG8gZ28gYmFjayB0b1xuICAgICAgLy8gYmVpbmcgaXRzIG93biBmdW5jdGlvbiwgYW5kIGNhbGxlcnMgc2hvdWxkbid0IGhhdmUgdG8gY2FsY3VsYXRlXG4gICAgICAvLyBiYXRjaFNpemUuIFRoZSBvcHRpbWl6YXRpb24gb2Ygbm90IGNhbGxpbmcgcGF1c2UvcmVtb3ZlIHNob3VsZCBiZVxuICAgICAgLy8gZGVsYXllZCB1bnRpbCBsYXRlcjogdGhlIGZpcnN0IGNhbGwgdG8gdXBkYXRlKCkgc2hvdWxkIGJ1ZmZlciBpdHNcbiAgICAgIC8vIG1lc3NhZ2UsIGFuZCB0aGVuIHdlIGNhbiBlaXRoZXIgZGlyZWN0bHkgYXBwbHkgaXQgYXQgZW5kVXBkYXRlIHRpbWUgaWZcbiAgICAgIC8vIGl0IHdhcyB0aGUgb25seSB1cGRhdGUsIG9yIGRvIHBhdXNlT2JzZXJ2ZXJzL2FwcGx5L2FwcGx5IGF0IHRoZSBuZXh0XG4gICAgICAvLyB1cGRhdGUoKSBpZiB0aGVyZSdzIGFub3RoZXIgb25lLlxuICAgICAgYmVnaW5VcGRhdGUoYmF0Y2hTaXplLCByZXNldCkge1xuICAgICAgICAvLyBwYXVzZSBvYnNlcnZlcnMgc28gdXNlcnMgZG9uJ3Qgc2VlIGZsaWNrZXIgd2hlbiB1cGRhdGluZyBzZXZlcmFsXG4gICAgICAgIC8vIG9iamVjdHMgYXQgb25jZSAoaW5jbHVkaW5nIHRoZSBwb3N0LXJlY29ubmVjdCByZXNldC1hbmQtcmVhcHBseVxuICAgICAgICAvLyBzdGFnZSksIGFuZCBzbyB0aGF0IGEgcmUtc29ydGluZyBvZiBhIHF1ZXJ5IGNhbiB0YWtlIGFkdmFudGFnZSBvZiB0aGVcbiAgICAgICAgLy8gZnVsbCBfZGlmZlF1ZXJ5IG1vdmVkIGNhbGN1bGF0aW9uIGluc3RlYWQgb2YgYXBwbHlpbmcgY2hhbmdlIG9uZSBhdCBhXG4gICAgICAgIC8vIHRpbWUuXG4gICAgICAgIGlmIChiYXRjaFNpemUgPiAxIHx8IHJlc2V0KVxuICAgICAgICAgIHNlbGYuX2NvbGxlY3Rpb24ucGF1c2VPYnNlcnZlcnMoKTtcblxuICAgICAgICBpZiAocmVzZXQpXG4gICAgICAgICAgc2VsZi5fY29sbGVjdGlvbi5yZW1vdmUoe30pO1xuICAgICAgfSxcblxuICAgICAgLy8gQXBwbHkgYW4gdXBkYXRlLlxuICAgICAgLy8gWFhYIGJldHRlciBzcGVjaWZ5IHRoaXMgaW50ZXJmYWNlIChub3QgaW4gdGVybXMgb2YgYSB3aXJlIG1lc3NhZ2UpP1xuICAgICAgdXBkYXRlKG1zZykge1xuICAgICAgICBpZihNZXRlb3IuaXNDbGllbnQpe1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZighbXNnKXtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibW9uZ28gdXBkYXRlIG1lc3NhZ2UgaXMgdW5kZWZpbmVkLiBjb2xsZWN0aW9uIG5hbWUgaXMgXCIgKyBzZWxmLl9uYW1lKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yLCBtc2cpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciBtb25nb0lkID0gTW9uZ29JRC5pZFBhcnNlKG1zZy5pZCk7XG4gICAgICAgIHZhciBkb2MgPSBzZWxmLl9jb2xsZWN0aW9uLmZpbmRPbmUobW9uZ29JZCk7XG5cbiAgICAgICAgLy8gSXMgdGhpcyBhIFwicmVwbGFjZSB0aGUgd2hvbGUgZG9jXCIgbWVzc2FnZSBjb21pbmcgZnJvbSB0aGUgcXVpZXNjZW5jZVxuICAgICAgICAvLyBvZiBtZXRob2Qgd3JpdGVzIHRvIGFuIG9iamVjdD8gKE5vdGUgdGhhdCAndW5kZWZpbmVkJyBpcyBhIHZhbGlkXG4gICAgICAgIC8vIHZhbHVlIG1lYW5pbmcgXCJyZW1vdmUgaXRcIi4pXG4gICAgICAgIGlmIChtc2cubXNnID09PSAncmVwbGFjZScpIHtcbiAgICAgICAgICB2YXIgcmVwbGFjZSA9IG1zZy5yZXBsYWNlO1xuICAgICAgICAgIGlmICghcmVwbGFjZSkge1xuICAgICAgICAgICAgaWYgKGRvYylcbiAgICAgICAgICAgICAgc2VsZi5fY29sbGVjdGlvbi5yZW1vdmUobW9uZ29JZCk7XG4gICAgICAgICAgfSBlbHNlIGlmICghZG9jKSB7XG4gICAgICAgICAgICBzZWxmLl9jb2xsZWN0aW9uLmluc2VydChyZXBsYWNlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gWFhYIGNoZWNrIHRoYXQgcmVwbGFjZSBoYXMgbm8gJCBvcHNcbiAgICAgICAgICAgIHNlbGYuX2NvbGxlY3Rpb24udXBkYXRlKG1vbmdvSWQsIHJlcGxhY2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gZWxzZSBpZiAobXNnLm1zZyA9PT0gJ2FkZGVkJykge1xuICAgICAgICAgIGlmIChkb2MpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkV4cGVjdGVkIG5vdCB0byBmaW5kIGEgZG9jdW1lbnQgYWxyZWFkeSBwcmVzZW50IGZvciBhbiBhZGRcIik7XG4gICAgICAgICAgfVxuICAgICAgICAgIHNlbGYuX2NvbGxlY3Rpb24uaW5zZXJ0KHsgX2lkOiBtb25nb0lkLCAuLi5tc2cuZmllbGRzIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKG1zZy5tc2cgPT09ICdyZW1vdmVkJykge1xuICAgICAgICAgIGlmICghZG9jKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRXhwZWN0ZWQgdG8gZmluZCBhIGRvY3VtZW50IGFscmVhZHkgcHJlc2VudCBmb3IgcmVtb3ZlZFwiKTtcbiAgICAgICAgICBzZWxmLl9jb2xsZWN0aW9uLnJlbW92ZShtb25nb0lkKTtcbiAgICAgICAgfSBlbHNlIGlmIChtc2cubXNnID09PSAnY2hhbmdlZCcpIHtcbiAgICAgICAgICBpZiAoIWRvYylcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkV4cGVjdGVkIHRvIGZpbmQgYSBkb2N1bWVudCB0byBjaGFuZ2VcIik7XG4gICAgICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKG1zZy5maWVsZHMpO1xuICAgICAgICAgIGlmIChrZXlzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHZhciBtb2RpZmllciA9IHt9O1xuICAgICAgICAgICAga2V5cy5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gbXNnLmZpZWxkc1trZXldO1xuICAgICAgICAgICAgICBpZiAoRUpTT04uZXF1YWxzKGRvY1trZXldLCB2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgIGlmICghbW9kaWZpZXIuJHVuc2V0KSB7XG4gICAgICAgICAgICAgICAgICBtb2RpZmllci4kdW5zZXQgPSB7fTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbW9kaWZpZXIuJHVuc2V0W2tleV0gPSAxO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICghbW9kaWZpZXIuJHNldCkge1xuICAgICAgICAgICAgICAgICAgbW9kaWZpZXIuJHNldCA9IHt9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBtb2RpZmllci4kc2V0W2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoT2JqZWN0LmtleXMobW9kaWZpZXIpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgc2VsZi5fY29sbGVjdGlvbi51cGRhdGUobW9uZ29JZCwgbW9kaWZpZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJIGRvbid0IGtub3cgaG93IHRvIGRlYWwgd2l0aCB0aGlzIG1lc3NhZ2VcIik7XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIC8vIENhbGxlZCBhdCB0aGUgZW5kIG9mIGEgYmF0Y2ggb2YgdXBkYXRlcy5cbiAgICAgIGVuZFVwZGF0ZSgpIHtcbiAgICAgICAgc2VsZi5fY29sbGVjdGlvbi5yZXN1bWVPYnNlcnZlcnMoKTtcbiAgICAgIH0sXG5cbiAgICAgIC8vIENhbGxlZCBhcm91bmQgbWV0aG9kIHN0dWIgaW52b2NhdGlvbnMgdG8gY2FwdHVyZSB0aGUgb3JpZ2luYWwgdmVyc2lvbnNcbiAgICAgIC8vIG9mIG1vZGlmaWVkIGRvY3VtZW50cy5cbiAgICAgIHNhdmVPcmlnaW5hbHMoKSB7XG4gICAgICAgIHNlbGYuX2NvbGxlY3Rpb24uc2F2ZU9yaWdpbmFscygpO1xuICAgICAgfSxcbiAgICAgIHJldHJpZXZlT3JpZ2luYWxzKCkge1xuICAgICAgICByZXR1cm4gc2VsZi5fY29sbGVjdGlvbi5yZXRyaWV2ZU9yaWdpbmFscygpO1xuICAgICAgfSxcblxuICAgICAgLy8gVXNlZCB0byBwcmVzZXJ2ZSBjdXJyZW50IHZlcnNpb25zIG9mIGRvY3VtZW50cyBhY3Jvc3MgYSBzdG9yZSByZXNldC5cbiAgICAgIGdldERvYyhpZCkge1xuICAgICAgICByZXR1cm4gc2VsZi5maW5kT25lKGlkKTtcbiAgICAgIH0sXG5cbiAgICAgIC8vIFRvIGJlIGFibGUgdG8gZ2V0IGJhY2sgdG8gdGhlIGNvbGxlY3Rpb24gZnJvbSB0aGUgc3RvcmUuXG4gICAgICBfZ2V0Q29sbGVjdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHNlbGY7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAoISBvaykge1xuICAgICAgY29uc3QgbWVzc2FnZSA9IGBUaGVyZSBpcyBhbHJlYWR5IGEgY29sbGVjdGlvbiBuYW1lZCBcIiR7bmFtZX1cImA7XG4gICAgICBpZiAoX3N1cHByZXNzU2FtZU5hbWVFcnJvciA9PT0gdHJ1ZSkge1xuICAgICAgICAvLyBYWFggSW4gdGhlb3J5IHdlIGRvIG5vdCBoYXZlIHRvIHRocm93IHdoZW4gYG9rYCBpcyBmYWxzeS4gVGhlXG4gICAgICAgIC8vIHN0b3JlIGlzIGFscmVhZHkgZGVmaW5lZCBmb3IgdGhpcyBjb2xsZWN0aW9uIG5hbWUsIGJ1dCB0aGlzXG4gICAgICAgIC8vIHdpbGwgc2ltcGx5IGJlIGFub3RoZXIgcmVmZXJlbmNlIHRvIGl0IGFuZCBldmVyeXRoaW5nIHNob3VsZFxuICAgICAgICAvLyB3b3JrLiBIb3dldmVyLCB3ZSBoYXZlIGhpc3RvcmljYWxseSB0aHJvd24gYW4gZXJyb3IgaGVyZSwgc29cbiAgICAgICAgLy8gZm9yIG5vdyB3ZSB3aWxsIHNraXAgdGhlIGVycm9yIG9ubHkgd2hlbiBfc3VwcHJlc3NTYW1lTmFtZUVycm9yXG4gICAgICAgIC8vIGlzIGB0cnVlYCwgYWxsb3dpbmcgcGVvcGxlIHRvIG9wdCBpbiBhbmQgZ2l2ZSB0aGlzIHNvbWUgcmVhbFxuICAgICAgICAvLyB3b3JsZCB0ZXN0aW5nLlxuICAgICAgICBjb25zb2xlLndhcm4gPyBjb25zb2xlLndhcm4obWVzc2FnZSkgOiBjb25zb2xlLmxvZyhtZXNzYWdlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgLy8vXG4gIC8vLyBNYWluIGNvbGxlY3Rpb24gQVBJXG4gIC8vL1xuXG4gIF9nZXRGaW5kU2VsZWN0b3IoYXJncykge1xuICAgIGlmIChhcmdzLmxlbmd0aCA9PSAwKVxuICAgICAgcmV0dXJuIHt9O1xuICAgIGVsc2VcbiAgICAgIHJldHVybiBhcmdzWzBdO1xuICB9LFxuXG4gIF9nZXRGaW5kT3B0aW9ucyhhcmdzKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIGlmIChhcmdzLmxlbmd0aCA8IDIpIHtcbiAgICAgIHJldHVybiB7IHRyYW5zZm9ybTogc2VsZi5fdHJhbnNmb3JtIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIGNoZWNrKGFyZ3NbMV0sIE1hdGNoLk9wdGlvbmFsKE1hdGNoLk9iamVjdEluY2x1ZGluZyh7XG4gICAgICAgIGZpZWxkczogTWF0Y2guT3B0aW9uYWwoTWF0Y2guT25lT2YoT2JqZWN0LCB1bmRlZmluZWQpKSxcbiAgICAgICAgc29ydDogTWF0Y2guT3B0aW9uYWwoTWF0Y2guT25lT2YoT2JqZWN0LCBBcnJheSwgRnVuY3Rpb24sIHVuZGVmaW5lZCkpLFxuICAgICAgICBsaW1pdDogTWF0Y2guT3B0aW9uYWwoTWF0Y2guT25lT2YoTnVtYmVyLCB1bmRlZmluZWQpKSxcbiAgICAgICAgc2tpcDogTWF0Y2guT3B0aW9uYWwoTWF0Y2guT25lT2YoTnVtYmVyLCB1bmRlZmluZWQpKVxuICAgICAgfSkpKTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdHJhbnNmb3JtOiBzZWxmLl90cmFuc2Zvcm0sXG4gICAgICAgIC4uLmFyZ3NbMV0sXG4gICAgICB9O1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogQHN1bW1hcnkgRmluZCB0aGUgZG9jdW1lbnRzIGluIGEgY29sbGVjdGlvbiB0aGF0IG1hdGNoIHRoZSBzZWxlY3Rvci5cbiAgICogQGxvY3VzIEFueXdoZXJlXG4gICAqIEBtZXRob2QgZmluZFxuICAgKiBAbWVtYmVyb2YgTW9uZ28uQ29sbGVjdGlvblxuICAgKiBAaW5zdGFuY2VcbiAgICogQHBhcmFtIHtNb25nb1NlbGVjdG9yfSBbc2VsZWN0b3JdIEEgcXVlcnkgZGVzY3JpYmluZyB0aGUgZG9jdW1lbnRzIHRvIGZpbmRcbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXVxuICAgKiBAcGFyYW0ge01vbmdvU29ydFNwZWNpZmllcn0gb3B0aW9ucy5zb3J0IFNvcnQgb3JkZXIgKGRlZmF1bHQ6IG5hdHVyYWwgb3JkZXIpXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBvcHRpb25zLnNraXAgTnVtYmVyIG9mIHJlc3VsdHMgdG8gc2tpcCBhdCB0aGUgYmVnaW5uaW5nXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBvcHRpb25zLmxpbWl0IE1heGltdW0gbnVtYmVyIG9mIHJlc3VsdHMgdG8gcmV0dXJuXG4gICAqIEBwYXJhbSB7TW9uZ29GaWVsZFNwZWNpZmllcn0gb3B0aW9ucy5maWVsZHMgRGljdGlvbmFyeSBvZiBmaWVsZHMgdG8gcmV0dXJuIG9yIGV4Y2x1ZGUuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gb3B0aW9ucy5yZWFjdGl2ZSAoQ2xpZW50IG9ubHkpIERlZmF1bHQgYHRydWVgOyBwYXNzIGBmYWxzZWAgdG8gZGlzYWJsZSByZWFjdGl2aXR5XG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IG9wdGlvbnMudHJhbnNmb3JtIE92ZXJyaWRlcyBgdHJhbnNmb3JtYCBvbiB0aGUgIFtgQ29sbGVjdGlvbmBdKCNjb2xsZWN0aW9ucykgZm9yIHRoaXMgY3Vyc29yLiAgUGFzcyBgbnVsbGAgdG8gZGlzYWJsZSB0cmFuc2Zvcm1hdGlvbi5cbiAgICogQHBhcmFtIHtCb29sZWFufSBvcHRpb25zLmRpc2FibGVPcGxvZyAoU2VydmVyIG9ubHkpIFBhc3MgdHJ1ZSB0byBkaXNhYmxlIG9wbG9nLXRhaWxpbmcgb24gdGhpcyBxdWVyeS4gVGhpcyBhZmZlY3RzIHRoZSB3YXkgc2VydmVyIHByb2Nlc3NlcyBjYWxscyB0byBgb2JzZXJ2ZWAgb24gdGhpcyBxdWVyeS4gRGlzYWJsaW5nIHRoZSBvcGxvZyBjYW4gYmUgdXNlZnVsIHdoZW4gd29ya2luZyB3aXRoIGRhdGEgdGhhdCB1cGRhdGVzIGluIGxhcmdlIGJhdGNoZXMuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBvcHRpb25zLnBvbGxpbmdJbnRlcnZhbE1zIChTZXJ2ZXIgb25seSkgV2hlbiBvcGxvZyBpcyBkaXNhYmxlZCAodGhyb3VnaCB0aGUgdXNlIG9mIGBkaXNhYmxlT3Bsb2dgIG9yIHdoZW4gb3RoZXJ3aXNlIG5vdCBhdmFpbGFibGUpLCB0aGUgZnJlcXVlbmN5IChpbiBtaWxsaXNlY29uZHMpIG9mIGhvdyBvZnRlbiB0byBwb2xsIHRoaXMgcXVlcnkgd2hlbiBvYnNlcnZpbmcgb24gdGhlIHNlcnZlci4gRGVmYXVsdHMgdG8gMTAwMDBtcyAoMTAgc2Vjb25kcykuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBvcHRpb25zLnBvbGxpbmdUaHJvdHRsZU1zIChTZXJ2ZXIgb25seSkgV2hlbiBvcGxvZyBpcyBkaXNhYmxlZCAodGhyb3VnaCB0aGUgdXNlIG9mIGBkaXNhYmxlT3Bsb2dgIG9yIHdoZW4gb3RoZXJ3aXNlIG5vdCBhdmFpbGFibGUpLCB0aGUgbWluaW11bSB0aW1lIChpbiBtaWxsaXNlY29uZHMpIHRvIGFsbG93IGJldHdlZW4gcmUtcG9sbGluZyB3aGVuIG9ic2VydmluZyBvbiB0aGUgc2VydmVyLiBJbmNyZWFzaW5nIHRoaXMgd2lsbCBzYXZlIENQVSBhbmQgbW9uZ28gbG9hZCBhdCB0aGUgZXhwZW5zZSBvZiBzbG93ZXIgdXBkYXRlcyB0byB1c2Vycy4gRGVjcmVhc2luZyB0aGlzIGlzIG5vdCByZWNvbW1lbmRlZC4gRGVmYXVsdHMgdG8gNTBtcy5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IG9wdGlvbnMubWF4VGltZU1zIChTZXJ2ZXIgb25seSkgSWYgc2V0LCBpbnN0cnVjdHMgTW9uZ29EQiB0byBzZXQgYSB0aW1lIGxpbWl0IGZvciB0aGlzIGN1cnNvcidzIG9wZXJhdGlvbnMuIElmIHRoZSBvcGVyYXRpb24gcmVhY2hlcyB0aGUgc3BlY2lmaWVkIHRpbWUgbGltaXQgKGluIG1pbGxpc2Vjb25kcykgd2l0aG91dCB0aGUgaGF2aW5nIGJlZW4gY29tcGxldGVkLCBhbiBleGNlcHRpb24gd2lsbCBiZSB0aHJvd24uIFVzZWZ1bCB0byBwcmV2ZW50IGFuIChhY2NpZGVudGFsIG9yIG1hbGljaW91cykgdW5vcHRpbWl6ZWQgcXVlcnkgZnJvbSBjYXVzaW5nIGEgZnVsbCBjb2xsZWN0aW9uIHNjYW4gdGhhdCB3b3VsZCBkaXNydXB0IG90aGVyIGRhdGFiYXNlIHVzZXJzLCBhdCB0aGUgZXhwZW5zZSBvZiBuZWVkaW5nIHRvIGhhbmRsZSB0aGUgcmVzdWx0aW5nIGVycm9yLlxuICAgKiBAcGFyYW0ge1N0cmluZ3xPYmplY3R9IG9wdGlvbnMuaGludCAoU2VydmVyIG9ubHkpIE92ZXJyaWRlcyBNb25nb0RCJ3MgZGVmYXVsdCBpbmRleCBzZWxlY3Rpb24gYW5kIHF1ZXJ5IG9wdGltaXphdGlvbiBwcm9jZXNzLiBTcGVjaWZ5IGFuIGluZGV4IHRvIGZvcmNlIGl0cyB1c2UsIGVpdGhlciBieSBpdHMgbmFtZSBvciBpbmRleCBzcGVjaWZpY2F0aW9uLiBZb3UgY2FuIGFsc28gc3BlY2lmeSBgeyAkbmF0dXJhbCA6IDEgfWAgdG8gZm9yY2UgYSBmb3J3YXJkcyBjb2xsZWN0aW9uIHNjYW4sIG9yIGB7ICRuYXR1cmFsIDogLTEgfWAgZm9yIGEgcmV2ZXJzZSBjb2xsZWN0aW9uIHNjYW4uIFNldHRpbmcgdGhpcyBpcyBvbmx5IHJlY29tbWVuZGVkIGZvciBhZHZhbmNlZCB1c2Vycy5cbiAgICogQHJldHVybnMge01vbmdvLkN1cnNvcn1cbiAgICovXG4gIGZpbmQoLi4uYXJncykge1xuICAgIC8vIENvbGxlY3Rpb24uZmluZCgpIChyZXR1cm4gYWxsIGRvY3MpIGJlaGF2ZXMgZGlmZmVyZW50bHlcbiAgICAvLyBmcm9tIENvbGxlY3Rpb24uZmluZCh1bmRlZmluZWQpIChyZXR1cm4gMCBkb2NzKS4gIHNvIGJlXG4gICAgLy8gY2FyZWZ1bCBhYm91dCB0aGUgbGVuZ3RoIG9mIGFyZ3VtZW50cy5cbiAgICByZXR1cm4gdGhpcy5fY29sbGVjdGlvbi5maW5kKFxuICAgICAgdGhpcy5fZ2V0RmluZFNlbGVjdG9yKGFyZ3MpLFxuICAgICAgdGhpcy5fZ2V0RmluZE9wdGlvbnMoYXJncylcbiAgICApO1xuICB9LFxuXG4gIC8qKlxuICAgKiBAc3VtbWFyeSBGaW5kcyB0aGUgZmlyc3QgZG9jdW1lbnQgdGhhdCBtYXRjaGVzIHRoZSBzZWxlY3RvciwgYXMgb3JkZXJlZCBieSBzb3J0IGFuZCBza2lwIG9wdGlvbnMuIFJldHVybnMgYHVuZGVmaW5lZGAgaWYgbm8gbWF0Y2hpbmcgZG9jdW1lbnQgaXMgZm91bmQuXG4gICAqIEBsb2N1cyBBbnl3aGVyZVxuICAgKiBAbWV0aG9kIGZpbmRPbmVcbiAgICogQG1lbWJlcm9mIE1vbmdvLkNvbGxlY3Rpb25cbiAgICogQGluc3RhbmNlXG4gICAqIEBwYXJhbSB7TW9uZ29TZWxlY3Rvcn0gW3NlbGVjdG9yXSBBIHF1ZXJ5IGRlc2NyaWJpbmcgdGhlIGRvY3VtZW50cyB0byBmaW5kXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc11cbiAgICogQHBhcmFtIHtNb25nb1NvcnRTcGVjaWZpZXJ9IG9wdGlvbnMuc29ydCBTb3J0IG9yZGVyIChkZWZhdWx0OiBuYXR1cmFsIG9yZGVyKVxuICAgKiBAcGFyYW0ge051bWJlcn0gb3B0aW9ucy5za2lwIE51bWJlciBvZiByZXN1bHRzIHRvIHNraXAgYXQgdGhlIGJlZ2lubmluZ1xuICAgKiBAcGFyYW0ge01vbmdvRmllbGRTcGVjaWZpZXJ9IG9wdGlvbnMuZmllbGRzIERpY3Rpb25hcnkgb2YgZmllbGRzIHRvIHJldHVybiBvciBleGNsdWRlLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IG9wdGlvbnMucmVhY3RpdmUgKENsaWVudCBvbmx5KSBEZWZhdWx0IHRydWU7IHBhc3MgZmFsc2UgdG8gZGlzYWJsZSByZWFjdGl2aXR5XG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IG9wdGlvbnMudHJhbnNmb3JtIE92ZXJyaWRlcyBgdHJhbnNmb3JtYCBvbiB0aGUgW2BDb2xsZWN0aW9uYF0oI2NvbGxlY3Rpb25zKSBmb3IgdGhpcyBjdXJzb3IuICBQYXNzIGBudWxsYCB0byBkaXNhYmxlIHRyYW5zZm9ybWF0aW9uLlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fVxuICAgKi9cbiAgZmluZE9uZSguLi5hcmdzKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbGxlY3Rpb24uZmluZE9uZShcbiAgICAgIHRoaXMuX2dldEZpbmRTZWxlY3RvcihhcmdzKSxcbiAgICAgIHRoaXMuX2dldEZpbmRPcHRpb25zKGFyZ3MpXG4gICAgKTtcbiAgfVxufSk7XG5cbk9iamVjdC5hc3NpZ24oTW9uZ28uQ29sbGVjdGlvbiwge1xuICBfcHVibGlzaEN1cnNvcihjdXJzb3IsIHN1YiwgY29sbGVjdGlvbikge1xuICAgIHZhciBvYnNlcnZlSGFuZGxlID0gY3Vyc29yLm9ic2VydmVDaGFuZ2VzKHtcbiAgICAgIGFkZGVkOiBmdW5jdGlvbiAoaWQsIGZpZWxkcykge1xuICAgICAgICBzdWIuYWRkZWQoY29sbGVjdGlvbiwgaWQsIGZpZWxkcyk7XG4gICAgICB9LFxuICAgICAgY2hhbmdlZDogZnVuY3Rpb24gKGlkLCBmaWVsZHMpIHtcbiAgICAgICAgc3ViLmNoYW5nZWQoY29sbGVjdGlvbiwgaWQsIGZpZWxkcyk7XG4gICAgICB9LFxuICAgICAgcmVtb3ZlZDogZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgIHN1Yi5yZW1vdmVkKGNvbGxlY3Rpb24sIGlkKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIFdlIGRvbid0IGNhbGwgc3ViLnJlYWR5KCkgaGVyZTogaXQgZ2V0cyBjYWxsZWQgaW4gbGl2ZWRhdGFfc2VydmVyLCBhZnRlclxuICAgIC8vIHBvc3NpYmx5IGNhbGxpbmcgX3B1Ymxpc2hDdXJzb3Igb24gbXVsdGlwbGUgcmV0dXJuZWQgY3Vyc29ycy5cblxuICAgIC8vIHJlZ2lzdGVyIHN0b3AgY2FsbGJhY2sgKGV4cGVjdHMgbGFtYmRhIHcvIG5vIGFyZ3MpLlxuICAgIHN1Yi5vblN0b3AoZnVuY3Rpb24gKCkge1xuICAgICAgb2JzZXJ2ZUhhbmRsZS5zdG9wKCk7XG4gICAgfSk7XG5cbiAgICAvLyByZXR1cm4gdGhlIG9ic2VydmVIYW5kbGUgaW4gY2FzZSBpdCBuZWVkcyB0byBiZSBzdG9wcGVkIGVhcmx5XG4gICAgcmV0dXJuIG9ic2VydmVIYW5kbGU7XG4gIH0sXG5cbiAgLy8gcHJvdGVjdCBhZ2FpbnN0IGRhbmdlcm91cyBzZWxlY3RvcnMuICBmYWxzZXkgYW5kIHtfaWQ6IGZhbHNleX0gYXJlIGJvdGhcbiAgLy8gbGlrZWx5IHByb2dyYW1tZXIgZXJyb3IsIGFuZCBub3Qgd2hhdCB5b3Ugd2FudCwgcGFydGljdWxhcmx5IGZvciBkZXN0cnVjdGl2ZVxuICAvLyBvcGVyYXRpb25zLiBJZiBhIGZhbHNleSBfaWQgaXMgc2VudCBpbiwgYSBuZXcgc3RyaW5nIF9pZCB3aWxsIGJlXG4gIC8vIGdlbmVyYXRlZCBhbmQgcmV0dXJuZWQ7IGlmIGEgZmFsbGJhY2tJZCBpcyBwcm92aWRlZCwgaXQgd2lsbCBiZSByZXR1cm5lZFxuICAvLyBpbnN0ZWFkLlxuICBfcmV3cml0ZVNlbGVjdG9yKHNlbGVjdG9yLCB7IGZhbGxiYWNrSWQgfSA9IHt9KSB7XG4gICAgLy8gc2hvcnRoYW5kIC0tIHNjYWxhcnMgbWF0Y2ggX2lkXG4gICAgaWYgKExvY2FsQ29sbGVjdGlvbi5fc2VsZWN0b3JJc0lkKHNlbGVjdG9yKSlcbiAgICAgIHNlbGVjdG9yID0ge19pZDogc2VsZWN0b3J9O1xuXG4gICAgaWYgKEFycmF5LmlzQXJyYXkoc2VsZWN0b3IpKSB7XG4gICAgICAvLyBUaGlzIGlzIGNvbnNpc3RlbnQgd2l0aCB0aGUgTW9uZ28gY29uc29sZSBpdHNlbGY7IGlmIHdlIGRvbid0IGRvIHRoaXNcbiAgICAgIC8vIGNoZWNrIHBhc3NpbmcgYW4gZW1wdHkgYXJyYXkgZW5kcyB1cCBzZWxlY3RpbmcgYWxsIGl0ZW1zXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNb25nbyBzZWxlY3RvciBjYW4ndCBiZSBhbiBhcnJheS5cIik7XG4gICAgfVxuXG4gICAgaWYgKCFzZWxlY3RvciB8fCAoKCdfaWQnIGluIHNlbGVjdG9yKSAmJiAhc2VsZWN0b3IuX2lkKSkge1xuICAgICAgLy8gY2FuJ3QgbWF0Y2ggYW55dGhpbmdcbiAgICAgIHJldHVybiB7IF9pZDogZmFsbGJhY2tJZCB8fCBSYW5kb20uaWQoKSB9O1xuICAgIH1cblxuICAgIHJldHVybiBzZWxlY3RvcjtcbiAgfVxufSk7XG5cbk9iamVjdC5hc3NpZ24oTW9uZ28uQ29sbGVjdGlvbi5wcm90b3R5cGUsIHtcbiAgLy8gJ2luc2VydCcgaW1tZWRpYXRlbHkgcmV0dXJucyB0aGUgaW5zZXJ0ZWQgZG9jdW1lbnQncyBuZXcgX2lkLlxuICAvLyBUaGUgb3RoZXJzIHJldHVybiB2YWx1ZXMgaW1tZWRpYXRlbHkgaWYgeW91IGFyZSBpbiBhIHN0dWIsIGFuIGluLW1lbW9yeVxuICAvLyB1bm1hbmFnZWQgY29sbGVjdGlvbiwgb3IgYSBtb25nby1iYWNrZWQgY29sbGVjdGlvbiBhbmQgeW91IGRvbid0IHBhc3MgYVxuICAvLyBjYWxsYmFjay4gJ3VwZGF0ZScgYW5kICdyZW1vdmUnIHJldHVybiB0aGUgbnVtYmVyIG9mIGFmZmVjdGVkXG4gIC8vIGRvY3VtZW50cy4gJ3Vwc2VydCcgcmV0dXJucyBhbiBvYmplY3Qgd2l0aCBrZXlzICdudW1iZXJBZmZlY3RlZCcgYW5kLCBpZiBhblxuICAvLyBpbnNlcnQgaGFwcGVuZWQsICdpbnNlcnRlZElkJy5cbiAgLy9cbiAgLy8gT3RoZXJ3aXNlLCB0aGUgc2VtYW50aWNzIGFyZSBleGFjdGx5IGxpa2Ugb3RoZXIgbWV0aG9kczogdGhleSB0YWtlXG4gIC8vIGEgY2FsbGJhY2sgYXMgYW4gb3B0aW9uYWwgbGFzdCBhcmd1bWVudDsgaWYgbm8gY2FsbGJhY2sgaXNcbiAgLy8gcHJvdmlkZWQsIHRoZXkgYmxvY2sgdW50aWwgdGhlIG9wZXJhdGlvbiBpcyBjb21wbGV0ZSwgYW5kIHRocm93IGFuXG4gIC8vIGV4Y2VwdGlvbiBpZiBpdCBmYWlsczsgaWYgYSBjYWxsYmFjayBpcyBwcm92aWRlZCwgdGhlbiB0aGV5IGRvbid0XG4gIC8vIG5lY2Vzc2FyaWx5IGJsb2NrLCBhbmQgdGhleSBjYWxsIHRoZSBjYWxsYmFjayB3aGVuIHRoZXkgZmluaXNoIHdpdGggZXJyb3IgYW5kXG4gIC8vIHJlc3VsdCBhcmd1bWVudHMuICAoVGhlIGluc2VydCBtZXRob2QgcHJvdmlkZXMgdGhlIGRvY3VtZW50IElEIGFzIGl0cyByZXN1bHQ7XG4gIC8vIHVwZGF0ZSBhbmQgcmVtb3ZlIHByb3ZpZGUgdGhlIG51bWJlciBvZiBhZmZlY3RlZCBkb2NzIGFzIHRoZSByZXN1bHQ7IHVwc2VydFxuICAvLyBwcm92aWRlcyBhbiBvYmplY3Qgd2l0aCBudW1iZXJBZmZlY3RlZCBhbmQgbWF5YmUgaW5zZXJ0ZWRJZC4pXG4gIC8vXG4gIC8vIE9uIHRoZSBjbGllbnQsIGJsb2NraW5nIGlzIGltcG9zc2libGUsIHNvIGlmIGEgY2FsbGJhY2tcbiAgLy8gaXNuJ3QgcHJvdmlkZWQsIHRoZXkganVzdCByZXR1cm4gaW1tZWRpYXRlbHkgYW5kIGFueSBlcnJvclxuICAvLyBpbmZvcm1hdGlvbiBpcyBsb3N0LlxuICAvL1xuICAvLyBUaGVyZSdzIG9uZSBtb3JlIHR3ZWFrLiBPbiB0aGUgY2xpZW50LCBpZiB5b3UgZG9uJ3QgcHJvdmlkZSBhXG4gIC8vIGNhbGxiYWNrLCB0aGVuIGlmIHRoZXJlIGlzIGFuIGVycm9yLCBhIG1lc3NhZ2Ugd2lsbCBiZSBsb2dnZWQgd2l0aFxuICAvLyBNZXRlb3IuX2RlYnVnLlxuICAvL1xuICAvLyBUaGUgaW50ZW50ICh0aG91Z2ggdGhpcyBpcyBhY3R1YWxseSBkZXRlcm1pbmVkIGJ5IHRoZSB1bmRlcmx5aW5nXG4gIC8vIGRyaXZlcnMpIGlzIHRoYXQgdGhlIG9wZXJhdGlvbnMgc2hvdWxkIGJlIGRvbmUgc3luY2hyb25vdXNseSwgbm90XG4gIC8vIGdlbmVyYXRpbmcgdGhlaXIgcmVzdWx0IHVudGlsIHRoZSBkYXRhYmFzZSBoYXMgYWNrbm93bGVkZ2VkXG4gIC8vIHRoZW0uIEluIHRoZSBmdXR1cmUgbWF5YmUgd2Ugc2hvdWxkIHByb3ZpZGUgYSBmbGFnIHRvIHR1cm4gdGhpc1xuICAvLyBvZmYuXG5cbiAgLyoqXG4gICAqIEBzdW1tYXJ5IEluc2VydCBhIGRvY3VtZW50IGluIHRoZSBjb2xsZWN0aW9uLiAgUmV0dXJucyBpdHMgdW5pcXVlIF9pZC5cbiAgICogQGxvY3VzIEFueXdoZXJlXG4gICAqIEBtZXRob2QgIGluc2VydFxuICAgKiBAbWVtYmVyb2YgTW9uZ28uQ29sbGVjdGlvblxuICAgKiBAaW5zdGFuY2VcbiAgICogQHBhcmFtIHtPYmplY3R9IGRvYyBUaGUgZG9jdW1lbnQgdG8gaW5zZXJ0LiBNYXkgbm90IHlldCBoYXZlIGFuIF9pZCBhdHRyaWJ1dGUsIGluIHdoaWNoIGNhc2UgTWV0ZW9yIHdpbGwgZ2VuZXJhdGUgb25lIGZvciB5b3UuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYWxsYmFja10gT3B0aW9uYWwuICBJZiBwcmVzZW50LCBjYWxsZWQgd2l0aCBhbiBlcnJvciBvYmplY3QgYXMgdGhlIGZpcnN0IGFyZ3VtZW50IGFuZCwgaWYgbm8gZXJyb3IsIHRoZSBfaWQgYXMgdGhlIHNlY29uZC5cbiAgICovXG4gIGluc2VydChkb2MsIGNhbGxiYWNrKSB7XG4gICAgLy8gTWFrZSBzdXJlIHdlIHdlcmUgcGFzc2VkIGEgZG9jdW1lbnQgdG8gaW5zZXJ0XG4gICAgaWYgKCFkb2MpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcImluc2VydCByZXF1aXJlcyBhbiBhcmd1bWVudFwiKTtcbiAgICB9XG5cbiAgICAvLyBNYWtlIGEgc2hhbGxvdyBjbG9uZSBvZiB0aGUgZG9jdW1lbnQsIHByZXNlcnZpbmcgaXRzIHByb3RvdHlwZS5cbiAgICBkb2MgPSBPYmplY3QuY3JlYXRlKFxuICAgICAgT2JqZWN0LmdldFByb3RvdHlwZU9mKGRvYyksXG4gICAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhkb2MpXG4gICAgKTtcblxuICAgIGlmICgnX2lkJyBpbiBkb2MpIHtcbiAgICAgIGlmICghIGRvYy5faWQgfHxcbiAgICAgICAgICAhICh0eXBlb2YgZG9jLl9pZCA9PT0gJ3N0cmluZycgfHxcbiAgICAgICAgICAgICBkb2MuX2lkIGluc3RhbmNlb2YgTW9uZ28uT2JqZWN0SUQpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBcIk1ldGVvciByZXF1aXJlcyBkb2N1bWVudCBfaWQgZmllbGRzIHRvIGJlIG5vbi1lbXB0eSBzdHJpbmdzIG9yIE9iamVjdElEc1wiKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IGdlbmVyYXRlSWQgPSB0cnVlO1xuXG4gICAgICAvLyBEb24ndCBnZW5lcmF0ZSB0aGUgaWQgaWYgd2UncmUgdGhlIGNsaWVudCBhbmQgdGhlICdvdXRlcm1vc3QnIGNhbGxcbiAgICAgIC8vIFRoaXMgb3B0aW1pemF0aW9uIHNhdmVzIHVzIHBhc3NpbmcgYm90aCB0aGUgcmFuZG9tU2VlZCBhbmQgdGhlIGlkXG4gICAgICAvLyBQYXNzaW5nIGJvdGggaXMgcmVkdW5kYW50LlxuICAgICAgaWYgKHRoaXMuX2lzUmVtb3RlQ29sbGVjdGlvbigpKSB7XG4gICAgICAgIGNvbnN0IGVuY2xvc2luZyA9IEREUC5fQ3VycmVudE1ldGhvZEludm9jYXRpb24uZ2V0KCk7XG4gICAgICAgIGlmICghZW5jbG9zaW5nKSB7XG4gICAgICAgICAgZ2VuZXJhdGVJZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChnZW5lcmF0ZUlkKSB7XG4gICAgICAgIGRvYy5faWQgPSB0aGlzLl9tYWtlTmV3SUQoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBPbiBpbnNlcnRzLCBhbHdheXMgcmV0dXJuIHRoZSBpZCB0aGF0IHdlIGdlbmVyYXRlZDsgb24gYWxsIG90aGVyXG4gICAgLy8gb3BlcmF0aW9ucywganVzdCByZXR1cm4gdGhlIHJlc3VsdCBmcm9tIHRoZSBjb2xsZWN0aW9uLlxuICAgIHZhciBjaG9vc2VSZXR1cm5WYWx1ZUZyb21Db2xsZWN0aW9uUmVzdWx0ID0gZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgaWYgKGRvYy5faWQpIHtcbiAgICAgICAgcmV0dXJuIGRvYy5faWQ7XG4gICAgICB9XG5cbiAgICAgIC8vIFhYWCB3aGF0IGlzIHRoaXMgZm9yPz9cbiAgICAgIC8vIEl0J3Mgc29tZSBpdGVyYWN0aW9uIGJldHdlZW4gdGhlIGNhbGxiYWNrIHRvIF9jYWxsTXV0YXRvck1ldGhvZCBhbmRcbiAgICAgIC8vIHRoZSByZXR1cm4gdmFsdWUgY29udmVyc2lvblxuICAgICAgZG9jLl9pZCA9IHJlc3VsdDtcblxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuXG4gICAgY29uc3Qgd3JhcHBlZENhbGxiYWNrID0gd3JhcENhbGxiYWNrKFxuICAgICAgY2FsbGJhY2ssIGNob29zZVJldHVyblZhbHVlRnJvbUNvbGxlY3Rpb25SZXN1bHQpO1xuXG4gICAgaWYgKHRoaXMuX2lzUmVtb3RlQ29sbGVjdGlvbigpKSB7XG4gICAgICBjb25zdCByZXN1bHQgPSB0aGlzLl9jYWxsTXV0YXRvck1ldGhvZChcImluc2VydFwiLCBbZG9jXSwgd3JhcHBlZENhbGxiYWNrKTtcbiAgICAgIHJldHVybiBjaG9vc2VSZXR1cm5WYWx1ZUZyb21Db2xsZWN0aW9uUmVzdWx0KHJlc3VsdCk7XG4gICAgfVxuXG4gICAgLy8gaXQncyBteSBjb2xsZWN0aW9uLiAgZGVzY2VuZCBpbnRvIHRoZSBjb2xsZWN0aW9uIG9iamVjdFxuICAgIC8vIGFuZCBwcm9wYWdhdGUgYW55IGV4Y2VwdGlvbi5cbiAgICB0cnkge1xuICAgICAgLy8gSWYgdGhlIHVzZXIgcHJvdmlkZWQgYSBjYWxsYmFjayBhbmQgdGhlIGNvbGxlY3Rpb24gaW1wbGVtZW50cyB0aGlzXG4gICAgICAvLyBvcGVyYXRpb24gYXN5bmNocm9ub3VzbHksIHRoZW4gcXVlcnlSZXQgd2lsbCBiZSB1bmRlZmluZWQsIGFuZCB0aGVcbiAgICAgIC8vIHJlc3VsdCB3aWxsIGJlIHJldHVybmVkIHRocm91Z2ggdGhlIGNhbGxiYWNrIGluc3RlYWQuXG4gICAgICBjb25zdCByZXN1bHQgPSB0aGlzLl9jb2xsZWN0aW9uLmluc2VydChkb2MsIHdyYXBwZWRDYWxsYmFjayk7XG4gICAgICByZXR1cm4gY2hvb3NlUmV0dXJuVmFsdWVGcm9tQ29sbGVjdGlvblJlc3VsdChyZXN1bHQpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjayhlKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgICB0aHJvdyBlO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogQHN1bW1hcnkgTW9kaWZ5IG9uZSBvciBtb3JlIGRvY3VtZW50cyBpbiB0aGUgY29sbGVjdGlvbi4gUmV0dXJucyB0aGUgbnVtYmVyIG9mIG1hdGNoZWQgZG9jdW1lbnRzLlxuICAgKiBAbG9jdXMgQW55d2hlcmVcbiAgICogQG1ldGhvZCB1cGRhdGVcbiAgICogQG1lbWJlcm9mIE1vbmdvLkNvbGxlY3Rpb25cbiAgICogQGluc3RhbmNlXG4gICAqIEBwYXJhbSB7TW9uZ29TZWxlY3Rvcn0gc2VsZWN0b3IgU3BlY2lmaWVzIHdoaWNoIGRvY3VtZW50cyB0byBtb2RpZnlcbiAgICogQHBhcmFtIHtNb25nb01vZGlmaWVyfSBtb2RpZmllciBTcGVjaWZpZXMgaG93IHRvIG1vZGlmeSB0aGUgZG9jdW1lbnRzXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc11cbiAgICogQHBhcmFtIHtCb29sZWFufSBvcHRpb25zLm11bHRpIFRydWUgdG8gbW9kaWZ5IGFsbCBtYXRjaGluZyBkb2N1bWVudHM7IGZhbHNlIHRvIG9ubHkgbW9kaWZ5IG9uZSBvZiB0aGUgbWF0Y2hpbmcgZG9jdW1lbnRzICh0aGUgZGVmYXVsdCkuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gb3B0aW9ucy51cHNlcnQgVHJ1ZSB0byBpbnNlcnQgYSBkb2N1bWVudCBpZiBubyBtYXRjaGluZyBkb2N1bWVudHMgYXJlIGZvdW5kLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2FsbGJhY2tdIE9wdGlvbmFsLiAgSWYgcHJlc2VudCwgY2FsbGVkIHdpdGggYW4gZXJyb3Igb2JqZWN0IGFzIHRoZSBmaXJzdCBhcmd1bWVudCBhbmQsIGlmIG5vIGVycm9yLCB0aGUgbnVtYmVyIG9mIGFmZmVjdGVkIGRvY3VtZW50cyBhcyB0aGUgc2Vjb25kLlxuICAgKi9cbiAgdXBkYXRlKHNlbGVjdG9yLCBtb2RpZmllciwgLi4ub3B0aW9uc0FuZENhbGxiYWNrKSB7XG4gICAgY29uc3QgY2FsbGJhY2sgPSBwb3BDYWxsYmFja0Zyb21BcmdzKG9wdGlvbnNBbmRDYWxsYmFjayk7XG5cbiAgICAvLyBXZSd2ZSBhbHJlYWR5IHBvcHBlZCBvZmYgdGhlIGNhbGxiYWNrLCBzbyB3ZSBhcmUgbGVmdCB3aXRoIGFuIGFycmF5XG4gICAgLy8gb2Ygb25lIG9yIHplcm8gaXRlbXNcbiAgICBjb25zdCBvcHRpb25zID0geyAuLi4ob3B0aW9uc0FuZENhbGxiYWNrWzBdIHx8IG51bGwpIH07XG4gICAgbGV0IGluc2VydGVkSWQ7XG4gICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy51cHNlcnQpIHtcbiAgICAgIC8vIHNldCBgaW5zZXJ0ZWRJZGAgaWYgYWJzZW50LiAgYGluc2VydGVkSWRgIGlzIGEgTWV0ZW9yIGV4dGVuc2lvbi5cbiAgICAgIGlmIChvcHRpb25zLmluc2VydGVkSWQpIHtcbiAgICAgICAgaWYgKCEodHlwZW9mIG9wdGlvbnMuaW5zZXJ0ZWRJZCA9PT0gJ3N0cmluZycgfHwgb3B0aW9ucy5pbnNlcnRlZElkIGluc3RhbmNlb2YgTW9uZ28uT2JqZWN0SUQpKVxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImluc2VydGVkSWQgbXVzdCBiZSBzdHJpbmcgb3IgT2JqZWN0SURcIik7XG4gICAgICAgIGluc2VydGVkSWQgPSBvcHRpb25zLmluc2VydGVkSWQ7XG4gICAgICB9IGVsc2UgaWYgKCFzZWxlY3RvciB8fCAhc2VsZWN0b3IuX2lkKSB7XG4gICAgICAgIGluc2VydGVkSWQgPSB0aGlzLl9tYWtlTmV3SUQoKTtcbiAgICAgICAgb3B0aW9ucy5nZW5lcmF0ZWRJZCA9IHRydWU7XG4gICAgICAgIG9wdGlvbnMuaW5zZXJ0ZWRJZCA9IGluc2VydGVkSWQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgc2VsZWN0b3IgPVxuICAgICAgTW9uZ28uQ29sbGVjdGlvbi5fcmV3cml0ZVNlbGVjdG9yKHNlbGVjdG9yLCB7IGZhbGxiYWNrSWQ6IGluc2VydGVkSWQgfSk7XG5cbiAgICBjb25zdCB3cmFwcGVkQ2FsbGJhY2sgPSB3cmFwQ2FsbGJhY2soY2FsbGJhY2spO1xuXG4gICAgaWYgKHRoaXMuX2lzUmVtb3RlQ29sbGVjdGlvbigpKSB7XG4gICAgICBjb25zdCBhcmdzID0gW1xuICAgICAgICBzZWxlY3RvcixcbiAgICAgICAgbW9kaWZpZXIsXG4gICAgICAgIG9wdGlvbnNcbiAgICAgIF07XG5cbiAgICAgIHJldHVybiB0aGlzLl9jYWxsTXV0YXRvck1ldGhvZChcInVwZGF0ZVwiLCBhcmdzLCB3cmFwcGVkQ2FsbGJhY2spO1xuICAgIH1cblxuICAgIC8vIGl0J3MgbXkgY29sbGVjdGlvbi4gIGRlc2NlbmQgaW50byB0aGUgY29sbGVjdGlvbiBvYmplY3RcbiAgICAvLyBhbmQgcHJvcGFnYXRlIGFueSBleGNlcHRpb24uXG4gICAgdHJ5IHtcbiAgICAgIC8vIElmIHRoZSB1c2VyIHByb3ZpZGVkIGEgY2FsbGJhY2sgYW5kIHRoZSBjb2xsZWN0aW9uIGltcGxlbWVudHMgdGhpc1xuICAgICAgLy8gb3BlcmF0aW9uIGFzeW5jaHJvbm91c2x5LCB0aGVuIHF1ZXJ5UmV0IHdpbGwgYmUgdW5kZWZpbmVkLCBhbmQgdGhlXG4gICAgICAvLyByZXN1bHQgd2lsbCBiZSByZXR1cm5lZCB0aHJvdWdoIHRoZSBjYWxsYmFjayBpbnN0ZWFkLlxuICAgICAgcmV0dXJuIHRoaXMuX2NvbGxlY3Rpb24udXBkYXRlKFxuICAgICAgICBzZWxlY3RvciwgbW9kaWZpZXIsIG9wdGlvbnMsIHdyYXBwZWRDYWxsYmFjayk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgIGNhbGxiYWNrKGUpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICAgIHRocm93IGU7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBAc3VtbWFyeSBSZW1vdmUgZG9jdW1lbnRzIGZyb20gdGhlIGNvbGxlY3Rpb25cbiAgICogQGxvY3VzIEFueXdoZXJlXG4gICAqIEBtZXRob2QgcmVtb3ZlXG4gICAqIEBtZW1iZXJvZiBNb25nby5Db2xsZWN0aW9uXG4gICAqIEBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge01vbmdvU2VsZWN0b3J9IHNlbGVjdG9yIFNwZWNpZmllcyB3aGljaCBkb2N1bWVudHMgdG8gcmVtb3ZlXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYWxsYmFja10gT3B0aW9uYWwuICBJZiBwcmVzZW50LCBjYWxsZWQgd2l0aCBhbiBlcnJvciBvYmplY3QgYXMgaXRzIGFyZ3VtZW50LlxuICAgKi9cbiAgcmVtb3ZlKHNlbGVjdG9yLCBjYWxsYmFjaykge1xuICAgIHNlbGVjdG9yID0gTW9uZ28uQ29sbGVjdGlvbi5fcmV3cml0ZVNlbGVjdG9yKHNlbGVjdG9yKTtcblxuICAgIGNvbnN0IHdyYXBwZWRDYWxsYmFjayA9IHdyYXBDYWxsYmFjayhjYWxsYmFjayk7XG5cbiAgICBpZiAodGhpcy5faXNSZW1vdGVDb2xsZWN0aW9uKCkpIHtcbiAgICAgIHJldHVybiB0aGlzLl9jYWxsTXV0YXRvck1ldGhvZChcInJlbW92ZVwiLCBbc2VsZWN0b3JdLCB3cmFwcGVkQ2FsbGJhY2spO1xuICAgIH1cblxuICAgIC8vIGl0J3MgbXkgY29sbGVjdGlvbi4gIGRlc2NlbmQgaW50byB0aGUgY29sbGVjdGlvbiBvYmplY3RcbiAgICAvLyBhbmQgcHJvcGFnYXRlIGFueSBleGNlcHRpb24uXG4gICAgdHJ5IHtcbiAgICAgIC8vIElmIHRoZSB1c2VyIHByb3ZpZGVkIGEgY2FsbGJhY2sgYW5kIHRoZSBjb2xsZWN0aW9uIGltcGxlbWVudHMgdGhpc1xuICAgICAgLy8gb3BlcmF0aW9uIGFzeW5jaHJvbm91c2x5LCB0aGVuIHF1ZXJ5UmV0IHdpbGwgYmUgdW5kZWZpbmVkLCBhbmQgdGhlXG4gICAgICAvLyByZXN1bHQgd2lsbCBiZSByZXR1cm5lZCB0aHJvdWdoIHRoZSBjYWxsYmFjayBpbnN0ZWFkLlxuICAgICAgcmV0dXJuIHRoaXMuX2NvbGxlY3Rpb24ucmVtb3ZlKHNlbGVjdG9yLCB3cmFwcGVkQ2FsbGJhY2spO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjayhlKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgICB0aHJvdyBlO1xuICAgIH1cbiAgfSxcblxuICAvLyBEZXRlcm1pbmUgaWYgdGhpcyBjb2xsZWN0aW9uIGlzIHNpbXBseSBhIG1pbmltb25nbyByZXByZXNlbnRhdGlvbiBvZiBhIHJlYWxcbiAgLy8gZGF0YWJhc2Ugb24gYW5vdGhlciBzZXJ2ZXJcbiAgX2lzUmVtb3RlQ29sbGVjdGlvbigpIHtcbiAgICAvLyBYWFggc2VlICNNZXRlb3JTZXJ2ZXJOdWxsXG4gICAgcmV0dXJuIHRoaXMuX2Nvbm5lY3Rpb24gJiYgdGhpcy5fY29ubmVjdGlvbiAhPT0gTWV0ZW9yLnNlcnZlcjtcbiAgfSxcblxuICAvKipcbiAgICogQHN1bW1hcnkgTW9kaWZ5IG9uZSBvciBtb3JlIGRvY3VtZW50cyBpbiB0aGUgY29sbGVjdGlvbiwgb3IgaW5zZXJ0IG9uZSBpZiBubyBtYXRjaGluZyBkb2N1bWVudHMgd2VyZSBmb3VuZC4gUmV0dXJucyBhbiBvYmplY3Qgd2l0aCBrZXlzIGBudW1iZXJBZmZlY3RlZGAgKHRoZSBudW1iZXIgb2YgZG9jdW1lbnRzIG1vZGlmaWVkKSAgYW5kIGBpbnNlcnRlZElkYCAodGhlIHVuaXF1ZSBfaWQgb2YgdGhlIGRvY3VtZW50IHRoYXQgd2FzIGluc2VydGVkLCBpZiBhbnkpLlxuICAgKiBAbG9jdXMgQW55d2hlcmVcbiAgICogQG1ldGhvZCB1cHNlcnRcbiAgICogQG1lbWJlcm9mIE1vbmdvLkNvbGxlY3Rpb25cbiAgICogQGluc3RhbmNlXG4gICAqIEBwYXJhbSB7TW9uZ29TZWxlY3Rvcn0gc2VsZWN0b3IgU3BlY2lmaWVzIHdoaWNoIGRvY3VtZW50cyB0byBtb2RpZnlcbiAgICogQHBhcmFtIHtNb25nb01vZGlmaWVyfSBtb2RpZmllciBTcGVjaWZpZXMgaG93IHRvIG1vZGlmeSB0aGUgZG9jdW1lbnRzXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc11cbiAgICogQHBhcmFtIHtCb29sZWFufSBvcHRpb25zLm11bHRpIFRydWUgdG8gbW9kaWZ5IGFsbCBtYXRjaGluZyBkb2N1bWVudHM7IGZhbHNlIHRvIG9ubHkgbW9kaWZ5IG9uZSBvZiB0aGUgbWF0Y2hpbmcgZG9jdW1lbnRzICh0aGUgZGVmYXVsdCkuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYWxsYmFja10gT3B0aW9uYWwuICBJZiBwcmVzZW50LCBjYWxsZWQgd2l0aCBhbiBlcnJvciBvYmplY3QgYXMgdGhlIGZpcnN0IGFyZ3VtZW50IGFuZCwgaWYgbm8gZXJyb3IsIHRoZSBudW1iZXIgb2YgYWZmZWN0ZWQgZG9jdW1lbnRzIGFzIHRoZSBzZWNvbmQuXG4gICAqL1xuICB1cHNlcnQoc2VsZWN0b3IsIG1vZGlmaWVyLCBvcHRpb25zLCBjYWxsYmFjaykge1xuICAgIGlmICghIGNhbGxiYWNrICYmIHR5cGVvZiBvcHRpb25zID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIGNhbGxiYWNrID0gb3B0aW9ucztcbiAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy51cGRhdGUoc2VsZWN0b3IsIG1vZGlmaWVyLCB7XG4gICAgICAuLi5vcHRpb25zLFxuICAgICAgX3JldHVybk9iamVjdDogdHJ1ZSxcbiAgICAgIHVwc2VydDogdHJ1ZSxcbiAgICB9LCBjYWxsYmFjayk7XG4gIH0sXG5cbiAgLy8gV2UnbGwgYWN0dWFsbHkgZGVzaWduIGFuIGluZGV4IEFQSSBsYXRlci4gRm9yIG5vdywgd2UganVzdCBwYXNzIHRocm91Z2ggdG9cbiAgLy8gTW9uZ28ncywgYnV0IG1ha2UgaXQgc3luY2hyb25vdXMuXG4gIF9lbnN1cmVJbmRleChpbmRleCwgb3B0aW9ucykge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBpZiAoIXNlbGYuX2NvbGxlY3Rpb24uX2Vuc3VyZUluZGV4KVxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2FuIG9ubHkgY2FsbCBfZW5zdXJlSW5kZXggb24gc2VydmVyIGNvbGxlY3Rpb25zXCIpO1xuICAgIHNlbGYuX2NvbGxlY3Rpb24uX2Vuc3VyZUluZGV4KGluZGV4LCBvcHRpb25zKTtcbiAgfSxcblxuICBfZHJvcEluZGV4KGluZGV4KSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIGlmICghc2VsZi5fY29sbGVjdGlvbi5fZHJvcEluZGV4KVxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2FuIG9ubHkgY2FsbCBfZHJvcEluZGV4IG9uIHNlcnZlciBjb2xsZWN0aW9uc1wiKTtcbiAgICBzZWxmLl9jb2xsZWN0aW9uLl9kcm9wSW5kZXgoaW5kZXgpO1xuICB9LFxuXG4gIF9kcm9wQ29sbGVjdGlvbigpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgaWYgKCFzZWxmLl9jb2xsZWN0aW9uLmRyb3BDb2xsZWN0aW9uKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2FuIG9ubHkgY2FsbCBfZHJvcENvbGxlY3Rpb24gb24gc2VydmVyIGNvbGxlY3Rpb25zXCIpO1xuICAgIHNlbGYuX2NvbGxlY3Rpb24uZHJvcENvbGxlY3Rpb24oKTtcbiAgfSxcblxuICBfY3JlYXRlQ2FwcGVkQ29sbGVjdGlvbihieXRlU2l6ZSwgbWF4RG9jdW1lbnRzKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIGlmICghc2VsZi5fY29sbGVjdGlvbi5fY3JlYXRlQ2FwcGVkQ29sbGVjdGlvbilcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbiBvbmx5IGNhbGwgX2NyZWF0ZUNhcHBlZENvbGxlY3Rpb24gb24gc2VydmVyIGNvbGxlY3Rpb25zXCIpO1xuICAgIHNlbGYuX2NvbGxlY3Rpb24uX2NyZWF0ZUNhcHBlZENvbGxlY3Rpb24oYnl0ZVNpemUsIG1heERvY3VtZW50cyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEBzdW1tYXJ5IFJldHVybnMgdGhlIFtgQ29sbGVjdGlvbmBdKGh0dHA6Ly9tb25nb2RiLmdpdGh1Yi5pby9ub2RlLW1vbmdvZGItbmF0aXZlLzMuMC9hcGkvQ29sbGVjdGlvbi5odG1sKSBvYmplY3QgY29ycmVzcG9uZGluZyB0byB0aGlzIGNvbGxlY3Rpb24gZnJvbSB0aGUgW25wbSBgbW9uZ29kYmAgZHJpdmVyIG1vZHVsZV0oaHR0cHM6Ly93d3cubnBtanMuY29tL3BhY2thZ2UvbW9uZ29kYikgd2hpY2ggaXMgd3JhcHBlZCBieSBgTW9uZ28uQ29sbGVjdGlvbmAuXG4gICAqIEBsb2N1cyBTZXJ2ZXJcbiAgICogQG1lbWJlcm9mIE1vbmdvLkNvbGxlY3Rpb25cbiAgICogQGluc3RhbmNlXG4gICAqL1xuICByYXdDb2xsZWN0aW9uKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBpZiAoISBzZWxmLl9jb2xsZWN0aW9uLnJhd0NvbGxlY3Rpb24pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbiBvbmx5IGNhbGwgcmF3Q29sbGVjdGlvbiBvbiBzZXJ2ZXIgY29sbGVjdGlvbnNcIik7XG4gICAgfVxuICAgIHJldHVybiBzZWxmLl9jb2xsZWN0aW9uLnJhd0NvbGxlY3Rpb24oKTtcbiAgfSxcblxuICAvKipcbiAgICogQHN1bW1hcnkgUmV0dXJucyB0aGUgW2BEYmBdKGh0dHA6Ly9tb25nb2RiLmdpdGh1Yi5pby9ub2RlLW1vbmdvZGItbmF0aXZlLzMuMC9hcGkvRGIuaHRtbCkgb2JqZWN0IGNvcnJlc3BvbmRpbmcgdG8gdGhpcyBjb2xsZWN0aW9uJ3MgZGF0YWJhc2UgY29ubmVjdGlvbiBmcm9tIHRoZSBbbnBtIGBtb25nb2RiYCBkcml2ZXIgbW9kdWxlXShodHRwczovL3d3dy5ucG1qcy5jb20vcGFja2FnZS9tb25nb2RiKSB3aGljaCBpcyB3cmFwcGVkIGJ5IGBNb25nby5Db2xsZWN0aW9uYC5cbiAgICogQGxvY3VzIFNlcnZlclxuICAgKiBAbWVtYmVyb2YgTW9uZ28uQ29sbGVjdGlvblxuICAgKiBAaW5zdGFuY2VcbiAgICovXG4gIHJhd0RhdGFiYXNlKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBpZiAoISAoc2VsZi5fZHJpdmVyLm1vbmdvICYmIHNlbGYuX2RyaXZlci5tb25nby5kYikpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbiBvbmx5IGNhbGwgcmF3RGF0YWJhc2Ugb24gc2VydmVyIGNvbGxlY3Rpb25zXCIpO1xuICAgIH1cbiAgICByZXR1cm4gc2VsZi5fZHJpdmVyLm1vbmdvLmRiO1xuICB9XG59KTtcblxuLy8gQ29udmVydCB0aGUgY2FsbGJhY2sgdG8gbm90IHJldHVybiBhIHJlc3VsdCBpZiB0aGVyZSBpcyBhbiBlcnJvclxuZnVuY3Rpb24gd3JhcENhbGxiYWNrKGNhbGxiYWNrLCBjb252ZXJ0UmVzdWx0KSB7XG4gIHJldHVybiBjYWxsYmFjayAmJiBmdW5jdGlvbiAoZXJyb3IsIHJlc3VsdCkge1xuICAgIGlmIChlcnJvcikge1xuICAgICAgY2FsbGJhY2soZXJyb3IpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGNvbnZlcnRSZXN1bHQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgY2FsbGJhY2soZXJyb3IsIGNvbnZlcnRSZXN1bHQocmVzdWx0KSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNhbGxiYWNrKGVycm9yLCByZXN1bHQpO1xuICAgIH1cbiAgfTtcbn1cblxuLyoqXG4gKiBAc3VtbWFyeSBDcmVhdGUgYSBNb25nby1zdHlsZSBgT2JqZWN0SURgLiAgSWYgeW91IGRvbid0IHNwZWNpZnkgYSBgaGV4U3RyaW5nYCwgdGhlIGBPYmplY3RJRGAgd2lsbCBnZW5lcmF0ZWQgcmFuZG9tbHkgKG5vdCB1c2luZyBNb25nb0RCJ3MgSUQgY29uc3RydWN0aW9uIHJ1bGVzKS5cbiAqIEBsb2N1cyBBbnl3aGVyZVxuICogQGNsYXNzXG4gKiBAcGFyYW0ge1N0cmluZ30gW2hleFN0cmluZ10gT3B0aW9uYWwuICBUaGUgMjQtY2hhcmFjdGVyIGhleGFkZWNpbWFsIGNvbnRlbnRzIG9mIHRoZSBPYmplY3RJRCB0byBjcmVhdGVcbiAqL1xuTW9uZ28uT2JqZWN0SUQgPSBNb25nb0lELk9iamVjdElEO1xuXG4vKipcbiAqIEBzdW1tYXJ5IFRvIGNyZWF0ZSBhIGN1cnNvciwgdXNlIGZpbmQuIFRvIGFjY2VzcyB0aGUgZG9jdW1lbnRzIGluIGEgY3Vyc29yLCB1c2UgZm9yRWFjaCwgbWFwLCBvciBmZXRjaC5cbiAqIEBjbGFzc1xuICogQGluc3RhbmNlTmFtZSBjdXJzb3JcbiAqL1xuTW9uZ28uQ3Vyc29yID0gTG9jYWxDb2xsZWN0aW9uLkN1cnNvcjtcblxuLyoqXG4gKiBAZGVwcmVjYXRlZCBpbiAwLjkuMVxuICovXG5Nb25nby5Db2xsZWN0aW9uLkN1cnNvciA9IE1vbmdvLkN1cnNvcjtcblxuLyoqXG4gKiBAZGVwcmVjYXRlZCBpbiAwLjkuMVxuICovXG5Nb25nby5Db2xsZWN0aW9uLk9iamVjdElEID0gTW9uZ28uT2JqZWN0SUQ7XG5cbi8qKlxuICogQGRlcHJlY2F0ZWQgaW4gMC45LjFcbiAqL1xuTWV0ZW9yLkNvbGxlY3Rpb24gPSBNb25nby5Db2xsZWN0aW9uO1xuXG4vLyBBbGxvdyBkZW55IHN0dWZmIGlzIG5vdyBpbiB0aGUgYWxsb3ctZGVueSBwYWNrYWdlXG5PYmplY3QuYXNzaWduKFxuICBNZXRlb3IuQ29sbGVjdGlvbi5wcm90b3R5cGUsXG4gIEFsbG93RGVueS5Db2xsZWN0aW9uUHJvdG90eXBlXG4pO1xuXG5mdW5jdGlvbiBwb3BDYWxsYmFja0Zyb21BcmdzKGFyZ3MpIHtcbiAgLy8gUHVsbCBvZmYgYW55IGNhbGxiYWNrIChvciBwZXJoYXBzIGEgJ2NhbGxiYWNrJyB2YXJpYWJsZSB0aGF0IHdhcyBwYXNzZWRcbiAgLy8gaW4gdW5kZWZpbmVkLCBsaWtlIGhvdyAndXBzZXJ0JyBkb2VzIGl0KS5cbiAgaWYgKGFyZ3MubGVuZ3RoICYmXG4gICAgICAoYXJnc1thcmdzLmxlbmd0aCAtIDFdID09PSB1bmRlZmluZWQgfHxcbiAgICAgICBhcmdzW2FyZ3MubGVuZ3RoIC0gMV0gaW5zdGFuY2VvZiBGdW5jdGlvbikpIHtcbiAgICByZXR1cm4gYXJncy5wb3AoKTtcbiAgfVxufVxuIiwiLyoqXG4gKiBAc3VtbWFyeSBBbGxvd3MgZm9yIHVzZXIgc3BlY2lmaWVkIGNvbm5lY3Rpb24gb3B0aW9uc1xuICogQGV4YW1wbGUgaHR0cDovL21vbmdvZGIuZ2l0aHViLmlvL25vZGUtbW9uZ29kYi1uYXRpdmUvMy4wL3JlZmVyZW5jZS9jb25uZWN0aW5nL2Nvbm5lY3Rpb24tc2V0dGluZ3MvXG4gKiBAbG9jdXMgU2VydmVyXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBVc2VyIHNwZWNpZmllZCBNb25nbyBjb25uZWN0aW9uIG9wdGlvbnNcbiAqL1xuTW9uZ28uc2V0Q29ubmVjdGlvbk9wdGlvbnMgPSBmdW5jdGlvbiBzZXRDb25uZWN0aW9uT3B0aW9ucyAob3B0aW9ucykge1xuICBjaGVjayhvcHRpb25zLCBPYmplY3QpO1xuICBNb25nby5fY29ubmVjdGlvbk9wdGlvbnMgPSBvcHRpb25zO1xufTsiXX0=
