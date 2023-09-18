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

},"oplog_observe_driver.js":function module(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/mongo/oplog_observe_driver.js                                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
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
        // Is this a modifier ($set/$unset, which may require us to poll the
        // database to figure out if the whole document matches the selector) or
        // a replacement (in which case we can just directly re-evaluate the
        // selector)?
        var isReplace = !_.has(op.o, '$set') && !_.has(op.o, '$unset'); // If this modifier modifies something inside an EJSON custom type (ie,
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
              console.error(error);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvbW9uZ28vbW9uZ29fZHJpdmVyLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9tb25nby9vcGxvZ190YWlsaW5nLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9tb25nby9vYnNlcnZlX211bHRpcGxleC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvbW9uZ28vZG9jX2ZldGNoZXIuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL21vbmdvL3BvbGxpbmdfb2JzZXJ2ZV9kcml2ZXIuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL21vbmdvL29wbG9nX29ic2VydmVfZHJpdmVyLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9tb25nby9sb2NhbF9jb2xsZWN0aW9uX2RyaXZlci5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvbW9uZ28vcmVtb3RlX2NvbGxlY3Rpb25fZHJpdmVyLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9tb25nby9jb2xsZWN0aW9uLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9tb25nby9jb25uZWN0aW9uX29wdGlvbnMuanMiXSwibmFtZXMiOlsiRG9jRmV0Y2hlciIsIm1vZHVsZTEiLCJsaW5rIiwidiIsIk1vbmdvREIiLCJOcG1Nb2R1bGVNb25nb2RiIiwiRnV0dXJlIiwiTnBtIiwicmVxdWlyZSIsIk1vbmdvSW50ZXJuYWxzIiwiTnBtTW9kdWxlcyIsIm1vbmdvZGIiLCJ2ZXJzaW9uIiwiTnBtTW9kdWxlTW9uZ29kYlZlcnNpb24iLCJtb2R1bGUiLCJOcG1Nb2R1bGUiLCJyZXBsYWNlTmFtZXMiLCJmaWx0ZXIiLCJ0aGluZyIsIl8iLCJpc0FycmF5IiwibWFwIiwiYmluZCIsInJldCIsImVhY2giLCJ2YWx1ZSIsImtleSIsIlRpbWVzdGFtcCIsInByb3RvdHlwZSIsImNsb25lIiwibWFrZU1vbmdvTGVnYWwiLCJuYW1lIiwidW5tYWtlTW9uZ29MZWdhbCIsInN1YnN0ciIsInJlcGxhY2VNb25nb0F0b21XaXRoTWV0ZW9yIiwiZG9jdW1lbnQiLCJCaW5hcnkiLCJidWZmZXIiLCJVaW50OEFycmF5IiwiT2JqZWN0SUQiLCJNb25nbyIsInRvSGV4U3RyaW5nIiwiRGVjaW1hbDEyOCIsIkRlY2ltYWwiLCJ0b1N0cmluZyIsInNpemUiLCJFSlNPTiIsImZyb21KU09OVmFsdWUiLCJ1bmRlZmluZWQiLCJyZXBsYWNlTWV0ZW9yQXRvbVdpdGhNb25nbyIsImlzQmluYXJ5IiwiZnJvbVN0cmluZyIsIl9pc0N1c3RvbVR5cGUiLCJ0b0pTT05WYWx1ZSIsInJlcGxhY2VUeXBlcyIsImF0b21UcmFuc2Zvcm1lciIsInJlcGxhY2VkVG9wTGV2ZWxBdG9tIiwidmFsIiwidmFsUmVwbGFjZWQiLCJNb25nb0Nvbm5lY3Rpb24iLCJ1cmwiLCJvcHRpb25zIiwic2VsZiIsIl9vYnNlcnZlTXVsdGlwbGV4ZXJzIiwiX29uRmFpbG92ZXJIb29rIiwiSG9vayIsIm1vbmdvT3B0aW9ucyIsIk9iamVjdCIsImFzc2lnbiIsImF1dG9SZWNvbm5lY3QiLCJyZWNvbm5lY3RUcmllcyIsIkluZmluaXR5IiwiaWdub3JlVW5kZWZpbmVkIiwidXNlTmV3VXJsUGFyc2VyIiwiX2Nvbm5lY3Rpb25PcHRpb25zIiwidGVzdCIsIm5hdGl2ZV9wYXJzZXIiLCJoYXMiLCJwb29sU2l6ZSIsImRiIiwiX3ByaW1hcnkiLCJfb3Bsb2dIYW5kbGUiLCJfZG9jRmV0Y2hlciIsImNvbm5lY3RGdXR1cmUiLCJjb25uZWN0IiwiTWV0ZW9yIiwiYmluZEVudmlyb25tZW50IiwiZXJyIiwiY2xpZW50Iiwic2VydmVyQ29uZmlnIiwiaXNNYXN0ZXJEb2MiLCJwcmltYXJ5Iiwib24iLCJraW5kIiwiZG9jIiwiY2FsbGJhY2siLCJtZSIsInJlc29sdmVyIiwid2FpdCIsIm9wbG9nVXJsIiwiUGFja2FnZSIsIk9wbG9nSGFuZGxlIiwiZGF0YWJhc2VOYW1lIiwiY2xvc2UiLCJFcnJvciIsIm9wbG9nSGFuZGxlIiwic3RvcCIsIndyYXAiLCJyYXdDb2xsZWN0aW9uIiwiY29sbGVjdGlvbk5hbWUiLCJmdXR1cmUiLCJjb2xsZWN0aW9uIiwiX2NyZWF0ZUNhcHBlZENvbGxlY3Rpb24iLCJieXRlU2l6ZSIsIm1heERvY3VtZW50cyIsImNyZWF0ZUNvbGxlY3Rpb24iLCJjYXBwZWQiLCJtYXgiLCJfbWF5YmVCZWdpbldyaXRlIiwiZmVuY2UiLCJERFBTZXJ2ZXIiLCJfQ3VycmVudFdyaXRlRmVuY2UiLCJnZXQiLCJiZWdpbldyaXRlIiwiY29tbWl0dGVkIiwiX29uRmFpbG92ZXIiLCJyZWdpc3RlciIsIndyaXRlQ2FsbGJhY2siLCJ3cml0ZSIsInJlZnJlc2giLCJyZXN1bHQiLCJyZWZyZXNoRXJyIiwiYmluZEVudmlyb25tZW50Rm9yV3JpdGUiLCJfaW5zZXJ0IiwiY29sbGVjdGlvbl9uYW1lIiwic2VuZEVycm9yIiwiZSIsIl9leHBlY3RlZEJ5VGVzdCIsIkxvY2FsQ29sbGVjdGlvbiIsIl9pc1BsYWluT2JqZWN0IiwiaWQiLCJfaWQiLCJpbnNlcnQiLCJzYWZlIiwiX3JlZnJlc2giLCJzZWxlY3RvciIsInJlZnJlc2hLZXkiLCJzcGVjaWZpY0lkcyIsIl9pZHNNYXRjaGVkQnlTZWxlY3RvciIsImV4dGVuZCIsIl9yZW1vdmUiLCJ3cmFwcGVkQ2FsbGJhY2siLCJkcml2ZXJSZXN1bHQiLCJ0cmFuc2Zvcm1SZXN1bHQiLCJudW1iZXJBZmZlY3RlZCIsInJlbW92ZSIsIl9kcm9wQ29sbGVjdGlvbiIsImNiIiwiZHJvcENvbGxlY3Rpb24iLCJkcm9wIiwiX2Ryb3BEYXRhYmFzZSIsImRyb3BEYXRhYmFzZSIsIl91cGRhdGUiLCJtb2QiLCJGdW5jdGlvbiIsIm1vbmdvT3B0cyIsImFycmF5RmlsdGVycyIsInVwc2VydCIsIm11bHRpIiwiZnVsbFJlc3VsdCIsIm1vbmdvU2VsZWN0b3IiLCJtb25nb01vZCIsImlzTW9kaWZ5IiwiX2lzTW9kaWZpY2F0aW9uTW9kIiwiX2ZvcmJpZFJlcGxhY2UiLCJrbm93bklkIiwibmV3RG9jIiwiX2NyZWF0ZVVwc2VydERvY3VtZW50IiwiaW5zZXJ0ZWRJZCIsImdlbmVyYXRlZElkIiwic2ltdWxhdGVVcHNlcnRXaXRoSW5zZXJ0ZWRJZCIsImVycm9yIiwiX3JldHVybk9iamVjdCIsImhhc093blByb3BlcnR5IiwiJHNldE9uSW5zZXJ0IiwidXBkYXRlIiwibWV0ZW9yUmVzdWx0IiwibW9uZ29SZXN1bHQiLCJ1cHNlcnRlZCIsImxlbmd0aCIsIm4iLCJOVU1fT1BUSU1JU1RJQ19UUklFUyIsIl9pc0Nhbm5vdENoYW5nZUlkRXJyb3IiLCJlcnJtc2ciLCJpbmRleE9mIiwibW9uZ29PcHRzRm9yVXBkYXRlIiwibW9uZ29PcHRzRm9ySW5zZXJ0IiwicmVwbGFjZW1lbnRXaXRoSWQiLCJ0cmllcyIsImRvVXBkYXRlIiwiZG9Db25kaXRpb25hbEluc2VydCIsIm1ldGhvZCIsIndyYXBBc3luYyIsImFwcGx5IiwiYXJndW1lbnRzIiwiZmluZCIsIkN1cnNvciIsIkN1cnNvckRlc2NyaXB0aW9uIiwiZmluZE9uZSIsImxpbWl0IiwiZmV0Y2giLCJfZW5zdXJlSW5kZXgiLCJpbmRleCIsImluZGV4TmFtZSIsImVuc3VyZUluZGV4IiwiRXhjZXB0aW9uIiwiX2Ryb3BJbmRleCIsImRyb3BJbmRleCIsIkNvbGxlY3Rpb24iLCJfcmV3cml0ZVNlbGVjdG9yIiwibW9uZ28iLCJjdXJzb3JEZXNjcmlwdGlvbiIsIl9tb25nbyIsIl9jdXJzb3JEZXNjcmlwdGlvbiIsIl9zeW5jaHJvbm91c0N1cnNvciIsIlN5bWJvbCIsIml0ZXJhdG9yIiwidGFpbGFibGUiLCJfY3JlYXRlU3luY2hyb25vdXNDdXJzb3IiLCJzZWxmRm9ySXRlcmF0aW9uIiwidXNlVHJhbnNmb3JtIiwicmV3aW5kIiwiZ2V0VHJhbnNmb3JtIiwidHJhbnNmb3JtIiwiX3B1Ymxpc2hDdXJzb3IiLCJzdWIiLCJfZ2V0Q29sbGVjdGlvbk5hbWUiLCJvYnNlcnZlIiwiY2FsbGJhY2tzIiwiX29ic2VydmVGcm9tT2JzZXJ2ZUNoYW5nZXMiLCJvYnNlcnZlQ2hhbmdlcyIsIm1ldGhvZHMiLCJvcmRlcmVkIiwiX29ic2VydmVDaGFuZ2VzQ2FsbGJhY2tzQXJlT3JkZXJlZCIsImV4Y2VwdGlvbk5hbWUiLCJmb3JFYWNoIiwiX29ic2VydmVDaGFuZ2VzIiwicGljayIsImN1cnNvck9wdGlvbnMiLCJzb3J0Iiwic2tpcCIsInByb2plY3Rpb24iLCJmaWVsZHMiLCJhd2FpdGRhdGEiLCJudW1iZXJPZlJldHJpZXMiLCJPUExPR19DT0xMRUNUSU9OIiwidHMiLCJvcGxvZ1JlcGxheSIsImRiQ3Vyc29yIiwibWF4VGltZU1zIiwibWF4VGltZU1TIiwiaGludCIsIlN5bmNocm9ub3VzQ3Vyc29yIiwiX2RiQ3Vyc29yIiwiX3NlbGZGb3JJdGVyYXRpb24iLCJfdHJhbnNmb3JtIiwid3JhcFRyYW5zZm9ybSIsIl9zeW5jaHJvbm91c0NvdW50IiwiY291bnQiLCJfdmlzaXRlZElkcyIsIl9JZE1hcCIsIl9yYXdOZXh0T2JqZWN0UHJvbWlzZSIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwibmV4dCIsIl9uZXh0T2JqZWN0UHJvbWlzZSIsInNldCIsIl9uZXh0T2JqZWN0UHJvbWlzZVdpdGhUaW1lb3V0IiwidGltZW91dE1TIiwibmV4dE9iamVjdFByb21pc2UiLCJ0aW1lb3V0RXJyIiwidGltZW91dFByb21pc2UiLCJ0aW1lciIsInNldFRpbWVvdXQiLCJyYWNlIiwiY2F0Y2giLCJfbmV4dE9iamVjdCIsImF3YWl0IiwidGhpc0FyZyIsIl9yZXdpbmQiLCJjYWxsIiwicmVzIiwicHVzaCIsImlkZW50aXR5IiwiYXBwbHlTa2lwTGltaXQiLCJnZXRSYXdPYmplY3RzIiwicmVzdWx0cyIsImRvbmUiLCJ0YWlsIiwiZG9jQ2FsbGJhY2siLCJjdXJzb3IiLCJzdG9wcGVkIiwibGFzdFRTIiwibG9vcCIsIm5ld1NlbGVjdG9yIiwiJGd0IiwiZGVmZXIiLCJfb2JzZXJ2ZUNoYW5nZXNUYWlsYWJsZSIsIm9ic2VydmVLZXkiLCJzdHJpbmdpZnkiLCJtdWx0aXBsZXhlciIsIm9ic2VydmVEcml2ZXIiLCJmaXJzdEhhbmRsZSIsIl9ub1lpZWxkc0FsbG93ZWQiLCJPYnNlcnZlTXVsdGlwbGV4ZXIiLCJvblN0b3AiLCJvYnNlcnZlSGFuZGxlIiwiT2JzZXJ2ZUhhbmRsZSIsIm1hdGNoZXIiLCJzb3J0ZXIiLCJjYW5Vc2VPcGxvZyIsImFsbCIsIl90ZXN0T25seVBvbGxDYWxsYmFjayIsIk1pbmltb25nbyIsIk1hdGNoZXIiLCJPcGxvZ09ic2VydmVEcml2ZXIiLCJjdXJzb3JTdXBwb3J0ZWQiLCJTb3J0ZXIiLCJmIiwiZHJpdmVyQ2xhc3MiLCJQb2xsaW5nT2JzZXJ2ZURyaXZlciIsIm1vbmdvSGFuZGxlIiwiX29ic2VydmVEcml2ZXIiLCJhZGRIYW5kbGVBbmRTZW5kSW5pdGlhbEFkZHMiLCJsaXN0ZW5BbGwiLCJsaXN0ZW5DYWxsYmFjayIsImxpc3RlbmVycyIsImZvckVhY2hUcmlnZ2VyIiwidHJpZ2dlciIsIl9JbnZhbGlkYXRpb25Dcm9zc2JhciIsImxpc3RlbiIsImxpc3RlbmVyIiwidHJpZ2dlckNhbGxiYWNrIiwiYWRkZWRCZWZvcmUiLCJhZGRlZCIsIk1vbmdvVGltZXN0YW1wIiwiQ29ubmVjdGlvbiIsIlRPT19GQVJfQkVISU5EIiwicHJvY2VzcyIsImVudiIsIk1FVEVPUl9PUExPR19UT09fRkFSX0JFSElORCIsIlRBSUxfVElNRU9VVCIsIk1FVEVPUl9PUExPR19UQUlMX1RJTUVPVVQiLCJzaG93VFMiLCJnZXRIaWdoQml0cyIsImdldExvd0JpdHMiLCJpZEZvck9wIiwib3AiLCJvIiwibzIiLCJkYk5hbWUiLCJfb3Bsb2dVcmwiLCJfZGJOYW1lIiwiX29wbG9nTGFzdEVudHJ5Q29ubmVjdGlvbiIsIl9vcGxvZ1RhaWxDb25uZWN0aW9uIiwiX3N0b3BwZWQiLCJfdGFpbEhhbmRsZSIsIl9yZWFkeUZ1dHVyZSIsIl9jcm9zc2JhciIsIl9Dcm9zc2JhciIsImZhY3RQYWNrYWdlIiwiZmFjdE5hbWUiLCJfYmFzZU9wbG9nU2VsZWN0b3IiLCJucyIsIlJlZ0V4cCIsIl9lc2NhcGVSZWdFeHAiLCJqb2luIiwiJG9yIiwiJGluIiwiJGV4aXN0cyIsIl9jYXRjaGluZ1VwRnV0dXJlcyIsIl9sYXN0UHJvY2Vzc2VkVFMiLCJfb25Ta2lwcGVkRW50cmllc0hvb2siLCJkZWJ1Z1ByaW50RXhjZXB0aW9ucyIsIl9lbnRyeVF1ZXVlIiwiX0RvdWJsZUVuZGVkUXVldWUiLCJfd29ya2VyQWN0aXZlIiwiX3N0YXJ0VGFpbGluZyIsIm9uT3Bsb2dFbnRyeSIsIm9yaWdpbmFsQ2FsbGJhY2siLCJub3RpZmljYXRpb24iLCJfZGVidWciLCJsaXN0ZW5IYW5kbGUiLCJvblNraXBwZWRFbnRyaWVzIiwid2FpdFVudGlsQ2F1Z2h0VXAiLCJsYXN0RW50cnkiLCIkbmF0dXJhbCIsIl9zbGVlcEZvck1zIiwibGVzc1RoYW5PckVxdWFsIiwiaW5zZXJ0QWZ0ZXIiLCJncmVhdGVyVGhhbiIsInNwbGljZSIsIm1vbmdvZGJVcmkiLCJwYXJzZSIsImRhdGFiYXNlIiwiYWRtaW4iLCJjb21tYW5kIiwiaXNtYXN0ZXIiLCJzZXROYW1lIiwibGFzdE9wbG9nRW50cnkiLCJvcGxvZ1NlbGVjdG9yIiwiX21heWJlU3RhcnRXb3JrZXIiLCJyZXR1cm4iLCJoYW5kbGVEb2MiLCJhcHBseU9wcyIsIm5leHRUaW1lc3RhbXAiLCJhZGQiLCJPTkUiLCJzdGFydHNXaXRoIiwic2xpY2UiLCJmaXJlIiwiaXNFbXB0eSIsInBvcCIsImNsZWFyIiwiX3NldExhc3RQcm9jZXNzZWRUUyIsInNoaWZ0Iiwic2VxdWVuY2VyIiwiX2RlZmluZVRvb0ZhckJlaGluZCIsIl9yZXNldFRvb0ZhckJlaGluZCIsIkZhY3RzIiwiaW5jcmVtZW50U2VydmVyRmFjdCIsIl9vcmRlcmVkIiwiX29uU3RvcCIsIl9xdWV1ZSIsIl9TeW5jaHJvbm91c1F1ZXVlIiwiX2hhbmRsZXMiLCJfY2FjaGUiLCJfQ2FjaGluZ0NoYW5nZU9ic2VydmVyIiwiX2FkZEhhbmRsZVRhc2tzU2NoZWR1bGVkQnV0Tm90UGVyZm9ybWVkIiwiY2FsbGJhY2tOYW1lcyIsImNhbGxiYWNrTmFtZSIsIl9hcHBseUNhbGxiYWNrIiwidG9BcnJheSIsImhhbmRsZSIsInNhZmVUb1J1blRhc2siLCJydW5UYXNrIiwiX3NlbmRBZGRzIiwicmVtb3ZlSGFuZGxlIiwiX3JlYWR5IiwiX3N0b3AiLCJmcm9tUXVlcnlFcnJvciIsInJlYWR5IiwicXVldWVUYXNrIiwicXVlcnlFcnJvciIsInRocm93Iiwib25GbHVzaCIsImlzUmVzb2x2ZWQiLCJhcmdzIiwiYXBwbHlDaGFuZ2UiLCJrZXlzIiwiaGFuZGxlSWQiLCJfYWRkZWRCZWZvcmUiLCJfYWRkZWQiLCJkb2NzIiwibmV4dE9ic2VydmVIYW5kbGVJZCIsIl9tdWx0aXBsZXhlciIsImJlZm9yZSIsImV4cG9ydCIsIkZpYmVyIiwiY29uc3RydWN0b3IiLCJtb25nb0Nvbm5lY3Rpb24iLCJfbW9uZ29Db25uZWN0aW9uIiwiX2NhbGxiYWNrc0Zvck9wIiwiTWFwIiwiY2hlY2siLCJTdHJpbmciLCJkZWxldGUiLCJydW4iLCJQT0xMSU5HX1RIUk9UVExFX01TIiwiTUVURU9SX1BPTExJTkdfVEhST1RUTEVfTVMiLCJQT0xMSU5HX0lOVEVSVkFMX01TIiwiTUVURU9SX1BPTExJTkdfSU5URVJWQUxfTVMiLCJfbW9uZ29IYW5kbGUiLCJfc3RvcENhbGxiYWNrcyIsIl9yZXN1bHRzIiwiX3BvbGxzU2NoZWR1bGVkQnV0Tm90U3RhcnRlZCIsIl9wZW5kaW5nV3JpdGVzIiwiX2Vuc3VyZVBvbGxJc1NjaGVkdWxlZCIsInRocm90dGxlIiwiX3VudGhyb3R0bGVkRW5zdXJlUG9sbElzU2NoZWR1bGVkIiwicG9sbGluZ1Rocm90dGxlTXMiLCJfdGFza1F1ZXVlIiwibGlzdGVuZXJzSGFuZGxlIiwicG9sbGluZ0ludGVydmFsIiwicG9sbGluZ0ludGVydmFsTXMiLCJfcG9sbGluZ0ludGVydmFsIiwiaW50ZXJ2YWxIYW5kbGUiLCJzZXRJbnRlcnZhbCIsImNsZWFySW50ZXJ2YWwiLCJfcG9sbE1vbmdvIiwiX3N1c3BlbmRQb2xsaW5nIiwiX3Jlc3VtZVBvbGxpbmciLCJmaXJzdCIsIm5ld1Jlc3VsdHMiLCJvbGRSZXN1bHRzIiwid3JpdGVzRm9yQ3ljbGUiLCJjb2RlIiwiSlNPTiIsIm1lc3NhZ2UiLCJBcnJheSIsIl9kaWZmUXVlcnlDaGFuZ2VzIiwidyIsImMiLCJQSEFTRSIsIlFVRVJZSU5HIiwiRkVUQ0hJTkciLCJTVEVBRFkiLCJTd2l0Y2hlZFRvUXVlcnkiLCJmaW5pc2hJZk5lZWRUb1BvbGxRdWVyeSIsImN1cnJlbnRJZCIsIl91c2VzT3Bsb2ciLCJjb21wYXJhdG9yIiwiZ2V0Q29tcGFyYXRvciIsImhlYXBPcHRpb25zIiwiSWRNYXAiLCJfbGltaXQiLCJfY29tcGFyYXRvciIsIl9zb3J0ZXIiLCJfdW5wdWJsaXNoZWRCdWZmZXIiLCJNaW5NYXhIZWFwIiwiX3B1Ymxpc2hlZCIsIk1heEhlYXAiLCJfc2FmZUFwcGVuZFRvQnVmZmVyIiwiX3N0b3BIYW5kbGVzIiwiX3JlZ2lzdGVyUGhhc2VDaGFuZ2UiLCJfbWF0Y2hlciIsIl9wcm9qZWN0aW9uRm4iLCJfY29tcGlsZVByb2plY3Rpb24iLCJfc2hhcmVkUHJvamVjdGlvbiIsImNvbWJpbmVJbnRvUHJvamVjdGlvbiIsIl9zaGFyZWRQcm9qZWN0aW9uRm4iLCJfbmVlZFRvRmV0Y2giLCJfY3VycmVudGx5RmV0Y2hpbmciLCJfZmV0Y2hHZW5lcmF0aW9uIiwiX3JlcXVlcnlXaGVuRG9uZVRoaXNRdWVyeSIsIl93cml0ZXNUb0NvbW1pdFdoZW5XZVJlYWNoU3RlYWR5IiwiX25lZWRUb1BvbGxRdWVyeSIsIl9waGFzZSIsIl9oYW5kbGVPcGxvZ0VudHJ5UXVlcnlpbmciLCJfaGFuZGxlT3Bsb2dFbnRyeVN0ZWFkeU9yRmV0Y2hpbmciLCJmaXJlZCIsIl9vcGxvZ09ic2VydmVEcml2ZXJzIiwib25CZWZvcmVGaXJlIiwiZHJpdmVycyIsImRyaXZlciIsIl9ydW5Jbml0aWFsUXVlcnkiLCJfYWRkUHVibGlzaGVkIiwib3ZlcmZsb3dpbmdEb2NJZCIsIm1heEVsZW1lbnRJZCIsIm92ZXJmbG93aW5nRG9jIiwiZXF1YWxzIiwicmVtb3ZlZCIsIl9hZGRCdWZmZXJlZCIsIl9yZW1vdmVQdWJsaXNoZWQiLCJlbXB0eSIsIm5ld0RvY0lkIiwibWluRWxlbWVudElkIiwiX3JlbW92ZUJ1ZmZlcmVkIiwiX2NoYW5nZVB1Ymxpc2hlZCIsIm9sZERvYyIsInByb2plY3RlZE5ldyIsInByb2plY3RlZE9sZCIsImNoYW5nZWQiLCJEaWZmU2VxdWVuY2UiLCJtYWtlQ2hhbmdlZEZpZWxkcyIsIm1heEJ1ZmZlcmVkSWQiLCJfYWRkTWF0Y2hpbmciLCJtYXhQdWJsaXNoZWQiLCJtYXhCdWZmZXJlZCIsInRvUHVibGlzaCIsImNhbkFwcGVuZFRvQnVmZmVyIiwiY2FuSW5zZXJ0SW50b0J1ZmZlciIsInRvQnVmZmVyIiwiX3JlbW92ZU1hdGNoaW5nIiwiX2hhbmRsZURvYyIsIm1hdGNoZXNOb3ciLCJkb2N1bWVudE1hdGNoZXMiLCJwdWJsaXNoZWRCZWZvcmUiLCJidWZmZXJlZEJlZm9yZSIsImNhY2hlZEJlZm9yZSIsIm1pbkJ1ZmZlcmVkIiwic3RheXNJblB1Ymxpc2hlZCIsInN0YXlzSW5CdWZmZXIiLCJfZmV0Y2hNb2RpZmllZERvY3VtZW50cyIsInRoaXNHZW5lcmF0aW9uIiwid2FpdGluZyIsImZ1dCIsIl9iZVN0ZWFkeSIsIndyaXRlcyIsImlzUmVwbGFjZSIsImNhbkRpcmVjdGx5TW9kaWZ5RG9jIiwibW9kaWZpZXJDYW5CZURpcmVjdGx5QXBwbGllZCIsIl9tb2RpZnkiLCJjYW5CZWNvbWVUcnVlQnlNb2RpZmllciIsImFmZmVjdGVkQnlNb2RpZmllciIsIl9ydW5RdWVyeSIsImluaXRpYWwiLCJfZG9uZVF1ZXJ5aW5nIiwiX3BvbGxRdWVyeSIsIm5ld0J1ZmZlciIsIl9jdXJzb3JGb3JRdWVyeSIsImkiLCJfcHVibGlzaE5ld1Jlc3VsdHMiLCJvcHRpb25zT3ZlcndyaXRlIiwiZGVzY3JpcHRpb24iLCJpZHNUb1JlbW92ZSIsImNvbnNvbGUiLCJfb3Bsb2dFbnRyeUhhbmRsZSIsIl9saXN0ZW5lcnNIYW5kbGUiLCJwaGFzZSIsIm5vdyIsIkRhdGUiLCJ0aW1lRGlmZiIsIl9waGFzZVN0YXJ0VGltZSIsImRpc2FibGVPcGxvZyIsIl9kaXNhYmxlT3Bsb2ciLCJfY2hlY2tTdXBwb3J0ZWRQcm9qZWN0aW9uIiwiaGFzV2hlcmUiLCJoYXNHZW9RdWVyeSIsIm1vZGlmaWVyIiwib3BlcmF0aW9uIiwiZmllbGQiLCJMb2NhbENvbGxlY3Rpb25Ecml2ZXIiLCJub0Nvbm5Db2xsZWN0aW9ucyIsImNyZWF0ZSIsIm9wZW4iLCJjb25uIiwiZW5zdXJlQ29sbGVjdGlvbiIsIl9tb25nb19saXZlZGF0YV9jb2xsZWN0aW9ucyIsImNvbGxlY3Rpb25zIiwiUmVtb3RlQ29sbGVjdGlvbkRyaXZlciIsIm1vbmdvX3VybCIsIm0iLCJkZWZhdWx0UmVtb3RlQ29sbGVjdGlvbkRyaXZlciIsIm9uY2UiLCJjb25uZWN0aW9uT3B0aW9ucyIsIm1vbmdvVXJsIiwiTU9OR09fVVJMIiwiTU9OR09fT1BMT0dfVVJMIiwiX29iamVjdFNwcmVhZCIsImRlZmF1bHQiLCJjb25uZWN0aW9uIiwibWFuYWdlciIsImlkR2VuZXJhdGlvbiIsIl9kcml2ZXIiLCJfcHJldmVudEF1dG9wdWJsaXNoIiwiX21ha2VOZXdJRCIsInNyYyIsIkREUCIsInJhbmRvbVN0cmVhbSIsIlJhbmRvbSIsImluc2VjdXJlIiwiaGV4U3RyaW5nIiwiX2Nvbm5lY3Rpb24iLCJpc0NsaWVudCIsInNlcnZlciIsIl9jb2xsZWN0aW9uIiwiX25hbWUiLCJfbWF5YmVTZXRVcFJlcGxpY2F0aW9uIiwiZGVmaW5lTXV0YXRpb25NZXRob2RzIiwiX2RlZmluZU11dGF0aW9uTWV0aG9kcyIsInVzZUV4aXN0aW5nIiwiX3N1cHByZXNzU2FtZU5hbWVFcnJvciIsImF1dG9wdWJsaXNoIiwicHVibGlzaCIsImlzX2F1dG8iLCJyZWdpc3RlclN0b3JlIiwib2siLCJiZWdpblVwZGF0ZSIsImJhdGNoU2l6ZSIsInJlc2V0IiwicGF1c2VPYnNlcnZlcnMiLCJtc2ciLCJtb25nb0lkIiwiTW9uZ29JRCIsImlkUGFyc2UiLCJyZXBsYWNlIiwiJHVuc2V0IiwiJHNldCIsImVuZFVwZGF0ZSIsInJlc3VtZU9ic2VydmVycyIsInNhdmVPcmlnaW5hbHMiLCJyZXRyaWV2ZU9yaWdpbmFscyIsImdldERvYyIsIl9nZXRDb2xsZWN0aW9uIiwid2FybiIsImxvZyIsIl9nZXRGaW5kU2VsZWN0b3IiLCJfZ2V0RmluZE9wdGlvbnMiLCJNYXRjaCIsIk9wdGlvbmFsIiwiT2JqZWN0SW5jbHVkaW5nIiwiT25lT2YiLCJOdW1iZXIiLCJmYWxsYmFja0lkIiwiX3NlbGVjdG9ySXNJZCIsImdldFByb3RvdHlwZU9mIiwiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyIsImdlbmVyYXRlSWQiLCJfaXNSZW1vdGVDb2xsZWN0aW9uIiwiZW5jbG9zaW5nIiwiX0N1cnJlbnRNZXRob2RJbnZvY2F0aW9uIiwiY2hvb3NlUmV0dXJuVmFsdWVGcm9tQ29sbGVjdGlvblJlc3VsdCIsIndyYXBDYWxsYmFjayIsIl9jYWxsTXV0YXRvck1ldGhvZCIsIm9wdGlvbnNBbmRDYWxsYmFjayIsInBvcENhbGxiYWNrRnJvbUFyZ3MiLCJyYXdEYXRhYmFzZSIsImNvbnZlcnRSZXN1bHQiLCJBbGxvd0RlbnkiLCJDb2xsZWN0aW9uUHJvdG90eXBlIiwic2V0Q29ubmVjdGlvbk9wdGlvbnMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxNQUFJQSxVQUFKO0FBQWVDLFNBQU8sQ0FBQ0MsSUFBUixDQUFhLGtCQUFiLEVBQWdDO0FBQUNGLGNBQVUsQ0FBQ0csQ0FBRCxFQUFHO0FBQUNILGdCQUFVLEdBQUNHLENBQVg7QUFBYTs7QUFBNUIsR0FBaEMsRUFBOEQsQ0FBOUQ7O0FBQWY7Ozs7Ozs7O0FBU0EsTUFBSUMsT0FBTyxHQUFHQyxnQkFBZDs7QUFDQSxNQUFJQyxNQUFNLEdBQUdDLEdBQUcsQ0FBQ0MsT0FBSixDQUFZLGVBQVosQ0FBYjs7QUFHQUMsZ0JBQWMsR0FBRyxFQUFqQjtBQUVBQSxnQkFBYyxDQUFDQyxVQUFmLEdBQTRCO0FBQzFCQyxXQUFPLEVBQUU7QUFDUEMsYUFBTyxFQUFFQyx1QkFERjtBQUVQQyxZQUFNLEVBQUVWO0FBRkQ7QUFEaUIsR0FBNUIsQyxDQU9BO0FBQ0E7QUFDQTtBQUNBOztBQUNBSyxnQkFBYyxDQUFDTSxTQUFmLEdBQTJCWCxPQUEzQixDLENBRUE7QUFDQTs7QUFDQSxNQUFJWSxZQUFZLEdBQUcsVUFBVUMsTUFBVixFQUFrQkMsS0FBbEIsRUFBeUI7QUFDMUMsUUFBSSxPQUFPQSxLQUFQLEtBQWlCLFFBQWpCLElBQTZCQSxLQUFLLEtBQUssSUFBM0MsRUFBaUQ7QUFDL0MsVUFBSUMsQ0FBQyxDQUFDQyxPQUFGLENBQVVGLEtBQVYsQ0FBSixFQUFzQjtBQUNwQixlQUFPQyxDQUFDLENBQUNFLEdBQUYsQ0FBTUgsS0FBTixFQUFhQyxDQUFDLENBQUNHLElBQUYsQ0FBT04sWUFBUCxFQUFxQixJQUFyQixFQUEyQkMsTUFBM0IsQ0FBYixDQUFQO0FBQ0Q7O0FBQ0QsVUFBSU0sR0FBRyxHQUFHLEVBQVY7O0FBQ0FKLE9BQUMsQ0FBQ0ssSUFBRixDQUFPTixLQUFQLEVBQWMsVUFBVU8sS0FBVixFQUFpQkMsR0FBakIsRUFBc0I7QUFDbENILFdBQUcsQ0FBQ04sTUFBTSxDQUFDUyxHQUFELENBQVAsQ0FBSCxHQUFtQlYsWUFBWSxDQUFDQyxNQUFELEVBQVNRLEtBQVQsQ0FBL0I7QUFDRCxPQUZEOztBQUdBLGFBQU9GLEdBQVA7QUFDRDs7QUFDRCxXQUFPTCxLQUFQO0FBQ0QsR0FaRCxDLENBY0E7QUFDQTtBQUNBOzs7QUFDQWQsU0FBTyxDQUFDdUIsU0FBUixDQUFrQkMsU0FBbEIsQ0FBNEJDLEtBQTVCLEdBQW9DLFlBQVk7QUFDOUM7QUFDQSxXQUFPLElBQVA7QUFDRCxHQUhEOztBQUtBLE1BQUlDLGNBQWMsR0FBRyxVQUFVQyxJQUFWLEVBQWdCO0FBQUUsV0FBTyxVQUFVQSxJQUFqQjtBQUF3QixHQUEvRDs7QUFDQSxNQUFJQyxnQkFBZ0IsR0FBRyxVQUFVRCxJQUFWLEVBQWdCO0FBQUUsV0FBT0EsSUFBSSxDQUFDRSxNQUFMLENBQVksQ0FBWixDQUFQO0FBQXdCLEdBQWpFOztBQUVBLE1BQUlDLDBCQUEwQixHQUFHLFVBQVVDLFFBQVYsRUFBb0I7QUFDbkQsUUFBSUEsUUFBUSxZQUFZL0IsT0FBTyxDQUFDZ0MsTUFBaEMsRUFBd0M7QUFDdEMsVUFBSUMsTUFBTSxHQUFHRixRQUFRLENBQUNWLEtBQVQsQ0FBZSxJQUFmLENBQWI7QUFDQSxhQUFPLElBQUlhLFVBQUosQ0FBZUQsTUFBZixDQUFQO0FBQ0Q7O0FBQ0QsUUFBSUYsUUFBUSxZQUFZL0IsT0FBTyxDQUFDbUMsUUFBaEMsRUFBMEM7QUFDeEMsYUFBTyxJQUFJQyxLQUFLLENBQUNELFFBQVYsQ0FBbUJKLFFBQVEsQ0FBQ00sV0FBVCxFQUFuQixDQUFQO0FBQ0Q7O0FBQ0QsUUFBSU4sUUFBUSxZQUFZL0IsT0FBTyxDQUFDc0MsVUFBaEMsRUFBNEM7QUFDMUMsYUFBT0MsT0FBTyxDQUFDUixRQUFRLENBQUNTLFFBQVQsRUFBRCxDQUFkO0FBQ0Q7O0FBQ0QsUUFBSVQsUUFBUSxDQUFDLFlBQUQsQ0FBUixJQUEwQkEsUUFBUSxDQUFDLGFBQUQsQ0FBbEMsSUFBcURoQixDQUFDLENBQUMwQixJQUFGLENBQU9WLFFBQVAsTUFBcUIsQ0FBOUUsRUFBaUY7QUFDL0UsYUFBT1csS0FBSyxDQUFDQyxhQUFOLENBQW9CL0IsWUFBWSxDQUFDZ0IsZ0JBQUQsRUFBbUJHLFFBQW5CLENBQWhDLENBQVA7QUFDRDs7QUFDRCxRQUFJQSxRQUFRLFlBQVkvQixPQUFPLENBQUN1QixTQUFoQyxFQUEyQztBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQU9RLFFBQVA7QUFDRDs7QUFDRCxXQUFPYSxTQUFQO0FBQ0QsR0F0QkQ7O0FBd0JBLE1BQUlDLDBCQUEwQixHQUFHLFVBQVVkLFFBQVYsRUFBb0I7QUFDbkQsUUFBSVcsS0FBSyxDQUFDSSxRQUFOLENBQWVmLFFBQWYsQ0FBSixFQUE4QixDQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNEOztBQUNELFFBQUlBLFFBQVEsWUFBWUssS0FBSyxDQUFDRCxRQUE5QixFQUF3QztBQUN0QyxhQUFPLElBQUluQyxPQUFPLENBQUNtQyxRQUFaLENBQXFCSixRQUFRLENBQUNNLFdBQVQsRUFBckIsQ0FBUDtBQUNEOztBQUNELFFBQUlOLFFBQVEsWUFBWS9CLE9BQU8sQ0FBQ3VCLFNBQWhDLEVBQTJDO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBT1EsUUFBUDtBQUNEOztBQUNELFFBQUlBLFFBQVEsWUFBWVEsT0FBeEIsRUFBaUM7QUFDL0IsYUFBT3ZDLE9BQU8sQ0FBQ3NDLFVBQVIsQ0FBbUJTLFVBQW5CLENBQThCaEIsUUFBUSxDQUFDUyxRQUFULEVBQTlCLENBQVA7QUFDRDs7QUFDRCxRQUFJRSxLQUFLLENBQUNNLGFBQU4sQ0FBb0JqQixRQUFwQixDQUFKLEVBQW1DO0FBQ2pDLGFBQU9uQixZQUFZLENBQUNjLGNBQUQsRUFBaUJnQixLQUFLLENBQUNPLFdBQU4sQ0FBa0JsQixRQUFsQixDQUFqQixDQUFuQjtBQUNELEtBdEJrRCxDQXVCbkQ7QUFDQTs7O0FBQ0EsV0FBT2EsU0FBUDtBQUNELEdBMUJEOztBQTRCQSxNQUFJTSxZQUFZLEdBQUcsVUFBVW5CLFFBQVYsRUFBb0JvQixlQUFwQixFQUFxQztBQUN0RCxRQUFJLE9BQU9wQixRQUFQLEtBQW9CLFFBQXBCLElBQWdDQSxRQUFRLEtBQUssSUFBakQsRUFDRSxPQUFPQSxRQUFQO0FBRUYsUUFBSXFCLG9CQUFvQixHQUFHRCxlQUFlLENBQUNwQixRQUFELENBQTFDO0FBQ0EsUUFBSXFCLG9CQUFvQixLQUFLUixTQUE3QixFQUNFLE9BQU9RLG9CQUFQO0FBRUYsUUFBSWpDLEdBQUcsR0FBR1ksUUFBVjs7QUFDQWhCLEtBQUMsQ0FBQ0ssSUFBRixDQUFPVyxRQUFQLEVBQWlCLFVBQVVzQixHQUFWLEVBQWUvQixHQUFmLEVBQW9CO0FBQ25DLFVBQUlnQyxXQUFXLEdBQUdKLFlBQVksQ0FBQ0csR0FBRCxFQUFNRixlQUFOLENBQTlCOztBQUNBLFVBQUlFLEdBQUcsS0FBS0MsV0FBWixFQUF5QjtBQUN2QjtBQUNBLFlBQUluQyxHQUFHLEtBQUtZLFFBQVosRUFDRVosR0FBRyxHQUFHSixDQUFDLENBQUNVLEtBQUYsQ0FBUU0sUUFBUixDQUFOO0FBQ0ZaLFdBQUcsQ0FBQ0csR0FBRCxDQUFILEdBQVdnQyxXQUFYO0FBQ0Q7QUFDRixLQVJEOztBQVNBLFdBQU9uQyxHQUFQO0FBQ0QsR0FuQkQ7O0FBc0JBb0MsaUJBQWUsR0FBRyxVQUFVQyxHQUFWLEVBQWVDLE9BQWYsRUFBd0I7QUFDeEMsUUFBSUMsSUFBSSxHQUFHLElBQVg7QUFDQUQsV0FBTyxHQUFHQSxPQUFPLElBQUksRUFBckI7QUFDQUMsUUFBSSxDQUFDQyxvQkFBTCxHQUE0QixFQUE1QjtBQUNBRCxRQUFJLENBQUNFLGVBQUwsR0FBdUIsSUFBSUMsSUFBSixFQUF2QjtBQUVBLFFBQUlDLFlBQVksR0FBR0MsTUFBTSxDQUFDQyxNQUFQLENBQWM7QUFDL0I7QUFDQUMsbUJBQWEsRUFBRSxJQUZnQjtBQUcvQjtBQUNBO0FBQ0FDLG9CQUFjLEVBQUVDLFFBTGU7QUFNL0JDLHFCQUFlLEVBQUUsSUFOYztBQU8vQjtBQUNBQyxxQkFBZSxFQUFFO0FBUmMsS0FBZCxFQVNoQmpDLEtBQUssQ0FBQ2tDLGtCQVRVLENBQW5CLENBTndDLENBaUJ4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBLFFBQUksQ0FBRSwwQkFBMEJDLElBQTFCLENBQStCZixHQUEvQixDQUFOLEVBQTRDO0FBQzFDTSxrQkFBWSxDQUFDVSxhQUFiLEdBQTZCLEtBQTdCO0FBQ0QsS0EzQnVDLENBNkJ4QztBQUNBOzs7QUFDQSxRQUFJekQsQ0FBQyxDQUFDMEQsR0FBRixDQUFNaEIsT0FBTixFQUFlLFVBQWYsQ0FBSixFQUFnQztBQUM5QjtBQUNBO0FBQ0FLLGtCQUFZLENBQUNZLFFBQWIsR0FBd0JqQixPQUFPLENBQUNpQixRQUFoQztBQUNEOztBQUVEaEIsUUFBSSxDQUFDaUIsRUFBTCxHQUFVLElBQVYsQ0FyQ3dDLENBc0N4QztBQUNBO0FBQ0E7O0FBQ0FqQixRQUFJLENBQUNrQixRQUFMLEdBQWdCLElBQWhCO0FBQ0FsQixRQUFJLENBQUNtQixZQUFMLEdBQW9CLElBQXBCO0FBQ0FuQixRQUFJLENBQUNvQixXQUFMLEdBQW1CLElBQW5CO0FBR0EsUUFBSUMsYUFBYSxHQUFHLElBQUk3RSxNQUFKLEVBQXBCO0FBQ0FGLFdBQU8sQ0FBQ2dGLE9BQVIsQ0FDRXhCLEdBREYsRUFFRU0sWUFGRixFQUdFbUIsTUFBTSxDQUFDQyxlQUFQLENBQ0UsVUFBVUMsR0FBVixFQUFlQyxNQUFmLEVBQXVCO0FBQ3JCLFVBQUlELEdBQUosRUFBUztBQUNQLGNBQU1BLEdBQU47QUFDRDs7QUFFRCxVQUFJUixFQUFFLEdBQUdTLE1BQU0sQ0FBQ1QsRUFBUCxFQUFULENBTHFCLENBT3JCOztBQUNBLFVBQUlBLEVBQUUsQ0FBQ1UsWUFBSCxDQUFnQkMsV0FBcEIsRUFBaUM7QUFDL0I1QixZQUFJLENBQUNrQixRQUFMLEdBQWdCRCxFQUFFLENBQUNVLFlBQUgsQ0FBZ0JDLFdBQWhCLENBQTRCQyxPQUE1QztBQUNEOztBQUVEWixRQUFFLENBQUNVLFlBQUgsQ0FBZ0JHLEVBQWhCLENBQ0UsUUFERixFQUNZUCxNQUFNLENBQUNDLGVBQVAsQ0FBdUIsVUFBVU8sSUFBVixFQUFnQkMsR0FBaEIsRUFBcUI7QUFDcEQsWUFBSUQsSUFBSSxLQUFLLFNBQWIsRUFBd0I7QUFDdEIsY0FBSUMsR0FBRyxDQUFDSCxPQUFKLEtBQWdCN0IsSUFBSSxDQUFDa0IsUUFBekIsRUFBbUM7QUFDakNsQixnQkFBSSxDQUFDa0IsUUFBTCxHQUFnQmMsR0FBRyxDQUFDSCxPQUFwQjs7QUFDQTdCLGdCQUFJLENBQUNFLGVBQUwsQ0FBcUJ4QyxJQUFyQixDQUEwQixVQUFVdUUsUUFBVixFQUFvQjtBQUM1Q0Esc0JBQVE7QUFDUixxQkFBTyxJQUFQO0FBQ0QsYUFIRDtBQUlEO0FBQ0YsU0FSRCxNQVFPLElBQUlELEdBQUcsQ0FBQ0UsRUFBSixLQUFXbEMsSUFBSSxDQUFDa0IsUUFBcEIsRUFBOEI7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBbEIsY0FBSSxDQUFDa0IsUUFBTCxHQUFnQixJQUFoQjtBQUNEO0FBQ0YsT0FqQlMsQ0FEWixFQVpxQixDQWdDckI7O0FBQ0FHLG1CQUFhLENBQUMsUUFBRCxDQUFiLENBQXdCO0FBQUVLLGNBQUY7QUFBVVQ7QUFBVixPQUF4QjtBQUNELEtBbkNILEVBb0NFSSxhQUFhLENBQUNjLFFBQWQsRUFwQ0YsQ0FvQzRCO0FBcEM1QixLQUhGLEVBL0N3QyxDQTBGeEM7QUFDQTs7QUFDQTlCLFVBQU0sQ0FBQ0MsTUFBUCxDQUFjTixJQUFkLEVBQW9CcUIsYUFBYSxDQUFDZSxJQUFkLEVBQXBCOztBQUVBLFFBQUlyQyxPQUFPLENBQUNzQyxRQUFSLElBQW9CLENBQUVDLE9BQU8sQ0FBQyxlQUFELENBQWpDLEVBQW9EO0FBQ2xEdEMsVUFBSSxDQUFDbUIsWUFBTCxHQUFvQixJQUFJb0IsV0FBSixDQUFnQnhDLE9BQU8sQ0FBQ3NDLFFBQXhCLEVBQWtDckMsSUFBSSxDQUFDaUIsRUFBTCxDQUFRdUIsWUFBMUMsQ0FBcEI7QUFDQXhDLFVBQUksQ0FBQ29CLFdBQUwsR0FBbUIsSUFBSWxGLFVBQUosQ0FBZThELElBQWYsQ0FBbkI7QUFDRDtBQUNGLEdBbEdEOztBQW9HQUgsaUJBQWUsQ0FBQy9CLFNBQWhCLENBQTBCMkUsS0FBMUIsR0FBa0MsWUFBVztBQUMzQyxRQUFJekMsSUFBSSxHQUFHLElBQVg7QUFFQSxRQUFJLENBQUVBLElBQUksQ0FBQ2lCLEVBQVgsRUFDRSxNQUFNeUIsS0FBSyxDQUFDLHlDQUFELENBQVgsQ0FKeUMsQ0FNM0M7O0FBQ0EsUUFBSUMsV0FBVyxHQUFHM0MsSUFBSSxDQUFDbUIsWUFBdkI7QUFDQW5CLFFBQUksQ0FBQ21CLFlBQUwsR0FBb0IsSUFBcEI7QUFDQSxRQUFJd0IsV0FBSixFQUNFQSxXQUFXLENBQUNDLElBQVosR0FWeUMsQ0FZM0M7QUFDQTtBQUNBOztBQUNBcEcsVUFBTSxDQUFDcUcsSUFBUCxDQUFZeEYsQ0FBQyxDQUFDRyxJQUFGLENBQU93QyxJQUFJLENBQUMwQixNQUFMLENBQVllLEtBQW5CLEVBQTBCekMsSUFBSSxDQUFDMEIsTUFBL0IsQ0FBWixFQUFvRCxJQUFwRCxFQUEwRFUsSUFBMUQ7QUFDRCxHQWhCRCxDLENBa0JBOzs7QUFDQXZDLGlCQUFlLENBQUMvQixTQUFoQixDQUEwQmdGLGFBQTFCLEdBQTBDLFVBQVVDLGNBQVYsRUFBMEI7QUFDbEUsUUFBSS9DLElBQUksR0FBRyxJQUFYO0FBRUEsUUFBSSxDQUFFQSxJQUFJLENBQUNpQixFQUFYLEVBQ0UsTUFBTXlCLEtBQUssQ0FBQyxpREFBRCxDQUFYO0FBRUYsUUFBSU0sTUFBTSxHQUFHLElBQUl4RyxNQUFKLEVBQWI7QUFDQXdELFFBQUksQ0FBQ2lCLEVBQUwsQ0FBUWdDLFVBQVIsQ0FBbUJGLGNBQW5CLEVBQW1DQyxNQUFNLENBQUNiLFFBQVAsRUFBbkM7QUFDQSxXQUFPYSxNQUFNLENBQUNaLElBQVAsRUFBUDtBQUNELEdBVEQ7O0FBV0F2QyxpQkFBZSxDQUFDL0IsU0FBaEIsQ0FBMEJvRix1QkFBMUIsR0FBb0QsVUFDaERILGNBRGdELEVBQ2hDSSxRQURnQyxFQUN0QkMsWUFEc0IsRUFDUjtBQUMxQyxRQUFJcEQsSUFBSSxHQUFHLElBQVg7QUFFQSxRQUFJLENBQUVBLElBQUksQ0FBQ2lCLEVBQVgsRUFDRSxNQUFNeUIsS0FBSyxDQUFDLDJEQUFELENBQVg7QUFFRixRQUFJTSxNQUFNLEdBQUcsSUFBSXhHLE1BQUosRUFBYjtBQUNBd0QsUUFBSSxDQUFDaUIsRUFBTCxDQUFRb0MsZ0JBQVIsQ0FDRU4sY0FERixFQUVFO0FBQUVPLFlBQU0sRUFBRSxJQUFWO0FBQWdCdkUsVUFBSSxFQUFFb0UsUUFBdEI7QUFBZ0NJLFNBQUcsRUFBRUg7QUFBckMsS0FGRixFQUdFSixNQUFNLENBQUNiLFFBQVAsRUFIRjtBQUlBYSxVQUFNLENBQUNaLElBQVA7QUFDRCxHQWJELEMsQ0FlQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQXZDLGlCQUFlLENBQUMvQixTQUFoQixDQUEwQjBGLGdCQUExQixHQUE2QyxZQUFZO0FBQ3ZELFFBQUlDLEtBQUssR0FBR0MsU0FBUyxDQUFDQyxrQkFBVixDQUE2QkMsR0FBN0IsRUFBWjs7QUFDQSxRQUFJSCxLQUFKLEVBQVc7QUFDVCxhQUFPQSxLQUFLLENBQUNJLFVBQU4sRUFBUDtBQUNELEtBRkQsTUFFTztBQUNMLGFBQU87QUFBQ0MsaUJBQVMsRUFBRSxZQUFZLENBQUU7QUFBMUIsT0FBUDtBQUNEO0FBQ0YsR0FQRCxDLENBU0E7QUFDQTs7O0FBQ0FqRSxpQkFBZSxDQUFDL0IsU0FBaEIsQ0FBMEJpRyxXQUExQixHQUF3QyxVQUFVOUIsUUFBVixFQUFvQjtBQUMxRCxXQUFPLEtBQUsvQixlQUFMLENBQXFCOEQsUUFBckIsQ0FBOEIvQixRQUE5QixDQUFQO0FBQ0QsR0FGRCxDLENBS0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUVBLE1BQUlnQyxhQUFhLEdBQUcsVUFBVUMsS0FBVixFQUFpQkMsT0FBakIsRUFBMEJsQyxRQUExQixFQUFvQztBQUN0RCxXQUFPLFVBQVVSLEdBQVYsRUFBZTJDLE1BQWYsRUFBdUI7QUFDNUIsVUFBSSxDQUFFM0MsR0FBTixFQUFXO0FBQ1Q7QUFDQSxZQUFJO0FBQ0YwQyxpQkFBTztBQUNSLFNBRkQsQ0FFRSxPQUFPRSxVQUFQLEVBQW1CO0FBQ25CLGNBQUlwQyxRQUFKLEVBQWM7QUFDWkEsb0JBQVEsQ0FBQ29DLFVBQUQsQ0FBUjtBQUNBO0FBQ0QsV0FIRCxNQUdPO0FBQ0wsa0JBQU1BLFVBQU47QUFDRDtBQUNGO0FBQ0Y7O0FBQ0RILFdBQUssQ0FBQ0osU0FBTjs7QUFDQSxVQUFJN0IsUUFBSixFQUFjO0FBQ1pBLGdCQUFRLENBQUNSLEdBQUQsRUFBTTJDLE1BQU4sQ0FBUjtBQUNELE9BRkQsTUFFTyxJQUFJM0MsR0FBSixFQUFTO0FBQ2QsY0FBTUEsR0FBTjtBQUNEO0FBQ0YsS0FwQkQ7QUFxQkQsR0F0QkQ7O0FBd0JBLE1BQUk2Qyx1QkFBdUIsR0FBRyxVQUFVckMsUUFBVixFQUFvQjtBQUNoRCxXQUFPVixNQUFNLENBQUNDLGVBQVAsQ0FBdUJTLFFBQXZCLEVBQWlDLGFBQWpDLENBQVA7QUFDRCxHQUZEOztBQUlBcEMsaUJBQWUsQ0FBQy9CLFNBQWhCLENBQTBCeUcsT0FBMUIsR0FBb0MsVUFBVUMsZUFBVixFQUEyQm5HLFFBQTNCLEVBQ1U0RCxRQURWLEVBQ29CO0FBQ3RELFFBQUlqQyxJQUFJLEdBQUcsSUFBWDs7QUFFQSxRQUFJeUUsU0FBUyxHQUFHLFVBQVVDLENBQVYsRUFBYTtBQUMzQixVQUFJekMsUUFBSixFQUNFLE9BQU9BLFFBQVEsQ0FBQ3lDLENBQUQsQ0FBZjtBQUNGLFlBQU1BLENBQU47QUFDRCxLQUpEOztBQU1BLFFBQUlGLGVBQWUsS0FBSyxtQ0FBeEIsRUFBNkQ7QUFDM0QsVUFBSUUsQ0FBQyxHQUFHLElBQUloQyxLQUFKLENBQVUsY0FBVixDQUFSO0FBQ0FnQyxPQUFDLENBQUNDLGVBQUYsR0FBb0IsSUFBcEI7QUFDQUYsZUFBUyxDQUFDQyxDQUFELENBQVQ7QUFDQTtBQUNEOztBQUVELFFBQUksRUFBRUUsZUFBZSxDQUFDQyxjQUFoQixDQUErQnhHLFFBQS9CLEtBQ0EsQ0FBQ1csS0FBSyxDQUFDTSxhQUFOLENBQW9CakIsUUFBcEIsQ0FESCxDQUFKLEVBQ3VDO0FBQ3JDb0csZUFBUyxDQUFDLElBQUkvQixLQUFKLENBQ1IsaURBRFEsQ0FBRCxDQUFUO0FBRUE7QUFDRDs7QUFFRCxRQUFJd0IsS0FBSyxHQUFHbEUsSUFBSSxDQUFDd0QsZ0JBQUwsRUFBWjs7QUFDQSxRQUFJVyxPQUFPLEdBQUcsWUFBWTtBQUN4QjVDLFlBQU0sQ0FBQzRDLE9BQVAsQ0FBZTtBQUFDbEIsa0JBQVUsRUFBRXVCLGVBQWI7QUFBOEJNLFVBQUUsRUFBRXpHLFFBQVEsQ0FBQzBHO0FBQTNDLE9BQWY7QUFDRCxLQUZEOztBQUdBOUMsWUFBUSxHQUFHcUMsdUJBQXVCLENBQUNMLGFBQWEsQ0FBQ0MsS0FBRCxFQUFRQyxPQUFSLEVBQWlCbEMsUUFBakIsQ0FBZCxDQUFsQzs7QUFDQSxRQUFJO0FBQ0YsVUFBSWdCLFVBQVUsR0FBR2pELElBQUksQ0FBQzhDLGFBQUwsQ0FBbUIwQixlQUFuQixDQUFqQjtBQUNBdkIsZ0JBQVUsQ0FBQytCLE1BQVgsQ0FBa0J4RixZQUFZLENBQUNuQixRQUFELEVBQVdjLDBCQUFYLENBQTlCLEVBQ2tCO0FBQUM4RixZQUFJLEVBQUU7QUFBUCxPQURsQixFQUNnQ2hELFFBRGhDO0FBRUQsS0FKRCxDQUlFLE9BQU9SLEdBQVAsRUFBWTtBQUNaeUMsV0FBSyxDQUFDSixTQUFOO0FBQ0EsWUFBTXJDLEdBQU47QUFDRDtBQUNGLEdBckNELEMsQ0F1Q0E7QUFDQTs7O0FBQ0E1QixpQkFBZSxDQUFDL0IsU0FBaEIsQ0FBMEJvSCxRQUExQixHQUFxQyxVQUFVbkMsY0FBVixFQUEwQm9DLFFBQTFCLEVBQW9DO0FBQ3ZFLFFBQUlDLFVBQVUsR0FBRztBQUFDbkMsZ0JBQVUsRUFBRUY7QUFBYixLQUFqQixDQUR1RSxDQUV2RTtBQUNBO0FBQ0E7QUFDQTs7QUFDQSxRQUFJc0MsV0FBVyxHQUFHVCxlQUFlLENBQUNVLHFCQUFoQixDQUFzQ0gsUUFBdEMsQ0FBbEI7O0FBQ0EsUUFBSUUsV0FBSixFQUFpQjtBQUNmaEksT0FBQyxDQUFDSyxJQUFGLENBQU8ySCxXQUFQLEVBQW9CLFVBQVVQLEVBQVYsRUFBYztBQUNoQ3ZELGNBQU0sQ0FBQzRDLE9BQVAsQ0FBZTlHLENBQUMsQ0FBQ2tJLE1BQUYsQ0FBUztBQUFDVCxZQUFFLEVBQUVBO0FBQUwsU0FBVCxFQUFtQk0sVUFBbkIsQ0FBZjtBQUNELE9BRkQ7QUFHRCxLQUpELE1BSU87QUFDTDdELFlBQU0sQ0FBQzRDLE9BQVAsQ0FBZWlCLFVBQWY7QUFDRDtBQUNGLEdBZEQ7O0FBZ0JBdkYsaUJBQWUsQ0FBQy9CLFNBQWhCLENBQTBCMEgsT0FBMUIsR0FBb0MsVUFBVWhCLGVBQVYsRUFBMkJXLFFBQTNCLEVBQ1VsRCxRQURWLEVBQ29CO0FBQ3RELFFBQUlqQyxJQUFJLEdBQUcsSUFBWDs7QUFFQSxRQUFJd0UsZUFBZSxLQUFLLG1DQUF4QixFQUE2RDtBQUMzRCxVQUFJRSxDQUFDLEdBQUcsSUFBSWhDLEtBQUosQ0FBVSxjQUFWLENBQVI7QUFDQWdDLE9BQUMsQ0FBQ0MsZUFBRixHQUFvQixJQUFwQjs7QUFDQSxVQUFJMUMsUUFBSixFQUFjO0FBQ1osZUFBT0EsUUFBUSxDQUFDeUMsQ0FBRCxDQUFmO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsY0FBTUEsQ0FBTjtBQUNEO0FBQ0Y7O0FBRUQsUUFBSVIsS0FBSyxHQUFHbEUsSUFBSSxDQUFDd0QsZ0JBQUwsRUFBWjs7QUFDQSxRQUFJVyxPQUFPLEdBQUcsWUFBWTtBQUN4Qm5FLFVBQUksQ0FBQ2tGLFFBQUwsQ0FBY1YsZUFBZCxFQUErQlcsUUFBL0I7QUFDRCxLQUZEOztBQUdBbEQsWUFBUSxHQUFHcUMsdUJBQXVCLENBQUNMLGFBQWEsQ0FBQ0MsS0FBRCxFQUFRQyxPQUFSLEVBQWlCbEMsUUFBakIsQ0FBZCxDQUFsQzs7QUFFQSxRQUFJO0FBQ0YsVUFBSWdCLFVBQVUsR0FBR2pELElBQUksQ0FBQzhDLGFBQUwsQ0FBbUIwQixlQUFuQixDQUFqQjs7QUFDQSxVQUFJaUIsZUFBZSxHQUFHLFVBQVNoRSxHQUFULEVBQWNpRSxZQUFkLEVBQTRCO0FBQ2hEekQsZ0JBQVEsQ0FBQ1IsR0FBRCxFQUFNa0UsZUFBZSxDQUFDRCxZQUFELENBQWYsQ0FBOEJFLGNBQXBDLENBQVI7QUFDRCxPQUZEOztBQUdBM0MsZ0JBQVUsQ0FBQzRDLE1BQVgsQ0FBa0JyRyxZQUFZLENBQUMyRixRQUFELEVBQVdoRywwQkFBWCxDQUE5QixFQUNtQjtBQUFDOEYsWUFBSSxFQUFFO0FBQVAsT0FEbkIsRUFDaUNRLGVBRGpDO0FBRUQsS0FQRCxDQU9FLE9BQU9oRSxHQUFQLEVBQVk7QUFDWnlDLFdBQUssQ0FBQ0osU0FBTjtBQUNBLFlBQU1yQyxHQUFOO0FBQ0Q7QUFDRixHQS9CRDs7QUFpQ0E1QixpQkFBZSxDQUFDL0IsU0FBaEIsQ0FBMEJnSSxlQUExQixHQUE0QyxVQUFVL0MsY0FBVixFQUEwQmdELEVBQTFCLEVBQThCO0FBQ3hFLFFBQUkvRixJQUFJLEdBQUcsSUFBWDs7QUFFQSxRQUFJa0UsS0FBSyxHQUFHbEUsSUFBSSxDQUFDd0QsZ0JBQUwsRUFBWjs7QUFDQSxRQUFJVyxPQUFPLEdBQUcsWUFBWTtBQUN4QjVDLFlBQU0sQ0FBQzRDLE9BQVAsQ0FBZTtBQUFDbEIsa0JBQVUsRUFBRUYsY0FBYjtBQUE2QitCLFVBQUUsRUFBRSxJQUFqQztBQUNDa0Isc0JBQWMsRUFBRTtBQURqQixPQUFmO0FBRUQsS0FIRDs7QUFJQUQsTUFBRSxHQUFHekIsdUJBQXVCLENBQUNMLGFBQWEsQ0FBQ0MsS0FBRCxFQUFRQyxPQUFSLEVBQWlCNEIsRUFBakIsQ0FBZCxDQUE1Qjs7QUFFQSxRQUFJO0FBQ0YsVUFBSTlDLFVBQVUsR0FBR2pELElBQUksQ0FBQzhDLGFBQUwsQ0FBbUJDLGNBQW5CLENBQWpCO0FBQ0FFLGdCQUFVLENBQUNnRCxJQUFYLENBQWdCRixFQUFoQjtBQUNELEtBSEQsQ0FHRSxPQUFPckIsQ0FBUCxFQUFVO0FBQ1ZSLFdBQUssQ0FBQ0osU0FBTjtBQUNBLFlBQU1ZLENBQU47QUFDRDtBQUNGLEdBakJELEMsQ0FtQkE7QUFDQTs7O0FBQ0E3RSxpQkFBZSxDQUFDL0IsU0FBaEIsQ0FBMEJvSSxhQUExQixHQUEwQyxVQUFVSCxFQUFWLEVBQWM7QUFDdEQsUUFBSS9GLElBQUksR0FBRyxJQUFYOztBQUVBLFFBQUlrRSxLQUFLLEdBQUdsRSxJQUFJLENBQUN3RCxnQkFBTCxFQUFaOztBQUNBLFFBQUlXLE9BQU8sR0FBRyxZQUFZO0FBQ3hCNUMsWUFBTSxDQUFDNEMsT0FBUCxDQUFlO0FBQUVnQyxvQkFBWSxFQUFFO0FBQWhCLE9BQWY7QUFDRCxLQUZEOztBQUdBSixNQUFFLEdBQUd6Qix1QkFBdUIsQ0FBQ0wsYUFBYSxDQUFDQyxLQUFELEVBQVFDLE9BQVIsRUFBaUI0QixFQUFqQixDQUFkLENBQTVCOztBQUVBLFFBQUk7QUFDRi9GLFVBQUksQ0FBQ2lCLEVBQUwsQ0FBUWtGLFlBQVIsQ0FBcUJKLEVBQXJCO0FBQ0QsS0FGRCxDQUVFLE9BQU9yQixDQUFQLEVBQVU7QUFDVlIsV0FBSyxDQUFDSixTQUFOO0FBQ0EsWUFBTVksQ0FBTjtBQUNEO0FBQ0YsR0FmRDs7QUFpQkE3RSxpQkFBZSxDQUFDL0IsU0FBaEIsQ0FBMEJzSSxPQUExQixHQUFvQyxVQUFVNUIsZUFBVixFQUEyQlcsUUFBM0IsRUFBcUNrQixHQUFyQyxFQUNVdEcsT0FEVixFQUNtQmtDLFFBRG5CLEVBQzZCO0FBQy9ELFFBQUlqQyxJQUFJLEdBQUcsSUFBWDs7QUFFQSxRQUFJLENBQUVpQyxRQUFGLElBQWNsQyxPQUFPLFlBQVl1RyxRQUFyQyxFQUErQztBQUM3Q3JFLGNBQVEsR0FBR2xDLE9BQVg7QUFDQUEsYUFBTyxHQUFHLElBQVY7QUFDRDs7QUFFRCxRQUFJeUUsZUFBZSxLQUFLLG1DQUF4QixFQUE2RDtBQUMzRCxVQUFJRSxDQUFDLEdBQUcsSUFBSWhDLEtBQUosQ0FBVSxjQUFWLENBQVI7QUFDQWdDLE9BQUMsQ0FBQ0MsZUFBRixHQUFvQixJQUFwQjs7QUFDQSxVQUFJMUMsUUFBSixFQUFjO0FBQ1osZUFBT0EsUUFBUSxDQUFDeUMsQ0FBRCxDQUFmO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsY0FBTUEsQ0FBTjtBQUNEO0FBQ0YsS0FoQjhELENBa0IvRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxRQUFJLENBQUMyQixHQUFELElBQVEsT0FBT0EsR0FBUCxLQUFlLFFBQTNCLEVBQ0UsTUFBTSxJQUFJM0QsS0FBSixDQUFVLCtDQUFWLENBQU47O0FBRUYsUUFBSSxFQUFFa0MsZUFBZSxDQUFDQyxjQUFoQixDQUErQndCLEdBQS9CLEtBQ0EsQ0FBQ3JILEtBQUssQ0FBQ00sYUFBTixDQUFvQitHLEdBQXBCLENBREgsQ0FBSixFQUNrQztBQUNoQyxZQUFNLElBQUkzRCxLQUFKLENBQ0osa0RBQ0UsdUJBRkUsQ0FBTjtBQUdEOztBQUVELFFBQUksQ0FBQzNDLE9BQUwsRUFBY0EsT0FBTyxHQUFHLEVBQVY7O0FBRWQsUUFBSW1FLEtBQUssR0FBR2xFLElBQUksQ0FBQ3dELGdCQUFMLEVBQVo7O0FBQ0EsUUFBSVcsT0FBTyxHQUFHLFlBQVk7QUFDeEJuRSxVQUFJLENBQUNrRixRQUFMLENBQWNWLGVBQWQsRUFBK0JXLFFBQS9CO0FBQ0QsS0FGRDs7QUFHQWxELFlBQVEsR0FBR2dDLGFBQWEsQ0FBQ0MsS0FBRCxFQUFRQyxPQUFSLEVBQWlCbEMsUUFBakIsQ0FBeEI7O0FBQ0EsUUFBSTtBQUNGLFVBQUlnQixVQUFVLEdBQUdqRCxJQUFJLENBQUM4QyxhQUFMLENBQW1CMEIsZUFBbkIsQ0FBakI7QUFDQSxVQUFJK0IsU0FBUyxHQUFHO0FBQUN0QixZQUFJLEVBQUU7QUFBUCxPQUFoQixDQUZFLENBR0Y7O0FBQ0EsVUFBSWxGLE9BQU8sQ0FBQ3lHLFlBQVIsS0FBeUJ0SCxTQUE3QixFQUF3Q3FILFNBQVMsQ0FBQ0MsWUFBVixHQUF5QnpHLE9BQU8sQ0FBQ3lHLFlBQWpDLENBSnRDLENBS0Y7O0FBQ0EsVUFBSXpHLE9BQU8sQ0FBQzBHLE1BQVosRUFBb0JGLFNBQVMsQ0FBQ0UsTUFBVixHQUFtQixJQUFuQjtBQUNwQixVQUFJMUcsT0FBTyxDQUFDMkcsS0FBWixFQUFtQkgsU0FBUyxDQUFDRyxLQUFWLEdBQWtCLElBQWxCLENBUGpCLENBUUY7QUFDQTtBQUNBOztBQUNBLFVBQUkzRyxPQUFPLENBQUM0RyxVQUFaLEVBQXdCSixTQUFTLENBQUNJLFVBQVYsR0FBdUIsSUFBdkI7QUFFeEIsVUFBSUMsYUFBYSxHQUFHcEgsWUFBWSxDQUFDMkYsUUFBRCxFQUFXaEcsMEJBQVgsQ0FBaEM7QUFDQSxVQUFJMEgsUUFBUSxHQUFHckgsWUFBWSxDQUFDNkcsR0FBRCxFQUFNbEgsMEJBQU4sQ0FBM0I7O0FBRUEsVUFBSTJILFFBQVEsR0FBR2xDLGVBQWUsQ0FBQ21DLGtCQUFoQixDQUFtQ0YsUUFBbkMsQ0FBZjs7QUFFQSxVQUFJOUcsT0FBTyxDQUFDaUgsY0FBUixJQUEwQixDQUFDRixRQUEvQixFQUF5QztBQUN2QyxZQUFJckYsR0FBRyxHQUFHLElBQUlpQixLQUFKLENBQVUsK0NBQVYsQ0FBVjs7QUFDQSxZQUFJVCxRQUFKLEVBQWM7QUFDWixpQkFBT0EsUUFBUSxDQUFDUixHQUFELENBQWY7QUFDRCxTQUZELE1BRU87QUFDTCxnQkFBTUEsR0FBTjtBQUNEO0FBQ0YsT0F6QkMsQ0EyQkY7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBOzs7QUFDQSxVQUFJd0YsT0FBSjs7QUFDQSxVQUFJbEgsT0FBTyxDQUFDMEcsTUFBWixFQUFvQjtBQUNsQixZQUFJO0FBQ0YsY0FBSVMsTUFBTSxHQUFHdEMsZUFBZSxDQUFDdUMscUJBQWhCLENBQXNDaEMsUUFBdEMsRUFBZ0RrQixHQUFoRCxDQUFiOztBQUNBWSxpQkFBTyxHQUFHQyxNQUFNLENBQUNuQyxHQUFqQjtBQUNELFNBSEQsQ0FHRSxPQUFPdEQsR0FBUCxFQUFZO0FBQ1osY0FBSVEsUUFBSixFQUFjO0FBQ1osbUJBQU9BLFFBQVEsQ0FBQ1IsR0FBRCxDQUFmO0FBQ0QsV0FGRCxNQUVPO0FBQ0wsa0JBQU1BLEdBQU47QUFDRDtBQUNGO0FBQ0Y7O0FBRUQsVUFBSTFCLE9BQU8sQ0FBQzBHLE1BQVIsSUFDQSxDQUFFSyxRQURGLElBRUEsQ0FBRUcsT0FGRixJQUdBbEgsT0FBTyxDQUFDcUgsVUFIUixJQUlBLEVBQUdySCxPQUFPLENBQUNxSCxVQUFSLFlBQThCMUksS0FBSyxDQUFDRCxRQUFwQyxJQUNBc0IsT0FBTyxDQUFDc0gsV0FEWCxDQUpKLEVBSzZCO0FBQzNCO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQUMsb0NBQTRCLENBQzFCckUsVUFEMEIsRUFDZDJELGFBRGMsRUFDQ0MsUUFERCxFQUNXOUcsT0FEWCxFQUUxQjtBQUNBO0FBQ0E7QUFDQSxrQkFBVXdILEtBQVYsRUFBaUJuRCxNQUFqQixFQUF5QjtBQUN2QjtBQUNBO0FBQ0E7QUFDQSxjQUFJQSxNQUFNLElBQUksQ0FBRXJFLE9BQU8sQ0FBQ3lILGFBQXhCLEVBQXVDO0FBQ3JDdkYsb0JBQVEsQ0FBQ3NGLEtBQUQsRUFBUW5ELE1BQU0sQ0FBQ3dCLGNBQWYsQ0FBUjtBQUNELFdBRkQsTUFFTztBQUNMM0Qsb0JBQVEsQ0FBQ3NGLEtBQUQsRUFBUW5ELE1BQVIsQ0FBUjtBQUNEO0FBQ0YsU0FkeUIsQ0FBNUI7QUFnQkQsT0FoQ0QsTUFnQ087QUFFTCxZQUFJckUsT0FBTyxDQUFDMEcsTUFBUixJQUFrQixDQUFDUSxPQUFuQixJQUE4QmxILE9BQU8sQ0FBQ3FILFVBQXRDLElBQW9ETixRQUF4RCxFQUFrRTtBQUNoRSxjQUFJLENBQUNELFFBQVEsQ0FBQ1ksY0FBVCxDQUF3QixjQUF4QixDQUFMLEVBQThDO0FBQzVDWixvQkFBUSxDQUFDYSxZQUFULEdBQXdCLEVBQXhCO0FBQ0Q7O0FBQ0RULGlCQUFPLEdBQUdsSCxPQUFPLENBQUNxSCxVQUFsQjtBQUNBL0csZ0JBQU0sQ0FBQ0MsTUFBUCxDQUFjdUcsUUFBUSxDQUFDYSxZQUF2QixFQUFxQ2xJLFlBQVksQ0FBQztBQUFDdUYsZUFBRyxFQUFFaEYsT0FBTyxDQUFDcUg7QUFBZCxXQUFELEVBQTRCakksMEJBQTVCLENBQWpEO0FBQ0Q7O0FBRUQ4RCxrQkFBVSxDQUFDMEUsTUFBWCxDQUNFZixhQURGLEVBQ2lCQyxRQURqQixFQUMyQk4sU0FEM0IsRUFFRWpDLHVCQUF1QixDQUFDLFVBQVU3QyxHQUFWLEVBQWUyQyxNQUFmLEVBQXVCO0FBQzdDLGNBQUksQ0FBRTNDLEdBQU4sRUFBVztBQUNULGdCQUFJbUcsWUFBWSxHQUFHakMsZUFBZSxDQUFDdkIsTUFBRCxDQUFsQzs7QUFDQSxnQkFBSXdELFlBQVksSUFBSTdILE9BQU8sQ0FBQ3lILGFBQTVCLEVBQTJDO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBLGtCQUFJekgsT0FBTyxDQUFDMEcsTUFBUixJQUFrQm1CLFlBQVksQ0FBQ1IsVUFBbkMsRUFBK0M7QUFDN0Msb0JBQUlILE9BQUosRUFBYTtBQUNYVyw4QkFBWSxDQUFDUixVQUFiLEdBQTBCSCxPQUExQjtBQUNELGlCQUZELE1BRU8sSUFBSVcsWUFBWSxDQUFDUixVQUFiLFlBQW1DOUssT0FBTyxDQUFDbUMsUUFBL0MsRUFBeUQ7QUFDOURtSiw4QkFBWSxDQUFDUixVQUFiLEdBQTBCLElBQUkxSSxLQUFLLENBQUNELFFBQVYsQ0FBbUJtSixZQUFZLENBQUNSLFVBQWIsQ0FBd0J6SSxXQUF4QixFQUFuQixDQUExQjtBQUNEO0FBQ0Y7O0FBRURzRCxzQkFBUSxDQUFDUixHQUFELEVBQU1tRyxZQUFOLENBQVI7QUFDRCxhQWJELE1BYU87QUFDTDNGLHNCQUFRLENBQUNSLEdBQUQsRUFBTW1HLFlBQVksQ0FBQ2hDLGNBQW5CLENBQVI7QUFDRDtBQUNGLFdBbEJELE1Ba0JPO0FBQ0wzRCxvQkFBUSxDQUFDUixHQUFELENBQVI7QUFDRDtBQUNGLFNBdEJzQixDQUZ6QjtBQXlCRDtBQUNGLEtBcEhELENBb0hFLE9BQU9pRCxDQUFQLEVBQVU7QUFDVlIsV0FBSyxDQUFDSixTQUFOO0FBQ0EsWUFBTVksQ0FBTjtBQUNEO0FBQ0YsR0FqS0Q7O0FBbUtBLE1BQUlpQixlQUFlLEdBQUcsVUFBVUQsWUFBVixFQUF3QjtBQUM1QyxRQUFJa0MsWUFBWSxHQUFHO0FBQUVoQyxvQkFBYyxFQUFFO0FBQWxCLEtBQW5COztBQUNBLFFBQUlGLFlBQUosRUFBa0I7QUFDaEIsVUFBSW1DLFdBQVcsR0FBR25DLFlBQVksQ0FBQ3RCLE1BQS9CLENBRGdCLENBR2hCO0FBQ0E7QUFDQTs7QUFDQSxVQUFJeUQsV0FBVyxDQUFDQyxRQUFoQixFQUEwQjtBQUN4QkYsb0JBQVksQ0FBQ2hDLGNBQWIsSUFBK0JpQyxXQUFXLENBQUNDLFFBQVosQ0FBcUJDLE1BQXBEOztBQUVBLFlBQUlGLFdBQVcsQ0FBQ0MsUUFBWixDQUFxQkMsTUFBckIsSUFBK0IsQ0FBbkMsRUFBc0M7QUFDcENILHNCQUFZLENBQUNSLFVBQWIsR0FBMEJTLFdBQVcsQ0FBQ0MsUUFBWixDQUFxQixDQUFyQixFQUF3Qi9DLEdBQWxEO0FBQ0Q7QUFDRixPQU5ELE1BTU87QUFDTDZDLG9CQUFZLENBQUNoQyxjQUFiLEdBQThCaUMsV0FBVyxDQUFDRyxDQUExQztBQUNEO0FBQ0Y7O0FBRUQsV0FBT0osWUFBUDtBQUNELEdBcEJEOztBQXVCQSxNQUFJSyxvQkFBb0IsR0FBRyxDQUEzQixDLENBRUE7O0FBQ0FwSSxpQkFBZSxDQUFDcUksc0JBQWhCLEdBQXlDLFVBQVV6RyxHQUFWLEVBQWU7QUFFdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFJOEYsS0FBSyxHQUFHOUYsR0FBRyxDQUFDMEcsTUFBSixJQUFjMUcsR0FBRyxDQUFDQSxHQUE5QixDQU5zRCxDQVF0RDtBQUNBO0FBQ0E7O0FBQ0EsUUFBSThGLEtBQUssQ0FBQ2EsT0FBTixDQUFjLGlDQUFkLE1BQXFELENBQXJELElBQ0NiLEtBQUssQ0FBQ2EsT0FBTixDQUFjLG1FQUFkLE1BQXVGLENBQUMsQ0FEN0YsRUFDZ0c7QUFDOUYsYUFBTyxJQUFQO0FBQ0Q7O0FBRUQsV0FBTyxLQUFQO0FBQ0QsR0FqQkQ7O0FBbUJBLE1BQUlkLDRCQUE0QixHQUFHLFVBQVVyRSxVQUFWLEVBQXNCa0MsUUFBdEIsRUFBZ0NrQixHQUFoQyxFQUNVdEcsT0FEVixFQUNtQmtDLFFBRG5CLEVBQzZCO0FBQzlEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBLFFBQUltRixVQUFVLEdBQUdySCxPQUFPLENBQUNxSCxVQUF6QixDQWQ4RCxDQWN6Qjs7QUFDckMsUUFBSWlCLGtCQUFrQixHQUFHO0FBQ3ZCcEQsVUFBSSxFQUFFLElBRGlCO0FBRXZCeUIsV0FBSyxFQUFFM0csT0FBTyxDQUFDMkc7QUFGUSxLQUF6QjtBQUlBLFFBQUk0QixrQkFBa0IsR0FBRztBQUN2QnJELFVBQUksRUFBRSxJQURpQjtBQUV2QndCLFlBQU0sRUFBRTtBQUZlLEtBQXpCO0FBS0EsUUFBSThCLGlCQUFpQixHQUFHbEksTUFBTSxDQUFDQyxNQUFQLENBQ3RCZCxZQUFZLENBQUM7QUFBQ3VGLFNBQUcsRUFBRXFDO0FBQU4sS0FBRCxFQUFvQmpJLDBCQUFwQixDQURVLEVBRXRCa0gsR0FGc0IsQ0FBeEI7QUFJQSxRQUFJbUMsS0FBSyxHQUFHUCxvQkFBWjs7QUFFQSxRQUFJUSxRQUFRLEdBQUcsWUFBWTtBQUN6QkQsV0FBSzs7QUFDTCxVQUFJLENBQUVBLEtBQU4sRUFBYTtBQUNYdkcsZ0JBQVEsQ0FBQyxJQUFJUyxLQUFKLENBQVUseUJBQXlCdUYsb0JBQXpCLEdBQWdELFNBQTFELENBQUQsQ0FBUjtBQUNELE9BRkQsTUFFTztBQUNMaEYsa0JBQVUsQ0FBQzBFLE1BQVgsQ0FBa0J4QyxRQUFsQixFQUE0QmtCLEdBQTVCLEVBQWlDZ0Msa0JBQWpDLEVBQ2tCL0QsdUJBQXVCLENBQUMsVUFBVTdDLEdBQVYsRUFBZTJDLE1BQWYsRUFBdUI7QUFDN0MsY0FBSTNDLEdBQUosRUFBUztBQUNQUSxvQkFBUSxDQUFDUixHQUFELENBQVI7QUFDRCxXQUZELE1BRU8sSUFBSTJDLE1BQU0sSUFBSUEsTUFBTSxDQUFDQSxNQUFQLENBQWM0RCxDQUFkLElBQW1CLENBQWpDLEVBQW9DO0FBQ3pDL0Ysb0JBQVEsQ0FBQyxJQUFELEVBQU87QUFDYjJELDRCQUFjLEVBQUV4QixNQUFNLENBQUNBLE1BQVAsQ0FBYzREO0FBRGpCLGFBQVAsQ0FBUjtBQUdELFdBSk0sTUFJQTtBQUNMVSwrQkFBbUI7QUFDcEI7QUFDRixTQVZzQixDQUR6QztBQVlEO0FBQ0YsS0FsQkQ7O0FBb0JBLFFBQUlBLG1CQUFtQixHQUFHLFlBQVk7QUFDcEN6RixnQkFBVSxDQUFDMEUsTUFBWCxDQUFrQnhDLFFBQWxCLEVBQTRCb0QsaUJBQTVCLEVBQStDRCxrQkFBL0MsRUFDa0JoRSx1QkFBdUIsQ0FBQyxVQUFVN0MsR0FBVixFQUFlMkMsTUFBZixFQUF1QjtBQUM3QyxZQUFJM0MsR0FBSixFQUFTO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsY0FBSTVCLGVBQWUsQ0FBQ3FJLHNCQUFoQixDQUF1Q3pHLEdBQXZDLENBQUosRUFBaUQ7QUFDL0NnSCxvQkFBUTtBQUNULFdBRkQsTUFFTztBQUNMeEcsb0JBQVEsQ0FBQ1IsR0FBRCxDQUFSO0FBQ0Q7QUFDRixTQVRELE1BU087QUFDTFEsa0JBQVEsQ0FBQyxJQUFELEVBQU87QUFDYjJELDBCQUFjLEVBQUV4QixNQUFNLENBQUNBLE1BQVAsQ0FBYzBELFFBQWQsQ0FBdUJDLE1BRDFCO0FBRWJYLHNCQUFVLEVBQUVBO0FBRkMsV0FBUCxDQUFSO0FBSUQ7QUFDRixPQWhCc0IsQ0FEekM7QUFrQkQsS0FuQkQ7O0FBcUJBcUIsWUFBUTtBQUNULEdBekVEOztBQTJFQXBMLEdBQUMsQ0FBQ0ssSUFBRixDQUFPLENBQUMsUUFBRCxFQUFXLFFBQVgsRUFBcUIsUUFBckIsRUFBK0IsZ0JBQS9CLEVBQWlELGNBQWpELENBQVAsRUFBeUUsVUFBVWlMLE1BQVYsRUFBa0I7QUFDekY5SSxtQkFBZSxDQUFDL0IsU0FBaEIsQ0FBMEI2SyxNQUExQixJQUFvQztBQUFVO0FBQWlCO0FBQzdELFVBQUkzSSxJQUFJLEdBQUcsSUFBWDtBQUNBLGFBQU91QixNQUFNLENBQUNxSCxTQUFQLENBQWlCNUksSUFBSSxDQUFDLE1BQU0ySSxNQUFQLENBQXJCLEVBQXFDRSxLQUFyQyxDQUEyQzdJLElBQTNDLEVBQWlEOEksU0FBakQsQ0FBUDtBQUNELEtBSEQ7QUFJRCxHQUxELEUsQ0FPQTtBQUNBO0FBQ0E7OztBQUNBakosaUJBQWUsQ0FBQy9CLFNBQWhCLENBQTBCMkksTUFBMUIsR0FBbUMsVUFBVTFELGNBQVYsRUFBMEJvQyxRQUExQixFQUFvQ2tCLEdBQXBDLEVBQ1V0RyxPQURWLEVBQ21Ca0MsUUFEbkIsRUFDNkI7QUFDOUQsUUFBSWpDLElBQUksR0FBRyxJQUFYOztBQUNBLFFBQUksT0FBT0QsT0FBUCxLQUFtQixVQUFuQixJQUFpQyxDQUFFa0MsUUFBdkMsRUFBaUQ7QUFDL0NBLGNBQVEsR0FBR2xDLE9BQVg7QUFDQUEsYUFBTyxHQUFHLEVBQVY7QUFDRDs7QUFFRCxXQUFPQyxJQUFJLENBQUMySCxNQUFMLENBQVk1RSxjQUFaLEVBQTRCb0MsUUFBNUIsRUFBc0NrQixHQUF0QyxFQUNZaEosQ0FBQyxDQUFDa0ksTUFBRixDQUFTLEVBQVQsRUFBYXhGLE9BQWIsRUFBc0I7QUFDcEIwRyxZQUFNLEVBQUUsSUFEWTtBQUVwQmUsbUJBQWEsRUFBRTtBQUZLLEtBQXRCLENBRFosRUFJZ0J2RixRQUpoQixDQUFQO0FBS0QsR0FiRDs7QUFlQXBDLGlCQUFlLENBQUMvQixTQUFoQixDQUEwQmlMLElBQTFCLEdBQWlDLFVBQVVoRyxjQUFWLEVBQTBCb0MsUUFBMUIsRUFBb0NwRixPQUFwQyxFQUE2QztBQUM1RSxRQUFJQyxJQUFJLEdBQUcsSUFBWDtBQUVBLFFBQUk4SSxTQUFTLENBQUNmLE1BQVYsS0FBcUIsQ0FBekIsRUFDRTVDLFFBQVEsR0FBRyxFQUFYO0FBRUYsV0FBTyxJQUFJNkQsTUFBSixDQUNMaEosSUFESyxFQUNDLElBQUlpSixpQkFBSixDQUFzQmxHLGNBQXRCLEVBQXNDb0MsUUFBdEMsRUFBZ0RwRixPQUFoRCxDQURELENBQVA7QUFFRCxHQVJEOztBQVVBRixpQkFBZSxDQUFDL0IsU0FBaEIsQ0FBMEJvTCxPQUExQixHQUFvQyxVQUFVMUUsZUFBVixFQUEyQlcsUUFBM0IsRUFDVXBGLE9BRFYsRUFDbUI7QUFDckQsUUFBSUMsSUFBSSxHQUFHLElBQVg7QUFDQSxRQUFJOEksU0FBUyxDQUFDZixNQUFWLEtBQXFCLENBQXpCLEVBQ0U1QyxRQUFRLEdBQUcsRUFBWDtBQUVGcEYsV0FBTyxHQUFHQSxPQUFPLElBQUksRUFBckI7QUFDQUEsV0FBTyxDQUFDb0osS0FBUixHQUFnQixDQUFoQjtBQUNBLFdBQU9uSixJQUFJLENBQUMrSSxJQUFMLENBQVV2RSxlQUFWLEVBQTJCVyxRQUEzQixFQUFxQ3BGLE9BQXJDLEVBQThDcUosS0FBOUMsR0FBc0QsQ0FBdEQsQ0FBUDtBQUNELEdBVEQsQyxDQVdBO0FBQ0E7OztBQUNBdkosaUJBQWUsQ0FBQy9CLFNBQWhCLENBQTBCdUwsWUFBMUIsR0FBeUMsVUFBVXRHLGNBQVYsRUFBMEJ1RyxLQUExQixFQUNVdkosT0FEVixFQUNtQjtBQUMxRCxRQUFJO0FBQ0YsVUFBSUMsSUFBSSxHQUFHLElBQVgsQ0FERSxDQUVGO0FBQ0E7O0FBQ0EsVUFBSWlELFVBQVUsR0FBR2pELElBQUksQ0FBQzhDLGFBQUwsQ0FBbUJDLGNBQW5CLENBQWpCO0FBQ0EsVUFBSUMsTUFBTSxHQUFHLElBQUl4RyxNQUFKLEVBQWI7QUFDQSxVQUFJK00sU0FBUyxHQUFHdEcsVUFBVSxDQUFDdUcsV0FBWCxDQUF1QkYsS0FBdkIsRUFBOEJ2SixPQUE5QixFQUF1Q2lELE1BQU0sQ0FBQ2IsUUFBUCxFQUF2QyxDQUFoQjtBQUNBYSxZQUFNLENBQUNaLElBQVA7QUFDRCxLQVJELENBUUUsT0FBT3FILFNBQVAsRUFBa0IsQ0FFbkI7QUFDRixHQWJEOztBQWNBNUosaUJBQWUsQ0FBQy9CLFNBQWhCLENBQTBCNEwsVUFBMUIsR0FBdUMsVUFBVTNHLGNBQVYsRUFBMEJ1RyxLQUExQixFQUFpQztBQUN0RSxRQUFJdEosSUFBSSxHQUFHLElBQVgsQ0FEc0UsQ0FHdEU7QUFDQTs7QUFDQSxRQUFJaUQsVUFBVSxHQUFHakQsSUFBSSxDQUFDOEMsYUFBTCxDQUFtQkMsY0FBbkIsQ0FBakI7QUFDQSxRQUFJQyxNQUFNLEdBQUcsSUFBSXhHLE1BQUosRUFBYjtBQUNBLFFBQUkrTSxTQUFTLEdBQUd0RyxVQUFVLENBQUMwRyxTQUFYLENBQXFCTCxLQUFyQixFQUE0QnRHLE1BQU0sQ0FBQ2IsUUFBUCxFQUE1QixDQUFoQjtBQUNBYSxVQUFNLENBQUNaLElBQVA7QUFDRCxHQVRELEMsQ0FXQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBRUE2RyxtQkFBaUIsR0FBRyxVQUFVbEcsY0FBVixFQUEwQm9DLFFBQTFCLEVBQW9DcEYsT0FBcEMsRUFBNkM7QUFDL0QsUUFBSUMsSUFBSSxHQUFHLElBQVg7QUFDQUEsUUFBSSxDQUFDK0MsY0FBTCxHQUFzQkEsY0FBdEI7QUFDQS9DLFFBQUksQ0FBQ21GLFFBQUwsR0FBZ0J6RyxLQUFLLENBQUNrTCxVQUFOLENBQWlCQyxnQkFBakIsQ0FBa0MxRSxRQUFsQyxDQUFoQjtBQUNBbkYsUUFBSSxDQUFDRCxPQUFMLEdBQWVBLE9BQU8sSUFBSSxFQUExQjtBQUNELEdBTEQ7O0FBT0FpSixRQUFNLEdBQUcsVUFBVWMsS0FBVixFQUFpQkMsaUJBQWpCLEVBQW9DO0FBQzNDLFFBQUkvSixJQUFJLEdBQUcsSUFBWDtBQUVBQSxRQUFJLENBQUNnSyxNQUFMLEdBQWNGLEtBQWQ7QUFDQTlKLFFBQUksQ0FBQ2lLLGtCQUFMLEdBQTBCRixpQkFBMUI7QUFDQS9KLFFBQUksQ0FBQ2tLLGtCQUFMLEdBQTBCLElBQTFCO0FBQ0QsR0FORDs7QUFRQTdNLEdBQUMsQ0FBQ0ssSUFBRixDQUFPLENBQUMsU0FBRCxFQUFZLEtBQVosRUFBbUIsT0FBbkIsRUFBNEIsT0FBNUIsRUFBcUN5TSxNQUFNLENBQUNDLFFBQTVDLENBQVAsRUFBOEQsVUFBVXpCLE1BQVYsRUFBa0I7QUFDOUVLLFVBQU0sQ0FBQ2xMLFNBQVAsQ0FBaUI2SyxNQUFqQixJQUEyQixZQUFZO0FBQ3JDLFVBQUkzSSxJQUFJLEdBQUcsSUFBWCxDQURxQyxDQUdyQzs7QUFDQSxVQUFJQSxJQUFJLENBQUNpSyxrQkFBTCxDQUF3QmxLLE9BQXhCLENBQWdDc0ssUUFBcEMsRUFDRSxNQUFNLElBQUkzSCxLQUFKLENBQVUsaUJBQWlCaUcsTUFBakIsR0FBMEIsdUJBQXBDLENBQU47O0FBRUYsVUFBSSxDQUFDM0ksSUFBSSxDQUFDa0ssa0JBQVYsRUFBOEI7QUFDNUJsSyxZQUFJLENBQUNrSyxrQkFBTCxHQUEwQmxLLElBQUksQ0FBQ2dLLE1BQUwsQ0FBWU0sd0JBQVosQ0FDeEJ0SyxJQUFJLENBQUNpSyxrQkFEbUIsRUFDQztBQUN2QjtBQUNBO0FBQ0FNLDBCQUFnQixFQUFFdkssSUFISztBQUl2QndLLHNCQUFZLEVBQUU7QUFKUyxTQURELENBQTFCO0FBT0Q7O0FBRUQsYUFBT3hLLElBQUksQ0FBQ2tLLGtCQUFMLENBQXdCdkIsTUFBeEIsRUFBZ0NFLEtBQWhDLENBQ0w3SSxJQUFJLENBQUNrSyxrQkFEQSxFQUNvQnBCLFNBRHBCLENBQVA7QUFFRCxLQW5CRDtBQW9CRCxHQXJCRCxFLENBdUJBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQUUsUUFBTSxDQUFDbEwsU0FBUCxDQUFpQjJNLE1BQWpCLEdBQTBCLFlBQVksQ0FDckMsQ0FERDs7QUFHQXpCLFFBQU0sQ0FBQ2xMLFNBQVAsQ0FBaUI0TSxZQUFqQixHQUFnQyxZQUFZO0FBQzFDLFdBQU8sS0FBS1Qsa0JBQUwsQ0FBd0JsSyxPQUF4QixDQUFnQzRLLFNBQXZDO0FBQ0QsR0FGRCxDLENBSUE7QUFDQTtBQUNBOzs7QUFFQTNCLFFBQU0sQ0FBQ2xMLFNBQVAsQ0FBaUI4TSxjQUFqQixHQUFrQyxVQUFVQyxHQUFWLEVBQWU7QUFDL0MsUUFBSTdLLElBQUksR0FBRyxJQUFYO0FBQ0EsUUFBSWlELFVBQVUsR0FBR2pELElBQUksQ0FBQ2lLLGtCQUFMLENBQXdCbEgsY0FBekM7QUFDQSxXQUFPckUsS0FBSyxDQUFDa0wsVUFBTixDQUFpQmdCLGNBQWpCLENBQWdDNUssSUFBaEMsRUFBc0M2SyxHQUF0QyxFQUEyQzVILFVBQTNDLENBQVA7QUFDRCxHQUpELEMsQ0FNQTtBQUNBO0FBQ0E7OztBQUNBK0YsUUFBTSxDQUFDbEwsU0FBUCxDQUFpQmdOLGtCQUFqQixHQUFzQyxZQUFZO0FBQ2hELFFBQUk5SyxJQUFJLEdBQUcsSUFBWDtBQUNBLFdBQU9BLElBQUksQ0FBQ2lLLGtCQUFMLENBQXdCbEgsY0FBL0I7QUFDRCxHQUhEOztBQUtBaUcsUUFBTSxDQUFDbEwsU0FBUCxDQUFpQmlOLE9BQWpCLEdBQTJCLFVBQVVDLFNBQVYsRUFBcUI7QUFDOUMsUUFBSWhMLElBQUksR0FBRyxJQUFYO0FBQ0EsV0FBTzRFLGVBQWUsQ0FBQ3FHLDBCQUFoQixDQUEyQ2pMLElBQTNDLEVBQWlEZ0wsU0FBakQsQ0FBUDtBQUNELEdBSEQ7O0FBS0FoQyxRQUFNLENBQUNsTCxTQUFQLENBQWlCb04sY0FBakIsR0FBa0MsVUFBVUYsU0FBVixFQUFxQjtBQUNyRCxRQUFJaEwsSUFBSSxHQUFHLElBQVg7QUFDQSxRQUFJbUwsT0FBTyxHQUFHLENBQ1osU0FEWSxFQUVaLE9BRlksRUFHWixXQUhZLEVBSVosU0FKWSxFQUtaLFdBTFksRUFNWixTQU5ZLEVBT1osU0FQWSxDQUFkOztBQVNBLFFBQUlDLE9BQU8sR0FBR3hHLGVBQWUsQ0FBQ3lHLGtDQUFoQixDQUFtREwsU0FBbkQsQ0FBZCxDQVhxRCxDQWFyRDs7O0FBQ0EsUUFBSU0sYUFBYSxHQUFHLGtDQUFwQjtBQUNBSCxXQUFPLENBQUNJLE9BQVIsQ0FBZ0IsVUFBVTVDLE1BQVYsRUFBa0I7QUFDaEMsVUFBSXFDLFNBQVMsQ0FBQ3JDLE1BQUQsQ0FBVCxJQUFxQixPQUFPcUMsU0FBUyxDQUFDckMsTUFBRCxDQUFoQixJQUE0QixVQUFyRCxFQUFpRTtBQUMvRHFDLGlCQUFTLENBQUNyQyxNQUFELENBQVQsR0FBb0JwSCxNQUFNLENBQUNDLGVBQVAsQ0FBdUJ3SixTQUFTLENBQUNyQyxNQUFELENBQWhDLEVBQTBDQSxNQUFNLEdBQUcyQyxhQUFuRCxDQUFwQjtBQUNEO0FBQ0YsS0FKRDtBQU1BLFdBQU90TCxJQUFJLENBQUNnSyxNQUFMLENBQVl3QixlQUFaLENBQ0x4TCxJQUFJLENBQUNpSyxrQkFEQSxFQUNvQm1CLE9BRHBCLEVBQzZCSixTQUQ3QixDQUFQO0FBRUQsR0F2QkQ7O0FBeUJBbkwsaUJBQWUsQ0FBQy9CLFNBQWhCLENBQTBCd00sd0JBQTFCLEdBQXFELFVBQ2pEUCxpQkFEaUQsRUFDOUJoSyxPQUQ4QixFQUNyQjtBQUM5QixRQUFJQyxJQUFJLEdBQUcsSUFBWDtBQUNBRCxXQUFPLEdBQUcxQyxDQUFDLENBQUNvTyxJQUFGLENBQU8xTCxPQUFPLElBQUksRUFBbEIsRUFBc0Isa0JBQXRCLEVBQTBDLGNBQTFDLENBQVY7QUFFQSxRQUFJa0QsVUFBVSxHQUFHakQsSUFBSSxDQUFDOEMsYUFBTCxDQUFtQmlILGlCQUFpQixDQUFDaEgsY0FBckMsQ0FBakI7QUFDQSxRQUFJMkksYUFBYSxHQUFHM0IsaUJBQWlCLENBQUNoSyxPQUF0QztBQUNBLFFBQUlLLFlBQVksR0FBRztBQUNqQnVMLFVBQUksRUFBRUQsYUFBYSxDQUFDQyxJQURIO0FBRWpCeEMsV0FBSyxFQUFFdUMsYUFBYSxDQUFDdkMsS0FGSjtBQUdqQnlDLFVBQUksRUFBRUYsYUFBYSxDQUFDRSxJQUhIO0FBSWpCQyxnQkFBVSxFQUFFSCxhQUFhLENBQUNJO0FBSlQsS0FBbkIsQ0FOOEIsQ0FhOUI7O0FBQ0EsUUFBSUosYUFBYSxDQUFDckIsUUFBbEIsRUFBNEI7QUFDMUI7QUFDQWpLLGtCQUFZLENBQUNpSyxRQUFiLEdBQXdCLElBQXhCLENBRjBCLENBRzFCO0FBQ0E7O0FBQ0FqSyxrQkFBWSxDQUFDMkwsU0FBYixHQUF5QixJQUF6QixDQUwwQixDQU0xQjtBQUNBOztBQUNBM0wsa0JBQVksQ0FBQzRMLGVBQWIsR0FBK0IsQ0FBQyxDQUFoQyxDQVIwQixDQVMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBLFVBQUlqQyxpQkFBaUIsQ0FBQ2hILGNBQWxCLEtBQXFDa0osZ0JBQXJDLElBQ0FsQyxpQkFBaUIsQ0FBQzVFLFFBQWxCLENBQTJCK0csRUFEL0IsRUFDbUM7QUFDakM5TCxvQkFBWSxDQUFDK0wsV0FBYixHQUEyQixJQUEzQjtBQUNEO0FBQ0Y7O0FBRUQsUUFBSUMsUUFBUSxHQUFHbkosVUFBVSxDQUFDOEYsSUFBWCxDQUNidkosWUFBWSxDQUFDdUssaUJBQWlCLENBQUM1RSxRQUFuQixFQUE2QmhHLDBCQUE3QixDQURDLEVBRWJpQixZQUZhLENBQWY7O0FBSUEsUUFBSSxPQUFPc0wsYUFBYSxDQUFDVyxTQUFyQixLQUFtQyxXQUF2QyxFQUFvRDtBQUNsREQsY0FBUSxHQUFHQSxRQUFRLENBQUNFLFNBQVQsQ0FBbUJaLGFBQWEsQ0FBQ1csU0FBakMsQ0FBWDtBQUNEOztBQUNELFFBQUksT0FBT1gsYUFBYSxDQUFDYSxJQUFyQixLQUE4QixXQUFsQyxFQUErQztBQUM3Q0gsY0FBUSxHQUFHQSxRQUFRLENBQUNHLElBQVQsQ0FBY2IsYUFBYSxDQUFDYSxJQUE1QixDQUFYO0FBQ0Q7O0FBRUQsV0FBTyxJQUFJQyxpQkFBSixDQUFzQkosUUFBdEIsRUFBZ0NyQyxpQkFBaEMsRUFBbURoSyxPQUFuRCxDQUFQO0FBQ0QsR0EvQ0Q7O0FBaURBLE1BQUl5TSxpQkFBaUIsR0FBRyxVQUFVSixRQUFWLEVBQW9CckMsaUJBQXBCLEVBQXVDaEssT0FBdkMsRUFBZ0Q7QUFDdEUsUUFBSUMsSUFBSSxHQUFHLElBQVg7QUFDQUQsV0FBTyxHQUFHMUMsQ0FBQyxDQUFDb08sSUFBRixDQUFPMUwsT0FBTyxJQUFJLEVBQWxCLEVBQXNCLGtCQUF0QixFQUEwQyxjQUExQyxDQUFWO0FBRUFDLFFBQUksQ0FBQ3lNLFNBQUwsR0FBaUJMLFFBQWpCO0FBQ0FwTSxRQUFJLENBQUNpSyxrQkFBTCxHQUEwQkYsaUJBQTFCLENBTHNFLENBTXRFO0FBQ0E7O0FBQ0EvSixRQUFJLENBQUMwTSxpQkFBTCxHQUF5QjNNLE9BQU8sQ0FBQ3dLLGdCQUFSLElBQTRCdkssSUFBckQ7O0FBQ0EsUUFBSUQsT0FBTyxDQUFDeUssWUFBUixJQUF3QlQsaUJBQWlCLENBQUNoSyxPQUFsQixDQUEwQjRLLFNBQXRELEVBQWlFO0FBQy9EM0ssVUFBSSxDQUFDMk0sVUFBTCxHQUFrQi9ILGVBQWUsQ0FBQ2dJLGFBQWhCLENBQ2hCN0MsaUJBQWlCLENBQUNoSyxPQUFsQixDQUEwQjRLLFNBRFYsQ0FBbEI7QUFFRCxLQUhELE1BR087QUFDTDNLLFVBQUksQ0FBQzJNLFVBQUwsR0FBa0IsSUFBbEI7QUFDRDs7QUFFRDNNLFFBQUksQ0FBQzZNLGlCQUFMLEdBQXlCclEsTUFBTSxDQUFDcUcsSUFBUCxDQUFZdUosUUFBUSxDQUFDVSxLQUFULENBQWV0UCxJQUFmLENBQW9CNE8sUUFBcEIsQ0FBWixDQUF6QjtBQUNBcE0sUUFBSSxDQUFDK00sV0FBTCxHQUFtQixJQUFJbkksZUFBZSxDQUFDb0ksTUFBcEIsRUFBbkI7QUFDRCxHQWxCRDs7QUFvQkEzUCxHQUFDLENBQUNrSSxNQUFGLENBQVNpSCxpQkFBaUIsQ0FBQzFPLFNBQTNCLEVBQXNDO0FBQ3BDO0FBQ0E7QUFDQW1QLHlCQUFxQixFQUFFLFlBQVk7QUFDakMsWUFBTWpOLElBQUksR0FBRyxJQUFiO0FBQ0EsYUFBTyxJQUFJa04sT0FBSixDQUFZLENBQUNDLE9BQUQsRUFBVUMsTUFBVixLQUFxQjtBQUN0Q3BOLFlBQUksQ0FBQ3lNLFNBQUwsQ0FBZVksSUFBZixDQUFvQixDQUFDNUwsR0FBRCxFQUFNTyxHQUFOLEtBQWM7QUFDaEMsY0FBSVAsR0FBSixFQUFTO0FBQ1AyTCxrQkFBTSxDQUFDM0wsR0FBRCxDQUFOO0FBQ0QsV0FGRCxNQUVPO0FBQ0wwTCxtQkFBTyxDQUFDbkwsR0FBRCxDQUFQO0FBQ0Q7QUFDRixTQU5EO0FBT0QsT0FSTSxDQUFQO0FBU0QsS0FkbUM7QUFnQnBDO0FBQ0E7QUFDQXNMLHNCQUFrQixFQUFFO0FBQUEsc0NBQWtCO0FBQ3BDLFlBQUl0TixJQUFJLEdBQUcsSUFBWDs7QUFFQSxlQUFPLElBQVAsRUFBYTtBQUNYLGNBQUlnQyxHQUFHLGlCQUFTaEMsSUFBSSxDQUFDaU4scUJBQUwsRUFBVCxDQUFQO0FBRUEsY0FBSSxDQUFDakwsR0FBTCxFQUFVLE9BQU8sSUFBUDtBQUNWQSxhQUFHLEdBQUd4QyxZQUFZLENBQUN3QyxHQUFELEVBQU01RCwwQkFBTixDQUFsQjs7QUFFQSxjQUFJLENBQUM0QixJQUFJLENBQUNpSyxrQkFBTCxDQUF3QmxLLE9BQXhCLENBQWdDc0ssUUFBakMsSUFBNkNoTixDQUFDLENBQUMwRCxHQUFGLENBQU1pQixHQUFOLEVBQVcsS0FBWCxDQUFqRCxFQUFvRTtBQUNsRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBSWhDLElBQUksQ0FBQytNLFdBQUwsQ0FBaUJoTSxHQUFqQixDQUFxQmlCLEdBQUcsQ0FBQytDLEdBQXpCLENBQUosRUFBbUM7O0FBQ25DL0UsZ0JBQUksQ0FBQytNLFdBQUwsQ0FBaUJRLEdBQWpCLENBQXFCdkwsR0FBRyxDQUFDK0MsR0FBekIsRUFBOEIsSUFBOUI7QUFDRDs7QUFFRCxjQUFJL0UsSUFBSSxDQUFDMk0sVUFBVCxFQUNFM0ssR0FBRyxHQUFHaEMsSUFBSSxDQUFDMk0sVUFBTCxDQUFnQjNLLEdBQWhCLENBQU47QUFFRixpQkFBT0EsR0FBUDtBQUNEO0FBQ0YsT0F6Qm1CO0FBQUEsS0FsQmdCO0FBNkNwQztBQUNBO0FBQ0E7QUFDQXdMLGlDQUE2QixFQUFFLFVBQVVDLFNBQVYsRUFBcUI7QUFDbEQsWUFBTXpOLElBQUksR0FBRyxJQUFiOztBQUNBLFVBQUksQ0FBQ3lOLFNBQUwsRUFBZ0I7QUFDZCxlQUFPek4sSUFBSSxDQUFDc04sa0JBQUwsRUFBUDtBQUNEOztBQUNELFlBQU1JLGlCQUFpQixHQUFHMU4sSUFBSSxDQUFDc04sa0JBQUwsRUFBMUI7O0FBQ0EsWUFBTUssVUFBVSxHQUFHLElBQUlqTCxLQUFKLENBQVUsNkNBQVYsQ0FBbkI7QUFDQSxZQUFNa0wsY0FBYyxHQUFHLElBQUlWLE9BQUosQ0FBWSxDQUFDQyxPQUFELEVBQVVDLE1BQVYsS0FBcUI7QUFDdEQsY0FBTVMsS0FBSyxHQUFHQyxVQUFVLENBQUMsTUFBTTtBQUM3QlYsZ0JBQU0sQ0FBQ08sVUFBRCxDQUFOO0FBQ0QsU0FGdUIsRUFFckJGLFNBRnFCLENBQXhCO0FBR0QsT0FKc0IsQ0FBdkI7QUFLQSxhQUFPUCxPQUFPLENBQUNhLElBQVIsQ0FBYSxDQUFDTCxpQkFBRCxFQUFvQkUsY0FBcEIsQ0FBYixFQUNKSSxLQURJLENBQ0d2TSxHQUFELElBQVM7QUFDZCxZQUFJQSxHQUFHLEtBQUtrTSxVQUFaLEVBQXdCO0FBQ3RCM04sY0FBSSxDQUFDeUMsS0FBTDtBQUNEOztBQUNELGNBQU1oQixHQUFOO0FBQ0QsT0FOSSxDQUFQO0FBT0QsS0FuRW1DO0FBcUVwQ3dNLGVBQVcsRUFBRSxZQUFZO0FBQ3ZCLFVBQUlqTyxJQUFJLEdBQUcsSUFBWDtBQUNBLGFBQU9BLElBQUksQ0FBQ3NOLGtCQUFMLEdBQTBCWSxLQUExQixFQUFQO0FBQ0QsS0F4RW1DO0FBMEVwQzNDLFdBQU8sRUFBRSxVQUFVdEosUUFBVixFQUFvQmtNLE9BQXBCLEVBQTZCO0FBQ3BDLFVBQUluTyxJQUFJLEdBQUcsSUFBWCxDQURvQyxDQUdwQzs7QUFDQUEsVUFBSSxDQUFDb08sT0FBTCxHQUpvQyxDQU1wQztBQUNBO0FBQ0E7OztBQUNBLFVBQUk5RSxLQUFLLEdBQUcsQ0FBWjs7QUFDQSxhQUFPLElBQVAsRUFBYTtBQUNYLFlBQUl0SCxHQUFHLEdBQUdoQyxJQUFJLENBQUNpTyxXQUFMLEVBQVY7O0FBQ0EsWUFBSSxDQUFDak0sR0FBTCxFQUFVO0FBQ1ZDLGdCQUFRLENBQUNvTSxJQUFULENBQWNGLE9BQWQsRUFBdUJuTSxHQUF2QixFQUE0QnNILEtBQUssRUFBakMsRUFBcUN0SixJQUFJLENBQUMwTSxpQkFBMUM7QUFDRDtBQUNGLEtBekZtQztBQTJGcEM7QUFDQW5QLE9BQUcsRUFBRSxVQUFVMEUsUUFBVixFQUFvQmtNLE9BQXBCLEVBQTZCO0FBQ2hDLFVBQUluTyxJQUFJLEdBQUcsSUFBWDtBQUNBLFVBQUlzTyxHQUFHLEdBQUcsRUFBVjtBQUNBdE8sVUFBSSxDQUFDdUwsT0FBTCxDQUFhLFVBQVV2SixHQUFWLEVBQWVzSCxLQUFmLEVBQXNCO0FBQ2pDZ0YsV0FBRyxDQUFDQyxJQUFKLENBQVN0TSxRQUFRLENBQUNvTSxJQUFULENBQWNGLE9BQWQsRUFBdUJuTSxHQUF2QixFQUE0QnNILEtBQTVCLEVBQW1DdEosSUFBSSxDQUFDME0saUJBQXhDLENBQVQ7QUFDRCxPQUZEO0FBR0EsYUFBTzRCLEdBQVA7QUFDRCxLQW5HbUM7QUFxR3BDRixXQUFPLEVBQUUsWUFBWTtBQUNuQixVQUFJcE8sSUFBSSxHQUFHLElBQVgsQ0FEbUIsQ0FHbkI7O0FBQ0FBLFVBQUksQ0FBQ3lNLFNBQUwsQ0FBZWhDLE1BQWY7O0FBRUF6SyxVQUFJLENBQUMrTSxXQUFMLEdBQW1CLElBQUluSSxlQUFlLENBQUNvSSxNQUFwQixFQUFuQjtBQUNELEtBNUdtQztBQThHcEM7QUFDQXZLLFNBQUssRUFBRSxZQUFZO0FBQ2pCLFVBQUl6QyxJQUFJLEdBQUcsSUFBWDs7QUFFQUEsVUFBSSxDQUFDeU0sU0FBTCxDQUFlaEssS0FBZjtBQUNELEtBbkhtQztBQXFIcEMyRyxTQUFLLEVBQUUsWUFBWTtBQUNqQixVQUFJcEosSUFBSSxHQUFHLElBQVg7QUFDQSxhQUFPQSxJQUFJLENBQUN6QyxHQUFMLENBQVNGLENBQUMsQ0FBQ21SLFFBQVgsQ0FBUDtBQUNELEtBeEhtQztBQTBIcEMxQixTQUFLLEVBQUUsWUFBa0M7QUFBQSxVQUF4QjJCLGNBQXdCLHVFQUFQLEtBQU87QUFDdkMsVUFBSXpPLElBQUksR0FBRyxJQUFYO0FBQ0EsYUFBT0EsSUFBSSxDQUFDNk0saUJBQUwsQ0FBdUI0QixjQUF2QixFQUF1Q3JNLElBQXZDLEVBQVA7QUFDRCxLQTdIbUM7QUErSHBDO0FBQ0FzTSxpQkFBYSxFQUFFLFVBQVV0RCxPQUFWLEVBQW1CO0FBQ2hDLFVBQUlwTCxJQUFJLEdBQUcsSUFBWDs7QUFDQSxVQUFJb0wsT0FBSixFQUFhO0FBQ1gsZUFBT3BMLElBQUksQ0FBQ29KLEtBQUwsRUFBUDtBQUNELE9BRkQsTUFFTztBQUNMLFlBQUl1RixPQUFPLEdBQUcsSUFBSS9KLGVBQWUsQ0FBQ29JLE1BQXBCLEVBQWQ7QUFDQWhOLFlBQUksQ0FBQ3VMLE9BQUwsQ0FBYSxVQUFVdkosR0FBVixFQUFlO0FBQzFCMk0saUJBQU8sQ0FBQ3BCLEdBQVIsQ0FBWXZMLEdBQUcsQ0FBQytDLEdBQWhCLEVBQXFCL0MsR0FBckI7QUFDRCxTQUZEO0FBR0EsZUFBTzJNLE9BQVA7QUFDRDtBQUNGO0FBM0ltQyxHQUF0Qzs7QUE4SUFuQyxtQkFBaUIsQ0FBQzFPLFNBQWxCLENBQTRCcU0sTUFBTSxDQUFDQyxRQUFuQyxJQUErQyxZQUFZO0FBQ3pELFFBQUlwSyxJQUFJLEdBQUcsSUFBWCxDQUR5RCxDQUd6RDs7QUFDQUEsUUFBSSxDQUFDb08sT0FBTDs7QUFFQSxXQUFPO0FBQ0xmLFVBQUksR0FBRztBQUNMLGNBQU1yTCxHQUFHLEdBQUdoQyxJQUFJLENBQUNpTyxXQUFMLEVBQVo7O0FBQ0EsZUFBT2pNLEdBQUcsR0FBRztBQUNYckUsZUFBSyxFQUFFcUU7QUFESSxTQUFILEdBRU47QUFDRjRNLGNBQUksRUFBRTtBQURKLFNBRko7QUFLRDs7QUFSSSxLQUFQO0FBVUQsR0FoQkQsQyxDQWtCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBL08saUJBQWUsQ0FBQy9CLFNBQWhCLENBQTBCK1EsSUFBMUIsR0FBaUMsVUFBVTlFLGlCQUFWLEVBQTZCK0UsV0FBN0IsRUFBMENyQixTQUExQyxFQUFxRDtBQUNwRixRQUFJek4sSUFBSSxHQUFHLElBQVg7QUFDQSxRQUFJLENBQUMrSixpQkFBaUIsQ0FBQ2hLLE9BQWxCLENBQTBCc0ssUUFBL0IsRUFDRSxNQUFNLElBQUkzSCxLQUFKLENBQVUsaUNBQVYsQ0FBTjs7QUFFRixRQUFJcU0sTUFBTSxHQUFHL08sSUFBSSxDQUFDc0ssd0JBQUwsQ0FBOEJQLGlCQUE5QixDQUFiOztBQUVBLFFBQUlpRixPQUFPLEdBQUcsS0FBZDtBQUNBLFFBQUlDLE1BQUo7O0FBQ0EsUUFBSUMsSUFBSSxHQUFHLFlBQVk7QUFDckIsVUFBSWxOLEdBQUcsR0FBRyxJQUFWOztBQUNBLGFBQU8sSUFBUCxFQUFhO0FBQ1gsWUFBSWdOLE9BQUosRUFDRTs7QUFDRixZQUFJO0FBQ0ZoTixhQUFHLEdBQUcrTSxNQUFNLENBQUN2Qiw2QkFBUCxDQUFxQ0MsU0FBckMsRUFBZ0RTLEtBQWhELEVBQU47QUFDRCxTQUZELENBRUUsT0FBT3pNLEdBQVAsRUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0FPLGFBQUcsR0FBRyxJQUFOO0FBQ0QsU0FYVSxDQVlYO0FBQ0E7OztBQUNBLFlBQUlnTixPQUFKLEVBQ0U7O0FBQ0YsWUFBSWhOLEdBQUosRUFBUztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0FpTixnQkFBTSxHQUFHak4sR0FBRyxDQUFDa0ssRUFBYjtBQUNBNEMscUJBQVcsQ0FBQzlNLEdBQUQsQ0FBWDtBQUNELFNBUEQsTUFPTztBQUNMLGNBQUltTixXQUFXLEdBQUc5UixDQUFDLENBQUNVLEtBQUYsQ0FBUWdNLGlCQUFpQixDQUFDNUUsUUFBMUIsQ0FBbEI7O0FBQ0EsY0FBSThKLE1BQUosRUFBWTtBQUNWRSx1QkFBVyxDQUFDakQsRUFBWixHQUFpQjtBQUFDa0QsaUJBQUcsRUFBRUg7QUFBTixhQUFqQjtBQUNEOztBQUNERixnQkFBTSxHQUFHL08sSUFBSSxDQUFDc0ssd0JBQUwsQ0FBOEIsSUFBSXJCLGlCQUFKLENBQ3JDYyxpQkFBaUIsQ0FBQ2hILGNBRG1CLEVBRXJDb00sV0FGcUMsRUFHckNwRixpQkFBaUIsQ0FBQ2hLLE9BSG1CLENBQTlCLENBQVQsQ0FMSyxDQVNMO0FBQ0E7QUFDQTs7QUFDQXdCLGdCQUFNLENBQUN1TSxVQUFQLENBQWtCb0IsSUFBbEIsRUFBd0IsR0FBeEI7QUFDQTtBQUNEO0FBQ0Y7QUFDRixLQXpDRDs7QUEyQ0EzTixVQUFNLENBQUM4TixLQUFQLENBQWFILElBQWI7QUFFQSxXQUFPO0FBQ0x0TSxVQUFJLEVBQUUsWUFBWTtBQUNoQm9NLGVBQU8sR0FBRyxJQUFWO0FBQ0FELGNBQU0sQ0FBQ3RNLEtBQVA7QUFDRDtBQUpJLEtBQVA7QUFNRCxHQTVERDs7QUE4REE1QyxpQkFBZSxDQUFDL0IsU0FBaEIsQ0FBMEIwTixlQUExQixHQUE0QyxVQUN4Q3pCLGlCQUR3QyxFQUNyQnFCLE9BRHFCLEVBQ1pKLFNBRFksRUFDRDtBQUN6QyxRQUFJaEwsSUFBSSxHQUFHLElBQVg7O0FBRUEsUUFBSStKLGlCQUFpQixDQUFDaEssT0FBbEIsQ0FBMEJzSyxRQUE5QixFQUF3QztBQUN0QyxhQUFPckssSUFBSSxDQUFDc1AsdUJBQUwsQ0FBNkJ2RixpQkFBN0IsRUFBZ0RxQixPQUFoRCxFQUF5REosU0FBekQsQ0FBUDtBQUNELEtBTHdDLENBT3pDO0FBQ0E7OztBQUNBLFFBQUlqQixpQkFBaUIsQ0FBQ2hLLE9BQWxCLENBQTBCK0wsTUFBMUIsS0FDQy9CLGlCQUFpQixDQUFDaEssT0FBbEIsQ0FBMEIrTCxNQUExQixDQUFpQy9HLEdBQWpDLEtBQXlDLENBQXpDLElBQ0FnRixpQkFBaUIsQ0FBQ2hLLE9BQWxCLENBQTBCK0wsTUFBMUIsQ0FBaUMvRyxHQUFqQyxLQUF5QyxLQUYxQyxDQUFKLEVBRXNEO0FBQ3BELFlBQU1yQyxLQUFLLENBQUMsc0RBQUQsQ0FBWDtBQUNEOztBQUVELFFBQUk2TSxVQUFVLEdBQUd2USxLQUFLLENBQUN3USxTQUFOLENBQ2ZuUyxDQUFDLENBQUNrSSxNQUFGLENBQVM7QUFBQzZGLGFBQU8sRUFBRUE7QUFBVixLQUFULEVBQTZCckIsaUJBQTdCLENBRGUsQ0FBakI7QUFHQSxRQUFJMEYsV0FBSixFQUFpQkMsYUFBakI7QUFDQSxRQUFJQyxXQUFXLEdBQUcsS0FBbEIsQ0FuQnlDLENBcUJ6QztBQUNBO0FBQ0E7O0FBQ0FwTyxVQUFNLENBQUNxTyxnQkFBUCxDQUF3QixZQUFZO0FBQ2xDLFVBQUl2UyxDQUFDLENBQUMwRCxHQUFGLENBQU1mLElBQUksQ0FBQ0Msb0JBQVgsRUFBaUNzUCxVQUFqQyxDQUFKLEVBQWtEO0FBQ2hERSxtQkFBVyxHQUFHelAsSUFBSSxDQUFDQyxvQkFBTCxDQUEwQnNQLFVBQTFCLENBQWQ7QUFDRCxPQUZELE1BRU87QUFDTEksbUJBQVcsR0FBRyxJQUFkLENBREssQ0FFTDs7QUFDQUYsbUJBQVcsR0FBRyxJQUFJSSxrQkFBSixDQUF1QjtBQUNuQ3pFLGlCQUFPLEVBQUVBLE9BRDBCO0FBRW5DMEUsZ0JBQU0sRUFBRSxZQUFZO0FBQ2xCLG1CQUFPOVAsSUFBSSxDQUFDQyxvQkFBTCxDQUEwQnNQLFVBQTFCLENBQVA7QUFDQUcseUJBQWEsQ0FBQzlNLElBQWQ7QUFDRDtBQUxrQyxTQUF2QixDQUFkO0FBT0E1QyxZQUFJLENBQUNDLG9CQUFMLENBQTBCc1AsVUFBMUIsSUFBd0NFLFdBQXhDO0FBQ0Q7QUFDRixLQWZEOztBQWlCQSxRQUFJTSxhQUFhLEdBQUcsSUFBSUMsYUFBSixDQUFrQlAsV0FBbEIsRUFBK0J6RSxTQUEvQixDQUFwQjs7QUFFQSxRQUFJMkUsV0FBSixFQUFpQjtBQUNmLFVBQUlNLE9BQUosRUFBYUMsTUFBYjs7QUFDQSxVQUFJQyxXQUFXLEdBQUc5UyxDQUFDLENBQUMrUyxHQUFGLENBQU0sQ0FDdEIsWUFBWTtBQUNWO0FBQ0E7QUFDQTtBQUNBLGVBQU9wUSxJQUFJLENBQUNtQixZQUFMLElBQXFCLENBQUNpSyxPQUF0QixJQUNMLENBQUNKLFNBQVMsQ0FBQ3FGLHFCQURiO0FBRUQsT0FQcUIsRUFPbkIsWUFBWTtBQUNiO0FBQ0E7QUFDQSxZQUFJO0FBQ0ZKLGlCQUFPLEdBQUcsSUFBSUssU0FBUyxDQUFDQyxPQUFkLENBQXNCeEcsaUJBQWlCLENBQUM1RSxRQUF4QyxDQUFWO0FBQ0EsaUJBQU8sSUFBUDtBQUNELFNBSEQsQ0FHRSxPQUFPVCxDQUFQLEVBQVU7QUFDVjtBQUNBO0FBQ0EsaUJBQU8sS0FBUDtBQUNEO0FBQ0YsT0FsQnFCLEVBa0JuQixZQUFZO0FBQ2I7QUFDQSxlQUFPOEwsa0JBQWtCLENBQUNDLGVBQW5CLENBQW1DMUcsaUJBQW5DLEVBQXNEa0csT0FBdEQsQ0FBUDtBQUNELE9BckJxQixFQXFCbkIsWUFBWTtBQUNiO0FBQ0E7QUFDQSxZQUFJLENBQUNsRyxpQkFBaUIsQ0FBQ2hLLE9BQWxCLENBQTBCNEwsSUFBL0IsRUFDRSxPQUFPLElBQVA7O0FBQ0YsWUFBSTtBQUNGdUUsZ0JBQU0sR0FBRyxJQUFJSSxTQUFTLENBQUNJLE1BQWQsQ0FBcUIzRyxpQkFBaUIsQ0FBQ2hLLE9BQWxCLENBQTBCNEwsSUFBL0MsQ0FBVDtBQUNBLGlCQUFPLElBQVA7QUFDRCxTQUhELENBR0UsT0FBT2pILENBQVAsRUFBVTtBQUNWO0FBQ0E7QUFDQSxpQkFBTyxLQUFQO0FBQ0Q7QUFDRixPQWxDcUIsQ0FBTixFQWtDWixVQUFVaU0sQ0FBVixFQUFhO0FBQUUsZUFBT0EsQ0FBQyxFQUFSO0FBQWEsT0FsQ2hCLENBQWxCLENBRmUsQ0FvQ3VCOzs7QUFFdEMsVUFBSUMsV0FBVyxHQUFHVCxXQUFXLEdBQUdLLGtCQUFILEdBQXdCSyxvQkFBckQ7QUFDQW5CLG1CQUFhLEdBQUcsSUFBSWtCLFdBQUosQ0FBZ0I7QUFDOUI3Ryx5QkFBaUIsRUFBRUEsaUJBRFc7QUFFOUIrRyxtQkFBVyxFQUFFOVEsSUFGaUI7QUFHOUJ5UCxtQkFBVyxFQUFFQSxXQUhpQjtBQUk5QnJFLGVBQU8sRUFBRUEsT0FKcUI7QUFLOUI2RSxlQUFPLEVBQUVBLE9BTHFCO0FBS1g7QUFDbkJDLGNBQU0sRUFBRUEsTUFOc0I7QUFNYjtBQUNqQkcsNkJBQXFCLEVBQUVyRixTQUFTLENBQUNxRjtBQVBILE9BQWhCLENBQWhCLENBdkNlLENBaURmOztBQUNBWixpQkFBVyxDQUFDc0IsY0FBWixHQUE2QnJCLGFBQTdCO0FBQ0QsS0E5RndDLENBZ0d6Qzs7O0FBQ0FELGVBQVcsQ0FBQ3VCLDJCQUFaLENBQXdDakIsYUFBeEM7QUFFQSxXQUFPQSxhQUFQO0FBQ0QsR0FyR0QsQyxDQXVHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFFQWtCLFdBQVMsR0FBRyxVQUFVbEgsaUJBQVYsRUFBNkJtSCxjQUE3QixFQUE2QztBQUN2RCxRQUFJQyxTQUFTLEdBQUcsRUFBaEI7QUFDQUMsa0JBQWMsQ0FBQ3JILGlCQUFELEVBQW9CLFVBQVVzSCxPQUFWLEVBQW1CO0FBQ25ERixlQUFTLENBQUM1QyxJQUFWLENBQWU3SyxTQUFTLENBQUM0TixxQkFBVixDQUFnQ0MsTUFBaEMsQ0FDYkYsT0FEYSxFQUNKSCxjQURJLENBQWY7QUFFRCxLQUhhLENBQWQ7QUFLQSxXQUFPO0FBQ0x0TyxVQUFJLEVBQUUsWUFBWTtBQUNoQnZGLFNBQUMsQ0FBQ0ssSUFBRixDQUFPeVQsU0FBUCxFQUFrQixVQUFVSyxRQUFWLEVBQW9CO0FBQ3BDQSxrQkFBUSxDQUFDNU8sSUFBVDtBQUNELFNBRkQ7QUFHRDtBQUxJLEtBQVA7QUFPRCxHQWREOztBQWdCQXdPLGdCQUFjLEdBQUcsVUFBVXJILGlCQUFWLEVBQTZCMEgsZUFBN0IsRUFBOEM7QUFDN0QsUUFBSTdULEdBQUcsR0FBRztBQUFDcUYsZ0JBQVUsRUFBRThHLGlCQUFpQixDQUFDaEg7QUFBL0IsS0FBVjs7QUFDQSxRQUFJc0MsV0FBVyxHQUFHVCxlQUFlLENBQUNVLHFCQUFoQixDQUNoQnlFLGlCQUFpQixDQUFDNUUsUUFERixDQUFsQjs7QUFFQSxRQUFJRSxXQUFKLEVBQWlCO0FBQ2ZoSSxPQUFDLENBQUNLLElBQUYsQ0FBTzJILFdBQVAsRUFBb0IsVUFBVVAsRUFBVixFQUFjO0FBQ2hDMk0sdUJBQWUsQ0FBQ3BVLENBQUMsQ0FBQ2tJLE1BQUYsQ0FBUztBQUFDVCxZQUFFLEVBQUVBO0FBQUwsU0FBVCxFQUFtQmxILEdBQW5CLENBQUQsQ0FBZjtBQUNELE9BRkQ7O0FBR0E2VCxxQkFBZSxDQUFDcFUsQ0FBQyxDQUFDa0ksTUFBRixDQUFTO0FBQUNTLHNCQUFjLEVBQUUsSUFBakI7QUFBdUJsQixVQUFFLEVBQUU7QUFBM0IsT0FBVCxFQUEyQ2xILEdBQTNDLENBQUQsQ0FBZjtBQUNELEtBTEQsTUFLTztBQUNMNlQscUJBQWUsQ0FBQzdULEdBQUQsQ0FBZjtBQUNELEtBWDRELENBWTdEOzs7QUFDQTZULG1CQUFlLENBQUM7QUFBRXRMLGtCQUFZLEVBQUU7QUFBaEIsS0FBRCxDQUFmO0FBQ0QsR0FkRCxDLENBZ0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQXRHLGlCQUFlLENBQUMvQixTQUFoQixDQUEwQndSLHVCQUExQixHQUFvRCxVQUNoRHZGLGlCQURnRCxFQUM3QnFCLE9BRDZCLEVBQ3BCSixTQURvQixFQUNUO0FBQ3pDLFFBQUloTCxJQUFJLEdBQUcsSUFBWCxDQUR5QyxDQUd6QztBQUNBOztBQUNBLFFBQUtvTCxPQUFPLElBQUksQ0FBQ0osU0FBUyxDQUFDMEcsV0FBdkIsSUFDQyxDQUFDdEcsT0FBRCxJQUFZLENBQUNKLFNBQVMsQ0FBQzJHLEtBRDVCLEVBQ29DO0FBQ2xDLFlBQU0sSUFBSWpQLEtBQUosQ0FBVSx1QkFBdUIwSSxPQUFPLEdBQUcsU0FBSCxHQUFlLFdBQTdDLElBQ0UsNkJBREYsSUFFR0EsT0FBTyxHQUFHLGFBQUgsR0FBbUIsT0FGN0IsSUFFd0MsV0FGbEQsQ0FBTjtBQUdEOztBQUVELFdBQU9wTCxJQUFJLENBQUM2TyxJQUFMLENBQVU5RSxpQkFBVixFQUE2QixVQUFVL0gsR0FBVixFQUFlO0FBQ2pELFVBQUk4QyxFQUFFLEdBQUc5QyxHQUFHLENBQUMrQyxHQUFiO0FBQ0EsYUFBTy9DLEdBQUcsQ0FBQytDLEdBQVgsQ0FGaUQsQ0FHakQ7O0FBQ0EsYUFBTy9DLEdBQUcsQ0FBQ2tLLEVBQVg7O0FBQ0EsVUFBSWQsT0FBSixFQUFhO0FBQ1hKLGlCQUFTLENBQUMwRyxXQUFWLENBQXNCNU0sRUFBdEIsRUFBMEI5QyxHQUExQixFQUErQixJQUEvQjtBQUNELE9BRkQsTUFFTztBQUNMZ0osaUJBQVMsQ0FBQzJHLEtBQVYsQ0FBZ0I3TSxFQUFoQixFQUFvQjlDLEdBQXBCO0FBQ0Q7QUFDRixLQVZNLENBQVA7QUFXRCxHQXhCRCxDLENBMEJBO0FBQ0E7QUFDQTs7O0FBQ0FyRixnQkFBYyxDQUFDaVYsY0FBZixHQUFnQ3RWLE9BQU8sQ0FBQ3VCLFNBQXhDO0FBRUFsQixnQkFBYyxDQUFDa1YsVUFBZixHQUE0QmhTLGVBQTVCOzs7Ozs7Ozs7Ozs7QUM1NkNBLElBQUl0RCxnQkFBSjtBQUFxQlMsTUFBTSxDQUFDWixJQUFQLENBQVksa0JBQVosRUFBK0I7QUFBQ0csa0JBQWdCLENBQUNGLENBQUQsRUFBRztBQUFDRSxvQkFBZ0IsR0FBQ0YsQ0FBakI7QUFBbUI7O0FBQXhDLENBQS9CLEVBQXlFLENBQXpFOztBQUFyQixJQUFJRyxNQUFNLEdBQUdDLEdBQUcsQ0FBQ0MsT0FBSixDQUFZLGVBQVosQ0FBYjs7QUFHQSxNQUFNO0FBQUVtQjtBQUFGLElBQWdCdEIsZ0JBQXRCO0FBRUEwUCxnQkFBZ0IsR0FBRyxVQUFuQjtBQUVBLElBQUk2RixjQUFjLEdBQUdDLE9BQU8sQ0FBQ0MsR0FBUixDQUFZQywyQkFBWixJQUEyQyxJQUFoRTtBQUNBLElBQUlDLFlBQVksR0FBRyxDQUFDSCxPQUFPLENBQUNDLEdBQVIsQ0FBWUcseUJBQWIsSUFBMEMsS0FBN0Q7O0FBRUEsSUFBSUMsTUFBTSxHQUFHLFVBQVVsRyxFQUFWLEVBQWM7QUFDekIsU0FBTyxlQUFlQSxFQUFFLENBQUNtRyxXQUFILEVBQWYsR0FBa0MsSUFBbEMsR0FBeUNuRyxFQUFFLENBQUNvRyxVQUFILEVBQXpDLEdBQTJELEdBQWxFO0FBQ0QsQ0FGRDs7QUFJQUMsT0FBTyxHQUFHLFVBQVVDLEVBQVYsRUFBYztBQUN0QixNQUFJQSxFQUFFLENBQUNBLEVBQUgsS0FBVSxHQUFkLEVBQ0UsT0FBT0EsRUFBRSxDQUFDQyxDQUFILENBQUsxTixHQUFaLENBREYsS0FFSyxJQUFJeU4sRUFBRSxDQUFDQSxFQUFILEtBQVUsR0FBZCxFQUNILE9BQU9BLEVBQUUsQ0FBQ0MsQ0FBSCxDQUFLMU4sR0FBWixDQURHLEtBRUEsSUFBSXlOLEVBQUUsQ0FBQ0EsRUFBSCxLQUFVLEdBQWQsRUFDSCxPQUFPQSxFQUFFLENBQUNFLEVBQUgsQ0FBTTNOLEdBQWIsQ0FERyxLQUVBLElBQUl5TixFQUFFLENBQUNBLEVBQUgsS0FBVSxHQUFkLEVBQ0gsTUFBTTlQLEtBQUssQ0FBQyxvREFDQTFELEtBQUssQ0FBQ3dRLFNBQU4sQ0FBZ0JnRCxFQUFoQixDQURELENBQVgsQ0FERyxLQUlILE1BQU05UCxLQUFLLENBQUMsaUJBQWlCMUQsS0FBSyxDQUFDd1EsU0FBTixDQUFnQmdELEVBQWhCLENBQWxCLENBQVg7QUFDSCxDQVpEOztBQWNBalEsV0FBVyxHQUFHLFVBQVVGLFFBQVYsRUFBb0JzUSxNQUFwQixFQUE0QjtBQUN4QyxNQUFJM1MsSUFBSSxHQUFHLElBQVg7QUFDQUEsTUFBSSxDQUFDNFMsU0FBTCxHQUFpQnZRLFFBQWpCO0FBQ0FyQyxNQUFJLENBQUM2UyxPQUFMLEdBQWVGLE1BQWY7QUFFQTNTLE1BQUksQ0FBQzhTLHlCQUFMLEdBQWlDLElBQWpDO0FBQ0E5UyxNQUFJLENBQUMrUyxvQkFBTCxHQUE0QixJQUE1QjtBQUNBL1MsTUFBSSxDQUFDZ1QsUUFBTCxHQUFnQixLQUFoQjtBQUNBaFQsTUFBSSxDQUFDaVQsV0FBTCxHQUFtQixJQUFuQjtBQUNBalQsTUFBSSxDQUFDa1QsWUFBTCxHQUFvQixJQUFJMVcsTUFBSixFQUFwQjtBQUNBd0QsTUFBSSxDQUFDbVQsU0FBTCxHQUFpQixJQUFJelAsU0FBUyxDQUFDMFAsU0FBZCxDQUF3QjtBQUN2Q0MsZUFBVyxFQUFFLGdCQUQwQjtBQUNSQyxZQUFRLEVBQUU7QUFERixHQUF4QixDQUFqQjtBQUdBdFQsTUFBSSxDQUFDdVQsa0JBQUwsR0FBMEI7QUFDeEJDLE1BQUUsRUFBRSxJQUFJQyxNQUFKLENBQVcsU0FBUyxDQUN0QmxTLE1BQU0sQ0FBQ21TLGFBQVAsQ0FBcUIxVCxJQUFJLENBQUM2UyxPQUFMLEdBQWUsR0FBcEMsQ0FEc0IsRUFFdEJ0UixNQUFNLENBQUNtUyxhQUFQLENBQXFCLFlBQXJCLENBRnNCLEVBR3RCQyxJQUhzQixDQUdqQixHQUhpQixDQUFULEdBR0QsR0FIVixDQURvQjtBQU14QkMsT0FBRyxFQUFFLENBQ0g7QUFBRXBCLFFBQUUsRUFBRTtBQUFFcUIsV0FBRyxFQUFFLENBQUMsR0FBRCxFQUFNLEdBQU4sRUFBVyxHQUFYO0FBQVA7QUFBTixLQURHLEVBRUg7QUFDQTtBQUFFckIsUUFBRSxFQUFFLEdBQU47QUFBVyxnQkFBVTtBQUFFc0IsZUFBTyxFQUFFO0FBQVg7QUFBckIsS0FIRyxFQUlIO0FBQUV0QixRQUFFLEVBQUUsR0FBTjtBQUFXLHdCQUFrQjtBQUE3QixLQUpHLEVBS0g7QUFBRUEsUUFBRSxFQUFFLEdBQU47QUFBVyxvQkFBYztBQUFFc0IsZUFBTyxFQUFFO0FBQVg7QUFBekIsS0FMRztBQU5tQixHQUExQixDQWJ3QyxDQTRCeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBOVQsTUFBSSxDQUFDK1Qsa0JBQUwsR0FBMEIsRUFBMUI7QUFDQS9ULE1BQUksQ0FBQ2dVLGdCQUFMLEdBQXdCLElBQXhCO0FBRUFoVSxNQUFJLENBQUNpVSxxQkFBTCxHQUE2QixJQUFJOVQsSUFBSixDQUFTO0FBQ3BDK1Qsd0JBQW9CLEVBQUU7QUFEYyxHQUFULENBQTdCO0FBSUFsVSxNQUFJLENBQUNtVSxXQUFMLEdBQW1CLElBQUk1UyxNQUFNLENBQUM2UyxpQkFBWCxFQUFuQjtBQUNBcFUsTUFBSSxDQUFDcVUsYUFBTCxHQUFxQixLQUFyQjs7QUFFQXJVLE1BQUksQ0FBQ3NVLGFBQUw7QUFDRCxDQXpERDs7QUEyREFqWCxDQUFDLENBQUNrSSxNQUFGLENBQVNoRCxXQUFXLENBQUN6RSxTQUFyQixFQUFnQztBQUM5QjhFLE1BQUksRUFBRSxZQUFZO0FBQ2hCLFFBQUk1QyxJQUFJLEdBQUcsSUFBWDtBQUNBLFFBQUlBLElBQUksQ0FBQ2dULFFBQVQsRUFDRTtBQUNGaFQsUUFBSSxDQUFDZ1QsUUFBTCxHQUFnQixJQUFoQjtBQUNBLFFBQUloVCxJQUFJLENBQUNpVCxXQUFULEVBQ0VqVCxJQUFJLENBQUNpVCxXQUFMLENBQWlCclEsSUFBakIsR0FOYyxDQU9oQjtBQUNELEdBVDZCO0FBVTlCMlIsY0FBWSxFQUFFLFVBQVVsRCxPQUFWLEVBQW1CcFAsUUFBbkIsRUFBNkI7QUFDekMsUUFBSWpDLElBQUksR0FBRyxJQUFYO0FBQ0EsUUFBSUEsSUFBSSxDQUFDZ1QsUUFBVCxFQUNFLE1BQU0sSUFBSXRRLEtBQUosQ0FBVSx3Q0FBVixDQUFOLENBSHVDLENBS3pDOztBQUNBMUMsUUFBSSxDQUFDa1QsWUFBTCxDQUFrQjlRLElBQWxCOztBQUVBLFFBQUlvUyxnQkFBZ0IsR0FBR3ZTLFFBQXZCO0FBQ0FBLFlBQVEsR0FBR1YsTUFBTSxDQUFDQyxlQUFQLENBQXVCLFVBQVVpVCxZQUFWLEVBQXdCO0FBQ3hERCxzQkFBZ0IsQ0FBQ0MsWUFBRCxDQUFoQjtBQUNELEtBRlUsRUFFUixVQUFVaFQsR0FBVixFQUFlO0FBQ2hCRixZQUFNLENBQUNtVCxNQUFQLENBQWMseUJBQWQsRUFBeUNqVCxHQUF6QztBQUNELEtBSlUsQ0FBWDs7QUFLQSxRQUFJa1QsWUFBWSxHQUFHM1UsSUFBSSxDQUFDbVQsU0FBTCxDQUFlNUIsTUFBZixDQUFzQkYsT0FBdEIsRUFBK0JwUCxRQUEvQixDQUFuQjs7QUFDQSxXQUFPO0FBQ0xXLFVBQUksRUFBRSxZQUFZO0FBQ2hCK1Isb0JBQVksQ0FBQy9SLElBQWI7QUFDRDtBQUhJLEtBQVA7QUFLRCxHQTlCNkI7QUErQjlCO0FBQ0E7QUFDQWdTLGtCQUFnQixFQUFFLFVBQVUzUyxRQUFWLEVBQW9CO0FBQ3BDLFFBQUlqQyxJQUFJLEdBQUcsSUFBWDtBQUNBLFFBQUlBLElBQUksQ0FBQ2dULFFBQVQsRUFDRSxNQUFNLElBQUl0USxLQUFKLENBQVUsNENBQVYsQ0FBTjtBQUNGLFdBQU8xQyxJQUFJLENBQUNpVSxxQkFBTCxDQUEyQmpRLFFBQTNCLENBQW9DL0IsUUFBcEMsQ0FBUDtBQUNELEdBdEM2QjtBQXVDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBNFMsbUJBQWlCLEVBQUUsWUFBWTtBQUM3QixRQUFJN1UsSUFBSSxHQUFHLElBQVg7QUFDQSxRQUFJQSxJQUFJLENBQUNnVCxRQUFULEVBQ0UsTUFBTSxJQUFJdFEsS0FBSixDQUFVLDZDQUFWLENBQU4sQ0FIMkIsQ0FLN0I7QUFDQTs7QUFDQTFDLFFBQUksQ0FBQ2tULFlBQUwsQ0FBa0I5USxJQUFsQjs7QUFDQSxRQUFJMFMsU0FBSjs7QUFFQSxXQUFPLENBQUM5VSxJQUFJLENBQUNnVCxRQUFiLEVBQXVCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBLFVBQUk7QUFDRjhCLGlCQUFTLEdBQUc5VSxJQUFJLENBQUM4Uyx5QkFBTCxDQUErQjVKLE9BQS9CLENBQ1YrQyxnQkFEVSxFQUNRak0sSUFBSSxDQUFDdVQsa0JBRGIsRUFFVjtBQUFDekgsZ0JBQU0sRUFBRTtBQUFDSSxjQUFFLEVBQUU7QUFBTCxXQUFUO0FBQWtCUCxjQUFJLEVBQUU7QUFBQ29KLG9CQUFRLEVBQUUsQ0FBQztBQUFaO0FBQXhCLFNBRlUsQ0FBWjtBQUdBO0FBQ0QsT0FMRCxDQUtFLE9BQU9yUSxDQUFQLEVBQVU7QUFDVjtBQUNBO0FBQ0FuRCxjQUFNLENBQUNtVCxNQUFQLENBQWMsd0NBQWQsRUFBd0RoUSxDQUF4RDs7QUFDQW5ELGNBQU0sQ0FBQ3lULFdBQVAsQ0FBbUIsR0FBbkI7QUFDRDtBQUNGOztBQUVELFFBQUloVixJQUFJLENBQUNnVCxRQUFULEVBQ0U7O0FBRUYsUUFBSSxDQUFDOEIsU0FBTCxFQUFnQjtBQUNkO0FBQ0E7QUFDRDs7QUFFRCxRQUFJNUksRUFBRSxHQUFHNEksU0FBUyxDQUFDNUksRUFBbkI7QUFDQSxRQUFJLENBQUNBLEVBQUwsRUFDRSxNQUFNeEosS0FBSyxDQUFDLDZCQUE2QjFELEtBQUssQ0FBQ3dRLFNBQU4sQ0FBZ0JzRixTQUFoQixDQUE5QixDQUFYOztBQUVGLFFBQUk5VSxJQUFJLENBQUNnVSxnQkFBTCxJQUF5QjlILEVBQUUsQ0FBQytJLGVBQUgsQ0FBbUJqVixJQUFJLENBQUNnVSxnQkFBeEIsQ0FBN0IsRUFBd0U7QUFDdEU7QUFDQTtBQUNELEtBMUM0QixDQTZDN0I7QUFDQTtBQUNBOzs7QUFDQSxRQUFJa0IsV0FBVyxHQUFHbFYsSUFBSSxDQUFDK1Qsa0JBQUwsQ0FBd0JoTSxNQUExQzs7QUFDQSxXQUFPbU4sV0FBVyxHQUFHLENBQWQsR0FBa0IsQ0FBbEIsSUFBdUJsVixJQUFJLENBQUMrVCxrQkFBTCxDQUF3Qm1CLFdBQVcsR0FBRyxDQUF0QyxFQUF5Q2hKLEVBQXpDLENBQTRDaUosV0FBNUMsQ0FBd0RqSixFQUF4RCxDQUE5QixFQUEyRjtBQUN6RmdKLGlCQUFXO0FBQ1o7O0FBQ0QsUUFBSXZFLENBQUMsR0FBRyxJQUFJblUsTUFBSixFQUFSOztBQUNBd0QsUUFBSSxDQUFDK1Qsa0JBQUwsQ0FBd0JxQixNQUF4QixDQUErQkYsV0FBL0IsRUFBNEMsQ0FBNUMsRUFBK0M7QUFBQ2hKLFFBQUUsRUFBRUEsRUFBTDtBQUFTbEosWUFBTSxFQUFFMk47QUFBakIsS0FBL0M7O0FBQ0FBLEtBQUMsQ0FBQ3ZPLElBQUY7QUFDRCxHQW5HNkI7QUFvRzlCa1MsZUFBYSxFQUFFLFlBQVk7QUFDekIsUUFBSXRVLElBQUksR0FBRyxJQUFYLENBRHlCLENBRXpCOztBQUNBLFFBQUlxVixVQUFVLEdBQUc1WSxHQUFHLENBQUNDLE9BQUosQ0FBWSxhQUFaLENBQWpCOztBQUNBLFFBQUkyWSxVQUFVLENBQUNDLEtBQVgsQ0FBaUJ0VixJQUFJLENBQUM0UyxTQUF0QixFQUFpQzJDLFFBQWpDLEtBQThDLE9BQWxELEVBQTJEO0FBQ3pELFlBQU03UyxLQUFLLENBQUMsNkRBQ0EscUJBREQsQ0FBWDtBQUVELEtBUHdCLENBU3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBMUMsUUFBSSxDQUFDK1Msb0JBQUwsR0FBNEIsSUFBSWxULGVBQUosQ0FDMUJHLElBQUksQ0FBQzRTLFNBRHFCLEVBQ1Y7QUFBQzVSLGNBQVEsRUFBRTtBQUFYLEtBRFUsQ0FBNUIsQ0FwQnlCLENBc0J6QjtBQUNBO0FBQ0E7O0FBQ0FoQixRQUFJLENBQUM4Uyx5QkFBTCxHQUFpQyxJQUFJalQsZUFBSixDQUMvQkcsSUFBSSxDQUFDNFMsU0FEMEIsRUFDZjtBQUFDNVIsY0FBUSxFQUFFO0FBQVgsS0FEZSxDQUFqQyxDQXpCeUIsQ0E0QnpCO0FBQ0E7QUFDQTtBQUNBOztBQUNBLFFBQUkyUCxDQUFDLEdBQUcsSUFBSW5VLE1BQUosRUFBUjs7QUFDQXdELFFBQUksQ0FBQzhTLHlCQUFMLENBQStCN1IsRUFBL0IsQ0FBa0N1VSxLQUFsQyxHQUEwQ0MsT0FBMUMsQ0FDRTtBQUFFQyxjQUFRLEVBQUU7QUFBWixLQURGLEVBQ21CL0UsQ0FBQyxDQUFDeE8sUUFBRixFQURuQjs7QUFFQSxRQUFJUCxXQUFXLEdBQUcrTyxDQUFDLENBQUN2TyxJQUFGLEVBQWxCOztBQUVBLFFBQUksRUFBRVIsV0FBVyxJQUFJQSxXQUFXLENBQUMrVCxPQUE3QixDQUFKLEVBQTJDO0FBQ3pDLFlBQU1qVCxLQUFLLENBQUMsNkRBQ0EscUJBREQsQ0FBWDtBQUVELEtBeEN3QixDQTBDekI7OztBQUNBLFFBQUlrVCxjQUFjLEdBQUc1VixJQUFJLENBQUM4Uyx5QkFBTCxDQUErQjVKLE9BQS9CLENBQ25CK0MsZ0JBRG1CLEVBQ0QsRUFEQyxFQUNHO0FBQUNOLFVBQUksRUFBRTtBQUFDb0osZ0JBQVEsRUFBRSxDQUFDO0FBQVosT0FBUDtBQUF1QmpKLFlBQU0sRUFBRTtBQUFDSSxVQUFFLEVBQUU7QUFBTDtBQUEvQixLQURILENBQXJCOztBQUdBLFFBQUkySixhQUFhLEdBQUd4WSxDQUFDLENBQUNVLEtBQUYsQ0FBUWlDLElBQUksQ0FBQ3VULGtCQUFiLENBQXBCOztBQUNBLFFBQUlxQyxjQUFKLEVBQW9CO0FBQ2xCO0FBQ0FDLG1CQUFhLENBQUMzSixFQUFkLEdBQW1CO0FBQUNrRCxXQUFHLEVBQUV3RyxjQUFjLENBQUMxSjtBQUFyQixPQUFuQixDQUZrQixDQUdsQjtBQUNBO0FBQ0E7O0FBQ0FsTSxVQUFJLENBQUNnVSxnQkFBTCxHQUF3QjRCLGNBQWMsQ0FBQzFKLEVBQXZDO0FBQ0Q7O0FBRUQsUUFBSW5DLGlCQUFpQixHQUFHLElBQUlkLGlCQUFKLENBQ3RCZ0QsZ0JBRHNCLEVBQ0o0SixhQURJLEVBQ1c7QUFBQ3hMLGNBQVEsRUFBRTtBQUFYLEtBRFgsQ0FBeEIsQ0F4RHlCLENBMkR6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0FySyxRQUFJLENBQUNpVCxXQUFMLEdBQW1CalQsSUFBSSxDQUFDK1Msb0JBQUwsQ0FBMEJsRSxJQUExQixDQUNqQjlFLGlCQURpQixFQUVqQixVQUFVL0gsR0FBVixFQUFlO0FBQ2JoQyxVQUFJLENBQUNtVSxXQUFMLENBQWlCNUYsSUFBakIsQ0FBc0J2TSxHQUF0Qjs7QUFDQWhDLFVBQUksQ0FBQzhWLGlCQUFMO0FBQ0QsS0FMZ0IsRUFNakI1RCxZQU5pQixDQUFuQjs7QUFRQWxTLFFBQUksQ0FBQ2tULFlBQUwsQ0FBa0I2QyxNQUFsQjtBQUNELEdBOUs2QjtBQWdMOUJELG1CQUFpQixFQUFFLFlBQVk7QUFDN0IsUUFBSTlWLElBQUksR0FBRyxJQUFYO0FBQ0EsUUFBSUEsSUFBSSxDQUFDcVUsYUFBVCxFQUF3QjtBQUN4QnJVLFFBQUksQ0FBQ3FVLGFBQUwsR0FBcUIsSUFBckI7QUFFQTlTLFVBQU0sQ0FBQzhOLEtBQVAsQ0FBYSxZQUFZO0FBQ3ZCO0FBQ0EsZUFBUzJHLFNBQVQsQ0FBbUJoVSxHQUFuQixFQUF3QjtBQUN0QixZQUFJQSxHQUFHLENBQUN3UixFQUFKLEtBQVcsWUFBZixFQUE2QjtBQUMzQixjQUFJeFIsR0FBRyxDQUFDeVEsQ0FBSixDQUFNd0QsUUFBVixFQUFvQjtBQUNsQjtBQUNBO0FBQ0EsZ0JBQUlDLGFBQWEsR0FBR2xVLEdBQUcsQ0FBQ2tLLEVBQXhCO0FBQ0FsSyxlQUFHLENBQUN5USxDQUFKLENBQU13RCxRQUFOLENBQWUxSyxPQUFmLENBQXVCaUgsRUFBRSxJQUFJO0FBQzNCO0FBQ0Esa0JBQUksQ0FBQ0EsRUFBRSxDQUFDdEcsRUFBUixFQUFZO0FBQ1ZzRyxrQkFBRSxDQUFDdEcsRUFBSCxHQUFRZ0ssYUFBUjtBQUNBQSw2QkFBYSxHQUFHQSxhQUFhLENBQUNDLEdBQWQsQ0FBa0J0WSxTQUFTLENBQUN1WSxHQUE1QixDQUFoQjtBQUNEOztBQUNESix1QkFBUyxDQUFDeEQsRUFBRCxDQUFUO0FBQ0QsYUFQRDtBQVFBO0FBQ0Q7O0FBQ0QsZ0JBQU0sSUFBSTlQLEtBQUosQ0FBVSxxQkFBcUIxRCxLQUFLLENBQUN3USxTQUFOLENBQWdCeE4sR0FBaEIsQ0FBL0IsQ0FBTjtBQUNEOztBQUVELGNBQU1xUCxPQUFPLEdBQUc7QUFDZHJMLHdCQUFjLEVBQUUsS0FERjtBQUVkRyxzQkFBWSxFQUFFLEtBRkE7QUFHZHFNLFlBQUUsRUFBRXhRO0FBSFUsU0FBaEI7O0FBTUEsWUFBSSxPQUFPQSxHQUFHLENBQUN3UixFQUFYLEtBQWtCLFFBQWxCLElBQ0F4UixHQUFHLENBQUN3UixFQUFKLENBQU82QyxVQUFQLENBQWtCclcsSUFBSSxDQUFDNlMsT0FBTCxHQUFlLEdBQWpDLENBREosRUFDMkM7QUFDekN4QixpQkFBTyxDQUFDcE8sVUFBUixHQUFxQmpCLEdBQUcsQ0FBQ3dSLEVBQUosQ0FBTzhDLEtBQVAsQ0FBYXRXLElBQUksQ0FBQzZTLE9BQUwsQ0FBYTlLLE1BQWIsR0FBc0IsQ0FBbkMsQ0FBckI7QUFDRCxTQTVCcUIsQ0E4QnRCO0FBQ0E7OztBQUNBLFlBQUlzSixPQUFPLENBQUNwTyxVQUFSLEtBQXVCLE1BQTNCLEVBQW1DO0FBQ2pDLGNBQUlqQixHQUFHLENBQUN5USxDQUFKLENBQU10TSxZQUFWLEVBQXdCO0FBQ3RCLG1CQUFPa0wsT0FBTyxDQUFDcE8sVUFBZjtBQUNBb08sbUJBQU8sQ0FBQ2xMLFlBQVIsR0FBdUIsSUFBdkI7QUFDRCxXQUhELE1BR08sSUFBSTlJLENBQUMsQ0FBQzBELEdBQUYsQ0FBTWlCLEdBQUcsQ0FBQ3lRLENBQVYsRUFBYSxNQUFiLENBQUosRUFBMEI7QUFDL0JwQixtQkFBTyxDQUFDcE8sVUFBUixHQUFxQmpCLEdBQUcsQ0FBQ3lRLENBQUosQ0FBTXhNLElBQTNCO0FBQ0FvTCxtQkFBTyxDQUFDckwsY0FBUixHQUF5QixJQUF6QjtBQUNBcUwsbUJBQU8sQ0FBQ3ZNLEVBQVIsR0FBYSxJQUFiO0FBQ0QsV0FKTSxNQUlBO0FBQ0wsa0JBQU1wQyxLQUFLLENBQUMscUJBQXFCMUQsS0FBSyxDQUFDd1EsU0FBTixDQUFnQnhOLEdBQWhCLENBQXRCLENBQVg7QUFDRDtBQUVGLFNBWkQsTUFZTztBQUNMO0FBQ0FxUCxpQkFBTyxDQUFDdk0sRUFBUixHQUFheU4sT0FBTyxDQUFDdlEsR0FBRCxDQUFwQjtBQUNEOztBQUVEaEMsWUFBSSxDQUFDbVQsU0FBTCxDQUFlb0QsSUFBZixDQUFvQmxGLE9BQXBCO0FBQ0Q7O0FBRUQsVUFBSTtBQUNGLGVBQU8sQ0FBRXJSLElBQUksQ0FBQ2dULFFBQVAsSUFDQSxDQUFFaFQsSUFBSSxDQUFDbVUsV0FBTCxDQUFpQnFDLE9BQWpCLEVBRFQsRUFDcUM7QUFDbkM7QUFDQTtBQUNBLGNBQUl4VyxJQUFJLENBQUNtVSxXQUFMLENBQWlCcE0sTUFBakIsR0FBMEIrSixjQUE5QixFQUE4QztBQUM1QyxnQkFBSWdELFNBQVMsR0FBRzlVLElBQUksQ0FBQ21VLFdBQUwsQ0FBaUJzQyxHQUFqQixFQUFoQjs7QUFDQXpXLGdCQUFJLENBQUNtVSxXQUFMLENBQWlCdUMsS0FBakI7O0FBRUExVyxnQkFBSSxDQUFDaVUscUJBQUwsQ0FBMkJ2VyxJQUEzQixDQUFnQyxVQUFVdUUsUUFBVixFQUFvQjtBQUNsREEsc0JBQVE7QUFDUixxQkFBTyxJQUFQO0FBQ0QsYUFIRCxFQUo0QyxDQVM1QztBQUNBOzs7QUFDQWpDLGdCQUFJLENBQUMyVyxtQkFBTCxDQUF5QjdCLFNBQVMsQ0FBQzVJLEVBQW5DOztBQUNBO0FBQ0Q7O0FBRUQsZ0JBQU1sSyxHQUFHLEdBQUdoQyxJQUFJLENBQUNtVSxXQUFMLENBQWlCeUMsS0FBakIsRUFBWixDQWxCbUMsQ0FvQm5DOzs7QUFDQVosbUJBQVMsQ0FBQ2hVLEdBQUQsQ0FBVCxDQXJCbUMsQ0F1Qm5DO0FBQ0E7O0FBQ0EsY0FBSUEsR0FBRyxDQUFDa0ssRUFBUixFQUFZO0FBQ1ZsTSxnQkFBSSxDQUFDMlcsbUJBQUwsQ0FBeUIzVSxHQUFHLENBQUNrSyxFQUE3QjtBQUNELFdBRkQsTUFFTztBQUNMLGtCQUFNeEosS0FBSyxDQUFDLDZCQUE2QjFELEtBQUssQ0FBQ3dRLFNBQU4sQ0FBZ0J4TixHQUFoQixDQUE5QixDQUFYO0FBQ0Q7QUFDRjtBQUNGLE9BakNELFNBaUNVO0FBQ1JoQyxZQUFJLENBQUNxVSxhQUFMLEdBQXFCLEtBQXJCO0FBQ0Q7QUFDRixLQTFGRDtBQTJGRCxHQWhSNkI7QUFrUjlCc0MscUJBQW1CLEVBQUUsVUFBVXpLLEVBQVYsRUFBYztBQUNqQyxRQUFJbE0sSUFBSSxHQUFHLElBQVg7QUFDQUEsUUFBSSxDQUFDZ1UsZ0JBQUwsR0FBd0I5SCxFQUF4Qjs7QUFDQSxXQUFPLENBQUM3TyxDQUFDLENBQUNtWixPQUFGLENBQVV4VyxJQUFJLENBQUMrVCxrQkFBZixDQUFELElBQXVDL1QsSUFBSSxDQUFDK1Qsa0JBQUwsQ0FBd0IsQ0FBeEIsRUFBMkI3SCxFQUEzQixDQUE4QitJLGVBQTlCLENBQThDalYsSUFBSSxDQUFDZ1UsZ0JBQW5ELENBQTlDLEVBQW9IO0FBQ2xILFVBQUk2QyxTQUFTLEdBQUc3VyxJQUFJLENBQUMrVCxrQkFBTCxDQUF3QjZDLEtBQXhCLEVBQWhCOztBQUNBQyxlQUFTLENBQUM3VCxNQUFWLENBQWlCK1MsTUFBakI7QUFDRDtBQUNGLEdBelI2QjtBQTJSOUI7QUFDQWUscUJBQW1CLEVBQUUsVUFBU25aLEtBQVQsRUFBZ0I7QUFDbkNtVSxrQkFBYyxHQUFHblUsS0FBakI7QUFDRCxHQTlSNkI7QUErUjlCb1osb0JBQWtCLEVBQUUsWUFBVztBQUM3QmpGLGtCQUFjLEdBQUdDLE9BQU8sQ0FBQ0MsR0FBUixDQUFZQywyQkFBWixJQUEyQyxJQUE1RDtBQUNEO0FBalM2QixDQUFoQyxFOzs7Ozs7Ozs7OztBQ3ZGQSxJQUFJelYsTUFBTSxHQUFHQyxHQUFHLENBQUNDLE9BQUosQ0FBWSxlQUFaLENBQWI7O0FBRUFtVCxrQkFBa0IsR0FBRyxVQUFVOVAsT0FBVixFQUFtQjtBQUN0QyxNQUFJQyxJQUFJLEdBQUcsSUFBWDtBQUVBLE1BQUksQ0FBQ0QsT0FBRCxJQUFZLENBQUMxQyxDQUFDLENBQUMwRCxHQUFGLENBQU1oQixPQUFOLEVBQWUsU0FBZixDQUFqQixFQUNFLE1BQU0yQyxLQUFLLENBQUMsd0JBQUQsQ0FBWDtBQUVGSixTQUFPLENBQUMsWUFBRCxDQUFQLElBQXlCQSxPQUFPLENBQUMsWUFBRCxDQUFQLENBQXNCMFUsS0FBdEIsQ0FBNEJDLG1CQUE1QixDQUN2QixnQkFEdUIsRUFDTCxzQkFESyxFQUNtQixDQURuQixDQUF6QjtBQUdBalgsTUFBSSxDQUFDa1gsUUFBTCxHQUFnQm5YLE9BQU8sQ0FBQ3FMLE9BQXhCOztBQUNBcEwsTUFBSSxDQUFDbVgsT0FBTCxHQUFlcFgsT0FBTyxDQUFDK1AsTUFBUixJQUFrQixZQUFZLENBQUUsQ0FBL0M7O0FBQ0E5UCxNQUFJLENBQUNvWCxNQUFMLEdBQWMsSUFBSTdWLE1BQU0sQ0FBQzhWLGlCQUFYLEVBQWQ7QUFDQXJYLE1BQUksQ0FBQ3NYLFFBQUwsR0FBZ0IsRUFBaEI7QUFDQXRYLE1BQUksQ0FBQ2tULFlBQUwsR0FBb0IsSUFBSTFXLE1BQUosRUFBcEI7QUFDQXdELE1BQUksQ0FBQ3VYLE1BQUwsR0FBYyxJQUFJM1MsZUFBZSxDQUFDNFMsc0JBQXBCLENBQTJDO0FBQ3ZEcE0sV0FBTyxFQUFFckwsT0FBTyxDQUFDcUw7QUFEc0MsR0FBM0MsQ0FBZCxDQWRzQyxDQWdCdEM7QUFDQTtBQUNBOztBQUNBcEwsTUFBSSxDQUFDeVgsdUNBQUwsR0FBK0MsQ0FBL0M7O0FBRUFwYSxHQUFDLENBQUNLLElBQUYsQ0FBT3NDLElBQUksQ0FBQzBYLGFBQUwsRUFBUCxFQUE2QixVQUFVQyxZQUFWLEVBQXdCO0FBQ25EM1gsUUFBSSxDQUFDMlgsWUFBRCxDQUFKLEdBQXFCO0FBQVU7QUFBVztBQUN4QzNYLFVBQUksQ0FBQzRYLGNBQUwsQ0FBb0JELFlBQXBCLEVBQWtDdGEsQ0FBQyxDQUFDd2EsT0FBRixDQUFVL08sU0FBVixDQUFsQztBQUNELEtBRkQ7QUFHRCxHQUpEO0FBS0QsQ0ExQkQ7O0FBNEJBekwsQ0FBQyxDQUFDa0ksTUFBRixDQUFTc0ssa0JBQWtCLENBQUMvUixTQUE1QixFQUF1QztBQUNyQ2tULDZCQUEyQixFQUFFLFVBQVU4RyxNQUFWLEVBQWtCO0FBQzdDLFFBQUk5WCxJQUFJLEdBQUcsSUFBWCxDQUQ2QyxDQUc3QztBQUNBO0FBQ0E7QUFDQTs7QUFDQSxRQUFJLENBQUNBLElBQUksQ0FBQ29YLE1BQUwsQ0FBWVcsYUFBWixFQUFMLEVBQ0UsTUFBTSxJQUFJclYsS0FBSixDQUFVLHNFQUFWLENBQU47QUFDRixNQUFFMUMsSUFBSSxDQUFDeVgsdUNBQVA7QUFFQW5WLFdBQU8sQ0FBQyxZQUFELENBQVAsSUFBeUJBLE9BQU8sQ0FBQyxZQUFELENBQVAsQ0FBc0IwVSxLQUF0QixDQUE0QkMsbUJBQTVCLENBQ3ZCLGdCQUR1QixFQUNMLGlCQURLLEVBQ2MsQ0FEZCxDQUF6Qjs7QUFHQWpYLFFBQUksQ0FBQ29YLE1BQUwsQ0FBWVksT0FBWixDQUFvQixZQUFZO0FBQzlCaFksVUFBSSxDQUFDc1gsUUFBTCxDQUFjUSxNQUFNLENBQUMvUyxHQUFyQixJQUE0QitTLE1BQTVCLENBRDhCLENBRTlCO0FBQ0E7O0FBQ0E5WCxVQUFJLENBQUNpWSxTQUFMLENBQWVILE1BQWY7O0FBQ0EsUUFBRTlYLElBQUksQ0FBQ3lYLHVDQUFQO0FBQ0QsS0FORCxFQWQ2QyxDQXFCN0M7OztBQUNBelgsUUFBSSxDQUFDa1QsWUFBTCxDQUFrQjlRLElBQWxCO0FBQ0QsR0F4Qm9DO0FBMEJyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQThWLGNBQVksRUFBRSxVQUFVcFQsRUFBVixFQUFjO0FBQzFCLFFBQUk5RSxJQUFJLEdBQUcsSUFBWCxDQUQwQixDQUcxQjtBQUNBO0FBQ0E7O0FBQ0EsUUFBSSxDQUFDQSxJQUFJLENBQUNtWSxNQUFMLEVBQUwsRUFDRSxNQUFNLElBQUl6VixLQUFKLENBQVUsbURBQVYsQ0FBTjtBQUVGLFdBQU8xQyxJQUFJLENBQUNzWCxRQUFMLENBQWN4UyxFQUFkLENBQVA7QUFFQXhDLFdBQU8sQ0FBQyxZQUFELENBQVAsSUFBeUJBLE9BQU8sQ0FBQyxZQUFELENBQVAsQ0FBc0IwVSxLQUF0QixDQUE0QkMsbUJBQTVCLENBQ3ZCLGdCQUR1QixFQUNMLGlCQURLLEVBQ2MsQ0FBQyxDQURmLENBQXpCOztBQUdBLFFBQUk1WixDQUFDLENBQUNtWixPQUFGLENBQVV4VyxJQUFJLENBQUNzWCxRQUFmLEtBQ0F0WCxJQUFJLENBQUN5WCx1Q0FBTCxLQUFpRCxDQURyRCxFQUN3RDtBQUN0RHpYLFVBQUksQ0FBQ29ZLEtBQUw7QUFDRDtBQUNGLEdBbERvQztBQW1EckNBLE9BQUssRUFBRSxVQUFVclksT0FBVixFQUFtQjtBQUN4QixRQUFJQyxJQUFJLEdBQUcsSUFBWDtBQUNBRCxXQUFPLEdBQUdBLE9BQU8sSUFBSSxFQUFyQixDQUZ3QixDQUl4QjtBQUNBOztBQUNBLFFBQUksQ0FBRUMsSUFBSSxDQUFDbVksTUFBTCxFQUFGLElBQW1CLENBQUVwWSxPQUFPLENBQUNzWSxjQUFqQyxFQUNFLE1BQU0zVixLQUFLLENBQUMsNkJBQUQsQ0FBWCxDQVBzQixDQVN4QjtBQUNBOztBQUNBMUMsUUFBSSxDQUFDbVgsT0FBTDs7QUFDQTdVLFdBQU8sQ0FBQyxZQUFELENBQVAsSUFBeUJBLE9BQU8sQ0FBQyxZQUFELENBQVAsQ0FBc0IwVSxLQUF0QixDQUE0QkMsbUJBQTVCLENBQ3ZCLGdCQUR1QixFQUNMLHNCQURLLEVBQ21CLENBQUMsQ0FEcEIsQ0FBekIsQ0Fad0IsQ0FleEI7QUFDQTs7QUFDQWpYLFFBQUksQ0FBQ3NYLFFBQUwsR0FBZ0IsSUFBaEI7QUFDRCxHQXJFb0M7QUF1RXJDO0FBQ0E7QUFDQWdCLE9BQUssRUFBRSxZQUFZO0FBQ2pCLFFBQUl0WSxJQUFJLEdBQUcsSUFBWDs7QUFDQUEsUUFBSSxDQUFDb1gsTUFBTCxDQUFZbUIsU0FBWixDQUFzQixZQUFZO0FBQ2hDLFVBQUl2WSxJQUFJLENBQUNtWSxNQUFMLEVBQUosRUFDRSxNQUFNelYsS0FBSyxDQUFDLDBDQUFELENBQVg7O0FBQ0YxQyxVQUFJLENBQUNrVCxZQUFMLENBQWtCNkMsTUFBbEI7QUFDRCxLQUpEO0FBS0QsR0FoRm9DO0FBa0ZyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQXlDLFlBQVUsRUFBRSxVQUFVL1csR0FBVixFQUFlO0FBQ3pCLFFBQUl6QixJQUFJLEdBQUcsSUFBWDs7QUFDQUEsUUFBSSxDQUFDb1gsTUFBTCxDQUFZWSxPQUFaLENBQW9CLFlBQVk7QUFDOUIsVUFBSWhZLElBQUksQ0FBQ21ZLE1BQUwsRUFBSixFQUNFLE1BQU16VixLQUFLLENBQUMsaURBQUQsQ0FBWDs7QUFDRjFDLFVBQUksQ0FBQ29ZLEtBQUwsQ0FBVztBQUFDQyxzQkFBYyxFQUFFO0FBQWpCLE9BQVg7O0FBQ0FyWSxVQUFJLENBQUNrVCxZQUFMLENBQWtCdUYsS0FBbEIsQ0FBd0JoWCxHQUF4QjtBQUNELEtBTEQ7QUFNRCxHQWhHb0M7QUFrR3JDO0FBQ0E7QUFDQTtBQUNBaVgsU0FBTyxFQUFFLFVBQVUzUyxFQUFWLEVBQWM7QUFDckIsUUFBSS9GLElBQUksR0FBRyxJQUFYOztBQUNBQSxRQUFJLENBQUNvWCxNQUFMLENBQVltQixTQUFaLENBQXNCLFlBQVk7QUFDaEMsVUFBSSxDQUFDdlksSUFBSSxDQUFDbVksTUFBTCxFQUFMLEVBQ0UsTUFBTXpWLEtBQUssQ0FBQyx1REFBRCxDQUFYO0FBQ0ZxRCxRQUFFO0FBQ0gsS0FKRDtBQUtELEdBNUdvQztBQTZHckMyUixlQUFhLEVBQUUsWUFBWTtBQUN6QixRQUFJMVgsSUFBSSxHQUFHLElBQVg7QUFDQSxRQUFJQSxJQUFJLENBQUNrWCxRQUFULEVBQ0UsT0FBTyxDQUFDLGFBQUQsRUFBZ0IsU0FBaEIsRUFBMkIsYUFBM0IsRUFBMEMsU0FBMUMsQ0FBUCxDQURGLEtBR0UsT0FBTyxDQUFDLE9BQUQsRUFBVSxTQUFWLEVBQXFCLFNBQXJCLENBQVA7QUFDSCxHQW5Ib0M7QUFvSHJDaUIsUUFBTSxFQUFFLFlBQVk7QUFDbEIsV0FBTyxLQUFLakYsWUFBTCxDQUFrQnlGLFVBQWxCLEVBQVA7QUFDRCxHQXRIb0M7QUF1SHJDZixnQkFBYyxFQUFFLFVBQVVELFlBQVYsRUFBd0JpQixJQUF4QixFQUE4QjtBQUM1QyxRQUFJNVksSUFBSSxHQUFHLElBQVg7O0FBQ0FBLFFBQUksQ0FBQ29YLE1BQUwsQ0FBWW1CLFNBQVosQ0FBc0IsWUFBWTtBQUNoQztBQUNBLFVBQUksQ0FBQ3ZZLElBQUksQ0FBQ3NYLFFBQVYsRUFDRSxPQUg4QixDQUtoQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBdFgsVUFBSSxDQUFDdVgsTUFBTCxDQUFZc0IsV0FBWixDQUF3QmxCLFlBQXhCLEVBQXNDOU8sS0FBdEMsQ0FBNEMsSUFBNUMsRUFBa0Q3SixLQUFLLENBQUNqQixLQUFOLENBQVk2YSxJQUFaLENBQWxELEVBVmdDLENBWWhDO0FBQ0E7OztBQUNBLFVBQUksQ0FBQzVZLElBQUksQ0FBQ21ZLE1BQUwsRUFBRCxJQUNDUixZQUFZLEtBQUssT0FBakIsSUFBNEJBLFlBQVksS0FBSyxhQURsRCxFQUNrRTtBQUNoRSxjQUFNLElBQUlqVixLQUFKLENBQVUsU0FBU2lWLFlBQVQsR0FBd0Isc0JBQWxDLENBQU47QUFDRCxPQWpCK0IsQ0FtQmhDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBdGEsT0FBQyxDQUFDSyxJQUFGLENBQU9MLENBQUMsQ0FBQ3liLElBQUYsQ0FBTzlZLElBQUksQ0FBQ3NYLFFBQVosQ0FBUCxFQUE4QixVQUFVeUIsUUFBVixFQUFvQjtBQUNoRCxZQUFJakIsTUFBTSxHQUFHOVgsSUFBSSxDQUFDc1gsUUFBTCxJQUFpQnRYLElBQUksQ0FBQ3NYLFFBQUwsQ0FBY3lCLFFBQWQsQ0FBOUI7QUFDQSxZQUFJLENBQUNqQixNQUFMLEVBQ0U7QUFDRixZQUFJN1YsUUFBUSxHQUFHNlYsTUFBTSxDQUFDLE1BQU1ILFlBQVAsQ0FBckIsQ0FKZ0QsQ0FLaEQ7O0FBQ0ExVixnQkFBUSxJQUFJQSxRQUFRLENBQUM0RyxLQUFULENBQWUsSUFBZixFQUFxQjdKLEtBQUssQ0FBQ2pCLEtBQU4sQ0FBWTZhLElBQVosQ0FBckIsQ0FBWjtBQUNELE9BUEQ7QUFRRCxLQWhDRDtBQWlDRCxHQTFKb0M7QUE0SnJDO0FBQ0E7QUFDQTtBQUNBO0FBQ0FYLFdBQVMsRUFBRSxVQUFVSCxNQUFWLEVBQWtCO0FBQzNCLFFBQUk5WCxJQUFJLEdBQUcsSUFBWDtBQUNBLFFBQUlBLElBQUksQ0FBQ29YLE1BQUwsQ0FBWVcsYUFBWixFQUFKLEVBQ0UsTUFBTXJWLEtBQUssQ0FBQyxrREFBRCxDQUFYO0FBQ0YsUUFBSXlULEdBQUcsR0FBR25XLElBQUksQ0FBQ2tYLFFBQUwsR0FBZ0JZLE1BQU0sQ0FBQ2tCLFlBQXZCLEdBQXNDbEIsTUFBTSxDQUFDbUIsTUFBdkQ7QUFDQSxRQUFJLENBQUM5QyxHQUFMLEVBQ0UsT0FOeUIsQ0FPM0I7O0FBQ0FuVyxRQUFJLENBQUN1WCxNQUFMLENBQVkyQixJQUFaLENBQWlCM04sT0FBakIsQ0FBeUIsVUFBVXZKLEdBQVYsRUFBZThDLEVBQWYsRUFBbUI7QUFDMUMsVUFBSSxDQUFDekgsQ0FBQyxDQUFDMEQsR0FBRixDQUFNZixJQUFJLENBQUNzWCxRQUFYLEVBQXFCUSxNQUFNLENBQUMvUyxHQUE1QixDQUFMLEVBQ0UsTUFBTXJDLEtBQUssQ0FBQyxpREFBRCxDQUFYO0FBQ0YsVUFBSW9KLE1BQU0sR0FBRzlNLEtBQUssQ0FBQ2pCLEtBQU4sQ0FBWWlFLEdBQVosQ0FBYjtBQUNBLGFBQU84SixNQUFNLENBQUMvRyxHQUFkO0FBQ0EsVUFBSS9FLElBQUksQ0FBQ2tYLFFBQVQsRUFDRWYsR0FBRyxDQUFDclIsRUFBRCxFQUFLZ0gsTUFBTCxFQUFhLElBQWIsQ0FBSCxDQURGLENBQ3lCO0FBRHpCLFdBR0VxSyxHQUFHLENBQUNyUixFQUFELEVBQUtnSCxNQUFMLENBQUg7QUFDSCxLQVREO0FBVUQ7QUFsTG9DLENBQXZDOztBQXNMQSxJQUFJcU4sbUJBQW1CLEdBQUcsQ0FBMUI7O0FBQ0FuSixhQUFhLEdBQUcsVUFBVVAsV0FBVixFQUF1QnpFLFNBQXZCLEVBQWtDO0FBQ2hELE1BQUloTCxJQUFJLEdBQUcsSUFBWCxDQURnRCxDQUVoRDtBQUNBOztBQUNBQSxNQUFJLENBQUNvWixZQUFMLEdBQW9CM0osV0FBcEI7O0FBQ0FwUyxHQUFDLENBQUNLLElBQUYsQ0FBTytSLFdBQVcsQ0FBQ2lJLGFBQVosRUFBUCxFQUFvQyxVQUFVelosSUFBVixFQUFnQjtBQUNsRCxRQUFJK00sU0FBUyxDQUFDL00sSUFBRCxDQUFiLEVBQXFCO0FBQ25CK0IsVUFBSSxDQUFDLE1BQU0vQixJQUFQLENBQUosR0FBbUIrTSxTQUFTLENBQUMvTSxJQUFELENBQTVCO0FBQ0QsS0FGRCxNQUVPLElBQUlBLElBQUksS0FBSyxhQUFULElBQTBCK00sU0FBUyxDQUFDMkcsS0FBeEMsRUFBK0M7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTNSLFVBQUksQ0FBQ2daLFlBQUwsR0FBb0IsVUFBVWxVLEVBQVYsRUFBY2dILE1BQWQsRUFBc0J1TixNQUF0QixFQUE4QjtBQUNoRHJPLGlCQUFTLENBQUMyRyxLQUFWLENBQWdCN00sRUFBaEIsRUFBb0JnSCxNQUFwQjtBQUNELE9BRkQ7QUFHRDtBQUNGLEdBWkQ7O0FBYUE5TCxNQUFJLENBQUNnVCxRQUFMLEdBQWdCLEtBQWhCO0FBQ0FoVCxNQUFJLENBQUMrRSxHQUFMLEdBQVdvVSxtQkFBbUIsRUFBOUI7QUFDRCxDQXBCRDs7QUFxQkFuSixhQUFhLENBQUNsUyxTQUFkLENBQXdCOEUsSUFBeEIsR0FBK0IsWUFBWTtBQUN6QyxNQUFJNUMsSUFBSSxHQUFHLElBQVg7QUFDQSxNQUFJQSxJQUFJLENBQUNnVCxRQUFULEVBQ0U7QUFDRmhULE1BQUksQ0FBQ2dULFFBQUwsR0FBZ0IsSUFBaEI7O0FBQ0FoVCxNQUFJLENBQUNvWixZQUFMLENBQWtCbEIsWUFBbEIsQ0FBK0JsWSxJQUFJLENBQUMrRSxHQUFwQztBQUNELENBTkQsQzs7Ozs7Ozs7Ozs7QUMxT0EvSCxNQUFNLENBQUNzYyxNQUFQLENBQWM7QUFBQ3BkLFlBQVUsRUFBQyxNQUFJQTtBQUFoQixDQUFkOztBQUFBLElBQUlxZCxLQUFLLEdBQUc5YyxHQUFHLENBQUNDLE9BQUosQ0FBWSxRQUFaLENBQVo7O0FBRU8sTUFBTVIsVUFBTixDQUFpQjtBQUN0QnNkLGFBQVcsQ0FBQ0MsZUFBRCxFQUFrQjtBQUMzQixTQUFLQyxnQkFBTCxHQUF3QkQsZUFBeEIsQ0FEMkIsQ0FFM0I7O0FBQ0EsU0FBS0UsZUFBTCxHQUF1QixJQUFJQyxHQUFKLEVBQXZCO0FBQ0QsR0FMcUIsQ0FPdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQXhRLE9BQUssQ0FBQ3JHLGNBQUQsRUFBaUIrQixFQUFqQixFQUFxQjBOLEVBQXJCLEVBQXlCdlEsUUFBekIsRUFBbUM7QUFDdEMsVUFBTWpDLElBQUksR0FBRyxJQUFiO0FBRUE2WixTQUFLLENBQUM5VyxjQUFELEVBQWlCK1csTUFBakIsQ0FBTDtBQUNBRCxTQUFLLENBQUNySCxFQUFELEVBQUtuUyxNQUFMLENBQUwsQ0FKc0MsQ0FNdEM7QUFDQTs7QUFDQSxRQUFJTCxJQUFJLENBQUMyWixlQUFMLENBQXFCNVksR0FBckIsQ0FBeUJ5UixFQUF6QixDQUFKLEVBQWtDO0FBQ2hDeFMsVUFBSSxDQUFDMlosZUFBTCxDQUFxQi9WLEdBQXJCLENBQXlCNE8sRUFBekIsRUFBNkJqRSxJQUE3QixDQUFrQ3RNLFFBQWxDOztBQUNBO0FBQ0Q7O0FBRUQsVUFBTStJLFNBQVMsR0FBRyxDQUFDL0ksUUFBRCxDQUFsQjs7QUFDQWpDLFFBQUksQ0FBQzJaLGVBQUwsQ0FBcUJwTSxHQUFyQixDQUF5QmlGLEVBQXpCLEVBQTZCeEgsU0FBN0I7O0FBRUF1TyxTQUFLLENBQUMsWUFBWTtBQUNoQixVQUFJO0FBQ0YsWUFBSXZYLEdBQUcsR0FBR2hDLElBQUksQ0FBQzBaLGdCQUFMLENBQXNCeFEsT0FBdEIsQ0FDUm5HLGNBRFEsRUFDUTtBQUFDZ0MsYUFBRyxFQUFFRDtBQUFOLFNBRFIsS0FDc0IsSUFEaEMsQ0FERSxDQUdGO0FBQ0E7O0FBQ0EsZUFBT2tHLFNBQVMsQ0FBQ2pELE1BQVYsR0FBbUIsQ0FBMUIsRUFBNkI7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQWlELG1CQUFTLENBQUN5TCxHQUFWLEdBQWdCLElBQWhCLEVBQXNCelgsS0FBSyxDQUFDakIsS0FBTixDQUFZaUUsR0FBWixDQUF0QjtBQUNEO0FBQ0YsT0FaRCxDQVlFLE9BQU8wQyxDQUFQLEVBQVU7QUFDVixlQUFPc0csU0FBUyxDQUFDakQsTUFBVixHQUFtQixDQUExQixFQUE2QjtBQUMzQmlELG1CQUFTLENBQUN5TCxHQUFWLEdBQWdCL1IsQ0FBaEI7QUFDRDtBQUNGLE9BaEJELFNBZ0JVO0FBQ1I7QUFDQTtBQUNBMUUsWUFBSSxDQUFDMlosZUFBTCxDQUFxQkksTUFBckIsQ0FBNEJ2SCxFQUE1QjtBQUNEO0FBQ0YsS0F0QkksQ0FBTCxDQXNCR3dILEdBdEJIO0FBdUJEOztBQXZEcUIsQzs7Ozs7Ozs7Ozs7QUNGeEIsSUFBSUMsbUJBQW1CLEdBQUcsQ0FBQ2xJLE9BQU8sQ0FBQ0MsR0FBUixDQUFZa0ksMEJBQWIsSUFBMkMsRUFBckU7QUFDQSxJQUFJQyxtQkFBbUIsR0FBRyxDQUFDcEksT0FBTyxDQUFDQyxHQUFSLENBQVlvSSwwQkFBYixJQUEyQyxLQUFLLElBQTFFOztBQUVBdkosb0JBQW9CLEdBQUcsVUFBVTlRLE9BQVYsRUFBbUI7QUFDeEMsTUFBSUMsSUFBSSxHQUFHLElBQVg7QUFFQUEsTUFBSSxDQUFDaUssa0JBQUwsR0FBMEJsSyxPQUFPLENBQUNnSyxpQkFBbEM7QUFDQS9KLE1BQUksQ0FBQ3FhLFlBQUwsR0FBb0J0YSxPQUFPLENBQUMrUSxXQUE1QjtBQUNBOVEsTUFBSSxDQUFDa1gsUUFBTCxHQUFnQm5YLE9BQU8sQ0FBQ3FMLE9BQXhCO0FBQ0FwTCxNQUFJLENBQUNvWixZQUFMLEdBQW9CclosT0FBTyxDQUFDMFAsV0FBNUI7QUFDQXpQLE1BQUksQ0FBQ3NhLGNBQUwsR0FBc0IsRUFBdEI7QUFDQXRhLE1BQUksQ0FBQ2dULFFBQUwsR0FBZ0IsS0FBaEI7QUFFQWhULE1BQUksQ0FBQ2tLLGtCQUFMLEdBQTBCbEssSUFBSSxDQUFDcWEsWUFBTCxDQUFrQi9QLHdCQUFsQixDQUN4QnRLLElBQUksQ0FBQ2lLLGtCQURtQixDQUExQixDQVZ3QyxDQWF4QztBQUNBOztBQUNBakssTUFBSSxDQUFDdWEsUUFBTCxHQUFnQixJQUFoQixDQWZ3QyxDQWlCeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0F2YSxNQUFJLENBQUN3YSw0QkFBTCxHQUFvQyxDQUFwQztBQUNBeGEsTUFBSSxDQUFDeWEsY0FBTCxHQUFzQixFQUF0QixDQXpCd0MsQ0F5QmQ7QUFFMUI7QUFDQTs7QUFDQXphLE1BQUksQ0FBQzBhLHNCQUFMLEdBQThCcmQsQ0FBQyxDQUFDc2QsUUFBRixDQUM1QjNhLElBQUksQ0FBQzRhLGlDQUR1QixFQUU1QjVhLElBQUksQ0FBQ2lLLGtCQUFMLENBQXdCbEssT0FBeEIsQ0FBZ0M4YSxpQkFBaEMsSUFBcURaO0FBQW9CO0FBRjdDLEdBQTlCLENBN0J3QyxDQWlDeEM7O0FBQ0FqYSxNQUFJLENBQUM4YSxVQUFMLEdBQWtCLElBQUl2WixNQUFNLENBQUM4VixpQkFBWCxFQUFsQjtBQUVBLE1BQUkwRCxlQUFlLEdBQUc5SixTQUFTLENBQzdCalIsSUFBSSxDQUFDaUssa0JBRHdCLEVBQ0osVUFBVXdLLFlBQVYsRUFBd0I7QUFDL0M7QUFDQTtBQUNBO0FBQ0EsUUFBSWhSLEtBQUssR0FBR0MsU0FBUyxDQUFDQyxrQkFBVixDQUE2QkMsR0FBN0IsRUFBWjs7QUFDQSxRQUFJSCxLQUFKLEVBQ0V6RCxJQUFJLENBQUN5YSxjQUFMLENBQW9CbE0sSUFBcEIsQ0FBeUI5SyxLQUFLLENBQUNJLFVBQU4sRUFBekIsRUFONkMsQ0FPL0M7QUFDQTtBQUNBOztBQUNBLFFBQUk3RCxJQUFJLENBQUN3YSw0QkFBTCxLQUFzQyxDQUExQyxFQUNFeGEsSUFBSSxDQUFDMGEsc0JBQUw7QUFDSCxHQWI0QixDQUEvQjs7QUFlQTFhLE1BQUksQ0FBQ3NhLGNBQUwsQ0FBb0IvTCxJQUFwQixDQUF5QixZQUFZO0FBQUV3TSxtQkFBZSxDQUFDblksSUFBaEI7QUFBeUIsR0FBaEUsRUFuRHdDLENBcUR4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsTUFBSTdDLE9BQU8sQ0FBQ3NRLHFCQUFaLEVBQW1DO0FBQ2pDclEsUUFBSSxDQUFDcVEscUJBQUwsR0FBNkJ0USxPQUFPLENBQUNzUSxxQkFBckM7QUFDRCxHQUZELE1BRU87QUFDTCxRQUFJMkssZUFBZSxHQUNiaGIsSUFBSSxDQUFDaUssa0JBQUwsQ0FBd0JsSyxPQUF4QixDQUFnQ2tiLGlCQUFoQyxJQUNBamIsSUFBSSxDQUFDaUssa0JBQUwsQ0FBd0JsSyxPQUF4QixDQUFnQ21iLGdCQURoQyxJQUNvRDtBQUNwRGYsdUJBSE47QUFJQSxRQUFJZ0IsY0FBYyxHQUFHNVosTUFBTSxDQUFDNlosV0FBUCxDQUNuQi9kLENBQUMsQ0FBQ0csSUFBRixDQUFPd0MsSUFBSSxDQUFDMGEsc0JBQVosRUFBb0MxYSxJQUFwQyxDQURtQixFQUN3QmdiLGVBRHhCLENBQXJCOztBQUVBaGIsUUFBSSxDQUFDc2EsY0FBTCxDQUFvQi9MLElBQXBCLENBQXlCLFlBQVk7QUFDbkNoTixZQUFNLENBQUM4WixhQUFQLENBQXFCRixjQUFyQjtBQUNELEtBRkQ7QUFHRCxHQXhFdUMsQ0EwRXhDOzs7QUFDQW5iLE1BQUksQ0FBQzRhLGlDQUFMOztBQUVBdFksU0FBTyxDQUFDLFlBQUQsQ0FBUCxJQUF5QkEsT0FBTyxDQUFDLFlBQUQsQ0FBUCxDQUFzQjBVLEtBQXRCLENBQTRCQyxtQkFBNUIsQ0FDdkIsZ0JBRHVCLEVBQ0wseUJBREssRUFDc0IsQ0FEdEIsQ0FBekI7QUFFRCxDQS9FRDs7QUFpRkE1WixDQUFDLENBQUNrSSxNQUFGLENBQVNzTCxvQkFBb0IsQ0FBQy9TLFNBQTlCLEVBQXlDO0FBQ3ZDO0FBQ0E4YyxtQ0FBaUMsRUFBRSxZQUFZO0FBQzdDLFFBQUk1YSxJQUFJLEdBQUcsSUFBWDtBQUNBLFFBQUlBLElBQUksQ0FBQ3dhLDRCQUFMLEdBQW9DLENBQXhDLEVBQ0U7QUFDRixNQUFFeGEsSUFBSSxDQUFDd2EsNEJBQVA7O0FBQ0F4YSxRQUFJLENBQUM4YSxVQUFMLENBQWdCdkMsU0FBaEIsQ0FBMEIsWUFBWTtBQUNwQ3ZZLFVBQUksQ0FBQ3NiLFVBQUw7QUFDRCxLQUZEO0FBR0QsR0FWc0M7QUFZdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBQyxpQkFBZSxFQUFFLFlBQVc7QUFDMUIsUUFBSXZiLElBQUksR0FBRyxJQUFYLENBRDBCLENBRTFCO0FBQ0E7O0FBQ0EsTUFBRUEsSUFBSSxDQUFDd2EsNEJBQVAsQ0FKMEIsQ0FLMUI7O0FBQ0F4YSxRQUFJLENBQUM4YSxVQUFMLENBQWdCOUMsT0FBaEIsQ0FBd0IsWUFBVyxDQUFFLENBQXJDLEVBTjBCLENBUTFCO0FBQ0E7OztBQUNBLFFBQUloWSxJQUFJLENBQUN3YSw0QkFBTCxLQUFzQyxDQUExQyxFQUNFLE1BQU0sSUFBSTlYLEtBQUosQ0FBVSxxQ0FDQTFDLElBQUksQ0FBQ3dhLDRCQURmLENBQU47QUFFSCxHQWpDc0M7QUFrQ3ZDZ0IsZ0JBQWMsRUFBRSxZQUFXO0FBQ3pCLFFBQUl4YixJQUFJLEdBQUcsSUFBWCxDQUR5QixDQUV6Qjs7QUFDQSxRQUFJQSxJQUFJLENBQUN3YSw0QkFBTCxLQUFzQyxDQUExQyxFQUNFLE1BQU0sSUFBSTlYLEtBQUosQ0FBVSxxQ0FDQTFDLElBQUksQ0FBQ3dhLDRCQURmLENBQU4sQ0FKdUIsQ0FNekI7QUFDQTs7QUFDQXhhLFFBQUksQ0FBQzhhLFVBQUwsQ0FBZ0I5QyxPQUFoQixDQUF3QixZQUFZO0FBQ2xDaFksVUFBSSxDQUFDc2IsVUFBTDtBQUNELEtBRkQ7QUFHRCxHQTdDc0M7QUErQ3ZDQSxZQUFVLEVBQUUsWUFBWTtBQUN0QixRQUFJdGIsSUFBSSxHQUFHLElBQVg7QUFDQSxNQUFFQSxJQUFJLENBQUN3YSw0QkFBUDtBQUVBLFFBQUl4YSxJQUFJLENBQUNnVCxRQUFULEVBQ0U7QUFFRixRQUFJeUksS0FBSyxHQUFHLEtBQVo7QUFDQSxRQUFJQyxVQUFKO0FBQ0EsUUFBSUMsVUFBVSxHQUFHM2IsSUFBSSxDQUFDdWEsUUFBdEI7O0FBQ0EsUUFBSSxDQUFDb0IsVUFBTCxFQUFpQjtBQUNmRixXQUFLLEdBQUcsSUFBUixDQURlLENBRWY7O0FBQ0FFLGdCQUFVLEdBQUczYixJQUFJLENBQUNrWCxRQUFMLEdBQWdCLEVBQWhCLEdBQXFCLElBQUl0UyxlQUFlLENBQUNvSSxNQUFwQixFQUFsQztBQUNEOztBQUVEaE4sUUFBSSxDQUFDcVEscUJBQUwsSUFBOEJyUSxJQUFJLENBQUNxUSxxQkFBTCxFQUE5QixDQWhCc0IsQ0FrQnRCOztBQUNBLFFBQUl1TCxjQUFjLEdBQUc1YixJQUFJLENBQUN5YSxjQUExQjtBQUNBemEsUUFBSSxDQUFDeWEsY0FBTCxHQUFzQixFQUF0QixDQXBCc0IsQ0FzQnRCOztBQUNBLFFBQUk7QUFDRmlCLGdCQUFVLEdBQUcxYixJQUFJLENBQUNrSyxrQkFBTCxDQUF3QndFLGFBQXhCLENBQXNDMU8sSUFBSSxDQUFDa1gsUUFBM0MsQ0FBYjtBQUNELEtBRkQsQ0FFRSxPQUFPeFMsQ0FBUCxFQUFVO0FBQ1YsVUFBSStXLEtBQUssSUFBSSxPQUFPL1csQ0FBQyxDQUFDbVgsSUFBVCxLQUFtQixRQUFoQyxFQUEwQztBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E3YixZQUFJLENBQUNvWixZQUFMLENBQWtCWixVQUFsQixDQUNFLElBQUk5VixLQUFKLENBQ0UsbUNBQ0VvWixJQUFJLENBQUN0TSxTQUFMLENBQWV4UCxJQUFJLENBQUNpSyxrQkFBcEIsQ0FERixHQUM0QyxJQUQ1QyxHQUNtRHZGLENBQUMsQ0FBQ3FYLE9BRnZELENBREY7O0FBSUE7QUFDRCxPQVpTLENBY1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQUMsV0FBSyxDQUFDbGUsU0FBTixDQUFnQnlRLElBQWhCLENBQXFCMUYsS0FBckIsQ0FBMkI3SSxJQUFJLENBQUN5YSxjQUFoQyxFQUFnRG1CLGNBQWhEOztBQUNBcmEsWUFBTSxDQUFDbVQsTUFBUCxDQUFjLG1DQUNBb0gsSUFBSSxDQUFDdE0sU0FBTCxDQUFleFAsSUFBSSxDQUFDaUssa0JBQXBCLENBRGQsRUFDdUR2RixDQUR2RDs7QUFFQTtBQUNELEtBakRxQixDQW1EdEI7OztBQUNBLFFBQUksQ0FBQzFFLElBQUksQ0FBQ2dULFFBQVYsRUFBb0I7QUFDbEJwTyxxQkFBZSxDQUFDcVgsaUJBQWhCLENBQ0VqYyxJQUFJLENBQUNrWCxRQURQLEVBQ2lCeUUsVUFEakIsRUFDNkJELFVBRDdCLEVBQ3lDMWIsSUFBSSxDQUFDb1osWUFEOUM7QUFFRCxLQXZEcUIsQ0F5RHRCO0FBQ0E7QUFDQTs7O0FBQ0EsUUFBSXFDLEtBQUosRUFDRXpiLElBQUksQ0FBQ29aLFlBQUwsQ0FBa0JkLEtBQWxCLEdBN0RvQixDQStEdEI7QUFDQTtBQUNBOztBQUNBdFksUUFBSSxDQUFDdWEsUUFBTCxHQUFnQm1CLFVBQWhCLENBbEVzQixDQW9FdEI7QUFDQTtBQUNBO0FBQ0E7O0FBQ0ExYixRQUFJLENBQUNvWixZQUFMLENBQWtCVixPQUFsQixDQUEwQixZQUFZO0FBQ3BDcmIsT0FBQyxDQUFDSyxJQUFGLENBQU9rZSxjQUFQLEVBQXVCLFVBQVVNLENBQVYsRUFBYTtBQUNsQ0EsU0FBQyxDQUFDcFksU0FBRjtBQUNELE9BRkQ7QUFHRCxLQUpEO0FBS0QsR0E1SHNDO0FBOEh2Q2xCLE1BQUksRUFBRSxZQUFZO0FBQ2hCLFFBQUk1QyxJQUFJLEdBQUcsSUFBWDtBQUNBQSxRQUFJLENBQUNnVCxRQUFMLEdBQWdCLElBQWhCOztBQUNBM1YsS0FBQyxDQUFDSyxJQUFGLENBQU9zQyxJQUFJLENBQUNzYSxjQUFaLEVBQTRCLFVBQVU2QixDQUFWLEVBQWE7QUFBRUEsT0FBQztBQUFLLEtBQWpELEVBSGdCLENBSWhCOzs7QUFDQTllLEtBQUMsQ0FBQ0ssSUFBRixDQUFPc0MsSUFBSSxDQUFDeWEsY0FBWixFQUE0QixVQUFVeUIsQ0FBVixFQUFhO0FBQ3ZDQSxPQUFDLENBQUNwWSxTQUFGO0FBQ0QsS0FGRDs7QUFHQXhCLFdBQU8sQ0FBQyxZQUFELENBQVAsSUFBeUJBLE9BQU8sQ0FBQyxZQUFELENBQVAsQ0FBc0IwVSxLQUF0QixDQUE0QkMsbUJBQTVCLENBQ3ZCLGdCQUR1QixFQUNMLHlCQURLLEVBQ3NCLENBQUMsQ0FEdkIsQ0FBekI7QUFFRDtBQXhJc0MsQ0FBekMsRTs7Ozs7Ozs7Ozs7QUNwRkEsSUFBSXphLE1BQU0sR0FBR0MsR0FBRyxDQUFDQyxPQUFKLENBQVksZUFBWixDQUFiOztBQUVBLElBQUkwZixLQUFLLEdBQUc7QUFDVkMsVUFBUSxFQUFFLFVBREE7QUFFVkMsVUFBUSxFQUFFLFVBRkE7QUFHVkMsUUFBTSxFQUFFO0FBSEUsQ0FBWixDLENBTUE7QUFDQTs7QUFDQSxJQUFJQyxlQUFlLEdBQUcsWUFBWSxDQUFFLENBQXBDOztBQUNBLElBQUlDLHVCQUF1QixHQUFHLFVBQVU5TCxDQUFWLEVBQWE7QUFDekMsU0FBTyxZQUFZO0FBQ2pCLFFBQUk7QUFDRkEsT0FBQyxDQUFDOUgsS0FBRixDQUFRLElBQVIsRUFBY0MsU0FBZDtBQUNELEtBRkQsQ0FFRSxPQUFPcEUsQ0FBUCxFQUFVO0FBQ1YsVUFBSSxFQUFFQSxDQUFDLFlBQVk4WCxlQUFmLENBQUosRUFDRSxNQUFNOVgsQ0FBTjtBQUNIO0FBQ0YsR0FQRDtBQVFELENBVEQ7O0FBV0EsSUFBSWdZLFNBQVMsR0FBRyxDQUFoQixDLENBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQWxNLGtCQUFrQixHQUFHLFVBQVV6USxPQUFWLEVBQW1CO0FBQ3RDLE1BQUlDLElBQUksR0FBRyxJQUFYO0FBQ0FBLE1BQUksQ0FBQzJjLFVBQUwsR0FBa0IsSUFBbEIsQ0FGc0MsQ0FFYjs7QUFFekIzYyxNQUFJLENBQUMrRSxHQUFMLEdBQVcyWCxTQUFYO0FBQ0FBLFdBQVM7QUFFVDFjLE1BQUksQ0FBQ2lLLGtCQUFMLEdBQTBCbEssT0FBTyxDQUFDZ0ssaUJBQWxDO0FBQ0EvSixNQUFJLENBQUNxYSxZQUFMLEdBQW9CdGEsT0FBTyxDQUFDK1EsV0FBNUI7QUFDQTlRLE1BQUksQ0FBQ29aLFlBQUwsR0FBb0JyWixPQUFPLENBQUMwUCxXQUE1Qjs7QUFFQSxNQUFJMVAsT0FBTyxDQUFDcUwsT0FBWixFQUFxQjtBQUNuQixVQUFNMUksS0FBSyxDQUFDLDJEQUFELENBQVg7QUFDRDs7QUFFRCxNQUFJd04sTUFBTSxHQUFHblEsT0FBTyxDQUFDbVEsTUFBckIsQ0Fmc0MsQ0FnQnRDO0FBQ0E7O0FBQ0EsTUFBSTBNLFVBQVUsR0FBRzFNLE1BQU0sSUFBSUEsTUFBTSxDQUFDMk0sYUFBUCxFQUEzQjs7QUFFQSxNQUFJOWMsT0FBTyxDQUFDZ0ssaUJBQVIsQ0FBMEJoSyxPQUExQixDQUFrQ29KLEtBQXRDLEVBQTZDO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQSxRQUFJMlQsV0FBVyxHQUFHO0FBQUVDLFdBQUssRUFBRW5ZLGVBQWUsQ0FBQ29JO0FBQXpCLEtBQWxCO0FBQ0FoTixRQUFJLENBQUNnZCxNQUFMLEdBQWNoZCxJQUFJLENBQUNpSyxrQkFBTCxDQUF3QmxLLE9BQXhCLENBQWdDb0osS0FBOUM7QUFDQW5KLFFBQUksQ0FBQ2lkLFdBQUwsR0FBbUJMLFVBQW5CO0FBQ0E1YyxRQUFJLENBQUNrZCxPQUFMLEdBQWVoTixNQUFmO0FBQ0FsUSxRQUFJLENBQUNtZCxrQkFBTCxHQUEwQixJQUFJQyxVQUFKLENBQWVSLFVBQWYsRUFBMkJFLFdBQTNCLENBQTFCLENBZDJDLENBZTNDOztBQUNBOWMsUUFBSSxDQUFDcWQsVUFBTCxHQUFrQixJQUFJQyxPQUFKLENBQVlWLFVBQVosRUFBd0JFLFdBQXhCLENBQWxCO0FBQ0QsR0FqQkQsTUFpQk87QUFDTDljLFFBQUksQ0FBQ2dkLE1BQUwsR0FBYyxDQUFkO0FBQ0FoZCxRQUFJLENBQUNpZCxXQUFMLEdBQW1CLElBQW5CO0FBQ0FqZCxRQUFJLENBQUNrZCxPQUFMLEdBQWUsSUFBZjtBQUNBbGQsUUFBSSxDQUFDbWQsa0JBQUwsR0FBMEIsSUFBMUI7QUFDQW5kLFFBQUksQ0FBQ3FkLFVBQUwsR0FBa0IsSUFBSXpZLGVBQWUsQ0FBQ29JLE1BQXBCLEVBQWxCO0FBQ0QsR0EzQ3FDLENBNkN0QztBQUNBO0FBQ0E7OztBQUNBaE4sTUFBSSxDQUFDdWQsbUJBQUwsR0FBMkIsS0FBM0I7QUFFQXZkLE1BQUksQ0FBQ2dULFFBQUwsR0FBZ0IsS0FBaEI7QUFDQWhULE1BQUksQ0FBQ3dkLFlBQUwsR0FBb0IsRUFBcEI7QUFFQWxiLFNBQU8sQ0FBQyxZQUFELENBQVAsSUFBeUJBLE9BQU8sQ0FBQyxZQUFELENBQVAsQ0FBc0IwVSxLQUF0QixDQUE0QkMsbUJBQTVCLENBQ3ZCLGdCQUR1QixFQUNMLHVCQURLLEVBQ29CLENBRHBCLENBQXpCOztBQUdBalgsTUFBSSxDQUFDeWQsb0JBQUwsQ0FBMEJyQixLQUFLLENBQUNDLFFBQWhDOztBQUVBcmMsTUFBSSxDQUFDMGQsUUFBTCxHQUFnQjNkLE9BQU8sQ0FBQ2tRLE9BQXhCO0FBQ0EsTUFBSXBFLFVBQVUsR0FBRzdMLElBQUksQ0FBQ2lLLGtCQUFMLENBQXdCbEssT0FBeEIsQ0FBZ0MrTCxNQUFoQyxJQUEwQyxFQUEzRDtBQUNBOUwsTUFBSSxDQUFDMmQsYUFBTCxHQUFxQi9ZLGVBQWUsQ0FBQ2daLGtCQUFoQixDQUFtQy9SLFVBQW5DLENBQXJCLENBNURzQyxDQTZEdEM7QUFDQTs7QUFDQTdMLE1BQUksQ0FBQzZkLGlCQUFMLEdBQXlCN2QsSUFBSSxDQUFDMGQsUUFBTCxDQUFjSSxxQkFBZCxDQUFvQ2pTLFVBQXBDLENBQXpCO0FBQ0EsTUFBSXFFLE1BQUosRUFDRWxRLElBQUksQ0FBQzZkLGlCQUFMLEdBQXlCM04sTUFBTSxDQUFDNE4scUJBQVAsQ0FBNkI5ZCxJQUFJLENBQUM2ZCxpQkFBbEMsQ0FBekI7QUFDRjdkLE1BQUksQ0FBQytkLG1CQUFMLEdBQTJCblosZUFBZSxDQUFDZ1osa0JBQWhCLENBQ3pCNWQsSUFBSSxDQUFDNmQsaUJBRG9CLENBQTNCO0FBR0E3ZCxNQUFJLENBQUNnZSxZQUFMLEdBQW9CLElBQUlwWixlQUFlLENBQUNvSSxNQUFwQixFQUFwQjtBQUNBaE4sTUFBSSxDQUFDaWUsa0JBQUwsR0FBMEIsSUFBMUI7QUFDQWplLE1BQUksQ0FBQ2tlLGdCQUFMLEdBQXdCLENBQXhCO0FBRUFsZSxNQUFJLENBQUNtZSx5QkFBTCxHQUFpQyxLQUFqQztBQUNBbmUsTUFBSSxDQUFDb2UsZ0NBQUwsR0FBd0MsRUFBeEMsQ0ExRXNDLENBNEV0QztBQUNBOztBQUNBcGUsTUFBSSxDQUFDd2QsWUFBTCxDQUFrQmpQLElBQWxCLENBQXVCdk8sSUFBSSxDQUFDcWEsWUFBTCxDQUFrQmxaLFlBQWxCLENBQStCeVQsZ0JBQS9CLENBQ3JCNkgsdUJBQXVCLENBQUMsWUFBWTtBQUNsQ3pjLFFBQUksQ0FBQ3FlLGdCQUFMO0FBQ0QsR0FGc0IsQ0FERixDQUF2Qjs7QUFNQWpOLGdCQUFjLENBQUNwUixJQUFJLENBQUNpSyxrQkFBTixFQUEwQixVQUFVb0gsT0FBVixFQUFtQjtBQUN6RHJSLFFBQUksQ0FBQ3dkLFlBQUwsQ0FBa0JqUCxJQUFsQixDQUF1QnZPLElBQUksQ0FBQ3FhLFlBQUwsQ0FBa0JsWixZQUFsQixDQUErQm9ULFlBQS9CLENBQ3JCbEQsT0FEcUIsRUFDWixVQUFVb0QsWUFBVixFQUF3QjtBQUMvQmxULFlBQU0sQ0FBQ3FPLGdCQUFQLENBQXdCNk0sdUJBQXVCLENBQUMsWUFBWTtBQUMxRCxZQUFJakssRUFBRSxHQUFHaUMsWUFBWSxDQUFDakMsRUFBdEI7O0FBQ0EsWUFBSWlDLFlBQVksQ0FBQ3pPLGNBQWIsSUFBK0J5TyxZQUFZLENBQUN0TyxZQUFoRCxFQUE4RDtBQUM1RDtBQUNBO0FBQ0E7QUFDQW5HLGNBQUksQ0FBQ3FlLGdCQUFMO0FBQ0QsU0FMRCxNQUtPO0FBQ0w7QUFDQSxjQUFJcmUsSUFBSSxDQUFDc2UsTUFBTCxLQUFnQmxDLEtBQUssQ0FBQ0MsUUFBMUIsRUFBb0M7QUFDbENyYyxnQkFBSSxDQUFDdWUseUJBQUwsQ0FBK0IvTCxFQUEvQjtBQUNELFdBRkQsTUFFTztBQUNMeFMsZ0JBQUksQ0FBQ3dlLGlDQUFMLENBQXVDaE0sRUFBdkM7QUFDRDtBQUNGO0FBQ0YsT0FmOEMsQ0FBL0M7QUFnQkQsS0FsQm9CLENBQXZCO0FBb0JELEdBckJhLENBQWQsQ0FwRnNDLENBMkd0Qzs7QUFDQXhTLE1BQUksQ0FBQ3dkLFlBQUwsQ0FBa0JqUCxJQUFsQixDQUF1QjBDLFNBQVMsQ0FDOUJqUixJQUFJLENBQUNpSyxrQkFEeUIsRUFDTCxVQUFVd0ssWUFBVixFQUF3QjtBQUMvQztBQUNBLFFBQUloUixLQUFLLEdBQUdDLFNBQVMsQ0FBQ0Msa0JBQVYsQ0FBNkJDLEdBQTdCLEVBQVo7O0FBQ0EsUUFBSSxDQUFDSCxLQUFELElBQVVBLEtBQUssQ0FBQ2diLEtBQXBCLEVBQ0U7O0FBRUYsUUFBSWhiLEtBQUssQ0FBQ2liLG9CQUFWLEVBQWdDO0FBQzlCamIsV0FBSyxDQUFDaWIsb0JBQU4sQ0FBMkIxZSxJQUFJLENBQUMrRSxHQUFoQyxJQUF1Qy9FLElBQXZDO0FBQ0E7QUFDRDs7QUFFRHlELFNBQUssQ0FBQ2liLG9CQUFOLEdBQTZCLEVBQTdCO0FBQ0FqYixTQUFLLENBQUNpYixvQkFBTixDQUEyQjFlLElBQUksQ0FBQytFLEdBQWhDLElBQXVDL0UsSUFBdkM7QUFFQXlELFNBQUssQ0FBQ2tiLFlBQU4sQ0FBbUIsWUFBWTtBQUM3QixVQUFJQyxPQUFPLEdBQUduYixLQUFLLENBQUNpYixvQkFBcEI7QUFDQSxhQUFPamIsS0FBSyxDQUFDaWIsb0JBQWIsQ0FGNkIsQ0FJN0I7QUFDQTs7QUFDQTFlLFVBQUksQ0FBQ3FhLFlBQUwsQ0FBa0JsWixZQUFsQixDQUErQjBULGlCQUEvQjs7QUFFQXhYLE9BQUMsQ0FBQ0ssSUFBRixDQUFPa2hCLE9BQVAsRUFBZ0IsVUFBVUMsTUFBVixFQUFrQjtBQUNoQyxZQUFJQSxNQUFNLENBQUM3TCxRQUFYLEVBQ0U7QUFFRixZQUFJOU8sS0FBSyxHQUFHVCxLQUFLLENBQUNJLFVBQU4sRUFBWjs7QUFDQSxZQUFJZ2IsTUFBTSxDQUFDUCxNQUFQLEtBQWtCbEMsS0FBSyxDQUFDRyxNQUE1QixFQUFvQztBQUNsQztBQUNBO0FBQ0E7QUFDQXNDLGdCQUFNLENBQUN6RixZQUFQLENBQW9CVixPQUFwQixDQUE0QixZQUFZO0FBQ3RDeFUsaUJBQUssQ0FBQ0osU0FBTjtBQUNELFdBRkQ7QUFHRCxTQVBELE1BT087QUFDTCthLGdCQUFNLENBQUNULGdDQUFQLENBQXdDN1AsSUFBeEMsQ0FBNkNySyxLQUE3QztBQUNEO0FBQ0YsT0FmRDtBQWdCRCxLQXhCRDtBQXlCRCxHQXhDNkIsQ0FBaEMsRUE1R3NDLENBdUp0QztBQUNBOzs7QUFDQWxFLE1BQUksQ0FBQ3dkLFlBQUwsQ0FBa0JqUCxJQUFsQixDQUF1QnZPLElBQUksQ0FBQ3FhLFlBQUwsQ0FBa0J0VyxXQUFsQixDQUE4QjBZLHVCQUF1QixDQUMxRSxZQUFZO0FBQ1Z6YyxRQUFJLENBQUNxZSxnQkFBTDtBQUNELEdBSHlFLENBQXJELENBQXZCLEVBekpzQyxDQThKdEM7QUFDQTs7O0FBQ0E5YyxRQUFNLENBQUM4TixLQUFQLENBQWFvTix1QkFBdUIsQ0FBQyxZQUFZO0FBQy9DemMsUUFBSSxDQUFDOGUsZ0JBQUw7QUFDRCxHQUZtQyxDQUFwQztBQUdELENBbktEOztBQXFLQXpoQixDQUFDLENBQUNrSSxNQUFGLENBQVNpTCxrQkFBa0IsQ0FBQzFTLFNBQTVCLEVBQXVDO0FBQ3JDaWhCLGVBQWEsRUFBRSxVQUFVamEsRUFBVixFQUFjOUMsR0FBZCxFQUFtQjtBQUNoQyxRQUFJaEMsSUFBSSxHQUFHLElBQVg7O0FBQ0F1QixVQUFNLENBQUNxTyxnQkFBUCxDQUF3QixZQUFZO0FBQ2xDLFVBQUk5RCxNQUFNLEdBQUd6TyxDQUFDLENBQUNVLEtBQUYsQ0FBUWlFLEdBQVIsQ0FBYjs7QUFDQSxhQUFPOEosTUFBTSxDQUFDL0csR0FBZDs7QUFDQS9FLFVBQUksQ0FBQ3FkLFVBQUwsQ0FBZ0I5UCxHQUFoQixDQUFvQnpJLEVBQXBCLEVBQXdCOUUsSUFBSSxDQUFDK2QsbUJBQUwsQ0FBeUIvYixHQUF6QixDQUF4Qjs7QUFDQWhDLFVBQUksQ0FBQ29aLFlBQUwsQ0FBa0J6SCxLQUFsQixDQUF3QjdNLEVBQXhCLEVBQTRCOUUsSUFBSSxDQUFDMmQsYUFBTCxDQUFtQjdSLE1BQW5CLENBQTVCLEVBSmtDLENBTWxDO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxVQUFJOUwsSUFBSSxDQUFDZ2QsTUFBTCxJQUFlaGQsSUFBSSxDQUFDcWQsVUFBTCxDQUFnQnRlLElBQWhCLEtBQXlCaUIsSUFBSSxDQUFDZ2QsTUFBakQsRUFBeUQ7QUFDdkQ7QUFDQSxZQUFJaGQsSUFBSSxDQUFDcWQsVUFBTCxDQUFnQnRlLElBQWhCLE9BQTJCaUIsSUFBSSxDQUFDZ2QsTUFBTCxHQUFjLENBQTdDLEVBQWdEO0FBQzlDLGdCQUFNLElBQUl0YSxLQUFKLENBQVUsaUNBQ0MxQyxJQUFJLENBQUNxZCxVQUFMLENBQWdCdGUsSUFBaEIsS0FBeUJpQixJQUFJLENBQUNnZCxNQUQvQixJQUVBLG9DQUZWLENBQU47QUFHRDs7QUFFRCxZQUFJZ0MsZ0JBQWdCLEdBQUdoZixJQUFJLENBQUNxZCxVQUFMLENBQWdCNEIsWUFBaEIsRUFBdkI7O0FBQ0EsWUFBSUMsY0FBYyxHQUFHbGYsSUFBSSxDQUFDcWQsVUFBTCxDQUFnQnpaLEdBQWhCLENBQW9Cb2IsZ0JBQXBCLENBQXJCOztBQUVBLFlBQUloZ0IsS0FBSyxDQUFDbWdCLE1BQU4sQ0FBYUgsZ0JBQWIsRUFBK0JsYSxFQUEvQixDQUFKLEVBQXdDO0FBQ3RDLGdCQUFNLElBQUlwQyxLQUFKLENBQVUsMERBQVYsQ0FBTjtBQUNEOztBQUVEMUMsWUFBSSxDQUFDcWQsVUFBTCxDQUFnQnhYLE1BQWhCLENBQXVCbVosZ0JBQXZCOztBQUNBaGYsWUFBSSxDQUFDb1osWUFBTCxDQUFrQmdHLE9BQWxCLENBQTBCSixnQkFBMUI7O0FBQ0FoZixZQUFJLENBQUNxZixZQUFMLENBQWtCTCxnQkFBbEIsRUFBb0NFLGNBQXBDO0FBQ0Q7QUFDRixLQTdCRDtBQThCRCxHQWpDb0M7QUFrQ3JDSSxrQkFBZ0IsRUFBRSxVQUFVeGEsRUFBVixFQUFjO0FBQzlCLFFBQUk5RSxJQUFJLEdBQUcsSUFBWDs7QUFDQXVCLFVBQU0sQ0FBQ3FPLGdCQUFQLENBQXdCLFlBQVk7QUFDbEM1UCxVQUFJLENBQUNxZCxVQUFMLENBQWdCeFgsTUFBaEIsQ0FBdUJmLEVBQXZCOztBQUNBOUUsVUFBSSxDQUFDb1osWUFBTCxDQUFrQmdHLE9BQWxCLENBQTBCdGEsRUFBMUI7O0FBQ0EsVUFBSSxDQUFFOUUsSUFBSSxDQUFDZ2QsTUFBUCxJQUFpQmhkLElBQUksQ0FBQ3FkLFVBQUwsQ0FBZ0J0ZSxJQUFoQixPQUEyQmlCLElBQUksQ0FBQ2dkLE1BQXJELEVBQ0U7QUFFRixVQUFJaGQsSUFBSSxDQUFDcWQsVUFBTCxDQUFnQnRlLElBQWhCLEtBQXlCaUIsSUFBSSxDQUFDZ2QsTUFBbEMsRUFDRSxNQUFNdGEsS0FBSyxDQUFDLDZCQUFELENBQVgsQ0FQZ0MsQ0FTbEM7QUFDQTs7QUFFQSxVQUFJLENBQUMxQyxJQUFJLENBQUNtZCxrQkFBTCxDQUF3Qm9DLEtBQXhCLEVBQUwsRUFBc0M7QUFDcEM7QUFDQTtBQUNBLFlBQUlDLFFBQVEsR0FBR3hmLElBQUksQ0FBQ21kLGtCQUFMLENBQXdCc0MsWUFBeEIsRUFBZjs7QUFDQSxZQUFJdlksTUFBTSxHQUFHbEgsSUFBSSxDQUFDbWQsa0JBQUwsQ0FBd0J2WixHQUF4QixDQUE0QjRiLFFBQTVCLENBQWI7O0FBQ0F4ZixZQUFJLENBQUMwZixlQUFMLENBQXFCRixRQUFyQjs7QUFDQXhmLFlBQUksQ0FBQytlLGFBQUwsQ0FBbUJTLFFBQW5CLEVBQTZCdFksTUFBN0I7O0FBQ0E7QUFDRCxPQXBCaUMsQ0FzQmxDO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsVUFBSWxILElBQUksQ0FBQ3NlLE1BQUwsS0FBZ0JsQyxLQUFLLENBQUNDLFFBQTFCLEVBQ0UsT0E5QmdDLENBZ0NsQztBQUNBO0FBQ0E7QUFDQTs7QUFDQSxVQUFJcmMsSUFBSSxDQUFDdWQsbUJBQVQsRUFDRSxPQXJDZ0MsQ0F1Q2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxZQUFNLElBQUk3YSxLQUFKLENBQVUsMkJBQVYsQ0FBTjtBQUNELEtBL0NEO0FBZ0RELEdBcEZvQztBQXFGckNpZCxrQkFBZ0IsRUFBRSxVQUFVN2EsRUFBVixFQUFjOGEsTUFBZCxFQUFzQjFZLE1BQXRCLEVBQThCO0FBQzlDLFFBQUlsSCxJQUFJLEdBQUcsSUFBWDs7QUFDQXVCLFVBQU0sQ0FBQ3FPLGdCQUFQLENBQXdCLFlBQVk7QUFDbEM1UCxVQUFJLENBQUNxZCxVQUFMLENBQWdCOVAsR0FBaEIsQ0FBb0J6SSxFQUFwQixFQUF3QjlFLElBQUksQ0FBQytkLG1CQUFMLENBQXlCN1csTUFBekIsQ0FBeEI7O0FBQ0EsVUFBSTJZLFlBQVksR0FBRzdmLElBQUksQ0FBQzJkLGFBQUwsQ0FBbUJ6VyxNQUFuQixDQUFuQjs7QUFDQSxVQUFJNFksWUFBWSxHQUFHOWYsSUFBSSxDQUFDMmQsYUFBTCxDQUFtQmlDLE1BQW5CLENBQW5COztBQUNBLFVBQUlHLE9BQU8sR0FBR0MsWUFBWSxDQUFDQyxpQkFBYixDQUNaSixZQURZLEVBQ0VDLFlBREYsQ0FBZDtBQUVBLFVBQUksQ0FBQ3ppQixDQUFDLENBQUNtWixPQUFGLENBQVV1SixPQUFWLENBQUwsRUFDRS9mLElBQUksQ0FBQ29aLFlBQUwsQ0FBa0IyRyxPQUFsQixDQUEwQmpiLEVBQTFCLEVBQThCaWIsT0FBOUI7QUFDSCxLQVJEO0FBU0QsR0FoR29DO0FBaUdyQ1YsY0FBWSxFQUFFLFVBQVV2YSxFQUFWLEVBQWM5QyxHQUFkLEVBQW1CO0FBQy9CLFFBQUloQyxJQUFJLEdBQUcsSUFBWDs7QUFDQXVCLFVBQU0sQ0FBQ3FPLGdCQUFQLENBQXdCLFlBQVk7QUFDbEM1UCxVQUFJLENBQUNtZCxrQkFBTCxDQUF3QjVQLEdBQXhCLENBQTRCekksRUFBNUIsRUFBZ0M5RSxJQUFJLENBQUMrZCxtQkFBTCxDQUF5Qi9iLEdBQXpCLENBQWhDLEVBRGtDLENBR2xDOzs7QUFDQSxVQUFJaEMsSUFBSSxDQUFDbWQsa0JBQUwsQ0FBd0JwZSxJQUF4QixLQUFpQ2lCLElBQUksQ0FBQ2dkLE1BQTFDLEVBQWtEO0FBQ2hELFlBQUlrRCxhQUFhLEdBQUdsZ0IsSUFBSSxDQUFDbWQsa0JBQUwsQ0FBd0I4QixZQUF4QixFQUFwQjs7QUFFQWpmLFlBQUksQ0FBQ21kLGtCQUFMLENBQXdCdFgsTUFBeEIsQ0FBK0JxYSxhQUEvQixFQUhnRCxDQUtoRDtBQUNBOzs7QUFDQWxnQixZQUFJLENBQUN1ZCxtQkFBTCxHQUEyQixLQUEzQjtBQUNEO0FBQ0YsS0FiRDtBQWNELEdBakhvQztBQWtIckM7QUFDQTtBQUNBbUMsaUJBQWUsRUFBRSxVQUFVNWEsRUFBVixFQUFjO0FBQzdCLFFBQUk5RSxJQUFJLEdBQUcsSUFBWDs7QUFDQXVCLFVBQU0sQ0FBQ3FPLGdCQUFQLENBQXdCLFlBQVk7QUFDbEM1UCxVQUFJLENBQUNtZCxrQkFBTCxDQUF3QnRYLE1BQXhCLENBQStCZixFQUEvQixFQURrQyxDQUVsQztBQUNBO0FBQ0E7OztBQUNBLFVBQUksQ0FBRTlFLElBQUksQ0FBQ21kLGtCQUFMLENBQXdCcGUsSUFBeEIsRUFBRixJQUFvQyxDQUFFaUIsSUFBSSxDQUFDdWQsbUJBQS9DLEVBQ0V2ZCxJQUFJLENBQUNxZSxnQkFBTDtBQUNILEtBUEQ7QUFRRCxHQTlIb0M7QUErSHJDO0FBQ0E7QUFDQTtBQUNBOEIsY0FBWSxFQUFFLFVBQVVuZSxHQUFWLEVBQWU7QUFDM0IsUUFBSWhDLElBQUksR0FBRyxJQUFYOztBQUNBdUIsVUFBTSxDQUFDcU8sZ0JBQVAsQ0FBd0IsWUFBWTtBQUNsQyxVQUFJOUssRUFBRSxHQUFHOUMsR0FBRyxDQUFDK0MsR0FBYjtBQUNBLFVBQUkvRSxJQUFJLENBQUNxZCxVQUFMLENBQWdCdGMsR0FBaEIsQ0FBb0IrRCxFQUFwQixDQUFKLEVBQ0UsTUFBTXBDLEtBQUssQ0FBQyw4Q0FBOENvQyxFQUEvQyxDQUFYO0FBQ0YsVUFBSTlFLElBQUksQ0FBQ2dkLE1BQUwsSUFBZWhkLElBQUksQ0FBQ21kLGtCQUFMLENBQXdCcGMsR0FBeEIsQ0FBNEIrRCxFQUE1QixDQUFuQixFQUNFLE1BQU1wQyxLQUFLLENBQUMsc0RBQXNEb0MsRUFBdkQsQ0FBWDtBQUVGLFVBQUlxRSxLQUFLLEdBQUduSixJQUFJLENBQUNnZCxNQUFqQjtBQUNBLFVBQUlKLFVBQVUsR0FBRzVjLElBQUksQ0FBQ2lkLFdBQXRCO0FBQ0EsVUFBSW1ELFlBQVksR0FBSWpYLEtBQUssSUFBSW5KLElBQUksQ0FBQ3FkLFVBQUwsQ0FBZ0J0ZSxJQUFoQixLQUF5QixDQUFuQyxHQUNqQmlCLElBQUksQ0FBQ3FkLFVBQUwsQ0FBZ0J6WixHQUFoQixDQUFvQjVELElBQUksQ0FBQ3FkLFVBQUwsQ0FBZ0I0QixZQUFoQixFQUFwQixDQURpQixHQUNxQyxJQUR4RDtBQUVBLFVBQUlvQixXQUFXLEdBQUlsWCxLQUFLLElBQUluSixJQUFJLENBQUNtZCxrQkFBTCxDQUF3QnBlLElBQXhCLEtBQWlDLENBQTNDLEdBQ2RpQixJQUFJLENBQUNtZCxrQkFBTCxDQUF3QnZaLEdBQXhCLENBQTRCNUQsSUFBSSxDQUFDbWQsa0JBQUwsQ0FBd0I4QixZQUF4QixFQUE1QixDQURjLEdBRWQsSUFGSixDQVhrQyxDQWNsQztBQUNBO0FBQ0E7O0FBQ0EsVUFBSXFCLFNBQVMsR0FBRyxDQUFFblgsS0FBRixJQUFXbkosSUFBSSxDQUFDcWQsVUFBTCxDQUFnQnRlLElBQWhCLEtBQXlCb0ssS0FBcEMsSUFDZHlULFVBQVUsQ0FBQzVhLEdBQUQsRUFBTW9lLFlBQU4sQ0FBVixHQUFnQyxDQURsQyxDQWpCa0MsQ0FvQmxDO0FBQ0E7QUFDQTs7QUFDQSxVQUFJRyxpQkFBaUIsR0FBRyxDQUFDRCxTQUFELElBQWN0Z0IsSUFBSSxDQUFDdWQsbUJBQW5CLElBQ3RCdmQsSUFBSSxDQUFDbWQsa0JBQUwsQ0FBd0JwZSxJQUF4QixLQUFpQ29LLEtBRG5DLENBdkJrQyxDQTBCbEM7QUFDQTs7QUFDQSxVQUFJcVgsbUJBQW1CLEdBQUcsQ0FBQ0YsU0FBRCxJQUFjRCxXQUFkLElBQ3hCekQsVUFBVSxDQUFDNWEsR0FBRCxFQUFNcWUsV0FBTixDQUFWLElBQWdDLENBRGxDO0FBR0EsVUFBSUksUUFBUSxHQUFHRixpQkFBaUIsSUFBSUMsbUJBQXBDOztBQUVBLFVBQUlGLFNBQUosRUFBZTtBQUNidGdCLFlBQUksQ0FBQytlLGFBQUwsQ0FBbUJqYSxFQUFuQixFQUF1QjlDLEdBQXZCO0FBQ0QsT0FGRCxNQUVPLElBQUl5ZSxRQUFKLEVBQWM7QUFDbkJ6Z0IsWUFBSSxDQUFDcWYsWUFBTCxDQUFrQnZhLEVBQWxCLEVBQXNCOUMsR0FBdEI7QUFDRCxPQUZNLE1BRUE7QUFDTDtBQUNBaEMsWUFBSSxDQUFDdWQsbUJBQUwsR0FBMkIsS0FBM0I7QUFDRDtBQUNGLEtBekNEO0FBMENELEdBOUtvQztBQStLckM7QUFDQTtBQUNBO0FBQ0FtRCxpQkFBZSxFQUFFLFVBQVU1YixFQUFWLEVBQWM7QUFDN0IsUUFBSTlFLElBQUksR0FBRyxJQUFYOztBQUNBdUIsVUFBTSxDQUFDcU8sZ0JBQVAsQ0FBd0IsWUFBWTtBQUNsQyxVQUFJLENBQUU1UCxJQUFJLENBQUNxZCxVQUFMLENBQWdCdGMsR0FBaEIsQ0FBb0IrRCxFQUFwQixDQUFGLElBQTZCLENBQUU5RSxJQUFJLENBQUNnZCxNQUF4QyxFQUNFLE1BQU10YSxLQUFLLENBQUMsdURBQXVEb0MsRUFBeEQsQ0FBWDs7QUFFRixVQUFJOUUsSUFBSSxDQUFDcWQsVUFBTCxDQUFnQnRjLEdBQWhCLENBQW9CK0QsRUFBcEIsQ0FBSixFQUE2QjtBQUMzQjlFLFlBQUksQ0FBQ3NmLGdCQUFMLENBQXNCeGEsRUFBdEI7QUFDRCxPQUZELE1BRU8sSUFBSTlFLElBQUksQ0FBQ21kLGtCQUFMLENBQXdCcGMsR0FBeEIsQ0FBNEIrRCxFQUE1QixDQUFKLEVBQXFDO0FBQzFDOUUsWUFBSSxDQUFDMGYsZUFBTCxDQUFxQjVhLEVBQXJCO0FBQ0Q7QUFDRixLQVREO0FBVUQsR0E5TG9DO0FBK0xyQzZiLFlBQVUsRUFBRSxVQUFVN2IsRUFBVixFQUFjb0MsTUFBZCxFQUFzQjtBQUNoQyxRQUFJbEgsSUFBSSxHQUFHLElBQVg7O0FBQ0F1QixVQUFNLENBQUNxTyxnQkFBUCxDQUF3QixZQUFZO0FBQ2xDLFVBQUlnUixVQUFVLEdBQUcxWixNQUFNLElBQUlsSCxJQUFJLENBQUMwZCxRQUFMLENBQWNtRCxlQUFkLENBQThCM1osTUFBOUIsRUFBc0M5QyxNQUFqRTs7QUFFQSxVQUFJMGMsZUFBZSxHQUFHOWdCLElBQUksQ0FBQ3FkLFVBQUwsQ0FBZ0J0YyxHQUFoQixDQUFvQitELEVBQXBCLENBQXRCOztBQUNBLFVBQUlpYyxjQUFjLEdBQUcvZ0IsSUFBSSxDQUFDZ2QsTUFBTCxJQUFlaGQsSUFBSSxDQUFDbWQsa0JBQUwsQ0FBd0JwYyxHQUF4QixDQUE0QitELEVBQTVCLENBQXBDOztBQUNBLFVBQUlrYyxZQUFZLEdBQUdGLGVBQWUsSUFBSUMsY0FBdEM7O0FBRUEsVUFBSUgsVUFBVSxJQUFJLENBQUNJLFlBQW5CLEVBQWlDO0FBQy9CaGhCLFlBQUksQ0FBQ21nQixZQUFMLENBQWtCalosTUFBbEI7QUFDRCxPQUZELE1BRU8sSUFBSThaLFlBQVksSUFBSSxDQUFDSixVQUFyQixFQUFpQztBQUN0QzVnQixZQUFJLENBQUMwZ0IsZUFBTCxDQUFxQjViLEVBQXJCO0FBQ0QsT0FGTSxNQUVBLElBQUlrYyxZQUFZLElBQUlKLFVBQXBCLEVBQWdDO0FBQ3JDLFlBQUloQixNQUFNLEdBQUc1ZixJQUFJLENBQUNxZCxVQUFMLENBQWdCelosR0FBaEIsQ0FBb0JrQixFQUFwQixDQUFiOztBQUNBLFlBQUk4WCxVQUFVLEdBQUc1YyxJQUFJLENBQUNpZCxXQUF0Qjs7QUFDQSxZQUFJZ0UsV0FBVyxHQUFHamhCLElBQUksQ0FBQ2dkLE1BQUwsSUFBZWhkLElBQUksQ0FBQ21kLGtCQUFMLENBQXdCcGUsSUFBeEIsRUFBZixJQUNoQmlCLElBQUksQ0FBQ21kLGtCQUFMLENBQXdCdlosR0FBeEIsQ0FBNEI1RCxJQUFJLENBQUNtZCxrQkFBTCxDQUF3QnNDLFlBQXhCLEVBQTVCLENBREY7O0FBRUEsWUFBSVksV0FBSjs7QUFFQSxZQUFJUyxlQUFKLEVBQXFCO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQUlJLGdCQUFnQixHQUFHLENBQUVsaEIsSUFBSSxDQUFDZ2QsTUFBUCxJQUNyQmhkLElBQUksQ0FBQ21kLGtCQUFMLENBQXdCcGUsSUFBeEIsT0FBbUMsQ0FEZCxJQUVyQjZkLFVBQVUsQ0FBQzFWLE1BQUQsRUFBUytaLFdBQVQsQ0FBVixJQUFtQyxDQUZyQzs7QUFJQSxjQUFJQyxnQkFBSixFQUFzQjtBQUNwQmxoQixnQkFBSSxDQUFDMmYsZ0JBQUwsQ0FBc0I3YSxFQUF0QixFQUEwQjhhLE1BQTFCLEVBQWtDMVksTUFBbEM7QUFDRCxXQUZELE1BRU87QUFDTDtBQUNBbEgsZ0JBQUksQ0FBQ3NmLGdCQUFMLENBQXNCeGEsRUFBdEIsRUFGSyxDQUdMOzs7QUFDQXViLHVCQUFXLEdBQUdyZ0IsSUFBSSxDQUFDbWQsa0JBQUwsQ0FBd0J2WixHQUF4QixDQUNaNUQsSUFBSSxDQUFDbWQsa0JBQUwsQ0FBd0I4QixZQUF4QixFQURZLENBQWQ7QUFHQSxnQkFBSXdCLFFBQVEsR0FBR3pnQixJQUFJLENBQUN1ZCxtQkFBTCxJQUNSOEMsV0FBVyxJQUFJekQsVUFBVSxDQUFDMVYsTUFBRCxFQUFTbVosV0FBVCxDQUFWLElBQW1DLENBRHpEOztBQUdBLGdCQUFJSSxRQUFKLEVBQWM7QUFDWnpnQixrQkFBSSxDQUFDcWYsWUFBTCxDQUFrQnZhLEVBQWxCLEVBQXNCb0MsTUFBdEI7QUFDRCxhQUZELE1BRU87QUFDTDtBQUNBbEgsa0JBQUksQ0FBQ3VkLG1CQUFMLEdBQTJCLEtBQTNCO0FBQ0Q7QUFDRjtBQUNGLFNBakNELE1BaUNPLElBQUl3RCxjQUFKLEVBQW9CO0FBQ3pCbkIsZ0JBQU0sR0FBRzVmLElBQUksQ0FBQ21kLGtCQUFMLENBQXdCdlosR0FBeEIsQ0FBNEJrQixFQUE1QixDQUFULENBRHlCLENBRXpCO0FBQ0E7QUFDQTtBQUNBOztBQUNBOUUsY0FBSSxDQUFDbWQsa0JBQUwsQ0FBd0J0WCxNQUF4QixDQUErQmYsRUFBL0I7O0FBRUEsY0FBSXNiLFlBQVksR0FBR3BnQixJQUFJLENBQUNxZCxVQUFMLENBQWdCelosR0FBaEIsQ0FDakI1RCxJQUFJLENBQUNxZCxVQUFMLENBQWdCNEIsWUFBaEIsRUFEaUIsQ0FBbkI7O0FBRUFvQixxQkFBVyxHQUFHcmdCLElBQUksQ0FBQ21kLGtCQUFMLENBQXdCcGUsSUFBeEIsTUFDUmlCLElBQUksQ0FBQ21kLGtCQUFMLENBQXdCdlosR0FBeEIsQ0FDRTVELElBQUksQ0FBQ21kLGtCQUFMLENBQXdCOEIsWUFBeEIsRUFERixDQUROLENBVnlCLENBY3pCOztBQUNBLGNBQUlxQixTQUFTLEdBQUcxRCxVQUFVLENBQUMxVixNQUFELEVBQVNrWixZQUFULENBQVYsR0FBbUMsQ0FBbkQsQ0FmeUIsQ0FpQnpCOztBQUNBLGNBQUllLGFBQWEsR0FBSSxDQUFFYixTQUFGLElBQWV0Z0IsSUFBSSxDQUFDdWQsbUJBQXJCLElBQ2IsQ0FBQytDLFNBQUQsSUFBY0QsV0FBZCxJQUNBekQsVUFBVSxDQUFDMVYsTUFBRCxFQUFTbVosV0FBVCxDQUFWLElBQW1DLENBRjFDOztBQUlBLGNBQUlDLFNBQUosRUFBZTtBQUNidGdCLGdCQUFJLENBQUMrZSxhQUFMLENBQW1CamEsRUFBbkIsRUFBdUJvQyxNQUF2QjtBQUNELFdBRkQsTUFFTyxJQUFJaWEsYUFBSixFQUFtQjtBQUN4QjtBQUNBbmhCLGdCQUFJLENBQUNtZCxrQkFBTCxDQUF3QjVQLEdBQXhCLENBQTRCekksRUFBNUIsRUFBZ0NvQyxNQUFoQztBQUNELFdBSE0sTUFHQTtBQUNMO0FBQ0FsSCxnQkFBSSxDQUFDdWQsbUJBQUwsR0FBMkIsS0FBM0IsQ0FGSyxDQUdMO0FBQ0E7O0FBQ0EsZ0JBQUksQ0FBRXZkLElBQUksQ0FBQ21kLGtCQUFMLENBQXdCcGUsSUFBeEIsRUFBTixFQUFzQztBQUNwQ2lCLGtCQUFJLENBQUNxZSxnQkFBTDtBQUNEO0FBQ0Y7QUFDRixTQXBDTSxNQW9DQTtBQUNMLGdCQUFNLElBQUkzYixLQUFKLENBQVUsMkVBQVYsQ0FBTjtBQUNEO0FBQ0Y7QUFDRixLQTNGRDtBQTRGRCxHQTdSb0M7QUE4UnJDMGUseUJBQXVCLEVBQUUsWUFBWTtBQUNuQyxRQUFJcGhCLElBQUksR0FBRyxJQUFYOztBQUNBdUIsVUFBTSxDQUFDcU8sZ0JBQVAsQ0FBd0IsWUFBWTtBQUNsQzVQLFVBQUksQ0FBQ3lkLG9CQUFMLENBQTBCckIsS0FBSyxDQUFDRSxRQUFoQyxFQURrQyxDQUVsQztBQUNBOzs7QUFDQS9hLFlBQU0sQ0FBQzhOLEtBQVAsQ0FBYW9OLHVCQUF1QixDQUFDLFlBQVk7QUFDL0MsZUFBTyxDQUFDemMsSUFBSSxDQUFDZ1QsUUFBTixJQUFrQixDQUFDaFQsSUFBSSxDQUFDZ2UsWUFBTCxDQUFrQnVCLEtBQWxCLEVBQTFCLEVBQXFEO0FBQ25ELGNBQUl2ZixJQUFJLENBQUNzZSxNQUFMLEtBQWdCbEMsS0FBSyxDQUFDQyxRQUExQixFQUFvQztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNELFdBTmtELENBUW5EOzs7QUFDQSxjQUFJcmMsSUFBSSxDQUFDc2UsTUFBTCxLQUFnQmxDLEtBQUssQ0FBQ0UsUUFBMUIsRUFDRSxNQUFNLElBQUk1WixLQUFKLENBQVUsc0NBQXNDMUMsSUFBSSxDQUFDc2UsTUFBckQsQ0FBTjtBQUVGdGUsY0FBSSxDQUFDaWUsa0JBQUwsR0FBMEJqZSxJQUFJLENBQUNnZSxZQUEvQjtBQUNBLGNBQUlxRCxjQUFjLEdBQUcsRUFBRXJoQixJQUFJLENBQUNrZSxnQkFBNUI7QUFDQWxlLGNBQUksQ0FBQ2dlLFlBQUwsR0FBb0IsSUFBSXBaLGVBQWUsQ0FBQ29JLE1BQXBCLEVBQXBCO0FBQ0EsY0FBSXNVLE9BQU8sR0FBRyxDQUFkO0FBQ0EsY0FBSUMsR0FBRyxHQUFHLElBQUkva0IsTUFBSixFQUFWLENBaEJtRCxDQWlCbkQ7QUFDQTs7QUFDQXdELGNBQUksQ0FBQ2llLGtCQUFMLENBQXdCMVMsT0FBeEIsQ0FBZ0MsVUFBVWlILEVBQVYsRUFBYzFOLEVBQWQsRUFBa0I7QUFDaER3YyxtQkFBTzs7QUFDUHRoQixnQkFBSSxDQUFDcWEsWUFBTCxDQUFrQmpaLFdBQWxCLENBQThCZ0ksS0FBOUIsQ0FDRXBKLElBQUksQ0FBQ2lLLGtCQUFMLENBQXdCbEgsY0FEMUIsRUFDMEMrQixFQUQxQyxFQUM4QzBOLEVBRDlDLEVBRUVpSyx1QkFBdUIsQ0FBQyxVQUFVaGIsR0FBVixFQUFlTyxHQUFmLEVBQW9CO0FBQzFDLGtCQUFJO0FBQ0Ysb0JBQUlQLEdBQUosRUFBUztBQUNQRix3QkFBTSxDQUFDbVQsTUFBUCxDQUFjLHdDQUFkLEVBQ2NqVCxHQURkLEVBRE8sQ0FHUDtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0Esc0JBQUl6QixJQUFJLENBQUNzZSxNQUFMLEtBQWdCbEMsS0FBSyxDQUFDQyxRQUExQixFQUFvQztBQUNsQ3JjLHdCQUFJLENBQUNxZSxnQkFBTDtBQUNEO0FBQ0YsaUJBVkQsTUFVTyxJQUFJLENBQUNyZSxJQUFJLENBQUNnVCxRQUFOLElBQWtCaFQsSUFBSSxDQUFDc2UsTUFBTCxLQUFnQmxDLEtBQUssQ0FBQ0UsUUFBeEMsSUFDR3RjLElBQUksQ0FBQ2tlLGdCQUFMLEtBQTBCbUQsY0FEakMsRUFDaUQ7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQXJoQixzQkFBSSxDQUFDMmdCLFVBQUwsQ0FBZ0I3YixFQUFoQixFQUFvQjlDLEdBQXBCO0FBQ0Q7QUFDRixlQW5CRCxTQW1CVTtBQUNSc2YsdUJBQU8sR0FEQyxDQUVSO0FBQ0E7QUFDQTs7QUFDQSxvQkFBSUEsT0FBTyxLQUFLLENBQWhCLEVBQ0VDLEdBQUcsQ0FBQ3hMLE1BQUo7QUFDSDtBQUNGLGFBNUJzQixDQUZ6QjtBQStCRCxXQWpDRDs7QUFrQ0F3TCxhQUFHLENBQUNuZixJQUFKLEdBckRtRCxDQXNEbkQ7O0FBQ0EsY0FBSXBDLElBQUksQ0FBQ3NlLE1BQUwsS0FBZ0JsQyxLQUFLLENBQUNDLFFBQTFCLEVBQ0U7QUFDRnJjLGNBQUksQ0FBQ2llLGtCQUFMLEdBQTBCLElBQTFCO0FBQ0QsU0EzRDhDLENBNEQvQztBQUNBOzs7QUFDQSxZQUFJamUsSUFBSSxDQUFDc2UsTUFBTCxLQUFnQmxDLEtBQUssQ0FBQ0MsUUFBMUIsRUFDRXJjLElBQUksQ0FBQ3doQixTQUFMO0FBQ0gsT0FoRW1DLENBQXBDO0FBaUVELEtBckVEO0FBc0VELEdBdFdvQztBQXVXckNBLFdBQVMsRUFBRSxZQUFZO0FBQ3JCLFFBQUl4aEIsSUFBSSxHQUFHLElBQVg7O0FBQ0F1QixVQUFNLENBQUNxTyxnQkFBUCxDQUF3QixZQUFZO0FBQ2xDNVAsVUFBSSxDQUFDeWQsb0JBQUwsQ0FBMEJyQixLQUFLLENBQUNHLE1BQWhDOztBQUNBLFVBQUlrRixNQUFNLEdBQUd6aEIsSUFBSSxDQUFDb2UsZ0NBQWxCO0FBQ0FwZSxVQUFJLENBQUNvZSxnQ0FBTCxHQUF3QyxFQUF4Qzs7QUFDQXBlLFVBQUksQ0FBQ29aLFlBQUwsQ0FBa0JWLE9BQWxCLENBQTBCLFlBQVk7QUFDcENyYixTQUFDLENBQUNLLElBQUYsQ0FBTytqQixNQUFQLEVBQWUsVUFBVXZGLENBQVYsRUFBYTtBQUMxQkEsV0FBQyxDQUFDcFksU0FBRjtBQUNELFNBRkQ7QUFHRCxPQUpEO0FBS0QsS0FURDtBQVVELEdBblhvQztBQW9YckN5YSwyQkFBeUIsRUFBRSxVQUFVL0wsRUFBVixFQUFjO0FBQ3ZDLFFBQUl4UyxJQUFJLEdBQUcsSUFBWDs7QUFDQXVCLFVBQU0sQ0FBQ3FPLGdCQUFQLENBQXdCLFlBQVk7QUFDbEM1UCxVQUFJLENBQUNnZSxZQUFMLENBQWtCelEsR0FBbEIsQ0FBc0JnRixPQUFPLENBQUNDLEVBQUQsQ0FBN0IsRUFBbUNBLEVBQW5DO0FBQ0QsS0FGRDtBQUdELEdBelhvQztBQTBYckNnTSxtQ0FBaUMsRUFBRSxVQUFVaE0sRUFBVixFQUFjO0FBQy9DLFFBQUl4UyxJQUFJLEdBQUcsSUFBWDs7QUFDQXVCLFVBQU0sQ0FBQ3FPLGdCQUFQLENBQXdCLFlBQVk7QUFDbEMsVUFBSTlLLEVBQUUsR0FBR3lOLE9BQU8sQ0FBQ0MsRUFBRCxDQUFoQixDQURrQyxDQUVsQztBQUNBOztBQUNBLFVBQUl4UyxJQUFJLENBQUNzZSxNQUFMLEtBQWdCbEMsS0FBSyxDQUFDRSxRQUF0QixLQUNFdGMsSUFBSSxDQUFDaWUsa0JBQUwsSUFBMkJqZSxJQUFJLENBQUNpZSxrQkFBTCxDQUF3QmxkLEdBQXhCLENBQTRCK0QsRUFBNUIsQ0FBNUIsSUFDQTlFLElBQUksQ0FBQ2dlLFlBQUwsQ0FBa0JqZCxHQUFsQixDQUFzQitELEVBQXRCLENBRkQsQ0FBSixFQUVpQztBQUMvQjlFLFlBQUksQ0FBQ2dlLFlBQUwsQ0FBa0J6USxHQUFsQixDQUFzQnpJLEVBQXRCLEVBQTBCME4sRUFBMUI7O0FBQ0E7QUFDRDs7QUFFRCxVQUFJQSxFQUFFLENBQUNBLEVBQUgsS0FBVSxHQUFkLEVBQW1CO0FBQ2pCLFlBQUl4UyxJQUFJLENBQUNxZCxVQUFMLENBQWdCdGMsR0FBaEIsQ0FBb0IrRCxFQUFwQixLQUNDOUUsSUFBSSxDQUFDZ2QsTUFBTCxJQUFlaGQsSUFBSSxDQUFDbWQsa0JBQUwsQ0FBd0JwYyxHQUF4QixDQUE0QitELEVBQTVCLENBRHBCLEVBRUU5RSxJQUFJLENBQUMwZ0IsZUFBTCxDQUFxQjViLEVBQXJCO0FBQ0gsT0FKRCxNQUlPLElBQUkwTixFQUFFLENBQUNBLEVBQUgsS0FBVSxHQUFkLEVBQW1CO0FBQ3hCLFlBQUl4UyxJQUFJLENBQUNxZCxVQUFMLENBQWdCdGMsR0FBaEIsQ0FBb0IrRCxFQUFwQixDQUFKLEVBQ0UsTUFBTSxJQUFJcEMsS0FBSixDQUFVLG1EQUFWLENBQU47QUFDRixZQUFJMUMsSUFBSSxDQUFDbWQsa0JBQUwsSUFBMkJuZCxJQUFJLENBQUNtZCxrQkFBTCxDQUF3QnBjLEdBQXhCLENBQTRCK0QsRUFBNUIsQ0FBL0IsRUFDRSxNQUFNLElBQUlwQyxLQUFKLENBQVUsZ0RBQVYsQ0FBTixDQUpzQixDQU14QjtBQUNBOztBQUNBLFlBQUkxQyxJQUFJLENBQUMwZCxRQUFMLENBQWNtRCxlQUFkLENBQThCck8sRUFBRSxDQUFDQyxDQUFqQyxFQUFvQ3JPLE1BQXhDLEVBQ0VwRSxJQUFJLENBQUNtZ0IsWUFBTCxDQUFrQjNOLEVBQUUsQ0FBQ0MsQ0FBckI7QUFDSCxPQVZNLE1BVUEsSUFBSUQsRUFBRSxDQUFDQSxFQUFILEtBQVUsR0FBZCxFQUFtQjtBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQUlrUCxTQUFTLEdBQUcsQ0FBQ3JrQixDQUFDLENBQUMwRCxHQUFGLENBQU15UixFQUFFLENBQUNDLENBQVQsRUFBWSxNQUFaLENBQUQsSUFBd0IsQ0FBQ3BWLENBQUMsQ0FBQzBELEdBQUYsQ0FBTXlSLEVBQUUsQ0FBQ0MsQ0FBVCxFQUFZLFFBQVosQ0FBekMsQ0FMd0IsQ0FNeEI7QUFDQTtBQUNBO0FBQ0E7O0FBQ0EsWUFBSWtQLG9CQUFvQixHQUN0QixDQUFDRCxTQUFELElBQWNFLDRCQUE0QixDQUFDcFAsRUFBRSxDQUFDQyxDQUFKLENBRDVDOztBQUdBLFlBQUlxTyxlQUFlLEdBQUc5Z0IsSUFBSSxDQUFDcWQsVUFBTCxDQUFnQnRjLEdBQWhCLENBQW9CK0QsRUFBcEIsQ0FBdEI7O0FBQ0EsWUFBSWljLGNBQWMsR0FBRy9nQixJQUFJLENBQUNnZCxNQUFMLElBQWVoZCxJQUFJLENBQUNtZCxrQkFBTCxDQUF3QnBjLEdBQXhCLENBQTRCK0QsRUFBNUIsQ0FBcEM7O0FBRUEsWUFBSTRjLFNBQUosRUFBZTtBQUNiMWhCLGNBQUksQ0FBQzJnQixVQUFMLENBQWdCN2IsRUFBaEIsRUFBb0J6SCxDQUFDLENBQUNrSSxNQUFGLENBQVM7QUFBQ1IsZUFBRyxFQUFFRDtBQUFOLFdBQVQsRUFBb0IwTixFQUFFLENBQUNDLENBQXZCLENBQXBCO0FBQ0QsU0FGRCxNQUVPLElBQUksQ0FBQ3FPLGVBQWUsSUFBSUMsY0FBcEIsS0FDQVksb0JBREosRUFDMEI7QUFDL0I7QUFDQTtBQUNBLGNBQUl6YSxNQUFNLEdBQUdsSCxJQUFJLENBQUNxZCxVQUFMLENBQWdCdGMsR0FBaEIsQ0FBb0IrRCxFQUFwQixJQUNUOUUsSUFBSSxDQUFDcWQsVUFBTCxDQUFnQnpaLEdBQWhCLENBQW9Ca0IsRUFBcEIsQ0FEUyxHQUNpQjlFLElBQUksQ0FBQ21kLGtCQUFMLENBQXdCdlosR0FBeEIsQ0FBNEJrQixFQUE1QixDQUQ5QjtBQUVBb0MsZ0JBQU0sR0FBR2xJLEtBQUssQ0FBQ2pCLEtBQU4sQ0FBWW1KLE1BQVosQ0FBVDtBQUVBQSxnQkFBTSxDQUFDbkMsR0FBUCxHQUFhRCxFQUFiOztBQUNBLGNBQUk7QUFDRkYsMkJBQWUsQ0FBQ2lkLE9BQWhCLENBQXdCM2EsTUFBeEIsRUFBZ0NzTCxFQUFFLENBQUNDLENBQW5DO0FBQ0QsV0FGRCxDQUVFLE9BQU8vTixDQUFQLEVBQVU7QUFDVixnQkFBSUEsQ0FBQyxDQUFDekcsSUFBRixLQUFXLGdCQUFmLEVBQ0UsTUFBTXlHLENBQU4sQ0FGUSxDQUdWOztBQUNBMUUsZ0JBQUksQ0FBQ2dlLFlBQUwsQ0FBa0J6USxHQUFsQixDQUFzQnpJLEVBQXRCLEVBQTBCME4sRUFBMUI7O0FBQ0EsZ0JBQUl4UyxJQUFJLENBQUNzZSxNQUFMLEtBQWdCbEMsS0FBSyxDQUFDRyxNQUExQixFQUFrQztBQUNoQ3ZjLGtCQUFJLENBQUNvaEIsdUJBQUw7QUFDRDs7QUFDRDtBQUNEOztBQUNEcGhCLGNBQUksQ0FBQzJnQixVQUFMLENBQWdCN2IsRUFBaEIsRUFBb0I5RSxJQUFJLENBQUMrZCxtQkFBTCxDQUF5QjdXLE1BQXpCLENBQXBCO0FBQ0QsU0F0Qk0sTUFzQkEsSUFBSSxDQUFDeWEsb0JBQUQsSUFDQTNoQixJQUFJLENBQUMwZCxRQUFMLENBQWNvRSx1QkFBZCxDQUFzQ3RQLEVBQUUsQ0FBQ0MsQ0FBekMsQ0FEQSxJQUVDelMsSUFBSSxDQUFDa2QsT0FBTCxJQUFnQmxkLElBQUksQ0FBQ2tkLE9BQUwsQ0FBYTZFLGtCQUFiLENBQWdDdlAsRUFBRSxDQUFDQyxDQUFuQyxDQUZyQixFQUU2RDtBQUNsRXpTLGNBQUksQ0FBQ2dlLFlBQUwsQ0FBa0J6USxHQUFsQixDQUFzQnpJLEVBQXRCLEVBQTBCME4sRUFBMUI7O0FBQ0EsY0FBSXhTLElBQUksQ0FBQ3NlLE1BQUwsS0FBZ0JsQyxLQUFLLENBQUNHLE1BQTFCLEVBQ0V2YyxJQUFJLENBQUNvaEIsdUJBQUw7QUFDSDtBQUNGLE9BL0NNLE1BK0NBO0FBQ0wsY0FBTTFlLEtBQUssQ0FBQywrQkFBK0I4UCxFQUFoQyxDQUFYO0FBQ0Q7QUFDRixLQTNFRDtBQTRFRCxHQXhjb0M7QUF5Y3JDO0FBQ0FzTSxrQkFBZ0IsRUFBRSxZQUFZO0FBQzVCLFFBQUk5ZSxJQUFJLEdBQUcsSUFBWDtBQUNBLFFBQUlBLElBQUksQ0FBQ2dULFFBQVQsRUFDRSxNQUFNLElBQUl0USxLQUFKLENBQVUsa0NBQVYsQ0FBTjs7QUFFRjFDLFFBQUksQ0FBQ2dpQixTQUFMLENBQWU7QUFBQ0MsYUFBTyxFQUFFO0FBQVYsS0FBZixFQUw0QixDQUtNOzs7QUFFbEMsUUFBSWppQixJQUFJLENBQUNnVCxRQUFULEVBQ0UsT0FSMEIsQ0FRakI7QUFFWDtBQUNBOztBQUNBaFQsUUFBSSxDQUFDb1osWUFBTCxDQUFrQmQsS0FBbEI7O0FBRUF0WSxRQUFJLENBQUNraUIsYUFBTCxHQWQ0QixDQWNMOztBQUN4QixHQXpkb0M7QUEyZHJDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQUMsWUFBVSxFQUFFLFlBQVk7QUFDdEIsUUFBSW5pQixJQUFJLEdBQUcsSUFBWDs7QUFDQXVCLFVBQU0sQ0FBQ3FPLGdCQUFQLENBQXdCLFlBQVk7QUFDbEMsVUFBSTVQLElBQUksQ0FBQ2dULFFBQVQsRUFDRSxPQUZnQyxDQUlsQzs7QUFDQWhULFVBQUksQ0FBQ2dlLFlBQUwsR0FBb0IsSUFBSXBaLGVBQWUsQ0FBQ29JLE1BQXBCLEVBQXBCO0FBQ0FoTixVQUFJLENBQUNpZSxrQkFBTCxHQUEwQixJQUExQjtBQUNBLFFBQUVqZSxJQUFJLENBQUNrZSxnQkFBUCxDQVBrQyxDQU9SOztBQUMxQmxlLFVBQUksQ0FBQ3lkLG9CQUFMLENBQTBCckIsS0FBSyxDQUFDQyxRQUFoQyxFQVJrQyxDQVVsQztBQUNBOzs7QUFDQTlhLFlBQU0sQ0FBQzhOLEtBQVAsQ0FBYSxZQUFZO0FBQ3ZCclAsWUFBSSxDQUFDZ2lCLFNBQUw7O0FBQ0FoaUIsWUFBSSxDQUFDa2lCLGFBQUw7QUFDRCxPQUhEO0FBSUQsS0FoQkQ7QUFpQkQsR0E1Zm9DO0FBOGZyQztBQUNBRixXQUFTLEVBQUUsVUFBVWppQixPQUFWLEVBQW1CO0FBQzVCLFFBQUlDLElBQUksR0FBRyxJQUFYO0FBQ0FELFdBQU8sR0FBR0EsT0FBTyxJQUFJLEVBQXJCO0FBQ0EsUUFBSTJiLFVBQUosRUFBZ0IwRyxTQUFoQixDQUg0QixDQUs1Qjs7QUFDQSxXQUFPLElBQVAsRUFBYTtBQUNYO0FBQ0EsVUFBSXBpQixJQUFJLENBQUNnVCxRQUFULEVBQ0U7QUFFRjBJLGdCQUFVLEdBQUcsSUFBSTlXLGVBQWUsQ0FBQ29JLE1BQXBCLEVBQWI7QUFDQW9WLGVBQVMsR0FBRyxJQUFJeGQsZUFBZSxDQUFDb0ksTUFBcEIsRUFBWixDQU5XLENBUVg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0EsVUFBSStCLE1BQU0sR0FBRy9PLElBQUksQ0FBQ3FpQixlQUFMLENBQXFCO0FBQUVsWixhQUFLLEVBQUVuSixJQUFJLENBQUNnZCxNQUFMLEdBQWM7QUFBdkIsT0FBckIsQ0FBYjs7QUFDQSxVQUFJO0FBQ0ZqTyxjQUFNLENBQUN4RCxPQUFQLENBQWUsVUFBVXZKLEdBQVYsRUFBZXNnQixDQUFmLEVBQWtCO0FBQUc7QUFDbEMsY0FBSSxDQUFDdGlCLElBQUksQ0FBQ2dkLE1BQU4sSUFBZ0JzRixDQUFDLEdBQUd0aUIsSUFBSSxDQUFDZ2QsTUFBN0IsRUFBcUM7QUFDbkN0QixzQkFBVSxDQUFDbk8sR0FBWCxDQUFldkwsR0FBRyxDQUFDK0MsR0FBbkIsRUFBd0IvQyxHQUF4QjtBQUNELFdBRkQsTUFFTztBQUNMb2dCLHFCQUFTLENBQUM3VSxHQUFWLENBQWN2TCxHQUFHLENBQUMrQyxHQUFsQixFQUF1Qi9DLEdBQXZCO0FBQ0Q7QUFDRixTQU5EO0FBT0E7QUFDRCxPQVRELENBU0UsT0FBTzBDLENBQVAsRUFBVTtBQUNWLFlBQUkzRSxPQUFPLENBQUNraUIsT0FBUixJQUFtQixPQUFPdmQsQ0FBQyxDQUFDbVgsSUFBVCxLQUFtQixRQUExQyxFQUFvRDtBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E3YixjQUFJLENBQUNvWixZQUFMLENBQWtCWixVQUFsQixDQUE2QjlULENBQTdCOztBQUNBO0FBQ0QsU0FUUyxDQVdWO0FBQ0E7OztBQUNBbkQsY0FBTSxDQUFDbVQsTUFBUCxDQUFjLG1DQUFkLEVBQW1EaFEsQ0FBbkQ7O0FBQ0FuRCxjQUFNLENBQUN5VCxXQUFQLENBQW1CLEdBQW5CO0FBQ0Q7QUFDRjs7QUFFRCxRQUFJaFYsSUFBSSxDQUFDZ1QsUUFBVCxFQUNFOztBQUVGaFQsUUFBSSxDQUFDdWlCLGtCQUFMLENBQXdCN0csVUFBeEIsRUFBb0MwRyxTQUFwQztBQUNELEdBcGpCb0M7QUFzakJyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQS9ELGtCQUFnQixFQUFFLFlBQVk7QUFDNUIsUUFBSXJlLElBQUksR0FBRyxJQUFYOztBQUNBdUIsVUFBTSxDQUFDcU8sZ0JBQVAsQ0FBd0IsWUFBWTtBQUNsQyxVQUFJNVAsSUFBSSxDQUFDZ1QsUUFBVCxFQUNFLE9BRmdDLENBSWxDO0FBQ0E7O0FBQ0EsVUFBSWhULElBQUksQ0FBQ3NlLE1BQUwsS0FBZ0JsQyxLQUFLLENBQUNDLFFBQTFCLEVBQW9DO0FBQ2xDcmMsWUFBSSxDQUFDbWlCLFVBQUw7O0FBQ0EsY0FBTSxJQUFJM0YsZUFBSixFQUFOO0FBQ0QsT0FUaUMsQ0FXbEM7QUFDQTs7O0FBQ0F4YyxVQUFJLENBQUNtZSx5QkFBTCxHQUFpQyxJQUFqQztBQUNELEtBZEQ7QUFlRCxHQW5sQm9DO0FBcWxCckM7QUFDQStELGVBQWEsRUFBRSxZQUFZO0FBQ3pCLFFBQUlsaUIsSUFBSSxHQUFHLElBQVg7QUFFQSxRQUFJQSxJQUFJLENBQUNnVCxRQUFULEVBQ0U7O0FBQ0ZoVCxRQUFJLENBQUNxYSxZQUFMLENBQWtCbFosWUFBbEIsQ0FBK0IwVCxpQkFBL0IsR0FMeUIsQ0FLNEI7OztBQUNyRCxRQUFJN1UsSUFBSSxDQUFDZ1QsUUFBVCxFQUNFO0FBQ0YsUUFBSWhULElBQUksQ0FBQ3NlLE1BQUwsS0FBZ0JsQyxLQUFLLENBQUNDLFFBQTFCLEVBQ0UsTUFBTTNaLEtBQUssQ0FBQyx3QkFBd0IxQyxJQUFJLENBQUNzZSxNQUE5QixDQUFYOztBQUVGL2MsVUFBTSxDQUFDcU8sZ0JBQVAsQ0FBd0IsWUFBWTtBQUNsQyxVQUFJNVAsSUFBSSxDQUFDbWUseUJBQVQsRUFBb0M7QUFDbENuZSxZQUFJLENBQUNtZSx5QkFBTCxHQUFpQyxLQUFqQzs7QUFDQW5lLFlBQUksQ0FBQ21pQixVQUFMO0FBQ0QsT0FIRCxNQUdPLElBQUluaUIsSUFBSSxDQUFDZ2UsWUFBTCxDQUFrQnVCLEtBQWxCLEVBQUosRUFBK0I7QUFDcEN2ZixZQUFJLENBQUN3aEIsU0FBTDtBQUNELE9BRk0sTUFFQTtBQUNMeGhCLFlBQUksQ0FBQ29oQix1QkFBTDtBQUNEO0FBQ0YsS0FURDtBQVVELEdBM21Cb0M7QUE2bUJyQ2lCLGlCQUFlLEVBQUUsVUFBVUcsZ0JBQVYsRUFBNEI7QUFDM0MsUUFBSXhpQixJQUFJLEdBQUcsSUFBWDtBQUNBLFdBQU91QixNQUFNLENBQUNxTyxnQkFBUCxDQUF3QixZQUFZO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFJN1AsT0FBTyxHQUFHMUMsQ0FBQyxDQUFDVSxLQUFGLENBQVFpQyxJQUFJLENBQUNpSyxrQkFBTCxDQUF3QmxLLE9BQWhDLENBQWQsQ0FOeUMsQ0FRekM7QUFDQTs7O0FBQ0ExQyxPQUFDLENBQUNrSSxNQUFGLENBQVN4RixPQUFULEVBQWtCeWlCLGdCQUFsQjs7QUFFQXppQixhQUFPLENBQUMrTCxNQUFSLEdBQWlCOUwsSUFBSSxDQUFDNmQsaUJBQXRCO0FBQ0EsYUFBTzlkLE9BQU8sQ0FBQzRLLFNBQWYsQ0FieUMsQ0FjekM7O0FBQ0EsVUFBSThYLFdBQVcsR0FBRyxJQUFJeFosaUJBQUosQ0FDaEJqSixJQUFJLENBQUNpSyxrQkFBTCxDQUF3QmxILGNBRFIsRUFFaEIvQyxJQUFJLENBQUNpSyxrQkFBTCxDQUF3QjlFLFFBRlIsRUFHaEJwRixPQUhnQixDQUFsQjtBQUlBLGFBQU8sSUFBSWlKLE1BQUosQ0FBV2hKLElBQUksQ0FBQ3FhLFlBQWhCLEVBQThCb0ksV0FBOUIsQ0FBUDtBQUNELEtBcEJNLENBQVA7QUFxQkQsR0Fwb0JvQztBQXVvQnJDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0FGLG9CQUFrQixFQUFFLFVBQVU3RyxVQUFWLEVBQXNCMEcsU0FBdEIsRUFBaUM7QUFDbkQsUUFBSXBpQixJQUFJLEdBQUcsSUFBWDs7QUFDQXVCLFVBQU0sQ0FBQ3FPLGdCQUFQLENBQXdCLFlBQVk7QUFFbEM7QUFDQTtBQUNBLFVBQUk1UCxJQUFJLENBQUNnZCxNQUFULEVBQWlCO0FBQ2ZoZCxZQUFJLENBQUNtZCxrQkFBTCxDQUF3QnpHLEtBQXhCO0FBQ0QsT0FOaUMsQ0FRbEM7QUFDQTs7O0FBQ0EsVUFBSWdNLFdBQVcsR0FBRyxFQUFsQjs7QUFDQTFpQixVQUFJLENBQUNxZCxVQUFMLENBQWdCOVIsT0FBaEIsQ0FBd0IsVUFBVXZKLEdBQVYsRUFBZThDLEVBQWYsRUFBbUI7QUFDekMsWUFBSSxDQUFDNFcsVUFBVSxDQUFDM2EsR0FBWCxDQUFlK0QsRUFBZixDQUFMLEVBQ0U0ZCxXQUFXLENBQUNuVSxJQUFaLENBQWlCekosRUFBakI7QUFDSCxPQUhEOztBQUlBekgsT0FBQyxDQUFDSyxJQUFGLENBQU9nbEIsV0FBUCxFQUFvQixVQUFVNWQsRUFBVixFQUFjO0FBQ2hDOUUsWUFBSSxDQUFDc2YsZ0JBQUwsQ0FBc0J4YSxFQUF0QjtBQUNELE9BRkQsRUFma0MsQ0FtQmxDO0FBQ0E7QUFDQTs7O0FBQ0E0VyxnQkFBVSxDQUFDblEsT0FBWCxDQUFtQixVQUFVdkosR0FBVixFQUFlOEMsRUFBZixFQUFtQjtBQUNwQzlFLFlBQUksQ0FBQzJnQixVQUFMLENBQWdCN2IsRUFBaEIsRUFBb0I5QyxHQUFwQjtBQUNELE9BRkQsRUF0QmtDLENBMEJsQztBQUNBO0FBQ0E7O0FBQ0EsVUFBSWhDLElBQUksQ0FBQ3FkLFVBQUwsQ0FBZ0J0ZSxJQUFoQixPQUEyQjJjLFVBQVUsQ0FBQzNjLElBQVgsRUFBL0IsRUFBa0Q7QUFDaEQ0akIsZUFBTyxDQUFDcGIsS0FBUixDQUFjLDJEQUNaLHVEQURGLEVBRUV2SCxJQUFJLENBQUNpSyxrQkFGUDtBQUdBLGNBQU12SCxLQUFLLENBQ1QsMkRBQ0UsK0RBREYsR0FFRSwyQkFGRixHQUdFMUQsS0FBSyxDQUFDd1EsU0FBTixDQUFnQnhQLElBQUksQ0FBQ2lLLGtCQUFMLENBQXdCOUUsUUFBeEMsQ0FKTyxDQUFYO0FBS0Q7O0FBQ0RuRixVQUFJLENBQUNxZCxVQUFMLENBQWdCOVIsT0FBaEIsQ0FBd0IsVUFBVXZKLEdBQVYsRUFBZThDLEVBQWYsRUFBbUI7QUFDekMsWUFBSSxDQUFDNFcsVUFBVSxDQUFDM2EsR0FBWCxDQUFlK0QsRUFBZixDQUFMLEVBQ0UsTUFBTXBDLEtBQUssQ0FBQyxtREFBbURvQyxFQUFwRCxDQUFYO0FBQ0gsT0FIRCxFQXZDa0MsQ0E0Q2xDOzs7QUFDQXNkLGVBQVMsQ0FBQzdXLE9BQVYsQ0FBa0IsVUFBVXZKLEdBQVYsRUFBZThDLEVBQWYsRUFBbUI7QUFDbkM5RSxZQUFJLENBQUNxZixZQUFMLENBQWtCdmEsRUFBbEIsRUFBc0I5QyxHQUF0QjtBQUNELE9BRkQ7QUFJQWhDLFVBQUksQ0FBQ3VkLG1CQUFMLEdBQTJCNkUsU0FBUyxDQUFDcmpCLElBQVYsS0FBbUJpQixJQUFJLENBQUNnZCxNQUFuRDtBQUNELEtBbEREO0FBbURELEdBbnNCb0M7QUFxc0JyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQXBhLE1BQUksRUFBRSxZQUFZO0FBQ2hCLFFBQUk1QyxJQUFJLEdBQUcsSUFBWDtBQUNBLFFBQUlBLElBQUksQ0FBQ2dULFFBQVQsRUFDRTtBQUNGaFQsUUFBSSxDQUFDZ1QsUUFBTCxHQUFnQixJQUFoQjs7QUFDQTNWLEtBQUMsQ0FBQ0ssSUFBRixDQUFPc0MsSUFBSSxDQUFDd2QsWUFBWixFQUEwQixVQUFVMUYsTUFBVixFQUFrQjtBQUMxQ0EsWUFBTSxDQUFDbFYsSUFBUDtBQUNELEtBRkQsRUFMZ0IsQ0FTaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0F2RixLQUFDLENBQUNLLElBQUYsQ0FBT3NDLElBQUksQ0FBQ29lLGdDQUFaLEVBQThDLFVBQVVsQyxDQUFWLEVBQWE7QUFDekRBLE9BQUMsQ0FBQ3BZLFNBQUYsR0FEeUQsQ0FDekM7QUFDakIsS0FGRDs7QUFHQTlELFFBQUksQ0FBQ29lLGdDQUFMLEdBQXdDLElBQXhDLENBakJnQixDQW1CaEI7O0FBQ0FwZSxRQUFJLENBQUNxZCxVQUFMLEdBQWtCLElBQWxCO0FBQ0FyZCxRQUFJLENBQUNtZCxrQkFBTCxHQUEwQixJQUExQjtBQUNBbmQsUUFBSSxDQUFDZ2UsWUFBTCxHQUFvQixJQUFwQjtBQUNBaGUsUUFBSSxDQUFDaWUsa0JBQUwsR0FBMEIsSUFBMUI7QUFDQWplLFFBQUksQ0FBQzRpQixpQkFBTCxHQUF5QixJQUF6QjtBQUNBNWlCLFFBQUksQ0FBQzZpQixnQkFBTCxHQUF3QixJQUF4QjtBQUVBdmdCLFdBQU8sQ0FBQyxZQUFELENBQVAsSUFBeUJBLE9BQU8sQ0FBQyxZQUFELENBQVAsQ0FBc0IwVSxLQUF0QixDQUE0QkMsbUJBQTVCLENBQ3ZCLGdCQUR1QixFQUNMLHVCQURLLEVBQ29CLENBQUMsQ0FEckIsQ0FBekI7QUFFRCxHQXh1Qm9DO0FBMHVCckN3RyxzQkFBb0IsRUFBRSxVQUFVcUYsS0FBVixFQUFpQjtBQUNyQyxRQUFJOWlCLElBQUksR0FBRyxJQUFYOztBQUNBdUIsVUFBTSxDQUFDcU8sZ0JBQVAsQ0FBd0IsWUFBWTtBQUNsQyxVQUFJbVQsR0FBRyxHQUFHLElBQUlDLElBQUosRUFBVjs7QUFFQSxVQUFJaGpCLElBQUksQ0FBQ3NlLE1BQVQsRUFBaUI7QUFDZixZQUFJMkUsUUFBUSxHQUFHRixHQUFHLEdBQUcvaUIsSUFBSSxDQUFDa2pCLGVBQTFCO0FBQ0E1Z0IsZUFBTyxDQUFDLFlBQUQsQ0FBUCxJQUF5QkEsT0FBTyxDQUFDLFlBQUQsQ0FBUCxDQUFzQjBVLEtBQXRCLENBQTRCQyxtQkFBNUIsQ0FDdkIsZ0JBRHVCLEVBQ0wsbUJBQW1CalgsSUFBSSxDQUFDc2UsTUFBeEIsR0FBaUMsUUFENUIsRUFDc0MyRSxRQUR0QyxDQUF6QjtBQUVEOztBQUVEampCLFVBQUksQ0FBQ3NlLE1BQUwsR0FBY3dFLEtBQWQ7QUFDQTlpQixVQUFJLENBQUNrakIsZUFBTCxHQUF1QkgsR0FBdkI7QUFDRCxLQVhEO0FBWUQ7QUF4dkJvQyxDQUF2QyxFLENBMnZCQTtBQUNBO0FBQ0E7OztBQUNBdlMsa0JBQWtCLENBQUNDLGVBQW5CLEdBQXFDLFVBQVUxRyxpQkFBVixFQUE2QmtHLE9BQTdCLEVBQXNDO0FBQ3pFO0FBQ0EsTUFBSWxRLE9BQU8sR0FBR2dLLGlCQUFpQixDQUFDaEssT0FBaEMsQ0FGeUUsQ0FJekU7QUFDQTs7QUFDQSxNQUFJQSxPQUFPLENBQUNvakIsWUFBUixJQUF3QnBqQixPQUFPLENBQUNxakIsYUFBcEMsRUFDRSxPQUFPLEtBQVAsQ0FQdUUsQ0FTekU7QUFDQTtBQUNBO0FBQ0E7O0FBQ0EsTUFBSXJqQixPQUFPLENBQUM2TCxJQUFSLElBQWlCN0wsT0FBTyxDQUFDb0osS0FBUixJQUFpQixDQUFDcEosT0FBTyxDQUFDNEwsSUFBL0MsRUFBc0QsT0FBTyxLQUFQLENBYm1CLENBZXpFO0FBQ0E7O0FBQ0EsTUFBSTVMLE9BQU8sQ0FBQytMLE1BQVosRUFBb0I7QUFDbEIsUUFBSTtBQUNGbEgscUJBQWUsQ0FBQ3llLHlCQUFoQixDQUEwQ3RqQixPQUFPLENBQUMrTCxNQUFsRDtBQUNELEtBRkQsQ0FFRSxPQUFPcEgsQ0FBUCxFQUFVO0FBQ1YsVUFBSUEsQ0FBQyxDQUFDekcsSUFBRixLQUFXLGdCQUFmLEVBQWlDO0FBQy9CLGVBQU8sS0FBUDtBQUNELE9BRkQsTUFFTztBQUNMLGNBQU15RyxDQUFOO0FBQ0Q7QUFDRjtBQUNGLEdBM0J3RSxDQTZCekU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsU0FBTyxDQUFDdUwsT0FBTyxDQUFDcVQsUUFBUixFQUFELElBQXVCLENBQUNyVCxPQUFPLENBQUNzVCxXQUFSLEVBQS9CO0FBQ0QsQ0F0Q0Q7O0FBd0NBLElBQUkzQiw0QkFBNEIsR0FBRyxVQUFVNEIsUUFBVixFQUFvQjtBQUNyRCxTQUFPbm1CLENBQUMsQ0FBQytTLEdBQUYsQ0FBTW9ULFFBQU4sRUFBZ0IsVUFBVTFYLE1BQVYsRUFBa0IyWCxTQUFsQixFQUE2QjtBQUNsRCxXQUFPcG1CLENBQUMsQ0FBQytTLEdBQUYsQ0FBTXRFLE1BQU4sRUFBYyxVQUFVbk8sS0FBVixFQUFpQitsQixLQUFqQixFQUF3QjtBQUMzQyxhQUFPLENBQUMsVUFBVTdpQixJQUFWLENBQWU2aUIsS0FBZixDQUFSO0FBQ0QsS0FGTSxDQUFQO0FBR0QsR0FKTSxDQUFQO0FBS0QsQ0FORDs7QUFRQS9tQixjQUFjLENBQUM2VCxrQkFBZixHQUFvQ0Esa0JBQXBDLEM7Ozs7Ozs7Ozs7O0FDaC9CQXhULE1BQU0sQ0FBQ3NjLE1BQVAsQ0FBYztBQUFDcUssdUJBQXFCLEVBQUMsTUFBSUE7QUFBM0IsQ0FBZDtBQUNPLE1BQU1BLHFCQUFxQixHQUFHLElBQUssTUFBTUEscUJBQU4sQ0FBNEI7QUFDcEVuSyxhQUFXLEdBQUc7QUFDWixTQUFLb0ssaUJBQUwsR0FBeUJ2akIsTUFBTSxDQUFDd2pCLE1BQVAsQ0FBYyxJQUFkLENBQXpCO0FBQ0Q7O0FBRURDLE1BQUksQ0FBQzdsQixJQUFELEVBQU84bEIsSUFBUCxFQUFhO0FBQ2YsUUFBSSxDQUFFOWxCLElBQU4sRUFBWTtBQUNWLGFBQU8sSUFBSTJHLGVBQUosRUFBUDtBQUNEOztBQUVELFFBQUksQ0FBRW1mLElBQU4sRUFBWTtBQUNWLGFBQU9DLGdCQUFnQixDQUFDL2xCLElBQUQsRUFBTyxLQUFLMmxCLGlCQUFaLENBQXZCO0FBQ0Q7O0FBRUQsUUFBSSxDQUFFRyxJQUFJLENBQUNFLDJCQUFYLEVBQXdDO0FBQ3RDRixVQUFJLENBQUNFLDJCQUFMLEdBQW1DNWpCLE1BQU0sQ0FBQ3dqQixNQUFQLENBQWMsSUFBZCxDQUFuQztBQUNELEtBWGMsQ0FhZjtBQUNBOzs7QUFDQSxXQUFPRyxnQkFBZ0IsQ0FBQy9sQixJQUFELEVBQU84bEIsSUFBSSxDQUFDRSwyQkFBWixDQUF2QjtBQUNEOztBQXJCbUUsQ0FBakMsRUFBOUI7O0FBd0JQLFNBQVNELGdCQUFULENBQTBCL2xCLElBQTFCLEVBQWdDaW1CLFdBQWhDLEVBQTZDO0FBQzNDLFNBQVFqbUIsSUFBSSxJQUFJaW1CLFdBQVQsR0FDSEEsV0FBVyxDQUFDam1CLElBQUQsQ0FEUixHQUVIaW1CLFdBQVcsQ0FBQ2ptQixJQUFELENBQVgsR0FBb0IsSUFBSTJHLGVBQUosQ0FBb0IzRyxJQUFwQixDQUZ4QjtBQUdELEM7Ozs7Ozs7Ozs7O0FDN0JEdEIsY0FBYyxDQUFDd25CLHNCQUFmLEdBQXdDLFVBQ3RDQyxTQURzQyxFQUMzQnJrQixPQUQyQixFQUNsQjtBQUNwQixNQUFJQyxJQUFJLEdBQUcsSUFBWDtBQUNBQSxNQUFJLENBQUM4SixLQUFMLEdBQWEsSUFBSWpLLGVBQUosQ0FBb0J1a0IsU0FBcEIsRUFBK0Jya0IsT0FBL0IsQ0FBYjtBQUNELENBSkQ7O0FBTUExQyxDQUFDLENBQUNrSSxNQUFGLENBQVM1SSxjQUFjLENBQUN3bkIsc0JBQWYsQ0FBc0NybUIsU0FBL0MsRUFBMEQ7QUFDeERnbUIsTUFBSSxFQUFFLFVBQVU3bEIsSUFBVixFQUFnQjtBQUNwQixRQUFJK0IsSUFBSSxHQUFHLElBQVg7QUFDQSxRQUFJdkMsR0FBRyxHQUFHLEVBQVY7O0FBQ0FKLEtBQUMsQ0FBQ0ssSUFBRixDQUNFLENBQUMsTUFBRCxFQUFTLFNBQVQsRUFBb0IsUUFBcEIsRUFBOEIsUUFBOUIsRUFBd0MsUUFBeEMsRUFDQyxRQURELEVBQ1csY0FEWCxFQUMyQixZQUQzQixFQUN5Qyx5QkFEekMsRUFFQyxnQkFGRCxFQUVtQixlQUZuQixDQURGLEVBSUUsVUFBVTJtQixDQUFWLEVBQWE7QUFDWDVtQixTQUFHLENBQUM0bUIsQ0FBRCxDQUFILEdBQVNobkIsQ0FBQyxDQUFDRyxJQUFGLENBQU93QyxJQUFJLENBQUM4SixLQUFMLENBQVd1YSxDQUFYLENBQVAsRUFBc0Jya0IsSUFBSSxDQUFDOEosS0FBM0IsRUFBa0M3TCxJQUFsQyxDQUFUO0FBQ0QsS0FOSDs7QUFPQSxXQUFPUixHQUFQO0FBQ0Q7QUFadUQsQ0FBMUQsRSxDQWdCQTtBQUNBO0FBQ0E7OztBQUNBZCxjQUFjLENBQUMybkIsNkJBQWYsR0FBK0NqbkIsQ0FBQyxDQUFDa25CLElBQUYsQ0FBTyxZQUFZO0FBQ2hFLE1BQUlDLGlCQUFpQixHQUFHLEVBQXhCO0FBRUEsTUFBSUMsUUFBUSxHQUFHMVMsT0FBTyxDQUFDQyxHQUFSLENBQVkwUyxTQUEzQjs7QUFFQSxNQUFJM1MsT0FBTyxDQUFDQyxHQUFSLENBQVkyUyxlQUFoQixFQUFpQztBQUMvQkgscUJBQWlCLENBQUNuaUIsUUFBbEIsR0FBNkIwUCxPQUFPLENBQUNDLEdBQVIsQ0FBWTJTLGVBQXpDO0FBQ0Q7O0FBRUQsTUFBSSxDQUFFRixRQUFOLEVBQ0UsTUFBTSxJQUFJL2hCLEtBQUosQ0FBVSxzQ0FBVixDQUFOO0FBRUYsU0FBTyxJQUFJL0YsY0FBYyxDQUFDd25CLHNCQUFuQixDQUEwQ00sUUFBMUMsRUFBb0RELGlCQUFwRCxDQUFQO0FBQ0QsQ0FiOEMsQ0FBL0MsQzs7Ozs7Ozs7Ozs7O0FDekJBLE1BQUlJLGFBQUo7O0FBQWtCem9CLFNBQU8sQ0FBQ0MsSUFBUixDQUFhLHNDQUFiLEVBQW9EO0FBQUN5b0IsV0FBTyxDQUFDeG9CLENBQUQsRUFBRztBQUFDdW9CLG1CQUFhLEdBQUN2b0IsQ0FBZDtBQUFnQjs7QUFBNUIsR0FBcEQsRUFBa0YsQ0FBbEY7QUFBbEI7QUFDQTs7QUFFQTs7OztBQUlBcUMsT0FBSyxHQUFHLEVBQVI7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBQSxPQUFLLENBQUNrTCxVQUFOLEdBQW1CLFNBQVNBLFVBQVQsQ0FBb0IzTCxJQUFwQixFQUEwQjhCLE9BQTFCLEVBQW1DO0FBQ3BELFFBQUksQ0FBQzlCLElBQUQsSUFBVUEsSUFBSSxLQUFLLElBQXZCLEVBQThCO0FBQzVCc0QsWUFBTSxDQUFDbVQsTUFBUCxDQUFjLDREQUNBLHlEQURBLEdBRUEsZ0RBRmQ7O0FBR0F6VyxVQUFJLEdBQUcsSUFBUDtBQUNEOztBQUVELFFBQUlBLElBQUksS0FBSyxJQUFULElBQWlCLE9BQU9BLElBQVAsS0FBZ0IsUUFBckMsRUFBK0M7QUFDN0MsWUFBTSxJQUFJeUUsS0FBSixDQUNKLGlFQURJLENBQU47QUFFRDs7QUFFRCxRQUFJM0MsT0FBTyxJQUFJQSxPQUFPLENBQUNvTCxPQUF2QixFQUFnQztBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBcEwsYUFBTyxHQUFHO0FBQUMra0Isa0JBQVUsRUFBRS9rQjtBQUFiLE9BQVY7QUFDRCxLQW5CbUQsQ0FvQnBEOzs7QUFDQSxRQUFJQSxPQUFPLElBQUlBLE9BQU8sQ0FBQ2dsQixPQUFuQixJQUE4QixDQUFDaGxCLE9BQU8sQ0FBQytrQixVQUEzQyxFQUF1RDtBQUNyRC9rQixhQUFPLENBQUMra0IsVUFBUixHQUFxQi9rQixPQUFPLENBQUNnbEIsT0FBN0I7QUFDRDs7QUFFRGhsQixXQUFPO0FBQ0wra0IsZ0JBQVUsRUFBRTVsQixTQURQO0FBRUw4bEIsa0JBQVksRUFBRSxRQUZUO0FBR0xyYSxlQUFTLEVBQUUsSUFITjtBQUlMc2EsYUFBTyxFQUFFL2xCLFNBSko7QUFLTGdtQix5QkFBbUIsRUFBRTtBQUxoQixPQU1BbmxCLE9BTkEsQ0FBUDs7QUFTQSxZQUFRQSxPQUFPLENBQUNpbEIsWUFBaEI7QUFDQSxXQUFLLE9BQUw7QUFDRSxhQUFLRyxVQUFMLEdBQWtCLFlBQVk7QUFDNUIsY0FBSUMsR0FBRyxHQUFHbm5CLElBQUksR0FBR29uQixHQUFHLENBQUNDLFlBQUosQ0FBaUIsaUJBQWlCcm5CLElBQWxDLENBQUgsR0FBNkNzbkIsTUFBTSxDQUFDQyxRQUFsRTtBQUNBLGlCQUFPLElBQUk5bUIsS0FBSyxDQUFDRCxRQUFWLENBQW1CMm1CLEdBQUcsQ0FBQ0ssU0FBSixDQUFjLEVBQWQsQ0FBbkIsQ0FBUDtBQUNELFNBSEQ7O0FBSUE7O0FBQ0YsV0FBSyxRQUFMO0FBQ0E7QUFDRSxhQUFLTixVQUFMLEdBQWtCLFlBQVk7QUFDNUIsY0FBSUMsR0FBRyxHQUFHbm5CLElBQUksR0FBR29uQixHQUFHLENBQUNDLFlBQUosQ0FBaUIsaUJBQWlCcm5CLElBQWxDLENBQUgsR0FBNkNzbkIsTUFBTSxDQUFDQyxRQUFsRTtBQUNBLGlCQUFPSixHQUFHLENBQUN0Z0IsRUFBSixFQUFQO0FBQ0QsU0FIRDs7QUFJQTtBQWJGOztBQWdCQSxTQUFLNkgsVUFBTCxHQUFrQi9ILGVBQWUsQ0FBQ2dJLGFBQWhCLENBQThCN00sT0FBTyxDQUFDNEssU0FBdEMsQ0FBbEI7QUFFQSxRQUFJLENBQUUxTSxJQUFGLElBQVU4QixPQUFPLENBQUMra0IsVUFBUixLQUF1QixJQUFyQyxFQUNFO0FBQ0EsV0FBS1ksV0FBTCxHQUFtQixJQUFuQixDQUZGLEtBR0ssSUFBSTNsQixPQUFPLENBQUMra0IsVUFBWixFQUNILEtBQUtZLFdBQUwsR0FBbUIzbEIsT0FBTyxDQUFDK2tCLFVBQTNCLENBREcsS0FFQSxJQUFJdmpCLE1BQU0sQ0FBQ29rQixRQUFYLEVBQ0gsS0FBS0QsV0FBTCxHQUFtQm5rQixNQUFNLENBQUN1akIsVUFBMUIsQ0FERyxLQUdILEtBQUtZLFdBQUwsR0FBbUJua0IsTUFBTSxDQUFDcWtCLE1BQTFCOztBQUVGLFFBQUksQ0FBQzdsQixPQUFPLENBQUNrbEIsT0FBYixFQUFzQjtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQUlobkIsSUFBSSxJQUFJLEtBQUt5bkIsV0FBTCxLQUFxQm5rQixNQUFNLENBQUNxa0IsTUFBcEMsSUFDQSxPQUFPanBCLGNBQVAsS0FBMEIsV0FEMUIsSUFFQUEsY0FBYyxDQUFDMm5CLDZCQUZuQixFQUVrRDtBQUNoRHZrQixlQUFPLENBQUNrbEIsT0FBUixHQUFrQnRvQixjQUFjLENBQUMybkIsNkJBQWYsRUFBbEI7QUFDRCxPQUpELE1BSU87QUFDTCxjQUFNO0FBQUVYO0FBQUYsWUFDSmpuQixPQUFPLENBQUMsOEJBQUQsQ0FEVDs7QUFFQXFELGVBQU8sQ0FBQ2tsQixPQUFSLEdBQWtCdEIscUJBQWxCO0FBQ0Q7QUFDRjs7QUFFRCxTQUFLa0MsV0FBTCxHQUFtQjlsQixPQUFPLENBQUNrbEIsT0FBUixDQUFnQm5CLElBQWhCLENBQXFCN2xCLElBQXJCLEVBQTJCLEtBQUt5bkIsV0FBaEMsQ0FBbkI7QUFDQSxTQUFLSSxLQUFMLEdBQWE3bkIsSUFBYjtBQUNBLFNBQUtnbkIsT0FBTCxHQUFlbGxCLE9BQU8sQ0FBQ2tsQixPQUF2Qjs7QUFFQSxTQUFLYyxzQkFBTCxDQUE0QjluQixJQUE1QixFQUFrQzhCLE9BQWxDLEVBbEZvRCxDQW9GcEQ7QUFDQTtBQUNBOzs7QUFDQSxRQUFJQSxPQUFPLENBQUNpbUIscUJBQVIsS0FBa0MsS0FBdEMsRUFBNkM7QUFDM0MsVUFBSTtBQUNGLGFBQUtDLHNCQUFMLENBQTRCO0FBQzFCQyxxQkFBVyxFQUFFbm1CLE9BQU8sQ0FBQ29tQixzQkFBUixLQUFtQztBQUR0QixTQUE1QjtBQUdELE9BSkQsQ0FJRSxPQUFPNWUsS0FBUCxFQUFjO0FBQ2Q7QUFDQSxZQUFJQSxLQUFLLENBQUN3VSxPQUFOLGdDQUFzQzlkLElBQXRDLGdDQUFKLEVBQ0UsTUFBTSxJQUFJeUUsS0FBSixpREFBa0R6RSxJQUFsRCxRQUFOO0FBQ0YsY0FBTXNKLEtBQU47QUFDRDtBQUNGLEtBbEdtRCxDQW9HcEQ7OztBQUNBLFFBQUlqRixPQUFPLENBQUM4akIsV0FBUixJQUNBLENBQUVybUIsT0FBTyxDQUFDbWxCLG1CQURWLElBRUEsS0FBS1EsV0FGTCxJQUdBLEtBQUtBLFdBQUwsQ0FBaUJXLE9BSHJCLEVBRzhCO0FBQzVCLFdBQUtYLFdBQUwsQ0FBaUJXLE9BQWpCLENBQXlCLElBQXpCLEVBQStCLE1BQU0sS0FBS3RkLElBQUwsRUFBckMsRUFBa0Q7QUFDaER1ZCxlQUFPLEVBQUU7QUFEdUMsT0FBbEQ7QUFHRDtBQUNGLEdBN0dEOztBQStHQWptQixRQUFNLENBQUNDLE1BQVAsQ0FBYzVCLEtBQUssQ0FBQ2tMLFVBQU4sQ0FBaUI5TCxTQUEvQixFQUEwQztBQUN4Q2lvQiwwQkFBc0IsQ0FBQzluQixJQUFELFFBRW5CO0FBQUEsVUFGMEI7QUFDM0Jrb0IsOEJBQXNCLEdBQUc7QUFERSxPQUUxQjtBQUNELFlBQU1ubUIsSUFBSSxHQUFHLElBQWI7O0FBQ0EsVUFBSSxFQUFHQSxJQUFJLENBQUMwbEIsV0FBTCxJQUNBMWxCLElBQUksQ0FBQzBsQixXQUFMLENBQWlCYSxhQURwQixDQUFKLEVBQ3dDO0FBQ3RDO0FBQ0QsT0FMQSxDQU9EO0FBQ0E7QUFDQTs7O0FBQ0EsWUFBTUMsRUFBRSxHQUFHeG1CLElBQUksQ0FBQzBsQixXQUFMLENBQWlCYSxhQUFqQixDQUErQnRvQixJQUEvQixFQUFxQztBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBd29CLG1CQUFXLENBQUNDLFNBQUQsRUFBWUMsS0FBWixFQUFtQjtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBSUQsU0FBUyxHQUFHLENBQVosSUFBaUJDLEtBQXJCLEVBQ0UzbUIsSUFBSSxDQUFDNmxCLFdBQUwsQ0FBaUJlLGNBQWpCO0FBRUYsY0FBSUQsS0FBSixFQUNFM21CLElBQUksQ0FBQzZsQixXQUFMLENBQWlCaGdCLE1BQWpCLENBQXdCLEVBQXhCO0FBQ0gsU0F0QjZDOztBQXdCOUM7QUFDQTtBQUNBOEIsY0FBTSxDQUFDa2YsR0FBRCxFQUFNO0FBQ1YsY0FBR3RsQixNQUFNLENBQUNva0IsUUFBVixFQUFtQjtBQUNqQixnQkFBSTtBQUNGLGtCQUFHLENBQUNrQixHQUFKLEVBQVE7QUFDTixzQkFBTSxJQUFJbmtCLEtBQUosQ0FBVSwyREFBMkQxQyxJQUFJLENBQUM4bEIsS0FBMUUsQ0FBTjtBQUNEO0FBQ0YsYUFKRCxDQUlFLE9BQU92ZSxLQUFQLEVBQWM7QUFDZG9iLHFCQUFPLENBQUNwYixLQUFSLENBQWNBLEtBQWQ7QUFDRDtBQUNGOztBQUNELGNBQUl1ZixPQUFPLEdBQUdDLE9BQU8sQ0FBQ0MsT0FBUixDQUFnQkgsR0FBRyxDQUFDL2hCLEVBQXBCLENBQWQ7O0FBQ0EsY0FBSTlDLEdBQUcsR0FBR2hDLElBQUksQ0FBQzZsQixXQUFMLENBQWlCM2MsT0FBakIsQ0FBeUI0ZCxPQUF6QixDQUFWLENBWFUsQ0FhVjtBQUNBO0FBQ0E7OztBQUNBLGNBQUlELEdBQUcsQ0FBQ0EsR0FBSixLQUFZLFNBQWhCLEVBQTJCO0FBQ3pCLGdCQUFJSSxPQUFPLEdBQUdKLEdBQUcsQ0FBQ0ksT0FBbEI7O0FBQ0EsZ0JBQUksQ0FBQ0EsT0FBTCxFQUFjO0FBQ1osa0JBQUlqbEIsR0FBSixFQUNFaEMsSUFBSSxDQUFDNmxCLFdBQUwsQ0FBaUJoZ0IsTUFBakIsQ0FBd0JpaEIsT0FBeEI7QUFDSCxhQUhELE1BR08sSUFBSSxDQUFDOWtCLEdBQUwsRUFBVTtBQUNmaEMsa0JBQUksQ0FBQzZsQixXQUFMLENBQWlCN2dCLE1BQWpCLENBQXdCaWlCLE9BQXhCO0FBQ0QsYUFGTSxNQUVBO0FBQ0w7QUFDQWpuQixrQkFBSSxDQUFDNmxCLFdBQUwsQ0FBaUJsZSxNQUFqQixDQUF3Qm1mLE9BQXhCLEVBQWlDRyxPQUFqQztBQUNEOztBQUNEO0FBQ0QsV0FaRCxNQVlPLElBQUlKLEdBQUcsQ0FBQ0EsR0FBSixLQUFZLE9BQWhCLEVBQXlCO0FBQzlCLGdCQUFJN2tCLEdBQUosRUFBUztBQUNQLG9CQUFNLElBQUlVLEtBQUosQ0FBVSw0REFBVixDQUFOO0FBQ0Q7O0FBQ0QxQyxnQkFBSSxDQUFDNmxCLFdBQUwsQ0FBaUI3Z0IsTUFBakI7QUFBMEJELGlCQUFHLEVBQUUraEI7QUFBL0IsZUFBMkNELEdBQUcsQ0FBQy9hLE1BQS9DO0FBQ0QsV0FMTSxNQUtBLElBQUkrYSxHQUFHLENBQUNBLEdBQUosS0FBWSxTQUFoQixFQUEyQjtBQUNoQyxnQkFBSSxDQUFDN2tCLEdBQUwsRUFDRSxNQUFNLElBQUlVLEtBQUosQ0FBVSx5REFBVixDQUFOOztBQUNGMUMsZ0JBQUksQ0FBQzZsQixXQUFMLENBQWlCaGdCLE1BQWpCLENBQXdCaWhCLE9BQXhCO0FBQ0QsV0FKTSxNQUlBLElBQUlELEdBQUcsQ0FBQ0EsR0FBSixLQUFZLFNBQWhCLEVBQTJCO0FBQ2hDLGdCQUFJLENBQUM3a0IsR0FBTCxFQUNFLE1BQU0sSUFBSVUsS0FBSixDQUFVLHVDQUFWLENBQU47QUFDRixrQkFBTW9XLElBQUksR0FBR3pZLE1BQU0sQ0FBQ3lZLElBQVAsQ0FBWStOLEdBQUcsQ0FBQy9hLE1BQWhCLENBQWI7O0FBQ0EsZ0JBQUlnTixJQUFJLENBQUMvUSxNQUFMLEdBQWMsQ0FBbEIsRUFBcUI7QUFDbkIsa0JBQUl5YixRQUFRLEdBQUcsRUFBZjtBQUNBMUssa0JBQUksQ0FBQ3ZOLE9BQUwsQ0FBYTNOLEdBQUcsSUFBSTtBQUNsQixzQkFBTUQsS0FBSyxHQUFHa3BCLEdBQUcsQ0FBQy9hLE1BQUosQ0FBV2xPLEdBQVgsQ0FBZDs7QUFDQSxvQkFBSW9CLEtBQUssQ0FBQ21nQixNQUFOLENBQWFuZCxHQUFHLENBQUNwRSxHQUFELENBQWhCLEVBQXVCRCxLQUF2QixDQUFKLEVBQW1DO0FBQ2pDO0FBQ0Q7O0FBQ0Qsb0JBQUksT0FBT0EsS0FBUCxLQUFpQixXQUFyQixFQUFrQztBQUNoQyxzQkFBSSxDQUFDNmxCLFFBQVEsQ0FBQzBELE1BQWQsRUFBc0I7QUFDcEIxRCw0QkFBUSxDQUFDMEQsTUFBVCxHQUFrQixFQUFsQjtBQUNEOztBQUNEMUQsMEJBQVEsQ0FBQzBELE1BQVQsQ0FBZ0J0cEIsR0FBaEIsSUFBdUIsQ0FBdkI7QUFDRCxpQkFMRCxNQUtPO0FBQ0wsc0JBQUksQ0FBQzRsQixRQUFRLENBQUMyRCxJQUFkLEVBQW9CO0FBQ2xCM0QsNEJBQVEsQ0FBQzJELElBQVQsR0FBZ0IsRUFBaEI7QUFDRDs7QUFDRDNELDBCQUFRLENBQUMyRCxJQUFULENBQWN2cEIsR0FBZCxJQUFxQkQsS0FBckI7QUFDRDtBQUNGLGVBaEJEOztBQWlCQSxrQkFBSTBDLE1BQU0sQ0FBQ3lZLElBQVAsQ0FBWTBLLFFBQVosRUFBc0J6YixNQUF0QixHQUErQixDQUFuQyxFQUFzQztBQUNwQy9ILG9CQUFJLENBQUM2bEIsV0FBTCxDQUFpQmxlLE1BQWpCLENBQXdCbWYsT0FBeEIsRUFBaUN0RCxRQUFqQztBQUNEO0FBQ0Y7QUFDRixXQTNCTSxNQTJCQTtBQUNMLGtCQUFNLElBQUk5Z0IsS0FBSixDQUFVLDRDQUFWLENBQU47QUFDRDtBQUNGLFNBN0Y2Qzs7QUErRjlDO0FBQ0Ewa0IsaUJBQVMsR0FBRztBQUNWcG5CLGNBQUksQ0FBQzZsQixXQUFMLENBQWlCd0IsZUFBakI7QUFDRCxTQWxHNkM7O0FBb0c5QztBQUNBO0FBQ0FDLHFCQUFhLEdBQUc7QUFDZHRuQixjQUFJLENBQUM2bEIsV0FBTCxDQUFpQnlCLGFBQWpCO0FBQ0QsU0F4RzZDOztBQXlHOUNDLHlCQUFpQixHQUFHO0FBQ2xCLGlCQUFPdm5CLElBQUksQ0FBQzZsQixXQUFMLENBQWlCMEIsaUJBQWpCLEVBQVA7QUFDRCxTQTNHNkM7O0FBNkc5QztBQUNBQyxjQUFNLENBQUMxaUIsRUFBRCxFQUFLO0FBQ1QsaUJBQU85RSxJQUFJLENBQUNrSixPQUFMLENBQWFwRSxFQUFiLENBQVA7QUFDRCxTQWhINkM7O0FBa0g5QztBQUNBMmlCLHNCQUFjLEdBQUc7QUFDZixpQkFBT3puQixJQUFQO0FBQ0Q7O0FBckg2QyxPQUFyQyxDQUFYOztBQXdIQSxVQUFJLENBQUV3bUIsRUFBTixFQUFVO0FBQ1IsY0FBTXpLLE9BQU8sbURBQTJDOWQsSUFBM0MsT0FBYjs7QUFDQSxZQUFJa29CLHNCQUFzQixLQUFLLElBQS9CLEVBQXFDO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0F4RCxpQkFBTyxDQUFDK0UsSUFBUixHQUFlL0UsT0FBTyxDQUFDK0UsSUFBUixDQUFhM0wsT0FBYixDQUFmLEdBQXVDNEcsT0FBTyxDQUFDZ0YsR0FBUixDQUFZNUwsT0FBWixDQUF2QztBQUNELFNBVEQsTUFTTztBQUNMLGdCQUFNLElBQUlyWixLQUFKLENBQVVxWixPQUFWLENBQU47QUFDRDtBQUNGO0FBQ0YsS0FwSnVDOztBQXNKeEM7QUFDQTtBQUNBO0FBRUE2TCxvQkFBZ0IsQ0FBQ2hQLElBQUQsRUFBTztBQUNyQixVQUFJQSxJQUFJLENBQUM3USxNQUFMLElBQWUsQ0FBbkIsRUFDRSxPQUFPLEVBQVAsQ0FERixLQUdFLE9BQU82USxJQUFJLENBQUMsQ0FBRCxDQUFYO0FBQ0gsS0EvSnVDOztBQWlLeENpUCxtQkFBZSxDQUFDalAsSUFBRCxFQUFPO0FBQ3BCLFVBQUk1WSxJQUFJLEdBQUcsSUFBWDs7QUFDQSxVQUFJNFksSUFBSSxDQUFDN1EsTUFBTCxHQUFjLENBQWxCLEVBQXFCO0FBQ25CLGVBQU87QUFBRTRDLG1CQUFTLEVBQUUzSyxJQUFJLENBQUMyTTtBQUFsQixTQUFQO0FBQ0QsT0FGRCxNQUVPO0FBQ0xrTixhQUFLLENBQUNqQixJQUFJLENBQUMsQ0FBRCxDQUFMLEVBQVVrUCxLQUFLLENBQUNDLFFBQU4sQ0FBZUQsS0FBSyxDQUFDRSxlQUFOLENBQXNCO0FBQ2xEbGMsZ0JBQU0sRUFBRWdjLEtBQUssQ0FBQ0MsUUFBTixDQUFlRCxLQUFLLENBQUNHLEtBQU4sQ0FBWTVuQixNQUFaLEVBQW9CbkIsU0FBcEIsQ0FBZixDQUQwQztBQUVsRHlNLGNBQUksRUFBRW1jLEtBQUssQ0FBQ0MsUUFBTixDQUFlRCxLQUFLLENBQUNHLEtBQU4sQ0FBWTVuQixNQUFaLEVBQW9CMmIsS0FBcEIsRUFBMkIxVixRQUEzQixFQUFxQ3BILFNBQXJDLENBQWYsQ0FGNEM7QUFHbERpSyxlQUFLLEVBQUUyZSxLQUFLLENBQUNDLFFBQU4sQ0FBZUQsS0FBSyxDQUFDRyxLQUFOLENBQVlDLE1BQVosRUFBb0JocEIsU0FBcEIsQ0FBZixDQUgyQztBQUlsRDBNLGNBQUksRUFBRWtjLEtBQUssQ0FBQ0MsUUFBTixDQUFlRCxLQUFLLENBQUNHLEtBQU4sQ0FBWUMsTUFBWixFQUFvQmhwQixTQUFwQixDQUFmO0FBSjRDLFNBQXRCLENBQWYsQ0FBVixDQUFMO0FBT0E7QUFDRXlMLG1CQUFTLEVBQUUzSyxJQUFJLENBQUMyTTtBQURsQixXQUVLaU0sSUFBSSxDQUFDLENBQUQsQ0FGVDtBQUlEO0FBQ0YsS0FsTHVDOztBQW9MeEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXFCQTdQLFFBQUksR0FBVTtBQUFBLHdDQUFONlAsSUFBTTtBQUFOQSxZQUFNO0FBQUE7O0FBQ1o7QUFDQTtBQUNBO0FBQ0EsYUFBTyxLQUFLaU4sV0FBTCxDQUFpQjljLElBQWpCLENBQ0wsS0FBSzZlLGdCQUFMLENBQXNCaFAsSUFBdEIsQ0FESyxFQUVMLEtBQUtpUCxlQUFMLENBQXFCalAsSUFBckIsQ0FGSyxDQUFQO0FBSUQsS0FqTnVDOztBQW1OeEM7Ozs7Ozs7Ozs7Ozs7OztBQWVBMVAsV0FBTyxHQUFVO0FBQUEseUNBQU4wUCxJQUFNO0FBQU5BLFlBQU07QUFBQTs7QUFDZixhQUFPLEtBQUtpTixXQUFMLENBQWlCM2MsT0FBakIsQ0FDTCxLQUFLMGUsZ0JBQUwsQ0FBc0JoUCxJQUF0QixDQURLLEVBRUwsS0FBS2lQLGVBQUwsQ0FBcUJqUCxJQUFyQixDQUZLLENBQVA7QUFJRDs7QUF2T3VDLEdBQTFDO0FBME9BdlksUUFBTSxDQUFDQyxNQUFQLENBQWM1QixLQUFLLENBQUNrTCxVQUFwQixFQUFnQztBQUM5QmdCLGtCQUFjLENBQUNtRSxNQUFELEVBQVNsRSxHQUFULEVBQWM1SCxVQUFkLEVBQTBCO0FBQ3RDLFVBQUk4TSxhQUFhLEdBQUdoQixNQUFNLENBQUM3RCxjQUFQLENBQXNCO0FBQ3hDeUcsYUFBSyxFQUFFLFVBQVU3TSxFQUFWLEVBQWNnSCxNQUFkLEVBQXNCO0FBQzNCakIsYUFBRyxDQUFDOEcsS0FBSixDQUFVMU8sVUFBVixFQUFzQjZCLEVBQXRCLEVBQTBCZ0gsTUFBMUI7QUFDRCxTQUh1QztBQUl4Q2lVLGVBQU8sRUFBRSxVQUFVamIsRUFBVixFQUFjZ0gsTUFBZCxFQUFzQjtBQUM3QmpCLGFBQUcsQ0FBQ2tWLE9BQUosQ0FBWTljLFVBQVosRUFBd0I2QixFQUF4QixFQUE0QmdILE1BQTVCO0FBQ0QsU0FOdUM7QUFPeENzVCxlQUFPLEVBQUUsVUFBVXRhLEVBQVYsRUFBYztBQUNyQitGLGFBQUcsQ0FBQ3VVLE9BQUosQ0FBWW5jLFVBQVosRUFBd0I2QixFQUF4QjtBQUNEO0FBVHVDLE9BQXRCLENBQXBCLENBRHNDLENBYXRDO0FBQ0E7QUFFQTs7QUFDQStGLFNBQUcsQ0FBQ2lGLE1BQUosQ0FBVyxZQUFZO0FBQ3JCQyxxQkFBYSxDQUFDbk4sSUFBZDtBQUNELE9BRkQsRUFqQnNDLENBcUJ0Qzs7QUFDQSxhQUFPbU4sYUFBUDtBQUNELEtBeEI2Qjs7QUEwQjlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQWxHLG9CQUFnQixDQUFDMUUsUUFBRCxFQUFnQztBQUFBLFVBQXJCO0FBQUVnakI7QUFBRixPQUFxQix1RUFBSixFQUFJO0FBQzlDO0FBQ0EsVUFBSXZqQixlQUFlLENBQUN3akIsYUFBaEIsQ0FBOEJqakIsUUFBOUIsQ0FBSixFQUNFQSxRQUFRLEdBQUc7QUFBQ0osV0FBRyxFQUFFSTtBQUFOLE9BQVg7O0FBRUYsVUFBSTZXLEtBQUssQ0FBQzFlLE9BQU4sQ0FBYzZILFFBQWQsQ0FBSixFQUE2QjtBQUMzQjtBQUNBO0FBQ0EsY0FBTSxJQUFJekMsS0FBSixDQUFVLG1DQUFWLENBQU47QUFDRDs7QUFFRCxVQUFJLENBQUN5QyxRQUFELElBQWUsU0FBU0EsUUFBVixJQUF1QixDQUFDQSxRQUFRLENBQUNKLEdBQW5ELEVBQXlEO0FBQ3ZEO0FBQ0EsZUFBTztBQUFFQSxhQUFHLEVBQUVvakIsVUFBVSxJQUFJNUMsTUFBTSxDQUFDemdCLEVBQVA7QUFBckIsU0FBUDtBQUNEOztBQUVELGFBQU9LLFFBQVA7QUFDRDs7QUFoRDZCLEdBQWhDO0FBbURBOUUsUUFBTSxDQUFDQyxNQUFQLENBQWM1QixLQUFLLENBQUNrTCxVQUFOLENBQWlCOUwsU0FBL0IsRUFBMEM7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7O0FBU0FrSCxVQUFNLENBQUNoRCxHQUFELEVBQU1DLFFBQU4sRUFBZ0I7QUFDcEI7QUFDQSxVQUFJLENBQUNELEdBQUwsRUFBVTtBQUNSLGNBQU0sSUFBSVUsS0FBSixDQUFVLDZCQUFWLENBQU47QUFDRCxPQUptQixDQU1wQjs7O0FBQ0FWLFNBQUcsR0FBRzNCLE1BQU0sQ0FBQ3dqQixNQUFQLENBQ0p4akIsTUFBTSxDQUFDZ29CLGNBQVAsQ0FBc0JybUIsR0FBdEIsQ0FESSxFQUVKM0IsTUFBTSxDQUFDaW9CLHlCQUFQLENBQWlDdG1CLEdBQWpDLENBRkksQ0FBTjs7QUFLQSxVQUFJLFNBQVNBLEdBQWIsRUFBa0I7QUFDaEIsWUFBSSxDQUFFQSxHQUFHLENBQUMrQyxHQUFOLElBQ0EsRUFBRyxPQUFPL0MsR0FBRyxDQUFDK0MsR0FBWCxLQUFtQixRQUFuQixJQUNBL0MsR0FBRyxDQUFDK0MsR0FBSixZQUFtQnJHLEtBQUssQ0FBQ0QsUUFENUIsQ0FESixFQUUyQztBQUN6QyxnQkFBTSxJQUFJaUUsS0FBSixDQUNKLDBFQURJLENBQU47QUFFRDtBQUNGLE9BUEQsTUFPTztBQUNMLFlBQUk2bEIsVUFBVSxHQUFHLElBQWpCLENBREssQ0FHTDtBQUNBO0FBQ0E7O0FBQ0EsWUFBSSxLQUFLQyxtQkFBTCxFQUFKLEVBQWdDO0FBQzlCLGdCQUFNQyxTQUFTLEdBQUdwRCxHQUFHLENBQUNxRCx3QkFBSixDQUE2QjlrQixHQUE3QixFQUFsQjs7QUFDQSxjQUFJLENBQUM2a0IsU0FBTCxFQUFnQjtBQUNkRixzQkFBVSxHQUFHLEtBQWI7QUFDRDtBQUNGOztBQUVELFlBQUlBLFVBQUosRUFBZ0I7QUFDZHZtQixhQUFHLENBQUMrQyxHQUFKLEdBQVUsS0FBS29nQixVQUFMLEVBQVY7QUFDRDtBQUNGLE9BbkNtQixDQXFDcEI7QUFDQTs7O0FBQ0EsVUFBSXdELHFDQUFxQyxHQUFHLFVBQVV2a0IsTUFBVixFQUFrQjtBQUM1RCxZQUFJcEMsR0FBRyxDQUFDK0MsR0FBUixFQUFhO0FBQ1gsaUJBQU8vQyxHQUFHLENBQUMrQyxHQUFYO0FBQ0QsU0FIMkQsQ0FLNUQ7QUFDQTtBQUNBOzs7QUFDQS9DLFdBQUcsQ0FBQytDLEdBQUosR0FBVVgsTUFBVjtBQUVBLGVBQU9BLE1BQVA7QUFDRCxPQVhEOztBQWFBLFlBQU1xQixlQUFlLEdBQUdtakIsWUFBWSxDQUNsQzNtQixRQURrQyxFQUN4QjBtQixxQ0FEd0IsQ0FBcEM7O0FBR0EsVUFBSSxLQUFLSCxtQkFBTCxFQUFKLEVBQWdDO0FBQzlCLGNBQU1wa0IsTUFBTSxHQUFHLEtBQUt5a0Isa0JBQUwsQ0FBd0IsUUFBeEIsRUFBa0MsQ0FBQzdtQixHQUFELENBQWxDLEVBQXlDeUQsZUFBekMsQ0FBZjs7QUFDQSxlQUFPa2pCLHFDQUFxQyxDQUFDdmtCLE1BQUQsQ0FBNUM7QUFDRCxPQTFEbUIsQ0E0RHBCO0FBQ0E7OztBQUNBLFVBQUk7QUFDRjtBQUNBO0FBQ0E7QUFDQSxjQUFNQSxNQUFNLEdBQUcsS0FBS3loQixXQUFMLENBQWlCN2dCLE1BQWpCLENBQXdCaEQsR0FBeEIsRUFBNkJ5RCxlQUE3QixDQUFmOztBQUNBLGVBQU9rakIscUNBQXFDLENBQUN2a0IsTUFBRCxDQUE1QztBQUNELE9BTkQsQ0FNRSxPQUFPTSxDQUFQLEVBQVU7QUFDVixZQUFJekMsUUFBSixFQUFjO0FBQ1pBLGtCQUFRLENBQUN5QyxDQUFELENBQVI7QUFDQSxpQkFBTyxJQUFQO0FBQ0Q7O0FBQ0QsY0FBTUEsQ0FBTjtBQUNEO0FBQ0YsS0FuSHVDOztBQXFIeEM7Ozs7Ozs7Ozs7Ozs7QUFhQWlELFVBQU0sQ0FBQ3hDLFFBQUQsRUFBV3FlLFFBQVgsRUFBNEM7QUFBQSx5Q0FBcEJzRixrQkFBb0I7QUFBcEJBLDBCQUFvQjtBQUFBOztBQUNoRCxZQUFNN21CLFFBQVEsR0FBRzhtQixtQkFBbUIsQ0FBQ0Qsa0JBQUQsQ0FBcEMsQ0FEZ0QsQ0FHaEQ7QUFDQTs7QUFDQSxZQUFNL29CLE9BQU8scUJBQVMrb0Isa0JBQWtCLENBQUMsQ0FBRCxDQUFsQixJQUF5QixJQUFsQyxDQUFiOztBQUNBLFVBQUkxaEIsVUFBSjs7QUFDQSxVQUFJckgsT0FBTyxJQUFJQSxPQUFPLENBQUMwRyxNQUF2QixFQUErQjtBQUM3QjtBQUNBLFlBQUkxRyxPQUFPLENBQUNxSCxVQUFaLEVBQXdCO0FBQ3RCLGNBQUksRUFBRSxPQUFPckgsT0FBTyxDQUFDcUgsVUFBZixLQUE4QixRQUE5QixJQUEwQ3JILE9BQU8sQ0FBQ3FILFVBQVIsWUFBOEIxSSxLQUFLLENBQUNELFFBQWhGLENBQUosRUFDRSxNQUFNLElBQUlpRSxLQUFKLENBQVUsdUNBQVYsQ0FBTjtBQUNGMEUsb0JBQVUsR0FBR3JILE9BQU8sQ0FBQ3FILFVBQXJCO0FBQ0QsU0FKRCxNQUlPLElBQUksQ0FBQ2pDLFFBQUQsSUFBYSxDQUFDQSxRQUFRLENBQUNKLEdBQTNCLEVBQWdDO0FBQ3JDcUMsb0JBQVUsR0FBRyxLQUFLK2QsVUFBTCxFQUFiO0FBQ0FwbEIsaUJBQU8sQ0FBQ3NILFdBQVIsR0FBc0IsSUFBdEI7QUFDQXRILGlCQUFPLENBQUNxSCxVQUFSLEdBQXFCQSxVQUFyQjtBQUNEO0FBQ0Y7O0FBRURqQyxjQUFRLEdBQ056RyxLQUFLLENBQUNrTCxVQUFOLENBQWlCQyxnQkFBakIsQ0FBa0MxRSxRQUFsQyxFQUE0QztBQUFFZ2pCLGtCQUFVLEVBQUUvZ0I7QUFBZCxPQUE1QyxDQURGO0FBR0EsWUFBTTNCLGVBQWUsR0FBR21qQixZQUFZLENBQUMzbUIsUUFBRCxDQUFwQzs7QUFFQSxVQUFJLEtBQUt1bUIsbUJBQUwsRUFBSixFQUFnQztBQUM5QixjQUFNNVAsSUFBSSxHQUFHLENBQ1h6VCxRQURXLEVBRVhxZSxRQUZXLEVBR1h6akIsT0FIVyxDQUFiO0FBTUEsZUFBTyxLQUFLOG9CLGtCQUFMLENBQXdCLFFBQXhCLEVBQWtDalEsSUFBbEMsRUFBd0NuVCxlQUF4QyxDQUFQO0FBQ0QsT0FqQytDLENBbUNoRDtBQUNBOzs7QUFDQSxVQUFJO0FBQ0Y7QUFDQTtBQUNBO0FBQ0EsZUFBTyxLQUFLb2dCLFdBQUwsQ0FBaUJsZSxNQUFqQixDQUNMeEMsUUFESyxFQUNLcWUsUUFETCxFQUNlempCLE9BRGYsRUFDd0IwRixlQUR4QixDQUFQO0FBRUQsT0FORCxDQU1FLE9BQU9mLENBQVAsRUFBVTtBQUNWLFlBQUl6QyxRQUFKLEVBQWM7QUFDWkEsa0JBQVEsQ0FBQ3lDLENBQUQsQ0FBUjtBQUNBLGlCQUFPLElBQVA7QUFDRDs7QUFDRCxjQUFNQSxDQUFOO0FBQ0Q7QUFDRixLQXBMdUM7O0FBc0x4Qzs7Ozs7Ozs7O0FBU0FtQixVQUFNLENBQUNWLFFBQUQsRUFBV2xELFFBQVgsRUFBcUI7QUFDekJrRCxjQUFRLEdBQUd6RyxLQUFLLENBQUNrTCxVQUFOLENBQWlCQyxnQkFBakIsQ0FBa0MxRSxRQUFsQyxDQUFYO0FBRUEsWUFBTU0sZUFBZSxHQUFHbWpCLFlBQVksQ0FBQzNtQixRQUFELENBQXBDOztBQUVBLFVBQUksS0FBS3VtQixtQkFBTCxFQUFKLEVBQWdDO0FBQzlCLGVBQU8sS0FBS0ssa0JBQUwsQ0FBd0IsUUFBeEIsRUFBa0MsQ0FBQzFqQixRQUFELENBQWxDLEVBQThDTSxlQUE5QyxDQUFQO0FBQ0QsT0FQd0IsQ0FTekI7QUFDQTs7O0FBQ0EsVUFBSTtBQUNGO0FBQ0E7QUFDQTtBQUNBLGVBQU8sS0FBS29nQixXQUFMLENBQWlCaGdCLE1BQWpCLENBQXdCVixRQUF4QixFQUFrQ00sZUFBbEMsQ0FBUDtBQUNELE9BTEQsQ0FLRSxPQUFPZixDQUFQLEVBQVU7QUFDVixZQUFJekMsUUFBSixFQUFjO0FBQ1pBLGtCQUFRLENBQUN5QyxDQUFELENBQVI7QUFDQSxpQkFBTyxJQUFQO0FBQ0Q7O0FBQ0QsY0FBTUEsQ0FBTjtBQUNEO0FBQ0YsS0F0TnVDOztBQXdOeEM7QUFDQTtBQUNBOGpCLHVCQUFtQixHQUFHO0FBQ3BCO0FBQ0EsYUFBTyxLQUFLOUMsV0FBTCxJQUFvQixLQUFLQSxXQUFMLEtBQXFCbmtCLE1BQU0sQ0FBQ3FrQixNQUF2RDtBQUNELEtBN051Qzs7QUErTnhDOzs7Ozs7Ozs7Ozs7QUFZQW5mLFVBQU0sQ0FBQ3RCLFFBQUQsRUFBV3FlLFFBQVgsRUFBcUJ6akIsT0FBckIsRUFBOEJrQyxRQUE5QixFQUF3QztBQUM1QyxVQUFJLENBQUVBLFFBQUYsSUFBYyxPQUFPbEMsT0FBUCxLQUFtQixVQUFyQyxFQUFpRDtBQUMvQ2tDLGdCQUFRLEdBQUdsQyxPQUFYO0FBQ0FBLGVBQU8sR0FBRyxFQUFWO0FBQ0Q7O0FBRUQsYUFBTyxLQUFLNEgsTUFBTCxDQUFZeEMsUUFBWixFQUFzQnFlLFFBQXRCLG9CQUNGempCLE9BREU7QUFFTHlILHFCQUFhLEVBQUUsSUFGVjtBQUdMZixjQUFNLEVBQUU7QUFISCxVQUlKeEUsUUFKSSxDQUFQO0FBS0QsS0F0UHVDOztBQXdQeEM7QUFDQTtBQUNBb0gsZ0JBQVksQ0FBQ0MsS0FBRCxFQUFRdkosT0FBUixFQUFpQjtBQUMzQixVQUFJQyxJQUFJLEdBQUcsSUFBWDtBQUNBLFVBQUksQ0FBQ0EsSUFBSSxDQUFDNmxCLFdBQUwsQ0FBaUJ4YyxZQUF0QixFQUNFLE1BQU0sSUFBSTNHLEtBQUosQ0FBVSxrREFBVixDQUFOOztBQUNGMUMsVUFBSSxDQUFDNmxCLFdBQUwsQ0FBaUJ4YyxZQUFqQixDQUE4QkMsS0FBOUIsRUFBcUN2SixPQUFyQztBQUNELEtBL1B1Qzs7QUFpUXhDMkosY0FBVSxDQUFDSixLQUFELEVBQVE7QUFDaEIsVUFBSXRKLElBQUksR0FBRyxJQUFYO0FBQ0EsVUFBSSxDQUFDQSxJQUFJLENBQUM2bEIsV0FBTCxDQUFpQm5jLFVBQXRCLEVBQ0UsTUFBTSxJQUFJaEgsS0FBSixDQUFVLGdEQUFWLENBQU47O0FBQ0YxQyxVQUFJLENBQUM2bEIsV0FBTCxDQUFpQm5jLFVBQWpCLENBQTRCSixLQUE1QjtBQUNELEtBdFF1Qzs7QUF3UXhDeEQsbUJBQWUsR0FBRztBQUNoQixVQUFJOUYsSUFBSSxHQUFHLElBQVg7QUFDQSxVQUFJLENBQUNBLElBQUksQ0FBQzZsQixXQUFMLENBQWlCN2YsY0FBdEIsRUFDRSxNQUFNLElBQUl0RCxLQUFKLENBQVUscURBQVYsQ0FBTjs7QUFDRjFDLFVBQUksQ0FBQzZsQixXQUFMLENBQWlCN2YsY0FBakI7QUFDRCxLQTdRdUM7O0FBK1F4QzlDLDJCQUF1QixDQUFDQyxRQUFELEVBQVdDLFlBQVgsRUFBeUI7QUFDOUMsVUFBSXBELElBQUksR0FBRyxJQUFYO0FBQ0EsVUFBSSxDQUFDQSxJQUFJLENBQUM2bEIsV0FBTCxDQUFpQjNpQix1QkFBdEIsRUFDRSxNQUFNLElBQUlSLEtBQUosQ0FBVSw2REFBVixDQUFOOztBQUNGMUMsVUFBSSxDQUFDNmxCLFdBQUwsQ0FBaUIzaUIsdUJBQWpCLENBQXlDQyxRQUF6QyxFQUFtREMsWUFBbkQ7QUFDRCxLQXBSdUM7O0FBc1J4Qzs7Ozs7O0FBTUFOLGlCQUFhLEdBQUc7QUFDZCxVQUFJOUMsSUFBSSxHQUFHLElBQVg7O0FBQ0EsVUFBSSxDQUFFQSxJQUFJLENBQUM2bEIsV0FBTCxDQUFpQi9pQixhQUF2QixFQUFzQztBQUNwQyxjQUFNLElBQUlKLEtBQUosQ0FBVSxtREFBVixDQUFOO0FBQ0Q7O0FBQ0QsYUFBTzFDLElBQUksQ0FBQzZsQixXQUFMLENBQWlCL2lCLGFBQWpCLEVBQVA7QUFDRCxLQWxTdUM7O0FBb1N4Qzs7Ozs7O0FBTUFrbUIsZUFBVyxHQUFHO0FBQ1osVUFBSWhwQixJQUFJLEdBQUcsSUFBWDs7QUFDQSxVQUFJLEVBQUdBLElBQUksQ0FBQ2lsQixPQUFMLENBQWFuYixLQUFiLElBQXNCOUosSUFBSSxDQUFDaWxCLE9BQUwsQ0FBYW5iLEtBQWIsQ0FBbUI3SSxFQUE1QyxDQUFKLEVBQXFEO0FBQ25ELGNBQU0sSUFBSXlCLEtBQUosQ0FBVSxpREFBVixDQUFOO0FBQ0Q7O0FBQ0QsYUFBTzFDLElBQUksQ0FBQ2lsQixPQUFMLENBQWFuYixLQUFiLENBQW1CN0ksRUFBMUI7QUFDRDs7QUFoVHVDLEdBQTFDLEUsQ0FtVEE7O0FBQ0EsV0FBUzJuQixZQUFULENBQXNCM21CLFFBQXRCLEVBQWdDZ25CLGFBQWhDLEVBQStDO0FBQzdDLFdBQU9obkIsUUFBUSxJQUFJLFVBQVVzRixLQUFWLEVBQWlCbkQsTUFBakIsRUFBeUI7QUFDMUMsVUFBSW1ELEtBQUosRUFBVztBQUNUdEYsZ0JBQVEsQ0FBQ3NGLEtBQUQsQ0FBUjtBQUNELE9BRkQsTUFFTyxJQUFJLE9BQU8waEIsYUFBUCxLQUF5QixVQUE3QixFQUF5QztBQUM5Q2huQixnQkFBUSxDQUFDc0YsS0FBRCxFQUFRMGhCLGFBQWEsQ0FBQzdrQixNQUFELENBQXJCLENBQVI7QUFDRCxPQUZNLE1BRUE7QUFDTG5DLGdCQUFRLENBQUNzRixLQUFELEVBQVFuRCxNQUFSLENBQVI7QUFDRDtBQUNGLEtBUkQ7QUFTRDtBQUVEOzs7Ozs7OztBQU1BMUYsT0FBSyxDQUFDRCxRQUFOLEdBQWlCc29CLE9BQU8sQ0FBQ3RvQixRQUF6QjtBQUVBOzs7Ozs7QUFLQUMsT0FBSyxDQUFDc0ssTUFBTixHQUFlcEUsZUFBZSxDQUFDb0UsTUFBL0I7QUFFQTs7OztBQUdBdEssT0FBSyxDQUFDa0wsVUFBTixDQUFpQlosTUFBakIsR0FBMEJ0SyxLQUFLLENBQUNzSyxNQUFoQztBQUVBOzs7O0FBR0F0SyxPQUFLLENBQUNrTCxVQUFOLENBQWlCbkwsUUFBakIsR0FBNEJDLEtBQUssQ0FBQ0QsUUFBbEM7QUFFQTs7OztBQUdBOEMsUUFBTSxDQUFDcUksVUFBUCxHQUFvQmxMLEtBQUssQ0FBQ2tMLFVBQTFCLEMsQ0FFQTs7QUFDQXZKLFFBQU0sQ0FBQ0MsTUFBUCxDQUNFaUIsTUFBTSxDQUFDcUksVUFBUCxDQUFrQjlMLFNBRHBCLEVBRUVvckIsU0FBUyxDQUFDQyxtQkFGWjs7QUFLQSxXQUFTSixtQkFBVCxDQUE2Qm5RLElBQTdCLEVBQW1DO0FBQ2pDO0FBQ0E7QUFDQSxRQUFJQSxJQUFJLENBQUM3USxNQUFMLEtBQ0M2USxJQUFJLENBQUNBLElBQUksQ0FBQzdRLE1BQUwsR0FBYyxDQUFmLENBQUosS0FBMEI3SSxTQUExQixJQUNBMFosSUFBSSxDQUFDQSxJQUFJLENBQUM3USxNQUFMLEdBQWMsQ0FBZixDQUFKLFlBQWlDekIsUUFGbEMsQ0FBSixFQUVpRDtBQUMvQyxhQUFPc1MsSUFBSSxDQUFDbkMsR0FBTCxFQUFQO0FBQ0Q7QUFDRjs7Ozs7Ozs7Ozs7O0FDbHhCRDs7Ozs7O0FBTUEvWCxLQUFLLENBQUMwcUIsb0JBQU4sR0FBNkIsU0FBU0Esb0JBQVQsQ0FBK0JycEIsT0FBL0IsRUFBd0M7QUFDbkU4WixPQUFLLENBQUM5WixPQUFELEVBQVVNLE1BQVYsQ0FBTDtBQUNBM0IsT0FBSyxDQUFDa0Msa0JBQU4sR0FBMkJiLE9BQTNCO0FBQ0QsQ0FIRCxDIiwiZmlsZSI6Ii9wYWNrYWdlcy9tb25nby5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogUHJvdmlkZSBhIHN5bmNocm9ub3VzIENvbGxlY3Rpb24gQVBJIHVzaW5nIGZpYmVycywgYmFja2VkIGJ5XG4gKiBNb25nb0RCLiAgVGhpcyBpcyBvbmx5IGZvciB1c2Ugb24gdGhlIHNlcnZlciwgYW5kIG1vc3RseSBpZGVudGljYWxcbiAqIHRvIHRoZSBjbGllbnQgQVBJLlxuICpcbiAqIE5PVEU6IHRoZSBwdWJsaWMgQVBJIG1ldGhvZHMgbXVzdCBiZSBydW4gd2l0aGluIGEgZmliZXIuIElmIHlvdSBjYWxsXG4gKiB0aGVzZSBvdXRzaWRlIG9mIGEgZmliZXIgdGhleSB3aWxsIGV4cGxvZGUhXG4gKi9cblxudmFyIE1vbmdvREIgPSBOcG1Nb2R1bGVNb25nb2RiO1xudmFyIEZ1dHVyZSA9IE5wbS5yZXF1aXJlKCdmaWJlcnMvZnV0dXJlJyk7XG5pbXBvcnQgeyBEb2NGZXRjaGVyIH0gZnJvbSBcIi4vZG9jX2ZldGNoZXIuanNcIjtcblxuTW9uZ29JbnRlcm5hbHMgPSB7fTtcblxuTW9uZ29JbnRlcm5hbHMuTnBtTW9kdWxlcyA9IHtcbiAgbW9uZ29kYjoge1xuICAgIHZlcnNpb246IE5wbU1vZHVsZU1vbmdvZGJWZXJzaW9uLFxuICAgIG1vZHVsZTogTW9uZ29EQlxuICB9XG59O1xuXG4vLyBPbGRlciB2ZXJzaW9uIG9mIHdoYXQgaXMgbm93IGF2YWlsYWJsZSB2aWFcbi8vIE1vbmdvSW50ZXJuYWxzLk5wbU1vZHVsZXMubW9uZ29kYi5tb2R1bGUuICBJdCB3YXMgbmV2ZXIgZG9jdW1lbnRlZCwgYnV0XG4vLyBwZW9wbGUgZG8gdXNlIGl0LlxuLy8gWFhYIENPTVBBVCBXSVRIIDEuMC4zLjJcbk1vbmdvSW50ZXJuYWxzLk5wbU1vZHVsZSA9IE1vbmdvREI7XG5cbi8vIFRoaXMgaXMgdXNlZCB0byBhZGQgb3IgcmVtb3ZlIEVKU09OIGZyb20gdGhlIGJlZ2lubmluZyBvZiBldmVyeXRoaW5nIG5lc3RlZFxuLy8gaW5zaWRlIGFuIEVKU09OIGN1c3RvbSB0eXBlLiBJdCBzaG91bGQgb25seSBiZSBjYWxsZWQgb24gcHVyZSBKU09OIVxudmFyIHJlcGxhY2VOYW1lcyA9IGZ1bmN0aW9uIChmaWx0ZXIsIHRoaW5nKSB7XG4gIGlmICh0eXBlb2YgdGhpbmcgPT09IFwib2JqZWN0XCIgJiYgdGhpbmcgIT09IG51bGwpIHtcbiAgICBpZiAoXy5pc0FycmF5KHRoaW5nKSkge1xuICAgICAgcmV0dXJuIF8ubWFwKHRoaW5nLCBfLmJpbmQocmVwbGFjZU5hbWVzLCBudWxsLCBmaWx0ZXIpKTtcbiAgICB9XG4gICAgdmFyIHJldCA9IHt9O1xuICAgIF8uZWFjaCh0aGluZywgZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcbiAgICAgIHJldFtmaWx0ZXIoa2V5KV0gPSByZXBsYWNlTmFtZXMoZmlsdGVyLCB2YWx1ZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJldDtcbiAgfVxuICByZXR1cm4gdGhpbmc7XG59O1xuXG4vLyBFbnN1cmUgdGhhdCBFSlNPTi5jbG9uZSBrZWVwcyBhIFRpbWVzdGFtcCBhcyBhIFRpbWVzdGFtcCAoaW5zdGVhZCBvZiBqdXN0XG4vLyBkb2luZyBhIHN0cnVjdHVyYWwgY2xvbmUpLlxuLy8gWFhYIGhvdyBvayBpcyB0aGlzPyB3aGF0IGlmIHRoZXJlIGFyZSBtdWx0aXBsZSBjb3BpZXMgb2YgTW9uZ29EQiBsb2FkZWQ/XG5Nb25nb0RCLlRpbWVzdGFtcC5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbiAoKSB7XG4gIC8vIFRpbWVzdGFtcHMgc2hvdWxkIGJlIGltbXV0YWJsZS5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG52YXIgbWFrZU1vbmdvTGVnYWwgPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gXCJFSlNPTlwiICsgbmFtZTsgfTtcbnZhciB1bm1ha2VNb25nb0xlZ2FsID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIG5hbWUuc3Vic3RyKDUpOyB9O1xuXG52YXIgcmVwbGFjZU1vbmdvQXRvbVdpdGhNZXRlb3IgPSBmdW5jdGlvbiAoZG9jdW1lbnQpIHtcbiAgaWYgKGRvY3VtZW50IGluc3RhbmNlb2YgTW9uZ29EQi5CaW5hcnkpIHtcbiAgICB2YXIgYnVmZmVyID0gZG9jdW1lbnQudmFsdWUodHJ1ZSk7XG4gICAgcmV0dXJuIG5ldyBVaW50OEFycmF5KGJ1ZmZlcik7XG4gIH1cbiAgaWYgKGRvY3VtZW50IGluc3RhbmNlb2YgTW9uZ29EQi5PYmplY3RJRCkge1xuICAgIHJldHVybiBuZXcgTW9uZ28uT2JqZWN0SUQoZG9jdW1lbnQudG9IZXhTdHJpbmcoKSk7XG4gIH1cbiAgaWYgKGRvY3VtZW50IGluc3RhbmNlb2YgTW9uZ29EQi5EZWNpbWFsMTI4KSB7XG4gICAgcmV0dXJuIERlY2ltYWwoZG9jdW1lbnQudG9TdHJpbmcoKSk7XG4gIH1cbiAgaWYgKGRvY3VtZW50W1wiRUpTT04kdHlwZVwiXSAmJiBkb2N1bWVudFtcIkVKU09OJHZhbHVlXCJdICYmIF8uc2l6ZShkb2N1bWVudCkgPT09IDIpIHtcbiAgICByZXR1cm4gRUpTT04uZnJvbUpTT05WYWx1ZShyZXBsYWNlTmFtZXModW5tYWtlTW9uZ29MZWdhbCwgZG9jdW1lbnQpKTtcbiAgfVxuICBpZiAoZG9jdW1lbnQgaW5zdGFuY2VvZiBNb25nb0RCLlRpbWVzdGFtcCkge1xuICAgIC8vIEZvciBub3csIHRoZSBNZXRlb3IgcmVwcmVzZW50YXRpb24gb2YgYSBNb25nbyB0aW1lc3RhbXAgdHlwZSAobm90IGEgZGF0ZSFcbiAgICAvLyB0aGlzIGlzIGEgd2VpcmQgaW50ZXJuYWwgdGhpbmcgdXNlZCBpbiB0aGUgb3Bsb2chKSBpcyB0aGUgc2FtZSBhcyB0aGVcbiAgICAvLyBNb25nbyByZXByZXNlbnRhdGlvbi4gV2UgbmVlZCB0byBkbyB0aGlzIGV4cGxpY2l0bHkgb3IgZWxzZSB3ZSB3b3VsZCBkbyBhXG4gICAgLy8gc3RydWN0dXJhbCBjbG9uZSBhbmQgbG9zZSB0aGUgcHJvdG90eXBlLlxuICAgIHJldHVybiBkb2N1bWVudDtcbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufTtcblxudmFyIHJlcGxhY2VNZXRlb3JBdG9tV2l0aE1vbmdvID0gZnVuY3Rpb24gKGRvY3VtZW50KSB7XG4gIGlmIChFSlNPTi5pc0JpbmFyeShkb2N1bWVudCkpIHtcbiAgICAvLyBUaGlzIGRvZXMgbW9yZSBjb3BpZXMgdGhhbiB3ZSdkIGxpa2UsIGJ1dCBpcyBuZWNlc3NhcnkgYmVjYXVzZVxuICAgIC8vIE1vbmdvREIuQlNPTiBvbmx5IGxvb2tzIGxpa2UgaXQgdGFrZXMgYSBVaW50OEFycmF5IChhbmQgZG9lc24ndCBhY3R1YWxseVxuICAgIC8vIHNlcmlhbGl6ZSBpdCBjb3JyZWN0bHkpLlxuICAgIC8vIHJldHVybiBuZXcgTW9uZ29EQi5CaW5hcnkoQnVmZmVyLmZyb20oZG9jdW1lbnQpKTtcbiAgfVxuICBpZiAoZG9jdW1lbnQgaW5zdGFuY2VvZiBNb25nby5PYmplY3RJRCkge1xuICAgIHJldHVybiBuZXcgTW9uZ29EQi5PYmplY3RJRChkb2N1bWVudC50b0hleFN0cmluZygpKTtcbiAgfVxuICBpZiAoZG9jdW1lbnQgaW5zdGFuY2VvZiBNb25nb0RCLlRpbWVzdGFtcCkge1xuICAgIC8vIEZvciBub3csIHRoZSBNZXRlb3IgcmVwcmVzZW50YXRpb24gb2YgYSBNb25nbyB0aW1lc3RhbXAgdHlwZSAobm90IGEgZGF0ZSFcbiAgICAvLyB0aGlzIGlzIGEgd2VpcmQgaW50ZXJuYWwgdGhpbmcgdXNlZCBpbiB0aGUgb3Bsb2chKSBpcyB0aGUgc2FtZSBhcyB0aGVcbiAgICAvLyBNb25nbyByZXByZXNlbnRhdGlvbi4gV2UgbmVlZCB0byBkbyB0aGlzIGV4cGxpY2l0bHkgb3IgZWxzZSB3ZSB3b3VsZCBkbyBhXG4gICAgLy8gc3RydWN0dXJhbCBjbG9uZSBhbmQgbG9zZSB0aGUgcHJvdG90eXBlLlxuICAgIHJldHVybiBkb2N1bWVudDtcbiAgfVxuICBpZiAoZG9jdW1lbnQgaW5zdGFuY2VvZiBEZWNpbWFsKSB7XG4gICAgcmV0dXJuIE1vbmdvREIuRGVjaW1hbDEyOC5mcm9tU3RyaW5nKGRvY3VtZW50LnRvU3RyaW5nKCkpO1xuICB9XG4gIGlmIChFSlNPTi5faXNDdXN0b21UeXBlKGRvY3VtZW50KSkge1xuICAgIHJldHVybiByZXBsYWNlTmFtZXMobWFrZU1vbmdvTGVnYWwsIEVKU09OLnRvSlNPTlZhbHVlKGRvY3VtZW50KSk7XG4gIH1cbiAgLy8gSXQgaXMgbm90IG9yZGluYXJpbHkgcG9zc2libGUgdG8gc3RpY2sgZG9sbGFyLXNpZ24ga2V5cyBpbnRvIG1vbmdvXG4gIC8vIHNvIHdlIGRvbid0IGJvdGhlciBjaGVja2luZyBmb3IgdGhpbmdzIHRoYXQgbmVlZCBlc2NhcGluZyBhdCB0aGlzIHRpbWUuXG4gIHJldHVybiB1bmRlZmluZWQ7XG59O1xuXG52YXIgcmVwbGFjZVR5cGVzID0gZnVuY3Rpb24gKGRvY3VtZW50LCBhdG9tVHJhbnNmb3JtZXIpIHtcbiAgaWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gJ29iamVjdCcgfHwgZG9jdW1lbnQgPT09IG51bGwpXG4gICAgcmV0dXJuIGRvY3VtZW50O1xuXG4gIHZhciByZXBsYWNlZFRvcExldmVsQXRvbSA9IGF0b21UcmFuc2Zvcm1lcihkb2N1bWVudCk7XG4gIGlmIChyZXBsYWNlZFRvcExldmVsQXRvbSAhPT0gdW5kZWZpbmVkKVxuICAgIHJldHVybiByZXBsYWNlZFRvcExldmVsQXRvbTtcblxuICB2YXIgcmV0ID0gZG9jdW1lbnQ7XG4gIF8uZWFjaChkb2N1bWVudCwgZnVuY3Rpb24gKHZhbCwga2V5KSB7XG4gICAgdmFyIHZhbFJlcGxhY2VkID0gcmVwbGFjZVR5cGVzKHZhbCwgYXRvbVRyYW5zZm9ybWVyKTtcbiAgICBpZiAodmFsICE9PSB2YWxSZXBsYWNlZCkge1xuICAgICAgLy8gTGF6eSBjbG9uZS4gU2hhbGxvdyBjb3B5LlxuICAgICAgaWYgKHJldCA9PT0gZG9jdW1lbnQpXG4gICAgICAgIHJldCA9IF8uY2xvbmUoZG9jdW1lbnQpO1xuICAgICAgcmV0W2tleV0gPSB2YWxSZXBsYWNlZDtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gcmV0O1xufTtcblxuXG5Nb25nb0Nvbm5lY3Rpb24gPSBmdW5jdGlvbiAodXJsLCBvcHRpb25zKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIHNlbGYuX29ic2VydmVNdWx0aXBsZXhlcnMgPSB7fTtcbiAgc2VsZi5fb25GYWlsb3Zlckhvb2sgPSBuZXcgSG9vaztcblxuICB2YXIgbW9uZ29PcHRpb25zID0gT2JqZWN0LmFzc2lnbih7XG4gICAgLy8gUmVjb25uZWN0IG9uIGVycm9yLlxuICAgIGF1dG9SZWNvbm5lY3Q6IHRydWUsXG4gICAgLy8gVHJ5IHRvIHJlY29ubmVjdCBmb3JldmVyLCBpbnN0ZWFkIG9mIHN0b3BwaW5nIGFmdGVyIDMwIHRyaWVzICh0aGVcbiAgICAvLyBkZWZhdWx0KSwgd2l0aCBlYWNoIGF0dGVtcHQgc2VwYXJhdGVkIGJ5IDEwMDBtcy5cbiAgICByZWNvbm5lY3RUcmllczogSW5maW5pdHksXG4gICAgaWdub3JlVW5kZWZpbmVkOiB0cnVlLFxuICAgIC8vIFJlcXVpcmVkIHRvIHNpbGVuY2UgZGVwcmVjYXRpb24gd2FybmluZ3Mgd2l0aCBtb25nb2RiQDMuMS4xLlxuICAgIHVzZU5ld1VybFBhcnNlcjogdHJ1ZSxcbiAgfSwgTW9uZ28uX2Nvbm5lY3Rpb25PcHRpb25zKTtcblxuICAvLyBEaXNhYmxlIHRoZSBuYXRpdmUgcGFyc2VyIGJ5IGRlZmF1bHQsIHVubGVzcyBzcGVjaWZpY2FsbHkgZW5hYmxlZFxuICAvLyBpbiB0aGUgbW9uZ28gVVJMLlxuICAvLyAtIFRoZSBuYXRpdmUgZHJpdmVyIGNhbiBjYXVzZSBlcnJvcnMgd2hpY2ggbm9ybWFsbHkgd291bGQgYmVcbiAgLy8gICB0aHJvd24sIGNhdWdodCwgYW5kIGhhbmRsZWQgaW50byBzZWdmYXVsdHMgdGhhdCB0YWtlIGRvd24gdGhlXG4gIC8vICAgd2hvbGUgYXBwLlxuICAvLyAtIEJpbmFyeSBtb2R1bGVzIGRvbid0IHlldCB3b3JrIHdoZW4geW91IGJ1bmRsZSBhbmQgbW92ZSB0aGUgYnVuZGxlXG4gIC8vICAgdG8gYSBkaWZmZXJlbnQgcGxhdGZvcm0gKGFrYSBkZXBsb3kpXG4gIC8vIFdlIHNob3VsZCByZXZpc2l0IHRoaXMgYWZ0ZXIgYmluYXJ5IG5wbSBtb2R1bGUgc3VwcG9ydCBsYW5kcy5cbiAgaWYgKCEoL1tcXD8mXW5hdGl2ZV8/W3BQXWFyc2VyPS8udGVzdCh1cmwpKSkge1xuICAgIG1vbmdvT3B0aW9ucy5uYXRpdmVfcGFyc2VyID0gZmFsc2U7XG4gIH1cblxuICAvLyBJbnRlcm5hbGx5IHRoZSBvcGxvZyBjb25uZWN0aW9ucyBzcGVjaWZ5IHRoZWlyIG93biBwb29sU2l6ZVxuICAvLyB3aGljaCB3ZSBkb24ndCB3YW50IHRvIG92ZXJ3cml0ZSB3aXRoIGFueSB1c2VyIGRlZmluZWQgdmFsdWVcbiAgaWYgKF8uaGFzKG9wdGlvbnMsICdwb29sU2l6ZScpKSB7XG4gICAgLy8gSWYgd2UganVzdCBzZXQgdGhpcyBmb3IgXCJzZXJ2ZXJcIiwgcmVwbFNldCB3aWxsIG92ZXJyaWRlIGl0LiBJZiB3ZSBqdXN0XG4gICAgLy8gc2V0IGl0IGZvciByZXBsU2V0LCBpdCB3aWxsIGJlIGlnbm9yZWQgaWYgd2UncmUgbm90IHVzaW5nIGEgcmVwbFNldC5cbiAgICBtb25nb09wdGlvbnMucG9vbFNpemUgPSBvcHRpb25zLnBvb2xTaXplO1xuICB9XG5cbiAgc2VsZi5kYiA9IG51bGw7XG4gIC8vIFdlIGtlZXAgdHJhY2sgb2YgdGhlIFJlcGxTZXQncyBwcmltYXJ5LCBzbyB0aGF0IHdlIGNhbiB0cmlnZ2VyIGhvb2tzIHdoZW5cbiAgLy8gaXQgY2hhbmdlcy4gIFRoZSBOb2RlIGRyaXZlcidzIGpvaW5lZCBjYWxsYmFjayBzZWVtcyB0byBmaXJlIHdheSB0b29cbiAgLy8gb2Z0ZW4sIHdoaWNoIGlzIHdoeSB3ZSBuZWVkIHRvIHRyYWNrIGl0IG91cnNlbHZlcy5cbiAgc2VsZi5fcHJpbWFyeSA9IG51bGw7XG4gIHNlbGYuX29wbG9nSGFuZGxlID0gbnVsbDtcbiAgc2VsZi5fZG9jRmV0Y2hlciA9IG51bGw7XG5cblxuICB2YXIgY29ubmVjdEZ1dHVyZSA9IG5ldyBGdXR1cmU7XG4gIE1vbmdvREIuY29ubmVjdChcbiAgICB1cmwsXG4gICAgbW9uZ29PcHRpb25zLFxuICAgIE1ldGVvci5iaW5kRW52aXJvbm1lbnQoXG4gICAgICBmdW5jdGlvbiAoZXJyLCBjbGllbnQpIHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBkYiA9IGNsaWVudC5kYigpO1xuXG4gICAgICAgIC8vIEZpcnN0LCBmaWd1cmUgb3V0IHdoYXQgdGhlIGN1cnJlbnQgcHJpbWFyeSBpcywgaWYgYW55LlxuICAgICAgICBpZiAoZGIuc2VydmVyQ29uZmlnLmlzTWFzdGVyRG9jKSB7XG4gICAgICAgICAgc2VsZi5fcHJpbWFyeSA9IGRiLnNlcnZlckNvbmZpZy5pc01hc3RlckRvYy5wcmltYXJ5O1xuICAgICAgICB9XG5cbiAgICAgICAgZGIuc2VydmVyQ29uZmlnLm9uKFxuICAgICAgICAgICdqb2luZWQnLCBNZXRlb3IuYmluZEVudmlyb25tZW50KGZ1bmN0aW9uIChraW5kLCBkb2MpIHtcbiAgICAgICAgICAgIGlmIChraW5kID09PSAncHJpbWFyeScpIHtcbiAgICAgICAgICAgICAgaWYgKGRvYy5wcmltYXJ5ICE9PSBzZWxmLl9wcmltYXJ5KSB7XG4gICAgICAgICAgICAgICAgc2VsZi5fcHJpbWFyeSA9IGRvYy5wcmltYXJ5O1xuICAgICAgICAgICAgICAgIHNlbGYuX29uRmFpbG92ZXJIb29rLmVhY2goZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZG9jLm1lID09PSBzZWxmLl9wcmltYXJ5KSB7XG4gICAgICAgICAgICAgIC8vIFRoZSB0aGluZyB3ZSB0aG91Z2h0IHdhcyBwcmltYXJ5IGlzIG5vdyBzb21ldGhpbmcgb3RoZXIgdGhhblxuICAgICAgICAgICAgICAvLyBwcmltYXJ5LiAgRm9yZ2V0IHRoYXQgd2UgdGhvdWdodCBpdCB3YXMgcHJpbWFyeS4gIChUaGlzIG1lYW5zXG4gICAgICAgICAgICAgIC8vIHRoYXQgaWYgYSBzZXJ2ZXIgc3RvcHMgYmVpbmcgcHJpbWFyeSBhbmQgdGhlbiBzdGFydHMgYmVpbmdcbiAgICAgICAgICAgICAgLy8gcHJpbWFyeSBhZ2FpbiB3aXRob3V0IGFub3RoZXIgc2VydmVyIGJlY29taW5nIHByaW1hcnkgaW4gdGhlXG4gICAgICAgICAgICAgIC8vIG1pZGRsZSwgd2UnbGwgY29ycmVjdGx5IGNvdW50IGl0IGFzIGEgZmFpbG92ZXIuKVxuICAgICAgICAgICAgICBzZWxmLl9wcmltYXJ5ID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KSk7XG5cbiAgICAgICAgLy8gQWxsb3cgdGhlIGNvbnN0cnVjdG9yIHRvIHJldHVybi5cbiAgICAgICAgY29ubmVjdEZ1dHVyZVsncmV0dXJuJ10oeyBjbGllbnQsIGRiIH0pO1xuICAgICAgfSxcbiAgICAgIGNvbm5lY3RGdXR1cmUucmVzb2x2ZXIoKSAgLy8gb25FeGNlcHRpb25cbiAgICApXG4gICk7XG5cbiAgLy8gV2FpdCBmb3IgdGhlIGNvbm5lY3Rpb24gdG8gYmUgc3VjY2Vzc2Z1bCAodGhyb3dzIG9uIGZhaWx1cmUpIGFuZCBhc3NpZ24gdGhlXG4gIC8vIHJlc3VsdHMgKGBjbGllbnRgIGFuZCBgZGJgKSB0byBgc2VsZmAuXG4gIE9iamVjdC5hc3NpZ24oc2VsZiwgY29ubmVjdEZ1dHVyZS53YWl0KCkpO1xuXG4gIGlmIChvcHRpb25zLm9wbG9nVXJsICYmICEgUGFja2FnZVsnZGlzYWJsZS1vcGxvZyddKSB7XG4gICAgc2VsZi5fb3Bsb2dIYW5kbGUgPSBuZXcgT3Bsb2dIYW5kbGUob3B0aW9ucy5vcGxvZ1VybCwgc2VsZi5kYi5kYXRhYmFzZU5hbWUpO1xuICAgIHNlbGYuX2RvY0ZldGNoZXIgPSBuZXcgRG9jRmV0Y2hlcihzZWxmKTtcbiAgfVxufTtcblxuTW9uZ29Db25uZWN0aW9uLnByb3RvdHlwZS5jbG9zZSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgaWYgKCEgc2VsZi5kYilcbiAgICB0aHJvdyBFcnJvcihcImNsb3NlIGNhbGxlZCBiZWZvcmUgQ29ubmVjdGlvbiBjcmVhdGVkP1wiKTtcblxuICAvLyBYWFggcHJvYmFibHkgdW50ZXN0ZWRcbiAgdmFyIG9wbG9nSGFuZGxlID0gc2VsZi5fb3Bsb2dIYW5kbGU7XG4gIHNlbGYuX29wbG9nSGFuZGxlID0gbnVsbDtcbiAgaWYgKG9wbG9nSGFuZGxlKVxuICAgIG9wbG9nSGFuZGxlLnN0b3AoKTtcblxuICAvLyBVc2UgRnV0dXJlLndyYXAgc28gdGhhdCBlcnJvcnMgZ2V0IHRocm93bi4gVGhpcyBoYXBwZW5zIHRvXG4gIC8vIHdvcmsgZXZlbiBvdXRzaWRlIGEgZmliZXIgc2luY2UgdGhlICdjbG9zZScgbWV0aG9kIGlzIG5vdFxuICAvLyBhY3R1YWxseSBhc3luY2hyb25vdXMuXG4gIEZ1dHVyZS53cmFwKF8uYmluZChzZWxmLmNsaWVudC5jbG9zZSwgc2VsZi5jbGllbnQpKSh0cnVlKS53YWl0KCk7XG59O1xuXG4vLyBSZXR1cm5zIHRoZSBNb25nbyBDb2xsZWN0aW9uIG9iamVjdDsgbWF5IHlpZWxkLlxuTW9uZ29Db25uZWN0aW9uLnByb3RvdHlwZS5yYXdDb2xsZWN0aW9uID0gZnVuY3Rpb24gKGNvbGxlY3Rpb25OYW1lKSB7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICBpZiAoISBzZWxmLmRiKVxuICAgIHRocm93IEVycm9yKFwicmF3Q29sbGVjdGlvbiBjYWxsZWQgYmVmb3JlIENvbm5lY3Rpb24gY3JlYXRlZD9cIik7XG5cbiAgdmFyIGZ1dHVyZSA9IG5ldyBGdXR1cmU7XG4gIHNlbGYuZGIuY29sbGVjdGlvbihjb2xsZWN0aW9uTmFtZSwgZnV0dXJlLnJlc29sdmVyKCkpO1xuICByZXR1cm4gZnV0dXJlLndhaXQoKTtcbn07XG5cbk1vbmdvQ29ubmVjdGlvbi5wcm90b3R5cGUuX2NyZWF0ZUNhcHBlZENvbGxlY3Rpb24gPSBmdW5jdGlvbiAoXG4gICAgY29sbGVjdGlvbk5hbWUsIGJ5dGVTaXplLCBtYXhEb2N1bWVudHMpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIGlmICghIHNlbGYuZGIpXG4gICAgdGhyb3cgRXJyb3IoXCJfY3JlYXRlQ2FwcGVkQ29sbGVjdGlvbiBjYWxsZWQgYmVmb3JlIENvbm5lY3Rpb24gY3JlYXRlZD9cIik7XG5cbiAgdmFyIGZ1dHVyZSA9IG5ldyBGdXR1cmUoKTtcbiAgc2VsZi5kYi5jcmVhdGVDb2xsZWN0aW9uKFxuICAgIGNvbGxlY3Rpb25OYW1lLFxuICAgIHsgY2FwcGVkOiB0cnVlLCBzaXplOiBieXRlU2l6ZSwgbWF4OiBtYXhEb2N1bWVudHMgfSxcbiAgICBmdXR1cmUucmVzb2x2ZXIoKSk7XG4gIGZ1dHVyZS53YWl0KCk7XG59O1xuXG4vLyBUaGlzIHNob3VsZCBiZSBjYWxsZWQgc3luY2hyb25vdXNseSB3aXRoIGEgd3JpdGUsIHRvIGNyZWF0ZSBhXG4vLyB0cmFuc2FjdGlvbiBvbiB0aGUgY3VycmVudCB3cml0ZSBmZW5jZSwgaWYgYW55LiBBZnRlciB3ZSBjYW4gcmVhZFxuLy8gdGhlIHdyaXRlLCBhbmQgYWZ0ZXIgb2JzZXJ2ZXJzIGhhdmUgYmVlbiBub3RpZmllZCAob3IgYXQgbGVhc3QsXG4vLyBhZnRlciB0aGUgb2JzZXJ2ZXIgbm90aWZpZXJzIGhhdmUgYWRkZWQgdGhlbXNlbHZlcyB0byB0aGUgd3JpdGVcbi8vIGZlbmNlKSwgeW91IHNob3VsZCBjYWxsICdjb21taXR0ZWQoKScgb24gdGhlIG9iamVjdCByZXR1cm5lZC5cbk1vbmdvQ29ubmVjdGlvbi5wcm90b3R5cGUuX21heWJlQmVnaW5Xcml0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGZlbmNlID0gRERQU2VydmVyLl9DdXJyZW50V3JpdGVGZW5jZS5nZXQoKTtcbiAgaWYgKGZlbmNlKSB7XG4gICAgcmV0dXJuIGZlbmNlLmJlZ2luV3JpdGUoKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4ge2NvbW1pdHRlZDogZnVuY3Rpb24gKCkge319O1xuICB9XG59O1xuXG4vLyBJbnRlcm5hbCBpbnRlcmZhY2U6IGFkZHMgYSBjYWxsYmFjayB3aGljaCBpcyBjYWxsZWQgd2hlbiB0aGUgTW9uZ28gcHJpbWFyeVxuLy8gY2hhbmdlcy4gUmV0dXJucyBhIHN0b3AgaGFuZGxlLlxuTW9uZ29Db25uZWN0aW9uLnByb3RvdHlwZS5fb25GYWlsb3ZlciA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICByZXR1cm4gdGhpcy5fb25GYWlsb3Zlckhvb2sucmVnaXN0ZXIoY2FsbGJhY2spO1xufTtcblxuXG4vLy8vLy8vLy8vLy8gUHVibGljIEFQSSAvLy8vLy8vLy8vXG5cbi8vIFRoZSB3cml0ZSBtZXRob2RzIGJsb2NrIHVudGlsIHRoZSBkYXRhYmFzZSBoYXMgY29uZmlybWVkIHRoZSB3cml0ZSAoaXQgbWF5XG4vLyBub3QgYmUgcmVwbGljYXRlZCBvciBzdGFibGUgb24gZGlzaywgYnV0IG9uZSBzZXJ2ZXIgaGFzIGNvbmZpcm1lZCBpdCkgaWYgbm9cbi8vIGNhbGxiYWNrIGlzIHByb3ZpZGVkLiBJZiBhIGNhbGxiYWNrIGlzIHByb3ZpZGVkLCB0aGVuIHRoZXkgY2FsbCB0aGUgY2FsbGJhY2tcbi8vIHdoZW4gdGhlIHdyaXRlIGlzIGNvbmZpcm1lZC4gVGhleSByZXR1cm4gbm90aGluZyBvbiBzdWNjZXNzLCBhbmQgcmFpc2UgYW5cbi8vIGV4Y2VwdGlvbiBvbiBmYWlsdXJlLlxuLy9cbi8vIEFmdGVyIG1ha2luZyBhIHdyaXRlICh3aXRoIGluc2VydCwgdXBkYXRlLCByZW1vdmUpLCBvYnNlcnZlcnMgYXJlXG4vLyBub3RpZmllZCBhc3luY2hyb25vdXNseS4gSWYgeW91IHdhbnQgdG8gcmVjZWl2ZSBhIGNhbGxiYWNrIG9uY2UgYWxsXG4vLyBvZiB0aGUgb2JzZXJ2ZXIgbm90aWZpY2F0aW9ucyBoYXZlIGxhbmRlZCBmb3IgeW91ciB3cml0ZSwgZG8gdGhlXG4vLyB3cml0ZXMgaW5zaWRlIGEgd3JpdGUgZmVuY2UgKHNldCBERFBTZXJ2ZXIuX0N1cnJlbnRXcml0ZUZlbmNlIHRvIGEgbmV3XG4vLyBfV3JpdGVGZW5jZSwgYW5kIHRoZW4gc2V0IGEgY2FsbGJhY2sgb24gdGhlIHdyaXRlIGZlbmNlLilcbi8vXG4vLyBTaW5jZSBvdXIgZXhlY3V0aW9uIGVudmlyb25tZW50IGlzIHNpbmdsZS10aHJlYWRlZCwgdGhpcyBpc1xuLy8gd2VsbC1kZWZpbmVkIC0tIGEgd3JpdGUgXCJoYXMgYmVlbiBtYWRlXCIgaWYgaXQncyByZXR1cm5lZCwgYW5kIGFuXG4vLyBvYnNlcnZlciBcImhhcyBiZWVuIG5vdGlmaWVkXCIgaWYgaXRzIGNhbGxiYWNrIGhhcyByZXR1cm5lZC5cblxudmFyIHdyaXRlQ2FsbGJhY2sgPSBmdW5jdGlvbiAod3JpdGUsIHJlZnJlc2gsIGNhbGxiYWNrKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoZXJyLCByZXN1bHQpIHtcbiAgICBpZiAoISBlcnIpIHtcbiAgICAgIC8vIFhYWCBXZSBkb24ndCBoYXZlIHRvIHJ1biB0aGlzIG9uIGVycm9yLCByaWdodD9cbiAgICAgIHRyeSB7XG4gICAgICAgIHJlZnJlc2goKTtcbiAgICAgIH0gY2F0Y2ggKHJlZnJlc2hFcnIpIHtcbiAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgY2FsbGJhY2socmVmcmVzaEVycik7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IHJlZnJlc2hFcnI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgd3JpdGUuY29tbWl0dGVkKCk7XG4gICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICBjYWxsYmFjayhlcnIsIHJlc3VsdCk7XG4gICAgfSBlbHNlIGlmIChlcnIpIHtcbiAgICAgIHRocm93IGVycjtcbiAgICB9XG4gIH07XG59O1xuXG52YXIgYmluZEVudmlyb25tZW50Rm9yV3JpdGUgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgcmV0dXJuIE1ldGVvci5iaW5kRW52aXJvbm1lbnQoY2FsbGJhY2ssIFwiTW9uZ28gd3JpdGVcIik7XG59O1xuXG5Nb25nb0Nvbm5lY3Rpb24ucHJvdG90eXBlLl9pbnNlcnQgPSBmdW5jdGlvbiAoY29sbGVjdGlvbl9uYW1lLCBkb2N1bWVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjaykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgdmFyIHNlbmRFcnJvciA9IGZ1bmN0aW9uIChlKSB7XG4gICAgaWYgKGNhbGxiYWNrKVxuICAgICAgcmV0dXJuIGNhbGxiYWNrKGUpO1xuICAgIHRocm93IGU7XG4gIH07XG5cbiAgaWYgKGNvbGxlY3Rpb25fbmFtZSA9PT0gXCJfX19tZXRlb3JfZmFpbHVyZV90ZXN0X2NvbGxlY3Rpb25cIikge1xuICAgIHZhciBlID0gbmV3IEVycm9yKFwiRmFpbHVyZSB0ZXN0XCIpO1xuICAgIGUuX2V4cGVjdGVkQnlUZXN0ID0gdHJ1ZTtcbiAgICBzZW5kRXJyb3IoZSk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKCEoTG9jYWxDb2xsZWN0aW9uLl9pc1BsYWluT2JqZWN0KGRvY3VtZW50KSAmJlxuICAgICAgICAhRUpTT04uX2lzQ3VzdG9tVHlwZShkb2N1bWVudCkpKSB7XG4gICAgc2VuZEVycm9yKG5ldyBFcnJvcihcbiAgICAgIFwiT25seSBwbGFpbiBvYmplY3RzIG1heSBiZSBpbnNlcnRlZCBpbnRvIE1vbmdvREJcIikpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciB3cml0ZSA9IHNlbGYuX21heWJlQmVnaW5Xcml0ZSgpO1xuICB2YXIgcmVmcmVzaCA9IGZ1bmN0aW9uICgpIHtcbiAgICBNZXRlb3IucmVmcmVzaCh7Y29sbGVjdGlvbjogY29sbGVjdGlvbl9uYW1lLCBpZDogZG9jdW1lbnQuX2lkIH0pO1xuICB9O1xuICBjYWxsYmFjayA9IGJpbmRFbnZpcm9ubWVudEZvcldyaXRlKHdyaXRlQ2FsbGJhY2sod3JpdGUsIHJlZnJlc2gsIGNhbGxiYWNrKSk7XG4gIHRyeSB7XG4gICAgdmFyIGNvbGxlY3Rpb24gPSBzZWxmLnJhd0NvbGxlY3Rpb24oY29sbGVjdGlvbl9uYW1lKTtcbiAgICBjb2xsZWN0aW9uLmluc2VydChyZXBsYWNlVHlwZXMoZG9jdW1lbnQsIHJlcGxhY2VNZXRlb3JBdG9tV2l0aE1vbmdvKSxcbiAgICAgICAgICAgICAgICAgICAgICB7c2FmZTogdHJ1ZX0sIGNhbGxiYWNrKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgd3JpdGUuY29tbWl0dGVkKCk7XG4gICAgdGhyb3cgZXJyO1xuICB9XG59O1xuXG4vLyBDYXVzZSBxdWVyaWVzIHRoYXQgbWF5IGJlIGFmZmVjdGVkIGJ5IHRoZSBzZWxlY3RvciB0byBwb2xsIGluIHRoaXMgd3JpdGVcbi8vIGZlbmNlLlxuTW9uZ29Db25uZWN0aW9uLnByb3RvdHlwZS5fcmVmcmVzaCA9IGZ1bmN0aW9uIChjb2xsZWN0aW9uTmFtZSwgc2VsZWN0b3IpIHtcbiAgdmFyIHJlZnJlc2hLZXkgPSB7Y29sbGVjdGlvbjogY29sbGVjdGlvbk5hbWV9O1xuICAvLyBJZiB3ZSBrbm93IHdoaWNoIGRvY3VtZW50cyB3ZSdyZSByZW1vdmluZywgZG9uJ3QgcG9sbCBxdWVyaWVzIHRoYXQgYXJlXG4gIC8vIHNwZWNpZmljIHRvIG90aGVyIGRvY3VtZW50cy4gKE5vdGUgdGhhdCBtdWx0aXBsZSBub3RpZmljYXRpb25zIGhlcmUgc2hvdWxkXG4gIC8vIG5vdCBjYXVzZSBtdWx0aXBsZSBwb2xscywgc2luY2UgYWxsIG91ciBsaXN0ZW5lciBpcyBkb2luZyBpcyBlbnF1ZXVlaW5nIGFcbiAgLy8gcG9sbC4pXG4gIHZhciBzcGVjaWZpY0lkcyA9IExvY2FsQ29sbGVjdGlvbi5faWRzTWF0Y2hlZEJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuICBpZiAoc3BlY2lmaWNJZHMpIHtcbiAgICBfLmVhY2goc3BlY2lmaWNJZHMsIGZ1bmN0aW9uIChpZCkge1xuICAgICAgTWV0ZW9yLnJlZnJlc2goXy5leHRlbmQoe2lkOiBpZH0sIHJlZnJlc2hLZXkpKTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBNZXRlb3IucmVmcmVzaChyZWZyZXNoS2V5KTtcbiAgfVxufTtcblxuTW9uZ29Db25uZWN0aW9uLnByb3RvdHlwZS5fcmVtb3ZlID0gZnVuY3Rpb24gKGNvbGxlY3Rpb25fbmFtZSwgc2VsZWN0b3IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2spIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIGlmIChjb2xsZWN0aW9uX25hbWUgPT09IFwiX19fbWV0ZW9yX2ZhaWx1cmVfdGVzdF9jb2xsZWN0aW9uXCIpIHtcbiAgICB2YXIgZSA9IG5ldyBFcnJvcihcIkZhaWx1cmUgdGVzdFwiKTtcbiAgICBlLl9leHBlY3RlZEJ5VGVzdCA9IHRydWU7XG4gICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICByZXR1cm4gY2FsbGJhY2soZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IGU7XG4gICAgfVxuICB9XG5cbiAgdmFyIHdyaXRlID0gc2VsZi5fbWF5YmVCZWdpbldyaXRlKCk7XG4gIHZhciByZWZyZXNoID0gZnVuY3Rpb24gKCkge1xuICAgIHNlbGYuX3JlZnJlc2goY29sbGVjdGlvbl9uYW1lLCBzZWxlY3Rvcik7XG4gIH07XG4gIGNhbGxiYWNrID0gYmluZEVudmlyb25tZW50Rm9yV3JpdGUod3JpdGVDYWxsYmFjayh3cml0ZSwgcmVmcmVzaCwgY2FsbGJhY2spKTtcblxuICB0cnkge1xuICAgIHZhciBjb2xsZWN0aW9uID0gc2VsZi5yYXdDb2xsZWN0aW9uKGNvbGxlY3Rpb25fbmFtZSk7XG4gICAgdmFyIHdyYXBwZWRDYWxsYmFjayA9IGZ1bmN0aW9uKGVyciwgZHJpdmVyUmVzdWx0KSB7XG4gICAgICBjYWxsYmFjayhlcnIsIHRyYW5zZm9ybVJlc3VsdChkcml2ZXJSZXN1bHQpLm51bWJlckFmZmVjdGVkKTtcbiAgICB9O1xuICAgIGNvbGxlY3Rpb24ucmVtb3ZlKHJlcGxhY2VUeXBlcyhzZWxlY3RvciwgcmVwbGFjZU1ldGVvckF0b21XaXRoTW9uZ28pLFxuICAgICAgICAgICAgICAgICAgICAgICB7c2FmZTogdHJ1ZX0sIHdyYXBwZWRDYWxsYmFjayk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHdyaXRlLmNvbW1pdHRlZCgpO1xuICAgIHRocm93IGVycjtcbiAgfVxufTtcblxuTW9uZ29Db25uZWN0aW9uLnByb3RvdHlwZS5fZHJvcENvbGxlY3Rpb24gPSBmdW5jdGlvbiAoY29sbGVjdGlvbk5hbWUsIGNiKSB7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICB2YXIgd3JpdGUgPSBzZWxmLl9tYXliZUJlZ2luV3JpdGUoKTtcbiAgdmFyIHJlZnJlc2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgTWV0ZW9yLnJlZnJlc2goe2NvbGxlY3Rpb246IGNvbGxlY3Rpb25OYW1lLCBpZDogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgZHJvcENvbGxlY3Rpb246IHRydWV9KTtcbiAgfTtcbiAgY2IgPSBiaW5kRW52aXJvbm1lbnRGb3JXcml0ZSh3cml0ZUNhbGxiYWNrKHdyaXRlLCByZWZyZXNoLCBjYikpO1xuXG4gIHRyeSB7XG4gICAgdmFyIGNvbGxlY3Rpb24gPSBzZWxmLnJhd0NvbGxlY3Rpb24oY29sbGVjdGlvbk5hbWUpO1xuICAgIGNvbGxlY3Rpb24uZHJvcChjYik7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICB3cml0ZS5jb21taXR0ZWQoKTtcbiAgICB0aHJvdyBlO1xuICB9XG59O1xuXG4vLyBGb3IgdGVzdGluZyBvbmx5LiAgU2xpZ2h0bHkgYmV0dGVyIHRoYW4gYGMucmF3RGF0YWJhc2UoKS5kcm9wRGF0YWJhc2UoKWBcbi8vIGJlY2F1c2UgaXQgbGV0cyB0aGUgdGVzdCdzIGZlbmNlIHdhaXQgZm9yIGl0IHRvIGJlIGNvbXBsZXRlLlxuTW9uZ29Db25uZWN0aW9uLnByb3RvdHlwZS5fZHJvcERhdGFiYXNlID0gZnVuY3Rpb24gKGNiKSB7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICB2YXIgd3JpdGUgPSBzZWxmLl9tYXliZUJlZ2luV3JpdGUoKTtcbiAgdmFyIHJlZnJlc2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgTWV0ZW9yLnJlZnJlc2goeyBkcm9wRGF0YWJhc2U6IHRydWUgfSk7XG4gIH07XG4gIGNiID0gYmluZEVudmlyb25tZW50Rm9yV3JpdGUod3JpdGVDYWxsYmFjayh3cml0ZSwgcmVmcmVzaCwgY2IpKTtcblxuICB0cnkge1xuICAgIHNlbGYuZGIuZHJvcERhdGFiYXNlKGNiKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHdyaXRlLmNvbW1pdHRlZCgpO1xuICAgIHRocm93IGU7XG4gIH1cbn07XG5cbk1vbmdvQ29ubmVjdGlvbi5wcm90b3R5cGUuX3VwZGF0ZSA9IGZ1bmN0aW9uIChjb2xsZWN0aW9uX25hbWUsIHNlbGVjdG9yLCBtb2QsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucywgY2FsbGJhY2spIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIGlmICghIGNhbGxiYWNrICYmIG9wdGlvbnMgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuICAgIGNhbGxiYWNrID0gb3B0aW9ucztcbiAgICBvcHRpb25zID0gbnVsbDtcbiAgfVxuXG4gIGlmIChjb2xsZWN0aW9uX25hbWUgPT09IFwiX19fbWV0ZW9yX2ZhaWx1cmVfdGVzdF9jb2xsZWN0aW9uXCIpIHtcbiAgICB2YXIgZSA9IG5ldyBFcnJvcihcIkZhaWx1cmUgdGVzdFwiKTtcbiAgICBlLl9leHBlY3RlZEJ5VGVzdCA9IHRydWU7XG4gICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICByZXR1cm4gY2FsbGJhY2soZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IGU7XG4gICAgfVxuICB9XG5cbiAgLy8gZXhwbGljaXQgc2FmZXR5IGNoZWNrLiBudWxsIGFuZCB1bmRlZmluZWQgY2FuIGNyYXNoIHRoZSBtb25nb1xuICAvLyBkcml2ZXIuIEFsdGhvdWdoIHRoZSBub2RlIGRyaXZlciBhbmQgbWluaW1vbmdvIGRvICdzdXBwb3J0J1xuICAvLyBub24tb2JqZWN0IG1vZGlmaWVyIGluIHRoYXQgdGhleSBkb24ndCBjcmFzaCwgdGhleSBhcmUgbm90XG4gIC8vIG1lYW5pbmdmdWwgb3BlcmF0aW9ucyBhbmQgZG8gbm90IGRvIGFueXRoaW5nLiBEZWZlbnNpdmVseSB0aHJvdyBhblxuICAvLyBlcnJvciBoZXJlLlxuICBpZiAoIW1vZCB8fCB0eXBlb2YgbW9kICE9PSAnb2JqZWN0JylcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIG1vZGlmaWVyLiBNb2RpZmllciBtdXN0IGJlIGFuIG9iamVjdC5cIik7XG5cbiAgaWYgKCEoTG9jYWxDb2xsZWN0aW9uLl9pc1BsYWluT2JqZWN0KG1vZCkgJiZcbiAgICAgICAgIUVKU09OLl9pc0N1c3RvbVR5cGUobW9kKSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBcIk9ubHkgcGxhaW4gb2JqZWN0cyBtYXkgYmUgdXNlZCBhcyByZXBsYWNlbWVudFwiICtcbiAgICAgICAgXCIgZG9jdW1lbnRzIGluIE1vbmdvREJcIik7XG4gIH1cblxuICBpZiAoIW9wdGlvbnMpIG9wdGlvbnMgPSB7fTtcblxuICB2YXIgd3JpdGUgPSBzZWxmLl9tYXliZUJlZ2luV3JpdGUoKTtcbiAgdmFyIHJlZnJlc2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgc2VsZi5fcmVmcmVzaChjb2xsZWN0aW9uX25hbWUsIHNlbGVjdG9yKTtcbiAgfTtcbiAgY2FsbGJhY2sgPSB3cml0ZUNhbGxiYWNrKHdyaXRlLCByZWZyZXNoLCBjYWxsYmFjayk7XG4gIHRyeSB7XG4gICAgdmFyIGNvbGxlY3Rpb24gPSBzZWxmLnJhd0NvbGxlY3Rpb24oY29sbGVjdGlvbl9uYW1lKTtcbiAgICB2YXIgbW9uZ29PcHRzID0ge3NhZmU6IHRydWV9O1xuICAgIC8vIEFkZCBzdXBwb3J0IGZvciBmaWx0ZXJlZCBwb3NpdGlvbmFsIG9wZXJhdG9yXG4gICAgaWYgKG9wdGlvbnMuYXJyYXlGaWx0ZXJzICE9PSB1bmRlZmluZWQpIG1vbmdvT3B0cy5hcnJheUZpbHRlcnMgPSBvcHRpb25zLmFycmF5RmlsdGVycztcbiAgICAvLyBleHBsaWN0bHkgZW51bWVyYXRlIG9wdGlvbnMgdGhhdCBtaW5pbW9uZ28gc3VwcG9ydHNcbiAgICBpZiAob3B0aW9ucy51cHNlcnQpIG1vbmdvT3B0cy51cHNlcnQgPSB0cnVlO1xuICAgIGlmIChvcHRpb25zLm11bHRpKSBtb25nb09wdHMubXVsdGkgPSB0cnVlO1xuICAgIC8vIExldHMgeW91IGdldCBhIG1vcmUgbW9yZSBmdWxsIHJlc3VsdCBmcm9tIE1vbmdvREIuIFVzZSB3aXRoIGNhdXRpb246XG4gICAgLy8gbWlnaHQgbm90IHdvcmsgd2l0aCBDLnVwc2VydCAoYXMgb3Bwb3NlZCB0byBDLnVwZGF0ZSh7dXBzZXJ0OnRydWV9KSBvclxuICAgIC8vIHdpdGggc2ltdWxhdGVkIHVwc2VydC5cbiAgICBpZiAob3B0aW9ucy5mdWxsUmVzdWx0KSBtb25nb09wdHMuZnVsbFJlc3VsdCA9IHRydWU7XG5cbiAgICB2YXIgbW9uZ29TZWxlY3RvciA9IHJlcGxhY2VUeXBlcyhzZWxlY3RvciwgcmVwbGFjZU1ldGVvckF0b21XaXRoTW9uZ28pO1xuICAgIHZhciBtb25nb01vZCA9IHJlcGxhY2VUeXBlcyhtb2QsIHJlcGxhY2VNZXRlb3JBdG9tV2l0aE1vbmdvKTtcblxuICAgIHZhciBpc01vZGlmeSA9IExvY2FsQ29sbGVjdGlvbi5faXNNb2RpZmljYXRpb25Nb2QobW9uZ29Nb2QpO1xuXG4gICAgaWYgKG9wdGlvbnMuX2ZvcmJpZFJlcGxhY2UgJiYgIWlzTW9kaWZ5KSB7XG4gICAgICB2YXIgZXJyID0gbmV3IEVycm9yKFwiSW52YWxpZCBtb2RpZmllci4gUmVwbGFjZW1lbnRzIGFyZSBmb3JiaWRkZW4uXCIpO1xuICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFdlJ3ZlIGFscmVhZHkgcnVuIHJlcGxhY2VUeXBlcy9yZXBsYWNlTWV0ZW9yQXRvbVdpdGhNb25nbyBvblxuICAgIC8vIHNlbGVjdG9yIGFuZCBtb2QuICBXZSBhc3N1bWUgaXQgZG9lc24ndCBtYXR0ZXIsIGFzIGZhciBhc1xuICAgIC8vIHRoZSBiZWhhdmlvciBvZiBtb2RpZmllcnMgaXMgY29uY2VybmVkLCB3aGV0aGVyIGBfbW9kaWZ5YFxuICAgIC8vIGlzIHJ1biBvbiBFSlNPTiBvciBvbiBtb25nby1jb252ZXJ0ZWQgRUpTT04uXG5cbiAgICAvLyBSdW4gdGhpcyBjb2RlIHVwIGZyb250IHNvIHRoYXQgaXQgZmFpbHMgZmFzdCBpZiBzb21lb25lIHVzZXNcbiAgICAvLyBhIE1vbmdvIHVwZGF0ZSBvcGVyYXRvciB3ZSBkb24ndCBzdXBwb3J0LlxuICAgIGxldCBrbm93bklkO1xuICAgIGlmIChvcHRpb25zLnVwc2VydCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgbGV0IG5ld0RvYyA9IExvY2FsQ29sbGVjdGlvbi5fY3JlYXRlVXBzZXJ0RG9jdW1lbnQoc2VsZWN0b3IsIG1vZCk7XG4gICAgICAgIGtub3duSWQgPSBuZXdEb2MuX2lkO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChvcHRpb25zLnVwc2VydCAmJlxuICAgICAgICAhIGlzTW9kaWZ5ICYmXG4gICAgICAgICEga25vd25JZCAmJlxuICAgICAgICBvcHRpb25zLmluc2VydGVkSWQgJiZcbiAgICAgICAgISAob3B0aW9ucy5pbnNlcnRlZElkIGluc3RhbmNlb2YgTW9uZ28uT2JqZWN0SUQgJiZcbiAgICAgICAgICAgb3B0aW9ucy5nZW5lcmF0ZWRJZCkpIHtcbiAgICAgIC8vIEluIGNhc2Ugb2YgYW4gdXBzZXJ0IHdpdGggYSByZXBsYWNlbWVudCwgd2hlcmUgdGhlcmUgaXMgbm8gX2lkIGRlZmluZWRcbiAgICAgIC8vIGluIGVpdGhlciB0aGUgcXVlcnkgb3IgdGhlIHJlcGxhY2VtZW50IGRvYywgbW9uZ28gd2lsbCBnZW5lcmF0ZSBhbiBpZCBpdHNlbGYuXG4gICAgICAvLyBUaGVyZWZvcmUgd2UgbmVlZCB0aGlzIHNwZWNpYWwgc3RyYXRlZ3kgaWYgd2Ugd2FudCB0byBjb250cm9sIHRoZSBpZCBvdXJzZWx2ZXMuXG5cbiAgICAgIC8vIFdlIGRvbid0IG5lZWQgdG8gZG8gdGhpcyB3aGVuOlxuICAgICAgLy8gLSBUaGlzIGlzIG5vdCBhIHJlcGxhY2VtZW50LCBzbyB3ZSBjYW4gYWRkIGFuIF9pZCB0byAkc2V0T25JbnNlcnRcbiAgICAgIC8vIC0gVGhlIGlkIGlzIGRlZmluZWQgYnkgcXVlcnkgb3IgbW9kIHdlIGNhbiBqdXN0IGFkZCBpdCB0byB0aGUgcmVwbGFjZW1lbnQgZG9jXG4gICAgICAvLyAtIFRoZSB1c2VyIGRpZCBub3Qgc3BlY2lmeSBhbnkgaWQgcHJlZmVyZW5jZSBhbmQgdGhlIGlkIGlzIGEgTW9uZ28gT2JqZWN0SWQsXG4gICAgICAvLyAgICAgdGhlbiB3ZSBjYW4ganVzdCBsZXQgTW9uZ28gZ2VuZXJhdGUgdGhlIGlkXG5cbiAgICAgIHNpbXVsYXRlVXBzZXJ0V2l0aEluc2VydGVkSWQoXG4gICAgICAgIGNvbGxlY3Rpb24sIG1vbmdvU2VsZWN0b3IsIG1vbmdvTW9kLCBvcHRpb25zLFxuICAgICAgICAvLyBUaGlzIGNhbGxiYWNrIGRvZXMgbm90IG5lZWQgdG8gYmUgYmluZEVudmlyb25tZW50J2VkIGJlY2F1c2VcbiAgICAgICAgLy8gc2ltdWxhdGVVcHNlcnRXaXRoSW5zZXJ0ZWRJZCgpIHdyYXBzIGl0IGFuZCB0aGVuIHBhc3NlcyBpdCB0aHJvdWdoXG4gICAgICAgIC8vIGJpbmRFbnZpcm9ubWVudEZvcldyaXRlLlxuICAgICAgICBmdW5jdGlvbiAoZXJyb3IsIHJlc3VsdCkge1xuICAgICAgICAgIC8vIElmIHdlIGdvdCBoZXJlIHZpYSBhIHVwc2VydCgpIGNhbGwsIHRoZW4gb3B0aW9ucy5fcmV0dXJuT2JqZWN0IHdpbGxcbiAgICAgICAgICAvLyBiZSBzZXQgYW5kIHdlIHNob3VsZCByZXR1cm4gdGhlIHdob2xlIG9iamVjdC4gT3RoZXJ3aXNlLCB3ZSBzaG91bGRcbiAgICAgICAgICAvLyBqdXN0IHJldHVybiB0aGUgbnVtYmVyIG9mIGFmZmVjdGVkIGRvY3MgdG8gbWF0Y2ggdGhlIG1vbmdvIEFQSS5cbiAgICAgICAgICBpZiAocmVzdWx0ICYmICEgb3B0aW9ucy5fcmV0dXJuT2JqZWN0KSB7XG4gICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgcmVzdWx0Lm51bWJlckFmZmVjdGVkKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIHJlc3VsdCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICApO1xuICAgIH0gZWxzZSB7XG5cbiAgICAgIGlmIChvcHRpb25zLnVwc2VydCAmJiAha25vd25JZCAmJiBvcHRpb25zLmluc2VydGVkSWQgJiYgaXNNb2RpZnkpIHtcbiAgICAgICAgaWYgKCFtb25nb01vZC5oYXNPd25Qcm9wZXJ0eSgnJHNldE9uSW5zZXJ0JykpIHtcbiAgICAgICAgICBtb25nb01vZC4kc2V0T25JbnNlcnQgPSB7fTtcbiAgICAgICAgfVxuICAgICAgICBrbm93bklkID0gb3B0aW9ucy5pbnNlcnRlZElkO1xuICAgICAgICBPYmplY3QuYXNzaWduKG1vbmdvTW9kLiRzZXRPbkluc2VydCwgcmVwbGFjZVR5cGVzKHtfaWQ6IG9wdGlvbnMuaW5zZXJ0ZWRJZH0sIHJlcGxhY2VNZXRlb3JBdG9tV2l0aE1vbmdvKSk7XG4gICAgICB9XG5cbiAgICAgIGNvbGxlY3Rpb24udXBkYXRlKFxuICAgICAgICBtb25nb1NlbGVjdG9yLCBtb25nb01vZCwgbW9uZ29PcHRzLFxuICAgICAgICBiaW5kRW52aXJvbm1lbnRGb3JXcml0ZShmdW5jdGlvbiAoZXJyLCByZXN1bHQpIHtcbiAgICAgICAgICBpZiAoISBlcnIpIHtcbiAgICAgICAgICAgIHZhciBtZXRlb3JSZXN1bHQgPSB0cmFuc2Zvcm1SZXN1bHQocmVzdWx0KTtcbiAgICAgICAgICAgIGlmIChtZXRlb3JSZXN1bHQgJiYgb3B0aW9ucy5fcmV0dXJuT2JqZWN0KSB7XG4gICAgICAgICAgICAgIC8vIElmIHRoaXMgd2FzIGFuIHVwc2VydCgpIGNhbGwsIGFuZCB3ZSBlbmRlZCB1cFxuICAgICAgICAgICAgICAvLyBpbnNlcnRpbmcgYSBuZXcgZG9jIGFuZCB3ZSBrbm93IGl0cyBpZCwgdGhlblxuICAgICAgICAgICAgICAvLyByZXR1cm4gdGhhdCBpZCBhcyB3ZWxsLlxuICAgICAgICAgICAgICBpZiAob3B0aW9ucy51cHNlcnQgJiYgbWV0ZW9yUmVzdWx0Lmluc2VydGVkSWQpIHtcbiAgICAgICAgICAgICAgICBpZiAoa25vd25JZCkge1xuICAgICAgICAgICAgICAgICAgbWV0ZW9yUmVzdWx0Lmluc2VydGVkSWQgPSBrbm93bklkO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobWV0ZW9yUmVzdWx0Lmluc2VydGVkSWQgaW5zdGFuY2VvZiBNb25nb0RCLk9iamVjdElEKSB7XG4gICAgICAgICAgICAgICAgICBtZXRlb3JSZXN1bHQuaW5zZXJ0ZWRJZCA9IG5ldyBNb25nby5PYmplY3RJRChtZXRlb3JSZXN1bHQuaW5zZXJ0ZWRJZC50b0hleFN0cmluZygpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBjYWxsYmFjayhlcnIsIG1ldGVvclJlc3VsdCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjYWxsYmFjayhlcnIsIG1ldGVvclJlc3VsdC5udW1iZXJBZmZlY3RlZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKGVycik7XG4gICAgICAgICAgfVxuICAgICAgICB9KSk7XG4gICAgfVxuICB9IGNhdGNoIChlKSB7XG4gICAgd3JpdGUuY29tbWl0dGVkKCk7XG4gICAgdGhyb3cgZTtcbiAgfVxufTtcblxudmFyIHRyYW5zZm9ybVJlc3VsdCA9IGZ1bmN0aW9uIChkcml2ZXJSZXN1bHQpIHtcbiAgdmFyIG1ldGVvclJlc3VsdCA9IHsgbnVtYmVyQWZmZWN0ZWQ6IDAgfTtcbiAgaWYgKGRyaXZlclJlc3VsdCkge1xuICAgIHZhciBtb25nb1Jlc3VsdCA9IGRyaXZlclJlc3VsdC5yZXN1bHQ7XG5cbiAgICAvLyBPbiB1cGRhdGVzIHdpdGggdXBzZXJ0OnRydWUsIHRoZSBpbnNlcnRlZCB2YWx1ZXMgY29tZSBhcyBhIGxpc3Qgb2ZcbiAgICAvLyB1cHNlcnRlZCB2YWx1ZXMgLS0gZXZlbiB3aXRoIG9wdGlvbnMubXVsdGksIHdoZW4gdGhlIHVwc2VydCBkb2VzIGluc2VydCxcbiAgICAvLyBpdCBvbmx5IGluc2VydHMgb25lIGVsZW1lbnQuXG4gICAgaWYgKG1vbmdvUmVzdWx0LnVwc2VydGVkKSB7XG4gICAgICBtZXRlb3JSZXN1bHQubnVtYmVyQWZmZWN0ZWQgKz0gbW9uZ29SZXN1bHQudXBzZXJ0ZWQubGVuZ3RoO1xuXG4gICAgICBpZiAobW9uZ29SZXN1bHQudXBzZXJ0ZWQubGVuZ3RoID09IDEpIHtcbiAgICAgICAgbWV0ZW9yUmVzdWx0Lmluc2VydGVkSWQgPSBtb25nb1Jlc3VsdC51cHNlcnRlZFswXS5faWQ7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG1ldGVvclJlc3VsdC5udW1iZXJBZmZlY3RlZCA9IG1vbmdvUmVzdWx0Lm47XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG1ldGVvclJlc3VsdDtcbn07XG5cblxudmFyIE5VTV9PUFRJTUlTVElDX1RSSUVTID0gMztcblxuLy8gZXhwb3NlZCBmb3IgdGVzdGluZ1xuTW9uZ29Db25uZWN0aW9uLl9pc0Nhbm5vdENoYW5nZUlkRXJyb3IgPSBmdW5jdGlvbiAoZXJyKSB7XG5cbiAgLy8gTW9uZ28gMy4yLiogcmV0dXJucyBlcnJvciBhcyBuZXh0IE9iamVjdDpcbiAgLy8ge25hbWU6IFN0cmluZywgY29kZTogTnVtYmVyLCBlcnJtc2c6IFN0cmluZ31cbiAgLy8gT2xkZXIgTW9uZ28gcmV0dXJuczpcbiAgLy8ge25hbWU6IFN0cmluZywgY29kZTogTnVtYmVyLCBlcnI6IFN0cmluZ31cbiAgdmFyIGVycm9yID0gZXJyLmVycm1zZyB8fCBlcnIuZXJyO1xuXG4gIC8vIFdlIGRvbid0IHVzZSB0aGUgZXJyb3IgY29kZSBoZXJlXG4gIC8vIGJlY2F1c2UgdGhlIGVycm9yIGNvZGUgd2Ugb2JzZXJ2ZWQgaXQgcHJvZHVjaW5nICgxNjgzNykgYXBwZWFycyB0byBiZVxuICAvLyBhIGZhciBtb3JlIGdlbmVyaWMgZXJyb3IgY29kZSBiYXNlZCBvbiBleGFtaW5pbmcgdGhlIHNvdXJjZS5cbiAgaWYgKGVycm9yLmluZGV4T2YoJ1RoZSBfaWQgZmllbGQgY2Fubm90IGJlIGNoYW5nZWQnKSA9PT0gMFxuICAgIHx8IGVycm9yLmluZGV4T2YoXCJ0aGUgKGltbXV0YWJsZSkgZmllbGQgJ19pZCcgd2FzIGZvdW5kIHRvIGhhdmUgYmVlbiBhbHRlcmVkIHRvIF9pZFwiKSAhPT0gLTEpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn07XG5cbnZhciBzaW11bGF0ZVVwc2VydFdpdGhJbnNlcnRlZElkID0gZnVuY3Rpb24gKGNvbGxlY3Rpb24sIHNlbGVjdG9yLCBtb2QsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLCBjYWxsYmFjaykge1xuICAvLyBTVFJBVEVHWTogRmlyc3QgdHJ5IGRvaW5nIGFuIHVwc2VydCB3aXRoIGEgZ2VuZXJhdGVkIElELlxuICAvLyBJZiB0aGlzIHRocm93cyBhbiBlcnJvciBhYm91dCBjaGFuZ2luZyB0aGUgSUQgb24gYW4gZXhpc3RpbmcgZG9jdW1lbnRcbiAgLy8gdGhlbiB3aXRob3V0IGFmZmVjdGluZyB0aGUgZGF0YWJhc2UsIHdlIGtub3cgd2Ugc2hvdWxkIHByb2JhYmx5IHRyeVxuICAvLyBhbiB1cGRhdGUgd2l0aG91dCB0aGUgZ2VuZXJhdGVkIElELiBJZiBpdCBhZmZlY3RlZCAwIGRvY3VtZW50cyxcbiAgLy8gdGhlbiB3aXRob3V0IGFmZmVjdGluZyB0aGUgZGF0YWJhc2UsIHdlIHRoZSBkb2N1bWVudCB0aGF0IGZpcnN0XG4gIC8vIGdhdmUgdGhlIGVycm9yIGlzIHByb2JhYmx5IHJlbW92ZWQgYW5kIHdlIG5lZWQgdG8gdHJ5IGFuIGluc2VydCBhZ2FpblxuICAvLyBXZSBnbyBiYWNrIHRvIHN0ZXAgb25lIGFuZCByZXBlYXQuXG4gIC8vIExpa2UgYWxsIFwib3B0aW1pc3RpYyB3cml0ZVwiIHNjaGVtZXMsIHdlIHJlbHkgb24gdGhlIGZhY3QgdGhhdCBpdCdzXG4gIC8vIHVubGlrZWx5IG91ciB3cml0ZXMgd2lsbCBjb250aW51ZSB0byBiZSBpbnRlcmZlcmVkIHdpdGggdW5kZXIgbm9ybWFsXG4gIC8vIGNpcmN1bXN0YW5jZXMgKHRob3VnaCBzdWZmaWNpZW50bHkgaGVhdnkgY29udGVudGlvbiB3aXRoIHdyaXRlcnNcbiAgLy8gZGlzYWdyZWVpbmcgb24gdGhlIGV4aXN0ZW5jZSBvZiBhbiBvYmplY3Qgd2lsbCBjYXVzZSB3cml0ZXMgdG8gZmFpbFxuICAvLyBpbiB0aGVvcnkpLlxuXG4gIHZhciBpbnNlcnRlZElkID0gb3B0aW9ucy5pbnNlcnRlZElkOyAvLyBtdXN0IGV4aXN0XG4gIHZhciBtb25nb09wdHNGb3JVcGRhdGUgPSB7XG4gICAgc2FmZTogdHJ1ZSxcbiAgICBtdWx0aTogb3B0aW9ucy5tdWx0aVxuICB9O1xuICB2YXIgbW9uZ29PcHRzRm9ySW5zZXJ0ID0ge1xuICAgIHNhZmU6IHRydWUsXG4gICAgdXBzZXJ0OiB0cnVlXG4gIH07XG5cbiAgdmFyIHJlcGxhY2VtZW50V2l0aElkID0gT2JqZWN0LmFzc2lnbihcbiAgICByZXBsYWNlVHlwZXMoe19pZDogaW5zZXJ0ZWRJZH0sIHJlcGxhY2VNZXRlb3JBdG9tV2l0aE1vbmdvKSxcbiAgICBtb2QpO1xuXG4gIHZhciB0cmllcyA9IE5VTV9PUFRJTUlTVElDX1RSSUVTO1xuXG4gIHZhciBkb1VwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB0cmllcy0tO1xuICAgIGlmICghIHRyaWVzKSB7XG4gICAgICBjYWxsYmFjayhuZXcgRXJyb3IoXCJVcHNlcnQgZmFpbGVkIGFmdGVyIFwiICsgTlVNX09QVElNSVNUSUNfVFJJRVMgKyBcIiB0cmllcy5cIikpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb2xsZWN0aW9uLnVwZGF0ZShzZWxlY3RvciwgbW9kLCBtb25nb09wdHNGb3JVcGRhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBiaW5kRW52aXJvbm1lbnRGb3JXcml0ZShmdW5jdGlvbiAoZXJyLCByZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzdWx0ICYmIHJlc3VsdC5yZXN1bHQubiAhPSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVtYmVyQWZmZWN0ZWQ6IHJlc3VsdC5yZXN1bHQublxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvQ29uZGl0aW9uYWxJbnNlcnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgZG9Db25kaXRpb25hbEluc2VydCA9IGZ1bmN0aW9uICgpIHtcbiAgICBjb2xsZWN0aW9uLnVwZGF0ZShzZWxlY3RvciwgcmVwbGFjZW1lbnRXaXRoSWQsIG1vbmdvT3B0c0Zvckluc2VydCxcbiAgICAgICAgICAgICAgICAgICAgICBiaW5kRW52aXJvbm1lbnRGb3JXcml0ZShmdW5jdGlvbiAoZXJyLCByZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZmlndXJlIG91dCBpZiB0aGlzIGlzIGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gXCJjYW5ub3QgY2hhbmdlIF9pZCBvZiBkb2N1bWVudFwiIGVycm9yLCBhbmRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgc28sIHRyeSBkb1VwZGF0ZSgpIGFnYWluLCB1cCB0byAzIHRpbWVzLlxuICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoTW9uZ29Db25uZWN0aW9uLl9pc0Nhbm5vdENoYW5nZUlkRXJyb3IoZXJyKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvVXBkYXRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG51bWJlckFmZmVjdGVkOiByZXN1bHQucmVzdWx0LnVwc2VydGVkLmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnRlZElkOiBpbnNlcnRlZElkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gIH07XG5cbiAgZG9VcGRhdGUoKTtcbn07XG5cbl8uZWFjaChbXCJpbnNlcnRcIiwgXCJ1cGRhdGVcIiwgXCJyZW1vdmVcIiwgXCJkcm9wQ29sbGVjdGlvblwiLCBcImRyb3BEYXRhYmFzZVwiXSwgZnVuY3Rpb24gKG1ldGhvZCkge1xuICBNb25nb0Nvbm5lY3Rpb24ucHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbiAoLyogYXJndW1lbnRzICovKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHJldHVybiBNZXRlb3Iud3JhcEFzeW5jKHNlbGZbXCJfXCIgKyBtZXRob2RdKS5hcHBseShzZWxmLCBhcmd1bWVudHMpO1xuICB9O1xufSk7XG5cbi8vIFhYWCBNb25nb0Nvbm5lY3Rpb24udXBzZXJ0KCkgZG9lcyBub3QgcmV0dXJuIHRoZSBpZCBvZiB0aGUgaW5zZXJ0ZWQgZG9jdW1lbnRcbi8vIHVubGVzcyB5b3Ugc2V0IGl0IGV4cGxpY2l0bHkgaW4gdGhlIHNlbGVjdG9yIG9yIG1vZGlmaWVyIChhcyBhIHJlcGxhY2VtZW50XG4vLyBkb2MpLlxuTW9uZ29Db25uZWN0aW9uLnByb3RvdHlwZS51cHNlcnQgPSBmdW5jdGlvbiAoY29sbGVjdGlvbk5hbWUsIHNlbGVjdG9yLCBtb2QsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLCBjYWxsYmFjaykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gXCJmdW5jdGlvblwiICYmICEgY2FsbGJhY2spIHtcbiAgICBjYWxsYmFjayA9IG9wdGlvbnM7XG4gICAgb3B0aW9ucyA9IHt9O1xuICB9XG5cbiAgcmV0dXJuIHNlbGYudXBkYXRlKGNvbGxlY3Rpb25OYW1lLCBzZWxlY3RvciwgbW9kLFxuICAgICAgICAgICAgICAgICAgICAgXy5leHRlbmQoe30sIG9wdGlvbnMsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgdXBzZXJ0OiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICBfcmV0dXJuT2JqZWN0OiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICB9KSwgY2FsbGJhY2spO1xufTtcblxuTW9uZ29Db25uZWN0aW9uLnByb3RvdHlwZS5maW5kID0gZnVuY3Rpb24gKGNvbGxlY3Rpb25OYW1lLCBzZWxlY3Rvciwgb3B0aW9ucykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpXG4gICAgc2VsZWN0b3IgPSB7fTtcblxuICByZXR1cm4gbmV3IEN1cnNvcihcbiAgICBzZWxmLCBuZXcgQ3Vyc29yRGVzY3JpcHRpb24oY29sbGVjdGlvbk5hbWUsIHNlbGVjdG9yLCBvcHRpb25zKSk7XG59O1xuXG5Nb25nb0Nvbm5lY3Rpb24ucHJvdG90eXBlLmZpbmRPbmUgPSBmdW5jdGlvbiAoY29sbGVjdGlvbl9uYW1lLCBzZWxlY3RvcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpXG4gICAgc2VsZWN0b3IgPSB7fTtcblxuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgb3B0aW9ucy5saW1pdCA9IDE7XG4gIHJldHVybiBzZWxmLmZpbmQoY29sbGVjdGlvbl9uYW1lLCBzZWxlY3Rvciwgb3B0aW9ucykuZmV0Y2goKVswXTtcbn07XG5cbi8vIFdlJ2xsIGFjdHVhbGx5IGRlc2lnbiBhbiBpbmRleCBBUEkgbGF0ZXIuIEZvciBub3csIHdlIGp1c3QgcGFzcyB0aHJvdWdoIHRvXG4vLyBNb25nbydzLCBidXQgbWFrZSBpdCBzeW5jaHJvbm91cy5cbk1vbmdvQ29ubmVjdGlvbi5wcm90b3R5cGUuX2Vuc3VyZUluZGV4ID0gZnVuY3Rpb24gKGNvbGxlY3Rpb25OYW1lLCBpbmRleCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMpIHtcbiAgdHJ5IHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgLy8gV2UgZXhwZWN0IHRoaXMgZnVuY3Rpb24gdG8gYmUgY2FsbGVkIGF0IHN0YXJ0dXAsIG5vdCBmcm9tIHdpdGhpbiBhIG1ldGhvZCxcbiAgICAvLyBzbyB3ZSBkb24ndCBpbnRlcmFjdCB3aXRoIHRoZSB3cml0ZSBmZW5jZS5cbiAgICB2YXIgY29sbGVjdGlvbiA9IHNlbGYucmF3Q29sbGVjdGlvbihjb2xsZWN0aW9uTmFtZSk7XG4gICAgdmFyIGZ1dHVyZSA9IG5ldyBGdXR1cmU7XG4gICAgdmFyIGluZGV4TmFtZSA9IGNvbGxlY3Rpb24uZW5zdXJlSW5kZXgoaW5kZXgsIG9wdGlvbnMsIGZ1dHVyZS5yZXNvbHZlcigpKTtcbiAgICBmdXR1cmUud2FpdCgpO1xuICB9IGNhdGNoIChFeGNlcHRpb24pIHtcbiAgICBcbiAgfVxufTtcbk1vbmdvQ29ubmVjdGlvbi5wcm90b3R5cGUuX2Ryb3BJbmRleCA9IGZ1bmN0aW9uIChjb2xsZWN0aW9uTmFtZSwgaW5kZXgpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIC8vIFRoaXMgZnVuY3Rpb24gaXMgb25seSB1c2VkIGJ5IHRlc3QgY29kZSwgbm90IHdpdGhpbiBhIG1ldGhvZCwgc28gd2UgZG9uJ3RcbiAgLy8gaW50ZXJhY3Qgd2l0aCB0aGUgd3JpdGUgZmVuY2UuXG4gIHZhciBjb2xsZWN0aW9uID0gc2VsZi5yYXdDb2xsZWN0aW9uKGNvbGxlY3Rpb25OYW1lKTtcbiAgdmFyIGZ1dHVyZSA9IG5ldyBGdXR1cmU7XG4gIHZhciBpbmRleE5hbWUgPSBjb2xsZWN0aW9uLmRyb3BJbmRleChpbmRleCwgZnV0dXJlLnJlc29sdmVyKCkpO1xuICBmdXR1cmUud2FpdCgpO1xufTtcblxuLy8gQ1VSU09SU1xuXG4vLyBUaGVyZSBhcmUgc2V2ZXJhbCBjbGFzc2VzIHdoaWNoIHJlbGF0ZSB0byBjdXJzb3JzOlxuLy9cbi8vIEN1cnNvckRlc2NyaXB0aW9uIHJlcHJlc2VudHMgdGhlIGFyZ3VtZW50cyB1c2VkIHRvIGNvbnN0cnVjdCBhIGN1cnNvcjpcbi8vIGNvbGxlY3Rpb25OYW1lLCBzZWxlY3RvciwgYW5kIChmaW5kKSBvcHRpb25zLiAgQmVjYXVzZSBpdCBpcyB1c2VkIGFzIGEga2V5XG4vLyBmb3IgY3Vyc29yIGRlLWR1cCwgZXZlcnl0aGluZyBpbiBpdCBzaG91bGQgZWl0aGVyIGJlIEpTT04tc3RyaW5naWZpYWJsZSBvclxuLy8gbm90IGFmZmVjdCBvYnNlcnZlQ2hhbmdlcyBvdXRwdXQgKGVnLCBvcHRpb25zLnRyYW5zZm9ybSBmdW5jdGlvbnMgYXJlIG5vdFxuLy8gc3RyaW5naWZpYWJsZSBidXQgZG8gbm90IGFmZmVjdCBvYnNlcnZlQ2hhbmdlcykuXG4vL1xuLy8gU3luY2hyb25vdXNDdXJzb3IgaXMgYSB3cmFwcGVyIGFyb3VuZCBhIE1vbmdvREIgY3Vyc29yXG4vLyB3aGljaCBpbmNsdWRlcyBmdWxseS1zeW5jaHJvbm91cyB2ZXJzaW9ucyBvZiBmb3JFYWNoLCBldGMuXG4vL1xuLy8gQ3Vyc29yIGlzIHRoZSBjdXJzb3Igb2JqZWN0IHJldHVybmVkIGZyb20gZmluZCgpLCB3aGljaCBpbXBsZW1lbnRzIHRoZVxuLy8gZG9jdW1lbnRlZCBNb25nby5Db2xsZWN0aW9uIGN1cnNvciBBUEkuICBJdCB3cmFwcyBhIEN1cnNvckRlc2NyaXB0aW9uIGFuZCBhXG4vLyBTeW5jaHJvbm91c0N1cnNvciAobGF6aWx5OiBpdCBkb2Vzbid0IGNvbnRhY3QgTW9uZ28gdW50aWwgeW91IGNhbGwgYSBtZXRob2Rcbi8vIGxpa2UgZmV0Y2ggb3IgZm9yRWFjaCBvbiBpdCkuXG4vL1xuLy8gT2JzZXJ2ZUhhbmRsZSBpcyB0aGUgXCJvYnNlcnZlIGhhbmRsZVwiIHJldHVybmVkIGZyb20gb2JzZXJ2ZUNoYW5nZXMuIEl0IGhhcyBhXG4vLyByZWZlcmVuY2UgdG8gYW4gT2JzZXJ2ZU11bHRpcGxleGVyLlxuLy9cbi8vIE9ic2VydmVNdWx0aXBsZXhlciBhbGxvd3MgbXVsdGlwbGUgaWRlbnRpY2FsIE9ic2VydmVIYW5kbGVzIHRvIGJlIGRyaXZlbiBieSBhXG4vLyBzaW5nbGUgb2JzZXJ2ZSBkcml2ZXIuXG4vL1xuLy8gVGhlcmUgYXJlIHR3byBcIm9ic2VydmUgZHJpdmVyc1wiIHdoaWNoIGRyaXZlIE9ic2VydmVNdWx0aXBsZXhlcnM6XG4vLyAgIC0gUG9sbGluZ09ic2VydmVEcml2ZXIgY2FjaGVzIHRoZSByZXN1bHRzIG9mIGEgcXVlcnkgYW5kIHJlcnVucyBpdCB3aGVuXG4vLyAgICAgbmVjZXNzYXJ5LlxuLy8gICAtIE9wbG9nT2JzZXJ2ZURyaXZlciBmb2xsb3dzIHRoZSBNb25nbyBvcGVyYXRpb24gbG9nIHRvIGRpcmVjdGx5IG9ic2VydmVcbi8vICAgICBkYXRhYmFzZSBjaGFuZ2VzLlxuLy8gQm90aCBpbXBsZW1lbnRhdGlvbnMgZm9sbG93IHRoZSBzYW1lIHNpbXBsZSBpbnRlcmZhY2U6IHdoZW4geW91IGNyZWF0ZSB0aGVtLFxuLy8gdGhleSBzdGFydCBzZW5kaW5nIG9ic2VydmVDaGFuZ2VzIGNhbGxiYWNrcyAoYW5kIGEgcmVhZHkoKSBpbnZvY2F0aW9uKSB0b1xuLy8gdGhlaXIgT2JzZXJ2ZU11bHRpcGxleGVyLCBhbmQgeW91IHN0b3AgdGhlbSBieSBjYWxsaW5nIHRoZWlyIHN0b3AoKSBtZXRob2QuXG5cbkN1cnNvckRlc2NyaXB0aW9uID0gZnVuY3Rpb24gKGNvbGxlY3Rpb25OYW1lLCBzZWxlY3Rvciwgb3B0aW9ucykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHNlbGYuY29sbGVjdGlvbk5hbWUgPSBjb2xsZWN0aW9uTmFtZTtcbiAgc2VsZi5zZWxlY3RvciA9IE1vbmdvLkNvbGxlY3Rpb24uX3Jld3JpdGVTZWxlY3RvcihzZWxlY3Rvcik7XG4gIHNlbGYub3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG59O1xuXG5DdXJzb3IgPSBmdW5jdGlvbiAobW9uZ28sIGN1cnNvckRlc2NyaXB0aW9uKSB7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICBzZWxmLl9tb25nbyA9IG1vbmdvO1xuICBzZWxmLl9jdXJzb3JEZXNjcmlwdGlvbiA9IGN1cnNvckRlc2NyaXB0aW9uO1xuICBzZWxmLl9zeW5jaHJvbm91c0N1cnNvciA9IG51bGw7XG59O1xuXG5fLmVhY2goWydmb3JFYWNoJywgJ21hcCcsICdmZXRjaCcsICdjb3VudCcsIFN5bWJvbC5pdGVyYXRvcl0sIGZ1bmN0aW9uIChtZXRob2QpIHtcbiAgQ3Vyc29yLnByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIC8vIFlvdSBjYW4gb25seSBvYnNlcnZlIGEgdGFpbGFibGUgY3Vyc29yLlxuICAgIGlmIChzZWxmLl9jdXJzb3JEZXNjcmlwdGlvbi5vcHRpb25zLnRhaWxhYmxlKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGNhbGwgXCIgKyBtZXRob2QgKyBcIiBvbiBhIHRhaWxhYmxlIGN1cnNvclwiKTtcblxuICAgIGlmICghc2VsZi5fc3luY2hyb25vdXNDdXJzb3IpIHtcbiAgICAgIHNlbGYuX3N5bmNocm9ub3VzQ3Vyc29yID0gc2VsZi5fbW9uZ28uX2NyZWF0ZVN5bmNocm9ub3VzQ3Vyc29yKFxuICAgICAgICBzZWxmLl9jdXJzb3JEZXNjcmlwdGlvbiwge1xuICAgICAgICAgIC8vIE1ha2Ugc3VyZSB0aGF0IHRoZSBcInNlbGZcIiBhcmd1bWVudCB0byBmb3JFYWNoL21hcCBjYWxsYmFja3MgaXMgdGhlXG4gICAgICAgICAgLy8gQ3Vyc29yLCBub3QgdGhlIFN5bmNocm9ub3VzQ3Vyc29yLlxuICAgICAgICAgIHNlbGZGb3JJdGVyYXRpb246IHNlbGYsXG4gICAgICAgICAgdXNlVHJhbnNmb3JtOiB0cnVlXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBzZWxmLl9zeW5jaHJvbm91c0N1cnNvclttZXRob2RdLmFwcGx5KFxuICAgICAgc2VsZi5fc3luY2hyb25vdXNDdXJzb3IsIGFyZ3VtZW50cyk7XG4gIH07XG59KTtcblxuLy8gU2luY2Ugd2UgZG9uJ3QgYWN0dWFsbHkgaGF2ZSBhIFwibmV4dE9iamVjdFwiIGludGVyZmFjZSwgdGhlcmUncyByZWFsbHkgbm9cbi8vIHJlYXNvbiB0byBoYXZlIGEgXCJyZXdpbmRcIiBpbnRlcmZhY2UuICBBbGwgaXQgZGlkIHdhcyBtYWtlIG11bHRpcGxlIGNhbGxzXG4vLyB0byBmZXRjaC9tYXAvZm9yRWFjaCByZXR1cm4gbm90aGluZyB0aGUgc2Vjb25kIHRpbWUuXG4vLyBYWFggQ09NUEFUIFdJVEggMC44LjFcbkN1cnNvci5wcm90b3R5cGUucmV3aW5kID0gZnVuY3Rpb24gKCkge1xufTtcblxuQ3Vyc29yLnByb3RvdHlwZS5nZXRUcmFuc2Zvcm0gPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzLl9jdXJzb3JEZXNjcmlwdGlvbi5vcHRpb25zLnRyYW5zZm9ybTtcbn07XG5cbi8vIFdoZW4geW91IGNhbGwgTWV0ZW9yLnB1Ymxpc2goKSB3aXRoIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgQ3Vyc29yLCB3ZSBuZWVkXG4vLyB0byB0cmFuc211dGUgaXQgaW50byB0aGUgZXF1aXZhbGVudCBzdWJzY3JpcHRpb24uICBUaGlzIGlzIHRoZSBmdW5jdGlvbiB0aGF0XG4vLyBkb2VzIHRoYXQuXG5cbkN1cnNvci5wcm90b3R5cGUuX3B1Ymxpc2hDdXJzb3IgPSBmdW5jdGlvbiAoc3ViKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdmFyIGNvbGxlY3Rpb24gPSBzZWxmLl9jdXJzb3JEZXNjcmlwdGlvbi5jb2xsZWN0aW9uTmFtZTtcbiAgcmV0dXJuIE1vbmdvLkNvbGxlY3Rpb24uX3B1Ymxpc2hDdXJzb3Ioc2VsZiwgc3ViLCBjb2xsZWN0aW9uKTtcbn07XG5cbi8vIFVzZWQgdG8gZ3VhcmFudGVlIHRoYXQgcHVibGlzaCBmdW5jdGlvbnMgcmV0dXJuIGF0IG1vc3Qgb25lIGN1cnNvciBwZXJcbi8vIGNvbGxlY3Rpb24uIFByaXZhdGUsIGJlY2F1c2Ugd2UgbWlnaHQgbGF0ZXIgaGF2ZSBjdXJzb3JzIHRoYXQgaW5jbHVkZVxuLy8gZG9jdW1lbnRzIGZyb20gbXVsdGlwbGUgY29sbGVjdGlvbnMgc29tZWhvdy5cbkN1cnNvci5wcm90b3R5cGUuX2dldENvbGxlY3Rpb25OYW1lID0gZnVuY3Rpb24gKCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHJldHVybiBzZWxmLl9jdXJzb3JEZXNjcmlwdGlvbi5jb2xsZWN0aW9uTmFtZTtcbn07XG5cbkN1cnNvci5wcm90b3R5cGUub2JzZXJ2ZSA9IGZ1bmN0aW9uIChjYWxsYmFja3MpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICByZXR1cm4gTG9jYWxDb2xsZWN0aW9uLl9vYnNlcnZlRnJvbU9ic2VydmVDaGFuZ2VzKHNlbGYsIGNhbGxiYWNrcyk7XG59O1xuXG5DdXJzb3IucHJvdG90eXBlLm9ic2VydmVDaGFuZ2VzID0gZnVuY3Rpb24gKGNhbGxiYWNrcykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHZhciBtZXRob2RzID0gW1xuICAgICdhZGRlZEF0JyxcbiAgICAnYWRkZWQnLFxuICAgICdjaGFuZ2VkQXQnLFxuICAgICdjaGFuZ2VkJyxcbiAgICAncmVtb3ZlZEF0JyxcbiAgICAncmVtb3ZlZCcsXG4gICAgJ21vdmVkVG8nXG4gIF07XG4gIHZhciBvcmRlcmVkID0gTG9jYWxDb2xsZWN0aW9uLl9vYnNlcnZlQ2hhbmdlc0NhbGxiYWNrc0FyZU9yZGVyZWQoY2FsbGJhY2tzKTtcblxuICAvLyBYWFg6IENhbiB3ZSBmaW5kIG91dCBpZiBjYWxsYmFja3MgYXJlIGZyb20gb2JzZXJ2ZT9cbiAgdmFyIGV4Y2VwdGlvbk5hbWUgPSAnIG9ic2VydmUvb2JzZXJ2ZUNoYW5nZXMgY2FsbGJhY2snO1xuICBtZXRob2RzLmZvckVhY2goZnVuY3Rpb24gKG1ldGhvZCkge1xuICAgIGlmIChjYWxsYmFja3NbbWV0aG9kXSAmJiB0eXBlb2YgY2FsbGJhY2tzW21ldGhvZF0gPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICBjYWxsYmFja3NbbWV0aG9kXSA9IE1ldGVvci5iaW5kRW52aXJvbm1lbnQoY2FsbGJhY2tzW21ldGhvZF0sIG1ldGhvZCArIGV4Y2VwdGlvbk5hbWUpO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHNlbGYuX21vbmdvLl9vYnNlcnZlQ2hhbmdlcyhcbiAgICBzZWxmLl9jdXJzb3JEZXNjcmlwdGlvbiwgb3JkZXJlZCwgY2FsbGJhY2tzKTtcbn07XG5cbk1vbmdvQ29ubmVjdGlvbi5wcm90b3R5cGUuX2NyZWF0ZVN5bmNocm9ub3VzQ3Vyc29yID0gZnVuY3Rpb24oXG4gICAgY3Vyc29yRGVzY3JpcHRpb24sIG9wdGlvbnMpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBvcHRpb25zID0gXy5waWNrKG9wdGlvbnMgfHwge30sICdzZWxmRm9ySXRlcmF0aW9uJywgJ3VzZVRyYW5zZm9ybScpO1xuXG4gIHZhciBjb2xsZWN0aW9uID0gc2VsZi5yYXdDb2xsZWN0aW9uKGN1cnNvckRlc2NyaXB0aW9uLmNvbGxlY3Rpb25OYW1lKTtcbiAgdmFyIGN1cnNvck9wdGlvbnMgPSBjdXJzb3JEZXNjcmlwdGlvbi5vcHRpb25zO1xuICB2YXIgbW9uZ29PcHRpb25zID0ge1xuICAgIHNvcnQ6IGN1cnNvck9wdGlvbnMuc29ydCxcbiAgICBsaW1pdDogY3Vyc29yT3B0aW9ucy5saW1pdCxcbiAgICBza2lwOiBjdXJzb3JPcHRpb25zLnNraXAsXG4gICAgcHJvamVjdGlvbjogY3Vyc29yT3B0aW9ucy5maWVsZHNcbiAgfTtcblxuICAvLyBEbyB3ZSB3YW50IGEgdGFpbGFibGUgY3Vyc29yICh3aGljaCBvbmx5IHdvcmtzIG9uIGNhcHBlZCBjb2xsZWN0aW9ucyk/XG4gIGlmIChjdXJzb3JPcHRpb25zLnRhaWxhYmxlKSB7XG4gICAgLy8gV2Ugd2FudCBhIHRhaWxhYmxlIGN1cnNvci4uLlxuICAgIG1vbmdvT3B0aW9ucy50YWlsYWJsZSA9IHRydWU7XG4gICAgLy8gLi4uIGFuZCBmb3IgdGhlIHNlcnZlciB0byB3YWl0IGEgYml0IGlmIGFueSBnZXRNb3JlIGhhcyBubyBkYXRhIChyYXRoZXJcbiAgICAvLyB0aGFuIG1ha2luZyB1cyBwdXQgdGhlIHJlbGV2YW50IHNsZWVwcyBpbiB0aGUgY2xpZW50KS4uLlxuICAgIG1vbmdvT3B0aW9ucy5hd2FpdGRhdGEgPSB0cnVlO1xuICAgIC8vIC4uLiBhbmQgdG8ga2VlcCBxdWVyeWluZyB0aGUgc2VydmVyIGluZGVmaW5pdGVseSByYXRoZXIgdGhhbiBqdXN0IDUgdGltZXNcbiAgICAvLyBpZiB0aGVyZSdzIG5vIG1vcmUgZGF0YS5cbiAgICBtb25nb09wdGlvbnMubnVtYmVyT2ZSZXRyaWVzID0gLTE7XG4gICAgLy8gQW5kIGlmIHRoaXMgaXMgb24gdGhlIG9wbG9nIGNvbGxlY3Rpb24gYW5kIHRoZSBjdXJzb3Igc3BlY2lmaWVzIGEgJ3RzJyxcbiAgICAvLyB0aGVuIHNldCB0aGUgdW5kb2N1bWVudGVkIG9wbG9nIHJlcGxheSBmbGFnLCB3aGljaCBkb2VzIGEgc3BlY2lhbCBzY2FuIHRvXG4gICAgLy8gZmluZCB0aGUgZmlyc3QgZG9jdW1lbnQgKGluc3RlYWQgb2YgY3JlYXRpbmcgYW4gaW5kZXggb24gdHMpLiBUaGlzIGlzIGFcbiAgICAvLyB2ZXJ5IGhhcmQtY29kZWQgTW9uZ28gZmxhZyB3aGljaCBvbmx5IHdvcmtzIG9uIHRoZSBvcGxvZyBjb2xsZWN0aW9uIGFuZFxuICAgIC8vIG9ubHkgd29ya3Mgd2l0aCB0aGUgdHMgZmllbGQuXG4gICAgaWYgKGN1cnNvckRlc2NyaXB0aW9uLmNvbGxlY3Rpb25OYW1lID09PSBPUExPR19DT0xMRUNUSU9OICYmXG4gICAgICAgIGN1cnNvckRlc2NyaXB0aW9uLnNlbGVjdG9yLnRzKSB7XG4gICAgICBtb25nb09wdGlvbnMub3Bsb2dSZXBsYXkgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHZhciBkYkN1cnNvciA9IGNvbGxlY3Rpb24uZmluZChcbiAgICByZXBsYWNlVHlwZXMoY3Vyc29yRGVzY3JpcHRpb24uc2VsZWN0b3IsIHJlcGxhY2VNZXRlb3JBdG9tV2l0aE1vbmdvKSxcbiAgICBtb25nb09wdGlvbnMpO1xuXG4gIGlmICh0eXBlb2YgY3Vyc29yT3B0aW9ucy5tYXhUaW1lTXMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgZGJDdXJzb3IgPSBkYkN1cnNvci5tYXhUaW1lTVMoY3Vyc29yT3B0aW9ucy5tYXhUaW1lTXMpO1xuICB9XG4gIGlmICh0eXBlb2YgY3Vyc29yT3B0aW9ucy5oaW50ICE9PSAndW5kZWZpbmVkJykge1xuICAgIGRiQ3Vyc29yID0gZGJDdXJzb3IuaGludChjdXJzb3JPcHRpb25zLmhpbnQpO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBTeW5jaHJvbm91c0N1cnNvcihkYkN1cnNvciwgY3Vyc29yRGVzY3JpcHRpb24sIG9wdGlvbnMpO1xufTtcblxudmFyIFN5bmNocm9ub3VzQ3Vyc29yID0gZnVuY3Rpb24gKGRiQ3Vyc29yLCBjdXJzb3JEZXNjcmlwdGlvbiwgb3B0aW9ucykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIG9wdGlvbnMgPSBfLnBpY2sob3B0aW9ucyB8fCB7fSwgJ3NlbGZGb3JJdGVyYXRpb24nLCAndXNlVHJhbnNmb3JtJyk7XG5cbiAgc2VsZi5fZGJDdXJzb3IgPSBkYkN1cnNvcjtcbiAgc2VsZi5fY3Vyc29yRGVzY3JpcHRpb24gPSBjdXJzb3JEZXNjcmlwdGlvbjtcbiAgLy8gVGhlIFwic2VsZlwiIGFyZ3VtZW50IHBhc3NlZCB0byBmb3JFYWNoL21hcCBjYWxsYmFja3MuIElmIHdlJ3JlIHdyYXBwZWRcbiAgLy8gaW5zaWRlIGEgdXNlci12aXNpYmxlIEN1cnNvciwgd2Ugd2FudCB0byBwcm92aWRlIHRoZSBvdXRlciBjdXJzb3IhXG4gIHNlbGYuX3NlbGZGb3JJdGVyYXRpb24gPSBvcHRpb25zLnNlbGZGb3JJdGVyYXRpb24gfHwgc2VsZjtcbiAgaWYgKG9wdGlvbnMudXNlVHJhbnNmb3JtICYmIGN1cnNvckRlc2NyaXB0aW9uLm9wdGlvbnMudHJhbnNmb3JtKSB7XG4gICAgc2VsZi5fdHJhbnNmb3JtID0gTG9jYWxDb2xsZWN0aW9uLndyYXBUcmFuc2Zvcm0oXG4gICAgICBjdXJzb3JEZXNjcmlwdGlvbi5vcHRpb25zLnRyYW5zZm9ybSk7XG4gIH0gZWxzZSB7XG4gICAgc2VsZi5fdHJhbnNmb3JtID0gbnVsbDtcbiAgfVxuXG4gIHNlbGYuX3N5bmNocm9ub3VzQ291bnQgPSBGdXR1cmUud3JhcChkYkN1cnNvci5jb3VudC5iaW5kKGRiQ3Vyc29yKSk7XG4gIHNlbGYuX3Zpc2l0ZWRJZHMgPSBuZXcgTG9jYWxDb2xsZWN0aW9uLl9JZE1hcDtcbn07XG5cbl8uZXh0ZW5kKFN5bmNocm9ub3VzQ3Vyc29yLnByb3RvdHlwZSwge1xuICAvLyBSZXR1cm5zIGEgUHJvbWlzZSBmb3IgdGhlIG5leHQgb2JqZWN0IGZyb20gdGhlIHVuZGVybHlpbmcgY3Vyc29yIChiZWZvcmVcbiAgLy8gdGhlIE1vbmdvLT5NZXRlb3IgdHlwZSByZXBsYWNlbWVudCkuXG4gIF9yYXdOZXh0T2JqZWN0UHJvbWlzZTogZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBzZWxmLl9kYkN1cnNvci5uZXh0KChlcnIsIGRvYykgPT4ge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzb2x2ZShkb2MpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSxcblxuICAvLyBSZXR1cm5zIGEgUHJvbWlzZSBmb3IgdGhlIG5leHQgb2JqZWN0IGZyb20gdGhlIGN1cnNvciwgc2tpcHBpbmcgdGhvc2Ugd2hvc2VcbiAgLy8gSURzIHdlJ3ZlIGFscmVhZHkgc2VlbiBhbmQgcmVwbGFjaW5nIE1vbmdvIGF0b21zIHdpdGggTWV0ZW9yIGF0b21zLlxuICBfbmV4dE9iamVjdFByb21pc2U6IGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgdmFyIGRvYyA9IGF3YWl0IHNlbGYuX3Jhd05leHRPYmplY3RQcm9taXNlKCk7XG5cbiAgICAgIGlmICghZG9jKSByZXR1cm4gbnVsbDtcbiAgICAgIGRvYyA9IHJlcGxhY2VUeXBlcyhkb2MsIHJlcGxhY2VNb25nb0F0b21XaXRoTWV0ZW9yKTtcblxuICAgICAgaWYgKCFzZWxmLl9jdXJzb3JEZXNjcmlwdGlvbi5vcHRpb25zLnRhaWxhYmxlICYmIF8uaGFzKGRvYywgJ19pZCcpKSB7XG4gICAgICAgIC8vIERpZCBNb25nbyBnaXZlIHVzIGR1cGxpY2F0ZSBkb2N1bWVudHMgaW4gdGhlIHNhbWUgY3Vyc29yPyBJZiBzbyxcbiAgICAgICAgLy8gaWdub3JlIHRoaXMgb25lLiAoRG8gdGhpcyBiZWZvcmUgdGhlIHRyYW5zZm9ybSwgc2luY2UgdHJhbnNmb3JtIG1pZ2h0XG4gICAgICAgIC8vIHJldHVybiBzb21lIHVucmVsYXRlZCB2YWx1ZS4pIFdlIGRvbid0IGRvIHRoaXMgZm9yIHRhaWxhYmxlIGN1cnNvcnMsXG4gICAgICAgIC8vIGJlY2F1c2Ugd2Ugd2FudCB0byBtYWludGFpbiBPKDEpIG1lbW9yeSB1c2FnZS4gQW5kIGlmIHRoZXJlIGlzbid0IF9pZFxuICAgICAgICAvLyBmb3Igc29tZSByZWFzb24gKG1heWJlIGl0J3MgdGhlIG9wbG9nKSwgdGhlbiB3ZSBkb24ndCBkbyB0aGlzIGVpdGhlci5cbiAgICAgICAgLy8gKEJlIGNhcmVmdWwgdG8gZG8gdGhpcyBmb3IgZmFsc2V5IGJ1dCBleGlzdGluZyBfaWQsIHRob3VnaC4pXG4gICAgICAgIGlmIChzZWxmLl92aXNpdGVkSWRzLmhhcyhkb2MuX2lkKSkgY29udGludWU7XG4gICAgICAgIHNlbGYuX3Zpc2l0ZWRJZHMuc2V0KGRvYy5faWQsIHRydWUpO1xuICAgICAgfVxuXG4gICAgICBpZiAoc2VsZi5fdHJhbnNmb3JtKVxuICAgICAgICBkb2MgPSBzZWxmLl90cmFuc2Zvcm0oZG9jKTtcblxuICAgICAgcmV0dXJuIGRvYztcbiAgICB9XG4gIH0sXG5cbiAgLy8gUmV0dXJucyBhIHByb21pc2Ugd2hpY2ggaXMgcmVzb2x2ZWQgd2l0aCB0aGUgbmV4dCBvYmplY3QgKGxpa2Ugd2l0aFxuICAvLyBfbmV4dE9iamVjdFByb21pc2UpIG9yIHJlamVjdGVkIGlmIHRoZSBjdXJzb3IgZG9lc24ndCByZXR1cm4gd2l0aGluXG4gIC8vIHRpbWVvdXRNUyBtcy5cbiAgX25leHRPYmplY3RQcm9taXNlV2l0aFRpbWVvdXQ6IGZ1bmN0aW9uICh0aW1lb3V0TVMpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBpZiAoIXRpbWVvdXRNUykge1xuICAgICAgcmV0dXJuIHNlbGYuX25leHRPYmplY3RQcm9taXNlKCk7XG4gICAgfVxuICAgIGNvbnN0IG5leHRPYmplY3RQcm9taXNlID0gc2VsZi5fbmV4dE9iamVjdFByb21pc2UoKTtcbiAgICBjb25zdCB0aW1lb3V0RXJyID0gbmV3IEVycm9yKCdDbGllbnQtc2lkZSB0aW1lb3V0IHdhaXRpbmcgZm9yIG5leHQgb2JqZWN0Jyk7XG4gICAgY29uc3QgdGltZW91dFByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCB0aW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICByZWplY3QodGltZW91dEVycik7XG4gICAgICB9LCB0aW1lb3V0TVMpO1xuICAgIH0pO1xuICAgIHJldHVybiBQcm9taXNlLnJhY2UoW25leHRPYmplY3RQcm9taXNlLCB0aW1lb3V0UHJvbWlzZV0pXG4gICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICBpZiAoZXJyID09PSB0aW1lb3V0RXJyKSB7XG4gICAgICAgICAgc2VsZi5jbG9zZSgpO1xuICAgICAgICB9XG4gICAgICAgIHRocm93IGVycjtcbiAgICAgIH0pO1xuICB9LFxuXG4gIF9uZXh0T2JqZWN0OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHJldHVybiBzZWxmLl9uZXh0T2JqZWN0UHJvbWlzZSgpLmF3YWl0KCk7XG4gIH0sXG5cbiAgZm9yRWFjaDogZnVuY3Rpb24gKGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgLy8gR2V0IGJhY2sgdG8gdGhlIGJlZ2lubmluZy5cbiAgICBzZWxmLl9yZXdpbmQoKTtcblxuICAgIC8vIFdlIGltcGxlbWVudCB0aGUgbG9vcCBvdXJzZWxmIGluc3RlYWQgb2YgdXNpbmcgc2VsZi5fZGJDdXJzb3IuZWFjaCxcbiAgICAvLyBiZWNhdXNlIFwiZWFjaFwiIHdpbGwgY2FsbCBpdHMgY2FsbGJhY2sgb3V0c2lkZSBvZiBhIGZpYmVyIHdoaWNoIG1ha2VzIGl0XG4gICAgLy8gbXVjaCBtb3JlIGNvbXBsZXggdG8gbWFrZSB0aGlzIGZ1bmN0aW9uIHN5bmNocm9ub3VzLlxuICAgIHZhciBpbmRleCA9IDA7XG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIHZhciBkb2MgPSBzZWxmLl9uZXh0T2JqZWN0KCk7XG4gICAgICBpZiAoIWRvYykgcmV0dXJuO1xuICAgICAgY2FsbGJhY2suY2FsbCh0aGlzQXJnLCBkb2MsIGluZGV4KyssIHNlbGYuX3NlbGZGb3JJdGVyYXRpb24pO1xuICAgIH1cbiAgfSxcblxuICAvLyBYWFggQWxsb3cgb3ZlcmxhcHBpbmcgY2FsbGJhY2sgZXhlY3V0aW9ucyBpZiBjYWxsYmFjayB5aWVsZHMuXG4gIG1hcDogZnVuY3Rpb24gKGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciByZXMgPSBbXTtcbiAgICBzZWxmLmZvckVhY2goZnVuY3Rpb24gKGRvYywgaW5kZXgpIHtcbiAgICAgIHJlcy5wdXNoKGNhbGxiYWNrLmNhbGwodGhpc0FyZywgZG9jLCBpbmRleCwgc2VsZi5fc2VsZkZvckl0ZXJhdGlvbikpO1xuICAgIH0pO1xuICAgIHJldHVybiByZXM7XG4gIH0sXG5cbiAgX3Jld2luZDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIC8vIGtub3duIHRvIGJlIHN5bmNocm9ub3VzXG4gICAgc2VsZi5fZGJDdXJzb3IucmV3aW5kKCk7XG5cbiAgICBzZWxmLl92aXNpdGVkSWRzID0gbmV3IExvY2FsQ29sbGVjdGlvbi5fSWRNYXA7XG4gIH0sXG5cbiAgLy8gTW9zdGx5IHVzYWJsZSBmb3IgdGFpbGFibGUgY3Vyc29ycy5cbiAgY2xvc2U6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICBzZWxmLl9kYkN1cnNvci5jbG9zZSgpO1xuICB9LFxuXG4gIGZldGNoOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHJldHVybiBzZWxmLm1hcChfLmlkZW50aXR5KTtcbiAgfSxcblxuICBjb3VudDogZnVuY3Rpb24gKGFwcGx5U2tpcExpbWl0ID0gZmFsc2UpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgcmV0dXJuIHNlbGYuX3N5bmNocm9ub3VzQ291bnQoYXBwbHlTa2lwTGltaXQpLndhaXQoKTtcbiAgfSxcblxuICAvLyBUaGlzIG1ldGhvZCBpcyBOT1Qgd3JhcHBlZCBpbiBDdXJzb3IuXG4gIGdldFJhd09iamVjdHM6IGZ1bmN0aW9uIChvcmRlcmVkKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIGlmIChvcmRlcmVkKSB7XG4gICAgICByZXR1cm4gc2VsZi5mZXRjaCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgcmVzdWx0cyA9IG5ldyBMb2NhbENvbGxlY3Rpb24uX0lkTWFwO1xuICAgICAgc2VsZi5mb3JFYWNoKGZ1bmN0aW9uIChkb2MpIHtcbiAgICAgICAgcmVzdWx0cy5zZXQoZG9jLl9pZCwgZG9jKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfVxuICB9XG59KTtcblxuU3luY2hyb25vdXNDdXJzb3IucHJvdG90eXBlW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICAvLyBHZXQgYmFjayB0byB0aGUgYmVnaW5uaW5nLlxuICBzZWxmLl9yZXdpbmQoKTtcblxuICByZXR1cm4ge1xuICAgIG5leHQoKSB7XG4gICAgICBjb25zdCBkb2MgPSBzZWxmLl9uZXh0T2JqZWN0KCk7XG4gICAgICByZXR1cm4gZG9jID8ge1xuICAgICAgICB2YWx1ZTogZG9jXG4gICAgICB9IDoge1xuICAgICAgICBkb25lOiB0cnVlXG4gICAgICB9O1xuICAgIH1cbiAgfTtcbn07XG5cbi8vIFRhaWxzIHRoZSBjdXJzb3IgZGVzY3JpYmVkIGJ5IGN1cnNvckRlc2NyaXB0aW9uLCBtb3N0IGxpa2VseSBvbiB0aGVcbi8vIG9wbG9nLiBDYWxscyBkb2NDYWxsYmFjayB3aXRoIGVhY2ggZG9jdW1lbnQgZm91bmQuIElnbm9yZXMgZXJyb3JzIGFuZCBqdXN0XG4vLyByZXN0YXJ0cyB0aGUgdGFpbCBvbiBlcnJvci5cbi8vXG4vLyBJZiB0aW1lb3V0TVMgaXMgc2V0LCB0aGVuIGlmIHdlIGRvbid0IGdldCBhIG5ldyBkb2N1bWVudCBldmVyeSB0aW1lb3V0TVMsXG4vLyBraWxsIGFuZCByZXN0YXJ0IHRoZSBjdXJzb3IuIFRoaXMgaXMgcHJpbWFyaWx5IGEgd29ya2Fyb3VuZCBmb3IgIzg1OTguXG5Nb25nb0Nvbm5lY3Rpb24ucHJvdG90eXBlLnRhaWwgPSBmdW5jdGlvbiAoY3Vyc29yRGVzY3JpcHRpb24sIGRvY0NhbGxiYWNrLCB0aW1lb3V0TVMpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBpZiAoIWN1cnNvckRlc2NyaXB0aW9uLm9wdGlvbnMudGFpbGFibGUpXG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ2FuIG9ubHkgdGFpbCBhIHRhaWxhYmxlIGN1cnNvclwiKTtcblxuICB2YXIgY3Vyc29yID0gc2VsZi5fY3JlYXRlU3luY2hyb25vdXNDdXJzb3IoY3Vyc29yRGVzY3JpcHRpb24pO1xuXG4gIHZhciBzdG9wcGVkID0gZmFsc2U7XG4gIHZhciBsYXN0VFM7XG4gIHZhciBsb29wID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBkb2MgPSBudWxsO1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICBpZiAoc3RvcHBlZClcbiAgICAgICAgcmV0dXJuO1xuICAgICAgdHJ5IHtcbiAgICAgICAgZG9jID0gY3Vyc29yLl9uZXh0T2JqZWN0UHJvbWlzZVdpdGhUaW1lb3V0KHRpbWVvdXRNUykuYXdhaXQoKTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAvLyBUaGVyZSdzIG5vIGdvb2Qgd2F5IHRvIGZpZ3VyZSBvdXQgaWYgdGhpcyB3YXMgYWN0dWFsbHkgYW4gZXJyb3IgZnJvbVxuICAgICAgICAvLyBNb25nbywgb3IganVzdCBjbGllbnQtc2lkZSAoaW5jbHVkaW5nIG91ciBvd24gdGltZW91dCBlcnJvcikuIEFoXG4gICAgICAgIC8vIHdlbGwuIEJ1dCBlaXRoZXIgd2F5LCB3ZSBuZWVkIHRvIHJldHJ5IHRoZSBjdXJzb3IgKHVubGVzcyB0aGUgZmFpbHVyZVxuICAgICAgICAvLyB3YXMgYmVjYXVzZSB0aGUgb2JzZXJ2ZSBnb3Qgc3RvcHBlZCkuXG4gICAgICAgIGRvYyA9IG51bGw7XG4gICAgICB9XG4gICAgICAvLyBTaW5jZSB3ZSBhd2FpdGVkIGEgcHJvbWlzZSBhYm92ZSwgd2UgbmVlZCB0byBjaGVjayBhZ2FpbiB0byBzZWUgaWZcbiAgICAgIC8vIHdlJ3ZlIGJlZW4gc3RvcHBlZCBiZWZvcmUgY2FsbGluZyB0aGUgY2FsbGJhY2suXG4gICAgICBpZiAoc3RvcHBlZClcbiAgICAgICAgcmV0dXJuO1xuICAgICAgaWYgKGRvYykge1xuICAgICAgICAvLyBJZiBhIHRhaWxhYmxlIGN1cnNvciBjb250YWlucyBhIFwidHNcIiBmaWVsZCwgdXNlIGl0IHRvIHJlY3JlYXRlIHRoZVxuICAgICAgICAvLyBjdXJzb3Igb24gZXJyb3IuIChcInRzXCIgaXMgYSBzdGFuZGFyZCB0aGF0IE1vbmdvIHVzZXMgaW50ZXJuYWxseSBmb3JcbiAgICAgICAgLy8gdGhlIG9wbG9nLCBhbmQgdGhlcmUncyBhIHNwZWNpYWwgZmxhZyB0aGF0IGxldHMgeW91IGRvIGJpbmFyeSBzZWFyY2hcbiAgICAgICAgLy8gb24gaXQgaW5zdGVhZCBvZiBuZWVkaW5nIHRvIHVzZSBhbiBpbmRleC4pXG4gICAgICAgIGxhc3RUUyA9IGRvYy50cztcbiAgICAgICAgZG9jQ2FsbGJhY2soZG9jKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBuZXdTZWxlY3RvciA9IF8uY2xvbmUoY3Vyc29yRGVzY3JpcHRpb24uc2VsZWN0b3IpO1xuICAgICAgICBpZiAobGFzdFRTKSB7XG4gICAgICAgICAgbmV3U2VsZWN0b3IudHMgPSB7JGd0OiBsYXN0VFN9O1xuICAgICAgICB9XG4gICAgICAgIGN1cnNvciA9IHNlbGYuX2NyZWF0ZVN5bmNocm9ub3VzQ3Vyc29yKG5ldyBDdXJzb3JEZXNjcmlwdGlvbihcbiAgICAgICAgICBjdXJzb3JEZXNjcmlwdGlvbi5jb2xsZWN0aW9uTmFtZSxcbiAgICAgICAgICBuZXdTZWxlY3RvcixcbiAgICAgICAgICBjdXJzb3JEZXNjcmlwdGlvbi5vcHRpb25zKSk7XG4gICAgICAgIC8vIE1vbmdvIGZhaWxvdmVyIHRha2VzIG1hbnkgc2Vjb25kcy4gIFJldHJ5IGluIGEgYml0LiAgKFdpdGhvdXQgdGhpc1xuICAgICAgICAvLyBzZXRUaW1lb3V0LCB3ZSBwZWcgdGhlIENQVSBhdCAxMDAlIGFuZCBuZXZlciBub3RpY2UgdGhlIGFjdHVhbFxuICAgICAgICAvLyBmYWlsb3Zlci5cbiAgICAgICAgTWV0ZW9yLnNldFRpbWVvdXQobG9vcCwgMTAwKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIE1ldGVvci5kZWZlcihsb29wKTtcblxuICByZXR1cm4ge1xuICAgIHN0b3A6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHN0b3BwZWQgPSB0cnVlO1xuICAgICAgY3Vyc29yLmNsb3NlKCk7XG4gICAgfVxuICB9O1xufTtcblxuTW9uZ29Db25uZWN0aW9uLnByb3RvdHlwZS5fb2JzZXJ2ZUNoYW5nZXMgPSBmdW5jdGlvbiAoXG4gICAgY3Vyc29yRGVzY3JpcHRpb24sIG9yZGVyZWQsIGNhbGxiYWNrcykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgaWYgKGN1cnNvckRlc2NyaXB0aW9uLm9wdGlvbnMudGFpbGFibGUpIHtcbiAgICByZXR1cm4gc2VsZi5fb2JzZXJ2ZUNoYW5nZXNUYWlsYWJsZShjdXJzb3JEZXNjcmlwdGlvbiwgb3JkZXJlZCwgY2FsbGJhY2tzKTtcbiAgfVxuXG4gIC8vIFlvdSBtYXkgbm90IGZpbHRlciBvdXQgX2lkIHdoZW4gb2JzZXJ2aW5nIGNoYW5nZXMsIGJlY2F1c2UgdGhlIGlkIGlzIGEgY29yZVxuICAvLyBwYXJ0IG9mIHRoZSBvYnNlcnZlQ2hhbmdlcyBBUEkuXG4gIGlmIChjdXJzb3JEZXNjcmlwdGlvbi5vcHRpb25zLmZpZWxkcyAmJlxuICAgICAgKGN1cnNvckRlc2NyaXB0aW9uLm9wdGlvbnMuZmllbGRzLl9pZCA9PT0gMCB8fFxuICAgICAgIGN1cnNvckRlc2NyaXB0aW9uLm9wdGlvbnMuZmllbGRzLl9pZCA9PT0gZmFsc2UpKSB7XG4gICAgdGhyb3cgRXJyb3IoXCJZb3UgbWF5IG5vdCBvYnNlcnZlIGEgY3Vyc29yIHdpdGgge2ZpZWxkczoge19pZDogMH19XCIpO1xuICB9XG5cbiAgdmFyIG9ic2VydmVLZXkgPSBFSlNPTi5zdHJpbmdpZnkoXG4gICAgXy5leHRlbmQoe29yZGVyZWQ6IG9yZGVyZWR9LCBjdXJzb3JEZXNjcmlwdGlvbikpO1xuXG4gIHZhciBtdWx0aXBsZXhlciwgb2JzZXJ2ZURyaXZlcjtcbiAgdmFyIGZpcnN0SGFuZGxlID0gZmFsc2U7XG5cbiAgLy8gRmluZCBhIG1hdGNoaW5nIE9ic2VydmVNdWx0aXBsZXhlciwgb3IgY3JlYXRlIGEgbmV3IG9uZS4gVGhpcyBuZXh0IGJsb2NrIGlzXG4gIC8vIGd1YXJhbnRlZWQgdG8gbm90IHlpZWxkIChhbmQgaXQgZG9lc24ndCBjYWxsIGFueXRoaW5nIHRoYXQgY2FuIG9ic2VydmUgYVxuICAvLyBuZXcgcXVlcnkpLCBzbyBubyBvdGhlciBjYWxscyB0byB0aGlzIGZ1bmN0aW9uIGNhbiBpbnRlcmxlYXZlIHdpdGggaXQuXG4gIE1ldGVvci5fbm9ZaWVsZHNBbGxvd2VkKGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoXy5oYXMoc2VsZi5fb2JzZXJ2ZU11bHRpcGxleGVycywgb2JzZXJ2ZUtleSkpIHtcbiAgICAgIG11bHRpcGxleGVyID0gc2VsZi5fb2JzZXJ2ZU11bHRpcGxleGVyc1tvYnNlcnZlS2V5XTtcbiAgICB9IGVsc2Uge1xuICAgICAgZmlyc3RIYW5kbGUgPSB0cnVlO1xuICAgICAgLy8gQ3JlYXRlIGEgbmV3IE9ic2VydmVNdWx0aXBsZXhlci5cbiAgICAgIG11bHRpcGxleGVyID0gbmV3IE9ic2VydmVNdWx0aXBsZXhlcih7XG4gICAgICAgIG9yZGVyZWQ6IG9yZGVyZWQsXG4gICAgICAgIG9uU3RvcDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGRlbGV0ZSBzZWxmLl9vYnNlcnZlTXVsdGlwbGV4ZXJzW29ic2VydmVLZXldO1xuICAgICAgICAgIG9ic2VydmVEcml2ZXIuc3RvcCgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHNlbGYuX29ic2VydmVNdWx0aXBsZXhlcnNbb2JzZXJ2ZUtleV0gPSBtdWx0aXBsZXhlcjtcbiAgICB9XG4gIH0pO1xuXG4gIHZhciBvYnNlcnZlSGFuZGxlID0gbmV3IE9ic2VydmVIYW5kbGUobXVsdGlwbGV4ZXIsIGNhbGxiYWNrcyk7XG5cbiAgaWYgKGZpcnN0SGFuZGxlKSB7XG4gICAgdmFyIG1hdGNoZXIsIHNvcnRlcjtcbiAgICB2YXIgY2FuVXNlT3Bsb2cgPSBfLmFsbChbXG4gICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIEF0IGEgYmFyZSBtaW5pbXVtLCB1c2luZyB0aGUgb3Bsb2cgcmVxdWlyZXMgdXMgdG8gaGF2ZSBhbiBvcGxvZywgdG9cbiAgICAgICAgLy8gd2FudCB1bm9yZGVyZWQgY2FsbGJhY2tzLCBhbmQgdG8gbm90IHdhbnQgYSBjYWxsYmFjayBvbiB0aGUgcG9sbHNcbiAgICAgICAgLy8gdGhhdCB3b24ndCBoYXBwZW4uXG4gICAgICAgIHJldHVybiBzZWxmLl9vcGxvZ0hhbmRsZSAmJiAhb3JkZXJlZCAmJlxuICAgICAgICAgICFjYWxsYmFja3MuX3Rlc3RPbmx5UG9sbENhbGxiYWNrO1xuICAgICAgfSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBXZSBuZWVkIHRvIGJlIGFibGUgdG8gY29tcGlsZSB0aGUgc2VsZWN0b3IuIEZhbGwgYmFjayB0byBwb2xsaW5nIGZvclxuICAgICAgICAvLyBzb21lIG5ld2ZhbmdsZWQgJHNlbGVjdG9yIHRoYXQgbWluaW1vbmdvIGRvZXNuJ3Qgc3VwcG9ydCB5ZXQuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgbWF0Y2hlciA9IG5ldyBNaW5pbW9uZ28uTWF0Y2hlcihjdXJzb3JEZXNjcmlwdGlvbi5zZWxlY3Rvcik7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAvLyBYWFggbWFrZSBhbGwgY29tcGlsYXRpb24gZXJyb3JzIE1pbmltb25nb0Vycm9yIG9yIHNvbWV0aGluZ1xuICAgICAgICAgIC8vICAgICBzbyB0aGF0IHRoaXMgZG9lc24ndCBpZ25vcmUgdW5yZWxhdGVkIGV4Y2VwdGlvbnNcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gLi4uIGFuZCB0aGUgc2VsZWN0b3IgaXRzZWxmIG5lZWRzIHRvIHN1cHBvcnQgb3Bsb2cuXG4gICAgICAgIHJldHVybiBPcGxvZ09ic2VydmVEcml2ZXIuY3Vyc29yU3VwcG9ydGVkKGN1cnNvckRlc2NyaXB0aW9uLCBtYXRjaGVyKTtcbiAgICAgIH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gQW5kIHdlIG5lZWQgdG8gYmUgYWJsZSB0byBjb21waWxlIHRoZSBzb3J0LCBpZiBhbnkuICBlZywgY2FuJ3QgYmVcbiAgICAgICAgLy8geyRuYXR1cmFsOiAxfS5cbiAgICAgICAgaWYgKCFjdXJzb3JEZXNjcmlwdGlvbi5vcHRpb25zLnNvcnQpXG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgc29ydGVyID0gbmV3IE1pbmltb25nby5Tb3J0ZXIoY3Vyc29yRGVzY3JpcHRpb24ub3B0aW9ucy5zb3J0KTtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIC8vIFhYWCBtYWtlIGFsbCBjb21waWxhdGlvbiBlcnJvcnMgTWluaW1vbmdvRXJyb3Igb3Igc29tZXRoaW5nXG4gICAgICAgICAgLy8gICAgIHNvIHRoYXQgdGhpcyBkb2Vzbid0IGlnbm9yZSB1bnJlbGF0ZWQgZXhjZXB0aW9uc1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfV0sIGZ1bmN0aW9uIChmKSB7IHJldHVybiBmKCk7IH0pOyAgLy8gaW52b2tlIGVhY2ggZnVuY3Rpb25cblxuICAgIHZhciBkcml2ZXJDbGFzcyA9IGNhblVzZU9wbG9nID8gT3Bsb2dPYnNlcnZlRHJpdmVyIDogUG9sbGluZ09ic2VydmVEcml2ZXI7XG4gICAgb2JzZXJ2ZURyaXZlciA9IG5ldyBkcml2ZXJDbGFzcyh7XG4gICAgICBjdXJzb3JEZXNjcmlwdGlvbjogY3Vyc29yRGVzY3JpcHRpb24sXG4gICAgICBtb25nb0hhbmRsZTogc2VsZixcbiAgICAgIG11bHRpcGxleGVyOiBtdWx0aXBsZXhlcixcbiAgICAgIG9yZGVyZWQ6IG9yZGVyZWQsXG4gICAgICBtYXRjaGVyOiBtYXRjaGVyLCAgLy8gaWdub3JlZCBieSBwb2xsaW5nXG4gICAgICBzb3J0ZXI6IHNvcnRlciwgIC8vIGlnbm9yZWQgYnkgcG9sbGluZ1xuICAgICAgX3Rlc3RPbmx5UG9sbENhbGxiYWNrOiBjYWxsYmFja3MuX3Rlc3RPbmx5UG9sbENhbGxiYWNrXG4gICAgfSk7XG5cbiAgICAvLyBUaGlzIGZpZWxkIGlzIG9ubHkgc2V0IGZvciB1c2UgaW4gdGVzdHMuXG4gICAgbXVsdGlwbGV4ZXIuX29ic2VydmVEcml2ZXIgPSBvYnNlcnZlRHJpdmVyO1xuICB9XG5cbiAgLy8gQmxvY2tzIHVudGlsIHRoZSBpbml0aWFsIGFkZHMgaGF2ZSBiZWVuIHNlbnQuXG4gIG11bHRpcGxleGVyLmFkZEhhbmRsZUFuZFNlbmRJbml0aWFsQWRkcyhvYnNlcnZlSGFuZGxlKTtcblxuICByZXR1cm4gb2JzZXJ2ZUhhbmRsZTtcbn07XG5cbi8vIExpc3RlbiBmb3IgdGhlIGludmFsaWRhdGlvbiBtZXNzYWdlcyB0aGF0IHdpbGwgdHJpZ2dlciB1cyB0byBwb2xsIHRoZVxuLy8gZGF0YWJhc2UgZm9yIGNoYW5nZXMuIElmIHRoaXMgc2VsZWN0b3Igc3BlY2lmaWVzIHNwZWNpZmljIElEcywgc3BlY2lmeSB0aGVtXG4vLyBoZXJlLCBzbyB0aGF0IHVwZGF0ZXMgdG8gZGlmZmVyZW50IHNwZWNpZmljIElEcyBkb24ndCBjYXVzZSB1cyB0byBwb2xsLlxuLy8gbGlzdGVuQ2FsbGJhY2sgaXMgdGhlIHNhbWUga2luZCBvZiAobm90aWZpY2F0aW9uLCBjb21wbGV0ZSkgY2FsbGJhY2sgcGFzc2VkXG4vLyB0byBJbnZhbGlkYXRpb25Dcm9zc2Jhci5saXN0ZW4uXG5cbmxpc3RlbkFsbCA9IGZ1bmN0aW9uIChjdXJzb3JEZXNjcmlwdGlvbiwgbGlzdGVuQ2FsbGJhY2spIHtcbiAgdmFyIGxpc3RlbmVycyA9IFtdO1xuICBmb3JFYWNoVHJpZ2dlcihjdXJzb3JEZXNjcmlwdGlvbiwgZnVuY3Rpb24gKHRyaWdnZXIpIHtcbiAgICBsaXN0ZW5lcnMucHVzaChERFBTZXJ2ZXIuX0ludmFsaWRhdGlvbkNyb3NzYmFyLmxpc3RlbihcbiAgICAgIHRyaWdnZXIsIGxpc3RlbkNhbGxiYWNrKSk7XG4gIH0pO1xuXG4gIHJldHVybiB7XG4gICAgc3RvcDogZnVuY3Rpb24gKCkge1xuICAgICAgXy5lYWNoKGxpc3RlbmVycywgZnVuY3Rpb24gKGxpc3RlbmVyKSB7XG4gICAgICAgIGxpc3RlbmVyLnN0b3AoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbn07XG5cbmZvckVhY2hUcmlnZ2VyID0gZnVuY3Rpb24gKGN1cnNvckRlc2NyaXB0aW9uLCB0cmlnZ2VyQ2FsbGJhY2spIHtcbiAgdmFyIGtleSA9IHtjb2xsZWN0aW9uOiBjdXJzb3JEZXNjcmlwdGlvbi5jb2xsZWN0aW9uTmFtZX07XG4gIHZhciBzcGVjaWZpY0lkcyA9IExvY2FsQ29sbGVjdGlvbi5faWRzTWF0Y2hlZEJ5U2VsZWN0b3IoXG4gICAgY3Vyc29yRGVzY3JpcHRpb24uc2VsZWN0b3IpO1xuICBpZiAoc3BlY2lmaWNJZHMpIHtcbiAgICBfLmVhY2goc3BlY2lmaWNJZHMsIGZ1bmN0aW9uIChpZCkge1xuICAgICAgdHJpZ2dlckNhbGxiYWNrKF8uZXh0ZW5kKHtpZDogaWR9LCBrZXkpKTtcbiAgICB9KTtcbiAgICB0cmlnZ2VyQ2FsbGJhY2soXy5leHRlbmQoe2Ryb3BDb2xsZWN0aW9uOiB0cnVlLCBpZDogbnVsbH0sIGtleSkpO1xuICB9IGVsc2Uge1xuICAgIHRyaWdnZXJDYWxsYmFjayhrZXkpO1xuICB9XG4gIC8vIEV2ZXJ5b25lIGNhcmVzIGFib3V0IHRoZSBkYXRhYmFzZSBiZWluZyBkcm9wcGVkLlxuICB0cmlnZ2VyQ2FsbGJhY2soeyBkcm9wRGF0YWJhc2U6IHRydWUgfSk7XG59O1xuXG4vLyBvYnNlcnZlQ2hhbmdlcyBmb3IgdGFpbGFibGUgY3Vyc29ycyBvbiBjYXBwZWQgY29sbGVjdGlvbnMuXG4vL1xuLy8gU29tZSBkaWZmZXJlbmNlcyBmcm9tIG5vcm1hbCBjdXJzb3JzOlxuLy8gICAtIFdpbGwgbmV2ZXIgcHJvZHVjZSBhbnl0aGluZyBvdGhlciB0aGFuICdhZGRlZCcgb3IgJ2FkZGVkQmVmb3JlJy4gSWYgeW91XG4vLyAgICAgZG8gdXBkYXRlIGEgZG9jdW1lbnQgdGhhdCBoYXMgYWxyZWFkeSBiZWVuIHByb2R1Y2VkLCB0aGlzIHdpbGwgbm90IG5vdGljZVxuLy8gICAgIGl0LlxuLy8gICAtIElmIHlvdSBkaXNjb25uZWN0IGFuZCByZWNvbm5lY3QgZnJvbSBNb25nbywgaXQgd2lsbCBlc3NlbnRpYWxseSByZXN0YXJ0XG4vLyAgICAgdGhlIHF1ZXJ5LCB3aGljaCB3aWxsIGxlYWQgdG8gZHVwbGljYXRlIHJlc3VsdHMuIFRoaXMgaXMgcHJldHR5IGJhZCxcbi8vICAgICBidXQgaWYgeW91IGluY2x1ZGUgYSBmaWVsZCBjYWxsZWQgJ3RzJyB3aGljaCBpcyBpbnNlcnRlZCBhc1xuLy8gICAgIG5ldyBNb25nb0ludGVybmFscy5Nb25nb1RpbWVzdGFtcCgwLCAwKSAod2hpY2ggaXMgaW5pdGlhbGl6ZWQgdG8gdGhlXG4vLyAgICAgY3VycmVudCBNb25nby1zdHlsZSB0aW1lc3RhbXApLCB3ZSdsbCBiZSBhYmxlIHRvIGZpbmQgdGhlIHBsYWNlIHRvXG4vLyAgICAgcmVzdGFydCBwcm9wZXJseS4gKFRoaXMgZmllbGQgaXMgc3BlY2lmaWNhbGx5IHVuZGVyc3Rvb2QgYnkgTW9uZ28gd2l0aCBhblxuLy8gICAgIG9wdGltaXphdGlvbiB3aGljaCBhbGxvd3MgaXQgdG8gZmluZCB0aGUgcmlnaHQgcGxhY2UgdG8gc3RhcnQgd2l0aG91dFxuLy8gICAgIGFuIGluZGV4IG9uIHRzLiBJdCdzIGhvdyB0aGUgb3Bsb2cgd29ya3MuKVxuLy8gICAtIE5vIGNhbGxiYWNrcyBhcmUgdHJpZ2dlcmVkIHN5bmNocm9ub3VzbHkgd2l0aCB0aGUgY2FsbCAodGhlcmUncyBub1xuLy8gICAgIGRpZmZlcmVudGlhdGlvbiBiZXR3ZWVuIFwiaW5pdGlhbCBkYXRhXCIgYW5kIFwibGF0ZXIgY2hhbmdlc1wiOyBldmVyeXRoaW5nXG4vLyAgICAgdGhhdCBtYXRjaGVzIHRoZSBxdWVyeSBnZXRzIHNlbnQgYXN5bmNocm9ub3VzbHkpLlxuLy8gICAtIERlLWR1cGxpY2F0aW9uIGlzIG5vdCBpbXBsZW1lbnRlZC5cbi8vICAgLSBEb2VzIG5vdCB5ZXQgaW50ZXJhY3Qgd2l0aCB0aGUgd3JpdGUgZmVuY2UuIFByb2JhYmx5LCB0aGlzIHNob3VsZCB3b3JrIGJ5XG4vLyAgICAgaWdub3JpbmcgcmVtb3ZlcyAod2hpY2ggZG9uJ3Qgd29yayBvbiBjYXBwZWQgY29sbGVjdGlvbnMpIGFuZCB1cGRhdGVzXG4vLyAgICAgKHdoaWNoIGRvbid0IGFmZmVjdCB0YWlsYWJsZSBjdXJzb3JzKSwgYW5kIGp1c3Qga2VlcGluZyB0cmFjayBvZiB0aGUgSURcbi8vICAgICBvZiB0aGUgaW5zZXJ0ZWQgb2JqZWN0LCBhbmQgY2xvc2luZyB0aGUgd3JpdGUgZmVuY2Ugb25jZSB5b3UgZ2V0IHRvIHRoYXRcbi8vICAgICBJRCAob3IgdGltZXN0YW1wPykuICBUaGlzIGRvZXNuJ3Qgd29yayB3ZWxsIGlmIHRoZSBkb2N1bWVudCBkb2Vzbid0IG1hdGNoXG4vLyAgICAgdGhlIHF1ZXJ5LCB0aG91Z2guICBPbiB0aGUgb3RoZXIgaGFuZCwgdGhlIHdyaXRlIGZlbmNlIGNhbiBjbG9zZVxuLy8gICAgIGltbWVkaWF0ZWx5IGlmIGl0IGRvZXMgbm90IG1hdGNoIHRoZSBxdWVyeS4gU28gaWYgd2UgdHJ1c3QgbWluaW1vbmdvXG4vLyAgICAgZW5vdWdoIHRvIGFjY3VyYXRlbHkgZXZhbHVhdGUgdGhlIHF1ZXJ5IGFnYWluc3QgdGhlIHdyaXRlIGZlbmNlLCB3ZVxuLy8gICAgIHNob3VsZCBiZSBhYmxlIHRvIGRvIHRoaXMuLi4gIE9mIGNvdXJzZSwgbWluaW1vbmdvIGRvZXNuJ3QgZXZlbiBzdXBwb3J0XG4vLyAgICAgTW9uZ28gVGltZXN0YW1wcyB5ZXQuXG5Nb25nb0Nvbm5lY3Rpb24ucHJvdG90eXBlLl9vYnNlcnZlQ2hhbmdlc1RhaWxhYmxlID0gZnVuY3Rpb24gKFxuICAgIGN1cnNvckRlc2NyaXB0aW9uLCBvcmRlcmVkLCBjYWxsYmFja3MpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIC8vIFRhaWxhYmxlIGN1cnNvcnMgb25seSBldmVyIGNhbGwgYWRkZWQvYWRkZWRCZWZvcmUgY2FsbGJhY2tzLCBzbyBpdCdzIGFuXG4gIC8vIGVycm9yIGlmIHlvdSBkaWRuJ3QgcHJvdmlkZSB0aGVtLlxuICBpZiAoKG9yZGVyZWQgJiYgIWNhbGxiYWNrcy5hZGRlZEJlZm9yZSkgfHxcbiAgICAgICghb3JkZXJlZCAmJiAhY2FsbGJhY2tzLmFkZGVkKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkNhbid0IG9ic2VydmUgYW4gXCIgKyAob3JkZXJlZCA/IFwib3JkZXJlZFwiIDogXCJ1bm9yZGVyZWRcIilcbiAgICAgICAgICAgICAgICAgICAgKyBcIiB0YWlsYWJsZSBjdXJzb3Igd2l0aG91dCBhIFwiXG4gICAgICAgICAgICAgICAgICAgICsgKG9yZGVyZWQgPyBcImFkZGVkQmVmb3JlXCIgOiBcImFkZGVkXCIpICsgXCIgY2FsbGJhY2tcIik7XG4gIH1cblxuICByZXR1cm4gc2VsZi50YWlsKGN1cnNvckRlc2NyaXB0aW9uLCBmdW5jdGlvbiAoZG9jKSB7XG4gICAgdmFyIGlkID0gZG9jLl9pZDtcbiAgICBkZWxldGUgZG9jLl9pZDtcbiAgICAvLyBUaGUgdHMgaXMgYW4gaW1wbGVtZW50YXRpb24gZGV0YWlsLiBIaWRlIGl0LlxuICAgIGRlbGV0ZSBkb2MudHM7XG4gICAgaWYgKG9yZGVyZWQpIHtcbiAgICAgIGNhbGxiYWNrcy5hZGRlZEJlZm9yZShpZCwgZG9jLCBudWxsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2FsbGJhY2tzLmFkZGVkKGlkLCBkb2MpO1xuICAgIH1cbiAgfSk7XG59O1xuXG4vLyBYWFggV2UgcHJvYmFibHkgbmVlZCB0byBmaW5kIGEgYmV0dGVyIHdheSB0byBleHBvc2UgdGhpcy4gUmlnaHQgbm93XG4vLyBpdCdzIG9ubHkgdXNlZCBieSB0ZXN0cywgYnV0IGluIGZhY3QgeW91IG5lZWQgaXQgaW4gbm9ybWFsXG4vLyBvcGVyYXRpb24gdG8gaW50ZXJhY3Qgd2l0aCBjYXBwZWQgY29sbGVjdGlvbnMuXG5Nb25nb0ludGVybmFscy5Nb25nb1RpbWVzdGFtcCA9IE1vbmdvREIuVGltZXN0YW1wO1xuXG5Nb25nb0ludGVybmFscy5Db25uZWN0aW9uID0gTW9uZ29Db25uZWN0aW9uO1xuIiwidmFyIEZ1dHVyZSA9IE5wbS5yZXF1aXJlKCdmaWJlcnMvZnV0dXJlJyk7XG5cbmltcG9ydCB7IE5wbU1vZHVsZU1vbmdvZGIgfSBmcm9tIFwibWV0ZW9yL25wbS1tb25nb1wiO1xuY29uc3QgeyBUaW1lc3RhbXAgfSA9IE5wbU1vZHVsZU1vbmdvZGI7XG5cbk9QTE9HX0NPTExFQ1RJT04gPSAnb3Bsb2cucnMnO1xuXG52YXIgVE9PX0ZBUl9CRUhJTkQgPSBwcm9jZXNzLmVudi5NRVRFT1JfT1BMT0dfVE9PX0ZBUl9CRUhJTkQgfHwgMjAwMDtcbnZhciBUQUlMX1RJTUVPVVQgPSArcHJvY2Vzcy5lbnYuTUVURU9SX09QTE9HX1RBSUxfVElNRU9VVCB8fCAzMDAwMDtcblxudmFyIHNob3dUUyA9IGZ1bmN0aW9uICh0cykge1xuICByZXR1cm4gXCJUaW1lc3RhbXAoXCIgKyB0cy5nZXRIaWdoQml0cygpICsgXCIsIFwiICsgdHMuZ2V0TG93Qml0cygpICsgXCIpXCI7XG59O1xuXG5pZEZvck9wID0gZnVuY3Rpb24gKG9wKSB7XG4gIGlmIChvcC5vcCA9PT0gJ2QnKVxuICAgIHJldHVybiBvcC5vLl9pZDtcbiAgZWxzZSBpZiAob3Aub3AgPT09ICdpJylcbiAgICByZXR1cm4gb3Auby5faWQ7XG4gIGVsc2UgaWYgKG9wLm9wID09PSAndScpXG4gICAgcmV0dXJuIG9wLm8yLl9pZDtcbiAgZWxzZSBpZiAob3Aub3AgPT09ICdjJylcbiAgICB0aHJvdyBFcnJvcihcIk9wZXJhdG9yICdjJyBkb2Vzbid0IHN1cHBseSBhbiBvYmplY3Qgd2l0aCBpZDogXCIgK1xuICAgICAgICAgICAgICAgIEVKU09OLnN0cmluZ2lmeShvcCkpO1xuICBlbHNlXG4gICAgdGhyb3cgRXJyb3IoXCJVbmtub3duIG9wOiBcIiArIEVKU09OLnN0cmluZ2lmeShvcCkpO1xufTtcblxuT3Bsb2dIYW5kbGUgPSBmdW5jdGlvbiAob3Bsb2dVcmwsIGRiTmFtZSkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHNlbGYuX29wbG9nVXJsID0gb3Bsb2dVcmw7XG4gIHNlbGYuX2RiTmFtZSA9IGRiTmFtZTtcblxuICBzZWxmLl9vcGxvZ0xhc3RFbnRyeUNvbm5lY3Rpb24gPSBudWxsO1xuICBzZWxmLl9vcGxvZ1RhaWxDb25uZWN0aW9uID0gbnVsbDtcbiAgc2VsZi5fc3RvcHBlZCA9IGZhbHNlO1xuICBzZWxmLl90YWlsSGFuZGxlID0gbnVsbDtcbiAgc2VsZi5fcmVhZHlGdXR1cmUgPSBuZXcgRnV0dXJlKCk7XG4gIHNlbGYuX2Nyb3NzYmFyID0gbmV3IEREUFNlcnZlci5fQ3Jvc3NiYXIoe1xuICAgIGZhY3RQYWNrYWdlOiBcIm1vbmdvLWxpdmVkYXRhXCIsIGZhY3ROYW1lOiBcIm9wbG9nLXdhdGNoZXJzXCJcbiAgfSk7XG4gIHNlbGYuX2Jhc2VPcGxvZ1NlbGVjdG9yID0ge1xuICAgIG5zOiBuZXcgUmVnRXhwKFwiXig/OlwiICsgW1xuICAgICAgTWV0ZW9yLl9lc2NhcGVSZWdFeHAoc2VsZi5fZGJOYW1lICsgXCIuXCIpLFxuICAgICAgTWV0ZW9yLl9lc2NhcGVSZWdFeHAoXCJhZG1pbi4kY21kXCIpLFxuICAgIF0uam9pbihcInxcIikgKyBcIilcIiksXG5cbiAgICAkb3I6IFtcbiAgICAgIHsgb3A6IHsgJGluOiBbJ2knLCAndScsICdkJ10gfSB9LFxuICAgICAgLy8gZHJvcCBjb2xsZWN0aW9uXG4gICAgICB7IG9wOiAnYycsICdvLmRyb3AnOiB7ICRleGlzdHM6IHRydWUgfSB9LFxuICAgICAgeyBvcDogJ2MnLCAnby5kcm9wRGF0YWJhc2UnOiAxIH0sXG4gICAgICB7IG9wOiAnYycsICdvLmFwcGx5T3BzJzogeyAkZXhpc3RzOiB0cnVlIH0gfSxcbiAgICBdXG4gIH07XG5cbiAgLy8gRGF0YSBzdHJ1Y3R1cmVzIHRvIHN1cHBvcnQgd2FpdFVudGlsQ2F1Z2h0VXAoKS4gRWFjaCBvcGxvZyBlbnRyeSBoYXMgYVxuICAvLyBNb25nb1RpbWVzdGFtcCBvYmplY3Qgb24gaXQgKHdoaWNoIGlzIG5vdCB0aGUgc2FtZSBhcyBhIERhdGUgLS0tIGl0J3MgYVxuICAvLyBjb21iaW5hdGlvbiBvZiB0aW1lIGFuZCBhbiBpbmNyZW1lbnRpbmcgY291bnRlcjsgc2VlXG4gIC8vIGh0dHA6Ly9kb2NzLm1vbmdvZGIub3JnL21hbnVhbC9yZWZlcmVuY2UvYnNvbi10eXBlcy8jdGltZXN0YW1wcykuXG4gIC8vXG4gIC8vIF9jYXRjaGluZ1VwRnV0dXJlcyBpcyBhbiBhcnJheSBvZiB7dHM6IE1vbmdvVGltZXN0YW1wLCBmdXR1cmU6IEZ1dHVyZX1cbiAgLy8gb2JqZWN0cywgc29ydGVkIGJ5IGFzY2VuZGluZyB0aW1lc3RhbXAuIF9sYXN0UHJvY2Vzc2VkVFMgaXMgdGhlXG4gIC8vIE1vbmdvVGltZXN0YW1wIG9mIHRoZSBsYXN0IG9wbG9nIGVudHJ5IHdlJ3ZlIHByb2Nlc3NlZC5cbiAgLy9cbiAgLy8gRWFjaCB0aW1lIHdlIGNhbGwgd2FpdFVudGlsQ2F1Z2h0VXAsIHdlIHRha2UgYSBwZWVrIGF0IHRoZSBmaW5hbCBvcGxvZ1xuICAvLyBlbnRyeSBpbiB0aGUgZGIuICBJZiB3ZSd2ZSBhbHJlYWR5IHByb2Nlc3NlZCBpdCAoaWUsIGl0IGlzIG5vdCBncmVhdGVyIHRoYW5cbiAgLy8gX2xhc3RQcm9jZXNzZWRUUyksIHdhaXRVbnRpbENhdWdodFVwIGltbWVkaWF0ZWx5IHJldHVybnMuIE90aGVyd2lzZSxcbiAgLy8gd2FpdFVudGlsQ2F1Z2h0VXAgbWFrZXMgYSBuZXcgRnV0dXJlIGFuZCBpbnNlcnRzIGl0IGFsb25nIHdpdGggdGhlIGZpbmFsXG4gIC8vIHRpbWVzdGFtcCBlbnRyeSB0aGF0IGl0IHJlYWQsIGludG8gX2NhdGNoaW5nVXBGdXR1cmVzLiB3YWl0VW50aWxDYXVnaHRVcFxuICAvLyB0aGVuIHdhaXRzIG9uIHRoYXQgZnV0dXJlLCB3aGljaCBpcyByZXNvbHZlZCBvbmNlIF9sYXN0UHJvY2Vzc2VkVFMgaXNcbiAgLy8gaW5jcmVtZW50ZWQgdG8gYmUgcGFzdCBpdHMgdGltZXN0YW1wIGJ5IHRoZSB3b3JrZXIgZmliZXIuXG4gIC8vXG4gIC8vIFhYWCB1c2UgYSBwcmlvcml0eSBxdWV1ZSBvciBzb21ldGhpbmcgZWxzZSB0aGF0J3MgZmFzdGVyIHRoYW4gYW4gYXJyYXlcbiAgc2VsZi5fY2F0Y2hpbmdVcEZ1dHVyZXMgPSBbXTtcbiAgc2VsZi5fbGFzdFByb2Nlc3NlZFRTID0gbnVsbDtcblxuICBzZWxmLl9vblNraXBwZWRFbnRyaWVzSG9vayA9IG5ldyBIb29rKHtcbiAgICBkZWJ1Z1ByaW50RXhjZXB0aW9uczogXCJvblNraXBwZWRFbnRyaWVzIGNhbGxiYWNrXCJcbiAgfSk7XG5cbiAgc2VsZi5fZW50cnlRdWV1ZSA9IG5ldyBNZXRlb3IuX0RvdWJsZUVuZGVkUXVldWUoKTtcbiAgc2VsZi5fd29ya2VyQWN0aXZlID0gZmFsc2U7XG5cbiAgc2VsZi5fc3RhcnRUYWlsaW5nKCk7XG59O1xuXG5fLmV4dGVuZChPcGxvZ0hhbmRsZS5wcm90b3R5cGUsIHtcbiAgc3RvcDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBpZiAoc2VsZi5fc3RvcHBlZClcbiAgICAgIHJldHVybjtcbiAgICBzZWxmLl9zdG9wcGVkID0gdHJ1ZTtcbiAgICBpZiAoc2VsZi5fdGFpbEhhbmRsZSlcbiAgICAgIHNlbGYuX3RhaWxIYW5kbGUuc3RvcCgpO1xuICAgIC8vIFhYWCBzaG91bGQgY2xvc2UgY29ubmVjdGlvbnMgdG9vXG4gIH0sXG4gIG9uT3Bsb2dFbnRyeTogZnVuY3Rpb24gKHRyaWdnZXIsIGNhbGxiYWNrKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIGlmIChzZWxmLl9zdG9wcGVkKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2FsbGVkIG9uT3Bsb2dFbnRyeSBvbiBzdG9wcGVkIGhhbmRsZSFcIik7XG5cbiAgICAvLyBDYWxsaW5nIG9uT3Bsb2dFbnRyeSByZXF1aXJlcyB1cyB0byB3YWl0IGZvciB0aGUgdGFpbGluZyB0byBiZSByZWFkeS5cbiAgICBzZWxmLl9yZWFkeUZ1dHVyZS53YWl0KCk7XG5cbiAgICB2YXIgb3JpZ2luYWxDYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgIGNhbGxiYWNrID0gTWV0ZW9yLmJpbmRFbnZpcm9ubWVudChmdW5jdGlvbiAobm90aWZpY2F0aW9uKSB7XG4gICAgICBvcmlnaW5hbENhbGxiYWNrKG5vdGlmaWNhdGlvbik7XG4gICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgTWV0ZW9yLl9kZWJ1ZyhcIkVycm9yIGluIG9wbG9nIGNhbGxiYWNrXCIsIGVycik7XG4gICAgfSk7XG4gICAgdmFyIGxpc3RlbkhhbmRsZSA9IHNlbGYuX2Nyb3NzYmFyLmxpc3Rlbih0cmlnZ2VyLCBjYWxsYmFjayk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHN0b3A6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGlzdGVuSGFuZGxlLnN0b3AoKTtcbiAgICAgIH1cbiAgICB9O1xuICB9LFxuICAvLyBSZWdpc3RlciBhIGNhbGxiYWNrIHRvIGJlIGludm9rZWQgYW55IHRpbWUgd2Ugc2tpcCBvcGxvZyBlbnRyaWVzIChlZyxcbiAgLy8gYmVjYXVzZSB3ZSBhcmUgdG9vIGZhciBiZWhpbmQpLlxuICBvblNraXBwZWRFbnRyaWVzOiBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgaWYgKHNlbGYuX3N0b3BwZWQpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYWxsZWQgb25Ta2lwcGVkRW50cmllcyBvbiBzdG9wcGVkIGhhbmRsZSFcIik7XG4gICAgcmV0dXJuIHNlbGYuX29uU2tpcHBlZEVudHJpZXNIb29rLnJlZ2lzdGVyKGNhbGxiYWNrKTtcbiAgfSxcbiAgLy8gQ2FsbHMgYGNhbGxiYWNrYCBvbmNlIHRoZSBvcGxvZyBoYXMgYmVlbiBwcm9jZXNzZWQgdXAgdG8gYSBwb2ludCB0aGF0IGlzXG4gIC8vIHJvdWdobHkgXCJub3dcIjogc3BlY2lmaWNhbGx5LCBvbmNlIHdlJ3ZlIHByb2Nlc3NlZCBhbGwgb3BzIHRoYXQgYXJlXG4gIC8vIGN1cnJlbnRseSB2aXNpYmxlLlxuICAvLyBYWFggYmVjb21lIGNvbnZpbmNlZCB0aGF0IHRoaXMgaXMgYWN0dWFsbHkgc2FmZSBldmVuIGlmIG9wbG9nQ29ubmVjdGlvblxuICAvLyBpcyBzb21lIGtpbmQgb2YgcG9vbFxuICB3YWl0VW50aWxDYXVnaHRVcDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBpZiAoc2VsZi5fc3RvcHBlZClcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbGxlZCB3YWl0VW50aWxDYXVnaHRVcCBvbiBzdG9wcGVkIGhhbmRsZSFcIik7XG5cbiAgICAvLyBDYWxsaW5nIHdhaXRVbnRpbENhdWdodFVwIHJlcXVyaWVzIHVzIHRvIHdhaXQgZm9yIHRoZSBvcGxvZyBjb25uZWN0aW9uIHRvXG4gICAgLy8gYmUgcmVhZHkuXG4gICAgc2VsZi5fcmVhZHlGdXR1cmUud2FpdCgpO1xuICAgIHZhciBsYXN0RW50cnk7XG5cbiAgICB3aGlsZSAoIXNlbGYuX3N0b3BwZWQpIHtcbiAgICAgIC8vIFdlIG5lZWQgdG8gbWFrZSB0aGUgc2VsZWN0b3IgYXQgbGVhc3QgYXMgcmVzdHJpY3RpdmUgYXMgdGhlIGFjdHVhbFxuICAgICAgLy8gdGFpbGluZyBzZWxlY3RvciAoaWUsIHdlIG5lZWQgdG8gc3BlY2lmeSB0aGUgREIgbmFtZSkgb3IgZWxzZSB3ZSBtaWdodFxuICAgICAgLy8gZmluZCBhIFRTIHRoYXQgd29uJ3Qgc2hvdyB1cCBpbiB0aGUgYWN0dWFsIHRhaWwgc3RyZWFtLlxuICAgICAgdHJ5IHtcbiAgICAgICAgbGFzdEVudHJ5ID0gc2VsZi5fb3Bsb2dMYXN0RW50cnlDb25uZWN0aW9uLmZpbmRPbmUoXG4gICAgICAgICAgT1BMT0dfQ09MTEVDVElPTiwgc2VsZi5fYmFzZU9wbG9nU2VsZWN0b3IsXG4gICAgICAgICAge2ZpZWxkczoge3RzOiAxfSwgc29ydDogeyRuYXR1cmFsOiAtMX19KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIER1cmluZyBmYWlsb3ZlciAoZWcpIGlmIHdlIGdldCBhbiBleGNlcHRpb24gd2Ugc2hvdWxkIGxvZyBhbmQgcmV0cnlcbiAgICAgICAgLy8gaW5zdGVhZCBvZiBjcmFzaGluZy5cbiAgICAgICAgTWV0ZW9yLl9kZWJ1ZyhcIkdvdCBleGNlcHRpb24gd2hpbGUgcmVhZGluZyBsYXN0IGVudHJ5XCIsIGUpO1xuICAgICAgICBNZXRlb3IuX3NsZWVwRm9yTXMoMTAwKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc2VsZi5fc3RvcHBlZClcbiAgICAgIHJldHVybjtcblxuICAgIGlmICghbGFzdEVudHJ5KSB7XG4gICAgICAvLyBSZWFsbHksIG5vdGhpbmcgaW4gdGhlIG9wbG9nPyBXZWxsLCB3ZSd2ZSBwcm9jZXNzZWQgZXZlcnl0aGluZy5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgdHMgPSBsYXN0RW50cnkudHM7XG4gICAgaWYgKCF0cylcbiAgICAgIHRocm93IEVycm9yKFwib3Bsb2cgZW50cnkgd2l0aG91dCB0czogXCIgKyBFSlNPTi5zdHJpbmdpZnkobGFzdEVudHJ5KSk7XG5cbiAgICBpZiAoc2VsZi5fbGFzdFByb2Nlc3NlZFRTICYmIHRzLmxlc3NUaGFuT3JFcXVhbChzZWxmLl9sYXN0UHJvY2Vzc2VkVFMpKSB7XG4gICAgICAvLyBXZSd2ZSBhbHJlYWR5IGNhdWdodCB1cCB0byBoZXJlLlxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuXG4gICAgLy8gSW5zZXJ0IHRoZSBmdXR1cmUgaW50byBvdXIgbGlzdC4gQWxtb3N0IGFsd2F5cywgdGhpcyB3aWxsIGJlIGF0IHRoZSBlbmQsXG4gICAgLy8gYnV0IGl0J3MgY29uY2VpdmFibGUgdGhhdCBpZiB3ZSBmYWlsIG92ZXIgZnJvbSBvbmUgcHJpbWFyeSB0byBhbm90aGVyLFxuICAgIC8vIHRoZSBvcGxvZyBlbnRyaWVzIHdlIHNlZSB3aWxsIGdvIGJhY2t3YXJkcy5cbiAgICB2YXIgaW5zZXJ0QWZ0ZXIgPSBzZWxmLl9jYXRjaGluZ1VwRnV0dXJlcy5sZW5ndGg7XG4gICAgd2hpbGUgKGluc2VydEFmdGVyIC0gMSA+IDAgJiYgc2VsZi5fY2F0Y2hpbmdVcEZ1dHVyZXNbaW5zZXJ0QWZ0ZXIgLSAxXS50cy5ncmVhdGVyVGhhbih0cykpIHtcbiAgICAgIGluc2VydEFmdGVyLS07XG4gICAgfVxuICAgIHZhciBmID0gbmV3IEZ1dHVyZTtcbiAgICBzZWxmLl9jYXRjaGluZ1VwRnV0dXJlcy5zcGxpY2UoaW5zZXJ0QWZ0ZXIsIDAsIHt0czogdHMsIGZ1dHVyZTogZn0pO1xuICAgIGYud2FpdCgpO1xuICB9LFxuICBfc3RhcnRUYWlsaW5nOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIC8vIEZpcnN0LCBtYWtlIHN1cmUgdGhhdCB3ZSdyZSB0YWxraW5nIHRvIHRoZSBsb2NhbCBkYXRhYmFzZS5cbiAgICB2YXIgbW9uZ29kYlVyaSA9IE5wbS5yZXF1aXJlKCdtb25nb2RiLXVyaScpO1xuICAgIGlmIChtb25nb2RiVXJpLnBhcnNlKHNlbGYuX29wbG9nVXJsKS5kYXRhYmFzZSAhPT0gJ2xvY2FsJykge1xuICAgICAgdGhyb3cgRXJyb3IoXCIkTU9OR09fT1BMT0dfVVJMIG11c3QgYmUgc2V0IHRvIHRoZSAnbG9jYWwnIGRhdGFiYXNlIG9mIFwiICtcbiAgICAgICAgICAgICAgICAgIFwiYSBNb25nbyByZXBsaWNhIHNldFwiKTtcbiAgICB9XG5cbiAgICAvLyBXZSBtYWtlIHR3byBzZXBhcmF0ZSBjb25uZWN0aW9ucyB0byBNb25nby4gVGhlIE5vZGUgTW9uZ28gZHJpdmVyXG4gICAgLy8gaW1wbGVtZW50cyBhIG5haXZlIHJvdW5kLXJvYmluIGNvbm5lY3Rpb24gcG9vbDogZWFjaCBcImNvbm5lY3Rpb25cIiBpcyBhXG4gICAgLy8gcG9vbCBvZiBzZXZlcmFsICg1IGJ5IGRlZmF1bHQpIFRDUCBjb25uZWN0aW9ucywgYW5kIGVhY2ggcmVxdWVzdCBpc1xuICAgIC8vIHJvdGF0ZWQgdGhyb3VnaCB0aGUgcG9vbHMuIFRhaWxhYmxlIGN1cnNvciBxdWVyaWVzIGJsb2NrIG9uIHRoZSBzZXJ2ZXJcbiAgICAvLyB1bnRpbCB0aGVyZSBpcyBzb21lIGRhdGEgdG8gcmV0dXJuIChvciB1bnRpbCBhIGZldyBzZWNvbmRzIGhhdmVcbiAgICAvLyBwYXNzZWQpLiBTbyBpZiB0aGUgY29ubmVjdGlvbiBwb29sIHVzZWQgZm9yIHRhaWxpbmcgY3Vyc29ycyBpcyB0aGUgc2FtZVxuICAgIC8vIHBvb2wgdXNlZCBmb3Igb3RoZXIgcXVlcmllcywgdGhlIG90aGVyIHF1ZXJpZXMgd2lsbCBiZSBkZWxheWVkIGJ5IHNlY29uZHNcbiAgICAvLyAxLzUgb2YgdGhlIHRpbWUuXG4gICAgLy9cbiAgICAvLyBUaGUgdGFpbCBjb25uZWN0aW9uIHdpbGwgb25seSBldmVyIGJlIHJ1bm5pbmcgYSBzaW5nbGUgdGFpbCBjb21tYW5kLCBzb1xuICAgIC8vIGl0IG9ubHkgbmVlZHMgdG8gbWFrZSBvbmUgdW5kZXJseWluZyBUQ1AgY29ubmVjdGlvbi5cbiAgICBzZWxmLl9vcGxvZ1RhaWxDb25uZWN0aW9uID0gbmV3IE1vbmdvQ29ubmVjdGlvbihcbiAgICAgIHNlbGYuX29wbG9nVXJsLCB7cG9vbFNpemU6IDF9KTtcbiAgICAvLyBYWFggYmV0dGVyIGRvY3MsIGJ1dDogaXQncyB0byBnZXQgbW9ub3RvbmljIHJlc3VsdHNcbiAgICAvLyBYWFggaXMgaXQgc2FmZSB0byBzYXkgXCJpZiB0aGVyZSdzIGFuIGluIGZsaWdodCBxdWVyeSwganVzdCB1c2UgaXRzXG4gICAgLy8gICAgIHJlc3VsdHNcIj8gSSBkb24ndCB0aGluayBzbyBidXQgc2hvdWxkIGNvbnNpZGVyIHRoYXRcbiAgICBzZWxmLl9vcGxvZ0xhc3RFbnRyeUNvbm5lY3Rpb24gPSBuZXcgTW9uZ29Db25uZWN0aW9uKFxuICAgICAgc2VsZi5fb3Bsb2dVcmwsIHtwb29sU2l6ZTogMX0pO1xuXG4gICAgLy8gTm93LCBtYWtlIHN1cmUgdGhhdCB0aGVyZSBhY3R1YWxseSBpcyBhIHJlcGwgc2V0IGhlcmUuIElmIG5vdCwgb3Bsb2dcbiAgICAvLyB0YWlsaW5nIHdvbid0IGV2ZXIgZmluZCBhbnl0aGluZyFcbiAgICAvLyBNb3JlIG9uIHRoZSBpc01hc3RlckRvY1xuICAgIC8vIGh0dHBzOi8vZG9jcy5tb25nb2RiLmNvbS9tYW51YWwvcmVmZXJlbmNlL2NvbW1hbmQvaXNNYXN0ZXIvXG4gICAgdmFyIGYgPSBuZXcgRnV0dXJlO1xuICAgIHNlbGYuX29wbG9nTGFzdEVudHJ5Q29ubmVjdGlvbi5kYi5hZG1pbigpLmNvbW1hbmQoXG4gICAgICB7IGlzbWFzdGVyOiAxIH0sIGYucmVzb2x2ZXIoKSk7XG4gICAgdmFyIGlzTWFzdGVyRG9jID0gZi53YWl0KCk7XG5cbiAgICBpZiAoIShpc01hc3RlckRvYyAmJiBpc01hc3RlckRvYy5zZXROYW1lKSkge1xuICAgICAgdGhyb3cgRXJyb3IoXCIkTU9OR09fT1BMT0dfVVJMIG11c3QgYmUgc2V0IHRvIHRoZSAnbG9jYWwnIGRhdGFiYXNlIG9mIFwiICtcbiAgICAgICAgICAgICAgICAgIFwiYSBNb25nbyByZXBsaWNhIHNldFwiKTtcbiAgICB9XG5cbiAgICAvLyBGaW5kIHRoZSBsYXN0IG9wbG9nIGVudHJ5LlxuICAgIHZhciBsYXN0T3Bsb2dFbnRyeSA9IHNlbGYuX29wbG9nTGFzdEVudHJ5Q29ubmVjdGlvbi5maW5kT25lKFxuICAgICAgT1BMT0dfQ09MTEVDVElPTiwge30sIHtzb3J0OiB7JG5hdHVyYWw6IC0xfSwgZmllbGRzOiB7dHM6IDF9fSk7XG5cbiAgICB2YXIgb3Bsb2dTZWxlY3RvciA9IF8uY2xvbmUoc2VsZi5fYmFzZU9wbG9nU2VsZWN0b3IpO1xuICAgIGlmIChsYXN0T3Bsb2dFbnRyeSkge1xuICAgICAgLy8gU3RhcnQgYWZ0ZXIgdGhlIGxhc3QgZW50cnkgdGhhdCBjdXJyZW50bHkgZXhpc3RzLlxuICAgICAgb3Bsb2dTZWxlY3Rvci50cyA9IHskZ3Q6IGxhc3RPcGxvZ0VudHJ5LnRzfTtcbiAgICAgIC8vIElmIHRoZXJlIGFyZSBhbnkgY2FsbHMgdG8gY2FsbFdoZW5Qcm9jZXNzZWRMYXRlc3QgYmVmb3JlIGFueSBvdGhlclxuICAgICAgLy8gb3Bsb2cgZW50cmllcyBzaG93IHVwLCBhbGxvdyBjYWxsV2hlblByb2Nlc3NlZExhdGVzdCB0byBjYWxsIGl0c1xuICAgICAgLy8gY2FsbGJhY2sgaW1tZWRpYXRlbHkuXG4gICAgICBzZWxmLl9sYXN0UHJvY2Vzc2VkVFMgPSBsYXN0T3Bsb2dFbnRyeS50cztcbiAgICB9XG5cbiAgICB2YXIgY3Vyc29yRGVzY3JpcHRpb24gPSBuZXcgQ3Vyc29yRGVzY3JpcHRpb24oXG4gICAgICBPUExPR19DT0xMRUNUSU9OLCBvcGxvZ1NlbGVjdG9yLCB7dGFpbGFibGU6IHRydWV9KTtcblxuICAgIC8vIFN0YXJ0IHRhaWxpbmcgdGhlIG9wbG9nLlxuICAgIC8vXG4gICAgLy8gV2UgcmVzdGFydCB0aGUgbG93LWxldmVsIG9wbG9nIHF1ZXJ5IGV2ZXJ5IDMwIHNlY29uZHMgaWYgd2UgZGlkbid0IGdldCBhXG4gICAgLy8gZG9jLiBUaGlzIGlzIGEgd29ya2Fyb3VuZCBmb3IgIzg1OTg6IHRoZSBOb2RlIE1vbmdvIGRyaXZlciBoYXMgYXQgbGVhc3RcbiAgICAvLyBvbmUgYnVnIHRoYXQgY2FuIGxlYWQgdG8gcXVlcnkgY2FsbGJhY2tzIG5ldmVyIGdldHRpbmcgY2FsbGVkIChldmVuIHdpdGhcbiAgICAvLyBhbiBlcnJvcikgd2hlbiBsZWFkZXJzaGlwIGZhaWxvdmVyIG9jY3VyLlxuICAgIHNlbGYuX3RhaWxIYW5kbGUgPSBzZWxmLl9vcGxvZ1RhaWxDb25uZWN0aW9uLnRhaWwoXG4gICAgICBjdXJzb3JEZXNjcmlwdGlvbixcbiAgICAgIGZ1bmN0aW9uIChkb2MpIHtcbiAgICAgICAgc2VsZi5fZW50cnlRdWV1ZS5wdXNoKGRvYyk7XG4gICAgICAgIHNlbGYuX21heWJlU3RhcnRXb3JrZXIoKTtcbiAgICAgIH0sXG4gICAgICBUQUlMX1RJTUVPVVRcbiAgICApO1xuICAgIHNlbGYuX3JlYWR5RnV0dXJlLnJldHVybigpO1xuICB9LFxuXG4gIF9tYXliZVN0YXJ0V29ya2VyOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIGlmIChzZWxmLl93b3JrZXJBY3RpdmUpIHJldHVybjtcbiAgICBzZWxmLl93b3JrZXJBY3RpdmUgPSB0cnVlO1xuXG4gICAgTWV0ZW9yLmRlZmVyKGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIE1heSBiZSBjYWxsZWQgcmVjdXJzaXZlbHkgaW4gY2FzZSBvZiB0cmFuc2FjdGlvbnMuXG4gICAgICBmdW5jdGlvbiBoYW5kbGVEb2MoZG9jKSB7XG4gICAgICAgIGlmIChkb2MubnMgPT09IFwiYWRtaW4uJGNtZFwiKSB7XG4gICAgICAgICAgaWYgKGRvYy5vLmFwcGx5T3BzKSB7XG4gICAgICAgICAgICAvLyBUaGlzIHdhcyBhIHN1Y2Nlc3NmdWwgdHJhbnNhY3Rpb24sIHNvIHdlIG5lZWQgdG8gYXBwbHkgdGhlXG4gICAgICAgICAgICAvLyBvcGVyYXRpb25zIHRoYXQgd2VyZSBpbnZvbHZlZC5cbiAgICAgICAgICAgIGxldCBuZXh0VGltZXN0YW1wID0gZG9jLnRzO1xuICAgICAgICAgICAgZG9jLm8uYXBwbHlPcHMuZm9yRWFjaChvcCA9PiB7XG4gICAgICAgICAgICAgIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vbWV0ZW9yL21ldGVvci9pc3N1ZXMvMTA0MjAuXG4gICAgICAgICAgICAgIGlmICghb3AudHMpIHtcbiAgICAgICAgICAgICAgICBvcC50cyA9IG5leHRUaW1lc3RhbXA7XG4gICAgICAgICAgICAgICAgbmV4dFRpbWVzdGFtcCA9IG5leHRUaW1lc3RhbXAuYWRkKFRpbWVzdGFtcC5PTkUpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGhhbmRsZURvYyhvcCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5rbm93biBjb21tYW5kIFwiICsgRUpTT04uc3RyaW5naWZ5KGRvYykpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdHJpZ2dlciA9IHtcbiAgICAgICAgICBkcm9wQ29sbGVjdGlvbjogZmFsc2UsXG4gICAgICAgICAgZHJvcERhdGFiYXNlOiBmYWxzZSxcbiAgICAgICAgICBvcDogZG9jLFxuICAgICAgICB9O1xuXG4gICAgICAgIGlmICh0eXBlb2YgZG9jLm5zID09PSBcInN0cmluZ1wiICYmXG4gICAgICAgICAgICBkb2MubnMuc3RhcnRzV2l0aChzZWxmLl9kYk5hbWUgKyBcIi5cIikpIHtcbiAgICAgICAgICB0cmlnZ2VyLmNvbGxlY3Rpb24gPSBkb2MubnMuc2xpY2Uoc2VsZi5fZGJOYW1lLmxlbmd0aCArIDEpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSXMgaXQgYSBzcGVjaWFsIGNvbW1hbmQgYW5kIHRoZSBjb2xsZWN0aW9uIG5hbWUgaXMgaGlkZGVuXG4gICAgICAgIC8vIHNvbWV3aGVyZSBpbiBvcGVyYXRvcj9cbiAgICAgICAgaWYgKHRyaWdnZXIuY29sbGVjdGlvbiA9PT0gXCIkY21kXCIpIHtcbiAgICAgICAgICBpZiAoZG9jLm8uZHJvcERhdGFiYXNlKSB7XG4gICAgICAgICAgICBkZWxldGUgdHJpZ2dlci5jb2xsZWN0aW9uO1xuICAgICAgICAgICAgdHJpZ2dlci5kcm9wRGF0YWJhc2UgPSB0cnVlO1xuICAgICAgICAgIH0gZWxzZSBpZiAoXy5oYXMoZG9jLm8sIFwiZHJvcFwiKSkge1xuICAgICAgICAgICAgdHJpZ2dlci5jb2xsZWN0aW9uID0gZG9jLm8uZHJvcDtcbiAgICAgICAgICAgIHRyaWdnZXIuZHJvcENvbGxlY3Rpb24gPSB0cnVlO1xuICAgICAgICAgICAgdHJpZ2dlci5pZCA9IG51bGw7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IEVycm9yKFwiVW5rbm93biBjb21tYW5kIFwiICsgRUpTT04uc3RyaW5naWZ5KGRvYykpO1xuICAgICAgICAgIH1cblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIEFsbCBvdGhlciBvcHMgaGF2ZSBhbiBpZC5cbiAgICAgICAgICB0cmlnZ2VyLmlkID0gaWRGb3JPcChkb2MpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2VsZi5fY3Jvc3NiYXIuZmlyZSh0cmlnZ2VyKTtcbiAgICAgIH1cblxuICAgICAgdHJ5IHtcbiAgICAgICAgd2hpbGUgKCEgc2VsZi5fc3RvcHBlZCAmJlxuICAgICAgICAgICAgICAgISBzZWxmLl9lbnRyeVF1ZXVlLmlzRW1wdHkoKSkge1xuICAgICAgICAgIC8vIEFyZSB3ZSB0b28gZmFyIGJlaGluZD8gSnVzdCB0ZWxsIG91ciBvYnNlcnZlcnMgdGhhdCB0aGV5IG5lZWQgdG9cbiAgICAgICAgICAvLyByZXBvbGwsIGFuZCBkcm9wIG91ciBxdWV1ZS5cbiAgICAgICAgICBpZiAoc2VsZi5fZW50cnlRdWV1ZS5sZW5ndGggPiBUT09fRkFSX0JFSElORCkge1xuICAgICAgICAgICAgdmFyIGxhc3RFbnRyeSA9IHNlbGYuX2VudHJ5UXVldWUucG9wKCk7XG4gICAgICAgICAgICBzZWxmLl9lbnRyeVF1ZXVlLmNsZWFyKCk7XG5cbiAgICAgICAgICAgIHNlbGYuX29uU2tpcHBlZEVudHJpZXNIb29rLmVhY2goZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIEZyZWUgYW55IHdhaXRVbnRpbENhdWdodFVwKCkgY2FsbHMgdGhhdCB3ZXJlIHdhaXRpbmcgZm9yIHVzIHRvXG4gICAgICAgICAgICAvLyBwYXNzIHNvbWV0aGluZyB0aGF0IHdlIGp1c3Qgc2tpcHBlZC5cbiAgICAgICAgICAgIHNlbGYuX3NldExhc3RQcm9jZXNzZWRUUyhsYXN0RW50cnkudHMpO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29uc3QgZG9jID0gc2VsZi5fZW50cnlRdWV1ZS5zaGlmdCgpO1xuXG4gICAgICAgICAgLy8gRmlyZSB0cmlnZ2VyKHMpIGZvciB0aGlzIGRvYy5cbiAgICAgICAgICBoYW5kbGVEb2MoZG9jKTtcblxuICAgICAgICAgIC8vIE5vdyB0aGF0IHdlJ3ZlIHByb2Nlc3NlZCB0aGlzIG9wZXJhdGlvbiwgcHJvY2VzcyBwZW5kaW5nXG4gICAgICAgICAgLy8gc2VxdWVuY2Vycy5cbiAgICAgICAgICBpZiAoZG9jLnRzKSB7XG4gICAgICAgICAgICBzZWxmLl9zZXRMYXN0UHJvY2Vzc2VkVFMoZG9jLnRzKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJvcGxvZyBlbnRyeSB3aXRob3V0IHRzOiBcIiArIEVKU09OLnN0cmluZ2lmeShkb2MpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHNlbGYuX3dvcmtlckFjdGl2ZSA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuXG4gIF9zZXRMYXN0UHJvY2Vzc2VkVFM6IGZ1bmN0aW9uICh0cykge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBzZWxmLl9sYXN0UHJvY2Vzc2VkVFMgPSB0cztcbiAgICB3aGlsZSAoIV8uaXNFbXB0eShzZWxmLl9jYXRjaGluZ1VwRnV0dXJlcykgJiYgc2VsZi5fY2F0Y2hpbmdVcEZ1dHVyZXNbMF0udHMubGVzc1RoYW5PckVxdWFsKHNlbGYuX2xhc3RQcm9jZXNzZWRUUykpIHtcbiAgICAgIHZhciBzZXF1ZW5jZXIgPSBzZWxmLl9jYXRjaGluZ1VwRnV0dXJlcy5zaGlmdCgpO1xuICAgICAgc2VxdWVuY2VyLmZ1dHVyZS5yZXR1cm4oKTtcbiAgICB9XG4gIH0sXG5cbiAgLy9NZXRob2RzIHVzZWQgb24gdGVzdHMgdG8gZGluYW1pY2FsbHkgY2hhbmdlIFRPT19GQVJfQkVISU5EXG4gIF9kZWZpbmVUb29GYXJCZWhpbmQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgVE9PX0ZBUl9CRUhJTkQgPSB2YWx1ZTtcbiAgfSxcbiAgX3Jlc2V0VG9vRmFyQmVoaW5kOiBmdW5jdGlvbigpIHtcbiAgICBUT09fRkFSX0JFSElORCA9IHByb2Nlc3MuZW52Lk1FVEVPUl9PUExPR19UT09fRkFSX0JFSElORCB8fCAyMDAwO1xuICB9XG59KTtcbiIsInZhciBGdXR1cmUgPSBOcG0ucmVxdWlyZSgnZmliZXJzL2Z1dHVyZScpO1xuXG5PYnNlcnZlTXVsdGlwbGV4ZXIgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgaWYgKCFvcHRpb25zIHx8ICFfLmhhcyhvcHRpb25zLCAnb3JkZXJlZCcpKVxuICAgIHRocm93IEVycm9yKFwibXVzdCBzcGVjaWZpZWQgb3JkZXJlZFwiKTtcblxuICBQYWNrYWdlWydmYWN0cy1iYXNlJ10gJiYgUGFja2FnZVsnZmFjdHMtYmFzZSddLkZhY3RzLmluY3JlbWVudFNlcnZlckZhY3QoXG4gICAgXCJtb25nby1saXZlZGF0YVwiLCBcIm9ic2VydmUtbXVsdGlwbGV4ZXJzXCIsIDEpO1xuXG4gIHNlbGYuX29yZGVyZWQgPSBvcHRpb25zLm9yZGVyZWQ7XG4gIHNlbGYuX29uU3RvcCA9IG9wdGlvbnMub25TdG9wIHx8IGZ1bmN0aW9uICgpIHt9O1xuICBzZWxmLl9xdWV1ZSA9IG5ldyBNZXRlb3IuX1N5bmNocm9ub3VzUXVldWUoKTtcbiAgc2VsZi5faGFuZGxlcyA9IHt9O1xuICBzZWxmLl9yZWFkeUZ1dHVyZSA9IG5ldyBGdXR1cmU7XG4gIHNlbGYuX2NhY2hlID0gbmV3IExvY2FsQ29sbGVjdGlvbi5fQ2FjaGluZ0NoYW5nZU9ic2VydmVyKHtcbiAgICBvcmRlcmVkOiBvcHRpb25zLm9yZGVyZWR9KTtcbiAgLy8gTnVtYmVyIG9mIGFkZEhhbmRsZUFuZFNlbmRJbml0aWFsQWRkcyB0YXNrcyBzY2hlZHVsZWQgYnV0IG5vdCB5ZXRcbiAgLy8gcnVubmluZy4gcmVtb3ZlSGFuZGxlIHVzZXMgdGhpcyB0byBrbm93IGlmIGl0J3MgdGltZSB0byBjYWxsIHRoZSBvblN0b3BcbiAgLy8gY2FsbGJhY2suXG4gIHNlbGYuX2FkZEhhbmRsZVRhc2tzU2NoZWR1bGVkQnV0Tm90UGVyZm9ybWVkID0gMDtcblxuICBfLmVhY2goc2VsZi5jYWxsYmFja05hbWVzKCksIGZ1bmN0aW9uIChjYWxsYmFja05hbWUpIHtcbiAgICBzZWxmW2NhbGxiYWNrTmFtZV0gPSBmdW5jdGlvbiAoLyogLi4uICovKSB7XG4gICAgICBzZWxmLl9hcHBseUNhbGxiYWNrKGNhbGxiYWNrTmFtZSwgXy50b0FycmF5KGFyZ3VtZW50cykpO1xuICAgIH07XG4gIH0pO1xufTtcblxuXy5leHRlbmQoT2JzZXJ2ZU11bHRpcGxleGVyLnByb3RvdHlwZSwge1xuICBhZGRIYW5kbGVBbmRTZW5kSW5pdGlhbEFkZHM6IGZ1bmN0aW9uIChoYW5kbGUpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAvLyBDaGVjayB0aGlzIGJlZm9yZSBjYWxsaW5nIHJ1blRhc2sgKGV2ZW4gdGhvdWdoIHJ1blRhc2sgZG9lcyB0aGUgc2FtZVxuICAgIC8vIGNoZWNrKSBzbyB0aGF0IHdlIGRvbid0IGxlYWsgYW4gT2JzZXJ2ZU11bHRpcGxleGVyIG9uIGVycm9yIGJ5XG4gICAgLy8gaW5jcmVtZW50aW5nIF9hZGRIYW5kbGVUYXNrc1NjaGVkdWxlZEJ1dE5vdFBlcmZvcm1lZCBhbmQgbmV2ZXJcbiAgICAvLyBkZWNyZW1lbnRpbmcgaXQuXG4gICAgaWYgKCFzZWxmLl9xdWV1ZS5zYWZlVG9SdW5UYXNrKCkpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW4ndCBjYWxsIG9ic2VydmVDaGFuZ2VzIGZyb20gYW4gb2JzZXJ2ZSBjYWxsYmFjayBvbiB0aGUgc2FtZSBxdWVyeVwiKTtcbiAgICArK3NlbGYuX2FkZEhhbmRsZVRhc2tzU2NoZWR1bGVkQnV0Tm90UGVyZm9ybWVkO1xuXG4gICAgUGFja2FnZVsnZmFjdHMtYmFzZSddICYmIFBhY2thZ2VbJ2ZhY3RzLWJhc2UnXS5GYWN0cy5pbmNyZW1lbnRTZXJ2ZXJGYWN0KFxuICAgICAgXCJtb25nby1saXZlZGF0YVwiLCBcIm9ic2VydmUtaGFuZGxlc1wiLCAxKTtcblxuICAgIHNlbGYuX3F1ZXVlLnJ1blRhc2soZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi5faGFuZGxlc1toYW5kbGUuX2lkXSA9IGhhbmRsZTtcbiAgICAgIC8vIFNlbmQgb3V0IHdoYXRldmVyIGFkZHMgd2UgaGF2ZSBzbyBmYXIgKHdoZXRoZXIgb3Igbm90IHdlIHRoZVxuICAgICAgLy8gbXVsdGlwbGV4ZXIgaXMgcmVhZHkpLlxuICAgICAgc2VsZi5fc2VuZEFkZHMoaGFuZGxlKTtcbiAgICAgIC0tc2VsZi5fYWRkSGFuZGxlVGFza3NTY2hlZHVsZWRCdXROb3RQZXJmb3JtZWQ7XG4gICAgfSk7XG4gICAgLy8gKm91dHNpZGUqIHRoZSB0YXNrLCBzaW5jZSBvdGhlcndpc2Ugd2UnZCBkZWFkbG9ja1xuICAgIHNlbGYuX3JlYWR5RnV0dXJlLndhaXQoKTtcbiAgfSxcblxuICAvLyBSZW1vdmUgYW4gb2JzZXJ2ZSBoYW5kbGUuIElmIGl0IHdhcyB0aGUgbGFzdCBvYnNlcnZlIGhhbmRsZSwgY2FsbCB0aGVcbiAgLy8gb25TdG9wIGNhbGxiYWNrOyB5b3UgY2Fubm90IGFkZCBhbnkgbW9yZSBvYnNlcnZlIGhhbmRsZXMgYWZ0ZXIgdGhpcy5cbiAgLy9cbiAgLy8gVGhpcyBpcyBub3Qgc3luY2hyb25pemVkIHdpdGggcG9sbHMgYW5kIGhhbmRsZSBhZGRpdGlvbnM6IHRoaXMgbWVhbnMgdGhhdFxuICAvLyB5b3UgY2FuIHNhZmVseSBjYWxsIGl0IGZyb20gd2l0aGluIGFuIG9ic2VydmUgY2FsbGJhY2ssIGJ1dCBpdCBhbHNvIG1lYW5zXG4gIC8vIHRoYXQgd2UgaGF2ZSB0byBiZSBjYXJlZnVsIHdoZW4gd2UgaXRlcmF0ZSBvdmVyIF9oYW5kbGVzLlxuICByZW1vdmVIYW5kbGU6IGZ1bmN0aW9uIChpZCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIC8vIFRoaXMgc2hvdWxkIG5vdCBiZSBwb3NzaWJsZTogeW91IGNhbiBvbmx5IGNhbGwgcmVtb3ZlSGFuZGxlIGJ5IGhhdmluZ1xuICAgIC8vIGFjY2VzcyB0byB0aGUgT2JzZXJ2ZUhhbmRsZSwgd2hpY2ggaXNuJ3QgcmV0dXJuZWQgdG8gdXNlciBjb2RlIHVudGlsIHRoZVxuICAgIC8vIG11bHRpcGxleCBpcyByZWFkeS5cbiAgICBpZiAoIXNlbGYuX3JlYWR5KCkpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW4ndCByZW1vdmUgaGFuZGxlcyB1bnRpbCB0aGUgbXVsdGlwbGV4IGlzIHJlYWR5XCIpO1xuXG4gICAgZGVsZXRlIHNlbGYuX2hhbmRsZXNbaWRdO1xuXG4gICAgUGFja2FnZVsnZmFjdHMtYmFzZSddICYmIFBhY2thZ2VbJ2ZhY3RzLWJhc2UnXS5GYWN0cy5pbmNyZW1lbnRTZXJ2ZXJGYWN0KFxuICAgICAgXCJtb25nby1saXZlZGF0YVwiLCBcIm9ic2VydmUtaGFuZGxlc1wiLCAtMSk7XG5cbiAgICBpZiAoXy5pc0VtcHR5KHNlbGYuX2hhbmRsZXMpICYmXG4gICAgICAgIHNlbGYuX2FkZEhhbmRsZVRhc2tzU2NoZWR1bGVkQnV0Tm90UGVyZm9ybWVkID09PSAwKSB7XG4gICAgICBzZWxmLl9zdG9wKCk7XG4gICAgfVxuICB9LFxuICBfc3RvcDogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICAvLyBJdCBzaG91bGRuJ3QgYmUgcG9zc2libGUgZm9yIHVzIHRvIHN0b3Agd2hlbiBhbGwgb3VyIGhhbmRsZXMgc3RpbGxcbiAgICAvLyBoYXZlbid0IGJlZW4gcmV0dXJuZWQgZnJvbSBvYnNlcnZlQ2hhbmdlcyFcbiAgICBpZiAoISBzZWxmLl9yZWFkeSgpICYmICEgb3B0aW9ucy5mcm9tUXVlcnlFcnJvcilcbiAgICAgIHRocm93IEVycm9yKFwic3VycHJpc2luZyBfc3RvcDogbm90IHJlYWR5XCIpO1xuXG4gICAgLy8gQ2FsbCBzdG9wIGNhbGxiYWNrICh3aGljaCBraWxscyB0aGUgdW5kZXJseWluZyBwcm9jZXNzIHdoaWNoIHNlbmRzIHVzXG4gICAgLy8gY2FsbGJhY2tzIGFuZCByZW1vdmVzIHVzIGZyb20gdGhlIGNvbm5lY3Rpb24ncyBkaWN0aW9uYXJ5KS5cbiAgICBzZWxmLl9vblN0b3AoKTtcbiAgICBQYWNrYWdlWydmYWN0cy1iYXNlJ10gJiYgUGFja2FnZVsnZmFjdHMtYmFzZSddLkZhY3RzLmluY3JlbWVudFNlcnZlckZhY3QoXG4gICAgICBcIm1vbmdvLWxpdmVkYXRhXCIsIFwib2JzZXJ2ZS1tdWx0aXBsZXhlcnNcIiwgLTEpO1xuXG4gICAgLy8gQ2F1c2UgZnV0dXJlIGFkZEhhbmRsZUFuZFNlbmRJbml0aWFsQWRkcyBjYWxscyB0byB0aHJvdyAoYnV0IHRoZSBvblN0b3BcbiAgICAvLyBjYWxsYmFjayBzaG91bGQgbWFrZSBvdXIgY29ubmVjdGlvbiBmb3JnZXQgYWJvdXQgdXMpLlxuICAgIHNlbGYuX2hhbmRsZXMgPSBudWxsO1xuICB9LFxuXG4gIC8vIEFsbG93cyBhbGwgYWRkSGFuZGxlQW5kU2VuZEluaXRpYWxBZGRzIGNhbGxzIHRvIHJldHVybiwgb25jZSBhbGwgcHJlY2VkaW5nXG4gIC8vIGFkZHMgaGF2ZSBiZWVuIHByb2Nlc3NlZC4gRG9lcyBub3QgYmxvY2suXG4gIHJlYWR5OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHNlbGYuX3F1ZXVlLnF1ZXVlVGFzayhmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoc2VsZi5fcmVhZHkoKSlcbiAgICAgICAgdGhyb3cgRXJyb3IoXCJjYW4ndCBtYWtlIE9ic2VydmVNdWx0aXBsZXggcmVhZHkgdHdpY2UhXCIpO1xuICAgICAgc2VsZi5fcmVhZHlGdXR1cmUucmV0dXJuKCk7XG4gICAgfSk7XG4gIH0sXG5cbiAgLy8gSWYgdHJ5aW5nIHRvIGV4ZWN1dGUgdGhlIHF1ZXJ5IHJlc3VsdHMgaW4gYW4gZXJyb3IsIGNhbGwgdGhpcy4gVGhpcyBpc1xuICAvLyBpbnRlbmRlZCBmb3IgcGVybWFuZW50IGVycm9ycywgbm90IHRyYW5zaWVudCBuZXR3b3JrIGVycm9ycyB0aGF0IGNvdWxkIGJlXG4gIC8vIGZpeGVkLiBJdCBzaG91bGQgb25seSBiZSBjYWxsZWQgYmVmb3JlIHJlYWR5KCksIGJlY2F1c2UgaWYgeW91IGNhbGxlZCByZWFkeVxuICAvLyB0aGF0IG1lYW50IHRoYXQgeW91IG1hbmFnZWQgdG8gcnVuIHRoZSBxdWVyeSBvbmNlLiBJdCB3aWxsIHN0b3AgdGhpc1xuICAvLyBPYnNlcnZlTXVsdGlwbGV4IGFuZCBjYXVzZSBhZGRIYW5kbGVBbmRTZW5kSW5pdGlhbEFkZHMgY2FsbHMgKGFuZCB0aHVzXG4gIC8vIG9ic2VydmVDaGFuZ2VzIGNhbGxzKSB0byB0aHJvdyB0aGUgZXJyb3IuXG4gIHF1ZXJ5RXJyb3I6IGZ1bmN0aW9uIChlcnIpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgc2VsZi5fcXVldWUucnVuVGFzayhmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoc2VsZi5fcmVhZHkoKSlcbiAgICAgICAgdGhyb3cgRXJyb3IoXCJjYW4ndCBjbGFpbSBxdWVyeSBoYXMgYW4gZXJyb3IgYWZ0ZXIgaXQgd29ya2VkIVwiKTtcbiAgICAgIHNlbGYuX3N0b3Aoe2Zyb21RdWVyeUVycm9yOiB0cnVlfSk7XG4gICAgICBzZWxmLl9yZWFkeUZ1dHVyZS50aHJvdyhlcnIpO1xuICAgIH0pO1xuICB9LFxuXG4gIC8vIENhbGxzIFwiY2JcIiBvbmNlIHRoZSBlZmZlY3RzIG9mIGFsbCBcInJlYWR5XCIsIFwiYWRkSGFuZGxlQW5kU2VuZEluaXRpYWxBZGRzXCJcbiAgLy8gYW5kIG9ic2VydmUgY2FsbGJhY2tzIHdoaWNoIGNhbWUgYmVmb3JlIHRoaXMgY2FsbCBoYXZlIGJlZW4gcHJvcGFnYXRlZCB0b1xuICAvLyBhbGwgaGFuZGxlcy4gXCJyZWFkeVwiIG11c3QgaGF2ZSBhbHJlYWR5IGJlZW4gY2FsbGVkIG9uIHRoaXMgbXVsdGlwbGV4ZXIuXG4gIG9uRmx1c2g6IGZ1bmN0aW9uIChjYikge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBzZWxmLl9xdWV1ZS5xdWV1ZVRhc2soZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCFzZWxmLl9yZWFkeSgpKVxuICAgICAgICB0aHJvdyBFcnJvcihcIm9ubHkgY2FsbCBvbkZsdXNoIG9uIGEgbXVsdGlwbGV4ZXIgdGhhdCB3aWxsIGJlIHJlYWR5XCIpO1xuICAgICAgY2IoKTtcbiAgICB9KTtcbiAgfSxcbiAgY2FsbGJhY2tOYW1lczogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBpZiAoc2VsZi5fb3JkZXJlZClcbiAgICAgIHJldHVybiBbXCJhZGRlZEJlZm9yZVwiLCBcImNoYW5nZWRcIiwgXCJtb3ZlZEJlZm9yZVwiLCBcInJlbW92ZWRcIl07XG4gICAgZWxzZVxuICAgICAgcmV0dXJuIFtcImFkZGVkXCIsIFwiY2hhbmdlZFwiLCBcInJlbW92ZWRcIl07XG4gIH0sXG4gIF9yZWFkeTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl9yZWFkeUZ1dHVyZS5pc1Jlc29sdmVkKCk7XG4gIH0sXG4gIF9hcHBseUNhbGxiYWNrOiBmdW5jdGlvbiAoY2FsbGJhY2tOYW1lLCBhcmdzKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHNlbGYuX3F1ZXVlLnF1ZXVlVGFzayhmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBJZiB3ZSBzdG9wcGVkIGluIHRoZSBtZWFudGltZSwgZG8gbm90aGluZy5cbiAgICAgIGlmICghc2VsZi5faGFuZGxlcylcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICAvLyBGaXJzdCwgYXBwbHkgdGhlIGNoYW5nZSB0byB0aGUgY2FjaGUuXG4gICAgICAvLyBYWFggV2UgY291bGQgbWFrZSBhcHBseUNoYW5nZSBjYWxsYmFja3MgcHJvbWlzZSBub3QgdG8gaGFuZyBvbiB0byBhbnlcbiAgICAgIC8vIHN0YXRlIGZyb20gdGhlaXIgYXJndW1lbnRzIChhc3N1bWluZyB0aGF0IHRoZWlyIHN1cHBsaWVkIGNhbGxiYWNrc1xuICAgICAgLy8gZG9uJ3QpIGFuZCBza2lwIHRoaXMgY2xvbmUuIEN1cnJlbnRseSAnY2hhbmdlZCcgaGFuZ3Mgb24gdG8gc3RhdGVcbiAgICAgIC8vIHRob3VnaC5cbiAgICAgIHNlbGYuX2NhY2hlLmFwcGx5Q2hhbmdlW2NhbGxiYWNrTmFtZV0uYXBwbHkobnVsbCwgRUpTT04uY2xvbmUoYXJncykpO1xuXG4gICAgICAvLyBJZiB3ZSBoYXZlbid0IGZpbmlzaGVkIHRoZSBpbml0aWFsIGFkZHMsIHRoZW4gd2Ugc2hvdWxkIG9ubHkgYmUgZ2V0dGluZ1xuICAgICAgLy8gYWRkcy5cbiAgICAgIGlmICghc2VsZi5fcmVhZHkoKSAmJlxuICAgICAgICAgIChjYWxsYmFja05hbWUgIT09ICdhZGRlZCcgJiYgY2FsbGJhY2tOYW1lICE9PSAnYWRkZWRCZWZvcmUnKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHb3QgXCIgKyBjYWxsYmFja05hbWUgKyBcIiBkdXJpbmcgaW5pdGlhbCBhZGRzXCIpO1xuICAgICAgfVxuXG4gICAgICAvLyBOb3cgbXVsdGlwbGV4IHRoZSBjYWxsYmFja3Mgb3V0IHRvIGFsbCBvYnNlcnZlIGhhbmRsZXMuIEl0J3MgT0sgaWZcbiAgICAgIC8vIHRoZXNlIGNhbGxzIHlpZWxkOyBzaW5jZSB3ZSdyZSBpbnNpZGUgYSB0YXNrLCBubyBvdGhlciB1c2Ugb2Ygb3VyIHF1ZXVlXG4gICAgICAvLyBjYW4gY29udGludWUgdW50aWwgdGhlc2UgYXJlIGRvbmUuIChCdXQgd2UgZG8gaGF2ZSB0byBiZSBjYXJlZnVsIHRvIG5vdFxuICAgICAgLy8gdXNlIGEgaGFuZGxlIHRoYXQgZ290IHJlbW92ZWQsIGJlY2F1c2UgcmVtb3ZlSGFuZGxlIGRvZXMgbm90IHVzZSB0aGVcbiAgICAgIC8vIHF1ZXVlOyB0aHVzLCB3ZSBpdGVyYXRlIG92ZXIgYW4gYXJyYXkgb2Yga2V5cyB0aGF0IHdlIGNvbnRyb2wuKVxuICAgICAgXy5lYWNoKF8ua2V5cyhzZWxmLl9oYW5kbGVzKSwgZnVuY3Rpb24gKGhhbmRsZUlkKSB7XG4gICAgICAgIHZhciBoYW5kbGUgPSBzZWxmLl9oYW5kbGVzICYmIHNlbGYuX2hhbmRsZXNbaGFuZGxlSWRdO1xuICAgICAgICBpZiAoIWhhbmRsZSlcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIHZhciBjYWxsYmFjayA9IGhhbmRsZVsnXycgKyBjYWxsYmFja05hbWVdO1xuICAgICAgICAvLyBjbG9uZSBhcmd1bWVudHMgc28gdGhhdCBjYWxsYmFja3MgY2FuIG11dGF0ZSB0aGVpciBhcmd1bWVudHNcbiAgICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2suYXBwbHkobnVsbCwgRUpTT04uY2xvbmUoYXJncykpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0sXG5cbiAgLy8gU2VuZHMgaW5pdGlhbCBhZGRzIHRvIGEgaGFuZGxlLiBJdCBzaG91bGQgb25seSBiZSBjYWxsZWQgZnJvbSB3aXRoaW4gYSB0YXNrXG4gIC8vICh0aGUgdGFzayB0aGF0IGlzIHByb2Nlc3NpbmcgdGhlIGFkZEhhbmRsZUFuZFNlbmRJbml0aWFsQWRkcyBjYWxsKS4gSXRcbiAgLy8gc3luY2hyb25vdXNseSBpbnZva2VzIHRoZSBoYW5kbGUncyBhZGRlZCBvciBhZGRlZEJlZm9yZTsgdGhlcmUncyBubyBuZWVkIHRvXG4gIC8vIGZsdXNoIHRoZSBxdWV1ZSBhZnRlcndhcmRzIHRvIGVuc3VyZSB0aGF0IHRoZSBjYWxsYmFja3MgZ2V0IG91dC5cbiAgX3NlbmRBZGRzOiBmdW5jdGlvbiAoaGFuZGxlKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIGlmIChzZWxmLl9xdWV1ZS5zYWZlVG9SdW5UYXNrKCkpXG4gICAgICB0aHJvdyBFcnJvcihcIl9zZW5kQWRkcyBtYXkgb25seSBiZSBjYWxsZWQgZnJvbSB3aXRoaW4gYSB0YXNrIVwiKTtcbiAgICB2YXIgYWRkID0gc2VsZi5fb3JkZXJlZCA/IGhhbmRsZS5fYWRkZWRCZWZvcmUgOiBoYW5kbGUuX2FkZGVkO1xuICAgIGlmICghYWRkKVxuICAgICAgcmV0dXJuO1xuICAgIC8vIG5vdGU6IGRvY3MgbWF5IGJlIGFuIF9JZE1hcCBvciBhbiBPcmRlcmVkRGljdFxuICAgIHNlbGYuX2NhY2hlLmRvY3MuZm9yRWFjaChmdW5jdGlvbiAoZG9jLCBpZCkge1xuICAgICAgaWYgKCFfLmhhcyhzZWxmLl9oYW5kbGVzLCBoYW5kbGUuX2lkKSlcbiAgICAgICAgdGhyb3cgRXJyb3IoXCJoYW5kbGUgZ290IHJlbW92ZWQgYmVmb3JlIHNlbmRpbmcgaW5pdGlhbCBhZGRzIVwiKTtcbiAgICAgIHZhciBmaWVsZHMgPSBFSlNPTi5jbG9uZShkb2MpO1xuICAgICAgZGVsZXRlIGZpZWxkcy5faWQ7XG4gICAgICBpZiAoc2VsZi5fb3JkZXJlZClcbiAgICAgICAgYWRkKGlkLCBmaWVsZHMsIG51bGwpOyAvLyB3ZSdyZSBnb2luZyBpbiBvcmRlciwgc28gYWRkIGF0IGVuZFxuICAgICAgZWxzZVxuICAgICAgICBhZGQoaWQsIGZpZWxkcyk7XG4gICAgfSk7XG4gIH1cbn0pO1xuXG5cbnZhciBuZXh0T2JzZXJ2ZUhhbmRsZUlkID0gMTtcbk9ic2VydmVIYW5kbGUgPSBmdW5jdGlvbiAobXVsdGlwbGV4ZXIsIGNhbGxiYWNrcykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIC8vIFRoZSBlbmQgdXNlciBpcyBvbmx5IHN1cHBvc2VkIHRvIGNhbGwgc3RvcCgpLiAgVGhlIG90aGVyIGZpZWxkcyBhcmVcbiAgLy8gYWNjZXNzaWJsZSB0byB0aGUgbXVsdGlwbGV4ZXIsIHRob3VnaC5cbiAgc2VsZi5fbXVsdGlwbGV4ZXIgPSBtdWx0aXBsZXhlcjtcbiAgXy5lYWNoKG11bHRpcGxleGVyLmNhbGxiYWNrTmFtZXMoKSwgZnVuY3Rpb24gKG5hbWUpIHtcbiAgICBpZiAoY2FsbGJhY2tzW25hbWVdKSB7XG4gICAgICBzZWxmWydfJyArIG5hbWVdID0gY2FsbGJhY2tzW25hbWVdO1xuICAgIH0gZWxzZSBpZiAobmFtZSA9PT0gXCJhZGRlZEJlZm9yZVwiICYmIGNhbGxiYWNrcy5hZGRlZCkge1xuICAgICAgLy8gU3BlY2lhbCBjYXNlOiBpZiB5b3Ugc3BlY2lmeSBcImFkZGVkXCIgYW5kIFwibW92ZWRCZWZvcmVcIiwgeW91IGdldCBhblxuICAgICAgLy8gb3JkZXJlZCBvYnNlcnZlIHdoZXJlIGZvciBzb21lIHJlYXNvbiB5b3UgZG9uJ3QgZ2V0IG9yZGVyaW5nIGRhdGEgb25cbiAgICAgIC8vIHRoZSBhZGRzLiAgSSBkdW5ubywgd2Ugd3JvdGUgdGVzdHMgZm9yIGl0LCB0aGVyZSBtdXN0IGhhdmUgYmVlbiBhXG4gICAgICAvLyByZWFzb24uXG4gICAgICBzZWxmLl9hZGRlZEJlZm9yZSA9IGZ1bmN0aW9uIChpZCwgZmllbGRzLCBiZWZvcmUpIHtcbiAgICAgICAgY2FsbGJhY2tzLmFkZGVkKGlkLCBmaWVsZHMpO1xuICAgICAgfTtcbiAgICB9XG4gIH0pO1xuICBzZWxmLl9zdG9wcGVkID0gZmFsc2U7XG4gIHNlbGYuX2lkID0gbmV4dE9ic2VydmVIYW5kbGVJZCsrO1xufTtcbk9ic2VydmVIYW5kbGUucHJvdG90eXBlLnN0b3AgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgaWYgKHNlbGYuX3N0b3BwZWQpXG4gICAgcmV0dXJuO1xuICBzZWxmLl9zdG9wcGVkID0gdHJ1ZTtcbiAgc2VsZi5fbXVsdGlwbGV4ZXIucmVtb3ZlSGFuZGxlKHNlbGYuX2lkKTtcbn07XG4iLCJ2YXIgRmliZXIgPSBOcG0ucmVxdWlyZSgnZmliZXJzJyk7XG5cbmV4cG9ydCBjbGFzcyBEb2NGZXRjaGVyIHtcbiAgY29uc3RydWN0b3IobW9uZ29Db25uZWN0aW9uKSB7XG4gICAgdGhpcy5fbW9uZ29Db25uZWN0aW9uID0gbW9uZ29Db25uZWN0aW9uO1xuICAgIC8vIE1hcCBmcm9tIG9wIC0+IFtjYWxsYmFja11cbiAgICB0aGlzLl9jYWxsYmFja3NGb3JPcCA9IG5ldyBNYXA7XG4gIH1cblxuICAvLyBGZXRjaGVzIGRvY3VtZW50IFwiaWRcIiBmcm9tIGNvbGxlY3Rpb25OYW1lLCByZXR1cm5pbmcgaXQgb3IgbnVsbCBpZiBub3RcbiAgLy8gZm91bmQuXG4gIC8vXG4gIC8vIElmIHlvdSBtYWtlIG11bHRpcGxlIGNhbGxzIHRvIGZldGNoKCkgd2l0aCB0aGUgc2FtZSBvcCByZWZlcmVuY2UsXG4gIC8vIERvY0ZldGNoZXIgbWF5IGFzc3VtZSB0aGF0IHRoZXkgYWxsIHJldHVybiB0aGUgc2FtZSBkb2N1bWVudC4gKEl0IGRvZXNcbiAgLy8gbm90IGNoZWNrIHRvIHNlZSBpZiBjb2xsZWN0aW9uTmFtZS9pZCBtYXRjaC4pXG4gIC8vXG4gIC8vIFlvdSBtYXkgYXNzdW1lIHRoYXQgY2FsbGJhY2sgaXMgbmV2ZXIgY2FsbGVkIHN5bmNocm9ub3VzbHkgKGFuZCBpbiBmYWN0XG4gIC8vIE9wbG9nT2JzZXJ2ZURyaXZlciBkb2VzIHNvKS5cbiAgZmV0Y2goY29sbGVjdGlvbk5hbWUsIGlkLCBvcCwgY2FsbGJhY2spIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGNoZWNrKGNvbGxlY3Rpb25OYW1lLCBTdHJpbmcpO1xuICAgIGNoZWNrKG9wLCBPYmplY3QpO1xuXG4gICAgLy8gSWYgdGhlcmUncyBhbHJlYWR5IGFuIGluLXByb2dyZXNzIGZldGNoIGZvciB0aGlzIGNhY2hlIGtleSwgeWllbGQgdW50aWxcbiAgICAvLyBpdCdzIGRvbmUgYW5kIHJldHVybiB3aGF0ZXZlciBpdCByZXR1cm5zLlxuICAgIGlmIChzZWxmLl9jYWxsYmFja3NGb3JPcC5oYXMob3ApKSB7XG4gICAgICBzZWxmLl9jYWxsYmFja3NGb3JPcC5nZXQob3ApLnB1c2goY2FsbGJhY2spO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGNhbGxiYWNrcyA9IFtjYWxsYmFja107XG4gICAgc2VsZi5fY2FsbGJhY2tzRm9yT3Auc2V0KG9wLCBjYWxsYmFja3MpO1xuXG4gICAgRmliZXIoZnVuY3Rpb24gKCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdmFyIGRvYyA9IHNlbGYuX21vbmdvQ29ubmVjdGlvbi5maW5kT25lKFxuICAgICAgICAgIGNvbGxlY3Rpb25OYW1lLCB7X2lkOiBpZH0pIHx8IG51bGw7XG4gICAgICAgIC8vIFJldHVybiBkb2MgdG8gYWxsIHJlbGV2YW50IGNhbGxiYWNrcy4gTm90ZSB0aGF0IHRoaXMgYXJyYXkgY2FuXG4gICAgICAgIC8vIGNvbnRpbnVlIHRvIGdyb3cgZHVyaW5nIGNhbGxiYWNrIGV4Y2VjdXRpb24uXG4gICAgICAgIHdoaWxlIChjYWxsYmFja3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgIC8vIENsb25lIHRoZSBkb2N1bWVudCBzbyB0aGF0IHRoZSB2YXJpb3VzIGNhbGxzIHRvIGZldGNoIGRvbid0IHJldHVyblxuICAgICAgICAgIC8vIG9iamVjdHMgdGhhdCBhcmUgaW50ZXJ0d2luZ2xlZCB3aXRoIGVhY2ggb3RoZXIuIENsb25lIGJlZm9yZVxuICAgICAgICAgIC8vIHBvcHBpbmcgdGhlIGZ1dHVyZSwgc28gdGhhdCBpZiBjbG9uZSB0aHJvd3MsIHRoZSBlcnJvciBnZXRzIHBhc3NlZFxuICAgICAgICAgIC8vIHRvIHRoZSBuZXh0IGNhbGxiYWNrLlxuICAgICAgICAgIGNhbGxiYWNrcy5wb3AoKShudWxsLCBFSlNPTi5jbG9uZShkb2MpKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB3aGlsZSAoY2FsbGJhY2tzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBjYWxsYmFja3MucG9wKCkoZSk7XG4gICAgICAgIH1cbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIC8vIFhYWCBjb25zaWRlciBrZWVwaW5nIHRoZSBkb2MgYXJvdW5kIGZvciBhIHBlcmlvZCBvZiB0aW1lIGJlZm9yZVxuICAgICAgICAvLyByZW1vdmluZyBmcm9tIHRoZSBjYWNoZVxuICAgICAgICBzZWxmLl9jYWxsYmFja3NGb3JPcC5kZWxldGUob3ApO1xuICAgICAgfVxuICAgIH0pLnJ1bigpO1xuICB9XG59XG4iLCJ2YXIgUE9MTElOR19USFJPVFRMRV9NUyA9ICtwcm9jZXNzLmVudi5NRVRFT1JfUE9MTElOR19USFJPVFRMRV9NUyB8fCA1MDtcbnZhciBQT0xMSU5HX0lOVEVSVkFMX01TID0gK3Byb2Nlc3MuZW52Lk1FVEVPUl9QT0xMSU5HX0lOVEVSVkFMX01TIHx8IDEwICogMTAwMDtcblxuUG9sbGluZ09ic2VydmVEcml2ZXIgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgc2VsZi5fY3Vyc29yRGVzY3JpcHRpb24gPSBvcHRpb25zLmN1cnNvckRlc2NyaXB0aW9uO1xuICBzZWxmLl9tb25nb0hhbmRsZSA9IG9wdGlvbnMubW9uZ29IYW5kbGU7XG4gIHNlbGYuX29yZGVyZWQgPSBvcHRpb25zLm9yZGVyZWQ7XG4gIHNlbGYuX211bHRpcGxleGVyID0gb3B0aW9ucy5tdWx0aXBsZXhlcjtcbiAgc2VsZi5fc3RvcENhbGxiYWNrcyA9IFtdO1xuICBzZWxmLl9zdG9wcGVkID0gZmFsc2U7XG5cbiAgc2VsZi5fc3luY2hyb25vdXNDdXJzb3IgPSBzZWxmLl9tb25nb0hhbmRsZS5fY3JlYXRlU3luY2hyb25vdXNDdXJzb3IoXG4gICAgc2VsZi5fY3Vyc29yRGVzY3JpcHRpb24pO1xuXG4gIC8vIHByZXZpb3VzIHJlc3VsdHMgc25hcHNob3QuICBvbiBlYWNoIHBvbGwgY3ljbGUsIGRpZmZzIGFnYWluc3RcbiAgLy8gcmVzdWx0cyBkcml2ZXMgdGhlIGNhbGxiYWNrcy5cbiAgc2VsZi5fcmVzdWx0cyA9IG51bGw7XG5cbiAgLy8gVGhlIG51bWJlciBvZiBfcG9sbE1vbmdvIGNhbGxzIHRoYXQgaGF2ZSBiZWVuIGFkZGVkIHRvIHNlbGYuX3Rhc2tRdWV1ZSBidXRcbiAgLy8gaGF2ZSBub3Qgc3RhcnRlZCBydW5uaW5nLiBVc2VkIHRvIG1ha2Ugc3VyZSB3ZSBuZXZlciBzY2hlZHVsZSBtb3JlIHRoYW4gb25lXG4gIC8vIF9wb2xsTW9uZ28gKG90aGVyIHRoYW4gcG9zc2libHkgdGhlIG9uZSB0aGF0IGlzIGN1cnJlbnRseSBydW5uaW5nKS4gSXQnc1xuICAvLyBhbHNvIHVzZWQgYnkgX3N1c3BlbmRQb2xsaW5nIHRvIHByZXRlbmQgdGhlcmUncyBhIHBvbGwgc2NoZWR1bGVkLiBVc3VhbGx5LFxuICAvLyBpdCdzIGVpdGhlciAwIChmb3IgXCJubyBwb2xscyBzY2hlZHVsZWQgb3RoZXIgdGhhbiBtYXliZSBvbmUgY3VycmVudGx5XG4gIC8vIHJ1bm5pbmdcIikgb3IgMSAoZm9yIFwiYSBwb2xsIHNjaGVkdWxlZCB0aGF0IGlzbid0IHJ1bm5pbmcgeWV0XCIpLCBidXQgaXQgY2FuXG4gIC8vIGFsc28gYmUgMiBpZiBpbmNyZW1lbnRlZCBieSBfc3VzcGVuZFBvbGxpbmcuXG4gIHNlbGYuX3BvbGxzU2NoZWR1bGVkQnV0Tm90U3RhcnRlZCA9IDA7XG4gIHNlbGYuX3BlbmRpbmdXcml0ZXMgPSBbXTsgLy8gcGVvcGxlIHRvIG5vdGlmeSB3aGVuIHBvbGxpbmcgY29tcGxldGVzXG5cbiAgLy8gTWFrZSBzdXJlIHRvIGNyZWF0ZSBhIHNlcGFyYXRlbHkgdGhyb3R0bGVkIGZ1bmN0aW9uIGZvciBlYWNoXG4gIC8vIFBvbGxpbmdPYnNlcnZlRHJpdmVyIG9iamVjdC5cbiAgc2VsZi5fZW5zdXJlUG9sbElzU2NoZWR1bGVkID0gXy50aHJvdHRsZShcbiAgICBzZWxmLl91bnRocm90dGxlZEVuc3VyZVBvbGxJc1NjaGVkdWxlZCxcbiAgICBzZWxmLl9jdXJzb3JEZXNjcmlwdGlvbi5vcHRpb25zLnBvbGxpbmdUaHJvdHRsZU1zIHx8IFBPTExJTkdfVEhST1RUTEVfTVMgLyogbXMgKi8pO1xuXG4gIC8vIFhYWCBmaWd1cmUgb3V0IGlmIHdlIHN0aWxsIG5lZWQgYSBxdWV1ZVxuICBzZWxmLl90YXNrUXVldWUgPSBuZXcgTWV0ZW9yLl9TeW5jaHJvbm91c1F1ZXVlKCk7XG5cbiAgdmFyIGxpc3RlbmVyc0hhbmRsZSA9IGxpc3RlbkFsbChcbiAgICBzZWxmLl9jdXJzb3JEZXNjcmlwdGlvbiwgZnVuY3Rpb24gKG5vdGlmaWNhdGlvbikge1xuICAgICAgLy8gV2hlbiBzb21lb25lIGRvZXMgYSB0cmFuc2FjdGlvbiB0aGF0IG1pZ2h0IGFmZmVjdCB1cywgc2NoZWR1bGUgYSBwb2xsXG4gICAgICAvLyBvZiB0aGUgZGF0YWJhc2UuIElmIHRoYXQgdHJhbnNhY3Rpb24gaGFwcGVucyBpbnNpZGUgb2YgYSB3cml0ZSBmZW5jZSxcbiAgICAgIC8vIGJsb2NrIHRoZSBmZW5jZSB1bnRpbCB3ZSd2ZSBwb2xsZWQgYW5kIG5vdGlmaWVkIG9ic2VydmVycy5cbiAgICAgIHZhciBmZW5jZSA9IEREUFNlcnZlci5fQ3VycmVudFdyaXRlRmVuY2UuZ2V0KCk7XG4gICAgICBpZiAoZmVuY2UpXG4gICAgICAgIHNlbGYuX3BlbmRpbmdXcml0ZXMucHVzaChmZW5jZS5iZWdpbldyaXRlKCkpO1xuICAgICAgLy8gRW5zdXJlIGEgcG9sbCBpcyBzY2hlZHVsZWQuLi4gYnV0IGlmIHdlIGFscmVhZHkga25vdyB0aGF0IG9uZSBpcyxcbiAgICAgIC8vIGRvbid0IGhpdCB0aGUgdGhyb3R0bGVkIF9lbnN1cmVQb2xsSXNTY2hlZHVsZWQgZnVuY3Rpb24gKHdoaWNoIG1pZ2h0XG4gICAgICAvLyBsZWFkIHRvIHVzIGNhbGxpbmcgaXQgdW5uZWNlc3NhcmlseSBpbiA8cG9sbGluZ1Rocm90dGxlTXM+IG1zKS5cbiAgICAgIGlmIChzZWxmLl9wb2xsc1NjaGVkdWxlZEJ1dE5vdFN0YXJ0ZWQgPT09IDApXG4gICAgICAgIHNlbGYuX2Vuc3VyZVBvbGxJc1NjaGVkdWxlZCgpO1xuICAgIH1cbiAgKTtcbiAgc2VsZi5fc3RvcENhbGxiYWNrcy5wdXNoKGZ1bmN0aW9uICgpIHsgbGlzdGVuZXJzSGFuZGxlLnN0b3AoKTsgfSk7XG5cbiAgLy8gZXZlcnkgb25jZSBhbmQgYSB3aGlsZSwgcG9sbCBldmVuIGlmIHdlIGRvbid0IHRoaW5rIHdlJ3JlIGRpcnR5LCBmb3JcbiAgLy8gZXZlbnR1YWwgY29uc2lzdGVuY3kgd2l0aCBkYXRhYmFzZSB3cml0ZXMgZnJvbSBvdXRzaWRlIHRoZSBNZXRlb3JcbiAgLy8gdW5pdmVyc2UuXG4gIC8vXG4gIC8vIEZvciB0ZXN0aW5nLCB0aGVyZSdzIGFuIHVuZG9jdW1lbnRlZCBjYWxsYmFjayBhcmd1bWVudCB0byBvYnNlcnZlQ2hhbmdlc1xuICAvLyB3aGljaCBkaXNhYmxlcyB0aW1lLWJhc2VkIHBvbGxpbmcgYW5kIGdldHMgY2FsbGVkIGF0IHRoZSBiZWdpbm5pbmcgb2YgZWFjaFxuICAvLyBwb2xsLlxuICBpZiAob3B0aW9ucy5fdGVzdE9ubHlQb2xsQ2FsbGJhY2spIHtcbiAgICBzZWxmLl90ZXN0T25seVBvbGxDYWxsYmFjayA9IG9wdGlvbnMuX3Rlc3RPbmx5UG9sbENhbGxiYWNrO1xuICB9IGVsc2Uge1xuICAgIHZhciBwb2xsaW5nSW50ZXJ2YWwgPVxuICAgICAgICAgIHNlbGYuX2N1cnNvckRlc2NyaXB0aW9uLm9wdGlvbnMucG9sbGluZ0ludGVydmFsTXMgfHxcbiAgICAgICAgICBzZWxmLl9jdXJzb3JEZXNjcmlwdGlvbi5vcHRpb25zLl9wb2xsaW5nSW50ZXJ2YWwgfHwgLy8gQ09NUEFUIHdpdGggMS4yXG4gICAgICAgICAgUE9MTElOR19JTlRFUlZBTF9NUztcbiAgICB2YXIgaW50ZXJ2YWxIYW5kbGUgPSBNZXRlb3Iuc2V0SW50ZXJ2YWwoXG4gICAgICBfLmJpbmQoc2VsZi5fZW5zdXJlUG9sbElzU2NoZWR1bGVkLCBzZWxmKSwgcG9sbGluZ0ludGVydmFsKTtcbiAgICBzZWxmLl9zdG9wQ2FsbGJhY2tzLnB1c2goZnVuY3Rpb24gKCkge1xuICAgICAgTWV0ZW9yLmNsZWFySW50ZXJ2YWwoaW50ZXJ2YWxIYW5kbGUpO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gTWFrZSBzdXJlIHdlIGFjdHVhbGx5IHBvbGwgc29vbiFcbiAgc2VsZi5fdW50aHJvdHRsZWRFbnN1cmVQb2xsSXNTY2hlZHVsZWQoKTtcblxuICBQYWNrYWdlWydmYWN0cy1iYXNlJ10gJiYgUGFja2FnZVsnZmFjdHMtYmFzZSddLkZhY3RzLmluY3JlbWVudFNlcnZlckZhY3QoXG4gICAgXCJtb25nby1saXZlZGF0YVwiLCBcIm9ic2VydmUtZHJpdmVycy1wb2xsaW5nXCIsIDEpO1xufTtcblxuXy5leHRlbmQoUG9sbGluZ09ic2VydmVEcml2ZXIucHJvdG90eXBlLCB7XG4gIC8vIFRoaXMgaXMgYWx3YXlzIGNhbGxlZCB0aHJvdWdoIF8udGhyb3R0bGUgKGV4Y2VwdCBvbmNlIGF0IHN0YXJ0dXApLlxuICBfdW50aHJvdHRsZWRFbnN1cmVQb2xsSXNTY2hlZHVsZWQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgaWYgKHNlbGYuX3BvbGxzU2NoZWR1bGVkQnV0Tm90U3RhcnRlZCA+IDApXG4gICAgICByZXR1cm47XG4gICAgKytzZWxmLl9wb2xsc1NjaGVkdWxlZEJ1dE5vdFN0YXJ0ZWQ7XG4gICAgc2VsZi5fdGFza1F1ZXVlLnF1ZXVlVGFzayhmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLl9wb2xsTW9uZ28oKTtcbiAgICB9KTtcbiAgfSxcblxuICAvLyB0ZXN0LW9ubHkgaW50ZXJmYWNlIGZvciBjb250cm9sbGluZyBwb2xsaW5nLlxuICAvL1xuICAvLyBfc3VzcGVuZFBvbGxpbmcgYmxvY2tzIHVudGlsIGFueSBjdXJyZW50bHkgcnVubmluZyBhbmQgc2NoZWR1bGVkIHBvbGxzIGFyZVxuICAvLyBkb25lLCBhbmQgcHJldmVudHMgYW55IGZ1cnRoZXIgcG9sbHMgZnJvbSBiZWluZyBzY2hlZHVsZWQuIChuZXdcbiAgLy8gT2JzZXJ2ZUhhbmRsZXMgY2FuIGJlIGFkZGVkIGFuZCByZWNlaXZlIHRoZWlyIGluaXRpYWwgYWRkZWQgY2FsbGJhY2tzLFxuICAvLyB0aG91Z2guKVxuICAvL1xuICAvLyBfcmVzdW1lUG9sbGluZyBpbW1lZGlhdGVseSBwb2xscywgYW5kIGFsbG93cyBmdXJ0aGVyIHBvbGxzIHRvIG9jY3VyLlxuICBfc3VzcGVuZFBvbGxpbmc6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAvLyBQcmV0ZW5kIHRoYXQgdGhlcmUncyBhbm90aGVyIHBvbGwgc2NoZWR1bGVkICh3aGljaCB3aWxsIHByZXZlbnRcbiAgICAvLyBfZW5zdXJlUG9sbElzU2NoZWR1bGVkIGZyb20gcXVldWVpbmcgYW55IG1vcmUgcG9sbHMpLlxuICAgICsrc2VsZi5fcG9sbHNTY2hlZHVsZWRCdXROb3RTdGFydGVkO1xuICAgIC8vIE5vdyBibG9jayB1bnRpbCBhbGwgY3VycmVudGx5IHJ1bm5pbmcgb3Igc2NoZWR1bGVkIHBvbGxzIGFyZSBkb25lLlxuICAgIHNlbGYuX3Rhc2tRdWV1ZS5ydW5UYXNrKGZ1bmN0aW9uKCkge30pO1xuXG4gICAgLy8gQ29uZmlybSB0aGF0IHRoZXJlIGlzIG9ubHkgb25lIFwicG9sbFwiICh0aGUgZmFrZSBvbmUgd2UncmUgcHJldGVuZGluZyB0b1xuICAgIC8vIGhhdmUpIHNjaGVkdWxlZC5cbiAgICBpZiAoc2VsZi5fcG9sbHNTY2hlZHVsZWRCdXROb3RTdGFydGVkICE9PSAxKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiX3BvbGxzU2NoZWR1bGVkQnV0Tm90U3RhcnRlZCBpcyBcIiArXG4gICAgICAgICAgICAgICAgICAgICAgc2VsZi5fcG9sbHNTY2hlZHVsZWRCdXROb3RTdGFydGVkKTtcbiAgfSxcbiAgX3Jlc3VtZVBvbGxpbmc6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAvLyBXZSBzaG91bGQgYmUgaW4gdGhlIHNhbWUgc3RhdGUgYXMgaW4gdGhlIGVuZCBvZiBfc3VzcGVuZFBvbGxpbmcuXG4gICAgaWYgKHNlbGYuX3BvbGxzU2NoZWR1bGVkQnV0Tm90U3RhcnRlZCAhPT0gMSlcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIl9wb2xsc1NjaGVkdWxlZEJ1dE5vdFN0YXJ0ZWQgaXMgXCIgK1xuICAgICAgICAgICAgICAgICAgICAgIHNlbGYuX3BvbGxzU2NoZWR1bGVkQnV0Tm90U3RhcnRlZCk7XG4gICAgLy8gUnVuIGEgcG9sbCBzeW5jaHJvbm91c2x5ICh3aGljaCB3aWxsIGNvdW50ZXJhY3QgdGhlXG4gICAgLy8gKytfcG9sbHNTY2hlZHVsZWRCdXROb3RTdGFydGVkIGZyb20gX3N1c3BlbmRQb2xsaW5nKS5cbiAgICBzZWxmLl90YXNrUXVldWUucnVuVGFzayhmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLl9wb2xsTW9uZ28oKTtcbiAgICB9KTtcbiAgfSxcblxuICBfcG9sbE1vbmdvOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIC0tc2VsZi5fcG9sbHNTY2hlZHVsZWRCdXROb3RTdGFydGVkO1xuXG4gICAgaWYgKHNlbGYuX3N0b3BwZWQpXG4gICAgICByZXR1cm47XG5cbiAgICB2YXIgZmlyc3QgPSBmYWxzZTtcbiAgICB2YXIgbmV3UmVzdWx0cztcbiAgICB2YXIgb2xkUmVzdWx0cyA9IHNlbGYuX3Jlc3VsdHM7XG4gICAgaWYgKCFvbGRSZXN1bHRzKSB7XG4gICAgICBmaXJzdCA9IHRydWU7XG4gICAgICAvLyBYWFggbWF5YmUgdXNlIE9yZGVyZWREaWN0IGluc3RlYWQ/XG4gICAgICBvbGRSZXN1bHRzID0gc2VsZi5fb3JkZXJlZCA/IFtdIDogbmV3IExvY2FsQ29sbGVjdGlvbi5fSWRNYXA7XG4gICAgfVxuXG4gICAgc2VsZi5fdGVzdE9ubHlQb2xsQ2FsbGJhY2sgJiYgc2VsZi5fdGVzdE9ubHlQb2xsQ2FsbGJhY2soKTtcblxuICAgIC8vIFNhdmUgdGhlIGxpc3Qgb2YgcGVuZGluZyB3cml0ZXMgd2hpY2ggdGhpcyByb3VuZCB3aWxsIGNvbW1pdC5cbiAgICB2YXIgd3JpdGVzRm9yQ3ljbGUgPSBzZWxmLl9wZW5kaW5nV3JpdGVzO1xuICAgIHNlbGYuX3BlbmRpbmdXcml0ZXMgPSBbXTtcblxuICAgIC8vIEdldCB0aGUgbmV3IHF1ZXJ5IHJlc3VsdHMuIChUaGlzIHlpZWxkcy4pXG4gICAgdHJ5IHtcbiAgICAgIG5ld1Jlc3VsdHMgPSBzZWxmLl9zeW5jaHJvbm91c0N1cnNvci5nZXRSYXdPYmplY3RzKHNlbGYuX29yZGVyZWQpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGlmIChmaXJzdCAmJiB0eXBlb2YoZS5jb2RlKSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgLy8gVGhpcyBpcyBhbiBlcnJvciBkb2N1bWVudCBzZW50IHRvIHVzIGJ5IG1vbmdvZCwgbm90IGEgY29ubmVjdGlvblxuICAgICAgICAvLyBlcnJvciBnZW5lcmF0ZWQgYnkgdGhlIGNsaWVudC4gQW5kIHdlJ3ZlIG5ldmVyIHNlZW4gdGhpcyBxdWVyeSB3b3JrXG4gICAgICAgIC8vIHN1Y2Nlc3NmdWxseS4gUHJvYmFibHkgaXQncyBhIGJhZCBzZWxlY3RvciBvciBzb21ldGhpbmcsIHNvIHdlIHNob3VsZFxuICAgICAgICAvLyBOT1QgcmV0cnkuIEluc3RlYWQsIHdlIHNob3VsZCBoYWx0IHRoZSBvYnNlcnZlICh3aGljaCBlbmRzIHVwIGNhbGxpbmdcbiAgICAgICAgLy8gYHN0b3BgIG9uIHVzKS5cbiAgICAgICAgc2VsZi5fbXVsdGlwbGV4ZXIucXVlcnlFcnJvcihcbiAgICAgICAgICBuZXcgRXJyb3IoXG4gICAgICAgICAgICBcIkV4Y2VwdGlvbiB3aGlsZSBwb2xsaW5nIHF1ZXJ5IFwiICtcbiAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoc2VsZi5fY3Vyc29yRGVzY3JpcHRpb24pICsgXCI6IFwiICsgZS5tZXNzYWdlKSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gZ2V0UmF3T2JqZWN0cyBjYW4gdGhyb3cgaWYgd2UncmUgaGF2aW5nIHRyb3VibGUgdGFsa2luZyB0byB0aGVcbiAgICAgIC8vIGRhdGFiYXNlLiAgVGhhdCdzIGZpbmUgLS0tIHdlIHdpbGwgcmVwb2xsIGxhdGVyIGFueXdheS4gQnV0IHdlIHNob3VsZFxuICAgICAgLy8gbWFrZSBzdXJlIG5vdCB0byBsb3NlIHRyYWNrIG9mIHRoaXMgY3ljbGUncyB3cml0ZXMuXG4gICAgICAvLyAoSXQgYWxzbyBjYW4gdGhyb3cgaWYgdGhlcmUncyBqdXN0IHNvbWV0aGluZyBpbnZhbGlkIGFib3V0IHRoaXMgcXVlcnk7XG4gICAgICAvLyB1bmZvcnR1bmF0ZWx5IHRoZSBPYnNlcnZlRHJpdmVyIEFQSSBkb2Vzbid0IHByb3ZpZGUgYSBnb29kIHdheSB0b1xuICAgICAgLy8gXCJjYW5jZWxcIiB0aGUgb2JzZXJ2ZSBmcm9tIHRoZSBpbnNpZGUgaW4gdGhpcyBjYXNlLlxuICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkoc2VsZi5fcGVuZGluZ1dyaXRlcywgd3JpdGVzRm9yQ3ljbGUpO1xuICAgICAgTWV0ZW9yLl9kZWJ1ZyhcIkV4Y2VwdGlvbiB3aGlsZSBwb2xsaW5nIHF1ZXJ5IFwiICtcbiAgICAgICAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoc2VsZi5fY3Vyc29yRGVzY3JpcHRpb24pLCBlKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBSdW4gZGlmZnMuXG4gICAgaWYgKCFzZWxmLl9zdG9wcGVkKSB7XG4gICAgICBMb2NhbENvbGxlY3Rpb24uX2RpZmZRdWVyeUNoYW5nZXMoXG4gICAgICAgIHNlbGYuX29yZGVyZWQsIG9sZFJlc3VsdHMsIG5ld1Jlc3VsdHMsIHNlbGYuX211bHRpcGxleGVyKTtcbiAgICB9XG5cbiAgICAvLyBTaWduYWxzIHRoZSBtdWx0aXBsZXhlciB0byBhbGxvdyBhbGwgb2JzZXJ2ZUNoYW5nZXMgY2FsbHMgdGhhdCBzaGFyZSB0aGlzXG4gICAgLy8gbXVsdGlwbGV4ZXIgdG8gcmV0dXJuLiAoVGhpcyBoYXBwZW5zIGFzeW5jaHJvbm91c2x5LCB2aWEgdGhlXG4gICAgLy8gbXVsdGlwbGV4ZXIncyBxdWV1ZS4pXG4gICAgaWYgKGZpcnN0KVxuICAgICAgc2VsZi5fbXVsdGlwbGV4ZXIucmVhZHkoKTtcblxuICAgIC8vIFJlcGxhY2Ugc2VsZi5fcmVzdWx0cyBhdG9taWNhbGx5LiAgKFRoaXMgYXNzaWdubWVudCBpcyB3aGF0IG1ha2VzIGBmaXJzdGBcbiAgICAvLyBzdGF5IHRocm91Z2ggb24gdGhlIG5leHQgY3ljbGUsIHNvIHdlJ3ZlIHdhaXRlZCB1bnRpbCBhZnRlciB3ZSd2ZVxuICAgIC8vIGNvbW1pdHRlZCB0byByZWFkeS1pbmcgdGhlIG11bHRpcGxleGVyLilcbiAgICBzZWxmLl9yZXN1bHRzID0gbmV3UmVzdWx0cztcblxuICAgIC8vIE9uY2UgdGhlIE9ic2VydmVNdWx0aXBsZXhlciBoYXMgcHJvY2Vzc2VkIGV2ZXJ5dGhpbmcgd2UndmUgZG9uZSBpbiB0aGlzXG4gICAgLy8gcm91bmQsIG1hcmsgYWxsIHRoZSB3cml0ZXMgd2hpY2ggZXhpc3RlZCBiZWZvcmUgdGhpcyBjYWxsIGFzXG4gICAgLy8gY29tbW1pdHRlZC4gKElmIG5ldyB3cml0ZXMgaGF2ZSBzaG93biB1cCBpbiB0aGUgbWVhbnRpbWUsIHRoZXJlJ2xsXG4gICAgLy8gYWxyZWFkeSBiZSBhbm90aGVyIF9wb2xsTW9uZ28gdGFzayBzY2hlZHVsZWQuKVxuICAgIHNlbGYuX211bHRpcGxleGVyLm9uRmx1c2goZnVuY3Rpb24gKCkge1xuICAgICAgXy5lYWNoKHdyaXRlc0ZvckN5Y2xlLCBmdW5jdGlvbiAodykge1xuICAgICAgICB3LmNvbW1pdHRlZCgpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0sXG5cbiAgc3RvcDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBzZWxmLl9zdG9wcGVkID0gdHJ1ZTtcbiAgICBfLmVhY2goc2VsZi5fc3RvcENhbGxiYWNrcywgZnVuY3Rpb24gKGMpIHsgYygpOyB9KTtcbiAgICAvLyBSZWxlYXNlIGFueSB3cml0ZSBmZW5jZXMgdGhhdCBhcmUgd2FpdGluZyBvbiB1cy5cbiAgICBfLmVhY2goc2VsZi5fcGVuZGluZ1dyaXRlcywgZnVuY3Rpb24gKHcpIHtcbiAgICAgIHcuY29tbWl0dGVkKCk7XG4gICAgfSk7XG4gICAgUGFja2FnZVsnZmFjdHMtYmFzZSddICYmIFBhY2thZ2VbJ2ZhY3RzLWJhc2UnXS5GYWN0cy5pbmNyZW1lbnRTZXJ2ZXJGYWN0KFxuICAgICAgXCJtb25nby1saXZlZGF0YVwiLCBcIm9ic2VydmUtZHJpdmVycy1wb2xsaW5nXCIsIC0xKTtcbiAgfVxufSk7XG4iLCJ2YXIgRnV0dXJlID0gTnBtLnJlcXVpcmUoJ2ZpYmVycy9mdXR1cmUnKTtcblxudmFyIFBIQVNFID0ge1xuICBRVUVSWUlORzogXCJRVUVSWUlOR1wiLFxuICBGRVRDSElORzogXCJGRVRDSElOR1wiLFxuICBTVEVBRFk6IFwiU1RFQURZXCJcbn07XG5cbi8vIEV4Y2VwdGlvbiB0aHJvd24gYnkgX25lZWRUb1BvbGxRdWVyeSB3aGljaCB1bnJvbGxzIHRoZSBzdGFjayB1cCB0byB0aGVcbi8vIGVuY2xvc2luZyBjYWxsIHRvIGZpbmlzaElmTmVlZFRvUG9sbFF1ZXJ5LlxudmFyIFN3aXRjaGVkVG9RdWVyeSA9IGZ1bmN0aW9uICgpIHt9O1xudmFyIGZpbmlzaElmTmVlZFRvUG9sbFF1ZXJ5ID0gZnVuY3Rpb24gKGYpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgZi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGlmICghKGUgaW5zdGFuY2VvZiBTd2l0Y2hlZFRvUXVlcnkpKVxuICAgICAgICB0aHJvdyBlO1xuICAgIH1cbiAgfTtcbn07XG5cbnZhciBjdXJyZW50SWQgPSAwO1xuXG4vLyBPcGxvZ09ic2VydmVEcml2ZXIgaXMgYW4gYWx0ZXJuYXRpdmUgdG8gUG9sbGluZ09ic2VydmVEcml2ZXIgd2hpY2ggZm9sbG93c1xuLy8gdGhlIE1vbmdvIG9wZXJhdGlvbiBsb2cgaW5zdGVhZCBvZiBqdXN0IHJlLXBvbGxpbmcgdGhlIHF1ZXJ5LiBJdCBvYmV5cyB0aGVcbi8vIHNhbWUgc2ltcGxlIGludGVyZmFjZTogY29uc3RydWN0aW5nIGl0IHN0YXJ0cyBzZW5kaW5nIG9ic2VydmVDaGFuZ2VzXG4vLyBjYWxsYmFja3MgKGFuZCBhIHJlYWR5KCkgaW52b2NhdGlvbikgdG8gdGhlIE9ic2VydmVNdWx0aXBsZXhlciwgYW5kIHlvdSBzdG9wXG4vLyBpdCBieSBjYWxsaW5nIHRoZSBzdG9wKCkgbWV0aG9kLlxuT3Bsb2dPYnNlcnZlRHJpdmVyID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBzZWxmLl91c2VzT3Bsb2cgPSB0cnVlOyAgLy8gdGVzdHMgbG9vayBhdCB0aGlzXG5cbiAgc2VsZi5faWQgPSBjdXJyZW50SWQ7XG4gIGN1cnJlbnRJZCsrO1xuXG4gIHNlbGYuX2N1cnNvckRlc2NyaXB0aW9uID0gb3B0aW9ucy5jdXJzb3JEZXNjcmlwdGlvbjtcbiAgc2VsZi5fbW9uZ29IYW5kbGUgPSBvcHRpb25zLm1vbmdvSGFuZGxlO1xuICBzZWxmLl9tdWx0aXBsZXhlciA9IG9wdGlvbnMubXVsdGlwbGV4ZXI7XG5cbiAgaWYgKG9wdGlvbnMub3JkZXJlZCkge1xuICAgIHRocm93IEVycm9yKFwiT3Bsb2dPYnNlcnZlRHJpdmVyIG9ubHkgc3VwcG9ydHMgdW5vcmRlcmVkIG9ic2VydmVDaGFuZ2VzXCIpO1xuICB9XG5cbiAgdmFyIHNvcnRlciA9IG9wdGlvbnMuc29ydGVyO1xuICAvLyBXZSBkb24ndCBzdXBwb3J0ICRuZWFyIGFuZCBvdGhlciBnZW8tcXVlcmllcyBzbyBpdCdzIE9LIHRvIGluaXRpYWxpemUgdGhlXG4gIC8vIGNvbXBhcmF0b3Igb25seSBvbmNlIGluIHRoZSBjb25zdHJ1Y3Rvci5cbiAgdmFyIGNvbXBhcmF0b3IgPSBzb3J0ZXIgJiYgc29ydGVyLmdldENvbXBhcmF0b3IoKTtcblxuICBpZiAob3B0aW9ucy5jdXJzb3JEZXNjcmlwdGlvbi5vcHRpb25zLmxpbWl0KSB7XG4gICAgLy8gVGhlcmUgYXJlIHNldmVyYWwgcHJvcGVydGllcyBvcmRlcmVkIGRyaXZlciBpbXBsZW1lbnRzOlxuICAgIC8vIC0gX2xpbWl0IGlzIGEgcG9zaXRpdmUgbnVtYmVyXG4gICAgLy8gLSBfY29tcGFyYXRvciBpcyBhIGZ1bmN0aW9uLWNvbXBhcmF0b3IgYnkgd2hpY2ggdGhlIHF1ZXJ5IGlzIG9yZGVyZWRcbiAgICAvLyAtIF91bnB1Ymxpc2hlZEJ1ZmZlciBpcyBub24tbnVsbCBNaW4vTWF4IEhlYXAsXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgdGhlIGVtcHR5IGJ1ZmZlciBpbiBTVEVBRFkgcGhhc2UgaW1wbGllcyB0aGF0IHRoZVxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgIGV2ZXJ5dGhpbmcgdGhhdCBtYXRjaGVzIHRoZSBxdWVyaWVzIHNlbGVjdG9yIGZpdHNcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICBpbnRvIHB1Ymxpc2hlZCBzZXQuXG4gICAgLy8gLSBfcHVibGlzaGVkIC0gTWluIEhlYXAgKGFsc28gaW1wbGVtZW50cyBJZE1hcCBtZXRob2RzKVxuXG4gICAgdmFyIGhlYXBPcHRpb25zID0geyBJZE1hcDogTG9jYWxDb2xsZWN0aW9uLl9JZE1hcCB9O1xuICAgIHNlbGYuX2xpbWl0ID0gc2VsZi5fY3Vyc29yRGVzY3JpcHRpb24ub3B0aW9ucy5saW1pdDtcbiAgICBzZWxmLl9jb21wYXJhdG9yID0gY29tcGFyYXRvcjtcbiAgICBzZWxmLl9zb3J0ZXIgPSBzb3J0ZXI7XG4gICAgc2VsZi5fdW5wdWJsaXNoZWRCdWZmZXIgPSBuZXcgTWluTWF4SGVhcChjb21wYXJhdG9yLCBoZWFwT3B0aW9ucyk7XG4gICAgLy8gV2UgbmVlZCBzb21ldGhpbmcgdGhhdCBjYW4gZmluZCBNYXggdmFsdWUgaW4gYWRkaXRpb24gdG8gSWRNYXAgaW50ZXJmYWNlXG4gICAgc2VsZi5fcHVibGlzaGVkID0gbmV3IE1heEhlYXAoY29tcGFyYXRvciwgaGVhcE9wdGlvbnMpO1xuICB9IGVsc2Uge1xuICAgIHNlbGYuX2xpbWl0ID0gMDtcbiAgICBzZWxmLl9jb21wYXJhdG9yID0gbnVsbDtcbiAgICBzZWxmLl9zb3J0ZXIgPSBudWxsO1xuICAgIHNlbGYuX3VucHVibGlzaGVkQnVmZmVyID0gbnVsbDtcbiAgICBzZWxmLl9wdWJsaXNoZWQgPSBuZXcgTG9jYWxDb2xsZWN0aW9uLl9JZE1hcDtcbiAgfVxuXG4gIC8vIEluZGljYXRlcyBpZiBpdCBpcyBzYWZlIHRvIGluc2VydCBhIG5ldyBkb2N1bWVudCBhdCB0aGUgZW5kIG9mIHRoZSBidWZmZXJcbiAgLy8gZm9yIHRoaXMgcXVlcnkuIGkuZS4gaXQgaXMga25vd24gdGhhdCB0aGVyZSBhcmUgbm8gZG9jdW1lbnRzIG1hdGNoaW5nIHRoZVxuICAvLyBzZWxlY3RvciB0aG9zZSBhcmUgbm90IGluIHB1Ymxpc2hlZCBvciBidWZmZXIuXG4gIHNlbGYuX3NhZmVBcHBlbmRUb0J1ZmZlciA9IGZhbHNlO1xuXG4gIHNlbGYuX3N0b3BwZWQgPSBmYWxzZTtcbiAgc2VsZi5fc3RvcEhhbmRsZXMgPSBbXTtcblxuICBQYWNrYWdlWydmYWN0cy1iYXNlJ10gJiYgUGFja2FnZVsnZmFjdHMtYmFzZSddLkZhY3RzLmluY3JlbWVudFNlcnZlckZhY3QoXG4gICAgXCJtb25nby1saXZlZGF0YVwiLCBcIm9ic2VydmUtZHJpdmVycy1vcGxvZ1wiLCAxKTtcblxuICBzZWxmLl9yZWdpc3RlclBoYXNlQ2hhbmdlKFBIQVNFLlFVRVJZSU5HKTtcblxuICBzZWxmLl9tYXRjaGVyID0gb3B0aW9ucy5tYXRjaGVyO1xuICB2YXIgcHJvamVjdGlvbiA9IHNlbGYuX2N1cnNvckRlc2NyaXB0aW9uLm9wdGlvbnMuZmllbGRzIHx8IHt9O1xuICBzZWxmLl9wcm9qZWN0aW9uRm4gPSBMb2NhbENvbGxlY3Rpb24uX2NvbXBpbGVQcm9qZWN0aW9uKHByb2plY3Rpb24pO1xuICAvLyBQcm9qZWN0aW9uIGZ1bmN0aW9uLCByZXN1bHQgb2YgY29tYmluaW5nIGltcG9ydGFudCBmaWVsZHMgZm9yIHNlbGVjdG9yIGFuZFxuICAvLyBleGlzdGluZyBmaWVsZHMgcHJvamVjdGlvblxuICBzZWxmLl9zaGFyZWRQcm9qZWN0aW9uID0gc2VsZi5fbWF0Y2hlci5jb21iaW5lSW50b1Byb2plY3Rpb24ocHJvamVjdGlvbik7XG4gIGlmIChzb3J0ZXIpXG4gICAgc2VsZi5fc2hhcmVkUHJvamVjdGlvbiA9IHNvcnRlci5jb21iaW5lSW50b1Byb2plY3Rpb24oc2VsZi5fc2hhcmVkUHJvamVjdGlvbik7XG4gIHNlbGYuX3NoYXJlZFByb2plY3Rpb25GbiA9IExvY2FsQ29sbGVjdGlvbi5fY29tcGlsZVByb2plY3Rpb24oXG4gICAgc2VsZi5fc2hhcmVkUHJvamVjdGlvbik7XG5cbiAgc2VsZi5fbmVlZFRvRmV0Y2ggPSBuZXcgTG9jYWxDb2xsZWN0aW9uLl9JZE1hcDtcbiAgc2VsZi5fY3VycmVudGx5RmV0Y2hpbmcgPSBudWxsO1xuICBzZWxmLl9mZXRjaEdlbmVyYXRpb24gPSAwO1xuXG4gIHNlbGYuX3JlcXVlcnlXaGVuRG9uZVRoaXNRdWVyeSA9IGZhbHNlO1xuICBzZWxmLl93cml0ZXNUb0NvbW1pdFdoZW5XZVJlYWNoU3RlYWR5ID0gW107XG5cbiAgLy8gSWYgdGhlIG9wbG9nIGhhbmRsZSB0ZWxscyB1cyB0aGF0IGl0IHNraXBwZWQgc29tZSBlbnRyaWVzIChiZWNhdXNlIGl0IGdvdFxuICAvLyBiZWhpbmQsIHNheSksIHJlLXBvbGwuXG4gIHNlbGYuX3N0b3BIYW5kbGVzLnB1c2goc2VsZi5fbW9uZ29IYW5kbGUuX29wbG9nSGFuZGxlLm9uU2tpcHBlZEVudHJpZXMoXG4gICAgZmluaXNoSWZOZWVkVG9Qb2xsUXVlcnkoZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi5fbmVlZFRvUG9sbFF1ZXJ5KCk7XG4gICAgfSlcbiAgKSk7XG5cbiAgZm9yRWFjaFRyaWdnZXIoc2VsZi5fY3Vyc29yRGVzY3JpcHRpb24sIGZ1bmN0aW9uICh0cmlnZ2VyKSB7XG4gICAgc2VsZi5fc3RvcEhhbmRsZXMucHVzaChzZWxmLl9tb25nb0hhbmRsZS5fb3Bsb2dIYW5kbGUub25PcGxvZ0VudHJ5KFxuICAgICAgdHJpZ2dlciwgZnVuY3Rpb24gKG5vdGlmaWNhdGlvbikge1xuICAgICAgICBNZXRlb3IuX25vWWllbGRzQWxsb3dlZChmaW5pc2hJZk5lZWRUb1BvbGxRdWVyeShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdmFyIG9wID0gbm90aWZpY2F0aW9uLm9wO1xuICAgICAgICAgIGlmIChub3RpZmljYXRpb24uZHJvcENvbGxlY3Rpb24gfHwgbm90aWZpY2F0aW9uLmRyb3BEYXRhYmFzZSkge1xuICAgICAgICAgICAgLy8gTm90ZTogdGhpcyBjYWxsIGlzIG5vdCBhbGxvd2VkIHRvIGJsb2NrIG9uIGFueXRoaW5nIChlc3BlY2lhbGx5XG4gICAgICAgICAgICAvLyBvbiB3YWl0aW5nIGZvciBvcGxvZyBlbnRyaWVzIHRvIGNhdGNoIHVwKSBiZWNhdXNlIHRoYXQgd2lsbCBibG9ja1xuICAgICAgICAgICAgLy8gb25PcGxvZ0VudHJ5IVxuICAgICAgICAgICAgc2VsZi5fbmVlZFRvUG9sbFF1ZXJ5KCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIEFsbCBvdGhlciBvcGVyYXRvcnMgc2hvdWxkIGJlIGhhbmRsZWQgZGVwZW5kaW5nIG9uIHBoYXNlXG4gICAgICAgICAgICBpZiAoc2VsZi5fcGhhc2UgPT09IFBIQVNFLlFVRVJZSU5HKSB7XG4gICAgICAgICAgICAgIHNlbGYuX2hhbmRsZU9wbG9nRW50cnlRdWVyeWluZyhvcCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBzZWxmLl9oYW5kbGVPcGxvZ0VudHJ5U3RlYWR5T3JGZXRjaGluZyhvcCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KSk7XG4gICAgICB9XG4gICAgKSk7XG4gIH0pO1xuXG4gIC8vIFhYWCBvcmRlcmluZyB3LnIudC4gZXZlcnl0aGluZyBlbHNlP1xuICBzZWxmLl9zdG9wSGFuZGxlcy5wdXNoKGxpc3RlbkFsbChcbiAgICBzZWxmLl9jdXJzb3JEZXNjcmlwdGlvbiwgZnVuY3Rpb24gKG5vdGlmaWNhdGlvbikge1xuICAgICAgLy8gSWYgd2UncmUgbm90IGluIGEgcHJlLWZpcmUgd3JpdGUgZmVuY2UsIHdlIGRvbid0IGhhdmUgdG8gZG8gYW55dGhpbmcuXG4gICAgICB2YXIgZmVuY2UgPSBERFBTZXJ2ZXIuX0N1cnJlbnRXcml0ZUZlbmNlLmdldCgpO1xuICAgICAgaWYgKCFmZW5jZSB8fCBmZW5jZS5maXJlZClcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICBpZiAoZmVuY2UuX29wbG9nT2JzZXJ2ZURyaXZlcnMpIHtcbiAgICAgICAgZmVuY2UuX29wbG9nT2JzZXJ2ZURyaXZlcnNbc2VsZi5faWRdID0gc2VsZjtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBmZW5jZS5fb3Bsb2dPYnNlcnZlRHJpdmVycyA9IHt9O1xuICAgICAgZmVuY2UuX29wbG9nT2JzZXJ2ZURyaXZlcnNbc2VsZi5faWRdID0gc2VsZjtcblxuICAgICAgZmVuY2Uub25CZWZvcmVGaXJlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGRyaXZlcnMgPSBmZW5jZS5fb3Bsb2dPYnNlcnZlRHJpdmVycztcbiAgICAgICAgZGVsZXRlIGZlbmNlLl9vcGxvZ09ic2VydmVEcml2ZXJzO1xuXG4gICAgICAgIC8vIFRoaXMgZmVuY2UgY2Fubm90IGZpcmUgdW50aWwgd2UndmUgY2F1Z2h0IHVwIHRvIFwidGhpcyBwb2ludFwiIGluIHRoZVxuICAgICAgICAvLyBvcGxvZywgYW5kIGFsbCBvYnNlcnZlcnMgbWFkZSBpdCBiYWNrIHRvIHRoZSBzdGVhZHkgc3RhdGUuXG4gICAgICAgIHNlbGYuX21vbmdvSGFuZGxlLl9vcGxvZ0hhbmRsZS53YWl0VW50aWxDYXVnaHRVcCgpO1xuXG4gICAgICAgIF8uZWFjaChkcml2ZXJzLCBmdW5jdGlvbiAoZHJpdmVyKSB7XG4gICAgICAgICAgaWYgKGRyaXZlci5fc3RvcHBlZClcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICAgIHZhciB3cml0ZSA9IGZlbmNlLmJlZ2luV3JpdGUoKTtcbiAgICAgICAgICBpZiAoZHJpdmVyLl9waGFzZSA9PT0gUEhBU0UuU1RFQURZKSB7XG4gICAgICAgICAgICAvLyBNYWtlIHN1cmUgdGhhdCBhbGwgb2YgdGhlIGNhbGxiYWNrcyBoYXZlIG1hZGUgaXQgdGhyb3VnaCB0aGVcbiAgICAgICAgICAgIC8vIG11bHRpcGxleGVyIGFuZCBiZWVuIGRlbGl2ZXJlZCB0byBPYnNlcnZlSGFuZGxlcyBiZWZvcmUgY29tbWl0dGluZ1xuICAgICAgICAgICAgLy8gd3JpdGVzLlxuICAgICAgICAgICAgZHJpdmVyLl9tdWx0aXBsZXhlci5vbkZsdXNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgd3JpdGUuY29tbWl0dGVkKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZHJpdmVyLl93cml0ZXNUb0NvbW1pdFdoZW5XZVJlYWNoU3RlYWR5LnB1c2god3JpdGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gICkpO1xuXG4gIC8vIFdoZW4gTW9uZ28gZmFpbHMgb3Zlciwgd2UgbmVlZCB0byByZXBvbGwgdGhlIHF1ZXJ5LCBpbiBjYXNlIHdlIHByb2Nlc3NlZCBhblxuICAvLyBvcGxvZyBlbnRyeSB0aGF0IGdvdCByb2xsZWQgYmFjay5cbiAgc2VsZi5fc3RvcEhhbmRsZXMucHVzaChzZWxmLl9tb25nb0hhbmRsZS5fb25GYWlsb3ZlcihmaW5pc2hJZk5lZWRUb1BvbGxRdWVyeShcbiAgICBmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLl9uZWVkVG9Qb2xsUXVlcnkoKTtcbiAgICB9KSkpO1xuXG4gIC8vIEdpdmUgX29ic2VydmVDaGFuZ2VzIGEgY2hhbmNlIHRvIGFkZCB0aGUgbmV3IE9ic2VydmVIYW5kbGUgdG8gb3VyXG4gIC8vIG11bHRpcGxleGVyLCBzbyB0aGF0IHRoZSBhZGRlZCBjYWxscyBnZXQgc3RyZWFtZWQuXG4gIE1ldGVvci5kZWZlcihmaW5pc2hJZk5lZWRUb1BvbGxRdWVyeShmdW5jdGlvbiAoKSB7XG4gICAgc2VsZi5fcnVuSW5pdGlhbFF1ZXJ5KCk7XG4gIH0pKTtcbn07XG5cbl8uZXh0ZW5kKE9wbG9nT2JzZXJ2ZURyaXZlci5wcm90b3R5cGUsIHtcbiAgX2FkZFB1Ymxpc2hlZDogZnVuY3Rpb24gKGlkLCBkb2MpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgTWV0ZW9yLl9ub1lpZWxkc0FsbG93ZWQoZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGZpZWxkcyA9IF8uY2xvbmUoZG9jKTtcbiAgICAgIGRlbGV0ZSBmaWVsZHMuX2lkO1xuICAgICAgc2VsZi5fcHVibGlzaGVkLnNldChpZCwgc2VsZi5fc2hhcmVkUHJvamVjdGlvbkZuKGRvYykpO1xuICAgICAgc2VsZi5fbXVsdGlwbGV4ZXIuYWRkZWQoaWQsIHNlbGYuX3Byb2plY3Rpb25GbihmaWVsZHMpKTtcblxuICAgICAgLy8gQWZ0ZXIgYWRkaW5nIHRoaXMgZG9jdW1lbnQsIHRoZSBwdWJsaXNoZWQgc2V0IG1pZ2h0IGJlIG92ZXJmbG93ZWRcbiAgICAgIC8vIChleGNlZWRpbmcgY2FwYWNpdHkgc3BlY2lmaWVkIGJ5IGxpbWl0KS4gSWYgc28sIHB1c2ggdGhlIG1heGltdW1cbiAgICAgIC8vIGVsZW1lbnQgdG8gdGhlIGJ1ZmZlciwgd2UgbWlnaHQgd2FudCB0byBzYXZlIGl0IGluIG1lbW9yeSB0byByZWR1Y2UgdGhlXG4gICAgICAvLyBhbW91bnQgb2YgTW9uZ28gbG9va3VwcyBpbiB0aGUgZnV0dXJlLlxuICAgICAgaWYgKHNlbGYuX2xpbWl0ICYmIHNlbGYuX3B1Ymxpc2hlZC5zaXplKCkgPiBzZWxmLl9saW1pdCkge1xuICAgICAgICAvLyBYWFggaW4gdGhlb3J5IHRoZSBzaXplIG9mIHB1Ymxpc2hlZCBpcyBubyBtb3JlIHRoYW4gbGltaXQrMVxuICAgICAgICBpZiAoc2VsZi5fcHVibGlzaGVkLnNpemUoKSAhPT0gc2VsZi5fbGltaXQgKyAxKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQWZ0ZXIgYWRkaW5nIHRvIHB1Ymxpc2hlZCwgXCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAoc2VsZi5fcHVibGlzaGVkLnNpemUoKSAtIHNlbGYuX2xpbWl0KSArXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwiIGRvY3VtZW50cyBhcmUgb3ZlcmZsb3dpbmcgdGhlIHNldFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBvdmVyZmxvd2luZ0RvY0lkID0gc2VsZi5fcHVibGlzaGVkLm1heEVsZW1lbnRJZCgpO1xuICAgICAgICB2YXIgb3ZlcmZsb3dpbmdEb2MgPSBzZWxmLl9wdWJsaXNoZWQuZ2V0KG92ZXJmbG93aW5nRG9jSWQpO1xuXG4gICAgICAgIGlmIChFSlNPTi5lcXVhbHMob3ZlcmZsb3dpbmdEb2NJZCwgaWQpKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIGRvY3VtZW50IGp1c3QgYWRkZWQgaXMgb3ZlcmZsb3dpbmcgdGhlIHB1Ymxpc2hlZCBzZXRcIik7XG4gICAgICAgIH1cblxuICAgICAgICBzZWxmLl9wdWJsaXNoZWQucmVtb3ZlKG92ZXJmbG93aW5nRG9jSWQpO1xuICAgICAgICBzZWxmLl9tdWx0aXBsZXhlci5yZW1vdmVkKG92ZXJmbG93aW5nRG9jSWQpO1xuICAgICAgICBzZWxmLl9hZGRCdWZmZXJlZChvdmVyZmxvd2luZ0RvY0lkLCBvdmVyZmxvd2luZ0RvYyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG4gIF9yZW1vdmVQdWJsaXNoZWQ6IGZ1bmN0aW9uIChpZCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBNZXRlb3IuX25vWWllbGRzQWxsb3dlZChmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLl9wdWJsaXNoZWQucmVtb3ZlKGlkKTtcbiAgICAgIHNlbGYuX211bHRpcGxleGVyLnJlbW92ZWQoaWQpO1xuICAgICAgaWYgKCEgc2VsZi5fbGltaXQgfHwgc2VsZi5fcHVibGlzaGVkLnNpemUoKSA9PT0gc2VsZi5fbGltaXQpXG4gICAgICAgIHJldHVybjtcblxuICAgICAgaWYgKHNlbGYuX3B1Ymxpc2hlZC5zaXplKCkgPiBzZWxmLl9saW1pdClcbiAgICAgICAgdGhyb3cgRXJyb3IoXCJzZWxmLl9wdWJsaXNoZWQgZ290IHRvbyBiaWdcIik7XG5cbiAgICAgIC8vIE9LLCB3ZSBhcmUgcHVibGlzaGluZyBsZXNzIHRoYW4gdGhlIGxpbWl0LiBNYXliZSB3ZSBzaG91bGQgbG9vayBpbiB0aGVcbiAgICAgIC8vIGJ1ZmZlciB0byBmaW5kIHRoZSBuZXh0IGVsZW1lbnQgcGFzdCB3aGF0IHdlIHdlcmUgcHVibGlzaGluZyBiZWZvcmUuXG5cbiAgICAgIGlmICghc2VsZi5fdW5wdWJsaXNoZWRCdWZmZXIuZW1wdHkoKSkge1xuICAgICAgICAvLyBUaGVyZSdzIHNvbWV0aGluZyBpbiB0aGUgYnVmZmVyOyBtb3ZlIHRoZSBmaXJzdCB0aGluZyBpbiBpdCB0b1xuICAgICAgICAvLyBfcHVibGlzaGVkLlxuICAgICAgICB2YXIgbmV3RG9jSWQgPSBzZWxmLl91bnB1Ymxpc2hlZEJ1ZmZlci5taW5FbGVtZW50SWQoKTtcbiAgICAgICAgdmFyIG5ld0RvYyA9IHNlbGYuX3VucHVibGlzaGVkQnVmZmVyLmdldChuZXdEb2NJZCk7XG4gICAgICAgIHNlbGYuX3JlbW92ZUJ1ZmZlcmVkKG5ld0RvY0lkKTtcbiAgICAgICAgc2VsZi5fYWRkUHVibGlzaGVkKG5ld0RvY0lkLCBuZXdEb2MpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIFRoZXJlJ3Mgbm90aGluZyBpbiB0aGUgYnVmZmVyLiAgVGhpcyBjb3VsZCBtZWFuIG9uZSBvZiBhIGZldyB0aGluZ3MuXG5cbiAgICAgIC8vIChhKSBXZSBjb3VsZCBiZSBpbiB0aGUgbWlkZGxlIG9mIHJlLXJ1bm5pbmcgdGhlIHF1ZXJ5IChzcGVjaWZpY2FsbHksIHdlXG4gICAgICAvLyBjb3VsZCBiZSBpbiBfcHVibGlzaE5ld1Jlc3VsdHMpLiBJbiB0aGF0IGNhc2UsIF91bnB1Ymxpc2hlZEJ1ZmZlciBpc1xuICAgICAgLy8gZW1wdHkgYmVjYXVzZSB3ZSBjbGVhciBpdCBhdCB0aGUgYmVnaW5uaW5nIG9mIF9wdWJsaXNoTmV3UmVzdWx0cy4gSW5cbiAgICAgIC8vIHRoaXMgY2FzZSwgb3VyIGNhbGxlciBhbHJlYWR5IGtub3dzIHRoZSBlbnRpcmUgYW5zd2VyIHRvIHRoZSBxdWVyeSBhbmRcbiAgICAgIC8vIHdlIGRvbid0IG5lZWQgdG8gZG8gYW55dGhpbmcgZmFuY3kgaGVyZS4gIEp1c3QgcmV0dXJuLlxuICAgICAgaWYgKHNlbGYuX3BoYXNlID09PSBQSEFTRS5RVUVSWUlORylcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICAvLyAoYikgV2UncmUgcHJldHR5IGNvbmZpZGVudCB0aGF0IHRoZSB1bmlvbiBvZiBfcHVibGlzaGVkIGFuZFxuICAgICAgLy8gX3VucHVibGlzaGVkQnVmZmVyIGNvbnRhaW4gYWxsIGRvY3VtZW50cyB0aGF0IG1hdGNoIHNlbGVjdG9yLiBCZWNhdXNlXG4gICAgICAvLyBfdW5wdWJsaXNoZWRCdWZmZXIgaXMgZW1wdHksIHRoYXQgbWVhbnMgd2UncmUgY29uZmlkZW50IHRoYXQgX3B1Ymxpc2hlZFxuICAgICAgLy8gY29udGFpbnMgYWxsIGRvY3VtZW50cyB0aGF0IG1hdGNoIHNlbGVjdG9yLiBTbyB3ZSBoYXZlIG5vdGhpbmcgdG8gZG8uXG4gICAgICBpZiAoc2VsZi5fc2FmZUFwcGVuZFRvQnVmZmVyKVxuICAgICAgICByZXR1cm47XG5cbiAgICAgIC8vIChjKSBNYXliZSB0aGVyZSBhcmUgb3RoZXIgZG9jdW1lbnRzIG91dCB0aGVyZSB0aGF0IHNob3VsZCBiZSBpbiBvdXJcbiAgICAgIC8vIGJ1ZmZlci4gQnV0IGluIHRoYXQgY2FzZSwgd2hlbiB3ZSBlbXB0aWVkIF91bnB1Ymxpc2hlZEJ1ZmZlciBpblxuICAgICAgLy8gX3JlbW92ZUJ1ZmZlcmVkLCB3ZSBzaG91bGQgaGF2ZSBjYWxsZWQgX25lZWRUb1BvbGxRdWVyeSwgd2hpY2ggd2lsbFxuICAgICAgLy8gZWl0aGVyIHB1dCBzb21ldGhpbmcgaW4gX3VucHVibGlzaGVkQnVmZmVyIG9yIHNldCBfc2FmZUFwcGVuZFRvQnVmZmVyXG4gICAgICAvLyAob3IgYm90aCksIGFuZCBpdCB3aWxsIHB1dCB1cyBpbiBRVUVSWUlORyBmb3IgdGhhdCB3aG9sZSB0aW1lLiBTbyBpblxuICAgICAgLy8gZmFjdCwgd2Ugc2hvdWxkbid0IGJlIGFibGUgdG8gZ2V0IGhlcmUuXG5cbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkJ1ZmZlciBpbmV4cGxpY2FibHkgZW1wdHlcIik7XG4gICAgfSk7XG4gIH0sXG4gIF9jaGFuZ2VQdWJsaXNoZWQ6IGZ1bmN0aW9uIChpZCwgb2xkRG9jLCBuZXdEb2MpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgTWV0ZW9yLl9ub1lpZWxkc0FsbG93ZWQoZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi5fcHVibGlzaGVkLnNldChpZCwgc2VsZi5fc2hhcmVkUHJvamVjdGlvbkZuKG5ld0RvYykpO1xuICAgICAgdmFyIHByb2plY3RlZE5ldyA9IHNlbGYuX3Byb2plY3Rpb25GbihuZXdEb2MpO1xuICAgICAgdmFyIHByb2plY3RlZE9sZCA9IHNlbGYuX3Byb2plY3Rpb25GbihvbGREb2MpO1xuICAgICAgdmFyIGNoYW5nZWQgPSBEaWZmU2VxdWVuY2UubWFrZUNoYW5nZWRGaWVsZHMoXG4gICAgICAgIHByb2plY3RlZE5ldywgcHJvamVjdGVkT2xkKTtcbiAgICAgIGlmICghXy5pc0VtcHR5KGNoYW5nZWQpKVxuICAgICAgICBzZWxmLl9tdWx0aXBsZXhlci5jaGFuZ2VkKGlkLCBjaGFuZ2VkKTtcbiAgICB9KTtcbiAgfSxcbiAgX2FkZEJ1ZmZlcmVkOiBmdW5jdGlvbiAoaWQsIGRvYykge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBNZXRlb3IuX25vWWllbGRzQWxsb3dlZChmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLl91bnB1Ymxpc2hlZEJ1ZmZlci5zZXQoaWQsIHNlbGYuX3NoYXJlZFByb2plY3Rpb25Gbihkb2MpKTtcblxuICAgICAgLy8gSWYgc29tZXRoaW5nIGlzIG92ZXJmbG93aW5nIHRoZSBidWZmZXIsIHdlIGp1c3QgcmVtb3ZlIGl0IGZyb20gY2FjaGVcbiAgICAgIGlmIChzZWxmLl91bnB1Ymxpc2hlZEJ1ZmZlci5zaXplKCkgPiBzZWxmLl9saW1pdCkge1xuICAgICAgICB2YXIgbWF4QnVmZmVyZWRJZCA9IHNlbGYuX3VucHVibGlzaGVkQnVmZmVyLm1heEVsZW1lbnRJZCgpO1xuXG4gICAgICAgIHNlbGYuX3VucHVibGlzaGVkQnVmZmVyLnJlbW92ZShtYXhCdWZmZXJlZElkKTtcblxuICAgICAgICAvLyBTaW5jZSBzb21ldGhpbmcgbWF0Y2hpbmcgaXMgcmVtb3ZlZCBmcm9tIGNhY2hlIChib3RoIHB1Ymxpc2hlZCBzZXQgYW5kXG4gICAgICAgIC8vIGJ1ZmZlciksIHNldCBmbGFnIHRvIGZhbHNlXG4gICAgICAgIHNlbGYuX3NhZmVBcHBlbmRUb0J1ZmZlciA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuICAvLyBJcyBjYWxsZWQgZWl0aGVyIHRvIHJlbW92ZSB0aGUgZG9jIGNvbXBsZXRlbHkgZnJvbSBtYXRjaGluZyBzZXQgb3IgdG8gbW92ZVxuICAvLyBpdCB0byB0aGUgcHVibGlzaGVkIHNldCBsYXRlci5cbiAgX3JlbW92ZUJ1ZmZlcmVkOiBmdW5jdGlvbiAoaWQpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgTWV0ZW9yLl9ub1lpZWxkc0FsbG93ZWQoZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi5fdW5wdWJsaXNoZWRCdWZmZXIucmVtb3ZlKGlkKTtcbiAgICAgIC8vIFRvIGtlZXAgdGhlIGNvbnRyYWN0IFwiYnVmZmVyIGlzIG5ldmVyIGVtcHR5IGluIFNURUFEWSBwaGFzZSB1bmxlc3MgdGhlXG4gICAgICAvLyBldmVyeXRoaW5nIG1hdGNoaW5nIGZpdHMgaW50byBwdWJsaXNoZWRcIiB0cnVlLCB3ZSBwb2xsIGV2ZXJ5dGhpbmcgYXNcbiAgICAgIC8vIHNvb24gYXMgd2Ugc2VlIHRoZSBidWZmZXIgYmVjb21pbmcgZW1wdHkuXG4gICAgICBpZiAoISBzZWxmLl91bnB1Ymxpc2hlZEJ1ZmZlci5zaXplKCkgJiYgISBzZWxmLl9zYWZlQXBwZW5kVG9CdWZmZXIpXG4gICAgICAgIHNlbGYuX25lZWRUb1BvbGxRdWVyeSgpO1xuICAgIH0pO1xuICB9LFxuICAvLyBDYWxsZWQgd2hlbiBhIGRvY3VtZW50IGhhcyBqb2luZWQgdGhlIFwiTWF0Y2hpbmdcIiByZXN1bHRzIHNldC5cbiAgLy8gVGFrZXMgcmVzcG9uc2liaWxpdHkgb2Yga2VlcGluZyBfdW5wdWJsaXNoZWRCdWZmZXIgaW4gc3luYyB3aXRoIF9wdWJsaXNoZWRcbiAgLy8gYW5kIHRoZSBlZmZlY3Qgb2YgbGltaXQgZW5mb3JjZWQuXG4gIF9hZGRNYXRjaGluZzogZnVuY3Rpb24gKGRvYykge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBNZXRlb3IuX25vWWllbGRzQWxsb3dlZChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgaWQgPSBkb2MuX2lkO1xuICAgICAgaWYgKHNlbGYuX3B1Ymxpc2hlZC5oYXMoaWQpKVxuICAgICAgICB0aHJvdyBFcnJvcihcInRyaWVkIHRvIGFkZCBzb21ldGhpbmcgYWxyZWFkeSBwdWJsaXNoZWQgXCIgKyBpZCk7XG4gICAgICBpZiAoc2VsZi5fbGltaXQgJiYgc2VsZi5fdW5wdWJsaXNoZWRCdWZmZXIuaGFzKGlkKSlcbiAgICAgICAgdGhyb3cgRXJyb3IoXCJ0cmllZCB0byBhZGQgc29tZXRoaW5nIGFscmVhZHkgZXhpc3RlZCBpbiBidWZmZXIgXCIgKyBpZCk7XG5cbiAgICAgIHZhciBsaW1pdCA9IHNlbGYuX2xpbWl0O1xuICAgICAgdmFyIGNvbXBhcmF0b3IgPSBzZWxmLl9jb21wYXJhdG9yO1xuICAgICAgdmFyIG1heFB1Ymxpc2hlZCA9IChsaW1pdCAmJiBzZWxmLl9wdWJsaXNoZWQuc2l6ZSgpID4gMCkgP1xuICAgICAgICBzZWxmLl9wdWJsaXNoZWQuZ2V0KHNlbGYuX3B1Ymxpc2hlZC5tYXhFbGVtZW50SWQoKSkgOiBudWxsO1xuICAgICAgdmFyIG1heEJ1ZmZlcmVkID0gKGxpbWl0ICYmIHNlbGYuX3VucHVibGlzaGVkQnVmZmVyLnNpemUoKSA+IDApXG4gICAgICAgID8gc2VsZi5fdW5wdWJsaXNoZWRCdWZmZXIuZ2V0KHNlbGYuX3VucHVibGlzaGVkQnVmZmVyLm1heEVsZW1lbnRJZCgpKVxuICAgICAgICA6IG51bGw7XG4gICAgICAvLyBUaGUgcXVlcnkgaXMgdW5saW1pdGVkIG9yIGRpZG4ndCBwdWJsaXNoIGVub3VnaCBkb2N1bWVudHMgeWV0IG9yIHRoZVxuICAgICAgLy8gbmV3IGRvY3VtZW50IHdvdWxkIGZpdCBpbnRvIHB1Ymxpc2hlZCBzZXQgcHVzaGluZyB0aGUgbWF4aW11bSBlbGVtZW50XG4gICAgICAvLyBvdXQsIHRoZW4gd2UgbmVlZCB0byBwdWJsaXNoIHRoZSBkb2MuXG4gICAgICB2YXIgdG9QdWJsaXNoID0gISBsaW1pdCB8fCBzZWxmLl9wdWJsaXNoZWQuc2l6ZSgpIDwgbGltaXQgfHxcbiAgICAgICAgY29tcGFyYXRvcihkb2MsIG1heFB1Ymxpc2hlZCkgPCAwO1xuXG4gICAgICAvLyBPdGhlcndpc2Ugd2UgbWlnaHQgbmVlZCB0byBidWZmZXIgaXQgKG9ubHkgaW4gY2FzZSBvZiBsaW1pdGVkIHF1ZXJ5KS5cbiAgICAgIC8vIEJ1ZmZlcmluZyBpcyBhbGxvd2VkIGlmIHRoZSBidWZmZXIgaXMgbm90IGZpbGxlZCB1cCB5ZXQgYW5kIGFsbFxuICAgICAgLy8gbWF0Y2hpbmcgZG9jcyBhcmUgZWl0aGVyIGluIHRoZSBwdWJsaXNoZWQgc2V0IG9yIGluIHRoZSBidWZmZXIuXG4gICAgICB2YXIgY2FuQXBwZW5kVG9CdWZmZXIgPSAhdG9QdWJsaXNoICYmIHNlbGYuX3NhZmVBcHBlbmRUb0J1ZmZlciAmJlxuICAgICAgICBzZWxmLl91bnB1Ymxpc2hlZEJ1ZmZlci5zaXplKCkgPCBsaW1pdDtcblxuICAgICAgLy8gT3IgaWYgaXQgaXMgc21hbGwgZW5vdWdoIHRvIGJlIHNhZmVseSBpbnNlcnRlZCB0byB0aGUgbWlkZGxlIG9yIHRoZVxuICAgICAgLy8gYmVnaW5uaW5nIG9mIHRoZSBidWZmZXIuXG4gICAgICB2YXIgY2FuSW5zZXJ0SW50b0J1ZmZlciA9ICF0b1B1Ymxpc2ggJiYgbWF4QnVmZmVyZWQgJiZcbiAgICAgICAgY29tcGFyYXRvcihkb2MsIG1heEJ1ZmZlcmVkKSA8PSAwO1xuXG4gICAgICB2YXIgdG9CdWZmZXIgPSBjYW5BcHBlbmRUb0J1ZmZlciB8fCBjYW5JbnNlcnRJbnRvQnVmZmVyO1xuXG4gICAgICBpZiAodG9QdWJsaXNoKSB7XG4gICAgICAgIHNlbGYuX2FkZFB1Ymxpc2hlZChpZCwgZG9jKTtcbiAgICAgIH0gZWxzZSBpZiAodG9CdWZmZXIpIHtcbiAgICAgICAgc2VsZi5fYWRkQnVmZmVyZWQoaWQsIGRvYyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBkcm9wcGluZyBpdCBhbmQgbm90IHNhdmluZyB0byB0aGUgY2FjaGVcbiAgICAgICAgc2VsZi5fc2FmZUFwcGVuZFRvQnVmZmVyID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG4gIC8vIENhbGxlZCB3aGVuIGEgZG9jdW1lbnQgbGVhdmVzIHRoZSBcIk1hdGNoaW5nXCIgcmVzdWx0cyBzZXQuXG4gIC8vIFRha2VzIHJlc3BvbnNpYmlsaXR5IG9mIGtlZXBpbmcgX3VucHVibGlzaGVkQnVmZmVyIGluIHN5bmMgd2l0aCBfcHVibGlzaGVkXG4gIC8vIGFuZCB0aGUgZWZmZWN0IG9mIGxpbWl0IGVuZm9yY2VkLlxuICBfcmVtb3ZlTWF0Y2hpbmc6IGZ1bmN0aW9uIChpZCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBNZXRlb3IuX25vWWllbGRzQWxsb3dlZChmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoISBzZWxmLl9wdWJsaXNoZWQuaGFzKGlkKSAmJiAhIHNlbGYuX2xpbWl0KVxuICAgICAgICB0aHJvdyBFcnJvcihcInRyaWVkIHRvIHJlbW92ZSBzb21ldGhpbmcgbWF0Y2hpbmcgYnV0IG5vdCBjYWNoZWQgXCIgKyBpZCk7XG5cbiAgICAgIGlmIChzZWxmLl9wdWJsaXNoZWQuaGFzKGlkKSkge1xuICAgICAgICBzZWxmLl9yZW1vdmVQdWJsaXNoZWQoaWQpO1xuICAgICAgfSBlbHNlIGlmIChzZWxmLl91bnB1Ymxpc2hlZEJ1ZmZlci5oYXMoaWQpKSB7XG4gICAgICAgIHNlbGYuX3JlbW92ZUJ1ZmZlcmVkKGlkKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcbiAgX2hhbmRsZURvYzogZnVuY3Rpb24gKGlkLCBuZXdEb2MpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgTWV0ZW9yLl9ub1lpZWxkc0FsbG93ZWQoZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIG1hdGNoZXNOb3cgPSBuZXdEb2MgJiYgc2VsZi5fbWF0Y2hlci5kb2N1bWVudE1hdGNoZXMobmV3RG9jKS5yZXN1bHQ7XG5cbiAgICAgIHZhciBwdWJsaXNoZWRCZWZvcmUgPSBzZWxmLl9wdWJsaXNoZWQuaGFzKGlkKTtcbiAgICAgIHZhciBidWZmZXJlZEJlZm9yZSA9IHNlbGYuX2xpbWl0ICYmIHNlbGYuX3VucHVibGlzaGVkQnVmZmVyLmhhcyhpZCk7XG4gICAgICB2YXIgY2FjaGVkQmVmb3JlID0gcHVibGlzaGVkQmVmb3JlIHx8IGJ1ZmZlcmVkQmVmb3JlO1xuXG4gICAgICBpZiAobWF0Y2hlc05vdyAmJiAhY2FjaGVkQmVmb3JlKSB7XG4gICAgICAgIHNlbGYuX2FkZE1hdGNoaW5nKG5ld0RvYyk7XG4gICAgICB9IGVsc2UgaWYgKGNhY2hlZEJlZm9yZSAmJiAhbWF0Y2hlc05vdykge1xuICAgICAgICBzZWxmLl9yZW1vdmVNYXRjaGluZyhpZCk7XG4gICAgICB9IGVsc2UgaWYgKGNhY2hlZEJlZm9yZSAmJiBtYXRjaGVzTm93KSB7XG4gICAgICAgIHZhciBvbGREb2MgPSBzZWxmLl9wdWJsaXNoZWQuZ2V0KGlkKTtcbiAgICAgICAgdmFyIGNvbXBhcmF0b3IgPSBzZWxmLl9jb21wYXJhdG9yO1xuICAgICAgICB2YXIgbWluQnVmZmVyZWQgPSBzZWxmLl9saW1pdCAmJiBzZWxmLl91bnB1Ymxpc2hlZEJ1ZmZlci5zaXplKCkgJiZcbiAgICAgICAgICBzZWxmLl91bnB1Ymxpc2hlZEJ1ZmZlci5nZXQoc2VsZi5fdW5wdWJsaXNoZWRCdWZmZXIubWluRWxlbWVudElkKCkpO1xuICAgICAgICB2YXIgbWF4QnVmZmVyZWQ7XG5cbiAgICAgICAgaWYgKHB1Ymxpc2hlZEJlZm9yZSkge1xuICAgICAgICAgIC8vIFVubGltaXRlZCBjYXNlIHdoZXJlIHRoZSBkb2N1bWVudCBzdGF5cyBpbiBwdWJsaXNoZWQgb25jZSBpdFxuICAgICAgICAgIC8vIG1hdGNoZXMgb3IgdGhlIGNhc2Ugd2hlbiB3ZSBkb24ndCBoYXZlIGVub3VnaCBtYXRjaGluZyBkb2NzIHRvXG4gICAgICAgICAgLy8gcHVibGlzaCBvciB0aGUgY2hhbmdlZCBidXQgbWF0Y2hpbmcgZG9jIHdpbGwgc3RheSBpbiBwdWJsaXNoZWRcbiAgICAgICAgICAvLyBhbnl3YXlzLlxuICAgICAgICAgIC8vXG4gICAgICAgICAgLy8gWFhYOiBXZSByZWx5IG9uIHRoZSBlbXB0aW5lc3Mgb2YgYnVmZmVyLiBCZSBzdXJlIHRvIG1haW50YWluIHRoZVxuICAgICAgICAgIC8vIGZhY3QgdGhhdCBidWZmZXIgY2FuJ3QgYmUgZW1wdHkgaWYgdGhlcmUgYXJlIG1hdGNoaW5nIGRvY3VtZW50cyBub3RcbiAgICAgICAgICAvLyBwdWJsaXNoZWQuIE5vdGFibHksIHdlIGRvbid0IHdhbnQgdG8gc2NoZWR1bGUgcmVwb2xsIGFuZCBjb250aW51ZVxuICAgICAgICAgIC8vIHJlbHlpbmcgb24gdGhpcyBwcm9wZXJ0eS5cbiAgICAgICAgICB2YXIgc3RheXNJblB1Ymxpc2hlZCA9ICEgc2VsZi5fbGltaXQgfHxcbiAgICAgICAgICAgIHNlbGYuX3VucHVibGlzaGVkQnVmZmVyLnNpemUoKSA9PT0gMCB8fFxuICAgICAgICAgICAgY29tcGFyYXRvcihuZXdEb2MsIG1pbkJ1ZmZlcmVkKSA8PSAwO1xuXG4gICAgICAgICAgaWYgKHN0YXlzSW5QdWJsaXNoZWQpIHtcbiAgICAgICAgICAgIHNlbGYuX2NoYW5nZVB1Ymxpc2hlZChpZCwgb2xkRG9jLCBuZXdEb2MpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBhZnRlciB0aGUgY2hhbmdlIGRvYyBkb2Vzbid0IHN0YXkgaW4gdGhlIHB1Ymxpc2hlZCwgcmVtb3ZlIGl0XG4gICAgICAgICAgICBzZWxmLl9yZW1vdmVQdWJsaXNoZWQoaWQpO1xuICAgICAgICAgICAgLy8gYnV0IGl0IGNhbiBtb3ZlIGludG8gYnVmZmVyZWQgbm93LCBjaGVjayBpdFxuICAgICAgICAgICAgbWF4QnVmZmVyZWQgPSBzZWxmLl91bnB1Ymxpc2hlZEJ1ZmZlci5nZXQoXG4gICAgICAgICAgICAgIHNlbGYuX3VucHVibGlzaGVkQnVmZmVyLm1heEVsZW1lbnRJZCgpKTtcblxuICAgICAgICAgICAgdmFyIHRvQnVmZmVyID0gc2VsZi5fc2FmZUFwcGVuZFRvQnVmZmVyIHx8XG4gICAgICAgICAgICAgICAgICAobWF4QnVmZmVyZWQgJiYgY29tcGFyYXRvcihuZXdEb2MsIG1heEJ1ZmZlcmVkKSA8PSAwKTtcblxuICAgICAgICAgICAgaWYgKHRvQnVmZmVyKSB7XG4gICAgICAgICAgICAgIHNlbGYuX2FkZEJ1ZmZlcmVkKGlkLCBuZXdEb2MpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgLy8gVGhyb3cgYXdheSBmcm9tIGJvdGggcHVibGlzaGVkIHNldCBhbmQgYnVmZmVyXG4gICAgICAgICAgICAgIHNlbGYuX3NhZmVBcHBlbmRUb0J1ZmZlciA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChidWZmZXJlZEJlZm9yZSkge1xuICAgICAgICAgIG9sZERvYyA9IHNlbGYuX3VucHVibGlzaGVkQnVmZmVyLmdldChpZCk7XG4gICAgICAgICAgLy8gcmVtb3ZlIHRoZSBvbGQgdmVyc2lvbiBtYW51YWxseSBpbnN0ZWFkIG9mIHVzaW5nIF9yZW1vdmVCdWZmZXJlZCBzb1xuICAgICAgICAgIC8vIHdlIGRvbid0IHRyaWdnZXIgdGhlIHF1ZXJ5aW5nIGltbWVkaWF0ZWx5LiAgaWYgd2UgZW5kIHRoaXMgYmxvY2tcbiAgICAgICAgICAvLyB3aXRoIHRoZSBidWZmZXIgZW1wdHksIHdlIHdpbGwgbmVlZCB0byB0cmlnZ2VyIHRoZSBxdWVyeSBwb2xsXG4gICAgICAgICAgLy8gbWFudWFsbHkgdG9vLlxuICAgICAgICAgIHNlbGYuX3VucHVibGlzaGVkQnVmZmVyLnJlbW92ZShpZCk7XG5cbiAgICAgICAgICB2YXIgbWF4UHVibGlzaGVkID0gc2VsZi5fcHVibGlzaGVkLmdldChcbiAgICAgICAgICAgIHNlbGYuX3B1Ymxpc2hlZC5tYXhFbGVtZW50SWQoKSk7XG4gICAgICAgICAgbWF4QnVmZmVyZWQgPSBzZWxmLl91bnB1Ymxpc2hlZEJ1ZmZlci5zaXplKCkgJiZcbiAgICAgICAgICAgICAgICBzZWxmLl91bnB1Ymxpc2hlZEJ1ZmZlci5nZXQoXG4gICAgICAgICAgICAgICAgICBzZWxmLl91bnB1Ymxpc2hlZEJ1ZmZlci5tYXhFbGVtZW50SWQoKSk7XG5cbiAgICAgICAgICAvLyB0aGUgYnVmZmVyZWQgZG9jIHdhcyB1cGRhdGVkLCBpdCBjb3VsZCBtb3ZlIHRvIHB1Ymxpc2hlZFxuICAgICAgICAgIHZhciB0b1B1Ymxpc2ggPSBjb21wYXJhdG9yKG5ld0RvYywgbWF4UHVibGlzaGVkKSA8IDA7XG5cbiAgICAgICAgICAvLyBvciBzdGF5cyBpbiBidWZmZXIgZXZlbiBhZnRlciB0aGUgY2hhbmdlXG4gICAgICAgICAgdmFyIHN0YXlzSW5CdWZmZXIgPSAoISB0b1B1Ymxpc2ggJiYgc2VsZi5fc2FmZUFwcGVuZFRvQnVmZmVyKSB8fFxuICAgICAgICAgICAgICAgICghdG9QdWJsaXNoICYmIG1heEJ1ZmZlcmVkICYmXG4gICAgICAgICAgICAgICAgIGNvbXBhcmF0b3IobmV3RG9jLCBtYXhCdWZmZXJlZCkgPD0gMCk7XG5cbiAgICAgICAgICBpZiAodG9QdWJsaXNoKSB7XG4gICAgICAgICAgICBzZWxmLl9hZGRQdWJsaXNoZWQoaWQsIG5ld0RvYyk7XG4gICAgICAgICAgfSBlbHNlIGlmIChzdGF5c0luQnVmZmVyKSB7XG4gICAgICAgICAgICAvLyBzdGF5cyBpbiBidWZmZXIgYnV0IGNoYW5nZXNcbiAgICAgICAgICAgIHNlbGYuX3VucHVibGlzaGVkQnVmZmVyLnNldChpZCwgbmV3RG9jKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gVGhyb3cgYXdheSBmcm9tIGJvdGggcHVibGlzaGVkIHNldCBhbmQgYnVmZmVyXG4gICAgICAgICAgICBzZWxmLl9zYWZlQXBwZW5kVG9CdWZmZXIgPSBmYWxzZTtcbiAgICAgICAgICAgIC8vIE5vcm1hbGx5IHRoaXMgY2hlY2sgd291bGQgaGF2ZSBiZWVuIGRvbmUgaW4gX3JlbW92ZUJ1ZmZlcmVkIGJ1dFxuICAgICAgICAgICAgLy8gd2UgZGlkbid0IHVzZSBpdCwgc28gd2UgbmVlZCB0byBkbyBpdCBvdXJzZWxmIG5vdy5cbiAgICAgICAgICAgIGlmICghIHNlbGYuX3VucHVibGlzaGVkQnVmZmVyLnNpemUoKSkge1xuICAgICAgICAgICAgICBzZWxmLl9uZWVkVG9Qb2xsUXVlcnkoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiY2FjaGVkQmVmb3JlIGltcGxpZXMgZWl0aGVyIG9mIHB1Ymxpc2hlZEJlZm9yZSBvciBidWZmZXJlZEJlZm9yZSBpcyB0cnVlLlwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9LFxuICBfZmV0Y2hNb2RpZmllZERvY3VtZW50czogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBNZXRlb3IuX25vWWllbGRzQWxsb3dlZChmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLl9yZWdpc3RlclBoYXNlQ2hhbmdlKFBIQVNFLkZFVENISU5HKTtcbiAgICAgIC8vIERlZmVyLCBiZWNhdXNlIG5vdGhpbmcgY2FsbGVkIGZyb20gdGhlIG9wbG9nIGVudHJ5IGhhbmRsZXIgbWF5IHlpZWxkLFxuICAgICAgLy8gYnV0IGZldGNoKCkgeWllbGRzLlxuICAgICAgTWV0ZW9yLmRlZmVyKGZpbmlzaElmTmVlZFRvUG9sbFF1ZXJ5KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgd2hpbGUgKCFzZWxmLl9zdG9wcGVkICYmICFzZWxmLl9uZWVkVG9GZXRjaC5lbXB0eSgpKSB7XG4gICAgICAgICAgaWYgKHNlbGYuX3BoYXNlID09PSBQSEFTRS5RVUVSWUlORykge1xuICAgICAgICAgICAgLy8gV2hpbGUgZmV0Y2hpbmcsIHdlIGRlY2lkZWQgdG8gZ28gaW50byBRVUVSWUlORyBtb2RlLCBhbmQgdGhlbiB3ZVxuICAgICAgICAgICAgLy8gc2F3IGFub3RoZXIgb3Bsb2cgZW50cnksIHNvIF9uZWVkVG9GZXRjaCBpcyBub3QgZW1wdHkuIEJ1dCB3ZVxuICAgICAgICAgICAgLy8gc2hvdWxkbid0IGZldGNoIHRoZXNlIGRvY3VtZW50cyB1bnRpbCBBRlRFUiB0aGUgcXVlcnkgaXMgZG9uZS5cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIEJlaW5nIGluIHN0ZWFkeSBwaGFzZSBoZXJlIHdvdWxkIGJlIHN1cnByaXNpbmcuXG4gICAgICAgICAgaWYgKHNlbGYuX3BoYXNlICE9PSBQSEFTRS5GRVRDSElORylcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInBoYXNlIGluIGZldGNoTW9kaWZpZWREb2N1bWVudHM6IFwiICsgc2VsZi5fcGhhc2UpO1xuXG4gICAgICAgICAgc2VsZi5fY3VycmVudGx5RmV0Y2hpbmcgPSBzZWxmLl9uZWVkVG9GZXRjaDtcbiAgICAgICAgICB2YXIgdGhpc0dlbmVyYXRpb24gPSArK3NlbGYuX2ZldGNoR2VuZXJhdGlvbjtcbiAgICAgICAgICBzZWxmLl9uZWVkVG9GZXRjaCA9IG5ldyBMb2NhbENvbGxlY3Rpb24uX0lkTWFwO1xuICAgICAgICAgIHZhciB3YWl0aW5nID0gMDtcbiAgICAgICAgICB2YXIgZnV0ID0gbmV3IEZ1dHVyZTtcbiAgICAgICAgICAvLyBUaGlzIGxvb3AgaXMgc2FmZSwgYmVjYXVzZSBfY3VycmVudGx5RmV0Y2hpbmcgd2lsbCBub3QgYmUgdXBkYXRlZFxuICAgICAgICAgIC8vIGR1cmluZyB0aGlzIGxvb3AgKGluIGZhY3QsIGl0IGlzIG5ldmVyIG11dGF0ZWQpLlxuICAgICAgICAgIHNlbGYuX2N1cnJlbnRseUZldGNoaW5nLmZvckVhY2goZnVuY3Rpb24gKG9wLCBpZCkge1xuICAgICAgICAgICAgd2FpdGluZysrO1xuICAgICAgICAgICAgc2VsZi5fbW9uZ29IYW5kbGUuX2RvY0ZldGNoZXIuZmV0Y2goXG4gICAgICAgICAgICAgIHNlbGYuX2N1cnNvckRlc2NyaXB0aW9uLmNvbGxlY3Rpb25OYW1lLCBpZCwgb3AsXG4gICAgICAgICAgICAgIGZpbmlzaElmTmVlZFRvUG9sbFF1ZXJ5KGZ1bmN0aW9uIChlcnIsIGRvYykge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIE1ldGVvci5fZGVidWcoXCJHb3QgZXhjZXB0aW9uIHdoaWxlIGZldGNoaW5nIGRvY3VtZW50c1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycik7XG4gICAgICAgICAgICAgICAgICAgIC8vIElmIHdlIGdldCBhbiBlcnJvciBmcm9tIHRoZSBmZXRjaGVyIChlZywgdHJvdWJsZVxuICAgICAgICAgICAgICAgICAgICAvLyBjb25uZWN0aW5nIHRvIE1vbmdvKSwgbGV0J3MganVzdCBhYmFuZG9uIHRoZSBmZXRjaCBwaGFzZVxuICAgICAgICAgICAgICAgICAgICAvLyBhbHRvZ2V0aGVyIGFuZCBmYWxsIGJhY2sgdG8gcG9sbGluZy4gSXQncyBub3QgbGlrZSB3ZSdyZVxuICAgICAgICAgICAgICAgICAgICAvLyBnZXR0aW5nIGxpdmUgdXBkYXRlcyBhbnl3YXkuXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLl9waGFzZSAhPT0gUEhBU0UuUVVFUllJTkcpIHtcbiAgICAgICAgICAgICAgICAgICAgICBzZWxmLl9uZWVkVG9Qb2xsUXVlcnkoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICghc2VsZi5fc3RvcHBlZCAmJiBzZWxmLl9waGFzZSA9PT0gUEhBU0UuRkVUQ0hJTkdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgc2VsZi5fZmV0Y2hHZW5lcmF0aW9uID09PSB0aGlzR2VuZXJhdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAvLyBXZSByZS1jaGVjayB0aGUgZ2VuZXJhdGlvbiBpbiBjYXNlIHdlJ3ZlIGhhZCBhbiBleHBsaWNpdFxuICAgICAgICAgICAgICAgICAgICAvLyBfcG9sbFF1ZXJ5IGNhbGwgKGVnLCBpbiBhbm90aGVyIGZpYmVyKSB3aGljaCBzaG91bGRcbiAgICAgICAgICAgICAgICAgICAgLy8gZWZmZWN0aXZlbHkgY2FuY2VsIHRoaXMgcm91bmQgb2YgZmV0Y2hlcy4gIChfcG9sbFF1ZXJ5XG4gICAgICAgICAgICAgICAgICAgIC8vIGluY3JlbWVudHMgdGhlIGdlbmVyYXRpb24uKVxuICAgICAgICAgICAgICAgICAgICBzZWxmLl9oYW5kbGVEb2MoaWQsIGRvYyk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICAgIHdhaXRpbmctLTtcbiAgICAgICAgICAgICAgICAgIC8vIEJlY2F1c2UgZmV0Y2goKSBuZXZlciBjYWxscyBpdHMgY2FsbGJhY2sgc3luY2hyb25vdXNseSxcbiAgICAgICAgICAgICAgICAgIC8vIHRoaXMgaXMgc2FmZSAoaWUsIHdlIHdvbid0IGNhbGwgZnV0LnJldHVybigpIGJlZm9yZSB0aGVcbiAgICAgICAgICAgICAgICAgIC8vIGZvckVhY2ggaXMgZG9uZSkuXG4gICAgICAgICAgICAgICAgICBpZiAod2FpdGluZyA9PT0gMClcbiAgICAgICAgICAgICAgICAgICAgZnV0LnJldHVybigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGZ1dC53YWl0KCk7XG4gICAgICAgICAgLy8gRXhpdCBub3cgaWYgd2UndmUgaGFkIGEgX3BvbGxRdWVyeSBjYWxsIChoZXJlIG9yIGluIGFub3RoZXIgZmliZXIpLlxuICAgICAgICAgIGlmIChzZWxmLl9waGFzZSA9PT0gUEhBU0UuUVVFUllJTkcpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgc2VsZi5fY3VycmVudGx5RmV0Y2hpbmcgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIC8vIFdlJ3JlIGRvbmUgZmV0Y2hpbmcsIHNvIHdlIGNhbiBiZSBzdGVhZHksIHVubGVzcyB3ZSd2ZSBoYWQgYVxuICAgICAgICAvLyBfcG9sbFF1ZXJ5IGNhbGwgKGhlcmUgb3IgaW4gYW5vdGhlciBmaWJlcikuXG4gICAgICAgIGlmIChzZWxmLl9waGFzZSAhPT0gUEhBU0UuUVVFUllJTkcpXG4gICAgICAgICAgc2VsZi5fYmVTdGVhZHkoKTtcbiAgICAgIH0pKTtcbiAgICB9KTtcbiAgfSxcbiAgX2JlU3RlYWR5OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIE1ldGVvci5fbm9ZaWVsZHNBbGxvd2VkKGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYuX3JlZ2lzdGVyUGhhc2VDaGFuZ2UoUEhBU0UuU1RFQURZKTtcbiAgICAgIHZhciB3cml0ZXMgPSBzZWxmLl93cml0ZXNUb0NvbW1pdFdoZW5XZVJlYWNoU3RlYWR5O1xuICAgICAgc2VsZi5fd3JpdGVzVG9Db21taXRXaGVuV2VSZWFjaFN0ZWFkeSA9IFtdO1xuICAgICAgc2VsZi5fbXVsdGlwbGV4ZXIub25GbHVzaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIF8uZWFjaCh3cml0ZXMsIGZ1bmN0aW9uICh3KSB7XG4gICAgICAgICAgdy5jb21taXR0ZWQoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSxcbiAgX2hhbmRsZU9wbG9nRW50cnlRdWVyeWluZzogZnVuY3Rpb24gKG9wKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIE1ldGVvci5fbm9ZaWVsZHNBbGxvd2VkKGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYuX25lZWRUb0ZldGNoLnNldChpZEZvck9wKG9wKSwgb3ApO1xuICAgIH0pO1xuICB9LFxuICBfaGFuZGxlT3Bsb2dFbnRyeVN0ZWFkeU9yRmV0Y2hpbmc6IGZ1bmN0aW9uIChvcCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBNZXRlb3IuX25vWWllbGRzQWxsb3dlZChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgaWQgPSBpZEZvck9wKG9wKTtcbiAgICAgIC8vIElmIHdlJ3JlIGFscmVhZHkgZmV0Y2hpbmcgdGhpcyBvbmUsIG9yIGFib3V0IHRvLCB3ZSBjYW4ndCBvcHRpbWl6ZTtcbiAgICAgIC8vIG1ha2Ugc3VyZSB0aGF0IHdlIGZldGNoIGl0IGFnYWluIGlmIG5lY2Vzc2FyeS5cbiAgICAgIGlmIChzZWxmLl9waGFzZSA9PT0gUEhBU0UuRkVUQ0hJTkcgJiZcbiAgICAgICAgICAoKHNlbGYuX2N1cnJlbnRseUZldGNoaW5nICYmIHNlbGYuX2N1cnJlbnRseUZldGNoaW5nLmhhcyhpZCkpIHx8XG4gICAgICAgICAgIHNlbGYuX25lZWRUb0ZldGNoLmhhcyhpZCkpKSB7XG4gICAgICAgIHNlbGYuX25lZWRUb0ZldGNoLnNldChpZCwgb3ApO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChvcC5vcCA9PT0gJ2QnKSB7XG4gICAgICAgIGlmIChzZWxmLl9wdWJsaXNoZWQuaGFzKGlkKSB8fFxuICAgICAgICAgICAgKHNlbGYuX2xpbWl0ICYmIHNlbGYuX3VucHVibGlzaGVkQnVmZmVyLmhhcyhpZCkpKVxuICAgICAgICAgIHNlbGYuX3JlbW92ZU1hdGNoaW5nKGlkKTtcbiAgICAgIH0gZWxzZSBpZiAob3Aub3AgPT09ICdpJykge1xuICAgICAgICBpZiAoc2VsZi5fcHVibGlzaGVkLmhhcyhpZCkpXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiaW5zZXJ0IGZvdW5kIGZvciBhbHJlYWR5LWV4aXN0aW5nIElEIGluIHB1Ymxpc2hlZFwiKTtcbiAgICAgICAgaWYgKHNlbGYuX3VucHVibGlzaGVkQnVmZmVyICYmIHNlbGYuX3VucHVibGlzaGVkQnVmZmVyLmhhcyhpZCkpXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiaW5zZXJ0IGZvdW5kIGZvciBhbHJlYWR5LWV4aXN0aW5nIElEIGluIGJ1ZmZlclwiKTtcblxuICAgICAgICAvLyBYWFggd2hhdCBpZiBzZWxlY3RvciB5aWVsZHM/ICBmb3Igbm93IGl0IGNhbid0IGJ1dCBsYXRlciBpdCBjb3VsZFxuICAgICAgICAvLyBoYXZlICR3aGVyZVxuICAgICAgICBpZiAoc2VsZi5fbWF0Y2hlci5kb2N1bWVudE1hdGNoZXMob3AubykucmVzdWx0KVxuICAgICAgICAgIHNlbGYuX2FkZE1hdGNoaW5nKG9wLm8pO1xuICAgICAgfSBlbHNlIGlmIChvcC5vcCA9PT0gJ3UnKSB7XG4gICAgICAgIC8vIElzIHRoaXMgYSBtb2RpZmllciAoJHNldC8kdW5zZXQsIHdoaWNoIG1heSByZXF1aXJlIHVzIHRvIHBvbGwgdGhlXG4gICAgICAgIC8vIGRhdGFiYXNlIHRvIGZpZ3VyZSBvdXQgaWYgdGhlIHdob2xlIGRvY3VtZW50IG1hdGNoZXMgdGhlIHNlbGVjdG9yKSBvclxuICAgICAgICAvLyBhIHJlcGxhY2VtZW50IChpbiB3aGljaCBjYXNlIHdlIGNhbiBqdXN0IGRpcmVjdGx5IHJlLWV2YWx1YXRlIHRoZVxuICAgICAgICAvLyBzZWxlY3Rvcik/XG4gICAgICAgIHZhciBpc1JlcGxhY2UgPSAhXy5oYXMob3AubywgJyRzZXQnKSAmJiAhXy5oYXMob3AubywgJyR1bnNldCcpO1xuICAgICAgICAvLyBJZiB0aGlzIG1vZGlmaWVyIG1vZGlmaWVzIHNvbWV0aGluZyBpbnNpZGUgYW4gRUpTT04gY3VzdG9tIHR5cGUgKGllLFxuICAgICAgICAvLyBhbnl0aGluZyB3aXRoIEVKU09OJCksIHRoZW4gd2UgY2FuJ3QgdHJ5IHRvIHVzZVxuICAgICAgICAvLyBMb2NhbENvbGxlY3Rpb24uX21vZGlmeSwgc2luY2UgdGhhdCBqdXN0IG11dGF0ZXMgdGhlIEVKU09OIGVuY29kaW5nLFxuICAgICAgICAvLyBub3QgdGhlIGFjdHVhbCBvYmplY3QuXG4gICAgICAgIHZhciBjYW5EaXJlY3RseU1vZGlmeURvYyA9XG4gICAgICAgICAgIWlzUmVwbGFjZSAmJiBtb2RpZmllckNhbkJlRGlyZWN0bHlBcHBsaWVkKG9wLm8pO1xuXG4gICAgICAgIHZhciBwdWJsaXNoZWRCZWZvcmUgPSBzZWxmLl9wdWJsaXNoZWQuaGFzKGlkKTtcbiAgICAgICAgdmFyIGJ1ZmZlcmVkQmVmb3JlID0gc2VsZi5fbGltaXQgJiYgc2VsZi5fdW5wdWJsaXNoZWRCdWZmZXIuaGFzKGlkKTtcblxuICAgICAgICBpZiAoaXNSZXBsYWNlKSB7XG4gICAgICAgICAgc2VsZi5faGFuZGxlRG9jKGlkLCBfLmV4dGVuZCh7X2lkOiBpZH0sIG9wLm8pKTtcbiAgICAgICAgfSBlbHNlIGlmICgocHVibGlzaGVkQmVmb3JlIHx8IGJ1ZmZlcmVkQmVmb3JlKSAmJlxuICAgICAgICAgICAgICAgICAgIGNhbkRpcmVjdGx5TW9kaWZ5RG9jKSB7XG4gICAgICAgICAgLy8gT2ggZ3JlYXQsIHdlIGFjdHVhbGx5IGtub3cgd2hhdCB0aGUgZG9jdW1lbnQgaXMsIHNvIHdlIGNhbiBhcHBseVxuICAgICAgICAgIC8vIHRoaXMgZGlyZWN0bHkuXG4gICAgICAgICAgdmFyIG5ld0RvYyA9IHNlbGYuX3B1Ymxpc2hlZC5oYXMoaWQpXG4gICAgICAgICAgICA/IHNlbGYuX3B1Ymxpc2hlZC5nZXQoaWQpIDogc2VsZi5fdW5wdWJsaXNoZWRCdWZmZXIuZ2V0KGlkKTtcbiAgICAgICAgICBuZXdEb2MgPSBFSlNPTi5jbG9uZShuZXdEb2MpO1xuXG4gICAgICAgICAgbmV3RG9jLl9pZCA9IGlkO1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBMb2NhbENvbGxlY3Rpb24uX21vZGlmeShuZXdEb2MsIG9wLm8pO1xuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGlmIChlLm5hbWUgIT09IFwiTWluaW1vbmdvRXJyb3JcIilcbiAgICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgICAgIC8vIFdlIGRpZG4ndCB1bmRlcnN0YW5kIHRoZSBtb2RpZmllci4gIFJlLWZldGNoLlxuICAgICAgICAgICAgc2VsZi5fbmVlZFRvRmV0Y2guc2V0KGlkLCBvcCk7XG4gICAgICAgICAgICBpZiAoc2VsZi5fcGhhc2UgPT09IFBIQVNFLlNURUFEWSkge1xuICAgICAgICAgICAgICBzZWxmLl9mZXRjaE1vZGlmaWVkRG9jdW1lbnRzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIHNlbGYuX2hhbmRsZURvYyhpZCwgc2VsZi5fc2hhcmVkUHJvamVjdGlvbkZuKG5ld0RvYykpO1xuICAgICAgICB9IGVsc2UgaWYgKCFjYW5EaXJlY3RseU1vZGlmeURvYyB8fFxuICAgICAgICAgICAgICAgICAgIHNlbGYuX21hdGNoZXIuY2FuQmVjb21lVHJ1ZUJ5TW9kaWZpZXIob3AubykgfHxcbiAgICAgICAgICAgICAgICAgICAoc2VsZi5fc29ydGVyICYmIHNlbGYuX3NvcnRlci5hZmZlY3RlZEJ5TW9kaWZpZXIob3AubykpKSB7XG4gICAgICAgICAgc2VsZi5fbmVlZFRvRmV0Y2guc2V0KGlkLCBvcCk7XG4gICAgICAgICAgaWYgKHNlbGYuX3BoYXNlID09PSBQSEFTRS5TVEVBRFkpXG4gICAgICAgICAgICBzZWxmLl9mZXRjaE1vZGlmaWVkRG9jdW1lbnRzKCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IEVycm9yKFwiWFhYIFNVUlBSSVNJTkcgT1BFUkFUSU9OOiBcIiArIG9wKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcbiAgLy8gWWllbGRzIVxuICBfcnVuSW5pdGlhbFF1ZXJ5OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIGlmIChzZWxmLl9zdG9wcGVkKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwib3Bsb2cgc3RvcHBlZCBzdXJwcmlzaW5nbHkgZWFybHlcIik7XG5cbiAgICBzZWxmLl9ydW5RdWVyeSh7aW5pdGlhbDogdHJ1ZX0pOyAgLy8geWllbGRzXG5cbiAgICBpZiAoc2VsZi5fc3RvcHBlZClcbiAgICAgIHJldHVybjsgIC8vIGNhbiBoYXBwZW4gb24gcXVlcnlFcnJvclxuXG4gICAgLy8gQWxsb3cgb2JzZXJ2ZUNoYW5nZXMgY2FsbHMgdG8gcmV0dXJuLiAoQWZ0ZXIgdGhpcywgaXQncyBwb3NzaWJsZSBmb3JcbiAgICAvLyBzdG9wKCkgdG8gYmUgY2FsbGVkLilcbiAgICBzZWxmLl9tdWx0aXBsZXhlci5yZWFkeSgpO1xuXG4gICAgc2VsZi5fZG9uZVF1ZXJ5aW5nKCk7ICAvLyB5aWVsZHNcbiAgfSxcblxuICAvLyBJbiB2YXJpb3VzIGNpcmN1bXN0YW5jZXMsIHdlIG1heSBqdXN0IHdhbnQgdG8gc3RvcCBwcm9jZXNzaW5nIHRoZSBvcGxvZyBhbmRcbiAgLy8gcmUtcnVuIHRoZSBpbml0aWFsIHF1ZXJ5LCBqdXN0IGFzIGlmIHdlIHdlcmUgYSBQb2xsaW5nT2JzZXJ2ZURyaXZlci5cbiAgLy9cbiAgLy8gVGhpcyBmdW5jdGlvbiBtYXkgbm90IGJsb2NrLCBiZWNhdXNlIGl0IGlzIGNhbGxlZCBmcm9tIGFuIG9wbG9nIGVudHJ5XG4gIC8vIGhhbmRsZXIuXG4gIC8vXG4gIC8vIFhYWCBXZSBzaG91bGQgY2FsbCB0aGlzIHdoZW4gd2UgZGV0ZWN0IHRoYXQgd2UndmUgYmVlbiBpbiBGRVRDSElORyBmb3IgXCJ0b29cbiAgLy8gbG9uZ1wiLlxuICAvL1xuICAvLyBYWFggV2Ugc2hvdWxkIGNhbGwgdGhpcyB3aGVuIHdlIGRldGVjdCBNb25nbyBmYWlsb3ZlciAoc2luY2UgdGhhdCBtaWdodFxuICAvLyBtZWFuIHRoYXQgc29tZSBvZiB0aGUgb3Bsb2cgZW50cmllcyB3ZSBoYXZlIHByb2Nlc3NlZCBoYXZlIGJlZW4gcm9sbGVkXG4gIC8vIGJhY2spLiBUaGUgTm9kZSBNb25nbyBkcml2ZXIgaXMgaW4gdGhlIG1pZGRsZSBvZiBhIGJ1bmNoIG9mIGh1Z2VcbiAgLy8gcmVmYWN0b3JpbmdzLCBpbmNsdWRpbmcgdGhlIHdheSB0aGF0IGl0IG5vdGlmaWVzIHlvdSB3aGVuIHByaW1hcnlcbiAgLy8gY2hhbmdlcy4gV2lsbCBwdXQgb2ZmIGltcGxlbWVudGluZyB0aGlzIHVudGlsIGRyaXZlciAxLjQgaXMgb3V0LlxuICBfcG9sbFF1ZXJ5OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIE1ldGVvci5fbm9ZaWVsZHNBbGxvd2VkKGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChzZWxmLl9zdG9wcGVkKVxuICAgICAgICByZXR1cm47XG5cbiAgICAgIC8vIFlheSwgd2UgZ2V0IHRvIGZvcmdldCBhYm91dCBhbGwgdGhlIHRoaW5ncyB3ZSB0aG91Z2h0IHdlIGhhZCB0byBmZXRjaC5cbiAgICAgIHNlbGYuX25lZWRUb0ZldGNoID0gbmV3IExvY2FsQ29sbGVjdGlvbi5fSWRNYXA7XG4gICAgICBzZWxmLl9jdXJyZW50bHlGZXRjaGluZyA9IG51bGw7XG4gICAgICArK3NlbGYuX2ZldGNoR2VuZXJhdGlvbjsgIC8vIGlnbm9yZSBhbnkgaW4tZmxpZ2h0IGZldGNoZXNcbiAgICAgIHNlbGYuX3JlZ2lzdGVyUGhhc2VDaGFuZ2UoUEhBU0UuUVVFUllJTkcpO1xuXG4gICAgICAvLyBEZWZlciBzbyB0aGF0IHdlIGRvbid0IHlpZWxkLiAgV2UgZG9uJ3QgbmVlZCBmaW5pc2hJZk5lZWRUb1BvbGxRdWVyeVxuICAgICAgLy8gaGVyZSBiZWNhdXNlIFN3aXRjaGVkVG9RdWVyeSBpcyBub3QgdGhyb3duIGluIFFVRVJZSU5HIG1vZGUuXG4gICAgICBNZXRlb3IuZGVmZXIoZnVuY3Rpb24gKCkge1xuICAgICAgICBzZWxmLl9ydW5RdWVyeSgpO1xuICAgICAgICBzZWxmLl9kb25lUXVlcnlpbmcoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9LFxuXG4gIC8vIFlpZWxkcyFcbiAgX3J1blF1ZXJ5OiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICB2YXIgbmV3UmVzdWx0cywgbmV3QnVmZmVyO1xuXG4gICAgLy8gVGhpcyB3aGlsZSBsb29wIGlzIGp1c3QgdG8gcmV0cnkgZmFpbHVyZXMuXG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIC8vIElmIHdlJ3ZlIGJlZW4gc3RvcHBlZCwgd2UgZG9uJ3QgaGF2ZSB0byBydW4gYW55dGhpbmcgYW55IG1vcmUuXG4gICAgICBpZiAoc2VsZi5fc3RvcHBlZClcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICBuZXdSZXN1bHRzID0gbmV3IExvY2FsQ29sbGVjdGlvbi5fSWRNYXA7XG4gICAgICBuZXdCdWZmZXIgPSBuZXcgTG9jYWxDb2xsZWN0aW9uLl9JZE1hcDtcblxuICAgICAgLy8gUXVlcnkgMnggZG9jdW1lbnRzIGFzIHRoZSBoYWxmIGV4Y2x1ZGVkIGZyb20gdGhlIG9yaWdpbmFsIHF1ZXJ5IHdpbGwgZ29cbiAgICAgIC8vIGludG8gdW5wdWJsaXNoZWQgYnVmZmVyIHRvIHJlZHVjZSBhZGRpdGlvbmFsIE1vbmdvIGxvb2t1cHMgaW4gY2FzZXNcbiAgICAgIC8vIHdoZW4gZG9jdW1lbnRzIGFyZSByZW1vdmVkIGZyb20gdGhlIHB1Ymxpc2hlZCBzZXQgYW5kIG5lZWQgYVxuICAgICAgLy8gcmVwbGFjZW1lbnQuXG4gICAgICAvLyBYWFggbmVlZHMgbW9yZSB0aG91Z2h0IG9uIG5vbi16ZXJvIHNraXBcbiAgICAgIC8vIFhYWCAyIGlzIGEgXCJtYWdpYyBudW1iZXJcIiBtZWFuaW5nIHRoZXJlIGlzIGFuIGV4dHJhIGNodW5rIG9mIGRvY3MgZm9yXG4gICAgICAvLyBidWZmZXIgaWYgc3VjaCBpcyBuZWVkZWQuXG4gICAgICB2YXIgY3Vyc29yID0gc2VsZi5fY3Vyc29yRm9yUXVlcnkoeyBsaW1pdDogc2VsZi5fbGltaXQgKiAyIH0pO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY3Vyc29yLmZvckVhY2goZnVuY3Rpb24gKGRvYywgaSkgeyAgLy8geWllbGRzXG4gICAgICAgICAgaWYgKCFzZWxmLl9saW1pdCB8fCBpIDwgc2VsZi5fbGltaXQpIHtcbiAgICAgICAgICAgIG5ld1Jlc3VsdHMuc2V0KGRvYy5faWQsIGRvYyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5ld0J1ZmZlci5zZXQoZG9jLl9pZCwgZG9jKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBicmVhaztcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMuaW5pdGlhbCAmJiB0eXBlb2YoZS5jb2RlKSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAvLyBUaGlzIGlzIGFuIGVycm9yIGRvY3VtZW50IHNlbnQgdG8gdXMgYnkgbW9uZ29kLCBub3QgYSBjb25uZWN0aW9uXG4gICAgICAgICAgLy8gZXJyb3IgZ2VuZXJhdGVkIGJ5IHRoZSBjbGllbnQuIEFuZCB3ZSd2ZSBuZXZlciBzZWVuIHRoaXMgcXVlcnkgd29ya1xuICAgICAgICAgIC8vIHN1Y2Nlc3NmdWxseS4gUHJvYmFibHkgaXQncyBhIGJhZCBzZWxlY3RvciBvciBzb21ldGhpbmcsIHNvIHdlXG4gICAgICAgICAgLy8gc2hvdWxkIE5PVCByZXRyeS4gSW5zdGVhZCwgd2Ugc2hvdWxkIGhhbHQgdGhlIG9ic2VydmUgKHdoaWNoIGVuZHNcbiAgICAgICAgICAvLyB1cCBjYWxsaW5nIGBzdG9wYCBvbiB1cykuXG4gICAgICAgICAgc2VsZi5fbXVsdGlwbGV4ZXIucXVlcnlFcnJvcihlKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBEdXJpbmcgZmFpbG92ZXIgKGVnKSBpZiB3ZSBnZXQgYW4gZXhjZXB0aW9uIHdlIHNob3VsZCBsb2cgYW5kIHJldHJ5XG4gICAgICAgIC8vIGluc3RlYWQgb2YgY3Jhc2hpbmcuXG4gICAgICAgIE1ldGVvci5fZGVidWcoXCJHb3QgZXhjZXB0aW9uIHdoaWxlIHBvbGxpbmcgcXVlcnlcIiwgZSk7XG4gICAgICAgIE1ldGVvci5fc2xlZXBGb3JNcygxMDApO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzZWxmLl9zdG9wcGVkKVxuICAgICAgcmV0dXJuO1xuXG4gICAgc2VsZi5fcHVibGlzaE5ld1Jlc3VsdHMobmV3UmVzdWx0cywgbmV3QnVmZmVyKTtcbiAgfSxcblxuICAvLyBUcmFuc2l0aW9ucyB0byBRVUVSWUlORyBhbmQgcnVucyBhbm90aGVyIHF1ZXJ5LCBvciAoaWYgYWxyZWFkeSBpbiBRVUVSWUlORylcbiAgLy8gZW5zdXJlcyB0aGF0IHdlIHdpbGwgcXVlcnkgYWdhaW4gbGF0ZXIuXG4gIC8vXG4gIC8vIFRoaXMgZnVuY3Rpb24gbWF5IG5vdCBibG9jaywgYmVjYXVzZSBpdCBpcyBjYWxsZWQgZnJvbSBhbiBvcGxvZyBlbnRyeVxuICAvLyBoYW5kbGVyLiBIb3dldmVyLCBpZiB3ZSB3ZXJlIG5vdCBhbHJlYWR5IGluIHRoZSBRVUVSWUlORyBwaGFzZSwgaXQgdGhyb3dzXG4gIC8vIGFuIGV4Y2VwdGlvbiB0aGF0IGlzIGNhdWdodCBieSB0aGUgY2xvc2VzdCBzdXJyb3VuZGluZ1xuICAvLyBmaW5pc2hJZk5lZWRUb1BvbGxRdWVyeSBjYWxsOyB0aGlzIGVuc3VyZXMgdGhhdCB3ZSBkb24ndCBjb250aW51ZSBydW5uaW5nXG4gIC8vIGNsb3NlIHRoYXQgd2FzIGRlc2lnbmVkIGZvciBhbm90aGVyIHBoYXNlIGluc2lkZSBQSEFTRS5RVUVSWUlORy5cbiAgLy9cbiAgLy8gKEl0J3MgYWxzbyBuZWNlc3Nhcnkgd2hlbmV2ZXIgbG9naWMgaW4gdGhpcyBmaWxlIHlpZWxkcyB0byBjaGVjayB0aGF0IG90aGVyXG4gIC8vIHBoYXNlcyBoYXZlbid0IHB1dCB1cyBpbnRvIFFVRVJZSU5HIG1vZGUsIHRob3VnaDsgZWcsXG4gIC8vIF9mZXRjaE1vZGlmaWVkRG9jdW1lbnRzIGRvZXMgdGhpcy4pXG4gIF9uZWVkVG9Qb2xsUXVlcnk6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgTWV0ZW9yLl9ub1lpZWxkc0FsbG93ZWQoZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHNlbGYuX3N0b3BwZWQpXG4gICAgICAgIHJldHVybjtcblxuICAgICAgLy8gSWYgd2UncmUgbm90IGFscmVhZHkgaW4gdGhlIG1pZGRsZSBvZiBhIHF1ZXJ5LCB3ZSBjYW4gcXVlcnkgbm93XG4gICAgICAvLyAocG9zc2libHkgcGF1c2luZyBGRVRDSElORykuXG4gICAgICBpZiAoc2VsZi5fcGhhc2UgIT09IFBIQVNFLlFVRVJZSU5HKSB7XG4gICAgICAgIHNlbGYuX3BvbGxRdWVyeSgpO1xuICAgICAgICB0aHJvdyBuZXcgU3dpdGNoZWRUb1F1ZXJ5O1xuICAgICAgfVxuXG4gICAgICAvLyBXZSdyZSBjdXJyZW50bHkgaW4gUVVFUllJTkcuIFNldCBhIGZsYWcgdG8gZW5zdXJlIHRoYXQgd2UgcnVuIGFub3RoZXJcbiAgICAgIC8vIHF1ZXJ5IHdoZW4gd2UncmUgZG9uZS5cbiAgICAgIHNlbGYuX3JlcXVlcnlXaGVuRG9uZVRoaXNRdWVyeSA9IHRydWU7XG4gICAgfSk7XG4gIH0sXG5cbiAgLy8gWWllbGRzIVxuICBfZG9uZVF1ZXJ5aW5nOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgaWYgKHNlbGYuX3N0b3BwZWQpXG4gICAgICByZXR1cm47XG4gICAgc2VsZi5fbW9uZ29IYW5kbGUuX29wbG9nSGFuZGxlLndhaXRVbnRpbENhdWdodFVwKCk7ICAvLyB5aWVsZHNcbiAgICBpZiAoc2VsZi5fc3RvcHBlZClcbiAgICAgIHJldHVybjtcbiAgICBpZiAoc2VsZi5fcGhhc2UgIT09IFBIQVNFLlFVRVJZSU5HKVxuICAgICAgdGhyb3cgRXJyb3IoXCJQaGFzZSB1bmV4cGVjdGVkbHkgXCIgKyBzZWxmLl9waGFzZSk7XG5cbiAgICBNZXRlb3IuX25vWWllbGRzQWxsb3dlZChmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoc2VsZi5fcmVxdWVyeVdoZW5Eb25lVGhpc1F1ZXJ5KSB7XG4gICAgICAgIHNlbGYuX3JlcXVlcnlXaGVuRG9uZVRoaXNRdWVyeSA9IGZhbHNlO1xuICAgICAgICBzZWxmLl9wb2xsUXVlcnkoKTtcbiAgICAgIH0gZWxzZSBpZiAoc2VsZi5fbmVlZFRvRmV0Y2guZW1wdHkoKSkge1xuICAgICAgICBzZWxmLl9iZVN0ZWFkeSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2VsZi5fZmV0Y2hNb2RpZmllZERvY3VtZW50cygpO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuXG4gIF9jdXJzb3JGb3JRdWVyeTogZnVuY3Rpb24gKG9wdGlvbnNPdmVyd3JpdGUpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgcmV0dXJuIE1ldGVvci5fbm9ZaWVsZHNBbGxvd2VkKGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIFRoZSBxdWVyeSB3ZSBydW4gaXMgYWxtb3N0IHRoZSBzYW1lIGFzIHRoZSBjdXJzb3Igd2UgYXJlIG9ic2VydmluZyxcbiAgICAgIC8vIHdpdGggYSBmZXcgY2hhbmdlcy4gV2UgbmVlZCB0byByZWFkIGFsbCB0aGUgZmllbGRzIHRoYXQgYXJlIHJlbGV2YW50IHRvXG4gICAgICAvLyB0aGUgc2VsZWN0b3IsIG5vdCBqdXN0IHRoZSBmaWVsZHMgd2UgYXJlIGdvaW5nIHRvIHB1Ymxpc2ggKHRoYXQncyB0aGVcbiAgICAgIC8vIFwic2hhcmVkXCIgcHJvamVjdGlvbikuIEFuZCB3ZSBkb24ndCB3YW50IHRvIGFwcGx5IGFueSB0cmFuc2Zvcm0gaW4gdGhlXG4gICAgICAvLyBjdXJzb3IsIGJlY2F1c2Ugb2JzZXJ2ZUNoYW5nZXMgc2hvdWxkbid0IHVzZSB0aGUgdHJhbnNmb3JtLlxuICAgICAgdmFyIG9wdGlvbnMgPSBfLmNsb25lKHNlbGYuX2N1cnNvckRlc2NyaXB0aW9uLm9wdGlvbnMpO1xuXG4gICAgICAvLyBBbGxvdyB0aGUgY2FsbGVyIHRvIG1vZGlmeSB0aGUgb3B0aW9ucy4gVXNlZnVsIHRvIHNwZWNpZnkgZGlmZmVyZW50XG4gICAgICAvLyBza2lwIGFuZCBsaW1pdCB2YWx1ZXMuXG4gICAgICBfLmV4dGVuZChvcHRpb25zLCBvcHRpb25zT3ZlcndyaXRlKTtcblxuICAgICAgb3B0aW9ucy5maWVsZHMgPSBzZWxmLl9zaGFyZWRQcm9qZWN0aW9uO1xuICAgICAgZGVsZXRlIG9wdGlvbnMudHJhbnNmb3JtO1xuICAgICAgLy8gV2UgYXJlIE5PVCBkZWVwIGNsb25pbmcgZmllbGRzIG9yIHNlbGVjdG9yIGhlcmUsIHdoaWNoIHNob3VsZCBiZSBPSy5cbiAgICAgIHZhciBkZXNjcmlwdGlvbiA9IG5ldyBDdXJzb3JEZXNjcmlwdGlvbihcbiAgICAgICAgc2VsZi5fY3Vyc29yRGVzY3JpcHRpb24uY29sbGVjdGlvbk5hbWUsXG4gICAgICAgIHNlbGYuX2N1cnNvckRlc2NyaXB0aW9uLnNlbGVjdG9yLFxuICAgICAgICBvcHRpb25zKTtcbiAgICAgIHJldHVybiBuZXcgQ3Vyc29yKHNlbGYuX21vbmdvSGFuZGxlLCBkZXNjcmlwdGlvbik7XG4gICAgfSk7XG4gIH0sXG5cblxuICAvLyBSZXBsYWNlIHNlbGYuX3B1Ymxpc2hlZCB3aXRoIG5ld1Jlc3VsdHMgKGJvdGggYXJlIElkTWFwcyksIGludm9raW5nIG9ic2VydmVcbiAgLy8gY2FsbGJhY2tzIG9uIHRoZSBtdWx0aXBsZXhlci5cbiAgLy8gUmVwbGFjZSBzZWxmLl91bnB1Ymxpc2hlZEJ1ZmZlciB3aXRoIG5ld0J1ZmZlci5cbiAgLy9cbiAgLy8gWFhYIFRoaXMgaXMgdmVyeSBzaW1pbGFyIHRvIExvY2FsQ29sbGVjdGlvbi5fZGlmZlF1ZXJ5VW5vcmRlcmVkQ2hhbmdlcy4gV2VcbiAgLy8gc2hvdWxkIHJlYWxseTogKGEpIFVuaWZ5IElkTWFwIGFuZCBPcmRlcmVkRGljdCBpbnRvIFVub3JkZXJlZC9PcmRlcmVkRGljdFxuICAvLyAoYikgUmV3cml0ZSBkaWZmLmpzIHRvIHVzZSB0aGVzZSBjbGFzc2VzIGluc3RlYWQgb2YgYXJyYXlzIGFuZCBvYmplY3RzLlxuICBfcHVibGlzaE5ld1Jlc3VsdHM6IGZ1bmN0aW9uIChuZXdSZXN1bHRzLCBuZXdCdWZmZXIpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgTWV0ZW9yLl9ub1lpZWxkc0FsbG93ZWQoZnVuY3Rpb24gKCkge1xuXG4gICAgICAvLyBJZiB0aGUgcXVlcnkgaXMgbGltaXRlZCBhbmQgdGhlcmUgaXMgYSBidWZmZXIsIHNodXQgZG93biBzbyBpdCBkb2Vzbid0XG4gICAgICAvLyBzdGF5IGluIGEgd2F5LlxuICAgICAgaWYgKHNlbGYuX2xpbWl0KSB7XG4gICAgICAgIHNlbGYuX3VucHVibGlzaGVkQnVmZmVyLmNsZWFyKCk7XG4gICAgICB9XG5cbiAgICAgIC8vIEZpcnN0IHJlbW92ZSBhbnl0aGluZyB0aGF0J3MgZ29uZS4gQmUgY2FyZWZ1bCBub3QgdG8gbW9kaWZ5XG4gICAgICAvLyBzZWxmLl9wdWJsaXNoZWQgd2hpbGUgaXRlcmF0aW5nIG92ZXIgaXQuXG4gICAgICB2YXIgaWRzVG9SZW1vdmUgPSBbXTtcbiAgICAgIHNlbGYuX3B1Ymxpc2hlZC5mb3JFYWNoKGZ1bmN0aW9uIChkb2MsIGlkKSB7XG4gICAgICAgIGlmICghbmV3UmVzdWx0cy5oYXMoaWQpKVxuICAgICAgICAgIGlkc1RvUmVtb3ZlLnB1c2goaWQpO1xuICAgICAgfSk7XG4gICAgICBfLmVhY2goaWRzVG9SZW1vdmUsIGZ1bmN0aW9uIChpZCkge1xuICAgICAgICBzZWxmLl9yZW1vdmVQdWJsaXNoZWQoaWQpO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIE5vdyBkbyBhZGRzIGFuZCBjaGFuZ2VzLlxuICAgICAgLy8gSWYgc2VsZiBoYXMgYSBidWZmZXIgYW5kIGxpbWl0LCB0aGUgbmV3IGZldGNoZWQgcmVzdWx0IHdpbGwgYmVcbiAgICAgIC8vIGxpbWl0ZWQgY29ycmVjdGx5IGFzIHRoZSBxdWVyeSBoYXMgc29ydCBzcGVjaWZpZXIuXG4gICAgICBuZXdSZXN1bHRzLmZvckVhY2goZnVuY3Rpb24gKGRvYywgaWQpIHtcbiAgICAgICAgc2VsZi5faGFuZGxlRG9jKGlkLCBkb2MpO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIFNhbml0eS1jaGVjayB0aGF0IGV2ZXJ5dGhpbmcgd2UgdHJpZWQgdG8gcHV0IGludG8gX3B1Ymxpc2hlZCBlbmRlZCB1cFxuICAgICAgLy8gdGhlcmUuXG4gICAgICAvLyBYWFggaWYgdGhpcyBpcyBzbG93LCByZW1vdmUgaXQgbGF0ZXJcbiAgICAgIGlmIChzZWxmLl9wdWJsaXNoZWQuc2l6ZSgpICE9PSBuZXdSZXN1bHRzLnNpemUoKSkge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdUaGUgTW9uZ28gc2VydmVyIGFuZCB0aGUgTWV0ZW9yIHF1ZXJ5IGRpc2FncmVlIG9uIGhvdyAnICtcbiAgICAgICAgICAnbWFueSBkb2N1bWVudHMgbWF0Y2ggeW91ciBxdWVyeS4gQ3Vyc29yIGRlc2NyaXB0aW9uOiAnLFxuICAgICAgICAgIHNlbGYuX2N1cnNvckRlc2NyaXB0aW9uKTtcbiAgICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICAgXCJUaGUgTW9uZ28gc2VydmVyIGFuZCB0aGUgTWV0ZW9yIHF1ZXJ5IGRpc2FncmVlIG9uIGhvdyBcIiArXG4gICAgICAgICAgICBcIm1hbnkgZG9jdW1lbnRzIG1hdGNoIHlvdXIgcXVlcnkuIE1heWJlIGl0IGlzIGhpdHRpbmcgYSBNb25nbyBcIiArXG4gICAgICAgICAgICBcImVkZ2UgY2FzZT8gVGhlIHF1ZXJ5IGlzOiBcIiArXG4gICAgICAgICAgICBFSlNPTi5zdHJpbmdpZnkoc2VsZi5fY3Vyc29yRGVzY3JpcHRpb24uc2VsZWN0b3IpKTtcbiAgICAgIH1cbiAgICAgIHNlbGYuX3B1Ymxpc2hlZC5mb3JFYWNoKGZ1bmN0aW9uIChkb2MsIGlkKSB7XG4gICAgICAgIGlmICghbmV3UmVzdWx0cy5oYXMoaWQpKVxuICAgICAgICAgIHRocm93IEVycm9yKFwiX3B1Ymxpc2hlZCBoYXMgYSBkb2MgdGhhdCBuZXdSZXN1bHRzIGRvZXNuJ3Q7IFwiICsgaWQpO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIEZpbmFsbHksIHJlcGxhY2UgdGhlIGJ1ZmZlclxuICAgICAgbmV3QnVmZmVyLmZvckVhY2goZnVuY3Rpb24gKGRvYywgaWQpIHtcbiAgICAgICAgc2VsZi5fYWRkQnVmZmVyZWQoaWQsIGRvYyk7XG4gICAgICB9KTtcblxuICAgICAgc2VsZi5fc2FmZUFwcGVuZFRvQnVmZmVyID0gbmV3QnVmZmVyLnNpemUoKSA8IHNlbGYuX2xpbWl0O1xuICAgIH0pO1xuICB9LFxuXG4gIC8vIFRoaXMgc3RvcCBmdW5jdGlvbiBpcyBpbnZva2VkIGZyb20gdGhlIG9uU3RvcCBvZiB0aGUgT2JzZXJ2ZU11bHRpcGxleGVyLCBzb1xuICAvLyBpdCBzaG91bGRuJ3QgYWN0dWFsbHkgYmUgcG9zc2libGUgdG8gY2FsbCBpdCB1bnRpbCB0aGUgbXVsdGlwbGV4ZXIgaXNcbiAgLy8gcmVhZHkuXG4gIC8vXG4gIC8vIEl0J3MgaW1wb3J0YW50IHRvIGNoZWNrIHNlbGYuX3N0b3BwZWQgYWZ0ZXIgZXZlcnkgY2FsbCBpbiB0aGlzIGZpbGUgdGhhdFxuICAvLyBjYW4geWllbGQhXG4gIHN0b3A6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgaWYgKHNlbGYuX3N0b3BwZWQpXG4gICAgICByZXR1cm47XG4gICAgc2VsZi5fc3RvcHBlZCA9IHRydWU7XG4gICAgXy5lYWNoKHNlbGYuX3N0b3BIYW5kbGVzLCBmdW5jdGlvbiAoaGFuZGxlKSB7XG4gICAgICBoYW5kbGUuc3RvcCgpO1xuICAgIH0pO1xuXG4gICAgLy8gTm90ZTogd2UgKmRvbid0KiB1c2UgbXVsdGlwbGV4ZXIub25GbHVzaCBoZXJlIGJlY2F1c2UgdGhpcyBzdG9wXG4gICAgLy8gY2FsbGJhY2sgaXMgYWN0dWFsbHkgaW52b2tlZCBieSB0aGUgbXVsdGlwbGV4ZXIgaXRzZWxmIHdoZW4gaXQgaGFzXG4gICAgLy8gZGV0ZXJtaW5lZCB0aGF0IHRoZXJlIGFyZSBubyBoYW5kbGVzIGxlZnQuIFNvIG5vdGhpbmcgaXMgYWN0dWFsbHkgZ29pbmdcbiAgICAvLyB0byBnZXQgZmx1c2hlZCAoYW5kIGl0J3MgcHJvYmFibHkgbm90IHZhbGlkIHRvIGNhbGwgbWV0aG9kcyBvbiB0aGVcbiAgICAvLyBkeWluZyBtdWx0aXBsZXhlcikuXG4gICAgXy5lYWNoKHNlbGYuX3dyaXRlc1RvQ29tbWl0V2hlbldlUmVhY2hTdGVhZHksIGZ1bmN0aW9uICh3KSB7XG4gICAgICB3LmNvbW1pdHRlZCgpOyAgLy8gbWF5YmUgeWllbGRzP1xuICAgIH0pO1xuICAgIHNlbGYuX3dyaXRlc1RvQ29tbWl0V2hlbldlUmVhY2hTdGVhZHkgPSBudWxsO1xuXG4gICAgLy8gUHJvYWN0aXZlbHkgZHJvcCByZWZlcmVuY2VzIHRvIHBvdGVudGlhbGx5IGJpZyB0aGluZ3MuXG4gICAgc2VsZi5fcHVibGlzaGVkID0gbnVsbDtcbiAgICBzZWxmLl91bnB1Ymxpc2hlZEJ1ZmZlciA9IG51bGw7XG4gICAgc2VsZi5fbmVlZFRvRmV0Y2ggPSBudWxsO1xuICAgIHNlbGYuX2N1cnJlbnRseUZldGNoaW5nID0gbnVsbDtcbiAgICBzZWxmLl9vcGxvZ0VudHJ5SGFuZGxlID0gbnVsbDtcbiAgICBzZWxmLl9saXN0ZW5lcnNIYW5kbGUgPSBudWxsO1xuXG4gICAgUGFja2FnZVsnZmFjdHMtYmFzZSddICYmIFBhY2thZ2VbJ2ZhY3RzLWJhc2UnXS5GYWN0cy5pbmNyZW1lbnRTZXJ2ZXJGYWN0KFxuICAgICAgXCJtb25nby1saXZlZGF0YVwiLCBcIm9ic2VydmUtZHJpdmVycy1vcGxvZ1wiLCAtMSk7XG4gIH0sXG5cbiAgX3JlZ2lzdGVyUGhhc2VDaGFuZ2U6IGZ1bmN0aW9uIChwaGFzZSkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBNZXRlb3IuX25vWWllbGRzQWxsb3dlZChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgbm93ID0gbmV3IERhdGU7XG5cbiAgICAgIGlmIChzZWxmLl9waGFzZSkge1xuICAgICAgICB2YXIgdGltZURpZmYgPSBub3cgLSBzZWxmLl9waGFzZVN0YXJ0VGltZTtcbiAgICAgICAgUGFja2FnZVsnZmFjdHMtYmFzZSddICYmIFBhY2thZ2VbJ2ZhY3RzLWJhc2UnXS5GYWN0cy5pbmNyZW1lbnRTZXJ2ZXJGYWN0KFxuICAgICAgICAgIFwibW9uZ28tbGl2ZWRhdGFcIiwgXCJ0aW1lLXNwZW50LWluLVwiICsgc2VsZi5fcGhhc2UgKyBcIi1waGFzZVwiLCB0aW1lRGlmZik7XG4gICAgICB9XG5cbiAgICAgIHNlbGYuX3BoYXNlID0gcGhhc2U7XG4gICAgICBzZWxmLl9waGFzZVN0YXJ0VGltZSA9IG5vdztcbiAgICB9KTtcbiAgfVxufSk7XG5cbi8vIERvZXMgb3VyIG9wbG9nIHRhaWxpbmcgY29kZSBzdXBwb3J0IHRoaXMgY3Vyc29yPyBGb3Igbm93LCB3ZSBhcmUgYmVpbmcgdmVyeVxuLy8gY29uc2VydmF0aXZlIGFuZCBhbGxvd2luZyBvbmx5IHNpbXBsZSBxdWVyaWVzIHdpdGggc2ltcGxlIG9wdGlvbnMuXG4vLyAoVGhpcyBpcyBhIFwic3RhdGljIG1ldGhvZFwiLilcbk9wbG9nT2JzZXJ2ZURyaXZlci5jdXJzb3JTdXBwb3J0ZWQgPSBmdW5jdGlvbiAoY3Vyc29yRGVzY3JpcHRpb24sIG1hdGNoZXIpIHtcbiAgLy8gRmlyc3QsIGNoZWNrIHRoZSBvcHRpb25zLlxuICB2YXIgb3B0aW9ucyA9IGN1cnNvckRlc2NyaXB0aW9uLm9wdGlvbnM7XG5cbiAgLy8gRGlkIHRoZSB1c2VyIHNheSBubyBleHBsaWNpdGx5P1xuICAvLyB1bmRlcnNjb3JlZCB2ZXJzaW9uIG9mIHRoZSBvcHRpb24gaXMgQ09NUEFUIHdpdGggMS4yXG4gIGlmIChvcHRpb25zLmRpc2FibGVPcGxvZyB8fCBvcHRpb25zLl9kaXNhYmxlT3Bsb2cpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIC8vIHNraXAgaXMgbm90IHN1cHBvcnRlZDogdG8gc3VwcG9ydCBpdCB3ZSB3b3VsZCBuZWVkIHRvIGtlZXAgdHJhY2sgb2YgYWxsXG4gIC8vIFwic2tpcHBlZFwiIGRvY3VtZW50cyBvciBhdCBsZWFzdCB0aGVpciBpZHMuXG4gIC8vIGxpbWl0IHcvbyBhIHNvcnQgc3BlY2lmaWVyIGlzIG5vdCBzdXBwb3J0ZWQ6IGN1cnJlbnQgaW1wbGVtZW50YXRpb24gbmVlZHMgYVxuICAvLyBkZXRlcm1pbmlzdGljIHdheSB0byBvcmRlciBkb2N1bWVudHMuXG4gIGlmIChvcHRpb25zLnNraXAgfHwgKG9wdGlvbnMubGltaXQgJiYgIW9wdGlvbnMuc29ydCkpIHJldHVybiBmYWxzZTtcblxuICAvLyBJZiBhIGZpZWxkcyBwcm9qZWN0aW9uIG9wdGlvbiBpcyBnaXZlbiBjaGVjayBpZiBpdCBpcyBzdXBwb3J0ZWQgYnlcbiAgLy8gbWluaW1vbmdvIChzb21lIG9wZXJhdG9ycyBhcmUgbm90IHN1cHBvcnRlZCkuXG4gIGlmIChvcHRpb25zLmZpZWxkcykge1xuICAgIHRyeSB7XG4gICAgICBMb2NhbENvbGxlY3Rpb24uX2NoZWNrU3VwcG9ydGVkUHJvamVjdGlvbihvcHRpb25zLmZpZWxkcyk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgaWYgKGUubmFtZSA9PT0gXCJNaW5pbW9uZ29FcnJvclwiKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IGU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gV2UgZG9uJ3QgYWxsb3cgdGhlIGZvbGxvd2luZyBzZWxlY3RvcnM6XG4gIC8vICAgLSAkd2hlcmUgKG5vdCBjb25maWRlbnQgdGhhdCB3ZSBwcm92aWRlIHRoZSBzYW1lIEpTIGVudmlyb25tZW50XG4gIC8vICAgICAgICAgICAgIGFzIE1vbmdvLCBhbmQgY2FuIHlpZWxkISlcbiAgLy8gICAtICRuZWFyIChoYXMgXCJpbnRlcmVzdGluZ1wiIHByb3BlcnRpZXMgaW4gTW9uZ29EQiwgbGlrZSB0aGUgcG9zc2liaWxpdHlcbiAgLy8gICAgICAgICAgICBvZiByZXR1cm5pbmcgYW4gSUQgbXVsdGlwbGUgdGltZXMsIHRob3VnaCBldmVuIHBvbGxpbmcgbWF5YmVcbiAgLy8gICAgICAgICAgICBoYXZlIGEgYnVnIHRoZXJlKVxuICAvLyAgICAgICAgICAgWFhYOiBvbmNlIHdlIHN1cHBvcnQgaXQsIHdlIHdvdWxkIG5lZWQgdG8gdGhpbmsgbW9yZSBvbiBob3cgd2VcbiAgLy8gICAgICAgICAgIGluaXRpYWxpemUgdGhlIGNvbXBhcmF0b3JzIHdoZW4gd2UgY3JlYXRlIHRoZSBkcml2ZXIuXG4gIHJldHVybiAhbWF0Y2hlci5oYXNXaGVyZSgpICYmICFtYXRjaGVyLmhhc0dlb1F1ZXJ5KCk7XG59O1xuXG52YXIgbW9kaWZpZXJDYW5CZURpcmVjdGx5QXBwbGllZCA9IGZ1bmN0aW9uIChtb2RpZmllcikge1xuICByZXR1cm4gXy5hbGwobW9kaWZpZXIsIGZ1bmN0aW9uIChmaWVsZHMsIG9wZXJhdGlvbikge1xuICAgIHJldHVybiBfLmFsbChmaWVsZHMsIGZ1bmN0aW9uICh2YWx1ZSwgZmllbGQpIHtcbiAgICAgIHJldHVybiAhL0VKU09OXFwkLy50ZXN0KGZpZWxkKTtcbiAgICB9KTtcbiAgfSk7XG59O1xuXG5Nb25nb0ludGVybmFscy5PcGxvZ09ic2VydmVEcml2ZXIgPSBPcGxvZ09ic2VydmVEcml2ZXI7XG4iLCIvLyBzaW5nbGV0b25cbmV4cG9ydCBjb25zdCBMb2NhbENvbGxlY3Rpb25Ecml2ZXIgPSBuZXcgKGNsYXNzIExvY2FsQ29sbGVjdGlvbkRyaXZlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMubm9Db25uQ29sbGVjdGlvbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICB9XG5cbiAgb3BlbihuYW1lLCBjb25uKSB7XG4gICAgaWYgKCEgbmFtZSkge1xuICAgICAgcmV0dXJuIG5ldyBMb2NhbENvbGxlY3Rpb247XG4gICAgfVxuXG4gICAgaWYgKCEgY29ubikge1xuICAgICAgcmV0dXJuIGVuc3VyZUNvbGxlY3Rpb24obmFtZSwgdGhpcy5ub0Nvbm5Db2xsZWN0aW9ucyk7XG4gICAgfVxuXG4gICAgaWYgKCEgY29ubi5fbW9uZ29fbGl2ZWRhdGFfY29sbGVjdGlvbnMpIHtcbiAgICAgIGNvbm4uX21vbmdvX2xpdmVkYXRhX2NvbGxlY3Rpb25zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICB9XG5cbiAgICAvLyBYWFggaXMgdGhlcmUgYSB3YXkgdG8ga2VlcCB0cmFjayBvZiBhIGNvbm5lY3Rpb24ncyBjb2xsZWN0aW9ucyB3aXRob3V0XG4gICAgLy8gZGFuZ2xpbmcgaXQgb2ZmIHRoZSBjb25uZWN0aW9uIG9iamVjdD9cbiAgICByZXR1cm4gZW5zdXJlQ29sbGVjdGlvbihuYW1lLCBjb25uLl9tb25nb19saXZlZGF0YV9jb2xsZWN0aW9ucyk7XG4gIH1cbn0pO1xuXG5mdW5jdGlvbiBlbnN1cmVDb2xsZWN0aW9uKG5hbWUsIGNvbGxlY3Rpb25zKSB7XG4gIHJldHVybiAobmFtZSBpbiBjb2xsZWN0aW9ucylcbiAgICA/IGNvbGxlY3Rpb25zW25hbWVdXG4gICAgOiBjb2xsZWN0aW9uc1tuYW1lXSA9IG5ldyBMb2NhbENvbGxlY3Rpb24obmFtZSk7XG59XG4iLCJNb25nb0ludGVybmFscy5SZW1vdGVDb2xsZWN0aW9uRHJpdmVyID0gZnVuY3Rpb24gKFxuICBtb25nb191cmwsIG9wdGlvbnMpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBzZWxmLm1vbmdvID0gbmV3IE1vbmdvQ29ubmVjdGlvbihtb25nb191cmwsIG9wdGlvbnMpO1xufTtcblxuXy5leHRlbmQoTW9uZ29JbnRlcm5hbHMuUmVtb3RlQ29sbGVjdGlvbkRyaXZlci5wcm90b3R5cGUsIHtcbiAgb3BlbjogZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIHJldCA9IHt9O1xuICAgIF8uZWFjaChcbiAgICAgIFsnZmluZCcsICdmaW5kT25lJywgJ2luc2VydCcsICd1cGRhdGUnLCAndXBzZXJ0JyxcbiAgICAgICAncmVtb3ZlJywgJ19lbnN1cmVJbmRleCcsICdfZHJvcEluZGV4JywgJ19jcmVhdGVDYXBwZWRDb2xsZWN0aW9uJyxcbiAgICAgICAnZHJvcENvbGxlY3Rpb24nLCAncmF3Q29sbGVjdGlvbiddLFxuICAgICAgZnVuY3Rpb24gKG0pIHtcbiAgICAgICAgcmV0W21dID0gXy5iaW5kKHNlbGYubW9uZ29bbV0sIHNlbGYubW9uZ28sIG5hbWUpO1xuICAgICAgfSk7XG4gICAgcmV0dXJuIHJldDtcbiAgfVxufSk7XG5cblxuLy8gQ3JlYXRlIHRoZSBzaW5nbGV0b24gUmVtb3RlQ29sbGVjdGlvbkRyaXZlciBvbmx5IG9uIGRlbWFuZCwgc28gd2Vcbi8vIG9ubHkgcmVxdWlyZSBNb25nbyBjb25maWd1cmF0aW9uIGlmIGl0J3MgYWN0dWFsbHkgdXNlZCAoZWcsIG5vdCBpZlxuLy8geW91J3JlIG9ubHkgdHJ5aW5nIHRvIHJlY2VpdmUgZGF0YSBmcm9tIGEgcmVtb3RlIEREUCBzZXJ2ZXIuKVxuTW9uZ29JbnRlcm5hbHMuZGVmYXVsdFJlbW90ZUNvbGxlY3Rpb25Ecml2ZXIgPSBfLm9uY2UoZnVuY3Rpb24gKCkge1xuICB2YXIgY29ubmVjdGlvbk9wdGlvbnMgPSB7fTtcblxuICB2YXIgbW9uZ29VcmwgPSBwcm9jZXNzLmVudi5NT05HT19VUkw7XG5cbiAgaWYgKHByb2Nlc3MuZW52Lk1PTkdPX09QTE9HX1VSTCkge1xuICAgIGNvbm5lY3Rpb25PcHRpb25zLm9wbG9nVXJsID0gcHJvY2Vzcy5lbnYuTU9OR09fT1BMT0dfVVJMO1xuICB9XG5cbiAgaWYgKCEgbW9uZ29VcmwpXG4gICAgdGhyb3cgbmV3IEVycm9yKFwiTU9OR09fVVJMIG11c3QgYmUgc2V0IGluIGVudmlyb25tZW50XCIpO1xuXG4gIHJldHVybiBuZXcgTW9uZ29JbnRlcm5hbHMuUmVtb3RlQ29sbGVjdGlvbkRyaXZlcihtb25nb1VybCwgY29ubmVjdGlvbk9wdGlvbnMpO1xufSk7XG4iLCIvLyBvcHRpb25zLmNvbm5lY3Rpb24sIGlmIGdpdmVuLCBpcyBhIExpdmVkYXRhQ2xpZW50IG9yIExpdmVkYXRhU2VydmVyXG4vLyBYWFggcHJlc2VudGx5IHRoZXJlIGlzIG5vIHdheSB0byBkZXN0cm95L2NsZWFuIHVwIGEgQ29sbGVjdGlvblxuXG4vKipcbiAqIEBzdW1tYXJ5IE5hbWVzcGFjZSBmb3IgTW9uZ29EQi1yZWxhdGVkIGl0ZW1zXG4gKiBAbmFtZXNwYWNlXG4gKi9cbk1vbmdvID0ge307XG5cbi8qKlxuICogQHN1bW1hcnkgQ29uc3RydWN0b3IgZm9yIGEgQ29sbGVjdGlvblxuICogQGxvY3VzIEFueXdoZXJlXG4gKiBAaW5zdGFuY2VuYW1lIGNvbGxlY3Rpb25cbiAqIEBjbGFzc1xuICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgVGhlIG5hbWUgb2YgdGhlIGNvbGxlY3Rpb24uICBJZiBudWxsLCBjcmVhdGVzIGFuIHVubWFuYWdlZCAodW5zeW5jaHJvbml6ZWQpIGxvY2FsIGNvbGxlY3Rpb24uXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucy5jb25uZWN0aW9uIFRoZSBzZXJ2ZXIgY29ubmVjdGlvbiB0aGF0IHdpbGwgbWFuYWdlIHRoaXMgY29sbGVjdGlvbi4gVXNlcyB0aGUgZGVmYXVsdCBjb25uZWN0aW9uIGlmIG5vdCBzcGVjaWZpZWQuICBQYXNzIHRoZSByZXR1cm4gdmFsdWUgb2YgY2FsbGluZyBbYEREUC5jb25uZWN0YF0oI2RkcF9jb25uZWN0KSB0byBzcGVjaWZ5IGEgZGlmZmVyZW50IHNlcnZlci4gUGFzcyBgbnVsbGAgdG8gc3BlY2lmeSBubyBjb25uZWN0aW9uLiBVbm1hbmFnZWQgKGBuYW1lYCBpcyBudWxsKSBjb2xsZWN0aW9ucyBjYW5ub3Qgc3BlY2lmeSBhIGNvbm5lY3Rpb24uXG4gKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5pZEdlbmVyYXRpb24gVGhlIG1ldGhvZCBvZiBnZW5lcmF0aW5nIHRoZSBgX2lkYCBmaWVsZHMgb2YgbmV3IGRvY3VtZW50cyBpbiB0aGlzIGNvbGxlY3Rpb24uICBQb3NzaWJsZSB2YWx1ZXM6XG5cbiAtICoqYCdTVFJJTkcnYCoqOiByYW5kb20gc3RyaW5nc1xuIC0gKipgJ01PTkdPJ2AqKjogIHJhbmRvbSBbYE1vbmdvLk9iamVjdElEYF0oI21vbmdvX29iamVjdF9pZCkgdmFsdWVzXG5cblRoZSBkZWZhdWx0IGlkIGdlbmVyYXRpb24gdGVjaG5pcXVlIGlzIGAnU1RSSU5HJ2AuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBvcHRpb25zLnRyYW5zZm9ybSBBbiBvcHRpb25hbCB0cmFuc2Zvcm1hdGlvbiBmdW5jdGlvbi4gRG9jdW1lbnRzIHdpbGwgYmUgcGFzc2VkIHRocm91Z2ggdGhpcyBmdW5jdGlvbiBiZWZvcmUgYmVpbmcgcmV0dXJuZWQgZnJvbSBgZmV0Y2hgIG9yIGBmaW5kT25lYCwgYW5kIGJlZm9yZSBiZWluZyBwYXNzZWQgdG8gY2FsbGJhY2tzIG9mIGBvYnNlcnZlYCwgYG1hcGAsIGBmb3JFYWNoYCwgYGFsbG93YCwgYW5kIGBkZW55YC4gVHJhbnNmb3JtcyBhcmUgKm5vdCogYXBwbGllZCBmb3IgdGhlIGNhbGxiYWNrcyBvZiBgb2JzZXJ2ZUNoYW5nZXNgIG9yIHRvIGN1cnNvcnMgcmV0dXJuZWQgZnJvbSBwdWJsaXNoIGZ1bmN0aW9ucy5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gb3B0aW9ucy5kZWZpbmVNdXRhdGlvbk1ldGhvZHMgU2V0IHRvIGBmYWxzZWAgdG8gc2tpcCBzZXR0aW5nIHVwIHRoZSBtdXRhdGlvbiBtZXRob2RzIHRoYXQgZW5hYmxlIGluc2VydC91cGRhdGUvcmVtb3ZlIGZyb20gY2xpZW50IGNvZGUuIERlZmF1bHQgYHRydWVgLlxuICovXG5Nb25nby5Db2xsZWN0aW9uID0gZnVuY3Rpb24gQ29sbGVjdGlvbihuYW1lLCBvcHRpb25zKSB7XG4gIGlmICghbmFtZSAmJiAobmFtZSAhPT0gbnVsbCkpIHtcbiAgICBNZXRlb3IuX2RlYnVnKFwiV2FybmluZzogY3JlYXRpbmcgYW5vbnltb3VzIGNvbGxlY3Rpb24uIEl0IHdpbGwgbm90IGJlIFwiICtcbiAgICAgICAgICAgICAgICAgIFwic2F2ZWQgb3Igc3luY2hyb25pemVkIG92ZXIgdGhlIG5ldHdvcmsuIChQYXNzIG51bGwgZm9yIFwiICtcbiAgICAgICAgICAgICAgICAgIFwidGhlIGNvbGxlY3Rpb24gbmFtZSB0byB0dXJuIG9mZiB0aGlzIHdhcm5pbmcuKVwiKTtcbiAgICBuYW1lID0gbnVsbDtcbiAgfVxuXG4gIGlmIChuYW1lICE9PSBudWxsICYmIHR5cGVvZiBuYW1lICE9PSBcInN0cmluZ1wiKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgXCJGaXJzdCBhcmd1bWVudCB0byBuZXcgTW9uZ28uQ29sbGVjdGlvbiBtdXN0IGJlIGEgc3RyaW5nIG9yIG51bGxcIik7XG4gIH1cblxuICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLm1ldGhvZHMpIHtcbiAgICAvLyBCYWNrd2FyZHMgY29tcGF0aWJpbGl0eSBoYWNrIHdpdGggb3JpZ2luYWwgc2lnbmF0dXJlICh3aGljaCBwYXNzZWRcbiAgICAvLyBcImNvbm5lY3Rpb25cIiBkaXJlY3RseSBpbnN0ZWFkIG9mIGluIG9wdGlvbnMuIChDb25uZWN0aW9ucyBtdXN0IGhhdmUgYSBcIm1ldGhvZHNcIlxuICAgIC8vIG1ldGhvZC4pXG4gICAgLy8gWFhYIHJlbW92ZSBiZWZvcmUgMS4wXG4gICAgb3B0aW9ucyA9IHtjb25uZWN0aW9uOiBvcHRpb25zfTtcbiAgfVxuICAvLyBCYWNrd2FyZHMgY29tcGF0aWJpbGl0eTogXCJjb25uZWN0aW9uXCIgdXNlZCB0byBiZSBjYWxsZWQgXCJtYW5hZ2VyXCIuXG4gIGlmIChvcHRpb25zICYmIG9wdGlvbnMubWFuYWdlciAmJiAhb3B0aW9ucy5jb25uZWN0aW9uKSB7XG4gICAgb3B0aW9ucy5jb25uZWN0aW9uID0gb3B0aW9ucy5tYW5hZ2VyO1xuICB9XG5cbiAgb3B0aW9ucyA9IHtcbiAgICBjb25uZWN0aW9uOiB1bmRlZmluZWQsXG4gICAgaWRHZW5lcmF0aW9uOiAnU1RSSU5HJyxcbiAgICB0cmFuc2Zvcm06IG51bGwsXG4gICAgX2RyaXZlcjogdW5kZWZpbmVkLFxuICAgIF9wcmV2ZW50QXV0b3B1Ymxpc2g6IGZhbHNlLFxuICAgICAgLi4ub3B0aW9ucyxcbiAgfTtcblxuICBzd2l0Y2ggKG9wdGlvbnMuaWRHZW5lcmF0aW9uKSB7XG4gIGNhc2UgJ01PTkdPJzpcbiAgICB0aGlzLl9tYWtlTmV3SUQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgc3JjID0gbmFtZSA/IEREUC5yYW5kb21TdHJlYW0oJy9jb2xsZWN0aW9uLycgKyBuYW1lKSA6IFJhbmRvbS5pbnNlY3VyZTtcbiAgICAgIHJldHVybiBuZXcgTW9uZ28uT2JqZWN0SUQoc3JjLmhleFN0cmluZygyNCkpO1xuICAgIH07XG4gICAgYnJlYWs7XG4gIGNhc2UgJ1NUUklORyc6XG4gIGRlZmF1bHQ6XG4gICAgdGhpcy5fbWFrZU5ld0lEID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHNyYyA9IG5hbWUgPyBERFAucmFuZG9tU3RyZWFtKCcvY29sbGVjdGlvbi8nICsgbmFtZSkgOiBSYW5kb20uaW5zZWN1cmU7XG4gICAgICByZXR1cm4gc3JjLmlkKCk7XG4gICAgfTtcbiAgICBicmVhaztcbiAgfVxuXG4gIHRoaXMuX3RyYW5zZm9ybSA9IExvY2FsQ29sbGVjdGlvbi53cmFwVHJhbnNmb3JtKG9wdGlvbnMudHJhbnNmb3JtKTtcblxuICBpZiAoISBuYW1lIHx8IG9wdGlvbnMuY29ubmVjdGlvbiA9PT0gbnVsbClcbiAgICAvLyBub3RlOiBuYW1lbGVzcyBjb2xsZWN0aW9ucyBuZXZlciBoYXZlIGEgY29ubmVjdGlvblxuICAgIHRoaXMuX2Nvbm5lY3Rpb24gPSBudWxsO1xuICBlbHNlIGlmIChvcHRpb25zLmNvbm5lY3Rpb24pXG4gICAgdGhpcy5fY29ubmVjdGlvbiA9IG9wdGlvbnMuY29ubmVjdGlvbjtcbiAgZWxzZSBpZiAoTWV0ZW9yLmlzQ2xpZW50KVxuICAgIHRoaXMuX2Nvbm5lY3Rpb24gPSBNZXRlb3IuY29ubmVjdGlvbjtcbiAgZWxzZVxuICAgIHRoaXMuX2Nvbm5lY3Rpb24gPSBNZXRlb3Iuc2VydmVyO1xuXG4gIGlmICghb3B0aW9ucy5fZHJpdmVyKSB7XG4gICAgLy8gWFhYIFRoaXMgY2hlY2sgYXNzdW1lcyB0aGF0IHdlYmFwcCBpcyBsb2FkZWQgc28gdGhhdCBNZXRlb3Iuc2VydmVyICE9PVxuICAgIC8vIG51bGwuIFdlIHNob3VsZCBmdWxseSBzdXBwb3J0IHRoZSBjYXNlIG9mIFwid2FudCB0byB1c2UgYSBNb25nby1iYWNrZWRcbiAgICAvLyBjb2xsZWN0aW9uIGZyb20gTm9kZSBjb2RlIHdpdGhvdXQgd2ViYXBwXCIsIGJ1dCB3ZSBkb24ndCB5ZXQuXG4gICAgLy8gI01ldGVvclNlcnZlck51bGxcbiAgICBpZiAobmFtZSAmJiB0aGlzLl9jb25uZWN0aW9uID09PSBNZXRlb3Iuc2VydmVyICYmXG4gICAgICAgIHR5cGVvZiBNb25nb0ludGVybmFscyAhPT0gXCJ1bmRlZmluZWRcIiAmJlxuICAgICAgICBNb25nb0ludGVybmFscy5kZWZhdWx0UmVtb3RlQ29sbGVjdGlvbkRyaXZlcikge1xuICAgICAgb3B0aW9ucy5fZHJpdmVyID0gTW9uZ29JbnRlcm5hbHMuZGVmYXVsdFJlbW90ZUNvbGxlY3Rpb25Ecml2ZXIoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgeyBMb2NhbENvbGxlY3Rpb25Ecml2ZXIgfSA9XG4gICAgICAgIHJlcXVpcmUoXCIuL2xvY2FsX2NvbGxlY3Rpb25fZHJpdmVyLmpzXCIpO1xuICAgICAgb3B0aW9ucy5fZHJpdmVyID0gTG9jYWxDb2xsZWN0aW9uRHJpdmVyO1xuICAgIH1cbiAgfVxuXG4gIHRoaXMuX2NvbGxlY3Rpb24gPSBvcHRpb25zLl9kcml2ZXIub3BlbihuYW1lLCB0aGlzLl9jb25uZWN0aW9uKTtcbiAgdGhpcy5fbmFtZSA9IG5hbWU7XG4gIHRoaXMuX2RyaXZlciA9IG9wdGlvbnMuX2RyaXZlcjtcblxuICB0aGlzLl9tYXliZVNldFVwUmVwbGljYXRpb24obmFtZSwgb3B0aW9ucyk7XG5cbiAgLy8gWFhYIGRvbid0IGRlZmluZSB0aGVzZSB1bnRpbCBhbGxvdyBvciBkZW55IGlzIGFjdHVhbGx5IHVzZWQgZm9yIHRoaXNcbiAgLy8gY29sbGVjdGlvbi4gQ291bGQgYmUgaGFyZCBpZiB0aGUgc2VjdXJpdHkgcnVsZXMgYXJlIG9ubHkgZGVmaW5lZCBvbiB0aGVcbiAgLy8gc2VydmVyLlxuICBpZiAob3B0aW9ucy5kZWZpbmVNdXRhdGlvbk1ldGhvZHMgIT09IGZhbHNlKSB7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuX2RlZmluZU11dGF0aW9uTWV0aG9kcyh7XG4gICAgICAgIHVzZUV4aXN0aW5nOiBvcHRpb25zLl9zdXBwcmVzc1NhbWVOYW1lRXJyb3IgPT09IHRydWVcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAvLyBUaHJvdyBhIG1vcmUgdW5kZXJzdGFuZGFibGUgZXJyb3Igb24gdGhlIHNlcnZlciBmb3Igc2FtZSBjb2xsZWN0aW9uIG5hbWVcbiAgICAgIGlmIChlcnJvci5tZXNzYWdlID09PSBgQSBtZXRob2QgbmFtZWQgJy8ke25hbWV9L2luc2VydCcgaXMgYWxyZWFkeSBkZWZpbmVkYClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGVyZSBpcyBhbHJlYWR5IGEgY29sbGVjdGlvbiBuYW1lZCBcIiR7bmFtZX1cImApO1xuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxuICB9XG5cbiAgLy8gYXV0b3B1Ymxpc2hcbiAgaWYgKFBhY2thZ2UuYXV0b3B1Ymxpc2ggJiZcbiAgICAgICEgb3B0aW9ucy5fcHJldmVudEF1dG9wdWJsaXNoICYmXG4gICAgICB0aGlzLl9jb25uZWN0aW9uICYmXG4gICAgICB0aGlzLl9jb25uZWN0aW9uLnB1Ymxpc2gpIHtcbiAgICB0aGlzLl9jb25uZWN0aW9uLnB1Ymxpc2gobnVsbCwgKCkgPT4gdGhpcy5maW5kKCksIHtcbiAgICAgIGlzX2F1dG86IHRydWUsXG4gICAgfSk7XG4gIH1cbn07XG5cbk9iamVjdC5hc3NpZ24oTW9uZ28uQ29sbGVjdGlvbi5wcm90b3R5cGUsIHtcbiAgX21heWJlU2V0VXBSZXBsaWNhdGlvbihuYW1lLCB7XG4gICAgX3N1cHByZXNzU2FtZU5hbWVFcnJvciA9IGZhbHNlXG4gIH0pIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBpZiAoISAoc2VsZi5fY29ubmVjdGlvbiAmJlxuICAgICAgICAgICBzZWxmLl9jb25uZWN0aW9uLnJlZ2lzdGVyU3RvcmUpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gT0ssIHdlJ3JlIGdvaW5nIHRvIGJlIGEgc2xhdmUsIHJlcGxpY2F0aW5nIHNvbWUgcmVtb3RlXG4gICAgLy8gZGF0YWJhc2UsIGV4Y2VwdCBwb3NzaWJseSB3aXRoIHNvbWUgdGVtcG9yYXJ5IGRpdmVyZ2VuY2Ugd2hpbGVcbiAgICAvLyB3ZSBoYXZlIHVuYWNrbm93bGVkZ2VkIFJQQydzLlxuICAgIGNvbnN0IG9rID0gc2VsZi5fY29ubmVjdGlvbi5yZWdpc3RlclN0b3JlKG5hbWUsIHtcbiAgICAgIC8vIENhbGxlZCBhdCB0aGUgYmVnaW5uaW5nIG9mIGEgYmF0Y2ggb2YgdXBkYXRlcy4gYmF0Y2hTaXplIGlzIHRoZSBudW1iZXJcbiAgICAgIC8vIG9mIHVwZGF0ZSBjYWxscyB0byBleHBlY3QuXG4gICAgICAvL1xuICAgICAgLy8gWFhYIFRoaXMgaW50ZXJmYWNlIGlzIHByZXR0eSBqYW5reS4gcmVzZXQgcHJvYmFibHkgb3VnaHQgdG8gZ28gYmFjayB0b1xuICAgICAgLy8gYmVpbmcgaXRzIG93biBmdW5jdGlvbiwgYW5kIGNhbGxlcnMgc2hvdWxkbid0IGhhdmUgdG8gY2FsY3VsYXRlXG4gICAgICAvLyBiYXRjaFNpemUuIFRoZSBvcHRpbWl6YXRpb24gb2Ygbm90IGNhbGxpbmcgcGF1c2UvcmVtb3ZlIHNob3VsZCBiZVxuICAgICAgLy8gZGVsYXllZCB1bnRpbCBsYXRlcjogdGhlIGZpcnN0IGNhbGwgdG8gdXBkYXRlKCkgc2hvdWxkIGJ1ZmZlciBpdHNcbiAgICAgIC8vIG1lc3NhZ2UsIGFuZCB0aGVuIHdlIGNhbiBlaXRoZXIgZGlyZWN0bHkgYXBwbHkgaXQgYXQgZW5kVXBkYXRlIHRpbWUgaWZcbiAgICAgIC8vIGl0IHdhcyB0aGUgb25seSB1cGRhdGUsIG9yIGRvIHBhdXNlT2JzZXJ2ZXJzL2FwcGx5L2FwcGx5IGF0IHRoZSBuZXh0XG4gICAgICAvLyB1cGRhdGUoKSBpZiB0aGVyZSdzIGFub3RoZXIgb25lLlxuICAgICAgYmVnaW5VcGRhdGUoYmF0Y2hTaXplLCByZXNldCkge1xuICAgICAgICAvLyBwYXVzZSBvYnNlcnZlcnMgc28gdXNlcnMgZG9uJ3Qgc2VlIGZsaWNrZXIgd2hlbiB1cGRhdGluZyBzZXZlcmFsXG4gICAgICAgIC8vIG9iamVjdHMgYXQgb25jZSAoaW5jbHVkaW5nIHRoZSBwb3N0LXJlY29ubmVjdCByZXNldC1hbmQtcmVhcHBseVxuICAgICAgICAvLyBzdGFnZSksIGFuZCBzbyB0aGF0IGEgcmUtc29ydGluZyBvZiBhIHF1ZXJ5IGNhbiB0YWtlIGFkdmFudGFnZSBvZiB0aGVcbiAgICAgICAgLy8gZnVsbCBfZGlmZlF1ZXJ5IG1vdmVkIGNhbGN1bGF0aW9uIGluc3RlYWQgb2YgYXBwbHlpbmcgY2hhbmdlIG9uZSBhdCBhXG4gICAgICAgIC8vIHRpbWUuXG4gICAgICAgIGlmIChiYXRjaFNpemUgPiAxIHx8IHJlc2V0KVxuICAgICAgICAgIHNlbGYuX2NvbGxlY3Rpb24ucGF1c2VPYnNlcnZlcnMoKTtcblxuICAgICAgICBpZiAocmVzZXQpXG4gICAgICAgICAgc2VsZi5fY29sbGVjdGlvbi5yZW1vdmUoe30pO1xuICAgICAgfSxcblxuICAgICAgLy8gQXBwbHkgYW4gdXBkYXRlLlxuICAgICAgLy8gWFhYIGJldHRlciBzcGVjaWZ5IHRoaXMgaW50ZXJmYWNlIChub3QgaW4gdGVybXMgb2YgYSB3aXJlIG1lc3NhZ2UpP1xuICAgICAgdXBkYXRlKG1zZykge1xuICAgICAgICBpZihNZXRlb3IuaXNDbGllbnQpe1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZighbXNnKXtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibW9uZ28gdXBkYXRlIG1lc3NhZ2UgaXMgdW5kZWZpbmVkLiBjb2xsZWN0aW9uIG5hbWUgaXMgXCIgKyBzZWxmLl9uYW1lKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgbW9uZ29JZCA9IE1vbmdvSUQuaWRQYXJzZShtc2cuaWQpO1xuICAgICAgICB2YXIgZG9jID0gc2VsZi5fY29sbGVjdGlvbi5maW5kT25lKG1vbmdvSWQpO1xuXG4gICAgICAgIC8vIElzIHRoaXMgYSBcInJlcGxhY2UgdGhlIHdob2xlIGRvY1wiIG1lc3NhZ2UgY29taW5nIGZyb20gdGhlIHF1aWVzY2VuY2VcbiAgICAgICAgLy8gb2YgbWV0aG9kIHdyaXRlcyB0byBhbiBvYmplY3Q/IChOb3RlIHRoYXQgJ3VuZGVmaW5lZCcgaXMgYSB2YWxpZFxuICAgICAgICAvLyB2YWx1ZSBtZWFuaW5nIFwicmVtb3ZlIGl0XCIuKVxuICAgICAgICBpZiAobXNnLm1zZyA9PT0gJ3JlcGxhY2UnKSB7XG4gICAgICAgICAgdmFyIHJlcGxhY2UgPSBtc2cucmVwbGFjZTtcbiAgICAgICAgICBpZiAoIXJlcGxhY2UpIHtcbiAgICAgICAgICAgIGlmIChkb2MpXG4gICAgICAgICAgICAgIHNlbGYuX2NvbGxlY3Rpb24ucmVtb3ZlKG1vbmdvSWQpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoIWRvYykge1xuICAgICAgICAgICAgc2VsZi5fY29sbGVjdGlvbi5pbnNlcnQocmVwbGFjZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIFhYWCBjaGVjayB0aGF0IHJlcGxhY2UgaGFzIG5vICQgb3BzXG4gICAgICAgICAgICBzZWxmLl9jb2xsZWN0aW9uLnVwZGF0ZShtb25nb0lkLCByZXBsYWNlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IGVsc2UgaWYgKG1zZy5tc2cgPT09ICdhZGRlZCcpIHtcbiAgICAgICAgICBpZiAoZG9jKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFeHBlY3RlZCBub3QgdG8gZmluZCBhIGRvY3VtZW50IGFscmVhZHkgcHJlc2VudCBmb3IgYW4gYWRkXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzZWxmLl9jb2xsZWN0aW9uLmluc2VydCh7IF9pZDogbW9uZ29JZCwgLi4ubXNnLmZpZWxkcyB9KTtcbiAgICAgICAgfSBlbHNlIGlmIChtc2cubXNnID09PSAncmVtb3ZlZCcpIHtcbiAgICAgICAgICBpZiAoIWRvYylcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkV4cGVjdGVkIHRvIGZpbmQgYSBkb2N1bWVudCBhbHJlYWR5IHByZXNlbnQgZm9yIHJlbW92ZWRcIik7XG4gICAgICAgICAgc2VsZi5fY29sbGVjdGlvbi5yZW1vdmUobW9uZ29JZCk7XG4gICAgICAgIH0gZWxzZSBpZiAobXNnLm1zZyA9PT0gJ2NoYW5nZWQnKSB7XG4gICAgICAgICAgaWYgKCFkb2MpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFeHBlY3RlZCB0byBmaW5kIGEgZG9jdW1lbnQgdG8gY2hhbmdlXCIpO1xuICAgICAgICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhtc2cuZmllbGRzKTtcbiAgICAgICAgICBpZiAoa2V5cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB2YXIgbW9kaWZpZXIgPSB7fTtcbiAgICAgICAgICAgIGtleXMuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IG1zZy5maWVsZHNba2V5XTtcbiAgICAgICAgICAgICAgaWYgKEVKU09OLmVxdWFscyhkb2Nba2V5XSwgdmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAoIW1vZGlmaWVyLiR1bnNldCkge1xuICAgICAgICAgICAgICAgICAgbW9kaWZpZXIuJHVuc2V0ID0ge307XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG1vZGlmaWVyLiR1bnNldFtrZXldID0gMTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoIW1vZGlmaWVyLiRzZXQpIHtcbiAgICAgICAgICAgICAgICAgIG1vZGlmaWVyLiRzZXQgPSB7fTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbW9kaWZpZXIuJHNldFtrZXldID0gdmFsdWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKE9iamVjdC5rZXlzKG1vZGlmaWVyKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgIHNlbGYuX2NvbGxlY3Rpb24udXBkYXRlKG1vbmdvSWQsIG1vZGlmaWVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSSBkb24ndCBrbm93IGhvdyB0byBkZWFsIHdpdGggdGhpcyBtZXNzYWdlXCIpO1xuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICAvLyBDYWxsZWQgYXQgdGhlIGVuZCBvZiBhIGJhdGNoIG9mIHVwZGF0ZXMuXG4gICAgICBlbmRVcGRhdGUoKSB7XG4gICAgICAgIHNlbGYuX2NvbGxlY3Rpb24ucmVzdW1lT2JzZXJ2ZXJzKCk7XG4gICAgICB9LFxuXG4gICAgICAvLyBDYWxsZWQgYXJvdW5kIG1ldGhvZCBzdHViIGludm9jYXRpb25zIHRvIGNhcHR1cmUgdGhlIG9yaWdpbmFsIHZlcnNpb25zXG4gICAgICAvLyBvZiBtb2RpZmllZCBkb2N1bWVudHMuXG4gICAgICBzYXZlT3JpZ2luYWxzKCkge1xuICAgICAgICBzZWxmLl9jb2xsZWN0aW9uLnNhdmVPcmlnaW5hbHMoKTtcbiAgICAgIH0sXG4gICAgICByZXRyaWV2ZU9yaWdpbmFscygpIHtcbiAgICAgICAgcmV0dXJuIHNlbGYuX2NvbGxlY3Rpb24ucmV0cmlldmVPcmlnaW5hbHMoKTtcbiAgICAgIH0sXG5cbiAgICAgIC8vIFVzZWQgdG8gcHJlc2VydmUgY3VycmVudCB2ZXJzaW9ucyBvZiBkb2N1bWVudHMgYWNyb3NzIGEgc3RvcmUgcmVzZXQuXG4gICAgICBnZXREb2MoaWQpIHtcbiAgICAgICAgcmV0dXJuIHNlbGYuZmluZE9uZShpZCk7XG4gICAgICB9LFxuXG4gICAgICAvLyBUbyBiZSBhYmxlIHRvIGdldCBiYWNrIHRvIHRoZSBjb2xsZWN0aW9uIGZyb20gdGhlIHN0b3JlLlxuICAgICAgX2dldENvbGxlY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBzZWxmO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKCEgb2spIHtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSBgVGhlcmUgaXMgYWxyZWFkeSBhIGNvbGxlY3Rpb24gbmFtZWQgXCIke25hbWV9XCJgO1xuICAgICAgaWYgKF9zdXBwcmVzc1NhbWVOYW1lRXJyb3IgPT09IHRydWUpIHtcbiAgICAgICAgLy8gWFhYIEluIHRoZW9yeSB3ZSBkbyBub3QgaGF2ZSB0byB0aHJvdyB3aGVuIGBva2AgaXMgZmFsc3kuIFRoZVxuICAgICAgICAvLyBzdG9yZSBpcyBhbHJlYWR5IGRlZmluZWQgZm9yIHRoaXMgY29sbGVjdGlvbiBuYW1lLCBidXQgdGhpc1xuICAgICAgICAvLyB3aWxsIHNpbXBseSBiZSBhbm90aGVyIHJlZmVyZW5jZSB0byBpdCBhbmQgZXZlcnl0aGluZyBzaG91bGRcbiAgICAgICAgLy8gd29yay4gSG93ZXZlciwgd2UgaGF2ZSBoaXN0b3JpY2FsbHkgdGhyb3duIGFuIGVycm9yIGhlcmUsIHNvXG4gICAgICAgIC8vIGZvciBub3cgd2Ugd2lsbCBza2lwIHRoZSBlcnJvciBvbmx5IHdoZW4gX3N1cHByZXNzU2FtZU5hbWVFcnJvclxuICAgICAgICAvLyBpcyBgdHJ1ZWAsIGFsbG93aW5nIHBlb3BsZSB0byBvcHQgaW4gYW5kIGdpdmUgdGhpcyBzb21lIHJlYWxcbiAgICAgICAgLy8gd29ybGQgdGVzdGluZy5cbiAgICAgICAgY29uc29sZS53YXJuID8gY29uc29sZS53YXJuKG1lc3NhZ2UpIDogY29uc29sZS5sb2cobWVzc2FnZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIC8vL1xuICAvLy8gTWFpbiBjb2xsZWN0aW9uIEFQSVxuICAvLy9cblxuICBfZ2V0RmluZFNlbGVjdG9yKGFyZ3MpIHtcbiAgICBpZiAoYXJncy5sZW5ndGggPT0gMClcbiAgICAgIHJldHVybiB7fTtcbiAgICBlbHNlXG4gICAgICByZXR1cm4gYXJnc1swXTtcbiAgfSxcblxuICBfZ2V0RmluZE9wdGlvbnMoYXJncykge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBpZiAoYXJncy5sZW5ndGggPCAyKSB7XG4gICAgICByZXR1cm4geyB0cmFuc2Zvcm06IHNlbGYuX3RyYW5zZm9ybSB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBjaGVjayhhcmdzWzFdLCBNYXRjaC5PcHRpb25hbChNYXRjaC5PYmplY3RJbmNsdWRpbmcoe1xuICAgICAgICBmaWVsZHM6IE1hdGNoLk9wdGlvbmFsKE1hdGNoLk9uZU9mKE9iamVjdCwgdW5kZWZpbmVkKSksXG4gICAgICAgIHNvcnQ6IE1hdGNoLk9wdGlvbmFsKE1hdGNoLk9uZU9mKE9iamVjdCwgQXJyYXksIEZ1bmN0aW9uLCB1bmRlZmluZWQpKSxcbiAgICAgICAgbGltaXQ6IE1hdGNoLk9wdGlvbmFsKE1hdGNoLk9uZU9mKE51bWJlciwgdW5kZWZpbmVkKSksXG4gICAgICAgIHNraXA6IE1hdGNoLk9wdGlvbmFsKE1hdGNoLk9uZU9mKE51bWJlciwgdW5kZWZpbmVkKSlcbiAgICAgIH0pKSk7XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHRyYW5zZm9ybTogc2VsZi5fdHJhbnNmb3JtLFxuICAgICAgICAuLi5hcmdzWzFdLFxuICAgICAgfTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIEBzdW1tYXJ5IEZpbmQgdGhlIGRvY3VtZW50cyBpbiBhIGNvbGxlY3Rpb24gdGhhdCBtYXRjaCB0aGUgc2VsZWN0b3IuXG4gICAqIEBsb2N1cyBBbnl3aGVyZVxuICAgKiBAbWV0aG9kIGZpbmRcbiAgICogQG1lbWJlcm9mIE1vbmdvLkNvbGxlY3Rpb25cbiAgICogQGluc3RhbmNlXG4gICAqIEBwYXJhbSB7TW9uZ29TZWxlY3Rvcn0gW3NlbGVjdG9yXSBBIHF1ZXJ5IGRlc2NyaWJpbmcgdGhlIGRvY3VtZW50cyB0byBmaW5kXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc11cbiAgICogQHBhcmFtIHtNb25nb1NvcnRTcGVjaWZpZXJ9IG9wdGlvbnMuc29ydCBTb3J0IG9yZGVyIChkZWZhdWx0OiBuYXR1cmFsIG9yZGVyKVxuICAgKiBAcGFyYW0ge051bWJlcn0gb3B0aW9ucy5za2lwIE51bWJlciBvZiByZXN1bHRzIHRvIHNraXAgYXQgdGhlIGJlZ2lubmluZ1xuICAgKiBAcGFyYW0ge051bWJlcn0gb3B0aW9ucy5saW1pdCBNYXhpbXVtIG51bWJlciBvZiByZXN1bHRzIHRvIHJldHVyblxuICAgKiBAcGFyYW0ge01vbmdvRmllbGRTcGVjaWZpZXJ9IG9wdGlvbnMuZmllbGRzIERpY3Rpb25hcnkgb2YgZmllbGRzIHRvIHJldHVybiBvciBleGNsdWRlLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IG9wdGlvbnMucmVhY3RpdmUgKENsaWVudCBvbmx5KSBEZWZhdWx0IGB0cnVlYDsgcGFzcyBgZmFsc2VgIHRvIGRpc2FibGUgcmVhY3Rpdml0eVxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBvcHRpb25zLnRyYW5zZm9ybSBPdmVycmlkZXMgYHRyYW5zZm9ybWAgb24gdGhlICBbYENvbGxlY3Rpb25gXSgjY29sbGVjdGlvbnMpIGZvciB0aGlzIGN1cnNvci4gIFBhc3MgYG51bGxgIHRvIGRpc2FibGUgdHJhbnNmb3JtYXRpb24uXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gb3B0aW9ucy5kaXNhYmxlT3Bsb2cgKFNlcnZlciBvbmx5KSBQYXNzIHRydWUgdG8gZGlzYWJsZSBvcGxvZy10YWlsaW5nIG9uIHRoaXMgcXVlcnkuIFRoaXMgYWZmZWN0cyB0aGUgd2F5IHNlcnZlciBwcm9jZXNzZXMgY2FsbHMgdG8gYG9ic2VydmVgIG9uIHRoaXMgcXVlcnkuIERpc2FibGluZyB0aGUgb3Bsb2cgY2FuIGJlIHVzZWZ1bCB3aGVuIHdvcmtpbmcgd2l0aCBkYXRhIHRoYXQgdXBkYXRlcyBpbiBsYXJnZSBiYXRjaGVzLlxuICAgKiBAcGFyYW0ge051bWJlcn0gb3B0aW9ucy5wb2xsaW5nSW50ZXJ2YWxNcyAoU2VydmVyIG9ubHkpIFdoZW4gb3Bsb2cgaXMgZGlzYWJsZWQgKHRocm91Z2ggdGhlIHVzZSBvZiBgZGlzYWJsZU9wbG9nYCBvciB3aGVuIG90aGVyd2lzZSBub3QgYXZhaWxhYmxlKSwgdGhlIGZyZXF1ZW5jeSAoaW4gbWlsbGlzZWNvbmRzKSBvZiBob3cgb2Z0ZW4gdG8gcG9sbCB0aGlzIHF1ZXJ5IHdoZW4gb2JzZXJ2aW5nIG9uIHRoZSBzZXJ2ZXIuIERlZmF1bHRzIHRvIDEwMDAwbXMgKDEwIHNlY29uZHMpLlxuICAgKiBAcGFyYW0ge051bWJlcn0gb3B0aW9ucy5wb2xsaW5nVGhyb3R0bGVNcyAoU2VydmVyIG9ubHkpIFdoZW4gb3Bsb2cgaXMgZGlzYWJsZWQgKHRocm91Z2ggdGhlIHVzZSBvZiBgZGlzYWJsZU9wbG9nYCBvciB3aGVuIG90aGVyd2lzZSBub3QgYXZhaWxhYmxlKSwgdGhlIG1pbmltdW0gdGltZSAoaW4gbWlsbGlzZWNvbmRzKSB0byBhbGxvdyBiZXR3ZWVuIHJlLXBvbGxpbmcgd2hlbiBvYnNlcnZpbmcgb24gdGhlIHNlcnZlci4gSW5jcmVhc2luZyB0aGlzIHdpbGwgc2F2ZSBDUFUgYW5kIG1vbmdvIGxvYWQgYXQgdGhlIGV4cGVuc2Ugb2Ygc2xvd2VyIHVwZGF0ZXMgdG8gdXNlcnMuIERlY3JlYXNpbmcgdGhpcyBpcyBub3QgcmVjb21tZW5kZWQuIERlZmF1bHRzIHRvIDUwbXMuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBvcHRpb25zLm1heFRpbWVNcyAoU2VydmVyIG9ubHkpIElmIHNldCwgaW5zdHJ1Y3RzIE1vbmdvREIgdG8gc2V0IGEgdGltZSBsaW1pdCBmb3IgdGhpcyBjdXJzb3IncyBvcGVyYXRpb25zLiBJZiB0aGUgb3BlcmF0aW9uIHJlYWNoZXMgdGhlIHNwZWNpZmllZCB0aW1lIGxpbWl0IChpbiBtaWxsaXNlY29uZHMpIHdpdGhvdXQgdGhlIGhhdmluZyBiZWVuIGNvbXBsZXRlZCwgYW4gZXhjZXB0aW9uIHdpbGwgYmUgdGhyb3duLiBVc2VmdWwgdG8gcHJldmVudCBhbiAoYWNjaWRlbnRhbCBvciBtYWxpY2lvdXMpIHVub3B0aW1pemVkIHF1ZXJ5IGZyb20gY2F1c2luZyBhIGZ1bGwgY29sbGVjdGlvbiBzY2FuIHRoYXQgd291bGQgZGlzcnVwdCBvdGhlciBkYXRhYmFzZSB1c2VycywgYXQgdGhlIGV4cGVuc2Ugb2YgbmVlZGluZyB0byBoYW5kbGUgdGhlIHJlc3VsdGluZyBlcnJvci5cbiAgICogQHBhcmFtIHtTdHJpbmd8T2JqZWN0fSBvcHRpb25zLmhpbnQgKFNlcnZlciBvbmx5KSBPdmVycmlkZXMgTW9uZ29EQidzIGRlZmF1bHQgaW5kZXggc2VsZWN0aW9uIGFuZCBxdWVyeSBvcHRpbWl6YXRpb24gcHJvY2Vzcy4gU3BlY2lmeSBhbiBpbmRleCB0byBmb3JjZSBpdHMgdXNlLCBlaXRoZXIgYnkgaXRzIG5hbWUgb3IgaW5kZXggc3BlY2lmaWNhdGlvbi4gWW91IGNhbiBhbHNvIHNwZWNpZnkgYHsgJG5hdHVyYWwgOiAxIH1gIHRvIGZvcmNlIGEgZm9yd2FyZHMgY29sbGVjdGlvbiBzY2FuLCBvciBgeyAkbmF0dXJhbCA6IC0xIH1gIGZvciBhIHJldmVyc2UgY29sbGVjdGlvbiBzY2FuLiBTZXR0aW5nIHRoaXMgaXMgb25seSByZWNvbW1lbmRlZCBmb3IgYWR2YW5jZWQgdXNlcnMuXG4gICAqIEByZXR1cm5zIHtNb25nby5DdXJzb3J9XG4gICAqL1xuICBmaW5kKC4uLmFyZ3MpIHtcbiAgICAvLyBDb2xsZWN0aW9uLmZpbmQoKSAocmV0dXJuIGFsbCBkb2NzKSBiZWhhdmVzIGRpZmZlcmVudGx5XG4gICAgLy8gZnJvbSBDb2xsZWN0aW9uLmZpbmQodW5kZWZpbmVkKSAocmV0dXJuIDAgZG9jcykuICBzbyBiZVxuICAgIC8vIGNhcmVmdWwgYWJvdXQgdGhlIGxlbmd0aCBvZiBhcmd1bWVudHMuXG4gICAgcmV0dXJuIHRoaXMuX2NvbGxlY3Rpb24uZmluZChcbiAgICAgIHRoaXMuX2dldEZpbmRTZWxlY3RvcihhcmdzKSxcbiAgICAgIHRoaXMuX2dldEZpbmRPcHRpb25zKGFyZ3MpXG4gICAgKTtcbiAgfSxcblxuICAvKipcbiAgICogQHN1bW1hcnkgRmluZHMgdGhlIGZpcnN0IGRvY3VtZW50IHRoYXQgbWF0Y2hlcyB0aGUgc2VsZWN0b3IsIGFzIG9yZGVyZWQgYnkgc29ydCBhbmQgc2tpcCBvcHRpb25zLiBSZXR1cm5zIGB1bmRlZmluZWRgIGlmIG5vIG1hdGNoaW5nIGRvY3VtZW50IGlzIGZvdW5kLlxuICAgKiBAbG9jdXMgQW55d2hlcmVcbiAgICogQG1ldGhvZCBmaW5kT25lXG4gICAqIEBtZW1iZXJvZiBNb25nby5Db2xsZWN0aW9uXG4gICAqIEBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge01vbmdvU2VsZWN0b3J9IFtzZWxlY3Rvcl0gQSBxdWVyeSBkZXNjcmliaW5nIHRoZSBkb2N1bWVudHMgdG8gZmluZFxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdXG4gICAqIEBwYXJhbSB7TW9uZ29Tb3J0U3BlY2lmaWVyfSBvcHRpb25zLnNvcnQgU29ydCBvcmRlciAoZGVmYXVsdDogbmF0dXJhbCBvcmRlcilcbiAgICogQHBhcmFtIHtOdW1iZXJ9IG9wdGlvbnMuc2tpcCBOdW1iZXIgb2YgcmVzdWx0cyB0byBza2lwIGF0IHRoZSBiZWdpbm5pbmdcbiAgICogQHBhcmFtIHtNb25nb0ZpZWxkU3BlY2lmaWVyfSBvcHRpb25zLmZpZWxkcyBEaWN0aW9uYXJ5IG9mIGZpZWxkcyB0byByZXR1cm4gb3IgZXhjbHVkZS5cbiAgICogQHBhcmFtIHtCb29sZWFufSBvcHRpb25zLnJlYWN0aXZlIChDbGllbnQgb25seSkgRGVmYXVsdCB0cnVlOyBwYXNzIGZhbHNlIHRvIGRpc2FibGUgcmVhY3Rpdml0eVxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBvcHRpb25zLnRyYW5zZm9ybSBPdmVycmlkZXMgYHRyYW5zZm9ybWAgb24gdGhlIFtgQ29sbGVjdGlvbmBdKCNjb2xsZWN0aW9ucykgZm9yIHRoaXMgY3Vyc29yLiAgUGFzcyBgbnVsbGAgdG8gZGlzYWJsZSB0cmFuc2Zvcm1hdGlvbi5cbiAgICogQHJldHVybnMge09iamVjdH1cbiAgICovXG4gIGZpbmRPbmUoLi4uYXJncykge1xuICAgIHJldHVybiB0aGlzLl9jb2xsZWN0aW9uLmZpbmRPbmUoXG4gICAgICB0aGlzLl9nZXRGaW5kU2VsZWN0b3IoYXJncyksXG4gICAgICB0aGlzLl9nZXRGaW5kT3B0aW9ucyhhcmdzKVxuICAgICk7XG4gIH1cbn0pO1xuXG5PYmplY3QuYXNzaWduKE1vbmdvLkNvbGxlY3Rpb24sIHtcbiAgX3B1Ymxpc2hDdXJzb3IoY3Vyc29yLCBzdWIsIGNvbGxlY3Rpb24pIHtcbiAgICB2YXIgb2JzZXJ2ZUhhbmRsZSA9IGN1cnNvci5vYnNlcnZlQ2hhbmdlcyh7XG4gICAgICBhZGRlZDogZnVuY3Rpb24gKGlkLCBmaWVsZHMpIHtcbiAgICAgICAgc3ViLmFkZGVkKGNvbGxlY3Rpb24sIGlkLCBmaWVsZHMpO1xuICAgICAgfSxcbiAgICAgIGNoYW5nZWQ6IGZ1bmN0aW9uIChpZCwgZmllbGRzKSB7XG4gICAgICAgIHN1Yi5jaGFuZ2VkKGNvbGxlY3Rpb24sIGlkLCBmaWVsZHMpO1xuICAgICAgfSxcbiAgICAgIHJlbW92ZWQ6IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICBzdWIucmVtb3ZlZChjb2xsZWN0aW9uLCBpZCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBXZSBkb24ndCBjYWxsIHN1Yi5yZWFkeSgpIGhlcmU6IGl0IGdldHMgY2FsbGVkIGluIGxpdmVkYXRhX3NlcnZlciwgYWZ0ZXJcbiAgICAvLyBwb3NzaWJseSBjYWxsaW5nIF9wdWJsaXNoQ3Vyc29yIG9uIG11bHRpcGxlIHJldHVybmVkIGN1cnNvcnMuXG5cbiAgICAvLyByZWdpc3RlciBzdG9wIGNhbGxiYWNrIChleHBlY3RzIGxhbWJkYSB3LyBubyBhcmdzKS5cbiAgICBzdWIub25TdG9wKGZ1bmN0aW9uICgpIHtcbiAgICAgIG9ic2VydmVIYW5kbGUuc3RvcCgpO1xuICAgIH0pO1xuXG4gICAgLy8gcmV0dXJuIHRoZSBvYnNlcnZlSGFuZGxlIGluIGNhc2UgaXQgbmVlZHMgdG8gYmUgc3RvcHBlZCBlYXJseVxuICAgIHJldHVybiBvYnNlcnZlSGFuZGxlO1xuICB9LFxuXG4gIC8vIHByb3RlY3QgYWdhaW5zdCBkYW5nZXJvdXMgc2VsZWN0b3JzLiAgZmFsc2V5IGFuZCB7X2lkOiBmYWxzZXl9IGFyZSBib3RoXG4gIC8vIGxpa2VseSBwcm9ncmFtbWVyIGVycm9yLCBhbmQgbm90IHdoYXQgeW91IHdhbnQsIHBhcnRpY3VsYXJseSBmb3IgZGVzdHJ1Y3RpdmVcbiAgLy8gb3BlcmF0aW9ucy4gSWYgYSBmYWxzZXkgX2lkIGlzIHNlbnQgaW4sIGEgbmV3IHN0cmluZyBfaWQgd2lsbCBiZVxuICAvLyBnZW5lcmF0ZWQgYW5kIHJldHVybmVkOyBpZiBhIGZhbGxiYWNrSWQgaXMgcHJvdmlkZWQsIGl0IHdpbGwgYmUgcmV0dXJuZWRcbiAgLy8gaW5zdGVhZC5cbiAgX3Jld3JpdGVTZWxlY3RvcihzZWxlY3RvciwgeyBmYWxsYmFja0lkIH0gPSB7fSkge1xuICAgIC8vIHNob3J0aGFuZCAtLSBzY2FsYXJzIG1hdGNoIF9pZFxuICAgIGlmIChMb2NhbENvbGxlY3Rpb24uX3NlbGVjdG9ySXNJZChzZWxlY3RvcikpXG4gICAgICBzZWxlY3RvciA9IHtfaWQ6IHNlbGVjdG9yfTtcblxuICAgIGlmIChBcnJheS5pc0FycmF5KHNlbGVjdG9yKSkge1xuICAgICAgLy8gVGhpcyBpcyBjb25zaXN0ZW50IHdpdGggdGhlIE1vbmdvIGNvbnNvbGUgaXRzZWxmOyBpZiB3ZSBkb24ndCBkbyB0aGlzXG4gICAgICAvLyBjaGVjayBwYXNzaW5nIGFuIGVtcHR5IGFycmF5IGVuZHMgdXAgc2VsZWN0aW5nIGFsbCBpdGVtc1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTW9uZ28gc2VsZWN0b3IgY2FuJ3QgYmUgYW4gYXJyYXkuXCIpO1xuICAgIH1cblxuICAgIGlmICghc2VsZWN0b3IgfHwgKCgnX2lkJyBpbiBzZWxlY3RvcikgJiYgIXNlbGVjdG9yLl9pZCkpIHtcbiAgICAgIC8vIGNhbid0IG1hdGNoIGFueXRoaW5nXG4gICAgICByZXR1cm4geyBfaWQ6IGZhbGxiYWNrSWQgfHwgUmFuZG9tLmlkKCkgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gc2VsZWN0b3I7XG4gIH1cbn0pO1xuXG5PYmplY3QuYXNzaWduKE1vbmdvLkNvbGxlY3Rpb24ucHJvdG90eXBlLCB7XG4gIC8vICdpbnNlcnQnIGltbWVkaWF0ZWx5IHJldHVybnMgdGhlIGluc2VydGVkIGRvY3VtZW50J3MgbmV3IF9pZC5cbiAgLy8gVGhlIG90aGVycyByZXR1cm4gdmFsdWVzIGltbWVkaWF0ZWx5IGlmIHlvdSBhcmUgaW4gYSBzdHViLCBhbiBpbi1tZW1vcnlcbiAgLy8gdW5tYW5hZ2VkIGNvbGxlY3Rpb24sIG9yIGEgbW9uZ28tYmFja2VkIGNvbGxlY3Rpb24gYW5kIHlvdSBkb24ndCBwYXNzIGFcbiAgLy8gY2FsbGJhY2suICd1cGRhdGUnIGFuZCAncmVtb3ZlJyByZXR1cm4gdGhlIG51bWJlciBvZiBhZmZlY3RlZFxuICAvLyBkb2N1bWVudHMuICd1cHNlcnQnIHJldHVybnMgYW4gb2JqZWN0IHdpdGgga2V5cyAnbnVtYmVyQWZmZWN0ZWQnIGFuZCwgaWYgYW5cbiAgLy8gaW5zZXJ0IGhhcHBlbmVkLCAnaW5zZXJ0ZWRJZCcuXG4gIC8vXG4gIC8vIE90aGVyd2lzZSwgdGhlIHNlbWFudGljcyBhcmUgZXhhY3RseSBsaWtlIG90aGVyIG1ldGhvZHM6IHRoZXkgdGFrZVxuICAvLyBhIGNhbGxiYWNrIGFzIGFuIG9wdGlvbmFsIGxhc3QgYXJndW1lbnQ7IGlmIG5vIGNhbGxiYWNrIGlzXG4gIC8vIHByb3ZpZGVkLCB0aGV5IGJsb2NrIHVudGlsIHRoZSBvcGVyYXRpb24gaXMgY29tcGxldGUsIGFuZCB0aHJvdyBhblxuICAvLyBleGNlcHRpb24gaWYgaXQgZmFpbHM7IGlmIGEgY2FsbGJhY2sgaXMgcHJvdmlkZWQsIHRoZW4gdGhleSBkb24ndFxuICAvLyBuZWNlc3NhcmlseSBibG9jaywgYW5kIHRoZXkgY2FsbCB0aGUgY2FsbGJhY2sgd2hlbiB0aGV5IGZpbmlzaCB3aXRoIGVycm9yIGFuZFxuICAvLyByZXN1bHQgYXJndW1lbnRzLiAgKFRoZSBpbnNlcnQgbWV0aG9kIHByb3ZpZGVzIHRoZSBkb2N1bWVudCBJRCBhcyBpdHMgcmVzdWx0O1xuICAvLyB1cGRhdGUgYW5kIHJlbW92ZSBwcm92aWRlIHRoZSBudW1iZXIgb2YgYWZmZWN0ZWQgZG9jcyBhcyB0aGUgcmVzdWx0OyB1cHNlcnRcbiAgLy8gcHJvdmlkZXMgYW4gb2JqZWN0IHdpdGggbnVtYmVyQWZmZWN0ZWQgYW5kIG1heWJlIGluc2VydGVkSWQuKVxuICAvL1xuICAvLyBPbiB0aGUgY2xpZW50LCBibG9ja2luZyBpcyBpbXBvc3NpYmxlLCBzbyBpZiBhIGNhbGxiYWNrXG4gIC8vIGlzbid0IHByb3ZpZGVkLCB0aGV5IGp1c3QgcmV0dXJuIGltbWVkaWF0ZWx5IGFuZCBhbnkgZXJyb3JcbiAgLy8gaW5mb3JtYXRpb24gaXMgbG9zdC5cbiAgLy9cbiAgLy8gVGhlcmUncyBvbmUgbW9yZSB0d2Vhay4gT24gdGhlIGNsaWVudCwgaWYgeW91IGRvbid0IHByb3ZpZGUgYVxuICAvLyBjYWxsYmFjaywgdGhlbiBpZiB0aGVyZSBpcyBhbiBlcnJvciwgYSBtZXNzYWdlIHdpbGwgYmUgbG9nZ2VkIHdpdGhcbiAgLy8gTWV0ZW9yLl9kZWJ1Zy5cbiAgLy9cbiAgLy8gVGhlIGludGVudCAodGhvdWdoIHRoaXMgaXMgYWN0dWFsbHkgZGV0ZXJtaW5lZCBieSB0aGUgdW5kZXJseWluZ1xuICAvLyBkcml2ZXJzKSBpcyB0aGF0IHRoZSBvcGVyYXRpb25zIHNob3VsZCBiZSBkb25lIHN5bmNocm9ub3VzbHksIG5vdFxuICAvLyBnZW5lcmF0aW5nIHRoZWlyIHJlc3VsdCB1bnRpbCB0aGUgZGF0YWJhc2UgaGFzIGFja25vd2xlZGdlZFxuICAvLyB0aGVtLiBJbiB0aGUgZnV0dXJlIG1heWJlIHdlIHNob3VsZCBwcm92aWRlIGEgZmxhZyB0byB0dXJuIHRoaXNcbiAgLy8gb2ZmLlxuXG4gIC8qKlxuICAgKiBAc3VtbWFyeSBJbnNlcnQgYSBkb2N1bWVudCBpbiB0aGUgY29sbGVjdGlvbi4gIFJldHVybnMgaXRzIHVuaXF1ZSBfaWQuXG4gICAqIEBsb2N1cyBBbnl3aGVyZVxuICAgKiBAbWV0aG9kICBpbnNlcnRcbiAgICogQG1lbWJlcm9mIE1vbmdvLkNvbGxlY3Rpb25cbiAgICogQGluc3RhbmNlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkb2MgVGhlIGRvY3VtZW50IHRvIGluc2VydC4gTWF5IG5vdCB5ZXQgaGF2ZSBhbiBfaWQgYXR0cmlidXRlLCBpbiB3aGljaCBjYXNlIE1ldGVvciB3aWxsIGdlbmVyYXRlIG9uZSBmb3IgeW91LlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2FsbGJhY2tdIE9wdGlvbmFsLiAgSWYgcHJlc2VudCwgY2FsbGVkIHdpdGggYW4gZXJyb3Igb2JqZWN0IGFzIHRoZSBmaXJzdCBhcmd1bWVudCBhbmQsIGlmIG5vIGVycm9yLCB0aGUgX2lkIGFzIHRoZSBzZWNvbmQuXG4gICAqL1xuICBpbnNlcnQoZG9jLCBjYWxsYmFjaykge1xuICAgIC8vIE1ha2Ugc3VyZSB3ZSB3ZXJlIHBhc3NlZCBhIGRvY3VtZW50IHRvIGluc2VydFxuICAgIGlmICghZG9jKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJpbnNlcnQgcmVxdWlyZXMgYW4gYXJndW1lbnRcIik7XG4gICAgfVxuXG4gICAgLy8gTWFrZSBhIHNoYWxsb3cgY2xvbmUgb2YgdGhlIGRvY3VtZW50LCBwcmVzZXJ2aW5nIGl0cyBwcm90b3R5cGUuXG4gICAgZG9jID0gT2JqZWN0LmNyZWF0ZShcbiAgICAgIE9iamVjdC5nZXRQcm90b3R5cGVPZihkb2MpLFxuICAgICAgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMoZG9jKVxuICAgICk7XG5cbiAgICBpZiAoJ19pZCcgaW4gZG9jKSB7XG4gICAgICBpZiAoISBkb2MuX2lkIHx8XG4gICAgICAgICAgISAodHlwZW9mIGRvYy5faWQgPT09ICdzdHJpbmcnIHx8XG4gICAgICAgICAgICAgZG9jLl9pZCBpbnN0YW5jZW9mIE1vbmdvLk9iamVjdElEKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgXCJNZXRlb3IgcmVxdWlyZXMgZG9jdW1lbnQgX2lkIGZpZWxkcyB0byBiZSBub24tZW1wdHkgc3RyaW5ncyBvciBPYmplY3RJRHNcIik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBnZW5lcmF0ZUlkID0gdHJ1ZTtcblxuICAgICAgLy8gRG9uJ3QgZ2VuZXJhdGUgdGhlIGlkIGlmIHdlJ3JlIHRoZSBjbGllbnQgYW5kIHRoZSAnb3V0ZXJtb3N0JyBjYWxsXG4gICAgICAvLyBUaGlzIG9wdGltaXphdGlvbiBzYXZlcyB1cyBwYXNzaW5nIGJvdGggdGhlIHJhbmRvbVNlZWQgYW5kIHRoZSBpZFxuICAgICAgLy8gUGFzc2luZyBib3RoIGlzIHJlZHVuZGFudC5cbiAgICAgIGlmICh0aGlzLl9pc1JlbW90ZUNvbGxlY3Rpb24oKSkge1xuICAgICAgICBjb25zdCBlbmNsb3NpbmcgPSBERFAuX0N1cnJlbnRNZXRob2RJbnZvY2F0aW9uLmdldCgpO1xuICAgICAgICBpZiAoIWVuY2xvc2luZykge1xuICAgICAgICAgIGdlbmVyYXRlSWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZ2VuZXJhdGVJZCkge1xuICAgICAgICBkb2MuX2lkID0gdGhpcy5fbWFrZU5ld0lEKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gT24gaW5zZXJ0cywgYWx3YXlzIHJldHVybiB0aGUgaWQgdGhhdCB3ZSBnZW5lcmF0ZWQ7IG9uIGFsbCBvdGhlclxuICAgIC8vIG9wZXJhdGlvbnMsIGp1c3QgcmV0dXJuIHRoZSByZXN1bHQgZnJvbSB0aGUgY29sbGVjdGlvbi5cbiAgICB2YXIgY2hvb3NlUmV0dXJuVmFsdWVGcm9tQ29sbGVjdGlvblJlc3VsdCA9IGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgIGlmIChkb2MuX2lkKSB7XG4gICAgICAgIHJldHVybiBkb2MuX2lkO1xuICAgICAgfVxuXG4gICAgICAvLyBYWFggd2hhdCBpcyB0aGlzIGZvcj8/XG4gICAgICAvLyBJdCdzIHNvbWUgaXRlcmFjdGlvbiBiZXR3ZWVuIHRoZSBjYWxsYmFjayB0byBfY2FsbE11dGF0b3JNZXRob2QgYW5kXG4gICAgICAvLyB0aGUgcmV0dXJuIHZhbHVlIGNvbnZlcnNpb25cbiAgICAgIGRvYy5faWQgPSByZXN1bHQ7XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIGNvbnN0IHdyYXBwZWRDYWxsYmFjayA9IHdyYXBDYWxsYmFjayhcbiAgICAgIGNhbGxiYWNrLCBjaG9vc2VSZXR1cm5WYWx1ZUZyb21Db2xsZWN0aW9uUmVzdWx0KTtcblxuICAgIGlmICh0aGlzLl9pc1JlbW90ZUNvbGxlY3Rpb24oKSkge1xuICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy5fY2FsbE11dGF0b3JNZXRob2QoXCJpbnNlcnRcIiwgW2RvY10sIHdyYXBwZWRDYWxsYmFjayk7XG4gICAgICByZXR1cm4gY2hvb3NlUmV0dXJuVmFsdWVGcm9tQ29sbGVjdGlvblJlc3VsdChyZXN1bHQpO1xuICAgIH1cblxuICAgIC8vIGl0J3MgbXkgY29sbGVjdGlvbi4gIGRlc2NlbmQgaW50byB0aGUgY29sbGVjdGlvbiBvYmplY3RcbiAgICAvLyBhbmQgcHJvcGFnYXRlIGFueSBleGNlcHRpb24uXG4gICAgdHJ5IHtcbiAgICAgIC8vIElmIHRoZSB1c2VyIHByb3ZpZGVkIGEgY2FsbGJhY2sgYW5kIHRoZSBjb2xsZWN0aW9uIGltcGxlbWVudHMgdGhpc1xuICAgICAgLy8gb3BlcmF0aW9uIGFzeW5jaHJvbm91c2x5LCB0aGVuIHF1ZXJ5UmV0IHdpbGwgYmUgdW5kZWZpbmVkLCBhbmQgdGhlXG4gICAgICAvLyByZXN1bHQgd2lsbCBiZSByZXR1cm5lZCB0aHJvdWdoIHRoZSBjYWxsYmFjayBpbnN0ZWFkLlxuICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy5fY29sbGVjdGlvbi5pbnNlcnQoZG9jLCB3cmFwcGVkQ2FsbGJhY2spO1xuICAgICAgcmV0dXJuIGNob29zZVJldHVyblZhbHVlRnJvbUNvbGxlY3Rpb25SZXN1bHQocmVzdWx0KTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgY2FsbGJhY2soZSk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgICAgdGhyb3cgZTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIEBzdW1tYXJ5IE1vZGlmeSBvbmUgb3IgbW9yZSBkb2N1bWVudHMgaW4gdGhlIGNvbGxlY3Rpb24uIFJldHVybnMgdGhlIG51bWJlciBvZiBtYXRjaGVkIGRvY3VtZW50cy5cbiAgICogQGxvY3VzIEFueXdoZXJlXG4gICAqIEBtZXRob2QgdXBkYXRlXG4gICAqIEBtZW1iZXJvZiBNb25nby5Db2xsZWN0aW9uXG4gICAqIEBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge01vbmdvU2VsZWN0b3J9IHNlbGVjdG9yIFNwZWNpZmllcyB3aGljaCBkb2N1bWVudHMgdG8gbW9kaWZ5XG4gICAqIEBwYXJhbSB7TW9uZ29Nb2RpZmllcn0gbW9kaWZpZXIgU3BlY2lmaWVzIGhvdyB0byBtb2RpZnkgdGhlIGRvY3VtZW50c1xuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gb3B0aW9ucy5tdWx0aSBUcnVlIHRvIG1vZGlmeSBhbGwgbWF0Y2hpbmcgZG9jdW1lbnRzOyBmYWxzZSB0byBvbmx5IG1vZGlmeSBvbmUgb2YgdGhlIG1hdGNoaW5nIGRvY3VtZW50cyAodGhlIGRlZmF1bHQpLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IG9wdGlvbnMudXBzZXJ0IFRydWUgdG8gaW5zZXJ0IGEgZG9jdW1lbnQgaWYgbm8gbWF0Y2hpbmcgZG9jdW1lbnRzIGFyZSBmb3VuZC5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gW2NhbGxiYWNrXSBPcHRpb25hbC4gIElmIHByZXNlbnQsIGNhbGxlZCB3aXRoIGFuIGVycm9yIG9iamVjdCBhcyB0aGUgZmlyc3QgYXJndW1lbnQgYW5kLCBpZiBubyBlcnJvciwgdGhlIG51bWJlciBvZiBhZmZlY3RlZCBkb2N1bWVudHMgYXMgdGhlIHNlY29uZC5cbiAgICovXG4gIHVwZGF0ZShzZWxlY3RvciwgbW9kaWZpZXIsIC4uLm9wdGlvbnNBbmRDYWxsYmFjaykge1xuICAgIGNvbnN0IGNhbGxiYWNrID0gcG9wQ2FsbGJhY2tGcm9tQXJncyhvcHRpb25zQW5kQ2FsbGJhY2spO1xuXG4gICAgLy8gV2UndmUgYWxyZWFkeSBwb3BwZWQgb2ZmIHRoZSBjYWxsYmFjaywgc28gd2UgYXJlIGxlZnQgd2l0aCBhbiBhcnJheVxuICAgIC8vIG9mIG9uZSBvciB6ZXJvIGl0ZW1zXG4gICAgY29uc3Qgb3B0aW9ucyA9IHsgLi4uKG9wdGlvbnNBbmRDYWxsYmFja1swXSB8fCBudWxsKSB9O1xuICAgIGxldCBpbnNlcnRlZElkO1xuICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMudXBzZXJ0KSB7XG4gICAgICAvLyBzZXQgYGluc2VydGVkSWRgIGlmIGFic2VudC4gIGBpbnNlcnRlZElkYCBpcyBhIE1ldGVvciBleHRlbnNpb24uXG4gICAgICBpZiAob3B0aW9ucy5pbnNlcnRlZElkKSB7XG4gICAgICAgIGlmICghKHR5cGVvZiBvcHRpb25zLmluc2VydGVkSWQgPT09ICdzdHJpbmcnIHx8IG9wdGlvbnMuaW5zZXJ0ZWRJZCBpbnN0YW5jZW9mIE1vbmdvLk9iamVjdElEKSlcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJpbnNlcnRlZElkIG11c3QgYmUgc3RyaW5nIG9yIE9iamVjdElEXCIpO1xuICAgICAgICBpbnNlcnRlZElkID0gb3B0aW9ucy5pbnNlcnRlZElkO1xuICAgICAgfSBlbHNlIGlmICghc2VsZWN0b3IgfHwgIXNlbGVjdG9yLl9pZCkge1xuICAgICAgICBpbnNlcnRlZElkID0gdGhpcy5fbWFrZU5ld0lEKCk7XG4gICAgICAgIG9wdGlvbnMuZ2VuZXJhdGVkSWQgPSB0cnVlO1xuICAgICAgICBvcHRpb25zLmluc2VydGVkSWQgPSBpbnNlcnRlZElkO1xuICAgICAgfVxuICAgIH1cblxuICAgIHNlbGVjdG9yID1cbiAgICAgIE1vbmdvLkNvbGxlY3Rpb24uX3Jld3JpdGVTZWxlY3RvcihzZWxlY3RvciwgeyBmYWxsYmFja0lkOiBpbnNlcnRlZElkIH0pO1xuXG4gICAgY29uc3Qgd3JhcHBlZENhbGxiYWNrID0gd3JhcENhbGxiYWNrKGNhbGxiYWNrKTtcblxuICAgIGlmICh0aGlzLl9pc1JlbW90ZUNvbGxlY3Rpb24oKSkge1xuICAgICAgY29uc3QgYXJncyA9IFtcbiAgICAgICAgc2VsZWN0b3IsXG4gICAgICAgIG1vZGlmaWVyLFxuICAgICAgICBvcHRpb25zXG4gICAgICBdO1xuXG4gICAgICByZXR1cm4gdGhpcy5fY2FsbE11dGF0b3JNZXRob2QoXCJ1cGRhdGVcIiwgYXJncywgd3JhcHBlZENhbGxiYWNrKTtcbiAgICB9XG5cbiAgICAvLyBpdCdzIG15IGNvbGxlY3Rpb24uICBkZXNjZW5kIGludG8gdGhlIGNvbGxlY3Rpb24gb2JqZWN0XG4gICAgLy8gYW5kIHByb3BhZ2F0ZSBhbnkgZXhjZXB0aW9uLlxuICAgIHRyeSB7XG4gICAgICAvLyBJZiB0aGUgdXNlciBwcm92aWRlZCBhIGNhbGxiYWNrIGFuZCB0aGUgY29sbGVjdGlvbiBpbXBsZW1lbnRzIHRoaXNcbiAgICAgIC8vIG9wZXJhdGlvbiBhc3luY2hyb25vdXNseSwgdGhlbiBxdWVyeVJldCB3aWxsIGJlIHVuZGVmaW5lZCwgYW5kIHRoZVxuICAgICAgLy8gcmVzdWx0IHdpbGwgYmUgcmV0dXJuZWQgdGhyb3VnaCB0aGUgY2FsbGJhY2sgaW5zdGVhZC5cbiAgICAgIHJldHVybiB0aGlzLl9jb2xsZWN0aW9uLnVwZGF0ZShcbiAgICAgICAgc2VsZWN0b3IsIG1vZGlmaWVyLCBvcHRpb25zLCB3cmFwcGVkQ2FsbGJhY2spO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjayhlKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgICB0aHJvdyBlO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogQHN1bW1hcnkgUmVtb3ZlIGRvY3VtZW50cyBmcm9tIHRoZSBjb2xsZWN0aW9uXG4gICAqIEBsb2N1cyBBbnl3aGVyZVxuICAgKiBAbWV0aG9kIHJlbW92ZVxuICAgKiBAbWVtYmVyb2YgTW9uZ28uQ29sbGVjdGlvblxuICAgKiBAaW5zdGFuY2VcbiAgICogQHBhcmFtIHtNb25nb1NlbGVjdG9yfSBzZWxlY3RvciBTcGVjaWZpZXMgd2hpY2ggZG9jdW1lbnRzIHRvIHJlbW92ZVxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2FsbGJhY2tdIE9wdGlvbmFsLiAgSWYgcHJlc2VudCwgY2FsbGVkIHdpdGggYW4gZXJyb3Igb2JqZWN0IGFzIGl0cyBhcmd1bWVudC5cbiAgICovXG4gIHJlbW92ZShzZWxlY3RvciwgY2FsbGJhY2spIHtcbiAgICBzZWxlY3RvciA9IE1vbmdvLkNvbGxlY3Rpb24uX3Jld3JpdGVTZWxlY3RvcihzZWxlY3Rvcik7XG5cbiAgICBjb25zdCB3cmFwcGVkQ2FsbGJhY2sgPSB3cmFwQ2FsbGJhY2soY2FsbGJhY2spO1xuXG4gICAgaWYgKHRoaXMuX2lzUmVtb3RlQ29sbGVjdGlvbigpKSB7XG4gICAgICByZXR1cm4gdGhpcy5fY2FsbE11dGF0b3JNZXRob2QoXCJyZW1vdmVcIiwgW3NlbGVjdG9yXSwgd3JhcHBlZENhbGxiYWNrKTtcbiAgICB9XG5cbiAgICAvLyBpdCdzIG15IGNvbGxlY3Rpb24uICBkZXNjZW5kIGludG8gdGhlIGNvbGxlY3Rpb24gb2JqZWN0XG4gICAgLy8gYW5kIHByb3BhZ2F0ZSBhbnkgZXhjZXB0aW9uLlxuICAgIHRyeSB7XG4gICAgICAvLyBJZiB0aGUgdXNlciBwcm92aWRlZCBhIGNhbGxiYWNrIGFuZCB0aGUgY29sbGVjdGlvbiBpbXBsZW1lbnRzIHRoaXNcbiAgICAgIC8vIG9wZXJhdGlvbiBhc3luY2hyb25vdXNseSwgdGhlbiBxdWVyeVJldCB3aWxsIGJlIHVuZGVmaW5lZCwgYW5kIHRoZVxuICAgICAgLy8gcmVzdWx0IHdpbGwgYmUgcmV0dXJuZWQgdGhyb3VnaCB0aGUgY2FsbGJhY2sgaW5zdGVhZC5cbiAgICAgIHJldHVybiB0aGlzLl9jb2xsZWN0aW9uLnJlbW92ZShzZWxlY3Rvciwgd3JhcHBlZENhbGxiYWNrKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgY2FsbGJhY2soZSk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgICAgdGhyb3cgZTtcbiAgICB9XG4gIH0sXG5cbiAgLy8gRGV0ZXJtaW5lIGlmIHRoaXMgY29sbGVjdGlvbiBpcyBzaW1wbHkgYSBtaW5pbW9uZ28gcmVwcmVzZW50YXRpb24gb2YgYSByZWFsXG4gIC8vIGRhdGFiYXNlIG9uIGFub3RoZXIgc2VydmVyXG4gIF9pc1JlbW90ZUNvbGxlY3Rpb24oKSB7XG4gICAgLy8gWFhYIHNlZSAjTWV0ZW9yU2VydmVyTnVsbFxuICAgIHJldHVybiB0aGlzLl9jb25uZWN0aW9uICYmIHRoaXMuX2Nvbm5lY3Rpb24gIT09IE1ldGVvci5zZXJ2ZXI7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEBzdW1tYXJ5IE1vZGlmeSBvbmUgb3IgbW9yZSBkb2N1bWVudHMgaW4gdGhlIGNvbGxlY3Rpb24sIG9yIGluc2VydCBvbmUgaWYgbm8gbWF0Y2hpbmcgZG9jdW1lbnRzIHdlcmUgZm91bmQuIFJldHVybnMgYW4gb2JqZWN0IHdpdGgga2V5cyBgbnVtYmVyQWZmZWN0ZWRgICh0aGUgbnVtYmVyIG9mIGRvY3VtZW50cyBtb2RpZmllZCkgIGFuZCBgaW5zZXJ0ZWRJZGAgKHRoZSB1bmlxdWUgX2lkIG9mIHRoZSBkb2N1bWVudCB0aGF0IHdhcyBpbnNlcnRlZCwgaWYgYW55KS5cbiAgICogQGxvY3VzIEFueXdoZXJlXG4gICAqIEBtZXRob2QgdXBzZXJ0XG4gICAqIEBtZW1iZXJvZiBNb25nby5Db2xsZWN0aW9uXG4gICAqIEBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge01vbmdvU2VsZWN0b3J9IHNlbGVjdG9yIFNwZWNpZmllcyB3aGljaCBkb2N1bWVudHMgdG8gbW9kaWZ5XG4gICAqIEBwYXJhbSB7TW9uZ29Nb2RpZmllcn0gbW9kaWZpZXIgU3BlY2lmaWVzIGhvdyB0byBtb2RpZnkgdGhlIGRvY3VtZW50c1xuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gb3B0aW9ucy5tdWx0aSBUcnVlIHRvIG1vZGlmeSBhbGwgbWF0Y2hpbmcgZG9jdW1lbnRzOyBmYWxzZSB0byBvbmx5IG1vZGlmeSBvbmUgb2YgdGhlIG1hdGNoaW5nIGRvY3VtZW50cyAodGhlIGRlZmF1bHQpLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2FsbGJhY2tdIE9wdGlvbmFsLiAgSWYgcHJlc2VudCwgY2FsbGVkIHdpdGggYW4gZXJyb3Igb2JqZWN0IGFzIHRoZSBmaXJzdCBhcmd1bWVudCBhbmQsIGlmIG5vIGVycm9yLCB0aGUgbnVtYmVyIG9mIGFmZmVjdGVkIGRvY3VtZW50cyBhcyB0aGUgc2Vjb25kLlxuICAgKi9cbiAgdXBzZXJ0KHNlbGVjdG9yLCBtb2RpZmllciwgb3B0aW9ucywgY2FsbGJhY2spIHtcbiAgICBpZiAoISBjYWxsYmFjayAmJiB0eXBlb2Ygb3B0aW9ucyA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICBjYWxsYmFjayA9IG9wdGlvbnM7XG4gICAgICBvcHRpb25zID0ge307XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMudXBkYXRlKHNlbGVjdG9yLCBtb2RpZmllciwge1xuICAgICAgLi4ub3B0aW9ucyxcbiAgICAgIF9yZXR1cm5PYmplY3Q6IHRydWUsXG4gICAgICB1cHNlcnQ6IHRydWUsXG4gICAgfSwgY2FsbGJhY2spO1xuICB9LFxuXG4gIC8vIFdlJ2xsIGFjdHVhbGx5IGRlc2lnbiBhbiBpbmRleCBBUEkgbGF0ZXIuIEZvciBub3csIHdlIGp1c3QgcGFzcyB0aHJvdWdoIHRvXG4gIC8vIE1vbmdvJ3MsIGJ1dCBtYWtlIGl0IHN5bmNocm9ub3VzLlxuICBfZW5zdXJlSW5kZXgoaW5kZXgsIG9wdGlvbnMpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgaWYgKCFzZWxmLl9jb2xsZWN0aW9uLl9lbnN1cmVJbmRleClcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbiBvbmx5IGNhbGwgX2Vuc3VyZUluZGV4IG9uIHNlcnZlciBjb2xsZWN0aW9uc1wiKTtcbiAgICBzZWxmLl9jb2xsZWN0aW9uLl9lbnN1cmVJbmRleChpbmRleCwgb3B0aW9ucyk7XG4gIH0sXG5cbiAgX2Ryb3BJbmRleChpbmRleCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBpZiAoIXNlbGYuX2NvbGxlY3Rpb24uX2Ryb3BJbmRleClcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbiBvbmx5IGNhbGwgX2Ryb3BJbmRleCBvbiBzZXJ2ZXIgY29sbGVjdGlvbnNcIik7XG4gICAgc2VsZi5fY29sbGVjdGlvbi5fZHJvcEluZGV4KGluZGV4KTtcbiAgfSxcblxuICBfZHJvcENvbGxlY3Rpb24oKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIGlmICghc2VsZi5fY29sbGVjdGlvbi5kcm9wQ29sbGVjdGlvbilcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbiBvbmx5IGNhbGwgX2Ryb3BDb2xsZWN0aW9uIG9uIHNlcnZlciBjb2xsZWN0aW9uc1wiKTtcbiAgICBzZWxmLl9jb2xsZWN0aW9uLmRyb3BDb2xsZWN0aW9uKCk7XG4gIH0sXG5cbiAgX2NyZWF0ZUNhcHBlZENvbGxlY3Rpb24oYnl0ZVNpemUsIG1heERvY3VtZW50cykge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBpZiAoIXNlbGYuX2NvbGxlY3Rpb24uX2NyZWF0ZUNhcHBlZENvbGxlY3Rpb24pXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW4gb25seSBjYWxsIF9jcmVhdGVDYXBwZWRDb2xsZWN0aW9uIG9uIHNlcnZlciBjb2xsZWN0aW9uc1wiKTtcbiAgICBzZWxmLl9jb2xsZWN0aW9uLl9jcmVhdGVDYXBwZWRDb2xsZWN0aW9uKGJ5dGVTaXplLCBtYXhEb2N1bWVudHMpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBAc3VtbWFyeSBSZXR1cm5zIHRoZSBbYENvbGxlY3Rpb25gXShodHRwOi8vbW9uZ29kYi5naXRodWIuaW8vbm9kZS1tb25nb2RiLW5hdGl2ZS8zLjAvYXBpL0NvbGxlY3Rpb24uaHRtbCkgb2JqZWN0IGNvcnJlc3BvbmRpbmcgdG8gdGhpcyBjb2xsZWN0aW9uIGZyb20gdGhlIFtucG0gYG1vbmdvZGJgIGRyaXZlciBtb2R1bGVdKGh0dHBzOi8vd3d3Lm5wbWpzLmNvbS9wYWNrYWdlL21vbmdvZGIpIHdoaWNoIGlzIHdyYXBwZWQgYnkgYE1vbmdvLkNvbGxlY3Rpb25gLlxuICAgKiBAbG9jdXMgU2VydmVyXG4gICAqIEBtZW1iZXJvZiBNb25nby5Db2xsZWN0aW9uXG4gICAqIEBpbnN0YW5jZVxuICAgKi9cbiAgcmF3Q29sbGVjdGlvbigpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgaWYgKCEgc2VsZi5fY29sbGVjdGlvbi5yYXdDb2xsZWN0aW9uKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW4gb25seSBjYWxsIHJhd0NvbGxlY3Rpb24gb24gc2VydmVyIGNvbGxlY3Rpb25zXCIpO1xuICAgIH1cbiAgICByZXR1cm4gc2VsZi5fY29sbGVjdGlvbi5yYXdDb2xsZWN0aW9uKCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEBzdW1tYXJ5IFJldHVybnMgdGhlIFtgRGJgXShodHRwOi8vbW9uZ29kYi5naXRodWIuaW8vbm9kZS1tb25nb2RiLW5hdGl2ZS8zLjAvYXBpL0RiLmh0bWwpIG9iamVjdCBjb3JyZXNwb25kaW5nIHRvIHRoaXMgY29sbGVjdGlvbidzIGRhdGFiYXNlIGNvbm5lY3Rpb24gZnJvbSB0aGUgW25wbSBgbW9uZ29kYmAgZHJpdmVyIG1vZHVsZV0oaHR0cHM6Ly93d3cubnBtanMuY29tL3BhY2thZ2UvbW9uZ29kYikgd2hpY2ggaXMgd3JhcHBlZCBieSBgTW9uZ28uQ29sbGVjdGlvbmAuXG4gICAqIEBsb2N1cyBTZXJ2ZXJcbiAgICogQG1lbWJlcm9mIE1vbmdvLkNvbGxlY3Rpb25cbiAgICogQGluc3RhbmNlXG4gICAqL1xuICByYXdEYXRhYmFzZSgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgaWYgKCEgKHNlbGYuX2RyaXZlci5tb25nbyAmJiBzZWxmLl9kcml2ZXIubW9uZ28uZGIpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW4gb25seSBjYWxsIHJhd0RhdGFiYXNlIG9uIHNlcnZlciBjb2xsZWN0aW9uc1wiKTtcbiAgICB9XG4gICAgcmV0dXJuIHNlbGYuX2RyaXZlci5tb25nby5kYjtcbiAgfVxufSk7XG5cbi8vIENvbnZlcnQgdGhlIGNhbGxiYWNrIHRvIG5vdCByZXR1cm4gYSByZXN1bHQgaWYgdGhlcmUgaXMgYW4gZXJyb3JcbmZ1bmN0aW9uIHdyYXBDYWxsYmFjayhjYWxsYmFjaywgY29udmVydFJlc3VsdCkge1xuICByZXR1cm4gY2FsbGJhY2sgJiYgZnVuY3Rpb24gKGVycm9yLCByZXN1bHQpIHtcbiAgICBpZiAoZXJyb3IpIHtcbiAgICAgIGNhbGxiYWNrKGVycm9yKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBjb252ZXJ0UmVzdWx0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIGNhbGxiYWNrKGVycm9yLCBjb252ZXJ0UmVzdWx0KHJlc3VsdCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjYWxsYmFjayhlcnJvciwgcmVzdWx0KTtcbiAgICB9XG4gIH07XG59XG5cbi8qKlxuICogQHN1bW1hcnkgQ3JlYXRlIGEgTW9uZ28tc3R5bGUgYE9iamVjdElEYC4gIElmIHlvdSBkb24ndCBzcGVjaWZ5IGEgYGhleFN0cmluZ2AsIHRoZSBgT2JqZWN0SURgIHdpbGwgZ2VuZXJhdGVkIHJhbmRvbWx5IChub3QgdXNpbmcgTW9uZ29EQidzIElEIGNvbnN0cnVjdGlvbiBydWxlcykuXG4gKiBAbG9jdXMgQW55d2hlcmVcbiAqIEBjbGFzc1xuICogQHBhcmFtIHtTdHJpbmd9IFtoZXhTdHJpbmddIE9wdGlvbmFsLiAgVGhlIDI0LWNoYXJhY3RlciBoZXhhZGVjaW1hbCBjb250ZW50cyBvZiB0aGUgT2JqZWN0SUQgdG8gY3JlYXRlXG4gKi9cbk1vbmdvLk9iamVjdElEID0gTW9uZ29JRC5PYmplY3RJRDtcblxuLyoqXG4gKiBAc3VtbWFyeSBUbyBjcmVhdGUgYSBjdXJzb3IsIHVzZSBmaW5kLiBUbyBhY2Nlc3MgdGhlIGRvY3VtZW50cyBpbiBhIGN1cnNvciwgdXNlIGZvckVhY2gsIG1hcCwgb3IgZmV0Y2guXG4gKiBAY2xhc3NcbiAqIEBpbnN0YW5jZU5hbWUgY3Vyc29yXG4gKi9cbk1vbmdvLkN1cnNvciA9IExvY2FsQ29sbGVjdGlvbi5DdXJzb3I7XG5cbi8qKlxuICogQGRlcHJlY2F0ZWQgaW4gMC45LjFcbiAqL1xuTW9uZ28uQ29sbGVjdGlvbi5DdXJzb3IgPSBNb25nby5DdXJzb3I7XG5cbi8qKlxuICogQGRlcHJlY2F0ZWQgaW4gMC45LjFcbiAqL1xuTW9uZ28uQ29sbGVjdGlvbi5PYmplY3RJRCA9IE1vbmdvLk9iamVjdElEO1xuXG4vKipcbiAqIEBkZXByZWNhdGVkIGluIDAuOS4xXG4gKi9cbk1ldGVvci5Db2xsZWN0aW9uID0gTW9uZ28uQ29sbGVjdGlvbjtcblxuLy8gQWxsb3cgZGVueSBzdHVmZiBpcyBub3cgaW4gdGhlIGFsbG93LWRlbnkgcGFja2FnZVxuT2JqZWN0LmFzc2lnbihcbiAgTWV0ZW9yLkNvbGxlY3Rpb24ucHJvdG90eXBlLFxuICBBbGxvd0RlbnkuQ29sbGVjdGlvblByb3RvdHlwZVxuKTtcblxuZnVuY3Rpb24gcG9wQ2FsbGJhY2tGcm9tQXJncyhhcmdzKSB7XG4gIC8vIFB1bGwgb2ZmIGFueSBjYWxsYmFjayAob3IgcGVyaGFwcyBhICdjYWxsYmFjaycgdmFyaWFibGUgdGhhdCB3YXMgcGFzc2VkXG4gIC8vIGluIHVuZGVmaW5lZCwgbGlrZSBob3cgJ3Vwc2VydCcgZG9lcyBpdCkuXG4gIGlmIChhcmdzLmxlbmd0aCAmJlxuICAgICAgKGFyZ3NbYXJncy5sZW5ndGggLSAxXSA9PT0gdW5kZWZpbmVkIHx8XG4gICAgICAgYXJnc1thcmdzLmxlbmd0aCAtIDFdIGluc3RhbmNlb2YgRnVuY3Rpb24pKSB7XG4gICAgcmV0dXJuIGFyZ3MucG9wKCk7XG4gIH1cbn1cbiIsIi8qKlxuICogQHN1bW1hcnkgQWxsb3dzIGZvciB1c2VyIHNwZWNpZmllZCBjb25uZWN0aW9uIG9wdGlvbnNcbiAqIEBleGFtcGxlIGh0dHA6Ly9tb25nb2RiLmdpdGh1Yi5pby9ub2RlLW1vbmdvZGItbmF0aXZlLzMuMC9yZWZlcmVuY2UvY29ubmVjdGluZy9jb25uZWN0aW9uLXNldHRpbmdzL1xuICogQGxvY3VzIFNlcnZlclxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgVXNlciBzcGVjaWZpZWQgTW9uZ28gY29ubmVjdGlvbiBvcHRpb25zXG4gKi9cbk1vbmdvLnNldENvbm5lY3Rpb25PcHRpb25zID0gZnVuY3Rpb24gc2V0Q29ubmVjdGlvbk9wdGlvbnMgKG9wdGlvbnMpIHtcbiAgY2hlY2sob3B0aW9ucywgT2JqZWN0KTtcbiAgTW9uZ28uX2Nvbm5lY3Rpb25PcHRpb25zID0gb3B0aW9ucztcbn07Il19
