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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvbW9uZ28vbW9uZ29fZHJpdmVyLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9tb25nby9vcGxvZ190YWlsaW5nLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9tb25nby9vYnNlcnZlX211bHRpcGxleC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvbW9uZ28vZG9jX2ZldGNoZXIuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL21vbmdvL3BvbGxpbmdfb2JzZXJ2ZV9kcml2ZXIuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL21vbmdvL29wbG9nX29ic2VydmVfZHJpdmVyLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9tb25nby9vcGxvZ192Ml9jb252ZXJ0ZXIuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL21vbmdvL2xvY2FsX2NvbGxlY3Rpb25fZHJpdmVyLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9tb25nby9yZW1vdGVfY29sbGVjdGlvbl9kcml2ZXIuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL21vbmdvL2NvbGxlY3Rpb24uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL21vbmdvL2Nvbm5lY3Rpb25fb3B0aW9ucy5qcyJdLCJuYW1lcyI6WyJEb2NGZXRjaGVyIiwibW9kdWxlMSIsImxpbmsiLCJ2IiwiTW9uZ29EQiIsIk5wbU1vZHVsZU1vbmdvZGIiLCJGdXR1cmUiLCJOcG0iLCJyZXF1aXJlIiwiTW9uZ29JbnRlcm5hbHMiLCJOcG1Nb2R1bGVzIiwibW9uZ29kYiIsInZlcnNpb24iLCJOcG1Nb2R1bGVNb25nb2RiVmVyc2lvbiIsIm1vZHVsZSIsIk5wbU1vZHVsZSIsInJlcGxhY2VOYW1lcyIsImZpbHRlciIsInRoaW5nIiwiXyIsImlzQXJyYXkiLCJtYXAiLCJiaW5kIiwicmV0IiwiZWFjaCIsInZhbHVlIiwia2V5IiwiVGltZXN0YW1wIiwicHJvdG90eXBlIiwiY2xvbmUiLCJtYWtlTW9uZ29MZWdhbCIsIm5hbWUiLCJ1bm1ha2VNb25nb0xlZ2FsIiwic3Vic3RyIiwicmVwbGFjZU1vbmdvQXRvbVdpdGhNZXRlb3IiLCJkb2N1bWVudCIsIkJpbmFyeSIsImJ1ZmZlciIsIlVpbnQ4QXJyYXkiLCJPYmplY3RJRCIsIk1vbmdvIiwidG9IZXhTdHJpbmciLCJEZWNpbWFsMTI4IiwiRGVjaW1hbCIsInRvU3RyaW5nIiwic2l6ZSIsIkVKU09OIiwiZnJvbUpTT05WYWx1ZSIsInVuZGVmaW5lZCIsInJlcGxhY2VNZXRlb3JBdG9tV2l0aE1vbmdvIiwiaXNCaW5hcnkiLCJmcm9tU3RyaW5nIiwiX2lzQ3VzdG9tVHlwZSIsInRvSlNPTlZhbHVlIiwicmVwbGFjZVR5cGVzIiwiYXRvbVRyYW5zZm9ybWVyIiwicmVwbGFjZWRUb3BMZXZlbEF0b20iLCJ2YWwiLCJ2YWxSZXBsYWNlZCIsIk1vbmdvQ29ubmVjdGlvbiIsInVybCIsIm9wdGlvbnMiLCJzZWxmIiwiX29ic2VydmVNdWx0aXBsZXhlcnMiLCJfb25GYWlsb3Zlckhvb2siLCJIb29rIiwibW9uZ29PcHRpb25zIiwiT2JqZWN0IiwiYXNzaWduIiwiYXV0b1JlY29ubmVjdCIsInJlY29ubmVjdFRyaWVzIiwiSW5maW5pdHkiLCJpZ25vcmVVbmRlZmluZWQiLCJ1c2VOZXdVcmxQYXJzZXIiLCJfY29ubmVjdGlvbk9wdGlvbnMiLCJ0ZXN0IiwibmF0aXZlX3BhcnNlciIsImhhcyIsInBvb2xTaXplIiwiZGIiLCJfcHJpbWFyeSIsIl9vcGxvZ0hhbmRsZSIsIl9kb2NGZXRjaGVyIiwiY29ubmVjdEZ1dHVyZSIsImNvbm5lY3QiLCJNZXRlb3IiLCJiaW5kRW52aXJvbm1lbnQiLCJlcnIiLCJjbGllbnQiLCJzZXJ2ZXJDb25maWciLCJpc01hc3RlckRvYyIsInByaW1hcnkiLCJvbiIsImtpbmQiLCJkb2MiLCJjYWxsYmFjayIsIm1lIiwicmVzb2x2ZXIiLCJ3YWl0Iiwib3Bsb2dVcmwiLCJQYWNrYWdlIiwiT3Bsb2dIYW5kbGUiLCJkYXRhYmFzZU5hbWUiLCJjbG9zZSIsIkVycm9yIiwib3Bsb2dIYW5kbGUiLCJzdG9wIiwid3JhcCIsInJhd0NvbGxlY3Rpb24iLCJjb2xsZWN0aW9uTmFtZSIsImZ1dHVyZSIsImNvbGxlY3Rpb24iLCJfY3JlYXRlQ2FwcGVkQ29sbGVjdGlvbiIsImJ5dGVTaXplIiwibWF4RG9jdW1lbnRzIiwiY3JlYXRlQ29sbGVjdGlvbiIsImNhcHBlZCIsIm1heCIsIl9tYXliZUJlZ2luV3JpdGUiLCJmZW5jZSIsIkREUFNlcnZlciIsIl9DdXJyZW50V3JpdGVGZW5jZSIsImdldCIsImJlZ2luV3JpdGUiLCJjb21taXR0ZWQiLCJfb25GYWlsb3ZlciIsInJlZ2lzdGVyIiwid3JpdGVDYWxsYmFjayIsIndyaXRlIiwicmVmcmVzaCIsInJlc3VsdCIsInJlZnJlc2hFcnIiLCJiaW5kRW52aXJvbm1lbnRGb3JXcml0ZSIsIl9pbnNlcnQiLCJjb2xsZWN0aW9uX25hbWUiLCJzZW5kRXJyb3IiLCJlIiwiX2V4cGVjdGVkQnlUZXN0IiwiTG9jYWxDb2xsZWN0aW9uIiwiX2lzUGxhaW5PYmplY3QiLCJpZCIsIl9pZCIsImluc2VydCIsInNhZmUiLCJfcmVmcmVzaCIsInNlbGVjdG9yIiwicmVmcmVzaEtleSIsInNwZWNpZmljSWRzIiwiX2lkc01hdGNoZWRCeVNlbGVjdG9yIiwiZXh0ZW5kIiwiX3JlbW92ZSIsIndyYXBwZWRDYWxsYmFjayIsImRyaXZlclJlc3VsdCIsInRyYW5zZm9ybVJlc3VsdCIsIm51bWJlckFmZmVjdGVkIiwicmVtb3ZlIiwiX2Ryb3BDb2xsZWN0aW9uIiwiY2IiLCJkcm9wQ29sbGVjdGlvbiIsImRyb3AiLCJfZHJvcERhdGFiYXNlIiwiZHJvcERhdGFiYXNlIiwiX3VwZGF0ZSIsIm1vZCIsIkZ1bmN0aW9uIiwibW9uZ29PcHRzIiwiYXJyYXlGaWx0ZXJzIiwidXBzZXJ0IiwibXVsdGkiLCJmdWxsUmVzdWx0IiwibW9uZ29TZWxlY3RvciIsIm1vbmdvTW9kIiwiaXNNb2RpZnkiLCJfaXNNb2RpZmljYXRpb25Nb2QiLCJfZm9yYmlkUmVwbGFjZSIsImtub3duSWQiLCJuZXdEb2MiLCJfY3JlYXRlVXBzZXJ0RG9jdW1lbnQiLCJpbnNlcnRlZElkIiwiZ2VuZXJhdGVkSWQiLCJzaW11bGF0ZVVwc2VydFdpdGhJbnNlcnRlZElkIiwiZXJyb3IiLCJfcmV0dXJuT2JqZWN0IiwiaGFzT3duUHJvcGVydHkiLCIkc2V0T25JbnNlcnQiLCJ1cGRhdGUiLCJtZXRlb3JSZXN1bHQiLCJtb25nb1Jlc3VsdCIsInVwc2VydGVkIiwibGVuZ3RoIiwibiIsIk5VTV9PUFRJTUlTVElDX1RSSUVTIiwiX2lzQ2Fubm90Q2hhbmdlSWRFcnJvciIsImVycm1zZyIsImluZGV4T2YiLCJtb25nb09wdHNGb3JVcGRhdGUiLCJtb25nb09wdHNGb3JJbnNlcnQiLCJyZXBsYWNlbWVudFdpdGhJZCIsInRyaWVzIiwiZG9VcGRhdGUiLCJkb0NvbmRpdGlvbmFsSW5zZXJ0IiwibWV0aG9kIiwid3JhcEFzeW5jIiwiYXBwbHkiLCJhcmd1bWVudHMiLCJmaW5kIiwiQ3Vyc29yIiwiQ3Vyc29yRGVzY3JpcHRpb24iLCJmaW5kT25lIiwibGltaXQiLCJmZXRjaCIsIl9lbnN1cmVJbmRleCIsImluZGV4IiwiaW5kZXhOYW1lIiwiZW5zdXJlSW5kZXgiLCJFeGNlcHRpb24iLCJfZHJvcEluZGV4IiwiZHJvcEluZGV4IiwiQ29sbGVjdGlvbiIsIl9yZXdyaXRlU2VsZWN0b3IiLCJtb25nbyIsImN1cnNvckRlc2NyaXB0aW9uIiwiX21vbmdvIiwiX2N1cnNvckRlc2NyaXB0aW9uIiwiX3N5bmNocm9ub3VzQ3Vyc29yIiwiU3ltYm9sIiwiaXRlcmF0b3IiLCJ0YWlsYWJsZSIsIl9jcmVhdGVTeW5jaHJvbm91c0N1cnNvciIsInNlbGZGb3JJdGVyYXRpb24iLCJ1c2VUcmFuc2Zvcm0iLCJyZXdpbmQiLCJnZXRUcmFuc2Zvcm0iLCJ0cmFuc2Zvcm0iLCJfcHVibGlzaEN1cnNvciIsInN1YiIsIl9nZXRDb2xsZWN0aW9uTmFtZSIsIm9ic2VydmUiLCJjYWxsYmFja3MiLCJfb2JzZXJ2ZUZyb21PYnNlcnZlQ2hhbmdlcyIsIm9ic2VydmVDaGFuZ2VzIiwibWV0aG9kcyIsIm9yZGVyZWQiLCJfb2JzZXJ2ZUNoYW5nZXNDYWxsYmFja3NBcmVPcmRlcmVkIiwiZXhjZXB0aW9uTmFtZSIsImZvckVhY2giLCJfb2JzZXJ2ZUNoYW5nZXMiLCJwaWNrIiwiY3Vyc29yT3B0aW9ucyIsInNvcnQiLCJza2lwIiwicHJvamVjdGlvbiIsImZpZWxkcyIsImF3YWl0ZGF0YSIsIm51bWJlck9mUmV0cmllcyIsIk9QTE9HX0NPTExFQ1RJT04iLCJ0cyIsIm9wbG9nUmVwbGF5IiwiZGJDdXJzb3IiLCJtYXhUaW1lTXMiLCJtYXhUaW1lTVMiLCJoaW50IiwiU3luY2hyb25vdXNDdXJzb3IiLCJfZGJDdXJzb3IiLCJfc2VsZkZvckl0ZXJhdGlvbiIsIl90cmFuc2Zvcm0iLCJ3cmFwVHJhbnNmb3JtIiwiX3N5bmNocm9ub3VzQ291bnQiLCJjb3VudCIsIl92aXNpdGVkSWRzIiwiX0lkTWFwIiwiX3Jhd05leHRPYmplY3RQcm9taXNlIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJuZXh0IiwiX25leHRPYmplY3RQcm9taXNlIiwic2V0IiwiX25leHRPYmplY3RQcm9taXNlV2l0aFRpbWVvdXQiLCJ0aW1lb3V0TVMiLCJuZXh0T2JqZWN0UHJvbWlzZSIsInRpbWVvdXRFcnIiLCJ0aW1lb3V0UHJvbWlzZSIsInRpbWVyIiwic2V0VGltZW91dCIsInJhY2UiLCJjYXRjaCIsIl9uZXh0T2JqZWN0IiwiYXdhaXQiLCJ0aGlzQXJnIiwiX3Jld2luZCIsImNhbGwiLCJyZXMiLCJwdXNoIiwiaWRlbnRpdHkiLCJhcHBseVNraXBMaW1pdCIsImdldFJhd09iamVjdHMiLCJyZXN1bHRzIiwiZG9uZSIsInRhaWwiLCJkb2NDYWxsYmFjayIsImN1cnNvciIsInN0b3BwZWQiLCJsYXN0VFMiLCJsb29wIiwibmV3U2VsZWN0b3IiLCIkZ3QiLCJkZWZlciIsIl9vYnNlcnZlQ2hhbmdlc1RhaWxhYmxlIiwib2JzZXJ2ZUtleSIsInN0cmluZ2lmeSIsIm11bHRpcGxleGVyIiwib2JzZXJ2ZURyaXZlciIsImZpcnN0SGFuZGxlIiwiX25vWWllbGRzQWxsb3dlZCIsIk9ic2VydmVNdWx0aXBsZXhlciIsIm9uU3RvcCIsIm9ic2VydmVIYW5kbGUiLCJPYnNlcnZlSGFuZGxlIiwibWF0Y2hlciIsInNvcnRlciIsImNhblVzZU9wbG9nIiwiYWxsIiwiX3Rlc3RPbmx5UG9sbENhbGxiYWNrIiwiTWluaW1vbmdvIiwiTWF0Y2hlciIsIk9wbG9nT2JzZXJ2ZURyaXZlciIsImN1cnNvclN1cHBvcnRlZCIsIlNvcnRlciIsImYiLCJkcml2ZXJDbGFzcyIsIlBvbGxpbmdPYnNlcnZlRHJpdmVyIiwibW9uZ29IYW5kbGUiLCJfb2JzZXJ2ZURyaXZlciIsImFkZEhhbmRsZUFuZFNlbmRJbml0aWFsQWRkcyIsImxpc3RlbkFsbCIsImxpc3RlbkNhbGxiYWNrIiwibGlzdGVuZXJzIiwiZm9yRWFjaFRyaWdnZXIiLCJ0cmlnZ2VyIiwiX0ludmFsaWRhdGlvbkNyb3NzYmFyIiwibGlzdGVuIiwibGlzdGVuZXIiLCJ0cmlnZ2VyQ2FsbGJhY2siLCJhZGRlZEJlZm9yZSIsImFkZGVkIiwiTW9uZ29UaW1lc3RhbXAiLCJDb25uZWN0aW9uIiwiVE9PX0ZBUl9CRUhJTkQiLCJwcm9jZXNzIiwiZW52IiwiTUVURU9SX09QTE9HX1RPT19GQVJfQkVISU5EIiwiVEFJTF9USU1FT1VUIiwiTUVURU9SX09QTE9HX1RBSUxfVElNRU9VVCIsInNob3dUUyIsImdldEhpZ2hCaXRzIiwiZ2V0TG93Qml0cyIsImlkRm9yT3AiLCJvcCIsIm8iLCJvMiIsImRiTmFtZSIsIl9vcGxvZ1VybCIsIl9kYk5hbWUiLCJfb3Bsb2dMYXN0RW50cnlDb25uZWN0aW9uIiwiX29wbG9nVGFpbENvbm5lY3Rpb24iLCJfc3RvcHBlZCIsIl90YWlsSGFuZGxlIiwiX3JlYWR5RnV0dXJlIiwiX2Nyb3NzYmFyIiwiX0Nyb3NzYmFyIiwiZmFjdFBhY2thZ2UiLCJmYWN0TmFtZSIsIl9iYXNlT3Bsb2dTZWxlY3RvciIsIm5zIiwiUmVnRXhwIiwiX2VzY2FwZVJlZ0V4cCIsImpvaW4iLCIkb3IiLCIkaW4iLCIkZXhpc3RzIiwiX2NhdGNoaW5nVXBGdXR1cmVzIiwiX2xhc3RQcm9jZXNzZWRUUyIsIl9vblNraXBwZWRFbnRyaWVzSG9vayIsImRlYnVnUHJpbnRFeGNlcHRpb25zIiwiX2VudHJ5UXVldWUiLCJfRG91YmxlRW5kZWRRdWV1ZSIsIl93b3JrZXJBY3RpdmUiLCJfc3RhcnRUYWlsaW5nIiwib25PcGxvZ0VudHJ5Iiwib3JpZ2luYWxDYWxsYmFjayIsIm5vdGlmaWNhdGlvbiIsIl9kZWJ1ZyIsImxpc3RlbkhhbmRsZSIsIm9uU2tpcHBlZEVudHJpZXMiLCJ3YWl0VW50aWxDYXVnaHRVcCIsImxhc3RFbnRyeSIsIiRuYXR1cmFsIiwiX3NsZWVwRm9yTXMiLCJsZXNzVGhhbk9yRXF1YWwiLCJpbnNlcnRBZnRlciIsImdyZWF0ZXJUaGFuIiwic3BsaWNlIiwibW9uZ29kYlVyaSIsInBhcnNlIiwiZGF0YWJhc2UiLCJhZG1pbiIsImNvbW1hbmQiLCJpc21hc3RlciIsInNldE5hbWUiLCJsYXN0T3Bsb2dFbnRyeSIsIm9wbG9nU2VsZWN0b3IiLCJfbWF5YmVTdGFydFdvcmtlciIsInJldHVybiIsImhhbmRsZURvYyIsImFwcGx5T3BzIiwibmV4dFRpbWVzdGFtcCIsImFkZCIsIk9ORSIsInN0YXJ0c1dpdGgiLCJzbGljZSIsImZpcmUiLCJpc0VtcHR5IiwicG9wIiwiY2xlYXIiLCJfc2V0TGFzdFByb2Nlc3NlZFRTIiwic2hpZnQiLCJzZXF1ZW5jZXIiLCJfZGVmaW5lVG9vRmFyQmVoaW5kIiwiX3Jlc2V0VG9vRmFyQmVoaW5kIiwiRmFjdHMiLCJpbmNyZW1lbnRTZXJ2ZXJGYWN0IiwiX29yZGVyZWQiLCJfb25TdG9wIiwiX3F1ZXVlIiwiX1N5bmNocm9ub3VzUXVldWUiLCJfaGFuZGxlcyIsIl9jYWNoZSIsIl9DYWNoaW5nQ2hhbmdlT2JzZXJ2ZXIiLCJfYWRkSGFuZGxlVGFza3NTY2hlZHVsZWRCdXROb3RQZXJmb3JtZWQiLCJjYWxsYmFja05hbWVzIiwiY2FsbGJhY2tOYW1lIiwiX2FwcGx5Q2FsbGJhY2siLCJ0b0FycmF5IiwiaGFuZGxlIiwic2FmZVRvUnVuVGFzayIsInJ1blRhc2siLCJfc2VuZEFkZHMiLCJyZW1vdmVIYW5kbGUiLCJfcmVhZHkiLCJfc3RvcCIsImZyb21RdWVyeUVycm9yIiwicmVhZHkiLCJxdWV1ZVRhc2siLCJxdWVyeUVycm9yIiwidGhyb3ciLCJvbkZsdXNoIiwiaXNSZXNvbHZlZCIsImFyZ3MiLCJhcHBseUNoYW5nZSIsImtleXMiLCJoYW5kbGVJZCIsIl9hZGRlZEJlZm9yZSIsIl9hZGRlZCIsImRvY3MiLCJuZXh0T2JzZXJ2ZUhhbmRsZUlkIiwiX211bHRpcGxleGVyIiwiYmVmb3JlIiwiZXhwb3J0IiwiRmliZXIiLCJjb25zdHJ1Y3RvciIsIm1vbmdvQ29ubmVjdGlvbiIsIl9tb25nb0Nvbm5lY3Rpb24iLCJfY2FsbGJhY2tzRm9yT3AiLCJNYXAiLCJjaGVjayIsIlN0cmluZyIsImRlbGV0ZSIsInJ1biIsIlBPTExJTkdfVEhST1RUTEVfTVMiLCJNRVRFT1JfUE9MTElOR19USFJPVFRMRV9NUyIsIlBPTExJTkdfSU5URVJWQUxfTVMiLCJNRVRFT1JfUE9MTElOR19JTlRFUlZBTF9NUyIsIl9tb25nb0hhbmRsZSIsIl9zdG9wQ2FsbGJhY2tzIiwiX3Jlc3VsdHMiLCJfcG9sbHNTY2hlZHVsZWRCdXROb3RTdGFydGVkIiwiX3BlbmRpbmdXcml0ZXMiLCJfZW5zdXJlUG9sbElzU2NoZWR1bGVkIiwidGhyb3R0bGUiLCJfdW50aHJvdHRsZWRFbnN1cmVQb2xsSXNTY2hlZHVsZWQiLCJwb2xsaW5nVGhyb3R0bGVNcyIsIl90YXNrUXVldWUiLCJsaXN0ZW5lcnNIYW5kbGUiLCJwb2xsaW5nSW50ZXJ2YWwiLCJwb2xsaW5nSW50ZXJ2YWxNcyIsIl9wb2xsaW5nSW50ZXJ2YWwiLCJpbnRlcnZhbEhhbmRsZSIsInNldEludGVydmFsIiwiY2xlYXJJbnRlcnZhbCIsIl9wb2xsTW9uZ28iLCJfc3VzcGVuZFBvbGxpbmciLCJfcmVzdW1lUG9sbGluZyIsImZpcnN0IiwibmV3UmVzdWx0cyIsIm9sZFJlc3VsdHMiLCJ3cml0ZXNGb3JDeWNsZSIsImNvZGUiLCJKU09OIiwibWVzc2FnZSIsIkFycmF5IiwiX2RpZmZRdWVyeUNoYW5nZXMiLCJ3IiwiYyIsIm9wbG9nVjJWMUNvbnZlcnRlciIsIlBIQVNFIiwiUVVFUllJTkciLCJGRVRDSElORyIsIlNURUFEWSIsIlN3aXRjaGVkVG9RdWVyeSIsImZpbmlzaElmTmVlZFRvUG9sbFF1ZXJ5IiwiY3VycmVudElkIiwiX3VzZXNPcGxvZyIsImNvbXBhcmF0b3IiLCJnZXRDb21wYXJhdG9yIiwiaGVhcE9wdGlvbnMiLCJJZE1hcCIsIl9saW1pdCIsIl9jb21wYXJhdG9yIiwiX3NvcnRlciIsIl91bnB1Ymxpc2hlZEJ1ZmZlciIsIk1pbk1heEhlYXAiLCJfcHVibGlzaGVkIiwiTWF4SGVhcCIsIl9zYWZlQXBwZW5kVG9CdWZmZXIiLCJfc3RvcEhhbmRsZXMiLCJfcmVnaXN0ZXJQaGFzZUNoYW5nZSIsIl9tYXRjaGVyIiwiX3Byb2plY3Rpb25GbiIsIl9jb21waWxlUHJvamVjdGlvbiIsIl9zaGFyZWRQcm9qZWN0aW9uIiwiY29tYmluZUludG9Qcm9qZWN0aW9uIiwiX3NoYXJlZFByb2plY3Rpb25GbiIsIl9uZWVkVG9GZXRjaCIsIl9jdXJyZW50bHlGZXRjaGluZyIsIl9mZXRjaEdlbmVyYXRpb24iLCJfcmVxdWVyeVdoZW5Eb25lVGhpc1F1ZXJ5IiwiX3dyaXRlc1RvQ29tbWl0V2hlbldlUmVhY2hTdGVhZHkiLCJfbmVlZFRvUG9sbFF1ZXJ5IiwiX3BoYXNlIiwiX2hhbmRsZU9wbG9nRW50cnlRdWVyeWluZyIsIl9oYW5kbGVPcGxvZ0VudHJ5U3RlYWR5T3JGZXRjaGluZyIsImZpcmVkIiwiX29wbG9nT2JzZXJ2ZURyaXZlcnMiLCJvbkJlZm9yZUZpcmUiLCJkcml2ZXJzIiwiZHJpdmVyIiwiX3J1bkluaXRpYWxRdWVyeSIsIl9hZGRQdWJsaXNoZWQiLCJvdmVyZmxvd2luZ0RvY0lkIiwibWF4RWxlbWVudElkIiwib3ZlcmZsb3dpbmdEb2MiLCJlcXVhbHMiLCJyZW1vdmVkIiwiX2FkZEJ1ZmZlcmVkIiwiX3JlbW92ZVB1Ymxpc2hlZCIsImVtcHR5IiwibmV3RG9jSWQiLCJtaW5FbGVtZW50SWQiLCJfcmVtb3ZlQnVmZmVyZWQiLCJfY2hhbmdlUHVibGlzaGVkIiwib2xkRG9jIiwicHJvamVjdGVkTmV3IiwicHJvamVjdGVkT2xkIiwiY2hhbmdlZCIsIkRpZmZTZXF1ZW5jZSIsIm1ha2VDaGFuZ2VkRmllbGRzIiwibWF4QnVmZmVyZWRJZCIsIl9hZGRNYXRjaGluZyIsIm1heFB1Ymxpc2hlZCIsIm1heEJ1ZmZlcmVkIiwidG9QdWJsaXNoIiwiY2FuQXBwZW5kVG9CdWZmZXIiLCJjYW5JbnNlcnRJbnRvQnVmZmVyIiwidG9CdWZmZXIiLCJfcmVtb3ZlTWF0Y2hpbmciLCJfaGFuZGxlRG9jIiwibWF0Y2hlc05vdyIsImRvY3VtZW50TWF0Y2hlcyIsInB1Ymxpc2hlZEJlZm9yZSIsImJ1ZmZlcmVkQmVmb3JlIiwiY2FjaGVkQmVmb3JlIiwibWluQnVmZmVyZWQiLCJzdGF5c0luUHVibGlzaGVkIiwic3RheXNJbkJ1ZmZlciIsIl9mZXRjaE1vZGlmaWVkRG9jdW1lbnRzIiwidGhpc0dlbmVyYXRpb24iLCJ3YWl0aW5nIiwiZnV0IiwiX2JlU3RlYWR5Iiwid3JpdGVzIiwiaXNSZXBsYWNlIiwiY2FuRGlyZWN0bHlNb2RpZnlEb2MiLCJtb2RpZmllckNhbkJlRGlyZWN0bHlBcHBsaWVkIiwiX21vZGlmeSIsImNhbkJlY29tZVRydWVCeU1vZGlmaWVyIiwiYWZmZWN0ZWRCeU1vZGlmaWVyIiwiX3J1blF1ZXJ5IiwiaW5pdGlhbCIsIl9kb25lUXVlcnlpbmciLCJfcG9sbFF1ZXJ5IiwibmV3QnVmZmVyIiwiX2N1cnNvckZvclF1ZXJ5IiwiaSIsIl9wdWJsaXNoTmV3UmVzdWx0cyIsIm9wdGlvbnNPdmVyd3JpdGUiLCJkZXNjcmlwdGlvbiIsImlkc1RvUmVtb3ZlIiwiY29uc29sZSIsIl9vcGxvZ0VudHJ5SGFuZGxlIiwiX2xpc3RlbmVyc0hhbmRsZSIsInBoYXNlIiwibm93IiwiRGF0ZSIsInRpbWVEaWZmIiwiX3BoYXNlU3RhcnRUaW1lIiwiZGlzYWJsZU9wbG9nIiwiX2Rpc2FibGVPcGxvZyIsIl9jaGVja1N1cHBvcnRlZFByb2plY3Rpb24iLCJoYXNXaGVyZSIsImhhc0dlb1F1ZXJ5IiwibW9kaWZpZXIiLCJvcGVyYXRpb24iLCJmaWVsZCIsInByZWZpeCIsImFycmF5T3BlcmF0b3JLZXlSZWdleCIsImlzQXJyYXlPcGVyYXRvcktleSIsImlzQXJyYXlPcGVyYXRvciIsIm9wZXJhdG9yIiwiYSIsImV2ZXJ5IiwiZmxhdHRlbk9iamVjdEludG8iLCJ0YXJnZXQiLCJzb3VyY2UiLCJlbnRyaWVzIiwibG9nRGVidWdNZXNzYWdlcyIsIk9QTE9HX0NPTlZFUlRFUl9ERUJVRyIsImNvbnZlcnRPcGxvZ0RpZmYiLCJvcGxvZ0VudHJ5IiwiZGlmZiIsImxvZyIsImRpZmZLZXkiLCIkdW5zZXQiLCIkc2V0IiwicG9zaXRpb24iLCJwb3NpdGlvbktleSIsIiR2IiwiY29udmVydGVkT3Bsb2dFbnRyeSIsIkxvY2FsQ29sbGVjdGlvbkRyaXZlciIsIm5vQ29ubkNvbGxlY3Rpb25zIiwiY3JlYXRlIiwib3BlbiIsImNvbm4iLCJlbnN1cmVDb2xsZWN0aW9uIiwiX21vbmdvX2xpdmVkYXRhX2NvbGxlY3Rpb25zIiwiY29sbGVjdGlvbnMiLCJSZW1vdGVDb2xsZWN0aW9uRHJpdmVyIiwibW9uZ29fdXJsIiwibSIsImRlZmF1bHRSZW1vdGVDb2xsZWN0aW9uRHJpdmVyIiwib25jZSIsImNvbm5lY3Rpb25PcHRpb25zIiwibW9uZ29VcmwiLCJNT05HT19VUkwiLCJNT05HT19PUExPR19VUkwiLCJfb2JqZWN0U3ByZWFkIiwiZGVmYXVsdCIsImNvbm5lY3Rpb24iLCJtYW5hZ2VyIiwiaWRHZW5lcmF0aW9uIiwiX2RyaXZlciIsIl9wcmV2ZW50QXV0b3B1Ymxpc2giLCJfbWFrZU5ld0lEIiwic3JjIiwiRERQIiwicmFuZG9tU3RyZWFtIiwiUmFuZG9tIiwiaW5zZWN1cmUiLCJoZXhTdHJpbmciLCJfY29ubmVjdGlvbiIsImlzQ2xpZW50Iiwic2VydmVyIiwiX2NvbGxlY3Rpb24iLCJfbmFtZSIsIl9tYXliZVNldFVwUmVwbGljYXRpb24iLCJkZWZpbmVNdXRhdGlvbk1ldGhvZHMiLCJfZGVmaW5lTXV0YXRpb25NZXRob2RzIiwidXNlRXhpc3RpbmciLCJfc3VwcHJlc3NTYW1lTmFtZUVycm9yIiwiYXV0b3B1Ymxpc2giLCJwdWJsaXNoIiwiaXNfYXV0byIsInJlZ2lzdGVyU3RvcmUiLCJvayIsImJlZ2luVXBkYXRlIiwiYmF0Y2hTaXplIiwicmVzZXQiLCJwYXVzZU9ic2VydmVycyIsIm1zZyIsIm1vbmdvSWQiLCJNb25nb0lEIiwiaWRQYXJzZSIsInJlcGxhY2UiLCJlbmRVcGRhdGUiLCJyZXN1bWVPYnNlcnZlcnMiLCJzYXZlT3JpZ2luYWxzIiwicmV0cmlldmVPcmlnaW5hbHMiLCJnZXREb2MiLCJfZ2V0Q29sbGVjdGlvbiIsIndhcm4iLCJfZ2V0RmluZFNlbGVjdG9yIiwiX2dldEZpbmRPcHRpb25zIiwiTWF0Y2giLCJPcHRpb25hbCIsIk9iamVjdEluY2x1ZGluZyIsIk9uZU9mIiwiTnVtYmVyIiwiZmFsbGJhY2tJZCIsIl9zZWxlY3RvcklzSWQiLCJnZXRQcm90b3R5cGVPZiIsImdldE93blByb3BlcnR5RGVzY3JpcHRvcnMiLCJnZW5lcmF0ZUlkIiwiX2lzUmVtb3RlQ29sbGVjdGlvbiIsImVuY2xvc2luZyIsIl9DdXJyZW50TWV0aG9kSW52b2NhdGlvbiIsImNob29zZVJldHVyblZhbHVlRnJvbUNvbGxlY3Rpb25SZXN1bHQiLCJ3cmFwQ2FsbGJhY2siLCJfY2FsbE11dGF0b3JNZXRob2QiLCJvcHRpb25zQW5kQ2FsbGJhY2siLCJwb3BDYWxsYmFja0Zyb21BcmdzIiwicmF3RGF0YWJhc2UiLCJjb252ZXJ0UmVzdWx0IiwiQWxsb3dEZW55IiwiQ29sbGVjdGlvblByb3RvdHlwZSIsInNldENvbm5lY3Rpb25PcHRpb25zIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsTUFBSUEsVUFBSjtBQUFlQyxTQUFPLENBQUNDLElBQVIsQ0FBYSxrQkFBYixFQUFnQztBQUFDRixjQUFVLENBQUNHLENBQUQsRUFBRztBQUFDSCxnQkFBVSxHQUFDRyxDQUFYO0FBQWE7O0FBQTVCLEdBQWhDLEVBQThELENBQTlEOztBQUFmOzs7Ozs7OztBQVNBLE1BQUlDLE9BQU8sR0FBR0MsZ0JBQWQ7O0FBQ0EsTUFBSUMsTUFBTSxHQUFHQyxHQUFHLENBQUNDLE9BQUosQ0FBWSxlQUFaLENBQWI7O0FBR0FDLGdCQUFjLEdBQUcsRUFBakI7QUFFQUEsZ0JBQWMsQ0FBQ0MsVUFBZixHQUE0QjtBQUMxQkMsV0FBTyxFQUFFO0FBQ1BDLGFBQU8sRUFBRUMsdUJBREY7QUFFUEMsWUFBTSxFQUFFVjtBQUZEO0FBRGlCLEdBQTVCLEMsQ0FPQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQUssZ0JBQWMsQ0FBQ00sU0FBZixHQUEyQlgsT0FBM0IsQyxDQUVBO0FBQ0E7O0FBQ0EsTUFBSVksWUFBWSxHQUFHLFVBQVVDLE1BQVYsRUFBa0JDLEtBQWxCLEVBQXlCO0FBQzFDLFFBQUksT0FBT0EsS0FBUCxLQUFpQixRQUFqQixJQUE2QkEsS0FBSyxLQUFLLElBQTNDLEVBQWlEO0FBQy9DLFVBQUlDLENBQUMsQ0FBQ0MsT0FBRixDQUFVRixLQUFWLENBQUosRUFBc0I7QUFDcEIsZUFBT0MsQ0FBQyxDQUFDRSxHQUFGLENBQU1ILEtBQU4sRUFBYUMsQ0FBQyxDQUFDRyxJQUFGLENBQU9OLFlBQVAsRUFBcUIsSUFBckIsRUFBMkJDLE1BQTNCLENBQWIsQ0FBUDtBQUNEOztBQUNELFVBQUlNLEdBQUcsR0FBRyxFQUFWOztBQUNBSixPQUFDLENBQUNL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LENBQUM5WixPQUFELEVBQVVNLE1BQVYsQ0FBTDtBQUNBM0IsT0FBSyxDQUFDa0Msa0JBQU4sR0FBMkJiLE9BQTNCO0FBQ0QsQ0FIRCxDIiwiZmlsZSI6Ii9wYWNrYWdlcy9tb25nby5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogUHJvdmlkZSBhIHN5bmNocm9ub3VzIENvbGxlY3Rpb24gQVBJIHVzaW5nIGZpYmVycywgYmFja2VkIGJ5XG4gKiBNb25nb0RCLiAgVGhpcyBpcyBvbmx5IGZvciB1c2Ugb24gdGhlIHNlcnZlciwgYW5kIG1vc3RseSBpZGVudGljYWxcbiAqIHRvIHRoZSBjbGllbnQgQVBJLlxuICpcbiAqIE5PVEU6IHRoZSBwdWJsaWMgQVBJIG1ldGhvZHMgbXVzdCBiZSBydW4gd2l0aGluIGEgZmliZXIuIElmIHlvdSBjYWxsXG4gKiB0aGVzZSBvdXRzaWRlIG9mIGEgZmliZXIgdGhleSB3aWxsIGV4cGxvZGUhXG4gKi9cblxudmFyIE1vbmdvREIgPSBOcG1Nb2R1bGVNb25nb2RiO1xudmFyIEZ1dHVyZSA9IE5wbS5yZXF1aXJlKCdmaWJlcnMvZnV0dXJlJyk7XG5pbXBvcnQgeyBEb2NGZXRjaGVyIH0gZnJvbSBcIi4vZG9jX2ZldGNoZXIuanNcIjtcblxuTW9uZ29JbnRlcm5hbHMgPSB7fTtcblxuTW9uZ29JbnRlcm5hbHMuTnBtTW9kdWxlcyA9IHtcbiAgbW9uZ29kYjoge1xuICAgIHZlcnNpb246IE5wbU1vZHVsZU1vbmdvZGJWZXJzaW9uLFxuICAgIG1vZHVsZTogTW9uZ29EQlxuICB9XG59O1xuXG4vLyBPbGRlciB2ZXJzaW9uIG9mIHdoYXQgaXMgbm93IGF2YWlsYWJsZSB2aWFcbi8vIE1vbmdvSW50ZXJuYWxzLk5wbU1vZHVsZXMubW9uZ29kYi5tb2R1bGUuICBJdCB3YXMgbmV2ZXIgZG9jdW1lbnRlZCwgYnV0XG4vLyBwZW9wbGUgZG8gdXNlIGl0LlxuLy8gWFhYIENPTVBBVCBXSVRIIDEuMC4zLjJcbk1vbmdvSW50ZXJuYWxzLk5wbU1vZHVsZSA9IE1vbmdvREI7XG5cbi8vIFRoaXMgaXMgdXNlZCB0byBhZGQgb3IgcmVtb3ZlIEVKU09OIGZyb20gdGhlIGJlZ2lubmluZyBvZiBldmVyeXRoaW5nIG5lc3RlZFxuLy8gaW5zaWRlIGFuIEVKU09OIGN1c3RvbSB0eXBlLiBJdCBzaG91bGQgb25seSBiZSBjYWxsZWQgb24gcHVyZSBKU09OIVxudmFyIHJlcGxhY2VOYW1lcyA9IGZ1bmN0aW9uIChmaWx0ZXIsIHRoaW5nKSB7XG4gIGlmICh0eXBlb2YgdGhpbmcgPT09IFwib2JqZWN0XCIgJiYgdGhpbmcgIT09IG51bGwpIHtcbiAgICBpZiAoXy5pc0FycmF5KHRoaW5nKSkge1xuICAgICAgcmV0dXJuIF8ubWFwKHRoaW5nLCBfLmJpbmQocmVwbGFjZU5hbWVzLCBudWxsLCBmaWx0ZXIpKTtcbiAgICB9XG4gICAgdmFyIHJldCA9IHt9O1xuICAgIF8uZWFjaCh0aGluZywgZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcbiAgICAgIHJldFtmaWx0ZXIoa2V5KV0gPSByZXBsYWNlTmFtZXMoZmlsdGVyLCB2YWx1ZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJldDtcbiAgfVxuICByZXR1cm4gdGhpbmc7XG59O1xuXG4vLyBFbnN1cmUgdGhhdCBFSlNPTi5jbG9uZSBrZWVwcyBhIFRpbWVzdGFtcCBhcyBhIFRpbWVzdGFtcCAoaW5zdGVhZCBvZiBqdXN0XG4vLyBkb2luZyBhIHN0cnVjdHVyYWwgY2xvbmUpLlxuLy8gWFhYIGhvdyBvayBpcyB0aGlzPyB3aGF0IGlmIHRoZXJlIGFyZSBtdWx0aXBsZSBjb3BpZXMgb2YgTW9uZ29EQiBsb2FkZWQ/XG5Nb25nb0RCLlRpbWVzdGFtcC5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbiAoKSB7XG4gIC8vIFRpbWVzdGFtcHMgc2hvdWxkIGJlIGltbXV0YWJsZS5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG52YXIgbWFrZU1vbmdvTGVnYWwgPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gXCJFSlNPTlwiICsgbmFtZTsgfTtcbnZhciB1bm1ha2VNb25nb0xlZ2FsID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIG5hbWUuc3Vic3RyKDUpOyB9O1xuXG52YXIgcmVwbGFjZU1vbmdvQXRvbVdpdGhNZXRlb3IgPSBmdW5jdGlvbiAoZG9jdW1lbnQpIHtcbiAgaWYgKGRvY3VtZW50IGluc3RhbmNlb2YgTW9uZ29EQi5CaW5hcnkpIHtcbiAgICB2YXIgYnVmZmVyID0gZG9jdW1lbnQudmFsdWUodHJ1ZSk7XG4gICAgcmV0dXJuIG5ldyBVaW50OEFycmF5KGJ1ZmZlcik7XG4gIH1cbiAgaWYgKGRvY3VtZW50IGluc3RhbmNlb2YgTW9uZ29EQi5PYmplY3RJRCkge1xuICAgIHJldHVybiBuZXcgTW9uZ28uT2JqZWN0SUQoZG9jdW1lbnQudG9IZXhTdHJpbmcoKSk7XG4gIH1cbiAgaWYgKGRvY3VtZW50IGluc3RhbmNlb2YgTW9uZ29EQi5EZWNpbWFsMTI4KSB7XG4gICAgcmV0dXJuIERlY2ltYWwoZG9jdW1lbnQudG9TdHJpbmcoKSk7XG4gIH1cbiAgaWYgKGRvY3VtZW50W1wiRUpTT04kdHlwZVwiXSAmJiBkb2N1bWVudFtcIkVKU09OJHZhbHVlXCJdICYmIF8uc2l6ZShkb2N1bWVudCkgPT09IDIpIHtcbiAgICByZXR1cm4gRUpTT04uZnJvbUpTT05WYWx1ZShyZXBsYWNlTmFtZXModW5tYWtlTW9uZ29MZWdhbCwgZG9jdW1lbnQpKTtcbiAgfVxuICBpZiAoZG9jdW1lbnQgaW5zdGFuY2VvZiBNb25nb0RCLlRpbWVzdGFtcCkge1xuICAgIC8vIEZvciBub3csIHRoZSBNZXRlb3IgcmVwcmVzZW50YXRpb24gb2YgYSBNb25nbyB0aW1lc3RhbXAgdHlwZSAobm90IGEgZGF0ZSFcbiAgICAvLyB0aGlzIGlzIGEgd2VpcmQgaW50ZXJuYWwgdGhpbmcgdXNlZCBpbiB0aGUgb3Bsb2chKSBpcyB0aGUgc2FtZSBhcyB0aGVcbiAgICAvLyBNb25nbyByZXByZXNlbnRhdGlvbi4gV2UgbmVlZCB0byBkbyB0aGlzIGV4cGxpY2l0bHkgb3IgZWxzZSB3ZSB3b3VsZCBkbyBhXG4gICAgLy8gc3RydWN0dXJhbCBjbG9uZSBhbmQgbG9zZSB0aGUgcHJvdG90eXBlLlxuICAgIHJldHVybiBkb2N1bWVudDtcbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufTtcblxudmFyIHJlcGxhY2VNZXRlb3JBdG9tV2l0aE1vbmdvID0gZnVuY3Rpb24gKGRvY3VtZW50KSB7XG4gIGlmIChFSlNPTi5pc0JpbmFyeShkb2N1bWVudCkpIHtcbiAgICAvLyBUaGlzIGRvZXMgbW9yZSBjb3BpZXMgdGhhbiB3ZSdkIGxpa2UsIGJ1dCBpcyBuZWNlc3NhcnkgYmVjYXVzZVxuICAgIC8vIE1vbmdvREIuQlNPTiBvbmx5IGxvb2tzIGxpa2UgaXQgdGFrZXMgYSBVaW50OEFycmF5IChhbmQgZG9lc24ndCBhY3R1YWxseVxuICAgIC8vIHNlcmlhbGl6ZSBpdCBjb3JyZWN0bHkpLlxuICAgIC8vIHJldHVybiBuZXcgTW9uZ29EQi5CaW5hcnkoQnVmZmVyLmZyb20oZG9jdW1lbnQpKTtcbiAgfVxuICBpZiAoZG9jdW1lbnQgaW5zdGFuY2VvZiBNb25nby5PYmplY3RJRCkge1xuICAgIHJldHVybiBuZXcgTW9uZ29EQi5PYmplY3RJRChkb2N1bWVudC50b0hleFN0cmluZygpKTtcbiAgfVxuICBpZiAoZG9jdW1lbnQgaW5zdGFuY2VvZiBNb25nb0RCLlRpbWVzdGFtcCkge1xuICAgIC8vIEZvciBub3csIHRoZSBNZXRlb3IgcmVwcmVzZW50YXRpb24gb2YgYSBNb25nbyB0aW1lc3RhbXAgdHlwZSAobm90IGEgZGF0ZSFcbiAgICAvLyB0aGlzIGlzIGEgd2VpcmQgaW50ZXJuYWwgdGhpbmcgdXNlZCBpbiB0aGUgb3Bsb2chKSBpcyB0aGUgc2FtZSBhcyB0aGVcbiAgICAvLyBNb25nbyByZXByZXNlbnRhdGlvbi4gV2UgbmVlZCB0byBkbyB0aGlzIGV4cGxpY2l0bHkgb3IgZWxzZSB3ZSB3b3VsZCBkbyBhXG4gICAgLy8gc3RydWN0dXJhbCBjbG9uZSBhbmQgbG9zZSB0aGUgcHJvdG90eXBlLlxuICAgIHJldHVybiBkb2N1bWVudDtcbiAgfVxuICBpZiAoZG9jdW1lbnQgaW5zdGFuY2VvZiBEZWNpbWFsKSB7XG4gICAgcmV0dXJuIE1vbmdvREIuRGVjaW1hbDEyOC5mcm9tU3RyaW5nKGRvY3VtZW50LnRvU3RyaW5nKCkpO1xuICB9XG4gIGlmIChFSlNPTi5faXNDdXN0b21UeXBlKGRvY3VtZW50KSkge1xuICAgIHJldHVybiByZXBsYWNlTmFtZXMobWFrZU1vbmdvTGVnYWwsIEVKU09OLnRvSlNPTlZhbHVlKGRvY3VtZW50KSk7XG4gIH1cbiAgLy8gSXQgaXMgbm90IG9yZGluYXJpbHkgcG9zc2libGUgdG8gc3RpY2sgZG9sbGFyLXNpZ24ga2V5cyBpbnRvIG1vbmdvXG4gIC8vIHNvIHdlIGRvbid0IGJvdGhlciBjaGVja2luZyBmb3IgdGhpbmdzIHRoYXQgbmVlZCBlc2NhcGluZyBhdCB0aGlzIHRpbWUuXG4gIHJldHVybiB1bmRlZmluZWQ7XG59O1xuXG52YXIgcmVwbGFjZVR5cGVzID0gZnVuY3Rpb24gKGRvY3VtZW50LCBhdG9tVHJhbnNmb3JtZXIpIHtcbiAgaWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gJ29iamVjdCcgfHwgZG9jdW1lbnQgPT09IG51bGwpXG4gICAgcmV0dXJuIGRvY3VtZW50O1xuXG4gIHZhciByZXBsYWNlZFRvcExldmVsQXRvbSA9IGF0b21UcmFuc2Zvcm1lcihkb2N1bWVudCk7XG4gIGlmIChyZXBsYWNlZFRvcExldmVsQXRvbSAhPT0gdW5kZWZpbmVkKVxuICAgIHJldHVybiByZXBsYWNlZFRvcExldmVsQXRvbTtcblxuICB2YXIgcmV0ID0gZG9jdW1lbnQ7XG4gIF8uZWFjaChkb2N1bWVudCwgZnVuY3Rpb24gKHZhbCwga2V5KSB7XG4gICAgdmFyIHZhbFJlcGxhY2VkID0gcmVwbGFjZVR5cGVzKHZhbCwgYXRvbVRyYW5zZm9ybWVyKTtcbiAgICBpZiAodmFsICE9PSB2YWxSZXBsYWNlZCkge1xuICAgICAgLy8gTGF6eSBjbG9uZS4gU2hhbGxvdyBjb3B5LlxuICAgICAgaWYgKHJldCA9PT0gZG9jdW1lbnQpXG4gICAgICAgIHJldCA9IF8uY2xvbmUoZG9jdW1lbnQpO1xuICAgICAgcmV0W2tleV0gPSB2YWxSZXBsYWNlZDtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gcmV0O1xufTtcblxuXG5Nb25nb0Nvbm5lY3Rpb24gPSBmdW5jdGlvbiAodXJsLCBvcHRpb25zKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIHNlbGYuX29ic2VydmVNdWx0aXBsZXhlcnMgPSB7fTtcbiAgc2VsZi5fb25GYWlsb3Zlckhvb2sgPSBuZXcgSG9vaztcblxuICB2YXIgbW9uZ29PcHRpb25zID0gT2JqZWN0LmFzc2lnbih7XG4gICAgLy8gUmVjb25uZWN0IG9uIGVycm9yLlxuICAgIGF1dG9SZWNvbm5lY3Q6IHRydWUsXG4gICAgLy8gVHJ5IHRvIHJlY29ubmVjdCBmb3JldmVyLCBpbnN0ZWFkIG9mIHN0b3BwaW5nIGFmdGVyIDMwIHRyaWVzICh0aGVcbiAgICAvLyBkZWZhdWx0KSwgd2l0aCBlYWNoIGF0dGVtcHQgc2VwYXJhdGVkIGJ5IDEwMDBtcy5cbiAgICByZWNvbm5lY3RUcmllczogSW5maW5pdHksXG4gICAgaWdub3JlVW5kZWZpbmVkOiB0cnVlLFxuICAgIC8vIFJlcXVpcmVkIHRvIHNpbGVuY2UgZGVwcmVjYXRpb24gd2FybmluZ3Mgd2l0aCBtb25nb2RiQDMuMS4xLlxuICAgIHVzZU5ld1VybFBhcnNlcjogdHJ1ZSxcbiAgfSwgTW9uZ28uX2Nvbm5lY3Rpb25PcHRpb25zKTtcblxuICAvLyBEaXNhYmxlIHRoZSBuYXRpdmUgcGFyc2VyIGJ5IGRlZmF1bHQsIHVubGVzcyBzcGVjaWZpY2FsbHkgZW5hYmxlZFxuICAvLyBpbiB0aGUgbW9uZ28gVVJMLlxuICAvLyAtIFRoZSBuYXRpdmUgZHJpdmVyIGNhbiBjYXVzZSBlcnJvcnMgd2hpY2ggbm9ybWFsbHkgd291bGQgYmVcbiAgLy8gICB0aHJvd24sIGNhdWdodCwgYW5kIGhhbmRsZWQgaW50byBzZWdmYXVsdHMgdGhhdCB0YWtlIGRvd24gdGhlXG4gIC8vICAgd2hvbGUgYXBwLlxuICAvLyAtIEJpbmFyeSBtb2R1bGVzIGRvbid0IHlldCB3b3JrIHdoZW4geW91IGJ1bmRsZSBhbmQgbW92ZSB0aGUgYnVuZGxlXG4gIC8vICAgdG8gYSBkaWZmZXJlbnQgcGxhdGZvcm0gKGFrYSBkZXBsb3kpXG4gIC8vIFdlIHNob3VsZCByZXZpc2l0IHRoaXMgYWZ0ZXIgYmluYXJ5IG5wbSBtb2R1bGUgc3VwcG9ydCBsYW5kcy5cbiAgaWYgKCEoL1tcXD8mXW5hdGl2ZV8/W3BQXWFyc2VyPS8udGVzdCh1cmwpKSkge1xuICAgIG1vbmdvT3B0aW9ucy5uYXRpdmVfcGFyc2VyID0gZmFsc2U7XG4gIH1cblxuICAvLyBJbnRlcm5hbGx5IHRoZSBvcGxvZyBjb25uZWN0aW9ucyBzcGVjaWZ5IHRoZWlyIG93biBwb29sU2l6ZVxuICAvLyB3aGljaCB3ZSBkb24ndCB3YW50IHRvIG92ZXJ3cml0ZSB3aXRoIGFueSB1c2VyIGRlZmluZWQgdmFsdWVcbiAgaWYgKF8uaGFzKG9wdGlvbnMsICdwb29sU2l6ZScpKSB7XG4gICAgLy8gSWYgd2UganVzdCBzZXQgdGhpcyBmb3IgXCJzZXJ2ZXJcIiwgcmVwbFNldCB3aWxsIG92ZXJyaWRlIGl0LiBJZiB3ZSBqdXN0XG4gICAgLy8gc2V0IGl0IGZvciByZXBsU2V0LCBpdCB3aWxsIGJlIGlnbm9yZWQgaWYgd2UncmUgbm90IHVzaW5nIGEgcmVwbFNldC5cbiAgICBtb25nb09wdGlvbnMucG9vbFNpemUgPSBvcHRpb25zLnBvb2xTaXplO1xuICB9XG5cbiAgc2VsZi5kYiA9IG51bGw7XG4gIC8vIFdlIGtlZXAgdHJhY2sgb2YgdGhlIFJlcGxTZXQncyBwcmltYXJ5LCBzbyB0aGF0IHdlIGNhbiB0cmlnZ2VyIGhvb2tzIHdoZW5cbiAgLy8gaXQgY2hhbmdlcy4gIFRoZSBOb2RlIGRyaXZlcidzIGpvaW5lZCBjYWxsYmFjayBzZWVtcyB0byBmaXJlIHdheSB0b29cbiAgLy8gb2Z0ZW4sIHdoaWNoIGlzIHdoeSB3ZSBuZWVkIHRvIHRyYWNrIGl0IG91cnNlbHZlcy5cbiAgc2VsZi5fcHJpbWFyeSA9IG51bGw7XG4gIHNlbGYuX29wbG9nSGFuZGxlID0gbnVsbDtcbiAgc2VsZi5fZG9jRmV0Y2hlciA9IG51bGw7XG5cblxuICB2YXIgY29ubmVjdEZ1dHVyZSA9IG5ldyBGdXR1cmU7XG4gIE1vbmdvREIuY29ubmVjdChcbiAgICB1cmwsXG4gICAgbW9uZ29PcHRpb25zLFxuICAgIE1ldGVvci5iaW5kRW52aXJvbm1lbnQoXG4gICAgICBmdW5jdGlvbiAoZXJyLCBjbGllbnQpIHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBkYiA9IGNsaWVudC5kYigpO1xuXG4gICAgICAgIC8vIEZpcnN0LCBmaWd1cmUgb3V0IHdoYXQgdGhlIGN1cnJlbnQgcHJpbWFyeSBpcywgaWYgYW55LlxuICAgICAgICBpZiAoZGIuc2VydmVyQ29uZmlnLmlzTWFzdGVyRG9jKSB7XG4gICAgICAgICAgc2VsZi5fcHJpbWFyeSA9IGRiLnNlcnZlckNvbmZpZy5pc01hc3RlckRvYy5wcmltYXJ5O1xuICAgICAgICB9XG5cbiAgICAgICAgZGIuc2VydmVyQ29uZmlnLm9uKFxuICAgICAgICAgICdqb2luZWQnLCBNZXRlb3IuYmluZEVudmlyb25tZW50KGZ1bmN0aW9uIChraW5kLCBkb2MpIHtcbiAgICAgICAgICAgIGlmIChraW5kID09PSAncHJpbWFyeScpIHtcbiAgICAgICAgICAgICAgaWYgKGRvYy5wcmltYXJ5ICE9PSBzZWxmLl9wcmltYXJ5KSB7XG4gICAgICAgICAgICAgICAgc2VsZi5fcHJpbWFyeSA9IGRvYy5wcmltYXJ5O1xuICAgICAgICAgICAgICAgIHNlbGYuX29uRmFpbG92ZXJIb29rLmVhY2goZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZG9jLm1lID09PSBzZWxmLl9wcmltYXJ5KSB7XG4gICAgICAgICAgICAgIC8vIFRoZSB0aGluZyB3ZSB0aG91Z2h0IHdhcyBwcmltYXJ5IGlzIG5vdyBzb21ldGhpbmcgb3RoZXIgdGhhblxuICAgICAgICAgICAgICAvLyBwcmltYXJ5LiAgRm9yZ2V0IHRoYXQgd2UgdGhvdWdodCBpdCB3YXMgcHJpbWFyeS4gIChUaGlzIG1lYW5zXG4gICAgICAgICAgICAgIC8vIHRoYXQgaWYgYSBzZXJ2ZXIgc3RvcHMgYmVpbmcgcHJpbWFyeSBhbmQgdGhlbiBzdGFydHMgYmVpbmdcbiAgICAgICAgICAgICAgLy8gcHJpbWFyeSBhZ2FpbiB3aXRob3V0IGFub3RoZXIgc2VydmVyIGJlY29taW5nIHByaW1hcnkgaW4gdGhlXG4gICAgICAgICAgICAgIC8vIG1pZGRsZSwgd2UnbGwgY29ycmVjdGx5IGNvdW50IGl0IGFzIGEgZmFpbG92ZXIuKVxuICAgICAgICAgICAgICBzZWxmLl9wcmltYXJ5ID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KSk7XG5cbiAgICAgICAgLy8gQWxsb3cgdGhlIGNvbnN0cnVjdG9yIHRvIHJldHVybi5cbiAgICAgICAgY29ubmVjdEZ1dHVyZVsncmV0dXJuJ10oeyBjbGllbnQsIGRiIH0pO1xuICAgICAgfSxcbiAgICAgIGNvbm5lY3RGdXR1cmUucmVzb2x2ZXIoKSAgLy8gb25FeGNlcHRpb25cbiAgICApXG4gICk7XG5cbiAgLy8gV2FpdCBmb3IgdGhlIGNvbm5lY3Rpb24gdG8gYmUgc3VjY2Vzc2Z1bCAodGhyb3dzIG9uIGZhaWx1cmUpIGFuZCBhc3NpZ24gdGhlXG4gIC8vIHJlc3VsdHMgKGBjbGllbnRgIGFuZCBgZGJgKSB0byBgc2VsZmAuXG4gIE9iamVjdC5hc3NpZ24oc2VsZiwgY29ubmVjdEZ1dHVyZS53YWl0KCkpO1xuXG4gIGlmIChvcHRpb25zLm9wbG9nVXJsICYmICEgUGFja2FnZVsnZGlzYWJsZS1vcGxvZyddKSB7XG4gICAgc2VsZi5fb3Bsb2dIYW5kbGUgPSBuZXcgT3Bsb2dIYW5kbGUob3B0aW9ucy5vcGxvZ1VybCwgc2VsZi5kYi5kYXRhYmFzZU5hbWUpO1xuICAgIHNlbGYuX2RvY0ZldGNoZXIgPSBuZXcgRG9jRmV0Y2hlcihzZWxmKTtcbiAgfVxufTtcblxuTW9uZ29Db25uZWN0aW9uLnByb3RvdHlwZS5jbG9zZSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgaWYgKCEgc2VsZi5kYilcbiAgICB0aHJvdyBFcnJvcihcImNsb3NlIGNhbGxlZCBiZWZvcmUgQ29ubmVjdGlvbiBjcmVhdGVkP1wiKTtcblxuICAvLyBYWFggcHJvYmFibHkgdW50ZXN0ZWRcbiAgdmFyIG9wbG9nSGFuZGxlID0gc2VsZi5fb3Bsb2dIYW5kbGU7XG4gIHNlbGYuX29wbG9nSGFuZGxlID0gbnVsbDtcbiAgaWYgKG9wbG9nSGFuZGxlKVxuICAgIG9wbG9nSGFuZGxlLnN0b3AoKTtcblxuICAvLyBVc2UgRnV0dXJlLndyYXAgc28gdGhhdCBlcnJvcnMgZ2V0IHRocm93bi4gVGhpcyBoYXBwZW5zIHRvXG4gIC8vIHdvcmsgZXZlbiBvdXRzaWRlIGEgZmliZXIgc2luY2UgdGhlICdjbG9zZScgbWV0aG9kIGlzIG5vdFxuICAvLyBhY3R1YWxseSBhc3luY2hyb25vdXMuXG4gIEZ1dHVyZS53cmFwKF8uYmluZChzZWxmLmNsaWVudC5jbG9zZSwgc2VsZi5jbGllbnQpKSh0cnVlKS53YWl0KCk7XG59O1xuXG4vLyBSZXR1cm5zIHRoZSBNb25nbyBDb2xsZWN0aW9uIG9iamVjdDsgbWF5IHlpZWxkLlxuTW9uZ29Db25uZWN0aW9uLnByb3RvdHlwZS5yYXdDb2xsZWN0aW9uID0gZnVuY3Rpb24gKGNvbGxlY3Rpb25OYW1lKSB7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICBpZiAoISBzZWxmLmRiKVxuICAgIHRocm93IEVycm9yKFwicmF3Q29sbGVjdGlvbiBjYWxsZWQgYmVmb3JlIENvbm5lY3Rpb24gY3JlYXRlZD9cIik7XG5cbiAgdmFyIGZ1dHVyZSA9IG5ldyBGdXR1cmU7XG4gIHNlbGYuZGIuY29sbGVjdGlvbihjb2xsZWN0aW9uTmFtZSwgZnV0dXJlLnJlc29sdmVyKCkpO1xuICByZXR1cm4gZnV0dXJlLndhaXQoKTtcbn07XG5cbk1vbmdvQ29ubmVjdGlvbi5wcm90b3R5cGUuX2NyZWF0ZUNhcHBlZENvbGxlY3Rpb24gPSBmdW5jdGlvbiAoXG4gICAgY29sbGVjdGlvbk5hbWUsIGJ5dGVTaXplLCBtYXhEb2N1bWVudHMpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIGlmICghIHNlbGYuZGIpXG4gICAgdGhyb3cgRXJyb3IoXCJfY3JlYXRlQ2FwcGVkQ29sbGVjdGlvbiBjYWxsZWQgYmVmb3JlIENvbm5lY3Rpb24gY3JlYXRlZD9cIik7XG5cbiAgdmFyIGZ1dHVyZSA9IG5ldyBGdXR1cmUoKTtcbiAgc2VsZi5kYi5jcmVhdGVDb2xsZWN0aW9uKFxuICAgIGNvbGxlY3Rpb25OYW1lLFxuICAgIHsgY2FwcGVkOiB0cnVlLCBzaXplOiBieXRlU2l6ZSwgbWF4OiBtYXhEb2N1bWVudHMgfSxcbiAgICBmdXR1cmUucmVzb2x2ZXIoKSk7XG4gIGZ1dHVyZS53YWl0KCk7XG59O1xuXG4vLyBUaGlzIHNob3VsZCBiZSBjYWxsZWQgc3luY2hyb25vdXNseSB3aXRoIGEgd3JpdGUsIHRvIGNyZWF0ZSBhXG4vLyB0cmFuc2FjdGlvbiBvbiB0aGUgY3VycmVudCB3cml0ZSBmZW5jZSwgaWYgYW55LiBBZnRlciB3ZSBjYW4gcmVhZFxuLy8gdGhlIHdyaXRlLCBhbmQgYWZ0ZXIgb2JzZXJ2ZXJzIGhhdmUgYmVlbiBub3RpZmllZCAob3IgYXQgbGVhc3QsXG4vLyBhZnRlciB0aGUgb2JzZXJ2ZXIgbm90aWZpZXJzIGhhdmUgYWRkZWQgdGhlbXNlbHZlcyB0byB0aGUgd3JpdGVcbi8vIGZlbmNlKSwgeW91IHNob3VsZCBjYWxsICdjb21taXR0ZWQoKScgb24gdGhlIG9iamVjdCByZXR1cm5lZC5cbk1vbmdvQ29ubmVjdGlvbi5wcm90b3R5cGUuX21heWJlQmVnaW5Xcml0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGZlbmNlID0gRERQU2VydmVyLl9DdXJyZW50V3JpdGVGZW5jZS5nZXQoKTtcbiAgaWYgKGZlbmNlKSB7XG4gICAgcmV0dXJuIGZlbmNlLmJlZ2luV3JpdGUoKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4ge2NvbW1pdHRlZDogZnVuY3Rpb24gKCkge319O1xuICB9XG59O1xuXG4vLyBJbnRlcm5hbCBpbnRlcmZhY2U6IGFkZHMgYSBjYWxsYmFjayB3aGljaCBpcyBjYWxsZWQgd2hlbiB0aGUgTW9uZ28gcHJpbWFyeVxuLy8gY2hhbmdlcy4gUmV0dXJucyBhIHN0b3AgaGFuZGxlLlxuTW9uZ29Db25uZWN0aW9uLnByb3RvdHlwZS5fb25GYWlsb3ZlciA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICByZXR1cm4gdGhpcy5fb25GYWlsb3Zlckhvb2sucmVnaXN0ZXIoY2FsbGJhY2spO1xufTtcblxuXG4vLy8vLy8vLy8vLy8gUHVibGljIEFQSSAvLy8vLy8vLy8vXG5cbi8vIFRoZSB3cml0ZSBtZXRob2RzIGJsb2NrIHVudGlsIHRoZSBkYXRhYmFzZSBoYXMgY29uZmlybWVkIHRoZSB3cml0ZSAoaXQgbWF5XG4vLyBub3QgYmUgcmVwbGljYXRlZCBvciBzdGFibGUgb24gZGlzaywgYnV0IG9uZSBzZXJ2ZXIgaGFzIGNvbmZpcm1lZCBpdCkgaWYgbm9cbi8vIGNhbGxiYWNrIGlzIHByb3ZpZGVkLiBJZiBhIGNhbGxiYWNrIGlzIHByb3ZpZGVkLCB0aGVuIHRoZXkgY2FsbCB0aGUgY2FsbGJhY2tcbi8vIHdoZW4gdGhlIHdyaXRlIGlzIGNvbmZpcm1lZC4gVGhleSByZXR1cm4gbm90aGluZyBvbiBzdWNjZXNzLCBhbmQgcmFpc2UgYW5cbi8vIGV4Y2VwdGlvbiBvbiBmYWlsdXJlLlxuLy9cbi8vIEFmdGVyIG1ha2luZyBhIHdyaXRlICh3aXRoIGluc2VydCwgdXBkYXRlLCByZW1vdmUpLCBvYnNlcnZlcnMgYXJlXG4vLyBub3RpZmllZCBhc3luY2hyb25vdXNseS4gSWYgeW91IHdhbnQgdG8gcmVjZWl2ZSBhIGNhbGxiYWNrIG9uY2UgYWxsXG4vLyBvZiB0aGUgb2JzZXJ2ZXIgbm90aWZpY2F0aW9ucyBoYXZlIGxhbmRlZCBmb3IgeW91ciB3cml0ZSwgZG8gdGhlXG4vLyB3cml0ZXMgaW5zaWRlIGEgd3JpdGUgZmVuY2UgKHNldCBERFBTZXJ2ZXIuX0N1cnJlbnRXcml0ZUZlbmNlIHRvIGEgbmV3XG4vLyBfV3JpdGVGZW5jZSwgYW5kIHRoZW4gc2V0IGEgY2FsbGJhY2sgb24gdGhlIHdyaXRlIGZlbmNlLilcbi8vXG4vLyBTaW5jZSBvdXIgZXhlY3V0aW9uIGVudmlyb25tZW50IGlzIHNpbmdsZS10aHJlYWRlZCwgdGhpcyBpc1xuLy8gd2VsbC1kZWZpbmVkIC0tIGEgd3JpdGUgXCJoYXMgYmVlbiBtYWRlXCIgaWYgaXQncyByZXR1cm5lZCwgYW5kIGFuXG4vLyBvYnNlcnZlciBcImhhcyBiZWVuIG5vdGlmaWVkXCIgaWYgaXRzIGNhbGxiYWNrIGhhcyByZXR1cm5lZC5cblxudmFyIHdyaXRlQ2FsbGJhY2sgPSBmdW5jdGlvbiAod3JpdGUsIHJlZnJlc2gsIGNhbGxiYWNrKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoZXJyLCByZXN1bHQpIHtcbiAgICBpZiAoISBlcnIpIHtcbiAgICAgIC8vIFhYWCBXZSBkb24ndCBoYXZlIHRvIHJ1biB0aGlzIG9uIGVycm9yLCByaWdodD9cbiAgICAgIHRyeSB7XG4gICAgICAgIHJlZnJlc2goKTtcbiAgICAgIH0gY2F0Y2ggKHJlZnJlc2hFcnIpIHtcbiAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgY2FsbGJhY2socmVmcmVzaEVycik7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IHJlZnJlc2hFcnI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgd3JpdGUuY29tbWl0dGVkKCk7XG4gICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICBjYWxsYmFjayhlcnIsIHJlc3VsdCk7XG4gICAgfSBlbHNlIGlmIChlcnIpIHtcbiAgICAgIHRocm93IGVycjtcbiAgICB9XG4gIH07XG59O1xuXG52YXIgYmluZEVudmlyb25tZW50Rm9yV3JpdGUgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgcmV0dXJuIE1ldGVvci5iaW5kRW52aXJvbm1lbnQoY2FsbGJhY2ssIFwiTW9uZ28gd3JpdGVcIik7XG59O1xuXG5Nb25nb0Nvbm5lY3Rpb24ucHJvdG90eXBlLl9pbnNlcnQgPSBmdW5jdGlvbiAoY29sbGVjdGlvbl9uYW1lLCBkb2N1bWVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjaykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgdmFyIHNlbmRFcnJvciA9IGZ1bmN0aW9uIChlKSB7XG4gICAgaWYgKGNhbGxiYWNrKVxuICAgICAgcmV0dXJuIGNhbGxiYWNrKGUpO1xuICAgIHRocm93IGU7XG4gIH07XG5cbiAgaWYgKGNvbGxlY3Rpb25fbmFtZSA9PT0gXCJfX19tZXRlb3JfZmFpbHVyZV90ZXN0X2NvbGxlY3Rpb25cIikge1xuICAgIHZhciBlID0gbmV3IEVycm9yKFwiRmFpbHVyZSB0ZXN0XCIpO1xuICAgIGUuX2V4cGVjdGVkQnlUZXN0ID0gdHJ1ZTtcbiAgICBzZW5kRXJyb3IoZSk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKCEoTG9jYWxDb2xsZWN0aW9uLl9pc1BsYWluT2JqZWN0KGRvY3VtZW50KSAmJlxuICAgICAgICAhRUpTT04uX2lzQ3VzdG9tVHlwZShkb2N1bWVudCkpKSB7XG4gICAgc2VuZEVycm9yKG5ldyBFcnJvcihcbiAgICAgIFwiT25seSBwbGFpbiBvYmplY3RzIG1heSBiZSBpbnNlcnRlZCBpbnRvIE1vbmdvREJcIikpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciB3cml0ZSA9IHNlbGYuX21heWJlQmVnaW5Xcml0ZSgpO1xuICB2YXIgcmVmcmVzaCA9IGZ1bmN0aW9uICgpIHtcbiAgICBNZXRlb3IucmVmcmVzaCh7Y29sbGVjdGlvbjogY29sbGVjdGlvbl9uYW1lLCBpZDogZG9jdW1lbnQuX2lkIH0pO1xuICB9O1xuICBjYWxsYmFjayA9IGJpbmRFbnZpcm9ubWVudEZvcldyaXRlKHdyaXRlQ2FsbGJhY2sod3JpdGUsIHJlZnJlc2gsIGNhbGxiYWNrKSk7XG4gIHRyeSB7XG4gICAgdmFyIGNvbGxlY3Rpb24gPSBzZWxmLnJhd0NvbGxlY3Rpb24oY29sbGVjdGlvbl9uYW1lKTtcbiAgICBjb2xsZWN0aW9uLmluc2VydChyZXBsYWNlVHlwZXMoZG9jdW1lbnQsIHJlcGxhY2VNZXRlb3JBdG9tV2l0aE1vbmdvKSxcbiAgICAgICAgICAgICAgICAgICAgICB7c2FmZTogdHJ1ZX0sIGNhbGxiYWNrKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgd3JpdGUuY29tbWl0dGVkKCk7XG4gICAgdGhyb3cgZXJyO1xuICB9XG59O1xuXG4vLyBDYXVzZSBxdWVyaWVzIHRoYXQgbWF5IGJlIGFmZmVjdGVkIGJ5IHRoZSBzZWxlY3RvciB0byBwb2xsIGluIHRoaXMgd3JpdGVcbi8vIGZlbmNlLlxuTW9uZ29Db25uZWN0aW9uLnByb3RvdHlwZS5fcmVmcmVzaCA9IGZ1bmN0aW9uIChjb2xsZWN0aW9uTmFtZSwgc2VsZWN0b3IpIHtcbiAgdmFyIHJlZnJlc2hLZXkgPSB7Y29sbGVjdGlvbjogY29sbGVjdGlvbk5hbWV9O1xuICAvLyBJZiB3ZSBrbm93IHdoaWNoIGRvY3VtZW50cyB3ZSdyZSByZW1vdmluZywgZG9uJ3QgcG9sbCBxdWVyaWVzIHRoYXQgYXJlXG4gIC8vIHNwZWNpZmljIHRvIG90aGVyIGRvY3VtZW50cy4gKE5vdGUgdGhhdCBtdWx0aXBsZSBub3RpZmljYXRpb25zIGhlcmUgc2hvdWxkXG4gIC8vIG5vdCBjYXVzZSBtdWx0aXBsZSBwb2xscywgc2luY2UgYWxsIG91ciBsaXN0ZW5lciBpcyBkb2luZyBpcyBlbnF1ZXVlaW5nIGFcbiAgLy8gcG9sbC4pXG4gIHZhciBzcGVjaWZpY0lkcyA9IExvY2FsQ29sbGVjdGlvbi5faWRzTWF0Y2hlZEJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuICBpZiAoc3BlY2lmaWNJZHMpIHtcbiAgICBfLmVhY2goc3BlY2lmaWNJZHMsIGZ1bmN0aW9uIChpZCkge1xuICAgICAgTWV0ZW9yLnJlZnJlc2goXy5leHRlbmQoe2lkOiBpZH0sIHJlZnJlc2hLZXkpKTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBNZXRlb3IucmVmcmVzaChyZWZyZXNoS2V5KTtcbiAgfVxufTtcblxuTW9uZ29Db25uZWN0aW9uLnByb3RvdHlwZS5fcmVtb3ZlID0gZnVuY3Rpb24gKGNvbGxlY3Rpb25fbmFtZSwgc2VsZWN0b3IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2spIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIGlmIChjb2xsZWN0aW9uX25hbWUgPT09IFwiX19fbWV0ZW9yX2ZhaWx1cmVfdGVzdF9jb2xsZWN0aW9uXCIpIHtcbiAgICB2YXIgZSA9IG5ldyBFcnJvcihcIkZhaWx1cmUgdGVzdFwiKTtcbiAgICBlLl9leHBlY3RlZEJ5VGVzdCA9IHRydWU7XG4gICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICByZXR1cm4gY2FsbGJhY2soZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IGU7XG4gICAgfVxuICB9XG5cbiAgdmFyIHdyaXRlID0gc2VsZi5fbWF5YmVCZWdpbldyaXRlKCk7XG4gIHZhciByZWZyZXNoID0gZnVuY3Rpb24gKCkge1xuICAgIHNlbGYuX3JlZnJlc2goY29sbGVjdGlvbl9uYW1lLCBzZWxlY3Rvcik7XG4gIH07XG4gIGNhbGxiYWNrID0gYmluZEVudmlyb25tZW50Rm9yV3JpdGUod3JpdGVDYWxsYmFjayh3cml0ZSwgcmVmcmVzaCwgY2FsbGJhY2spKTtcblxuICB0cnkge1xuICAgIHZhciBjb2xsZWN0aW9uID0gc2VsZi5yYXdDb2xsZWN0aW9uKGNvbGxlY3Rpb25fbmFtZSk7XG4gICAgdmFyIHdyYXBwZWRDYWxsYmFjayA9IGZ1bmN0aW9uKGVyciwgZHJpdmVyUmVzdWx0KSB7XG4gICAgICBjYWxsYmFjayhlcnIsIHRyYW5zZm9ybVJlc3VsdChkcml2ZXJSZXN1bHQpLm51bWJlckFmZmVjdGVkKTtcbiAgICB9O1xuICAgIGNvbGxlY3Rpb24ucmVtb3ZlKHJlcGxhY2VUeXBlcyhzZWxlY3RvciwgcmVwbGFjZU1ldGVvckF0b21XaXRoTW9uZ28pLFxuICAgICAgICAgICAgICAgICAgICAgICB7c2FmZTogdHJ1ZX0sIHdyYXBwZWRDYWxsYmFjayk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHdyaXRlLmNvbW1pdHRlZCgpO1xuICAgIHRocm93IGVycjtcbiAgfVxufTtcblxuTW9uZ29Db25uZWN0aW9uLnByb3RvdHlwZS5fZHJvcENvbGxlY3Rpb24gPSBmdW5jdGlvbiAoY29sbGVjdGlvbk5hbWUsIGNiKSB7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICB2YXIgd3JpdGUgPSBzZWxmLl9tYXliZUJlZ2luV3JpdGUoKTtcbiAgdmFyIHJlZnJlc2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgTWV0ZW9yLnJlZnJlc2goe2NvbGxlY3Rpb246IGNvbGxlY3Rpb25OYW1lLCBpZDogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgZHJvcENvbGxlY3Rpb246IHRydWV9KTtcbiAgfTtcbiAgY2IgPSBiaW5kRW52aXJvbm1lbnRGb3JXcml0ZSh3cml0ZUNhbGxiYWNrKHdyaXRlLCByZWZyZXNoLCBjYikpO1xuXG4gIHRyeSB7XG4gICAgdmFyIGNvbGxlY3Rpb24gPSBzZWxmLnJhd0NvbGxlY3Rpb24oY29sbGVjdGlvbk5hbWUpO1xuICAgIGNvbGxlY3Rpb24uZHJvcChjYik7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICB3cml0ZS5jb21taXR0ZWQoKTtcbiAgICB0aHJvdyBlO1xuICB9XG59O1xuXG4vLyBGb3IgdGVzdGluZyBvbmx5LiAgU2xpZ2h0bHkgYmV0dGVyIHRoYW4gYGMucmF3RGF0YWJhc2UoKS5kcm9wRGF0YWJhc2UoKWBcbi8vIGJlY2F1c2UgaXQgbGV0cyB0aGUgdGVzdCdzIGZlbmNlIHdhaXQgZm9yIGl0IHRvIGJlIGNvbXBsZXRlLlxuTW9uZ29Db25uZWN0aW9uLnByb3RvdHlwZS5fZHJvcERhdGFiYXNlID0gZnVuY3Rpb24gKGNiKSB7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICB2YXIgd3JpdGUgPSBzZWxmLl9tYXliZUJlZ2luV3JpdGUoKTtcbiAgdmFyIHJlZnJlc2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgTWV0ZW9yLnJlZnJlc2goeyBkcm9wRGF0YWJhc2U6IHRydWUgfSk7XG4gIH07XG4gIGNiID0gYmluZEVudmlyb25tZW50Rm9yV3JpdGUod3JpdGVDYWxsYmFjayh3cml0ZSwgcmVmcmVzaCwgY2IpKTtcblxuICB0cnkge1xuICAgIHNlbGYuZGIuZHJvcERhdGFiYXNlKGNiKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHdyaXRlLmNvbW1pdHRlZCgpO1xuICAgIHRocm93IGU7XG4gIH1cbn07XG5cbk1vbmdvQ29ubmVjdGlvbi5wcm90b3R5cGUuX3VwZGF0ZSA9IGZ1bmN0aW9uIChjb2xsZWN0aW9uX25hbWUsIHNlbGVjdG9yLCBtb2QsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucywgY2FsbGJhY2spIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIGlmICghIGNhbGxiYWNrICYmIG9wdGlvbnMgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuICAgIGNhbGxiYWNrID0gb3B0aW9ucztcbiAgICBvcHRpb25zID0gbnVsbDtcbiAgfVxuXG4gIGlmIChjb2xsZWN0aW9uX25hbWUgPT09IFwiX19fbWV0ZW9yX2ZhaWx1cmVfdGVzdF9jb2xsZWN0aW9uXCIpIHtcbiAgICB2YXIgZSA9IG5ldyBFcnJvcihcIkZhaWx1cmUgdGVzdFwiKTtcbiAgICBlLl9leHBlY3RlZEJ5VGVzdCA9IHRydWU7XG4gICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICByZXR1cm4gY2FsbGJhY2soZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IGU7XG4gICAgfVxuICB9XG5cbiAgLy8gZXhwbGljaXQgc2FmZXR5IGNoZWNrLiBudWxsIGFuZCB1bmRlZmluZWQgY2FuIGNyYXNoIHRoZSBtb25nb1xuICAvLyBkcml2ZXIuIEFsdGhvdWdoIHRoZSBub2RlIGRyaXZlciBhbmQgbWluaW1vbmdvIGRvICdzdXBwb3J0J1xuICAvLyBub24tb2JqZWN0IG1vZGlmaWVyIGluIHRoYXQgdGhleSBkb24ndCBjcmFzaCwgdGhleSBhcmUgbm90XG4gIC8vIG1lYW5pbmdmdWwgb3BlcmF0aW9ucyBhbmQgZG8gbm90IGRvIGFueXRoaW5nLiBEZWZlbnNpdmVseSB0aHJvdyBhblxuICAvLyBlcnJvciBoZXJlLlxuICBpZiAoIW1vZCB8fCB0eXBlb2YgbW9kICE9PSAnb2JqZWN0JylcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIG1vZGlmaWVyLiBNb2RpZmllciBtdXN0IGJlIGFuIG9iamVjdC5cIik7XG5cbiAgaWYgKCEoTG9jYWxDb2xsZWN0aW9uLl9pc1BsYWluT2JqZWN0KG1vZCkgJiZcbiAgICAgICAgIUVKU09OLl9pc0N1c3RvbVR5cGUobW9kKSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBcIk9ubHkgcGxhaW4gb2JqZWN0cyBtYXkgYmUgdXNlZCBhcyByZXBsYWNlbWVudFwiICtcbiAgICAgICAgXCIgZG9jdW1lbnRzIGluIE1vbmdvREJcIik7XG4gIH1cblxuICBpZiAoIW9wdGlvbnMpIG9wdGlvbnMgPSB7fTtcblxuICB2YXIgd3JpdGUgPSBzZWxmLl9tYXliZUJlZ2luV3JpdGUoKTtcbiAgdmFyIHJlZnJlc2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgc2VsZi5fcmVmcmVzaChjb2xsZWN0aW9uX25hbWUsIHNlbGVjdG9yKTtcbiAgfTtcbiAgY2FsbGJhY2sgPSB3cml0ZUNhbGxiYWNrKHdyaXRlLCByZWZyZXNoLCBjYWxsYmFjayk7XG4gIHRyeSB7XG4gICAgdmFyIGNvbGxlY3Rpb24gPSBzZWxmLnJhd0NvbGxlY3Rpb24oY29sbGVjdGlvbl9uYW1lKTtcbiAgICB2YXIgbW9uZ29PcHRzID0ge3NhZmU6IHRydWV9O1xuICAgIC8vIEFkZCBzdXBwb3J0IGZvciBmaWx0ZXJlZCBwb3NpdGlvbmFsIG9wZXJhdG9yXG4gICAgaWYgKG9wdGlvbnMuYXJyYXlGaWx0ZXJzICE9PSB1bmRlZmluZWQpIG1vbmdvT3B0cy5hcnJheUZpbHRlcnMgPSBvcHRpb25zLmFycmF5RmlsdGVycztcbiAgICAvLyBleHBsaWN0bHkgZW51bWVyYXRlIG9wdGlvbnMgdGhhdCBtaW5pbW9uZ28gc3VwcG9ydHNcbiAgICBpZiAob3B0aW9ucy51cHNlcnQpIG1vbmdvT3B0cy51cHNlcnQgPSB0cnVlO1xuICAgIGlmIChvcHRpb25zLm11bHRpKSBtb25nb09wdHMubXVsdGkgPSB0cnVlO1xuICAgIC8vIExldHMgeW91IGdldCBhIG1vcmUgbW9yZSBmdWxsIHJlc3VsdCBmcm9tIE1vbmdvREIuIFVzZSB3aXRoIGNhdXRpb246XG4gICAgLy8gbWlnaHQgbm90IHdvcmsgd2l0aCBDLnVwc2VydCAoYXMgb3Bwb3NlZCB0byBDLnVwZGF0ZSh7dXBzZXJ0OnRydWV9KSBvclxuICAgIC8vIHdpdGggc2ltdWxhdGVkIHVwc2VydC5cbiAgICBpZiAob3B0aW9ucy5mdWxsUmVzdWx0KSBtb25nb09wdHMuZnVsbFJlc3VsdCA9IHRydWU7XG5cbiAgICB2YXIgbW9uZ29TZWxlY3RvciA9IHJlcGxhY2VUeXBlcyhzZWxlY3RvciwgcmVwbGFjZU1ldGVvckF0b21XaXRoTW9uZ28pO1xuICAgIHZhciBtb25nb01vZCA9IHJlcGxhY2VUeXBlcyhtb2QsIHJlcGxhY2VNZXRlb3JBdG9tV2l0aE1vbmdvKTtcblxuICAgIHZhciBpc01vZGlmeSA9IExvY2FsQ29sbGVjdGlvbi5faXNNb2RpZmljYXRpb25Nb2QobW9uZ29Nb2QpO1xuXG4gICAgaWYgKG9wdGlvbnMuX2ZvcmJpZFJlcGxhY2UgJiYgIWlzTW9kaWZ5KSB7XG4gICAgICB2YXIgZXJyID0gbmV3IEVycm9yKFwiSW52YWxpZCBtb2RpZmllci4gUmVwbGFjZW1lbnRzIGFyZSBmb3JiaWRkZW4uXCIpO1xuICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFdlJ3ZlIGFscmVhZHkgcnVuIHJlcGxhY2VUeXBlcy9yZXBsYWNlTWV0ZW9yQXRvbVdpdGhNb25nbyBvblxuICAgIC8vIHNlbGVjdG9yIGFuZCBtb2QuICBXZSBhc3N1bWUgaXQgZG9lc24ndCBtYXR0ZXIsIGFzIGZhciBhc1xuICAgIC8vIHRoZSBiZWhhdmlvciBvZiBtb2RpZmllcnMgaXMgY29uY2VybmVkLCB3aGV0aGVyIGBfbW9kaWZ5YFxuICAgIC8vIGlzIHJ1biBvbiBFSlNPTiBvciBvbiBtb25nby1jb252ZXJ0ZWQgRUpTT04uXG5cbiAgICAvLyBSdW4gdGhpcyBjb2RlIHVwIGZyb250IHNvIHRoYXQgaXQgZmFpbHMgZmFzdCBpZiBzb21lb25lIHVzZXNcbiAgICAvLyBhIE1vbmdvIHVwZGF0ZSBvcGVyYXRvciB3ZSBkb24ndCBzdXBwb3J0LlxuICAgIGxldCBrbm93bklkO1xuICAgIGlmIChvcHRpb25zLnVwc2VydCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgbGV0IG5ld0RvYyA9IExvY2FsQ29sbGVjdGlvbi5fY3JlYXRlVXBzZXJ0RG9jdW1lbnQoc2VsZWN0b3IsIG1vZCk7XG4gICAgICAgIGtub3duSWQgPSBuZXdEb2MuX2lkO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChvcHRpb25zLnVwc2VydCAmJlxuICAgICAgICAhIGlzTW9kaWZ5ICYmXG4gICAgICAgICEga25vd25JZCAmJlxuICAgICAgICBvcHRpb25zLmluc2VydGVkSWQgJiZcbiAgICAgICAgISAob3B0aW9ucy5pbnNlcnRlZElkIGluc3RhbmNlb2YgTW9uZ28uT2JqZWN0SUQgJiZcbiAgICAgICAgICAgb3B0aW9ucy5nZW5lcmF0ZWRJZCkpIHtcbiAgICAgIC8vIEluIGNhc2Ugb2YgYW4gdXBzZXJ0IHdpdGggYSByZXBsYWNlbWVudCwgd2hlcmUgdGhlcmUgaXMgbm8gX2lkIGRlZmluZWRcbiAgICAgIC8vIGluIGVpdGhlciB0aGUgcXVlcnkgb3IgdGhlIHJlcGxhY2VtZW50IGRvYywgbW9uZ28gd2lsbCBnZW5lcmF0ZSBhbiBpZCBpdHNlbGYuXG4gICAgICAvLyBUaGVyZWZvcmUgd2UgbmVlZCB0aGlzIHNwZWNpYWwgc3RyYXRlZ3kgaWYgd2Ugd2FudCB0byBjb250cm9sIHRoZSBpZCBvdXJzZWx2ZXMuXG5cbiAgICAgIC8vIFdlIGRvbid0IG5lZWQgdG8gZG8gdGhpcyB3aGVuOlxuICAgICAgLy8gLSBUaGlzIGlzIG5vdCBhIHJlcGxhY2VtZW50LCBzbyB3ZSBjYW4gYWRkIGFuIF9pZCB0byAkc2V0T25JbnNlcnRcbiAgICAgIC8vIC0gVGhlIGlkIGlzIGRlZmluZWQgYnkgcXVlcnkgb3IgbW9kIHdlIGNhbiBqdXN0IGFkZCBpdCB0byB0aGUgcmVwbGFjZW1lbnQgZG9jXG4gICAgICAvLyAtIFRoZSB1c2VyIGRpZCBub3Qgc3BlY2lmeSBhbnkgaWQgcHJlZmVyZW5jZSBhbmQgdGhlIGlkIGlzIGEgTW9uZ28gT2JqZWN0SWQsXG4gICAgICAvLyAgICAgdGhlbiB3ZSBjYW4ganVzdCBsZXQgTW9uZ28gZ2VuZXJhdGUgdGhlIGlkXG5cbiAgICAgIHNpbXVsYXRlVXBzZXJ0V2l0aEluc2VydGVkSWQoXG4gICAgICAgIGNvbGxlY3Rpb24sIG1vbmdvU2VsZWN0b3IsIG1vbmdvTW9kLCBvcHRpb25zLFxuICAgICAgICAvLyBUaGlzIGNhbGxiYWNrIGRvZXMgbm90IG5lZWQgdG8gYmUgYmluZEVudmlyb25tZW50J2VkIGJlY2F1c2VcbiAgICAgICAgLy8gc2ltdWxhdGVVcHNlcnRXaXRoSW5zZXJ0ZWRJZCgpIHdyYXBzIGl0IGFuZCB0aGVuIHBhc3NlcyBpdCB0aHJvdWdoXG4gICAgICAgIC8vIGJpbmRFbnZpcm9ubWVudEZvcldyaXRlLlxuICAgICAgICBmdW5jdGlvbiAoZXJyb3IsIHJlc3VsdCkge1xuICAgICAgICAgIC8vIElmIHdlIGdvdCBoZXJlIHZpYSBhIHVwc2VydCgpIGNhbGwsIHRoZW4gb3B0aW9ucy5fcmV0dXJuT2JqZWN0IHdpbGxcbiAgICAgICAgICAvLyBiZSBzZXQgYW5kIHdlIHNob3VsZCByZXR1cm4gdGhlIHdob2xlIG9iamVjdC4gT3RoZXJ3aXNlLCB3ZSBzaG91bGRcbiAgICAgICAgICAvLyBqdXN0IHJldHVybiB0aGUgbnVtYmVyIG9mIGFmZmVjdGVkIGRvY3MgdG8gbWF0Y2ggdGhlIG1vbmdvIEFQSS5cbiAgICAgICAgICBpZiAocmVzdWx0ICYmICEgb3B0aW9ucy5fcmV0dXJuT2JqZWN0KSB7XG4gICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgcmVzdWx0Lm51bWJlckFmZmVjdGVkKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIHJlc3VsdCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICApO1xuICAgIH0gZWxzZSB7XG5cbiAgICAgIGlmIChvcHRpb25zLnVwc2VydCAmJiAha25vd25JZCAmJiBvcHRpb25zLmluc2VydGVkSWQgJiYgaXNNb2RpZnkpIHtcbiAgICAgICAgaWYgKCFtb25nb01vZC5oYXNPd25Qcm9wZXJ0eSgnJHNldE9uSW5zZXJ0JykpIHtcbiAgICAgICAgICBtb25nb01vZC4kc2V0T25JbnNlcnQgPSB7fTtcbiAgICAgICAgfVxuICAgICAgICBrbm93bklkID0gb3B0aW9ucy5pbnNlcnRlZElkO1xuICAgICAgICBPYmplY3QuYXNzaWduKG1vbmdvTW9kLiRzZXRPbkluc2VydCwgcmVwbGFjZVR5cGVzKHtfaWQ6IG9wdGlvbnMuaW5zZXJ0ZWRJZH0sIHJlcGxhY2VNZXRlb3JBdG9tV2l0aE1vbmdvKSk7XG4gICAgICB9XG5cbiAgICAgIGNvbGxlY3Rpb24udXBkYXRlKFxuICAgICAgICBtb25nb1NlbGVjdG9yLCBtb25nb01vZCwgbW9uZ29PcHRzLFxuICAgICAgICBiaW5kRW52aXJvbm1lbnRGb3JXcml0ZShmdW5jdGlvbiAoZXJyLCByZXN1bHQpIHtcbiAgICAgICAgICBpZiAoISBlcnIpIHtcbiAgICAgICAgICAgIHZhciBtZXRlb3JSZXN1bHQgPSB0cmFuc2Zvcm1SZXN1bHQocmVzdWx0KTtcbiAgICAgICAgICAgIGlmIChtZXRlb3JSZXN1bHQgJiYgb3B0aW9ucy5fcmV0dXJuT2JqZWN0KSB7XG4gICAgICAgICAgICAgIC8vIElmIHRoaXMgd2FzIGFuIHVwc2VydCgpIGNhbGwsIGFuZCB3ZSBlbmRlZCB1cFxuICAgICAgICAgICAgICAvLyBpbnNlcnRpbmcgYSBuZXcgZG9jIGFuZCB3ZSBrbm93IGl0cyBpZCwgdGhlblxuICAgICAgICAgICAgICAvLyByZXR1cm4gdGhhdCBpZCBhcyB3ZWxsLlxuICAgICAgICAgICAgICBpZiAob3B0aW9ucy51cHNlcnQgJiYgbWV0ZW9yUmVzdWx0Lmluc2VydGVkSWQpIHtcbiAgICAgICAgICAgICAgICBpZiAoa25vd25JZCkge1xuICAgICAgICAgICAgICAgICAgbWV0ZW9yUmVzdWx0Lmluc2VydGVkSWQgPSBrbm93bklkO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobWV0ZW9yUmVzdWx0Lmluc2VydGVkSWQgaW5zdGFuY2VvZiBNb25nb0RCLk9iamVjdElEKSB7XG4gICAgICAgICAgICAgICAgICBtZXRlb3JSZXN1bHQuaW5zZXJ0ZWRJZCA9IG5ldyBNb25nby5PYmplY3RJRChtZXRlb3JSZXN1bHQuaW5zZXJ0ZWRJZC50b0hleFN0cmluZygpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBjYWxsYmFjayhlcnIsIG1ldGVvclJlc3VsdCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjYWxsYmFjayhlcnIsIG1ldGVvclJlc3VsdC5udW1iZXJBZmZlY3RlZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKGVycik7XG4gICAgICAgICAgfVxuICAgICAgICB9KSk7XG4gICAgfVxuICB9IGNhdGNoIChlKSB7XG4gICAgd3JpdGUuY29tbWl0dGVkKCk7XG4gICAgdGhyb3cgZTtcbiAgfVxufTtcblxudmFyIHRyYW5zZm9ybVJlc3VsdCA9IGZ1bmN0aW9uIChkcml2ZXJSZXN1bHQpIHtcbiAgdmFyIG1ldGVvclJlc3VsdCA9IHsgbnVtYmVyQWZmZWN0ZWQ6IDAgfTtcbiAgaWYgKGRyaXZlclJlc3VsdCkge1xuICAgIHZhciBtb25nb1Jlc3VsdCA9IGRyaXZlclJlc3VsdC5yZXN1bHQ7XG5cbiAgICAvLyBPbiB1cGRhdGVzIHdpdGggdXBzZXJ0OnRydWUsIHRoZSBpbnNlcnRlZCB2YWx1ZXMgY29tZSBhcyBhIGxpc3Qgb2ZcbiAgICAvLyB1cHNlcnRlZCB2YWx1ZXMgLS0gZXZlbiB3aXRoIG9wdGlvbnMubXVsdGksIHdoZW4gdGhlIHVwc2VydCBkb2VzIGluc2VydCxcbiAgICAvLyBpdCBvbmx5IGluc2VydHMgb25lIGVsZW1lbnQuXG4gICAgaWYgKG1vbmdvUmVzdWx0LnVwc2VydGVkKSB7XG4gICAgICBtZXRlb3JSZXN1bHQubnVtYmVyQWZmZWN0ZWQgKz0gbW9uZ29SZXN1bHQudXBzZXJ0ZWQubGVuZ3RoO1xuXG4gICAgICBpZiAobW9uZ29SZXN1bHQudXBzZXJ0ZWQubGVuZ3RoID09IDEpIHtcbiAgICAgICAgbWV0ZW9yUmVzdWx0Lmluc2VydGVkSWQgPSBtb25nb1Jlc3VsdC51cHNlcnRlZFswXS5faWQ7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG1ldGVvclJlc3VsdC5udW1iZXJBZmZlY3RlZCA9IG1vbmdvUmVzdWx0Lm47XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG1ldGVvclJlc3VsdDtcbn07XG5cblxudmFyIE5VTV9PUFRJTUlTVElDX1RSSUVTID0gMztcblxuLy8gZXhwb3NlZCBmb3IgdGVzdGluZ1xuTW9uZ29Db25uZWN0aW9uLl9pc0Nhbm5vdENoYW5nZUlkRXJyb3IgPSBmdW5jdGlvbiAoZXJyKSB7XG5cbiAgLy8gTW9uZ28gMy4yLiogcmV0dXJucyBlcnJvciBhcyBuZXh0IE9iamVjdDpcbiAgLy8ge25hbWU6IFN0cmluZywgY29kZTogTnVtYmVyLCBlcnJtc2c6IFN0cmluZ31cbiAgLy8gT2xkZXIgTW9uZ28gcmV0dXJuczpcbiAgLy8ge25hbWU6IFN0cmluZywgY29kZTogTnVtYmVyLCBlcnI6IFN0cmluZ31cbiAgdmFyIGVycm9yID0gZXJyLmVycm1zZyB8fCBlcnIuZXJyO1xuXG4gIC8vIFdlIGRvbid0IHVzZSB0aGUgZXJyb3IgY29kZSBoZXJlXG4gIC8vIGJlY2F1c2UgdGhlIGVycm9yIGNvZGUgd2Ugb2JzZXJ2ZWQgaXQgcHJvZHVjaW5nICgxNjgzNykgYXBwZWFycyB0byBiZVxuICAvLyBhIGZhciBtb3JlIGdlbmVyaWMgZXJyb3IgY29kZSBiYXNlZCBvbiBleGFtaW5pbmcgdGhlIHNvdXJjZS5cbiAgaWYgKGVycm9yLmluZGV4T2YoJ1RoZSBfaWQgZmllbGQgY2Fubm90IGJlIGNoYW5nZWQnKSA9PT0gMFxuICAgIHx8IGVycm9yLmluZGV4T2YoXCJ0aGUgKGltbXV0YWJsZSkgZmllbGQgJ19pZCcgd2FzIGZvdW5kIHRvIGhhdmUgYmVlbiBhbHRlcmVkIHRvIF9pZFwiKSAhPT0gLTEpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn07XG5cbnZhciBzaW11bGF0ZVVwc2VydFdpdGhJbnNlcnRlZElkID0gZnVuY3Rpb24gKGNvbGxlY3Rpb24sIHNlbGVjdG9yLCBtb2QsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLCBjYWxsYmFjaykge1xuICAvLyBTVFJBVEVHWTogRmlyc3QgdHJ5IGRvaW5nIGFuIHVwc2VydCB3aXRoIGEgZ2VuZXJhdGVkIElELlxuICAvLyBJZiB0aGlzIHRocm93cyBhbiBlcnJvciBhYm91dCBjaGFuZ2luZyB0aGUgSUQgb24gYW4gZXhpc3RpbmcgZG9jdW1lbnRcbiAgLy8gdGhlbiB3aXRob3V0IGFmZmVjdGluZyB0aGUgZGF0YWJhc2UsIHdlIGtub3cgd2Ugc2hvdWxkIHByb2JhYmx5IHRyeVxuICAvLyBhbiB1cGRhdGUgd2l0aG91dCB0aGUgZ2VuZXJhdGVkIElELiBJZiBpdCBhZmZlY3RlZCAwIGRvY3VtZW50cyxcbiAgLy8gdGhlbiB3aXRob3V0IGFmZmVjdGluZyB0aGUgZGF0YWJhc2UsIHdlIHRoZSBkb2N1bWVudCB0aGF0IGZpcnN0XG4gIC8vIGdhdmUgdGhlIGVycm9yIGlzIHByb2JhYmx5IHJlbW92ZWQgYW5kIHdlIG5lZWQgdG8gdHJ5IGFuIGluc2VydCBhZ2FpblxuICAvLyBXZSBnbyBiYWNrIHRvIHN0ZXAgb25lIGFuZCByZXBlYXQuXG4gIC8vIExpa2UgYWxsIFwib3B0aW1pc3RpYyB3cml0ZVwiIHNjaGVtZXMsIHdlIHJlbHkgb24gdGhlIGZhY3QgdGhhdCBpdCdzXG4gIC8vIHVubGlrZWx5IG91ciB3cml0ZXMgd2lsbCBjb250aW51ZSB0byBiZSBpbnRlcmZlcmVkIHdpdGggdW5kZXIgbm9ybWFsXG4gIC8vIGNpcmN1bXN0YW5jZXMgKHRob3VnaCBzdWZmaWNpZW50bHkgaGVhdnkgY29udGVudGlvbiB3aXRoIHdyaXRlcnNcbiAgLy8gZGlzYWdyZWVpbmcgb24gdGhlIGV4aXN0ZW5jZSBvZiBhbiBvYmplY3Qgd2lsbCBjYXVzZSB3cml0ZXMgdG8gZmFpbFxuICAvLyBpbiB0aGVvcnkpLlxuXG4gIHZhciBpbnNlcnRlZElkID0gb3B0aW9ucy5pbnNlcnRlZElkOyAvLyBtdXN0IGV4aXN0XG4gIHZhciBtb25nb09wdHNGb3JVcGRhdGUgPSB7XG4gICAgc2FmZTogdHJ1ZSxcbiAgICBtdWx0aTogb3B0aW9ucy5tdWx0aVxuICB9O1xuICB2YXIgbW9uZ29PcHRzRm9ySW5zZXJ0ID0ge1xuICAgIHNhZmU6IHRydWUsXG4gICAgdXBzZXJ0OiB0cnVlXG4gIH07XG5cbiAgdmFyIHJlcGxhY2VtZW50V2l0aElkID0gT2JqZWN0LmFzc2lnbihcbiAgICByZXBsYWNlVHlwZXMoe19pZDogaW5zZXJ0ZWRJZH0sIHJlcGxhY2VNZXRlb3JBdG9tV2l0aE1vbmdvKSxcbiAgICBtb2QpO1xuXG4gIHZhciB0cmllcyA9IE5VTV9PUFRJTUlTVElDX1RSSUVTO1xuXG4gIHZhciBkb1VwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB0cmllcy0tO1xuICAgIGlmICghIHRyaWVzKSB7XG4gICAgICBjYWxsYmFjayhuZXcgRXJyb3IoXCJVcHNlcnQgZmFpbGVkIGFmdGVyIFwiICsgTlVNX09QVElNSVNUSUNfVFJJRVMgKyBcIiB0cmllcy5cIikpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb2xsZWN0aW9uLnVwZGF0ZShzZWxlY3RvciwgbW9kLCBtb25nb09wdHNGb3JVcGRhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBiaW5kRW52aXJvbm1lbnRGb3JXcml0ZShmdW5jdGlvbiAoZXJyLCByZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzdWx0ICYmIHJlc3VsdC5yZXN1bHQubiAhPSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVtYmVyQWZmZWN0ZWQ6IHJlc3VsdC5yZXN1bHQublxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvQ29uZGl0aW9uYWxJbnNlcnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgZG9Db25kaXRpb25hbEluc2VydCA9IGZ1bmN0aW9uICgpIHtcbiAgICBjb2xsZWN0aW9uLnVwZGF0ZShzZWxlY3RvciwgcmVwbGFjZW1lbnRXaXRoSWQsIG1vbmdvT3B0c0Zvckluc2VydCxcbiAgICAgICAgICAgICAgICAgICAgICBiaW5kRW52aXJvbm1lbnRGb3JXcml0ZShmdW5jdGlvbiAoZXJyLCByZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZmlndXJlIG91dCBpZiB0aGlzIGlzIGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gXCJjYW5ub3QgY2hhbmdlIF9pZCBvZiBkb2N1bWVudFwiIGVycm9yLCBhbmRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgc28sIHRyeSBkb1VwZGF0ZSgpIGFnYWluLCB1cCB0byAzIHRpbWVzLlxuICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoTW9uZ29Db25uZWN0aW9uLl9pc0Nhbm5vdENoYW5nZUlkRXJyb3IoZXJyKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvVXBkYXRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG51bWJlckFmZmVjdGVkOiByZXN1bHQucmVzdWx0LnVwc2VydGVkLmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnRlZElkOiBpbnNlcnRlZElkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gIH07XG5cbiAgZG9VcGRhdGUoKTtcbn07XG5cbl8uZWFjaChbXCJpbnNlcnRcIiwgXCJ1cGRhdGVcIiwgXCJyZW1vdmVcIiwgXCJkcm9wQ29sbGVjdGlvblwiLCBcImRyb3BEYXRhYmFzZVwiXSwgZnVuY3Rpb24gKG1ldGhvZCkge1xuICBNb25nb0Nvbm5lY3Rpb24ucHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbiAoLyogYXJndW1lbnRzICovKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHJldHVybiBNZXRlb3Iud3JhcEFzeW5jKHNlbGZbXCJfXCIgKyBtZXRob2RdKS5hcHBseShzZWxmLCBhcmd1bWVudHMpO1xuICB9O1xufSk7XG5cbi8vIFhYWCBNb25nb0Nvbm5lY3Rpb24udXBzZXJ0KCkgZG9lcyBub3QgcmV0dXJuIHRoZSBpZCBvZiB0aGUgaW5zZXJ0ZWQgZG9jdW1lbnRcbi8vIHVubGVzcyB5b3Ugc2V0IGl0IGV4cGxpY2l0bHkgaW4gdGhlIHNlbGVjdG9yIG9yIG1vZGlmaWVyIChhcyBhIHJlcGxhY2VtZW50XG4vLyBkb2MpLlxuTW9uZ29Db25uZWN0aW9uLnByb3RvdHlwZS51cHNlcnQgPSBmdW5jdGlvbiAoY29sbGVjdGlvbk5hbWUsIHNlbGVjdG9yLCBtb2QsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLCBjYWxsYmFjaykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gXCJmdW5jdGlvblwiICYmICEgY2FsbGJhY2spIHtcbiAgICBjYWxsYmFjayA9IG9wdGlvbnM7XG4gICAgb3B0aW9ucyA9IHt9O1xuICB9XG5cbiAgcmV0dXJuIHNlbGYudXBkYXRlKGNvbGxlY3Rpb25OYW1lLCBzZWxlY3RvciwgbW9kLFxuICAgICAgICAgICAgICAgICAgICAgXy5leHRlbmQoe30sIG9wdGlvbnMsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgdXBzZXJ0OiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICBfcmV0dXJuT2JqZWN0OiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICB9KSwgY2FsbGJhY2spO1xufTtcblxuTW9uZ29Db25uZWN0aW9uLnByb3RvdHlwZS5maW5kID0gZnVuY3Rpb24gKGNvbGxlY3Rpb25OYW1lLCBzZWxlY3Rvciwgb3B0aW9ucykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpXG4gICAgc2VsZWN0b3IgPSB7fTtcblxuICByZXR1cm4gbmV3IEN1cnNvcihcbiAgICBzZWxmLCBuZXcgQ3Vyc29yRGVzY3JpcHRpb24oY29sbGVjdGlvbk5hbWUsIHNlbGVjdG9yLCBvcHRpb25zKSk7XG59O1xuXG5Nb25nb0Nvbm5lY3Rpb24ucHJvdG90eXBlLmZpbmRPbmUgPSBmdW5jdGlvbiAoY29sbGVjdGlvbl9uYW1lLCBzZWxlY3RvcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpXG4gICAgc2VsZWN0b3IgPSB7fTtcblxuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgb3B0aW9ucy5saW1pdCA9IDE7XG4gIHJldHVybiBzZWxmLmZpbmQoY29sbGVjdGlvbl9uYW1lLCBzZWxlY3Rvciwgb3B0aW9ucykuZmV0Y2goKVswXTtcbn07XG5cbi8vIFdlJ2xsIGFjdHVhbGx5IGRlc2lnbiBhbiBpbmRleCBBUEkgbGF0ZXIuIEZvciBub3csIHdlIGp1c3QgcGFzcyB0aHJvdWdoIHRvXG4vLyBNb25nbydzLCBidXQgbWFrZSBpdCBzeW5jaHJvbm91cy5cbk1vbmdvQ29ubmVjdGlvbi5wcm90b3R5cGUuX2Vuc3VyZUluZGV4ID0gZnVuY3Rpb24gKGNvbGxlY3Rpb25OYW1lLCBpbmRleCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMpIHtcbiAgdHJ5IHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgLy8gV2UgZXhwZWN0IHRoaXMgZnVuY3Rpb24gdG8gYmUgY2FsbGVkIGF0IHN0YXJ0dXAsIG5vdCBmcm9tIHdpdGhpbiBhIG1ldGhvZCxcbiAgICAvLyBzbyB3ZSBkb24ndCBpbnRlcmFjdCB3aXRoIHRoZSB3cml0ZSBmZW5jZS5cbiAgICB2YXIgY29sbGVjdGlvbiA9IHNlbGYucmF3Q29sbGVjdGlvbihjb2xsZWN0aW9uTmFtZSk7XG4gICAgdmFyIGZ1dHVyZSA9IG5ldyBGdXR1cmU7XG4gICAgdmFyIGluZGV4TmFtZSA9IGNvbGxlY3Rpb24uZW5zdXJlSW5kZXgoaW5kZXgsIG9wdGlvbnMsIGZ1dHVyZS5yZXNvbHZlcigpKTtcbiAgICBmdXR1cmUud2FpdCgpO1xuICB9IGNhdGNoIChFeGNlcHRpb24pIHtcbiAgICBcbiAgfVxufTtcbk1vbmdvQ29ubmVjdGlvbi5wcm90b3R5cGUuX2Ryb3BJbmRleCA9IGZ1bmN0aW9uIChjb2xsZWN0aW9uTmFtZSwgaW5kZXgpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIC8vIFRoaXMgZnVuY3Rpb24gaXMgb25seSB1c2VkIGJ5IHRlc3QgY29kZSwgbm90IHdpdGhpbiBhIG1ldGhvZCwgc28gd2UgZG9uJ3RcbiAgLy8gaW50ZXJhY3Qgd2l0aCB0aGUgd3JpdGUgZmVuY2UuXG4gIHZhciBjb2xsZWN0aW9uID0gc2VsZi5yYXdDb2xsZWN0aW9uKGNvbGxlY3Rpb25OYW1lKTtcbiAgdmFyIGZ1dHVyZSA9IG5ldyBGdXR1cmU7XG4gIHZhciBpbmRleE5hbWUgPSBjb2xsZWN0aW9uLmRyb3BJbmRleChpbmRleCwgZnV0dXJlLnJlc29sdmVyKCkpO1xuICBmdXR1cmUud2FpdCgpO1xufTtcblxuLy8gQ1VSU09SU1xuXG4vLyBUaGVyZSBhcmUgc2V2ZXJhbCBjbGFzc2VzIHdoaWNoIHJlbGF0ZSB0byBjdXJzb3JzOlxuLy9cbi8vIEN1cnNvckRlc2NyaXB0aW9uIHJlcHJlc2VudHMgdGhlIGFyZ3VtZW50cyB1c2VkIHRvIGNvbnN0cnVjdCBhIGN1cnNvcjpcbi8vIGNvbGxlY3Rpb25OYW1lLCBzZWxlY3RvciwgYW5kIChmaW5kKSBvcHRpb25zLiAgQmVjYXVzZSBpdCBpcyB1c2VkIGFzIGEga2V5XG4vLyBmb3IgY3Vyc29yIGRlLWR1cCwgZXZlcnl0aGluZyBpbiBpdCBzaG91bGQgZWl0aGVyIGJlIEpTT04tc3RyaW5naWZpYWJsZSBvclxuLy8gbm90IGFmZmVjdCBvYnNlcnZlQ2hhbmdlcyBvdXRwdXQgKGVnLCBvcHRpb25zLnRyYW5zZm9ybSBmdW5jdGlvbnMgYXJlIG5vdFxuLy8gc3RyaW5naWZpYWJsZSBidXQgZG8gbm90IGFmZmVjdCBvYnNlcnZlQ2hhbmdlcykuXG4vL1xuLy8gU3luY2hyb25vdXNDdXJzb3IgaXMgYSB3cmFwcGVyIGFyb3VuZCBhIE1vbmdvREIgY3Vyc29yXG4vLyB3aGljaCBpbmNsdWRlcyBmdWxseS1zeW5jaHJvbm91cyB2ZXJzaW9ucyBvZiBmb3JFYWNoLCBldGMuXG4vL1xuLy8gQ3Vyc29yIGlzIHRoZSBjdXJzb3Igb2JqZWN0IHJldHVybmVkIGZyb20gZmluZCgpLCB3aGljaCBpbXBsZW1lbnRzIHRoZVxuLy8gZG9jdW1lbnRlZCBNb25nby5Db2xsZWN0aW9uIGN1cnNvciBBUEkuICBJdCB3cmFwcyBhIEN1cnNvckRlc2NyaXB0aW9uIGFuZCBhXG4vLyBTeW5jaHJvbm91c0N1cnNvciAobGF6aWx5OiBpdCBkb2Vzbid0IGNvbnRhY3QgTW9uZ28gdW50aWwgeW91IGNhbGwgYSBtZXRob2Rcbi8vIGxpa2UgZmV0Y2ggb3IgZm9yRWFjaCBvbiBpdCkuXG4vL1xuLy8gT2JzZXJ2ZUhhbmRsZSBpcyB0aGUgXCJvYnNlcnZlIGhhbmRsZVwiIHJldHVybmVkIGZyb20gb2JzZXJ2ZUNoYW5nZXMuIEl0IGhhcyBhXG4vLyByZWZlcmVuY2UgdG8gYW4gT2JzZXJ2ZU11bHRpcGxleGVyLlxuLy9cbi8vIE9ic2VydmVNdWx0aXBsZXhlciBhbGxvd3MgbXVsdGlwbGUgaWRlbnRpY2FsIE9ic2VydmVIYW5kbGVzIHRvIGJlIGRyaXZlbiBieSBhXG4vLyBzaW5nbGUgb2JzZXJ2ZSBkcml2ZXIuXG4vL1xuLy8gVGhlcmUgYXJlIHR3byBcIm9ic2VydmUgZHJpdmVyc1wiIHdoaWNoIGRyaXZlIE9ic2VydmVNdWx0aXBsZXhlcnM6XG4vLyAgIC0gUG9sbGluZ09ic2VydmVEcml2ZXIgY2FjaGVzIHRoZSByZXN1bHRzIG9mIGEgcXVlcnkgYW5kIHJlcnVucyBpdCB3aGVuXG4vLyAgICAgbmVjZXNzYXJ5LlxuLy8gICAtIE9wbG9nT2JzZXJ2ZURyaXZlciBmb2xsb3dzIHRoZSBNb25nbyBvcGVyYXRpb24gbG9nIHRvIGRpcmVjdGx5IG9ic2VydmVcbi8vICAgICBkYXRhYmFzZSBjaGFuZ2VzLlxuLy8gQm90aCBpbXBsZW1lbnRhdGlvbnMgZm9sbG93IHRoZSBzYW1lIHNpbXBsZSBpbnRlcmZhY2U6IHdoZW4geW91IGNyZWF0ZSB0aGVtLFxuLy8gdGhleSBzdGFydCBzZW5kaW5nIG9ic2VydmVDaGFuZ2VzIGNhbGxiYWNrcyAoYW5kIGEgcmVhZHkoKSBpbnZvY2F0aW9uKSB0b1xuLy8gdGhlaXIgT2JzZXJ2ZU11bHRpcGxleGVyLCBhbmQgeW91IHN0b3AgdGhlbSBieSBjYWxsaW5nIHRoZWlyIHN0b3AoKSBtZXRob2QuXG5cbkN1cnNvckRlc2NyaXB0aW9uID0gZnVuY3Rpb24gKGNvbGxlY3Rpb25OYW1lLCBzZWxlY3Rvciwgb3B0aW9ucykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHNlbGYuY29sbGVjdGlvbk5hbWUgPSBjb2xsZWN0aW9uTmFtZTtcbiAgc2VsZi5zZWxlY3RvciA9IE1vbmdvLkNvbGxlY3Rpb24uX3Jld3JpdGVTZWxlY3RvcihzZWxlY3Rvcik7XG4gIHNlbGYub3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG59O1xuXG5DdXJzb3IgPSBmdW5jdGlvbiAobW9uZ28sIGN1cnNvckRlc2NyaXB0aW9uKSB7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICBzZWxmLl9tb25nbyA9IG1vbmdvO1xuICBzZWxmLl9jdXJzb3JEZXNjcmlwdGlvbiA9IGN1cnNvckRlc2NyaXB0aW9uO1xuICBzZWxmLl9zeW5jaHJvbm91c0N1cnNvciA9IG51bGw7XG59O1xuXG5fLmVhY2goWydmb3JFYWNoJywgJ21hcCcsICdmZXRjaCcsICdjb3VudCcsIFN5bWJvbC5pdGVyYXRvcl0sIGZ1bmN0aW9uIChtZXRob2QpIHtcbiAgQ3Vyc29yLnByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIC8vIFlvdSBjYW4gb25seSBvYnNlcnZlIGEgdGFpbGFibGUgY3Vyc29yLlxuICAgIGlmIChzZWxmLl9jdXJzb3JEZXNjcmlwdGlvbi5vcHRpb25zLnRhaWxhYmxlKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGNhbGwgXCIgKyBtZXRob2QgKyBcIiBvbiBhIHRhaWxhYmxlIGN1cnNvclwiKTtcblxuICAgIGlmICghc2VsZi5fc3luY2hyb25vdXNDdXJzb3IpIHtcbiAgICAgIHNlbGYuX3N5bmNocm9ub3VzQ3Vyc29yID0gc2VsZi5fbW9uZ28uX2NyZWF0ZVN5bmNocm9ub3VzQ3Vyc29yKFxuICAgICAgICBzZWxmLl9jdXJzb3JEZXNjcmlwdGlvbiwge1xuICAgICAgICAgIC8vIE1ha2Ugc3VyZSB0aGF0IHRoZSBcInNlbGZcIiBhcmd1bWVudCB0byBmb3JFYWNoL21hcCBjYWxsYmFja3MgaXMgdGhlXG4gICAgICAgICAgLy8gQ3Vyc29yLCBub3QgdGhlIFN5bmNocm9ub3VzQ3Vyc29yLlxuICAgICAgICAgIHNlbGZGb3JJdGVyYXRpb246IHNlbGYsXG4gICAgICAgICAgdXNlVHJhbnNmb3JtOiB0cnVlXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBzZWxmLl9zeW5jaHJvbm91c0N1cnNvclttZXRob2RdLmFwcGx5KFxuICAgICAgc2VsZi5fc3luY2hyb25vdXNDdXJzb3IsIGFyZ3VtZW50cyk7XG4gIH07XG59KTtcblxuLy8gU2luY2Ugd2UgZG9uJ3QgYWN0dWFsbHkgaGF2ZSBhIFwibmV4dE9iamVjdFwiIGludGVyZmFjZSwgdGhlcmUncyByZWFsbHkgbm9cbi8vIHJlYXNvbiB0byBoYXZlIGEgXCJyZXdpbmRcIiBpbnRlcmZhY2UuICBBbGwgaXQgZGlkIHdhcyBtYWtlIG11bHRpcGxlIGNhbGxzXG4vLyB0byBmZXRjaC9tYXAvZm9yRWFjaCByZXR1cm4gbm90aGluZyB0aGUgc2Vjb25kIHRpbWUuXG4vLyBYWFggQ09NUEFUIFdJVEggMC44LjFcbkN1cnNvci5wcm90b3R5cGUucmV3aW5kID0gZnVuY3Rpb24gKCkge1xufTtcblxuQ3Vyc29yLnByb3RvdHlwZS5nZXRUcmFuc2Zvcm0gPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzLl9jdXJzb3JEZXNjcmlwdGlvbi5vcHRpb25zLnRyYW5zZm9ybTtcbn07XG5cbi8vIFdoZW4geW91IGNhbGwgTWV0ZW9yLnB1Ymxpc2goKSB3aXRoIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgQ3Vyc29yLCB3ZSBuZWVkXG4vLyB0byB0cmFuc211dGUgaXQgaW50byB0aGUgZXF1aXZhbGVudCBzdWJzY3JpcHRpb24uICBUaGlzIGlzIHRoZSBmdW5jdGlvbiB0aGF0XG4vLyBkb2VzIHRoYXQuXG5cbkN1cnNvci5wcm90b3R5cGUuX3B1Ymxpc2hDdXJzb3IgPSBmdW5jdGlvbiAoc3ViKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdmFyIGNvbGxlY3Rpb24gPSBzZWxmLl9jdXJzb3JEZXNjcmlwdGlvbi5jb2xsZWN0aW9uTmFtZTtcbiAgcmV0dXJuIE1vbmdvLkNvbGxlY3Rpb24uX3B1Ymxpc2hDdXJzb3Ioc2VsZiwgc3ViLCBjb2xsZWN0aW9uKTtcbn07XG5cbi8vIFVzZWQgdG8gZ3VhcmFudGVlIHRoYXQgcHVibGlzaCBmdW5jdGlvbnMgcmV0dXJuIGF0IG1vc3Qgb25lIGN1cnNvciBwZXJcbi8vIGNvbGxlY3Rpb24uIFByaXZhdGUsIGJlY2F1c2Ugd2UgbWlnaHQgbGF0ZXIgaGF2ZSBjdXJzb3JzIHRoYXQgaW5jbHVkZVxuLy8gZG9jdW1lbnRzIGZyb20gbXVsdGlwbGUgY29sbGVjdGlvbnMgc29tZWhvdy5cbkN1cnNvci5wcm90b3R5cGUuX2dldENvbGxlY3Rpb25OYW1lID0gZnVuY3Rpb24gKCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHJldHVybiBzZWxmLl9jdXJzb3JEZXNjcmlwdGlvbi5jb2xsZWN0aW9uTmFtZTtcbn07XG5cbkN1cnNvci5wcm90b3R5cGUub2JzZXJ2ZSA9IGZ1bmN0aW9uIChjYWxsYmFja3MpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICByZXR1cm4gTG9jYWxDb2xsZWN0aW9uLl9vYnNlcnZlRnJvbU9ic2VydmVDaGFuZ2VzKHNlbGYsIGNhbGxiYWNrcyk7XG59O1xuXG5DdXJzb3IucHJvdG90eXBlLm9ic2VydmVDaGFuZ2VzID0gZnVuY3Rpb24gKGNhbGxiYWNrcykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHZhciBtZXRob2RzID0gW1xuICAgICdhZGRlZEF0JyxcbiAgICAnYWRkZWQnLFxuICAgICdjaGFuZ2VkQXQnLFxuICAgICdjaGFuZ2VkJyxcbiAgICAncmVtb3ZlZEF0JyxcbiAgICAncmVtb3ZlZCcsXG4gICAgJ21vdmVkVG8nXG4gIF07XG4gIHZhciBvcmRlcmVkID0gTG9jYWxDb2xsZWN0aW9uLl9vYnNlcnZlQ2hhbmdlc0NhbGxiYWNrc0FyZU9yZGVyZWQoY2FsbGJhY2tzKTtcblxuICAvLyBYWFg6IENhbiB3ZSBmaW5kIG91dCBpZiBjYWxsYmFja3MgYXJlIGZyb20gb2JzZXJ2ZT9cbiAgdmFyIGV4Y2VwdGlvbk5hbWUgPSAnIG9ic2VydmUvb2JzZXJ2ZUNoYW5nZXMgY2FsbGJhY2snO1xuICBtZXRob2RzLmZvckVhY2goZnVuY3Rpb24gKG1ldGhvZCkge1xuICAgIGlmIChjYWxsYmFja3NbbWV0aG9kXSAmJiB0eXBlb2YgY2FsbGJhY2tzW21ldGhvZF0gPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICBjYWxsYmFja3NbbWV0aG9kXSA9IE1ldGVvci5iaW5kRW52aXJvbm1lbnQoY2FsbGJhY2tzW21ldGhvZF0sIG1ldGhvZCArIGV4Y2VwdGlvbk5hbWUpO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHNlbGYuX21vbmdvLl9vYnNlcnZlQ2hhbmdlcyhcbiAgICBzZWxmLl9jdXJzb3JEZXNjcmlwdGlvbiwgb3JkZXJlZCwgY2FsbGJhY2tzKTtcbn07XG5cbk1vbmdvQ29ubmVjdGlvbi5wcm90b3R5cGUuX2NyZWF0ZVN5bmNocm9ub3VzQ3Vyc29yID0gZnVuY3Rpb24oXG4gICAgY3Vyc29yRGVzY3JpcHRpb24sIG9wdGlvbnMpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBvcHRpb25zID0gXy5waWNrKG9wdGlvbnMgfHwge30sICdzZWxmRm9ySXRlcmF0aW9uJywgJ3VzZVRyYW5zZm9ybScpO1xuXG4gIHZhciBjb2xsZWN0aW9uID0gc2VsZi5yYXdDb2xsZWN0aW9uKGN1cnNvckRlc2NyaXB0aW9uLmNvbGxlY3Rpb25OYW1lKTtcbiAgdmFyIGN1cnNvck9wdGlvbnMgPSBjdXJzb3JEZXNjcmlwdGlvbi5vcHRpb25zO1xuICB2YXIgbW9uZ29PcHRpb25zID0ge1xuICAgIHNvcnQ6IGN1cnNvck9wdGlvbnMuc29ydCxcbiAgICBsaW1pdDogY3Vyc29yT3B0aW9ucy5saW1pdCxcbiAgICBza2lwOiBjdXJzb3JPcHRpb25zLnNraXAsXG4gICAgcHJvamVjdGlvbjogY3Vyc29yT3B0aW9ucy5maWVsZHNcbiAgfTtcblxuICAvLyBEbyB3ZSB3YW50IGEgdGFpbGFibGUgY3Vyc29yICh3aGljaCBvbmx5IHdvcmtzIG9uIGNhcHBlZCBjb2xsZWN0aW9ucyk/XG4gIGlmIChjdXJzb3JPcHRpb25zLnRhaWxhYmxlKSB7XG4gICAgLy8gV2Ugd2FudCBhIHRhaWxhYmxlIGN1cnNvci4uLlxuICAgIG1vbmdvT3B0aW9ucy50YWlsYWJsZSA9IHRydWU7XG4gICAgLy8gLi4uIGFuZCBmb3IgdGhlIHNlcnZlciB0byB3YWl0IGEgYml0IGlmIGFueSBnZXRNb3JlIGhhcyBubyBkYXRhIChyYXRoZXJcbiAgICAvLyB0aGFuIG1ha2luZyB1cyBwdXQgdGhlIHJlbGV2YW50IHNsZWVwcyBpbiB0aGUgY2xpZW50KS4uLlxuICAgIG1vbmdvT3B0aW9ucy5hd2FpdGRhdGEgPSB0cnVlO1xuICAgIC8vIC4uLiBhbmQgdG8ga2VlcCBxdWVyeWluZyB0aGUgc2VydmVyIGluZGVmaW5pdGVseSByYXRoZXIgdGhhbiBqdXN0IDUgdGltZXNcbiAgICAvLyBpZiB0aGVyZSdzIG5vIG1vcmUgZGF0YS5cbiAgICBtb25nb09wdGlvbnMubnVtYmVyT2ZSZXRyaWVzID0gLTE7XG4gICAgLy8gQW5kIGlmIHRoaXMgaXMgb24gdGhlIG9wbG9nIGNvbGxlY3Rpb24gYW5kIHRoZSBjdXJzb3Igc3BlY2lmaWVzIGEgJ3RzJyxcbiAgICAvLyB0aGVuIHNldCB0aGUgdW5kb2N1bWVudGVkIG9wbG9nIHJlcGxheSBmbGFnLCB3aGljaCBkb2VzIGEgc3BlY2lhbCBzY2FuIHRvXG4gICAgLy8gZmluZCB0aGUgZmlyc3QgZG9jdW1lbnQgKGluc3RlYWQgb2YgY3JlYXRpbmcgYW4gaW5kZXggb24gdHMpLiBUaGlzIGlzIGFcbiAgICAvLyB2ZXJ5IGhhcmQtY29kZWQgTW9uZ28gZmxhZyB3aGljaCBvbmx5IHdvcmtzIG9uIHRoZSBvcGxvZyBjb2xsZWN0aW9uIGFuZFxuICAgIC8vIG9ubHkgd29ya3Mgd2l0aCB0aGUgdHMgZmllbGQuXG4gICAgaWYgKGN1cnNvckRlc2NyaXB0aW9uLmNvbGxlY3Rpb25OYW1lID09PSBPUExPR19DT0xMRUNUSU9OICYmXG4gICAgICAgIGN1cnNvckRlc2NyaXB0aW9uLnNlbGVjdG9yLnRzKSB7XG4gICAgICBtb25nb09wdGlvbnMub3Bsb2dSZXBsYXkgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHZhciBkYkN1cnNvciA9IGNvbGxlY3Rpb24uZmluZChcbiAgICByZXBsYWNlVHlwZXMoY3Vyc29yRGVzY3JpcHRpb24uc2VsZWN0b3IsIHJlcGxhY2VNZXRlb3JBdG9tV2l0aE1vbmdvKSxcbiAgICBtb25nb09wdGlvbnMpO1xuXG4gIGlmICh0eXBlb2YgY3Vyc29yT3B0aW9ucy5tYXhUaW1lTXMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgZGJDdXJzb3IgPSBkYkN1cnNvci5tYXhUaW1lTVMoY3Vyc29yT3B0aW9ucy5tYXhUaW1lTXMpO1xuICB9XG4gIGlmICh0eXBlb2YgY3Vyc29yT3B0aW9ucy5oaW50ICE9PSAndW5kZWZpbmVkJykge1xuICAgIGRiQ3Vyc29yID0gZGJDdXJzb3IuaGludChjdXJzb3JPcHRpb25zLmhpbnQpO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBTeW5jaHJvbm91c0N1cnNvcihkYkN1cnNvciwgY3Vyc29yRGVzY3JpcHRpb24sIG9wdGlvbnMpO1xufTtcblxudmFyIFN5bmNocm9ub3VzQ3Vyc29yID0gZnVuY3Rpb24gKGRiQ3Vyc29yLCBjdXJzb3JEZXNjcmlwdGlvbiwgb3B0aW9ucykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIG9wdGlvbnMgPSBfLnBpY2sob3B0aW9ucyB8fCB7fSwgJ3NlbGZGb3JJdGVyYXRpb24nLCAndXNlVHJhbnNmb3JtJyk7XG5cbiAgc2VsZi5fZGJDdXJzb3IgPSBkYkN1cnNvcjtcbiAgc2VsZi5fY3Vyc29yRGVzY3JpcHRpb24gPSBjdXJzb3JEZXNjcmlwdGlvbjtcbiAgLy8gVGhlIFwic2VsZlwiIGFyZ3VtZW50IHBhc3NlZCB0byBmb3JFYWNoL21hcCBjYWxsYmFja3MuIElmIHdlJ3JlIHdyYXBwZWRcbiAgLy8gaW5zaWRlIGEgdXNlci12aXNpYmxlIEN1cnNvciwgd2Ugd2FudCB0byBwcm92aWRlIHRoZSBvdXRlciBjdXJzb3IhXG4gIHNlbGYuX3NlbGZGb3JJdGVyYXRpb24gPSBvcHRpb25zLnNlbGZGb3JJdGVyYXRpb24gfHwgc2VsZjtcbiAgaWYgKG9wdGlvbnMudXNlVHJhbnNmb3JtICYmIGN1cnNvckRlc2NyaXB0aW9uLm9wdGlvbnMudHJhbnNmb3JtKSB7XG4gICAgc2VsZi5fdHJhbnNmb3JtID0gTG9jYWxDb2xsZWN0aW9uLndyYXBUcmFuc2Zvcm0oXG4gICAgICBjdXJzb3JEZXNjcmlwdGlvbi5vcHRpb25zLnRyYW5zZm9ybSk7XG4gIH0gZWxzZSB7XG4gICAgc2VsZi5fdHJhbnNmb3JtID0gbnVsbDtcbiAgfVxuXG4gIHNlbGYuX3N5bmNocm9ub3VzQ291bnQgPSBGdXR1cmUud3JhcChkYkN1cnNvci5jb3VudC5iaW5kKGRiQ3Vyc29yKSk7XG4gIHNlbGYuX3Zpc2l0ZWRJZHMgPSBuZXcgTG9jYWxDb2xsZWN0aW9uLl9JZE1hcDtcbn07XG5cbl8uZXh0ZW5kKFN5bmNocm9ub3VzQ3Vyc29yLnByb3RvdHlwZSwge1xuICAvLyBSZXR1cm5zIGEgUHJvbWlzZSBmb3IgdGhlIG5leHQgb2JqZWN0IGZyb20gdGhlIHVuZGVybHlpbmcgY3Vyc29yIChiZWZvcmVcbiAgLy8gdGhlIE1vbmdvLT5NZXRlb3IgdHlwZSByZXBsYWNlbWVudCkuXG4gIF9yYXdOZXh0T2JqZWN0UHJvbWlzZTogZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBzZWxmLl9kYkN1cnNvci5uZXh0KChlcnIsIGRvYykgPT4ge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzb2x2ZShkb2MpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSxcblxuICAvLyBSZXR1cm5zIGEgUHJvbWlzZSBmb3IgdGhlIG5leHQgb2JqZWN0IGZyb20gdGhlIGN1cnNvciwgc2tpcHBpbmcgdGhvc2Ugd2hvc2VcbiAgLy8gSURzIHdlJ3ZlIGFscmVhZHkgc2VlbiBhbmQgcmVwbGFjaW5nIE1vbmdvIGF0b21zIHdpdGggTWV0ZW9yIGF0b21zLlxuICBfbmV4dE9iamVjdFByb21pc2U6IGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgdmFyIGRvYyA9IGF3YWl0IHNlbGYuX3Jhd05leHRPYmplY3RQcm9taXNlKCk7XG5cbiAgICAgIGlmICghZG9jKSByZXR1cm4gbnVsbDtcbiAgICAgIGRvYyA9IHJlcGxhY2VUeXBlcyhkb2MsIHJlcGxhY2VNb25nb0F0b21XaXRoTWV0ZW9yKTtcblxuICAgICAgaWYgKCFzZWxmLl9jdXJzb3JEZXNjcmlwdGlvbi5vcHRpb25zLnRhaWxhYmxlICYmIF8uaGFzKGRvYywgJ19pZCcpKSB7XG4gICAgICAgIC8vIERpZCBNb25nbyBnaXZlIHVzIGR1cGxpY2F0ZSBkb2N1bWVudHMgaW4gdGhlIHNhbWUgY3Vyc29yPyBJZiBzbyxcbiAgICAgICAgLy8gaWdub3JlIHRoaXMgb25lLiAoRG8gdGhpcyBiZWZvcmUgdGhlIHRyYW5zZm9ybSwgc2luY2UgdHJhbnNmb3JtIG1pZ2h0XG4gICAgICAgIC8vIHJldHVybiBzb21lIHVucmVsYXRlZCB2YWx1ZS4pIFdlIGRvbid0IGRvIHRoaXMgZm9yIHRhaWxhYmxlIGN1cnNvcnMsXG4gICAgICAgIC8vIGJlY2F1c2Ugd2Ugd2FudCB0byBtYWludGFpbiBPKDEpIG1lbW9yeSB1c2FnZS4gQW5kIGlmIHRoZXJlIGlzbid0IF9pZFxuICAgICAgICAvLyBmb3Igc29tZSByZWFzb24gKG1heWJlIGl0J3MgdGhlIG9wbG9nKSwgdGhlbiB3ZSBkb24ndCBkbyB0aGlzIGVpdGhlci5cbiAgICAgICAgLy8gKEJlIGNhcmVmdWwgdG8gZG8gdGhpcyBmb3IgZmFsc2V5IGJ1dCBleGlzdGluZyBfaWQsIHRob3VnaC4pXG4gICAgICAgIGlmIChzZWxmLl92aXNpdGVkSWRzLmhhcyhkb2MuX2lkKSkgY29udGludWU7XG4gICAgICAgIHNlbGYuX3Zpc2l0ZWRJZHMuc2V0KGRvYy5faWQsIHRydWUpO1xuICAgICAgfVxuXG4gICAgICBpZiAoc2VsZi5fdHJhbnNmb3JtKVxuICAgICAgICBkb2MgPSBzZWxmLl90cmFuc2Zvcm0oZG9jKTtcblxuICAgICAgcmV0dXJuIGRvYztcbiAgICB9XG4gIH0sXG5cbiAgLy8gUmV0dXJucyBhIHByb21pc2Ugd2hpY2ggaXMgcmVzb2x2ZWQgd2l0aCB0aGUgbmV4dCBvYmplY3QgKGxpa2Ugd2l0aFxuICAvLyBfbmV4dE9iamVjdFByb21pc2UpIG9yIHJlamVjdGVkIGlmIHRoZSBjdXJzb3IgZG9lc24ndCByZXR1cm4gd2l0aGluXG4gIC8vIHRpbWVvdXRNUyBtcy5cbiAgX25leHRPYmplY3RQcm9taXNlV2l0aFRpbWVvdXQ6IGZ1bmN0aW9uICh0aW1lb3V0TVMpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBpZiAoIXRpbWVvdXRNUykge1xuICAgICAgcmV0dXJuIHNlbGYuX25leHRPYmplY3RQcm9taXNlKCk7XG4gICAgfVxuICAgIGNvbnN0IG5leHRPYmplY3RQcm9taXNlID0gc2VsZi5fbmV4dE9iamVjdFByb21pc2UoKTtcbiAgICBjb25zdCB0aW1lb3V0RXJyID0gbmV3IEVycm9yKCdDbGllbnQtc2lkZSB0aW1lb3V0IHdhaXRpbmcgZm9yIG5leHQgb2JqZWN0Jyk7XG4gICAgY29uc3QgdGltZW91dFByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCB0aW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICByZWplY3QodGltZW91dEVycik7XG4gICAgICB9LCB0aW1lb3V0TVMpO1xuICAgIH0pO1xuICAgIHJldHVybiBQcm9taXNlLnJhY2UoW25leHRPYmplY3RQcm9taXNlLCB0aW1lb3V0UHJvbWlzZV0pXG4gICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICBpZiAoZXJyID09PSB0aW1lb3V0RXJyKSB7XG4gICAgICAgICAgc2VsZi5jbG9zZSgpO1xuICAgICAgICB9XG4gICAgICAgIHRocm93IGVycjtcbiAgICAgIH0pO1xuICB9LFxuXG4gIF9uZXh0T2JqZWN0OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHJldHVybiBzZWxmLl9uZXh0T2JqZWN0UHJvbWlzZSgpLmF3YWl0KCk7XG4gIH0sXG5cbiAgZm9yRWFjaDogZnVuY3Rpb24gKGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgLy8gR2V0IGJhY2sgdG8gdGhlIGJlZ2lubmluZy5cbiAgICBzZWxmLl9yZXdpbmQoKTtcblxuICAgIC8vIFdlIGltcGxlbWVudCB0aGUgbG9vcCBvdXJzZWxmIGluc3RlYWQgb2YgdXNpbmcgc2VsZi5fZGJDdXJzb3IuZWFjaCxcbiAgICAvLyBiZWNhdXNlIFwiZWFjaFwiIHdpbGwgY2FsbCBpdHMgY2FsbGJhY2sgb3V0c2lkZSBvZiBhIGZpYmVyIHdoaWNoIG1ha2VzIGl0XG4gICAgLy8gbXVjaCBtb3JlIGNvbXBsZXggdG8gbWFrZSB0aGlzIGZ1bmN0aW9uIHN5bmNocm9ub3VzLlxuICAgIHZhciBpbmRleCA9IDA7XG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIHZhciBkb2MgPSBzZWxmLl9uZXh0T2JqZWN0KCk7XG4gICAgICBpZiAoIWRvYykgcmV0dXJuO1xuICAgICAgY2FsbGJhY2suY2FsbCh0aGlzQXJnLCBkb2MsIGluZGV4KyssIHNlbGYuX3NlbGZGb3JJdGVyYXRpb24pO1xuICAgIH1cbiAgfSxcblxuICAvLyBYWFggQWxsb3cgb3ZlcmxhcHBpbmcgY2FsbGJhY2sgZXhlY3V0aW9ucyBpZiBjYWxsYmFjayB5aWVsZHMuXG4gIG1hcDogZnVuY3Rpb24gKGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciByZXMgPSBbXTtcbiAgICBzZWxmLmZvckVhY2goZnVuY3Rpb24gKGRvYywgaW5kZXgpIHtcbiAgICAgIHJlcy5wdXNoKGNhbGxiYWNrLmNhbGwodGhpc0FyZywgZG9jLCBpbmRleCwgc2VsZi5fc2VsZkZvckl0ZXJhdGlvbikpO1xuICAgIH0pO1xuICAgIHJldHVybiByZXM7XG4gIH0sXG5cbiAgX3Jld2luZDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIC8vIGtub3duIHRvIGJlIHN5bmNocm9ub3VzXG4gICAgc2VsZi5fZGJDdXJzb3IucmV3aW5kKCk7XG5cbiAgICBzZWxmLl92aXNpdGVkSWRzID0gbmV3IExvY2FsQ29sbGVjdGlvbi5fSWRNYXA7XG4gIH0sXG5cbiAgLy8gTW9zdGx5IHVzYWJsZSBmb3IgdGFpbGFibGUgY3Vyc29ycy5cbiAgY2xvc2U6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICBzZWxmLl9kYkN1cnNvci5jbG9zZSgpO1xuICB9LFxuXG4gIGZldGNoOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHJldHVybiBzZWxmLm1hcChfLmlkZW50aXR5KTtcbiAgfSxcblxuICBjb3VudDogZnVuY3Rpb24gKGFwcGx5U2tpcExpbWl0ID0gZmFsc2UpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgcmV0dXJuIHNlbGYuX3N5bmNocm9ub3VzQ291bnQoYXBwbHlTa2lwTGltaXQpLndhaXQoKTtcbiAgfSxcblxuICAvLyBUaGlzIG1ldGhvZCBpcyBOT1Qgd3JhcHBlZCBpbiBDdXJzb3IuXG4gIGdldFJhd09iamVjdHM6IGZ1bmN0aW9uIChvcmRlcmVkKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIGlmIChvcmRlcmVkKSB7XG4gICAgICByZXR1cm4gc2VsZi5mZXRjaCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgcmVzdWx0cyA9IG5ldyBMb2NhbENvbGxlY3Rpb24uX0lkTWFwO1xuICAgICAgc2VsZi5mb3JFYWNoKGZ1bmN0aW9uIChkb2MpIHtcbiAgICAgICAgcmVzdWx0cy5zZXQoZG9jLl9pZCwgZG9jKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfVxuICB9XG59KTtcblxuU3luY2hyb25vdXNDdXJzb3IucHJvdG90eXBlW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICAvLyBHZXQgYmFjayB0byB0aGUgYmVnaW5uaW5nLlxuICBzZWxmLl9yZXdpbmQoKTtcblxuICByZXR1cm4ge1xuICAgIG5leHQoKSB7XG4gICAgICBjb25zdCBkb2MgPSBzZWxmLl9uZXh0T2JqZWN0KCk7XG4gICAgICByZXR1cm4gZG9jID8ge1xuICAgICAgICB2YWx1ZTogZG9jXG4gICAgICB9IDoge1xuICAgICAgICBkb25lOiB0cnVlXG4gICAgICB9O1xuICAgIH1cbiAgfTtcbn07XG5cbi8vIFRhaWxzIHRoZSBjdXJzb3IgZGVzY3JpYmVkIGJ5IGN1cnNvckRlc2NyaXB0aW9uLCBtb3N0IGxpa2VseSBvbiB0aGVcbi8vIG9wbG9nLiBDYWxscyBkb2NDYWxsYmFjayB3aXRoIGVhY2ggZG9jdW1lbnQgZm91bmQuIElnbm9yZXMgZXJyb3JzIGFuZCBqdXN0XG4vLyByZXN0YXJ0cyB0aGUgdGFpbCBvbiBlcnJvci5cbi8vXG4vLyBJZiB0aW1lb3V0TVMgaXMgc2V0LCB0aGVuIGlmIHdlIGRvbid0IGdldCBhIG5ldyBkb2N1bWVudCBldmVyeSB0aW1lb3V0TVMsXG4vLyBraWxsIGFuZCByZXN0YXJ0IHRoZSBjdXJzb3IuIFRoaXMgaXMgcHJpbWFyaWx5IGEgd29ya2Fyb3VuZCBmb3IgIzg1OTguXG5Nb25nb0Nvbm5lY3Rpb24ucHJvdG90eXBlLnRhaWwgPSBmdW5jdGlvbiAoY3Vyc29yRGVzY3JpcHRpb24sIGRvY0NhbGxiYWNrLCB0aW1lb3V0TVMpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBpZiAoIWN1cnNvckRlc2NyaXB0aW9uLm9wdGlvbnMudGFpbGFibGUpXG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ2FuIG9ubHkgdGFpbCBhIHRhaWxhYmxlIGN1cnNvclwiKTtcblxuICB2YXIgY3Vyc29yID0gc2VsZi5fY3JlYXRlU3luY2hyb25vdXNDdXJzb3IoY3Vyc29yRGVzY3JpcHRpb24pO1xuXG4gIHZhciBzdG9wcGVkID0gZmFsc2U7XG4gIHZhciBsYXN0VFM7XG4gIHZhciBsb29wID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBkb2MgPSBudWxsO1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICBpZiAoc3RvcHBlZClcbiAgICAgICAgcmV0dXJuO1xuICAgICAgdHJ5IHtcbiAgICAgICAgZG9jID0gY3Vyc29yLl9uZXh0T2JqZWN0UHJvbWlzZVdpdGhUaW1lb3V0KHRpbWVvdXRNUykuYXdhaXQoKTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAvLyBUaGVyZSdzIG5vIGdvb2Qgd2F5IHRvIGZpZ3VyZSBvdXQgaWYgdGhpcyB3YXMgYWN0dWFsbHkgYW4gZXJyb3IgZnJvbVxuICAgICAgICAvLyBNb25nbywgb3IganVzdCBjbGllbnQtc2lkZSAoaW5jbHVkaW5nIG91ciBvd24gdGltZW91dCBlcnJvcikuIEFoXG4gICAgICAgIC8vIHdlbGwuIEJ1dCBlaXRoZXIgd2F5LCB3ZSBuZWVkIHRvIHJldHJ5IHRoZSBjdXJzb3IgKHVubGVzcyB0aGUgZmFpbHVyZVxuICAgICAgICAvLyB3YXMgYmVjYXVzZSB0aGUgb2JzZXJ2ZSBnb3Qgc3RvcHBlZCkuXG4gICAgICAgIGRvYyA9IG51bGw7XG4gICAgICB9XG4gICAgICAvLyBTaW5jZSB3ZSBhd2FpdGVkIGEgcHJvbWlzZSBhYm92ZSwgd2UgbmVlZCB0byBjaGVjayBhZ2FpbiB0byBzZWUgaWZcbiAgICAgIC8vIHdlJ3ZlIGJlZW4gc3RvcHBlZCBiZWZvcmUgY2FsbGluZyB0aGUgY2FsbGJhY2suXG4gICAgICBpZiAoc3RvcHBlZClcbiAgICAgICAgcmV0dXJuO1xuICAgICAgaWYgKGRvYykge1xuICAgICAgICAvLyBJZiBhIHRhaWxhYmxlIGN1cnNvciBjb250YWlucyBhIFwidHNcIiBmaWVsZCwgdXNlIGl0IHRvIHJlY3JlYXRlIHRoZVxuICAgICAgICAvLyBjdXJzb3Igb24gZXJyb3IuIChcInRzXCIgaXMgYSBzdGFuZGFyZCB0aGF0IE1vbmdvIHVzZXMgaW50ZXJuYWxseSBmb3JcbiAgICAgICAgLy8gdGhlIG9wbG9nLCBhbmQgdGhlcmUncyBhIHNwZWNpYWwgZmxhZyB0aGF0IGxldHMgeW91IGRvIGJpbmFyeSBzZWFyY2hcbiAgICAgICAgLy8gb24gaXQgaW5zdGVhZCBvZiBuZWVkaW5nIHRvIHVzZSBhbiBpbmRleC4pXG4gICAgICAgIGxhc3RUUyA9IGRvYy50cztcbiAgICAgICAgZG9jQ2FsbGJhY2soZG9jKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBuZXdTZWxlY3RvciA9IF8uY2xvbmUoY3Vyc29yRGVzY3JpcHRpb24uc2VsZWN0b3IpO1xuICAgICAgICBpZiAobGFzdFRTKSB7XG4gICAgICAgICAgbmV3U2VsZWN0b3IudHMgPSB7JGd0OiBsYXN0VFN9O1xuICAgICAgICB9XG4gICAgICAgIGN1cnNvciA9IHNlbGYuX2NyZWF0ZVN5bmNocm9ub3VzQ3Vyc29yKG5ldyBDdXJzb3JEZXNjcmlwdGlvbihcbiAgICAgICAgICBjdXJzb3JEZXNjcmlwdGlvbi5jb2xsZWN0aW9uTmFtZSxcbiAgICAgICAgICBuZXdTZWxlY3RvcixcbiAgICAgICAgICBjdXJzb3JEZXNjcmlwdGlvbi5vcHRpb25zKSk7XG4gICAgICAgIC8vIE1vbmdvIGZhaWxvdmVyIHRha2VzIG1hbnkgc2Vjb25kcy4gIFJldHJ5IGluIGEgYml0LiAgKFdpdGhvdXQgdGhpc1xuICAgICAgICAvLyBzZXRUaW1lb3V0LCB3ZSBwZWcgdGhlIENQVSBhdCAxMDAlIGFuZCBuZXZlciBub3RpY2UgdGhlIGFjdHVhbFxuICAgICAgICAvLyBmYWlsb3Zlci5cbiAgICAgICAgTWV0ZW9yLnNldFRpbWVvdXQobG9vcCwgMTAwKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIE1ldGVvci5kZWZlcihsb29wKTtcblxuICByZXR1cm4ge1xuICAgIHN0b3A6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHN0b3BwZWQgPSB0cnVlO1xuICAgICAgY3Vyc29yLmNsb3NlKCk7XG4gICAgfVxuICB9O1xufTtcblxuTW9uZ29Db25uZWN0aW9uLnByb3RvdHlwZS5fb2JzZXJ2ZUNoYW5nZXMgPSBmdW5jdGlvbiAoXG4gICAgY3Vyc29yRGVzY3JpcHRpb24sIG9yZGVyZWQsIGNhbGxiYWNrcykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgaWYgKGN1cnNvckRlc2NyaXB0aW9uLm9wdGlvbnMudGFpbGFibGUpIHtcbiAgICByZXR1cm4gc2VsZi5fb2JzZXJ2ZUNoYW5nZXNUYWlsYWJsZShjdXJzb3JEZXNjcmlwdGlvbiwgb3JkZXJlZCwgY2FsbGJhY2tzKTtcbiAgfVxuXG4gIC8vIFlvdSBtYXkgbm90IGZpbHRlciBvdXQgX2lkIHdoZW4gb2JzZXJ2aW5nIGNoYW5nZXMsIGJlY2F1c2UgdGhlIGlkIGlzIGEgY29yZVxuICAvLyBwYXJ0IG9mIHRoZSBvYnNlcnZlQ2hhbmdlcyBBUEkuXG4gIGlmIChjdXJzb3JEZXNjcmlwdGlvbi5vcHRpb25zLmZpZWxkcyAmJlxuICAgICAgKGN1cnNvckRlc2NyaXB0aW9uLm9wdGlvbnMuZmllbGRzLl9pZCA9PT0gMCB8fFxuICAgICAgIGN1cnNvckRlc2NyaXB0aW9uLm9wdGlvbnMuZmllbGRzLl9pZCA9PT0gZmFsc2UpKSB7XG4gICAgdGhyb3cgRXJyb3IoXCJZb3UgbWF5IG5vdCBvYnNlcnZlIGEgY3Vyc29yIHdpdGgge2ZpZWxkczoge19pZDogMH19XCIpO1xuICB9XG5cbiAgdmFyIG9ic2VydmVLZXkgPSBFSlNPTi5zdHJpbmdpZnkoXG4gICAgXy5leHRlbmQoe29yZGVyZWQ6IG9yZGVyZWR9LCBjdXJzb3JEZXNjcmlwdGlvbikpO1xuXG4gIHZhciBtdWx0aXBsZXhlciwgb2JzZXJ2ZURyaXZlcjtcbiAgdmFyIGZpcnN0SGFuZGxlID0gZmFsc2U7XG5cbiAgLy8gRmluZCBhIG1hdGNoaW5nIE9ic2VydmVNdWx0aXBsZXhlciwgb3IgY3JlYXRlIGEgbmV3IG9uZS4gVGhpcyBuZXh0IGJsb2NrIGlzXG4gIC8vIGd1YXJhbnRlZWQgdG8gbm90IHlpZWxkIChhbmQgaXQgZG9lc24ndCBjYWxsIGFueXRoaW5nIHRoYXQgY2FuIG9ic2VydmUgYVxuICAvLyBuZXcgcXVlcnkpLCBzbyBubyBvdGhlciBjYWxscyB0byB0aGlzIGZ1bmN0aW9uIGNhbiBpbnRlcmxlYXZlIHdpdGggaXQuXG4gIE1ldGVvci5fbm9ZaWVsZHNBbGxvd2VkKGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoXy5oYXMoc2VsZi5fb2JzZXJ2ZU11bHRpcGxleGVycywgb2JzZXJ2ZUtleSkpIHtcbiAgICAgIG11bHRpcGxleGVyID0gc2VsZi5fb2JzZXJ2ZU11bHRpcGxleGVyc1tvYnNlcnZlS2V5XTtcbiAgICB9IGVsc2Uge1xuICAgICAgZmlyc3RIYW5kbGUgPSB0cnVlO1xuICAgICAgLy8gQ3JlYXRlIGEgbmV3IE9ic2VydmVNdWx0aXBsZXhlci5cbiAgICAgIG11bHRpcGxleGVyID0gbmV3IE9ic2VydmVNdWx0aXBsZXhlcih7XG4gICAgICAgIG9yZGVyZWQ6IG9yZGVyZWQsXG4gICAgICAgIG9uU3RvcDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGRlbGV0ZSBzZWxmLl9vYnNlcnZlTXVsdGlwbGV4ZXJzW29ic2VydmVLZXldO1xuICAgICAgICAgIG9ic2VydmVEcml2ZXIuc3RvcCgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHNlbGYuX29ic2VydmVNdWx0aXBsZXhlcnNbb2JzZXJ2ZUtleV0gPSBtdWx0aXBsZXhlcjtcbiAgICB9XG4gIH0pO1xuXG4gIHZhciBvYnNlcnZlSGFuZGxlID0gbmV3IE9ic2VydmVIYW5kbGUobXVsdGlwbGV4ZXIsIGNhbGxiYWNrcyk7XG5cbiAgaWYgKGZpcnN0SGFuZGxlKSB7XG4gICAgdmFyIG1hdGNoZXIsIHNvcnRlcjtcbiAgICB2YXIgY2FuVXNlT3Bsb2cgPSBfLmFsbChbXG4gICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIEF0IGEgYmFyZSBtaW5pbXVtLCB1c2luZyB0aGUgb3Bsb2cgcmVxdWlyZXMgdXMgdG8gaGF2ZSBhbiBvcGxvZywgdG9cbiAgICAgICAgLy8gd2FudCB1bm9yZGVyZWQgY2FsbGJhY2tzLCBhbmQgdG8gbm90IHdhbnQgYSBjYWxsYmFjayBvbiB0aGUgcG9sbHNcbiAgICAgICAgLy8gdGhhdCB3b24ndCBoYXBwZW4uXG4gICAgICAgIHJldHVybiBzZWxmLl9vcGxvZ0hhbmRsZSAmJiAhb3JkZXJlZCAmJlxuICAgICAgICAgICFjYWxsYmFja3MuX3Rlc3RPbmx5UG9sbENhbGxiYWNrO1xuICAgICAgfSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBXZSBuZWVkIHRvIGJlIGFibGUgdG8gY29tcGlsZSB0aGUgc2VsZWN0b3IuIEZhbGwgYmFjayB0byBwb2xsaW5nIGZvclxuICAgICAgICAvLyBzb21lIG5ld2ZhbmdsZWQgJHNlbGVjdG9yIHRoYXQgbWluaW1vbmdvIGRvZXNuJ3Qgc3VwcG9ydCB5ZXQuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgbWF0Y2hlciA9IG5ldyBNaW5pbW9uZ28uTWF0Y2hlcihjdXJzb3JEZXNjcmlwdGlvbi5zZWxlY3Rvcik7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAvLyBYWFggbWFrZSBhbGwgY29tcGlsYXRpb24gZXJyb3JzIE1pbmltb25nb0Vycm9yIG9yIHNvbWV0aGluZ1xuICAgICAgICAgIC8vICAgICBzbyB0aGF0IHRoaXMgZG9lc24ndCBpZ25vcmUgdW5yZWxhdGVkIGV4Y2VwdGlvbnNcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gLi4uIGFuZCB0aGUgc2VsZWN0b3IgaXRzZWxmIG5lZWRzIHRvIHN1cHBvcnQgb3Bsb2cuXG4gICAgICAgIHJldHVybiBPcGxvZ09ic2VydmVEcml2ZXIuY3Vyc29yU3VwcG9ydGVkKGN1cnNvckRlc2NyaXB0aW9uLCBtYXRjaGVyKTtcbiAgICAgIH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gQW5kIHdlIG5lZWQgdG8gYmUgYWJsZSB0byBjb21waWxlIHRoZSBzb3J0LCBpZiBhbnkuICBlZywgY2FuJ3QgYmVcbiAgICAgICAgLy8geyRuYXR1cmFsOiAxfS5cbiAgICAgICAgaWYgKCFjdXJzb3JEZXNjcmlwdGlvbi5vcHRpb25zLnNvcnQpXG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgc29ydGVyID0gbmV3IE1pbmltb25nby5Tb3J0ZXIoY3Vyc29yRGVzY3JpcHRpb24ub3B0aW9ucy5zb3J0KTtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIC8vIFhYWCBtYWtlIGFsbCBjb21waWxhdGlvbiBlcnJvcnMgTWluaW1vbmdvRXJyb3Igb3Igc29tZXRoaW5nXG4gICAgICAgICAgLy8gICAgIHNvIHRoYXQgdGhpcyBkb2Vzbid0IGlnbm9yZSB1bnJlbGF0ZWQgZXhjZXB0aW9uc1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfV0sIGZ1bmN0aW9uIChmKSB7IHJldHVybiBmKCk7IH0pOyAgLy8gaW52b2tlIGVhY2ggZnVuY3Rpb25cblxuICAgIHZhciBkcml2ZXJDbGFzcyA9IGNhblVzZU9wbG9nID8gT3Bsb2dPYnNlcnZlRHJpdmVyIDogUG9sbGluZ09ic2VydmVEcml2ZXI7XG4gICAgb2JzZXJ2ZURyaXZlciA9IG5ldyBkcml2ZXJDbGFzcyh7XG4gICAgICBjdXJzb3JEZXNjcmlwdGlvbjogY3Vyc29yRGVzY3JpcHRpb24sXG4gICAgICBtb25nb0hhbmRsZTogc2VsZixcbiAgICAgIG11bHRpcGxleGVyOiBtdWx0aXBsZXhlcixcbiAgICAgIG9yZGVyZWQ6IG9yZGVyZWQsXG4gICAgICBtYXRjaGVyOiBtYXRjaGVyLCAgLy8gaWdub3JlZCBieSBwb2xsaW5nXG4gICAgICBzb3J0ZXI6IHNvcnRlciwgIC8vIGlnbm9yZWQgYnkgcG9sbGluZ1xuICAgICAgX3Rlc3RPbmx5UG9sbENhbGxiYWNrOiBjYWxsYmFja3MuX3Rlc3RPbmx5UG9sbENhbGxiYWNrXG4gICAgfSk7XG5cbiAgICAvLyBUaGlzIGZpZWxkIGlzIG9ubHkgc2V0IGZvciB1c2UgaW4gdGVzdHMuXG4gICAgbXVsdGlwbGV4ZXIuX29ic2VydmVEcml2ZXIgPSBvYnNlcnZlRHJpdmVyO1xuICB9XG5cbiAgLy8gQmxvY2tzIHVudGlsIHRoZSBpbml0aWFsIGFkZHMgaGF2ZSBiZWVuIHNlbnQuXG4gIG11bHRpcGxleGVyLmFkZEhhbmRsZUFuZFNlbmRJbml0aWFsQWRkcyhvYnNlcnZlSGFuZGxlKTtcblxuICByZXR1cm4gb2JzZXJ2ZUhhbmRsZTtcbn07XG5cbi8vIExpc3RlbiBmb3IgdGhlIGludmFsaWRhdGlvbiBtZXNzYWdlcyB0aGF0IHdpbGwgdHJpZ2dlciB1cyB0byBwb2xsIHRoZVxuLy8gZGF0YWJhc2UgZm9yIGNoYW5nZXMuIElmIHRoaXMgc2VsZWN0b3Igc3BlY2lmaWVzIHNwZWNpZmljIElEcywgc3BlY2lmeSB0aGVtXG4vLyBoZXJlLCBzbyB0aGF0IHVwZGF0ZXMgdG8gZGlmZmVyZW50IHNwZWNpZmljIElEcyBkb24ndCBjYXVzZSB1cyB0byBwb2xsLlxuLy8gbGlzdGVuQ2FsbGJhY2sgaXMgdGhlIHNhbWUga2luZCBvZiAobm90aWZpY2F0aW9uLCBjb21wbGV0ZSkgY2FsbGJhY2sgcGFzc2VkXG4vLyB0byBJbnZhbGlkYXRpb25Dcm9zc2Jhci5saXN0ZW4uXG5cbmxpc3RlbkFsbCA9IGZ1bmN0aW9uIChjdXJzb3JEZXNjcmlwdGlvbiwgbGlzdGVuQ2FsbGJhY2spIHtcbiAgdmFyIGxpc3RlbmVycyA9IFtdO1xuICBmb3JFYWNoVHJpZ2dlcihjdXJzb3JEZXNjcmlwdGlvbiwgZnVuY3Rpb24gKHRyaWdnZXIpIHtcbiAgICBsaXN0ZW5lcnMucHVzaChERFBTZXJ2ZXIuX0ludmFsaWRhdGlvbkNyb3NzYmFyLmxpc3RlbihcbiAgICAgIHRyaWdnZXIsIGxpc3RlbkNhbGxiYWNrKSk7XG4gIH0pO1xuXG4gIHJldHVybiB7XG4gICAgc3RvcDogZnVuY3Rpb24gKCkge1xuICAgICAgXy5lYWNoKGxpc3RlbmVycywgZnVuY3Rpb24gKGxpc3RlbmVyKSB7XG4gICAgICAgIGxpc3RlbmVyLnN0b3AoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbn07XG5cbmZvckVhY2hUcmlnZ2VyID0gZnVuY3Rpb24gKGN1cnNvckRlc2NyaXB0aW9uLCB0cmlnZ2VyQ2FsbGJhY2spIHtcbiAgdmFyIGtleSA9IHtjb2xsZWN0aW9uOiBjdXJzb3JEZXNjcmlwdGlvbi5jb2xsZWN0aW9uTmFtZX07XG4gIHZhciBzcGVjaWZpY0lkcyA9IExvY2FsQ29sbGVjdGlvbi5faWRzTWF0Y2hlZEJ5U2VsZWN0b3IoXG4gICAgY3Vyc29yRGVzY3JpcHRpb24uc2VsZWN0b3IpO1xuICBpZiAoc3BlY2lmaWNJZHMpIHtcbiAgICBfLmVhY2goc3BlY2lmaWNJZHMsIGZ1bmN0aW9uIChpZCkge1xuICAgICAgdHJpZ2dlckNhbGxiYWNrKF8uZXh0ZW5kKHtpZDogaWR9LCBrZXkpKTtcbiAgICB9KTtcbiAgICB0cmlnZ2VyQ2FsbGJhY2soXy5leHRlbmQoe2Ryb3BDb2xsZWN0aW9uOiB0cnVlLCBpZDogbnVsbH0sIGtleSkpO1xuICB9IGVsc2Uge1xuICAgIHRyaWdnZXJDYWxsYmFjayhrZXkpO1xuICB9XG4gIC8vIEV2ZXJ5b25lIGNhcmVzIGFib3V0IHRoZSBkYXRhYmFzZSBiZWluZyBkcm9wcGVkLlxuICB0cmlnZ2VyQ2FsbGJhY2soeyBkcm9wRGF0YWJhc2U6IHRydWUgfSk7XG59O1xuXG4vLyBvYnNlcnZlQ2hhbmdlcyBmb3IgdGFpbGFibGUgY3Vyc29ycyBvbiBjYXBwZWQgY29sbGVjdGlvbnMuXG4vL1xuLy8gU29tZSBkaWZmZXJlbmNlcyBmcm9tIG5vcm1hbCBjdXJzb3JzOlxuLy8gICAtIFdpbGwgbmV2ZXIgcHJvZHVjZSBhbnl0aGluZyBvdGhlciB0aGFuICdhZGRlZCcgb3IgJ2FkZGVkQmVmb3JlJy4gSWYgeW91XG4vLyAgICAgZG8gdXBkYXRlIGEgZG9jdW1lbnQgdGhhdCBoYXMgYWxyZWFkeSBiZWVuIHByb2R1Y2VkLCB0aGlzIHdpbGwgbm90IG5vdGljZVxuLy8gICAgIGl0LlxuLy8gICAtIElmIHlvdSBkaXNjb25uZWN0IGFuZCByZWNvbm5lY3QgZnJvbSBNb25nbywgaXQgd2lsbCBlc3NlbnRpYWxseSByZXN0YXJ0XG4vLyAgICAgdGhlIHF1ZXJ5LCB3aGljaCB3aWxsIGxlYWQgdG8gZHVwbGljYXRlIHJlc3VsdHMuIFRoaXMgaXMgcHJldHR5IGJhZCxcbi8vICAgICBidXQgaWYgeW91IGluY2x1ZGUgYSBmaWVsZCBjYWxsZWQgJ3RzJyB3aGljaCBpcyBpbnNlcnRlZCBhc1xuLy8gICAgIG5ldyBNb25nb0ludGVybmFscy5Nb25nb1RpbWVzdGFtcCgwLCAwKSAod2hpY2ggaXMgaW5pdGlhbGl6ZWQgdG8gdGhlXG4vLyAgICAgY3VycmVudCBNb25nby1zdHlsZSB0aW1lc3RhbXApLCB3ZSdsbCBiZSBhYmxlIHRvIGZpbmQgdGhlIHBsYWNlIHRvXG4vLyAgICAgcmVzdGFydCBwcm9wZXJseS4gKFRoaXMgZmllbGQgaXMgc3BlY2lmaWNhbGx5IHVuZGVyc3Rvb2QgYnkgTW9uZ28gd2l0aCBhblxuLy8gICAgIG9wdGltaXphdGlvbiB3aGljaCBhbGxvd3MgaXQgdG8gZmluZCB0aGUgcmlnaHQgcGxhY2UgdG8gc3RhcnQgd2l0aG91dFxuLy8gICAgIGFuIGluZGV4IG9uIHRzLiBJdCdzIGhvdyB0aGUgb3Bsb2cgd29ya3MuKVxuLy8gICAtIE5vIGNhbGxiYWNrcyBhcmUgdHJpZ2dlcmVkIHN5bmNocm9ub3VzbHkgd2l0aCB0aGUgY2FsbCAodGhlcmUncyBub1xuLy8gICAgIGRpZmZlcmVudGlhdGlvbiBiZXR3ZWVuIFwiaW5pdGlhbCBkYXRhXCIgYW5kIFwibGF0ZXIgY2hhbmdlc1wiOyBldmVyeXRoaW5nXG4vLyAgICAgdGhhdCBtYXRjaGVzIHRoZSBxdWVyeSBnZXRzIHNlbnQgYXN5bmNocm9ub3VzbHkpLlxuLy8gICAtIERlLWR1cGxpY2F0aW9uIGlzIG5vdCBpbXBsZW1lbnRlZC5cbi8vICAgLSBEb2VzIG5vdCB5ZXQgaW50ZXJhY3Qgd2l0aCB0aGUgd3JpdGUgZmVuY2UuIFByb2JhYmx5LCB0aGlzIHNob3VsZCB3b3JrIGJ5XG4vLyAgICAgaWdub3JpbmcgcmVtb3ZlcyAod2hpY2ggZG9uJ3Qgd29yayBvbiBjYXBwZWQgY29sbGVjdGlvbnMpIGFuZCB1cGRhdGVzXG4vLyAgICAgKHdoaWNoIGRvbid0IGFmZmVjdCB0YWlsYWJsZSBjdXJzb3JzKSwgYW5kIGp1c3Qga2VlcGluZyB0cmFjayBvZiB0aGUgSURcbi8vICAgICBvZiB0aGUgaW5zZXJ0ZWQgb2JqZWN0LCBhbmQgY2xvc2luZyB0aGUgd3JpdGUgZmVuY2Ugb25jZSB5b3UgZ2V0IHRvIHRoYXRcbi8vICAgICBJRCAob3IgdGltZXN0YW1wPykuICBUaGlzIGRvZXNuJ3Qgd29yayB3ZWxsIGlmIHRoZSBkb2N1bWVudCBkb2Vzbid0IG1hdGNoXG4vLyAgICAgdGhlIHF1ZXJ5LCB0aG91Z2guICBPbiB0aGUgb3RoZXIgaGFuZCwgdGhlIHdyaXRlIGZlbmNlIGNhbiBjbG9zZVxuLy8gICAgIGltbWVkaWF0ZWx5IGlmIGl0IGRvZXMgbm90IG1hdGNoIHRoZSBxdWVyeS4gU28gaWYgd2UgdHJ1c3QgbWluaW1vbmdvXG4vLyAgICAgZW5vdWdoIHRvIGFjY3VyYXRlbHkgZXZhbHVhdGUgdGhlIHF1ZXJ5IGFnYWluc3QgdGhlIHdyaXRlIGZlbmNlLCB3ZVxuLy8gICAgIHNob3VsZCBiZSBhYmxlIHRvIGRvIHRoaXMuLi4gIE9mIGNvdXJzZSwgbWluaW1vbmdvIGRvZXNuJ3QgZXZlbiBzdXBwb3J0XG4vLyAgICAgTW9uZ28gVGltZXN0YW1wcyB5ZXQuXG5Nb25nb0Nvbm5lY3Rpb24ucHJvdG90eXBlLl9vYnNlcnZlQ2hhbmdlc1RhaWxhYmxlID0gZnVuY3Rpb24gKFxuICAgIGN1cnNvckRlc2NyaXB0aW9uLCBvcmRlcmVkLCBjYWxsYmFja3MpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIC8vIFRhaWxhYmxlIGN1cnNvcnMgb25seSBldmVyIGNhbGwgYWRkZWQvYWRkZWRCZWZvcmUgY2FsbGJhY2tzLCBzbyBpdCdzIGFuXG4gIC8vIGVycm9yIGlmIHlvdSBkaWRuJ3QgcHJvdmlkZSB0aGVtLlxuICBpZiAoKG9yZGVyZWQgJiYgIWNhbGxiYWNrcy5hZGRlZEJlZm9yZSkgfHxcbiAgICAgICghb3JkZXJlZCAmJiAhY2FsbGJhY2tzLmFkZGVkKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkNhbid0IG9ic2VydmUgYW4gXCIgKyAob3JkZXJlZCA/IFwib3JkZXJlZFwiIDogXCJ1bm9yZGVyZWRcIilcbiAgICAgICAgICAgICAgICAgICAgKyBcIiB0YWlsYWJsZSBjdXJzb3Igd2l0aG91dCBhIFwiXG4gICAgICAgICAgICAgICAgICAgICsgKG9yZGVyZWQgPyBcImFkZGVkQmVmb3JlXCIgOiBcImFkZGVkXCIpICsgXCIgY2FsbGJhY2tcIik7XG4gIH1cblxuICByZXR1cm4gc2VsZi50YWlsKGN1cnNvckRlc2NyaXB0aW9uLCBmdW5jdGlvbiAoZG9jKSB7XG4gICAgdmFyIGlkID0gZG9jLl9pZDtcbiAgICBkZWxldGUgZG9jLl9pZDtcbiAgICAvLyBUaGUgdHMgaXMgYW4gaW1wbGVtZW50YXRpb24gZGV0YWlsLiBIaWRlIGl0LlxuICAgIGRlbGV0ZSBkb2MudHM7XG4gICAgaWYgKG9yZGVyZWQpIHtcbiAgICAgIGNhbGxiYWNrcy5hZGRlZEJlZm9yZShpZCwgZG9jLCBudWxsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2FsbGJhY2tzLmFkZGVkKGlkLCBkb2MpO1xuICAgIH1cbiAgfSk7XG59O1xuXG4vLyBYWFggV2UgcHJvYmFibHkgbmVlZCB0byBmaW5kIGEgYmV0dGVyIHdheSB0byBleHBvc2UgdGhpcy4gUmlnaHQgbm93XG4vLyBpdCdzIG9ubHkgdXNlZCBieSB0ZXN0cywgYnV0IGluIGZhY3QgeW91IG5lZWQgaXQgaW4gbm9ybWFsXG4vLyBvcGVyYXRpb24gdG8gaW50ZXJhY3Qgd2l0aCBjYXBwZWQgY29sbGVjdGlvbnMuXG5Nb25nb0ludGVybmFscy5Nb25nb1RpbWVzdGFtcCA9IE1vbmdvREIuVGltZXN0YW1wO1xuXG5Nb25nb0ludGVybmFscy5Db25uZWN0aW9uID0gTW9uZ29Db25uZWN0aW9uO1xuIiwidmFyIEZ1dHVyZSA9IE5wbS5yZXF1aXJlKCdmaWJlcnMvZnV0dXJlJyk7XG5cbmltcG9ydCB7IE5wbU1vZHVsZU1vbmdvZGIgfSBmcm9tIFwibWV0ZW9yL25wbS1tb25nb1wiO1xuY29uc3QgeyBUaW1lc3RhbXAgfSA9IE5wbU1vZHVsZU1vbmdvZGI7XG5cbk9QTE9HX0NPTExFQ1RJT04gPSAnb3Bsb2cucnMnO1xuXG52YXIgVE9PX0ZBUl9CRUhJTkQgPSBwcm9jZXNzLmVudi5NRVRFT1JfT1BMT0dfVE9PX0ZBUl9CRUhJTkQgfHwgMjAwMDtcbnZhciBUQUlMX1RJTUVPVVQgPSArcHJvY2Vzcy5lbnYuTUVURU9SX09QTE9HX1RBSUxfVElNRU9VVCB8fCAzMDAwMDtcblxudmFyIHNob3dUUyA9IGZ1bmN0aW9uICh0cykge1xuICByZXR1cm4gXCJUaW1lc3RhbXAoXCIgKyB0cy5nZXRIaWdoQml0cygpICsgXCIsIFwiICsgdHMuZ2V0TG93Qml0cygpICsgXCIpXCI7XG59O1xuXG5pZEZvck9wID0gZnVuY3Rpb24gKG9wKSB7XG4gIGlmIChvcC5vcCA9PT0gJ2QnKVxuICAgIHJldHVybiBvcC5vLl9pZDtcbiAgZWxzZSBpZiAob3Aub3AgPT09ICdpJylcbiAgICByZXR1cm4gb3Auby5faWQ7XG4gIGVsc2UgaWYgKG9wLm9wID09PSAndScpXG4gICAgcmV0dXJuIG9wLm8yLl9pZDtcbiAgZWxzZSBpZiAob3Aub3AgPT09ICdjJylcbiAgICB0aHJvdyBFcnJvcihcIk9wZXJhdG9yICdjJyBkb2Vzbid0IHN1cHBseSBhbiBvYmplY3Qgd2l0aCBpZDogXCIgK1xuICAgICAgICAgICAgICAgIEVKU09OLnN0cmluZ2lmeShvcCkpO1xuICBlbHNlXG4gICAgdGhyb3cgRXJyb3IoXCJVbmtub3duIG9wOiBcIiArIEVKU09OLnN0cmluZ2lmeShvcCkpO1xufTtcblxuT3Bsb2dIYW5kbGUgPSBmdW5jdGlvbiAob3Bsb2dVcmwsIGRiTmFtZSkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHNlbGYuX29wbG9nVXJsID0gb3Bsb2dVcmw7XG4gIHNlbGYuX2RiTmFtZSA9IGRiTmFtZTtcblxuICBzZWxmLl9vcGxvZ0xhc3RFbnRyeUNvbm5lY3Rpb24gPSBudWxsO1xuICBzZWxmLl9vcGxvZ1RhaWxDb25uZWN0aW9uID0gbnVsbDtcbiAgc2VsZi5fc3RvcHBlZCA9IGZhbHNlO1xuICBzZWxmLl90YWlsSGFuZGxlID0gbnVsbDtcbiAgc2VsZi5fcmVhZHlGdXR1cmUgPSBuZXcgRnV0dXJlKCk7XG4gIHNlbGYuX2Nyb3NzYmFyID0gbmV3IEREUFNlcnZlci5fQ3Jvc3NiYXIoe1xuICAgIGZhY3RQYWNrYWdlOiBcIm1vbmdvLWxpdmVkYXRhXCIsIGZhY3ROYW1lOiBcIm9wbG9nLXdhdGNoZXJzXCJcbiAgfSk7XG4gIHNlbGYuX2Jhc2VPcGxvZ1NlbGVjdG9yID0ge1xuICAgIG5zOiBuZXcgUmVnRXhwKFwiXig/OlwiICsgW1xuICAgICAgTWV0ZW9yLl9lc2NhcGVSZWdFeHAoc2VsZi5fZGJOYW1lICsgXCIuXCIpLFxuICAgICAgTWV0ZW9yLl9lc2NhcGVSZWdFeHAoXCJhZG1pbi4kY21kXCIpLFxuICAgIF0uam9pbihcInxcIikgKyBcIilcIiksXG5cbiAgICAkb3I6IFtcbiAgICAgIHsgb3A6IHsgJGluOiBbJ2knLCAndScsICdkJ10gfSB9LFxuICAgICAgLy8gZHJvcCBjb2xsZWN0aW9uXG4gICAgICB7IG9wOiAnYycsICdvLmRyb3AnOiB7ICRleGlzdHM6IHRydWUgfSB9LFxuICAgICAgeyBvcDogJ2MnLCAnby5kcm9wRGF0YWJhc2UnOiAxIH0sXG4gICAgICB7IG9wOiAnYycsICdvLmFwcGx5T3BzJzogeyAkZXhpc3RzOiB0cnVlIH0gfSxcbiAgICBdXG4gIH07XG5cbiAgLy8gRGF0YSBzdHJ1Y3R1cmVzIHRvIHN1cHBvcnQgd2FpdFVudGlsQ2F1Z2h0VXAoKS4gRWFjaCBvcGxvZyBlbnRyeSBoYXMgYVxuICAvLyBNb25nb1RpbWVzdGFtcCBvYmplY3Qgb24gaXQgKHdoaWNoIGlzIG5vdCB0aGUgc2FtZSBhcyBhIERhdGUgLS0tIGl0J3MgYVxuICAvLyBjb21iaW5hdGlvbiBvZiB0aW1lIGFuZCBhbiBpbmNyZW1lbnRpbmcgY291bnRlcjsgc2VlXG4gIC8vIGh0dHA6Ly9kb2NzLm1vbmdvZGIub3JnL21hbnVhbC9yZWZlcmVuY2UvYnNvbi10eXBlcy8jdGltZXN0YW1wcykuXG4gIC8vXG4gIC8vIF9jYXRjaGluZ1VwRnV0dXJlcyBpcyBhbiBhcnJheSBvZiB7dHM6IE1vbmdvVGltZXN0YW1wLCBmdXR1cmU6IEZ1dHVyZX1cbiAgLy8gb2JqZWN0cywgc29ydGVkIGJ5IGFzY2VuZGluZyB0aW1lc3RhbXAuIF9sYXN0UHJvY2Vzc2VkVFMgaXMgdGhlXG4gIC8vIE1vbmdvVGltZXN0YW1wIG9mIHRoZSBsYXN0IG9wbG9nIGVudHJ5IHdlJ3ZlIHByb2Nlc3NlZC5cbiAgLy9cbiAgLy8gRWFjaCB0aW1lIHdlIGNhbGwgd2FpdFVudGlsQ2F1Z2h0VXAsIHdlIHRha2UgYSBwZWVrIGF0IHRoZSBmaW5hbCBvcGxvZ1xuICAvLyBlbnRyeSBpbiB0aGUgZGIuICBJZiB3ZSd2ZSBhbHJlYWR5IHByb2Nlc3NlZCBpdCAoaWUsIGl0IGlzIG5vdCBncmVhdGVyIHRoYW5cbiAgLy8gX2xhc3RQcm9jZXNzZWRUUyksIHdhaXRVbnRpbENhdWdodFVwIGltbWVkaWF0ZWx5IHJldHVybnMuIE90aGVyd2lzZSxcbiAgLy8gd2FpdFVudGlsQ2F1Z2h0VXAgbWFrZXMgYSBuZXcgRnV0dXJlIGFuZCBpbnNlcnRzIGl0IGFsb25nIHdpdGggdGhlIGZpbmFsXG4gIC8vIHRpbWVzdGFtcCBlbnRyeSB0aGF0IGl0IHJlYWQsIGludG8gX2NhdGNoaW5nVXBGdXR1cmVzLiB3YWl0VW50aWxDYXVnaHRVcFxuICAvLyB0aGVuIHdhaXRzIG9uIHRoYXQgZnV0dXJlLCB3aGljaCBpcyByZXNvbHZlZCBvbmNlIF9sYXN0UHJvY2Vzc2VkVFMgaXNcbiAgLy8gaW5jcmVtZW50ZWQgdG8gYmUgcGFzdCBpdHMgdGltZXN0YW1wIGJ5IHRoZSB3b3JrZXIgZmliZXIuXG4gIC8vXG4gIC8vIFhYWCB1c2UgYSBwcmlvcml0eSBxdWV1ZSBvciBzb21ldGhpbmcgZWxzZSB0aGF0J3MgZmFzdGVyIHRoYW4gYW4gYXJyYXlcbiAgc2VsZi5fY2F0Y2hpbmdVcEZ1dHVyZXMgPSBbXTtcbiAgc2VsZi5fbGFzdFByb2Nlc3NlZFRTID0gbnVsbDtcblxuICBzZWxmLl9vblNraXBwZWRFbnRyaWVzSG9vayA9IG5ldyBIb29rKHtcbiAgICBkZWJ1Z1ByaW50RXhjZXB0aW9uczogXCJvblNraXBwZWRFbnRyaWVzIGNhbGxiYWNrXCJcbiAgfSk7XG5cbiAgc2VsZi5fZW50cnlRdWV1ZSA9IG5ldyBNZXRlb3IuX0RvdWJsZUVuZGVkUXVldWUoKTtcbiAgc2VsZi5fd29ya2VyQWN0aXZlID0gZmFsc2U7XG5cbiAgc2VsZi5fc3RhcnRUYWlsaW5nKCk7XG59O1xuXG5fLmV4dGVuZChPcGxvZ0hhbmRsZS5wcm90b3R5cGUsIHtcbiAgc3RvcDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBpZiAoc2VsZi5fc3RvcHBlZClcbiAgICAgIHJldHVybjtcbiAgICBzZWxmLl9zdG9wcGVkID0gdHJ1ZTtcbiAgICBpZiAoc2VsZi5fdGFpbEhhbmRsZSlcbiAgICAgIHNlbGYuX3RhaWxIYW5kbGUuc3RvcCgpO1xuICAgIC8vIFhYWCBzaG91bGQgY2xvc2UgY29ubmVjdGlvbnMgdG9vXG4gIH0sXG4gIG9uT3Bsb2dFbnRyeTogZnVuY3Rpb24gKHRyaWdnZXIsIGNhbGxiYWNrKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIGlmIChzZWxmLl9zdG9wcGVkKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2FsbGVkIG9uT3Bsb2dFbnRyeSBvbiBzdG9wcGVkIGhhbmRsZSFcIik7XG5cbiAgICAvLyBDYWxsaW5nIG9uT3Bsb2dFbnRyeSByZXF1aXJlcyB1cyB0byB3YWl0IGZvciB0aGUgdGFpbGluZyB0byBiZSByZWFkeS5cbiAgICBzZWxmLl9yZWFkeUZ1dHVyZS53YWl0KCk7XG5cbiAgICB2YXIgb3JpZ2luYWxDYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgIGNhbGxiYWNrID0gTWV0ZW9yLmJpbmRFbnZpcm9ubWVudChmdW5jdGlvbiAobm90aWZpY2F0aW9uKSB7XG4gICAgICBvcmlnaW5hbENhbGxiYWNrKG5vdGlmaWNhdGlvbik7XG4gICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgTWV0ZW9yLl9kZWJ1ZyhcIkVycm9yIGluIG9wbG9nIGNhbGxiYWNrXCIsIGVycik7XG4gICAgfSk7XG4gICAgdmFyIGxpc3RlbkhhbmRsZSA9IHNlbGYuX2Nyb3NzYmFyLmxpc3Rlbih0cmlnZ2VyLCBjYWxsYmFjayk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHN0b3A6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGlzdGVuSGFuZGxlLnN0b3AoKTtcbiAgICAgIH1cbiAgICB9O1xuICB9LFxuICAvLyBSZWdpc3RlciBhIGNhbGxiYWNrIHRvIGJlIGludm9rZWQgYW55IHRpbWUgd2Ugc2tpcCBvcGxvZyBlbnRyaWVzIChlZyxcbiAgLy8gYmVjYXVzZSB3ZSBhcmUgdG9vIGZhciBiZWhpbmQpLlxuICBvblNraXBwZWRFbnRyaWVzOiBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgaWYgKHNlbGYuX3N0b3BwZWQpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYWxsZWQgb25Ta2lwcGVkRW50cmllcyBvbiBzdG9wcGVkIGhhbmRsZSFcIik7XG4gICAgcmV0dXJuIHNlbGYuX29uU2tpcHBlZEVudHJpZXNIb29rLnJlZ2lzdGVyKGNhbGxiYWNrKTtcbiAgfSxcbiAgLy8gQ2FsbHMgYGNhbGxiYWNrYCBvbmNlIHRoZSBvcGxvZyBoYXMgYmVlbiBwcm9jZXNzZWQgdXAgdG8gYSBwb2ludCB0aGF0IGlzXG4gIC8vIHJvdWdobHkgXCJub3dcIjogc3BlY2lmaWNhbGx5LCBvbmNlIHdlJ3ZlIHByb2Nlc3NlZCBhbGwgb3BzIHRoYXQgYXJlXG4gIC8vIGN1cnJlbnRseSB2aXNpYmxlLlxuICAvLyBYWFggYmVjb21lIGNvbnZpbmNlZCB0aGF0IHRoaXMgaXMgYWN0dWFsbHkgc2FmZSBldmVuIGlmIG9wbG9nQ29ubmVjdGlvblxuICAvLyBpcyBzb21lIGtpbmQgb2YgcG9vbFxuICB3YWl0VW50aWxDYXVnaHRVcDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBpZiAoc2VsZi5fc3RvcHBlZClcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbGxlZCB3YWl0VW50aWxDYXVnaHRVcCBvbiBzdG9wcGVkIGhhbmRsZSFcIik7XG5cbiAgICAvLyBDYWxsaW5nIHdhaXRVbnRpbENhdWdodFVwIHJlcXVyaWVzIHVzIHRvIHdhaXQgZm9yIHRoZSBvcGxvZyBjb25uZWN0aW9uIHRvXG4gICAgLy8gYmUgcmVhZHkuXG4gICAgc2VsZi5fcmVhZHlGdXR1cmUud2FpdCgpO1xuICAgIHZhciBsYXN0RW50cnk7XG5cbiAgICB3aGlsZSAoIXNlbGYuX3N0b3BwZWQpIHtcbiAgICAgIC8vIFdlIG5lZWQgdG8gbWFrZSB0aGUgc2VsZWN0b3IgYXQgbGVhc3QgYXMgcmVzdHJpY3RpdmUgYXMgdGhlIGFjdHVhbFxuICAgICAgLy8gdGFpbGluZyBzZWxlY3RvciAoaWUsIHdlIG5lZWQgdG8gc3BlY2lmeSB0aGUgREIgbmFtZSkgb3IgZWxzZSB3ZSBtaWdodFxuICAgICAgLy8gZmluZCBhIFRTIHRoYXQgd29uJ3Qgc2hvdyB1cCBpbiB0aGUgYWN0dWFsIHRhaWwgc3RyZWFtLlxuICAgICAgdHJ5IHtcbiAgICAgICAgbGFzdEVudHJ5ID0gc2VsZi5fb3Bsb2dMYXN0RW50cnlDb25uZWN0aW9uLmZpbmRPbmUoXG4gICAgICAgICAgT1BMT0dfQ09MTEVDVElPTiwgc2VsZi5fYmFzZU9wbG9nU2VsZWN0b3IsXG4gICAgICAgICAge2ZpZWxkczoge3RzOiAxfSwgc29ydDogeyRuYXR1cmFsOiAtMX19KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIER1cmluZyBmYWlsb3ZlciAoZWcpIGlmIHdlIGdldCBhbiBleGNlcHRpb24gd2Ugc2hvdWxkIGxvZyBhbmQgcmV0cnlcbiAgICAgICAgLy8gaW5zdGVhZCBvZiBjcmFzaGluZy5cbiAgICAgICAgTWV0ZW9yLl9kZWJ1ZyhcIkdvdCBleGNlcHRpb24gd2hpbGUgcmVhZGluZyBsYXN0IGVudHJ5XCIsIGUpO1xuICAgICAgICBNZXRlb3IuX3NsZWVwRm9yTXMoMTAwKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc2VsZi5fc3RvcHBlZClcbiAgICAgIHJldHVybjtcblxuICAgIGlmICghbGFzdEVudHJ5KSB7XG4gICAgICAvLyBSZWFsbHksIG5vdGhpbmcgaW4gdGhlIG9wbG9nPyBXZWxsLCB3ZSd2ZSBwcm9jZXNzZWQgZXZlcnl0aGluZy5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgdHMgPSBsYXN0RW50cnkudHM7XG4gICAgaWYgKCF0cylcbiAgICAgIHRocm93IEVycm9yKFwib3Bsb2cgZW50cnkgd2l0aG91dCB0czogXCIgKyBFSlNPTi5zdHJpbmdpZnkobGFzdEVudHJ5KSk7XG5cbiAgICBpZiAoc2VsZi5fbGFzdFByb2Nlc3NlZFRTICYmIHRzLmxlc3NUaGFuT3JFcXVhbChzZWxmLl9sYXN0UHJvY2Vzc2VkVFMpKSB7XG4gICAgICAvLyBXZSd2ZSBhbHJlYWR5IGNhdWdodCB1cCB0byBoZXJlLlxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuXG4gICAgLy8gSW5zZXJ0IHRoZSBmdXR1cmUgaW50byBvdXIgbGlzdC4gQWxtb3N0IGFsd2F5cywgdGhpcyB3aWxsIGJlIGF0IHRoZSBlbmQsXG4gICAgLy8gYnV0IGl0J3MgY29uY2VpdmFibGUgdGhhdCBpZiB3ZSBmYWlsIG92ZXIgZnJvbSBvbmUgcHJpbWFyeSB0byBhbm90aGVyLFxuICAgIC8vIHRoZSBvcGxvZyBlbnRyaWVzIHdlIHNlZSB3aWxsIGdvIGJhY2t3YXJkcy5cbiAgICB2YXIgaW5zZXJ0QWZ0ZXIgPSBzZWxmLl9jYXRjaGluZ1VwRnV0dXJlcy5sZW5ndGg7XG4gICAgd2hpbGUgKGluc2VydEFmdGVyIC0gMSA+IDAgJiYgc2VsZi5fY2F0Y2hpbmdVcEZ1dHVyZXNbaW5zZXJ0QWZ0ZXIgLSAxXS50cy5ncmVhdGVyVGhhbih0cykpIHtcbiAgICAgIGluc2VydEFmdGVyLS07XG4gICAgfVxuICAgIHZhciBmID0gbmV3IEZ1dHVyZTtcbiAgICBzZWxmLl9jYXRjaGluZ1VwRnV0dXJlcy5zcGxpY2UoaW5zZXJ0QWZ0ZXIsIDAsIHt0czogdHMsIGZ1dHVyZTogZn0pO1xuICAgIGYud2FpdCgpO1xuICB9LFxuICBfc3RhcnRUYWlsaW5nOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIC8vIEZpcnN0LCBtYWtlIHN1cmUgdGhhdCB3ZSdyZSB0YWxraW5nIHRvIHRoZSBsb2NhbCBkYXRhYmFzZS5cbiAgICB2YXIgbW9uZ29kYlVyaSA9IE5wbS5yZXF1aXJlKCdtb25nb2RiLXVyaScpO1xuICAgIGlmIChtb25nb2RiVXJpLnBhcnNlKHNlbGYuX29wbG9nVXJsKS5kYXRhYmFzZSAhPT0gJ2xvY2FsJykge1xuICAgICAgdGhyb3cgRXJyb3IoXCIkTU9OR09fT1BMT0dfVVJMIG11c3QgYmUgc2V0IHRvIHRoZSAnbG9jYWwnIGRhdGFiYXNlIG9mIFwiICtcbiAgICAgICAgICAgICAgICAgIFwiYSBNb25nbyByZXBsaWNhIHNldFwiKTtcbiAgICB9XG5cbiAgICAvLyBXZSBtYWtlIHR3byBzZXBhcmF0ZSBjb25uZWN0aW9ucyB0byBNb25nby4gVGhlIE5vZGUgTW9uZ28gZHJpdmVyXG4gICAgLy8gaW1wbGVtZW50cyBhIG5haXZlIHJvdW5kLXJvYmluIGNvbm5lY3Rpb24gcG9vbDogZWFjaCBcImNvbm5lY3Rpb25cIiBpcyBhXG4gICAgLy8gcG9vbCBvZiBzZXZlcmFsICg1IGJ5IGRlZmF1bHQpIFRDUCBjb25uZWN0aW9ucywgYW5kIGVhY2ggcmVxdWVzdCBpc1xuICAgIC8vIHJvdGF0ZWQgdGhyb3VnaCB0aGUgcG9vbHMuIFRhaWxhYmxlIGN1cnNvciBxdWVyaWVzIGJsb2NrIG9uIHRoZSBzZXJ2ZXJcbiAgICAvLyB1bnRpbCB0aGVyZSBpcyBzb21lIGRhdGEgdG8gcmV0dXJuIChvciB1bnRpbCBhIGZldyBzZWNvbmRzIGhhdmVcbiAgICAvLyBwYXNzZWQpLiBTbyBpZiB0aGUgY29ubmVjdGlvbiBwb29sIHVzZWQgZm9yIHRhaWxpbmcgY3Vyc29ycyBpcyB0aGUgc2FtZVxuICAgIC8vIHBvb2wgdXNlZCBmb3Igb3RoZXIgcXVlcmllcywgdGhlIG90aGVyIHF1ZXJpZXMgd2lsbCBiZSBkZWxheWVkIGJ5IHNlY29uZHNcbiAgICAvLyAxLzUgb2YgdGhlIHRpbWUuXG4gICAgLy9cbiAgICAvLyBUaGUgdGFpbCBjb25uZWN0aW9uIHdpbGwgb25seSBldmVyIGJlIHJ1bm5pbmcgYSBzaW5nbGUgdGFpbCBjb21tYW5kLCBzb1xuICAgIC8vIGl0IG9ubHkgbmVlZHMgdG8gbWFrZSBvbmUgdW5kZXJseWluZyBUQ1AgY29ubmVjdGlvbi5cbiAgICBzZWxmLl9vcGxvZ1RhaWxDb25uZWN0aW9uID0gbmV3IE1vbmdvQ29ubmVjdGlvbihcbiAgICAgIHNlbGYuX29wbG9nVXJsLCB7cG9vbFNpemU6IDF9KTtcbiAgICAvLyBYWFggYmV0dGVyIGRvY3MsIGJ1dDogaXQncyB0byBnZXQgbW9ub3RvbmljIHJlc3VsdHNcbiAgICAvLyBYWFggaXMgaXQgc2FmZSB0byBzYXkgXCJpZiB0aGVyZSdzIGFuIGluIGZsaWdodCBxdWVyeSwganVzdCB1c2UgaXRzXG4gICAgLy8gICAgIHJlc3VsdHNcIj8gSSBkb24ndCB0aGluayBzbyBidXQgc2hvdWxkIGNvbnNpZGVyIHRoYXRcbiAgICBzZWxmLl9vcGxvZ0xhc3RFbnRyeUNvbm5lY3Rpb24gPSBuZXcgTW9uZ29Db25uZWN0aW9uKFxuICAgICAgc2VsZi5fb3Bsb2dVcmwsIHtwb29sU2l6ZTogMX0pO1xuXG4gICAgLy8gTm93LCBtYWtlIHN1cmUgdGhhdCB0aGVyZSBhY3R1YWxseSBpcyBhIHJlcGwgc2V0IGhlcmUuIElmIG5vdCwgb3Bsb2dcbiAgICAvLyB0YWlsaW5nIHdvbid0IGV2ZXIgZmluZCBhbnl0aGluZyFcbiAgICAvLyBNb3JlIG9uIHRoZSBpc01hc3RlckRvY1xuICAgIC8vIGh0dHBzOi8vZG9jcy5tb25nb2RiLmNvbS9tYW51YWwvcmVmZXJlbmNlL2NvbW1hbmQvaXNNYXN0ZXIvXG4gICAgdmFyIGYgPSBuZXcgRnV0dXJlO1xuICAgIHNlbGYuX29wbG9nTGFzdEVudHJ5Q29ubmVjdGlvbi5kYi5hZG1pbigpLmNvbW1hbmQoXG4gICAgICB7IGlzbWFzdGVyOiAxIH0sIGYucmVzb2x2ZXIoKSk7XG4gICAgdmFyIGlzTWFzdGVyRG9jID0gZi53YWl0KCk7XG5cbiAgICBpZiAoIShpc01hc3RlckRvYyAmJiBpc01hc3RlckRvYy5zZXROYW1lKSkge1xuICAgICAgdGhyb3cgRXJyb3IoXCIkTU9OR09fT1BMT0dfVVJMIG11c3QgYmUgc2V0IHRvIHRoZSAnbG9jYWwnIGRhdGFiYXNlIG9mIFwiICtcbiAgICAgICAgICAgICAgICAgIFwiYSBNb25nbyByZXBsaWNhIHNldFwiKTtcbiAgICB9XG5cbiAgICAvLyBGaW5kIHRoZSBsYXN0IG9wbG9nIGVudHJ5LlxuICAgIHZhciBsYXN0T3Bsb2dFbnRyeSA9IHNlbGYuX29wbG9nTGFzdEVudHJ5Q29ubmVjdGlvbi5maW5kT25lKFxuICAgICAgT1BMT0dfQ09MTEVDVElPTiwge30sIHtzb3J0OiB7JG5hdHVyYWw6IC0xfSwgZmllbGRzOiB7dHM6IDF9fSk7XG5cbiAgICB2YXIgb3Bsb2dTZWxlY3RvciA9IF8uY2xvbmUoc2VsZi5fYmFzZU9wbG9nU2VsZWN0b3IpO1xuICAgIGlmIChsYXN0T3Bsb2dFbnRyeSkge1xuICAgICAgLy8gU3RhcnQgYWZ0ZXIgdGhlIGxhc3QgZW50cnkgdGhhdCBjdXJyZW50bHkgZXhpc3RzLlxuICAgICAgb3Bsb2dTZWxlY3Rvci50cyA9IHskZ3Q6IGxhc3RPcGxvZ0VudHJ5LnRzfTtcbiAgICAgIC8vIElmIHRoZXJlIGFyZSBhbnkgY2FsbHMgdG8gY2FsbFdoZW5Qcm9jZXNzZWRMYXRlc3QgYmVmb3JlIGFueSBvdGhlclxuICAgICAgLy8gb3Bsb2cgZW50cmllcyBzaG93IHVwLCBhbGxvdyBjYWxsV2hlblByb2Nlc3NlZExhdGVzdCB0byBjYWxsIGl0c1xuICAgICAgLy8gY2FsbGJhY2sgaW1tZWRpYXRlbHkuXG4gICAgICBzZWxmLl9sYXN0UHJvY2Vzc2VkVFMgPSBsYXN0T3Bsb2dFbnRyeS50cztcbiAgICB9XG5cbiAgICB2YXIgY3Vyc29yRGVzY3JpcHRpb24gPSBuZXcgQ3Vyc29yRGVzY3JpcHRpb24oXG4gICAgICBPUExPR19DT0xMRUNUSU9OLCBvcGxvZ1NlbGVjdG9yLCB7dGFpbGFibGU6IHRydWV9KTtcblxuICAgIC8vIFN0YXJ0IHRhaWxpbmcgdGhlIG9wbG9nLlxuICAgIC8vXG4gICAgLy8gV2UgcmVzdGFydCB0aGUgbG93LWxldmVsIG9wbG9nIHF1ZXJ5IGV2ZXJ5IDMwIHNlY29uZHMgaWYgd2UgZGlkbid0IGdldCBhXG4gICAgLy8gZG9jLiBUaGlzIGlzIGEgd29ya2Fyb3VuZCBmb3IgIzg1OTg6IHRoZSBOb2RlIE1vbmdvIGRyaXZlciBoYXMgYXQgbGVhc3RcbiAgICAvLyBvbmUgYnVnIHRoYXQgY2FuIGxlYWQgdG8gcXVlcnkgY2FsbGJhY2tzIG5ldmVyIGdldHRpbmcgY2FsbGVkIChldmVuIHdpdGhcbiAgICAvLyBhbiBlcnJvcikgd2hlbiBsZWFkZXJzaGlwIGZhaWxvdmVyIG9jY3VyLlxuICAgIHNlbGYuX3RhaWxIYW5kbGUgPSBzZWxmLl9vcGxvZ1RhaWxDb25uZWN0aW9uLnRhaWwoXG4gICAgICBjdXJzb3JEZXNjcmlwdGlvbixcbiAgICAgIGZ1bmN0aW9uIChkb2MpIHtcbiAgICAgICAgc2VsZi5fZW50cnlRdWV1ZS5wdXNoKGRvYyk7XG4gICAgICAgIHNlbGYuX21heWJlU3RhcnRXb3JrZXIoKTtcbiAgICAgIH0sXG4gICAgICBUQUlMX1RJTUVPVVRcbiAgICApO1xuICAgIHNlbGYuX3JlYWR5RnV0dXJlLnJldHVybigpO1xuICB9LFxuXG4gIF9tYXliZVN0YXJ0V29ya2VyOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIGlmIChzZWxmLl93b3JrZXJBY3RpdmUpIHJldHVybjtcbiAgICBzZWxmLl93b3JrZXJBY3RpdmUgPSB0cnVlO1xuXG4gICAgTWV0ZW9yLmRlZmVyKGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIE1heSBiZSBjYWxsZWQgcmVjdXJzaXZlbHkgaW4gY2FzZSBvZiB0cmFuc2FjdGlvbnMuXG4gICAgICBmdW5jdGlvbiBoYW5kbGVEb2MoZG9jKSB7XG4gICAgICAgIGlmIChkb2MubnMgPT09IFwiYWRtaW4uJGNtZFwiKSB7XG4gICAgICAgICAgaWYgKGRvYy5vLmFwcGx5T3BzKSB7XG4gICAgICAgICAgICAvLyBUaGlzIHdhcyBhIHN1Y2Nlc3NmdWwgdHJhbnNhY3Rpb24sIHNvIHdlIG5lZWQgdG8gYXBwbHkgdGhlXG4gICAgICAgICAgICAvLyBvcGVyYXRpb25zIHRoYXQgd2VyZSBpbnZvbHZlZC5cbiAgICAgICAgICAgIGxldCBuZXh0VGltZXN0YW1wID0gZG9jLnRzO1xuICAgICAgICAgICAgZG9jLm8uYXBwbHlPcHMuZm9yRWFjaChvcCA9PiB7XG4gICAgICAgICAgICAgIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vbWV0ZW9yL21ldGVvci9pc3N1ZXMvMTA0MjAuXG4gICAgICAgICAgICAgIGlmICghb3AudHMpIHtcbiAgICAgICAgICAgICAgICBvcC50cyA9IG5leHRUaW1lc3RhbXA7XG4gICAgICAgICAgICAgICAgbmV4dFRpbWVzdGFtcCA9IG5leHRUaW1lc3RhbXAuYWRkKFRpbWVzdGFtcC5PTkUpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGhhbmRsZURvYyhvcCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5rbm93biBjb21tYW5kIFwiICsgRUpTT04uc3RyaW5naWZ5KGRvYykpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdHJpZ2dlciA9IHtcbiAgICAgICAgICBkcm9wQ29sbGVjdGlvbjogZmFsc2UsXG4gICAgICAgICAgZHJvcERhdGFiYXNlOiBmYWxzZSxcbiAgICAgICAgICBvcDogZG9jLFxuICAgICAgICB9O1xuXG4gICAgICAgIGlmICh0eXBlb2YgZG9jLm5zID09PSBcInN0cmluZ1wiICYmXG4gICAgICAgICAgICBkb2MubnMuc3RhcnRzV2l0aChzZWxmLl9kYk5hbWUgKyBcIi5cIikpIHtcbiAgICAgICAgICB0cmlnZ2VyLmNvbGxlY3Rpb24gPSBkb2MubnMuc2xpY2Uoc2VsZi5fZGJOYW1lLmxlbmd0aCArIDEpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSXMgaXQgYSBzcGVjaWFsIGNvbW1hbmQgYW5kIHRoZSBjb2xsZWN0aW9uIG5hbWUgaXMgaGlkZGVuXG4gICAgICAgIC8vIHNvbWV3aGVyZSBpbiBvcGVyYXRvcj9cbiAgICAgICAgaWYgKHRyaWdnZXIuY29sbGVjdGlvbiA9PT0gXCIkY21kXCIpIHtcbiAgICAgICAgICBpZiAoZG9jLm8uZHJvcERhdGFiYXNlKSB7XG4gICAgICAgICAgICBkZWxldGUgdHJpZ2dlci5jb2xsZWN0aW9uO1xuICAgICAgICAgICAgdHJpZ2dlci5kcm9wRGF0YWJhc2UgPSB0cnVlO1xuICAgICAgICAgIH0gZWxzZSBpZiAoXy5oYXMoZG9jLm8sIFwiZHJvcFwiKSkge1xuICAgICAgICAgICAgdHJpZ2dlci5jb2xsZWN0aW9uID0gZG9jLm8uZHJvcDtcbiAgICAgICAgICAgIHRyaWdnZXIuZHJvcENvbGxlY3Rpb24gPSB0cnVlO1xuICAgICAgICAgICAgdHJpZ2dlci5pZCA9IG51bGw7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IEVycm9yKFwiVW5rbm93biBjb21tYW5kIFwiICsgRUpTT04uc3RyaW5naWZ5KGRvYykpO1xuICAgICAgICAgIH1cblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIEFsbCBvdGhlciBvcHMgaGF2ZSBhbiBpZC5cbiAgICAgICAgICB0cmlnZ2VyLmlkID0gaWRGb3JPcChkb2MpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2VsZi5fY3Jvc3NiYXIuZmlyZSh0cmlnZ2VyKTtcbiAgICAgIH1cblxuICAgICAgdHJ5IHtcbiAgICAgICAgd2hpbGUgKCEgc2VsZi5fc3RvcHBlZCAmJlxuICAgICAgICAgICAgICAgISBzZWxmLl9lbnRyeVF1ZXVlLmlzRW1wdHkoKSkge1xuICAgICAgICAgIC8vIEFyZSB3ZSB0b28gZmFyIGJlaGluZD8gSnVzdCB0ZWxsIG91ciBvYnNlcnZlcnMgdGhhdCB0aGV5IG5lZWQgdG9cbiAgICAgICAgICAvLyByZXBvbGwsIGFuZCBkcm9wIG91ciBxdWV1ZS5cbiAgICAgICAgICBpZiAoc2VsZi5fZW50cnlRdWV1ZS5sZW5ndGggPiBUT09fRkFSX0JFSElORCkge1xuICAgICAgICAgICAgdmFyIGxhc3RFbnRyeSA9IHNlbGYuX2VudHJ5UXVldWUucG9wKCk7XG4gICAgICAgICAgICBzZWxmLl9lbnRyeVF1ZXVlLmNsZWFyKCk7XG5cbiAgICAgICAgICAgIHNlbGYuX29uU2tpcHBlZEVudHJpZXNIb29rLmVhY2goZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIEZyZWUgYW55IHdhaXRVbnRpbENhdWdodFVwKCkgY2FsbHMgdGhhdCB3ZXJlIHdhaXRpbmcgZm9yIHVzIHRvXG4gICAgICAgICAgICAvLyBwYXNzIHNvbWV0aGluZyB0aGF0IHdlIGp1c3Qgc2tpcHBlZC5cbiAgICAgICAgICAgIHNlbGYuX3NldExhc3RQcm9jZXNzZWRUUyhsYXN0RW50cnkudHMpO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29uc3QgZG9jID0gc2VsZi5fZW50cnlRdWV1ZS5zaGlmdCgpO1xuXG4gICAgICAgICAgLy8gRmlyZSB0cmlnZ2VyKHMpIGZvciB0aGlzIGRvYy5cbiAgICAgICAgICBoYW5kbGVEb2MoZG9jKTtcblxuICAgICAgICAgIC8vIE5vdyB0aGF0IHdlJ3ZlIHByb2Nlc3NlZCB0aGlzIG9wZXJhdGlvbiwgcHJvY2VzcyBwZW5kaW5nXG4gICAgICAgICAgLy8gc2VxdWVuY2Vycy5cbiAgICAgICAgICBpZiAoZG9jLnRzKSB7XG4gICAgICAgICAgICBzZWxmLl9zZXRMYXN0UHJvY2Vzc2VkVFMoZG9jLnRzKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJvcGxvZyBlbnRyeSB3aXRob3V0IHRzOiBcIiArIEVKU09OLnN0cmluZ2lmeShkb2MpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHNlbGYuX3dvcmtlckFjdGl2ZSA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuXG4gIF9zZXRMYXN0UHJvY2Vzc2VkVFM6IGZ1bmN0aW9uICh0cykge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBzZWxmLl9sYXN0UHJvY2Vzc2VkVFMgPSB0cztcbiAgICB3aGlsZSAoIV8uaXNFbXB0eShzZWxmLl9jYXRjaGluZ1VwRnV0dXJlcykgJiYgc2VsZi5fY2F0Y2hpbmdVcEZ1dHVyZXNbMF0udHMubGVzc1RoYW5PckVxdWFsKHNlbGYuX2xhc3RQcm9jZXNzZWRUUykpIHtcbiAgICAgIHZhciBzZXF1ZW5jZXIgPSBzZWxmLl9jYXRjaGluZ1VwRnV0dXJlcy5zaGlmdCgpO1xuICAgICAgc2VxdWVuY2VyLmZ1dHVyZS5yZXR1cm4oKTtcbiAgICB9XG4gIH0sXG5cbiAgLy9NZXRob2RzIHVzZWQgb24gdGVzdHMgdG8gZGluYW1pY2FsbHkgY2hhbmdlIFRPT19GQVJfQkVISU5EXG4gIF9kZWZpbmVUb29GYXJCZWhpbmQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgVE9PX0ZBUl9CRUhJTkQgPSB2YWx1ZTtcbiAgfSxcbiAgX3Jlc2V0VG9vRmFyQmVoaW5kOiBmdW5jdGlvbigpIHtcbiAgICBUT09fRkFSX0JFSElORCA9IHByb2Nlc3MuZW52Lk1FVEVPUl9PUExPR19UT09fRkFSX0JFSElORCB8fCAyMDAwO1xuICB9XG59KTtcbiIsInZhciBGdXR1cmUgPSBOcG0ucmVxdWlyZSgnZmliZXJzL2Z1dHVyZScpO1xuXG5PYnNlcnZlTXVsdGlwbGV4ZXIgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgaWYgKCFvcHRpb25zIHx8ICFfLmhhcyhvcHRpb25zLCAnb3JkZXJlZCcpKVxuICAgIHRocm93IEVycm9yKFwibXVzdCBzcGVjaWZpZWQgb3JkZXJlZFwiKTtcblxuICBQYWNrYWdlWydmYWN0cy1iYXNlJ10gJiYgUGFja2FnZVsnZmFjdHMtYmFzZSddLkZhY3RzLmluY3JlbWVudFNlcnZlckZhY3QoXG4gICAgXCJtb25nby1saXZlZGF0YVwiLCBcIm9ic2VydmUtbXVsdGlwbGV4ZXJzXCIsIDEpO1xuXG4gIHNlbGYuX29yZGVyZWQgPSBvcHRpb25zLm9yZGVyZWQ7XG4gIHNlbGYuX29uU3RvcCA9IG9wdGlvbnMub25TdG9wIHx8IGZ1bmN0aW9uICgpIHt9O1xuICBzZWxmLl9xdWV1ZSA9IG5ldyBNZXRlb3IuX1N5bmNocm9ub3VzUXVldWUoKTtcbiAgc2VsZi5faGFuZGxlcyA9IHt9O1xuICBzZWxmLl9yZWFkeUZ1dHVyZSA9IG5ldyBGdXR1cmU7XG4gIHNlbGYuX2NhY2hlID0gbmV3IExvY2FsQ29sbGVjdGlvbi5fQ2FjaGluZ0NoYW5nZU9ic2VydmVyKHtcbiAgICBvcmRlcmVkOiBvcHRpb25zLm9yZGVyZWR9KTtcbiAgLy8gTnVtYmVyIG9mIGFkZEhhbmRsZUFuZFNlbmRJbml0aWFsQWRkcyB0YXNrcyBzY2hlZHVsZWQgYnV0IG5vdCB5ZXRcbiAgLy8gcnVubmluZy4gcmVtb3ZlSGFuZGxlIHVzZXMgdGhpcyB0byBrbm93IGlmIGl0J3MgdGltZSB0byBjYWxsIHRoZSBvblN0b3BcbiAgLy8gY2FsbGJhY2suXG4gIHNlbGYuX2FkZEhhbmRsZVRhc2tzU2NoZWR1bGVkQnV0Tm90UGVyZm9ybWVkID0gMDtcblxuICBfLmVhY2goc2VsZi5jYWxsYmFja05hbWVzKCksIGZ1bmN0aW9uIChjYWxsYmFja05hbWUpIHtcbiAgICBzZWxmW2NhbGxiYWNrTmFtZV0gPSBmdW5jdGlvbiAoLyogLi4uICovKSB7XG4gICAgICBzZWxmLl9hcHBseUNhbGxiYWNrKGNhbGxiYWNrTmFtZSwgXy50b0FycmF5KGFyZ3VtZW50cykpO1xuICAgIH07XG4gIH0pO1xufTtcblxuXy5leHRlbmQoT2JzZXJ2ZU11bHRpcGxleGVyLnByb3RvdHlwZSwge1xuICBhZGRIYW5kbGVBbmRTZW5kSW5pdGlhbEFkZHM6IGZ1bmN0aW9uIChoYW5kbGUpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAvLyBDaGVjayB0aGlzIGJlZm9yZSBjYWxsaW5nIHJ1blRhc2sgKGV2ZW4gdGhvdWdoIHJ1blRhc2sgZG9lcyB0aGUgc2FtZVxuICAgIC8vIGNoZWNrKSBzbyB0aGF0IHdlIGRvbid0IGxlYWsgYW4gT2JzZXJ2ZU11bHRpcGxleGVyIG9uIGVycm9yIGJ5XG4gICAgLy8gaW5jcmVtZW50aW5nIF9hZGRIYW5kbGVUYXNrc1NjaGVkdWxlZEJ1dE5vdFBlcmZvcm1lZCBhbmQgbmV2ZXJcbiAgICAvLyBkZWNyZW1lbnRpbmcgaXQuXG4gICAgaWYgKCFzZWxmLl9xdWV1ZS5zYWZlVG9SdW5UYXNrKCkpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW4ndCBjYWxsIG9ic2VydmVDaGFuZ2VzIGZyb20gYW4gb2JzZXJ2ZSBjYWxsYmFjayBvbiB0aGUgc2FtZSBxdWVyeVwiKTtcbiAgICArK3NlbGYuX2FkZEhhbmRsZVRhc2tzU2NoZWR1bGVkQnV0Tm90UGVyZm9ybWVkO1xuXG4gICAgUGFja2FnZVsnZmFjdHMtYmFzZSddICYmIFBhY2thZ2VbJ2ZhY3RzLWJhc2UnXS5GYWN0cy5pbmNyZW1lbnRTZXJ2ZXJGYWN0KFxuICAgICAgXCJtb25nby1saXZlZGF0YVwiLCBcIm9ic2VydmUtaGFuZGxlc1wiLCAxKTtcblxuICAgIHNlbGYuX3F1ZXVlLnJ1blRhc2soZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi5faGFuZGxlc1toYW5kbGUuX2lkXSA9IGhhbmRsZTtcbiAgICAgIC8vIFNlbmQgb3V0IHdoYXRldmVyIGFkZHMgd2UgaGF2ZSBzbyBmYXIgKHdoZXRoZXIgb3Igbm90IHdlIHRoZVxuICAgICAgLy8gbXVsdGlwbGV4ZXIgaXMgcmVhZHkpLlxuICAgICAgc2VsZi5fc2VuZEFkZHMoaGFuZGxlKTtcbiAgICAgIC0tc2VsZi5fYWRkSGFuZGxlVGFza3NTY2hlZHVsZWRCdXROb3RQZXJmb3JtZWQ7XG4gICAgfSk7XG4gICAgLy8gKm91dHNpZGUqIHRoZSB0YXNrLCBzaW5jZSBvdGhlcndpc2Ugd2UnZCBkZWFkbG9ja1xuICAgIHNlbGYuX3JlYWR5RnV0dXJlLndhaXQoKTtcbiAgfSxcblxuICAvLyBSZW1vdmUgYW4gb2JzZXJ2ZSBoYW5kbGUuIElmIGl0IHdhcyB0aGUgbGFzdCBvYnNlcnZlIGhhbmRsZSwgY2FsbCB0aGVcbiAgLy8gb25TdG9wIGNhbGxiYWNrOyB5b3UgY2Fubm90IGFkZCBhbnkgbW9yZSBvYnNlcnZlIGhhbmRsZXMgYWZ0ZXIgdGhpcy5cbiAgLy9cbiAgLy8gVGhpcyBpcyBub3Qgc3luY2hyb25pemVkIHdpdGggcG9sbHMgYW5kIGhhbmRsZSBhZGRpdGlvbnM6IHRoaXMgbWVhbnMgdGhhdFxuICAvLyB5b3UgY2FuIHNhZmVseSBjYWxsIGl0IGZyb20gd2l0aGluIGFuIG9ic2VydmUgY2FsbGJhY2ssIGJ1dCBpdCBhbHNvIG1lYW5zXG4gIC8vIHRoYXQgd2UgaGF2ZSB0byBiZSBjYXJlZnVsIHdoZW4gd2UgaXRlcmF0ZSBvdmVyIF9oYW5kbGVzLlxuICByZW1vdmVIYW5kbGU6IGZ1bmN0aW9uIChpZCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIC8vIFRoaXMgc2hvdWxkIG5vdCBiZSBwb3NzaWJsZTogeW91IGNhbiBvbmx5IGNhbGwgcmVtb3ZlSGFuZGxlIGJ5IGhhdmluZ1xuICAgIC8vIGFjY2VzcyB0byB0aGUgT2JzZXJ2ZUhhbmRsZSwgd2hpY2ggaXNuJ3QgcmV0dXJuZWQgdG8gdXNlciBjb2RlIHVudGlsIHRoZVxuICAgIC8vIG11bHRpcGxleCBpcyByZWFkeS5cbiAgICBpZiAoIXNlbGYuX3JlYWR5KCkpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW4ndCByZW1vdmUgaGFuZGxlcyB1bnRpbCB0aGUgbXVsdGlwbGV4IGlzIHJlYWR5XCIpO1xuXG4gICAgZGVsZXRlIHNlbGYuX2hhbmRsZXNbaWRdO1xuXG4gICAgUGFja2FnZVsnZmFjdHMtYmFzZSddICYmIFBhY2thZ2VbJ2ZhY3RzLWJhc2UnXS5GYWN0cy5pbmNyZW1lbnRTZXJ2ZXJGYWN0KFxuICAgICAgXCJtb25nby1saXZlZGF0YVwiLCBcIm9ic2VydmUtaGFuZGxlc1wiLCAtMSk7XG5cbiAgICBpZiAoXy5pc0VtcHR5KHNlbGYuX2hhbmRsZXMpICYmXG4gICAgICAgIHNlbGYuX2FkZEhhbmRsZVRhc2tzU2NoZWR1bGVkQnV0Tm90UGVyZm9ybWVkID09PSAwKSB7XG4gICAgICBzZWxmLl9zdG9wKCk7XG4gICAgfVxuICB9LFxuICBfc3RvcDogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICAvLyBJdCBzaG91bGRuJ3QgYmUgcG9zc2libGUgZm9yIHVzIHRvIHN0b3Agd2hlbiBhbGwgb3VyIGhhbmRsZXMgc3RpbGxcbiAgICAvLyBoYXZlbid0IGJlZW4gcmV0dXJuZWQgZnJvbSBvYnNlcnZlQ2hhbmdlcyFcbiAgICBpZiAoISBzZWxmLl9yZWFkeSgpICYmICEgb3B0aW9ucy5mcm9tUXVlcnlFcnJvcilcbiAgICAgIHRocm93IEVycm9yKFwic3VycHJpc2luZyBfc3RvcDogbm90IHJlYWR5XCIpO1xuXG4gICAgLy8gQ2FsbCBzdG9wIGNhbGxiYWNrICh3aGljaCBraWxscyB0aGUgdW5kZXJseWluZyBwcm9jZXNzIHdoaWNoIHNlbmRzIHVzXG4gICAgLy8gY2FsbGJhY2tzIGFuZCByZW1vdmVzIHVzIGZyb20gdGhlIGNvbm5lY3Rpb24ncyBkaWN0aW9uYXJ5KS5cbiAgICBzZWxmLl9vblN0b3AoKTtcbiAgICBQYWNrYWdlWydmYWN0cy1iYXNlJ10gJiYgUGFja2FnZVsnZmFjdHMtYmFzZSddLkZhY3RzLmluY3JlbWVudFNlcnZlckZhY3QoXG4gICAgICBcIm1vbmdvLWxpdmVkYXRhXCIsIFwib2JzZXJ2ZS1tdWx0aXBsZXhlcnNcIiwgLTEpO1xuXG4gICAgLy8gQ2F1c2UgZnV0dXJlIGFkZEhhbmRsZUFuZFNlbmRJbml0aWFsQWRkcyBjYWxscyB0byB0aHJvdyAoYnV0IHRoZSBvblN0b3BcbiAgICAvLyBjYWxsYmFjayBzaG91bGQgbWFrZSBvdXIgY29ubmVjdGlvbiBmb3JnZXQgYWJvdXQgdXMpLlxuICAgIHNlbGYuX2hhbmRsZXMgPSBudWxsO1xuICB9LFxuXG4gIC8vIEFsbG93cyBhbGwgYWRkSGFuZGxlQW5kU2VuZEluaXRpYWxBZGRzIGNhbGxzIHRvIHJldHVybiwgb25jZSBhbGwgcHJlY2VkaW5nXG4gIC8vIGFkZHMgaGF2ZSBiZWVuIHByb2Nlc3NlZC4gRG9lcyBub3QgYmxvY2suXG4gIHJlYWR5OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHNlbGYuX3F1ZXVlLnF1ZXVlVGFzayhmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoc2VsZi5fcmVhZHkoKSlcbiAgICAgICAgdGhyb3cgRXJyb3IoXCJjYW4ndCBtYWtlIE9ic2VydmVNdWx0aXBsZXggcmVhZHkgdHdpY2UhXCIpO1xuICAgICAgc2VsZi5fcmVhZHlGdXR1cmUucmV0dXJuKCk7XG4gICAgfSk7XG4gIH0sXG5cbiAgLy8gSWYgdHJ5aW5nIHRvIGV4ZWN1dGUgdGhlIHF1ZXJ5IHJlc3VsdHMgaW4gYW4gZXJyb3IsIGNhbGwgdGhpcy4gVGhpcyBpc1xuICAvLyBpbnRlbmRlZCBmb3IgcGVybWFuZW50IGVycm9ycywgbm90IHRyYW5zaWVudCBuZXR3b3JrIGVycm9ycyB0aGF0IGNvdWxkIGJlXG4gIC8vIGZpeGVkLiBJdCBzaG91bGQgb25seSBiZSBjYWxsZWQgYmVmb3JlIHJlYWR5KCksIGJlY2F1c2UgaWYgeW91IGNhbGxlZCByZWFkeVxuICAvLyB0aGF0IG1lYW50IHRoYXQgeW91IG1hbmFnZWQgdG8gcnVuIHRoZSBxdWVyeSBvbmNlLiBJdCB3aWxsIHN0b3AgdGhpc1xuICAvLyBPYnNlcnZlTXVsdGlwbGV4IGFuZCBjYXVzZSBhZGRIYW5kbGVBbmRTZW5kSW5pdGlhbEFkZHMgY2FsbHMgKGFuZCB0aHVzXG4gIC8vIG9ic2VydmVDaGFuZ2VzIGNhbGxzKSB0byB0aHJvdyB0aGUgZXJyb3IuXG4gIHF1ZXJ5RXJyb3I6IGZ1bmN0aW9uIChlcnIpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgc2VsZi5fcXVldWUucnVuVGFzayhmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoc2VsZi5fcmVhZHkoKSlcbiAgICAgICAgdGhyb3cgRXJyb3IoXCJjYW4ndCBjbGFpbSBxdWVyeSBoYXMgYW4gZXJyb3IgYWZ0ZXIgaXQgd29ya2VkIVwiKTtcbiAgICAgIHNlbGYuX3N0b3Aoe2Zyb21RdWVyeUVycm9yOiB0cnVlfSk7XG4gICAgICBzZWxmLl9yZWFkeUZ1dHVyZS50aHJvdyhlcnIpO1xuICAgIH0pO1xuICB9LFxuXG4gIC8vIENhbGxzIFwiY2JcIiBvbmNlIHRoZSBlZmZlY3RzIG9mIGFsbCBcInJlYWR5XCIsIFwiYWRkSGFuZGxlQW5kU2VuZEluaXRpYWxBZGRzXCJcbiAgLy8gYW5kIG9ic2VydmUgY2FsbGJhY2tzIHdoaWNoIGNhbWUgYmVmb3JlIHRoaXMgY2FsbCBoYXZlIGJlZW4gcHJvcGFnYXRlZCB0b1xuICAvLyBhbGwgaGFuZGxlcy4gXCJyZWFkeVwiIG11c3QgaGF2ZSBhbHJlYWR5IGJlZW4gY2FsbGVkIG9uIHRoaXMgbXVsdGlwbGV4ZXIuXG4gIG9uRmx1c2g6IGZ1bmN0aW9uIChjYikge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBzZWxmLl9xdWV1ZS5xdWV1ZVRhc2soZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCFzZWxmLl9yZWFkeSgpKVxuICAgICAgICB0aHJvdyBFcnJvcihcIm9ubHkgY2FsbCBvbkZsdXNoIG9uIGEgbXVsdGlwbGV4ZXIgdGhhdCB3aWxsIGJlIHJlYWR5XCIpO1xuICAgICAgY2IoKTtcbiAgICB9KTtcbiAgfSxcbiAgY2FsbGJhY2tOYW1lczogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBpZiAoc2VsZi5fb3JkZXJlZClcbiAgICAgIHJldHVybiBbXCJhZGRlZEJlZm9yZVwiLCBcImNoYW5nZWRcIiwgXCJtb3ZlZEJlZm9yZVwiLCBcInJlbW92ZWRcIl07XG4gICAgZWxzZVxuICAgICAgcmV0dXJuIFtcImFkZGVkXCIsIFwiY2hhbmdlZFwiLCBcInJlbW92ZWRcIl07XG4gIH0sXG4gIF9yZWFkeTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl9yZWFkeUZ1dHVyZS5pc1Jlc29sdmVkKCk7XG4gIH0sXG4gIF9hcHBseUNhbGxiYWNrOiBmdW5jdGlvbiAoY2FsbGJhY2tOYW1lLCBhcmdzKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHNlbGYuX3F1ZXVlLnF1ZXVlVGFzayhmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBJZiB3ZSBzdG9wcGVkIGluIHRoZSBtZWFudGltZSwgZG8gbm90aGluZy5cbiAgICAgIGlmICghc2VsZi5faGFuZGxlcylcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICAvLyBGaXJzdCwgYXBwbHkgdGhlIGNoYW5nZSB0byB0aGUgY2FjaGUuXG4gICAgICAvLyBYWFggV2UgY291bGQgbWFrZSBhcHBseUNoYW5nZSBjYWxsYmFja3MgcHJvbWlzZSBub3QgdG8gaGFuZyBvbiB0byBhbnlcbiAgICAgIC8vIHN0YXRlIGZyb20gdGhlaXIgYXJndW1lbnRzIChhc3N1bWluZyB0aGF0IHRoZWlyIHN1cHBsaWVkIGNhbGxiYWNrc1xuICAgICAgLy8gZG9uJ3QpIGFuZCBza2lwIHRoaXMgY2xvbmUuIEN1cnJlbnRseSAnY2hhbmdlZCcgaGFuZ3Mgb24gdG8gc3RhdGVcbiAgICAgIC8vIHRob3VnaC5cbiAgICAgIHNlbGYuX2NhY2hlLmFwcGx5Q2hhbmdlW2NhbGxiYWNrTmFtZV0uYXBwbHkobnVsbCwgRUpTT04uY2xvbmUoYXJncykpO1xuXG4gICAgICAvLyBJZiB3ZSBoYXZlbid0IGZpbmlzaGVkIHRoZSBpbml0aWFsIGFkZHMsIHRoZW4gd2Ugc2hvdWxkIG9ubHkgYmUgZ2V0dGluZ1xuICAgICAgLy8gYWRkcy5cbiAgICAgIGlmICghc2VsZi5fcmVhZHkoKSAmJlxuICAgICAgICAgIChjYWxsYmFja05hbWUgIT09ICdhZGRlZCcgJiYgY2FsbGJhY2tOYW1lICE9PSAnYWRkZWRCZWZvcmUnKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHb3QgXCIgKyBjYWxsYmFja05hbWUgKyBcIiBkdXJpbmcgaW5pdGlhbCBhZGRzXCIpO1xuICAgICAgfVxuXG4gICAgICAvLyBOb3cgbXVsdGlwbGV4IHRoZSBjYWxsYmFja3Mgb3V0IHRvIGFsbCBvYnNlcnZlIGhhbmRsZXMuIEl0J3MgT0sgaWZcbiAgICAgIC8vIHRoZXNlIGNhbGxzIHlpZWxkOyBzaW5jZSB3ZSdyZSBpbnNpZGUgYSB0YXNrLCBubyBvdGhlciB1c2Ugb2Ygb3VyIHF1ZXVlXG4gICAgICAvLyBjYW4gY29udGludWUgdW50aWwgdGhlc2UgYXJlIGRvbmUuIChCdXQgd2UgZG8gaGF2ZSB0byBiZSBjYXJlZnVsIHRvIG5vdFxuICAgICAgLy8gdXNlIGEgaGFuZGxlIHRoYXQgZ290IHJlbW92ZWQsIGJlY2F1c2UgcmVtb3ZlSGFuZGxlIGRvZXMgbm90IHVzZSB0aGVcbiAgICAgIC8vIHF1ZXVlOyB0aHVzLCB3ZSBpdGVyYXRlIG92ZXIgYW4gYXJyYXkgb2Yga2V5cyB0aGF0IHdlIGNvbnRyb2wuKVxuICAgICAgXy5lYWNoKF8ua2V5cyhzZWxmLl9oYW5kbGVzKSwgZnVuY3Rpb24gKGhhbmRsZUlkKSB7XG4gICAgICAgIHZhciBoYW5kbGUgPSBzZWxmLl9oYW5kbGVzICYmIHNlbGYuX2hhbmRsZXNbaGFuZGxlSWRdO1xuICAgICAgICBpZiAoIWhhbmRsZSlcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIHZhciBjYWxsYmFjayA9IGhhbmRsZVsnXycgKyBjYWxsYmFja05hbWVdO1xuICAgICAgICAvLyBjbG9uZSBhcmd1bWVudHMgc28gdGhhdCBjYWxsYmFja3MgY2FuIG11dGF0ZSB0aGVpciBhcmd1bWVudHNcbiAgICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2suYXBwbHkobnVsbCwgRUpTT04uY2xvbmUoYXJncykpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0sXG5cbiAgLy8gU2VuZHMgaW5pdGlhbCBhZGRzIHRvIGEgaGFuZGxlLiBJdCBzaG91bGQgb25seSBiZSBjYWxsZWQgZnJvbSB3aXRoaW4gYSB0YXNrXG4gIC8vICh0aGUgdGFzayB0aGF0IGlzIHByb2Nlc3NpbmcgdGhlIGFkZEhhbmRsZUFuZFNlbmRJbml0aWFsQWRkcyBjYWxsKS4gSXRcbiAgLy8gc3luY2hyb25vdXNseSBpbnZva2VzIHRoZSBoYW5kbGUncyBhZGRlZCBvciBhZGRlZEJlZm9yZTsgdGhlcmUncyBubyBuZWVkIHRvXG4gIC8vIGZsdXNoIHRoZSBxdWV1ZSBhZnRlcndhcmRzIHRvIGVuc3VyZSB0aGF0IHRoZSBjYWxsYmFja3MgZ2V0IG91dC5cbiAgX3NlbmRBZGRzOiBmdW5jdGlvbiAoaGFuZGxlKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIGlmIChzZWxmLl9xdWV1ZS5zYWZlVG9SdW5UYXNrKCkpXG4gICAgICB0aHJvdyBFcnJvcihcIl9zZW5kQWRkcyBtYXkgb25seSBiZSBjYWxsZWQgZnJvbSB3aXRoaW4gYSB0YXNrIVwiKTtcbiAgICB2YXIgYWRkID0gc2VsZi5fb3JkZXJlZCA/IGhhbmRsZS5fYWRkZWRCZWZvcmUgOiBoYW5kbGUuX2FkZGVkO1xuICAgIGlmICghYWRkKVxuICAgICAgcmV0dXJuO1xuICAgIC8vIG5vdGU6IGRvY3MgbWF5IGJlIGFuIF9JZE1hcCBvciBhbiBPcmRlcmVkRGljdFxuICAgIHNlbGYuX2NhY2hlLmRvY3MuZm9yRWFjaChmdW5jdGlvbiAoZG9jLCBpZCkge1xuICAgICAgaWYgKCFfLmhhcyhzZWxmLl9oYW5kbGVzLCBoYW5kbGUuX2lkKSlcbiAgICAgICAgdGhyb3cgRXJyb3IoXCJoYW5kbGUgZ290IHJlbW92ZWQgYmVmb3JlIHNlbmRpbmcgaW5pdGlhbCBhZGRzIVwiKTtcbiAgICAgIHZhciBmaWVsZHMgPSBFSlNPTi5jbG9uZShkb2MpO1xuICAgICAgZGVsZXRlIGZpZWxkcy5faWQ7XG4gICAgICBpZiAoc2VsZi5fb3JkZXJlZClcbiAgICAgICAgYWRkKGlkLCBmaWVsZHMsIG51bGwpOyAvLyB3ZSdyZSBnb2luZyBpbiBvcmRlciwgc28gYWRkIGF0IGVuZFxuICAgICAgZWxzZVxuICAgICAgICBhZGQoaWQsIGZpZWxkcyk7XG4gICAgfSk7XG4gIH1cbn0pO1xuXG5cbnZhciBuZXh0T2JzZXJ2ZUhhbmRsZUlkID0gMTtcbk9ic2VydmVIYW5kbGUgPSBmdW5jdGlvbiAobXVsdGlwbGV4ZXIsIGNhbGxiYWNrcykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIC8vIFRoZSBlbmQgdXNlciBpcyBvbmx5IHN1cHBvc2VkIHRvIGNhbGwgc3RvcCgpLiAgVGhlIG90aGVyIGZpZWxkcyBhcmVcbiAgLy8gYWNjZXNzaWJsZSB0byB0aGUgbXVsdGlwbGV4ZXIsIHRob3VnaC5cbiAgc2VsZi5fbXVsdGlwbGV4ZXIgPSBtdWx0aXBsZXhlcjtcbiAgXy5lYWNoKG11bHRpcGxleGVyLmNhbGxiYWNrTmFtZXMoKSwgZnVuY3Rpb24gKG5hbWUpIHtcbiAgICBpZiAoY2FsbGJhY2tzW25hbWVdKSB7XG4gICAgICBzZWxmWydfJyArIG5hbWVdID0gY2FsbGJhY2tzW25hbWVdO1xuICAgIH0gZWxzZSBpZiAobmFtZSA9PT0gXCJhZGRlZEJlZm9yZVwiICYmIGNhbGxiYWNrcy5hZGRlZCkge1xuICAgICAgLy8gU3BlY2lhbCBjYXNlOiBpZiB5b3Ugc3BlY2lmeSBcImFkZGVkXCIgYW5kIFwibW92ZWRCZWZvcmVcIiwgeW91IGdldCBhblxuICAgICAgLy8gb3JkZXJlZCBvYnNlcnZlIHdoZXJlIGZvciBzb21lIHJlYXNvbiB5b3UgZG9uJ3QgZ2V0IG9yZGVyaW5nIGRhdGEgb25cbiAgICAgIC8vIHRoZSBhZGRzLiAgSSBkdW5ubywgd2Ugd3JvdGUgdGVzdHMgZm9yIGl0LCB0aGVyZSBtdXN0IGhhdmUgYmVlbiBhXG4gICAgICAvLyByZWFzb24uXG4gICAgICBzZWxmLl9hZGRlZEJlZm9yZSA9IGZ1bmN0aW9uIChpZCwgZmllbGRzLCBiZWZvcmUpIHtcbiAgICAgICAgY2FsbGJhY2tzLmFkZGVkKGlkLCBmaWVsZHMpO1xuICAgICAgfTtcbiAgICB9XG4gIH0pO1xuICBzZWxmLl9zdG9wcGVkID0gZmFsc2U7XG4gIHNlbGYuX2lkID0gbmV4dE9ic2VydmVIYW5kbGVJZCsrO1xufTtcbk9ic2VydmVIYW5kbGUucHJvdG90eXBlLnN0b3AgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgaWYgKHNlbGYuX3N0b3BwZWQpXG4gICAgcmV0dXJuO1xuICBzZWxmLl9zdG9wcGVkID0gdHJ1ZTtcbiAgc2VsZi5fbXVsdGlwbGV4ZXIucmVtb3ZlSGFuZGxlKHNlbGYuX2lkKTtcbn07XG4iLCJ2YXIgRmliZXIgPSBOcG0ucmVxdWlyZSgnZmliZXJzJyk7XG5cbmV4cG9ydCBjbGFzcyBEb2NGZXRjaGVyIHtcbiAgY29uc3RydWN0b3IobW9uZ29Db25uZWN0aW9uKSB7XG4gICAgdGhpcy5fbW9uZ29Db25uZWN0aW9uID0gbW9uZ29Db25uZWN0aW9uO1xuICAgIC8vIE1hcCBmcm9tIG9wIC0+IFtjYWxsYmFja11cbiAgICB0aGlzLl9jYWxsYmFja3NGb3JPcCA9IG5ldyBNYXA7XG4gIH1cblxuICAvLyBGZXRjaGVzIGRvY3VtZW50IFwiaWRcIiBmcm9tIGNvbGxlY3Rpb25OYW1lLCByZXR1cm5pbmcgaXQgb3IgbnVsbCBpZiBub3RcbiAgLy8gZm91bmQuXG4gIC8vXG4gIC8vIElmIHlvdSBtYWtlIG11bHRpcGxlIGNhbGxzIHRvIGZldGNoKCkgd2l0aCB0aGUgc2FtZSBvcCByZWZlcmVuY2UsXG4gIC8vIERvY0ZldGNoZXIgbWF5IGFzc3VtZSB0aGF0IHRoZXkgYWxsIHJldHVybiB0aGUgc2FtZSBkb2N1bWVudC4gKEl0IGRvZXNcbiAgLy8gbm90IGNoZWNrIHRvIHNlZSBpZiBjb2xsZWN0aW9uTmFtZS9pZCBtYXRjaC4pXG4gIC8vXG4gIC8vIFlvdSBtYXkgYXNzdW1lIHRoYXQgY2FsbGJhY2sgaXMgbmV2ZXIgY2FsbGVkIHN5bmNocm9ub3VzbHkgKGFuZCBpbiBmYWN0XG4gIC8vIE9wbG9nT2JzZXJ2ZURyaXZlciBkb2VzIHNvKS5cbiAgZmV0Y2goY29sbGVjdGlvbk5hbWUsIGlkLCBvcCwgY2FsbGJhY2spIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGNoZWNrKGNvbGxlY3Rpb25OYW1lLCBTdHJpbmcpO1xuICAgIGNoZWNrKG9wLCBPYmplY3QpO1xuXG4gICAgLy8gSWYgdGhlcmUncyBhbHJlYWR5IGFuIGluLXByb2dyZXNzIGZldGNoIGZvciB0aGlzIGNhY2hlIGtleSwgeWllbGQgdW50aWxcbiAgICAvLyBpdCdzIGRvbmUgYW5kIHJldHVybiB3aGF0ZXZlciBpdCByZXR1cm5zLlxuICAgIGlmIChzZWxmLl9jYWxsYmFja3NGb3JPcC5oYXMob3ApKSB7XG4gICAgICBzZWxmLl9jYWxsYmFja3NGb3JPcC5nZXQob3ApLnB1c2goY2FsbGJhY2spO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGNhbGxiYWNrcyA9IFtjYWxsYmFja107XG4gICAgc2VsZi5fY2FsbGJhY2tzRm9yT3Auc2V0KG9wLCBjYWxsYmFja3MpO1xuXG4gICAgRmliZXIoZnVuY3Rpb24gKCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdmFyIGRvYyA9IHNlbGYuX21vbmdvQ29ubmVjdGlvbi5maW5kT25lKFxuICAgICAgICAgIGNvbGxlY3Rpb25OYW1lLCB7X2lkOiBpZH0pIHx8IG51bGw7XG4gICAgICAgIC8vIFJldHVybiBkb2MgdG8gYWxsIHJlbGV2YW50IGNhbGxiYWNrcy4gTm90ZSB0aGF0IHRoaXMgYXJyYXkgY2FuXG4gICAgICAgIC8vIGNvbnRpbnVlIHRvIGdyb3cgZHVyaW5nIGNhbGxiYWNrIGV4Y2VjdXRpb24uXG4gICAgICAgIHdoaWxlIChjYWxsYmFja3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgIC8vIENsb25lIHRoZSBkb2N1bWVudCBzbyB0aGF0IHRoZSB2YXJpb3VzIGNhbGxzIHRvIGZldGNoIGRvbid0IHJldHVyblxuICAgICAgICAgIC8vIG9iamVjdHMgdGhhdCBhcmUgaW50ZXJ0d2luZ2xlZCB3aXRoIGVhY2ggb3RoZXIuIENsb25lIGJlZm9yZVxuICAgICAgICAgIC8vIHBvcHBpbmcgdGhlIGZ1dHVyZSwgc28gdGhhdCBpZiBjbG9uZSB0aHJvd3MsIHRoZSBlcnJvciBnZXRzIHBhc3NlZFxuICAgICAgICAgIC8vIHRvIHRoZSBuZXh0IGNhbGxiYWNrLlxuICAgICAgICAgIGNhbGxiYWNrcy5wb3AoKShudWxsLCBFSlNPTi5jbG9uZShkb2MpKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB3aGlsZSAoY2FsbGJhY2tzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBjYWxsYmFja3MucG9wKCkoZSk7XG4gICAgICAgIH1cbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIC8vIFhYWCBjb25zaWRlciBrZWVwaW5nIHRoZSBkb2MgYXJvdW5kIGZvciBhIHBlcmlvZCBvZiB0aW1lIGJlZm9yZVxuICAgICAgICAvLyByZW1vdmluZyBmcm9tIHRoZSBjYWNoZVxuICAgICAgICBzZWxmLl9jYWxsYmFja3NGb3JPcC5kZWxldGUob3ApO1xuICAgICAgfVxuICAgIH0pLnJ1bigpO1xuICB9XG59XG4iLCJ2YXIgUE9MTElOR19USFJPVFRMRV9NUyA9ICtwcm9jZXNzLmVudi5NRVRFT1JfUE9MTElOR19USFJPVFRMRV9NUyB8fCA1MDtcbnZhciBQT0xMSU5HX0lOVEVSVkFMX01TID0gK3Byb2Nlc3MuZW52Lk1FVEVPUl9QT0xMSU5HX0lOVEVSVkFMX01TIHx8IDEwICogMTAwMDtcblxuUG9sbGluZ09ic2VydmVEcml2ZXIgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgc2VsZi5fY3Vyc29yRGVzY3JpcHRpb24gPSBvcHRpb25zLmN1cnNvckRlc2NyaXB0aW9uO1xuICBzZWxmLl9tb25nb0hhbmRsZSA9IG9wdGlvbnMubW9uZ29IYW5kbGU7XG4gIHNlbGYuX29yZGVyZWQgPSBvcHRpb25zLm9yZGVyZWQ7XG4gIHNlbGYuX211bHRpcGxleGVyID0gb3B0aW9ucy5tdWx0aXBsZXhlcjtcbiAgc2VsZi5fc3RvcENhbGxiYWNrcyA9IFtdO1xuICBzZWxmLl9zdG9wcGVkID0gZmFsc2U7XG5cbiAgc2VsZi5fc3luY2hyb25vdXNDdXJzb3IgPSBzZWxmLl9tb25nb0hhbmRsZS5fY3JlYXRlU3luY2hyb25vdXNDdXJzb3IoXG4gICAgc2VsZi5fY3Vyc29yRGVzY3JpcHRpb24pO1xuXG4gIC8vIHByZXZpb3VzIHJlc3VsdHMgc25hcHNob3QuICBvbiBlYWNoIHBvbGwgY3ljbGUsIGRpZmZzIGFnYWluc3RcbiAgLy8gcmVzdWx0cyBkcml2ZXMgdGhlIGNhbGxiYWNrcy5cbiAgc2VsZi5fcmVzdWx0cyA9IG51bGw7XG5cbiAgLy8gVGhlIG51bWJlciBvZiBfcG9sbE1vbmdvIGNhbGxzIHRoYXQgaGF2ZSBiZWVuIGFkZGVkIHRvIHNlbGYuX3Rhc2tRdWV1ZSBidXRcbiAgLy8gaGF2ZSBub3Qgc3RhcnRlZCBydW5uaW5nLiBVc2VkIHRvIG1ha2Ugc3VyZSB3ZSBuZXZlciBzY2hlZHVsZSBtb3JlIHRoYW4gb25lXG4gIC8vIF9wb2xsTW9uZ28gKG90aGVyIHRoYW4gcG9zc2libHkgdGhlIG9uZSB0aGF0IGlzIGN1cnJlbnRseSBydW5uaW5nKS4gSXQnc1xuICAvLyBhbHNvIHVzZWQgYnkgX3N1c3BlbmRQb2xsaW5nIHRvIHByZXRlbmQgdGhlcmUncyBhIHBvbGwgc2NoZWR1bGVkLiBVc3VhbGx5LFxuICAvLyBpdCdzIGVpdGhlciAwIChmb3IgXCJubyBwb2xscyBzY2hlZHVsZWQgb3RoZXIgdGhhbiBtYXliZSBvbmUgY3VycmVudGx5XG4gIC8vIHJ1bm5pbmdcIikgb3IgMSAoZm9yIFwiYSBwb2xsIHNjaGVkdWxlZCB0aGF0IGlzbid0IHJ1bm5pbmcgeWV0XCIpLCBidXQgaXQgY2FuXG4gIC8vIGFsc28gYmUgMiBpZiBpbmNyZW1lbnRlZCBieSBfc3VzcGVuZFBvbGxpbmcuXG4gIHNlbGYuX3BvbGxzU2NoZWR1bGVkQnV0Tm90U3RhcnRlZCA9IDA7XG4gIHNlbGYuX3BlbmRpbmdXcml0ZXMgPSBbXTsgLy8gcGVvcGxlIHRvIG5vdGlmeSB3aGVuIHBvbGxpbmcgY29tcGxldGVzXG5cbiAgLy8gTWFrZSBzdXJlIHRvIGNyZWF0ZSBhIHNlcGFyYXRlbHkgdGhyb3R0bGVkIGZ1bmN0aW9uIGZvciBlYWNoXG4gIC8vIFBvbGxpbmdPYnNlcnZlRHJpdmVyIG9iamVjdC5cbiAgc2VsZi5fZW5zdXJlUG9sbElzU2NoZWR1bGVkID0gXy50aHJvdHRsZShcbiAgICBzZWxmLl91bnRocm90dGxlZEVuc3VyZVBvbGxJc1NjaGVkdWxlZCxcbiAgICBzZWxmLl9jdXJzb3JEZXNjcmlwdGlvbi5vcHRpb25zLnBvbGxpbmdUaHJvdHRsZU1zIHx8IFBPTExJTkdfVEhST1RUTEVfTVMgLyogbXMgKi8pO1xuXG4gIC8vIFhYWCBmaWd1cmUgb3V0IGlmIHdlIHN0aWxsIG5lZWQgYSBxdWV1ZVxuICBzZWxmLl90YXNrUXVldWUgPSBuZXcgTWV0ZW9yLl9TeW5jaHJvbm91c1F1ZXVlKCk7XG5cbiAgdmFyIGxpc3RlbmVyc0hhbmRsZSA9IGxpc3RlbkFsbChcbiAgICBzZWxmLl9jdXJzb3JEZXNjcmlwdGlvbiwgZnVuY3Rpb24gKG5vdGlmaWNhdGlvbikge1xuICAgICAgLy8gV2hlbiBzb21lb25lIGRvZXMgYSB0cmFuc2FjdGlvbiB0aGF0IG1pZ2h0IGFmZmVjdCB1cywgc2NoZWR1bGUgYSBwb2xsXG4gICAgICAvLyBvZiB0aGUgZGF0YWJhc2UuIElmIHRoYXQgdHJhbnNhY3Rpb24gaGFwcGVucyBpbnNpZGUgb2YgYSB3cml0ZSBmZW5jZSxcbiAgICAgIC8vIGJsb2NrIHRoZSBmZW5jZSB1bnRpbCB3ZSd2ZSBwb2xsZWQgYW5kIG5vdGlmaWVkIG9ic2VydmVycy5cbiAgICAgIHZhciBmZW5jZSA9IEREUFNlcnZlci5fQ3VycmVudFdyaXRlRmVuY2UuZ2V0KCk7XG4gICAgICBpZiAoZmVuY2UpXG4gICAgICAgIHNlbGYuX3BlbmRpbmdXcml0ZXMucHVzaChmZW5jZS5iZWdpbldyaXRlKCkpO1xuICAgICAgLy8gRW5zdXJlIGEgcG9sbCBpcyBzY2hlZHVsZWQuLi4gYnV0IGlmIHdlIGFscmVhZHkga25vdyB0aGF0IG9uZSBpcyxcbiAgICAgIC8vIGRvbid0IGhpdCB0aGUgdGhyb3R0bGVkIF9lbnN1cmVQb2xsSXNTY2hlZHVsZWQgZnVuY3Rpb24gKHdoaWNoIG1pZ2h0XG4gICAgICAvLyBsZWFkIHRvIHVzIGNhbGxpbmcgaXQgdW5uZWNlc3NhcmlseSBpbiA8cG9sbGluZ1Rocm90dGxlTXM+IG1zKS5cbiAgICAgIGlmIChzZWxmLl9wb2xsc1NjaGVkdWxlZEJ1dE5vdFN0YXJ0ZWQgPT09IDApXG4gICAgICAgIHNlbGYuX2Vuc3VyZVBvbGxJc1NjaGVkdWxlZCgpO1xuICAgIH1cbiAgKTtcbiAgc2VsZi5fc3RvcENhbGxiYWNrcy5wdXNoKGZ1bmN0aW9uICgpIHsgbGlzdGVuZXJzSGFuZGxlLnN0b3AoKTsgfSk7XG5cbiAgLy8gZXZlcnkgb25jZSBhbmQgYSB3aGlsZSwgcG9sbCBldmVuIGlmIHdlIGRvbid0IHRoaW5rIHdlJ3JlIGRpcnR5LCBmb3JcbiAgLy8gZXZlbnR1YWwgY29uc2lzdGVuY3kgd2l0aCBkYXRhYmFzZSB3cml0ZXMgZnJvbSBvdXRzaWRlIHRoZSBNZXRlb3JcbiAgLy8gdW5pdmVyc2UuXG4gIC8vXG4gIC8vIEZvciB0ZXN0aW5nLCB0aGVyZSdzIGFuIHVuZG9jdW1lbnRlZCBjYWxsYmFjayBhcmd1bWVudCB0byBvYnNlcnZlQ2hhbmdlc1xuICAvLyB3aGljaCBkaXNhYmxlcyB0aW1lLWJhc2VkIHBvbGxpbmcgYW5kIGdldHMgY2FsbGVkIGF0IHRoZSBiZWdpbm5pbmcgb2YgZWFjaFxuICAvLyBwb2xsLlxuICBpZiAob3B0aW9ucy5fdGVzdE9ubHlQb2xsQ2FsbGJhY2spIHtcbiAgICBzZWxmLl90ZXN0T25seVBvbGxDYWxsYmFjayA9IG9wdGlvbnMuX3Rlc3RPbmx5UG9sbENhbGxiYWNrO1xuICB9IGVsc2Uge1xuICAgIHZhciBwb2xsaW5nSW50ZXJ2YWwgPVxuICAgICAgICAgIHNlbGYuX2N1cnNvckRlc2NyaXB0aW9uLm9wdGlvbnMucG9sbGluZ0ludGVydmFsTXMgfHxcbiAgICAgICAgICBzZWxmLl9jdXJzb3JEZXNjcmlwdGlvbi5vcHRpb25zLl9wb2xsaW5nSW50ZXJ2YWwgfHwgLy8gQ09NUEFUIHdpdGggMS4yXG4gICAgICAgICAgUE9MTElOR19JTlRFUlZBTF9NUztcbiAgICB2YXIgaW50ZXJ2YWxIYW5kbGUgPSBNZXRlb3Iuc2V0SW50ZXJ2YWwoXG4gICAgICBfLmJpbmQoc2VsZi5fZW5zdXJlUG9sbElzU2NoZWR1bGVkLCBzZWxmKSwgcG9sbGluZ0ludGVydmFsKTtcbiAgICBzZWxmLl9zdG9wQ2FsbGJhY2tzLnB1c2goZnVuY3Rpb24gKCkge1xuICAgICAgTWV0ZW9yLmNsZWFySW50ZXJ2YWwoaW50ZXJ2YWxIYW5kbGUpO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gTWFrZSBzdXJlIHdlIGFjdHVhbGx5IHBvbGwgc29vbiFcbiAgc2VsZi5fdW50aHJvdHRsZWRFbnN1cmVQb2xsSXNTY2hlZHVsZWQoKTtcblxuICBQYWNrYWdlWydmYWN0cy1iYXNlJ10gJiYgUGFja2FnZVsnZmFjdHMtYmFzZSddLkZhY3RzLmluY3JlbWVudFNlcnZlckZhY3QoXG4gICAgXCJtb25nby1saXZlZGF0YVwiLCBcIm9ic2VydmUtZHJpdmVycy1wb2xsaW5nXCIsIDEpO1xufTtcblxuXy5leHRlbmQoUG9sbGluZ09ic2VydmVEcml2ZXIucHJvdG90eXBlLCB7XG4gIC8vIFRoaXMgaXMgYWx3YXlzIGNhbGxlZCB0aHJvdWdoIF8udGhyb3R0bGUgKGV4Y2VwdCBvbmNlIGF0IHN0YXJ0dXApLlxuICBfdW50aHJvdHRsZWRFbnN1cmVQb2xsSXNTY2hlZHVsZWQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgaWYgKHNlbGYuX3BvbGxzU2NoZWR1bGVkQnV0Tm90U3RhcnRlZCA+IDApXG4gICAgICByZXR1cm47XG4gICAgKytzZWxmLl9wb2xsc1NjaGVkdWxlZEJ1dE5vdFN0YXJ0ZWQ7XG4gICAgc2VsZi5fdGFza1F1ZXVlLnF1ZXVlVGFzayhmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLl9wb2xsTW9uZ28oKTtcbiAgICB9KTtcbiAgfSxcblxuICAvLyB0ZXN0LW9ubHkgaW50ZXJmYWNlIGZvciBjb250cm9sbGluZyBwb2xsaW5nLlxuICAvL1xuICAvLyBfc3VzcGVuZFBvbGxpbmcgYmxvY2tzIHVudGlsIGFueSBjdXJyZW50bHkgcnVubmluZyBhbmQgc2NoZWR1bGVkIHBvbGxzIGFyZVxuICAvLyBkb25lLCBhbmQgcHJldmVudHMgYW55IGZ1cnRoZXIgcG9sbHMgZnJvbSBiZWluZyBzY2hlZHVsZWQuIChuZXdcbiAgLy8gT2JzZXJ2ZUhhbmRsZXMgY2FuIGJlIGFkZGVkIGFuZCByZWNlaXZlIHRoZWlyIGluaXRpYWwgYWRkZWQgY2FsbGJhY2tzLFxuICAvLyB0aG91Z2guKVxuICAvL1xuICAvLyBfcmVzdW1lUG9sbGluZyBpbW1lZGlhdGVseSBwb2xscywgYW5kIGFsbG93cyBmdXJ0aGVyIHBvbGxzIHRvIG9jY3VyLlxuICBfc3VzcGVuZFBvbGxpbmc6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAvLyBQcmV0ZW5kIHRoYXQgdGhlcmUncyBhbm90aGVyIHBvbGwgc2NoZWR1bGVkICh3aGljaCB3aWxsIHByZXZlbnRcbiAgICAvLyBfZW5zdXJlUG9sbElzU2NoZWR1bGVkIGZyb20gcXVldWVpbmcgYW55IG1vcmUgcG9sbHMpLlxuICAgICsrc2VsZi5fcG9sbHNTY2hlZHVsZWRCdXROb3RTdGFydGVkO1xuICAgIC8vIE5vdyBibG9jayB1bnRpbCBhbGwgY3VycmVudGx5IHJ1bm5pbmcgb3Igc2NoZWR1bGVkIHBvbGxzIGFyZSBkb25lLlxuICAgIHNlbGYuX3Rhc2tRdWV1ZS5ydW5UYXNrKGZ1bmN0aW9uKCkge30pO1xuXG4gICAgLy8gQ29uZmlybSB0aGF0IHRoZXJlIGlzIG9ubHkgb25lIFwicG9sbFwiICh0aGUgZmFrZSBvbmUgd2UncmUgcHJldGVuZGluZyB0b1xuICAgIC8vIGhhdmUpIHNjaGVkdWxlZC5cbiAgICBpZiAoc2VsZi5fcG9sbHNTY2hlZHVsZWRCdXROb3RTdGFydGVkICE9PSAxKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiX3BvbGxzU2NoZWR1bGVkQnV0Tm90U3RhcnRlZCBpcyBcIiArXG4gICAgICAgICAgICAgICAgICAgICAgc2VsZi5fcG9sbHNTY2hlZHVsZWRCdXROb3RTdGFydGVkKTtcbiAgfSxcbiAgX3Jlc3VtZVBvbGxpbmc6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAvLyBXZSBzaG91bGQgYmUgaW4gdGhlIHNhbWUgc3RhdGUgYXMgaW4gdGhlIGVuZCBvZiBfc3VzcGVuZFBvbGxpbmcuXG4gICAgaWYgKHNlbGYuX3BvbGxzU2NoZWR1bGVkQnV0Tm90U3RhcnRlZCAhPT0gMSlcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIl9wb2xsc1NjaGVkdWxlZEJ1dE5vdFN0YXJ0ZWQgaXMgXCIgK1xuICAgICAgICAgICAgICAgICAgICAgIHNlbGYuX3BvbGxzU2NoZWR1bGVkQnV0Tm90U3RhcnRlZCk7XG4gICAgLy8gUnVuIGEgcG9sbCBzeW5jaHJvbm91c2x5ICh3aGljaCB3aWxsIGNvdW50ZXJhY3QgdGhlXG4gICAgLy8gKytfcG9sbHNTY2hlZHVsZWRCdXROb3RTdGFydGVkIGZyb20gX3N1c3BlbmRQb2xsaW5nKS5cbiAgICBzZWxmLl90YXNrUXVldWUucnVuVGFzayhmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLl9wb2xsTW9uZ28oKTtcbiAgICB9KTtcbiAgfSxcblxuICBfcG9sbE1vbmdvOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIC0tc2VsZi5fcG9sbHNTY2hlZHVsZWRCdXROb3RTdGFydGVkO1xuXG4gICAgaWYgKHNlbGYuX3N0b3BwZWQpXG4gICAgICByZXR1cm47XG5cbiAgICB2YXIgZmlyc3QgPSBmYWxzZTtcbiAgICB2YXIgbmV3UmVzdWx0cztcbiAgICB2YXIgb2xkUmVzdWx0cyA9IHNlbGYuX3Jlc3VsdHM7XG4gICAgaWYgKCFvbGRSZXN1bHRzKSB7XG4gICAgICBmaXJzdCA9IHRydWU7XG4gICAgICAvLyBYWFggbWF5YmUgdXNlIE9yZGVyZWREaWN0IGluc3RlYWQ/XG4gICAgICBvbGRSZXN1bHRzID0gc2VsZi5fb3JkZXJlZCA/IFtdIDogbmV3IExvY2FsQ29sbGVjdGlvbi5fSWRNYXA7XG4gICAgfVxuXG4gICAgc2VsZi5fdGVzdE9ubHlQb2xsQ2FsbGJhY2sgJiYgc2VsZi5fdGVzdE9ubHlQb2xsQ2FsbGJhY2soKTtcblxuICAgIC8vIFNhdmUgdGhlIGxpc3Qgb2YgcGVuZGluZyB3cml0ZXMgd2hpY2ggdGhpcyByb3VuZCB3aWxsIGNvbW1pdC5cbiAgICB2YXIgd3JpdGVzRm9yQ3ljbGUgPSBzZWxmLl9wZW5kaW5nV3JpdGVzO1xuICAgIHNlbGYuX3BlbmRpbmdXcml0ZXMgPSBbXTtcblxuICAgIC8vIEdldCB0aGUgbmV3IHF1ZXJ5IHJlc3VsdHMuIChUaGlzIHlpZWxkcy4pXG4gICAgdHJ5IHtcbiAgICAgIG5ld1Jlc3VsdHMgPSBzZWxmLl9zeW5jaHJvbm91c0N1cnNvci5nZXRSYXdPYmplY3RzKHNlbGYuX29yZGVyZWQpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGlmIChmaXJzdCAmJiB0eXBlb2YoZS5jb2RlKSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgLy8gVGhpcyBpcyBhbiBlcnJvciBkb2N1bWVudCBzZW50IHRvIHVzIGJ5IG1vbmdvZCwgbm90IGEgY29ubmVjdGlvblxuICAgICAgICAvLyBlcnJvciBnZW5lcmF0ZWQgYnkgdGhlIGNsaWVudC4gQW5kIHdlJ3ZlIG5ldmVyIHNlZW4gdGhpcyBxdWVyeSB3b3JrXG4gICAgICAgIC8vIHN1Y2Nlc3NmdWxseS4gUHJvYmFibHkgaXQncyBhIGJhZCBzZWxlY3RvciBvciBzb21ldGhpbmcsIHNvIHdlIHNob3VsZFxuICAgICAgICAvLyBOT1QgcmV0cnkuIEluc3RlYWQsIHdlIHNob3VsZCBoYWx0IHRoZSBvYnNlcnZlICh3aGljaCBlbmRzIHVwIGNhbGxpbmdcbiAgICAgICAgLy8gYHN0b3BgIG9uIHVzKS5cbiAgICAgICAgc2VsZi5fbXVsdGlwbGV4ZXIucXVlcnlFcnJvcihcbiAgICAgICAgICBuZXcgRXJyb3IoXG4gICAgICAgICAgICBcIkV4Y2VwdGlvbiB3aGlsZSBwb2xsaW5nIHF1ZXJ5IFwiICtcbiAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoc2VsZi5fY3Vyc29yRGVzY3JpcHRpb24pICsgXCI6IFwiICsgZS5tZXNzYWdlKSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gZ2V0UmF3T2JqZWN0cyBjYW4gdGhyb3cgaWYgd2UncmUgaGF2aW5nIHRyb3VibGUgdGFsa2luZyB0byB0aGVcbiAgICAgIC8vIGRhdGFiYXNlLiAgVGhhdCdzIGZpbmUgLS0tIHdlIHdpbGwgcmVwb2xsIGxhdGVyIGFueXdheS4gQnV0IHdlIHNob3VsZFxuICAgICAgLy8gbWFrZSBzdXJlIG5vdCB0byBsb3NlIHRyYWNrIG9mIHRoaXMgY3ljbGUncyB3cml0ZXMuXG4gICAgICAvLyAoSXQgYWxzbyBjYW4gdGhyb3cgaWYgdGhlcmUncyBqdXN0IHNvbWV0aGluZyBpbnZhbGlkIGFib3V0IHRoaXMgcXVlcnk7XG4gICAgICAvLyB1bmZvcnR1bmF0ZWx5IHRoZSBPYnNlcnZlRHJpdmVyIEFQSSBkb2Vzbid0IHByb3ZpZGUgYSBnb29kIHdheSB0b1xuICAgICAgLy8gXCJjYW5jZWxcIiB0aGUgb2JzZXJ2ZSBmcm9tIHRoZSBpbnNpZGUgaW4gdGhpcyBjYXNlLlxuICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkoc2VsZi5fcGVuZGluZ1dyaXRlcywgd3JpdGVzRm9yQ3ljbGUpO1xuICAgICAgTWV0ZW9yLl9kZWJ1ZyhcIkV4Y2VwdGlvbiB3aGlsZSBwb2xsaW5nIHF1ZXJ5IFwiICtcbiAgICAgICAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoc2VsZi5fY3Vyc29yRGVzY3JpcHRpb24pLCBlKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBSdW4gZGlmZnMuXG4gICAgaWYgKCFzZWxmLl9zdG9wcGVkKSB7XG4gICAgICBMb2NhbENvbGxlY3Rpb24uX2RpZmZRdWVyeUNoYW5nZXMoXG4gICAgICAgIHNlbGYuX29yZGVyZWQsIG9sZFJlc3VsdHMsIG5ld1Jlc3VsdHMsIHNlbGYuX211bHRpcGxleGVyKTtcbiAgICB9XG5cbiAgICAvLyBTaWduYWxzIHRoZSBtdWx0aXBsZXhlciB0byBhbGxvdyBhbGwgb2JzZXJ2ZUNoYW5nZXMgY2FsbHMgdGhhdCBzaGFyZSB0aGlzXG4gICAgLy8gbXVsdGlwbGV4ZXIgdG8gcmV0dXJuLiAoVGhpcyBoYXBwZW5zIGFzeW5jaHJvbm91c2x5LCB2aWEgdGhlXG4gICAgLy8gbXVsdGlwbGV4ZXIncyBxdWV1ZS4pXG4gICAgaWYgKGZpcnN0KVxuICAgICAgc2VsZi5fbXVsdGlwbGV4ZXIucmVhZHkoKTtcblxuICAgIC8vIFJlcGxhY2Ugc2VsZi5fcmVzdWx0cyBhdG9taWNhbGx5LiAgKFRoaXMgYXNzaWdubWVudCBpcyB3aGF0IG1ha2VzIGBmaXJzdGBcbiAgICAvLyBzdGF5IHRocm91Z2ggb24gdGhlIG5leHQgY3ljbGUsIHNvIHdlJ3ZlIHdhaXRlZCB1bnRpbCBhZnRlciB3ZSd2ZVxuICAgIC8vIGNvbW1pdHRlZCB0byByZWFkeS1pbmcgdGhlIG11bHRpcGxleGVyLilcbiAgICBzZWxmLl9yZXN1bHRzID0gbmV3UmVzdWx0cztcblxuICAgIC8vIE9uY2UgdGhlIE9ic2VydmVNdWx0aXBsZXhlciBoYXMgcHJvY2Vzc2VkIGV2ZXJ5dGhpbmcgd2UndmUgZG9uZSBpbiB0aGlzXG4gICAgLy8gcm91bmQsIG1hcmsgYWxsIHRoZSB3cml0ZXMgd2hpY2ggZXhpc3RlZCBiZWZvcmUgdGhpcyBjYWxsIGFzXG4gICAgLy8gY29tbW1pdHRlZC4gKElmIG5ldyB3cml0ZXMgaGF2ZSBzaG93biB1cCBpbiB0aGUgbWVhbnRpbWUsIHRoZXJlJ2xsXG4gICAgLy8gYWxyZWFkeSBiZSBhbm90aGVyIF9wb2xsTW9uZ28gdGFzayBzY2hlZHVsZWQuKVxuICAgIHNlbGYuX211bHRpcGxleGVyLm9uRmx1c2goZnVuY3Rpb24gKCkge1xuICAgICAgXy5lYWNoKHdyaXRlc0ZvckN5Y2xlLCBmdW5jdGlvbiAodykge1xuICAgICAgICB3LmNvbW1pdHRlZCgpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0sXG5cbiAgc3RvcDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBzZWxmLl9zdG9wcGVkID0gdHJ1ZTtcbiAgICBfLmVhY2goc2VsZi5fc3RvcENhbGxiYWNrcywgZnVuY3Rpb24gKGMpIHsgYygpOyB9KTtcbiAgICAvLyBSZWxlYXNlIGFueSB3cml0ZSBmZW5jZXMgdGhhdCBhcmUgd2FpdGluZyBvbiB1cy5cbiAgICBfLmVhY2goc2VsZi5fcGVuZGluZ1dyaXRlcywgZnVuY3Rpb24gKHcpIHtcbiAgICAgIHcuY29tbWl0dGVkKCk7XG4gICAgfSk7XG4gICAgUGFja2FnZVsnZmFjdHMtYmFzZSddICYmIFBhY2thZ2VbJ2ZhY3RzLWJhc2UnXS5GYWN0cy5pbmNyZW1lbnRTZXJ2ZXJGYWN0KFxuICAgICAgXCJtb25nby1saXZlZGF0YVwiLCBcIm9ic2VydmUtZHJpdmVycy1wb2xsaW5nXCIsIC0xKTtcbiAgfVxufSk7XG4iLCJpbXBvcnQgeyBvcGxvZ1YyVjFDb252ZXJ0ZXIgfSBmcm9tICcuL29wbG9nX3YyX2NvbnZlcnRlcic7XG5cbnZhciBGdXR1cmUgPSBOcG0ucmVxdWlyZSgnZmliZXJzL2Z1dHVyZScpO1xuXG52YXIgUEhBU0UgPSB7XG4gIFFVRVJZSU5HOiBcIlFVRVJZSU5HXCIsXG4gIEZFVENISU5HOiBcIkZFVENISU5HXCIsXG4gIFNURUFEWTogXCJTVEVBRFlcIlxufTtcblxuLy8gRXhjZXB0aW9uIHRocm93biBieSBfbmVlZFRvUG9sbFF1ZXJ5IHdoaWNoIHVucm9sbHMgdGhlIHN0YWNrIHVwIHRvIHRoZVxuLy8gZW5jbG9zaW5nIGNhbGwgdG8gZmluaXNoSWZOZWVkVG9Qb2xsUXVlcnkuXG52YXIgU3dpdGNoZWRUb1F1ZXJ5ID0gZnVuY3Rpb24gKCkge307XG52YXIgZmluaXNoSWZOZWVkVG9Qb2xsUXVlcnkgPSBmdW5jdGlvbiAoZikge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICBmLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgaWYgKCEoZSBpbnN0YW5jZW9mIFN3aXRjaGVkVG9RdWVyeSkpXG4gICAgICAgIHRocm93IGU7XG4gICAgfVxuICB9O1xufTtcblxudmFyIGN1cnJlbnRJZCA9IDA7XG5cbi8vIE9wbG9nT2JzZXJ2ZURyaXZlciBpcyBhbiBhbHRlcm5hdGl2ZSB0byBQb2xsaW5nT2JzZXJ2ZURyaXZlciB3aGljaCBmb2xsb3dzXG4vLyB0aGUgTW9uZ28gb3BlcmF0aW9uIGxvZyBpbnN0ZWFkIG9mIGp1c3QgcmUtcG9sbGluZyB0aGUgcXVlcnkuIEl0IG9iZXlzIHRoZVxuLy8gc2FtZSBzaW1wbGUgaW50ZXJmYWNlOiBjb25zdHJ1Y3RpbmcgaXQgc3RhcnRzIHNlbmRpbmcgb2JzZXJ2ZUNoYW5nZXNcbi8vIGNhbGxiYWNrcyAoYW5kIGEgcmVhZHkoKSBpbnZvY2F0aW9uKSB0byB0aGUgT2JzZXJ2ZU11bHRpcGxleGVyLCBhbmQgeW91IHN0b3Bcbi8vIGl0IGJ5IGNhbGxpbmcgdGhlIHN0b3AoKSBtZXRob2QuXG5PcGxvZ09ic2VydmVEcml2ZXIgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHNlbGYuX3VzZXNPcGxvZyA9IHRydWU7ICAvLyB0ZXN0cyBsb29rIGF0IHRoaXNcblxuICBzZWxmLl9pZCA9IGN1cnJlbnRJZDtcbiAgY3VycmVudElkKys7XG5cbiAgc2VsZi5fY3Vyc29yRGVzY3JpcHRpb24gPSBvcHRpb25zLmN1cnNvckRlc2NyaXB0aW9uO1xuICBzZWxmLl9tb25nb0hhbmRsZSA9IG9wdGlvbnMubW9uZ29IYW5kbGU7XG4gIHNlbGYuX211bHRpcGxleGVyID0gb3B0aW9ucy5tdWx0aXBsZXhlcjtcblxuICBpZiAob3B0aW9ucy5vcmRlcmVkKSB7XG4gICAgdGhyb3cgRXJyb3IoXCJPcGxvZ09ic2VydmVEcml2ZXIgb25seSBzdXBwb3J0cyB1bm9yZGVyZWQgb2JzZXJ2ZUNoYW5nZXNcIik7XG4gIH1cblxuICB2YXIgc29ydGVyID0gb3B0aW9ucy5zb3J0ZXI7XG4gIC8vIFdlIGRvbid0IHN1cHBvcnQgJG5lYXIgYW5kIG90aGVyIGdlby1xdWVyaWVzIHNvIGl0J3MgT0sgdG8gaW5pdGlhbGl6ZSB0aGVcbiAgLy8gY29tcGFyYXRvciBvbmx5IG9uY2UgaW4gdGhlIGNvbnN0cnVjdG9yLlxuICB2YXIgY29tcGFyYXRvciA9IHNvcnRlciAmJiBzb3J0ZXIuZ2V0Q29tcGFyYXRvcigpO1xuXG4gIGlmIChvcHRpb25zLmN1cnNvckRlc2NyaXB0aW9uLm9wdGlvbnMubGltaXQpIHtcbiAgICAvLyBUaGVyZSBhcmUgc2V2ZXJhbCBwcm9wZXJ0aWVzIG9yZGVyZWQgZHJpdmVyIGltcGxlbWVudHM6XG4gICAgLy8gLSBfbGltaXQgaXMgYSBwb3NpdGl2ZSBudW1iZXJcbiAgICAvLyAtIF9jb21wYXJhdG9yIGlzIGEgZnVuY3Rpb24tY29tcGFyYXRvciBieSB3aGljaCB0aGUgcXVlcnkgaXMgb3JkZXJlZFxuICAgIC8vIC0gX3VucHVibGlzaGVkQnVmZmVyIGlzIG5vbi1udWxsIE1pbi9NYXggSGVhcCxcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICB0aGUgZW1wdHkgYnVmZmVyIGluIFNURUFEWSBwaGFzZSBpbXBsaWVzIHRoYXQgdGhlXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgZXZlcnl0aGluZyB0aGF0IG1hdGNoZXMgdGhlIHF1ZXJpZXMgc2VsZWN0b3IgZml0c1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgIGludG8gcHVibGlzaGVkIHNldC5cbiAgICAvLyAtIF9wdWJsaXNoZWQgLSBNaW4gSGVhcCAoYWxzbyBpbXBsZW1lbnRzIElkTWFwIG1ldGhvZHMpXG5cbiAgICB2YXIgaGVhcE9wdGlvbnMgPSB7IElkTWFwOiBMb2NhbENvbGxlY3Rpb24uX0lkTWFwIH07XG4gICAgc2VsZi5fbGltaXQgPSBzZWxmLl9jdXJzb3JEZXNjcmlwdGlvbi5vcHRpb25zLmxpbWl0O1xuICAgIHNlbGYuX2NvbXBhcmF0b3IgPSBjb21wYXJhdG9yO1xuICAgIHNlbGYuX3NvcnRlciA9IHNvcnRlcjtcbiAgICBzZWxmLl91bnB1Ymxpc2hlZEJ1ZmZlciA9IG5ldyBNaW5NYXhIZWFwKGNvbXBhcmF0b3IsIGhlYXBPcHRpb25zKTtcbiAgICAvLyBXZSBuZWVkIHNvbWV0aGluZyB0aGF0IGNhbiBmaW5kIE1heCB2YWx1ZSBpbiBhZGRpdGlvbiB0byBJZE1hcCBpbnRlcmZhY2VcbiAgICBzZWxmLl9wdWJsaXNoZWQgPSBuZXcgTWF4SGVhcChjb21wYXJhdG9yLCBoZWFwT3B0aW9ucyk7XG4gIH0gZWxzZSB7XG4gICAgc2VsZi5fbGltaXQgPSAwO1xuICAgIHNlbGYuX2NvbXBhcmF0b3IgPSBudWxsO1xuICAgIHNlbGYuX3NvcnRlciA9IG51bGw7XG4gICAgc2VsZi5fdW5wdWJsaXNoZWRCdWZmZXIgPSBudWxsO1xuICAgIHNlbGYuX3B1Ymxpc2hlZCA9IG5ldyBMb2NhbENvbGxlY3Rpb24uX0lkTWFwO1xuICB9XG5cbiAgLy8gSW5kaWNhdGVzIGlmIGl0IGlzIHNhZmUgdG8gaW5zZXJ0IGEgbmV3IGRvY3VtZW50IGF0IHRoZSBlbmQgb2YgdGhlIGJ1ZmZlclxuICAvLyBmb3IgdGhpcyBxdWVyeS4gaS5lLiBpdCBpcyBrbm93biB0aGF0IHRoZXJlIGFyZSBubyBkb2N1bWVudHMgbWF0Y2hpbmcgdGhlXG4gIC8vIHNlbGVjdG9yIHRob3NlIGFyZSBub3QgaW4gcHVibGlzaGVkIG9yIGJ1ZmZlci5cbiAgc2VsZi5fc2FmZUFwcGVuZFRvQnVmZmVyID0gZmFsc2U7XG5cbiAgc2VsZi5fc3RvcHBlZCA9IGZhbHNlO1xuICBzZWxmLl9zdG9wSGFuZGxlcyA9IFtdO1xuXG4gIFBhY2thZ2VbJ2ZhY3RzLWJhc2UnXSAmJiBQYWNrYWdlWydmYWN0cy1iYXNlJ10uRmFjdHMuaW5jcmVtZW50U2VydmVyRmFjdChcbiAgICBcIm1vbmdvLWxpdmVkYXRhXCIsIFwib2JzZXJ2ZS1kcml2ZXJzLW9wbG9nXCIsIDEpO1xuXG4gIHNlbGYuX3JlZ2lzdGVyUGhhc2VDaGFuZ2UoUEhBU0UuUVVFUllJTkcpO1xuXG4gIHNlbGYuX21hdGNoZXIgPSBvcHRpb25zLm1hdGNoZXI7XG4gIHZhciBwcm9qZWN0aW9uID0gc2VsZi5fY3Vyc29yRGVzY3JpcHRpb24ub3B0aW9ucy5maWVsZHMgfHwge307XG4gIHNlbGYuX3Byb2plY3Rpb25GbiA9IExvY2FsQ29sbGVjdGlvbi5fY29tcGlsZVByb2plY3Rpb24ocHJvamVjdGlvbik7XG4gIC8vIFByb2plY3Rpb24gZnVuY3Rpb24sIHJlc3VsdCBvZiBjb21iaW5pbmcgaW1wb3J0YW50IGZpZWxkcyBmb3Igc2VsZWN0b3IgYW5kXG4gIC8vIGV4aXN0aW5nIGZpZWxkcyBwcm9qZWN0aW9uXG4gIHNlbGYuX3NoYXJlZFByb2plY3Rpb24gPSBzZWxmLl9tYXRjaGVyLmNvbWJpbmVJbnRvUHJvamVjdGlvbihwcm9qZWN0aW9uKTtcbiAgaWYgKHNvcnRlcilcbiAgICBzZWxmLl9zaGFyZWRQcm9qZWN0aW9uID0gc29ydGVyLmNvbWJpbmVJbnRvUHJvamVjdGlvbihzZWxmLl9zaGFyZWRQcm9qZWN0aW9uKTtcbiAgc2VsZi5fc2hhcmVkUHJvamVjdGlvbkZuID0gTG9jYWxDb2xsZWN0aW9uLl9jb21waWxlUHJvamVjdGlvbihcbiAgICBzZWxmLl9zaGFyZWRQcm9qZWN0aW9uKTtcblxuICBzZWxmLl9uZWVkVG9GZXRjaCA9IG5ldyBMb2NhbENvbGxlY3Rpb24uX0lkTWFwO1xuICBzZWxmLl9jdXJyZW50bHlGZXRjaGluZyA9IG51bGw7XG4gIHNlbGYuX2ZldGNoR2VuZXJhdGlvbiA9IDA7XG5cbiAgc2VsZi5fcmVxdWVyeVdoZW5Eb25lVGhpc1F1ZXJ5ID0gZmFsc2U7XG4gIHNlbGYuX3dyaXRlc1RvQ29tbWl0V2hlbldlUmVhY2hTdGVhZHkgPSBbXTtcblxuICAvLyBJZiB0aGUgb3Bsb2cgaGFuZGxlIHRlbGxzIHVzIHRoYXQgaXQgc2tpcHBlZCBzb21lIGVudHJpZXMgKGJlY2F1c2UgaXQgZ290XG4gIC8vIGJlaGluZCwgc2F5KSwgcmUtcG9sbC5cbiAgc2VsZi5fc3RvcEhhbmRsZXMucHVzaChzZWxmLl9tb25nb0hhbmRsZS5fb3Bsb2dIYW5kbGUub25Ta2lwcGVkRW50cmllcyhcbiAgICBmaW5pc2hJZk5lZWRUb1BvbGxRdWVyeShmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLl9uZWVkVG9Qb2xsUXVlcnkoKTtcbiAgICB9KVxuICApKTtcblxuICBmb3JFYWNoVHJpZ2dlcihzZWxmLl9jdXJzb3JEZXNjcmlwdGlvbiwgZnVuY3Rpb24gKHRyaWdnZXIpIHtcbiAgICBzZWxmLl9zdG9wSGFuZGxlcy5wdXNoKHNlbGYuX21vbmdvSGFuZGxlLl9vcGxvZ0hhbmRsZS5vbk9wbG9nRW50cnkoXG4gICAgICB0cmlnZ2VyLCBmdW5jdGlvbiAobm90aWZpY2F0aW9uKSB7XG4gICAgICAgIE1ldGVvci5fbm9ZaWVsZHNBbGxvd2VkKGZpbmlzaElmTmVlZFRvUG9sbFF1ZXJ5KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB2YXIgb3AgPSBub3RpZmljYXRpb24ub3A7XG4gICAgICAgICAgaWYgKG5vdGlmaWNhdGlvbi5kcm9wQ29sbGVjdGlvbiB8fCBub3RpZmljYXRpb24uZHJvcERhdGFiYXNlKSB7XG4gICAgICAgICAgICAvLyBOb3RlOiB0aGlzIGNhbGwgaXMgbm90IGFsbG93ZWQgdG8gYmxvY2sgb24gYW55dGhpbmcgKGVzcGVjaWFsbHlcbiAgICAgICAgICAgIC8vIG9uIHdhaXRpbmcgZm9yIG9wbG9nIGVudHJpZXMgdG8gY2F0Y2ggdXApIGJlY2F1c2UgdGhhdCB3aWxsIGJsb2NrXG4gICAgICAgICAgICAvLyBvbk9wbG9nRW50cnkhXG4gICAgICAgICAgICBzZWxmLl9uZWVkVG9Qb2xsUXVlcnkoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gQWxsIG90aGVyIG9wZXJhdG9ycyBzaG91bGQgYmUgaGFuZGxlZCBkZXBlbmRpbmcgb24gcGhhc2VcbiAgICAgICAgICAgIGlmIChzZWxmLl9waGFzZSA9PT0gUEhBU0UuUVVFUllJTkcpIHtcbiAgICAgICAgICAgICAgc2VsZi5faGFuZGxlT3Bsb2dFbnRyeVF1ZXJ5aW5nKG9wKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHNlbGYuX2hhbmRsZU9wbG9nRW50cnlTdGVhZHlPckZldGNoaW5nKG9wKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pKTtcbiAgICAgIH1cbiAgICApKTtcbiAgfSk7XG5cbiAgLy8gWFhYIG9yZGVyaW5nIHcuci50LiBldmVyeXRoaW5nIGVsc2U/XG4gIHNlbGYuX3N0b3BIYW5kbGVzLnB1c2gobGlzdGVuQWxsKFxuICAgIHNlbGYuX2N1cnNvckRlc2NyaXB0aW9uLCBmdW5jdGlvbiAobm90aWZpY2F0aW9uKSB7XG4gICAgICAvLyBJZiB3ZSdyZSBub3QgaW4gYSBwcmUtZmlyZSB3cml0ZSBmZW5jZSwgd2UgZG9uJ3QgaGF2ZSB0byBkbyBhbnl0aGluZy5cbiAgICAgIHZhciBmZW5jZSA9IEREUFNlcnZlci5fQ3VycmVudFdyaXRlRmVuY2UuZ2V0KCk7XG4gICAgICBpZiAoIWZlbmNlIHx8IGZlbmNlLmZpcmVkKVxuICAgICAgICByZXR1cm47XG5cbiAgICAgIGlmIChmZW5jZS5fb3Bsb2dPYnNlcnZlRHJpdmVycykge1xuICAgICAgICBmZW5jZS5fb3Bsb2dPYnNlcnZlRHJpdmVyc1tzZWxmLl9pZF0gPSBzZWxmO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGZlbmNlLl9vcGxvZ09ic2VydmVEcml2ZXJzID0ge307XG4gICAgICBmZW5jZS5fb3Bsb2dPYnNlcnZlRHJpdmVyc1tzZWxmLl9pZF0gPSBzZWxmO1xuXG4gICAgICBmZW5jZS5vbkJlZm9yZUZpcmUoZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZHJpdmVycyA9IGZlbmNlLl9vcGxvZ09ic2VydmVEcml2ZXJzO1xuICAgICAgICBkZWxldGUgZmVuY2UuX29wbG9nT2JzZXJ2ZURyaXZlcnM7XG5cbiAgICAgICAgLy8gVGhpcyBmZW5jZSBjYW5ub3QgZmlyZSB1bnRpbCB3ZSd2ZSBjYXVnaHQgdXAgdG8gXCJ0aGlzIHBvaW50XCIgaW4gdGhlXG4gICAgICAgIC8vIG9wbG9nLCBhbmQgYWxsIG9ic2VydmVycyBtYWRlIGl0IGJhY2sgdG8gdGhlIHN0ZWFkeSBzdGF0ZS5cbiAgICAgICAgc2VsZi5fbW9uZ29IYW5kbGUuX29wbG9nSGFuZGxlLndhaXRVbnRpbENhdWdodFVwKCk7XG5cbiAgICAgICAgXy5lYWNoKGRyaXZlcnMsIGZ1bmN0aW9uIChkcml2ZXIpIHtcbiAgICAgICAgICBpZiAoZHJpdmVyLl9zdG9wcGVkKVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgICAgdmFyIHdyaXRlID0gZmVuY2UuYmVnaW5Xcml0ZSgpO1xuICAgICAgICAgIGlmIChkcml2ZXIuX3BoYXNlID09PSBQSEFTRS5TVEVBRFkpIHtcbiAgICAgICAgICAgIC8vIE1ha2Ugc3VyZSB0aGF0IGFsbCBvZiB0aGUgY2FsbGJhY2tzIGhhdmUgbWFkZSBpdCB0aHJvdWdoIHRoZVxuICAgICAgICAgICAgLy8gbXVsdGlwbGV4ZXIgYW5kIGJlZW4gZGVsaXZlcmVkIHRvIE9ic2VydmVIYW5kbGVzIGJlZm9yZSBjb21taXR0aW5nXG4gICAgICAgICAgICAvLyB3cml0ZXMuXG4gICAgICAgICAgICBkcml2ZXIuX211bHRpcGxleGVyLm9uRmx1c2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICB3cml0ZS5jb21taXR0ZWQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkcml2ZXIuX3dyaXRlc1RvQ29tbWl0V2hlbldlUmVhY2hTdGVhZHkucHVzaCh3cml0ZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgKSk7XG5cbiAgLy8gV2hlbiBNb25nbyBmYWlscyBvdmVyLCB3ZSBuZWVkIHRvIHJlcG9sbCB0aGUgcXVlcnksIGluIGNhc2Ugd2UgcHJvY2Vzc2VkIGFuXG4gIC8vIG9wbG9nIGVudHJ5IHRoYXQgZ290IHJvbGxlZCBiYWNrLlxuICBzZWxmLl9zdG9wSGFuZGxlcy5wdXNoKHNlbGYuX21vbmdvSGFuZGxlLl9vbkZhaWxvdmVyKGZpbmlzaElmTmVlZFRvUG9sbFF1ZXJ5KFxuICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYuX25lZWRUb1BvbGxRdWVyeSgpO1xuICAgIH0pKSk7XG5cbiAgLy8gR2l2ZSBfb2JzZXJ2ZUNoYW5nZXMgYSBjaGFuY2UgdG8gYWRkIHRoZSBuZXcgT2JzZXJ2ZUhhbmRsZSB0byBvdXJcbiAgLy8gbXVsdGlwbGV4ZXIsIHNvIHRoYXQgdGhlIGFkZGVkIGNhbGxzIGdldCBzdHJlYW1lZC5cbiAgTWV0ZW9yLmRlZmVyKGZpbmlzaElmTmVlZFRvUG9sbFF1ZXJ5KGZ1bmN0aW9uICgpIHtcbiAgICBzZWxmLl9ydW5Jbml0aWFsUXVlcnkoKTtcbiAgfSkpO1xufTtcblxuXy5leHRlbmQoT3Bsb2dPYnNlcnZlRHJpdmVyLnByb3RvdHlwZSwge1xuICBfYWRkUHVibGlzaGVkOiBmdW5jdGlvbiAoaWQsIGRvYykge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBNZXRlb3IuX25vWWllbGRzQWxsb3dlZChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgZmllbGRzID0gXy5jbG9uZShkb2MpO1xuICAgICAgZGVsZXRlIGZpZWxkcy5faWQ7XG4gICAgICBzZWxmLl9wdWJsaXNoZWQuc2V0KGlkLCBzZWxmLl9zaGFyZWRQcm9qZWN0aW9uRm4oZG9jKSk7XG4gICAgICBzZWxmLl9tdWx0aXBsZXhlci5hZGRlZChpZCwgc2VsZi5fcHJvamVjdGlvbkZuKGZpZWxkcykpO1xuXG4gICAgICAvLyBBZnRlciBhZGRpbmcgdGhpcyBkb2N1bWVudCwgdGhlIHB1Ymxpc2hlZCBzZXQgbWlnaHQgYmUgb3ZlcmZsb3dlZFxuICAgICAgLy8gKGV4Y2VlZGluZyBjYXBhY2l0eSBzcGVjaWZpZWQgYnkgbGltaXQpLiBJZiBzbywgcHVzaCB0aGUgbWF4aW11bVxuICAgICAgLy8gZWxlbWVudCB0byB0aGUgYnVmZmVyLCB3ZSBtaWdodCB3YW50IHRvIHNhdmUgaXQgaW4gbWVtb3J5IHRvIHJlZHVjZSB0aGVcbiAgICAgIC8vIGFtb3VudCBvZiBNb25nbyBsb29rdXBzIGluIHRoZSBmdXR1cmUuXG4gICAgICBpZiAoc2VsZi5fbGltaXQgJiYgc2VsZi5fcHVibGlzaGVkLnNpemUoKSA+IHNlbGYuX2xpbWl0KSB7XG4gICAgICAgIC8vIFhYWCBpbiB0aGVvcnkgdGhlIHNpemUgb2YgcHVibGlzaGVkIGlzIG5vIG1vcmUgdGhhbiBsaW1pdCsxXG4gICAgICAgIGlmIChzZWxmLl9wdWJsaXNoZWQuc2l6ZSgpICE9PSBzZWxmLl9saW1pdCArIDEpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBZnRlciBhZGRpbmcgdG8gcHVibGlzaGVkLCBcIiArXG4gICAgICAgICAgICAgICAgICAgICAgICAgIChzZWxmLl9wdWJsaXNoZWQuc2l6ZSgpIC0gc2VsZi5fbGltaXQpICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCIgZG9jdW1lbnRzIGFyZSBvdmVyZmxvd2luZyB0aGUgc2V0XCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIG92ZXJmbG93aW5nRG9jSWQgPSBzZWxmLl9wdWJsaXNoZWQubWF4RWxlbWVudElkKCk7XG4gICAgICAgIHZhciBvdmVyZmxvd2luZ0RvYyA9IHNlbGYuX3B1Ymxpc2hlZC5nZXQob3ZlcmZsb3dpbmdEb2NJZCk7XG5cbiAgICAgICAgaWYgKEVKU09OLmVxdWFscyhvdmVyZmxvd2luZ0RvY0lkLCBpZCkpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgZG9jdW1lbnQganVzdCBhZGRlZCBpcyBvdmVyZmxvd2luZyB0aGUgcHVibGlzaGVkIHNldFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNlbGYuX3B1Ymxpc2hlZC5yZW1vdmUob3ZlcmZsb3dpbmdEb2NJZCk7XG4gICAgICAgIHNlbGYuX211bHRpcGxleGVyLnJlbW92ZWQob3ZlcmZsb3dpbmdEb2NJZCk7XG4gICAgICAgIHNlbGYuX2FkZEJ1ZmZlcmVkKG92ZXJmbG93aW5nRG9jSWQsIG92ZXJmbG93aW5nRG9jKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcbiAgX3JlbW92ZVB1Ymxpc2hlZDogZnVuY3Rpb24gKGlkKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIE1ldGVvci5fbm9ZaWVsZHNBbGxvd2VkKGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYuX3B1Ymxpc2hlZC5yZW1vdmUoaWQpO1xuICAgICAgc2VsZi5fbXVsdGlwbGV4ZXIucmVtb3ZlZChpZCk7XG4gICAgICBpZiAoISBzZWxmLl9saW1pdCB8fCBzZWxmLl9wdWJsaXNoZWQuc2l6ZSgpID09PSBzZWxmLl9saW1pdClcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICBpZiAoc2VsZi5fcHVibGlzaGVkLnNpemUoKSA+IHNlbGYuX2xpbWl0KVxuICAgICAgICB0aHJvdyBFcnJvcihcInNlbGYuX3B1Ymxpc2hlZCBnb3QgdG9vIGJpZ1wiKTtcblxuICAgICAgLy8gT0ssIHdlIGFyZSBwdWJsaXNoaW5nIGxlc3MgdGhhbiB0aGUgbGltaXQuIE1heWJlIHdlIHNob3VsZCBsb29rIGluIHRoZVxuICAgICAgLy8gYnVmZmVyIHRvIGZpbmQgdGhlIG5leHQgZWxlbWVudCBwYXN0IHdoYXQgd2Ugd2VyZSBwdWJsaXNoaW5nIGJlZm9yZS5cblxuICAgICAgaWYgKCFzZWxmLl91bnB1Ymxpc2hlZEJ1ZmZlci5lbXB0eSgpKSB7XG4gICAgICAgIC8vIFRoZXJlJ3Mgc29tZXRoaW5nIGluIHRoZSBidWZmZXI7IG1vdmUgdGhlIGZpcnN0IHRoaW5nIGluIGl0IHRvXG4gICAgICAgIC8vIF9wdWJsaXNoZWQuXG4gICAgICAgIHZhciBuZXdEb2NJZCA9IHNlbGYuX3VucHVibGlzaGVkQnVmZmVyLm1pbkVsZW1lbnRJZCgpO1xuICAgICAgICB2YXIgbmV3RG9jID0gc2VsZi5fdW5wdWJsaXNoZWRCdWZmZXIuZ2V0KG5ld0RvY0lkKTtcbiAgICAgICAgc2VsZi5fcmVtb3ZlQnVmZmVyZWQobmV3RG9jSWQpO1xuICAgICAgICBzZWxmLl9hZGRQdWJsaXNoZWQobmV3RG9jSWQsIG5ld0RvYyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gVGhlcmUncyBub3RoaW5nIGluIHRoZSBidWZmZXIuICBUaGlzIGNvdWxkIG1lYW4gb25lIG9mIGEgZmV3IHRoaW5ncy5cblxuICAgICAgLy8gKGEpIFdlIGNvdWxkIGJlIGluIHRoZSBtaWRkbGUgb2YgcmUtcnVubmluZyB0aGUgcXVlcnkgKHNwZWNpZmljYWxseSwgd2VcbiAgICAgIC8vIGNvdWxkIGJlIGluIF9wdWJsaXNoTmV3UmVzdWx0cykuIEluIHRoYXQgY2FzZSwgX3VucHVibGlzaGVkQnVmZmVyIGlzXG4gICAgICAvLyBlbXB0eSBiZWNhdXNlIHdlIGNsZWFyIGl0IGF0IHRoZSBiZWdpbm5pbmcgb2YgX3B1Ymxpc2hOZXdSZXN1bHRzLiBJblxuICAgICAgLy8gdGhpcyBjYXNlLCBvdXIgY2FsbGVyIGFscmVhZHkga25vd3MgdGhlIGVudGlyZSBhbnN3ZXIgdG8gdGhlIHF1ZXJ5IGFuZFxuICAgICAgLy8gd2UgZG9uJ3QgbmVlZCB0byBkbyBhbnl0aGluZyBmYW5jeSBoZXJlLiAgSnVzdCByZXR1cm4uXG4gICAgICBpZiAoc2VsZi5fcGhhc2UgPT09IFBIQVNFLlFVRVJZSU5HKVxuICAgICAgICByZXR1cm47XG5cbiAgICAgIC8vIChiKSBXZSdyZSBwcmV0dHkgY29uZmlkZW50IHRoYXQgdGhlIHVuaW9uIG9mIF9wdWJsaXNoZWQgYW5kXG4gICAgICAvLyBfdW5wdWJsaXNoZWRCdWZmZXIgY29udGFpbiBhbGwgZG9jdW1lbnRzIHRoYXQgbWF0Y2ggc2VsZWN0b3IuIEJlY2F1c2VcbiAgICAgIC8vIF91bnB1Ymxpc2hlZEJ1ZmZlciBpcyBlbXB0eSwgdGhhdCBtZWFucyB3ZSdyZSBjb25maWRlbnQgdGhhdCBfcHVibGlzaGVkXG4gICAgICAvLyBjb250YWlucyBhbGwgZG9jdW1lbnRzIHRoYXQgbWF0Y2ggc2VsZWN0b3IuIFNvIHdlIGhhdmUgbm90aGluZyB0byBkby5cbiAgICAgIGlmIChzZWxmLl9zYWZlQXBwZW5kVG9CdWZmZXIpXG4gICAgICAgIHJldHVybjtcblxuICAgICAgLy8gKGMpIE1heWJlIHRoZXJlIGFyZSBvdGhlciBkb2N1bWVudHMgb3V0IHRoZXJlIHRoYXQgc2hvdWxkIGJlIGluIG91clxuICAgICAgLy8gYnVmZmVyLiBCdXQgaW4gdGhhdCBjYXNlLCB3aGVuIHdlIGVtcHRpZWQgX3VucHVibGlzaGVkQnVmZmVyIGluXG4gICAgICAvLyBfcmVtb3ZlQnVmZmVyZWQsIHdlIHNob3VsZCBoYXZlIGNhbGxlZCBfbmVlZFRvUG9sbFF1ZXJ5LCB3aGljaCB3aWxsXG4gICAgICAvLyBlaXRoZXIgcHV0IHNvbWV0aGluZyBpbiBfdW5wdWJsaXNoZWRCdWZmZXIgb3Igc2V0IF9zYWZlQXBwZW5kVG9CdWZmZXJcbiAgICAgIC8vIChvciBib3RoKSwgYW5kIGl0IHdpbGwgcHV0IHVzIGluIFFVRVJZSU5HIGZvciB0aGF0IHdob2xlIHRpbWUuIFNvIGluXG4gICAgICAvLyBmYWN0LCB3ZSBzaG91bGRuJ3QgYmUgYWJsZSB0byBnZXQgaGVyZS5cblxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQnVmZmVyIGluZXhwbGljYWJseSBlbXB0eVwiKTtcbiAgICB9KTtcbiAgfSxcbiAgX2NoYW5nZVB1Ymxpc2hlZDogZnVuY3Rpb24gKGlkLCBvbGREb2MsIG5ld0RvYykge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBNZXRlb3IuX25vWWllbGRzQWxsb3dlZChmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLl9wdWJsaXNoZWQuc2V0KGlkLCBzZWxmLl9zaGFyZWRQcm9qZWN0aW9uRm4obmV3RG9jKSk7XG4gICAgICB2YXIgcHJvamVjdGVkTmV3ID0gc2VsZi5fcHJvamVjdGlvbkZuKG5ld0RvYyk7XG4gICAgICB2YXIgcHJvamVjdGVkT2xkID0gc2VsZi5fcHJvamVjdGlvbkZuKG9sZERvYyk7XG4gICAgICB2YXIgY2hhbmdlZCA9IERpZmZTZXF1ZW5jZS5tYWtlQ2hhbmdlZEZpZWxkcyhcbiAgICAgICAgcHJvamVjdGVkTmV3LCBwcm9qZWN0ZWRPbGQpO1xuICAgICAgaWYgKCFfLmlzRW1wdHkoY2hhbmdlZCkpXG4gICAgICAgIHNlbGYuX211bHRpcGxleGVyLmNoYW5nZWQoaWQsIGNoYW5nZWQpO1xuICAgIH0pO1xuICB9LFxuICBfYWRkQnVmZmVyZWQ6IGZ1bmN0aW9uIChpZCwgZG9jKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIE1ldGVvci5fbm9ZaWVsZHNBbGxvd2VkKGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYuX3VucHVibGlzaGVkQnVmZmVyLnNldChpZCwgc2VsZi5fc2hhcmVkUHJvamVjdGlvbkZuKGRvYykpO1xuXG4gICAgICAvLyBJZiBzb21ldGhpbmcgaXMgb3ZlcmZsb3dpbmcgdGhlIGJ1ZmZlciwgd2UganVzdCByZW1vdmUgaXQgZnJvbSBjYWNoZVxuICAgICAgaWYgKHNlbGYuX3VucHVibGlzaGVkQnVmZmVyLnNpemUoKSA+IHNlbGYuX2xpbWl0KSB7XG4gICAgICAgIHZhciBtYXhCdWZmZXJlZElkID0gc2VsZi5fdW5wdWJsaXNoZWRCdWZmZXIubWF4RWxlbWVudElkKCk7XG5cbiAgICAgICAgc2VsZi5fdW5wdWJsaXNoZWRCdWZmZXIucmVtb3ZlKG1heEJ1ZmZlcmVkSWQpO1xuXG4gICAgICAgIC8vIFNpbmNlIHNvbWV0aGluZyBtYXRjaGluZyBpcyByZW1vdmVkIGZyb20gY2FjaGUgKGJvdGggcHVibGlzaGVkIHNldCBhbmRcbiAgICAgICAgLy8gYnVmZmVyKSwgc2V0IGZsYWcgdG8gZmFsc2VcbiAgICAgICAgc2VsZi5fc2FmZUFwcGVuZFRvQnVmZmVyID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG4gIC8vIElzIGNhbGxlZCBlaXRoZXIgdG8gcmVtb3ZlIHRoZSBkb2MgY29tcGxldGVseSBmcm9tIG1hdGNoaW5nIHNldCBvciB0byBtb3ZlXG4gIC8vIGl0IHRvIHRoZSBwdWJsaXNoZWQgc2V0IGxhdGVyLlxuICBfcmVtb3ZlQnVmZmVyZWQ6IGZ1bmN0aW9uIChpZCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBNZXRlb3IuX25vWWllbGRzQWxsb3dlZChmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLl91bnB1Ymxpc2hlZEJ1ZmZlci5yZW1vdmUoaWQpO1xuICAgICAgLy8gVG8ga2VlcCB0aGUgY29udHJhY3QgXCJidWZmZXIgaXMgbmV2ZXIgZW1wdHkgaW4gU1RFQURZIHBoYXNlIHVubGVzcyB0aGVcbiAgICAgIC8vIGV2ZXJ5dGhpbmcgbWF0Y2hpbmcgZml0cyBpbnRvIHB1Ymxpc2hlZFwiIHRydWUsIHdlIHBvbGwgZXZlcnl0aGluZyBhc1xuICAgICAgLy8gc29vbiBhcyB3ZSBzZWUgdGhlIGJ1ZmZlciBiZWNvbWluZyBlbXB0eS5cbiAgICAgIGlmICghIHNlbGYuX3VucHVibGlzaGVkQnVmZmVyLnNpemUoKSAmJiAhIHNlbGYuX3NhZmVBcHBlbmRUb0J1ZmZlcilcbiAgICAgICAgc2VsZi5fbmVlZFRvUG9sbFF1ZXJ5KCk7XG4gICAgfSk7XG4gIH0sXG4gIC8vIENhbGxlZCB3aGVuIGEgZG9jdW1lbnQgaGFzIGpvaW5lZCB0aGUgXCJNYXRjaGluZ1wiIHJlc3VsdHMgc2V0LlxuICAvLyBUYWtlcyByZXNwb25zaWJpbGl0eSBvZiBrZWVwaW5nIF91bnB1Ymxpc2hlZEJ1ZmZlciBpbiBzeW5jIHdpdGggX3B1Ymxpc2hlZFxuICAvLyBhbmQgdGhlIGVmZmVjdCBvZiBsaW1pdCBlbmZvcmNlZC5cbiAgX2FkZE1hdGNoaW5nOiBmdW5jdGlvbiAoZG9jKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIE1ldGVvci5fbm9ZaWVsZHNBbGxvd2VkKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBpZCA9IGRvYy5faWQ7XG4gICAgICBpZiAoc2VsZi5fcHVibGlzaGVkLmhhcyhpZCkpXG4gICAgICAgIHRocm93IEVycm9yKFwidHJpZWQgdG8gYWRkIHNvbWV0aGluZyBhbHJlYWR5IHB1Ymxpc2hlZCBcIiArIGlkKTtcbiAgICAgIGlmIChzZWxmLl9saW1pdCAmJiBzZWxmLl91bnB1Ymxpc2hlZEJ1ZmZlci5oYXMoaWQpKVxuICAgICAgICB0aHJvdyBFcnJvcihcInRyaWVkIHRvIGFkZCBzb21ldGhpbmcgYWxyZWFkeSBleGlzdGVkIGluIGJ1ZmZlciBcIiArIGlkKTtcblxuICAgICAgdmFyIGxpbWl0ID0gc2VsZi5fbGltaXQ7XG4gICAgICB2YXIgY29tcGFyYXRvciA9IHNlbGYuX2NvbXBhcmF0b3I7XG4gICAgICB2YXIgbWF4UHVibGlzaGVkID0gKGxpbWl0ICYmIHNlbGYuX3B1Ymxpc2hlZC5zaXplKCkgPiAwKSA/XG4gICAgICAgIHNlbGYuX3B1Ymxpc2hlZC5nZXQoc2VsZi5fcHVibGlzaGVkLm1heEVsZW1lbnRJZCgpKSA6IG51bGw7XG4gICAgICB2YXIgbWF4QnVmZmVyZWQgPSAobGltaXQgJiYgc2VsZi5fdW5wdWJsaXNoZWRCdWZmZXIuc2l6ZSgpID4gMClcbiAgICAgICAgPyBzZWxmLl91bnB1Ymxpc2hlZEJ1ZmZlci5nZXQoc2VsZi5fdW5wdWJsaXNoZWRCdWZmZXIubWF4RWxlbWVudElkKCkpXG4gICAgICAgIDogbnVsbDtcbiAgICAgIC8vIFRoZSBxdWVyeSBpcyB1bmxpbWl0ZWQgb3IgZGlkbid0IHB1Ymxpc2ggZW5vdWdoIGRvY3VtZW50cyB5ZXQgb3IgdGhlXG4gICAgICAvLyBuZXcgZG9jdW1lbnQgd291bGQgZml0IGludG8gcHVibGlzaGVkIHNldCBwdXNoaW5nIHRoZSBtYXhpbXVtIGVsZW1lbnRcbiAgICAgIC8vIG91dCwgdGhlbiB3ZSBuZWVkIHRvIHB1Ymxpc2ggdGhlIGRvYy5cbiAgICAgIHZhciB0b1B1Ymxpc2ggPSAhIGxpbWl0IHx8IHNlbGYuX3B1Ymxpc2hlZC5zaXplKCkgPCBsaW1pdCB8fFxuICAgICAgICBjb21wYXJhdG9yKGRvYywgbWF4UHVibGlzaGVkKSA8IDA7XG5cbiAgICAgIC8vIE90aGVyd2lzZSB3ZSBtaWdodCBuZWVkIHRvIGJ1ZmZlciBpdCAob25seSBpbiBjYXNlIG9mIGxpbWl0ZWQgcXVlcnkpLlxuICAgICAgLy8gQnVmZmVyaW5nIGlzIGFsbG93ZWQgaWYgdGhlIGJ1ZmZlciBpcyBub3QgZmlsbGVkIHVwIHlldCBhbmQgYWxsXG4gICAgICAvLyBtYXRjaGluZyBkb2NzIGFyZSBlaXRoZXIgaW4gdGhlIHB1Ymxpc2hlZCBzZXQgb3IgaW4gdGhlIGJ1ZmZlci5cbiAgICAgIHZhciBjYW5BcHBlbmRUb0J1ZmZlciA9ICF0b1B1Ymxpc2ggJiYgc2VsZi5fc2FmZUFwcGVuZFRvQnVmZmVyICYmXG4gICAgICAgIHNlbGYuX3VucHVibGlzaGVkQnVmZmVyLnNpemUoKSA8IGxpbWl0O1xuXG4gICAgICAvLyBPciBpZiBpdCBpcyBzbWFsbCBlbm91Z2ggdG8gYmUgc2FmZWx5IGluc2VydGVkIHRvIHRoZSBtaWRkbGUgb3IgdGhlXG4gICAgICAvLyBiZWdpbm5pbmcgb2YgdGhlIGJ1ZmZlci5cbiAgICAgIHZhciBjYW5JbnNlcnRJbnRvQnVmZmVyID0gIXRvUHVibGlzaCAmJiBtYXhCdWZmZXJlZCAmJlxuICAgICAgICBjb21wYXJhdG9yKGRvYywgbWF4QnVmZmVyZWQpIDw9IDA7XG5cbiAgICAgIHZhciB0b0J1ZmZlciA9IGNhbkFwcGVuZFRvQnVmZmVyIHx8IGNhbkluc2VydEludG9CdWZmZXI7XG5cbiAgICAgIGlmICh0b1B1Ymxpc2gpIHtcbiAgICAgICAgc2VsZi5fYWRkUHVibGlzaGVkKGlkLCBkb2MpO1xuICAgICAgfSBlbHNlIGlmICh0b0J1ZmZlcikge1xuICAgICAgICBzZWxmLl9hZGRCdWZmZXJlZChpZCwgZG9jKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGRyb3BwaW5nIGl0IGFuZCBub3Qgc2F2aW5nIHRvIHRoZSBjYWNoZVxuICAgICAgICBzZWxmLl9zYWZlQXBwZW5kVG9CdWZmZXIgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcbiAgLy8gQ2FsbGVkIHdoZW4gYSBkb2N1bWVudCBsZWF2ZXMgdGhlIFwiTWF0Y2hpbmdcIiByZXN1bHRzIHNldC5cbiAgLy8gVGFrZXMgcmVzcG9uc2liaWxpdHkgb2Yga2VlcGluZyBfdW5wdWJsaXNoZWRCdWZmZXIgaW4gc3luYyB3aXRoIF9wdWJsaXNoZWRcbiAgLy8gYW5kIHRoZSBlZmZlY3Qgb2YgbGltaXQgZW5mb3JjZWQuXG4gIF9yZW1vdmVNYXRjaGluZzogZnVuY3Rpb24gKGlkKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIE1ldGVvci5fbm9ZaWVsZHNBbGxvd2VkKGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICghIHNlbGYuX3B1Ymxpc2hlZC5oYXMoaWQpICYmICEgc2VsZi5fbGltaXQpXG4gICAgICAgIHRocm93IEVycm9yKFwidHJpZWQgdG8gcmVtb3ZlIHNvbWV0aGluZyBtYXRjaGluZyBidXQgbm90IGNhY2hlZCBcIiArIGlkKTtcblxuICAgICAgaWYgKHNlbGYuX3B1Ymxpc2hlZC5oYXMoaWQpKSB7XG4gICAgICAgIHNlbGYuX3JlbW92ZVB1Ymxpc2hlZChpZCk7XG4gICAgICB9IGVsc2UgaWYgKHNlbGYuX3VucHVibGlzaGVkQnVmZmVyLmhhcyhpZCkpIHtcbiAgICAgICAgc2VsZi5fcmVtb3ZlQnVmZmVyZWQoaWQpO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuICBfaGFuZGxlRG9jOiBmdW5jdGlvbiAoaWQsIG5ld0RvYykge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBNZXRlb3IuX25vWWllbGRzQWxsb3dlZChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgbWF0Y2hlc05vdyA9IG5ld0RvYyAmJiBzZWxmLl9tYXRjaGVyLmRvY3VtZW50TWF0Y2hlcyhuZXdEb2MpLnJlc3VsdDtcblxuICAgICAgdmFyIHB1Ymxpc2hlZEJlZm9yZSA9IHNlbGYuX3B1Ymxpc2hlZC5oYXMoaWQpO1xuICAgICAgdmFyIGJ1ZmZlcmVkQmVmb3JlID0gc2VsZi5fbGltaXQgJiYgc2VsZi5fdW5wdWJsaXNoZWRCdWZmZXIuaGFzKGlkKTtcbiAgICAgIHZhciBjYWNoZWRCZWZvcmUgPSBwdWJsaXNoZWRCZWZvcmUgfHwgYnVmZmVyZWRCZWZvcmU7XG5cbiAgICAgIGlmIChtYXRjaGVzTm93ICYmICFjYWNoZWRCZWZvcmUpIHtcbiAgICAgICAgc2VsZi5fYWRkTWF0Y2hpbmcobmV3RG9jKTtcbiAgICAgIH0gZWxzZSBpZiAoY2FjaGVkQmVmb3JlICYmICFtYXRjaGVzTm93KSB7XG4gICAgICAgIHNlbGYuX3JlbW92ZU1hdGNoaW5nKGlkKTtcbiAgICAgIH0gZWxzZSBpZiAoY2FjaGVkQmVmb3JlICYmIG1hdGNoZXNOb3cpIHtcbiAgICAgICAgdmFyIG9sZERvYyA9IHNlbGYuX3B1Ymxpc2hlZC5nZXQoaWQpO1xuICAgICAgICB2YXIgY29tcGFyYXRvciA9IHNlbGYuX2NvbXBhcmF0b3I7XG4gICAgICAgIHZhciBtaW5CdWZmZXJlZCA9IHNlbGYuX2xpbWl0ICYmIHNlbGYuX3VucHVibGlzaGVkQnVmZmVyLnNpemUoKSAmJlxuICAgICAgICAgIHNlbGYuX3VucHVibGlzaGVkQnVmZmVyLmdldChzZWxmLl91bnB1Ymxpc2hlZEJ1ZmZlci5taW5FbGVtZW50SWQoKSk7XG4gICAgICAgIHZhciBtYXhCdWZmZXJlZDtcblxuICAgICAgICBpZiAocHVibGlzaGVkQmVmb3JlKSB7XG4gICAgICAgICAgLy8gVW5saW1pdGVkIGNhc2Ugd2hlcmUgdGhlIGRvY3VtZW50IHN0YXlzIGluIHB1Ymxpc2hlZCBvbmNlIGl0XG4gICAgICAgICAgLy8gbWF0Y2hlcyBvciB0aGUgY2FzZSB3aGVuIHdlIGRvbid0IGhhdmUgZW5vdWdoIG1hdGNoaW5nIGRvY3MgdG9cbiAgICAgICAgICAvLyBwdWJsaXNoIG9yIHRoZSBjaGFuZ2VkIGJ1dCBtYXRjaGluZyBkb2Mgd2lsbCBzdGF5IGluIHB1Ymxpc2hlZFxuICAgICAgICAgIC8vIGFueXdheXMuXG4gICAgICAgICAgLy9cbiAgICAgICAgICAvLyBYWFg6IFdlIHJlbHkgb24gdGhlIGVtcHRpbmVzcyBvZiBidWZmZXIuIEJlIHN1cmUgdG8gbWFpbnRhaW4gdGhlXG4gICAgICAgICAgLy8gZmFjdCB0aGF0IGJ1ZmZlciBjYW4ndCBiZSBlbXB0eSBpZiB0aGVyZSBhcmUgbWF0Y2hpbmcgZG9jdW1lbnRzIG5vdFxuICAgICAgICAgIC8vIHB1Ymxpc2hlZC4gTm90YWJseSwgd2UgZG9uJ3Qgd2FudCB0byBzY2hlZHVsZSByZXBvbGwgYW5kIGNvbnRpbnVlXG4gICAgICAgICAgLy8gcmVseWluZyBvbiB0aGlzIHByb3BlcnR5LlxuICAgICAgICAgIHZhciBzdGF5c0luUHVibGlzaGVkID0gISBzZWxmLl9saW1pdCB8fFxuICAgICAgICAgICAgc2VsZi5fdW5wdWJsaXNoZWRCdWZmZXIuc2l6ZSgpID09PSAwIHx8XG4gICAgICAgICAgICBjb21wYXJhdG9yKG5ld0RvYywgbWluQnVmZmVyZWQpIDw9IDA7XG5cbiAgICAgICAgICBpZiAoc3RheXNJblB1Ymxpc2hlZCkge1xuICAgICAgICAgICAgc2VsZi5fY2hhbmdlUHVibGlzaGVkKGlkLCBvbGREb2MsIG5ld0RvYyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGFmdGVyIHRoZSBjaGFuZ2UgZG9jIGRvZXNuJ3Qgc3RheSBpbiB0aGUgcHVibGlzaGVkLCByZW1vdmUgaXRcbiAgICAgICAgICAgIHNlbGYuX3JlbW92ZVB1Ymxpc2hlZChpZCk7XG4gICAgICAgICAgICAvLyBidXQgaXQgY2FuIG1vdmUgaW50byBidWZmZXJlZCBub3csIGNoZWNrIGl0XG4gICAgICAgICAgICBtYXhCdWZmZXJlZCA9IHNlbGYuX3VucHVibGlzaGVkQnVmZmVyLmdldChcbiAgICAgICAgICAgICAgc2VsZi5fdW5wdWJsaXNoZWRCdWZmZXIubWF4RWxlbWVudElkKCkpO1xuXG4gICAgICAgICAgICB2YXIgdG9CdWZmZXIgPSBzZWxmLl9zYWZlQXBwZW5kVG9CdWZmZXIgfHxcbiAgICAgICAgICAgICAgICAgIChtYXhCdWZmZXJlZCAmJiBjb21wYXJhdG9yKG5ld0RvYywgbWF4QnVmZmVyZWQpIDw9IDApO1xuXG4gICAgICAgICAgICBpZiAodG9CdWZmZXIpIHtcbiAgICAgICAgICAgICAgc2VsZi5fYWRkQnVmZmVyZWQoaWQsIG5ld0RvYyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAvLyBUaHJvdyBhd2F5IGZyb20gYm90aCBwdWJsaXNoZWQgc2V0IGFuZCBidWZmZXJcbiAgICAgICAgICAgICAgc2VsZi5fc2FmZUFwcGVuZFRvQnVmZmVyID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGJ1ZmZlcmVkQmVmb3JlKSB7XG4gICAgICAgICAgb2xkRG9jID0gc2VsZi5fdW5wdWJsaXNoZWRCdWZmZXIuZ2V0KGlkKTtcbiAgICAgICAgICAvLyByZW1vdmUgdGhlIG9sZCB2ZXJzaW9uIG1hbnVhbGx5IGluc3RlYWQgb2YgdXNpbmcgX3JlbW92ZUJ1ZmZlcmVkIHNvXG4gICAgICAgICAgLy8gd2UgZG9uJ3QgdHJpZ2dlciB0aGUgcXVlcnlpbmcgaW1tZWRpYXRlbHkuICBpZiB3ZSBlbmQgdGhpcyBibG9ja1xuICAgICAgICAgIC8vIHdpdGggdGhlIGJ1ZmZlciBlbXB0eSwgd2Ugd2lsbCBuZWVkIHRvIHRyaWdnZXIgdGhlIHF1ZXJ5IHBvbGxcbiAgICAgICAgICAvLyBtYW51YWxseSB0b28uXG4gICAgICAgICAgc2VsZi5fdW5wdWJsaXNoZWRCdWZmZXIucmVtb3ZlKGlkKTtcblxuICAgICAgICAgIHZhciBtYXhQdWJsaXNoZWQgPSBzZWxmLl9wdWJsaXNoZWQuZ2V0KFxuICAgICAgICAgICAgc2VsZi5fcHVibGlzaGVkLm1heEVsZW1lbnRJZCgpKTtcbiAgICAgICAgICBtYXhCdWZmZXJlZCA9IHNlbGYuX3VucHVibGlzaGVkQnVmZmVyLnNpemUoKSAmJlxuICAgICAgICAgICAgICAgIHNlbGYuX3VucHVibGlzaGVkQnVmZmVyLmdldChcbiAgICAgICAgICAgICAgICAgIHNlbGYuX3VucHVibGlzaGVkQnVmZmVyLm1heEVsZW1lbnRJZCgpKTtcblxuICAgICAgICAgIC8vIHRoZSBidWZmZXJlZCBkb2Mgd2FzIHVwZGF0ZWQsIGl0IGNvdWxkIG1vdmUgdG8gcHVibGlzaGVkXG4gICAgICAgICAgdmFyIHRvUHVibGlzaCA9IGNvbXBhcmF0b3IobmV3RG9jLCBtYXhQdWJsaXNoZWQpIDwgMDtcblxuICAgICAgICAgIC8vIG9yIHN0YXlzIGluIGJ1ZmZlciBldmVuIGFmdGVyIHRoZSBjaGFuZ2VcbiAgICAgICAgICB2YXIgc3RheXNJbkJ1ZmZlciA9ICghIHRvUHVibGlzaCAmJiBzZWxmLl9zYWZlQXBwZW5kVG9CdWZmZXIpIHx8XG4gICAgICAgICAgICAgICAgKCF0b1B1Ymxpc2ggJiYgbWF4QnVmZmVyZWQgJiZcbiAgICAgICAgICAgICAgICAgY29tcGFyYXRvcihuZXdEb2MsIG1heEJ1ZmZlcmVkKSA8PSAwKTtcblxuICAgICAgICAgIGlmICh0b1B1Ymxpc2gpIHtcbiAgICAgICAgICAgIHNlbGYuX2FkZFB1Ymxpc2hlZChpZCwgbmV3RG9jKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHN0YXlzSW5CdWZmZXIpIHtcbiAgICAgICAgICAgIC8vIHN0YXlzIGluIGJ1ZmZlciBidXQgY2hhbmdlc1xuICAgICAgICAgICAgc2VsZi5fdW5wdWJsaXNoZWRCdWZmZXIuc2V0KGlkLCBuZXdEb2MpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBUaHJvdyBhd2F5IGZyb20gYm90aCBwdWJsaXNoZWQgc2V0IGFuZCBidWZmZXJcbiAgICAgICAgICAgIHNlbGYuX3NhZmVBcHBlbmRUb0J1ZmZlciA9IGZhbHNlO1xuICAgICAgICAgICAgLy8gTm9ybWFsbHkgdGhpcyBjaGVjayB3b3VsZCBoYXZlIGJlZW4gZG9uZSBpbiBfcmVtb3ZlQnVmZmVyZWQgYnV0XG4gICAgICAgICAgICAvLyB3ZSBkaWRuJ3QgdXNlIGl0LCBzbyB3ZSBuZWVkIHRvIGRvIGl0IG91cnNlbGYgbm93LlxuICAgICAgICAgICAgaWYgKCEgc2VsZi5fdW5wdWJsaXNoZWRCdWZmZXIuc2l6ZSgpKSB7XG4gICAgICAgICAgICAgIHNlbGYuX25lZWRUb1BvbGxRdWVyeSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJjYWNoZWRCZWZvcmUgaW1wbGllcyBlaXRoZXIgb2YgcHVibGlzaGVkQmVmb3JlIG9yIGJ1ZmZlcmVkQmVmb3JlIGlzIHRydWUuXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG4gIF9mZXRjaE1vZGlmaWVkRG9jdW1lbnRzOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIE1ldGVvci5fbm9ZaWVsZHNBbGxvd2VkKGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYuX3JlZ2lzdGVyUGhhc2VDaGFuZ2UoUEhBU0UuRkVUQ0hJTkcpO1xuICAgICAgLy8gRGVmZXIsIGJlY2F1c2Ugbm90aGluZyBjYWxsZWQgZnJvbSB0aGUgb3Bsb2cgZW50cnkgaGFuZGxlciBtYXkgeWllbGQsXG4gICAgICAvLyBidXQgZmV0Y2goKSB5aWVsZHMuXG4gICAgICBNZXRlb3IuZGVmZXIoZmluaXNoSWZOZWVkVG9Qb2xsUXVlcnkoZnVuY3Rpb24gKCkge1xuICAgICAgICB3aGlsZSAoIXNlbGYuX3N0b3BwZWQgJiYgIXNlbGYuX25lZWRUb0ZldGNoLmVtcHR5KCkpIHtcbiAgICAgICAgICBpZiAoc2VsZi5fcGhhc2UgPT09IFBIQVNFLlFVRVJZSU5HKSB7XG4gICAgICAgICAgICAvLyBXaGlsZSBmZXRjaGluZywgd2UgZGVjaWRlZCB0byBnbyBpbnRvIFFVRVJZSU5HIG1vZGUsIGFuZCB0aGVuIHdlXG4gICAgICAgICAgICAvLyBzYXcgYW5vdGhlciBvcGxvZyBlbnRyeSwgc28gX25lZWRUb0ZldGNoIGlzIG5vdCBlbXB0eS4gQnV0IHdlXG4gICAgICAgICAgICAvLyBzaG91bGRuJ3QgZmV0Y2ggdGhlc2UgZG9jdW1lbnRzIHVudGlsIEFGVEVSIHRoZSBxdWVyeSBpcyBkb25lLlxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gQmVpbmcgaW4gc3RlYWR5IHBoYXNlIGhlcmUgd291bGQgYmUgc3VycHJpc2luZy5cbiAgICAgICAgICBpZiAoc2VsZi5fcGhhc2UgIT09IFBIQVNFLkZFVENISU5HKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwicGhhc2UgaW4gZmV0Y2hNb2RpZmllZERvY3VtZW50czogXCIgKyBzZWxmLl9waGFzZSk7XG5cbiAgICAgICAgICBzZWxmLl9jdXJyZW50bHlGZXRjaGluZyA9IHNlbGYuX25lZWRUb0ZldGNoO1xuICAgICAgICAgIHZhciB0aGlzR2VuZXJhdGlvbiA9ICsrc2VsZi5fZmV0Y2hHZW5lcmF0aW9uO1xuICAgICAgICAgIHNlbGYuX25lZWRUb0ZldGNoID0gbmV3IExvY2FsQ29sbGVjdGlvbi5fSWRNYXA7XG4gICAgICAgICAgdmFyIHdhaXRpbmcgPSAwO1xuICAgICAgICAgIHZhciBmdXQgPSBuZXcgRnV0dXJlO1xuICAgICAgICAgIC8vIFRoaXMgbG9vcCBpcyBzYWZlLCBiZWNhdXNlIF9jdXJyZW50bHlGZXRjaGluZyB3aWxsIG5vdCBiZSB1cGRhdGVkXG4gICAgICAgICAgLy8gZHVyaW5nIHRoaXMgbG9vcCAoaW4gZmFjdCwgaXQgaXMgbmV2ZXIgbXV0YXRlZCkuXG4gICAgICAgICAgc2VsZi5fY3VycmVudGx5RmV0Y2hpbmcuZm9yRWFjaChmdW5jdGlvbiAob3AsIGlkKSB7XG4gICAgICAgICAgICB3YWl0aW5nKys7XG4gICAgICAgICAgICBzZWxmLl9tb25nb0hhbmRsZS5fZG9jRmV0Y2hlci5mZXRjaChcbiAgICAgICAgICAgICAgc2VsZi5fY3Vyc29yRGVzY3JpcHRpb24uY29sbGVjdGlvbk5hbWUsIGlkLCBvcCxcbiAgICAgICAgICAgICAgZmluaXNoSWZOZWVkVG9Qb2xsUXVlcnkoZnVuY3Rpb24gKGVyciwgZG9jKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgTWV0ZW9yLl9kZWJ1ZyhcIkdvdCBleGNlcHRpb24gd2hpbGUgZmV0Y2hpbmcgZG9jdW1lbnRzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgd2UgZ2V0IGFuIGVycm9yIGZyb20gdGhlIGZldGNoZXIgKGVnLCB0cm91YmxlXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbm5lY3RpbmcgdG8gTW9uZ28pLCBsZXQncyBqdXN0IGFiYW5kb24gdGhlIGZldGNoIHBoYXNlXG4gICAgICAgICAgICAgICAgICAgIC8vIGFsdG9nZXRoZXIgYW5kIGZhbGwgYmFjayB0byBwb2xsaW5nLiBJdCdzIG5vdCBsaWtlIHdlJ3JlXG4gICAgICAgICAgICAgICAgICAgIC8vIGdldHRpbmcgbGl2ZSB1cGRhdGVzIGFueXdheS5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYuX3BoYXNlICE9PSBQSEFTRS5RVUVSWUlORykge1xuICAgICAgICAgICAgICAgICAgICAgIHNlbGYuX25lZWRUb1BvbGxRdWVyeSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCFzZWxmLl9zdG9wcGVkICYmIHNlbGYuX3BoYXNlID09PSBQSEFTRS5GRVRDSElOR1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiBzZWxmLl9mZXRjaEdlbmVyYXRpb24gPT09IHRoaXNHZW5lcmF0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFdlIHJlLWNoZWNrIHRoZSBnZW5lcmF0aW9uIGluIGNhc2Ugd2UndmUgaGFkIGFuIGV4cGxpY2l0XG4gICAgICAgICAgICAgICAgICAgIC8vIF9wb2xsUXVlcnkgY2FsbCAoZWcsIGluIGFub3RoZXIgZmliZXIpIHdoaWNoIHNob3VsZFxuICAgICAgICAgICAgICAgICAgICAvLyBlZmZlY3RpdmVseSBjYW5jZWwgdGhpcyByb3VuZCBvZiBmZXRjaGVzLiAgKF9wb2xsUXVlcnlcbiAgICAgICAgICAgICAgICAgICAgLy8gaW5jcmVtZW50cyB0aGUgZ2VuZXJhdGlvbi4pXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuX2hhbmRsZURvYyhpZCwgZG9jKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAgICAgd2FpdGluZy0tO1xuICAgICAgICAgICAgICAgICAgLy8gQmVjYXVzZSBmZXRjaCgpIG5ldmVyIGNhbGxzIGl0cyBjYWxsYmFjayBzeW5jaHJvbm91c2x5LFxuICAgICAgICAgICAgICAgICAgLy8gdGhpcyBpcyBzYWZlIChpZSwgd2Ugd29uJ3QgY2FsbCBmdXQucmV0dXJuKCkgYmVmb3JlIHRoZVxuICAgICAgICAgICAgICAgICAgLy8gZm9yRWFjaCBpcyBkb25lKS5cbiAgICAgICAgICAgICAgICAgIGlmICh3YWl0aW5nID09PSAwKVxuICAgICAgICAgICAgICAgICAgICBmdXQucmV0dXJuKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgZnV0LndhaXQoKTtcbiAgICAgICAgICAvLyBFeGl0IG5vdyBpZiB3ZSd2ZSBoYWQgYSBfcG9sbFF1ZXJ5IGNhbGwgKGhlcmUgb3IgaW4gYW5vdGhlciBmaWJlcikuXG4gICAgICAgICAgaWYgKHNlbGYuX3BoYXNlID09PSBQSEFTRS5RVUVSWUlORylcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICBzZWxmLl9jdXJyZW50bHlGZXRjaGluZyA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgLy8gV2UncmUgZG9uZSBmZXRjaGluZywgc28gd2UgY2FuIGJlIHN0ZWFkeSwgdW5sZXNzIHdlJ3ZlIGhhZCBhXG4gICAgICAgIC8vIF9wb2xsUXVlcnkgY2FsbCAoaGVyZSBvciBpbiBhbm90aGVyIGZpYmVyKS5cbiAgICAgICAgaWYgKHNlbGYuX3BoYXNlICE9PSBQSEFTRS5RVUVSWUlORylcbiAgICAgICAgICBzZWxmLl9iZVN0ZWFkeSgpO1xuICAgICAgfSkpO1xuICAgIH0pO1xuICB9LFxuICBfYmVTdGVhZHk6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgTWV0ZW9yLl9ub1lpZWxkc0FsbG93ZWQoZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi5fcmVnaXN0ZXJQaGFzZUNoYW5nZShQSEFTRS5TVEVBRFkpO1xuICAgICAgdmFyIHdyaXRlcyA9IHNlbGYuX3dyaXRlc1RvQ29tbWl0V2hlbldlUmVhY2hTdGVhZHk7XG4gICAgICBzZWxmLl93cml0ZXNUb0NvbW1pdFdoZW5XZVJlYWNoU3RlYWR5ID0gW107XG4gICAgICBzZWxmLl9tdWx0aXBsZXhlci5vbkZsdXNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgXy5lYWNoKHdyaXRlcywgZnVuY3Rpb24gKHcpIHtcbiAgICAgICAgICB3LmNvbW1pdHRlZCgpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9LFxuICBfaGFuZGxlT3Bsb2dFbnRyeVF1ZXJ5aW5nOiBmdW5jdGlvbiAob3ApIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgTWV0ZW9yLl9ub1lpZWxkc0FsbG93ZWQoZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi5fbmVlZFRvRmV0Y2guc2V0KGlkRm9yT3Aob3ApLCBvcCk7XG4gICAgfSk7XG4gIH0sXG4gIF9oYW5kbGVPcGxvZ0VudHJ5U3RlYWR5T3JGZXRjaGluZzogZnVuY3Rpb24gKG9wKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIE1ldGVvci5fbm9ZaWVsZHNBbGxvd2VkKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBpZCA9IGlkRm9yT3Aob3ApO1xuICAgICAgLy8gSWYgd2UncmUgYWxyZWFkeSBmZXRjaGluZyB0aGlzIG9uZSwgb3IgYWJvdXQgdG8sIHdlIGNhbid0IG9wdGltaXplO1xuICAgICAgLy8gbWFrZSBzdXJlIHRoYXQgd2UgZmV0Y2ggaXQgYWdhaW4gaWYgbmVjZXNzYXJ5LlxuICAgICAgaWYgKHNlbGYuX3BoYXNlID09PSBQSEFTRS5GRVRDSElORyAmJlxuICAgICAgICAgICgoc2VsZi5fY3VycmVudGx5RmV0Y2hpbmcgJiYgc2VsZi5fY3VycmVudGx5RmV0Y2hpbmcuaGFzKGlkKSkgfHxcbiAgICAgICAgICAgc2VsZi5fbmVlZFRvRmV0Y2guaGFzKGlkKSkpIHtcbiAgICAgICAgc2VsZi5fbmVlZFRvRmV0Y2guc2V0KGlkLCBvcCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wLm9wID09PSAnZCcpIHtcbiAgICAgICAgaWYgKHNlbGYuX3B1Ymxpc2hlZC5oYXMoaWQpIHx8XG4gICAgICAgICAgICAoc2VsZi5fbGltaXQgJiYgc2VsZi5fdW5wdWJsaXNoZWRCdWZmZXIuaGFzKGlkKSkpXG4gICAgICAgICAgc2VsZi5fcmVtb3ZlTWF0Y2hpbmcoaWQpO1xuICAgICAgfSBlbHNlIGlmIChvcC5vcCA9PT0gJ2knKSB7XG4gICAgICAgIGlmIChzZWxmLl9wdWJsaXNoZWQuaGFzKGlkKSlcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJpbnNlcnQgZm91bmQgZm9yIGFscmVhZHktZXhpc3RpbmcgSUQgaW4gcHVibGlzaGVkXCIpO1xuICAgICAgICBpZiAoc2VsZi5fdW5wdWJsaXNoZWRCdWZmZXIgJiYgc2VsZi5fdW5wdWJsaXNoZWRCdWZmZXIuaGFzKGlkKSlcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJpbnNlcnQgZm91bmQgZm9yIGFscmVhZHktZXhpc3RpbmcgSUQgaW4gYnVmZmVyXCIpO1xuXG4gICAgICAgIC8vIFhYWCB3aGF0IGlmIHNlbGVjdG9yIHlpZWxkcz8gIGZvciBub3cgaXQgY2FuJ3QgYnV0IGxhdGVyIGl0IGNvdWxkXG4gICAgICAgIC8vIGhhdmUgJHdoZXJlXG4gICAgICAgIGlmIChzZWxmLl9tYXRjaGVyLmRvY3VtZW50TWF0Y2hlcyhvcC5vKS5yZXN1bHQpXG4gICAgICAgICAgc2VsZi5fYWRkTWF0Y2hpbmcob3Aubyk7XG4gICAgICB9IGVsc2UgaWYgKG9wLm9wID09PSAndScpIHtcbiAgICAgICAgIC8vIHdlIGFyZSBtYXBwaW5nIHRoZSBuZXcgb3Bsb2cgZm9ybWF0IG9uIG1vbmdvIDVcbiAgICAgICAgLy8gdG8gd2hhdCB3ZSBrbm93IGJldHRlciwgJHNldFxuICAgICAgICBvcC5vID0gb3Bsb2dWMlYxQ29udmVydGVyKG9wLm8pXG4gICAgICAgIC8vIElzIHRoaXMgYSBtb2RpZmllciAoJHNldC8kdW5zZXQsIHdoaWNoIG1heSByZXF1aXJlIHVzIHRvIHBvbGwgdGhlXG4gICAgICAgIC8vIGRhdGFiYXNlIHRvIGZpZ3VyZSBvdXQgaWYgdGhlIHdob2xlIGRvY3VtZW50IG1hdGNoZXMgdGhlIHNlbGVjdG9yKSBvclxuICAgICAgICAvLyBhIHJlcGxhY2VtZW50IChpbiB3aGljaCBjYXNlIHdlIGNhbiBqdXN0IGRpcmVjdGx5IHJlLWV2YWx1YXRlIHRoZVxuICAgICAgICAvLyBzZWxlY3Rvcik/XG4gICAgICAgIC8vIG9wbG9nIGZvcm1hdCBoYXMgY2hhbmdlZCBvbiBtb25nb2RiIDUsIHdlIGhhdmUgdG8gc3VwcG9ydCBib3RoIG5vd1xuICAgICAgICAvLyBkaWZmIGlzIHRoZSBmb3JtYXQgaW4gTW9uZ28gNSsgKG9wbG9nIHYyKVxuICAgICAgICB2YXIgaXNSZXBsYWNlID0gIV8uaGFzKG9wLm8sICckc2V0JykgJiYgIV8uaGFzKG9wLm8sICdkaWZmJykgJiYgIV8uaGFzKG9wLm8sICckdW5zZXQnKTsgXG4gICAgICAgIC8vIElmIHRoaXMgbW9kaWZpZXIgbW9kaWZpZXMgc29tZXRoaW5nIGluc2lkZSBhbiBFSlNPTiBjdXN0b20gdHlwZSAoaWUsXG4gICAgICAgIC8vIGFueXRoaW5nIHdpdGggRUpTT04kKSwgdGhlbiB3ZSBjYW4ndCB0cnkgdG8gdXNlXG4gICAgICAgIC8vIExvY2FsQ29sbGVjdGlvbi5fbW9kaWZ5LCBzaW5jZSB0aGF0IGp1c3QgbXV0YXRlcyB0aGUgRUpTT04gZW5jb2RpbmcsXG4gICAgICAgIC8vIG5vdCB0aGUgYWN0dWFsIG9iamVjdC5cbiAgICAgICAgdmFyIGNhbkRpcmVjdGx5TW9kaWZ5RG9jID1cbiAgICAgICAgICAhaXNSZXBsYWNlICYmIG1vZGlmaWVyQ2FuQmVEaXJlY3RseUFwcGxpZWQob3Aubyk7XG5cbiAgICAgICAgdmFyIHB1Ymxpc2hlZEJlZm9yZSA9IHNlbGYuX3B1Ymxpc2hlZC5oYXMoaWQpO1xuICAgICAgICB2YXIgYnVmZmVyZWRCZWZvcmUgPSBzZWxmLl9saW1pdCAmJiBzZWxmLl91bnB1Ymxpc2hlZEJ1ZmZlci5oYXMoaWQpO1xuXG4gICAgICAgIGlmIChpc1JlcGxhY2UpIHtcbiAgICAgICAgICBzZWxmLl9oYW5kbGVEb2MoaWQsIF8uZXh0ZW5kKHtfaWQ6IGlkfSwgb3AubykpO1xuICAgICAgICB9IGVsc2UgaWYgKChwdWJsaXNoZWRCZWZvcmUgfHwgYnVmZmVyZWRCZWZvcmUpICYmXG4gICAgICAgICAgICAgICAgICAgY2FuRGlyZWN0bHlNb2RpZnlEb2MpIHtcbiAgICAgICAgICAvLyBPaCBncmVhdCwgd2UgYWN0dWFsbHkga25vdyB3aGF0IHRoZSBkb2N1bWVudCBpcywgc28gd2UgY2FuIGFwcGx5XG4gICAgICAgICAgLy8gdGhpcyBkaXJlY3RseS5cbiAgICAgICAgICB2YXIgbmV3RG9jID0gc2VsZi5fcHVibGlzaGVkLmhhcyhpZClcbiAgICAgICAgICAgID8gc2VsZi5fcHVibGlzaGVkLmdldChpZCkgOiBzZWxmLl91bnB1Ymxpc2hlZEJ1ZmZlci5nZXQoaWQpO1xuICAgICAgICAgIG5ld0RvYyA9IEVKU09OLmNsb25lKG5ld0RvYyk7XG5cbiAgICAgICAgICBuZXdEb2MuX2lkID0gaWQ7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIExvY2FsQ29sbGVjdGlvbi5fbW9kaWZ5KG5ld0RvYywgb3Aubyk7XG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgaWYgKGUubmFtZSAhPT0gXCJNaW5pbW9uZ29FcnJvclwiKVxuICAgICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgICAgLy8gV2UgZGlkbid0IHVuZGVyc3RhbmQgdGhlIG1vZGlmaWVyLiAgUmUtZmV0Y2guXG4gICAgICAgICAgICBzZWxmLl9uZWVkVG9GZXRjaC5zZXQoaWQsIG9wKTtcbiAgICAgICAgICAgIGlmIChzZWxmLl9waGFzZSA9PT0gUEhBU0UuU1RFQURZKSB7XG4gICAgICAgICAgICAgIHNlbGYuX2ZldGNoTW9kaWZpZWREb2N1bWVudHMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgc2VsZi5faGFuZGxlRG9jKGlkLCBzZWxmLl9zaGFyZWRQcm9qZWN0aW9uRm4obmV3RG9jKSk7XG4gICAgICAgIH0gZWxzZSBpZiAoIWNhbkRpcmVjdGx5TW9kaWZ5RG9jIHx8XG4gICAgICAgICAgICAgICAgICAgc2VsZi5fbWF0Y2hlci5jYW5CZWNvbWVUcnVlQnlNb2RpZmllcihvcC5vKSB8fFxuICAgICAgICAgICAgICAgICAgIChzZWxmLl9zb3J0ZXIgJiYgc2VsZi5fc29ydGVyLmFmZmVjdGVkQnlNb2RpZmllcihvcC5vKSkpIHtcbiAgICAgICAgICBzZWxmLl9uZWVkVG9GZXRjaC5zZXQoaWQsIG9wKTtcbiAgICAgICAgICBpZiAoc2VsZi5fcGhhc2UgPT09IFBIQVNFLlNURUFEWSlcbiAgICAgICAgICAgIHNlbGYuX2ZldGNoTW9kaWZpZWREb2N1bWVudHMoKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoXCJYWFggU1VSUFJJU0lORyBPUEVSQVRJT046IFwiICsgb3ApO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuICAvLyBZaWVsZHMhXG4gIF9ydW5Jbml0aWFsUXVlcnk6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgaWYgKHNlbGYuX3N0b3BwZWQpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJvcGxvZyBzdG9wcGVkIHN1cnByaXNpbmdseSBlYXJseVwiKTtcblxuICAgIHNlbGYuX3J1blF1ZXJ5KHtpbml0aWFsOiB0cnVlfSk7ICAvLyB5aWVsZHNcblxuICAgIGlmIChzZWxmLl9zdG9wcGVkKVxuICAgICAgcmV0dXJuOyAgLy8gY2FuIGhhcHBlbiBvbiBxdWVyeUVycm9yXG5cbiAgICAvLyBBbGxvdyBvYnNlcnZlQ2hhbmdlcyBjYWxscyB0byByZXR1cm4uIChBZnRlciB0aGlzLCBpdCdzIHBvc3NpYmxlIGZvclxuICAgIC8vIHN0b3AoKSB0byBiZSBjYWxsZWQuKVxuICAgIHNlbGYuX211bHRpcGxleGVyLnJlYWR5KCk7XG5cbiAgICBzZWxmLl9kb25lUXVlcnlpbmcoKTsgIC8vIHlpZWxkc1xuICB9LFxuXG4gIC8vIEluIHZhcmlvdXMgY2lyY3Vtc3RhbmNlcywgd2UgbWF5IGp1c3Qgd2FudCB0byBzdG9wIHByb2Nlc3NpbmcgdGhlIG9wbG9nIGFuZFxuICAvLyByZS1ydW4gdGhlIGluaXRpYWwgcXVlcnksIGp1c3QgYXMgaWYgd2Ugd2VyZSBhIFBvbGxpbmdPYnNlcnZlRHJpdmVyLlxuICAvL1xuICAvLyBUaGlzIGZ1bmN0aW9uIG1heSBub3QgYmxvY2ssIGJlY2F1c2UgaXQgaXMgY2FsbGVkIGZyb20gYW4gb3Bsb2cgZW50cnlcbiAgLy8gaGFuZGxlci5cbiAgLy9cbiAgLy8gWFhYIFdlIHNob3VsZCBjYWxsIHRoaXMgd2hlbiB3ZSBkZXRlY3QgdGhhdCB3ZSd2ZSBiZWVuIGluIEZFVENISU5HIGZvciBcInRvb1xuICAvLyBsb25nXCIuXG4gIC8vXG4gIC8vIFhYWCBXZSBzaG91bGQgY2FsbCB0aGlzIHdoZW4gd2UgZGV0ZWN0IE1vbmdvIGZhaWxvdmVyIChzaW5jZSB0aGF0IG1pZ2h0XG4gIC8vIG1lYW4gdGhhdCBzb21lIG9mIHRoZSBvcGxvZyBlbnRyaWVzIHdlIGhhdmUgcHJvY2Vzc2VkIGhhdmUgYmVlbiByb2xsZWRcbiAgLy8gYmFjaykuIFRoZSBOb2RlIE1vbmdvIGRyaXZlciBpcyBpbiB0aGUgbWlkZGxlIG9mIGEgYnVuY2ggb2YgaHVnZVxuICAvLyByZWZhY3RvcmluZ3MsIGluY2x1ZGluZyB0aGUgd2F5IHRoYXQgaXQgbm90aWZpZXMgeW91IHdoZW4gcHJpbWFyeVxuICAvLyBjaGFuZ2VzLiBXaWxsIHB1dCBvZmYgaW1wbGVtZW50aW5nIHRoaXMgdW50aWwgZHJpdmVyIDEuNCBpcyBvdXQuXG4gIF9wb2xsUXVlcnk6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgTWV0ZW9yLl9ub1lpZWxkc0FsbG93ZWQoZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHNlbGYuX3N0b3BwZWQpXG4gICAgICAgIHJldHVybjtcblxuICAgICAgLy8gWWF5LCB3ZSBnZXQgdG8gZm9yZ2V0IGFib3V0IGFsbCB0aGUgdGhpbmdzIHdlIHRob3VnaHQgd2UgaGFkIHRvIGZldGNoLlxuICAgICAgc2VsZi5fbmVlZFRvRmV0Y2ggPSBuZXcgTG9jYWxDb2xsZWN0aW9uLl9JZE1hcDtcbiAgICAgIHNlbGYuX2N1cnJlbnRseUZldGNoaW5nID0gbnVsbDtcbiAgICAgICsrc2VsZi5fZmV0Y2hHZW5lcmF0aW9uOyAgLy8gaWdub3JlIGFueSBpbi1mbGlnaHQgZmV0Y2hlc1xuICAgICAgc2VsZi5fcmVnaXN0ZXJQaGFzZUNoYW5nZShQSEFTRS5RVUVSWUlORyk7XG5cbiAgICAgIC8vIERlZmVyIHNvIHRoYXQgd2UgZG9uJ3QgeWllbGQuICBXZSBkb24ndCBuZWVkIGZpbmlzaElmTmVlZFRvUG9sbFF1ZXJ5XG4gICAgICAvLyBoZXJlIGJlY2F1c2UgU3dpdGNoZWRUb1F1ZXJ5IGlzIG5vdCB0aHJvd24gaW4gUVVFUllJTkcgbW9kZS5cbiAgICAgIE1ldGVvci5kZWZlcihmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNlbGYuX3J1blF1ZXJ5KCk7XG4gICAgICAgIHNlbGYuX2RvbmVRdWVyeWluZygpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0sXG5cbiAgLy8gWWllbGRzIVxuICBfcnVuUXVlcnk6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIHZhciBuZXdSZXN1bHRzLCBuZXdCdWZmZXI7XG5cbiAgICAvLyBUaGlzIHdoaWxlIGxvb3AgaXMganVzdCB0byByZXRyeSBmYWlsdXJlcy5cbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgLy8gSWYgd2UndmUgYmVlbiBzdG9wcGVkLCB3ZSBkb24ndCBoYXZlIHRvIHJ1biBhbnl0aGluZyBhbnkgbW9yZS5cbiAgICAgIGlmIChzZWxmLl9zdG9wcGVkKVxuICAgICAgICByZXR1cm47XG5cbiAgICAgIG5ld1Jlc3VsdHMgPSBuZXcgTG9jYWxDb2xsZWN0aW9uLl9JZE1hcDtcbiAgICAgIG5ld0J1ZmZlciA9IG5ldyBMb2NhbENvbGxlY3Rpb24uX0lkTWFwO1xuXG4gICAgICAvLyBRdWVyeSAyeCBkb2N1bWVudHMgYXMgdGhlIGhhbGYgZXhjbHVkZWQgZnJvbSB0aGUgb3JpZ2luYWwgcXVlcnkgd2lsbCBnb1xuICAgICAgLy8gaW50byB1bnB1Ymxpc2hlZCBidWZmZXIgdG8gcmVkdWNlIGFkZGl0aW9uYWwgTW9uZ28gbG9va3VwcyBpbiBjYXNlc1xuICAgICAgLy8gd2hlbiBkb2N1bWVudHMgYXJlIHJlbW92ZWQgZnJvbSB0aGUgcHVibGlzaGVkIHNldCBhbmQgbmVlZCBhXG4gICAgICAvLyByZXBsYWNlbWVudC5cbiAgICAgIC8vIFhYWCBuZWVkcyBtb3JlIHRob3VnaHQgb24gbm9uLXplcm8gc2tpcFxuICAgICAgLy8gWFhYIDIgaXMgYSBcIm1hZ2ljIG51bWJlclwiIG1lYW5pbmcgdGhlcmUgaXMgYW4gZXh0cmEgY2h1bmsgb2YgZG9jcyBmb3JcbiAgICAgIC8vIGJ1ZmZlciBpZiBzdWNoIGlzIG5lZWRlZC5cbiAgICAgIHZhciBjdXJzb3IgPSBzZWxmLl9jdXJzb3JGb3JRdWVyeSh7IGxpbWl0OiBzZWxmLl9saW1pdCAqIDIgfSk7XG4gICAgICB0cnkge1xuICAgICAgICBjdXJzb3IuZm9yRWFjaChmdW5jdGlvbiAoZG9jLCBpKSB7ICAvLyB5aWVsZHNcbiAgICAgICAgICBpZiAoIXNlbGYuX2xpbWl0IHx8IGkgPCBzZWxmLl9saW1pdCkge1xuICAgICAgICAgICAgbmV3UmVzdWx0cy5zZXQoZG9jLl9pZCwgZG9jKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3QnVmZmVyLnNldChkb2MuX2lkLCBkb2MpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBpZiAob3B0aW9ucy5pbml0aWFsICYmIHR5cGVvZihlLmNvZGUpID09PSAnbnVtYmVyJykge1xuICAgICAgICAgIC8vIFRoaXMgaXMgYW4gZXJyb3IgZG9jdW1lbnQgc2VudCB0byB1cyBieSBtb25nb2QsIG5vdCBhIGNvbm5lY3Rpb25cbiAgICAgICAgICAvLyBlcnJvciBnZW5lcmF0ZWQgYnkgdGhlIGNsaWVudC4gQW5kIHdlJ3ZlIG5ldmVyIHNlZW4gdGhpcyBxdWVyeSB3b3JrXG4gICAgICAgICAgLy8gc3VjY2Vzc2Z1bGx5LiBQcm9iYWJseSBpdCdzIGEgYmFkIHNlbGVjdG9yIG9yIHNvbWV0aGluZywgc28gd2VcbiAgICAgICAgICAvLyBzaG91bGQgTk9UIHJldHJ5LiBJbnN0ZWFkLCB3ZSBzaG91bGQgaGFsdCB0aGUgb2JzZXJ2ZSAod2hpY2ggZW5kc1xuICAgICAgICAgIC8vIHVwIGNhbGxpbmcgYHN0b3BgIG9uIHVzKS5cbiAgICAgICAgICBzZWxmLl9tdWx0aXBsZXhlci5xdWVyeUVycm9yKGUpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIER1cmluZyBmYWlsb3ZlciAoZWcpIGlmIHdlIGdldCBhbiBleGNlcHRpb24gd2Ugc2hvdWxkIGxvZyBhbmQgcmV0cnlcbiAgICAgICAgLy8gaW5zdGVhZCBvZiBjcmFzaGluZy5cbiAgICAgICAgTWV0ZW9yLl9kZWJ1ZyhcIkdvdCBleGNlcHRpb24gd2hpbGUgcG9sbGluZyBxdWVyeVwiLCBlKTtcbiAgICAgICAgTWV0ZW9yLl9zbGVlcEZvck1zKDEwMCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHNlbGYuX3N0b3BwZWQpXG4gICAgICByZXR1cm47XG5cbiAgICBzZWxmLl9wdWJsaXNoTmV3UmVzdWx0cyhuZXdSZXN1bHRzLCBuZXdCdWZmZXIpO1xuICB9LFxuXG4gIC8vIFRyYW5zaXRpb25zIHRvIFFVRVJZSU5HIGFuZCBydW5zIGFub3RoZXIgcXVlcnksIG9yIChpZiBhbHJlYWR5IGluIFFVRVJZSU5HKVxuICAvLyBlbnN1cmVzIHRoYXQgd2Ugd2lsbCBxdWVyeSBhZ2FpbiBsYXRlci5cbiAgLy9cbiAgLy8gVGhpcyBmdW5jdGlvbiBtYXkgbm90IGJsb2NrLCBiZWNhdXNlIGl0IGlzIGNhbGxlZCBmcm9tIGFuIG9wbG9nIGVudHJ5XG4gIC8vIGhhbmRsZXIuIEhvd2V2ZXIsIGlmIHdlIHdlcmUgbm90IGFscmVhZHkgaW4gdGhlIFFVRVJZSU5HIHBoYXNlLCBpdCB0aHJvd3NcbiAgLy8gYW4gZXhjZXB0aW9uIHRoYXQgaXMgY2F1Z2h0IGJ5IHRoZSBjbG9zZXN0IHN1cnJvdW5kaW5nXG4gIC8vIGZpbmlzaElmTmVlZFRvUG9sbFF1ZXJ5IGNhbGw7IHRoaXMgZW5zdXJlcyB0aGF0IHdlIGRvbid0IGNvbnRpbnVlIHJ1bm5pbmdcbiAgLy8gY2xvc2UgdGhhdCB3YXMgZGVzaWduZWQgZm9yIGFub3RoZXIgcGhhc2UgaW5zaWRlIFBIQVNFLlFVRVJZSU5HLlxuICAvL1xuICAvLyAoSXQncyBhbHNvIG5lY2Vzc2FyeSB3aGVuZXZlciBsb2dpYyBpbiB0aGlzIGZpbGUgeWllbGRzIHRvIGNoZWNrIHRoYXQgb3RoZXJcbiAgLy8gcGhhc2VzIGhhdmVuJ3QgcHV0IHVzIGludG8gUVVFUllJTkcgbW9kZSwgdGhvdWdoOyBlZyxcbiAgLy8gX2ZldGNoTW9kaWZpZWREb2N1bWVudHMgZG9lcyB0aGlzLilcbiAgX25lZWRUb1BvbGxRdWVyeTogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBNZXRlb3IuX25vWWllbGRzQWxsb3dlZChmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoc2VsZi5fc3RvcHBlZClcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICAvLyBJZiB3ZSdyZSBub3QgYWxyZWFkeSBpbiB0aGUgbWlkZGxlIG9mIGEgcXVlcnksIHdlIGNhbiBxdWVyeSBub3dcbiAgICAgIC8vIChwb3NzaWJseSBwYXVzaW5nIEZFVENISU5HKS5cbiAgICAgIGlmIChzZWxmLl9waGFzZSAhPT0gUEhBU0UuUVVFUllJTkcpIHtcbiAgICAgICAgc2VsZi5fcG9sbFF1ZXJ5KCk7XG4gICAgICAgIHRocm93IG5ldyBTd2l0Y2hlZFRvUXVlcnk7XG4gICAgICB9XG5cbiAgICAgIC8vIFdlJ3JlIGN1cnJlbnRseSBpbiBRVUVSWUlORy4gU2V0IGEgZmxhZyB0byBlbnN1cmUgdGhhdCB3ZSBydW4gYW5vdGhlclxuICAgICAgLy8gcXVlcnkgd2hlbiB3ZSdyZSBkb25lLlxuICAgICAgc2VsZi5fcmVxdWVyeVdoZW5Eb25lVGhpc1F1ZXJ5ID0gdHJ1ZTtcbiAgICB9KTtcbiAgfSxcblxuICAvLyBZaWVsZHMhXG4gIF9kb25lUXVlcnlpbmc6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICBpZiAoc2VsZi5fc3RvcHBlZClcbiAgICAgIHJldHVybjtcbiAgICBzZWxmLl9tb25nb0hhbmRsZS5fb3Bsb2dIYW5kbGUud2FpdFVudGlsQ2F1Z2h0VXAoKTsgIC8vIHlpZWxkc1xuICAgIGlmIChzZWxmLl9zdG9wcGVkKVxuICAgICAgcmV0dXJuO1xuICAgIGlmIChzZWxmLl9waGFzZSAhPT0gUEhBU0UuUVVFUllJTkcpXG4gICAgICB0aHJvdyBFcnJvcihcIlBoYXNlIHVuZXhwZWN0ZWRseSBcIiArIHNlbGYuX3BoYXNlKTtcblxuICAgIE1ldGVvci5fbm9ZaWVsZHNBbGxvd2VkKGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChzZWxmLl9yZXF1ZXJ5V2hlbkRvbmVUaGlzUXVlcnkpIHtcbiAgICAgICAgc2VsZi5fcmVxdWVyeVdoZW5Eb25lVGhpc1F1ZXJ5ID0gZmFsc2U7XG4gICAgICAgIHNlbGYuX3BvbGxRdWVyeSgpO1xuICAgICAgfSBlbHNlIGlmIChzZWxmLl9uZWVkVG9GZXRjaC5lbXB0eSgpKSB7XG4gICAgICAgIHNlbGYuX2JlU3RlYWR5KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZWxmLl9mZXRjaE1vZGlmaWVkRG9jdW1lbnRzKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG5cbiAgX2N1cnNvckZvclF1ZXJ5OiBmdW5jdGlvbiAob3B0aW9uc092ZXJ3cml0ZSkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICByZXR1cm4gTWV0ZW9yLl9ub1lpZWxkc0FsbG93ZWQoZnVuY3Rpb24gKCkge1xuICAgICAgLy8gVGhlIHF1ZXJ5IHdlIHJ1biBpcyBhbG1vc3QgdGhlIHNhbWUgYXMgdGhlIGN1cnNvciB3ZSBhcmUgb2JzZXJ2aW5nLFxuICAgICAgLy8gd2l0aCBhIGZldyBjaGFuZ2VzLiBXZSBuZWVkIHRvIHJlYWQgYWxsIHRoZSBmaWVsZHMgdGhhdCBhcmUgcmVsZXZhbnQgdG9cbiAgICAgIC8vIHRoZSBzZWxlY3Rvciwgbm90IGp1c3QgdGhlIGZpZWxkcyB3ZSBhcmUgZ29pbmcgdG8gcHVibGlzaCAodGhhdCdzIHRoZVxuICAgICAgLy8gXCJzaGFyZWRcIiBwcm9qZWN0aW9uKS4gQW5kIHdlIGRvbid0IHdhbnQgdG8gYXBwbHkgYW55IHRyYW5zZm9ybSBpbiB0aGVcbiAgICAgIC8vIGN1cnNvciwgYmVjYXVzZSBvYnNlcnZlQ2hhbmdlcyBzaG91bGRuJ3QgdXNlIHRoZSB0cmFuc2Zvcm0uXG4gICAgICB2YXIgb3B0aW9ucyA9IF8uY2xvbmUoc2VsZi5fY3Vyc29yRGVzY3JpcHRpb24ub3B0aW9ucyk7XG5cbiAgICAgIC8vIEFsbG93IHRoZSBjYWxsZXIgdG8gbW9kaWZ5IHRoZSBvcHRpb25zLiBVc2VmdWwgdG8gc3BlY2lmeSBkaWZmZXJlbnRcbiAgICAgIC8vIHNraXAgYW5kIGxpbWl0IHZhbHVlcy5cbiAgICAgIF8uZXh0ZW5kKG9wdGlvbnMsIG9wdGlvbnNPdmVyd3JpdGUpO1xuXG4gICAgICBvcHRpb25zLmZpZWxkcyA9IHNlbGYuX3NoYXJlZFByb2plY3Rpb247XG4gICAgICBkZWxldGUgb3B0aW9ucy50cmFuc2Zvcm07XG4gICAgICAvLyBXZSBhcmUgTk9UIGRlZXAgY2xvbmluZyBmaWVsZHMgb3Igc2VsZWN0b3IgaGVyZSwgd2hpY2ggc2hvdWxkIGJlIE9LLlxuICAgICAgdmFyIGRlc2NyaXB0aW9uID0gbmV3IEN1cnNvckRlc2NyaXB0aW9uKFxuICAgICAgICBzZWxmLl9jdXJzb3JEZXNjcmlwdGlvbi5jb2xsZWN0aW9uTmFtZSxcbiAgICAgICAgc2VsZi5fY3Vyc29yRGVzY3JpcHRpb24uc2VsZWN0b3IsXG4gICAgICAgIG9wdGlvbnMpO1xuICAgICAgcmV0dXJuIG5ldyBDdXJzb3Ioc2VsZi5fbW9uZ29IYW5kbGUsIGRlc2NyaXB0aW9uKTtcbiAgICB9KTtcbiAgfSxcblxuXG4gIC8vIFJlcGxhY2Ugc2VsZi5fcHVibGlzaGVkIHdpdGggbmV3UmVzdWx0cyAoYm90aCBhcmUgSWRNYXBzKSwgaW52b2tpbmcgb2JzZXJ2ZVxuICAvLyBjYWxsYmFja3Mgb24gdGhlIG11bHRpcGxleGVyLlxuICAvLyBSZXBsYWNlIHNlbGYuX3VucHVibGlzaGVkQnVmZmVyIHdpdGggbmV3QnVmZmVyLlxuICAvL1xuICAvLyBYWFggVGhpcyBpcyB2ZXJ5IHNpbWlsYXIgdG8gTG9jYWxDb2xsZWN0aW9uLl9kaWZmUXVlcnlVbm9yZGVyZWRDaGFuZ2VzLiBXZVxuICAvLyBzaG91bGQgcmVhbGx5OiAoYSkgVW5pZnkgSWRNYXAgYW5kIE9yZGVyZWREaWN0IGludG8gVW5vcmRlcmVkL09yZGVyZWREaWN0XG4gIC8vIChiKSBSZXdyaXRlIGRpZmYuanMgdG8gdXNlIHRoZXNlIGNsYXNzZXMgaW5zdGVhZCBvZiBhcnJheXMgYW5kIG9iamVjdHMuXG4gIF9wdWJsaXNoTmV3UmVzdWx0czogZnVuY3Rpb24gKG5ld1Jlc3VsdHMsIG5ld0J1ZmZlcikge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBNZXRlb3IuX25vWWllbGRzQWxsb3dlZChmdW5jdGlvbiAoKSB7XG5cbiAgICAgIC8vIElmIHRoZSBxdWVyeSBpcyBsaW1pdGVkIGFuZCB0aGVyZSBpcyBhIGJ1ZmZlciwgc2h1dCBkb3duIHNvIGl0IGRvZXNuJ3RcbiAgICAgIC8vIHN0YXkgaW4gYSB3YXkuXG4gICAgICBpZiAoc2VsZi5fbGltaXQpIHtcbiAgICAgICAgc2VsZi5fdW5wdWJsaXNoZWRCdWZmZXIuY2xlYXIoKTtcbiAgICAgIH1cblxuICAgICAgLy8gRmlyc3QgcmVtb3ZlIGFueXRoaW5nIHRoYXQncyBnb25lLiBCZSBjYXJlZnVsIG5vdCB0byBtb2RpZnlcbiAgICAgIC8vIHNlbGYuX3B1Ymxpc2hlZCB3aGlsZSBpdGVyYXRpbmcgb3ZlciBpdC5cbiAgICAgIHZhciBpZHNUb1JlbW92ZSA9IFtdO1xuICAgICAgc2VsZi5fcHVibGlzaGVkLmZvckVhY2goZnVuY3Rpb24gKGRvYywgaWQpIHtcbiAgICAgICAgaWYgKCFuZXdSZXN1bHRzLmhhcyhpZCkpXG4gICAgICAgICAgaWRzVG9SZW1vdmUucHVzaChpZCk7XG4gICAgICB9KTtcbiAgICAgIF8uZWFjaChpZHNUb1JlbW92ZSwgZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgIHNlbGYuX3JlbW92ZVB1Ymxpc2hlZChpZCk7XG4gICAgICB9KTtcblxuICAgICAgLy8gTm93IGRvIGFkZHMgYW5kIGNoYW5nZXMuXG4gICAgICAvLyBJZiBzZWxmIGhhcyBhIGJ1ZmZlciBhbmQgbGltaXQsIHRoZSBuZXcgZmV0Y2hlZCByZXN1bHQgd2lsbCBiZVxuICAgICAgLy8gbGltaXRlZCBjb3JyZWN0bHkgYXMgdGhlIHF1ZXJ5IGhhcyBzb3J0IHNwZWNpZmllci5cbiAgICAgIG5ld1Jlc3VsdHMuZm9yRWFjaChmdW5jdGlvbiAoZG9jLCBpZCkge1xuICAgICAgICBzZWxmLl9oYW5kbGVEb2MoaWQsIGRvYyk7XG4gICAgICB9KTtcblxuICAgICAgLy8gU2FuaXR5LWNoZWNrIHRoYXQgZXZlcnl0aGluZyB3ZSB0cmllZCB0byBwdXQgaW50byBfcHVibGlzaGVkIGVuZGVkIHVwXG4gICAgICAvLyB0aGVyZS5cbiAgICAgIC8vIFhYWCBpZiB0aGlzIGlzIHNsb3csIHJlbW92ZSBpdCBsYXRlclxuICAgICAgaWYgKHNlbGYuX3B1Ymxpc2hlZC5zaXplKCkgIT09IG5ld1Jlc3VsdHMuc2l6ZSgpKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ1RoZSBNb25nbyBzZXJ2ZXIgYW5kIHRoZSBNZXRlb3IgcXVlcnkgZGlzYWdyZWUgb24gaG93ICcgK1xuICAgICAgICAgICdtYW55IGRvY3VtZW50cyBtYXRjaCB5b3VyIHF1ZXJ5LiBDdXJzb3IgZGVzY3JpcHRpb246ICcsXG4gICAgICAgICAgc2VsZi5fY3Vyc29yRGVzY3JpcHRpb24pO1xuICAgICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgICBcIlRoZSBNb25nbyBzZXJ2ZXIgYW5kIHRoZSBNZXRlb3IgcXVlcnkgZGlzYWdyZWUgb24gaG93IFwiICtcbiAgICAgICAgICAgIFwibWFueSBkb2N1bWVudHMgbWF0Y2ggeW91ciBxdWVyeS4gTWF5YmUgaXQgaXMgaGl0dGluZyBhIE1vbmdvIFwiICtcbiAgICAgICAgICAgIFwiZWRnZSBjYXNlPyBUaGUgcXVlcnkgaXM6IFwiICtcbiAgICAgICAgICAgIEVKU09OLnN0cmluZ2lmeShzZWxmLl9jdXJzb3JEZXNjcmlwdGlvbi5zZWxlY3RvcikpO1xuICAgICAgfVxuICAgICAgc2VsZi5fcHVibGlzaGVkLmZvckVhY2goZnVuY3Rpb24gKGRvYywgaWQpIHtcbiAgICAgICAgaWYgKCFuZXdSZXN1bHRzLmhhcyhpZCkpXG4gICAgICAgICAgdGhyb3cgRXJyb3IoXCJfcHVibGlzaGVkIGhhcyBhIGRvYyB0aGF0IG5ld1Jlc3VsdHMgZG9lc24ndDsgXCIgKyBpZCk7XG4gICAgICB9KTtcblxuICAgICAgLy8gRmluYWxseSwgcmVwbGFjZSB0aGUgYnVmZmVyXG4gICAgICBuZXdCdWZmZXIuZm9yRWFjaChmdW5jdGlvbiAoZG9jLCBpZCkge1xuICAgICAgICBzZWxmLl9hZGRCdWZmZXJlZChpZCwgZG9jKTtcbiAgICAgIH0pO1xuXG4gICAgICBzZWxmLl9zYWZlQXBwZW5kVG9CdWZmZXIgPSBuZXdCdWZmZXIuc2l6ZSgpIDwgc2VsZi5fbGltaXQ7XG4gICAgfSk7XG4gIH0sXG5cbiAgLy8gVGhpcyBzdG9wIGZ1bmN0aW9uIGlzIGludm9rZWQgZnJvbSB0aGUgb25TdG9wIG9mIHRoZSBPYnNlcnZlTXVsdGlwbGV4ZXIsIHNvXG4gIC8vIGl0IHNob3VsZG4ndCBhY3R1YWxseSBiZSBwb3NzaWJsZSB0byBjYWxsIGl0IHVudGlsIHRoZSBtdWx0aXBsZXhlciBpc1xuICAvLyByZWFkeS5cbiAgLy9cbiAgLy8gSXQncyBpbXBvcnRhbnQgdG8gY2hlY2sgc2VsZi5fc3RvcHBlZCBhZnRlciBldmVyeSBjYWxsIGluIHRoaXMgZmlsZSB0aGF0XG4gIC8vIGNhbiB5aWVsZCFcbiAgc3RvcDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBpZiAoc2VsZi5fc3RvcHBlZClcbiAgICAgIHJldHVybjtcbiAgICBzZWxmLl9zdG9wcGVkID0gdHJ1ZTtcbiAgICBfLmVhY2goc2VsZi5fc3RvcEhhbmRsZXMsIGZ1bmN0aW9uIChoYW5kbGUpIHtcbiAgICAgIGhhbmRsZS5zdG9wKCk7XG4gICAgfSk7XG5cbiAgICAvLyBOb3RlOiB3ZSAqZG9uJ3QqIHVzZSBtdWx0aXBsZXhlci5vbkZsdXNoIGhlcmUgYmVjYXVzZSB0aGlzIHN0b3BcbiAgICAvLyBjYWxsYmFjayBpcyBhY3R1YWxseSBpbnZva2VkIGJ5IHRoZSBtdWx0aXBsZXhlciBpdHNlbGYgd2hlbiBpdCBoYXNcbiAgICAvLyBkZXRlcm1pbmVkIHRoYXQgdGhlcmUgYXJlIG5vIGhhbmRsZXMgbGVmdC4gU28gbm90aGluZyBpcyBhY3R1YWxseSBnb2luZ1xuICAgIC8vIHRvIGdldCBmbHVzaGVkIChhbmQgaXQncyBwcm9iYWJseSBub3QgdmFsaWQgdG8gY2FsbCBtZXRob2RzIG9uIHRoZVxuICAgIC8vIGR5aW5nIG11bHRpcGxleGVyKS5cbiAgICBfLmVhY2goc2VsZi5fd3JpdGVzVG9Db21taXRXaGVuV2VSZWFjaFN0ZWFkeSwgZnVuY3Rpb24gKHcpIHtcbiAgICAgIHcuY29tbWl0dGVkKCk7ICAvLyBtYXliZSB5aWVsZHM/XG4gICAgfSk7XG4gICAgc2VsZi5fd3JpdGVzVG9Db21taXRXaGVuV2VSZWFjaFN0ZWFkeSA9IG51bGw7XG5cbiAgICAvLyBQcm9hY3RpdmVseSBkcm9wIHJlZmVyZW5jZXMgdG8gcG90ZW50aWFsbHkgYmlnIHRoaW5ncy5cbiAgICBzZWxmLl9wdWJsaXNoZWQgPSBudWxsO1xuICAgIHNlbGYuX3VucHVibGlzaGVkQnVmZmVyID0gbnVsbDtcbiAgICBzZWxmLl9uZWVkVG9GZXRjaCA9IG51bGw7XG4gICAgc2VsZi5fY3VycmVudGx5RmV0Y2hpbmcgPSBudWxsO1xuICAgIHNlbGYuX29wbG9nRW50cnlIYW5kbGUgPSBudWxsO1xuICAgIHNlbGYuX2xpc3RlbmVyc0hhbmRsZSA9IG51bGw7XG5cbiAgICBQYWNrYWdlWydmYWN0cy1iYXNlJ10gJiYgUGFja2FnZVsnZmFjdHMtYmFzZSddLkZhY3RzLmluY3JlbWVudFNlcnZlckZhY3QoXG4gICAgICBcIm1vbmdvLWxpdmVkYXRhXCIsIFwib2JzZXJ2ZS1kcml2ZXJzLW9wbG9nXCIsIC0xKTtcbiAgfSxcblxuICBfcmVnaXN0ZXJQaGFzZUNoYW5nZTogZnVuY3Rpb24gKHBoYXNlKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIE1ldGVvci5fbm9ZaWVsZHNBbGxvd2VkKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBub3cgPSBuZXcgRGF0ZTtcblxuICAgICAgaWYgKHNlbGYuX3BoYXNlKSB7XG4gICAgICAgIHZhciB0aW1lRGlmZiA9IG5vdyAtIHNlbGYuX3BoYXNlU3RhcnRUaW1lO1xuICAgICAgICBQYWNrYWdlWydmYWN0cy1iYXNlJ10gJiYgUGFja2FnZVsnZmFjdHMtYmFzZSddLkZhY3RzLmluY3JlbWVudFNlcnZlckZhY3QoXG4gICAgICAgICAgXCJtb25nby1saXZlZGF0YVwiLCBcInRpbWUtc3BlbnQtaW4tXCIgKyBzZWxmLl9waGFzZSArIFwiLXBoYXNlXCIsIHRpbWVEaWZmKTtcbiAgICAgIH1cblxuICAgICAgc2VsZi5fcGhhc2UgPSBwaGFzZTtcbiAgICAgIHNlbGYuX3BoYXNlU3RhcnRUaW1lID0gbm93O1xuICAgIH0pO1xuICB9XG59KTtcblxuLy8gRG9lcyBvdXIgb3Bsb2cgdGFpbGluZyBjb2RlIHN1cHBvcnQgdGhpcyBjdXJzb3I/IEZvciBub3csIHdlIGFyZSBiZWluZyB2ZXJ5XG4vLyBjb25zZXJ2YXRpdmUgYW5kIGFsbG93aW5nIG9ubHkgc2ltcGxlIHF1ZXJpZXMgd2l0aCBzaW1wbGUgb3B0aW9ucy5cbi8vIChUaGlzIGlzIGEgXCJzdGF0aWMgbWV0aG9kXCIuKVxuT3Bsb2dPYnNlcnZlRHJpdmVyLmN1cnNvclN1cHBvcnRlZCA9IGZ1bmN0aW9uIChjdXJzb3JEZXNjcmlwdGlvbiwgbWF0Y2hlcikge1xuICAvLyBGaXJzdCwgY2hlY2sgdGhlIG9wdGlvbnMuXG4gIHZhciBvcHRpb25zID0gY3Vyc29yRGVzY3JpcHRpb24ub3B0aW9ucztcblxuICAvLyBEaWQgdGhlIHVzZXIgc2F5IG5vIGV4cGxpY2l0bHk/XG4gIC8vIHVuZGVyc2NvcmVkIHZlcnNpb24gb2YgdGhlIG9wdGlvbiBpcyBDT01QQVQgd2l0aCAxLjJcbiAgaWYgKG9wdGlvbnMuZGlzYWJsZU9wbG9nIHx8IG9wdGlvbnMuX2Rpc2FibGVPcGxvZylcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgLy8gc2tpcCBpcyBub3Qgc3VwcG9ydGVkOiB0byBzdXBwb3J0IGl0IHdlIHdvdWxkIG5lZWQgdG8ga2VlcCB0cmFjayBvZiBhbGxcbiAgLy8gXCJza2lwcGVkXCIgZG9jdW1lbnRzIG9yIGF0IGxlYXN0IHRoZWlyIGlkcy5cbiAgLy8gbGltaXQgdy9vIGEgc29ydCBzcGVjaWZpZXIgaXMgbm90IHN1cHBvcnRlZDogY3VycmVudCBpbXBsZW1lbnRhdGlvbiBuZWVkcyBhXG4gIC8vIGRldGVybWluaXN0aWMgd2F5IHRvIG9yZGVyIGRvY3VtZW50cy5cbiAgaWYgKG9wdGlvbnMuc2tpcCB8fCAob3B0aW9ucy5saW1pdCAmJiAhb3B0aW9ucy5zb3J0KSkgcmV0dXJuIGZhbHNlO1xuXG4gIC8vIElmIGEgZmllbGRzIHByb2plY3Rpb24gb3B0aW9uIGlzIGdpdmVuIGNoZWNrIGlmIGl0IGlzIHN1cHBvcnRlZCBieVxuICAvLyBtaW5pbW9uZ28gKHNvbWUgb3BlcmF0b3JzIGFyZSBub3Qgc3VwcG9ydGVkKS5cbiAgaWYgKG9wdGlvbnMuZmllbGRzKSB7XG4gICAgdHJ5IHtcbiAgICAgIExvY2FsQ29sbGVjdGlvbi5fY2hlY2tTdXBwb3J0ZWRQcm9qZWN0aW9uKG9wdGlvbnMuZmllbGRzKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZiAoZS5uYW1lID09PSBcIk1pbmltb25nb0Vycm9yXCIpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBXZSBkb24ndCBhbGxvdyB0aGUgZm9sbG93aW5nIHNlbGVjdG9yczpcbiAgLy8gICAtICR3aGVyZSAobm90IGNvbmZpZGVudCB0aGF0IHdlIHByb3ZpZGUgdGhlIHNhbWUgSlMgZW52aXJvbm1lbnRcbiAgLy8gICAgICAgICAgICAgYXMgTW9uZ28sIGFuZCBjYW4geWllbGQhKVxuICAvLyAgIC0gJG5lYXIgKGhhcyBcImludGVyZXN0aW5nXCIgcHJvcGVydGllcyBpbiBNb25nb0RCLCBsaWtlIHRoZSBwb3NzaWJpbGl0eVxuICAvLyAgICAgICAgICAgIG9mIHJldHVybmluZyBhbiBJRCBtdWx0aXBsZSB0aW1lcywgdGhvdWdoIGV2ZW4gcG9sbGluZyBtYXliZVxuICAvLyAgICAgICAgICAgIGhhdmUgYSBidWcgdGhlcmUpXG4gIC8vICAgICAgICAgICBYWFg6IG9uY2Ugd2Ugc3VwcG9ydCBpdCwgd2Ugd291bGQgbmVlZCB0byB0aGluayBtb3JlIG9uIGhvdyB3ZVxuICAvLyAgICAgICAgICAgaW5pdGlhbGl6ZSB0aGUgY29tcGFyYXRvcnMgd2hlbiB3ZSBjcmVhdGUgdGhlIGRyaXZlci5cbiAgcmV0dXJuICFtYXRjaGVyLmhhc1doZXJlKCkgJiYgIW1hdGNoZXIuaGFzR2VvUXVlcnkoKTtcbn07XG5cbnZhciBtb2RpZmllckNhbkJlRGlyZWN0bHlBcHBsaWVkID0gZnVuY3Rpb24gKG1vZGlmaWVyKSB7XG4gIHJldHVybiBfLmFsbChtb2RpZmllciwgZnVuY3Rpb24gKGZpZWxkcywgb3BlcmF0aW9uKSB7XG4gICAgcmV0dXJuIF8uYWxsKGZpZWxkcywgZnVuY3Rpb24gKHZhbHVlLCBmaWVsZCkge1xuICAgICAgcmV0dXJuICEvRUpTT05cXCQvLnRlc3QoZmllbGQpO1xuICAgIH0pO1xuICB9KTtcbn07XG5cbk1vbmdvSW50ZXJuYWxzLk9wbG9nT2JzZXJ2ZURyaXZlciA9IE9wbG9nT2JzZXJ2ZURyaXZlcjtcbiIsIlxuXG5mdW5jdGlvbiBqb2luKHByZWZpeCwga2V5KSB7XG4gICAgcmV0dXJuIHByZWZpeCA/IGAke3ByZWZpeH0uJHtrZXl9YCA6IGtleTtcbn1cblxuY29uc3QgYXJyYXlPcGVyYXRvcktleVJlZ2V4ID0gL14oYXxbc3VdXFxkKykkLztcblxuZnVuY3Rpb24gaXNBcnJheU9wZXJhdG9yS2V5KGZpZWxkKSB7XG4gICAgcmV0dXJuIGFycmF5T3BlcmF0b3JLZXlSZWdleC50ZXN0KGZpZWxkKTtcbn1cblxuZnVuY3Rpb24gaXNBcnJheU9wZXJhdG9yKG9wZXJhdG9yKSB7XG4gICAgcmV0dXJuIG9wZXJhdG9yLmEgPT09IHRydWUgJiYgT2JqZWN0LmtleXMob3BlcmF0b3IpLmV2ZXJ5KGlzQXJyYXlPcGVyYXRvcktleSk7XG59XG5cbmZ1bmN0aW9uIGZsYXR0ZW5PYmplY3RJbnRvKHRhcmdldCwgc291cmNlLCBwcmVmaXgpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShzb3VyY2UpIHx8IHR5cGVvZiBzb3VyY2UgIT09ICdvYmplY3QnIHx8IHNvdXJjZSA9PT0gbnVsbCB8fFxuICAgICAgICBzb3VyY2UgaW5zdGFuY2VvZiBNb25nby5PYmplY3RJRCkge1xuICAgICAgICB0YXJnZXRbcHJlZml4XSA9IHNvdXJjZTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBlbnRyaWVzID0gT2JqZWN0LmVudHJpZXMoc291cmNlKTtcbiAgICAgICAgaWYgKGVudHJpZXMubGVuZ3RoKSB7XG4gICAgICAgIGVudHJpZXMuZm9yRWFjaCgoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICAgICAgICBmbGF0dGVuT2JqZWN0SW50byh0YXJnZXQsIHZhbHVlLCBqb2luKHByZWZpeCwga2V5KSk7XG4gICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICB0YXJnZXRbcHJlZml4XSA9IHNvdXJjZTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuY29uc3QgbG9nRGVidWdNZXNzYWdlcyA9ICEhcHJvY2Vzcy5lbnYuT1BMT0dfQ09OVkVSVEVSX0RFQlVHO1xuXG5mdW5jdGlvbiBjb252ZXJ0T3Bsb2dEaWZmKG9wbG9nRW50cnksIGRpZmYsIHByZWZpeCkge1xuICAgIGlmIChsb2dEZWJ1Z01lc3NhZ2VzKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGBjb252ZXJ0T3Bsb2dEaWZmKCR7SlNPTi5zdHJpbmdpZnkob3Bsb2dFbnRyeSl9LCAke0pTT04uc3RyaW5naWZ5KGRpZmYpfSwgJHtKU09OLnN0cmluZ2lmeShwcmVmaXgpfSlgKTtcbiAgICB9XG5cbiAgICBPYmplY3QuZW50cmllcyhkaWZmKS5mb3JFYWNoKChbZGlmZktleSwgdmFsdWVdKSA9PiB7XG4gICAgICAgIGlmIChkaWZmS2V5ID09PSAnZCcpIHtcbiAgICAgICAgLy8gSGFuZGxlIGAkdW5zZXRgcy5cbiAgICAgICAgaWYgKG9wbG9nRW50cnkuJHVuc2V0ID09PSBudWxsIHx8IG9wbG9nRW50cnkuJHVuc2V0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIG9wbG9nRW50cnkuJHVuc2V0ID0ge307XG4gICAgICAgIH1cbiAgICAgICAgT2JqZWN0LmtleXModmFsdWUpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICAgIG9wbG9nRW50cnkuJHVuc2V0W2pvaW4ocHJlZml4LCBrZXkpXSA9IHRydWU7XG4gICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKGRpZmZLZXkgPT09ICdpJykge1xuICAgICAgICAvLyBIYW5kbGUgKHBvdGVudGlhbGx5KSBuZXN0ZWQgYCRzZXRgcy5cbiAgICAgICAgaWYgKG9wbG9nRW50cnkuJHNldCA9PT0gbnVsbCB8fCBvcGxvZ0VudHJ5LiRzZXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgb3Bsb2dFbnRyeS4kc2V0ID0ge307XG4gICAgICAgIH1cbiAgICAgICAgZmxhdHRlbk9iamVjdEludG8ob3Bsb2dFbnRyeS4kc2V0LCB2YWx1ZSwgcHJlZml4KTtcbiAgICAgICAgfSBlbHNlIGlmIChkaWZmS2V5ID09PSAndScpIHtcbiAgICAgICAgLy8gSGFuZGxlIGZsYXQgYCRzZXRgcy5cbiAgICAgICAgaWYgKG9wbG9nRW50cnkuJHNldCA9PT0gbnVsbCB8fCBvcGxvZ0VudHJ5LiRzZXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgb3Bsb2dFbnRyeS4kc2V0ID0ge307XG4gICAgICAgIH1cbiAgICAgICAgT2JqZWN0LmVudHJpZXModmFsdWUpLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgICAgICAgb3Bsb2dFbnRyeS4kc2V0W2pvaW4ocHJlZml4LCBrZXkpXSA9IHZhbHVlO1xuICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gSGFuZGxlIHMtZmllbGRzLlxuICAgICAgICBjb25zdCBrZXkgPSBkaWZmS2V5LnNsaWNlKDEpO1xuICAgICAgICBpZiAoaXNBcnJheU9wZXJhdG9yKHZhbHVlKSkge1xuICAgICAgICAgICAgLy8gQXJyYXkgb3BlcmF0b3IuXG4gICAgICAgICAgICBPYmplY3QuZW50cmllcyh2YWx1ZSkuZm9yRWFjaCgoW3Bvc2l0aW9uLCB2YWx1ZV0pID0+IHtcbiAgICAgICAgICAgIGlmIChwb3NpdGlvbiA9PT0gJ2EnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBwb3NpdGlvbktleSA9IGpvaW4oam9pbihwcmVmaXgsIGtleSksIHBvc2l0aW9uLnNsaWNlKDEpKTtcbiAgICAgICAgICAgIGlmIChwb3NpdGlvblswXSA9PT0gJ3MnKSB7XG4gICAgICAgICAgICAgICAgY29udmVydE9wbG9nRGlmZihvcGxvZ0VudHJ5LCB2YWx1ZSwgcG9zaXRpb25LZXkpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGlmIChvcGxvZ0VudHJ5LiR1bnNldCA9PT0gbnVsbCB8fCBvcGxvZ0VudHJ5LiR1bnNldCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgb3Bsb2dFbnRyeS4kdW5zZXQgPSB7fTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgb3Bsb2dFbnRyeS4kdW5zZXRbcG9zaXRpb25LZXldID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKG9wbG9nRW50cnkuJHNldCA9PT0gbnVsbCB8fCBvcGxvZ0VudHJ5LiRzZXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIG9wbG9nRW50cnkuJHNldCA9IHt9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBvcGxvZ0VudHJ5LiRzZXRbcG9zaXRpb25LZXldID0gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIGlmIChrZXkpIHtcbiAgICAgICAgICAgIC8vIE5lc3RlZCBvYmplY3QuXG4gICAgICAgICAgICBjb252ZXJ0T3Bsb2dEaWZmKG9wbG9nRW50cnksIHZhbHVlLCBqb2luKHByZWZpeCwga2V5KSk7XG4gICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gb3Bsb2dWMlYxQ29udmVydGVyKG9wbG9nRW50cnkpIHtcbiAgLy8gUGFzcy10aHJvdWdoIHYxIGFuZCAocHJvYmFibHkpIGludmFsaWQgZW50cmllcy5cbiAgaWYgKG9wbG9nRW50cnkuJHYgIT09IDIgfHwgIW9wbG9nRW50cnkuZGlmZikge1xuICAgIHJldHVybiBvcGxvZ0VudHJ5O1xuICB9XG5cbiAgY29uc3QgY29udmVydGVkT3Bsb2dFbnRyeSA9IHsgJHY6IDIgfTtcbiAgY29udmVydE9wbG9nRGlmZihjb252ZXJ0ZWRPcGxvZ0VudHJ5LCBvcGxvZ0VudHJ5LmRpZmYsICcnKTtcbiAgcmV0dXJuIGNvbnZlcnRlZE9wbG9nRW50cnk7XG59IiwiLy8gc2luZ2xldG9uXG5leHBvcnQgY29uc3QgTG9jYWxDb2xsZWN0aW9uRHJpdmVyID0gbmV3IChjbGFzcyBMb2NhbENvbGxlY3Rpb25Ecml2ZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLm5vQ29ubkNvbGxlY3Rpb25zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgfVxuXG4gIG9wZW4obmFtZSwgY29ubikge1xuICAgIGlmICghIG5hbWUpIHtcbiAgICAgIHJldHVybiBuZXcgTG9jYWxDb2xsZWN0aW9uO1xuICAgIH1cblxuICAgIGlmICghIGNvbm4pIHtcbiAgICAgIHJldHVybiBlbnN1cmVDb2xsZWN0aW9uKG5hbWUsIHRoaXMubm9Db25uQ29sbGVjdGlvbnMpO1xuICAgIH1cblxuICAgIGlmICghIGNvbm4uX21vbmdvX2xpdmVkYXRhX2NvbGxlY3Rpb25zKSB7XG4gICAgICBjb25uLl9tb25nb19saXZlZGF0YV9jb2xsZWN0aW9ucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgfVxuXG4gICAgLy8gWFhYIGlzIHRoZXJlIGEgd2F5IHRvIGtlZXAgdHJhY2sgb2YgYSBjb25uZWN0aW9uJ3MgY29sbGVjdGlvbnMgd2l0aG91dFxuICAgIC8vIGRhbmdsaW5nIGl0IG9mZiB0aGUgY29ubmVjdGlvbiBvYmplY3Q/XG4gICAgcmV0dXJuIGVuc3VyZUNvbGxlY3Rpb24obmFtZSwgY29ubi5fbW9uZ29fbGl2ZWRhdGFfY29sbGVjdGlvbnMpO1xuICB9XG59KTtcblxuZnVuY3Rpb24gZW5zdXJlQ29sbGVjdGlvbihuYW1lLCBjb2xsZWN0aW9ucykge1xuICByZXR1cm4gKG5hbWUgaW4gY29sbGVjdGlvbnMpXG4gICAgPyBjb2xsZWN0aW9uc1tuYW1lXVxuICAgIDogY29sbGVjdGlvbnNbbmFtZV0gPSBuZXcgTG9jYWxDb2xsZWN0aW9uKG5hbWUpO1xufVxuIiwiTW9uZ29JbnRlcm5hbHMuUmVtb3RlQ29sbGVjdGlvbkRyaXZlciA9IGZ1bmN0aW9uIChcbiAgbW9uZ29fdXJsLCBvcHRpb25zKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgc2VsZi5tb25nbyA9IG5ldyBNb25nb0Nvbm5lY3Rpb24obW9uZ29fdXJsLCBvcHRpb25zKTtcbn07XG5cbl8uZXh0ZW5kKE1vbmdvSW50ZXJuYWxzLlJlbW90ZUNvbGxlY3Rpb25Ecml2ZXIucHJvdG90eXBlLCB7XG4gIG9wZW46IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciByZXQgPSB7fTtcbiAgICBfLmVhY2goXG4gICAgICBbJ2ZpbmQnLCAnZmluZE9uZScsICdpbnNlcnQnLCAndXBkYXRlJywgJ3Vwc2VydCcsXG4gICAgICAgJ3JlbW92ZScsICdfZW5zdXJlSW5kZXgnLCAnX2Ryb3BJbmRleCcsICdfY3JlYXRlQ2FwcGVkQ29sbGVjdGlvbicsXG4gICAgICAgJ2Ryb3BDb2xsZWN0aW9uJywgJ3Jhd0NvbGxlY3Rpb24nXSxcbiAgICAgIGZ1bmN0aW9uIChtKSB7XG4gICAgICAgIHJldFttXSA9IF8uYmluZChzZWxmLm1vbmdvW21dLCBzZWxmLm1vbmdvLCBuYW1lKTtcbiAgICAgIH0pO1xuICAgIHJldHVybiByZXQ7XG4gIH1cbn0pO1xuXG5cbi8vIENyZWF0ZSB0aGUgc2luZ2xldG9uIFJlbW90ZUNvbGxlY3Rpb25Ecml2ZXIgb25seSBvbiBkZW1hbmQsIHNvIHdlXG4vLyBvbmx5IHJlcXVpcmUgTW9uZ28gY29uZmlndXJhdGlvbiBpZiBpdCdzIGFjdHVhbGx5IHVzZWQgKGVnLCBub3QgaWZcbi8vIHlvdSdyZSBvbmx5IHRyeWluZyB0byByZWNlaXZlIGRhdGEgZnJvbSBhIHJlbW90ZSBERFAgc2VydmVyLilcbk1vbmdvSW50ZXJuYWxzLmRlZmF1bHRSZW1vdGVDb2xsZWN0aW9uRHJpdmVyID0gXy5vbmNlKGZ1bmN0aW9uICgpIHtcbiAgdmFyIGNvbm5lY3Rpb25PcHRpb25zID0ge307XG5cbiAgdmFyIG1vbmdvVXJsID0gcHJvY2Vzcy5lbnYuTU9OR09fVVJMO1xuXG4gIGlmIChwcm9jZXNzLmVudi5NT05HT19PUExPR19VUkwpIHtcbiAgICBjb25uZWN0aW9uT3B0aW9ucy5vcGxvZ1VybCA9IHByb2Nlc3MuZW52Lk1PTkdPX09QTE9HX1VSTDtcbiAgfVxuXG4gIGlmICghIG1vbmdvVXJsKVxuICAgIHRocm93IG5ldyBFcnJvcihcIk1PTkdPX1VSTCBtdXN0IGJlIHNldCBpbiBlbnZpcm9ubWVudFwiKTtcblxuICByZXR1cm4gbmV3IE1vbmdvSW50ZXJuYWxzLlJlbW90ZUNvbGxlY3Rpb25Ecml2ZXIobW9uZ29VcmwsIGNvbm5lY3Rpb25PcHRpb25zKTtcbn0pO1xuIiwiLy8gb3B0aW9ucy5jb25uZWN0aW9uLCBpZiBnaXZlbiwgaXMgYSBMaXZlZGF0YUNsaWVudCBvciBMaXZlZGF0YVNlcnZlclxuLy8gWFhYIHByZXNlbnRseSB0aGVyZSBpcyBubyB3YXkgdG8gZGVzdHJveS9jbGVhbiB1cCBhIENvbGxlY3Rpb25cblxuLyoqXG4gKiBAc3VtbWFyeSBOYW1lc3BhY2UgZm9yIE1vbmdvREItcmVsYXRlZCBpdGVtc1xuICogQG5hbWVzcGFjZVxuICovXG5Nb25nbyA9IHt9O1xuXG4vKipcbiAqIEBzdW1tYXJ5IENvbnN0cnVjdG9yIGZvciBhIENvbGxlY3Rpb25cbiAqIEBsb2N1cyBBbnl3aGVyZVxuICogQGluc3RhbmNlbmFtZSBjb2xsZWN0aW9uXG4gKiBAY2xhc3NcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIFRoZSBuYW1lIG9mIHRoZSBjb2xsZWN0aW9uLiAgSWYgbnVsbCwgY3JlYXRlcyBhbiB1bm1hbmFnZWQgKHVuc3luY2hyb25pemVkKSBsb2NhbCBjb2xsZWN0aW9uLlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXVxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMuY29ubmVjdGlvbiBUaGUgc2VydmVyIGNvbm5lY3Rpb24gdGhhdCB3aWxsIG1hbmFnZSB0aGlzIGNvbGxlY3Rpb24uIFVzZXMgdGhlIGRlZmF1bHQgY29ubmVjdGlvbiBpZiBub3Qgc3BlY2lmaWVkLiAgUGFzcyB0aGUgcmV0dXJuIHZhbHVlIG9mIGNhbGxpbmcgW2BERFAuY29ubmVjdGBdKCNkZHBfY29ubmVjdCkgdG8gc3BlY2lmeSBhIGRpZmZlcmVudCBzZXJ2ZXIuIFBhc3MgYG51bGxgIHRvIHNwZWNpZnkgbm8gY29ubmVjdGlvbi4gVW5tYW5hZ2VkIChgbmFtZWAgaXMgbnVsbCkgY29sbGVjdGlvbnMgY2Fubm90IHNwZWNpZnkgYSBjb25uZWN0aW9uLlxuICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMuaWRHZW5lcmF0aW9uIFRoZSBtZXRob2Qgb2YgZ2VuZXJhdGluZyB0aGUgYF9pZGAgZmllbGRzIG9mIG5ldyBkb2N1bWVudHMgaW4gdGhpcyBjb2xsZWN0aW9uLiAgUG9zc2libGUgdmFsdWVzOlxuXG4gLSAqKmAnU1RSSU5HJ2AqKjogcmFuZG9tIHN0cmluZ3NcbiAtICoqYCdNT05HTydgKio6ICByYW5kb20gW2BNb25nby5PYmplY3RJRGBdKCNtb25nb19vYmplY3RfaWQpIHZhbHVlc1xuXG5UaGUgZGVmYXVsdCBpZCBnZW5lcmF0aW9uIHRlY2huaXF1ZSBpcyBgJ1NUUklORydgLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gb3B0aW9ucy50cmFuc2Zvcm0gQW4gb3B0aW9uYWwgdHJhbnNmb3JtYXRpb24gZnVuY3Rpb24uIERvY3VtZW50cyB3aWxsIGJlIHBhc3NlZCB0aHJvdWdoIHRoaXMgZnVuY3Rpb24gYmVmb3JlIGJlaW5nIHJldHVybmVkIGZyb20gYGZldGNoYCBvciBgZmluZE9uZWAsIGFuZCBiZWZvcmUgYmVpbmcgcGFzc2VkIHRvIGNhbGxiYWNrcyBvZiBgb2JzZXJ2ZWAsIGBtYXBgLCBgZm9yRWFjaGAsIGBhbGxvd2AsIGFuZCBgZGVueWAuIFRyYW5zZm9ybXMgYXJlICpub3QqIGFwcGxpZWQgZm9yIHRoZSBjYWxsYmFja3Mgb2YgYG9ic2VydmVDaGFuZ2VzYCBvciB0byBjdXJzb3JzIHJldHVybmVkIGZyb20gcHVibGlzaCBmdW5jdGlvbnMuXG4gKiBAcGFyYW0ge0Jvb2xlYW59IG9wdGlvbnMuZGVmaW5lTXV0YXRpb25NZXRob2RzIFNldCB0byBgZmFsc2VgIHRvIHNraXAgc2V0dGluZyB1cCB0aGUgbXV0YXRpb24gbWV0aG9kcyB0aGF0IGVuYWJsZSBpbnNlcnQvdXBkYXRlL3JlbW92ZSBmcm9tIGNsaWVudCBjb2RlLiBEZWZhdWx0IGB0cnVlYC5cbiAqL1xuTW9uZ28uQ29sbGVjdGlvbiA9IGZ1bmN0aW9uIENvbGxlY3Rpb24obmFtZSwgb3B0aW9ucykge1xuICBpZiAoIW5hbWUgJiYgKG5hbWUgIT09IG51bGwpKSB7XG4gICAgTWV0ZW9yLl9kZWJ1ZyhcIldhcm5pbmc6IGNyZWF0aW5nIGFub255bW91cyBjb2xsZWN0aW9uLiBJdCB3aWxsIG5vdCBiZSBcIiArXG4gICAgICAgICAgICAgICAgICBcInNhdmVkIG9yIHN5bmNocm9uaXplZCBvdmVyIHRoZSBuZXR3b3JrLiAoUGFzcyBudWxsIGZvciBcIiArXG4gICAgICAgICAgICAgICAgICBcInRoZSBjb2xsZWN0aW9uIG5hbWUgdG8gdHVybiBvZmYgdGhpcyB3YXJuaW5nLilcIik7XG4gICAgbmFtZSA9IG51bGw7XG4gIH1cblxuICBpZiAobmFtZSAhPT0gbnVsbCAmJiB0eXBlb2YgbmFtZSAhPT0gXCJzdHJpbmdcIikge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIFwiRmlyc3QgYXJndW1lbnQgdG8gbmV3IE1vbmdvLkNvbGxlY3Rpb24gbXVzdCBiZSBhIHN0cmluZyBvciBudWxsXCIpO1xuICB9XG5cbiAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5tZXRob2RzKSB7XG4gICAgLy8gQmFja3dhcmRzIGNvbXBhdGliaWxpdHkgaGFjayB3aXRoIG9yaWdpbmFsIHNpZ25hdHVyZSAod2hpY2ggcGFzc2VkXG4gICAgLy8gXCJjb25uZWN0aW9uXCIgZGlyZWN0bHkgaW5zdGVhZCBvZiBpbiBvcHRpb25zLiAoQ29ubmVjdGlvbnMgbXVzdCBoYXZlIGEgXCJtZXRob2RzXCJcbiAgICAvLyBtZXRob2QuKVxuICAgIC8vIFhYWCByZW1vdmUgYmVmb3JlIDEuMFxuICAgIG9wdGlvbnMgPSB7Y29ubmVjdGlvbjogb3B0aW9uc307XG4gIH1cbiAgLy8gQmFja3dhcmRzIGNvbXBhdGliaWxpdHk6IFwiY29ubmVjdGlvblwiIHVzZWQgdG8gYmUgY2FsbGVkIFwibWFuYWdlclwiLlxuICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLm1hbmFnZXIgJiYgIW9wdGlvbnMuY29ubmVjdGlvbikge1xuICAgIG9wdGlvbnMuY29ubmVjdGlvbiA9IG9wdGlvbnMubWFuYWdlcjtcbiAgfVxuXG4gIG9wdGlvbnMgPSB7XG4gICAgY29ubmVjdGlvbjogdW5kZWZpbmVkLFxuICAgIGlkR2VuZXJhdGlvbjogJ1NUUklORycsXG4gICAgdHJhbnNmb3JtOiBudWxsLFxuICAgIF9kcml2ZXI6IHVuZGVmaW5lZCxcbiAgICBfcHJldmVudEF1dG9wdWJsaXNoOiBmYWxzZSxcbiAgICAgIC4uLm9wdGlvbnMsXG4gIH07XG5cbiAgc3dpdGNoIChvcHRpb25zLmlkR2VuZXJhdGlvbikge1xuICBjYXNlICdNT05HTyc6XG4gICAgdGhpcy5fbWFrZU5ld0lEID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHNyYyA9IG5hbWUgPyBERFAucmFuZG9tU3RyZWFtKCcvY29sbGVjdGlvbi8nICsgbmFtZSkgOiBSYW5kb20uaW5zZWN1cmU7XG4gICAgICByZXR1cm4gbmV3IE1vbmdvLk9iamVjdElEKHNyYy5oZXhTdHJpbmcoMjQpKTtcbiAgICB9O1xuICAgIGJyZWFrO1xuICBjYXNlICdTVFJJTkcnOlxuICBkZWZhdWx0OlxuICAgIHRoaXMuX21ha2VOZXdJRCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBzcmMgPSBuYW1lID8gRERQLnJhbmRvbVN0cmVhbSgnL2NvbGxlY3Rpb24vJyArIG5hbWUpIDogUmFuZG9tLmluc2VjdXJlO1xuICAgICAgcmV0dXJuIHNyYy5pZCgpO1xuICAgIH07XG4gICAgYnJlYWs7XG4gIH1cblxuICB0aGlzLl90cmFuc2Zvcm0gPSBMb2NhbENvbGxlY3Rpb24ud3JhcFRyYW5zZm9ybShvcHRpb25zLnRyYW5zZm9ybSk7XG5cbiAgaWYgKCEgbmFtZSB8fCBvcHRpb25zLmNvbm5lY3Rpb24gPT09IG51bGwpXG4gICAgLy8gbm90ZTogbmFtZWxlc3MgY29sbGVjdGlvbnMgbmV2ZXIgaGF2ZSBhIGNvbm5lY3Rpb25cbiAgICB0aGlzLl9jb25uZWN0aW9uID0gbnVsbDtcbiAgZWxzZSBpZiAob3B0aW9ucy5jb25uZWN0aW9uKVxuICAgIHRoaXMuX2Nvbm5lY3Rpb24gPSBvcHRpb25zLmNvbm5lY3Rpb247XG4gIGVsc2UgaWYgKE1ldGVvci5pc0NsaWVudClcbiAgICB0aGlzLl9jb25uZWN0aW9uID0gTWV0ZW9yLmNvbm5lY3Rpb247XG4gIGVsc2VcbiAgICB0aGlzLl9jb25uZWN0aW9uID0gTWV0ZW9yLnNlcnZlcjtcblxuICBpZiAoIW9wdGlvbnMuX2RyaXZlcikge1xuICAgIC8vIFhYWCBUaGlzIGNoZWNrIGFzc3VtZXMgdGhhdCB3ZWJhcHAgaXMgbG9hZGVkIHNvIHRoYXQgTWV0ZW9yLnNlcnZlciAhPT1cbiAgICAvLyBudWxsLiBXZSBzaG91bGQgZnVsbHkgc3VwcG9ydCB0aGUgY2FzZSBvZiBcIndhbnQgdG8gdXNlIGEgTW9uZ28tYmFja2VkXG4gICAgLy8gY29sbGVjdGlvbiBmcm9tIE5vZGUgY29kZSB3aXRob3V0IHdlYmFwcFwiLCBidXQgd2UgZG9uJ3QgeWV0LlxuICAgIC8vICNNZXRlb3JTZXJ2ZXJOdWxsXG4gICAgaWYgKG5hbWUgJiYgdGhpcy5fY29ubmVjdGlvbiA9PT0gTWV0ZW9yLnNlcnZlciAmJlxuICAgICAgICB0eXBlb2YgTW9uZ29JbnRlcm5hbHMgIT09IFwidW5kZWZpbmVkXCIgJiZcbiAgICAgICAgTW9uZ29JbnRlcm5hbHMuZGVmYXVsdFJlbW90ZUNvbGxlY3Rpb25Ecml2ZXIpIHtcbiAgICAgIG9wdGlvbnMuX2RyaXZlciA9IE1vbmdvSW50ZXJuYWxzLmRlZmF1bHRSZW1vdGVDb2xsZWN0aW9uRHJpdmVyKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHsgTG9jYWxDb2xsZWN0aW9uRHJpdmVyIH0gPVxuICAgICAgICByZXF1aXJlKFwiLi9sb2NhbF9jb2xsZWN0aW9uX2RyaXZlci5qc1wiKTtcbiAgICAgIG9wdGlvbnMuX2RyaXZlciA9IExvY2FsQ29sbGVjdGlvbkRyaXZlcjtcbiAgICB9XG4gIH1cblxuICB0aGlzLl9jb2xsZWN0aW9uID0gb3B0aW9ucy5fZHJpdmVyLm9wZW4obmFtZSwgdGhpcy5fY29ubmVjdGlvbik7XG4gIHRoaXMuX25hbWUgPSBuYW1lO1xuICB0aGlzLl9kcml2ZXIgPSBvcHRpb25zLl9kcml2ZXI7XG5cbiAgdGhpcy5fbWF5YmVTZXRVcFJlcGxpY2F0aW9uKG5hbWUsIG9wdGlvbnMpO1xuXG4gIC8vIFhYWCBkb24ndCBkZWZpbmUgdGhlc2UgdW50aWwgYWxsb3cgb3IgZGVueSBpcyBhY3R1YWxseSB1c2VkIGZvciB0aGlzXG4gIC8vIGNvbGxlY3Rpb24uIENvdWxkIGJlIGhhcmQgaWYgdGhlIHNlY3VyaXR5IHJ1bGVzIGFyZSBvbmx5IGRlZmluZWQgb24gdGhlXG4gIC8vIHNlcnZlci5cbiAgaWYgKG9wdGlvbnMuZGVmaW5lTXV0YXRpb25NZXRob2RzICE9PSBmYWxzZSkge1xuICAgIHRyeSB7XG4gICAgICB0aGlzLl9kZWZpbmVNdXRhdGlvbk1ldGhvZHMoe1xuICAgICAgICB1c2VFeGlzdGluZzogb3B0aW9ucy5fc3VwcHJlc3NTYW1lTmFtZUVycm9yID09PSB0cnVlXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgLy8gVGhyb3cgYSBtb3JlIHVuZGVyc3RhbmRhYmxlIGVycm9yIG9uIHRoZSBzZXJ2ZXIgZm9yIHNhbWUgY29sbGVjdGlvbiBuYW1lXG4gICAgICBpZiAoZXJyb3IubWVzc2FnZSA9PT0gYEEgbWV0aG9kIG5hbWVkICcvJHtuYW1lfS9pbnNlcnQnIGlzIGFscmVhZHkgZGVmaW5lZGApXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVGhlcmUgaXMgYWxyZWFkeSBhIGNvbGxlY3Rpb24gbmFtZWQgXCIke25hbWV9XCJgKTtcbiAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbiAgfVxuXG4gIC8vIGF1dG9wdWJsaXNoXG4gIGlmIChQYWNrYWdlLmF1dG9wdWJsaXNoICYmXG4gICAgICAhIG9wdGlvbnMuX3ByZXZlbnRBdXRvcHVibGlzaCAmJlxuICAgICAgdGhpcy5fY29ubmVjdGlvbiAmJlxuICAgICAgdGhpcy5fY29ubmVjdGlvbi5wdWJsaXNoKSB7XG4gICAgdGhpcy5fY29ubmVjdGlvbi5wdWJsaXNoKG51bGwsICgpID0+IHRoaXMuZmluZCgpLCB7XG4gICAgICBpc19hdXRvOiB0cnVlLFxuICAgIH0pO1xuICB9XG59O1xuXG5PYmplY3QuYXNzaWduKE1vbmdvLkNvbGxlY3Rpb24ucHJvdG90eXBlLCB7XG4gIF9tYXliZVNldFVwUmVwbGljYXRpb24obmFtZSwge1xuICAgIF9zdXBwcmVzc1NhbWVOYW1lRXJyb3IgPSBmYWxzZVxuICB9KSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgaWYgKCEgKHNlbGYuX2Nvbm5lY3Rpb24gJiZcbiAgICAgICAgICAgc2VsZi5fY29ubmVjdGlvbi5yZWdpc3RlclN0b3JlKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIE9LLCB3ZSdyZSBnb2luZyB0byBiZSBhIHNsYXZlLCByZXBsaWNhdGluZyBzb21lIHJlbW90ZVxuICAgIC8vIGRhdGFiYXNlLCBleGNlcHQgcG9zc2libHkgd2l0aCBzb21lIHRlbXBvcmFyeSBkaXZlcmdlbmNlIHdoaWxlXG4gICAgLy8gd2UgaGF2ZSB1bmFja25vd2xlZGdlZCBSUEMncy5cbiAgICBjb25zdCBvayA9IHNlbGYuX2Nvbm5lY3Rpb24ucmVnaXN0ZXJTdG9yZShuYW1lLCB7XG4gICAgICAvLyBDYWxsZWQgYXQgdGhlIGJlZ2lubmluZyBvZiBhIGJhdGNoIG9mIHVwZGF0ZXMuIGJhdGNoU2l6ZSBpcyB0aGUgbnVtYmVyXG4gICAgICAvLyBvZiB1cGRhdGUgY2FsbHMgdG8gZXhwZWN0LlxuICAgICAgLy9cbiAgICAgIC8vIFhYWCBUaGlzIGludGVyZmFjZSBpcyBwcmV0dHkgamFua3kuIHJlc2V0IHByb2JhYmx5IG91Z2h0IHRvIGdvIGJhY2sgdG9cbiAgICAgIC8vIGJlaW5nIGl0cyBvd24gZnVuY3Rpb24sIGFuZCBjYWxsZXJzIHNob3VsZG4ndCBoYXZlIHRvIGNhbGN1bGF0ZVxuICAgICAgLy8gYmF0Y2hTaXplLiBUaGUgb3B0aW1pemF0aW9uIG9mIG5vdCBjYWxsaW5nIHBhdXNlL3JlbW92ZSBzaG91bGQgYmVcbiAgICAgIC8vIGRlbGF5ZWQgdW50aWwgbGF0ZXI6IHRoZSBmaXJzdCBjYWxsIHRvIHVwZGF0ZSgpIHNob3VsZCBidWZmZXIgaXRzXG4gICAgICAvLyBtZXNzYWdlLCBhbmQgdGhlbiB3ZSBjYW4gZWl0aGVyIGRpcmVjdGx5IGFwcGx5IGl0IGF0IGVuZFVwZGF0ZSB0aW1lIGlmXG4gICAgICAvLyBpdCB3YXMgdGhlIG9ubHkgdXBkYXRlLCBvciBkbyBwYXVzZU9ic2VydmVycy9hcHBseS9hcHBseSBhdCB0aGUgbmV4dFxuICAgICAgLy8gdXBkYXRlKCkgaWYgdGhlcmUncyBhbm90aGVyIG9uZS5cbiAgICAgIGJlZ2luVXBkYXRlKGJhdGNoU2l6ZSwgcmVzZXQpIHtcbiAgICAgICAgLy8gcGF1c2Ugb2JzZXJ2ZXJzIHNvIHVzZXJzIGRvbid0IHNlZSBmbGlja2VyIHdoZW4gdXBkYXRpbmcgc2V2ZXJhbFxuICAgICAgICAvLyBvYmplY3RzIGF0IG9uY2UgKGluY2x1ZGluZyB0aGUgcG9zdC1yZWNvbm5lY3QgcmVzZXQtYW5kLXJlYXBwbHlcbiAgICAgICAgLy8gc3RhZ2UpLCBhbmQgc28gdGhhdCBhIHJlLXNvcnRpbmcgb2YgYSBxdWVyeSBjYW4gdGFrZSBhZHZhbnRhZ2Ugb2YgdGhlXG4gICAgICAgIC8vIGZ1bGwgX2RpZmZRdWVyeSBtb3ZlZCBjYWxjdWxhdGlvbiBpbnN0ZWFkIG9mIGFwcGx5aW5nIGNoYW5nZSBvbmUgYXQgYVxuICAgICAgICAvLyB0aW1lLlxuICAgICAgICBpZiAoYmF0Y2hTaXplID4gMSB8fCByZXNldClcbiAgICAgICAgICBzZWxmLl9jb2xsZWN0aW9uLnBhdXNlT2JzZXJ2ZXJzKCk7XG5cbiAgICAgICAgaWYgKHJlc2V0KVxuICAgICAgICAgIHNlbGYuX2NvbGxlY3Rpb24ucmVtb3ZlKHt9KTtcbiAgICAgIH0sXG5cbiAgICAgIC8vIEFwcGx5IGFuIHVwZGF0ZS5cbiAgICAgIC8vIFhYWCBiZXR0ZXIgc3BlY2lmeSB0aGlzIGludGVyZmFjZSAobm90IGluIHRlcm1zIG9mIGEgd2lyZSBtZXNzYWdlKT9cbiAgICAgIHVwZGF0ZShtc2cpIHtcbiAgICAgICAgaWYoTWV0ZW9yLmlzQ2xpZW50KXtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYoIW1zZyl7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm1vbmdvIHVwZGF0ZSBtZXNzYWdlIGlzIHVuZGVmaW5lZC4gY29sbGVjdGlvbiBuYW1lIGlzIFwiICsgc2VsZi5fbmFtZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvciwgbXNnKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgbW9uZ29JZCA9IE1vbmdvSUQuaWRQYXJzZShtc2cuaWQpO1xuICAgICAgICB2YXIgZG9jID0gc2VsZi5fY29sbGVjdGlvbi5maW5kT25lKG1vbmdvSWQpO1xuXG4gICAgICAgIC8vIElzIHRoaXMgYSBcInJlcGxhY2UgdGhlIHdob2xlIGRvY1wiIG1lc3NhZ2UgY29taW5nIGZyb20gdGhlIHF1aWVzY2VuY2VcbiAgICAgICAgLy8gb2YgbWV0aG9kIHdyaXRlcyB0byBhbiBvYmplY3Q/IChOb3RlIHRoYXQgJ3VuZGVmaW5lZCcgaXMgYSB2YWxpZFxuICAgICAgICAvLyB2YWx1ZSBtZWFuaW5nIFwicmVtb3ZlIGl0XCIuKVxuICAgICAgICBpZiAobXNnLm1zZyA9PT0gJ3JlcGxhY2UnKSB7XG4gICAgICAgICAgdmFyIHJlcGxhY2UgPSBtc2cucmVwbGFjZTtcbiAgICAgICAgICBpZiAoIXJlcGxhY2UpIHtcbiAgICAgICAgICAgIGlmIChkb2MpXG4gICAgICAgICAgICAgIHNlbGYuX2NvbGxlY3Rpb24ucmVtb3ZlKG1vbmdvSWQpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoIWRvYykge1xuICAgICAgICAgICAgc2VsZi5fY29sbGVjdGlvbi5pbnNlcnQocmVwbGFjZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIFhYWCBjaGVjayB0aGF0IHJlcGxhY2UgaGFzIG5vICQgb3BzXG4gICAgICAgICAgICBzZWxmLl9jb2xsZWN0aW9uLnVwZGF0ZShtb25nb0lkLCByZXBsYWNlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IGVsc2UgaWYgKG1zZy5tc2cgPT09ICdhZGRlZCcpIHtcbiAgICAgICAgICBpZiAoZG9jKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFeHBlY3RlZCBub3QgdG8gZmluZCBhIGRvY3VtZW50IGFscmVhZHkgcHJlc2VudCBmb3IgYW4gYWRkXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzZWxmLl9jb2xsZWN0aW9uLmluc2VydCh7IF9pZDogbW9uZ29JZCwgLi4ubXNnLmZpZWxkcyB9KTtcbiAgICAgICAgfSBlbHNlIGlmIChtc2cubXNnID09PSAncmVtb3ZlZCcpIHtcbiAgICAgICAgICBpZiAoIWRvYylcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkV4cGVjdGVkIHRvIGZpbmQgYSBkb2N1bWVudCBhbHJlYWR5IHByZXNlbnQgZm9yIHJlbW92ZWRcIik7XG4gICAgICAgICAgc2VsZi5fY29sbGVjdGlvbi5yZW1vdmUobW9uZ29JZCk7XG4gICAgICAgIH0gZWxzZSBpZiAobXNnLm1zZyA9PT0gJ2NoYW5nZWQnKSB7XG4gICAgICAgICAgaWYgKCFkb2MpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFeHBlY3RlZCB0byBmaW5kIGEgZG9jdW1lbnQgdG8gY2hhbmdlXCIpO1xuICAgICAgICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhtc2cuZmllbGRzKTtcbiAgICAgICAgICBpZiAoa2V5cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB2YXIgbW9kaWZpZXIgPSB7fTtcbiAgICAgICAgICAgIGtleXMuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IG1zZy5maWVsZHNba2V5XTtcbiAgICAgICAgICAgICAgaWYgKEVKU09OLmVxdWFscyhkb2Nba2V5XSwgdmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAoIW1vZGlmaWVyLiR1bnNldCkge1xuICAgICAgICAgICAgICAgICAgbW9kaWZpZXIuJHVuc2V0ID0ge307XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG1vZGlmaWVyLiR1bnNldFtrZXldID0gMTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoIW1vZGlmaWVyLiRzZXQpIHtcbiAgICAgICAgICAgICAgICAgIG1vZGlmaWVyLiRzZXQgPSB7fTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbW9kaWZpZXIuJHNldFtrZXldID0gdmFsdWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKE9iamVjdC5rZXlzKG1vZGlmaWVyKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgIHNlbGYuX2NvbGxlY3Rpb24udXBkYXRlKG1vbmdvSWQsIG1vZGlmaWVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSSBkb24ndCBrbm93IGhvdyB0byBkZWFsIHdpdGggdGhpcyBtZXNzYWdlXCIpO1xuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICAvLyBDYWxsZWQgYXQgdGhlIGVuZCBvZiBhIGJhdGNoIG9mIHVwZGF0ZXMuXG4gICAgICBlbmRVcGRhdGUoKSB7XG4gICAgICAgIHNlbGYuX2NvbGxlY3Rpb24ucmVzdW1lT2JzZXJ2ZXJzKCk7XG4gICAgICB9LFxuXG4gICAgICAvLyBDYWxsZWQgYXJvdW5kIG1ldGhvZCBzdHViIGludm9jYXRpb25zIHRvIGNhcHR1cmUgdGhlIG9yaWdpbmFsIHZlcnNpb25zXG4gICAgICAvLyBvZiBtb2RpZmllZCBkb2N1bWVudHMuXG4gICAgICBzYXZlT3JpZ2luYWxzKCkge1xuICAgICAgICBzZWxmLl9jb2xsZWN0aW9uLnNhdmVPcmlnaW5hbHMoKTtcbiAgICAgIH0sXG4gICAgICByZXRyaWV2ZU9yaWdpbmFscygpIHtcbiAgICAgICAgcmV0dXJuIHNlbGYuX2NvbGxlY3Rpb24ucmV0cmlldmVPcmlnaW5hbHMoKTtcbiAgICAgIH0sXG5cbiAgICAgIC8vIFVzZWQgdG8gcHJlc2VydmUgY3VycmVudCB2ZXJzaW9ucyBvZiBkb2N1bWVudHMgYWNyb3NzIGEgc3RvcmUgcmVzZXQuXG4gICAgICBnZXREb2MoaWQpIHtcbiAgICAgICAgcmV0dXJuIHNlbGYuZmluZE9uZShpZCk7XG4gICAgICB9LFxuXG4gICAgICAvLyBUbyBiZSBhYmxlIHRvIGdldCBiYWNrIHRvIHRoZSBjb2xsZWN0aW9uIGZyb20gdGhlIHN0b3JlLlxuICAgICAgX2dldENvbGxlY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBzZWxmO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKCEgb2spIHtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSBgVGhlcmUgaXMgYWxyZWFkeSBhIGNvbGxlY3Rpb24gbmFtZWQgXCIke25hbWV9XCJgO1xuICAgICAgaWYgKF9zdXBwcmVzc1NhbWVOYW1lRXJyb3IgPT09IHRydWUpIHtcbiAgICAgICAgLy8gWFhYIEluIHRoZW9yeSB3ZSBkbyBub3QgaGF2ZSB0byB0aHJvdyB3aGVuIGBva2AgaXMgZmFsc3kuIFRoZVxuICAgICAgICAvLyBzdG9yZSBpcyBhbHJlYWR5IGRlZmluZWQgZm9yIHRoaXMgY29sbGVjdGlvbiBuYW1lLCBidXQgdGhpc1xuICAgICAgICAvLyB3aWxsIHNpbXBseSBiZSBhbm90aGVyIHJlZmVyZW5jZSB0byBpdCBhbmQgZXZlcnl0aGluZyBzaG91bGRcbiAgICAgICAgLy8gd29yay4gSG93ZXZlciwgd2UgaGF2ZSBoaXN0b3JpY2FsbHkgdGhyb3duIGFuIGVycm9yIGhlcmUsIHNvXG4gICAgICAgIC8vIGZvciBub3cgd2Ugd2lsbCBza2lwIHRoZSBlcnJvciBvbmx5IHdoZW4gX3N1cHByZXNzU2FtZU5hbWVFcnJvclxuICAgICAgICAvLyBpcyBgdHJ1ZWAsIGFsbG93aW5nIHBlb3BsZSB0byBvcHQgaW4gYW5kIGdpdmUgdGhpcyBzb21lIHJlYWxcbiAgICAgICAgLy8gd29ybGQgdGVzdGluZy5cbiAgICAgICAgY29uc29sZS53YXJuID8gY29uc29sZS53YXJuKG1lc3NhZ2UpIDogY29uc29sZS5sb2cobWVzc2FnZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIC8vL1xuICAvLy8gTWFpbiBjb2xsZWN0aW9uIEFQSVxuICAvLy9cblxuICBfZ2V0RmluZFNlbGVjdG9yKGFyZ3MpIHtcbiAgICBpZiAoYXJncy5sZW5ndGggPT0gMClcbiAgICAgIHJldHVybiB7fTtcbiAgICBlbHNlXG4gICAgICByZXR1cm4gYXJnc1swXTtcbiAgfSxcblxuICBfZ2V0RmluZE9wdGlvbnMoYXJncykge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBpZiAoYXJncy5sZW5ndGggPCAyKSB7XG4gICAgICByZXR1cm4geyB0cmFuc2Zvcm06IHNlbGYuX3RyYW5zZm9ybSB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBjaGVjayhhcmdzWzFdLCBNYXRjaC5PcHRpb25hbChNYXRjaC5PYmplY3RJbmNsdWRpbmcoe1xuICAgICAgICBmaWVsZHM6IE1hdGNoLk9wdGlvbmFsKE1hdGNoLk9uZU9mKE9iamVjdCwgdW5kZWZpbmVkKSksXG4gICAgICAgIHNvcnQ6IE1hdGNoLk9wdGlvbmFsKE1hdGNoLk9uZU9mKE9iamVjdCwgQXJyYXksIEZ1bmN0aW9uLCB1bmRlZmluZWQpKSxcbiAgICAgICAgbGltaXQ6IE1hdGNoLk9wdGlvbmFsKE1hdGNoLk9uZU9mKE51bWJlciwgdW5kZWZpbmVkKSksXG4gICAgICAgIHNraXA6IE1hdGNoLk9wdGlvbmFsKE1hdGNoLk9uZU9mKE51bWJlciwgdW5kZWZpbmVkKSlcbiAgICAgIH0pKSk7XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHRyYW5zZm9ybTogc2VsZi5fdHJhbnNmb3JtLFxuICAgICAgICAuLi5hcmdzWzFdLFxuICAgICAgfTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIEBzdW1tYXJ5IEZpbmQgdGhlIGRvY3VtZW50cyBpbiBhIGNvbGxlY3Rpb24gdGhhdCBtYXRjaCB0aGUgc2VsZWN0b3IuXG4gICAqIEBsb2N1cyBBbnl3aGVyZVxuICAgKiBAbWV0aG9kIGZpbmRcbiAgICogQG1lbWJlcm9mIE1vbmdvLkNvbGxlY3Rpb25cbiAgICogQGluc3RhbmNlXG4gICAqIEBwYXJhbSB7TW9uZ29TZWxlY3Rvcn0gW3NlbGVjdG9yXSBBIHF1ZXJ5IGRlc2NyaWJpbmcgdGhlIGRvY3VtZW50cyB0byBmaW5kXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc11cbiAgICogQHBhcmFtIHtNb25nb1NvcnRTcGVjaWZpZXJ9IG9wdGlvbnMuc29ydCBTb3J0IG9yZGVyIChkZWZhdWx0OiBuYXR1cmFsIG9yZGVyKVxuICAgKiBAcGFyYW0ge051bWJlcn0gb3B0aW9ucy5za2lwIE51bWJlciBvZiByZXN1bHRzIHRvIHNraXAgYXQgdGhlIGJlZ2lubmluZ1xuICAgKiBAcGFyYW0ge051bWJlcn0gb3B0aW9ucy5saW1pdCBNYXhpbXVtIG51bWJlciBvZiByZXN1bHRzIHRvIHJldHVyblxuICAgKiBAcGFyYW0ge01vbmdvRmllbGRTcGVjaWZpZXJ9IG9wdGlvbnMuZmllbGRzIERpY3Rpb25hcnkgb2YgZmllbGRzIHRvIHJldHVybiBvciBleGNsdWRlLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IG9wdGlvbnMucmVhY3RpdmUgKENsaWVudCBvbmx5KSBEZWZhdWx0IGB0cnVlYDsgcGFzcyBgZmFsc2VgIHRvIGRpc2FibGUgcmVhY3Rpdml0eVxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBvcHRpb25zLnRyYW5zZm9ybSBPdmVycmlkZXMgYHRyYW5zZm9ybWAgb24gdGhlICBbYENvbGxlY3Rpb25gXSgjY29sbGVjdGlvbnMpIGZvciB0aGlzIGN1cnNvci4gIFBhc3MgYG51bGxgIHRvIGRpc2FibGUgdHJhbnNmb3JtYXRpb24uXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gb3B0aW9ucy5kaXNhYmxlT3Bsb2cgKFNlcnZlciBvbmx5KSBQYXNzIHRydWUgdG8gZGlzYWJsZSBvcGxvZy10YWlsaW5nIG9uIHRoaXMgcXVlcnkuIFRoaXMgYWZmZWN0cyB0aGUgd2F5IHNlcnZlciBwcm9jZXNzZXMgY2FsbHMgdG8gYG9ic2VydmVgIG9uIHRoaXMgcXVlcnkuIERpc2FibGluZyB0aGUgb3Bsb2cgY2FuIGJlIHVzZWZ1bCB3aGVuIHdvcmtpbmcgd2l0aCBkYXRhIHRoYXQgdXBkYXRlcyBpbiBsYXJnZSBiYXRjaGVzLlxuICAgKiBAcGFyYW0ge051bWJlcn0gb3B0aW9ucy5wb2xsaW5nSW50ZXJ2YWxNcyAoU2VydmVyIG9ubHkpIFdoZW4gb3Bsb2cgaXMgZGlzYWJsZWQgKHRocm91Z2ggdGhlIHVzZSBvZiBgZGlzYWJsZU9wbG9nYCBvciB3aGVuIG90aGVyd2lzZSBub3QgYXZhaWxhYmxlKSwgdGhlIGZyZXF1ZW5jeSAoaW4gbWlsbGlzZWNvbmRzKSBvZiBob3cgb2Z0ZW4gdG8gcG9sbCB0aGlzIHF1ZXJ5IHdoZW4gb2JzZXJ2aW5nIG9uIHRoZSBzZXJ2ZXIuIERlZmF1bHRzIHRvIDEwMDAwbXMgKDEwIHNlY29uZHMpLlxuICAgKiBAcGFyYW0ge051bWJlcn0gb3B0aW9ucy5wb2xsaW5nVGhyb3R0bGVNcyAoU2VydmVyIG9ubHkpIFdoZW4gb3Bsb2cgaXMgZGlzYWJsZWQgKHRocm91Z2ggdGhlIHVzZSBvZiBgZGlzYWJsZU9wbG9nYCBvciB3aGVuIG90aGVyd2lzZSBub3QgYXZhaWxhYmxlKSwgdGhlIG1pbmltdW0gdGltZSAoaW4gbWlsbGlzZWNvbmRzKSB0byBhbGxvdyBiZXR3ZWVuIHJlLXBvbGxpbmcgd2hlbiBvYnNlcnZpbmcgb24gdGhlIHNlcnZlci4gSW5jcmVhc2luZyB0aGlzIHdpbGwgc2F2ZSBDUFUgYW5kIG1vbmdvIGxvYWQgYXQgdGhlIGV4cGVuc2Ugb2Ygc2xvd2VyIHVwZGF0ZXMgdG8gdXNlcnMuIERlY3JlYXNpbmcgdGhpcyBpcyBub3QgcmVjb21tZW5kZWQuIERlZmF1bHRzIHRvIDUwbXMuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBvcHRpb25zLm1heFRpbWVNcyAoU2VydmVyIG9ubHkpIElmIHNldCwgaW5zdHJ1Y3RzIE1vbmdvREIgdG8gc2V0IGEgdGltZSBsaW1pdCBmb3IgdGhpcyBjdXJzb3IncyBvcGVyYXRpb25zLiBJZiB0aGUgb3BlcmF0aW9uIHJlYWNoZXMgdGhlIHNwZWNpZmllZCB0aW1lIGxpbWl0IChpbiBtaWxsaXNlY29uZHMpIHdpdGhvdXQgdGhlIGhhdmluZyBiZWVuIGNvbXBsZXRlZCwgYW4gZXhjZXB0aW9uIHdpbGwgYmUgdGhyb3duLiBVc2VmdWwgdG8gcHJldmVudCBhbiAoYWNjaWRlbnRhbCBvciBtYWxpY2lvdXMpIHVub3B0aW1pemVkIHF1ZXJ5IGZyb20gY2F1c2luZyBhIGZ1bGwgY29sbGVjdGlvbiBzY2FuIHRoYXQgd291bGQgZGlzcnVwdCBvdGhlciBkYXRhYmFzZSB1c2VycywgYXQgdGhlIGV4cGVuc2Ugb2YgbmVlZGluZyB0byBoYW5kbGUgdGhlIHJlc3VsdGluZyBlcnJvci5cbiAgICogQHBhcmFtIHtTdHJpbmd8T2JqZWN0fSBvcHRpb25zLmhpbnQgKFNlcnZlciBvbmx5KSBPdmVycmlkZXMgTW9uZ29EQidzIGRlZmF1bHQgaW5kZXggc2VsZWN0aW9uIGFuZCBxdWVyeSBvcHRpbWl6YXRpb24gcHJvY2Vzcy4gU3BlY2lmeSBhbiBpbmRleCB0byBmb3JjZSBpdHMgdXNlLCBlaXRoZXIgYnkgaXRzIG5hbWUgb3IgaW5kZXggc3BlY2lmaWNhdGlvbi4gWW91IGNhbiBhbHNvIHNwZWNpZnkgYHsgJG5hdHVyYWwgOiAxIH1gIHRvIGZvcmNlIGEgZm9yd2FyZHMgY29sbGVjdGlvbiBzY2FuLCBvciBgeyAkbmF0dXJhbCA6IC0xIH1gIGZvciBhIHJldmVyc2UgY29sbGVjdGlvbiBzY2FuLiBTZXR0aW5nIHRoaXMgaXMgb25seSByZWNvbW1lbmRlZCBmb3IgYWR2YW5jZWQgdXNlcnMuXG4gICAqIEByZXR1cm5zIHtNb25nby5DdXJzb3J9XG4gICAqL1xuICBmaW5kKC4uLmFyZ3MpIHtcbiAgICAvLyBDb2xsZWN0aW9uLmZpbmQoKSAocmV0dXJuIGFsbCBkb2NzKSBiZWhhdmVzIGRpZmZlcmVudGx5XG4gICAgLy8gZnJvbSBDb2xsZWN0aW9uLmZpbmQodW5kZWZpbmVkKSAocmV0dXJuIDAgZG9jcykuICBzbyBiZVxuICAgIC8vIGNhcmVmdWwgYWJvdXQgdGhlIGxlbmd0aCBvZiBhcmd1bWVudHMuXG4gICAgcmV0dXJuIHRoaXMuX2NvbGxlY3Rpb24uZmluZChcbiAgICAgIHRoaXMuX2dldEZpbmRTZWxlY3RvcihhcmdzKSxcbiAgICAgIHRoaXMuX2dldEZpbmRPcHRpb25zKGFyZ3MpXG4gICAgKTtcbiAgfSxcblxuICAvKipcbiAgICogQHN1bW1hcnkgRmluZHMgdGhlIGZpcnN0IGRvY3VtZW50IHRoYXQgbWF0Y2hlcyB0aGUgc2VsZWN0b3IsIGFzIG9yZGVyZWQgYnkgc29ydCBhbmQgc2tpcCBvcHRpb25zLiBSZXR1cm5zIGB1bmRlZmluZWRgIGlmIG5vIG1hdGNoaW5nIGRvY3VtZW50IGlzIGZvdW5kLlxuICAgKiBAbG9jdXMgQW55d2hlcmVcbiAgICogQG1ldGhvZCBmaW5kT25lXG4gICAqIEBtZW1iZXJvZiBNb25nby5Db2xsZWN0aW9uXG4gICAqIEBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge01vbmdvU2VsZWN0b3J9IFtzZWxlY3Rvcl0gQSBxdWVyeSBkZXNjcmliaW5nIHRoZSBkb2N1bWVudHMgdG8gZmluZFxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdXG4gICAqIEBwYXJhbSB7TW9uZ29Tb3J0U3BlY2lmaWVyfSBvcHRpb25zLnNvcnQgU29ydCBvcmRlciAoZGVmYXVsdDogbmF0dXJhbCBvcmRlcilcbiAgICogQHBhcmFtIHtOdW1iZXJ9IG9wdGlvbnMuc2tpcCBOdW1iZXIgb2YgcmVzdWx0cyB0byBza2lwIGF0IHRoZSBiZWdpbm5pbmdcbiAgICogQHBhcmFtIHtNb25nb0ZpZWxkU3BlY2lmaWVyfSBvcHRpb25zLmZpZWxkcyBEaWN0aW9uYXJ5IG9mIGZpZWxkcyB0byByZXR1cm4gb3IgZXhjbHVkZS5cbiAgICogQHBhcmFtIHtCb29sZWFufSBvcHRpb25zLnJlYWN0aXZlIChDbGllbnQgb25seSkgRGVmYXVsdCB0cnVlOyBwYXNzIGZhbHNlIHRvIGRpc2FibGUgcmVhY3Rpdml0eVxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBvcHRpb25zLnRyYW5zZm9ybSBPdmVycmlkZXMgYHRyYW5zZm9ybWAgb24gdGhlIFtgQ29sbGVjdGlvbmBdKCNjb2xsZWN0aW9ucykgZm9yIHRoaXMgY3Vyc29yLiAgUGFzcyBgbnVsbGAgdG8gZGlzYWJsZSB0cmFuc2Zvcm1hdGlvbi5cbiAgICogQHJldHVybnMge09iamVjdH1cbiAgICovXG4gIGZpbmRPbmUoLi4uYXJncykge1xuICAgIHJldHVybiB0aGlzLl9jb2xsZWN0aW9uLmZpbmRPbmUoXG4gICAgICB0aGlzLl9nZXRGaW5kU2VsZWN0b3IoYXJncyksXG4gICAgICB0aGlzLl9nZXRGaW5kT3B0aW9ucyhhcmdzKVxuICAgICk7XG4gIH1cbn0pO1xuXG5PYmplY3QuYXNzaWduKE1vbmdvLkNvbGxlY3Rpb24sIHtcbiAgX3B1Ymxpc2hDdXJzb3IoY3Vyc29yLCBzdWIsIGNvbGxlY3Rpb24pIHtcbiAgICB2YXIgb2JzZXJ2ZUhhbmRsZSA9IGN1cnNvci5vYnNlcnZlQ2hhbmdlcyh7XG4gICAgICBhZGRlZDogZnVuY3Rpb24gKGlkLCBmaWVsZHMpIHtcbiAgICAgICAgc3ViLmFkZGVkKGNvbGxlY3Rpb24sIGlkLCBmaWVsZHMpO1xuICAgICAgfSxcbiAgICAgIGNoYW5nZWQ6IGZ1bmN0aW9uIChpZCwgZmllbGRzKSB7XG4gICAgICAgIHN1Yi5jaGFuZ2VkKGNvbGxlY3Rpb24sIGlkLCBmaWVsZHMpO1xuICAgICAgfSxcbiAgICAgIHJlbW92ZWQ6IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICBzdWIucmVtb3ZlZChjb2xsZWN0aW9uLCBpZCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBXZSBkb24ndCBjYWxsIHN1Yi5yZWFkeSgpIGhlcmU6IGl0IGdldHMgY2FsbGVkIGluIGxpdmVkYXRhX3NlcnZlciwgYWZ0ZXJcbiAgICAvLyBwb3NzaWJseSBjYWxsaW5nIF9wdWJsaXNoQ3Vyc29yIG9uIG11bHRpcGxlIHJldHVybmVkIGN1cnNvcnMuXG5cbiAgICAvLyByZWdpc3RlciBzdG9wIGNhbGxiYWNrIChleHBlY3RzIGxhbWJkYSB3LyBubyBhcmdzKS5cbiAgICBzdWIub25TdG9wKGZ1bmN0aW9uICgpIHtcbiAgICAgIG9ic2VydmVIYW5kbGUuc3RvcCgpO1xuICAgIH0pO1xuXG4gICAgLy8gcmV0dXJuIHRoZSBvYnNlcnZlSGFuZGxlIGluIGNhc2UgaXQgbmVlZHMgdG8gYmUgc3RvcHBlZCBlYXJseVxuICAgIHJldHVybiBvYnNlcnZlSGFuZGxlO1xuICB9LFxuXG4gIC8vIHByb3RlY3QgYWdhaW5zdCBkYW5nZXJvdXMgc2VsZWN0b3JzLiAgZmFsc2V5IGFuZCB7X2lkOiBmYWxzZXl9IGFyZSBib3RoXG4gIC8vIGxpa2VseSBwcm9ncmFtbWVyIGVycm9yLCBhbmQgbm90IHdoYXQgeW91IHdhbnQsIHBhcnRpY3VsYXJseSBmb3IgZGVzdHJ1Y3RpdmVcbiAgLy8gb3BlcmF0aW9ucy4gSWYgYSBmYWxzZXkgX2lkIGlzIHNlbnQgaW4sIGEgbmV3IHN0cmluZyBfaWQgd2lsbCBiZVxuICAvLyBnZW5lcmF0ZWQgYW5kIHJldHVybmVkOyBpZiBhIGZhbGxiYWNrSWQgaXMgcHJvdmlkZWQsIGl0IHdpbGwgYmUgcmV0dXJuZWRcbiAgLy8gaW5zdGVhZC5cbiAgX3Jld3JpdGVTZWxlY3RvcihzZWxlY3RvciwgeyBmYWxsYmFja0lkIH0gPSB7fSkge1xuICAgIC8vIHNob3J0aGFuZCAtLSBzY2FsYXJzIG1hdGNoIF9pZFxuICAgIGlmIChMb2NhbENvbGxlY3Rpb24uX3NlbGVjdG9ySXNJZChzZWxlY3RvcikpXG4gICAgICBzZWxlY3RvciA9IHtfaWQ6IHNlbGVjdG9yfTtcblxuICAgIGlmIChBcnJheS5pc0FycmF5KHNlbGVjdG9yKSkge1xuICAgICAgLy8gVGhpcyBpcyBjb25zaXN0ZW50IHdpdGggdGhlIE1vbmdvIGNvbnNvbGUgaXRzZWxmOyBpZiB3ZSBkb24ndCBkbyB0aGlzXG4gICAgICAvLyBjaGVjayBwYXNzaW5nIGFuIGVtcHR5IGFycmF5IGVuZHMgdXAgc2VsZWN0aW5nIGFsbCBpdGVtc1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTW9uZ28gc2VsZWN0b3IgY2FuJ3QgYmUgYW4gYXJyYXkuXCIpO1xuICAgIH1cblxuICAgIGlmICghc2VsZWN0b3IgfHwgKCgnX2lkJyBpbiBzZWxlY3RvcikgJiYgIXNlbGVjdG9yLl9pZCkpIHtcbiAgICAgIC8vIGNhbid0IG1hdGNoIGFueXRoaW5nXG4gICAgICByZXR1cm4geyBfaWQ6IGZhbGxiYWNrSWQgfHwgUmFuZG9tLmlkKCkgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gc2VsZWN0b3I7XG4gIH1cbn0pO1xuXG5PYmplY3QuYXNzaWduKE1vbmdvLkNvbGxlY3Rpb24ucHJvdG90eXBlLCB7XG4gIC8vICdpbnNlcnQnIGltbWVkaWF0ZWx5IHJldHVybnMgdGhlIGluc2VydGVkIGRvY3VtZW50J3MgbmV3IF9pZC5cbiAgLy8gVGhlIG90aGVycyByZXR1cm4gdmFsdWVzIGltbWVkaWF0ZWx5IGlmIHlvdSBhcmUgaW4gYSBzdHViLCBhbiBpbi1tZW1vcnlcbiAgLy8gdW5tYW5hZ2VkIGNvbGxlY3Rpb24sIG9yIGEgbW9uZ28tYmFja2VkIGNvbGxlY3Rpb24gYW5kIHlvdSBkb24ndCBwYXNzIGFcbiAgLy8gY2FsbGJhY2suICd1cGRhdGUnIGFuZCAncmVtb3ZlJyByZXR1cm4gdGhlIG51bWJlciBvZiBhZmZlY3RlZFxuICAvLyBkb2N1bWVudHMuICd1cHNlcnQnIHJldHVybnMgYW4gb2JqZWN0IHdpdGgga2V5cyAnbnVtYmVyQWZmZWN0ZWQnIGFuZCwgaWYgYW5cbiAgLy8gaW5zZXJ0IGhhcHBlbmVkLCAnaW5zZXJ0ZWRJZCcuXG4gIC8vXG4gIC8vIE90aGVyd2lzZSwgdGhlIHNlbWFudGljcyBhcmUgZXhhY3RseSBsaWtlIG90aGVyIG1ldGhvZHM6IHRoZXkgdGFrZVxuICAvLyBhIGNhbGxiYWNrIGFzIGFuIG9wdGlvbmFsIGxhc3QgYXJndW1lbnQ7IGlmIG5vIGNhbGxiYWNrIGlzXG4gIC8vIHByb3ZpZGVkLCB0aGV5IGJsb2NrIHVudGlsIHRoZSBvcGVyYXRpb24gaXMgY29tcGxldGUsIGFuZCB0aHJvdyBhblxuICAvLyBleGNlcHRpb24gaWYgaXQgZmFpbHM7IGlmIGEgY2FsbGJhY2sgaXMgcHJvdmlkZWQsIHRoZW4gdGhleSBkb24ndFxuICAvLyBuZWNlc3NhcmlseSBibG9jaywgYW5kIHRoZXkgY2FsbCB0aGUgY2FsbGJhY2sgd2hlbiB0aGV5IGZpbmlzaCB3aXRoIGVycm9yIGFuZFxuICAvLyByZXN1bHQgYXJndW1lbnRzLiAgKFRoZSBpbnNlcnQgbWV0aG9kIHByb3ZpZGVzIHRoZSBkb2N1bWVudCBJRCBhcyBpdHMgcmVzdWx0O1xuICAvLyB1cGRhdGUgYW5kIHJlbW92ZSBwcm92aWRlIHRoZSBudW1iZXIgb2YgYWZmZWN0ZWQgZG9jcyBhcyB0aGUgcmVzdWx0OyB1cHNlcnRcbiAgLy8gcHJvdmlkZXMgYW4gb2JqZWN0IHdpdGggbnVtYmVyQWZmZWN0ZWQgYW5kIG1heWJlIGluc2VydGVkSWQuKVxuICAvL1xuICAvLyBPbiB0aGUgY2xpZW50LCBibG9ja2luZyBpcyBpbXBvc3NpYmxlLCBzbyBpZiBhIGNhbGxiYWNrXG4gIC8vIGlzbid0IHByb3ZpZGVkLCB0aGV5IGp1c3QgcmV0dXJuIGltbWVkaWF0ZWx5IGFuZCBhbnkgZXJyb3JcbiAgLy8gaW5mb3JtYXRpb24gaXMgbG9zdC5cbiAgLy9cbiAgLy8gVGhlcmUncyBvbmUgbW9yZSB0d2Vhay4gT24gdGhlIGNsaWVudCwgaWYgeW91IGRvbid0IHByb3ZpZGUgYVxuICAvLyBjYWxsYmFjaywgdGhlbiBpZiB0aGVyZSBpcyBhbiBlcnJvciwgYSBtZXNzYWdlIHdpbGwgYmUgbG9nZ2VkIHdpdGhcbiAgLy8gTWV0ZW9yLl9kZWJ1Zy5cbiAgLy9cbiAgLy8gVGhlIGludGVudCAodGhvdWdoIHRoaXMgaXMgYWN0dWFsbHkgZGV0ZXJtaW5lZCBieSB0aGUgdW5kZXJseWluZ1xuICAvLyBkcml2ZXJzKSBpcyB0aGF0IHRoZSBvcGVyYXRpb25zIHNob3VsZCBiZSBkb25lIHN5bmNocm9ub3VzbHksIG5vdFxuICAvLyBnZW5lcmF0aW5nIHRoZWlyIHJlc3VsdCB1bnRpbCB0aGUgZGF0YWJhc2UgaGFzIGFja25vd2xlZGdlZFxuICAvLyB0aGVtLiBJbiB0aGUgZnV0dXJlIG1heWJlIHdlIHNob3VsZCBwcm92aWRlIGEgZmxhZyB0byB0dXJuIHRoaXNcbiAgLy8gb2ZmLlxuXG4gIC8qKlxuICAgKiBAc3VtbWFyeSBJbnNlcnQgYSBkb2N1bWVudCBpbiB0aGUgY29sbGVjdGlvbi4gIFJldHVybnMgaXRzIHVuaXF1ZSBfaWQuXG4gICAqIEBsb2N1cyBBbnl3aGVyZVxuICAgKiBAbWV0aG9kICBpbnNlcnRcbiAgICogQG1lbWJlcm9mIE1vbmdvLkNvbGxlY3Rpb25cbiAgICogQGluc3RhbmNlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkb2MgVGhlIGRvY3VtZW50IHRvIGluc2VydC4gTWF5IG5vdCB5ZXQgaGF2ZSBhbiBfaWQgYXR0cmlidXRlLCBpbiB3aGljaCBjYXNlIE1ldGVvciB3aWxsIGdlbmVyYXRlIG9uZSBmb3IgeW91LlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2FsbGJhY2tdIE9wdGlvbmFsLiAgSWYgcHJlc2VudCwgY2FsbGVkIHdpdGggYW4gZXJyb3Igb2JqZWN0IGFzIHRoZSBmaXJzdCBhcmd1bWVudCBhbmQsIGlmIG5vIGVycm9yLCB0aGUgX2lkIGFzIHRoZSBzZWNvbmQuXG4gICAqL1xuICBpbnNlcnQoZG9jLCBjYWxsYmFjaykge1xuICAgIC8vIE1ha2Ugc3VyZSB3ZSB3ZXJlIHBhc3NlZCBhIGRvY3VtZW50IHRvIGluc2VydFxuICAgIGlmICghZG9jKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJpbnNlcnQgcmVxdWlyZXMgYW4gYXJndW1lbnRcIik7XG4gICAgfVxuXG4gICAgLy8gTWFrZSBhIHNoYWxsb3cgY2xvbmUgb2YgdGhlIGRvY3VtZW50LCBwcmVzZXJ2aW5nIGl0cyBwcm90b3R5cGUuXG4gICAgZG9jID0gT2JqZWN0LmNyZWF0ZShcbiAgICAgIE9iamVjdC5nZXRQcm90b3R5cGVPZihkb2MpLFxuICAgICAgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMoZG9jKVxuICAgICk7XG5cbiAgICBpZiAoJ19pZCcgaW4gZG9jKSB7XG4gICAgICBpZiAoISBkb2MuX2lkIHx8XG4gICAgICAgICAgISAodHlwZW9mIGRvYy5faWQgPT09ICdzdHJpbmcnIHx8XG4gICAgICAgICAgICAgZG9jLl9pZCBpbnN0YW5jZW9mIE1vbmdvLk9iamVjdElEKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgXCJNZXRlb3IgcmVxdWlyZXMgZG9jdW1lbnQgX2lkIGZpZWxkcyB0byBiZSBub24tZW1wdHkgc3RyaW5ncyBvciBPYmplY3RJRHNcIik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBnZW5lcmF0ZUlkID0gdHJ1ZTtcblxuICAgICAgLy8gRG9uJ3QgZ2VuZXJhdGUgdGhlIGlkIGlmIHdlJ3JlIHRoZSBjbGllbnQgYW5kIHRoZSAnb3V0ZXJtb3N0JyBjYWxsXG4gICAgICAvLyBUaGlzIG9wdGltaXphdGlvbiBzYXZlcyB1cyBwYXNzaW5nIGJvdGggdGhlIHJhbmRvbVNlZWQgYW5kIHRoZSBpZFxuICAgICAgLy8gUGFzc2luZyBib3RoIGlzIHJlZHVuZGFudC5cbiAgICAgIGlmICh0aGlzLl9pc1JlbW90ZUNvbGxlY3Rpb24oKSkge1xuICAgICAgICBjb25zdCBlbmNsb3NpbmcgPSBERFAuX0N1cnJlbnRNZXRob2RJbnZvY2F0aW9uLmdldCgpO1xuICAgICAgICBpZiAoIWVuY2xvc2luZykge1xuICAgICAgICAgIGdlbmVyYXRlSWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZ2VuZXJhdGVJZCkge1xuICAgICAgICBkb2MuX2lkID0gdGhpcy5fbWFrZU5ld0lEKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gT24gaW5zZXJ0cywgYWx3YXlzIHJldHVybiB0aGUgaWQgdGhhdCB3ZSBnZW5lcmF0ZWQ7IG9uIGFsbCBvdGhlclxuICAgIC8vIG9wZXJhdGlvbnMsIGp1c3QgcmV0dXJuIHRoZSByZXN1bHQgZnJvbSB0aGUgY29sbGVjdGlvbi5cbiAgICB2YXIgY2hvb3NlUmV0dXJuVmFsdWVGcm9tQ29sbGVjdGlvblJlc3VsdCA9IGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgIGlmIChkb2MuX2lkKSB7XG4gICAgICAgIHJldHVybiBkb2MuX2lkO1xuICAgICAgfVxuXG4gICAgICAvLyBYWFggd2hhdCBpcyB0aGlzIGZvcj8/XG4gICAgICAvLyBJdCdzIHNvbWUgaXRlcmFjdGlvbiBiZXR3ZWVuIHRoZSBjYWxsYmFjayB0byBfY2FsbE11dGF0b3JNZXRob2QgYW5kXG4gICAgICAvLyB0aGUgcmV0dXJuIHZhbHVlIGNvbnZlcnNpb25cbiAgICAgIGRvYy5faWQgPSByZXN1bHQ7XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIGNvbnN0IHdyYXBwZWRDYWxsYmFjayA9IHdyYXBDYWxsYmFjayhcbiAgICAgIGNhbGxiYWNrLCBjaG9vc2VSZXR1cm5WYWx1ZUZyb21Db2xsZWN0aW9uUmVzdWx0KTtcblxuICAgIGlmICh0aGlzLl9pc1JlbW90ZUNvbGxlY3Rpb24oKSkge1xuICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy5fY2FsbE11dGF0b3JNZXRob2QoXCJpbnNlcnRcIiwgW2RvY10sIHdyYXBwZWRDYWxsYmFjayk7XG4gICAgICByZXR1cm4gY2hvb3NlUmV0dXJuVmFsdWVGcm9tQ29sbGVjdGlvblJlc3VsdChyZXN1bHQpO1xuICAgIH1cblxuICAgIC8vIGl0J3MgbXkgY29sbGVjdGlvbi4gIGRlc2NlbmQgaW50byB0aGUgY29sbGVjdGlvbiBvYmplY3RcbiAgICAvLyBhbmQgcHJvcGFnYXRlIGFueSBleGNlcHRpb24uXG4gICAgdHJ5IHtcbiAgICAgIC8vIElmIHRoZSB1c2VyIHByb3ZpZGVkIGEgY2FsbGJhY2sgYW5kIHRoZSBjb2xsZWN0aW9uIGltcGxlbWVudHMgdGhpc1xuICAgICAgLy8gb3BlcmF0aW9uIGFzeW5jaHJvbm91c2x5LCB0aGVuIHF1ZXJ5UmV0IHdpbGwgYmUgdW5kZWZpbmVkLCBhbmQgdGhlXG4gICAgICAvLyByZXN1bHQgd2lsbCBiZSByZXR1cm5lZCB0aHJvdWdoIHRoZSBjYWxsYmFjayBpbnN0ZWFkLlxuICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy5fY29sbGVjdGlvbi5pbnNlcnQoZG9jLCB3cmFwcGVkQ2FsbGJhY2spO1xuICAgICAgcmV0dXJuIGNob29zZVJldHVyblZhbHVlRnJvbUNvbGxlY3Rpb25SZXN1bHQocmVzdWx0KTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgY2FsbGJhY2soZSk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgICAgdGhyb3cgZTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIEBzdW1tYXJ5IE1vZGlmeSBvbmUgb3IgbW9yZSBkb2N1bWVudHMgaW4gdGhlIGNvbGxlY3Rpb24uIFJldHVybnMgdGhlIG51bWJlciBvZiBtYXRjaGVkIGRvY3VtZW50cy5cbiAgICogQGxvY3VzIEFueXdoZXJlXG4gICAqIEBtZXRob2QgdXBkYXRlXG4gICAqIEBtZW1iZXJvZiBNb25nby5Db2xsZWN0aW9uXG4gICAqIEBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge01vbmdvU2VsZWN0b3J9IHNlbGVjdG9yIFNwZWNpZmllcyB3aGljaCBkb2N1bWVudHMgdG8gbW9kaWZ5XG4gICAqIEBwYXJhbSB7TW9uZ29Nb2RpZmllcn0gbW9kaWZpZXIgU3BlY2lmaWVzIGhvdyB0byBtb2RpZnkgdGhlIGRvY3VtZW50c1xuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gb3B0aW9ucy5tdWx0aSBUcnVlIHRvIG1vZGlmeSBhbGwgbWF0Y2hpbmcgZG9jdW1lbnRzOyBmYWxzZSB0byBvbmx5IG1vZGlmeSBvbmUgb2YgdGhlIG1hdGNoaW5nIGRvY3VtZW50cyAodGhlIGRlZmF1bHQpLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IG9wdGlvbnMudXBzZXJ0IFRydWUgdG8gaW5zZXJ0IGEgZG9jdW1lbnQgaWYgbm8gbWF0Y2hpbmcgZG9jdW1lbnRzIGFyZSBmb3VuZC5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gW2NhbGxiYWNrXSBPcHRpb25hbC4gIElmIHByZXNlbnQsIGNhbGxlZCB3aXRoIGFuIGVycm9yIG9iamVjdCBhcyB0aGUgZmlyc3QgYXJndW1lbnQgYW5kLCBpZiBubyBlcnJvciwgdGhlIG51bWJlciBvZiBhZmZlY3RlZCBkb2N1bWVudHMgYXMgdGhlIHNlY29uZC5cbiAgICovXG4gIHVwZGF0ZShzZWxlY3RvciwgbW9kaWZpZXIsIC4uLm9wdGlvbnNBbmRDYWxsYmFjaykge1xuICAgIGNvbnN0IGNhbGxiYWNrID0gcG9wQ2FsbGJhY2tGcm9tQXJncyhvcHRpb25zQW5kQ2FsbGJhY2spO1xuXG4gICAgLy8gV2UndmUgYWxyZWFkeSBwb3BwZWQgb2ZmIHRoZSBjYWxsYmFjaywgc28gd2UgYXJlIGxlZnQgd2l0aCBhbiBhcnJheVxuICAgIC8vIG9mIG9uZSBvciB6ZXJvIGl0ZW1zXG4gICAgY29uc3Qgb3B0aW9ucyA9IHsgLi4uKG9wdGlvbnNBbmRDYWxsYmFja1swXSB8fCBudWxsKSB9O1xuICAgIGxldCBpbnNlcnRlZElkO1xuICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMudXBzZXJ0KSB7XG4gICAgICAvLyBzZXQgYGluc2VydGVkSWRgIGlmIGFic2VudC4gIGBpbnNlcnRlZElkYCBpcyBhIE1ldGVvciBleHRlbnNpb24uXG4gICAgICBpZiAob3B0aW9ucy5pbnNlcnRlZElkKSB7XG4gICAgICAgIGlmICghKHR5cGVvZiBvcHRpb25zLmluc2VydGVkSWQgPT09ICdzdHJpbmcnIHx8IG9wdGlvbnMuaW5zZXJ0ZWRJZCBpbnN0YW5jZW9mIE1vbmdvLk9iamVjdElEKSlcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJpbnNlcnRlZElkIG11c3QgYmUgc3RyaW5nIG9yIE9iamVjdElEXCIpO1xuICAgICAgICBpbnNlcnRlZElkID0gb3B0aW9ucy5pbnNlcnRlZElkO1xuICAgICAgfSBlbHNlIGlmICghc2VsZWN0b3IgfHwgIXNlbGVjdG9yLl9pZCkge1xuICAgICAgICBpbnNlcnRlZElkID0gdGhpcy5fbWFrZU5ld0lEKCk7XG4gICAgICAgIG9wdGlvbnMuZ2VuZXJhdGVkSWQgPSB0cnVlO1xuICAgICAgICBvcHRpb25zLmluc2VydGVkSWQgPSBpbnNlcnRlZElkO1xuICAgICAgfVxuICAgIH1cblxuICAgIHNlbGVjdG9yID1cbiAgICAgIE1vbmdvLkNvbGxlY3Rpb24uX3Jld3JpdGVTZWxlY3RvcihzZWxlY3RvciwgeyBmYWxsYmFja0lkOiBpbnNlcnRlZElkIH0pO1xuXG4gICAgY29uc3Qgd3JhcHBlZENhbGxiYWNrID0gd3JhcENhbGxiYWNrKGNhbGxiYWNrKTtcblxuICAgIGlmICh0aGlzLl9pc1JlbW90ZUNvbGxlY3Rpb24oKSkge1xuICAgICAgY29uc3QgYXJncyA9IFtcbiAgICAgICAgc2VsZWN0b3IsXG4gICAgICAgIG1vZGlmaWVyLFxuICAgICAgICBvcHRpb25zXG4gICAgICBdO1xuXG4gICAgICByZXR1cm4gdGhpcy5fY2FsbE11dGF0b3JNZXRob2QoXCJ1cGRhdGVcIiwgYXJncywgd3JhcHBlZENhbGxiYWNrKTtcbiAgICB9XG5cbiAgICAvLyBpdCdzIG15IGNvbGxlY3Rpb24uICBkZXNjZW5kIGludG8gdGhlIGNvbGxlY3Rpb24gb2JqZWN0XG4gICAgLy8gYW5kIHByb3BhZ2F0ZSBhbnkgZXhjZXB0aW9uLlxuICAgIHRyeSB7XG4gICAgICAvLyBJZiB0aGUgdXNlciBwcm92aWRlZCBhIGNhbGxiYWNrIGFuZCB0aGUgY29sbGVjdGlvbiBpbXBsZW1lbnRzIHRoaXNcbiAgICAgIC8vIG9wZXJhdGlvbiBhc3luY2hyb25vdXNseSwgdGhlbiBxdWVyeVJldCB3aWxsIGJlIHVuZGVmaW5lZCwgYW5kIHRoZVxuICAgICAgLy8gcmVzdWx0IHdpbGwgYmUgcmV0dXJuZWQgdGhyb3VnaCB0aGUgY2FsbGJhY2sgaW5zdGVhZC5cbiAgICAgIHJldHVybiB0aGlzLl9jb2xsZWN0aW9uLnVwZGF0ZShcbiAgICAgICAgc2VsZWN0b3IsIG1vZGlmaWVyLCBvcHRpb25zLCB3cmFwcGVkQ2FsbGJhY2spO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjayhlKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgICB0aHJvdyBlO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogQHN1bW1hcnkgUmVtb3ZlIGRvY3VtZW50cyBmcm9tIHRoZSBjb2xsZWN0aW9uXG4gICAqIEBsb2N1cyBBbnl3aGVyZVxuICAgKiBAbWV0aG9kIHJlbW92ZVxuICAgKiBAbWVtYmVyb2YgTW9uZ28uQ29sbGVjdGlvblxuICAgKiBAaW5zdGFuY2VcbiAgICogQHBhcmFtIHtNb25nb1NlbGVjdG9yfSBzZWxlY3RvciBTcGVjaWZpZXMgd2hpY2ggZG9jdW1lbnRzIHRvIHJlbW92ZVxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2FsbGJhY2tdIE9wdGlvbmFsLiAgSWYgcHJlc2VudCwgY2FsbGVkIHdpdGggYW4gZXJyb3Igb2JqZWN0IGFzIGl0cyBhcmd1bWVudC5cbiAgICovXG4gIHJlbW92ZShzZWxlY3RvciwgY2FsbGJhY2spIHtcbiAgICBzZWxlY3RvciA9IE1vbmdvLkNvbGxlY3Rpb24uX3Jld3JpdGVTZWxlY3RvcihzZWxlY3Rvcik7XG5cbiAgICBjb25zdCB3cmFwcGVkQ2FsbGJhY2sgPSB3cmFwQ2FsbGJhY2soY2FsbGJhY2spO1xuXG4gICAgaWYgKHRoaXMuX2lzUmVtb3RlQ29sbGVjdGlvbigpKSB7XG4gICAgICByZXR1cm4gdGhpcy5fY2FsbE11dGF0b3JNZXRob2QoXCJyZW1vdmVcIiwgW3NlbGVjdG9yXSwgd3JhcHBlZENhbGxiYWNrKTtcbiAgICB9XG5cbiAgICAvLyBpdCdzIG15IGNvbGxlY3Rpb24uICBkZXNjZW5kIGludG8gdGhlIGNvbGxlY3Rpb24gb2JqZWN0XG4gICAgLy8gYW5kIHByb3BhZ2F0ZSBhbnkgZXhjZXB0aW9uLlxuICAgIHRyeSB7XG4gICAgICAvLyBJZiB0aGUgdXNlciBwcm92aWRlZCBhIGNhbGxiYWNrIGFuZCB0aGUgY29sbGVjdGlvbiBpbXBsZW1lbnRzIHRoaXNcbiAgICAgIC8vIG9wZXJhdGlvbiBhc3luY2hyb25vdXNseSwgdGhlbiBxdWVyeVJldCB3aWxsIGJlIHVuZGVmaW5lZCwgYW5kIHRoZVxuICAgICAgLy8gcmVzdWx0IHdpbGwgYmUgcmV0dXJuZWQgdGhyb3VnaCB0aGUgY2FsbGJhY2sgaW5zdGVhZC5cbiAgICAgIHJldHVybiB0aGlzLl9jb2xsZWN0aW9uLnJlbW92ZShzZWxlY3Rvciwgd3JhcHBlZENhbGxiYWNrKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgY2FsbGJhY2soZSk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgICAgdGhyb3cgZTtcbiAgICB9XG4gIH0sXG5cbiAgLy8gRGV0ZXJtaW5lIGlmIHRoaXMgY29sbGVjdGlvbiBpcyBzaW1wbHkgYSBtaW5pbW9uZ28gcmVwcmVzZW50YXRpb24gb2YgYSByZWFsXG4gIC8vIGRhdGFiYXNlIG9uIGFub3RoZXIgc2VydmVyXG4gIF9pc1JlbW90ZUNvbGxlY3Rpb24oKSB7XG4gICAgLy8gWFhYIHNlZSAjTWV0ZW9yU2VydmVyTnVsbFxuICAgIHJldHVybiB0aGlzLl9jb25uZWN0aW9uICYmIHRoaXMuX2Nvbm5lY3Rpb24gIT09IE1ldGVvci5zZXJ2ZXI7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEBzdW1tYXJ5IE1vZGlmeSBvbmUgb3IgbW9yZSBkb2N1bWVudHMgaW4gdGhlIGNvbGxlY3Rpb24sIG9yIGluc2VydCBvbmUgaWYgbm8gbWF0Y2hpbmcgZG9jdW1lbnRzIHdlcmUgZm91bmQuIFJldHVybnMgYW4gb2JqZWN0IHdpdGgga2V5cyBgbnVtYmVyQWZmZWN0ZWRgICh0aGUgbnVtYmVyIG9mIGRvY3VtZW50cyBtb2RpZmllZCkgIGFuZCBgaW5zZXJ0ZWRJZGAgKHRoZSB1bmlxdWUgX2lkIG9mIHRoZSBkb2N1bWVudCB0aGF0IHdhcyBpbnNlcnRlZCwgaWYgYW55KS5cbiAgICogQGxvY3VzIEFueXdoZXJlXG4gICAqIEBtZXRob2QgdXBzZXJ0XG4gICAqIEBtZW1iZXJvZiBNb25nby5Db2xsZWN0aW9uXG4gICAqIEBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge01vbmdvU2VsZWN0b3J9IHNlbGVjdG9yIFNwZWNpZmllcyB3aGljaCBkb2N1bWVudHMgdG8gbW9kaWZ5XG4gICAqIEBwYXJhbSB7TW9uZ29Nb2RpZmllcn0gbW9kaWZpZXIgU3BlY2lmaWVzIGhvdyB0byBtb2RpZnkgdGhlIGRvY3VtZW50c1xuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gb3B0aW9ucy5tdWx0aSBUcnVlIHRvIG1vZGlmeSBhbGwgbWF0Y2hpbmcgZG9jdW1lbnRzOyBmYWxzZSB0byBvbmx5IG1vZGlmeSBvbmUgb2YgdGhlIG1hdGNoaW5nIGRvY3VtZW50cyAodGhlIGRlZmF1bHQpLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2FsbGJhY2tdIE9wdGlvbmFsLiAgSWYgcHJlc2VudCwgY2FsbGVkIHdpdGggYW4gZXJyb3Igb2JqZWN0IGFzIHRoZSBmaXJzdCBhcmd1bWVudCBhbmQsIGlmIG5vIGVycm9yLCB0aGUgbnVtYmVyIG9mIGFmZmVjdGVkIGRvY3VtZW50cyBhcyB0aGUgc2Vjb25kLlxuICAgKi9cbiAgdXBzZXJ0KHNlbGVjdG9yLCBtb2RpZmllciwgb3B0aW9ucywgY2FsbGJhY2spIHtcbiAgICBpZiAoISBjYWxsYmFjayAmJiB0eXBlb2Ygb3B0aW9ucyA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICBjYWxsYmFjayA9IG9wdGlvbnM7XG4gICAgICBvcHRpb25zID0ge307XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMudXBkYXRlKHNlbGVjdG9yLCBtb2RpZmllciwge1xuICAgICAgLi4ub3B0aW9ucyxcbiAgICAgIF9yZXR1cm5PYmplY3Q6IHRydWUsXG4gICAgICB1cHNlcnQ6IHRydWUsXG4gICAgfSwgY2FsbGJhY2spO1xuICB9LFxuXG4gIC8vIFdlJ2xsIGFjdHVhbGx5IGRlc2lnbiBhbiBpbmRleCBBUEkgbGF0ZXIuIEZvciBub3csIHdlIGp1c3QgcGFzcyB0aHJvdWdoIHRvXG4gIC8vIE1vbmdvJ3MsIGJ1dCBtYWtlIGl0IHN5bmNocm9ub3VzLlxuICBfZW5zdXJlSW5kZXgoaW5kZXgsIG9wdGlvbnMpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgaWYgKCFzZWxmLl9jb2xsZWN0aW9uLl9lbnN1cmVJbmRleClcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbiBvbmx5IGNhbGwgX2Vuc3VyZUluZGV4IG9uIHNlcnZlciBjb2xsZWN0aW9uc1wiKTtcbiAgICBzZWxmLl9jb2xsZWN0aW9uLl9lbnN1cmVJbmRleChpbmRleCwgb3B0aW9ucyk7XG4gIH0sXG5cbiAgX2Ryb3BJbmRleChpbmRleCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBpZiAoIXNlbGYuX2NvbGxlY3Rpb24uX2Ryb3BJbmRleClcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbiBvbmx5IGNhbGwgX2Ryb3BJbmRleCBvbiBzZXJ2ZXIgY29sbGVjdGlvbnNcIik7XG4gICAgc2VsZi5fY29sbGVjdGlvbi5fZHJvcEluZGV4KGluZGV4KTtcbiAgfSxcblxuICBfZHJvcENvbGxlY3Rpb24oKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIGlmICghc2VsZi5fY29sbGVjdGlvbi5kcm9wQ29sbGVjdGlvbilcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbiBvbmx5IGNhbGwgX2Ryb3BDb2xsZWN0aW9uIG9uIHNlcnZlciBjb2xsZWN0aW9uc1wiKTtcbiAgICBzZWxmLl9jb2xsZWN0aW9uLmRyb3BDb2xsZWN0aW9uKCk7XG4gIH0sXG5cbiAgX2NyZWF0ZUNhcHBlZENvbGxlY3Rpb24oYnl0ZVNpemUsIG1heERvY3VtZW50cykge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBpZiAoIXNlbGYuX2NvbGxlY3Rpb24uX2NyZWF0ZUNhcHBlZENvbGxlY3Rpb24pXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW4gb25seSBjYWxsIF9jcmVhdGVDYXBwZWRDb2xsZWN0aW9uIG9uIHNlcnZlciBjb2xsZWN0aW9uc1wiKTtcbiAgICBzZWxmLl9jb2xsZWN0aW9uLl9jcmVhdGVDYXBwZWRDb2xsZWN0aW9uKGJ5dGVTaXplLCBtYXhEb2N1bWVudHMpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBAc3VtbWFyeSBSZXR1cm5zIHRoZSBbYENvbGxlY3Rpb25gXShodHRwOi8vbW9uZ29kYi5naXRodWIuaW8vbm9kZS1tb25nb2RiLW5hdGl2ZS8zLjAvYXBpL0NvbGxlY3Rpb24uaHRtbCkgb2JqZWN0IGNvcnJlc3BvbmRpbmcgdG8gdGhpcyBjb2xsZWN0aW9uIGZyb20gdGhlIFtucG0gYG1vbmdvZGJgIGRyaXZlciBtb2R1bGVdKGh0dHBzOi8vd3d3Lm5wbWpzLmNvbS9wYWNrYWdlL21vbmdvZGIpIHdoaWNoIGlzIHdyYXBwZWQgYnkgYE1vbmdvLkNvbGxlY3Rpb25gLlxuICAgKiBAbG9jdXMgU2VydmVyXG4gICAqIEBtZW1iZXJvZiBNb25nby5Db2xsZWN0aW9uXG4gICAqIEBpbnN0YW5jZVxuICAgKi9cbiAgcmF3Q29sbGVjdGlvbigpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgaWYgKCEgc2VsZi5fY29sbGVjdGlvbi5yYXdDb2xsZWN0aW9uKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW4gb25seSBjYWxsIHJhd0NvbGxlY3Rpb24gb24gc2VydmVyIGNvbGxlY3Rpb25zXCIpO1xuICAgIH1cbiAgICByZXR1cm4gc2VsZi5fY29sbGVjdGlvbi5yYXdDb2xsZWN0aW9uKCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEBzdW1tYXJ5IFJldHVybnMgdGhlIFtgRGJgXShodHRwOi8vbW9uZ29kYi5naXRodWIuaW8vbm9kZS1tb25nb2RiLW5hdGl2ZS8zLjAvYXBpL0RiLmh0bWwpIG9iamVjdCBjb3JyZXNwb25kaW5nIHRvIHRoaXMgY29sbGVjdGlvbidzIGRhdGFiYXNlIGNvbm5lY3Rpb24gZnJvbSB0aGUgW25wbSBgbW9uZ29kYmAgZHJpdmVyIG1vZHVsZV0oaHR0cHM6Ly93d3cubnBtanMuY29tL3BhY2thZ2UvbW9uZ29kYikgd2hpY2ggaXMgd3JhcHBlZCBieSBgTW9uZ28uQ29sbGVjdGlvbmAuXG4gICAqIEBsb2N1cyBTZXJ2ZXJcbiAgICogQG1lbWJlcm9mIE1vbmdvLkNvbGxlY3Rpb25cbiAgICogQGluc3RhbmNlXG4gICAqL1xuICByYXdEYXRhYmFzZSgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgaWYgKCEgKHNlbGYuX2RyaXZlci5tb25nbyAmJiBzZWxmLl9kcml2ZXIubW9uZ28uZGIpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW4gb25seSBjYWxsIHJhd0RhdGFiYXNlIG9uIHNlcnZlciBjb2xsZWN0aW9uc1wiKTtcbiAgICB9XG4gICAgcmV0dXJuIHNlbGYuX2RyaXZlci5tb25nby5kYjtcbiAgfVxufSk7XG5cbi8vIENvbnZlcnQgdGhlIGNhbGxiYWNrIHRvIG5vdCByZXR1cm4gYSByZXN1bHQgaWYgdGhlcmUgaXMgYW4gZXJyb3JcbmZ1bmN0aW9uIHdyYXBDYWxsYmFjayhjYWxsYmFjaywgY29udmVydFJlc3VsdCkge1xuICByZXR1cm4gY2FsbGJhY2sgJiYgZnVuY3Rpb24gKGVycm9yLCByZXN1bHQpIHtcbiAgICBpZiAoZXJyb3IpIHtcbiAgICAgIGNhbGxiYWNrKGVycm9yKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBjb252ZXJ0UmVzdWx0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIGNhbGxiYWNrKGVycm9yLCBjb252ZXJ0UmVzdWx0KHJlc3VsdCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjYWxsYmFjayhlcnJvciwgcmVzdWx0KTtcbiAgICB9XG4gIH07XG59XG5cbi8qKlxuICogQHN1bW1hcnkgQ3JlYXRlIGEgTW9uZ28tc3R5bGUgYE9iamVjdElEYC4gIElmIHlvdSBkb24ndCBzcGVjaWZ5IGEgYGhleFN0cmluZ2AsIHRoZSBgT2JqZWN0SURgIHdpbGwgZ2VuZXJhdGVkIHJhbmRvbWx5IChub3QgdXNpbmcgTW9uZ29EQidzIElEIGNvbnN0cnVjdGlvbiBydWxlcykuXG4gKiBAbG9jdXMgQW55d2hlcmVcbiAqIEBjbGFzc1xuICogQHBhcmFtIHtTdHJpbmd9IFtoZXhTdHJpbmddIE9wdGlvbmFsLiAgVGhlIDI0LWNoYXJhY3RlciBoZXhhZGVjaW1hbCBjb250ZW50cyBvZiB0aGUgT2JqZWN0SUQgdG8gY3JlYXRlXG4gKi9cbk1vbmdvLk9iamVjdElEID0gTW9uZ29JRC5PYmplY3RJRDtcblxuLyoqXG4gKiBAc3VtbWFyeSBUbyBjcmVhdGUgYSBjdXJzb3IsIHVzZSBmaW5kLiBUbyBhY2Nlc3MgdGhlIGRvY3VtZW50cyBpbiBhIGN1cnNvciwgdXNlIGZvckVhY2gsIG1hcCwgb3IgZmV0Y2guXG4gKiBAY2xhc3NcbiAqIEBpbnN0YW5jZU5hbWUgY3Vyc29yXG4gKi9cbk1vbmdvLkN1cnNvciA9IExvY2FsQ29sbGVjdGlvbi5DdXJzb3I7XG5cbi8qKlxuICogQGRlcHJlY2F0ZWQgaW4gMC45LjFcbiAqL1xuTW9uZ28uQ29sbGVjdGlvbi5DdXJzb3IgPSBNb25nby5DdXJzb3I7XG5cbi8qKlxuICogQGRlcHJlY2F0ZWQgaW4gMC45LjFcbiAqL1xuTW9uZ28uQ29sbGVjdGlvbi5PYmplY3RJRCA9IE1vbmdvLk9iamVjdElEO1xuXG4vKipcbiAqIEBkZXByZWNhdGVkIGluIDAuOS4xXG4gKi9cbk1ldGVvci5Db2xsZWN0aW9uID0gTW9uZ28uQ29sbGVjdGlvbjtcblxuLy8gQWxsb3cgZGVueSBzdHVmZiBpcyBub3cgaW4gdGhlIGFsbG93LWRlbnkgcGFja2FnZVxuT2JqZWN0LmFzc2lnbihcbiAgTWV0ZW9yLkNvbGxlY3Rpb24ucHJvdG90eXBlLFxuICBBbGxvd0RlbnkuQ29sbGVjdGlvblByb3RvdHlwZVxuKTtcblxuZnVuY3Rpb24gcG9wQ2FsbGJhY2tGcm9tQXJncyhhcmdzKSB7XG4gIC8vIFB1bGwgb2ZmIGFueSBjYWxsYmFjayAob3IgcGVyaGFwcyBhICdjYWxsYmFjaycgdmFyaWFibGUgdGhhdCB3YXMgcGFzc2VkXG4gIC8vIGluIHVuZGVmaW5lZCwgbGlrZSBob3cgJ3Vwc2VydCcgZG9lcyBpdCkuXG4gIGlmIChhcmdzLmxlbmd0aCAmJlxuICAgICAgKGFyZ3NbYXJncy5sZW5ndGggLSAxXSA9PT0gdW5kZWZpbmVkIHx8XG4gICAgICAgYXJnc1thcmdzLmxlbmd0aCAtIDFdIGluc3RhbmNlb2YgRnVuY3Rpb24pKSB7XG4gICAgcmV0dXJuIGFyZ3MucG9wKCk7XG4gIH1cbn1cbiIsIi8qKlxuICogQHN1bW1hcnkgQWxsb3dzIGZvciB1c2VyIHNwZWNpZmllZCBjb25uZWN0aW9uIG9wdGlvbnNcbiAqIEBleGFtcGxlIGh0dHA6Ly9tb25nb2RiLmdpdGh1Yi5pby9ub2RlLW1vbmdvZGItbmF0aXZlLzMuMC9yZWZlcmVuY2UvY29ubmVjdGluZy9jb25uZWN0aW9uLXNldHRpbmdzL1xuICogQGxvY3VzIFNlcnZlclxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgVXNlciBzcGVjaWZpZWQgTW9uZ28gY29ubmVjdGlvbiBvcHRpb25zXG4gKi9cbk1vbmdvLnNldENvbm5lY3Rpb25PcHRpb25zID0gZnVuY3Rpb24gc2V0Q29ubmVjdGlvbk9wdGlvbnMgKG9wdGlvbnMpIHtcbiAgY2hlY2sob3B0aW9ucywgT2JqZWN0KTtcbiAgTW9uZ28uX2Nvbm5lY3Rpb25PcHRpb25zID0gb3B0aW9ucztcbn07Il19
