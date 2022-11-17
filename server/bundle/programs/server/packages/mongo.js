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
      }; // explictly enumerate options that minimongo supports

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
    var self = this; // We expect this function to be called at startup, not from within a method,
    // so we don't interact with the write fence.

    var collection = self.rawCollection(collectionName);
    var future = new Future();
    var indexName = collection.ensureIndex(index, options, future.resolver());
    future.wait();
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvbW9uZ28vbW9uZ29fZHJpdmVyLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9tb25nby9vcGxvZ190YWlsaW5nLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9tb25nby9vYnNlcnZlX211bHRpcGxleC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvbW9uZ28vZG9jX2ZldGNoZXIuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL21vbmdvL3BvbGxpbmdfb2JzZXJ2ZV9kcml2ZXIuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL21vbmdvL29wbG9nX29ic2VydmVfZHJpdmVyLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9tb25nby9sb2NhbF9jb2xsZWN0aW9uX2RyaXZlci5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvbW9uZ28vcmVtb3RlX2NvbGxlY3Rpb25fZHJpdmVyLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9tb25nby9jb2xsZWN0aW9uLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9tb25nby9jb25uZWN0aW9uX29wdGlvbnMuanMiXSwibmFtZXMiOlsiRG9jRmV0Y2hlciIsIm1vZHVsZTEiLCJsaW5rIiwidiIsIk1vbmdvREIiLCJOcG1Nb2R1bGVNb25nb2RiIiwiRnV0dXJlIiwiTnBtIiwicmVxdWlyZSIsIk1vbmdvSW50ZXJuYWxzIiwiTnBtTW9kdWxlcyIsIm1vbmdvZGIiLCJ2ZXJzaW9uIiwiTnBtTW9kdWxlTW9uZ29kYlZlcnNpb24iLCJtb2R1bGUiLCJOcG1Nb2R1bGUiLCJyZXBsYWNlTmFtZXMiLCJmaWx0ZXIiLCJ0aGluZyIsIl8iLCJpc0FycmF5IiwibWFwIiwiYmluZCIsInJldCIsImVhY2giLCJ2YWx1ZSIsImtleSIsIlRpbWVzdGFtcCIsInByb3RvdHlwZSIsImNsb25lIiwibWFrZU1vbmdvTGVnYWwiLCJuYW1lIiwidW5tYWtlTW9uZ29MZWdhbCIsInN1YnN0ciIsInJlcGxhY2VNb25nb0F0b21XaXRoTWV0ZW9yIiwiZG9jdW1lbnQiLCJCaW5hcnkiLCJidWZmZXIiLCJVaW50OEFycmF5IiwiT2JqZWN0SUQiLCJNb25nbyIsInRvSGV4U3RyaW5nIiwiRGVjaW1hbDEyOCIsIkRlY2ltYWwiLCJ0b1N0cmluZyIsInNpemUiLCJFSlNPTiIsImZyb21KU09OVmFsdWUiLCJ1bmRlZmluZWQiLCJyZXBsYWNlTWV0ZW9yQXRvbVdpdGhNb25nbyIsImlzQmluYXJ5IiwiZnJvbVN0cmluZyIsIl9pc0N1c3RvbVR5cGUiLCJ0b0pTT05WYWx1ZSIsInJlcGxhY2VUeXBlcyIsImF0b21UcmFuc2Zvcm1lciIsInJlcGxhY2VkVG9wTGV2ZWxBdG9tIiwidmFsIiwidmFsUmVwbGFjZWQiLCJNb25nb0Nvbm5lY3Rpb24iLCJ1cmwiLCJvcHRpb25zIiwic2VsZiIsIl9vYnNlcnZlTXVsdGlwbGV4ZXJzIiwiX29uRmFpbG92ZXJIb29rIiwiSG9vayIsIm1vbmdvT3B0aW9ucyIsIk9iamVjdCIsImFzc2lnbiIsImF1dG9SZWNvbm5lY3QiLCJyZWNvbm5lY3RUcmllcyIsIkluZmluaXR5IiwiaWdub3JlVW5kZWZpbmVkIiwidXNlTmV3VXJsUGFyc2VyIiwiX2Nvbm5lY3Rpb25PcHRpb25zIiwidGVzdCIsIm5hdGl2ZV9wYXJzZXIiLCJoYXMiLCJwb29sU2l6ZSIsImRiIiwiX3ByaW1hcnkiLCJfb3Bsb2dIYW5kbGUiLCJfZG9jRmV0Y2hlciIsImNvbm5lY3RGdXR1cmUiLCJjb25uZWN0IiwiTWV0ZW9yIiwiYmluZEVudmlyb25tZW50IiwiZXJyIiwiY2xpZW50Iiwic2VydmVyQ29uZmlnIiwiaXNNYXN0ZXJEb2MiLCJwcmltYXJ5Iiwib24iLCJraW5kIiwiZG9jIiwiY2FsbGJhY2siLCJtZSIsInJlc29sdmVyIiwid2FpdCIsIm9wbG9nVXJsIiwiUGFja2FnZSIsIk9wbG9nSGFuZGxlIiwiZGF0YWJhc2VOYW1lIiwiY2xvc2UiLCJFcnJvciIsIm9wbG9nSGFuZGxlIiwic3RvcCIsIndyYXAiLCJyYXdDb2xsZWN0aW9uIiwiY29sbGVjdGlvbk5hbWUiLCJmdXR1cmUiLCJjb2xsZWN0aW9uIiwiX2NyZWF0ZUNhcHBlZENvbGxlY3Rpb24iLCJieXRlU2l6ZSIsIm1heERvY3VtZW50cyIsImNyZWF0ZUNvbGxlY3Rpb24iLCJjYXBwZWQiLCJtYXgiLCJfbWF5YmVCZWdpbldyaXRlIiwiZmVuY2UiLCJERFBTZXJ2ZXIiLCJfQ3VycmVudFdyaXRlRmVuY2UiLCJnZXQiLCJiZWdpbldyaXRlIiwiY29tbWl0dGVkIiwiX29uRmFpbG92ZXIiLCJyZWdpc3RlciIsIndyaXRlQ2FsbGJhY2siLCJ3cml0ZSIsInJlZnJlc2giLCJyZXN1bHQiLCJyZWZyZXNoRXJyIiwiYmluZEVudmlyb25tZW50Rm9yV3JpdGUiLCJfaW5zZXJ0IiwiY29sbGVjdGlvbl9uYW1lIiwic2VuZEVycm9yIiwiZSIsIl9leHBlY3RlZEJ5VGVzdCIsIkxvY2FsQ29sbGVjdGlvbiIsIl9pc1BsYWluT2JqZWN0IiwiaWQiLCJfaWQiLCJpbnNlcnQiLCJzYWZlIiwiX3JlZnJlc2giLCJzZWxlY3RvciIsInJlZnJlc2hLZXkiLCJzcGVjaWZpY0lkcyIsIl9pZHNNYXRjaGVkQnlTZWxlY3RvciIsImV4dGVuZCIsIl9yZW1vdmUiLCJ3cmFwcGVkQ2FsbGJhY2siLCJkcml2ZXJSZXN1bHQiLCJ0cmFuc2Zvcm1SZXN1bHQiLCJudW1iZXJBZmZlY3RlZCIsInJlbW92ZSIsIl9kcm9wQ29sbGVjdGlvbiIsImNiIiwiZHJvcENvbGxlY3Rpb24iLCJkcm9wIiwiX2Ryb3BEYXRhYmFzZSIsImRyb3BEYXRhYmFzZSIsIl91cGRhdGUiLCJtb2QiLCJGdW5jdGlvbiIsIm1vbmdvT3B0cyIsInVwc2VydCIsIm11bHRpIiwiZnVsbFJlc3VsdCIsIm1vbmdvU2VsZWN0b3IiLCJtb25nb01vZCIsImlzTW9kaWZ5IiwiX2lzTW9kaWZpY2F0aW9uTW9kIiwiX2ZvcmJpZFJlcGxhY2UiLCJrbm93bklkIiwibmV3RG9jIiwiX2NyZWF0ZVVwc2VydERvY3VtZW50IiwiaW5zZXJ0ZWRJZCIsImdlbmVyYXRlZElkIiwic2ltdWxhdGVVcHNlcnRXaXRoSW5zZXJ0ZWRJZCIsImVycm9yIiwiX3JldHVybk9iamVjdCIsImhhc093blByb3BlcnR5IiwiJHNldE9uSW5zZXJ0IiwidXBkYXRlIiwibWV0ZW9yUmVzdWx0IiwibW9uZ29SZXN1bHQiLCJ1cHNlcnRlZCIsImxlbmd0aCIsIm4iLCJOVU1fT1BUSU1JU1RJQ19UUklFUyIsIl9pc0Nhbm5vdENoYW5nZUlkRXJyb3IiLCJlcnJtc2ciLCJpbmRleE9mIiwibW9uZ29PcHRzRm9yVXBkYXRlIiwibW9uZ29PcHRzRm9ySW5zZXJ0IiwicmVwbGFjZW1lbnRXaXRoSWQiLCJ0cmllcyIsImRvVXBkYXRlIiwiZG9Db25kaXRpb25hbEluc2VydCIsIm1ldGhvZCIsIndyYXBBc3luYyIsImFwcGx5IiwiYXJndW1lbnRzIiwiZmluZCIsIkN1cnNvciIsIkN1cnNvckRlc2NyaXB0aW9uIiwiZmluZE9uZSIsImxpbWl0IiwiZmV0Y2giLCJfZW5zdXJlSW5kZXgiLCJpbmRleCIsImluZGV4TmFtZSIsImVuc3VyZUluZGV4IiwiX2Ryb3BJbmRleCIsImRyb3BJbmRleCIsIkNvbGxlY3Rpb24iLCJfcmV3cml0ZVNlbGVjdG9yIiwibW9uZ28iLCJjdXJzb3JEZXNjcmlwdGlvbiIsIl9tb25nbyIsIl9jdXJzb3JEZXNjcmlwdGlvbiIsIl9zeW5jaHJvbm91c0N1cnNvciIsIlN5bWJvbCIsIml0ZXJhdG9yIiwidGFpbGFibGUiLCJfY3JlYXRlU3luY2hyb25vdXNDdXJzb3IiLCJzZWxmRm9ySXRlcmF0aW9uIiwidXNlVHJhbnNmb3JtIiwicmV3aW5kIiwiZ2V0VHJhbnNmb3JtIiwidHJhbnNmb3JtIiwiX3B1Ymxpc2hDdXJzb3IiLCJzdWIiLCJfZ2V0Q29sbGVjdGlvbk5hbWUiLCJvYnNlcnZlIiwiY2FsbGJhY2tzIiwiX29ic2VydmVGcm9tT2JzZXJ2ZUNoYW5nZXMiLCJvYnNlcnZlQ2hhbmdlcyIsIm1ldGhvZHMiLCJvcmRlcmVkIiwiX29ic2VydmVDaGFuZ2VzQ2FsbGJhY2tzQXJlT3JkZXJlZCIsImV4Y2VwdGlvbk5hbWUiLCJmb3JFYWNoIiwiX29ic2VydmVDaGFuZ2VzIiwicGljayIsImN1cnNvck9wdGlvbnMiLCJzb3J0Iiwic2tpcCIsInByb2plY3Rpb24iLCJmaWVsZHMiLCJhd2FpdGRhdGEiLCJudW1iZXJPZlJldHJpZXMiLCJPUExPR19DT0xMRUNUSU9OIiwidHMiLCJvcGxvZ1JlcGxheSIsImRiQ3Vyc29yIiwibWF4VGltZU1zIiwibWF4VGltZU1TIiwiaGludCIsIlN5bmNocm9ub3VzQ3Vyc29yIiwiX2RiQ3Vyc29yIiwiX3NlbGZGb3JJdGVyYXRpb24iLCJfdHJhbnNmb3JtIiwid3JhcFRyYW5zZm9ybSIsIl9zeW5jaHJvbm91c0NvdW50IiwiY291bnQiLCJfdmlzaXRlZElkcyIsIl9JZE1hcCIsIl9yYXdOZXh0T2JqZWN0UHJvbWlzZSIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwibmV4dCIsIl9uZXh0T2JqZWN0UHJvbWlzZSIsInNldCIsIl9uZXh0T2JqZWN0UHJvbWlzZVdpdGhUaW1lb3V0IiwidGltZW91dE1TIiwibmV4dE9iamVjdFByb21pc2UiLCJ0aW1lb3V0RXJyIiwidGltZW91dFByb21pc2UiLCJ0aW1lciIsInNldFRpbWVvdXQiLCJyYWNlIiwiY2F0Y2giLCJfbmV4dE9iamVjdCIsImF3YWl0IiwidGhpc0FyZyIsIl9yZXdpbmQiLCJjYWxsIiwicmVzIiwicHVzaCIsImlkZW50aXR5IiwiYXBwbHlTa2lwTGltaXQiLCJnZXRSYXdPYmplY3RzIiwicmVzdWx0cyIsImRvbmUiLCJ0YWlsIiwiZG9jQ2FsbGJhY2siLCJjdXJzb3IiLCJzdG9wcGVkIiwibGFzdFRTIiwibG9vcCIsIm5ld1NlbGVjdG9yIiwiJGd0IiwiZGVmZXIiLCJfb2JzZXJ2ZUNoYW5nZXNUYWlsYWJsZSIsIm9ic2VydmVLZXkiLCJzdHJpbmdpZnkiLCJtdWx0aXBsZXhlciIsIm9ic2VydmVEcml2ZXIiLCJmaXJzdEhhbmRsZSIsIl9ub1lpZWxkc0FsbG93ZWQiLCJPYnNlcnZlTXVsdGlwbGV4ZXIiLCJvblN0b3AiLCJvYnNlcnZlSGFuZGxlIiwiT2JzZXJ2ZUhhbmRsZSIsIm1hdGNoZXIiLCJzb3J0ZXIiLCJjYW5Vc2VPcGxvZyIsImFsbCIsIl90ZXN0T25seVBvbGxDYWxsYmFjayIsIk1pbmltb25nbyIsIk1hdGNoZXIiLCJPcGxvZ09ic2VydmVEcml2ZXIiLCJjdXJzb3JTdXBwb3J0ZWQiLCJTb3J0ZXIiLCJmIiwiZHJpdmVyQ2xhc3MiLCJQb2xsaW5nT2JzZXJ2ZURyaXZlciIsIm1vbmdvSGFuZGxlIiwiX29ic2VydmVEcml2ZXIiLCJhZGRIYW5kbGVBbmRTZW5kSW5pdGlhbEFkZHMiLCJsaXN0ZW5BbGwiLCJsaXN0ZW5DYWxsYmFjayIsImxpc3RlbmVycyIsImZvckVhY2hUcmlnZ2VyIiwidHJpZ2dlciIsIl9JbnZhbGlkYXRpb25Dcm9zc2JhciIsImxpc3RlbiIsImxpc3RlbmVyIiwidHJpZ2dlckNhbGxiYWNrIiwiYWRkZWRCZWZvcmUiLCJhZGRlZCIsIk1vbmdvVGltZXN0YW1wIiwiQ29ubmVjdGlvbiIsIlRPT19GQVJfQkVISU5EIiwicHJvY2VzcyIsImVudiIsIk1FVEVPUl9PUExPR19UT09fRkFSX0JFSElORCIsIlRBSUxfVElNRU9VVCIsIk1FVEVPUl9PUExPR19UQUlMX1RJTUVPVVQiLCJzaG93VFMiLCJnZXRIaWdoQml0cyIsImdldExvd0JpdHMiLCJpZEZvck9wIiwib3AiLCJvIiwibzIiLCJkYk5hbWUiLCJfb3Bsb2dVcmwiLCJfZGJOYW1lIiwiX29wbG9nTGFzdEVudHJ5Q29ubmVjdGlvbiIsIl9vcGxvZ1RhaWxDb25uZWN0aW9uIiwiX3N0b3BwZWQiLCJfdGFpbEhhbmRsZSIsIl9yZWFkeUZ1dHVyZSIsIl9jcm9zc2JhciIsIl9Dcm9zc2JhciIsImZhY3RQYWNrYWdlIiwiZmFjdE5hbWUiLCJfYmFzZU9wbG9nU2VsZWN0b3IiLCJucyIsIlJlZ0V4cCIsIl9lc2NhcGVSZWdFeHAiLCJqb2luIiwiJG9yIiwiJGluIiwiJGV4aXN0cyIsIl9jYXRjaGluZ1VwRnV0dXJlcyIsIl9sYXN0UHJvY2Vzc2VkVFMiLCJfb25Ta2lwcGVkRW50cmllc0hvb2siLCJkZWJ1Z1ByaW50RXhjZXB0aW9ucyIsIl9lbnRyeVF1ZXVlIiwiX0RvdWJsZUVuZGVkUXVldWUiLCJfd29ya2VyQWN0aXZlIiwiX3N0YXJ0VGFpbGluZyIsIm9uT3Bsb2dFbnRyeSIsIm9yaWdpbmFsQ2FsbGJhY2siLCJub3RpZmljYXRpb24iLCJfZGVidWciLCJsaXN0ZW5IYW5kbGUiLCJvblNraXBwZWRFbnRyaWVzIiwid2FpdFVudGlsQ2F1Z2h0VXAiLCJsYXN0RW50cnkiLCIkbmF0dXJhbCIsIl9zbGVlcEZvck1zIiwibGVzc1RoYW5PckVxdWFsIiwiaW5zZXJ0QWZ0ZXIiLCJncmVhdGVyVGhhbiIsInNwbGljZSIsIm1vbmdvZGJVcmkiLCJwYXJzZSIsImRhdGFiYXNlIiwiYWRtaW4iLCJjb21tYW5kIiwiaXNtYXN0ZXIiLCJzZXROYW1lIiwibGFzdE9wbG9nRW50cnkiLCJvcGxvZ1NlbGVjdG9yIiwiX21heWJlU3RhcnRXb3JrZXIiLCJyZXR1cm4iLCJoYW5kbGVEb2MiLCJhcHBseU9wcyIsIm5leHRUaW1lc3RhbXAiLCJhZGQiLCJPTkUiLCJzdGFydHNXaXRoIiwic2xpY2UiLCJmaXJlIiwiaXNFbXB0eSIsInBvcCIsImNsZWFyIiwiX3NldExhc3RQcm9jZXNzZWRUUyIsInNoaWZ0Iiwic2VxdWVuY2VyIiwiX2RlZmluZVRvb0ZhckJlaGluZCIsIl9yZXNldFRvb0ZhckJlaGluZCIsIkZhY3RzIiwiaW5jcmVtZW50U2VydmVyRmFjdCIsIl9vcmRlcmVkIiwiX29uU3RvcCIsIl9xdWV1ZSIsIl9TeW5jaHJvbm91c1F1ZXVlIiwiX2hhbmRsZXMiLCJfY2FjaGUiLCJfQ2FjaGluZ0NoYW5nZU9ic2VydmVyIiwiX2FkZEhhbmRsZVRhc2tzU2NoZWR1bGVkQnV0Tm90UGVyZm9ybWVkIiwiY2FsbGJhY2tOYW1lcyIsImNhbGxiYWNrTmFtZSIsIl9hcHBseUNhbGxiYWNrIiwidG9BcnJheSIsImhhbmRsZSIsInNhZmVUb1J1blRhc2siLCJydW5UYXNrIiwiX3NlbmRBZGRzIiwicmVtb3ZlSGFuZGxlIiwiX3JlYWR5IiwiX3N0b3AiLCJmcm9tUXVlcnlFcnJvciIsInJlYWR5IiwicXVldWVUYXNrIiwicXVlcnlFcnJvciIsInRocm93Iiwib25GbHVzaCIsImlzUmVzb2x2ZWQiLCJhcmdzIiwiYXBwbHlDaGFuZ2UiLCJrZXlzIiwiaGFuZGxlSWQiLCJfYWRkZWRCZWZvcmUiLCJfYWRkZWQiLCJkb2NzIiwibmV4dE9ic2VydmVIYW5kbGVJZCIsIl9tdWx0aXBsZXhlciIsImJlZm9yZSIsImV4cG9ydCIsIkZpYmVyIiwiY29uc3RydWN0b3IiLCJtb25nb0Nvbm5lY3Rpb24iLCJfbW9uZ29Db25uZWN0aW9uIiwiX2NhbGxiYWNrc0Zvck9wIiwiTWFwIiwiY2hlY2siLCJTdHJpbmciLCJkZWxldGUiLCJydW4iLCJQT0xMSU5HX1RIUk9UVExFX01TIiwiTUVURU9SX1BPTExJTkdfVEhST1RUTEVfTVMiLCJQT0xMSU5HX0lOVEVSVkFMX01TIiwiTUVURU9SX1BPTExJTkdfSU5URVJWQUxfTVMiLCJfbW9uZ29IYW5kbGUiLCJfc3RvcENhbGxiYWNrcyIsIl9yZXN1bHRzIiwiX3BvbGxzU2NoZWR1bGVkQnV0Tm90U3RhcnRlZCIsIl9wZW5kaW5nV3JpdGVzIiwiX2Vuc3VyZVBvbGxJc1NjaGVkdWxlZCIsInRocm90dGxlIiwiX3VudGhyb3R0bGVkRW5zdXJlUG9sbElzU2NoZWR1bGVkIiwicG9sbGluZ1Rocm90dGxlTXMiLCJfdGFza1F1ZXVlIiwibGlzdGVuZXJzSGFuZGxlIiwicG9sbGluZ0ludGVydmFsIiwicG9sbGluZ0ludGVydmFsTXMiLCJfcG9sbGluZ0ludGVydmFsIiwiaW50ZXJ2YWxIYW5kbGUiLCJzZXRJbnRlcnZhbCIsImNsZWFySW50ZXJ2YWwiLCJfcG9sbE1vbmdvIiwiX3N1c3BlbmRQb2xsaW5nIiwiX3Jlc3VtZVBvbGxpbmciLCJmaXJzdCIsIm5ld1Jlc3VsdHMiLCJvbGRSZXN1bHRzIiwid3JpdGVzRm9yQ3ljbGUiLCJjb2RlIiwiSlNPTiIsIm1lc3NhZ2UiLCJBcnJheSIsIl9kaWZmUXVlcnlDaGFuZ2VzIiwidyIsImMiLCJQSEFTRSIsIlFVRVJZSU5HIiwiRkVUQ0hJTkciLCJTVEVBRFkiLCJTd2l0Y2hlZFRvUXVlcnkiLCJmaW5pc2hJZk5lZWRUb1BvbGxRdWVyeSIsImN1cnJlbnRJZCIsIl91c2VzT3Bsb2ciLCJjb21wYXJhdG9yIiwiZ2V0Q29tcGFyYXRvciIsImhlYXBPcHRpb25zIiwiSWRNYXAiLCJfbGltaXQiLCJfY29tcGFyYXRvciIsIl9zb3J0ZXIiLCJfdW5wdWJsaXNoZWRCdWZmZXIiLCJNaW5NYXhIZWFwIiwiX3B1Ymxpc2hlZCIsIk1heEhlYXAiLCJfc2FmZUFwcGVuZFRvQnVmZmVyIiwiX3N0b3BIYW5kbGVzIiwiX3JlZ2lzdGVyUGhhc2VDaGFuZ2UiLCJfbWF0Y2hlciIsIl9wcm9qZWN0aW9uRm4iLCJfY29tcGlsZVByb2plY3Rpb24iLCJfc2hhcmVkUHJvamVjdGlvbiIsImNvbWJpbmVJbnRvUHJvamVjdGlvbiIsIl9zaGFyZWRQcm9qZWN0aW9uRm4iLCJfbmVlZFRvRmV0Y2giLCJfY3VycmVudGx5RmV0Y2hpbmciLCJfZmV0Y2hHZW5lcmF0aW9uIiwiX3JlcXVlcnlXaGVuRG9uZVRoaXNRdWVyeSIsIl93cml0ZXNUb0NvbW1pdFdoZW5XZVJlYWNoU3RlYWR5IiwiX25lZWRUb1BvbGxRdWVyeSIsIl9waGFzZSIsIl9oYW5kbGVPcGxvZ0VudHJ5UXVlcnlpbmciLCJfaGFuZGxlT3Bsb2dFbnRyeVN0ZWFkeU9yRmV0Y2hpbmciLCJmaXJlZCIsIl9vcGxvZ09ic2VydmVEcml2ZXJzIiwib25CZWZvcmVGaXJlIiwiZHJpdmVycyIsImRyaXZlciIsIl9ydW5Jbml0aWFsUXVlcnkiLCJfYWRkUHVibGlzaGVkIiwib3ZlcmZsb3dpbmdEb2NJZCIsIm1heEVsZW1lbnRJZCIsIm92ZXJmbG93aW5nRG9jIiwiZXF1YWxzIiwicmVtb3ZlZCIsIl9hZGRCdWZmZXJlZCIsIl9yZW1vdmVQdWJsaXNoZWQiLCJlbXB0eSIsIm5ld0RvY0lkIiwibWluRWxlbWVudElkIiwiX3JlbW92ZUJ1ZmZlcmVkIiwiX2NoYW5nZVB1Ymxpc2hlZCIsIm9sZERvYyIsInByb2plY3RlZE5ldyIsInByb2plY3RlZE9sZCIsImNoYW5nZWQiLCJEaWZmU2VxdWVuY2UiLCJtYWtlQ2hhbmdlZEZpZWxkcyIsIm1heEJ1ZmZlcmVkSWQiLCJfYWRkTWF0Y2hpbmciLCJtYXhQdWJsaXNoZWQiLCJtYXhCdWZmZXJlZCIsInRvUHVibGlzaCIsImNhbkFwcGVuZFRvQnVmZmVyIiwiY2FuSW5zZXJ0SW50b0J1ZmZlciIsInRvQnVmZmVyIiwiX3JlbW92ZU1hdGNoaW5nIiwiX2hhbmRsZURvYyIsIm1hdGNoZXNOb3ciLCJkb2N1bWVudE1hdGNoZXMiLCJwdWJsaXNoZWRCZWZvcmUiLCJidWZmZXJlZEJlZm9yZSIsImNhY2hlZEJlZm9yZSIsIm1pbkJ1ZmZlcmVkIiwic3RheXNJblB1Ymxpc2hlZCIsInN0YXlzSW5CdWZmZXIiLCJfZmV0Y2hNb2RpZmllZERvY3VtZW50cyIsInRoaXNHZW5lcmF0aW9uIiwid2FpdGluZyIsImZ1dCIsIl9iZVN0ZWFkeSIsIndyaXRlcyIsImlzUmVwbGFjZSIsImNhbkRpcmVjdGx5TW9kaWZ5RG9jIiwibW9kaWZpZXJDYW5CZURpcmVjdGx5QXBwbGllZCIsIl9tb2RpZnkiLCJjYW5CZWNvbWVUcnVlQnlNb2RpZmllciIsImFmZmVjdGVkQnlNb2RpZmllciIsIl9ydW5RdWVyeSIsImluaXRpYWwiLCJfZG9uZVF1ZXJ5aW5nIiwiX3BvbGxRdWVyeSIsIm5ld0J1ZmZlciIsIl9jdXJzb3JGb3JRdWVyeSIsImkiLCJfcHVibGlzaE5ld1Jlc3VsdHMiLCJvcHRpb25zT3ZlcndyaXRlIiwiZGVzY3JpcHRpb24iLCJpZHNUb1JlbW92ZSIsImNvbnNvbGUiLCJfb3Bsb2dFbnRyeUhhbmRsZSIsIl9saXN0ZW5lcnNIYW5kbGUiLCJwaGFzZSIsIm5vdyIsIkRhdGUiLCJ0aW1lRGlmZiIsIl9waGFzZVN0YXJ0VGltZSIsImRpc2FibGVPcGxvZyIsIl9kaXNhYmxlT3Bsb2ciLCJfY2hlY2tTdXBwb3J0ZWRQcm9qZWN0aW9uIiwiaGFzV2hlcmUiLCJoYXNHZW9RdWVyeSIsIm1vZGlmaWVyIiwib3BlcmF0aW9uIiwiZmllbGQiLCJMb2NhbENvbGxlY3Rpb25Ecml2ZXIiLCJub0Nvbm5Db2xsZWN0aW9ucyIsImNyZWF0ZSIsIm9wZW4iLCJjb25uIiwiZW5zdXJlQ29sbGVjdGlvbiIsIl9tb25nb19saXZlZGF0YV9jb2xsZWN0aW9ucyIsImNvbGxlY3Rpb25zIiwiUmVtb3RlQ29sbGVjdGlvbkRyaXZlciIsIm1vbmdvX3VybCIsIm0iLCJkZWZhdWx0UmVtb3RlQ29sbGVjdGlvbkRyaXZlciIsIm9uY2UiLCJjb25uZWN0aW9uT3B0aW9ucyIsIm1vbmdvVXJsIiwiTU9OR09fVVJMIiwiTU9OR09fT1BMT0dfVVJMIiwiX29iamVjdFNwcmVhZCIsImRlZmF1bHQiLCJjb25uZWN0aW9uIiwibWFuYWdlciIsImlkR2VuZXJhdGlvbiIsIl9kcml2ZXIiLCJfcHJldmVudEF1dG9wdWJsaXNoIiwiX21ha2VOZXdJRCIsInNyYyIsIkREUCIsInJhbmRvbVN0cmVhbSIsIlJhbmRvbSIsImluc2VjdXJlIiwiaGV4U3RyaW5nIiwiX2Nvbm5lY3Rpb24iLCJpc0NsaWVudCIsInNlcnZlciIsIl9jb2xsZWN0aW9uIiwiX25hbWUiLCJfbWF5YmVTZXRVcFJlcGxpY2F0aW9uIiwiZGVmaW5lTXV0YXRpb25NZXRob2RzIiwiX2RlZmluZU11dGF0aW9uTWV0aG9kcyIsInVzZUV4aXN0aW5nIiwiX3N1cHByZXNzU2FtZU5hbWVFcnJvciIsImF1dG9wdWJsaXNoIiwicHVibGlzaCIsImlzX2F1dG8iLCJyZWdpc3RlclN0b3JlIiwib2siLCJiZWdpblVwZGF0ZSIsImJhdGNoU2l6ZSIsInJlc2V0IiwicGF1c2VPYnNlcnZlcnMiLCJtc2ciLCJtb25nb0lkIiwiTW9uZ29JRCIsImlkUGFyc2UiLCJyZXBsYWNlIiwiJHVuc2V0IiwiJHNldCIsImVuZFVwZGF0ZSIsInJlc3VtZU9ic2VydmVycyIsInNhdmVPcmlnaW5hbHMiLCJyZXRyaWV2ZU9yaWdpbmFscyIsImdldERvYyIsIl9nZXRDb2xsZWN0aW9uIiwid2FybiIsImxvZyIsIl9nZXRGaW5kU2VsZWN0b3IiLCJfZ2V0RmluZE9wdGlvbnMiLCJNYXRjaCIsIk9wdGlvbmFsIiwiT2JqZWN0SW5jbHVkaW5nIiwiT25lT2YiLCJOdW1iZXIiLCJmYWxsYmFja0lkIiwiX3NlbGVjdG9ySXNJZCIsImdldFByb3RvdHlwZU9mIiwiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyIsImdlbmVyYXRlSWQiLCJfaXNSZW1vdGVDb2xsZWN0aW9uIiwiZW5jbG9zaW5nIiwiX0N1cnJlbnRNZXRob2RJbnZvY2F0aW9uIiwiY2hvb3NlUmV0dXJuVmFsdWVGcm9tQ29sbGVjdGlvblJlc3VsdCIsIndyYXBDYWxsYmFjayIsIl9jYWxsTXV0YXRvck1ldGhvZCIsIm9wdGlvbnNBbmRDYWxsYmFjayIsInBvcENhbGxiYWNrRnJvbUFyZ3MiLCJyYXdEYXRhYmFzZSIsImNvbnZlcnRSZXN1bHQiLCJBbGxvd0RlbnkiLCJDb2xsZWN0aW9uUHJvdG90eXBlIiwic2V0Q29ubmVjdGlvbk9wdGlvbnMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxNQUFJQSxVQUFKO0FBQWVDLFNBQU8sQ0FBQ0MsSUFBUixDQUFhLGtCQUFiLEVBQWdDO0FBQUNGLGNBQVUsQ0FBQ0csQ0FBRCxFQUFHO0FBQUNILGdCQUFVLEdBQUNHLENBQVg7QUFBYTs7QUFBNUIsR0FBaEMsRUFBOEQsQ0FBOUQ7O0FBQWY7Ozs7Ozs7O0FBU0EsTUFBSUMsT0FBTyxHQUFHQyxnQkFBZDs7QUFDQSxNQUFJQyxNQUFNLEdBQUdDLEdBQUcsQ0FBQ0MsT0FBSixDQUFZLGVBQVosQ0FBYjs7QUFHQUMsZ0JB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Q2dMLFVBQTFCLEMsQ0FFQTs7QUFDQXJKLFFBQU0sQ0FBQ0MsTUFBUCxDQUNFaUIsTUFBTSxDQUFDbUksVUFBUCxDQUFrQjVMLFNBRHBCLEVBRUVrckIsU0FBUyxDQUFDQyxtQkFGWjs7QUFLQSxXQUFTSixtQkFBVCxDQUE2Qm5RLElBQTdCLEVBQW1DO0FBQ2pDO0FBQ0E7QUFDQSxRQUFJQSxJQUFJLENBQUM1USxNQUFMLEtBQ0M0USxJQUFJLENBQUNBLElBQUksQ0FBQzVRLE1BQUwsR0FBYyxDQUFmLENBQUosS0FBMEI1SSxTQUExQixJQUNBd1osSUFBSSxDQUFDQSxJQUFJLENBQUM1USxNQUFMLEdBQWMsQ0FBZixDQUFKLFlBQWlDeEIsUUFGbEMsQ0FBSixFQUVpRDtBQUMvQyxhQUFPb1MsSUFBSSxDQUFDbkMsR0FBTCxFQUFQO0FBQ0Q7QUFDRjs7Ozs7Ozs7Ozs7O0FDendCRDs7Ozs7O0FBTUE3WCxLQUFLLENBQUN3cUIsb0JBQU4sR0FBNkIsU0FBU0Esb0JBQVQsQ0FBK0JucEIsT0FBL0IsRUFBd0M7QUFDbkU0WixPQUFLLENBQUM1WixPQUFELEVBQVVNLE1BQVYsQ0FBTDtBQUNBM0IsT0FBSyxDQUFDa0Msa0JBQU4sR0FBMkJiLE9BQTNCO0FBQ0QsQ0FIRCxDIiwiZmlsZSI6Ii9wYWNrYWdlcy9tb25nby5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogUHJvdmlkZSBhIHN5bmNocm9ub3VzIENvbGxlY3Rpb24gQVBJIHVzaW5nIGZpYmVycywgYmFja2VkIGJ5XG4gKiBNb25nb0RCLiAgVGhpcyBpcyBvbmx5IGZvciB1c2Ugb24gdGhlIHNlcnZlciwgYW5kIG1vc3RseSBpZGVudGljYWxcbiAqIHRvIHRoZSBjbGllbnQgQVBJLlxuICpcbiAqIE5PVEU6IHRoZSBwdWJsaWMgQVBJIG1ldGhvZHMgbXVzdCBiZSBydW4gd2l0aGluIGEgZmliZXIuIElmIHlvdSBjYWxsXG4gKiB0aGVzZSBvdXRzaWRlIG9mIGEgZmliZXIgdGhleSB3aWxsIGV4cGxvZGUhXG4gKi9cblxudmFyIE1vbmdvREIgPSBOcG1Nb2R1bGVNb25nb2RiO1xudmFyIEZ1dHVyZSA9IE5wbS5yZXF1aXJlKCdmaWJlcnMvZnV0dXJlJyk7XG5pbXBvcnQgeyBEb2NGZXRjaGVyIH0gZnJvbSBcIi4vZG9jX2ZldGNoZXIuanNcIjtcblxuTW9uZ29JbnRlcm5hbHMgPSB7fTtcblxuTW9uZ29JbnRlcm5hbHMuTnBtTW9kdWxlcyA9IHtcbiAgbW9uZ29kYjoge1xuICAgIHZlcnNpb246IE5wbU1vZHVsZU1vbmdvZGJWZXJzaW9uLFxuICAgIG1vZHVsZTogTW9uZ29EQlxuICB9XG59O1xuXG4vLyBPbGRlciB2ZXJzaW9uIG9mIHdoYXQgaXMgbm93IGF2YWlsYWJsZSB2aWFcbi8vIE1vbmdvSW50ZXJuYWxzLk5wbU1vZHVsZXMubW9uZ29kYi5tb2R1bGUuICBJdCB3YXMgbmV2ZXIgZG9jdW1lbnRlZCwgYnV0XG4vLyBwZW9wbGUgZG8gdXNlIGl0LlxuLy8gWFhYIENPTVBBVCBXSVRIIDEuMC4zLjJcbk1vbmdvSW50ZXJuYWxzLk5wbU1vZHVsZSA9IE1vbmdvREI7XG5cbi8vIFRoaXMgaXMgdXNlZCB0byBhZGQgb3IgcmVtb3ZlIEVKU09OIGZyb20gdGhlIGJlZ2lubmluZyBvZiBldmVyeXRoaW5nIG5lc3RlZFxuLy8gaW5zaWRlIGFuIEVKU09OIGN1c3RvbSB0eXBlLiBJdCBzaG91bGQgb25seSBiZSBjYWxsZWQgb24gcHVyZSBKU09OIVxudmFyIHJlcGxhY2VOYW1lcyA9IGZ1bmN0aW9uIChmaWx0ZXIsIHRoaW5nKSB7XG4gIGlmICh0eXBlb2YgdGhpbmcgPT09IFwib2JqZWN0XCIgJiYgdGhpbmcgIT09IG51bGwpIHtcbiAgICBpZiAoXy5pc0FycmF5KHRoaW5nKSkge1xuICAgICAgcmV0dXJuIF8ubWFwKHRoaW5nLCBfLmJpbmQocmVwbGFjZU5hbWVzLCBudWxsLCBmaWx0ZXIpKTtcbiAgICB9XG4gICAgdmFyIHJldCA9IHt9O1xuICAgIF8uZWFjaCh0aGluZywgZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcbiAgICAgIHJldFtmaWx0ZXIoa2V5KV0gPSByZXBsYWNlTmFtZXMoZmlsdGVyLCB2YWx1ZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJldDtcbiAgfVxuICByZXR1cm4gdGhpbmc7XG59O1xuXG4vLyBFbnN1cmUgdGhhdCBFSlNPTi5jbG9uZSBrZWVwcyBhIFRpbWVzdGFtcCBhcyBhIFRpbWVzdGFtcCAoaW5zdGVhZCBvZiBqdXN0XG4vLyBkb2luZyBhIHN0cnVjdHVyYWwgY2xvbmUpLlxuLy8gWFhYIGhvdyBvayBpcyB0aGlzPyB3aGF0IGlmIHRoZXJlIGFyZSBtdWx0aXBsZSBjb3BpZXMgb2YgTW9uZ29EQiBsb2FkZWQ/XG5Nb25nb0RCLlRpbWVzdGFtcC5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbiAoKSB7XG4gIC8vIFRpbWVzdGFtcHMgc2hvdWxkIGJlIGltbXV0YWJsZS5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG52YXIgbWFrZU1vbmdvTGVnYWwgPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gXCJFSlNPTlwiICsgbmFtZTsgfTtcbnZhciB1bm1ha2VNb25nb0xlZ2FsID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIG5hbWUuc3Vic3RyKDUpOyB9O1xuXG52YXIgcmVwbGFjZU1vbmdvQXRvbVdpdGhNZXRlb3IgPSBmdW5jdGlvbiAoZG9jdW1lbnQpIHtcbiAgaWYgKGRvY3VtZW50IGluc3RhbmNlb2YgTW9uZ29EQi5CaW5hcnkpIHtcbiAgICB2YXIgYnVmZmVyID0gZG9jdW1lbnQudmFsdWUodHJ1ZSk7XG4gICAgcmV0dXJuIG5ldyBVaW50OEFycmF5KGJ1ZmZlcik7XG4gIH1cbiAgaWYgKGRvY3VtZW50IGluc3RhbmNlb2YgTW9uZ29EQi5PYmplY3RJRCkge1xuICAgIHJldHVybiBuZXcgTW9uZ28uT2JqZWN0SUQoZG9jdW1lbnQudG9IZXhTdHJpbmcoKSk7XG4gIH1cbiAgaWYgKGRvY3VtZW50IGluc3RhbmNlb2YgTW9uZ29EQi5EZWNpbWFsMTI4KSB7XG4gICAgcmV0dXJuIERlY2ltYWwoZG9jdW1lbnQudG9TdHJpbmcoKSk7XG4gIH1cbiAgaWYgKGRvY3VtZW50W1wiRUpTT04kdHlwZVwiXSAmJiBkb2N1bWVudFtcIkVKU09OJHZhbHVlXCJdICYmIF8uc2l6ZShkb2N1bWVudCkgPT09IDIpIHtcbiAgICByZXR1cm4gRUpTT04uZnJvbUpTT05WYWx1ZShyZXBsYWNlTmFtZXModW5tYWtlTW9uZ29MZWdhbCwgZG9jdW1lbnQpKTtcbiAgfVxuICBpZiAoZG9jdW1lbnQgaW5zdGFuY2VvZiBNb25nb0RCLlRpbWVzdGFtcCkge1xuICAgIC8vIEZvciBub3csIHRoZSBNZXRlb3IgcmVwcmVzZW50YXRpb24gb2YgYSBNb25nbyB0aW1lc3RhbXAgdHlwZSAobm90IGEgZGF0ZSFcbiAgICAvLyB0aGlzIGlzIGEgd2VpcmQgaW50ZXJuYWwgdGhpbmcgdXNlZCBpbiB0aGUgb3Bsb2chKSBpcyB0aGUgc2FtZSBhcyB0aGVcbiAgICAvLyBNb25nbyByZXByZXNlbnRhdGlvbi4gV2UgbmVlZCB0byBkbyB0aGlzIGV4cGxpY2l0bHkgb3IgZWxzZSB3ZSB3b3VsZCBkbyBhXG4gICAgLy8gc3RydWN0dXJhbCBjbG9uZSBhbmQgbG9zZSB0aGUgcHJvdG90eXBlLlxuICAgIHJldHVybiBkb2N1bWVudDtcbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufTtcblxudmFyIHJlcGxhY2VNZXRlb3JBdG9tV2l0aE1vbmdvID0gZnVuY3Rpb24gKGRvY3VtZW50KSB7XG4gIGlmIChFSlNPTi5pc0JpbmFyeShkb2N1bWVudCkpIHtcbiAgICAvLyBUaGlzIGRvZXMgbW9yZSBjb3BpZXMgdGhhbiB3ZSdkIGxpa2UsIGJ1dCBpcyBuZWNlc3NhcnkgYmVjYXVzZVxuICAgIC8vIE1vbmdvREIuQlNPTiBvbmx5IGxvb2tzIGxpa2UgaXQgdGFrZXMgYSBVaW50OEFycmF5IChhbmQgZG9lc24ndCBhY3R1YWxseVxuICAgIC8vIHNlcmlhbGl6ZSBpdCBjb3JyZWN0bHkpLlxuICAgIC8vIHJldHVybiBuZXcgTW9uZ29EQi5CaW5hcnkoQnVmZmVyLmZyb20oZG9jdW1lbnQpKTtcbiAgfVxuICBpZiAoZG9jdW1lbnQgaW5zdGFuY2VvZiBNb25nby5PYmplY3RJRCkge1xuICAgIHJldHVybiBuZXcgTW9uZ29EQi5PYmplY3RJRChkb2N1bWVudC50b0hleFN0cmluZygpKTtcbiAgfVxuICBpZiAoZG9jdW1lbnQgaW5zdGFuY2VvZiBNb25nb0RCLlRpbWVzdGFtcCkge1xuICAgIC8vIEZvciBub3csIHRoZSBNZXRlb3IgcmVwcmVzZW50YXRpb24gb2YgYSBNb25nbyB0aW1lc3RhbXAgdHlwZSAobm90IGEgZGF0ZSFcbiAgICAvLyB0aGlzIGlzIGEgd2VpcmQgaW50ZXJuYWwgdGhpbmcgdXNlZCBpbiB0aGUgb3Bsb2chKSBpcyB0aGUgc2FtZSBhcyB0aGVcbiAgICAvLyBNb25nbyByZXByZXNlbnRhdGlvbi4gV2UgbmVlZCB0byBkbyB0aGlzIGV4cGxpY2l0bHkgb3IgZWxzZSB3ZSB3b3VsZCBkbyBhXG4gICAgLy8gc3RydWN0dXJhbCBjbG9uZSBhbmQgbG9zZSB0aGUgcHJvdG90eXBlLlxuICAgIHJldHVybiBkb2N1bWVudDtcbiAgfVxuICBpZiAoZG9jdW1lbnQgaW5zdGFuY2VvZiBEZWNpbWFsKSB7XG4gICAgcmV0dXJuIE1vbmdvREIuRGVjaW1hbDEyOC5mcm9tU3RyaW5nKGRvY3VtZW50LnRvU3RyaW5nKCkpO1xuICB9XG4gIGlmIChFSlNPTi5faXNDdXN0b21UeXBlKGRvY3VtZW50KSkge1xuICAgIHJldHVybiByZXBsYWNlTmFtZXMobWFrZU1vbmdvTGVnYWwsIEVKU09OLnRvSlNPTlZhbHVlKGRvY3VtZW50KSk7XG4gIH1cbiAgLy8gSXQgaXMgbm90IG9yZGluYXJpbHkgcG9zc2libGUgdG8gc3RpY2sgZG9sbGFyLXNpZ24ga2V5cyBpbnRvIG1vbmdvXG4gIC8vIHNvIHdlIGRvbid0IGJvdGhlciBjaGVja2luZyBmb3IgdGhpbmdzIHRoYXQgbmVlZCBlc2NhcGluZyBhdCB0aGlzIHRpbWUuXG4gIHJldHVybiB1bmRlZmluZWQ7XG59O1xuXG52YXIgcmVwbGFjZVR5cGVzID0gZnVuY3Rpb24gKGRvY3VtZW50LCBhdG9tVHJhbnNmb3JtZXIpIHtcbiAgaWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gJ29iamVjdCcgfHwgZG9jdW1lbnQgPT09IG51bGwpXG4gICAgcmV0dXJuIGRvY3VtZW50O1xuXG4gIHZhciByZXBsYWNlZFRvcExldmVsQXRvbSA9IGF0b21UcmFuc2Zvcm1lcihkb2N1bWVudCk7XG4gIGlmIChyZXBsYWNlZFRvcExldmVsQXRvbSAhPT0gdW5kZWZpbmVkKVxuICAgIHJldHVybiByZXBsYWNlZFRvcExldmVsQXRvbTtcblxuICB2YXIgcmV0ID0gZG9jdW1lbnQ7XG4gIF8uZWFjaChkb2N1bWVudCwgZnVuY3Rpb24gKHZhbCwga2V5KSB7XG4gICAgdmFyIHZhbFJlcGxhY2VkID0gcmVwbGFjZVR5cGVzKHZhbCwgYXRvbVRyYW5zZm9ybWVyKTtcbiAgICBpZiAodmFsICE9PSB2YWxSZXBsYWNlZCkge1xuICAgICAgLy8gTGF6eSBjbG9uZS4gU2hhbGxvdyBjb3B5LlxuICAgICAgaWYgKHJldCA9PT0gZG9jdW1lbnQpXG4gICAgICAgIHJldCA9IF8uY2xvbmUoZG9jdW1lbnQpO1xuICAgICAgcmV0W2tleV0gPSB2YWxSZXBsYWNlZDtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gcmV0O1xufTtcblxuXG5Nb25nb0Nvbm5lY3Rpb24gPSBmdW5jdGlvbiAodXJsLCBvcHRpb25zKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIHNlbGYuX29ic2VydmVNdWx0aXBsZXhlcnMgPSB7fTtcbiAgc2VsZi5fb25GYWlsb3Zlckhvb2sgPSBuZXcgSG9vaztcblxuICB2YXIgbW9uZ29PcHRpb25zID0gT2JqZWN0LmFzc2lnbih7XG4gICAgLy8gUmVjb25uZWN0IG9uIGVycm9yLlxuICAgIGF1dG9SZWNvbm5lY3Q6IHRydWUsXG4gICAgLy8gVHJ5IHRvIHJlY29ubmVjdCBmb3JldmVyLCBpbnN0ZWFkIG9mIHN0b3BwaW5nIGFmdGVyIDMwIHRyaWVzICh0aGVcbiAgICAvLyBkZWZhdWx0KSwgd2l0aCBlYWNoIGF0dGVtcHQgc2VwYXJhdGVkIGJ5IDEwMDBtcy5cbiAgICByZWNvbm5lY3RUcmllczogSW5maW5pdHksXG4gICAgaWdub3JlVW5kZWZpbmVkOiB0cnVlLFxuICAgIC8vIFJlcXVpcmVkIHRvIHNpbGVuY2UgZGVwcmVjYXRpb24gd2FybmluZ3Mgd2l0aCBtb25nb2RiQDMuMS4xLlxuICAgIHVzZU5ld1VybFBhcnNlcjogdHJ1ZSxcbiAgfSwgTW9uZ28uX2Nvbm5lY3Rpb25PcHRpb25zKTtcblxuICAvLyBEaXNhYmxlIHRoZSBuYXRpdmUgcGFyc2VyIGJ5IGRlZmF1bHQsIHVubGVzcyBzcGVjaWZpY2FsbHkgZW5hYmxlZFxuICAvLyBpbiB0aGUgbW9uZ28gVVJMLlxuICAvLyAtIFRoZSBuYXRpdmUgZHJpdmVyIGNhbiBjYXVzZSBlcnJvcnMgd2hpY2ggbm9ybWFsbHkgd291bGQgYmVcbiAgLy8gICB0aHJvd24sIGNhdWdodCwgYW5kIGhhbmRsZWQgaW50byBzZWdmYXVsdHMgdGhhdCB0YWtlIGRvd24gdGhlXG4gIC8vICAgd2hvbGUgYXBwLlxuICAvLyAtIEJpbmFyeSBtb2R1bGVzIGRvbid0IHlldCB3b3JrIHdoZW4geW91IGJ1bmRsZSBhbmQgbW92ZSB0aGUgYnVuZGxlXG4gIC8vICAgdG8gYSBkaWZmZXJlbnQgcGxhdGZvcm0gKGFrYSBkZXBsb3kpXG4gIC8vIFdlIHNob3VsZCByZXZpc2l0IHRoaXMgYWZ0ZXIgYmluYXJ5IG5wbSBtb2R1bGUgc3VwcG9ydCBsYW5kcy5cbiAgaWYgKCEoL1tcXD8mXW5hdGl2ZV8/W3BQXWFyc2VyPS8udGVzdCh1cmwpKSkge1xuICAgIG1vbmdvT3B0aW9ucy5uYXRpdmVfcGFyc2VyID0gZmFsc2U7XG4gIH1cblxuICAvLyBJbnRlcm5hbGx5IHRoZSBvcGxvZyBjb25uZWN0aW9ucyBzcGVjaWZ5IHRoZWlyIG93biBwb29sU2l6ZVxuICAvLyB3aGljaCB3ZSBkb24ndCB3YW50IHRvIG92ZXJ3cml0ZSB3aXRoIGFueSB1c2VyIGRlZmluZWQgdmFsdWVcbiAgaWYgKF8uaGFzKG9wdGlvbnMsICdwb29sU2l6ZScpKSB7XG4gICAgLy8gSWYgd2UganVzdCBzZXQgdGhpcyBmb3IgXCJzZXJ2ZXJcIiwgcmVwbFNldCB3aWxsIG92ZXJyaWRlIGl0LiBJZiB3ZSBqdXN0XG4gICAgLy8gc2V0IGl0IGZvciByZXBsU2V0LCBpdCB3aWxsIGJlIGlnbm9yZWQgaWYgd2UncmUgbm90IHVzaW5nIGEgcmVwbFNldC5cbiAgICBtb25nb09wdGlvbnMucG9vbFNpemUgPSBvcHRpb25zLnBvb2xTaXplO1xuICB9XG5cbiAgc2VsZi5kYiA9IG51bGw7XG4gIC8vIFdlIGtlZXAgdHJhY2sgb2YgdGhlIFJlcGxTZXQncyBwcmltYXJ5LCBzbyB0aGF0IHdlIGNhbiB0cmlnZ2VyIGhvb2tzIHdoZW5cbiAgLy8gaXQgY2hhbmdlcy4gIFRoZSBOb2RlIGRyaXZlcidzIGpvaW5lZCBjYWxsYmFjayBzZWVtcyB0byBmaXJlIHdheSB0b29cbiAgLy8gb2Z0ZW4sIHdoaWNoIGlzIHdoeSB3ZSBuZWVkIHRvIHRyYWNrIGl0IG91cnNlbHZlcy5cbiAgc2VsZi5fcHJpbWFyeSA9IG51bGw7XG4gIHNlbGYuX29wbG9nSGFuZGxlID0gbnVsbDtcbiAgc2VsZi5fZG9jRmV0Y2hlciA9IG51bGw7XG5cblxuICB2YXIgY29ubmVjdEZ1dHVyZSA9IG5ldyBGdXR1cmU7XG4gIE1vbmdvREIuY29ubmVjdChcbiAgICB1cmwsXG4gICAgbW9uZ29PcHRpb25zLFxuICAgIE1ldGVvci5iaW5kRW52aXJvbm1lbnQoXG4gICAgICBmdW5jdGlvbiAoZXJyLCBjbGllbnQpIHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBkYiA9IGNsaWVudC5kYigpO1xuXG4gICAgICAgIC8vIEZpcnN0LCBmaWd1cmUgb3V0IHdoYXQgdGhlIGN1cnJlbnQgcHJpbWFyeSBpcywgaWYgYW55LlxuICAgICAgICBpZiAoZGIuc2VydmVyQ29uZmlnLmlzTWFzdGVyRG9jKSB7XG4gICAgICAgICAgc2VsZi5fcHJpbWFyeSA9IGRiLnNlcnZlckNvbmZpZy5pc01hc3RlckRvYy5wcmltYXJ5O1xuICAgICAgICB9XG5cbiAgICAgICAgZGIuc2VydmVyQ29uZmlnLm9uKFxuICAgICAgICAgICdqb2luZWQnLCBNZXRlb3IuYmluZEVudmlyb25tZW50KGZ1bmN0aW9uIChraW5kLCBkb2MpIHtcbiAgICAgICAgICAgIGlmIChraW5kID09PSAncHJpbWFyeScpIHtcbiAgICAgICAgICAgICAgaWYgKGRvYy5wcmltYXJ5ICE9PSBzZWxmLl9wcmltYXJ5KSB7XG4gICAgICAgICAgICAgICAgc2VsZi5fcHJpbWFyeSA9IGRvYy5wcmltYXJ5O1xuICAgICAgICAgICAgICAgIHNlbGYuX29uRmFpbG92ZXJIb29rLmVhY2goZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZG9jLm1lID09PSBzZWxmLl9wcmltYXJ5KSB7XG4gICAgICAgICAgICAgIC8vIFRoZSB0aGluZyB3ZSB0aG91Z2h0IHdhcyBwcmltYXJ5IGlzIG5vdyBzb21ldGhpbmcgb3RoZXIgdGhhblxuICAgICAgICAgICAgICAvLyBwcmltYXJ5LiAgRm9yZ2V0IHRoYXQgd2UgdGhvdWdodCBpdCB3YXMgcHJpbWFyeS4gIChUaGlzIG1lYW5zXG4gICAgICAgICAgICAgIC8vIHRoYXQgaWYgYSBzZXJ2ZXIgc3RvcHMgYmVpbmcgcHJpbWFyeSBhbmQgdGhlbiBzdGFydHMgYmVpbmdcbiAgICAgICAgICAgICAgLy8gcHJpbWFyeSBhZ2FpbiB3aXRob3V0IGFub3RoZXIgc2VydmVyIGJlY29taW5nIHByaW1hcnkgaW4gdGhlXG4gICAgICAgICAgICAgIC8vIG1pZGRsZSwgd2UnbGwgY29ycmVjdGx5IGNvdW50IGl0IGFzIGEgZmFpbG92ZXIuKVxuICAgICAgICAgICAgICBzZWxmLl9wcmltYXJ5ID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KSk7XG5cbiAgICAgICAgLy8gQWxsb3cgdGhlIGNvbnN0cnVjdG9yIHRvIHJldHVybi5cbiAgICAgICAgY29ubmVjdEZ1dHVyZVsncmV0dXJuJ10oeyBjbGllbnQsIGRiIH0pO1xuICAgICAgfSxcbiAgICAgIGNvbm5lY3RGdXR1cmUucmVzb2x2ZXIoKSAgLy8gb25FeGNlcHRpb25cbiAgICApXG4gICk7XG5cbiAgLy8gV2FpdCBmb3IgdGhlIGNvbm5lY3Rpb24gdG8gYmUgc3VjY2Vzc2Z1bCAodGhyb3dzIG9uIGZhaWx1cmUpIGFuZCBhc3NpZ24gdGhlXG4gIC8vIHJlc3VsdHMgKGBjbGllbnRgIGFuZCBgZGJgKSB0byBgc2VsZmAuXG4gIE9iamVjdC5hc3NpZ24oc2VsZiwgY29ubmVjdEZ1dHVyZS53YWl0KCkpO1xuXG4gIGlmIChvcHRpb25zLm9wbG9nVXJsICYmICEgUGFja2FnZVsnZGlzYWJsZS1vcGxvZyddKSB7XG4gICAgc2VsZi5fb3Bsb2dIYW5kbGUgPSBuZXcgT3Bsb2dIYW5kbGUob3B0aW9ucy5vcGxvZ1VybCwgc2VsZi5kYi5kYXRhYmFzZU5hbWUpO1xuICAgIHNlbGYuX2RvY0ZldGNoZXIgPSBuZXcgRG9jRmV0Y2hlcihzZWxmKTtcbiAgfVxufTtcblxuTW9uZ29Db25uZWN0aW9uLnByb3RvdHlwZS5jbG9zZSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgaWYgKCEgc2VsZi5kYilcbiAgICB0aHJvdyBFcnJvcihcImNsb3NlIGNhbGxlZCBiZWZvcmUgQ29ubmVjdGlvbiBjcmVhdGVkP1wiKTtcblxuICAvLyBYWFggcHJvYmFibHkgdW50ZXN0ZWRcbiAgdmFyIG9wbG9nSGFuZGxlID0gc2VsZi5fb3Bsb2dIYW5kbGU7XG4gIHNlbGYuX29wbG9nSGFuZGxlID0gbnVsbDtcbiAgaWYgKG9wbG9nSGFuZGxlKVxuICAgIG9wbG9nSGFuZGxlLnN0b3AoKTtcblxuICAvLyBVc2UgRnV0dXJlLndyYXAgc28gdGhhdCBlcnJvcnMgZ2V0IHRocm93bi4gVGhpcyBoYXBwZW5zIHRvXG4gIC8vIHdvcmsgZXZlbiBvdXRzaWRlIGEgZmliZXIgc2luY2UgdGhlICdjbG9zZScgbWV0aG9kIGlzIG5vdFxuICAvLyBhY3R1YWxseSBhc3luY2hyb25vdXMuXG4gIEZ1dHVyZS53cmFwKF8uYmluZChzZWxmLmNsaWVudC5jbG9zZSwgc2VsZi5jbGllbnQpKSh0cnVlKS53YWl0KCk7XG59O1xuXG4vLyBSZXR1cm5zIHRoZSBNb25nbyBDb2xsZWN0aW9uIG9iamVjdDsgbWF5IHlpZWxkLlxuTW9uZ29Db25uZWN0aW9uLnByb3RvdHlwZS5yYXdDb2xsZWN0aW9uID0gZnVuY3Rpb24gKGNvbGxlY3Rpb25OYW1lKSB7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICBpZiAoISBzZWxmLmRiKVxuICAgIHRocm93IEVycm9yKFwicmF3Q29sbGVjdGlvbiBjYWxsZWQgYmVmb3JlIENvbm5lY3Rpb24gY3JlYXRlZD9cIik7XG5cbiAgdmFyIGZ1dHVyZSA9IG5ldyBGdXR1cmU7XG4gIHNlbGYuZGIuY29sbGVjdGlvbihjb2xsZWN0aW9uTmFtZSwgZnV0dXJlLnJlc29sdmVyKCkpO1xuICByZXR1cm4gZnV0dXJlLndhaXQoKTtcbn07XG5cbk1vbmdvQ29ubmVjdGlvbi5wcm90b3R5cGUuX2NyZWF0ZUNhcHBlZENvbGxlY3Rpb24gPSBmdW5jdGlvbiAoXG4gICAgY29sbGVjdGlvbk5hbWUsIGJ5dGVTaXplLCBtYXhEb2N1bWVudHMpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIGlmICghIHNlbGYuZGIpXG4gICAgdGhyb3cgRXJyb3IoXCJfY3JlYXRlQ2FwcGVkQ29sbGVjdGlvbiBjYWxsZWQgYmVmb3JlIENvbm5lY3Rpb24gY3JlYXRlZD9cIik7XG5cbiAgdmFyIGZ1dHVyZSA9IG5ldyBGdXR1cmUoKTtcbiAgc2VsZi5kYi5jcmVhdGVDb2xsZWN0aW9uKFxuICAgIGNvbGxlY3Rpb25OYW1lLFxuICAgIHsgY2FwcGVkOiB0cnVlLCBzaXplOiBieXRlU2l6ZSwgbWF4OiBtYXhEb2N1bWVudHMgfSxcbiAgICBmdXR1cmUucmVzb2x2ZXIoKSk7XG4gIGZ1dHVyZS53YWl0KCk7XG59O1xuXG4vLyBUaGlzIHNob3VsZCBiZSBjYWxsZWQgc3luY2hyb25vdXNseSB3aXRoIGEgd3JpdGUsIHRvIGNyZWF0ZSBhXG4vLyB0cmFuc2FjdGlvbiBvbiB0aGUgY3VycmVudCB3cml0ZSBmZW5jZSwgaWYgYW55LiBBZnRlciB3ZSBjYW4gcmVhZFxuLy8gdGhlIHdyaXRlLCBhbmQgYWZ0ZXIgb2JzZXJ2ZXJzIGhhdmUgYmVlbiBub3RpZmllZCAob3IgYXQgbGVhc3QsXG4vLyBhZnRlciB0aGUgb2JzZXJ2ZXIgbm90aWZpZXJzIGhhdmUgYWRkZWQgdGhlbXNlbHZlcyB0byB0aGUgd3JpdGVcbi8vIGZlbmNlKSwgeW91IHNob3VsZCBjYWxsICdjb21taXR0ZWQoKScgb24gdGhlIG9iamVjdCByZXR1cm5lZC5cbk1vbmdvQ29ubmVjdGlvbi5wcm90b3R5cGUuX21heWJlQmVnaW5Xcml0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGZlbmNlID0gRERQU2VydmVyLl9DdXJyZW50V3JpdGVGZW5jZS5nZXQoKTtcbiAgaWYgKGZlbmNlKSB7XG4gICAgcmV0dXJuIGZlbmNlLmJlZ2luV3JpdGUoKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4ge2NvbW1pdHRlZDogZnVuY3Rpb24gKCkge319O1xuICB9XG59O1xuXG4vLyBJbnRlcm5hbCBpbnRlcmZhY2U6IGFkZHMgYSBjYWxsYmFjayB3aGljaCBpcyBjYWxsZWQgd2hlbiB0aGUgTW9uZ28gcHJpbWFyeVxuLy8gY2hhbmdlcy4gUmV0dXJucyBhIHN0b3AgaGFuZGxlLlxuTW9uZ29Db25uZWN0aW9uLnByb3RvdHlwZS5fb25GYWlsb3ZlciA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICByZXR1cm4gdGhpcy5fb25GYWlsb3Zlckhvb2sucmVnaXN0ZXIoY2FsbGJhY2spO1xufTtcblxuXG4vLy8vLy8vLy8vLy8gUHVibGljIEFQSSAvLy8vLy8vLy8vXG5cbi8vIFRoZSB3cml0ZSBtZXRob2RzIGJsb2NrIHVudGlsIHRoZSBkYXRhYmFzZSBoYXMgY29uZmlybWVkIHRoZSB3cml0ZSAoaXQgbWF5XG4vLyBub3QgYmUgcmVwbGljYXRlZCBvciBzdGFibGUgb24gZGlzaywgYnV0IG9uZSBzZXJ2ZXIgaGFzIGNvbmZpcm1lZCBpdCkgaWYgbm9cbi8vIGNhbGxiYWNrIGlzIHByb3ZpZGVkLiBJZiBhIGNhbGxiYWNrIGlzIHByb3ZpZGVkLCB0aGVuIHRoZXkgY2FsbCB0aGUgY2FsbGJhY2tcbi8vIHdoZW4gdGhlIHdyaXRlIGlzIGNvbmZpcm1lZC4gVGhleSByZXR1cm4gbm90aGluZyBvbiBzdWNjZXNzLCBhbmQgcmFpc2UgYW5cbi8vIGV4Y2VwdGlvbiBvbiBmYWlsdXJlLlxuLy9cbi8vIEFmdGVyIG1ha2luZyBhIHdyaXRlICh3aXRoIGluc2VydCwgdXBkYXRlLCByZW1vdmUpLCBvYnNlcnZlcnMgYXJlXG4vLyBub3RpZmllZCBhc3luY2hyb25vdXNseS4gSWYgeW91IHdhbnQgdG8gcmVjZWl2ZSBhIGNhbGxiYWNrIG9uY2UgYWxsXG4vLyBvZiB0aGUgb2JzZXJ2ZXIgbm90aWZpY2F0aW9ucyBoYXZlIGxhbmRlZCBmb3IgeW91ciB3cml0ZSwgZG8gdGhlXG4vLyB3cml0ZXMgaW5zaWRlIGEgd3JpdGUgZmVuY2UgKHNldCBERFBTZXJ2ZXIuX0N1cnJlbnRXcml0ZUZlbmNlIHRvIGEgbmV3XG4vLyBfV3JpdGVGZW5jZSwgYW5kIHRoZW4gc2V0IGEgY2FsbGJhY2sgb24gdGhlIHdyaXRlIGZlbmNlLilcbi8vXG4vLyBTaW5jZSBvdXIgZXhlY3V0aW9uIGVudmlyb25tZW50IGlzIHNpbmdsZS10aHJlYWRlZCwgdGhpcyBpc1xuLy8gd2VsbC1kZWZpbmVkIC0tIGEgd3JpdGUgXCJoYXMgYmVlbiBtYWRlXCIgaWYgaXQncyByZXR1cm5lZCwgYW5kIGFuXG4vLyBvYnNlcnZlciBcImhhcyBiZWVuIG5vdGlmaWVkXCIgaWYgaXRzIGNhbGxiYWNrIGhhcyByZXR1cm5lZC5cblxudmFyIHdyaXRlQ2FsbGJhY2sgPSBmdW5jdGlvbiAod3JpdGUsIHJlZnJlc2gsIGNhbGxiYWNrKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoZXJyLCByZXN1bHQpIHtcbiAgICBpZiAoISBlcnIpIHtcbiAgICAgIC8vIFhYWCBXZSBkb24ndCBoYXZlIHRvIHJ1biB0aGlzIG9uIGVycm9yLCByaWdodD9cbiAgICAgIHRyeSB7XG4gICAgICAgIHJlZnJlc2goKTtcbiAgICAgIH0gY2F0Y2ggKHJlZnJlc2hFcnIpIHtcbiAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgY2FsbGJhY2socmVmcmVzaEVycik7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IHJlZnJlc2hFcnI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgd3JpdGUuY29tbWl0dGVkKCk7XG4gICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICBjYWxsYmFjayhlcnIsIHJlc3VsdCk7XG4gICAgfSBlbHNlIGlmIChlcnIpIHtcbiAgICAgIHRocm93IGVycjtcbiAgICB9XG4gIH07XG59O1xuXG52YXIgYmluZEVudmlyb25tZW50Rm9yV3JpdGUgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgcmV0dXJuIE1ldGVvci5iaW5kRW52aXJvbm1lbnQoY2FsbGJhY2ssIFwiTW9uZ28gd3JpdGVcIik7XG59O1xuXG5Nb25nb0Nvbm5lY3Rpb24ucHJvdG90eXBlLl9pbnNlcnQgPSBmdW5jdGlvbiAoY29sbGVjdGlvbl9uYW1lLCBkb2N1bWVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjaykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgdmFyIHNlbmRFcnJvciA9IGZ1bmN0aW9uIChlKSB7XG4gICAgaWYgKGNhbGxiYWNrKVxuICAgICAgcmV0dXJuIGNhbGxiYWNrKGUpO1xuICAgIHRocm93IGU7XG4gIH07XG5cbiAgaWYgKGNvbGxlY3Rpb25fbmFtZSA9PT0gXCJfX19tZXRlb3JfZmFpbHVyZV90ZXN0X2NvbGxlY3Rpb25cIikge1xuICAgIHZhciBlID0gbmV3IEVycm9yKFwiRmFpbHVyZSB0ZXN0XCIpO1xuICAgIGUuX2V4cGVjdGVkQnlUZXN0ID0gdHJ1ZTtcbiAgICBzZW5kRXJyb3IoZSk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKCEoTG9jYWxDb2xsZWN0aW9uLl9pc1BsYWluT2JqZWN0KGRvY3VtZW50KSAmJlxuICAgICAgICAhRUpTT04uX2lzQ3VzdG9tVHlwZShkb2N1bWVudCkpKSB7XG4gICAgc2VuZEVycm9yKG5ldyBFcnJvcihcbiAgICAgIFwiT25seSBwbGFpbiBvYmplY3RzIG1heSBiZSBpbnNlcnRlZCBpbnRvIE1vbmdvREJcIikpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciB3cml0ZSA9IHNlbGYuX21heWJlQmVnaW5Xcml0ZSgpO1xuICB2YXIgcmVmcmVzaCA9IGZ1bmN0aW9uICgpIHtcbiAgICBNZXRlb3IucmVmcmVzaCh7Y29sbGVjdGlvbjogY29sbGVjdGlvbl9uYW1lLCBpZDogZG9jdW1lbnQuX2lkIH0pO1xuICB9O1xuICBjYWxsYmFjayA9IGJpbmRFbnZpcm9ubWVudEZvcldyaXRlKHdyaXRlQ2FsbGJhY2sod3JpdGUsIHJlZnJlc2gsIGNhbGxiYWNrKSk7XG4gIHRyeSB7XG4gICAgdmFyIGNvbGxlY3Rpb24gPSBzZWxmLnJhd0NvbGxlY3Rpb24oY29sbGVjdGlvbl9uYW1lKTtcbiAgICBjb2xsZWN0aW9uLmluc2VydChyZXBsYWNlVHlwZXMoZG9jdW1lbnQsIHJlcGxhY2VNZXRlb3JBdG9tV2l0aE1vbmdvKSxcbiAgICAgICAgICAgICAgICAgICAgICB7c2FmZTogdHJ1ZX0sIGNhbGxiYWNrKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgd3JpdGUuY29tbWl0dGVkKCk7XG4gICAgdGhyb3cgZXJyO1xuICB9XG59O1xuXG4vLyBDYXVzZSBxdWVyaWVzIHRoYXQgbWF5IGJlIGFmZmVjdGVkIGJ5IHRoZSBzZWxlY3RvciB0byBwb2xsIGluIHRoaXMgd3JpdGVcbi8vIGZlbmNlLlxuTW9uZ29Db25uZWN0aW9uLnByb3RvdHlwZS5fcmVmcmVzaCA9IGZ1bmN0aW9uIChjb2xsZWN0aW9uTmFtZSwgc2VsZWN0b3IpIHtcbiAgdmFyIHJlZnJlc2hLZXkgPSB7Y29sbGVjdGlvbjogY29sbGVjdGlvbk5hbWV9O1xuICAvLyBJZiB3ZSBrbm93IHdoaWNoIGRvY3VtZW50cyB3ZSdyZSByZW1vdmluZywgZG9uJ3QgcG9sbCBxdWVyaWVzIHRoYXQgYXJlXG4gIC8vIHNwZWNpZmljIHRvIG90aGVyIGRvY3VtZW50cy4gKE5vdGUgdGhhdCBtdWx0aXBsZSBub3RpZmljYXRpb25zIGhlcmUgc2hvdWxkXG4gIC8vIG5vdCBjYXVzZSBtdWx0aXBsZSBwb2xscywgc2luY2UgYWxsIG91ciBsaXN0ZW5lciBpcyBkb2luZyBpcyBlbnF1ZXVlaW5nIGFcbiAgLy8gcG9sbC4pXG4gIHZhciBzcGVjaWZpY0lkcyA9IExvY2FsQ29sbGVjdGlvbi5faWRzTWF0Y2hlZEJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuICBpZiAoc3BlY2lmaWNJZHMpIHtcbiAgICBfLmVhY2goc3BlY2lmaWNJZHMsIGZ1bmN0aW9uIChpZCkge1xuICAgICAgTWV0ZW9yLnJlZnJlc2goXy5leHRlbmQoe2lkOiBpZH0sIHJlZnJlc2hLZXkpKTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBNZXRlb3IucmVmcmVzaChyZWZyZXNoS2V5KTtcbiAgfVxufTtcblxuTW9uZ29Db25uZWN0aW9uLnByb3RvdHlwZS5fcmVtb3ZlID0gZnVuY3Rpb24gKGNvbGxlY3Rpb25fbmFtZSwgc2VsZWN0b3IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2spIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIGlmIChjb2xsZWN0aW9uX25hbWUgPT09IFwiX19fbWV0ZW9yX2ZhaWx1cmVfdGVzdF9jb2xsZWN0aW9uXCIpIHtcbiAgICB2YXIgZSA9IG5ldyBFcnJvcihcIkZhaWx1cmUgdGVzdFwiKTtcbiAgICBlLl9leHBlY3RlZEJ5VGVzdCA9IHRydWU7XG4gICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICByZXR1cm4gY2FsbGJhY2soZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IGU7XG4gICAgfVxuICB9XG5cbiAgdmFyIHdyaXRlID0gc2VsZi5fbWF5YmVCZWdpbldyaXRlKCk7XG4gIHZhciByZWZyZXNoID0gZnVuY3Rpb24gKCkge1xuICAgIHNlbGYuX3JlZnJlc2goY29sbGVjdGlvbl9uYW1lLCBzZWxlY3Rvcik7XG4gIH07XG4gIGNhbGxiYWNrID0gYmluZEVudmlyb25tZW50Rm9yV3JpdGUod3JpdGVDYWxsYmFjayh3cml0ZSwgcmVmcmVzaCwgY2FsbGJhY2spKTtcblxuICB0cnkge1xuICAgIHZhciBjb2xsZWN0aW9uID0gc2VsZi5yYXdDb2xsZWN0aW9uKGNvbGxlY3Rpb25fbmFtZSk7XG4gICAgdmFyIHdyYXBwZWRDYWxsYmFjayA9IGZ1bmN0aW9uKGVyciwgZHJpdmVyUmVzdWx0KSB7XG4gICAgICBjYWxsYmFjayhlcnIsIHRyYW5zZm9ybVJlc3VsdChkcml2ZXJSZXN1bHQpLm51bWJlckFmZmVjdGVkKTtcbiAgICB9O1xuICAgIGNvbGxlY3Rpb24ucmVtb3ZlKHJlcGxhY2VUeXBlcyhzZWxlY3RvciwgcmVwbGFjZU1ldGVvckF0b21XaXRoTW9uZ28pLFxuICAgICAgICAgICAgICAgICAgICAgICB7c2FmZTogdHJ1ZX0sIHdyYXBwZWRDYWxsYmFjayk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHdyaXRlLmNvbW1pdHRlZCgpO1xuICAgIHRocm93IGVycjtcbiAgfVxufTtcblxuTW9uZ29Db25uZWN0aW9uLnByb3RvdHlwZS5fZHJvcENvbGxlY3Rpb24gPSBmdW5jdGlvbiAoY29sbGVjdGlvbk5hbWUsIGNiKSB7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICB2YXIgd3JpdGUgPSBzZWxmLl9tYXliZUJlZ2luV3JpdGUoKTtcbiAgdmFyIHJlZnJlc2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgTWV0ZW9yLnJlZnJlc2goe2NvbGxlY3Rpb246IGNvbGxlY3Rpb25OYW1lLCBpZDogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgZHJvcENvbGxlY3Rpb246IHRydWV9KTtcbiAgfTtcbiAgY2IgPSBiaW5kRW52aXJvbm1lbnRGb3JXcml0ZSh3cml0ZUNhbGxiYWNrKHdyaXRlLCByZWZyZXNoLCBjYikpO1xuXG4gIHRyeSB7XG4gICAgdmFyIGNvbGxlY3Rpb24gPSBzZWxmLnJhd0NvbGxlY3Rpb24oY29sbGVjdGlvbk5hbWUpO1xuICAgIGNvbGxlY3Rpb24uZHJvcChjYik7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICB3cml0ZS5jb21taXR0ZWQoKTtcbiAgICB0aHJvdyBlO1xuICB9XG59O1xuXG4vLyBGb3IgdGVzdGluZyBvbmx5LiAgU2xpZ2h0bHkgYmV0dGVyIHRoYW4gYGMucmF3RGF0YWJhc2UoKS5kcm9wRGF0YWJhc2UoKWBcbi8vIGJlY2F1c2UgaXQgbGV0cyB0aGUgdGVzdCdzIGZlbmNlIHdhaXQgZm9yIGl0IHRvIGJlIGNvbXBsZXRlLlxuTW9uZ29Db25uZWN0aW9uLnByb3RvdHlwZS5fZHJvcERhdGFiYXNlID0gZnVuY3Rpb24gKGNiKSB7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICB2YXIgd3JpdGUgPSBzZWxmLl9tYXliZUJlZ2luV3JpdGUoKTtcbiAgdmFyIHJlZnJlc2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgTWV0ZW9yLnJlZnJlc2goeyBkcm9wRGF0YWJhc2U6IHRydWUgfSk7XG4gIH07XG4gIGNiID0gYmluZEVudmlyb25tZW50Rm9yV3JpdGUod3JpdGVDYWxsYmFjayh3cml0ZSwgcmVmcmVzaCwgY2IpKTtcblxuICB0cnkge1xuICAgIHNlbGYuZGIuZHJvcERhdGFiYXNlKGNiKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHdyaXRlLmNvbW1pdHRlZCgpO1xuICAgIHRocm93IGU7XG4gIH1cbn07XG5cbk1vbmdvQ29ubmVjdGlvbi5wcm90b3R5cGUuX3VwZGF0ZSA9IGZ1bmN0aW9uIChjb2xsZWN0aW9uX25hbWUsIHNlbGVjdG9yLCBtb2QsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucywgY2FsbGJhY2spIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIGlmICghIGNhbGxiYWNrICYmIG9wdGlvbnMgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuICAgIGNhbGxiYWNrID0gb3B0aW9ucztcbiAgICBvcHRpb25zID0gbnVsbDtcbiAgfVxuXG4gIGlmIChjb2xsZWN0aW9uX25hbWUgPT09IFwiX19fbWV0ZW9yX2ZhaWx1cmVfdGVzdF9jb2xsZWN0aW9uXCIpIHtcbiAgICB2YXIgZSA9IG5ldyBFcnJvcihcIkZhaWx1cmUgdGVzdFwiKTtcbiAgICBlLl9leHBlY3RlZEJ5VGVzdCA9IHRydWU7XG4gICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICByZXR1cm4gY2FsbGJhY2soZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IGU7XG4gICAgfVxuICB9XG5cbiAgLy8gZXhwbGljaXQgc2FmZXR5IGNoZWNrLiBudWxsIGFuZCB1bmRlZmluZWQgY2FuIGNyYXNoIHRoZSBtb25nb1xuICAvLyBkcml2ZXIuIEFsdGhvdWdoIHRoZSBub2RlIGRyaXZlciBhbmQgbWluaW1vbmdvIGRvICdzdXBwb3J0J1xuICAvLyBub24tb2JqZWN0IG1vZGlmaWVyIGluIHRoYXQgdGhleSBkb24ndCBjcmFzaCwgdGhleSBhcmUgbm90XG4gIC8vIG1lYW5pbmdmdWwgb3BlcmF0aW9ucyBhbmQgZG8gbm90IGRvIGFueXRoaW5nLiBEZWZlbnNpdmVseSB0aHJvdyBhblxuICAvLyBlcnJvciBoZXJlLlxuICBpZiAoIW1vZCB8fCB0eXBlb2YgbW9kICE9PSAnb2JqZWN0JylcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIG1vZGlmaWVyLiBNb2RpZmllciBtdXN0IGJlIGFuIG9iamVjdC5cIik7XG5cbiAgaWYgKCEoTG9jYWxDb2xsZWN0aW9uLl9pc1BsYWluT2JqZWN0KG1vZCkgJiZcbiAgICAgICAgIUVKU09OLl9pc0N1c3RvbVR5cGUobW9kKSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBcIk9ubHkgcGxhaW4gb2JqZWN0cyBtYXkgYmUgdXNlZCBhcyByZXBsYWNlbWVudFwiICtcbiAgICAgICAgXCIgZG9jdW1lbnRzIGluIE1vbmdvREJcIik7XG4gIH1cblxuICBpZiAoIW9wdGlvbnMpIG9wdGlvbnMgPSB7fTtcblxuICB2YXIgd3JpdGUgPSBzZWxmLl9tYXliZUJlZ2luV3JpdGUoKTtcbiAgdmFyIHJlZnJlc2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgc2VsZi5fcmVmcmVzaChjb2xsZWN0aW9uX25hbWUsIHNlbGVjdG9yKTtcbiAgfTtcbiAgY2FsbGJhY2sgPSB3cml0ZUNhbGxiYWNrKHdyaXRlLCByZWZyZXNoLCBjYWxsYmFjayk7XG4gIHRyeSB7XG4gICAgdmFyIGNvbGxlY3Rpb24gPSBzZWxmLnJhd0NvbGxlY3Rpb24oY29sbGVjdGlvbl9uYW1lKTtcbiAgICB2YXIgbW9uZ29PcHRzID0ge3NhZmU6IHRydWV9O1xuICAgIC8vIGV4cGxpY3RseSBlbnVtZXJhdGUgb3B0aW9ucyB0aGF0IG1pbmltb25nbyBzdXBwb3J0c1xuICAgIGlmIChvcHRpb25zLnVwc2VydCkgbW9uZ29PcHRzLnVwc2VydCA9IHRydWU7XG4gICAgaWYgKG9wdGlvbnMubXVsdGkpIG1vbmdvT3B0cy5tdWx0aSA9IHRydWU7XG4gICAgLy8gTGV0cyB5b3UgZ2V0IGEgbW9yZSBtb3JlIGZ1bGwgcmVzdWx0IGZyb20gTW9uZ29EQi4gVXNlIHdpdGggY2F1dGlvbjpcbiAgICAvLyBtaWdodCBub3Qgd29yayB3aXRoIEMudXBzZXJ0IChhcyBvcHBvc2VkIHRvIEMudXBkYXRlKHt1cHNlcnQ6dHJ1ZX0pIG9yXG4gICAgLy8gd2l0aCBzaW11bGF0ZWQgdXBzZXJ0LlxuICAgIGlmIChvcHRpb25zLmZ1bGxSZXN1bHQpIG1vbmdvT3B0cy5mdWxsUmVzdWx0ID0gdHJ1ZTtcblxuICAgIHZhciBtb25nb1NlbGVjdG9yID0gcmVwbGFjZVR5cGVzKHNlbGVjdG9yLCByZXBsYWNlTWV0ZW9yQXRvbVdpdGhNb25nbyk7XG4gICAgdmFyIG1vbmdvTW9kID0gcmVwbGFjZVR5cGVzKG1vZCwgcmVwbGFjZU1ldGVvckF0b21XaXRoTW9uZ28pO1xuXG4gICAgdmFyIGlzTW9kaWZ5ID0gTG9jYWxDb2xsZWN0aW9uLl9pc01vZGlmaWNhdGlvbk1vZChtb25nb01vZCk7XG5cbiAgICBpZiAob3B0aW9ucy5fZm9yYmlkUmVwbGFjZSAmJiAhaXNNb2RpZnkpIHtcbiAgICAgIHZhciBlcnIgPSBuZXcgRXJyb3IoXCJJbnZhbGlkIG1vZGlmaWVyLiBSZXBsYWNlbWVudHMgYXJlIGZvcmJpZGRlbi5cIik7XG4gICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gV2UndmUgYWxyZWFkeSBydW4gcmVwbGFjZVR5cGVzL3JlcGxhY2VNZXRlb3JBdG9tV2l0aE1vbmdvIG9uXG4gICAgLy8gc2VsZWN0b3IgYW5kIG1vZC4gIFdlIGFzc3VtZSBpdCBkb2Vzbid0IG1hdHRlciwgYXMgZmFyIGFzXG4gICAgLy8gdGhlIGJlaGF2aW9yIG9mIG1vZGlmaWVycyBpcyBjb25jZXJuZWQsIHdoZXRoZXIgYF9tb2RpZnlgXG4gICAgLy8gaXMgcnVuIG9uIEVKU09OIG9yIG9uIG1vbmdvLWNvbnZlcnRlZCBFSlNPTi5cblxuICAgIC8vIFJ1biB0aGlzIGNvZGUgdXAgZnJvbnQgc28gdGhhdCBpdCBmYWlscyBmYXN0IGlmIHNvbWVvbmUgdXNlc1xuICAgIC8vIGEgTW9uZ28gdXBkYXRlIG9wZXJhdG9yIHdlIGRvbid0IHN1cHBvcnQuXG4gICAgbGV0IGtub3duSWQ7XG4gICAgaWYgKG9wdGlvbnMudXBzZXJ0KSB7XG4gICAgICB0cnkge1xuICAgICAgICBsZXQgbmV3RG9jID0gTG9jYWxDb2xsZWN0aW9uLl9jcmVhdGVVcHNlcnREb2N1bWVudChzZWxlY3RvciwgbW9kKTtcbiAgICAgICAga25vd25JZCA9IG5ld0RvYy5faWQ7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMudXBzZXJ0ICYmXG4gICAgICAgICEgaXNNb2RpZnkgJiZcbiAgICAgICAgISBrbm93bklkICYmXG4gICAgICAgIG9wdGlvbnMuaW5zZXJ0ZWRJZCAmJlxuICAgICAgICAhIChvcHRpb25zLmluc2VydGVkSWQgaW5zdGFuY2VvZiBNb25nby5PYmplY3RJRCAmJlxuICAgICAgICAgICBvcHRpb25zLmdlbmVyYXRlZElkKSkge1xuICAgICAgLy8gSW4gY2FzZSBvZiBhbiB1cHNlcnQgd2l0aCBhIHJlcGxhY2VtZW50LCB3aGVyZSB0aGVyZSBpcyBubyBfaWQgZGVmaW5lZFxuICAgICAgLy8gaW4gZWl0aGVyIHRoZSBxdWVyeSBvciB0aGUgcmVwbGFjZW1lbnQgZG9jLCBtb25nbyB3aWxsIGdlbmVyYXRlIGFuIGlkIGl0c2VsZi5cbiAgICAgIC8vIFRoZXJlZm9yZSB3ZSBuZWVkIHRoaXMgc3BlY2lhbCBzdHJhdGVneSBpZiB3ZSB3YW50IHRvIGNvbnRyb2wgdGhlIGlkIG91cnNlbHZlcy5cblxuICAgICAgLy8gV2UgZG9uJ3QgbmVlZCB0byBkbyB0aGlzIHdoZW46XG4gICAgICAvLyAtIFRoaXMgaXMgbm90IGEgcmVwbGFjZW1lbnQsIHNvIHdlIGNhbiBhZGQgYW4gX2lkIHRvICRzZXRPbkluc2VydFxuICAgICAgLy8gLSBUaGUgaWQgaXMgZGVmaW5lZCBieSBxdWVyeSBvciBtb2Qgd2UgY2FuIGp1c3QgYWRkIGl0IHRvIHRoZSByZXBsYWNlbWVudCBkb2NcbiAgICAgIC8vIC0gVGhlIHVzZXIgZGlkIG5vdCBzcGVjaWZ5IGFueSBpZCBwcmVmZXJlbmNlIGFuZCB0aGUgaWQgaXMgYSBNb25nbyBPYmplY3RJZCxcbiAgICAgIC8vICAgICB0aGVuIHdlIGNhbiBqdXN0IGxldCBNb25nbyBnZW5lcmF0ZSB0aGUgaWRcblxuICAgICAgc2ltdWxhdGVVcHNlcnRXaXRoSW5zZXJ0ZWRJZChcbiAgICAgICAgY29sbGVjdGlvbiwgbW9uZ29TZWxlY3RvciwgbW9uZ29Nb2QsIG9wdGlvbnMsXG4gICAgICAgIC8vIFRoaXMgY2FsbGJhY2sgZG9lcyBub3QgbmVlZCB0byBiZSBiaW5kRW52aXJvbm1lbnQnZWQgYmVjYXVzZVxuICAgICAgICAvLyBzaW11bGF0ZVVwc2VydFdpdGhJbnNlcnRlZElkKCkgd3JhcHMgaXQgYW5kIHRoZW4gcGFzc2VzIGl0IHRocm91Z2hcbiAgICAgICAgLy8gYmluZEVudmlyb25tZW50Rm9yV3JpdGUuXG4gICAgICAgIGZ1bmN0aW9uIChlcnJvciwgcmVzdWx0KSB7XG4gICAgICAgICAgLy8gSWYgd2UgZ290IGhlcmUgdmlhIGEgdXBzZXJ0KCkgY2FsbCwgdGhlbiBvcHRpb25zLl9yZXR1cm5PYmplY3Qgd2lsbFxuICAgICAgICAgIC8vIGJlIHNldCBhbmQgd2Ugc2hvdWxkIHJldHVybiB0aGUgd2hvbGUgb2JqZWN0LiBPdGhlcndpc2UsIHdlIHNob3VsZFxuICAgICAgICAgIC8vIGp1c3QgcmV0dXJuIHRoZSBudW1iZXIgb2YgYWZmZWN0ZWQgZG9jcyB0byBtYXRjaCB0aGUgbW9uZ28gQVBJLlxuICAgICAgICAgIGlmIChyZXN1bHQgJiYgISBvcHRpb25zLl9yZXR1cm5PYmplY3QpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCByZXN1bHQubnVtYmVyQWZmZWN0ZWQpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgcmVzdWx0KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgfSBlbHNlIHtcblxuICAgICAgaWYgKG9wdGlvbnMudXBzZXJ0ICYmICFrbm93bklkICYmIG9wdGlvbnMuaW5zZXJ0ZWRJZCAmJiBpc01vZGlmeSkge1xuICAgICAgICBpZiAoIW1vbmdvTW9kLmhhc093blByb3BlcnR5KCckc2V0T25JbnNlcnQnKSkge1xuICAgICAgICAgIG1vbmdvTW9kLiRzZXRPbkluc2VydCA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIGtub3duSWQgPSBvcHRpb25zLmluc2VydGVkSWQ7XG4gICAgICAgIE9iamVjdC5hc3NpZ24obW9uZ29Nb2QuJHNldE9uSW5zZXJ0LCByZXBsYWNlVHlwZXMoe19pZDogb3B0aW9ucy5pbnNlcnRlZElkfSwgcmVwbGFjZU1ldGVvckF0b21XaXRoTW9uZ28pKTtcbiAgICAgIH1cblxuICAgICAgY29sbGVjdGlvbi51cGRhdGUoXG4gICAgICAgIG1vbmdvU2VsZWN0b3IsIG1vbmdvTW9kLCBtb25nb09wdHMsXG4gICAgICAgIGJpbmRFbnZpcm9ubWVudEZvcldyaXRlKGZ1bmN0aW9uIChlcnIsIHJlc3VsdCkge1xuICAgICAgICAgIGlmICghIGVycikge1xuICAgICAgICAgICAgdmFyIG1ldGVvclJlc3VsdCA9IHRyYW5zZm9ybVJlc3VsdChyZXN1bHQpO1xuICAgICAgICAgICAgaWYgKG1ldGVvclJlc3VsdCAmJiBvcHRpb25zLl9yZXR1cm5PYmplY3QpIHtcbiAgICAgICAgICAgICAgLy8gSWYgdGhpcyB3YXMgYW4gdXBzZXJ0KCkgY2FsbCwgYW5kIHdlIGVuZGVkIHVwXG4gICAgICAgICAgICAgIC8vIGluc2VydGluZyBhIG5ldyBkb2MgYW5kIHdlIGtub3cgaXRzIGlkLCB0aGVuXG4gICAgICAgICAgICAgIC8vIHJldHVybiB0aGF0IGlkIGFzIHdlbGwuXG4gICAgICAgICAgICAgIGlmIChvcHRpb25zLnVwc2VydCAmJiBtZXRlb3JSZXN1bHQuaW5zZXJ0ZWRJZCkge1xuICAgICAgICAgICAgICAgIGlmIChrbm93bklkKSB7XG4gICAgICAgICAgICAgICAgICBtZXRlb3JSZXN1bHQuaW5zZXJ0ZWRJZCA9IGtub3duSWQ7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChtZXRlb3JSZXN1bHQuaW5zZXJ0ZWRJZCBpbnN0YW5jZW9mIE1vbmdvREIuT2JqZWN0SUQpIHtcbiAgICAgICAgICAgICAgICAgIG1ldGVvclJlc3VsdC5pbnNlcnRlZElkID0gbmV3IE1vbmdvLk9iamVjdElEKG1ldGVvclJlc3VsdC5pbnNlcnRlZElkLnRvSGV4U3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgbWV0ZW9yUmVzdWx0KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgbWV0ZW9yUmVzdWx0Lm51bWJlckFmZmVjdGVkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FsbGJhY2soZXJyKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pKTtcbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICB3cml0ZS5jb21taXR0ZWQoKTtcbiAgICB0aHJvdyBlO1xuICB9XG59O1xuXG52YXIgdHJhbnNmb3JtUmVzdWx0ID0gZnVuY3Rpb24gKGRyaXZlclJlc3VsdCkge1xuICB2YXIgbWV0ZW9yUmVzdWx0ID0geyBudW1iZXJBZmZlY3RlZDogMCB9O1xuICBpZiAoZHJpdmVyUmVzdWx0KSB7XG4gICAgdmFyIG1vbmdvUmVzdWx0ID0gZHJpdmVyUmVzdWx0LnJlc3VsdDtcblxuICAgIC8vIE9uIHVwZGF0ZXMgd2l0aCB1cHNlcnQ6dHJ1ZSwgdGhlIGluc2VydGVkIHZhbHVlcyBjb21lIGFzIGEgbGlzdCBvZlxuICAgIC8vIHVwc2VydGVkIHZhbHVlcyAtLSBldmVuIHdpdGggb3B0aW9ucy5tdWx0aSwgd2hlbiB0aGUgdXBzZXJ0IGRvZXMgaW5zZXJ0LFxuICAgIC8vIGl0IG9ubHkgaW5zZXJ0cyBvbmUgZWxlbWVudC5cbiAgICBpZiAobW9uZ29SZXN1bHQudXBzZXJ0ZWQpIHtcbiAgICAgIG1ldGVvclJlc3VsdC5udW1iZXJBZmZlY3RlZCArPSBtb25nb1Jlc3VsdC51cHNlcnRlZC5sZW5ndGg7XG5cbiAgICAgIGlmIChtb25nb1Jlc3VsdC51cHNlcnRlZC5sZW5ndGggPT0gMSkge1xuICAgICAgICBtZXRlb3JSZXN1bHQuaW5zZXJ0ZWRJZCA9IG1vbmdvUmVzdWx0LnVwc2VydGVkWzBdLl9pZDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbWV0ZW9yUmVzdWx0Lm51bWJlckFmZmVjdGVkID0gbW9uZ29SZXN1bHQubjtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbWV0ZW9yUmVzdWx0O1xufTtcblxuXG52YXIgTlVNX09QVElNSVNUSUNfVFJJRVMgPSAzO1xuXG4vLyBleHBvc2VkIGZvciB0ZXN0aW5nXG5Nb25nb0Nvbm5lY3Rpb24uX2lzQ2Fubm90Q2hhbmdlSWRFcnJvciA9IGZ1bmN0aW9uIChlcnIpIHtcblxuICAvLyBNb25nbyAzLjIuKiByZXR1cm5zIGVycm9yIGFzIG5leHQgT2JqZWN0OlxuICAvLyB7bmFtZTogU3RyaW5nLCBjb2RlOiBOdW1iZXIsIGVycm1zZzogU3RyaW5nfVxuICAvLyBPbGRlciBNb25nbyByZXR1cm5zOlxuICAvLyB7bmFtZTogU3RyaW5nLCBjb2RlOiBOdW1iZXIsIGVycjogU3RyaW5nfVxuICB2YXIgZXJyb3IgPSBlcnIuZXJybXNnIHx8IGVyci5lcnI7XG5cbiAgLy8gV2UgZG9uJ3QgdXNlIHRoZSBlcnJvciBjb2RlIGhlcmVcbiAgLy8gYmVjYXVzZSB0aGUgZXJyb3IgY29kZSB3ZSBvYnNlcnZlZCBpdCBwcm9kdWNpbmcgKDE2ODM3KSBhcHBlYXJzIHRvIGJlXG4gIC8vIGEgZmFyIG1vcmUgZ2VuZXJpYyBlcnJvciBjb2RlIGJhc2VkIG9uIGV4YW1pbmluZyB0aGUgc291cmNlLlxuICBpZiAoZXJyb3IuaW5kZXhPZignVGhlIF9pZCBmaWVsZCBjYW5ub3QgYmUgY2hhbmdlZCcpID09PSAwXG4gICAgfHwgZXJyb3IuaW5kZXhPZihcInRoZSAoaW1tdXRhYmxlKSBmaWVsZCAnX2lkJyB3YXMgZm91bmQgdG8gaGF2ZSBiZWVuIGFsdGVyZWQgdG8gX2lkXCIpICE9PSAtMSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxudmFyIHNpbXVsYXRlVXBzZXJ0V2l0aEluc2VydGVkSWQgPSBmdW5jdGlvbiAoY29sbGVjdGlvbiwgc2VsZWN0b3IsIG1vZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gIC8vIFNUUkFURUdZOiBGaXJzdCB0cnkgZG9pbmcgYW4gdXBzZXJ0IHdpdGggYSBnZW5lcmF0ZWQgSUQuXG4gIC8vIElmIHRoaXMgdGhyb3dzIGFuIGVycm9yIGFib3V0IGNoYW5naW5nIHRoZSBJRCBvbiBhbiBleGlzdGluZyBkb2N1bWVudFxuICAvLyB0aGVuIHdpdGhvdXQgYWZmZWN0aW5nIHRoZSBkYXRhYmFzZSwgd2Uga25vdyB3ZSBzaG91bGQgcHJvYmFibHkgdHJ5XG4gIC8vIGFuIHVwZGF0ZSB3aXRob3V0IHRoZSBnZW5lcmF0ZWQgSUQuIElmIGl0IGFmZmVjdGVkIDAgZG9jdW1lbnRzLFxuICAvLyB0aGVuIHdpdGhvdXQgYWZmZWN0aW5nIHRoZSBkYXRhYmFzZSwgd2UgdGhlIGRvY3VtZW50IHRoYXQgZmlyc3RcbiAgLy8gZ2F2ZSB0aGUgZXJyb3IgaXMgcHJvYmFibHkgcmVtb3ZlZCBhbmQgd2UgbmVlZCB0byB0cnkgYW4gaW5zZXJ0IGFnYWluXG4gIC8vIFdlIGdvIGJhY2sgdG8gc3RlcCBvbmUgYW5kIHJlcGVhdC5cbiAgLy8gTGlrZSBhbGwgXCJvcHRpbWlzdGljIHdyaXRlXCIgc2NoZW1lcywgd2UgcmVseSBvbiB0aGUgZmFjdCB0aGF0IGl0J3NcbiAgLy8gdW5saWtlbHkgb3VyIHdyaXRlcyB3aWxsIGNvbnRpbnVlIHRvIGJlIGludGVyZmVyZWQgd2l0aCB1bmRlciBub3JtYWxcbiAgLy8gY2lyY3Vtc3RhbmNlcyAodGhvdWdoIHN1ZmZpY2llbnRseSBoZWF2eSBjb250ZW50aW9uIHdpdGggd3JpdGVyc1xuICAvLyBkaXNhZ3JlZWluZyBvbiB0aGUgZXhpc3RlbmNlIG9mIGFuIG9iamVjdCB3aWxsIGNhdXNlIHdyaXRlcyB0byBmYWlsXG4gIC8vIGluIHRoZW9yeSkuXG5cbiAgdmFyIGluc2VydGVkSWQgPSBvcHRpb25zLmluc2VydGVkSWQ7IC8vIG11c3QgZXhpc3RcbiAgdmFyIG1vbmdvT3B0c0ZvclVwZGF0ZSA9IHtcbiAgICBzYWZlOiB0cnVlLFxuICAgIG11bHRpOiBvcHRpb25zLm11bHRpXG4gIH07XG4gIHZhciBtb25nb09wdHNGb3JJbnNlcnQgPSB7XG4gICAgc2FmZTogdHJ1ZSxcbiAgICB1cHNlcnQ6IHRydWVcbiAgfTtcblxuICB2YXIgcmVwbGFjZW1lbnRXaXRoSWQgPSBPYmplY3QuYXNzaWduKFxuICAgIHJlcGxhY2VUeXBlcyh7X2lkOiBpbnNlcnRlZElkfSwgcmVwbGFjZU1ldGVvckF0b21XaXRoTW9uZ28pLFxuICAgIG1vZCk7XG5cbiAgdmFyIHRyaWVzID0gTlVNX09QVElNSVNUSUNfVFJJRVM7XG5cbiAgdmFyIGRvVXBkYXRlID0gZnVuY3Rpb24gKCkge1xuICAgIHRyaWVzLS07XG4gICAgaWYgKCEgdHJpZXMpIHtcbiAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcihcIlVwc2VydCBmYWlsZWQgYWZ0ZXIgXCIgKyBOVU1fT1BUSU1JU1RJQ19UUklFUyArIFwiIHRyaWVzLlwiKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbGxlY3Rpb24udXBkYXRlKHNlbGVjdG9yLCBtb2QsIG1vbmdvT3B0c0ZvclVwZGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJpbmRFbnZpcm9ubWVudEZvcldyaXRlKGZ1bmN0aW9uIChlcnIsIHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChyZXN1bHQgJiYgcmVzdWx0LnJlc3VsdC5uICE9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBudW1iZXJBZmZlY3RlZDogcmVzdWx0LnJlc3VsdC5uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9Db25kaXRpb25hbEluc2VydCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgfVxuICB9O1xuXG4gIHZhciBkb0NvbmRpdGlvbmFsSW5zZXJ0ID0gZnVuY3Rpb24gKCkge1xuICAgIGNvbGxlY3Rpb24udXBkYXRlKHNlbGVjdG9yLCByZXBsYWNlbWVudFdpdGhJZCwgbW9uZ29PcHRzRm9ySW5zZXJ0LFxuICAgICAgICAgICAgICAgICAgICAgIGJpbmRFbnZpcm9ubWVudEZvcldyaXRlKGZ1bmN0aW9uIChlcnIsIHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBmaWd1cmUgb3V0IGlmIHRoaXMgaXMgYVxuICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBcImNhbm5vdCBjaGFuZ2UgX2lkIG9mIGRvY3VtZW50XCIgZXJyb3IsIGFuZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiBzbywgdHJ5IGRvVXBkYXRlKCkgYWdhaW4sIHVwIHRvIDMgdGltZXMuXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChNb25nb0Nvbm5lY3Rpb24uX2lzQ2Fubm90Q2hhbmdlSWRFcnJvcihlcnIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9VcGRhdGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVtYmVyQWZmZWN0ZWQ6IHJlc3VsdC5yZXN1bHQudXBzZXJ0ZWQubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydGVkSWQ6IGluc2VydGVkSWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgfTtcblxuICBkb1VwZGF0ZSgpO1xufTtcblxuXy5lYWNoKFtcImluc2VydFwiLCBcInVwZGF0ZVwiLCBcInJlbW92ZVwiLCBcImRyb3BDb2xsZWN0aW9uXCIsIFwiZHJvcERhdGFiYXNlXCJdLCBmdW5jdGlvbiAobWV0aG9kKSB7XG4gIE1vbmdvQ29ubmVjdGlvbi5wcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uICgvKiBhcmd1bWVudHMgKi8pIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgcmV0dXJuIE1ldGVvci53cmFwQXN5bmMoc2VsZltcIl9cIiArIG1ldGhvZF0pLmFwcGx5KHNlbGYsIGFyZ3VtZW50cyk7XG4gIH07XG59KTtcblxuLy8gWFhYIE1vbmdvQ29ubmVjdGlvbi51cHNlcnQoKSBkb2VzIG5vdCByZXR1cm4gdGhlIGlkIG9mIHRoZSBpbnNlcnRlZCBkb2N1bWVudFxuLy8gdW5sZXNzIHlvdSBzZXQgaXQgZXhwbGljaXRseSBpbiB0aGUgc2VsZWN0b3Igb3IgbW9kaWZpZXIgKGFzIGEgcmVwbGFjZW1lbnRcbi8vIGRvYykuXG5Nb25nb0Nvbm5lY3Rpb24ucHJvdG90eXBlLnVwc2VydCA9IGZ1bmN0aW9uIChjb2xsZWN0aW9uTmFtZSwgc2VsZWN0b3IsIG1vZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgaWYgKHR5cGVvZiBvcHRpb25zID09PSBcImZ1bmN0aW9uXCIgJiYgISBjYWxsYmFjaykge1xuICAgIGNhbGxiYWNrID0gb3B0aW9ucztcbiAgICBvcHRpb25zID0ge307XG4gIH1cblxuICByZXR1cm4gc2VsZi51cGRhdGUoY29sbGVjdGlvbk5hbWUsIHNlbGVjdG9yLCBtb2QsXG4gICAgICAgICAgICAgICAgICAgICBfLmV4dGVuZCh7fSwgb3B0aW9ucywge1xuICAgICAgICAgICAgICAgICAgICAgICB1cHNlcnQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgIF9yZXR1cm5PYmplY3Q6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgIH0pLCBjYWxsYmFjayk7XG59O1xuXG5Nb25nb0Nvbm5lY3Rpb24ucHJvdG90eXBlLmZpbmQgPSBmdW5jdGlvbiAoY29sbGVjdGlvbk5hbWUsIHNlbGVjdG9yLCBvcHRpb25zKSB7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSlcbiAgICBzZWxlY3RvciA9IHt9O1xuXG4gIHJldHVybiBuZXcgQ3Vyc29yKFxuICAgIHNlbGYsIG5ldyBDdXJzb3JEZXNjcmlwdGlvbihjb2xsZWN0aW9uTmFtZSwgc2VsZWN0b3IsIG9wdGlvbnMpKTtcbn07XG5cbk1vbmdvQ29ubmVjdGlvbi5wcm90b3R5cGUuZmluZE9uZSA9IGZ1bmN0aW9uIChjb2xsZWN0aW9uX25hbWUsIHNlbGVjdG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSlcbiAgICBzZWxlY3RvciA9IHt9O1xuXG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBvcHRpb25zLmxpbWl0ID0gMTtcbiAgcmV0dXJuIHNlbGYuZmluZChjb2xsZWN0aW9uX25hbWUsIHNlbGVjdG9yLCBvcHRpb25zKS5mZXRjaCgpWzBdO1xufTtcblxuLy8gV2UnbGwgYWN0dWFsbHkgZGVzaWduIGFuIGluZGV4IEFQSSBsYXRlci4gRm9yIG5vdywgd2UganVzdCBwYXNzIHRocm91Z2ggdG9cbi8vIE1vbmdvJ3MsIGJ1dCBtYWtlIGl0IHN5bmNocm9ub3VzLlxuTW9uZ29Db25uZWN0aW9uLnByb3RvdHlwZS5fZW5zdXJlSW5kZXggPSBmdW5jdGlvbiAoY29sbGVjdGlvbk5hbWUsIGluZGV4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgLy8gV2UgZXhwZWN0IHRoaXMgZnVuY3Rpb24gdG8gYmUgY2FsbGVkIGF0IHN0YXJ0dXAsIG5vdCBmcm9tIHdpdGhpbiBhIG1ldGhvZCxcbiAgLy8gc28gd2UgZG9uJ3QgaW50ZXJhY3Qgd2l0aCB0aGUgd3JpdGUgZmVuY2UuXG4gIHZhciBjb2xsZWN0aW9uID0gc2VsZi5yYXdDb2xsZWN0aW9uKGNvbGxlY3Rpb25OYW1lKTtcbiAgdmFyIGZ1dHVyZSA9IG5ldyBGdXR1cmU7XG4gIHZhciBpbmRleE5hbWUgPSBjb2xsZWN0aW9uLmVuc3VyZUluZGV4KGluZGV4LCBvcHRpb25zLCBmdXR1cmUucmVzb2x2ZXIoKSk7XG4gIGZ1dHVyZS53YWl0KCk7XG59O1xuTW9uZ29Db25uZWN0aW9uLnByb3RvdHlwZS5fZHJvcEluZGV4ID0gZnVuY3Rpb24gKGNvbGxlY3Rpb25OYW1lLCBpbmRleCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgLy8gVGhpcyBmdW5jdGlvbiBpcyBvbmx5IHVzZWQgYnkgdGVzdCBjb2RlLCBub3Qgd2l0aGluIGEgbWV0aG9kLCBzbyB3ZSBkb24ndFxuICAvLyBpbnRlcmFjdCB3aXRoIHRoZSB3cml0ZSBmZW5jZS5cbiAgdmFyIGNvbGxlY3Rpb24gPSBzZWxmLnJhd0NvbGxlY3Rpb24oY29sbGVjdGlvbk5hbWUpO1xuICB2YXIgZnV0dXJlID0gbmV3IEZ1dHVyZTtcbiAgdmFyIGluZGV4TmFtZSA9IGNvbGxlY3Rpb24uZHJvcEluZGV4KGluZGV4LCBmdXR1cmUucmVzb2x2ZXIoKSk7XG4gIGZ1dHVyZS53YWl0KCk7XG59O1xuXG4vLyBDVVJTT1JTXG5cbi8vIFRoZXJlIGFyZSBzZXZlcmFsIGNsYXNzZXMgd2hpY2ggcmVsYXRlIHRvIGN1cnNvcnM6XG4vL1xuLy8gQ3Vyc29yRGVzY3JpcHRpb24gcmVwcmVzZW50cyB0aGUgYXJndW1lbnRzIHVzZWQgdG8gY29uc3RydWN0IGEgY3Vyc29yOlxuLy8gY29sbGVjdGlvbk5hbWUsIHNlbGVjdG9yLCBhbmQgKGZpbmQpIG9wdGlvbnMuICBCZWNhdXNlIGl0IGlzIHVzZWQgYXMgYSBrZXlcbi8vIGZvciBjdXJzb3IgZGUtZHVwLCBldmVyeXRoaW5nIGluIGl0IHNob3VsZCBlaXRoZXIgYmUgSlNPTi1zdHJpbmdpZmlhYmxlIG9yXG4vLyBub3QgYWZmZWN0IG9ic2VydmVDaGFuZ2VzIG91dHB1dCAoZWcsIG9wdGlvbnMudHJhbnNmb3JtIGZ1bmN0aW9ucyBhcmUgbm90XG4vLyBzdHJpbmdpZmlhYmxlIGJ1dCBkbyBub3QgYWZmZWN0IG9ic2VydmVDaGFuZ2VzKS5cbi8vXG4vLyBTeW5jaHJvbm91c0N1cnNvciBpcyBhIHdyYXBwZXIgYXJvdW5kIGEgTW9uZ29EQiBjdXJzb3Jcbi8vIHdoaWNoIGluY2x1ZGVzIGZ1bGx5LXN5bmNocm9ub3VzIHZlcnNpb25zIG9mIGZvckVhY2gsIGV0Yy5cbi8vXG4vLyBDdXJzb3IgaXMgdGhlIGN1cnNvciBvYmplY3QgcmV0dXJuZWQgZnJvbSBmaW5kKCksIHdoaWNoIGltcGxlbWVudHMgdGhlXG4vLyBkb2N1bWVudGVkIE1vbmdvLkNvbGxlY3Rpb24gY3Vyc29yIEFQSS4gIEl0IHdyYXBzIGEgQ3Vyc29yRGVzY3JpcHRpb24gYW5kIGFcbi8vIFN5bmNocm9ub3VzQ3Vyc29yIChsYXppbHk6IGl0IGRvZXNuJ3QgY29udGFjdCBNb25nbyB1bnRpbCB5b3UgY2FsbCBhIG1ldGhvZFxuLy8gbGlrZSBmZXRjaCBvciBmb3JFYWNoIG9uIGl0KS5cbi8vXG4vLyBPYnNlcnZlSGFuZGxlIGlzIHRoZSBcIm9ic2VydmUgaGFuZGxlXCIgcmV0dXJuZWQgZnJvbSBvYnNlcnZlQ2hhbmdlcy4gSXQgaGFzIGFcbi8vIHJlZmVyZW5jZSB0byBhbiBPYnNlcnZlTXVsdGlwbGV4ZXIuXG4vL1xuLy8gT2JzZXJ2ZU11bHRpcGxleGVyIGFsbG93cyBtdWx0aXBsZSBpZGVudGljYWwgT2JzZXJ2ZUhhbmRsZXMgdG8gYmUgZHJpdmVuIGJ5IGFcbi8vIHNpbmdsZSBvYnNlcnZlIGRyaXZlci5cbi8vXG4vLyBUaGVyZSBhcmUgdHdvIFwib2JzZXJ2ZSBkcml2ZXJzXCIgd2hpY2ggZHJpdmUgT2JzZXJ2ZU11bHRpcGxleGVyczpcbi8vICAgLSBQb2xsaW5nT2JzZXJ2ZURyaXZlciBjYWNoZXMgdGhlIHJlc3VsdHMgb2YgYSBxdWVyeSBhbmQgcmVydW5zIGl0IHdoZW5cbi8vICAgICBuZWNlc3NhcnkuXG4vLyAgIC0gT3Bsb2dPYnNlcnZlRHJpdmVyIGZvbGxvd3MgdGhlIE1vbmdvIG9wZXJhdGlvbiBsb2cgdG8gZGlyZWN0bHkgb2JzZXJ2ZVxuLy8gICAgIGRhdGFiYXNlIGNoYW5nZXMuXG4vLyBCb3RoIGltcGxlbWVudGF0aW9ucyBmb2xsb3cgdGhlIHNhbWUgc2ltcGxlIGludGVyZmFjZTogd2hlbiB5b3UgY3JlYXRlIHRoZW0sXG4vLyB0aGV5IHN0YXJ0IHNlbmRpbmcgb2JzZXJ2ZUNoYW5nZXMgY2FsbGJhY2tzIChhbmQgYSByZWFkeSgpIGludm9jYXRpb24pIHRvXG4vLyB0aGVpciBPYnNlcnZlTXVsdGlwbGV4ZXIsIGFuZCB5b3Ugc3RvcCB0aGVtIGJ5IGNhbGxpbmcgdGhlaXIgc3RvcCgpIG1ldGhvZC5cblxuQ3Vyc29yRGVzY3JpcHRpb24gPSBmdW5jdGlvbiAoY29sbGVjdGlvbk5hbWUsIHNlbGVjdG9yLCBvcHRpb25zKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgc2VsZi5jb2xsZWN0aW9uTmFtZSA9IGNvbGxlY3Rpb25OYW1lO1xuICBzZWxmLnNlbGVjdG9yID0gTW9uZ28uQ29sbGVjdGlvbi5fcmV3cml0ZVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgc2VsZi5vcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbn07XG5cbkN1cnNvciA9IGZ1bmN0aW9uIChtb25nbywgY3Vyc29yRGVzY3JpcHRpb24pIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIHNlbGYuX21vbmdvID0gbW9uZ287XG4gIHNlbGYuX2N1cnNvckRlc2NyaXB0aW9uID0gY3Vyc29yRGVzY3JpcHRpb247XG4gIHNlbGYuX3N5bmNocm9ub3VzQ3Vyc29yID0gbnVsbDtcbn07XG5cbl8uZWFjaChbJ2ZvckVhY2gnLCAnbWFwJywgJ2ZldGNoJywgJ2NvdW50JywgU3ltYm9sLml0ZXJhdG9yXSwgZnVuY3Rpb24gKG1ldGhvZCkge1xuICBDdXJzb3IucHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgLy8gWW91IGNhbiBvbmx5IG9ic2VydmUgYSB0YWlsYWJsZSBjdXJzb3IuXG4gICAgaWYgKHNlbGYuX2N1cnNvckRlc2NyaXB0aW9uLm9wdGlvbnMudGFpbGFibGUpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgY2FsbCBcIiArIG1ldGhvZCArIFwiIG9uIGEgdGFpbGFibGUgY3Vyc29yXCIpO1xuXG4gICAgaWYgKCFzZWxmLl9zeW5jaHJvbm91c0N1cnNvcikge1xuICAgICAgc2VsZi5fc3luY2hyb25vdXNDdXJzb3IgPSBzZWxmLl9tb25nby5fY3JlYXRlU3luY2hyb25vdXNDdXJzb3IoXG4gICAgICAgIHNlbGYuX2N1cnNvckRlc2NyaXB0aW9uLCB7XG4gICAgICAgICAgLy8gTWFrZSBzdXJlIHRoYXQgdGhlIFwic2VsZlwiIGFyZ3VtZW50IHRvIGZvckVhY2gvbWFwIGNhbGxiYWNrcyBpcyB0aGVcbiAgICAgICAgICAvLyBDdXJzb3IsIG5vdCB0aGUgU3luY2hyb25vdXNDdXJzb3IuXG4gICAgICAgICAgc2VsZkZvckl0ZXJhdGlvbjogc2VsZixcbiAgICAgICAgICB1c2VUcmFuc2Zvcm06IHRydWVcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNlbGYuX3N5bmNocm9ub3VzQ3Vyc29yW21ldGhvZF0uYXBwbHkoXG4gICAgICBzZWxmLl9zeW5jaHJvbm91c0N1cnNvciwgYXJndW1lbnRzKTtcbiAgfTtcbn0pO1xuXG4vLyBTaW5jZSB3ZSBkb24ndCBhY3R1YWxseSBoYXZlIGEgXCJuZXh0T2JqZWN0XCIgaW50ZXJmYWNlLCB0aGVyZSdzIHJlYWxseSBub1xuLy8gcmVhc29uIHRvIGhhdmUgYSBcInJld2luZFwiIGludGVyZmFjZS4gIEFsbCBpdCBkaWQgd2FzIG1ha2UgbXVsdGlwbGUgY2FsbHNcbi8vIHRvIGZldGNoL21hcC9mb3JFYWNoIHJldHVybiBub3RoaW5nIHRoZSBzZWNvbmQgdGltZS5cbi8vIFhYWCBDT01QQVQgV0lUSCAwLjguMVxuQ3Vyc29yLnByb3RvdHlwZS5yZXdpbmQgPSBmdW5jdGlvbiAoKSB7XG59O1xuXG5DdXJzb3IucHJvdG90eXBlLmdldFRyYW5zZm9ybSA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMuX2N1cnNvckRlc2NyaXB0aW9uLm9wdGlvbnMudHJhbnNmb3JtO1xufTtcblxuLy8gV2hlbiB5b3UgY2FsbCBNZXRlb3IucHVibGlzaCgpIHdpdGggYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSBDdXJzb3IsIHdlIG5lZWRcbi8vIHRvIHRyYW5zbXV0ZSBpdCBpbnRvIHRoZSBlcXVpdmFsZW50IHN1YnNjcmlwdGlvbi4gIFRoaXMgaXMgdGhlIGZ1bmN0aW9uIHRoYXRcbi8vIGRvZXMgdGhhdC5cblxuQ3Vyc29yLnByb3RvdHlwZS5fcHVibGlzaEN1cnNvciA9IGZ1bmN0aW9uIChzdWIpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB2YXIgY29sbGVjdGlvbiA9IHNlbGYuX2N1cnNvckRlc2NyaXB0aW9uLmNvbGxlY3Rpb25OYW1lO1xuICByZXR1cm4gTW9uZ28uQ29sbGVjdGlvbi5fcHVibGlzaEN1cnNvcihzZWxmLCBzdWIsIGNvbGxlY3Rpb24pO1xufTtcblxuLy8gVXNlZCB0byBndWFyYW50ZWUgdGhhdCBwdWJsaXNoIGZ1bmN0aW9ucyByZXR1cm4gYXQgbW9zdCBvbmUgY3Vyc29yIHBlclxuLy8gY29sbGVjdGlvbi4gUHJpdmF0ZSwgYmVjYXVzZSB3ZSBtaWdodCBsYXRlciBoYXZlIGN1cnNvcnMgdGhhdCBpbmNsdWRlXG4vLyBkb2N1bWVudHMgZnJvbSBtdWx0aXBsZSBjb2xsZWN0aW9ucyBzb21laG93LlxuQ3Vyc29yLnByb3RvdHlwZS5fZ2V0Q29sbGVjdGlvbk5hbWUgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgcmV0dXJuIHNlbGYuX2N1cnNvckRlc2NyaXB0aW9uLmNvbGxlY3Rpb25OYW1lO1xufTtcblxuQ3Vyc29yLnByb3RvdHlwZS5vYnNlcnZlID0gZnVuY3Rpb24gKGNhbGxiYWNrcykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHJldHVybiBMb2NhbENvbGxlY3Rpb24uX29ic2VydmVGcm9tT2JzZXJ2ZUNoYW5nZXMoc2VsZiwgY2FsbGJhY2tzKTtcbn07XG5cbkN1cnNvci5wcm90b3R5cGUub2JzZXJ2ZUNoYW5nZXMgPSBmdW5jdGlvbiAoY2FsbGJhY2tzKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdmFyIG1ldGhvZHMgPSBbXG4gICAgJ2FkZGVkQXQnLFxuICAgICdhZGRlZCcsXG4gICAgJ2NoYW5nZWRBdCcsXG4gICAgJ2NoYW5nZWQnLFxuICAgICdyZW1vdmVkQXQnLFxuICAgICdyZW1vdmVkJyxcbiAgICAnbW92ZWRUbydcbiAgXTtcbiAgdmFyIG9yZGVyZWQgPSBMb2NhbENvbGxlY3Rpb24uX29ic2VydmVDaGFuZ2VzQ2FsbGJhY2tzQXJlT3JkZXJlZChjYWxsYmFja3MpO1xuXG4gIC8vIFhYWDogQ2FuIHdlIGZpbmQgb3V0IGlmIGNhbGxiYWNrcyBhcmUgZnJvbSBvYnNlcnZlP1xuICB2YXIgZXhjZXB0aW9uTmFtZSA9ICcgb2JzZXJ2ZS9vYnNlcnZlQ2hhbmdlcyBjYWxsYmFjayc7XG4gIG1ldGhvZHMuZm9yRWFjaChmdW5jdGlvbiAobWV0aG9kKSB7XG4gICAgaWYgKGNhbGxiYWNrc1ttZXRob2RdICYmIHR5cGVvZiBjYWxsYmFja3NbbWV0aG9kXSA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIGNhbGxiYWNrc1ttZXRob2RdID0gTWV0ZW9yLmJpbmRFbnZpcm9ubWVudChjYWxsYmFja3NbbWV0aG9kXSwgbWV0aG9kICsgZXhjZXB0aW9uTmFtZSk7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gc2VsZi5fbW9uZ28uX29ic2VydmVDaGFuZ2VzKFxuICAgIHNlbGYuX2N1cnNvckRlc2NyaXB0aW9uLCBvcmRlcmVkLCBjYWxsYmFja3MpO1xufTtcblxuTW9uZ29Db25uZWN0aW9uLnByb3RvdHlwZS5fY3JlYXRlU3luY2hyb25vdXNDdXJzb3IgPSBmdW5jdGlvbihcbiAgICBjdXJzb3JEZXNjcmlwdGlvbiwgb3B0aW9ucykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIG9wdGlvbnMgPSBfLnBpY2sob3B0aW9ucyB8fCB7fSwgJ3NlbGZGb3JJdGVyYXRpb24nLCAndXNlVHJhbnNmb3JtJyk7XG5cbiAgdmFyIGNvbGxlY3Rpb24gPSBzZWxmLnJhd0NvbGxlY3Rpb24oY3Vyc29yRGVzY3JpcHRpb24uY29sbGVjdGlvbk5hbWUpO1xuICB2YXIgY3Vyc29yT3B0aW9ucyA9IGN1cnNvckRlc2NyaXB0aW9uLm9wdGlvbnM7XG4gIHZhciBtb25nb09wdGlvbnMgPSB7XG4gICAgc29ydDogY3Vyc29yT3B0aW9ucy5zb3J0LFxuICAgIGxpbWl0OiBjdXJzb3JPcHRpb25zLmxpbWl0LFxuICAgIHNraXA6IGN1cnNvck9wdGlvbnMuc2tpcCxcbiAgICBwcm9qZWN0aW9uOiBjdXJzb3JPcHRpb25zLmZpZWxkc1xuICB9O1xuXG4gIC8vIERvIHdlIHdhbnQgYSB0YWlsYWJsZSBjdXJzb3IgKHdoaWNoIG9ubHkgd29ya3Mgb24gY2FwcGVkIGNvbGxlY3Rpb25zKT9cbiAgaWYgKGN1cnNvck9wdGlvbnMudGFpbGFibGUpIHtcbiAgICAvLyBXZSB3YW50IGEgdGFpbGFibGUgY3Vyc29yLi4uXG4gICAgbW9uZ29PcHRpb25zLnRhaWxhYmxlID0gdHJ1ZTtcbiAgICAvLyAuLi4gYW5kIGZvciB0aGUgc2VydmVyIHRvIHdhaXQgYSBiaXQgaWYgYW55IGdldE1vcmUgaGFzIG5vIGRhdGEgKHJhdGhlclxuICAgIC8vIHRoYW4gbWFraW5nIHVzIHB1dCB0aGUgcmVsZXZhbnQgc2xlZXBzIGluIHRoZSBjbGllbnQpLi4uXG4gICAgbW9uZ29PcHRpb25zLmF3YWl0ZGF0YSA9IHRydWU7XG4gICAgLy8gLi4uIGFuZCB0byBrZWVwIHF1ZXJ5aW5nIHRoZSBzZXJ2ZXIgaW5kZWZpbml0ZWx5IHJhdGhlciB0aGFuIGp1c3QgNSB0aW1lc1xuICAgIC8vIGlmIHRoZXJlJ3Mgbm8gbW9yZSBkYXRhLlxuICAgIG1vbmdvT3B0aW9ucy5udW1iZXJPZlJldHJpZXMgPSAtMTtcbiAgICAvLyBBbmQgaWYgdGhpcyBpcyBvbiB0aGUgb3Bsb2cgY29sbGVjdGlvbiBhbmQgdGhlIGN1cnNvciBzcGVjaWZpZXMgYSAndHMnLFxuICAgIC8vIHRoZW4gc2V0IHRoZSB1bmRvY3VtZW50ZWQgb3Bsb2cgcmVwbGF5IGZsYWcsIHdoaWNoIGRvZXMgYSBzcGVjaWFsIHNjYW4gdG9cbiAgICAvLyBmaW5kIHRoZSBmaXJzdCBkb2N1bWVudCAoaW5zdGVhZCBvZiBjcmVhdGluZyBhbiBpbmRleCBvbiB0cykuIFRoaXMgaXMgYVxuICAgIC8vIHZlcnkgaGFyZC1jb2RlZCBNb25nbyBmbGFnIHdoaWNoIG9ubHkgd29ya3Mgb24gdGhlIG9wbG9nIGNvbGxlY3Rpb24gYW5kXG4gICAgLy8gb25seSB3b3JrcyB3aXRoIHRoZSB0cyBmaWVsZC5cbiAgICBpZiAoY3Vyc29yRGVzY3JpcHRpb24uY29sbGVjdGlvbk5hbWUgPT09IE9QTE9HX0NPTExFQ1RJT04gJiZcbiAgICAgICAgY3Vyc29yRGVzY3JpcHRpb24uc2VsZWN0b3IudHMpIHtcbiAgICAgIG1vbmdvT3B0aW9ucy5vcGxvZ1JlcGxheSA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgdmFyIGRiQ3Vyc29yID0gY29sbGVjdGlvbi5maW5kKFxuICAgIHJlcGxhY2VUeXBlcyhjdXJzb3JEZXNjcmlwdGlvbi5zZWxlY3RvciwgcmVwbGFjZU1ldGVvckF0b21XaXRoTW9uZ28pLFxuICAgIG1vbmdvT3B0aW9ucyk7XG5cbiAgaWYgKHR5cGVvZiBjdXJzb3JPcHRpb25zLm1heFRpbWVNcyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBkYkN1cnNvciA9IGRiQ3Vyc29yLm1heFRpbWVNUyhjdXJzb3JPcHRpb25zLm1heFRpbWVNcyk7XG4gIH1cbiAgaWYgKHR5cGVvZiBjdXJzb3JPcHRpb25zLmhpbnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgZGJDdXJzb3IgPSBkYkN1cnNvci5oaW50KGN1cnNvck9wdGlvbnMuaGludCk7XG4gIH1cblxuICByZXR1cm4gbmV3IFN5bmNocm9ub3VzQ3Vyc29yKGRiQ3Vyc29yLCBjdXJzb3JEZXNjcmlwdGlvbiwgb3B0aW9ucyk7XG59O1xuXG52YXIgU3luY2hyb25vdXNDdXJzb3IgPSBmdW5jdGlvbiAoZGJDdXJzb3IsIGN1cnNvckRlc2NyaXB0aW9uLCBvcHRpb25zKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgb3B0aW9ucyA9IF8ucGljayhvcHRpb25zIHx8IHt9LCAnc2VsZkZvckl0ZXJhdGlvbicsICd1c2VUcmFuc2Zvcm0nKTtcblxuICBzZWxmLl9kYkN1cnNvciA9IGRiQ3Vyc29yO1xuICBzZWxmLl9jdXJzb3JEZXNjcmlwdGlvbiA9IGN1cnNvckRlc2NyaXB0aW9uO1xuICAvLyBUaGUgXCJzZWxmXCIgYXJndW1lbnQgcGFzc2VkIHRvIGZvckVhY2gvbWFwIGNhbGxiYWNrcy4gSWYgd2UncmUgd3JhcHBlZFxuICAvLyBpbnNpZGUgYSB1c2VyLXZpc2libGUgQ3Vyc29yLCB3ZSB3YW50IHRvIHByb3ZpZGUgdGhlIG91dGVyIGN1cnNvciFcbiAgc2VsZi5fc2VsZkZvckl0ZXJhdGlvbiA9IG9wdGlvbnMuc2VsZkZvckl0ZXJhdGlvbiB8fCBzZWxmO1xuICBpZiAob3B0aW9ucy51c2VUcmFuc2Zvcm0gJiYgY3Vyc29yRGVzY3JpcHRpb24ub3B0aW9ucy50cmFuc2Zvcm0pIHtcbiAgICBzZWxmLl90cmFuc2Zvcm0gPSBMb2NhbENvbGxlY3Rpb24ud3JhcFRyYW5zZm9ybShcbiAgICAgIGN1cnNvckRlc2NyaXB0aW9uLm9wdGlvbnMudHJhbnNmb3JtKTtcbiAgfSBlbHNlIHtcbiAgICBzZWxmLl90cmFuc2Zvcm0gPSBudWxsO1xuICB9XG5cbiAgc2VsZi5fc3luY2hyb25vdXNDb3VudCA9IEZ1dHVyZS53cmFwKGRiQ3Vyc29yLmNvdW50LmJpbmQoZGJDdXJzb3IpKTtcbiAgc2VsZi5fdmlzaXRlZElkcyA9IG5ldyBMb2NhbENvbGxlY3Rpb24uX0lkTWFwO1xufTtcblxuXy5leHRlbmQoU3luY2hyb25vdXNDdXJzb3IucHJvdG90eXBlLCB7XG4gIC8vIFJldHVybnMgYSBQcm9taXNlIGZvciB0aGUgbmV4dCBvYmplY3QgZnJvbSB0aGUgdW5kZXJseWluZyBjdXJzb3IgKGJlZm9yZVxuICAvLyB0aGUgTW9uZ28tPk1ldGVvciB0eXBlIHJlcGxhY2VtZW50KS5cbiAgX3Jhd05leHRPYmplY3RQcm9taXNlOiBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHNlbGYuX2RiQ3Vyc29yLm5leHQoKGVyciwgZG9jKSA9PiB7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXNvbHZlKGRvYyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9LFxuXG4gIC8vIFJldHVybnMgYSBQcm9taXNlIGZvciB0aGUgbmV4dCBvYmplY3QgZnJvbSB0aGUgY3Vyc29yLCBza2lwcGluZyB0aG9zZSB3aG9zZVxuICAvLyBJRHMgd2UndmUgYWxyZWFkeSBzZWVuIGFuZCByZXBsYWNpbmcgTW9uZ28gYXRvbXMgd2l0aCBNZXRlb3IgYXRvbXMuXG4gIF9uZXh0T2JqZWN0UHJvbWlzZTogYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICB2YXIgZG9jID0gYXdhaXQgc2VsZi5fcmF3TmV4dE9iamVjdFByb21pc2UoKTtcblxuICAgICAgaWYgKCFkb2MpIHJldHVybiBudWxsO1xuICAgICAgZG9jID0gcmVwbGFjZVR5cGVzKGRvYywgcmVwbGFjZU1vbmdvQXRvbVdpdGhNZXRlb3IpO1xuXG4gICAgICBpZiAoIXNlbGYuX2N1cnNvckRlc2NyaXB0aW9uLm9wdGlvbnMudGFpbGFibGUgJiYgXy5oYXMoZG9jLCAnX2lkJykpIHtcbiAgICAgICAgLy8gRGlkIE1vbmdvIGdpdmUgdXMgZHVwbGljYXRlIGRvY3VtZW50cyBpbiB0aGUgc2FtZSBjdXJzb3I/IElmIHNvLFxuICAgICAgICAvLyBpZ25vcmUgdGhpcyBvbmUuIChEbyB0aGlzIGJlZm9yZSB0aGUgdHJhbnNmb3JtLCBzaW5jZSB0cmFuc2Zvcm0gbWlnaHRcbiAgICAgICAgLy8gcmV0dXJuIHNvbWUgdW5yZWxhdGVkIHZhbHVlLikgV2UgZG9uJ3QgZG8gdGhpcyBmb3IgdGFpbGFibGUgY3Vyc29ycyxcbiAgICAgICAgLy8gYmVjYXVzZSB3ZSB3YW50IHRvIG1haW50YWluIE8oMSkgbWVtb3J5IHVzYWdlLiBBbmQgaWYgdGhlcmUgaXNuJ3QgX2lkXG4gICAgICAgIC8vIGZvciBzb21lIHJlYXNvbiAobWF5YmUgaXQncyB0aGUgb3Bsb2cpLCB0aGVuIHdlIGRvbid0IGRvIHRoaXMgZWl0aGVyLlxuICAgICAgICAvLyAoQmUgY2FyZWZ1bCB0byBkbyB0aGlzIGZvciBmYWxzZXkgYnV0IGV4aXN0aW5nIF9pZCwgdGhvdWdoLilcbiAgICAgICAgaWYgKHNlbGYuX3Zpc2l0ZWRJZHMuaGFzKGRvYy5faWQpKSBjb250aW51ZTtcbiAgICAgICAgc2VsZi5fdmlzaXRlZElkcy5zZXQoZG9jLl9pZCwgdHJ1ZSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChzZWxmLl90cmFuc2Zvcm0pXG4gICAgICAgIGRvYyA9IHNlbGYuX3RyYW5zZm9ybShkb2MpO1xuXG4gICAgICByZXR1cm4gZG9jO1xuICAgIH1cbiAgfSxcblxuICAvLyBSZXR1cm5zIGEgcHJvbWlzZSB3aGljaCBpcyByZXNvbHZlZCB3aXRoIHRoZSBuZXh0IG9iamVjdCAobGlrZSB3aXRoXG4gIC8vIF9uZXh0T2JqZWN0UHJvbWlzZSkgb3IgcmVqZWN0ZWQgaWYgdGhlIGN1cnNvciBkb2Vzbid0IHJldHVybiB3aXRoaW5cbiAgLy8gdGltZW91dE1TIG1zLlxuICBfbmV4dE9iamVjdFByb21pc2VXaXRoVGltZW91dDogZnVuY3Rpb24gKHRpbWVvdXRNUykge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGlmICghdGltZW91dE1TKSB7XG4gICAgICByZXR1cm4gc2VsZi5fbmV4dE9iamVjdFByb21pc2UoKTtcbiAgICB9XG4gICAgY29uc3QgbmV4dE9iamVjdFByb21pc2UgPSBzZWxmLl9uZXh0T2JqZWN0UHJvbWlzZSgpO1xuICAgIGNvbnN0IHRpbWVvdXRFcnIgPSBuZXcgRXJyb3IoJ0NsaWVudC1zaWRlIHRpbWVvdXQgd2FpdGluZyBmb3IgbmV4dCBvYmplY3QnKTtcbiAgICBjb25zdCB0aW1lb3V0UHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IHRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHJlamVjdCh0aW1lb3V0RXJyKTtcbiAgICAgIH0sIHRpbWVvdXRNUyk7XG4gICAgfSk7XG4gICAgcmV0dXJuIFByb21pc2UucmFjZShbbmV4dE9iamVjdFByb21pc2UsIHRpbWVvdXRQcm9taXNlXSlcbiAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgIGlmIChlcnIgPT09IHRpbWVvdXRFcnIpIHtcbiAgICAgICAgICBzZWxmLmNsb3NlKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgfSk7XG4gIH0sXG5cbiAgX25leHRPYmplY3Q6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgcmV0dXJuIHNlbGYuX25leHRPYmplY3RQcm9taXNlKCkuYXdhaXQoKTtcbiAgfSxcblxuICBmb3JFYWNoOiBmdW5jdGlvbiAoY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAvLyBHZXQgYmFjayB0byB0aGUgYmVnaW5uaW5nLlxuICAgIHNlbGYuX3Jld2luZCgpO1xuXG4gICAgLy8gV2UgaW1wbGVtZW50IHRoZSBsb29wIG91cnNlbGYgaW5zdGVhZCBvZiB1c2luZyBzZWxmLl9kYkN1cnNvci5lYWNoLFxuICAgIC8vIGJlY2F1c2UgXCJlYWNoXCIgd2lsbCBjYWxsIGl0cyBjYWxsYmFjayBvdXRzaWRlIG9mIGEgZmliZXIgd2hpY2ggbWFrZXMgaXRcbiAgICAvLyBtdWNoIG1vcmUgY29tcGxleCB0byBtYWtlIHRoaXMgZnVuY3Rpb24gc3luY2hyb25vdXMuXG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgdmFyIGRvYyA9IHNlbGYuX25leHRPYmplY3QoKTtcbiAgICAgIGlmICghZG9jKSByZXR1cm47XG4gICAgICBjYWxsYmFjay5jYWxsKHRoaXNBcmcsIGRvYywgaW5kZXgrKywgc2VsZi5fc2VsZkZvckl0ZXJhdGlvbik7XG4gICAgfVxuICB9LFxuXG4gIC8vIFhYWCBBbGxvdyBvdmVybGFwcGluZyBjYWxsYmFjayBleGVjdXRpb25zIGlmIGNhbGxiYWNrIHlpZWxkcy5cbiAgbWFwOiBmdW5jdGlvbiAoY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIHJlcyA9IFtdO1xuICAgIHNlbGYuZm9yRWFjaChmdW5jdGlvbiAoZG9jLCBpbmRleCkge1xuICAgICAgcmVzLnB1c2goY2FsbGJhY2suY2FsbCh0aGlzQXJnLCBkb2MsIGluZGV4LCBzZWxmLl9zZWxmRm9ySXRlcmF0aW9uKSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlcztcbiAgfSxcblxuICBfcmV3aW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgLy8ga25vd24gdG8gYmUgc3luY2hyb25vdXNcbiAgICBzZWxmLl9kYkN1cnNvci5yZXdpbmQoKTtcblxuICAgIHNlbGYuX3Zpc2l0ZWRJZHMgPSBuZXcgTG9jYWxDb2xsZWN0aW9uLl9JZE1hcDtcbiAgfSxcblxuICAvLyBNb3N0bHkgdXNhYmxlIGZvciB0YWlsYWJsZSBjdXJzb3JzLlxuICBjbG9zZTogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHNlbGYuX2RiQ3Vyc29yLmNsb3NlKCk7XG4gIH0sXG5cbiAgZmV0Y2g6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgcmV0dXJuIHNlbGYubWFwKF8uaWRlbnRpdHkpO1xuICB9LFxuXG4gIGNvdW50OiBmdW5jdGlvbiAoYXBwbHlTa2lwTGltaXQgPSBmYWxzZSkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICByZXR1cm4gc2VsZi5fc3luY2hyb25vdXNDb3VudChhcHBseVNraXBMaW1pdCkud2FpdCgpO1xuICB9LFxuXG4gIC8vIFRoaXMgbWV0aG9kIGlzIE5PVCB3cmFwcGVkIGluIEN1cnNvci5cbiAgZ2V0UmF3T2JqZWN0czogZnVuY3Rpb24gKG9yZGVyZWQpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgaWYgKG9yZGVyZWQpIHtcbiAgICAgIHJldHVybiBzZWxmLmZldGNoKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciByZXN1bHRzID0gbmV3IExvY2FsQ29sbGVjdGlvbi5fSWRNYXA7XG4gICAgICBzZWxmLmZvckVhY2goZnVuY3Rpb24gKGRvYykge1xuICAgICAgICByZXN1bHRzLnNldChkb2MuX2lkLCBkb2MpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9XG4gIH1cbn0pO1xuXG5TeW5jaHJvbm91c0N1cnNvci5wcm90b3R5cGVbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIC8vIEdldCBiYWNrIHRvIHRoZSBiZWdpbm5pbmcuXG4gIHNlbGYuX3Jld2luZCgpO1xuXG4gIHJldHVybiB7XG4gICAgbmV4dCgpIHtcbiAgICAgIGNvbnN0IGRvYyA9IHNlbGYuX25leHRPYmplY3QoKTtcbiAgICAgIHJldHVybiBkb2MgPyB7XG4gICAgICAgIHZhbHVlOiBkb2NcbiAgICAgIH0gOiB7XG4gICAgICAgIGRvbmU6IHRydWVcbiAgICAgIH07XG4gICAgfVxuICB9O1xufTtcblxuLy8gVGFpbHMgdGhlIGN1cnNvciBkZXNjcmliZWQgYnkgY3Vyc29yRGVzY3JpcHRpb24sIG1vc3QgbGlrZWx5IG9uIHRoZVxuLy8gb3Bsb2cuIENhbGxzIGRvY0NhbGxiYWNrIHdpdGggZWFjaCBkb2N1bWVudCBmb3VuZC4gSWdub3JlcyBlcnJvcnMgYW5kIGp1c3Rcbi8vIHJlc3RhcnRzIHRoZSB0YWlsIG9uIGVycm9yLlxuLy9cbi8vIElmIHRpbWVvdXRNUyBpcyBzZXQsIHRoZW4gaWYgd2UgZG9uJ3QgZ2V0IGEgbmV3IGRvY3VtZW50IGV2ZXJ5IHRpbWVvdXRNUyxcbi8vIGtpbGwgYW5kIHJlc3RhcnQgdGhlIGN1cnNvci4gVGhpcyBpcyBwcmltYXJpbHkgYSB3b3JrYXJvdW5kIGZvciAjODU5OC5cbk1vbmdvQ29ubmVjdGlvbi5wcm90b3R5cGUudGFpbCA9IGZ1bmN0aW9uIChjdXJzb3JEZXNjcmlwdGlvbiwgZG9jQ2FsbGJhY2ssIHRpbWVvdXRNUykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIGlmICghY3Vyc29yRGVzY3JpcHRpb24ub3B0aW9ucy50YWlsYWJsZSlcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW4gb25seSB0YWlsIGEgdGFpbGFibGUgY3Vyc29yXCIpO1xuXG4gIHZhciBjdXJzb3IgPSBzZWxmLl9jcmVhdGVTeW5jaHJvbm91c0N1cnNvcihjdXJzb3JEZXNjcmlwdGlvbik7XG5cbiAgdmFyIHN0b3BwZWQgPSBmYWxzZTtcbiAgdmFyIGxhc3RUUztcbiAgdmFyIGxvb3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGRvYyA9IG51bGw7XG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIGlmIChzdG9wcGVkKVxuICAgICAgICByZXR1cm47XG4gICAgICB0cnkge1xuICAgICAgICBkb2MgPSBjdXJzb3IuX25leHRPYmplY3RQcm9taXNlV2l0aFRpbWVvdXQodGltZW91dE1TKS5hd2FpdCgpO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIC8vIFRoZXJlJ3Mgbm8gZ29vZCB3YXkgdG8gZmlndXJlIG91dCBpZiB0aGlzIHdhcyBhY3R1YWxseSBhbiBlcnJvciBmcm9tXG4gICAgICAgIC8vIE1vbmdvLCBvciBqdXN0IGNsaWVudC1zaWRlIChpbmNsdWRpbmcgb3VyIG93biB0aW1lb3V0IGVycm9yKS4gQWhcbiAgICAgICAgLy8gd2VsbC4gQnV0IGVpdGhlciB3YXksIHdlIG5lZWQgdG8gcmV0cnkgdGhlIGN1cnNvciAodW5sZXNzIHRoZSBmYWlsdXJlXG4gICAgICAgIC8vIHdhcyBiZWNhdXNlIHRoZSBvYnNlcnZlIGdvdCBzdG9wcGVkKS5cbiAgICAgICAgZG9jID0gbnVsbDtcbiAgICAgIH1cbiAgICAgIC8vIFNpbmNlIHdlIGF3YWl0ZWQgYSBwcm9taXNlIGFib3ZlLCB3ZSBuZWVkIHRvIGNoZWNrIGFnYWluIHRvIHNlZSBpZlxuICAgICAgLy8gd2UndmUgYmVlbiBzdG9wcGVkIGJlZm9yZSBjYWxsaW5nIHRoZSBjYWxsYmFjay5cbiAgICAgIGlmIChzdG9wcGVkKVxuICAgICAgICByZXR1cm47XG4gICAgICBpZiAoZG9jKSB7XG4gICAgICAgIC8vIElmIGEgdGFpbGFibGUgY3Vyc29yIGNvbnRhaW5zIGEgXCJ0c1wiIGZpZWxkLCB1c2UgaXQgdG8gcmVjcmVhdGUgdGhlXG4gICAgICAgIC8vIGN1cnNvciBvbiBlcnJvci4gKFwidHNcIiBpcyBhIHN0YW5kYXJkIHRoYXQgTW9uZ28gdXNlcyBpbnRlcm5hbGx5IGZvclxuICAgICAgICAvLyB0aGUgb3Bsb2csIGFuZCB0aGVyZSdzIGEgc3BlY2lhbCBmbGFnIHRoYXQgbGV0cyB5b3UgZG8gYmluYXJ5IHNlYXJjaFxuICAgICAgICAvLyBvbiBpdCBpbnN0ZWFkIG9mIG5lZWRpbmcgdG8gdXNlIGFuIGluZGV4LilcbiAgICAgICAgbGFzdFRTID0gZG9jLnRzO1xuICAgICAgICBkb2NDYWxsYmFjayhkb2MpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIG5ld1NlbGVjdG9yID0gXy5jbG9uZShjdXJzb3JEZXNjcmlwdGlvbi5zZWxlY3Rvcik7XG4gICAgICAgIGlmIChsYXN0VFMpIHtcbiAgICAgICAgICBuZXdTZWxlY3Rvci50cyA9IHskZ3Q6IGxhc3RUU307XG4gICAgICAgIH1cbiAgICAgICAgY3Vyc29yID0gc2VsZi5fY3JlYXRlU3luY2hyb25vdXNDdXJzb3IobmV3IEN1cnNvckRlc2NyaXB0aW9uKFxuICAgICAgICAgIGN1cnNvckRlc2NyaXB0aW9uLmNvbGxlY3Rpb25OYW1lLFxuICAgICAgICAgIG5ld1NlbGVjdG9yLFxuICAgICAgICAgIGN1cnNvckRlc2NyaXB0aW9uLm9wdGlvbnMpKTtcbiAgICAgICAgLy8gTW9uZ28gZmFpbG92ZXIgdGFrZXMgbWFueSBzZWNvbmRzLiAgUmV0cnkgaW4gYSBiaXQuICAoV2l0aG91dCB0aGlzXG4gICAgICAgIC8vIHNldFRpbWVvdXQsIHdlIHBlZyB0aGUgQ1BVIGF0IDEwMCUgYW5kIG5ldmVyIG5vdGljZSB0aGUgYWN0dWFsXG4gICAgICAgIC8vIGZhaWxvdmVyLlxuICAgICAgICBNZXRlb3Iuc2V0VGltZW91dChsb29wLCAxMDApO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgTWV0ZW9yLmRlZmVyKGxvb3ApO1xuXG4gIHJldHVybiB7XG4gICAgc3RvcDogZnVuY3Rpb24gKCkge1xuICAgICAgc3RvcHBlZCA9IHRydWU7XG4gICAgICBjdXJzb3IuY2xvc2UoKTtcbiAgICB9XG4gIH07XG59O1xuXG5Nb25nb0Nvbm5lY3Rpb24ucHJvdG90eXBlLl9vYnNlcnZlQ2hhbmdlcyA9IGZ1bmN0aW9uIChcbiAgICBjdXJzb3JEZXNjcmlwdGlvbiwgb3JkZXJlZCwgY2FsbGJhY2tzKSB7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICBpZiAoY3Vyc29yRGVzY3JpcHRpb24ub3B0aW9ucy50YWlsYWJsZSkge1xuICAgIHJldHVybiBzZWxmLl9vYnNlcnZlQ2hhbmdlc1RhaWxhYmxlKGN1cnNvckRlc2NyaXB0aW9uLCBvcmRlcmVkLCBjYWxsYmFja3MpO1xuICB9XG5cbiAgLy8gWW91IG1heSBub3QgZmlsdGVyIG91dCBfaWQgd2hlbiBvYnNlcnZpbmcgY2hhbmdlcywgYmVjYXVzZSB0aGUgaWQgaXMgYSBjb3JlXG4gIC8vIHBhcnQgb2YgdGhlIG9ic2VydmVDaGFuZ2VzIEFQSS5cbiAgaWYgKGN1cnNvckRlc2NyaXB0aW9uLm9wdGlvbnMuZmllbGRzICYmXG4gICAgICAoY3Vyc29yRGVzY3JpcHRpb24ub3B0aW9ucy5maWVsZHMuX2lkID09PSAwIHx8XG4gICAgICAgY3Vyc29yRGVzY3JpcHRpb24ub3B0aW9ucy5maWVsZHMuX2lkID09PSBmYWxzZSkpIHtcbiAgICB0aHJvdyBFcnJvcihcIllvdSBtYXkgbm90IG9ic2VydmUgYSBjdXJzb3Igd2l0aCB7ZmllbGRzOiB7X2lkOiAwfX1cIik7XG4gIH1cblxuICB2YXIgb2JzZXJ2ZUtleSA9IEVKU09OLnN0cmluZ2lmeShcbiAgICBfLmV4dGVuZCh7b3JkZXJlZDogb3JkZXJlZH0sIGN1cnNvckRlc2NyaXB0aW9uKSk7XG5cbiAgdmFyIG11bHRpcGxleGVyLCBvYnNlcnZlRHJpdmVyO1xuICB2YXIgZmlyc3RIYW5kbGUgPSBmYWxzZTtcblxuICAvLyBGaW5kIGEgbWF0Y2hpbmcgT2JzZXJ2ZU11bHRpcGxleGVyLCBvciBjcmVhdGUgYSBuZXcgb25lLiBUaGlzIG5leHQgYmxvY2sgaXNcbiAgLy8gZ3VhcmFudGVlZCB0byBub3QgeWllbGQgKGFuZCBpdCBkb2Vzbid0IGNhbGwgYW55dGhpbmcgdGhhdCBjYW4gb2JzZXJ2ZSBhXG4gIC8vIG5ldyBxdWVyeSksIHNvIG5vIG90aGVyIGNhbGxzIHRvIHRoaXMgZnVuY3Rpb24gY2FuIGludGVybGVhdmUgd2l0aCBpdC5cbiAgTWV0ZW9yLl9ub1lpZWxkc0FsbG93ZWQoZnVuY3Rpb24gKCkge1xuICAgIGlmIChfLmhhcyhzZWxmLl9vYnNlcnZlTXVsdGlwbGV4ZXJzLCBvYnNlcnZlS2V5KSkge1xuICAgICAgbXVsdGlwbGV4ZXIgPSBzZWxmLl9vYnNlcnZlTXVsdGlwbGV4ZXJzW29ic2VydmVLZXldO1xuICAgIH0gZWxzZSB7XG4gICAgICBmaXJzdEhhbmRsZSA9IHRydWU7XG4gICAgICAvLyBDcmVhdGUgYSBuZXcgT2JzZXJ2ZU11bHRpcGxleGVyLlxuICAgICAgbXVsdGlwbGV4ZXIgPSBuZXcgT2JzZXJ2ZU11bHRpcGxleGVyKHtcbiAgICAgICAgb3JkZXJlZDogb3JkZXJlZCxcbiAgICAgICAgb25TdG9wOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgZGVsZXRlIHNlbGYuX29ic2VydmVNdWx0aXBsZXhlcnNbb2JzZXJ2ZUtleV07XG4gICAgICAgICAgb2JzZXJ2ZURyaXZlci5zdG9wKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgc2VsZi5fb2JzZXJ2ZU11bHRpcGxleGVyc1tvYnNlcnZlS2V5XSA9IG11bHRpcGxleGVyO1xuICAgIH1cbiAgfSk7XG5cbiAgdmFyIG9ic2VydmVIYW5kbGUgPSBuZXcgT2JzZXJ2ZUhhbmRsZShtdWx0aXBsZXhlciwgY2FsbGJhY2tzKTtcblxuICBpZiAoZmlyc3RIYW5kbGUpIHtcbiAgICB2YXIgbWF0Y2hlciwgc29ydGVyO1xuICAgIHZhciBjYW5Vc2VPcGxvZyA9IF8uYWxsKFtcbiAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gQXQgYSBiYXJlIG1pbmltdW0sIHVzaW5nIHRoZSBvcGxvZyByZXF1aXJlcyB1cyB0byBoYXZlIGFuIG9wbG9nLCB0b1xuICAgICAgICAvLyB3YW50IHVub3JkZXJlZCBjYWxsYmFja3MsIGFuZCB0byBub3Qgd2FudCBhIGNhbGxiYWNrIG9uIHRoZSBwb2xsc1xuICAgICAgICAvLyB0aGF0IHdvbid0IGhhcHBlbi5cbiAgICAgICAgcmV0dXJuIHNlbGYuX29wbG9nSGFuZGxlICYmICFvcmRlcmVkICYmXG4gICAgICAgICAgIWNhbGxiYWNrcy5fdGVzdE9ubHlQb2xsQ2FsbGJhY2s7XG4gICAgICB9LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIFdlIG5lZWQgdG8gYmUgYWJsZSB0byBjb21waWxlIHRoZSBzZWxlY3Rvci4gRmFsbCBiYWNrIHRvIHBvbGxpbmcgZm9yXG4gICAgICAgIC8vIHNvbWUgbmV3ZmFuZ2xlZCAkc2VsZWN0b3IgdGhhdCBtaW5pbW9uZ28gZG9lc24ndCBzdXBwb3J0IHlldC5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBtYXRjaGVyID0gbmV3IE1pbmltb25nby5NYXRjaGVyKGN1cnNvckRlc2NyaXB0aW9uLnNlbGVjdG9yKTtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIC8vIFhYWCBtYWtlIGFsbCBjb21waWxhdGlvbiBlcnJvcnMgTWluaW1vbmdvRXJyb3Igb3Igc29tZXRoaW5nXG4gICAgICAgICAgLy8gICAgIHNvIHRoYXQgdGhpcyBkb2Vzbid0IGlnbm9yZSB1bnJlbGF0ZWQgZXhjZXB0aW9uc1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyAuLi4gYW5kIHRoZSBzZWxlY3RvciBpdHNlbGYgbmVlZHMgdG8gc3VwcG9ydCBvcGxvZy5cbiAgICAgICAgcmV0dXJuIE9wbG9nT2JzZXJ2ZURyaXZlci5jdXJzb3JTdXBwb3J0ZWQoY3Vyc29yRGVzY3JpcHRpb24sIG1hdGNoZXIpO1xuICAgICAgfSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBBbmQgd2UgbmVlZCB0byBiZSBhYmxlIHRvIGNvbXBpbGUgdGhlIHNvcnQsIGlmIGFueS4gIGVnLCBjYW4ndCBiZVxuICAgICAgICAvLyB7JG5hdHVyYWw6IDF9LlxuICAgICAgICBpZiAoIWN1cnNvckRlc2NyaXB0aW9uLm9wdGlvbnMuc29ydClcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBzb3J0ZXIgPSBuZXcgTWluaW1vbmdvLlNvcnRlcihjdXJzb3JEZXNjcmlwdGlvbi5vcHRpb25zLnNvcnQpO1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgLy8gWFhYIG1ha2UgYWxsIGNvbXBpbGF0aW9uIGVycm9ycyBNaW5pbW9uZ29FcnJvciBvciBzb21ldGhpbmdcbiAgICAgICAgICAvLyAgICAgc28gdGhhdCB0aGlzIGRvZXNuJ3QgaWdub3JlIHVucmVsYXRlZCBleGNlcHRpb25zXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XSwgZnVuY3Rpb24gKGYpIHsgcmV0dXJuIGYoKTsgfSk7ICAvLyBpbnZva2UgZWFjaCBmdW5jdGlvblxuXG4gICAgdmFyIGRyaXZlckNsYXNzID0gY2FuVXNlT3Bsb2cgPyBPcGxvZ09ic2VydmVEcml2ZXIgOiBQb2xsaW5nT2JzZXJ2ZURyaXZlcjtcbiAgICBvYnNlcnZlRHJpdmVyID0gbmV3IGRyaXZlckNsYXNzKHtcbiAgICAgIGN1cnNvckRlc2NyaXB0aW9uOiBjdXJzb3JEZXNjcmlwdGlvbixcbiAgICAgIG1vbmdvSGFuZGxlOiBzZWxmLFxuICAgICAgbXVsdGlwbGV4ZXI6IG11bHRpcGxleGVyLFxuICAgICAgb3JkZXJlZDogb3JkZXJlZCxcbiAgICAgIG1hdGNoZXI6IG1hdGNoZXIsICAvLyBpZ25vcmVkIGJ5IHBvbGxpbmdcbiAgICAgIHNvcnRlcjogc29ydGVyLCAgLy8gaWdub3JlZCBieSBwb2xsaW5nXG4gICAgICBfdGVzdE9ubHlQb2xsQ2FsbGJhY2s6IGNhbGxiYWNrcy5fdGVzdE9ubHlQb2xsQ2FsbGJhY2tcbiAgICB9KTtcblxuICAgIC8vIFRoaXMgZmllbGQgaXMgb25seSBzZXQgZm9yIHVzZSBpbiB0ZXN0cy5cbiAgICBtdWx0aXBsZXhlci5fb2JzZXJ2ZURyaXZlciA9IG9ic2VydmVEcml2ZXI7XG4gIH1cblxuICAvLyBCbG9ja3MgdW50aWwgdGhlIGluaXRpYWwgYWRkcyBoYXZlIGJlZW4gc2VudC5cbiAgbXVsdGlwbGV4ZXIuYWRkSGFuZGxlQW5kU2VuZEluaXRpYWxBZGRzKG9ic2VydmVIYW5kbGUpO1xuXG4gIHJldHVybiBvYnNlcnZlSGFuZGxlO1xufTtcblxuLy8gTGlzdGVuIGZvciB0aGUgaW52YWxpZGF0aW9uIG1lc3NhZ2VzIHRoYXQgd2lsbCB0cmlnZ2VyIHVzIHRvIHBvbGwgdGhlXG4vLyBkYXRhYmFzZSBmb3IgY2hhbmdlcy4gSWYgdGhpcyBzZWxlY3RvciBzcGVjaWZpZXMgc3BlY2lmaWMgSURzLCBzcGVjaWZ5IHRoZW1cbi8vIGhlcmUsIHNvIHRoYXQgdXBkYXRlcyB0byBkaWZmZXJlbnQgc3BlY2lmaWMgSURzIGRvbid0IGNhdXNlIHVzIHRvIHBvbGwuXG4vLyBsaXN0ZW5DYWxsYmFjayBpcyB0aGUgc2FtZSBraW5kIG9mIChub3RpZmljYXRpb24sIGNvbXBsZXRlKSBjYWxsYmFjayBwYXNzZWRcbi8vIHRvIEludmFsaWRhdGlvbkNyb3NzYmFyLmxpc3Rlbi5cblxubGlzdGVuQWxsID0gZnVuY3Rpb24gKGN1cnNvckRlc2NyaXB0aW9uLCBsaXN0ZW5DYWxsYmFjaykge1xuICB2YXIgbGlzdGVuZXJzID0gW107XG4gIGZvckVhY2hUcmlnZ2VyKGN1cnNvckRlc2NyaXB0aW9uLCBmdW5jdGlvbiAodHJpZ2dlcikge1xuICAgIGxpc3RlbmVycy5wdXNoKEREUFNlcnZlci5fSW52YWxpZGF0aW9uQ3Jvc3NiYXIubGlzdGVuKFxuICAgICAgdHJpZ2dlciwgbGlzdGVuQ2FsbGJhY2spKTtcbiAgfSk7XG5cbiAgcmV0dXJuIHtcbiAgICBzdG9wOiBmdW5jdGlvbiAoKSB7XG4gICAgICBfLmVhY2gobGlzdGVuZXJzLCBmdW5jdGlvbiAobGlzdGVuZXIpIHtcbiAgICAgICAgbGlzdGVuZXIuc3RvcCgpO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xufTtcblxuZm9yRWFjaFRyaWdnZXIgPSBmdW5jdGlvbiAoY3Vyc29yRGVzY3JpcHRpb24sIHRyaWdnZXJDYWxsYmFjaykge1xuICB2YXIga2V5ID0ge2NvbGxlY3Rpb246IGN1cnNvckRlc2NyaXB0aW9uLmNvbGxlY3Rpb25OYW1lfTtcbiAgdmFyIHNwZWNpZmljSWRzID0gTG9jYWxDb2xsZWN0aW9uLl9pZHNNYXRjaGVkQnlTZWxlY3RvcihcbiAgICBjdXJzb3JEZXNjcmlwdGlvbi5zZWxlY3Rvcik7XG4gIGlmIChzcGVjaWZpY0lkcykge1xuICAgIF8uZWFjaChzcGVjaWZpY0lkcywgZnVuY3Rpb24gKGlkKSB7XG4gICAgICB0cmlnZ2VyQ2FsbGJhY2soXy5leHRlbmQoe2lkOiBpZH0sIGtleSkpO1xuICAgIH0pO1xuICAgIHRyaWdnZXJDYWxsYmFjayhfLmV4dGVuZCh7ZHJvcENvbGxlY3Rpb246IHRydWUsIGlkOiBudWxsfSwga2V5KSk7XG4gIH0gZWxzZSB7XG4gICAgdHJpZ2dlckNhbGxiYWNrKGtleSk7XG4gIH1cbiAgLy8gRXZlcnlvbmUgY2FyZXMgYWJvdXQgdGhlIGRhdGFiYXNlIGJlaW5nIGRyb3BwZWQuXG4gIHRyaWdnZXJDYWxsYmFjayh7IGRyb3BEYXRhYmFzZTogdHJ1ZSB9KTtcbn07XG5cbi8vIG9ic2VydmVDaGFuZ2VzIGZvciB0YWlsYWJsZSBjdXJzb3JzIG9uIGNhcHBlZCBjb2xsZWN0aW9ucy5cbi8vXG4vLyBTb21lIGRpZmZlcmVuY2VzIGZyb20gbm9ybWFsIGN1cnNvcnM6XG4vLyAgIC0gV2lsbCBuZXZlciBwcm9kdWNlIGFueXRoaW5nIG90aGVyIHRoYW4gJ2FkZGVkJyBvciAnYWRkZWRCZWZvcmUnLiBJZiB5b3Vcbi8vICAgICBkbyB1cGRhdGUgYSBkb2N1bWVudCB0aGF0IGhhcyBhbHJlYWR5IGJlZW4gcHJvZHVjZWQsIHRoaXMgd2lsbCBub3Qgbm90aWNlXG4vLyAgICAgaXQuXG4vLyAgIC0gSWYgeW91IGRpc2Nvbm5lY3QgYW5kIHJlY29ubmVjdCBmcm9tIE1vbmdvLCBpdCB3aWxsIGVzc2VudGlhbGx5IHJlc3RhcnRcbi8vICAgICB0aGUgcXVlcnksIHdoaWNoIHdpbGwgbGVhZCB0byBkdXBsaWNhdGUgcmVzdWx0cy4gVGhpcyBpcyBwcmV0dHkgYmFkLFxuLy8gICAgIGJ1dCBpZiB5b3UgaW5jbHVkZSBhIGZpZWxkIGNhbGxlZCAndHMnIHdoaWNoIGlzIGluc2VydGVkIGFzXG4vLyAgICAgbmV3IE1vbmdvSW50ZXJuYWxzLk1vbmdvVGltZXN0YW1wKDAsIDApICh3aGljaCBpcyBpbml0aWFsaXplZCB0byB0aGVcbi8vICAgICBjdXJyZW50IE1vbmdvLXN0eWxlIHRpbWVzdGFtcCksIHdlJ2xsIGJlIGFibGUgdG8gZmluZCB0aGUgcGxhY2UgdG9cbi8vICAgICByZXN0YXJ0IHByb3Blcmx5LiAoVGhpcyBmaWVsZCBpcyBzcGVjaWZpY2FsbHkgdW5kZXJzdG9vZCBieSBNb25nbyB3aXRoIGFuXG4vLyAgICAgb3B0aW1pemF0aW9uIHdoaWNoIGFsbG93cyBpdCB0byBmaW5kIHRoZSByaWdodCBwbGFjZSB0byBzdGFydCB3aXRob3V0XG4vLyAgICAgYW4gaW5kZXggb24gdHMuIEl0J3MgaG93IHRoZSBvcGxvZyB3b3Jrcy4pXG4vLyAgIC0gTm8gY2FsbGJhY2tzIGFyZSB0cmlnZ2VyZWQgc3luY2hyb25vdXNseSB3aXRoIHRoZSBjYWxsICh0aGVyZSdzIG5vXG4vLyAgICAgZGlmZmVyZW50aWF0aW9uIGJldHdlZW4gXCJpbml0aWFsIGRhdGFcIiBhbmQgXCJsYXRlciBjaGFuZ2VzXCI7IGV2ZXJ5dGhpbmdcbi8vICAgICB0aGF0IG1hdGNoZXMgdGhlIHF1ZXJ5IGdldHMgc2VudCBhc3luY2hyb25vdXNseSkuXG4vLyAgIC0gRGUtZHVwbGljYXRpb24gaXMgbm90IGltcGxlbWVudGVkLlxuLy8gICAtIERvZXMgbm90IHlldCBpbnRlcmFjdCB3aXRoIHRoZSB3cml0ZSBmZW5jZS4gUHJvYmFibHksIHRoaXMgc2hvdWxkIHdvcmsgYnlcbi8vICAgICBpZ25vcmluZyByZW1vdmVzICh3aGljaCBkb24ndCB3b3JrIG9uIGNhcHBlZCBjb2xsZWN0aW9ucykgYW5kIHVwZGF0ZXNcbi8vICAgICAod2hpY2ggZG9uJ3QgYWZmZWN0IHRhaWxhYmxlIGN1cnNvcnMpLCBhbmQganVzdCBrZWVwaW5nIHRyYWNrIG9mIHRoZSBJRFxuLy8gICAgIG9mIHRoZSBpbnNlcnRlZCBvYmplY3QsIGFuZCBjbG9zaW5nIHRoZSB3cml0ZSBmZW5jZSBvbmNlIHlvdSBnZXQgdG8gdGhhdFxuLy8gICAgIElEIChvciB0aW1lc3RhbXA/KS4gIFRoaXMgZG9lc24ndCB3b3JrIHdlbGwgaWYgdGhlIGRvY3VtZW50IGRvZXNuJ3QgbWF0Y2hcbi8vICAgICB0aGUgcXVlcnksIHRob3VnaC4gIE9uIHRoZSBvdGhlciBoYW5kLCB0aGUgd3JpdGUgZmVuY2UgY2FuIGNsb3NlXG4vLyAgICAgaW1tZWRpYXRlbHkgaWYgaXQgZG9lcyBub3QgbWF0Y2ggdGhlIHF1ZXJ5LiBTbyBpZiB3ZSB0cnVzdCBtaW5pbW9uZ29cbi8vICAgICBlbm91Z2ggdG8gYWNjdXJhdGVseSBldmFsdWF0ZSB0aGUgcXVlcnkgYWdhaW5zdCB0aGUgd3JpdGUgZmVuY2UsIHdlXG4vLyAgICAgc2hvdWxkIGJlIGFibGUgdG8gZG8gdGhpcy4uLiAgT2YgY291cnNlLCBtaW5pbW9uZ28gZG9lc24ndCBldmVuIHN1cHBvcnRcbi8vICAgICBNb25nbyBUaW1lc3RhbXBzIHlldC5cbk1vbmdvQ29ubmVjdGlvbi5wcm90b3R5cGUuX29ic2VydmVDaGFuZ2VzVGFpbGFibGUgPSBmdW5jdGlvbiAoXG4gICAgY3Vyc29yRGVzY3JpcHRpb24sIG9yZGVyZWQsIGNhbGxiYWNrcykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgLy8gVGFpbGFibGUgY3Vyc29ycyBvbmx5IGV2ZXIgY2FsbCBhZGRlZC9hZGRlZEJlZm9yZSBjYWxsYmFja3MsIHNvIGl0J3MgYW5cbiAgLy8gZXJyb3IgaWYgeW91IGRpZG4ndCBwcm92aWRlIHRoZW0uXG4gIGlmICgob3JkZXJlZCAmJiAhY2FsbGJhY2tzLmFkZGVkQmVmb3JlKSB8fFxuICAgICAgKCFvcmRlcmVkICYmICFjYWxsYmFja3MuYWRkZWQpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ2FuJ3Qgb2JzZXJ2ZSBhbiBcIiArIChvcmRlcmVkID8gXCJvcmRlcmVkXCIgOiBcInVub3JkZXJlZFwiKVxuICAgICAgICAgICAgICAgICAgICArIFwiIHRhaWxhYmxlIGN1cnNvciB3aXRob3V0IGEgXCJcbiAgICAgICAgICAgICAgICAgICAgKyAob3JkZXJlZCA/IFwiYWRkZWRCZWZvcmVcIiA6IFwiYWRkZWRcIikgKyBcIiBjYWxsYmFja1wiKTtcbiAgfVxuXG4gIHJldHVybiBzZWxmLnRhaWwoY3Vyc29yRGVzY3JpcHRpb24sIGZ1bmN0aW9uIChkb2MpIHtcbiAgICB2YXIgaWQgPSBkb2MuX2lkO1xuICAgIGRlbGV0ZSBkb2MuX2lkO1xuICAgIC8vIFRoZSB0cyBpcyBhbiBpbXBsZW1lbnRhdGlvbiBkZXRhaWwuIEhpZGUgaXQuXG4gICAgZGVsZXRlIGRvYy50cztcbiAgICBpZiAob3JkZXJlZCkge1xuICAgICAgY2FsbGJhY2tzLmFkZGVkQmVmb3JlKGlkLCBkb2MsIG51bGwpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjYWxsYmFja3MuYWRkZWQoaWQsIGRvYyk7XG4gICAgfVxuICB9KTtcbn07XG5cbi8vIFhYWCBXZSBwcm9iYWJseSBuZWVkIHRvIGZpbmQgYSBiZXR0ZXIgd2F5IHRvIGV4cG9zZSB0aGlzLiBSaWdodCBub3dcbi8vIGl0J3Mgb25seSB1c2VkIGJ5IHRlc3RzLCBidXQgaW4gZmFjdCB5b3UgbmVlZCBpdCBpbiBub3JtYWxcbi8vIG9wZXJhdGlvbiB0byBpbnRlcmFjdCB3aXRoIGNhcHBlZCBjb2xsZWN0aW9ucy5cbk1vbmdvSW50ZXJuYWxzLk1vbmdvVGltZXN0YW1wID0gTW9uZ29EQi5UaW1lc3RhbXA7XG5cbk1vbmdvSW50ZXJuYWxzLkNvbm5lY3Rpb24gPSBNb25nb0Nvbm5lY3Rpb247XG4iLCJ2YXIgRnV0dXJlID0gTnBtLnJlcXVpcmUoJ2ZpYmVycy9mdXR1cmUnKTtcblxuaW1wb3J0IHsgTnBtTW9kdWxlTW9uZ29kYiB9IGZyb20gXCJtZXRlb3IvbnBtLW1vbmdvXCI7XG5jb25zdCB7IFRpbWVzdGFtcCB9ID0gTnBtTW9kdWxlTW9uZ29kYjtcblxuT1BMT0dfQ09MTEVDVElPTiA9ICdvcGxvZy5ycyc7XG5cbnZhciBUT09fRkFSX0JFSElORCA9IHByb2Nlc3MuZW52Lk1FVEVPUl9PUExPR19UT09fRkFSX0JFSElORCB8fCAyMDAwO1xudmFyIFRBSUxfVElNRU9VVCA9ICtwcm9jZXNzLmVudi5NRVRFT1JfT1BMT0dfVEFJTF9USU1FT1VUIHx8IDMwMDAwO1xuXG52YXIgc2hvd1RTID0gZnVuY3Rpb24gKHRzKSB7XG4gIHJldHVybiBcIlRpbWVzdGFtcChcIiArIHRzLmdldEhpZ2hCaXRzKCkgKyBcIiwgXCIgKyB0cy5nZXRMb3dCaXRzKCkgKyBcIilcIjtcbn07XG5cbmlkRm9yT3AgPSBmdW5jdGlvbiAob3ApIHtcbiAgaWYgKG9wLm9wID09PSAnZCcpXG4gICAgcmV0dXJuIG9wLm8uX2lkO1xuICBlbHNlIGlmIChvcC5vcCA9PT0gJ2knKVxuICAgIHJldHVybiBvcC5vLl9pZDtcbiAgZWxzZSBpZiAob3Aub3AgPT09ICd1JylcbiAgICByZXR1cm4gb3AubzIuX2lkO1xuICBlbHNlIGlmIChvcC5vcCA9PT0gJ2MnKVxuICAgIHRocm93IEVycm9yKFwiT3BlcmF0b3IgJ2MnIGRvZXNuJ3Qgc3VwcGx5IGFuIG9iamVjdCB3aXRoIGlkOiBcIiArXG4gICAgICAgICAgICAgICAgRUpTT04uc3RyaW5naWZ5KG9wKSk7XG4gIGVsc2VcbiAgICB0aHJvdyBFcnJvcihcIlVua25vd24gb3A6IFwiICsgRUpTT04uc3RyaW5naWZ5KG9wKSk7XG59O1xuXG5PcGxvZ0hhbmRsZSA9IGZ1bmN0aW9uIChvcGxvZ1VybCwgZGJOYW1lKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgc2VsZi5fb3Bsb2dVcmwgPSBvcGxvZ1VybDtcbiAgc2VsZi5fZGJOYW1lID0gZGJOYW1lO1xuXG4gIHNlbGYuX29wbG9nTGFzdEVudHJ5Q29ubmVjdGlvbiA9IG51bGw7XG4gIHNlbGYuX29wbG9nVGFpbENvbm5lY3Rpb24gPSBudWxsO1xuICBzZWxmLl9zdG9wcGVkID0gZmFsc2U7XG4gIHNlbGYuX3RhaWxIYW5kbGUgPSBudWxsO1xuICBzZWxmLl9yZWFkeUZ1dHVyZSA9IG5ldyBGdXR1cmUoKTtcbiAgc2VsZi5fY3Jvc3NiYXIgPSBuZXcgRERQU2VydmVyLl9Dcm9zc2Jhcih7XG4gICAgZmFjdFBhY2thZ2U6IFwibW9uZ28tbGl2ZWRhdGFcIiwgZmFjdE5hbWU6IFwib3Bsb2ctd2F0Y2hlcnNcIlxuICB9KTtcbiAgc2VsZi5fYmFzZU9wbG9nU2VsZWN0b3IgPSB7XG4gICAgbnM6IG5ldyBSZWdFeHAoXCJeKD86XCIgKyBbXG4gICAgICBNZXRlb3IuX2VzY2FwZVJlZ0V4cChzZWxmLl9kYk5hbWUgKyBcIi5cIiksXG4gICAgICBNZXRlb3IuX2VzY2FwZVJlZ0V4cChcImFkbWluLiRjbWRcIiksXG4gICAgXS5qb2luKFwifFwiKSArIFwiKVwiKSxcblxuICAgICRvcjogW1xuICAgICAgeyBvcDogeyAkaW46IFsnaScsICd1JywgJ2QnXSB9IH0sXG4gICAgICAvLyBkcm9wIGNvbGxlY3Rpb25cbiAgICAgIHsgb3A6ICdjJywgJ28uZHJvcCc6IHsgJGV4aXN0czogdHJ1ZSB9IH0sXG4gICAgICB7IG9wOiAnYycsICdvLmRyb3BEYXRhYmFzZSc6IDEgfSxcbiAgICAgIHsgb3A6ICdjJywgJ28uYXBwbHlPcHMnOiB7ICRleGlzdHM6IHRydWUgfSB9LFxuICAgIF1cbiAgfTtcblxuICAvLyBEYXRhIHN0cnVjdHVyZXMgdG8gc3VwcG9ydCB3YWl0VW50aWxDYXVnaHRVcCgpLiBFYWNoIG9wbG9nIGVudHJ5IGhhcyBhXG4gIC8vIE1vbmdvVGltZXN0YW1wIG9iamVjdCBvbiBpdCAod2hpY2ggaXMgbm90IHRoZSBzYW1lIGFzIGEgRGF0ZSAtLS0gaXQncyBhXG4gIC8vIGNvbWJpbmF0aW9uIG9mIHRpbWUgYW5kIGFuIGluY3JlbWVudGluZyBjb3VudGVyOyBzZWVcbiAgLy8gaHR0cDovL2RvY3MubW9uZ29kYi5vcmcvbWFudWFsL3JlZmVyZW5jZS9ic29uLXR5cGVzLyN0aW1lc3RhbXBzKS5cbiAgLy9cbiAgLy8gX2NhdGNoaW5nVXBGdXR1cmVzIGlzIGFuIGFycmF5IG9mIHt0czogTW9uZ29UaW1lc3RhbXAsIGZ1dHVyZTogRnV0dXJlfVxuICAvLyBvYmplY3RzLCBzb3J0ZWQgYnkgYXNjZW5kaW5nIHRpbWVzdGFtcC4gX2xhc3RQcm9jZXNzZWRUUyBpcyB0aGVcbiAgLy8gTW9uZ29UaW1lc3RhbXAgb2YgdGhlIGxhc3Qgb3Bsb2cgZW50cnkgd2UndmUgcHJvY2Vzc2VkLlxuICAvL1xuICAvLyBFYWNoIHRpbWUgd2UgY2FsbCB3YWl0VW50aWxDYXVnaHRVcCwgd2UgdGFrZSBhIHBlZWsgYXQgdGhlIGZpbmFsIG9wbG9nXG4gIC8vIGVudHJ5IGluIHRoZSBkYi4gIElmIHdlJ3ZlIGFscmVhZHkgcHJvY2Vzc2VkIGl0IChpZSwgaXQgaXMgbm90IGdyZWF0ZXIgdGhhblxuICAvLyBfbGFzdFByb2Nlc3NlZFRTKSwgd2FpdFVudGlsQ2F1Z2h0VXAgaW1tZWRpYXRlbHkgcmV0dXJucy4gT3RoZXJ3aXNlLFxuICAvLyB3YWl0VW50aWxDYXVnaHRVcCBtYWtlcyBhIG5ldyBGdXR1cmUgYW5kIGluc2VydHMgaXQgYWxvbmcgd2l0aCB0aGUgZmluYWxcbiAgLy8gdGltZXN0YW1wIGVudHJ5IHRoYXQgaXQgcmVhZCwgaW50byBfY2F0Y2hpbmdVcEZ1dHVyZXMuIHdhaXRVbnRpbENhdWdodFVwXG4gIC8vIHRoZW4gd2FpdHMgb24gdGhhdCBmdXR1cmUsIHdoaWNoIGlzIHJlc29sdmVkIG9uY2UgX2xhc3RQcm9jZXNzZWRUUyBpc1xuICAvLyBpbmNyZW1lbnRlZCB0byBiZSBwYXN0IGl0cyB0aW1lc3RhbXAgYnkgdGhlIHdvcmtlciBmaWJlci5cbiAgLy9cbiAgLy8gWFhYIHVzZSBhIHByaW9yaXR5IHF1ZXVlIG9yIHNvbWV0aGluZyBlbHNlIHRoYXQncyBmYXN0ZXIgdGhhbiBhbiBhcnJheVxuICBzZWxmLl9jYXRjaGluZ1VwRnV0dXJlcyA9IFtdO1xuICBzZWxmLl9sYXN0UHJvY2Vzc2VkVFMgPSBudWxsO1xuXG4gIHNlbGYuX29uU2tpcHBlZEVudHJpZXNIb29rID0gbmV3IEhvb2soe1xuICAgIGRlYnVnUHJpbnRFeGNlcHRpb25zOiBcIm9uU2tpcHBlZEVudHJpZXMgY2FsbGJhY2tcIlxuICB9KTtcblxuICBzZWxmLl9lbnRyeVF1ZXVlID0gbmV3IE1ldGVvci5fRG91YmxlRW5kZWRRdWV1ZSgpO1xuICBzZWxmLl93b3JrZXJBY3RpdmUgPSBmYWxzZTtcblxuICBzZWxmLl9zdGFydFRhaWxpbmcoKTtcbn07XG5cbl8uZXh0ZW5kKE9wbG9nSGFuZGxlLnByb3RvdHlwZSwge1xuICBzdG9wOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIGlmIChzZWxmLl9zdG9wcGVkKVxuICAgICAgcmV0dXJuO1xuICAgIHNlbGYuX3N0b3BwZWQgPSB0cnVlO1xuICAgIGlmIChzZWxmLl90YWlsSGFuZGxlKVxuICAgICAgc2VsZi5fdGFpbEhhbmRsZS5zdG9wKCk7XG4gICAgLy8gWFhYIHNob3VsZCBjbG9zZSBjb25uZWN0aW9ucyB0b29cbiAgfSxcbiAgb25PcGxvZ0VudHJ5OiBmdW5jdGlvbiAodHJpZ2dlciwgY2FsbGJhY2spIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgaWYgKHNlbGYuX3N0b3BwZWQpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYWxsZWQgb25PcGxvZ0VudHJ5IG9uIHN0b3BwZWQgaGFuZGxlIVwiKTtcblxuICAgIC8vIENhbGxpbmcgb25PcGxvZ0VudHJ5IHJlcXVpcmVzIHVzIHRvIHdhaXQgZm9yIHRoZSB0YWlsaW5nIHRvIGJlIHJlYWR5LlxuICAgIHNlbGYuX3JlYWR5RnV0dXJlLndhaXQoKTtcblxuICAgIHZhciBvcmlnaW5hbENhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgY2FsbGJhY2sgPSBNZXRlb3IuYmluZEVudmlyb25tZW50KGZ1bmN0aW9uIChub3RpZmljYXRpb24pIHtcbiAgICAgIG9yaWdpbmFsQ2FsbGJhY2sobm90aWZpY2F0aW9uKTtcbiAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICBNZXRlb3IuX2RlYnVnKFwiRXJyb3IgaW4gb3Bsb2cgY2FsbGJhY2tcIiwgZXJyKTtcbiAgICB9KTtcbiAgICB2YXIgbGlzdGVuSGFuZGxlID0gc2VsZi5fY3Jvc3NiYXIubGlzdGVuKHRyaWdnZXIsIGNhbGxiYWNrKTtcbiAgICByZXR1cm4ge1xuICAgICAgc3RvcDogZnVuY3Rpb24gKCkge1xuICAgICAgICBsaXN0ZW5IYW5kbGUuc3RvcCgpO1xuICAgICAgfVxuICAgIH07XG4gIH0sXG4gIC8vIFJlZ2lzdGVyIGEgY2FsbGJhY2sgdG8gYmUgaW52b2tlZCBhbnkgdGltZSB3ZSBza2lwIG9wbG9nIGVudHJpZXMgKGVnLFxuICAvLyBiZWNhdXNlIHdlIGFyZSB0b28gZmFyIGJlaGluZCkuXG4gIG9uU2tpcHBlZEVudHJpZXM6IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBpZiAoc2VsZi5fc3RvcHBlZClcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbGxlZCBvblNraXBwZWRFbnRyaWVzIG9uIHN0b3BwZWQgaGFuZGxlIVwiKTtcbiAgICByZXR1cm4gc2VsZi5fb25Ta2lwcGVkRW50cmllc0hvb2sucmVnaXN0ZXIoY2FsbGJhY2spO1xuICB9LFxuICAvLyBDYWxscyBgY2FsbGJhY2tgIG9uY2UgdGhlIG9wbG9nIGhhcyBiZWVuIHByb2Nlc3NlZCB1cCB0byBhIHBvaW50IHRoYXQgaXNcbiAgLy8gcm91Z2hseSBcIm5vd1wiOiBzcGVjaWZpY2FsbHksIG9uY2Ugd2UndmUgcHJvY2Vzc2VkIGFsbCBvcHMgdGhhdCBhcmVcbiAgLy8gY3VycmVudGx5IHZpc2libGUuXG4gIC8vIFhYWCBiZWNvbWUgY29udmluY2VkIHRoYXQgdGhpcyBpcyBhY3R1YWxseSBzYWZlIGV2ZW4gaWYgb3Bsb2dDb25uZWN0aW9uXG4gIC8vIGlzIHNvbWUga2luZCBvZiBwb29sXG4gIHdhaXRVbnRpbENhdWdodFVwOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIGlmIChzZWxmLl9zdG9wcGVkKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2FsbGVkIHdhaXRVbnRpbENhdWdodFVwIG9uIHN0b3BwZWQgaGFuZGxlIVwiKTtcblxuICAgIC8vIENhbGxpbmcgd2FpdFVudGlsQ2F1Z2h0VXAgcmVxdXJpZXMgdXMgdG8gd2FpdCBmb3IgdGhlIG9wbG9nIGNvbm5lY3Rpb24gdG9cbiAgICAvLyBiZSByZWFkeS5cbiAgICBzZWxmLl9yZWFkeUZ1dHVyZS53YWl0KCk7XG4gICAgdmFyIGxhc3RFbnRyeTtcblxuICAgIHdoaWxlICghc2VsZi5fc3RvcHBlZCkge1xuICAgICAgLy8gV2UgbmVlZCB0byBtYWtlIHRoZSBzZWxlY3RvciBhdCBsZWFzdCBhcyByZXN0cmljdGl2ZSBhcyB0aGUgYWN0dWFsXG4gICAgICAvLyB0YWlsaW5nIHNlbGVjdG9yIChpZSwgd2UgbmVlZCB0byBzcGVjaWZ5IHRoZSBEQiBuYW1lKSBvciBlbHNlIHdlIG1pZ2h0XG4gICAgICAvLyBmaW5kIGEgVFMgdGhhdCB3b24ndCBzaG93IHVwIGluIHRoZSBhY3R1YWwgdGFpbCBzdHJlYW0uXG4gICAgICB0cnkge1xuICAgICAgICBsYXN0RW50cnkgPSBzZWxmLl9vcGxvZ0xhc3RFbnRyeUNvbm5lY3Rpb24uZmluZE9uZShcbiAgICAgICAgICBPUExPR19DT0xMRUNUSU9OLCBzZWxmLl9iYXNlT3Bsb2dTZWxlY3RvcixcbiAgICAgICAgICB7ZmllbGRzOiB7dHM6IDF9LCBzb3J0OiB7JG5hdHVyYWw6IC0xfX0pO1xuICAgICAgICBicmVhaztcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gRHVyaW5nIGZhaWxvdmVyIChlZykgaWYgd2UgZ2V0IGFuIGV4Y2VwdGlvbiB3ZSBzaG91bGQgbG9nIGFuZCByZXRyeVxuICAgICAgICAvLyBpbnN0ZWFkIG9mIGNyYXNoaW5nLlxuICAgICAgICBNZXRlb3IuX2RlYnVnKFwiR290IGV4Y2VwdGlvbiB3aGlsZSByZWFkaW5nIGxhc3QgZW50cnlcIiwgZSk7XG4gICAgICAgIE1ldGVvci5fc2xlZXBGb3JNcygxMDApO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzZWxmLl9zdG9wcGVkKVxuICAgICAgcmV0dXJuO1xuXG4gICAgaWYgKCFsYXN0RW50cnkpIHtcbiAgICAgIC8vIFJlYWxseSwgbm90aGluZyBpbiB0aGUgb3Bsb2c/IFdlbGwsIHdlJ3ZlIHByb2Nlc3NlZCBldmVyeXRoaW5nLlxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciB0cyA9IGxhc3RFbnRyeS50cztcbiAgICBpZiAoIXRzKVxuICAgICAgdGhyb3cgRXJyb3IoXCJvcGxvZyBlbnRyeSB3aXRob3V0IHRzOiBcIiArIEVKU09OLnN0cmluZ2lmeShsYXN0RW50cnkpKTtcblxuICAgIGlmIChzZWxmLl9sYXN0UHJvY2Vzc2VkVFMgJiYgdHMubGVzc1RoYW5PckVxdWFsKHNlbGYuX2xhc3RQcm9jZXNzZWRUUykpIHtcbiAgICAgIC8vIFdlJ3ZlIGFscmVhZHkgY2F1Z2h0IHVwIHRvIGhlcmUuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG5cbiAgICAvLyBJbnNlcnQgdGhlIGZ1dHVyZSBpbnRvIG91ciBsaXN0LiBBbG1vc3QgYWx3YXlzLCB0aGlzIHdpbGwgYmUgYXQgdGhlIGVuZCxcbiAgICAvLyBidXQgaXQncyBjb25jZWl2YWJsZSB0aGF0IGlmIHdlIGZhaWwgb3ZlciBmcm9tIG9uZSBwcmltYXJ5IHRvIGFub3RoZXIsXG4gICAgLy8gdGhlIG9wbG9nIGVudHJpZXMgd2Ugc2VlIHdpbGwgZ28gYmFja3dhcmRzLlxuICAgIHZhciBpbnNlcnRBZnRlciA9IHNlbGYuX2NhdGNoaW5nVXBGdXR1cmVzLmxlbmd0aDtcbiAgICB3aGlsZSAoaW5zZXJ0QWZ0ZXIgLSAxID4gMCAmJiBzZWxmLl9jYXRjaGluZ1VwRnV0dXJlc1tpbnNlcnRBZnRlciAtIDFdLnRzLmdyZWF0ZXJUaGFuKHRzKSkge1xuICAgICAgaW5zZXJ0QWZ0ZXItLTtcbiAgICB9XG4gICAgdmFyIGYgPSBuZXcgRnV0dXJlO1xuICAgIHNlbGYuX2NhdGNoaW5nVXBGdXR1cmVzLnNwbGljZShpbnNlcnRBZnRlciwgMCwge3RzOiB0cywgZnV0dXJlOiBmfSk7XG4gICAgZi53YWl0KCk7XG4gIH0sXG4gIF9zdGFydFRhaWxpbmc6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgLy8gRmlyc3QsIG1ha2Ugc3VyZSB0aGF0IHdlJ3JlIHRhbGtpbmcgdG8gdGhlIGxvY2FsIGRhdGFiYXNlLlxuICAgIHZhciBtb25nb2RiVXJpID0gTnBtLnJlcXVpcmUoJ21vbmdvZGItdXJpJyk7XG4gICAgaWYgKG1vbmdvZGJVcmkucGFyc2Uoc2VsZi5fb3Bsb2dVcmwpLmRhdGFiYXNlICE9PSAnbG9jYWwnKSB7XG4gICAgICB0aHJvdyBFcnJvcihcIiRNT05HT19PUExPR19VUkwgbXVzdCBiZSBzZXQgdG8gdGhlICdsb2NhbCcgZGF0YWJhc2Ugb2YgXCIgK1xuICAgICAgICAgICAgICAgICAgXCJhIE1vbmdvIHJlcGxpY2Egc2V0XCIpO1xuICAgIH1cblxuICAgIC8vIFdlIG1ha2UgdHdvIHNlcGFyYXRlIGNvbm5lY3Rpb25zIHRvIE1vbmdvLiBUaGUgTm9kZSBNb25nbyBkcml2ZXJcbiAgICAvLyBpbXBsZW1lbnRzIGEgbmFpdmUgcm91bmQtcm9iaW4gY29ubmVjdGlvbiBwb29sOiBlYWNoIFwiY29ubmVjdGlvblwiIGlzIGFcbiAgICAvLyBwb29sIG9mIHNldmVyYWwgKDUgYnkgZGVmYXVsdCkgVENQIGNvbm5lY3Rpb25zLCBhbmQgZWFjaCByZXF1ZXN0IGlzXG4gICAgLy8gcm90YXRlZCB0aHJvdWdoIHRoZSBwb29scy4gVGFpbGFibGUgY3Vyc29yIHF1ZXJpZXMgYmxvY2sgb24gdGhlIHNlcnZlclxuICAgIC8vIHVudGlsIHRoZXJlIGlzIHNvbWUgZGF0YSB0byByZXR1cm4gKG9yIHVudGlsIGEgZmV3IHNlY29uZHMgaGF2ZVxuICAgIC8vIHBhc3NlZCkuIFNvIGlmIHRoZSBjb25uZWN0aW9uIHBvb2wgdXNlZCBmb3IgdGFpbGluZyBjdXJzb3JzIGlzIHRoZSBzYW1lXG4gICAgLy8gcG9vbCB1c2VkIGZvciBvdGhlciBxdWVyaWVzLCB0aGUgb3RoZXIgcXVlcmllcyB3aWxsIGJlIGRlbGF5ZWQgYnkgc2Vjb25kc1xuICAgIC8vIDEvNSBvZiB0aGUgdGltZS5cbiAgICAvL1xuICAgIC8vIFRoZSB0YWlsIGNvbm5lY3Rpb24gd2lsbCBvbmx5IGV2ZXIgYmUgcnVubmluZyBhIHNpbmdsZSB0YWlsIGNvbW1hbmQsIHNvXG4gICAgLy8gaXQgb25seSBuZWVkcyB0byBtYWtlIG9uZSB1bmRlcmx5aW5nIFRDUCBjb25uZWN0aW9uLlxuICAgIHNlbGYuX29wbG9nVGFpbENvbm5lY3Rpb24gPSBuZXcgTW9uZ29Db25uZWN0aW9uKFxuICAgICAgc2VsZi5fb3Bsb2dVcmwsIHtwb29sU2l6ZTogMX0pO1xuICAgIC8vIFhYWCBiZXR0ZXIgZG9jcywgYnV0OiBpdCdzIHRvIGdldCBtb25vdG9uaWMgcmVzdWx0c1xuICAgIC8vIFhYWCBpcyBpdCBzYWZlIHRvIHNheSBcImlmIHRoZXJlJ3MgYW4gaW4gZmxpZ2h0IHF1ZXJ5LCBqdXN0IHVzZSBpdHNcbiAgICAvLyAgICAgcmVzdWx0c1wiPyBJIGRvbid0IHRoaW5rIHNvIGJ1dCBzaG91bGQgY29uc2lkZXIgdGhhdFxuICAgIHNlbGYuX29wbG9nTGFzdEVudHJ5Q29ubmVjdGlvbiA9IG5ldyBNb25nb0Nvbm5lY3Rpb24oXG4gICAgICBzZWxmLl9vcGxvZ1VybCwge3Bvb2xTaXplOiAxfSk7XG5cbiAgICAvLyBOb3csIG1ha2Ugc3VyZSB0aGF0IHRoZXJlIGFjdHVhbGx5IGlzIGEgcmVwbCBzZXQgaGVyZS4gSWYgbm90LCBvcGxvZ1xuICAgIC8vIHRhaWxpbmcgd29uJ3QgZXZlciBmaW5kIGFueXRoaW5nIVxuICAgIC8vIE1vcmUgb24gdGhlIGlzTWFzdGVyRG9jXG4gICAgLy8gaHR0cHM6Ly9kb2NzLm1vbmdvZGIuY29tL21hbnVhbC9yZWZlcmVuY2UvY29tbWFuZC9pc01hc3Rlci9cbiAgICB2YXIgZiA9IG5ldyBGdXR1cmU7XG4gICAgc2VsZi5fb3Bsb2dMYXN0RW50cnlDb25uZWN0aW9uLmRiLmFkbWluKCkuY29tbWFuZChcbiAgICAgIHsgaXNtYXN0ZXI6IDEgfSwgZi5yZXNvbHZlcigpKTtcbiAgICB2YXIgaXNNYXN0ZXJEb2MgPSBmLndhaXQoKTtcblxuICAgIGlmICghKGlzTWFzdGVyRG9jICYmIGlzTWFzdGVyRG9jLnNldE5hbWUpKSB7XG4gICAgICB0aHJvdyBFcnJvcihcIiRNT05HT19PUExPR19VUkwgbXVzdCBiZSBzZXQgdG8gdGhlICdsb2NhbCcgZGF0YWJhc2Ugb2YgXCIgK1xuICAgICAgICAgICAgICAgICAgXCJhIE1vbmdvIHJlcGxpY2Egc2V0XCIpO1xuICAgIH1cblxuICAgIC8vIEZpbmQgdGhlIGxhc3Qgb3Bsb2cgZW50cnkuXG4gICAgdmFyIGxhc3RPcGxvZ0VudHJ5ID0gc2VsZi5fb3Bsb2dMYXN0RW50cnlDb25uZWN0aW9uLmZpbmRPbmUoXG4gICAgICBPUExPR19DT0xMRUNUSU9OLCB7fSwge3NvcnQ6IHskbmF0dXJhbDogLTF9LCBmaWVsZHM6IHt0czogMX19KTtcblxuICAgIHZhciBvcGxvZ1NlbGVjdG9yID0gXy5jbG9uZShzZWxmLl9iYXNlT3Bsb2dTZWxlY3Rvcik7XG4gICAgaWYgKGxhc3RPcGxvZ0VudHJ5KSB7XG4gICAgICAvLyBTdGFydCBhZnRlciB0aGUgbGFzdCBlbnRyeSB0aGF0IGN1cnJlbnRseSBleGlzdHMuXG4gICAgICBvcGxvZ1NlbGVjdG9yLnRzID0geyRndDogbGFzdE9wbG9nRW50cnkudHN9O1xuICAgICAgLy8gSWYgdGhlcmUgYXJlIGFueSBjYWxscyB0byBjYWxsV2hlblByb2Nlc3NlZExhdGVzdCBiZWZvcmUgYW55IG90aGVyXG4gICAgICAvLyBvcGxvZyBlbnRyaWVzIHNob3cgdXAsIGFsbG93IGNhbGxXaGVuUHJvY2Vzc2VkTGF0ZXN0IHRvIGNhbGwgaXRzXG4gICAgICAvLyBjYWxsYmFjayBpbW1lZGlhdGVseS5cbiAgICAgIHNlbGYuX2xhc3RQcm9jZXNzZWRUUyA9IGxhc3RPcGxvZ0VudHJ5LnRzO1xuICAgIH1cblxuICAgIHZhciBjdXJzb3JEZXNjcmlwdGlvbiA9IG5ldyBDdXJzb3JEZXNjcmlwdGlvbihcbiAgICAgIE9QTE9HX0NPTExFQ1RJT04sIG9wbG9nU2VsZWN0b3IsIHt0YWlsYWJsZTogdHJ1ZX0pO1xuXG4gICAgLy8gU3RhcnQgdGFpbGluZyB0aGUgb3Bsb2cuXG4gICAgLy9cbiAgICAvLyBXZSByZXN0YXJ0IHRoZSBsb3ctbGV2ZWwgb3Bsb2cgcXVlcnkgZXZlcnkgMzAgc2Vjb25kcyBpZiB3ZSBkaWRuJ3QgZ2V0IGFcbiAgICAvLyBkb2MuIFRoaXMgaXMgYSB3b3JrYXJvdW5kIGZvciAjODU5ODogdGhlIE5vZGUgTW9uZ28gZHJpdmVyIGhhcyBhdCBsZWFzdFxuICAgIC8vIG9uZSBidWcgdGhhdCBjYW4gbGVhZCB0byBxdWVyeSBjYWxsYmFja3MgbmV2ZXIgZ2V0dGluZyBjYWxsZWQgKGV2ZW4gd2l0aFxuICAgIC8vIGFuIGVycm9yKSB3aGVuIGxlYWRlcnNoaXAgZmFpbG92ZXIgb2NjdXIuXG4gICAgc2VsZi5fdGFpbEhhbmRsZSA9IHNlbGYuX29wbG9nVGFpbENvbm5lY3Rpb24udGFpbChcbiAgICAgIGN1cnNvckRlc2NyaXB0aW9uLFxuICAgICAgZnVuY3Rpb24gKGRvYykge1xuICAgICAgICBzZWxmLl9lbnRyeVF1ZXVlLnB1c2goZG9jKTtcbiAgICAgICAgc2VsZi5fbWF5YmVTdGFydFdvcmtlcigpO1xuICAgICAgfSxcbiAgICAgIFRBSUxfVElNRU9VVFxuICAgICk7XG4gICAgc2VsZi5fcmVhZHlGdXR1cmUucmV0dXJuKCk7XG4gIH0sXG5cbiAgX21heWJlU3RhcnRXb3JrZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgaWYgKHNlbGYuX3dvcmtlckFjdGl2ZSkgcmV0dXJuO1xuICAgIHNlbGYuX3dvcmtlckFjdGl2ZSA9IHRydWU7XG5cbiAgICBNZXRlb3IuZGVmZXIoZnVuY3Rpb24gKCkge1xuICAgICAgLy8gTWF5IGJlIGNhbGxlZCByZWN1cnNpdmVseSBpbiBjYXNlIG9mIHRyYW5zYWN0aW9ucy5cbiAgICAgIGZ1bmN0aW9uIGhhbmRsZURvYyhkb2MpIHtcbiAgICAgICAgaWYgKGRvYy5ucyA9PT0gXCJhZG1pbi4kY21kXCIpIHtcbiAgICAgICAgICBpZiAoZG9jLm8uYXBwbHlPcHMpIHtcbiAgICAgICAgICAgIC8vIFRoaXMgd2FzIGEgc3VjY2Vzc2Z1bCB0cmFuc2FjdGlvbiwgc28gd2UgbmVlZCB0byBhcHBseSB0aGVcbiAgICAgICAgICAgIC8vIG9wZXJhdGlvbnMgdGhhdCB3ZXJlIGludm9sdmVkLlxuICAgICAgICAgICAgbGV0IG5leHRUaW1lc3RhbXAgPSBkb2MudHM7XG4gICAgICAgICAgICBkb2Muby5hcHBseU9wcy5mb3JFYWNoKG9wID0+IHtcbiAgICAgICAgICAgICAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9tZXRlb3IvbWV0ZW9yL2lzc3Vlcy8xMDQyMC5cbiAgICAgICAgICAgICAgaWYgKCFvcC50cykge1xuICAgICAgICAgICAgICAgIG9wLnRzID0gbmV4dFRpbWVzdGFtcDtcbiAgICAgICAgICAgICAgICBuZXh0VGltZXN0YW1wID0gbmV4dFRpbWVzdGFtcC5hZGQoVGltZXN0YW1wLk9ORSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaGFuZGxlRG9jKG9wKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duIGNvbW1hbmQgXCIgKyBFSlNPTi5zdHJpbmdpZnkoZG9jKSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB0cmlnZ2VyID0ge1xuICAgICAgICAgIGRyb3BDb2xsZWN0aW9uOiBmYWxzZSxcbiAgICAgICAgICBkcm9wRGF0YWJhc2U6IGZhbHNlLFxuICAgICAgICAgIG9wOiBkb2MsXG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKHR5cGVvZiBkb2MubnMgPT09IFwic3RyaW5nXCIgJiZcbiAgICAgICAgICAgIGRvYy5ucy5zdGFydHNXaXRoKHNlbGYuX2RiTmFtZSArIFwiLlwiKSkge1xuICAgICAgICAgIHRyaWdnZXIuY29sbGVjdGlvbiA9IGRvYy5ucy5zbGljZShzZWxmLl9kYk5hbWUubGVuZ3RoICsgMSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJcyBpdCBhIHNwZWNpYWwgY29tbWFuZCBhbmQgdGhlIGNvbGxlY3Rpb24gbmFtZSBpcyBoaWRkZW5cbiAgICAgICAgLy8gc29tZXdoZXJlIGluIG9wZXJhdG9yP1xuICAgICAgICBpZiAodHJpZ2dlci5jb2xsZWN0aW9uID09PSBcIiRjbWRcIikge1xuICAgICAgICAgIGlmIChkb2Muby5kcm9wRGF0YWJhc2UpIHtcbiAgICAgICAgICAgIGRlbGV0ZSB0cmlnZ2VyLmNvbGxlY3Rpb247XG4gICAgICAgICAgICB0cmlnZ2VyLmRyb3BEYXRhYmFzZSA9IHRydWU7XG4gICAgICAgICAgfSBlbHNlIGlmIChfLmhhcyhkb2MubywgXCJkcm9wXCIpKSB7XG4gICAgICAgICAgICB0cmlnZ2VyLmNvbGxlY3Rpb24gPSBkb2Muby5kcm9wO1xuICAgICAgICAgICAgdHJpZ2dlci5kcm9wQ29sbGVjdGlvbiA9IHRydWU7XG4gICAgICAgICAgICB0cmlnZ2VyLmlkID0gbnVsbDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJVbmtub3duIGNvbW1hbmQgXCIgKyBFSlNPTi5zdHJpbmdpZnkoZG9jKSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gQWxsIG90aGVyIG9wcyBoYXZlIGFuIGlkLlxuICAgICAgICAgIHRyaWdnZXIuaWQgPSBpZEZvck9wKGRvYyk7XG4gICAgICAgIH1cblxuICAgICAgICBzZWxmLl9jcm9zc2Jhci5maXJlKHRyaWdnZXIpO1xuICAgICAgfVxuXG4gICAgICB0cnkge1xuICAgICAgICB3aGlsZSAoISBzZWxmLl9zdG9wcGVkICYmXG4gICAgICAgICAgICAgICAhIHNlbGYuX2VudHJ5UXVldWUuaXNFbXB0eSgpKSB7XG4gICAgICAgICAgLy8gQXJlIHdlIHRvbyBmYXIgYmVoaW5kPyBKdXN0IHRlbGwgb3VyIG9ic2VydmVycyB0aGF0IHRoZXkgbmVlZCB0b1xuICAgICAgICAgIC8vIHJlcG9sbCwgYW5kIGRyb3Agb3VyIHF1ZXVlLlxuICAgICAgICAgIGlmIChzZWxmLl9lbnRyeVF1ZXVlLmxlbmd0aCA+IFRPT19GQVJfQkVISU5EKSB7XG4gICAgICAgICAgICB2YXIgbGFzdEVudHJ5ID0gc2VsZi5fZW50cnlRdWV1ZS5wb3AoKTtcbiAgICAgICAgICAgIHNlbGYuX2VudHJ5UXVldWUuY2xlYXIoKTtcblxuICAgICAgICAgICAgc2VsZi5fb25Ta2lwcGVkRW50cmllc0hvb2suZWFjaChmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gRnJlZSBhbnkgd2FpdFVudGlsQ2F1Z2h0VXAoKSBjYWxscyB0aGF0IHdlcmUgd2FpdGluZyBmb3IgdXMgdG9cbiAgICAgICAgICAgIC8vIHBhc3Mgc29tZXRoaW5nIHRoYXQgd2UganVzdCBza2lwcGVkLlxuICAgICAgICAgICAgc2VsZi5fc2V0TGFzdFByb2Nlc3NlZFRTKGxhc3RFbnRyeS50cyk7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zdCBkb2MgPSBzZWxmLl9lbnRyeVF1ZXVlLnNoaWZ0KCk7XG5cbiAgICAgICAgICAvLyBGaXJlIHRyaWdnZXIocykgZm9yIHRoaXMgZG9jLlxuICAgICAgICAgIGhhbmRsZURvYyhkb2MpO1xuXG4gICAgICAgICAgLy8gTm93IHRoYXQgd2UndmUgcHJvY2Vzc2VkIHRoaXMgb3BlcmF0aW9uLCBwcm9jZXNzIHBlbmRpbmdcbiAgICAgICAgICAvLyBzZXF1ZW5jZXJzLlxuICAgICAgICAgIGlmIChkb2MudHMpIHtcbiAgICAgICAgICAgIHNlbGYuX3NldExhc3RQcm9jZXNzZWRUUyhkb2MudHMpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBFcnJvcihcIm9wbG9nIGVudHJ5IHdpdGhvdXQgdHM6IFwiICsgRUpTT04uc3RyaW5naWZ5KGRvYykpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgc2VsZi5fd29ya2VyQWN0aXZlID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG5cbiAgX3NldExhc3RQcm9jZXNzZWRUUzogZnVuY3Rpb24gKHRzKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHNlbGYuX2xhc3RQcm9jZXNzZWRUUyA9IHRzO1xuICAgIHdoaWxlICghXy5pc0VtcHR5KHNlbGYuX2NhdGNoaW5nVXBGdXR1cmVzKSAmJiBzZWxmLl9jYXRjaGluZ1VwRnV0dXJlc1swXS50cy5sZXNzVGhhbk9yRXF1YWwoc2VsZi5fbGFzdFByb2Nlc3NlZFRTKSkge1xuICAgICAgdmFyIHNlcXVlbmNlciA9IHNlbGYuX2NhdGNoaW5nVXBGdXR1cmVzLnNoaWZ0KCk7XG4gICAgICBzZXF1ZW5jZXIuZnV0dXJlLnJldHVybigpO1xuICAgIH1cbiAgfSxcblxuICAvL01ldGhvZHMgdXNlZCBvbiB0ZXN0cyB0byBkaW5hbWljYWxseSBjaGFuZ2UgVE9PX0ZBUl9CRUhJTkRcbiAgX2RlZmluZVRvb0ZhckJlaGluZDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICBUT09fRkFSX0JFSElORCA9IHZhbHVlO1xuICB9LFxuICBfcmVzZXRUb29GYXJCZWhpbmQ6IGZ1bmN0aW9uKCkge1xuICAgIFRPT19GQVJfQkVISU5EID0gcHJvY2Vzcy5lbnYuTUVURU9SX09QTE9HX1RPT19GQVJfQkVISU5EIHx8IDIwMDA7XG4gIH1cbn0pO1xuIiwidmFyIEZ1dHVyZSA9IE5wbS5yZXF1aXJlKCdmaWJlcnMvZnV0dXJlJyk7XG5cbk9ic2VydmVNdWx0aXBsZXhlciA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICBpZiAoIW9wdGlvbnMgfHwgIV8uaGFzKG9wdGlvbnMsICdvcmRlcmVkJykpXG4gICAgdGhyb3cgRXJyb3IoXCJtdXN0IHNwZWNpZmllZCBvcmRlcmVkXCIpO1xuXG4gIFBhY2thZ2VbJ2ZhY3RzLWJhc2UnXSAmJiBQYWNrYWdlWydmYWN0cy1iYXNlJ10uRmFjdHMuaW5jcmVtZW50U2VydmVyRmFjdChcbiAgICBcIm1vbmdvLWxpdmVkYXRhXCIsIFwib2JzZXJ2ZS1tdWx0aXBsZXhlcnNcIiwgMSk7XG5cbiAgc2VsZi5fb3JkZXJlZCA9IG9wdGlvbnMub3JkZXJlZDtcbiAgc2VsZi5fb25TdG9wID0gb3B0aW9ucy5vblN0b3AgfHwgZnVuY3Rpb24gKCkge307XG4gIHNlbGYuX3F1ZXVlID0gbmV3IE1ldGVvci5fU3luY2hyb25vdXNRdWV1ZSgpO1xuICBzZWxmLl9oYW5kbGVzID0ge307XG4gIHNlbGYuX3JlYWR5RnV0dXJlID0gbmV3IEZ1dHVyZTtcbiAgc2VsZi5fY2FjaGUgPSBuZXcgTG9jYWxDb2xsZWN0aW9uLl9DYWNoaW5nQ2hhbmdlT2JzZXJ2ZXIoe1xuICAgIG9yZGVyZWQ6IG9wdGlvbnMub3JkZXJlZH0pO1xuICAvLyBOdW1iZXIgb2YgYWRkSGFuZGxlQW5kU2VuZEluaXRpYWxBZGRzIHRhc2tzIHNjaGVkdWxlZCBidXQgbm90IHlldFxuICAvLyBydW5uaW5nLiByZW1vdmVIYW5kbGUgdXNlcyB0aGlzIHRvIGtub3cgaWYgaXQncyB0aW1lIHRvIGNhbGwgdGhlIG9uU3RvcFxuICAvLyBjYWxsYmFjay5cbiAgc2VsZi5fYWRkSGFuZGxlVGFza3NTY2hlZHVsZWRCdXROb3RQZXJmb3JtZWQgPSAwO1xuXG4gIF8uZWFjaChzZWxmLmNhbGxiYWNrTmFtZXMoKSwgZnVuY3Rpb24gKGNhbGxiYWNrTmFtZSkge1xuICAgIHNlbGZbY2FsbGJhY2tOYW1lXSA9IGZ1bmN0aW9uICgvKiAuLi4gKi8pIHtcbiAgICAgIHNlbGYuX2FwcGx5Q2FsbGJhY2soY2FsbGJhY2tOYW1lLCBfLnRvQXJyYXkoYXJndW1lbnRzKSk7XG4gICAgfTtcbiAgfSk7XG59O1xuXG5fLmV4dGVuZChPYnNlcnZlTXVsdGlwbGV4ZXIucHJvdG90eXBlLCB7XG4gIGFkZEhhbmRsZUFuZFNlbmRJbml0aWFsQWRkczogZnVuY3Rpb24gKGhhbmRsZSkge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIC8vIENoZWNrIHRoaXMgYmVmb3JlIGNhbGxpbmcgcnVuVGFzayAoZXZlbiB0aG91Z2ggcnVuVGFzayBkb2VzIHRoZSBzYW1lXG4gICAgLy8gY2hlY2spIHNvIHRoYXQgd2UgZG9uJ3QgbGVhayBhbiBPYnNlcnZlTXVsdGlwbGV4ZXIgb24gZXJyb3IgYnlcbiAgICAvLyBpbmNyZW1lbnRpbmcgX2FkZEhhbmRsZVRhc2tzU2NoZWR1bGVkQnV0Tm90UGVyZm9ybWVkIGFuZCBuZXZlclxuICAgIC8vIGRlY3JlbWVudGluZyBpdC5cbiAgICBpZiAoIXNlbGYuX3F1ZXVlLnNhZmVUb1J1blRhc2soKSlcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbid0IGNhbGwgb2JzZXJ2ZUNoYW5nZXMgZnJvbSBhbiBvYnNlcnZlIGNhbGxiYWNrIG9uIHRoZSBzYW1lIHF1ZXJ5XCIpO1xuICAgICsrc2VsZi5fYWRkSGFuZGxlVGFza3NTY2hlZHVsZWRCdXROb3RQZXJmb3JtZWQ7XG5cbiAgICBQYWNrYWdlWydmYWN0cy1iYXNlJ10gJiYgUGFja2FnZVsnZmFjdHMtYmFzZSddLkZhY3RzLmluY3JlbWVudFNlcnZlckZhY3QoXG4gICAgICBcIm1vbmdvLWxpdmVkYXRhXCIsIFwib2JzZXJ2ZS1oYW5kbGVzXCIsIDEpO1xuXG4gICAgc2VsZi5fcXVldWUucnVuVGFzayhmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLl9oYW5kbGVzW2hhbmRsZS5faWRdID0gaGFuZGxlO1xuICAgICAgLy8gU2VuZCBvdXQgd2hhdGV2ZXIgYWRkcyB3ZSBoYXZlIHNvIGZhciAod2hldGhlciBvciBub3Qgd2UgdGhlXG4gICAgICAvLyBtdWx0aXBsZXhlciBpcyByZWFkeSkuXG4gICAgICBzZWxmLl9zZW5kQWRkcyhoYW5kbGUpO1xuICAgICAgLS1zZWxmLl9hZGRIYW5kbGVUYXNrc1NjaGVkdWxlZEJ1dE5vdFBlcmZvcm1lZDtcbiAgICB9KTtcbiAgICAvLyAqb3V0c2lkZSogdGhlIHRhc2ssIHNpbmNlIG90aGVyd2lzZSB3ZSdkIGRlYWRsb2NrXG4gICAgc2VsZi5fcmVhZHlGdXR1cmUud2FpdCgpO1xuICB9LFxuXG4gIC8vIFJlbW92ZSBhbiBvYnNlcnZlIGhhbmRsZS4gSWYgaXQgd2FzIHRoZSBsYXN0IG9ic2VydmUgaGFuZGxlLCBjYWxsIHRoZVxuICAvLyBvblN0b3AgY2FsbGJhY2s7IHlvdSBjYW5ub3QgYWRkIGFueSBtb3JlIG9ic2VydmUgaGFuZGxlcyBhZnRlciB0aGlzLlxuICAvL1xuICAvLyBUaGlzIGlzIG5vdCBzeW5jaHJvbml6ZWQgd2l0aCBwb2xscyBhbmQgaGFuZGxlIGFkZGl0aW9uczogdGhpcyBtZWFucyB0aGF0XG4gIC8vIHlvdSBjYW4gc2FmZWx5IGNhbGwgaXQgZnJvbSB3aXRoaW4gYW4gb2JzZXJ2ZSBjYWxsYmFjaywgYnV0IGl0IGFsc28gbWVhbnNcbiAgLy8gdGhhdCB3ZSBoYXZlIHRvIGJlIGNhcmVmdWwgd2hlbiB3ZSBpdGVyYXRlIG92ZXIgX2hhbmRsZXMuXG4gIHJlbW92ZUhhbmRsZTogZnVuY3Rpb24gKGlkKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgLy8gVGhpcyBzaG91bGQgbm90IGJlIHBvc3NpYmxlOiB5b3UgY2FuIG9ubHkgY2FsbCByZW1vdmVIYW5kbGUgYnkgaGF2aW5nXG4gICAgLy8gYWNjZXNzIHRvIHRoZSBPYnNlcnZlSGFuZGxlLCB3aGljaCBpc24ndCByZXR1cm5lZCB0byB1c2VyIGNvZGUgdW50aWwgdGhlXG4gICAgLy8gbXVsdGlwbGV4IGlzIHJlYWR5LlxuICAgIGlmICghc2VsZi5fcmVhZHkoKSlcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbid0IHJlbW92ZSBoYW5kbGVzIHVudGlsIHRoZSBtdWx0aXBsZXggaXMgcmVhZHlcIik7XG5cbiAgICBkZWxldGUgc2VsZi5faGFuZGxlc1tpZF07XG5cbiAgICBQYWNrYWdlWydmYWN0cy1iYXNlJ10gJiYgUGFja2FnZVsnZmFjdHMtYmFzZSddLkZhY3RzLmluY3JlbWVudFNlcnZlckZhY3QoXG4gICAgICBcIm1vbmdvLWxpdmVkYXRhXCIsIFwib2JzZXJ2ZS1oYW5kbGVzXCIsIC0xKTtcblxuICAgIGlmIChfLmlzRW1wdHkoc2VsZi5faGFuZGxlcykgJiZcbiAgICAgICAgc2VsZi5fYWRkSGFuZGxlVGFza3NTY2hlZHVsZWRCdXROb3RQZXJmb3JtZWQgPT09IDApIHtcbiAgICAgIHNlbGYuX3N0b3AoKTtcbiAgICB9XG4gIH0sXG4gIF9zdG9wOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIC8vIEl0IHNob3VsZG4ndCBiZSBwb3NzaWJsZSBmb3IgdXMgdG8gc3RvcCB3aGVuIGFsbCBvdXIgaGFuZGxlcyBzdGlsbFxuICAgIC8vIGhhdmVuJ3QgYmVlbiByZXR1cm5lZCBmcm9tIG9ic2VydmVDaGFuZ2VzIVxuICAgIGlmICghIHNlbGYuX3JlYWR5KCkgJiYgISBvcHRpb25zLmZyb21RdWVyeUVycm9yKVxuICAgICAgdGhyb3cgRXJyb3IoXCJzdXJwcmlzaW5nIF9zdG9wOiBub3QgcmVhZHlcIik7XG5cbiAgICAvLyBDYWxsIHN0b3AgY2FsbGJhY2sgKHdoaWNoIGtpbGxzIHRoZSB1bmRlcmx5aW5nIHByb2Nlc3Mgd2hpY2ggc2VuZHMgdXNcbiAgICAvLyBjYWxsYmFja3MgYW5kIHJlbW92ZXMgdXMgZnJvbSB0aGUgY29ubmVjdGlvbidzIGRpY3Rpb25hcnkpLlxuICAgIHNlbGYuX29uU3RvcCgpO1xuICAgIFBhY2thZ2VbJ2ZhY3RzLWJhc2UnXSAmJiBQYWNrYWdlWydmYWN0cy1iYXNlJ10uRmFjdHMuaW5jcmVtZW50U2VydmVyRmFjdChcbiAgICAgIFwibW9uZ28tbGl2ZWRhdGFcIiwgXCJvYnNlcnZlLW11bHRpcGxleGVyc1wiLCAtMSk7XG5cbiAgICAvLyBDYXVzZSBmdXR1cmUgYWRkSGFuZGxlQW5kU2VuZEluaXRpYWxBZGRzIGNhbGxzIHRvIHRocm93IChidXQgdGhlIG9uU3RvcFxuICAgIC8vIGNhbGxiYWNrIHNob3VsZCBtYWtlIG91ciBjb25uZWN0aW9uIGZvcmdldCBhYm91dCB1cykuXG4gICAgc2VsZi5faGFuZGxlcyA9IG51bGw7XG4gIH0sXG5cbiAgLy8gQWxsb3dzIGFsbCBhZGRIYW5kbGVBbmRTZW5kSW5pdGlhbEFkZHMgY2FsbHMgdG8gcmV0dXJuLCBvbmNlIGFsbCBwcmVjZWRpbmdcbiAgLy8gYWRkcyBoYXZlIGJlZW4gcHJvY2Vzc2VkLiBEb2VzIG5vdCBibG9jay5cbiAgcmVhZHk6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgc2VsZi5fcXVldWUucXVldWVUYXNrKGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChzZWxmLl9yZWFkeSgpKVxuICAgICAgICB0aHJvdyBFcnJvcihcImNhbid0IG1ha2UgT2JzZXJ2ZU11bHRpcGxleCByZWFkeSB0d2ljZSFcIik7XG4gICAgICBzZWxmLl9yZWFkeUZ1dHVyZS5yZXR1cm4oKTtcbiAgICB9KTtcbiAgfSxcblxuICAvLyBJZiB0cnlpbmcgdG8gZXhlY3V0ZSB0aGUgcXVlcnkgcmVzdWx0cyBpbiBhbiBlcnJvciwgY2FsbCB0aGlzLiBUaGlzIGlzXG4gIC8vIGludGVuZGVkIGZvciBwZXJtYW5lbnQgZXJyb3JzLCBub3QgdHJhbnNpZW50IG5ldHdvcmsgZXJyb3JzIHRoYXQgY291bGQgYmVcbiAgLy8gZml4ZWQuIEl0IHNob3VsZCBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgcmVhZHkoKSwgYmVjYXVzZSBpZiB5b3UgY2FsbGVkIHJlYWR5XG4gIC8vIHRoYXQgbWVhbnQgdGhhdCB5b3UgbWFuYWdlZCB0byBydW4gdGhlIHF1ZXJ5IG9uY2UuIEl0IHdpbGwgc3RvcCB0aGlzXG4gIC8vIE9ic2VydmVNdWx0aXBsZXggYW5kIGNhdXNlIGFkZEhhbmRsZUFuZFNlbmRJbml0aWFsQWRkcyBjYWxscyAoYW5kIHRodXNcbiAgLy8gb2JzZXJ2ZUNoYW5nZXMgY2FsbHMpIHRvIHRocm93IHRoZSBlcnJvci5cbiAgcXVlcnlFcnJvcjogZnVuY3Rpb24gKGVycikge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBzZWxmLl9xdWV1ZS5ydW5UYXNrKGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChzZWxmLl9yZWFkeSgpKVxuICAgICAgICB0aHJvdyBFcnJvcihcImNhbid0IGNsYWltIHF1ZXJ5IGhhcyBhbiBlcnJvciBhZnRlciBpdCB3b3JrZWQhXCIpO1xuICAgICAgc2VsZi5fc3RvcCh7ZnJvbVF1ZXJ5RXJyb3I6IHRydWV9KTtcbiAgICAgIHNlbGYuX3JlYWR5RnV0dXJlLnRocm93KGVycik7XG4gICAgfSk7XG4gIH0sXG5cbiAgLy8gQ2FsbHMgXCJjYlwiIG9uY2UgdGhlIGVmZmVjdHMgb2YgYWxsIFwicmVhZHlcIiwgXCJhZGRIYW5kbGVBbmRTZW5kSW5pdGlhbEFkZHNcIlxuICAvLyBhbmQgb2JzZXJ2ZSBjYWxsYmFja3Mgd2hpY2ggY2FtZSBiZWZvcmUgdGhpcyBjYWxsIGhhdmUgYmVlbiBwcm9wYWdhdGVkIHRvXG4gIC8vIGFsbCBoYW5kbGVzLiBcInJlYWR5XCIgbXVzdCBoYXZlIGFscmVhZHkgYmVlbiBjYWxsZWQgb24gdGhpcyBtdWx0aXBsZXhlci5cbiAgb25GbHVzaDogZnVuY3Rpb24gKGNiKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHNlbGYuX3F1ZXVlLnF1ZXVlVGFzayhmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoIXNlbGYuX3JlYWR5KCkpXG4gICAgICAgIHRocm93IEVycm9yKFwib25seSBjYWxsIG9uRmx1c2ggb24gYSBtdWx0aXBsZXhlciB0aGF0IHdpbGwgYmUgcmVhZHlcIik7XG4gICAgICBjYigpO1xuICAgIH0pO1xuICB9LFxuICBjYWxsYmFja05hbWVzOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIGlmIChzZWxmLl9vcmRlcmVkKVxuICAgICAgcmV0dXJuIFtcImFkZGVkQmVmb3JlXCIsIFwiY2hhbmdlZFwiLCBcIm1vdmVkQmVmb3JlXCIsIFwicmVtb3ZlZFwiXTtcbiAgICBlbHNlXG4gICAgICByZXR1cm4gW1wiYWRkZWRcIiwgXCJjaGFuZ2VkXCIsIFwicmVtb3ZlZFwiXTtcbiAgfSxcbiAgX3JlYWR5OiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3JlYWR5RnV0dXJlLmlzUmVzb2x2ZWQoKTtcbiAgfSxcbiAgX2FwcGx5Q2FsbGJhY2s6IGZ1bmN0aW9uIChjYWxsYmFja05hbWUsIGFyZ3MpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgc2VsZi5fcXVldWUucXVldWVUYXNrKGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIElmIHdlIHN0b3BwZWQgaW4gdGhlIG1lYW50aW1lLCBkbyBub3RoaW5nLlxuICAgICAgaWYgKCFzZWxmLl9oYW5kbGVzKVxuICAgICAgICByZXR1cm47XG5cbiAgICAgIC8vIEZpcnN0LCBhcHBseSB0aGUgY2hhbmdlIHRvIHRoZSBjYWNoZS5cbiAgICAgIC8vIFhYWCBXZSBjb3VsZCBtYWtlIGFwcGx5Q2hhbmdlIGNhbGxiYWNrcyBwcm9taXNlIG5vdCB0byBoYW5nIG9uIHRvIGFueVxuICAgICAgLy8gc3RhdGUgZnJvbSB0aGVpciBhcmd1bWVudHMgKGFzc3VtaW5nIHRoYXQgdGhlaXIgc3VwcGxpZWQgY2FsbGJhY2tzXG4gICAgICAvLyBkb24ndCkgYW5kIHNraXAgdGhpcyBjbG9uZS4gQ3VycmVudGx5ICdjaGFuZ2VkJyBoYW5ncyBvbiB0byBzdGF0ZVxuICAgICAgLy8gdGhvdWdoLlxuICAgICAgc2VsZi5fY2FjaGUuYXBwbHlDaGFuZ2VbY2FsbGJhY2tOYW1lXS5hcHBseShudWxsLCBFSlNPTi5jbG9uZShhcmdzKSk7XG5cbiAgICAgIC8vIElmIHdlIGhhdmVuJ3QgZmluaXNoZWQgdGhlIGluaXRpYWwgYWRkcywgdGhlbiB3ZSBzaG91bGQgb25seSBiZSBnZXR0aW5nXG4gICAgICAvLyBhZGRzLlxuICAgICAgaWYgKCFzZWxmLl9yZWFkeSgpICYmXG4gICAgICAgICAgKGNhbGxiYWNrTmFtZSAhPT0gJ2FkZGVkJyAmJiBjYWxsYmFja05hbWUgIT09ICdhZGRlZEJlZm9yZScpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkdvdCBcIiArIGNhbGxiYWNrTmFtZSArIFwiIGR1cmluZyBpbml0aWFsIGFkZHNcIik7XG4gICAgICB9XG5cbiAgICAgIC8vIE5vdyBtdWx0aXBsZXggdGhlIGNhbGxiYWNrcyBvdXQgdG8gYWxsIG9ic2VydmUgaGFuZGxlcy4gSXQncyBPSyBpZlxuICAgICAgLy8gdGhlc2UgY2FsbHMgeWllbGQ7IHNpbmNlIHdlJ3JlIGluc2lkZSBhIHRhc2ssIG5vIG90aGVyIHVzZSBvZiBvdXIgcXVldWVcbiAgICAgIC8vIGNhbiBjb250aW51ZSB1bnRpbCB0aGVzZSBhcmUgZG9uZS4gKEJ1dCB3ZSBkbyBoYXZlIHRvIGJlIGNhcmVmdWwgdG8gbm90XG4gICAgICAvLyB1c2UgYSBoYW5kbGUgdGhhdCBnb3QgcmVtb3ZlZCwgYmVjYXVzZSByZW1vdmVIYW5kbGUgZG9lcyBub3QgdXNlIHRoZVxuICAgICAgLy8gcXVldWU7IHRodXMsIHdlIGl0ZXJhdGUgb3ZlciBhbiBhcnJheSBvZiBrZXlzIHRoYXQgd2UgY29udHJvbC4pXG4gICAgICBfLmVhY2goXy5rZXlzKHNlbGYuX2hhbmRsZXMpLCBmdW5jdGlvbiAoaGFuZGxlSWQpIHtcbiAgICAgICAgdmFyIGhhbmRsZSA9IHNlbGYuX2hhbmRsZXMgJiYgc2VsZi5faGFuZGxlc1toYW5kbGVJZF07XG4gICAgICAgIGlmICghaGFuZGxlKVxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgdmFyIGNhbGxiYWNrID0gaGFuZGxlWydfJyArIGNhbGxiYWNrTmFtZV07XG4gICAgICAgIC8vIGNsb25lIGFyZ3VtZW50cyBzbyB0aGF0IGNhbGxiYWNrcyBjYW4gbXV0YXRlIHRoZWlyIGFyZ3VtZW50c1xuICAgICAgICBjYWxsYmFjayAmJiBjYWxsYmFjay5hcHBseShudWxsLCBFSlNPTi5jbG9uZShhcmdzKSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSxcblxuICAvLyBTZW5kcyBpbml0aWFsIGFkZHMgdG8gYSBoYW5kbGUuIEl0IHNob3VsZCBvbmx5IGJlIGNhbGxlZCBmcm9tIHdpdGhpbiBhIHRhc2tcbiAgLy8gKHRoZSB0YXNrIHRoYXQgaXMgcHJvY2Vzc2luZyB0aGUgYWRkSGFuZGxlQW5kU2VuZEluaXRpYWxBZGRzIGNhbGwpLiBJdFxuICAvLyBzeW5jaHJvbm91c2x5IGludm9rZXMgdGhlIGhhbmRsZSdzIGFkZGVkIG9yIGFkZGVkQmVmb3JlOyB0aGVyZSdzIG5vIG5lZWQgdG9cbiAgLy8gZmx1c2ggdGhlIHF1ZXVlIGFmdGVyd2FyZHMgdG8gZW5zdXJlIHRoYXQgdGhlIGNhbGxiYWNrcyBnZXQgb3V0LlxuICBfc2VuZEFkZHM6IGZ1bmN0aW9uIChoYW5kbGUpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgaWYgKHNlbGYuX3F1ZXVlLnNhZmVUb1J1blRhc2soKSlcbiAgICAgIHRocm93IEVycm9yKFwiX3NlbmRBZGRzIG1heSBvbmx5IGJlIGNhbGxlZCBmcm9tIHdpdGhpbiBhIHRhc2shXCIpO1xuICAgIHZhciBhZGQgPSBzZWxmLl9vcmRlcmVkID8gaGFuZGxlLl9hZGRlZEJlZm9yZSA6IGhhbmRsZS5fYWRkZWQ7XG4gICAgaWYgKCFhZGQpXG4gICAgICByZXR1cm47XG4gICAgLy8gbm90ZTogZG9jcyBtYXkgYmUgYW4gX0lkTWFwIG9yIGFuIE9yZGVyZWREaWN0XG4gICAgc2VsZi5fY2FjaGUuZG9jcy5mb3JFYWNoKGZ1bmN0aW9uIChkb2MsIGlkKSB7XG4gICAgICBpZiAoIV8uaGFzKHNlbGYuX2hhbmRsZXMsIGhhbmRsZS5faWQpKVxuICAgICAgICB0aHJvdyBFcnJvcihcImhhbmRsZSBnb3QgcmVtb3ZlZCBiZWZvcmUgc2VuZGluZyBpbml0aWFsIGFkZHMhXCIpO1xuICAgICAgdmFyIGZpZWxkcyA9IEVKU09OLmNsb25lKGRvYyk7XG4gICAgICBkZWxldGUgZmllbGRzLl9pZDtcbiAgICAgIGlmIChzZWxmLl9vcmRlcmVkKVxuICAgICAgICBhZGQoaWQsIGZpZWxkcywgbnVsbCk7IC8vIHdlJ3JlIGdvaW5nIGluIG9yZGVyLCBzbyBhZGQgYXQgZW5kXG4gICAgICBlbHNlXG4gICAgICAgIGFkZChpZCwgZmllbGRzKTtcbiAgICB9KTtcbiAgfVxufSk7XG5cblxudmFyIG5leHRPYnNlcnZlSGFuZGxlSWQgPSAxO1xuT2JzZXJ2ZUhhbmRsZSA9IGZ1bmN0aW9uIChtdWx0aXBsZXhlciwgY2FsbGJhY2tzKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgLy8gVGhlIGVuZCB1c2VyIGlzIG9ubHkgc3VwcG9zZWQgdG8gY2FsbCBzdG9wKCkuICBUaGUgb3RoZXIgZmllbGRzIGFyZVxuICAvLyBhY2Nlc3NpYmxlIHRvIHRoZSBtdWx0aXBsZXhlciwgdGhvdWdoLlxuICBzZWxmLl9tdWx0aXBsZXhlciA9IG11bHRpcGxleGVyO1xuICBfLmVhY2gobXVsdGlwbGV4ZXIuY2FsbGJhY2tOYW1lcygpLCBmdW5jdGlvbiAobmFtZSkge1xuICAgIGlmIChjYWxsYmFja3NbbmFtZV0pIHtcbiAgICAgIHNlbGZbJ18nICsgbmFtZV0gPSBjYWxsYmFja3NbbmFtZV07XG4gICAgfSBlbHNlIGlmIChuYW1lID09PSBcImFkZGVkQmVmb3JlXCIgJiYgY2FsbGJhY2tzLmFkZGVkKSB7XG4gICAgICAvLyBTcGVjaWFsIGNhc2U6IGlmIHlvdSBzcGVjaWZ5IFwiYWRkZWRcIiBhbmQgXCJtb3ZlZEJlZm9yZVwiLCB5b3UgZ2V0IGFuXG4gICAgICAvLyBvcmRlcmVkIG9ic2VydmUgd2hlcmUgZm9yIHNvbWUgcmVhc29uIHlvdSBkb24ndCBnZXQgb3JkZXJpbmcgZGF0YSBvblxuICAgICAgLy8gdGhlIGFkZHMuICBJIGR1bm5vLCB3ZSB3cm90ZSB0ZXN0cyBmb3IgaXQsIHRoZXJlIG11c3QgaGF2ZSBiZWVuIGFcbiAgICAgIC8vIHJlYXNvbi5cbiAgICAgIHNlbGYuX2FkZGVkQmVmb3JlID0gZnVuY3Rpb24gKGlkLCBmaWVsZHMsIGJlZm9yZSkge1xuICAgICAgICBjYWxsYmFja3MuYWRkZWQoaWQsIGZpZWxkcyk7XG4gICAgICB9O1xuICAgIH1cbiAgfSk7XG4gIHNlbGYuX3N0b3BwZWQgPSBmYWxzZTtcbiAgc2VsZi5faWQgPSBuZXh0T2JzZXJ2ZUhhbmRsZUlkKys7XG59O1xuT2JzZXJ2ZUhhbmRsZS5wcm90b3R5cGUuc3RvcCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBpZiAoc2VsZi5fc3RvcHBlZClcbiAgICByZXR1cm47XG4gIHNlbGYuX3N0b3BwZWQgPSB0cnVlO1xuICBzZWxmLl9tdWx0aXBsZXhlci5yZW1vdmVIYW5kbGUoc2VsZi5faWQpO1xufTtcbiIsInZhciBGaWJlciA9IE5wbS5yZXF1aXJlKCdmaWJlcnMnKTtcblxuZXhwb3J0IGNsYXNzIERvY0ZldGNoZXIge1xuICBjb25zdHJ1Y3Rvcihtb25nb0Nvbm5lY3Rpb24pIHtcbiAgICB0aGlzLl9tb25nb0Nvbm5lY3Rpb24gPSBtb25nb0Nvbm5lY3Rpb247XG4gICAgLy8gTWFwIGZyb20gb3AgLT4gW2NhbGxiYWNrXVxuICAgIHRoaXMuX2NhbGxiYWNrc0Zvck9wID0gbmV3IE1hcDtcbiAgfVxuXG4gIC8vIEZldGNoZXMgZG9jdW1lbnQgXCJpZFwiIGZyb20gY29sbGVjdGlvbk5hbWUsIHJldHVybmluZyBpdCBvciBudWxsIGlmIG5vdFxuICAvLyBmb3VuZC5cbiAgLy9cbiAgLy8gSWYgeW91IG1ha2UgbXVsdGlwbGUgY2FsbHMgdG8gZmV0Y2goKSB3aXRoIHRoZSBzYW1lIG9wIHJlZmVyZW5jZSxcbiAgLy8gRG9jRmV0Y2hlciBtYXkgYXNzdW1lIHRoYXQgdGhleSBhbGwgcmV0dXJuIHRoZSBzYW1lIGRvY3VtZW50LiAoSXQgZG9lc1xuICAvLyBub3QgY2hlY2sgdG8gc2VlIGlmIGNvbGxlY3Rpb25OYW1lL2lkIG1hdGNoLilcbiAgLy9cbiAgLy8gWW91IG1heSBhc3N1bWUgdGhhdCBjYWxsYmFjayBpcyBuZXZlciBjYWxsZWQgc3luY2hyb25vdXNseSAoYW5kIGluIGZhY3RcbiAgLy8gT3Bsb2dPYnNlcnZlRHJpdmVyIGRvZXMgc28pLlxuICBmZXRjaChjb2xsZWN0aW9uTmFtZSwgaWQsIG9wLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgY2hlY2soY29sbGVjdGlvbk5hbWUsIFN0cmluZyk7XG4gICAgY2hlY2sob3AsIE9iamVjdCk7XG5cbiAgICAvLyBJZiB0aGVyZSdzIGFscmVhZHkgYW4gaW4tcHJvZ3Jlc3MgZmV0Y2ggZm9yIHRoaXMgY2FjaGUga2V5LCB5aWVsZCB1bnRpbFxuICAgIC8vIGl0J3MgZG9uZSBhbmQgcmV0dXJuIHdoYXRldmVyIGl0IHJldHVybnMuXG4gICAgaWYgKHNlbGYuX2NhbGxiYWNrc0Zvck9wLmhhcyhvcCkpIHtcbiAgICAgIHNlbGYuX2NhbGxiYWNrc0Zvck9wLmdldChvcCkucHVzaChjYWxsYmFjayk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgY2FsbGJhY2tzID0gW2NhbGxiYWNrXTtcbiAgICBzZWxmLl9jYWxsYmFja3NGb3JPcC5zZXQob3AsIGNhbGxiYWNrcyk7XG5cbiAgICBGaWJlcihmdW5jdGlvbiAoKSB7XG4gICAgICB0cnkge1xuICAgICAgICB2YXIgZG9jID0gc2VsZi5fbW9uZ29Db25uZWN0aW9uLmZpbmRPbmUoXG4gICAgICAgICAgY29sbGVjdGlvbk5hbWUsIHtfaWQ6IGlkfSkgfHwgbnVsbDtcbiAgICAgICAgLy8gUmV0dXJuIGRvYyB0byBhbGwgcmVsZXZhbnQgY2FsbGJhY2tzLiBOb3RlIHRoYXQgdGhpcyBhcnJheSBjYW5cbiAgICAgICAgLy8gY29udGludWUgdG8gZ3JvdyBkdXJpbmcgY2FsbGJhY2sgZXhjZWN1dGlvbi5cbiAgICAgICAgd2hpbGUgKGNhbGxiYWNrcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgLy8gQ2xvbmUgdGhlIGRvY3VtZW50IHNvIHRoYXQgdGhlIHZhcmlvdXMgY2FsbHMgdG8gZmV0Y2ggZG9uJ3QgcmV0dXJuXG4gICAgICAgICAgLy8gb2JqZWN0cyB0aGF0IGFyZSBpbnRlcnR3aW5nbGVkIHdpdGggZWFjaCBvdGhlci4gQ2xvbmUgYmVmb3JlXG4gICAgICAgICAgLy8gcG9wcGluZyB0aGUgZnV0dXJlLCBzbyB0aGF0IGlmIGNsb25lIHRocm93cywgdGhlIGVycm9yIGdldHMgcGFzc2VkXG4gICAgICAgICAgLy8gdG8gdGhlIG5leHQgY2FsbGJhY2suXG4gICAgICAgICAgY2FsbGJhY2tzLnBvcCgpKG51bGwsIEVKU09OLmNsb25lKGRvYykpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHdoaWxlIChjYWxsYmFja3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGNhbGxiYWNrcy5wb3AoKShlKTtcbiAgICAgICAgfVxuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgLy8gWFhYIGNvbnNpZGVyIGtlZXBpbmcgdGhlIGRvYyBhcm91bmQgZm9yIGEgcGVyaW9kIG9mIHRpbWUgYmVmb3JlXG4gICAgICAgIC8vIHJlbW92aW5nIGZyb20gdGhlIGNhY2hlXG4gICAgICAgIHNlbGYuX2NhbGxiYWNrc0Zvck9wLmRlbGV0ZShvcCk7XG4gICAgICB9XG4gICAgfSkucnVuKCk7XG4gIH1cbn1cbiIsInZhciBQT0xMSU5HX1RIUk9UVExFX01TID0gK3Byb2Nlc3MuZW52Lk1FVEVPUl9QT0xMSU5HX1RIUk9UVExFX01TIHx8IDUwO1xudmFyIFBPTExJTkdfSU5URVJWQUxfTVMgPSArcHJvY2Vzcy5lbnYuTUVURU9SX1BPTExJTkdfSU5URVJWQUxfTVMgfHwgMTAgKiAxMDAwO1xuXG5Qb2xsaW5nT2JzZXJ2ZURyaXZlciA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICBzZWxmLl9jdXJzb3JEZXNjcmlwdGlvbiA9IG9wdGlvbnMuY3Vyc29yRGVzY3JpcHRpb247XG4gIHNlbGYuX21vbmdvSGFuZGxlID0gb3B0aW9ucy5tb25nb0hhbmRsZTtcbiAgc2VsZi5fb3JkZXJlZCA9IG9wdGlvbnMub3JkZXJlZDtcbiAgc2VsZi5fbXVsdGlwbGV4ZXIgPSBvcHRpb25zLm11bHRpcGxleGVyO1xuICBzZWxmLl9zdG9wQ2FsbGJhY2tzID0gW107XG4gIHNlbGYuX3N0b3BwZWQgPSBmYWxzZTtcblxuICBzZWxmLl9zeW5jaHJvbm91c0N1cnNvciA9IHNlbGYuX21vbmdvSGFuZGxlLl9jcmVhdGVTeW5jaHJvbm91c0N1cnNvcihcbiAgICBzZWxmLl9jdXJzb3JEZXNjcmlwdGlvbik7XG5cbiAgLy8gcHJldmlvdXMgcmVzdWx0cyBzbmFwc2hvdC4gIG9uIGVhY2ggcG9sbCBjeWNsZSwgZGlmZnMgYWdhaW5zdFxuICAvLyByZXN1bHRzIGRyaXZlcyB0aGUgY2FsbGJhY2tzLlxuICBzZWxmLl9yZXN1bHRzID0gbnVsbDtcblxuICAvLyBUaGUgbnVtYmVyIG9mIF9wb2xsTW9uZ28gY2FsbHMgdGhhdCBoYXZlIGJlZW4gYWRkZWQgdG8gc2VsZi5fdGFza1F1ZXVlIGJ1dFxuICAvLyBoYXZlIG5vdCBzdGFydGVkIHJ1bm5pbmcuIFVzZWQgdG8gbWFrZSBzdXJlIHdlIG5ldmVyIHNjaGVkdWxlIG1vcmUgdGhhbiBvbmVcbiAgLy8gX3BvbGxNb25nbyAob3RoZXIgdGhhbiBwb3NzaWJseSB0aGUgb25lIHRoYXQgaXMgY3VycmVudGx5IHJ1bm5pbmcpLiBJdCdzXG4gIC8vIGFsc28gdXNlZCBieSBfc3VzcGVuZFBvbGxpbmcgdG8gcHJldGVuZCB0aGVyZSdzIGEgcG9sbCBzY2hlZHVsZWQuIFVzdWFsbHksXG4gIC8vIGl0J3MgZWl0aGVyIDAgKGZvciBcIm5vIHBvbGxzIHNjaGVkdWxlZCBvdGhlciB0aGFuIG1heWJlIG9uZSBjdXJyZW50bHlcbiAgLy8gcnVubmluZ1wiKSBvciAxIChmb3IgXCJhIHBvbGwgc2NoZWR1bGVkIHRoYXQgaXNuJ3QgcnVubmluZyB5ZXRcIiksIGJ1dCBpdCBjYW5cbiAgLy8gYWxzbyBiZSAyIGlmIGluY3JlbWVudGVkIGJ5IF9zdXNwZW5kUG9sbGluZy5cbiAgc2VsZi5fcG9sbHNTY2hlZHVsZWRCdXROb3RTdGFydGVkID0gMDtcbiAgc2VsZi5fcGVuZGluZ1dyaXRlcyA9IFtdOyAvLyBwZW9wbGUgdG8gbm90aWZ5IHdoZW4gcG9sbGluZyBjb21wbGV0ZXNcblxuICAvLyBNYWtlIHN1cmUgdG8gY3JlYXRlIGEgc2VwYXJhdGVseSB0aHJvdHRsZWQgZnVuY3Rpb24gZm9yIGVhY2hcbiAgLy8gUG9sbGluZ09ic2VydmVEcml2ZXIgb2JqZWN0LlxuICBzZWxmLl9lbnN1cmVQb2xsSXNTY2hlZHVsZWQgPSBfLnRocm90dGxlKFxuICAgIHNlbGYuX3VudGhyb3R0bGVkRW5zdXJlUG9sbElzU2NoZWR1bGVkLFxuICAgIHNlbGYuX2N1cnNvckRlc2NyaXB0aW9uLm9wdGlvbnMucG9sbGluZ1Rocm90dGxlTXMgfHwgUE9MTElOR19USFJPVFRMRV9NUyAvKiBtcyAqLyk7XG5cbiAgLy8gWFhYIGZpZ3VyZSBvdXQgaWYgd2Ugc3RpbGwgbmVlZCBhIHF1ZXVlXG4gIHNlbGYuX3Rhc2tRdWV1ZSA9IG5ldyBNZXRlb3IuX1N5bmNocm9ub3VzUXVldWUoKTtcblxuICB2YXIgbGlzdGVuZXJzSGFuZGxlID0gbGlzdGVuQWxsKFxuICAgIHNlbGYuX2N1cnNvckRlc2NyaXB0aW9uLCBmdW5jdGlvbiAobm90aWZpY2F0aW9uKSB7XG4gICAgICAvLyBXaGVuIHNvbWVvbmUgZG9lcyBhIHRyYW5zYWN0aW9uIHRoYXQgbWlnaHQgYWZmZWN0IHVzLCBzY2hlZHVsZSBhIHBvbGxcbiAgICAgIC8vIG9mIHRoZSBkYXRhYmFzZS4gSWYgdGhhdCB0cmFuc2FjdGlvbiBoYXBwZW5zIGluc2lkZSBvZiBhIHdyaXRlIGZlbmNlLFxuICAgICAgLy8gYmxvY2sgdGhlIGZlbmNlIHVudGlsIHdlJ3ZlIHBvbGxlZCBhbmQgbm90aWZpZWQgb2JzZXJ2ZXJzLlxuICAgICAgdmFyIGZlbmNlID0gRERQU2VydmVyLl9DdXJyZW50V3JpdGVGZW5jZS5nZXQoKTtcbiAgICAgIGlmIChmZW5jZSlcbiAgICAgICAgc2VsZi5fcGVuZGluZ1dyaXRlcy5wdXNoKGZlbmNlLmJlZ2luV3JpdGUoKSk7XG4gICAgICAvLyBFbnN1cmUgYSBwb2xsIGlzIHNjaGVkdWxlZC4uLiBidXQgaWYgd2UgYWxyZWFkeSBrbm93IHRoYXQgb25lIGlzLFxuICAgICAgLy8gZG9uJ3QgaGl0IHRoZSB0aHJvdHRsZWQgX2Vuc3VyZVBvbGxJc1NjaGVkdWxlZCBmdW5jdGlvbiAod2hpY2ggbWlnaHRcbiAgICAgIC8vIGxlYWQgdG8gdXMgY2FsbGluZyBpdCB1bm5lY2Vzc2FyaWx5IGluIDxwb2xsaW5nVGhyb3R0bGVNcz4gbXMpLlxuICAgICAgaWYgKHNlbGYuX3BvbGxzU2NoZWR1bGVkQnV0Tm90U3RhcnRlZCA9PT0gMClcbiAgICAgICAgc2VsZi5fZW5zdXJlUG9sbElzU2NoZWR1bGVkKCk7XG4gICAgfVxuICApO1xuICBzZWxmLl9zdG9wQ2FsbGJhY2tzLnB1c2goZnVuY3Rpb24gKCkgeyBsaXN0ZW5lcnNIYW5kbGUuc3RvcCgpOyB9KTtcblxuICAvLyBldmVyeSBvbmNlIGFuZCBhIHdoaWxlLCBwb2xsIGV2ZW4gaWYgd2UgZG9uJ3QgdGhpbmsgd2UncmUgZGlydHksIGZvclxuICAvLyBldmVudHVhbCBjb25zaXN0ZW5jeSB3aXRoIGRhdGFiYXNlIHdyaXRlcyBmcm9tIG91dHNpZGUgdGhlIE1ldGVvclxuICAvLyB1bml2ZXJzZS5cbiAgLy9cbiAgLy8gRm9yIHRlc3RpbmcsIHRoZXJlJ3MgYW4gdW5kb2N1bWVudGVkIGNhbGxiYWNrIGFyZ3VtZW50IHRvIG9ic2VydmVDaGFuZ2VzXG4gIC8vIHdoaWNoIGRpc2FibGVzIHRpbWUtYmFzZWQgcG9sbGluZyBhbmQgZ2V0cyBjYWxsZWQgYXQgdGhlIGJlZ2lubmluZyBvZiBlYWNoXG4gIC8vIHBvbGwuXG4gIGlmIChvcHRpb25zLl90ZXN0T25seVBvbGxDYWxsYmFjaykge1xuICAgIHNlbGYuX3Rlc3RPbmx5UG9sbENhbGxiYWNrID0gb3B0aW9ucy5fdGVzdE9ubHlQb2xsQ2FsbGJhY2s7XG4gIH0gZWxzZSB7XG4gICAgdmFyIHBvbGxpbmdJbnRlcnZhbCA9XG4gICAgICAgICAgc2VsZi5fY3Vyc29yRGVzY3JpcHRpb24ub3B0aW9ucy5wb2xsaW5nSW50ZXJ2YWxNcyB8fFxuICAgICAgICAgIHNlbGYuX2N1cnNvckRlc2NyaXB0aW9uLm9wdGlvbnMuX3BvbGxpbmdJbnRlcnZhbCB8fCAvLyBDT01QQVQgd2l0aCAxLjJcbiAgICAgICAgICBQT0xMSU5HX0lOVEVSVkFMX01TO1xuICAgIHZhciBpbnRlcnZhbEhhbmRsZSA9IE1ldGVvci5zZXRJbnRlcnZhbChcbiAgICAgIF8uYmluZChzZWxmLl9lbnN1cmVQb2xsSXNTY2hlZHVsZWQsIHNlbGYpLCBwb2xsaW5nSW50ZXJ2YWwpO1xuICAgIHNlbGYuX3N0b3BDYWxsYmFja3MucHVzaChmdW5jdGlvbiAoKSB7XG4gICAgICBNZXRlb3IuY2xlYXJJbnRlcnZhbChpbnRlcnZhbEhhbmRsZSk7XG4gICAgfSk7XG4gIH1cblxuICAvLyBNYWtlIHN1cmUgd2UgYWN0dWFsbHkgcG9sbCBzb29uIVxuICBzZWxmLl91bnRocm90dGxlZEVuc3VyZVBvbGxJc1NjaGVkdWxlZCgpO1xuXG4gIFBhY2thZ2VbJ2ZhY3RzLWJhc2UnXSAmJiBQYWNrYWdlWydmYWN0cy1iYXNlJ10uRmFjdHMuaW5jcmVtZW50U2VydmVyRmFjdChcbiAgICBcIm1vbmdvLWxpdmVkYXRhXCIsIFwib2JzZXJ2ZS1kcml2ZXJzLXBvbGxpbmdcIiwgMSk7XG59O1xuXG5fLmV4dGVuZChQb2xsaW5nT2JzZXJ2ZURyaXZlci5wcm90b3R5cGUsIHtcbiAgLy8gVGhpcyBpcyBhbHdheXMgY2FsbGVkIHRocm91Z2ggXy50aHJvdHRsZSAoZXhjZXB0IG9uY2UgYXQgc3RhcnR1cCkuXG4gIF91bnRocm90dGxlZEVuc3VyZVBvbGxJc1NjaGVkdWxlZDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBpZiAoc2VsZi5fcG9sbHNTY2hlZHVsZWRCdXROb3RTdGFydGVkID4gMClcbiAgICAgIHJldHVybjtcbiAgICArK3NlbGYuX3BvbGxzU2NoZWR1bGVkQnV0Tm90U3RhcnRlZDtcbiAgICBzZWxmLl90YXNrUXVldWUucXVldWVUYXNrKGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYuX3BvbGxNb25nbygpO1xuICAgIH0pO1xuICB9LFxuXG4gIC8vIHRlc3Qtb25seSBpbnRlcmZhY2UgZm9yIGNvbnRyb2xsaW5nIHBvbGxpbmcuXG4gIC8vXG4gIC8vIF9zdXNwZW5kUG9sbGluZyBibG9ja3MgdW50aWwgYW55IGN1cnJlbnRseSBydW5uaW5nIGFuZCBzY2hlZHVsZWQgcG9sbHMgYXJlXG4gIC8vIGRvbmUsIGFuZCBwcmV2ZW50cyBhbnkgZnVydGhlciBwb2xscyBmcm9tIGJlaW5nIHNjaGVkdWxlZC4gKG5ld1xuICAvLyBPYnNlcnZlSGFuZGxlcyBjYW4gYmUgYWRkZWQgYW5kIHJlY2VpdmUgdGhlaXIgaW5pdGlhbCBhZGRlZCBjYWxsYmFja3MsXG4gIC8vIHRob3VnaC4pXG4gIC8vXG4gIC8vIF9yZXN1bWVQb2xsaW5nIGltbWVkaWF0ZWx5IHBvbGxzLCBhbmQgYWxsb3dzIGZ1cnRoZXIgcG9sbHMgdG8gb2NjdXIuXG4gIF9zdXNwZW5kUG9sbGluZzogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIC8vIFByZXRlbmQgdGhhdCB0aGVyZSdzIGFub3RoZXIgcG9sbCBzY2hlZHVsZWQgKHdoaWNoIHdpbGwgcHJldmVudFxuICAgIC8vIF9lbnN1cmVQb2xsSXNTY2hlZHVsZWQgZnJvbSBxdWV1ZWluZyBhbnkgbW9yZSBwb2xscykuXG4gICAgKytzZWxmLl9wb2xsc1NjaGVkdWxlZEJ1dE5vdFN0YXJ0ZWQ7XG4gICAgLy8gTm93IGJsb2NrIHVudGlsIGFsbCBjdXJyZW50bHkgcnVubmluZyBvciBzY2hlZHVsZWQgcG9sbHMgYXJlIGRvbmUuXG4gICAgc2VsZi5fdGFza1F1ZXVlLnJ1blRhc2soZnVuY3Rpb24oKSB7fSk7XG5cbiAgICAvLyBDb25maXJtIHRoYXQgdGhlcmUgaXMgb25seSBvbmUgXCJwb2xsXCIgKHRoZSBmYWtlIG9uZSB3ZSdyZSBwcmV0ZW5kaW5nIHRvXG4gICAgLy8gaGF2ZSkgc2NoZWR1bGVkLlxuICAgIGlmIChzZWxmLl9wb2xsc1NjaGVkdWxlZEJ1dE5vdFN0YXJ0ZWQgIT09IDEpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJfcG9sbHNTY2hlZHVsZWRCdXROb3RTdGFydGVkIGlzIFwiICtcbiAgICAgICAgICAgICAgICAgICAgICBzZWxmLl9wb2xsc1NjaGVkdWxlZEJ1dE5vdFN0YXJ0ZWQpO1xuICB9LFxuICBfcmVzdW1lUG9sbGluZzogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIC8vIFdlIHNob3VsZCBiZSBpbiB0aGUgc2FtZSBzdGF0ZSBhcyBpbiB0aGUgZW5kIG9mIF9zdXNwZW5kUG9sbGluZy5cbiAgICBpZiAoc2VsZi5fcG9sbHNTY2hlZHVsZWRCdXROb3RTdGFydGVkICE9PSAxKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiX3BvbGxzU2NoZWR1bGVkQnV0Tm90U3RhcnRlZCBpcyBcIiArXG4gICAgICAgICAgICAgICAgICAgICAgc2VsZi5fcG9sbHNTY2hlZHVsZWRCdXROb3RTdGFydGVkKTtcbiAgICAvLyBSdW4gYSBwb2xsIHN5bmNocm9ub3VzbHkgKHdoaWNoIHdpbGwgY291bnRlcmFjdCB0aGVcbiAgICAvLyArK19wb2xsc1NjaGVkdWxlZEJ1dE5vdFN0YXJ0ZWQgZnJvbSBfc3VzcGVuZFBvbGxpbmcpLlxuICAgIHNlbGYuX3Rhc2tRdWV1ZS5ydW5UYXNrKGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYuX3BvbGxNb25nbygpO1xuICAgIH0pO1xuICB9LFxuXG4gIF9wb2xsTW9uZ286IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgLS1zZWxmLl9wb2xsc1NjaGVkdWxlZEJ1dE5vdFN0YXJ0ZWQ7XG5cbiAgICBpZiAoc2VsZi5fc3RvcHBlZClcbiAgICAgIHJldHVybjtcblxuICAgIHZhciBmaXJzdCA9IGZhbHNlO1xuICAgIHZhciBuZXdSZXN1bHRzO1xuICAgIHZhciBvbGRSZXN1bHRzID0gc2VsZi5fcmVzdWx0cztcbiAgICBpZiAoIW9sZFJlc3VsdHMpIHtcbiAgICAgIGZpcnN0ID0gdHJ1ZTtcbiAgICAgIC8vIFhYWCBtYXliZSB1c2UgT3JkZXJlZERpY3QgaW5zdGVhZD9cbiAgICAgIG9sZFJlc3VsdHMgPSBzZWxmLl9vcmRlcmVkID8gW10gOiBuZXcgTG9jYWxDb2xsZWN0aW9uLl9JZE1hcDtcbiAgICB9XG5cbiAgICBzZWxmLl90ZXN0T25seVBvbGxDYWxsYmFjayAmJiBzZWxmLl90ZXN0T25seVBvbGxDYWxsYmFjaygpO1xuXG4gICAgLy8gU2F2ZSB0aGUgbGlzdCBvZiBwZW5kaW5nIHdyaXRlcyB3aGljaCB0aGlzIHJvdW5kIHdpbGwgY29tbWl0LlxuICAgIHZhciB3cml0ZXNGb3JDeWNsZSA9IHNlbGYuX3BlbmRpbmdXcml0ZXM7XG4gICAgc2VsZi5fcGVuZGluZ1dyaXRlcyA9IFtdO1xuXG4gICAgLy8gR2V0IHRoZSBuZXcgcXVlcnkgcmVzdWx0cy4gKFRoaXMgeWllbGRzLilcbiAgICB0cnkge1xuICAgICAgbmV3UmVzdWx0cyA9IHNlbGYuX3N5bmNocm9ub3VzQ3Vyc29yLmdldFJhd09iamVjdHMoc2VsZi5fb3JkZXJlZCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgaWYgKGZpcnN0ICYmIHR5cGVvZihlLmNvZGUpID09PSAnbnVtYmVyJykge1xuICAgICAgICAvLyBUaGlzIGlzIGFuIGVycm9yIGRvY3VtZW50IHNlbnQgdG8gdXMgYnkgbW9uZ29kLCBub3QgYSBjb25uZWN0aW9uXG4gICAgICAgIC8vIGVycm9yIGdlbmVyYXRlZCBieSB0aGUgY2xpZW50LiBBbmQgd2UndmUgbmV2ZXIgc2VlbiB0aGlzIHF1ZXJ5IHdvcmtcbiAgICAgICAgLy8gc3VjY2Vzc2Z1bGx5LiBQcm9iYWJseSBpdCdzIGEgYmFkIHNlbGVjdG9yIG9yIHNvbWV0aGluZywgc28gd2Ugc2hvdWxkXG4gICAgICAgIC8vIE5PVCByZXRyeS4gSW5zdGVhZCwgd2Ugc2hvdWxkIGhhbHQgdGhlIG9ic2VydmUgKHdoaWNoIGVuZHMgdXAgY2FsbGluZ1xuICAgICAgICAvLyBgc3RvcGAgb24gdXMpLlxuICAgICAgICBzZWxmLl9tdWx0aXBsZXhlci5xdWVyeUVycm9yKFxuICAgICAgICAgIG5ldyBFcnJvcihcbiAgICAgICAgICAgIFwiRXhjZXB0aW9uIHdoaWxlIHBvbGxpbmcgcXVlcnkgXCIgK1xuICAgICAgICAgICAgICBKU09OLnN0cmluZ2lmeShzZWxmLl9jdXJzb3JEZXNjcmlwdGlvbikgKyBcIjogXCIgKyBlLm1lc3NhZ2UpKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBnZXRSYXdPYmplY3RzIGNhbiB0aHJvdyBpZiB3ZSdyZSBoYXZpbmcgdHJvdWJsZSB0YWxraW5nIHRvIHRoZVxuICAgICAgLy8gZGF0YWJhc2UuICBUaGF0J3MgZmluZSAtLS0gd2Ugd2lsbCByZXBvbGwgbGF0ZXIgYW55d2F5LiBCdXQgd2Ugc2hvdWxkXG4gICAgICAvLyBtYWtlIHN1cmUgbm90IHRvIGxvc2UgdHJhY2sgb2YgdGhpcyBjeWNsZSdzIHdyaXRlcy5cbiAgICAgIC8vIChJdCBhbHNvIGNhbiB0aHJvdyBpZiB0aGVyZSdzIGp1c3Qgc29tZXRoaW5nIGludmFsaWQgYWJvdXQgdGhpcyBxdWVyeTtcbiAgICAgIC8vIHVuZm9ydHVuYXRlbHkgdGhlIE9ic2VydmVEcml2ZXIgQVBJIGRvZXNuJ3QgcHJvdmlkZSBhIGdvb2Qgd2F5IHRvXG4gICAgICAvLyBcImNhbmNlbFwiIHRoZSBvYnNlcnZlIGZyb20gdGhlIGluc2lkZSBpbiB0aGlzIGNhc2UuXG4gICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShzZWxmLl9wZW5kaW5nV3JpdGVzLCB3cml0ZXNGb3JDeWNsZSk7XG4gICAgICBNZXRlb3IuX2RlYnVnKFwiRXhjZXB0aW9uIHdoaWxlIHBvbGxpbmcgcXVlcnkgXCIgK1xuICAgICAgICAgICAgICAgICAgICBKU09OLnN0cmluZ2lmeShzZWxmLl9jdXJzb3JEZXNjcmlwdGlvbiksIGUpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFJ1biBkaWZmcy5cbiAgICBpZiAoIXNlbGYuX3N0b3BwZWQpIHtcbiAgICAgIExvY2FsQ29sbGVjdGlvbi5fZGlmZlF1ZXJ5Q2hhbmdlcyhcbiAgICAgICAgc2VsZi5fb3JkZXJlZCwgb2xkUmVzdWx0cywgbmV3UmVzdWx0cywgc2VsZi5fbXVsdGlwbGV4ZXIpO1xuICAgIH1cblxuICAgIC8vIFNpZ25hbHMgdGhlIG11bHRpcGxleGVyIHRvIGFsbG93IGFsbCBvYnNlcnZlQ2hhbmdlcyBjYWxscyB0aGF0IHNoYXJlIHRoaXNcbiAgICAvLyBtdWx0aXBsZXhlciB0byByZXR1cm4uIChUaGlzIGhhcHBlbnMgYXN5bmNocm9ub3VzbHksIHZpYSB0aGVcbiAgICAvLyBtdWx0aXBsZXhlcidzIHF1ZXVlLilcbiAgICBpZiAoZmlyc3QpXG4gICAgICBzZWxmLl9tdWx0aXBsZXhlci5yZWFkeSgpO1xuXG4gICAgLy8gUmVwbGFjZSBzZWxmLl9yZXN1bHRzIGF0b21pY2FsbHkuICAoVGhpcyBhc3NpZ25tZW50IGlzIHdoYXQgbWFrZXMgYGZpcnN0YFxuICAgIC8vIHN0YXkgdGhyb3VnaCBvbiB0aGUgbmV4dCBjeWNsZSwgc28gd2UndmUgd2FpdGVkIHVudGlsIGFmdGVyIHdlJ3ZlXG4gICAgLy8gY29tbWl0dGVkIHRvIHJlYWR5LWluZyB0aGUgbXVsdGlwbGV4ZXIuKVxuICAgIHNlbGYuX3Jlc3VsdHMgPSBuZXdSZXN1bHRzO1xuXG4gICAgLy8gT25jZSB0aGUgT2JzZXJ2ZU11bHRpcGxleGVyIGhhcyBwcm9jZXNzZWQgZXZlcnl0aGluZyB3ZSd2ZSBkb25lIGluIHRoaXNcbiAgICAvLyByb3VuZCwgbWFyayBhbGwgdGhlIHdyaXRlcyB3aGljaCBleGlzdGVkIGJlZm9yZSB0aGlzIGNhbGwgYXNcbiAgICAvLyBjb21tbWl0dGVkLiAoSWYgbmV3IHdyaXRlcyBoYXZlIHNob3duIHVwIGluIHRoZSBtZWFudGltZSwgdGhlcmUnbGxcbiAgICAvLyBhbHJlYWR5IGJlIGFub3RoZXIgX3BvbGxNb25nbyB0YXNrIHNjaGVkdWxlZC4pXG4gICAgc2VsZi5fbXVsdGlwbGV4ZXIub25GbHVzaChmdW5jdGlvbiAoKSB7XG4gICAgICBfLmVhY2god3JpdGVzRm9yQ3ljbGUsIGZ1bmN0aW9uICh3KSB7XG4gICAgICAgIHcuY29tbWl0dGVkKCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSxcblxuICBzdG9wOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHNlbGYuX3N0b3BwZWQgPSB0cnVlO1xuICAgIF8uZWFjaChzZWxmLl9zdG9wQ2FsbGJhY2tzLCBmdW5jdGlvbiAoYykgeyBjKCk7IH0pO1xuICAgIC8vIFJlbGVhc2UgYW55IHdyaXRlIGZlbmNlcyB0aGF0IGFyZSB3YWl0aW5nIG9uIHVzLlxuICAgIF8uZWFjaChzZWxmLl9wZW5kaW5nV3JpdGVzLCBmdW5jdGlvbiAodykge1xuICAgICAgdy5jb21taXR0ZWQoKTtcbiAgICB9KTtcbiAgICBQYWNrYWdlWydmYWN0cy1iYXNlJ10gJiYgUGFja2FnZVsnZmFjdHMtYmFzZSddLkZhY3RzLmluY3JlbWVudFNlcnZlckZhY3QoXG4gICAgICBcIm1vbmdvLWxpdmVkYXRhXCIsIFwib2JzZXJ2ZS1kcml2ZXJzLXBvbGxpbmdcIiwgLTEpO1xuICB9XG59KTtcbiIsInZhciBGdXR1cmUgPSBOcG0ucmVxdWlyZSgnZmliZXJzL2Z1dHVyZScpO1xuXG52YXIgUEhBU0UgPSB7XG4gIFFVRVJZSU5HOiBcIlFVRVJZSU5HXCIsXG4gIEZFVENISU5HOiBcIkZFVENISU5HXCIsXG4gIFNURUFEWTogXCJTVEVBRFlcIlxufTtcblxuLy8gRXhjZXB0aW9uIHRocm93biBieSBfbmVlZFRvUG9sbFF1ZXJ5IHdoaWNoIHVucm9sbHMgdGhlIHN0YWNrIHVwIHRvIHRoZVxuLy8gZW5jbG9zaW5nIGNhbGwgdG8gZmluaXNoSWZOZWVkVG9Qb2xsUXVlcnkuXG52YXIgU3dpdGNoZWRUb1F1ZXJ5ID0gZnVuY3Rpb24gKCkge307XG52YXIgZmluaXNoSWZOZWVkVG9Qb2xsUXVlcnkgPSBmdW5jdGlvbiAoZikge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICBmLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgaWYgKCEoZSBpbnN0YW5jZW9mIFN3aXRjaGVkVG9RdWVyeSkpXG4gICAgICAgIHRocm93IGU7XG4gICAgfVxuICB9O1xufTtcblxudmFyIGN1cnJlbnRJZCA9IDA7XG5cbi8vIE9wbG9nT2JzZXJ2ZURyaXZlciBpcyBhbiBhbHRlcm5hdGl2ZSB0byBQb2xsaW5nT2JzZXJ2ZURyaXZlciB3aGljaCBmb2xsb3dzXG4vLyB0aGUgTW9uZ28gb3BlcmF0aW9uIGxvZyBpbnN0ZWFkIG9mIGp1c3QgcmUtcG9sbGluZyB0aGUgcXVlcnkuIEl0IG9iZXlzIHRoZVxuLy8gc2FtZSBzaW1wbGUgaW50ZXJmYWNlOiBjb25zdHJ1Y3RpbmcgaXQgc3RhcnRzIHNlbmRpbmcgb2JzZXJ2ZUNoYW5nZXNcbi8vIGNhbGxiYWNrcyAoYW5kIGEgcmVhZHkoKSBpbnZvY2F0aW9uKSB0byB0aGUgT2JzZXJ2ZU11bHRpcGxleGVyLCBhbmQgeW91IHN0b3Bcbi8vIGl0IGJ5IGNhbGxpbmcgdGhlIHN0b3AoKSBtZXRob2QuXG5PcGxvZ09ic2VydmVEcml2ZXIgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHNlbGYuX3VzZXNPcGxvZyA9IHRydWU7ICAvLyB0ZXN0cyBsb29rIGF0IHRoaXNcblxuICBzZWxmLl9pZCA9IGN1cnJlbnRJZDtcbiAgY3VycmVudElkKys7XG5cbiAgc2VsZi5fY3Vyc29yRGVzY3JpcHRpb24gPSBvcHRpb25zLmN1cnNvckRlc2NyaXB0aW9uO1xuICBzZWxmLl9tb25nb0hhbmRsZSA9IG9wdGlvbnMubW9uZ29IYW5kbGU7XG4gIHNlbGYuX211bHRpcGxleGVyID0gb3B0aW9ucy5tdWx0aXBsZXhlcjtcblxuICBpZiAob3B0aW9ucy5vcmRlcmVkKSB7XG4gICAgdGhyb3cgRXJyb3IoXCJPcGxvZ09ic2VydmVEcml2ZXIgb25seSBzdXBwb3J0cyB1bm9yZGVyZWQgb2JzZXJ2ZUNoYW5nZXNcIik7XG4gIH1cblxuICB2YXIgc29ydGVyID0gb3B0aW9ucy5zb3J0ZXI7XG4gIC8vIFdlIGRvbid0IHN1cHBvcnQgJG5lYXIgYW5kIG90aGVyIGdlby1xdWVyaWVzIHNvIGl0J3MgT0sgdG8gaW5pdGlhbGl6ZSB0aGVcbiAgLy8gY29tcGFyYXRvciBvbmx5IG9uY2UgaW4gdGhlIGNvbnN0cnVjdG9yLlxuICB2YXIgY29tcGFyYXRvciA9IHNvcnRlciAmJiBzb3J0ZXIuZ2V0Q29tcGFyYXRvcigpO1xuXG4gIGlmIChvcHRpb25zLmN1cnNvckRlc2NyaXB0aW9uLm9wdGlvbnMubGltaXQpIHtcbiAgICAvLyBUaGVyZSBhcmUgc2V2ZXJhbCBwcm9wZXJ0aWVzIG9yZGVyZWQgZHJpdmVyIGltcGxlbWVudHM6XG4gICAgLy8gLSBfbGltaXQgaXMgYSBwb3NpdGl2ZSBudW1iZXJcbiAgICAvLyAtIF9jb21wYXJhdG9yIGlzIGEgZnVuY3Rpb24tY29tcGFyYXRvciBieSB3aGljaCB0aGUgcXVlcnkgaXMgb3JkZXJlZFxuICAgIC8vIC0gX3VucHVibGlzaGVkQnVmZmVyIGlzIG5vbi1udWxsIE1pbi9NYXggSGVhcCxcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICB0aGUgZW1wdHkgYnVmZmVyIGluIFNURUFEWSBwaGFzZSBpbXBsaWVzIHRoYXQgdGhlXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgZXZlcnl0aGluZyB0aGF0IG1hdGNoZXMgdGhlIHF1ZXJpZXMgc2VsZWN0b3IgZml0c1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgIGludG8gcHVibGlzaGVkIHNldC5cbiAgICAvLyAtIF9wdWJsaXNoZWQgLSBNaW4gSGVhcCAoYWxzbyBpbXBsZW1lbnRzIElkTWFwIG1ldGhvZHMpXG5cbiAgICB2YXIgaGVhcE9wdGlvbnMgPSB7IElkTWFwOiBMb2NhbENvbGxlY3Rpb24uX0lkTWFwIH07XG4gICAgc2VsZi5fbGltaXQgPSBzZWxmLl9jdXJzb3JEZXNjcmlwdGlvbi5vcHRpb25zLmxpbWl0O1xuICAgIHNlbGYuX2NvbXBhcmF0b3IgPSBjb21wYXJhdG9yO1xuICAgIHNlbGYuX3NvcnRlciA9IHNvcnRlcjtcbiAgICBzZWxmLl91bnB1Ymxpc2hlZEJ1ZmZlciA9IG5ldyBNaW5NYXhIZWFwKGNvbXBhcmF0b3IsIGhlYXBPcHRpb25zKTtcbiAgICAvLyBXZSBuZWVkIHNvbWV0aGluZyB0aGF0IGNhbiBmaW5kIE1heCB2YWx1ZSBpbiBhZGRpdGlvbiB0byBJZE1hcCBpbnRlcmZhY2VcbiAgICBzZWxmLl9wdWJsaXNoZWQgPSBuZXcgTWF4SGVhcChjb21wYXJhdG9yLCBoZWFwT3B0aW9ucyk7XG4gIH0gZWxzZSB7XG4gICAgc2VsZi5fbGltaXQgPSAwO1xuICAgIHNlbGYuX2NvbXBhcmF0b3IgPSBudWxsO1xuICAgIHNlbGYuX3NvcnRlciA9IG51bGw7XG4gICAgc2VsZi5fdW5wdWJsaXNoZWRCdWZmZXIgPSBudWxsO1xuICAgIHNlbGYuX3B1Ymxpc2hlZCA9IG5ldyBMb2NhbENvbGxlY3Rpb24uX0lkTWFwO1xuICB9XG5cbiAgLy8gSW5kaWNhdGVzIGlmIGl0IGlzIHNhZmUgdG8gaW5zZXJ0IGEgbmV3IGRvY3VtZW50IGF0IHRoZSBlbmQgb2YgdGhlIGJ1ZmZlclxuICAvLyBmb3IgdGhpcyBxdWVyeS4gaS5lLiBpdCBpcyBrbm93biB0aGF0IHRoZXJlIGFyZSBubyBkb2N1bWVudHMgbWF0Y2hpbmcgdGhlXG4gIC8vIHNlbGVjdG9yIHRob3NlIGFyZSBub3QgaW4gcHVibGlzaGVkIG9yIGJ1ZmZlci5cbiAgc2VsZi5fc2FmZUFwcGVuZFRvQnVmZmVyID0gZmFsc2U7XG5cbiAgc2VsZi5fc3RvcHBlZCA9IGZhbHNlO1xuICBzZWxmLl9zdG9wSGFuZGxlcyA9IFtdO1xuXG4gIFBhY2thZ2VbJ2ZhY3RzLWJhc2UnXSAmJiBQYWNrYWdlWydmYWN0cy1iYXNlJ10uRmFjdHMuaW5jcmVtZW50U2VydmVyRmFjdChcbiAgICBcIm1vbmdvLWxpdmVkYXRhXCIsIFwib2JzZXJ2ZS1kcml2ZXJzLW9wbG9nXCIsIDEpO1xuXG4gIHNlbGYuX3JlZ2lzdGVyUGhhc2VDaGFuZ2UoUEhBU0UuUVVFUllJTkcpO1xuXG4gIHNlbGYuX21hdGNoZXIgPSBvcHRpb25zLm1hdGNoZXI7XG4gIHZhciBwcm9qZWN0aW9uID0gc2VsZi5fY3Vyc29yRGVzY3JpcHRpb24ub3B0aW9ucy5maWVsZHMgfHwge307XG4gIHNlbGYuX3Byb2plY3Rpb25GbiA9IExvY2FsQ29sbGVjdGlvbi5fY29tcGlsZVByb2plY3Rpb24ocHJvamVjdGlvbik7XG4gIC8vIFByb2plY3Rpb24gZnVuY3Rpb24sIHJlc3VsdCBvZiBjb21iaW5pbmcgaW1wb3J0YW50IGZpZWxkcyBmb3Igc2VsZWN0b3IgYW5kXG4gIC8vIGV4aXN0aW5nIGZpZWxkcyBwcm9qZWN0aW9uXG4gIHNlbGYuX3NoYXJlZFByb2plY3Rpb24gPSBzZWxmLl9tYXRjaGVyLmNvbWJpbmVJbnRvUHJvamVjdGlvbihwcm9qZWN0aW9uKTtcbiAgaWYgKHNvcnRlcilcbiAgICBzZWxmLl9zaGFyZWRQcm9qZWN0aW9uID0gc29ydGVyLmNvbWJpbmVJbnRvUHJvamVjdGlvbihzZWxmLl9zaGFyZWRQcm9qZWN0aW9uKTtcbiAgc2VsZi5fc2hhcmVkUHJvamVjdGlvbkZuID0gTG9jYWxDb2xsZWN0aW9uLl9jb21waWxlUHJvamVjdGlvbihcbiAgICBzZWxmLl9zaGFyZWRQcm9qZWN0aW9uKTtcblxuICBzZWxmLl9uZWVkVG9GZXRjaCA9IG5ldyBMb2NhbENvbGxlY3Rpb24uX0lkTWFwO1xuICBzZWxmLl9jdXJyZW50bHlGZXRjaGluZyA9IG51bGw7XG4gIHNlbGYuX2ZldGNoR2VuZXJhdGlvbiA9IDA7XG5cbiAgc2VsZi5fcmVxdWVyeVdoZW5Eb25lVGhpc1F1ZXJ5ID0gZmFsc2U7XG4gIHNlbGYuX3dyaXRlc1RvQ29tbWl0V2hlbldlUmVhY2hTdGVhZHkgPSBbXTtcblxuICAvLyBJZiB0aGUgb3Bsb2cgaGFuZGxlIHRlbGxzIHVzIHRoYXQgaXQgc2tpcHBlZCBzb21lIGVudHJpZXMgKGJlY2F1c2UgaXQgZ290XG4gIC8vIGJlaGluZCwgc2F5KSwgcmUtcG9sbC5cbiAgc2VsZi5fc3RvcEhhbmRsZXMucHVzaChzZWxmLl9tb25nb0hhbmRsZS5fb3Bsb2dIYW5kbGUub25Ta2lwcGVkRW50cmllcyhcbiAgICBmaW5pc2hJZk5lZWRUb1BvbGxRdWVyeShmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLl9uZWVkVG9Qb2xsUXVlcnkoKTtcbiAgICB9KVxuICApKTtcblxuICBmb3JFYWNoVHJpZ2dlcihzZWxmLl9jdXJzb3JEZXNjcmlwdGlvbiwgZnVuY3Rpb24gKHRyaWdnZXIpIHtcbiAgICBzZWxmLl9zdG9wSGFuZGxlcy5wdXNoKHNlbGYuX21vbmdvSGFuZGxlLl9vcGxvZ0hhbmRsZS5vbk9wbG9nRW50cnkoXG4gICAgICB0cmlnZ2VyLCBmdW5jdGlvbiAobm90aWZpY2F0aW9uKSB7XG4gICAgICAgIE1ldGVvci5fbm9ZaWVsZHNBbGxvd2VkKGZpbmlzaElmTmVlZFRvUG9sbFF1ZXJ5KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB2YXIgb3AgPSBub3RpZmljYXRpb24ub3A7XG4gICAgICAgICAgaWYgKG5vdGlmaWNhdGlvbi5kcm9wQ29sbGVjdGlvbiB8fCBub3RpZmljYXRpb24uZHJvcERhdGFiYXNlKSB7XG4gICAgICAgICAgICAvLyBOb3RlOiB0aGlzIGNhbGwgaXMgbm90IGFsbG93ZWQgdG8gYmxvY2sgb24gYW55dGhpbmcgKGVzcGVjaWFsbHlcbiAgICAgICAgICAgIC8vIG9uIHdhaXRpbmcgZm9yIG9wbG9nIGVudHJpZXMgdG8gY2F0Y2ggdXApIGJlY2F1c2UgdGhhdCB3aWxsIGJsb2NrXG4gICAgICAgICAgICAvLyBvbk9wbG9nRW50cnkhXG4gICAgICAgICAgICBzZWxmLl9uZWVkVG9Qb2xsUXVlcnkoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gQWxsIG90aGVyIG9wZXJhdG9ycyBzaG91bGQgYmUgaGFuZGxlZCBkZXBlbmRpbmcgb24gcGhhc2VcbiAgICAgICAgICAgIGlmIChzZWxmLl9waGFzZSA9PT0gUEhBU0UuUVVFUllJTkcpIHtcbiAgICAgICAgICAgICAgc2VsZi5faGFuZGxlT3Bsb2dFbnRyeVF1ZXJ5aW5nKG9wKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHNlbGYuX2hhbmRsZU9wbG9nRW50cnlTdGVhZHlPckZldGNoaW5nKG9wKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pKTtcbiAgICAgIH1cbiAgICApKTtcbiAgfSk7XG5cbiAgLy8gWFhYIG9yZGVyaW5nIHcuci50LiBldmVyeXRoaW5nIGVsc2U/XG4gIHNlbGYuX3N0b3BIYW5kbGVzLnB1c2gobGlzdGVuQWxsKFxuICAgIHNlbGYuX2N1cnNvckRlc2NyaXB0aW9uLCBmdW5jdGlvbiAobm90aWZpY2F0aW9uKSB7XG4gICAgICAvLyBJZiB3ZSdyZSBub3QgaW4gYSBwcmUtZmlyZSB3cml0ZSBmZW5jZSwgd2UgZG9uJ3QgaGF2ZSB0byBkbyBhbnl0aGluZy5cbiAgICAgIHZhciBmZW5jZSA9IEREUFNlcnZlci5fQ3VycmVudFdyaXRlRmVuY2UuZ2V0KCk7XG4gICAgICBpZiAoIWZlbmNlIHx8IGZlbmNlLmZpcmVkKVxuICAgICAgICByZXR1cm47XG5cbiAgICAgIGlmIChmZW5jZS5fb3Bsb2dPYnNlcnZlRHJpdmVycykge1xuICAgICAgICBmZW5jZS5fb3Bsb2dPYnNlcnZlRHJpdmVyc1tzZWxmLl9pZF0gPSBzZWxmO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGZlbmNlLl9vcGxvZ09ic2VydmVEcml2ZXJzID0ge307XG4gICAgICBmZW5jZS5fb3Bsb2dPYnNlcnZlRHJpdmVyc1tzZWxmLl9pZF0gPSBzZWxmO1xuXG4gICAgICBmZW5jZS5vbkJlZm9yZUZpcmUoZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZHJpdmVycyA9IGZlbmNlLl9vcGxvZ09ic2VydmVEcml2ZXJzO1xuICAgICAgICBkZWxldGUgZmVuY2UuX29wbG9nT2JzZXJ2ZURyaXZlcnM7XG5cbiAgICAgICAgLy8gVGhpcyBmZW5jZSBjYW5ub3QgZmlyZSB1bnRpbCB3ZSd2ZSBjYXVnaHQgdXAgdG8gXCJ0aGlzIHBvaW50XCIgaW4gdGhlXG4gICAgICAgIC8vIG9wbG9nLCBhbmQgYWxsIG9ic2VydmVycyBtYWRlIGl0IGJhY2sgdG8gdGhlIHN0ZWFkeSBzdGF0ZS5cbiAgICAgICAgc2VsZi5fbW9uZ29IYW5kbGUuX29wbG9nSGFuZGxlLndhaXRVbnRpbENhdWdodFVwKCk7XG5cbiAgICAgICAgXy5lYWNoKGRyaXZlcnMsIGZ1bmN0aW9uIChkcml2ZXIpIHtcbiAgICAgICAgICBpZiAoZHJpdmVyLl9zdG9wcGVkKVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgICAgdmFyIHdyaXRlID0gZmVuY2UuYmVnaW5Xcml0ZSgpO1xuICAgICAgICAgIGlmIChkcml2ZXIuX3BoYXNlID09PSBQSEFTRS5TVEVBRFkpIHtcbiAgICAgICAgICAgIC8vIE1ha2Ugc3VyZSB0aGF0IGFsbCBvZiB0aGUgY2FsbGJhY2tzIGhhdmUgbWFkZSBpdCB0aHJvdWdoIHRoZVxuICAgICAgICAgICAgLy8gbXVsdGlwbGV4ZXIgYW5kIGJlZW4gZGVsaXZlcmVkIHRvIE9ic2VydmVIYW5kbGVzIGJlZm9yZSBjb21taXR0aW5nXG4gICAgICAgICAgICAvLyB3cml0ZXMuXG4gICAgICAgICAgICBkcml2ZXIuX211bHRpcGxleGVyLm9uRmx1c2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICB3cml0ZS5jb21taXR0ZWQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkcml2ZXIuX3dyaXRlc1RvQ29tbWl0V2hlbldlUmVhY2hTdGVhZHkucHVzaCh3cml0ZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgKSk7XG5cbiAgLy8gV2hlbiBNb25nbyBmYWlscyBvdmVyLCB3ZSBuZWVkIHRvIHJlcG9sbCB0aGUgcXVlcnksIGluIGNhc2Ugd2UgcHJvY2Vzc2VkIGFuXG4gIC8vIG9wbG9nIGVudHJ5IHRoYXQgZ290IHJvbGxlZCBiYWNrLlxuICBzZWxmLl9zdG9wSGFuZGxlcy5wdXNoKHNlbGYuX21vbmdvSGFuZGxlLl9vbkZhaWxvdmVyKGZpbmlzaElmTmVlZFRvUG9sbFF1ZXJ5KFxuICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYuX25lZWRUb1BvbGxRdWVyeSgpO1xuICAgIH0pKSk7XG5cbiAgLy8gR2l2ZSBfb2JzZXJ2ZUNoYW5nZXMgYSBjaGFuY2UgdG8gYWRkIHRoZSBuZXcgT2JzZXJ2ZUhhbmRsZSB0byBvdXJcbiAgLy8gbXVsdGlwbGV4ZXIsIHNvIHRoYXQgdGhlIGFkZGVkIGNhbGxzIGdldCBzdHJlYW1lZC5cbiAgTWV0ZW9yLmRlZmVyKGZpbmlzaElmTmVlZFRvUG9sbFF1ZXJ5KGZ1bmN0aW9uICgpIHtcbiAgICBzZWxmLl9ydW5Jbml0aWFsUXVlcnkoKTtcbiAgfSkpO1xufTtcblxuXy5leHRlbmQoT3Bsb2dPYnNlcnZlRHJpdmVyLnByb3RvdHlwZSwge1xuICBfYWRkUHVibGlzaGVkOiBmdW5jdGlvbiAoaWQsIGRvYykge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBNZXRlb3IuX25vWWllbGRzQWxsb3dlZChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgZmllbGRzID0gXy5jbG9uZShkb2MpO1xuICAgICAgZGVsZXRlIGZpZWxkcy5faWQ7XG4gICAgICBzZWxmLl9wdWJsaXNoZWQuc2V0KGlkLCBzZWxmLl9zaGFyZWRQcm9qZWN0aW9uRm4oZG9jKSk7XG4gICAgICBzZWxmLl9tdWx0aXBsZXhlci5hZGRlZChpZCwgc2VsZi5fcHJvamVjdGlvbkZuKGZpZWxkcykpO1xuXG4gICAgICAvLyBBZnRlciBhZGRpbmcgdGhpcyBkb2N1bWVudCwgdGhlIHB1Ymxpc2hlZCBzZXQgbWlnaHQgYmUgb3ZlcmZsb3dlZFxuICAgICAgLy8gKGV4Y2VlZGluZyBjYXBhY2l0eSBzcGVjaWZpZWQgYnkgbGltaXQpLiBJZiBzbywgcHVzaCB0aGUgbWF4aW11bVxuICAgICAgLy8gZWxlbWVudCB0byB0aGUgYnVmZmVyLCB3ZSBtaWdodCB3YW50IHRvIHNhdmUgaXQgaW4gbWVtb3J5IHRvIHJlZHVjZSB0aGVcbiAgICAgIC8vIGFtb3VudCBvZiBNb25nbyBsb29rdXBzIGluIHRoZSBmdXR1cmUuXG4gICAgICBpZiAoc2VsZi5fbGltaXQgJiYgc2VsZi5fcHVibGlzaGVkLnNpemUoKSA+IHNlbGYuX2xpbWl0KSB7XG4gICAgICAgIC8vIFhYWCBpbiB0aGVvcnkgdGhlIHNpemUgb2YgcHVibGlzaGVkIGlzIG5vIG1vcmUgdGhhbiBsaW1pdCsxXG4gICAgICAgIGlmIChzZWxmLl9wdWJsaXNoZWQuc2l6ZSgpICE9PSBzZWxmLl9saW1pdCArIDEpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBZnRlciBhZGRpbmcgdG8gcHVibGlzaGVkLCBcIiArXG4gICAgICAgICAgICAgICAgICAgICAgICAgIChzZWxmLl9wdWJsaXNoZWQuc2l6ZSgpIC0gc2VsZi5fbGltaXQpICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCIgZG9jdW1lbnRzIGFyZSBvdmVyZmxvd2luZyB0aGUgc2V0XCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIG92ZXJmbG93aW5nRG9jSWQgPSBzZWxmLl9wdWJsaXNoZWQubWF4RWxlbWVudElkKCk7XG4gICAgICAgIHZhciBvdmVyZmxvd2luZ0RvYyA9IHNlbGYuX3B1Ymxpc2hlZC5nZXQob3ZlcmZsb3dpbmdEb2NJZCk7XG5cbiAgICAgICAgaWYgKEVKU09OLmVxdWFscyhvdmVyZmxvd2luZ0RvY0lkLCBpZCkpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgZG9jdW1lbnQganVzdCBhZGRlZCBpcyBvdmVyZmxvd2luZyB0aGUgcHVibGlzaGVkIHNldFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNlbGYuX3B1Ymxpc2hlZC5yZW1vdmUob3ZlcmZsb3dpbmdEb2NJZCk7XG4gICAgICAgIHNlbGYuX211bHRpcGxleGVyLnJlbW92ZWQob3ZlcmZsb3dpbmdEb2NJZCk7XG4gICAgICAgIHNlbGYuX2FkZEJ1ZmZlcmVkKG92ZXJmbG93aW5nRG9jSWQsIG92ZXJmbG93aW5nRG9jKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcbiAgX3JlbW92ZVB1Ymxpc2hlZDogZnVuY3Rpb24gKGlkKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIE1ldGVvci5fbm9ZaWVsZHNBbGxvd2VkKGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYuX3B1Ymxpc2hlZC5yZW1vdmUoaWQpO1xuICAgICAgc2VsZi5fbXVsdGlwbGV4ZXIucmVtb3ZlZChpZCk7XG4gICAgICBpZiAoISBzZWxmLl9saW1pdCB8fCBzZWxmLl9wdWJsaXNoZWQuc2l6ZSgpID09PSBzZWxmLl9saW1pdClcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICBpZiAoc2VsZi5fcHVibGlzaGVkLnNpemUoKSA+IHNlbGYuX2xpbWl0KVxuICAgICAgICB0aHJvdyBFcnJvcihcInNlbGYuX3B1Ymxpc2hlZCBnb3QgdG9vIGJpZ1wiKTtcblxuICAgICAgLy8gT0ssIHdlIGFyZSBwdWJsaXNoaW5nIGxlc3MgdGhhbiB0aGUgbGltaXQuIE1heWJlIHdlIHNob3VsZCBsb29rIGluIHRoZVxuICAgICAgLy8gYnVmZmVyIHRvIGZpbmQgdGhlIG5leHQgZWxlbWVudCBwYXN0IHdoYXQgd2Ugd2VyZSBwdWJsaXNoaW5nIGJlZm9yZS5cblxuICAgICAgaWYgKCFzZWxmLl91bnB1Ymxpc2hlZEJ1ZmZlci5lbXB0eSgpKSB7XG4gICAgICAgIC8vIFRoZXJlJ3Mgc29tZXRoaW5nIGluIHRoZSBidWZmZXI7IG1vdmUgdGhlIGZpcnN0IHRoaW5nIGluIGl0IHRvXG4gICAgICAgIC8vIF9wdWJsaXNoZWQuXG4gICAgICAgIHZhciBuZXdEb2NJZCA9IHNlbGYuX3VucHVibGlzaGVkQnVmZmVyLm1pbkVsZW1lbnRJZCgpO1xuICAgICAgICB2YXIgbmV3RG9jID0gc2VsZi5fdW5wdWJsaXNoZWRCdWZmZXIuZ2V0KG5ld0RvY0lkKTtcbiAgICAgICAgc2VsZi5fcmVtb3ZlQnVmZmVyZWQobmV3RG9jSWQpO1xuICAgICAgICBzZWxmLl9hZGRQdWJsaXNoZWQobmV3RG9jSWQsIG5ld0RvYyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gVGhlcmUncyBub3RoaW5nIGluIHRoZSBidWZmZXIuICBUaGlzIGNvdWxkIG1lYW4gb25lIG9mIGEgZmV3IHRoaW5ncy5cblxuICAgICAgLy8gKGEpIFdlIGNvdWxkIGJlIGluIHRoZSBtaWRkbGUgb2YgcmUtcnVubmluZyB0aGUgcXVlcnkgKHNwZWNpZmljYWxseSwgd2VcbiAgICAgIC8vIGNvdWxkIGJlIGluIF9wdWJsaXNoTmV3UmVzdWx0cykuIEluIHRoYXQgY2FzZSwgX3VucHVibGlzaGVkQnVmZmVyIGlzXG4gICAgICAvLyBlbXB0eSBiZWNhdXNlIHdlIGNsZWFyIGl0IGF0IHRoZSBiZWdpbm5pbmcgb2YgX3B1Ymxpc2hOZXdSZXN1bHRzLiBJblxuICAgICAgLy8gdGhpcyBjYXNlLCBvdXIgY2FsbGVyIGFscmVhZHkga25vd3MgdGhlIGVudGlyZSBhbnN3ZXIgdG8gdGhlIHF1ZXJ5IGFuZFxuICAgICAgLy8gd2UgZG9uJ3QgbmVlZCB0byBkbyBhbnl0aGluZyBmYW5jeSBoZXJlLiAgSnVzdCByZXR1cm4uXG4gICAgICBpZiAoc2VsZi5fcGhhc2UgPT09IFBIQVNFLlFVRVJZSU5HKVxuICAgICAgICByZXR1cm47XG5cbiAgICAgIC8vIChiKSBXZSdyZSBwcmV0dHkgY29uZmlkZW50IHRoYXQgdGhlIHVuaW9uIG9mIF9wdWJsaXNoZWQgYW5kXG4gICAgICAvLyBfdW5wdWJsaXNoZWRCdWZmZXIgY29udGFpbiBhbGwgZG9jdW1lbnRzIHRoYXQgbWF0Y2ggc2VsZWN0b3IuIEJlY2F1c2VcbiAgICAgIC8vIF91bnB1Ymxpc2hlZEJ1ZmZlciBpcyBlbXB0eSwgdGhhdCBtZWFucyB3ZSdyZSBjb25maWRlbnQgdGhhdCBfcHVibGlzaGVkXG4gICAgICAvLyBjb250YWlucyBhbGwgZG9jdW1lbnRzIHRoYXQgbWF0Y2ggc2VsZWN0b3IuIFNvIHdlIGhhdmUgbm90aGluZyB0byBkby5cbiAgICAgIGlmIChzZWxmLl9zYWZlQXBwZW5kVG9CdWZmZXIpXG4gICAgICAgIHJldHVybjtcblxuICAgICAgLy8gKGMpIE1heWJlIHRoZXJlIGFyZSBvdGhlciBkb2N1bWVudHMgb3V0IHRoZXJlIHRoYXQgc2hvdWxkIGJlIGluIG91clxuICAgICAgLy8gYnVmZmVyLiBCdXQgaW4gdGhhdCBjYXNlLCB3aGVuIHdlIGVtcHRpZWQgX3VucHVibGlzaGVkQnVmZmVyIGluXG4gICAgICAvLyBfcmVtb3ZlQnVmZmVyZWQsIHdlIHNob3VsZCBoYXZlIGNhbGxlZCBfbmVlZFRvUG9sbFF1ZXJ5LCB3aGljaCB3aWxsXG4gICAgICAvLyBlaXRoZXIgcHV0IHNvbWV0aGluZyBpbiBfdW5wdWJsaXNoZWRCdWZmZXIgb3Igc2V0IF9zYWZlQXBwZW5kVG9CdWZmZXJcbiAgICAgIC8vIChvciBib3RoKSwgYW5kIGl0IHdpbGwgcHV0IHVzIGluIFFVRVJZSU5HIGZvciB0aGF0IHdob2xlIHRpbWUuIFNvIGluXG4gICAgICAvLyBmYWN0LCB3ZSBzaG91bGRuJ3QgYmUgYWJsZSB0byBnZXQgaGVyZS5cblxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQnVmZmVyIGluZXhwbGljYWJseSBlbXB0eVwiKTtcbiAgICB9KTtcbiAgfSxcbiAgX2NoYW5nZVB1Ymxpc2hlZDogZnVuY3Rpb24gKGlkLCBvbGREb2MsIG5ld0RvYykge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBNZXRlb3IuX25vWWllbGRzQWxsb3dlZChmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLl9wdWJsaXNoZWQuc2V0KGlkLCBzZWxmLl9zaGFyZWRQcm9qZWN0aW9uRm4obmV3RG9jKSk7XG4gICAgICB2YXIgcHJvamVjdGVkTmV3ID0gc2VsZi5fcHJvamVjdGlvbkZuKG5ld0RvYyk7XG4gICAgICB2YXIgcHJvamVjdGVkT2xkID0gc2VsZi5fcHJvamVjdGlvbkZuKG9sZERvYyk7XG4gICAgICB2YXIgY2hhbmdlZCA9IERpZmZTZXF1ZW5jZS5tYWtlQ2hhbmdlZEZpZWxkcyhcbiAgICAgICAgcHJvamVjdGVkTmV3LCBwcm9qZWN0ZWRPbGQpO1xuICAgICAgaWYgKCFfLmlzRW1wdHkoY2hhbmdlZCkpXG4gICAgICAgIHNlbGYuX211bHRpcGxleGVyLmNoYW5nZWQoaWQsIGNoYW5nZWQpO1xuICAgIH0pO1xuICB9LFxuICBfYWRkQnVmZmVyZWQ6IGZ1bmN0aW9uIChpZCwgZG9jKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIE1ldGVvci5fbm9ZaWVsZHNBbGxvd2VkKGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYuX3VucHVibGlzaGVkQnVmZmVyLnNldChpZCwgc2VsZi5fc2hhcmVkUHJvamVjdGlvbkZuKGRvYykpO1xuXG4gICAgICAvLyBJZiBzb21ldGhpbmcgaXMgb3ZlcmZsb3dpbmcgdGhlIGJ1ZmZlciwgd2UganVzdCByZW1vdmUgaXQgZnJvbSBjYWNoZVxuICAgICAgaWYgKHNlbGYuX3VucHVibGlzaGVkQnVmZmVyLnNpemUoKSA+IHNlbGYuX2xpbWl0KSB7XG4gICAgICAgIHZhciBtYXhCdWZmZXJlZElkID0gc2VsZi5fdW5wdWJsaXNoZWRCdWZmZXIubWF4RWxlbWVudElkKCk7XG5cbiAgICAgICAgc2VsZi5fdW5wdWJsaXNoZWRCdWZmZXIucmVtb3ZlKG1heEJ1ZmZlcmVkSWQpO1xuXG4gICAgICAgIC8vIFNpbmNlIHNvbWV0aGluZyBtYXRjaGluZyBpcyByZW1vdmVkIGZyb20gY2FjaGUgKGJvdGggcHVibGlzaGVkIHNldCBhbmRcbiAgICAgICAgLy8gYnVmZmVyKSwgc2V0IGZsYWcgdG8gZmFsc2VcbiAgICAgICAgc2VsZi5fc2FmZUFwcGVuZFRvQnVmZmVyID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG4gIC8vIElzIGNhbGxlZCBlaXRoZXIgdG8gcmVtb3ZlIHRoZSBkb2MgY29tcGxldGVseSBmcm9tIG1hdGNoaW5nIHNldCBvciB0byBtb3ZlXG4gIC8vIGl0IHRvIHRoZSBwdWJsaXNoZWQgc2V0IGxhdGVyLlxuICBfcmVtb3ZlQnVmZmVyZWQ6IGZ1bmN0aW9uIChpZCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBNZXRlb3IuX25vWWllbGRzQWxsb3dlZChmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLl91bnB1Ymxpc2hlZEJ1ZmZlci5yZW1vdmUoaWQpO1xuICAgICAgLy8gVG8ga2VlcCB0aGUgY29udHJhY3QgXCJidWZmZXIgaXMgbmV2ZXIgZW1wdHkgaW4gU1RFQURZIHBoYXNlIHVubGVzcyB0aGVcbiAgICAgIC8vIGV2ZXJ5dGhpbmcgbWF0Y2hpbmcgZml0cyBpbnRvIHB1Ymxpc2hlZFwiIHRydWUsIHdlIHBvbGwgZXZlcnl0aGluZyBhc1xuICAgICAgLy8gc29vbiBhcyB3ZSBzZWUgdGhlIGJ1ZmZlciBiZWNvbWluZyBlbXB0eS5cbiAgICAgIGlmICghIHNlbGYuX3VucHVibGlzaGVkQnVmZmVyLnNpemUoKSAmJiAhIHNlbGYuX3NhZmVBcHBlbmRUb0J1ZmZlcilcbiAgICAgICAgc2VsZi5fbmVlZFRvUG9sbFF1ZXJ5KCk7XG4gICAgfSk7XG4gIH0sXG4gIC8vIENhbGxlZCB3aGVuIGEgZG9jdW1lbnQgaGFzIGpvaW5lZCB0aGUgXCJNYXRjaGluZ1wiIHJlc3VsdHMgc2V0LlxuICAvLyBUYWtlcyByZXNwb25zaWJpbGl0eSBvZiBrZWVwaW5nIF91bnB1Ymxpc2hlZEJ1ZmZlciBpbiBzeW5jIHdpdGggX3B1Ymxpc2hlZFxuICAvLyBhbmQgdGhlIGVmZmVjdCBvZiBsaW1pdCBlbmZvcmNlZC5cbiAgX2FkZE1hdGNoaW5nOiBmdW5jdGlvbiAoZG9jKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIE1ldGVvci5fbm9ZaWVsZHNBbGxvd2VkKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBpZCA9IGRvYy5faWQ7XG4gICAgICBpZiAoc2VsZi5fcHVibGlzaGVkLmhhcyhpZCkpXG4gICAgICAgIHRocm93IEVycm9yKFwidHJpZWQgdG8gYWRkIHNvbWV0aGluZyBhbHJlYWR5IHB1Ymxpc2hlZCBcIiArIGlkKTtcbiAgICAgIGlmIChzZWxmLl9saW1pdCAmJiBzZWxmLl91bnB1Ymxpc2hlZEJ1ZmZlci5oYXMoaWQpKVxuICAgICAgICB0aHJvdyBFcnJvcihcInRyaWVkIHRvIGFkZCBzb21ldGhpbmcgYWxyZWFkeSBleGlzdGVkIGluIGJ1ZmZlciBcIiArIGlkKTtcblxuICAgICAgdmFyIGxpbWl0ID0gc2VsZi5fbGltaXQ7XG4gICAgICB2YXIgY29tcGFyYXRvciA9IHNlbGYuX2NvbXBhcmF0b3I7XG4gICAgICB2YXIgbWF4UHVibGlzaGVkID0gKGxpbWl0ICYmIHNlbGYuX3B1Ymxpc2hlZC5zaXplKCkgPiAwKSA/XG4gICAgICAgIHNlbGYuX3B1Ymxpc2hlZC5nZXQoc2VsZi5fcHVibGlzaGVkLm1heEVsZW1lbnRJZCgpKSA6IG51bGw7XG4gICAgICB2YXIgbWF4QnVmZmVyZWQgPSAobGltaXQgJiYgc2VsZi5fdW5wdWJsaXNoZWRCdWZmZXIuc2l6ZSgpID4gMClcbiAgICAgICAgPyBzZWxmLl91bnB1Ymxpc2hlZEJ1ZmZlci5nZXQoc2VsZi5fdW5wdWJsaXNoZWRCdWZmZXIubWF4RWxlbWVudElkKCkpXG4gICAgICAgIDogbnVsbDtcbiAgICAgIC8vIFRoZSBxdWVyeSBpcyB1bmxpbWl0ZWQgb3IgZGlkbid0IHB1Ymxpc2ggZW5vdWdoIGRvY3VtZW50cyB5ZXQgb3IgdGhlXG4gICAgICAvLyBuZXcgZG9jdW1lbnQgd291bGQgZml0IGludG8gcHVibGlzaGVkIHNldCBwdXNoaW5nIHRoZSBtYXhpbXVtIGVsZW1lbnRcbiAgICAgIC8vIG91dCwgdGhlbiB3ZSBuZWVkIHRvIHB1Ymxpc2ggdGhlIGRvYy5cbiAgICAgIHZhciB0b1B1Ymxpc2ggPSAhIGxpbWl0IHx8IHNlbGYuX3B1Ymxpc2hlZC5zaXplKCkgPCBsaW1pdCB8fFxuICAgICAgICBjb21wYXJhdG9yKGRvYywgbWF4UHVibGlzaGVkKSA8IDA7XG5cbiAgICAgIC8vIE90aGVyd2lzZSB3ZSBtaWdodCBuZWVkIHRvIGJ1ZmZlciBpdCAob25seSBpbiBjYXNlIG9mIGxpbWl0ZWQgcXVlcnkpLlxuICAgICAgLy8gQnVmZmVyaW5nIGlzIGFsbG93ZWQgaWYgdGhlIGJ1ZmZlciBpcyBub3QgZmlsbGVkIHVwIHlldCBhbmQgYWxsXG4gICAgICAvLyBtYXRjaGluZyBkb2NzIGFyZSBlaXRoZXIgaW4gdGhlIHB1Ymxpc2hlZCBzZXQgb3IgaW4gdGhlIGJ1ZmZlci5cbiAgICAgIHZhciBjYW5BcHBlbmRUb0J1ZmZlciA9ICF0b1B1Ymxpc2ggJiYgc2VsZi5fc2FmZUFwcGVuZFRvQnVmZmVyICYmXG4gICAgICAgIHNlbGYuX3VucHVibGlzaGVkQnVmZmVyLnNpemUoKSA8IGxpbWl0O1xuXG4gICAgICAvLyBPciBpZiBpdCBpcyBzbWFsbCBlbm91Z2ggdG8gYmUgc2FmZWx5IGluc2VydGVkIHRvIHRoZSBtaWRkbGUgb3IgdGhlXG4gICAgICAvLyBiZWdpbm5pbmcgb2YgdGhlIGJ1ZmZlci5cbiAgICAgIHZhciBjYW5JbnNlcnRJbnRvQnVmZmVyID0gIXRvUHVibGlzaCAmJiBtYXhCdWZmZXJlZCAmJlxuICAgICAgICBjb21wYXJhdG9yKGRvYywgbWF4QnVmZmVyZWQpIDw9IDA7XG5cbiAgICAgIHZhciB0b0J1ZmZlciA9IGNhbkFwcGVuZFRvQnVmZmVyIHx8IGNhbkluc2VydEludG9CdWZmZXI7XG5cbiAgICAgIGlmICh0b1B1Ymxpc2gpIHtcbiAgICAgICAgc2VsZi5fYWRkUHVibGlzaGVkKGlkLCBkb2MpO1xuICAgICAgfSBlbHNlIGlmICh0b0J1ZmZlcikge1xuICAgICAgICBzZWxmLl9hZGRCdWZmZXJlZChpZCwgZG9jKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGRyb3BwaW5nIGl0IGFuZCBub3Qgc2F2aW5nIHRvIHRoZSBjYWNoZVxuICAgICAgICBzZWxmLl9zYWZlQXBwZW5kVG9CdWZmZXIgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcbiAgLy8gQ2FsbGVkIHdoZW4gYSBkb2N1bWVudCBsZWF2ZXMgdGhlIFwiTWF0Y2hpbmdcIiByZXN1bHRzIHNldC5cbiAgLy8gVGFrZXMgcmVzcG9uc2liaWxpdHkgb2Yga2VlcGluZyBfdW5wdWJsaXNoZWRCdWZmZXIgaW4gc3luYyB3aXRoIF9wdWJsaXNoZWRcbiAgLy8gYW5kIHRoZSBlZmZlY3Qgb2YgbGltaXQgZW5mb3JjZWQuXG4gIF9yZW1vdmVNYXRjaGluZzogZnVuY3Rpb24gKGlkKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIE1ldGVvci5fbm9ZaWVsZHNBbGxvd2VkKGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICghIHNlbGYuX3B1Ymxpc2hlZC5oYXMoaWQpICYmICEgc2VsZi5fbGltaXQpXG4gICAgICAgIHRocm93IEVycm9yKFwidHJpZWQgdG8gcmVtb3ZlIHNvbWV0aGluZyBtYXRjaGluZyBidXQgbm90IGNhY2hlZCBcIiArIGlkKTtcblxuICAgICAgaWYgKHNlbGYuX3B1Ymxpc2hlZC5oYXMoaWQpKSB7XG4gICAgICAgIHNlbGYuX3JlbW92ZVB1Ymxpc2hlZChpZCk7XG4gICAgICB9IGVsc2UgaWYgKHNlbGYuX3VucHVibGlzaGVkQnVmZmVyLmhhcyhpZCkpIHtcbiAgICAgICAgc2VsZi5fcmVtb3ZlQnVmZmVyZWQoaWQpO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuICBfaGFuZGxlRG9jOiBmdW5jdGlvbiAoaWQsIG5ld0RvYykge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBNZXRlb3IuX25vWWllbGRzQWxsb3dlZChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgbWF0Y2hlc05vdyA9IG5ld0RvYyAmJiBzZWxmLl9tYXRjaGVyLmRvY3VtZW50TWF0Y2hlcyhuZXdEb2MpLnJlc3VsdDtcblxuICAgICAgdmFyIHB1Ymxpc2hlZEJlZm9yZSA9IHNlbGYuX3B1Ymxpc2hlZC5oYXMoaWQpO1xuICAgICAgdmFyIGJ1ZmZlcmVkQmVmb3JlID0gc2VsZi5fbGltaXQgJiYgc2VsZi5fdW5wdWJsaXNoZWRCdWZmZXIuaGFzKGlkKTtcbiAgICAgIHZhciBjYWNoZWRCZWZvcmUgPSBwdWJsaXNoZWRCZWZvcmUgfHwgYnVmZmVyZWRCZWZvcmU7XG5cbiAgICAgIGlmIChtYXRjaGVzTm93ICYmICFjYWNoZWRCZWZvcmUpIHtcbiAgICAgICAgc2VsZi5fYWRkTWF0Y2hpbmcobmV3RG9jKTtcbiAgICAgIH0gZWxzZSBpZiAoY2FjaGVkQmVmb3JlICYmICFtYXRjaGVzTm93KSB7XG4gICAgICAgIHNlbGYuX3JlbW92ZU1hdGNoaW5nKGlkKTtcbiAgICAgIH0gZWxzZSBpZiAoY2FjaGVkQmVmb3JlICYmIG1hdGNoZXNOb3cpIHtcbiAgICAgICAgdmFyIG9sZERvYyA9IHNlbGYuX3B1Ymxpc2hlZC5nZXQoaWQpO1xuICAgICAgICB2YXIgY29tcGFyYXRvciA9IHNlbGYuX2NvbXBhcmF0b3I7XG4gICAgICAgIHZhciBtaW5CdWZmZXJlZCA9IHNlbGYuX2xpbWl0ICYmIHNlbGYuX3VucHVibGlzaGVkQnVmZmVyLnNpemUoKSAmJlxuICAgICAgICAgIHNlbGYuX3VucHVibGlzaGVkQnVmZmVyLmdldChzZWxmLl91bnB1Ymxpc2hlZEJ1ZmZlci5taW5FbGVtZW50SWQoKSk7XG4gICAgICAgIHZhciBtYXhCdWZmZXJlZDtcblxuICAgICAgICBpZiAocHVibGlzaGVkQmVmb3JlKSB7XG4gICAgICAgICAgLy8gVW5saW1pdGVkIGNhc2Ugd2hlcmUgdGhlIGRvY3VtZW50IHN0YXlzIGluIHB1Ymxpc2hlZCBvbmNlIGl0XG4gICAgICAgICAgLy8gbWF0Y2hlcyBvciB0aGUgY2FzZSB3aGVuIHdlIGRvbid0IGhhdmUgZW5vdWdoIG1hdGNoaW5nIGRvY3MgdG9cbiAgICAgICAgICAvLyBwdWJsaXNoIG9yIHRoZSBjaGFuZ2VkIGJ1dCBtYXRjaGluZyBkb2Mgd2lsbCBzdGF5IGluIHB1Ymxpc2hlZFxuICAgICAgICAgIC8vIGFueXdheXMuXG4gICAgICAgICAgLy9cbiAgICAgICAgICAvLyBYWFg6IFdlIHJlbHkgb24gdGhlIGVtcHRpbmVzcyBvZiBidWZmZXIuIEJlIHN1cmUgdG8gbWFpbnRhaW4gdGhlXG4gICAgICAgICAgLy8gZmFjdCB0aGF0IGJ1ZmZlciBjYW4ndCBiZSBlbXB0eSBpZiB0aGVyZSBhcmUgbWF0Y2hpbmcgZG9jdW1lbnRzIG5vdFxuICAgICAgICAgIC8vIHB1Ymxpc2hlZC4gTm90YWJseSwgd2UgZG9uJ3Qgd2FudCB0byBzY2hlZHVsZSByZXBvbGwgYW5kIGNvbnRpbnVlXG4gICAgICAgICAgLy8gcmVseWluZyBvbiB0aGlzIHByb3BlcnR5LlxuICAgICAgICAgIHZhciBzdGF5c0luUHVibGlzaGVkID0gISBzZWxmLl9saW1pdCB8fFxuICAgICAgICAgICAgc2VsZi5fdW5wdWJsaXNoZWRCdWZmZXIuc2l6ZSgpID09PSAwIHx8XG4gICAgICAgICAgICBjb21wYXJhdG9yKG5ld0RvYywgbWluQnVmZmVyZWQpIDw9IDA7XG5cbiAgICAgICAgICBpZiAoc3RheXNJblB1Ymxpc2hlZCkge1xuICAgICAgICAgICAgc2VsZi5fY2hhbmdlUHVibGlzaGVkKGlkLCBvbGREb2MsIG5ld0RvYyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGFmdGVyIHRoZSBjaGFuZ2UgZG9jIGRvZXNuJ3Qgc3RheSBpbiB0aGUgcHVibGlzaGVkLCByZW1vdmUgaXRcbiAgICAgICAgICAgIHNlbGYuX3JlbW92ZVB1Ymxpc2hlZChpZCk7XG4gICAgICAgICAgICAvLyBidXQgaXQgY2FuIG1vdmUgaW50byBidWZmZXJlZCBub3csIGNoZWNrIGl0XG4gICAgICAgICAgICBtYXhCdWZmZXJlZCA9IHNlbGYuX3VucHVibGlzaGVkQnVmZmVyLmdldChcbiAgICAgICAgICAgICAgc2VsZi5fdW5wdWJsaXNoZWRCdWZmZXIubWF4RWxlbWVudElkKCkpO1xuXG4gICAgICAgICAgICB2YXIgdG9CdWZmZXIgPSBzZWxmLl9zYWZlQXBwZW5kVG9CdWZmZXIgfHxcbiAgICAgICAgICAgICAgICAgIChtYXhCdWZmZXJlZCAmJiBjb21wYXJhdG9yKG5ld0RvYywgbWF4QnVmZmVyZWQpIDw9IDApO1xuXG4gICAgICAgICAgICBpZiAodG9CdWZmZXIpIHtcbiAgICAgICAgICAgICAgc2VsZi5fYWRkQnVmZmVyZWQoaWQsIG5ld0RvYyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAvLyBUaHJvdyBhd2F5IGZyb20gYm90aCBwdWJsaXNoZWQgc2V0IGFuZCBidWZmZXJcbiAgICAgICAgICAgICAgc2VsZi5fc2FmZUFwcGVuZFRvQnVmZmVyID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGJ1ZmZlcmVkQmVmb3JlKSB7XG4gICAgICAgICAgb2xkRG9jID0gc2VsZi5fdW5wdWJsaXNoZWRCdWZmZXIuZ2V0KGlkKTtcbiAgICAgICAgICAvLyByZW1vdmUgdGhlIG9sZCB2ZXJzaW9uIG1hbnVhbGx5IGluc3RlYWQgb2YgdXNpbmcgX3JlbW92ZUJ1ZmZlcmVkIHNvXG4gICAgICAgICAgLy8gd2UgZG9uJ3QgdHJpZ2dlciB0aGUgcXVlcnlpbmcgaW1tZWRpYXRlbHkuICBpZiB3ZSBlbmQgdGhpcyBibG9ja1xuICAgICAgICAgIC8vIHdpdGggdGhlIGJ1ZmZlciBlbXB0eSwgd2Ugd2lsbCBuZWVkIHRvIHRyaWdnZXIgdGhlIHF1ZXJ5IHBvbGxcbiAgICAgICAgICAvLyBtYW51YWxseSB0b28uXG4gICAgICAgICAgc2VsZi5fdW5wdWJsaXNoZWRCdWZmZXIucmVtb3ZlKGlkKTtcblxuICAgICAgICAgIHZhciBtYXhQdWJsaXNoZWQgPSBzZWxmLl9wdWJsaXNoZWQuZ2V0KFxuICAgICAgICAgICAgc2VsZi5fcHVibGlzaGVkLm1heEVsZW1lbnRJZCgpKTtcbiAgICAgICAgICBtYXhCdWZmZXJlZCA9IHNlbGYuX3VucHVibGlzaGVkQnVmZmVyLnNpemUoKSAmJlxuICAgICAgICAgICAgICAgIHNlbGYuX3VucHVibGlzaGVkQnVmZmVyLmdldChcbiAgICAgICAgICAgICAgICAgIHNlbGYuX3VucHVibGlzaGVkQnVmZmVyLm1heEVsZW1lbnRJZCgpKTtcblxuICAgICAgICAgIC8vIHRoZSBidWZmZXJlZCBkb2Mgd2FzIHVwZGF0ZWQsIGl0IGNvdWxkIG1vdmUgdG8gcHVibGlzaGVkXG4gICAgICAgICAgdmFyIHRvUHVibGlzaCA9IGNvbXBhcmF0b3IobmV3RG9jLCBtYXhQdWJsaXNoZWQpIDwgMDtcblxuICAgICAgICAgIC8vIG9yIHN0YXlzIGluIGJ1ZmZlciBldmVuIGFmdGVyIHRoZSBjaGFuZ2VcbiAgICAgICAgICB2YXIgc3RheXNJbkJ1ZmZlciA9ICghIHRvUHVibGlzaCAmJiBzZWxmLl9zYWZlQXBwZW5kVG9CdWZmZXIpIHx8XG4gICAgICAgICAgICAgICAgKCF0b1B1Ymxpc2ggJiYgbWF4QnVmZmVyZWQgJiZcbiAgICAgICAgICAgICAgICAgY29tcGFyYXRvcihuZXdEb2MsIG1heEJ1ZmZlcmVkKSA8PSAwKTtcblxuICAgICAgICAgIGlmICh0b1B1Ymxpc2gpIHtcbiAgICAgICAgICAgIHNlbGYuX2FkZFB1Ymxpc2hlZChpZCwgbmV3RG9jKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHN0YXlzSW5CdWZmZXIpIHtcbiAgICAgICAgICAgIC8vIHN0YXlzIGluIGJ1ZmZlciBidXQgY2hhbmdlc1xuICAgICAgICAgICAgc2VsZi5fdW5wdWJsaXNoZWRCdWZmZXIuc2V0KGlkLCBuZXdEb2MpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBUaHJvdyBhd2F5IGZyb20gYm90aCBwdWJsaXNoZWQgc2V0IGFuZCBidWZmZXJcbiAgICAgICAgICAgIHNlbGYuX3NhZmVBcHBlbmRUb0J1ZmZlciA9IGZhbHNlO1xuICAgICAgICAgICAgLy8gTm9ybWFsbHkgdGhpcyBjaGVjayB3b3VsZCBoYXZlIGJlZW4gZG9uZSBpbiBfcmVtb3ZlQnVmZmVyZWQgYnV0XG4gICAgICAgICAgICAvLyB3ZSBkaWRuJ3QgdXNlIGl0LCBzbyB3ZSBuZWVkIHRvIGRvIGl0IG91cnNlbGYgbm93LlxuICAgICAgICAgICAgaWYgKCEgc2VsZi5fdW5wdWJsaXNoZWRCdWZmZXIuc2l6ZSgpKSB7XG4gICAgICAgICAgICAgIHNlbGYuX25lZWRUb1BvbGxRdWVyeSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJjYWNoZWRCZWZvcmUgaW1wbGllcyBlaXRoZXIgb2YgcHVibGlzaGVkQmVmb3JlIG9yIGJ1ZmZlcmVkQmVmb3JlIGlzIHRydWUuXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG4gIF9mZXRjaE1vZGlmaWVkRG9jdW1lbnRzOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIE1ldGVvci5fbm9ZaWVsZHNBbGxvd2VkKGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYuX3JlZ2lzdGVyUGhhc2VDaGFuZ2UoUEhBU0UuRkVUQ0hJTkcpO1xuICAgICAgLy8gRGVmZXIsIGJlY2F1c2Ugbm90aGluZyBjYWxsZWQgZnJvbSB0aGUgb3Bsb2cgZW50cnkgaGFuZGxlciBtYXkgeWllbGQsXG4gICAgICAvLyBidXQgZmV0Y2goKSB5aWVsZHMuXG4gICAgICBNZXRlb3IuZGVmZXIoZmluaXNoSWZOZWVkVG9Qb2xsUXVlcnkoZnVuY3Rpb24gKCkge1xuICAgICAgICB3aGlsZSAoIXNlbGYuX3N0b3BwZWQgJiYgIXNlbGYuX25lZWRUb0ZldGNoLmVtcHR5KCkpIHtcbiAgICAgICAgICBpZiAoc2VsZi5fcGhhc2UgPT09IFBIQVNFLlFVRVJZSU5HKSB7XG4gICAgICAgICAgICAvLyBXaGlsZSBmZXRjaGluZywgd2UgZGVjaWRlZCB0byBnbyBpbnRvIFFVRVJZSU5HIG1vZGUsIGFuZCB0aGVuIHdlXG4gICAgICAgICAgICAvLyBzYXcgYW5vdGhlciBvcGxvZyBlbnRyeSwgc28gX25lZWRUb0ZldGNoIGlzIG5vdCBlbXB0eS4gQnV0IHdlXG4gICAgICAgICAgICAvLyBzaG91bGRuJ3QgZmV0Y2ggdGhlc2UgZG9jdW1lbnRzIHVudGlsIEFGVEVSIHRoZSBxdWVyeSBpcyBkb25lLlxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gQmVpbmcgaW4gc3RlYWR5IHBoYXNlIGhlcmUgd291bGQgYmUgc3VycHJpc2luZy5cbiAgICAgICAgICBpZiAoc2VsZi5fcGhhc2UgIT09IFBIQVNFLkZFVENISU5HKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwicGhhc2UgaW4gZmV0Y2hNb2RpZmllZERvY3VtZW50czogXCIgKyBzZWxmLl9waGFzZSk7XG5cbiAgICAgICAgICBzZWxmLl9jdXJyZW50bHlGZXRjaGluZyA9IHNlbGYuX25lZWRUb0ZldGNoO1xuICAgICAgICAgIHZhciB0aGlzR2VuZXJhdGlvbiA9ICsrc2VsZi5fZmV0Y2hHZW5lcmF0aW9uO1xuICAgICAgICAgIHNlbGYuX25lZWRUb0ZldGNoID0gbmV3IExvY2FsQ29sbGVjdGlvbi5fSWRNYXA7XG4gICAgICAgICAgdmFyIHdhaXRpbmcgPSAwO1xuICAgICAgICAgIHZhciBmdXQgPSBuZXcgRnV0dXJlO1xuICAgICAgICAgIC8vIFRoaXMgbG9vcCBpcyBzYWZlLCBiZWNhdXNlIF9jdXJyZW50bHlGZXRjaGluZyB3aWxsIG5vdCBiZSB1cGRhdGVkXG4gICAgICAgICAgLy8gZHVyaW5nIHRoaXMgbG9vcCAoaW4gZmFjdCwgaXQgaXMgbmV2ZXIgbXV0YXRlZCkuXG4gICAgICAgICAgc2VsZi5fY3VycmVudGx5RmV0Y2hpbmcuZm9yRWFjaChmdW5jdGlvbiAob3AsIGlkKSB7XG4gICAgICAgICAgICB3YWl0aW5nKys7XG4gICAgICAgICAgICBzZWxmLl9tb25nb0hhbmRsZS5fZG9jRmV0Y2hlci5mZXRjaChcbiAgICAgICAgICAgICAgc2VsZi5fY3Vyc29yRGVzY3JpcHRpb24uY29sbGVjdGlvbk5hbWUsIGlkLCBvcCxcbiAgICAgICAgICAgICAgZmluaXNoSWZOZWVkVG9Qb2xsUXVlcnkoZnVuY3Rpb24gKGVyciwgZG9jKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgTWV0ZW9yLl9kZWJ1ZyhcIkdvdCBleGNlcHRpb24gd2hpbGUgZmV0Y2hpbmcgZG9jdW1lbnRzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgd2UgZ2V0IGFuIGVycm9yIGZyb20gdGhlIGZldGNoZXIgKGVnLCB0cm91YmxlXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbm5lY3RpbmcgdG8gTW9uZ28pLCBsZXQncyBqdXN0IGFiYW5kb24gdGhlIGZldGNoIHBoYXNlXG4gICAgICAgICAgICAgICAgICAgIC8vIGFsdG9nZXRoZXIgYW5kIGZhbGwgYmFjayB0byBwb2xsaW5nLiBJdCdzIG5vdCBsaWtlIHdlJ3JlXG4gICAgICAgICAgICAgICAgICAgIC8vIGdldHRpbmcgbGl2ZSB1cGRhdGVzIGFueXdheS5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYuX3BoYXNlICE9PSBQSEFTRS5RVUVSWUlORykge1xuICAgICAgICAgICAgICAgICAgICAgIHNlbGYuX25lZWRUb1BvbGxRdWVyeSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCFzZWxmLl9zdG9wcGVkICYmIHNlbGYuX3BoYXNlID09PSBQSEFTRS5GRVRDSElOR1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiBzZWxmLl9mZXRjaEdlbmVyYXRpb24gPT09IHRoaXNHZW5lcmF0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFdlIHJlLWNoZWNrIHRoZSBnZW5lcmF0aW9uIGluIGNhc2Ugd2UndmUgaGFkIGFuIGV4cGxpY2l0XG4gICAgICAgICAgICAgICAgICAgIC8vIF9wb2xsUXVlcnkgY2FsbCAoZWcsIGluIGFub3RoZXIgZmliZXIpIHdoaWNoIHNob3VsZFxuICAgICAgICAgICAgICAgICAgICAvLyBlZmZlY3RpdmVseSBjYW5jZWwgdGhpcyByb3VuZCBvZiBmZXRjaGVzLiAgKF9wb2xsUXVlcnlcbiAgICAgICAgICAgICAgICAgICAgLy8gaW5jcmVtZW50cyB0aGUgZ2VuZXJhdGlvbi4pXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuX2hhbmRsZURvYyhpZCwgZG9jKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAgICAgd2FpdGluZy0tO1xuICAgICAgICAgICAgICAgICAgLy8gQmVjYXVzZSBmZXRjaCgpIG5ldmVyIGNhbGxzIGl0cyBjYWxsYmFjayBzeW5jaHJvbm91c2x5LFxuICAgICAgICAgICAgICAgICAgLy8gdGhpcyBpcyBzYWZlIChpZSwgd2Ugd29uJ3QgY2FsbCBmdXQucmV0dXJuKCkgYmVmb3JlIHRoZVxuICAgICAgICAgICAgICAgICAgLy8gZm9yRWFjaCBpcyBkb25lKS5cbiAgICAgICAgICAgICAgICAgIGlmICh3YWl0aW5nID09PSAwKVxuICAgICAgICAgICAgICAgICAgICBmdXQucmV0dXJuKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgZnV0LndhaXQoKTtcbiAgICAgICAgICAvLyBFeGl0IG5vdyBpZiB3ZSd2ZSBoYWQgYSBfcG9sbFF1ZXJ5IGNhbGwgKGhlcmUgb3IgaW4gYW5vdGhlciBmaWJlcikuXG4gICAgICAgICAgaWYgKHNlbGYuX3BoYXNlID09PSBQSEFTRS5RVUVSWUlORylcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICBzZWxmLl9jdXJyZW50bHlGZXRjaGluZyA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgLy8gV2UncmUgZG9uZSBmZXRjaGluZywgc28gd2UgY2FuIGJlIHN0ZWFkeSwgdW5sZXNzIHdlJ3ZlIGhhZCBhXG4gICAgICAgIC8vIF9wb2xsUXVlcnkgY2FsbCAoaGVyZSBvciBpbiBhbm90aGVyIGZpYmVyKS5cbiAgICAgICAgaWYgKHNlbGYuX3BoYXNlICE9PSBQSEFTRS5RVUVSWUlORylcbiAgICAgICAgICBzZWxmLl9iZVN0ZWFkeSgpO1xuICAgICAgfSkpO1xuICAgIH0pO1xuICB9LFxuICBfYmVTdGVhZHk6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgTWV0ZW9yLl9ub1lpZWxkc0FsbG93ZWQoZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi5fcmVnaXN0ZXJQaGFzZUNoYW5nZShQSEFTRS5TVEVBRFkpO1xuICAgICAgdmFyIHdyaXRlcyA9IHNlbGYuX3dyaXRlc1RvQ29tbWl0V2hlbldlUmVhY2hTdGVhZHk7XG4gICAgICBzZWxmLl93cml0ZXNUb0NvbW1pdFdoZW5XZVJlYWNoU3RlYWR5ID0gW107XG4gICAgICBzZWxmLl9tdWx0aXBsZXhlci5vbkZsdXNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgXy5lYWNoKHdyaXRlcywgZnVuY3Rpb24gKHcpIHtcbiAgICAgICAgICB3LmNvbW1pdHRlZCgpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9LFxuICBfaGFuZGxlT3Bsb2dFbnRyeVF1ZXJ5aW5nOiBmdW5jdGlvbiAob3ApIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgTWV0ZW9yLl9ub1lpZWxkc0FsbG93ZWQoZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi5fbmVlZFRvRmV0Y2guc2V0KGlkRm9yT3Aob3ApLCBvcCk7XG4gICAgfSk7XG4gIH0sXG4gIF9oYW5kbGVPcGxvZ0VudHJ5U3RlYWR5T3JGZXRjaGluZzogZnVuY3Rpb24gKG9wKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIE1ldGVvci5fbm9ZaWVsZHNBbGxvd2VkKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBpZCA9IGlkRm9yT3Aob3ApO1xuICAgICAgLy8gSWYgd2UncmUgYWxyZWFkeSBmZXRjaGluZyB0aGlzIG9uZSwgb3IgYWJvdXQgdG8sIHdlIGNhbid0IG9wdGltaXplO1xuICAgICAgLy8gbWFrZSBzdXJlIHRoYXQgd2UgZmV0Y2ggaXQgYWdhaW4gaWYgbmVjZXNzYXJ5LlxuICAgICAgaWYgKHNlbGYuX3BoYXNlID09PSBQSEFTRS5GRVRDSElORyAmJlxuICAgICAgICAgICgoc2VsZi5fY3VycmVudGx5RmV0Y2hpbmcgJiYgc2VsZi5fY3VycmVudGx5RmV0Y2hpbmcuaGFzKGlkKSkgfHxcbiAgICAgICAgICAgc2VsZi5fbmVlZFRvRmV0Y2guaGFzKGlkKSkpIHtcbiAgICAgICAgc2VsZi5fbmVlZFRvRmV0Y2guc2V0KGlkLCBvcCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wLm9wID09PSAnZCcpIHtcbiAgICAgICAgaWYgKHNlbGYuX3B1Ymxpc2hlZC5oYXMoaWQpIHx8XG4gICAgICAgICAgICAoc2VsZi5fbGltaXQgJiYgc2VsZi5fdW5wdWJsaXNoZWRCdWZmZXIuaGFzKGlkKSkpXG4gICAgICAgICAgc2VsZi5fcmVtb3ZlTWF0Y2hpbmcoaWQpO1xuICAgICAgfSBlbHNlIGlmIChvcC5vcCA9PT0gJ2knKSB7XG4gICAgICAgIGlmIChzZWxmLl9wdWJsaXNoZWQuaGFzKGlkKSlcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJpbnNlcnQgZm91bmQgZm9yIGFscmVhZHktZXhpc3RpbmcgSUQgaW4gcHVibGlzaGVkXCIpO1xuICAgICAgICBpZiAoc2VsZi5fdW5wdWJsaXNoZWRCdWZmZXIgJiYgc2VsZi5fdW5wdWJsaXNoZWRCdWZmZXIuaGFzKGlkKSlcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJpbnNlcnQgZm91bmQgZm9yIGFscmVhZHktZXhpc3RpbmcgSUQgaW4gYnVmZmVyXCIpO1xuXG4gICAgICAgIC8vIFhYWCB3aGF0IGlmIHNlbGVjdG9yIHlpZWxkcz8gIGZvciBub3cgaXQgY2FuJ3QgYnV0IGxhdGVyIGl0IGNvdWxkXG4gICAgICAgIC8vIGhhdmUgJHdoZXJlXG4gICAgICAgIGlmIChzZWxmLl9tYXRjaGVyLmRvY3VtZW50TWF0Y2hlcyhvcC5vKS5yZXN1bHQpXG4gICAgICAgICAgc2VsZi5fYWRkTWF0Y2hpbmcob3Aubyk7XG4gICAgICB9IGVsc2UgaWYgKG9wLm9wID09PSAndScpIHtcbiAgICAgICAgLy8gSXMgdGhpcyBhIG1vZGlmaWVyICgkc2V0LyR1bnNldCwgd2hpY2ggbWF5IHJlcXVpcmUgdXMgdG8gcG9sbCB0aGVcbiAgICAgICAgLy8gZGF0YWJhc2UgdG8gZmlndXJlIG91dCBpZiB0aGUgd2hvbGUgZG9jdW1lbnQgbWF0Y2hlcyB0aGUgc2VsZWN0b3IpIG9yXG4gICAgICAgIC8vIGEgcmVwbGFjZW1lbnQgKGluIHdoaWNoIGNhc2Ugd2UgY2FuIGp1c3QgZGlyZWN0bHkgcmUtZXZhbHVhdGUgdGhlXG4gICAgICAgIC8vIHNlbGVjdG9yKT9cbiAgICAgICAgdmFyIGlzUmVwbGFjZSA9ICFfLmhhcyhvcC5vLCAnJHNldCcpICYmICFfLmhhcyhvcC5vLCAnJHVuc2V0Jyk7XG4gICAgICAgIC8vIElmIHRoaXMgbW9kaWZpZXIgbW9kaWZpZXMgc29tZXRoaW5nIGluc2lkZSBhbiBFSlNPTiBjdXN0b20gdHlwZSAoaWUsXG4gICAgICAgIC8vIGFueXRoaW5nIHdpdGggRUpTT04kKSwgdGhlbiB3ZSBjYW4ndCB0cnkgdG8gdXNlXG4gICAgICAgIC8vIExvY2FsQ29sbGVjdGlvbi5fbW9kaWZ5LCBzaW5jZSB0aGF0IGp1c3QgbXV0YXRlcyB0aGUgRUpTT04gZW5jb2RpbmcsXG4gICAgICAgIC8vIG5vdCB0aGUgYWN0dWFsIG9iamVjdC5cbiAgICAgICAgdmFyIGNhbkRpcmVjdGx5TW9kaWZ5RG9jID1cbiAgICAgICAgICAhaXNSZXBsYWNlICYmIG1vZGlmaWVyQ2FuQmVEaXJlY3RseUFwcGxpZWQob3Aubyk7XG5cbiAgICAgICAgdmFyIHB1Ymxpc2hlZEJlZm9yZSA9IHNlbGYuX3B1Ymxpc2hlZC5oYXMoaWQpO1xuICAgICAgICB2YXIgYnVmZmVyZWRCZWZvcmUgPSBzZWxmLl9saW1pdCAmJiBzZWxmLl91bnB1Ymxpc2hlZEJ1ZmZlci5oYXMoaWQpO1xuXG4gICAgICAgIGlmIChpc1JlcGxhY2UpIHtcbiAgICAgICAgICBzZWxmLl9oYW5kbGVEb2MoaWQsIF8uZXh0ZW5kKHtfaWQ6IGlkfSwgb3AubykpO1xuICAgICAgICB9IGVsc2UgaWYgKChwdWJsaXNoZWRCZWZvcmUgfHwgYnVmZmVyZWRCZWZvcmUpICYmXG4gICAgICAgICAgICAgICAgICAgY2FuRGlyZWN0bHlNb2RpZnlEb2MpIHtcbiAgICAgICAgICAvLyBPaCBncmVhdCwgd2UgYWN0dWFsbHkga25vdyB3aGF0IHRoZSBkb2N1bWVudCBpcywgc28gd2UgY2FuIGFwcGx5XG4gICAgICAgICAgLy8gdGhpcyBkaXJlY3RseS5cbiAgICAgICAgICB2YXIgbmV3RG9jID0gc2VsZi5fcHVibGlzaGVkLmhhcyhpZClcbiAgICAgICAgICAgID8gc2VsZi5fcHVibGlzaGVkLmdldChpZCkgOiBzZWxmLl91bnB1Ymxpc2hlZEJ1ZmZlci5nZXQoaWQpO1xuICAgICAgICAgIG5ld0RvYyA9IEVKU09OLmNsb25lKG5ld0RvYyk7XG5cbiAgICAgICAgICBuZXdEb2MuX2lkID0gaWQ7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIExvY2FsQ29sbGVjdGlvbi5fbW9kaWZ5KG5ld0RvYywgb3Aubyk7XG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgaWYgKGUubmFtZSAhPT0gXCJNaW5pbW9uZ29FcnJvclwiKVxuICAgICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgICAgLy8gV2UgZGlkbid0IHVuZGVyc3RhbmQgdGhlIG1vZGlmaWVyLiAgUmUtZmV0Y2guXG4gICAgICAgICAgICBzZWxmLl9uZWVkVG9GZXRjaC5zZXQoaWQsIG9wKTtcbiAgICAgICAgICAgIGlmIChzZWxmLl9waGFzZSA9PT0gUEhBU0UuU1RFQURZKSB7XG4gICAgICAgICAgICAgIHNlbGYuX2ZldGNoTW9kaWZpZWREb2N1bWVudHMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgc2VsZi5faGFuZGxlRG9jKGlkLCBzZWxmLl9zaGFyZWRQcm9qZWN0aW9uRm4obmV3RG9jKSk7XG4gICAgICAgIH0gZWxzZSBpZiAoIWNhbkRpcmVjdGx5TW9kaWZ5RG9jIHx8XG4gICAgICAgICAgICAgICAgICAgc2VsZi5fbWF0Y2hlci5jYW5CZWNvbWVUcnVlQnlNb2RpZmllcihvcC5vKSB8fFxuICAgICAgICAgICAgICAgICAgIChzZWxmLl9zb3J0ZXIgJiYgc2VsZi5fc29ydGVyLmFmZmVjdGVkQnlNb2RpZmllcihvcC5vKSkpIHtcbiAgICAgICAgICBzZWxmLl9uZWVkVG9GZXRjaC5zZXQoaWQsIG9wKTtcbiAgICAgICAgICBpZiAoc2VsZi5fcGhhc2UgPT09IFBIQVNFLlNURUFEWSlcbiAgICAgICAgICAgIHNlbGYuX2ZldGNoTW9kaWZpZWREb2N1bWVudHMoKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoXCJYWFggU1VSUFJJU0lORyBPUEVSQVRJT046IFwiICsgb3ApO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuICAvLyBZaWVsZHMhXG4gIF9ydW5Jbml0aWFsUXVlcnk6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgaWYgKHNlbGYuX3N0b3BwZWQpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJvcGxvZyBzdG9wcGVkIHN1cnByaXNpbmdseSBlYXJseVwiKTtcblxuICAgIHNlbGYuX3J1blF1ZXJ5KHtpbml0aWFsOiB0cnVlfSk7ICAvLyB5aWVsZHNcblxuICAgIGlmIChzZWxmLl9zdG9wcGVkKVxuICAgICAgcmV0dXJuOyAgLy8gY2FuIGhhcHBlbiBvbiBxdWVyeUVycm9yXG5cbiAgICAvLyBBbGxvdyBvYnNlcnZlQ2hhbmdlcyBjYWxscyB0byByZXR1cm4uIChBZnRlciB0aGlzLCBpdCdzIHBvc3NpYmxlIGZvclxuICAgIC8vIHN0b3AoKSB0byBiZSBjYWxsZWQuKVxuICAgIHNlbGYuX211bHRpcGxleGVyLnJlYWR5KCk7XG5cbiAgICBzZWxmLl9kb25lUXVlcnlpbmcoKTsgIC8vIHlpZWxkc1xuICB9LFxuXG4gIC8vIEluIHZhcmlvdXMgY2lyY3Vtc3RhbmNlcywgd2UgbWF5IGp1c3Qgd2FudCB0byBzdG9wIHByb2Nlc3NpbmcgdGhlIG9wbG9nIGFuZFxuICAvLyByZS1ydW4gdGhlIGluaXRpYWwgcXVlcnksIGp1c3QgYXMgaWYgd2Ugd2VyZSBhIFBvbGxpbmdPYnNlcnZlRHJpdmVyLlxuICAvL1xuICAvLyBUaGlzIGZ1bmN0aW9uIG1heSBub3QgYmxvY2ssIGJlY2F1c2UgaXQgaXMgY2FsbGVkIGZyb20gYW4gb3Bsb2cgZW50cnlcbiAgLy8gaGFuZGxlci5cbiAgLy9cbiAgLy8gWFhYIFdlIHNob3VsZCBjYWxsIHRoaXMgd2hlbiB3ZSBkZXRlY3QgdGhhdCB3ZSd2ZSBiZWVuIGluIEZFVENISU5HIGZvciBcInRvb1xuICAvLyBsb25nXCIuXG4gIC8vXG4gIC8vIFhYWCBXZSBzaG91bGQgY2FsbCB0aGlzIHdoZW4gd2UgZGV0ZWN0IE1vbmdvIGZhaWxvdmVyIChzaW5jZSB0aGF0IG1pZ2h0XG4gIC8vIG1lYW4gdGhhdCBzb21lIG9mIHRoZSBvcGxvZyBlbnRyaWVzIHdlIGhhdmUgcHJvY2Vzc2VkIGhhdmUgYmVlbiByb2xsZWRcbiAgLy8gYmFjaykuIFRoZSBOb2RlIE1vbmdvIGRyaXZlciBpcyBpbiB0aGUgbWlkZGxlIG9mIGEgYnVuY2ggb2YgaHVnZVxuICAvLyByZWZhY3RvcmluZ3MsIGluY2x1ZGluZyB0aGUgd2F5IHRoYXQgaXQgbm90aWZpZXMgeW91IHdoZW4gcHJpbWFyeVxuICAvLyBjaGFuZ2VzLiBXaWxsIHB1dCBvZmYgaW1wbGVtZW50aW5nIHRoaXMgdW50aWwgZHJpdmVyIDEuNCBpcyBvdXQuXG4gIF9wb2xsUXVlcnk6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgTWV0ZW9yLl9ub1lpZWxkc0FsbG93ZWQoZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHNlbGYuX3N0b3BwZWQpXG4gICAgICAgIHJldHVybjtcblxuICAgICAgLy8gWWF5LCB3ZSBnZXQgdG8gZm9yZ2V0IGFib3V0IGFsbCB0aGUgdGhpbmdzIHdlIHRob3VnaHQgd2UgaGFkIHRvIGZldGNoLlxuICAgICAgc2VsZi5fbmVlZFRvRmV0Y2ggPSBuZXcgTG9jYWxDb2xsZWN0aW9uLl9JZE1hcDtcbiAgICAgIHNlbGYuX2N1cnJlbnRseUZldGNoaW5nID0gbnVsbDtcbiAgICAgICsrc2VsZi5fZmV0Y2hHZW5lcmF0aW9uOyAgLy8gaWdub3JlIGFueSBpbi1mbGlnaHQgZmV0Y2hlc1xuICAgICAgc2VsZi5fcmVnaXN0ZXJQaGFzZUNoYW5nZShQSEFTRS5RVUVSWUlORyk7XG5cbiAgICAgIC8vIERlZmVyIHNvIHRoYXQgd2UgZG9uJ3QgeWllbGQuICBXZSBkb24ndCBuZWVkIGZpbmlzaElmTmVlZFRvUG9sbFF1ZXJ5XG4gICAgICAvLyBoZXJlIGJlY2F1c2UgU3dpdGNoZWRUb1F1ZXJ5IGlzIG5vdCB0aHJvd24gaW4gUVVFUllJTkcgbW9kZS5cbiAgICAgIE1ldGVvci5kZWZlcihmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNlbGYuX3J1blF1ZXJ5KCk7XG4gICAgICAgIHNlbGYuX2RvbmVRdWVyeWluZygpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0sXG5cbiAgLy8gWWllbGRzIVxuICBfcnVuUXVlcnk6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIHZhciBuZXdSZXN1bHRzLCBuZXdCdWZmZXI7XG5cbiAgICAvLyBUaGlzIHdoaWxlIGxvb3AgaXMganVzdCB0byByZXRyeSBmYWlsdXJlcy5cbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgLy8gSWYgd2UndmUgYmVlbiBzdG9wcGVkLCB3ZSBkb24ndCBoYXZlIHRvIHJ1biBhbnl0aGluZyBhbnkgbW9yZS5cbiAgICAgIGlmIChzZWxmLl9zdG9wcGVkKVxuICAgICAgICByZXR1cm47XG5cbiAgICAgIG5ld1Jlc3VsdHMgPSBuZXcgTG9jYWxDb2xsZWN0aW9uLl9JZE1hcDtcbiAgICAgIG5ld0J1ZmZlciA9IG5ldyBMb2NhbENvbGxlY3Rpb24uX0lkTWFwO1xuXG4gICAgICAvLyBRdWVyeSAyeCBkb2N1bWVudHMgYXMgdGhlIGhhbGYgZXhjbHVkZWQgZnJvbSB0aGUgb3JpZ2luYWwgcXVlcnkgd2lsbCBnb1xuICAgICAgLy8gaW50byB1bnB1Ymxpc2hlZCBidWZmZXIgdG8gcmVkdWNlIGFkZGl0aW9uYWwgTW9uZ28gbG9va3VwcyBpbiBjYXNlc1xuICAgICAgLy8gd2hlbiBkb2N1bWVudHMgYXJlIHJlbW92ZWQgZnJvbSB0aGUgcHVibGlzaGVkIHNldCBhbmQgbmVlZCBhXG4gICAgICAvLyByZXBsYWNlbWVudC5cbiAgICAgIC8vIFhYWCBuZWVkcyBtb3JlIHRob3VnaHQgb24gbm9uLXplcm8gc2tpcFxuICAgICAgLy8gWFhYIDIgaXMgYSBcIm1hZ2ljIG51bWJlclwiIG1lYW5pbmcgdGhlcmUgaXMgYW4gZXh0cmEgY2h1bmsgb2YgZG9jcyBmb3JcbiAgICAgIC8vIGJ1ZmZlciBpZiBzdWNoIGlzIG5lZWRlZC5cbiAgICAgIHZhciBjdXJzb3IgPSBzZWxmLl9jdXJzb3JGb3JRdWVyeSh7IGxpbWl0OiBzZWxmLl9saW1pdCAqIDIgfSk7XG4gICAgICB0cnkge1xuICAgICAgICBjdXJzb3IuZm9yRWFjaChmdW5jdGlvbiAoZG9jLCBpKSB7ICAvLyB5aWVsZHNcbiAgICAgICAgICBpZiAoIXNlbGYuX2xpbWl0IHx8IGkgPCBzZWxmLl9saW1pdCkge1xuICAgICAgICAgICAgbmV3UmVzdWx0cy5zZXQoZG9jLl9pZCwgZG9jKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3QnVmZmVyLnNldChkb2MuX2lkLCBkb2MpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBpZiAob3B0aW9ucy5pbml0aWFsICYmIHR5cGVvZihlLmNvZGUpID09PSAnbnVtYmVyJykge1xuICAgICAgICAgIC8vIFRoaXMgaXMgYW4gZXJyb3IgZG9jdW1lbnQgc2VudCB0byB1cyBieSBtb25nb2QsIG5vdCBhIGNvbm5lY3Rpb25cbiAgICAgICAgICAvLyBlcnJvciBnZW5lcmF0ZWQgYnkgdGhlIGNsaWVudC4gQW5kIHdlJ3ZlIG5ldmVyIHNlZW4gdGhpcyBxdWVyeSB3b3JrXG4gICAgICAgICAgLy8gc3VjY2Vzc2Z1bGx5LiBQcm9iYWJseSBpdCdzIGEgYmFkIHNlbGVjdG9yIG9yIHNvbWV0aGluZywgc28gd2VcbiAgICAgICAgICAvLyBzaG91bGQgTk9UIHJldHJ5LiBJbnN0ZWFkLCB3ZSBzaG91bGQgaGFsdCB0aGUgb2JzZXJ2ZSAod2hpY2ggZW5kc1xuICAgICAgICAgIC8vIHVwIGNhbGxpbmcgYHN0b3BgIG9uIHVzKS5cbiAgICAgICAgICBzZWxmLl9tdWx0aXBsZXhlci5xdWVyeUVycm9yKGUpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIER1cmluZyBmYWlsb3ZlciAoZWcpIGlmIHdlIGdldCBhbiBleGNlcHRpb24gd2Ugc2hvdWxkIGxvZyBhbmQgcmV0cnlcbiAgICAgICAgLy8gaW5zdGVhZCBvZiBjcmFzaGluZy5cbiAgICAgICAgTWV0ZW9yLl9kZWJ1ZyhcIkdvdCBleGNlcHRpb24gd2hpbGUgcG9sbGluZyBxdWVyeVwiLCBlKTtcbiAgICAgICAgTWV0ZW9yLl9zbGVlcEZvck1zKDEwMCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHNlbGYuX3N0b3BwZWQpXG4gICAgICByZXR1cm47XG5cbiAgICBzZWxmLl9wdWJsaXNoTmV3UmVzdWx0cyhuZXdSZXN1bHRzLCBuZXdCdWZmZXIpO1xuICB9LFxuXG4gIC8vIFRyYW5zaXRpb25zIHRvIFFVRVJZSU5HIGFuZCBydW5zIGFub3RoZXIgcXVlcnksIG9yIChpZiBhbHJlYWR5IGluIFFVRVJZSU5HKVxuICAvLyBlbnN1cmVzIHRoYXQgd2Ugd2lsbCBxdWVyeSBhZ2FpbiBsYXRlci5cbiAgLy9cbiAgLy8gVGhpcyBmdW5jdGlvbiBtYXkgbm90IGJsb2NrLCBiZWNhdXNlIGl0IGlzIGNhbGxlZCBmcm9tIGFuIG9wbG9nIGVudHJ5XG4gIC8vIGhhbmRsZXIuIEhvd2V2ZXIsIGlmIHdlIHdlcmUgbm90IGFscmVhZHkgaW4gdGhlIFFVRVJZSU5HIHBoYXNlLCBpdCB0aHJvd3NcbiAgLy8gYW4gZXhjZXB0aW9uIHRoYXQgaXMgY2F1Z2h0IGJ5IHRoZSBjbG9zZXN0IHN1cnJvdW5kaW5nXG4gIC8vIGZpbmlzaElmTmVlZFRvUG9sbFF1ZXJ5IGNhbGw7IHRoaXMgZW5zdXJlcyB0aGF0IHdlIGRvbid0IGNvbnRpbnVlIHJ1bm5pbmdcbiAgLy8gY2xvc2UgdGhhdCB3YXMgZGVzaWduZWQgZm9yIGFub3RoZXIgcGhhc2UgaW5zaWRlIFBIQVNFLlFVRVJZSU5HLlxuICAvL1xuICAvLyAoSXQncyBhbHNvIG5lY2Vzc2FyeSB3aGVuZXZlciBsb2dpYyBpbiB0aGlzIGZpbGUgeWllbGRzIHRvIGNoZWNrIHRoYXQgb3RoZXJcbiAgLy8gcGhhc2VzIGhhdmVuJ3QgcHV0IHVzIGludG8gUVVFUllJTkcgbW9kZSwgdGhvdWdoOyBlZyxcbiAgLy8gX2ZldGNoTW9kaWZpZWREb2N1bWVudHMgZG9lcyB0aGlzLilcbiAgX25lZWRUb1BvbGxRdWVyeTogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBNZXRlb3IuX25vWWllbGRzQWxsb3dlZChmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoc2VsZi5fc3RvcHBlZClcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICAvLyBJZiB3ZSdyZSBub3QgYWxyZWFkeSBpbiB0aGUgbWlkZGxlIG9mIGEgcXVlcnksIHdlIGNhbiBxdWVyeSBub3dcbiAgICAgIC8vIChwb3NzaWJseSBwYXVzaW5nIEZFVENISU5HKS5cbiAgICAgIGlmIChzZWxmLl9waGFzZSAhPT0gUEhBU0UuUVVFUllJTkcpIHtcbiAgICAgICAgc2VsZi5fcG9sbFF1ZXJ5KCk7XG4gICAgICAgIHRocm93IG5ldyBTd2l0Y2hlZFRvUXVlcnk7XG4gICAgICB9XG5cbiAgICAgIC8vIFdlJ3JlIGN1cnJlbnRseSBpbiBRVUVSWUlORy4gU2V0IGEgZmxhZyB0byBlbnN1cmUgdGhhdCB3ZSBydW4gYW5vdGhlclxuICAgICAgLy8gcXVlcnkgd2hlbiB3ZSdyZSBkb25lLlxuICAgICAgc2VsZi5fcmVxdWVyeVdoZW5Eb25lVGhpc1F1ZXJ5ID0gdHJ1ZTtcbiAgICB9KTtcbiAgfSxcblxuICAvLyBZaWVsZHMhXG4gIF9kb25lUXVlcnlpbmc6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICBpZiAoc2VsZi5fc3RvcHBlZClcbiAgICAgIHJldHVybjtcbiAgICBzZWxmLl9tb25nb0hhbmRsZS5fb3Bsb2dIYW5kbGUud2FpdFVudGlsQ2F1Z2h0VXAoKTsgIC8vIHlpZWxkc1xuICAgIGlmIChzZWxmLl9zdG9wcGVkKVxuICAgICAgcmV0dXJuO1xuICAgIGlmIChzZWxmLl9waGFzZSAhPT0gUEhBU0UuUVVFUllJTkcpXG4gICAgICB0aHJvdyBFcnJvcihcIlBoYXNlIHVuZXhwZWN0ZWRseSBcIiArIHNlbGYuX3BoYXNlKTtcblxuICAgIE1ldGVvci5fbm9ZaWVsZHNBbGxvd2VkKGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChzZWxmLl9yZXF1ZXJ5V2hlbkRvbmVUaGlzUXVlcnkpIHtcbiAgICAgICAgc2VsZi5fcmVxdWVyeVdoZW5Eb25lVGhpc1F1ZXJ5ID0gZmFsc2U7XG4gICAgICAgIHNlbGYuX3BvbGxRdWVyeSgpO1xuICAgICAgfSBlbHNlIGlmIChzZWxmLl9uZWVkVG9GZXRjaC5lbXB0eSgpKSB7XG4gICAgICAgIHNlbGYuX2JlU3RlYWR5KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZWxmLl9mZXRjaE1vZGlmaWVkRG9jdW1lbnRzKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG5cbiAgX2N1cnNvckZvclF1ZXJ5OiBmdW5jdGlvbiAob3B0aW9uc092ZXJ3cml0ZSkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICByZXR1cm4gTWV0ZW9yLl9ub1lpZWxkc0FsbG93ZWQoZnVuY3Rpb24gKCkge1xuICAgICAgLy8gVGhlIHF1ZXJ5IHdlIHJ1biBpcyBhbG1vc3QgdGhlIHNhbWUgYXMgdGhlIGN1cnNvciB3ZSBhcmUgb2JzZXJ2aW5nLFxuICAgICAgLy8gd2l0aCBhIGZldyBjaGFuZ2VzLiBXZSBuZWVkIHRvIHJlYWQgYWxsIHRoZSBmaWVsZHMgdGhhdCBhcmUgcmVsZXZhbnQgdG9cbiAgICAgIC8vIHRoZSBzZWxlY3Rvciwgbm90IGp1c3QgdGhlIGZpZWxkcyB3ZSBhcmUgZ29pbmcgdG8gcHVibGlzaCAodGhhdCdzIHRoZVxuICAgICAgLy8gXCJzaGFyZWRcIiBwcm9qZWN0aW9uKS4gQW5kIHdlIGRvbid0IHdhbnQgdG8gYXBwbHkgYW55IHRyYW5zZm9ybSBpbiB0aGVcbiAgICAgIC8vIGN1cnNvciwgYmVjYXVzZSBvYnNlcnZlQ2hhbmdlcyBzaG91bGRuJ3QgdXNlIHRoZSB0cmFuc2Zvcm0uXG4gICAgICB2YXIgb3B0aW9ucyA9IF8uY2xvbmUoc2VsZi5fY3Vyc29yRGVzY3JpcHRpb24ub3B0aW9ucyk7XG5cbiAgICAgIC8vIEFsbG93IHRoZSBjYWxsZXIgdG8gbW9kaWZ5IHRoZSBvcHRpb25zLiBVc2VmdWwgdG8gc3BlY2lmeSBkaWZmZXJlbnRcbiAgICAgIC8vIHNraXAgYW5kIGxpbWl0IHZhbHVlcy5cbiAgICAgIF8uZXh0ZW5kKG9wdGlvbnMsIG9wdGlvbnNPdmVyd3JpdGUpO1xuXG4gICAgICBvcHRpb25zLmZpZWxkcyA9IHNlbGYuX3NoYXJlZFByb2plY3Rpb247XG4gICAgICBkZWxldGUgb3B0aW9ucy50cmFuc2Zvcm07XG4gICAgICAvLyBXZSBhcmUgTk9UIGRlZXAgY2xvbmluZyBmaWVsZHMgb3Igc2VsZWN0b3IgaGVyZSwgd2hpY2ggc2hvdWxkIGJlIE9LLlxuICAgICAgdmFyIGRlc2NyaXB0aW9uID0gbmV3IEN1cnNvckRlc2NyaXB0aW9uKFxuICAgICAgICBzZWxmLl9jdXJzb3JEZXNjcmlwdGlvbi5jb2xsZWN0aW9uTmFtZSxcbiAgICAgICAgc2VsZi5fY3Vyc29yRGVzY3JpcHRpb24uc2VsZWN0b3IsXG4gICAgICAgIG9wdGlvbnMpO1xuICAgICAgcmV0dXJuIG5ldyBDdXJzb3Ioc2VsZi5fbW9uZ29IYW5kbGUsIGRlc2NyaXB0aW9uKTtcbiAgICB9KTtcbiAgfSxcblxuXG4gIC8vIFJlcGxhY2Ugc2VsZi5fcHVibGlzaGVkIHdpdGggbmV3UmVzdWx0cyAoYm90aCBhcmUgSWRNYXBzKSwgaW52b2tpbmcgb2JzZXJ2ZVxuICAvLyBjYWxsYmFja3Mgb24gdGhlIG11bHRpcGxleGVyLlxuICAvLyBSZXBsYWNlIHNlbGYuX3VucHVibGlzaGVkQnVmZmVyIHdpdGggbmV3QnVmZmVyLlxuICAvL1xuICAvLyBYWFggVGhpcyBpcyB2ZXJ5IHNpbWlsYXIgdG8gTG9jYWxDb2xsZWN0aW9uLl9kaWZmUXVlcnlVbm9yZGVyZWRDaGFuZ2VzLiBXZVxuICAvLyBzaG91bGQgcmVhbGx5OiAoYSkgVW5pZnkgSWRNYXAgYW5kIE9yZGVyZWREaWN0IGludG8gVW5vcmRlcmVkL09yZGVyZWREaWN0XG4gIC8vIChiKSBSZXdyaXRlIGRpZmYuanMgdG8gdXNlIHRoZXNlIGNsYXNzZXMgaW5zdGVhZCBvZiBhcnJheXMgYW5kIG9iamVjdHMuXG4gIF9wdWJsaXNoTmV3UmVzdWx0czogZnVuY3Rpb24gKG5ld1Jlc3VsdHMsIG5ld0J1ZmZlcikge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBNZXRlb3IuX25vWWllbGRzQWxsb3dlZChmdW5jdGlvbiAoKSB7XG5cbiAgICAgIC8vIElmIHRoZSBxdWVyeSBpcyBsaW1pdGVkIGFuZCB0aGVyZSBpcyBhIGJ1ZmZlciwgc2h1dCBkb3duIHNvIGl0IGRvZXNuJ3RcbiAgICAgIC8vIHN0YXkgaW4gYSB3YXkuXG4gICAgICBpZiAoc2VsZi5fbGltaXQpIHtcbiAgICAgICAgc2VsZi5fdW5wdWJsaXNoZWRCdWZmZXIuY2xlYXIoKTtcbiAgICAgIH1cblxuICAgICAgLy8gRmlyc3QgcmVtb3ZlIGFueXRoaW5nIHRoYXQncyBnb25lLiBCZSBjYXJlZnVsIG5vdCB0byBtb2RpZnlcbiAgICAgIC8vIHNlbGYuX3B1Ymxpc2hlZCB3aGlsZSBpdGVyYXRpbmcgb3ZlciBpdC5cbiAgICAgIHZhciBpZHNUb1JlbW92ZSA9IFtdO1xuICAgICAgc2VsZi5fcHVibGlzaGVkLmZvckVhY2goZnVuY3Rpb24gKGRvYywgaWQpIHtcbiAgICAgICAgaWYgKCFuZXdSZXN1bHRzLmhhcyhpZCkpXG4gICAgICAgICAgaWRzVG9SZW1vdmUucHVzaChpZCk7XG4gICAgICB9KTtcbiAgICAgIF8uZWFjaChpZHNUb1JlbW92ZSwgZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgIHNlbGYuX3JlbW92ZVB1Ymxpc2hlZChpZCk7XG4gICAgICB9KTtcblxuICAgICAgLy8gTm93IGRvIGFkZHMgYW5kIGNoYW5nZXMuXG4gICAgICAvLyBJZiBzZWxmIGhhcyBhIGJ1ZmZlciBhbmQgbGltaXQsIHRoZSBuZXcgZmV0Y2hlZCByZXN1bHQgd2lsbCBiZVxuICAgICAgLy8gbGltaXRlZCBjb3JyZWN0bHkgYXMgdGhlIHF1ZXJ5IGhhcyBzb3J0IHNwZWNpZmllci5cbiAgICAgIG5ld1Jlc3VsdHMuZm9yRWFjaChmdW5jdGlvbiAoZG9jLCBpZCkge1xuICAgICAgICBzZWxmLl9oYW5kbGVEb2MoaWQsIGRvYyk7XG4gICAgICB9KTtcblxuICAgICAgLy8gU2FuaXR5LWNoZWNrIHRoYXQgZXZlcnl0aGluZyB3ZSB0cmllZCB0byBwdXQgaW50byBfcHVibGlzaGVkIGVuZGVkIHVwXG4gICAgICAvLyB0aGVyZS5cbiAgICAgIC8vIFhYWCBpZiB0aGlzIGlzIHNsb3csIHJlbW92ZSBpdCBsYXRlclxuICAgICAgaWYgKHNlbGYuX3B1Ymxpc2hlZC5zaXplKCkgIT09IG5ld1Jlc3VsdHMuc2l6ZSgpKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ1RoZSBNb25nbyBzZXJ2ZXIgYW5kIHRoZSBNZXRlb3IgcXVlcnkgZGlzYWdyZWUgb24gaG93ICcgK1xuICAgICAgICAgICdtYW55IGRvY3VtZW50cyBtYXRjaCB5b3VyIHF1ZXJ5LiBDdXJzb3IgZGVzY3JpcHRpb246ICcsXG4gICAgICAgICAgc2VsZi5fY3Vyc29yRGVzY3JpcHRpb24pO1xuICAgICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgICBcIlRoZSBNb25nbyBzZXJ2ZXIgYW5kIHRoZSBNZXRlb3IgcXVlcnkgZGlzYWdyZWUgb24gaG93IFwiICtcbiAgICAgICAgICAgIFwibWFueSBkb2N1bWVudHMgbWF0Y2ggeW91ciBxdWVyeS4gTWF5YmUgaXQgaXMgaGl0dGluZyBhIE1vbmdvIFwiICtcbiAgICAgICAgICAgIFwiZWRnZSBjYXNlPyBUaGUgcXVlcnkgaXM6IFwiICtcbiAgICAgICAgICAgIEVKU09OLnN0cmluZ2lmeShzZWxmLl9jdXJzb3JEZXNjcmlwdGlvbi5zZWxlY3RvcikpO1xuICAgICAgfVxuICAgICAgc2VsZi5fcHVibGlzaGVkLmZvckVhY2goZnVuY3Rpb24gKGRvYywgaWQpIHtcbiAgICAgICAgaWYgKCFuZXdSZXN1bHRzLmhhcyhpZCkpXG4gICAgICAgICAgdGhyb3cgRXJyb3IoXCJfcHVibGlzaGVkIGhhcyBhIGRvYyB0aGF0IG5ld1Jlc3VsdHMgZG9lc24ndDsgXCIgKyBpZCk7XG4gICAgICB9KTtcblxuICAgICAgLy8gRmluYWxseSwgcmVwbGFjZSB0aGUgYnVmZmVyXG4gICAgICBuZXdCdWZmZXIuZm9yRWFjaChmdW5jdGlvbiAoZG9jLCBpZCkge1xuICAgICAgICBzZWxmLl9hZGRCdWZmZXJlZChpZCwgZG9jKTtcbiAgICAgIH0pO1xuXG4gICAgICBzZWxmLl9zYWZlQXBwZW5kVG9CdWZmZXIgPSBuZXdCdWZmZXIuc2l6ZSgpIDwgc2VsZi5fbGltaXQ7XG4gICAgfSk7XG4gIH0sXG5cbiAgLy8gVGhpcyBzdG9wIGZ1bmN0aW9uIGlzIGludm9rZWQgZnJvbSB0aGUgb25TdG9wIG9mIHRoZSBPYnNlcnZlTXVsdGlwbGV4ZXIsIHNvXG4gIC8vIGl0IHNob3VsZG4ndCBhY3R1YWxseSBiZSBwb3NzaWJsZSB0byBjYWxsIGl0IHVudGlsIHRoZSBtdWx0aXBsZXhlciBpc1xuICAvLyByZWFkeS5cbiAgLy9cbiAgLy8gSXQncyBpbXBvcnRhbnQgdG8gY2hlY2sgc2VsZi5fc3RvcHBlZCBhZnRlciBldmVyeSBjYWxsIGluIHRoaXMgZmlsZSB0aGF0XG4gIC8vIGNhbiB5aWVsZCFcbiAgc3RvcDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBpZiAoc2VsZi5fc3RvcHBlZClcbiAgICAgIHJldHVybjtcbiAgICBzZWxmLl9zdG9wcGVkID0gdHJ1ZTtcbiAgICBfLmVhY2goc2VsZi5fc3RvcEhhbmRsZXMsIGZ1bmN0aW9uIChoYW5kbGUpIHtcbiAgICAgIGhhbmRsZS5zdG9wKCk7XG4gICAgfSk7XG5cbiAgICAvLyBOb3RlOiB3ZSAqZG9uJ3QqIHVzZSBtdWx0aXBsZXhlci5vbkZsdXNoIGhlcmUgYmVjYXVzZSB0aGlzIHN0b3BcbiAgICAvLyBjYWxsYmFjayBpcyBhY3R1YWxseSBpbnZva2VkIGJ5IHRoZSBtdWx0aXBsZXhlciBpdHNlbGYgd2hlbiBpdCBoYXNcbiAgICAvLyBkZXRlcm1pbmVkIHRoYXQgdGhlcmUgYXJlIG5vIGhhbmRsZXMgbGVmdC4gU28gbm90aGluZyBpcyBhY3R1YWxseSBnb2luZ1xuICAgIC8vIHRvIGdldCBmbHVzaGVkIChhbmQgaXQncyBwcm9iYWJseSBub3QgdmFsaWQgdG8gY2FsbCBtZXRob2RzIG9uIHRoZVxuICAgIC8vIGR5aW5nIG11bHRpcGxleGVyKS5cbiAgICBfLmVhY2goc2VsZi5fd3JpdGVzVG9Db21taXRXaGVuV2VSZWFjaFN0ZWFkeSwgZnVuY3Rpb24gKHcpIHtcbiAgICAgIHcuY29tbWl0dGVkKCk7ICAvLyBtYXliZSB5aWVsZHM/XG4gICAgfSk7XG4gICAgc2VsZi5fd3JpdGVzVG9Db21taXRXaGVuV2VSZWFjaFN0ZWFkeSA9IG51bGw7XG5cbiAgICAvLyBQcm9hY3RpdmVseSBkcm9wIHJlZmVyZW5jZXMgdG8gcG90ZW50aWFsbHkgYmlnIHRoaW5ncy5cbiAgICBzZWxmLl9wdWJsaXNoZWQgPSBudWxsO1xuICAgIHNlbGYuX3VucHVibGlzaGVkQnVmZmVyID0gbnVsbDtcbiAgICBzZWxmLl9uZWVkVG9GZXRjaCA9IG51bGw7XG4gICAgc2VsZi5fY3VycmVudGx5RmV0Y2hpbmcgPSBudWxsO1xuICAgIHNlbGYuX29wbG9nRW50cnlIYW5kbGUgPSBudWxsO1xuICAgIHNlbGYuX2xpc3RlbmVyc0hhbmRsZSA9IG51bGw7XG5cbiAgICBQYWNrYWdlWydmYWN0cy1iYXNlJ10gJiYgUGFja2FnZVsnZmFjdHMtYmFzZSddLkZhY3RzLmluY3JlbWVudFNlcnZlckZhY3QoXG4gICAgICBcIm1vbmdvLWxpdmVkYXRhXCIsIFwib2JzZXJ2ZS1kcml2ZXJzLW9wbG9nXCIsIC0xKTtcbiAgfSxcblxuICBfcmVnaXN0ZXJQaGFzZUNoYW5nZTogZnVuY3Rpb24gKHBoYXNlKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIE1ldGVvci5fbm9ZaWVsZHNBbGxvd2VkKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBub3cgPSBuZXcgRGF0ZTtcblxuICAgICAgaWYgKHNlbGYuX3BoYXNlKSB7XG4gICAgICAgIHZhciB0aW1lRGlmZiA9IG5vdyAtIHNlbGYuX3BoYXNlU3RhcnRUaW1lO1xuICAgICAgICBQYWNrYWdlWydmYWN0cy1iYXNlJ10gJiYgUGFja2FnZVsnZmFjdHMtYmFzZSddLkZhY3RzLmluY3JlbWVudFNlcnZlckZhY3QoXG4gICAgICAgICAgXCJtb25nby1saXZlZGF0YVwiLCBcInRpbWUtc3BlbnQtaW4tXCIgKyBzZWxmLl9waGFzZSArIFwiLXBoYXNlXCIsIHRpbWVEaWZmKTtcbiAgICAgIH1cblxuICAgICAgc2VsZi5fcGhhc2UgPSBwaGFzZTtcbiAgICAgIHNlbGYuX3BoYXNlU3RhcnRUaW1lID0gbm93O1xuICAgIH0pO1xuICB9XG59KTtcblxuLy8gRG9lcyBvdXIgb3Bsb2cgdGFpbGluZyBjb2RlIHN1cHBvcnQgdGhpcyBjdXJzb3I/IEZvciBub3csIHdlIGFyZSBiZWluZyB2ZXJ5XG4vLyBjb25zZXJ2YXRpdmUgYW5kIGFsbG93aW5nIG9ubHkgc2ltcGxlIHF1ZXJpZXMgd2l0aCBzaW1wbGUgb3B0aW9ucy5cbi8vIChUaGlzIGlzIGEgXCJzdGF0aWMgbWV0aG9kXCIuKVxuT3Bsb2dPYnNlcnZlRHJpdmVyLmN1cnNvclN1cHBvcnRlZCA9IGZ1bmN0aW9uIChjdXJzb3JEZXNjcmlwdGlvbiwgbWF0Y2hlcikge1xuICAvLyBGaXJzdCwgY2hlY2sgdGhlIG9wdGlvbnMuXG4gIHZhciBvcHRpb25zID0gY3Vyc29yRGVzY3JpcHRpb24ub3B0aW9ucztcblxuICAvLyBEaWQgdGhlIHVzZXIgc2F5IG5vIGV4cGxpY2l0bHk/XG4gIC8vIHVuZGVyc2NvcmVkIHZlcnNpb24gb2YgdGhlIG9wdGlvbiBpcyBDT01QQVQgd2l0aCAxLjJcbiAgaWYgKG9wdGlvbnMuZGlzYWJsZU9wbG9nIHx8IG9wdGlvbnMuX2Rpc2FibGVPcGxvZylcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgLy8gc2tpcCBpcyBub3Qgc3VwcG9ydGVkOiB0byBzdXBwb3J0IGl0IHdlIHdvdWxkIG5lZWQgdG8ga2VlcCB0cmFjayBvZiBhbGxcbiAgLy8gXCJza2lwcGVkXCIgZG9jdW1lbnRzIG9yIGF0IGxlYXN0IHRoZWlyIGlkcy5cbiAgLy8gbGltaXQgdy9vIGEgc29ydCBzcGVjaWZpZXIgaXMgbm90IHN1cHBvcnRlZDogY3VycmVudCBpbXBsZW1lbnRhdGlvbiBuZWVkcyBhXG4gIC8vIGRldGVybWluaXN0aWMgd2F5IHRvIG9yZGVyIGRvY3VtZW50cy5cbiAgaWYgKG9wdGlvbnMuc2tpcCB8fCAob3B0aW9ucy5saW1pdCAmJiAhb3B0aW9ucy5zb3J0KSkgcmV0dXJuIGZhbHNlO1xuXG4gIC8vIElmIGEgZmllbGRzIHByb2plY3Rpb24gb3B0aW9uIGlzIGdpdmVuIGNoZWNrIGlmIGl0IGlzIHN1cHBvcnRlZCBieVxuICAvLyBtaW5pbW9uZ28gKHNvbWUgb3BlcmF0b3JzIGFyZSBub3Qgc3VwcG9ydGVkKS5cbiAgaWYgKG9wdGlvbnMuZmllbGRzKSB7XG4gICAgdHJ5IHtcbiAgICAgIExvY2FsQ29sbGVjdGlvbi5fY2hlY2tTdXBwb3J0ZWRQcm9qZWN0aW9uKG9wdGlvbnMuZmllbGRzKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZiAoZS5uYW1lID09PSBcIk1pbmltb25nb0Vycm9yXCIpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBXZSBkb24ndCBhbGxvdyB0aGUgZm9sbG93aW5nIHNlbGVjdG9yczpcbiAgLy8gICAtICR3aGVyZSAobm90IGNvbmZpZGVudCB0aGF0IHdlIHByb3ZpZGUgdGhlIHNhbWUgSlMgZW52aXJvbm1lbnRcbiAgLy8gICAgICAgICAgICAgYXMgTW9uZ28sIGFuZCBjYW4geWllbGQhKVxuICAvLyAgIC0gJG5lYXIgKGhhcyBcImludGVyZXN0aW5nXCIgcHJvcGVydGllcyBpbiBNb25nb0RCLCBsaWtlIHRoZSBwb3NzaWJpbGl0eVxuICAvLyAgICAgICAgICAgIG9mIHJldHVybmluZyBhbiBJRCBtdWx0aXBsZSB0aW1lcywgdGhvdWdoIGV2ZW4gcG9sbGluZyBtYXliZVxuICAvLyAgICAgICAgICAgIGhhdmUgYSBidWcgdGhlcmUpXG4gIC8vICAgICAgICAgICBYWFg6IG9uY2Ugd2Ugc3VwcG9ydCBpdCwgd2Ugd291bGQgbmVlZCB0byB0aGluayBtb3JlIG9uIGhvdyB3ZVxuICAvLyAgICAgICAgICAgaW5pdGlhbGl6ZSB0aGUgY29tcGFyYXRvcnMgd2hlbiB3ZSBjcmVhdGUgdGhlIGRyaXZlci5cbiAgcmV0dXJuICFtYXRjaGVyLmhhc1doZXJlKCkgJiYgIW1hdGNoZXIuaGFzR2VvUXVlcnkoKTtcbn07XG5cbnZhciBtb2RpZmllckNhbkJlRGlyZWN0bHlBcHBsaWVkID0gZnVuY3Rpb24gKG1vZGlmaWVyKSB7XG4gIHJldHVybiBfLmFsbChtb2RpZmllciwgZnVuY3Rpb24gKGZpZWxkcywgb3BlcmF0aW9uKSB7XG4gICAgcmV0dXJuIF8uYWxsKGZpZWxkcywgZnVuY3Rpb24gKHZhbHVlLCBmaWVsZCkge1xuICAgICAgcmV0dXJuICEvRUpTT05cXCQvLnRlc3QoZmllbGQpO1xuICAgIH0pO1xuICB9KTtcbn07XG5cbk1vbmdvSW50ZXJuYWxzLk9wbG9nT2JzZXJ2ZURyaXZlciA9IE9wbG9nT2JzZXJ2ZURyaXZlcjtcbiIsIi8vIHNpbmdsZXRvblxuZXhwb3J0IGNvbnN0IExvY2FsQ29sbGVjdGlvbkRyaXZlciA9IG5ldyAoY2xhc3MgTG9jYWxDb2xsZWN0aW9uRHJpdmVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5ub0Nvbm5Db2xsZWN0aW9ucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIH1cblxuICBvcGVuKG5hbWUsIGNvbm4pIHtcbiAgICBpZiAoISBuYW1lKSB7XG4gICAgICByZXR1cm4gbmV3IExvY2FsQ29sbGVjdGlvbjtcbiAgICB9XG5cbiAgICBpZiAoISBjb25uKSB7XG4gICAgICByZXR1cm4gZW5zdXJlQ29sbGVjdGlvbihuYW1lLCB0aGlzLm5vQ29ubkNvbGxlY3Rpb25zKTtcbiAgICB9XG5cbiAgICBpZiAoISBjb25uLl9tb25nb19saXZlZGF0YV9jb2xsZWN0aW9ucykge1xuICAgICAgY29ubi5fbW9uZ29fbGl2ZWRhdGFfY29sbGVjdGlvbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIH1cblxuICAgIC8vIFhYWCBpcyB0aGVyZSBhIHdheSB0byBrZWVwIHRyYWNrIG9mIGEgY29ubmVjdGlvbidzIGNvbGxlY3Rpb25zIHdpdGhvdXRcbiAgICAvLyBkYW5nbGluZyBpdCBvZmYgdGhlIGNvbm5lY3Rpb24gb2JqZWN0P1xuICAgIHJldHVybiBlbnN1cmVDb2xsZWN0aW9uKG5hbWUsIGNvbm4uX21vbmdvX2xpdmVkYXRhX2NvbGxlY3Rpb25zKTtcbiAgfVxufSk7XG5cbmZ1bmN0aW9uIGVuc3VyZUNvbGxlY3Rpb24obmFtZSwgY29sbGVjdGlvbnMpIHtcbiAgcmV0dXJuIChuYW1lIGluIGNvbGxlY3Rpb25zKVxuICAgID8gY29sbGVjdGlvbnNbbmFtZV1cbiAgICA6IGNvbGxlY3Rpb25zW25hbWVdID0gbmV3IExvY2FsQ29sbGVjdGlvbihuYW1lKTtcbn1cbiIsIk1vbmdvSW50ZXJuYWxzLlJlbW90ZUNvbGxlY3Rpb25Ecml2ZXIgPSBmdW5jdGlvbiAoXG4gIG1vbmdvX3VybCwgb3B0aW9ucykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHNlbGYubW9uZ28gPSBuZXcgTW9uZ29Db25uZWN0aW9uKG1vbmdvX3VybCwgb3B0aW9ucyk7XG59O1xuXG5fLmV4dGVuZChNb25nb0ludGVybmFscy5SZW1vdGVDb2xsZWN0aW9uRHJpdmVyLnByb3RvdHlwZSwge1xuICBvcGVuOiBmdW5jdGlvbiAobmFtZSkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgcmV0ID0ge307XG4gICAgXy5lYWNoKFxuICAgICAgWydmaW5kJywgJ2ZpbmRPbmUnLCAnaW5zZXJ0JywgJ3VwZGF0ZScsICd1cHNlcnQnLFxuICAgICAgICdyZW1vdmUnLCAnX2Vuc3VyZUluZGV4JywgJ19kcm9wSW5kZXgnLCAnX2NyZWF0ZUNhcHBlZENvbGxlY3Rpb24nLFxuICAgICAgICdkcm9wQ29sbGVjdGlvbicsICdyYXdDb2xsZWN0aW9uJ10sXG4gICAgICBmdW5jdGlvbiAobSkge1xuICAgICAgICByZXRbbV0gPSBfLmJpbmQoc2VsZi5tb25nb1ttXSwgc2VsZi5tb25nbywgbmFtZSk7XG4gICAgICB9KTtcbiAgICByZXR1cm4gcmV0O1xuICB9XG59KTtcblxuXG4vLyBDcmVhdGUgdGhlIHNpbmdsZXRvbiBSZW1vdGVDb2xsZWN0aW9uRHJpdmVyIG9ubHkgb24gZGVtYW5kLCBzbyB3ZVxuLy8gb25seSByZXF1aXJlIE1vbmdvIGNvbmZpZ3VyYXRpb24gaWYgaXQncyBhY3R1YWxseSB1c2VkIChlZywgbm90IGlmXG4vLyB5b3UncmUgb25seSB0cnlpbmcgdG8gcmVjZWl2ZSBkYXRhIGZyb20gYSByZW1vdGUgRERQIHNlcnZlci4pXG5Nb25nb0ludGVybmFscy5kZWZhdWx0UmVtb3RlQ29sbGVjdGlvbkRyaXZlciA9IF8ub25jZShmdW5jdGlvbiAoKSB7XG4gIHZhciBjb25uZWN0aW9uT3B0aW9ucyA9IHt9O1xuXG4gIHZhciBtb25nb1VybCA9IHByb2Nlc3MuZW52Lk1PTkdPX1VSTDtcblxuICBpZiAocHJvY2Vzcy5lbnYuTU9OR09fT1BMT0dfVVJMKSB7XG4gICAgY29ubmVjdGlvbk9wdGlvbnMub3Bsb2dVcmwgPSBwcm9jZXNzLmVudi5NT05HT19PUExPR19VUkw7XG4gIH1cblxuICBpZiAoISBtb25nb1VybClcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJNT05HT19VUkwgbXVzdCBiZSBzZXQgaW4gZW52aXJvbm1lbnRcIik7XG5cbiAgcmV0dXJuIG5ldyBNb25nb0ludGVybmFscy5SZW1vdGVDb2xsZWN0aW9uRHJpdmVyKG1vbmdvVXJsLCBjb25uZWN0aW9uT3B0aW9ucyk7XG59KTtcbiIsIi8vIG9wdGlvbnMuY29ubmVjdGlvbiwgaWYgZ2l2ZW4sIGlzIGEgTGl2ZWRhdGFDbGllbnQgb3IgTGl2ZWRhdGFTZXJ2ZXJcbi8vIFhYWCBwcmVzZW50bHkgdGhlcmUgaXMgbm8gd2F5IHRvIGRlc3Ryb3kvY2xlYW4gdXAgYSBDb2xsZWN0aW9uXG5cbi8qKlxuICogQHN1bW1hcnkgTmFtZXNwYWNlIGZvciBNb25nb0RCLXJlbGF0ZWQgaXRlbXNcbiAqIEBuYW1lc3BhY2VcbiAqL1xuTW9uZ28gPSB7fTtcblxuLyoqXG4gKiBAc3VtbWFyeSBDb25zdHJ1Y3RvciBmb3IgYSBDb2xsZWN0aW9uXG4gKiBAbG9jdXMgQW55d2hlcmVcbiAqIEBpbnN0YW5jZW5hbWUgY29sbGVjdGlvblxuICogQGNsYXNzXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBUaGUgbmFtZSBvZiB0aGUgY29sbGVjdGlvbi4gIElmIG51bGwsIGNyZWF0ZXMgYW4gdW5tYW5hZ2VkICh1bnN5bmNocm9uaXplZCkgbG9jYWwgY29sbGVjdGlvbi5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc11cbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zLmNvbm5lY3Rpb24gVGhlIHNlcnZlciBjb25uZWN0aW9uIHRoYXQgd2lsbCBtYW5hZ2UgdGhpcyBjb2xsZWN0aW9uLiBVc2VzIHRoZSBkZWZhdWx0IGNvbm5lY3Rpb24gaWYgbm90IHNwZWNpZmllZC4gIFBhc3MgdGhlIHJldHVybiB2YWx1ZSBvZiBjYWxsaW5nIFtgRERQLmNvbm5lY3RgXSgjZGRwX2Nvbm5lY3QpIHRvIHNwZWNpZnkgYSBkaWZmZXJlbnQgc2VydmVyLiBQYXNzIGBudWxsYCB0byBzcGVjaWZ5IG5vIGNvbm5lY3Rpb24uIFVubWFuYWdlZCAoYG5hbWVgIGlzIG51bGwpIGNvbGxlY3Rpb25zIGNhbm5vdCBzcGVjaWZ5IGEgY29ubmVjdGlvbi5cbiAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLmlkR2VuZXJhdGlvbiBUaGUgbWV0aG9kIG9mIGdlbmVyYXRpbmcgdGhlIGBfaWRgIGZpZWxkcyBvZiBuZXcgZG9jdW1lbnRzIGluIHRoaXMgY29sbGVjdGlvbi4gIFBvc3NpYmxlIHZhbHVlczpcblxuIC0gKipgJ1NUUklORydgKio6IHJhbmRvbSBzdHJpbmdzXG4gLSAqKmAnTU9OR08nYCoqOiAgcmFuZG9tIFtgTW9uZ28uT2JqZWN0SURgXSgjbW9uZ29fb2JqZWN0X2lkKSB2YWx1ZXNcblxuVGhlIGRlZmF1bHQgaWQgZ2VuZXJhdGlvbiB0ZWNobmlxdWUgaXMgYCdTVFJJTkcnYC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IG9wdGlvbnMudHJhbnNmb3JtIEFuIG9wdGlvbmFsIHRyYW5zZm9ybWF0aW9uIGZ1bmN0aW9uLiBEb2N1bWVudHMgd2lsbCBiZSBwYXNzZWQgdGhyb3VnaCB0aGlzIGZ1bmN0aW9uIGJlZm9yZSBiZWluZyByZXR1cm5lZCBmcm9tIGBmZXRjaGAgb3IgYGZpbmRPbmVgLCBhbmQgYmVmb3JlIGJlaW5nIHBhc3NlZCB0byBjYWxsYmFja3Mgb2YgYG9ic2VydmVgLCBgbWFwYCwgYGZvckVhY2hgLCBgYWxsb3dgLCBhbmQgYGRlbnlgLiBUcmFuc2Zvcm1zIGFyZSAqbm90KiBhcHBsaWVkIGZvciB0aGUgY2FsbGJhY2tzIG9mIGBvYnNlcnZlQ2hhbmdlc2Agb3IgdG8gY3Vyc29ycyByZXR1cm5lZCBmcm9tIHB1Ymxpc2ggZnVuY3Rpb25zLlxuICogQHBhcmFtIHtCb29sZWFufSBvcHRpb25zLmRlZmluZU11dGF0aW9uTWV0aG9kcyBTZXQgdG8gYGZhbHNlYCB0byBza2lwIHNldHRpbmcgdXAgdGhlIG11dGF0aW9uIG1ldGhvZHMgdGhhdCBlbmFibGUgaW5zZXJ0L3VwZGF0ZS9yZW1vdmUgZnJvbSBjbGllbnQgY29kZS4gRGVmYXVsdCBgdHJ1ZWAuXG4gKi9cbk1vbmdvLkNvbGxlY3Rpb24gPSBmdW5jdGlvbiBDb2xsZWN0aW9uKG5hbWUsIG9wdGlvbnMpIHtcbiAgaWYgKCFuYW1lICYmIChuYW1lICE9PSBudWxsKSkge1xuICAgIE1ldGVvci5fZGVidWcoXCJXYXJuaW5nOiBjcmVhdGluZyBhbm9ueW1vdXMgY29sbGVjdGlvbi4gSXQgd2lsbCBub3QgYmUgXCIgK1xuICAgICAgICAgICAgICAgICAgXCJzYXZlZCBvciBzeW5jaHJvbml6ZWQgb3ZlciB0aGUgbmV0d29yay4gKFBhc3MgbnVsbCBmb3IgXCIgK1xuICAgICAgICAgICAgICAgICAgXCJ0aGUgY29sbGVjdGlvbiBuYW1lIHRvIHR1cm4gb2ZmIHRoaXMgd2FybmluZy4pXCIpO1xuICAgIG5hbWUgPSBudWxsO1xuICB9XG5cbiAgaWYgKG5hbWUgIT09IG51bGwgJiYgdHlwZW9mIG5hbWUgIT09IFwic3RyaW5nXCIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBcIkZpcnN0IGFyZ3VtZW50IHRvIG5ldyBNb25nby5Db2xsZWN0aW9uIG11c3QgYmUgYSBzdHJpbmcgb3IgbnVsbFwiKTtcbiAgfVxuXG4gIGlmIChvcHRpb25zICYmIG9wdGlvbnMubWV0aG9kcykge1xuICAgIC8vIEJhY2t3YXJkcyBjb21wYXRpYmlsaXR5IGhhY2sgd2l0aCBvcmlnaW5hbCBzaWduYXR1cmUgKHdoaWNoIHBhc3NlZFxuICAgIC8vIFwiY29ubmVjdGlvblwiIGRpcmVjdGx5IGluc3RlYWQgb2YgaW4gb3B0aW9ucy4gKENvbm5lY3Rpb25zIG11c3QgaGF2ZSBhIFwibWV0aG9kc1wiXG4gICAgLy8gbWV0aG9kLilcbiAgICAvLyBYWFggcmVtb3ZlIGJlZm9yZSAxLjBcbiAgICBvcHRpb25zID0ge2Nvbm5lY3Rpb246IG9wdGlvbnN9O1xuICB9XG4gIC8vIEJhY2t3YXJkcyBjb21wYXRpYmlsaXR5OiBcImNvbm5lY3Rpb25cIiB1c2VkIHRvIGJlIGNhbGxlZCBcIm1hbmFnZXJcIi5cbiAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5tYW5hZ2VyICYmICFvcHRpb25zLmNvbm5lY3Rpb24pIHtcbiAgICBvcHRpb25zLmNvbm5lY3Rpb24gPSBvcHRpb25zLm1hbmFnZXI7XG4gIH1cblxuICBvcHRpb25zID0ge1xuICAgIGNvbm5lY3Rpb246IHVuZGVmaW5lZCxcbiAgICBpZEdlbmVyYXRpb246ICdTVFJJTkcnLFxuICAgIHRyYW5zZm9ybTogbnVsbCxcbiAgICBfZHJpdmVyOiB1bmRlZmluZWQsXG4gICAgX3ByZXZlbnRBdXRvcHVibGlzaDogZmFsc2UsXG4gICAgICAuLi5vcHRpb25zLFxuICB9O1xuXG4gIHN3aXRjaCAob3B0aW9ucy5pZEdlbmVyYXRpb24pIHtcbiAgY2FzZSAnTU9OR08nOlxuICAgIHRoaXMuX21ha2VOZXdJRCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBzcmMgPSBuYW1lID8gRERQLnJhbmRvbVN0cmVhbSgnL2NvbGxlY3Rpb24vJyArIG5hbWUpIDogUmFuZG9tLmluc2VjdXJlO1xuICAgICAgcmV0dXJuIG5ldyBNb25nby5PYmplY3RJRChzcmMuaGV4U3RyaW5nKDI0KSk7XG4gICAgfTtcbiAgICBicmVhaztcbiAgY2FzZSAnU1RSSU5HJzpcbiAgZGVmYXVsdDpcbiAgICB0aGlzLl9tYWtlTmV3SUQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgc3JjID0gbmFtZSA/IEREUC5yYW5kb21TdHJlYW0oJy9jb2xsZWN0aW9uLycgKyBuYW1lKSA6IFJhbmRvbS5pbnNlY3VyZTtcbiAgICAgIHJldHVybiBzcmMuaWQoKTtcbiAgICB9O1xuICAgIGJyZWFrO1xuICB9XG5cbiAgdGhpcy5fdHJhbnNmb3JtID0gTG9jYWxDb2xsZWN0aW9uLndyYXBUcmFuc2Zvcm0ob3B0aW9ucy50cmFuc2Zvcm0pO1xuXG4gIGlmICghIG5hbWUgfHwgb3B0aW9ucy5jb25uZWN0aW9uID09PSBudWxsKVxuICAgIC8vIG5vdGU6IG5hbWVsZXNzIGNvbGxlY3Rpb25zIG5ldmVyIGhhdmUgYSBjb25uZWN0aW9uXG4gICAgdGhpcy5fY29ubmVjdGlvbiA9IG51bGw7XG4gIGVsc2UgaWYgKG9wdGlvbnMuY29ubmVjdGlvbilcbiAgICB0aGlzLl9jb25uZWN0aW9uID0gb3B0aW9ucy5jb25uZWN0aW9uO1xuICBlbHNlIGlmIChNZXRlb3IuaXNDbGllbnQpXG4gICAgdGhpcy5fY29ubmVjdGlvbiA9IE1ldGVvci5jb25uZWN0aW9uO1xuICBlbHNlXG4gICAgdGhpcy5fY29ubmVjdGlvbiA9IE1ldGVvci5zZXJ2ZXI7XG5cbiAgaWYgKCFvcHRpb25zLl9kcml2ZXIpIHtcbiAgICAvLyBYWFggVGhpcyBjaGVjayBhc3N1bWVzIHRoYXQgd2ViYXBwIGlzIGxvYWRlZCBzbyB0aGF0IE1ldGVvci5zZXJ2ZXIgIT09XG4gICAgLy8gbnVsbC4gV2Ugc2hvdWxkIGZ1bGx5IHN1cHBvcnQgdGhlIGNhc2Ugb2YgXCJ3YW50IHRvIHVzZSBhIE1vbmdvLWJhY2tlZFxuICAgIC8vIGNvbGxlY3Rpb24gZnJvbSBOb2RlIGNvZGUgd2l0aG91dCB3ZWJhcHBcIiwgYnV0IHdlIGRvbid0IHlldC5cbiAgICAvLyAjTWV0ZW9yU2VydmVyTnVsbFxuICAgIGlmIChuYW1lICYmIHRoaXMuX2Nvbm5lY3Rpb24gPT09IE1ldGVvci5zZXJ2ZXIgJiZcbiAgICAgICAgdHlwZW9mIE1vbmdvSW50ZXJuYWxzICE9PSBcInVuZGVmaW5lZFwiICYmXG4gICAgICAgIE1vbmdvSW50ZXJuYWxzLmRlZmF1bHRSZW1vdGVDb2xsZWN0aW9uRHJpdmVyKSB7XG4gICAgICBvcHRpb25zLl9kcml2ZXIgPSBNb25nb0ludGVybmFscy5kZWZhdWx0UmVtb3RlQ29sbGVjdGlvbkRyaXZlcigpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCB7IExvY2FsQ29sbGVjdGlvbkRyaXZlciB9ID1cbiAgICAgICAgcmVxdWlyZShcIi4vbG9jYWxfY29sbGVjdGlvbl9kcml2ZXIuanNcIik7XG4gICAgICBvcHRpb25zLl9kcml2ZXIgPSBMb2NhbENvbGxlY3Rpb25Ecml2ZXI7XG4gICAgfVxuICB9XG5cbiAgdGhpcy5fY29sbGVjdGlvbiA9IG9wdGlvbnMuX2RyaXZlci5vcGVuKG5hbWUsIHRoaXMuX2Nvbm5lY3Rpb24pO1xuICB0aGlzLl9uYW1lID0gbmFtZTtcbiAgdGhpcy5fZHJpdmVyID0gb3B0aW9ucy5fZHJpdmVyO1xuXG4gIHRoaXMuX21heWJlU2V0VXBSZXBsaWNhdGlvbihuYW1lLCBvcHRpb25zKTtcblxuICAvLyBYWFggZG9uJ3QgZGVmaW5lIHRoZXNlIHVudGlsIGFsbG93IG9yIGRlbnkgaXMgYWN0dWFsbHkgdXNlZCBmb3IgdGhpc1xuICAvLyBjb2xsZWN0aW9uLiBDb3VsZCBiZSBoYXJkIGlmIHRoZSBzZWN1cml0eSBydWxlcyBhcmUgb25seSBkZWZpbmVkIG9uIHRoZVxuICAvLyBzZXJ2ZXIuXG4gIGlmIChvcHRpb25zLmRlZmluZU11dGF0aW9uTWV0aG9kcyAhPT0gZmFsc2UpIHtcbiAgICB0cnkge1xuICAgICAgdGhpcy5fZGVmaW5lTXV0YXRpb25NZXRob2RzKHtcbiAgICAgICAgdXNlRXhpc3Rpbmc6IG9wdGlvbnMuX3N1cHByZXNzU2FtZU5hbWVFcnJvciA9PT0gdHJ1ZVxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIC8vIFRocm93IGEgbW9yZSB1bmRlcnN0YW5kYWJsZSBlcnJvciBvbiB0aGUgc2VydmVyIGZvciBzYW1lIGNvbGxlY3Rpb24gbmFtZVxuICAgICAgaWYgKGVycm9yLm1lc3NhZ2UgPT09IGBBIG1ldGhvZCBuYW1lZCAnLyR7bmFtZX0vaW5zZXJ0JyBpcyBhbHJlYWR5IGRlZmluZWRgKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFRoZXJlIGlzIGFscmVhZHkgYSBjb2xsZWN0aW9uIG5hbWVkIFwiJHtuYW1lfVwiYCk7XG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9XG4gIH1cblxuICAvLyBhdXRvcHVibGlzaFxuICBpZiAoUGFja2FnZS5hdXRvcHVibGlzaCAmJlxuICAgICAgISBvcHRpb25zLl9wcmV2ZW50QXV0b3B1Ymxpc2ggJiZcbiAgICAgIHRoaXMuX2Nvbm5lY3Rpb24gJiZcbiAgICAgIHRoaXMuX2Nvbm5lY3Rpb24ucHVibGlzaCkge1xuICAgIHRoaXMuX2Nvbm5lY3Rpb24ucHVibGlzaChudWxsLCAoKSA9PiB0aGlzLmZpbmQoKSwge1xuICAgICAgaXNfYXV0bzogdHJ1ZSxcbiAgICB9KTtcbiAgfVxufTtcblxuT2JqZWN0LmFzc2lnbihNb25nby5Db2xsZWN0aW9uLnByb3RvdHlwZSwge1xuICBfbWF5YmVTZXRVcFJlcGxpY2F0aW9uKG5hbWUsIHtcbiAgICBfc3VwcHJlc3NTYW1lTmFtZUVycm9yID0gZmFsc2VcbiAgfSkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGlmICghIChzZWxmLl9jb25uZWN0aW9uICYmXG4gICAgICAgICAgIHNlbGYuX2Nvbm5lY3Rpb24ucmVnaXN0ZXJTdG9yZSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBPSywgd2UncmUgZ29pbmcgdG8gYmUgYSBzbGF2ZSwgcmVwbGljYXRpbmcgc29tZSByZW1vdGVcbiAgICAvLyBkYXRhYmFzZSwgZXhjZXB0IHBvc3NpYmx5IHdpdGggc29tZSB0ZW1wb3JhcnkgZGl2ZXJnZW5jZSB3aGlsZVxuICAgIC8vIHdlIGhhdmUgdW5hY2tub3dsZWRnZWQgUlBDJ3MuXG4gICAgY29uc3Qgb2sgPSBzZWxmLl9jb25uZWN0aW9uLnJlZ2lzdGVyU3RvcmUobmFtZSwge1xuICAgICAgLy8gQ2FsbGVkIGF0IHRoZSBiZWdpbm5pbmcgb2YgYSBiYXRjaCBvZiB1cGRhdGVzLiBiYXRjaFNpemUgaXMgdGhlIG51bWJlclxuICAgICAgLy8gb2YgdXBkYXRlIGNhbGxzIHRvIGV4cGVjdC5cbiAgICAgIC8vXG4gICAgICAvLyBYWFggVGhpcyBpbnRlcmZhY2UgaXMgcHJldHR5IGphbmt5LiByZXNldCBwcm9iYWJseSBvdWdodCB0byBnbyBiYWNrIHRvXG4gICAgICAvLyBiZWluZyBpdHMgb3duIGZ1bmN0aW9uLCBhbmQgY2FsbGVycyBzaG91bGRuJ3QgaGF2ZSB0byBjYWxjdWxhdGVcbiAgICAgIC8vIGJhdGNoU2l6ZS4gVGhlIG9wdGltaXphdGlvbiBvZiBub3QgY2FsbGluZyBwYXVzZS9yZW1vdmUgc2hvdWxkIGJlXG4gICAgICAvLyBkZWxheWVkIHVudGlsIGxhdGVyOiB0aGUgZmlyc3QgY2FsbCB0byB1cGRhdGUoKSBzaG91bGQgYnVmZmVyIGl0c1xuICAgICAgLy8gbWVzc2FnZSwgYW5kIHRoZW4gd2UgY2FuIGVpdGhlciBkaXJlY3RseSBhcHBseSBpdCBhdCBlbmRVcGRhdGUgdGltZSBpZlxuICAgICAgLy8gaXQgd2FzIHRoZSBvbmx5IHVwZGF0ZSwgb3IgZG8gcGF1c2VPYnNlcnZlcnMvYXBwbHkvYXBwbHkgYXQgdGhlIG5leHRcbiAgICAgIC8vIHVwZGF0ZSgpIGlmIHRoZXJlJ3MgYW5vdGhlciBvbmUuXG4gICAgICBiZWdpblVwZGF0ZShiYXRjaFNpemUsIHJlc2V0KSB7XG4gICAgICAgIC8vIHBhdXNlIG9ic2VydmVycyBzbyB1c2VycyBkb24ndCBzZWUgZmxpY2tlciB3aGVuIHVwZGF0aW5nIHNldmVyYWxcbiAgICAgICAgLy8gb2JqZWN0cyBhdCBvbmNlIChpbmNsdWRpbmcgdGhlIHBvc3QtcmVjb25uZWN0IHJlc2V0LWFuZC1yZWFwcGx5XG4gICAgICAgIC8vIHN0YWdlKSwgYW5kIHNvIHRoYXQgYSByZS1zb3J0aW5nIG9mIGEgcXVlcnkgY2FuIHRha2UgYWR2YW50YWdlIG9mIHRoZVxuICAgICAgICAvLyBmdWxsIF9kaWZmUXVlcnkgbW92ZWQgY2FsY3VsYXRpb24gaW5zdGVhZCBvZiBhcHBseWluZyBjaGFuZ2Ugb25lIGF0IGFcbiAgICAgICAgLy8gdGltZS5cbiAgICAgICAgaWYgKGJhdGNoU2l6ZSA+IDEgfHwgcmVzZXQpXG4gICAgICAgICAgc2VsZi5fY29sbGVjdGlvbi5wYXVzZU9ic2VydmVycygpO1xuXG4gICAgICAgIGlmIChyZXNldClcbiAgICAgICAgICBzZWxmLl9jb2xsZWN0aW9uLnJlbW92ZSh7fSk7XG4gICAgICB9LFxuXG4gICAgICAvLyBBcHBseSBhbiB1cGRhdGUuXG4gICAgICAvLyBYWFggYmV0dGVyIHNwZWNpZnkgdGhpcyBpbnRlcmZhY2UgKG5vdCBpbiB0ZXJtcyBvZiBhIHdpcmUgbWVzc2FnZSk/XG4gICAgICB1cGRhdGUobXNnKSB7XG4gICAgICAgIHZhciBtb25nb0lkID0gTW9uZ29JRC5pZFBhcnNlKG1zZy5pZCk7XG4gICAgICAgIHZhciBkb2MgPSBzZWxmLl9jb2xsZWN0aW9uLmZpbmRPbmUobW9uZ29JZCk7XG5cbiAgICAgICAgLy8gSXMgdGhpcyBhIFwicmVwbGFjZSB0aGUgd2hvbGUgZG9jXCIgbWVzc2FnZSBjb21pbmcgZnJvbSB0aGUgcXVpZXNjZW5jZVxuICAgICAgICAvLyBvZiBtZXRob2Qgd3JpdGVzIHRvIGFuIG9iamVjdD8gKE5vdGUgdGhhdCAndW5kZWZpbmVkJyBpcyBhIHZhbGlkXG4gICAgICAgIC8vIHZhbHVlIG1lYW5pbmcgXCJyZW1vdmUgaXRcIi4pXG4gICAgICAgIGlmIChtc2cubXNnID09PSAncmVwbGFjZScpIHtcbiAgICAgICAgICB2YXIgcmVwbGFjZSA9IG1zZy5yZXBsYWNlO1xuICAgICAgICAgIGlmICghcmVwbGFjZSkge1xuICAgICAgICAgICAgaWYgKGRvYylcbiAgICAgICAgICAgICAgc2VsZi5fY29sbGVjdGlvbi5yZW1vdmUobW9uZ29JZCk7XG4gICAgICAgICAgfSBlbHNlIGlmICghZG9jKSB7XG4gICAgICAgICAgICBzZWxmLl9jb2xsZWN0aW9uLmluc2VydChyZXBsYWNlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gWFhYIGNoZWNrIHRoYXQgcmVwbGFjZSBoYXMgbm8gJCBvcHNcbiAgICAgICAgICAgIHNlbGYuX2NvbGxlY3Rpb24udXBkYXRlKG1vbmdvSWQsIHJlcGxhY2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gZWxzZSBpZiAobXNnLm1zZyA9PT0gJ2FkZGVkJykge1xuICAgICAgICAgIGlmIChkb2MpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkV4cGVjdGVkIG5vdCB0byBmaW5kIGEgZG9jdW1lbnQgYWxyZWFkeSBwcmVzZW50IGZvciBhbiBhZGRcIik7XG4gICAgICAgICAgfVxuICAgICAgICAgIHNlbGYuX2NvbGxlY3Rpb24uaW5zZXJ0KHsgX2lkOiBtb25nb0lkLCAuLi5tc2cuZmllbGRzIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKG1zZy5tc2cgPT09ICdyZW1vdmVkJykge1xuICAgICAgICAgIGlmICghZG9jKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRXhwZWN0ZWQgdG8gZmluZCBhIGRvY3VtZW50IGFscmVhZHkgcHJlc2VudCBmb3IgcmVtb3ZlZFwiKTtcbiAgICAgICAgICBzZWxmLl9jb2xsZWN0aW9uLnJlbW92ZShtb25nb0lkKTtcbiAgICAgICAgfSBlbHNlIGlmIChtc2cubXNnID09PSAnY2hhbmdlZCcpIHtcbiAgICAgICAgICBpZiAoIWRvYylcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkV4cGVjdGVkIHRvIGZpbmQgYSBkb2N1bWVudCB0byBjaGFuZ2VcIik7XG4gICAgICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKG1zZy5maWVsZHMpO1xuICAgICAgICAgIGlmIChrZXlzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHZhciBtb2RpZmllciA9IHt9O1xuICAgICAgICAgICAga2V5cy5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gbXNnLmZpZWxkc1trZXldO1xuICAgICAgICAgICAgICBpZiAoRUpTT04uZXF1YWxzKGRvY1trZXldLCB2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgIGlmICghbW9kaWZpZXIuJHVuc2V0KSB7XG4gICAgICAgICAgICAgICAgICBtb2RpZmllci4kdW5zZXQgPSB7fTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbW9kaWZpZXIuJHVuc2V0W2tleV0gPSAxO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICghbW9kaWZpZXIuJHNldCkge1xuICAgICAgICAgICAgICAgICAgbW9kaWZpZXIuJHNldCA9IHt9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBtb2RpZmllci4kc2V0W2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoT2JqZWN0LmtleXMobW9kaWZpZXIpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgc2VsZi5fY29sbGVjdGlvbi51cGRhdGUobW9uZ29JZCwgbW9kaWZpZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJIGRvbid0IGtub3cgaG93IHRvIGRlYWwgd2l0aCB0aGlzIG1lc3NhZ2VcIik7XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIC8vIENhbGxlZCBhdCB0aGUgZW5kIG9mIGEgYmF0Y2ggb2YgdXBkYXRlcy5cbiAgICAgIGVuZFVwZGF0ZSgpIHtcbiAgICAgICAgc2VsZi5fY29sbGVjdGlvbi5yZXN1bWVPYnNlcnZlcnMoKTtcbiAgICAgIH0sXG5cbiAgICAgIC8vIENhbGxlZCBhcm91bmQgbWV0aG9kIHN0dWIgaW52b2NhdGlvbnMgdG8gY2FwdHVyZSB0aGUgb3JpZ2luYWwgdmVyc2lvbnNcbiAgICAgIC8vIG9mIG1vZGlmaWVkIGRvY3VtZW50cy5cbiAgICAgIHNhdmVPcmlnaW5hbHMoKSB7XG4gICAgICAgIHNlbGYuX2NvbGxlY3Rpb24uc2F2ZU9yaWdpbmFscygpO1xuICAgICAgfSxcbiAgICAgIHJldHJpZXZlT3JpZ2luYWxzKCkge1xuICAgICAgICByZXR1cm4gc2VsZi5fY29sbGVjdGlvbi5yZXRyaWV2ZU9yaWdpbmFscygpO1xuICAgICAgfSxcblxuICAgICAgLy8gVXNlZCB0byBwcmVzZXJ2ZSBjdXJyZW50IHZlcnNpb25zIG9mIGRvY3VtZW50cyBhY3Jvc3MgYSBzdG9yZSByZXNldC5cbiAgICAgIGdldERvYyhpZCkge1xuICAgICAgICByZXR1cm4gc2VsZi5maW5kT25lKGlkKTtcbiAgICAgIH0sXG5cbiAgICAgIC8vIFRvIGJlIGFibGUgdG8gZ2V0IGJhY2sgdG8gdGhlIGNvbGxlY3Rpb24gZnJvbSB0aGUgc3RvcmUuXG4gICAgICBfZ2V0Q29sbGVjdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHNlbGY7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAoISBvaykge1xuICAgICAgY29uc3QgbWVzc2FnZSA9IGBUaGVyZSBpcyBhbHJlYWR5IGEgY29sbGVjdGlvbiBuYW1lZCBcIiR7bmFtZX1cImA7XG4gICAgICBpZiAoX3N1cHByZXNzU2FtZU5hbWVFcnJvciA9PT0gdHJ1ZSkge1xuICAgICAgICAvLyBYWFggSW4gdGhlb3J5IHdlIGRvIG5vdCBoYXZlIHRvIHRocm93IHdoZW4gYG9rYCBpcyBmYWxzeS4gVGhlXG4gICAgICAgIC8vIHN0b3JlIGlzIGFscmVhZHkgZGVmaW5lZCBmb3IgdGhpcyBjb2xsZWN0aW9uIG5hbWUsIGJ1dCB0aGlzXG4gICAgICAgIC8vIHdpbGwgc2ltcGx5IGJlIGFub3RoZXIgcmVmZXJlbmNlIHRvIGl0IGFuZCBldmVyeXRoaW5nIHNob3VsZFxuICAgICAgICAvLyB3b3JrLiBIb3dldmVyLCB3ZSBoYXZlIGhpc3RvcmljYWxseSB0aHJvd24gYW4gZXJyb3IgaGVyZSwgc29cbiAgICAgICAgLy8gZm9yIG5vdyB3ZSB3aWxsIHNraXAgdGhlIGVycm9yIG9ubHkgd2hlbiBfc3VwcHJlc3NTYW1lTmFtZUVycm9yXG4gICAgICAgIC8vIGlzIGB0cnVlYCwgYWxsb3dpbmcgcGVvcGxlIHRvIG9wdCBpbiBhbmQgZ2l2ZSB0aGlzIHNvbWUgcmVhbFxuICAgICAgICAvLyB3b3JsZCB0ZXN0aW5nLlxuICAgICAgICBjb25zb2xlLndhcm4gPyBjb25zb2xlLndhcm4obWVzc2FnZSkgOiBjb25zb2xlLmxvZyhtZXNzYWdlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgLy8vXG4gIC8vLyBNYWluIGNvbGxlY3Rpb24gQVBJXG4gIC8vL1xuXG4gIF9nZXRGaW5kU2VsZWN0b3IoYXJncykge1xuICAgIGlmIChhcmdzLmxlbmd0aCA9PSAwKVxuICAgICAgcmV0dXJuIHt9O1xuICAgIGVsc2VcbiAgICAgIHJldHVybiBhcmdzWzBdO1xuICB9LFxuXG4gIF9nZXRGaW5kT3B0aW9ucyhhcmdzKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIGlmIChhcmdzLmxlbmd0aCA8IDIpIHtcbiAgICAgIHJldHVybiB7IHRyYW5zZm9ybTogc2VsZi5fdHJhbnNmb3JtIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIGNoZWNrKGFyZ3NbMV0sIE1hdGNoLk9wdGlvbmFsKE1hdGNoLk9iamVjdEluY2x1ZGluZyh7XG4gICAgICAgIGZpZWxkczogTWF0Y2guT3B0aW9uYWwoTWF0Y2guT25lT2YoT2JqZWN0LCB1bmRlZmluZWQpKSxcbiAgICAgICAgc29ydDogTWF0Y2guT3B0aW9uYWwoTWF0Y2guT25lT2YoT2JqZWN0LCBBcnJheSwgRnVuY3Rpb24sIHVuZGVmaW5lZCkpLFxuICAgICAgICBsaW1pdDogTWF0Y2guT3B0aW9uYWwoTWF0Y2guT25lT2YoTnVtYmVyLCB1bmRlZmluZWQpKSxcbiAgICAgICAgc2tpcDogTWF0Y2guT3B0aW9uYWwoTWF0Y2guT25lT2YoTnVtYmVyLCB1bmRlZmluZWQpKVxuICAgICAgfSkpKTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdHJhbnNmb3JtOiBzZWxmLl90cmFuc2Zvcm0sXG4gICAgICAgIC4uLmFyZ3NbMV0sXG4gICAgICB9O1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogQHN1bW1hcnkgRmluZCB0aGUgZG9jdW1lbnRzIGluIGEgY29sbGVjdGlvbiB0aGF0IG1hdGNoIHRoZSBzZWxlY3Rvci5cbiAgICogQGxvY3VzIEFueXdoZXJlXG4gICAqIEBtZXRob2QgZmluZFxuICAgKiBAbWVtYmVyb2YgTW9uZ28uQ29sbGVjdGlvblxuICAgKiBAaW5zdGFuY2VcbiAgICogQHBhcmFtIHtNb25nb1NlbGVjdG9yfSBbc2VsZWN0b3JdIEEgcXVlcnkgZGVzY3JpYmluZyB0aGUgZG9jdW1lbnRzIHRvIGZpbmRcbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXVxuICAgKiBAcGFyYW0ge01vbmdvU29ydFNwZWNpZmllcn0gb3B0aW9ucy5zb3J0IFNvcnQgb3JkZXIgKGRlZmF1bHQ6IG5hdHVyYWwgb3JkZXIpXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBvcHRpb25zLnNraXAgTnVtYmVyIG9mIHJlc3VsdHMgdG8gc2tpcCBhdCB0aGUgYmVnaW5uaW5nXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBvcHRpb25zLmxpbWl0IE1heGltdW0gbnVtYmVyIG9mIHJlc3VsdHMgdG8gcmV0dXJuXG4gICAqIEBwYXJhbSB7TW9uZ29GaWVsZFNwZWNpZmllcn0gb3B0aW9ucy5maWVsZHMgRGljdGlvbmFyeSBvZiBmaWVsZHMgdG8gcmV0dXJuIG9yIGV4Y2x1ZGUuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gb3B0aW9ucy5yZWFjdGl2ZSAoQ2xpZW50IG9ubHkpIERlZmF1bHQgYHRydWVgOyBwYXNzIGBmYWxzZWAgdG8gZGlzYWJsZSByZWFjdGl2aXR5XG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IG9wdGlvbnMudHJhbnNmb3JtIE92ZXJyaWRlcyBgdHJhbnNmb3JtYCBvbiB0aGUgIFtgQ29sbGVjdGlvbmBdKCNjb2xsZWN0aW9ucykgZm9yIHRoaXMgY3Vyc29yLiAgUGFzcyBgbnVsbGAgdG8gZGlzYWJsZSB0cmFuc2Zvcm1hdGlvbi5cbiAgICogQHBhcmFtIHtCb29sZWFufSBvcHRpb25zLmRpc2FibGVPcGxvZyAoU2VydmVyIG9ubHkpIFBhc3MgdHJ1ZSB0byBkaXNhYmxlIG9wbG9nLXRhaWxpbmcgb24gdGhpcyBxdWVyeS4gVGhpcyBhZmZlY3RzIHRoZSB3YXkgc2VydmVyIHByb2Nlc3NlcyBjYWxscyB0byBgb2JzZXJ2ZWAgb24gdGhpcyBxdWVyeS4gRGlzYWJsaW5nIHRoZSBvcGxvZyBjYW4gYmUgdXNlZnVsIHdoZW4gd29ya2luZyB3aXRoIGRhdGEgdGhhdCB1cGRhdGVzIGluIGxhcmdlIGJhdGNoZXMuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBvcHRpb25zLnBvbGxpbmdJbnRlcnZhbE1zIChTZXJ2ZXIgb25seSkgV2hlbiBvcGxvZyBpcyBkaXNhYmxlZCAodGhyb3VnaCB0aGUgdXNlIG9mIGBkaXNhYmxlT3Bsb2dgIG9yIHdoZW4gb3RoZXJ3aXNlIG5vdCBhdmFpbGFibGUpLCB0aGUgZnJlcXVlbmN5IChpbiBtaWxsaXNlY29uZHMpIG9mIGhvdyBvZnRlbiB0byBwb2xsIHRoaXMgcXVlcnkgd2hlbiBvYnNlcnZpbmcgb24gdGhlIHNlcnZlci4gRGVmYXVsdHMgdG8gMTAwMDBtcyAoMTAgc2Vjb25kcykuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBvcHRpb25zLnBvbGxpbmdUaHJvdHRsZU1zIChTZXJ2ZXIgb25seSkgV2hlbiBvcGxvZyBpcyBkaXNhYmxlZCAodGhyb3VnaCB0aGUgdXNlIG9mIGBkaXNhYmxlT3Bsb2dgIG9yIHdoZW4gb3RoZXJ3aXNlIG5vdCBhdmFpbGFibGUpLCB0aGUgbWluaW11bSB0aW1lIChpbiBtaWxsaXNlY29uZHMpIHRvIGFsbG93IGJldHdlZW4gcmUtcG9sbGluZyB3aGVuIG9ic2VydmluZyBvbiB0aGUgc2VydmVyLiBJbmNyZWFzaW5nIHRoaXMgd2lsbCBzYXZlIENQVSBhbmQgbW9uZ28gbG9hZCBhdCB0aGUgZXhwZW5zZSBvZiBzbG93ZXIgdXBkYXRlcyB0byB1c2Vycy4gRGVjcmVhc2luZyB0aGlzIGlzIG5vdCByZWNvbW1lbmRlZC4gRGVmYXVsdHMgdG8gNTBtcy5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IG9wdGlvbnMubWF4VGltZU1zIChTZXJ2ZXIgb25seSkgSWYgc2V0LCBpbnN0cnVjdHMgTW9uZ29EQiB0byBzZXQgYSB0aW1lIGxpbWl0IGZvciB0aGlzIGN1cnNvcidzIG9wZXJhdGlvbnMuIElmIHRoZSBvcGVyYXRpb24gcmVhY2hlcyB0aGUgc3BlY2lmaWVkIHRpbWUgbGltaXQgKGluIG1pbGxpc2Vjb25kcykgd2l0aG91dCB0aGUgaGF2aW5nIGJlZW4gY29tcGxldGVkLCBhbiBleGNlcHRpb24gd2lsbCBiZSB0aHJvd24uIFVzZWZ1bCB0byBwcmV2ZW50IGFuIChhY2NpZGVudGFsIG9yIG1hbGljaW91cykgdW5vcHRpbWl6ZWQgcXVlcnkgZnJvbSBjYXVzaW5nIGEgZnVsbCBjb2xsZWN0aW9uIHNjYW4gdGhhdCB3b3VsZCBkaXNydXB0IG90aGVyIGRhdGFiYXNlIHVzZXJzLCBhdCB0aGUgZXhwZW5zZSBvZiBuZWVkaW5nIHRvIGhhbmRsZSB0aGUgcmVzdWx0aW5nIGVycm9yLlxuICAgKiBAcGFyYW0ge1N0cmluZ3xPYmplY3R9IG9wdGlvbnMuaGludCAoU2VydmVyIG9ubHkpIE92ZXJyaWRlcyBNb25nb0RCJ3MgZGVmYXVsdCBpbmRleCBzZWxlY3Rpb24gYW5kIHF1ZXJ5IG9wdGltaXphdGlvbiBwcm9jZXNzLiBTcGVjaWZ5IGFuIGluZGV4IHRvIGZvcmNlIGl0cyB1c2UsIGVpdGhlciBieSBpdHMgbmFtZSBvciBpbmRleCBzcGVjaWZpY2F0aW9uLiBZb3UgY2FuIGFsc28gc3BlY2lmeSBgeyAkbmF0dXJhbCA6IDEgfWAgdG8gZm9yY2UgYSBmb3J3YXJkcyBjb2xsZWN0aW9uIHNjYW4sIG9yIGB7ICRuYXR1cmFsIDogLTEgfWAgZm9yIGEgcmV2ZXJzZSBjb2xsZWN0aW9uIHNjYW4uIFNldHRpbmcgdGhpcyBpcyBvbmx5IHJlY29tbWVuZGVkIGZvciBhZHZhbmNlZCB1c2Vycy5cbiAgICogQHJldHVybnMge01vbmdvLkN1cnNvcn1cbiAgICovXG4gIGZpbmQoLi4uYXJncykge1xuICAgIC8vIENvbGxlY3Rpb24uZmluZCgpIChyZXR1cm4gYWxsIGRvY3MpIGJlaGF2ZXMgZGlmZmVyZW50bHlcbiAgICAvLyBmcm9tIENvbGxlY3Rpb24uZmluZCh1bmRlZmluZWQpIChyZXR1cm4gMCBkb2NzKS4gIHNvIGJlXG4gICAgLy8gY2FyZWZ1bCBhYm91dCB0aGUgbGVuZ3RoIG9mIGFyZ3VtZW50cy5cbiAgICByZXR1cm4gdGhpcy5fY29sbGVjdGlvbi5maW5kKFxuICAgICAgdGhpcy5fZ2V0RmluZFNlbGVjdG9yKGFyZ3MpLFxuICAgICAgdGhpcy5fZ2V0RmluZE9wdGlvbnMoYXJncylcbiAgICApO1xuICB9LFxuXG4gIC8qKlxuICAgKiBAc3VtbWFyeSBGaW5kcyB0aGUgZmlyc3QgZG9jdW1lbnQgdGhhdCBtYXRjaGVzIHRoZSBzZWxlY3RvciwgYXMgb3JkZXJlZCBieSBzb3J0IGFuZCBza2lwIG9wdGlvbnMuIFJldHVybnMgYHVuZGVmaW5lZGAgaWYgbm8gbWF0Y2hpbmcgZG9jdW1lbnQgaXMgZm91bmQuXG4gICAqIEBsb2N1cyBBbnl3aGVyZVxuICAgKiBAbWV0aG9kIGZpbmRPbmVcbiAgICogQG1lbWJlcm9mIE1vbmdvLkNvbGxlY3Rpb25cbiAgICogQGluc3RhbmNlXG4gICAqIEBwYXJhbSB7TW9uZ29TZWxlY3Rvcn0gW3NlbGVjdG9yXSBBIHF1ZXJ5IGRlc2NyaWJpbmcgdGhlIGRvY3VtZW50cyB0byBmaW5kXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc11cbiAgICogQHBhcmFtIHtNb25nb1NvcnRTcGVjaWZpZXJ9IG9wdGlvbnMuc29ydCBTb3J0IG9yZGVyIChkZWZhdWx0OiBuYXR1cmFsIG9yZGVyKVxuICAgKiBAcGFyYW0ge051bWJlcn0gb3B0aW9ucy5za2lwIE51bWJlciBvZiByZXN1bHRzIHRvIHNraXAgYXQgdGhlIGJlZ2lubmluZ1xuICAgKiBAcGFyYW0ge01vbmdvRmllbGRTcGVjaWZpZXJ9IG9wdGlvbnMuZmllbGRzIERpY3Rpb25hcnkgb2YgZmllbGRzIHRvIHJldHVybiBvciBleGNsdWRlLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IG9wdGlvbnMucmVhY3RpdmUgKENsaWVudCBvbmx5KSBEZWZhdWx0IHRydWU7IHBhc3MgZmFsc2UgdG8gZGlzYWJsZSByZWFjdGl2aXR5XG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IG9wdGlvbnMudHJhbnNmb3JtIE92ZXJyaWRlcyBgdHJhbnNmb3JtYCBvbiB0aGUgW2BDb2xsZWN0aW9uYF0oI2NvbGxlY3Rpb25zKSBmb3IgdGhpcyBjdXJzb3IuICBQYXNzIGBudWxsYCB0byBkaXNhYmxlIHRyYW5zZm9ybWF0aW9uLlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fVxuICAgKi9cbiAgZmluZE9uZSguLi5hcmdzKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbGxlY3Rpb24uZmluZE9uZShcbiAgICAgIHRoaXMuX2dldEZpbmRTZWxlY3RvcihhcmdzKSxcbiAgICAgIHRoaXMuX2dldEZpbmRPcHRpb25zKGFyZ3MpXG4gICAgKTtcbiAgfVxufSk7XG5cbk9iamVjdC5hc3NpZ24oTW9uZ28uQ29sbGVjdGlvbiwge1xuICBfcHVibGlzaEN1cnNvcihjdXJzb3IsIHN1YiwgY29sbGVjdGlvbikge1xuICAgIHZhciBvYnNlcnZlSGFuZGxlID0gY3Vyc29yLm9ic2VydmVDaGFuZ2VzKHtcbiAgICAgIGFkZGVkOiBmdW5jdGlvbiAoaWQsIGZpZWxkcykge1xuICAgICAgICBzdWIuYWRkZWQoY29sbGVjdGlvbiwgaWQsIGZpZWxkcyk7XG4gICAgICB9LFxuICAgICAgY2hhbmdlZDogZnVuY3Rpb24gKGlkLCBmaWVsZHMpIHtcbiAgICAgICAgc3ViLmNoYW5nZWQoY29sbGVjdGlvbiwgaWQsIGZpZWxkcyk7XG4gICAgICB9LFxuICAgICAgcmVtb3ZlZDogZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgIHN1Yi5yZW1vdmVkKGNvbGxlY3Rpb24sIGlkKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIFdlIGRvbid0IGNhbGwgc3ViLnJlYWR5KCkgaGVyZTogaXQgZ2V0cyBjYWxsZWQgaW4gbGl2ZWRhdGFfc2VydmVyLCBhZnRlclxuICAgIC8vIHBvc3NpYmx5IGNhbGxpbmcgX3B1Ymxpc2hDdXJzb3Igb24gbXVsdGlwbGUgcmV0dXJuZWQgY3Vyc29ycy5cblxuICAgIC8vIHJlZ2lzdGVyIHN0b3AgY2FsbGJhY2sgKGV4cGVjdHMgbGFtYmRhIHcvIG5vIGFyZ3MpLlxuICAgIHN1Yi5vblN0b3AoZnVuY3Rpb24gKCkge1xuICAgICAgb2JzZXJ2ZUhhbmRsZS5zdG9wKCk7XG4gICAgfSk7XG5cbiAgICAvLyByZXR1cm4gdGhlIG9ic2VydmVIYW5kbGUgaW4gY2FzZSBpdCBuZWVkcyB0byBiZSBzdG9wcGVkIGVhcmx5XG4gICAgcmV0dXJuIG9ic2VydmVIYW5kbGU7XG4gIH0sXG5cbiAgLy8gcHJvdGVjdCBhZ2FpbnN0IGRhbmdlcm91cyBzZWxlY3RvcnMuICBmYWxzZXkgYW5kIHtfaWQ6IGZhbHNleX0gYXJlIGJvdGhcbiAgLy8gbGlrZWx5IHByb2dyYW1tZXIgZXJyb3IsIGFuZCBub3Qgd2hhdCB5b3Ugd2FudCwgcGFydGljdWxhcmx5IGZvciBkZXN0cnVjdGl2ZVxuICAvLyBvcGVyYXRpb25zLiBJZiBhIGZhbHNleSBfaWQgaXMgc2VudCBpbiwgYSBuZXcgc3RyaW5nIF9pZCB3aWxsIGJlXG4gIC8vIGdlbmVyYXRlZCBhbmQgcmV0dXJuZWQ7IGlmIGEgZmFsbGJhY2tJZCBpcyBwcm92aWRlZCwgaXQgd2lsbCBiZSByZXR1cm5lZFxuICAvLyBpbnN0ZWFkLlxuICBfcmV3cml0ZVNlbGVjdG9yKHNlbGVjdG9yLCB7IGZhbGxiYWNrSWQgfSA9IHt9KSB7XG4gICAgLy8gc2hvcnRoYW5kIC0tIHNjYWxhcnMgbWF0Y2ggX2lkXG4gICAgaWYgKExvY2FsQ29sbGVjdGlvbi5fc2VsZWN0b3JJc0lkKHNlbGVjdG9yKSlcbiAgICAgIHNlbGVjdG9yID0ge19pZDogc2VsZWN0b3J9O1xuXG4gICAgaWYgKEFycmF5LmlzQXJyYXkoc2VsZWN0b3IpKSB7XG4gICAgICAvLyBUaGlzIGlzIGNvbnNpc3RlbnQgd2l0aCB0aGUgTW9uZ28gY29uc29sZSBpdHNlbGY7IGlmIHdlIGRvbid0IGRvIHRoaXNcbiAgICAgIC8vIGNoZWNrIHBhc3NpbmcgYW4gZW1wdHkgYXJyYXkgZW5kcyB1cCBzZWxlY3RpbmcgYWxsIGl0ZW1zXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNb25nbyBzZWxlY3RvciBjYW4ndCBiZSBhbiBhcnJheS5cIik7XG4gICAgfVxuXG4gICAgaWYgKCFzZWxlY3RvciB8fCAoKCdfaWQnIGluIHNlbGVjdG9yKSAmJiAhc2VsZWN0b3IuX2lkKSkge1xuICAgICAgLy8gY2FuJ3QgbWF0Y2ggYW55dGhpbmdcbiAgICAgIHJldHVybiB7IF9pZDogZmFsbGJhY2tJZCB8fCBSYW5kb20uaWQoKSB9O1xuICAgIH1cblxuICAgIHJldHVybiBzZWxlY3RvcjtcbiAgfVxufSk7XG5cbk9iamVjdC5hc3NpZ24oTW9uZ28uQ29sbGVjdGlvbi5wcm90b3R5cGUsIHtcbiAgLy8gJ2luc2VydCcgaW1tZWRpYXRlbHkgcmV0dXJucyB0aGUgaW5zZXJ0ZWQgZG9jdW1lbnQncyBuZXcgX2lkLlxuICAvLyBUaGUgb3RoZXJzIHJldHVybiB2YWx1ZXMgaW1tZWRpYXRlbHkgaWYgeW91IGFyZSBpbiBhIHN0dWIsIGFuIGluLW1lbW9yeVxuICAvLyB1bm1hbmFnZWQgY29sbGVjdGlvbiwgb3IgYSBtb25nby1iYWNrZWQgY29sbGVjdGlvbiBhbmQgeW91IGRvbid0IHBhc3MgYVxuICAvLyBjYWxsYmFjay4gJ3VwZGF0ZScgYW5kICdyZW1vdmUnIHJldHVybiB0aGUgbnVtYmVyIG9mIGFmZmVjdGVkXG4gIC8vIGRvY3VtZW50cy4gJ3Vwc2VydCcgcmV0dXJucyBhbiBvYmplY3Qgd2l0aCBrZXlzICdudW1iZXJBZmZlY3RlZCcgYW5kLCBpZiBhblxuICAvLyBpbnNlcnQgaGFwcGVuZWQsICdpbnNlcnRlZElkJy5cbiAgLy9cbiAgLy8gT3RoZXJ3aXNlLCB0aGUgc2VtYW50aWNzIGFyZSBleGFjdGx5IGxpa2Ugb3RoZXIgbWV0aG9kczogdGhleSB0YWtlXG4gIC8vIGEgY2FsbGJhY2sgYXMgYW4gb3B0aW9uYWwgbGFzdCBhcmd1bWVudDsgaWYgbm8gY2FsbGJhY2sgaXNcbiAgLy8gcHJvdmlkZWQsIHRoZXkgYmxvY2sgdW50aWwgdGhlIG9wZXJhdGlvbiBpcyBjb21wbGV0ZSwgYW5kIHRocm93IGFuXG4gIC8vIGV4Y2VwdGlvbiBpZiBpdCBmYWlsczsgaWYgYSBjYWxsYmFjayBpcyBwcm92aWRlZCwgdGhlbiB0aGV5IGRvbid0XG4gIC8vIG5lY2Vzc2FyaWx5IGJsb2NrLCBhbmQgdGhleSBjYWxsIHRoZSBjYWxsYmFjayB3aGVuIHRoZXkgZmluaXNoIHdpdGggZXJyb3IgYW5kXG4gIC8vIHJlc3VsdCBhcmd1bWVudHMuICAoVGhlIGluc2VydCBtZXRob2QgcHJvdmlkZXMgdGhlIGRvY3VtZW50IElEIGFzIGl0cyByZXN1bHQ7XG4gIC8vIHVwZGF0ZSBhbmQgcmVtb3ZlIHByb3ZpZGUgdGhlIG51bWJlciBvZiBhZmZlY3RlZCBkb2NzIGFzIHRoZSByZXN1bHQ7IHVwc2VydFxuICAvLyBwcm92aWRlcyBhbiBvYmplY3Qgd2l0aCBudW1iZXJBZmZlY3RlZCBhbmQgbWF5YmUgaW5zZXJ0ZWRJZC4pXG4gIC8vXG4gIC8vIE9uIHRoZSBjbGllbnQsIGJsb2NraW5nIGlzIGltcG9zc2libGUsIHNvIGlmIGEgY2FsbGJhY2tcbiAgLy8gaXNuJ3QgcHJvdmlkZWQsIHRoZXkganVzdCByZXR1cm4gaW1tZWRpYXRlbHkgYW5kIGFueSBlcnJvclxuICAvLyBpbmZvcm1hdGlvbiBpcyBsb3N0LlxuICAvL1xuICAvLyBUaGVyZSdzIG9uZSBtb3JlIHR3ZWFrLiBPbiB0aGUgY2xpZW50LCBpZiB5b3UgZG9uJ3QgcHJvdmlkZSBhXG4gIC8vIGNhbGxiYWNrLCB0aGVuIGlmIHRoZXJlIGlzIGFuIGVycm9yLCBhIG1lc3NhZ2Ugd2lsbCBiZSBsb2dnZWQgd2l0aFxuICAvLyBNZXRlb3IuX2RlYnVnLlxuICAvL1xuICAvLyBUaGUgaW50ZW50ICh0aG91Z2ggdGhpcyBpcyBhY3R1YWxseSBkZXRlcm1pbmVkIGJ5IHRoZSB1bmRlcmx5aW5nXG4gIC8vIGRyaXZlcnMpIGlzIHRoYXQgdGhlIG9wZXJhdGlvbnMgc2hvdWxkIGJlIGRvbmUgc3luY2hyb25vdXNseSwgbm90XG4gIC8vIGdlbmVyYXRpbmcgdGhlaXIgcmVzdWx0IHVudGlsIHRoZSBkYXRhYmFzZSBoYXMgYWNrbm93bGVkZ2VkXG4gIC8vIHRoZW0uIEluIHRoZSBmdXR1cmUgbWF5YmUgd2Ugc2hvdWxkIHByb3ZpZGUgYSBmbGFnIHRvIHR1cm4gdGhpc1xuICAvLyBvZmYuXG5cbiAgLyoqXG4gICAqIEBzdW1tYXJ5IEluc2VydCBhIGRvY3VtZW50IGluIHRoZSBjb2xsZWN0aW9uLiAgUmV0dXJucyBpdHMgdW5pcXVlIF9pZC5cbiAgICogQGxvY3VzIEFueXdoZXJlXG4gICAqIEBtZXRob2QgIGluc2VydFxuICAgKiBAbWVtYmVyb2YgTW9uZ28uQ29sbGVjdGlvblxuICAgKiBAaW5zdGFuY2VcbiAgICogQHBhcmFtIHtPYmplY3R9IGRvYyBUaGUgZG9jdW1lbnQgdG8gaW5zZXJ0LiBNYXkgbm90IHlldCBoYXZlIGFuIF9pZCBhdHRyaWJ1dGUsIGluIHdoaWNoIGNhc2UgTWV0ZW9yIHdpbGwgZ2VuZXJhdGUgb25lIGZvciB5b3UuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYWxsYmFja10gT3B0aW9uYWwuICBJZiBwcmVzZW50LCBjYWxsZWQgd2l0aCBhbiBlcnJvciBvYmplY3QgYXMgdGhlIGZpcnN0IGFyZ3VtZW50IGFuZCwgaWYgbm8gZXJyb3IsIHRoZSBfaWQgYXMgdGhlIHNlY29uZC5cbiAgICovXG4gIGluc2VydChkb2MsIGNhbGxiYWNrKSB7XG4gICAgLy8gTWFrZSBzdXJlIHdlIHdlcmUgcGFzc2VkIGEgZG9jdW1lbnQgdG8gaW5zZXJ0XG4gICAgaWYgKCFkb2MpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcImluc2VydCByZXF1aXJlcyBhbiBhcmd1bWVudFwiKTtcbiAgICB9XG5cbiAgICAvLyBNYWtlIGEgc2hhbGxvdyBjbG9uZSBvZiB0aGUgZG9jdW1lbnQsIHByZXNlcnZpbmcgaXRzIHByb3RvdHlwZS5cbiAgICBkb2MgPSBPYmplY3QuY3JlYXRlKFxuICAgICAgT2JqZWN0LmdldFByb3RvdHlwZU9mKGRvYyksXG4gICAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhkb2MpXG4gICAgKTtcblxuICAgIGlmICgnX2lkJyBpbiBkb2MpIHtcbiAgICAgIGlmICghIGRvYy5faWQgfHxcbiAgICAgICAgICAhICh0eXBlb2YgZG9jLl9pZCA9PT0gJ3N0cmluZycgfHxcbiAgICAgICAgICAgICBkb2MuX2lkIGluc3RhbmNlb2YgTW9uZ28uT2JqZWN0SUQpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBcIk1ldGVvciByZXF1aXJlcyBkb2N1bWVudCBfaWQgZmllbGRzIHRvIGJlIG5vbi1lbXB0eSBzdHJpbmdzIG9yIE9iamVjdElEc1wiKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IGdlbmVyYXRlSWQgPSB0cnVlO1xuXG4gICAgICAvLyBEb24ndCBnZW5lcmF0ZSB0aGUgaWQgaWYgd2UncmUgdGhlIGNsaWVudCBhbmQgdGhlICdvdXRlcm1vc3QnIGNhbGxcbiAgICAgIC8vIFRoaXMgb3B0aW1pemF0aW9uIHNhdmVzIHVzIHBhc3NpbmcgYm90aCB0aGUgcmFuZG9tU2VlZCBhbmQgdGhlIGlkXG4gICAgICAvLyBQYXNzaW5nIGJvdGggaXMgcmVkdW5kYW50LlxuICAgICAgaWYgKHRoaXMuX2lzUmVtb3RlQ29sbGVjdGlvbigpKSB7XG4gICAgICAgIGNvbnN0IGVuY2xvc2luZyA9IEREUC5fQ3VycmVudE1ldGhvZEludm9jYXRpb24uZ2V0KCk7XG4gICAgICAgIGlmICghZW5jbG9zaW5nKSB7XG4gICAgICAgICAgZ2VuZXJhdGVJZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChnZW5lcmF0ZUlkKSB7XG4gICAgICAgIGRvYy5faWQgPSB0aGlzLl9tYWtlTmV3SUQoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBPbiBpbnNlcnRzLCBhbHdheXMgcmV0dXJuIHRoZSBpZCB0aGF0IHdlIGdlbmVyYXRlZDsgb24gYWxsIG90aGVyXG4gICAgLy8gb3BlcmF0aW9ucywganVzdCByZXR1cm4gdGhlIHJlc3VsdCBmcm9tIHRoZSBjb2xsZWN0aW9uLlxuICAgIHZhciBjaG9vc2VSZXR1cm5WYWx1ZUZyb21Db2xsZWN0aW9uUmVzdWx0ID0gZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgaWYgKGRvYy5faWQpIHtcbiAgICAgICAgcmV0dXJuIGRvYy5faWQ7XG4gICAgICB9XG5cbiAgICAgIC8vIFhYWCB3aGF0IGlzIHRoaXMgZm9yPz9cbiAgICAgIC8vIEl0J3Mgc29tZSBpdGVyYWN0aW9uIGJldHdlZW4gdGhlIGNhbGxiYWNrIHRvIF9jYWxsTXV0YXRvck1ldGhvZCBhbmRcbiAgICAgIC8vIHRoZSByZXR1cm4gdmFsdWUgY29udmVyc2lvblxuICAgICAgZG9jLl9pZCA9IHJlc3VsdDtcblxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuXG4gICAgY29uc3Qgd3JhcHBlZENhbGxiYWNrID0gd3JhcENhbGxiYWNrKFxuICAgICAgY2FsbGJhY2ssIGNob29zZVJldHVyblZhbHVlRnJvbUNvbGxlY3Rpb25SZXN1bHQpO1xuXG4gICAgaWYgKHRoaXMuX2lzUmVtb3RlQ29sbGVjdGlvbigpKSB7XG4gICAgICBjb25zdCByZXN1bHQgPSB0aGlzLl9jYWxsTXV0YXRvck1ldGhvZChcImluc2VydFwiLCBbZG9jXSwgd3JhcHBlZENhbGxiYWNrKTtcbiAgICAgIHJldHVybiBjaG9vc2VSZXR1cm5WYWx1ZUZyb21Db2xsZWN0aW9uUmVzdWx0KHJlc3VsdCk7XG4gICAgfVxuXG4gICAgLy8gaXQncyBteSBjb2xsZWN0aW9uLiAgZGVzY2VuZCBpbnRvIHRoZSBjb2xsZWN0aW9uIG9iamVjdFxuICAgIC8vIGFuZCBwcm9wYWdhdGUgYW55IGV4Y2VwdGlvbi5cbiAgICB0cnkge1xuICAgICAgLy8gSWYgdGhlIHVzZXIgcHJvdmlkZWQgYSBjYWxsYmFjayBhbmQgdGhlIGNvbGxlY3Rpb24gaW1wbGVtZW50cyB0aGlzXG4gICAgICAvLyBvcGVyYXRpb24gYXN5bmNocm9ub3VzbHksIHRoZW4gcXVlcnlSZXQgd2lsbCBiZSB1bmRlZmluZWQsIGFuZCB0aGVcbiAgICAgIC8vIHJlc3VsdCB3aWxsIGJlIHJldHVybmVkIHRocm91Z2ggdGhlIGNhbGxiYWNrIGluc3RlYWQuXG4gICAgICBjb25zdCByZXN1bHQgPSB0aGlzLl9jb2xsZWN0aW9uLmluc2VydChkb2MsIHdyYXBwZWRDYWxsYmFjayk7XG4gICAgICByZXR1cm4gY2hvb3NlUmV0dXJuVmFsdWVGcm9tQ29sbGVjdGlvblJlc3VsdChyZXN1bHQpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjayhlKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgICB0aHJvdyBlO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogQHN1bW1hcnkgTW9kaWZ5IG9uZSBvciBtb3JlIGRvY3VtZW50cyBpbiB0aGUgY29sbGVjdGlvbi4gUmV0dXJucyB0aGUgbnVtYmVyIG9mIG1hdGNoZWQgZG9jdW1lbnRzLlxuICAgKiBAbG9jdXMgQW55d2hlcmVcbiAgICogQG1ldGhvZCB1cGRhdGVcbiAgICogQG1lbWJlcm9mIE1vbmdvLkNvbGxlY3Rpb25cbiAgICogQGluc3RhbmNlXG4gICAqIEBwYXJhbSB7TW9uZ29TZWxlY3Rvcn0gc2VsZWN0b3IgU3BlY2lmaWVzIHdoaWNoIGRvY3VtZW50cyB0byBtb2RpZnlcbiAgICogQHBhcmFtIHtNb25nb01vZGlmaWVyfSBtb2RpZmllciBTcGVjaWZpZXMgaG93IHRvIG1vZGlmeSB0aGUgZG9jdW1lbnRzXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc11cbiAgICogQHBhcmFtIHtCb29sZWFufSBvcHRpb25zLm11bHRpIFRydWUgdG8gbW9kaWZ5IGFsbCBtYXRjaGluZyBkb2N1bWVudHM7IGZhbHNlIHRvIG9ubHkgbW9kaWZ5IG9uZSBvZiB0aGUgbWF0Y2hpbmcgZG9jdW1lbnRzICh0aGUgZGVmYXVsdCkuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gb3B0aW9ucy51cHNlcnQgVHJ1ZSB0byBpbnNlcnQgYSBkb2N1bWVudCBpZiBubyBtYXRjaGluZyBkb2N1bWVudHMgYXJlIGZvdW5kLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2FsbGJhY2tdIE9wdGlvbmFsLiAgSWYgcHJlc2VudCwgY2FsbGVkIHdpdGggYW4gZXJyb3Igb2JqZWN0IGFzIHRoZSBmaXJzdCBhcmd1bWVudCBhbmQsIGlmIG5vIGVycm9yLCB0aGUgbnVtYmVyIG9mIGFmZmVjdGVkIGRvY3VtZW50cyBhcyB0aGUgc2Vjb25kLlxuICAgKi9cbiAgdXBkYXRlKHNlbGVjdG9yLCBtb2RpZmllciwgLi4ub3B0aW9uc0FuZENhbGxiYWNrKSB7XG4gICAgY29uc3QgY2FsbGJhY2sgPSBwb3BDYWxsYmFja0Zyb21BcmdzKG9wdGlvbnNBbmRDYWxsYmFjayk7XG5cbiAgICAvLyBXZSd2ZSBhbHJlYWR5IHBvcHBlZCBvZmYgdGhlIGNhbGxiYWNrLCBzbyB3ZSBhcmUgbGVmdCB3aXRoIGFuIGFycmF5XG4gICAgLy8gb2Ygb25lIG9yIHplcm8gaXRlbXNcbiAgICBjb25zdCBvcHRpb25zID0geyAuLi4ob3B0aW9uc0FuZENhbGxiYWNrWzBdIHx8IG51bGwpIH07XG4gICAgbGV0IGluc2VydGVkSWQ7XG4gICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy51cHNlcnQpIHtcbiAgICAgIC8vIHNldCBgaW5zZXJ0ZWRJZGAgaWYgYWJzZW50LiAgYGluc2VydGVkSWRgIGlzIGEgTWV0ZW9yIGV4dGVuc2lvbi5cbiAgICAgIGlmIChvcHRpb25zLmluc2VydGVkSWQpIHtcbiAgICAgICAgaWYgKCEodHlwZW9mIG9wdGlvbnMuaW5zZXJ0ZWRJZCA9PT0gJ3N0cmluZycgfHwgb3B0aW9ucy5pbnNlcnRlZElkIGluc3RhbmNlb2YgTW9uZ28uT2JqZWN0SUQpKVxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImluc2VydGVkSWQgbXVzdCBiZSBzdHJpbmcgb3IgT2JqZWN0SURcIik7XG4gICAgICAgIGluc2VydGVkSWQgPSBvcHRpb25zLmluc2VydGVkSWQ7XG4gICAgICB9IGVsc2UgaWYgKCFzZWxlY3RvciB8fCAhc2VsZWN0b3IuX2lkKSB7XG4gICAgICAgIGluc2VydGVkSWQgPSB0aGlzLl9tYWtlTmV3SUQoKTtcbiAgICAgICAgb3B0aW9ucy5nZW5lcmF0ZWRJZCA9IHRydWU7XG4gICAgICAgIG9wdGlvbnMuaW5zZXJ0ZWRJZCA9IGluc2VydGVkSWQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgc2VsZWN0b3IgPVxuICAgICAgTW9uZ28uQ29sbGVjdGlvbi5fcmV3cml0ZVNlbGVjdG9yKHNlbGVjdG9yLCB7IGZhbGxiYWNrSWQ6IGluc2VydGVkSWQgfSk7XG5cbiAgICBjb25zdCB3cmFwcGVkQ2FsbGJhY2sgPSB3cmFwQ2FsbGJhY2soY2FsbGJhY2spO1xuXG4gICAgaWYgKHRoaXMuX2lzUmVtb3RlQ29sbGVjdGlvbigpKSB7XG4gICAgICBjb25zdCBhcmdzID0gW1xuICAgICAgICBzZWxlY3RvcixcbiAgICAgICAgbW9kaWZpZXIsXG4gICAgICAgIG9wdGlvbnNcbiAgICAgIF07XG5cbiAgICAgIHJldHVybiB0aGlzLl9jYWxsTXV0YXRvck1ldGhvZChcInVwZGF0ZVwiLCBhcmdzLCB3cmFwcGVkQ2FsbGJhY2spO1xuICAgIH1cblxuICAgIC8vIGl0J3MgbXkgY29sbGVjdGlvbi4gIGRlc2NlbmQgaW50byB0aGUgY29sbGVjdGlvbiBvYmplY3RcbiAgICAvLyBhbmQgcHJvcGFnYXRlIGFueSBleGNlcHRpb24uXG4gICAgdHJ5IHtcbiAgICAgIC8vIElmIHRoZSB1c2VyIHByb3ZpZGVkIGEgY2FsbGJhY2sgYW5kIHRoZSBjb2xsZWN0aW9uIGltcGxlbWVudHMgdGhpc1xuICAgICAgLy8gb3BlcmF0aW9uIGFzeW5jaHJvbm91c2x5LCB0aGVuIHF1ZXJ5UmV0IHdpbGwgYmUgdW5kZWZpbmVkLCBhbmQgdGhlXG4gICAgICAvLyByZXN1bHQgd2lsbCBiZSByZXR1cm5lZCB0aHJvdWdoIHRoZSBjYWxsYmFjayBpbnN0ZWFkLlxuICAgICAgcmV0dXJuIHRoaXMuX2NvbGxlY3Rpb24udXBkYXRlKFxuICAgICAgICBzZWxlY3RvciwgbW9kaWZpZXIsIG9wdGlvbnMsIHdyYXBwZWRDYWxsYmFjayk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgIGNhbGxiYWNrKGUpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICAgIHRocm93IGU7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBAc3VtbWFyeSBSZW1vdmUgZG9jdW1lbnRzIGZyb20gdGhlIGNvbGxlY3Rpb25cbiAgICogQGxvY3VzIEFueXdoZXJlXG4gICAqIEBtZXRob2QgcmVtb3ZlXG4gICAqIEBtZW1iZXJvZiBNb25nby5Db2xsZWN0aW9uXG4gICAqIEBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge01vbmdvU2VsZWN0b3J9IHNlbGVjdG9yIFNwZWNpZmllcyB3aGljaCBkb2N1bWVudHMgdG8gcmVtb3ZlXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYWxsYmFja10gT3B0aW9uYWwuICBJZiBwcmVzZW50LCBjYWxsZWQgd2l0aCBhbiBlcnJvciBvYmplY3QgYXMgaXRzIGFyZ3VtZW50LlxuICAgKi9cbiAgcmVtb3ZlKHNlbGVjdG9yLCBjYWxsYmFjaykge1xuICAgIHNlbGVjdG9yID0gTW9uZ28uQ29sbGVjdGlvbi5fcmV3cml0ZVNlbGVjdG9yKHNlbGVjdG9yKTtcblxuICAgIGNvbnN0IHdyYXBwZWRDYWxsYmFjayA9IHdyYXBDYWxsYmFjayhjYWxsYmFjayk7XG5cbiAgICBpZiAodGhpcy5faXNSZW1vdGVDb2xsZWN0aW9uKCkpIHtcbiAgICAgIHJldHVybiB0aGlzLl9jYWxsTXV0YXRvck1ldGhvZChcInJlbW92ZVwiLCBbc2VsZWN0b3JdLCB3cmFwcGVkQ2FsbGJhY2spO1xuICAgIH1cblxuICAgIC8vIGl0J3MgbXkgY29sbGVjdGlvbi4gIGRlc2NlbmQgaW50byB0aGUgY29sbGVjdGlvbiBvYmplY3RcbiAgICAvLyBhbmQgcHJvcGFnYXRlIGFueSBleGNlcHRpb24uXG4gICAgdHJ5IHtcbiAgICAgIC8vIElmIHRoZSB1c2VyIHByb3ZpZGVkIGEgY2FsbGJhY2sgYW5kIHRoZSBjb2xsZWN0aW9uIGltcGxlbWVudHMgdGhpc1xuICAgICAgLy8gb3BlcmF0aW9uIGFzeW5jaHJvbm91c2x5LCB0aGVuIHF1ZXJ5UmV0IHdpbGwgYmUgdW5kZWZpbmVkLCBhbmQgdGhlXG4gICAgICAvLyByZXN1bHQgd2lsbCBiZSByZXR1cm5lZCB0aHJvdWdoIHRoZSBjYWxsYmFjayBpbnN0ZWFkLlxuICAgICAgcmV0dXJuIHRoaXMuX2NvbGxlY3Rpb24ucmVtb3ZlKHNlbGVjdG9yLCB3cmFwcGVkQ2FsbGJhY2spO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjayhlKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgICB0aHJvdyBlO1xuICAgIH1cbiAgfSxcblxuICAvLyBEZXRlcm1pbmUgaWYgdGhpcyBjb2xsZWN0aW9uIGlzIHNpbXBseSBhIG1pbmltb25nbyByZXByZXNlbnRhdGlvbiBvZiBhIHJlYWxcbiAgLy8gZGF0YWJhc2Ugb24gYW5vdGhlciBzZXJ2ZXJcbiAgX2lzUmVtb3RlQ29sbGVjdGlvbigpIHtcbiAgICAvLyBYWFggc2VlICNNZXRlb3JTZXJ2ZXJOdWxsXG4gICAgcmV0dXJuIHRoaXMuX2Nvbm5lY3Rpb24gJiYgdGhpcy5fY29ubmVjdGlvbiAhPT0gTWV0ZW9yLnNlcnZlcjtcbiAgfSxcblxuICAvKipcbiAgICogQHN1bW1hcnkgTW9kaWZ5IG9uZSBvciBtb3JlIGRvY3VtZW50cyBpbiB0aGUgY29sbGVjdGlvbiwgb3IgaW5zZXJ0IG9uZSBpZiBubyBtYXRjaGluZyBkb2N1bWVudHMgd2VyZSBmb3VuZC4gUmV0dXJucyBhbiBvYmplY3Qgd2l0aCBrZXlzIGBudW1iZXJBZmZlY3RlZGAgKHRoZSBudW1iZXIgb2YgZG9jdW1lbnRzIG1vZGlmaWVkKSAgYW5kIGBpbnNlcnRlZElkYCAodGhlIHVuaXF1ZSBfaWQgb2YgdGhlIGRvY3VtZW50IHRoYXQgd2FzIGluc2VydGVkLCBpZiBhbnkpLlxuICAgKiBAbG9jdXMgQW55d2hlcmVcbiAgICogQG1ldGhvZCB1cHNlcnRcbiAgICogQG1lbWJlcm9mIE1vbmdvLkNvbGxlY3Rpb25cbiAgICogQGluc3RhbmNlXG4gICAqIEBwYXJhbSB7TW9uZ29TZWxlY3Rvcn0gc2VsZWN0b3IgU3BlY2lmaWVzIHdoaWNoIGRvY3VtZW50cyB0byBtb2RpZnlcbiAgICogQHBhcmFtIHtNb25nb01vZGlmaWVyfSBtb2RpZmllciBTcGVjaWZpZXMgaG93IHRvIG1vZGlmeSB0aGUgZG9jdW1lbnRzXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc11cbiAgICogQHBhcmFtIHtCb29sZWFufSBvcHRpb25zLm11bHRpIFRydWUgdG8gbW9kaWZ5IGFsbCBtYXRjaGluZyBkb2N1bWVudHM7IGZhbHNlIHRvIG9ubHkgbW9kaWZ5IG9uZSBvZiB0aGUgbWF0Y2hpbmcgZG9jdW1lbnRzICh0aGUgZGVmYXVsdCkuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYWxsYmFja10gT3B0aW9uYWwuICBJZiBwcmVzZW50LCBjYWxsZWQgd2l0aCBhbiBlcnJvciBvYmplY3QgYXMgdGhlIGZpcnN0IGFyZ3VtZW50IGFuZCwgaWYgbm8gZXJyb3IsIHRoZSBudW1iZXIgb2YgYWZmZWN0ZWQgZG9jdW1lbnRzIGFzIHRoZSBzZWNvbmQuXG4gICAqL1xuICB1cHNlcnQoc2VsZWN0b3IsIG1vZGlmaWVyLCBvcHRpb25zLCBjYWxsYmFjaykge1xuICAgIGlmICghIGNhbGxiYWNrICYmIHR5cGVvZiBvcHRpb25zID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIGNhbGxiYWNrID0gb3B0aW9ucztcbiAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy51cGRhdGUoc2VsZWN0b3IsIG1vZGlmaWVyLCB7XG4gICAgICAuLi5vcHRpb25zLFxuICAgICAgX3JldHVybk9iamVjdDogdHJ1ZSxcbiAgICAgIHVwc2VydDogdHJ1ZSxcbiAgICB9LCBjYWxsYmFjayk7XG4gIH0sXG5cbiAgLy8gV2UnbGwgYWN0dWFsbHkgZGVzaWduIGFuIGluZGV4IEFQSSBsYXRlci4gRm9yIG5vdywgd2UganVzdCBwYXNzIHRocm91Z2ggdG9cbiAgLy8gTW9uZ28ncywgYnV0IG1ha2UgaXQgc3luY2hyb25vdXMuXG4gIF9lbnN1cmVJbmRleChpbmRleCwgb3B0aW9ucykge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBpZiAoIXNlbGYuX2NvbGxlY3Rpb24uX2Vuc3VyZUluZGV4KVxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2FuIG9ubHkgY2FsbCBfZW5zdXJlSW5kZXggb24gc2VydmVyIGNvbGxlY3Rpb25zXCIpO1xuICAgIHNlbGYuX2NvbGxlY3Rpb24uX2Vuc3VyZUluZGV4KGluZGV4LCBvcHRpb25zKTtcbiAgfSxcblxuICBfZHJvcEluZGV4KGluZGV4KSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIGlmICghc2VsZi5fY29sbGVjdGlvbi5fZHJvcEluZGV4KVxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2FuIG9ubHkgY2FsbCBfZHJvcEluZGV4IG9uIHNlcnZlciBjb2xsZWN0aW9uc1wiKTtcbiAgICBzZWxmLl9jb2xsZWN0aW9uLl9kcm9wSW5kZXgoaW5kZXgpO1xuICB9LFxuXG4gIF9kcm9wQ29sbGVjdGlvbigpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgaWYgKCFzZWxmLl9jb2xsZWN0aW9uLmRyb3BDb2xsZWN0aW9uKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2FuIG9ubHkgY2FsbCBfZHJvcENvbGxlY3Rpb24gb24gc2VydmVyIGNvbGxlY3Rpb25zXCIpO1xuICAgIHNlbGYuX2NvbGxlY3Rpb24uZHJvcENvbGxlY3Rpb24oKTtcbiAgfSxcblxuICBfY3JlYXRlQ2FwcGVkQ29sbGVjdGlvbihieXRlU2l6ZSwgbWF4RG9jdW1lbnRzKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIGlmICghc2VsZi5fY29sbGVjdGlvbi5fY3JlYXRlQ2FwcGVkQ29sbGVjdGlvbilcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbiBvbmx5IGNhbGwgX2NyZWF0ZUNhcHBlZENvbGxlY3Rpb24gb24gc2VydmVyIGNvbGxlY3Rpb25zXCIpO1xuICAgIHNlbGYuX2NvbGxlY3Rpb24uX2NyZWF0ZUNhcHBlZENvbGxlY3Rpb24oYnl0ZVNpemUsIG1heERvY3VtZW50cyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEBzdW1tYXJ5IFJldHVybnMgdGhlIFtgQ29sbGVjdGlvbmBdKGh0dHA6Ly9tb25nb2RiLmdpdGh1Yi5pby9ub2RlLW1vbmdvZGItbmF0aXZlLzMuMC9hcGkvQ29sbGVjdGlvbi5odG1sKSBvYmplY3QgY29ycmVzcG9uZGluZyB0byB0aGlzIGNvbGxlY3Rpb24gZnJvbSB0aGUgW25wbSBgbW9uZ29kYmAgZHJpdmVyIG1vZHVsZV0oaHR0cHM6Ly93d3cubnBtanMuY29tL3BhY2thZ2UvbW9uZ29kYikgd2hpY2ggaXMgd3JhcHBlZCBieSBgTW9uZ28uQ29sbGVjdGlvbmAuXG4gICAqIEBsb2N1cyBTZXJ2ZXJcbiAgICogQG1lbWJlcm9mIE1vbmdvLkNvbGxlY3Rpb25cbiAgICogQGluc3RhbmNlXG4gICAqL1xuICByYXdDb2xsZWN0aW9uKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBpZiAoISBzZWxmLl9jb2xsZWN0aW9uLnJhd0NvbGxlY3Rpb24pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbiBvbmx5IGNhbGwgcmF3Q29sbGVjdGlvbiBvbiBzZXJ2ZXIgY29sbGVjdGlvbnNcIik7XG4gICAgfVxuICAgIHJldHVybiBzZWxmLl9jb2xsZWN0aW9uLnJhd0NvbGxlY3Rpb24oKTtcbiAgfSxcblxuICAvKipcbiAgICogQHN1bW1hcnkgUmV0dXJucyB0aGUgW2BEYmBdKGh0dHA6Ly9tb25nb2RiLmdpdGh1Yi5pby9ub2RlLW1vbmdvZGItbmF0aXZlLzMuMC9hcGkvRGIuaHRtbCkgb2JqZWN0IGNvcnJlc3BvbmRpbmcgdG8gdGhpcyBjb2xsZWN0aW9uJ3MgZGF0YWJhc2UgY29ubmVjdGlvbiBmcm9tIHRoZSBbbnBtIGBtb25nb2RiYCBkcml2ZXIgbW9kdWxlXShodHRwczovL3d3dy5ucG1qcy5jb20vcGFja2FnZS9tb25nb2RiKSB3aGljaCBpcyB3cmFwcGVkIGJ5IGBNb25nby5Db2xsZWN0aW9uYC5cbiAgICogQGxvY3VzIFNlcnZlclxuICAgKiBAbWVtYmVyb2YgTW9uZ28uQ29sbGVjdGlvblxuICAgKiBAaW5zdGFuY2VcbiAgICovXG4gIHJhd0RhdGFiYXNlKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBpZiAoISAoc2VsZi5fZHJpdmVyLm1vbmdvICYmIHNlbGYuX2RyaXZlci5tb25nby5kYikpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbiBvbmx5IGNhbGwgcmF3RGF0YWJhc2Ugb24gc2VydmVyIGNvbGxlY3Rpb25zXCIpO1xuICAgIH1cbiAgICByZXR1cm4gc2VsZi5fZHJpdmVyLm1vbmdvLmRiO1xuICB9XG59KTtcblxuLy8gQ29udmVydCB0aGUgY2FsbGJhY2sgdG8gbm90IHJldHVybiBhIHJlc3VsdCBpZiB0aGVyZSBpcyBhbiBlcnJvclxuZnVuY3Rpb24gd3JhcENhbGxiYWNrKGNhbGxiYWNrLCBjb252ZXJ0UmVzdWx0KSB7XG4gIHJldHVybiBjYWxsYmFjayAmJiBmdW5jdGlvbiAoZXJyb3IsIHJlc3VsdCkge1xuICAgIGlmIChlcnJvcikge1xuICAgICAgY2FsbGJhY2soZXJyb3IpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGNvbnZlcnRSZXN1bHQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgY2FsbGJhY2soZXJyb3IsIGNvbnZlcnRSZXN1bHQocmVzdWx0KSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNhbGxiYWNrKGVycm9yLCByZXN1bHQpO1xuICAgIH1cbiAgfTtcbn1cblxuLyoqXG4gKiBAc3VtbWFyeSBDcmVhdGUgYSBNb25nby1zdHlsZSBgT2JqZWN0SURgLiAgSWYgeW91IGRvbid0IHNwZWNpZnkgYSBgaGV4U3RyaW5nYCwgdGhlIGBPYmplY3RJRGAgd2lsbCBnZW5lcmF0ZWQgcmFuZG9tbHkgKG5vdCB1c2luZyBNb25nb0RCJ3MgSUQgY29uc3RydWN0aW9uIHJ1bGVzKS5cbiAqIEBsb2N1cyBBbnl3aGVyZVxuICogQGNsYXNzXG4gKiBAcGFyYW0ge1N0cmluZ30gW2hleFN0cmluZ10gT3B0aW9uYWwuICBUaGUgMjQtY2hhcmFjdGVyIGhleGFkZWNpbWFsIGNvbnRlbnRzIG9mIHRoZSBPYmplY3RJRCB0byBjcmVhdGVcbiAqL1xuTW9uZ28uT2JqZWN0SUQgPSBNb25nb0lELk9iamVjdElEO1xuXG4vKipcbiAqIEBzdW1tYXJ5IFRvIGNyZWF0ZSBhIGN1cnNvciwgdXNlIGZpbmQuIFRvIGFjY2VzcyB0aGUgZG9jdW1lbnRzIGluIGEgY3Vyc29yLCB1c2UgZm9yRWFjaCwgbWFwLCBvciBmZXRjaC5cbiAqIEBjbGFzc1xuICogQGluc3RhbmNlTmFtZSBjdXJzb3JcbiAqL1xuTW9uZ28uQ3Vyc29yID0gTG9jYWxDb2xsZWN0aW9uLkN1cnNvcjtcblxuLyoqXG4gKiBAZGVwcmVjYXRlZCBpbiAwLjkuMVxuICovXG5Nb25nby5Db2xsZWN0aW9uLkN1cnNvciA9IE1vbmdvLkN1cnNvcjtcblxuLyoqXG4gKiBAZGVwcmVjYXRlZCBpbiAwLjkuMVxuICovXG5Nb25nby5Db2xsZWN0aW9uLk9iamVjdElEID0gTW9uZ28uT2JqZWN0SUQ7XG5cbi8qKlxuICogQGRlcHJlY2F0ZWQgaW4gMC45LjFcbiAqL1xuTWV0ZW9yLkNvbGxlY3Rpb24gPSBNb25nby5Db2xsZWN0aW9uO1xuXG4vLyBBbGxvdyBkZW55IHN0dWZmIGlzIG5vdyBpbiB0aGUgYWxsb3ctZGVueSBwYWNrYWdlXG5PYmplY3QuYXNzaWduKFxuICBNZXRlb3IuQ29sbGVjdGlvbi5wcm90b3R5cGUsXG4gIEFsbG93RGVueS5Db2xsZWN0aW9uUHJvdG90eXBlXG4pO1xuXG5mdW5jdGlvbiBwb3BDYWxsYmFja0Zyb21BcmdzKGFyZ3MpIHtcbiAgLy8gUHVsbCBvZmYgYW55IGNhbGxiYWNrIChvciBwZXJoYXBzIGEgJ2NhbGxiYWNrJyB2YXJpYWJsZSB0aGF0IHdhcyBwYXNzZWRcbiAgLy8gaW4gdW5kZWZpbmVkLCBsaWtlIGhvdyAndXBzZXJ0JyBkb2VzIGl0KS5cbiAgaWYgKGFyZ3MubGVuZ3RoICYmXG4gICAgICAoYXJnc1thcmdzLmxlbmd0aCAtIDFdID09PSB1bmRlZmluZWQgfHxcbiAgICAgICBhcmdzW2FyZ3MubGVuZ3RoIC0gMV0gaW5zdGFuY2VvZiBGdW5jdGlvbikpIHtcbiAgICByZXR1cm4gYXJncy5wb3AoKTtcbiAgfVxufVxuIiwiLyoqXG4gKiBAc3VtbWFyeSBBbGxvd3MgZm9yIHVzZXIgc3BlY2lmaWVkIGNvbm5lY3Rpb24gb3B0aW9uc1xuICogQGV4YW1wbGUgaHR0cDovL21vbmdvZGIuZ2l0aHViLmlvL25vZGUtbW9uZ29kYi1uYXRpdmUvMy4wL3JlZmVyZW5jZS9jb25uZWN0aW5nL2Nvbm5lY3Rpb24tc2V0dGluZ3MvXG4gKiBAbG9jdXMgU2VydmVyXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBVc2VyIHNwZWNpZmllZCBNb25nbyBjb25uZWN0aW9uIG9wdGlvbnNcbiAqL1xuTW9uZ28uc2V0Q29ubmVjdGlvbk9wdGlvbnMgPSBmdW5jdGlvbiBzZXRDb25uZWN0aW9uT3B0aW9ucyAob3B0aW9ucykge1xuICBjaGVjayhvcHRpb25zLCBPYmplY3QpO1xuICBNb25nby5fY29ubmVjdGlvbk9wdGlvbnMgPSBvcHRpb25zO1xufTsiXX0=
