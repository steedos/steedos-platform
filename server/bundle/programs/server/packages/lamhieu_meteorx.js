(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var Random = Package.random.Random;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;

/* Package-scope variables */
var exposeLivedata, exposeMongoLivedata, Fibers, MeteorX;

(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                              //
// packages/lamhieu_meteorx/src/livedata.js                                                     //
//                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                //
exposeLivedata = function(namespace) {
  // instrumenting session
  const fakeSocket = {send: function() {}, close: function() {}, headers: []};
  const ddpConnectMessage = {msg: 'connect', version: 'pre1', support: ['pre1']};
  Meteor.default_server._handleConnect(fakeSocket, ddpConnectMessage);

  if(fakeSocket._meteorSession) { // for newer meteor versions
    namespace.Session = fakeSocket._meteorSession.constructor;

    exposeSubscription(fakeSocket._meteorSession, namespace);
    exposeSessionCollectionView(fakeSocket._meteorSession, namespace);

    if (Meteor.default_server._removeSession) {
      // 1.7 +
      Meteor.default_server._removeSession(fakeSocket._meteorSession);
    } else if (Meteor.default_server._closeSession) {
      // 0.7.x +
      Meteor.default_server._closeSession(fakeSocket._meteorSession);
    } else if(Meteor.default_server._destroySession) {
      // 0.6.6.x
      Meteor.default_server._destroySession(fakeSocket._meteorSession);
    }
  } else if(fakeSocket.meteor_session) { // support for 0.6.5.x
    namespace.Session = fakeSocket.meteor_session.constructor;

    // instrumenting subscription
    exposeSubscription(fakeSocket.meteor_session, namespace);
    exposeSessionCollectionView(fakeSocket._meteorSession, namespace);

    fakeSocket.meteor_session.detach(fakeSocket);
  } else {
    console.error('expose: session exposing failed');
  }
};

function exposeSubscription(session, namespace) {
  const subId = Random.id();
  const publicationHandler = function() {
    this.ready()
  };
  const pubName = '__dummy_pub_' + Random.id();

  session._startSubscription(publicationHandler, subId, [], pubName);
  const isMap = session._namedSubs instanceof Map;
  const subscription = isMap ? session._namedSubs.get(subId) : session._namedSubs[subId];
  namespace.Subscription = subscription.constructor;

  // cleaning up
  session._stopSubscription(subId);
}

function exposeSessionCollectionView(session, namespace) {
  const documentView = session.getCollectionView();
  namespace.SessionCollectionView = documentView.constructor;

  const id = 'the-id';
  documentView.added('sample-handle', id, {aa: 10});
  const isMap = documentView.documents instanceof Map;
  const doc = isMap ? documentView.documents.get(id) : documentView.documents[id];
  namespace.SessionDocumentView = doc.constructor;
}

//////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                              //
// packages/lamhieu_meteorx/src/mongo-livedata.js                                               //
//                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                //
exposeMongoLivedata = function(namespace) {
  const MongoColl = typeof Mongo !== "undefined" ? Mongo.Collection : Meteor.Collection;
  const coll = new MongoColl("__dummy_coll_" + Random.id());
  // we need wait until db get connected with meteor, .findOne() does that
  coll.findOne();

  namespace.MongoConnection = MongoInternals.defaultRemoteCollectionDriver().mongo.constructor;
  const cursor = coll.find();
  namespace.MongoCursor = cursor.constructor;
  exposeOplogDriver(namespace, coll);
  exposePollingDriver(namespace, coll);
  exposeMultiplexer(namespace, coll);
};

function exposeOplogDriver(namespace, coll) {
  const driver = _getObserverDriver(coll.find({}));
  // verify observer driver is an oplog driver
  if (driver && typeof driver.constructor.cursorSupported === "function") {
    namespace.MongoOplogDriver = driver.constructor;
  }
}

function exposePollingDriver(namespace, coll) {
  const cursor = coll.find({}, { limit: 20, _disableOplog: true });
  const driver = _getObserverDriver(cursor);
  // verify observer driver is a polling driver
  if (driver && typeof driver.constructor.cursorSupported === "undefined") {
    namespace.MongoPollingDriver = driver.constructor;
  }
}

function exposeMultiplexer(namespace, coll) {
  const multiplexer = _getMultiplexer(coll.find({}));
  if (multiplexer) {
    namespace.Multiplexer = multiplexer.constructor;
  }
}

function _getObserverDriver(cursor) {
  const multiplexer = _getMultiplexer(cursor);
  if (multiplexer && multiplexer._observeDriver) {
    return multiplexer._observeDriver;
  }
}

function _getMultiplexer(cursor) {
  const handler = cursor.observeChanges({ added: Function.prototype });
  handler.stop();
  return handler._multiplexer;
}

//////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                              //
// packages/lamhieu_meteorx/src/server.js                                                       //
//                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                //
Fibers = Npm.require("fibers");

MeteorX = {};
MeteorX._readyCallbacks = [];
MeteorX._ready = false;

MeteorX.onReady = function(cb) {
  if (MeteorX._ready) {
    return runWithAFiber(cb);
  }

  this._readyCallbacks.push(cb);
};

MeteorX.Server = Meteor.server.constructor;
exposeLivedata(MeteorX);

// before using any other MeteorX apis we need to hijack Mongo related code
// that'w what we are doing here.
Meteor.startup(function() {
  runWithAFiber(function() {
    exposeMongoLivedata(MeteorX);
  });

  MeteorX._readyCallbacks.forEach(function(fn) {
    runWithAFiber(fn);
  });
  MeteorX._ready = true;
});

function runWithAFiber(cb) {
  if (Fibers.current) {
    cb();
  } else {
    new Fiber(cb).run();
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
Package._define("lamhieu:meteorx", {
  MeteorX: MeteorX
});

})();
