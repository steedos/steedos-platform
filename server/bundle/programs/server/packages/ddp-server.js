(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var check = Package.check.check;
var Match = Package.check.Match;
var Random = Package.random.Random;
var EJSON = Package.ejson.EJSON;
var _ = Package.underscore._;
var Retry = Package.retry.Retry;
var MongoID = Package['mongo-id'].MongoID;
var DiffSequence = Package['diff-sequence'].DiffSequence;
var ECMAScript = Package.ecmascript.ECMAScript;
var DDPCommon = Package['ddp-common'].DDPCommon;
var DDP = Package['ddp-client'].DDP;
var WebApp = Package.webapp.WebApp;
var WebAppInternals = Package.webapp.WebAppInternals;
var main = Package.webapp.main;
var RoutePolicy = Package.routepolicy.RoutePolicy;
var Hook = Package['callback-hook'].Hook;
var meteorInstall = Package.modules.meteorInstall;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var StreamServer, DDPServer, Server;

var require = meteorInstall({"node_modules":{"meteor":{"ddp-server":{"stream_server.js":function module(require){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/ddp-server/stream_server.js                                                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var url = Npm.require('url'); // By default, we use the permessage-deflate extension with default
// configuration. If $SERVER_WEBSOCKET_COMPRESSION is set, then it must be valid
// JSON. If it represents a falsey value, then we do not use permessage-deflate
// at all; otherwise, the JSON value is used as an argument to deflate's
// configure method; see
// https://github.com/faye/permessage-deflate-node/blob/master/README.md
//
// (We do this in an _.once instead of at startup, because we don't want to
// crash the tool during isopacket load if your JSON doesn't parse. This is only
// a problem because the tool has to load the DDP server code just in order to
// be a DDP client; see https://github.com/meteor/meteor/issues/3452 .)


var websocketExtensions = _.once(function () {
  var extensions = [];
  var websocketCompressionConfig = process.env.SERVER_WEBSOCKET_COMPRESSION ? JSON.parse(process.env.SERVER_WEBSOCKET_COMPRESSION) : {};

  if (websocketCompressionConfig) {
    extensions.push(Npm.require('permessage-deflate').configure(websocketCompressionConfig));
  }

  return extensions;
});

var pathPrefix = __meteor_runtime_config__.ROOT_URL_PATH_PREFIX || "";

StreamServer = function () {
  var self = this;
  self.registration_callbacks = [];
  self.open_sockets = []; // Because we are installing directly onto WebApp.httpServer instead of using
  // WebApp.app, we have to process the path prefix ourselves.

  self.prefix = pathPrefix + '/sockjs';
  RoutePolicy.declare(self.prefix + '/', 'network'); // set up sockjs

  var sockjs = Npm.require('sockjs');

  var serverOptions = {
    prefix: self.prefix,
    log: function () {},
    // this is the default, but we code it explicitly because we depend
    // on it in stream_client:HEARTBEAT_TIMEOUT
    heartbeat_delay: 45000,
    // The default disconnect_delay is 5 seconds, but if the server ends up CPU
    // bound for that much time, SockJS might not notice that the user has
    // reconnected because the timer (of disconnect_delay ms) can fire before
    // SockJS processes the new connection. Eventually we'll fix this by not
    // combining CPU-heavy processing with SockJS termination (eg a proxy which
    // converts to Unix sockets) but for now, raise the delay.
    disconnect_delay: 60 * 1000,
    // Allow disabling of CORS requests to address
    // https://github.com/meteor/meteor/issues/8317.
    disable_cors: !!process.env.DISABLE_SOCKJS_CORS,
    // Set the USE_JSESSIONID environment variable to enable setting the
    // JSESSIONID cookie. This is useful for setting up proxies with
    // session affinity.
    jsessionid: !!process.env.USE_JSESSIONID
  }; // If you know your server environment (eg, proxies) will prevent websockets
  // from ever working, set $DISABLE_WEBSOCKETS and SockJS clients (ie,
  // browsers) will not waste time attempting to use them.
  // (Your server will still have a /websocket endpoint.)

  if (process.env.DISABLE_WEBSOCKETS) {
    serverOptions.websocket = false;
  } else {
    serverOptions.faye_server_options = {
      extensions: websocketExtensions()
    };
  }

  self.server = sockjs.createServer(serverOptions); // Install the sockjs handlers, but we want to keep around our own particular
  // request handler that adjusts idle timeouts while we have an outstanding
  // request.  This compensates for the fact that sockjs removes all listeners
  // for "request" to add its own.

  WebApp.httpServer.removeListener('request', WebApp._timeoutAdjustmentRequestCallback);
  self.server.installHandlers(WebApp.httpServer);
  WebApp.httpServer.addListener('request', WebApp._timeoutAdjustmentRequestCallback); // Support the /websocket endpoint

  self._redirectWebsocketEndpoint();

  self.server.on('connection', function (socket) {
    // We want to make sure that if a client connects to us and does the initial
    // Websocket handshake but never gets to the DDP handshake, that we
    // eventually kill the socket.  Once the DDP handshake happens, DDP
    // heartbeating will work. And before the Websocket handshake, the timeouts
    // we set at the server level in webapp_server.js will work. But
    // faye-websocket calls setTimeout(0) on any socket it takes over, so there
    // is an "in between" state where this doesn't happen.  We work around this
    // by explicitly setting the socket timeout to a relatively large time here,
    // and setting it back to zero when we set up the heartbeat in
    // livedata_server.js.
    socket.setWebsocketTimeout = function (timeout) {
      if ((socket.protocol === 'websocket' || socket.protocol === 'websocket-raw') && socket._session.recv) {
        socket._session.recv.connection.setTimeout(timeout);
      }
    };

    socket.setWebsocketTimeout(45 * 1000);

    socket.send = function (data) {
      socket.write(data);
    };

    socket.on('close', function () {
      self.open_sockets = _.without(self.open_sockets, socket);
    });
    self.open_sockets.push(socket); // XXX COMPAT WITH 0.6.6. Send the old style welcome message, which
    // will force old clients to reload. Remove this once we're not
    // concerned about people upgrading from a pre-0.7.0 release. Also,
    // remove the clause in the client that ignores the welcome message
    // (livedata_connection.js)

    socket.send(JSON.stringify({
      server_id: "0"
    })); // call all our callbacks when we get a new socket. they will do the
    // work of setting up handlers and such for specific messages.

    _.each(self.registration_callbacks, function (callback) {
      callback(socket);
    });
  });
};

_.extend(StreamServer.prototype, {
  // call my callback when a new socket connects.
  // also call it for all current connections.
  register: function (callback) {
    var self = this;
    self.registration_callbacks.push(callback);

    _.each(self.all_sockets(), function (socket) {
      callback(socket);
    });
  },
  // get a list of all sockets
  all_sockets: function () {
    var self = this;
    return _.values(self.open_sockets);
  },
  // Redirect /websocket to /sockjs/websocket in order to not expose
  // sockjs to clients that want to use raw websockets
  _redirectWebsocketEndpoint: function () {
    var self = this; // Unfortunately we can't use a connect middleware here since
    // sockjs installs itself prior to all existing listeners
    // (meaning prior to any connect middlewares) so we need to take
    // an approach similar to overshadowListeners in
    // https://github.com/sockjs/sockjs-node/blob/cf820c55af6a9953e16558555a31decea554f70e/src/utils.coffee

    _.each(['request', 'upgrade'], function (event) {
      var httpServer = WebApp.httpServer;
      var oldHttpServerListeners = httpServer.listeners(event).slice(0);
      httpServer.removeAllListeners(event); // request and upgrade have different arguments passed but
      // we only care about the first one which is always request

      var newListener = function (request
      /*, moreArguments */
      ) {
        // Store arguments for use within the closure below
        var args = arguments; // Rewrite /websocket and /websocket/ urls to /sockjs/websocket while
        // preserving query string.

        var parsedUrl = url.parse(request.url);

        if (parsedUrl.pathname === pathPrefix + '/websocket' || parsedUrl.pathname === pathPrefix + '/websocket/') {
          parsedUrl.pathname = self.prefix + '/websocket';
          request.url = url.format(parsedUrl);
        }

        _.each(oldHttpServerListeners, function (oldListener) {
          oldListener.apply(httpServer, args);
        });
      };

      httpServer.addListener(event, newListener);
    });
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"livedata_server.js":function module(require){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/ddp-server/livedata_server.js                                                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
DDPServer = {};

var Fiber = Npm.require('fibers'); // This file contains classes:
// * Session - The server's connection to a single DDP client
// * Subscription - A single subscription for a single client
// * Server - An entire server that may talk to > 1 client. A DDP endpoint.
//
// Session and Subscription are file scope. For now, until we freeze
// the interface, Server is package scope (in the future it should be
// exported.)
// Represents a single document in a SessionCollectionView


var SessionDocumentView = function () {
  var self = this;
  self.existsIn = new Set(); // set of subscriptionHandle

  self.dataByKey = new Map(); // key-> [ {subscriptionHandle, value} by precedence]
};

DDPServer._SessionDocumentView = SessionDocumentView;

_.extend(SessionDocumentView.prototype, {
  getFields: function () {
    var self = this;
    var ret = {};
    self.dataByKey.forEach(function (precedenceList, key) {
      ret[key] = precedenceList[0].value;
    });
    return ret;
  },
  clearField: function (subscriptionHandle, key, changeCollector) {
    var self = this; // Publish API ignores _id if present in fields

    if (key === "_id") return;
    var precedenceList = self.dataByKey.get(key); // It's okay to clear fields that didn't exist. No need to throw
    // an error.

    if (!precedenceList) return;
    var removedValue = undefined;

    for (var i = 0; i < precedenceList.length; i++) {
      var precedence = precedenceList[i];

      if (precedence.subscriptionHandle === subscriptionHandle) {
        // The view's value can only change if this subscription is the one that
        // used to have precedence.
        if (i === 0) removedValue = precedence.value;
        precedenceList.splice(i, 1);
        break;
      }
    }

    if (precedenceList.length === 0) {
      self.dataByKey.delete(key);
      changeCollector[key] = undefined;
    } else if (removedValue !== undefined && !EJSON.equals(removedValue, precedenceList[0].value)) {
      changeCollector[key] = precedenceList[0].value;
    }
  },
  changeField: function (subscriptionHandle, key, value, changeCollector, isAdd) {
    var self = this; // Publish API ignores _id if present in fields

    if (key === "_id") return; // Don't share state with the data passed in by the user.

    value = EJSON.clone(value);

    if (!self.dataByKey.has(key)) {
      self.dataByKey.set(key, [{
        subscriptionHandle: subscriptionHandle,
        value: value
      }]);
      changeCollector[key] = value;
      return;
    }

    var precedenceList = self.dataByKey.get(key);
    var elt;

    if (!isAdd) {
      elt = precedenceList.find(function (precedence) {
        return precedence.subscriptionHandle === subscriptionHandle;
      });
    }

    if (elt) {
      if (elt === precedenceList[0] && !EJSON.equals(value, elt.value)) {
        // this subscription is changing the value of this field.
        changeCollector[key] = value;
      }

      elt.value = value;
    } else {
      // this subscription is newly caring about this field
      precedenceList.push({
        subscriptionHandle: subscriptionHandle,
        value: value
      });
    }
  }
});
/**
 * Represents a client's view of a single collection
 * @param {String} collectionName Name of the collection it represents
 * @param {Object.<String, Function>} sessionCallbacks The callbacks for added, changed, removed
 * @class SessionCollectionView
 */


var SessionCollectionView = function (collectionName, sessionCallbacks) {
  var self = this;
  self.collectionName = collectionName;
  self.documents = new Map();
  self.callbacks = sessionCallbacks;
};

DDPServer._SessionCollectionView = SessionCollectionView;

_.extend(SessionCollectionView.prototype, {
  isEmpty: function () {
    var self = this;
    return self.documents.size === 0;
  },
  diff: function (previous) {
    var self = this;
    DiffSequence.diffMaps(previous.documents, self.documents, {
      both: _.bind(self.diffDocument, self),
      rightOnly: function (id, nowDV) {
        self.callbacks.added(self.collectionName, id, nowDV.getFields());
      },
      leftOnly: function (id, prevDV) {
        self.callbacks.removed(self.collectionName, id);
      }
    });
  },
  diffDocument: function (id, prevDV, nowDV) {
    var self = this;
    var fields = {};
    DiffSequence.diffObjects(prevDV.getFields(), nowDV.getFields(), {
      both: function (key, prev, now) {
        if (!EJSON.equals(prev, now)) fields[key] = now;
      },
      rightOnly: function (key, now) {
        fields[key] = now;
      },
      leftOnly: function (key, prev) {
        fields[key] = undefined;
      }
    });
    self.callbacks.changed(self.collectionName, id, fields);
  },
  added: function (subscriptionHandle, id, fields) {
    var self = this;
    var docView = self.documents.get(id);
    var added = false;

    if (!docView) {
      added = true;
      docView = new SessionDocumentView();
      self.documents.set(id, docView);
    }

    docView.existsIn.add(subscriptionHandle);
    var changeCollector = {};

    _.each(fields, function (value, key) {
      docView.changeField(subscriptionHandle, key, value, changeCollector, true);
    });

    if (added) self.callbacks.added(self.collectionName, id, changeCollector);else self.callbacks.changed(self.collectionName, id, changeCollector);
  },
  changed: function (subscriptionHandle, id, changed) {
    var self = this;
    var changedResult = {};
    var docView = self.documents.get(id);
    if (!docView) throw new Error("Could not find element with id " + id + " to change");

    _.each(changed, function (value, key) {
      if (value === undefined) docView.clearField(subscriptionHandle, key, changedResult);else docView.changeField(subscriptionHandle, key, value, changedResult);
    });

    self.callbacks.changed(self.collectionName, id, changedResult);
  },
  removed: function (subscriptionHandle, id) {
    var self = this;
    var docView = self.documents.get(id);

    if (!docView) {
      var err = new Error("Removed nonexistent document " + id);
      throw err;
    }

    docView.existsIn.delete(subscriptionHandle);

    if (docView.existsIn.size === 0) {
      // it is gone from everyone
      self.callbacks.removed(self.collectionName, id);
      self.documents.delete(id);
    } else {
      var changed = {}; // remove this subscription from every precedence list
      // and record the changes

      docView.dataByKey.forEach(function (precedenceList, key) {
        docView.clearField(subscriptionHandle, key, changed);
      });
      self.callbacks.changed(self.collectionName, id, changed);
    }
  }
});
/******************************************************************************/

/* Session                                                                    */

/******************************************************************************/


var Session = function (server, version, socket, options) {
  var self = this;
  self.id = Random.id();
  self.server = server;
  self.version = version;
  self.initialized = false;
  self.socket = socket; // set to null when the session is destroyed. multiple places below
  // use this to determine if the session is alive or not.

  self.inQueue = new Meteor._DoubleEndedQueue();
  self.blocked = false;
  self.workerRunning = false; // Sub objects for active subscriptions

  self._namedSubs = new Map();
  self._universalSubs = [];
  self.userId = null;
  self.collectionViews = new Map(); // Set this to false to not send messages when collectionViews are
  // modified. This is done when rerunning subs in _setUserId and those messages
  // are calculated via a diff instead.

  self._isSending = true; // If this is true, don't start a newly-created universal publisher on this
  // session. The session will take care of starting it when appropriate.

  self._dontStartNewUniversalSubs = false; // when we are rerunning subscriptions, any ready messages
  // we want to buffer up for when we are done rerunning subscriptions

  self._pendingReady = []; // List of callbacks to call when this connection is closed.

  self._closeCallbacks = []; // XXX HACK: If a sockjs connection, save off the URL. This is
  // temporary and will go away in the near future.

  self._socketUrl = socket.url; // Allow tests to disable responding to pings.

  self._respondToPings = options.respondToPings; // This object is the public interface to the session. In the public
  // API, it is called the `connection` object.  Internally we call it
  // a `connectionHandle` to avoid ambiguity.

  self.connectionHandle = {
    id: self.id,
    close: function () {
      self.close();
    },
    onClose: function (fn) {
      var cb = Meteor.bindEnvironment(fn, "connection onClose callback");

      if (self.inQueue) {
        self._closeCallbacks.push(cb);
      } else {
        // if we're already closed, call the callback.
        Meteor.defer(cb);
      }
    },
    clientAddress: self._clientAddress(),
    httpHeaders: self.socket.headers
  };
  self.send({
    msg: 'connected',
    session: self.id
  }); // On initial connect, spin up all the universal publishers.

  Fiber(function () {
    self.startUniversalSubs();
  }).run();

  if (version !== 'pre1' && options.heartbeatInterval !== 0) {
    // We no longer need the low level timeout because we have heartbeating.
    socket.setWebsocketTimeout(0);
    self.heartbeat = new DDPCommon.Heartbeat({
      heartbeatInterval: options.heartbeatInterval,
      heartbeatTimeout: options.heartbeatTimeout,
      onTimeout: function () {
        self.close();
      },
      sendPing: function () {
        self.send({
          msg: 'ping'
        });
      }
    });
    self.heartbeat.start();
  }

  Package['facts-base'] && Package['facts-base'].Facts.incrementServerFact("livedata", "sessions", 1);
};

_.extend(Session.prototype, {
  sendReady: function (subscriptionIds) {
    var self = this;
    if (self._isSending) self.send({
      msg: "ready",
      subs: subscriptionIds
    });else {
      _.each(subscriptionIds, function (subscriptionId) {
        self._pendingReady.push(subscriptionId);
      });
    }
  },
  sendAdded: function (collectionName, id, fields) {
    var self = this;
    if (self._isSending) self.send({
      msg: "added",
      collection: collectionName,
      id: id,
      fields: fields
    });
  },
  sendChanged: function (collectionName, id, fields) {
    var self = this;
    if (_.isEmpty(fields)) return;

    if (self._isSending) {
      self.send({
        msg: "changed",
        collection: collectionName,
        id: id,
        fields: fields
      });
    }
  },
  sendRemoved: function (collectionName, id) {
    var self = this;
    if (self._isSending) self.send({
      msg: "removed",
      collection: collectionName,
      id: id
    });
  },
  getSendCallbacks: function () {
    var self = this;
    return {
      added: _.bind(self.sendAdded, self),
      changed: _.bind(self.sendChanged, self),
      removed: _.bind(self.sendRemoved, self)
    };
  },
  getCollectionView: function (collectionName) {
    var self = this;
    var ret = self.collectionViews.get(collectionName);

    if (!ret) {
      ret = new SessionCollectionView(collectionName, self.getSendCallbacks());
      self.collectionViews.set(collectionName, ret);
    }

    return ret;
  },
  added: function (subscriptionHandle, collectionName, id, fields) {
    var self = this;
    var view = self.getCollectionView(collectionName);
    view.added(subscriptionHandle, id, fields);
  },
  removed: function (subscriptionHandle, collectionName, id) {
    var self = this;
    var view = self.getCollectionView(collectionName);
    view.removed(subscriptionHandle, id);

    if (view.isEmpty()) {
      self.collectionViews.delete(collectionName);
    }
  },
  changed: function (subscriptionHandle, collectionName, id, fields) {
    var self = this;
    var view = self.getCollectionView(collectionName);
    view.changed(subscriptionHandle, id, fields);
  },
  startUniversalSubs: function () {
    var self = this; // Make a shallow copy of the set of universal handlers and start them. If
    // additional universal publishers start while we're running them (due to
    // yielding), they will run separately as part of Server.publish.

    var handlers = _.clone(self.server.universal_publish_handlers);

    _.each(handlers, function (handler) {
      self._startSubscription(handler);
    });
  },
  // Destroy this session and unregister it at the server.
  close: function () {
    var self = this; // Destroy this session, even if it's not registered at the
    // server. Stop all processing and tear everything down. If a socket
    // was attached, close it.
    // Already destroyed.

    if (!self.inQueue) return; // Drop the merge box data immediately.

    self.inQueue = null;
    self.collectionViews = new Map();

    if (self.heartbeat) {
      self.heartbeat.stop();
      self.heartbeat = null;
    }

    if (self.socket) {
      self.socket.close();
      self.socket._meteorSession = null;
    }

    Package['facts-base'] && Package['facts-base'].Facts.incrementServerFact("livedata", "sessions", -1);
    Meteor.defer(function () {
      // stop callbacks can yield, so we defer this on close.
      // sub._isDeactivated() detects that we set inQueue to null and
      // treats it as semi-deactivated (it will ignore incoming callbacks, etc).
      self._deactivateAllSubscriptions(); // Defer calling the close callbacks, so that the caller closing
      // the session isn't waiting for all the callbacks to complete.


      _.each(self._closeCallbacks, function (callback) {
        callback();
      });
    }); // Unregister the session.

    self.server._removeSession(self);
  },
  // Send a message (doing nothing if no socket is connected right now.)
  // It should be a JSON object (it will be stringified.)
  send: function (msg) {
    var self = this;

    if (self.socket) {
      if (Meteor._printSentDDP) Meteor._debug("Sent DDP", DDPCommon.stringifyDDP(msg));
      self.socket.send(DDPCommon.stringifyDDP(msg));
    }
  },
  // Send a connection error.
  sendError: function (reason, offendingMessage) {
    var self = this;
    var msg = {
      msg: 'error',
      reason: reason
    };
    if (offendingMessage) msg.offendingMessage = offendingMessage;
    self.send(msg);
  },
  // Process 'msg' as an incoming message. (But as a guard against
  // race conditions during reconnection, ignore the message if
  // 'socket' is not the currently connected socket.)
  //
  // We run the messages from the client one at a time, in the order
  // given by the client. The message handler is passed an idempotent
  // function 'unblock' which it may call to allow other messages to
  // begin running in parallel in another fiber (for example, a method
  // that wants to yield.) Otherwise, it is automatically unblocked
  // when it returns.
  //
  // Actually, we don't have to 'totally order' the messages in this
  // way, but it's the easiest thing that's correct. (unsub needs to
  // be ordered against sub, methods need to be ordered against each
  // other.)
  processMessage: function (msg_in) {
    var self = this;
    if (!self.inQueue) // we have been destroyed.
      return; // Respond to ping and pong messages immediately without queuing.
    // If the negotiated DDP version is "pre1" which didn't support
    // pings, preserve the "pre1" behavior of responding with a "bad
    // request" for the unknown messages.
    //
    // Fibers are needed because heartbeat uses Meteor.setTimeout, which
    // needs a Fiber. We could actually use regular setTimeout and avoid
    // these new fibers, but it is easier to just make everything use
    // Meteor.setTimeout and not think too hard.
    //
    // Any message counts as receiving a pong, as it demonstrates that
    // the client is still alive.

    if (self.heartbeat) {
      Fiber(function () {
        self.heartbeat.messageReceived();
      }).run();
    }

    if (self.version !== 'pre1' && msg_in.msg === 'ping') {
      if (self._respondToPings) self.send({
        msg: "pong",
        id: msg_in.id
      });
      return;
    }

    if (self.version !== 'pre1' && msg_in.msg === 'pong') {
      // Since everything is a pong, nothing to do
      return;
    }

    self.inQueue.push(msg_in);
    if (self.workerRunning) return;
    self.workerRunning = true;

    var processNext = function () {
      var msg = self.inQueue && self.inQueue.shift();

      if (!msg) {
        self.workerRunning = false;
        return;
      }

      Fiber(function () {
        var blocked = true;

        var unblock = function () {
          if (!blocked) return; // idempotent

          blocked = false;
          processNext();
        };

        self.server.onMessageHook.each(function (callback) {
          callback(msg, self);
          return true;
        });
        if (_.has(self.protocol_handlers, msg.msg)) self.protocol_handlers[msg.msg].call(self, msg, unblock);else self.sendError('Bad request', msg);
        unblock(); // in case the handler didn't already do it
      }).run();
    };

    processNext();
  },
  protocol_handlers: {
    sub: function (msg) {
      var self = this; // reject malformed messages

      if (typeof msg.id !== "string" || typeof msg.name !== "string" || 'params' in msg && !(msg.params instanceof Array)) {
        self.sendError("Malformed subscription", msg);
        return;
      }

      if (!self.server.publish_handlers[msg.name]) {
        self.send({
          msg: 'nosub',
          id: msg.id,
          error: new Meteor.Error(404, "Subscription '".concat(msg.name, "' not found"))
        });
        return;
      }

      if (self._namedSubs.has(msg.id)) // subs are idempotent, or rather, they are ignored if a sub
        // with that id already exists. this is important during
        // reconnect.
        return; // XXX It'd be much better if we had generic hooks where any package can
      // hook into subscription handling, but in the mean while we special case
      // ddp-rate-limiter package. This is also done for weak requirements to
      // add the ddp-rate-limiter package in case we don't have Accounts. A
      // user trying to use the ddp-rate-limiter must explicitly require it.

      if (Package['ddp-rate-limiter']) {
        var DDPRateLimiter = Package['ddp-rate-limiter'].DDPRateLimiter;
        var rateLimiterInput = {
          userId: self.userId,
          clientAddress: self.connectionHandle.clientAddress,
          type: "subscription",
          name: msg.name,
          connectionId: self.id
        };

        DDPRateLimiter._increment(rateLimiterInput);

        var rateLimitResult = DDPRateLimiter._check(rateLimiterInput);

        if (!rateLimitResult.allowed) {
          self.send({
            msg: 'nosub',
            id: msg.id,
            error: new Meteor.Error('too-many-requests', DDPRateLimiter.getErrorMessage(rateLimitResult), {
              timeToReset: rateLimitResult.timeToReset
            })
          });
          return;
        }
      }

      var handler = self.server.publish_handlers[msg.name];

      self._startSubscription(handler, msg.id, msg.params, msg.name);
    },
    unsub: function (msg) {
      var self = this;

      self._stopSubscription(msg.id);
    },
    method: function (msg, unblock) {
      var self = this; // reject malformed messages
      // For now, we silently ignore unknown attributes,
      // for forwards compatibility.

      if (typeof msg.id !== "string" || typeof msg.method !== "string" || 'params' in msg && !(msg.params instanceof Array) || 'randomSeed' in msg && typeof msg.randomSeed !== "string") {
        self.sendError("Malformed method invocation", msg);
        return;
      }

      var randomSeed = msg.randomSeed || null; // set up to mark the method as satisfied once all observers
      // (and subscriptions) have reacted to any writes that were
      // done.

      var fence = new DDPServer._WriteFence();
      fence.onAllCommitted(function () {
        // Retire the fence so that future writes are allowed.
        // This means that callbacks like timers are free to use
        // the fence, and if they fire before it's armed (for
        // example, because the method waits for them) their
        // writes will be included in the fence.
        fence.retire();
        self.send({
          msg: 'updated',
          methods: [msg.id]
        });
      }); // find the handler

      var handler = self.server.method_handlers[msg.method];

      if (!handler) {
        self.send({
          msg: 'result',
          id: msg.id,
          error: new Meteor.Error(404, "Method '".concat(msg.method, "' not found"))
        });
        fence.arm();
        return;
      }

      var setUserId = function (userId) {
        self._setUserId(userId);
      };

      var invocation = new DDPCommon.MethodInvocation({
        isSimulation: false,
        userId: self.userId,
        setUserId: setUserId,
        unblock: unblock,
        connection: self.connectionHandle,
        randomSeed: randomSeed
      });
      const promise = new Promise((resolve, reject) => {
        // XXX It'd be better if we could hook into method handlers better but
        // for now, we need to check if the ddp-rate-limiter exists since we
        // have a weak requirement for the ddp-rate-limiter package to be added
        // to our application.
        if (Package['ddp-rate-limiter']) {
          var DDPRateLimiter = Package['ddp-rate-limiter'].DDPRateLimiter;
          var rateLimiterInput = {
            userId: self.userId,
            clientAddress: self.connectionHandle.clientAddress,
            type: "method",
            name: msg.method,
            connectionId: self.id
          };

          DDPRateLimiter._increment(rateLimiterInput);

          var rateLimitResult = DDPRateLimiter._check(rateLimiterInput);

          if (!rateLimitResult.allowed) {
            reject(new Meteor.Error("too-many-requests", DDPRateLimiter.getErrorMessage(rateLimitResult), {
              timeToReset: rateLimitResult.timeToReset
            }));
            return;
          }
        }

        resolve(DDPServer._CurrentWriteFence.withValue(fence, () => DDP._CurrentMethodInvocation.withValue(invocation, () => maybeAuditArgumentChecks(handler, invocation, msg.params, "call to '" + msg.method + "'"))));
      });

      function finish() {
        fence.arm();
        unblock();
      }

      const payload = {
        msg: "result",
        id: msg.id
      };
      promise.then(result => {
        finish();

        if (result !== undefined) {
          payload.result = result;
        }

        self.send(payload);
      }, exception => {
        finish();
        payload.error = wrapInternalException(exception, "while invoking method '".concat(msg.method, "'"));
        self.send(payload);
      });
    }
  },
  _eachSub: function (f) {
    var self = this;

    self._namedSubs.forEach(f);

    self._universalSubs.forEach(f);
  },
  _diffCollectionViews: function (beforeCVs) {
    var self = this;
    DiffSequence.diffMaps(beforeCVs, self.collectionViews, {
      both: function (collectionName, leftValue, rightValue) {
        rightValue.diff(leftValue);
      },
      rightOnly: function (collectionName, rightValue) {
        rightValue.documents.forEach(function (docView, id) {
          self.sendAdded(collectionName, id, docView.getFields());
        });
      },
      leftOnly: function (collectionName, leftValue) {
        leftValue.documents.forEach(function (doc, id) {
          self.sendRemoved(collectionName, id);
        });
      }
    });
  },
  // Sets the current user id in all appropriate contexts and reruns
  // all subscriptions
  _setUserId: function (userId) {
    var self = this;
    if (userId !== null && typeof userId !== "string") throw new Error("setUserId must be called on string or null, not " + typeof userId); // Prevent newly-created universal subscriptions from being added to our
    // session; they will be found below when we call startUniversalSubs.
    //
    // (We don't have to worry about named subscriptions, because we only add
    // them when we process a 'sub' message. We are currently processing a
    // 'method' message, and the method did not unblock, because it is illegal
    // to call setUserId after unblock. Thus we cannot be concurrently adding a
    // new named subscription.)

    self._dontStartNewUniversalSubs = true; // Prevent current subs from updating our collectionViews and call their
    // stop callbacks. This may yield.

    self._eachSub(function (sub) {
      sub._deactivate();
    }); // All subs should now be deactivated. Stop sending messages to the client,
    // save the state of the published collections, reset to an empty view, and
    // update the userId.


    self._isSending = false;
    var beforeCVs = self.collectionViews;
    self.collectionViews = new Map();
    self.userId = userId; // _setUserId is normally called from a Meteor method with
    // DDP._CurrentMethodInvocation set. But DDP._CurrentMethodInvocation is not
    // expected to be set inside a publish function, so we temporary unset it.
    // Inside a publish function DDP._CurrentPublicationInvocation is set.

    DDP._CurrentMethodInvocation.withValue(undefined, function () {
      // Save the old named subs, and reset to having no subscriptions.
      var oldNamedSubs = self._namedSubs;
      self._namedSubs = new Map();
      self._universalSubs = [];
      oldNamedSubs.forEach(function (sub, subscriptionId) {
        var newSub = sub._recreate();

        self._namedSubs.set(subscriptionId, newSub); // nb: if the handler throws or calls this.error(), it will in fact
        // immediately send its 'nosub'. This is OK, though.


        newSub._runHandler();
      }); // Allow newly-created universal subs to be started on our connection in
      // parallel with the ones we're spinning up here, and spin up universal
      // subs.

      self._dontStartNewUniversalSubs = false;
      self.startUniversalSubs();
    }); // Start sending messages again, beginning with the diff from the previous
    // state of the world to the current state. No yields are allowed during
    // this diff, so that other changes cannot interleave.


    Meteor._noYieldsAllowed(function () {
      self._isSending = true;

      self._diffCollectionViews(beforeCVs);

      if (!_.isEmpty(self._pendingReady)) {
        self.sendReady(self._pendingReady);
        self._pendingReady = [];
      }
    });
  },
  _startSubscription: function (handler, subId, params, name) {
    var self = this;
    var sub = new Subscription(self, handler, subId, params, name);
    if (subId) self._namedSubs.set(subId, sub);else self._universalSubs.push(sub);

    sub._runHandler();
  },
  // tear down specified subscription
  _stopSubscription: function (subId, error) {
    var self = this;
    var subName = null;

    if (subId) {
      var maybeSub = self._namedSubs.get(subId);

      if (maybeSub) {
        subName = maybeSub._name;

        maybeSub._removeAllDocuments();

        maybeSub._deactivate();

        self._namedSubs.delete(subId);
      }
    }

    var response = {
      msg: 'nosub',
      id: subId
    };

    if (error) {
      response.error = wrapInternalException(error, subName ? "from sub " + subName + " id " + subId : "from sub id " + subId);
    }

    self.send(response);
  },
  // tear down all subscriptions. Note that this does NOT send removed or nosub
  // messages, since we assume the client is gone.
  _deactivateAllSubscriptions: function () {
    var self = this;

    self._namedSubs.forEach(function (sub, id) {
      sub._deactivate();
    });

    self._namedSubs = new Map();

    self._universalSubs.forEach(function (sub) {
      sub._deactivate();
    });

    self._universalSubs = [];
  },
  // Determine the remote client's IP address, based on the
  // HTTP_FORWARDED_COUNT environment variable representing how many
  // proxies the server is behind.
  _clientAddress: function () {
    var self = this; // For the reported client address for a connection to be correct,
    // the developer must set the HTTP_FORWARDED_COUNT environment
    // variable to an integer representing the number of hops they
    // expect in the `x-forwarded-for` header. E.g., set to "1" if the
    // server is behind one proxy.
    //
    // This could be computed once at startup instead of every time.

    var httpForwardedCount = parseInt(process.env['HTTP_FORWARDED_COUNT']) || 0;
    if (httpForwardedCount === 0) return self.socket.remoteAddress;
    var forwardedFor = self.socket.headers["x-forwarded-for"];
    if (!_.isString(forwardedFor)) return null;
    forwardedFor = forwardedFor.trim().split(/\s*,\s*/); // Typically the first value in the `x-forwarded-for` header is
    // the original IP address of the client connecting to the first
    // proxy.  However, the end user can easily spoof the header, in
    // which case the first value(s) will be the fake IP address from
    // the user pretending to be a proxy reporting the original IP
    // address value.  By counting HTTP_FORWARDED_COUNT back from the
    // end of the list, we ensure that we get the IP address being
    // reported by *our* first proxy.

    if (httpForwardedCount < 0 || httpForwardedCount > forwardedFor.length) return null;
    return forwardedFor[forwardedFor.length - httpForwardedCount];
  }
});
/******************************************************************************/

/* Subscription                                                               */

/******************************************************************************/
// ctor for a sub handle: the input to each publish function
// Instance name is this because it's usually referred to as this inside a
// publish

/**
 * @summary The server's side of a subscription
 * @class Subscription
 * @instanceName this
 * @showInstanceName true
 */


var Subscription = function (session, handler, subscriptionId, params, name) {
  var self = this;
  self._session = session; // type is Session

  /**
   * @summary Access inside the publish function. The incoming [connection](#meteor_onconnection) for this subscription.
   * @locus Server
   * @name  connection
   * @memberOf Subscription
   * @instance
   */

  self.connection = session.connectionHandle; // public API object

  self._handler = handler; // my subscription ID (generated by client, undefined for universal subs).

  self._subscriptionId = subscriptionId; // undefined for universal subs

  self._name = name;
  self._params = params || []; // Only named subscriptions have IDs, but we need some sort of string
  // internally to keep track of all subscriptions inside
  // SessionDocumentViews. We use this subscriptionHandle for that.

  if (self._subscriptionId) {
    self._subscriptionHandle = 'N' + self._subscriptionId;
  } else {
    self._subscriptionHandle = 'U' + Random.id();
  } // has _deactivate been called?


  self._deactivated = false; // stop callbacks to g/c this sub.  called w/ zero arguments.

  self._stopCallbacks = []; // the set of (collection, documentid) that this subscription has
  // an opinion about

  self._documents = new Map(); // remember if we are ready.

  self._ready = false; // Part of the public API: the user of this sub.

  /**
   * @summary Access inside the publish function. The id of the logged-in user, or `null` if no user is logged in.
   * @locus Server
   * @memberOf Subscription
   * @name  userId
   * @instance
   */

  self.userId = session.userId; // For now, the id filter is going to default to
  // the to/from DDP methods on MongoID, to
  // specifically deal with mongo/minimongo ObjectIds.
  // Later, you will be able to make this be "raw"
  // if you want to publish a collection that you know
  // just has strings for keys and no funny business, to
  // a ddp consumer that isn't minimongo

  self._idFilter = {
    idStringify: MongoID.idStringify,
    idParse: MongoID.idParse
  };
  Package['facts-base'] && Package['facts-base'].Facts.incrementServerFact("livedata", "subscriptions", 1);
};

_.extend(Subscription.prototype, {
  _runHandler: function () {
    // XXX should we unblock() here? Either before running the publish
    // function, or before running _publishCursor.
    //
    // Right now, each publish function blocks all future publishes and
    // methods waiting on data from Mongo (or whatever else the function
    // blocks on). This probably slows page load in common cases.
    var self = this;

    try {
      var res = DDP._CurrentPublicationInvocation.withValue(self, () => maybeAuditArgumentChecks(self._handler, self, EJSON.clone(self._params), // It's OK that this would look weird for universal subscriptions,
      // because they have no arguments so there can never be an
      // audit-argument-checks failure.
      "publisher '" + self._name + "'"));
    } catch (e) {
      self.error(e);
      return;
    } // Did the handler call this.error or this.stop?


    if (self._isDeactivated()) return;

    self._publishHandlerResult(res);
  },
  _publishHandlerResult: function (res) {
    // SPECIAL CASE: Instead of writing their own callbacks that invoke
    // this.added/changed/ready/etc, the user can just return a collection
    // cursor or array of cursors from the publish function; we call their
    // _publishCursor method which starts observing the cursor and publishes the
    // results. Note that _publishCursor does NOT call ready().
    //
    // XXX This uses an undocumented interface which only the Mongo cursor
    // interface publishes. Should we make this interface public and encourage
    // users to implement it themselves? Arguably, it's unnecessary; users can
    // already write their own functions like
    //   var publishMyReactiveThingy = function (name, handler) {
    //     Meteor.publish(name, function () {
    //       var reactiveThingy = handler();
    //       reactiveThingy.publishMe();
    //     });
    //   };
    var self = this;

    var isCursor = function (c) {
      return c && c._publishCursor;
    };

    if (isCursor(res)) {
      try {
        res._publishCursor(self);
      } catch (e) {
        self.error(e);
        return;
      } // _publishCursor only returns after the initial added callbacks have run.
      // mark subscription as ready.


      self.ready();
    } else if (_.isArray(res)) {
      // check all the elements are cursors
      if (!_.all(res, isCursor)) {
        self.error(new Error("Publish function returned an array of non-Cursors"));
        return;
      } // find duplicate collection names
      // XXX we should support overlapping cursors, but that would require the
      // merge box to allow overlap within a subscription


      var collectionNames = {};

      for (var i = 0; i < res.length; ++i) {
        var collectionName = res[i]._getCollectionName();

        if (_.has(collectionNames, collectionName)) {
          self.error(new Error("Publish function returned multiple cursors for collection " + collectionName));
          return;
        }

        collectionNames[collectionName] = true;
      }

      ;

      try {
        _.each(res, function (cur) {
          cur._publishCursor(self);
        });
      } catch (e) {
        self.error(e);
        return;
      }

      self.ready();
    } else if (res) {
      // truthy values other than cursors or arrays are probably a
      // user mistake (possible returning a Mongo document via, say,
      // `coll.findOne()`).
      self.error(new Error("Publish function can only return a Cursor or " + "an array of Cursors"));
    }
  },
  // This calls all stop callbacks and prevents the handler from updating any
  // SessionCollectionViews further. It's used when the user unsubscribes or
  // disconnects, as well as during setUserId re-runs. It does *NOT* send
  // removed messages for the published objects; if that is necessary, call
  // _removeAllDocuments first.
  _deactivate: function () {
    var self = this;
    if (self._deactivated) return;
    self._deactivated = true;

    self._callStopCallbacks();

    Package['facts-base'] && Package['facts-base'].Facts.incrementServerFact("livedata", "subscriptions", -1);
  },
  _callStopCallbacks: function () {
    var self = this; // tell listeners, so they can clean up

    var callbacks = self._stopCallbacks;
    self._stopCallbacks = [];

    _.each(callbacks, function (callback) {
      callback();
    });
  },
  // Send remove messages for every document.
  _removeAllDocuments: function () {
    var self = this;

    Meteor._noYieldsAllowed(function () {
      self._documents.forEach(function (collectionDocs, collectionName) {
        collectionDocs.forEach(function (strId) {
          self.removed(collectionName, self._idFilter.idParse(strId));
        });
      });
    });
  },
  // Returns a new Subscription for the same session with the same
  // initial creation parameters. This isn't a clone: it doesn't have
  // the same _documents cache, stopped state or callbacks; may have a
  // different _subscriptionHandle, and gets its userId from the
  // session, not from this object.
  _recreate: function () {
    var self = this;
    return new Subscription(self._session, self._handler, self._subscriptionId, self._params, self._name);
  },

  /**
   * @summary Call inside the publish function.  Stops this client's subscription, triggering a call on the client to the `onStop` callback passed to [`Meteor.subscribe`](#meteor_subscribe), if any. If `error` is not a [`Meteor.Error`](#meteor_error), it will be [sanitized](#meteor_error).
   * @locus Server
   * @param {Error} error The error to pass to the client.
   * @instance
   * @memberOf Subscription
   */
  error: function (error) {
    var self = this;
    if (self._isDeactivated()) return;

    self._session._stopSubscription(self._subscriptionId, error);
  },
  // Note that while our DDP client will notice that you've called stop() on the
  // server (and clean up its _subscriptions table) we don't actually provide a
  // mechanism for an app to notice this (the subscribe onError callback only
  // triggers if there is an error).

  /**
   * @summary Call inside the publish function.  Stops this client's subscription and invokes the client's `onStop` callback with no error.
   * @locus Server
   * @instance
   * @memberOf Subscription
   */
  stop: function () {
    var self = this;
    if (self._isDeactivated()) return;

    self._session._stopSubscription(self._subscriptionId);
  },

  /**
   * @summary Call inside the publish function.  Registers a callback function to run when the subscription is stopped.
   * @locus Server
   * @memberOf Subscription
   * @instance
   * @param {Function} func The callback function
   */
  onStop: function (callback) {
    var self = this;
    callback = Meteor.bindEnvironment(callback, 'onStop callback', self);
    if (self._isDeactivated()) callback();else self._stopCallbacks.push(callback);
  },
  // This returns true if the sub has been deactivated, *OR* if the session was
  // destroyed but the deferred call to _deactivateAllSubscriptions hasn't
  // happened yet.
  _isDeactivated: function () {
    var self = this;
    return self._deactivated || self._session.inQueue === null;
  },

  /**
   * @summary Call inside the publish function.  Informs the subscriber that a document has been added to the record set.
   * @locus Server
   * @memberOf Subscription
   * @instance
   * @param {String} collection The name of the collection that contains the new document.
   * @param {String} id The new document's ID.
   * @param {Object} fields The fields in the new document.  If `_id` is present it is ignored.
   */
  added: function (collectionName, id, fields) {
    var self = this;
    if (self._isDeactivated()) return;
    id = self._idFilter.idStringify(id);

    let ids = self._documents.get(collectionName);

    if (ids == null) {
      ids = new Set();

      self._documents.set(collectionName, ids);
    }

    ids.add(id);

    self._session.added(self._subscriptionHandle, collectionName, id, fields);
  },

  /**
   * @summary Call inside the publish function.  Informs the subscriber that a document in the record set has been modified.
   * @locus Server
   * @memberOf Subscription
   * @instance
   * @param {String} collection The name of the collection that contains the changed document.
   * @param {String} id The changed document's ID.
   * @param {Object} fields The fields in the document that have changed, together with their new values.  If a field is not present in `fields` it was left unchanged; if it is present in `fields` and has a value of `undefined` it was removed from the document.  If `_id` is present it is ignored.
   */
  changed: function (collectionName, id, fields) {
    var self = this;
    if (self._isDeactivated()) return;
    id = self._idFilter.idStringify(id);

    self._session.changed(self._subscriptionHandle, collectionName, id, fields);
  },

  /**
   * @summary Call inside the publish function.  Informs the subscriber that a document has been removed from the record set.
   * @locus Server
   * @memberOf Subscription
   * @instance
   * @param {String} collection The name of the collection that the document has been removed from.
   * @param {String} id The ID of the document that has been removed.
   */
  removed: function (collectionName, id) {
    var self = this;
    if (self._isDeactivated()) return;
    id = self._idFilter.idStringify(id); // We don't bother to delete sets of things in a collection if the
    // collection is empty.  It could break _removeAllDocuments.

    self._documents.get(collectionName).delete(id);

    self._session.removed(self._subscriptionHandle, collectionName, id);
  },

  /**
   * @summary Call inside the publish function.  Informs the subscriber that an initial, complete snapshot of the record set has been sent.  This will trigger a call on the client to the `onReady` callback passed to  [`Meteor.subscribe`](#meteor_subscribe), if any.
   * @locus Server
   * @memberOf Subscription
   * @instance
   */
  ready: function () {
    var self = this;
    if (self._isDeactivated()) return;
    if (!self._subscriptionId) return; // unnecessary but ignored for universal sub

    if (!self._ready) {
      self._session.sendReady([self._subscriptionId]);

      self._ready = true;
    }
  }
});
/******************************************************************************/

/* Server                                                                     */

/******************************************************************************/


Server = function (options) {
  var self = this; // The default heartbeat interval is 30 seconds on the server and 35
  // seconds on the client.  Since the client doesn't need to send a
  // ping as long as it is receiving pings, this means that pings
  // normally go from the server to the client.
  //
  // Note: Troposphere depends on the ability to mutate
  // Meteor.server.options.heartbeatTimeout! This is a hack, but it's life.

  self.options = _.defaults(options || {}, {
    heartbeatInterval: 15000,
    heartbeatTimeout: 15000,
    // For testing, allow responding to pings to be disabled.
    respondToPings: true
  }); // Map of callbacks to call when a new connection comes in to the
  // server and completes DDP version negotiation. Use an object instead
  // of an array so we can safely remove one from the list while
  // iterating over it.

  self.onConnectionHook = new Hook({
    debugPrintExceptions: "onConnection callback"
  }); // Map of callbacks to call when a new message comes in.

  self.onMessageHook = new Hook({
    debugPrintExceptions: "onMessage callback"
  });
  self.publish_handlers = {};
  self.universal_publish_handlers = [];
  self.method_handlers = {};
  self.sessions = new Map(); // map from id to session

  self.stream_server = new StreamServer();
  self.stream_server.register(function (socket) {
    // socket implements the SockJSConnection interface
    socket._meteorSession = null;

    var sendError = function (reason, offendingMessage) {
      var msg = {
        msg: 'error',
        reason: reason
      };
      if (offendingMessage) msg.offendingMessage = offendingMessage;
      socket.send(DDPCommon.stringifyDDP(msg));
    };

    socket.on('data', function (raw_msg) {
      if (Meteor._printReceivedDDP) {
        Meteor._debug("Received DDP", raw_msg);
      }

      try {
        try {
          var msg = DDPCommon.parseDDP(raw_msg);
        } catch (err) {
          sendError('Parse error');
          return;
        }

        if (msg === null || !msg.msg) {
          sendError('Bad request', msg);
          return;
        }

        if (msg.msg === 'connect') {
          if (socket._meteorSession) {
            sendError("Already connected", msg);
            return;
          }

          Fiber(function () {
            self._handleConnect(socket, msg);
          }).run();
          return;
        }

        if (!socket._meteorSession) {
          sendError('Must connect first', msg);
          return;
        }

        socket._meteorSession.processMessage(msg);
      } catch (e) {
        // XXX print stack nicely
        Meteor._debug("Internal exception while processing message", msg, e);
      }
    });
    socket.on('close', function () {
      if (socket._meteorSession) {
        Fiber(function () {
          socket._meteorSession.close();
        }).run();
      }
    });
  });
};

_.extend(Server.prototype, {
  /**
   * @summary Register a callback to be called when a new DDP connection is made to the server.
   * @locus Server
   * @param {function} callback The function to call when a new DDP connection is established.
   * @memberOf Meteor
   * @importFromPackage meteor
   */
  onConnection: function (fn) {
    var self = this;
    return self.onConnectionHook.register(fn);
  },

  /**
   * @summary Register a callback to be called when a new DDP message is received.
   * @locus Server
   * @param {function} callback The function to call when a new DDP message is received.
   * @memberOf Meteor
   * @importFromPackage meteor
   */
  onMessage: function (fn) {
    var self = this;
    return self.onMessageHook.register(fn);
  },
  _handleConnect: function (socket, msg) {
    var self = this; // The connect message must specify a version and an array of supported
    // versions, and it must claim to support what it is proposing.

    if (!(typeof msg.version === 'string' && _.isArray(msg.support) && _.all(msg.support, _.isString) && _.contains(msg.support, msg.version))) {
      socket.send(DDPCommon.stringifyDDP({
        msg: 'failed',
        version: DDPCommon.SUPPORTED_DDP_VERSIONS[0]
      }));
      socket.close();
      return;
    } // In the future, handle session resumption: something like:
    //  socket._meteorSession = self.sessions[msg.session]


    var version = calculateVersion(msg.support, DDPCommon.SUPPORTED_DDP_VERSIONS);

    if (msg.version !== version) {
      // The best version to use (according to the client's stated preferences)
      // is not the one the client is trying to use. Inform them about the best
      // version to use.
      socket.send(DDPCommon.stringifyDDP({
        msg: 'failed',
        version: version
      }));
      socket.close();
      return;
    } // Yay, version matches! Create a new session.
    // Note: Troposphere depends on the ability to mutate
    // Meteor.server.options.heartbeatTimeout! This is a hack, but it's life.


    socket._meteorSession = new Session(self, version, socket, self.options);
    self.sessions.set(socket._meteorSession.id, socket._meteorSession);
    self.onConnectionHook.each(function (callback) {
      if (socket._meteorSession) callback(socket._meteorSession.connectionHandle);
      return true;
    });
  },

  /**
   * Register a publish handler function.
   *
   * @param name {String} identifier for query
   * @param handler {Function} publish handler
   * @param options {Object}
   *
   * Server will call handler function on each new subscription,
   * either when receiving DDP sub message for a named subscription, or on
   * DDP connect for a universal subscription.
   *
   * If name is null, this will be a subscription that is
   * automatically established and permanently on for all connected
   * client, instead of a subscription that can be turned on and off
   * with subscribe().
   *
   * options to contain:
   *  - (mostly internal) is_auto: true if generated automatically
   *    from an autopublish hook. this is for cosmetic purposes only
   *    (it lets us determine whether to print a warning suggesting
   *    that you turn off autopublish.)
   */

  /**
   * @summary Publish a record set.
   * @memberOf Meteor
   * @importFromPackage meteor
   * @locus Server
   * @param {String|Object} name If String, name of the record set.  If Object, publications Dictionary of publish functions by name.  If `null`, the set has no name, and the record set is automatically sent to all connected clients.
   * @param {Function} func Function called on the server each time a client subscribes.  Inside the function, `this` is the publish handler object, described below.  If the client passed arguments to `subscribe`, the function is called with the same arguments.
   */
  publish: function (name, handler, options) {
    var self = this;

    if (!_.isObject(name)) {
      options = options || {};

      if (name && name in self.publish_handlers) {
        Meteor._debug("Ignoring duplicate publish named '" + name + "'");

        return;
      }

      if (Package.autopublish && !options.is_auto) {
        // They have autopublish on, yet they're trying to manually
        // picking stuff to publish. They probably should turn off
        // autopublish. (This check isn't perfect -- if you create a
        // publish before you turn on autopublish, it won't catch
        // it. But this will definitely handle the simple case where
        // you've added the autopublish package to your app, and are
        // calling publish from your app code.)
        if (!self.warned_about_autopublish) {
          self.warned_about_autopublish = true;

          Meteor._debug("** You've set up some data subscriptions with Meteor.publish(), but\n" + "** you still have autopublish turned on. Because autopublish is still\n" + "** on, your Meteor.publish() calls won't have much effect. All data\n" + "** will still be sent to all clients.\n" + "**\n" + "** Turn off autopublish by removing the autopublish package:\n" + "**\n" + "**   $ meteor remove autopublish\n" + "**\n" + "** .. and make sure you have Meteor.publish() and Meteor.subscribe() calls\n" + "** for each collection that you want clients to see.\n");
        }
      }

      if (name) self.publish_handlers[name] = handler;else {
        self.universal_publish_handlers.push(handler); // Spin up the new publisher on any existing session too. Run each
        // session's subscription in a new Fiber, so that there's no change for
        // self.sessions to change while we're running this loop.

        self.sessions.forEach(function (session) {
          if (!session._dontStartNewUniversalSubs) {
            Fiber(function () {
              session._startSubscription(handler);
            }).run();
          }
        });
      }
    } else {
      _.each(name, function (value, key) {
        self.publish(key, value, {});
      });
    }
  },
  _removeSession: function (session) {
    var self = this;
    self.sessions.delete(session.id);
  },

  /**
   * @summary Defines functions that can be invoked over the network by clients.
   * @locus Anywhere
   * @param {Object} methods Dictionary whose keys are method names and values are functions.
   * @memberOf Meteor
   * @importFromPackage meteor
   */
  methods: function (methods) {
    var self = this;

    _.each(methods, function (func, name) {
      if (typeof func !== 'function') throw new Error("Method '" + name + "' must be a function");
      if (self.method_handlers[name]) throw new Error("A method named '" + name + "' is already defined");
      self.method_handlers[name] = func;
    });
  },
  call: function (name) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    if (args.length && typeof args[args.length - 1] === "function") {
      // If it's a function, the last argument is the result callback, not
      // a parameter to the remote method.
      var callback = args.pop();
    }

    return this.apply(name, args, callback);
  },
  // A version of the call method that always returns a Promise.
  callAsync: function (name) {
    for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    return this.applyAsync(name, args);
  },
  apply: function (name, args, options, callback) {
    // We were passed 3 arguments. They may be either (name, args, options)
    // or (name, args, callback)
    if (!callback && typeof options === 'function') {
      callback = options;
      options = {};
    } else {
      options = options || {};
    }

    const promise = this.applyAsync(name, args, options); // Return the result in whichever way the caller asked for it. Note that we
    // do NOT block on the write fence in an analogous way to how the client
    // blocks on the relevant data being visible, so you are NOT guaranteed that
    // cursor observe callbacks have fired when your callback is invoked. (We
    // can change this if there's a real use case.)

    if (callback) {
      promise.then(result => callback(undefined, result), exception => callback(exception));
    } else {
      return promise.await();
    }
  },
  // @param options {Optional Object}
  applyAsync: function (name, args, options) {
    // Run the handler
    var handler = this.method_handlers[name];

    if (!handler) {
      return Promise.reject(new Meteor.Error(404, "Method '".concat(name, "' not found")));
    } // If this is a method call from within another method or publish function,
    // get the user state from the outer method or publish function, otherwise
    // don't allow setUserId to be called


    var userId = null;

    var setUserId = function () {
      throw new Error("Can't call setUserId on a server initiated method call");
    };

    var connection = null;

    var currentMethodInvocation = DDP._CurrentMethodInvocation.get();

    var currentPublicationInvocation = DDP._CurrentPublicationInvocation.get();

    var randomSeed = null;

    if (currentMethodInvocation) {
      userId = currentMethodInvocation.userId;

      setUserId = function (userId) {
        currentMethodInvocation.setUserId(userId);
      };

      connection = currentMethodInvocation.connection;
      randomSeed = DDPCommon.makeRpcSeed(currentMethodInvocation, name);
    } else if (currentPublicationInvocation) {
      userId = currentPublicationInvocation.userId;

      setUserId = function (userId) {
        currentPublicationInvocation._session._setUserId(userId);
      };

      connection = currentPublicationInvocation.connection;
    }

    var invocation = new DDPCommon.MethodInvocation({
      isSimulation: false,
      userId,
      setUserId,
      connection,
      randomSeed
    });
    return new Promise(resolve => resolve(DDP._CurrentMethodInvocation.withValue(invocation, () => maybeAuditArgumentChecks(handler, invocation, EJSON.clone(args), "internal call to '" + name + "'")))).then(EJSON.clone);
  },
  _urlForSession: function (sessionId) {
    var self = this;
    var session = self.sessions.get(sessionId);
    if (session) return session._socketUrl;else return null;
  }
});

var calculateVersion = function (clientSupportedVersions, serverSupportedVersions) {
  var correctVersion = _.find(clientSupportedVersions, function (version) {
    return _.contains(serverSupportedVersions, version);
  });

  if (!correctVersion) {
    correctVersion = serverSupportedVersions[0];
  }

  return correctVersion;
};

DDPServer._calculateVersion = calculateVersion; // "blind" exceptions other than those that were deliberately thrown to signal
// errors to the client

var wrapInternalException = function (exception, context) {
  if (!exception) return exception; // To allow packages to throw errors intended for the client but not have to
  // depend on the Meteor.Error class, `isClientSafe` can be set to true on any
  // error before it is thrown.

  if (exception.isClientSafe) {
    if (!(exception instanceof Meteor.Error)) {
      const originalMessage = exception.message;
      exception = new Meteor.Error(exception.error, exception.reason, exception.details);
      exception.message = originalMessage;
    }

    return exception;
  } // Tests can set the '_expectedByTest' flag on an exception so it won't go to
  // the server log.


  if (!exception._expectedByTest) {
    Meteor._debug("Exception " + context, exception.stack);

    if (exception.sanitizedError) {
      Meteor._debug("Sanitized and reported to the client as:", exception.sanitizedError);

      Meteor._debug();
    }
  } // Did the error contain more details that could have been useful if caught in
  // server code (or if thrown from non-client-originated code), but also
  // provided a "sanitized" version with more context than 500 Internal server
  // error? Use that.


  if (exception.sanitizedError) {
    if (exception.sanitizedError.isClientSafe) return exception.sanitizedError;

    Meteor._debug("Exception " + context + " provides a sanitizedError that " + "does not have isClientSafe property set; ignoring");
  }

  return new Meteor.Error(500, "Internal server error");
}; // Audit argument checks, if the audit-argument-checks package exists (it is a
// weak dependency of this package).


var maybeAuditArgumentChecks = function (f, context, args, description) {
  args = args || [];

  if (Package['audit-argument-checks']) {
    return Match._failIfArgumentsAreNotAllChecked(f, context, args, description);
  }

  return f.apply(context, args);
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"writefence.js":function module(require){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/ddp-server/writefence.js                                                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Future = Npm.require('fibers/future'); // A write fence collects a group of writes, and provides a callback
// when all of the writes are fully committed and propagated (all
// observers have been notified of the write and acknowledged it.)
//


DDPServer._WriteFence = function () {
  var self = this;
  self.armed = false;
  self.fired = false;
  self.retired = false;
  self.outstanding_writes = 0;
  self.before_fire_callbacks = [];
  self.completion_callbacks = [];
}; // The current write fence. When there is a current write fence, code
// that writes to databases should register their writes with it using
// beginWrite().
//


DDPServer._CurrentWriteFence = new Meteor.EnvironmentVariable();

_.extend(DDPServer._WriteFence.prototype, {
  // Start tracking a write, and return an object to represent it. The
  // object has a single method, committed(). This method should be
  // called when the write is fully committed and propagated. You can
  // continue to add writes to the WriteFence up until it is triggered
  // (calls its callbacks because all writes have committed.)
  beginWrite: function () {
    var self = this;
    if (self.retired) return {
      committed: function () {}
    };
    if (self.fired) throw new Error("fence has already activated -- too late to add writes");
    self.outstanding_writes++;
    var committed = false;
    return {
      committed: function () {
        if (committed) throw new Error("committed called twice on the same write");
        committed = true;
        self.outstanding_writes--;

        self._maybeFire();
      }
    };
  },
  // Arm the fence. Once the fence is armed, and there are no more
  // uncommitted writes, it will activate.
  arm: function () {
    var self = this;
    if (self === DDPServer._CurrentWriteFence.get()) throw Error("Can't arm the current fence");
    self.armed = true;

    self._maybeFire();
  },
  // Register a function to be called once before firing the fence.
  // Callback function can add new writes to the fence, in which case
  // it won't fire until those writes are done as well.
  onBeforeFire: function (func) {
    var self = this;
    if (self.fired) throw new Error("fence has already activated -- too late to " + "add a callback");
    self.before_fire_callbacks.push(func);
  },
  // Register a function to be called when the fence fires.
  onAllCommitted: function (func) {
    var self = this;
    if (self.fired) throw new Error("fence has already activated -- too late to " + "add a callback");
    self.completion_callbacks.push(func);
  },
  // Convenience function. Arms the fence, then blocks until it fires.
  armAndWait: function () {
    var self = this;
    var future = new Future();
    self.onAllCommitted(function () {
      future['return']();
    });
    self.arm();
    future.wait();
  },
  _maybeFire: function () {
    var self = this;
    if (self.fired) throw new Error("write fence already activated?");

    if (self.armed && !self.outstanding_writes) {
      function invokeCallback(func) {
        try {
          func(self);
        } catch (err) {
          Meteor._debug("exception in write fence callback", err);
        }
      }

      self.outstanding_writes++;

      while (self.before_fire_callbacks.length > 0) {
        var callbacks = self.before_fire_callbacks;
        self.before_fire_callbacks = [];

        _.each(callbacks, invokeCallback);
      }

      self.outstanding_writes--;

      if (!self.outstanding_writes) {
        self.fired = true;
        var callbacks = self.completion_callbacks;
        self.completion_callbacks = [];

        _.each(callbacks, invokeCallback);
      }
    }
  },
  // Deactivate this fence so that adding more writes has no effect.
  // The fence must have already fired.
  retire: function () {
    var self = this;
    if (!self.fired) throw new Error("Can't retire a fence that hasn't fired.");
    self.retired = true;
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"crossbar.js":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/ddp-server/crossbar.js                                                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
// A "crossbar" is a class that provides structured notification registration.
// See _match for the definition of how a notification matches a trigger.
// All notifications and triggers must have a string key named 'collection'.
DDPServer._Crossbar = function (options) {
  var self = this;
  options = options || {};
  self.nextId = 1; // map from collection name (string) -> listener id -> object. each object has
  // keys 'trigger', 'callback'.  As a hack, the empty string means "no
  // collection".

  self.listenersByCollection = {};
  self.listenersByCollectionCount = {};
  self.factPackage = options.factPackage || "livedata";
  self.factName = options.factName || null;
};

_.extend(DDPServer._Crossbar.prototype, {
  // msg is a trigger or a notification
  _collectionForMessage: function (msg) {
    var self = this;

    if (!_.has(msg, 'collection')) {
      return '';
    } else if (typeof msg.collection === 'string') {
      if (msg.collection === '') throw Error("Message has empty collection!");
      return msg.collection;
    } else {
      throw Error("Message has non-string collection!");
    }
  },
  // Listen for notification that match 'trigger'. A notification
  // matches if it has the key-value pairs in trigger as a
  // subset. When a notification matches, call 'callback', passing
  // the actual notification.
  //
  // Returns a listen handle, which is an object with a method
  // stop(). Call stop() to stop listening.
  //
  // XXX It should be legal to call fire() from inside a listen()
  // callback?
  listen: function (trigger, callback) {
    var self = this;
    var id = self.nextId++;

    var collection = self._collectionForMessage(trigger);

    var record = {
      trigger: EJSON.clone(trigger),
      callback: callback
    };

    if (!_.has(self.listenersByCollection, collection)) {
      self.listenersByCollection[collection] = {};
      self.listenersByCollectionCount[collection] = 0;
    }

    self.listenersByCollection[collection][id] = record;
    self.listenersByCollectionCount[collection]++;

    if (self.factName && Package['facts-base']) {
      Package['facts-base'].Facts.incrementServerFact(self.factPackage, self.factName, 1);
    }

    return {
      stop: function () {
        if (self.factName && Package['facts-base']) {
          Package['facts-base'].Facts.incrementServerFact(self.factPackage, self.factName, -1);
        }

        delete self.listenersByCollection[collection][id];
        self.listenersByCollectionCount[collection]--;

        if (self.listenersByCollectionCount[collection] === 0) {
          delete self.listenersByCollection[collection];
          delete self.listenersByCollectionCount[collection];
        }
      }
    };
  },
  // Fire the provided 'notification' (an object whose attribute
  // values are all JSON-compatibile) -- inform all matching listeners
  // (registered with listen()).
  //
  // If fire() is called inside a write fence, then each of the
  // listener callbacks will be called inside the write fence as well.
  //
  // The listeners may be invoked in parallel, rather than serially.
  fire: function (notification) {
    var self = this;

    var collection = self._collectionForMessage(notification);

    if (!_.has(self.listenersByCollection, collection)) {
      return;
    }

    var listenersForCollection = self.listenersByCollection[collection];
    var callbackIds = [];

    _.each(listenersForCollection, function (l, id) {
      if (self._matches(notification, l.trigger)) {
        callbackIds.push(id);
      }
    }); // Listener callbacks can yield, so we need to first find all the ones that
    // match in a single iteration over self.listenersByCollection (which can't
    // be mutated during this iteration), and then invoke the matching
    // callbacks, checking before each call to ensure they haven't stopped.
    // Note that we don't have to check that
    // self.listenersByCollection[collection] still === listenersForCollection,
    // because the only way that stops being true is if listenersForCollection
    // first gets reduced down to the empty object (and then never gets
    // increased again).


    _.each(callbackIds, function (id) {
      if (_.has(listenersForCollection, id)) {
        listenersForCollection[id].callback(notification);
      }
    });
  },
  // A notification matches a trigger if all keys that exist in both are equal.
  //
  // Examples:
  //  N:{collection: "C"} matches T:{collection: "C"}
  //    (a non-targeted write to a collection matches a
  //     non-targeted query)
  //  N:{collection: "C", id: "X"} matches T:{collection: "C"}
  //    (a targeted write to a collection matches a non-targeted query)
  //  N:{collection: "C"} matches T:{collection: "C", id: "X"}
  //    (a non-targeted write to a collection matches a
  //     targeted query)
  //  N:{collection: "C", id: "X"} matches T:{collection: "C", id: "X"}
  //    (a targeted write to a collection matches a targeted query targeted
  //     at the same document)
  //  N:{collection: "C", id: "X"} does not match T:{collection: "C", id: "Y"}
  //    (a targeted write to a collection does not match a targeted query
  //     targeted at a different document)
  _matches: function (notification, trigger) {
    // Most notifications that use the crossbar have a string `collection` and
    // maybe an `id` that is a string or ObjectID. We're already dividing up
    // triggers by collection, but let's fast-track "nope, different ID" (and
    // avoid the overly generic EJSON.equals). This makes a noticeable
    // performance difference; see https://github.com/meteor/meteor/pull/3697
    if (typeof notification.id === 'string' && typeof trigger.id === 'string' && notification.id !== trigger.id) {
      return false;
    }

    if (notification.id instanceof MongoID.ObjectID && trigger.id instanceof MongoID.ObjectID && !notification.id.equals(trigger.id)) {
      return false;
    }

    return _.all(trigger, function (triggerValue, key) {
      return !_.has(notification, key) || EJSON.equals(triggerValue, notification[key]);
    });
  }
}); // The "invalidation crossbar" is a specific instance used by the DDP server to
// implement write fence notifications. Listener callbacks on this crossbar
// should call beginWrite on the current write fence before they return, if they
// want to delay the write fence from firing (ie, the DDP method-data-updated
// message from being sent).


DDPServer._InvalidationCrossbar = new DDPServer._Crossbar({
  factName: "invalidation-crossbar-listeners"
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"server_convenience.js":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/ddp-server/server_convenience.js                                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
if (process.env.DDP_DEFAULT_CONNECTION_URL) {
  __meteor_runtime_config__.DDP_DEFAULT_CONNECTION_URL = process.env.DDP_DEFAULT_CONNECTION_URL;
}

Meteor.server = new Server();

Meteor.refresh = function (notification) {
  DDPServer._InvalidationCrossbar.fire(notification);
}; // Proxy the public methods of Meteor.server so they can
// be called directly on Meteor.


_.each(['publish', 'methods', 'call', 'apply', 'onConnection', 'onMessage'], function (name) {
  Meteor[name] = _.bind(Meteor.server[name], Meteor.server);
}); // Meteor.server used to be called Meteor.default_server. Provide
// backcompat as a courtesy even though it was never documented.
// XXX COMPAT WITH 0.6.4


Meteor.default_server = Meteor.server;
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

require("/node_modules/meteor/ddp-server/stream_server.js");
require("/node_modules/meteor/ddp-server/livedata_server.js");
require("/node_modules/meteor/ddp-server/writefence.js");
require("/node_modules/meteor/ddp-server/crossbar.js");
require("/node_modules/meteor/ddp-server/server_convenience.js");

/* Exports */
Package._define("ddp-server", {
  DDPServer: DDPServer
});

})();

//# sourceURL=meteor://💻app/packages/ddp-server.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZGRwLXNlcnZlci9zdHJlYW1fc2VydmVyLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9kZHAtc2VydmVyL2xpdmVkYXRhX3NlcnZlci5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZGRwLXNlcnZlci93cml0ZWZlbmNlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9kZHAtc2VydmVyL2Nyb3NzYmFyLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9kZHAtc2VydmVyL3NlcnZlcl9jb252ZW5pZW5jZS5qcyJdLCJuYW1lcyI6WyJ1cmwiLCJOcG0iLCJyZXF1aXJlIiwid2Vic29ja2V0RXh0ZW5zaW9ucyIsIl8iLCJvbmNlIiwiZXh0ZW5zaW9ucyIsIndlYnNvY2tldENvbXByZXNzaW9uQ29uZmlnIiwicHJvY2VzcyIsImVudiIsIlNFUlZFUl9XRUJTT0NLRVRfQ09NUFJFU1NJT04iLCJKU09OIiwicGFyc2UiLCJwdXNoIiwiY29uZmlndXJlIiwicGF0aFByZWZpeCIsIl9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18iLCJST09UX1VSTF9QQVRIX1BSRUZJWCIsIlN0cmVhbVNlcnZlciIsInNlbGYiLCJyZWdpc3RyYXRpb25fY2FsbGJhY2tzIiwib3Blbl9zb2NrZXRzIiwicHJlZml4IiwiUm91dGVQb2xpY3kiLCJkZWNsYXJlIiwic29ja2pzIiwic2VydmVyT3B0aW9ucyIsImxvZyIsImhlYXJ0YmVhdF9kZWxheSIsImRpc2Nvbm5lY3RfZGVsYXkiLCJkaXNhYmxlX2NvcnMiLCJESVNBQkxFX1NPQ0tKU19DT1JTIiwianNlc3Npb25pZCIsIlVTRV9KU0VTU0lPTklEIiwiRElTQUJMRV9XRUJTT0NLRVRTIiwid2Vic29ja2V0IiwiZmF5ZV9zZXJ2ZXJfb3B0aW9ucyIsInNlcnZlciIsImNyZWF0ZVNlcnZlciIsIldlYkFwcCIsImh0dHBTZXJ2ZXIiLCJyZW1vdmVMaXN0ZW5lciIsIl90aW1lb3V0QWRqdXN0bWVudFJlcXVlc3RDYWxsYmFjayIsImluc3RhbGxIYW5kbGVycyIsImFkZExpc3RlbmVyIiwiX3JlZGlyZWN0V2Vic29ja2V0RW5kcG9pbnQiLCJvbiIsInNvY2tldCIsInNldFdlYnNvY2tldFRpbWVvdXQiLCJ0aW1lb3V0IiwicHJvdG9jb2wiLCJfc2Vzc2lvbiIsInJlY3YiLCJjb25uZWN0aW9uIiwic2V0VGltZW91dCIsInNlbmQiLCJkYXRhIiwid3JpdGUiLCJ3aXRob3V0Iiwic3RyaW5naWZ5Iiwic2VydmVyX2lkIiwiZWFjaCIsImNhbGxiYWNrIiwiZXh0ZW5kIiwicHJvdG90eXBlIiwicmVnaXN0ZXIiLCJhbGxfc29ja2V0cyIsInZhbHVlcyIsImV2ZW50Iiwib2xkSHR0cFNlcnZlckxpc3RlbmVycyIsImxpc3RlbmVycyIsInNsaWNlIiwicmVtb3ZlQWxsTGlzdGVuZXJzIiwibmV3TGlzdGVuZXIiLCJyZXF1ZXN0IiwiYXJncyIsImFyZ3VtZW50cyIsInBhcnNlZFVybCIsInBhdGhuYW1lIiwiZm9ybWF0Iiwib2xkTGlzdGVuZXIiLCJhcHBseSIsIkREUFNlcnZlciIsIkZpYmVyIiwiU2Vzc2lvbkRvY3VtZW50VmlldyIsImV4aXN0c0luIiwiU2V0IiwiZGF0YUJ5S2V5IiwiTWFwIiwiX1Nlc3Npb25Eb2N1bWVudFZpZXciLCJnZXRGaWVsZHMiLCJyZXQiLCJmb3JFYWNoIiwicHJlY2VkZW5jZUxpc3QiLCJrZXkiLCJ2YWx1ZSIsImNsZWFyRmllbGQiLCJzdWJzY3JpcHRpb25IYW5kbGUiLCJjaGFuZ2VDb2xsZWN0b3IiLCJnZXQiLCJyZW1vdmVkVmFsdWUiLCJ1bmRlZmluZWQiLCJpIiwibGVuZ3RoIiwicHJlY2VkZW5jZSIsInNwbGljZSIsImRlbGV0ZSIsIkVKU09OIiwiZXF1YWxzIiwiY2hhbmdlRmllbGQiLCJpc0FkZCIsImNsb25lIiwiaGFzIiwic2V0IiwiZWx0IiwiZmluZCIsIlNlc3Npb25Db2xsZWN0aW9uVmlldyIsImNvbGxlY3Rpb25OYW1lIiwic2Vzc2lvbkNhbGxiYWNrcyIsImRvY3VtZW50cyIsImNhbGxiYWNrcyIsIl9TZXNzaW9uQ29sbGVjdGlvblZpZXciLCJpc0VtcHR5Iiwic2l6ZSIsImRpZmYiLCJwcmV2aW91cyIsIkRpZmZTZXF1ZW5jZSIsImRpZmZNYXBzIiwiYm90aCIsImJpbmQiLCJkaWZmRG9jdW1lbnQiLCJyaWdodE9ubHkiLCJpZCIsIm5vd0RWIiwiYWRkZWQiLCJsZWZ0T25seSIsInByZXZEViIsInJlbW92ZWQiLCJmaWVsZHMiLCJkaWZmT2JqZWN0cyIsInByZXYiLCJub3ciLCJjaGFuZ2VkIiwiZG9jVmlldyIsImFkZCIsImNoYW5nZWRSZXN1bHQiLCJFcnJvciIsImVyciIsIlNlc3Npb24iLCJ2ZXJzaW9uIiwib3B0aW9ucyIsIlJhbmRvbSIsImluaXRpYWxpemVkIiwiaW5RdWV1ZSIsIk1ldGVvciIsIl9Eb3VibGVFbmRlZFF1ZXVlIiwiYmxvY2tlZCIsIndvcmtlclJ1bm5pbmciLCJfbmFtZWRTdWJzIiwiX3VuaXZlcnNhbFN1YnMiLCJ1c2VySWQiLCJjb2xsZWN0aW9uVmlld3MiLCJfaXNTZW5kaW5nIiwiX2RvbnRTdGFydE5ld1VuaXZlcnNhbFN1YnMiLCJfcGVuZGluZ1JlYWR5IiwiX2Nsb3NlQ2FsbGJhY2tzIiwiX3NvY2tldFVybCIsIl9yZXNwb25kVG9QaW5ncyIsInJlc3BvbmRUb1BpbmdzIiwiY29ubmVjdGlvbkhhbmRsZSIsImNsb3NlIiwib25DbG9zZSIsImZuIiwiY2IiLCJiaW5kRW52aXJvbm1lbnQiLCJkZWZlciIsImNsaWVudEFkZHJlc3MiLCJfY2xpZW50QWRkcmVzcyIsImh0dHBIZWFkZXJzIiwiaGVhZGVycyIsIm1zZyIsInNlc3Npb24iLCJzdGFydFVuaXZlcnNhbFN1YnMiLCJydW4iLCJoZWFydGJlYXRJbnRlcnZhbCIsImhlYXJ0YmVhdCIsIkREUENvbW1vbiIsIkhlYXJ0YmVhdCIsImhlYXJ0YmVhdFRpbWVvdXQiLCJvblRpbWVvdXQiLCJzZW5kUGluZyIsInN0YXJ0IiwiUGFja2FnZSIsIkZhY3RzIiwiaW5jcmVtZW50U2VydmVyRmFjdCIsInNlbmRSZWFkeSIsInN1YnNjcmlwdGlvbklkcyIsInN1YnMiLCJzdWJzY3JpcHRpb25JZCIsInNlbmRBZGRlZCIsImNvbGxlY3Rpb24iLCJzZW5kQ2hhbmdlZCIsInNlbmRSZW1vdmVkIiwiZ2V0U2VuZENhbGxiYWNrcyIsImdldENvbGxlY3Rpb25WaWV3IiwidmlldyIsImhhbmRsZXJzIiwidW5pdmVyc2FsX3B1Ymxpc2hfaGFuZGxlcnMiLCJoYW5kbGVyIiwiX3N0YXJ0U3Vic2NyaXB0aW9uIiwic3RvcCIsIl9tZXRlb3JTZXNzaW9uIiwiX2RlYWN0aXZhdGVBbGxTdWJzY3JpcHRpb25zIiwiX3JlbW92ZVNlc3Npb24iLCJfcHJpbnRTZW50RERQIiwiX2RlYnVnIiwic3RyaW5naWZ5RERQIiwic2VuZEVycm9yIiwicmVhc29uIiwib2ZmZW5kaW5nTWVzc2FnZSIsInByb2Nlc3NNZXNzYWdlIiwibXNnX2luIiwibWVzc2FnZVJlY2VpdmVkIiwicHJvY2Vzc05leHQiLCJzaGlmdCIsInVuYmxvY2siLCJvbk1lc3NhZ2VIb29rIiwicHJvdG9jb2xfaGFuZGxlcnMiLCJjYWxsIiwic3ViIiwibmFtZSIsInBhcmFtcyIsIkFycmF5IiwicHVibGlzaF9oYW5kbGVycyIsImVycm9yIiwiRERQUmF0ZUxpbWl0ZXIiLCJyYXRlTGltaXRlcklucHV0IiwidHlwZSIsImNvbm5lY3Rpb25JZCIsIl9pbmNyZW1lbnQiLCJyYXRlTGltaXRSZXN1bHQiLCJfY2hlY2siLCJhbGxvd2VkIiwiZ2V0RXJyb3JNZXNzYWdlIiwidGltZVRvUmVzZXQiLCJ1bnN1YiIsIl9zdG9wU3Vic2NyaXB0aW9uIiwibWV0aG9kIiwicmFuZG9tU2VlZCIsImZlbmNlIiwiX1dyaXRlRmVuY2UiLCJvbkFsbENvbW1pdHRlZCIsInJldGlyZSIsIm1ldGhvZHMiLCJtZXRob2RfaGFuZGxlcnMiLCJhcm0iLCJzZXRVc2VySWQiLCJfc2V0VXNlcklkIiwiaW52b2NhdGlvbiIsIk1ldGhvZEludm9jYXRpb24iLCJpc1NpbXVsYXRpb24iLCJwcm9taXNlIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJfQ3VycmVudFdyaXRlRmVuY2UiLCJ3aXRoVmFsdWUiLCJERFAiLCJfQ3VycmVudE1ldGhvZEludm9jYXRpb24iLCJtYXliZUF1ZGl0QXJndW1lbnRDaGVja3MiLCJmaW5pc2giLCJwYXlsb2FkIiwidGhlbiIsInJlc3VsdCIsImV4Y2VwdGlvbiIsIndyYXBJbnRlcm5hbEV4Y2VwdGlvbiIsIl9lYWNoU3ViIiwiZiIsIl9kaWZmQ29sbGVjdGlvblZpZXdzIiwiYmVmb3JlQ1ZzIiwibGVmdFZhbHVlIiwicmlnaHRWYWx1ZSIsImRvYyIsIl9kZWFjdGl2YXRlIiwib2xkTmFtZWRTdWJzIiwibmV3U3ViIiwiX3JlY3JlYXRlIiwiX3J1bkhhbmRsZXIiLCJfbm9ZaWVsZHNBbGxvd2VkIiwic3ViSWQiLCJTdWJzY3JpcHRpb24iLCJzdWJOYW1lIiwibWF5YmVTdWIiLCJfbmFtZSIsIl9yZW1vdmVBbGxEb2N1bWVudHMiLCJyZXNwb25zZSIsImh0dHBGb3J3YXJkZWRDb3VudCIsInBhcnNlSW50IiwicmVtb3RlQWRkcmVzcyIsImZvcndhcmRlZEZvciIsImlzU3RyaW5nIiwidHJpbSIsInNwbGl0IiwiX2hhbmRsZXIiLCJfc3Vic2NyaXB0aW9uSWQiLCJfcGFyYW1zIiwiX3N1YnNjcmlwdGlvbkhhbmRsZSIsIl9kZWFjdGl2YXRlZCIsIl9zdG9wQ2FsbGJhY2tzIiwiX2RvY3VtZW50cyIsIl9yZWFkeSIsIl9pZEZpbHRlciIsImlkU3RyaW5naWZ5IiwiTW9uZ29JRCIsImlkUGFyc2UiLCJyZXMiLCJfQ3VycmVudFB1YmxpY2F0aW9uSW52b2NhdGlvbiIsImUiLCJfaXNEZWFjdGl2YXRlZCIsIl9wdWJsaXNoSGFuZGxlclJlc3VsdCIsImlzQ3Vyc29yIiwiYyIsIl9wdWJsaXNoQ3Vyc29yIiwicmVhZHkiLCJpc0FycmF5IiwiYWxsIiwiY29sbGVjdGlvbk5hbWVzIiwiX2dldENvbGxlY3Rpb25OYW1lIiwiY3VyIiwiX2NhbGxTdG9wQ2FsbGJhY2tzIiwiY29sbGVjdGlvbkRvY3MiLCJzdHJJZCIsIm9uU3RvcCIsImlkcyIsIlNlcnZlciIsImRlZmF1bHRzIiwib25Db25uZWN0aW9uSG9vayIsIkhvb2siLCJkZWJ1Z1ByaW50RXhjZXB0aW9ucyIsInNlc3Npb25zIiwic3RyZWFtX3NlcnZlciIsInJhd19tc2ciLCJfcHJpbnRSZWNlaXZlZEREUCIsInBhcnNlRERQIiwiX2hhbmRsZUNvbm5lY3QiLCJvbkNvbm5lY3Rpb24iLCJvbk1lc3NhZ2UiLCJzdXBwb3J0IiwiY29udGFpbnMiLCJTVVBQT1JURURfRERQX1ZFUlNJT05TIiwiY2FsY3VsYXRlVmVyc2lvbiIsInB1Ymxpc2giLCJpc09iamVjdCIsImF1dG9wdWJsaXNoIiwiaXNfYXV0byIsIndhcm5lZF9hYm91dF9hdXRvcHVibGlzaCIsImZ1bmMiLCJwb3AiLCJjYWxsQXN5bmMiLCJhcHBseUFzeW5jIiwiYXdhaXQiLCJjdXJyZW50TWV0aG9kSW52b2NhdGlvbiIsImN1cnJlbnRQdWJsaWNhdGlvbkludm9jYXRpb24iLCJtYWtlUnBjU2VlZCIsIl91cmxGb3JTZXNzaW9uIiwic2Vzc2lvbklkIiwiY2xpZW50U3VwcG9ydGVkVmVyc2lvbnMiLCJzZXJ2ZXJTdXBwb3J0ZWRWZXJzaW9ucyIsImNvcnJlY3RWZXJzaW9uIiwiX2NhbGN1bGF0ZVZlcnNpb24iLCJjb250ZXh0IiwiaXNDbGllbnRTYWZlIiwib3JpZ2luYWxNZXNzYWdlIiwibWVzc2FnZSIsImRldGFpbHMiLCJfZXhwZWN0ZWRCeVRlc3QiLCJzdGFjayIsInNhbml0aXplZEVycm9yIiwiZGVzY3JpcHRpb24iLCJNYXRjaCIsIl9mYWlsSWZBcmd1bWVudHNBcmVOb3RBbGxDaGVja2VkIiwiRnV0dXJlIiwiYXJtZWQiLCJmaXJlZCIsInJldGlyZWQiLCJvdXRzdGFuZGluZ193cml0ZXMiLCJiZWZvcmVfZmlyZV9jYWxsYmFja3MiLCJjb21wbGV0aW9uX2NhbGxiYWNrcyIsIkVudmlyb25tZW50VmFyaWFibGUiLCJiZWdpbldyaXRlIiwiY29tbWl0dGVkIiwiX21heWJlRmlyZSIsIm9uQmVmb3JlRmlyZSIsImFybUFuZFdhaXQiLCJmdXR1cmUiLCJ3YWl0IiwiaW52b2tlQ2FsbGJhY2siLCJfQ3Jvc3NiYXIiLCJuZXh0SWQiLCJsaXN0ZW5lcnNCeUNvbGxlY3Rpb24iLCJsaXN0ZW5lcnNCeUNvbGxlY3Rpb25Db3VudCIsImZhY3RQYWNrYWdlIiwiZmFjdE5hbWUiLCJfY29sbGVjdGlvbkZvck1lc3NhZ2UiLCJsaXN0ZW4iLCJ0cmlnZ2VyIiwicmVjb3JkIiwiZmlyZSIsIm5vdGlmaWNhdGlvbiIsImxpc3RlbmVyc0ZvckNvbGxlY3Rpb24iLCJjYWxsYmFja0lkcyIsImwiLCJfbWF0Y2hlcyIsIk9iamVjdElEIiwidHJpZ2dlclZhbHVlIiwiX0ludmFsaWRhdGlvbkNyb3NzYmFyIiwiRERQX0RFRkFVTFRfQ09OTkVDVElPTl9VUkwiLCJyZWZyZXNoIiwiZGVmYXVsdF9zZXJ2ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUlBLEdBQUcsR0FBR0MsR0FBRyxDQUFDQyxPQUFKLENBQVksS0FBWixDQUFWLEMsQ0FFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxJQUFJQyxtQkFBbUIsR0FBR0MsQ0FBQyxDQUFDQyxJQUFGLENBQU8sWUFBWTtBQUMzQyxNQUFJQyxVQUFVLEdBQUcsRUFBakI7QUFFQSxNQUFJQywwQkFBMEIsR0FBR0MsT0FBTyxDQUFDQyxHQUFSLENBQVlDLDRCQUFaLEdBQzdCQyxJQUFJLENBQUNDLEtBQUwsQ0FBV0osT0FBTyxDQUFDQyxHQUFSLENBQVlDLDRCQUF2QixDQUQ2QixHQUMwQixFQUQzRDs7QUFFQSxNQUFJSCwwQkFBSixFQUFnQztBQUM5QkQsY0FBVSxDQUFDTyxJQUFYLENBQWdCWixHQUFHLENBQUNDLE9BQUosQ0FBWSxvQkFBWixFQUFrQ1ksU0FBbEMsQ0FDZFAsMEJBRGMsQ0FBaEI7QUFHRDs7QUFFRCxTQUFPRCxVQUFQO0FBQ0QsQ0FaeUIsQ0FBMUI7O0FBY0EsSUFBSVMsVUFBVSxHQUFHQyx5QkFBeUIsQ0FBQ0Msb0JBQTFCLElBQWtELEVBQW5FOztBQUVBQyxZQUFZLEdBQUcsWUFBWTtBQUN6QixNQUFJQyxJQUFJLEdBQUcsSUFBWDtBQUNBQSxNQUFJLENBQUNDLHNCQUFMLEdBQThCLEVBQTlCO0FBQ0FELE1BQUksQ0FBQ0UsWUFBTCxHQUFvQixFQUFwQixDQUh5QixDQUt6QjtBQUNBOztBQUNBRixNQUFJLENBQUNHLE1BQUwsR0FBY1AsVUFBVSxHQUFHLFNBQTNCO0FBQ0FRLGFBQVcsQ0FBQ0MsT0FBWixDQUFvQkwsSUFBSSxDQUFDRyxNQUFMLEdBQWMsR0FBbEMsRUFBdUMsU0FBdkMsRUFSeUIsQ0FVekI7O0FBQ0EsTUFBSUcsTUFBTSxHQUFHeEIsR0FBRyxDQUFDQyxPQUFKLENBQVksUUFBWixDQUFiOztBQUNBLE1BQUl3QixhQUFhLEdBQUc7QUFDbEJKLFVBQU0sRUFBRUgsSUFBSSxDQUFDRyxNQURLO0FBRWxCSyxPQUFHLEVBQUUsWUFBWSxDQUFHLENBRkY7QUFHbEI7QUFDQTtBQUNBQyxtQkFBZSxFQUFFLEtBTEM7QUFNbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0FDLG9CQUFnQixFQUFFLEtBQUssSUFaTDtBQWFsQjtBQUNBO0FBQ0FDLGdCQUFZLEVBQUUsQ0FBQyxDQUFDdEIsT0FBTyxDQUFDQyxHQUFSLENBQVlzQixtQkFmVjtBQWdCbEI7QUFDQTtBQUNBO0FBQ0FDLGNBQVUsRUFBRSxDQUFDLENBQUN4QixPQUFPLENBQUNDLEdBQVIsQ0FBWXdCO0FBbkJSLEdBQXBCLENBWnlCLENBa0N6QjtBQUNBO0FBQ0E7QUFDQTs7QUFDQSxNQUFJekIsT0FBTyxDQUFDQyxHQUFSLENBQVl5QixrQkFBaEIsRUFBb0M7QUFDbENSLGlCQUFhLENBQUNTLFNBQWQsR0FBMEIsS0FBMUI7QUFDRCxHQUZELE1BRU87QUFDTFQsaUJBQWEsQ0FBQ1UsbUJBQWQsR0FBb0M7QUFDbEM5QixnQkFBVSxFQUFFSCxtQkFBbUI7QUFERyxLQUFwQztBQUdEOztBQUVEZ0IsTUFBSSxDQUFDa0IsTUFBTCxHQUFjWixNQUFNLENBQUNhLFlBQVAsQ0FBb0JaLGFBQXBCLENBQWQsQ0E5Q3lCLENBZ0R6QjtBQUNBO0FBQ0E7QUFDQTs7QUFDQWEsUUFBTSxDQUFDQyxVQUFQLENBQWtCQyxjQUFsQixDQUNFLFNBREYsRUFDYUYsTUFBTSxDQUFDRyxpQ0FEcEI7QUFFQXZCLE1BQUksQ0FBQ2tCLE1BQUwsQ0FBWU0sZUFBWixDQUE0QkosTUFBTSxDQUFDQyxVQUFuQztBQUNBRCxRQUFNLENBQUNDLFVBQVAsQ0FBa0JJLFdBQWxCLENBQ0UsU0FERixFQUNhTCxNQUFNLENBQUNHLGlDQURwQixFQXZEeUIsQ0EwRHpCOztBQUNBdkIsTUFBSSxDQUFDMEIsMEJBQUw7O0FBRUExQixNQUFJLENBQUNrQixNQUFMLENBQVlTLEVBQVosQ0FBZSxZQUFmLEVBQTZCLFVBQVVDLE1BQVYsRUFBa0I7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQUEsVUFBTSxDQUFDQyxtQkFBUCxHQUE2QixVQUFVQyxPQUFWLEVBQW1CO0FBQzlDLFVBQUksQ0FBQ0YsTUFBTSxDQUFDRyxRQUFQLEtBQW9CLFdBQXBCLElBQ0hILE1BQU0sQ0FBQ0csUUFBUCxLQUFvQixlQURsQixLQUVDSCxNQUFNLENBQUNJLFFBQVAsQ0FBZ0JDLElBRnJCLEVBRTJCO0FBQ3pCTCxjQUFNLENBQUNJLFFBQVAsQ0FBZ0JDLElBQWhCLENBQXFCQyxVQUFyQixDQUFnQ0MsVUFBaEMsQ0FBMkNMLE9BQTNDO0FBQ0Q7QUFDRixLQU5EOztBQU9BRixVQUFNLENBQUNDLG1CQUFQLENBQTJCLEtBQUssSUFBaEM7O0FBRUFELFVBQU0sQ0FBQ1EsSUFBUCxHQUFjLFVBQVVDLElBQVYsRUFBZ0I7QUFDNUJULFlBQU0sQ0FBQ1UsS0FBUCxDQUFhRCxJQUFiO0FBQ0QsS0FGRDs7QUFHQVQsVUFBTSxDQUFDRCxFQUFQLENBQVUsT0FBVixFQUFtQixZQUFZO0FBQzdCM0IsVUFBSSxDQUFDRSxZQUFMLEdBQW9CakIsQ0FBQyxDQUFDc0QsT0FBRixDQUFVdkMsSUFBSSxDQUFDRSxZQUFmLEVBQTZCMEIsTUFBN0IsQ0FBcEI7QUFDRCxLQUZEO0FBR0E1QixRQUFJLENBQUNFLFlBQUwsQ0FBa0JSLElBQWxCLENBQXVCa0MsTUFBdkIsRUExQjZDLENBNEI3QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBQSxVQUFNLENBQUNRLElBQVAsQ0FBWTVDLElBQUksQ0FBQ2dELFNBQUwsQ0FBZTtBQUFFQyxlQUFTLEVBQUU7QUFBYixLQUFmLENBQVosRUFqQzZDLENBbUM3QztBQUNBOztBQUNBeEQsS0FBQyxDQUFDeUQsSUFBRixDQUFPMUMsSUFBSSxDQUFDQyxzQkFBWixFQUFvQyxVQUFVMEMsUUFBVixFQUFvQjtBQUN0REEsY0FBUSxDQUFDZixNQUFELENBQVI7QUFDRCxLQUZEO0FBR0QsR0F4Q0Q7QUEwQ0QsQ0F2R0Q7O0FBeUdBM0MsQ0FBQyxDQUFDMkQsTUFBRixDQUFTN0MsWUFBWSxDQUFDOEMsU0FBdEIsRUFBaUM7QUFDL0I7QUFDQTtBQUNBQyxVQUFRLEVBQUUsVUFBVUgsUUFBVixFQUFvQjtBQUM1QixRQUFJM0MsSUFBSSxHQUFHLElBQVg7QUFDQUEsUUFBSSxDQUFDQyxzQkFBTCxDQUE0QlAsSUFBNUIsQ0FBaUNpRCxRQUFqQzs7QUFDQTFELEtBQUMsQ0FBQ3lELElBQUYsQ0FBTzFDLElBQUksQ0FBQytDLFdBQUwsRUFBUCxFQUEyQixVQUFVbkIsTUFBVixFQUFrQjtBQUMzQ2UsY0FBUSxDQUFDZixNQUFELENBQVI7QUFDRCxLQUZEO0FBR0QsR0FUOEI7QUFXL0I7QUFDQW1CLGFBQVcsRUFBRSxZQUFZO0FBQ3ZCLFFBQUkvQyxJQUFJLEdBQUcsSUFBWDtBQUNBLFdBQU9mLENBQUMsQ0FBQytELE1BQUYsQ0FBU2hELElBQUksQ0FBQ0UsWUFBZCxDQUFQO0FBQ0QsR0FmOEI7QUFpQi9CO0FBQ0E7QUFDQXdCLDRCQUEwQixFQUFFLFlBQVk7QUFDdEMsUUFBSTFCLElBQUksR0FBRyxJQUFYLENBRHNDLENBRXRDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0FmLEtBQUMsQ0FBQ3lELElBQUYsQ0FBTyxDQUFDLFNBQUQsRUFBWSxTQUFaLENBQVAsRUFBK0IsVUFBVU8sS0FBVixFQUFpQjtBQUM5QyxVQUFJNUIsVUFBVSxHQUFHRCxNQUFNLENBQUNDLFVBQXhCO0FBQ0EsVUFBSTZCLHNCQUFzQixHQUFHN0IsVUFBVSxDQUFDOEIsU0FBWCxDQUFxQkYsS0FBckIsRUFBNEJHLEtBQTVCLENBQWtDLENBQWxDLENBQTdCO0FBQ0EvQixnQkFBVSxDQUFDZ0Msa0JBQVgsQ0FBOEJKLEtBQTlCLEVBSDhDLENBSzlDO0FBQ0E7O0FBQ0EsVUFBSUssV0FBVyxHQUFHLFVBQVVDO0FBQVE7QUFBbEIsUUFBd0M7QUFDeEQ7QUFDQSxZQUFJQyxJQUFJLEdBQUdDLFNBQVgsQ0FGd0QsQ0FJeEQ7QUFDQTs7QUFDQSxZQUFJQyxTQUFTLEdBQUc3RSxHQUFHLENBQUNZLEtBQUosQ0FBVThELE9BQU8sQ0FBQzFFLEdBQWxCLENBQWhCOztBQUNBLFlBQUk2RSxTQUFTLENBQUNDLFFBQVYsS0FBdUIvRCxVQUFVLEdBQUcsWUFBcEMsSUFDRjhELFNBQVMsQ0FBQ0MsUUFBVixLQUF1Qi9ELFVBQVUsR0FBRyxhQUR0QyxFQUNxRDtBQUNuRDhELG1CQUFTLENBQUNDLFFBQVYsR0FBcUIzRCxJQUFJLENBQUNHLE1BQUwsR0FBYyxZQUFuQztBQUNBb0QsaUJBQU8sQ0FBQzFFLEdBQVIsR0FBY0EsR0FBRyxDQUFDK0UsTUFBSixDQUFXRixTQUFYLENBQWQ7QUFDRDs7QUFDRHpFLFNBQUMsQ0FBQ3lELElBQUYsQ0FBT1Esc0JBQVAsRUFBK0IsVUFBVVcsV0FBVixFQUF1QjtBQUNwREEscUJBQVcsQ0FBQ0MsS0FBWixDQUFrQnpDLFVBQWxCLEVBQThCbUMsSUFBOUI7QUFDRCxTQUZEO0FBR0QsT0FmRDs7QUFnQkFuQyxnQkFBVSxDQUFDSSxXQUFYLENBQXVCd0IsS0FBdkIsRUFBOEJLLFdBQTlCO0FBQ0QsS0F4QkQ7QUF5QkQ7QUFuRDhCLENBQWpDLEU7Ozs7Ozs7Ozs7O0FDdElBUyxTQUFTLEdBQUcsRUFBWjs7QUFFQSxJQUFJQyxLQUFLLEdBQUdsRixHQUFHLENBQUNDLE9BQUosQ0FBWSxRQUFaLENBQVosQyxDQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7O0FBQ0EsSUFBSWtGLG1CQUFtQixHQUFHLFlBQVk7QUFDcEMsTUFBSWpFLElBQUksR0FBRyxJQUFYO0FBQ0FBLE1BQUksQ0FBQ2tFLFFBQUwsR0FBZ0IsSUFBSUMsR0FBSixFQUFoQixDQUZvQyxDQUVUOztBQUMzQm5FLE1BQUksQ0FBQ29FLFNBQUwsR0FBaUIsSUFBSUMsR0FBSixFQUFqQixDQUhvQyxDQUdSO0FBQzdCLENBSkQ7O0FBTUFOLFNBQVMsQ0FBQ08sb0JBQVYsR0FBaUNMLG1CQUFqQzs7QUFHQWhGLENBQUMsQ0FBQzJELE1BQUYsQ0FBU3FCLG1CQUFtQixDQUFDcEIsU0FBN0IsRUFBd0M7QUFFdEMwQixXQUFTLEVBQUUsWUFBWTtBQUNyQixRQUFJdkUsSUFBSSxHQUFHLElBQVg7QUFDQSxRQUFJd0UsR0FBRyxHQUFHLEVBQVY7QUFDQXhFLFFBQUksQ0FBQ29FLFNBQUwsQ0FBZUssT0FBZixDQUF1QixVQUFVQyxjQUFWLEVBQTBCQyxHQUExQixFQUErQjtBQUNwREgsU0FBRyxDQUFDRyxHQUFELENBQUgsR0FBV0QsY0FBYyxDQUFDLENBQUQsQ0FBZCxDQUFrQkUsS0FBN0I7QUFDRCxLQUZEO0FBR0EsV0FBT0osR0FBUDtBQUNELEdBVHFDO0FBV3RDSyxZQUFVLEVBQUUsVUFBVUMsa0JBQVYsRUFBOEJILEdBQTlCLEVBQW1DSSxlQUFuQyxFQUFvRDtBQUM5RCxRQUFJL0UsSUFBSSxHQUFHLElBQVgsQ0FEOEQsQ0FFOUQ7O0FBQ0EsUUFBSTJFLEdBQUcsS0FBSyxLQUFaLEVBQ0U7QUFDRixRQUFJRCxjQUFjLEdBQUcxRSxJQUFJLENBQUNvRSxTQUFMLENBQWVZLEdBQWYsQ0FBbUJMLEdBQW5CLENBQXJCLENBTDhELENBTzlEO0FBQ0E7O0FBQ0EsUUFBSSxDQUFDRCxjQUFMLEVBQ0U7QUFFRixRQUFJTyxZQUFZLEdBQUdDLFNBQW5COztBQUNBLFNBQUssSUFBSUMsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR1QsY0FBYyxDQUFDVSxNQUFuQyxFQUEyQ0QsQ0FBQyxFQUE1QyxFQUFnRDtBQUM5QyxVQUFJRSxVQUFVLEdBQUdYLGNBQWMsQ0FBQ1MsQ0FBRCxDQUEvQjs7QUFDQSxVQUFJRSxVQUFVLENBQUNQLGtCQUFYLEtBQWtDQSxrQkFBdEMsRUFBMEQ7QUFDeEQ7QUFDQTtBQUNBLFlBQUlLLENBQUMsS0FBSyxDQUFWLEVBQ0VGLFlBQVksR0FBR0ksVUFBVSxDQUFDVCxLQUExQjtBQUNGRixzQkFBYyxDQUFDWSxNQUFmLENBQXNCSCxDQUF0QixFQUF5QixDQUF6QjtBQUNBO0FBQ0Q7QUFDRjs7QUFDRCxRQUFJVCxjQUFjLENBQUNVLE1BQWYsS0FBMEIsQ0FBOUIsRUFBaUM7QUFDL0JwRixVQUFJLENBQUNvRSxTQUFMLENBQWVtQixNQUFmLENBQXNCWixHQUF0QjtBQUNBSSxxQkFBZSxDQUFDSixHQUFELENBQWYsR0FBdUJPLFNBQXZCO0FBQ0QsS0FIRCxNQUdPLElBQUlELFlBQVksS0FBS0MsU0FBakIsSUFDQSxDQUFDTSxLQUFLLENBQUNDLE1BQU4sQ0FBYVIsWUFBYixFQUEyQlAsY0FBYyxDQUFDLENBQUQsQ0FBZCxDQUFrQkUsS0FBN0MsQ0FETCxFQUMwRDtBQUMvREcscUJBQWUsQ0FBQ0osR0FBRCxDQUFmLEdBQXVCRCxjQUFjLENBQUMsQ0FBRCxDQUFkLENBQWtCRSxLQUF6QztBQUNEO0FBQ0YsR0ExQ3FDO0FBNEN0Q2MsYUFBVyxFQUFFLFVBQVVaLGtCQUFWLEVBQThCSCxHQUE5QixFQUFtQ0MsS0FBbkMsRUFDVUcsZUFEVixFQUMyQlksS0FEM0IsRUFDa0M7QUFDN0MsUUFBSTNGLElBQUksR0FBRyxJQUFYLENBRDZDLENBRTdDOztBQUNBLFFBQUkyRSxHQUFHLEtBQUssS0FBWixFQUNFLE9BSjJDLENBTTdDOztBQUNBQyxTQUFLLEdBQUdZLEtBQUssQ0FBQ0ksS0FBTixDQUFZaEIsS0FBWixDQUFSOztBQUVBLFFBQUksQ0FBQzVFLElBQUksQ0FBQ29FLFNBQUwsQ0FBZXlCLEdBQWYsQ0FBbUJsQixHQUFuQixDQUFMLEVBQThCO0FBQzVCM0UsVUFBSSxDQUFDb0UsU0FBTCxDQUFlMEIsR0FBZixDQUFtQm5CLEdBQW5CLEVBQXdCLENBQUM7QUFBQ0csMEJBQWtCLEVBQUVBLGtCQUFyQjtBQUNDRixhQUFLLEVBQUVBO0FBRFIsT0FBRCxDQUF4QjtBQUVBRyxxQkFBZSxDQUFDSixHQUFELENBQWYsR0FBdUJDLEtBQXZCO0FBQ0E7QUFDRDs7QUFDRCxRQUFJRixjQUFjLEdBQUcxRSxJQUFJLENBQUNvRSxTQUFMLENBQWVZLEdBQWYsQ0FBbUJMLEdBQW5CLENBQXJCO0FBQ0EsUUFBSW9CLEdBQUo7O0FBQ0EsUUFBSSxDQUFDSixLQUFMLEVBQVk7QUFDVkksU0FBRyxHQUFHckIsY0FBYyxDQUFDc0IsSUFBZixDQUFvQixVQUFVWCxVQUFWLEVBQXNCO0FBQzVDLGVBQU9BLFVBQVUsQ0FBQ1Asa0JBQVgsS0FBa0NBLGtCQUF6QztBQUNILE9BRkssQ0FBTjtBQUdEOztBQUVELFFBQUlpQixHQUFKLEVBQVM7QUFDUCxVQUFJQSxHQUFHLEtBQUtyQixjQUFjLENBQUMsQ0FBRCxDQUF0QixJQUE2QixDQUFDYyxLQUFLLENBQUNDLE1BQU4sQ0FBYWIsS0FBYixFQUFvQm1CLEdBQUcsQ0FBQ25CLEtBQXhCLENBQWxDLEVBQWtFO0FBQ2hFO0FBQ0FHLHVCQUFlLENBQUNKLEdBQUQsQ0FBZixHQUF1QkMsS0FBdkI7QUFDRDs7QUFDRG1CLFNBQUcsQ0FBQ25CLEtBQUosR0FBWUEsS0FBWjtBQUNELEtBTkQsTUFNTztBQUNMO0FBQ0FGLG9CQUFjLENBQUNoRixJQUFmLENBQW9CO0FBQUNvRiwwQkFBa0IsRUFBRUEsa0JBQXJCO0FBQXlDRixhQUFLLEVBQUVBO0FBQWhELE9BQXBCO0FBQ0Q7QUFFRjtBQS9FcUMsQ0FBeEM7QUFrRkE7Ozs7Ozs7O0FBTUEsSUFBSXFCLHFCQUFxQixHQUFHLFVBQVVDLGNBQVYsRUFBMEJDLGdCQUExQixFQUE0QztBQUN0RSxNQUFJbkcsSUFBSSxHQUFHLElBQVg7QUFDQUEsTUFBSSxDQUFDa0csY0FBTCxHQUFzQkEsY0FBdEI7QUFDQWxHLE1BQUksQ0FBQ29HLFNBQUwsR0FBaUIsSUFBSS9CLEdBQUosRUFBakI7QUFDQXJFLE1BQUksQ0FBQ3FHLFNBQUwsR0FBaUJGLGdCQUFqQjtBQUNELENBTEQ7O0FBT0FwQyxTQUFTLENBQUN1QyxzQkFBVixHQUFtQ0wscUJBQW5DOztBQUdBaEgsQ0FBQyxDQUFDMkQsTUFBRixDQUFTcUQscUJBQXFCLENBQUNwRCxTQUEvQixFQUEwQztBQUV4QzBELFNBQU8sRUFBRSxZQUFZO0FBQ25CLFFBQUl2RyxJQUFJLEdBQUcsSUFBWDtBQUNBLFdBQU9BLElBQUksQ0FBQ29HLFNBQUwsQ0FBZUksSUFBZixLQUF3QixDQUEvQjtBQUNELEdBTHVDO0FBT3hDQyxNQUFJLEVBQUUsVUFBVUMsUUFBVixFQUFvQjtBQUN4QixRQUFJMUcsSUFBSSxHQUFHLElBQVg7QUFDQTJHLGdCQUFZLENBQUNDLFFBQWIsQ0FBc0JGLFFBQVEsQ0FBQ04sU0FBL0IsRUFBMENwRyxJQUFJLENBQUNvRyxTQUEvQyxFQUEwRDtBQUN4RFMsVUFBSSxFQUFFNUgsQ0FBQyxDQUFDNkgsSUFBRixDQUFPOUcsSUFBSSxDQUFDK0csWUFBWixFQUEwQi9HLElBQTFCLENBRGtEO0FBR3hEZ0gsZUFBUyxFQUFFLFVBQVVDLEVBQVYsRUFBY0MsS0FBZCxFQUFxQjtBQUM5QmxILFlBQUksQ0FBQ3FHLFNBQUwsQ0FBZWMsS0FBZixDQUFxQm5ILElBQUksQ0FBQ2tHLGNBQTFCLEVBQTBDZSxFQUExQyxFQUE4Q0MsS0FBSyxDQUFDM0MsU0FBTixFQUE5QztBQUNELE9BTHVEO0FBT3hENkMsY0FBUSxFQUFFLFVBQVVILEVBQVYsRUFBY0ksTUFBZCxFQUFzQjtBQUM5QnJILFlBQUksQ0FBQ3FHLFNBQUwsQ0FBZWlCLE9BQWYsQ0FBdUJ0SCxJQUFJLENBQUNrRyxjQUE1QixFQUE0Q2UsRUFBNUM7QUFDRDtBQVR1RCxLQUExRDtBQVdELEdBcEJ1QztBQXNCeENGLGNBQVksRUFBRSxVQUFVRSxFQUFWLEVBQWNJLE1BQWQsRUFBc0JILEtBQXRCLEVBQTZCO0FBQ3pDLFFBQUlsSCxJQUFJLEdBQUcsSUFBWDtBQUNBLFFBQUl1SCxNQUFNLEdBQUcsRUFBYjtBQUNBWixnQkFBWSxDQUFDYSxXQUFiLENBQXlCSCxNQUFNLENBQUM5QyxTQUFQLEVBQXpCLEVBQTZDMkMsS0FBSyxDQUFDM0MsU0FBTixFQUE3QyxFQUFnRTtBQUM5RHNDLFVBQUksRUFBRSxVQUFVbEMsR0FBVixFQUFlOEMsSUFBZixFQUFxQkMsR0FBckIsRUFBMEI7QUFDOUIsWUFBSSxDQUFDbEMsS0FBSyxDQUFDQyxNQUFOLENBQWFnQyxJQUFiLEVBQW1CQyxHQUFuQixDQUFMLEVBQ0VILE1BQU0sQ0FBQzVDLEdBQUQsQ0FBTixHQUFjK0MsR0FBZDtBQUNILE9BSjZEO0FBSzlEVixlQUFTLEVBQUUsVUFBVXJDLEdBQVYsRUFBZStDLEdBQWYsRUFBb0I7QUFDN0JILGNBQU0sQ0FBQzVDLEdBQUQsQ0FBTixHQUFjK0MsR0FBZDtBQUNELE9BUDZEO0FBUTlETixjQUFRLEVBQUUsVUFBU3pDLEdBQVQsRUFBYzhDLElBQWQsRUFBb0I7QUFDNUJGLGNBQU0sQ0FBQzVDLEdBQUQsQ0FBTixHQUFjTyxTQUFkO0FBQ0Q7QUFWNkQsS0FBaEU7QUFZQWxGLFFBQUksQ0FBQ3FHLFNBQUwsQ0FBZXNCLE9BQWYsQ0FBdUIzSCxJQUFJLENBQUNrRyxjQUE1QixFQUE0Q2UsRUFBNUMsRUFBZ0RNLE1BQWhEO0FBQ0QsR0F0Q3VDO0FBd0N4Q0osT0FBSyxFQUFFLFVBQVVyQyxrQkFBVixFQUE4Qm1DLEVBQTlCLEVBQWtDTSxNQUFsQyxFQUEwQztBQUMvQyxRQUFJdkgsSUFBSSxHQUFHLElBQVg7QUFDQSxRQUFJNEgsT0FBTyxHQUFHNUgsSUFBSSxDQUFDb0csU0FBTCxDQUFlcEIsR0FBZixDQUFtQmlDLEVBQW5CLENBQWQ7QUFDQSxRQUFJRSxLQUFLLEdBQUcsS0FBWjs7QUFDQSxRQUFJLENBQUNTLE9BQUwsRUFBYztBQUNaVCxXQUFLLEdBQUcsSUFBUjtBQUNBUyxhQUFPLEdBQUcsSUFBSTNELG1CQUFKLEVBQVY7QUFDQWpFLFVBQUksQ0FBQ29HLFNBQUwsQ0FBZU4sR0FBZixDQUFtQm1CLEVBQW5CLEVBQXVCVyxPQUF2QjtBQUNEOztBQUNEQSxXQUFPLENBQUMxRCxRQUFSLENBQWlCMkQsR0FBakIsQ0FBcUIvQyxrQkFBckI7QUFDQSxRQUFJQyxlQUFlLEdBQUcsRUFBdEI7O0FBQ0E5RixLQUFDLENBQUN5RCxJQUFGLENBQU82RSxNQUFQLEVBQWUsVUFBVTNDLEtBQVYsRUFBaUJELEdBQWpCLEVBQXNCO0FBQ25DaUQsYUFBTyxDQUFDbEMsV0FBUixDQUNFWixrQkFERixFQUNzQkgsR0FEdEIsRUFDMkJDLEtBRDNCLEVBQ2tDRyxlQURsQyxFQUNtRCxJQURuRDtBQUVELEtBSEQ7O0FBSUEsUUFBSW9DLEtBQUosRUFDRW5ILElBQUksQ0FBQ3FHLFNBQUwsQ0FBZWMsS0FBZixDQUFxQm5ILElBQUksQ0FBQ2tHLGNBQTFCLEVBQTBDZSxFQUExQyxFQUE4Q2xDLGVBQTlDLEVBREYsS0FHRS9FLElBQUksQ0FBQ3FHLFNBQUwsQ0FBZXNCLE9BQWYsQ0FBdUIzSCxJQUFJLENBQUNrRyxjQUE1QixFQUE0Q2UsRUFBNUMsRUFBZ0RsQyxlQUFoRDtBQUNILEdBM0R1QztBQTZEeEM0QyxTQUFPLEVBQUUsVUFBVTdDLGtCQUFWLEVBQThCbUMsRUFBOUIsRUFBa0NVLE9BQWxDLEVBQTJDO0FBQ2xELFFBQUkzSCxJQUFJLEdBQUcsSUFBWDtBQUNBLFFBQUk4SCxhQUFhLEdBQUcsRUFBcEI7QUFDQSxRQUFJRixPQUFPLEdBQUc1SCxJQUFJLENBQUNvRyxTQUFMLENBQWVwQixHQUFmLENBQW1CaUMsRUFBbkIsQ0FBZDtBQUNBLFFBQUksQ0FBQ1csT0FBTCxFQUNFLE1BQU0sSUFBSUcsS0FBSixDQUFVLG9DQUFvQ2QsRUFBcEMsR0FBeUMsWUFBbkQsQ0FBTjs7QUFDRmhJLEtBQUMsQ0FBQ3lELElBQUYsQ0FBT2lGLE9BQVAsRUFBZ0IsVUFBVS9DLEtBQVYsRUFBaUJELEdBQWpCLEVBQXNCO0FBQ3BDLFVBQUlDLEtBQUssS0FBS00sU0FBZCxFQUNFMEMsT0FBTyxDQUFDL0MsVUFBUixDQUFtQkMsa0JBQW5CLEVBQXVDSCxHQUF2QyxFQUE0Q21ELGFBQTVDLEVBREYsS0FHRUYsT0FBTyxDQUFDbEMsV0FBUixDQUFvQlosa0JBQXBCLEVBQXdDSCxHQUF4QyxFQUE2Q0MsS0FBN0MsRUFBb0RrRCxhQUFwRDtBQUNILEtBTEQ7O0FBTUE5SCxRQUFJLENBQUNxRyxTQUFMLENBQWVzQixPQUFmLENBQXVCM0gsSUFBSSxDQUFDa0csY0FBNUIsRUFBNENlLEVBQTVDLEVBQWdEYSxhQUFoRDtBQUNELEdBMUV1QztBQTRFeENSLFNBQU8sRUFBRSxVQUFVeEMsa0JBQVYsRUFBOEJtQyxFQUE5QixFQUFrQztBQUN6QyxRQUFJakgsSUFBSSxHQUFHLElBQVg7QUFDQSxRQUFJNEgsT0FBTyxHQUFHNUgsSUFBSSxDQUFDb0csU0FBTCxDQUFlcEIsR0FBZixDQUFtQmlDLEVBQW5CLENBQWQ7O0FBQ0EsUUFBSSxDQUFDVyxPQUFMLEVBQWM7QUFDWixVQUFJSSxHQUFHLEdBQUcsSUFBSUQsS0FBSixDQUFVLGtDQUFrQ2QsRUFBNUMsQ0FBVjtBQUNBLFlBQU1lLEdBQU47QUFDRDs7QUFDREosV0FBTyxDQUFDMUQsUUFBUixDQUFpQnFCLE1BQWpCLENBQXdCVCxrQkFBeEI7O0FBQ0EsUUFBSThDLE9BQU8sQ0FBQzFELFFBQVIsQ0FBaUJzQyxJQUFqQixLQUEwQixDQUE5QixFQUFpQztBQUMvQjtBQUNBeEcsVUFBSSxDQUFDcUcsU0FBTCxDQUFlaUIsT0FBZixDQUF1QnRILElBQUksQ0FBQ2tHLGNBQTVCLEVBQTRDZSxFQUE1QztBQUNBakgsVUFBSSxDQUFDb0csU0FBTCxDQUFlYixNQUFmLENBQXNCMEIsRUFBdEI7QUFDRCxLQUpELE1BSU87QUFDTCxVQUFJVSxPQUFPLEdBQUcsRUFBZCxDQURLLENBRUw7QUFDQTs7QUFDQUMsYUFBTyxDQUFDeEQsU0FBUixDQUFrQkssT0FBbEIsQ0FBMEIsVUFBVUMsY0FBVixFQUEwQkMsR0FBMUIsRUFBK0I7QUFDdkRpRCxlQUFPLENBQUMvQyxVQUFSLENBQW1CQyxrQkFBbkIsRUFBdUNILEdBQXZDLEVBQTRDZ0QsT0FBNUM7QUFDRCxPQUZEO0FBSUEzSCxVQUFJLENBQUNxRyxTQUFMLENBQWVzQixPQUFmLENBQXVCM0gsSUFBSSxDQUFDa0csY0FBNUIsRUFBNENlLEVBQTVDLEVBQWdEVSxPQUFoRDtBQUNEO0FBQ0Y7QUFsR3VDLENBQTFDO0FBcUdBOztBQUNBOztBQUNBOzs7QUFFQSxJQUFJTSxPQUFPLEdBQUcsVUFBVS9HLE1BQVYsRUFBa0JnSCxPQUFsQixFQUEyQnRHLE1BQTNCLEVBQW1DdUcsT0FBbkMsRUFBNEM7QUFDeEQsTUFBSW5JLElBQUksR0FBRyxJQUFYO0FBQ0FBLE1BQUksQ0FBQ2lILEVBQUwsR0FBVW1CLE1BQU0sQ0FBQ25CLEVBQVAsRUFBVjtBQUVBakgsTUFBSSxDQUFDa0IsTUFBTCxHQUFjQSxNQUFkO0FBQ0FsQixNQUFJLENBQUNrSSxPQUFMLEdBQWVBLE9BQWY7QUFFQWxJLE1BQUksQ0FBQ3FJLFdBQUwsR0FBbUIsS0FBbkI7QUFDQXJJLE1BQUksQ0FBQzRCLE1BQUwsR0FBY0EsTUFBZCxDQVJ3RCxDQVV4RDtBQUNBOztBQUNBNUIsTUFBSSxDQUFDc0ksT0FBTCxHQUFlLElBQUlDLE1BQU0sQ0FBQ0MsaUJBQVgsRUFBZjtBQUVBeEksTUFBSSxDQUFDeUksT0FBTCxHQUFlLEtBQWY7QUFDQXpJLE1BQUksQ0FBQzBJLGFBQUwsR0FBcUIsS0FBckIsQ0Fmd0QsQ0FpQnhEOztBQUNBMUksTUFBSSxDQUFDMkksVUFBTCxHQUFrQixJQUFJdEUsR0FBSixFQUFsQjtBQUNBckUsTUFBSSxDQUFDNEksY0FBTCxHQUFzQixFQUF0QjtBQUVBNUksTUFBSSxDQUFDNkksTUFBTCxHQUFjLElBQWQ7QUFFQTdJLE1BQUksQ0FBQzhJLGVBQUwsR0FBdUIsSUFBSXpFLEdBQUosRUFBdkIsQ0F2QndELENBeUJ4RDtBQUNBO0FBQ0E7O0FBQ0FyRSxNQUFJLENBQUMrSSxVQUFMLEdBQWtCLElBQWxCLENBNUJ3RCxDQThCeEQ7QUFDQTs7QUFDQS9JLE1BQUksQ0FBQ2dKLDBCQUFMLEdBQWtDLEtBQWxDLENBaEN3RCxDQWtDeEQ7QUFDQTs7QUFDQWhKLE1BQUksQ0FBQ2lKLGFBQUwsR0FBcUIsRUFBckIsQ0FwQ3dELENBc0N4RDs7QUFDQWpKLE1BQUksQ0FBQ2tKLGVBQUwsR0FBdUIsRUFBdkIsQ0F2Q3dELENBMEN4RDtBQUNBOztBQUNBbEosTUFBSSxDQUFDbUosVUFBTCxHQUFrQnZILE1BQU0sQ0FBQy9DLEdBQXpCLENBNUN3RCxDQThDeEQ7O0FBQ0FtQixNQUFJLENBQUNvSixlQUFMLEdBQXVCakIsT0FBTyxDQUFDa0IsY0FBL0IsQ0EvQ3dELENBaUR4RDtBQUNBO0FBQ0E7O0FBQ0FySixNQUFJLENBQUNzSixnQkFBTCxHQUF3QjtBQUN0QnJDLE1BQUUsRUFBRWpILElBQUksQ0FBQ2lILEVBRGE7QUFFdEJzQyxTQUFLLEVBQUUsWUFBWTtBQUNqQnZKLFVBQUksQ0FBQ3VKLEtBQUw7QUFDRCxLQUpxQjtBQUt0QkMsV0FBTyxFQUFFLFVBQVVDLEVBQVYsRUFBYztBQUNyQixVQUFJQyxFQUFFLEdBQUduQixNQUFNLENBQUNvQixlQUFQLENBQXVCRixFQUF2QixFQUEyQiw2QkFBM0IsQ0FBVDs7QUFDQSxVQUFJekosSUFBSSxDQUFDc0ksT0FBVCxFQUFrQjtBQUNoQnRJLFlBQUksQ0FBQ2tKLGVBQUwsQ0FBcUJ4SixJQUFyQixDQUEwQmdLLEVBQTFCO0FBQ0QsT0FGRCxNQUVPO0FBQ0w7QUFDQW5CLGNBQU0sQ0FBQ3FCLEtBQVAsQ0FBYUYsRUFBYjtBQUNEO0FBQ0YsS0FicUI7QUFjdEJHLGlCQUFhLEVBQUU3SixJQUFJLENBQUM4SixjQUFMLEVBZE87QUFldEJDLGVBQVcsRUFBRS9KLElBQUksQ0FBQzRCLE1BQUwsQ0FBWW9JO0FBZkgsR0FBeEI7QUFrQkFoSyxNQUFJLENBQUNvQyxJQUFMLENBQVU7QUFBRTZILE9BQUcsRUFBRSxXQUFQO0FBQW9CQyxXQUFPLEVBQUVsSyxJQUFJLENBQUNpSDtBQUFsQyxHQUFWLEVBdEV3RCxDQXdFeEQ7O0FBQ0FqRCxPQUFLLENBQUMsWUFBWTtBQUNoQmhFLFFBQUksQ0FBQ21LLGtCQUFMO0FBQ0QsR0FGSSxDQUFMLENBRUdDLEdBRkg7O0FBSUEsTUFBSWxDLE9BQU8sS0FBSyxNQUFaLElBQXNCQyxPQUFPLENBQUNrQyxpQkFBUixLQUE4QixDQUF4RCxFQUEyRDtBQUN6RDtBQUNBekksVUFBTSxDQUFDQyxtQkFBUCxDQUEyQixDQUEzQjtBQUVBN0IsUUFBSSxDQUFDc0ssU0FBTCxHQUFpQixJQUFJQyxTQUFTLENBQUNDLFNBQWQsQ0FBd0I7QUFDdkNILHVCQUFpQixFQUFFbEMsT0FBTyxDQUFDa0MsaUJBRFk7QUFFdkNJLHNCQUFnQixFQUFFdEMsT0FBTyxDQUFDc0MsZ0JBRmE7QUFHdkNDLGVBQVMsRUFBRSxZQUFZO0FBQ3JCMUssWUFBSSxDQUFDdUosS0FBTDtBQUNELE9BTHNDO0FBTXZDb0IsY0FBUSxFQUFFLFlBQVk7QUFDcEIzSyxZQUFJLENBQUNvQyxJQUFMLENBQVU7QUFBQzZILGFBQUcsRUFBRTtBQUFOLFNBQVY7QUFDRDtBQVJzQyxLQUF4QixDQUFqQjtBQVVBakssUUFBSSxDQUFDc0ssU0FBTCxDQUFlTSxLQUFmO0FBQ0Q7O0FBRURDLFNBQU8sQ0FBQyxZQUFELENBQVAsSUFBeUJBLE9BQU8sQ0FBQyxZQUFELENBQVAsQ0FBc0JDLEtBQXRCLENBQTRCQyxtQkFBNUIsQ0FDdkIsVUFEdUIsRUFDWCxVQURXLEVBQ0MsQ0FERCxDQUF6QjtBQUVELENBaEdEOztBQWtHQTlMLENBQUMsQ0FBQzJELE1BQUYsQ0FBU3FGLE9BQU8sQ0FBQ3BGLFNBQWpCLEVBQTRCO0FBRTFCbUksV0FBUyxFQUFFLFVBQVVDLGVBQVYsRUFBMkI7QUFDcEMsUUFBSWpMLElBQUksR0FBRyxJQUFYO0FBQ0EsUUFBSUEsSUFBSSxDQUFDK0ksVUFBVCxFQUNFL0ksSUFBSSxDQUFDb0MsSUFBTCxDQUFVO0FBQUM2SCxTQUFHLEVBQUUsT0FBTjtBQUFlaUIsVUFBSSxFQUFFRDtBQUFyQixLQUFWLEVBREYsS0FFSztBQUNIaE0sT0FBQyxDQUFDeUQsSUFBRixDQUFPdUksZUFBUCxFQUF3QixVQUFVRSxjQUFWLEVBQTBCO0FBQ2hEbkwsWUFBSSxDQUFDaUosYUFBTCxDQUFtQnZKLElBQW5CLENBQXdCeUwsY0FBeEI7QUFDRCxPQUZEO0FBR0Q7QUFDRixHQVh5QjtBQWExQkMsV0FBUyxFQUFFLFVBQVVsRixjQUFWLEVBQTBCZSxFQUExQixFQUE4Qk0sTUFBOUIsRUFBc0M7QUFDL0MsUUFBSXZILElBQUksR0FBRyxJQUFYO0FBQ0EsUUFBSUEsSUFBSSxDQUFDK0ksVUFBVCxFQUNFL0ksSUFBSSxDQUFDb0MsSUFBTCxDQUFVO0FBQUM2SCxTQUFHLEVBQUUsT0FBTjtBQUFlb0IsZ0JBQVUsRUFBRW5GLGNBQTNCO0FBQTJDZSxRQUFFLEVBQUVBLEVBQS9DO0FBQW1ETSxZQUFNLEVBQUVBO0FBQTNELEtBQVY7QUFDSCxHQWpCeUI7QUFtQjFCK0QsYUFBVyxFQUFFLFVBQVVwRixjQUFWLEVBQTBCZSxFQUExQixFQUE4Qk0sTUFBOUIsRUFBc0M7QUFDakQsUUFBSXZILElBQUksR0FBRyxJQUFYO0FBQ0EsUUFBSWYsQ0FBQyxDQUFDc0gsT0FBRixDQUFVZ0IsTUFBVixDQUFKLEVBQ0U7O0FBRUYsUUFBSXZILElBQUksQ0FBQytJLFVBQVQsRUFBcUI7QUFDbkIvSSxVQUFJLENBQUNvQyxJQUFMLENBQVU7QUFDUjZILFdBQUcsRUFBRSxTQURHO0FBRVJvQixrQkFBVSxFQUFFbkYsY0FGSjtBQUdSZSxVQUFFLEVBQUVBLEVBSEk7QUFJUk0sY0FBTSxFQUFFQTtBQUpBLE9BQVY7QUFNRDtBQUNGLEdBaEN5QjtBQWtDMUJnRSxhQUFXLEVBQUUsVUFBVXJGLGNBQVYsRUFBMEJlLEVBQTFCLEVBQThCO0FBQ3pDLFFBQUlqSCxJQUFJLEdBQUcsSUFBWDtBQUNBLFFBQUlBLElBQUksQ0FBQytJLFVBQVQsRUFDRS9JLElBQUksQ0FBQ29DLElBQUwsQ0FBVTtBQUFDNkgsU0FBRyxFQUFFLFNBQU47QUFBaUJvQixnQkFBVSxFQUFFbkYsY0FBN0I7QUFBNkNlLFFBQUUsRUFBRUE7QUFBakQsS0FBVjtBQUNILEdBdEN5QjtBQXdDMUJ1RSxrQkFBZ0IsRUFBRSxZQUFZO0FBQzVCLFFBQUl4TCxJQUFJLEdBQUcsSUFBWDtBQUNBLFdBQU87QUFDTG1ILFdBQUssRUFBRWxJLENBQUMsQ0FBQzZILElBQUYsQ0FBTzlHLElBQUksQ0FBQ29MLFNBQVosRUFBdUJwTCxJQUF2QixDQURGO0FBRUwySCxhQUFPLEVBQUUxSSxDQUFDLENBQUM2SCxJQUFGLENBQU85RyxJQUFJLENBQUNzTCxXQUFaLEVBQXlCdEwsSUFBekIsQ0FGSjtBQUdMc0gsYUFBTyxFQUFFckksQ0FBQyxDQUFDNkgsSUFBRixDQUFPOUcsSUFBSSxDQUFDdUwsV0FBWixFQUF5QnZMLElBQXpCO0FBSEosS0FBUDtBQUtELEdBL0N5QjtBQWlEMUJ5TCxtQkFBaUIsRUFBRSxVQUFVdkYsY0FBVixFQUEwQjtBQUMzQyxRQUFJbEcsSUFBSSxHQUFHLElBQVg7QUFDQSxRQUFJd0UsR0FBRyxHQUFHeEUsSUFBSSxDQUFDOEksZUFBTCxDQUFxQjlELEdBQXJCLENBQXlCa0IsY0FBekIsQ0FBVjs7QUFDQSxRQUFJLENBQUMxQixHQUFMLEVBQVU7QUFDUkEsU0FBRyxHQUFHLElBQUl5QixxQkFBSixDQUEwQkMsY0FBMUIsRUFDNEJsRyxJQUFJLENBQUN3TCxnQkFBTCxFQUQ1QixDQUFOO0FBRUF4TCxVQUFJLENBQUM4SSxlQUFMLENBQXFCaEQsR0FBckIsQ0FBeUJJLGNBQXpCLEVBQXlDMUIsR0FBekM7QUFDRDs7QUFDRCxXQUFPQSxHQUFQO0FBQ0QsR0ExRHlCO0FBNEQxQjJDLE9BQUssRUFBRSxVQUFVckMsa0JBQVYsRUFBOEJvQixjQUE5QixFQUE4Q2UsRUFBOUMsRUFBa0RNLE1BQWxELEVBQTBEO0FBQy9ELFFBQUl2SCxJQUFJLEdBQUcsSUFBWDtBQUNBLFFBQUkwTCxJQUFJLEdBQUcxTCxJQUFJLENBQUN5TCxpQkFBTCxDQUF1QnZGLGNBQXZCLENBQVg7QUFDQXdGLFFBQUksQ0FBQ3ZFLEtBQUwsQ0FBV3JDLGtCQUFYLEVBQStCbUMsRUFBL0IsRUFBbUNNLE1BQW5DO0FBQ0QsR0FoRXlCO0FBa0UxQkQsU0FBTyxFQUFFLFVBQVV4QyxrQkFBVixFQUE4Qm9CLGNBQTlCLEVBQThDZSxFQUE5QyxFQUFrRDtBQUN6RCxRQUFJakgsSUFBSSxHQUFHLElBQVg7QUFDQSxRQUFJMEwsSUFBSSxHQUFHMUwsSUFBSSxDQUFDeUwsaUJBQUwsQ0FBdUJ2RixjQUF2QixDQUFYO0FBQ0F3RixRQUFJLENBQUNwRSxPQUFMLENBQWF4QyxrQkFBYixFQUFpQ21DLEVBQWpDOztBQUNBLFFBQUl5RSxJQUFJLENBQUNuRixPQUFMLEVBQUosRUFBb0I7QUFDakJ2RyxVQUFJLENBQUM4SSxlQUFMLENBQXFCdkQsTUFBckIsQ0FBNEJXLGNBQTVCO0FBQ0Y7QUFDRixHQXpFeUI7QUEyRTFCeUIsU0FBTyxFQUFFLFVBQVU3QyxrQkFBVixFQUE4Qm9CLGNBQTlCLEVBQThDZSxFQUE5QyxFQUFrRE0sTUFBbEQsRUFBMEQ7QUFDakUsUUFBSXZILElBQUksR0FBRyxJQUFYO0FBQ0EsUUFBSTBMLElBQUksR0FBRzFMLElBQUksQ0FBQ3lMLGlCQUFMLENBQXVCdkYsY0FBdkIsQ0FBWDtBQUNBd0YsUUFBSSxDQUFDL0QsT0FBTCxDQUFhN0Msa0JBQWIsRUFBaUNtQyxFQUFqQyxFQUFxQ00sTUFBckM7QUFDRCxHQS9FeUI7QUFpRjFCNEMsb0JBQWtCLEVBQUUsWUFBWTtBQUM5QixRQUFJbkssSUFBSSxHQUFHLElBQVgsQ0FEOEIsQ0FFOUI7QUFDQTtBQUNBOztBQUNBLFFBQUkyTCxRQUFRLEdBQUcxTSxDQUFDLENBQUMyRyxLQUFGLENBQVE1RixJQUFJLENBQUNrQixNQUFMLENBQVkwSywwQkFBcEIsQ0FBZjs7QUFDQTNNLEtBQUMsQ0FBQ3lELElBQUYsQ0FBT2lKLFFBQVAsRUFBaUIsVUFBVUUsT0FBVixFQUFtQjtBQUNsQzdMLFVBQUksQ0FBQzhMLGtCQUFMLENBQXdCRCxPQUF4QjtBQUNELEtBRkQ7QUFHRCxHQTFGeUI7QUE0RjFCO0FBQ0F0QyxPQUFLLEVBQUUsWUFBWTtBQUNqQixRQUFJdkosSUFBSSxHQUFHLElBQVgsQ0FEaUIsQ0FHakI7QUFDQTtBQUNBO0FBRUE7O0FBQ0EsUUFBSSxDQUFFQSxJQUFJLENBQUNzSSxPQUFYLEVBQ0UsT0FUZSxDQVdqQjs7QUFDQXRJLFFBQUksQ0FBQ3NJLE9BQUwsR0FBZSxJQUFmO0FBQ0F0SSxRQUFJLENBQUM4SSxlQUFMLEdBQXVCLElBQUl6RSxHQUFKLEVBQXZCOztBQUVBLFFBQUlyRSxJQUFJLENBQUNzSyxTQUFULEVBQW9CO0FBQ2xCdEssVUFBSSxDQUFDc0ssU0FBTCxDQUFleUIsSUFBZjtBQUNBL0wsVUFBSSxDQUFDc0ssU0FBTCxHQUFpQixJQUFqQjtBQUNEOztBQUVELFFBQUl0SyxJQUFJLENBQUM0QixNQUFULEVBQWlCO0FBQ2Y1QixVQUFJLENBQUM0QixNQUFMLENBQVkySCxLQUFaO0FBQ0F2SixVQUFJLENBQUM0QixNQUFMLENBQVlvSyxjQUFaLEdBQTZCLElBQTdCO0FBQ0Q7O0FBRURuQixXQUFPLENBQUMsWUFBRCxDQUFQLElBQXlCQSxPQUFPLENBQUMsWUFBRCxDQUFQLENBQXNCQyxLQUF0QixDQUE0QkMsbUJBQTVCLENBQ3ZCLFVBRHVCLEVBQ1gsVUFEVyxFQUNDLENBQUMsQ0FERixDQUF6QjtBQUdBeEMsVUFBTSxDQUFDcUIsS0FBUCxDQUFhLFlBQVk7QUFDdkI7QUFDQTtBQUNBO0FBQ0E1SixVQUFJLENBQUNpTSwyQkFBTCxHQUp1QixDQU12QjtBQUNBOzs7QUFDQWhOLE9BQUMsQ0FBQ3lELElBQUYsQ0FBTzFDLElBQUksQ0FBQ2tKLGVBQVosRUFBNkIsVUFBVXZHLFFBQVYsRUFBb0I7QUFDL0NBLGdCQUFRO0FBQ1QsT0FGRDtBQUdELEtBWEQsRUE1QmlCLENBeUNqQjs7QUFDQTNDLFFBQUksQ0FBQ2tCLE1BQUwsQ0FBWWdMLGNBQVosQ0FBMkJsTSxJQUEzQjtBQUNELEdBeEl5QjtBQTBJMUI7QUFDQTtBQUNBb0MsTUFBSSxFQUFFLFVBQVU2SCxHQUFWLEVBQWU7QUFDbkIsUUFBSWpLLElBQUksR0FBRyxJQUFYOztBQUNBLFFBQUlBLElBQUksQ0FBQzRCLE1BQVQsRUFBaUI7QUFDZixVQUFJMkcsTUFBTSxDQUFDNEQsYUFBWCxFQUNFNUQsTUFBTSxDQUFDNkQsTUFBUCxDQUFjLFVBQWQsRUFBMEI3QixTQUFTLENBQUM4QixZQUFWLENBQXVCcEMsR0FBdkIsQ0FBMUI7QUFDRmpLLFVBQUksQ0FBQzRCLE1BQUwsQ0FBWVEsSUFBWixDQUFpQm1JLFNBQVMsQ0FBQzhCLFlBQVYsQ0FBdUJwQyxHQUF2QixDQUFqQjtBQUNEO0FBQ0YsR0FuSnlCO0FBcUoxQjtBQUNBcUMsV0FBUyxFQUFFLFVBQVVDLE1BQVYsRUFBa0JDLGdCQUFsQixFQUFvQztBQUM3QyxRQUFJeE0sSUFBSSxHQUFHLElBQVg7QUFDQSxRQUFJaUssR0FBRyxHQUFHO0FBQUNBLFNBQUcsRUFBRSxPQUFOO0FBQWVzQyxZQUFNLEVBQUVBO0FBQXZCLEtBQVY7QUFDQSxRQUFJQyxnQkFBSixFQUNFdkMsR0FBRyxDQUFDdUMsZ0JBQUosR0FBdUJBLGdCQUF2QjtBQUNGeE0sUUFBSSxDQUFDb0MsSUFBTCxDQUFVNkgsR0FBVjtBQUNELEdBNUp5QjtBQThKMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0F3QyxnQkFBYyxFQUFFLFVBQVVDLE1BQVYsRUFBa0I7QUFDaEMsUUFBSTFNLElBQUksR0FBRyxJQUFYO0FBQ0EsUUFBSSxDQUFDQSxJQUFJLENBQUNzSSxPQUFWLEVBQW1CO0FBQ2pCLGFBSDhCLENBS2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQSxRQUFJdEksSUFBSSxDQUFDc0ssU0FBVCxFQUFvQjtBQUNsQnRHLFdBQUssQ0FBQyxZQUFZO0FBQ2hCaEUsWUFBSSxDQUFDc0ssU0FBTCxDQUFlcUMsZUFBZjtBQUNELE9BRkksQ0FBTCxDQUVHdkMsR0FGSDtBQUdEOztBQUVELFFBQUlwSyxJQUFJLENBQUNrSSxPQUFMLEtBQWlCLE1BQWpCLElBQTJCd0UsTUFBTSxDQUFDekMsR0FBUCxLQUFlLE1BQTlDLEVBQXNEO0FBQ3BELFVBQUlqSyxJQUFJLENBQUNvSixlQUFULEVBQ0VwSixJQUFJLENBQUNvQyxJQUFMLENBQVU7QUFBQzZILFdBQUcsRUFBRSxNQUFOO0FBQWNoRCxVQUFFLEVBQUV5RixNQUFNLENBQUN6RjtBQUF6QixPQUFWO0FBQ0Y7QUFDRDs7QUFDRCxRQUFJakgsSUFBSSxDQUFDa0ksT0FBTCxLQUFpQixNQUFqQixJQUEyQndFLE1BQU0sQ0FBQ3pDLEdBQVAsS0FBZSxNQUE5QyxFQUFzRDtBQUNwRDtBQUNBO0FBQ0Q7O0FBRURqSyxRQUFJLENBQUNzSSxPQUFMLENBQWE1SSxJQUFiLENBQWtCZ04sTUFBbEI7QUFDQSxRQUFJMU0sSUFBSSxDQUFDMEksYUFBVCxFQUNFO0FBQ0YxSSxRQUFJLENBQUMwSSxhQUFMLEdBQXFCLElBQXJCOztBQUVBLFFBQUlrRSxXQUFXLEdBQUcsWUFBWTtBQUM1QixVQUFJM0MsR0FBRyxHQUFHakssSUFBSSxDQUFDc0ksT0FBTCxJQUFnQnRJLElBQUksQ0FBQ3NJLE9BQUwsQ0FBYXVFLEtBQWIsRUFBMUI7O0FBQ0EsVUFBSSxDQUFDNUMsR0FBTCxFQUFVO0FBQ1JqSyxZQUFJLENBQUMwSSxhQUFMLEdBQXFCLEtBQXJCO0FBQ0E7QUFDRDs7QUFFRDFFLFdBQUssQ0FBQyxZQUFZO0FBQ2hCLFlBQUl5RSxPQUFPLEdBQUcsSUFBZDs7QUFFQSxZQUFJcUUsT0FBTyxHQUFHLFlBQVk7QUFDeEIsY0FBSSxDQUFDckUsT0FBTCxFQUNFLE9BRnNCLENBRWQ7O0FBQ1ZBLGlCQUFPLEdBQUcsS0FBVjtBQUNBbUUscUJBQVc7QUFDWixTQUxEOztBQU9BNU0sWUFBSSxDQUFDa0IsTUFBTCxDQUFZNkwsYUFBWixDQUEwQnJLLElBQTFCLENBQStCLFVBQVVDLFFBQVYsRUFBb0I7QUFDakRBLGtCQUFRLENBQUNzSCxHQUFELEVBQU1qSyxJQUFOLENBQVI7QUFDQSxpQkFBTyxJQUFQO0FBQ0QsU0FIRDtBQUtBLFlBQUlmLENBQUMsQ0FBQzRHLEdBQUYsQ0FBTTdGLElBQUksQ0FBQ2dOLGlCQUFYLEVBQThCL0MsR0FBRyxDQUFDQSxHQUFsQyxDQUFKLEVBQ0VqSyxJQUFJLENBQUNnTixpQkFBTCxDQUF1Qi9DLEdBQUcsQ0FBQ0EsR0FBM0IsRUFBZ0NnRCxJQUFoQyxDQUFxQ2pOLElBQXJDLEVBQTJDaUssR0FBM0MsRUFBZ0Q2QyxPQUFoRCxFQURGLEtBR0U5TSxJQUFJLENBQUNzTSxTQUFMLENBQWUsYUFBZixFQUE4QnJDLEdBQTlCO0FBQ0Y2QyxlQUFPLEdBbkJTLENBbUJMO0FBQ1osT0FwQkksQ0FBTCxDQW9CRzFDLEdBcEJIO0FBcUJELEtBNUJEOztBQThCQXdDLGVBQVc7QUFDWixHQWxQeUI7QUFvUDFCSSxtQkFBaUIsRUFBRTtBQUNqQkUsT0FBRyxFQUFFLFVBQVVqRCxHQUFWLEVBQWU7QUFDbEIsVUFBSWpLLElBQUksR0FBRyxJQUFYLENBRGtCLENBR2xCOztBQUNBLFVBQUksT0FBUWlLLEdBQUcsQ0FBQ2hELEVBQVosS0FBb0IsUUFBcEIsSUFDQSxPQUFRZ0QsR0FBRyxDQUFDa0QsSUFBWixLQUFzQixRQUR0QixJQUVFLFlBQVlsRCxHQUFiLElBQXFCLEVBQUVBLEdBQUcsQ0FBQ21ELE1BQUosWUFBc0JDLEtBQXhCLENBRjFCLEVBRTJEO0FBQ3pEck4sWUFBSSxDQUFDc00sU0FBTCxDQUFlLHdCQUFmLEVBQXlDckMsR0FBekM7QUFDQTtBQUNEOztBQUVELFVBQUksQ0FBQ2pLLElBQUksQ0FBQ2tCLE1BQUwsQ0FBWW9NLGdCQUFaLENBQTZCckQsR0FBRyxDQUFDa0QsSUFBakMsQ0FBTCxFQUE2QztBQUMzQ25OLFlBQUksQ0FBQ29DLElBQUwsQ0FBVTtBQUNSNkgsYUFBRyxFQUFFLE9BREc7QUFDTWhELFlBQUUsRUFBRWdELEdBQUcsQ0FBQ2hELEVBRGQ7QUFFUnNHLGVBQUssRUFBRSxJQUFJaEYsTUFBTSxDQUFDUixLQUFYLENBQWlCLEdBQWpCLDBCQUF1Q2tDLEdBQUcsQ0FBQ2tELElBQTNDO0FBRkMsU0FBVjtBQUdBO0FBQ0Q7O0FBRUQsVUFBSW5OLElBQUksQ0FBQzJJLFVBQUwsQ0FBZ0I5QyxHQUFoQixDQUFvQm9FLEdBQUcsQ0FBQ2hELEVBQXhCLENBQUosRUFDRTtBQUNBO0FBQ0E7QUFDQSxlQXRCZ0IsQ0F3QmxCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0EsVUFBSTRELE9BQU8sQ0FBQyxrQkFBRCxDQUFYLEVBQWlDO0FBQy9CLFlBQUkyQyxjQUFjLEdBQUczQyxPQUFPLENBQUMsa0JBQUQsQ0FBUCxDQUE0QjJDLGNBQWpEO0FBQ0EsWUFBSUMsZ0JBQWdCLEdBQUc7QUFDckI1RSxnQkFBTSxFQUFFN0ksSUFBSSxDQUFDNkksTUFEUTtBQUVyQmdCLHVCQUFhLEVBQUU3SixJQUFJLENBQUNzSixnQkFBTCxDQUFzQk8sYUFGaEI7QUFHckI2RCxjQUFJLEVBQUUsY0FIZTtBQUlyQlAsY0FBSSxFQUFFbEQsR0FBRyxDQUFDa0QsSUFKVztBQUtyQlEsc0JBQVksRUFBRTNOLElBQUksQ0FBQ2lIO0FBTEUsU0FBdkI7O0FBUUF1RyxzQkFBYyxDQUFDSSxVQUFmLENBQTBCSCxnQkFBMUI7O0FBQ0EsWUFBSUksZUFBZSxHQUFHTCxjQUFjLENBQUNNLE1BQWYsQ0FBc0JMLGdCQUF0QixDQUF0Qjs7QUFDQSxZQUFJLENBQUNJLGVBQWUsQ0FBQ0UsT0FBckIsRUFBOEI7QUFDNUIvTixjQUFJLENBQUNvQyxJQUFMLENBQVU7QUFDUjZILGVBQUcsRUFBRSxPQURHO0FBQ01oRCxjQUFFLEVBQUVnRCxHQUFHLENBQUNoRCxFQURkO0FBRVJzRyxpQkFBSyxFQUFFLElBQUloRixNQUFNLENBQUNSLEtBQVgsQ0FDTCxtQkFESyxFQUVMeUYsY0FBYyxDQUFDUSxlQUFmLENBQStCSCxlQUEvQixDQUZLLEVBR0w7QUFBQ0kseUJBQVcsRUFBRUosZUFBZSxDQUFDSTtBQUE5QixhQUhLO0FBRkMsV0FBVjtBQU9BO0FBQ0Q7QUFDRjs7QUFFRCxVQUFJcEMsT0FBTyxHQUFHN0wsSUFBSSxDQUFDa0IsTUFBTCxDQUFZb00sZ0JBQVosQ0FBNkJyRCxHQUFHLENBQUNrRCxJQUFqQyxDQUFkOztBQUVBbk4sVUFBSSxDQUFDOEwsa0JBQUwsQ0FBd0JELE9BQXhCLEVBQWlDNUIsR0FBRyxDQUFDaEQsRUFBckMsRUFBeUNnRCxHQUFHLENBQUNtRCxNQUE3QyxFQUFxRG5ELEdBQUcsQ0FBQ2tELElBQXpEO0FBRUQsS0ExRGdCO0FBNERqQmUsU0FBSyxFQUFFLFVBQVVqRSxHQUFWLEVBQWU7QUFDcEIsVUFBSWpLLElBQUksR0FBRyxJQUFYOztBQUVBQSxVQUFJLENBQUNtTyxpQkFBTCxDQUF1QmxFLEdBQUcsQ0FBQ2hELEVBQTNCO0FBQ0QsS0FoRWdCO0FBa0VqQm1ILFVBQU0sRUFBRSxVQUFVbkUsR0FBVixFQUFlNkMsT0FBZixFQUF3QjtBQUM5QixVQUFJOU0sSUFBSSxHQUFHLElBQVgsQ0FEOEIsQ0FHOUI7QUFDQTtBQUNBOztBQUNBLFVBQUksT0FBUWlLLEdBQUcsQ0FBQ2hELEVBQVosS0FBb0IsUUFBcEIsSUFDQSxPQUFRZ0QsR0FBRyxDQUFDbUUsTUFBWixLQUF3QixRQUR4QixJQUVFLFlBQVluRSxHQUFiLElBQXFCLEVBQUVBLEdBQUcsQ0FBQ21ELE1BQUosWUFBc0JDLEtBQXhCLENBRnRCLElBR0UsZ0JBQWdCcEQsR0FBakIsSUFBMEIsT0FBT0EsR0FBRyxDQUFDb0UsVUFBWCxLQUEwQixRQUh6RCxFQUdxRTtBQUNuRXJPLFlBQUksQ0FBQ3NNLFNBQUwsQ0FBZSw2QkFBZixFQUE4Q3JDLEdBQTlDO0FBQ0E7QUFDRDs7QUFFRCxVQUFJb0UsVUFBVSxHQUFHcEUsR0FBRyxDQUFDb0UsVUFBSixJQUFrQixJQUFuQyxDQWQ4QixDQWdCOUI7QUFDQTtBQUNBOztBQUNBLFVBQUlDLEtBQUssR0FBRyxJQUFJdkssU0FBUyxDQUFDd0ssV0FBZCxFQUFaO0FBQ0FELFdBQUssQ0FBQ0UsY0FBTixDQUFxQixZQUFZO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQUYsYUFBSyxDQUFDRyxNQUFOO0FBQ0F6TyxZQUFJLENBQUNvQyxJQUFMLENBQVU7QUFDUjZILGFBQUcsRUFBRSxTQURHO0FBQ1F5RSxpQkFBTyxFQUFFLENBQUN6RSxHQUFHLENBQUNoRCxFQUFMO0FBRGpCLFNBQVY7QUFFRCxPQVRELEVBcEI4QixDQStCOUI7O0FBQ0EsVUFBSTRFLE9BQU8sR0FBRzdMLElBQUksQ0FBQ2tCLE1BQUwsQ0FBWXlOLGVBQVosQ0FBNEIxRSxHQUFHLENBQUNtRSxNQUFoQyxDQUFkOztBQUNBLFVBQUksQ0FBQ3ZDLE9BQUwsRUFBYztBQUNaN0wsWUFBSSxDQUFDb0MsSUFBTCxDQUFVO0FBQ1I2SCxhQUFHLEVBQUUsUUFERztBQUNPaEQsWUFBRSxFQUFFZ0QsR0FBRyxDQUFDaEQsRUFEZjtBQUVSc0csZUFBSyxFQUFFLElBQUloRixNQUFNLENBQUNSLEtBQVgsQ0FBaUIsR0FBakIsb0JBQWlDa0MsR0FBRyxDQUFDbUUsTUFBckM7QUFGQyxTQUFWO0FBR0FFLGFBQUssQ0FBQ00sR0FBTjtBQUNBO0FBQ0Q7O0FBRUQsVUFBSUMsU0FBUyxHQUFHLFVBQVNoRyxNQUFULEVBQWlCO0FBQy9CN0ksWUFBSSxDQUFDOE8sVUFBTCxDQUFnQmpHLE1BQWhCO0FBQ0QsT0FGRDs7QUFJQSxVQUFJa0csVUFBVSxHQUFHLElBQUl4RSxTQUFTLENBQUN5RSxnQkFBZCxDQUErQjtBQUM5Q0Msb0JBQVksRUFBRSxLQURnQztBQUU5Q3BHLGNBQU0sRUFBRTdJLElBQUksQ0FBQzZJLE1BRmlDO0FBRzlDZ0csaUJBQVMsRUFBRUEsU0FIbUM7QUFJOUMvQixlQUFPLEVBQUVBLE9BSnFDO0FBSzlDNUssa0JBQVUsRUFBRWxDLElBQUksQ0FBQ3NKLGdCQUw2QjtBQU05QytFLGtCQUFVLEVBQUVBO0FBTmtDLE9BQS9CLENBQWpCO0FBU0EsWUFBTWEsT0FBTyxHQUFHLElBQUlDLE9BQUosQ0FBWSxDQUFDQyxPQUFELEVBQVVDLE1BQVYsS0FBcUI7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFJeEUsT0FBTyxDQUFDLGtCQUFELENBQVgsRUFBaUM7QUFDL0IsY0FBSTJDLGNBQWMsR0FBRzNDLE9BQU8sQ0FBQyxrQkFBRCxDQUFQLENBQTRCMkMsY0FBakQ7QUFDQSxjQUFJQyxnQkFBZ0IsR0FBRztBQUNyQjVFLGtCQUFNLEVBQUU3SSxJQUFJLENBQUM2SSxNQURRO0FBRXJCZ0IseUJBQWEsRUFBRTdKLElBQUksQ0FBQ3NKLGdCQUFMLENBQXNCTyxhQUZoQjtBQUdyQjZELGdCQUFJLEVBQUUsUUFIZTtBQUlyQlAsZ0JBQUksRUFBRWxELEdBQUcsQ0FBQ21FLE1BSlc7QUFLckJULHdCQUFZLEVBQUUzTixJQUFJLENBQUNpSDtBQUxFLFdBQXZCOztBQU9BdUcsd0JBQWMsQ0FBQ0ksVUFBZixDQUEwQkgsZ0JBQTFCOztBQUNBLGNBQUlJLGVBQWUsR0FBR0wsY0FBYyxDQUFDTSxNQUFmLENBQXNCTCxnQkFBdEIsQ0FBdEI7O0FBQ0EsY0FBSSxDQUFDSSxlQUFlLENBQUNFLE9BQXJCLEVBQThCO0FBQzVCc0Isa0JBQU0sQ0FBQyxJQUFJOUcsTUFBTSxDQUFDUixLQUFYLENBQ0wsbUJBREssRUFFTHlGLGNBQWMsQ0FBQ1EsZUFBZixDQUErQkgsZUFBL0IsQ0FGSyxFQUdMO0FBQUNJLHlCQUFXLEVBQUVKLGVBQWUsQ0FBQ0k7QUFBOUIsYUFISyxDQUFELENBQU47QUFLQTtBQUNEO0FBQ0Y7O0FBRURtQixlQUFPLENBQUNyTCxTQUFTLENBQUN1TCxrQkFBVixDQUE2QkMsU0FBN0IsQ0FDTmpCLEtBRE0sRUFFTixNQUFNa0IsR0FBRyxDQUFDQyx3QkFBSixDQUE2QkYsU0FBN0IsQ0FDSlIsVUFESSxFQUVKLE1BQU1XLHdCQUF3QixDQUM1QjdELE9BRDRCLEVBQ25Ca0QsVUFEbUIsRUFDUDlFLEdBQUcsQ0FBQ21ELE1BREcsRUFFNUIsY0FBY25ELEdBQUcsQ0FBQ21FLE1BQWxCLEdBQTJCLEdBRkMsQ0FGMUIsQ0FGQSxDQUFELENBQVA7QUFVRCxPQXBDZSxDQUFoQjs7QUFzQ0EsZUFBU3VCLE1BQVQsR0FBa0I7QUFDaEJyQixhQUFLLENBQUNNLEdBQU47QUFDQTlCLGVBQU87QUFDUjs7QUFFRCxZQUFNOEMsT0FBTyxHQUFHO0FBQ2QzRixXQUFHLEVBQUUsUUFEUztBQUVkaEQsVUFBRSxFQUFFZ0QsR0FBRyxDQUFDaEQ7QUFGTSxPQUFoQjtBQUtBaUksYUFBTyxDQUFDVyxJQUFSLENBQWNDLE1BQUQsSUFBWTtBQUN2QkgsY0FBTTs7QUFDTixZQUFJRyxNQUFNLEtBQUs1SyxTQUFmLEVBQTBCO0FBQ3hCMEssaUJBQU8sQ0FBQ0UsTUFBUixHQUFpQkEsTUFBakI7QUFDRDs7QUFDRDlQLFlBQUksQ0FBQ29DLElBQUwsQ0FBVXdOLE9BQVY7QUFDRCxPQU5ELEVBTUlHLFNBQUQsSUFBZTtBQUNoQkosY0FBTTtBQUNOQyxlQUFPLENBQUNyQyxLQUFSLEdBQWdCeUMscUJBQXFCLENBQ25DRCxTQURtQyxtQ0FFVDlGLEdBQUcsQ0FBQ21FLE1BRkssT0FBckM7QUFJQXBPLFlBQUksQ0FBQ29DLElBQUwsQ0FBVXdOLE9BQVY7QUFDRCxPQWJEO0FBY0Q7QUF0TGdCLEdBcFBPO0FBNmExQkssVUFBUSxFQUFFLFVBQVVDLENBQVYsRUFBYTtBQUNyQixRQUFJbFEsSUFBSSxHQUFHLElBQVg7O0FBQ0FBLFFBQUksQ0FBQzJJLFVBQUwsQ0FBZ0JsRSxPQUFoQixDQUF3QnlMLENBQXhCOztBQUNBbFEsUUFBSSxDQUFDNEksY0FBTCxDQUFvQm5FLE9BQXBCLENBQTRCeUwsQ0FBNUI7QUFDRCxHQWpieUI7QUFtYjFCQyxzQkFBb0IsRUFBRSxVQUFVQyxTQUFWLEVBQXFCO0FBQ3pDLFFBQUlwUSxJQUFJLEdBQUcsSUFBWDtBQUNBMkcsZ0JBQVksQ0FBQ0MsUUFBYixDQUFzQndKLFNBQXRCLEVBQWlDcFEsSUFBSSxDQUFDOEksZUFBdEMsRUFBdUQ7QUFDckRqQyxVQUFJLEVBQUUsVUFBVVgsY0FBVixFQUEwQm1LLFNBQTFCLEVBQXFDQyxVQUFyQyxFQUFpRDtBQUNyREEsa0JBQVUsQ0FBQzdKLElBQVgsQ0FBZ0I0SixTQUFoQjtBQUNELE9BSG9EO0FBSXJEckosZUFBUyxFQUFFLFVBQVVkLGNBQVYsRUFBMEJvSyxVQUExQixFQUFzQztBQUMvQ0Esa0JBQVUsQ0FBQ2xLLFNBQVgsQ0FBcUIzQixPQUFyQixDQUE2QixVQUFVbUQsT0FBVixFQUFtQlgsRUFBbkIsRUFBdUI7QUFDbERqSCxjQUFJLENBQUNvTCxTQUFMLENBQWVsRixjQUFmLEVBQStCZSxFQUEvQixFQUFtQ1csT0FBTyxDQUFDckQsU0FBUixFQUFuQztBQUNELFNBRkQ7QUFHRCxPQVJvRDtBQVNyRDZDLGNBQVEsRUFBRSxVQUFVbEIsY0FBVixFQUEwQm1LLFNBQTFCLEVBQXFDO0FBQzdDQSxpQkFBUyxDQUFDakssU0FBVixDQUFvQjNCLE9BQXBCLENBQTRCLFVBQVU4TCxHQUFWLEVBQWV0SixFQUFmLEVBQW1CO0FBQzdDakgsY0FBSSxDQUFDdUwsV0FBTCxDQUFpQnJGLGNBQWpCLEVBQWlDZSxFQUFqQztBQUNELFNBRkQ7QUFHRDtBQWJvRCxLQUF2RDtBQWVELEdBcGN5QjtBQXNjMUI7QUFDQTtBQUNBNkgsWUFBVSxFQUFFLFVBQVNqRyxNQUFULEVBQWlCO0FBQzNCLFFBQUk3SSxJQUFJLEdBQUcsSUFBWDtBQUVBLFFBQUk2SSxNQUFNLEtBQUssSUFBWCxJQUFtQixPQUFPQSxNQUFQLEtBQWtCLFFBQXpDLEVBQ0UsTUFBTSxJQUFJZCxLQUFKLENBQVUscURBQ0EsT0FBT2MsTUFEakIsQ0FBTixDQUp5QixDQU8zQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBN0ksUUFBSSxDQUFDZ0osMEJBQUwsR0FBa0MsSUFBbEMsQ0FmMkIsQ0FpQjNCO0FBQ0E7O0FBQ0FoSixRQUFJLENBQUNpUSxRQUFMLENBQWMsVUFBVS9DLEdBQVYsRUFBZTtBQUMzQkEsU0FBRyxDQUFDc0QsV0FBSjtBQUNELEtBRkQsRUFuQjJCLENBdUIzQjtBQUNBO0FBQ0E7OztBQUNBeFEsUUFBSSxDQUFDK0ksVUFBTCxHQUFrQixLQUFsQjtBQUNBLFFBQUlxSCxTQUFTLEdBQUdwUSxJQUFJLENBQUM4SSxlQUFyQjtBQUNBOUksUUFBSSxDQUFDOEksZUFBTCxHQUF1QixJQUFJekUsR0FBSixFQUF2QjtBQUNBckUsUUFBSSxDQUFDNkksTUFBTCxHQUFjQSxNQUFkLENBN0IyQixDQStCM0I7QUFDQTtBQUNBO0FBQ0E7O0FBQ0EyRyxPQUFHLENBQUNDLHdCQUFKLENBQTZCRixTQUE3QixDQUF1Q3JLLFNBQXZDLEVBQWtELFlBQVk7QUFDNUQ7QUFDQSxVQUFJdUwsWUFBWSxHQUFHelEsSUFBSSxDQUFDMkksVUFBeEI7QUFDQTNJLFVBQUksQ0FBQzJJLFVBQUwsR0FBa0IsSUFBSXRFLEdBQUosRUFBbEI7QUFDQXJFLFVBQUksQ0FBQzRJLGNBQUwsR0FBc0IsRUFBdEI7QUFFQTZILGtCQUFZLENBQUNoTSxPQUFiLENBQXFCLFVBQVV5SSxHQUFWLEVBQWUvQixjQUFmLEVBQStCO0FBQ2xELFlBQUl1RixNQUFNLEdBQUd4RCxHQUFHLENBQUN5RCxTQUFKLEVBQWI7O0FBQ0EzUSxZQUFJLENBQUMySSxVQUFMLENBQWdCN0MsR0FBaEIsQ0FBb0JxRixjQUFwQixFQUFvQ3VGLE1BQXBDLEVBRmtELENBR2xEO0FBQ0E7OztBQUNBQSxjQUFNLENBQUNFLFdBQVA7QUFDRCxPQU5ELEVBTjRELENBYzVEO0FBQ0E7QUFDQTs7QUFDQTVRLFVBQUksQ0FBQ2dKLDBCQUFMLEdBQWtDLEtBQWxDO0FBQ0FoSixVQUFJLENBQUNtSyxrQkFBTDtBQUNELEtBbkJELEVBbkMyQixDQXdEM0I7QUFDQTtBQUNBOzs7QUFDQTVCLFVBQU0sQ0FBQ3NJLGdCQUFQLENBQXdCLFlBQVk7QUFDbEM3USxVQUFJLENBQUMrSSxVQUFMLEdBQWtCLElBQWxCOztBQUNBL0ksVUFBSSxDQUFDbVEsb0JBQUwsQ0FBMEJDLFNBQTFCOztBQUNBLFVBQUksQ0FBQ25SLENBQUMsQ0FBQ3NILE9BQUYsQ0FBVXZHLElBQUksQ0FBQ2lKLGFBQWYsQ0FBTCxFQUFvQztBQUNsQ2pKLFlBQUksQ0FBQ2dMLFNBQUwsQ0FBZWhMLElBQUksQ0FBQ2lKLGFBQXBCO0FBQ0FqSixZQUFJLENBQUNpSixhQUFMLEdBQXFCLEVBQXJCO0FBQ0Q7QUFDRixLQVBEO0FBUUQsR0EzZ0J5QjtBQTZnQjFCNkMsb0JBQWtCLEVBQUUsVUFBVUQsT0FBVixFQUFtQmlGLEtBQW5CLEVBQTBCMUQsTUFBMUIsRUFBa0NELElBQWxDLEVBQXdDO0FBQzFELFFBQUluTixJQUFJLEdBQUcsSUFBWDtBQUVBLFFBQUlrTixHQUFHLEdBQUcsSUFBSTZELFlBQUosQ0FDUi9RLElBRFEsRUFDRjZMLE9BREUsRUFDT2lGLEtBRFAsRUFDYzFELE1BRGQsRUFDc0JELElBRHRCLENBQVY7QUFFQSxRQUFJMkQsS0FBSixFQUNFOVEsSUFBSSxDQUFDMkksVUFBTCxDQUFnQjdDLEdBQWhCLENBQW9CZ0wsS0FBcEIsRUFBMkI1RCxHQUEzQixFQURGLEtBR0VsTixJQUFJLENBQUM0SSxjQUFMLENBQW9CbEosSUFBcEIsQ0FBeUJ3TixHQUF6Qjs7QUFFRkEsT0FBRyxDQUFDMEQsV0FBSjtBQUNELEdBeGhCeUI7QUEwaEIxQjtBQUNBekMsbUJBQWlCLEVBQUUsVUFBVTJDLEtBQVYsRUFBaUJ2RCxLQUFqQixFQUF3QjtBQUN6QyxRQUFJdk4sSUFBSSxHQUFHLElBQVg7QUFFQSxRQUFJZ1IsT0FBTyxHQUFHLElBQWQ7O0FBQ0EsUUFBSUYsS0FBSixFQUFXO0FBQ1QsVUFBSUcsUUFBUSxHQUFHalIsSUFBSSxDQUFDMkksVUFBTCxDQUFnQjNELEdBQWhCLENBQW9COEwsS0FBcEIsQ0FBZjs7QUFDQSxVQUFJRyxRQUFKLEVBQWM7QUFDWkQsZUFBTyxHQUFHQyxRQUFRLENBQUNDLEtBQW5COztBQUNBRCxnQkFBUSxDQUFDRSxtQkFBVDs7QUFDQUYsZ0JBQVEsQ0FBQ1QsV0FBVDs7QUFDQXhRLFlBQUksQ0FBQzJJLFVBQUwsQ0FBZ0JwRCxNQUFoQixDQUF1QnVMLEtBQXZCO0FBQ0Q7QUFDRjs7QUFFRCxRQUFJTSxRQUFRLEdBQUc7QUFBQ25ILFNBQUcsRUFBRSxPQUFOO0FBQWVoRCxRQUFFLEVBQUU2SjtBQUFuQixLQUFmOztBQUVBLFFBQUl2RCxLQUFKLEVBQVc7QUFDVDZELGNBQVEsQ0FBQzdELEtBQVQsR0FBaUJ5QyxxQkFBcUIsQ0FDcEN6QyxLQURvQyxFQUVwQ3lELE9BQU8sR0FBSSxjQUFjQSxPQUFkLEdBQXdCLE1BQXhCLEdBQWlDRixLQUFyQyxHQUNGLGlCQUFpQkEsS0FIYyxDQUF0QztBQUlEOztBQUVEOVEsUUFBSSxDQUFDb0MsSUFBTCxDQUFVZ1AsUUFBVjtBQUNELEdBbmpCeUI7QUFxakIxQjtBQUNBO0FBQ0FuRiw2QkFBMkIsRUFBRSxZQUFZO0FBQ3ZDLFFBQUlqTSxJQUFJLEdBQUcsSUFBWDs7QUFFQUEsUUFBSSxDQUFDMkksVUFBTCxDQUFnQmxFLE9BQWhCLENBQXdCLFVBQVV5SSxHQUFWLEVBQWVqRyxFQUFmLEVBQW1CO0FBQ3pDaUcsU0FBRyxDQUFDc0QsV0FBSjtBQUNELEtBRkQ7O0FBR0F4USxRQUFJLENBQUMySSxVQUFMLEdBQWtCLElBQUl0RSxHQUFKLEVBQWxCOztBQUVBckUsUUFBSSxDQUFDNEksY0FBTCxDQUFvQm5FLE9BQXBCLENBQTRCLFVBQVV5SSxHQUFWLEVBQWU7QUFDekNBLFNBQUcsQ0FBQ3NELFdBQUo7QUFDRCxLQUZEOztBQUdBeFEsUUFBSSxDQUFDNEksY0FBTCxHQUFzQixFQUF0QjtBQUNELEdBbmtCeUI7QUFxa0IxQjtBQUNBO0FBQ0E7QUFDQWtCLGdCQUFjLEVBQUUsWUFBWTtBQUMxQixRQUFJOUosSUFBSSxHQUFHLElBQVgsQ0FEMEIsQ0FHMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0EsUUFBSXFSLGtCQUFrQixHQUFHQyxRQUFRLENBQUNqUyxPQUFPLENBQUNDLEdBQVIsQ0FBWSxzQkFBWixDQUFELENBQVIsSUFBaUQsQ0FBMUU7QUFFQSxRQUFJK1Isa0JBQWtCLEtBQUssQ0FBM0IsRUFDRSxPQUFPclIsSUFBSSxDQUFDNEIsTUFBTCxDQUFZMlAsYUFBbkI7QUFFRixRQUFJQyxZQUFZLEdBQUd4UixJQUFJLENBQUM0QixNQUFMLENBQVlvSSxPQUFaLENBQW9CLGlCQUFwQixDQUFuQjtBQUNBLFFBQUksQ0FBRS9LLENBQUMsQ0FBQ3dTLFFBQUYsQ0FBV0QsWUFBWCxDQUFOLEVBQ0UsT0FBTyxJQUFQO0FBQ0ZBLGdCQUFZLEdBQUdBLFlBQVksQ0FBQ0UsSUFBYixHQUFvQkMsS0FBcEIsQ0FBMEIsU0FBMUIsQ0FBZixDQWxCMEIsQ0FvQjFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsUUFBSU4sa0JBQWtCLEdBQUcsQ0FBckIsSUFBMEJBLGtCQUFrQixHQUFHRyxZQUFZLENBQUNwTSxNQUFoRSxFQUNFLE9BQU8sSUFBUDtBQUVGLFdBQU9vTSxZQUFZLENBQUNBLFlBQVksQ0FBQ3BNLE1BQWIsR0FBc0JpTSxrQkFBdkIsQ0FBbkI7QUFDRDtBQXptQnlCLENBQTVCO0FBNG1CQTs7QUFDQTs7QUFDQTtBQUVBO0FBRUE7QUFDQTs7QUFDQTs7Ozs7Ozs7QUFNQSxJQUFJTixZQUFZLEdBQUcsVUFDZjdHLE9BRGUsRUFDTjJCLE9BRE0sRUFDR1YsY0FESCxFQUNtQmlDLE1BRG5CLEVBQzJCRCxJQUQzQixFQUNpQztBQUNsRCxNQUFJbk4sSUFBSSxHQUFHLElBQVg7QUFDQUEsTUFBSSxDQUFDZ0MsUUFBTCxHQUFnQmtJLE9BQWhCLENBRmtELENBRXpCOztBQUV6Qjs7Ozs7Ozs7QUFPQWxLLE1BQUksQ0FBQ2tDLFVBQUwsR0FBa0JnSSxPQUFPLENBQUNaLGdCQUExQixDQVhrRCxDQVdOOztBQUU1Q3RKLE1BQUksQ0FBQzRSLFFBQUwsR0FBZ0IvRixPQUFoQixDQWJrRCxDQWVsRDs7QUFDQTdMLE1BQUksQ0FBQzZSLGVBQUwsR0FBdUIxRyxjQUF2QixDQWhCa0QsQ0FpQmxEOztBQUNBbkwsTUFBSSxDQUFDa1IsS0FBTCxHQUFhL0QsSUFBYjtBQUVBbk4sTUFBSSxDQUFDOFIsT0FBTCxHQUFlMUUsTUFBTSxJQUFJLEVBQXpCLENBcEJrRCxDQXNCbEQ7QUFDQTtBQUNBOztBQUNBLE1BQUlwTixJQUFJLENBQUM2UixlQUFULEVBQTBCO0FBQ3hCN1IsUUFBSSxDQUFDK1IsbUJBQUwsR0FBMkIsTUFBTS9SLElBQUksQ0FBQzZSLGVBQXRDO0FBQ0QsR0FGRCxNQUVPO0FBQ0w3UixRQUFJLENBQUMrUixtQkFBTCxHQUEyQixNQUFNM0osTUFBTSxDQUFDbkIsRUFBUCxFQUFqQztBQUNELEdBN0JpRCxDQStCbEQ7OztBQUNBakgsTUFBSSxDQUFDZ1MsWUFBTCxHQUFvQixLQUFwQixDQWhDa0QsQ0FrQ2xEOztBQUNBaFMsTUFBSSxDQUFDaVMsY0FBTCxHQUFzQixFQUF0QixDQW5Da0QsQ0FxQ2xEO0FBQ0E7O0FBQ0FqUyxNQUFJLENBQUNrUyxVQUFMLEdBQWtCLElBQUk3TixHQUFKLEVBQWxCLENBdkNrRCxDQXlDbEQ7O0FBQ0FyRSxNQUFJLENBQUNtUyxNQUFMLEdBQWMsS0FBZCxDQTFDa0QsQ0E0Q2xEOztBQUVBOzs7Ozs7OztBQU9BblMsTUFBSSxDQUFDNkksTUFBTCxHQUFjcUIsT0FBTyxDQUFDckIsTUFBdEIsQ0FyRGtELENBdURsRDtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTdJLE1BQUksQ0FBQ29TLFNBQUwsR0FBaUI7QUFDZkMsZUFBVyxFQUFFQyxPQUFPLENBQUNELFdBRE47QUFFZkUsV0FBTyxFQUFFRCxPQUFPLENBQUNDO0FBRkYsR0FBakI7QUFLQTFILFNBQU8sQ0FBQyxZQUFELENBQVAsSUFBeUJBLE9BQU8sQ0FBQyxZQUFELENBQVAsQ0FBc0JDLEtBQXRCLENBQTRCQyxtQkFBNUIsQ0FDdkIsVUFEdUIsRUFDWCxlQURXLEVBQ00sQ0FETixDQUF6QjtBQUVELENBeEVEOztBQTBFQTlMLENBQUMsQ0FBQzJELE1BQUYsQ0FBU21PLFlBQVksQ0FBQ2xPLFNBQXRCLEVBQWlDO0FBQy9CK04sYUFBVyxFQUFFLFlBQVk7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUEsUUFBSTVRLElBQUksR0FBRyxJQUFYOztBQUNBLFFBQUk7QUFDRixVQUFJd1MsR0FBRyxHQUFHaEQsR0FBRyxDQUFDaUQsNkJBQUosQ0FBa0NsRCxTQUFsQyxDQUNSdlAsSUFEUSxFQUVSLE1BQU0wUCx3QkFBd0IsQ0FDNUIxUCxJQUFJLENBQUM0UixRQUR1QixFQUNiNVIsSUFEYSxFQUNQd0YsS0FBSyxDQUFDSSxLQUFOLENBQVk1RixJQUFJLENBQUM4UixPQUFqQixDQURPLEVBRTVCO0FBQ0E7QUFDQTtBQUNBLHNCQUFnQjlSLElBQUksQ0FBQ2tSLEtBQXJCLEdBQTZCLEdBTEQsQ0FGdEIsQ0FBVjtBQVVELEtBWEQsQ0FXRSxPQUFPd0IsQ0FBUCxFQUFVO0FBQ1YxUyxVQUFJLENBQUN1TixLQUFMLENBQVdtRixDQUFYO0FBQ0E7QUFDRCxLQXZCc0IsQ0F5QnZCOzs7QUFDQSxRQUFJMVMsSUFBSSxDQUFDMlMsY0FBTCxFQUFKLEVBQ0U7O0FBRUYzUyxRQUFJLENBQUM0UyxxQkFBTCxDQUEyQkosR0FBM0I7QUFDRCxHQS9COEI7QUFpQy9CSSx1QkFBcUIsRUFBRSxVQUFVSixHQUFWLEVBQWU7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQSxRQUFJeFMsSUFBSSxHQUFHLElBQVg7O0FBQ0EsUUFBSTZTLFFBQVEsR0FBRyxVQUFVQyxDQUFWLEVBQWE7QUFDMUIsYUFBT0EsQ0FBQyxJQUFJQSxDQUFDLENBQUNDLGNBQWQ7QUFDRCxLQUZEOztBQUdBLFFBQUlGLFFBQVEsQ0FBQ0wsR0FBRCxDQUFaLEVBQW1CO0FBQ2pCLFVBQUk7QUFDRkEsV0FBRyxDQUFDTyxjQUFKLENBQW1CL1MsSUFBbkI7QUFDRCxPQUZELENBRUUsT0FBTzBTLENBQVAsRUFBVTtBQUNWMVMsWUFBSSxDQUFDdU4sS0FBTCxDQUFXbUYsQ0FBWDtBQUNBO0FBQ0QsT0FOZ0IsQ0FPakI7QUFDQTs7O0FBQ0ExUyxVQUFJLENBQUNnVCxLQUFMO0FBQ0QsS0FWRCxNQVVPLElBQUkvVCxDQUFDLENBQUNnVSxPQUFGLENBQVVULEdBQVYsQ0FBSixFQUFvQjtBQUN6QjtBQUNBLFVBQUksQ0FBRXZULENBQUMsQ0FBQ2lVLEdBQUYsQ0FBTVYsR0FBTixFQUFXSyxRQUFYLENBQU4sRUFBNEI7QUFDMUI3UyxZQUFJLENBQUN1TixLQUFMLENBQVcsSUFBSXhGLEtBQUosQ0FBVSxtREFBVixDQUFYO0FBQ0E7QUFDRCxPQUx3QixDQU16QjtBQUNBO0FBQ0E7OztBQUNBLFVBQUlvTCxlQUFlLEdBQUcsRUFBdEI7O0FBQ0EsV0FBSyxJQUFJaE8sQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR3FOLEdBQUcsQ0FBQ3BOLE1BQXhCLEVBQWdDLEVBQUVELENBQWxDLEVBQXFDO0FBQ25DLFlBQUllLGNBQWMsR0FBR3NNLEdBQUcsQ0FBQ3JOLENBQUQsQ0FBSCxDQUFPaU8sa0JBQVAsRUFBckI7O0FBQ0EsWUFBSW5VLENBQUMsQ0FBQzRHLEdBQUYsQ0FBTXNOLGVBQU4sRUFBdUJqTixjQUF2QixDQUFKLEVBQTRDO0FBQzFDbEcsY0FBSSxDQUFDdU4sS0FBTCxDQUFXLElBQUl4RixLQUFKLENBQ1QsK0RBQ0U3QixjQUZPLENBQVg7QUFHQTtBQUNEOztBQUNEaU4sdUJBQWUsQ0FBQ2pOLGNBQUQsQ0FBZixHQUFrQyxJQUFsQztBQUNEOztBQUFBOztBQUVELFVBQUk7QUFDRmpILFNBQUMsQ0FBQ3lELElBQUYsQ0FBTzhQLEdBQVAsRUFBWSxVQUFVYSxHQUFWLEVBQWU7QUFDekJBLGFBQUcsQ0FBQ04sY0FBSixDQUFtQi9TLElBQW5CO0FBQ0QsU0FGRDtBQUdELE9BSkQsQ0FJRSxPQUFPMFMsQ0FBUCxFQUFVO0FBQ1YxUyxZQUFJLENBQUN1TixLQUFMLENBQVdtRixDQUFYO0FBQ0E7QUFDRDs7QUFDRDFTLFVBQUksQ0FBQ2dULEtBQUw7QUFDRCxLQTlCTSxNQThCQSxJQUFJUixHQUFKLEVBQVM7QUFDZDtBQUNBO0FBQ0E7QUFDQXhTLFVBQUksQ0FBQ3VOLEtBQUwsQ0FBVyxJQUFJeEYsS0FBSixDQUFVLGtEQUNFLHFCQURaLENBQVg7QUFFRDtBQUNGLEdBdEc4QjtBQXdHL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBeUksYUFBVyxFQUFFLFlBQVc7QUFDdEIsUUFBSXhRLElBQUksR0FBRyxJQUFYO0FBQ0EsUUFBSUEsSUFBSSxDQUFDZ1MsWUFBVCxFQUNFO0FBQ0ZoUyxRQUFJLENBQUNnUyxZQUFMLEdBQW9CLElBQXBCOztBQUNBaFMsUUFBSSxDQUFDc1Qsa0JBQUw7O0FBQ0F6SSxXQUFPLENBQUMsWUFBRCxDQUFQLElBQXlCQSxPQUFPLENBQUMsWUFBRCxDQUFQLENBQXNCQyxLQUF0QixDQUE0QkMsbUJBQTVCLENBQ3ZCLFVBRHVCLEVBQ1gsZUFEVyxFQUNNLENBQUMsQ0FEUCxDQUF6QjtBQUVELEdBckg4QjtBQXVIL0J1SSxvQkFBa0IsRUFBRSxZQUFZO0FBQzlCLFFBQUl0VCxJQUFJLEdBQUcsSUFBWCxDQUQ4QixDQUU5Qjs7QUFDQSxRQUFJcUcsU0FBUyxHQUFHckcsSUFBSSxDQUFDaVMsY0FBckI7QUFDQWpTLFFBQUksQ0FBQ2lTLGNBQUwsR0FBc0IsRUFBdEI7O0FBQ0FoVCxLQUFDLENBQUN5RCxJQUFGLENBQU8yRCxTQUFQLEVBQWtCLFVBQVUxRCxRQUFWLEVBQW9CO0FBQ3BDQSxjQUFRO0FBQ1QsS0FGRDtBQUdELEdBL0g4QjtBQWlJL0I7QUFDQXdPLHFCQUFtQixFQUFFLFlBQVk7QUFDL0IsUUFBSW5SLElBQUksR0FBRyxJQUFYOztBQUNBdUksVUFBTSxDQUFDc0ksZ0JBQVAsQ0FBd0IsWUFBWTtBQUNsQzdRLFVBQUksQ0FBQ2tTLFVBQUwsQ0FBZ0J6TixPQUFoQixDQUF3QixVQUFVOE8sY0FBVixFQUEwQnJOLGNBQTFCLEVBQTBDO0FBQ2hFcU4sc0JBQWMsQ0FBQzlPLE9BQWYsQ0FBdUIsVUFBVStPLEtBQVYsRUFBaUI7QUFDdEN4VCxjQUFJLENBQUNzSCxPQUFMLENBQWFwQixjQUFiLEVBQTZCbEcsSUFBSSxDQUFDb1MsU0FBTCxDQUFlRyxPQUFmLENBQXVCaUIsS0FBdkIsQ0FBN0I7QUFDRCxTQUZEO0FBR0QsT0FKRDtBQUtELEtBTkQ7QUFPRCxHQTNJOEI7QUE2SS9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTdDLFdBQVMsRUFBRSxZQUFZO0FBQ3JCLFFBQUkzUSxJQUFJLEdBQUcsSUFBWDtBQUNBLFdBQU8sSUFBSStRLFlBQUosQ0FDTC9RLElBQUksQ0FBQ2dDLFFBREEsRUFDVWhDLElBQUksQ0FBQzRSLFFBRGYsRUFDeUI1UixJQUFJLENBQUM2UixlQUQ5QixFQUMrQzdSLElBQUksQ0FBQzhSLE9BRHBELEVBRUw5UixJQUFJLENBQUNrUixLQUZBLENBQVA7QUFHRCxHQXZKOEI7O0FBeUovQjs7Ozs7OztBQU9BM0QsT0FBSyxFQUFFLFVBQVVBLEtBQVYsRUFBaUI7QUFDdEIsUUFBSXZOLElBQUksR0FBRyxJQUFYO0FBQ0EsUUFBSUEsSUFBSSxDQUFDMlMsY0FBTCxFQUFKLEVBQ0U7O0FBQ0YzUyxRQUFJLENBQUNnQyxRQUFMLENBQWNtTSxpQkFBZCxDQUFnQ25PLElBQUksQ0FBQzZSLGVBQXJDLEVBQXNEdEUsS0FBdEQ7QUFDRCxHQXJLOEI7QUF1Sy9CO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7QUFNQXhCLE1BQUksRUFBRSxZQUFZO0FBQ2hCLFFBQUkvTCxJQUFJLEdBQUcsSUFBWDtBQUNBLFFBQUlBLElBQUksQ0FBQzJTLGNBQUwsRUFBSixFQUNFOztBQUNGM1MsUUFBSSxDQUFDZ0MsUUFBTCxDQUFjbU0saUJBQWQsQ0FBZ0NuTyxJQUFJLENBQUM2UixlQUFyQztBQUNELEdBdkw4Qjs7QUF5TC9COzs7Ozs7O0FBT0E0QixRQUFNLEVBQUUsVUFBVTlRLFFBQVYsRUFBb0I7QUFDMUIsUUFBSTNDLElBQUksR0FBRyxJQUFYO0FBQ0EyQyxZQUFRLEdBQUc0RixNQUFNLENBQUNvQixlQUFQLENBQXVCaEgsUUFBdkIsRUFBaUMsaUJBQWpDLEVBQW9EM0MsSUFBcEQsQ0FBWDtBQUNBLFFBQUlBLElBQUksQ0FBQzJTLGNBQUwsRUFBSixFQUNFaFEsUUFBUSxHQURWLEtBR0UzQyxJQUFJLENBQUNpUyxjQUFMLENBQW9CdlMsSUFBcEIsQ0FBeUJpRCxRQUF6QjtBQUNILEdBdk04QjtBQXlNL0I7QUFDQTtBQUNBO0FBQ0FnUSxnQkFBYyxFQUFFLFlBQVk7QUFDMUIsUUFBSTNTLElBQUksR0FBRyxJQUFYO0FBQ0EsV0FBT0EsSUFBSSxDQUFDZ1MsWUFBTCxJQUFxQmhTLElBQUksQ0FBQ2dDLFFBQUwsQ0FBY3NHLE9BQWQsS0FBMEIsSUFBdEQ7QUFDRCxHQS9NOEI7O0FBaU4vQjs7Ozs7Ozs7O0FBU0FuQixPQUFLLEVBQUUsVUFBVWpCLGNBQVYsRUFBMEJlLEVBQTFCLEVBQThCTSxNQUE5QixFQUFzQztBQUMzQyxRQUFJdkgsSUFBSSxHQUFHLElBQVg7QUFDQSxRQUFJQSxJQUFJLENBQUMyUyxjQUFMLEVBQUosRUFDRTtBQUNGMUwsTUFBRSxHQUFHakgsSUFBSSxDQUFDb1MsU0FBTCxDQUFlQyxXQUFmLENBQTJCcEwsRUFBM0IsQ0FBTDs7QUFDQSxRQUFJeU0sR0FBRyxHQUFHMVQsSUFBSSxDQUFDa1MsVUFBTCxDQUFnQmxOLEdBQWhCLENBQW9Ca0IsY0FBcEIsQ0FBVjs7QUFDQSxRQUFJd04sR0FBRyxJQUFJLElBQVgsRUFBaUI7QUFDZkEsU0FBRyxHQUFHLElBQUl2UCxHQUFKLEVBQU47O0FBQ0FuRSxVQUFJLENBQUNrUyxVQUFMLENBQWdCcE0sR0FBaEIsQ0FBb0JJLGNBQXBCLEVBQW9Dd04sR0FBcEM7QUFDRDs7QUFDREEsT0FBRyxDQUFDN0wsR0FBSixDQUFRWixFQUFSOztBQUNBakgsUUFBSSxDQUFDZ0MsUUFBTCxDQUFjbUYsS0FBZCxDQUFvQm5ILElBQUksQ0FBQytSLG1CQUF6QixFQUE4QzdMLGNBQTlDLEVBQThEZSxFQUE5RCxFQUFrRU0sTUFBbEU7QUFDRCxHQXRPOEI7O0FBd08vQjs7Ozs7Ozs7O0FBU0FJLFNBQU8sRUFBRSxVQUFVekIsY0FBVixFQUEwQmUsRUFBMUIsRUFBOEJNLE1BQTlCLEVBQXNDO0FBQzdDLFFBQUl2SCxJQUFJLEdBQUcsSUFBWDtBQUNBLFFBQUlBLElBQUksQ0FBQzJTLGNBQUwsRUFBSixFQUNFO0FBQ0YxTCxNQUFFLEdBQUdqSCxJQUFJLENBQUNvUyxTQUFMLENBQWVDLFdBQWYsQ0FBMkJwTCxFQUEzQixDQUFMOztBQUNBakgsUUFBSSxDQUFDZ0MsUUFBTCxDQUFjMkYsT0FBZCxDQUFzQjNILElBQUksQ0FBQytSLG1CQUEzQixFQUFnRDdMLGNBQWhELEVBQWdFZSxFQUFoRSxFQUFvRU0sTUFBcEU7QUFDRCxHQXZQOEI7O0FBeVAvQjs7Ozs7Ozs7QUFRQUQsU0FBTyxFQUFFLFVBQVVwQixjQUFWLEVBQTBCZSxFQUExQixFQUE4QjtBQUNyQyxRQUFJakgsSUFBSSxHQUFHLElBQVg7QUFDQSxRQUFJQSxJQUFJLENBQUMyUyxjQUFMLEVBQUosRUFDRTtBQUNGMUwsTUFBRSxHQUFHakgsSUFBSSxDQUFDb1MsU0FBTCxDQUFlQyxXQUFmLENBQTJCcEwsRUFBM0IsQ0FBTCxDQUpxQyxDQUtyQztBQUNBOztBQUNBakgsUUFBSSxDQUFDa1MsVUFBTCxDQUFnQmxOLEdBQWhCLENBQW9Ca0IsY0FBcEIsRUFBb0NYLE1BQXBDLENBQTJDMEIsRUFBM0M7O0FBQ0FqSCxRQUFJLENBQUNnQyxRQUFMLENBQWNzRixPQUFkLENBQXNCdEgsSUFBSSxDQUFDK1IsbUJBQTNCLEVBQWdEN0wsY0FBaEQsRUFBZ0VlLEVBQWhFO0FBQ0QsR0ExUThCOztBQTRRL0I7Ozs7OztBQU1BK0wsT0FBSyxFQUFFLFlBQVk7QUFDakIsUUFBSWhULElBQUksR0FBRyxJQUFYO0FBQ0EsUUFBSUEsSUFBSSxDQUFDMlMsY0FBTCxFQUFKLEVBQ0U7QUFDRixRQUFJLENBQUMzUyxJQUFJLENBQUM2UixlQUFWLEVBQ0UsT0FMZSxDQUtOOztBQUNYLFFBQUksQ0FBQzdSLElBQUksQ0FBQ21TLE1BQVYsRUFBa0I7QUFDaEJuUyxVQUFJLENBQUNnQyxRQUFMLENBQWNnSixTQUFkLENBQXdCLENBQUNoTCxJQUFJLENBQUM2UixlQUFOLENBQXhCOztBQUNBN1IsVUFBSSxDQUFDbVMsTUFBTCxHQUFjLElBQWQ7QUFDRDtBQUNGO0FBNVI4QixDQUFqQztBQStSQTs7QUFDQTs7QUFDQTs7O0FBRUF3QixNQUFNLEdBQUcsVUFBVXhMLE9BQVYsRUFBbUI7QUFDMUIsTUFBSW5JLElBQUksR0FBRyxJQUFYLENBRDBCLENBRzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBQSxNQUFJLENBQUNtSSxPQUFMLEdBQWVsSixDQUFDLENBQUMyVSxRQUFGLENBQVd6TCxPQUFPLElBQUksRUFBdEIsRUFBMEI7QUFDdkNrQyxxQkFBaUIsRUFBRSxLQURvQjtBQUV2Q0ksb0JBQWdCLEVBQUUsS0FGcUI7QUFHdkM7QUFDQXBCLGtCQUFjLEVBQUU7QUFKdUIsR0FBMUIsQ0FBZixDQVYwQixDQWlCMUI7QUFDQTtBQUNBO0FBQ0E7O0FBQ0FySixNQUFJLENBQUM2VCxnQkFBTCxHQUF3QixJQUFJQyxJQUFKLENBQVM7QUFDL0JDLHdCQUFvQixFQUFFO0FBRFMsR0FBVCxDQUF4QixDQXJCMEIsQ0F5QjFCOztBQUNBL1QsTUFBSSxDQUFDK00sYUFBTCxHQUFxQixJQUFJK0csSUFBSixDQUFTO0FBQzVCQyx3QkFBb0IsRUFBRTtBQURNLEdBQVQsQ0FBckI7QUFJQS9ULE1BQUksQ0FBQ3NOLGdCQUFMLEdBQXdCLEVBQXhCO0FBQ0F0TixNQUFJLENBQUM0TCwwQkFBTCxHQUFrQyxFQUFsQztBQUVBNUwsTUFBSSxDQUFDMk8sZUFBTCxHQUF1QixFQUF2QjtBQUVBM08sTUFBSSxDQUFDZ1UsUUFBTCxHQUFnQixJQUFJM1AsR0FBSixFQUFoQixDQW5DMEIsQ0FtQ0M7O0FBRTNCckUsTUFBSSxDQUFDaVUsYUFBTCxHQUFxQixJQUFJbFUsWUFBSixFQUFyQjtBQUVBQyxNQUFJLENBQUNpVSxhQUFMLENBQW1CblIsUUFBbkIsQ0FBNEIsVUFBVWxCLE1BQVYsRUFBa0I7QUFDNUM7QUFDQUEsVUFBTSxDQUFDb0ssY0FBUCxHQUF3QixJQUF4Qjs7QUFFQSxRQUFJTSxTQUFTLEdBQUcsVUFBVUMsTUFBVixFQUFrQkMsZ0JBQWxCLEVBQW9DO0FBQ2xELFVBQUl2QyxHQUFHLEdBQUc7QUFBQ0EsV0FBRyxFQUFFLE9BQU47QUFBZXNDLGNBQU0sRUFBRUE7QUFBdkIsT0FBVjtBQUNBLFVBQUlDLGdCQUFKLEVBQ0V2QyxHQUFHLENBQUN1QyxnQkFBSixHQUF1QkEsZ0JBQXZCO0FBQ0Y1SyxZQUFNLENBQUNRLElBQVAsQ0FBWW1JLFNBQVMsQ0FBQzhCLFlBQVYsQ0FBdUJwQyxHQUF2QixDQUFaO0FBQ0QsS0FMRDs7QUFPQXJJLFVBQU0sQ0FBQ0QsRUFBUCxDQUFVLE1BQVYsRUFBa0IsVUFBVXVTLE9BQVYsRUFBbUI7QUFDbkMsVUFBSTNMLE1BQU0sQ0FBQzRMLGlCQUFYLEVBQThCO0FBQzVCNUwsY0FBTSxDQUFDNkQsTUFBUCxDQUFjLGNBQWQsRUFBOEI4SCxPQUE5QjtBQUNEOztBQUNELFVBQUk7QUFDRixZQUFJO0FBQ0YsY0FBSWpLLEdBQUcsR0FBR00sU0FBUyxDQUFDNkosUUFBVixDQUFtQkYsT0FBbkIsQ0FBVjtBQUNELFNBRkQsQ0FFRSxPQUFPbE0sR0FBUCxFQUFZO0FBQ1pzRSxtQkFBUyxDQUFDLGFBQUQsQ0FBVDtBQUNBO0FBQ0Q7O0FBQ0QsWUFBSXJDLEdBQUcsS0FBSyxJQUFSLElBQWdCLENBQUNBLEdBQUcsQ0FBQ0EsR0FBekIsRUFBOEI7QUFDNUJxQyxtQkFBUyxDQUFDLGFBQUQsRUFBZ0JyQyxHQUFoQixDQUFUO0FBQ0E7QUFDRDs7QUFFRCxZQUFJQSxHQUFHLENBQUNBLEdBQUosS0FBWSxTQUFoQixFQUEyQjtBQUN6QixjQUFJckksTUFBTSxDQUFDb0ssY0FBWCxFQUEyQjtBQUN6Qk0scUJBQVMsQ0FBQyxtQkFBRCxFQUFzQnJDLEdBQXRCLENBQVQ7QUFDQTtBQUNEOztBQUNEakcsZUFBSyxDQUFDLFlBQVk7QUFDaEJoRSxnQkFBSSxDQUFDcVUsY0FBTCxDQUFvQnpTLE1BQXBCLEVBQTRCcUksR0FBNUI7QUFDRCxXQUZJLENBQUwsQ0FFR0csR0FGSDtBQUdBO0FBQ0Q7O0FBRUQsWUFBSSxDQUFDeEksTUFBTSxDQUFDb0ssY0FBWixFQUE0QjtBQUMxQk0sbUJBQVMsQ0FBQyxvQkFBRCxFQUF1QnJDLEdBQXZCLENBQVQ7QUFDQTtBQUNEOztBQUNEckksY0FBTSxDQUFDb0ssY0FBUCxDQUFzQlMsY0FBdEIsQ0FBcUN4QyxHQUFyQztBQUNELE9BNUJELENBNEJFLE9BQU95SSxDQUFQLEVBQVU7QUFDVjtBQUNBbkssY0FBTSxDQUFDNkQsTUFBUCxDQUFjLDZDQUFkLEVBQTZEbkMsR0FBN0QsRUFBa0V5SSxDQUFsRTtBQUNEO0FBQ0YsS0FwQ0Q7QUFzQ0E5USxVQUFNLENBQUNELEVBQVAsQ0FBVSxPQUFWLEVBQW1CLFlBQVk7QUFDN0IsVUFBSUMsTUFBTSxDQUFDb0ssY0FBWCxFQUEyQjtBQUN6QmhJLGFBQUssQ0FBQyxZQUFZO0FBQ2hCcEMsZ0JBQU0sQ0FBQ29LLGNBQVAsQ0FBc0J6QyxLQUF0QjtBQUNELFNBRkksQ0FBTCxDQUVHYSxHQUZIO0FBR0Q7QUFDRixLQU5EO0FBT0QsR0F4REQ7QUF5REQsQ0FoR0Q7O0FBa0dBbkwsQ0FBQyxDQUFDMkQsTUFBRixDQUFTK1EsTUFBTSxDQUFDOVEsU0FBaEIsRUFBMkI7QUFFekI7Ozs7Ozs7QUFPQXlSLGNBQVksRUFBRSxVQUFVN0ssRUFBVixFQUFjO0FBQzFCLFFBQUl6SixJQUFJLEdBQUcsSUFBWDtBQUNBLFdBQU9BLElBQUksQ0FBQzZULGdCQUFMLENBQXNCL1EsUUFBdEIsQ0FBK0IyRyxFQUEvQixDQUFQO0FBQ0QsR0Fad0I7O0FBY3pCOzs7Ozs7O0FBT0E4SyxXQUFTLEVBQUUsVUFBVTlLLEVBQVYsRUFBYztBQUN2QixRQUFJekosSUFBSSxHQUFHLElBQVg7QUFDQSxXQUFPQSxJQUFJLENBQUMrTSxhQUFMLENBQW1CakssUUFBbkIsQ0FBNEIyRyxFQUE1QixDQUFQO0FBQ0QsR0F4QndCO0FBMEJ6QjRLLGdCQUFjLEVBQUUsVUFBVXpTLE1BQVYsRUFBa0JxSSxHQUFsQixFQUF1QjtBQUNyQyxRQUFJakssSUFBSSxHQUFHLElBQVgsQ0FEcUMsQ0FHckM7QUFDQTs7QUFDQSxRQUFJLEVBQUUsT0FBUWlLLEdBQUcsQ0FBQy9CLE9BQVosS0FBeUIsUUFBekIsSUFDQWpKLENBQUMsQ0FBQ2dVLE9BQUYsQ0FBVWhKLEdBQUcsQ0FBQ3VLLE9BQWQsQ0FEQSxJQUVBdlYsQ0FBQyxDQUFDaVUsR0FBRixDQUFNakosR0FBRyxDQUFDdUssT0FBVixFQUFtQnZWLENBQUMsQ0FBQ3dTLFFBQXJCLENBRkEsSUFHQXhTLENBQUMsQ0FBQ3dWLFFBQUYsQ0FBV3hLLEdBQUcsQ0FBQ3VLLE9BQWYsRUFBd0J2SyxHQUFHLENBQUMvQixPQUE1QixDQUhGLENBQUosRUFHNkM7QUFDM0N0RyxZQUFNLENBQUNRLElBQVAsQ0FBWW1JLFNBQVMsQ0FBQzhCLFlBQVYsQ0FBdUI7QUFBQ3BDLFdBQUcsRUFBRSxRQUFOO0FBQ1QvQixlQUFPLEVBQUVxQyxTQUFTLENBQUNtSyxzQkFBVixDQUFpQyxDQUFqQztBQURBLE9BQXZCLENBQVo7QUFFQTlTLFlBQU0sQ0FBQzJILEtBQVA7QUFDQTtBQUNELEtBYm9DLENBZXJDO0FBQ0E7OztBQUNBLFFBQUlyQixPQUFPLEdBQUd5TSxnQkFBZ0IsQ0FBQzFLLEdBQUcsQ0FBQ3VLLE9BQUwsRUFBY2pLLFNBQVMsQ0FBQ21LLHNCQUF4QixDQUE5Qjs7QUFFQSxRQUFJekssR0FBRyxDQUFDL0IsT0FBSixLQUFnQkEsT0FBcEIsRUFBNkI7QUFDM0I7QUFDQTtBQUNBO0FBQ0F0RyxZQUFNLENBQUNRLElBQVAsQ0FBWW1JLFNBQVMsQ0FBQzhCLFlBQVYsQ0FBdUI7QUFBQ3BDLFdBQUcsRUFBRSxRQUFOO0FBQWdCL0IsZUFBTyxFQUFFQTtBQUF6QixPQUF2QixDQUFaO0FBQ0F0RyxZQUFNLENBQUMySCxLQUFQO0FBQ0E7QUFDRCxLQTFCb0MsQ0E0QnJDO0FBQ0E7QUFDQTs7O0FBQ0EzSCxVQUFNLENBQUNvSyxjQUFQLEdBQXdCLElBQUkvRCxPQUFKLENBQVlqSSxJQUFaLEVBQWtCa0ksT0FBbEIsRUFBMkJ0RyxNQUEzQixFQUFtQzVCLElBQUksQ0FBQ21JLE9BQXhDLENBQXhCO0FBQ0FuSSxRQUFJLENBQUNnVSxRQUFMLENBQWNsTyxHQUFkLENBQWtCbEUsTUFBTSxDQUFDb0ssY0FBUCxDQUFzQi9FLEVBQXhDLEVBQTRDckYsTUFBTSxDQUFDb0ssY0FBbkQ7QUFDQWhNLFFBQUksQ0FBQzZULGdCQUFMLENBQXNCblIsSUFBdEIsQ0FBMkIsVUFBVUMsUUFBVixFQUFvQjtBQUM3QyxVQUFJZixNQUFNLENBQUNvSyxjQUFYLEVBQ0VySixRQUFRLENBQUNmLE1BQU0sQ0FBQ29LLGNBQVAsQ0FBc0IxQyxnQkFBdkIsQ0FBUjtBQUNGLGFBQU8sSUFBUDtBQUNELEtBSkQ7QUFLRCxHQWhFd0I7O0FBaUV6Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF1QkE7Ozs7Ozs7O0FBUUFzTCxTQUFPLEVBQUUsVUFBVXpILElBQVYsRUFBZ0J0QixPQUFoQixFQUF5QjFELE9BQXpCLEVBQWtDO0FBQ3pDLFFBQUluSSxJQUFJLEdBQUcsSUFBWDs7QUFFQSxRQUFJLENBQUVmLENBQUMsQ0FBQzRWLFFBQUYsQ0FBVzFILElBQVgsQ0FBTixFQUF3QjtBQUN0QmhGLGFBQU8sR0FBR0EsT0FBTyxJQUFJLEVBQXJCOztBQUVBLFVBQUlnRixJQUFJLElBQUlBLElBQUksSUFBSW5OLElBQUksQ0FBQ3NOLGdCQUF6QixFQUEyQztBQUN6Qy9FLGNBQU0sQ0FBQzZELE1BQVAsQ0FBYyx1Q0FBdUNlLElBQXZDLEdBQThDLEdBQTVEOztBQUNBO0FBQ0Q7O0FBRUQsVUFBSXRDLE9BQU8sQ0FBQ2lLLFdBQVIsSUFBdUIsQ0FBQzNNLE9BQU8sQ0FBQzRNLE9BQXBDLEVBQTZDO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBSSxDQUFDL1UsSUFBSSxDQUFDZ1Ysd0JBQVYsRUFBb0M7QUFDbENoVixjQUFJLENBQUNnVix3QkFBTCxHQUFnQyxJQUFoQzs7QUFDQXpNLGdCQUFNLENBQUM2RCxNQUFQLENBQ04sMEVBQ0EseUVBREEsR0FFQSx1RUFGQSxHQUdBLHlDQUhBLEdBSUEsTUFKQSxHQUtBLGdFQUxBLEdBTUEsTUFOQSxHQU9BLG9DQVBBLEdBUUEsTUFSQSxHQVNBLDhFQVRBLEdBVUEsd0RBWE07QUFZRDtBQUNGOztBQUVELFVBQUllLElBQUosRUFDRW5OLElBQUksQ0FBQ3NOLGdCQUFMLENBQXNCSCxJQUF0QixJQUE4QnRCLE9BQTlCLENBREYsS0FFSztBQUNIN0wsWUFBSSxDQUFDNEwsMEJBQUwsQ0FBZ0NsTSxJQUFoQyxDQUFxQ21NLE9BQXJDLEVBREcsQ0FFSDtBQUNBO0FBQ0E7O0FBQ0E3TCxZQUFJLENBQUNnVSxRQUFMLENBQWN2UCxPQUFkLENBQXNCLFVBQVV5RixPQUFWLEVBQW1CO0FBQ3ZDLGNBQUksQ0FBQ0EsT0FBTyxDQUFDbEIsMEJBQWIsRUFBeUM7QUFDdkNoRixpQkFBSyxDQUFDLFlBQVc7QUFDZmtHLHFCQUFPLENBQUM0QixrQkFBUixDQUEyQkQsT0FBM0I7QUFDRCxhQUZJLENBQUwsQ0FFR3pCLEdBRkg7QUFHRDtBQUNGLFNBTkQ7QUFPRDtBQUNGLEtBaERELE1BaURJO0FBQ0ZuTCxPQUFDLENBQUN5RCxJQUFGLENBQU95SyxJQUFQLEVBQWEsVUFBU3ZJLEtBQVQsRUFBZ0JELEdBQWhCLEVBQXFCO0FBQ2hDM0UsWUFBSSxDQUFDNFUsT0FBTCxDQUFhalEsR0FBYixFQUFrQkMsS0FBbEIsRUFBeUIsRUFBekI7QUFDRCxPQUZEO0FBR0Q7QUFDRixHQXpKd0I7QUEySnpCc0gsZ0JBQWMsRUFBRSxVQUFVaEMsT0FBVixFQUFtQjtBQUNqQyxRQUFJbEssSUFBSSxHQUFHLElBQVg7QUFDQUEsUUFBSSxDQUFDZ1UsUUFBTCxDQUFjek8sTUFBZCxDQUFxQjJFLE9BQU8sQ0FBQ2pELEVBQTdCO0FBQ0QsR0E5SndCOztBQWdLekI7Ozs7Ozs7QUFPQXlILFNBQU8sRUFBRSxVQUFVQSxPQUFWLEVBQW1CO0FBQzFCLFFBQUkxTyxJQUFJLEdBQUcsSUFBWDs7QUFDQWYsS0FBQyxDQUFDeUQsSUFBRixDQUFPZ00sT0FBUCxFQUFnQixVQUFVdUcsSUFBVixFQUFnQjlILElBQWhCLEVBQXNCO0FBQ3BDLFVBQUksT0FBTzhILElBQVAsS0FBZ0IsVUFBcEIsRUFDRSxNQUFNLElBQUlsTixLQUFKLENBQVUsYUFBYW9GLElBQWIsR0FBb0Isc0JBQTlCLENBQU47QUFDRixVQUFJbk4sSUFBSSxDQUFDMk8sZUFBTCxDQUFxQnhCLElBQXJCLENBQUosRUFDRSxNQUFNLElBQUlwRixLQUFKLENBQVUscUJBQXFCb0YsSUFBckIsR0FBNEIsc0JBQXRDLENBQU47QUFDRm5OLFVBQUksQ0FBQzJPLGVBQUwsQ0FBcUJ4QixJQUFyQixJQUE2QjhILElBQTdCO0FBQ0QsS0FORDtBQU9ELEdBaEx3QjtBQWtMekJoSSxNQUFJLEVBQUUsVUFBVUUsSUFBVixFQUF5QjtBQUFBLHNDQUFOM0osSUFBTTtBQUFOQSxVQUFNO0FBQUE7O0FBQzdCLFFBQUlBLElBQUksQ0FBQzRCLE1BQUwsSUFBZSxPQUFPNUIsSUFBSSxDQUFDQSxJQUFJLENBQUM0QixNQUFMLEdBQWMsQ0FBZixDQUFYLEtBQWlDLFVBQXBELEVBQWdFO0FBQzlEO0FBQ0E7QUFDQSxVQUFJekMsUUFBUSxHQUFHYSxJQUFJLENBQUMwUixHQUFMLEVBQWY7QUFDRDs7QUFFRCxXQUFPLEtBQUtwUixLQUFMLENBQVdxSixJQUFYLEVBQWlCM0osSUFBakIsRUFBdUJiLFFBQXZCLENBQVA7QUFDRCxHQTFMd0I7QUE0THpCO0FBQ0F3UyxXQUFTLEVBQUUsVUFBVWhJLElBQVYsRUFBeUI7QUFBQSx1Q0FBTjNKLElBQU07QUFBTkEsVUFBTTtBQUFBOztBQUNsQyxXQUFPLEtBQUs0UixVQUFMLENBQWdCakksSUFBaEIsRUFBc0IzSixJQUF0QixDQUFQO0FBQ0QsR0EvTHdCO0FBaU16Qk0sT0FBSyxFQUFFLFVBQVVxSixJQUFWLEVBQWdCM0osSUFBaEIsRUFBc0IyRSxPQUF0QixFQUErQnhGLFFBQS9CLEVBQXlDO0FBQzlDO0FBQ0E7QUFDQSxRQUFJLENBQUVBLFFBQUYsSUFBYyxPQUFPd0YsT0FBUCxLQUFtQixVQUFyQyxFQUFpRDtBQUMvQ3hGLGNBQVEsR0FBR3dGLE9BQVg7QUFDQUEsYUFBTyxHQUFHLEVBQVY7QUFDRCxLQUhELE1BR087QUFDTEEsYUFBTyxHQUFHQSxPQUFPLElBQUksRUFBckI7QUFDRDs7QUFFRCxVQUFNK0csT0FBTyxHQUFHLEtBQUtrRyxVQUFMLENBQWdCakksSUFBaEIsRUFBc0IzSixJQUF0QixFQUE0QjJFLE9BQTVCLENBQWhCLENBVjhDLENBWTlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0EsUUFBSXhGLFFBQUosRUFBYztBQUNadU0sYUFBTyxDQUFDVyxJQUFSLENBQ0VDLE1BQU0sSUFBSW5OLFFBQVEsQ0FBQ3VDLFNBQUQsRUFBWTRLLE1BQVosQ0FEcEIsRUFFRUMsU0FBUyxJQUFJcE4sUUFBUSxDQUFDb04sU0FBRCxDQUZ2QjtBQUlELEtBTEQsTUFLTztBQUNMLGFBQU9iLE9BQU8sQ0FBQ21HLEtBQVIsRUFBUDtBQUNEO0FBQ0YsR0ExTndCO0FBNE56QjtBQUNBRCxZQUFVLEVBQUUsVUFBVWpJLElBQVYsRUFBZ0IzSixJQUFoQixFQUFzQjJFLE9BQXRCLEVBQStCO0FBQ3pDO0FBQ0EsUUFBSTBELE9BQU8sR0FBRyxLQUFLOEMsZUFBTCxDQUFxQnhCLElBQXJCLENBQWQ7O0FBQ0EsUUFBSSxDQUFFdEIsT0FBTixFQUFlO0FBQ2IsYUFBT3NELE9BQU8sQ0FBQ0UsTUFBUixDQUNMLElBQUk5RyxNQUFNLENBQUNSLEtBQVgsQ0FBaUIsR0FBakIsb0JBQWlDb0YsSUFBakMsaUJBREssQ0FBUDtBQUdELEtBUHdDLENBU3pDO0FBQ0E7QUFDQTs7O0FBQ0EsUUFBSXRFLE1BQU0sR0FBRyxJQUFiOztBQUNBLFFBQUlnRyxTQUFTLEdBQUcsWUFBVztBQUN6QixZQUFNLElBQUk5RyxLQUFKLENBQVUsd0RBQVYsQ0FBTjtBQUNELEtBRkQ7O0FBR0EsUUFBSTdGLFVBQVUsR0FBRyxJQUFqQjs7QUFDQSxRQUFJb1QsdUJBQXVCLEdBQUc5RixHQUFHLENBQUNDLHdCQUFKLENBQTZCekssR0FBN0IsRUFBOUI7O0FBQ0EsUUFBSXVRLDRCQUE0QixHQUFHL0YsR0FBRyxDQUFDaUQsNkJBQUosQ0FBa0N6TixHQUFsQyxFQUFuQzs7QUFDQSxRQUFJcUosVUFBVSxHQUFHLElBQWpCOztBQUNBLFFBQUlpSCx1QkFBSixFQUE2QjtBQUMzQnpNLFlBQU0sR0FBR3lNLHVCQUF1QixDQUFDek0sTUFBakM7O0FBQ0FnRyxlQUFTLEdBQUcsVUFBU2hHLE1BQVQsRUFBaUI7QUFDM0J5TSwrQkFBdUIsQ0FBQ3pHLFNBQXhCLENBQWtDaEcsTUFBbEM7QUFDRCxPQUZEOztBQUdBM0csZ0JBQVUsR0FBR29ULHVCQUF1QixDQUFDcFQsVUFBckM7QUFDQW1NLGdCQUFVLEdBQUc5RCxTQUFTLENBQUNpTCxXQUFWLENBQXNCRix1QkFBdEIsRUFBK0NuSSxJQUEvQyxDQUFiO0FBQ0QsS0FQRCxNQU9PLElBQUlvSSw0QkFBSixFQUFrQztBQUN2QzFNLFlBQU0sR0FBRzBNLDRCQUE0QixDQUFDMU0sTUFBdEM7O0FBQ0FnRyxlQUFTLEdBQUcsVUFBU2hHLE1BQVQsRUFBaUI7QUFDM0IwTSxvQ0FBNEIsQ0FBQ3ZULFFBQTdCLENBQXNDOE0sVUFBdEMsQ0FBaURqRyxNQUFqRDtBQUNELE9BRkQ7O0FBR0EzRyxnQkFBVSxHQUFHcVQsNEJBQTRCLENBQUNyVCxVQUExQztBQUNEOztBQUVELFFBQUk2TSxVQUFVLEdBQUcsSUFBSXhFLFNBQVMsQ0FBQ3lFLGdCQUFkLENBQStCO0FBQzlDQyxrQkFBWSxFQUFFLEtBRGdDO0FBRTlDcEcsWUFGOEM7QUFHOUNnRyxlQUg4QztBQUk5QzNNLGdCQUo4QztBQUs5Q21NO0FBTDhDLEtBQS9CLENBQWpCO0FBUUEsV0FBTyxJQUFJYyxPQUFKLENBQVlDLE9BQU8sSUFBSUEsT0FBTyxDQUNuQ0ksR0FBRyxDQUFDQyx3QkFBSixDQUE2QkYsU0FBN0IsQ0FDRVIsVUFERixFQUVFLE1BQU1XLHdCQUF3QixDQUM1QjdELE9BRDRCLEVBQ25Ca0QsVUFEbUIsRUFDUHZKLEtBQUssQ0FBQ0ksS0FBTixDQUFZcEMsSUFBWixDQURPLEVBRTVCLHVCQUF1QjJKLElBQXZCLEdBQThCLEdBRkYsQ0FGaEMsQ0FEbUMsQ0FBOUIsRUFRSjBDLElBUkksQ0FRQ3JLLEtBQUssQ0FBQ0ksS0FSUCxDQUFQO0FBU0QsR0FqUndCO0FBbVJ6QjZQLGdCQUFjLEVBQUUsVUFBVUMsU0FBVixFQUFxQjtBQUNuQyxRQUFJMVYsSUFBSSxHQUFHLElBQVg7QUFDQSxRQUFJa0ssT0FBTyxHQUFHbEssSUFBSSxDQUFDZ1UsUUFBTCxDQUFjaFAsR0FBZCxDQUFrQjBRLFNBQWxCLENBQWQ7QUFDQSxRQUFJeEwsT0FBSixFQUNFLE9BQU9BLE9BQU8sQ0FBQ2YsVUFBZixDQURGLEtBR0UsT0FBTyxJQUFQO0FBQ0g7QUExUndCLENBQTNCOztBQTZSQSxJQUFJd0wsZ0JBQWdCLEdBQUcsVUFBVWdCLHVCQUFWLEVBQ1VDLHVCQURWLEVBQ21DO0FBQ3hELE1BQUlDLGNBQWMsR0FBRzVXLENBQUMsQ0FBQytHLElBQUYsQ0FBTzJQLHVCQUFQLEVBQWdDLFVBQVV6TixPQUFWLEVBQW1CO0FBQ3RFLFdBQU9qSixDQUFDLENBQUN3VixRQUFGLENBQVdtQix1QkFBWCxFQUFvQzFOLE9BQXBDLENBQVA7QUFDRCxHQUZvQixDQUFyQjs7QUFHQSxNQUFJLENBQUMyTixjQUFMLEVBQXFCO0FBQ25CQSxrQkFBYyxHQUFHRCx1QkFBdUIsQ0FBQyxDQUFELENBQXhDO0FBQ0Q7O0FBQ0QsU0FBT0MsY0FBUDtBQUNELENBVEQ7O0FBV0E5UixTQUFTLENBQUMrUixpQkFBVixHQUE4Qm5CLGdCQUE5QixDLENBR0E7QUFDQTs7QUFDQSxJQUFJM0UscUJBQXFCLEdBQUcsVUFBVUQsU0FBVixFQUFxQmdHLE9BQXJCLEVBQThCO0FBQ3hELE1BQUksQ0FBQ2hHLFNBQUwsRUFBZ0IsT0FBT0EsU0FBUCxDQUR3QyxDQUd4RDtBQUNBO0FBQ0E7O0FBQ0EsTUFBSUEsU0FBUyxDQUFDaUcsWUFBZCxFQUE0QjtBQUMxQixRQUFJLEVBQUVqRyxTQUFTLFlBQVl4SCxNQUFNLENBQUNSLEtBQTlCLENBQUosRUFBMEM7QUFDeEMsWUFBTWtPLGVBQWUsR0FBR2xHLFNBQVMsQ0FBQ21HLE9BQWxDO0FBQ0FuRyxlQUFTLEdBQUcsSUFBSXhILE1BQU0sQ0FBQ1IsS0FBWCxDQUFpQmdJLFNBQVMsQ0FBQ3hDLEtBQTNCLEVBQWtDd0MsU0FBUyxDQUFDeEQsTUFBNUMsRUFBb0R3RCxTQUFTLENBQUNvRyxPQUE5RCxDQUFaO0FBQ0FwRyxlQUFTLENBQUNtRyxPQUFWLEdBQW9CRCxlQUFwQjtBQUNEOztBQUNELFdBQU9sRyxTQUFQO0FBQ0QsR0FidUQsQ0FleEQ7QUFDQTs7O0FBQ0EsTUFBSSxDQUFDQSxTQUFTLENBQUNxRyxlQUFmLEVBQWdDO0FBQzlCN04sVUFBTSxDQUFDNkQsTUFBUCxDQUFjLGVBQWUySixPQUE3QixFQUFzQ2hHLFNBQVMsQ0FBQ3NHLEtBQWhEOztBQUNBLFFBQUl0RyxTQUFTLENBQUN1RyxjQUFkLEVBQThCO0FBQzVCL04sWUFBTSxDQUFDNkQsTUFBUCxDQUFjLDBDQUFkLEVBQTBEMkQsU0FBUyxDQUFDdUcsY0FBcEU7O0FBQ0EvTixZQUFNLENBQUM2RCxNQUFQO0FBQ0Q7QUFDRixHQXZCdUQsQ0F5QnhEO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxNQUFJMkQsU0FBUyxDQUFDdUcsY0FBZCxFQUE4QjtBQUM1QixRQUFJdkcsU0FBUyxDQUFDdUcsY0FBVixDQUF5Qk4sWUFBN0IsRUFDRSxPQUFPakcsU0FBUyxDQUFDdUcsY0FBakI7O0FBQ0YvTixVQUFNLENBQUM2RCxNQUFQLENBQWMsZUFBZTJKLE9BQWYsR0FBeUIsa0NBQXpCLEdBQ0EsbURBRGQ7QUFFRDs7QUFFRCxTQUFPLElBQUl4TixNQUFNLENBQUNSLEtBQVgsQ0FBaUIsR0FBakIsRUFBc0IsdUJBQXRCLENBQVA7QUFDRCxDQXJDRCxDLENBd0NBO0FBQ0E7OztBQUNBLElBQUkySCx3QkFBd0IsR0FBRyxVQUFVUSxDQUFWLEVBQWE2RixPQUFiLEVBQXNCdlMsSUFBdEIsRUFBNEIrUyxXQUE1QixFQUF5QztBQUN0RS9TLE1BQUksR0FBR0EsSUFBSSxJQUFJLEVBQWY7O0FBQ0EsTUFBSXFILE9BQU8sQ0FBQyx1QkFBRCxDQUFYLEVBQXNDO0FBQ3BDLFdBQU8yTCxLQUFLLENBQUNDLGdDQUFOLENBQ0x2RyxDQURLLEVBQ0Y2RixPQURFLEVBQ092UyxJQURQLEVBQ2ErUyxXQURiLENBQVA7QUFFRDs7QUFDRCxTQUFPckcsQ0FBQyxDQUFDcE0sS0FBRixDQUFRaVMsT0FBUixFQUFpQnZTLElBQWpCLENBQVA7QUFDRCxDQVBELEM7Ozs7Ozs7Ozs7O0FDcHVEQSxJQUFJa1QsTUFBTSxHQUFHNVgsR0FBRyxDQUFDQyxPQUFKLENBQVksZUFBWixDQUFiLEMsQ0FFQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0FnRixTQUFTLENBQUN3SyxXQUFWLEdBQXdCLFlBQVk7QUFDbEMsTUFBSXZPLElBQUksR0FBRyxJQUFYO0FBRUFBLE1BQUksQ0FBQzJXLEtBQUwsR0FBYSxLQUFiO0FBQ0EzVyxNQUFJLENBQUM0VyxLQUFMLEdBQWEsS0FBYjtBQUNBNVcsTUFBSSxDQUFDNlcsT0FBTCxHQUFlLEtBQWY7QUFDQTdXLE1BQUksQ0FBQzhXLGtCQUFMLEdBQTBCLENBQTFCO0FBQ0E5VyxNQUFJLENBQUMrVyxxQkFBTCxHQUE2QixFQUE3QjtBQUNBL1csTUFBSSxDQUFDZ1gsb0JBQUwsR0FBNEIsRUFBNUI7QUFDRCxDQVRELEMsQ0FXQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0FqVCxTQUFTLENBQUN1TCxrQkFBVixHQUErQixJQUFJL0csTUFBTSxDQUFDME8sbUJBQVgsRUFBL0I7O0FBRUFoWSxDQUFDLENBQUMyRCxNQUFGLENBQVNtQixTQUFTLENBQUN3SyxXQUFWLENBQXNCMUwsU0FBL0IsRUFBMEM7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBcVUsWUFBVSxFQUFFLFlBQVk7QUFDdEIsUUFBSWxYLElBQUksR0FBRyxJQUFYO0FBRUEsUUFBSUEsSUFBSSxDQUFDNlcsT0FBVCxFQUNFLE9BQU87QUFBRU0sZUFBUyxFQUFFLFlBQVksQ0FBRTtBQUEzQixLQUFQO0FBRUYsUUFBSW5YLElBQUksQ0FBQzRXLEtBQVQsRUFDRSxNQUFNLElBQUk3TyxLQUFKLENBQVUsdURBQVYsQ0FBTjtBQUVGL0gsUUFBSSxDQUFDOFcsa0JBQUw7QUFDQSxRQUFJSyxTQUFTLEdBQUcsS0FBaEI7QUFDQSxXQUFPO0FBQ0xBLGVBQVMsRUFBRSxZQUFZO0FBQ3JCLFlBQUlBLFNBQUosRUFDRSxNQUFNLElBQUlwUCxLQUFKLENBQVUsMENBQVYsQ0FBTjtBQUNGb1AsaUJBQVMsR0FBRyxJQUFaO0FBQ0FuWCxZQUFJLENBQUM4VyxrQkFBTDs7QUFDQTlXLFlBQUksQ0FBQ29YLFVBQUw7QUFDRDtBQVBJLEtBQVA7QUFTRCxHQTFCdUM7QUE0QnhDO0FBQ0E7QUFDQXhJLEtBQUcsRUFBRSxZQUFZO0FBQ2YsUUFBSTVPLElBQUksR0FBRyxJQUFYO0FBQ0EsUUFBSUEsSUFBSSxLQUFLK0QsU0FBUyxDQUFDdUwsa0JBQVYsQ0FBNkJ0SyxHQUE3QixFQUFiLEVBQ0UsTUFBTStDLEtBQUssQ0FBQyw2QkFBRCxDQUFYO0FBQ0YvSCxRQUFJLENBQUMyVyxLQUFMLEdBQWEsSUFBYjs7QUFDQTNXLFFBQUksQ0FBQ29YLFVBQUw7QUFDRCxHQXBDdUM7QUFzQ3hDO0FBQ0E7QUFDQTtBQUNBQyxjQUFZLEVBQUUsVUFBVXBDLElBQVYsRUFBZ0I7QUFDNUIsUUFBSWpWLElBQUksR0FBRyxJQUFYO0FBQ0EsUUFBSUEsSUFBSSxDQUFDNFcsS0FBVCxFQUNFLE1BQU0sSUFBSTdPLEtBQUosQ0FBVSxnREFDQSxnQkFEVixDQUFOO0FBRUYvSCxRQUFJLENBQUMrVyxxQkFBTCxDQUEyQnJYLElBQTNCLENBQWdDdVYsSUFBaEM7QUFDRCxHQS9DdUM7QUFpRHhDO0FBQ0F6RyxnQkFBYyxFQUFFLFVBQVV5RyxJQUFWLEVBQWdCO0FBQzlCLFFBQUlqVixJQUFJLEdBQUcsSUFBWDtBQUNBLFFBQUlBLElBQUksQ0FBQzRXLEtBQVQsRUFDRSxNQUFNLElBQUk3TyxLQUFKLENBQVUsZ0RBQ0EsZ0JBRFYsQ0FBTjtBQUVGL0gsUUFBSSxDQUFDZ1gsb0JBQUwsQ0FBMEJ0WCxJQUExQixDQUErQnVWLElBQS9CO0FBQ0QsR0F4RHVDO0FBMER4QztBQUNBcUMsWUFBVSxFQUFFLFlBQVk7QUFDdEIsUUFBSXRYLElBQUksR0FBRyxJQUFYO0FBQ0EsUUFBSXVYLE1BQU0sR0FBRyxJQUFJYixNQUFKLEVBQWI7QUFDQTFXLFFBQUksQ0FBQ3dPLGNBQUwsQ0FBb0IsWUFBWTtBQUM5QitJLFlBQU0sQ0FBQyxRQUFELENBQU47QUFDRCxLQUZEO0FBR0F2WCxRQUFJLENBQUM0TyxHQUFMO0FBQ0EySSxVQUFNLENBQUNDLElBQVA7QUFDRCxHQW5FdUM7QUFxRXhDSixZQUFVLEVBQUUsWUFBWTtBQUN0QixRQUFJcFgsSUFBSSxHQUFHLElBQVg7QUFDQSxRQUFJQSxJQUFJLENBQUM0VyxLQUFULEVBQ0UsTUFBTSxJQUFJN08sS0FBSixDQUFVLGdDQUFWLENBQU47O0FBQ0YsUUFBSS9ILElBQUksQ0FBQzJXLEtBQUwsSUFBYyxDQUFDM1csSUFBSSxDQUFDOFcsa0JBQXhCLEVBQTRDO0FBQzFDLGVBQVNXLGNBQVQsQ0FBeUJ4QyxJQUF6QixFQUErQjtBQUM3QixZQUFJO0FBQ0ZBLGNBQUksQ0FBQ2pWLElBQUQsQ0FBSjtBQUNELFNBRkQsQ0FFRSxPQUFPZ0ksR0FBUCxFQUFZO0FBQ1pPLGdCQUFNLENBQUM2RCxNQUFQLENBQWMsbUNBQWQsRUFBbURwRSxHQUFuRDtBQUNEO0FBQ0Y7O0FBRURoSSxVQUFJLENBQUM4VyxrQkFBTDs7QUFDQSxhQUFPOVcsSUFBSSxDQUFDK1cscUJBQUwsQ0FBMkIzUixNQUEzQixHQUFvQyxDQUEzQyxFQUE4QztBQUM1QyxZQUFJaUIsU0FBUyxHQUFHckcsSUFBSSxDQUFDK1cscUJBQXJCO0FBQ0EvVyxZQUFJLENBQUMrVyxxQkFBTCxHQUE2QixFQUE3Qjs7QUFDQTlYLFNBQUMsQ0FBQ3lELElBQUYsQ0FBTzJELFNBQVAsRUFBa0JvUixjQUFsQjtBQUNEOztBQUNEelgsVUFBSSxDQUFDOFcsa0JBQUw7O0FBRUEsVUFBSSxDQUFDOVcsSUFBSSxDQUFDOFcsa0JBQVYsRUFBOEI7QUFDNUI5VyxZQUFJLENBQUM0VyxLQUFMLEdBQWEsSUFBYjtBQUNBLFlBQUl2USxTQUFTLEdBQUdyRyxJQUFJLENBQUNnWCxvQkFBckI7QUFDQWhYLFlBQUksQ0FBQ2dYLG9CQUFMLEdBQTRCLEVBQTVCOztBQUNBL1gsU0FBQyxDQUFDeUQsSUFBRixDQUFPMkQsU0FBUCxFQUFrQm9SLGNBQWxCO0FBQ0Q7QUFDRjtBQUNGLEdBakd1QztBQW1HeEM7QUFDQTtBQUNBaEosUUFBTSxFQUFFLFlBQVk7QUFDbEIsUUFBSXpPLElBQUksR0FBRyxJQUFYO0FBQ0EsUUFBSSxDQUFFQSxJQUFJLENBQUM0VyxLQUFYLEVBQ0UsTUFBTSxJQUFJN08sS0FBSixDQUFVLHlDQUFWLENBQU47QUFDRi9ILFFBQUksQ0FBQzZXLE9BQUwsR0FBZSxJQUFmO0FBQ0Q7QUExR3VDLENBQTFDLEU7Ozs7Ozs7Ozs7O0FDdkJBO0FBQ0E7QUFDQTtBQUVBOVMsU0FBUyxDQUFDMlQsU0FBVixHQUFzQixVQUFVdlAsT0FBVixFQUFtQjtBQUN2QyxNQUFJbkksSUFBSSxHQUFHLElBQVg7QUFDQW1JLFNBQU8sR0FBR0EsT0FBTyxJQUFJLEVBQXJCO0FBRUFuSSxNQUFJLENBQUMyWCxNQUFMLEdBQWMsQ0FBZCxDQUp1QyxDQUt2QztBQUNBO0FBQ0E7O0FBQ0EzWCxNQUFJLENBQUM0WCxxQkFBTCxHQUE2QixFQUE3QjtBQUNBNVgsTUFBSSxDQUFDNlgsMEJBQUwsR0FBa0MsRUFBbEM7QUFDQTdYLE1BQUksQ0FBQzhYLFdBQUwsR0FBbUIzUCxPQUFPLENBQUMyUCxXQUFSLElBQXVCLFVBQTFDO0FBQ0E5WCxNQUFJLENBQUMrWCxRQUFMLEdBQWdCNVAsT0FBTyxDQUFDNFAsUUFBUixJQUFvQixJQUFwQztBQUNELENBWkQ7O0FBY0E5WSxDQUFDLENBQUMyRCxNQUFGLENBQVNtQixTQUFTLENBQUMyVCxTQUFWLENBQW9CN1UsU0FBN0IsRUFBd0M7QUFDdEM7QUFDQW1WLHVCQUFxQixFQUFFLFVBQVUvTixHQUFWLEVBQWU7QUFDcEMsUUFBSWpLLElBQUksR0FBRyxJQUFYOztBQUNBLFFBQUksQ0FBRWYsQ0FBQyxDQUFDNEcsR0FBRixDQUFNb0UsR0FBTixFQUFXLFlBQVgsQ0FBTixFQUFnQztBQUM5QixhQUFPLEVBQVA7QUFDRCxLQUZELE1BRU8sSUFBSSxPQUFPQSxHQUFHLENBQUNvQixVQUFYLEtBQTJCLFFBQS9CLEVBQXlDO0FBQzlDLFVBQUlwQixHQUFHLENBQUNvQixVQUFKLEtBQW1CLEVBQXZCLEVBQ0UsTUFBTXRELEtBQUssQ0FBQywrQkFBRCxDQUFYO0FBQ0YsYUFBT2tDLEdBQUcsQ0FBQ29CLFVBQVg7QUFDRCxLQUpNLE1BSUE7QUFDTCxZQUFNdEQsS0FBSyxDQUFDLG9DQUFELENBQVg7QUFDRDtBQUNGLEdBYnFDO0FBZXRDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0FrUSxRQUFNLEVBQUUsVUFBVUMsT0FBVixFQUFtQnZWLFFBQW5CLEVBQTZCO0FBQ25DLFFBQUkzQyxJQUFJLEdBQUcsSUFBWDtBQUNBLFFBQUlpSCxFQUFFLEdBQUdqSCxJQUFJLENBQUMyWCxNQUFMLEVBQVQ7O0FBRUEsUUFBSXRNLFVBQVUsR0FBR3JMLElBQUksQ0FBQ2dZLHFCQUFMLENBQTJCRSxPQUEzQixDQUFqQjs7QUFDQSxRQUFJQyxNQUFNLEdBQUc7QUFBQ0QsYUFBTyxFQUFFMVMsS0FBSyxDQUFDSSxLQUFOLENBQVlzUyxPQUFaLENBQVY7QUFBZ0N2VixjQUFRLEVBQUVBO0FBQTFDLEtBQWI7O0FBQ0EsUUFBSSxDQUFFMUQsQ0FBQyxDQUFDNEcsR0FBRixDQUFNN0YsSUFBSSxDQUFDNFgscUJBQVgsRUFBa0N2TSxVQUFsQyxDQUFOLEVBQXFEO0FBQ25EckwsVUFBSSxDQUFDNFgscUJBQUwsQ0FBMkJ2TSxVQUEzQixJQUF5QyxFQUF6QztBQUNBckwsVUFBSSxDQUFDNlgsMEJBQUwsQ0FBZ0N4TSxVQUFoQyxJQUE4QyxDQUE5QztBQUNEOztBQUNEckwsUUFBSSxDQUFDNFgscUJBQUwsQ0FBMkJ2TSxVQUEzQixFQUF1Q3BFLEVBQXZDLElBQTZDa1IsTUFBN0M7QUFDQW5ZLFFBQUksQ0FBQzZYLDBCQUFMLENBQWdDeE0sVUFBaEM7O0FBRUEsUUFBSXJMLElBQUksQ0FBQytYLFFBQUwsSUFBaUJsTixPQUFPLENBQUMsWUFBRCxDQUE1QixFQUE0QztBQUMxQ0EsYUFBTyxDQUFDLFlBQUQsQ0FBUCxDQUFzQkMsS0FBdEIsQ0FBNEJDLG1CQUE1QixDQUNFL0ssSUFBSSxDQUFDOFgsV0FEUCxFQUNvQjlYLElBQUksQ0FBQytYLFFBRHpCLEVBQ21DLENBRG5DO0FBRUQ7O0FBRUQsV0FBTztBQUNMaE0sVUFBSSxFQUFFLFlBQVk7QUFDaEIsWUFBSS9MLElBQUksQ0FBQytYLFFBQUwsSUFBaUJsTixPQUFPLENBQUMsWUFBRCxDQUE1QixFQUE0QztBQUMxQ0EsaUJBQU8sQ0FBQyxZQUFELENBQVAsQ0FBc0JDLEtBQXRCLENBQTRCQyxtQkFBNUIsQ0FDRS9LLElBQUksQ0FBQzhYLFdBRFAsRUFDb0I5WCxJQUFJLENBQUMrWCxRQUR6QixFQUNtQyxDQUFDLENBRHBDO0FBRUQ7O0FBQ0QsZUFBTy9YLElBQUksQ0FBQzRYLHFCQUFMLENBQTJCdk0sVUFBM0IsRUFBdUNwRSxFQUF2QyxDQUFQO0FBQ0FqSCxZQUFJLENBQUM2WCwwQkFBTCxDQUFnQ3hNLFVBQWhDOztBQUNBLFlBQUlyTCxJQUFJLENBQUM2WCwwQkFBTCxDQUFnQ3hNLFVBQWhDLE1BQWdELENBQXBELEVBQXVEO0FBQ3JELGlCQUFPckwsSUFBSSxDQUFDNFgscUJBQUwsQ0FBMkJ2TSxVQUEzQixDQUFQO0FBQ0EsaUJBQU9yTCxJQUFJLENBQUM2WCwwQkFBTCxDQUFnQ3hNLFVBQWhDLENBQVA7QUFDRDtBQUNGO0FBWkksS0FBUDtBQWNELEdBekRxQztBQTJEdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBK00sTUFBSSxFQUFFLFVBQVVDLFlBQVYsRUFBd0I7QUFDNUIsUUFBSXJZLElBQUksR0FBRyxJQUFYOztBQUVBLFFBQUlxTCxVQUFVLEdBQUdyTCxJQUFJLENBQUNnWSxxQkFBTCxDQUEyQkssWUFBM0IsQ0FBakI7O0FBRUEsUUFBSSxDQUFFcFosQ0FBQyxDQUFDNEcsR0FBRixDQUFNN0YsSUFBSSxDQUFDNFgscUJBQVgsRUFBa0N2TSxVQUFsQyxDQUFOLEVBQXFEO0FBQ25EO0FBQ0Q7O0FBRUQsUUFBSWlOLHNCQUFzQixHQUFHdFksSUFBSSxDQUFDNFgscUJBQUwsQ0FBMkJ2TSxVQUEzQixDQUE3QjtBQUNBLFFBQUlrTixXQUFXLEdBQUcsRUFBbEI7O0FBQ0F0WixLQUFDLENBQUN5RCxJQUFGLENBQU80VixzQkFBUCxFQUErQixVQUFVRSxDQUFWLEVBQWF2UixFQUFiLEVBQWlCO0FBQzlDLFVBQUlqSCxJQUFJLENBQUN5WSxRQUFMLENBQWNKLFlBQWQsRUFBNEJHLENBQUMsQ0FBQ04sT0FBOUIsQ0FBSixFQUE0QztBQUMxQ0ssbUJBQVcsQ0FBQzdZLElBQVosQ0FBaUJ1SCxFQUFqQjtBQUNEO0FBQ0YsS0FKRCxFQVg0QixDQWlCNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQWhJLEtBQUMsQ0FBQ3lELElBQUYsQ0FBTzZWLFdBQVAsRUFBb0IsVUFBVXRSLEVBQVYsRUFBYztBQUNoQyxVQUFJaEksQ0FBQyxDQUFDNEcsR0FBRixDQUFNeVMsc0JBQU4sRUFBOEJyUixFQUE5QixDQUFKLEVBQXVDO0FBQ3JDcVIsOEJBQXNCLENBQUNyUixFQUFELENBQXRCLENBQTJCdEUsUUFBM0IsQ0FBb0MwVixZQUFwQztBQUNEO0FBQ0YsS0FKRDtBQUtELEdBbEdxQztBQW9HdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBSSxVQUFRLEVBQUUsVUFBVUosWUFBVixFQUF3QkgsT0FBeEIsRUFBaUM7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQUksT0FBT0csWUFBWSxDQUFDcFIsRUFBcEIsS0FBNEIsUUFBNUIsSUFDQSxPQUFPaVIsT0FBTyxDQUFDalIsRUFBZixLQUF1QixRQUR2QixJQUVBb1IsWUFBWSxDQUFDcFIsRUFBYixLQUFvQmlSLE9BQU8sQ0FBQ2pSLEVBRmhDLEVBRW9DO0FBQ2xDLGFBQU8sS0FBUDtBQUNEOztBQUNELFFBQUlvUixZQUFZLENBQUNwUixFQUFiLFlBQTJCcUwsT0FBTyxDQUFDb0csUUFBbkMsSUFDQVIsT0FBTyxDQUFDalIsRUFBUixZQUFzQnFMLE9BQU8sQ0FBQ29HLFFBRDlCLElBRUEsQ0FBRUwsWUFBWSxDQUFDcFIsRUFBYixDQUFnQnhCLE1BQWhCLENBQXVCeVMsT0FBTyxDQUFDalIsRUFBL0IsQ0FGTixFQUUwQztBQUN4QyxhQUFPLEtBQVA7QUFDRDs7QUFFRCxXQUFPaEksQ0FBQyxDQUFDaVUsR0FBRixDQUFNZ0YsT0FBTixFQUFlLFVBQVVTLFlBQVYsRUFBd0JoVSxHQUF4QixFQUE2QjtBQUNqRCxhQUFPLENBQUMxRixDQUFDLENBQUM0RyxHQUFGLENBQU13UyxZQUFOLEVBQW9CMVQsR0FBcEIsQ0FBRCxJQUNMYSxLQUFLLENBQUNDLE1BQU4sQ0FBYWtULFlBQWIsRUFBMkJOLFlBQVksQ0FBQzFULEdBQUQsQ0FBdkMsQ0FERjtBQUVELEtBSE0sQ0FBUDtBQUlEO0FBMUlxQyxDQUF4QyxFLENBNklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBWixTQUFTLENBQUM2VSxxQkFBVixHQUFrQyxJQUFJN1UsU0FBUyxDQUFDMlQsU0FBZCxDQUF3QjtBQUN4REssVUFBUSxFQUFFO0FBRDhDLENBQXhCLENBQWxDLEM7Ozs7Ozs7Ozs7O0FDcEtBLElBQUkxWSxPQUFPLENBQUNDLEdBQVIsQ0FBWXVaLDBCQUFoQixFQUE0QztBQUMxQ2haLDJCQUF5QixDQUFDZ1osMEJBQTFCLEdBQ0V4WixPQUFPLENBQUNDLEdBQVIsQ0FBWXVaLDBCQURkO0FBRUQ7O0FBRUR0USxNQUFNLENBQUNySCxNQUFQLEdBQWdCLElBQUl5UyxNQUFKLEVBQWhCOztBQUVBcEwsTUFBTSxDQUFDdVEsT0FBUCxHQUFpQixVQUFVVCxZQUFWLEVBQXdCO0FBQ3ZDdFUsV0FBUyxDQUFDNlUscUJBQVYsQ0FBZ0NSLElBQWhDLENBQXFDQyxZQUFyQztBQUNELENBRkQsQyxDQUlBO0FBQ0E7OztBQUNBcFosQ0FBQyxDQUFDeUQsSUFBRixDQUFPLENBQUMsU0FBRCxFQUFZLFNBQVosRUFBdUIsTUFBdkIsRUFBK0IsT0FBL0IsRUFBd0MsY0FBeEMsRUFBd0QsV0FBeEQsQ0FBUCxFQUNPLFVBQVV5SyxJQUFWLEVBQWdCO0FBQ2Q1RSxRQUFNLENBQUM0RSxJQUFELENBQU4sR0FBZWxPLENBQUMsQ0FBQzZILElBQUYsQ0FBT3lCLE1BQU0sQ0FBQ3JILE1BQVAsQ0FBY2lNLElBQWQsQ0FBUCxFQUE0QjVFLE1BQU0sQ0FBQ3JILE1BQW5DLENBQWY7QUFDRCxDQUhSLEUsQ0FLQTtBQUNBO0FBQ0E7OztBQUNBcUgsTUFBTSxDQUFDd1EsY0FBUCxHQUF3QnhRLE1BQU0sQ0FBQ3JILE1BQS9CLEMiLCJmaWxlIjoiL3BhY2thZ2VzL2RkcC1zZXJ2ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgdXJsID0gTnBtLnJlcXVpcmUoJ3VybCcpO1xuXG4vLyBCeSBkZWZhdWx0LCB3ZSB1c2UgdGhlIHBlcm1lc3NhZ2UtZGVmbGF0ZSBleHRlbnNpb24gd2l0aCBkZWZhdWx0XG4vLyBjb25maWd1cmF0aW9uLiBJZiAkU0VSVkVSX1dFQlNPQ0tFVF9DT01QUkVTU0lPTiBpcyBzZXQsIHRoZW4gaXQgbXVzdCBiZSB2YWxpZFxuLy8gSlNPTi4gSWYgaXQgcmVwcmVzZW50cyBhIGZhbHNleSB2YWx1ZSwgdGhlbiB3ZSBkbyBub3QgdXNlIHBlcm1lc3NhZ2UtZGVmbGF0ZVxuLy8gYXQgYWxsOyBvdGhlcndpc2UsIHRoZSBKU09OIHZhbHVlIGlzIHVzZWQgYXMgYW4gYXJndW1lbnQgdG8gZGVmbGF0ZSdzXG4vLyBjb25maWd1cmUgbWV0aG9kOyBzZWVcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9mYXllL3Blcm1lc3NhZ2UtZGVmbGF0ZS1ub2RlL2Jsb2IvbWFzdGVyL1JFQURNRS5tZFxuLy9cbi8vIChXZSBkbyB0aGlzIGluIGFuIF8ub25jZSBpbnN0ZWFkIG9mIGF0IHN0YXJ0dXAsIGJlY2F1c2Ugd2UgZG9uJ3Qgd2FudCB0b1xuLy8gY3Jhc2ggdGhlIHRvb2wgZHVyaW5nIGlzb3BhY2tldCBsb2FkIGlmIHlvdXIgSlNPTiBkb2Vzbid0IHBhcnNlLiBUaGlzIGlzIG9ubHlcbi8vIGEgcHJvYmxlbSBiZWNhdXNlIHRoZSB0b29sIGhhcyB0byBsb2FkIHRoZSBERFAgc2VydmVyIGNvZGUganVzdCBpbiBvcmRlciB0b1xuLy8gYmUgYSBERFAgY2xpZW50OyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL21ldGVvci9tZXRlb3IvaXNzdWVzLzM0NTIgLilcbnZhciB3ZWJzb2NrZXRFeHRlbnNpb25zID0gXy5vbmNlKGZ1bmN0aW9uICgpIHtcbiAgdmFyIGV4dGVuc2lvbnMgPSBbXTtcblxuICB2YXIgd2Vic29ja2V0Q29tcHJlc3Npb25Db25maWcgPSBwcm9jZXNzLmVudi5TRVJWRVJfV0VCU09DS0VUX0NPTVBSRVNTSU9OXG4gICAgPyBKU09OLnBhcnNlKHByb2Nlc3MuZW52LlNFUlZFUl9XRUJTT0NLRVRfQ09NUFJFU1NJT04pIDoge307XG4gIGlmICh3ZWJzb2NrZXRDb21wcmVzc2lvbkNvbmZpZykge1xuICAgIGV4dGVuc2lvbnMucHVzaChOcG0ucmVxdWlyZSgncGVybWVzc2FnZS1kZWZsYXRlJykuY29uZmlndXJlKFxuICAgICAgd2Vic29ja2V0Q29tcHJlc3Npb25Db25maWdcbiAgICApKTtcbiAgfVxuXG4gIHJldHVybiBleHRlbnNpb25zO1xufSk7XG5cbnZhciBwYXRoUHJlZml4ID0gX19tZXRlb3JfcnVudGltZV9jb25maWdfXy5ST09UX1VSTF9QQVRIX1BSRUZJWCB8fCBcIlwiO1xuXG5TdHJlYW1TZXJ2ZXIgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgc2VsZi5yZWdpc3RyYXRpb25fY2FsbGJhY2tzID0gW107XG4gIHNlbGYub3Blbl9zb2NrZXRzID0gW107XG5cbiAgLy8gQmVjYXVzZSB3ZSBhcmUgaW5zdGFsbGluZyBkaXJlY3RseSBvbnRvIFdlYkFwcC5odHRwU2VydmVyIGluc3RlYWQgb2YgdXNpbmdcbiAgLy8gV2ViQXBwLmFwcCwgd2UgaGF2ZSB0byBwcm9jZXNzIHRoZSBwYXRoIHByZWZpeCBvdXJzZWx2ZXMuXG4gIHNlbGYucHJlZml4ID0gcGF0aFByZWZpeCArICcvc29ja2pzJztcbiAgUm91dGVQb2xpY3kuZGVjbGFyZShzZWxmLnByZWZpeCArICcvJywgJ25ldHdvcmsnKTtcblxuICAvLyBzZXQgdXAgc29ja2pzXG4gIHZhciBzb2NranMgPSBOcG0ucmVxdWlyZSgnc29ja2pzJyk7XG4gIHZhciBzZXJ2ZXJPcHRpb25zID0ge1xuICAgIHByZWZpeDogc2VsZi5wcmVmaXgsXG4gICAgbG9nOiBmdW5jdGlvbiAoKSB7IH0sXG4gICAgLy8gdGhpcyBpcyB0aGUgZGVmYXVsdCwgYnV0IHdlIGNvZGUgaXQgZXhwbGljaXRseSBiZWNhdXNlIHdlIGRlcGVuZFxuICAgIC8vIG9uIGl0IGluIHN0cmVhbV9jbGllbnQ6SEVBUlRCRUFUX1RJTUVPVVRcbiAgICBoZWFydGJlYXRfZGVsYXk6IDQ1MDAwLFxuICAgIC8vIFRoZSBkZWZhdWx0IGRpc2Nvbm5lY3RfZGVsYXkgaXMgNSBzZWNvbmRzLCBidXQgaWYgdGhlIHNlcnZlciBlbmRzIHVwIENQVVxuICAgIC8vIGJvdW5kIGZvciB0aGF0IG11Y2ggdGltZSwgU29ja0pTIG1pZ2h0IG5vdCBub3RpY2UgdGhhdCB0aGUgdXNlciBoYXNcbiAgICAvLyByZWNvbm5lY3RlZCBiZWNhdXNlIHRoZSB0aW1lciAob2YgZGlzY29ubmVjdF9kZWxheSBtcykgY2FuIGZpcmUgYmVmb3JlXG4gICAgLy8gU29ja0pTIHByb2Nlc3NlcyB0aGUgbmV3IGNvbm5lY3Rpb24uIEV2ZW50dWFsbHkgd2UnbGwgZml4IHRoaXMgYnkgbm90XG4gICAgLy8gY29tYmluaW5nIENQVS1oZWF2eSBwcm9jZXNzaW5nIHdpdGggU29ja0pTIHRlcm1pbmF0aW9uIChlZyBhIHByb3h5IHdoaWNoXG4gICAgLy8gY29udmVydHMgdG8gVW5peCBzb2NrZXRzKSBidXQgZm9yIG5vdywgcmFpc2UgdGhlIGRlbGF5LlxuICAgIGRpc2Nvbm5lY3RfZGVsYXk6IDYwICogMTAwMCxcbiAgICAvLyBBbGxvdyBkaXNhYmxpbmcgb2YgQ09SUyByZXF1ZXN0cyB0byBhZGRyZXNzXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL21ldGVvci9tZXRlb3IvaXNzdWVzLzgzMTcuXG4gICAgZGlzYWJsZV9jb3JzOiAhIXByb2Nlc3MuZW52LkRJU0FCTEVfU09DS0pTX0NPUlMsXG4gICAgLy8gU2V0IHRoZSBVU0VfSlNFU1NJT05JRCBlbnZpcm9ubWVudCB2YXJpYWJsZSB0byBlbmFibGUgc2V0dGluZyB0aGVcbiAgICAvLyBKU0VTU0lPTklEIGNvb2tpZS4gVGhpcyBpcyB1c2VmdWwgZm9yIHNldHRpbmcgdXAgcHJveGllcyB3aXRoXG4gICAgLy8gc2Vzc2lvbiBhZmZpbml0eS5cbiAgICBqc2Vzc2lvbmlkOiAhIXByb2Nlc3MuZW52LlVTRV9KU0VTU0lPTklEXG4gIH07XG5cbiAgLy8gSWYgeW91IGtub3cgeW91ciBzZXJ2ZXIgZW52aXJvbm1lbnQgKGVnLCBwcm94aWVzKSB3aWxsIHByZXZlbnQgd2Vic29ja2V0c1xuICAvLyBmcm9tIGV2ZXIgd29ya2luZywgc2V0ICRESVNBQkxFX1dFQlNPQ0tFVFMgYW5kIFNvY2tKUyBjbGllbnRzIChpZSxcbiAgLy8gYnJvd3NlcnMpIHdpbGwgbm90IHdhc3RlIHRpbWUgYXR0ZW1wdGluZyB0byB1c2UgdGhlbS5cbiAgLy8gKFlvdXIgc2VydmVyIHdpbGwgc3RpbGwgaGF2ZSBhIC93ZWJzb2NrZXQgZW5kcG9pbnQuKVxuICBpZiAocHJvY2Vzcy5lbnYuRElTQUJMRV9XRUJTT0NLRVRTKSB7XG4gICAgc2VydmVyT3B0aW9ucy53ZWJzb2NrZXQgPSBmYWxzZTtcbiAgfSBlbHNlIHtcbiAgICBzZXJ2ZXJPcHRpb25zLmZheWVfc2VydmVyX29wdGlvbnMgPSB7XG4gICAgICBleHRlbnNpb25zOiB3ZWJzb2NrZXRFeHRlbnNpb25zKClcbiAgICB9O1xuICB9XG5cbiAgc2VsZi5zZXJ2ZXIgPSBzb2NranMuY3JlYXRlU2VydmVyKHNlcnZlck9wdGlvbnMpO1xuXG4gIC8vIEluc3RhbGwgdGhlIHNvY2tqcyBoYW5kbGVycywgYnV0IHdlIHdhbnQgdG8ga2VlcCBhcm91bmQgb3VyIG93biBwYXJ0aWN1bGFyXG4gIC8vIHJlcXVlc3QgaGFuZGxlciB0aGF0IGFkanVzdHMgaWRsZSB0aW1lb3V0cyB3aGlsZSB3ZSBoYXZlIGFuIG91dHN0YW5kaW5nXG4gIC8vIHJlcXVlc3QuICBUaGlzIGNvbXBlbnNhdGVzIGZvciB0aGUgZmFjdCB0aGF0IHNvY2tqcyByZW1vdmVzIGFsbCBsaXN0ZW5lcnNcbiAgLy8gZm9yIFwicmVxdWVzdFwiIHRvIGFkZCBpdHMgb3duLlxuICBXZWJBcHAuaHR0cFNlcnZlci5yZW1vdmVMaXN0ZW5lcihcbiAgICAncmVxdWVzdCcsIFdlYkFwcC5fdGltZW91dEFkanVzdG1lbnRSZXF1ZXN0Q2FsbGJhY2spO1xuICBzZWxmLnNlcnZlci5pbnN0YWxsSGFuZGxlcnMoV2ViQXBwLmh0dHBTZXJ2ZXIpO1xuICBXZWJBcHAuaHR0cFNlcnZlci5hZGRMaXN0ZW5lcihcbiAgICAncmVxdWVzdCcsIFdlYkFwcC5fdGltZW91dEFkanVzdG1lbnRSZXF1ZXN0Q2FsbGJhY2spO1xuXG4gIC8vIFN1cHBvcnQgdGhlIC93ZWJzb2NrZXQgZW5kcG9pbnRcbiAgc2VsZi5fcmVkaXJlY3RXZWJzb2NrZXRFbmRwb2ludCgpO1xuXG4gIHNlbGYuc2VydmVyLm9uKCdjb25uZWN0aW9uJywgZnVuY3Rpb24gKHNvY2tldCkge1xuICAgIC8vIFdlIHdhbnQgdG8gbWFrZSBzdXJlIHRoYXQgaWYgYSBjbGllbnQgY29ubmVjdHMgdG8gdXMgYW5kIGRvZXMgdGhlIGluaXRpYWxcbiAgICAvLyBXZWJzb2NrZXQgaGFuZHNoYWtlIGJ1dCBuZXZlciBnZXRzIHRvIHRoZSBERFAgaGFuZHNoYWtlLCB0aGF0IHdlXG4gICAgLy8gZXZlbnR1YWxseSBraWxsIHRoZSBzb2NrZXQuICBPbmNlIHRoZSBERFAgaGFuZHNoYWtlIGhhcHBlbnMsIEREUFxuICAgIC8vIGhlYXJ0YmVhdGluZyB3aWxsIHdvcmsuIEFuZCBiZWZvcmUgdGhlIFdlYnNvY2tldCBoYW5kc2hha2UsIHRoZSB0aW1lb3V0c1xuICAgIC8vIHdlIHNldCBhdCB0aGUgc2VydmVyIGxldmVsIGluIHdlYmFwcF9zZXJ2ZXIuanMgd2lsbCB3b3JrLiBCdXRcbiAgICAvLyBmYXllLXdlYnNvY2tldCBjYWxscyBzZXRUaW1lb3V0KDApIG9uIGFueSBzb2NrZXQgaXQgdGFrZXMgb3Zlciwgc28gdGhlcmVcbiAgICAvLyBpcyBhbiBcImluIGJldHdlZW5cIiBzdGF0ZSB3aGVyZSB0aGlzIGRvZXNuJ3QgaGFwcGVuLiAgV2Ugd29yayBhcm91bmQgdGhpc1xuICAgIC8vIGJ5IGV4cGxpY2l0bHkgc2V0dGluZyB0aGUgc29ja2V0IHRpbWVvdXQgdG8gYSByZWxhdGl2ZWx5IGxhcmdlIHRpbWUgaGVyZSxcbiAgICAvLyBhbmQgc2V0dGluZyBpdCBiYWNrIHRvIHplcm8gd2hlbiB3ZSBzZXQgdXAgdGhlIGhlYXJ0YmVhdCBpblxuICAgIC8vIGxpdmVkYXRhX3NlcnZlci5qcy5cbiAgICBzb2NrZXQuc2V0V2Vic29ja2V0VGltZW91dCA9IGZ1bmN0aW9uICh0aW1lb3V0KSB7XG4gICAgICBpZiAoKHNvY2tldC5wcm90b2NvbCA9PT0gJ3dlYnNvY2tldCcgfHxcbiAgICAgICAgc29ja2V0LnByb3RvY29sID09PSAnd2Vic29ja2V0LXJhdycpXG4gICAgICAgICYmIHNvY2tldC5fc2Vzc2lvbi5yZWN2KSB7XG4gICAgICAgIHNvY2tldC5fc2Vzc2lvbi5yZWN2LmNvbm5lY3Rpb24uc2V0VGltZW91dCh0aW1lb3V0KTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHNvY2tldC5zZXRXZWJzb2NrZXRUaW1lb3V0KDQ1ICogMTAwMCk7XG5cbiAgICBzb2NrZXQuc2VuZCA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICBzb2NrZXQud3JpdGUoZGF0YSk7XG4gICAgfTtcbiAgICBzb2NrZXQub24oJ2Nsb3NlJywgZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi5vcGVuX3NvY2tldHMgPSBfLndpdGhvdXQoc2VsZi5vcGVuX3NvY2tldHMsIHNvY2tldCk7XG4gICAgfSk7XG4gICAgc2VsZi5vcGVuX3NvY2tldHMucHVzaChzb2NrZXQpO1xuXG4gICAgLy8gWFhYIENPTVBBVCBXSVRIIDAuNi42LiBTZW5kIHRoZSBvbGQgc3R5bGUgd2VsY29tZSBtZXNzYWdlLCB3aGljaFxuICAgIC8vIHdpbGwgZm9yY2Ugb2xkIGNsaWVudHMgdG8gcmVsb2FkLiBSZW1vdmUgdGhpcyBvbmNlIHdlJ3JlIG5vdFxuICAgIC8vIGNvbmNlcm5lZCBhYm91dCBwZW9wbGUgdXBncmFkaW5nIGZyb20gYSBwcmUtMC43LjAgcmVsZWFzZS4gQWxzbyxcbiAgICAvLyByZW1vdmUgdGhlIGNsYXVzZSBpbiB0aGUgY2xpZW50IHRoYXQgaWdub3JlcyB0aGUgd2VsY29tZSBtZXNzYWdlXG4gICAgLy8gKGxpdmVkYXRhX2Nvbm5lY3Rpb24uanMpXG4gICAgc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoeyBzZXJ2ZXJfaWQ6IFwiMFwiIH0pKTtcblxuICAgIC8vIGNhbGwgYWxsIG91ciBjYWxsYmFja3Mgd2hlbiB3ZSBnZXQgYSBuZXcgc29ja2V0LiB0aGV5IHdpbGwgZG8gdGhlXG4gICAgLy8gd29yayBvZiBzZXR0aW5nIHVwIGhhbmRsZXJzIGFuZCBzdWNoIGZvciBzcGVjaWZpYyBtZXNzYWdlcy5cbiAgICBfLmVhY2goc2VsZi5yZWdpc3RyYXRpb25fY2FsbGJhY2tzLCBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgIGNhbGxiYWNrKHNvY2tldCk7XG4gICAgfSk7XG4gIH0pO1xuXG59O1xuXG5fLmV4dGVuZChTdHJlYW1TZXJ2ZXIucHJvdG90eXBlLCB7XG4gIC8vIGNhbGwgbXkgY2FsbGJhY2sgd2hlbiBhIG5ldyBzb2NrZXQgY29ubmVjdHMuXG4gIC8vIGFsc28gY2FsbCBpdCBmb3IgYWxsIGN1cnJlbnQgY29ubmVjdGlvbnMuXG4gIHJlZ2lzdGVyOiBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgc2VsZi5yZWdpc3RyYXRpb25fY2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xuICAgIF8uZWFjaChzZWxmLmFsbF9zb2NrZXRzKCksIGZ1bmN0aW9uIChzb2NrZXQpIHtcbiAgICAgIGNhbGxiYWNrKHNvY2tldCk7XG4gICAgfSk7XG4gIH0sXG5cbiAgLy8gZ2V0IGEgbGlzdCBvZiBhbGwgc29ja2V0c1xuICBhbGxfc29ja2V0czogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICByZXR1cm4gXy52YWx1ZXMoc2VsZi5vcGVuX3NvY2tldHMpO1xuICB9LFxuXG4gIC8vIFJlZGlyZWN0IC93ZWJzb2NrZXQgdG8gL3NvY2tqcy93ZWJzb2NrZXQgaW4gb3JkZXIgdG8gbm90IGV4cG9zZVxuICAvLyBzb2NranMgdG8gY2xpZW50cyB0aGF0IHdhbnQgdG8gdXNlIHJhdyB3ZWJzb2NrZXRzXG4gIF9yZWRpcmVjdFdlYnNvY2tldEVuZHBvaW50OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIC8vIFVuZm9ydHVuYXRlbHkgd2UgY2FuJ3QgdXNlIGEgY29ubmVjdCBtaWRkbGV3YXJlIGhlcmUgc2luY2VcbiAgICAvLyBzb2NranMgaW5zdGFsbHMgaXRzZWxmIHByaW9yIHRvIGFsbCBleGlzdGluZyBsaXN0ZW5lcnNcbiAgICAvLyAobWVhbmluZyBwcmlvciB0byBhbnkgY29ubmVjdCBtaWRkbGV3YXJlcykgc28gd2UgbmVlZCB0byB0YWtlXG4gICAgLy8gYW4gYXBwcm9hY2ggc2ltaWxhciB0byBvdmVyc2hhZG93TGlzdGVuZXJzIGluXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3NvY2tqcy9zb2NranMtbm9kZS9ibG9iL2NmODIwYzU1YWY2YTk5NTNlMTY1NTg1NTVhMzFkZWNlYTU1NGY3MGUvc3JjL3V0aWxzLmNvZmZlZVxuICAgIF8uZWFjaChbJ3JlcXVlc3QnLCAndXBncmFkZSddLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIHZhciBodHRwU2VydmVyID0gV2ViQXBwLmh0dHBTZXJ2ZXI7XG4gICAgICB2YXIgb2xkSHR0cFNlcnZlckxpc3RlbmVycyA9IGh0dHBTZXJ2ZXIubGlzdGVuZXJzKGV2ZW50KS5zbGljZSgwKTtcbiAgICAgIGh0dHBTZXJ2ZXIucmVtb3ZlQWxsTGlzdGVuZXJzKGV2ZW50KTtcblxuICAgICAgLy8gcmVxdWVzdCBhbmQgdXBncmFkZSBoYXZlIGRpZmZlcmVudCBhcmd1bWVudHMgcGFzc2VkIGJ1dFxuICAgICAgLy8gd2Ugb25seSBjYXJlIGFib3V0IHRoZSBmaXJzdCBvbmUgd2hpY2ggaXMgYWx3YXlzIHJlcXVlc3RcbiAgICAgIHZhciBuZXdMaXN0ZW5lciA9IGZ1bmN0aW9uIChyZXF1ZXN0IC8qLCBtb3JlQXJndW1lbnRzICovKSB7XG4gICAgICAgIC8vIFN0b3JlIGFyZ3VtZW50cyBmb3IgdXNlIHdpdGhpbiB0aGUgY2xvc3VyZSBiZWxvd1xuICAgICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcblxuICAgICAgICAvLyBSZXdyaXRlIC93ZWJzb2NrZXQgYW5kIC93ZWJzb2NrZXQvIHVybHMgdG8gL3NvY2tqcy93ZWJzb2NrZXQgd2hpbGVcbiAgICAgICAgLy8gcHJlc2VydmluZyBxdWVyeSBzdHJpbmcuXG4gICAgICAgIHZhciBwYXJzZWRVcmwgPSB1cmwucGFyc2UocmVxdWVzdC51cmwpO1xuICAgICAgICBpZiAocGFyc2VkVXJsLnBhdGhuYW1lID09PSBwYXRoUHJlZml4ICsgJy93ZWJzb2NrZXQnIHx8XG4gICAgICAgICAgcGFyc2VkVXJsLnBhdGhuYW1lID09PSBwYXRoUHJlZml4ICsgJy93ZWJzb2NrZXQvJykge1xuICAgICAgICAgIHBhcnNlZFVybC5wYXRobmFtZSA9IHNlbGYucHJlZml4ICsgJy93ZWJzb2NrZXQnO1xuICAgICAgICAgIHJlcXVlc3QudXJsID0gdXJsLmZvcm1hdChwYXJzZWRVcmwpO1xuICAgICAgICB9XG4gICAgICAgIF8uZWFjaChvbGRIdHRwU2VydmVyTGlzdGVuZXJzLCBmdW5jdGlvbiAob2xkTGlzdGVuZXIpIHtcbiAgICAgICAgICBvbGRMaXN0ZW5lci5hcHBseShodHRwU2VydmVyLCBhcmdzKTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgICAgaHR0cFNlcnZlci5hZGRMaXN0ZW5lcihldmVudCwgbmV3TGlzdGVuZXIpO1xuICAgIH0pO1xuICB9XG59KTtcbiIsIkREUFNlcnZlciA9IHt9O1xuXG52YXIgRmliZXIgPSBOcG0ucmVxdWlyZSgnZmliZXJzJyk7XG5cbi8vIFRoaXMgZmlsZSBjb250YWlucyBjbGFzc2VzOlxuLy8gKiBTZXNzaW9uIC0gVGhlIHNlcnZlcidzIGNvbm5lY3Rpb24gdG8gYSBzaW5nbGUgRERQIGNsaWVudFxuLy8gKiBTdWJzY3JpcHRpb24gLSBBIHNpbmdsZSBzdWJzY3JpcHRpb24gZm9yIGEgc2luZ2xlIGNsaWVudFxuLy8gKiBTZXJ2ZXIgLSBBbiBlbnRpcmUgc2VydmVyIHRoYXQgbWF5IHRhbGsgdG8gPiAxIGNsaWVudC4gQSBERFAgZW5kcG9pbnQuXG4vL1xuLy8gU2Vzc2lvbiBhbmQgU3Vic2NyaXB0aW9uIGFyZSBmaWxlIHNjb3BlLiBGb3Igbm93LCB1bnRpbCB3ZSBmcmVlemVcbi8vIHRoZSBpbnRlcmZhY2UsIFNlcnZlciBpcyBwYWNrYWdlIHNjb3BlIChpbiB0aGUgZnV0dXJlIGl0IHNob3VsZCBiZVxuLy8gZXhwb3J0ZWQuKVxuXG4vLyBSZXByZXNlbnRzIGEgc2luZ2xlIGRvY3VtZW50IGluIGEgU2Vzc2lvbkNvbGxlY3Rpb25WaWV3XG52YXIgU2Vzc2lvbkRvY3VtZW50VmlldyA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBzZWxmLmV4aXN0c0luID0gbmV3IFNldCgpOyAvLyBzZXQgb2Ygc3Vic2NyaXB0aW9uSGFuZGxlXG4gIHNlbGYuZGF0YUJ5S2V5ID0gbmV3IE1hcCgpOyAvLyBrZXktPiBbIHtzdWJzY3JpcHRpb25IYW5kbGUsIHZhbHVlfSBieSBwcmVjZWRlbmNlXVxufTtcblxuRERQU2VydmVyLl9TZXNzaW9uRG9jdW1lbnRWaWV3ID0gU2Vzc2lvbkRvY3VtZW50VmlldztcblxuXG5fLmV4dGVuZChTZXNzaW9uRG9jdW1lbnRWaWV3LnByb3RvdHlwZSwge1xuXG4gIGdldEZpZWxkczogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgcmV0ID0ge307XG4gICAgc2VsZi5kYXRhQnlLZXkuZm9yRWFjaChmdW5jdGlvbiAocHJlY2VkZW5jZUxpc3QsIGtleSkge1xuICAgICAgcmV0W2tleV0gPSBwcmVjZWRlbmNlTGlzdFswXS52YWx1ZTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmV0O1xuICB9LFxuXG4gIGNsZWFyRmllbGQ6IGZ1bmN0aW9uIChzdWJzY3JpcHRpb25IYW5kbGUsIGtleSwgY2hhbmdlQ29sbGVjdG9yKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIC8vIFB1Ymxpc2ggQVBJIGlnbm9yZXMgX2lkIGlmIHByZXNlbnQgaW4gZmllbGRzXG4gICAgaWYgKGtleSA9PT0gXCJfaWRcIilcbiAgICAgIHJldHVybjtcbiAgICB2YXIgcHJlY2VkZW5jZUxpc3QgPSBzZWxmLmRhdGFCeUtleS5nZXQoa2V5KTtcblxuICAgIC8vIEl0J3Mgb2theSB0byBjbGVhciBmaWVsZHMgdGhhdCBkaWRuJ3QgZXhpc3QuIE5vIG5lZWQgdG8gdGhyb3dcbiAgICAvLyBhbiBlcnJvci5cbiAgICBpZiAoIXByZWNlZGVuY2VMaXN0KVxuICAgICAgcmV0dXJuO1xuXG4gICAgdmFyIHJlbW92ZWRWYWx1ZSA9IHVuZGVmaW5lZDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByZWNlZGVuY2VMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgcHJlY2VkZW5jZSA9IHByZWNlZGVuY2VMaXN0W2ldO1xuICAgICAgaWYgKHByZWNlZGVuY2Uuc3Vic2NyaXB0aW9uSGFuZGxlID09PSBzdWJzY3JpcHRpb25IYW5kbGUpIHtcbiAgICAgICAgLy8gVGhlIHZpZXcncyB2YWx1ZSBjYW4gb25seSBjaGFuZ2UgaWYgdGhpcyBzdWJzY3JpcHRpb24gaXMgdGhlIG9uZSB0aGF0XG4gICAgICAgIC8vIHVzZWQgdG8gaGF2ZSBwcmVjZWRlbmNlLlxuICAgICAgICBpZiAoaSA9PT0gMClcbiAgICAgICAgICByZW1vdmVkVmFsdWUgPSBwcmVjZWRlbmNlLnZhbHVlO1xuICAgICAgICBwcmVjZWRlbmNlTGlzdC5zcGxpY2UoaSwgMSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAocHJlY2VkZW5jZUxpc3QubGVuZ3RoID09PSAwKSB7XG4gICAgICBzZWxmLmRhdGFCeUtleS5kZWxldGUoa2V5KTtcbiAgICAgIGNoYW5nZUNvbGxlY3RvcltrZXldID0gdW5kZWZpbmVkO1xuICAgIH0gZWxzZSBpZiAocmVtb3ZlZFZhbHVlICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgICAgICAgICFFSlNPTi5lcXVhbHMocmVtb3ZlZFZhbHVlLCBwcmVjZWRlbmNlTGlzdFswXS52YWx1ZSkpIHtcbiAgICAgIGNoYW5nZUNvbGxlY3RvcltrZXldID0gcHJlY2VkZW5jZUxpc3RbMF0udmFsdWU7XG4gICAgfVxuICB9LFxuXG4gIGNoYW5nZUZpZWxkOiBmdW5jdGlvbiAoc3Vic2NyaXB0aW9uSGFuZGxlLCBrZXksIHZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZUNvbGxlY3RvciwgaXNBZGQpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgLy8gUHVibGlzaCBBUEkgaWdub3JlcyBfaWQgaWYgcHJlc2VudCBpbiBmaWVsZHNcbiAgICBpZiAoa2V5ID09PSBcIl9pZFwiKVxuICAgICAgcmV0dXJuO1xuXG4gICAgLy8gRG9uJ3Qgc2hhcmUgc3RhdGUgd2l0aCB0aGUgZGF0YSBwYXNzZWQgaW4gYnkgdGhlIHVzZXIuXG4gICAgdmFsdWUgPSBFSlNPTi5jbG9uZSh2YWx1ZSk7XG5cbiAgICBpZiAoIXNlbGYuZGF0YUJ5S2V5LmhhcyhrZXkpKSB7XG4gICAgICBzZWxmLmRhdGFCeUtleS5zZXQoa2V5LCBbe3N1YnNjcmlwdGlvbkhhbmRsZTogc3Vic2NyaXB0aW9uSGFuZGxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWV9XSk7XG4gICAgICBjaGFuZ2VDb2xsZWN0b3Jba2V5XSA9IHZhbHVlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgcHJlY2VkZW5jZUxpc3QgPSBzZWxmLmRhdGFCeUtleS5nZXQoa2V5KTtcbiAgICB2YXIgZWx0O1xuICAgIGlmICghaXNBZGQpIHtcbiAgICAgIGVsdCA9IHByZWNlZGVuY2VMaXN0LmZpbmQoZnVuY3Rpb24gKHByZWNlZGVuY2UpIHtcbiAgICAgICAgICByZXR1cm4gcHJlY2VkZW5jZS5zdWJzY3JpcHRpb25IYW5kbGUgPT09IHN1YnNjcmlwdGlvbkhhbmRsZTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChlbHQpIHtcbiAgICAgIGlmIChlbHQgPT09IHByZWNlZGVuY2VMaXN0WzBdICYmICFFSlNPTi5lcXVhbHModmFsdWUsIGVsdC52YWx1ZSkpIHtcbiAgICAgICAgLy8gdGhpcyBzdWJzY3JpcHRpb24gaXMgY2hhbmdpbmcgdGhlIHZhbHVlIG9mIHRoaXMgZmllbGQuXG4gICAgICAgIGNoYW5nZUNvbGxlY3RvcltrZXldID0gdmFsdWU7XG4gICAgICB9XG4gICAgICBlbHQudmFsdWUgPSB2YWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gdGhpcyBzdWJzY3JpcHRpb24gaXMgbmV3bHkgY2FyaW5nIGFib3V0IHRoaXMgZmllbGRcbiAgICAgIHByZWNlZGVuY2VMaXN0LnB1c2goe3N1YnNjcmlwdGlvbkhhbmRsZTogc3Vic2NyaXB0aW9uSGFuZGxlLCB2YWx1ZTogdmFsdWV9KTtcbiAgICB9XG5cbiAgfVxufSk7XG5cbi8qKlxuICogUmVwcmVzZW50cyBhIGNsaWVudCdzIHZpZXcgb2YgYSBzaW5nbGUgY29sbGVjdGlvblxuICogQHBhcmFtIHtTdHJpbmd9IGNvbGxlY3Rpb25OYW1lIE5hbWUgb2YgdGhlIGNvbGxlY3Rpb24gaXQgcmVwcmVzZW50c1xuICogQHBhcmFtIHtPYmplY3QuPFN0cmluZywgRnVuY3Rpb24+fSBzZXNzaW9uQ2FsbGJhY2tzIFRoZSBjYWxsYmFja3MgZm9yIGFkZGVkLCBjaGFuZ2VkLCByZW1vdmVkXG4gKiBAY2xhc3MgU2Vzc2lvbkNvbGxlY3Rpb25WaWV3XG4gKi9cbnZhciBTZXNzaW9uQ29sbGVjdGlvblZpZXcgPSBmdW5jdGlvbiAoY29sbGVjdGlvbk5hbWUsIHNlc3Npb25DYWxsYmFja3MpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBzZWxmLmNvbGxlY3Rpb25OYW1lID0gY29sbGVjdGlvbk5hbWU7XG4gIHNlbGYuZG9jdW1lbnRzID0gbmV3IE1hcCgpO1xuICBzZWxmLmNhbGxiYWNrcyA9IHNlc3Npb25DYWxsYmFja3M7XG59O1xuXG5ERFBTZXJ2ZXIuX1Nlc3Npb25Db2xsZWN0aW9uVmlldyA9IFNlc3Npb25Db2xsZWN0aW9uVmlldztcblxuXG5fLmV4dGVuZChTZXNzaW9uQ29sbGVjdGlvblZpZXcucHJvdG90eXBlLCB7XG5cbiAgaXNFbXB0eTogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICByZXR1cm4gc2VsZi5kb2N1bWVudHMuc2l6ZSA9PT0gMDtcbiAgfSxcblxuICBkaWZmOiBmdW5jdGlvbiAocHJldmlvdXMpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgRGlmZlNlcXVlbmNlLmRpZmZNYXBzKHByZXZpb3VzLmRvY3VtZW50cywgc2VsZi5kb2N1bWVudHMsIHtcbiAgICAgIGJvdGg6IF8uYmluZChzZWxmLmRpZmZEb2N1bWVudCwgc2VsZiksXG5cbiAgICAgIHJpZ2h0T25seTogZnVuY3Rpb24gKGlkLCBub3dEVikge1xuICAgICAgICBzZWxmLmNhbGxiYWNrcy5hZGRlZChzZWxmLmNvbGxlY3Rpb25OYW1lLCBpZCwgbm93RFYuZ2V0RmllbGRzKCkpO1xuICAgICAgfSxcblxuICAgICAgbGVmdE9ubHk6IGZ1bmN0aW9uIChpZCwgcHJldkRWKSB7XG4gICAgICAgIHNlbGYuY2FsbGJhY2tzLnJlbW92ZWQoc2VsZi5jb2xsZWN0aW9uTmFtZSwgaWQpO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuXG4gIGRpZmZEb2N1bWVudDogZnVuY3Rpb24gKGlkLCBwcmV2RFYsIG5vd0RWKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBmaWVsZHMgPSB7fTtcbiAgICBEaWZmU2VxdWVuY2UuZGlmZk9iamVjdHMocHJldkRWLmdldEZpZWxkcygpLCBub3dEVi5nZXRGaWVsZHMoKSwge1xuICAgICAgYm90aDogZnVuY3Rpb24gKGtleSwgcHJldiwgbm93KSB7XG4gICAgICAgIGlmICghRUpTT04uZXF1YWxzKHByZXYsIG5vdykpXG4gICAgICAgICAgZmllbGRzW2tleV0gPSBub3c7XG4gICAgICB9LFxuICAgICAgcmlnaHRPbmx5OiBmdW5jdGlvbiAoa2V5LCBub3cpIHtcbiAgICAgICAgZmllbGRzW2tleV0gPSBub3c7XG4gICAgICB9LFxuICAgICAgbGVmdE9ubHk6IGZ1bmN0aW9uKGtleSwgcHJldikge1xuICAgICAgICBmaWVsZHNba2V5XSA9IHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBzZWxmLmNhbGxiYWNrcy5jaGFuZ2VkKHNlbGYuY29sbGVjdGlvbk5hbWUsIGlkLCBmaWVsZHMpO1xuICB9LFxuXG4gIGFkZGVkOiBmdW5jdGlvbiAoc3Vic2NyaXB0aW9uSGFuZGxlLCBpZCwgZmllbGRzKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBkb2NWaWV3ID0gc2VsZi5kb2N1bWVudHMuZ2V0KGlkKTtcbiAgICB2YXIgYWRkZWQgPSBmYWxzZTtcbiAgICBpZiAoIWRvY1ZpZXcpIHtcbiAgICAgIGFkZGVkID0gdHJ1ZTtcbiAgICAgIGRvY1ZpZXcgPSBuZXcgU2Vzc2lvbkRvY3VtZW50VmlldygpO1xuICAgICAgc2VsZi5kb2N1bWVudHMuc2V0KGlkLCBkb2NWaWV3KTtcbiAgICB9XG4gICAgZG9jVmlldy5leGlzdHNJbi5hZGQoc3Vic2NyaXB0aW9uSGFuZGxlKTtcbiAgICB2YXIgY2hhbmdlQ29sbGVjdG9yID0ge307XG4gICAgXy5lYWNoKGZpZWxkcywgZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcbiAgICAgIGRvY1ZpZXcuY2hhbmdlRmllbGQoXG4gICAgICAgIHN1YnNjcmlwdGlvbkhhbmRsZSwga2V5LCB2YWx1ZSwgY2hhbmdlQ29sbGVjdG9yLCB0cnVlKTtcbiAgICB9KTtcbiAgICBpZiAoYWRkZWQpXG4gICAgICBzZWxmLmNhbGxiYWNrcy5hZGRlZChzZWxmLmNvbGxlY3Rpb25OYW1lLCBpZCwgY2hhbmdlQ29sbGVjdG9yKTtcbiAgICBlbHNlXG4gICAgICBzZWxmLmNhbGxiYWNrcy5jaGFuZ2VkKHNlbGYuY29sbGVjdGlvbk5hbWUsIGlkLCBjaGFuZ2VDb2xsZWN0b3IpO1xuICB9LFxuXG4gIGNoYW5nZWQ6IGZ1bmN0aW9uIChzdWJzY3JpcHRpb25IYW5kbGUsIGlkLCBjaGFuZ2VkKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBjaGFuZ2VkUmVzdWx0ID0ge307XG4gICAgdmFyIGRvY1ZpZXcgPSBzZWxmLmRvY3VtZW50cy5nZXQoaWQpO1xuICAgIGlmICghZG9jVmlldylcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkNvdWxkIG5vdCBmaW5kIGVsZW1lbnQgd2l0aCBpZCBcIiArIGlkICsgXCIgdG8gY2hhbmdlXCIpO1xuICAgIF8uZWFjaChjaGFuZ2VkLCBmdW5jdGlvbiAodmFsdWUsIGtleSkge1xuICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpXG4gICAgICAgIGRvY1ZpZXcuY2xlYXJGaWVsZChzdWJzY3JpcHRpb25IYW5kbGUsIGtleSwgY2hhbmdlZFJlc3VsdCk7XG4gICAgICBlbHNlXG4gICAgICAgIGRvY1ZpZXcuY2hhbmdlRmllbGQoc3Vic2NyaXB0aW9uSGFuZGxlLCBrZXksIHZhbHVlLCBjaGFuZ2VkUmVzdWx0KTtcbiAgICB9KTtcbiAgICBzZWxmLmNhbGxiYWNrcy5jaGFuZ2VkKHNlbGYuY29sbGVjdGlvbk5hbWUsIGlkLCBjaGFuZ2VkUmVzdWx0KTtcbiAgfSxcblxuICByZW1vdmVkOiBmdW5jdGlvbiAoc3Vic2NyaXB0aW9uSGFuZGxlLCBpZCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgZG9jVmlldyA9IHNlbGYuZG9jdW1lbnRzLmdldChpZCk7XG4gICAgaWYgKCFkb2NWaWV3KSB7XG4gICAgICB2YXIgZXJyID0gbmV3IEVycm9yKFwiUmVtb3ZlZCBub25leGlzdGVudCBkb2N1bWVudCBcIiArIGlkKTtcbiAgICAgIHRocm93IGVycjtcbiAgICB9XG4gICAgZG9jVmlldy5leGlzdHNJbi5kZWxldGUoc3Vic2NyaXB0aW9uSGFuZGxlKTtcbiAgICBpZiAoZG9jVmlldy5leGlzdHNJbi5zaXplID09PSAwKSB7XG4gICAgICAvLyBpdCBpcyBnb25lIGZyb20gZXZlcnlvbmVcbiAgICAgIHNlbGYuY2FsbGJhY2tzLnJlbW92ZWQoc2VsZi5jb2xsZWN0aW9uTmFtZSwgaWQpO1xuICAgICAgc2VsZi5kb2N1bWVudHMuZGVsZXRlKGlkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGNoYW5nZWQgPSB7fTtcbiAgICAgIC8vIHJlbW92ZSB0aGlzIHN1YnNjcmlwdGlvbiBmcm9tIGV2ZXJ5IHByZWNlZGVuY2UgbGlzdFxuICAgICAgLy8gYW5kIHJlY29yZCB0aGUgY2hhbmdlc1xuICAgICAgZG9jVmlldy5kYXRhQnlLZXkuZm9yRWFjaChmdW5jdGlvbiAocHJlY2VkZW5jZUxpc3QsIGtleSkge1xuICAgICAgICBkb2NWaWV3LmNsZWFyRmllbGQoc3Vic2NyaXB0aW9uSGFuZGxlLCBrZXksIGNoYW5nZWQpO1xuICAgICAgfSk7XG5cbiAgICAgIHNlbGYuY2FsbGJhY2tzLmNoYW5nZWQoc2VsZi5jb2xsZWN0aW9uTmFtZSwgaWQsIGNoYW5nZWQpO1xuICAgIH1cbiAgfVxufSk7XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKiBTZXNzaW9uICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqL1xuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxudmFyIFNlc3Npb24gPSBmdW5jdGlvbiAoc2VydmVyLCB2ZXJzaW9uLCBzb2NrZXQsIG9wdGlvbnMpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBzZWxmLmlkID0gUmFuZG9tLmlkKCk7XG5cbiAgc2VsZi5zZXJ2ZXIgPSBzZXJ2ZXI7XG4gIHNlbGYudmVyc2lvbiA9IHZlcnNpb247XG5cbiAgc2VsZi5pbml0aWFsaXplZCA9IGZhbHNlO1xuICBzZWxmLnNvY2tldCA9IHNvY2tldDtcblxuICAvLyBzZXQgdG8gbnVsbCB3aGVuIHRoZSBzZXNzaW9uIGlzIGRlc3Ryb3llZC4gbXVsdGlwbGUgcGxhY2VzIGJlbG93XG4gIC8vIHVzZSB0aGlzIHRvIGRldGVybWluZSBpZiB0aGUgc2Vzc2lvbiBpcyBhbGl2ZSBvciBub3QuXG4gIHNlbGYuaW5RdWV1ZSA9IG5ldyBNZXRlb3IuX0RvdWJsZUVuZGVkUXVldWUoKTtcblxuICBzZWxmLmJsb2NrZWQgPSBmYWxzZTtcbiAgc2VsZi53b3JrZXJSdW5uaW5nID0gZmFsc2U7XG5cbiAgLy8gU3ViIG9iamVjdHMgZm9yIGFjdGl2ZSBzdWJzY3JpcHRpb25zXG4gIHNlbGYuX25hbWVkU3VicyA9IG5ldyBNYXAoKTtcbiAgc2VsZi5fdW5pdmVyc2FsU3VicyA9IFtdO1xuXG4gIHNlbGYudXNlcklkID0gbnVsbDtcblxuICBzZWxmLmNvbGxlY3Rpb25WaWV3cyA9IG5ldyBNYXAoKTtcblxuICAvLyBTZXQgdGhpcyB0byBmYWxzZSB0byBub3Qgc2VuZCBtZXNzYWdlcyB3aGVuIGNvbGxlY3Rpb25WaWV3cyBhcmVcbiAgLy8gbW9kaWZpZWQuIFRoaXMgaXMgZG9uZSB3aGVuIHJlcnVubmluZyBzdWJzIGluIF9zZXRVc2VySWQgYW5kIHRob3NlIG1lc3NhZ2VzXG4gIC8vIGFyZSBjYWxjdWxhdGVkIHZpYSBhIGRpZmYgaW5zdGVhZC5cbiAgc2VsZi5faXNTZW5kaW5nID0gdHJ1ZTtcblxuICAvLyBJZiB0aGlzIGlzIHRydWUsIGRvbid0IHN0YXJ0IGEgbmV3bHktY3JlYXRlZCB1bml2ZXJzYWwgcHVibGlzaGVyIG9uIHRoaXNcbiAgLy8gc2Vzc2lvbi4gVGhlIHNlc3Npb24gd2lsbCB0YWtlIGNhcmUgb2Ygc3RhcnRpbmcgaXQgd2hlbiBhcHByb3ByaWF0ZS5cbiAgc2VsZi5fZG9udFN0YXJ0TmV3VW5pdmVyc2FsU3VicyA9IGZhbHNlO1xuXG4gIC8vIHdoZW4gd2UgYXJlIHJlcnVubmluZyBzdWJzY3JpcHRpb25zLCBhbnkgcmVhZHkgbWVzc2FnZXNcbiAgLy8gd2Ugd2FudCB0byBidWZmZXIgdXAgZm9yIHdoZW4gd2UgYXJlIGRvbmUgcmVydW5uaW5nIHN1YnNjcmlwdGlvbnNcbiAgc2VsZi5fcGVuZGluZ1JlYWR5ID0gW107XG5cbiAgLy8gTGlzdCBvZiBjYWxsYmFja3MgdG8gY2FsbCB3aGVuIHRoaXMgY29ubmVjdGlvbiBpcyBjbG9zZWQuXG4gIHNlbGYuX2Nsb3NlQ2FsbGJhY2tzID0gW107XG5cblxuICAvLyBYWFggSEFDSzogSWYgYSBzb2NranMgY29ubmVjdGlvbiwgc2F2ZSBvZmYgdGhlIFVSTC4gVGhpcyBpc1xuICAvLyB0ZW1wb3JhcnkgYW5kIHdpbGwgZ28gYXdheSBpbiB0aGUgbmVhciBmdXR1cmUuXG4gIHNlbGYuX3NvY2tldFVybCA9IHNvY2tldC51cmw7XG5cbiAgLy8gQWxsb3cgdGVzdHMgdG8gZGlzYWJsZSByZXNwb25kaW5nIHRvIHBpbmdzLlxuICBzZWxmLl9yZXNwb25kVG9QaW5ncyA9IG9wdGlvbnMucmVzcG9uZFRvUGluZ3M7XG5cbiAgLy8gVGhpcyBvYmplY3QgaXMgdGhlIHB1YmxpYyBpbnRlcmZhY2UgdG8gdGhlIHNlc3Npb24uIEluIHRoZSBwdWJsaWNcbiAgLy8gQVBJLCBpdCBpcyBjYWxsZWQgdGhlIGBjb25uZWN0aW9uYCBvYmplY3QuICBJbnRlcm5hbGx5IHdlIGNhbGwgaXRcbiAgLy8gYSBgY29ubmVjdGlvbkhhbmRsZWAgdG8gYXZvaWQgYW1iaWd1aXR5LlxuICBzZWxmLmNvbm5lY3Rpb25IYW5kbGUgPSB7XG4gICAgaWQ6IHNlbGYuaWQsXG4gICAgY2xvc2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYuY2xvc2UoKTtcbiAgICB9LFxuICAgIG9uQ2xvc2U6IGZ1bmN0aW9uIChmbikge1xuICAgICAgdmFyIGNiID0gTWV0ZW9yLmJpbmRFbnZpcm9ubWVudChmbiwgXCJjb25uZWN0aW9uIG9uQ2xvc2UgY2FsbGJhY2tcIik7XG4gICAgICBpZiAoc2VsZi5pblF1ZXVlKSB7XG4gICAgICAgIHNlbGYuX2Nsb3NlQ2FsbGJhY2tzLnB1c2goY2IpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gaWYgd2UncmUgYWxyZWFkeSBjbG9zZWQsIGNhbGwgdGhlIGNhbGxiYWNrLlxuICAgICAgICBNZXRlb3IuZGVmZXIoY2IpO1xuICAgICAgfVxuICAgIH0sXG4gICAgY2xpZW50QWRkcmVzczogc2VsZi5fY2xpZW50QWRkcmVzcygpLFxuICAgIGh0dHBIZWFkZXJzOiBzZWxmLnNvY2tldC5oZWFkZXJzXG4gIH07XG5cbiAgc2VsZi5zZW5kKHsgbXNnOiAnY29ubmVjdGVkJywgc2Vzc2lvbjogc2VsZi5pZCB9KTtcblxuICAvLyBPbiBpbml0aWFsIGNvbm5lY3QsIHNwaW4gdXAgYWxsIHRoZSB1bml2ZXJzYWwgcHVibGlzaGVycy5cbiAgRmliZXIoZnVuY3Rpb24gKCkge1xuICAgIHNlbGYuc3RhcnRVbml2ZXJzYWxTdWJzKCk7XG4gIH0pLnJ1bigpO1xuXG4gIGlmICh2ZXJzaW9uICE9PSAncHJlMScgJiYgb3B0aW9ucy5oZWFydGJlYXRJbnRlcnZhbCAhPT0gMCkge1xuICAgIC8vIFdlIG5vIGxvbmdlciBuZWVkIHRoZSBsb3cgbGV2ZWwgdGltZW91dCBiZWNhdXNlIHdlIGhhdmUgaGVhcnRiZWF0aW5nLlxuICAgIHNvY2tldC5zZXRXZWJzb2NrZXRUaW1lb3V0KDApO1xuXG4gICAgc2VsZi5oZWFydGJlYXQgPSBuZXcgRERQQ29tbW9uLkhlYXJ0YmVhdCh7XG4gICAgICBoZWFydGJlYXRJbnRlcnZhbDogb3B0aW9ucy5oZWFydGJlYXRJbnRlcnZhbCxcbiAgICAgIGhlYXJ0YmVhdFRpbWVvdXQ6IG9wdGlvbnMuaGVhcnRiZWF0VGltZW91dCxcbiAgICAgIG9uVGltZW91dDogZnVuY3Rpb24gKCkge1xuICAgICAgICBzZWxmLmNsb3NlKCk7XG4gICAgICB9LFxuICAgICAgc2VuZFBpbmc6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2VsZi5zZW5kKHttc2c6ICdwaW5nJ30pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHNlbGYuaGVhcnRiZWF0LnN0YXJ0KCk7XG4gIH1cblxuICBQYWNrYWdlWydmYWN0cy1iYXNlJ10gJiYgUGFja2FnZVsnZmFjdHMtYmFzZSddLkZhY3RzLmluY3JlbWVudFNlcnZlckZhY3QoXG4gICAgXCJsaXZlZGF0YVwiLCBcInNlc3Npb25zXCIsIDEpO1xufTtcblxuXy5leHRlbmQoU2Vzc2lvbi5wcm90b3R5cGUsIHtcblxuICBzZW5kUmVhZHk6IGZ1bmN0aW9uIChzdWJzY3JpcHRpb25JZHMpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgaWYgKHNlbGYuX2lzU2VuZGluZylcbiAgICAgIHNlbGYuc2VuZCh7bXNnOiBcInJlYWR5XCIsIHN1YnM6IHN1YnNjcmlwdGlvbklkc30pO1xuICAgIGVsc2Uge1xuICAgICAgXy5lYWNoKHN1YnNjcmlwdGlvbklkcywgZnVuY3Rpb24gKHN1YnNjcmlwdGlvbklkKSB7XG4gICAgICAgIHNlbGYuX3BlbmRpbmdSZWFkeS5wdXNoKHN1YnNjcmlwdGlvbklkKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSxcblxuICBzZW5kQWRkZWQ6IGZ1bmN0aW9uIChjb2xsZWN0aW9uTmFtZSwgaWQsIGZpZWxkcykge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBpZiAoc2VsZi5faXNTZW5kaW5nKVxuICAgICAgc2VsZi5zZW5kKHttc2c6IFwiYWRkZWRcIiwgY29sbGVjdGlvbjogY29sbGVjdGlvbk5hbWUsIGlkOiBpZCwgZmllbGRzOiBmaWVsZHN9KTtcbiAgfSxcblxuICBzZW5kQ2hhbmdlZDogZnVuY3Rpb24gKGNvbGxlY3Rpb25OYW1lLCBpZCwgZmllbGRzKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIGlmIChfLmlzRW1wdHkoZmllbGRzKSlcbiAgICAgIHJldHVybjtcblxuICAgIGlmIChzZWxmLl9pc1NlbmRpbmcpIHtcbiAgICAgIHNlbGYuc2VuZCh7XG4gICAgICAgIG1zZzogXCJjaGFuZ2VkXCIsXG4gICAgICAgIGNvbGxlY3Rpb246IGNvbGxlY3Rpb25OYW1lLFxuICAgICAgICBpZDogaWQsXG4gICAgICAgIGZpZWxkczogZmllbGRzXG4gICAgICB9KTtcbiAgICB9XG4gIH0sXG5cbiAgc2VuZFJlbW92ZWQ6IGZ1bmN0aW9uIChjb2xsZWN0aW9uTmFtZSwgaWQpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgaWYgKHNlbGYuX2lzU2VuZGluZylcbiAgICAgIHNlbGYuc2VuZCh7bXNnOiBcInJlbW92ZWRcIiwgY29sbGVjdGlvbjogY29sbGVjdGlvbk5hbWUsIGlkOiBpZH0pO1xuICB9LFxuXG4gIGdldFNlbmRDYWxsYmFja3M6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgcmV0dXJuIHtcbiAgICAgIGFkZGVkOiBfLmJpbmQoc2VsZi5zZW5kQWRkZWQsIHNlbGYpLFxuICAgICAgY2hhbmdlZDogXy5iaW5kKHNlbGYuc2VuZENoYW5nZWQsIHNlbGYpLFxuICAgICAgcmVtb3ZlZDogXy5iaW5kKHNlbGYuc2VuZFJlbW92ZWQsIHNlbGYpXG4gICAgfTtcbiAgfSxcblxuICBnZXRDb2xsZWN0aW9uVmlldzogZnVuY3Rpb24gKGNvbGxlY3Rpb25OYW1lKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciByZXQgPSBzZWxmLmNvbGxlY3Rpb25WaWV3cy5nZXQoY29sbGVjdGlvbk5hbWUpO1xuICAgIGlmICghcmV0KSB7XG4gICAgICByZXQgPSBuZXcgU2Vzc2lvbkNvbGxlY3Rpb25WaWV3KGNvbGxlY3Rpb25OYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZ2V0U2VuZENhbGxiYWNrcygpKTtcbiAgICAgIHNlbGYuY29sbGVjdGlvblZpZXdzLnNldChjb2xsZWN0aW9uTmFtZSwgcmV0KTtcbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbiAgfSxcblxuICBhZGRlZDogZnVuY3Rpb24gKHN1YnNjcmlwdGlvbkhhbmRsZSwgY29sbGVjdGlvbk5hbWUsIGlkLCBmaWVsZHMpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIHZpZXcgPSBzZWxmLmdldENvbGxlY3Rpb25WaWV3KGNvbGxlY3Rpb25OYW1lKTtcbiAgICB2aWV3LmFkZGVkKHN1YnNjcmlwdGlvbkhhbmRsZSwgaWQsIGZpZWxkcyk7XG4gIH0sXG5cbiAgcmVtb3ZlZDogZnVuY3Rpb24gKHN1YnNjcmlwdGlvbkhhbmRsZSwgY29sbGVjdGlvbk5hbWUsIGlkKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciB2aWV3ID0gc2VsZi5nZXRDb2xsZWN0aW9uVmlldyhjb2xsZWN0aW9uTmFtZSk7XG4gICAgdmlldy5yZW1vdmVkKHN1YnNjcmlwdGlvbkhhbmRsZSwgaWQpO1xuICAgIGlmICh2aWV3LmlzRW1wdHkoKSkge1xuICAgICAgIHNlbGYuY29sbGVjdGlvblZpZXdzLmRlbGV0ZShjb2xsZWN0aW9uTmFtZSk7XG4gICAgfVxuICB9LFxuXG4gIGNoYW5nZWQ6IGZ1bmN0aW9uIChzdWJzY3JpcHRpb25IYW5kbGUsIGNvbGxlY3Rpb25OYW1lLCBpZCwgZmllbGRzKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciB2aWV3ID0gc2VsZi5nZXRDb2xsZWN0aW9uVmlldyhjb2xsZWN0aW9uTmFtZSk7XG4gICAgdmlldy5jaGFuZ2VkKHN1YnNjcmlwdGlvbkhhbmRsZSwgaWQsIGZpZWxkcyk7XG4gIH0sXG5cbiAgc3RhcnRVbml2ZXJzYWxTdWJzOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIC8vIE1ha2UgYSBzaGFsbG93IGNvcHkgb2YgdGhlIHNldCBvZiB1bml2ZXJzYWwgaGFuZGxlcnMgYW5kIHN0YXJ0IHRoZW0uIElmXG4gICAgLy8gYWRkaXRpb25hbCB1bml2ZXJzYWwgcHVibGlzaGVycyBzdGFydCB3aGlsZSB3ZSdyZSBydW5uaW5nIHRoZW0gKGR1ZSB0b1xuICAgIC8vIHlpZWxkaW5nKSwgdGhleSB3aWxsIHJ1biBzZXBhcmF0ZWx5IGFzIHBhcnQgb2YgU2VydmVyLnB1Ymxpc2guXG4gICAgdmFyIGhhbmRsZXJzID0gXy5jbG9uZShzZWxmLnNlcnZlci51bml2ZXJzYWxfcHVibGlzaF9oYW5kbGVycyk7XG4gICAgXy5lYWNoKGhhbmRsZXJzLCBmdW5jdGlvbiAoaGFuZGxlcikge1xuICAgICAgc2VsZi5fc3RhcnRTdWJzY3JpcHRpb24oaGFuZGxlcik7XG4gICAgfSk7XG4gIH0sXG5cbiAgLy8gRGVzdHJveSB0aGlzIHNlc3Npb24gYW5kIHVucmVnaXN0ZXIgaXQgYXQgdGhlIHNlcnZlci5cbiAgY2xvc2U6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAvLyBEZXN0cm95IHRoaXMgc2Vzc2lvbiwgZXZlbiBpZiBpdCdzIG5vdCByZWdpc3RlcmVkIGF0IHRoZVxuICAgIC8vIHNlcnZlci4gU3RvcCBhbGwgcHJvY2Vzc2luZyBhbmQgdGVhciBldmVyeXRoaW5nIGRvd24uIElmIGEgc29ja2V0XG4gICAgLy8gd2FzIGF0dGFjaGVkLCBjbG9zZSBpdC5cblxuICAgIC8vIEFscmVhZHkgZGVzdHJveWVkLlxuICAgIGlmICghIHNlbGYuaW5RdWV1ZSlcbiAgICAgIHJldHVybjtcblxuICAgIC8vIERyb3AgdGhlIG1lcmdlIGJveCBkYXRhIGltbWVkaWF0ZWx5LlxuICAgIHNlbGYuaW5RdWV1ZSA9IG51bGw7XG4gICAgc2VsZi5jb2xsZWN0aW9uVmlld3MgPSBuZXcgTWFwKCk7XG5cbiAgICBpZiAoc2VsZi5oZWFydGJlYXQpIHtcbiAgICAgIHNlbGYuaGVhcnRiZWF0LnN0b3AoKTtcbiAgICAgIHNlbGYuaGVhcnRiZWF0ID0gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAoc2VsZi5zb2NrZXQpIHtcbiAgICAgIHNlbGYuc29ja2V0LmNsb3NlKCk7XG4gICAgICBzZWxmLnNvY2tldC5fbWV0ZW9yU2Vzc2lvbiA9IG51bGw7XG4gICAgfVxuXG4gICAgUGFja2FnZVsnZmFjdHMtYmFzZSddICYmIFBhY2thZ2VbJ2ZhY3RzLWJhc2UnXS5GYWN0cy5pbmNyZW1lbnRTZXJ2ZXJGYWN0KFxuICAgICAgXCJsaXZlZGF0YVwiLCBcInNlc3Npb25zXCIsIC0xKTtcblxuICAgIE1ldGVvci5kZWZlcihmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBzdG9wIGNhbGxiYWNrcyBjYW4geWllbGQsIHNvIHdlIGRlZmVyIHRoaXMgb24gY2xvc2UuXG4gICAgICAvLyBzdWIuX2lzRGVhY3RpdmF0ZWQoKSBkZXRlY3RzIHRoYXQgd2Ugc2V0IGluUXVldWUgdG8gbnVsbCBhbmRcbiAgICAgIC8vIHRyZWF0cyBpdCBhcyBzZW1pLWRlYWN0aXZhdGVkIChpdCB3aWxsIGlnbm9yZSBpbmNvbWluZyBjYWxsYmFja3MsIGV0YykuXG4gICAgICBzZWxmLl9kZWFjdGl2YXRlQWxsU3Vic2NyaXB0aW9ucygpO1xuXG4gICAgICAvLyBEZWZlciBjYWxsaW5nIHRoZSBjbG9zZSBjYWxsYmFja3MsIHNvIHRoYXQgdGhlIGNhbGxlciBjbG9zaW5nXG4gICAgICAvLyB0aGUgc2Vzc2lvbiBpc24ndCB3YWl0aW5nIGZvciBhbGwgdGhlIGNhbGxiYWNrcyB0byBjb21wbGV0ZS5cbiAgICAgIF8uZWFjaChzZWxmLl9jbG9zZUNhbGxiYWNrcywgZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIC8vIFVucmVnaXN0ZXIgdGhlIHNlc3Npb24uXG4gICAgc2VsZi5zZXJ2ZXIuX3JlbW92ZVNlc3Npb24oc2VsZik7XG4gIH0sXG5cbiAgLy8gU2VuZCBhIG1lc3NhZ2UgKGRvaW5nIG5vdGhpbmcgaWYgbm8gc29ja2V0IGlzIGNvbm5lY3RlZCByaWdodCBub3cuKVxuICAvLyBJdCBzaG91bGQgYmUgYSBKU09OIG9iamVjdCAoaXQgd2lsbCBiZSBzdHJpbmdpZmllZC4pXG4gIHNlbmQ6IGZ1bmN0aW9uIChtc2cpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgaWYgKHNlbGYuc29ja2V0KSB7XG4gICAgICBpZiAoTWV0ZW9yLl9wcmludFNlbnRERFApXG4gICAgICAgIE1ldGVvci5fZGVidWcoXCJTZW50IEREUFwiLCBERFBDb21tb24uc3RyaW5naWZ5RERQKG1zZykpO1xuICAgICAgc2VsZi5zb2NrZXQuc2VuZChERFBDb21tb24uc3RyaW5naWZ5RERQKG1zZykpO1xuICAgIH1cbiAgfSxcblxuICAvLyBTZW5kIGEgY29ubmVjdGlvbiBlcnJvci5cbiAgc2VuZEVycm9yOiBmdW5jdGlvbiAocmVhc29uLCBvZmZlbmRpbmdNZXNzYWdlKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBtc2cgPSB7bXNnOiAnZXJyb3InLCByZWFzb246IHJlYXNvbn07XG4gICAgaWYgKG9mZmVuZGluZ01lc3NhZ2UpXG4gICAgICBtc2cub2ZmZW5kaW5nTWVzc2FnZSA9IG9mZmVuZGluZ01lc3NhZ2U7XG4gICAgc2VsZi5zZW5kKG1zZyk7XG4gIH0sXG5cbiAgLy8gUHJvY2VzcyAnbXNnJyBhcyBhbiBpbmNvbWluZyBtZXNzYWdlLiAoQnV0IGFzIGEgZ3VhcmQgYWdhaW5zdFxuICAvLyByYWNlIGNvbmRpdGlvbnMgZHVyaW5nIHJlY29ubmVjdGlvbiwgaWdub3JlIHRoZSBtZXNzYWdlIGlmXG4gIC8vICdzb2NrZXQnIGlzIG5vdCB0aGUgY3VycmVudGx5IGNvbm5lY3RlZCBzb2NrZXQuKVxuICAvL1xuICAvLyBXZSBydW4gdGhlIG1lc3NhZ2VzIGZyb20gdGhlIGNsaWVudCBvbmUgYXQgYSB0aW1lLCBpbiB0aGUgb3JkZXJcbiAgLy8gZ2l2ZW4gYnkgdGhlIGNsaWVudC4gVGhlIG1lc3NhZ2UgaGFuZGxlciBpcyBwYXNzZWQgYW4gaWRlbXBvdGVudFxuICAvLyBmdW5jdGlvbiAndW5ibG9jaycgd2hpY2ggaXQgbWF5IGNhbGwgdG8gYWxsb3cgb3RoZXIgbWVzc2FnZXMgdG9cbiAgLy8gYmVnaW4gcnVubmluZyBpbiBwYXJhbGxlbCBpbiBhbm90aGVyIGZpYmVyIChmb3IgZXhhbXBsZSwgYSBtZXRob2RcbiAgLy8gdGhhdCB3YW50cyB0byB5aWVsZC4pIE90aGVyd2lzZSwgaXQgaXMgYXV0b21hdGljYWxseSB1bmJsb2NrZWRcbiAgLy8gd2hlbiBpdCByZXR1cm5zLlxuICAvL1xuICAvLyBBY3R1YWxseSwgd2UgZG9uJ3QgaGF2ZSB0byAndG90YWxseSBvcmRlcicgdGhlIG1lc3NhZ2VzIGluIHRoaXNcbiAgLy8gd2F5LCBidXQgaXQncyB0aGUgZWFzaWVzdCB0aGluZyB0aGF0J3MgY29ycmVjdC4gKHVuc3ViIG5lZWRzIHRvXG4gIC8vIGJlIG9yZGVyZWQgYWdhaW5zdCBzdWIsIG1ldGhvZHMgbmVlZCB0byBiZSBvcmRlcmVkIGFnYWluc3QgZWFjaFxuICAvLyBvdGhlci4pXG4gIHByb2Nlc3NNZXNzYWdlOiBmdW5jdGlvbiAobXNnX2luKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIGlmICghc2VsZi5pblF1ZXVlKSAvLyB3ZSBoYXZlIGJlZW4gZGVzdHJveWVkLlxuICAgICAgcmV0dXJuO1xuXG4gICAgLy8gUmVzcG9uZCB0byBwaW5nIGFuZCBwb25nIG1lc3NhZ2VzIGltbWVkaWF0ZWx5IHdpdGhvdXQgcXVldWluZy5cbiAgICAvLyBJZiB0aGUgbmVnb3RpYXRlZCBERFAgdmVyc2lvbiBpcyBcInByZTFcIiB3aGljaCBkaWRuJ3Qgc3VwcG9ydFxuICAgIC8vIHBpbmdzLCBwcmVzZXJ2ZSB0aGUgXCJwcmUxXCIgYmVoYXZpb3Igb2YgcmVzcG9uZGluZyB3aXRoIGEgXCJiYWRcbiAgICAvLyByZXF1ZXN0XCIgZm9yIHRoZSB1bmtub3duIG1lc3NhZ2VzLlxuICAgIC8vXG4gICAgLy8gRmliZXJzIGFyZSBuZWVkZWQgYmVjYXVzZSBoZWFydGJlYXQgdXNlcyBNZXRlb3Iuc2V0VGltZW91dCwgd2hpY2hcbiAgICAvLyBuZWVkcyBhIEZpYmVyLiBXZSBjb3VsZCBhY3R1YWxseSB1c2UgcmVndWxhciBzZXRUaW1lb3V0IGFuZCBhdm9pZFxuICAgIC8vIHRoZXNlIG5ldyBmaWJlcnMsIGJ1dCBpdCBpcyBlYXNpZXIgdG8ganVzdCBtYWtlIGV2ZXJ5dGhpbmcgdXNlXG4gICAgLy8gTWV0ZW9yLnNldFRpbWVvdXQgYW5kIG5vdCB0aGluayB0b28gaGFyZC5cbiAgICAvL1xuICAgIC8vIEFueSBtZXNzYWdlIGNvdW50cyBhcyByZWNlaXZpbmcgYSBwb25nLCBhcyBpdCBkZW1vbnN0cmF0ZXMgdGhhdFxuICAgIC8vIHRoZSBjbGllbnQgaXMgc3RpbGwgYWxpdmUuXG4gICAgaWYgKHNlbGYuaGVhcnRiZWF0KSB7XG4gICAgICBGaWJlcihmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNlbGYuaGVhcnRiZWF0Lm1lc3NhZ2VSZWNlaXZlZCgpO1xuICAgICAgfSkucnVuKCk7XG4gICAgfVxuXG4gICAgaWYgKHNlbGYudmVyc2lvbiAhPT0gJ3ByZTEnICYmIG1zZ19pbi5tc2cgPT09ICdwaW5nJykge1xuICAgICAgaWYgKHNlbGYuX3Jlc3BvbmRUb1BpbmdzKVxuICAgICAgICBzZWxmLnNlbmQoe21zZzogXCJwb25nXCIsIGlkOiBtc2dfaW4uaWR9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHNlbGYudmVyc2lvbiAhPT0gJ3ByZTEnICYmIG1zZ19pbi5tc2cgPT09ICdwb25nJykge1xuICAgICAgLy8gU2luY2UgZXZlcnl0aGluZyBpcyBhIHBvbmcsIG5vdGhpbmcgdG8gZG9cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBzZWxmLmluUXVldWUucHVzaChtc2dfaW4pO1xuICAgIGlmIChzZWxmLndvcmtlclJ1bm5pbmcpXG4gICAgICByZXR1cm47XG4gICAgc2VsZi53b3JrZXJSdW5uaW5nID0gdHJ1ZTtcblxuICAgIHZhciBwcm9jZXNzTmV4dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBtc2cgPSBzZWxmLmluUXVldWUgJiYgc2VsZi5pblF1ZXVlLnNoaWZ0KCk7XG4gICAgICBpZiAoIW1zZykge1xuICAgICAgICBzZWxmLndvcmtlclJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBGaWJlcihmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBibG9ja2VkID0gdHJ1ZTtcblxuICAgICAgICB2YXIgdW5ibG9jayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAoIWJsb2NrZWQpXG4gICAgICAgICAgICByZXR1cm47IC8vIGlkZW1wb3RlbnRcbiAgICAgICAgICBibG9ja2VkID0gZmFsc2U7XG4gICAgICAgICAgcHJvY2Vzc05leHQoKTtcbiAgICAgICAgfTtcblxuICAgICAgICBzZWxmLnNlcnZlci5vbk1lc3NhZ2VIb29rLmVhY2goZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgICAgY2FsbGJhY2sobXNnLCBzZWxmKTtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKF8uaGFzKHNlbGYucHJvdG9jb2xfaGFuZGxlcnMsIG1zZy5tc2cpKVxuICAgICAgICAgIHNlbGYucHJvdG9jb2xfaGFuZGxlcnNbbXNnLm1zZ10uY2FsbChzZWxmLCBtc2csIHVuYmxvY2spO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgc2VsZi5zZW5kRXJyb3IoJ0JhZCByZXF1ZXN0JywgbXNnKTtcbiAgICAgICAgdW5ibG9jaygpOyAvLyBpbiBjYXNlIHRoZSBoYW5kbGVyIGRpZG4ndCBhbHJlYWR5IGRvIGl0XG4gICAgICB9KS5ydW4oKTtcbiAgICB9O1xuXG4gICAgcHJvY2Vzc05leHQoKTtcbiAgfSxcblxuICBwcm90b2NvbF9oYW5kbGVyczoge1xuICAgIHN1YjogZnVuY3Rpb24gKG1zZykge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAvLyByZWplY3QgbWFsZm9ybWVkIG1lc3NhZ2VzXG4gICAgICBpZiAodHlwZW9mIChtc2cuaWQpICE9PSBcInN0cmluZ1wiIHx8XG4gICAgICAgICAgdHlwZW9mIChtc2cubmFtZSkgIT09IFwic3RyaW5nXCIgfHxcbiAgICAgICAgICAoKCdwYXJhbXMnIGluIG1zZykgJiYgIShtc2cucGFyYW1zIGluc3RhbmNlb2YgQXJyYXkpKSkge1xuICAgICAgICBzZWxmLnNlbmRFcnJvcihcIk1hbGZvcm1lZCBzdWJzY3JpcHRpb25cIiwgbXNnKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXNlbGYuc2VydmVyLnB1Ymxpc2hfaGFuZGxlcnNbbXNnLm5hbWVdKSB7XG4gICAgICAgIHNlbGYuc2VuZCh7XG4gICAgICAgICAgbXNnOiAnbm9zdWInLCBpZDogbXNnLmlkLFxuICAgICAgICAgIGVycm9yOiBuZXcgTWV0ZW9yLkVycm9yKDQwNCwgYFN1YnNjcmlwdGlvbiAnJHttc2cubmFtZX0nIG5vdCBmb3VuZGApfSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHNlbGYuX25hbWVkU3Vicy5oYXMobXNnLmlkKSlcbiAgICAgICAgLy8gc3VicyBhcmUgaWRlbXBvdGVudCwgb3IgcmF0aGVyLCB0aGV5IGFyZSBpZ25vcmVkIGlmIGEgc3ViXG4gICAgICAgIC8vIHdpdGggdGhhdCBpZCBhbHJlYWR5IGV4aXN0cy4gdGhpcyBpcyBpbXBvcnRhbnQgZHVyaW5nXG4gICAgICAgIC8vIHJlY29ubmVjdC5cbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICAvLyBYWFggSXQnZCBiZSBtdWNoIGJldHRlciBpZiB3ZSBoYWQgZ2VuZXJpYyBob29rcyB3aGVyZSBhbnkgcGFja2FnZSBjYW5cbiAgICAgIC8vIGhvb2sgaW50byBzdWJzY3JpcHRpb24gaGFuZGxpbmcsIGJ1dCBpbiB0aGUgbWVhbiB3aGlsZSB3ZSBzcGVjaWFsIGNhc2VcbiAgICAgIC8vIGRkcC1yYXRlLWxpbWl0ZXIgcGFja2FnZS4gVGhpcyBpcyBhbHNvIGRvbmUgZm9yIHdlYWsgcmVxdWlyZW1lbnRzIHRvXG4gICAgICAvLyBhZGQgdGhlIGRkcC1yYXRlLWxpbWl0ZXIgcGFja2FnZSBpbiBjYXNlIHdlIGRvbid0IGhhdmUgQWNjb3VudHMuIEFcbiAgICAgIC8vIHVzZXIgdHJ5aW5nIHRvIHVzZSB0aGUgZGRwLXJhdGUtbGltaXRlciBtdXN0IGV4cGxpY2l0bHkgcmVxdWlyZSBpdC5cbiAgICAgIGlmIChQYWNrYWdlWydkZHAtcmF0ZS1saW1pdGVyJ10pIHtcbiAgICAgICAgdmFyIEREUFJhdGVMaW1pdGVyID0gUGFja2FnZVsnZGRwLXJhdGUtbGltaXRlciddLkREUFJhdGVMaW1pdGVyO1xuICAgICAgICB2YXIgcmF0ZUxpbWl0ZXJJbnB1dCA9IHtcbiAgICAgICAgICB1c2VySWQ6IHNlbGYudXNlcklkLFxuICAgICAgICAgIGNsaWVudEFkZHJlc3M6IHNlbGYuY29ubmVjdGlvbkhhbmRsZS5jbGllbnRBZGRyZXNzLFxuICAgICAgICAgIHR5cGU6IFwic3Vic2NyaXB0aW9uXCIsXG4gICAgICAgICAgbmFtZTogbXNnLm5hbWUsXG4gICAgICAgICAgY29ubmVjdGlvbklkOiBzZWxmLmlkXG4gICAgICAgIH07XG5cbiAgICAgICAgRERQUmF0ZUxpbWl0ZXIuX2luY3JlbWVudChyYXRlTGltaXRlcklucHV0KTtcbiAgICAgICAgdmFyIHJhdGVMaW1pdFJlc3VsdCA9IEREUFJhdGVMaW1pdGVyLl9jaGVjayhyYXRlTGltaXRlcklucHV0KTtcbiAgICAgICAgaWYgKCFyYXRlTGltaXRSZXN1bHQuYWxsb3dlZCkge1xuICAgICAgICAgIHNlbGYuc2VuZCh7XG4gICAgICAgICAgICBtc2c6ICdub3N1YicsIGlkOiBtc2cuaWQsXG4gICAgICAgICAgICBlcnJvcjogbmV3IE1ldGVvci5FcnJvcihcbiAgICAgICAgICAgICAgJ3Rvby1tYW55LXJlcXVlc3RzJyxcbiAgICAgICAgICAgICAgRERQUmF0ZUxpbWl0ZXIuZ2V0RXJyb3JNZXNzYWdlKHJhdGVMaW1pdFJlc3VsdCksXG4gICAgICAgICAgICAgIHt0aW1lVG9SZXNldDogcmF0ZUxpbWl0UmVzdWx0LnRpbWVUb1Jlc2V0fSlcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdmFyIGhhbmRsZXIgPSBzZWxmLnNlcnZlci5wdWJsaXNoX2hhbmRsZXJzW21zZy5uYW1lXTtcblxuICAgICAgc2VsZi5fc3RhcnRTdWJzY3JpcHRpb24oaGFuZGxlciwgbXNnLmlkLCBtc2cucGFyYW1zLCBtc2cubmFtZSk7XG5cbiAgICB9LFxuXG4gICAgdW5zdWI6IGZ1bmN0aW9uIChtc2cpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgc2VsZi5fc3RvcFN1YnNjcmlwdGlvbihtc2cuaWQpO1xuICAgIH0sXG5cbiAgICBtZXRob2Q6IGZ1bmN0aW9uIChtc2csIHVuYmxvY2spIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgLy8gcmVqZWN0IG1hbGZvcm1lZCBtZXNzYWdlc1xuICAgICAgLy8gRm9yIG5vdywgd2Ugc2lsZW50bHkgaWdub3JlIHVua25vd24gYXR0cmlidXRlcyxcbiAgICAgIC8vIGZvciBmb3J3YXJkcyBjb21wYXRpYmlsaXR5LlxuICAgICAgaWYgKHR5cGVvZiAobXNnLmlkKSAhPT0gXCJzdHJpbmdcIiB8fFxuICAgICAgICAgIHR5cGVvZiAobXNnLm1ldGhvZCkgIT09IFwic3RyaW5nXCIgfHxcbiAgICAgICAgICAoKCdwYXJhbXMnIGluIG1zZykgJiYgIShtc2cucGFyYW1zIGluc3RhbmNlb2YgQXJyYXkpKSB8fFxuICAgICAgICAgICgoJ3JhbmRvbVNlZWQnIGluIG1zZykgJiYgKHR5cGVvZiBtc2cucmFuZG9tU2VlZCAhPT0gXCJzdHJpbmdcIikpKSB7XG4gICAgICAgIHNlbGYuc2VuZEVycm9yKFwiTWFsZm9ybWVkIG1ldGhvZCBpbnZvY2F0aW9uXCIsIG1zZyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIHJhbmRvbVNlZWQgPSBtc2cucmFuZG9tU2VlZCB8fCBudWxsO1xuXG4gICAgICAvLyBzZXQgdXAgdG8gbWFyayB0aGUgbWV0aG9kIGFzIHNhdGlzZmllZCBvbmNlIGFsbCBvYnNlcnZlcnNcbiAgICAgIC8vIChhbmQgc3Vic2NyaXB0aW9ucykgaGF2ZSByZWFjdGVkIHRvIGFueSB3cml0ZXMgdGhhdCB3ZXJlXG4gICAgICAvLyBkb25lLlxuICAgICAgdmFyIGZlbmNlID0gbmV3IEREUFNlcnZlci5fV3JpdGVGZW5jZTtcbiAgICAgIGZlbmNlLm9uQWxsQ29tbWl0dGVkKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gUmV0aXJlIHRoZSBmZW5jZSBzbyB0aGF0IGZ1dHVyZSB3cml0ZXMgYXJlIGFsbG93ZWQuXG4gICAgICAgIC8vIFRoaXMgbWVhbnMgdGhhdCBjYWxsYmFja3MgbGlrZSB0aW1lcnMgYXJlIGZyZWUgdG8gdXNlXG4gICAgICAgIC8vIHRoZSBmZW5jZSwgYW5kIGlmIHRoZXkgZmlyZSBiZWZvcmUgaXQncyBhcm1lZCAoZm9yXG4gICAgICAgIC8vIGV4YW1wbGUsIGJlY2F1c2UgdGhlIG1ldGhvZCB3YWl0cyBmb3IgdGhlbSkgdGhlaXJcbiAgICAgICAgLy8gd3JpdGVzIHdpbGwgYmUgaW5jbHVkZWQgaW4gdGhlIGZlbmNlLlxuICAgICAgICBmZW5jZS5yZXRpcmUoKTtcbiAgICAgICAgc2VsZi5zZW5kKHtcbiAgICAgICAgICBtc2c6ICd1cGRhdGVkJywgbWV0aG9kczogW21zZy5pZF19KTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBmaW5kIHRoZSBoYW5kbGVyXG4gICAgICB2YXIgaGFuZGxlciA9IHNlbGYuc2VydmVyLm1ldGhvZF9oYW5kbGVyc1ttc2cubWV0aG9kXTtcbiAgICAgIGlmICghaGFuZGxlcikge1xuICAgICAgICBzZWxmLnNlbmQoe1xuICAgICAgICAgIG1zZzogJ3Jlc3VsdCcsIGlkOiBtc2cuaWQsXG4gICAgICAgICAgZXJyb3I6IG5ldyBNZXRlb3IuRXJyb3IoNDA0LCBgTWV0aG9kICcke21zZy5tZXRob2R9JyBub3QgZm91bmRgKX0pO1xuICAgICAgICBmZW5jZS5hcm0oKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgc2V0VXNlcklkID0gZnVuY3Rpb24odXNlcklkKSB7XG4gICAgICAgIHNlbGYuX3NldFVzZXJJZCh1c2VySWQpO1xuICAgICAgfTtcblxuICAgICAgdmFyIGludm9jYXRpb24gPSBuZXcgRERQQ29tbW9uLk1ldGhvZEludm9jYXRpb24oe1xuICAgICAgICBpc1NpbXVsYXRpb246IGZhbHNlLFxuICAgICAgICB1c2VySWQ6IHNlbGYudXNlcklkLFxuICAgICAgICBzZXRVc2VySWQ6IHNldFVzZXJJZCxcbiAgICAgICAgdW5ibG9jazogdW5ibG9jayxcbiAgICAgICAgY29ubmVjdGlvbjogc2VsZi5jb25uZWN0aW9uSGFuZGxlLFxuICAgICAgICByYW5kb21TZWVkOiByYW5kb21TZWVkXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgLy8gWFhYIEl0J2QgYmUgYmV0dGVyIGlmIHdlIGNvdWxkIGhvb2sgaW50byBtZXRob2QgaGFuZGxlcnMgYmV0dGVyIGJ1dFxuICAgICAgICAvLyBmb3Igbm93LCB3ZSBuZWVkIHRvIGNoZWNrIGlmIHRoZSBkZHAtcmF0ZS1saW1pdGVyIGV4aXN0cyBzaW5jZSB3ZVxuICAgICAgICAvLyBoYXZlIGEgd2VhayByZXF1aXJlbWVudCBmb3IgdGhlIGRkcC1yYXRlLWxpbWl0ZXIgcGFja2FnZSB0byBiZSBhZGRlZFxuICAgICAgICAvLyB0byBvdXIgYXBwbGljYXRpb24uXG4gICAgICAgIGlmIChQYWNrYWdlWydkZHAtcmF0ZS1saW1pdGVyJ10pIHtcbiAgICAgICAgICB2YXIgRERQUmF0ZUxpbWl0ZXIgPSBQYWNrYWdlWydkZHAtcmF0ZS1saW1pdGVyJ10uRERQUmF0ZUxpbWl0ZXI7XG4gICAgICAgICAgdmFyIHJhdGVMaW1pdGVySW5wdXQgPSB7XG4gICAgICAgICAgICB1c2VySWQ6IHNlbGYudXNlcklkLFxuICAgICAgICAgICAgY2xpZW50QWRkcmVzczogc2VsZi5jb25uZWN0aW9uSGFuZGxlLmNsaWVudEFkZHJlc3MsXG4gICAgICAgICAgICB0eXBlOiBcIm1ldGhvZFwiLFxuICAgICAgICAgICAgbmFtZTogbXNnLm1ldGhvZCxcbiAgICAgICAgICAgIGNvbm5lY3Rpb25JZDogc2VsZi5pZFxuICAgICAgICAgIH07XG4gICAgICAgICAgRERQUmF0ZUxpbWl0ZXIuX2luY3JlbWVudChyYXRlTGltaXRlcklucHV0KTtcbiAgICAgICAgICB2YXIgcmF0ZUxpbWl0UmVzdWx0ID0gRERQUmF0ZUxpbWl0ZXIuX2NoZWNrKHJhdGVMaW1pdGVySW5wdXQpXG4gICAgICAgICAgaWYgKCFyYXRlTGltaXRSZXN1bHQuYWxsb3dlZCkge1xuICAgICAgICAgICAgcmVqZWN0KG5ldyBNZXRlb3IuRXJyb3IoXG4gICAgICAgICAgICAgIFwidG9vLW1hbnktcmVxdWVzdHNcIixcbiAgICAgICAgICAgICAgRERQUmF0ZUxpbWl0ZXIuZ2V0RXJyb3JNZXNzYWdlKHJhdGVMaW1pdFJlc3VsdCksXG4gICAgICAgICAgICAgIHt0aW1lVG9SZXNldDogcmF0ZUxpbWl0UmVzdWx0LnRpbWVUb1Jlc2V0fVxuICAgICAgICAgICAgKSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmVzb2x2ZShERFBTZXJ2ZXIuX0N1cnJlbnRXcml0ZUZlbmNlLndpdGhWYWx1ZShcbiAgICAgICAgICBmZW5jZSxcbiAgICAgICAgICAoKSA9PiBERFAuX0N1cnJlbnRNZXRob2RJbnZvY2F0aW9uLndpdGhWYWx1ZShcbiAgICAgICAgICAgIGludm9jYXRpb24sXG4gICAgICAgICAgICAoKSA9PiBtYXliZUF1ZGl0QXJndW1lbnRDaGVja3MoXG4gICAgICAgICAgICAgIGhhbmRsZXIsIGludm9jYXRpb24sIG1zZy5wYXJhbXMsXG4gICAgICAgICAgICAgIFwiY2FsbCB0byAnXCIgKyBtc2cubWV0aG9kICsgXCInXCJcbiAgICAgICAgICAgIClcbiAgICAgICAgICApXG4gICAgICAgICkpO1xuICAgICAgfSk7XG5cbiAgICAgIGZ1bmN0aW9uIGZpbmlzaCgpIHtcbiAgICAgICAgZmVuY2UuYXJtKCk7XG4gICAgICAgIHVuYmxvY2soKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgcGF5bG9hZCA9IHtcbiAgICAgICAgbXNnOiBcInJlc3VsdFwiLFxuICAgICAgICBpZDogbXNnLmlkXG4gICAgICB9O1xuXG4gICAgICBwcm9taXNlLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICBmaW5pc2goKTtcbiAgICAgICAgaWYgKHJlc3VsdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgcGF5bG9hZC5yZXN1bHQgPSByZXN1bHQ7XG4gICAgICAgIH1cbiAgICAgICAgc2VsZi5zZW5kKHBheWxvYWQpO1xuICAgICAgfSwgKGV4Y2VwdGlvbikgPT4ge1xuICAgICAgICBmaW5pc2goKTtcbiAgICAgICAgcGF5bG9hZC5lcnJvciA9IHdyYXBJbnRlcm5hbEV4Y2VwdGlvbihcbiAgICAgICAgICBleGNlcHRpb24sXG4gICAgICAgICAgYHdoaWxlIGludm9raW5nIG1ldGhvZCAnJHttc2cubWV0aG9kfSdgXG4gICAgICAgICk7XG4gICAgICAgIHNlbGYuc2VuZChwYXlsb2FkKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSxcblxuICBfZWFjaFN1YjogZnVuY3Rpb24gKGYpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgc2VsZi5fbmFtZWRTdWJzLmZvckVhY2goZik7XG4gICAgc2VsZi5fdW5pdmVyc2FsU3Vicy5mb3JFYWNoKGYpO1xuICB9LFxuXG4gIF9kaWZmQ29sbGVjdGlvblZpZXdzOiBmdW5jdGlvbiAoYmVmb3JlQ1ZzKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIERpZmZTZXF1ZW5jZS5kaWZmTWFwcyhiZWZvcmVDVnMsIHNlbGYuY29sbGVjdGlvblZpZXdzLCB7XG4gICAgICBib3RoOiBmdW5jdGlvbiAoY29sbGVjdGlvbk5hbWUsIGxlZnRWYWx1ZSwgcmlnaHRWYWx1ZSkge1xuICAgICAgICByaWdodFZhbHVlLmRpZmYobGVmdFZhbHVlKTtcbiAgICAgIH0sXG4gICAgICByaWdodE9ubHk6IGZ1bmN0aW9uIChjb2xsZWN0aW9uTmFtZSwgcmlnaHRWYWx1ZSkge1xuICAgICAgICByaWdodFZhbHVlLmRvY3VtZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChkb2NWaWV3LCBpZCkge1xuICAgICAgICAgIHNlbGYuc2VuZEFkZGVkKGNvbGxlY3Rpb25OYW1lLCBpZCwgZG9jVmlldy5nZXRGaWVsZHMoKSk7XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIGxlZnRPbmx5OiBmdW5jdGlvbiAoY29sbGVjdGlvbk5hbWUsIGxlZnRWYWx1ZSkge1xuICAgICAgICBsZWZ0VmFsdWUuZG9jdW1lbnRzLmZvckVhY2goZnVuY3Rpb24gKGRvYywgaWQpIHtcbiAgICAgICAgICBzZWxmLnNlbmRSZW1vdmVkKGNvbGxlY3Rpb25OYW1lLCBpZCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuXG4gIC8vIFNldHMgdGhlIGN1cnJlbnQgdXNlciBpZCBpbiBhbGwgYXBwcm9wcmlhdGUgY29udGV4dHMgYW5kIHJlcnVuc1xuICAvLyBhbGwgc3Vic2NyaXB0aW9uc1xuICBfc2V0VXNlcklkOiBmdW5jdGlvbih1c2VySWQpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICBpZiAodXNlcklkICE9PSBudWxsICYmIHR5cGVvZiB1c2VySWQgIT09IFwic3RyaW5nXCIpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJzZXRVc2VySWQgbXVzdCBiZSBjYWxsZWQgb24gc3RyaW5nIG9yIG51bGwsIG5vdCBcIiArXG4gICAgICAgICAgICAgICAgICAgICAgdHlwZW9mIHVzZXJJZCk7XG5cbiAgICAvLyBQcmV2ZW50IG5ld2x5LWNyZWF0ZWQgdW5pdmVyc2FsIHN1YnNjcmlwdGlvbnMgZnJvbSBiZWluZyBhZGRlZCB0byBvdXJcbiAgICAvLyBzZXNzaW9uOyB0aGV5IHdpbGwgYmUgZm91bmQgYmVsb3cgd2hlbiB3ZSBjYWxsIHN0YXJ0VW5pdmVyc2FsU3Vicy5cbiAgICAvL1xuICAgIC8vIChXZSBkb24ndCBoYXZlIHRvIHdvcnJ5IGFib3V0IG5hbWVkIHN1YnNjcmlwdGlvbnMsIGJlY2F1c2Ugd2Ugb25seSBhZGRcbiAgICAvLyB0aGVtIHdoZW4gd2UgcHJvY2VzcyBhICdzdWInIG1lc3NhZ2UuIFdlIGFyZSBjdXJyZW50bHkgcHJvY2Vzc2luZyBhXG4gICAgLy8gJ21ldGhvZCcgbWVzc2FnZSwgYW5kIHRoZSBtZXRob2QgZGlkIG5vdCB1bmJsb2NrLCBiZWNhdXNlIGl0IGlzIGlsbGVnYWxcbiAgICAvLyB0byBjYWxsIHNldFVzZXJJZCBhZnRlciB1bmJsb2NrLiBUaHVzIHdlIGNhbm5vdCBiZSBjb25jdXJyZW50bHkgYWRkaW5nIGFcbiAgICAvLyBuZXcgbmFtZWQgc3Vic2NyaXB0aW9uLilcbiAgICBzZWxmLl9kb250U3RhcnROZXdVbml2ZXJzYWxTdWJzID0gdHJ1ZTtcblxuICAgIC8vIFByZXZlbnQgY3VycmVudCBzdWJzIGZyb20gdXBkYXRpbmcgb3VyIGNvbGxlY3Rpb25WaWV3cyBhbmQgY2FsbCB0aGVpclxuICAgIC8vIHN0b3AgY2FsbGJhY2tzLiBUaGlzIG1heSB5aWVsZC5cbiAgICBzZWxmLl9lYWNoU3ViKGZ1bmN0aW9uIChzdWIpIHtcbiAgICAgIHN1Yi5fZGVhY3RpdmF0ZSgpO1xuICAgIH0pO1xuXG4gICAgLy8gQWxsIHN1YnMgc2hvdWxkIG5vdyBiZSBkZWFjdGl2YXRlZC4gU3RvcCBzZW5kaW5nIG1lc3NhZ2VzIHRvIHRoZSBjbGllbnQsXG4gICAgLy8gc2F2ZSB0aGUgc3RhdGUgb2YgdGhlIHB1Ymxpc2hlZCBjb2xsZWN0aW9ucywgcmVzZXQgdG8gYW4gZW1wdHkgdmlldywgYW5kXG4gICAgLy8gdXBkYXRlIHRoZSB1c2VySWQuXG4gICAgc2VsZi5faXNTZW5kaW5nID0gZmFsc2U7XG4gICAgdmFyIGJlZm9yZUNWcyA9IHNlbGYuY29sbGVjdGlvblZpZXdzO1xuICAgIHNlbGYuY29sbGVjdGlvblZpZXdzID0gbmV3IE1hcCgpO1xuICAgIHNlbGYudXNlcklkID0gdXNlcklkO1xuXG4gICAgLy8gX3NldFVzZXJJZCBpcyBub3JtYWxseSBjYWxsZWQgZnJvbSBhIE1ldGVvciBtZXRob2Qgd2l0aFxuICAgIC8vIEREUC5fQ3VycmVudE1ldGhvZEludm9jYXRpb24gc2V0LiBCdXQgRERQLl9DdXJyZW50TWV0aG9kSW52b2NhdGlvbiBpcyBub3RcbiAgICAvLyBleHBlY3RlZCB0byBiZSBzZXQgaW5zaWRlIGEgcHVibGlzaCBmdW5jdGlvbiwgc28gd2UgdGVtcG9yYXJ5IHVuc2V0IGl0LlxuICAgIC8vIEluc2lkZSBhIHB1Ymxpc2ggZnVuY3Rpb24gRERQLl9DdXJyZW50UHVibGljYXRpb25JbnZvY2F0aW9uIGlzIHNldC5cbiAgICBERFAuX0N1cnJlbnRNZXRob2RJbnZvY2F0aW9uLndpdGhWYWx1ZSh1bmRlZmluZWQsIGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIFNhdmUgdGhlIG9sZCBuYW1lZCBzdWJzLCBhbmQgcmVzZXQgdG8gaGF2aW5nIG5vIHN1YnNjcmlwdGlvbnMuXG4gICAgICB2YXIgb2xkTmFtZWRTdWJzID0gc2VsZi5fbmFtZWRTdWJzO1xuICAgICAgc2VsZi5fbmFtZWRTdWJzID0gbmV3IE1hcCgpO1xuICAgICAgc2VsZi5fdW5pdmVyc2FsU3VicyA9IFtdO1xuXG4gICAgICBvbGROYW1lZFN1YnMuZm9yRWFjaChmdW5jdGlvbiAoc3ViLCBzdWJzY3JpcHRpb25JZCkge1xuICAgICAgICB2YXIgbmV3U3ViID0gc3ViLl9yZWNyZWF0ZSgpO1xuICAgICAgICBzZWxmLl9uYW1lZFN1YnMuc2V0KHN1YnNjcmlwdGlvbklkLCBuZXdTdWIpO1xuICAgICAgICAvLyBuYjogaWYgdGhlIGhhbmRsZXIgdGhyb3dzIG9yIGNhbGxzIHRoaXMuZXJyb3IoKSwgaXQgd2lsbCBpbiBmYWN0XG4gICAgICAgIC8vIGltbWVkaWF0ZWx5IHNlbmQgaXRzICdub3N1YicuIFRoaXMgaXMgT0ssIHRob3VnaC5cbiAgICAgICAgbmV3U3ViLl9ydW5IYW5kbGVyKCk7XG4gICAgICB9KTtcblxuICAgICAgLy8gQWxsb3cgbmV3bHktY3JlYXRlZCB1bml2ZXJzYWwgc3VicyB0byBiZSBzdGFydGVkIG9uIG91ciBjb25uZWN0aW9uIGluXG4gICAgICAvLyBwYXJhbGxlbCB3aXRoIHRoZSBvbmVzIHdlJ3JlIHNwaW5uaW5nIHVwIGhlcmUsIGFuZCBzcGluIHVwIHVuaXZlcnNhbFxuICAgICAgLy8gc3Vicy5cbiAgICAgIHNlbGYuX2RvbnRTdGFydE5ld1VuaXZlcnNhbFN1YnMgPSBmYWxzZTtcbiAgICAgIHNlbGYuc3RhcnRVbml2ZXJzYWxTdWJzKCk7XG4gICAgfSk7XG5cbiAgICAvLyBTdGFydCBzZW5kaW5nIG1lc3NhZ2VzIGFnYWluLCBiZWdpbm5pbmcgd2l0aCB0aGUgZGlmZiBmcm9tIHRoZSBwcmV2aW91c1xuICAgIC8vIHN0YXRlIG9mIHRoZSB3b3JsZCB0byB0aGUgY3VycmVudCBzdGF0ZS4gTm8geWllbGRzIGFyZSBhbGxvd2VkIGR1cmluZ1xuICAgIC8vIHRoaXMgZGlmZiwgc28gdGhhdCBvdGhlciBjaGFuZ2VzIGNhbm5vdCBpbnRlcmxlYXZlLlxuICAgIE1ldGVvci5fbm9ZaWVsZHNBbGxvd2VkKGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYuX2lzU2VuZGluZyA9IHRydWU7XG4gICAgICBzZWxmLl9kaWZmQ29sbGVjdGlvblZpZXdzKGJlZm9yZUNWcyk7XG4gICAgICBpZiAoIV8uaXNFbXB0eShzZWxmLl9wZW5kaW5nUmVhZHkpKSB7XG4gICAgICAgIHNlbGYuc2VuZFJlYWR5KHNlbGYuX3BlbmRpbmdSZWFkeSk7XG4gICAgICAgIHNlbGYuX3BlbmRpbmdSZWFkeSA9IFtdO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuXG4gIF9zdGFydFN1YnNjcmlwdGlvbjogZnVuY3Rpb24gKGhhbmRsZXIsIHN1YklkLCBwYXJhbXMsIG5hbWUpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICB2YXIgc3ViID0gbmV3IFN1YnNjcmlwdGlvbihcbiAgICAgIHNlbGYsIGhhbmRsZXIsIHN1YklkLCBwYXJhbXMsIG5hbWUpO1xuICAgIGlmIChzdWJJZClcbiAgICAgIHNlbGYuX25hbWVkU3Vicy5zZXQoc3ViSWQsIHN1Yik7XG4gICAgZWxzZVxuICAgICAgc2VsZi5fdW5pdmVyc2FsU3Vicy5wdXNoKHN1Yik7XG5cbiAgICBzdWIuX3J1bkhhbmRsZXIoKTtcbiAgfSxcblxuICAvLyB0ZWFyIGRvd24gc3BlY2lmaWVkIHN1YnNjcmlwdGlvblxuICBfc3RvcFN1YnNjcmlwdGlvbjogZnVuY3Rpb24gKHN1YklkLCBlcnJvcikge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHZhciBzdWJOYW1lID0gbnVsbDtcbiAgICBpZiAoc3ViSWQpIHtcbiAgICAgIHZhciBtYXliZVN1YiA9IHNlbGYuX25hbWVkU3Vicy5nZXQoc3ViSWQpO1xuICAgICAgaWYgKG1heWJlU3ViKSB7XG4gICAgICAgIHN1Yk5hbWUgPSBtYXliZVN1Yi5fbmFtZTtcbiAgICAgICAgbWF5YmVTdWIuX3JlbW92ZUFsbERvY3VtZW50cygpO1xuICAgICAgICBtYXliZVN1Yi5fZGVhY3RpdmF0ZSgpO1xuICAgICAgICBzZWxmLl9uYW1lZFN1YnMuZGVsZXRlKHN1YklkKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgcmVzcG9uc2UgPSB7bXNnOiAnbm9zdWInLCBpZDogc3ViSWR9O1xuXG4gICAgaWYgKGVycm9yKSB7XG4gICAgICByZXNwb25zZS5lcnJvciA9IHdyYXBJbnRlcm5hbEV4Y2VwdGlvbihcbiAgICAgICAgZXJyb3IsXG4gICAgICAgIHN1Yk5hbWUgPyAoXCJmcm9tIHN1YiBcIiArIHN1Yk5hbWUgKyBcIiBpZCBcIiArIHN1YklkKVxuICAgICAgICAgIDogKFwiZnJvbSBzdWIgaWQgXCIgKyBzdWJJZCkpO1xuICAgIH1cblxuICAgIHNlbGYuc2VuZChyZXNwb25zZSk7XG4gIH0sXG5cbiAgLy8gdGVhciBkb3duIGFsbCBzdWJzY3JpcHRpb25zLiBOb3RlIHRoYXQgdGhpcyBkb2VzIE5PVCBzZW5kIHJlbW92ZWQgb3Igbm9zdWJcbiAgLy8gbWVzc2FnZXMsIHNpbmNlIHdlIGFzc3VtZSB0aGUgY2xpZW50IGlzIGdvbmUuXG4gIF9kZWFjdGl2YXRlQWxsU3Vic2NyaXB0aW9uczogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHNlbGYuX25hbWVkU3Vicy5mb3JFYWNoKGZ1bmN0aW9uIChzdWIsIGlkKSB7XG4gICAgICBzdWIuX2RlYWN0aXZhdGUoKTtcbiAgICB9KTtcbiAgICBzZWxmLl9uYW1lZFN1YnMgPSBuZXcgTWFwKCk7XG5cbiAgICBzZWxmLl91bml2ZXJzYWxTdWJzLmZvckVhY2goZnVuY3Rpb24gKHN1Yikge1xuICAgICAgc3ViLl9kZWFjdGl2YXRlKCk7XG4gICAgfSk7XG4gICAgc2VsZi5fdW5pdmVyc2FsU3VicyA9IFtdO1xuICB9LFxuXG4gIC8vIERldGVybWluZSB0aGUgcmVtb3RlIGNsaWVudCdzIElQIGFkZHJlc3MsIGJhc2VkIG9uIHRoZVxuICAvLyBIVFRQX0ZPUldBUkRFRF9DT1VOVCBlbnZpcm9ubWVudCB2YXJpYWJsZSByZXByZXNlbnRpbmcgaG93IG1hbnlcbiAgLy8gcHJveGllcyB0aGUgc2VydmVyIGlzIGJlaGluZC5cbiAgX2NsaWVudEFkZHJlc3M6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAvLyBGb3IgdGhlIHJlcG9ydGVkIGNsaWVudCBhZGRyZXNzIGZvciBhIGNvbm5lY3Rpb24gdG8gYmUgY29ycmVjdCxcbiAgICAvLyB0aGUgZGV2ZWxvcGVyIG11c3Qgc2V0IHRoZSBIVFRQX0ZPUldBUkRFRF9DT1VOVCBlbnZpcm9ubWVudFxuICAgIC8vIHZhcmlhYmxlIHRvIGFuIGludGVnZXIgcmVwcmVzZW50aW5nIHRoZSBudW1iZXIgb2YgaG9wcyB0aGV5XG4gICAgLy8gZXhwZWN0IGluIHRoZSBgeC1mb3J3YXJkZWQtZm9yYCBoZWFkZXIuIEUuZy4sIHNldCB0byBcIjFcIiBpZiB0aGVcbiAgICAvLyBzZXJ2ZXIgaXMgYmVoaW5kIG9uZSBwcm94eS5cbiAgICAvL1xuICAgIC8vIFRoaXMgY291bGQgYmUgY29tcHV0ZWQgb25jZSBhdCBzdGFydHVwIGluc3RlYWQgb2YgZXZlcnkgdGltZS5cbiAgICB2YXIgaHR0cEZvcndhcmRlZENvdW50ID0gcGFyc2VJbnQocHJvY2Vzcy5lbnZbJ0hUVFBfRk9SV0FSREVEX0NPVU5UJ10pIHx8IDA7XG5cbiAgICBpZiAoaHR0cEZvcndhcmRlZENvdW50ID09PSAwKVxuICAgICAgcmV0dXJuIHNlbGYuc29ja2V0LnJlbW90ZUFkZHJlc3M7XG5cbiAgICB2YXIgZm9yd2FyZGVkRm9yID0gc2VsZi5zb2NrZXQuaGVhZGVyc1tcIngtZm9yd2FyZGVkLWZvclwiXTtcbiAgICBpZiAoISBfLmlzU3RyaW5nKGZvcndhcmRlZEZvcikpXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICBmb3J3YXJkZWRGb3IgPSBmb3J3YXJkZWRGb3IudHJpbSgpLnNwbGl0KC9cXHMqLFxccyovKTtcblxuICAgIC8vIFR5cGljYWxseSB0aGUgZmlyc3QgdmFsdWUgaW4gdGhlIGB4LWZvcndhcmRlZC1mb3JgIGhlYWRlciBpc1xuICAgIC8vIHRoZSBvcmlnaW5hbCBJUCBhZGRyZXNzIG9mIHRoZSBjbGllbnQgY29ubmVjdGluZyB0byB0aGUgZmlyc3RcbiAgICAvLyBwcm94eS4gIEhvd2V2ZXIsIHRoZSBlbmQgdXNlciBjYW4gZWFzaWx5IHNwb29mIHRoZSBoZWFkZXIsIGluXG4gICAgLy8gd2hpY2ggY2FzZSB0aGUgZmlyc3QgdmFsdWUocykgd2lsbCBiZSB0aGUgZmFrZSBJUCBhZGRyZXNzIGZyb21cbiAgICAvLyB0aGUgdXNlciBwcmV0ZW5kaW5nIHRvIGJlIGEgcHJveHkgcmVwb3J0aW5nIHRoZSBvcmlnaW5hbCBJUFxuICAgIC8vIGFkZHJlc3MgdmFsdWUuICBCeSBjb3VudGluZyBIVFRQX0ZPUldBUkRFRF9DT1VOVCBiYWNrIGZyb20gdGhlXG4gICAgLy8gZW5kIG9mIHRoZSBsaXN0LCB3ZSBlbnN1cmUgdGhhdCB3ZSBnZXQgdGhlIElQIGFkZHJlc3MgYmVpbmdcbiAgICAvLyByZXBvcnRlZCBieSAqb3VyKiBmaXJzdCBwcm94eS5cblxuICAgIGlmIChodHRwRm9yd2FyZGVkQ291bnQgPCAwIHx8IGh0dHBGb3J3YXJkZWRDb3VudCA+IGZvcndhcmRlZEZvci5sZW5ndGgpXG4gICAgICByZXR1cm4gbnVsbDtcblxuICAgIHJldHVybiBmb3J3YXJkZWRGb3JbZm9yd2FyZGVkRm9yLmxlbmd0aCAtIGh0dHBGb3J3YXJkZWRDb3VudF07XG4gIH1cbn0pO1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyogU3Vic2NyaXB0aW9uICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKi9cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbi8vIGN0b3IgZm9yIGEgc3ViIGhhbmRsZTogdGhlIGlucHV0IHRvIGVhY2ggcHVibGlzaCBmdW5jdGlvblxuXG4vLyBJbnN0YW5jZSBuYW1lIGlzIHRoaXMgYmVjYXVzZSBpdCdzIHVzdWFsbHkgcmVmZXJyZWQgdG8gYXMgdGhpcyBpbnNpZGUgYVxuLy8gcHVibGlzaFxuLyoqXG4gKiBAc3VtbWFyeSBUaGUgc2VydmVyJ3Mgc2lkZSBvZiBhIHN1YnNjcmlwdGlvblxuICogQGNsYXNzIFN1YnNjcmlwdGlvblxuICogQGluc3RhbmNlTmFtZSB0aGlzXG4gKiBAc2hvd0luc3RhbmNlTmFtZSB0cnVlXG4gKi9cbnZhciBTdWJzY3JpcHRpb24gPSBmdW5jdGlvbiAoXG4gICAgc2Vzc2lvbiwgaGFuZGxlciwgc3Vic2NyaXB0aW9uSWQsIHBhcmFtcywgbmFtZSkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHNlbGYuX3Nlc3Npb24gPSBzZXNzaW9uOyAvLyB0eXBlIGlzIFNlc3Npb25cblxuICAvKipcbiAgICogQHN1bW1hcnkgQWNjZXNzIGluc2lkZSB0aGUgcHVibGlzaCBmdW5jdGlvbi4gVGhlIGluY29taW5nIFtjb25uZWN0aW9uXSgjbWV0ZW9yX29uY29ubmVjdGlvbikgZm9yIHRoaXMgc3Vic2NyaXB0aW9uLlxuICAgKiBAbG9jdXMgU2VydmVyXG4gICAqIEBuYW1lICBjb25uZWN0aW9uXG4gICAqIEBtZW1iZXJPZiBTdWJzY3JpcHRpb25cbiAgICogQGluc3RhbmNlXG4gICAqL1xuICBzZWxmLmNvbm5lY3Rpb24gPSBzZXNzaW9uLmNvbm5lY3Rpb25IYW5kbGU7IC8vIHB1YmxpYyBBUEkgb2JqZWN0XG5cbiAgc2VsZi5faGFuZGxlciA9IGhhbmRsZXI7XG5cbiAgLy8gbXkgc3Vic2NyaXB0aW9uIElEIChnZW5lcmF0ZWQgYnkgY2xpZW50LCB1bmRlZmluZWQgZm9yIHVuaXZlcnNhbCBzdWJzKS5cbiAgc2VsZi5fc3Vic2NyaXB0aW9uSWQgPSBzdWJzY3JpcHRpb25JZDtcbiAgLy8gdW5kZWZpbmVkIGZvciB1bml2ZXJzYWwgc3Vic1xuICBzZWxmLl9uYW1lID0gbmFtZTtcblxuICBzZWxmLl9wYXJhbXMgPSBwYXJhbXMgfHwgW107XG5cbiAgLy8gT25seSBuYW1lZCBzdWJzY3JpcHRpb25zIGhhdmUgSURzLCBidXQgd2UgbmVlZCBzb21lIHNvcnQgb2Ygc3RyaW5nXG4gIC8vIGludGVybmFsbHkgdG8ga2VlcCB0cmFjayBvZiBhbGwgc3Vic2NyaXB0aW9ucyBpbnNpZGVcbiAgLy8gU2Vzc2lvbkRvY3VtZW50Vmlld3MuIFdlIHVzZSB0aGlzIHN1YnNjcmlwdGlvbkhhbmRsZSBmb3IgdGhhdC5cbiAgaWYgKHNlbGYuX3N1YnNjcmlwdGlvbklkKSB7XG4gICAgc2VsZi5fc3Vic2NyaXB0aW9uSGFuZGxlID0gJ04nICsgc2VsZi5fc3Vic2NyaXB0aW9uSWQ7XG4gIH0gZWxzZSB7XG4gICAgc2VsZi5fc3Vic2NyaXB0aW9uSGFuZGxlID0gJ1UnICsgUmFuZG9tLmlkKCk7XG4gIH1cblxuICAvLyBoYXMgX2RlYWN0aXZhdGUgYmVlbiBjYWxsZWQ/XG4gIHNlbGYuX2RlYWN0aXZhdGVkID0gZmFsc2U7XG5cbiAgLy8gc3RvcCBjYWxsYmFja3MgdG8gZy9jIHRoaXMgc3ViLiAgY2FsbGVkIHcvIHplcm8gYXJndW1lbnRzLlxuICBzZWxmLl9zdG9wQ2FsbGJhY2tzID0gW107XG5cbiAgLy8gdGhlIHNldCBvZiAoY29sbGVjdGlvbiwgZG9jdW1lbnRpZCkgdGhhdCB0aGlzIHN1YnNjcmlwdGlvbiBoYXNcbiAgLy8gYW4gb3BpbmlvbiBhYm91dFxuICBzZWxmLl9kb2N1bWVudHMgPSBuZXcgTWFwKCk7XG5cbiAgLy8gcmVtZW1iZXIgaWYgd2UgYXJlIHJlYWR5LlxuICBzZWxmLl9yZWFkeSA9IGZhbHNlO1xuXG4gIC8vIFBhcnQgb2YgdGhlIHB1YmxpYyBBUEk6IHRoZSB1c2VyIG9mIHRoaXMgc3ViLlxuXG4gIC8qKlxuICAgKiBAc3VtbWFyeSBBY2Nlc3MgaW5zaWRlIHRoZSBwdWJsaXNoIGZ1bmN0aW9uLiBUaGUgaWQgb2YgdGhlIGxvZ2dlZC1pbiB1c2VyLCBvciBgbnVsbGAgaWYgbm8gdXNlciBpcyBsb2dnZWQgaW4uXG4gICAqIEBsb2N1cyBTZXJ2ZXJcbiAgICogQG1lbWJlck9mIFN1YnNjcmlwdGlvblxuICAgKiBAbmFtZSAgdXNlcklkXG4gICAqIEBpbnN0YW5jZVxuICAgKi9cbiAgc2VsZi51c2VySWQgPSBzZXNzaW9uLnVzZXJJZDtcblxuICAvLyBGb3Igbm93LCB0aGUgaWQgZmlsdGVyIGlzIGdvaW5nIHRvIGRlZmF1bHQgdG9cbiAgLy8gdGhlIHRvL2Zyb20gRERQIG1ldGhvZHMgb24gTW9uZ29JRCwgdG9cbiAgLy8gc3BlY2lmaWNhbGx5IGRlYWwgd2l0aCBtb25nby9taW5pbW9uZ28gT2JqZWN0SWRzLlxuXG4gIC8vIExhdGVyLCB5b3Ugd2lsbCBiZSBhYmxlIHRvIG1ha2UgdGhpcyBiZSBcInJhd1wiXG4gIC8vIGlmIHlvdSB3YW50IHRvIHB1Ymxpc2ggYSBjb2xsZWN0aW9uIHRoYXQgeW91IGtub3dcbiAgLy8ganVzdCBoYXMgc3RyaW5ncyBmb3Iga2V5cyBhbmQgbm8gZnVubnkgYnVzaW5lc3MsIHRvXG4gIC8vIGEgZGRwIGNvbnN1bWVyIHRoYXQgaXNuJ3QgbWluaW1vbmdvXG5cbiAgc2VsZi5faWRGaWx0ZXIgPSB7XG4gICAgaWRTdHJpbmdpZnk6IE1vbmdvSUQuaWRTdHJpbmdpZnksXG4gICAgaWRQYXJzZTogTW9uZ29JRC5pZFBhcnNlXG4gIH07XG5cbiAgUGFja2FnZVsnZmFjdHMtYmFzZSddICYmIFBhY2thZ2VbJ2ZhY3RzLWJhc2UnXS5GYWN0cy5pbmNyZW1lbnRTZXJ2ZXJGYWN0KFxuICAgIFwibGl2ZWRhdGFcIiwgXCJzdWJzY3JpcHRpb25zXCIsIDEpO1xufTtcblxuXy5leHRlbmQoU3Vic2NyaXB0aW9uLnByb3RvdHlwZSwge1xuICBfcnVuSGFuZGxlcjogZnVuY3Rpb24gKCkge1xuICAgIC8vIFhYWCBzaG91bGQgd2UgdW5ibG9jaygpIGhlcmU/IEVpdGhlciBiZWZvcmUgcnVubmluZyB0aGUgcHVibGlzaFxuICAgIC8vIGZ1bmN0aW9uLCBvciBiZWZvcmUgcnVubmluZyBfcHVibGlzaEN1cnNvci5cbiAgICAvL1xuICAgIC8vIFJpZ2h0IG5vdywgZWFjaCBwdWJsaXNoIGZ1bmN0aW9uIGJsb2NrcyBhbGwgZnV0dXJlIHB1Ymxpc2hlcyBhbmRcbiAgICAvLyBtZXRob2RzIHdhaXRpbmcgb24gZGF0YSBmcm9tIE1vbmdvIChvciB3aGF0ZXZlciBlbHNlIHRoZSBmdW5jdGlvblxuICAgIC8vIGJsb2NrcyBvbikuIFRoaXMgcHJvYmFibHkgc2xvd3MgcGFnZSBsb2FkIGluIGNvbW1vbiBjYXNlcy5cblxuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB0cnkge1xuICAgICAgdmFyIHJlcyA9IEREUC5fQ3VycmVudFB1YmxpY2F0aW9uSW52b2NhdGlvbi53aXRoVmFsdWUoXG4gICAgICAgIHNlbGYsXG4gICAgICAgICgpID0+IG1heWJlQXVkaXRBcmd1bWVudENoZWNrcyhcbiAgICAgICAgICBzZWxmLl9oYW5kbGVyLCBzZWxmLCBFSlNPTi5jbG9uZShzZWxmLl9wYXJhbXMpLFxuICAgICAgICAgIC8vIEl0J3MgT0sgdGhhdCB0aGlzIHdvdWxkIGxvb2sgd2VpcmQgZm9yIHVuaXZlcnNhbCBzdWJzY3JpcHRpb25zLFxuICAgICAgICAgIC8vIGJlY2F1c2UgdGhleSBoYXZlIG5vIGFyZ3VtZW50cyBzbyB0aGVyZSBjYW4gbmV2ZXIgYmUgYW5cbiAgICAgICAgICAvLyBhdWRpdC1hcmd1bWVudC1jaGVja3MgZmFpbHVyZS5cbiAgICAgICAgICBcInB1Ymxpc2hlciAnXCIgKyBzZWxmLl9uYW1lICsgXCInXCJcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBzZWxmLmVycm9yKGUpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIERpZCB0aGUgaGFuZGxlciBjYWxsIHRoaXMuZXJyb3Igb3IgdGhpcy5zdG9wP1xuICAgIGlmIChzZWxmLl9pc0RlYWN0aXZhdGVkKCkpXG4gICAgICByZXR1cm47XG5cbiAgICBzZWxmLl9wdWJsaXNoSGFuZGxlclJlc3VsdChyZXMpO1xuICB9LFxuXG4gIF9wdWJsaXNoSGFuZGxlclJlc3VsdDogZnVuY3Rpb24gKHJlcykge1xuICAgIC8vIFNQRUNJQUwgQ0FTRTogSW5zdGVhZCBvZiB3cml0aW5nIHRoZWlyIG93biBjYWxsYmFja3MgdGhhdCBpbnZva2VcbiAgICAvLyB0aGlzLmFkZGVkL2NoYW5nZWQvcmVhZHkvZXRjLCB0aGUgdXNlciBjYW4ganVzdCByZXR1cm4gYSBjb2xsZWN0aW9uXG4gICAgLy8gY3Vyc29yIG9yIGFycmF5IG9mIGN1cnNvcnMgZnJvbSB0aGUgcHVibGlzaCBmdW5jdGlvbjsgd2UgY2FsbCB0aGVpclxuICAgIC8vIF9wdWJsaXNoQ3Vyc29yIG1ldGhvZCB3aGljaCBzdGFydHMgb2JzZXJ2aW5nIHRoZSBjdXJzb3IgYW5kIHB1Ymxpc2hlcyB0aGVcbiAgICAvLyByZXN1bHRzLiBOb3RlIHRoYXQgX3B1Ymxpc2hDdXJzb3IgZG9lcyBOT1QgY2FsbCByZWFkeSgpLlxuICAgIC8vXG4gICAgLy8gWFhYIFRoaXMgdXNlcyBhbiB1bmRvY3VtZW50ZWQgaW50ZXJmYWNlIHdoaWNoIG9ubHkgdGhlIE1vbmdvIGN1cnNvclxuICAgIC8vIGludGVyZmFjZSBwdWJsaXNoZXMuIFNob3VsZCB3ZSBtYWtlIHRoaXMgaW50ZXJmYWNlIHB1YmxpYyBhbmQgZW5jb3VyYWdlXG4gICAgLy8gdXNlcnMgdG8gaW1wbGVtZW50IGl0IHRoZW1zZWx2ZXM/IEFyZ3VhYmx5LCBpdCdzIHVubmVjZXNzYXJ5OyB1c2VycyBjYW5cbiAgICAvLyBhbHJlYWR5IHdyaXRlIHRoZWlyIG93biBmdW5jdGlvbnMgbGlrZVxuICAgIC8vICAgdmFyIHB1Ymxpc2hNeVJlYWN0aXZlVGhpbmd5ID0gZnVuY3Rpb24gKG5hbWUsIGhhbmRsZXIpIHtcbiAgICAvLyAgICAgTWV0ZW9yLnB1Ymxpc2gobmFtZSwgZnVuY3Rpb24gKCkge1xuICAgIC8vICAgICAgIHZhciByZWFjdGl2ZVRoaW5neSA9IGhhbmRsZXIoKTtcbiAgICAvLyAgICAgICByZWFjdGl2ZVRoaW5neS5wdWJsaXNoTWUoKTtcbiAgICAvLyAgICAgfSk7XG4gICAgLy8gICB9O1xuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBpc0N1cnNvciA9IGZ1bmN0aW9uIChjKSB7XG4gICAgICByZXR1cm4gYyAmJiBjLl9wdWJsaXNoQ3Vyc29yO1xuICAgIH07XG4gICAgaWYgKGlzQ3Vyc29yKHJlcykpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJlcy5fcHVibGlzaEN1cnNvcihzZWxmKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgc2VsZi5lcnJvcihlKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgLy8gX3B1Ymxpc2hDdXJzb3Igb25seSByZXR1cm5zIGFmdGVyIHRoZSBpbml0aWFsIGFkZGVkIGNhbGxiYWNrcyBoYXZlIHJ1bi5cbiAgICAgIC8vIG1hcmsgc3Vic2NyaXB0aW9uIGFzIHJlYWR5LlxuICAgICAgc2VsZi5yZWFkeSgpO1xuICAgIH0gZWxzZSBpZiAoXy5pc0FycmF5KHJlcykpIHtcbiAgICAgIC8vIGNoZWNrIGFsbCB0aGUgZWxlbWVudHMgYXJlIGN1cnNvcnNcbiAgICAgIGlmICghIF8uYWxsKHJlcywgaXNDdXJzb3IpKSB7XG4gICAgICAgIHNlbGYuZXJyb3IobmV3IEVycm9yKFwiUHVibGlzaCBmdW5jdGlvbiByZXR1cm5lZCBhbiBhcnJheSBvZiBub24tQ3Vyc29yc1wiKSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIC8vIGZpbmQgZHVwbGljYXRlIGNvbGxlY3Rpb24gbmFtZXNcbiAgICAgIC8vIFhYWCB3ZSBzaG91bGQgc3VwcG9ydCBvdmVybGFwcGluZyBjdXJzb3JzLCBidXQgdGhhdCB3b3VsZCByZXF1aXJlIHRoZVxuICAgICAgLy8gbWVyZ2UgYm94IHRvIGFsbG93IG92ZXJsYXAgd2l0aGluIGEgc3Vic2NyaXB0aW9uXG4gICAgICB2YXIgY29sbGVjdGlvbk5hbWVzID0ge307XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlcy5sZW5ndGg7ICsraSkge1xuICAgICAgICB2YXIgY29sbGVjdGlvbk5hbWUgPSByZXNbaV0uX2dldENvbGxlY3Rpb25OYW1lKCk7XG4gICAgICAgIGlmIChfLmhhcyhjb2xsZWN0aW9uTmFtZXMsIGNvbGxlY3Rpb25OYW1lKSkge1xuICAgICAgICAgIHNlbGYuZXJyb3IobmV3IEVycm9yKFxuICAgICAgICAgICAgXCJQdWJsaXNoIGZ1bmN0aW9uIHJldHVybmVkIG11bHRpcGxlIGN1cnNvcnMgZm9yIGNvbGxlY3Rpb24gXCIgK1xuICAgICAgICAgICAgICBjb2xsZWN0aW9uTmFtZSkpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb2xsZWN0aW9uTmFtZXNbY29sbGVjdGlvbk5hbWVdID0gdHJ1ZTtcbiAgICAgIH07XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIF8uZWFjaChyZXMsIGZ1bmN0aW9uIChjdXIpIHtcbiAgICAgICAgICBjdXIuX3B1Ymxpc2hDdXJzb3Ioc2VsZik7XG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBzZWxmLmVycm9yKGUpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBzZWxmLnJlYWR5KCk7XG4gICAgfSBlbHNlIGlmIChyZXMpIHtcbiAgICAgIC8vIHRydXRoeSB2YWx1ZXMgb3RoZXIgdGhhbiBjdXJzb3JzIG9yIGFycmF5cyBhcmUgcHJvYmFibHkgYVxuICAgICAgLy8gdXNlciBtaXN0YWtlIChwb3NzaWJsZSByZXR1cm5pbmcgYSBNb25nbyBkb2N1bWVudCB2aWEsIHNheSxcbiAgICAgIC8vIGBjb2xsLmZpbmRPbmUoKWApLlxuICAgICAgc2VsZi5lcnJvcihuZXcgRXJyb3IoXCJQdWJsaXNoIGZ1bmN0aW9uIGNhbiBvbmx5IHJldHVybiBhIEN1cnNvciBvciBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBcImFuIGFycmF5IG9mIEN1cnNvcnNcIikpO1xuICAgIH1cbiAgfSxcblxuICAvLyBUaGlzIGNhbGxzIGFsbCBzdG9wIGNhbGxiYWNrcyBhbmQgcHJldmVudHMgdGhlIGhhbmRsZXIgZnJvbSB1cGRhdGluZyBhbnlcbiAgLy8gU2Vzc2lvbkNvbGxlY3Rpb25WaWV3cyBmdXJ0aGVyLiBJdCdzIHVzZWQgd2hlbiB0aGUgdXNlciB1bnN1YnNjcmliZXMgb3JcbiAgLy8gZGlzY29ubmVjdHMsIGFzIHdlbGwgYXMgZHVyaW5nIHNldFVzZXJJZCByZS1ydW5zLiBJdCBkb2VzICpOT1QqIHNlbmRcbiAgLy8gcmVtb3ZlZCBtZXNzYWdlcyBmb3IgdGhlIHB1Ymxpc2hlZCBvYmplY3RzOyBpZiB0aGF0IGlzIG5lY2Vzc2FyeSwgY2FsbFxuICAvLyBfcmVtb3ZlQWxsRG9jdW1lbnRzIGZpcnN0LlxuICBfZGVhY3RpdmF0ZTogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIGlmIChzZWxmLl9kZWFjdGl2YXRlZClcbiAgICAgIHJldHVybjtcbiAgICBzZWxmLl9kZWFjdGl2YXRlZCA9IHRydWU7XG4gICAgc2VsZi5fY2FsbFN0b3BDYWxsYmFja3MoKTtcbiAgICBQYWNrYWdlWydmYWN0cy1iYXNlJ10gJiYgUGFja2FnZVsnZmFjdHMtYmFzZSddLkZhY3RzLmluY3JlbWVudFNlcnZlckZhY3QoXG4gICAgICBcImxpdmVkYXRhXCIsIFwic3Vic2NyaXB0aW9uc1wiLCAtMSk7XG4gIH0sXG5cbiAgX2NhbGxTdG9wQ2FsbGJhY2tzOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIC8vIHRlbGwgbGlzdGVuZXJzLCBzbyB0aGV5IGNhbiBjbGVhbiB1cFxuICAgIHZhciBjYWxsYmFja3MgPSBzZWxmLl9zdG9wQ2FsbGJhY2tzO1xuICAgIHNlbGYuX3N0b3BDYWxsYmFja3MgPSBbXTtcbiAgICBfLmVhY2goY2FsbGJhY2tzLCBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgIGNhbGxiYWNrKCk7XG4gICAgfSk7XG4gIH0sXG5cbiAgLy8gU2VuZCByZW1vdmUgbWVzc2FnZXMgZm9yIGV2ZXJ5IGRvY3VtZW50LlxuICBfcmVtb3ZlQWxsRG9jdW1lbnRzOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIE1ldGVvci5fbm9ZaWVsZHNBbGxvd2VkKGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYuX2RvY3VtZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChjb2xsZWN0aW9uRG9jcywgY29sbGVjdGlvbk5hbWUpIHtcbiAgICAgICAgY29sbGVjdGlvbkRvY3MuZm9yRWFjaChmdW5jdGlvbiAoc3RySWQpIHtcbiAgICAgICAgICBzZWxmLnJlbW92ZWQoY29sbGVjdGlvbk5hbWUsIHNlbGYuX2lkRmlsdGVyLmlkUGFyc2Uoc3RySWQpKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSxcblxuICAvLyBSZXR1cm5zIGEgbmV3IFN1YnNjcmlwdGlvbiBmb3IgdGhlIHNhbWUgc2Vzc2lvbiB3aXRoIHRoZSBzYW1lXG4gIC8vIGluaXRpYWwgY3JlYXRpb24gcGFyYW1ldGVycy4gVGhpcyBpc24ndCBhIGNsb25lOiBpdCBkb2Vzbid0IGhhdmVcbiAgLy8gdGhlIHNhbWUgX2RvY3VtZW50cyBjYWNoZSwgc3RvcHBlZCBzdGF0ZSBvciBjYWxsYmFja3M7IG1heSBoYXZlIGFcbiAgLy8gZGlmZmVyZW50IF9zdWJzY3JpcHRpb25IYW5kbGUsIGFuZCBnZXRzIGl0cyB1c2VySWQgZnJvbSB0aGVcbiAgLy8gc2Vzc2lvbiwgbm90IGZyb20gdGhpcyBvYmplY3QuXG4gIF9yZWNyZWF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICByZXR1cm4gbmV3IFN1YnNjcmlwdGlvbihcbiAgICAgIHNlbGYuX3Nlc3Npb24sIHNlbGYuX2hhbmRsZXIsIHNlbGYuX3N1YnNjcmlwdGlvbklkLCBzZWxmLl9wYXJhbXMsXG4gICAgICBzZWxmLl9uYW1lKTtcbiAgfSxcblxuICAvKipcbiAgICogQHN1bW1hcnkgQ2FsbCBpbnNpZGUgdGhlIHB1Ymxpc2ggZnVuY3Rpb24uICBTdG9wcyB0aGlzIGNsaWVudCdzIHN1YnNjcmlwdGlvbiwgdHJpZ2dlcmluZyBhIGNhbGwgb24gdGhlIGNsaWVudCB0byB0aGUgYG9uU3RvcGAgY2FsbGJhY2sgcGFzc2VkIHRvIFtgTWV0ZW9yLnN1YnNjcmliZWBdKCNtZXRlb3Jfc3Vic2NyaWJlKSwgaWYgYW55LiBJZiBgZXJyb3JgIGlzIG5vdCBhIFtgTWV0ZW9yLkVycm9yYF0oI21ldGVvcl9lcnJvciksIGl0IHdpbGwgYmUgW3Nhbml0aXplZF0oI21ldGVvcl9lcnJvcikuXG4gICAqIEBsb2N1cyBTZXJ2ZXJcbiAgICogQHBhcmFtIHtFcnJvcn0gZXJyb3IgVGhlIGVycm9yIHRvIHBhc3MgdG8gdGhlIGNsaWVudC5cbiAgICogQGluc3RhbmNlXG4gICAqIEBtZW1iZXJPZiBTdWJzY3JpcHRpb25cbiAgICovXG4gIGVycm9yOiBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgaWYgKHNlbGYuX2lzRGVhY3RpdmF0ZWQoKSlcbiAgICAgIHJldHVybjtcbiAgICBzZWxmLl9zZXNzaW9uLl9zdG9wU3Vic2NyaXB0aW9uKHNlbGYuX3N1YnNjcmlwdGlvbklkLCBlcnJvcik7XG4gIH0sXG5cbiAgLy8gTm90ZSB0aGF0IHdoaWxlIG91ciBERFAgY2xpZW50IHdpbGwgbm90aWNlIHRoYXQgeW91J3ZlIGNhbGxlZCBzdG9wKCkgb24gdGhlXG4gIC8vIHNlcnZlciAoYW5kIGNsZWFuIHVwIGl0cyBfc3Vic2NyaXB0aW9ucyB0YWJsZSkgd2UgZG9uJ3QgYWN0dWFsbHkgcHJvdmlkZSBhXG4gIC8vIG1lY2hhbmlzbSBmb3IgYW4gYXBwIHRvIG5vdGljZSB0aGlzICh0aGUgc3Vic2NyaWJlIG9uRXJyb3IgY2FsbGJhY2sgb25seVxuICAvLyB0cmlnZ2VycyBpZiB0aGVyZSBpcyBhbiBlcnJvcikuXG5cbiAgLyoqXG4gICAqIEBzdW1tYXJ5IENhbGwgaW5zaWRlIHRoZSBwdWJsaXNoIGZ1bmN0aW9uLiAgU3RvcHMgdGhpcyBjbGllbnQncyBzdWJzY3JpcHRpb24gYW5kIGludm9rZXMgdGhlIGNsaWVudCdzIGBvblN0b3BgIGNhbGxiYWNrIHdpdGggbm8gZXJyb3IuXG4gICAqIEBsb2N1cyBTZXJ2ZXJcbiAgICogQGluc3RhbmNlXG4gICAqIEBtZW1iZXJPZiBTdWJzY3JpcHRpb25cbiAgICovXG4gIHN0b3A6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgaWYgKHNlbGYuX2lzRGVhY3RpdmF0ZWQoKSlcbiAgICAgIHJldHVybjtcbiAgICBzZWxmLl9zZXNzaW9uLl9zdG9wU3Vic2NyaXB0aW9uKHNlbGYuX3N1YnNjcmlwdGlvbklkKTtcbiAgfSxcblxuICAvKipcbiAgICogQHN1bW1hcnkgQ2FsbCBpbnNpZGUgdGhlIHB1Ymxpc2ggZnVuY3Rpb24uICBSZWdpc3RlcnMgYSBjYWxsYmFjayBmdW5jdGlvbiB0byBydW4gd2hlbiB0aGUgc3Vic2NyaXB0aW9uIGlzIHN0b3BwZWQuXG4gICAqIEBsb2N1cyBTZXJ2ZXJcbiAgICogQG1lbWJlck9mIFN1YnNjcmlwdGlvblxuICAgKiBAaW5zdGFuY2VcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgY2FsbGJhY2sgZnVuY3Rpb25cbiAgICovXG4gIG9uU3RvcDogZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIGNhbGxiYWNrID0gTWV0ZW9yLmJpbmRFbnZpcm9ubWVudChjYWxsYmFjaywgJ29uU3RvcCBjYWxsYmFjaycsIHNlbGYpO1xuICAgIGlmIChzZWxmLl9pc0RlYWN0aXZhdGVkKCkpXG4gICAgICBjYWxsYmFjaygpO1xuICAgIGVsc2VcbiAgICAgIHNlbGYuX3N0b3BDYWxsYmFja3MucHVzaChjYWxsYmFjayk7XG4gIH0sXG5cbiAgLy8gVGhpcyByZXR1cm5zIHRydWUgaWYgdGhlIHN1YiBoYXMgYmVlbiBkZWFjdGl2YXRlZCwgKk9SKiBpZiB0aGUgc2Vzc2lvbiB3YXNcbiAgLy8gZGVzdHJveWVkIGJ1dCB0aGUgZGVmZXJyZWQgY2FsbCB0byBfZGVhY3RpdmF0ZUFsbFN1YnNjcmlwdGlvbnMgaGFzbid0XG4gIC8vIGhhcHBlbmVkIHlldC5cbiAgX2lzRGVhY3RpdmF0ZWQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgcmV0dXJuIHNlbGYuX2RlYWN0aXZhdGVkIHx8IHNlbGYuX3Nlc3Npb24uaW5RdWV1ZSA9PT0gbnVsbDtcbiAgfSxcblxuICAvKipcbiAgICogQHN1bW1hcnkgQ2FsbCBpbnNpZGUgdGhlIHB1Ymxpc2ggZnVuY3Rpb24uICBJbmZvcm1zIHRoZSBzdWJzY3JpYmVyIHRoYXQgYSBkb2N1bWVudCBoYXMgYmVlbiBhZGRlZCB0byB0aGUgcmVjb3JkIHNldC5cbiAgICogQGxvY3VzIFNlcnZlclxuICAgKiBAbWVtYmVyT2YgU3Vic2NyaXB0aW9uXG4gICAqIEBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge1N0cmluZ30gY29sbGVjdGlvbiBUaGUgbmFtZSBvZiB0aGUgY29sbGVjdGlvbiB0aGF0IGNvbnRhaW5zIHRoZSBuZXcgZG9jdW1lbnQuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpZCBUaGUgbmV3IGRvY3VtZW50J3MgSUQuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBmaWVsZHMgVGhlIGZpZWxkcyBpbiB0aGUgbmV3IGRvY3VtZW50LiAgSWYgYF9pZGAgaXMgcHJlc2VudCBpdCBpcyBpZ25vcmVkLlxuICAgKi9cbiAgYWRkZWQ6IGZ1bmN0aW9uIChjb2xsZWN0aW9uTmFtZSwgaWQsIGZpZWxkcykge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBpZiAoc2VsZi5faXNEZWFjdGl2YXRlZCgpKVxuICAgICAgcmV0dXJuO1xuICAgIGlkID0gc2VsZi5faWRGaWx0ZXIuaWRTdHJpbmdpZnkoaWQpO1xuICAgIGxldCBpZHMgPSBzZWxmLl9kb2N1bWVudHMuZ2V0KGNvbGxlY3Rpb25OYW1lKTtcbiAgICBpZiAoaWRzID09IG51bGwpIHtcbiAgICAgIGlkcyA9IG5ldyBTZXQoKTtcbiAgICAgIHNlbGYuX2RvY3VtZW50cy5zZXQoY29sbGVjdGlvbk5hbWUsIGlkcyk7XG4gICAgfVxuICAgIGlkcy5hZGQoaWQpO1xuICAgIHNlbGYuX3Nlc3Npb24uYWRkZWQoc2VsZi5fc3Vic2NyaXB0aW9uSGFuZGxlLCBjb2xsZWN0aW9uTmFtZSwgaWQsIGZpZWxkcyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEBzdW1tYXJ5IENhbGwgaW5zaWRlIHRoZSBwdWJsaXNoIGZ1bmN0aW9uLiAgSW5mb3JtcyB0aGUgc3Vic2NyaWJlciB0aGF0IGEgZG9jdW1lbnQgaW4gdGhlIHJlY29yZCBzZXQgaGFzIGJlZW4gbW9kaWZpZWQuXG4gICAqIEBsb2N1cyBTZXJ2ZXJcbiAgICogQG1lbWJlck9mIFN1YnNjcmlwdGlvblxuICAgKiBAaW5zdGFuY2VcbiAgICogQHBhcmFtIHtTdHJpbmd9IGNvbGxlY3Rpb24gVGhlIG5hbWUgb2YgdGhlIGNvbGxlY3Rpb24gdGhhdCBjb250YWlucyB0aGUgY2hhbmdlZCBkb2N1bWVudC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGlkIFRoZSBjaGFuZ2VkIGRvY3VtZW50J3MgSUQuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBmaWVsZHMgVGhlIGZpZWxkcyBpbiB0aGUgZG9jdW1lbnQgdGhhdCBoYXZlIGNoYW5nZWQsIHRvZ2V0aGVyIHdpdGggdGhlaXIgbmV3IHZhbHVlcy4gIElmIGEgZmllbGQgaXMgbm90IHByZXNlbnQgaW4gYGZpZWxkc2AgaXQgd2FzIGxlZnQgdW5jaGFuZ2VkOyBpZiBpdCBpcyBwcmVzZW50IGluIGBmaWVsZHNgIGFuZCBoYXMgYSB2YWx1ZSBvZiBgdW5kZWZpbmVkYCBpdCB3YXMgcmVtb3ZlZCBmcm9tIHRoZSBkb2N1bWVudC4gIElmIGBfaWRgIGlzIHByZXNlbnQgaXQgaXMgaWdub3JlZC5cbiAgICovXG4gIGNoYW5nZWQ6IGZ1bmN0aW9uIChjb2xsZWN0aW9uTmFtZSwgaWQsIGZpZWxkcykge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBpZiAoc2VsZi5faXNEZWFjdGl2YXRlZCgpKVxuICAgICAgcmV0dXJuO1xuICAgIGlkID0gc2VsZi5faWRGaWx0ZXIuaWRTdHJpbmdpZnkoaWQpO1xuICAgIHNlbGYuX3Nlc3Npb24uY2hhbmdlZChzZWxmLl9zdWJzY3JpcHRpb25IYW5kbGUsIGNvbGxlY3Rpb25OYW1lLCBpZCwgZmllbGRzKTtcbiAgfSxcblxuICAvKipcbiAgICogQHN1bW1hcnkgQ2FsbCBpbnNpZGUgdGhlIHB1Ymxpc2ggZnVuY3Rpb24uICBJbmZvcm1zIHRoZSBzdWJzY3JpYmVyIHRoYXQgYSBkb2N1bWVudCBoYXMgYmVlbiByZW1vdmVkIGZyb20gdGhlIHJlY29yZCBzZXQuXG4gICAqIEBsb2N1cyBTZXJ2ZXJcbiAgICogQG1lbWJlck9mIFN1YnNjcmlwdGlvblxuICAgKiBAaW5zdGFuY2VcbiAgICogQHBhcmFtIHtTdHJpbmd9IGNvbGxlY3Rpb24gVGhlIG5hbWUgb2YgdGhlIGNvbGxlY3Rpb24gdGhhdCB0aGUgZG9jdW1lbnQgaGFzIGJlZW4gcmVtb3ZlZCBmcm9tLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gaWQgVGhlIElEIG9mIHRoZSBkb2N1bWVudCB0aGF0IGhhcyBiZWVuIHJlbW92ZWQuXG4gICAqL1xuICByZW1vdmVkOiBmdW5jdGlvbiAoY29sbGVjdGlvbk5hbWUsIGlkKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIGlmIChzZWxmLl9pc0RlYWN0aXZhdGVkKCkpXG4gICAgICByZXR1cm47XG4gICAgaWQgPSBzZWxmLl9pZEZpbHRlci5pZFN0cmluZ2lmeShpZCk7XG4gICAgLy8gV2UgZG9uJ3QgYm90aGVyIHRvIGRlbGV0ZSBzZXRzIG9mIHRoaW5ncyBpbiBhIGNvbGxlY3Rpb24gaWYgdGhlXG4gICAgLy8gY29sbGVjdGlvbiBpcyBlbXB0eS4gIEl0IGNvdWxkIGJyZWFrIF9yZW1vdmVBbGxEb2N1bWVudHMuXG4gICAgc2VsZi5fZG9jdW1lbnRzLmdldChjb2xsZWN0aW9uTmFtZSkuZGVsZXRlKGlkKTtcbiAgICBzZWxmLl9zZXNzaW9uLnJlbW92ZWQoc2VsZi5fc3Vic2NyaXB0aW9uSGFuZGxlLCBjb2xsZWN0aW9uTmFtZSwgaWQpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBAc3VtbWFyeSBDYWxsIGluc2lkZSB0aGUgcHVibGlzaCBmdW5jdGlvbi4gIEluZm9ybXMgdGhlIHN1YnNjcmliZXIgdGhhdCBhbiBpbml0aWFsLCBjb21wbGV0ZSBzbmFwc2hvdCBvZiB0aGUgcmVjb3JkIHNldCBoYXMgYmVlbiBzZW50LiAgVGhpcyB3aWxsIHRyaWdnZXIgYSBjYWxsIG9uIHRoZSBjbGllbnQgdG8gdGhlIGBvblJlYWR5YCBjYWxsYmFjayBwYXNzZWQgdG8gIFtgTWV0ZW9yLnN1YnNjcmliZWBdKCNtZXRlb3Jfc3Vic2NyaWJlKSwgaWYgYW55LlxuICAgKiBAbG9jdXMgU2VydmVyXG4gICAqIEBtZW1iZXJPZiBTdWJzY3JpcHRpb25cbiAgICogQGluc3RhbmNlXG4gICAqL1xuICByZWFkeTogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBpZiAoc2VsZi5faXNEZWFjdGl2YXRlZCgpKVxuICAgICAgcmV0dXJuO1xuICAgIGlmICghc2VsZi5fc3Vic2NyaXB0aW9uSWQpXG4gICAgICByZXR1cm47ICAvLyB1bm5lY2Vzc2FyeSBidXQgaWdub3JlZCBmb3IgdW5pdmVyc2FsIHN1YlxuICAgIGlmICghc2VsZi5fcmVhZHkpIHtcbiAgICAgIHNlbGYuX3Nlc3Npb24uc2VuZFJlYWR5KFtzZWxmLl9zdWJzY3JpcHRpb25JZF0pO1xuICAgICAgc2VsZi5fcmVhZHkgPSB0cnVlO1xuICAgIH1cbiAgfVxufSk7XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKiBTZXJ2ZXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqL1xuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuU2VydmVyID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIC8vIFRoZSBkZWZhdWx0IGhlYXJ0YmVhdCBpbnRlcnZhbCBpcyAzMCBzZWNvbmRzIG9uIHRoZSBzZXJ2ZXIgYW5kIDM1XG4gIC8vIHNlY29uZHMgb24gdGhlIGNsaWVudC4gIFNpbmNlIHRoZSBjbGllbnQgZG9lc24ndCBuZWVkIHRvIHNlbmQgYVxuICAvLyBwaW5nIGFzIGxvbmcgYXMgaXQgaXMgcmVjZWl2aW5nIHBpbmdzLCB0aGlzIG1lYW5zIHRoYXQgcGluZ3NcbiAgLy8gbm9ybWFsbHkgZ28gZnJvbSB0aGUgc2VydmVyIHRvIHRoZSBjbGllbnQuXG4gIC8vXG4gIC8vIE5vdGU6IFRyb3Bvc3BoZXJlIGRlcGVuZHMgb24gdGhlIGFiaWxpdHkgdG8gbXV0YXRlXG4gIC8vIE1ldGVvci5zZXJ2ZXIub3B0aW9ucy5oZWFydGJlYXRUaW1lb3V0ISBUaGlzIGlzIGEgaGFjaywgYnV0IGl0J3MgbGlmZS5cbiAgc2VsZi5vcHRpb25zID0gXy5kZWZhdWx0cyhvcHRpb25zIHx8IHt9LCB7XG4gICAgaGVhcnRiZWF0SW50ZXJ2YWw6IDE1MDAwLFxuICAgIGhlYXJ0YmVhdFRpbWVvdXQ6IDE1MDAwLFxuICAgIC8vIEZvciB0ZXN0aW5nLCBhbGxvdyByZXNwb25kaW5nIHRvIHBpbmdzIHRvIGJlIGRpc2FibGVkLlxuICAgIHJlc3BvbmRUb1BpbmdzOiB0cnVlXG4gIH0pO1xuXG4gIC8vIE1hcCBvZiBjYWxsYmFja3MgdG8gY2FsbCB3aGVuIGEgbmV3IGNvbm5lY3Rpb24gY29tZXMgaW4gdG8gdGhlXG4gIC8vIHNlcnZlciBhbmQgY29tcGxldGVzIEREUCB2ZXJzaW9uIG5lZ290aWF0aW9uLiBVc2UgYW4gb2JqZWN0IGluc3RlYWRcbiAgLy8gb2YgYW4gYXJyYXkgc28gd2UgY2FuIHNhZmVseSByZW1vdmUgb25lIGZyb20gdGhlIGxpc3Qgd2hpbGVcbiAgLy8gaXRlcmF0aW5nIG92ZXIgaXQuXG4gIHNlbGYub25Db25uZWN0aW9uSG9vayA9IG5ldyBIb29rKHtcbiAgICBkZWJ1Z1ByaW50RXhjZXB0aW9uczogXCJvbkNvbm5lY3Rpb24gY2FsbGJhY2tcIlxuICB9KTtcblxuICAvLyBNYXAgb2YgY2FsbGJhY2tzIHRvIGNhbGwgd2hlbiBhIG5ldyBtZXNzYWdlIGNvbWVzIGluLlxuICBzZWxmLm9uTWVzc2FnZUhvb2sgPSBuZXcgSG9vayh7XG4gICAgZGVidWdQcmludEV4Y2VwdGlvbnM6IFwib25NZXNzYWdlIGNhbGxiYWNrXCJcbiAgfSk7XG5cbiAgc2VsZi5wdWJsaXNoX2hhbmRsZXJzID0ge307XG4gIHNlbGYudW5pdmVyc2FsX3B1Ymxpc2hfaGFuZGxlcnMgPSBbXTtcblxuICBzZWxmLm1ldGhvZF9oYW5kbGVycyA9IHt9O1xuXG4gIHNlbGYuc2Vzc2lvbnMgPSBuZXcgTWFwKCk7IC8vIG1hcCBmcm9tIGlkIHRvIHNlc3Npb25cblxuICBzZWxmLnN0cmVhbV9zZXJ2ZXIgPSBuZXcgU3RyZWFtU2VydmVyO1xuXG4gIHNlbGYuc3RyZWFtX3NlcnZlci5yZWdpc3RlcihmdW5jdGlvbiAoc29ja2V0KSB7XG4gICAgLy8gc29ja2V0IGltcGxlbWVudHMgdGhlIFNvY2tKU0Nvbm5lY3Rpb24gaW50ZXJmYWNlXG4gICAgc29ja2V0Ll9tZXRlb3JTZXNzaW9uID0gbnVsbDtcblxuICAgIHZhciBzZW5kRXJyb3IgPSBmdW5jdGlvbiAocmVhc29uLCBvZmZlbmRpbmdNZXNzYWdlKSB7XG4gICAgICB2YXIgbXNnID0ge21zZzogJ2Vycm9yJywgcmVhc29uOiByZWFzb259O1xuICAgICAgaWYgKG9mZmVuZGluZ01lc3NhZ2UpXG4gICAgICAgIG1zZy5vZmZlbmRpbmdNZXNzYWdlID0gb2ZmZW5kaW5nTWVzc2FnZTtcbiAgICAgIHNvY2tldC5zZW5kKEREUENvbW1vbi5zdHJpbmdpZnlERFAobXNnKSk7XG4gICAgfTtcblxuICAgIHNvY2tldC5vbignZGF0YScsIGZ1bmN0aW9uIChyYXdfbXNnKSB7XG4gICAgICBpZiAoTWV0ZW9yLl9wcmludFJlY2VpdmVkRERQKSB7XG4gICAgICAgIE1ldGVvci5fZGVidWcoXCJSZWNlaXZlZCBERFBcIiwgcmF3X21zZyk7XG4gICAgICB9XG4gICAgICB0cnkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHZhciBtc2cgPSBERFBDb21tb24ucGFyc2VERFAocmF3X21zZyk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgIHNlbmRFcnJvcignUGFyc2UgZXJyb3InKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1zZyA9PT0gbnVsbCB8fCAhbXNnLm1zZykge1xuICAgICAgICAgIHNlbmRFcnJvcignQmFkIHJlcXVlc3QnLCBtc2cpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtc2cubXNnID09PSAnY29ubmVjdCcpIHtcbiAgICAgICAgICBpZiAoc29ja2V0Ll9tZXRlb3JTZXNzaW9uKSB7XG4gICAgICAgICAgICBzZW5kRXJyb3IoXCJBbHJlYWR5IGNvbm5lY3RlZFwiLCBtc2cpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBGaWJlcihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBzZWxmLl9oYW5kbGVDb25uZWN0KHNvY2tldCwgbXNnKTtcbiAgICAgICAgICB9KS5ydW4oKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXNvY2tldC5fbWV0ZW9yU2Vzc2lvbikge1xuICAgICAgICAgIHNlbmRFcnJvcignTXVzdCBjb25uZWN0IGZpcnN0JywgbXNnKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgc29ja2V0Ll9tZXRlb3JTZXNzaW9uLnByb2Nlc3NNZXNzYWdlKG1zZyk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIFhYWCBwcmludCBzdGFjayBuaWNlbHlcbiAgICAgICAgTWV0ZW9yLl9kZWJ1ZyhcIkludGVybmFsIGV4Y2VwdGlvbiB3aGlsZSBwcm9jZXNzaW5nIG1lc3NhZ2VcIiwgbXNnLCBlKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHNvY2tldC5vbignY2xvc2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoc29ja2V0Ll9tZXRlb3JTZXNzaW9uKSB7XG4gICAgICAgIEZpYmVyKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBzb2NrZXQuX21ldGVvclNlc3Npb24uY2xvc2UoKTtcbiAgICAgICAgfSkucnVuKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufTtcblxuXy5leHRlbmQoU2VydmVyLnByb3RvdHlwZSwge1xuXG4gIC8qKlxuICAgKiBAc3VtbWFyeSBSZWdpc3RlciBhIGNhbGxiYWNrIHRvIGJlIGNhbGxlZCB3aGVuIGEgbmV3IEREUCBjb25uZWN0aW9uIGlzIG1hZGUgdG8gdGhlIHNlcnZlci5cbiAgICogQGxvY3VzIFNlcnZlclxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayBUaGUgZnVuY3Rpb24gdG8gY2FsbCB3aGVuIGEgbmV3IEREUCBjb25uZWN0aW9uIGlzIGVzdGFibGlzaGVkLlxuICAgKiBAbWVtYmVyT2YgTWV0ZW9yXG4gICAqIEBpbXBvcnRGcm9tUGFja2FnZSBtZXRlb3JcbiAgICovXG4gIG9uQ29ubmVjdGlvbjogZnVuY3Rpb24gKGZuKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHJldHVybiBzZWxmLm9uQ29ubmVjdGlvbkhvb2sucmVnaXN0ZXIoZm4pO1xuICB9LFxuXG4gIC8qKlxuICAgKiBAc3VtbWFyeSBSZWdpc3RlciBhIGNhbGxiYWNrIHRvIGJlIGNhbGxlZCB3aGVuIGEgbmV3IEREUCBtZXNzYWdlIGlzIHJlY2VpdmVkLlxuICAgKiBAbG9jdXMgU2VydmVyXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIFRoZSBmdW5jdGlvbiB0byBjYWxsIHdoZW4gYSBuZXcgRERQIG1lc3NhZ2UgaXMgcmVjZWl2ZWQuXG4gICAqIEBtZW1iZXJPZiBNZXRlb3JcbiAgICogQGltcG9ydEZyb21QYWNrYWdlIG1ldGVvclxuICAgKi9cbiAgb25NZXNzYWdlOiBmdW5jdGlvbiAoZm4pIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgcmV0dXJuIHNlbGYub25NZXNzYWdlSG9vay5yZWdpc3Rlcihmbik7XG4gIH0sXG5cbiAgX2hhbmRsZUNvbm5lY3Q6IGZ1bmN0aW9uIChzb2NrZXQsIG1zZykge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIC8vIFRoZSBjb25uZWN0IG1lc3NhZ2UgbXVzdCBzcGVjaWZ5IGEgdmVyc2lvbiBhbmQgYW4gYXJyYXkgb2Ygc3VwcG9ydGVkXG4gICAgLy8gdmVyc2lvbnMsIGFuZCBpdCBtdXN0IGNsYWltIHRvIHN1cHBvcnQgd2hhdCBpdCBpcyBwcm9wb3NpbmcuXG4gICAgaWYgKCEodHlwZW9mIChtc2cudmVyc2lvbikgPT09ICdzdHJpbmcnICYmXG4gICAgICAgICAgXy5pc0FycmF5KG1zZy5zdXBwb3J0KSAmJlxuICAgICAgICAgIF8uYWxsKG1zZy5zdXBwb3J0LCBfLmlzU3RyaW5nKSAmJlxuICAgICAgICAgIF8uY29udGFpbnMobXNnLnN1cHBvcnQsIG1zZy52ZXJzaW9uKSkpIHtcbiAgICAgIHNvY2tldC5zZW5kKEREUENvbW1vbi5zdHJpbmdpZnlERFAoe21zZzogJ2ZhaWxlZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZlcnNpb246IEREUENvbW1vbi5TVVBQT1JURURfRERQX1ZFUlNJT05TWzBdfSkpO1xuICAgICAgc29ja2V0LmNsb3NlKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gSW4gdGhlIGZ1dHVyZSwgaGFuZGxlIHNlc3Npb24gcmVzdW1wdGlvbjogc29tZXRoaW5nIGxpa2U6XG4gICAgLy8gIHNvY2tldC5fbWV0ZW9yU2Vzc2lvbiA9IHNlbGYuc2Vzc2lvbnNbbXNnLnNlc3Npb25dXG4gICAgdmFyIHZlcnNpb24gPSBjYWxjdWxhdGVWZXJzaW9uKG1zZy5zdXBwb3J0LCBERFBDb21tb24uU1VQUE9SVEVEX0REUF9WRVJTSU9OUyk7XG5cbiAgICBpZiAobXNnLnZlcnNpb24gIT09IHZlcnNpb24pIHtcbiAgICAgIC8vIFRoZSBiZXN0IHZlcnNpb24gdG8gdXNlIChhY2NvcmRpbmcgdG8gdGhlIGNsaWVudCdzIHN0YXRlZCBwcmVmZXJlbmNlcylcbiAgICAgIC8vIGlzIG5vdCB0aGUgb25lIHRoZSBjbGllbnQgaXMgdHJ5aW5nIHRvIHVzZS4gSW5mb3JtIHRoZW0gYWJvdXQgdGhlIGJlc3RcbiAgICAgIC8vIHZlcnNpb24gdG8gdXNlLlxuICAgICAgc29ja2V0LnNlbmQoRERQQ29tbW9uLnN0cmluZ2lmeUREUCh7bXNnOiAnZmFpbGVkJywgdmVyc2lvbjogdmVyc2lvbn0pKTtcbiAgICAgIHNvY2tldC5jbG9zZSgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFlheSwgdmVyc2lvbiBtYXRjaGVzISBDcmVhdGUgYSBuZXcgc2Vzc2lvbi5cbiAgICAvLyBOb3RlOiBUcm9wb3NwaGVyZSBkZXBlbmRzIG9uIHRoZSBhYmlsaXR5IHRvIG11dGF0ZVxuICAgIC8vIE1ldGVvci5zZXJ2ZXIub3B0aW9ucy5oZWFydGJlYXRUaW1lb3V0ISBUaGlzIGlzIGEgaGFjaywgYnV0IGl0J3MgbGlmZS5cbiAgICBzb2NrZXQuX21ldGVvclNlc3Npb24gPSBuZXcgU2Vzc2lvbihzZWxmLCB2ZXJzaW9uLCBzb2NrZXQsIHNlbGYub3B0aW9ucyk7XG4gICAgc2VsZi5zZXNzaW9ucy5zZXQoc29ja2V0Ll9tZXRlb3JTZXNzaW9uLmlkLCBzb2NrZXQuX21ldGVvclNlc3Npb24pO1xuICAgIHNlbGYub25Db25uZWN0aW9uSG9vay5lYWNoKGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgaWYgKHNvY2tldC5fbWV0ZW9yU2Vzc2lvbilcbiAgICAgICAgY2FsbGJhY2soc29ja2V0Ll9tZXRlb3JTZXNzaW9uLmNvbm5lY3Rpb25IYW5kbGUpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSk7XG4gIH0sXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhIHB1Ymxpc2ggaGFuZGxlciBmdW5jdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIG5hbWUge1N0cmluZ30gaWRlbnRpZmllciBmb3IgcXVlcnlcbiAgICogQHBhcmFtIGhhbmRsZXIge0Z1bmN0aW9ufSBwdWJsaXNoIGhhbmRsZXJcbiAgICogQHBhcmFtIG9wdGlvbnMge09iamVjdH1cbiAgICpcbiAgICogU2VydmVyIHdpbGwgY2FsbCBoYW5kbGVyIGZ1bmN0aW9uIG9uIGVhY2ggbmV3IHN1YnNjcmlwdGlvbixcbiAgICogZWl0aGVyIHdoZW4gcmVjZWl2aW5nIEREUCBzdWIgbWVzc2FnZSBmb3IgYSBuYW1lZCBzdWJzY3JpcHRpb24sIG9yIG9uXG4gICAqIEREUCBjb25uZWN0IGZvciBhIHVuaXZlcnNhbCBzdWJzY3JpcHRpb24uXG4gICAqXG4gICAqIElmIG5hbWUgaXMgbnVsbCwgdGhpcyB3aWxsIGJlIGEgc3Vic2NyaXB0aW9uIHRoYXQgaXNcbiAgICogYXV0b21hdGljYWxseSBlc3RhYmxpc2hlZCBhbmQgcGVybWFuZW50bHkgb24gZm9yIGFsbCBjb25uZWN0ZWRcbiAgICogY2xpZW50LCBpbnN0ZWFkIG9mIGEgc3Vic2NyaXB0aW9uIHRoYXQgY2FuIGJlIHR1cm5lZCBvbiBhbmQgb2ZmXG4gICAqIHdpdGggc3Vic2NyaWJlKCkuXG4gICAqXG4gICAqIG9wdGlvbnMgdG8gY29udGFpbjpcbiAgICogIC0gKG1vc3RseSBpbnRlcm5hbCkgaXNfYXV0bzogdHJ1ZSBpZiBnZW5lcmF0ZWQgYXV0b21hdGljYWxseVxuICAgKiAgICBmcm9tIGFuIGF1dG9wdWJsaXNoIGhvb2suIHRoaXMgaXMgZm9yIGNvc21ldGljIHB1cnBvc2VzIG9ubHlcbiAgICogICAgKGl0IGxldHMgdXMgZGV0ZXJtaW5lIHdoZXRoZXIgdG8gcHJpbnQgYSB3YXJuaW5nIHN1Z2dlc3RpbmdcbiAgICogICAgdGhhdCB5b3UgdHVybiBvZmYgYXV0b3B1Ymxpc2guKVxuICAgKi9cblxuICAvKipcbiAgICogQHN1bW1hcnkgUHVibGlzaCBhIHJlY29yZCBzZXQuXG4gICAqIEBtZW1iZXJPZiBNZXRlb3JcbiAgICogQGltcG9ydEZyb21QYWNrYWdlIG1ldGVvclxuICAgKiBAbG9jdXMgU2VydmVyXG4gICAqIEBwYXJhbSB7U3RyaW5nfE9iamVjdH0gbmFtZSBJZiBTdHJpbmcsIG5hbWUgb2YgdGhlIHJlY29yZCBzZXQuICBJZiBPYmplY3QsIHB1YmxpY2F0aW9ucyBEaWN0aW9uYXJ5IG9mIHB1Ymxpc2ggZnVuY3Rpb25zIGJ5IG5hbWUuICBJZiBgbnVsbGAsIHRoZSBzZXQgaGFzIG5vIG5hbWUsIGFuZCB0aGUgcmVjb3JkIHNldCBpcyBhdXRvbWF0aWNhbGx5IHNlbnQgdG8gYWxsIGNvbm5lY3RlZCBjbGllbnRzLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIEZ1bmN0aW9uIGNhbGxlZCBvbiB0aGUgc2VydmVyIGVhY2ggdGltZSBhIGNsaWVudCBzdWJzY3JpYmVzLiAgSW5zaWRlIHRoZSBmdW5jdGlvbiwgYHRoaXNgIGlzIHRoZSBwdWJsaXNoIGhhbmRsZXIgb2JqZWN0LCBkZXNjcmliZWQgYmVsb3cuICBJZiB0aGUgY2xpZW50IHBhc3NlZCBhcmd1bWVudHMgdG8gYHN1YnNjcmliZWAsIHRoZSBmdW5jdGlvbiBpcyBjYWxsZWQgd2l0aCB0aGUgc2FtZSBhcmd1bWVudHMuXG4gICAqL1xuICBwdWJsaXNoOiBmdW5jdGlvbiAobmFtZSwgaGFuZGxlciwgb3B0aW9ucykge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIGlmICghIF8uaXNPYmplY3QobmFtZSkpIHtcbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgICBpZiAobmFtZSAmJiBuYW1lIGluIHNlbGYucHVibGlzaF9oYW5kbGVycykge1xuICAgICAgICBNZXRlb3IuX2RlYnVnKFwiSWdub3JpbmcgZHVwbGljYXRlIHB1Ymxpc2ggbmFtZWQgJ1wiICsgbmFtZSArIFwiJ1wiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoUGFja2FnZS5hdXRvcHVibGlzaCAmJiAhb3B0aW9ucy5pc19hdXRvKSB7XG4gICAgICAgIC8vIFRoZXkgaGF2ZSBhdXRvcHVibGlzaCBvbiwgeWV0IHRoZXkncmUgdHJ5aW5nIHRvIG1hbnVhbGx5XG4gICAgICAgIC8vIHBpY2tpbmcgc3R1ZmYgdG8gcHVibGlzaC4gVGhleSBwcm9iYWJseSBzaG91bGQgdHVybiBvZmZcbiAgICAgICAgLy8gYXV0b3B1Ymxpc2guIChUaGlzIGNoZWNrIGlzbid0IHBlcmZlY3QgLS0gaWYgeW91IGNyZWF0ZSBhXG4gICAgICAgIC8vIHB1Ymxpc2ggYmVmb3JlIHlvdSB0dXJuIG9uIGF1dG9wdWJsaXNoLCBpdCB3b24ndCBjYXRjaFxuICAgICAgICAvLyBpdC4gQnV0IHRoaXMgd2lsbCBkZWZpbml0ZWx5IGhhbmRsZSB0aGUgc2ltcGxlIGNhc2Ugd2hlcmVcbiAgICAgICAgLy8geW91J3ZlIGFkZGVkIHRoZSBhdXRvcHVibGlzaCBwYWNrYWdlIHRvIHlvdXIgYXBwLCBhbmQgYXJlXG4gICAgICAgIC8vIGNhbGxpbmcgcHVibGlzaCBmcm9tIHlvdXIgYXBwIGNvZGUuKVxuICAgICAgICBpZiAoIXNlbGYud2FybmVkX2Fib3V0X2F1dG9wdWJsaXNoKSB7XG4gICAgICAgICAgc2VsZi53YXJuZWRfYWJvdXRfYXV0b3B1Ymxpc2ggPSB0cnVlO1xuICAgICAgICAgIE1ldGVvci5fZGVidWcoXG4gICAgXCIqKiBZb3UndmUgc2V0IHVwIHNvbWUgZGF0YSBzdWJzY3JpcHRpb25zIHdpdGggTWV0ZW9yLnB1Ymxpc2goKSwgYnV0XFxuXCIgK1xuICAgIFwiKiogeW91IHN0aWxsIGhhdmUgYXV0b3B1Ymxpc2ggdHVybmVkIG9uLiBCZWNhdXNlIGF1dG9wdWJsaXNoIGlzIHN0aWxsXFxuXCIgK1xuICAgIFwiKiogb24sIHlvdXIgTWV0ZW9yLnB1Ymxpc2goKSBjYWxscyB3b24ndCBoYXZlIG11Y2ggZWZmZWN0LiBBbGwgZGF0YVxcblwiICtcbiAgICBcIioqIHdpbGwgc3RpbGwgYmUgc2VudCB0byBhbGwgY2xpZW50cy5cXG5cIiArXG4gICAgXCIqKlxcblwiICtcbiAgICBcIioqIFR1cm4gb2ZmIGF1dG9wdWJsaXNoIGJ5IHJlbW92aW5nIHRoZSBhdXRvcHVibGlzaCBwYWNrYWdlOlxcblwiICtcbiAgICBcIioqXFxuXCIgK1xuICAgIFwiKiogICAkIG1ldGVvciByZW1vdmUgYXV0b3B1Ymxpc2hcXG5cIiArXG4gICAgXCIqKlxcblwiICtcbiAgICBcIioqIC4uIGFuZCBtYWtlIHN1cmUgeW91IGhhdmUgTWV0ZW9yLnB1Ymxpc2goKSBhbmQgTWV0ZW9yLnN1YnNjcmliZSgpIGNhbGxzXFxuXCIgK1xuICAgIFwiKiogZm9yIGVhY2ggY29sbGVjdGlvbiB0aGF0IHlvdSB3YW50IGNsaWVudHMgdG8gc2VlLlxcblwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAobmFtZSlcbiAgICAgICAgc2VsZi5wdWJsaXNoX2hhbmRsZXJzW25hbWVdID0gaGFuZGxlcjtcbiAgICAgIGVsc2Uge1xuICAgICAgICBzZWxmLnVuaXZlcnNhbF9wdWJsaXNoX2hhbmRsZXJzLnB1c2goaGFuZGxlcik7XG4gICAgICAgIC8vIFNwaW4gdXAgdGhlIG5ldyBwdWJsaXNoZXIgb24gYW55IGV4aXN0aW5nIHNlc3Npb24gdG9vLiBSdW4gZWFjaFxuICAgICAgICAvLyBzZXNzaW9uJ3Mgc3Vic2NyaXB0aW9uIGluIGEgbmV3IEZpYmVyLCBzbyB0aGF0IHRoZXJlJ3Mgbm8gY2hhbmdlIGZvclxuICAgICAgICAvLyBzZWxmLnNlc3Npb25zIHRvIGNoYW5nZSB3aGlsZSB3ZSdyZSBydW5uaW5nIHRoaXMgbG9vcC5cbiAgICAgICAgc2VsZi5zZXNzaW9ucy5mb3JFYWNoKGZ1bmN0aW9uIChzZXNzaW9uKSB7XG4gICAgICAgICAgaWYgKCFzZXNzaW9uLl9kb250U3RhcnROZXdVbml2ZXJzYWxTdWJzKSB7XG4gICAgICAgICAgICBGaWJlcihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgc2Vzc2lvbi5fc3RhcnRTdWJzY3JpcHRpb24oaGFuZGxlcik7XG4gICAgICAgICAgICB9KS5ydW4oKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICBlbHNle1xuICAgICAgXy5lYWNoKG5hbWUsIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgc2VsZi5wdWJsaXNoKGtleSwgdmFsdWUsIHt9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSxcblxuICBfcmVtb3ZlU2Vzc2lvbjogZnVuY3Rpb24gKHNlc3Npb24pIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgc2VsZi5zZXNzaW9ucy5kZWxldGUoc2Vzc2lvbi5pZCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEBzdW1tYXJ5IERlZmluZXMgZnVuY3Rpb25zIHRoYXQgY2FuIGJlIGludm9rZWQgb3ZlciB0aGUgbmV0d29yayBieSBjbGllbnRzLlxuICAgKiBAbG9jdXMgQW55d2hlcmVcbiAgICogQHBhcmFtIHtPYmplY3R9IG1ldGhvZHMgRGljdGlvbmFyeSB3aG9zZSBrZXlzIGFyZSBtZXRob2QgbmFtZXMgYW5kIHZhbHVlcyBhcmUgZnVuY3Rpb25zLlxuICAgKiBAbWVtYmVyT2YgTWV0ZW9yXG4gICAqIEBpbXBvcnRGcm9tUGFja2FnZSBtZXRlb3JcbiAgICovXG4gIG1ldGhvZHM6IGZ1bmN0aW9uIChtZXRob2RzKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIF8uZWFjaChtZXRob2RzLCBmdW5jdGlvbiAoZnVuYywgbmFtZSkge1xuICAgICAgaWYgKHR5cGVvZiBmdW5jICE9PSAnZnVuY3Rpb24nKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNZXRob2QgJ1wiICsgbmFtZSArIFwiJyBtdXN0IGJlIGEgZnVuY3Rpb25cIik7XG4gICAgICBpZiAoc2VsZi5tZXRob2RfaGFuZGxlcnNbbmFtZV0pXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkEgbWV0aG9kIG5hbWVkICdcIiArIG5hbWUgKyBcIicgaXMgYWxyZWFkeSBkZWZpbmVkXCIpO1xuICAgICAgc2VsZi5tZXRob2RfaGFuZGxlcnNbbmFtZV0gPSBmdW5jO1xuICAgIH0pO1xuICB9LFxuXG4gIGNhbGw6IGZ1bmN0aW9uIChuYW1lLCAuLi5hcmdzKSB7XG4gICAgaWYgKGFyZ3MubGVuZ3RoICYmIHR5cGVvZiBhcmdzW2FyZ3MubGVuZ3RoIC0gMV0gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgLy8gSWYgaXQncyBhIGZ1bmN0aW9uLCB0aGUgbGFzdCBhcmd1bWVudCBpcyB0aGUgcmVzdWx0IGNhbGxiYWNrLCBub3RcbiAgICAgIC8vIGEgcGFyYW1ldGVyIHRvIHRoZSByZW1vdGUgbWV0aG9kLlxuICAgICAgdmFyIGNhbGxiYWNrID0gYXJncy5wb3AoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5hcHBseShuYW1lLCBhcmdzLCBjYWxsYmFjayk7XG4gIH0sXG5cbiAgLy8gQSB2ZXJzaW9uIG9mIHRoZSBjYWxsIG1ldGhvZCB0aGF0IGFsd2F5cyByZXR1cm5zIGEgUHJvbWlzZS5cbiAgY2FsbEFzeW5jOiBmdW5jdGlvbiAobmFtZSwgLi4uYXJncykge1xuICAgIHJldHVybiB0aGlzLmFwcGx5QXN5bmMobmFtZSwgYXJncyk7XG4gIH0sXG5cbiAgYXBwbHk6IGZ1bmN0aW9uIChuYW1lLCBhcmdzLCBvcHRpb25zLCBjYWxsYmFjaykge1xuICAgIC8vIFdlIHdlcmUgcGFzc2VkIDMgYXJndW1lbnRzLiBUaGV5IG1heSBiZSBlaXRoZXIgKG5hbWUsIGFyZ3MsIG9wdGlvbnMpXG4gICAgLy8gb3IgKG5hbWUsIGFyZ3MsIGNhbGxiYWNrKVxuICAgIGlmICghIGNhbGxiYWNrICYmIHR5cGVvZiBvcHRpb25zID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjYWxsYmFjayA9IG9wdGlvbnM7XG4gICAgICBvcHRpb25zID0ge307XG4gICAgfSBlbHNlIHtcbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIH1cblxuICAgIGNvbnN0IHByb21pc2UgPSB0aGlzLmFwcGx5QXN5bmMobmFtZSwgYXJncywgb3B0aW9ucyk7XG5cbiAgICAvLyBSZXR1cm4gdGhlIHJlc3VsdCBpbiB3aGljaGV2ZXIgd2F5IHRoZSBjYWxsZXIgYXNrZWQgZm9yIGl0LiBOb3RlIHRoYXQgd2VcbiAgICAvLyBkbyBOT1QgYmxvY2sgb24gdGhlIHdyaXRlIGZlbmNlIGluIGFuIGFuYWxvZ291cyB3YXkgdG8gaG93IHRoZSBjbGllbnRcbiAgICAvLyBibG9ja3Mgb24gdGhlIHJlbGV2YW50IGRhdGEgYmVpbmcgdmlzaWJsZSwgc28geW91IGFyZSBOT1QgZ3VhcmFudGVlZCB0aGF0XG4gICAgLy8gY3Vyc29yIG9ic2VydmUgY2FsbGJhY2tzIGhhdmUgZmlyZWQgd2hlbiB5b3VyIGNhbGxiYWNrIGlzIGludm9rZWQuIChXZVxuICAgIC8vIGNhbiBjaGFuZ2UgdGhpcyBpZiB0aGVyZSdzIGEgcmVhbCB1c2UgY2FzZS4pXG4gICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICBwcm9taXNlLnRoZW4oXG4gICAgICAgIHJlc3VsdCA9PiBjYWxsYmFjayh1bmRlZmluZWQsIHJlc3VsdCksXG4gICAgICAgIGV4Y2VwdGlvbiA9PiBjYWxsYmFjayhleGNlcHRpb24pXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcHJvbWlzZS5hd2FpdCgpO1xuICAgIH1cbiAgfSxcblxuICAvLyBAcGFyYW0gb3B0aW9ucyB7T3B0aW9uYWwgT2JqZWN0fVxuICBhcHBseUFzeW5jOiBmdW5jdGlvbiAobmFtZSwgYXJncywgb3B0aW9ucykge1xuICAgIC8vIFJ1biB0aGUgaGFuZGxlclxuICAgIHZhciBoYW5kbGVyID0gdGhpcy5tZXRob2RfaGFuZGxlcnNbbmFtZV07XG4gICAgaWYgKCEgaGFuZGxlcikge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KFxuICAgICAgICBuZXcgTWV0ZW9yLkVycm9yKDQwNCwgYE1ldGhvZCAnJHtuYW1lfScgbm90IGZvdW5kYClcbiAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gSWYgdGhpcyBpcyBhIG1ldGhvZCBjYWxsIGZyb20gd2l0aGluIGFub3RoZXIgbWV0aG9kIG9yIHB1Ymxpc2ggZnVuY3Rpb24sXG4gICAgLy8gZ2V0IHRoZSB1c2VyIHN0YXRlIGZyb20gdGhlIG91dGVyIG1ldGhvZCBvciBwdWJsaXNoIGZ1bmN0aW9uLCBvdGhlcndpc2VcbiAgICAvLyBkb24ndCBhbGxvdyBzZXRVc2VySWQgdG8gYmUgY2FsbGVkXG4gICAgdmFyIHVzZXJJZCA9IG51bGw7XG4gICAgdmFyIHNldFVzZXJJZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2FuJ3QgY2FsbCBzZXRVc2VySWQgb24gYSBzZXJ2ZXIgaW5pdGlhdGVkIG1ldGhvZCBjYWxsXCIpO1xuICAgIH07XG4gICAgdmFyIGNvbm5lY3Rpb24gPSBudWxsO1xuICAgIHZhciBjdXJyZW50TWV0aG9kSW52b2NhdGlvbiA9IEREUC5fQ3VycmVudE1ldGhvZEludm9jYXRpb24uZ2V0KCk7XG4gICAgdmFyIGN1cnJlbnRQdWJsaWNhdGlvbkludm9jYXRpb24gPSBERFAuX0N1cnJlbnRQdWJsaWNhdGlvbkludm9jYXRpb24uZ2V0KCk7XG4gICAgdmFyIHJhbmRvbVNlZWQgPSBudWxsO1xuICAgIGlmIChjdXJyZW50TWV0aG9kSW52b2NhdGlvbikge1xuICAgICAgdXNlcklkID0gY3VycmVudE1ldGhvZEludm9jYXRpb24udXNlcklkO1xuICAgICAgc2V0VXNlcklkID0gZnVuY3Rpb24odXNlcklkKSB7XG4gICAgICAgIGN1cnJlbnRNZXRob2RJbnZvY2F0aW9uLnNldFVzZXJJZCh1c2VySWQpO1xuICAgICAgfTtcbiAgICAgIGNvbm5lY3Rpb24gPSBjdXJyZW50TWV0aG9kSW52b2NhdGlvbi5jb25uZWN0aW9uO1xuICAgICAgcmFuZG9tU2VlZCA9IEREUENvbW1vbi5tYWtlUnBjU2VlZChjdXJyZW50TWV0aG9kSW52b2NhdGlvbiwgbmFtZSk7XG4gICAgfSBlbHNlIGlmIChjdXJyZW50UHVibGljYXRpb25JbnZvY2F0aW9uKSB7XG4gICAgICB1c2VySWQgPSBjdXJyZW50UHVibGljYXRpb25JbnZvY2F0aW9uLnVzZXJJZDtcbiAgICAgIHNldFVzZXJJZCA9IGZ1bmN0aW9uKHVzZXJJZCkge1xuICAgICAgICBjdXJyZW50UHVibGljYXRpb25JbnZvY2F0aW9uLl9zZXNzaW9uLl9zZXRVc2VySWQodXNlcklkKTtcbiAgICAgIH07XG4gICAgICBjb25uZWN0aW9uID0gY3VycmVudFB1YmxpY2F0aW9uSW52b2NhdGlvbi5jb25uZWN0aW9uO1xuICAgIH1cblxuICAgIHZhciBpbnZvY2F0aW9uID0gbmV3IEREUENvbW1vbi5NZXRob2RJbnZvY2F0aW9uKHtcbiAgICAgIGlzU2ltdWxhdGlvbjogZmFsc2UsXG4gICAgICB1c2VySWQsXG4gICAgICBzZXRVc2VySWQsXG4gICAgICBjb25uZWN0aW9uLFxuICAgICAgcmFuZG9tU2VlZFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4gcmVzb2x2ZShcbiAgICAgIEREUC5fQ3VycmVudE1ldGhvZEludm9jYXRpb24ud2l0aFZhbHVlKFxuICAgICAgICBpbnZvY2F0aW9uLFxuICAgICAgICAoKSA9PiBtYXliZUF1ZGl0QXJndW1lbnRDaGVja3MoXG4gICAgICAgICAgaGFuZGxlciwgaW52b2NhdGlvbiwgRUpTT04uY2xvbmUoYXJncyksXG4gICAgICAgICAgXCJpbnRlcm5hbCBjYWxsIHRvICdcIiArIG5hbWUgKyBcIidcIlxuICAgICAgICApXG4gICAgICApXG4gICAgKSkudGhlbihFSlNPTi5jbG9uZSk7XG4gIH0sXG5cbiAgX3VybEZvclNlc3Npb246IGZ1bmN0aW9uIChzZXNzaW9uSWQpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIHNlc3Npb24gPSBzZWxmLnNlc3Npb25zLmdldChzZXNzaW9uSWQpO1xuICAgIGlmIChzZXNzaW9uKVxuICAgICAgcmV0dXJuIHNlc3Npb24uX3NvY2tldFVybDtcbiAgICBlbHNlXG4gICAgICByZXR1cm4gbnVsbDtcbiAgfVxufSk7XG5cbnZhciBjYWxjdWxhdGVWZXJzaW9uID0gZnVuY3Rpb24gKGNsaWVudFN1cHBvcnRlZFZlcnNpb25zLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VydmVyU3VwcG9ydGVkVmVyc2lvbnMpIHtcbiAgdmFyIGNvcnJlY3RWZXJzaW9uID0gXy5maW5kKGNsaWVudFN1cHBvcnRlZFZlcnNpb25zLCBmdW5jdGlvbiAodmVyc2lvbikge1xuICAgIHJldHVybiBfLmNvbnRhaW5zKHNlcnZlclN1cHBvcnRlZFZlcnNpb25zLCB2ZXJzaW9uKTtcbiAgfSk7XG4gIGlmICghY29ycmVjdFZlcnNpb24pIHtcbiAgICBjb3JyZWN0VmVyc2lvbiA9IHNlcnZlclN1cHBvcnRlZFZlcnNpb25zWzBdO1xuICB9XG4gIHJldHVybiBjb3JyZWN0VmVyc2lvbjtcbn07XG5cbkREUFNlcnZlci5fY2FsY3VsYXRlVmVyc2lvbiA9IGNhbGN1bGF0ZVZlcnNpb247XG5cblxuLy8gXCJibGluZFwiIGV4Y2VwdGlvbnMgb3RoZXIgdGhhbiB0aG9zZSB0aGF0IHdlcmUgZGVsaWJlcmF0ZWx5IHRocm93biB0byBzaWduYWxcbi8vIGVycm9ycyB0byB0aGUgY2xpZW50XG52YXIgd3JhcEludGVybmFsRXhjZXB0aW9uID0gZnVuY3Rpb24gKGV4Y2VwdGlvbiwgY29udGV4dCkge1xuICBpZiAoIWV4Y2VwdGlvbikgcmV0dXJuIGV4Y2VwdGlvbjtcblxuICAvLyBUbyBhbGxvdyBwYWNrYWdlcyB0byB0aHJvdyBlcnJvcnMgaW50ZW5kZWQgZm9yIHRoZSBjbGllbnQgYnV0IG5vdCBoYXZlIHRvXG4gIC8vIGRlcGVuZCBvbiB0aGUgTWV0ZW9yLkVycm9yIGNsYXNzLCBgaXNDbGllbnRTYWZlYCBjYW4gYmUgc2V0IHRvIHRydWUgb24gYW55XG4gIC8vIGVycm9yIGJlZm9yZSBpdCBpcyB0aHJvd24uXG4gIGlmIChleGNlcHRpb24uaXNDbGllbnRTYWZlKSB7XG4gICAgaWYgKCEoZXhjZXB0aW9uIGluc3RhbmNlb2YgTWV0ZW9yLkVycm9yKSkge1xuICAgICAgY29uc3Qgb3JpZ2luYWxNZXNzYWdlID0gZXhjZXB0aW9uLm1lc3NhZ2U7XG4gICAgICBleGNlcHRpb24gPSBuZXcgTWV0ZW9yLkVycm9yKGV4Y2VwdGlvbi5lcnJvciwgZXhjZXB0aW9uLnJlYXNvbiwgZXhjZXB0aW9uLmRldGFpbHMpO1xuICAgICAgZXhjZXB0aW9uLm1lc3NhZ2UgPSBvcmlnaW5hbE1lc3NhZ2U7XG4gICAgfVxuICAgIHJldHVybiBleGNlcHRpb247XG4gIH1cblxuICAvLyBUZXN0cyBjYW4gc2V0IHRoZSAnX2V4cGVjdGVkQnlUZXN0JyBmbGFnIG9uIGFuIGV4Y2VwdGlvbiBzbyBpdCB3b24ndCBnbyB0b1xuICAvLyB0aGUgc2VydmVyIGxvZy5cbiAgaWYgKCFleGNlcHRpb24uX2V4cGVjdGVkQnlUZXN0KSB7XG4gICAgTWV0ZW9yLl9kZWJ1ZyhcIkV4Y2VwdGlvbiBcIiArIGNvbnRleHQsIGV4Y2VwdGlvbi5zdGFjayk7XG4gICAgaWYgKGV4Y2VwdGlvbi5zYW5pdGl6ZWRFcnJvcikge1xuICAgICAgTWV0ZW9yLl9kZWJ1ZyhcIlNhbml0aXplZCBhbmQgcmVwb3J0ZWQgdG8gdGhlIGNsaWVudCBhczpcIiwgZXhjZXB0aW9uLnNhbml0aXplZEVycm9yKTtcbiAgICAgIE1ldGVvci5fZGVidWcoKTtcbiAgICB9XG4gIH1cblxuICAvLyBEaWQgdGhlIGVycm9yIGNvbnRhaW4gbW9yZSBkZXRhaWxzIHRoYXQgY291bGQgaGF2ZSBiZWVuIHVzZWZ1bCBpZiBjYXVnaHQgaW5cbiAgLy8gc2VydmVyIGNvZGUgKG9yIGlmIHRocm93biBmcm9tIG5vbi1jbGllbnQtb3JpZ2luYXRlZCBjb2RlKSwgYnV0IGFsc29cbiAgLy8gcHJvdmlkZWQgYSBcInNhbml0aXplZFwiIHZlcnNpb24gd2l0aCBtb3JlIGNvbnRleHQgdGhhbiA1MDAgSW50ZXJuYWwgc2VydmVyXG4gIC8vIGVycm9yPyBVc2UgdGhhdC5cbiAgaWYgKGV4Y2VwdGlvbi5zYW5pdGl6ZWRFcnJvcikge1xuICAgIGlmIChleGNlcHRpb24uc2FuaXRpemVkRXJyb3IuaXNDbGllbnRTYWZlKVxuICAgICAgcmV0dXJuIGV4Y2VwdGlvbi5zYW5pdGl6ZWRFcnJvcjtcbiAgICBNZXRlb3IuX2RlYnVnKFwiRXhjZXB0aW9uIFwiICsgY29udGV4dCArIFwiIHByb3ZpZGVzIGEgc2FuaXRpemVkRXJyb3IgdGhhdCBcIiArXG4gICAgICAgICAgICAgICAgICBcImRvZXMgbm90IGhhdmUgaXNDbGllbnRTYWZlIHByb3BlcnR5IHNldDsgaWdub3JpbmdcIik7XG4gIH1cblxuICByZXR1cm4gbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiSW50ZXJuYWwgc2VydmVyIGVycm9yXCIpO1xufTtcblxuXG4vLyBBdWRpdCBhcmd1bWVudCBjaGVja3MsIGlmIHRoZSBhdWRpdC1hcmd1bWVudC1jaGVja3MgcGFja2FnZSBleGlzdHMgKGl0IGlzIGFcbi8vIHdlYWsgZGVwZW5kZW5jeSBvZiB0aGlzIHBhY2thZ2UpLlxudmFyIG1heWJlQXVkaXRBcmd1bWVudENoZWNrcyA9IGZ1bmN0aW9uIChmLCBjb250ZXh0LCBhcmdzLCBkZXNjcmlwdGlvbikge1xuICBhcmdzID0gYXJncyB8fCBbXTtcbiAgaWYgKFBhY2thZ2VbJ2F1ZGl0LWFyZ3VtZW50LWNoZWNrcyddKSB7XG4gICAgcmV0dXJuIE1hdGNoLl9mYWlsSWZBcmd1bWVudHNBcmVOb3RBbGxDaGVja2VkKFxuICAgICAgZiwgY29udGV4dCwgYXJncywgZGVzY3JpcHRpb24pO1xuICB9XG4gIHJldHVybiBmLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xufTtcbiIsInZhciBGdXR1cmUgPSBOcG0ucmVxdWlyZSgnZmliZXJzL2Z1dHVyZScpO1xuXG4vLyBBIHdyaXRlIGZlbmNlIGNvbGxlY3RzIGEgZ3JvdXAgb2Ygd3JpdGVzLCBhbmQgcHJvdmlkZXMgYSBjYWxsYmFja1xuLy8gd2hlbiBhbGwgb2YgdGhlIHdyaXRlcyBhcmUgZnVsbHkgY29tbWl0dGVkIGFuZCBwcm9wYWdhdGVkIChhbGxcbi8vIG9ic2VydmVycyBoYXZlIGJlZW4gbm90aWZpZWQgb2YgdGhlIHdyaXRlIGFuZCBhY2tub3dsZWRnZWQgaXQuKVxuLy9cbkREUFNlcnZlci5fV3JpdGVGZW5jZSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIHNlbGYuYXJtZWQgPSBmYWxzZTtcbiAgc2VsZi5maXJlZCA9IGZhbHNlO1xuICBzZWxmLnJldGlyZWQgPSBmYWxzZTtcbiAgc2VsZi5vdXRzdGFuZGluZ193cml0ZXMgPSAwO1xuICBzZWxmLmJlZm9yZV9maXJlX2NhbGxiYWNrcyA9IFtdO1xuICBzZWxmLmNvbXBsZXRpb25fY2FsbGJhY2tzID0gW107XG59O1xuXG4vLyBUaGUgY3VycmVudCB3cml0ZSBmZW5jZS4gV2hlbiB0aGVyZSBpcyBhIGN1cnJlbnQgd3JpdGUgZmVuY2UsIGNvZGVcbi8vIHRoYXQgd3JpdGVzIHRvIGRhdGFiYXNlcyBzaG91bGQgcmVnaXN0ZXIgdGhlaXIgd3JpdGVzIHdpdGggaXQgdXNpbmdcbi8vIGJlZ2luV3JpdGUoKS5cbi8vXG5ERFBTZXJ2ZXIuX0N1cnJlbnRXcml0ZUZlbmNlID0gbmV3IE1ldGVvci5FbnZpcm9ubWVudFZhcmlhYmxlO1xuXG5fLmV4dGVuZChERFBTZXJ2ZXIuX1dyaXRlRmVuY2UucHJvdG90eXBlLCB7XG4gIC8vIFN0YXJ0IHRyYWNraW5nIGEgd3JpdGUsIGFuZCByZXR1cm4gYW4gb2JqZWN0IHRvIHJlcHJlc2VudCBpdC4gVGhlXG4gIC8vIG9iamVjdCBoYXMgYSBzaW5nbGUgbWV0aG9kLCBjb21taXR0ZWQoKS4gVGhpcyBtZXRob2Qgc2hvdWxkIGJlXG4gIC8vIGNhbGxlZCB3aGVuIHRoZSB3cml0ZSBpcyBmdWxseSBjb21taXR0ZWQgYW5kIHByb3BhZ2F0ZWQuIFlvdSBjYW5cbiAgLy8gY29udGludWUgdG8gYWRkIHdyaXRlcyB0byB0aGUgV3JpdGVGZW5jZSB1cCB1bnRpbCBpdCBpcyB0cmlnZ2VyZWRcbiAgLy8gKGNhbGxzIGl0cyBjYWxsYmFja3MgYmVjYXVzZSBhbGwgd3JpdGVzIGhhdmUgY29tbWl0dGVkLilcbiAgYmVnaW5Xcml0ZTogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIGlmIChzZWxmLnJldGlyZWQpXG4gICAgICByZXR1cm4geyBjb21taXR0ZWQ6IGZ1bmN0aW9uICgpIHt9IH07XG5cbiAgICBpZiAoc2VsZi5maXJlZClcbiAgICAgIHRocm93IG5ldyBFcnJvcihcImZlbmNlIGhhcyBhbHJlYWR5IGFjdGl2YXRlZCAtLSB0b28gbGF0ZSB0byBhZGQgd3JpdGVzXCIpO1xuXG4gICAgc2VsZi5vdXRzdGFuZGluZ193cml0ZXMrKztcbiAgICB2YXIgY29tbWl0dGVkID0gZmFsc2U7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbW1pdHRlZDogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoY29tbWl0dGVkKVxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImNvbW1pdHRlZCBjYWxsZWQgdHdpY2Ugb24gdGhlIHNhbWUgd3JpdGVcIik7XG4gICAgICAgIGNvbW1pdHRlZCA9IHRydWU7XG4gICAgICAgIHNlbGYub3V0c3RhbmRpbmdfd3JpdGVzLS07XG4gICAgICAgIHNlbGYuX21heWJlRmlyZSgpO1xuICAgICAgfVxuICAgIH07XG4gIH0sXG5cbiAgLy8gQXJtIHRoZSBmZW5jZS4gT25jZSB0aGUgZmVuY2UgaXMgYXJtZWQsIGFuZCB0aGVyZSBhcmUgbm8gbW9yZVxuICAvLyB1bmNvbW1pdHRlZCB3cml0ZXMsIGl0IHdpbGwgYWN0aXZhdGUuXG4gIGFybTogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBpZiAoc2VsZiA9PT0gRERQU2VydmVyLl9DdXJyZW50V3JpdGVGZW5jZS5nZXQoKSlcbiAgICAgIHRocm93IEVycm9yKFwiQ2FuJ3QgYXJtIHRoZSBjdXJyZW50IGZlbmNlXCIpO1xuICAgIHNlbGYuYXJtZWQgPSB0cnVlO1xuICAgIHNlbGYuX21heWJlRmlyZSgpO1xuICB9LFxuXG4gIC8vIFJlZ2lzdGVyIGEgZnVuY3Rpb24gdG8gYmUgY2FsbGVkIG9uY2UgYmVmb3JlIGZpcmluZyB0aGUgZmVuY2UuXG4gIC8vIENhbGxiYWNrIGZ1bmN0aW9uIGNhbiBhZGQgbmV3IHdyaXRlcyB0byB0aGUgZmVuY2UsIGluIHdoaWNoIGNhc2VcbiAgLy8gaXQgd29uJ3QgZmlyZSB1bnRpbCB0aG9zZSB3cml0ZXMgYXJlIGRvbmUgYXMgd2VsbC5cbiAgb25CZWZvcmVGaXJlOiBmdW5jdGlvbiAoZnVuYykge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBpZiAoc2VsZi5maXJlZClcbiAgICAgIHRocm93IG5ldyBFcnJvcihcImZlbmNlIGhhcyBhbHJlYWR5IGFjdGl2YXRlZCAtLSB0b28gbGF0ZSB0byBcIiArXG4gICAgICAgICAgICAgICAgICAgICAgXCJhZGQgYSBjYWxsYmFja1wiKTtcbiAgICBzZWxmLmJlZm9yZV9maXJlX2NhbGxiYWNrcy5wdXNoKGZ1bmMpO1xuICB9LFxuXG4gIC8vIFJlZ2lzdGVyIGEgZnVuY3Rpb24gdG8gYmUgY2FsbGVkIHdoZW4gdGhlIGZlbmNlIGZpcmVzLlxuICBvbkFsbENvbW1pdHRlZDogZnVuY3Rpb24gKGZ1bmMpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgaWYgKHNlbGYuZmlyZWQpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJmZW5jZSBoYXMgYWxyZWFkeSBhY3RpdmF0ZWQgLS0gdG9vIGxhdGUgdG8gXCIgK1xuICAgICAgICAgICAgICAgICAgICAgIFwiYWRkIGEgY2FsbGJhY2tcIik7XG4gICAgc2VsZi5jb21wbGV0aW9uX2NhbGxiYWNrcy5wdXNoKGZ1bmMpO1xuICB9LFxuXG4gIC8vIENvbnZlbmllbmNlIGZ1bmN0aW9uLiBBcm1zIHRoZSBmZW5jZSwgdGhlbiBibG9ja3MgdW50aWwgaXQgZmlyZXMuXG4gIGFybUFuZFdhaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGZ1dHVyZSA9IG5ldyBGdXR1cmU7XG4gICAgc2VsZi5vbkFsbENvbW1pdHRlZChmdW5jdGlvbiAoKSB7XG4gICAgICBmdXR1cmVbJ3JldHVybiddKCk7XG4gICAgfSk7XG4gICAgc2VsZi5hcm0oKTtcbiAgICBmdXR1cmUud2FpdCgpO1xuICB9LFxuXG4gIF9tYXliZUZpcmU6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgaWYgKHNlbGYuZmlyZWQpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ3cml0ZSBmZW5jZSBhbHJlYWR5IGFjdGl2YXRlZD9cIik7XG4gICAgaWYgKHNlbGYuYXJtZWQgJiYgIXNlbGYub3V0c3RhbmRpbmdfd3JpdGVzKSB7XG4gICAgICBmdW5jdGlvbiBpbnZva2VDYWxsYmFjayAoZnVuYykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGZ1bmMoc2VsZik7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgIE1ldGVvci5fZGVidWcoXCJleGNlcHRpb24gaW4gd3JpdGUgZmVuY2UgY2FsbGJhY2tcIiwgZXJyKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBzZWxmLm91dHN0YW5kaW5nX3dyaXRlcysrO1xuICAgICAgd2hpbGUgKHNlbGYuYmVmb3JlX2ZpcmVfY2FsbGJhY2tzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdmFyIGNhbGxiYWNrcyA9IHNlbGYuYmVmb3JlX2ZpcmVfY2FsbGJhY2tzO1xuICAgICAgICBzZWxmLmJlZm9yZV9maXJlX2NhbGxiYWNrcyA9IFtdO1xuICAgICAgICBfLmVhY2goY2FsbGJhY2tzLCBpbnZva2VDYWxsYmFjayk7XG4gICAgICB9XG4gICAgICBzZWxmLm91dHN0YW5kaW5nX3dyaXRlcy0tO1xuXG4gICAgICBpZiAoIXNlbGYub3V0c3RhbmRpbmdfd3JpdGVzKSB7XG4gICAgICAgIHNlbGYuZmlyZWQgPSB0cnVlO1xuICAgICAgICB2YXIgY2FsbGJhY2tzID0gc2VsZi5jb21wbGV0aW9uX2NhbGxiYWNrcztcbiAgICAgICAgc2VsZi5jb21wbGV0aW9uX2NhbGxiYWNrcyA9IFtdO1xuICAgICAgICBfLmVhY2goY2FsbGJhY2tzLCBpbnZva2VDYWxsYmFjayk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIC8vIERlYWN0aXZhdGUgdGhpcyBmZW5jZSBzbyB0aGF0IGFkZGluZyBtb3JlIHdyaXRlcyBoYXMgbm8gZWZmZWN0LlxuICAvLyBUaGUgZmVuY2UgbXVzdCBoYXZlIGFscmVhZHkgZmlyZWQuXG4gIHJldGlyZTogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBpZiAoISBzZWxmLmZpcmVkKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2FuJ3QgcmV0aXJlIGEgZmVuY2UgdGhhdCBoYXNuJ3QgZmlyZWQuXCIpO1xuICAgIHNlbGYucmV0aXJlZCA9IHRydWU7XG4gIH1cbn0pO1xuIiwiLy8gQSBcImNyb3NzYmFyXCIgaXMgYSBjbGFzcyB0aGF0IHByb3ZpZGVzIHN0cnVjdHVyZWQgbm90aWZpY2F0aW9uIHJlZ2lzdHJhdGlvbi5cbi8vIFNlZSBfbWF0Y2ggZm9yIHRoZSBkZWZpbml0aW9uIG9mIGhvdyBhIG5vdGlmaWNhdGlvbiBtYXRjaGVzIGEgdHJpZ2dlci5cbi8vIEFsbCBub3RpZmljYXRpb25zIGFuZCB0cmlnZ2VycyBtdXN0IGhhdmUgYSBzdHJpbmcga2V5IG5hbWVkICdjb2xsZWN0aW9uJy5cblxuRERQU2VydmVyLl9Dcm9zc2JhciA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgc2VsZi5uZXh0SWQgPSAxO1xuICAvLyBtYXAgZnJvbSBjb2xsZWN0aW9uIG5hbWUgKHN0cmluZykgLT4gbGlzdGVuZXIgaWQgLT4gb2JqZWN0LiBlYWNoIG9iamVjdCBoYXNcbiAgLy8ga2V5cyAndHJpZ2dlcicsICdjYWxsYmFjaycuICBBcyBhIGhhY2ssIHRoZSBlbXB0eSBzdHJpbmcgbWVhbnMgXCJub1xuICAvLyBjb2xsZWN0aW9uXCIuXG4gIHNlbGYubGlzdGVuZXJzQnlDb2xsZWN0aW9uID0ge307XG4gIHNlbGYubGlzdGVuZXJzQnlDb2xsZWN0aW9uQ291bnQgPSB7fTtcbiAgc2VsZi5mYWN0UGFja2FnZSA9IG9wdGlvbnMuZmFjdFBhY2thZ2UgfHwgXCJsaXZlZGF0YVwiO1xuICBzZWxmLmZhY3ROYW1lID0gb3B0aW9ucy5mYWN0TmFtZSB8fCBudWxsO1xufTtcblxuXy5leHRlbmQoRERQU2VydmVyLl9Dcm9zc2Jhci5wcm90b3R5cGUsIHtcbiAgLy8gbXNnIGlzIGEgdHJpZ2dlciBvciBhIG5vdGlmaWNhdGlvblxuICBfY29sbGVjdGlvbkZvck1lc3NhZ2U6IGZ1bmN0aW9uIChtc2cpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgaWYgKCEgXy5oYXMobXNnLCAnY29sbGVjdGlvbicpKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YobXNnLmNvbGxlY3Rpb24pID09PSAnc3RyaW5nJykge1xuICAgICAgaWYgKG1zZy5jb2xsZWN0aW9uID09PSAnJylcbiAgICAgICAgdGhyb3cgRXJyb3IoXCJNZXNzYWdlIGhhcyBlbXB0eSBjb2xsZWN0aW9uIVwiKTtcbiAgICAgIHJldHVybiBtc2cuY29sbGVjdGlvbjtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgRXJyb3IoXCJNZXNzYWdlIGhhcyBub24tc3RyaW5nIGNvbGxlY3Rpb24hXCIpO1xuICAgIH1cbiAgfSxcblxuICAvLyBMaXN0ZW4gZm9yIG5vdGlmaWNhdGlvbiB0aGF0IG1hdGNoICd0cmlnZ2VyJy4gQSBub3RpZmljYXRpb25cbiAgLy8gbWF0Y2hlcyBpZiBpdCBoYXMgdGhlIGtleS12YWx1ZSBwYWlycyBpbiB0cmlnZ2VyIGFzIGFcbiAgLy8gc3Vic2V0LiBXaGVuIGEgbm90aWZpY2F0aW9uIG1hdGNoZXMsIGNhbGwgJ2NhbGxiYWNrJywgcGFzc2luZ1xuICAvLyB0aGUgYWN0dWFsIG5vdGlmaWNhdGlvbi5cbiAgLy9cbiAgLy8gUmV0dXJucyBhIGxpc3RlbiBoYW5kbGUsIHdoaWNoIGlzIGFuIG9iamVjdCB3aXRoIGEgbWV0aG9kXG4gIC8vIHN0b3AoKS4gQ2FsbCBzdG9wKCkgdG8gc3RvcCBsaXN0ZW5pbmcuXG4gIC8vXG4gIC8vIFhYWCBJdCBzaG91bGQgYmUgbGVnYWwgdG8gY2FsbCBmaXJlKCkgZnJvbSBpbnNpZGUgYSBsaXN0ZW4oKVxuICAvLyBjYWxsYmFjaz9cbiAgbGlzdGVuOiBmdW5jdGlvbiAodHJpZ2dlciwgY2FsbGJhY2spIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGlkID0gc2VsZi5uZXh0SWQrKztcblxuICAgIHZhciBjb2xsZWN0aW9uID0gc2VsZi5fY29sbGVjdGlvbkZvck1lc3NhZ2UodHJpZ2dlcik7XG4gICAgdmFyIHJlY29yZCA9IHt0cmlnZ2VyOiBFSlNPTi5jbG9uZSh0cmlnZ2VyKSwgY2FsbGJhY2s6IGNhbGxiYWNrfTtcbiAgICBpZiAoISBfLmhhcyhzZWxmLmxpc3RlbmVyc0J5Q29sbGVjdGlvbiwgY29sbGVjdGlvbikpIHtcbiAgICAgIHNlbGYubGlzdGVuZXJzQnlDb2xsZWN0aW9uW2NvbGxlY3Rpb25dID0ge307XG4gICAgICBzZWxmLmxpc3RlbmVyc0J5Q29sbGVjdGlvbkNvdW50W2NvbGxlY3Rpb25dID0gMDtcbiAgICB9XG4gICAgc2VsZi5saXN0ZW5lcnNCeUNvbGxlY3Rpb25bY29sbGVjdGlvbl1baWRdID0gcmVjb3JkO1xuICAgIHNlbGYubGlzdGVuZXJzQnlDb2xsZWN0aW9uQ291bnRbY29sbGVjdGlvbl0rKztcblxuICAgIGlmIChzZWxmLmZhY3ROYW1lICYmIFBhY2thZ2VbJ2ZhY3RzLWJhc2UnXSkge1xuICAgICAgUGFja2FnZVsnZmFjdHMtYmFzZSddLkZhY3RzLmluY3JlbWVudFNlcnZlckZhY3QoXG4gICAgICAgIHNlbGYuZmFjdFBhY2thZ2UsIHNlbGYuZmFjdE5hbWUsIDEpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBzdG9wOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChzZWxmLmZhY3ROYW1lICYmIFBhY2thZ2VbJ2ZhY3RzLWJhc2UnXSkge1xuICAgICAgICAgIFBhY2thZ2VbJ2ZhY3RzLWJhc2UnXS5GYWN0cy5pbmNyZW1lbnRTZXJ2ZXJGYWN0KFxuICAgICAgICAgICAgc2VsZi5mYWN0UGFja2FnZSwgc2VsZi5mYWN0TmFtZSwgLTEpO1xuICAgICAgICB9XG4gICAgICAgIGRlbGV0ZSBzZWxmLmxpc3RlbmVyc0J5Q29sbGVjdGlvbltjb2xsZWN0aW9uXVtpZF07XG4gICAgICAgIHNlbGYubGlzdGVuZXJzQnlDb2xsZWN0aW9uQ291bnRbY29sbGVjdGlvbl0tLTtcbiAgICAgICAgaWYgKHNlbGYubGlzdGVuZXJzQnlDb2xsZWN0aW9uQ291bnRbY29sbGVjdGlvbl0gPT09IDApIHtcbiAgICAgICAgICBkZWxldGUgc2VsZi5saXN0ZW5lcnNCeUNvbGxlY3Rpb25bY29sbGVjdGlvbl07XG4gICAgICAgICAgZGVsZXRlIHNlbGYubGlzdGVuZXJzQnlDb2xsZWN0aW9uQ291bnRbY29sbGVjdGlvbl07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9LFxuXG4gIC8vIEZpcmUgdGhlIHByb3ZpZGVkICdub3RpZmljYXRpb24nIChhbiBvYmplY3Qgd2hvc2UgYXR0cmlidXRlXG4gIC8vIHZhbHVlcyBhcmUgYWxsIEpTT04tY29tcGF0aWJpbGUpIC0tIGluZm9ybSBhbGwgbWF0Y2hpbmcgbGlzdGVuZXJzXG4gIC8vIChyZWdpc3RlcmVkIHdpdGggbGlzdGVuKCkpLlxuICAvL1xuICAvLyBJZiBmaXJlKCkgaXMgY2FsbGVkIGluc2lkZSBhIHdyaXRlIGZlbmNlLCB0aGVuIGVhY2ggb2YgdGhlXG4gIC8vIGxpc3RlbmVyIGNhbGxiYWNrcyB3aWxsIGJlIGNhbGxlZCBpbnNpZGUgdGhlIHdyaXRlIGZlbmNlIGFzIHdlbGwuXG4gIC8vXG4gIC8vIFRoZSBsaXN0ZW5lcnMgbWF5IGJlIGludm9rZWQgaW4gcGFyYWxsZWwsIHJhdGhlciB0aGFuIHNlcmlhbGx5LlxuICBmaXJlOiBmdW5jdGlvbiAobm90aWZpY2F0aW9uKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgdmFyIGNvbGxlY3Rpb24gPSBzZWxmLl9jb2xsZWN0aW9uRm9yTWVzc2FnZShub3RpZmljYXRpb24pO1xuXG4gICAgaWYgKCEgXy5oYXMoc2VsZi5saXN0ZW5lcnNCeUNvbGxlY3Rpb24sIGNvbGxlY3Rpb24pKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGxpc3RlbmVyc0ZvckNvbGxlY3Rpb24gPSBzZWxmLmxpc3RlbmVyc0J5Q29sbGVjdGlvbltjb2xsZWN0aW9uXTtcbiAgICB2YXIgY2FsbGJhY2tJZHMgPSBbXTtcbiAgICBfLmVhY2gobGlzdGVuZXJzRm9yQ29sbGVjdGlvbiwgZnVuY3Rpb24gKGwsIGlkKSB7XG4gICAgICBpZiAoc2VsZi5fbWF0Y2hlcyhub3RpZmljYXRpb24sIGwudHJpZ2dlcikpIHtcbiAgICAgICAgY2FsbGJhY2tJZHMucHVzaChpZCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBMaXN0ZW5lciBjYWxsYmFja3MgY2FuIHlpZWxkLCBzbyB3ZSBuZWVkIHRvIGZpcnN0IGZpbmQgYWxsIHRoZSBvbmVzIHRoYXRcbiAgICAvLyBtYXRjaCBpbiBhIHNpbmdsZSBpdGVyYXRpb24gb3ZlciBzZWxmLmxpc3RlbmVyc0J5Q29sbGVjdGlvbiAod2hpY2ggY2FuJ3RcbiAgICAvLyBiZSBtdXRhdGVkIGR1cmluZyB0aGlzIGl0ZXJhdGlvbiksIGFuZCB0aGVuIGludm9rZSB0aGUgbWF0Y2hpbmdcbiAgICAvLyBjYWxsYmFja3MsIGNoZWNraW5nIGJlZm9yZSBlYWNoIGNhbGwgdG8gZW5zdXJlIHRoZXkgaGF2ZW4ndCBzdG9wcGVkLlxuICAgIC8vIE5vdGUgdGhhdCB3ZSBkb24ndCBoYXZlIHRvIGNoZWNrIHRoYXRcbiAgICAvLyBzZWxmLmxpc3RlbmVyc0J5Q29sbGVjdGlvbltjb2xsZWN0aW9uXSBzdGlsbCA9PT0gbGlzdGVuZXJzRm9yQ29sbGVjdGlvbixcbiAgICAvLyBiZWNhdXNlIHRoZSBvbmx5IHdheSB0aGF0IHN0b3BzIGJlaW5nIHRydWUgaXMgaWYgbGlzdGVuZXJzRm9yQ29sbGVjdGlvblxuICAgIC8vIGZpcnN0IGdldHMgcmVkdWNlZCBkb3duIHRvIHRoZSBlbXB0eSBvYmplY3QgKGFuZCB0aGVuIG5ldmVyIGdldHNcbiAgICAvLyBpbmNyZWFzZWQgYWdhaW4pLlxuICAgIF8uZWFjaChjYWxsYmFja0lkcywgZnVuY3Rpb24gKGlkKSB7XG4gICAgICBpZiAoXy5oYXMobGlzdGVuZXJzRm9yQ29sbGVjdGlvbiwgaWQpKSB7XG4gICAgICAgIGxpc3RlbmVyc0ZvckNvbGxlY3Rpb25baWRdLmNhbGxiYWNrKG5vdGlmaWNhdGlvbik7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG5cbiAgLy8gQSBub3RpZmljYXRpb24gbWF0Y2hlcyBhIHRyaWdnZXIgaWYgYWxsIGtleXMgdGhhdCBleGlzdCBpbiBib3RoIGFyZSBlcXVhbC5cbiAgLy9cbiAgLy8gRXhhbXBsZXM6XG4gIC8vICBOOntjb2xsZWN0aW9uOiBcIkNcIn0gbWF0Y2hlcyBUOntjb2xsZWN0aW9uOiBcIkNcIn1cbiAgLy8gICAgKGEgbm9uLXRhcmdldGVkIHdyaXRlIHRvIGEgY29sbGVjdGlvbiBtYXRjaGVzIGFcbiAgLy8gICAgIG5vbi10YXJnZXRlZCBxdWVyeSlcbiAgLy8gIE46e2NvbGxlY3Rpb246IFwiQ1wiLCBpZDogXCJYXCJ9IG1hdGNoZXMgVDp7Y29sbGVjdGlvbjogXCJDXCJ9XG4gIC8vICAgIChhIHRhcmdldGVkIHdyaXRlIHRvIGEgY29sbGVjdGlvbiBtYXRjaGVzIGEgbm9uLXRhcmdldGVkIHF1ZXJ5KVxuICAvLyAgTjp7Y29sbGVjdGlvbjogXCJDXCJ9IG1hdGNoZXMgVDp7Y29sbGVjdGlvbjogXCJDXCIsIGlkOiBcIlhcIn1cbiAgLy8gICAgKGEgbm9uLXRhcmdldGVkIHdyaXRlIHRvIGEgY29sbGVjdGlvbiBtYXRjaGVzIGFcbiAgLy8gICAgIHRhcmdldGVkIHF1ZXJ5KVxuICAvLyAgTjp7Y29sbGVjdGlvbjogXCJDXCIsIGlkOiBcIlhcIn0gbWF0Y2hlcyBUOntjb2xsZWN0aW9uOiBcIkNcIiwgaWQ6IFwiWFwifVxuICAvLyAgICAoYSB0YXJnZXRlZCB3cml0ZSB0byBhIGNvbGxlY3Rpb24gbWF0Y2hlcyBhIHRhcmdldGVkIHF1ZXJ5IHRhcmdldGVkXG4gIC8vICAgICBhdCB0aGUgc2FtZSBkb2N1bWVudClcbiAgLy8gIE46e2NvbGxlY3Rpb246IFwiQ1wiLCBpZDogXCJYXCJ9IGRvZXMgbm90IG1hdGNoIFQ6e2NvbGxlY3Rpb246IFwiQ1wiLCBpZDogXCJZXCJ9XG4gIC8vICAgIChhIHRhcmdldGVkIHdyaXRlIHRvIGEgY29sbGVjdGlvbiBkb2VzIG5vdCBtYXRjaCBhIHRhcmdldGVkIHF1ZXJ5XG4gIC8vICAgICB0YXJnZXRlZCBhdCBhIGRpZmZlcmVudCBkb2N1bWVudClcbiAgX21hdGNoZXM6IGZ1bmN0aW9uIChub3RpZmljYXRpb24sIHRyaWdnZXIpIHtcbiAgICAvLyBNb3N0IG5vdGlmaWNhdGlvbnMgdGhhdCB1c2UgdGhlIGNyb3NzYmFyIGhhdmUgYSBzdHJpbmcgYGNvbGxlY3Rpb25gIGFuZFxuICAgIC8vIG1heWJlIGFuIGBpZGAgdGhhdCBpcyBhIHN0cmluZyBvciBPYmplY3RJRC4gV2UncmUgYWxyZWFkeSBkaXZpZGluZyB1cFxuICAgIC8vIHRyaWdnZXJzIGJ5IGNvbGxlY3Rpb24sIGJ1dCBsZXQncyBmYXN0LXRyYWNrIFwibm9wZSwgZGlmZmVyZW50IElEXCIgKGFuZFxuICAgIC8vIGF2b2lkIHRoZSBvdmVybHkgZ2VuZXJpYyBFSlNPTi5lcXVhbHMpLiBUaGlzIG1ha2VzIGEgbm90aWNlYWJsZVxuICAgIC8vIHBlcmZvcm1hbmNlIGRpZmZlcmVuY2U7IHNlZSBodHRwczovL2dpdGh1Yi5jb20vbWV0ZW9yL21ldGVvci9wdWxsLzM2OTdcbiAgICBpZiAodHlwZW9mKG5vdGlmaWNhdGlvbi5pZCkgPT09ICdzdHJpbmcnICYmXG4gICAgICAgIHR5cGVvZih0cmlnZ2VyLmlkKSA9PT0gJ3N0cmluZycgJiZcbiAgICAgICAgbm90aWZpY2F0aW9uLmlkICE9PSB0cmlnZ2VyLmlkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmIChub3RpZmljYXRpb24uaWQgaW5zdGFuY2VvZiBNb25nb0lELk9iamVjdElEICYmXG4gICAgICAgIHRyaWdnZXIuaWQgaW5zdGFuY2VvZiBNb25nb0lELk9iamVjdElEICYmXG4gICAgICAgICEgbm90aWZpY2F0aW9uLmlkLmVxdWFscyh0cmlnZ2VyLmlkKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiBfLmFsbCh0cmlnZ2VyLCBmdW5jdGlvbiAodHJpZ2dlclZhbHVlLCBrZXkpIHtcbiAgICAgIHJldHVybiAhXy5oYXMobm90aWZpY2F0aW9uLCBrZXkpIHx8XG4gICAgICAgIEVKU09OLmVxdWFscyh0cmlnZ2VyVmFsdWUsIG5vdGlmaWNhdGlvbltrZXldKTtcbiAgICB9KTtcbiAgfVxufSk7XG5cbi8vIFRoZSBcImludmFsaWRhdGlvbiBjcm9zc2JhclwiIGlzIGEgc3BlY2lmaWMgaW5zdGFuY2UgdXNlZCBieSB0aGUgRERQIHNlcnZlciB0b1xuLy8gaW1wbGVtZW50IHdyaXRlIGZlbmNlIG5vdGlmaWNhdGlvbnMuIExpc3RlbmVyIGNhbGxiYWNrcyBvbiB0aGlzIGNyb3NzYmFyXG4vLyBzaG91bGQgY2FsbCBiZWdpbldyaXRlIG9uIHRoZSBjdXJyZW50IHdyaXRlIGZlbmNlIGJlZm9yZSB0aGV5IHJldHVybiwgaWYgdGhleVxuLy8gd2FudCB0byBkZWxheSB0aGUgd3JpdGUgZmVuY2UgZnJvbSBmaXJpbmcgKGllLCB0aGUgRERQIG1ldGhvZC1kYXRhLXVwZGF0ZWRcbi8vIG1lc3NhZ2UgZnJvbSBiZWluZyBzZW50KS5cbkREUFNlcnZlci5fSW52YWxpZGF0aW9uQ3Jvc3NiYXIgPSBuZXcgRERQU2VydmVyLl9Dcm9zc2Jhcih7XG4gIGZhY3ROYW1lOiBcImludmFsaWRhdGlvbi1jcm9zc2Jhci1saXN0ZW5lcnNcIlxufSk7XG4iLCJpZiAocHJvY2Vzcy5lbnYuRERQX0RFRkFVTFRfQ09OTkVDVElPTl9VUkwpIHtcbiAgX19tZXRlb3JfcnVudGltZV9jb25maWdfXy5ERFBfREVGQVVMVF9DT05ORUNUSU9OX1VSTCA9XG4gICAgcHJvY2Vzcy5lbnYuRERQX0RFRkFVTFRfQ09OTkVDVElPTl9VUkw7XG59XG5cbk1ldGVvci5zZXJ2ZXIgPSBuZXcgU2VydmVyO1xuXG5NZXRlb3IucmVmcmVzaCA9IGZ1bmN0aW9uIChub3RpZmljYXRpb24pIHtcbiAgRERQU2VydmVyLl9JbnZhbGlkYXRpb25Dcm9zc2Jhci5maXJlKG5vdGlmaWNhdGlvbik7XG59O1xuXG4vLyBQcm94eSB0aGUgcHVibGljIG1ldGhvZHMgb2YgTWV0ZW9yLnNlcnZlciBzbyB0aGV5IGNhblxuLy8gYmUgY2FsbGVkIGRpcmVjdGx5IG9uIE1ldGVvci5cbl8uZWFjaChbJ3B1Ymxpc2gnLCAnbWV0aG9kcycsICdjYWxsJywgJ2FwcGx5JywgJ29uQ29ubmVjdGlvbicsICdvbk1lc3NhZ2UnXSxcbiAgICAgICBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICAgTWV0ZW9yW25hbWVdID0gXy5iaW5kKE1ldGVvci5zZXJ2ZXJbbmFtZV0sIE1ldGVvci5zZXJ2ZXIpO1xuICAgICAgIH0pO1xuXG4vLyBNZXRlb3Iuc2VydmVyIHVzZWQgdG8gYmUgY2FsbGVkIE1ldGVvci5kZWZhdWx0X3NlcnZlci4gUHJvdmlkZVxuLy8gYmFja2NvbXBhdCBhcyBhIGNvdXJ0ZXN5IGV2ZW4gdGhvdWdoIGl0IHdhcyBuZXZlciBkb2N1bWVudGVkLlxuLy8gWFhYIENPTVBBVCBXSVRIIDAuNi40XG5NZXRlb3IuZGVmYXVsdF9zZXJ2ZXIgPSBNZXRlb3Iuc2VydmVyO1xuIl19
