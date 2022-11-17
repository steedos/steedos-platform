(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var MeteorX = Package['lamhieu:meteorx'].MeteorX;

(function(){

//////////////////////////////////////////////////////////////////////////////////////////
//                                                                                      //
// packages/lamhieu_unblock/src/unblock.js                                              //
//                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////
                                                                                        //
let cachedUnblock;

function emptyFunction() {};

const originalSub = MeteorX.Session.prototype.protocol_handlers.sub;
MeteorX.Session.prototype.protocol_handlers.sub = function(msg, unblock) {
  const self = this;
  // cacheUnblock temporarly, so we can capture it later
  // we will use unblock in current eventLoop, so this is safe
  cachedUnblock = unblock;
  originalSub.call(self, msg, unblock);
  // cleaning cached unblock
  cachedUnblock = null;
};

// We simply replace current implementation with a simple modification
// to add add the unblock
MeteorX.Session.prototype._startSubscription = function(handler, subId, params, name) {
  const self = this;
  const sub = new MeteorX.Subscription(self, handler, subId, params, name);

  let unblockHander = cachedUnblock;
  // _startSubscription may call from a lot places
  // so cachedUnblock might be null in somecases
  // assign the cachedUnblock
  sub.unblock = unblockHander || emptyFunction;

  if (subId) {
    const isMap = self._namedSubs instanceof Map;
    if (isMap) {
      // 1.7+
      self._namedSubs.set(subId, sub);
    } else {
      self._namedSubs[subId] = sub;
    }
  } else {
    self._universalSubs.push(sub);
  }

  sub._runHandler();
};

// sometimes _runHandler will be called directly and
// we won't have the session context and cachedUnblock
// so, those situations, set a dummy function for unblock
// this happens often when logging in and out
const originalRunHandler = MeteorX.Subscription.prototype._runHandler;
MeteorX.Subscription.prototype._runHandler = function() {
  if (!this.unblock) {
    this.unblock = emptyFunction;
  }
  originalRunHandler.call(this);
};

//////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
Package._define("lamhieu:unblock");

})();
