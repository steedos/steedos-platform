(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var check = Package.check.check;
var Match = Package.check.Match;
var Random = Package.random.Random;
var EJSON = Package.ejson.EJSON;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var Retry = Package.retry.Retry;
var IdMap = Package['id-map'].IdMap;
var ECMAScript = Package.ecmascript.ECMAScript;
var Hook = Package['callback-hook'].Hook;
var DDPCommon = Package['ddp-common'].DDPCommon;
var DiffSequence = Package['diff-sequence'].DiffSequence;
var MongoID = Package['mongo-id'].MongoID;
var meteorInstall = Package.modules.meteorInstall;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var options, DDP;

var require = meteorInstall({"node_modules":{"meteor":{"ddp-client":{"server":{"server.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/ddp-client/server/server.js                                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.link("../common/namespace.js", {
  DDP: "DDP"
}, 0);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"common":{"MethodInvoker.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/ddp-client/common/MethodInvoker.js                                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  default: () => MethodInvoker
});

class MethodInvoker {
  constructor(options) {
    // Public (within this file) fields.
    this.methodId = options.methodId;
    this.sentMessage = false;
    this._callback = options.callback;
    this._connection = options.connection;
    this._message = options.message;

    this._onResultReceived = options.onResultReceived || (() => {});

    this._wait = options.wait;
    this.noRetry = options.noRetry;
    this._methodResult = null;
    this._dataVisible = false; // Register with the connection.

    this._connection._methodInvokers[this.methodId] = this;
  } // Sends the method message to the server. May be called additional times if
  // we lose the connection and reconnect before receiving a result.


  sendMessage() {
    // This function is called before sending a method (including resending on
    // reconnect). We should only (re)send methods where we don't already have a
    // result!
    if (this.gotResult()) throw new Error('sendingMethod is called on method with result'); // If we're re-sending it, it doesn't matter if data was written the first
    // time.

    this._dataVisible = false;
    this.sentMessage = true; // If this is a wait method, make all data messages be buffered until it is
    // done.

    if (this._wait) this._connection._methodsBlockingQuiescence[this.methodId] = true; // Actually send the message.

    this._connection._send(this._message);
  } // Invoke the callback, if we have both a result and know that all data has
  // been written to the local cache.


  _maybeInvokeCallback() {
    if (this._methodResult && this._dataVisible) {
      // Call the callback. (This won't throw: the callback was wrapped with
      // bindEnvironment.)
      this._callback(this._methodResult[0], this._methodResult[1]); // Forget about this method.


      delete this._connection._methodInvokers[this.methodId]; // Let the connection know that this method is finished, so it can try to
      // move on to the next block of methods.

      this._connection._outstandingMethodFinished();
    }
  } // Call with the result of the method from the server. Only may be called
  // once; once it is called, you should not call sendMessage again.
  // If the user provided an onResultReceived callback, call it immediately.
  // Then invoke the main callback if data is also visible.


  receiveResult(err, result) {
    if (this.gotResult()) throw new Error('Methods should only receive results once');
    this._methodResult = [err, result];

    this._onResultReceived(err, result);

    this._maybeInvokeCallback();
  } // Call this when all data written by the method is visible. This means that
  // the method has returns its "data is done" message *AND* all server
  // documents that are buffered at that time have been written to the local
  // cache. Invokes the main callback if the result has been received.


  dataVisible() {
    this._dataVisible = true;

    this._maybeInvokeCallback();
  } // True if receiveResult has been called.


  gotResult() {
    return !!this._methodResult;
  }

}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"livedata_connection.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/ddp-client/common/livedata_connection.js                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let _objectSpread;

module.link("@babel/runtime/helpers/objectSpread2", {
  default(v) {
    _objectSpread = v;
  }

}, 0);
module.export({
  Connection: () => Connection
});
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let DDPCommon;
module.link("meteor/ddp-common", {
  DDPCommon(v) {
    DDPCommon = v;
  }

}, 1);
let Tracker;
module.link("meteor/tracker", {
  Tracker(v) {
    Tracker = v;
  }

}, 2);
let EJSON;
module.link("meteor/ejson", {
  EJSON(v) {
    EJSON = v;
  }

}, 3);
let Random;
module.link("meteor/random", {
  Random(v) {
    Random = v;
  }

}, 4);
let Hook;
module.link("meteor/callback-hook", {
  Hook(v) {
    Hook = v;
  }

}, 5);
let MongoID;
module.link("meteor/mongo-id", {
  MongoID(v) {
    MongoID = v;
  }

}, 6);
let DDP;
module.link("./namespace.js", {
  DDP(v) {
    DDP = v;
  }

}, 7);
let MethodInvoker;
module.link("./MethodInvoker.js", {
  default(v) {
    MethodInvoker = v;
  }

}, 8);
let hasOwn, slice, keys, isEmpty, last;
module.link("meteor/ddp-common/utils.js", {
  hasOwn(v) {
    hasOwn = v;
  },

  slice(v) {
    slice = v;
  },

  keys(v) {
    keys = v;
  },

  isEmpty(v) {
    isEmpty = v;
  },

  last(v) {
    last = v;
  }

}, 9);

if (Meteor.isServer) {
  var Fiber = Npm.require('fibers');

  var Future = Npm.require('fibers/future');
}

class MongoIDMap extends IdMap {
  constructor() {
    super(MongoID.idStringify, MongoID.idParse);
  }

} // @param url {String|Object} URL to Meteor app,
//   or an object as a test hook (see code)
// Options:
//   reloadWithOutstanding: is it OK to reload if there are outstanding methods?
//   headers: extra headers to send on the websockets connection, for
//     server-to-server DDP only
//   _sockjsOptions: Specifies options to pass through to the sockjs client
//   onDDPNegotiationVersionFailure: callback when version negotiation fails.
//
// XXX There should be a way to destroy a DDP connection, causing all
// outstanding method calls to fail.
//
// XXX Our current way of handling failure and reconnection is great
// for an app (where we want to tolerate being disconnected as an
// expect state, and keep trying forever to reconnect) but cumbersome
// for something like a command line tool that wants to make a
// connection, call a method, and print an error if connection
// fails. We should have better usability in the latter case (while
// still transparently reconnecting if it's just a transient failure
// or the server migrating us).


class Connection {
  constructor(url, options) {
    var self = this;
    this.options = options = _objectSpread({
      onConnected() {},

      onDDPVersionNegotiationFailure(description) {
        Meteor._debug(description);
      },

      heartbeatInterval: 17500,
      heartbeatTimeout: 15000,
      npmFayeOptions: Object.create(null),
      // These options are only for testing.
      reloadWithOutstanding: false,
      supportedDDPVersions: DDPCommon.SUPPORTED_DDP_VERSIONS,
      retry: true,
      respondToPings: true,
      // When updates are coming within this ms interval, batch them together.
      bufferedWritesInterval: 5,
      // Flush buffers immediately if writes are happening continuously for more than this many ms.
      bufferedWritesMaxAge: 500
    }, options); // If set, called when we reconnect, queuing method calls _before_ the
    // existing outstanding ones.
    // NOTE: This feature has been preserved for backwards compatibility. The
    // preferred method of setting a callback on reconnect is to use
    // DDP.onReconnect.

    self.onReconnect = null; // as a test hook, allow passing a stream instead of a url.

    if (typeof url === 'object') {
      self._stream = url;
    } else {
      const {
        ClientStream
      } = require("meteor/socket-stream-client");

      self._stream = new ClientStream(url, {
        retry: options.retry,
        ConnectionError: DDP.ConnectionError,
        headers: options.headers,
        _sockjsOptions: options._sockjsOptions,
        // Used to keep some tests quiet, or for other cases in which
        // the right thing to do with connection errors is to silently
        // fail (e.g. sending package usage stats). At some point we
        // should have a real API for handling client-stream-level
        // errors.
        _dontPrintErrors: options._dontPrintErrors,
        connectTimeoutMs: options.connectTimeoutMs,
        npmFayeOptions: options.npmFayeOptions
      });
    }

    self._lastSessionId = null;
    self._versionSuggestion = null; // The last proposed DDP version.

    self._version = null; // The DDP version agreed on by client and server.

    self._stores = Object.create(null); // name -> object with methods

    self._methodHandlers = Object.create(null); // name -> func

    self._nextMethodId = 1;
    self._supportedDDPVersions = options.supportedDDPVersions;
    self._heartbeatInterval = options.heartbeatInterval;
    self._heartbeatTimeout = options.heartbeatTimeout; // Tracks methods which the user has tried to call but which have not yet
    // called their user callback (ie, they are waiting on their result or for all
    // of their writes to be written to the local cache). Map from method ID to
    // MethodInvoker object.

    self._methodInvokers = Object.create(null); // Tracks methods which the user has called but whose result messages have not
    // arrived yet.
    //
    // _outstandingMethodBlocks is an array of blocks of methods. Each block
    // represents a set of methods that can run at the same time. The first block
    // represents the methods which are currently in flight; subsequent blocks
    // must wait for previous blocks to be fully finished before they can be sent
    // to the server.
    //
    // Each block is an object with the following fields:
    // - methods: a list of MethodInvoker objects
    // - wait: a boolean; if true, this block had a single method invoked with
    //         the "wait" option
    //
    // There will never be adjacent blocks with wait=false, because the only thing
    // that makes methods need to be serialized is a wait method.
    //
    // Methods are removed from the first block when their "result" is
    // received. The entire first block is only removed when all of the in-flight
    // methods have received their results (so the "methods" list is empty) *AND*
    // all of the data written by those methods are visible in the local cache. So
    // it is possible for the first block's methods list to be empty, if we are
    // still waiting for some objects to quiesce.
    //
    // Example:
    //  _outstandingMethodBlocks = [
    //    {wait: false, methods: []},
    //    {wait: true, methods: [<MethodInvoker for 'login'>]},
    //    {wait: false, methods: [<MethodInvoker for 'foo'>,
    //                            <MethodInvoker for 'bar'>]}]
    // This means that there were some methods which were sent to the server and
    // which have returned their results, but some of the data written by
    // the methods may not be visible in the local cache. Once all that data is
    // visible, we will send a 'login' method. Once the login method has returned
    // and all the data is visible (including re-running subs if userId changes),
    // we will send the 'foo' and 'bar' methods in parallel.

    self._outstandingMethodBlocks = []; // method ID -> array of objects with keys 'collection' and 'id', listing
    // documents written by a given method's stub. keys are associated with
    // methods whose stub wrote at least one document, and whose data-done message
    // has not yet been received.

    self._documentsWrittenByStub = Object.create(null); // collection -> IdMap of "server document" object. A "server document" has:
    // - "document": the version of the document according the
    //   server (ie, the snapshot before a stub wrote it, amended by any changes
    //   received from the server)
    //   It is undefined if we think the document does not exist
    // - "writtenByStubs": a set of method IDs whose stubs wrote to the document
    //   whose "data done" messages have not yet been processed

    self._serverDocuments = Object.create(null); // Array of callbacks to be called after the next update of the local
    // cache. Used for:
    //  - Calling methodInvoker.dataVisible and sub ready callbacks after
    //    the relevant data is flushed.
    //  - Invoking the callbacks of "half-finished" methods after reconnect
    //    quiescence. Specifically, methods whose result was received over the old
    //    connection (so we don't re-send it) but whose data had not been made
    //    visible.

    self._afterUpdateCallbacks = []; // In two contexts, we buffer all incoming data messages and then process them
    // all at once in a single update:
    //   - During reconnect, we buffer all data messages until all subs that had
    //     been ready before reconnect are ready again, and all methods that are
    //     active have returned their "data done message"; then
    //   - During the execution of a "wait" method, we buffer all data messages
    //     until the wait method gets its "data done" message. (If the wait method
    //     occurs during reconnect, it doesn't get any special handling.)
    // all data messages are processed in one update.
    //
    // The following fields are used for this "quiescence" process.
    // This buffers the messages that aren't being processed yet.

    self._messagesBufferedUntilQuiescence = []; // Map from method ID -> true. Methods are removed from this when their
    // "data done" message is received, and we will not quiesce until it is
    // empty.

    self._methodsBlockingQuiescence = Object.create(null); // map from sub ID -> true for subs that were ready (ie, called the sub
    // ready callback) before reconnect but haven't become ready again yet

    self._subsBeingRevived = Object.create(null); // map from sub._id -> true
    // if true, the next data update should reset all stores. (set during
    // reconnect.)

    self._resetStores = false; // name -> array of updates for (yet to be created) collections

    self._updatesForUnknownStores = Object.create(null); // if we're blocking a migration, the retry func

    self._retryMigrate = null;
    self.__flushBufferedWrites = Meteor.bindEnvironment(self._flushBufferedWrites, 'flushing DDP buffered writes', self); // Collection name -> array of messages.

    self._bufferedWrites = Object.create(null); // When current buffer of updates must be flushed at, in ms timestamp.

    self._bufferedWritesFlushAt = null; // Timeout handle for the next processing of all pending writes

    self._bufferedWritesFlushHandle = null;
    self._bufferedWritesInterval = options.bufferedWritesInterval;
    self._bufferedWritesMaxAge = options.bufferedWritesMaxAge; // metadata for subscriptions.  Map from sub ID to object with keys:
    //   - id
    //   - name
    //   - params
    //   - inactive (if true, will be cleaned up if not reused in re-run)
    //   - ready (has the 'ready' message been received?)
    //   - readyCallback (an optional callback to call when ready)
    //   - errorCallback (an optional callback to call if the sub terminates with
    //                    an error, XXX COMPAT WITH 1.0.3.1)
    //   - stopCallback (an optional callback to call when the sub terminates
    //     for any reason, with an error argument if an error triggered the stop)

    self._subscriptions = Object.create(null); // Reactive userId.

    self._userId = null;
    self._userIdDeps = new Tracker.Dependency(); // Block auto-reload while we're waiting for method responses.

    if (Meteor.isClient && Package.reload && !options.reloadWithOutstanding) {
      Package.reload.Reload._onMigrate(retry => {
        if (!self._readyToMigrate()) {
          if (self._retryMigrate) throw new Error('Two migrations in progress?');
          self._retryMigrate = retry;
          return false;
        } else {
          return [true];
        }
      });
    }

    var onDisconnect = () => {
      if (self._heartbeat) {
        self._heartbeat.stop();

        self._heartbeat = null;
      }
    };

    if (Meteor.isServer) {
      self._stream.on('message', Meteor.bindEnvironment(this.onMessage.bind(this), 'handling DDP message'));

      self._stream.on('reset', Meteor.bindEnvironment(this.onReset.bind(this), 'handling DDP reset'));

      self._stream.on('disconnect', Meteor.bindEnvironment(onDisconnect, 'handling DDP disconnect'));
    } else {
      self._stream.on('message', this.onMessage.bind(this));

      self._stream.on('reset', this.onReset.bind(this));

      self._stream.on('disconnect', onDisconnect);
    }
  } // 'name' is the name of the data on the wire that should go in the
  // store. 'wrappedStore' should be an object with methods beginUpdate, update,
  // endUpdate, saveOriginals, retrieveOriginals. see Collection for an example.


  registerStore(name, wrappedStore) {
    var self = this;
    if (name in self._stores) return false; // Wrap the input object in an object which makes any store method not
    // implemented by 'store' into a no-op.

    var store = Object.create(null);
    ['update', 'beginUpdate', 'endUpdate', 'saveOriginals', 'retrieveOriginals', 'getDoc', '_getCollection'].forEach(method => {
      store[method] = function () {
        if (wrappedStore[method]) {
          return wrappedStore[method](...arguments);
        }
      };
    });
    self._stores[name] = store;
    var queued = self._updatesForUnknownStores[name];

    if (queued) {
      store.beginUpdate(queued.length, false);
      queued.forEach(msg => {
        store.update(msg);
      });
      store.endUpdate();
      delete self._updatesForUnknownStores[name];
    }

    return true;
  }
  /**
   * @memberOf Meteor
   * @importFromPackage meteor
   * @alias Meteor.subscribe
   * @summary Subscribe to a record set.  Returns a handle that provides
   * `stop()` and `ready()` methods.
   * @locus Client
   * @param {String} name Name of the subscription.  Matches the name of the
   * server's `publish()` call.
   * @param {EJSONable} [arg1,arg2...] Optional arguments passed to publisher
   * function on server.
   * @param {Function|Object} [callbacks] Optional. May include `onStop`
   * and `onReady` callbacks. If there is an error, it is passed as an
   * argument to `onStop`. If a function is passed instead of an object, it
   * is interpreted as an `onReady` callback.
   */


  subscribe(name
  /* .. [arguments] .. (callback|callbacks) */
  ) {
    var self = this;
    var params = slice.call(arguments, 1);
    var callbacks = Object.create(null);

    if (params.length) {
      var lastParam = params[params.length - 1];

      if (typeof lastParam === 'function') {
        callbacks.onReady = params.pop();
      } else if (lastParam && [lastParam.onReady, // XXX COMPAT WITH 1.0.3.1 onError used to exist, but now we use
      // onStop with an error callback instead.
      lastParam.onError, lastParam.onStop].some(f => typeof f === "function")) {
        callbacks = params.pop();
      }
    } // Is there an existing sub with the same name and param, run in an
    // invalidated Computation? This will happen if we are rerunning an
    // existing computation.
    //
    // For example, consider a rerun of:
    //
    //     Tracker.autorun(function () {
    //       Meteor.subscribe("foo", Session.get("foo"));
    //       Meteor.subscribe("bar", Session.get("bar"));
    //     });
    //
    // If "foo" has changed but "bar" has not, we will match the "bar"
    // subcribe to an existing inactive subscription in order to not
    // unsub and resub the subscription unnecessarily.
    //
    // We only look for one such sub; if there are N apparently-identical subs
    // being invalidated, we will require N matching subscribe calls to keep
    // them all active.


    var existing;
    keys(self._subscriptions).some(id => {
      const sub = self._subscriptions[id];

      if (sub.inactive && sub.name === name && EJSON.equals(sub.params, params)) {
        return existing = sub;
      }
    });
    var id;

    if (existing) {
      id = existing.id;
      existing.inactive = false; // reactivate

      if (callbacks.onReady) {
        // If the sub is not already ready, replace any ready callback with the
        // one provided now. (It's not really clear what users would expect for
        // an onReady callback inside an autorun; the semantics we provide is
        // that at the time the sub first becomes ready, we call the last
        // onReady callback provided, if any.)
        // If the sub is already ready, run the ready callback right away.
        // It seems that users would expect an onReady callback inside an
        // autorun to trigger once the the sub first becomes ready and also
        // when re-subs happens.
        if (existing.ready) {
          callbacks.onReady();
        } else {
          existing.readyCallback = callbacks.onReady;
        }
      } // XXX COMPAT WITH 1.0.3.1 we used to have onError but now we call
      // onStop with an optional error argument


      if (callbacks.onError) {
        // Replace existing callback if any, so that errors aren't
        // double-reported.
        existing.errorCallback = callbacks.onError;
      }

      if (callbacks.onStop) {
        existing.stopCallback = callbacks.onStop;
      }
    } else {
      // New sub! Generate an id, save it locally, and send message.
      id = Random.id();
      self._subscriptions[id] = {
        id: id,
        name: name,
        params: EJSON.clone(params),
        inactive: false,
        ready: false,
        readyDeps: new Tracker.Dependency(),
        readyCallback: callbacks.onReady,
        // XXX COMPAT WITH 1.0.3.1 #errorCallback
        errorCallback: callbacks.onError,
        stopCallback: callbacks.onStop,
        connection: self,

        remove() {
          delete this.connection._subscriptions[this.id];
          this.ready && this.readyDeps.changed();
        },

        stop() {
          this.connection._send({
            msg: 'unsub',
            id: id
          });

          this.remove();

          if (callbacks.onStop) {
            callbacks.onStop();
          }
        }

      };

      self._send({
        msg: 'sub',
        id: id,
        name: name,
        params: params
      });
    } // return a handle to the application.


    var handle = {
      stop() {
        if (!hasOwn.call(self._subscriptions, id)) {
          return;
        }

        self._subscriptions[id].stop();
      },

      ready() {
        // return false if we've unsubscribed.
        if (!hasOwn.call(self._subscriptions, id)) {
          return false;
        }

        var record = self._subscriptions[id];
        record.readyDeps.depend();
        return record.ready;
      },

      subscriptionId: id
    };

    if (Tracker.active) {
      // We're in a reactive computation, so we'd like to unsubscribe when the
      // computation is invalidated... but not if the rerun just re-subscribes
      // to the same subscription!  When a rerun happens, we use onInvalidate
      // as a change to mark the subscription "inactive" so that it can
      // be reused from the rerun.  If it isn't reused, it's killed from
      // an afterFlush.
      Tracker.onInvalidate(c => {
        if (hasOwn.call(self._subscriptions, id)) {
          self._subscriptions[id].inactive = true;
        }

        Tracker.afterFlush(() => {
          if (hasOwn.call(self._subscriptions, id) && self._subscriptions[id].inactive) {
            handle.stop();
          }
        });
      });
    }

    return handle;
  } // options:
  // - onLateError {Function(error)} called if an error was received after the ready event.
  //     (errors received before ready cause an error to be thrown)


  _subscribeAndWait(name, args, options) {
    var self = this;
    var f = new Future();
    var ready = false;
    var handle;
    args = args || [];
    args.push({
      onReady() {
        ready = true;
        f['return']();
      },

      onError(e) {
        if (!ready) f['throw'](e);else options && options.onLateError && options.onLateError(e);
      }

    });
    handle = self.subscribe.apply(self, [name].concat(args));
    f.wait();
    return handle;
  }

  methods(methods) {
    keys(methods).forEach(name => {
      const func = methods[name];

      if (typeof func !== 'function') {
        throw new Error("Method '" + name + "' must be a function");
      }

      if (this._methodHandlers[name]) {
        throw new Error("A method named '" + name + "' is already defined");
      }

      this._methodHandlers[name] = func;
    });
  }
  /**
   * @memberOf Meteor
   * @importFromPackage meteor
   * @alias Meteor.call
   * @summary Invokes a method passing any number of arguments.
   * @locus Anywhere
   * @param {String} name Name of method to invoke
   * @param {EJSONable} [arg1,arg2...] Optional method arguments
   * @param {Function} [asyncCallback] Optional callback, which is called asynchronously with the error or result after the method is complete. If not provided, the method runs synchronously if possible (see below).
   */


  call(name
  /* .. [arguments] .. callback */
  ) {
    // if it's a function, the last argument is the result callback,
    // not a parameter to the remote method.
    var args = slice.call(arguments, 1);
    if (args.length && typeof args[args.length - 1] === 'function') var callback = args.pop();
    return this.apply(name, args, callback);
  }
  /**
   * @memberOf Meteor
   * @importFromPackage meteor
   * @alias Meteor.apply
   * @summary Invoke a method passing an array of arguments.
   * @locus Anywhere
   * @param {String} name Name of method to invoke
   * @param {EJSONable[]} args Method arguments
   * @param {Object} [options]
   * @param {Boolean} options.wait (Client only) If true, don't send this method until all previous method calls have completed, and don't send any subsequent method calls until this one is completed.
   * @param {Function} options.onResultReceived (Client only) This callback is invoked with the error or result of the method (just like `asyncCallback`) as soon as the error or result is available. The local cache may not yet reflect the writes performed by the method.
   * @param {Boolean} options.noRetry (Client only) if true, don't send this method again on reload, simply call the callback an error with the error code 'invocation-failed'.
   * @param {Boolean} options.throwStubExceptions (Client only) If true, exceptions thrown by method stubs will be thrown instead of logged, and the method will not be invoked on the server.
   * @param {Boolean} options.returnStubValue (Client only) If true then in cases where we would have otherwise discarded the stub's return value and returned undefined, instead we go ahead and return it. Specifically, this is any time other than when (a) we are already inside a stub or (b) we are in Node and no callback was provided. Currently we require this flag to be explicitly passed to reduce the likelihood that stub return values will be confused with server return values; we may improve this in future.
   * @param {Function} [asyncCallback] Optional callback; same semantics as in [`Meteor.call`](#meteor_call).
   */


  apply(name, args, options, callback) {
    var self = this; // We were passed 3 arguments. They may be either (name, args, options)
    // or (name, args, callback)

    if (!callback && typeof options === 'function') {
      callback = options;
      options = Object.create(null);
    }

    options = options || Object.create(null);

    if (callback) {
      // XXX would it be better form to do the binding in stream.on,
      // or caller, instead of here?
      // XXX improve error message (and how we report it)
      callback = Meteor.bindEnvironment(callback, "delivering result of invoking '" + name + "'");
    } // Keep our args safe from mutation (eg if we don't send the message for a
    // while because of a wait method).


    args = EJSON.clone(args);

    var enclosing = DDP._CurrentMethodInvocation.get();

    var alreadyInSimulation = enclosing && enclosing.isSimulation; // Lazily generate a randomSeed, only if it is requested by the stub.
    // The random streams only have utility if they're used on both the client
    // and the server; if the client doesn't generate any 'random' values
    // then we don't expect the server to generate any either.
    // Less commonly, the server may perform different actions from the client,
    // and may in fact generate values where the client did not, but we don't
    // have any client-side values to match, so even here we may as well just
    // use a random seed on the server.  In that case, we don't pass the
    // randomSeed to save bandwidth, and we don't even generate it to save a
    // bit of CPU and to avoid consuming entropy.

    var randomSeed = null;

    var randomSeedGenerator = () => {
      if (randomSeed === null) {
        randomSeed = DDPCommon.makeRpcSeed(enclosing, name);
      }

      return randomSeed;
    }; // Run the stub, if we have one. The stub is supposed to make some
    // temporary writes to the database to give the user a smooth experience
    // until the actual result of executing the method comes back from the
    // server (whereupon the temporary writes to the database will be reversed
    // during the beginUpdate/endUpdate process.)
    //
    // Normally, we ignore the return value of the stub (even if it is an
    // exception), in favor of the real return value from the server. The
    // exception is if the *caller* is a stub. In that case, we're not going
    // to do a RPC, so we use the return value of the stub as our return
    // value.


    var stub = self._methodHandlers[name];

    if (stub) {
      var setUserId = userId => {
        self.setUserId(userId);
      };

      var invocation = new DDPCommon.MethodInvocation({
        isSimulation: true,
        userId: self.userId(),
        setUserId: setUserId,

        randomSeed() {
          return randomSeedGenerator();
        }

      });
      if (!alreadyInSimulation) self._saveOriginals();

      try {
        // Note that unlike in the corresponding server code, we never audit
        // that stubs check() their arguments.
        var stubReturnValue = DDP._CurrentMethodInvocation.withValue(invocation, () => {
          if (Meteor.isServer) {
            // Because saveOriginals and retrieveOriginals aren't reentrant,
            // don't allow stubs to yield.
            return Meteor._noYieldsAllowed(() => {
              // re-clone, so that the stub can't affect our caller's values
              return stub.apply(invocation, EJSON.clone(args));
            });
          } else {
            return stub.apply(invocation, EJSON.clone(args));
          }
        });
      } catch (e) {
        var exception = e;
      }
    } // If we're in a simulation, stop and return the result we have,
    // rather than going on to do an RPC. If there was no stub,
    // we'll end up returning undefined.


    if (alreadyInSimulation) {
      if (callback) {
        callback(exception, stubReturnValue);
        return undefined;
      }

      if (exception) throw exception;
      return stubReturnValue;
    } // We only create the methodId here because we don't actually need one if
    // we're already in a simulation


    const methodId = '' + self._nextMethodId++;

    if (stub) {
      self._retrieveAndStoreOriginals(methodId);
    } // Generate the DDP message for the method call. Note that on the client,
    // it is important that the stub have finished before we send the RPC, so
    // that we know we have a complete list of which local documents the stub
    // wrote.


    var message = {
      msg: 'method',
      method: name,
      params: args,
      id: methodId
    }; // If an exception occurred in a stub, and we're ignoring it
    // because we're doing an RPC and want to use what the server
    // returns instead, log it so the developer knows
    // (unless they explicitly ask to see the error).
    //
    // Tests can set the '_expectedByTest' flag on an exception so it won't
    // go to log.

    if (exception) {
      if (options.throwStubExceptions) {
        throw exception;
      } else if (!exception._expectedByTest) {
        Meteor._debug("Exception while simulating the effect of invoking '" + name + "'", exception);
      }
    } // At this point we're definitely doing an RPC, and we're going to
    // return the value of the RPC to the caller.
    // If the caller didn't give a callback, decide what to do.


    if (!callback) {
      if (Meteor.isClient) {
        // On the client, we don't have fibers, so we can't block. The
        // only thing we can do is to return undefined and discard the
        // result of the RPC. If an error occurred then print the error
        // to the console.
        callback = err => {
          err && Meteor._debug("Error invoking Method '" + name + "'", err);
        };
      } else {
        // On the server, make the function synchronous. Throw on
        // errors, return on success.
        var future = new Future();
        callback = future.resolver();
      }
    } // Send the randomSeed only if we used it


    if (randomSeed !== null) {
      message.randomSeed = randomSeed;
    }

    var methodInvoker = new MethodInvoker({
      methodId,
      callback: callback,
      connection: self,
      onResultReceived: options.onResultReceived,
      wait: !!options.wait,
      message: message,
      noRetry: !!options.noRetry
    });

    if (options.wait) {
      // It's a wait method! Wait methods go in their own block.
      self._outstandingMethodBlocks.push({
        wait: true,
        methods: [methodInvoker]
      });
    } else {
      // Not a wait method. Start a new block if the previous block was a wait
      // block, and add it to the last block of methods.
      if (isEmpty(self._outstandingMethodBlocks) || last(self._outstandingMethodBlocks).wait) {
        self._outstandingMethodBlocks.push({
          wait: false,
          methods: []
        });
      }

      last(self._outstandingMethodBlocks).methods.push(methodInvoker);
    } // If we added it to the first block, send it out now.


    if (self._outstandingMethodBlocks.length === 1) methodInvoker.sendMessage(); // If we're using the default callback on the server,
    // block waiting for the result.

    if (future) {
      return future.wait();
    }

    return options.returnStubValue ? stubReturnValue : undefined;
  } // Before calling a method stub, prepare all stores to track changes and allow
  // _retrieveAndStoreOriginals to get the original versions of changed
  // documents.


  _saveOriginals() {
    if (!this._waitingForQuiescence()) {
      this._flushBufferedWrites();
    }

    keys(this._stores).forEach(storeName => {
      this._stores[storeName].saveOriginals();
    });
  } // Retrieves the original versions of all documents modified by the stub for
  // method 'methodId' from all stores and saves them to _serverDocuments (keyed
  // by document) and _documentsWrittenByStub (keyed by method ID).


  _retrieveAndStoreOriginals(methodId) {
    var self = this;
    if (self._documentsWrittenByStub[methodId]) throw new Error('Duplicate methodId in _retrieveAndStoreOriginals');
    var docsWritten = [];
    keys(self._stores).forEach(collection => {
      var originals = self._stores[collection].retrieveOriginals(); // not all stores define retrieveOriginals


      if (!originals) return;
      originals.forEach((doc, id) => {
        docsWritten.push({
          collection,
          id
        });

        if (!hasOwn.call(self._serverDocuments, collection)) {
          self._serverDocuments[collection] = new MongoIDMap();
        }

        var serverDoc = self._serverDocuments[collection].setDefault(id, Object.create(null));

        if (serverDoc.writtenByStubs) {
          // We're not the first stub to write this doc. Just add our method ID
          // to the record.
          serverDoc.writtenByStubs[methodId] = true;
        } else {
          // First stub! Save the original value and our method ID.
          serverDoc.document = doc;
          serverDoc.flushCallbacks = [];
          serverDoc.writtenByStubs = Object.create(null);
          serverDoc.writtenByStubs[methodId] = true;
        }
      });
    });

    if (!isEmpty(docsWritten)) {
      self._documentsWrittenByStub[methodId] = docsWritten;
    }
  } // This is very much a private function we use to make the tests
  // take up fewer server resources after they complete.


  _unsubscribeAll() {
    keys(this._subscriptions).forEach(id => {
      const sub = this._subscriptions[id]; // Avoid killing the autoupdate subscription so that developers
      // still get hot code pushes when writing tests.
      //
      // XXX it's a hack to encode knowledge about autoupdate here,
      // but it doesn't seem worth it yet to have a special API for
      // subscriptions to preserve after unit tests.

      if (sub.name !== 'meteor_autoupdate_clientVersions') {
        sub.stop();
      }
    });
  } // Sends the DDP stringification of the given message object


  _send(obj) {
    this._stream.send(DDPCommon.stringifyDDP(obj));
  } // We detected via DDP-level heartbeats that we've lost the
  // connection.  Unlike `disconnect` or `close`, a lost connection
  // will be automatically retried.


  _lostConnection(error) {
    this._stream._lostConnection(error);
  }
  /**
   * @memberOf Meteor
   * @importFromPackage meteor
   * @alias Meteor.status
   * @summary Get the current connection status. A reactive data source.
   * @locus Client
   */


  status() {
    return this._stream.status(...arguments);
  }
  /**
   * @summary Force an immediate reconnection attempt if the client is not connected to the server.
   This method does nothing if the client is already connected.
   * @memberOf Meteor
   * @importFromPackage meteor
   * @alias Meteor.reconnect
   * @locus Client
   */


  reconnect() {
    return this._stream.reconnect(...arguments);
  }
  /**
   * @memberOf Meteor
   * @importFromPackage meteor
   * @alias Meteor.disconnect
   * @summary Disconnect the client from the server.
   * @locus Client
   */


  disconnect() {
    return this._stream.disconnect(...arguments);
  }

  close() {
    return this._stream.disconnect({
      _permanent: true
    });
  } ///
  /// Reactive user system
  ///


  userId() {
    if (this._userIdDeps) this._userIdDeps.depend();
    return this._userId;
  }

  setUserId(userId) {
    // Avoid invalidating dependents if setUserId is called with current value.
    if (this._userId === userId) return;
    this._userId = userId;
    if (this._userIdDeps) this._userIdDeps.changed();
  } // Returns true if we are in a state after reconnect of waiting for subs to be
  // revived or early methods to finish their data, or we are waiting for a
  // "wait" method to finish.


  _waitingForQuiescence() {
    return !isEmpty(this._subsBeingRevived) || !isEmpty(this._methodsBlockingQuiescence);
  } // Returns true if any method whose message has been sent to the server has
  // not yet invoked its user callback.


  _anyMethodsAreOutstanding() {
    const invokers = this._methodInvokers;
    return keys(invokers).some(id => {
      return invokers[id].sentMessage;
    });
  }

  _livedata_connected(msg) {
    var self = this;

    if (self._version !== 'pre1' && self._heartbeatInterval !== 0) {
      self._heartbeat = new DDPCommon.Heartbeat({
        heartbeatInterval: self._heartbeatInterval,
        heartbeatTimeout: self._heartbeatTimeout,

        onTimeout() {
          self._lostConnection(new DDP.ConnectionError('DDP heartbeat timed out'));
        },

        sendPing() {
          self._send({
            msg: 'ping'
          });
        }

      });

      self._heartbeat.start();
    } // If this is a reconnect, we'll have to reset all stores.


    if (self._lastSessionId) self._resetStores = true;

    if (typeof msg.session === 'string') {
      var reconnectedToPreviousSession = self._lastSessionId === msg.session;
      self._lastSessionId = msg.session;
    }

    if (reconnectedToPreviousSession) {
      // Successful reconnection -- pick up where we left off.  Note that right
      // now, this never happens: the server never connects us to a previous
      // session, because DDP doesn't provide enough data for the server to know
      // what messages the client has processed. We need to improve DDP to make
      // this possible, at which point we'll probably need more code here.
      return;
    } // Server doesn't have our data any more. Re-sync a new session.
    // Forget about messages we were buffering for unknown collections. They'll
    // be resent if still relevant.


    self._updatesForUnknownStores = Object.create(null);

    if (self._resetStores) {
      // Forget about the effects of stubs. We'll be resetting all collections
      // anyway.
      self._documentsWrittenByStub = Object.create(null);
      self._serverDocuments = Object.create(null);
    } // Clear _afterUpdateCallbacks.


    self._afterUpdateCallbacks = []; // Mark all named subscriptions which are ready (ie, we already called the
    // ready callback) as needing to be revived.
    // XXX We should also block reconnect quiescence until unnamed subscriptions
    //     (eg, autopublish) are done re-publishing to avoid flicker!

    self._subsBeingRevived = Object.create(null);
    keys(self._subscriptions).forEach(id => {
      if (self._subscriptions[id].ready) {
        self._subsBeingRevived[id] = true;
      }
    }); // Arrange for "half-finished" methods to have their callbacks run, and
    // track methods that were sent on this connection so that we don't
    // quiesce until they are all done.
    //
    // Start by clearing _methodsBlockingQuiescence: methods sent before
    // reconnect don't matter, and any "wait" methods sent on the new connection
    // that we drop here will be restored by the loop below.

    self._methodsBlockingQuiescence = Object.create(null);

    if (self._resetStores) {
      const invokers = self._methodInvokers;
      keys(invokers).forEach(id => {
        const invoker = invokers[id];

        if (invoker.gotResult()) {
          // This method already got its result, but it didn't call its callback
          // because its data didn't become visible. We did not resend the
          // method RPC. We'll call its callback when we get a full quiesce,
          // since that's as close as we'll get to "data must be visible".
          self._afterUpdateCallbacks.push(function () {
            return invoker.dataVisible(...arguments);
          });
        } else if (invoker.sentMessage) {
          // This method has been sent on this connection (maybe as a resend
          // from the last connection, maybe from onReconnect, maybe just very
          // quickly before processing the connected message).
          //
          // We don't need to do anything special to ensure its callbacks get
          // called, but we'll count it as a method which is preventing
          // reconnect quiescence. (eg, it might be a login method that was run
          // from onReconnect, and we don't want to see flicker by seeing a
          // logged-out state.)
          self._methodsBlockingQuiescence[invoker.methodId] = true;
        }
      });
    }

    self._messagesBufferedUntilQuiescence = []; // If we're not waiting on any methods or subs, we can reset the stores and
    // call the callbacks immediately.

    if (!self._waitingForQuiescence()) {
      if (self._resetStores) {
        keys(self._stores).forEach(storeName => {
          const s = self._stores[storeName];
          s.beginUpdate(0, true);
          s.endUpdate();
        });
        self._resetStores = false;
      }

      self._runAfterUpdateCallbacks();
    }
  }

  _processOneDataMessage(msg, updates) {
    const messageType = msg.msg; // msg is one of ['added', 'changed', 'removed', 'ready', 'updated']

    if (messageType === 'added') {
      this._process_added(msg, updates);
    } else if (messageType === 'changed') {
      this._process_changed(msg, updates);
    } else if (messageType === 'removed') {
      this._process_removed(msg, updates);
    } else if (messageType === 'ready') {
      this._process_ready(msg, updates);
    } else if (messageType === 'updated') {
      this._process_updated(msg, updates);
    } else if (messageType === 'nosub') {// ignore this
    } else {
      Meteor._debug('discarding unknown livedata data message type', msg);
    }
  }

  _livedata_data(msg) {
    var self = this;

    if (self._waitingForQuiescence()) {
      self._messagesBufferedUntilQuiescence.push(msg);

      if (msg.msg === 'nosub') {
        delete self._subsBeingRevived[msg.id];
      }

      if (msg.subs) {
        msg.subs.forEach(subId => {
          delete self._subsBeingRevived[subId];
        });
      }

      if (msg.methods) {
        msg.methods.forEach(methodId => {
          delete self._methodsBlockingQuiescence[methodId];
        });
      }

      if (self._waitingForQuiescence()) {
        return;
      } // No methods or subs are blocking quiescence!
      // We'll now process and all of our buffered messages, reset all stores,
      // and apply them all at once.


      const bufferedMessages = self._messagesBufferedUntilQuiescence;
      keys(bufferedMessages).forEach(id => {
        self._processOneDataMessage(bufferedMessages[id], self._bufferedWrites);
      });
      self._messagesBufferedUntilQuiescence = [];
    } else {
      self._processOneDataMessage(msg, self._bufferedWrites);
    } // Immediately flush writes when:
    //  1. Buffering is disabled. Or;
    //  2. any non-(added/changed/removed) message arrives.


    var standardWrite = msg.msg === "added" || msg.msg === "changed" || msg.msg === "removed";

    if (self._bufferedWritesInterval === 0 || !standardWrite) {
      self._flushBufferedWrites();

      return;
    }

    if (self._bufferedWritesFlushAt === null) {
      self._bufferedWritesFlushAt = new Date().valueOf() + self._bufferedWritesMaxAge;
    } else if (self._bufferedWritesFlushAt < new Date().valueOf()) {
      self._flushBufferedWrites();

      return;
    }

    if (self._bufferedWritesFlushHandle) {
      clearTimeout(self._bufferedWritesFlushHandle);
    }

    self._bufferedWritesFlushHandle = setTimeout(self.__flushBufferedWrites, self._bufferedWritesInterval);
  }

  _flushBufferedWrites() {
    var self = this;

    if (self._bufferedWritesFlushHandle) {
      clearTimeout(self._bufferedWritesFlushHandle);
      self._bufferedWritesFlushHandle = null;
    }

    self._bufferedWritesFlushAt = null; // We need to clear the buffer before passing it to
    //  performWrites. As there's no guarantee that it
    //  will exit cleanly.

    var writes = self._bufferedWrites;
    self._bufferedWrites = Object.create(null);

    self._performWrites(writes);
  }

  _performWrites(updates) {
    var self = this;

    if (self._resetStores || !isEmpty(updates)) {
      // Begin a transactional update of each store.
      keys(self._stores).forEach(storeName => {
        self._stores[storeName].beginUpdate(hasOwn.call(updates, storeName) ? updates[storeName].length : 0, self._resetStores);
      });
      self._resetStores = false;
      keys(updates).forEach(storeName => {
        const updateMessages = updates[storeName];
        var store = self._stores[storeName];

        if (store) {
          updateMessages.forEach(updateMessage => {
            store.update(updateMessage);
          });
        } else {
          // Nobody's listening for this data. Queue it up until
          // someone wants it.
          // XXX memory use will grow without bound if you forget to
          // create a collection or just don't care about it... going
          // to have to do something about that.
          const updates = self._updatesForUnknownStores;

          if (!hasOwn.call(updates, storeName)) {
            updates[storeName] = [];
          }

          updates[storeName].push(...updateMessages);
        }
      }); // End update transaction.

      keys(self._stores).forEach(storeName => {
        self._stores[storeName].endUpdate();
      });
    }

    self._runAfterUpdateCallbacks();
  } // Call any callbacks deferred with _runWhenAllServerDocsAreFlushed whose
  // relevant docs have been flushed, as well as dataVisible callbacks at
  // reconnect-quiescence time.


  _runAfterUpdateCallbacks() {
    var self = this;
    var callbacks = self._afterUpdateCallbacks;
    self._afterUpdateCallbacks = [];
    callbacks.forEach(c => {
      c();
    });
  }

  _pushUpdate(updates, collection, msg) {
    if (!hasOwn.call(updates, collection)) {
      updates[collection] = [];
    }

    updates[collection].push(msg);
  }

  _getServerDoc(collection, id) {
    var self = this;

    if (!hasOwn.call(self._serverDocuments, collection)) {
      return null;
    }

    var serverDocsForCollection = self._serverDocuments[collection];
    return serverDocsForCollection.get(id) || null;
  }

  _process_added(msg, updates) {
    var self = this;
    var id = MongoID.idParse(msg.id);

    var serverDoc = self._getServerDoc(msg.collection, id);

    if (serverDoc) {
      // Some outstanding stub wrote here.
      var isExisting = serverDoc.document !== undefined;
      serverDoc.document = msg.fields || Object.create(null);
      serverDoc.document._id = id;

      if (self._resetStores) {
        // During reconnect the server is sending adds for existing ids.
        // Always push an update so that document stays in the store after
        // reset. Use current version of the document for this update, so
        // that stub-written values are preserved.
        var currentDoc = self._stores[msg.collection].getDoc(msg.id);

        if (currentDoc !== undefined) msg.fields = currentDoc;

        self._pushUpdate(updates, msg.collection, msg);
      } else if (isExisting) {
        throw new Error('Server sent add for existing id: ' + msg.id);
      }
    } else {
      self._pushUpdate(updates, msg.collection, msg);
    }
  }

  _process_changed(msg, updates) {
    var self = this;

    var serverDoc = self._getServerDoc(msg.collection, MongoID.idParse(msg.id));

    if (serverDoc) {
      if (serverDoc.document === undefined) throw new Error('Server sent changed for nonexisting id: ' + msg.id);
      DiffSequence.applyChanges(serverDoc.document, msg.fields);
    } else {
      self._pushUpdate(updates, msg.collection, msg);
    }
  }

  _process_removed(msg, updates) {
    var self = this;

    var serverDoc = self._getServerDoc(msg.collection, MongoID.idParse(msg.id));

    if (serverDoc) {
      // Some outstanding stub wrote here.
      if (serverDoc.document === undefined) throw new Error('Server sent removed for nonexisting id:' + msg.id);
      serverDoc.document = undefined;
    } else {
      self._pushUpdate(updates, msg.collection, {
        msg: 'removed',
        collection: msg.collection,
        id: msg.id
      });
    }
  }

  _process_updated(msg, updates) {
    var self = this; // Process "method done" messages.

    msg.methods.forEach(methodId => {
      const docs = self._documentsWrittenByStub[methodId];
      keys(docs).forEach(id => {
        const written = docs[id];

        const serverDoc = self._getServerDoc(written.collection, written.id);

        if (!serverDoc) {
          throw new Error('Lost serverDoc for ' + JSON.stringify(written));
        }

        if (!serverDoc.writtenByStubs[methodId]) {
          throw new Error('Doc ' + JSON.stringify(written) + ' not written by  method ' + methodId);
        }

        delete serverDoc.writtenByStubs[methodId];

        if (isEmpty(serverDoc.writtenByStubs)) {
          // All methods whose stubs wrote this method have completed! We can
          // now copy the saved document to the database (reverting the stub's
          // change if the server did not write to this object, or applying the
          // server's writes if it did).
          // This is a fake ddp 'replace' message.  It's just for talking
          // between livedata connections and minimongo.  (We have to stringify
          // the ID because it's supposed to look like a wire message.)
          self._pushUpdate(updates, written.collection, {
            msg: 'replace',
            id: MongoID.idStringify(written.id),
            replace: serverDoc.document
          }); // Call all flush callbacks.


          serverDoc.flushCallbacks.forEach(c => {
            c();
          }); // Delete this completed serverDocument. Don't bother to GC empty
          // IdMaps inside self._serverDocuments, since there probably aren't
          // many collections and they'll be written repeatedly.

          self._serverDocuments[written.collection].remove(written.id);
        }
      });
      delete self._documentsWrittenByStub[methodId]; // We want to call the data-written callback, but we can't do so until all
      // currently buffered messages are flushed.

      const callbackInvoker = self._methodInvokers[methodId];

      if (!callbackInvoker) {
        throw new Error('No callback invoker for method ' + methodId);
      }

      self._runWhenAllServerDocsAreFlushed(function () {
        return callbackInvoker.dataVisible(...arguments);
      });
    });
  }

  _process_ready(msg, updates) {
    var self = this; // Process "sub ready" messages. "sub ready" messages don't take effect
    // until all current server documents have been flushed to the local
    // database. We can use a write fence to implement this.

    msg.subs.forEach(subId => {
      self._runWhenAllServerDocsAreFlushed(() => {
        var subRecord = self._subscriptions[subId]; // Did we already unsubscribe?

        if (!subRecord) return; // Did we already receive a ready message? (Oops!)

        if (subRecord.ready) return;
        subRecord.ready = true;
        subRecord.readyCallback && subRecord.readyCallback();
        subRecord.readyDeps.changed();
      });
    });
  } // Ensures that "f" will be called after all documents currently in
  // _serverDocuments have been written to the local cache. f will not be called
  // if the connection is lost before then!


  _runWhenAllServerDocsAreFlushed(f) {
    var self = this;

    var runFAfterUpdates = () => {
      self._afterUpdateCallbacks.push(f);
    };

    var unflushedServerDocCount = 0;

    var onServerDocFlush = () => {
      --unflushedServerDocCount;

      if (unflushedServerDocCount === 0) {
        // This was the last doc to flush! Arrange to run f after the updates
        // have been applied.
        runFAfterUpdates();
      }
    };

    keys(self._serverDocuments).forEach(collection => {
      self._serverDocuments[collection].forEach(serverDoc => {
        const writtenByStubForAMethodWithSentMessage = keys(serverDoc.writtenByStubs).some(methodId => {
          var invoker = self._methodInvokers[methodId];
          return invoker && invoker.sentMessage;
        });

        if (writtenByStubForAMethodWithSentMessage) {
          ++unflushedServerDocCount;
          serverDoc.flushCallbacks.push(onServerDocFlush);
        }
      });
    });

    if (unflushedServerDocCount === 0) {
      // There aren't any buffered docs --- we can call f as soon as the current
      // round of updates is applied!
      runFAfterUpdates();
    }
  }

  _livedata_nosub(msg) {
    var self = this; // First pass it through _livedata_data, which only uses it to help get
    // towards quiescence.

    self._livedata_data(msg); // Do the rest of our processing immediately, with no
    // buffering-until-quiescence.
    // we weren't subbed anyway, or we initiated the unsub.


    if (!hasOwn.call(self._subscriptions, msg.id)) {
      return;
    } // XXX COMPAT WITH 1.0.3.1 #errorCallback


    var errorCallback = self._subscriptions[msg.id].errorCallback;
    var stopCallback = self._subscriptions[msg.id].stopCallback;

    self._subscriptions[msg.id].remove();

    var meteorErrorFromMsg = msgArg => {
      return msgArg && msgArg.error && new Meteor.Error(msgArg.error.error, msgArg.error.reason, msgArg.error.details);
    }; // XXX COMPAT WITH 1.0.3.1 #errorCallback


    if (errorCallback && msg.error) {
      errorCallback(meteorErrorFromMsg(msg));
    }

    if (stopCallback) {
      stopCallback(meteorErrorFromMsg(msg));
    }
  }

  _livedata_result(msg) {
    // id, result or error. error has error (code), reason, details
    var self = this; // Lets make sure there are no buffered writes before returning result.

    if (!isEmpty(self._bufferedWrites)) {
      self._flushBufferedWrites();
    } // find the outstanding request
    // should be O(1) in nearly all realistic use cases


    if (isEmpty(self._outstandingMethodBlocks)) {
      Meteor._debug('Received method result but no methods outstanding');

      return;
    }

    var currentMethodBlock = self._outstandingMethodBlocks[0].methods;
    var m;

    for (var i = 0; i < currentMethodBlock.length; i++) {
      m = currentMethodBlock[i];
      if (m.methodId === msg.id) break;
    }

    if (!m) {
      Meteor._debug("Can't match method response to original method call", msg);

      return;
    } // Remove from current method block. This may leave the block empty, but we
    // don't move on to the next block until the callback has been delivered, in
    // _outstandingMethodFinished.


    currentMethodBlock.splice(i, 1);

    if (hasOwn.call(msg, 'error')) {
      m.receiveResult(new Meteor.Error(msg.error.error, msg.error.reason, msg.error.details));
    } else {
      // msg.result may be undefined if the method didn't return a
      // value
      m.receiveResult(undefined, msg.result);
    }
  } // Called by MethodInvoker after a method's callback is invoked.  If this was
  // the last outstanding method in the current block, runs the next block. If
  // there are no more methods, consider accepting a hot code push.


  _outstandingMethodFinished() {
    var self = this;
    if (self._anyMethodsAreOutstanding()) return; // No methods are outstanding. This should mean that the first block of
    // methods is empty. (Or it might not exist, if this was a method that
    // half-finished before disconnect/reconnect.)

    if (!isEmpty(self._outstandingMethodBlocks)) {
      var firstBlock = self._outstandingMethodBlocks.shift();

      if (!isEmpty(firstBlock.methods)) throw new Error('No methods outstanding but nonempty block: ' + JSON.stringify(firstBlock)); // Send the outstanding methods now in the first block.

      if (!isEmpty(self._outstandingMethodBlocks)) self._sendOutstandingMethods();
    } // Maybe accept a hot code push.


    self._maybeMigrate();
  } // Sends messages for all the methods in the first block in
  // _outstandingMethodBlocks.


  _sendOutstandingMethods() {
    var self = this;

    if (isEmpty(self._outstandingMethodBlocks)) {
      return;
    }

    self._outstandingMethodBlocks[0].methods.forEach(m => {
      m.sendMessage();
    });
  }

  _livedata_error(msg) {
    Meteor._debug('Received error from server: ', msg.reason);

    if (msg.offendingMessage) Meteor._debug('For: ', msg.offendingMessage);
  }

  _callOnReconnectAndSendAppropriateOutstandingMethods() {
    var self = this;
    var oldOutstandingMethodBlocks = self._outstandingMethodBlocks;
    self._outstandingMethodBlocks = [];
    self.onReconnect && self.onReconnect();

    DDP._reconnectHook.each(callback => {
      callback(self);
      return true;
    });

    if (isEmpty(oldOutstandingMethodBlocks)) return; // We have at least one block worth of old outstanding methods to try
    // again. First: did onReconnect actually send anything? If not, we just
    // restore all outstanding methods and run the first block.

    if (isEmpty(self._outstandingMethodBlocks)) {
      self._outstandingMethodBlocks = oldOutstandingMethodBlocks;

      self._sendOutstandingMethods();

      return;
    } // OK, there are blocks on both sides. Special case: merge the last block of
    // the reconnect methods with the first block of the original methods, if
    // neither of them are "wait" blocks.


    if (!last(self._outstandingMethodBlocks).wait && !oldOutstandingMethodBlocks[0].wait) {
      oldOutstandingMethodBlocks[0].methods.forEach(m => {
        last(self._outstandingMethodBlocks).methods.push(m); // If this "last block" is also the first block, send the message.

        if (self._outstandingMethodBlocks.length === 1) {
          m.sendMessage();
        }
      });
      oldOutstandingMethodBlocks.shift();
    } // Now add the rest of the original blocks on.


    oldOutstandingMethodBlocks.forEach(block => {
      self._outstandingMethodBlocks.push(block);
    });
  } // We can accept a hot code push if there are no methods in flight.


  _readyToMigrate() {
    return isEmpty(this._methodInvokers);
  } // If we were blocking a migration, see if it's now possible to continue.
  // Call whenever the set of outstanding/blocked methods shrinks.


  _maybeMigrate() {
    var self = this;

    if (self._retryMigrate && self._readyToMigrate()) {
      self._retryMigrate();

      self._retryMigrate = null;
    }
  }

  onMessage(raw_msg) {
    try {
      var msg = DDPCommon.parseDDP(raw_msg);
    } catch (e) {
      Meteor._debug('Exception while parsing DDP', e);

      return;
    } // Any message counts as receiving a pong, as it demonstrates that
    // the server is still alive.


    if (this._heartbeat) {
      this._heartbeat.messageReceived();
    }

    if (msg === null || !msg.msg) {
      // XXX COMPAT WITH 0.6.6. ignore the old welcome message for back
      // compat.  Remove this 'if' once the server stops sending welcome
      // messages (stream_server.js).
      if (!(msg && msg.server_id)) Meteor._debug('discarding invalid livedata message', msg);
      return;
    }

    if (msg.msg === 'connected') {
      this._version = this._versionSuggestion;

      this._livedata_connected(msg);

      this.options.onConnected();
    } else if (msg.msg === 'failed') {
      if (this._supportedDDPVersions.indexOf(msg.version) >= 0) {
        this._versionSuggestion = msg.version;

        this._stream.reconnect({
          _force: true
        });
      } else {
        var description = 'DDP version negotiation failed; server requested version ' + msg.version;

        this._stream.disconnect({
          _permanent: true,
          _error: description
        });

        this.options.onDDPVersionNegotiationFailure(description);
      }
    } else if (msg.msg === 'ping' && this.options.respondToPings) {
      this._send({
        msg: 'pong',
        id: msg.id
      });
    } else if (msg.msg === 'pong') {// noop, as we assume everything's a pong
    } else if (['added', 'changed', 'removed', 'ready', 'updated'].includes(msg.msg)) {
      this._livedata_data(msg);
    } else if (msg.msg === 'nosub') {
      this._livedata_nosub(msg);
    } else if (msg.msg === 'result') {
      this._livedata_result(msg);
    } else if (msg.msg === 'error') {
      this._livedata_error(msg);
    } else {
      Meteor._debug('discarding unknown livedata message type', msg);
    }
  }

  onReset() {
    // Send a connect message at the beginning of the stream.
    // NOTE: reset is called even on the first connection, so this is
    // the only place we send this message.
    var msg = {
      msg: 'connect'
    };
    if (this._lastSessionId) msg.session = this._lastSessionId;
    msg.version = this._versionSuggestion || this._supportedDDPVersions[0];
    this._versionSuggestion = msg.version;
    msg.support = this._supportedDDPVersions;

    this._send(msg); // Mark non-retry calls as failed. This has to be done early as getting these methods out of the
    // current block is pretty important to making sure that quiescence is properly calculated, as
    // well as possibly moving on to another useful block.
    // Only bother testing if there is an outstandingMethodBlock (there might not be, especially if
    // we are connecting for the first time.


    if (this._outstandingMethodBlocks.length > 0) {
      // If there is an outstanding method block, we only care about the first one as that is the
      // one that could have already sent messages with no response, that are not allowed to retry.
      const currentMethodBlock = this._outstandingMethodBlocks[0].methods;
      this._outstandingMethodBlocks[0].methods = currentMethodBlock.filter(methodInvoker => {
        // Methods with 'noRetry' option set are not allowed to re-send after
        // recovering dropped connection.
        if (methodInvoker.sentMessage && methodInvoker.noRetry) {
          // Make sure that the method is told that it failed.
          methodInvoker.receiveResult(new Meteor.Error('invocation-failed', 'Method invocation might have failed due to dropped connection. ' + 'Failing because `noRetry` option was passed to Meteor.apply.'));
        } // Only keep a method if it wasn't sent or it's allowed to retry.
        // This may leave the block empty, but we don't move on to the next
        // block until the callback has been delivered, in _outstandingMethodFinished.


        return !(methodInvoker.sentMessage && methodInvoker.noRetry);
      });
    } // Now, to minimize setup latency, go ahead and blast out all of
    // our pending methods ands subscriptions before we've even taken
    // the necessary RTT to know if we successfully reconnected. (1)
    // They're supposed to be idempotent, and where they are not,
    // they can block retry in apply; (2) even if we did reconnect,
    // we're not sure what messages might have gotten lost
    // (in either direction) since we were disconnected (TCP being
    // sloppy about that.)
    // If the current block of methods all got their results (but didn't all get
    // their data visible), discard the empty block now.


    if (this._outstandingMethodBlocks.length > 0 && this._outstandingMethodBlocks[0].methods.length === 0) {
      this._outstandingMethodBlocks.shift();
    } // Mark all messages as unsent, they have not yet been sent on this
    // connection.


    keys(this._methodInvokers).forEach(id => {
      this._methodInvokers[id].sentMessage = false;
    }); // If an `onReconnect` handler is set, call it first. Go through
    // some hoops to ensure that methods that are called from within
    // `onReconnect` get executed _before_ ones that were originally
    // outstanding (since `onReconnect` is used to re-establish auth
    // certificates)

    this._callOnReconnectAndSendAppropriateOutstandingMethods(); // add new subscriptions at the end. this way they take effect after
    // the handlers and we don't see flicker.


    keys(this._subscriptions).forEach(id => {
      const sub = this._subscriptions[id];

      this._send({
        msg: 'sub',
        id: id,
        name: sub.name,
        params: sub.params
      });
    });
  }

}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"namespace.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/ddp-client/common/namespace.js                                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  DDP: () => DDP
});
let DDPCommon;
module.link("meteor/ddp-common", {
  DDPCommon(v) {
    DDPCommon = v;
  }

}, 0);
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 1);
let keys;
module.link("meteor/ddp-common/utils.js", {
  keys(v) {
    keys = v;
  }

}, 2);
let Connection;
module.link("./livedata_connection.js", {
  Connection(v) {
    Connection = v;
  }

}, 3);
// This array allows the `_allSubscriptionsReady` method below, which
// is used by the `spiderable` package, to keep track of whether all
// data is ready.
const allConnections = [];
/**
 * @namespace DDP
 * @summary Namespace for DDP-related methods/classes.
 */

const DDP = {};
// This is private but it's used in a few places. accounts-base uses
// it to get the current user. Meteor.setTimeout and friends clear
// it. We can probably find a better way to factor this.
DDP._CurrentMethodInvocation = new Meteor.EnvironmentVariable();
DDP._CurrentPublicationInvocation = new Meteor.EnvironmentVariable(); // XXX: Keep DDP._CurrentInvocation for backwards-compatibility.

DDP._CurrentInvocation = DDP._CurrentMethodInvocation; // This is passed into a weird `makeErrorType` function that expects its thing
// to be a constructor

function connectionErrorConstructor(message) {
  this.message = message;
}

DDP.ConnectionError = Meteor.makeErrorType('DDP.ConnectionError', connectionErrorConstructor);
DDP.ForcedReconnectError = Meteor.makeErrorType('DDP.ForcedReconnectError', () => {}); // Returns the named sequence of pseudo-random values.
// The scope will be DDP._CurrentMethodInvocation.get(), so the stream will produce
// consistent values for method calls on the client and server.

DDP.randomStream = name => {
  var scope = DDP._CurrentMethodInvocation.get();

  return DDPCommon.RandomStream.get(scope, name);
}; // @param url {String} URL to Meteor app,
//     e.g.:
//     "subdomain.meteor.com",
//     "http://subdomain.meteor.com",
//     "/",
//     "ddp+sockjs://ddp--****-foo.meteor.com/sockjs"

/**
 * @summary Connect to the server of a different Meteor application to subscribe to its document sets and invoke its remote methods.
 * @locus Anywhere
 * @param {String} url The URL of another Meteor application.
 */


DDP.connect = (url, options) => {
  var ret = new Connection(url, options);
  allConnections.push(ret); // hack. see below.

  return ret;
};

DDP._reconnectHook = new Hook({
  bindEnvironment: false
});
/**
 * @summary Register a function to call as the first step of
 * reconnecting. This function can call methods which will be executed before
 * any other outstanding methods. For example, this can be used to re-establish
 * the appropriate authentication context on the connection.
 * @locus Anywhere
 * @param {Function} callback The function to call. It will be called with a
 * single argument, the [connection object](#ddp_connect) that is reconnecting.
 */

DDP.onReconnect = callback => {
  return DDP._reconnectHook.register(callback);
}; // Hack for `spiderable` package: a way to see if the page is done
// loading all the data it needs.
//


DDP._allSubscriptionsReady = () => {
  return allConnections.every(conn => {
    return keys(conn._subscriptions).every(id => {
      return conn._subscriptions[id].ready;
    });
  });
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

var exports = require("/node_modules/meteor/ddp-client/server/server.js");

/* Exports */
Package._define("ddp-client", exports, {
  DDP: DDP
});

})();

