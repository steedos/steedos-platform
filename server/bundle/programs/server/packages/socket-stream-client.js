(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var Retry = Package.retry.Retry;
var meteorInstall = Package.modules.meteorInstall;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var options;

var require = meteorInstall({"node_modules":{"meteor":{"socket-stream-client":{"server.js":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/socket-stream-client/server.js                                                                        //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
!function (module1) {
  let setMinimumBrowserVersions;
  module1.link("meteor/modern-browsers", {
    setMinimumBrowserVersions(v) {
      setMinimumBrowserVersions = v;
    }

  }, 0);
  setMinimumBrowserVersions({
    chrome: 16,
    edge: 12,
    firefox: 11,
    ie: 10,
    mobileSafari: [6, 1],
    phantomjs: 2,
    safari: 7,
    electron: [0, 20]
  }, module.id);
}.call(this, module);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"node.js":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/socket-stream-client/node.js                                                                          //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
!function (module1) {
  module1.export({
    ClientStream: () => ClientStream
  });
  let Meteor;
  module1.link("meteor/meteor", {
    Meteor(v) {
      Meteor = v;
    }

  }, 0);
  let toWebsocketUrl;
  module1.link("./urls.js", {
    toWebsocketUrl(v) {
      toWebsocketUrl = v;
    }

  }, 1);
  let StreamClientCommon;
  module1.link("./common.js", {
    StreamClientCommon(v) {
      StreamClientCommon = v;
    }

  }, 2);

  class ClientStream extends StreamClientCommon {
    constructor(endpoint, options) {
      super(options);
      this.client = null; // created in _launchConnection

      this.endpoint = endpoint;
      this.headers = this.options.headers || Object.create(null);
      this.npmFayeOptions = this.options.npmFayeOptions || Object.create(null);

      this._initCommon(this.options); //// Kickoff!


      this._launchConnection();
    } // data is a utf8 string. Data sent while not connected is dropped on
    // the floor, and it is up the user of this API to retransmit lost
    // messages on 'reset'


    send(data) {
      if (this.currentStatus.connected) {
        this.client.send(data);
      }
    } // Changes where this connection points


    _changeUrl(url) {
      this.endpoint = url;
    }

    _onConnect(client) {
      if (client !== this.client) {
        // This connection is not from the last call to _launchConnection.
        // But _launchConnection calls _cleanup which closes previous connections.
        // It's our belief that this stifles future 'open' events, but maybe
        // we are wrong?
        throw new Error('Got open from inactive client ' + !!this.client);
      }

      if (this._forcedToDisconnect) {
        // We were asked to disconnect between trying to open the connection and
        // actually opening it. Let's just pretend this never happened.
        this.client.close();
        this.client = null;
        return;
      }

      if (this.currentStatus.connected) {
        // We already have a connection. It must have been the case that we
        // started two parallel connection attempts (because we wanted to
        // 'reconnect now' on a hanging connection and we had no way to cancel the
        // connection attempt.) But this shouldn't happen (similarly to the client
        // !== this.client check above).
        throw new Error('Two parallel connections?');
      }

      this._clearConnectionTimer(); // update status


      this.currentStatus.status = 'connected';
      this.currentStatus.connected = true;
      this.currentStatus.retryCount = 0;
      this.statusChanged(); // fire resets. This must come after status change so that clients
      // can call send from within a reset callback.

      this.forEachCallback('reset', callback => {
        callback();
      });
    }

    _cleanup(maybeError) {
      this._clearConnectionTimer();

      if (this.client) {
        var client = this.client;
        this.client = null;
        client.close();
        this.forEachCallback('disconnect', callback => {
          callback(maybeError);
        });
      }
    }

    _clearConnectionTimer() {
      if (this.connectionTimer) {
        clearTimeout(this.connectionTimer);
        this.connectionTimer = null;
      }
    }

    _getProxyUrl(targetUrl) {
      // Similar to code in tools/http-helpers.js.
      var proxy = process.env.HTTP_PROXY || process.env.http_proxy || null; // if we're going to a secure url, try the https_proxy env variable first.

      if (targetUrl.match(/^wss:/)) {
        proxy = process.env.HTTPS_PROXY || process.env.https_proxy || proxy;
      }

      return proxy;
    }

    _launchConnection() {
      var _this = this;

      this._cleanup(); // cleanup the old socket, if there was one.
      // Since server-to-server DDP is still an experimental feature, we only
      // require the module if we actually create a server-to-server
      // connection.


      var FayeWebSocket = Npm.require('faye-websocket');

      var deflate = Npm.require('permessage-deflate');

      var targetUrl = toWebsocketUrl(this.endpoint);
      var fayeOptions = {
        headers: this.headers,
        extensions: [deflate]
      };
      fayeOptions = Object.assign(fayeOptions, this.npmFayeOptions);

      var proxyUrl = this._getProxyUrl(targetUrl);

      if (proxyUrl) {
        fayeOptions.proxy = {
          origin: proxyUrl
        };
      } // We would like to specify 'ddp' as the subprotocol here. The npm module we
      // used to use as a client would fail the handshake if we ask for a
      // subprotocol and the server doesn't send one back (and sockjs doesn't).
      // Faye doesn't have that behavior; it's unclear from reading RFC 6455 if
      // Faye is erroneous or not.  So for now, we don't specify protocols.


      var subprotocols = [];
      var client = this.client = new FayeWebSocket.Client(targetUrl, subprotocols, fayeOptions);

      this._clearConnectionTimer();

      this.connectionTimer = Meteor.setTimeout(() => {
        this._lostConnection(new this.ConnectionError('DDP connection timed out'));
      }, this.CONNECT_TIMEOUT);
      this.client.on('open', Meteor.bindEnvironment(() => {
        return this._onConnect(client);
      }, 'stream connect callback'));

      var clientOnIfCurrent = (event, description, callback) => {
        this.client.on(event, Meteor.bindEnvironment(function () {
          // Ignore events from any connection we've already cleaned up.
          if (client !== _this.client) return;
          callback(...arguments);
        }, description));
      };

      clientOnIfCurrent('error', 'stream error callback', error => {
        if (!this.options._dontPrintErrors) Meteor._debug('stream error', error.message); // Faye's 'error' object is not a JS error (and among other things,
        // doesn't stringify well). Convert it to one.

        this._lostConnection(new this.ConnectionError(error.message));
      });
      clientOnIfCurrent('close', 'stream close callback', () => {
        this._lostConnection();
      });
      clientOnIfCurrent('message', 'stream message callback', message => {
        // Ignore binary frames, where message.data is a Buffer
        if (typeof message.data !== 'string') return;
        this.forEachCallback('message', callback => {
          callback(message.data);
        });
      });
    }

  }
}.call(this, module);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"common.js":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/socket-stream-client/common.js                                                                        //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
let _objectSpread;

module.link("@babel/runtime/helpers/objectSpread2", {
  default(v) {
    _objectSpread = v;
  }

}, 0);
module.export({
  StreamClientCommon: () => StreamClientCommon
});
let Retry;
module.link("meteor/retry", {
  Retry(v) {
    Retry = v;
  }

}, 0);
const forcedReconnectError = new Error("forced reconnect");

class StreamClientCommon {
  constructor(options) {
    this.options = _objectSpread({
      retry: true
    }, options || null);
    this.ConnectionError = options && options.ConnectionError || Error;
  } // Register for callbacks.


  on(name, callback) {
    if (name !== 'message' && name !== 'reset' && name !== 'disconnect') throw new Error('unknown event type: ' + name);
    if (!this.eventCallbacks[name]) this.eventCallbacks[name] = [];
    this.eventCallbacks[name].push(callback);
  }

  forEachCallback(name, cb) {
    if (!this.eventCallbacks[name] || !this.eventCallbacks[name].length) {
      return;
    }

    this.eventCallbacks[name].forEach(cb);
  }

  _initCommon(options) {
    options = options || Object.create(null); //// Constants
    // how long to wait until we declare the connection attempt
    // failed.

    this.CONNECT_TIMEOUT = options.connectTimeoutMs || 10000;
    this.eventCallbacks = Object.create(null); // name -> [callback]

    this._forcedToDisconnect = false; //// Reactive status

    this.currentStatus = {
      status: 'connecting',
      connected: false,
      retryCount: 0
    };

    if (Package.tracker) {
      this.statusListeners = new Package.tracker.Tracker.Dependency();
    }

    this.statusChanged = () => {
      if (this.statusListeners) {
        this.statusListeners.changed();
      }
    }; //// Retry logic


    this._retry = new Retry();
    this.connectionTimer = null;
  } // Trigger a reconnect.


  reconnect(options) {
    options = options || Object.create(null);

    if (options.url) {
      this._changeUrl(options.url);
    }

    if (options._sockjsOptions) {
      this.options._sockjsOptions = options._sockjsOptions;
    }

    if (this.currentStatus.connected) {
      if (options._force || options.url) {
        this._lostConnection(forcedReconnectError);
      }

      return;
    } // if we're mid-connection, stop it.


    if (this.currentStatus.status === 'connecting') {
      // Pretend it's a clean close.
      this._lostConnection();
    }

    this._retry.clear();

    this.currentStatus.retryCount -= 1; // don't count manual retries

    this._retryNow();
  }

  disconnect(options) {
    options = options || Object.create(null); // Failed is permanent. If we're failed, don't let people go back
    // online by calling 'disconnect' then 'reconnect'.

    if (this._forcedToDisconnect) return; // If _permanent is set, permanently disconnect a stream. Once a stream
    // is forced to disconnect, it can never reconnect. This is for
    // error cases such as ddp version mismatch, where trying again
    // won't fix the problem.

    if (options._permanent) {
      this._forcedToDisconnect = true;
    }

    this._cleanup();

    this._retry.clear();

    this.currentStatus = {
      status: options._permanent ? 'failed' : 'offline',
      connected: false,
      retryCount: 0
    };
    if (options._permanent && options._error) this.currentStatus.reason = options._error;
    this.statusChanged();
  } // maybeError is set unless it's a clean protocol-level close.


  _lostConnection(maybeError) {
    this._cleanup(maybeError);

    this._retryLater(maybeError); // sets status. no need to do it here.

  } // fired when we detect that we've gone online. try to reconnect
  // immediately.


  _online() {
    // if we've requested to be offline by disconnecting, don't reconnect.
    if (this.currentStatus.status != 'offline') this.reconnect();
  }

  _retryLater(maybeError) {
    var timeout = 0;

    if (this.options.retry || maybeError === forcedReconnectError) {
      timeout = this._retry.retryLater(this.currentStatus.retryCount, this._retryNow.bind(this));
      this.currentStatus.status = 'waiting';
      this.currentStatus.retryTime = new Date().getTime() + timeout;
    } else {
      this.currentStatus.status = 'failed';
      delete this.currentStatus.retryTime;
    }

    this.currentStatus.connected = false;
    this.statusChanged();
  }

  _retryNow() {
    if (this._forcedToDisconnect) return;
    this.currentStatus.retryCount += 1;
    this.currentStatus.status = 'connecting';
    this.currentStatus.connected = false;
    delete this.currentStatus.retryTime;
    this.statusChanged();

    this._launchConnection();
  } // Get current status. Reactive.


  status() {
    if (this.statusListeners) {
      this.statusListeners.depend();
    }

    return this.currentStatus;
  }

}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"urls.js":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/socket-stream-client/urls.js                                                                          //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
module.export({
  toSockjsUrl: () => toSockjsUrl,
  toWebsocketUrl: () => toWebsocketUrl
});

// @param url {String} URL to Meteor app, eg:
//   "/" or "madewith.meteor.com" or "https://foo.meteor.com"
//   or "ddp+sockjs://ddp--****-foo.meteor.com/sockjs"
// @returns {String} URL to the endpoint with the specific scheme and subPath, e.g.
// for scheme "http" and subPath "sockjs"
//   "http://subdomain.meteor.com/sockjs" or "/sockjs"
//   or "https://ddp--1234-foo.meteor.com/sockjs"
function translateUrl(url, newSchemeBase, subPath) {
  if (!newSchemeBase) {
    newSchemeBase = 'http';
  }

  if (subPath !== "sockjs" && url.startsWith("/")) {
    url = Meteor.absoluteUrl(url.substr(1));
  }

  var ddpUrlMatch = url.match(/^ddp(i?)\+sockjs:\/\//);
  var httpUrlMatch = url.match(/^http(s?):\/\//);
  var newScheme;

  if (ddpUrlMatch) {
    // Remove scheme and split off the host.
    var urlAfterDDP = url.substr(ddpUrlMatch[0].length);
    newScheme = ddpUrlMatch[1] === 'i' ? newSchemeBase : newSchemeBase + 's';
    var slashPos = urlAfterDDP.indexOf('/');
    var host = slashPos === -1 ? urlAfterDDP : urlAfterDDP.substr(0, slashPos);
    var rest = slashPos === -1 ? '' : urlAfterDDP.substr(slashPos); // In the host (ONLY!), change '*' characters into random digits. This
    // allows different stream connections to connect to different hostnames
    // and avoid browser per-hostname connection limits.

    host = host.replace(/\*/g, () => Math.floor(Math.random() * 10));
    return newScheme + '://' + host + rest;
  } else if (httpUrlMatch) {
    newScheme = !httpUrlMatch[1] ? newSchemeBase : newSchemeBase + 's';
    var urlAfterHttp = url.substr(httpUrlMatch[0].length);
    url = newScheme + '://' + urlAfterHttp;
  } // Prefix FQDNs but not relative URLs


  if (url.indexOf('://') === -1 && !url.startsWith('/')) {
    url = newSchemeBase + '://' + url;
  } // XXX This is not what we should be doing: if I have a site
  // deployed at "/foo", then DDP.connect("/") should actually connect
  // to "/", not to "/foo". "/" is an absolute path. (Contrast: if
  // deployed at "/foo", it would be reasonable for DDP.connect("bar")
  // to connect to "/foo/bar").
  //
  // We should make this properly honor absolute paths rather than
  // forcing the path to be relative to the site root. Simultaneously,
  // we should set DDP_DEFAULT_CONNECTION_URL to include the site
  // root. See also client_convenience.js #RationalizingRelativeDDPURLs


  url = Meteor._relativeToSiteRootUrl(url);
  if (url.endsWith('/')) return url + subPath;else return url + '/' + subPath;
}

function toSockjsUrl(url) {
  return translateUrl(url, 'http', 'sockjs');
}

function toWebsocketUrl(url) {
  return translateUrl(url, 'ws', 'websocket');
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

require("/node_modules/meteor/socket-stream-client/server.js");

/* Exports */
Package._define("socket-stream-client");

})();

//# sourceURL=meteor://💻app/packages/socket-stream-client.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc29ja2V0LXN0cmVhbS1jbGllbnQvc2VydmVyLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zb2NrZXQtc3RyZWFtLWNsaWVudC9ub2RlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zb2NrZXQtc3RyZWFtLWNsaWVudC9jb21tb24uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3NvY2tldC1zdHJlYW0tY2xpZW50L3VybHMuanMiXSwibmFtZXMiOlsic2V0TWluaW11bUJyb3dzZXJWZXJzaW9ucyIsIm1vZHVsZTEiLCJsaW5rIiwidiIsImNocm9tZSIsImVkZ2UiLCJmaXJlZm94IiwiaWUiLCJtb2JpbGVTYWZhcmkiLCJwaGFudG9tanMiLCJzYWZhcmkiLCJlbGVjdHJvbiIsIm1vZHVsZSIsImlkIiwiZXhwb3J0IiwiQ2xpZW50U3RyZWFtIiwiTWV0ZW9yIiwidG9XZWJzb2NrZXRVcmwiLCJTdHJlYW1DbGllbnRDb21tb24iLCJjb25zdHJ1Y3RvciIsImVuZHBvaW50Iiwib3B0aW9ucyIsImNsaWVudCIsImhlYWRlcnMiLCJPYmplY3QiLCJjcmVhdGUiLCJucG1GYXllT3B0aW9ucyIsIl9pbml0Q29tbW9uIiwiX2xhdW5jaENvbm5lY3Rpb24iLCJzZW5kIiwiZGF0YSIsImN1cnJlbnRTdGF0dXMiLCJjb25uZWN0ZWQiLCJfY2hhbmdlVXJsIiwidXJsIiwiX29uQ29ubmVjdCIsIkVycm9yIiwiX2ZvcmNlZFRvRGlzY29ubmVjdCIsImNsb3NlIiwiX2NsZWFyQ29ubmVjdGlvblRpbWVyIiwic3RhdHVzIiwicmV0cnlDb3VudCIsInN0YXR1c0NoYW5nZWQiLCJmb3JFYWNoQ2FsbGJhY2siLCJjYWxsYmFjayIsIl9jbGVhbnVwIiwibWF5YmVFcnJvciIsImNvbm5lY3Rpb25UaW1lciIsImNsZWFyVGltZW91dCIsIl9nZXRQcm94eVVybCIsInRhcmdldFVybCIsInByb3h5IiwicHJvY2VzcyIsImVudiIsIkhUVFBfUFJPWFkiLCJodHRwX3Byb3h5IiwibWF0Y2giLCJIVFRQU19QUk9YWSIsImh0dHBzX3Byb3h5IiwiRmF5ZVdlYlNvY2tldCIsIk5wbSIsInJlcXVpcmUiLCJkZWZsYXRlIiwiZmF5ZU9wdGlvbnMiLCJleHRlbnNpb25zIiwiYXNzaWduIiwicHJveHlVcmwiLCJvcmlnaW4iLCJzdWJwcm90b2NvbHMiLCJDbGllbnQiLCJzZXRUaW1lb3V0IiwiX2xvc3RDb25uZWN0aW9uIiwiQ29ubmVjdGlvbkVycm9yIiwiQ09OTkVDVF9USU1FT1VUIiwib24iLCJiaW5kRW52aXJvbm1lbnQiLCJjbGllbnRPbklmQ3VycmVudCIsImV2ZW50IiwiZGVzY3JpcHRpb24iLCJlcnJvciIsIl9kb250UHJpbnRFcnJvcnMiLCJfZGVidWciLCJtZXNzYWdlIiwiX29iamVjdFNwcmVhZCIsImRlZmF1bHQiLCJSZXRyeSIsImZvcmNlZFJlY29ubmVjdEVycm9yIiwicmV0cnkiLCJuYW1lIiwiZXZlbnRDYWxsYmFja3MiLCJwdXNoIiwiY2IiLCJsZW5ndGgiLCJmb3JFYWNoIiwiY29ubmVjdFRpbWVvdXRNcyIsIlBhY2thZ2UiLCJ0cmFja2VyIiwic3RhdHVzTGlzdGVuZXJzIiwiVHJhY2tlciIsIkRlcGVuZGVuY3kiLCJjaGFuZ2VkIiwiX3JldHJ5IiwicmVjb25uZWN0IiwiX3NvY2tqc09wdGlvbnMiLCJfZm9yY2UiLCJjbGVhciIsIl9yZXRyeU5vdyIsImRpc2Nvbm5lY3QiLCJfcGVybWFuZW50IiwiX2Vycm9yIiwicmVhc29uIiwiX3JldHJ5TGF0ZXIiLCJfb25saW5lIiwidGltZW91dCIsInJldHJ5TGF0ZXIiLCJiaW5kIiwicmV0cnlUaW1lIiwiRGF0ZSIsImdldFRpbWUiLCJkZXBlbmQiLCJ0b1NvY2tqc1VybCIsInRyYW5zbGF0ZVVybCIsIm5ld1NjaGVtZUJhc2UiLCJzdWJQYXRoIiwic3RhcnRzV2l0aCIsImFic29sdXRlVXJsIiwic3Vic3RyIiwiZGRwVXJsTWF0Y2giLCJodHRwVXJsTWF0Y2giLCJuZXdTY2hlbWUiLCJ1cmxBZnRlckREUCIsInNsYXNoUG9zIiwiaW5kZXhPZiIsImhvc3QiLCJyZXN0IiwicmVwbGFjZSIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsInVybEFmdGVySHR0cCIsIl9yZWxhdGl2ZVRvU2l0ZVJvb3RVcmwiLCJlbmRzV2l0aCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxNQUFJQSx5QkFBSjtBQUE4QkMsU0FBTyxDQUFDQyxJQUFSLENBQWEsd0JBQWIsRUFBc0M7QUFBQ0YsNkJBQXlCLENBQUNHLENBQUQsRUFBRztBQUFDSCwrQkFBeUIsR0FBQ0csQ0FBMUI7QUFBNEI7O0FBQTFELEdBQXRDLEVBQWtHLENBQWxHO0FBSTlCSCwyQkFBeUIsQ0FBQztBQUN4QkksVUFBTSxFQUFFLEVBRGdCO0FBRXhCQyxRQUFJLEVBQUUsRUFGa0I7QUFHeEJDLFdBQU8sRUFBRSxFQUhlO0FBSXhCQyxNQUFFLEVBQUUsRUFKb0I7QUFLeEJDLGdCQUFZLEVBQUUsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUxVO0FBTXhCQyxhQUFTLEVBQUUsQ0FOYTtBQU94QkMsVUFBTSxFQUFFLENBUGdCO0FBUXhCQyxZQUFRLEVBQUUsQ0FBQyxDQUFELEVBQUksRUFBSjtBQVJjLEdBQUQsRUFTdEJDLE1BQU0sQ0FBQ0MsRUFUZSxDQUF6Qjs7Ozs7Ozs7Ozs7OztBQ0pBWixTQUFPLENBQUNhLE1BQVIsQ0FBZTtBQUFDQyxnQkFBWSxFQUFDLE1BQUlBO0FBQWxCLEdBQWY7QUFBZ0QsTUFBSUMsTUFBSjtBQUFXZixTQUFPLENBQUNDLElBQVIsQ0FBYSxlQUFiLEVBQTZCO0FBQUNjLFVBQU0sQ0FBQ2IsQ0FBRCxFQUFHO0FBQUNhLFlBQU0sR0FBQ2IsQ0FBUDtBQUFTOztBQUFwQixHQUE3QixFQUFtRCxDQUFuRDtBQUFzRCxNQUFJYyxjQUFKO0FBQW1CaEIsU0FBTyxDQUFDQyxJQUFSLENBQWEsV0FBYixFQUF5QjtBQUFDZSxrQkFBYyxDQUFDZCxDQUFELEVBQUc7QUFBQ2Msb0JBQWMsR0FBQ2QsQ0FBZjtBQUFpQjs7QUFBcEMsR0FBekIsRUFBK0QsQ0FBL0Q7QUFBa0UsTUFBSWUsa0JBQUo7QUFBdUJqQixTQUFPLENBQUNDLElBQVIsQ0FBYSxhQUFiLEVBQTJCO0FBQUNnQixzQkFBa0IsQ0FBQ2YsQ0FBRCxFQUFHO0FBQUNlLHdCQUFrQixHQUFDZixDQUFuQjtBQUFxQjs7QUFBNUMsR0FBM0IsRUFBeUUsQ0FBekU7O0FBZXROLFFBQU1ZLFlBQU4sU0FBMkJHLGtCQUEzQixDQUE4QztBQUNuREMsZUFBVyxDQUFDQyxRQUFELEVBQVdDLE9BQVgsRUFBb0I7QUFDN0IsWUFBTUEsT0FBTjtBQUVBLFdBQUtDLE1BQUwsR0FBYyxJQUFkLENBSDZCLENBR1Q7O0FBQ3BCLFdBQUtGLFFBQUwsR0FBZ0JBLFFBQWhCO0FBRUEsV0FBS0csT0FBTCxHQUFlLEtBQUtGLE9BQUwsQ0FBYUUsT0FBYixJQUF3QkMsTUFBTSxDQUFDQyxNQUFQLENBQWMsSUFBZCxDQUF2QztBQUNBLFdBQUtDLGNBQUwsR0FBc0IsS0FBS0wsT0FBTCxDQUFhSyxjQUFiLElBQStCRixNQUFNLENBQUNDLE1BQVAsQ0FBYyxJQUFkLENBQXJEOztBQUVBLFdBQUtFLFdBQUwsQ0FBaUIsS0FBS04sT0FBdEIsRUFUNkIsQ0FXN0I7OztBQUNBLFdBQUtPLGlCQUFMO0FBQ0QsS0Fka0QsQ0FnQm5EO0FBQ0E7QUFDQTs7O0FBQ0FDLFFBQUksQ0FBQ0MsSUFBRCxFQUFPO0FBQ1QsVUFBSSxLQUFLQyxhQUFMLENBQW1CQyxTQUF2QixFQUFrQztBQUNoQyxhQUFLVixNQUFMLENBQVlPLElBQVosQ0FBaUJDLElBQWpCO0FBQ0Q7QUFDRixLQXZCa0QsQ0F5Qm5EOzs7QUFDQUcsY0FBVSxDQUFDQyxHQUFELEVBQU07QUFDZCxXQUFLZCxRQUFMLEdBQWdCYyxHQUFoQjtBQUNEOztBQUVEQyxjQUFVLENBQUNiLE1BQUQsRUFBUztBQUNqQixVQUFJQSxNQUFNLEtBQUssS0FBS0EsTUFBcEIsRUFBNEI7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNLElBQUljLEtBQUosQ0FBVSxtQ0FBbUMsQ0FBQyxDQUFDLEtBQUtkLE1BQXBELENBQU47QUFDRDs7QUFFRCxVQUFJLEtBQUtlLG1CQUFULEVBQThCO0FBQzVCO0FBQ0E7QUFDQSxhQUFLZixNQUFMLENBQVlnQixLQUFaO0FBQ0EsYUFBS2hCLE1BQUwsR0FBYyxJQUFkO0FBQ0E7QUFDRDs7QUFFRCxVQUFJLEtBQUtTLGFBQUwsQ0FBbUJDLFNBQXZCLEVBQWtDO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNLElBQUlJLEtBQUosQ0FBVSwyQkFBVixDQUFOO0FBQ0Q7O0FBRUQsV0FBS0cscUJBQUwsR0ExQmlCLENBNEJqQjs7O0FBQ0EsV0FBS1IsYUFBTCxDQUFtQlMsTUFBbkIsR0FBNEIsV0FBNUI7QUFDQSxXQUFLVCxhQUFMLENBQW1CQyxTQUFuQixHQUErQixJQUEvQjtBQUNBLFdBQUtELGFBQUwsQ0FBbUJVLFVBQW5CLEdBQWdDLENBQWhDO0FBQ0EsV0FBS0MsYUFBTCxHQWhDaUIsQ0FrQ2pCO0FBQ0E7O0FBQ0EsV0FBS0MsZUFBTCxDQUFxQixPQUFyQixFQUE4QkMsUUFBUSxJQUFJO0FBQ3hDQSxnQkFBUTtBQUNULE9BRkQ7QUFHRDs7QUFFREMsWUFBUSxDQUFDQyxVQUFELEVBQWE7QUFDbkIsV0FBS1AscUJBQUw7O0FBQ0EsVUFBSSxLQUFLakIsTUFBVCxFQUFpQjtBQUNmLFlBQUlBLE1BQU0sR0FBRyxLQUFLQSxNQUFsQjtBQUNBLGFBQUtBLE1BQUwsR0FBYyxJQUFkO0FBQ0FBLGNBQU0sQ0FBQ2dCLEtBQVA7QUFFQSxhQUFLSyxlQUFMLENBQXFCLFlBQXJCLEVBQW1DQyxRQUFRLElBQUk7QUFDN0NBLGtCQUFRLENBQUNFLFVBQUQsQ0FBUjtBQUNELFNBRkQ7QUFHRDtBQUNGOztBQUVEUCx5QkFBcUIsR0FBRztBQUN0QixVQUFJLEtBQUtRLGVBQVQsRUFBMEI7QUFDeEJDLG9CQUFZLENBQUMsS0FBS0QsZUFBTixDQUFaO0FBQ0EsYUFBS0EsZUFBTCxHQUF1QixJQUF2QjtBQUNEO0FBQ0Y7O0FBRURFLGdCQUFZLENBQUNDLFNBQUQsRUFBWTtBQUN0QjtBQUNBLFVBQUlDLEtBQUssR0FBR0MsT0FBTyxDQUFDQyxHQUFSLENBQVlDLFVBQVosSUFBMEJGLE9BQU8sQ0FBQ0MsR0FBUixDQUFZRSxVQUF0QyxJQUFvRCxJQUFoRSxDQUZzQixDQUd0Qjs7QUFDQSxVQUFJTCxTQUFTLENBQUNNLEtBQVYsQ0FBZ0IsT0FBaEIsQ0FBSixFQUE4QjtBQUM1QkwsYUFBSyxHQUFHQyxPQUFPLENBQUNDLEdBQVIsQ0FBWUksV0FBWixJQUEyQkwsT0FBTyxDQUFDQyxHQUFSLENBQVlLLFdBQXZDLElBQXNEUCxLQUE5RDtBQUNEOztBQUNELGFBQU9BLEtBQVA7QUFDRDs7QUFFRHZCLHFCQUFpQixHQUFHO0FBQUE7O0FBQ2xCLFdBQUtpQixRQUFMLEdBRGtCLENBQ0Q7QUFFakI7QUFDQTtBQUNBOzs7QUFDQSxVQUFJYyxhQUFhLEdBQUdDLEdBQUcsQ0FBQ0MsT0FBSixDQUFZLGdCQUFaLENBQXBCOztBQUNBLFVBQUlDLE9BQU8sR0FBR0YsR0FBRyxDQUFDQyxPQUFKLENBQVksb0JBQVosQ0FBZDs7QUFFQSxVQUFJWCxTQUFTLEdBQUdqQyxjQUFjLENBQUMsS0FBS0csUUFBTixDQUE5QjtBQUNBLFVBQUkyQyxXQUFXLEdBQUc7QUFDaEJ4QyxlQUFPLEVBQUUsS0FBS0EsT0FERTtBQUVoQnlDLGtCQUFVLEVBQUUsQ0FBQ0YsT0FBRDtBQUZJLE9BQWxCO0FBSUFDLGlCQUFXLEdBQUd2QyxNQUFNLENBQUN5QyxNQUFQLENBQWNGLFdBQWQsRUFBMkIsS0FBS3JDLGNBQWhDLENBQWQ7O0FBQ0EsVUFBSXdDLFFBQVEsR0FBRyxLQUFLakIsWUFBTCxDQUFrQkMsU0FBbEIsQ0FBZjs7QUFDQSxVQUFJZ0IsUUFBSixFQUFjO0FBQ1pILG1CQUFXLENBQUNaLEtBQVosR0FBb0I7QUFBRWdCLGdCQUFNLEVBQUVEO0FBQVYsU0FBcEI7QUFDRCxPQWxCaUIsQ0FvQmxCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLFVBQUlFLFlBQVksR0FBRyxFQUFuQjtBQUVBLFVBQUk5QyxNQUFNLEdBQUksS0FBS0EsTUFBTCxHQUFjLElBQUlxQyxhQUFhLENBQUNVLE1BQWxCLENBQzFCbkIsU0FEMEIsRUFFMUJrQixZQUYwQixFQUcxQkwsV0FIMEIsQ0FBNUI7O0FBTUEsV0FBS3hCLHFCQUFMOztBQUNBLFdBQUtRLGVBQUwsR0FBdUIvQixNQUFNLENBQUNzRCxVQUFQLENBQWtCLE1BQU07QUFDN0MsYUFBS0MsZUFBTCxDQUFxQixJQUFJLEtBQUtDLGVBQVQsQ0FBeUIsMEJBQXpCLENBQXJCO0FBQ0QsT0FGc0IsRUFFcEIsS0FBS0MsZUFGZSxDQUF2QjtBQUlBLFdBQUtuRCxNQUFMLENBQVlvRCxFQUFaLENBQ0UsTUFERixFQUVFMUQsTUFBTSxDQUFDMkQsZUFBUCxDQUF1QixNQUFNO0FBQzNCLGVBQU8sS0FBS3hDLFVBQUwsQ0FBZ0JiLE1BQWhCLENBQVA7QUFDRCxPQUZELEVBRUcseUJBRkgsQ0FGRjs7QUFPQSxVQUFJc0QsaUJBQWlCLEdBQUcsQ0FBQ0MsS0FBRCxFQUFRQyxXQUFSLEVBQXFCbEMsUUFBckIsS0FBa0M7QUFDeEQsYUFBS3RCLE1BQUwsQ0FBWW9ELEVBQVosQ0FDRUcsS0FERixFQUVFN0QsTUFBTSxDQUFDMkQsZUFBUCxDQUF1QixZQUFhO0FBQ2xDO0FBQ0EsY0FBSXJELE1BQU0sS0FBSyxLQUFJLENBQUNBLE1BQXBCLEVBQTRCO0FBQzVCc0Isa0JBQVEsQ0FBQyxZQUFELENBQVI7QUFDRCxTQUpELEVBSUdrQyxXQUpILENBRkY7QUFRRCxPQVREOztBQVdBRix1QkFBaUIsQ0FBQyxPQUFELEVBQVUsdUJBQVYsRUFBbUNHLEtBQUssSUFBSTtBQUMzRCxZQUFJLENBQUMsS0FBSzFELE9BQUwsQ0FBYTJELGdCQUFsQixFQUNFaEUsTUFBTSxDQUFDaUUsTUFBUCxDQUFjLGNBQWQsRUFBOEJGLEtBQUssQ0FBQ0csT0FBcEMsRUFGeUQsQ0FJM0Q7QUFDQTs7QUFDQSxhQUFLWCxlQUFMLENBQXFCLElBQUksS0FBS0MsZUFBVCxDQUF5Qk8sS0FBSyxDQUFDRyxPQUEvQixDQUFyQjtBQUNELE9BUGdCLENBQWpCO0FBU0FOLHVCQUFpQixDQUFDLE9BQUQsRUFBVSx1QkFBVixFQUFtQyxNQUFNO0FBQ3hELGFBQUtMLGVBQUw7QUFDRCxPQUZnQixDQUFqQjtBQUlBSyx1QkFBaUIsQ0FBQyxTQUFELEVBQVkseUJBQVosRUFBdUNNLE9BQU8sSUFBSTtBQUNqRTtBQUNBLFlBQUksT0FBT0EsT0FBTyxDQUFDcEQsSUFBZixLQUF3QixRQUE1QixFQUFzQztBQUV0QyxhQUFLYSxlQUFMLENBQXFCLFNBQXJCLEVBQWdDQyxRQUFRLElBQUk7QUFDMUNBLGtCQUFRLENBQUNzQyxPQUFPLENBQUNwRCxJQUFULENBQVI7QUFDRCxTQUZEO0FBR0QsT0FQZ0IsQ0FBakI7QUFRRDs7QUFsTGtEOzs7Ozs7Ozs7Ozs7QUNmckQsSUFBSXFELGFBQUo7O0FBQWtCdkUsTUFBTSxDQUFDVixJQUFQLENBQVksc0NBQVosRUFBbUQ7QUFBQ2tGLFNBQU8sQ0FBQ2pGLENBQUQsRUFBRztBQUFDZ0YsaUJBQWEsR0FBQ2hGLENBQWQ7QUFBZ0I7O0FBQTVCLENBQW5ELEVBQWlGLENBQWpGO0FBQWxCUyxNQUFNLENBQUNFLE1BQVAsQ0FBYztBQUFDSSxvQkFBa0IsRUFBQyxNQUFJQTtBQUF4QixDQUFkO0FBQTJELElBQUltRSxLQUFKO0FBQVV6RSxNQUFNLENBQUNWLElBQVAsQ0FBWSxjQUFaLEVBQTJCO0FBQUNtRixPQUFLLENBQUNsRixDQUFELEVBQUc7QUFBQ2tGLFNBQUssR0FBQ2xGLENBQU47QUFBUTs7QUFBbEIsQ0FBM0IsRUFBK0MsQ0FBL0M7QUFFckUsTUFBTW1GLG9CQUFvQixHQUFHLElBQUlsRCxLQUFKLENBQVUsa0JBQVYsQ0FBN0I7O0FBRU8sTUFBTWxCLGtCQUFOLENBQXlCO0FBQzlCQyxhQUFXLENBQUNFLE9BQUQsRUFBVTtBQUNuQixTQUFLQSxPQUFMO0FBQ0VrRSxXQUFLLEVBQUU7QUFEVCxPQUVNbEUsT0FBTyxJQUFJLElBRmpCO0FBS0EsU0FBS21ELGVBQUwsR0FDRW5ELE9BQU8sSUFBSUEsT0FBTyxDQUFDbUQsZUFBbkIsSUFBc0NwQyxLQUR4QztBQUVELEdBVDZCLENBVzlCOzs7QUFDQXNDLElBQUUsQ0FBQ2MsSUFBRCxFQUFPNUMsUUFBUCxFQUFpQjtBQUNqQixRQUFJNEMsSUFBSSxLQUFLLFNBQVQsSUFBc0JBLElBQUksS0FBSyxPQUEvQixJQUEwQ0EsSUFBSSxLQUFLLFlBQXZELEVBQ0UsTUFBTSxJQUFJcEQsS0FBSixDQUFVLHlCQUF5Qm9ELElBQW5DLENBQU47QUFFRixRQUFJLENBQUMsS0FBS0MsY0FBTCxDQUFvQkQsSUFBcEIsQ0FBTCxFQUFnQyxLQUFLQyxjQUFMLENBQW9CRCxJQUFwQixJQUE0QixFQUE1QjtBQUNoQyxTQUFLQyxjQUFMLENBQW9CRCxJQUFwQixFQUEwQkUsSUFBMUIsQ0FBK0I5QyxRQUEvQjtBQUNEOztBQUVERCxpQkFBZSxDQUFDNkMsSUFBRCxFQUFPRyxFQUFQLEVBQVc7QUFDeEIsUUFBSSxDQUFDLEtBQUtGLGNBQUwsQ0FBb0JELElBQXBCLENBQUQsSUFBOEIsQ0FBQyxLQUFLQyxjQUFMLENBQW9CRCxJQUFwQixFQUEwQkksTUFBN0QsRUFBcUU7QUFDbkU7QUFDRDs7QUFFRCxTQUFLSCxjQUFMLENBQW9CRCxJQUFwQixFQUEwQkssT0FBMUIsQ0FBa0NGLEVBQWxDO0FBQ0Q7O0FBRURoRSxhQUFXLENBQUNOLE9BQUQsRUFBVTtBQUNuQkEsV0FBTyxHQUFHQSxPQUFPLElBQUlHLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjLElBQWQsQ0FBckIsQ0FEbUIsQ0FHbkI7QUFFQTtBQUNBOztBQUNBLFNBQUtnRCxlQUFMLEdBQXVCcEQsT0FBTyxDQUFDeUUsZ0JBQVIsSUFBNEIsS0FBbkQ7QUFFQSxTQUFLTCxjQUFMLEdBQXNCakUsTUFBTSxDQUFDQyxNQUFQLENBQWMsSUFBZCxDQUF0QixDQVRtQixDQVN3Qjs7QUFFM0MsU0FBS1ksbUJBQUwsR0FBMkIsS0FBM0IsQ0FYbUIsQ0FhbkI7O0FBQ0EsU0FBS04sYUFBTCxHQUFxQjtBQUNuQlMsWUFBTSxFQUFFLFlBRFc7QUFFbkJSLGVBQVMsRUFBRSxLQUZRO0FBR25CUyxnQkFBVSxFQUFFO0FBSE8sS0FBckI7O0FBTUEsUUFBSXNELE9BQU8sQ0FBQ0MsT0FBWixFQUFxQjtBQUNuQixXQUFLQyxlQUFMLEdBQXVCLElBQUlGLE9BQU8sQ0FBQ0MsT0FBUixDQUFnQkUsT0FBaEIsQ0FBd0JDLFVBQTVCLEVBQXZCO0FBQ0Q7O0FBRUQsU0FBS3pELGFBQUwsR0FBcUIsTUFBTTtBQUN6QixVQUFJLEtBQUt1RCxlQUFULEVBQTBCO0FBQ3hCLGFBQUtBLGVBQUwsQ0FBcUJHLE9BQXJCO0FBQ0Q7QUFDRixLQUpELENBeEJtQixDQThCbkI7OztBQUNBLFNBQUtDLE1BQUwsR0FBYyxJQUFJaEIsS0FBSixFQUFkO0FBQ0EsU0FBS3RDLGVBQUwsR0FBdUIsSUFBdkI7QUFDRCxHQTdENkIsQ0ErRDlCOzs7QUFDQXVELFdBQVMsQ0FBQ2pGLE9BQUQsRUFBVTtBQUNqQkEsV0FBTyxHQUFHQSxPQUFPLElBQUlHLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjLElBQWQsQ0FBckI7O0FBRUEsUUFBSUosT0FBTyxDQUFDYSxHQUFaLEVBQWlCO0FBQ2YsV0FBS0QsVUFBTCxDQUFnQlosT0FBTyxDQUFDYSxHQUF4QjtBQUNEOztBQUVELFFBQUliLE9BQU8sQ0FBQ2tGLGNBQVosRUFBNEI7QUFDMUIsV0FBS2xGLE9BQUwsQ0FBYWtGLGNBQWIsR0FBOEJsRixPQUFPLENBQUNrRixjQUF0QztBQUNEOztBQUVELFFBQUksS0FBS3hFLGFBQUwsQ0FBbUJDLFNBQXZCLEVBQWtDO0FBQ2hDLFVBQUlYLE9BQU8sQ0FBQ21GLE1BQVIsSUFBa0JuRixPQUFPLENBQUNhLEdBQTlCLEVBQW1DO0FBQ2pDLGFBQUtxQyxlQUFMLENBQXFCZSxvQkFBckI7QUFDRDs7QUFDRDtBQUNELEtBaEJnQixDQWtCakI7OztBQUNBLFFBQUksS0FBS3ZELGFBQUwsQ0FBbUJTLE1BQW5CLEtBQThCLFlBQWxDLEVBQWdEO0FBQzlDO0FBQ0EsV0FBSytCLGVBQUw7QUFDRDs7QUFFRCxTQUFLOEIsTUFBTCxDQUFZSSxLQUFaOztBQUNBLFNBQUsxRSxhQUFMLENBQW1CVSxVQUFuQixJQUFpQyxDQUFqQyxDQXpCaUIsQ0F5Qm1COztBQUNwQyxTQUFLaUUsU0FBTDtBQUNEOztBQUVEQyxZQUFVLENBQUN0RixPQUFELEVBQVU7QUFDbEJBLFdBQU8sR0FBR0EsT0FBTyxJQUFJRyxNQUFNLENBQUNDLE1BQVAsQ0FBYyxJQUFkLENBQXJCLENBRGtCLENBR2xCO0FBQ0E7O0FBQ0EsUUFBSSxLQUFLWSxtQkFBVCxFQUE4QixPQUxaLENBT2xCO0FBQ0E7QUFDQTtBQUNBOztBQUNBLFFBQUloQixPQUFPLENBQUN1RixVQUFaLEVBQXdCO0FBQ3RCLFdBQUt2RSxtQkFBTCxHQUEyQixJQUEzQjtBQUNEOztBQUVELFNBQUtRLFFBQUw7O0FBQ0EsU0FBS3dELE1BQUwsQ0FBWUksS0FBWjs7QUFFQSxTQUFLMUUsYUFBTCxHQUFxQjtBQUNuQlMsWUFBTSxFQUFFbkIsT0FBTyxDQUFDdUYsVUFBUixHQUFxQixRQUFyQixHQUFnQyxTQURyQjtBQUVuQjVFLGVBQVMsRUFBRSxLQUZRO0FBR25CUyxnQkFBVSxFQUFFO0FBSE8sS0FBckI7QUFNQSxRQUFJcEIsT0FBTyxDQUFDdUYsVUFBUixJQUFzQnZGLE9BQU8sQ0FBQ3dGLE1BQWxDLEVBQ0UsS0FBSzlFLGFBQUwsQ0FBbUIrRSxNQUFuQixHQUE0QnpGLE9BQU8sQ0FBQ3dGLE1BQXBDO0FBRUYsU0FBS25FLGFBQUw7QUFDRCxHQXpINkIsQ0EySDlCOzs7QUFDQTZCLGlCQUFlLENBQUN6QixVQUFELEVBQWE7QUFDMUIsU0FBS0QsUUFBTCxDQUFjQyxVQUFkOztBQUNBLFNBQUtpRSxXQUFMLENBQWlCakUsVUFBakIsRUFGMEIsQ0FFSTs7QUFDL0IsR0EvSDZCLENBaUk5QjtBQUNBOzs7QUFDQWtFLFNBQU8sR0FBRztBQUNSO0FBQ0EsUUFBSSxLQUFLakYsYUFBTCxDQUFtQlMsTUFBbkIsSUFBNkIsU0FBakMsRUFBNEMsS0FBSzhELFNBQUw7QUFDN0M7O0FBRURTLGFBQVcsQ0FBQ2pFLFVBQUQsRUFBYTtBQUN0QixRQUFJbUUsT0FBTyxHQUFHLENBQWQ7O0FBQ0EsUUFBSSxLQUFLNUYsT0FBTCxDQUFha0UsS0FBYixJQUNBekMsVUFBVSxLQUFLd0Msb0JBRG5CLEVBQ3lDO0FBQ3ZDMkIsYUFBTyxHQUFHLEtBQUtaLE1BQUwsQ0FBWWEsVUFBWixDQUNSLEtBQUtuRixhQUFMLENBQW1CVSxVQURYLEVBRVIsS0FBS2lFLFNBQUwsQ0FBZVMsSUFBZixDQUFvQixJQUFwQixDQUZRLENBQVY7QUFJQSxXQUFLcEYsYUFBTCxDQUFtQlMsTUFBbkIsR0FBNEIsU0FBNUI7QUFDQSxXQUFLVCxhQUFMLENBQW1CcUYsU0FBbkIsR0FBK0IsSUFBSUMsSUFBSixHQUFXQyxPQUFYLEtBQXVCTCxPQUF0RDtBQUNELEtBUkQsTUFRTztBQUNMLFdBQUtsRixhQUFMLENBQW1CUyxNQUFuQixHQUE0QixRQUE1QjtBQUNBLGFBQU8sS0FBS1QsYUFBTCxDQUFtQnFGLFNBQTFCO0FBQ0Q7O0FBRUQsU0FBS3JGLGFBQUwsQ0FBbUJDLFNBQW5CLEdBQStCLEtBQS9CO0FBQ0EsU0FBS1UsYUFBTDtBQUNEOztBQUVEZ0UsV0FBUyxHQUFHO0FBQ1YsUUFBSSxLQUFLckUsbUJBQVQsRUFBOEI7QUFFOUIsU0FBS04sYUFBTCxDQUFtQlUsVUFBbkIsSUFBaUMsQ0FBakM7QUFDQSxTQUFLVixhQUFMLENBQW1CUyxNQUFuQixHQUE0QixZQUE1QjtBQUNBLFNBQUtULGFBQUwsQ0FBbUJDLFNBQW5CLEdBQStCLEtBQS9CO0FBQ0EsV0FBTyxLQUFLRCxhQUFMLENBQW1CcUYsU0FBMUI7QUFDQSxTQUFLMUUsYUFBTDs7QUFFQSxTQUFLZCxpQkFBTDtBQUNELEdBcks2QixDQXVLOUI7OztBQUNBWSxRQUFNLEdBQUc7QUFDUCxRQUFJLEtBQUt5RCxlQUFULEVBQTBCO0FBQ3hCLFdBQUtBLGVBQUwsQ0FBcUJzQixNQUFyQjtBQUNEOztBQUNELFdBQU8sS0FBS3hGLGFBQVo7QUFDRDs7QUE3SzZCLEM7Ozs7Ozs7Ozs7O0FDSmhDbkIsTUFBTSxDQUFDRSxNQUFQLENBQWM7QUFBQzBHLGFBQVcsRUFBQyxNQUFJQSxXQUFqQjtBQUE2QnZHLGdCQUFjLEVBQUMsTUFBSUE7QUFBaEQsQ0FBZDs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVN3RyxZQUFULENBQXNCdkYsR0FBdEIsRUFBMkJ3RixhQUEzQixFQUEwQ0MsT0FBMUMsRUFBbUQ7QUFDakQsTUFBSSxDQUFDRCxhQUFMLEVBQW9CO0FBQ2xCQSxpQkFBYSxHQUFHLE1BQWhCO0FBQ0Q7O0FBRUQsTUFBSUMsT0FBTyxLQUFLLFFBQVosSUFBd0J6RixHQUFHLENBQUMwRixVQUFKLENBQWUsR0FBZixDQUE1QixFQUFpRDtBQUMvQzFGLE9BQUcsR0FBR2xCLE1BQU0sQ0FBQzZHLFdBQVAsQ0FBbUIzRixHQUFHLENBQUM0RixNQUFKLENBQVcsQ0FBWCxDQUFuQixDQUFOO0FBQ0Q7O0FBRUQsTUFBSUMsV0FBVyxHQUFHN0YsR0FBRyxDQUFDc0IsS0FBSixDQUFVLHVCQUFWLENBQWxCO0FBQ0EsTUFBSXdFLFlBQVksR0FBRzlGLEdBQUcsQ0FBQ3NCLEtBQUosQ0FBVSxnQkFBVixDQUFuQjtBQUNBLE1BQUl5RSxTQUFKOztBQUNBLE1BQUlGLFdBQUosRUFBaUI7QUFDZjtBQUNBLFFBQUlHLFdBQVcsR0FBR2hHLEdBQUcsQ0FBQzRGLE1BQUosQ0FBV0MsV0FBVyxDQUFDLENBQUQsQ0FBWCxDQUFlbkMsTUFBMUIsQ0FBbEI7QUFDQXFDLGFBQVMsR0FBR0YsV0FBVyxDQUFDLENBQUQsQ0FBWCxLQUFtQixHQUFuQixHQUF5QkwsYUFBekIsR0FBeUNBLGFBQWEsR0FBRyxHQUFyRTtBQUNBLFFBQUlTLFFBQVEsR0FBR0QsV0FBVyxDQUFDRSxPQUFaLENBQW9CLEdBQXBCLENBQWY7QUFDQSxRQUFJQyxJQUFJLEdBQUdGLFFBQVEsS0FBSyxDQUFDLENBQWQsR0FBa0JELFdBQWxCLEdBQWdDQSxXQUFXLENBQUNKLE1BQVosQ0FBbUIsQ0FBbkIsRUFBc0JLLFFBQXRCLENBQTNDO0FBQ0EsUUFBSUcsSUFBSSxHQUFHSCxRQUFRLEtBQUssQ0FBQyxDQUFkLEdBQWtCLEVBQWxCLEdBQXVCRCxXQUFXLENBQUNKLE1BQVosQ0FBbUJLLFFBQW5CLENBQWxDLENBTmUsQ0FRZjtBQUNBO0FBQ0E7O0FBQ0FFLFFBQUksR0FBR0EsSUFBSSxDQUFDRSxPQUFMLENBQWEsS0FBYixFQUFvQixNQUFNQyxJQUFJLENBQUNDLEtBQUwsQ0FBV0QsSUFBSSxDQUFDRSxNQUFMLEtBQWdCLEVBQTNCLENBQTFCLENBQVA7QUFFQSxXQUFPVCxTQUFTLEdBQUcsS0FBWixHQUFvQkksSUFBcEIsR0FBMkJDLElBQWxDO0FBQ0QsR0FkRCxNQWNPLElBQUlOLFlBQUosRUFBa0I7QUFDdkJDLGFBQVMsR0FBRyxDQUFDRCxZQUFZLENBQUMsQ0FBRCxDQUFiLEdBQW1CTixhQUFuQixHQUFtQ0EsYUFBYSxHQUFHLEdBQS9EO0FBQ0EsUUFBSWlCLFlBQVksR0FBR3pHLEdBQUcsQ0FBQzRGLE1BQUosQ0FBV0UsWUFBWSxDQUFDLENBQUQsQ0FBWixDQUFnQnBDLE1BQTNCLENBQW5CO0FBQ0ExRCxPQUFHLEdBQUcrRixTQUFTLEdBQUcsS0FBWixHQUFvQlUsWUFBMUI7QUFDRCxHQTlCZ0QsQ0FnQ2pEOzs7QUFDQSxNQUFJekcsR0FBRyxDQUFDa0csT0FBSixDQUFZLEtBQVosTUFBdUIsQ0FBQyxDQUF4QixJQUE2QixDQUFDbEcsR0FBRyxDQUFDMEYsVUFBSixDQUFlLEdBQWYsQ0FBbEMsRUFBdUQ7QUFDckQxRixPQUFHLEdBQUd3RixhQUFhLEdBQUcsS0FBaEIsR0FBd0J4RixHQUE5QjtBQUNELEdBbkNnRCxDQXFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBQSxLQUFHLEdBQUdsQixNQUFNLENBQUM0SCxzQkFBUCxDQUE4QjFHLEdBQTlCLENBQU47QUFFQSxNQUFJQSxHQUFHLENBQUMyRyxRQUFKLENBQWEsR0FBYixDQUFKLEVBQXVCLE9BQU8zRyxHQUFHLEdBQUd5RixPQUFiLENBQXZCLEtBQ0ssT0FBT3pGLEdBQUcsR0FBRyxHQUFOLEdBQVl5RixPQUFuQjtBQUNOOztBQUVNLFNBQVNILFdBQVQsQ0FBcUJ0RixHQUFyQixFQUEwQjtBQUMvQixTQUFPdUYsWUFBWSxDQUFDdkYsR0FBRCxFQUFNLE1BQU4sRUFBYyxRQUFkLENBQW5CO0FBQ0Q7O0FBRU0sU0FBU2pCLGNBQVQsQ0FBd0JpQixHQUF4QixFQUE2QjtBQUNsQyxTQUFPdUYsWUFBWSxDQUFDdkYsR0FBRCxFQUFNLElBQU4sRUFBWSxXQUFaLENBQW5CO0FBQ0QsQyIsImZpbGUiOiIvcGFja2FnZXMvc29ja2V0LXN0cmVhbS1jbGllbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xyXG4gIHNldE1pbmltdW1Ccm93c2VyVmVyc2lvbnMsXHJcbn0gZnJvbSBcIm1ldGVvci9tb2Rlcm4tYnJvd3NlcnNcIjtcclxuXHJcbnNldE1pbmltdW1Ccm93c2VyVmVyc2lvbnMoe1xyXG4gIGNocm9tZTogMTYsXHJcbiAgZWRnZTogMTIsXHJcbiAgZmlyZWZveDogMTEsXHJcbiAgaWU6IDEwLFxyXG4gIG1vYmlsZVNhZmFyaTogWzYsIDFdLFxyXG4gIHBoYW50b21qczogMixcclxuICBzYWZhcmk6IDcsXHJcbiAgZWxlY3Ryb246IFswLCAyMF0sXHJcbn0sIG1vZHVsZS5pZCk7XHJcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gXCJtZXRlb3IvbWV0ZW9yXCI7XHJcbmltcG9ydCB7IHRvV2Vic29ja2V0VXJsIH0gZnJvbSBcIi4vdXJscy5qc1wiO1xyXG5pbXBvcnQgeyBTdHJlYW1DbGllbnRDb21tb24gfSBmcm9tIFwiLi9jb21tb24uanNcIjtcclxuXHJcbi8vIEBwYXJhbSBlbmRwb2ludCB7U3RyaW5nfSBVUkwgdG8gTWV0ZW9yIGFwcFxyXG4vLyAgIFwiaHR0cDovL3N1YmRvbWFpbi5tZXRlb3IuY29tL1wiIG9yIFwiL1wiIG9yXHJcbi8vICAgXCJkZHArc29ja2pzOi8vZm9vLSoqLm1ldGVvci5jb20vc29ja2pzXCJcclxuLy9cclxuLy8gV2UgZG8gc29tZSByZXdyaXRpbmcgb2YgdGhlIFVSTCB0byBldmVudHVhbGx5IG1ha2UgaXQgXCJ3czovL1wiIG9yIFwid3NzOi8vXCIsXHJcbi8vIHdoYXRldmVyIHdhcyBwYXNzZWQgaW4uICBBdCB0aGUgdmVyeSBsZWFzdCwgd2hhdCBNZXRlb3IuYWJzb2x1dGVVcmwoKSByZXR1cm5zXHJcbi8vIHVzIHNob3VsZCB3b3JrLlxyXG4vL1xyXG4vLyBXZSBkb24ndCBkbyBhbnkgaGVhcnRiZWF0aW5nLiAoVGhlIGxvZ2ljIHRoYXQgZGlkIHRoaXMgaW4gc29ja2pzIHdhcyByZW1vdmVkLFxyXG4vLyBiZWNhdXNlIGl0IHVzZWQgYSBidWlsdC1pbiBzb2NranMgbWVjaGFuaXNtLiBXZSBjb3VsZCBkbyBpdCB3aXRoIFdlYlNvY2tldFxyXG4vLyBwaW5nIGZyYW1lcyBvciB3aXRoIEREUC1sZXZlbCBtZXNzYWdlcy4pXHJcbmV4cG9ydCBjbGFzcyBDbGllbnRTdHJlYW0gZXh0ZW5kcyBTdHJlYW1DbGllbnRDb21tb24ge1xyXG4gIGNvbnN0cnVjdG9yKGVuZHBvaW50LCBvcHRpb25zKSB7XHJcbiAgICBzdXBlcihvcHRpb25zKTtcclxuXHJcbiAgICB0aGlzLmNsaWVudCA9IG51bGw7IC8vIGNyZWF0ZWQgaW4gX2xhdW5jaENvbm5lY3Rpb25cclxuICAgIHRoaXMuZW5kcG9pbnQgPSBlbmRwb2ludDtcclxuXHJcbiAgICB0aGlzLmhlYWRlcnMgPSB0aGlzLm9wdGlvbnMuaGVhZGVycyB8fCBPYmplY3QuY3JlYXRlKG51bGwpO1xyXG4gICAgdGhpcy5ucG1GYXllT3B0aW9ucyA9IHRoaXMub3B0aW9ucy5ucG1GYXllT3B0aW9ucyB8fCBPYmplY3QuY3JlYXRlKG51bGwpO1xyXG5cclxuICAgIHRoaXMuX2luaXRDb21tb24odGhpcy5vcHRpb25zKTtcclxuXHJcbiAgICAvLy8vIEtpY2tvZmYhXHJcbiAgICB0aGlzLl9sYXVuY2hDb25uZWN0aW9uKCk7XHJcbiAgfVxyXG5cclxuICAvLyBkYXRhIGlzIGEgdXRmOCBzdHJpbmcuIERhdGEgc2VudCB3aGlsZSBub3QgY29ubmVjdGVkIGlzIGRyb3BwZWQgb25cclxuICAvLyB0aGUgZmxvb3IsIGFuZCBpdCBpcyB1cCB0aGUgdXNlciBvZiB0aGlzIEFQSSB0byByZXRyYW5zbWl0IGxvc3RcclxuICAvLyBtZXNzYWdlcyBvbiAncmVzZXQnXHJcbiAgc2VuZChkYXRhKSB7XHJcbiAgICBpZiAodGhpcy5jdXJyZW50U3RhdHVzLmNvbm5lY3RlZCkge1xyXG4gICAgICB0aGlzLmNsaWVudC5zZW5kKGRhdGEpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gQ2hhbmdlcyB3aGVyZSB0aGlzIGNvbm5lY3Rpb24gcG9pbnRzXHJcbiAgX2NoYW5nZVVybCh1cmwpIHtcclxuICAgIHRoaXMuZW5kcG9pbnQgPSB1cmw7XHJcbiAgfVxyXG5cclxuICBfb25Db25uZWN0KGNsaWVudCkge1xyXG4gICAgaWYgKGNsaWVudCAhPT0gdGhpcy5jbGllbnQpIHtcclxuICAgICAgLy8gVGhpcyBjb25uZWN0aW9uIGlzIG5vdCBmcm9tIHRoZSBsYXN0IGNhbGwgdG8gX2xhdW5jaENvbm5lY3Rpb24uXHJcbiAgICAgIC8vIEJ1dCBfbGF1bmNoQ29ubmVjdGlvbiBjYWxscyBfY2xlYW51cCB3aGljaCBjbG9zZXMgcHJldmlvdXMgY29ubmVjdGlvbnMuXHJcbiAgICAgIC8vIEl0J3Mgb3VyIGJlbGllZiB0aGF0IHRoaXMgc3RpZmxlcyBmdXR1cmUgJ29wZW4nIGV2ZW50cywgYnV0IG1heWJlXHJcbiAgICAgIC8vIHdlIGFyZSB3cm9uZz9cclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdHb3Qgb3BlbiBmcm9tIGluYWN0aXZlIGNsaWVudCAnICsgISF0aGlzLmNsaWVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuX2ZvcmNlZFRvRGlzY29ubmVjdCkge1xyXG4gICAgICAvLyBXZSB3ZXJlIGFza2VkIHRvIGRpc2Nvbm5lY3QgYmV0d2VlbiB0cnlpbmcgdG8gb3BlbiB0aGUgY29ubmVjdGlvbiBhbmRcclxuICAgICAgLy8gYWN0dWFsbHkgb3BlbmluZyBpdC4gTGV0J3MganVzdCBwcmV0ZW5kIHRoaXMgbmV2ZXIgaGFwcGVuZWQuXHJcbiAgICAgIHRoaXMuY2xpZW50LmNsb3NlKCk7XHJcbiAgICAgIHRoaXMuY2xpZW50ID0gbnVsbDtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmN1cnJlbnRTdGF0dXMuY29ubmVjdGVkKSB7XHJcbiAgICAgIC8vIFdlIGFscmVhZHkgaGF2ZSBhIGNvbm5lY3Rpb24uIEl0IG11c3QgaGF2ZSBiZWVuIHRoZSBjYXNlIHRoYXQgd2VcclxuICAgICAgLy8gc3RhcnRlZCB0d28gcGFyYWxsZWwgY29ubmVjdGlvbiBhdHRlbXB0cyAoYmVjYXVzZSB3ZSB3YW50ZWQgdG9cclxuICAgICAgLy8gJ3JlY29ubmVjdCBub3cnIG9uIGEgaGFuZ2luZyBjb25uZWN0aW9uIGFuZCB3ZSBoYWQgbm8gd2F5IHRvIGNhbmNlbCB0aGVcclxuICAgICAgLy8gY29ubmVjdGlvbiBhdHRlbXB0LikgQnV0IHRoaXMgc2hvdWxkbid0IGhhcHBlbiAoc2ltaWxhcmx5IHRvIHRoZSBjbGllbnRcclxuICAgICAgLy8gIT09IHRoaXMuY2xpZW50IGNoZWNrIGFib3ZlKS5cclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdUd28gcGFyYWxsZWwgY29ubmVjdGlvbnM/Jyk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5fY2xlYXJDb25uZWN0aW9uVGltZXIoKTtcclxuXHJcbiAgICAvLyB1cGRhdGUgc3RhdHVzXHJcbiAgICB0aGlzLmN1cnJlbnRTdGF0dXMuc3RhdHVzID0gJ2Nvbm5lY3RlZCc7XHJcbiAgICB0aGlzLmN1cnJlbnRTdGF0dXMuY29ubmVjdGVkID0gdHJ1ZTtcclxuICAgIHRoaXMuY3VycmVudFN0YXR1cy5yZXRyeUNvdW50ID0gMDtcclxuICAgIHRoaXMuc3RhdHVzQ2hhbmdlZCgpO1xyXG5cclxuICAgIC8vIGZpcmUgcmVzZXRzLiBUaGlzIG11c3QgY29tZSBhZnRlciBzdGF0dXMgY2hhbmdlIHNvIHRoYXQgY2xpZW50c1xyXG4gICAgLy8gY2FuIGNhbGwgc2VuZCBmcm9tIHdpdGhpbiBhIHJlc2V0IGNhbGxiYWNrLlxyXG4gICAgdGhpcy5mb3JFYWNoQ2FsbGJhY2soJ3Jlc2V0JywgY2FsbGJhY2sgPT4ge1xyXG4gICAgICBjYWxsYmFjaygpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBfY2xlYW51cChtYXliZUVycm9yKSB7XHJcbiAgICB0aGlzLl9jbGVhckNvbm5lY3Rpb25UaW1lcigpO1xyXG4gICAgaWYgKHRoaXMuY2xpZW50KSB7XHJcbiAgICAgIHZhciBjbGllbnQgPSB0aGlzLmNsaWVudDtcclxuICAgICAgdGhpcy5jbGllbnQgPSBudWxsO1xyXG4gICAgICBjbGllbnQuY2xvc2UoKTtcclxuXHJcbiAgICAgIHRoaXMuZm9yRWFjaENhbGxiYWNrKCdkaXNjb25uZWN0JywgY2FsbGJhY2sgPT4ge1xyXG4gICAgICAgIGNhbGxiYWNrKG1heWJlRXJyb3IpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIF9jbGVhckNvbm5lY3Rpb25UaW1lcigpIHtcclxuICAgIGlmICh0aGlzLmNvbm5lY3Rpb25UaW1lcikge1xyXG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5jb25uZWN0aW9uVGltZXIpO1xyXG4gICAgICB0aGlzLmNvbm5lY3Rpb25UaW1lciA9IG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBfZ2V0UHJveHlVcmwodGFyZ2V0VXJsKSB7XHJcbiAgICAvLyBTaW1pbGFyIHRvIGNvZGUgaW4gdG9vbHMvaHR0cC1oZWxwZXJzLmpzLlxyXG4gICAgdmFyIHByb3h5ID0gcHJvY2Vzcy5lbnYuSFRUUF9QUk9YWSB8fCBwcm9jZXNzLmVudi5odHRwX3Byb3h5IHx8IG51bGw7XHJcbiAgICAvLyBpZiB3ZSdyZSBnb2luZyB0byBhIHNlY3VyZSB1cmwsIHRyeSB0aGUgaHR0cHNfcHJveHkgZW52IHZhcmlhYmxlIGZpcnN0LlxyXG4gICAgaWYgKHRhcmdldFVybC5tYXRjaCgvXndzczovKSkge1xyXG4gICAgICBwcm94eSA9IHByb2Nlc3MuZW52LkhUVFBTX1BST1hZIHx8IHByb2Nlc3MuZW52Lmh0dHBzX3Byb3h5IHx8IHByb3h5O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHByb3h5O1xyXG4gIH1cclxuXHJcbiAgX2xhdW5jaENvbm5lY3Rpb24oKSB7XHJcbiAgICB0aGlzLl9jbGVhbnVwKCk7IC8vIGNsZWFudXAgdGhlIG9sZCBzb2NrZXQsIGlmIHRoZXJlIHdhcyBvbmUuXHJcblxyXG4gICAgLy8gU2luY2Ugc2VydmVyLXRvLXNlcnZlciBERFAgaXMgc3RpbGwgYW4gZXhwZXJpbWVudGFsIGZlYXR1cmUsIHdlIG9ubHlcclxuICAgIC8vIHJlcXVpcmUgdGhlIG1vZHVsZSBpZiB3ZSBhY3R1YWxseSBjcmVhdGUgYSBzZXJ2ZXItdG8tc2VydmVyXHJcbiAgICAvLyBjb25uZWN0aW9uLlxyXG4gICAgdmFyIEZheWVXZWJTb2NrZXQgPSBOcG0ucmVxdWlyZSgnZmF5ZS13ZWJzb2NrZXQnKTtcclxuICAgIHZhciBkZWZsYXRlID0gTnBtLnJlcXVpcmUoJ3Blcm1lc3NhZ2UtZGVmbGF0ZScpO1xyXG5cclxuICAgIHZhciB0YXJnZXRVcmwgPSB0b1dlYnNvY2tldFVybCh0aGlzLmVuZHBvaW50KTtcclxuICAgIHZhciBmYXllT3B0aW9ucyA9IHtcclxuICAgICAgaGVhZGVyczogdGhpcy5oZWFkZXJzLFxyXG4gICAgICBleHRlbnNpb25zOiBbZGVmbGF0ZV1cclxuICAgIH07XHJcbiAgICBmYXllT3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oZmF5ZU9wdGlvbnMsIHRoaXMubnBtRmF5ZU9wdGlvbnMpO1xyXG4gICAgdmFyIHByb3h5VXJsID0gdGhpcy5fZ2V0UHJveHlVcmwodGFyZ2V0VXJsKTtcclxuICAgIGlmIChwcm94eVVybCkge1xyXG4gICAgICBmYXllT3B0aW9ucy5wcm94eSA9IHsgb3JpZ2luOiBwcm94eVVybCB9O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFdlIHdvdWxkIGxpa2UgdG8gc3BlY2lmeSAnZGRwJyBhcyB0aGUgc3VicHJvdG9jb2wgaGVyZS4gVGhlIG5wbSBtb2R1bGUgd2VcclxuICAgIC8vIHVzZWQgdG8gdXNlIGFzIGEgY2xpZW50IHdvdWxkIGZhaWwgdGhlIGhhbmRzaGFrZSBpZiB3ZSBhc2sgZm9yIGFcclxuICAgIC8vIHN1YnByb3RvY29sIGFuZCB0aGUgc2VydmVyIGRvZXNuJ3Qgc2VuZCBvbmUgYmFjayAoYW5kIHNvY2tqcyBkb2Vzbid0KS5cclxuICAgIC8vIEZheWUgZG9lc24ndCBoYXZlIHRoYXQgYmVoYXZpb3I7IGl0J3MgdW5jbGVhciBmcm9tIHJlYWRpbmcgUkZDIDY0NTUgaWZcclxuICAgIC8vIEZheWUgaXMgZXJyb25lb3VzIG9yIG5vdC4gIFNvIGZvciBub3csIHdlIGRvbid0IHNwZWNpZnkgcHJvdG9jb2xzLlxyXG4gICAgdmFyIHN1YnByb3RvY29scyA9IFtdO1xyXG5cclxuICAgIHZhciBjbGllbnQgPSAodGhpcy5jbGllbnQgPSBuZXcgRmF5ZVdlYlNvY2tldC5DbGllbnQoXHJcbiAgICAgIHRhcmdldFVybCxcclxuICAgICAgc3VicHJvdG9jb2xzLFxyXG4gICAgICBmYXllT3B0aW9uc1xyXG4gICAgKSk7XHJcblxyXG4gICAgdGhpcy5fY2xlYXJDb25uZWN0aW9uVGltZXIoKTtcclxuICAgIHRoaXMuY29ubmVjdGlvblRpbWVyID0gTWV0ZW9yLnNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICB0aGlzLl9sb3N0Q29ubmVjdGlvbihuZXcgdGhpcy5Db25uZWN0aW9uRXJyb3IoJ0REUCBjb25uZWN0aW9uIHRpbWVkIG91dCcpKTtcclxuICAgIH0sIHRoaXMuQ09OTkVDVF9USU1FT1VUKTtcclxuXHJcbiAgICB0aGlzLmNsaWVudC5vbihcclxuICAgICAgJ29wZW4nLFxyXG4gICAgICBNZXRlb3IuYmluZEVudmlyb25tZW50KCgpID0+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fb25Db25uZWN0KGNsaWVudCk7XHJcbiAgICAgIH0sICdzdHJlYW0gY29ubmVjdCBjYWxsYmFjaycpXHJcbiAgICApO1xyXG5cclxuICAgIHZhciBjbGllbnRPbklmQ3VycmVudCA9IChldmVudCwgZGVzY3JpcHRpb24sIGNhbGxiYWNrKSA9PiB7XHJcbiAgICAgIHRoaXMuY2xpZW50Lm9uKFxyXG4gICAgICAgIGV2ZW50LFxyXG4gICAgICAgIE1ldGVvci5iaW5kRW52aXJvbm1lbnQoKC4uLmFyZ3MpID0+IHtcclxuICAgICAgICAgIC8vIElnbm9yZSBldmVudHMgZnJvbSBhbnkgY29ubmVjdGlvbiB3ZSd2ZSBhbHJlYWR5IGNsZWFuZWQgdXAuXHJcbiAgICAgICAgICBpZiAoY2xpZW50ICE9PSB0aGlzLmNsaWVudCkgcmV0dXJuO1xyXG4gICAgICAgICAgY2FsbGJhY2soLi4uYXJncyk7XHJcbiAgICAgICAgfSwgZGVzY3JpcHRpb24pXHJcbiAgICAgICk7XHJcbiAgICB9O1xyXG5cclxuICAgIGNsaWVudE9uSWZDdXJyZW50KCdlcnJvcicsICdzdHJlYW0gZXJyb3IgY2FsbGJhY2snLCBlcnJvciA9PiB7XHJcbiAgICAgIGlmICghdGhpcy5vcHRpb25zLl9kb250UHJpbnRFcnJvcnMpXHJcbiAgICAgICAgTWV0ZW9yLl9kZWJ1Zygnc3RyZWFtIGVycm9yJywgZXJyb3IubWVzc2FnZSk7XHJcblxyXG4gICAgICAvLyBGYXllJ3MgJ2Vycm9yJyBvYmplY3QgaXMgbm90IGEgSlMgZXJyb3IgKGFuZCBhbW9uZyBvdGhlciB0aGluZ3MsXHJcbiAgICAgIC8vIGRvZXNuJ3Qgc3RyaW5naWZ5IHdlbGwpLiBDb252ZXJ0IGl0IHRvIG9uZS5cclxuICAgICAgdGhpcy5fbG9zdENvbm5lY3Rpb24obmV3IHRoaXMuQ29ubmVjdGlvbkVycm9yKGVycm9yLm1lc3NhZ2UpKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGNsaWVudE9uSWZDdXJyZW50KCdjbG9zZScsICdzdHJlYW0gY2xvc2UgY2FsbGJhY2snLCAoKSA9PiB7XHJcbiAgICAgIHRoaXMuX2xvc3RDb25uZWN0aW9uKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjbGllbnRPbklmQ3VycmVudCgnbWVzc2FnZScsICdzdHJlYW0gbWVzc2FnZSBjYWxsYmFjaycsIG1lc3NhZ2UgPT4ge1xyXG4gICAgICAvLyBJZ25vcmUgYmluYXJ5IGZyYW1lcywgd2hlcmUgbWVzc2FnZS5kYXRhIGlzIGEgQnVmZmVyXHJcbiAgICAgIGlmICh0eXBlb2YgbWVzc2FnZS5kYXRhICE9PSAnc3RyaW5nJykgcmV0dXJuO1xyXG5cclxuICAgICAgdGhpcy5mb3JFYWNoQ2FsbGJhY2soJ21lc3NhZ2UnLCBjYWxsYmFjayA9PiB7XHJcbiAgICAgICAgY2FsbGJhY2sobWVzc2FnZS5kYXRhKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgUmV0cnkgfSBmcm9tICdtZXRlb3IvcmV0cnknO1xyXG5cclxuY29uc3QgZm9yY2VkUmVjb25uZWN0RXJyb3IgPSBuZXcgRXJyb3IoXCJmb3JjZWQgcmVjb25uZWN0XCIpO1xyXG5cclxuZXhwb3J0IGNsYXNzIFN0cmVhbUNsaWVudENvbW1vbiB7XHJcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xyXG4gICAgdGhpcy5vcHRpb25zID0ge1xyXG4gICAgICByZXRyeTogdHJ1ZSxcclxuICAgICAgLi4uKG9wdGlvbnMgfHwgbnVsbCksXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuQ29ubmVjdGlvbkVycm9yID1cclxuICAgICAgb3B0aW9ucyAmJiBvcHRpb25zLkNvbm5lY3Rpb25FcnJvciB8fCBFcnJvcjtcclxuICB9XHJcblxyXG4gIC8vIFJlZ2lzdGVyIGZvciBjYWxsYmFja3MuXHJcbiAgb24obmFtZSwgY2FsbGJhY2spIHtcclxuICAgIGlmIChuYW1lICE9PSAnbWVzc2FnZScgJiYgbmFtZSAhPT0gJ3Jlc2V0JyAmJiBuYW1lICE9PSAnZGlzY29ubmVjdCcpXHJcbiAgICAgIHRocm93IG5ldyBFcnJvcigndW5rbm93biBldmVudCB0eXBlOiAnICsgbmFtZSk7XHJcblxyXG4gICAgaWYgKCF0aGlzLmV2ZW50Q2FsbGJhY2tzW25hbWVdKSB0aGlzLmV2ZW50Q2FsbGJhY2tzW25hbWVdID0gW107XHJcbiAgICB0aGlzLmV2ZW50Q2FsbGJhY2tzW25hbWVdLnB1c2goY2FsbGJhY2spO1xyXG4gIH1cclxuXHJcbiAgZm9yRWFjaENhbGxiYWNrKG5hbWUsIGNiKSB7XHJcbiAgICBpZiAoIXRoaXMuZXZlbnRDYWxsYmFja3NbbmFtZV0gfHwgIXRoaXMuZXZlbnRDYWxsYmFja3NbbmFtZV0ubGVuZ3RoKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmV2ZW50Q2FsbGJhY2tzW25hbWVdLmZvckVhY2goY2IpO1xyXG4gIH1cclxuXHJcbiAgX2luaXRDb21tb24ob3B0aW9ucykge1xyXG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwgT2JqZWN0LmNyZWF0ZShudWxsKTtcclxuXHJcbiAgICAvLy8vIENvbnN0YW50c1xyXG5cclxuICAgIC8vIGhvdyBsb25nIHRvIHdhaXQgdW50aWwgd2UgZGVjbGFyZSB0aGUgY29ubmVjdGlvbiBhdHRlbXB0XHJcbiAgICAvLyBmYWlsZWQuXHJcbiAgICB0aGlzLkNPTk5FQ1RfVElNRU9VVCA9IG9wdGlvbnMuY29ubmVjdFRpbWVvdXRNcyB8fCAxMDAwMDtcclxuXHJcbiAgICB0aGlzLmV2ZW50Q2FsbGJhY2tzID0gT2JqZWN0LmNyZWF0ZShudWxsKTsgLy8gbmFtZSAtPiBbY2FsbGJhY2tdXHJcblxyXG4gICAgdGhpcy5fZm9yY2VkVG9EaXNjb25uZWN0ID0gZmFsc2U7XHJcblxyXG4gICAgLy8vLyBSZWFjdGl2ZSBzdGF0dXNcclxuICAgIHRoaXMuY3VycmVudFN0YXR1cyA9IHtcclxuICAgICAgc3RhdHVzOiAnY29ubmVjdGluZycsXHJcbiAgICAgIGNvbm5lY3RlZDogZmFsc2UsXHJcbiAgICAgIHJldHJ5Q291bnQ6IDBcclxuICAgIH07XHJcblxyXG4gICAgaWYgKFBhY2thZ2UudHJhY2tlcikge1xyXG4gICAgICB0aGlzLnN0YXR1c0xpc3RlbmVycyA9IG5ldyBQYWNrYWdlLnRyYWNrZXIuVHJhY2tlci5EZXBlbmRlbmN5KCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5zdGF0dXNDaGFuZ2VkID0gKCkgPT4ge1xyXG4gICAgICBpZiAodGhpcy5zdGF0dXNMaXN0ZW5lcnMpIHtcclxuICAgICAgICB0aGlzLnN0YXR1c0xpc3RlbmVycy5jaGFuZ2VkKCk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLy8vLyBSZXRyeSBsb2dpY1xyXG4gICAgdGhpcy5fcmV0cnkgPSBuZXcgUmV0cnkoKTtcclxuICAgIHRoaXMuY29ubmVjdGlvblRpbWVyID0gbnVsbDtcclxuICB9XHJcblxyXG4gIC8vIFRyaWdnZXIgYSByZWNvbm5lY3QuXHJcbiAgcmVjb25uZWN0KG9wdGlvbnMpIHtcclxuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IE9iamVjdC5jcmVhdGUobnVsbCk7XHJcblxyXG4gICAgaWYgKG9wdGlvbnMudXJsKSB7XHJcbiAgICAgIHRoaXMuX2NoYW5nZVVybChvcHRpb25zLnVybCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG9wdGlvbnMuX3NvY2tqc09wdGlvbnMpIHtcclxuICAgICAgdGhpcy5vcHRpb25zLl9zb2NranNPcHRpb25zID0gb3B0aW9ucy5fc29ja2pzT3B0aW9ucztcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5jdXJyZW50U3RhdHVzLmNvbm5lY3RlZCkge1xyXG4gICAgICBpZiAob3B0aW9ucy5fZm9yY2UgfHwgb3B0aW9ucy51cmwpIHtcclxuICAgICAgICB0aGlzLl9sb3N0Q29ubmVjdGlvbihmb3JjZWRSZWNvbm5lY3RFcnJvcik7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGlmIHdlJ3JlIG1pZC1jb25uZWN0aW9uLCBzdG9wIGl0LlxyXG4gICAgaWYgKHRoaXMuY3VycmVudFN0YXR1cy5zdGF0dXMgPT09ICdjb25uZWN0aW5nJykge1xyXG4gICAgICAvLyBQcmV0ZW5kIGl0J3MgYSBjbGVhbiBjbG9zZS5cclxuICAgICAgdGhpcy5fbG9zdENvbm5lY3Rpb24oKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLl9yZXRyeS5jbGVhcigpO1xyXG4gICAgdGhpcy5jdXJyZW50U3RhdHVzLnJldHJ5Q291bnQgLT0gMTsgLy8gZG9uJ3QgY291bnQgbWFudWFsIHJldHJpZXNcclxuICAgIHRoaXMuX3JldHJ5Tm93KCk7XHJcbiAgfVxyXG5cclxuICBkaXNjb25uZWN0KG9wdGlvbnMpIHtcclxuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IE9iamVjdC5jcmVhdGUobnVsbCk7XHJcblxyXG4gICAgLy8gRmFpbGVkIGlzIHBlcm1hbmVudC4gSWYgd2UncmUgZmFpbGVkLCBkb24ndCBsZXQgcGVvcGxlIGdvIGJhY2tcclxuICAgIC8vIG9ubGluZSBieSBjYWxsaW5nICdkaXNjb25uZWN0JyB0aGVuICdyZWNvbm5lY3QnLlxyXG4gICAgaWYgKHRoaXMuX2ZvcmNlZFRvRGlzY29ubmVjdCkgcmV0dXJuO1xyXG5cclxuICAgIC8vIElmIF9wZXJtYW5lbnQgaXMgc2V0LCBwZXJtYW5lbnRseSBkaXNjb25uZWN0IGEgc3RyZWFtLiBPbmNlIGEgc3RyZWFtXHJcbiAgICAvLyBpcyBmb3JjZWQgdG8gZGlzY29ubmVjdCwgaXQgY2FuIG5ldmVyIHJlY29ubmVjdC4gVGhpcyBpcyBmb3JcclxuICAgIC8vIGVycm9yIGNhc2VzIHN1Y2ggYXMgZGRwIHZlcnNpb24gbWlzbWF0Y2gsIHdoZXJlIHRyeWluZyBhZ2FpblxyXG4gICAgLy8gd29uJ3QgZml4IHRoZSBwcm9ibGVtLlxyXG4gICAgaWYgKG9wdGlvbnMuX3Blcm1hbmVudCkge1xyXG4gICAgICB0aGlzLl9mb3JjZWRUb0Rpc2Nvbm5lY3QgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuX2NsZWFudXAoKTtcclxuICAgIHRoaXMuX3JldHJ5LmNsZWFyKCk7XHJcblxyXG4gICAgdGhpcy5jdXJyZW50U3RhdHVzID0ge1xyXG4gICAgICBzdGF0dXM6IG9wdGlvbnMuX3Blcm1hbmVudCA/ICdmYWlsZWQnIDogJ29mZmxpbmUnLFxyXG4gICAgICBjb25uZWN0ZWQ6IGZhbHNlLFxyXG4gICAgICByZXRyeUNvdW50OiAwXHJcbiAgICB9O1xyXG5cclxuICAgIGlmIChvcHRpb25zLl9wZXJtYW5lbnQgJiYgb3B0aW9ucy5fZXJyb3IpXHJcbiAgICAgIHRoaXMuY3VycmVudFN0YXR1cy5yZWFzb24gPSBvcHRpb25zLl9lcnJvcjtcclxuXHJcbiAgICB0aGlzLnN0YXR1c0NoYW5nZWQoKTtcclxuICB9XHJcblxyXG4gIC8vIG1heWJlRXJyb3IgaXMgc2V0IHVubGVzcyBpdCdzIGEgY2xlYW4gcHJvdG9jb2wtbGV2ZWwgY2xvc2UuXHJcbiAgX2xvc3RDb25uZWN0aW9uKG1heWJlRXJyb3IpIHtcclxuICAgIHRoaXMuX2NsZWFudXAobWF5YmVFcnJvcik7XHJcbiAgICB0aGlzLl9yZXRyeUxhdGVyKG1heWJlRXJyb3IpOyAvLyBzZXRzIHN0YXR1cy4gbm8gbmVlZCB0byBkbyBpdCBoZXJlLlxyXG4gIH1cclxuXHJcbiAgLy8gZmlyZWQgd2hlbiB3ZSBkZXRlY3QgdGhhdCB3ZSd2ZSBnb25lIG9ubGluZS4gdHJ5IHRvIHJlY29ubmVjdFxyXG4gIC8vIGltbWVkaWF0ZWx5LlxyXG4gIF9vbmxpbmUoKSB7XHJcbiAgICAvLyBpZiB3ZSd2ZSByZXF1ZXN0ZWQgdG8gYmUgb2ZmbGluZSBieSBkaXNjb25uZWN0aW5nLCBkb24ndCByZWNvbm5lY3QuXHJcbiAgICBpZiAodGhpcy5jdXJyZW50U3RhdHVzLnN0YXR1cyAhPSAnb2ZmbGluZScpIHRoaXMucmVjb25uZWN0KCk7XHJcbiAgfVxyXG5cclxuICBfcmV0cnlMYXRlcihtYXliZUVycm9yKSB7XHJcbiAgICB2YXIgdGltZW91dCA9IDA7XHJcbiAgICBpZiAodGhpcy5vcHRpb25zLnJldHJ5IHx8XHJcbiAgICAgICAgbWF5YmVFcnJvciA9PT0gZm9yY2VkUmVjb25uZWN0RXJyb3IpIHtcclxuICAgICAgdGltZW91dCA9IHRoaXMuX3JldHJ5LnJldHJ5TGF0ZXIoXHJcbiAgICAgICAgdGhpcy5jdXJyZW50U3RhdHVzLnJldHJ5Q291bnQsXHJcbiAgICAgICAgdGhpcy5fcmV0cnlOb3cuYmluZCh0aGlzKVxyXG4gICAgICApO1xyXG4gICAgICB0aGlzLmN1cnJlbnRTdGF0dXMuc3RhdHVzID0gJ3dhaXRpbmcnO1xyXG4gICAgICB0aGlzLmN1cnJlbnRTdGF0dXMucmV0cnlUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCkgKyB0aW1lb3V0O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5jdXJyZW50U3RhdHVzLnN0YXR1cyA9ICdmYWlsZWQnO1xyXG4gICAgICBkZWxldGUgdGhpcy5jdXJyZW50U3RhdHVzLnJldHJ5VGltZTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmN1cnJlbnRTdGF0dXMuY29ubmVjdGVkID0gZmFsc2U7XHJcbiAgICB0aGlzLnN0YXR1c0NoYW5nZWQoKTtcclxuICB9XHJcblxyXG4gIF9yZXRyeU5vdygpIHtcclxuICAgIGlmICh0aGlzLl9mb3JjZWRUb0Rpc2Nvbm5lY3QpIHJldHVybjtcclxuXHJcbiAgICB0aGlzLmN1cnJlbnRTdGF0dXMucmV0cnlDb3VudCArPSAxO1xyXG4gICAgdGhpcy5jdXJyZW50U3RhdHVzLnN0YXR1cyA9ICdjb25uZWN0aW5nJztcclxuICAgIHRoaXMuY3VycmVudFN0YXR1cy5jb25uZWN0ZWQgPSBmYWxzZTtcclxuICAgIGRlbGV0ZSB0aGlzLmN1cnJlbnRTdGF0dXMucmV0cnlUaW1lO1xyXG4gICAgdGhpcy5zdGF0dXNDaGFuZ2VkKCk7XHJcblxyXG4gICAgdGhpcy5fbGF1bmNoQ29ubmVjdGlvbigpO1xyXG4gIH1cclxuXHJcbiAgLy8gR2V0IGN1cnJlbnQgc3RhdHVzLiBSZWFjdGl2ZS5cclxuICBzdGF0dXMoKSB7XHJcbiAgICBpZiAodGhpcy5zdGF0dXNMaXN0ZW5lcnMpIHtcclxuICAgICAgdGhpcy5zdGF0dXNMaXN0ZW5lcnMuZGVwZW5kKCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5jdXJyZW50U3RhdHVzO1xyXG4gIH1cclxufVxyXG4iLCIvLyBAcGFyYW0gdXJsIHtTdHJpbmd9IFVSTCB0byBNZXRlb3IgYXBwLCBlZzpcclxuLy8gICBcIi9cIiBvciBcIm1hZGV3aXRoLm1ldGVvci5jb21cIiBvciBcImh0dHBzOi8vZm9vLm1ldGVvci5jb21cIlxyXG4vLyAgIG9yIFwiZGRwK3NvY2tqczovL2RkcC0tKioqKi1mb28ubWV0ZW9yLmNvbS9zb2NranNcIlxyXG4vLyBAcmV0dXJucyB7U3RyaW5nfSBVUkwgdG8gdGhlIGVuZHBvaW50IHdpdGggdGhlIHNwZWNpZmljIHNjaGVtZSBhbmQgc3ViUGF0aCwgZS5nLlxyXG4vLyBmb3Igc2NoZW1lIFwiaHR0cFwiIGFuZCBzdWJQYXRoIFwic29ja2pzXCJcclxuLy8gICBcImh0dHA6Ly9zdWJkb21haW4ubWV0ZW9yLmNvbS9zb2NranNcIiBvciBcIi9zb2NranNcIlxyXG4vLyAgIG9yIFwiaHR0cHM6Ly9kZHAtLTEyMzQtZm9vLm1ldGVvci5jb20vc29ja2pzXCJcclxuZnVuY3Rpb24gdHJhbnNsYXRlVXJsKHVybCwgbmV3U2NoZW1lQmFzZSwgc3ViUGF0aCkge1xyXG4gIGlmICghbmV3U2NoZW1lQmFzZSkge1xyXG4gICAgbmV3U2NoZW1lQmFzZSA9ICdodHRwJztcclxuICB9XHJcblxyXG4gIGlmIChzdWJQYXRoICE9PSBcInNvY2tqc1wiICYmIHVybC5zdGFydHNXaXRoKFwiL1wiKSkge1xyXG4gICAgdXJsID0gTWV0ZW9yLmFic29sdXRlVXJsKHVybC5zdWJzdHIoMSkpO1xyXG4gIH1cclxuXHJcbiAgdmFyIGRkcFVybE1hdGNoID0gdXJsLm1hdGNoKC9eZGRwKGk/KVxcK3NvY2tqczpcXC9cXC8vKTtcclxuICB2YXIgaHR0cFVybE1hdGNoID0gdXJsLm1hdGNoKC9eaHR0cChzPyk6XFwvXFwvLyk7XHJcbiAgdmFyIG5ld1NjaGVtZTtcclxuICBpZiAoZGRwVXJsTWF0Y2gpIHtcclxuICAgIC8vIFJlbW92ZSBzY2hlbWUgYW5kIHNwbGl0IG9mZiB0aGUgaG9zdC5cclxuICAgIHZhciB1cmxBZnRlckREUCA9IHVybC5zdWJzdHIoZGRwVXJsTWF0Y2hbMF0ubGVuZ3RoKTtcclxuICAgIG5ld1NjaGVtZSA9IGRkcFVybE1hdGNoWzFdID09PSAnaScgPyBuZXdTY2hlbWVCYXNlIDogbmV3U2NoZW1lQmFzZSArICdzJztcclxuICAgIHZhciBzbGFzaFBvcyA9IHVybEFmdGVyRERQLmluZGV4T2YoJy8nKTtcclxuICAgIHZhciBob3N0ID0gc2xhc2hQb3MgPT09IC0xID8gdXJsQWZ0ZXJERFAgOiB1cmxBZnRlckREUC5zdWJzdHIoMCwgc2xhc2hQb3MpO1xyXG4gICAgdmFyIHJlc3QgPSBzbGFzaFBvcyA9PT0gLTEgPyAnJyA6IHVybEFmdGVyRERQLnN1YnN0cihzbGFzaFBvcyk7XHJcblxyXG4gICAgLy8gSW4gdGhlIGhvc3QgKE9OTFkhKSwgY2hhbmdlICcqJyBjaGFyYWN0ZXJzIGludG8gcmFuZG9tIGRpZ2l0cy4gVGhpc1xyXG4gICAgLy8gYWxsb3dzIGRpZmZlcmVudCBzdHJlYW0gY29ubmVjdGlvbnMgdG8gY29ubmVjdCB0byBkaWZmZXJlbnQgaG9zdG5hbWVzXHJcbiAgICAvLyBhbmQgYXZvaWQgYnJvd3NlciBwZXItaG9zdG5hbWUgY29ubmVjdGlvbiBsaW1pdHMuXHJcbiAgICBob3N0ID0gaG9zdC5yZXBsYWNlKC9cXCovZywgKCkgPT4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApKTtcclxuXHJcbiAgICByZXR1cm4gbmV3U2NoZW1lICsgJzovLycgKyBob3N0ICsgcmVzdDtcclxuICB9IGVsc2UgaWYgKGh0dHBVcmxNYXRjaCkge1xyXG4gICAgbmV3U2NoZW1lID0gIWh0dHBVcmxNYXRjaFsxXSA/IG5ld1NjaGVtZUJhc2UgOiBuZXdTY2hlbWVCYXNlICsgJ3MnO1xyXG4gICAgdmFyIHVybEFmdGVySHR0cCA9IHVybC5zdWJzdHIoaHR0cFVybE1hdGNoWzBdLmxlbmd0aCk7XHJcbiAgICB1cmwgPSBuZXdTY2hlbWUgKyAnOi8vJyArIHVybEFmdGVySHR0cDtcclxuICB9XHJcblxyXG4gIC8vIFByZWZpeCBGUUROcyBidXQgbm90IHJlbGF0aXZlIFVSTHNcclxuICBpZiAodXJsLmluZGV4T2YoJzovLycpID09PSAtMSAmJiAhdXJsLnN0YXJ0c1dpdGgoJy8nKSkge1xyXG4gICAgdXJsID0gbmV3U2NoZW1lQmFzZSArICc6Ly8nICsgdXJsO1xyXG4gIH1cclxuXHJcbiAgLy8gWFhYIFRoaXMgaXMgbm90IHdoYXQgd2Ugc2hvdWxkIGJlIGRvaW5nOiBpZiBJIGhhdmUgYSBzaXRlXHJcbiAgLy8gZGVwbG95ZWQgYXQgXCIvZm9vXCIsIHRoZW4gRERQLmNvbm5lY3QoXCIvXCIpIHNob3VsZCBhY3R1YWxseSBjb25uZWN0XHJcbiAgLy8gdG8gXCIvXCIsIG5vdCB0byBcIi9mb29cIi4gXCIvXCIgaXMgYW4gYWJzb2x1dGUgcGF0aC4gKENvbnRyYXN0OiBpZlxyXG4gIC8vIGRlcGxveWVkIGF0IFwiL2Zvb1wiLCBpdCB3b3VsZCBiZSByZWFzb25hYmxlIGZvciBERFAuY29ubmVjdChcImJhclwiKVxyXG4gIC8vIHRvIGNvbm5lY3QgdG8gXCIvZm9vL2JhclwiKS5cclxuICAvL1xyXG4gIC8vIFdlIHNob3VsZCBtYWtlIHRoaXMgcHJvcGVybHkgaG9ub3IgYWJzb2x1dGUgcGF0aHMgcmF0aGVyIHRoYW5cclxuICAvLyBmb3JjaW5nIHRoZSBwYXRoIHRvIGJlIHJlbGF0aXZlIHRvIHRoZSBzaXRlIHJvb3QuIFNpbXVsdGFuZW91c2x5LFxyXG4gIC8vIHdlIHNob3VsZCBzZXQgRERQX0RFRkFVTFRfQ09OTkVDVElPTl9VUkwgdG8gaW5jbHVkZSB0aGUgc2l0ZVxyXG4gIC8vIHJvb3QuIFNlZSBhbHNvIGNsaWVudF9jb252ZW5pZW5jZS5qcyAjUmF0aW9uYWxpemluZ1JlbGF0aXZlRERQVVJMc1xyXG4gIHVybCA9IE1ldGVvci5fcmVsYXRpdmVUb1NpdGVSb290VXJsKHVybCk7XHJcblxyXG4gIGlmICh1cmwuZW5kc1dpdGgoJy8nKSkgcmV0dXJuIHVybCArIHN1YlBhdGg7XHJcbiAgZWxzZSByZXR1cm4gdXJsICsgJy8nICsgc3ViUGF0aDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHRvU29ja2pzVXJsKHVybCkge1xyXG4gIHJldHVybiB0cmFuc2xhdGVVcmwodXJsLCAnaHR0cCcsICdzb2NranMnKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHRvV2Vic29ja2V0VXJsKHVybCkge1xyXG4gIHJldHVybiB0cmFuc2xhdGVVcmwodXJsLCAnd3MnLCAnd2Vic29ja2V0Jyk7XHJcbn1cclxuIl19
