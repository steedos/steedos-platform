(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var check = Package.check.check;
var Match = Package.check.Match;
var Random = Package.random.Random;
var ECMAScript = Package.ecmascript.ECMAScript;
var EJSON = Package.ejson.EJSON;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var Retry = Package.retry.Retry;
var meteorInstall = Package.modules.meteorInstall;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var DDPCommon;

var require = meteorInstall({"node_modules":{"meteor":{"ddp-common":{"namespace.js":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/ddp-common/namespace.js                                                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**
 * @namespace DDPCommon
 * @summary Namespace for DDPCommon-related methods/classes. Shared between 
 * `ddp-client` and `ddp-server`, where the ddp-client is the implementation
 * of a ddp client for both client AND server; and the ddp server is the
 * implementation of the livedata server and stream server. Common 
 * functionality shared between both can be shared under this namespace
 */
DDPCommon = {};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"heartbeat.js":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/ddp-common/heartbeat.js                                                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
// Heartbeat options:
//   heartbeatInterval: interval to send pings, in milliseconds.
//   heartbeatTimeout: timeout to close the connection if a reply isn't
//     received, in milliseconds.
//   sendPing: function to call to send a ping on the connection.
//   onTimeout: function to call to close the connection.
DDPCommon.Heartbeat = class Heartbeat {
  constructor(options) {
    this.heartbeatInterval = options.heartbeatInterval;
    this.heartbeatTimeout = options.heartbeatTimeout;
    this._sendPing = options.sendPing;
    this._onTimeout = options.onTimeout;
    this._seenPacket = false;
    this._heartbeatIntervalHandle = null;
    this._heartbeatTimeoutHandle = null;
  }

  stop() {
    this._clearHeartbeatIntervalTimer();

    this._clearHeartbeatTimeoutTimer();
  }

  start() {
    this.stop();

    this._startHeartbeatIntervalTimer();
  }

  _startHeartbeatIntervalTimer() {
    this._heartbeatIntervalHandle = Meteor.setInterval(() => this._heartbeatIntervalFired(), this.heartbeatInterval);
  }

  _startHeartbeatTimeoutTimer() {
    this._heartbeatTimeoutHandle = Meteor.setTimeout(() => this._heartbeatTimeoutFired(), this.heartbeatTimeout);
  }

  _clearHeartbeatIntervalTimer() {
    if (this._heartbeatIntervalHandle) {
      Meteor.clearInterval(this._heartbeatIntervalHandle);
      this._heartbeatIntervalHandle = null;
    }
  }

  _clearHeartbeatTimeoutTimer() {
    if (this._heartbeatTimeoutHandle) {
      Meteor.clearTimeout(this._heartbeatTimeoutHandle);
      this._heartbeatTimeoutHandle = null;
    }
  } // The heartbeat interval timer is fired when we should send a ping.


  _heartbeatIntervalFired() {
    // don't send ping if we've seen a packet since we last checked,
    // *or* if we have already sent a ping and are awaiting a timeout.
    // That shouldn't happen, but it's possible if
    // `this.heartbeatInterval` is smaller than
    // `this.heartbeatTimeout`.
    if (!this._seenPacket && !this._heartbeatTimeoutHandle) {
      this._sendPing(); // Set up timeout, in case a pong doesn't arrive in time.


      this._startHeartbeatTimeoutTimer();
    }

    this._seenPacket = false;
  } // The heartbeat timeout timer is fired when we sent a ping, but we
  // timed out waiting for the pong.


  _heartbeatTimeoutFired() {
    this._heartbeatTimeoutHandle = null;

    this._onTimeout();
  }

  messageReceived() {
    // Tell periodic checkin that we have seen a packet, and thus it
    // does not need to send a ping this cycle.
    this._seenPacket = true; // If we were waiting for a pong, we got it.

    if (this._heartbeatTimeoutHandle) {
      this._clearHeartbeatTimeoutTimer();
    }
  }

};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"utils.js":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/ddp-common/utils.js                                                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
"use strict";

module.export({
  hasOwn: () => hasOwn,
  slice: () => slice,
  keys: () => keys,
  isEmpty: () => isEmpty,
  last: () => last
});
const hasOwn = Object.prototype.hasOwnProperty;
const slice = Array.prototype.slice;

function keys(obj) {
  return Object.keys(Object(obj));
}

function isEmpty(obj) {
  if (obj == null) {
    return true;
  }

  if (Array.isArray(obj) || typeof obj === "string") {
    return obj.length === 0;
  }

  for (const key in obj) {
    if (hasOwn.call(obj, key)) {
      return false;
    }
  }

  return true;
}

function last(array, n, guard) {
  if (array == null) {
    return;
  }

  if (n == null || guard) {
    return array[array.length - 1];
  }

  return slice.call(array, Math.max(array.length - n, 0));
}

DDPCommon.SUPPORTED_DDP_VERSIONS = ['1', 'pre2', 'pre1'];

DDPCommon.parseDDP = function (stringMessage) {
  try {
    var msg = JSON.parse(stringMessage);
  } catch (e) {
    Meteor._debug("Discarding message with invalid JSON", stringMessage);

    return null;
  } // DDP messages must be objects.


  if (msg === null || typeof msg !== 'object') {
    Meteor._debug("Discarding non-object DDP message", stringMessage);

    return null;
  } // massage msg to get it into "abstract ddp" rather than "wire ddp" format.
  // switch between "cleared" rep of unsetting fields and "undefined"
  // rep of same


  if (hasOwn.call(msg, 'cleared')) {
    if (!hasOwn.call(msg, 'fields')) {
      msg.fields = {};
    }

    msg.cleared.forEach(clearKey => {
      msg.fields[clearKey] = undefined;
    });
    delete msg.cleared;
  }

  ['fields', 'params', 'result'].forEach(field => {
    if (hasOwn.call(msg, field)) {
      msg[field] = EJSON._adjustTypesFromJSONValue(msg[field]);
    }
  });
  return msg;
};

DDPCommon.stringifyDDP = function (msg) {
  const copy = EJSON.clone(msg); // swizzle 'changed' messages from 'fields undefined' rep to 'fields
  // and cleared' rep

  if (hasOwn.call(msg, 'fields')) {
    const cleared = [];
    Object.keys(msg.fields).forEach(key => {
      const value = msg.fields[key];

      if (typeof value === "undefined") {
        cleared.push(key);
        delete copy.fields[key];
      }
    });

    if (!isEmpty(cleared)) {
      copy.cleared = cleared;
    }

    if (isEmpty(copy.fields)) {
      delete copy.fields;
    }
  } // adjust types to basic


  ['fields', 'params', 'result'].forEach(field => {
    if (hasOwn.call(copy, field)) {
      copy[field] = EJSON._adjustTypesToJSONValue(copy[field]);
    }
  });

  if (msg.id && typeof msg.id !== 'string') {
    throw new Error("Message id is not a string");
  }

  return JSON.stringify(copy);
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"method_invocation.js":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/ddp-common/method_invocation.js                                                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
// Instance name is this because it is usually referred to as this inside a
// method definition

/**
 * @summary The state for a single invocation of a method, referenced by this
 * inside a method definition.
 * @param {Object} options
 * @instanceName this
 * @showInstanceName true
 */
DDPCommon.MethodInvocation = class MethodInvocation {
  constructor(options) {
    // true if we're running not the actual method, but a stub (that is,
    // if we're on a client (which may be a browser, or in the future a
    // server connecting to another server) and presently running a
    // simulation of a server-side method for latency compensation
    // purposes). not currently true except in a client such as a browser,
    // since there's usually no point in running stubs unless you have a
    // zero-latency connection to the user.

    /**
     * @summary Access inside a method invocation.  Boolean value, true if this invocation is a stub.
     * @locus Anywhere
     * @name  isSimulation
     * @memberOf DDPCommon.MethodInvocation
     * @instance
     * @type {Boolean}
     */
    this.isSimulation = options.isSimulation; // call this function to allow other method invocations (from the
    // same client) to continue running without waiting for this one to
    // complete.

    this._unblock = options.unblock || function () {};

    this._calledUnblock = false; // current user id

    /**
     * @summary The id of the user that made this method call, or `null` if no user was logged in.
     * @locus Anywhere
     * @name  userId
     * @memberOf DDPCommon.MethodInvocation
     * @instance
     */

    this.userId = options.userId; // sets current user id in all appropriate server contexts and
    // reruns subscriptions

    this._setUserId = options.setUserId || function () {}; // On the server, the connection this method call came in on.

    /**
     * @summary Access inside a method invocation. The [connection](#meteor_onconnection) that this method was received on. `null` if the method is not associated with a connection, eg. a server initiated method call. Calls to methods made from a server method which was in turn initiated from the client share the same `connection`.
     * @locus Server
     * @name  connection
     * @memberOf DDPCommon.MethodInvocation
     * @instance
     */


    this.connection = options.connection; // The seed for randomStream value generation

    this.randomSeed = options.randomSeed; // This is set by RandomStream.get; and holds the random stream state

    this.randomStream = null;
  }
  /**
   * @summary Call inside a method invocation.  Allow subsequent method from this client to begin running in a new fiber.
   * @locus Server
   * @memberOf DDPCommon.MethodInvocation
   * @instance
   */


  unblock() {
    this._calledUnblock = true;

    this._unblock();
  }
  /**
   * @summary Set the logged in user.
   * @locus Server
   * @memberOf DDPCommon.MethodInvocation
   * @instance
   * @param {String | null} userId The value that should be returned by `userId` on this connection.
   */


  setUserId(userId) {
    if (this._calledUnblock) {
      throw new Error("Can't call setUserId in a method after calling unblock");
    }

    this.userId = userId;

    this._setUserId(userId);
  }

};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"random_stream.js":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/ddp-common/random_stream.js                                                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
// RandomStream allows for generation of pseudo-random values, from a seed.
//
// We use this for consistent 'random' numbers across the client and server.
// We want to generate probably-unique IDs on the client, and we ideally want
// the server to generate the same IDs when it executes the method.
//
// For generated values to be the same, we must seed ourselves the same way,
// and we must keep track of the current state of our pseudo-random generators.
// We call this state the scope. By default, we use the current DDP method
// invocation as our scope.  DDP now allows the client to specify a randomSeed.
// If a randomSeed is provided it will be used to seed our random sequences.
// In this way, client and server method calls will generate the same values.
//
// We expose multiple named streams; each stream is independent
// and is seeded differently (but predictably from the name).
// By using multiple streams, we support reordering of requests,
// as long as they occur on different streams.
//
// @param options {Optional Object}
//   seed: Array or value - Seed value(s) for the generator.
//                          If an array, will be used as-is
//                          If a value, will be converted to a single-value array
//                          If omitted, a random array will be used as the seed.
DDPCommon.RandomStream = class RandomStream {
  constructor(options) {
    this.seed = [].concat(options.seed || randomToken());
    this.sequences = Object.create(null);
  } // Get a random sequence with the specified name, creating it if does not exist.
  // New sequences are seeded with the seed concatenated with the name.
  // By passing a seed into Random.create, we use the Alea generator.


  _sequence(name) {
    var self = this;
    var sequence = self.sequences[name] || null;

    if (sequence === null) {
      var sequenceSeed = self.seed.concat(name);

      for (var i = 0; i < sequenceSeed.length; i++) {
        if (typeof sequenceSeed[i] === "function") {
          sequenceSeed[i] = sequenceSeed[i]();
        }
      }

      self.sequences[name] = sequence = Random.createWithSeeds.apply(null, sequenceSeed);
    }

    return sequence;
  }

}; // Returns a random string of sufficient length for a random seed.
// This is a placeholder function; a similar function is planned
// for Random itself; when that is added we should remove this function,
// and call Random's randomToken instead.

function randomToken() {
  return Random.hexString(20);
}

; // Returns the random stream with the specified name, in the specified
// scope. If a scope is passed, then we use that to seed a (not
// cryptographically secure) PRNG using the fast Alea algorithm.  If
// scope is null (or otherwise falsey) then we use a generated seed.
//
// However, scope will normally be the current DDP method invocation,
// so we'll use the stream with the specified name, and we should get
// consistent values on the client and server sides of a method call.

DDPCommon.RandomStream.get = function (scope, name) {
  if (!name) {
    name = "default";
  }

  if (!scope) {
    // There was no scope passed in; the sequence won't actually be
    // reproducible. but make it fast (and not cryptographically
    // secure) anyways, so that the behavior is similar to what you'd
    // get by passing in a scope.
    return Random.insecure;
  }

  var randomStream = scope.randomStream;

  if (!randomStream) {
    scope.randomStream = randomStream = new DDPCommon.RandomStream({
      seed: scope.randomSeed
    });
  }

  return randomStream._sequence(name);
}; // Creates a randomSeed for passing to a method call.
// Note that we take enclosing as an argument,
// though we expect it to be DDP._CurrentMethodInvocation.get()
// However, we often evaluate makeRpcSeed lazily, and thus the relevant
// invocation may not be the one currently in scope.
// If enclosing is null, we'll use Random and values won't be repeatable.


DDPCommon.makeRpcSeed = function (enclosing, methodName) {
  var stream = DDPCommon.RandomStream.get(enclosing, '/rpc/' + methodName);
  return stream.hexString(20);
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

require("/node_modules/meteor/ddp-common/namespace.js");
require("/node_modules/meteor/ddp-common/heartbeat.js");
require("/node_modules/meteor/ddp-common/utils.js");
require("/node_modules/meteor/ddp-common/method_invocation.js");
require("/node_modules/meteor/ddp-common/random_stream.js");

/* Exports */
Package._define("ddp-common", {
  DDPCommon: DDPCommon
});

})();

//# sourceURL=meteor://💻app/packages/ddp-common.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZGRwLWNvbW1vbi9uYW1lc3BhY2UuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2RkcC1jb21tb24vaGVhcnRiZWF0LmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9kZHAtY29tbW9uL3V0aWxzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9kZHAtY29tbW9uL21ldGhvZF9pbnZvY2F0aW9uLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9kZHAtY29tbW9uL3JhbmRvbV9zdHJlYW0uanMiXSwibmFtZXMiOlsiRERQQ29tbW9uIiwiSGVhcnRiZWF0IiwiY29uc3RydWN0b3IiLCJvcHRpb25zIiwiaGVhcnRiZWF0SW50ZXJ2YWwiLCJoZWFydGJlYXRUaW1lb3V0IiwiX3NlbmRQaW5nIiwic2VuZFBpbmciLCJfb25UaW1lb3V0Iiwib25UaW1lb3V0IiwiX3NlZW5QYWNrZXQiLCJfaGVhcnRiZWF0SW50ZXJ2YWxIYW5kbGUiLCJfaGVhcnRiZWF0VGltZW91dEhhbmRsZSIsInN0b3AiLCJfY2xlYXJIZWFydGJlYXRJbnRlcnZhbFRpbWVyIiwiX2NsZWFySGVhcnRiZWF0VGltZW91dFRpbWVyIiwic3RhcnQiLCJfc3RhcnRIZWFydGJlYXRJbnRlcnZhbFRpbWVyIiwiTWV0ZW9yIiwic2V0SW50ZXJ2YWwiLCJfaGVhcnRiZWF0SW50ZXJ2YWxGaXJlZCIsIl9zdGFydEhlYXJ0YmVhdFRpbWVvdXRUaW1lciIsInNldFRpbWVvdXQiLCJfaGVhcnRiZWF0VGltZW91dEZpcmVkIiwiY2xlYXJJbnRlcnZhbCIsImNsZWFyVGltZW91dCIsIm1lc3NhZ2VSZWNlaXZlZCIsIm1vZHVsZSIsImV4cG9ydCIsImhhc093biIsInNsaWNlIiwia2V5cyIsImlzRW1wdHkiLCJsYXN0IiwiT2JqZWN0IiwicHJvdG90eXBlIiwiaGFzT3duUHJvcGVydHkiLCJBcnJheSIsIm9iaiIsImlzQXJyYXkiLCJsZW5ndGgiLCJrZXkiLCJjYWxsIiwiYXJyYXkiLCJuIiwiZ3VhcmQiLCJNYXRoIiwibWF4IiwiU1VQUE9SVEVEX0REUF9WRVJTSU9OUyIsInBhcnNlRERQIiwic3RyaW5nTWVzc2FnZSIsIm1zZyIsIkpTT04iLCJwYXJzZSIsImUiLCJfZGVidWciLCJmaWVsZHMiLCJjbGVhcmVkIiwiZm9yRWFjaCIsImNsZWFyS2V5IiwidW5kZWZpbmVkIiwiZmllbGQiLCJFSlNPTiIsIl9hZGp1c3RUeXBlc0Zyb21KU09OVmFsdWUiLCJzdHJpbmdpZnlERFAiLCJjb3B5IiwiY2xvbmUiLCJ2YWx1ZSIsInB1c2giLCJfYWRqdXN0VHlwZXNUb0pTT05WYWx1ZSIsImlkIiwiRXJyb3IiLCJzdHJpbmdpZnkiLCJNZXRob2RJbnZvY2F0aW9uIiwiaXNTaW11bGF0aW9uIiwiX3VuYmxvY2siLCJ1bmJsb2NrIiwiX2NhbGxlZFVuYmxvY2siLCJ1c2VySWQiLCJfc2V0VXNlcklkIiwic2V0VXNlcklkIiwiY29ubmVjdGlvbiIsInJhbmRvbVNlZWQiLCJyYW5kb21TdHJlYW0iLCJSYW5kb21TdHJlYW0iLCJzZWVkIiwiY29uY2F0IiwicmFuZG9tVG9rZW4iLCJzZXF1ZW5jZXMiLCJjcmVhdGUiLCJfc2VxdWVuY2UiLCJuYW1lIiwic2VsZiIsInNlcXVlbmNlIiwic2VxdWVuY2VTZWVkIiwiaSIsIlJhbmRvbSIsImNyZWF0ZVdpdGhTZWVkcyIsImFwcGx5IiwiaGV4U3RyaW5nIiwiZ2V0Iiwic2NvcGUiLCJpbnNlY3VyZSIsIm1ha2VScGNTZWVkIiwiZW5jbG9zaW5nIiwibWV0aG9kTmFtZSIsInN0cmVhbSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7OztBQVFBQSxTQUFTLEdBQUcsRUFBWixDOzs7Ozs7Ozs7OztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBQSxTQUFTLENBQUNDLFNBQVYsR0FBc0IsTUFBTUEsU0FBTixDQUFnQjtBQUNwQ0MsYUFBVyxDQUFDQyxP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QUFQO0FBQ0QsQ0FIRCxDIiwiZmlsZSI6Ii9wYWNrYWdlcy9kZHAtY29tbW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbmFtZXNwYWNlIEREUENvbW1vblxuICogQHN1bW1hcnkgTmFtZXNwYWNlIGZvciBERFBDb21tb24tcmVsYXRlZCBtZXRob2RzL2NsYXNzZXMuIFNoYXJlZCBiZXR3ZWVuIFxuICogYGRkcC1jbGllbnRgIGFuZCBgZGRwLXNlcnZlcmAsIHdoZXJlIHRoZSBkZHAtY2xpZW50IGlzIHRoZSBpbXBsZW1lbnRhdGlvblxuICogb2YgYSBkZHAgY2xpZW50IGZvciBib3RoIGNsaWVudCBBTkQgc2VydmVyOyBhbmQgdGhlIGRkcCBzZXJ2ZXIgaXMgdGhlXG4gKiBpbXBsZW1lbnRhdGlvbiBvZiB0aGUgbGl2ZWRhdGEgc2VydmVyIGFuZCBzdHJlYW0gc2VydmVyLiBDb21tb24gXG4gKiBmdW5jdGlvbmFsaXR5IHNoYXJlZCBiZXR3ZWVuIGJvdGggY2FuIGJlIHNoYXJlZCB1bmRlciB0aGlzIG5hbWVzcGFjZVxuICovXG5ERFBDb21tb24gPSB7fTtcbiIsIi8vIEhlYXJ0YmVhdCBvcHRpb25zOlxuLy8gICBoZWFydGJlYXRJbnRlcnZhbDogaW50ZXJ2YWwgdG8gc2VuZCBwaW5ncywgaW4gbWlsbGlzZWNvbmRzLlxuLy8gICBoZWFydGJlYXRUaW1lb3V0OiB0aW1lb3V0IHRvIGNsb3NlIHRoZSBjb25uZWN0aW9uIGlmIGEgcmVwbHkgaXNuJ3Rcbi8vICAgICByZWNlaXZlZCwgaW4gbWlsbGlzZWNvbmRzLlxuLy8gICBzZW5kUGluZzogZnVuY3Rpb24gdG8gY2FsbCB0byBzZW5kIGEgcGluZyBvbiB0aGUgY29ubmVjdGlvbi5cbi8vICAgb25UaW1lb3V0OiBmdW5jdGlvbiB0byBjYWxsIHRvIGNsb3NlIHRoZSBjb25uZWN0aW9uLlxuXG5ERFBDb21tb24uSGVhcnRiZWF0ID0gY2xhc3MgSGVhcnRiZWF0IHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHRoaXMuaGVhcnRiZWF0SW50ZXJ2YWwgPSBvcHRpb25zLmhlYXJ0YmVhdEludGVydmFsO1xuICAgIHRoaXMuaGVhcnRiZWF0VGltZW91dCA9IG9wdGlvbnMuaGVhcnRiZWF0VGltZW91dDtcbiAgICB0aGlzLl9zZW5kUGluZyA9IG9wdGlvbnMuc2VuZFBpbmc7XG4gICAgdGhpcy5fb25UaW1lb3V0ID0gb3B0aW9ucy5vblRpbWVvdXQ7XG4gICAgdGhpcy5fc2VlblBhY2tldCA9IGZhbHNlO1xuXG4gICAgdGhpcy5faGVhcnRiZWF0SW50ZXJ2YWxIYW5kbGUgPSBudWxsO1xuICAgIHRoaXMuX2hlYXJ0YmVhdFRpbWVvdXRIYW5kbGUgPSBudWxsO1xuICB9XG5cbiAgc3RvcCgpIHtcbiAgICB0aGlzLl9jbGVhckhlYXJ0YmVhdEludGVydmFsVGltZXIoKTtcbiAgICB0aGlzLl9jbGVhckhlYXJ0YmVhdFRpbWVvdXRUaW1lcigpO1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgdGhpcy5zdG9wKCk7XG4gICAgdGhpcy5fc3RhcnRIZWFydGJlYXRJbnRlcnZhbFRpbWVyKCk7XG4gIH1cblxuICBfc3RhcnRIZWFydGJlYXRJbnRlcnZhbFRpbWVyKCkge1xuICAgIHRoaXMuX2hlYXJ0YmVhdEludGVydmFsSGFuZGxlID0gTWV0ZW9yLnNldEludGVydmFsKFxuICAgICAgKCkgPT4gdGhpcy5faGVhcnRiZWF0SW50ZXJ2YWxGaXJlZCgpLFxuICAgICAgdGhpcy5oZWFydGJlYXRJbnRlcnZhbFxuICAgICk7XG4gIH1cblxuICBfc3RhcnRIZWFydGJlYXRUaW1lb3V0VGltZXIoKSB7XG4gICAgdGhpcy5faGVhcnRiZWF0VGltZW91dEhhbmRsZSA9IE1ldGVvci5zZXRUaW1lb3V0KFxuICAgICAgKCkgPT4gdGhpcy5faGVhcnRiZWF0VGltZW91dEZpcmVkKCksXG4gICAgICB0aGlzLmhlYXJ0YmVhdFRpbWVvdXRcbiAgICApO1xuICB9XG5cbiAgX2NsZWFySGVhcnRiZWF0SW50ZXJ2YWxUaW1lcigpIHtcbiAgICBpZiAodGhpcy5faGVhcnRiZWF0SW50ZXJ2YWxIYW5kbGUpIHtcbiAgICAgIE1ldGVvci5jbGVhckludGVydmFsKHRoaXMuX2hlYXJ0YmVhdEludGVydmFsSGFuZGxlKTtcbiAgICAgIHRoaXMuX2hlYXJ0YmVhdEludGVydmFsSGFuZGxlID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBfY2xlYXJIZWFydGJlYXRUaW1lb3V0VGltZXIoKSB7XG4gICAgaWYgKHRoaXMuX2hlYXJ0YmVhdFRpbWVvdXRIYW5kbGUpIHtcbiAgICAgIE1ldGVvci5jbGVhclRpbWVvdXQodGhpcy5faGVhcnRiZWF0VGltZW91dEhhbmRsZSk7XG4gICAgICB0aGlzLl9oZWFydGJlYXRUaW1lb3V0SGFuZGxlID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICAvLyBUaGUgaGVhcnRiZWF0IGludGVydmFsIHRpbWVyIGlzIGZpcmVkIHdoZW4gd2Ugc2hvdWxkIHNlbmQgYSBwaW5nLlxuICBfaGVhcnRiZWF0SW50ZXJ2YWxGaXJlZCgpIHtcbiAgICAvLyBkb24ndCBzZW5kIHBpbmcgaWYgd2UndmUgc2VlbiBhIHBhY2tldCBzaW5jZSB3ZSBsYXN0IGNoZWNrZWQsXG4gICAgLy8gKm9yKiBpZiB3ZSBoYXZlIGFscmVhZHkgc2VudCBhIHBpbmcgYW5kIGFyZSBhd2FpdGluZyBhIHRpbWVvdXQuXG4gICAgLy8gVGhhdCBzaG91bGRuJ3QgaGFwcGVuLCBidXQgaXQncyBwb3NzaWJsZSBpZlxuICAgIC8vIGB0aGlzLmhlYXJ0YmVhdEludGVydmFsYCBpcyBzbWFsbGVyIHRoYW5cbiAgICAvLyBgdGhpcy5oZWFydGJlYXRUaW1lb3V0YC5cbiAgICBpZiAoISB0aGlzLl9zZWVuUGFja2V0ICYmICEgdGhpcy5faGVhcnRiZWF0VGltZW91dEhhbmRsZSkge1xuICAgICAgdGhpcy5fc2VuZFBpbmcoKTtcbiAgICAgIC8vIFNldCB1cCB0aW1lb3V0LCBpbiBjYXNlIGEgcG9uZyBkb2Vzbid0IGFycml2ZSBpbiB0aW1lLlxuICAgICAgdGhpcy5fc3RhcnRIZWFydGJlYXRUaW1lb3V0VGltZXIoKTtcbiAgICB9XG4gICAgdGhpcy5fc2VlblBhY2tldCA9IGZhbHNlO1xuICB9XG5cbiAgLy8gVGhlIGhlYXJ0YmVhdCB0aW1lb3V0IHRpbWVyIGlzIGZpcmVkIHdoZW4gd2Ugc2VudCBhIHBpbmcsIGJ1dCB3ZVxuICAvLyB0aW1lZCBvdXQgd2FpdGluZyBmb3IgdGhlIHBvbmcuXG4gIF9oZWFydGJlYXRUaW1lb3V0RmlyZWQoKSB7XG4gICAgdGhpcy5faGVhcnRiZWF0VGltZW91dEhhbmRsZSA9IG51bGw7XG4gICAgdGhpcy5fb25UaW1lb3V0KCk7XG4gIH1cblxuICBtZXNzYWdlUmVjZWl2ZWQoKSB7XG4gICAgLy8gVGVsbCBwZXJpb2RpYyBjaGVja2luIHRoYXQgd2UgaGF2ZSBzZWVuIGEgcGFja2V0LCBhbmQgdGh1cyBpdFxuICAgIC8vIGRvZXMgbm90IG5lZWQgdG8gc2VuZCBhIHBpbmcgdGhpcyBjeWNsZS5cbiAgICB0aGlzLl9zZWVuUGFja2V0ID0gdHJ1ZTtcbiAgICAvLyBJZiB3ZSB3ZXJlIHdhaXRpbmcgZm9yIGEgcG9uZywgd2UgZ290IGl0LlxuICAgIGlmICh0aGlzLl9oZWFydGJlYXRUaW1lb3V0SGFuZGxlKSB7XG4gICAgICB0aGlzLl9jbGVhckhlYXJ0YmVhdFRpbWVvdXRUaW1lcigpO1xuICAgIH1cbiAgfVxufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnQgY29uc3QgaGFzT3duID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbmV4cG9ydCBjb25zdCBzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcblxuZXhwb3J0IGZ1bmN0aW9uIGtleXMob2JqKSB7XG4gIHJldHVybiBPYmplY3Qua2V5cyhPYmplY3Qob2JqKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0VtcHR5KG9iaikge1xuICBpZiAob2JqID09IG51bGwpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGlmIChBcnJheS5pc0FycmF5KG9iaikgfHxcbiAgICAgIHR5cGVvZiBvYmogPT09IFwic3RyaW5nXCIpIHtcbiAgICByZXR1cm4gb2JqLmxlbmd0aCA9PT0gMDtcbiAgfVxuXG4gIGZvciAoY29uc3Qga2V5IGluIG9iaikge1xuICAgIGlmIChoYXNPd24uY2FsbChvYmosIGtleSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxhc3QoYXJyYXksIG4sIGd1YXJkKSB7XG4gIGlmIChhcnJheSA9PSBudWxsKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKChuID09IG51bGwpIHx8IGd1YXJkKSB7XG4gICAgcmV0dXJuIGFycmF5W2FycmF5Lmxlbmd0aCAtIDFdO1xuICB9XG5cbiAgcmV0dXJuIHNsaWNlLmNhbGwoYXJyYXksIE1hdGgubWF4KGFycmF5Lmxlbmd0aCAtIG4sIDApKTtcbn1cblxuRERQQ29tbW9uLlNVUFBPUlRFRF9ERFBfVkVSU0lPTlMgPSBbICcxJywgJ3ByZTInLCAncHJlMScgXTtcblxuRERQQ29tbW9uLnBhcnNlRERQID0gZnVuY3Rpb24gKHN0cmluZ01lc3NhZ2UpIHtcbiAgdHJ5IHtcbiAgICB2YXIgbXNnID0gSlNPTi5wYXJzZShzdHJpbmdNZXNzYWdlKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIE1ldGVvci5fZGVidWcoXCJEaXNjYXJkaW5nIG1lc3NhZ2Ugd2l0aCBpbnZhbGlkIEpTT05cIiwgc3RyaW5nTWVzc2FnZSk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgLy8gRERQIG1lc3NhZ2VzIG11c3QgYmUgb2JqZWN0cy5cbiAgaWYgKG1zZyA9PT0gbnVsbCB8fCB0eXBlb2YgbXNnICE9PSAnb2JqZWN0Jykge1xuICAgIE1ldGVvci5fZGVidWcoXCJEaXNjYXJkaW5nIG5vbi1vYmplY3QgRERQIG1lc3NhZ2VcIiwgc3RyaW5nTWVzc2FnZSk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvLyBtYXNzYWdlIG1zZyB0byBnZXQgaXQgaW50byBcImFic3RyYWN0IGRkcFwiIHJhdGhlciB0aGFuIFwid2lyZSBkZHBcIiBmb3JtYXQuXG5cbiAgLy8gc3dpdGNoIGJldHdlZW4gXCJjbGVhcmVkXCIgcmVwIG9mIHVuc2V0dGluZyBmaWVsZHMgYW5kIFwidW5kZWZpbmVkXCJcbiAgLy8gcmVwIG9mIHNhbWVcbiAgaWYgKGhhc093bi5jYWxsKG1zZywgJ2NsZWFyZWQnKSkge1xuICAgIGlmICghIGhhc093bi5jYWxsKG1zZywgJ2ZpZWxkcycpKSB7XG4gICAgICBtc2cuZmllbGRzID0ge307XG4gICAgfVxuICAgIG1zZy5jbGVhcmVkLmZvckVhY2goY2xlYXJLZXkgPT4ge1xuICAgICAgbXNnLmZpZWxkc1tjbGVhcktleV0gPSB1bmRlZmluZWQ7XG4gICAgfSk7XG4gICAgZGVsZXRlIG1zZy5jbGVhcmVkO1xuICB9XG5cbiAgWydmaWVsZHMnLCAncGFyYW1zJywgJ3Jlc3VsdCddLmZvckVhY2goZmllbGQgPT4ge1xuICAgIGlmIChoYXNPd24uY2FsbChtc2csIGZpZWxkKSkge1xuICAgICAgbXNnW2ZpZWxkXSA9IEVKU09OLl9hZGp1c3RUeXBlc0Zyb21KU09OVmFsdWUobXNnW2ZpZWxkXSk7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gbXNnO1xufTtcblxuRERQQ29tbW9uLnN0cmluZ2lmeUREUCA9IGZ1bmN0aW9uIChtc2cpIHtcbiAgY29uc3QgY29weSA9IEVKU09OLmNsb25lKG1zZyk7XG5cbiAgLy8gc3dpenpsZSAnY2hhbmdlZCcgbWVzc2FnZXMgZnJvbSAnZmllbGRzIHVuZGVmaW5lZCcgcmVwIHRvICdmaWVsZHNcbiAgLy8gYW5kIGNsZWFyZWQnIHJlcFxuICBpZiAoaGFzT3duLmNhbGwobXNnLCAnZmllbGRzJykpIHtcbiAgICBjb25zdCBjbGVhcmVkID0gW107XG5cbiAgICBPYmplY3Qua2V5cyhtc2cuZmllbGRzKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICBjb25zdCB2YWx1ZSA9IG1zZy5maWVsZHNba2V5XTtcblxuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBjbGVhcmVkLnB1c2goa2V5KTtcbiAgICAgICAgZGVsZXRlIGNvcHkuZmllbGRzW2tleV07XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAoISBpc0VtcHR5KGNsZWFyZWQpKSB7XG4gICAgICBjb3B5LmNsZWFyZWQgPSBjbGVhcmVkO1xuICAgIH1cblxuICAgIGlmIChpc0VtcHR5KGNvcHkuZmllbGRzKSkge1xuICAgICAgZGVsZXRlIGNvcHkuZmllbGRzO1xuICAgIH1cbiAgfVxuXG4gIC8vIGFkanVzdCB0eXBlcyB0byBiYXNpY1xuICBbJ2ZpZWxkcycsICdwYXJhbXMnLCAncmVzdWx0J10uZm9yRWFjaChmaWVsZCA9PiB7XG4gICAgaWYgKGhhc093bi5jYWxsKGNvcHksIGZpZWxkKSkge1xuICAgICAgY29weVtmaWVsZF0gPSBFSlNPTi5fYWRqdXN0VHlwZXNUb0pTT05WYWx1ZShjb3B5W2ZpZWxkXSk7XG4gICAgfVxuICB9KTtcblxuICBpZiAobXNnLmlkICYmIHR5cGVvZiBtc2cuaWQgIT09ICdzdHJpbmcnKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiTWVzc2FnZSBpZCBpcyBub3QgYSBzdHJpbmdcIik7XG4gIH1cblxuICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoY29weSk7XG59O1xuIiwiLy8gSW5zdGFuY2UgbmFtZSBpcyB0aGlzIGJlY2F1c2UgaXQgaXMgdXN1YWxseSByZWZlcnJlZCB0byBhcyB0aGlzIGluc2lkZSBhXG4vLyBtZXRob2QgZGVmaW5pdGlvblxuLyoqXG4gKiBAc3VtbWFyeSBUaGUgc3RhdGUgZm9yIGEgc2luZ2xlIGludm9jYXRpb24gb2YgYSBtZXRob2QsIHJlZmVyZW5jZWQgYnkgdGhpc1xuICogaW5zaWRlIGEgbWV0aG9kIGRlZmluaXRpb24uXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQGluc3RhbmNlTmFtZSB0aGlzXG4gKiBAc2hvd0luc3RhbmNlTmFtZSB0cnVlXG4gKi9cbkREUENvbW1vbi5NZXRob2RJbnZvY2F0aW9uID0gY2xhc3MgTWV0aG9kSW52b2NhdGlvbiB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICAvLyB0cnVlIGlmIHdlJ3JlIHJ1bm5pbmcgbm90IHRoZSBhY3R1YWwgbWV0aG9kLCBidXQgYSBzdHViICh0aGF0IGlzLFxuICAgIC8vIGlmIHdlJ3JlIG9uIGEgY2xpZW50ICh3aGljaCBtYXkgYmUgYSBicm93c2VyLCBvciBpbiB0aGUgZnV0dXJlIGFcbiAgICAvLyBzZXJ2ZXIgY29ubmVjdGluZyB0byBhbm90aGVyIHNlcnZlcikgYW5kIHByZXNlbnRseSBydW5uaW5nIGFcbiAgICAvLyBzaW11bGF0aW9uIG9mIGEgc2VydmVyLXNpZGUgbWV0aG9kIGZvciBsYXRlbmN5IGNvbXBlbnNhdGlvblxuICAgIC8vIHB1cnBvc2VzKS4gbm90IGN1cnJlbnRseSB0cnVlIGV4Y2VwdCBpbiBhIGNsaWVudCBzdWNoIGFzIGEgYnJvd3NlcixcbiAgICAvLyBzaW5jZSB0aGVyZSdzIHVzdWFsbHkgbm8gcG9pbnQgaW4gcnVubmluZyBzdHVicyB1bmxlc3MgeW91IGhhdmUgYVxuICAgIC8vIHplcm8tbGF0ZW5jeSBjb25uZWN0aW9uIHRvIHRoZSB1c2VyLlxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgQWNjZXNzIGluc2lkZSBhIG1ldGhvZCBpbnZvY2F0aW9uLiAgQm9vbGVhbiB2YWx1ZSwgdHJ1ZSBpZiB0aGlzIGludm9jYXRpb24gaXMgYSBzdHViLlxuICAgICAqIEBsb2N1cyBBbnl3aGVyZVxuICAgICAqIEBuYW1lICBpc1NpbXVsYXRpb25cbiAgICAgKiBAbWVtYmVyT2YgRERQQ29tbW9uLk1ldGhvZEludm9jYXRpb25cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICB0aGlzLmlzU2ltdWxhdGlvbiA9IG9wdGlvbnMuaXNTaW11bGF0aW9uO1xuXG4gICAgLy8gY2FsbCB0aGlzIGZ1bmN0aW9uIHRvIGFsbG93IG90aGVyIG1ldGhvZCBpbnZvY2F0aW9ucyAoZnJvbSB0aGVcbiAgICAvLyBzYW1lIGNsaWVudCkgdG8gY29udGludWUgcnVubmluZyB3aXRob3V0IHdhaXRpbmcgZm9yIHRoaXMgb25lIHRvXG4gICAgLy8gY29tcGxldGUuXG4gICAgdGhpcy5fdW5ibG9jayA9IG9wdGlvbnMudW5ibG9jayB8fCBmdW5jdGlvbiAoKSB7fTtcbiAgICB0aGlzLl9jYWxsZWRVbmJsb2NrID0gZmFsc2U7XG5cbiAgICAvLyBjdXJyZW50IHVzZXIgaWRcblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFRoZSBpZCBvZiB0aGUgdXNlciB0aGF0IG1hZGUgdGhpcyBtZXRob2QgY2FsbCwgb3IgYG51bGxgIGlmIG5vIHVzZXIgd2FzIGxvZ2dlZCBpbi5cbiAgICAgKiBAbG9jdXMgQW55d2hlcmVcbiAgICAgKiBAbmFtZSAgdXNlcklkXG4gICAgICogQG1lbWJlck9mIEREUENvbW1vbi5NZXRob2RJbnZvY2F0aW9uXG4gICAgICogQGluc3RhbmNlXG4gICAgICovXG4gICAgdGhpcy51c2VySWQgPSBvcHRpb25zLnVzZXJJZDtcblxuICAgIC8vIHNldHMgY3VycmVudCB1c2VyIGlkIGluIGFsbCBhcHByb3ByaWF0ZSBzZXJ2ZXIgY29udGV4dHMgYW5kXG4gICAgLy8gcmVydW5zIHN1YnNjcmlwdGlvbnNcbiAgICB0aGlzLl9zZXRVc2VySWQgPSBvcHRpb25zLnNldFVzZXJJZCB8fCBmdW5jdGlvbiAoKSB7fTtcblxuICAgIC8vIE9uIHRoZSBzZXJ2ZXIsIHRoZSBjb25uZWN0aW9uIHRoaXMgbWV0aG9kIGNhbGwgY2FtZSBpbiBvbi5cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IEFjY2VzcyBpbnNpZGUgYSBtZXRob2QgaW52b2NhdGlvbi4gVGhlIFtjb25uZWN0aW9uXSgjbWV0ZW9yX29uY29ubmVjdGlvbikgdGhhdCB0aGlzIG1ldGhvZCB3YXMgcmVjZWl2ZWQgb24uIGBudWxsYCBpZiB0aGUgbWV0aG9kIGlzIG5vdCBhc3NvY2lhdGVkIHdpdGggYSBjb25uZWN0aW9uLCBlZy4gYSBzZXJ2ZXIgaW5pdGlhdGVkIG1ldGhvZCBjYWxsLiBDYWxscyB0byBtZXRob2RzIG1hZGUgZnJvbSBhIHNlcnZlciBtZXRob2Qgd2hpY2ggd2FzIGluIHR1cm4gaW5pdGlhdGVkIGZyb20gdGhlIGNsaWVudCBzaGFyZSB0aGUgc2FtZSBgY29ubmVjdGlvbmAuXG4gICAgICogQGxvY3VzIFNlcnZlclxuICAgICAqIEBuYW1lICBjb25uZWN0aW9uXG4gICAgICogQG1lbWJlck9mIEREUENvbW1vbi5NZXRob2RJbnZvY2F0aW9uXG4gICAgICogQGluc3RhbmNlXG4gICAgICovXG4gICAgdGhpcy5jb25uZWN0aW9uID0gb3B0aW9ucy5jb25uZWN0aW9uO1xuXG4gICAgLy8gVGhlIHNlZWQgZm9yIHJhbmRvbVN0cmVhbSB2YWx1ZSBnZW5lcmF0aW9uXG4gICAgdGhpcy5yYW5kb21TZWVkID0gb3B0aW9ucy5yYW5kb21TZWVkO1xuXG4gICAgLy8gVGhpcyBpcyBzZXQgYnkgUmFuZG9tU3RyZWFtLmdldDsgYW5kIGhvbGRzIHRoZSByYW5kb20gc3RyZWFtIHN0YXRlXG4gICAgdGhpcy5yYW5kb21TdHJlYW0gPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEBzdW1tYXJ5IENhbGwgaW5zaWRlIGEgbWV0aG9kIGludm9jYXRpb24uICBBbGxvdyBzdWJzZXF1ZW50IG1ldGhvZCBmcm9tIHRoaXMgY2xpZW50IHRvIGJlZ2luIHJ1bm5pbmcgaW4gYSBuZXcgZmliZXIuXG4gICAqIEBsb2N1cyBTZXJ2ZXJcbiAgICogQG1lbWJlck9mIEREUENvbW1vbi5NZXRob2RJbnZvY2F0aW9uXG4gICAqIEBpbnN0YW5jZVxuICAgKi9cbiAgdW5ibG9jaygpIHtcbiAgICB0aGlzLl9jYWxsZWRVbmJsb2NrID0gdHJ1ZTtcbiAgICB0aGlzLl91bmJsb2NrKCk7XG4gIH1cblxuICAvKipcbiAgICogQHN1bW1hcnkgU2V0IHRoZSBsb2dnZWQgaW4gdXNlci5cbiAgICogQGxvY3VzIFNlcnZlclxuICAgKiBAbWVtYmVyT2YgRERQQ29tbW9uLk1ldGhvZEludm9jYXRpb25cbiAgICogQGluc3RhbmNlXG4gICAqIEBwYXJhbSB7U3RyaW5nIHwgbnVsbH0gdXNlcklkIFRoZSB2YWx1ZSB0aGF0IHNob3VsZCBiZSByZXR1cm5lZCBieSBgdXNlcklkYCBvbiB0aGlzIGNvbm5lY3Rpb24uXG4gICAqL1xuICBzZXRVc2VySWQodXNlcklkKSB7XG4gICAgaWYgKHRoaXMuX2NhbGxlZFVuYmxvY2spIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbid0IGNhbGwgc2V0VXNlcklkIGluIGEgbWV0aG9kIGFmdGVyIGNhbGxpbmcgdW5ibG9ja1wiKTtcbiAgICB9XG4gICAgdGhpcy51c2VySWQgPSB1c2VySWQ7XG4gICAgdGhpcy5fc2V0VXNlcklkKHVzZXJJZCk7XG4gIH1cbn07XG4iLCIvLyBSYW5kb21TdHJlYW0gYWxsb3dzIGZvciBnZW5lcmF0aW9uIG9mIHBzZXVkby1yYW5kb20gdmFsdWVzLCBmcm9tIGEgc2VlZC5cbi8vXG4vLyBXZSB1c2UgdGhpcyBmb3IgY29uc2lzdGVudCAncmFuZG9tJyBudW1iZXJzIGFjcm9zcyB0aGUgY2xpZW50IGFuZCBzZXJ2ZXIuXG4vLyBXZSB3YW50IHRvIGdlbmVyYXRlIHByb2JhYmx5LXVuaXF1ZSBJRHMgb24gdGhlIGNsaWVudCwgYW5kIHdlIGlkZWFsbHkgd2FudFxuLy8gdGhlIHNlcnZlciB0byBnZW5lcmF0ZSB0aGUgc2FtZSBJRHMgd2hlbiBpdCBleGVjdXRlcyB0aGUgbWV0aG9kLlxuLy9cbi8vIEZvciBnZW5lcmF0ZWQgdmFsdWVzIHRvIGJlIHRoZSBzYW1lLCB3ZSBtdXN0IHNlZWQgb3Vyc2VsdmVzIHRoZSBzYW1lIHdheSxcbi8vIGFuZCB3ZSBtdXN0IGtlZXAgdHJhY2sgb2YgdGhlIGN1cnJlbnQgc3RhdGUgb2Ygb3VyIHBzZXVkby1yYW5kb20gZ2VuZXJhdG9ycy5cbi8vIFdlIGNhbGwgdGhpcyBzdGF0ZSB0aGUgc2NvcGUuIEJ5IGRlZmF1bHQsIHdlIHVzZSB0aGUgY3VycmVudCBERFAgbWV0aG9kXG4vLyBpbnZvY2F0aW9uIGFzIG91ciBzY29wZS4gIEREUCBub3cgYWxsb3dzIHRoZSBjbGllbnQgdG8gc3BlY2lmeSBhIHJhbmRvbVNlZWQuXG4vLyBJZiBhIHJhbmRvbVNlZWQgaXMgcHJvdmlkZWQgaXQgd2lsbCBiZSB1c2VkIHRvIHNlZWQgb3VyIHJhbmRvbSBzZXF1ZW5jZXMuXG4vLyBJbiB0aGlzIHdheSwgY2xpZW50IGFuZCBzZXJ2ZXIgbWV0aG9kIGNhbGxzIHdpbGwgZ2VuZXJhdGUgdGhlIHNhbWUgdmFsdWVzLlxuLy9cbi8vIFdlIGV4cG9zZSBtdWx0aXBsZSBuYW1lZCBzdHJlYW1zOyBlYWNoIHN0cmVhbSBpcyBpbmRlcGVuZGVudFxuLy8gYW5kIGlzIHNlZWRlZCBkaWZmZXJlbnRseSAoYnV0IHByZWRpY3RhYmx5IGZyb20gdGhlIG5hbWUpLlxuLy8gQnkgdXNpbmcgbXVsdGlwbGUgc3RyZWFtcywgd2Ugc3VwcG9ydCByZW9yZGVyaW5nIG9mIHJlcXVlc3RzLFxuLy8gYXMgbG9uZyBhcyB0aGV5IG9jY3VyIG9uIGRpZmZlcmVudCBzdHJlYW1zLlxuLy9cbi8vIEBwYXJhbSBvcHRpb25zIHtPcHRpb25hbCBPYmplY3R9XG4vLyAgIHNlZWQ6IEFycmF5IG9yIHZhbHVlIC0gU2VlZCB2YWx1ZShzKSBmb3IgdGhlIGdlbmVyYXRvci5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgICBJZiBhbiBhcnJheSwgd2lsbCBiZSB1c2VkIGFzLWlzXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgSWYgYSB2YWx1ZSwgd2lsbCBiZSBjb252ZXJ0ZWQgdG8gYSBzaW5nbGUtdmFsdWUgYXJyYXlcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICBJZiBvbWl0dGVkLCBhIHJhbmRvbSBhcnJheSB3aWxsIGJlIHVzZWQgYXMgdGhlIHNlZWQuXG5ERFBDb21tb24uUmFuZG9tU3RyZWFtID0gY2xhc3MgUmFuZG9tU3RyZWFtIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHRoaXMuc2VlZCA9IFtdLmNvbmNhdChvcHRpb25zLnNlZWQgfHwgcmFuZG9tVG9rZW4oKSk7XG4gICAgdGhpcy5zZXF1ZW5jZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICB9XG5cbiAgLy8gR2V0IGEgcmFuZG9tIHNlcXVlbmNlIHdpdGggdGhlIHNwZWNpZmllZCBuYW1lLCBjcmVhdGluZyBpdCBpZiBkb2VzIG5vdCBleGlzdC5cbiAgLy8gTmV3IHNlcXVlbmNlcyBhcmUgc2VlZGVkIHdpdGggdGhlIHNlZWQgY29uY2F0ZW5hdGVkIHdpdGggdGhlIG5hbWUuXG4gIC8vIEJ5IHBhc3NpbmcgYSBzZWVkIGludG8gUmFuZG9tLmNyZWF0ZSwgd2UgdXNlIHRoZSBBbGVhIGdlbmVyYXRvci5cbiAgX3NlcXVlbmNlKG5hbWUpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICB2YXIgc2VxdWVuY2UgPSBzZWxmLnNlcXVlbmNlc1tuYW1lXSB8fCBudWxsO1xuICAgIGlmIChzZXF1ZW5jZSA9PT0gbnVsbCkge1xuICAgICAgdmFyIHNlcXVlbmNlU2VlZCA9IHNlbGYuc2VlZC5jb25jYXQobmFtZSk7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNlcXVlbmNlU2VlZC5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAodHlwZW9mIHNlcXVlbmNlU2VlZFtpXSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgc2VxdWVuY2VTZWVkW2ldID0gc2VxdWVuY2VTZWVkW2ldKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHNlbGYuc2VxdWVuY2VzW25hbWVdID0gc2VxdWVuY2UgPSBSYW5kb20uY3JlYXRlV2l0aFNlZWRzLmFwcGx5KG51bGwsIHNlcXVlbmNlU2VlZCk7XG4gICAgfVxuICAgIHJldHVybiBzZXF1ZW5jZTtcbiAgfVxufTtcblxuLy8gUmV0dXJucyBhIHJhbmRvbSBzdHJpbmcgb2Ygc3VmZmljaWVudCBsZW5ndGggZm9yIGEgcmFuZG9tIHNlZWQuXG4vLyBUaGlzIGlzIGEgcGxhY2Vob2xkZXIgZnVuY3Rpb247IGEgc2ltaWxhciBmdW5jdGlvbiBpcyBwbGFubmVkXG4vLyBmb3IgUmFuZG9tIGl0c2VsZjsgd2hlbiB0aGF0IGlzIGFkZGVkIHdlIHNob3VsZCByZW1vdmUgdGhpcyBmdW5jdGlvbixcbi8vIGFuZCBjYWxsIFJhbmRvbSdzIHJhbmRvbVRva2VuIGluc3RlYWQuXG5mdW5jdGlvbiByYW5kb21Ub2tlbigpIHtcbiAgcmV0dXJuIFJhbmRvbS5oZXhTdHJpbmcoMjApO1xufTtcblxuLy8gUmV0dXJucyB0aGUgcmFuZG9tIHN0cmVhbSB3aXRoIHRoZSBzcGVjaWZpZWQgbmFtZSwgaW4gdGhlIHNwZWNpZmllZFxuLy8gc2NvcGUuIElmIGEgc2NvcGUgaXMgcGFzc2VkLCB0aGVuIHdlIHVzZSB0aGF0IHRvIHNlZWQgYSAobm90XG4vLyBjcnlwdG9ncmFwaGljYWxseSBzZWN1cmUpIFBSTkcgdXNpbmcgdGhlIGZhc3QgQWxlYSBhbGdvcml0aG0uICBJZlxuLy8gc2NvcGUgaXMgbnVsbCAob3Igb3RoZXJ3aXNlIGZhbHNleSkgdGhlbiB3ZSB1c2UgYSBnZW5lcmF0ZWQgc2VlZC5cbi8vXG4vLyBIb3dldmVyLCBzY29wZSB3aWxsIG5vcm1hbGx5IGJlIHRoZSBjdXJyZW50IEREUCBtZXRob2QgaW52b2NhdGlvbixcbi8vIHNvIHdlJ2xsIHVzZSB0aGUgc3RyZWFtIHdpdGggdGhlIHNwZWNpZmllZCBuYW1lLCBhbmQgd2Ugc2hvdWxkIGdldFxuLy8gY29uc2lzdGVudCB2YWx1ZXMgb24gdGhlIGNsaWVudCBhbmQgc2VydmVyIHNpZGVzIG9mIGEgbWV0aG9kIGNhbGwuXG5ERFBDb21tb24uUmFuZG9tU3RyZWFtLmdldCA9IGZ1bmN0aW9uIChzY29wZSwgbmFtZSkge1xuICBpZiAoIW5hbWUpIHtcbiAgICBuYW1lID0gXCJkZWZhdWx0XCI7XG4gIH1cbiAgaWYgKCFzY29wZSkge1xuICAgIC8vIFRoZXJlIHdhcyBubyBzY29wZSBwYXNzZWQgaW47IHRoZSBzZXF1ZW5jZSB3b24ndCBhY3R1YWxseSBiZVxuICAgIC8vIHJlcHJvZHVjaWJsZS4gYnV0IG1ha2UgaXQgZmFzdCAoYW5kIG5vdCBjcnlwdG9ncmFwaGljYWxseVxuICAgIC8vIHNlY3VyZSkgYW55d2F5cywgc28gdGhhdCB0aGUgYmVoYXZpb3IgaXMgc2ltaWxhciB0byB3aGF0IHlvdSdkXG4gICAgLy8gZ2V0IGJ5IHBhc3NpbmcgaW4gYSBzY29wZS5cbiAgICByZXR1cm4gUmFuZG9tLmluc2VjdXJlO1xuICB9XG4gIHZhciByYW5kb21TdHJlYW0gPSBzY29wZS5yYW5kb21TdHJlYW07XG4gIGlmICghcmFuZG9tU3RyZWFtKSB7XG4gICAgc2NvcGUucmFuZG9tU3RyZWFtID0gcmFuZG9tU3RyZWFtID0gbmV3IEREUENvbW1vbi5SYW5kb21TdHJlYW0oe1xuICAgICAgc2VlZDogc2NvcGUucmFuZG9tU2VlZFxuICAgIH0pO1xuICB9XG4gIHJldHVybiByYW5kb21TdHJlYW0uX3NlcXVlbmNlKG5hbWUpO1xufTtcblxuLy8gQ3JlYXRlcyBhIHJhbmRvbVNlZWQgZm9yIHBhc3NpbmcgdG8gYSBtZXRob2QgY2FsbC5cbi8vIE5vdGUgdGhhdCB3ZSB0YWtlIGVuY2xvc2luZyBhcyBhbiBhcmd1bWVudCxcbi8vIHRob3VnaCB3ZSBleHBlY3QgaXQgdG8gYmUgRERQLl9DdXJyZW50TWV0aG9kSW52b2NhdGlvbi5nZXQoKVxuLy8gSG93ZXZlciwgd2Ugb2Z0ZW4gZXZhbHVhdGUgbWFrZVJwY1NlZWQgbGF6aWx5LCBhbmQgdGh1cyB0aGUgcmVsZXZhbnRcbi8vIGludm9jYXRpb24gbWF5IG5vdCBiZSB0aGUgb25lIGN1cnJlbnRseSBpbiBzY29wZS5cbi8vIElmIGVuY2xvc2luZyBpcyBudWxsLCB3ZSdsbCB1c2UgUmFuZG9tIGFuZCB2YWx1ZXMgd29uJ3QgYmUgcmVwZWF0YWJsZS5cbkREUENvbW1vbi5tYWtlUnBjU2VlZCA9IGZ1bmN0aW9uIChlbmNsb3NpbmcsIG1ldGhvZE5hbWUpIHtcbiAgdmFyIHN0cmVhbSA9IEREUENvbW1vbi5SYW5kb21TdHJlYW0uZ2V0KGVuY2xvc2luZywgJy9ycGMvJyArIG1ldGhvZE5hbWUpO1xuICByZXR1cm4gc3RyZWFtLmhleFN0cmluZygyMCk7XG59O1xuIl19