//# sourceURL=meteor://💻app/packages/ddp-client.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZGRwLWNsaWVudC9zZXJ2ZXIvc2VydmVyLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9kZHAtY2xpZW50L2NvbW1vbi9NZXRob2RJbnZva2VyLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9kZHAtY2xpZW50L2NvbW1vbi9saXZlZGF0YV9jb25uZWN0aW9uLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9kZHAtY2xpZW50L2NvbW1vbi9uYW1lc3BhY2UuanMiXSwibmFtZXMiOlsibW9kdWxlIiwibGluayIsIkREUCIsImV4cG9ydCIsImRlZmF1bHQiLCJNZXRob2RJbnZva2VyIiwiY29uc3RydWN0b3IiLCJvcHRpb25zIiwibWV0aG9kSWQiLCJzZW50TWVzc2FnZSIsIl9jYWxsYmFjayIsImNhbGxiYWNrIiwiX2Nvbm5lY3Rpb24iLCJjb25uZWN0aW9uIiwiX21lc3NhZ2UiLCJtZXNzYWdlIiwiX29uUmVzdWx0UmVjZWl2ZWQiLCJvblJlc3VsdFJlY2VpdmVkIiwiX3dhaXQiLCJ3YWl0Iiwibm9SZXRyeSIsIl9tZXRob2RSZXN1bHQiLCJfZGF0YVZpc2libGUiLCJfbWV0aG9kSW52b2tlcnMiLCJzZW5kTWVzc2FnZSIsImdvdFJlc3VsdCIsIkVycm9yIiwiX21ldGhvZHNCbG9ja2luZ1F1aWVzY2VuY2UiLCJfc2VuZCIsIl9tYXliZUludm9rZUNhbGxiYWNrIiwiX291dHN0YW5kaW5nTWV0aG9kRmluaXNoZWQiLCJyZWNlaXZlUmVzdWx0IiwiZXJyIiwicmVzdWx0IiwiZGF0YVZpc2libGUiLCJfb2JqZWN0U3ByZWFkIiwidiIsIkNvbm5lY3Rpb24iLCJNZXRlb3IiLCJERFBDb21tb24iLCJUcmFja2VyIiwiRUpTT04iLCJSYW5kb20iLCJIb29rIiwiTW9uZ29JRCIsImhhc093biIsInNsaWNlIiwia2V5cyIsImlzRW1wdHkiLCJsYXN0IiwiaXNTZXJ2ZXIiLCJGaWJlciIsIk5wbSIsInJlcXVpcmUiLCJGdXR1cmUiLCJNb25nb0lETWFwIiwiSWRNYXAiLCJpZFN0cmluZ2lmeSIsImlkUGFyc2UiLCJ1cmwiLCJzZWxmIiwib25Db25uZWN0ZWQiLCJvbkREUFZlcnNpb25OZWdvdGlhdGlvbkZhaWx1cmUiLCJkZXNjcmlwdGlvbiIsIl9kZWJ1ZyIsImhlYXJ0YmVhdEludGVydmFsIiwiaGVhcnRiZWF0VGltZW91dCIsIm5wbUZheWVPcHRpb25zIiwiT2JqZWN0IiwiY3JlYXRlIiwicmVsb2FkV2l0aE91dHN0YW5kaW5nIiwic3VwcG9ydGVkRERQVmVyc2lvbnMiLCJTVVBQT1JURURfRERQX1ZFUlNJT05TIiwicmV0cnkiLCJyZXNwb25kVG9QaW5ncyIsImJ1ZmZlcmVkV3JpdGVzSW50ZXJ2YWwiLCJidWZmZXJlZFdyaXRlc01heEFnZSIsIm9uUmVjb25uZWN0IiwiX3N0cmVhbSIsIkNsaWVudFN0cmVhbSIsIkNvbm5lY3Rpb25FcnJvciIsImhlYWRlcnMiLCJfc29ja2pzT3B0aW9ucyIsIl9kb250UHJpbnRFcnJvcnMiLCJjb25uZWN0VGltZW91dE1zIiwiX2xhc3RTZXNzaW9uSWQiLCJfdmVyc2lvblN1Z2dlc3Rpb24iLCJfdmVyc2lvbiIsIl9zdG9yZXMiLCJfbWV0aG9kSGFuZGxlcnMiLCJfbmV4dE1ldGhvZElkIiwiX3N1cHBvcnRlZEREUFZlcnNpb25zIiwiX2hlYXJ0YmVhdEludGVydmFsIiwiX2hlYXJ0YmVhdFRpbWVvdXQiLCJfb3V0c3RhbmRpbmdNZXRob2RCbG9ja3MiLCJfZG9jdW1lbnRzV3JpdHRlbkJ5U3R1YiIsIl9zZXJ2ZXJEb2N1bWVudHMiLCJfYWZ0ZXJVcGRhdGVDYWxsYmFja3MiLCJfbWVzc2FnZXNCdWZmZXJlZFVudGlsUXVpZXNjZW5jZSIsIl9zdWJzQmVpbmdSZXZpdmVkIiwiX3Jlc2V0U3RvcmVzIiwiX3VwZGF0ZXNGb3JVbmtub3duU3RvcmVzIiwiX3JldHJ5TWlncmF0ZSIsIl9fZmx1c2hCdWZmZXJlZFdyaXRlcyIsImJpbmRFbnZpcm9ubWVudCIsIl9mbHVzaEJ1ZmZlcmVkV3JpdGVzIiwiX2J1ZmZlcmVkV3JpdGVzIiwiX2J1ZmZlcmVkV3JpdGVzRmx1c2hBdCIsIl9idWZmZXJlZFdyaXRlc0ZsdXNoSGFuZGxlIiwiX2J1ZmZlcmVkV3JpdGVzSW50ZXJ2YWwiLCJfYnVmZmVyZWRXcml0ZXNNYXhBZ2UiLCJfc3Vic2NyaXB0aW9ucyIsIl91c2VySWQiLCJfdXNlcklkRGVwcyIsIkRlcGVuZGVuY3kiLCJpc0NsaWVudCIsIlBhY2thZ2UiLCJyZWxvYWQiLCJSZWxvYWQiLCJfb25NaWdyYXRlIiwiX3JlYWR5VG9NaWdyYXRlIiwib25EaXNjb25uZWN0IiwiX2hlYXJ0YmVhdCIsInN0b3AiLCJvbiIsIm9uTWVzc2FnZSIsImJpbmQiLCJvblJlc2V0IiwicmVnaXN0ZXJTdG9yZSIsIm5hbWUiLCJ3cmFwcGVkU3RvcmUiLCJzdG9yZSIsImZvckVhY2giLCJtZXRob2QiLCJxdWV1ZWQiLCJiZWdpblVwZGF0ZSIsImxlbmd0aCIsIm1zZyIsInVwZGF0ZSIsImVuZFVwZGF0ZSIsInN1YnNjcmliZSIsInBhcmFtcyIsImNhbGwiLCJhcmd1bWVudHMiLCJjYWxsYmFja3MiLCJsYXN0UGFyYW0iLCJvblJlYWR5IiwicG9wIiwib25FcnJvciIsIm9uU3RvcCIsInNvbWUiLCJmIiwiZXhpc3RpbmciLCJpZCIsInN1YiIsImluYWN0aXZlIiwiZXF1YWxzIiwicmVhZHkiLCJyZWFkeUNhbGxiYWNrIiwiZXJyb3JDYWxsYmFjayIsInN0b3BDYWxsYmFjayIsImNsb25lIiwicmVhZHlEZXBzIiwicmVtb3ZlIiwiY2hhbmdlZCIsImhhbmRsZSIsInJlY29yZCIsImRlcGVuZCIsInN1YnNjcmlwdGlvbklkIiwiYWN0aXZlIiwib25JbnZhbGlkYXRlIiwiYyIsImFmdGVyRmx1c2giLCJfc3Vic2NyaWJlQW5kV2FpdCIsImFyZ3MiLCJwdXNoIiwiZSIsIm9uTGF0ZUVycm9yIiwiYXBwbHkiLCJjb25jYXQiLCJtZXRob2RzIiwiZnVuYyIsImVuY2xvc2luZyIsIl9DdXJyZW50TWV0aG9kSW52b2NhdGlvbiIsImdldCIsImFscmVhZHlJblNpbXVsYXRpb24iLCJpc1NpbXVsYXRpb24iLCJyYW5kb21TZWVkIiwicmFuZG9tU2VlZEdlbmVyYXRvciIsIm1ha2VScGNTZWVkIiwic3R1YiIsInNldFVzZXJJZCIsInVzZXJJZCIsImludm9jYXRpb24iLCJNZXRob2RJbnZvY2F0aW9uIiwiX3NhdmVPcmlnaW5hbHMiLCJzdHViUmV0dXJuVmFsdWUiLCJ3aXRoVmFsdWUiLCJfbm9ZaWVsZHNBbGxvd2VkIiwiZXhjZXB0aW9uIiwidW5kZWZpbmVkIiwiX3JldHJpZXZlQW5kU3RvcmVPcmlnaW5hbHMiLCJ0aHJvd1N0dWJFeGNlcHRpb25zIiwiX2V4cGVjdGVkQnlUZXN0IiwiZnV0dXJlIiwicmVzb2x2ZXIiLCJtZXRob2RJbnZva2VyIiwicmV0dXJuU3R1YlZhbHVlIiwiX3dhaXRpbmdGb3JRdWllc2NlbmNlIiwic3RvcmVOYW1lIiwic2F2ZU9yaWdpbmFscyIsImRvY3NXcml0dGVuIiwiY29sbGVjdGlvbiIsIm9yaWdpbmFscyIsInJldHJpZXZlT3JpZ2luYWxzIiwiZG9jIiwic2VydmVyRG9jIiwic2V0RGVmYXVsdCIsIndyaXR0ZW5CeVN0dWJzIiwiZG9jdW1lbnQiLCJmbHVzaENhbGxiYWNrcyIsIl91bnN1YnNjcmliZUFsbCIsIm9iaiIsInNlbmQiLCJzdHJpbmdpZnlERFAiLCJfbG9zdENvbm5lY3Rpb24iLCJlcnJvciIsInN0YXR1cyIsInJlY29ubmVjdCIsImRpc2Nvbm5lY3QiLCJjbG9zZSIsIl9wZXJtYW5lbnQiLCJfYW55TWV0aG9kc0FyZU91dHN0YW5kaW5nIiwiaW52b2tlcnMiLCJfbGl2ZWRhdGFfY29ubmVjdGVkIiwiSGVhcnRiZWF0Iiwib25UaW1lb3V0Iiwic2VuZFBpbmciLCJzdGFydCIsInNlc3Npb24iLCJyZWNvbm5lY3RlZFRvUHJldmlvdXNTZXNzaW9uIiwiaW52b2tlciIsInMiLCJfcnVuQWZ0ZXJVcGRhdGVDYWxsYmFja3MiLCJfcHJvY2Vzc09uZURhdGFNZXNzYWdlIiwidXBkYXRlcyIsIm1lc3NhZ2VUeXBlIiwiX3Byb2Nlc3NfYWRkZWQiLCJfcHJvY2Vzc19jaGFuZ2VkIiwiX3Byb2Nlc3NfcmVtb3ZlZCIsIl9wcm9jZXNzX3JlYWR5IiwiX3Byb2Nlc3NfdXBkYXRlZCIsIl9saXZlZGF0YV9kYXRhIiwic3VicyIsInN1YklkIiwiYnVmZmVyZWRNZXNzYWdlcyIsInN0YW5kYXJkV3JpdGUiLCJEYXRlIiwidmFsdWVPZiIsImNsZWFyVGltZW91dCIsInNldFRpbWVvdXQiLCJ3cml0ZXMiLCJfcGVyZm9ybVdyaXRlcyIsInVwZGF0ZU1lc3NhZ2VzIiwidXBkYXRlTWVzc2FnZSIsIl9wdXNoVXBkYXRlIiwiX2dldFNlcnZlckRvYyIsInNlcnZlckRvY3NGb3JDb2xsZWN0aW9uIiwiaXNFeGlzdGluZyIsImZpZWxkcyIsIl9pZCIsImN1cnJlbnREb2MiLCJnZXREb2MiLCJEaWZmU2VxdWVuY2UiLCJhcHBseUNoYW5nZXMiLCJkb2NzIiwid3JpdHRlbiIsIkpTT04iLCJzdHJpbmdpZnkiLCJyZXBsYWNlIiwiY2FsbGJhY2tJbnZva2VyIiwiX3J1bldoZW5BbGxTZXJ2ZXJEb2NzQXJlRmx1c2hlZCIsInN1YlJlY29yZCIsInJ1bkZBZnRlclVwZGF0ZXMiLCJ1bmZsdXNoZWRTZXJ2ZXJEb2NDb3VudCIsIm9uU2VydmVyRG9jRmx1c2giLCJ3cml0dGVuQnlTdHViRm9yQU1ldGhvZFdpdGhTZW50TWVzc2FnZSIsIl9saXZlZGF0YV9ub3N1YiIsIm1ldGVvckVycm9yRnJvbU1zZyIsIm1zZ0FyZyIsInJlYXNvbiIsImRldGFpbHMiLCJfbGl2ZWRhdGFfcmVzdWx0IiwiY3VycmVudE1ldGhvZEJsb2NrIiwibSIsImkiLCJzcGxpY2UiLCJmaXJzdEJsb2NrIiwic2hpZnQiLCJfc2VuZE91dHN0YW5kaW5nTWV0aG9kcyIsIl9tYXliZU1pZ3JhdGUiLCJfbGl2ZWRhdGFfZXJyb3IiLCJvZmZlbmRpbmdNZXNzYWdlIiwiX2NhbGxPblJlY29ubmVjdEFuZFNlbmRBcHByb3ByaWF0ZU91dHN0YW5kaW5nTWV0aG9kcyIsIm9sZE91dHN0YW5kaW5nTWV0aG9kQmxvY2tzIiwiX3JlY29ubmVjdEhvb2siLCJlYWNoIiwiYmxvY2siLCJyYXdfbXNnIiwicGFyc2VERFAiLCJtZXNzYWdlUmVjZWl2ZWQiLCJzZXJ2ZXJfaWQiLCJpbmRleE9mIiwidmVyc2lvbiIsIl9mb3JjZSIsIl9lcnJvciIsImluY2x1ZGVzIiwic3VwcG9ydCIsImZpbHRlciIsImFsbENvbm5lY3Rpb25zIiwiRW52aXJvbm1lbnRWYXJpYWJsZSIsIl9DdXJyZW50UHVibGljYXRpb25JbnZvY2F0aW9uIiwiX0N1cnJlbnRJbnZvY2F0aW9uIiwiY29ubmVjdGlvbkVycm9yQ29uc3RydWN0b3IiLCJtYWtlRXJyb3JUeXBlIiwiRm9yY2VkUmVjb25uZWN0RXJyb3IiLCJyYW5kb21TdHJlYW0iLCJzY29wZSIsIlJhbmRvbVN0cmVhbSIsImNvbm5lY3QiLCJyZXQiLCJyZWdpc3RlciIsIl9hbGxTdWJzY3JpcHRpb25zUmVhZHkiLCJldmVyeSIsImNvbm4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBQSxNQUFNLENBQUNDLElBQVAsQ0FBWSx3QkFBWixFQUFxQztBQUFDQyxLQUFHLEVBQUM7QUFBTCxDQUFyQyxFQUFpRCxDQUFqRCxFOzs7Ozs7Ozs7OztBQ0FBRixNQUFNLENBQUNHLE1BQVAsQ0FBYztBQUFDQyxTQUFPLEVBQUMsTUFBSUM7QUFBYixDQUFkOztBQUtlLE1BQU1BLGFBQU4sQ0FBb0I7QUFDakNDLGFBQVcsQ0FBQ0MsT0FBRCxFQUFVO0FBQ25CO0FBQ0EsU0FBS0MsUUFBTCxHQUFnQkQsT0FBTyxDQUFDQyxRQUF4QjtBQUNBLFNBQUtDLFdBQUwsR0FBbUIsS0FBbkI7QUFFQSxTQUFLQyxTQUFMLEdBQWlCSCxPQUFPLENBQUNJLFFBQXpCO0FBQ0EsU0FBS0MsV0FBTCxHQUFtQkwsT0FBTyxDQUFDTSxVQUEzQjtBQUNBLFNBQUtDLFFBQUwsR0FBZ0JQLE9BQU8sQ0FB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QVY7QUFDQXdULGdCQUFjLENBQUNoSixJQUFmLENBQW9CMkosR0FBcEIsRUFGOEIsQ0FFSjs7QUFDMUIsU0FBT0EsR0FBUDtBQUNELENBSkQ7O0FBTUF4VSxHQUFHLENBQUMrUyxjQUFKLEdBQXFCLElBQUl0USxJQUFKLENBQVM7QUFBRTZELGlCQUFlLEVBQUU7QUFBbkIsQ0FBVCxDQUFyQjtBQUVBOzs7Ozs7Ozs7O0FBU0F0RyxHQUFHLENBQUMyRSxXQUFKLEdBQWtCbEUsUUFBUSxJQUFJO0FBQzVCLFNBQU9ULEdBQUcsQ0FBQytTLGNBQUosQ0FBbUIwQixRQUFuQixDQUE0QmhVLFFBQTVCLENBQVA7QUFDRCxDQUZELEMsQ0FJQTtBQUNBO0FBQ0E7OztBQUNBVCxHQUFHLENBQUMwVSxzQkFBSixHQUE2QixNQUFNO0FBQ2pDLFNBQU9iLGNBQWMsQ0FBQ2MsS0FBZixDQUFxQkMsSUFBSSxJQUFJO0FBQ2xDLFdBQU8vUixJQUFJLENBQUMrUixJQUFJLENBQUMvTixjQUFOLENBQUosQ0FBMEI4TixLQUExQixDQUFnQ3BMLEVBQUUsSUFBSTtBQUMzQyxhQUFPcUwsSUFBSSxDQUFDL04sY0FBTCxDQUFvQjBDLEVBQXBCLEVBQXdCSSxLQUEvQjtBQUNELEtBRk0sQ0FBUDtBQUdELEdBSk0sQ0FBUDtBQUtELENBTkQsQyIsImZpbGUiOiIvcGFja2FnZXMvZGRwLWNsaWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCB7IEREUCB9IGZyb20gJy4uL2NvbW1vbi9uYW1lc3BhY2UuanMnO1xuIiwiLy8gQSBNZXRob2RJbnZva2VyIG1hbmFnZXMgc2VuZGluZyBhIG1ldGhvZCB0byB0aGUgc2VydmVyIGFuZCBjYWxsaW5nIHRoZSB1c2VyJ3Ncbi8vIGNhbGxiYWNrcy4gT24gY29uc3RydWN0aW9uLCBpdCByZWdpc3RlcnMgaXRzZWxmIGluIHRoZSBjb25uZWN0aW9uJ3Ncbi8vIF9tZXRob2RJbnZva2VycyBtYXA7IGl0IHJlbW92ZXMgaXRzZWxmIG9uY2UgdGhlIG1ldGhvZCBpcyBmdWxseSBmaW5pc2hlZCBhbmRcbi8vIHRoZSBjYWxsYmFjayBpcyBpbnZva2VkLiBUaGlzIG9jY3VycyB3aGVuIGl0IGhhcyBib3RoIHJlY2VpdmVkIGEgcmVzdWx0LFxuLy8gYW5kIHRoZSBkYXRhIHdyaXR0ZW4gYnkgaXQgaXMgZnVsbHkgdmlzaWJsZS5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1ldGhvZEludm9rZXIge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgLy8gUHVibGljICh3aXRoaW4gdGhpcyBmaWxlKSBmaWVsZHMuXG4gICAgdGhpcy5tZXRob2RJZCA9IG9wdGlvbnMubWV0aG9kSWQ7XG4gICAgdGhpcy5zZW50TWVzc2FnZSA9IGZhbHNlO1xuXG4gICAgdGhpcy5fY2FsbGJhY2sgPSBvcHRpb25zLmNhbGxiYWNrO1xuICAgIHRoaXMuX2Nvbm5lY3Rpb24gPSBvcHRpb25zLmNvbm5lY3Rpb247XG4gICAgdGhpcy5fbWVzc2FnZSA9IG9wdGlvbnMubWVzc2FnZTtcbiAgICB0aGlzLl9vblJlc3VsdFJlY2VpdmVkID0gb3B0aW9ucy5vblJlc3VsdFJlY2VpdmVkIHx8ICgoKSA9PiB7fSk7XG4gICAgdGhpcy5fd2FpdCA9IG9wdGlvbnMud2FpdDtcbiAgICB0aGlzLm5vUmV0cnkgPSBvcHRpb25zLm5vUmV0cnk7XG4gICAgdGhpcy5fbWV0aG9kUmVzdWx0ID0gbnVsbDtcbiAgICB0aGlzLl9kYXRhVmlzaWJsZSA9IGZhbHNlO1xuXG4gICAgLy8gUmVnaXN0ZXIgd2l0aCB0aGUgY29ubmVjdGlvbi5cbiAgICB0aGlzLl9jb25uZWN0aW9uLl9tZXRob2RJbnZva2Vyc1t0aGlzLm1ldGhvZElkXSA9IHRoaXM7XG4gIH1cbiAgLy8gU2VuZHMgdGhlIG1ldGhvZCBtZXNzYWdlIHRvIHRoZSBzZXJ2ZXIuIE1heSBiZSBjYWxsZWQgYWRkaXRpb25hbCB0aW1lcyBpZlxuICAvLyB3ZSBsb3NlIHRoZSBjb25uZWN0aW9uIGFuZCByZWNvbm5lY3QgYmVmb3JlIHJlY2VpdmluZyBhIHJlc3VsdC5cbiAgc2VuZE1lc3NhZ2UoKSB7XG4gICAgLy8gVGhpcyBmdW5jdGlvbiBpcyBjYWxsZWQgYmVmb3JlIHNlbmRpbmcgYSBtZXRob2QgKGluY2x1ZGluZyByZXNlbmRpbmcgb25cbiAgICAvLyByZWNvbm5lY3QpLiBXZSBzaG91bGQgb25seSAocmUpc2VuZCBtZXRob2RzIHdoZXJlIHdlIGRvbid0IGFscmVhZHkgaGF2ZSBhXG4gICAgLy8gcmVzdWx0IVxuICAgIGlmICh0aGlzLmdvdFJlc3VsdCgpKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdzZW5kaW5nTWV0aG9kIGlzIGNhbGxlZCBvbiBtZXRob2Qgd2l0aCByZXN1bHQnKTtcblxuICAgIC8vIElmIHdlJ3JlIHJlLXNlbmRpbmcgaXQsIGl0IGRvZXNuJ3QgbWF0dGVyIGlmIGRhdGEgd2FzIHdyaXR0ZW4gdGhlIGZpcnN0XG4gICAgLy8gdGltZS5cbiAgICB0aGlzLl9kYXRhVmlzaWJsZSA9IGZhbHNlO1xuICAgIHRoaXMuc2VudE1lc3NhZ2UgPSB0cnVlO1xuXG4gICAgLy8gSWYgdGhpcyBpcyBhIHdhaXQgbWV0aG9kLCBtYWtlIGFsbCBkYXRhIG1lc3NhZ2VzIGJlIGJ1ZmZlcmVkIHVudGlsIGl0IGlzXG4gICAgLy8gZG9uZS5cbiAgICBpZiAodGhpcy5fd2FpdClcbiAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uX21ldGhvZHNCbG9ja2luZ1F1aWVzY2VuY2VbdGhpcy5tZXRob2RJZF0gPSB0cnVlO1xuXG4gICAgLy8gQWN0dWFsbHkgc2VuZCB0aGUgbWVzc2FnZS5cbiAgICB0aGlzLl9jb25uZWN0aW9uLl9zZW5kKHRoaXMuX21lc3NhZ2UpO1xuICB9XG4gIC8vIEludm9rZSB0aGUgY2FsbGJhY2ssIGlmIHdlIGhhdmUgYm90aCBhIHJlc3VsdCBhbmQga25vdyB0aGF0IGFsbCBkYXRhIGhhc1xuICAvLyBiZWVuIHdyaXR0ZW4gdG8gdGhlIGxvY2FsIGNhY2hlLlxuICBfbWF5YmVJbnZva2VDYWxsYmFjaygpIHtcbiAgICBpZiAodGhpcy5fbWV0aG9kUmVzdWx0ICYmIHRoaXMuX2RhdGFWaXNpYmxlKSB7XG4gICAgICAvLyBDYWxsIHRoZSBjYWxsYmFjay4gKFRoaXMgd29uJ3QgdGhyb3c6IHRoZSBjYWxsYmFjayB3YXMgd3JhcHBlZCB3aXRoXG4gICAgICAvLyBiaW5kRW52aXJvbm1lbnQuKVxuICAgICAgdGhpcy5fY2FsbGJhY2sodGhpcy5fbWV0aG9kUmVzdWx0WzBdLCB0aGlzLl9tZXRob2RSZXN1bHRbMV0pO1xuXG4gICAgICAvLyBGb3JnZXQgYWJvdXQgdGhpcyBtZXRob2QuXG4gICAgICBkZWxldGUgdGhpcy5fY29ubmVjdGlvbi5fbWV0aG9kSW52b2tlcnNbdGhpcy5tZXRob2RJZF07XG5cbiAgICAgIC8vIExldCB0aGUgY29ubmVjdGlvbiBrbm93IHRoYXQgdGhpcyBtZXRob2QgaXMgZmluaXNoZWQsIHNvIGl0IGNhbiB0cnkgdG9cbiAgICAgIC8vIG1vdmUgb24gdG8gdGhlIG5leHQgYmxvY2sgb2YgbWV0aG9kcy5cbiAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uX291dHN0YW5kaW5nTWV0aG9kRmluaXNoZWQoKTtcbiAgICB9XG4gIH1cbiAgLy8gQ2FsbCB3aXRoIHRoZSByZXN1bHQgb2YgdGhlIG1ldGhvZCBmcm9tIHRoZSBzZXJ2ZXIuIE9ubHkgbWF5IGJlIGNhbGxlZFxuICAvLyBvbmNlOyBvbmNlIGl0IGlzIGNhbGxlZCwgeW91IHNob3VsZCBub3QgY2FsbCBzZW5kTWVzc2FnZSBhZ2Fpbi5cbiAgLy8gSWYgdGhlIHVzZXIgcHJvdmlkZWQgYW4gb25SZXN1bHRSZWNlaXZlZCBjYWxsYmFjaywgY2FsbCBpdCBpbW1lZGlhdGVseS5cbiAgLy8gVGhlbiBpbnZva2UgdGhlIG1haW4gY2FsbGJhY2sgaWYgZGF0YSBpcyBhbHNvIHZpc2libGUuXG4gIHJlY2VpdmVSZXN1bHQoZXJyLCByZXN1bHQpIHtcbiAgICBpZiAodGhpcy5nb3RSZXN1bHQoKSlcbiAgICAgIHRocm93IG5ldyBFcnJvcignTWV0aG9kcyBzaG91bGQgb25seSByZWNlaXZlIHJlc3VsdHMgb25jZScpO1xuICAgIHRoaXMuX21ldGhvZFJlc3VsdCA9IFtlcnIsIHJlc3VsdF07XG4gICAgdGhpcy5fb25SZXN1bHRSZWNlaXZlZChlcnIsIHJlc3VsdCk7XG4gICAgdGhpcy5fbWF5YmVJbnZva2VDYWxsYmFjaygpO1xuICB9XG4gIC8vIENhbGwgdGhpcyB3aGVuIGFsbCBkYXRhIHdyaXR0ZW4gYnkgdGhlIG1ldGhvZCBpcyB2aXNpYmxlLiBUaGlzIG1lYW5zIHRoYXRcbiAgLy8gdGhlIG1ldGhvZCBoYXMgcmV0dXJucyBpdHMgXCJkYXRhIGlzIGRvbmVcIiBtZXNzYWdlICpBTkQqIGFsbCBzZXJ2ZXJcbiAgLy8gZG9jdW1lbnRzIHRoYXQgYXJlIGJ1ZmZlcmVkIGF0IHRoYXQgdGltZSBoYXZlIGJlZW4gd3JpdHRlbiB0byB0aGUgbG9jYWxcbiAgLy8gY2FjaGUuIEludm9rZXMgdGhlIG1haW4gY2FsbGJhY2sgaWYgdGhlIHJlc3VsdCBoYXMgYmVlbiByZWNlaXZlZC5cbiAgZGF0YVZpc2libGUoKSB7XG4gICAgdGhpcy5fZGF0YVZpc2libGUgPSB0cnVlO1xuICAgIHRoaXMuX21heWJlSW52b2tlQ2FsbGJhY2soKTtcbiAgfVxuICAvLyBUcnVlIGlmIHJlY2VpdmVSZXN1bHQgaGFzIGJlZW4gY2FsbGVkLlxuICBnb3RSZXN1bHQoKSB7XG4gICAgcmV0dXJuICEhdGhpcy5fbWV0aG9kUmVzdWx0O1xuICB9XG59XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7IEREUENvbW1vbiB9IGZyb20gJ21ldGVvci9kZHAtY29tbW9uJztcbmltcG9ydCB7IFRyYWNrZXIgfSBmcm9tICdtZXRlb3IvdHJhY2tlcic7XG5pbXBvcnQgeyBFSlNPTiB9IGZyb20gJ21ldGVvci9lanNvbic7XG5pbXBvcnQgeyBSYW5kb20gfSBmcm9tICdtZXRlb3IvcmFuZG9tJztcbmltcG9ydCB7IEhvb2sgfSBmcm9tICdtZXRlb3IvY2FsbGJhY2staG9vayc7XG5pbXBvcnQgeyBNb25nb0lEIH0gZnJvbSAnbWV0ZW9yL21vbmdvLWlkJztcbmltcG9ydCB7IEREUCB9IGZyb20gJy4vbmFtZXNwYWNlLmpzJztcbmltcG9ydCBNZXRob2RJbnZva2VyIGZyb20gJy4vTWV0aG9kSW52b2tlci5qcyc7XG5pbXBvcnQge1xuICBoYXNPd24sXG4gIHNsaWNlLFxuICBrZXlzLFxuICBpc0VtcHR5LFxuICBsYXN0LFxufSBmcm9tIFwibWV0ZW9yL2RkcC1jb21tb24vdXRpbHMuanNcIjtcblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICB2YXIgRmliZXIgPSBOcG0ucmVxdWlyZSgnZmliZXJzJyk7XG4gIHZhciBGdXR1cmUgPSBOcG0ucmVxdWlyZSgnZmliZXJzL2Z1dHVyZScpO1xufVxuXG5jbGFzcyBNb25nb0lETWFwIGV4dGVuZHMgSWRNYXAge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihNb25nb0lELmlkU3RyaW5naWZ5LCBNb25nb0lELmlkUGFyc2UpO1xuICB9XG59XG5cbi8vIEBwYXJhbSB1cmwge1N0cmluZ3xPYmplY3R9IFVSTCB0byBNZXRlb3IgYXBwLFxuLy8gICBvciBhbiBvYmplY3QgYXMgYSB0ZXN0IGhvb2sgKHNlZSBjb2RlKVxuLy8gT3B0aW9uczpcbi8vICAgcmVsb2FkV2l0aE91dHN0YW5kaW5nOiBpcyBpdCBPSyB0byByZWxvYWQgaWYgdGhlcmUgYXJlIG91dHN0YW5kaW5nIG1ldGhvZHM/XG4vLyAgIGhlYWRlcnM6IGV4dHJhIGhlYWRlcnMgdG8gc2VuZCBvbiB0aGUgd2Vic29ja2V0cyBjb25uZWN0aW9uLCBmb3Jcbi8vICAgICBzZXJ2ZXItdG8tc2VydmVyIEREUCBvbmx5XG4vLyAgIF9zb2NranNPcHRpb25zOiBTcGVjaWZpZXMgb3B0aW9ucyB0byBwYXNzIHRocm91Z2ggdG8gdGhlIHNvY2tqcyBjbGllbnRcbi8vICAgb25ERFBOZWdvdGlhdGlvblZlcnNpb25GYWlsdXJlOiBjYWxsYmFjayB3aGVuIHZlcnNpb24gbmVnb3RpYXRpb24gZmFpbHMuXG4vL1xuLy8gWFhYIFRoZXJlIHNob3VsZCBiZSBhIHdheSB0byBkZXN0cm95IGEgRERQIGNvbm5lY3Rpb24sIGNhdXNpbmcgYWxsXG4vLyBvdXRzdGFuZGluZyBtZXRob2QgY2FsbHMgdG8gZmFpbC5cbi8vXG4vLyBYWFggT3VyIGN1cnJlbnQgd2F5IG9mIGhhbmRsaW5nIGZhaWx1cmUgYW5kIHJlY29ubmVjdGlvbiBpcyBncmVhdFxuLy8gZm9yIGFuIGFwcCAod2hlcmUgd2Ugd2FudCB0byB0b2xlcmF0ZSBiZWluZyBkaXNjb25uZWN0ZWQgYXMgYW5cbi8vIGV4cGVjdCBzdGF0ZSwgYW5kIGtlZXAgdHJ5aW5nIGZvcmV2ZXIgdG8gcmVjb25uZWN0KSBidXQgY3VtYmVyc29tZVxuLy8gZm9yIHNvbWV0aGluZyBsaWtlIGEgY29tbWFuZCBsaW5lIHRvb2wgdGhhdCB3YW50cyB0byBtYWtlIGFcbi8vIGNvbm5lY3Rpb24sIGNhbGwgYSBtZXRob2QsIGFuZCBwcmludCBhbiBlcnJvciBpZiBjb25uZWN0aW9uXG4vLyBmYWlscy4gV2Ugc2hvdWxkIGhhdmUgYmV0dGVyIHVzYWJpbGl0eSBpbiB0aGUgbGF0dGVyIGNhc2UgKHdoaWxlXG4vLyBzdGlsbCB0cmFuc3BhcmVudGx5IHJlY29ubmVjdGluZyBpZiBpdCdzIGp1c3QgYSB0cmFuc2llbnQgZmFpbHVyZVxuLy8gb3IgdGhlIHNlcnZlciBtaWdyYXRpbmcgdXMpLlxuZXhwb3J0IGNsYXNzIENvbm5lY3Rpb24ge1xuICBjb25zdHJ1Y3Rvcih1cmwsIG9wdGlvbnMpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zID0ge1xuICAgICAgb25Db25uZWN0ZWQoKSB7fSxcbiAgICAgIG9uRERQVmVyc2lvbk5lZ290aWF0aW9uRmFpbHVyZShkZXNjcmlwdGlvbikge1xuICAgICAgICBNZXRlb3IuX2RlYnVnKGRlc2NyaXB0aW9uKTtcbiAgICAgIH0sXG4gICAgICBoZWFydGJlYXRJbnRlcnZhbDogMTc1MDAsXG4gICAgICBoZWFydGJlYXRUaW1lb3V0OiAxNTAwMCxcbiAgICAgIG5wbUZheWVPcHRpb25zOiBPYmplY3QuY3JlYXRlKG51bGwpLFxuICAgICAgLy8gVGhlc2Ugb3B0aW9ucyBhcmUgb25seSBmb3IgdGVzdGluZy5cbiAgICAgIHJlbG9hZFdpdGhPdXRzdGFuZGluZzogZmFsc2UsXG4gICAgICBzdXBwb3J0ZWRERFBWZXJzaW9uczogRERQQ29tbW9uLlNVUFBPUlRFRF9ERFBfVkVSU0lPTlMsXG4gICAgICByZXRyeTogdHJ1ZSxcbiAgICAgIHJlc3BvbmRUb1BpbmdzOiB0cnVlLFxuICAgICAgLy8gV2hlbiB1cGRhdGVzIGFyZSBjb21pbmcgd2l0aGluIHRoaXMgbXMgaW50ZXJ2YWwsIGJhdGNoIHRoZW0gdG9nZXRoZXIuXG4gICAgICBidWZmZXJlZFdyaXRlc0ludGVydmFsOiA1LFxuICAgICAgLy8gRmx1c2ggYnVmZmVycyBpbW1lZGlhdGVseSBpZiB3cml0ZXMgYXJlIGhhcHBlbmluZyBjb250aW51b3VzbHkgZm9yIG1vcmUgdGhhbiB0aGlzIG1hbnkgbXMuXG4gICAgICBidWZmZXJlZFdyaXRlc01heEFnZTogNTAwLFxuXG4gICAgICAuLi5vcHRpb25zXG4gICAgfTtcblxuICAgIC8vIElmIHNldCwgY2FsbGVkIHdoZW4gd2UgcmVjb25uZWN0LCBxdWV1aW5nIG1ldGhvZCBjYWxscyBfYmVmb3JlXyB0aGVcbiAgICAvLyBleGlzdGluZyBvdXRzdGFuZGluZyBvbmVzLlxuICAgIC8vIE5PVEU6IFRoaXMgZmVhdHVyZSBoYXMgYmVlbiBwcmVzZXJ2ZWQgZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5LiBUaGVcbiAgICAvLyBwcmVmZXJyZWQgbWV0aG9kIG9mIHNldHRpbmcgYSBjYWxsYmFjayBvbiByZWNvbm5lY3QgaXMgdG8gdXNlXG4gICAgLy8gRERQLm9uUmVjb25uZWN0LlxuICAgIHNlbGYub25SZWNvbm5lY3QgPSBudWxsO1xuXG4gICAgLy8gYXMgYSB0ZXN0IGhvb2ssIGFsbG93IHBhc3NpbmcgYSBzdHJlYW0gaW5zdGVhZCBvZiBhIHVybC5cbiAgICBpZiAodHlwZW9mIHVybCA9PT0gJ29iamVjdCcpIHtcbiAgICAgIHNlbGYuX3N0cmVhbSA9IHVybDtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgeyBDbGllbnRTdHJlYW0gfSA9IHJlcXVpcmUoXCJtZXRlb3Ivc29ja2V0LXN0cmVhbS1jbGllbnRcIik7XG4gICAgICBzZWxmLl9zdHJlYW0gPSBuZXcgQ2xpZW50U3RyZWFtKHVybCwge1xuICAgICAgICByZXRyeTogb3B0aW9ucy5yZXRyeSxcbiAgICAgICAgQ29ubmVjdGlvbkVycm9yOiBERFAuQ29ubmVjdGlvbkVycm9yLFxuICAgICAgICBoZWFkZXJzOiBvcHRpb25zLmhlYWRlcnMsXG4gICAgICAgIF9zb2NranNPcHRpb25zOiBvcHRpb25zLl9zb2NranNPcHRpb25zLFxuICAgICAgICAvLyBVc2VkIHRvIGtlZXAgc29tZSB0ZXN0cyBxdWlldCwgb3IgZm9yIG90aGVyIGNhc2VzIGluIHdoaWNoXG4gICAgICAgIC8vIHRoZSByaWdodCB0aGluZyB0byBkbyB3aXRoIGNvbm5lY3Rpb24gZXJyb3JzIGlzIHRvIHNpbGVudGx5XG4gICAgICAgIC8vIGZhaWwgKGUuZy4gc2VuZGluZyBwYWNrYWdlIHVzYWdlIHN0YXRzKS4gQXQgc29tZSBwb2ludCB3ZVxuICAgICAgICAvLyBzaG91bGQgaGF2ZSBhIHJlYWwgQVBJIGZvciBoYW5kbGluZyBjbGllbnQtc3RyZWFtLWxldmVsXG4gICAgICAgIC8vIGVycm9ycy5cbiAgICAgICAgX2RvbnRQcmludEVycm9yczogb3B0aW9ucy5fZG9udFByaW50RXJyb3JzLFxuICAgICAgICBjb25uZWN0VGltZW91dE1zOiBvcHRpb25zLmNvbm5lY3RUaW1lb3V0TXMsXG4gICAgICAgIG5wbUZheWVPcHRpb25zOiBvcHRpb25zLm5wbUZheWVPcHRpb25zXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBzZWxmLl9sYXN0U2Vzc2lvbklkID0gbnVsbDtcbiAgICBzZWxmLl92ZXJzaW9uU3VnZ2VzdGlvbiA9IG51bGw7IC8vIFRoZSBsYXN0IHByb3Bvc2VkIEREUCB2ZXJzaW9uLlxuICAgIHNlbGYuX3ZlcnNpb24gPSBudWxsOyAvLyBUaGUgRERQIHZlcnNpb24gYWdyZWVkIG9uIGJ5IGNsaWVudCBhbmQgc2VydmVyLlxuICAgIHNlbGYuX3N0b3JlcyA9IE9iamVjdC5jcmVhdGUobnVsbCk7IC8vIG5hbWUgLT4gb2JqZWN0IHdpdGggbWV0aG9kc1xuICAgIHNlbGYuX21ldGhvZEhhbmRsZXJzID0gT2JqZWN0LmNyZWF0ZShudWxsKTsgLy8gbmFtZSAtPiBmdW5jXG4gICAgc2VsZi5fbmV4dE1ldGhvZElkID0gMTtcbiAgICBzZWxmLl9zdXBwb3J0ZWRERFBWZXJzaW9ucyA9IG9wdGlvbnMuc3VwcG9ydGVkRERQVmVyc2lvbnM7XG5cbiAgICBzZWxmLl9oZWFydGJlYXRJbnRlcnZhbCA9IG9wdGlvbnMuaGVhcnRiZWF0SW50ZXJ2YWw7XG4gICAgc2VsZi5faGVhcnRiZWF0VGltZW91dCA9IG9wdGlvbnMuaGVhcnRiZWF0VGltZW91dDtcblxuICAgIC8vIFRyYWNrcyBtZXRob2RzIHdoaWNoIHRoZSB1c2VyIGhhcyB0cmllZCB0byBjYWxsIGJ1dCB3aGljaCBoYXZlIG5vdCB5ZXRcbiAgICAvLyBjYWxsZWQgdGhlaXIgdXNlciBjYWxsYmFjayAoaWUsIHRoZXkgYXJlIHdhaXRpbmcgb24gdGhlaXIgcmVzdWx0IG9yIGZvciBhbGxcbiAgICAvLyBvZiB0aGVpciB3cml0ZXMgdG8gYmUgd3JpdHRlbiB0byB0aGUgbG9jYWwgY2FjaGUpLiBNYXAgZnJvbSBtZXRob2QgSUQgdG9cbiAgICAvLyBNZXRob2RJbnZva2VyIG9iamVjdC5cbiAgICBzZWxmLl9tZXRob2RJbnZva2VycyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbiAgICAvLyBUcmFja3MgbWV0aG9kcyB3aGljaCB0aGUgdXNlciBoYXMgY2FsbGVkIGJ1dCB3aG9zZSByZXN1bHQgbWVzc2FnZXMgaGF2ZSBub3RcbiAgICAvLyBhcnJpdmVkIHlldC5cbiAgICAvL1xuICAgIC8vIF9vdXRzdGFuZGluZ01ldGhvZEJsb2NrcyBpcyBhbiBhcnJheSBvZiBibG9ja3Mgb2YgbWV0aG9kcy4gRWFjaCBibG9ja1xuICAgIC8vIHJlcHJlc2VudHMgYSBzZXQgb2YgbWV0aG9kcyB0aGF0IGNhbiBydW4gYXQgdGhlIHNhbWUgdGltZS4gVGhlIGZpcnN0IGJsb2NrXG4gICAgLy8gcmVwcmVzZW50cyB0aGUgbWV0aG9kcyB3aGljaCBhcmUgY3VycmVudGx5IGluIGZsaWdodDsgc3Vic2VxdWVudCBibG9ja3NcbiAgICAvLyBtdXN0IHdhaXQgZm9yIHByZXZpb3VzIGJsb2NrcyB0byBiZSBmdWxseSBmaW5pc2hlZCBiZWZvcmUgdGhleSBjYW4gYmUgc2VudFxuICAgIC8vIHRvIHRoZSBzZXJ2ZXIuXG4gICAgLy9cbiAgICAvLyBFYWNoIGJsb2NrIGlzIGFuIG9iamVjdCB3aXRoIHRoZSBmb2xsb3dpbmcgZmllbGRzOlxuICAgIC8vIC0gbWV0aG9kczogYSBsaXN0IG9mIE1ldGhvZEludm9rZXIgb2JqZWN0c1xuICAgIC8vIC0gd2FpdDogYSBib29sZWFuOyBpZiB0cnVlLCB0aGlzIGJsb2NrIGhhZCBhIHNpbmdsZSBtZXRob2QgaW52b2tlZCB3aXRoXG4gICAgLy8gICAgICAgICB0aGUgXCJ3YWl0XCIgb3B0aW9uXG4gICAgLy9cbiAgICAvLyBUaGVyZSB3aWxsIG5ldmVyIGJlIGFkamFjZW50IGJsb2NrcyB3aXRoIHdhaXQ9ZmFsc2UsIGJlY2F1c2UgdGhlIG9ubHkgdGhpbmdcbiAgICAvLyB0aGF0IG1ha2VzIG1ldGhvZHMgbmVlZCB0byBiZSBzZXJpYWxpemVkIGlzIGEgd2FpdCBtZXRob2QuXG4gICAgLy9cbiAgICAvLyBNZXRob2RzIGFyZSByZW1vdmVkIGZyb20gdGhlIGZpcnN0IGJsb2NrIHdoZW4gdGhlaXIgXCJyZXN1bHRcIiBpc1xuICAgIC8vIHJlY2VpdmVkLiBUaGUgZW50aXJlIGZpcnN0IGJsb2NrIGlzIG9ubHkgcmVtb3ZlZCB3aGVuIGFsbCBvZiB0aGUgaW4tZmxpZ2h0XG4gICAgLy8gbWV0aG9kcyBoYXZlIHJlY2VpdmVkIHRoZWlyIHJlc3VsdHMgKHNvIHRoZSBcIm1ldGhvZHNcIiBsaXN0IGlzIGVtcHR5KSAqQU5EKlxuICAgIC8vIGFsbCBvZiB0aGUgZGF0YSB3cml0dGVuIGJ5IHRob3NlIG1ldGhvZHMgYXJlIHZpc2libGUgaW4gdGhlIGxvY2FsIGNhY2hlLiBTb1xuICAgIC8vIGl0IGlzIHBvc3NpYmxlIGZvciB0aGUgZmlyc3QgYmxvY2sncyBtZXRob2RzIGxpc3QgdG8gYmUgZW1wdHksIGlmIHdlIGFyZVxuICAgIC8vIHN0aWxsIHdhaXRpbmcgZm9yIHNvbWUgb2JqZWN0cyB0byBxdWllc2NlLlxuICAgIC8vXG4gICAgLy8gRXhhbXBsZTpcbiAgICAvLyAgX291dHN0YW5kaW5nTWV0aG9kQmxvY2tzID0gW1xuICAgIC8vICAgIHt3YWl0OiBmYWxzZSwgbWV0aG9kczogW119LFxuICAgIC8vICAgIHt3YWl0OiB0cnVlLCBtZXRob2RzOiBbPE1ldGhvZEludm9rZXIgZm9yICdsb2dpbic+XX0sXG4gICAgLy8gICAge3dhaXQ6IGZhbHNlLCBtZXRob2RzOiBbPE1ldGhvZEludm9rZXIgZm9yICdmb28nPixcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TWV0aG9kSW52b2tlciBmb3IgJ2Jhcic+XX1dXG4gICAgLy8gVGhpcyBtZWFucyB0aGF0IHRoZXJlIHdlcmUgc29tZSBtZXRob2RzIHdoaWNoIHdlcmUgc2VudCB0byB0aGUgc2VydmVyIGFuZFxuICAgIC8vIHdoaWNoIGhhdmUgcmV0dXJuZWQgdGhlaXIgcmVzdWx0cywgYnV0IHNvbWUgb2YgdGhlIGRhdGEgd3JpdHRlbiBieVxuICAgIC8vIHRoZSBtZXRob2RzIG1heSBub3QgYmUgdmlzaWJsZSBpbiB0aGUgbG9jYWwgY2FjaGUuIE9uY2UgYWxsIHRoYXQgZGF0YSBpc1xuICAgIC8vIHZpc2libGUsIHdlIHdpbGwgc2VuZCBhICdsb2dpbicgbWV0aG9kLiBPbmNlIHRoZSBsb2dpbiBtZXRob2QgaGFzIHJldHVybmVkXG4gICAgLy8gYW5kIGFsbCB0aGUgZGF0YSBpcyB2aXNpYmxlIChpbmNsdWRpbmcgcmUtcnVubmluZyBzdWJzIGlmIHVzZXJJZCBjaGFuZ2VzKSxcbiAgICAvLyB3ZSB3aWxsIHNlbmQgdGhlICdmb28nIGFuZCAnYmFyJyBtZXRob2RzIGluIHBhcmFsbGVsLlxuICAgIHNlbGYuX291dHN0YW5kaW5nTWV0aG9kQmxvY2tzID0gW107XG5cbiAgICAvLyBtZXRob2QgSUQgLT4gYXJyYXkgb2Ygb2JqZWN0cyB3aXRoIGtleXMgJ2NvbGxlY3Rpb24nIGFuZCAnaWQnLCBsaXN0aW5nXG4gICAgLy8gZG9jdW1lbnRzIHdyaXR0ZW4gYnkgYSBnaXZlbiBtZXRob2QncyBzdHViLiBrZXlzIGFyZSBhc3NvY2lhdGVkIHdpdGhcbiAgICAvLyBtZXRob2RzIHdob3NlIHN0dWIgd3JvdGUgYXQgbGVhc3Qgb25lIGRvY3VtZW50LCBhbmQgd2hvc2UgZGF0YS1kb25lIG1lc3NhZ2VcbiAgICAvLyBoYXMgbm90IHlldCBiZWVuIHJlY2VpdmVkLlxuICAgIHNlbGYuX2RvY3VtZW50c1dyaXR0ZW5CeVN0dWIgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIC8vIGNvbGxlY3Rpb24gLT4gSWRNYXAgb2YgXCJzZXJ2ZXIgZG9jdW1lbnRcIiBvYmplY3QuIEEgXCJzZXJ2ZXIgZG9jdW1lbnRcIiBoYXM6XG4gICAgLy8gLSBcImRvY3VtZW50XCI6IHRoZSB2ZXJzaW9uIG9mIHRoZSBkb2N1bWVudCBhY2NvcmRpbmcgdGhlXG4gICAgLy8gICBzZXJ2ZXIgKGllLCB0aGUgc25hcHNob3QgYmVmb3JlIGEgc3R1YiB3cm90ZSBpdCwgYW1lbmRlZCBieSBhbnkgY2hhbmdlc1xuICAgIC8vICAgcmVjZWl2ZWQgZnJvbSB0aGUgc2VydmVyKVxuICAgIC8vICAgSXQgaXMgdW5kZWZpbmVkIGlmIHdlIHRoaW5rIHRoZSBkb2N1bWVudCBkb2VzIG5vdCBleGlzdFxuICAgIC8vIC0gXCJ3cml0dGVuQnlTdHVic1wiOiBhIHNldCBvZiBtZXRob2QgSURzIHdob3NlIHN0dWJzIHdyb3RlIHRvIHRoZSBkb2N1bWVudFxuICAgIC8vICAgd2hvc2UgXCJkYXRhIGRvbmVcIiBtZXNzYWdlcyBoYXZlIG5vdCB5ZXQgYmVlbiBwcm9jZXNzZWRcbiAgICBzZWxmLl9zZXJ2ZXJEb2N1bWVudHMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG4gICAgLy8gQXJyYXkgb2YgY2FsbGJhY2tzIHRvIGJlIGNhbGxlZCBhZnRlciB0aGUgbmV4dCB1cGRhdGUgb2YgdGhlIGxvY2FsXG4gICAgLy8gY2FjaGUuIFVzZWQgZm9yOlxuICAgIC8vICAtIENhbGxpbmcgbWV0aG9kSW52b2tlci5kYXRhVmlzaWJsZSBhbmQgc3ViIHJlYWR5IGNhbGxiYWNrcyBhZnRlclxuICAgIC8vICAgIHRoZSByZWxldmFudCBkYXRhIGlzIGZsdXNoZWQuXG4gICAgLy8gIC0gSW52b2tpbmcgdGhlIGNhbGxiYWNrcyBvZiBcImhhbGYtZmluaXNoZWRcIiBtZXRob2RzIGFmdGVyIHJlY29ubmVjdFxuICAgIC8vICAgIHF1aWVzY2VuY2UuIFNwZWNpZmljYWxseSwgbWV0aG9kcyB3aG9zZSByZXN1bHQgd2FzIHJlY2VpdmVkIG92ZXIgdGhlIG9sZFxuICAgIC8vICAgIGNvbm5lY3Rpb24gKHNvIHdlIGRvbid0IHJlLXNlbmQgaXQpIGJ1dCB3aG9zZSBkYXRhIGhhZCBub3QgYmVlbiBtYWRlXG4gICAgLy8gICAgdmlzaWJsZS5cbiAgICBzZWxmLl9hZnRlclVwZGF0ZUNhbGxiYWNrcyA9IFtdO1xuXG4gICAgLy8gSW4gdHdvIGNvbnRleHRzLCB3ZSBidWZmZXIgYWxsIGluY29taW5nIGRhdGEgbWVzc2FnZXMgYW5kIHRoZW4gcHJvY2VzcyB0aGVtXG4gICAgLy8gYWxsIGF0IG9uY2UgaW4gYSBzaW5nbGUgdXBkYXRlOlxuICAgIC8vICAgLSBEdXJpbmcgcmVjb25uZWN0LCB3ZSBidWZmZXIgYWxsIGRhdGEgbWVzc2FnZXMgdW50aWwgYWxsIHN1YnMgdGhhdCBoYWRcbiAgICAvLyAgICAgYmVlbiByZWFkeSBiZWZvcmUgcmVjb25uZWN0IGFyZSByZWFkeSBhZ2FpbiwgYW5kIGFsbCBtZXRob2RzIHRoYXQgYXJlXG4gICAgLy8gICAgIGFjdGl2ZSBoYXZlIHJldHVybmVkIHRoZWlyIFwiZGF0YSBkb25lIG1lc3NhZ2VcIjsgdGhlblxuICAgIC8vICAgLSBEdXJpbmcgdGhlIGV4ZWN1dGlvbiBvZiBhIFwid2FpdFwiIG1ldGhvZCwgd2UgYnVmZmVyIGFsbCBkYXRhIG1lc3NhZ2VzXG4gICAgLy8gICAgIHVudGlsIHRoZSB3YWl0IG1ldGhvZCBnZXRzIGl0cyBcImRhdGEgZG9uZVwiIG1lc3NhZ2UuIChJZiB0aGUgd2FpdCBtZXRob2RcbiAgICAvLyAgICAgb2NjdXJzIGR1cmluZyByZWNvbm5lY3QsIGl0IGRvZXNuJ3QgZ2V0IGFueSBzcGVjaWFsIGhhbmRsaW5nLilcbiAgICAvLyBhbGwgZGF0YSBtZXNzYWdlcyBhcmUgcHJvY2Vzc2VkIGluIG9uZSB1cGRhdGUuXG4gICAgLy9cbiAgICAvLyBUaGUgZm9sbG93aW5nIGZpZWxkcyBhcmUgdXNlZCBmb3IgdGhpcyBcInF1aWVzY2VuY2VcIiBwcm9jZXNzLlxuXG4gICAgLy8gVGhpcyBidWZmZXJzIHRoZSBtZXNzYWdlcyB0aGF0IGFyZW4ndCBiZWluZyBwcm9jZXNzZWQgeWV0LlxuICAgIHNlbGYuX21lc3NhZ2VzQnVmZmVyZWRVbnRpbFF1aWVzY2VuY2UgPSBbXTtcbiAgICAvLyBNYXAgZnJvbSBtZXRob2QgSUQgLT4gdHJ1ZS4gTWV0aG9kcyBhcmUgcmVtb3ZlZCBmcm9tIHRoaXMgd2hlbiB0aGVpclxuICAgIC8vIFwiZGF0YSBkb25lXCIgbWVzc2FnZSBpcyByZWNlaXZlZCwgYW5kIHdlIHdpbGwgbm90IHF1aWVzY2UgdW50aWwgaXQgaXNcbiAgICAvLyBlbXB0eS5cbiAgICBzZWxmLl9tZXRob2RzQmxvY2tpbmdRdWllc2NlbmNlID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAvLyBtYXAgZnJvbSBzdWIgSUQgLT4gdHJ1ZSBmb3Igc3VicyB0aGF0IHdlcmUgcmVhZHkgKGllLCBjYWxsZWQgdGhlIHN1YlxuICAgIC8vIHJlYWR5IGNhbGxiYWNrKSBiZWZvcmUgcmVjb25uZWN0IGJ1dCBoYXZlbid0IGJlY29tZSByZWFkeSBhZ2FpbiB5ZXRcbiAgICBzZWxmLl9zdWJzQmVpbmdSZXZpdmVkID0gT2JqZWN0LmNyZWF0ZShudWxsKTsgLy8gbWFwIGZyb20gc3ViLl9pZCAtPiB0cnVlXG4gICAgLy8gaWYgdHJ1ZSwgdGhlIG5leHQgZGF0YSB1cGRhdGUgc2hvdWxkIHJlc2V0IGFsbCBzdG9yZXMuIChzZXQgZHVyaW5nXG4gICAgLy8gcmVjb25uZWN0LilcbiAgICBzZWxmLl9yZXNldFN0b3JlcyA9IGZhbHNlO1xuXG4gICAgLy8gbmFtZSAtPiBhcnJheSBvZiB1cGRhdGVzIGZvciAoeWV0IHRvIGJlIGNyZWF0ZWQpIGNvbGxlY3Rpb25zXG4gICAgc2VsZi5fdXBkYXRlc0ZvclVua25vd25TdG9yZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIC8vIGlmIHdlJ3JlIGJsb2NraW5nIGEgbWlncmF0aW9uLCB0aGUgcmV0cnkgZnVuY1xuICAgIHNlbGYuX3JldHJ5TWlncmF0ZSA9IG51bGw7XG5cbiAgICBzZWxmLl9fZmx1c2hCdWZmZXJlZFdyaXRlcyA9IE1ldGVvci5iaW5kRW52aXJvbm1lbnQoXG4gICAgICBzZWxmLl9mbHVzaEJ1ZmZlcmVkV3JpdGVzLFxuICAgICAgJ2ZsdXNoaW5nIEREUCBidWZmZXJlZCB3cml0ZXMnLFxuICAgICAgc2VsZlxuICAgICk7XG4gICAgLy8gQ29sbGVjdGlvbiBuYW1lIC0+IGFycmF5IG9mIG1lc3NhZ2VzLlxuICAgIHNlbGYuX2J1ZmZlcmVkV3JpdGVzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAvLyBXaGVuIGN1cnJlbnQgYnVmZmVyIG9mIHVwZGF0ZXMgbXVzdCBiZSBmbHVzaGVkIGF0LCBpbiBtcyB0aW1lc3RhbXAuXG4gICAgc2VsZi5fYnVmZmVyZWRXcml0ZXNGbHVzaEF0ID0gbnVsbDtcbiAgICAvLyBUaW1lb3V0IGhhbmRsZSBmb3IgdGhlIG5leHQgcHJvY2Vzc2luZyBvZiBhbGwgcGVuZGluZyB3cml0ZXNcbiAgICBzZWxmLl9idWZmZXJlZFdyaXRlc0ZsdXNoSGFuZGxlID0gbnVsbDtcblxuICAgIHNlbGYuX2J1ZmZlcmVkV3JpdGVzSW50ZXJ2YWwgPSBvcHRpb25zLmJ1ZmZlcmVkV3JpdGVzSW50ZXJ2YWw7XG4gICAgc2VsZi5fYnVmZmVyZWRXcml0ZXNNYXhBZ2UgPSBvcHRpb25zLmJ1ZmZlcmVkV3JpdGVzTWF4QWdlO1xuXG4gICAgLy8gbWV0YWRhdGEgZm9yIHN1YnNjcmlwdGlvbnMuICBNYXAgZnJvbSBzdWIgSUQgdG8gb2JqZWN0IHdpdGgga2V5czpcbiAgICAvLyAgIC0gaWRcbiAgICAvLyAgIC0gbmFtZVxuICAgIC8vICAgLSBwYXJhbXNcbiAgICAvLyAgIC0gaW5hY3RpdmUgKGlmIHRydWUsIHdpbGwgYmUgY2xlYW5lZCB1cCBpZiBub3QgcmV1c2VkIGluIHJlLXJ1bilcbiAgICAvLyAgIC0gcmVhZHkgKGhhcyB0aGUgJ3JlYWR5JyBtZXNzYWdlIGJlZW4gcmVjZWl2ZWQ/KVxuICAgIC8vICAgLSByZWFkeUNhbGxiYWNrIChhbiBvcHRpb25hbCBjYWxsYmFjayB0byBjYWxsIHdoZW4gcmVhZHkpXG4gICAgLy8gICAtIGVycm9yQ2FsbGJhY2sgKGFuIG9wdGlvbmFsIGNhbGxiYWNrIHRvIGNhbGwgaWYgdGhlIHN1YiB0ZXJtaW5hdGVzIHdpdGhcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgYW4gZXJyb3IsIFhYWCBDT01QQVQgV0lUSCAxLjAuMy4xKVxuICAgIC8vICAgLSBzdG9wQ2FsbGJhY2sgKGFuIG9wdGlvbmFsIGNhbGxiYWNrIHRvIGNhbGwgd2hlbiB0aGUgc3ViIHRlcm1pbmF0ZXNcbiAgICAvLyAgICAgZm9yIGFueSByZWFzb24sIHdpdGggYW4gZXJyb3IgYXJndW1lbnQgaWYgYW4gZXJyb3IgdHJpZ2dlcmVkIHRoZSBzdG9wKVxuICAgIHNlbGYuX3N1YnNjcmlwdGlvbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG4gICAgLy8gUmVhY3RpdmUgdXNlcklkLlxuICAgIHNlbGYuX3VzZXJJZCA9IG51bGw7XG4gICAgc2VsZi5fdXNlcklkRGVwcyA9IG5ldyBUcmFja2VyLkRlcGVuZGVuY3koKTtcblxuICAgIC8vIEJsb2NrIGF1dG8tcmVsb2FkIHdoaWxlIHdlJ3JlIHdhaXRpbmcgZm9yIG1ldGhvZCByZXNwb25zZXMuXG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCAmJlxuICAgICAgICBQYWNrYWdlLnJlbG9hZCAmJlxuICAgICAgICAhIG9wdGlvbnMucmVsb2FkV2l0aE91dHN0YW5kaW5nKSB7XG4gICAgICBQYWNrYWdlLnJlbG9hZC5SZWxvYWQuX29uTWlncmF0ZShyZXRyeSA9PiB7XG4gICAgICAgIGlmICghIHNlbGYuX3JlYWR5VG9NaWdyYXRlKCkpIHtcbiAgICAgICAgICBpZiAoc2VsZi5fcmV0cnlNaWdyYXRlKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUd28gbWlncmF0aW9ucyBpbiBwcm9ncmVzcz8nKTtcbiAgICAgICAgICBzZWxmLl9yZXRyeU1pZ3JhdGUgPSByZXRyeTtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIFt0cnVlXTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdmFyIG9uRGlzY29ubmVjdCA9ICgpID0+IHtcbiAgICAgIGlmIChzZWxmLl9oZWFydGJlYXQpIHtcbiAgICAgICAgc2VsZi5faGVhcnRiZWF0LnN0b3AoKTtcbiAgICAgICAgc2VsZi5faGVhcnRiZWF0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgc2VsZi5fc3RyZWFtLm9uKFxuICAgICAgICAnbWVzc2FnZScsXG4gICAgICAgIE1ldGVvci5iaW5kRW52aXJvbm1lbnQoXG4gICAgICAgICAgdGhpcy5vbk1lc3NhZ2UuYmluZCh0aGlzKSxcbiAgICAgICAgICAnaGFuZGxpbmcgRERQIG1lc3NhZ2UnXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgICBzZWxmLl9zdHJlYW0ub24oXG4gICAgICAgICdyZXNldCcsXG4gICAgICAgIE1ldGVvci5iaW5kRW52aXJvbm1lbnQodGhpcy5vblJlc2V0LmJpbmQodGhpcyksICdoYW5kbGluZyBERFAgcmVzZXQnKVxuICAgICAgKTtcbiAgICAgIHNlbGYuX3N0cmVhbS5vbihcbiAgICAgICAgJ2Rpc2Nvbm5lY3QnLFxuICAgICAgICBNZXRlb3IuYmluZEVudmlyb25tZW50KG9uRGlzY29ubmVjdCwgJ2hhbmRsaW5nIEREUCBkaXNjb25uZWN0JylcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNlbGYuX3N0cmVhbS5vbignbWVzc2FnZScsIHRoaXMub25NZXNzYWdlLmJpbmQodGhpcykpO1xuICAgICAgc2VsZi5fc3RyZWFtLm9uKCdyZXNldCcsIHRoaXMub25SZXNldC5iaW5kKHRoaXMpKTtcbiAgICAgIHNlbGYuX3N0cmVhbS5vbignZGlzY29ubmVjdCcsIG9uRGlzY29ubmVjdCk7XG4gICAgfVxuICB9XG5cbiAgLy8gJ25hbWUnIGlzIHRoZSBuYW1lIG9mIHRoZSBkYXRhIG9uIHRoZSB3aXJlIHRoYXQgc2hvdWxkIGdvIGluIHRoZVxuICAvLyBzdG9yZS4gJ3dyYXBwZWRTdG9yZScgc2hvdWxkIGJlIGFuIG9iamVjdCB3aXRoIG1ldGhvZHMgYmVnaW5VcGRhdGUsIHVwZGF0ZSxcbiAgLy8gZW5kVXBkYXRlLCBzYXZlT3JpZ2luYWxzLCByZXRyaWV2ZU9yaWdpbmFscy4gc2VlIENvbGxlY3Rpb24gZm9yIGFuIGV4YW1wbGUuXG4gIHJlZ2lzdGVyU3RvcmUobmFtZSwgd3JhcHBlZFN0b3JlKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgaWYgKG5hbWUgaW4gc2VsZi5fc3RvcmVzKSByZXR1cm4gZmFsc2U7XG5cbiAgICAvLyBXcmFwIHRoZSBpbnB1dCBvYmplY3QgaW4gYW4gb2JqZWN0IHdoaWNoIG1ha2VzIGFueSBzdG9yZSBtZXRob2Qgbm90XG4gICAgLy8gaW1wbGVtZW50ZWQgYnkgJ3N0b3JlJyBpbnRvIGEgbm8tb3AuXG4gICAgdmFyIHN0b3JlID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICBbICd1cGRhdGUnLFxuICAgICAgJ2JlZ2luVXBkYXRlJyxcbiAgICAgICdlbmRVcGRhdGUnLFxuICAgICAgJ3NhdmVPcmlnaW5hbHMnLFxuICAgICAgJ3JldHJpZXZlT3JpZ2luYWxzJyxcbiAgICAgICdnZXREb2MnLFxuICAgICAgJ19nZXRDb2xsZWN0aW9uJ1xuICAgIF0uZm9yRWFjaChtZXRob2QgPT4ge1xuICAgICAgc3RvcmVbbWV0aG9kXSA9ICguLi5hcmdzKSA9PiB7XG4gICAgICAgIGlmICh3cmFwcGVkU3RvcmVbbWV0aG9kXSkge1xuICAgICAgICAgIHJldHVybiB3cmFwcGVkU3RvcmVbbWV0aG9kXSguLi5hcmdzKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9KTtcblxuICAgIHNlbGYuX3N0b3Jlc1tuYW1lXSA9IHN0b3JlO1xuXG4gICAgdmFyIHF1ZXVlZCA9IHNlbGYuX3VwZGF0ZXNGb3JVbmtub3duU3RvcmVzW25hbWVdO1xuICAgIGlmIChxdWV1ZWQpIHtcbiAgICAgIHN0b3JlLmJlZ2luVXBkYXRlKHF1ZXVlZC5sZW5ndGgsIGZhbHNlKTtcbiAgICAgIHF1ZXVlZC5mb3JFYWNoKG1zZyA9PiB7XG4gICAgICAgIHN0b3JlLnVwZGF0ZShtc2cpO1xuICAgICAgfSk7XG4gICAgICBzdG9yZS5lbmRVcGRhdGUoKTtcbiAgICAgIGRlbGV0ZSBzZWxmLl91cGRhdGVzRm9yVW5rbm93blN0b3Jlc1tuYW1lXTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbWVtYmVyT2YgTWV0ZW9yXG4gICAqIEBpbXBvcnRGcm9tUGFja2FnZSBtZXRlb3JcbiAgICogQGFsaWFzIE1ldGVvci5zdWJzY3JpYmVcbiAgICogQHN1bW1hcnkgU3Vic2NyaWJlIHRvIGEgcmVjb3JkIHNldC4gIFJldHVybnMgYSBoYW5kbGUgdGhhdCBwcm92aWRlc1xuICAgKiBgc3RvcCgpYCBhbmQgYHJlYWR5KClgIG1ldGhvZHMuXG4gICAqIEBsb2N1cyBDbGllbnRcbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgTmFtZSBvZiB0aGUgc3Vic2NyaXB0aW9uLiAgTWF0Y2hlcyB0aGUgbmFtZSBvZiB0aGVcbiAgICogc2VydmVyJ3MgYHB1Ymxpc2goKWAgY2FsbC5cbiAgICogQHBhcmFtIHtFSlNPTmFibGV9IFthcmcxLGFyZzIuLi5dIE9wdGlvbmFsIGFyZ3VtZW50cyBwYXNzZWQgdG8gcHVibGlzaGVyXG4gICAqIGZ1bmN0aW9uIG9uIHNlcnZlci5cbiAgICogQHBhcmFtIHtGdW5jdGlvbnxPYmplY3R9IFtjYWxsYmFja3NdIE9wdGlvbmFsLiBNYXkgaW5jbHVkZSBgb25TdG9wYFxuICAgKiBhbmQgYG9uUmVhZHlgIGNhbGxiYWNrcy4gSWYgdGhlcmUgaXMgYW4gZXJyb3IsIGl0IGlzIHBhc3NlZCBhcyBhblxuICAgKiBhcmd1bWVudCB0byBgb25TdG9wYC4gSWYgYSBmdW5jdGlvbiBpcyBwYXNzZWQgaW5zdGVhZCBvZiBhbiBvYmplY3QsIGl0XG4gICAqIGlzIGludGVycHJldGVkIGFzIGFuIGBvblJlYWR5YCBjYWxsYmFjay5cbiAgICovXG4gIHN1YnNjcmliZShuYW1lIC8qIC4uIFthcmd1bWVudHNdIC4uIChjYWxsYmFja3xjYWxsYmFja3MpICovKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgdmFyIHBhcmFtcyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICB2YXIgY2FsbGJhY2tzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICBpZiAocGFyYW1zLmxlbmd0aCkge1xuICAgICAgdmFyIGxhc3RQYXJhbSA9IHBhcmFtc1twYXJhbXMubGVuZ3RoIC0gMV07XG4gICAgICBpZiAodHlwZW9mIGxhc3RQYXJhbSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBjYWxsYmFja3Mub25SZWFkeSA9IHBhcmFtcy5wb3AoKTtcbiAgICAgIH0gZWxzZSBpZiAobGFzdFBhcmFtICYmIFtcbiAgICAgICAgbGFzdFBhcmFtLm9uUmVhZHksXG4gICAgICAgIC8vIFhYWCBDT01QQVQgV0lUSCAxLjAuMy4xIG9uRXJyb3IgdXNlZCB0byBleGlzdCwgYnV0IG5vdyB3ZSB1c2VcbiAgICAgICAgLy8gb25TdG9wIHdpdGggYW4gZXJyb3IgY2FsbGJhY2sgaW5zdGVhZC5cbiAgICAgICAgbGFzdFBhcmFtLm9uRXJyb3IsXG4gICAgICAgIGxhc3RQYXJhbS5vblN0b3BcbiAgICAgIF0uc29tZShmID0+IHR5cGVvZiBmID09PSBcImZ1bmN0aW9uXCIpKSB7XG4gICAgICAgIGNhbGxiYWNrcyA9IHBhcmFtcy5wb3AoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBJcyB0aGVyZSBhbiBleGlzdGluZyBzdWIgd2l0aCB0aGUgc2FtZSBuYW1lIGFuZCBwYXJhbSwgcnVuIGluIGFuXG4gICAgLy8gaW52YWxpZGF0ZWQgQ29tcHV0YXRpb24/IFRoaXMgd2lsbCBoYXBwZW4gaWYgd2UgYXJlIHJlcnVubmluZyBhblxuICAgIC8vIGV4aXN0aW5nIGNvbXB1dGF0aW9uLlxuICAgIC8vXG4gICAgLy8gRm9yIGV4YW1wbGUsIGNvbnNpZGVyIGEgcmVydW4gb2Y6XG4gICAgLy9cbiAgICAvLyAgICAgVHJhY2tlci5hdXRvcnVuKGZ1bmN0aW9uICgpIHtcbiAgICAvLyAgICAgICBNZXRlb3Iuc3Vic2NyaWJlKFwiZm9vXCIsIFNlc3Npb24uZ2V0KFwiZm9vXCIpKTtcbiAgICAvLyAgICAgICBNZXRlb3Iuc3Vic2NyaWJlKFwiYmFyXCIsIFNlc3Npb24uZ2V0KFwiYmFyXCIpKTtcbiAgICAvLyAgICAgfSk7XG4gICAgLy9cbiAgICAvLyBJZiBcImZvb1wiIGhhcyBjaGFuZ2VkIGJ1dCBcImJhclwiIGhhcyBub3QsIHdlIHdpbGwgbWF0Y2ggdGhlIFwiYmFyXCJcbiAgICAvLyBzdWJjcmliZSB0byBhbiBleGlzdGluZyBpbmFjdGl2ZSBzdWJzY3JpcHRpb24gaW4gb3JkZXIgdG8gbm90XG4gICAgLy8gdW5zdWIgYW5kIHJlc3ViIHRoZSBzdWJzY3JpcHRpb24gdW5uZWNlc3NhcmlseS5cbiAgICAvL1xuICAgIC8vIFdlIG9ubHkgbG9vayBmb3Igb25lIHN1Y2ggc3ViOyBpZiB0aGVyZSBhcmUgTiBhcHBhcmVudGx5LWlkZW50aWNhbCBzdWJzXG4gICAgLy8gYmVpbmcgaW52YWxpZGF0ZWQsIHdlIHdpbGwgcmVxdWlyZSBOIG1hdGNoaW5nIHN1YnNjcmliZSBjYWxscyB0byBrZWVwXG4gICAgLy8gdGhlbSBhbGwgYWN0aXZlLlxuICAgIHZhciBleGlzdGluZztcbiAgICBrZXlzKHNlbGYuX3N1YnNjcmlwdGlvbnMpLnNvbWUoaWQgPT4ge1xuICAgICAgY29uc3Qgc3ViID0gc2VsZi5fc3Vic2NyaXB0aW9uc1tpZF07XG4gICAgICBpZiAoc3ViLmluYWN0aXZlICYmXG4gICAgICAgICAgc3ViLm5hbWUgPT09IG5hbWUgJiZcbiAgICAgICAgICBFSlNPTi5lcXVhbHMoc3ViLnBhcmFtcywgcGFyYW1zKSkge1xuICAgICAgICByZXR1cm4gZXhpc3RpbmcgPSBzdWI7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB2YXIgaWQ7XG4gICAgaWYgKGV4aXN0aW5nKSB7XG4gICAgICBpZCA9IGV4aXN0aW5nLmlkO1xuICAgICAgZXhpc3RpbmcuaW5hY3RpdmUgPSBmYWxzZTsgLy8gcmVhY3RpdmF0ZVxuXG4gICAgICBpZiAoY2FsbGJhY2tzLm9uUmVhZHkpIHtcbiAgICAgICAgLy8gSWYgdGhlIHN1YiBpcyBub3QgYWxyZWFkeSByZWFkeSwgcmVwbGFjZSBhbnkgcmVhZHkgY2FsbGJhY2sgd2l0aCB0aGVcbiAgICAgICAgLy8gb25lIHByb3ZpZGVkIG5vdy4gKEl0J3Mgbm90IHJlYWxseSBjbGVhciB3aGF0IHVzZXJzIHdvdWxkIGV4cGVjdCBmb3JcbiAgICAgICAgLy8gYW4gb25SZWFkeSBjYWxsYmFjayBpbnNpZGUgYW4gYXV0b3J1bjsgdGhlIHNlbWFudGljcyB3ZSBwcm92aWRlIGlzXG4gICAgICAgIC8vIHRoYXQgYXQgdGhlIHRpbWUgdGhlIHN1YiBmaXJzdCBiZWNvbWVzIHJlYWR5LCB3ZSBjYWxsIHRoZSBsYXN0XG4gICAgICAgIC8vIG9uUmVhZHkgY2FsbGJhY2sgcHJvdmlkZWQsIGlmIGFueS4pXG4gICAgICAgIC8vIElmIHRoZSBzdWIgaXMgYWxyZWFkeSByZWFkeSwgcnVuIHRoZSByZWFkeSBjYWxsYmFjayByaWdodCBhd2F5LlxuICAgICAgICAvLyBJdCBzZWVtcyB0aGF0IHVzZXJzIHdvdWxkIGV4cGVjdCBhbiBvblJlYWR5IGNhbGxiYWNrIGluc2lkZSBhblxuICAgICAgICAvLyBhdXRvcnVuIHRvIHRyaWdnZXIgb25jZSB0aGUgdGhlIHN1YiBmaXJzdCBiZWNvbWVzIHJlYWR5IGFuZCBhbHNvXG4gICAgICAgIC8vIHdoZW4gcmUtc3VicyBoYXBwZW5zLlxuICAgICAgICBpZiAoZXhpc3RpbmcucmVhZHkpIHtcbiAgICAgICAgICBjYWxsYmFja3Mub25SZWFkeSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGV4aXN0aW5nLnJlYWR5Q2FsbGJhY2sgPSBjYWxsYmFja3Mub25SZWFkeTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBYWFggQ09NUEFUIFdJVEggMS4wLjMuMSB3ZSB1c2VkIHRvIGhhdmUgb25FcnJvciBidXQgbm93IHdlIGNhbGxcbiAgICAgIC8vIG9uU3RvcCB3aXRoIGFuIG9wdGlvbmFsIGVycm9yIGFyZ3VtZW50XG4gICAgICBpZiAoY2FsbGJhY2tzLm9uRXJyb3IpIHtcbiAgICAgICAgLy8gUmVwbGFjZSBleGlzdGluZyBjYWxsYmFjayBpZiBhbnksIHNvIHRoYXQgZXJyb3JzIGFyZW4ndFxuICAgICAgICAvLyBkb3VibGUtcmVwb3J0ZWQuXG4gICAgICAgIGV4aXN0aW5nLmVycm9yQ2FsbGJhY2sgPSBjYWxsYmFja3Mub25FcnJvcjtcbiAgICAgIH1cblxuICAgICAgaWYgKGNhbGxiYWNrcy5vblN0b3ApIHtcbiAgICAgICAgZXhpc3Rpbmcuc3RvcENhbGxiYWNrID0gY2FsbGJhY2tzLm9uU3RvcDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gTmV3IHN1YiEgR2VuZXJhdGUgYW4gaWQsIHNhdmUgaXQgbG9jYWxseSwgYW5kIHNlbmQgbWVzc2FnZS5cbiAgICAgIGlkID0gUmFuZG9tLmlkKCk7XG4gICAgICBzZWxmLl9zdWJzY3JpcHRpb25zW2lkXSA9IHtcbiAgICAgICAgaWQ6IGlkLFxuICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICBwYXJhbXM6IEVKU09OLmNsb25lKHBhcmFtcyksXG4gICAgICAgIGluYWN0aXZlOiBmYWxzZSxcbiAgICAgICAgcmVhZHk6IGZhbHNlLFxuICAgICAgICByZWFkeURlcHM6IG5ldyBUcmFja2VyLkRlcGVuZGVuY3koKSxcbiAgICAgICAgcmVhZHlDYWxsYmFjazogY2FsbGJhY2tzLm9uUmVhZHksXG4gICAgICAgIC8vIFhYWCBDT01QQVQgV0lUSCAxLjAuMy4xICNlcnJvckNhbGxiYWNrXG4gICAgICAgIGVycm9yQ2FsbGJhY2s6IGNhbGxiYWNrcy5vbkVycm9yLFxuICAgICAgICBzdG9wQ2FsbGJhY2s6IGNhbGxiYWNrcy5vblN0b3AsXG4gICAgICAgIGNvbm5lY3Rpb246IHNlbGYsXG4gICAgICAgIHJlbW92ZSgpIHtcbiAgICAgICAgICBkZWxldGUgdGhpcy5jb25uZWN0aW9uLl9zdWJzY3JpcHRpb25zW3RoaXMuaWRdO1xuICAgICAgICAgIHRoaXMucmVhZHkgJiYgdGhpcy5yZWFkeURlcHMuY2hhbmdlZCgpO1xuICAgICAgICB9LFxuICAgICAgICBzdG9wKCkge1xuICAgICAgICAgIHRoaXMuY29ubmVjdGlvbi5fc2VuZCh7IG1zZzogJ3Vuc3ViJywgaWQ6IGlkIH0pO1xuICAgICAgICAgIHRoaXMucmVtb3ZlKCk7XG5cbiAgICAgICAgICBpZiAoY2FsbGJhY2tzLm9uU3RvcCkge1xuICAgICAgICAgICAgY2FsbGJhY2tzLm9uU3RvcCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHNlbGYuX3NlbmQoeyBtc2c6ICdzdWInLCBpZDogaWQsIG5hbWU6IG5hbWUsIHBhcmFtczogcGFyYW1zIH0pO1xuICAgIH1cblxuICAgIC8vIHJldHVybiBhIGhhbmRsZSB0byB0aGUgYXBwbGljYXRpb24uXG4gICAgdmFyIGhhbmRsZSA9IHtcbiAgICAgIHN0b3AoKSB7XG4gICAgICAgIGlmICghIGhhc093bi5jYWxsKHNlbGYuX3N1YnNjcmlwdGlvbnMsIGlkKSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBzZWxmLl9zdWJzY3JpcHRpb25zW2lkXS5zdG9wKCk7XG4gICAgICB9LFxuICAgICAgcmVhZHkoKSB7XG4gICAgICAgIC8vIHJldHVybiBmYWxzZSBpZiB3ZSd2ZSB1bnN1YnNjcmliZWQuXG4gICAgICAgIGlmICghIGhhc093bi5jYWxsKHNlbGYuX3N1YnNjcmlwdGlvbnMsIGlkKSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcmVjb3JkID0gc2VsZi5fc3Vic2NyaXB0aW9uc1tpZF07XG4gICAgICAgIHJlY29yZC5yZWFkeURlcHMuZGVwZW5kKCk7XG4gICAgICAgIHJldHVybiByZWNvcmQucmVhZHk7XG4gICAgICB9LFxuICAgICAgc3Vic2NyaXB0aW9uSWQ6IGlkXG4gICAgfTtcblxuICAgIGlmIChUcmFja2VyLmFjdGl2ZSkge1xuICAgICAgLy8gV2UncmUgaW4gYSByZWFjdGl2ZSBjb21wdXRhdGlvbiwgc28gd2UnZCBsaWtlIHRvIHVuc3Vic2NyaWJlIHdoZW4gdGhlXG4gICAgICAvLyBjb21wdXRhdGlvbiBpcyBpbnZhbGlkYXRlZC4uLiBidXQgbm90IGlmIHRoZSByZXJ1biBqdXN0IHJlLXN1YnNjcmliZXNcbiAgICAgIC8vIHRvIHRoZSBzYW1lIHN1YnNjcmlwdGlvbiEgIFdoZW4gYSByZXJ1biBoYXBwZW5zLCB3ZSB1c2Ugb25JbnZhbGlkYXRlXG4gICAgICAvLyBhcyBhIGNoYW5nZSB0byBtYXJrIHRoZSBzdWJzY3JpcHRpb24gXCJpbmFjdGl2ZVwiIHNvIHRoYXQgaXQgY2FuXG4gICAgICAvLyBiZSByZXVzZWQgZnJvbSB0aGUgcmVydW4uICBJZiBpdCBpc24ndCByZXVzZWQsIGl0J3Mga2lsbGVkIGZyb21cbiAgICAgIC8vIGFuIGFmdGVyRmx1c2guXG4gICAgICBUcmFja2VyLm9uSW52YWxpZGF0ZShjID0+IHtcbiAgICAgICAgaWYgKGhhc093bi5jYWxsKHNlbGYuX3N1YnNjcmlwdGlvbnMsIGlkKSkge1xuICAgICAgICAgIHNlbGYuX3N1YnNjcmlwdGlvbnNbaWRdLmluYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIFRyYWNrZXIuYWZ0ZXJGbHVzaCgoKSA9PiB7XG4gICAgICAgICAgaWYgKGhhc093bi5jYWxsKHNlbGYuX3N1YnNjcmlwdGlvbnMsIGlkKSAmJlxuICAgICAgICAgICAgICBzZWxmLl9zdWJzY3JpcHRpb25zW2lkXS5pbmFjdGl2ZSkge1xuICAgICAgICAgICAgaGFuZGxlLnN0b3AoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGhhbmRsZTtcbiAgfVxuXG4gIC8vIG9wdGlvbnM6XG4gIC8vIC0gb25MYXRlRXJyb3Ige0Z1bmN0aW9uKGVycm9yKX0gY2FsbGVkIGlmIGFuIGVycm9yIHdhcyByZWNlaXZlZCBhZnRlciB0aGUgcmVhZHkgZXZlbnQuXG4gIC8vICAgICAoZXJyb3JzIHJlY2VpdmVkIGJlZm9yZSByZWFkeSBjYXVzZSBhbiBlcnJvciB0byBiZSB0aHJvd24pXG4gIF9zdWJzY3JpYmVBbmRXYWl0KG5hbWUsIGFyZ3MsIG9wdGlvbnMpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGYgPSBuZXcgRnV0dXJlKCk7XG4gICAgdmFyIHJlYWR5ID0gZmFsc2U7XG4gICAgdmFyIGhhbmRsZTtcbiAgICBhcmdzID0gYXJncyB8fCBbXTtcbiAgICBhcmdzLnB1c2goe1xuICAgICAgb25SZWFkeSgpIHtcbiAgICAgICAgcmVhZHkgPSB0cnVlO1xuICAgICAgICBmWydyZXR1cm4nXSgpO1xuICAgICAgfSxcbiAgICAgIG9uRXJyb3IoZSkge1xuICAgICAgICBpZiAoIXJlYWR5KSBmWyd0aHJvdyddKGUpO1xuICAgICAgICBlbHNlIG9wdGlvbnMgJiYgb3B0aW9ucy5vbkxhdGVFcnJvciAmJiBvcHRpb25zLm9uTGF0ZUVycm9yKGUpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaGFuZGxlID0gc2VsZi5zdWJzY3JpYmUuYXBwbHkoc2VsZiwgW25hbWVdLmNvbmNhdChhcmdzKSk7XG4gICAgZi53YWl0KCk7XG4gICAgcmV0dXJuIGhhbmRsZTtcbiAgfVxuXG4gIG1ldGhvZHMobWV0aG9kcykge1xuICAgIGtleXMobWV0aG9kcykuZm9yRWFjaChuYW1lID0+IHtcbiAgICAgIGNvbnN0IGZ1bmMgPSBtZXRob2RzW25hbWVdO1xuICAgICAgaWYgKHR5cGVvZiBmdW5jICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk1ldGhvZCAnXCIgKyBuYW1lICsgXCInIG11c3QgYmUgYSBmdW5jdGlvblwiKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLl9tZXRob2RIYW5kbGVyc1tuYW1lXSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBIG1ldGhvZCBuYW1lZCAnXCIgKyBuYW1lICsgXCInIGlzIGFscmVhZHkgZGVmaW5lZFwiKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX21ldGhvZEhhbmRsZXJzW25hbWVdID0gZnVuYztcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbWVtYmVyT2YgTWV0ZW9yXG4gICAqIEBpbXBvcnRGcm9tUGFja2FnZSBtZXRlb3JcbiAgICogQGFsaWFzIE1ldGVvci5jYWxsXG4gICAqIEBzdW1tYXJ5IEludm9rZXMgYSBtZXRob2QgcGFzc2luZyBhbnkgbnVtYmVyIG9mIGFyZ3VtZW50cy5cbiAgICogQGxvY3VzIEFueXdoZXJlXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIE5hbWUgb2YgbWV0aG9kIHRvIGludm9rZVxuICAgKiBAcGFyYW0ge0VKU09OYWJsZX0gW2FyZzEsYXJnMi4uLl0gT3B0aW9uYWwgbWV0aG9kIGFyZ3VtZW50c1xuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbYXN5bmNDYWxsYmFja10gT3B0aW9uYWwgY2FsbGJhY2ssIHdoaWNoIGlzIGNhbGxlZCBhc3luY2hyb25vdXNseSB3aXRoIHRoZSBlcnJvciBvciByZXN1bHQgYWZ0ZXIgdGhlIG1ldGhvZCBpcyBjb21wbGV0ZS4gSWYgbm90IHByb3ZpZGVkLCB0aGUgbWV0aG9kIHJ1bnMgc3luY2hyb25vdXNseSBpZiBwb3NzaWJsZSAoc2VlIGJlbG93KS5cbiAgICovXG4gIGNhbGwobmFtZSAvKiAuLiBbYXJndW1lbnRzXSAuLiBjYWxsYmFjayAqLykge1xuICAgIC8vIGlmIGl0J3MgYSBmdW5jdGlvbiwgdGhlIGxhc3QgYXJndW1lbnQgaXMgdGhlIHJlc3VsdCBjYWxsYmFjayxcbiAgICAvLyBub3QgYSBwYXJhbWV0ZXIgdG8gdGhlIHJlbW90ZSBtZXRob2QuXG4gICAgdmFyIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgaWYgKGFyZ3MubGVuZ3RoICYmIHR5cGVvZiBhcmdzW2FyZ3MubGVuZ3RoIC0gMV0gPT09ICdmdW5jdGlvbicpXG4gICAgICB2YXIgY2FsbGJhY2sgPSBhcmdzLnBvcCgpO1xuICAgIHJldHVybiB0aGlzLmFwcGx5KG5hbWUsIGFyZ3MsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbWVtYmVyT2YgTWV0ZW9yXG4gICAqIEBpbXBvcnRGcm9tUGFja2FnZSBtZXRlb3JcbiAgICogQGFsaWFzIE1ldGVvci5hcHBseVxuICAgKiBAc3VtbWFyeSBJbnZva2UgYSBtZXRob2QgcGFzc2luZyBhbiBhcnJheSBvZiBhcmd1bWVudHMuXG4gICAqIEBsb2N1cyBBbnl3aGVyZVxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBOYW1lIG9mIG1ldGhvZCB0byBpbnZva2VcbiAgICogQHBhcmFtIHtFSlNPTmFibGVbXX0gYXJncyBNZXRob2QgYXJndW1lbnRzXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc11cbiAgICogQHBhcmFtIHtCb29sZWFufSBvcHRpb25zLndhaXQgKENsaWVudCBvbmx5KSBJZiB0cnVlLCBkb24ndCBzZW5kIHRoaXMgbWV0aG9kIHVudGlsIGFsbCBwcmV2aW91cyBtZXRob2QgY2FsbHMgaGF2ZSBjb21wbGV0ZWQsIGFuZCBkb24ndCBzZW5kIGFueSBzdWJzZXF1ZW50IG1ldGhvZCBjYWxscyB1bnRpbCB0aGlzIG9uZSBpcyBjb21wbGV0ZWQuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IG9wdGlvbnMub25SZXN1bHRSZWNlaXZlZCAoQ2xpZW50IG9ubHkpIFRoaXMgY2FsbGJhY2sgaXMgaW52b2tlZCB3aXRoIHRoZSBlcnJvciBvciByZXN1bHQgb2YgdGhlIG1ldGhvZCAoanVzdCBsaWtlIGBhc3luY0NhbGxiYWNrYCkgYXMgc29vbiBhcyB0aGUgZXJyb3Igb3IgcmVzdWx0IGlzIGF2YWlsYWJsZS4gVGhlIGxvY2FsIGNhY2hlIG1heSBub3QgeWV0IHJlZmxlY3QgdGhlIHdyaXRlcyBwZXJmb3JtZWQgYnkgdGhlIG1ldGhvZC5cbiAgICogQHBhcmFtIHtCb29sZWFufSBvcHRpb25zLm5vUmV0cnkgKENsaWVudCBvbmx5KSBpZiB0cnVlLCBkb24ndCBzZW5kIHRoaXMgbWV0aG9kIGFnYWluIG9uIHJlbG9hZCwgc2ltcGx5IGNhbGwgdGhlIGNhbGxiYWNrIGFuIGVycm9yIHdpdGggdGhlIGVycm9yIGNvZGUgJ2ludm9jYXRpb24tZmFpbGVkJy5cbiAgICogQHBhcmFtIHtCb29sZWFufSBvcHRpb25zLnRocm93U3R1YkV4Y2VwdGlvbnMgKENsaWVudCBvbmx5KSBJZiB0cnVlLCBleGNlcHRpb25zIHRocm93biBieSBtZXRob2Qgc3R1YnMgd2lsbCBiZSB0aHJvd24gaW5zdGVhZCBvZiBsb2dnZWQsIGFuZCB0aGUgbWV0aG9kIHdpbGwgbm90IGJlIGludm9rZWQgb24gdGhlIHNlcnZlci5cbiAgICogQHBhcmFtIHtCb29sZWFufSBvcHRpb25zLnJldHVyblN0dWJWYWx1ZSAoQ2xpZW50IG9ubHkpIElmIHRydWUgdGhlbiBpbiBjYXNlcyB3aGVyZSB3ZSB3b3VsZCBoYXZlIG90aGVyd2lzZSBkaXNjYXJkZWQgdGhlIHN0dWIncyByZXR1cm4gdmFsdWUgYW5kIHJldHVybmVkIHVuZGVmaW5lZCwgaW5zdGVhZCB3ZSBnbyBhaGVhZCBhbmQgcmV0dXJuIGl0LiBTcGVjaWZpY2FsbHksIHRoaXMgaXMgYW55IHRpbWUgb3RoZXIgdGhhbiB3aGVuIChhKSB3ZSBhcmUgYWxyZWFkeSBpbnNpZGUgYSBzdHViIG9yIChiKSB3ZSBhcmUgaW4gTm9kZSBhbmQgbm8gY2FsbGJhY2sgd2FzIHByb3ZpZGVkLiBDdXJyZW50bHkgd2UgcmVxdWlyZSB0aGlzIGZsYWcgdG8gYmUgZXhwbGljaXRseSBwYXNzZWQgdG8gcmVkdWNlIHRoZSBsaWtlbGlob29kIHRoYXQgc3R1YiByZXR1cm4gdmFsdWVzIHdpbGwgYmUgY29uZnVzZWQgd2l0aCBzZXJ2ZXIgcmV0dXJuIHZhbHVlczsgd2UgbWF5IGltcHJvdmUgdGhpcyBpbiBmdXR1cmUuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IFthc3luY0NhbGxiYWNrXSBPcHRpb25hbCBjYWxsYmFjazsgc2FtZSBzZW1hbnRpY3MgYXMgaW4gW2BNZXRlb3IuY2FsbGBdKCNtZXRlb3JfY2FsbCkuXG4gICAqL1xuICBhcHBseShuYW1lLCBhcmdzLCBvcHRpb25zLCBjYWxsYmFjaykge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIC8vIFdlIHdlcmUgcGFzc2VkIDMgYXJndW1lbnRzLiBUaGV5IG1heSBiZSBlaXRoZXIgKG5hbWUsIGFyZ3MsIG9wdGlvbnMpXG4gICAgLy8gb3IgKG5hbWUsIGFyZ3MsIGNhbGxiYWNrKVxuICAgIGlmICghY2FsbGJhY2sgJiYgdHlwZW9mIG9wdGlvbnMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNhbGxiYWNrID0gb3B0aW9ucztcbiAgICAgIG9wdGlvbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIH1cbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG4gICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAvLyBYWFggd291bGQgaXQgYmUgYmV0dGVyIGZvcm0gdG8gZG8gdGhlIGJpbmRpbmcgaW4gc3RyZWFtLm9uLFxuICAgICAgLy8gb3IgY2FsbGVyLCBpbnN0ZWFkIG9mIGhlcmU/XG4gICAgICAvLyBYWFggaW1wcm92ZSBlcnJvciBtZXNzYWdlIChhbmQgaG93IHdlIHJlcG9ydCBpdClcbiAgICAgIGNhbGxiYWNrID0gTWV0ZW9yLmJpbmRFbnZpcm9ubWVudChcbiAgICAgICAgY2FsbGJhY2ssXG4gICAgICAgIFwiZGVsaXZlcmluZyByZXN1bHQgb2YgaW52b2tpbmcgJ1wiICsgbmFtZSArIFwiJ1wiXG4gICAgICApO1xuICAgIH1cblxuICAgIC8vIEtlZXAgb3VyIGFyZ3Mgc2FmZSBmcm9tIG11dGF0aW9uIChlZyBpZiB3ZSBkb24ndCBzZW5kIHRoZSBtZXNzYWdlIGZvciBhXG4gICAgLy8gd2hpbGUgYmVjYXVzZSBvZiBhIHdhaXQgbWV0aG9kKS5cbiAgICBhcmdzID0gRUpTT04uY2xvbmUoYXJncyk7XG5cbiAgICB2YXIgZW5jbG9zaW5nID0gRERQLl9DdXJyZW50TWV0aG9kSW52b2NhdGlvbi5nZXQoKTtcbiAgICB2YXIgYWxyZWFkeUluU2ltdWxhdGlvbiA9IGVuY2xvc2luZyAmJiBlbmNsb3NpbmcuaXNTaW11bGF0aW9uO1xuXG4gICAgLy8gTGF6aWx5IGdlbmVyYXRlIGEgcmFuZG9tU2VlZCwgb25seSBpZiBpdCBpcyByZXF1ZXN0ZWQgYnkgdGhlIHN0dWIuXG4gICAgLy8gVGhlIHJhbmRvbSBzdHJlYW1zIG9ubHkgaGF2ZSB1dGlsaXR5IGlmIHRoZXkncmUgdXNlZCBvbiBib3RoIHRoZSBjbGllbnRcbiAgICAvLyBhbmQgdGhlIHNlcnZlcjsgaWYgdGhlIGNsaWVudCBkb2Vzbid0IGdlbmVyYXRlIGFueSAncmFuZG9tJyB2YWx1ZXNcbiAgICAvLyB0aGVuIHdlIGRvbid0IGV4cGVjdCB0aGUgc2VydmVyIHRvIGdlbmVyYXRlIGFueSBlaXRoZXIuXG4gICAgLy8gTGVzcyBjb21tb25seSwgdGhlIHNlcnZlciBtYXkgcGVyZm9ybSBkaWZmZXJlbnQgYWN0aW9ucyBmcm9tIHRoZSBjbGllbnQsXG4gICAgLy8gYW5kIG1heSBpbiBmYWN0IGdlbmVyYXRlIHZhbHVlcyB3aGVyZSB0aGUgY2xpZW50IGRpZCBub3QsIGJ1dCB3ZSBkb24ndFxuICAgIC8vIGhhdmUgYW55IGNsaWVudC1zaWRlIHZhbHVlcyB0byBtYXRjaCwgc28gZXZlbiBoZXJlIHdlIG1heSBhcyB3ZWxsIGp1c3RcbiAgICAvLyB1c2UgYSByYW5kb20gc2VlZCBvbiB0aGUgc2VydmVyLiAgSW4gdGhhdCBjYXNlLCB3ZSBkb24ndCBwYXNzIHRoZVxuICAgIC8vIHJhbmRvbVNlZWQgdG8gc2F2ZSBiYW5kd2lkdGgsIGFuZCB3ZSBkb24ndCBldmVuIGdlbmVyYXRlIGl0IHRvIHNhdmUgYVxuICAgIC8vIGJpdCBvZiBDUFUgYW5kIHRvIGF2b2lkIGNvbnN1bWluZyBlbnRyb3B5LlxuICAgIHZhciByYW5kb21TZWVkID0gbnVsbDtcbiAgICB2YXIgcmFuZG9tU2VlZEdlbmVyYXRvciA9ICgpID0+IHtcbiAgICAgIGlmIChyYW5kb21TZWVkID09PSBudWxsKSB7XG4gICAgICAgIHJhbmRvbVNlZWQgPSBERFBDb21tb24ubWFrZVJwY1NlZWQoZW5jbG9zaW5nLCBuYW1lKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByYW5kb21TZWVkO1xuICAgIH07XG5cbiAgICAvLyBSdW4gdGhlIHN0dWIsIGlmIHdlIGhhdmUgb25lLiBUaGUgc3R1YiBpcyBzdXBwb3NlZCB0byBtYWtlIHNvbWVcbiAgICAvLyB0ZW1wb3Jhcnkgd3JpdGVzIHRvIHRoZSBkYXRhYmFzZSB0byBnaXZlIHRoZSB1c2VyIGEgc21vb3RoIGV4cGVyaWVuY2VcbiAgICAvLyB1bnRpbCB0aGUgYWN0dWFsIHJlc3VsdCBvZiBleGVjdXRpbmcgdGhlIG1ldGhvZCBjb21lcyBiYWNrIGZyb20gdGhlXG4gICAgLy8gc2VydmVyICh3aGVyZXVwb24gdGhlIHRlbXBvcmFyeSB3cml0ZXMgdG8gdGhlIGRhdGFiYXNlIHdpbGwgYmUgcmV2ZXJzZWRcbiAgICAvLyBkdXJpbmcgdGhlIGJlZ2luVXBkYXRlL2VuZFVwZGF0ZSBwcm9jZXNzLilcbiAgICAvL1xuICAgIC8vIE5vcm1hbGx5LCB3ZSBpZ25vcmUgdGhlIHJldHVybiB2YWx1ZSBvZiB0aGUgc3R1YiAoZXZlbiBpZiBpdCBpcyBhblxuICAgIC8vIGV4Y2VwdGlvbiksIGluIGZhdm9yIG9mIHRoZSByZWFsIHJldHVybiB2YWx1ZSBmcm9tIHRoZSBzZXJ2ZXIuIFRoZVxuICAgIC8vIGV4Y2VwdGlvbiBpcyBpZiB0aGUgKmNhbGxlciogaXMgYSBzdHViLiBJbiB0aGF0IGNhc2UsIHdlJ3JlIG5vdCBnb2luZ1xuICAgIC8vIHRvIGRvIGEgUlBDLCBzbyB3ZSB1c2UgdGhlIHJldHVybiB2YWx1ZSBvZiB0aGUgc3R1YiBhcyBvdXIgcmV0dXJuXG4gICAgLy8gdmFsdWUuXG5cbiAgICB2YXIgc3R1YiA9IHNlbGYuX21ldGhvZEhhbmRsZXJzW25hbWVdO1xuICAgIGlmIChzdHViKSB7XG4gICAgICB2YXIgc2V0VXNlcklkID0gdXNlcklkID0+IHtcbiAgICAgICAgc2VsZi5zZXRVc2VySWQodXNlcklkKTtcbiAgICAgIH07XG5cbiAgICAgIHZhciBpbnZvY2F0aW9uID0gbmV3IEREUENvbW1vbi5NZXRob2RJbnZvY2F0aW9uKHtcbiAgICAgICAgaXNTaW11bGF0aW9uOiB0cnVlLFxuICAgICAgICB1c2VySWQ6IHNlbGYudXNlcklkKCksXG4gICAgICAgIHNldFVzZXJJZDogc2V0VXNlcklkLFxuICAgICAgICByYW5kb21TZWVkKCkge1xuICAgICAgICAgIHJldHVybiByYW5kb21TZWVkR2VuZXJhdG9yKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBpZiAoIWFscmVhZHlJblNpbXVsYXRpb24pIHNlbGYuX3NhdmVPcmlnaW5hbHMoKTtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gTm90ZSB0aGF0IHVubGlrZSBpbiB0aGUgY29ycmVzcG9uZGluZyBzZXJ2ZXIgY29kZSwgd2UgbmV2ZXIgYXVkaXRcbiAgICAgICAgLy8gdGhhdCBzdHVicyBjaGVjaygpIHRoZWlyIGFyZ3VtZW50cy5cbiAgICAgICAgdmFyIHN0dWJSZXR1cm5WYWx1ZSA9IEREUC5fQ3VycmVudE1ldGhvZEludm9jYXRpb24ud2l0aFZhbHVlKFxuICAgICAgICAgIGludm9jYXRpb24sXG4gICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgICAgICAgICAvLyBCZWNhdXNlIHNhdmVPcmlnaW5hbHMgYW5kIHJldHJpZXZlT3JpZ2luYWxzIGFyZW4ndCByZWVudHJhbnQsXG4gICAgICAgICAgICAgIC8vIGRvbid0IGFsbG93IHN0dWJzIHRvIHlpZWxkLlxuICAgICAgICAgICAgICByZXR1cm4gTWV0ZW9yLl9ub1lpZWxkc0FsbG93ZWQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIHJlLWNsb25lLCBzbyB0aGF0IHRoZSBzdHViIGNhbid0IGFmZmVjdCBvdXIgY2FsbGVyJ3MgdmFsdWVzXG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0dWIuYXBwbHkoaW52b2NhdGlvbiwgRUpTT04uY2xvbmUoYXJncykpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiBzdHViLmFwcGx5KGludm9jYXRpb24sIEVKU09OLmNsb25lKGFyZ3MpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHZhciBleGNlcHRpb24gPSBlO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIElmIHdlJ3JlIGluIGEgc2ltdWxhdGlvbiwgc3RvcCBhbmQgcmV0dXJuIHRoZSByZXN1bHQgd2UgaGF2ZSxcbiAgICAvLyByYXRoZXIgdGhhbiBnb2luZyBvbiB0byBkbyBhbiBSUEMuIElmIHRoZXJlIHdhcyBubyBzdHViLFxuICAgIC8vIHdlJ2xsIGVuZCB1cCByZXR1cm5pbmcgdW5kZWZpbmVkLlxuICAgIGlmIChhbHJlYWR5SW5TaW11bGF0aW9uKSB7XG4gICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgY2FsbGJhY2soZXhjZXB0aW9uLCBzdHViUmV0dXJuVmFsdWUpO1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgICAgaWYgKGV4Y2VwdGlvbikgdGhyb3cgZXhjZXB0aW9uO1xuICAgICAgcmV0dXJuIHN0dWJSZXR1cm5WYWx1ZTtcbiAgICB9XG5cbiAgICAvLyBXZSBvbmx5IGNyZWF0ZSB0aGUgbWV0aG9kSWQgaGVyZSBiZWNhdXNlIHdlIGRvbid0IGFjdHVhbGx5IG5lZWQgb25lIGlmXG4gICAgLy8gd2UncmUgYWxyZWFkeSBpbiBhIHNpbXVsYXRpb25cbiAgICBjb25zdCBtZXRob2RJZCA9ICcnICsgc2VsZi5fbmV4dE1ldGhvZElkKys7XG4gICAgaWYgKHN0dWIpIHtcbiAgICAgIHNlbGYuX3JldHJpZXZlQW5kU3RvcmVPcmlnaW5hbHMobWV0aG9kSWQpO1xuICAgIH1cblxuICAgIC8vIEdlbmVyYXRlIHRoZSBERFAgbWVzc2FnZSBmb3IgdGhlIG1ldGhvZCBjYWxsLiBOb3RlIHRoYXQgb24gdGhlIGNsaWVudCxcbiAgICAvLyBpdCBpcyBpbXBvcnRhbnQgdGhhdCB0aGUgc3R1YiBoYXZlIGZpbmlzaGVkIGJlZm9yZSB3ZSBzZW5kIHRoZSBSUEMsIHNvXG4gICAgLy8gdGhhdCB3ZSBrbm93IHdlIGhhdmUgYSBjb21wbGV0ZSBsaXN0IG9mIHdoaWNoIGxvY2FsIGRvY3VtZW50cyB0aGUgc3R1YlxuICAgIC8vIHdyb3RlLlxuICAgIHZhciBtZXNzYWdlID0ge1xuICAgICAgbXNnOiAnbWV0aG9kJyxcbiAgICAgIG1ldGhvZDogbmFtZSxcbiAgICAgIHBhcmFtczogYXJncyxcbiAgICAgIGlkOiBtZXRob2RJZFxuICAgIH07XG5cbiAgICAvLyBJZiBhbiBleGNlcHRpb24gb2NjdXJyZWQgaW4gYSBzdHViLCBhbmQgd2UncmUgaWdub3JpbmcgaXRcbiAgICAvLyBiZWNhdXNlIHdlJ3JlIGRvaW5nIGFuIFJQQyBhbmQgd2FudCB0byB1c2Ugd2hhdCB0aGUgc2VydmVyXG4gICAgLy8gcmV0dXJucyBpbnN0ZWFkLCBsb2cgaXQgc28gdGhlIGRldmVsb3BlciBrbm93c1xuICAgIC8vICh1bmxlc3MgdGhleSBleHBsaWNpdGx5IGFzayB0byBzZWUgdGhlIGVycm9yKS5cbiAgICAvL1xuICAgIC8vIFRlc3RzIGNhbiBzZXQgdGhlICdfZXhwZWN0ZWRCeVRlc3QnIGZsYWcgb24gYW4gZXhjZXB0aW9uIHNvIGl0IHdvbid0XG4gICAgLy8gZ28gdG8gbG9nLlxuICAgIGlmIChleGNlcHRpb24pIHtcbiAgICAgIGlmIChvcHRpb25zLnRocm93U3R1YkV4Y2VwdGlvbnMpIHtcbiAgICAgICAgdGhyb3cgZXhjZXB0aW9uO1xuICAgICAgfSBlbHNlIGlmICghZXhjZXB0aW9uLl9leHBlY3RlZEJ5VGVzdCkge1xuICAgICAgICBNZXRlb3IuX2RlYnVnKFxuICAgICAgICAgIFwiRXhjZXB0aW9uIHdoaWxlIHNpbXVsYXRpbmcgdGhlIGVmZmVjdCBvZiBpbnZva2luZyAnXCIgKyBuYW1lICsgXCInXCIsXG4gICAgICAgICAgZXhjZXB0aW9uXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQXQgdGhpcyBwb2ludCB3ZSdyZSBkZWZpbml0ZWx5IGRvaW5nIGFuIFJQQywgYW5kIHdlJ3JlIGdvaW5nIHRvXG4gICAgLy8gcmV0dXJuIHRoZSB2YWx1ZSBvZiB0aGUgUlBDIHRvIHRoZSBjYWxsZXIuXG5cbiAgICAvLyBJZiB0aGUgY2FsbGVyIGRpZG4ndCBnaXZlIGEgY2FsbGJhY2ssIGRlY2lkZSB3aGF0IHRvIGRvLlxuICAgIGlmICghY2FsbGJhY2spIHtcbiAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgLy8gT24gdGhlIGNsaWVudCwgd2UgZG9uJ3QgaGF2ZSBmaWJlcnMsIHNvIHdlIGNhbid0IGJsb2NrLiBUaGVcbiAgICAgICAgLy8gb25seSB0aGluZyB3ZSBjYW4gZG8gaXMgdG8gcmV0dXJuIHVuZGVmaW5lZCBhbmQgZGlzY2FyZCB0aGVcbiAgICAgICAgLy8gcmVzdWx0IG9mIHRoZSBSUEMuIElmIGFuIGVycm9yIG9jY3VycmVkIHRoZW4gcHJpbnQgdGhlIGVycm9yXG4gICAgICAgIC8vIHRvIHRoZSBjb25zb2xlLlxuICAgICAgICBjYWxsYmFjayA9IGVyciA9PiB7XG4gICAgICAgICAgZXJyICYmIE1ldGVvci5fZGVidWcoXCJFcnJvciBpbnZva2luZyBNZXRob2QgJ1wiICsgbmFtZSArIFwiJ1wiLCBlcnIpO1xuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gT24gdGhlIHNlcnZlciwgbWFrZSB0aGUgZnVuY3Rpb24gc3luY2hyb25vdXMuIFRocm93IG9uXG4gICAgICAgIC8vIGVycm9ycywgcmV0dXJuIG9uIHN1Y2Nlc3MuXG4gICAgICAgIHZhciBmdXR1cmUgPSBuZXcgRnV0dXJlKCk7XG4gICAgICAgIGNhbGxiYWNrID0gZnV0dXJlLnJlc29sdmVyKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gU2VuZCB0aGUgcmFuZG9tU2VlZCBvbmx5IGlmIHdlIHVzZWQgaXRcbiAgICBpZiAocmFuZG9tU2VlZCAhPT0gbnVsbCkge1xuICAgICAgbWVzc2FnZS5yYW5kb21TZWVkID0gcmFuZG9tU2VlZDtcbiAgICB9XG5cbiAgICB2YXIgbWV0aG9kSW52b2tlciA9IG5ldyBNZXRob2RJbnZva2VyKHtcbiAgICAgIG1ldGhvZElkLFxuICAgICAgY2FsbGJhY2s6IGNhbGxiYWNrLFxuICAgICAgY29ubmVjdGlvbjogc2VsZixcbiAgICAgIG9uUmVzdWx0UmVjZWl2ZWQ6IG9wdGlvbnMub25SZXN1bHRSZWNlaXZlZCxcbiAgICAgIHdhaXQ6ICEhb3B0aW9ucy53YWl0LFxuICAgICAgbWVzc2FnZTogbWVzc2FnZSxcbiAgICAgIG5vUmV0cnk6ICEhb3B0aW9ucy5ub1JldHJ5XG4gICAgfSk7XG5cbiAgICBpZiAob3B0aW9ucy53YWl0KSB7XG4gICAgICAvLyBJdCdzIGEgd2FpdCBtZXRob2QhIFdhaXQgbWV0aG9kcyBnbyBpbiB0aGVpciBvd24gYmxvY2suXG4gICAgICBzZWxmLl9vdXRzdGFuZGluZ01ldGhvZEJsb2Nrcy5wdXNoKHtcbiAgICAgICAgd2FpdDogdHJ1ZSxcbiAgICAgICAgbWV0aG9kczogW21ldGhvZEludm9rZXJdXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gTm90IGEgd2FpdCBtZXRob2QuIFN0YXJ0IGEgbmV3IGJsb2NrIGlmIHRoZSBwcmV2aW91cyBibG9jayB3YXMgYSB3YWl0XG4gICAgICAvLyBibG9jaywgYW5kIGFkZCBpdCB0byB0aGUgbGFzdCBibG9jayBvZiBtZXRob2RzLlxuICAgICAgaWYgKGlzRW1wdHkoc2VsZi5fb3V0c3RhbmRpbmdNZXRob2RCbG9ja3MpIHx8XG4gICAgICAgICAgbGFzdChzZWxmLl9vdXRzdGFuZGluZ01ldGhvZEJsb2Nrcykud2FpdCkge1xuICAgICAgICBzZWxmLl9vdXRzdGFuZGluZ01ldGhvZEJsb2Nrcy5wdXNoKHtcbiAgICAgICAgICB3YWl0OiBmYWxzZSxcbiAgICAgICAgICBtZXRob2RzOiBbXSxcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGxhc3Qoc2VsZi5fb3V0c3RhbmRpbmdNZXRob2RCbG9ja3MpLm1ldGhvZHMucHVzaChtZXRob2RJbnZva2VyKTtcbiAgICB9XG5cbiAgICAvLyBJZiB3ZSBhZGRlZCBpdCB0byB0aGUgZmlyc3QgYmxvY2ssIHNlbmQgaXQgb3V0IG5vdy5cbiAgICBpZiAoc2VsZi5fb3V0c3RhbmRpbmdNZXRob2RCbG9ja3MubGVuZ3RoID09PSAxKSBtZXRob2RJbnZva2VyLnNlbmRNZXNzYWdlKCk7XG5cbiAgICAvLyBJZiB3ZSdyZSB1c2luZyB0aGUgZGVmYXVsdCBjYWxsYmFjayBvbiB0aGUgc2VydmVyLFxuICAgIC8vIGJsb2NrIHdhaXRpbmcgZm9yIHRoZSByZXN1bHQuXG4gICAgaWYgKGZ1dHVyZSkge1xuICAgICAgcmV0dXJuIGZ1dHVyZS53YWl0KCk7XG4gICAgfVxuICAgIHJldHVybiBvcHRpb25zLnJldHVyblN0dWJWYWx1ZSA/IHN0dWJSZXR1cm5WYWx1ZSA6IHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8vIEJlZm9yZSBjYWxsaW5nIGEgbWV0aG9kIHN0dWIsIHByZXBhcmUgYWxsIHN0b3JlcyB0byB0cmFjayBjaGFuZ2VzIGFuZCBhbGxvd1xuICAvLyBfcmV0cmlldmVBbmRTdG9yZU9yaWdpbmFscyB0byBnZXQgdGhlIG9yaWdpbmFsIHZlcnNpb25zIG9mIGNoYW5nZWRcbiAgLy8gZG9jdW1lbnRzLlxuICBfc2F2ZU9yaWdpbmFscygpIHtcbiAgICBpZiAoISB0aGlzLl93YWl0aW5nRm9yUXVpZXNjZW5jZSgpKSB7XG4gICAgICB0aGlzLl9mbHVzaEJ1ZmZlcmVkV3JpdGVzKCk7XG4gICAgfVxuXG4gICAga2V5cyh0aGlzLl9zdG9yZXMpLmZvckVhY2goc3RvcmVOYW1lID0+IHtcbiAgICAgIHRoaXMuX3N0b3Jlc1tzdG9yZU5hbWVdLnNhdmVPcmlnaW5hbHMoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIFJldHJpZXZlcyB0aGUgb3JpZ2luYWwgdmVyc2lvbnMgb2YgYWxsIGRvY3VtZW50cyBtb2RpZmllZCBieSB0aGUgc3R1YiBmb3JcbiAgLy8gbWV0aG9kICdtZXRob2RJZCcgZnJvbSBhbGwgc3RvcmVzIGFuZCBzYXZlcyB0aGVtIHRvIF9zZXJ2ZXJEb2N1bWVudHMgKGtleWVkXG4gIC8vIGJ5IGRvY3VtZW50KSBhbmQgX2RvY3VtZW50c1dyaXR0ZW5CeVN0dWIgKGtleWVkIGJ5IG1ldGhvZCBJRCkuXG4gIF9yZXRyaWV2ZUFuZFN0b3JlT3JpZ2luYWxzKG1ldGhvZElkKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIGlmIChzZWxmLl9kb2N1bWVudHNXcml0dGVuQnlTdHViW21ldGhvZElkXSlcbiAgICAgIHRocm93IG5ldyBFcnJvcignRHVwbGljYXRlIG1ldGhvZElkIGluIF9yZXRyaWV2ZUFuZFN0b3JlT3JpZ2luYWxzJyk7XG5cbiAgICB2YXIgZG9jc1dyaXR0ZW4gPSBbXTtcblxuICAgIGtleXMoc2VsZi5fc3RvcmVzKS5mb3JFYWNoKGNvbGxlY3Rpb24gPT4ge1xuICAgICAgdmFyIG9yaWdpbmFscyA9IHNlbGYuX3N0b3Jlc1tjb2xsZWN0aW9uXS5yZXRyaWV2ZU9yaWdpbmFscygpO1xuICAgICAgLy8gbm90IGFsbCBzdG9yZXMgZGVmaW5lIHJldHJpZXZlT3JpZ2luYWxzXG4gICAgICBpZiAoISBvcmlnaW5hbHMpIHJldHVybjtcbiAgICAgIG9yaWdpbmFscy5mb3JFYWNoKChkb2MsIGlkKSA9PiB7XG4gICAgICAgIGRvY3NXcml0dGVuLnB1c2goeyBjb2xsZWN0aW9uLCBpZCB9KTtcbiAgICAgICAgaWYgKCEgaGFzT3duLmNhbGwoc2VsZi5fc2VydmVyRG9jdW1lbnRzLCBjb2xsZWN0aW9uKSkge1xuICAgICAgICAgIHNlbGYuX3NlcnZlckRvY3VtZW50c1tjb2xsZWN0aW9uXSA9IG5ldyBNb25nb0lETWFwKCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHNlcnZlckRvYyA9IHNlbGYuX3NlcnZlckRvY3VtZW50c1tjb2xsZWN0aW9uXS5zZXREZWZhdWx0KFxuICAgICAgICAgIGlkLFxuICAgICAgICAgIE9iamVjdC5jcmVhdGUobnVsbClcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKHNlcnZlckRvYy53cml0dGVuQnlTdHVicykge1xuICAgICAgICAgIC8vIFdlJ3JlIG5vdCB0aGUgZmlyc3Qgc3R1YiB0byB3cml0ZSB0aGlzIGRvYy4gSnVzdCBhZGQgb3VyIG1ldGhvZCBJRFxuICAgICAgICAgIC8vIHRvIHRoZSByZWNvcmQuXG4gICAgICAgICAgc2VydmVyRG9jLndyaXR0ZW5CeVN0dWJzW21ldGhvZElkXSA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gRmlyc3Qgc3R1YiEgU2F2ZSB0aGUgb3JpZ2luYWwgdmFsdWUgYW5kIG91ciBtZXRob2QgSUQuXG4gICAgICAgICAgc2VydmVyRG9jLmRvY3VtZW50ID0gZG9jO1xuICAgICAgICAgIHNlcnZlckRvYy5mbHVzaENhbGxiYWNrcyA9IFtdO1xuICAgICAgICAgIHNlcnZlckRvYy53cml0dGVuQnlTdHVicyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgICAgc2VydmVyRG9jLndyaXR0ZW5CeVN0dWJzW21ldGhvZElkXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGlmICghIGlzRW1wdHkoZG9jc1dyaXR0ZW4pKSB7XG4gICAgICBzZWxmLl9kb2N1bWVudHNXcml0dGVuQnlTdHViW21ldGhvZElkXSA9IGRvY3NXcml0dGVuO1xuICAgIH1cbiAgfVxuXG4gIC8vIFRoaXMgaXMgdmVyeSBtdWNoIGEgcHJpdmF0ZSBmdW5jdGlvbiB3ZSB1c2UgdG8gbWFrZSB0aGUgdGVzdHNcbiAgLy8gdGFrZSB1cCBmZXdlciBzZXJ2ZXIgcmVzb3VyY2VzIGFmdGVyIHRoZXkgY29tcGxldGUuXG4gIF91bnN1YnNjcmliZUFsbCgpIHtcbiAgICBrZXlzKHRoaXMuX3N1YnNjcmlwdGlvbnMpLmZvckVhY2goaWQgPT4ge1xuICAgICAgY29uc3Qgc3ViID0gdGhpcy5fc3Vic2NyaXB0aW9uc1tpZF07XG4gICAgICAvLyBBdm9pZCBraWxsaW5nIHRoZSBhdXRvdXBkYXRlIHN1YnNjcmlwdGlvbiBzbyB0aGF0IGRldmVsb3BlcnNcbiAgICAgIC8vIHN0aWxsIGdldCBob3QgY29kZSBwdXNoZXMgd2hlbiB3cml0aW5nIHRlc3RzLlxuICAgICAgLy9cbiAgICAgIC8vIFhYWCBpdCdzIGEgaGFjayB0byBlbmNvZGUga25vd2xlZGdlIGFib3V0IGF1dG91cGRhdGUgaGVyZSxcbiAgICAgIC8vIGJ1dCBpdCBkb2Vzbid0IHNlZW0gd29ydGggaXQgeWV0IHRvIGhhdmUgYSBzcGVjaWFsIEFQSSBmb3JcbiAgICAgIC8vIHN1YnNjcmlwdGlvbnMgdG8gcHJlc2VydmUgYWZ0ZXIgdW5pdCB0ZXN0cy5cbiAgICAgIGlmIChzdWIubmFtZSAhPT0gJ21ldGVvcl9hdXRvdXBkYXRlX2NsaWVudFZlcnNpb25zJykge1xuICAgICAgICBzdWIuc3RvcCgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLy8gU2VuZHMgdGhlIEREUCBzdHJpbmdpZmljYXRpb24gb2YgdGhlIGdpdmVuIG1lc3NhZ2Ugb2JqZWN0XG4gIF9zZW5kKG9iaikge1xuICAgIHRoaXMuX3N0cmVhbS5zZW5kKEREUENvbW1vbi5zdHJpbmdpZnlERFAob2JqKSk7XG4gIH1cblxuICAvLyBXZSBkZXRlY3RlZCB2aWEgRERQLWxldmVsIGhlYXJ0YmVhdHMgdGhhdCB3ZSd2ZSBsb3N0IHRoZVxuICAvLyBjb25uZWN0aW9uLiAgVW5saWtlIGBkaXNjb25uZWN0YCBvciBgY2xvc2VgLCBhIGxvc3QgY29ubmVjdGlvblxuICAvLyB3aWxsIGJlIGF1dG9tYXRpY2FsbHkgcmV0cmllZC5cbiAgX2xvc3RDb25uZWN0aW9uKGVycm9yKSB7XG4gICAgdGhpcy5fc3RyZWFtLl9sb3N0Q29ubmVjdGlvbihlcnJvcik7XG4gIH1cblxuICAvKipcbiAgICogQG1lbWJlck9mIE1ldGVvclxuICAgKiBAaW1wb3J0RnJvbVBhY2thZ2UgbWV0ZW9yXG4gICAqIEBhbGlhcyBNZXRlb3Iuc3RhdHVzXG4gICAqIEBzdW1tYXJ5IEdldCB0aGUgY3VycmVudCBjb25uZWN0aW9uIHN0YXR1cy4gQSByZWFjdGl2ZSBkYXRhIHNvdXJjZS5cbiAgICogQGxvY3VzIENsaWVudFxuICAgKi9cbiAgc3RhdHVzKC4uLmFyZ3MpIHtcbiAgICByZXR1cm4gdGhpcy5fc3RyZWFtLnN0YXR1cyguLi5hcmdzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAc3VtbWFyeSBGb3JjZSBhbiBpbW1lZGlhdGUgcmVjb25uZWN0aW9uIGF0dGVtcHQgaWYgdGhlIGNsaWVudCBpcyBub3QgY29ubmVjdGVkIHRvIHRoZSBzZXJ2ZXIuXG5cbiAgVGhpcyBtZXRob2QgZG9lcyBub3RoaW5nIGlmIHRoZSBjbGllbnQgaXMgYWxyZWFkeSBjb25uZWN0ZWQuXG4gICAqIEBtZW1iZXJPZiBNZXRlb3JcbiAgICogQGltcG9ydEZyb21QYWNrYWdlIG1ldGVvclxuICAgKiBAYWxpYXMgTWV0ZW9yLnJlY29ubmVjdFxuICAgKiBAbG9jdXMgQ2xpZW50XG4gICAqL1xuICByZWNvbm5lY3QoLi4uYXJncykge1xuICAgIHJldHVybiB0aGlzLl9zdHJlYW0ucmVjb25uZWN0KC4uLmFyZ3MpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBtZW1iZXJPZiBNZXRlb3JcbiAgICogQGltcG9ydEZyb21QYWNrYWdlIG1ldGVvclxuICAgKiBAYWxpYXMgTWV0ZW9yLmRpc2Nvbm5lY3RcbiAgICogQHN1bW1hcnkgRGlzY29ubmVjdCB0aGUgY2xpZW50IGZyb20gdGhlIHNlcnZlci5cbiAgICogQGxvY3VzIENsaWVudFxuICAgKi9cbiAgZGlzY29ubmVjdCguLi5hcmdzKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0cmVhbS5kaXNjb25uZWN0KC4uLmFyZ3MpO1xuICB9XG5cbiAgY2xvc2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0cmVhbS5kaXNjb25uZWN0KHsgX3Blcm1hbmVudDogdHJ1ZSB9KTtcbiAgfVxuXG4gIC8vL1xuICAvLy8gUmVhY3RpdmUgdXNlciBzeXN0ZW1cbiAgLy8vXG4gIHVzZXJJZCgpIHtcbiAgICBpZiAodGhpcy5fdXNlcklkRGVwcykgdGhpcy5fdXNlcklkRGVwcy5kZXBlbmQoKTtcbiAgICByZXR1cm4gdGhpcy5fdXNlcklkO1xuICB9XG5cbiAgc2V0VXNlcklkKHVzZXJJZCkge1xuICAgIC8vIEF2b2lkIGludmFsaWRhdGluZyBkZXBlbmRlbnRzIGlmIHNldFVzZXJJZCBpcyBjYWxsZWQgd2l0aCBjdXJyZW50IHZhbHVlLlxuICAgIGlmICh0aGlzLl91c2VySWQgPT09IHVzZXJJZCkgcmV0dXJuO1xuICAgIHRoaXMuX3VzZXJJZCA9IHVzZXJJZDtcbiAgICBpZiAodGhpcy5fdXNlcklkRGVwcykgdGhpcy5fdXNlcklkRGVwcy5jaGFuZ2VkKCk7XG4gIH1cblxuICAvLyBSZXR1cm5zIHRydWUgaWYgd2UgYXJlIGluIGEgc3RhdGUgYWZ0ZXIgcmVjb25uZWN0IG9mIHdhaXRpbmcgZm9yIHN1YnMgdG8gYmVcbiAgLy8gcmV2aXZlZCBvciBlYXJseSBtZXRob2RzIHRvIGZpbmlzaCB0aGVpciBkYXRhLCBvciB3ZSBhcmUgd2FpdGluZyBmb3IgYVxuICAvLyBcIndhaXRcIiBtZXRob2QgdG8gZmluaXNoLlxuICBfd2FpdGluZ0ZvclF1aWVzY2VuY2UoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgICEgaXNFbXB0eSh0aGlzLl9zdWJzQmVpbmdSZXZpdmVkKSB8fFxuICAgICAgISBpc0VtcHR5KHRoaXMuX21ldGhvZHNCbG9ja2luZ1F1aWVzY2VuY2UpXG4gICAgKTtcbiAgfVxuXG4gIC8vIFJldHVybnMgdHJ1ZSBpZiBhbnkgbWV0aG9kIHdob3NlIG1lc3NhZ2UgaGFzIGJlZW4gc2VudCB0byB0aGUgc2VydmVyIGhhc1xuICAvLyBub3QgeWV0IGludm9rZWQgaXRzIHVzZXIgY2FsbGJhY2suXG4gIF9hbnlNZXRob2RzQXJlT3V0c3RhbmRpbmcoKSB7XG4gICAgY29uc3QgaW52b2tlcnMgPSB0aGlzLl9tZXRob2RJbnZva2VycztcbiAgICByZXR1cm4ga2V5cyhpbnZva2Vycykuc29tZShpZCA9PiB7XG4gICAgICByZXR1cm4gaW52b2tlcnNbaWRdLnNlbnRNZXNzYWdlO1xuICAgIH0pO1xuICB9XG5cbiAgX2xpdmVkYXRhX2Nvbm5lY3RlZChtc2cpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICBpZiAoc2VsZi5fdmVyc2lvbiAhPT0gJ3ByZTEnICYmIHNlbGYuX2hlYXJ0YmVhdEludGVydmFsICE9PSAwKSB7XG4gICAgICBzZWxmLl9oZWFydGJlYXQgPSBuZXcgRERQQ29tbW9uLkhlYXJ0YmVhdCh7XG4gICAgICAgIGhlYXJ0YmVhdEludGVydmFsOiBzZWxmLl9oZWFydGJlYXRJbnRlcnZhbCxcbiAgICAgICAgaGVhcnRiZWF0VGltZW91dDogc2VsZi5faGVhcnRiZWF0VGltZW91dCxcbiAgICAgICAgb25UaW1lb3V0KCkge1xuICAgICAgICAgIHNlbGYuX2xvc3RDb25uZWN0aW9uKFxuICAgICAgICAgICAgbmV3IEREUC5Db25uZWN0aW9uRXJyb3IoJ0REUCBoZWFydGJlYXQgdGltZWQgb3V0JylcbiAgICAgICAgICApO1xuICAgICAgICB9LFxuICAgICAgICBzZW5kUGluZygpIHtcbiAgICAgICAgICBzZWxmLl9zZW5kKHsgbXNnOiAncGluZycgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgc2VsZi5faGVhcnRiZWF0LnN0YXJ0KCk7XG4gICAgfVxuXG4gICAgLy8gSWYgdGhpcyBpcyBhIHJlY29ubmVjdCwgd2UnbGwgaGF2ZSB0byByZXNldCBhbGwgc3RvcmVzLlxuICAgIGlmIChzZWxmLl9sYXN0U2Vzc2lvbklkKSBzZWxmLl9yZXNldFN0b3JlcyA9IHRydWU7XG5cbiAgICBpZiAodHlwZW9mIG1zZy5zZXNzaW9uID09PSAnc3RyaW5nJykge1xuICAgICAgdmFyIHJlY29ubmVjdGVkVG9QcmV2aW91c1Nlc3Npb24gPSBzZWxmLl9sYXN0U2Vzc2lvbklkID09PSBtc2cuc2Vzc2lvbjtcbiAgICAgIHNlbGYuX2xhc3RTZXNzaW9uSWQgPSBtc2cuc2Vzc2lvbjtcbiAgICB9XG5cbiAgICBpZiAocmVjb25uZWN0ZWRUb1ByZXZpb3VzU2Vzc2lvbikge1xuICAgICAgLy8gU3VjY2Vzc2Z1bCByZWNvbm5lY3Rpb24gLS0gcGljayB1cCB3aGVyZSB3ZSBsZWZ0IG9mZi4gIE5vdGUgdGhhdCByaWdodFxuICAgICAgLy8gbm93LCB0aGlzIG5ldmVyIGhhcHBlbnM6IHRoZSBzZXJ2ZXIgbmV2ZXIgY29ubmVjdHMgdXMgdG8gYSBwcmV2aW91c1xuICAgICAgLy8gc2Vzc2lvbiwgYmVjYXVzZSBERFAgZG9lc24ndCBwcm92aWRlIGVub3VnaCBkYXRhIGZvciB0aGUgc2VydmVyIHRvIGtub3dcbiAgICAgIC8vIHdoYXQgbWVzc2FnZXMgdGhlIGNsaWVudCBoYXMgcHJvY2Vzc2VkLiBXZSBuZWVkIHRvIGltcHJvdmUgRERQIHRvIG1ha2VcbiAgICAgIC8vIHRoaXMgcG9zc2libGUsIGF0IHdoaWNoIHBvaW50IHdlJ2xsIHByb2JhYmx5IG5lZWQgbW9yZSBjb2RlIGhlcmUuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gU2VydmVyIGRvZXNuJ3QgaGF2ZSBvdXIgZGF0YSBhbnkgbW9yZS4gUmUtc3luYyBhIG5ldyBzZXNzaW9uLlxuXG4gICAgLy8gRm9yZ2V0IGFib3V0IG1lc3NhZ2VzIHdlIHdlcmUgYnVmZmVyaW5nIGZvciB1bmtub3duIGNvbGxlY3Rpb25zLiBUaGV5J2xsXG4gICAgLy8gYmUgcmVzZW50IGlmIHN0aWxsIHJlbGV2YW50LlxuICAgIHNlbGYuX3VwZGF0ZXNGb3JVbmtub3duU3RvcmVzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuICAgIGlmIChzZWxmLl9yZXNldFN0b3Jlcykge1xuICAgICAgLy8gRm9yZ2V0IGFib3V0IHRoZSBlZmZlY3RzIG9mIHN0dWJzLiBXZSdsbCBiZSByZXNldHRpbmcgYWxsIGNvbGxlY3Rpb25zXG4gICAgICAvLyBhbnl3YXkuXG4gICAgICBzZWxmLl9kb2N1bWVudHNXcml0dGVuQnlTdHViID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAgIHNlbGYuX3NlcnZlckRvY3VtZW50cyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgfVxuXG4gICAgLy8gQ2xlYXIgX2FmdGVyVXBkYXRlQ2FsbGJhY2tzLlxuICAgIHNlbGYuX2FmdGVyVXBkYXRlQ2FsbGJhY2tzID0gW107XG5cbiAgICAvLyBNYXJrIGFsbCBuYW1lZCBzdWJzY3JpcHRpb25zIHdoaWNoIGFyZSByZWFkeSAoaWUsIHdlIGFscmVhZHkgY2FsbGVkIHRoZVxuICAgIC8vIHJlYWR5IGNhbGxiYWNrKSBhcyBuZWVkaW5nIHRvIGJlIHJldml2ZWQuXG4gICAgLy8gWFhYIFdlIHNob3VsZCBhbHNvIGJsb2NrIHJlY29ubmVjdCBxdWllc2NlbmNlIHVudGlsIHVubmFtZWQgc3Vic2NyaXB0aW9uc1xuICAgIC8vICAgICAoZWcsIGF1dG9wdWJsaXNoKSBhcmUgZG9uZSByZS1wdWJsaXNoaW5nIHRvIGF2b2lkIGZsaWNrZXIhXG4gICAgc2VsZi5fc3Vic0JlaW5nUmV2aXZlZCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAga2V5cyhzZWxmLl9zdWJzY3JpcHRpb25zKS5mb3JFYWNoKGlkID0+IHtcbiAgICAgIGlmIChzZWxmLl9zdWJzY3JpcHRpb25zW2lkXS5yZWFkeSkge1xuICAgICAgICBzZWxmLl9zdWJzQmVpbmdSZXZpdmVkW2lkXSA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBBcnJhbmdlIGZvciBcImhhbGYtZmluaXNoZWRcIiBtZXRob2RzIHRvIGhhdmUgdGhlaXIgY2FsbGJhY2tzIHJ1biwgYW5kXG4gICAgLy8gdHJhY2sgbWV0aG9kcyB0aGF0IHdlcmUgc2VudCBvbiB0aGlzIGNvbm5lY3Rpb24gc28gdGhhdCB3ZSBkb24ndFxuICAgIC8vIHF1aWVzY2UgdW50aWwgdGhleSBhcmUgYWxsIGRvbmUuXG4gICAgLy9cbiAgICAvLyBTdGFydCBieSBjbGVhcmluZyBfbWV0aG9kc0Jsb2NraW5nUXVpZXNjZW5jZTogbWV0aG9kcyBzZW50IGJlZm9yZVxuICAgIC8vIHJlY29ubmVjdCBkb24ndCBtYXR0ZXIsIGFuZCBhbnkgXCJ3YWl0XCIgbWV0aG9kcyBzZW50IG9uIHRoZSBuZXcgY29ubmVjdGlvblxuICAgIC8vIHRoYXQgd2UgZHJvcCBoZXJlIHdpbGwgYmUgcmVzdG9yZWQgYnkgdGhlIGxvb3AgYmVsb3cuXG4gICAgc2VsZi5fbWV0aG9kc0Jsb2NraW5nUXVpZXNjZW5jZSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgaWYgKHNlbGYuX3Jlc2V0U3RvcmVzKSB7XG4gICAgICBjb25zdCBpbnZva2VycyA9IHNlbGYuX21ldGhvZEludm9rZXJzO1xuICAgICAga2V5cyhpbnZva2VycykuZm9yRWFjaChpZCA9PiB7XG4gICAgICAgIGNvbnN0IGludm9rZXIgPSBpbnZva2Vyc1tpZF07XG4gICAgICAgIGlmIChpbnZva2VyLmdvdFJlc3VsdCgpKSB7XG4gICAgICAgICAgLy8gVGhpcyBtZXRob2QgYWxyZWFkeSBnb3QgaXRzIHJlc3VsdCwgYnV0IGl0IGRpZG4ndCBjYWxsIGl0cyBjYWxsYmFja1xuICAgICAgICAgIC8vIGJlY2F1c2UgaXRzIGRhdGEgZGlkbid0IGJlY29tZSB2aXNpYmxlLiBXZSBkaWQgbm90IHJlc2VuZCB0aGVcbiAgICAgICAgICAvLyBtZXRob2QgUlBDLiBXZSdsbCBjYWxsIGl0cyBjYWxsYmFjayB3aGVuIHdlIGdldCBhIGZ1bGwgcXVpZXNjZSxcbiAgICAgICAgICAvLyBzaW5jZSB0aGF0J3MgYXMgY2xvc2UgYXMgd2UnbGwgZ2V0IHRvIFwiZGF0YSBtdXN0IGJlIHZpc2libGVcIi5cbiAgICAgICAgICBzZWxmLl9hZnRlclVwZGF0ZUNhbGxiYWNrcy5wdXNoKFxuICAgICAgICAgICAgKC4uLmFyZ3MpID0+IGludm9rZXIuZGF0YVZpc2libGUoLi4uYXJncylcbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2UgaWYgKGludm9rZXIuc2VudE1lc3NhZ2UpIHtcbiAgICAgICAgICAvLyBUaGlzIG1ldGhvZCBoYXMgYmVlbiBzZW50IG9uIHRoaXMgY29ubmVjdGlvbiAobWF5YmUgYXMgYSByZXNlbmRcbiAgICAgICAgICAvLyBmcm9tIHRoZSBsYXN0IGNvbm5lY3Rpb24sIG1heWJlIGZyb20gb25SZWNvbm5lY3QsIG1heWJlIGp1c3QgdmVyeVxuICAgICAgICAgIC8vIHF1aWNrbHkgYmVmb3JlIHByb2Nlc3NpbmcgdGhlIGNvbm5lY3RlZCBtZXNzYWdlKS5cbiAgICAgICAgICAvL1xuICAgICAgICAgIC8vIFdlIGRvbid0IG5lZWQgdG8gZG8gYW55dGhpbmcgc3BlY2lhbCB0byBlbnN1cmUgaXRzIGNhbGxiYWNrcyBnZXRcbiAgICAgICAgICAvLyBjYWxsZWQsIGJ1dCB3ZSdsbCBjb3VudCBpdCBhcyBhIG1ldGhvZCB3aGljaCBpcyBwcmV2ZW50aW5nXG4gICAgICAgICAgLy8gcmVjb25uZWN0IHF1aWVzY2VuY2UuIChlZywgaXQgbWlnaHQgYmUgYSBsb2dpbiBtZXRob2QgdGhhdCB3YXMgcnVuXG4gICAgICAgICAgLy8gZnJvbSBvblJlY29ubmVjdCwgYW5kIHdlIGRvbid0IHdhbnQgdG8gc2VlIGZsaWNrZXIgYnkgc2VlaW5nIGFcbiAgICAgICAgICAvLyBsb2dnZWQtb3V0IHN0YXRlLilcbiAgICAgICAgICBzZWxmLl9tZXRob2RzQmxvY2tpbmdRdWllc2NlbmNlW2ludm9rZXIubWV0aG9kSWRdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgc2VsZi5fbWVzc2FnZXNCdWZmZXJlZFVudGlsUXVpZXNjZW5jZSA9IFtdO1xuXG4gICAgLy8gSWYgd2UncmUgbm90IHdhaXRpbmcgb24gYW55IG1ldGhvZHMgb3Igc3Vicywgd2UgY2FuIHJlc2V0IHRoZSBzdG9yZXMgYW5kXG4gICAgLy8gY2FsbCB0aGUgY2FsbGJhY2tzIGltbWVkaWF0ZWx5LlxuICAgIGlmICghIHNlbGYuX3dhaXRpbmdGb3JRdWllc2NlbmNlKCkpIHtcbiAgICAgIGlmIChzZWxmLl9yZXNldFN0b3Jlcykge1xuICAgICAgICBrZXlzKHNlbGYuX3N0b3JlcykuZm9yRWFjaChzdG9yZU5hbWUgPT4ge1xuICAgICAgICAgIGNvbnN0IHMgPSBzZWxmLl9zdG9yZXNbc3RvcmVOYW1lXTtcbiAgICAgICAgICBzLmJlZ2luVXBkYXRlKDAsIHRydWUpO1xuICAgICAgICAgIHMuZW5kVXBkYXRlKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBzZWxmLl9yZXNldFN0b3JlcyA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgc2VsZi5fcnVuQWZ0ZXJVcGRhdGVDYWxsYmFja3MoKTtcbiAgICB9XG4gIH1cblxuICBfcHJvY2Vzc09uZURhdGFNZXNzYWdlKG1zZywgdXBkYXRlcykge1xuICAgIGNvbnN0IG1lc3NhZ2VUeXBlID0gbXNnLm1zZztcblxuICAgIC8vIG1zZyBpcyBvbmUgb2YgWydhZGRlZCcsICdjaGFuZ2VkJywgJ3JlbW92ZWQnLCAncmVhZHknLCAndXBkYXRlZCddXG4gICAgaWYgKG1lc3NhZ2VUeXBlID09PSAnYWRkZWQnKSB7XG4gICAgICB0aGlzLl9wcm9jZXNzX2FkZGVkKG1zZywgdXBkYXRlcyk7XG4gICAgfSBlbHNlIGlmIChtZXNzYWdlVHlwZSA9PT0gJ2NoYW5nZWQnKSB7XG4gICAgICB0aGlzLl9wcm9jZXNzX2NoYW5nZWQobXNnLCB1cGRhdGVzKTtcbiAgICB9IGVsc2UgaWYgKG1lc3NhZ2VUeXBlID09PSAncmVtb3ZlZCcpIHtcbiAgICAgIHRoaXMuX3Byb2Nlc3NfcmVtb3ZlZChtc2csIHVwZGF0ZXMpO1xuICAgIH0gZWxzZSBpZiAobWVzc2FnZVR5cGUgPT09ICdyZWFkeScpIHtcbiAgICAgIHRoaXMuX3Byb2Nlc3NfcmVhZHkobXNnLCB1cGRhdGVzKTtcbiAgICB9IGVsc2UgaWYgKG1lc3NhZ2VUeXBlID09PSAndXBkYXRlZCcpIHtcbiAgICAgIHRoaXMuX3Byb2Nlc3NfdXBkYXRlZChtc2csIHVwZGF0ZXMpO1xuICAgIH0gZWxzZSBpZiAobWVzc2FnZVR5cGUgPT09ICdub3N1YicpIHtcbiAgICAgIC8vIGlnbm9yZSB0aGlzXG4gICAgfSBlbHNlIHtcbiAgICAgIE1ldGVvci5fZGVidWcoJ2Rpc2NhcmRpbmcgdW5rbm93biBsaXZlZGF0YSBkYXRhIG1lc3NhZ2UgdHlwZScsIG1zZyk7XG4gICAgfVxuICB9XG5cbiAgX2xpdmVkYXRhX2RhdGEobXNnKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgaWYgKHNlbGYuX3dhaXRpbmdGb3JRdWllc2NlbmNlKCkpIHtcbiAgICAgIHNlbGYuX21lc3NhZ2VzQnVmZmVyZWRVbnRpbFF1aWVzY2VuY2UucHVzaChtc2cpO1xuXG4gICAgICBpZiAobXNnLm1zZyA9PT0gJ25vc3ViJykge1xuICAgICAgICBkZWxldGUgc2VsZi5fc3Vic0JlaW5nUmV2aXZlZFttc2cuaWRdO1xuICAgICAgfVxuXG4gICAgICBpZiAobXNnLnN1YnMpIHtcbiAgICAgICAgbXNnLnN1YnMuZm9yRWFjaChzdWJJZCA9PiB7XG4gICAgICAgICAgZGVsZXRlIHNlbGYuX3N1YnNCZWluZ1Jldml2ZWRbc3ViSWRdO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgaWYgKG1zZy5tZXRob2RzKSB7XG4gICAgICAgIG1zZy5tZXRob2RzLmZvckVhY2gobWV0aG9kSWQgPT4ge1xuICAgICAgICAgIGRlbGV0ZSBzZWxmLl9tZXRob2RzQmxvY2tpbmdRdWllc2NlbmNlW21ldGhvZElkXTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChzZWxmLl93YWl0aW5nRm9yUXVpZXNjZW5jZSgpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gTm8gbWV0aG9kcyBvciBzdWJzIGFyZSBibG9ja2luZyBxdWllc2NlbmNlIVxuICAgICAgLy8gV2UnbGwgbm93IHByb2Nlc3MgYW5kIGFsbCBvZiBvdXIgYnVmZmVyZWQgbWVzc2FnZXMsIHJlc2V0IGFsbCBzdG9yZXMsXG4gICAgICAvLyBhbmQgYXBwbHkgdGhlbSBhbGwgYXQgb25jZS5cblxuICAgICAgY29uc3QgYnVmZmVyZWRNZXNzYWdlcyA9IHNlbGYuX21lc3NhZ2VzQnVmZmVyZWRVbnRpbFF1aWVzY2VuY2U7XG4gICAgICBrZXlzKGJ1ZmZlcmVkTWVzc2FnZXMpLmZvckVhY2goaWQgPT4ge1xuICAgICAgICBzZWxmLl9wcm9jZXNzT25lRGF0YU1lc3NhZ2UoXG4gICAgICAgICAgYnVmZmVyZWRNZXNzYWdlc1tpZF0sXG4gICAgICAgICAgc2VsZi5fYnVmZmVyZWRXcml0ZXNcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuXG4gICAgICBzZWxmLl9tZXNzYWdlc0J1ZmZlcmVkVW50aWxRdWllc2NlbmNlID0gW107XG5cbiAgICB9IGVsc2Uge1xuICAgICAgc2VsZi5fcHJvY2Vzc09uZURhdGFNZXNzYWdlKG1zZywgc2VsZi5fYnVmZmVyZWRXcml0ZXMpO1xuICAgIH1cblxuICAgIC8vIEltbWVkaWF0ZWx5IGZsdXNoIHdyaXRlcyB3aGVuOlxuICAgIC8vICAxLiBCdWZmZXJpbmcgaXMgZGlzYWJsZWQuIE9yO1xuICAgIC8vICAyLiBhbnkgbm9uLShhZGRlZC9jaGFuZ2VkL3JlbW92ZWQpIG1lc3NhZ2UgYXJyaXZlcy5cbiAgICB2YXIgc3RhbmRhcmRXcml0ZSA9XG4gICAgICBtc2cubXNnID09PSBcImFkZGVkXCIgfHxcbiAgICAgIG1zZy5tc2cgPT09IFwiY2hhbmdlZFwiIHx8XG4gICAgICBtc2cubXNnID09PSBcInJlbW92ZWRcIjtcblxuICAgIGlmIChzZWxmLl9idWZmZXJlZFdyaXRlc0ludGVydmFsID09PSAwIHx8ICEgc3RhbmRhcmRXcml0ZSkge1xuICAgICAgc2VsZi5fZmx1c2hCdWZmZXJlZFdyaXRlcygpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChzZWxmLl9idWZmZXJlZFdyaXRlc0ZsdXNoQXQgPT09IG51bGwpIHtcbiAgICAgIHNlbGYuX2J1ZmZlcmVkV3JpdGVzRmx1c2hBdCA9XG4gICAgICAgIG5ldyBEYXRlKCkudmFsdWVPZigpICsgc2VsZi5fYnVmZmVyZWRXcml0ZXNNYXhBZ2U7XG4gICAgfSBlbHNlIGlmIChzZWxmLl9idWZmZXJlZFdyaXRlc0ZsdXNoQXQgPCBuZXcgRGF0ZSgpLnZhbHVlT2YoKSkge1xuICAgICAgc2VsZi5fZmx1c2hCdWZmZXJlZFdyaXRlcygpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChzZWxmLl9idWZmZXJlZFdyaXRlc0ZsdXNoSGFuZGxlKSB7XG4gICAgICBjbGVhclRpbWVvdXQoc2VsZi5fYnVmZmVyZWRXcml0ZXNGbHVzaEhhbmRsZSk7XG4gICAgfVxuICAgIHNlbGYuX2J1ZmZlcmVkV3JpdGVzRmx1c2hIYW5kbGUgPSBzZXRUaW1lb3V0KFxuICAgICAgc2VsZi5fX2ZsdXNoQnVmZmVyZWRXcml0ZXMsXG4gICAgICBzZWxmLl9idWZmZXJlZFdyaXRlc0ludGVydmFsXG4gICAgKTtcbiAgfVxuXG4gIF9mbHVzaEJ1ZmZlcmVkV3JpdGVzKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBpZiAoc2VsZi5fYnVmZmVyZWRXcml0ZXNGbHVzaEhhbmRsZSkge1xuICAgICAgY2xlYXJUaW1lb3V0KHNlbGYuX2J1ZmZlcmVkV3JpdGVzRmx1c2hIYW5kbGUpO1xuICAgICAgc2VsZi5fYnVmZmVyZWRXcml0ZXNGbHVzaEhhbmRsZSA9IG51bGw7XG4gICAgfVxuXG4gICAgc2VsZi5fYnVmZmVyZWRXcml0ZXNGbHVzaEF0ID0gbnVsbDtcbiAgICAvLyBXZSBuZWVkIHRvIGNsZWFyIHRoZSBidWZmZXIgYmVmb3JlIHBhc3NpbmcgaXQgdG9cbiAgICAvLyAgcGVyZm9ybVdyaXRlcy4gQXMgdGhlcmUncyBubyBndWFyYW50ZWUgdGhhdCBpdFxuICAgIC8vICB3aWxsIGV4aXQgY2xlYW5seS5cbiAgICB2YXIgd3JpdGVzID0gc2VsZi5fYnVmZmVyZWRXcml0ZXM7XG4gICAgc2VsZi5fYnVmZmVyZWRXcml0ZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIHNlbGYuX3BlcmZvcm1Xcml0ZXMod3JpdGVzKTtcbiAgfVxuXG4gIF9wZXJmb3JtV3JpdGVzKHVwZGF0ZXMpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICBpZiAoc2VsZi5fcmVzZXRTdG9yZXMgfHwgISBpc0VtcHR5KHVwZGF0ZXMpKSB7XG4gICAgICAvLyBCZWdpbiBhIHRyYW5zYWN0aW9uYWwgdXBkYXRlIG9mIGVhY2ggc3RvcmUuXG5cbiAgICAgIGtleXMoc2VsZi5fc3RvcmVzKS5mb3JFYWNoKHN0b3JlTmFtZSA9PiB7XG4gICAgICAgIHNlbGYuX3N0b3Jlc1tzdG9yZU5hbWVdLmJlZ2luVXBkYXRlKFxuICAgICAgICAgIGhhc093bi5jYWxsKHVwZGF0ZXMsIHN0b3JlTmFtZSlcbiAgICAgICAgICAgID8gdXBkYXRlc1tzdG9yZU5hbWVdLmxlbmd0aFxuICAgICAgICAgICAgOiAwLFxuICAgICAgICAgIHNlbGYuX3Jlc2V0U3RvcmVzXG4gICAgICAgICk7XG4gICAgICB9KTtcblxuICAgICAgc2VsZi5fcmVzZXRTdG9yZXMgPSBmYWxzZTtcblxuICAgICAga2V5cyh1cGRhdGVzKS5mb3JFYWNoKHN0b3JlTmFtZSA9PiB7XG4gICAgICAgIGNvbnN0IHVwZGF0ZU1lc3NhZ2VzID0gdXBkYXRlc1tzdG9yZU5hbWVdO1xuICAgICAgICB2YXIgc3RvcmUgPSBzZWxmLl9zdG9yZXNbc3RvcmVOYW1lXTtcbiAgICAgICAgaWYgKHN0b3JlKSB7XG4gICAgICAgICAgdXBkYXRlTWVzc2FnZXMuZm9yRWFjaCh1cGRhdGVNZXNzYWdlID0+IHtcbiAgICAgICAgICAgIHN0b3JlLnVwZGF0ZSh1cGRhdGVNZXNzYWdlKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBOb2JvZHkncyBsaXN0ZW5pbmcgZm9yIHRoaXMgZGF0YS4gUXVldWUgaXQgdXAgdW50aWxcbiAgICAgICAgICAvLyBzb21lb25lIHdhbnRzIGl0LlxuICAgICAgICAgIC8vIFhYWCBtZW1vcnkgdXNlIHdpbGwgZ3JvdyB3aXRob3V0IGJvdW5kIGlmIHlvdSBmb3JnZXQgdG9cbiAgICAgICAgICAvLyBjcmVhdGUgYSBjb2xsZWN0aW9uIG9yIGp1c3QgZG9uJ3QgY2FyZSBhYm91dCBpdC4uLiBnb2luZ1xuICAgICAgICAgIC8vIHRvIGhhdmUgdG8gZG8gc29tZXRoaW5nIGFib3V0IHRoYXQuXG4gICAgICAgICAgY29uc3QgdXBkYXRlcyA9IHNlbGYuX3VwZGF0ZXNGb3JVbmtub3duU3RvcmVzO1xuXG4gICAgICAgICAgaWYgKCEgaGFzT3duLmNhbGwodXBkYXRlcywgc3RvcmVOYW1lKSkge1xuICAgICAgICAgICAgdXBkYXRlc1tzdG9yZU5hbWVdID0gW107XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdXBkYXRlc1tzdG9yZU5hbWVdLnB1c2goLi4udXBkYXRlTWVzc2FnZXMpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgLy8gRW5kIHVwZGF0ZSB0cmFuc2FjdGlvbi5cbiAgICAgIGtleXMoc2VsZi5fc3RvcmVzKS5mb3JFYWNoKHN0b3JlTmFtZSA9PiB7XG4gICAgICAgIHNlbGYuX3N0b3Jlc1tzdG9yZU5hbWVdLmVuZFVwZGF0ZSgpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgc2VsZi5fcnVuQWZ0ZXJVcGRhdGVDYWxsYmFja3MoKTtcbiAgfVxuXG4gIC8vIENhbGwgYW55IGNhbGxiYWNrcyBkZWZlcnJlZCB3aXRoIF9ydW5XaGVuQWxsU2VydmVyRG9jc0FyZUZsdXNoZWQgd2hvc2VcbiAgLy8gcmVsZXZhbnQgZG9jcyBoYXZlIGJlZW4gZmx1c2hlZCwgYXMgd2VsbCBhcyBkYXRhVmlzaWJsZSBjYWxsYmFja3MgYXRcbiAgLy8gcmVjb25uZWN0LXF1aWVzY2VuY2UgdGltZS5cbiAgX3J1bkFmdGVyVXBkYXRlQ2FsbGJhY2tzKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgY2FsbGJhY2tzID0gc2VsZi5fYWZ0ZXJVcGRhdGVDYWxsYmFja3M7XG4gICAgc2VsZi5fYWZ0ZXJVcGRhdGVDYWxsYmFja3MgPSBbXTtcbiAgICBjYWxsYmFja3MuZm9yRWFjaChjID0+IHtcbiAgICAgIGMoKTtcbiAgICB9KTtcbiAgfVxuXG4gIF9wdXNoVXBkYXRlKHVwZGF0ZXMsIGNvbGxlY3Rpb24sIG1zZykge1xuICAgIGlmICghIGhhc093bi5jYWxsKHVwZGF0ZXMsIGNvbGxlY3Rpb24pKSB7XG4gICAgICB1cGRhdGVzW2NvbGxlY3Rpb25dID0gW107XG4gICAgfVxuICAgIHVwZGF0ZXNbY29sbGVjdGlvbl0ucHVzaChtc2cpO1xuICB9XG5cbiAgX2dldFNlcnZlckRvYyhjb2xsZWN0aW9uLCBpZCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBpZiAoISBoYXNPd24uY2FsbChzZWxmLl9zZXJ2ZXJEb2N1bWVudHMsIGNvbGxlY3Rpb24pKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgdmFyIHNlcnZlckRvY3NGb3JDb2xsZWN0aW9uID0gc2VsZi5fc2VydmVyRG9jdW1lbnRzW2NvbGxlY3Rpb25dO1xuICAgIHJldHVybiBzZXJ2ZXJEb2NzRm9yQ29sbGVjdGlvbi5nZXQoaWQpIHx8IG51bGw7XG4gIH1cblxuICBfcHJvY2Vzc19hZGRlZChtc2csIHVwZGF0ZXMpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGlkID0gTW9uZ29JRC5pZFBhcnNlKG1zZy5pZCk7XG4gICAgdmFyIHNlcnZlckRvYyA9IHNlbGYuX2dldFNlcnZlckRvYyhtc2cuY29sbGVjdGlvbiwgaWQpO1xuICAgIGlmIChzZXJ2ZXJEb2MpIHtcbiAgICAgIC8vIFNvbWUgb3V0c3RhbmRpbmcgc3R1YiB3cm90ZSBoZXJlLlxuICAgICAgdmFyIGlzRXhpc3RpbmcgPSBzZXJ2ZXJEb2MuZG9jdW1lbnQgIT09IHVuZGVmaW5lZDtcblxuICAgICAgc2VydmVyRG9jLmRvY3VtZW50ID0gbXNnLmZpZWxkcyB8fCBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgc2VydmVyRG9jLmRvY3VtZW50Ll9pZCA9IGlkO1xuXG4gICAgICBpZiAoc2VsZi5fcmVzZXRTdG9yZXMpIHtcbiAgICAgICAgLy8gRHVyaW5nIHJlY29ubmVjdCB0aGUgc2VydmVyIGlzIHNlbmRpbmcgYWRkcyBmb3IgZXhpc3RpbmcgaWRzLlxuICAgICAgICAvLyBBbHdheXMgcHVzaCBhbiB1cGRhdGUgc28gdGhhdCBkb2N1bWVudCBzdGF5cyBpbiB0aGUgc3RvcmUgYWZ0ZXJcbiAgICAgICAgLy8gcmVzZXQuIFVzZSBjdXJyZW50IHZlcnNpb24gb2YgdGhlIGRvY3VtZW50IGZvciB0aGlzIHVwZGF0ZSwgc29cbiAgICAgICAgLy8gdGhhdCBzdHViLXdyaXR0ZW4gdmFsdWVzIGFyZSBwcmVzZXJ2ZWQuXG4gICAgICAgIHZhciBjdXJyZW50RG9jID0gc2VsZi5fc3RvcmVzW21zZy5jb2xsZWN0aW9uXS5nZXREb2MobXNnLmlkKTtcbiAgICAgICAgaWYgKGN1cnJlbnREb2MgIT09IHVuZGVmaW5lZCkgbXNnLmZpZWxkcyA9IGN1cnJlbnREb2M7XG5cbiAgICAgICAgc2VsZi5fcHVzaFVwZGF0ZSh1cGRhdGVzLCBtc2cuY29sbGVjdGlvbiwgbXNnKTtcbiAgICAgIH0gZWxzZSBpZiAoaXNFeGlzdGluZykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NlcnZlciBzZW50IGFkZCBmb3IgZXhpc3RpbmcgaWQ6ICcgKyBtc2cuaWQpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzZWxmLl9wdXNoVXBkYXRlKHVwZGF0ZXMsIG1zZy5jb2xsZWN0aW9uLCBtc2cpO1xuICAgIH1cbiAgfVxuXG4gIF9wcm9jZXNzX2NoYW5nZWQobXNnLCB1cGRhdGVzKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBzZXJ2ZXJEb2MgPSBzZWxmLl9nZXRTZXJ2ZXJEb2MobXNnLmNvbGxlY3Rpb24sIE1vbmdvSUQuaWRQYXJzZShtc2cuaWQpKTtcbiAgICBpZiAoc2VydmVyRG9jKSB7XG4gICAgICBpZiAoc2VydmVyRG9jLmRvY3VtZW50ID09PSB1bmRlZmluZWQpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignU2VydmVyIHNlbnQgY2hhbmdlZCBmb3Igbm9uZXhpc3RpbmcgaWQ6ICcgKyBtc2cuaWQpO1xuICAgICAgRGlmZlNlcXVlbmNlLmFwcGx5Q2hhbmdlcyhzZXJ2ZXJEb2MuZG9jdW1lbnQsIG1zZy5maWVsZHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZWxmLl9wdXNoVXBkYXRlKHVwZGF0ZXMsIG1zZy5jb2xsZWN0aW9uLCBtc2cpO1xuICAgIH1cbiAgfVxuXG4gIF9wcm9jZXNzX3JlbW92ZWQobXNnLCB1cGRhdGVzKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBzZXJ2ZXJEb2MgPSBzZWxmLl9nZXRTZXJ2ZXJEb2MobXNnLmNvbGxlY3Rpb24sIE1vbmdvSUQuaWRQYXJzZShtc2cuaWQpKTtcbiAgICBpZiAoc2VydmVyRG9jKSB7XG4gICAgICAvLyBTb21lIG91dHN0YW5kaW5nIHN0dWIgd3JvdGUgaGVyZS5cbiAgICAgIGlmIChzZXJ2ZXJEb2MuZG9jdW1lbnQgPT09IHVuZGVmaW5lZClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTZXJ2ZXIgc2VudCByZW1vdmVkIGZvciBub25leGlzdGluZyBpZDonICsgbXNnLmlkKTtcbiAgICAgIHNlcnZlckRvYy5kb2N1bWVudCA9IHVuZGVmaW5lZDtcbiAgICB9IGVsc2Uge1xuICAgICAgc2VsZi5fcHVzaFVwZGF0ZSh1cGRhdGVzLCBtc2cuY29sbGVjdGlvbiwge1xuICAgICAgICBtc2c6ICdyZW1vdmVkJyxcbiAgICAgICAgY29sbGVjdGlvbjogbXNnLmNvbGxlY3Rpb24sXG4gICAgICAgIGlkOiBtc2cuaWRcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIF9wcm9jZXNzX3VwZGF0ZWQobXNnLCB1cGRhdGVzKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIC8vIFByb2Nlc3MgXCJtZXRob2QgZG9uZVwiIG1lc3NhZ2VzLlxuXG4gICAgbXNnLm1ldGhvZHMuZm9yRWFjaChtZXRob2RJZCA9PiB7XG4gICAgICBjb25zdCBkb2NzID0gc2VsZi5fZG9jdW1lbnRzV3JpdHRlbkJ5U3R1YlttZXRob2RJZF07XG4gICAgICBrZXlzKGRvY3MpLmZvckVhY2goaWQgPT4ge1xuICAgICAgICBjb25zdCB3cml0dGVuID0gZG9jc1tpZF07XG4gICAgICAgIGNvbnN0IHNlcnZlckRvYyA9IHNlbGYuX2dldFNlcnZlckRvYyh3cml0dGVuLmNvbGxlY3Rpb24sIHdyaXR0ZW4uaWQpO1xuICAgICAgICBpZiAoISBzZXJ2ZXJEb2MpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0xvc3Qgc2VydmVyRG9jIGZvciAnICsgSlNPTi5zdHJpbmdpZnkod3JpdHRlbikpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghIHNlcnZlckRvYy53cml0dGVuQnlTdHVic1ttZXRob2RJZF0pIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICAnRG9jICcgK1xuICAgICAgICAgICAgICBKU09OLnN0cmluZ2lmeSh3cml0dGVuKSArXG4gICAgICAgICAgICAgICcgbm90IHdyaXR0ZW4gYnkgIG1ldGhvZCAnICtcbiAgICAgICAgICAgICAgbWV0aG9kSWRcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIGRlbGV0ZSBzZXJ2ZXJEb2Mud3JpdHRlbkJ5U3R1YnNbbWV0aG9kSWRdO1xuICAgICAgICBpZiAoaXNFbXB0eShzZXJ2ZXJEb2Mud3JpdHRlbkJ5U3R1YnMpKSB7XG4gICAgICAgICAgLy8gQWxsIG1ldGhvZHMgd2hvc2Ugc3R1YnMgd3JvdGUgdGhpcyBtZXRob2QgaGF2ZSBjb21wbGV0ZWQhIFdlIGNhblxuICAgICAgICAgIC8vIG5vdyBjb3B5IHRoZSBzYXZlZCBkb2N1bWVudCB0byB0aGUgZGF0YWJhc2UgKHJldmVydGluZyB0aGUgc3R1YidzXG4gICAgICAgICAgLy8gY2hhbmdlIGlmIHRoZSBzZXJ2ZXIgZGlkIG5vdCB3cml0ZSB0byB0aGlzIG9iamVjdCwgb3IgYXBwbHlpbmcgdGhlXG4gICAgICAgICAgLy8gc2VydmVyJ3Mgd3JpdGVzIGlmIGl0IGRpZCkuXG5cbiAgICAgICAgICAvLyBUaGlzIGlzIGEgZmFrZSBkZHAgJ3JlcGxhY2UnIG1lc3NhZ2UuICBJdCdzIGp1c3QgZm9yIHRhbGtpbmdcbiAgICAgICAgICAvLyBiZXR3ZWVuIGxpdmVkYXRhIGNvbm5lY3Rpb25zIGFuZCBtaW5pbW9uZ28uICAoV2UgaGF2ZSB0byBzdHJpbmdpZnlcbiAgICAgICAgICAvLyB0aGUgSUQgYmVjYXVzZSBpdCdzIHN1cHBvc2VkIHRvIGxvb2sgbGlrZSBhIHdpcmUgbWVzc2FnZS4pXG4gICAgICAgICAgc2VsZi5fcHVzaFVwZGF0ZSh1cGRhdGVzLCB3cml0dGVuLmNvbGxlY3Rpb24sIHtcbiAgICAgICAgICAgIG1zZzogJ3JlcGxhY2UnLFxuICAgICAgICAgICAgaWQ6IE1vbmdvSUQuaWRTdHJpbmdpZnkod3JpdHRlbi5pZCksXG4gICAgICAgICAgICByZXBsYWNlOiBzZXJ2ZXJEb2MuZG9jdW1lbnRcbiAgICAgICAgICB9KTtcbiAgICAgICAgICAvLyBDYWxsIGFsbCBmbHVzaCBjYWxsYmFja3MuXG5cbiAgICAgICAgICBzZXJ2ZXJEb2MuZmx1c2hDYWxsYmFja3MuZm9yRWFjaChjID0+IHtcbiAgICAgICAgICAgIGMoKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIC8vIERlbGV0ZSB0aGlzIGNvbXBsZXRlZCBzZXJ2ZXJEb2N1bWVudC4gRG9uJ3QgYm90aGVyIHRvIEdDIGVtcHR5XG4gICAgICAgICAgLy8gSWRNYXBzIGluc2lkZSBzZWxmLl9zZXJ2ZXJEb2N1bWVudHMsIHNpbmNlIHRoZXJlIHByb2JhYmx5IGFyZW4ndFxuICAgICAgICAgIC8vIG1hbnkgY29sbGVjdGlvbnMgYW5kIHRoZXknbGwgYmUgd3JpdHRlbiByZXBlYXRlZGx5LlxuICAgICAgICAgIHNlbGYuX3NlcnZlckRvY3VtZW50c1t3cml0dGVuLmNvbGxlY3Rpb25dLnJlbW92ZSh3cml0dGVuLmlkKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBkZWxldGUgc2VsZi5fZG9jdW1lbnRzV3JpdHRlbkJ5U3R1YlttZXRob2RJZF07XG5cbiAgICAgIC8vIFdlIHdhbnQgdG8gY2FsbCB0aGUgZGF0YS13cml0dGVuIGNhbGxiYWNrLCBidXQgd2UgY2FuJ3QgZG8gc28gdW50aWwgYWxsXG4gICAgICAvLyBjdXJyZW50bHkgYnVmZmVyZWQgbWVzc2FnZXMgYXJlIGZsdXNoZWQuXG4gICAgICBjb25zdCBjYWxsYmFja0ludm9rZXIgPSBzZWxmLl9tZXRob2RJbnZva2Vyc1ttZXRob2RJZF07XG4gICAgICBpZiAoISBjYWxsYmFja0ludm9rZXIpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBjYWxsYmFjayBpbnZva2VyIGZvciBtZXRob2QgJyArIG1ldGhvZElkKTtcbiAgICAgIH1cblxuICAgICAgc2VsZi5fcnVuV2hlbkFsbFNlcnZlckRvY3NBcmVGbHVzaGVkKFxuICAgICAgICAoLi4uYXJncykgPT4gY2FsbGJhY2tJbnZva2VyLmRhdGFWaXNpYmxlKC4uLmFyZ3MpXG4gICAgICApO1xuICAgIH0pO1xuICB9XG5cbiAgX3Byb2Nlc3NfcmVhZHkobXNnLCB1cGRhdGVzKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIC8vIFByb2Nlc3MgXCJzdWIgcmVhZHlcIiBtZXNzYWdlcy4gXCJzdWIgcmVhZHlcIiBtZXNzYWdlcyBkb24ndCB0YWtlIGVmZmVjdFxuICAgIC8vIHVudGlsIGFsbCBjdXJyZW50IHNlcnZlciBkb2N1bWVudHMgaGF2ZSBiZWVuIGZsdXNoZWQgdG8gdGhlIGxvY2FsXG4gICAgLy8gZGF0YWJhc2UuIFdlIGNhbiB1c2UgYSB3cml0ZSBmZW5jZSB0byBpbXBsZW1lbnQgdGhpcy5cblxuICAgIG1zZy5zdWJzLmZvckVhY2goc3ViSWQgPT4ge1xuICAgICAgc2VsZi5fcnVuV2hlbkFsbFNlcnZlckRvY3NBcmVGbHVzaGVkKCgpID0+IHtcbiAgICAgICAgdmFyIHN1YlJlY29yZCA9IHNlbGYuX3N1YnNjcmlwdGlvbnNbc3ViSWRdO1xuICAgICAgICAvLyBEaWQgd2UgYWxyZWFkeSB1bnN1YnNjcmliZT9cbiAgICAgICAgaWYgKCFzdWJSZWNvcmQpIHJldHVybjtcbiAgICAgICAgLy8gRGlkIHdlIGFscmVhZHkgcmVjZWl2ZSBhIHJlYWR5IG1lc3NhZ2U/IChPb3BzISlcbiAgICAgICAgaWYgKHN1YlJlY29yZC5yZWFkeSkgcmV0dXJuO1xuICAgICAgICBzdWJSZWNvcmQucmVhZHkgPSB0cnVlO1xuICAgICAgICBzdWJSZWNvcmQucmVhZHlDYWxsYmFjayAmJiBzdWJSZWNvcmQucmVhZHlDYWxsYmFjaygpO1xuICAgICAgICBzdWJSZWNvcmQucmVhZHlEZXBzLmNoYW5nZWQoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gRW5zdXJlcyB0aGF0IFwiZlwiIHdpbGwgYmUgY2FsbGVkIGFmdGVyIGFsbCBkb2N1bWVudHMgY3VycmVudGx5IGluXG4gIC8vIF9zZXJ2ZXJEb2N1bWVudHMgaGF2ZSBiZWVuIHdyaXR0ZW4gdG8gdGhlIGxvY2FsIGNhY2hlLiBmIHdpbGwgbm90IGJlIGNhbGxlZFxuICAvLyBpZiB0aGUgY29ubmVjdGlvbiBpcyBsb3N0IGJlZm9yZSB0aGVuIVxuICBfcnVuV2hlbkFsbFNlcnZlckRvY3NBcmVGbHVzaGVkKGYpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIHJ1bkZBZnRlclVwZGF0ZXMgPSAoKSA9PiB7XG4gICAgICBzZWxmLl9hZnRlclVwZGF0ZUNhbGxiYWNrcy5wdXNoKGYpO1xuICAgIH07XG4gICAgdmFyIHVuZmx1c2hlZFNlcnZlckRvY0NvdW50ID0gMDtcbiAgICB2YXIgb25TZXJ2ZXJEb2NGbHVzaCA9ICgpID0+IHtcbiAgICAgIC0tdW5mbHVzaGVkU2VydmVyRG9jQ291bnQ7XG4gICAgICBpZiAodW5mbHVzaGVkU2VydmVyRG9jQ291bnQgPT09IDApIHtcbiAgICAgICAgLy8gVGhpcyB3YXMgdGhlIGxhc3QgZG9jIHRvIGZsdXNoISBBcnJhbmdlIHRvIHJ1biBmIGFmdGVyIHRoZSB1cGRhdGVzXG4gICAgICAgIC8vIGhhdmUgYmVlbiBhcHBsaWVkLlxuICAgICAgICBydW5GQWZ0ZXJVcGRhdGVzKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGtleXMoc2VsZi5fc2VydmVyRG9jdW1lbnRzKS5mb3JFYWNoKGNvbGxlY3Rpb24gPT4ge1xuICAgICAgc2VsZi5fc2VydmVyRG9jdW1lbnRzW2NvbGxlY3Rpb25dLmZvckVhY2goc2VydmVyRG9jID0+IHtcbiAgICAgICAgY29uc3Qgd3JpdHRlbkJ5U3R1YkZvckFNZXRob2RXaXRoU2VudE1lc3NhZ2UgPVxuICAgICAgICAgIGtleXMoc2VydmVyRG9jLndyaXR0ZW5CeVN0dWJzKS5zb21lKG1ldGhvZElkID0+IHtcbiAgICAgICAgICAgIHZhciBpbnZva2VyID0gc2VsZi5fbWV0aG9kSW52b2tlcnNbbWV0aG9kSWRdO1xuICAgICAgICAgICAgcmV0dXJuIGludm9rZXIgJiYgaW52b2tlci5zZW50TWVzc2FnZTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICBpZiAod3JpdHRlbkJ5U3R1YkZvckFNZXRob2RXaXRoU2VudE1lc3NhZ2UpIHtcbiAgICAgICAgICArK3VuZmx1c2hlZFNlcnZlckRvY0NvdW50O1xuICAgICAgICAgIHNlcnZlckRvYy5mbHVzaENhbGxiYWNrcy5wdXNoKG9uU2VydmVyRG9jRmx1c2gpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBpZiAodW5mbHVzaGVkU2VydmVyRG9jQ291bnQgPT09IDApIHtcbiAgICAgIC8vIFRoZXJlIGFyZW4ndCBhbnkgYnVmZmVyZWQgZG9jcyAtLS0gd2UgY2FuIGNhbGwgZiBhcyBzb29uIGFzIHRoZSBjdXJyZW50XG4gICAgICAvLyByb3VuZCBvZiB1cGRhdGVzIGlzIGFwcGxpZWQhXG4gICAgICBydW5GQWZ0ZXJVcGRhdGVzKCk7XG4gICAgfVxuICB9XG5cbiAgX2xpdmVkYXRhX25vc3ViKG1zZykge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIC8vIEZpcnN0IHBhc3MgaXQgdGhyb3VnaCBfbGl2ZWRhdGFfZGF0YSwgd2hpY2ggb25seSB1c2VzIGl0IHRvIGhlbHAgZ2V0XG4gICAgLy8gdG93YXJkcyBxdWllc2NlbmNlLlxuICAgIHNlbGYuX2xpdmVkYXRhX2RhdGEobXNnKTtcblxuICAgIC8vIERvIHRoZSByZXN0IG9mIG91ciBwcm9jZXNzaW5nIGltbWVkaWF0ZWx5LCB3aXRoIG5vXG4gICAgLy8gYnVmZmVyaW5nLXVudGlsLXF1aWVzY2VuY2UuXG5cbiAgICAvLyB3ZSB3ZXJlbid0IHN1YmJlZCBhbnl3YXksIG9yIHdlIGluaXRpYXRlZCB0aGUgdW5zdWIuXG4gICAgaWYgKCEgaGFzT3duLmNhbGwoc2VsZi5fc3Vic2NyaXB0aW9ucywgbXNnLmlkKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFhYWCBDT01QQVQgV0lUSCAxLjAuMy4xICNlcnJvckNhbGxiYWNrXG4gICAgdmFyIGVycm9yQ2FsbGJhY2sgPSBzZWxmLl9zdWJzY3JpcHRpb25zW21zZy5pZF0uZXJyb3JDYWxsYmFjaztcbiAgICB2YXIgc3RvcENhbGxiYWNrID0gc2VsZi5fc3Vic2NyaXB0aW9uc1ttc2cuaWRdLnN0b3BDYWxsYmFjaztcblxuICAgIHNlbGYuX3N1YnNjcmlwdGlvbnNbbXNnLmlkXS5yZW1vdmUoKTtcblxuICAgIHZhciBtZXRlb3JFcnJvckZyb21Nc2cgPSBtc2dBcmcgPT4ge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgbXNnQXJnICYmXG4gICAgICAgIG1zZ0FyZy5lcnJvciAmJlxuICAgICAgICBuZXcgTWV0ZW9yLkVycm9yKFxuICAgICAgICAgIG1zZ0FyZy5lcnJvci5lcnJvcixcbiAgICAgICAgICBtc2dBcmcuZXJyb3IucmVhc29uLFxuICAgICAgICAgIG1zZ0FyZy5lcnJvci5kZXRhaWxzXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfTtcblxuICAgIC8vIFhYWCBDT01QQVQgV0lUSCAxLjAuMy4xICNlcnJvckNhbGxiYWNrXG4gICAgaWYgKGVycm9yQ2FsbGJhY2sgJiYgbXNnLmVycm9yKSB7XG4gICAgICBlcnJvckNhbGxiYWNrKG1ldGVvckVycm9yRnJvbU1zZyhtc2cpKTtcbiAgICB9XG5cbiAgICBpZiAoc3RvcENhbGxiYWNrKSB7XG4gICAgICBzdG9wQ2FsbGJhY2sobWV0ZW9yRXJyb3JGcm9tTXNnKG1zZykpO1xuICAgIH1cbiAgfVxuXG4gIF9saXZlZGF0YV9yZXN1bHQobXNnKSB7XG4gICAgLy8gaWQsIHJlc3VsdCBvciBlcnJvci4gZXJyb3IgaGFzIGVycm9yIChjb2RlKSwgcmVhc29uLCBkZXRhaWxzXG5cbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAvLyBMZXRzIG1ha2Ugc3VyZSB0aGVyZSBhcmUgbm8gYnVmZmVyZWQgd3JpdGVzIGJlZm9yZSByZXR1cm5pbmcgcmVzdWx0LlxuICAgIGlmICghIGlzRW1wdHkoc2VsZi5fYnVmZmVyZWRXcml0ZXMpKSB7XG4gICAgICBzZWxmLl9mbHVzaEJ1ZmZlcmVkV3JpdGVzKCk7XG4gICAgfVxuXG4gICAgLy8gZmluZCB0aGUgb3V0c3RhbmRpbmcgcmVxdWVzdFxuICAgIC8vIHNob3VsZCBiZSBPKDEpIGluIG5lYXJseSBhbGwgcmVhbGlzdGljIHVzZSBjYXNlc1xuICAgIGlmIChpc0VtcHR5KHNlbGYuX291dHN0YW5kaW5nTWV0aG9kQmxvY2tzKSkge1xuICAgICAgTWV0ZW9yLl9kZWJ1ZygnUmVjZWl2ZWQgbWV0aG9kIHJlc3VsdCBidXQgbm8gbWV0aG9kcyBvdXRzdGFuZGluZycpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgY3VycmVudE1ldGhvZEJsb2NrID0gc2VsZi5fb3V0c3RhbmRpbmdNZXRob2RCbG9ja3NbMF0ubWV0aG9kcztcbiAgICB2YXIgbTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGN1cnJlbnRNZXRob2RCbG9jay5sZW5ndGg7IGkrKykge1xuICAgICAgbSA9IGN1cnJlbnRNZXRob2RCbG9ja1tpXTtcbiAgICAgIGlmIChtLm1ldGhvZElkID09PSBtc2cuaWQpIGJyZWFrO1xuICAgIH1cblxuICAgIGlmICghbSkge1xuICAgICAgTWV0ZW9yLl9kZWJ1ZyhcIkNhbid0IG1hdGNoIG1ldGhvZCByZXNwb25zZSB0byBvcmlnaW5hbCBtZXRob2QgY2FsbFwiLCBtc2cpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFJlbW92ZSBmcm9tIGN1cnJlbnQgbWV0aG9kIGJsb2NrLiBUaGlzIG1heSBsZWF2ZSB0aGUgYmxvY2sgZW1wdHksIGJ1dCB3ZVxuICAgIC8vIGRvbid0IG1vdmUgb24gdG8gdGhlIG5leHQgYmxvY2sgdW50aWwgdGhlIGNhbGxiYWNrIGhhcyBiZWVuIGRlbGl2ZXJlZCwgaW5cbiAgICAvLyBfb3V0c3RhbmRpbmdNZXRob2RGaW5pc2hlZC5cbiAgICBjdXJyZW50TWV0aG9kQmxvY2suc3BsaWNlKGksIDEpO1xuXG4gICAgaWYgKGhhc093bi5jYWxsKG1zZywgJ2Vycm9yJykpIHtcbiAgICAgIG0ucmVjZWl2ZVJlc3VsdChcbiAgICAgICAgbmV3IE1ldGVvci5FcnJvcihtc2cuZXJyb3IuZXJyb3IsIG1zZy5lcnJvci5yZWFzb24sIG1zZy5lcnJvci5kZXRhaWxzKVxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gbXNnLnJlc3VsdCBtYXkgYmUgdW5kZWZpbmVkIGlmIHRoZSBtZXRob2QgZGlkbid0IHJldHVybiBhXG4gICAgICAvLyB2YWx1ZVxuICAgICAgbS5yZWNlaXZlUmVzdWx0KHVuZGVmaW5lZCwgbXNnLnJlc3VsdCk7XG4gICAgfVxuICB9XG5cbiAgLy8gQ2FsbGVkIGJ5IE1ldGhvZEludm9rZXIgYWZ0ZXIgYSBtZXRob2QncyBjYWxsYmFjayBpcyBpbnZva2VkLiAgSWYgdGhpcyB3YXNcbiAgLy8gdGhlIGxhc3Qgb3V0c3RhbmRpbmcgbWV0aG9kIGluIHRoZSBjdXJyZW50IGJsb2NrLCBydW5zIHRoZSBuZXh0IGJsb2NrLiBJZlxuICAvLyB0aGVyZSBhcmUgbm8gbW9yZSBtZXRob2RzLCBjb25zaWRlciBhY2NlcHRpbmcgYSBob3QgY29kZSBwdXNoLlxuICBfb3V0c3RhbmRpbmdNZXRob2RGaW5pc2hlZCgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgaWYgKHNlbGYuX2FueU1ldGhvZHNBcmVPdXRzdGFuZGluZygpKSByZXR1cm47XG5cbiAgICAvLyBObyBtZXRob2RzIGFyZSBvdXRzdGFuZGluZy4gVGhpcyBzaG91bGQgbWVhbiB0aGF0IHRoZSBmaXJzdCBibG9jayBvZlxuICAgIC8vIG1ldGhvZHMgaXMgZW1wdHkuIChPciBpdCBtaWdodCBub3QgZXhpc3QsIGlmIHRoaXMgd2FzIGEgbWV0aG9kIHRoYXRcbiAgICAvLyBoYWxmLWZpbmlzaGVkIGJlZm9yZSBkaXNjb25uZWN0L3JlY29ubmVjdC4pXG4gICAgaWYgKCEgaXNFbXB0eShzZWxmLl9vdXRzdGFuZGluZ01ldGhvZEJsb2NrcykpIHtcbiAgICAgIHZhciBmaXJzdEJsb2NrID0gc2VsZi5fb3V0c3RhbmRpbmdNZXRob2RCbG9ja3Muc2hpZnQoKTtcbiAgICAgIGlmICghIGlzRW1wdHkoZmlyc3RCbG9jay5tZXRob2RzKSlcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICdObyBtZXRob2RzIG91dHN0YW5kaW5nIGJ1dCBub25lbXB0eSBibG9jazogJyArXG4gICAgICAgICAgICBKU09OLnN0cmluZ2lmeShmaXJzdEJsb2NrKVxuICAgICAgICApO1xuXG4gICAgICAvLyBTZW5kIHRoZSBvdXRzdGFuZGluZyBtZXRob2RzIG5vdyBpbiB0aGUgZmlyc3QgYmxvY2suXG4gICAgICBpZiAoISBpc0VtcHR5KHNlbGYuX291dHN0YW5kaW5nTWV0aG9kQmxvY2tzKSlcbiAgICAgICAgc2VsZi5fc2VuZE91dHN0YW5kaW5nTWV0aG9kcygpO1xuICAgIH1cblxuICAgIC8vIE1heWJlIGFjY2VwdCBhIGhvdCBjb2RlIHB1c2guXG4gICAgc2VsZi5fbWF5YmVNaWdyYXRlKCk7XG4gIH1cblxuICAvLyBTZW5kcyBtZXNzYWdlcyBmb3IgYWxsIHRoZSBtZXRob2RzIGluIHRoZSBmaXJzdCBibG9jayBpblxuICAvLyBfb3V0c3RhbmRpbmdNZXRob2RCbG9ja3MuXG4gIF9zZW5kT3V0c3RhbmRpbmdNZXRob2RzKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIGlmIChpc0VtcHR5KHNlbGYuX291dHN0YW5kaW5nTWV0aG9kQmxvY2tzKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHNlbGYuX291dHN0YW5kaW5nTWV0aG9kQmxvY2tzWzBdLm1ldGhvZHMuZm9yRWFjaChtID0+IHtcbiAgICAgIG0uc2VuZE1lc3NhZ2UoKTtcbiAgICB9KTtcbiAgfVxuXG4gIF9saXZlZGF0YV9lcnJvcihtc2cpIHtcbiAgICBNZXRlb3IuX2RlYnVnKCdSZWNlaXZlZCBlcnJvciBmcm9tIHNlcnZlcjogJywgbXNnLnJlYXNvbik7XG4gICAgaWYgKG1zZy5vZmZlbmRpbmdNZXNzYWdlKSBNZXRlb3IuX2RlYnVnKCdGb3I6ICcsIG1zZy5vZmZlbmRpbmdNZXNzYWdlKTtcbiAgfVxuXG4gIF9jYWxsT25SZWNvbm5lY3RBbmRTZW5kQXBwcm9wcmlhdGVPdXRzdGFuZGluZ01ldGhvZHMoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBvbGRPdXRzdGFuZGluZ01ldGhvZEJsb2NrcyA9IHNlbGYuX291dHN0YW5kaW5nTWV0aG9kQmxvY2tzO1xuICAgIHNlbGYuX291dHN0YW5kaW5nTWV0aG9kQmxvY2tzID0gW107XG5cbiAgICBzZWxmLm9uUmVjb25uZWN0ICYmIHNlbGYub25SZWNvbm5lY3QoKTtcbiAgICBERFAuX3JlY29ubmVjdEhvb2suZWFjaChjYWxsYmFjayA9PiB7XG4gICAgICBjYWxsYmFjayhzZWxmKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0pO1xuXG4gICAgaWYgKGlzRW1wdHkob2xkT3V0c3RhbmRpbmdNZXRob2RCbG9ja3MpKSByZXR1cm47XG5cbiAgICAvLyBXZSBoYXZlIGF0IGxlYXN0IG9uZSBibG9jayB3b3J0aCBvZiBvbGQgb3V0c3RhbmRpbmcgbWV0aG9kcyB0byB0cnlcbiAgICAvLyBhZ2Fpbi4gRmlyc3Q6IGRpZCBvblJlY29ubmVjdCBhY3R1YWxseSBzZW5kIGFueXRoaW5nPyBJZiBub3QsIHdlIGp1c3RcbiAgICAvLyByZXN0b3JlIGFsbCBvdXRzdGFuZGluZyBtZXRob2RzIGFuZCBydW4gdGhlIGZpcnN0IGJsb2NrLlxuICAgIGlmIChpc0VtcHR5KHNlbGYuX291dHN0YW5kaW5nTWV0aG9kQmxvY2tzKSkge1xuICAgICAgc2VsZi5fb3V0c3RhbmRpbmdNZXRob2RCbG9ja3MgPSBvbGRPdXRzdGFuZGluZ01ldGhvZEJsb2NrcztcbiAgICAgIHNlbGYuX3NlbmRPdXRzdGFuZGluZ01ldGhvZHMoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBPSywgdGhlcmUgYXJlIGJsb2NrcyBvbiBib3RoIHNpZGVzLiBTcGVjaWFsIGNhc2U6IG1lcmdlIHRoZSBsYXN0IGJsb2NrIG9mXG4gICAgLy8gdGhlIHJlY29ubmVjdCBtZXRob2RzIHdpdGggdGhlIGZpcnN0IGJsb2NrIG9mIHRoZSBvcmlnaW5hbCBtZXRob2RzLCBpZlxuICAgIC8vIG5laXRoZXIgb2YgdGhlbSBhcmUgXCJ3YWl0XCIgYmxvY2tzLlxuICAgIGlmICghIGxhc3Qoc2VsZi5fb3V0c3RhbmRpbmdNZXRob2RCbG9ja3MpLndhaXQgJiZcbiAgICAgICAgISBvbGRPdXRzdGFuZGluZ01ldGhvZEJsb2Nrc1swXS53YWl0KSB7XG4gICAgICBvbGRPdXRzdGFuZGluZ01ldGhvZEJsb2Nrc1swXS5tZXRob2RzLmZvckVhY2gobSA9PiB7XG4gICAgICAgIGxhc3Qoc2VsZi5fb3V0c3RhbmRpbmdNZXRob2RCbG9ja3MpLm1ldGhvZHMucHVzaChtKTtcblxuICAgICAgICAvLyBJZiB0aGlzIFwibGFzdCBibG9ja1wiIGlzIGFsc28gdGhlIGZpcnN0IGJsb2NrLCBzZW5kIHRoZSBtZXNzYWdlLlxuICAgICAgICBpZiAoc2VsZi5fb3V0c3RhbmRpbmdNZXRob2RCbG9ja3MubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgbS5zZW5kTWVzc2FnZSgpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgb2xkT3V0c3RhbmRpbmdNZXRob2RCbG9ja3Muc2hpZnQoKTtcbiAgICB9XG5cbiAgICAvLyBOb3cgYWRkIHRoZSByZXN0IG9mIHRoZSBvcmlnaW5hbCBibG9ja3Mgb24uXG4gICAgb2xkT3V0c3RhbmRpbmdNZXRob2RCbG9ja3MuZm9yRWFjaChibG9jayA9PiB7XG4gICAgICBzZWxmLl9vdXRzdGFuZGluZ01ldGhvZEJsb2Nrcy5wdXNoKGJsb2NrKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIFdlIGNhbiBhY2NlcHQgYSBob3QgY29kZSBwdXNoIGlmIHRoZXJlIGFyZSBubyBtZXRob2RzIGluIGZsaWdodC5cbiAgX3JlYWR5VG9NaWdyYXRlKCkge1xuICAgIHJldHVybiBpc0VtcHR5KHRoaXMuX21ldGhvZEludm9rZXJzKTtcbiAgfVxuXG4gIC8vIElmIHdlIHdlcmUgYmxvY2tpbmcgYSBtaWdyYXRpb24sIHNlZSBpZiBpdCdzIG5vdyBwb3NzaWJsZSB0byBjb250aW51ZS5cbiAgLy8gQ2FsbCB3aGVuZXZlciB0aGUgc2V0IG9mIG91dHN0YW5kaW5nL2Jsb2NrZWQgbWV0aG9kcyBzaHJpbmtzLlxuICBfbWF5YmVNaWdyYXRlKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBpZiAoc2VsZi5fcmV0cnlNaWdyYXRlICYmIHNlbGYuX3JlYWR5VG9NaWdyYXRlKCkpIHtcbiAgICAgIHNlbGYuX3JldHJ5TWlncmF0ZSgpO1xuICAgICAgc2VsZi5fcmV0cnlNaWdyYXRlID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBvbk1lc3NhZ2UocmF3X21zZykge1xuICAgIHRyeSB7XG4gICAgICB2YXIgbXNnID0gRERQQ29tbW9uLnBhcnNlRERQKHJhd19tc2cpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIE1ldGVvci5fZGVidWcoJ0V4Y2VwdGlvbiB3aGlsZSBwYXJzaW5nIEREUCcsIGUpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIEFueSBtZXNzYWdlIGNvdW50cyBhcyByZWNlaXZpbmcgYSBwb25nLCBhcyBpdCBkZW1vbnN0cmF0ZXMgdGhhdFxuICAgIC8vIHRoZSBzZXJ2ZXIgaXMgc3RpbGwgYWxpdmUuXG4gICAgaWYgKHRoaXMuX2hlYXJ0YmVhdCkge1xuICAgICAgdGhpcy5faGVhcnRiZWF0Lm1lc3NhZ2VSZWNlaXZlZCgpO1xuICAgIH1cblxuICAgIGlmIChtc2cgPT09IG51bGwgfHwgIW1zZy5tc2cpIHtcbiAgICAgIC8vIFhYWCBDT01QQVQgV0lUSCAwLjYuNi4gaWdub3JlIHRoZSBvbGQgd2VsY29tZSBtZXNzYWdlIGZvciBiYWNrXG4gICAgICAvLyBjb21wYXQuICBSZW1vdmUgdGhpcyAnaWYnIG9uY2UgdGhlIHNlcnZlciBzdG9wcyBzZW5kaW5nIHdlbGNvbWVcbiAgICAgIC8vIG1lc3NhZ2VzIChzdHJlYW1fc2VydmVyLmpzKS5cbiAgICAgIGlmICghKG1zZyAmJiBtc2cuc2VydmVyX2lkKSlcbiAgICAgICAgTWV0ZW9yLl9kZWJ1ZygnZGlzY2FyZGluZyBpbnZhbGlkIGxpdmVkYXRhIG1lc3NhZ2UnLCBtc2cpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChtc2cubXNnID09PSAnY29ubmVjdGVkJykge1xuICAgICAgdGhpcy5fdmVyc2lvbiA9IHRoaXMuX3ZlcnNpb25TdWdnZXN0aW9uO1xuICAgICAgdGhpcy5fbGl2ZWRhdGFfY29ubmVjdGVkKG1zZyk7XG4gICAgICB0aGlzLm9wdGlvbnMub25Db25uZWN0ZWQoKTtcbiAgICB9IGVsc2UgaWYgKG1zZy5tc2cgPT09ICdmYWlsZWQnKSB7XG4gICAgICBpZiAodGhpcy5fc3VwcG9ydGVkRERQVmVyc2lvbnMuaW5kZXhPZihtc2cudmVyc2lvbikgPj0gMCkge1xuICAgICAgICB0aGlzLl92ZXJzaW9uU3VnZ2VzdGlvbiA9IG1zZy52ZXJzaW9uO1xuICAgICAgICB0aGlzLl9zdHJlYW0ucmVjb25uZWN0KHsgX2ZvcmNlOiB0cnVlIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGRlc2NyaXB0aW9uID1cbiAgICAgICAgICAnRERQIHZlcnNpb24gbmVnb3RpYXRpb24gZmFpbGVkOyBzZXJ2ZXIgcmVxdWVzdGVkIHZlcnNpb24gJyArXG4gICAgICAgICAgbXNnLnZlcnNpb247XG4gICAgICAgIHRoaXMuX3N0cmVhbS5kaXNjb25uZWN0KHsgX3Blcm1hbmVudDogdHJ1ZSwgX2Vycm9yOiBkZXNjcmlwdGlvbiB9KTtcbiAgICAgICAgdGhpcy5vcHRpb25zLm9uRERQVmVyc2lvbk5lZ290aWF0aW9uRmFpbHVyZShkZXNjcmlwdGlvbik7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChtc2cubXNnID09PSAncGluZycgJiYgdGhpcy5vcHRpb25zLnJlc3BvbmRUb1BpbmdzKSB7XG4gICAgICB0aGlzLl9zZW5kKHsgbXNnOiAncG9uZycsIGlkOiBtc2cuaWQgfSk7XG4gICAgfSBlbHNlIGlmIChtc2cubXNnID09PSAncG9uZycpIHtcbiAgICAgIC8vIG5vb3AsIGFzIHdlIGFzc3VtZSBldmVyeXRoaW5nJ3MgYSBwb25nXG4gICAgfSBlbHNlIGlmIChcbiAgICAgIFsnYWRkZWQnLCAnY2hhbmdlZCcsICdyZW1vdmVkJywgJ3JlYWR5JywgJ3VwZGF0ZWQnXS5pbmNsdWRlcyhtc2cubXNnKVxuICAgICkge1xuICAgICAgdGhpcy5fbGl2ZWRhdGFfZGF0YShtc2cpO1xuICAgIH0gZWxzZSBpZiAobXNnLm1zZyA9PT0gJ25vc3ViJykge1xuICAgICAgdGhpcy5fbGl2ZWRhdGFfbm9zdWIobXNnKTtcbiAgICB9IGVsc2UgaWYgKG1zZy5tc2cgPT09ICdyZXN1bHQnKSB7XG4gICAgICB0aGlzLl9saXZlZGF0YV9yZXN1bHQobXNnKTtcbiAgICB9IGVsc2UgaWYgKG1zZy5tc2cgPT09ICdlcnJvcicpIHtcbiAgICAgIHRoaXMuX2xpdmVkYXRhX2Vycm9yKG1zZyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIE1ldGVvci5fZGVidWcoJ2Rpc2NhcmRpbmcgdW5rbm93biBsaXZlZGF0YSBtZXNzYWdlIHR5cGUnLCBtc2cpO1xuICAgIH1cbiAgfVxuXG4gIG9uUmVzZXQoKSB7XG4gICAgLy8gU2VuZCBhIGNvbm5lY3QgbWVzc2FnZSBhdCB0aGUgYmVnaW5uaW5nIG9mIHRoZSBzdHJlYW0uXG4gICAgLy8gTk9URTogcmVzZXQgaXMgY2FsbGVkIGV2ZW4gb24gdGhlIGZpcnN0IGNvbm5lY3Rpb24sIHNvIHRoaXMgaXNcbiAgICAvLyB0aGUgb25seSBwbGFjZSB3ZSBzZW5kIHRoaXMgbWVzc2FnZS5cbiAgICB2YXIgbXNnID0geyBtc2c6ICdjb25uZWN0JyB9O1xuICAgIGlmICh0aGlzLl9sYXN0U2Vzc2lvbklkKSBtc2cuc2Vzc2lvbiA9IHRoaXMuX2xhc3RTZXNzaW9uSWQ7XG4gICAgbXNnLnZlcnNpb24gPSB0aGlzLl92ZXJzaW9uU3VnZ2VzdGlvbiB8fCB0aGlzLl9zdXBwb3J0ZWRERFBWZXJzaW9uc1swXTtcbiAgICB0aGlzLl92ZXJzaW9uU3VnZ2VzdGlvbiA9IG1zZy52ZXJzaW9uO1xuICAgIG1zZy5zdXBwb3J0ID0gdGhpcy5fc3VwcG9ydGVkRERQVmVyc2lvbnM7XG4gICAgdGhpcy5fc2VuZChtc2cpO1xuXG4gICAgLy8gTWFyayBub24tcmV0cnkgY2FsbHMgYXMgZmFpbGVkLiBUaGlzIGhhcyB0byBiZSBkb25lIGVhcmx5IGFzIGdldHRpbmcgdGhlc2UgbWV0aG9kcyBvdXQgb2YgdGhlXG4gICAgLy8gY3VycmVudCBibG9jayBpcyBwcmV0dHkgaW1wb3J0YW50IHRvIG1ha2luZyBzdXJlIHRoYXQgcXVpZXNjZW5jZSBpcyBwcm9wZXJseSBjYWxjdWxhdGVkLCBhc1xuICAgIC8vIHdlbGwgYXMgcG9zc2libHkgbW92aW5nIG9uIHRvIGFub3RoZXIgdXNlZnVsIGJsb2NrLlxuXG4gICAgLy8gT25seSBib3RoZXIgdGVzdGluZyBpZiB0aGVyZSBpcyBhbiBvdXRzdGFuZGluZ01ldGhvZEJsb2NrICh0aGVyZSBtaWdodCBub3QgYmUsIGVzcGVjaWFsbHkgaWZcbiAgICAvLyB3ZSBhcmUgY29ubmVjdGluZyBmb3IgdGhlIGZpcnN0IHRpbWUuXG4gICAgaWYgKHRoaXMuX291dHN0YW5kaW5nTWV0aG9kQmxvY2tzLmxlbmd0aCA+IDApIHtcbiAgICAgIC8vIElmIHRoZXJlIGlzIGFuIG91dHN0YW5kaW5nIG1ldGhvZCBibG9jaywgd2Ugb25seSBjYXJlIGFib3V0IHRoZSBmaXJzdCBvbmUgYXMgdGhhdCBpcyB0aGVcbiAgICAgIC8vIG9uZSB0aGF0IGNvdWxkIGhhdmUgYWxyZWFkeSBzZW50IG1lc3NhZ2VzIHdpdGggbm8gcmVzcG9uc2UsIHRoYXQgYXJlIG5vdCBhbGxvd2VkIHRvIHJldHJ5LlxuICAgICAgY29uc3QgY3VycmVudE1ldGhvZEJsb2NrID0gdGhpcy5fb3V0c3RhbmRpbmdNZXRob2RCbG9ja3NbMF0ubWV0aG9kcztcbiAgICAgIHRoaXMuX291dHN0YW5kaW5nTWV0aG9kQmxvY2tzWzBdLm1ldGhvZHMgPSBjdXJyZW50TWV0aG9kQmxvY2suZmlsdGVyKFxuICAgICAgICBtZXRob2RJbnZva2VyID0+IHtcbiAgICAgICAgICAvLyBNZXRob2RzIHdpdGggJ25vUmV0cnknIG9wdGlvbiBzZXQgYXJlIG5vdCBhbGxvd2VkIHRvIHJlLXNlbmQgYWZ0ZXJcbiAgICAgICAgICAvLyByZWNvdmVyaW5nIGRyb3BwZWQgY29ubmVjdGlvbi5cbiAgICAgICAgICBpZiAobWV0aG9kSW52b2tlci5zZW50TWVzc2FnZSAmJiBtZXRob2RJbnZva2VyLm5vUmV0cnkpIHtcbiAgICAgICAgICAgIC8vIE1ha2Ugc3VyZSB0aGF0IHRoZSBtZXRob2QgaXMgdG9sZCB0aGF0IGl0IGZhaWxlZC5cbiAgICAgICAgICAgIG1ldGhvZEludm9rZXIucmVjZWl2ZVJlc3VsdChcbiAgICAgICAgICAgICAgbmV3IE1ldGVvci5FcnJvcihcbiAgICAgICAgICAgICAgICAnaW52b2NhdGlvbi1mYWlsZWQnLFxuICAgICAgICAgICAgICAgICdNZXRob2QgaW52b2NhdGlvbiBtaWdodCBoYXZlIGZhaWxlZCBkdWUgdG8gZHJvcHBlZCBjb25uZWN0aW9uLiAnICtcbiAgICAgICAgICAgICAgICAgICdGYWlsaW5nIGJlY2F1c2UgYG5vUmV0cnlgIG9wdGlvbiB3YXMgcGFzc2VkIHRvIE1ldGVvci5hcHBseS4nXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gT25seSBrZWVwIGEgbWV0aG9kIGlmIGl0IHdhc24ndCBzZW50IG9yIGl0J3MgYWxsb3dlZCB0byByZXRyeS5cbiAgICAgICAgICAvLyBUaGlzIG1heSBsZWF2ZSB0aGUgYmxvY2sgZW1wdHksIGJ1dCB3ZSBkb24ndCBtb3ZlIG9uIHRvIHRoZSBuZXh0XG4gICAgICAgICAgLy8gYmxvY2sgdW50aWwgdGhlIGNhbGxiYWNrIGhhcyBiZWVuIGRlbGl2ZXJlZCwgaW4gX291dHN0YW5kaW5nTWV0aG9kRmluaXNoZWQuXG4gICAgICAgICAgcmV0dXJuICEobWV0aG9kSW52b2tlci5zZW50TWVzc2FnZSAmJiBtZXRob2RJbnZva2VyLm5vUmV0cnkpO1xuICAgICAgICB9XG4gICAgICApO1xuICAgIH1cblxuICAgIC8vIE5vdywgdG8gbWluaW1pemUgc2V0dXAgbGF0ZW5jeSwgZ28gYWhlYWQgYW5kIGJsYXN0IG91dCBhbGwgb2ZcbiAgICAvLyBvdXIgcGVuZGluZyBtZXRob2RzIGFuZHMgc3Vic2NyaXB0aW9ucyBiZWZvcmUgd2UndmUgZXZlbiB0YWtlblxuICAgIC8vIHRoZSBuZWNlc3NhcnkgUlRUIHRvIGtub3cgaWYgd2Ugc3VjY2Vzc2Z1bGx5IHJlY29ubmVjdGVkLiAoMSlcbiAgICAvLyBUaGV5J3JlIHN1cHBvc2VkIHRvIGJlIGlkZW1wb3RlbnQsIGFuZCB3aGVyZSB0aGV5IGFyZSBub3QsXG4gICAgLy8gdGhleSBjYW4gYmxvY2sgcmV0cnkgaW4gYXBwbHk7ICgyKSBldmVuIGlmIHdlIGRpZCByZWNvbm5lY3QsXG4gICAgLy8gd2UncmUgbm90IHN1cmUgd2hhdCBtZXNzYWdlcyBtaWdodCBoYXZlIGdvdHRlbiBsb3N0XG4gICAgLy8gKGluIGVpdGhlciBkaXJlY3Rpb24pIHNpbmNlIHdlIHdlcmUgZGlzY29ubmVjdGVkIChUQ1AgYmVpbmdcbiAgICAvLyBzbG9wcHkgYWJvdXQgdGhhdC4pXG5cbiAgICAvLyBJZiB0aGUgY3VycmVudCBibG9jayBvZiBtZXRob2RzIGFsbCBnb3QgdGhlaXIgcmVzdWx0cyAoYnV0IGRpZG4ndCBhbGwgZ2V0XG4gICAgLy8gdGhlaXIgZGF0YSB2aXNpYmxlKSwgZGlzY2FyZCB0aGUgZW1wdHkgYmxvY2sgbm93LlxuICAgIGlmIChcbiAgICAgIHRoaXMuX291dHN0YW5kaW5nTWV0aG9kQmxvY2tzLmxlbmd0aCA+IDAgJiZcbiAgICAgIHRoaXMuX291dHN0YW5kaW5nTWV0aG9kQmxvY2tzWzBdLm1ldGhvZHMubGVuZ3RoID09PSAwXG4gICAgKSB7XG4gICAgICB0aGlzLl9vdXRzdGFuZGluZ01ldGhvZEJsb2Nrcy5zaGlmdCgpO1xuICAgIH1cblxuICAgIC8vIE1hcmsgYWxsIG1lc3NhZ2VzIGFzIHVuc2VudCwgdGhleSBoYXZlIG5vdCB5ZXQgYmVlbiBzZW50IG9uIHRoaXNcbiAgICAvLyBjb25uZWN0aW9uLlxuICAgIGtleXModGhpcy5fbWV0aG9kSW52b2tlcnMpLmZvckVhY2goaWQgPT4ge1xuICAgICAgdGhpcy5fbWV0aG9kSW52b2tlcnNbaWRdLnNlbnRNZXNzYWdlID0gZmFsc2U7XG4gICAgfSk7XG5cbiAgICAvLyBJZiBhbiBgb25SZWNvbm5lY3RgIGhhbmRsZXIgaXMgc2V0LCBjYWxsIGl0IGZpcnN0LiBHbyB0aHJvdWdoXG4gICAgLy8gc29tZSBob29wcyB0byBlbnN1cmUgdGhhdCBtZXRob2RzIHRoYXQgYXJlIGNhbGxlZCBmcm9tIHdpdGhpblxuICAgIC8vIGBvblJlY29ubmVjdGAgZ2V0IGV4ZWN1dGVkIF9iZWZvcmVfIG9uZXMgdGhhdCB3ZXJlIG9yaWdpbmFsbHlcbiAgICAvLyBvdXRzdGFuZGluZyAoc2luY2UgYG9uUmVjb25uZWN0YCBpcyB1c2VkIHRvIHJlLWVzdGFibGlzaCBhdXRoXG4gICAgLy8gY2VydGlmaWNhdGVzKVxuICAgIHRoaXMuX2NhbGxPblJlY29ubmVjdEFuZFNlbmRBcHByb3ByaWF0ZU91dHN0YW5kaW5nTWV0aG9kcygpO1xuXG4gICAgLy8gYWRkIG5ldyBzdWJzY3JpcHRpb25zIGF0IHRoZSBlbmQuIHRoaXMgd2F5IHRoZXkgdGFrZSBlZmZlY3QgYWZ0ZXJcbiAgICAvLyB0aGUgaGFuZGxlcnMgYW5kIHdlIGRvbid0IHNlZSBmbGlja2VyLlxuICAgIGtleXModGhpcy5fc3Vic2NyaXB0aW9ucykuZm9yRWFjaChpZCA9PiB7XG4gICAgICBjb25zdCBzdWIgPSB0aGlzLl9zdWJzY3JpcHRpb25zW2lkXTtcbiAgICAgIHRoaXMuX3NlbmQoe1xuICAgICAgICBtc2c6ICdzdWInLFxuICAgICAgICBpZDogaWQsXG4gICAgICAgIG5hbWU6IHN1Yi5uYW1lLFxuICAgICAgICBwYXJhbXM6IHN1Yi5wYXJhbXNcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG59XG4iLCJpbXBvcnQgeyBERFBDb21tb24gfSBmcm9tICdtZXRlb3IvZGRwLWNvbW1vbic7XG5pbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7IGtleXMgfSBmcm9tIFwibWV0ZW9yL2RkcC1jb21tb24vdXRpbHMuanNcIjtcblxuaW1wb3J0IHsgQ29ubmVjdGlvbiB9IGZyb20gJy4vbGl2ZWRhdGFfY29ubmVjdGlvbi5qcyc7XG5cbi8vIFRoaXMgYXJyYXkgYWxsb3dzIHRoZSBgX2FsbFN1YnNjcmlwdGlvbnNSZWFkeWAgbWV0aG9kIGJlbG93LCB3aGljaFxuLy8gaXMgdXNlZCBieSB0aGUgYHNwaWRlcmFibGVgIHBhY2thZ2UsIHRvIGtlZXAgdHJhY2sgb2Ygd2hldGhlciBhbGxcbi8vIGRhdGEgaXMgcmVhZHkuXG5jb25zdCBhbGxDb25uZWN0aW9ucyA9IFtdO1xuXG4vKipcbiAqIEBuYW1lc3BhY2UgRERQXG4gKiBAc3VtbWFyeSBOYW1lc3BhY2UgZm9yIEREUC1yZWxhdGVkIG1ldGhvZHMvY2xhc3Nlcy5cbiAqL1xuZXhwb3J0IGNvbnN0IEREUCA9IHt9O1xuXG4vLyBUaGlzIGlzIHByaXZhdGUgYnV0IGl0J3MgdXNlZCBpbiBhIGZldyBwbGFjZXMuIGFjY291bnRzLWJhc2UgdXNlc1xuLy8gaXQgdG8gZ2V0IHRoZSBjdXJyZW50IHVzZXIuIE1ldGVvci5zZXRUaW1lb3V0IGFuZCBmcmllbmRzIGNsZWFyXG4vLyBpdC4gV2UgY2FuIHByb2JhYmx5IGZpbmQgYSBiZXR0ZXIgd2F5IHRvIGZhY3RvciB0aGlzLlxuRERQLl9DdXJyZW50TWV0aG9kSW52b2NhdGlvbiA9IG5ldyBNZXRlb3IuRW52aXJvbm1lbnRWYXJpYWJsZSgpO1xuRERQLl9DdXJyZW50UHVibGljYXRpb25JbnZvY2F0aW9uID0gbmV3IE1ldGVvci5FbnZpcm9ubWVudFZhcmlhYmxlKCk7XG5cbi8vIFhYWDogS2VlcCBERFAuX0N1cnJlbnRJbnZvY2F0aW9uIGZvciBiYWNrd2FyZHMtY29tcGF0aWJpbGl0eS5cbkREUC5fQ3VycmVudEludm9jYXRpb24gPSBERFAuX0N1cnJlbnRNZXRob2RJbnZvY2F0aW9uO1xuXG4vLyBUaGlzIGlzIHBhc3NlZCBpbnRvIGEgd2VpcmQgYG1ha2VFcnJvclR5cGVgIGZ1bmN0aW9uIHRoYXQgZXhwZWN0cyBpdHMgdGhpbmdcbi8vIHRvIGJlIGEgY29uc3RydWN0b3JcbmZ1bmN0aW9uIGNvbm5lY3Rpb25FcnJvckNvbnN0cnVjdG9yKG1lc3NhZ2UpIHtcbiAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbn1cblxuRERQLkNvbm5lY3Rpb25FcnJvciA9IE1ldGVvci5tYWtlRXJyb3JUeXBlKFxuICAnRERQLkNvbm5lY3Rpb25FcnJvcicsXG4gIGNvbm5lY3Rpb25FcnJvckNvbnN0cnVjdG9yXG4pO1xuXG5ERFAuRm9yY2VkUmVjb25uZWN0RXJyb3IgPSBNZXRlb3IubWFrZUVycm9yVHlwZShcbiAgJ0REUC5Gb3JjZWRSZWNvbm5lY3RFcnJvcicsXG4gICgpID0+IHt9XG4pO1xuXG4vLyBSZXR1cm5zIHRoZSBuYW1lZCBzZXF1ZW5jZSBvZiBwc2V1ZG8tcmFuZG9tIHZhbHVlcy5cbi8vIFRoZSBzY29wZSB3aWxsIGJlIEREUC5fQ3VycmVudE1ldGhvZEludm9jYXRpb24uZ2V0KCksIHNvIHRoZSBzdHJlYW0gd2lsbCBwcm9kdWNlXG4vLyBjb25zaXN0ZW50IHZhbHVlcyBmb3IgbWV0aG9kIGNhbGxzIG9uIHRoZSBjbGllbnQgYW5kIHNlcnZlci5cbkREUC5yYW5kb21TdHJlYW0gPSBuYW1lID0+IHtcbiAgdmFyIHNjb3BlID0gRERQLl9DdXJyZW50TWV0aG9kSW52b2NhdGlvbi5nZXQoKTtcbiAgcmV0dXJuIEREUENvbW1vbi5SYW5kb21TdHJlYW0uZ2V0KHNjb3BlLCBuYW1lKTtcbn07XG5cbi8vIEBwYXJhbSB1cmwge1N0cmluZ30gVVJMIHRvIE1ldGVvciBhcHAsXG4vLyAgICAgZS5nLjpcbi8vICAgICBcInN1YmRvbWFpbi5tZXRlb3IuY29tXCIsXG4vLyAgICAgXCJodHRwOi8vc3ViZG9tYWluLm1ldGVvci5jb21cIixcbi8vICAgICBcIi9cIixcbi8vICAgICBcImRkcCtzb2NranM6Ly9kZHAtLSoqKiotZm9vLm1ldGVvci5jb20vc29ja2pzXCJcblxuLyoqXG4gKiBAc3VtbWFyeSBDb25uZWN0IHRvIHRoZSBzZXJ2ZXIgb2YgYSBkaWZmZXJlbnQgTWV0ZW9yIGFwcGxpY2F0aW9uIHRvIHN1YnNjcmliZSB0byBpdHMgZG9jdW1lbnQgc2V0cyBhbmQgaW52b2tlIGl0cyByZW1vdGUgbWV0aG9kcy5cbiAqIEBsb2N1cyBBbnl3aGVyZVxuICogQHBhcmFtIHtTdHJpbmd9IHVybCBUaGUgVVJMIG9mIGFub3RoZXIgTWV0ZW9yIGFwcGxpY2F0aW9uLlxuICovXG5ERFAuY29ubmVjdCA9ICh1cmwsIG9wdGlvbnMpID0+IHtcbiAgdmFyIHJldCA9IG5ldyBDb25uZWN0aW9uKHVybCwgb3B0aW9ucyk7XG4gIGFsbENvbm5lY3Rpb25zLnB1c2gocmV0KTsgLy8gaGFjay4gc2VlIGJlbG93LlxuICByZXR1cm4gcmV0O1xufTtcblxuRERQLl9yZWNvbm5lY3RIb29rID0gbmV3IEhvb2soeyBiaW5kRW52aXJvbm1lbnQ6IGZhbHNlIH0pO1xuXG4vKipcbiAqIEBzdW1tYXJ5IFJlZ2lzdGVyIGEgZnVuY3Rpb24gdG8gY2FsbCBhcyB0aGUgZmlyc3Qgc3RlcCBvZlxuICogcmVjb25uZWN0aW5nLiBUaGlzIGZ1bmN0aW9uIGNhbiBjYWxsIG1ldGhvZHMgd2hpY2ggd2lsbCBiZSBleGVjdXRlZCBiZWZvcmVcbiAqIGFueSBvdGhlciBvdXRzdGFuZGluZyBtZXRob2RzLiBGb3IgZXhhbXBsZSwgdGhpcyBjYW4gYmUgdXNlZCB0byByZS1lc3RhYmxpc2hcbiAqIHRoZSBhcHByb3ByaWF0ZSBhdXRoZW50aWNhdGlvbiBjb250ZXh0IG9uIHRoZSBjb25uZWN0aW9uLlxuICogQGxvY3VzIEFueXdoZXJlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBUaGUgZnVuY3Rpb24gdG8gY2FsbC4gSXQgd2lsbCBiZSBjYWxsZWQgd2l0aCBhXG4gKiBzaW5nbGUgYXJndW1lbnQsIHRoZSBbY29ubmVjdGlvbiBvYmplY3RdKCNkZHBfY29ubmVjdCkgdGhhdCBpcyByZWNvbm5lY3RpbmcuXG4gKi9cbkREUC5vblJlY29ubmVjdCA9IGNhbGxiYWNrID0+IHtcbiAgcmV0dXJuIEREUC5fcmVjb25uZWN0SG9vay5yZWdpc3RlcihjYWxsYmFjayk7XG59O1xuXG4vLyBIYWNrIGZvciBgc3BpZGVyYWJsZWAgcGFja2FnZTogYSB3YXkgdG8gc2VlIGlmIHRoZSBwYWdlIGlzIGRvbmVcbi8vIGxvYWRpbmcgYWxsIHRoZSBkYXRhIGl0IG5lZWRzLlxuLy9cbkREUC5fYWxsU3Vic2NyaXB0aW9uc1JlYWR5ID0gKCkgPT4ge1xuICByZXR1cm4gYWxsQ29ubmVjdGlvbnMuZXZlcnkoY29ubiA9PiB7XG4gICAgcmV0dXJuIGtleXMoY29ubi5fc3Vic2NyaXB0aW9ucykuZXZlcnkoaWQgPT4ge1xuICAgICAgcmV0dXJuIGNvbm4uX3N1YnNjcmlwdGlvbnNbaWRdLnJlYWR5O1xuICAgIH0pO1xuICB9KTtcbn07XG4iXX0=
