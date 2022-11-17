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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc29ja2V0LXN0cmVhbS1jbGllbnQvc2VydmVyLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zb2NrZXQtc3RyZWFtLWNsaWVudC9ub2RlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zb2NrZXQtc3RyZWFtLWNsaWVudC9jb21tb24uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3NvY2tldC1zdHJlYW0tY2xpZW50L3VybHMuanMiXSwibmFtZXMiOlsic2V0TWluaW11bUJyb3dzZXJWZXJzaW9ucyIsIm1vZHVsZTEiLCJsaW5rIiwidiIsImNocm9tZSIsImVkZ2UiLCJmaXJlZm94IiwiaWUiLCJtb2JpbGVTYWZhcmkiLCJwaGFudG9tanMiLCJzYWZhcmkiLCJlbGVjdHJvbiIsIm1vZHVsZSIsImlkIiwiZXhwb3J0IiwiQ2xpZW50U3RyZWFtIiwiTWV0ZW9yIiwidG9XZWJzb2NrZXRVcmwiLCJTdHJlYW1DbGllbnRDb21tb24iLCJjb25zdHJ1Y3RvciIsImVuZHBvaW50Iiwib3B0aW9ucyIsImNsaWVudCIsImhlYWRlcnMiLCJPYmplY3QiLCJjcmVhdGUiLCJucG1GYXllT3B0aW9ucyIsIl9pbml0Q29tbW9uIiwiX2xhdW5jaENvbm5lY3Rpb24iLCJzZW5kIiwiZGF0YSIsImN1cnJlbnRTdGF0dXMiLCJjb25uZWN0ZWQiLCJfY2hhbmdlVXJsIiwidXJsIiwiX29uQ29ubmVjdCIsIkVycm9yIiwiX2ZvcmNlZFRvRGlzY29ubmVjdCIsImNsb3NlIiwiX2NsZWFyQ29ubmVjdGlvblRpbWVyIiwic3RhdHVzIiwicmV0cnlDb3VudCIsInN0YXR1c0NoYW5nZWQiLCJmb3JFYWNoQ2FsbGJhY2siLCJjYWxsYmFjayIsIl9jbGVhbnVwIiwibWF5YmVFcnJvciIsImNvbm5lY3Rpb25UaW1lciIsImNsZWFyVGltZW91dCIsIl9nZXRQcm94eVVybCIsInRhcmdldFVybCIsInByb3h5IiwicHJvY2VzcyIsImVudiIsIkhUVFBfUFJPWFkiLCJodHRwX3Byb3h5IiwibWF0Y2giLCJIVFRQU19QUk9YWSIsImh0dHBzX3Byb3h5IiwiRmF5ZVdlYlNvY2tldCIsIk5wbSIsInJlcXVpcmUiLCJkZWZsYXRlIiwiZmF5ZU9wdGlvbnMiLCJleHRlbnNpb25zIiwiYXNzaWduIiwicHJveHlVcmwiLCJvcmlnaW4iLCJzdWJwcm90b2NvbHMiLCJDbGllbnQiLCJzZXRUaW1lb3V0IiwiX2xvc3RDb25uZWN0aW9uIiwiQ29ubmVjdGlvbkVycm9yIiwiQ09OTkVDVF9USU1FT1VUIiwib24iLCJiaW5kRW52aXJvbm1lbnQiLCJjbGllbnRPbklmQ3VycmVudCIsImV2ZW50IiwiZGVzY3JpcHRpb24iLCJlcnJvciIsIl9kb250UHJpbnRFcnJvcnMiLCJfZGVidWciLCJtZXNzYWdlIiwiX29iamVjdFNwcmVhZCIsImRlZmF1bHQiLCJSZXRyeSIsImZvcmNlZFJlY29ubmVjdEVycm9yIiwicmV0cnkiLCJuYW1lIiwiZXZlbnRDYWxsYmFja3MiLCJwdXNoIiwiY2IiLCJsZW5ndGgiLCJmb3JFYWNoIiwiY29ubmVjdFRpbWVvdXRNcyIsIlBhY2thZ2UiLCJ0cmFja2VyIiwic3RhdHVzTGlzdGVuZXJzIiwiVHJhY2tlciIsIkRlcGVuZGVuY3kiLCJjaGFuZ2VkIiwiX3JldHJ5IiwicmVjb25uZWN0IiwiX3NvY2tqc09wdGlvbnMiLCJfZm9yY2UiLCJjbGVhciIsIl9yZXRyeU5vdyIsImRpc2Nvbm5lY3QiLCJfcGVybWFuZW50IiwiX2Vycm9yIiwicmVhc29uIiwiX3JldHJ5TGF0ZXIiLCJfb25saW5lIiwidGltZW91dCIsInJldHJ5TGF0ZXIiLCJiaW5kIiwicmV0cnlUaW1lIiwiRGF0ZSIsImdldFRpbWUiLCJkZXBlbmQiLCJ0b1NvY2tqc1VybCIsInRyYW5zbGF0ZVVybCIsIm5ld1NjaGVtZUJhc2UiLCJzdWJQYXRoIiwic3RhcnRzV2l0aCIsImFic29sdXRlVXJsIiwic3Vic3RyIiwiZGRwVXJsTWF0Y2giLCJodHRwVXJsTWF0Y2giLCJuZXdTY2hlbWUiLCJ1cmxBZnRlckREUCIsInNsYXNoUG9zIiwiaW5kZXhPZiIsImhvc3QiLCJyZXN0IiwicmVwbGFjZSIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsInVybEFmdGVySHR0cCIsIl9yZWxhdGl2ZVRvU2l0ZVJvb3RVcmwiLCJlbmRzV2l0aCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxNQUFJQSx5QkFBSjtBQUE4QkMsU0FBTyxDQUFDQyxJQUFSLENBQWEsd0JBQWIsRUFBc0M7QUFBQ0YsNkJBQXlCLENBQUNHLENBQUQsRUFBRztBQUFDSCwrQkFBeUIsR0FBQ0csQ0FBMUI7QUFBNEI7O0FBQTFELEdBQXRDLEVBQWtHLENBQWxHO0FBSTlCSCwyQkFBeUIsQ0FBQztBQUN4QkksVUFBTSxFQUFFLEVBRGdCO0FBRXhCQyxRQUFJLEVBQUUsRUFGa0I7QUFHeEJDLFdBQU8sRUFBRSxFQUhlO0FBSXhCQyxNQUFFLEVBQUUsRUFKb0I7QUFLeEJDLGdCQUFZLEVBQUUsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUxVO0FBTXhCQyxhQUFTLEVBQUUsQ0FOYTtBQU94QkMsVUFBTSxFQUFFLENBUGdCO0FBUXhCQyxZQUFRLEVBQUUsQ0FBQyxDQUFELEVBQUksRUFBSjtBQVJjLEdBQUQsRUFTdEJDLE1BQU0sQ0FBQ0MsRUFUZSxDQUF6Qjs7Ozs7Ozs7Ozs7OztBQ0pBWixTQUFPLENBQUNhLE1BQVIsQ0FBZTtBQUFDQyxnQkFBWSxFQUFDLE1BQUlBO0FBQWxCLEdBQWY7QUFBZ0QsTUFBSUMsTUFBSjtBQUFXZixTQUFPLENBQUNDLElBQVIsQ0FBYSxlQUFiLEVBQTZCO0FBQUNjLFVBQU0sQ0FBQ2IsQ0FBRCxFQUFHO0FBQUNhLFlBQU0sR0FBQ2IsQ0FBUDtBQUFTOztBQUFwQixHQUE3QixFQUFtRCxDQUFuRDtBQUFzRCxNQUFJYyxjQUFKO0FBQW1CaEIsU0FBTyxDQUFDQyxJQUFSLENBQWEsV0FBYixFQUF5QjtBQUFDZSxrQkFBYyxDQUFDZCxDQUFELEVBQUc7QUFB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R0FBYixDQUFKLEVBQXVCLE9BQU8zRyxHQUFHLEdBQUd5RixPQUFiLENBQXZCLEtBQ0ssT0FBT3pGLEdBQUcsR0FBRyxHQUFOLEdBQVl5RixPQUFuQjtBQUNOOztBQUVNLFNBQVNILFdBQVQsQ0FBcUJ0RixHQUFyQixFQUEwQjtBQUMvQixTQUFPdUYsWUFBWSxDQUFDdkYsR0FBRCxFQUFNLE1BQU4sRUFBYyxRQUFkLENBQW5CO0FBQ0Q7O0FBRU0sU0FBU2pCLGNBQVQsQ0FBd0JpQixHQUF4QixFQUE2QjtBQUNsQyxTQUFPdUYsWUFBWSxDQUFDdkYsR0FBRCxFQUFNLElBQU4sRUFBWSxXQUFaLENBQW5CO0FBQ0QsQyIsImZpbGUiOiIvcGFja2FnZXMvc29ja2V0LXN0cmVhbS1jbGllbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBzZXRNaW5pbXVtQnJvd3NlclZlcnNpb25zLFxufSBmcm9tIFwibWV0ZW9yL21vZGVybi1icm93c2Vyc1wiO1xuXG5zZXRNaW5pbXVtQnJvd3NlclZlcnNpb25zKHtcbiAgY2hyb21lOiAxNixcbiAgZWRnZTogMTIsXG4gIGZpcmVmb3g6IDExLFxuICBpZTogMTAsXG4gIG1vYmlsZVNhZmFyaTogWzYsIDFdLFxuICBwaGFudG9tanM6IDIsXG4gIHNhZmFyaTogNyxcbiAgZWxlY3Ryb246IFswLCAyMF0sXG59LCBtb2R1bGUuaWQpO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSBcIm1ldGVvci9tZXRlb3JcIjtcbmltcG9ydCB7IHRvV2Vic29ja2V0VXJsIH0gZnJvbSBcIi4vdXJscy5qc1wiO1xuaW1wb3J0IHsgU3RyZWFtQ2xpZW50Q29tbW9uIH0gZnJvbSBcIi4vY29tbW9uLmpzXCI7XG5cbi8vIEBwYXJhbSBlbmRwb2ludCB7U3RyaW5nfSBVUkwgdG8gTWV0ZW9yIGFwcFxuLy8gICBcImh0dHA6Ly9zdWJkb21haW4ubWV0ZW9yLmNvbS9cIiBvciBcIi9cIiBvclxuLy8gICBcImRkcCtzb2NranM6Ly9mb28tKioubWV0ZW9yLmNvbS9zb2NranNcIlxuLy9cbi8vIFdlIGRvIHNvbWUgcmV3cml0aW5nIG9mIHRoZSBVUkwgdG8gZXZlbnR1YWxseSBtYWtlIGl0IFwid3M6Ly9cIiBvciBcIndzczovL1wiLFxuLy8gd2hhdGV2ZXIgd2FzIHBhc3NlZCBpbi4gIEF0IHRoZSB2ZXJ5IGxlYXN0LCB3aGF0IE1ldGVvci5hYnNvbHV0ZVVybCgpIHJldHVybnNcbi8vIHVzIHNob3VsZCB3b3JrLlxuLy9cbi8vIFdlIGRvbid0IGRvIGFueSBoZWFydGJlYXRpbmcuIChUaGUgbG9naWMgdGhhdCBkaWQgdGhpcyBpbiBzb2NranMgd2FzIHJlbW92ZWQsXG4vLyBiZWNhdXNlIGl0IHVzZWQgYSBidWlsdC1pbiBzb2NranMgbWVjaGFuaXNtLiBXZSBjb3VsZCBkbyBpdCB3aXRoIFdlYlNvY2tldFxuLy8gcGluZyBmcmFtZXMgb3Igd2l0aCBERFAtbGV2ZWwgbWVzc2FnZXMuKVxuZXhwb3J0IGNsYXNzIENsaWVudFN0cmVhbSBleHRlbmRzIFN0cmVhbUNsaWVudENvbW1vbiB7XG4gIGNvbnN0cnVjdG9yKGVuZHBvaW50LCBvcHRpb25zKSB7XG4gICAgc3VwZXIob3B0aW9ucyk7XG5cbiAgICB0aGlzLmNsaWVudCA9IG51bGw7IC8vIGNyZWF0ZWQgaW4gX2xhdW5jaENvbm5lY3Rpb25cbiAgICB0aGlzLmVuZHBvaW50ID0gZW5kcG9pbnQ7XG5cbiAgICB0aGlzLmhlYWRlcnMgPSB0aGlzLm9wdGlvbnMuaGVhZGVycyB8fCBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIHRoaXMubnBtRmF5ZU9wdGlvbnMgPSB0aGlzLm9wdGlvbnMubnBtRmF5ZU9wdGlvbnMgfHwgT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuICAgIHRoaXMuX2luaXRDb21tb24odGhpcy5vcHRpb25zKTtcblxuICAgIC8vLy8gS2lja29mZiFcbiAgICB0aGlzLl9sYXVuY2hDb25uZWN0aW9uKCk7XG4gIH1cblxuICAvLyBkYXRhIGlzIGEgdXRmOCBzdHJpbmcuIERhdGEgc2VudCB3aGlsZSBub3QgY29ubmVjdGVkIGlzIGRyb3BwZWQgb25cbiAgLy8gdGhlIGZsb29yLCBhbmQgaXQgaXMgdXAgdGhlIHVzZXIgb2YgdGhpcyBBUEkgdG8gcmV0cmFuc21pdCBsb3N0XG4gIC8vIG1lc3NhZ2VzIG9uICdyZXNldCdcbiAgc2VuZChkYXRhKSB7XG4gICAgaWYgKHRoaXMuY3VycmVudFN0YXR1cy5jb25uZWN0ZWQpIHtcbiAgICAgIHRoaXMuY2xpZW50LnNlbmQoZGF0YSk7XG4gICAgfVxuICB9XG5cbiAgLy8gQ2hhbmdlcyB3aGVyZSB0aGlzIGNvbm5lY3Rpb24gcG9pbnRzXG4gIF9jaGFuZ2VVcmwodXJsKSB7XG4gICAgdGhpcy5lbmRwb2ludCA9IHVybDtcbiAgfVxuXG4gIF9vbkNvbm5lY3QoY2xpZW50KSB7XG4gICAgaWYgKGNsaWVudCAhPT0gdGhpcy5jbGllbnQpIHtcbiAgICAgIC8vIFRoaXMgY29ubmVjdGlvbiBpcyBub3QgZnJvbSB0aGUgbGFzdCBjYWxsIHRvIF9sYXVuY2hDb25uZWN0aW9uLlxuICAgICAgLy8gQnV0IF9sYXVuY2hDb25uZWN0aW9uIGNhbGxzIF9jbGVhbnVwIHdoaWNoIGNsb3NlcyBwcmV2aW91cyBjb25uZWN0aW9ucy5cbiAgICAgIC8vIEl0J3Mgb3VyIGJlbGllZiB0aGF0IHRoaXMgc3RpZmxlcyBmdXR1cmUgJ29wZW4nIGV2ZW50cywgYnV0IG1heWJlXG4gICAgICAvLyB3ZSBhcmUgd3Jvbmc/XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0dvdCBvcGVuIGZyb20gaW5hY3RpdmUgY2xpZW50ICcgKyAhIXRoaXMuY2xpZW50KTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZm9yY2VkVG9EaXNjb25uZWN0KSB7XG4gICAgICAvLyBXZSB3ZXJlIGFza2VkIHRvIGRpc2Nvbm5lY3QgYmV0d2VlbiB0cnlpbmcgdG8gb3BlbiB0aGUgY29ubmVjdGlvbiBhbmRcbiAgICAgIC8vIGFjdHVhbGx5IG9wZW5pbmcgaXQuIExldCdzIGp1c3QgcHJldGVuZCB0aGlzIG5ldmVyIGhhcHBlbmVkLlxuICAgICAgdGhpcy5jbGllbnQuY2xvc2UoKTtcbiAgICAgIHRoaXMuY2xpZW50ID0gbnVsbDtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jdXJyZW50U3RhdHVzLmNvbm5lY3RlZCkge1xuICAgICAgLy8gV2UgYWxyZWFkeSBoYXZlIGEgY29ubmVjdGlvbi4gSXQgbXVzdCBoYXZlIGJlZW4gdGhlIGNhc2UgdGhhdCB3ZVxuICAgICAgLy8gc3RhcnRlZCB0d28gcGFyYWxsZWwgY29ubmVjdGlvbiBhdHRlbXB0cyAoYmVjYXVzZSB3ZSB3YW50ZWQgdG9cbiAgICAgIC8vICdyZWNvbm5lY3Qgbm93JyBvbiBhIGhhbmdpbmcgY29ubmVjdGlvbiBhbmQgd2UgaGFkIG5vIHdheSB0byBjYW5jZWwgdGhlXG4gICAgICAvLyBjb25uZWN0aW9uIGF0dGVtcHQuKSBCdXQgdGhpcyBzaG91bGRuJ3QgaGFwcGVuIChzaW1pbGFybHkgdG8gdGhlIGNsaWVudFxuICAgICAgLy8gIT09IHRoaXMuY2xpZW50IGNoZWNrIGFib3ZlKS5cbiAgICAgIHRocm93IG5ldyBFcnJvcignVHdvIHBhcmFsbGVsIGNvbm5lY3Rpb25zPycpO1xuICAgIH1cblxuICAgIHRoaXMuX2NsZWFyQ29ubmVjdGlvblRpbWVyKCk7XG5cbiAgICAvLyB1cGRhdGUgc3RhdHVzXG4gICAgdGhpcy5jdXJyZW50U3RhdHVzLnN0YXR1cyA9ICdjb25uZWN0ZWQnO1xuICAgIHRoaXMuY3VycmVudFN0YXR1cy5jb25uZWN0ZWQgPSB0cnVlO1xuICAgIHRoaXMuY3VycmVudFN0YXR1cy5yZXRyeUNvdW50ID0gMDtcbiAgICB0aGlzLnN0YXR1c0NoYW5nZWQoKTtcblxuICAgIC8vIGZpcmUgcmVzZXRzLiBUaGlzIG11c3QgY29tZSBhZnRlciBzdGF0dXMgY2hhbmdlIHNvIHRoYXQgY2xpZW50c1xuICAgIC8vIGNhbiBjYWxsIHNlbmQgZnJvbSB3aXRoaW4gYSByZXNldCBjYWxsYmFjay5cbiAgICB0aGlzLmZvckVhY2hDYWxsYmFjaygncmVzZXQnLCBjYWxsYmFjayA9PiB7XG4gICAgICBjYWxsYmFjaygpO1xuICAgIH0pO1xuICB9XG5cbiAgX2NsZWFudXAobWF5YmVFcnJvcikge1xuICAgIHRoaXMuX2NsZWFyQ29ubmVjdGlvblRpbWVyKCk7XG4gICAgaWYgKHRoaXMuY2xpZW50KSB7XG4gICAgICB2YXIgY2xpZW50ID0gdGhpcy5jbGllbnQ7XG4gICAgICB0aGlzLmNsaWVudCA9IG51bGw7XG4gICAgICBjbGllbnQuY2xvc2UoKTtcblxuICAgICAgdGhpcy5mb3JFYWNoQ2FsbGJhY2soJ2Rpc2Nvbm5lY3QnLCBjYWxsYmFjayA9PiB7XG4gICAgICAgIGNhbGxiYWNrKG1heWJlRXJyb3IpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgX2NsZWFyQ29ubmVjdGlvblRpbWVyKCkge1xuICAgIGlmICh0aGlzLmNvbm5lY3Rpb25UaW1lcikge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuY29ubmVjdGlvblRpbWVyKTtcbiAgICAgIHRoaXMuY29ubmVjdGlvblRpbWVyID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBfZ2V0UHJveHlVcmwodGFyZ2V0VXJsKSB7XG4gICAgLy8gU2ltaWxhciB0byBjb2RlIGluIHRvb2xzL2h0dHAtaGVscGVycy5qcy5cbiAgICB2YXIgcHJveHkgPSBwcm9jZXNzLmVudi5IVFRQX1BST1hZIHx8IHByb2Nlc3MuZW52Lmh0dHBfcHJveHkgfHwgbnVsbDtcbiAgICAvLyBpZiB3ZSdyZSBnb2luZyB0byBhIHNlY3VyZSB1cmwsIHRyeSB0aGUgaHR0cHNfcHJveHkgZW52IHZhcmlhYmxlIGZpcnN0LlxuICAgIGlmICh0YXJnZXRVcmwubWF0Y2goL153c3M6LykpIHtcbiAgICAgIHByb3h5ID0gcHJvY2Vzcy5lbnYuSFRUUFNfUFJPWFkgfHwgcHJvY2Vzcy5lbnYuaHR0cHNfcHJveHkgfHwgcHJveHk7XG4gICAgfVxuICAgIHJldHVybiBwcm94eTtcbiAgfVxuXG4gIF9sYXVuY2hDb25uZWN0aW9uKCkge1xuICAgIHRoaXMuX2NsZWFudXAoKTsgLy8gY2xlYW51cCB0aGUgb2xkIHNvY2tldCwgaWYgdGhlcmUgd2FzIG9uZS5cblxuICAgIC8vIFNpbmNlIHNlcnZlci10by1zZXJ2ZXIgRERQIGlzIHN0aWxsIGFuIGV4cGVyaW1lbnRhbCBmZWF0dXJlLCB3ZSBvbmx5XG4gICAgLy8gcmVxdWlyZSB0aGUgbW9kdWxlIGlmIHdlIGFjdHVhbGx5IGNyZWF0ZSBhIHNlcnZlci10by1zZXJ2ZXJcbiAgICAvLyBjb25uZWN0aW9uLlxuICAgIHZhciBGYXllV2ViU29ja2V0ID0gTnBtLnJlcXVpcmUoJ2ZheWUtd2Vic29ja2V0Jyk7XG4gICAgdmFyIGRlZmxhdGUgPSBOcG0ucmVxdWlyZSgncGVybWVzc2FnZS1kZWZsYXRlJyk7XG5cbiAgICB2YXIgdGFyZ2V0VXJsID0gdG9XZWJzb2NrZXRVcmwodGhpcy5lbmRwb2ludCk7XG4gICAgdmFyIGZheWVPcHRpb25zID0ge1xuICAgICAgaGVhZGVyczogdGhpcy5oZWFkZXJzLFxuICAgICAgZXh0ZW5zaW9uczogW2RlZmxhdGVdXG4gICAgfTtcbiAgICBmYXllT3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oZmF5ZU9wdGlvbnMsIHRoaXMubnBtRmF5ZU9wdGlvbnMpO1xuICAgIHZhciBwcm94eVVybCA9IHRoaXMuX2dldFByb3h5VXJsKHRhcmdldFVybCk7XG4gICAgaWYgKHByb3h5VXJsKSB7XG4gICAgICBmYXllT3B0aW9ucy5wcm94eSA9IHsgb3JpZ2luOiBwcm94eVVybCB9O1xuICAgIH1cblxuICAgIC8vIFdlIHdvdWxkIGxpa2UgdG8gc3BlY2lmeSAnZGRwJyBhcyB0aGUgc3VicHJvdG9jb2wgaGVyZS4gVGhlIG5wbSBtb2R1bGUgd2VcbiAgICAvLyB1c2VkIHRvIHVzZSBhcyBhIGNsaWVudCB3b3VsZCBmYWlsIHRoZSBoYW5kc2hha2UgaWYgd2UgYXNrIGZvciBhXG4gICAgLy8gc3VicHJvdG9jb2wgYW5kIHRoZSBzZXJ2ZXIgZG9lc24ndCBzZW5kIG9uZSBiYWNrIChhbmQgc29ja2pzIGRvZXNuJ3QpLlxuICAgIC8vIEZheWUgZG9lc24ndCBoYXZlIHRoYXQgYmVoYXZpb3I7IGl0J3MgdW5jbGVhciBmcm9tIHJlYWRpbmcgUkZDIDY0NTUgaWZcbiAgICAvLyBGYXllIGlzIGVycm9uZW91cyBvciBub3QuICBTbyBmb3Igbm93LCB3ZSBkb24ndCBzcGVjaWZ5IHByb3RvY29scy5cbiAgICB2YXIgc3VicHJvdG9jb2xzID0gW107XG5cbiAgICB2YXIgY2xpZW50ID0gKHRoaXMuY2xpZW50ID0gbmV3IEZheWVXZWJTb2NrZXQuQ2xpZW50KFxuICAgICAgdGFyZ2V0VXJsLFxuICAgICAgc3VicHJvdG9jb2xzLFxuICAgICAgZmF5ZU9wdGlvbnNcbiAgICApKTtcblxuICAgIHRoaXMuX2NsZWFyQ29ubmVjdGlvblRpbWVyKCk7XG4gICAgdGhpcy5jb25uZWN0aW9uVGltZXIgPSBNZXRlb3Iuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLl9sb3N0Q29ubmVjdGlvbihuZXcgdGhpcy5Db25uZWN0aW9uRXJyb3IoJ0REUCBjb25uZWN0aW9uIHRpbWVkIG91dCcpKTtcbiAgICB9LCB0aGlzLkNPTk5FQ1RfVElNRU9VVCk7XG5cbiAgICB0aGlzLmNsaWVudC5vbihcbiAgICAgICdvcGVuJyxcbiAgICAgIE1ldGVvci5iaW5kRW52aXJvbm1lbnQoKCkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fb25Db25uZWN0KGNsaWVudCk7XG4gICAgICB9LCAnc3RyZWFtIGNvbm5lY3QgY2FsbGJhY2snKVxuICAgICk7XG5cbiAgICB2YXIgY2xpZW50T25JZkN1cnJlbnQgPSAoZXZlbnQsIGRlc2NyaXB0aW9uLCBjYWxsYmFjaykgPT4ge1xuICAgICAgdGhpcy5jbGllbnQub24oXG4gICAgICAgIGV2ZW50LFxuICAgICAgICBNZXRlb3IuYmluZEVudmlyb25tZW50KCguLi5hcmdzKSA9PiB7XG4gICAgICAgICAgLy8gSWdub3JlIGV2ZW50cyBmcm9tIGFueSBjb25uZWN0aW9uIHdlJ3ZlIGFscmVhZHkgY2xlYW5lZCB1cC5cbiAgICAgICAgICBpZiAoY2xpZW50ICE9PSB0aGlzLmNsaWVudCkgcmV0dXJuO1xuICAgICAgICAgIGNhbGxiYWNrKC4uLmFyZ3MpO1xuICAgICAgICB9LCBkZXNjcmlwdGlvbilcbiAgICAgICk7XG4gICAgfTtcblxuICAgIGNsaWVudE9uSWZDdXJyZW50KCdlcnJvcicsICdzdHJlYW0gZXJyb3IgY2FsbGJhY2snLCBlcnJvciA9PiB7XG4gICAgICBpZiAoIXRoaXMub3B0aW9ucy5fZG9udFByaW50RXJyb3JzKVxuICAgICAgICBNZXRlb3IuX2RlYnVnKCdzdHJlYW0gZXJyb3InLCBlcnJvci5tZXNzYWdlKTtcblxuICAgICAgLy8gRmF5ZSdzICdlcnJvcicgb2JqZWN0IGlzIG5vdCBhIEpTIGVycm9yIChhbmQgYW1vbmcgb3RoZXIgdGhpbmdzLFxuICAgICAgLy8gZG9lc24ndCBzdHJpbmdpZnkgd2VsbCkuIENvbnZlcnQgaXQgdG8gb25lLlxuICAgICAgdGhpcy5fbG9zdENvbm5lY3Rpb24obmV3IHRoaXMuQ29ubmVjdGlvbkVycm9yKGVycm9yLm1lc3NhZ2UpKTtcbiAgICB9KTtcblxuICAgIGNsaWVudE9uSWZDdXJyZW50KCdjbG9zZScsICdzdHJlYW0gY2xvc2UgY2FsbGJhY2snLCAoKSA9PiB7XG4gICAgICB0aGlzLl9sb3N0Q29ubmVjdGlvbigpO1xuICAgIH0pO1xuXG4gICAgY2xpZW50T25JZkN1cnJlbnQoJ21lc3NhZ2UnLCAnc3RyZWFtIG1lc3NhZ2UgY2FsbGJhY2snLCBtZXNzYWdlID0+IHtcbiAgICAgIC8vIElnbm9yZSBiaW5hcnkgZnJhbWVzLCB3aGVyZSBtZXNzYWdlLmRhdGEgaXMgYSBCdWZmZXJcbiAgICAgIGlmICh0eXBlb2YgbWVzc2FnZS5kYXRhICE9PSAnc3RyaW5nJykgcmV0dXJuO1xuXG4gICAgICB0aGlzLmZvckVhY2hDYWxsYmFjaygnbWVzc2FnZScsIGNhbGxiYWNrID0+IHtcbiAgICAgICAgY2FsbGJhY2sobWVzc2FnZS5kYXRhKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG59XG4iLCJpbXBvcnQgeyBSZXRyeSB9IGZyb20gJ21ldGVvci9yZXRyeSc7XG5cbmNvbnN0IGZvcmNlZFJlY29ubmVjdEVycm9yID0gbmV3IEVycm9yKFwiZm9yY2VkIHJlY29ubmVjdFwiKTtcblxuZXhwb3J0IGNsYXNzIFN0cmVhbUNsaWVudENvbW1vbiB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICB0aGlzLm9wdGlvbnMgPSB7XG4gICAgICByZXRyeTogdHJ1ZSxcbiAgICAgIC4uLihvcHRpb25zIHx8IG51bGwpLFxuICAgIH07XG5cbiAgICB0aGlzLkNvbm5lY3Rpb25FcnJvciA9XG4gICAgICBvcHRpb25zICYmIG9wdGlvbnMuQ29ubmVjdGlvbkVycm9yIHx8IEVycm9yO1xuICB9XG5cbiAgLy8gUmVnaXN0ZXIgZm9yIGNhbGxiYWNrcy5cbiAgb24obmFtZSwgY2FsbGJhY2spIHtcbiAgICBpZiAobmFtZSAhPT0gJ21lc3NhZ2UnICYmIG5hbWUgIT09ICdyZXNldCcgJiYgbmFtZSAhPT0gJ2Rpc2Nvbm5lY3QnKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCd1bmtub3duIGV2ZW50IHR5cGU6ICcgKyBuYW1lKTtcblxuICAgIGlmICghdGhpcy5ldmVudENhbGxiYWNrc1tuYW1lXSkgdGhpcy5ldmVudENhbGxiYWNrc1tuYW1lXSA9IFtdO1xuICAgIHRoaXMuZXZlbnRDYWxsYmFja3NbbmFtZV0ucHVzaChjYWxsYmFjayk7XG4gIH1cblxuICBmb3JFYWNoQ2FsbGJhY2sobmFtZSwgY2IpIHtcbiAgICBpZiAoIXRoaXMuZXZlbnRDYWxsYmFja3NbbmFtZV0gfHwgIXRoaXMuZXZlbnRDYWxsYmFja3NbbmFtZV0ubGVuZ3RoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5ldmVudENhbGxiYWNrc1tuYW1lXS5mb3JFYWNoKGNiKTtcbiAgfVxuXG4gIF9pbml0Q29tbW9uKG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG4gICAgLy8vLyBDb25zdGFudHNcblxuICAgIC8vIGhvdyBsb25nIHRvIHdhaXQgdW50aWwgd2UgZGVjbGFyZSB0aGUgY29ubmVjdGlvbiBhdHRlbXB0XG4gICAgLy8gZmFpbGVkLlxuICAgIHRoaXMuQ09OTkVDVF9USU1FT1VUID0gb3B0aW9ucy5jb25uZWN0VGltZW91dE1zIHx8IDEwMDAwO1xuXG4gICAgdGhpcy5ldmVudENhbGxiYWNrcyA9IE9iamVjdC5jcmVhdGUobnVsbCk7IC8vIG5hbWUgLT4gW2NhbGxiYWNrXVxuXG4gICAgdGhpcy5fZm9yY2VkVG9EaXNjb25uZWN0ID0gZmFsc2U7XG5cbiAgICAvLy8vIFJlYWN0aXZlIHN0YXR1c1xuICAgIHRoaXMuY3VycmVudFN0YXR1cyA9IHtcbiAgICAgIHN0YXR1czogJ2Nvbm5lY3RpbmcnLFxuICAgICAgY29ubmVjdGVkOiBmYWxzZSxcbiAgICAgIHJldHJ5Q291bnQ6IDBcbiAgICB9O1xuXG4gICAgaWYgKFBhY2thZ2UudHJhY2tlcikge1xuICAgICAgdGhpcy5zdGF0dXNMaXN0ZW5lcnMgPSBuZXcgUGFja2FnZS50cmFja2VyLlRyYWNrZXIuRGVwZW5kZW5jeSgpO1xuICAgIH1cblxuICAgIHRoaXMuc3RhdHVzQ2hhbmdlZCA9ICgpID0+IHtcbiAgICAgIGlmICh0aGlzLnN0YXR1c0xpc3RlbmVycykge1xuICAgICAgICB0aGlzLnN0YXR1c0xpc3RlbmVycy5jaGFuZ2VkKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8vLy8gUmV0cnkgbG9naWNcbiAgICB0aGlzLl9yZXRyeSA9IG5ldyBSZXRyeSgpO1xuICAgIHRoaXMuY29ubmVjdGlvblRpbWVyID0gbnVsbDtcbiAgfVxuXG4gIC8vIFRyaWdnZXIgYSByZWNvbm5lY3QuXG4gIHJlY29ubmVjdChvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwgT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuICAgIGlmIChvcHRpb25zLnVybCkge1xuICAgICAgdGhpcy5fY2hhbmdlVXJsKG9wdGlvbnMudXJsKTtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5fc29ja2pzT3B0aW9ucykge1xuICAgICAgdGhpcy5vcHRpb25zLl9zb2NranNPcHRpb25zID0gb3B0aW9ucy5fc29ja2pzT3B0aW9ucztcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jdXJyZW50U3RhdHVzLmNvbm5lY3RlZCkge1xuICAgICAgaWYgKG9wdGlvbnMuX2ZvcmNlIHx8IG9wdGlvbnMudXJsKSB7XG4gICAgICAgIHRoaXMuX2xvc3RDb25uZWN0aW9uKGZvcmNlZFJlY29ubmVjdEVycm9yKTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBpZiB3ZSdyZSBtaWQtY29ubmVjdGlvbiwgc3RvcCBpdC5cbiAgICBpZiAodGhpcy5jdXJyZW50U3RhdHVzLnN0YXR1cyA9PT0gJ2Nvbm5lY3RpbmcnKSB7XG4gICAgICAvLyBQcmV0ZW5kIGl0J3MgYSBjbGVhbiBjbG9zZS5cbiAgICAgIHRoaXMuX2xvc3RDb25uZWN0aW9uKCk7XG4gICAgfVxuXG4gICAgdGhpcy5fcmV0cnkuY2xlYXIoKTtcbiAgICB0aGlzLmN1cnJlbnRTdGF0dXMucmV0cnlDb3VudCAtPSAxOyAvLyBkb24ndCBjb3VudCBtYW51YWwgcmV0cmllc1xuICAgIHRoaXMuX3JldHJ5Tm93KCk7XG4gIH1cblxuICBkaXNjb25uZWN0KG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG4gICAgLy8gRmFpbGVkIGlzIHBlcm1hbmVudC4gSWYgd2UncmUgZmFpbGVkLCBkb24ndCBsZXQgcGVvcGxlIGdvIGJhY2tcbiAgICAvLyBvbmxpbmUgYnkgY2FsbGluZyAnZGlzY29ubmVjdCcgdGhlbiAncmVjb25uZWN0Jy5cbiAgICBpZiAodGhpcy5fZm9yY2VkVG9EaXNjb25uZWN0KSByZXR1cm47XG5cbiAgICAvLyBJZiBfcGVybWFuZW50IGlzIHNldCwgcGVybWFuZW50bHkgZGlzY29ubmVjdCBhIHN0cmVhbS4gT25jZSBhIHN0cmVhbVxuICAgIC8vIGlzIGZvcmNlZCB0byBkaXNjb25uZWN0LCBpdCBjYW4gbmV2ZXIgcmVjb25uZWN0LiBUaGlzIGlzIGZvclxuICAgIC8vIGVycm9yIGNhc2VzIHN1Y2ggYXMgZGRwIHZlcnNpb24gbWlzbWF0Y2gsIHdoZXJlIHRyeWluZyBhZ2FpblxuICAgIC8vIHdvbid0IGZpeCB0aGUgcHJvYmxlbS5cbiAgICBpZiAob3B0aW9ucy5fcGVybWFuZW50KSB7XG4gICAgICB0aGlzLl9mb3JjZWRUb0Rpc2Nvbm5lY3QgPSB0cnVlO1xuICAgIH1cblxuICAgIHRoaXMuX2NsZWFudXAoKTtcbiAgICB0aGlzLl9yZXRyeS5jbGVhcigpO1xuXG4gICAgdGhpcy5jdXJyZW50U3RhdHVzID0ge1xuICAgICAgc3RhdHVzOiBvcHRpb25zLl9wZXJtYW5lbnQgPyAnZmFpbGVkJyA6ICdvZmZsaW5lJyxcbiAgICAgIGNvbm5lY3RlZDogZmFsc2UsXG4gICAgICByZXRyeUNvdW50OiAwXG4gICAgfTtcblxuICAgIGlmIChvcHRpb25zLl9wZXJtYW5lbnQgJiYgb3B0aW9ucy5fZXJyb3IpXG4gICAgICB0aGlzLmN1cnJlbnRTdGF0dXMucmVhc29uID0gb3B0aW9ucy5fZXJyb3I7XG5cbiAgICB0aGlzLnN0YXR1c0NoYW5nZWQoKTtcbiAgfVxuXG4gIC8vIG1heWJlRXJyb3IgaXMgc2V0IHVubGVzcyBpdCdzIGEgY2xlYW4gcHJvdG9jb2wtbGV2ZWwgY2xvc2UuXG4gIF9sb3N0Q29ubmVjdGlvbihtYXliZUVycm9yKSB7XG4gICAgdGhpcy5fY2xlYW51cChtYXliZUVycm9yKTtcbiAgICB0aGlzLl9yZXRyeUxhdGVyKG1heWJlRXJyb3IpOyAvLyBzZXRzIHN0YXR1cy4gbm8gbmVlZCB0byBkbyBpdCBoZXJlLlxuICB9XG5cbiAgLy8gZmlyZWQgd2hlbiB3ZSBkZXRlY3QgdGhhdCB3ZSd2ZSBnb25lIG9ubGluZS4gdHJ5IHRvIHJlY29ubmVjdFxuICAvLyBpbW1lZGlhdGVseS5cbiAgX29ubGluZSgpIHtcbiAgICAvLyBpZiB3ZSd2ZSByZXF1ZXN0ZWQgdG8gYmUgb2ZmbGluZSBieSBkaXNjb25uZWN0aW5nLCBkb24ndCByZWNvbm5lY3QuXG4gICAgaWYgKHRoaXMuY3VycmVudFN0YXR1cy5zdGF0dXMgIT0gJ29mZmxpbmUnKSB0aGlzLnJlY29ubmVjdCgpO1xuICB9XG5cbiAgX3JldHJ5TGF0ZXIobWF5YmVFcnJvcikge1xuICAgIHZhciB0aW1lb3V0ID0gMDtcbiAgICBpZiAodGhpcy5vcHRpb25zLnJldHJ5IHx8XG4gICAgICAgIG1heWJlRXJyb3IgPT09IGZvcmNlZFJlY29ubmVjdEVycm9yKSB7XG4gICAgICB0aW1lb3V0ID0gdGhpcy5fcmV0cnkucmV0cnlMYXRlcihcbiAgICAgICAgdGhpcy5jdXJyZW50U3RhdHVzLnJldHJ5Q291bnQsXG4gICAgICAgIHRoaXMuX3JldHJ5Tm93LmJpbmQodGhpcylcbiAgICAgICk7XG4gICAgICB0aGlzLmN1cnJlbnRTdGF0dXMuc3RhdHVzID0gJ3dhaXRpbmcnO1xuICAgICAgdGhpcy5jdXJyZW50U3RhdHVzLnJldHJ5VGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpICsgdGltZW91dDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jdXJyZW50U3RhdHVzLnN0YXR1cyA9ICdmYWlsZWQnO1xuICAgICAgZGVsZXRlIHRoaXMuY3VycmVudFN0YXR1cy5yZXRyeVRpbWU7XG4gICAgfVxuXG4gICAgdGhpcy5jdXJyZW50U3RhdHVzLmNvbm5lY3RlZCA9IGZhbHNlO1xuICAgIHRoaXMuc3RhdHVzQ2hhbmdlZCgpO1xuICB9XG5cbiAgX3JldHJ5Tm93KCkge1xuICAgIGlmICh0aGlzLl9mb3JjZWRUb0Rpc2Nvbm5lY3QpIHJldHVybjtcblxuICAgIHRoaXMuY3VycmVudFN0YXR1cy5yZXRyeUNvdW50ICs9IDE7XG4gICAgdGhpcy5jdXJyZW50U3RhdHVzLnN0YXR1cyA9ICdjb25uZWN0aW5nJztcbiAgICB0aGlzLmN1cnJlbnRTdGF0dXMuY29ubmVjdGVkID0gZmFsc2U7XG4gICAgZGVsZXRlIHRoaXMuY3VycmVudFN0YXR1cy5yZXRyeVRpbWU7XG4gICAgdGhpcy5zdGF0dXNDaGFuZ2VkKCk7XG5cbiAgICB0aGlzLl9sYXVuY2hDb25uZWN0aW9uKCk7XG4gIH1cblxuICAvLyBHZXQgY3VycmVudCBzdGF0dXMuIFJlYWN0aXZlLlxuICBzdGF0dXMoKSB7XG4gICAgaWYgKHRoaXMuc3RhdHVzTGlzdGVuZXJzKSB7XG4gICAgICB0aGlzLnN0YXR1c0xpc3RlbmVycy5kZXBlbmQoKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuY3VycmVudFN0YXR1cztcbiAgfVxufVxuIiwiLy8gQHBhcmFtIHVybCB7U3RyaW5nfSBVUkwgdG8gTWV0ZW9yIGFwcCwgZWc6XG4vLyAgIFwiL1wiIG9yIFwibWFkZXdpdGgubWV0ZW9yLmNvbVwiIG9yIFwiaHR0cHM6Ly9mb28ubWV0ZW9yLmNvbVwiXG4vLyAgIG9yIFwiZGRwK3NvY2tqczovL2RkcC0tKioqKi1mb28ubWV0ZW9yLmNvbS9zb2NranNcIlxuLy8gQHJldHVybnMge1N0cmluZ30gVVJMIHRvIHRoZSBlbmRwb2ludCB3aXRoIHRoZSBzcGVjaWZpYyBzY2hlbWUgYW5kIHN1YlBhdGgsIGUuZy5cbi8vIGZvciBzY2hlbWUgXCJodHRwXCIgYW5kIHN1YlBhdGggXCJzb2NranNcIlxuLy8gICBcImh0dHA6Ly9zdWJkb21haW4ubWV0ZW9yLmNvbS9zb2NranNcIiBvciBcIi9zb2NranNcIlxuLy8gICBvciBcImh0dHBzOi8vZGRwLS0xMjM0LWZvby5tZXRlb3IuY29tL3NvY2tqc1wiXG5mdW5jdGlvbiB0cmFuc2xhdGVVcmwodXJsLCBuZXdTY2hlbWVCYXNlLCBzdWJQYXRoKSB7XG4gIGlmICghbmV3U2NoZW1lQmFzZSkge1xuICAgIG5ld1NjaGVtZUJhc2UgPSAnaHR0cCc7XG4gIH1cblxuICBpZiAoc3ViUGF0aCAhPT0gXCJzb2NranNcIiAmJiB1cmwuc3RhcnRzV2l0aChcIi9cIikpIHtcbiAgICB1cmwgPSBNZXRlb3IuYWJzb2x1dGVVcmwodXJsLnN1YnN0cigxKSk7XG4gIH1cblxuICB2YXIgZGRwVXJsTWF0Y2ggPSB1cmwubWF0Y2goL15kZHAoaT8pXFwrc29ja2pzOlxcL1xcLy8pO1xuICB2YXIgaHR0cFVybE1hdGNoID0gdXJsLm1hdGNoKC9eaHR0cChzPyk6XFwvXFwvLyk7XG4gIHZhciBuZXdTY2hlbWU7XG4gIGlmIChkZHBVcmxNYXRjaCkge1xuICAgIC8vIFJlbW92ZSBzY2hlbWUgYW5kIHNwbGl0IG9mZiB0aGUgaG9zdC5cbiAgICB2YXIgdXJsQWZ0ZXJERFAgPSB1cmwuc3Vic3RyKGRkcFVybE1hdGNoWzBdLmxlbmd0aCk7XG4gICAgbmV3U2NoZW1lID0gZGRwVXJsTWF0Y2hbMV0gPT09ICdpJyA/IG5ld1NjaGVtZUJhc2UgOiBuZXdTY2hlbWVCYXNlICsgJ3MnO1xuICAgIHZhciBzbGFzaFBvcyA9IHVybEFmdGVyRERQLmluZGV4T2YoJy8nKTtcbiAgICB2YXIgaG9zdCA9IHNsYXNoUG9zID09PSAtMSA/IHVybEFmdGVyRERQIDogdXJsQWZ0ZXJERFAuc3Vic3RyKDAsIHNsYXNoUG9zKTtcbiAgICB2YXIgcmVzdCA9IHNsYXNoUG9zID09PSAtMSA/ICcnIDogdXJsQWZ0ZXJERFAuc3Vic3RyKHNsYXNoUG9zKTtcblxuICAgIC8vIEluIHRoZSBob3N0IChPTkxZISksIGNoYW5nZSAnKicgY2hhcmFjdGVycyBpbnRvIHJhbmRvbSBkaWdpdHMuIFRoaXNcbiAgICAvLyBhbGxvd3MgZGlmZmVyZW50IHN0cmVhbSBjb25uZWN0aW9ucyB0byBjb25uZWN0IHRvIGRpZmZlcmVudCBob3N0bmFtZXNcbiAgICAvLyBhbmQgYXZvaWQgYnJvd3NlciBwZXItaG9zdG5hbWUgY29ubmVjdGlvbiBsaW1pdHMuXG4gICAgaG9zdCA9IGhvc3QucmVwbGFjZSgvXFwqL2csICgpID0+IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKSk7XG5cbiAgICByZXR1cm4gbmV3U2NoZW1lICsgJzovLycgKyBob3N0ICsgcmVzdDtcbiAgfSBlbHNlIGlmIChodHRwVXJsTWF0Y2gpIHtcbiAgICBuZXdTY2hlbWUgPSAhaHR0cFVybE1hdGNoWzFdID8gbmV3U2NoZW1lQmFzZSA6IG5ld1NjaGVtZUJhc2UgKyAncyc7XG4gICAgdmFyIHVybEFmdGVySHR0cCA9IHVybC5zdWJzdHIoaHR0cFVybE1hdGNoWzBdLmxlbmd0aCk7XG4gICAgdXJsID0gbmV3U2NoZW1lICsgJzovLycgKyB1cmxBZnRlckh0dHA7XG4gIH1cblxuICAvLyBQcmVmaXggRlFETnMgYnV0IG5vdCByZWxhdGl2ZSBVUkxzXG4gIGlmICh1cmwuaW5kZXhPZignOi8vJykgPT09IC0xICYmICF1cmwuc3RhcnRzV2l0aCgnLycpKSB7XG4gICAgdXJsID0gbmV3U2NoZW1lQmFzZSArICc6Ly8nICsgdXJsO1xuICB9XG5cbiAgLy8gWFhYIFRoaXMgaXMgbm90IHdoYXQgd2Ugc2hvdWxkIGJlIGRvaW5nOiBpZiBJIGhhdmUgYSBzaXRlXG4gIC8vIGRlcGxveWVkIGF0IFwiL2Zvb1wiLCB0aGVuIEREUC5jb25uZWN0KFwiL1wiKSBzaG91bGQgYWN0dWFsbHkgY29ubmVjdFxuICAvLyB0byBcIi9cIiwgbm90IHRvIFwiL2Zvb1wiLiBcIi9cIiBpcyBhbiBhYnNvbHV0ZSBwYXRoLiAoQ29udHJhc3Q6IGlmXG4gIC8vIGRlcGxveWVkIGF0IFwiL2Zvb1wiLCBpdCB3b3VsZCBiZSByZWFzb25hYmxlIGZvciBERFAuY29ubmVjdChcImJhclwiKVxuICAvLyB0byBjb25uZWN0IHRvIFwiL2Zvby9iYXJcIikuXG4gIC8vXG4gIC8vIFdlIHNob3VsZCBtYWtlIHRoaXMgcHJvcGVybHkgaG9ub3IgYWJzb2x1dGUgcGF0aHMgcmF0aGVyIHRoYW5cbiAgLy8gZm9yY2luZyB0aGUgcGF0aCB0byBiZSByZWxhdGl2ZSB0byB0aGUgc2l0ZSByb290LiBTaW11bHRhbmVvdXNseSxcbiAgLy8gd2Ugc2hvdWxkIHNldCBERFBfREVGQVVMVF9DT05ORUNUSU9OX1VSTCB0byBpbmNsdWRlIHRoZSBzaXRlXG4gIC8vIHJvb3QuIFNlZSBhbHNvIGNsaWVudF9jb252ZW5pZW5jZS5qcyAjUmF0aW9uYWxpemluZ1JlbGF0aXZlRERQVVJMc1xuICB1cmwgPSBNZXRlb3IuX3JlbGF0aXZlVG9TaXRlUm9vdFVybCh1cmwpO1xuXG4gIGlmICh1cmwuZW5kc1dpdGgoJy8nKSkgcmV0dXJuIHVybCArIHN1YlBhdGg7XG4gIGVsc2UgcmV0dXJuIHVybCArICcvJyArIHN1YlBhdGg7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b1NvY2tqc1VybCh1cmwpIHtcbiAgcmV0dXJuIHRyYW5zbGF0ZVVybCh1cmwsICdodHRwJywgJ3NvY2tqcycpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9XZWJzb2NrZXRVcmwodXJsKSB7XG4gIHJldHVybiB0cmFuc2xhdGVVcmwodXJsLCAnd3MnLCAnd2Vic29ja2V0Jyk7XG59XG4iXX0=
