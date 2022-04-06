var BuilderReact = (function (exports) {
  'use strict';

  var version = "0.2.17";

  var _a;
  if (typeof window !== 'undefined') {
      (_a = window.parent) === null || _a === void 0 ? void 0 : _a.postMessage({
          type: 'builder.isReactSdk',
          data: {
              value: true,
              supportsPatchUpdates: 'v3',
              priorVersion: version,
          },
      }, '*');
  }

  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation.

  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.

  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** */
  /* global Reflect, Promise */

  var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
          function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
      return extendStatics(d, b);
  };

  function __extends(d, b) {
      extendStatics(d, b);
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }

  var __assign = function() {
      __assign = Object.assign || function __assign(t) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
              s = arguments[i];
              for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
          return t;
      };
      return __assign.apply(this, arguments);
  };

  function __awaiter(thisArg, _arguments, P, generator) {
      function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
      return new (P || (P = Promise))(function (resolve, reject) {
          function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
          function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
          function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
  }

  function __generator(thisArg, body) {
      var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
      function verb(n) { return function (v) { return step([n, v]); }; }
      function step(op) {
          if (f) throw new TypeError("Generator is already executing.");
          while (_) try {
              if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
              if (y = 0, t) op = [op[0] & 2, t.value];
              switch (op[0]) {
                  case 0: case 1: t = op; break;
                  case 4: _.label++; return { value: op[1], done: false };
                  case 5: _.label++; y = op[1]; op = [0]; continue;
                  case 7: op = _.ops.pop(); _.trys.pop(); continue;
                  default:
                      if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                      if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                      if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                      if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                      if (t[2]) _.ops.pop();
                      _.trys.pop(); continue;
              }
              op = body.call(thisArg, _);
          } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
          if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
      }
  }

  function __values(o) {
      var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
      if (m) return m.call(o);
      if (o && typeof o.length === "number") return {
          next: function () {
              if (o && i >= o.length) o = void 0;
              return { value: o && o[i++], done: !o };
          }
      };
      throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  }

  function __asyncValues(o) {
      if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
      var m = o[Symbol.asyncIterator], i;
      return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
      function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
      function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
  }

  function pad (hash, len) {
    while (hash.length < len) {
      hash = '0' + hash;
    }
    return hash;
  }

  function fold (hash, text) {
    var i;
    var chr;
    var len;
    if (text.length === 0) {
      return hash;
    }
    for (i = 0, len = text.length; i < len; i++) {
      chr = text.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0;
    }
    return hash < 0 ? hash * -2 : hash;
  }

  function foldObject (hash, o, seen) {
    return Object.keys(o).sort().reduce(foldKey, hash);
    function foldKey (hash, key) {
      return foldValue(hash, o[key], key, seen);
    }
  }

  function foldValue (input, value, key, seen) {
    var hash = fold(fold(fold(input, key), toString$1(value)), typeof value);
    if (value === null) {
      return fold(hash, 'null');
    }
    if (value === undefined) {
      return fold(hash, 'undefined');
    }
    if (typeof value === 'object' || typeof value === 'function') {
      if (seen.indexOf(value) !== -1) {
        return fold(hash, '[Circular]' + key);
      }
      seen.push(value);

      var objHash = foldObject(hash, value, seen);

      if (!('valueOf' in value) || typeof value.valueOf !== 'function') {
        return objHash;
      }

      try {
        return fold(objHash, String(value.valueOf()))
      } catch (err) {
        return fold(objHash, '[valueOf exception]' + (err.stack || err.message))
      }
    }
    return fold(hash, value.toString());
  }

  function toString$1 (o) {
    return Object.prototype.toString.call(o);
  }

  function sum (o) {
    return pad(foldValue(0, o, '', []).toString(16), 8);
  }

  var hashSum = sum;

  (function () {
    if (typeof window === 'undefined' || typeof window.CustomEvent === 'function') return false;

    function CustomEvent(event, params) {
      params = params || { bubbles: false, cancelable: false, detail: null };
      var evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      return evt;
    }

    window.CustomEvent = CustomEvent;
  })();

  var isSafari = typeof window !== 'undefined' &&
      /^((?!chrome|android).)*safari/i.test(window.navigator.userAgent);
  // TODO: queue all of these in a debounceNextTick
  function nextTick(fn) {
      // React native
      if (typeof setImmediate === 'function' && typeof window === 'undefined') {
          return setImmediate(fn);
      }
      // TODO: should this be setImmediate instead? Forgot if that is micro or macro task
      // TODO: detect specifically if is server
      // if (typeof process !== 'undefined' && process.nextTick) {
      //   console.log('process.nextTick?');
      //   process.nextTick(fn);
      //   return;
      // }
      // FIXME: fix the real safari issue of this randomly not working
      if (isSafari || typeof MutationObserver === 'undefined') {
          setTimeout(fn);
          return;
      }
      var called = 0;
      var observer = new MutationObserver(function () { return fn(); });
      var element = document.createTextNode('');
      observer.observe(element, {
          characterData: true,
      });
      // tslint:disable-next-line
      element.data = String((called = ++called));
  }

  var PROPERTY_NAME_DENY_LIST = Object.freeze(['__proto__', 'prototype', 'constructor']);
  // TODO: unit tests
  var QueryString = /** @class */ (function () {
      function QueryString() {
      }
      QueryString.parseDeep = function (queryString) {
          var obj = this.parse(queryString);
          return this.deepen(obj);
      };
      QueryString.stringifyDeep = function (obj) {
          var map = this.flatten(obj);
          return this.stringify(map);
      };
      QueryString.parse = function (queryString) {
          var query = {};
          var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
          for (var i = 0; i < pairs.length; i++) {
              var pair = pairs[i].split('=');
              // TODO: node support?
              try {
                  query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
              }
              catch (error) {
                  // Ignore malformed URI components
              }
          }
          return query;
      };
      QueryString.stringify = function (map) {
          var str = '';
          for (var key in map) {
              if (map.hasOwnProperty(key)) {
                  var value = map[key];
                  if (str) {
                      str += '&';
                  }
                  str += encodeURIComponent(key) + '=' + encodeURIComponent(value);
              }
          }
          return str;
      };
      QueryString.deepen = function (map) {
          // FIXME; Should be type Tree = Record<string, string | Tree>
          // requires a typescript upgrade.
          var output = {};
          for (var k in map) {
              var t = output;
              var parts = k.split('.');
              var key = parts.pop();
              for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
                  var part = parts_1[_i];
                  assertAllowedPropertyName(part);
                  t = t[part] = t[part] || {};
              }
              t[key] = map[k];
          }
          return output;
      };
      QueryString.flatten = function (obj, _current, _res) {
          if (_res === void 0) { _res = {}; }
          for (var key in obj) {
              var value = obj[key];
              var newKey = _current ? _current + '.' + key : key;
              if (value && typeof value === 'object') {
                  this.flatten(value, newKey, _res);
              }
              else {
                  _res[newKey] = value;
              }
          }
          return _res;
      };
      return QueryString;
  }());
  function assertAllowedPropertyName(name) {
      if (PROPERTY_NAME_DENY_LIST.indexOf(name) >= 0)
          throw new Error("Property name \"" + name + "\" is not allowed");
  }

  var version$1 = "1.1.25";

  var Subscription = /** @class */ (function () {
      function Subscription(listeners, listener) {
          this.listeners = listeners;
          this.listener = listener;
          this.unsubscribed = false;
          this.otherSubscriptions = [];
      }
      Object.defineProperty(Subscription.prototype, "closed", {
          get: function () {
              return this.unsubscribed;
          },
          enumerable: true,
          configurable: true
      });
      Subscription.prototype.add = function (subscription) {
          this.otherSubscriptions.push(subscription);
      };
      Subscription.prototype.unsubscribe = function () {
          if (this.unsubscribed) {
              return;
          }
          if (this.listener && this.listeners) {
              var index = this.listeners.indexOf(this.listener);
              if (index > -1) {
                  this.listeners.splice(index, 1);
              }
          }
          this.otherSubscriptions.forEach(function (sub) { return sub.unsubscribe(); });
          this.unsubscribed = true;
      };
      return Subscription;
  }());
  // TODO: follow minimal basic spec: https://github.com/tc39/proposal-observable
  var BehaviorSubject = /** @class */ (function () {
      function BehaviorSubject(value) {
          this.value = value;
          this.listeners = [];
          this.errorListeners = [];
      }
      BehaviorSubject.prototype.next = function (value) {
          this.value = value;
          for (var _i = 0, _a = this.listeners; _i < _a.length; _i++) {
              var listener = _a[_i];
              listener(value);
          }
      };
      // TODO: implement this as PIPE instead
      BehaviorSubject.prototype.map = function (fn) {
          var newSubject = new BehaviorSubject(fn(this.value));
          // TODO: on destroy delete these
          this.subscribe(function (val) {
              newSubject.next(fn(val));
          });
          this.catch(function (err) {
              newSubject.error(err);
          });
          return newSubject;
      };
      BehaviorSubject.prototype.catch = function (errorListener) {
          this.errorListeners.push(errorListener);
          return new Subscription(this.errorListeners, errorListener);
      };
      BehaviorSubject.prototype.error = function (error) {
          for (var _i = 0, _a = this.errorListeners; _i < _a.length; _i++) {
              var listener = _a[_i];
              listener(error);
          }
      };
      BehaviorSubject.prototype.subscribe = function (listener, errorListener) {
          this.listeners.push(listener);
          if (errorListener) {
              this.errorListeners.push(errorListener);
          }
          return new Subscription(this.listeners, listener);
      };
      BehaviorSubject.prototype.toPromise = function () {
          var _this = this;
          return new Promise(function (resolve, reject) {
              var subscription = _this.subscribe(function (value) {
                  resolve(value);
                  subscription.unsubscribe();
              }, function (err) {
                  reject(err);
                  subscription.unsubscribe();
              });
          });
      };
      BehaviorSubject.prototype.promise = function () {
          return this.toPromise();
      };
      return BehaviorSubject;
  }());

  var State = {
      Pending: 'Pending',
      Fulfilled: 'Fulfilled',
      Rejected: 'Rejected',
  };
  function isFunction(val) {
      return val && typeof val === 'function';
  }
  function isObject(val) {
      return val && typeof val === 'object';
  }
  var TinyPromise = /** @class */ (function () {
      function TinyPromise(executor) {
          this._state = State.Pending;
          this._handlers = [];
          this._value = null;
          executor(this._resolve.bind(this), this._reject.bind(this));
      }
      TinyPromise.prototype._resolve = function (x) {
          var _this = this;
          if (x instanceof TinyPromise) {
              x.then(this._resolve.bind(this), this._reject.bind(this));
          }
          else if (isObject(x) || isFunction(x)) {
              var called_1 = false;
              try {
                  var thenable = x.then;
                  if (isFunction(thenable)) {
                      thenable.call(x, function (result) {
                          if (!called_1)
                              _this._resolve(result);
                          called_1 = true;
                          return undefined;
                      }, function (error) {
                          if (!called_1)
                              _this._reject(error);
                          called_1 = true;
                          return undefined;
                      });
                  }
                  else {
                      this._fulfill(x);
                  }
              }
              catch (ex) {
                  if (!called_1) {
                      this._reject(ex);
                  }
              }
          }
          else {
              this._fulfill(x);
          }
      };
      TinyPromise.prototype._fulfill = function (result) {
          var _this = this;
          this._state = State.Fulfilled;
          this._value = result;
          this._handlers.forEach(function (handler) { return _this._callHandler(handler); });
      };
      TinyPromise.prototype._reject = function (error) {
          var _this = this;
          this._state = State.Rejected;
          this._value = error;
          this._handlers.forEach(function (handler) { return _this._callHandler(handler); });
      };
      TinyPromise.prototype._isPending = function () {
          return this._state === State.Pending;
      };
      TinyPromise.prototype._isFulfilled = function () {
          return this._state === State.Fulfilled;
      };
      TinyPromise.prototype._isRejected = function () {
          return this._state === State.Rejected;
      };
      TinyPromise.prototype._addHandler = function (onFulfilled, onRejected) {
          this._handlers.push({
              onFulfilled: onFulfilled,
              onRejected: onRejected,
          });
      };
      TinyPromise.prototype._callHandler = function (handler) {
          if (this._isFulfilled() && isFunction(handler.onFulfilled)) {
              handler.onFulfilled(this._value);
          }
          else if (this._isRejected() && isFunction(handler.onRejected)) {
              handler.onRejected(this._value);
          }
      };
      TinyPromise.prototype.then = function (onFulfilled, onRejected) {
          var _this = this;
          switch (this._state) {
              case State.Pending: {
                  return new TinyPromise(function (resolve, reject) {
                      _this._addHandler(function (value) {
                          nextTick(function () {
                              try {
                                  if (isFunction(onFulfilled)) {
                                      resolve(onFulfilled(value));
                                  }
                                  else {
                                      resolve(value);
                                  }
                              }
                              catch (ex) {
                                  reject(ex);
                              }
                          });
                      }, function (error) {
                          nextTick(function () {
                              try {
                                  if (isFunction(onRejected)) {
                                      resolve(onRejected(error));
                                  }
                                  else {
                                      reject(error);
                                  }
                              }
                              catch (ex) {
                                  reject(ex);
                              }
                          });
                      });
                  });
              }
              case State.Fulfilled: {
                  return new TinyPromise(function (resolve, reject) {
                      nextTick(function () {
                          try {
                              if (isFunction(onFulfilled)) {
                                  resolve(onFulfilled(_this._value));
                              }
                              else {
                                  resolve(_this._value);
                              }
                          }
                          catch (ex) {
                              reject(ex);
                          }
                      });
                  });
              }
              case State.Rejected: {
                  return new TinyPromise(function (resolve, reject) {
                      nextTick(function () {
                          try {
                              if (isFunction(onRejected)) {
                                  resolve(onRejected(_this._value));
                              }
                              else {
                                  reject(_this._value);
                              }
                          }
                          catch (ex) {
                              reject(ex);
                          }
                      });
                  });
              }
          }
      };
      return TinyPromise;
  }());
  var Promise$1 = (typeof Promise !== 'undefined' ? Promise : TinyPromise);

  // Webpack workaround to conditionally require certain external modules
  // only on the server and not bundle them on the client
  var serverOnlyRequire;
  try {
      // tslint:disable-next-line:no-eval
      serverOnlyRequire = eval('require');
  }
  catch (err) {
      // all good
      serverOnlyRequire = (function () { return null; });
  }
  var serverOnlyRequire$1 = serverOnlyRequire;

  function promiseResolve(value) {
      return new Promise$1(function (resolve) { return resolve(value); });
  }
  // Adapted from https://raw.githubusercontent.com/developit/unfetch/master/src/index.mjs
  function tinyFetch(url, options) {
      if (options === void 0) { options = {}; }
      return new Promise$1(function (resolve, reject) {
          var request = new XMLHttpRequest();
          request.open(options.method || 'get', url, true);
          if (options.headers) {
              for (var i in options.headers) {
                  request.setRequestHeader(i, options.headers[i]);
              }
          }
          request.withCredentials = options.credentials === 'include';
          request.onload = function () {
              resolve(response());
          };
          request.onerror = reject;
          request.send(options.body);
          function response() {
              var keys = [];
              var all = [];
              var headers = {};
              var header = undefined;
              request
                  .getAllResponseHeaders()
                  .replace(/^(.*?):[^\S\n]*([\s\S]*?)$/gm, function (_match, _key, value) {
                  var key = _key;
                  keys.push((key = key.toLowerCase()));
                  all.push([key, value]);
                  header = headers[key];
                  headers[key] = header ? header + "," + value : value;
                  return '';
              });
              return {
                  ok: ((request.status / 100) | 0) === 2,
                  status: request.status,
                  statusText: request.statusText,
                  url: request.responseURL,
                  clone: response,
                  text: function () { return promiseResolve(request.responseText); },
                  json: function () { return promiseResolve(request.responseText).then(JSON.parse); },
                  blob: function () { return promiseResolve(new Blob([request.response])); },
                  headers: {
                      keys: function () { return keys; },
                      entries: function () { return all; },
                      get: function (n) { return headers[n.toLowerCase()]; },
                      has: function (n) { return n.toLowerCase() in headers; },
                  },
              };
          }
      });
  }
  var fetch$1 = typeof global === 'object' && typeof global.fetch === 'function'
      ? global.fetch
      : typeof window === 'undefined'
          ? serverOnlyRequire$1('node-fetch')
          : typeof window.fetch !== 'undefined'
              ? window.fetch
              : tinyFetch;

  function assign(target) {
      var args = [];
      for (var _i = 1; _i < arguments.length; _i++) {
          args[_i - 1] = arguments[_i];
      }
      var to = Object(target);
      for (var index = 1; index < arguments.length; index++) {
          var nextSource = arguments[index];
          if (nextSource != null) {
              // Skip over if undefined or null
              for (var nextKey in nextSource) {
                  // Avoid bugs when hasOwnProperty is shadowed
                  if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                      to[nextKey] = nextSource[nextKey];
                  }
              }
          }
      }
      return to;
  }

  function throttle(func, wait, options) {
      if (options === void 0) { options = {}; }
      var context;
      var args;
      var result;
      var timeout = null;
      var previous = 0;
      var later = function () {
          previous = options.leading === false ? 0 : Date.now();
          timeout = null;
          result = func.apply(context, args);
          if (!timeout)
              context = args = null;
      };
      return function () {
          var now = Date.now();
          if (!previous && options.leading === false)
              previous = now;
          var remaining = wait - (now - previous);
          context = this;
          args = arguments;
          if (remaining <= 0 || remaining > wait) {
              if (timeout) {
                  clearTimeout(timeout);
                  timeout = null;
              }
              previous = now;
              result = func.apply(context, args);
              if (!timeout)
                  context = args = null;
          }
          else if (!timeout && options.trailing !== false) {
              timeout = setTimeout(later, remaining);
          }
          return result;
      };
  }

  var camelCaseToKebabCase = function (str) {
      return str ? str.replace(/([A-Z])/g, function (g) { return "-" + g[0].toLowerCase(); }) : '';
  };
  var Animator = /** @class */ (function () {
      function Animator() {
      }
      Animator.prototype.bindAnimations = function (animations) {
          for (var _i = 0, animations_1 = animations; _i < animations_1.length; _i++) {
              var animation = animations_1[_i];
              switch (animation.trigger) {
                  case 'pageLoad':
                      this.triggerAnimation(animation);
                      break;
                  case 'hover':
                      this.bindHoverAnimation(animation);
                      break;
                  case 'scrollInView':
                      this.bindScrollInViewAnimation(animation);
                      break;
              }
          }
      };
      Animator.prototype.warnElementNotPresent = function (id) {
          console.warn("Cannot animate element: element with ID " + id + " not found!");
      };
      Animator.prototype.augmentAnimation = function (animation, element) {
          var stylesUsed = this.getAllStylesUsed(animation);
          var computedStyle = getComputedStyle(element);
          // const computedStyle = getComputedStyle(element);
          // // FIXME: this will break if original load is in one reponsive size then resize to another hmmm
          // Need to use transform instead of left since left can change on screen sizes
          var firstStyles = animation.steps[0].styles;
          var lastStyles = animation.steps[animation.steps.length - 1].styles;
          var bothStyles = [firstStyles, lastStyles];
          // FIXME: this won't work as expected for augmented animations - may need the editor itself to manage this
          for (var _i = 0, bothStyles_1 = bothStyles; _i < bothStyles_1.length; _i++) {
              var styles = bothStyles_1[_i];
              for (var _a = 0, stylesUsed_1 = stylesUsed; _a < stylesUsed_1.length; _a++) {
                  var style = stylesUsed_1[_a];
                  if (!(style in styles)) {
                      styles[style] = computedStyle[style];
                  }
              }
          }
      };
      Animator.prototype.getAllStylesUsed = function (animation) {
          var properties = [];
          for (var _i = 0, _a = animation.steps; _i < _a.length; _i++) {
              var step = _a[_i];
              for (var key in step.styles) {
                  if (properties.indexOf(key) === -1) {
                      properties.push(key);
                  }
              }
          }
          return properties;
      };
      Animator.prototype.triggerAnimation = function (animation) {
          var _this = this;
          // TODO: do for ALL elements
          var elements = Array.prototype.slice.call(document.getElementsByClassName(animation.elementId || animation.id || ''));
          if (!elements.length) {
              this.warnElementNotPresent(animation.elementId || animation.id || '');
              return;
          }
          Array.from(elements).forEach(function (element) {
              _this.augmentAnimation(animation, element);
              // TODO: do this properly, may have other animations of different properties
              // TODO: only override the properties
              // TODO: if there is an entrance and hover animation, the transition duration will get effed
              // element.setAttribute('style', '');
              // const styledUsed = this.getAllStylesUsed(animation);
              element.style.transition = 'none';
              element.style.transitionDelay = '0';
              assign(element.style, animation.steps[0].styles);
              // TODO: queue/batch these timeouts
              // TODO: only include properties explicitly set in the animation
              // using Object.keys(styles)
              setTimeout(function () {
                  element.style.transition = "all " + animation.duration + "s " + camelCaseToKebabCase(animation.easing);
                  if (animation.delay) {
                      element.style.transitionDelay = animation.delay + 's';
                  }
                  assign(element.style, animation.steps[1].styles);
                  // TODO: maybe remove/reset transitoin property after animation duration
                  // TODO: queue timers
                  setTimeout(function () {
                      // TODO: what if has other transition (reset back to what it was)
                      element.style.transition = '';
                      element.style.transitionDelay = '';
                  }, (animation.delay || 0) * 1000 + animation.duration * 1000 + 100);
              });
          });
      };
      Animator.prototype.bindHoverAnimation = function (animation) {
          var _this = this;
          // TODO: is it multiple binding when editing...?
          // TODO: unbind on element remove
          // TODO: apply to ALL elements
          var elements = Array.prototype.slice.call(document.getElementsByClassName(animation.elementId || animation.id || ''));
          if (!elements.length) {
              this.warnElementNotPresent(animation.elementId || animation.id || '');
              return;
          }
          Array.from(elements).forEach(function (element) {
              _this.augmentAnimation(animation, element);
              var defaultState = animation.steps[0].styles;
              var hoverState = animation.steps[1].styles;
              function attachDefaultState() {
                  assign(element.style, defaultState);
              }
              function attachHoverState() {
                  assign(element.style, hoverState);
              }
              attachDefaultState();
              element.addEventListener('mouseenter', attachHoverState);
              element.addEventListener('mouseleave', attachDefaultState);
              // TODO: queue/batch these timeouts
              setTimeout(function () {
                  element.style.transition = "all " + animation.duration + "s " + camelCaseToKebabCase(animation.easing);
                  if (animation.delay) {
                      element.style.transitionDelay = animation.delay + 's';
                  }
              });
          });
      };
      // TODO: unbind on element remove
      Animator.prototype.bindScrollInViewAnimation = function (animation) {
          var _this = this;
          // TODO: apply to ALL matching elements
          var elements = Array.prototype.slice.call(document.getElementsByClassName(animation.elementId || animation.id || ''));
          if (!elements.length) {
              this.warnElementNotPresent(animation.elementId || animation.id || '');
              return;
          }
          // TODO: if server side rendered and scrolled into view don't animate...
          Array.from(elements).forEach(function (element) {
              _this.augmentAnimation(animation, element);
              var triggered = false;
              function immediateOnScroll() {
                  if (!triggered && isScrolledIntoView(element)) {
                      triggered = true;
                      setTimeout(function () {
                          assign(element.style, animation.steps[1].styles);
                          document.removeEventListener('scroll', onScroll);
                          setTimeout(function () {
                              element.style.transition = '';
                              element.style.transitionDelay = '';
                          }, (animation.duration * 1000 + (animation.delay || 0)) * 1000 + 100);
                      });
                  }
              }
              // TODO: roll all of these in one for more efficiency of checking all the rects
              var onScroll = throttle(immediateOnScroll, 200, { leading: false });
              // TODO: fully in view or partially
              function isScrolledIntoView(elem) {
                  var rect = elem.getBoundingClientRect();
                  var windowHeight = window.innerHeight;
                  var thresholdPrecent = 0;
                  var threshold = thresholdPrecent * windowHeight;
                  // TODO: partial in view? or what if element is larger than screen itself
                  return (rect.bottom > threshold && rect.top < windowHeight - threshold // Element is peeking top or bottom
                  // (rect.top > 0 && rect.bottom < window.innerHeight) || // element fits within the screen and is fully on screen (not hanging off at all)
                  // (rect.top < 0 && rect.bottom > window.innerHeight) // element is larger than the screen and hangs over the top and bottom
                  );
              }
              var defaultState = animation.steps[0].styles;
              function attachDefaultState() {
                  assign(element.style, defaultState);
              }
              attachDefaultState();
              // TODO: queue/batch these timeouts!
              setTimeout(function () {
                  element.style.transition = "all " + animation.duration + "s " + camelCaseToKebabCase(animation.easing);
                  if (animation.delay) {
                      element.style.transitionDelay = animation.delay + 's';
                  }
              });
              // TODO: one listener for everything
              document.addEventListener('scroll', onScroll, { capture: true, passive: true });
              // Do an initial check
              immediateOnScroll();
          });
      };
      return Animator;
  }());

  /**
   * Only gets one level up from hostname
   * wwww.example.com -> example.com
   * www.example.co.uk -> example.co.uk
   */
  function getTopLevelDomain(host) {
      var parts = host.split('.');
      if (parts.length > 2) {
          return parts.slice(1).join('.');
      }
      return host;
  }

  /**
   * RegExp to match field-content in RFC 7230 sec 3.2
   *
   * field-content = field-vchar [ 1*( SP / HTAB ) field-vchar ]
   * field-vchar   = VCHAR / obs-text
   * obs-text      = %x80-FF
   */
  var fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
  var Cookies = /** @class */ (function () {
      function Cookies(request, response) {
          this.request = request;
          this.response = response;
      }
      Cookies.prototype.get = function (name) {
          var header = this.request.headers['cookie'];
          if (!header) {
              return;
          }
          var match = header.match(getPattern(name));
          if (!match) {
              return;
          }
          var value = match[1];
          return value;
      };
      Cookies.prototype.set = function (name, value, opts) {
          var res = this.response;
          var req = this.request;
          var headers = res.getHeader('Set-Cookie') || [];
          // TODO: just make this always true
          var secure = this.secure !== undefined
              ? !!this.secure
              : req.protocol === 'https' || req.connection.encrypted;
          var cookie = new Cookie(name, value, opts);
          if (typeof headers === 'string') {
              headers = [headers];
          }
          if (!secure && opts && opts.secure) {
              throw new Error('Cannot send secure cookie over unencrypted connection');
          }
          cookie.secure = secure;
          if (opts && 'secure' in opts) {
              cookie.secure = !!opts.secure;
          }
          cookie.domain = req.headers.host && getTopLevelDomain(req.headers.host);
          pushCookie(headers, cookie);
          var setHeader = res.setHeader;
          setHeader.call(res, 'Set-Cookie', headers);
          return this;
      };
      return Cookies;
  }());
  var Cookie = /** @class */ (function () {
      function Cookie(name, value, attrs) {
          this.path = '/';
          this.domain = undefined;
          this.httpOnly = true;
          this.sameSite = false;
          this.secure = false;
          this.overwrite = false;
          this.name = '';
          this.value = '';
          if (!fieldContentRegExp.test(name)) {
              throw new TypeError('argument name is invalid');
          }
          if (value && !fieldContentRegExp.test(value)) {
              throw new TypeError('argument value is invalid');
          }
          if (!value) {
              this.expires = new Date(0);
          }
          this.name = name;
          this.value = value || '';
          if (attrs.expires) {
              this.expires = attrs.expires;
          }
          if (attrs.secure) {
              this.secure = attrs.secure;
          }
      }
      Cookie.prototype.toString = function () {
          return this.name + "=" + this.value;
      };
      Cookie.prototype.toHeader = function () {
          var header = this.toString();
          if (this.maxAge) {
              this.expires = new Date(Date.now() + this.maxAge);
          }
          if (this.path) {
              header += "; path=" + this.path;
          }
          if (this.expires) {
              header += "; expires=" + this.expires.toUTCString();
          }
          if (this.domain) {
              header += "; domain=" + this.domain;
          }
          // TODO: samesite=none by default (?)
          header += "; SameSite=" + (this.sameSite === true ? 'strict' : 'None');
          // TODO: On by default
          if (this.secure) {
              header += '; secure';
          }
          if (this.httpOnly) {
              header += '; httponly';
          }
          return header;
      };
      return Cookie;
  }());
  function getPattern(name) {
      return new RegExp("(?:^|;) *" + name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&') + "=([^;]*)");
  }
  function pushCookie(headers, cookie) {
      if (cookie.overwrite) {
          for (var i = headers.length - 1; i >= 0; i--) {
              if (headers[i].indexOf(cookie.name + "=") === 0) {
                  headers.splice(i, 1);
              }
          }
      }
      headers.push(cookie.toHeader());
  }

  function omit(obj) {
      var values = [];
      for (var _i = 1; _i < arguments.length; _i++) {
          values[_i - 1] = arguments[_i];
      }
      var newObject = Object.assign({}, obj);
      for (var _a = 0, values_1 = values; _a < values_1.length; _a++) {
          var key = values_1[_a];
          delete newObject[key];
      }
      return newObject;
  }

  /**
   * @credit https://stackoverflow.com/a/2117523
   */
  function uuidv4() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          var r = (Math.random() * 16) | 0, v = c == 'x' ? r : (r & 0x3) | 0x8;
          return v.toString(16);
      });
  }
  /**
   * Slightly cleaner and smaller UUIDs
   */
  function uuid() {
      return uuidv4().replace(/-/g, '');
  }

  function datePlusMinutes(minutes) {
      if (minutes === void 0) { minutes = 30; }
      return new Date(Date.now() + minutes * 60000);
  }
  var isPositiveNumber = function (thing) {
      return typeof thing === 'number' && !isNaN(thing) && thing >= 0;
  };
  var isReactNative = typeof navigator === 'object' && navigator.product === 'ReactNative';
  var validEnvList = [
      'production',
      'qa',
      'test',
      'development',
      'dev',
      'cdn-qa',
      'cloud',
      'fast',
      'cdn2',
      'cdn-prod',
  ];
  function getQueryParam(url, variable) {
      var query = url.split('?')[1] || '';
      var vars = query.split('&');
      for (var i = 0; i < vars.length; i++) {
          var pair = vars[i].split('=');
          if (decodeURIComponent(pair[0]) === variable) {
              return decodeURIComponent(pair[1]);
          }
      }
      return null;
  }
  var urlParser = {
      parse: function (url) {
          var parser = document.createElement('a');
          parser.href = url;
          var out = {};
          var props = 'username password host hostname port protocol origin pathname search hash'.split(' ');
          for (var i = props.length; i--;) {
              out[props[i]] = parser[props[i]];
          }
          // IE 11 pathname handling workaround
          // (IE omits preceeding '/', unlike other browsers)
          if ((out.pathname || out.pathname === '') &&
              typeof out.pathname === 'string' &&
              out.pathname.indexOf('/') !== 0) {
              out.pathname = '/' + out.pathname;
          }
          return out;
      },
  };
  var parse = isReactNative
      ? function () { return ({}); }
      : typeof window === 'object'
          ? urlParser.parse
          : serverOnlyRequire$1('url').parse;
  function setCookie(name$$1, value, expires) {
      try {
          var expiresString = '';
          // TODO: need to know if secure server side
          if (expires) {
              expiresString = '; expires=' + expires.toUTCString();
          }
          var secure = isBrowser ? location.protocol === 'https:' : true;
          document.cookie =
              name$$1 +
                  '=' +
                  (value || '') +
                  expiresString +
                  '; path=/' +
                  ("; domain=" + getTopLevelDomain(location.hostname)) +
                  (secure ? ';secure ; SameSite=None' : '');
      }
      catch (err) {
          console.warn('Could not set cookie', err);
      }
  }
  function getCookie(name$$1) {
      try {
          return (decodeURIComponent(document.cookie.replace(new RegExp('(?:(?:^|.*;)\\s*' +
              encodeURIComponent(name$$1).replace(/[\-\.\+\*]/g, '\\$&') +
              '\\s*\\=\\s*([^;]*).*$)|^.*$'), '$1')) || null);
      }
      catch (err) {
          console.warn('Could not get cookie', err);
      }
  }
  function size(object) {
      return Object.keys(object).length;
  }
  function find(target, callback) {
      var list = target;
      // Makes sures is always has an positive integer as length.
      var length = list.length >>> 0;
      var thisArg = arguments[1];
      for (var i = 0; i < length; i++) {
          var element = list[i];
          if (callback.call(thisArg, element, i, list)) {
              return element;
          }
      }
  }
  var sessionStorageKey = 'builderSessionId';
  var localStorageKey = 'builderVisitorId';
  var isBrowser = typeof window !== 'undefined' && !isReactNative;
  var isIframe = isBrowser && window.top !== window.self;
  var Builder = /** @class */ (function () {
      function Builder(apiKey, request, response, forceNewInstance, authToken) {
          var _this = this;
          if (apiKey === void 0) { apiKey = null; }
          if (forceNewInstance === void 0) { forceNewInstance = false; }
          if (authToken === void 0) { authToken = null; }
          this.request = request;
          this.response = response;
          this.eventsQueue = [];
          this.throttledClearEventsQueue = throttle(function () {
              _this.processEventsQueue();
              // Extend the session cookie
              _this.setCookie(sessionStorageKey, _this.sessionId, datePlusMinutes(30));
          }, 5);
          this.env = 'production';
          this.sessionId = this.getSessionId();
          this.targetContent = true;
          this.contentPerRequest = 1;
          // TODO: make array or function
          this.allowCustomFonts = true;
          this.cookies = null;
          // TODO: api options object
          this.cachebust = false;
          this.overrideParams = '';
          this.noCache = false;
          this.preview = false;
          this.canTrack$ = new BehaviorSubject(!this.browserTrackingDisabled);
          this.apiKey$ = new BehaviorSubject(null);
          this.authToken$ = new BehaviorSubject(null);
          this.userAttributesChanged = new BehaviorSubject(null);
          this.editingMode$ = new BehaviorSubject(isIframe);
          // TODO: decorator to do this stuff with the get/set (how do with typing too? compiler?)
          this.editingModel$ = new BehaviorSubject(null);
          this.userAgent = (typeof navigator === 'object' && navigator.userAgent) || '';
          this.trackingHooks = [];
          // Set this to control the userId
          // TODO: allow changing it mid session and updating existing data to be associated
          // e.g. for when a user navigates and then logs in
          this.visitorId = this.getVisitorId();
          this.autoTrack = !Builder.isBrowser
              ? false
              : !this.isDevelopmentEnv &&
                  !(Builder.isBrowser && location.search.indexOf('builder.preview=') !== -1);
          this.trackingUserAttributes = {};
          this.blockContentLoading = '';
          this.observersByKey = {};
          this.noEditorUpdates = {};
          this.overrides = {};
          this.getContentQueue = null;
          this.priorContentQueue = null;
          this.testCookiePrefix = 'builder.tests';
          this.cookieQueue = [];
          // TODO: use a window variable for this perhaps, e.g. bc webcomponents may be loading builder twice
          // with it's and react (use rollup build to fix)
          if (Builder.isBrowser && !forceNewInstance && Builder.singletonInstance) {
              return Builder.singletonInstance;
          }
          if (this.request && this.response) {
              this.setUserAgent(this.request.headers['user-agent'] || '');
              this.cookies = new Cookies(this.request, this.response);
          }
          if (apiKey) {
              this.apiKey = apiKey;
          }
          if (authToken) {
              this.authToken = authToken;
          }
          if (isBrowser) {
              this.bindMessageListeners();
              // TODO: postmessage to parent the builder info for every package
              // type: 'builder.sdk', data: { name: '@builder.io/react', version: '0.1.23' }
              // (window as any).BUILDER_VERSION = Builder.VERSION;
              // Ensure always one Builder global singleton
              // TODO: some people won't want this, e.g. rakuten
              // Maybe hide this behind symbol or on document, etc
              // if ((window as any).Builder) {
              //   Builder.components = (window as any).Builder.components;
              // } else {
              //   (window as any).Builder = Builder;
              // }
          }
          if (isIframe) {
              this.messageFrameLoaded();
          }
          // TODO: on destroy clear subscription
          this.canTrack$.subscribe(function (value) {
              if (value) {
                  if (typeof sessionStorage !== 'undefined') {
                      try {
                          if (!sessionStorage.getItem(sessionStorageKey)) {
                              sessionStorage.setItem(sessionStorageKey, _this.sessionId);
                          }
                      }
                      catch (err) {
                          console.debug('Session storage error', err);
                      }
                  }
                  if (_this.eventsQueue.length) {
                      _this.throttledClearEventsQueue();
                  }
                  if (_this.cookieQueue.length) {
                      _this.cookieQueue.forEach(function (item) {
                          _this.setCookie(item[0], item[1]);
                      });
                      _this.cookieQueue.length = 0;
                  }
              }
          });
          if (isBrowser) {
              // TODO: defer so subclass constructor runs and injects location service
              this.setTestsFromUrl();
              // TODO: do this on every request send?
              this.getOverridesFromQueryString();
          }
      }
      Builder.register = function (type, info) {
          // TODO: all must have name and can't conflict?
          var typeList = this.registry[type];
          if (!typeList) {
              typeList = this.registry[type] = [];
          }
          typeList.push(info);
          if (Builder.isBrowser) {
              var message = {
                  type: 'builder.register',
                  data: {
                      type: type,
                      info: info,
                  },
              };
              try {
                  parent.postMessage(message, '*');
                  if (parent !== window) {
                      window.postMessage(message, '*');
                  }
              }
              catch (err) {
                  console.debug('Could not postmessage', err);
              }
          }
          this.registryChange.next(this.registry);
      };
      Builder.registerEditor = function (info) {
          if (Builder.isBrowser) {
              window.postMessage({
                  type: 'builder.registerEditor',
                  data: omit(info, 'component'),
              }, '*');
              var hostname = location.hostname;
              if (!Builder.isTrustedHost(hostname)) {
                  console.error('Builder.registerEditor() called in the wrong environment! You cannot load custom editors from your app, they must be loaded through the Builder.io app itself. Follow the readme here for more details: https://github.com/builderio/builder/tree/master/plugins/cloudinary or contact chat us in our Spectrum community for help: https://spectrum.chat/builder');
              }
          }
          this.editors.push(info);
      };
      Builder.registerPlugin = function (info) {
          this.plugins.push(info);
      };
      Builder.registerAction = function (action) {
          this.actions.push(action);
      };
      Builder.registerTrustedHost = function (host) {
          this.trustedHosts.push(host);
      };
      Builder.isTrustedHost = function (hostname) {
          return (this.trustedHosts.findIndex(function (trustedHost) { return trustedHost === hostname || hostname.endsWith("." + trustedHost); }) > -1);
      };
      Builder.runAction = function (action) {
          // TODO
          var actionObject = typeof action === 'string' ? find(this.actions, function (item) { return item.name === action; }) : action;
          if (!actionObject) {
              throw new Error("Action not found: " + action);
          }
      };
      Builder.fields = function (name$$1, fields) {
          var _a;
          (_a = window.parent) === null || _a === void 0 ? void 0 : _a.postMessage({
              type: 'builder.fields',
              data: { name: name$$1, fields: fields },
          }, '*');
      };
      Builder.set = function (settings) {
          if (Builder.isBrowser) {
              // TODO: merge
              Object.assign(this.settings, settings);
              var message = {
                  type: 'builder.settingsChange',
                  data: this.settings,
              };
              parent.postMessage(message, '*');
          }
          this.settingsChange.next(this.settings);
      };
      Builder.import = function (packageName) {
          if (!Builder.isBrowser) {
              // TODO: server side support *maybe*
              console.warn('Builder.import used on the server - this should only be used in the browser');
              return;
          }
          var System = window.System;
          if (!System) {
              console.warn('System.js not available. Please include System.js when using Builder.import');
              return;
          }
          return System.import("https://cdn.builder.io/systemjs/" + packageName);
      };
      Object.defineProperty(Builder, "editingPage", {
          // useCdnApi = false;
          get: function () {
              return this._editingPage;
          },
          set: function (editingPage) {
              this._editingPage = editingPage;
              if (isBrowser && isIframe) {
                  if (editingPage) {
                      document.body.classList.add('builder-editing-page');
                  }
                  else {
                      document.body.classList.remove('builder-editing-page');
                  }
              }
          },
          enumerable: true,
          configurable: true
      });
      Builder.prepareComponentSpecToSend = function (spec) {
          return __assign(__assign(__assign({}, spec), (spec.inputs && {
              inputs: spec.inputs.map(function (input) {
                  var _a;
                  // TODO: do for nexted fields too
                  // TODO: probably just convert all functions, not just
                  // TODO: put this in input hooks: { onChange: ..., showIf: ... }
                  var keysToConvertFnToString = ['onChange', 'showIf'];
                  for (var _i = 0, keysToConvertFnToString_1 = keysToConvertFnToString; _i < keysToConvertFnToString_1.length; _i++) {
                      var key = keysToConvertFnToString_1[_i];
                      if (input[key] && typeof input[key] === 'function') {
                          var fn = input[key];
                          input = __assign(__assign({}, input), (_a = {}, _a[key] = "return (" + fn.toString() + ").apply(this, arguments)", _a));
                      }
                  }
                  return input;
              }),
          })), { hooks: Object.keys(spec.hooks || {}).reduce(function (memo, key) {
                  var value = spec.hooks && spec.hooks[key];
                  if (!value) {
                      return memo;
                  }
                  if (typeof value === 'string') {
                      memo[key] = value;
                  }
                  else {
                      memo[key] = "return (" + value.toString() + ").apply(this, arguments)";
                  }
                  return memo;
              }, {}), class: undefined });
      };
      Builder.registerBlock = function (component, options) {
          this.registerComponent(component, options);
      };
      Builder.registerComponent = function (component, options) {
          var _a;
          var spec = __assign(__assign({ class: component }, component.builderOptions), options);
          this.addComponent(spec);
          var editable = options.models && this.singletonInstance.editingModel
              ? isBrowser && options.models.includes(this.singletonInstance.editingModel)
              : isBrowser;
          if (editable) {
              var sendSpec = this.prepareComponentSpecToSend(spec);
              (_a = window.parent) === null || _a === void 0 ? void 0 : _a.postMessage({
                  type: 'builder.registerComponent',
                  data: sendSpec,
              }, '*');
          }
      };
      Builder.addComponent = function (component) {
          var current = find(this.components, function (item) { return item.name === component.name; });
          if (current) {
              // FIXME: why does sometimes we get an extra post without class - probably
              // from postMessage handler wrong in some place
              if (current.class && !component.class) {
                  return;
              }
              this.components.splice(this.components.indexOf(current), 1, component);
          }
          else {
              this.components.push(component);
          }
      };
      // TODO: style guide, etc off this system as well?
      Builder.component = function (info) {
          var _this = this;
          if (info === void 0) { info = {}; }
          return function (component) {
              var _a;
              var spec = __assign(__assign({}, info), { class: component });
              if (!spec.name) {
                  spec.name = component.name;
              }
              _this.addComponent(spec);
              var sendSpec = _this.prepareComponentSpecToSend(spec);
              // TODO: serialize component name and inputs
              if (isBrowser) {
                  (_a = window.parent) === null || _a === void 0 ? void 0 : _a.postMessage({
                      type: 'builder.registerComponent',
                      data: sendSpec,
                  }, '*');
              }
              return component;
          };
      };
      Object.defineProperty(Builder, "Component", {
          get: function () {
              return this.component;
          },
          enumerable: true,
          configurable: true
      });
      Builder.prototype.processEventsQueue = function () {
          if (!this.eventsQueue.length) {
              return;
          }
          var events = this.eventsQueue;
          this.eventsQueue = [];
          var fullUserAttributes = __assign(__assign({}, Builder.overrideUserAttributes), this.trackingUserAttributes);
          for (var _i = 0, events_1 = events; _i < events_1.length; _i++) {
              var event_1 = events_1[_i];
              if (!event_1.data.metadata) {
                  event_1.data.metadata = {};
              }
              if (!event_1.data.metadata.user) {
                  event_1.data.metadata.user = {};
              }
              Object.assign(event_1.data.metadata.user, fullUserAttributes, event_1.data.metadata.user);
          }
          var host = this.host;
          fetch$1(host + "/api/v1/track", {
              method: 'POST',
              body: JSON.stringify({ events: events }),
              headers: {
                  'content-type': 'application/json',
              },
              mode: 'cors',
          }).catch(function () {
              // Not the end of the world
          });
      };
      Object.defineProperty(Builder.prototype, "browserTrackingDisabled", {
          get: function () {
              return Boolean(Builder.isBrowser && window.builderNoTrack);
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(Builder.prototype, "canTrack", {
          get: function () {
              return this.canTrack$.value;
          },
          set: function (canTrack) {
              if (this.canTrack !== canTrack) {
                  this.canTrack$.next(canTrack);
              }
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(Builder.prototype, "editingMode", {
          get: function () {
              return this.editingMode$.value;
          },
          set: function (value) {
              if (value !== this.editingMode) {
                  this.editingMode$.next(value);
              }
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(Builder.prototype, "editingModel", {
          get: function () {
              return this.editingModel$.value;
          },
          set: function (value) {
              if (value !== this.editingModel) {
                  this.editingModel$.next(value);
              }
          },
          enumerable: true,
          configurable: true
      });
      Builder.prototype.findParentElement = function (target, callback, checkElement) {
          if (checkElement === void 0) { checkElement = true; }
          if (!(target instanceof HTMLElement)) {
              return null;
          }
          var parent = checkElement ? target : target.parentElement;
          do {
              if (!parent) {
                  return null;
              }
              var matches = callback(parent);
              if (matches) {
                  return parent;
              }
          } while ((parent = parent.parentElement));
          return null;
      };
      Builder.prototype.findBuilderParent = function (target) {
          return this.findParentElement(target, function (el) {
              var id = el.getAttribute('builder-id') || el.id;
              return Boolean(id && id.indexOf('builder-') === 0);
          });
      };
      Builder.prototype.setUserAgent = function (userAgent) {
          this.userAgent = userAgent || '';
      };
      /**
       * Set a hook to modify events being tracked from builder, such as impressions and clicks
       *
       * For example, to track the model ID of each event associated with content for querying
       * by mode, you can do
       *
       *    builder.setTrackingHook((event, context) => {
       *      if (context.content) {
       *        event.data.metadata.modelId = context.content.modelId
       *      }
       *    })
       */
      Builder.prototype.setTrackingHook = function (hook) {
          this.trackingHooks.push(hook);
      };
      Builder.prototype.track = function (eventName, properties, context) {
          if (properties === void 0) { properties = {}; }
          // TODO: queue up track requests and fire them off when canTrack set to true - otherwise may get lots of clicks with no impressions
          if (isIframe || !isBrowser || Builder.isPreviewing) {
              return;
          }
          var apiKey = this.apiKey;
          if (!apiKey) {
              console.error('Builder integration error: Looks like the Builder SDK has not been initialized properly (your API key has not been set). Make sure you are calling `builder.init("«YOUR-API-KEY»");` as early as possible in your application\'s code.');
              return;
          }
          var eventData = JSON.parse(JSON.stringify({
              type: eventName,
              data: __assign(__assign({}, omit(properties, 'meta')), { metadata: __assign(__assign({ sdkVersion: Builder.VERSION, url: location.href }, properties.meta), properties.metadata), ownerId: apiKey, userAttributes: this.getUserAttributes(), sessionId: this.sessionId, visitorId: this.visitorId }),
          }));
          for (var _i = 0, _a = this.trackingHooks; _i < _a.length; _i++) {
              var hook = _a[_i];
              var returnValue = hook(eventData, context || {});
              if (returnValue) {
                  eventData = returnValue;
              }
          }
          // batch events
          this.eventsQueue.push(eventData);
          if (this.canTrack) {
              this.throttledClearEventsQueue();
          }
      };
      Builder.prototype.getSessionId = function () {
          var _this = this;
          var sessionId = null;
          try {
              if (Builder.isBrowser && typeof sessionStorage !== 'undefined') {
                  sessionId = this.getCookie(sessionStorageKey);
              }
          }
          catch (err) {
              console.debug('Session storage error', err);
              // It's ok
          }
          if (!sessionId) {
              sessionId = uuid();
          }
          // Give the app a second to start up and set canTrack to false if needed
          if (Builder.isBrowser) {
              setTimeout(function () {
                  try {
                      if (_this.canTrack) {
                          _this.setCookie(sessionStorageKey, sessionId, datePlusMinutes(30));
                      }
                  }
                  catch (err) {
                      console.debug('Cookie setting error', err);
                  }
              });
          }
          return sessionId;
      };
      Builder.prototype.getVisitorId = function () {
          var _this = this;
          if (this.visitorId) {
              return this.visitorId;
          }
          var visitorId = null;
          try {
              if (Builder.isBrowser && typeof localStorage !== 'undefined') {
                  // TODO: cookie instead?
                  visitorId = localStorage.getItem(localStorageKey);
              }
          }
          catch (err) {
              console.debug('Local storage error', err);
              // It's ok
          }
          if (!visitorId) {
              visitorId = uuid();
          }
          this.visitorId = visitorId;
          // Give the app a second to start up and set canTrack to false if needed
          if (Builder.isBrowser) {
              setTimeout(function () {
                  try {
                      if (_this.canTrack && typeof localStorage !== 'undefined' && visitorId) {
                          localStorage.setItem(localStorageKey, visitorId);
                      }
                  }
                  catch (err) {
                      console.debug('Session storage error', err);
                  }
              });
          }
          return visitorId;
      };
      Builder.prototype.trackImpression = function (contentId, variationId, properties, context) {
          if (isIframe || !isBrowser || Builder.isPreviewing) {
              return;
          }
          // TODO: use this.track method
          this.track('impression', {
              contentId: contentId,
              variationId: variationId !== contentId ? variationId : undefined,
              metadata: properties,
          }, context);
      };
      Builder.prototype.trackConversion = function (amount, contentId, variationId, customProperties, context) {
          if (isIframe || !isBrowser || Builder.isPreviewing) {
              return;
          }
          var meta = typeof contentId === 'object' ? contentId : customProperties;
          var useContentId = typeof contentId === 'string' ? contentId : undefined;
          this.track('conversion', { amount: amount, variationId: variationId, meta: meta, contentId: useContentId }, context);
      };
      Object.defineProperty(Builder.prototype, "isDevelopmentEnv", {
          // TODO: set this for QA
          get: function () {
              // Automatic determining of development environment
              return (Builder.isIframe ||
                  (Builder.isBrowser && (location.hostname === 'localhost' || location.port !== '')) ||
                  this.env !== 'production');
          },
          enumerable: true,
          configurable: true
      });
      Builder.prototype.trackInteraction = function (contentId, variationId, alreadyTrackedOne, event, context) {
          if (alreadyTrackedOne === void 0) { alreadyTrackedOne = false; }
          if (isIframe || !isBrowser || Builder.isPreviewing) {
              return;
          }
          var target = event && event.target;
          var targetBuilderElement = target && this.findBuilderParent(target);
          function round(num) {
              return Math.round(num * 1000) / 1000;
          }
          var metadata = {};
          if (event) {
              var clientX = event.clientX, clientY = event.clientY;
              if (target) {
                  var targetRect = target.getBoundingClientRect();
                  var xOffset = clientX - targetRect.left;
                  var yOffset = clientY - targetRect.top;
                  var xRatio = round(xOffset / targetRect.width);
                  var yRatio = round(yOffset / targetRect.height);
                  metadata.targetOffset = {
                      x: xRatio,
                      y: yRatio,
                  };
              }
              if (targetBuilderElement) {
                  var targetRect = targetBuilderElement.getBoundingClientRect();
                  var xOffset = clientX - targetRect.left;
                  var yOffset = clientY - targetRect.top;
                  var xRatio = round(xOffset / targetRect.width);
                  var yRatio = round(yOffset / targetRect.height);
                  metadata.builderTargetOffset = {
                      x: xRatio,
                      y: yRatio,
                  };
              }
          }
          var builderId = targetBuilderElement &&
              (targetBuilderElement.getAttribute('builder-id') || targetBuilderElement.id);
          if (builderId && targetBuilderElement) {
              metadata.builderElementIndex = [].slice
                  .call(document.getElementsByClassName(builderId))
                  .indexOf(targetBuilderElement);
          }
          this.track('click', {
              contentId: contentId,
              metadata: metadata,
              variationId: variationId !== contentId ? variationId : undefined,
              unique: !alreadyTrackedOne,
              targetBuilderElement: builderId || undefined,
          }, context);
      };
      Builder.prototype.component = function (info) {
          if (info === void 0) { info = {}; }
          return Builder.component(info);
      };
      Object.defineProperty(Builder.prototype, "apiKey", {
          get: function () {
              return this.apiKey$.value;
          },
          set: function (key) {
              this.apiKey$.next(key);
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(Builder.prototype, "authToken", {
          get: function () {
              return this.authToken$.value;
          },
          set: function (token) {
              this.authToken$.next(token);
          },
          enumerable: true,
          configurable: true
      });
      Builder.prototype.modifySearch = function (search) {
          return search.replace(/(^|&|\?)(builder_.*?)=/gi, function (_match, group1, group2) { return group1 + group2.replace(/_/g, '.') + '='; });
      };
      Builder.prototype.setTestsFromUrl = function () {
          var search = this.getLocation().search;
          var params = QueryString.parseDeep(this.modifySearch(search || '').substr(1));
          var tests = params.builder && params.builder.tests;
          if (tests && typeof tests === 'object') {
              for (var key in tests) {
                  if (tests.hasOwnProperty(key)) {
                      this.setTestCookie(key, tests[key]);
                  }
              }
          }
      };
      Builder.prototype.resetOverrides = function () {
          // Ugly - pass down instances per request instead using react context
          // or use builder.get('foo', { req, res }) in react...........
          Builder.overrideUserAttributes = {};
          this.cachebust = false;
          this.noCache = false;
          this.preview = false;
          this.editingModel = null;
          this.overrides = {};
          this.env = 'production';
          this.userAgent = '';
          this.request = undefined;
          this.response = undefined;
      };
      Builder.prototype.getOverridesFromQueryString = function () {
          var location = this.getLocation();
          var params = QueryString.parseDeep(this.modifySearch(location.search || '').substr(1));
          var builder = params.builder;
          if (builder) {
              var userAttributes = builder.userAttributes, overrides = builder.overrides, env = builder.env, host = builder.host, api = builder.api, cachebust = builder.cachebust, noCache = builder.noCache, preview = builder.preview, editing = builder.editing, frameEditing = builder.frameEditing, overrideParams = builder.params;
              if (userAttributes) {
                  this.setUserAttributes(userAttributes);
              }
              if (overrides) {
                  this.overrides = overrides;
              }
              if (validEnvList.indexOf(env || api) > -1) {
                  this.env = env || api;
              }
              if (Builder.isEditing) {
                  var editingModel = frameEditing || editing || preview;
                  if (editingModel && editingModel !== 'true') {
                      this.editingModel = editingModel;
                  }
              }
              if (cachebust) {
                  this.cachebust = true;
              }
              if (noCache) {
                  this.noCache = true;
              }
              if (preview) {
                  this.preview = true;
              }
              if (params) {
                  this.overrideParams = overrideParams;
              }
          }
      };
      Builder.prototype.messageFrameLoaded = function () {
          var _a;
          (_a = window.parent) === null || _a === void 0 ? void 0 : _a.postMessage({
              type: 'builder.loaded',
              data: {
                  value: true,
              },
          }, '*');
      };
      Builder.prototype.bindMessageListeners = function () {
          var _this = this;
          if (isBrowser) {
              addEventListener('message', function (event) {
                  var _a, _b, _c, _d, _e;
                  var url = parse(event.origin);
                  var isRestricted = ['builder.register', 'builder.registerComponent'].indexOf((_a = event.data) === null || _a === void 0 ? void 0 : _a.type) === -1;
                  var isTrusted = url.hostname && Builder.isTrustedHost(url.hostname);
                  if (isRestricted && !isTrusted) {
                      return;
                  }
                  var data = event.data;
                  if (data) {
                      switch (data.type) {
                          case 'builder.ping': {
                              (_b = window.parent) === null || _b === void 0 ? void 0 : _b.postMessage({
                                  type: 'builder.pong',
                                  data: {},
                              }, '*');
                              break;
                          }
                          case 'builder.register': {
                              // TODO: possibly do this for all...
                              if (event.source === window) {
                                  break;
                              }
                              var options = data.data;
                              if (!options) {
                                  break;
                              }
                              var type = options.type, info = options.info;
                              // TODO: all must have name and can't conflict?
                              var typeList = Builder.registry[type];
                              if (!typeList) {
                                  typeList = Builder.registry[type] = [];
                              }
                              typeList.push(info);
                              Builder.registryChange.next(Builder.registry);
                              break;
                          }
                          case 'builder.settingsChange': {
                              // TODO: possibly do this for all...
                              if (event.source === window) {
                                  break;
                              }
                              var settings = data.data;
                              if (!settings) {
                                  break;
                              }
                              Object.assign(Builder.settings, settings);
                              Builder.settingsChange.next(Builder.settings);
                              break;
                          }
                          case 'builder.registerEditor': {
                              // TODO: possibly do this for all...
                              if (event.source === window) {
                                  break;
                              }
                              var info_1 = data.data;
                              if (!info_1) {
                                  break;
                              }
                              var hasComponent_1 = !!info_1.component;
                              Builder.editors.every(function (thisInfo, index) {
                                  if (info_1.name === thisInfo.name) {
                                      if (thisInfo.component && !hasComponent_1) {
                                          return false;
                                      }
                                      else {
                                          Builder.editors[index] = thisInfo;
                                      }
                                      return false;
                                  }
                                  return true;
                              });
                              break;
                          }
                          case 'builder.triggerAnimation': {
                              Builder.animator.triggerAnimation(data.data);
                              break;
                          }
                          case 'builder.contentUpdate':
                              var key = data.data.key || data.data.alias || data.data.entry || data.data.modelName;
                              var contentData = data.data.data; // hmmm...
                              var observer = _this.observersByKey[key];
                              if (observer && !_this.noEditorUpdates[key]) {
                                  observer.next([contentData]);
                              }
                              break;
                          case 'builder.getComponents':
                              (_c = window.parent) === null || _c === void 0 ? void 0 : _c.postMessage({
                                  type: 'builder.components',
                                  data: Builder.components.map(function (item) { return Builder.prepareComponentSpecToSend(item); }),
                              }, '*');
                              break;
                          case 'builder.editingModel':
                              _this.editingModel = data.data.model;
                              break;
                          case 'builder.registerComponent':
                              var componentData = data.data;
                              Builder.addComponent(componentData);
                              break;
                          case 'builder.blockContentLoading':
                              if (typeof data.data.model === 'string') {
                                  _this.blockContentLoading = data.data.model;
                              }
                              break;
                          case 'builder.editingMode':
                              var editingMode = data.data;
                              if (editingMode) {
                                  _this.editingMode = true;
                                  document.body.classList.add('builder-editing');
                              }
                              else {
                                  _this.editingMode = false;
                                  document.body.classList.remove('builder-editing');
                              }
                              break;
                          case 'builder.editingPageMode':
                              var editingPageMode = data.data;
                              Builder.editingPage = editingPageMode;
                              break;
                          case 'builder.overrideUserAttributes':
                              var userAttributes = data.data;
                              assign(Builder.overrideUserAttributes, userAttributes);
                              _this.flushGetContentQueue(true);
                              // TODO: refetch too
                              break;
                          case 'builder.overrideTestGroup':
                              var _f = data.data, variationId = _f.variationId, contentId = _f.contentId;
                              if (variationId && contentId) {
                                  _this.setTestCookie(contentId, variationId);
                                  _this.flushGetContentQueue(true);
                              }
                              break;
                          case 'builder.evaluate': {
                              var text = data.data.text;
                              var args = data.data.arguments || [];
                              var id_1 = data.data.id;
                              // tslint:disable-next-line:no-function-constructor-with-string-args
                              var fn = new Function(text);
                              var result = void 0;
                              var error = null;
                              try {
                                  result = fn.apply(_this, args);
                              }
                              catch (err) {
                                  error = err;
                              }
                              if (error) {
                                  (_d = window.parent) === null || _d === void 0 ? void 0 : _d.postMessage({
                                      type: 'builder.evaluateError',
                                      data: { id: id_1, error: error.message },
                                  }, '*');
                              }
                              else {
                                  if (result && typeof result.then === 'function') {
                                      result
                                          .then(function (finalResult) {
                                          var _a;
                                          (_a = window.parent) === null || _a === void 0 ? void 0 : _a.postMessage({
                                              type: 'builder.evaluateResult',
                                              data: { id: id_1, result: finalResult },
                                          }, '*');
                                      })
                                          .catch(console.error);
                                  }
                                  else {
                                      (_e = window.parent) === null || _e === void 0 ? void 0 : _e.postMessage({
                                          type: 'builder.evaluateResult',
                                          data: { result: result, id: id_1 },
                                      }, '*');
                                  }
                              }
                              break;
                          }
                      }
                  }
              });
          }
      };
      Object.defineProperty(Builder.prototype, "defaultCanTrack", {
          get: function () {
              return Boolean(Builder.isBrowser &&
                  navigator.userAgent.trim() &&
                  !navigator.userAgent.match(/bot|crawler|spider|robot|crawling|prerender|google|baidu|bing|msn|duckduckbot|teoma|slurp|yandex|phantom|headless|selenium|puppeteer/i) &&
                  !this.browserTrackingDisabled);
          },
          enumerable: true,
          configurable: true
      });
      Builder.prototype.init = function (apiKey, canTrack, req, res, authToken) {
          if (canTrack === void 0) { canTrack = this.defaultCanTrack; }
          if (req) {
              this.request = req;
          }
          if (res) {
              this.response = res;
          }
          this.canTrack = canTrack;
          this.apiKey = apiKey;
          if (authToken) {
              this.authToken = authToken;
          }
          return this;
      };
      Object.defineProperty(Builder.prototype, "previewingModel", {
          get: function () {
              var search = this.getLocation().search;
              var params = QueryString.parse((search || '').substr(1));
              return params['builder.preview'];
          },
          enumerable: true,
          configurable: true
      });
      // TODO: allow adding location object as property and/or in constructor
      Builder.prototype.getLocation = function () {
          var parsedLocation = {};
          // in ssr mode
          if (this.request) {
              parsedLocation = parse(this.request.url);
          }
          else if (typeof location === 'object') {
              // in the browser
              parsedLocation = parse(location.href);
          }
          // IE11 bug with parsed path being empty string
          // causes issues with our user targeting
          if (parsedLocation.pathname === '') {
              parsedLocation.pathname = '/';
          }
          return parsedLocation;
      };
      Builder.prototype.getUserAttributes = function (userAgent) {
          if (userAgent === void 0) { userAgent = this.userAgent || ''; }
          var isMobile = {
              Android: function () {
                  return userAgent.match(/Android/i);
              },
              BlackBerry: function () {
                  return userAgent.match(/BlackBerry/i);
              },
              iOS: function () {
                  return userAgent.match(/iPhone|iPod/i);
              },
              Opera: function () {
                  return userAgent.match(/Opera Mini/i);
              },
              Windows: function () {
                  return userAgent.match(/IEMobile/i) || userAgent.match(/WPDesktop/i);
              },
              any: function () {
                  return (isMobile.Android() ||
                      isMobile.BlackBerry() ||
                      isMobile.iOS() ||
                      isMobile.Opera() ||
                      isMobile.Windows());
              },
          };
          var isTablet = userAgent.match(/Tablet|iPad/i);
          var url = this.getLocation();
          return __assign({ urlPath: url.pathname, host: url.host || url.hostname, 
              // TODO: maybe an option to choose to target off of mobile/tablet/desktop or just mobile/desktop
              device: isTablet ? 'tablet' : isMobile.any() ? 'mobile' : 'desktop' }, Builder.overrideUserAttributes);
      };
      Builder.prototype.setUserAttributes = function (options) {
          assign(Builder.overrideUserAttributes, options);
          this.userAttributesChanged.next(options);
      };
      /**
       * Set user attributes just for tracking purposes.
       *
       * Do this so properties exist on event objects for querying insights, but
       * won't affect targeting
       *
       * Use this when you want to track properties but don't need to target off
       * of them to optimize cache efficiency
       */
      Builder.prototype.setTrackingUserAttributes = function (attributes) {
          assign(this.trackingUserAttributes, attributes);
      };
      Builder.prototype.get = function (modelName, options) {
          if (options === void 0) { options = {}; }
          var instance = this;
          if (!Builder.isBrowser) {
              instance = new Builder(options.apiKey || this.apiKey, options.req, options.res, undefined, options.authToken || this.authToken);
              instance.setUserAttributes(this.getUserAttributes());
          }
          else {
              if (options.apiKey && !this.apiKey) {
                  this.apiKey = options.apiKey;
              }
              if (options.authToken && !this.authToken) {
                  this.authToken = options.authToken;
              }
          }
          return instance.queueGetContent(modelName, options).map(
          /* map( */ function (matches) {
              var match = matches && matches[0];
              if (Builder.isStatic) {
                  return match;
              }
              var matchData = match && match.data;
              if (!matchData) {
                  return null;
              }
              if (typeof matchData.blocksString !== 'undefined') {
                  matchData.blocks = JSON.parse(matchData.blocksString);
                  delete matchData.blocksString;
              }
              return {
                  // TODO: add ab test info here and other high level stuff
                  data: matchData,
                  id: match.id,
                  variationId: match.testVariationId || match.variationId || null,
                  testVariationId: match.testVariationId || match.variationId || null,
                  testVariationName: match.testVariationName || null,
                  lastUpdated: match.lastUpdated || null,
              };
          });
          // );
      };
      // TODO: entry id in options
      Builder.prototype.queueGetContent = function (modelName, options) {
          var _this = this;
          if (options === void 0) { options = {}; }
          // TODO: if query do modelName + query
          var key = options.key ||
              options.alias ||
              // TODO: SDKs only pass entry key when given to them, and never when editing...
              // options.entry ||
              // TODO: this is ugly - instead of multiple of same model with different options are sent
              // say requires key/alias. Or if not perhaps make a reliable hash of the options and use that.
              // TODO: store last user state on last request and if user attributes different now
              // give a warning that need to use keys to request new contente
              // (options &&
              //   Object.keys(options).filter(key => key !== 'model').length &&
              //   JSON.stringify({ model: modelName, ...options, initialContent: undefined })) ||
              modelName;
          var isEditingThisModel = this.editingModel === modelName;
          // TODO: include params in this key........
          var currentObservable = this.observersByKey[key];
          // if (options.query && options.query._id) {
          //   this.flushGetContentQueue([options])
          // }
          if (this.apiKey === 'DEMO' && !this.overrides[key] && !options.initialContent) {
              options.initialContent = [];
          }
          var initialContent = options.initialContent;
          // TODO: refresh option in options
          if (currentObservable && (!currentObservable.value || options.cache)) {
              // TODO: test if this ran, otherwise on 404 some observers may never be called...
              if (currentObservable.value) {
                  nextTick(function () {
                      // TODO: return a new observable and only that one fires subscribers, don't refire for existing ones
                      currentObservable.next(currentObservable.value);
                  });
              }
              return currentObservable;
          }
          if (isEditingThisModel) {
              if (Builder.isBrowser) {
                  parent.postMessage({ type: 'builder.updateContent', data: { options: options } }, '*');
              }
          }
          if (!initialContent /* || isEditingThisModel */) {
              if (!this.getContentQueue) {
                  this.getContentQueue = [];
              }
              this.getContentQueue.push(__assign(__assign({}, options), { model: modelName, key: key }));
              if (this.getContentQueue && this.getContentQueue.length >= this.contentPerRequest) {
                  var queue_1 = this.getContentQueue.slice();
                  this.getContentQueue = [];
                  nextTick(function () {
                      _this.flushGetContentQueue(false, queue_1);
                  });
              }
              else {
                  nextTick(function () {
                      _this.flushGetContentQueue();
                  });
              }
          }
          var observable = new BehaviorSubject(null);
          this.observersByKey[key] = observable;
          if (options.noEditorUpdates) {
              this.noEditorUpdates[key] = true;
          }
          if (initialContent) {
              nextTick(function () {
                  // TODO: need to testModify this I think...?
                  observable.next(initialContent);
              });
          }
          return observable;
      };
      Builder.prototype.requestUrl = function (url, options) {
          if (Builder.isBrowser) {
              return fetch$1(url, options).then(function (res) { return res.json(); });
          }
          return new Promise(function (resolve, reject) {
              var parsedUrl = parse(url);
              var module = parsedUrl.protocol === 'http:' ? serverOnlyRequire$1('http') : serverOnlyRequire$1('https');
              var requestOptions = {
                  host: parsedUrl.hostname,
                  port: parsedUrl.port,
                  path: parsedUrl.pathname + parsedUrl.search,
                  headers: __assign({}, options === null || options === void 0 ? void 0 : options.headers),
              };
              module
                  .get(requestOptions, function (resp) {
                  var data = '';
                  // A chunk of data has been recieved.
                  resp.on('data', function (chunk) {
                      data += chunk;
                  });
                  // The whole response has been received. Print out the result.
                  resp.on('end', function () {
                      try {
                          resolve(JSON.parse(data));
                      }
                      catch (err) {
                          reject(err);
                      }
                  });
              })
                  .on('error', function (error) {
                  reject(error);
              });
          });
      };
      Object.defineProperty(Builder.prototype, "host", {
          get: function () {
              switch (this.env) {
                  case 'qa':
                      return 'https://qa.builder.io';
                  case 'test':
                      return 'https://builder-io-test.web.app';
                  case 'fast':
                      return 'https://fast.builder.io';
                  case 'cloud':
                      return 'https://cloud.builder.io';
                  case 'cdn2':
                      return 'https://cdn2.builder.io';
                  case 'cdn-qa':
                      return 'https://cdn-qa.builder.io';
                  case 'development':
                  case 'dev':
                      return 'http://localhost:5000';
                  case 'cdn-prod':
                      return 'https://cdn.builder.io';
                  default:
                      return Builder.overrideHost || 'https://cdn.builder.io';
              }
          },
          enumerable: true,
          configurable: true
      });
      Builder.prototype.flushGetContentQueue = function (usePastQueue, useQueue) {
          var _this = this;
          if (usePastQueue === void 0) { usePastQueue = false; }
          if (!this.apiKey) {
              throw new Error("Fetching content failed, expected apiKey to be defined instead got: " + this.apiKey);
          }
          if (!usePastQueue && !this.getContentQueue) {
              return;
          }
          var queue = useQueue || (usePastQueue ? this.priorContentQueue : this.getContentQueue) || [];
          // TODO: do this on every request send?
          this.getOverridesFromQueryString();
          var queryParams = __assign({ 
              // TODO: way to force a request to be in a separate queue. or just lower queue limit to be 1 by default
              omit: queue[0].omit || 'meta.componentsUsed', apiKey: this.apiKey }, queue[0].options);
          if (queue[0].fields) {
              queryParams.fields = queue[0].fields;
          }
          if (queue[0].format) {
              queryParams.format = queue[0].format;
          }
          var pageQueryParams = typeof location !== 'undefined'
              ? QueryString.parseDeep(location.search.substr(1))
              :  {};
          var userAttributes = 
          // FIXME: HACK: only checks first in queue for user attributes overrides, should check all
          // TODO: merge user attributes provided here with defaults and current user attiributes (?)
          queue && queue[0].userAttributes
              ? queue[0].userAttributes
              : this.targetContent
                  ? this.getUserAttributes()
                  : {
                      urlPath: this.getLocation().pathname,
                  };
          var fullUrlQueueItem = queue.find(function (item) { return !!item.includeUrl; });
          if (fullUrlQueueItem) {
              var location_1 = this.getLocation();
              if (location_1.origin) {
                  queryParams.url = "" + location_1.origin + location_1.pathname + location_1.search;
              }
          }
          var urlQueueItem = useQueue === null || useQueue === void 0 ? void 0 : useQueue.find(function (item) { return item.url; });
          if (urlQueueItem === null || urlQueueItem === void 0 ? void 0 : urlQueueItem.url) {
              userAttributes.urlPath = urlQueueItem.url.split('?')[0];
          }
          // TODO: merge in the attribute from query string ones
          // TODO: make this an option per component/request
          queryParams.userAttributes = userAttributes;
          if (!usePastQueue && !useQueue) {
              this.priorContentQueue = queue;
              this.getContentQueue = null;
          }
          var cachebust = this.cachebust ||
              isIframe ||
              pageQueryParams.cachebust ||
              pageQueryParams['builder.cachebust'];
          if (cachebust || this.env !== 'production') {
              queryParams.cachebust = true;
          }
          if (Builder.isEditing) {
              queryParams.isEditing = true;
          }
          if (this.noCache || this.env !== 'production') {
              queryParams.noCache = true;
          }
          if (size(this.overrides)) {
              for (var key in this.overrides) {
                  if (this.overrides.hasOwnProperty(key)) {
                      queryParams["overrides." + key] = this.overrides[key];
                  }
              }
          }
          if (!Builder.isReact) {
              // TODO: remove me once v1 page editors converted to v2
              // queryParams.extractCss = true;
              queryParams.prerender = true;
          }
          for (var _i = 0, queue_2 = queue; _i < queue_2.length; _i++) {
              var options = queue_2[_i];
              if (options.format) {
                  queryParams.format = options.format;
              }
              // TODO: remove me and make permodel
              if (options.static) {
                  queryParams.static = options.static;
              }
              if (options.cachebust) {
                  queryParams.cachebust = options.cachebust;
              }
              if (isPositiveNumber(options.cacheSeconds)) {
                  queryParams.cacheSeconds = options.cacheSeconds;
              }
              if (isPositiveNumber(options.staleCacheSeconds)) {
                  queryParams.staleCacheSeconds = options.staleCacheSeconds;
              }
              var properties = [
                  'prerender',
                  'extractCss',
                  'limit',
                  'offset',
                  'query',
                  'preview',
                  'model',
                  'entry',
                  'rev',
                  'static',
              ];
              for (var _a = 0, properties_1 = properties; _a < properties_1.length; _a++) {
                  var key = properties_1[_a];
                  var value = options[key];
                  if (value !== undefined) {
                      queryParams.options = queryParams.options || {};
                      queryParams.options[options.key] = queryParams.options[options.key] || {};
                      queryParams.options[options.key][key] = JSON.stringify(value);
                  }
              }
          }
          if (this.preview) {
              queryParams.preview = 'true';
          }
          var hasParams = Object.keys(queryParams).length > 0;
          // TODO: option to force dev or qa api here
          var host = this.host;
          var keyNames = queue.map(function (item) { return encodeURIComponent(item.key); }).join(',');
          if (this.overrideParams) {
              var params = omit(QueryString.parse(this.overrideParams), 'apiKey');
              assign(queryParams, params);
          }
          var queryStr = QueryString.stringifyDeep(queryParams);
          var format = queryParams.format;
          var requestOptions = { headers: {} };
          if (this.authToken) {
              requestOptions.headers = __assign(__assign({}, requestOptions.headers), { Authorization: "Bearer " + this.authToken });
          }
          var promise = this.requestUrl(host + "/api/v1/" + (format === 'solid' || format === 'react' ? 'codegen' : 'query') + "/" + this.apiKey + "/" + keyNames + (queryParams && hasParams ? "?" + queryStr : ''), requestOptions).then(function (result) {
              for (var _i = 0, queue_3 = queue; _i < queue_3.length; _i++) {
                  var options = queue_3[_i];
                  var keyName = options.key;
                  if (options.model === _this.blockContentLoading && !options.noEditorUpdates) {
                      continue;
                  }
                  var isEditingThisModel = _this.editingModel === options.model;
                  if (isEditingThisModel && Builder.isEditing) {
                      parent.postMessage({ type: 'builder.updateContent', data: { options: options } }, '*');
                      // return;
                  }
                  var observer = _this.observersByKey[keyName];
                  if (!observer) {
                      return;
                  }
                  var data = result[keyName];
                  var sorted = data; // sortBy(data, item => item.priority);
                  if (data) {
                      var testModifiedResults = Builder.isServer
                          ? sorted
                          : _this.processResultsForTests(sorted);
                      observer.next(testModifiedResults);
                  }
                  else {
                      var search = _this.getLocation().search;
                      if ((search || '').includes('builder.preview=' + options.model)) {
                          var previewData = {
                              id: 'preview',
                              name: 'Preview',
                              data: {},
                          };
                          observer.next([previewData]);
                      }
                      observer.next([]);
                  }
              }
          }, function (err) {
              for (var _i = 0, queue_4 = queue; _i < queue_4.length; _i++) {
                  var options = queue_4[_i];
                  var observer = _this.observersByKey[options.key];
                  if (!observer) {
                      return;
                  }
                  observer.error(err);
              }
          });
          return promise;
      };
      Builder.prototype.processResultsForTests = function (results) {
          var _this = this;
          var _a;
          var mappedResults = results.map(function (item) {
              if (!item.variations) {
                  return item;
              }
              var cookieValue = _this.getTestCookie(item.id);
              var cookieVariation = cookieValue === item.id ? item : item.variations[cookieValue];
              if (cookieVariation) {
                  return __assign(__assign({}, item), { data: cookieVariation.data, variationId: cookieValue, testVariationId: cookieValue, testVariationName: cookieVariation.name });
              }
              if (_this.canTrack && item.variations && size(item.variations)) {
                  var n = 0;
                  var random = Math.random();
                  for (var id in item.variations) {
                      var variation = item.variations[id];
                      var testRatio = variation.testRatio;
                      n += testRatio;
                      if (random < n) {
                          _this.setTestCookie(item.id, variation.id);
                          var variationName = variation.name || (variation.id === item.id ? 'Default variation' : '');
                          return __assign(__assign({}, item), { data: variation.data, variationId: variation.id, testVariationId: variation.id, variationName: variationName, testVariationName: variationName });
                      }
                  }
                  _this.setTestCookie(item.id, item.id);
              }
              return __assign(__assign(__assign({}, item), { variationId: item.id }), (item.variations &&
                  size(item.variations) && {
                  testVariationId: item.id,
                  testVariationName: 'Default variation',
              }));
          });
          if (isIframe) {
              (_a = window.parent) === null || _a === void 0 ? void 0 : _a.postMessage({ type: 'builder.contentResults', data: { results: mappedResults } }, '*');
          }
          return mappedResults;
      };
      Builder.prototype.getTestCookie = function (contentId) {
          return this.getCookie(this.testCookiePrefix + "." + contentId);
      };
      Builder.prototype.setTestCookie = function (contentId, variationId) {
          if (!this.canTrack) {
              this.cookieQueue.push([contentId, variationId]);
              return;
          }
          // 30 days from now
          var future = new Date();
          future.setDate(future.getDate() + 30);
          return this.setCookie(this.testCookiePrefix + "." + contentId, variationId, future);
      };
      Builder.prototype.getCookie = function (name$$1) {
          if (this.cookies) {
              return this.cookies.get(name$$1);
          }
          return Builder.isBrowser && getCookie(name$$1);
      };
      Builder.prototype.setCookie = function (name$$1, value, expires) {
          if (this.cookies && !(Builder.isServer && Builder.isStatic)) {
              return this.cookies.set(name$$1, value, {
                  expires: expires,
                  secure: this.getLocation().protocol === 'https:',
              });
          }
          return Builder.isBrowser && setCookie(name$$1, value, expires);
      };
      Builder.prototype.getContent = function (modelName, options) {
          if (options === void 0) { options = {}; }
          if (!this.apiKey) {
              throw new Error("Fetching content from model " + modelName + " failed, expected apiKey to be defined instead got: " + this.apiKey);
          }
          return this.queueGetContent(modelName, options);
      };
      Builder.prototype.getAll = function (modelName, options) {
          if (options === void 0) { options = {}; }
          var instance = this;
          if (!Builder.isBrowser) {
              instance = new Builder(options.apiKey || this.apiKey, options.req, options.res);
              instance.setUserAttributes(this.getUserAttributes());
          }
          else {
              if (options.apiKey && !this.apiKey) {
                  this.apiKey = options.apiKey;
              }
          }
          return instance
              .getContent(modelName, __assign(__assign({ limit: 30 }, options), { key: options.key ||
                  // Make the key include all options so we don't reuse cache for the same conent fetched
                  // with different options
                  Builder.isBrowser
                  ? modelName + ":" + hashSum(omit(options, 'initialContent', 'req', 'res'))
                  : undefined }))
              .promise();
      };
      Builder.VERSION = version$1;
      Builder.components = [];
      /**
       * Makes it so that a/b tests generate code like {@link
       * https://www.builder.io/blog/high-performance-no-code#__next:~:text=Static%20generated%20A%2FB%20testing}
       * instead of the old way where we render only one test group at a time on the
       * server. This is the preferred/better way not and we should ultimately make it
       * the default
       */
      Builder.isStatic = true;
      Builder.animator = new Animator();
      Builder.nextTick = nextTick;
      Builder.throttle = throttle;
      Builder.editors = [];
      Builder.trustedHosts = ['builder.io', 'localhost'];
      Builder.plugins = [];
      Builder.actions = [];
      Builder.registry = {};
      Builder.registryChange = new BehaviorSubject({});
      Builder._editingPage = false;
      Builder.isIframe = isIframe;
      Builder.isBrowser = isBrowser;
      Builder.isReactNative = isReactNative;
      Builder.isServer = !isBrowser && !isReactNative;
      Builder.previewingModel = Builder.isBrowser && getQueryParam(location.href, 'builder.preview');
      Builder.settings = {};
      Builder.settingsChange = new BehaviorSubject({});
      // TODO: this is quick and dirty, do better implementation later. Also can be unreliable
      // if page 301s etc. Use a query param instead? also could have issues with redirects. Injecting var could
      // work but is async...
      Builder.isEditing = Boolean(isIframe &&
          ((document.referrer && document.referrer.match(/builder\.io|localhost:1234/)) ||
              location.search.indexOf('builder.frameEditing=') !== -1));
      Builder.isPreviewing = Boolean(isBrowser &&
          (location.search.indexOf('builder.preview=') !== -1 ||
              location.search.indexOf('builder.frameEditing=') !== -1));
      Builder.isReact = false;
      Builder.overrideUserAttributes = {};
      return Builder;
  }());

  var builder = new Builder(null, undefined, undefined, true);
  Builder.singletonInstance = builder;

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function unwrapExports (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var require_1 = createCommonjsModule(function (module, exports) {
  /** vim: et:ts=4:sw=4:sts=4
   * @license RequireJS 2.3.6 Copyright jQuery Foundation and other contributors.
   * Released under MIT license, https://github.com/requirejs/requirejs/blob/master/LICENSE
   */
  //Not using strict: uneven strict support in browsers, #392, and causes
  //problems with requirejs.exec()/transpiler plugins that may not be strict.
  /*jslint regexp: true, nomen: true, sloppy: true */
  /*global window, navigator, document, importScripts, setTimeout, opera */
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.define = exports.requirejs = void 0;
  // eslint-disable-next-line eslint-comments/disable-enable-pair
  // eslint-disable
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-nocheck
  var requirejs, require, define;
  exports.requirejs = requirejs;
  exports.define = define;
  (function (global, setTimeout) {
      var req, s, head, baseElement, dataMain, src, interactiveScript, currentlyAddingScript, mainScript, subPath, version = '2.3.6', commentRegExp = /\/\*[\s\S]*?\*\/|([^:"'=]|^)\/\/.*$/mg, cjsRequireRegExp = /[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g, jsSuffixRegExp = /\.js$/, currDirRegExp = /^\.\//, op = Object.prototype, ostring = op.toString, hasOwn = op.hasOwnProperty, isBrowser = !!(typeof window !== 'undefined' && typeof navigator !== 'undefined' && window.document), isWebWorker = !isBrowser && typeof importScripts !== 'undefined', 
      //PS3 indicates loaded and complete, but need to wait for complete
      //specifically. Sequence is 'loading', 'loaded', execution,
      // then 'complete'. The UA check is unfortunate, but not sure how
      //to feature test w/o causing perf issues.
      readyRegExp = isBrowser && navigator.platform === 'PLAYSTATION 3' ?
          /^complete$/ : /^(complete|loaded)$/, defContextName = '_', 
      //Oh the tragedy, detecting opera. See the usage of isOpera for reason.
      isOpera = typeof opera !== 'undefined' && opera.toString() === '[object Opera]', contexts = {}, cfg = {}, globalDefQueue = [], useInteractive = false;
      //Could match something like ')//comment', do not lose the prefix to comment.
      function commentReplace(match, singlePrefix) {
          return singlePrefix || '';
      }
      function isFunction(it) {
          return ostring.call(it) === '[object Function]';
      }
      function isArray(it) {
          return ostring.call(it) === '[object Array]';
      }
      /**
       * Helper function for iterating over an array. If the func returns
       * a true value, it will break out of the loop.
       */
      function each(ary, func) {
          if (ary) {
              var i;
              for (i = 0; i < ary.length; i += 1) {
                  if (ary[i] && func(ary[i], i, ary)) {
                      break;
                  }
              }
          }
      }
      /**
       * Helper function for iterating over an array backwards. If the func
       * returns a true value, it will break out of the loop.
       */
      function eachReverse(ary, func) {
          if (ary) {
              var i;
              for (i = ary.length - 1; i > -1; i -= 1) {
                  if (ary[i] && func(ary[i], i, ary)) {
                      break;
                  }
              }
          }
      }
      function hasProp(obj, prop) {
          return hasOwn.call(obj, prop);
      }
      function getOwn(obj, prop) {
          return hasProp(obj, prop) && obj[prop];
      }
      /**
       * Cycles over properties in an object and calls a function for each
       * property value. If the function returns a truthy value, then the
       * iteration is stopped.
       */
      function eachProp(obj, func) {
          var prop;
          for (prop in obj) {
              if (hasProp(obj, prop)) {
                  if (func(obj[prop], prop)) {
                      break;
                  }
              }
          }
      }
      /**
       * Simple function to mix in properties from source into target,
       * but only if target does not already have a property of the same name.
       */
      function mixin(target, source, force, deepStringMixin) {
          if (source) {
              eachProp(source, function (value, prop) {
                  if (force || !hasProp(target, prop)) {
                      if (deepStringMixin && typeof value === 'object' && value &&
                          !isArray(value) && !isFunction(value) &&
                          !(value instanceof RegExp)) {
                          if (!target[prop]) {
                              target[prop] = {};
                          }
                          mixin(target[prop], value, force, deepStringMixin);
                      }
                      else {
                          target[prop] = value;
                      }
                  }
              });
          }
          return target;
      }
      //Similar to Function.prototype.bind, but the 'this' object is specified
      //first, since it is easier to read/figure out what 'this' will be.
      function bind(obj, fn) {
          return function () {
              return fn.apply(obj, arguments);
          };
      }
      function scripts() {
          return document.getElementsByTagName('script');
      }
      function defaultOnError(err) {
          throw err;
      }
      //Allow getting a global that is expressed in
      //dot notation, like 'a.b.c'.
      function getGlobal(value) {
          if (!value) {
              return value;
          }
          var g = global;
          each(value.split('.'), function (part) {
              g = g[part];
          });
          return g;
      }
      /**
       * Constructs an error with a pointer to an URL with more information.
       * @param {String} id the error ID that maps to an ID on a web page.
       * @param {String} message human readable error.
       * @param {Error} [err] the original error, if there is one.
       *
       * @returns {Error}
       */
      function makeError(id, msg, err, requireModules) {
          var e = new Error(msg + '\nhttps://requirejs.org/docs/errors.html#' + id);
          e.requireType = id;
          e.requireModules = requireModules;
          if (err) {
              e.originalError = err;
          }
          return e;
      }
      if (typeof define !== 'undefined') {
          //If a define is already in play via another AMD loader,
          //do not overwrite.
          return;
      }
      if (typeof requirejs !== 'undefined') {
          if (isFunction(requirejs)) {
              //Do not overwrite an existing requirejs instance.
              return;
          }
          cfg = requirejs;
          exports.requirejs = requirejs = undefined;
      }
      //Allow for a require config object
      if (typeof require !== 'undefined' && !isFunction(require)) {
          //assume it is a config object.
          cfg = require;
          require = undefined;
      }
      function newContext(contextName) {
          var inCheckLoaded, Module, context, handlers, checkLoadedTimeoutId, config = {
              //Defaults. Do not set a default for map
              //config to speed up normalize(), which
              //will run faster if there is no default.
              waitSeconds: 7,
              baseUrl: './',
              paths: {},
              bundles: {},
              pkgs: {},
              shim: {},
              config: {}
          }, registry = {}, 
          //registry of just enabled modules, to speed
          //cycle breaking code when lots of modules
          //are registered, but not activated.
          enabledRegistry = {}, undefEvents = {}, defQueue = [], defined = {}, urlFetched = {}, bundlesMap = {}, requireCounter = 1, unnormalizedCounter = 1;
          /**
           * Trims the . and .. from an array of path segments.
           * It will keep a leading path segment if a .. will become
           * the first path segment, to help with module name lookups,
           * which act like paths, but can be remapped. But the end result,
           * all paths that use this function should look normalized.
           * NOTE: this method MODIFIES the input array.
           * @param {Array} ary the array of path segments.
           */
          function trimDots(ary) {
              var i, part;
              for (i = 0; i < ary.length; i++) {
                  part = ary[i];
                  if (part === '.') {
                      ary.splice(i, 1);
                      i -= 1;
                  }
                  else if (part === '..') {
                      // If at the start, or previous value is still ..,
                      // keep them so that when converted to a path it may
                      // still work when converted to a path, even though
                      // as an ID it is less than ideal. In larger point
                      // releases, may be better to just kick out an error.
                      if (i === 0 || (i === 1 && ary[2] === '..') || ary[i - 1] === '..') {
                          continue;
                      }
                      else if (i > 0) {
                          ary.splice(i - 1, 2);
                          i -= 2;
                      }
                  }
              }
          }
          /**
           * Given a relative module name, like ./something, normalize it to
           * a real name that can be mapped to a path.
           * @param {String} name the relative name
           * @param {String} baseName a real name that the name arg is relative
           * to.
           * @param {Boolean} applyMap apply the map config to the value. Should
           * only be done if this normalization is for a dependency ID.
           * @returns {String} normalized name
           */
          function normalize(name, baseName, applyMap) {
              var pkgMain, mapValue, nameParts, i, j, nameSegment, lastIndex, foundMap, foundI, foundStarMap, starI, normalizedBaseParts, baseParts = (baseName && baseName.split('/')), map = config.map, starMap = map && map['*'];
              //Adjust any relative paths.
              if (name) {
                  name = name.split('/');
                  lastIndex = name.length - 1;
                  // If wanting node ID compatibility, strip .js from end
                  // of IDs. Have to do this here, and not in nameToUrl
                  // because node allows either .js or non .js to map
                  // to same file.
                  if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
                      name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
                  }
                  // Starts with a '.' so need the baseName
                  if (name[0].charAt(0) === '.' && baseParts) {
                      //Convert baseName to array, and lop off the last part,
                      //so that . matches that 'directory' and not name of the baseName's
                      //module. For instance, baseName of 'one/two/three', maps to
                      //'one/two/three.js', but we want the directory, 'one/two' for
                      //this normalization.
                      normalizedBaseParts = baseParts.slice(0, baseParts.length - 1);
                      name = normalizedBaseParts.concat(name);
                  }
                  trimDots(name);
                  name = name.join('/');
              }
              //Apply map config if available.
              if (applyMap && map && (baseParts || starMap)) {
                  nameParts = name.split('/');
                  outerLoop: for (i = nameParts.length; i > 0; i -= 1) {
                      nameSegment = nameParts.slice(0, i).join('/');
                      if (baseParts) {
                          //Find the longest baseName segment match in the config.
                          //So, do joins on the biggest to smallest lengths of baseParts.
                          for (j = baseParts.length; j > 0; j -= 1) {
                              mapValue = getOwn(map, baseParts.slice(0, j).join('/'));
                              //baseName segment has config, find if it has one for
                              //this name.
                              if (mapValue) {
                                  mapValue = getOwn(mapValue, nameSegment);
                                  if (mapValue) {
                                      //Match, update name to the new value.
                                      foundMap = mapValue;
                                      foundI = i;
                                      break outerLoop;
                                  }
                              }
                          }
                      }
                      //Check for a star map match, but just hold on to it,
                      //if there is a shorter segment match later in a matching
                      //config, then favor over this star map.
                      if (!foundStarMap && starMap && getOwn(starMap, nameSegment)) {
                          foundStarMap = getOwn(starMap, nameSegment);
                          starI = i;
                      }
                  }
                  if (!foundMap && foundStarMap) {
                      foundMap = foundStarMap;
                      foundI = starI;
                  }
                  if (foundMap) {
                      nameParts.splice(0, foundI, foundMap);
                      name = nameParts.join('/');
                  }
              }
              // If the name points to a package's name, use
              // the package main instead.
              pkgMain = getOwn(config.pkgs, name);
              return pkgMain ? pkgMain : name;
          }
          function removeScript(name) {
              if (isBrowser) {
                  each(scripts(), function (scriptNode) {
                      if (scriptNode.getAttribute('data-requiremodule') === name &&
                          scriptNode.getAttribute('data-requirecontext') === context.contextName) {
                          scriptNode.parentNode.removeChild(scriptNode);
                          return true;
                      }
                  });
              }
          }
          function hasPathFallback(id) {
              var pathConfig = getOwn(config.paths, id);
              if (pathConfig && isArray(pathConfig) && pathConfig.length > 1) {
                  //Pop off the first array value, since it failed, and
                  //retry
                  pathConfig.shift();
                  context.require.undef(id);
                  //Custom require that does not do map translation, since
                  //ID is "absolute", already mapped/resolved.
                  context.makeRequire(null, {
                      skipMap: true
                  })([id]);
                  return true;
              }
          }
          //Turns a plugin!resource to [plugin, resource]
          //with the plugin being undefined if the name
          //did not have a plugin prefix.
          function splitPrefix(name) {
              var prefix, index = name ? name.indexOf('!') : -1;
              if (index > -1) {
                  prefix = name.substring(0, index);
                  name = name.substring(index + 1, name.length);
              }
              return [prefix, name];
          }
          /**
           * Creates a module mapping that includes plugin prefix, module
           * name, and path. If parentModuleMap is provided it will
           * also normalize the name via require.normalize()
           *
           * @param {String} name the module name
           * @param {String} [parentModuleMap] parent module map
           * for the module name, used to resolve relative names.
           * @param {Boolean} isNormalized: is the ID already normalized.
           * This is true if this call is done for a define() module ID.
           * @param {Boolean} applyMap: apply the map config to the ID.
           * Should only be true if this map is for a dependency.
           *
           * @returns {Object}
           */
          function makeModuleMap(name, parentModuleMap, isNormalized, applyMap) {
              var url, pluginModule, suffix, nameParts, prefix = null, parentName = parentModuleMap ? parentModuleMap.name : null, originalName = name, isDefine = true, normalizedName = '';
              //If no name, then it means it is a require call, generate an
              //internal name.
              if (!name) {
                  isDefine = false;
                  name = '_@r' + (requireCounter += 1);
              }
              nameParts = splitPrefix(name);
              prefix = nameParts[0];
              name = nameParts[1];
              if (prefix) {
                  prefix = normalize(prefix, parentName, applyMap);
                  pluginModule = getOwn(defined, prefix);
              }
              //Account for relative paths if there is a base name.
              if (name) {
                  if (prefix) {
                      if (isNormalized) {
                          normalizedName = name;
                      }
                      else if (pluginModule && pluginModule.normalize) {
                          //Plugin is loaded, use its normalize method.
                          normalizedName = pluginModule.normalize(name, function (name) {
                              return normalize(name, parentName, applyMap);
                          });
                      }
                      else {
                          // If nested plugin references, then do not try to
                          // normalize, as it will not normalize correctly. This
                          // places a restriction on resourceIds, and the longer
                          // term solution is not to normalize until plugins are
                          // loaded and all normalizations to allow for async
                          // loading of a loader plugin. But for now, fixes the
                          // common uses. Details in #1131
                          normalizedName = name.indexOf('!') === -1 ?
                              normalize(name, parentName, applyMap) :
                              name;
                      }
                  }
                  else {
                      //A regular module.
                      normalizedName = normalize(name, parentName, applyMap);
                      //Normalized name may be a plugin ID due to map config
                      //application in normalize. The map config values must
                      //already be normalized, so do not need to redo that part.
                      nameParts = splitPrefix(normalizedName);
                      prefix = nameParts[0];
                      normalizedName = nameParts[1];
                      isNormalized = true;
                      url = context.nameToUrl(normalizedName);
                  }
              }
              //If the id is a plugin id that cannot be determined if it needs
              //normalization, stamp it with a unique ID so two matching relative
              //ids that may conflict can be separate.
              suffix = prefix && !pluginModule && !isNormalized ?
                  '_unnormalized' + (unnormalizedCounter += 1) :
                  '';
              return {
                  prefix: prefix,
                  name: normalizedName,
                  parentMap: parentModuleMap,
                  unnormalized: !!suffix,
                  url: url,
                  originalName: originalName,
                  isDefine: isDefine,
                  id: (prefix ?
                      prefix + '!' + normalizedName :
                      normalizedName) + suffix
              };
          }
          function getModule(depMap) {
              var id = depMap.id, mod = getOwn(registry, id);
              if (!mod) {
                  mod = registry[id] = new context.Module(depMap);
              }
              return mod;
          }
          function on(depMap, name, fn) {
              var id = depMap.id, mod = getOwn(registry, id);
              if (hasProp(defined, id) &&
                  (!mod || mod.defineEmitComplete)) {
                  if (name === 'defined') {
                      fn(defined[id]);
                  }
              }
              else {
                  mod = getModule(depMap);
                  if (mod.error && name === 'error') {
                      fn(mod.error);
                  }
                  else {
                      mod.on(name, fn);
                  }
              }
          }
          function onError(err, errback) {
              var ids = err.requireModules, notified = false;
              if (errback) {
                  errback(err);
              }
              else {
                  each(ids, function (id) {
                      var mod = getOwn(registry, id);
                      if (mod) {
                          //Set error on module, so it skips timeout checks.
                          mod.error = err;
                          if (mod.events.error) {
                              notified = true;
                              mod.emit('error', err);
                          }
                      }
                  });
                  if (!notified) {
                      req.onError(err);
                  }
              }
          }
          /**
           * Internal method to transfer globalQueue items to this context's
           * defQueue.
           */
          function takeGlobalQueue() {
              //Push all the globalDefQueue items into the context's defQueue
              if (globalDefQueue.length) {
                  each(globalDefQueue, function (queueItem) {
                      var id = queueItem[0];
                      if (typeof id === 'string') {
                          context.defQueueMap[id] = true;
                      }
                      defQueue.push(queueItem);
                  });
                  globalDefQueue = [];
              }
          }
          handlers = {
              'require': function (mod) {
                  if (mod.require) {
                      return mod.require;
                  }
                  else {
                      return (mod.require = context.makeRequire(mod.map));
                  }
              },
              'exports': function (mod) {
                  mod.usingExports = true;
                  if (mod.map.isDefine) {
                      if (mod.exports) {
                          return (defined[mod.map.id] = mod.exports);
                      }
                      else {
                          return (mod.exports = defined[mod.map.id] = {});
                      }
                  }
              },
              'module': function (mod) {
                  if (mod.module) {
                      return mod.module;
                  }
                  else {
                      return (mod.module = {
                          id: mod.map.id,
                          uri: mod.map.url,
                          config: function () {
                              return getOwn(config.config, mod.map.id) || {};
                          },
                          exports: mod.exports || (mod.exports = {})
                      });
                  }
              }
          };
          function cleanRegistry(id) {
              //Clean up machinery used for waiting modules.
              delete registry[id];
              delete enabledRegistry[id];
          }
          function breakCycle(mod, traced, processed) {
              var id = mod.map.id;
              if (mod.error) {
                  mod.emit('error', mod.error);
              }
              else {
                  traced[id] = true;
                  each(mod.depMaps, function (depMap, i) {
                      var depId = depMap.id, dep = getOwn(registry, depId);
                      //Only force things that have not completed
                      //being defined, so still in the registry,
                      //and only if it has not been matched up
                      //in the module already.
                      if (dep && !mod.depMatched[i] && !processed[depId]) {
                          if (getOwn(traced, depId)) {
                              mod.defineDep(i, defined[depId]);
                              mod.check(); //pass false?
                          }
                          else {
                              breakCycle(dep, traced, processed);
                          }
                      }
                  });
                  processed[id] = true;
              }
          }
          function checkLoaded() {
              var err, usingPathFallback, waitInterval = config.waitSeconds * 1000, 
              //It is possible to disable the wait interval by using waitSeconds of 0.
              expired = waitInterval && (context.startTime + waitInterval) < new Date().getTime(), noLoads = [], reqCalls = [], stillLoading = false, needCycleCheck = true;
              //Do not bother if this call was a result of a cycle break.
              if (inCheckLoaded) {
                  return;
              }
              inCheckLoaded = true;
              //Figure out the state of all the modules.
              eachProp(enabledRegistry, function (mod) {
                  var map = mod.map, modId = map.id;
                  //Skip things that are not enabled or in error state.
                  if (!mod.enabled) {
                      return;
                  }
                  if (!map.isDefine) {
                      reqCalls.push(mod);
                  }
                  if (!mod.error) {
                      //If the module should be executed, and it has not
                      //been inited and time is up, remember it.
                      if (!mod.inited && expired) {
                          if (hasPathFallback(modId)) {
                              usingPathFallback = true;
                              stillLoading = true;
                          }
                          else {
                              noLoads.push(modId);
                              removeScript(modId);
                          }
                      }
                      else if (!mod.inited && mod.fetched && map.isDefine) {
                          stillLoading = true;
                          if (!map.prefix) {
                              //No reason to keep looking for unfinished
                              //loading. If the only stillLoading is a
                              //plugin resource though, keep going,
                              //because it may be that a plugin resource
                              //is waiting on a non-plugin cycle.
                              return (needCycleCheck = false);
                          }
                      }
                  }
              });
              if (expired && noLoads.length) {
                  //If wait time expired, throw error of unloaded modules.
                  err = makeError('timeout', 'Load timeout for modules: ' + noLoads, null, noLoads);
                  err.contextName = context.contextName;
                  return onError(err);
              }
              //Not expired, check for a cycle.
              if (needCycleCheck) {
                  each(reqCalls, function (mod) {
                      breakCycle(mod, {}, {});
                  });
              }
              //If still waiting on loads, and the waiting load is something
              //other than a plugin resource, or there are still outstanding
              //scripts, then just try back later.
              if ((!expired || usingPathFallback) && stillLoading) {
                  //Something is still waiting to load. Wait for it, but only
                  //if a timeout is not already in effect.
                  if ((isBrowser || isWebWorker) && !checkLoadedTimeoutId) {
                      checkLoadedTimeoutId = setTimeout(function () {
                          checkLoadedTimeoutId = 0;
                          checkLoaded();
                      }, 50);
                  }
              }
              inCheckLoaded = false;
          }
          Module = function (map) {
              this.events = getOwn(undefEvents, map.id) || {};
              this.map = map;
              this.shim = getOwn(config.shim, map.id);
              this.depExports = [];
              this.depMaps = [];
              this.depMatched = [];
              this.pluginMaps = {};
              this.depCount = 0;
              /* this.exports this.factory
                 this.depMaps = [],
                 this.enabled, this.fetched
              */
          };
          Module.prototype = {
              init: function (depMaps, factory, errback, options) {
                  options = options || {};
                  //Do not do more inits if already done. Can happen if there
                  //are multiple define calls for the same module. That is not
                  //a normal, common case, but it is also not unexpected.
                  if (this.inited) {
                      return;
                  }
                  this.factory = factory;
                  if (errback) {
                      //Register for errors on this module.
                      this.on('error', errback);
                  }
                  else if (this.events.error) {
                      //If no errback already, but there are error listeners
                      //on this module, set up an errback to pass to the deps.
                      errback = bind(this, function (err) {
                          this.emit('error', err);
                      });
                  }
                  //Do a copy of the dependency array, so that
                  //source inputs are not modified. For example
                  //"shim" deps are passed in here directly, and
                  //doing a direct modification of the depMaps array
                  //would affect that config.
                  this.depMaps = depMaps && depMaps.slice(0);
                  this.errback = errback;
                  //Indicate this module has be initialized
                  this.inited = true;
                  this.ignore = options.ignore;
                  //Could have option to init this module in enabled mode,
                  //or could have been previously marked as enabled. However,
                  //the dependencies are not known until init is called. So
                  //if enabled previously, now trigger dependencies as enabled.
                  if (options.enabled || this.enabled) {
                      //Enable this module and dependencies.
                      //Will call this.check()
                      this.enable();
                  }
                  else {
                      this.check();
                  }
              },
              defineDep: function (i, depExports) {
                  //Because of cycles, defined callback for a given
                  //export can be called more than once.
                  if (!this.depMatched[i]) {
                      this.depMatched[i] = true;
                      this.depCount -= 1;
                      this.depExports[i] = depExports;
                  }
              },
              fetch: function () {
                  if (this.fetched) {
                      return;
                  }
                  this.fetched = true;
                  context.startTime = (new Date()).getTime();
                  var map = this.map;
                  //If the manager is for a plugin managed resource,
                  //ask the plugin to load it now.
                  if (this.shim) {
                      context.makeRequire(this.map, {
                          enableBuildCallback: true
                      })(this.shim.deps || [], bind(this, function () {
                          return map.prefix ? this.callPlugin() : this.load();
                      }));
                  }
                  else {
                      //Regular dependency.
                      return map.prefix ? this.callPlugin() : this.load();
                  }
              },
              load: function () {
                  var url = this.map.url;
                  //Regular dependency.
                  if (!urlFetched[url]) {
                      urlFetched[url] = true;
                      context.load(this.map.id, url);
                  }
              },
              /**
               * Checks if the module is ready to define itself, and if so,
               * define it.
               */
              check: function () {
                  if (!this.enabled || this.enabling) {
                      return;
                  }
                  var err, cjsModule, id = this.map.id, depExports = this.depExports, exports = this.exports, factory = this.factory;
                  if (!this.inited) {
                      // Only fetch if not already in the defQueue.
                      if (!hasProp(context.defQueueMap, id)) {
                          this.fetch();
                      }
                  }
                  else if (this.error) {
                      this.emit('error', this.error);
                  }
                  else if (!this.defining) {
                      //The factory could trigger another require call
                      //that would result in checking this module to
                      //define itself again. If already in the process
                      //of doing that, skip this work.
                      this.defining = true;
                      if (this.depCount < 1 && !this.defined) {
                          if (isFunction(factory)) {
                              //If there is an error listener, favor passing
                              //to that instead of throwing an error. However,
                              //only do it for define()'d  modules. require
                              //errbacks should not be called for failures in
                              //their callbacks (#699). However if a global
                              //onError is set, use that.
                              if ((this.events.error && this.map.isDefine) ||
                                  req.onError !== defaultOnError) {
                                  try {
                                      exports = context.execCb(id, factory, depExports, exports);
                                  }
                                  catch (e) {
                                      err = e;
                                  }
                              }
                              else {
                                  exports = context.execCb(id, factory, depExports, exports);
                              }
                              // Favor return value over exports. If node/cjs in play,
                              // then will not have a return value anyway. Favor
                              // module.exports assignment over exports object.
                              if (this.map.isDefine && exports === undefined) {
                                  cjsModule = this.module;
                                  if (cjsModule) {
                                      exports = cjsModule.exports;
                                  }
                                  else if (this.usingExports) {
                                      //exports already set the defined value.
                                      exports = this.exports;
                                  }
                              }
                              if (err) {
                                  err.requireMap = this.map;
                                  err.requireModules = this.map.isDefine ? [this.map.id] : null;
                                  err.requireType = this.map.isDefine ? 'define' : 'require';
                                  return onError((this.error = err));
                              }
                          }
                          else {
                              //Just a literal value
                              exports = factory;
                          }
                          this.exports = exports;
                          if (this.map.isDefine && !this.ignore) {
                              defined[id] = exports;
                              if (req.onResourceLoad) {
                                  var resLoadMaps = [];
                                  each(this.depMaps, function (depMap) {
                                      resLoadMaps.push(depMap.normalizedMap || depMap);
                                  });
                                  req.onResourceLoad(context, this.map, resLoadMaps);
                              }
                          }
                          //Clean up
                          cleanRegistry(id);
                          this.defined = true;
                      }
                      //Finished the define stage. Allow calling check again
                      //to allow define notifications below in the case of a
                      //cycle.
                      this.defining = false;
                      if (this.defined && !this.defineEmitted) {
                          this.defineEmitted = true;
                          this.emit('defined', this.exports);
                          this.defineEmitComplete = true;
                      }
                  }
              },
              callPlugin: function () {
                  var map = this.map, id = map.id, 
                  //Map already normalized the prefix.
                  pluginMap = makeModuleMap(map.prefix);
                  //Mark this as a dependency for this plugin, so it
                  //can be traced for cycles.
                  this.depMaps.push(pluginMap);
                  on(pluginMap, 'defined', bind(this, function (plugin) {
                      var load, normalizedMap, normalizedMod, bundleId = getOwn(bundlesMap, this.map.id), name = this.map.name, parentName = this.map.parentMap ? this.map.parentMap.name : null, localRequire = context.makeRequire(map.parentMap, {
                          enableBuildCallback: true
                      });
                      //If current map is not normalized, wait for that
                      //normalized name to load instead of continuing.
                      if (this.map.unnormalized) {
                          //Normalize the ID if the plugin allows it.
                          if (plugin.normalize) {
                              name = plugin.normalize(name, function (name) {
                                  return normalize(name, parentName, true);
                              }) || '';
                          }
                          //prefix and name should already be normalized, no need
                          //for applying map config again either.
                          normalizedMap = makeModuleMap(map.prefix + '!' + name, this.map.parentMap, true);
                          on(normalizedMap, 'defined', bind(this, function (value) {
                              this.map.normalizedMap = normalizedMap;
                              this.init([], function () { return value; }, null, {
                                  enabled: true,
                                  ignore: true
                              });
                          }));
                          normalizedMod = getOwn(registry, normalizedMap.id);
                          if (normalizedMod) {
                              //Mark this as a dependency for this plugin, so it
                              //can be traced for cycles.
                              this.depMaps.push(normalizedMap);
                              if (this.events.error) {
                                  normalizedMod.on('error', bind(this, function (err) {
                                      this.emit('error', err);
                                  }));
                              }
                              normalizedMod.enable();
                          }
                          return;
                      }
                      //If a paths config, then just load that file instead to
                      //resolve the plugin, as it is built into that paths layer.
                      if (bundleId) {
                          this.map.url = context.nameToUrl(bundleId);
                          this.load();
                          return;
                      }
                      load = bind(this, function (value) {
                          this.init([], function () { return value; }, null, {
                              enabled: true
                          });
                      });
                      load.error = bind(this, function (err) {
                          this.inited = true;
                          this.error = err;
                          err.requireModules = [id];
                          //Remove temp unnormalized modules for this module,
                          //since they will never be resolved otherwise now.
                          eachProp(registry, function (mod) {
                              if (mod.map.id.indexOf(id + '_unnormalized') === 0) {
                                  cleanRegistry(mod.map.id);
                              }
                          });
                          onError(err);
                      });
                      //Allow plugins to load other code without having to know the
                      //context or how to 'complete' the load.
                      load.fromText = bind(this, function (text, textAlt) {
                          /*jslint evil: true */
                          var moduleName = map.name, moduleMap = makeModuleMap(moduleName), hasInteractive = useInteractive;
                          //As of 2.1.0, support just passing the text, to reinforce
                          //fromText only being called once per resource. Still
                          //support old style of passing moduleName but discard
                          //that moduleName in favor of the internal ref.
                          if (textAlt) {
                              text = textAlt;
                          }
                          //Turn off interactive script matching for IE for any define
                          //calls in the text, then turn it back on at the end.
                          if (hasInteractive) {
                              useInteractive = false;
                          }
                          //Prime the system by creating a module instance for
                          //it.
                          getModule(moduleMap);
                          //Transfer any config to this other module.
                          if (hasProp(config.config, id)) {
                              config.config[moduleName] = config.config[id];
                          }
                          try {
                              req.exec(text);
                          }
                          catch (e) {
                              return onError(makeError('fromtexteval', 'fromText eval for ' + id +
                                  ' failed: ' + e, e, [id]));
                          }
                          if (hasInteractive) {
                              useInteractive = true;
                          }
                          //Mark this as a dependency for the plugin
                          //resource
                          this.depMaps.push(moduleMap);
                          //Support anonymous modules.
                          context.completeLoad(moduleName);
                          //Bind the value of that module to the value for this
                          //resource ID.
                          localRequire([moduleName], load);
                      });
                      //Use parentName here since the plugin's name is not reliable,
                      //could be some weird string with no path that actually wants to
                      //reference the parentName's path.
                      plugin.load(map.name, localRequire, load, config);
                  }));
                  context.enable(pluginMap, this);
                  this.pluginMaps[pluginMap.id] = pluginMap;
              },
              enable: function () {
                  enabledRegistry[this.map.id] = this;
                  this.enabled = true;
                  //Set flag mentioning that the module is enabling,
                  //so that immediate calls to the defined callbacks
                  //for dependencies do not trigger inadvertent load
                  //with the depCount still being zero.
                  this.enabling = true;
                  //Enable each dependency
                  each(this.depMaps, bind(this, function (depMap, i) {
                      var id, mod, handler;
                      if (typeof depMap === 'string') {
                          //Dependency needs to be converted to a depMap
                          //and wired up to this module.
                          depMap = makeModuleMap(depMap, (this.map.isDefine ? this.map : this.map.parentMap), false, !this.skipMap);
                          this.depMaps[i] = depMap;
                          handler = getOwn(handlers, depMap.id);
                          if (handler) {
                              this.depExports[i] = handler(this);
                              return;
                          }
                          this.depCount += 1;
                          on(depMap, 'defined', bind(this, function (depExports) {
                              if (this.undefed) {
                                  return;
                              }
                              this.defineDep(i, depExports);
                              this.check();
                          }));
                          if (this.errback) {
                              on(depMap, 'error', bind(this, this.errback));
                          }
                          else if (this.events.error) {
                              // No direct errback on this module, but something
                              // else is listening for errors, so be sure to
                              // propagate the error correctly.
                              on(depMap, 'error', bind(this, function (err) {
                                  this.emit('error', err);
                              }));
                          }
                      }
                      id = depMap.id;
                      mod = registry[id];
                      //Skip special modules like 'require', 'exports', 'module'
                      //Also, don't call enable if it is already enabled,
                      //important in circular dependency cases.
                      if (!hasProp(handlers, id) && mod && !mod.enabled) {
                          context.enable(depMap, this);
                      }
                  }));
                  //Enable each plugin that is used in
                  //a dependency
                  eachProp(this.pluginMaps, bind(this, function (pluginMap) {
                      var mod = getOwn(registry, pluginMap.id);
                      if (mod && !mod.enabled) {
                          context.enable(pluginMap, this);
                      }
                  }));
                  this.enabling = false;
                  this.check();
              },
              on: function (name, cb) {
                  var cbs = this.events[name];
                  if (!cbs) {
                      cbs = this.events[name] = [];
                  }
                  cbs.push(cb);
              },
              emit: function (name, evt) {
                  each(this.events[name], function (cb) {
                      cb(evt);
                  });
                  if (name === 'error') {
                      //Now that the error handler was triggered, remove
                      //the listeners, since this broken Module instance
                      //can stay around for a while in the registry.
                      delete this.events[name];
                  }
              }
          };
          function callGetModule(args) {
              //Skip modules already defined.
              if (!hasProp(defined, args[0])) {
                  getModule(makeModuleMap(args[0], null, true)).init(args[1], args[2]);
              }
          }
          function removeListener(node, func, name, ieName) {
              //Favor detachEvent because of IE9
              //issue, see attachEvent/addEventListener comment elsewhere
              //in this file.
              if (node.detachEvent && !isOpera) {
                  //Probably IE. If not it will throw an error, which will be
                  //useful to know.
                  if (ieName) {
                      node.detachEvent(ieName, func);
                  }
              }
              else {
                  node.removeEventListener(name, func, false);
              }
          }
          /**
           * Given an event from a script node, get the requirejs info from it,
           * and then removes the event listeners on the node.
           * @param {Event} evt
           * @returns {Object}
           */
          function getScriptData(evt) {
              //Using currentTarget instead of target for Firefox 2.0's sake. Not
              //all old browsers will be supported, but this one was easy enough
              //to support and still makes sense.
              var node = evt.currentTarget || evt.srcElement;
              //Remove the listeners once here.
              removeListener(node, context.onScriptLoad, 'load', 'onreadystatechange');
              removeListener(node, context.onScriptError, 'error');
              return {
                  node: node,
                  id: node && node.getAttribute('data-requiremodule')
              };
          }
          function intakeDefines() {
              var args;
              //Any defined modules in the global queue, intake them now.
              takeGlobalQueue();
              //Make sure any remaining defQueue items get properly processed.
              while (defQueue.length) {
                  args = defQueue.shift();
                  if (args[0] === null) {
                      return onError(makeError('mismatch', 'Mismatched anonymous define() module: ' +
                          args[args.length - 1]));
                  }
                  else {
                      //args are id, deps, factory. Should be normalized by the
                      //define() function.
                      callGetModule(args);
                  }
              }
              context.defQueueMap = {};
          }
          context = {
              config: config,
              contextName: contextName,
              registry: registry,
              defined: defined,
              urlFetched: urlFetched,
              defQueue: defQueue,
              defQueueMap: {},
              Module: Module,
              makeModuleMap: makeModuleMap,
              nextTick: req.nextTick,
              onError: onError,
              /**
               * Set a configuration for the context.
               * @param {Object} cfg config object to integrate.
               */
              configure: function (cfg) {
                  //Make sure the baseUrl ends in a slash.
                  if (cfg.baseUrl) {
                      if (cfg.baseUrl.charAt(cfg.baseUrl.length - 1) !== '/') {
                          cfg.baseUrl += '/';
                      }
                  }
                  // Convert old style urlArgs string to a function.
                  if (typeof cfg.urlArgs === 'string') {
                      var urlArgs = cfg.urlArgs;
                      cfg.urlArgs = function (id, url) {
                          return (url.indexOf('?') === -1 ? '?' : '&') + urlArgs;
                      };
                  }
                  //Save off the paths since they require special processing,
                  //they are additive.
                  var shim = config.shim, objs = {
                      paths: true,
                      bundles: true,
                      config: true,
                      map: true
                  };
                  eachProp(cfg, function (value, prop) {
                      if (objs[prop]) {
                          if (!config[prop]) {
                              config[prop] = {};
                          }
                          mixin(config[prop], value, true, true);
                      }
                      else {
                          config[prop] = value;
                      }
                  });
                  //Reverse map the bundles
                  if (cfg.bundles) {
                      eachProp(cfg.bundles, function (value, prop) {
                          each(value, function (v) {
                              if (v !== prop) {
                                  bundlesMap[v] = prop;
                              }
                          });
                      });
                  }
                  //Merge shim
                  if (cfg.shim) {
                      eachProp(cfg.shim, function (value, id) {
                          //Normalize the structure
                          if (isArray(value)) {
                              value = {
                                  deps: value
                              };
                          }
                          if ((value.exports || value.init) && !value.exportsFn) {
                              value.exportsFn = context.makeShimExports(value);
                          }
                          shim[id] = value;
                      });
                      config.shim = shim;
                  }
                  //Adjust packages if necessary.
                  if (cfg.packages) {
                      each(cfg.packages, function (pkgObj) {
                          var location, name;
                          pkgObj = typeof pkgObj === 'string' ? { name: pkgObj } : pkgObj;
                          name = pkgObj.name;
                          location = pkgObj.location;
                          if (location) {
                              config.paths[name] = pkgObj.location;
                          }
                          //Save pointer to main module ID for pkg name.
                          //Remove leading dot in main, so main paths are normalized,
                          //and remove any trailing .js, since different package
                          //envs have different conventions: some use a module name,
                          //some use a file name.
                          config.pkgs[name] = pkgObj.name + '/' + (pkgObj.main || 'main')
                              .replace(currDirRegExp, '')
                              .replace(jsSuffixRegExp, '');
                      });
                  }
                  //If there are any "waiting to execute" modules in the registry,
                  //update the maps for them, since their info, like URLs to load,
                  //may have changed.
                  eachProp(registry, function (mod, id) {
                      //If module already has init called, since it is too
                      //late to modify them, and ignore unnormalized ones
                      //since they are transient.
                      if (!mod.inited && !mod.map.unnormalized) {
                          mod.map = makeModuleMap(id, null, true);
                      }
                  });
                  //If a deps array or a config callback is specified, then call
                  //require with those args. This is useful when require is defined as a
                  //config object before require.js is loaded.
                  if (cfg.deps || cfg.callback) {
                      context.require(cfg.deps || [], cfg.callback);
                  }
              },
              makeShimExports: function (value) {
                  function fn() {
                      var ret;
                      if (value.init) {
                          ret = value.init.apply(global, arguments);
                      }
                      return ret || (value.exports && getGlobal(value.exports));
                  }
                  return fn;
              },
              makeRequire: function (relMap, options) {
                  options = options || {};
                  function localRequire(deps, callback, errback) {
                      var id, map, requireMod;
                      if (options.enableBuildCallback && callback && isFunction(callback)) {
                          callback.__requireJsBuild = true;
                      }
                      if (typeof deps === 'string') {
                          if (isFunction(callback)) {
                              //Invalid call
                              return onError(makeError('requireargs', 'Invalid require call'), errback);
                          }
                          //If require|exports|module are requested, get the
                          //value for them from the special handlers. Caveat:
                          //this only works while module is being defined.
                          if (relMap && hasProp(handlers, deps)) {
                              return handlers[deps](registry[relMap.id]);
                          }
                          //Synchronous access to one module. If require.get is
                          //available (as in the Node adapter), prefer that.
                          if (req.get) {
                              return req.get(context, deps, relMap, localRequire);
                          }
                          //Normalize module name, if it contains . or ..
                          map = makeModuleMap(deps, relMap, false, true);
                          id = map.id;
                          if (!hasProp(defined, id)) {
                              return onError(makeError('notloaded', 'Module name "' +
                                  id +
                                  '" has not been loaded yet for context: ' +
                                  contextName +
                                  (relMap ? '' : '. Use require([])')));
                          }
                          return defined[id];
                      }
                      //Grab defines waiting in the global queue.
                      intakeDefines();
                      //Mark all the dependencies as needing to be loaded.
                      context.nextTick(function () {
                          //Some defines could have been added since the
                          //require call, collect them.
                          intakeDefines();
                          requireMod = getModule(makeModuleMap(null, relMap));
                          //Store if map config should be applied to this require
                          //call for dependencies.
                          requireMod.skipMap = options.skipMap;
                          requireMod.init(deps, callback, errback, {
                              enabled: true
                          });
                          checkLoaded();
                      });
                      return localRequire;
                  }
                  mixin(localRequire, {
                      isBrowser: isBrowser,
                      /**
                       * Converts a module name + .extension into an URL path.
                       * *Requires* the use of a module name. It does not support using
                       * plain URLs like nameToUrl.
                       */
                      toUrl: function (moduleNamePlusExt) {
                          var ext, index = moduleNamePlusExt.lastIndexOf('.'), segment = moduleNamePlusExt.split('/')[0], isRelative = segment === '.' || segment === '..';
                          //Have a file extension alias, and it is not the
                          //dots from a relative path.
                          if (index !== -1 && (!isRelative || index > 1)) {
                              ext = moduleNamePlusExt.substring(index, moduleNamePlusExt.length);
                              moduleNamePlusExt = moduleNamePlusExt.substring(0, index);
                          }
                          return context.nameToUrl(normalize(moduleNamePlusExt, relMap && relMap.id, true), ext, true);
                      },
                      defined: function (id) {
                          return hasProp(defined, makeModuleMap(id, relMap, false, true).id);
                      },
                      specified: function (id) {
                          id = makeModuleMap(id, relMap, false, true).id;
                          return hasProp(defined, id) || hasProp(registry, id);
                      }
                  });
                  //Only allow undef on top level require calls
                  if (!relMap) {
                      localRequire.undef = function (id) {
                          //Bind any waiting define() calls to this context,
                          //fix for #408
                          takeGlobalQueue();
                          var map = makeModuleMap(id, relMap, true), mod = getOwn(registry, id);
                          mod.undefed = true;
                          removeScript(id);
                          delete defined[id];
                          delete urlFetched[map.url];
                          delete undefEvents[id];
                          //Clean queued defines too. Go backwards
                          //in array so that the splices do not
                          //mess up the iteration.
                          eachReverse(defQueue, function (args, i) {
                              if (args[0] === id) {
                                  defQueue.splice(i, 1);
                              }
                          });
                          delete context.defQueueMap[id];
                          if (mod) {
                              //Hold on to listeners in case the
                              //module will be attempted to be reloaded
                              //using a different config.
                              if (mod.events.defined) {
                                  undefEvents[id] = mod.events;
                              }
                              cleanRegistry(id);
                          }
                      };
                  }
                  return localRequire;
              },
              /**
               * Called to enable a module if it is still in the registry
               * awaiting enablement. A second arg, parent, the parent module,
               * is passed in for context, when this method is overridden by
               * the optimizer. Not shown here to keep code compact.
               */
              enable: function (depMap) {
                  var mod = getOwn(registry, depMap.id);
                  if (mod) {
                      getModule(depMap).enable();
                  }
              },
              /**
               * Internal method used by environment adapters to complete a load event.
               * A load event could be a script load or just a load pass from a synchronous
               * load call.
               * @param {String} moduleName the name of the module to potentially complete.
               */
              completeLoad: function (moduleName) {
                  var found, args, mod, shim = getOwn(config.shim, moduleName) || {}, shExports = shim.exports;
                  takeGlobalQueue();
                  while (defQueue.length) {
                      args = defQueue.shift();
                      if (args[0] === null) {
                          args[0] = moduleName;
                          //If already found an anonymous module and bound it
                          //to this name, then this is some other anon module
                          //waiting for its completeLoad to fire.
                          if (found) {
                              break;
                          }
                          found = true;
                      }
                      else if (args[0] === moduleName) {
                          //Found matching define call for this script!
                          found = true;
                      }
                      callGetModule(args);
                  }
                  context.defQueueMap = {};
                  //Do this after the cycle of callGetModule in case the result
                  //of those calls/init calls changes the registry.
                  mod = getOwn(registry, moduleName);
                  if (!found && !hasProp(defined, moduleName) && mod && !mod.inited) {
                      if (config.enforceDefine && (!shExports || !getGlobal(shExports))) {
                          if (hasPathFallback(moduleName)) {
                              return;
                          }
                          else {
                              return onError(makeError('nodefine', 'No define call for ' + moduleName, null, [moduleName]));
                          }
                      }
                      else {
                          //A script that does not call define(), so just simulate
                          //the call for it.
                          callGetModule([moduleName, (shim.deps || []), shim.exportsFn]);
                      }
                  }
                  checkLoaded();
              },
              /**
               * Converts a module name to a file path. Supports cases where
               * moduleName may actually be just an URL.
               * Note that it **does not** call normalize on the moduleName,
               * it is assumed to have already been normalized. This is an
               * internal API, not a public one. Use toUrl for the public API.
               */
              nameToUrl: function (moduleName, ext, skipExt) {
                  var paths, syms, i, parentModule, url, parentPath, bundleId, pkgMain = getOwn(config.pkgs, moduleName);
                  if (pkgMain) {
                      moduleName = pkgMain;
                  }
                  bundleId = getOwn(bundlesMap, moduleName);
                  if (bundleId) {
                      return context.nameToUrl(bundleId, ext, skipExt);
                  }
                  //If a colon is in the URL, it indicates a protocol is used and it is just
                  //an URL to a file, or if it starts with a slash, contains a query arg (i.e. ?)
                  //or ends with .js, then assume the user meant to use an url and not a module id.
                  //The slash is important for protocol-less URLs as well as full paths.
                  if (req.jsExtRegExp.test(moduleName)) {
                      //Just a plain path, not module name lookup, so just return it.
                      //Add extension if it is included. This is a bit wonky, only non-.js things pass
                      //an extension, this method probably needs to be reworked.
                      url = moduleName + (ext || '');
                  }
                  else {
                      //A module that needs to be converted to a path.
                      paths = config.paths;
                      syms = moduleName.split('/');
                      //For each module name segment, see if there is a path
                      //registered for it. Start with most specific name
                      //and work up from it.
                      for (i = syms.length; i > 0; i -= 1) {
                          parentModule = syms.slice(0, i).join('/');
                          parentPath = getOwn(paths, parentModule);
                          if (parentPath) {
                              //If an array, it means there are a few choices,
                              //Choose the one that is desired
                              if (isArray(parentPath)) {
                                  parentPath = parentPath[0];
                              }
                              syms.splice(0, i, parentPath);
                              break;
                          }
                      }
                      //Join the path parts together, then figure out if baseUrl is needed.
                      url = syms.join('/');
                      url += (ext || (/^data\:|^blob\:|\?/.test(url) || skipExt ? '' : '.js'));
                      url = (url.charAt(0) === '/' || url.match(/^[\w\+\.\-]+:/) ? '' : config.baseUrl) + url;
                  }
                  return config.urlArgs && !/^blob\:/.test(url) ?
                      url + config.urlArgs(moduleName, url) : url;
              },
              //Delegates to req.load. Broken out as a separate function to
              //allow overriding in the optimizer.
              load: function (id, url) {
                  req.load(context, id, url);
              },
              /**
               * Executes a module callback function. Broken out as a separate function
               * solely to allow the build system to sequence the files in the built
               * layer in the right sequence.
               *
               * @private
               */
              execCb: function (name, callback, args, exports) {
                  return callback.apply(exports, args);
              },
              /**
               * callback for script loads, used to check status of loading.
               *
               * @param {Event} evt the event from the browser for the script
               * that was loaded.
               */
              onScriptLoad: function (evt) {
                  //Using currentTarget instead of target for Firefox 2.0's sake. Not
                  //all old browsers will be supported, but this one was easy enough
                  //to support and still makes sense.
                  if (evt.type === 'load' ||
                      (readyRegExp.test((evt.currentTarget || evt.srcElement).readyState))) {
                      //Reset interactive script so a script node is not held onto for
                      //to long.
                      interactiveScript = null;
                      //Pull out the name of the module and the context.
                      var data = getScriptData(evt);
                      context.completeLoad(data.id);
                  }
              },
              /**
               * Callback for script errors.
               */
              onScriptError: function (evt) {
                  var data = getScriptData(evt);
                  if (!hasPathFallback(data.id)) {
                      var parents = [];
                      eachProp(registry, function (value, key) {
                          if (key.indexOf('_@r') !== 0) {
                              each(value.depMaps, function (depMap) {
                                  if (depMap.id === data.id) {
                                      parents.push(key);
                                      return true;
                                  }
                              });
                          }
                      });
                      return onError(makeError('scripterror', 'Script error for "' + data.id +
                          (parents.length ?
                              '", needed by: ' + parents.join(', ') :
                              '"'), evt, [data.id]));
                  }
              }
          };
          context.require = context.makeRequire();
          return context;
      }
      /**
       * Main entry point.
       *
       * If the only argument to require is a string, then the module that
       * is represented by that string is fetched for the appropriate context.
       *
       * If the first argument is an array, then it will be treated as an array
       * of dependency string names to fetch. An optional function callback can
       * be specified to execute when all of those dependencies are available.
       *
       * Make a local req variable to help Caja compliance (it assumes things
       * on a require that are not standardized), and to give a short
       * name for minification/local scope use.
       */
      req = exports.requirejs = requirejs = function (deps, callback, errback, optional) {
          //Find the right context, use default
          var context, config, contextName = defContextName;
          // Determine if have config object in the call.
          if (!isArray(deps) && typeof deps !== 'string') {
              // deps is a config object
              config = deps;
              if (isArray(callback)) {
                  // Adjust args if there are dependencies
                  deps = callback;
                  callback = errback;
                  errback = optional;
              }
              else {
                  deps = [];
              }
          }
          if (config && config.context) {
              contextName = config.context;
          }
          context = getOwn(contexts, contextName);
          if (!context) {
              context = contexts[contextName] = req.s.newContext(contextName);
          }
          if (config) {
              context.configure(config);
          }
          return context.require(deps, callback, errback);
      };
      /**
       * Support require.config() to make it easier to cooperate with other
       * AMD loaders on globally agreed names.
       */
      req.config = function (config) {
          return req(config);
      };
      /**
       * Execute something after the current tick
       * of the event loop. Override for other envs
       * that have a better solution than setTimeout.
       * @param  {Function} fn function to execute later.
       */
      req.nextTick = typeof setTimeout !== 'undefined' ? function (fn) {
          setTimeout(fn, 4);
      } : function (fn) { fn(); };
      /**
       * Export require as a global, but only if it does not already exist.
       */
      if (!require) {
          require = req;
      }
      req.version = version;
      //Used to filter out dependencies that are already paths.
      req.jsExtRegExp = /^\/|:|\?|\.js$/;
      req.isBrowser = isBrowser;
      s = req.s = {
          contexts: contexts,
          newContext: newContext
      };
      //Create default context.
      req({});
      //Exports some context-sensitive methods on global require.
      each([
          'toUrl',
          'undef',
          'defined',
          'specified'
      ], function (prop) {
          //Reference from contexts instead of early binding to default context,
          //so that during builds, the latest instance of the default context
          //with its config gets used.
          req[prop] = function () {
              var ctx = contexts[defContextName];
              return ctx.require[prop].apply(ctx, arguments);
          };
      });
      if (isBrowser) {
          head = s.head = document.getElementsByTagName('head')[0];
          //If BASE tag is in play, using appendChild is a problem for IE6.
          //When that browser dies, this can be removed. Details in this jQuery bug:
          //http://dev.jquery.com/ticket/2709
          baseElement = document.getElementsByTagName('base')[0];
          if (baseElement) {
              head = s.head = baseElement.parentNode;
          }
      }
      /**
       * Any errors that require explicitly generates will be passed to this
       * function. Intercept/override it if you want custom error handling.
       * @param {Error} err the error object.
       */
      req.onError = defaultOnError;
      /**
       * Creates the node for the load command. Only used in browser envs.
       */
      req.createNode = function (config, moduleName, url) {
          var node = config.xhtml ?
              document.createElementNS('http://www.w3.org/1999/xhtml', 'html:script') :
              document.createElement('script');
          node.type = config.scriptType || 'text/javascript';
          node.charset = 'utf-8';
          node.async = true;
          return node;
      };
      /**
       * Does the request to load a module for the browser case.
       * Make this a separate function to allow other environments
       * to override it.
       *
       * @param {Object} context the require context to find state.
       * @param {String} moduleName the name of the module.
       * @param {Object} url the URL to the module.
       */
      req.load = function (context, moduleName, url) {
          var config = (context && context.config) || {}, node;
          if (isBrowser) {
              //In the browser so use a script tag
              node = req.createNode(config, moduleName, url);
              node.setAttribute('data-requirecontext', context.contextName);
              node.setAttribute('data-requiremodule', moduleName);
              //Set up load listener. Test attachEvent first because IE9 has
              //a subtle issue in its addEventListener and script onload firings
              //that do not match the behavior of all other browsers with
              //addEventListener support, which fire the onload event for a
              //script right after the script execution. See:
              //https://connect.microsoft.com/IE/feedback/details/648057/script-onload-event-is-not-fired-immediately-after-script-execution
              //UNFORTUNATELY Opera implements attachEvent but does not follow the script
              //script execution mode.
              if (node.attachEvent &&
                  //Check if node.attachEvent is artificially added by custom script or
                  //natively supported by browser
                  //read https://github.com/requirejs/requirejs/issues/187
                  //if we can NOT find [native code] then it must NOT natively supported.
                  //in IE8, node.attachEvent does not have toString()
                  //Note the test for "[native code" with no closing brace, see:
                  //https://github.com/requirejs/requirejs/issues/273
                  !(node.attachEvent.toString && node.attachEvent.toString().indexOf('[native code') < 0) &&
                  !isOpera) {
                  //Probably IE. IE (at least 6-8) do not fire
                  //script onload right after executing the script, so
                  //we cannot tie the anonymous define call to a name.
                  //However, IE reports the script as being in 'interactive'
                  //readyState at the time of the define call.
                  useInteractive = true;
                  node.attachEvent('onreadystatechange', context.onScriptLoad);
                  //It would be great to add an error handler here to catch
                  //404s in IE9+. However, onreadystatechange will fire before
                  //the error handler, so that does not help. If addEventListener
                  //is used, then IE will fire error before load, but we cannot
                  //use that pathway given the connect.microsoft.com issue
                  //mentioned above about not doing the 'script execute,
                  //then fire the script load event listener before execute
                  //next script' that other browsers do.
                  //Best hope: IE10 fixes the issues,
                  //and then destroys all installs of IE 6-9.
                  //node.attachEvent('onerror', context.onScriptError);
              }
              else {
                  node.addEventListener('load', context.onScriptLoad, false);
                  node.addEventListener('error', context.onScriptError, false);
              }
              node.src = url;
              //Calling onNodeCreated after all properties on the node have been
              //set, but before it is placed in the DOM.
              if (config.onNodeCreated) {
                  config.onNodeCreated(node, config, moduleName, url);
              }
              //For some cache cases in IE 6-8, the script executes before the end
              //of the appendChild execution, so to tie an anonymous define
              //call to the module name (which is stored on the node), hold on
              //to a reference to this node, but clear after the DOM insertion.
              currentlyAddingScript = node;
              if (baseElement) {
                  head.insertBefore(node, baseElement);
              }
              else {
                  head.appendChild(node);
              }
              currentlyAddingScript = null;
              return node;
          }
          else if (isWebWorker) {
              try {
                  //In a web worker, use importScripts. This is not a very
                  //efficient use of importScripts, importScripts will block until
                  //its script is downloaded and evaluated. However, if web workers
                  //are in play, the expectation is that a build has been done so
                  //that only one script needs to be loaded anyway. This may need
                  //to be reevaluated if other use cases become common.
                  // Post a task to the event loop to work around a bug in WebKit
                  // where the worker gets garbage-collected after calling
                  // importScripts(): https://webkit.org/b/153317
                  setTimeout(function () { }, 0);
                  importScripts(url);
                  //Account for anonymous modules
                  context.completeLoad(moduleName);
              }
              catch (e) {
                  context.onError(makeError('importscripts', 'importScripts failed for ' +
                      moduleName + ' at ' + url, e, [moduleName]));
              }
          }
      };
      function getInteractiveScript() {
          if (interactiveScript && interactiveScript.readyState === 'interactive') {
              return interactiveScript;
          }
          eachReverse(scripts(), function (script) {
              if (script.readyState === 'interactive') {
                  return (interactiveScript = script);
              }
          });
          return interactiveScript;
      }
      //Look for a data-main script attribute, which could also adjust the baseUrl.
      if (isBrowser && !cfg.skipDataMain) {
          //Figure out baseUrl. Get it from the script tag with require.js in it.
          eachReverse(scripts(), function (script) {
              //Set the 'head' where we can append children by
              //using the script's parent.
              if (!head) {
                  head = script.parentNode;
              }
              //Look for a data-main attribute to set main script for the page
              //to load. If it is there, the path to data main becomes the
              //baseUrl, if it is not already set.
              dataMain = script.getAttribute('data-main');
              if (dataMain) {
                  //Preserve dataMain in case it is a path (i.e. contains '?')
                  mainScript = dataMain;
                  //Set final baseUrl if there is not already an explicit one,
                  //but only do so if the data-main value is not a loader plugin
                  //module ID.
                  if (!cfg.baseUrl && mainScript.indexOf('!') === -1) {
                      //Pull off the directory of data-main for use as the
                      //baseUrl.
                      src = mainScript.split('/');
                      mainScript = src.pop();
                      subPath = src.length ? src.join('/') + '/' : './';
                      cfg.baseUrl = subPath;
                  }
                  //Strip off any trailing .js since mainScript is now
                  //like a module name.
                  mainScript = mainScript.replace(jsSuffixRegExp, '');
                  //If mainScript is still a path, fall back to dataMain
                  if (req.jsExtRegExp.test(mainScript)) {
                      mainScript = dataMain;
                  }
                  //Put the data-main script in the files to load.
                  cfg.deps = cfg.deps ? cfg.deps.concat(mainScript) : [mainScript];
                  return true;
              }
          });
      }
      /**
       * The function that handles definitions of modules. Differs from
       * require() in that a string for the module should be the first argument,
       * and the function to execute after dependencies are loaded should
       * return a value to define the module corresponding to the first argument's
       * name.
       */
      exports.define = define = function (name, deps, callback) {
          var node, context;
          //Allow for anonymous modules
          if (typeof name !== 'string') {
              //Adjust args appropriately
              callback = deps;
              deps = name;
              name = null;
          }
          //This module may not have dependencies
          if (!isArray(deps)) {
              callback = deps;
              deps = null;
          }
          //If no name, and callback is a function, then figure out if it a
          //CommonJS thing with dependencies.
          if (!deps && isFunction(callback)) {
              deps = [];
              //Remove comments from the callback string,
              //look for require calls, and pull them into the dependencies,
              //but only if there are function args.
              if (callback.length) {
                  callback
                      .toString()
                      .replace(commentRegExp, commentReplace)
                      .replace(cjsRequireRegExp, function (match, dep) {
                      deps.push(dep);
                  });
                  //May be a CommonJS thing even without require calls, but still
                  //could use exports, and module. Avoid doing exports and module
                  //work though if it just needs require.
                  //REQUIRES the function to expect the CommonJS variables in the
                  //order listed below.
                  deps = (callback.length === 1 ? ['require'] : ['require', 'exports', 'module']).concat(deps);
              }
          }
          //If in IE 6-8 and hit an anonymous define() call, do the interactive
          //work.
          if (useInteractive) {
              node = currentlyAddingScript || getInteractiveScript();
              if (node) {
                  if (!name) {
                      name = node.getAttribute('data-requiremodule');
                  }
                  context = contexts[node.getAttribute('data-requirecontext')];
              }
          }
          //Always save off evaluating the def call until the script onload handler.
          //This allows multiple modules to be in a file without prematurely
          //tracing dependencies, and allows for anonymous module support,
          //where the module name is not known until the script onload event
          //occurs. If no context, use the global queue, and get it processed
          //in the onscript load callback.
          if (context) {
              context.defQueue.push([name, deps, callback]);
              context.defQueueMap[name] = true;
          }
          else {
              globalDefQueue.push([name, deps, callback]);
          }
      };
      define.amd = {
          jQuery: true
      };
      /**
       * Executes the text. Normally just uses eval, but can be modified
       * to use a better, environment-specific call. Only used for transpiling
       * loader plugins, not for plain JS modules.
       * @param {String} text the text to execute/evaluate.
       */
      req.exec = function (text) {
          /*jslint evil: true */
          return eval(text);
      };
      //Set up with config info.
      req(cfg);
  }(commonjsGlobal, (typeof setTimeout === 'undefined' ? undefined : setTimeout)));
  exports.default = requirejs;

  });

  unwrapExports(require_1);
  var require_2 = require_1.define;
  var require_3 = require_1.requirejs;

  var SteedosBuilder=function(e){function r(){return null!==e&&e.apply(this,arguments)||this}return __extends(r,e),r.require=function(e,t){if(Builder.isBrowser)return r.requirejs(e,t);console.warn("Builder.require used on the server - this should only be used in the browser");},r.registerImportMap=function(e){if(Builder.isBrowser){Object.assign(this.importMap,e);var t={type:"builder.importMapChange",data:this.importMap};return parent.postMessage(t,"*"),r.requirejs.config({paths:this.importMap})}},r.injectCSS=function(e,r){var t=(void 0===r?{}:r).insertAt,s=void 0===t?"top":t;if(e&&"undefined"!=typeof document){var n=document.head||document.getElementsByTagName("head")[0],i=document.createElement("link");i.type="text/css",i.rel="stylesheet",i.href=e,"top"===s&&n.firstChild?n.insertBefore(i,n.firstChild):n.appendChild(i);}},Object.defineProperty(r.prototype,"host",{get:function(){switch(this.env){case"development":case"dev":return "http://localhost:5000";default:return Builder.overrideHost||"https://console.steedos.cn"}},enumerable:!1,configurable:!0}),r.settings={unpkgUrl:"https://unpkg.com"},r.importMap={},r.packages={},r.stores={},r.requirejs=require_3,r.define=require_2,r.requirejsPromise=function(e){return __awaiter(void 0,void 0,void 0,function(){return __generator(this,function(t){switch(t.label){case 0:return [4,new Promise(function(t,s){try{r.requirejs(e,function(){for(var e=[],r=0;r<arguments.length;r++)e[r]=arguments[r];t(e);});}catch(e){s(e);}})];case 1:return [2,t.sent()]}})})},r.registerRemoteAssets=function(e,t){var s,n;return __awaiter(void 0,void 0,void 0,function(){var i,o,u,a,l,c;return __generator(this,function(d){switch(d.label){case 0:if(!Builder.isBrowser)return console.warn("Builder.require used on the server - this should only be used in the browser"),[2];"string"==typeof e&&(e=[e]),d.label=1;case 1:d.trys.push([1,9,10,15]),s=__asyncValues(e),d.label=2;case 2:return [4,s.next()];case 3:return (n=d.sent()).done?[3,8]:(i=n.value,o=i.replace("https://unpkg.com",r.settings.unpkgUrl),[4,fetch(o)]);case 4:return [4,d.sent().json()];case 5:return u=d.sent(),[4,r.registerAssets(u,t)];case 6:d.sent(),d.label=7;case 7:return [3,2];case 8:return [3,15];case 9:return a=d.sent(),l={error:a},[3,15];case 10:return d.trys.push([10,,13,14]),n&&!n.done&&(c=s.return)?[4,c.call(s)]:[3,12];case 11:d.sent(),d.label=12;case 12:return [3,14];case 13:if(l)throw l.error;return [7];case 14:return [7];case 15:return Builder.register("remote-assets",{assetUrls:e}),[2]}})})},r.registerAssets=function(e,t){return __awaiter(void 0,void 0,void 0,function(){var s,n,i,o,u,a,l,c,d,p,h,g;return __generator(this,function(m){switch(m.label){case 0:return s=e.packages,n=e.components,Builder.isBrowser?(Builder.register("assets",{assets:e}),i=[],o=[],u={},null===s||void 0===s||s.forEach(function(e,t){return __awaiter(void 0,void 0,void 0,function(){var t,s;return __generator(this,function(n){return e.urls&&Array.isArray(e.urls)&&e.urls.length>0&&e.package&&e.library&&(t=e.urls[0],s=e.urls[1],(null===t||void 0===t?void 0:t.endsWith(".js"))&&(t=(t=t.replace("https://unpkg.com",r.settings.unpkgUrl)).substring(0,t.length-3),u[e.package]=t,i.push(e.package),o.push(e.library),r.packages[e.package]=e),(null===s||void 0===s?void 0:s.endsWith(".css"))&&(s=s.replace("https://unpkg.com",r.settings.unpkgUrl),r.injectCSS(s))),[2]})})}),r.registerImportMap(u),[4,r.requirejsPromise(i)]):(console.warn("Builder.require used on the server - this should only be used in the browser"),[2]);case 1:if(m.sent(),o.forEach(function(e,t){console.log("importing "+e),void 0===window[e]&&(window[e]=r.requirejs(i[t]));}),!n)return [3,14];m.label=2;case 2:m.trys.push([2,8,9,14]),a=__asyncValues(n),m.label=3;case 3:return [4,a.next()];case 4:return (l=m.sent()).done?[3,7]:(c=l.value).url?(d=c.url.replace("https://unpkg.com",r.settings.unpkgUrl),[4,r.requirejsPromise([d])]):[3,6];case 5:m.sent(),c.exportName&&void 0!==window[c.exportName]&&r.registerMeta(window[c.exportName]),m.label=6;case 6:return [3,3];case 7:return [3,14];case 8:return p=m.sent(),h={error:p},[3,14];case 9:return m.trys.push([9,,12,13]),l&&!l.done&&(g=a.return)?[4,g.call(a)]:[3,11];case 10:m.sent(),m.label=11;case 11:return [3,13];case 12:if(h)throw h.error;return [7];case 13:return [7];case 14:return t&&t(),[2]}})})},r.registerMeta=function(e){Builder.register("metas",{meta:e}),e.components&&e.components.forEach(function(e,t){return __awaiter(void 0,void 0,void 0,function(){var t,s,n,i,o;return __generator(this,function(u){return (null===(n=e.npm)||void 0===n?void 0:n.package)&&(null===(i=e.npm)||void 0===i?void 0:i.exportName)&&(t=null===(o=r.packages[e.npm.package])||void 0===o?void 0:o.library)&&(s=window[t])&&(Builder.registerComponent(s[e.npm.exportName],{name:e.componentName}),Builder.register("meta-components",e)),[2]})})});},r.registerAmis=function(e){var r=e.render,t=e.editor;r&&Builder.registerComponent("AmisRender",r),t&&Builder.registerComponent("AmisEditor",t);},r}(Builder),builder$1=new SteedosBuilder(null,void 0,void 0,!0);SteedosBuilder.singletonInstance=builder$1;var stores={};SteedosBuilder.stores=stores;

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    _setPrototypeOf(subClass, superClass);
  }

  /*
  object-assign
  (c) Sindre Sorhus
  @license MIT
  */
  /* eslint-disable no-unused-vars */
  var getOwnPropertySymbols = Object.getOwnPropertySymbols;
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var propIsEnumerable = Object.prototype.propertyIsEnumerable;

  function toObject(val) {
  	if (val === null || val === undefined) {
  		throw new TypeError('Object.assign cannot be called with null or undefined');
  	}

  	return Object(val);
  }

  function shouldUseNative() {
  	try {
  		if (!Object.assign) {
  			return false;
  		}

  		// Detect buggy property enumeration order in older V8 versions.

  		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
  		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
  		test1[5] = 'de';
  		if (Object.getOwnPropertyNames(test1)[0] === '5') {
  			return false;
  		}

  		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
  		var test2 = {};
  		for (var i = 0; i < 10; i++) {
  			test2['_' + String.fromCharCode(i)] = i;
  		}
  		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
  			return test2[n];
  		});
  		if (order2.join('') !== '0123456789') {
  			return false;
  		}

  		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
  		var test3 = {};
  		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
  			test3[letter] = letter;
  		});
  		if (Object.keys(Object.assign({}, test3)).join('') !==
  				'abcdefghijklmnopqrst') {
  			return false;
  		}

  		return true;
  	} catch (err) {
  		// We don't expect any of the above to throw, but better to be safe.
  		return false;
  	}
  }

  var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
  	var from;
  	var to = toObject(target);
  	var symbols;

  	for (var s = 1; s < arguments.length; s++) {
  		from = Object(arguments[s]);

  		for (var key in from) {
  			if (hasOwnProperty.call(from, key)) {
  				to[key] = from[key];
  			}
  		}

  		if (getOwnPropertySymbols) {
  			symbols = getOwnPropertySymbols(from);
  			for (var i = 0; i < symbols.length; i++) {
  				if (propIsEnumerable.call(from, symbols[i])) {
  					to[symbols[i]] = from[symbols[i]];
  				}
  			}
  		}
  	}

  	return to;
  };

  var react_production_min = createCommonjsModule(function (module, exports) {
  var n=60103,p=60106;exports.Fragment=60107;exports.StrictMode=60108;exports.Profiler=60114;var q=60109,r=60110,t=60112;exports.Suspense=60113;var u=60115,v=60116;
  if("function"===typeof Symbol&&Symbol.for){var w=Symbol.for;n=w("react.element");p=w("react.portal");exports.Fragment=w("react.fragment");exports.StrictMode=w("react.strict_mode");exports.Profiler=w("react.profiler");q=w("react.provider");r=w("react.context");t=w("react.forward_ref");exports.Suspense=w("react.suspense");u=w("react.memo");v=w("react.lazy");}var x="function"===typeof Symbol&&Symbol.iterator;
  function y(a){if(null===a||"object"!==typeof a)return null;a=x&&a[x]||a["@@iterator"];return "function"===typeof a?a:null}function z(a){for(var b="https://reactjs.org/docs/error-decoder.html?invariant="+a,c=1;c<arguments.length;c++)b+="&args[]="+encodeURIComponent(arguments[c]);return "Minified React error #"+a+"; visit "+b+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}
  var A={isMounted:function(){return !1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},B={};function C(a,b,c){this.props=a;this.context=b;this.refs=B;this.updater=c||A;}C.prototype.isReactComponent={};C.prototype.setState=function(a,b){if("object"!==typeof a&&"function"!==typeof a&&null!=a)throw Error(z(85));this.updater.enqueueSetState(this,a,b,"setState");};C.prototype.forceUpdate=function(a){this.updater.enqueueForceUpdate(this,a,"forceUpdate");};
  function D(){}D.prototype=C.prototype;function E(a,b,c){this.props=a;this.context=b;this.refs=B;this.updater=c||A;}var F=E.prototype=new D;F.constructor=E;objectAssign(F,C.prototype);F.isPureReactComponent=!0;var G={current:null},H=Object.prototype.hasOwnProperty,I={key:!0,ref:!0,__self:!0,__source:!0};
  function J(a,b,c){var e,d={},k=null,h=null;if(null!=b)for(e in void 0!==b.ref&&(h=b.ref),void 0!==b.key&&(k=""+b.key),b)H.call(b,e)&&!I.hasOwnProperty(e)&&(d[e]=b[e]);var g=arguments.length-2;if(1===g)d.children=c;else if(1<g){for(var f=Array(g),m=0;m<g;m++)f[m]=arguments[m+2];d.children=f;}if(a&&a.defaultProps)for(e in g=a.defaultProps,g)void 0===d[e]&&(d[e]=g[e]);return {$$typeof:n,type:a,key:k,ref:h,props:d,_owner:G.current}}
  function K(a,b){return {$$typeof:n,type:a.type,key:b,ref:a.ref,props:a.props,_owner:a._owner}}function L(a){return "object"===typeof a&&null!==a&&a.$$typeof===n}function escape(a){var b={"=":"=0",":":"=2"};return "$"+a.replace(/[=:]/g,function(a){return b[a]})}var M=/\/+/g;function N(a,b){return "object"===typeof a&&null!==a&&null!=a.key?escape(""+a.key):b.toString(36)}
  function O(a,b,c,e,d){var k=typeof a;if("undefined"===k||"boolean"===k)a=null;var h=!1;if(null===a)h=!0;else switch(k){case "string":case "number":h=!0;break;case "object":switch(a.$$typeof){case n:case p:h=!0;}}if(h)return h=a,d=d(h),a=""===e?"."+N(h,0):e,Array.isArray(d)?(c="",null!=a&&(c=a.replace(M,"$&/")+"/"),O(d,b,c,"",function(a){return a})):null!=d&&(L(d)&&(d=K(d,c+(!d.key||h&&h.key===d.key?"":(""+d.key).replace(M,"$&/")+"/")+a)),b.push(d)),1;h=0;e=""===e?".":e+":";if(Array.isArray(a))for(var g=
  0;g<a.length;g++){k=a[g];var f=e+N(k,g);h+=O(k,b,c,f,d);}else if(f=y(a),"function"===typeof f)for(a=f.call(a),g=0;!(k=a.next()).done;)k=k.value,f=e+N(k,g++),h+=O(k,b,c,f,d);else if("object"===k)throw b=""+a,Error(z(31,"[object Object]"===b?"object with keys {"+Object.keys(a).join(", ")+"}":b));return h}function P(a,b,c){if(null==a)return a;var e=[],d=0;O(a,e,"","",function(a){return b.call(c,a,d++)});return e}
  function Q(a){if(-1===a._status){var b=a._result;b=b();a._status=0;a._result=b;b.then(function(b){0===a._status&&(b=b.default,a._status=1,a._result=b);},function(b){0===a._status&&(a._status=2,a._result=b);});}if(1===a._status)return a._result;throw a._result;}var R={current:null};function S(){var a=R.current;if(null===a)throw Error(z(321));return a}var T={ReactCurrentDispatcher:R,ReactCurrentBatchConfig:{transition:0},ReactCurrentOwner:G,IsSomeRendererActing:{current:!1},assign:objectAssign};
  exports.Children={map:P,forEach:function(a,b,c){P(a,function(){b.apply(this,arguments);},c);},count:function(a){var b=0;P(a,function(){b++;});return b},toArray:function(a){return P(a,function(a){return a})||[]},only:function(a){if(!L(a))throw Error(z(143));return a}};exports.Component=C;exports.PureComponent=E;exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=T;
  exports.cloneElement=function(a,b,c){if(null===a||void 0===a)throw Error(z(267,a));var e=objectAssign({},a.props),d=a.key,k=a.ref,h=a._owner;if(null!=b){void 0!==b.ref&&(k=b.ref,h=G.current);void 0!==b.key&&(d=""+b.key);if(a.type&&a.type.defaultProps)var g=a.type.defaultProps;for(f in b)H.call(b,f)&&!I.hasOwnProperty(f)&&(e[f]=void 0===b[f]&&void 0!==g?g[f]:b[f]);}var f=arguments.length-2;if(1===f)e.children=c;else if(1<f){g=Array(f);for(var m=0;m<f;m++)g[m]=arguments[m+2];e.children=g;}return {$$typeof:n,type:a.type,
  key:d,ref:k,props:e,_owner:h}};exports.createContext=function(a,b){void 0===b&&(b=null);a={$$typeof:r,_calculateChangedBits:b,_currentValue:a,_currentValue2:a,_threadCount:0,Provider:null,Consumer:null};a.Provider={$$typeof:q,_context:a};return a.Consumer=a};exports.createElement=J;exports.createFactory=function(a){var b=J.bind(null,a);b.type=a;return b};exports.createRef=function(){return {current:null}};exports.forwardRef=function(a){return {$$typeof:t,render:a}};exports.isValidElement=L;
  exports.lazy=function(a){return {$$typeof:v,_payload:{_status:-1,_result:a},_init:Q}};exports.memo=function(a,b){return {$$typeof:u,type:a,compare:void 0===b?null:b}};exports.useCallback=function(a,b){return S().useCallback(a,b)};exports.useContext=function(a,b){return S().useContext(a,b)};exports.useDebugValue=function(){};exports.useEffect=function(a,b){return S().useEffect(a,b)};exports.useImperativeHandle=function(a,b,c){return S().useImperativeHandle(a,b,c)};
  exports.useLayoutEffect=function(a,b){return S().useLayoutEffect(a,b)};exports.useMemo=function(a,b){return S().useMemo(a,b)};exports.useReducer=function(a,b,c){return S().useReducer(a,b,c)};exports.useRef=function(a){return S().useRef(a)};exports.useState=function(a){return S().useState(a)};exports.version="17.0.2";
  });
  var react_production_min_1 = react_production_min.Fragment;
  var react_production_min_2 = react_production_min.StrictMode;
  var react_production_min_3 = react_production_min.Profiler;
  var react_production_min_4 = react_production_min.Suspense;
  var react_production_min_5 = react_production_min.Children;
  var react_production_min_6 = react_production_min.Component;
  var react_production_min_7 = react_production_min.PureComponent;
  var react_production_min_8 = react_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
  var react_production_min_9 = react_production_min.cloneElement;
  var react_production_min_10 = react_production_min.createContext;
  var react_production_min_11 = react_production_min.createElement;
  var react_production_min_12 = react_production_min.createFactory;
  var react_production_min_13 = react_production_min.createRef;
  var react_production_min_14 = react_production_min.forwardRef;
  var react_production_min_15 = react_production_min.isValidElement;
  var react_production_min_16 = react_production_min.lazy;
  var react_production_min_17 = react_production_min.memo;
  var react_production_min_18 = react_production_min.useCallback;
  var react_production_min_19 = react_production_min.useContext;
  var react_production_min_20 = react_production_min.useDebugValue;
  var react_production_min_21 = react_production_min.useEffect;
  var react_production_min_22 = react_production_min.useImperativeHandle;
  var react_production_min_23 = react_production_min.useLayoutEffect;
  var react_production_min_24 = react_production_min.useMemo;
  var react_production_min_25 = react_production_min.useReducer;
  var react_production_min_26 = react_production_min.useRef;
  var react_production_min_27 = react_production_min.useState;
  var react_production_min_28 = react_production_min.version;

  var react = createCommonjsModule(function (module) {

  {
    module.exports = react_production_min;
  }
  });
  var react_1 = react.cloneElement;
  var react_2 = react.createContext;
  var react_3 = react.useContext;
  var react_4 = react.Component;
  var react_5 = react.createElement;
  var react_6 = react.forwardRef;
  var react_7 = react.Fragment;

  /*

  Based off glamor's StyleSheet, thanks Sunil ❤️

  high performance StyleSheet for css-in-js systems

  - uses multiple style tags behind the scenes for millions of rules
  - uses `insertRule` for appending in production for *much* faster performance

  // usage

  import { StyleSheet } from '@emotion/sheet'

  let styleSheet = new StyleSheet({ key: '', container: document.head })

  styleSheet.insert('#box { border: 1px solid red; }')
  - appends a css rule into the stylesheet

  styleSheet.flush()
  - empties the stylesheet of all its contents

  */
  // $FlowFixMe
  function sheetForTag(tag) {
    if (tag.sheet) {
      // $FlowFixMe
      return tag.sheet;
    } // this weirdness brought to you by firefox

    /* istanbul ignore next */


    for (var i = 0; i < document.styleSheets.length; i++) {
      if (document.styleSheets[i].ownerNode === tag) {
        // $FlowFixMe
        return document.styleSheets[i];
      }
    }
  }

  function createStyleElement(options) {
    var tag = document.createElement('style');
    tag.setAttribute('data-emotion', options.key);

    if (options.nonce !== undefined) {
      tag.setAttribute('nonce', options.nonce);
    }

    tag.appendChild(document.createTextNode(''));
    return tag;
  }

  var StyleSheet =
  /*#__PURE__*/
  function () {
    function StyleSheet(options) {
      this.isSpeedy = options.speedy === undefined ? "production" === 'production' : options.speedy;
      this.tags = [];
      this.ctr = 0;
      this.nonce = options.nonce; // key is the value of the data-emotion attribute, it's used to identify different sheets

      this.key = options.key;
      this.container = options.container;
      this.before = null;
    }

    var _proto = StyleSheet.prototype;

    _proto.insert = function insert(rule) {
      // the max length is how many rules we have per style tag, it's 65000 in speedy mode
      // it's 1 in dev because we insert source maps that map a single rule to a location
      // and you can only have one source map per style tag
      if (this.ctr % (this.isSpeedy ? 65000 : 1) === 0) {
        var _tag = createStyleElement(this);

        var before;

        if (this.tags.length === 0) {
          before = this.before;
        } else {
          before = this.tags[this.tags.length - 1].nextSibling;
        }

        this.container.insertBefore(_tag, before);
        this.tags.push(_tag);
      }

      var tag = this.tags[this.tags.length - 1];

      if (this.isSpeedy) {
        var sheet = sheetForTag(tag);

        try {
          // this is a really hot path
          // we check the second character first because having "i"
          // as the second character will happen less often than
          // having "@" as the first character
          var isImportRule = rule.charCodeAt(1) === 105 && rule.charCodeAt(0) === 64; // this is the ultrafast version, works across browsers
          // the big drawback is that the css won't be editable in devtools

          sheet.insertRule(rule, // we need to insert @import rules before anything else
          // otherwise there will be an error
          // technically this means that the @import rules will
          // _usually_(not always since there could be multiple style tags)
          // be the first ones in prod and generally later in dev
          // this shouldn't really matter in the real world though
          // @import is generally only used for font faces from google fonts and etc.
          // so while this could be technically correct then it would be slower and larger
          // for a tiny bit of correctness that won't matter in the real world
          isImportRule ? 0 : sheet.cssRules.length);
        } catch (e) {
        }
      } else {
        tag.appendChild(document.createTextNode(rule));
      }

      this.ctr++;
    };

    _proto.flush = function flush() {
      // $FlowFixMe
      this.tags.forEach(function (tag) {
        return tag.parentNode.removeChild(tag);
      });
      this.tags = [];
      this.ctr = 0;
    };

    return StyleSheet;
  }();

  function stylis_min (W) {
    function M(d, c, e, h, a) {
      for (var m = 0, b = 0, v = 0, n = 0, q, g, x = 0, K = 0, k, u = k = q = 0, l = 0, r = 0, I = 0, t = 0, B = e.length, J = B - 1, y, f = '', p = '', F = '', G = '', C; l < B;) {
        g = e.charCodeAt(l);
        l === J && 0 !== b + n + v + m && (0 !== b && (g = 47 === b ? 10 : 47), n = v = m = 0, B++, J++);

        if (0 === b + n + v + m) {
          if (l === J && (0 < r && (f = f.replace(N, '')), 0 < f.trim().length)) {
            switch (g) {
              case 32:
              case 9:
              case 59:
              case 13:
              case 10:
                break;

              default:
                f += e.charAt(l);
            }

            g = 59;
          }

          switch (g) {
            case 123:
              f = f.trim();
              q = f.charCodeAt(0);
              k = 1;

              for (t = ++l; l < B;) {
                switch (g = e.charCodeAt(l)) {
                  case 123:
                    k++;
                    break;

                  case 125:
                    k--;
                    break;

                  case 47:
                    switch (g = e.charCodeAt(l + 1)) {
                      case 42:
                      case 47:
                        a: {
                          for (u = l + 1; u < J; ++u) {
                            switch (e.charCodeAt(u)) {
                              case 47:
                                if (42 === g && 42 === e.charCodeAt(u - 1) && l + 2 !== u) {
                                  l = u + 1;
                                  break a;
                                }

                                break;

                              case 10:
                                if (47 === g) {
                                  l = u + 1;
                                  break a;
                                }

                            }
                          }

                          l = u;
                        }

                    }

                    break;

                  case 91:
                    g++;

                  case 40:
                    g++;

                  case 34:
                  case 39:
                    for (; l++ < J && e.charCodeAt(l) !== g;) {
                    }

                }

                if (0 === k) break;
                l++;
              }

              k = e.substring(t, l);
              0 === q && (q = (f = f.replace(ca, '').trim()).charCodeAt(0));

              switch (q) {
                case 64:
                  0 < r && (f = f.replace(N, ''));
                  g = f.charCodeAt(1);

                  switch (g) {
                    case 100:
                    case 109:
                    case 115:
                    case 45:
                      r = c;
                      break;

                    default:
                      r = O;
                  }

                  k = M(c, r, k, g, a + 1);
                  t = k.length;
                  0 < A && (r = X(O, f, I), C = H(3, k, r, c, D, z, t, g, a, h), f = r.join(''), void 0 !== C && 0 === (t = (k = C.trim()).length) && (g = 0, k = ''));
                  if (0 < t) switch (g) {
                    case 115:
                      f = f.replace(da, ea);

                    case 100:
                    case 109:
                    case 45:
                      k = f + '{' + k + '}';
                      break;

                    case 107:
                      f = f.replace(fa, '$1 $2');
                      k = f + '{' + k + '}';
                      k = 1 === w || 2 === w && L('@' + k, 3) ? '@-webkit-' + k + '@' + k : '@' + k;
                      break;

                    default:
                      k = f + k, 112 === h && (k = (p += k, ''));
                  } else k = '';
                  break;

                default:
                  k = M(c, X(c, f, I), k, h, a + 1);
              }

              F += k;
              k = I = r = u = q = 0;
              f = '';
              g = e.charCodeAt(++l);
              break;

            case 125:
            case 59:
              f = (0 < r ? f.replace(N, '') : f).trim();
              if (1 < (t = f.length)) switch (0 === u && (q = f.charCodeAt(0), 45 === q || 96 < q && 123 > q) && (t = (f = f.replace(' ', ':')).length), 0 < A && void 0 !== (C = H(1, f, c, d, D, z, p.length, h, a, h)) && 0 === (t = (f = C.trim()).length) && (f = '\x00\x00'), q = f.charCodeAt(0), g = f.charCodeAt(1), q) {
                case 0:
                  break;

                case 64:
                  if (105 === g || 99 === g) {
                    G += f + e.charAt(l);
                    break;
                  }

                default:
                  58 !== f.charCodeAt(t - 1) && (p += P(f, q, g, f.charCodeAt(2)));
              }
              I = r = u = q = 0;
              f = '';
              g = e.charCodeAt(++l);
          }
        }

        switch (g) {
          case 13:
          case 10:
            47 === b ? b = 0 : 0 === 1 + q && 107 !== h && 0 < f.length && (r = 1, f += '\x00');
            0 < A * Y && H(0, f, c, d, D, z, p.length, h, a, h);
            z = 1;
            D++;
            break;

          case 59:
          case 125:
            if (0 === b + n + v + m) {
              z++;
              break;
            }

          default:
            z++;
            y = e.charAt(l);

            switch (g) {
              case 9:
              case 32:
                if (0 === n + m + b) switch (x) {
                  case 44:
                  case 58:
                  case 9:
                  case 32:
                    y = '';
                    break;

                  default:
                    32 !== g && (y = ' ');
                }
                break;

              case 0:
                y = '\\0';
                break;

              case 12:
                y = '\\f';
                break;

              case 11:
                y = '\\v';
                break;

              case 38:
                0 === n + b + m && (r = I = 1, y = '\f' + y);
                break;

              case 108:
                if (0 === n + b + m + E && 0 < u) switch (l - u) {
                  case 2:
                    112 === x && 58 === e.charCodeAt(l - 3) && (E = x);

                  case 8:
                    111 === K && (E = K);
                }
                break;

              case 58:
                0 === n + b + m && (u = l);
                break;

              case 44:
                0 === b + v + n + m && (r = 1, y += '\r');
                break;

              case 34:
              case 39:
                0 === b && (n = n === g ? 0 : 0 === n ? g : n);
                break;

              case 91:
                0 === n + b + v && m++;
                break;

              case 93:
                0 === n + b + v && m--;
                break;

              case 41:
                0 === n + b + m && v--;
                break;

              case 40:
                if (0 === n + b + m) {
                  if (0 === q) switch (2 * x + 3 * K) {
                    case 533:
                      break;

                    default:
                      q = 1;
                  }
                  v++;
                }

                break;

              case 64:
                0 === b + v + n + m + u + k && (k = 1);
                break;

              case 42:
              case 47:
                if (!(0 < n + m + v)) switch (b) {
                  case 0:
                    switch (2 * g + 3 * e.charCodeAt(l + 1)) {
                      case 235:
                        b = 47;
                        break;

                      case 220:
                        t = l, b = 42;
                    }

                    break;

                  case 42:
                    47 === g && 42 === x && t + 2 !== l && (33 === e.charCodeAt(t + 2) && (p += e.substring(t, l + 1)), y = '', b = 0);
                }
            }

            0 === b && (f += y);
        }

        K = x;
        x = g;
        l++;
      }

      t = p.length;

      if (0 < t) {
        r = c;
        if (0 < A && (C = H(2, p, r, d, D, z, t, h, a, h), void 0 !== C && 0 === (p = C).length)) return G + p + F;
        p = r.join(',') + '{' + p + '}';

        if (0 !== w * E) {
          2 !== w || L(p, 2) || (E = 0);

          switch (E) {
            case 111:
              p = p.replace(ha, ':-moz-$1') + p;
              break;

            case 112:
              p = p.replace(Q, '::-webkit-input-$1') + p.replace(Q, '::-moz-$1') + p.replace(Q, ':-ms-input-$1') + p;
          }

          E = 0;
        }
      }

      return G + p + F;
    }

    function X(d, c, e) {
      var h = c.trim().split(ia);
      c = h;
      var a = h.length,
          m = d.length;

      switch (m) {
        case 0:
        case 1:
          var b = 0;

          for (d = 0 === m ? '' : d[0] + ' '; b < a; ++b) {
            c[b] = Z(d, c[b], e).trim();
          }

          break;

        default:
          var v = b = 0;

          for (c = []; b < a; ++b) {
            for (var n = 0; n < m; ++n) {
              c[v++] = Z(d[n] + ' ', h[b], e).trim();
            }
          }

      }

      return c;
    }

    function Z(d, c, e) {
      var h = c.charCodeAt(0);
      33 > h && (h = (c = c.trim()).charCodeAt(0));

      switch (h) {
        case 38:
          return c.replace(F, '$1' + d.trim());

        case 58:
          return d.trim() + c.replace(F, '$1' + d.trim());

        default:
          if (0 < 1 * e && 0 < c.indexOf('\f')) return c.replace(F, (58 === d.charCodeAt(0) ? '' : '$1') + d.trim());
      }

      return d + c;
    }

    function P(d, c, e, h) {
      var a = d + ';',
          m = 2 * c + 3 * e + 4 * h;

      if (944 === m) {
        d = a.indexOf(':', 9) + 1;
        var b = a.substring(d, a.length - 1).trim();
        b = a.substring(0, d).trim() + b + ';';
        return 1 === w || 2 === w && L(b, 1) ? '-webkit-' + b + b : b;
      }

      if (0 === w || 2 === w && !L(a, 1)) return a;

      switch (m) {
        case 1015:
          return 97 === a.charCodeAt(10) ? '-webkit-' + a + a : a;

        case 951:
          return 116 === a.charCodeAt(3) ? '-webkit-' + a + a : a;

        case 963:
          return 110 === a.charCodeAt(5) ? '-webkit-' + a + a : a;

        case 1009:
          if (100 !== a.charCodeAt(4)) break;

        case 969:
        case 942:
          return '-webkit-' + a + a;

        case 978:
          return '-webkit-' + a + '-moz-' + a + a;

        case 1019:
        case 983:
          return '-webkit-' + a + '-moz-' + a + '-ms-' + a + a;

        case 883:
          if (45 === a.charCodeAt(8)) return '-webkit-' + a + a;
          if (0 < a.indexOf('image-set(', 11)) return a.replace(ja, '$1-webkit-$2') + a;
          break;

        case 932:
          if (45 === a.charCodeAt(4)) switch (a.charCodeAt(5)) {
            case 103:
              return '-webkit-box-' + a.replace('-grow', '') + '-webkit-' + a + '-ms-' + a.replace('grow', 'positive') + a;

            case 115:
              return '-webkit-' + a + '-ms-' + a.replace('shrink', 'negative') + a;

            case 98:
              return '-webkit-' + a + '-ms-' + a.replace('basis', 'preferred-size') + a;
          }
          return '-webkit-' + a + '-ms-' + a + a;

        case 964:
          return '-webkit-' + a + '-ms-flex-' + a + a;

        case 1023:
          if (99 !== a.charCodeAt(8)) break;
          b = a.substring(a.indexOf(':', 15)).replace('flex-', '').replace('space-between', 'justify');
          return '-webkit-box-pack' + b + '-webkit-' + a + '-ms-flex-pack' + b + a;

        case 1005:
          return ka.test(a) ? a.replace(aa, ':-webkit-') + a.replace(aa, ':-moz-') + a : a;

        case 1e3:
          b = a.substring(13).trim();
          c = b.indexOf('-') + 1;

          switch (b.charCodeAt(0) + b.charCodeAt(c)) {
            case 226:
              b = a.replace(G, 'tb');
              break;

            case 232:
              b = a.replace(G, 'tb-rl');
              break;

            case 220:
              b = a.replace(G, 'lr');
              break;

            default:
              return a;
          }

          return '-webkit-' + a + '-ms-' + b + a;

        case 1017:
          if (-1 === a.indexOf('sticky', 9)) break;

        case 975:
          c = (a = d).length - 10;
          b = (33 === a.charCodeAt(c) ? a.substring(0, c) : a).substring(d.indexOf(':', 7) + 1).trim();

          switch (m = b.charCodeAt(0) + (b.charCodeAt(7) | 0)) {
            case 203:
              if (111 > b.charCodeAt(8)) break;

            case 115:
              a = a.replace(b, '-webkit-' + b) + ';' + a;
              break;

            case 207:
            case 102:
              a = a.replace(b, '-webkit-' + (102 < m ? 'inline-' : '') + 'box') + ';' + a.replace(b, '-webkit-' + b) + ';' + a.replace(b, '-ms-' + b + 'box') + ';' + a;
          }

          return a + ';';

        case 938:
          if (45 === a.charCodeAt(5)) switch (a.charCodeAt(6)) {
            case 105:
              return b = a.replace('-items', ''), '-webkit-' + a + '-webkit-box-' + b + '-ms-flex-' + b + a;

            case 115:
              return '-webkit-' + a + '-ms-flex-item-' + a.replace(ba, '') + a;

            default:
              return '-webkit-' + a + '-ms-flex-line-pack' + a.replace('align-content', '').replace(ba, '') + a;
          }
          break;

        case 973:
        case 989:
          if (45 !== a.charCodeAt(3) || 122 === a.charCodeAt(4)) break;

        case 931:
        case 953:
          if (!0 === la.test(d)) return 115 === (b = d.substring(d.indexOf(':') + 1)).charCodeAt(0) ? P(d.replace('stretch', 'fill-available'), c, e, h).replace(':fill-available', ':stretch') : a.replace(b, '-webkit-' + b) + a.replace(b, '-moz-' + b.replace('fill-', '')) + a;
          break;

        case 962:
          if (a = '-webkit-' + a + (102 === a.charCodeAt(5) ? '-ms-' + a : '') + a, 211 === e + h && 105 === a.charCodeAt(13) && 0 < a.indexOf('transform', 10)) return a.substring(0, a.indexOf(';', 27) + 1).replace(ma, '$1-webkit-$2') + a;
      }

      return a;
    }

    function L(d, c) {
      var e = d.indexOf(1 === c ? ':' : '{'),
          h = d.substring(0, 3 !== c ? e : 10);
      e = d.substring(e + 1, d.length - 1);
      return R(2 !== c ? h : h.replace(na, '$1'), e, c);
    }

    function ea(d, c) {
      var e = P(c, c.charCodeAt(0), c.charCodeAt(1), c.charCodeAt(2));
      return e !== c + ';' ? e.replace(oa, ' or ($1)').substring(4) : '(' + c + ')';
    }

    function H(d, c, e, h, a, m, b, v, n, q) {
      for (var g = 0, x = c, w; g < A; ++g) {
        switch (w = S[g].call(B, d, x, e, h, a, m, b, v, n, q)) {
          case void 0:
          case !1:
          case !0:
          case null:
            break;

          default:
            x = w;
        }
      }

      if (x !== c) return x;
    }

    function T(d) {
      switch (d) {
        case void 0:
        case null:
          A = S.length = 0;
          break;

        default:
          if ('function' === typeof d) S[A++] = d;else if ('object' === typeof d) for (var c = 0, e = d.length; c < e; ++c) {
            T(d[c]);
          } else Y = !!d | 0;
      }

      return T;
    }

    function U(d) {
      d = d.prefix;
      void 0 !== d && (R = null, d ? 'function' !== typeof d ? w = 1 : (w = 2, R = d) : w = 0);
      return U;
    }

    function B(d, c) {
      var e = d;
      33 > e.charCodeAt(0) && (e = e.trim());
      V = e;
      e = [V];

      if (0 < A) {
        var h = H(-1, c, e, e, D, z, 0, 0, 0, 0);
        void 0 !== h && 'string' === typeof h && (c = h);
      }

      var a = M(O, e, c, 0, 0);
      0 < A && (h = H(-2, a, e, e, D, z, a.length, 0, 0, 0), void 0 !== h && (a = h));
      V = '';
      E = 0;
      z = D = 1;
      return a;
    }

    var ca = /^\0+/g,
        N = /[\0\r\f]/g,
        aa = /: */g,
        ka = /zoo|gra/,
        ma = /([,: ])(transform)/g,
        ia = /,\r+?/g,
        F = /([\t\r\n ])*\f?&/g,
        fa = /@(k\w+)\s*(\S*)\s*/,
        Q = /::(place)/g,
        ha = /:(read-only)/g,
        G = /[svh]\w+-[tblr]{2}/,
        da = /\(\s*(.*)\s*\)/g,
        oa = /([\s\S]*?);/g,
        ba = /-self|flex-/g,
        na = /[^]*?(:[rp][el]a[\w-]+)[^]*/,
        la = /stretch|:\s*\w+\-(?:conte|avail)/,
        ja = /([^-])(image-set\()/,
        z = 1,
        D = 1,
        E = 0,
        w = 1,
        O = [],
        S = [],
        A = 0,
        R = null,
        Y = 0,
        V = '';
    B.use = T;
    B.set = U;
    void 0 !== W && U(W);
    return B;
  }

  var weakMemoize = function weakMemoize(func) {
    // $FlowFixMe flow doesn't include all non-primitive types as allowed for weakmaps
    var cache = new WeakMap();
    return function (arg) {
      if (cache.has(arg)) {
        // $FlowFixMe
        return cache.get(arg);
      }

      var ret = func(arg);
      cache.set(arg, ret);
      return ret;
    };
  };

  // https://github.com/thysultan/stylis.js/tree/master/plugins/rule-sheet
  // inlined to avoid umd wrapper and peerDep warnings/installing stylis
  // since we use stylis after closure compiler
  var delimiter = '/*|*/';
  var needle = delimiter + '}';

  function toSheet(block) {
    if (block) {
      Sheet.current.insert(block + '}');
    }
  }

  var Sheet = {
    current: null
  };
  var ruleSheet = function ruleSheet(context, content, selectors, parents, line, column, length, ns, depth, at) {
    switch (context) {
      // property
      case 1:
        {
          switch (content.charCodeAt(0)) {
            case 64:
              {
                // @import
                Sheet.current.insert(content + ';');
                return '';
              }
            // charcode for l

            case 108:
              {
                // charcode for b
                // this ignores label
                if (content.charCodeAt(2) === 98) {
                  return '';
                }
              }
          }

          break;
        }
      // selector

      case 2:
        {
          if (ns === 0) return content + delimiter;
          break;
        }
      // at-rule

      case 3:
        {
          switch (ns) {
            // @font-face, @page
            case 102:
            case 112:
              {
                Sheet.current.insert(selectors[0] + content);
                return '';
              }

            default:
              {
                return content + (at === 0 ? delimiter : '');
              }
          }
        }

      case -2:
        {
          content.split(needle).forEach(toSheet);
        }
    }
  };
  var removeLabel = function removeLabel(context, content) {
    if (context === 1 && // charcode for l
    content.charCodeAt(0) === 108 && // charcode for b
    content.charCodeAt(2) === 98 // this ignores label
    ) {
        return '';
      }
  };

  var isBrowser$1 = typeof document !== 'undefined';
  var rootServerStylisCache = {};
  var getServerStylisCache = isBrowser$1 ? undefined : weakMemoize(function () {
    var getCache = weakMemoize(function () {
      return {};
    });
    var prefixTrueCache = {};
    var prefixFalseCache = {};
    return function (prefix) {
      if (prefix === undefined || prefix === true) {
        return prefixTrueCache;
      }

      if (prefix === false) {
        return prefixFalseCache;
      }

      return getCache(prefix);
    };
  });

  var createCache = function createCache(options) {
    if (options === undefined) options = {};
    var key = options.key || 'css';
    var stylisOptions;

    if (options.prefix !== undefined) {
      stylisOptions = {
        prefix: options.prefix
      };
    }

    var stylis = new stylis_min(stylisOptions);

    var inserted = {}; // $FlowFixMe

    var container;

    if (isBrowser$1) {
      container = options.container || document.head;
      var nodes = document.querySelectorAll("style[data-emotion-" + key + "]");
      Array.prototype.forEach.call(nodes, function (node) {
        var attrib = node.getAttribute("data-emotion-" + key); // $FlowFixMe

        attrib.split(' ').forEach(function (id) {
          inserted[id] = true;
        });

        if (node.parentNode !== container) {
          container.appendChild(node);
        }
      });
    }

    var _insert;

    if (isBrowser$1) {
      stylis.use(options.stylisPlugins)(ruleSheet);

      _insert = function insert(selector, serialized, sheet, shouldCache) {
        var name = serialized.name;
        Sheet.current = sheet;

        stylis(selector, serialized.styles);

        if (shouldCache) {
          cache.inserted[name] = true;
        }
      };
    } else {
      stylis.use(removeLabel);
      var serverStylisCache = rootServerStylisCache;

      if (options.stylisPlugins || options.prefix !== undefined) {
        stylis.use(options.stylisPlugins); // $FlowFixMe

        serverStylisCache = getServerStylisCache(options.stylisPlugins || rootServerStylisCache)(options.prefix);
      }

      var getRules = function getRules(selector, serialized) {
        var name = serialized.name;

        if (serverStylisCache[name] === undefined) {
          serverStylisCache[name] = stylis(selector, serialized.styles);
        }

        return serverStylisCache[name];
      };

      _insert = function _insert(selector, serialized, sheet, shouldCache) {
        var name = serialized.name;
        var rules = getRules(selector, serialized);

        if (cache.compat === undefined) {
          // in regular mode, we don't set the styles on the inserted cache
          // since we don't need to and that would be wasting memory
          // we return them so that they are rendered in a style tag
          if (shouldCache) {
            cache.inserted[name] = true;
          }

          return rules;
        } else {
          // in compat mode, we put the styles on the inserted cache so
          // that emotion-server can pull out the styles
          // except when we don't want to cache it which was in Global but now
          // is nowhere but we don't want to do a major right now
          // and just in case we're going to leave the case here
          // it's also not affecting client side bundle size
          // so it's really not a big deal
          if (shouldCache) {
            cache.inserted[name] = rules;
          } else {
            return rules;
          }
        }
      };
    }

    var cache = {
      key: key,
      sheet: new StyleSheet({
        key: key,
        container: container,
        nonce: options.nonce,
        speedy: options.speedy
      }),
      nonce: options.nonce,
      inserted: inserted,
      registered: {},
      insert: _insert
    };
    return cache;
  };

  var isBrowser$2 = typeof document !== 'undefined';
  function getRegisteredStyles(registered, registeredStyles, classNames) {
    var rawClassName = '';
    classNames.split(' ').forEach(function (className) {
      if (registered[className] !== undefined) {
        registeredStyles.push(registered[className]);
      } else {
        rawClassName += className + " ";
      }
    });
    return rawClassName;
  }
  var insertStyles = function insertStyles(cache, serialized, isStringTag) {
    var className = cache.key + "-" + serialized.name;

    if ( // we only need to add the styles to the registered cache if the
    // class name could be used further down
    // the tree but if it's a string tag, we know it won't
    // so we don't have to add it to registered cache.
    // this improves memory usage since we can avoid storing the whole style string
    (isStringTag === false || // we need to always store it if we're in compat mode and
    // in node since emotion-server relies on whether a style is in
    // the registered cache to know whether a style is global or not
    // also, note that this check will be dead code eliminated in the browser
    isBrowser$2 === false && cache.compat !== undefined) && cache.registered[className] === undefined) {
      cache.registered[className] = serialized.styles;
    }

    if (cache.inserted[serialized.name] === undefined) {
      var stylesForSSR = '';
      var current = serialized;

      do {
        var maybeStyles = cache.insert("." + className, current, cache.sheet, true);

        if (!isBrowser$2 && maybeStyles !== undefined) {
          stylesForSSR += maybeStyles;
        }

        current = current.next;
      } while (current !== undefined);

      if (!isBrowser$2 && stylesForSSR.length !== 0) {
        return stylesForSSR;
      }
    }
  };

  /* eslint-disable */
  // Inspired by https://github.com/garycourt/murmurhash-js
  // Ported from https://github.com/aappleby/smhasher/blob/61a0530f28277f2e850bfc39600ce61d02b518de/src/MurmurHash2.cpp#L37-L86
  function murmur2(str) {
    // 'm' and 'r' are mixing constants generated offline.
    // They're not really 'magic', they just happen to work well.
    // const m = 0x5bd1e995;
    // const r = 24;
    // Initialize the hash
    var h = 0; // Mix 4 bytes at a time into the hash

    var k,
        i = 0,
        len = str.length;

    for (; len >= 4; ++i, len -= 4) {
      k = str.charCodeAt(i) & 0xff | (str.charCodeAt(++i) & 0xff) << 8 | (str.charCodeAt(++i) & 0xff) << 16 | (str.charCodeAt(++i) & 0xff) << 24;
      k =
      /* Math.imul(k, m): */
      (k & 0xffff) * 0x5bd1e995 + ((k >>> 16) * 0xe995 << 16);
      k ^=
      /* k >>> r: */
      k >>> 24;
      h =
      /* Math.imul(k, m): */
      (k & 0xffff) * 0x5bd1e995 + ((k >>> 16) * 0xe995 << 16) ^
      /* Math.imul(h, m): */
      (h & 0xffff) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16);
    } // Handle the last few bytes of the input array


    switch (len) {
      case 3:
        h ^= (str.charCodeAt(i + 2) & 0xff) << 16;

      case 2:
        h ^= (str.charCodeAt(i + 1) & 0xff) << 8;

      case 1:
        h ^= str.charCodeAt(i) & 0xff;
        h =
        /* Math.imul(h, m): */
        (h & 0xffff) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16);
    } // Do a few final mixes of the hash to ensure the last few
    // bytes are well-incorporated.


    h ^= h >>> 13;
    h =
    /* Math.imul(h, m): */
    (h & 0xffff) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16);
    return ((h ^ h >>> 15) >>> 0).toString(36);
  }

  var unitless_cjs_prod = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: !0
  });

  var unitlessKeys = {
    animationIterationCount: 1,
    borderImageOutset: 1,
    borderImageSlice: 1,
    borderImageWidth: 1,
    boxFlex: 1,
    boxFlexGroup: 1,
    boxOrdinalGroup: 1,
    columnCount: 1,
    columns: 1,
    flex: 1,
    flexGrow: 1,
    flexPositive: 1,
    flexShrink: 1,
    flexNegative: 1,
    flexOrder: 1,
    gridRow: 1,
    gridRowEnd: 1,
    gridRowSpan: 1,
    gridRowStart: 1,
    gridColumn: 1,
    gridColumnEnd: 1,
    gridColumnSpan: 1,
    gridColumnStart: 1,
    msGridRow: 1,
    msGridRowSpan: 1,
    msGridColumn: 1,
    msGridColumnSpan: 1,
    fontWeight: 1,
    lineHeight: 1,
    opacity: 1,
    order: 1,
    orphans: 1,
    tabSize: 1,
    widows: 1,
    zIndex: 1,
    zoom: 1,
    WebkitLineClamp: 1,
    fillOpacity: 1,
    floodOpacity: 1,
    stopOpacity: 1,
    strokeDasharray: 1,
    strokeDashoffset: 1,
    strokeMiterlimit: 1,
    strokeOpacity: 1,
    strokeWidth: 1
  };

  exports.default = unitlessKeys;
  });

  unwrapExports(unitless_cjs_prod);

  var unitless_cjs = createCommonjsModule(function (module) {

  {
    module.exports = unitless_cjs_prod;
  }
  });

  function memoize(fn) {
    var cache = {};
    return function (arg) {
      if (cache[arg] === undefined) cache[arg] = fn(arg);
      return cache[arg];
    };
  }

  var hyphenateRegex = /[A-Z]|^ms/g;
  var animationRegex = /_EMO_([^_]+?)_([^]*?)_EMO_/g;

  var isCustomProperty = function isCustomProperty(property) {
    return property.charCodeAt(1) === 45;
  };

  var isProcessableValue = function isProcessableValue(value) {
    return value != null && typeof value !== 'boolean';
  };

  var processStyleName = memoize(function (styleName) {
    return isCustomProperty(styleName) ? styleName : styleName.replace(hyphenateRegex, '-$&').toLowerCase();
  });

  var processStyleValue = function processStyleValue(key, value) {
    switch (key) {
      case 'animation':
      case 'animationName':
        {
          if (typeof value === 'string') {
            return value.replace(animationRegex, function (match, p1, p2) {
              cursor = {
                name: p1,
                styles: p2,
                next: cursor
              };
              return p1;
            });
          }
        }
    }

    if (unitless_cjs[key] !== 1 && !isCustomProperty(key) && typeof value === 'number' && value !== 0) {
      return value + 'px';
    }

    return value;
  };

  function handleInterpolation(mergedProps, registered, interpolation, couldBeSelectorInterpolation) {
    if (interpolation == null) {
      return '';
    }

    if (interpolation.__emotion_styles !== undefined) {

      return interpolation;
    }

    switch (typeof interpolation) {
      case 'boolean':
        {
          return '';
        }

      case 'object':
        {
          if (interpolation.anim === 1) {
            cursor = {
              name: interpolation.name,
              styles: interpolation.styles,
              next: cursor
            };
            return interpolation.name;
          }

          if (interpolation.styles !== undefined) {
            var next = interpolation.next;

            if (next !== undefined) {
              // not the most efficient thing ever but this is a pretty rare case
              // and there will be very few iterations of this generally
              while (next !== undefined) {
                cursor = {
                  name: next.name,
                  styles: next.styles,
                  next: cursor
                };
                next = next.next;
              }
            }

            var styles = interpolation.styles + ";";

            return styles;
          }

          return createStringFromObject(mergedProps, registered, interpolation);
        }

      case 'function':
        {
          if (mergedProps !== undefined) {
            var previousCursor = cursor;
            var result = interpolation(mergedProps);
            cursor = previousCursor;
            return handleInterpolation(mergedProps, registered, result, couldBeSelectorInterpolation);
          }

          break;
        }
    } // finalize string values (regular strings and functions interpolated into css calls)


    if (registered == null) {
      return interpolation;
    }

    var cached = registered[interpolation];

    return cached !== undefined && !couldBeSelectorInterpolation ? cached : interpolation;
  }

  function createStringFromObject(mergedProps, registered, obj) {
    var string = '';

    if (Array.isArray(obj)) {
      for (var i = 0; i < obj.length; i++) {
        string += handleInterpolation(mergedProps, registered, obj[i], false);
      }
    } else {
      for (var _key in obj) {
        var value = obj[_key];

        if (typeof value !== 'object') {
          if (registered != null && registered[value] !== undefined) {
            string += _key + "{" + registered[value] + "}";
          } else if (isProcessableValue(value)) {
            string += processStyleName(_key) + ":" + processStyleValue(_key, value) + ";";
          }
        } else {
          if (_key === 'NO_COMPONENT_SELECTOR' && "production" !== 'production') {
            throw new Error('Component selectors can only be used in conjunction with babel-plugin-emotion.');
          }

          if (Array.isArray(value) && typeof value[0] === 'string' && (registered == null || registered[value[0]] === undefined)) {
            for (var _i = 0; _i < value.length; _i++) {
              if (isProcessableValue(value[_i])) {
                string += processStyleName(_key) + ":" + processStyleValue(_key, value[_i]) + ";";
              }
            }
          } else {
            var interpolated = handleInterpolation(mergedProps, registered, value, false);

            switch (_key) {
              case 'animation':
              case 'animationName':
                {
                  string += processStyleName(_key) + ":" + interpolated + ";";
                  break;
                }

              default:
                {

                  string += _key + "{" + interpolated + "}";
                }
            }
          }
        }
      }
    }

    return string;
  }

  var labelPattern = /label:\s*([^\s;\n{]+)\s*;/g;
  // keyframes are stored on the SerializedStyles object as a linked list


  var cursor;
  var serializeStyles = function serializeStyles(args, registered, mergedProps) {
    if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null && args[0].styles !== undefined) {
      return args[0];
    }

    var stringMode = true;
    var styles = '';
    cursor = undefined;
    var strings = args[0];

    if (strings == null || strings.raw === undefined) {
      stringMode = false;
      styles += handleInterpolation(mergedProps, registered, strings, false);
    } else {

      styles += strings[0];
    } // we start at 1 since we've already handled the first arg


    for (var i = 1; i < args.length; i++) {
      styles += handleInterpolation(mergedProps, registered, args[i], styles.charCodeAt(styles.length - 1) === 46);

      if (stringMode) {

        styles += strings[i];
      }
    }


    labelPattern.lastIndex = 0;
    var identifierName = '';
    var match; // https://esbench.com/bench/5b809c2cf2949800a0f61fb5

    while ((match = labelPattern.exec(styles)) !== null) {
      identifierName += '-' + // $FlowFixMe we know it's not null
      match[1];
    }

    var name = murmur2(styles) + identifierName;

    return {
      name: name,
      styles: styles,
      next: cursor
    };
  };

  var isBrowser$3 = typeof document !== 'undefined';
  var hasOwnProperty$1 = Object.prototype.hasOwnProperty;

  var EmotionCacheContext = /*#__PURE__*/react_2( // we're doing this to avoid preconstruct's dead code elimination in this one case
  // because this module is primarily intended for the browser and node
  // but it's also required in react native and similar environments sometimes
  // and we could have a special build just for that
  // but this is much easier and the native packages
  // might use a different theme context in the future anyway
  typeof HTMLElement !== 'undefined' ? createCache() : null);
  var ThemeContext = /*#__PURE__*/react_2({});
  var CacheProvider = EmotionCacheContext.Provider;

  var withEmotionCache = function withEmotionCache(func) {
    var render = function render(props, ref) {
      return /*#__PURE__*/react_5(EmotionCacheContext.Consumer, null, function (cache) {
        return func(props, cache, ref);
      });
    }; // $FlowFixMe


    return /*#__PURE__*/react_6(render);
  };

  if (!isBrowser$3) {
    var BasicProvider = /*#__PURE__*/function (_React$Component) {
      _inheritsLoose(BasicProvider, _React$Component);

      function BasicProvider(props, context, updater) {
        var _this;

        _this = _React$Component.call(this, props, context, updater) || this;
        _this.state = {
          value: createCache()
        };
        return _this;
      }

      var _proto = BasicProvider.prototype;

      _proto.render = function render() {
        return /*#__PURE__*/react_5(EmotionCacheContext.Provider, this.state, this.props.children(this.state.value));
      };

      return BasicProvider;
    }(react_4);

    withEmotionCache = function withEmotionCache(func) {
      return function (props) {
        return /*#__PURE__*/react_5(EmotionCacheContext.Consumer, null, function (context) {
          if (context === null) {
            return /*#__PURE__*/react_5(BasicProvider, null, function (newContext) {
              return func(props, newContext);
            });
          } else {
            return func(props, context);
          }
        });
      };
    };
  }

  var typePropName = '__EMOTION_TYPE_PLEASE_DO_NOT_USE__';
  var createEmotionProps = function createEmotionProps(type, props) {

    var newProps = {};

    for (var key in props) {
      if (hasOwnProperty$1.call(props, key)) {
        newProps[key] = props[key];
      }
    }

    newProps[typePropName] = type; // TODO: check if this still works with all of those different JSX functions

    return newProps;
  };

  var Noop = function Noop() {
    return null;
  };

  var render = function render(cache, props, theme, ref) {
    var cssProp = theme === null ? props.css : props.css(theme); // so that using `css` from `emotion` and passing the result to the css prop works
    // not passing the registered cache to serializeStyles because it would
    // make certain babel optimisations not possible

    if (typeof cssProp === 'string' && cache.registered[cssProp] !== undefined) {
      cssProp = cache.registered[cssProp];
    }

    var type = props[typePropName];
    var registeredStyles = [cssProp];
    var className = '';

    if (typeof props.className === 'string') {
      className = getRegisteredStyles(cache.registered, registeredStyles, props.className);
    } else if (props.className != null) {
      className = props.className + " ";
    }

    var serialized = serializeStyles(registeredStyles);

    var rules = insertStyles(cache, serialized, typeof type === 'string');
    className += cache.key + "-" + serialized.name;
    var newProps = {};

    for (var key in props) {
      if (hasOwnProperty$1.call(props, key) && key !== 'css' && key !== typePropName && ("production" === 'production' )) {
        newProps[key] = props[key];
      }
    }

    newProps.ref = ref;
    newProps.className = className;
    var ele = /*#__PURE__*/react_5(type, newProps);
    var possiblyStyleElement = /*#__PURE__*/react_5(Noop, null);

    if (!isBrowser$3 && rules !== undefined) {
      var _ref;

      var serializedNames = serialized.name;
      var next = serialized.next;

      while (next !== undefined) {
        serializedNames += ' ' + next.name;
        next = next.next;
      }

      possiblyStyleElement = /*#__PURE__*/react_5("style", (_ref = {}, _ref["data-emotion-" + cache.key] = serializedNames, _ref.dangerouslySetInnerHTML = {
        __html: rules
      }, _ref.nonce = cache.sheet.nonce, _ref));
    } // Need to return the same number of siblings or else `React.useId` will cause hydration mismatches.


    return /*#__PURE__*/react_5(react_7, null, possiblyStyleElement, ele);
  }; // eslint-disable-next-line no-undef


  var Emotion = /* #__PURE__ */withEmotionCache(function (props, cache, ref) {
    if (typeof props.css === 'function') {
      return /*#__PURE__*/react_5(ThemeContext.Consumer, null, function (theme) {
        return render(cache, props, theme, ref);
      });
    }

    return render(cache, props, null, ref);
  });

  function css() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return serializeStyles(args);
  }

  var jsx = function jsx(type, props) {
    var args = arguments;

    if (props == null || !hasOwnProperty$1.call(props, 'css')) {
      // $FlowFixMe
      return react_5.apply(undefined, args);
    }

    var argsLength = args.length;
    var createElementArgArray = new Array(argsLength);
    createElementArgArray[0] = Emotion;
    createElementArgArray[1] = createEmotionProps(type, props);

    for (var i = 2; i < argsLength; i++) {
      createElementArgArray[i] = args[i];
    } // $FlowFixMe


    return react_5.apply(null, createElementArgArray);
  };

  var classnames = function classnames(args) {
    var len = args.length;
    var i = 0;
    var cls = '';

    for (; i < len; i++) {
      var arg = args[i];
      if (arg == null) continue;
      var toAdd = void 0;

      switch (typeof arg) {
        case 'boolean':
          break;

        case 'object':
          {
            if (Array.isArray(arg)) {
              toAdd = classnames(arg);
            } else {
              toAdd = '';

              for (var k in arg) {
                if (arg[k] && k) {
                  toAdd && (toAdd += ' ');
                  toAdd += k;
                }
              }
            }

            break;
          }

        default:
          {
            toAdd = arg;
          }
      }

      if (toAdd) {
        cls && (cls += ' ');
        cls += toAdd;
      }
    }

    return cls;
  };

  function merge(registered, css, className) {
    var registeredStyles = [];
    var rawClassName = getRegisteredStyles(registered, registeredStyles, className);

    if (registeredStyles.length < 2) {
      return className;
    }

    return rawClassName + css(registeredStyles);
  }

  var Noop$1 = function Noop() {
    return null;
  };

  var ClassNames = withEmotionCache(function (props, context) {
    return /*#__PURE__*/react_5(ThemeContext.Consumer, null, function (theme) {
      var rules = '';
      var serializedHashes = '';
      var hasRendered = false;

      var css = function css() {
        if (hasRendered && "production" !== 'production') {
          throw new Error('css can only be used during render');
        }

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var serialized = serializeStyles(args, context.registered);

        if (isBrowser$3) {
          insertStyles(context, serialized, false);
        } else {
          var res = insertStyles(context, serialized, false);

          if (res !== undefined) {
            rules += res;
          }
        }

        if (!isBrowser$3) {
          serializedHashes += " " + serialized.name;
        }

        return context.key + "-" + serialized.name;
      };

      var cx = function cx() {
        if (hasRendered && "production" !== 'production') {
          throw new Error('cx can only be used during render');
        }

        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        return merge(context.registered, css, classnames(args));
      };

      var content = {
        css: css,
        cx: cx,
        theme: theme
      };
      var ele = props.children(content);
      hasRendered = true;
      var possiblyStyleElement = /*#__PURE__*/react_5(Noop$1, null);

      if (!isBrowser$3 && rules.length !== 0) {
        var _ref;

        possiblyStyleElement = /*#__PURE__*/react_5("style", (_ref = {}, _ref["data-emotion-" + context.key] = serializedHashes.substring(1), _ref.dangerouslySetInnerHTML = {
          __html: rules
        }, _ref.nonce = context.sheet.nonce, _ref));
      } // Need to return the same number of siblings or else `React.useId` will cause hydration mismatches.


      return /*#__PURE__*/react_5(react_7, null, possiblyStyleElement, ele);
    });
  });

  var scheduler_production_min = createCommonjsModule(function (module, exports) {
  var f,g,h,k;if("object"===typeof performance&&"function"===typeof performance.now){var l=performance;exports.unstable_now=function(){return l.now()};}else {var p=Date,q=p.now();exports.unstable_now=function(){return p.now()-q};}
  if("undefined"===typeof window||"function"!==typeof MessageChannel){var t=null,u=null,w=function(){if(null!==t)try{var a=exports.unstable_now();t(!0,a);t=null;}catch(b){throw setTimeout(w,0),b;}};f=function(a){null!==t?setTimeout(f,0,a):(t=a,setTimeout(w,0));};g=function(a,b){u=setTimeout(a,b);};h=function(){clearTimeout(u);};exports.unstable_shouldYield=function(){return !1};k=exports.unstable_forceFrameRate=function(){};}else {var x=window.setTimeout,y=window.clearTimeout;if("undefined"!==typeof console){var z=
  window.cancelAnimationFrame;"function"!==typeof window.requestAnimationFrame&&console.error("This browser doesn't support requestAnimationFrame. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills");"function"!==typeof z&&console.error("This browser doesn't support cancelAnimationFrame. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills");}var A=!1,B=null,C=-1,D=5,E=0;exports.unstable_shouldYield=function(){return exports.unstable_now()>=
  E};k=function(){};exports.unstable_forceFrameRate=function(a){0>a||125<a?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):D=0<a?Math.floor(1E3/a):5;};var F=new MessageChannel,G=F.port2;F.port1.onmessage=function(){if(null!==B){var a=exports.unstable_now();E=a+D;try{B(!0,a)?G.postMessage(null):(A=!1,B=null);}catch(b){throw G.postMessage(null),b;}}else A=!1;};f=function(a){B=a;A||(A=!0,G.postMessage(null));};g=function(a,b){C=
  x(function(){a(exports.unstable_now());},b);};h=function(){y(C);C=-1;};}function H(a,b){var c=a.length;a.push(b);a:for(;;){var d=c-1>>>1,e=a[d];if(void 0!==e&&0<I(e,b))a[d]=b,a[c]=e,c=d;else break a}}function J(a){a=a[0];return void 0===a?null:a}
  function K(a){var b=a[0];if(void 0!==b){var c=a.pop();if(c!==b){a[0]=c;a:for(var d=0,e=a.length;d<e;){var m=2*(d+1)-1,n=a[m],v=m+1,r=a[v];if(void 0!==n&&0>I(n,c))void 0!==r&&0>I(r,n)?(a[d]=r,a[v]=c,d=v):(a[d]=n,a[m]=c,d=m);else if(void 0!==r&&0>I(r,c))a[d]=r,a[v]=c,d=v;else break a}}return b}return null}function I(a,b){var c=a.sortIndex-b.sortIndex;return 0!==c?c:a.id-b.id}var L=[],M=[],N=1,O=null,P=3,Q=!1,R=!1,S=!1;
  function T(a){for(var b=J(M);null!==b;){if(null===b.callback)K(M);else if(b.startTime<=a)K(M),b.sortIndex=b.expirationTime,H(L,b);else break;b=J(M);}}function U(a){S=!1;T(a);if(!R)if(null!==J(L))R=!0,f(V);else {var b=J(M);null!==b&&g(U,b.startTime-a);}}
  function V(a,b){R=!1;S&&(S=!1,h());Q=!0;var c=P;try{T(b);for(O=J(L);null!==O&&(!(O.expirationTime>b)||a&&!exports.unstable_shouldYield());){var d=O.callback;if("function"===typeof d){O.callback=null;P=O.priorityLevel;var e=d(O.expirationTime<=b);b=exports.unstable_now();"function"===typeof e?O.callback=e:O===J(L)&&K(L);T(b);}else K(L);O=J(L);}if(null!==O)var m=!0;else {var n=J(M);null!==n&&g(U,n.startTime-b);m=!1;}return m}finally{O=null,P=c,Q=!1;}}var W=k;exports.unstable_IdlePriority=5;
  exports.unstable_ImmediatePriority=1;exports.unstable_LowPriority=4;exports.unstable_NormalPriority=3;exports.unstable_Profiling=null;exports.unstable_UserBlockingPriority=2;exports.unstable_cancelCallback=function(a){a.callback=null;};exports.unstable_continueExecution=function(){R||Q||(R=!0,f(V));};exports.unstable_getCurrentPriorityLevel=function(){return P};exports.unstable_getFirstCallbackNode=function(){return J(L)};
  exports.unstable_next=function(a){switch(P){case 1:case 2:case 3:var b=3;break;default:b=P;}var c=P;P=b;try{return a()}finally{P=c;}};exports.unstable_pauseExecution=function(){};exports.unstable_requestPaint=W;exports.unstable_runWithPriority=function(a,b){switch(a){case 1:case 2:case 3:case 4:case 5:break;default:a=3;}var c=P;P=a;try{return b()}finally{P=c;}};
  exports.unstable_scheduleCallback=function(a,b,c){var d=exports.unstable_now();"object"===typeof c&&null!==c?(c=c.delay,c="number"===typeof c&&0<c?d+c:d):c=d;switch(a){case 1:var e=-1;break;case 2:e=250;break;case 5:e=1073741823;break;case 4:e=1E4;break;default:e=5E3;}e=c+e;a={id:N++,callback:b,priorityLevel:a,startTime:c,expirationTime:e,sortIndex:-1};c>d?(a.sortIndex=c,H(M,a),null===J(L)&&a===J(M)&&(S?h():S=!0,g(U,c-d))):(a.sortIndex=e,H(L,a),R||Q||(R=!0,f(V)));return a};
  exports.unstable_wrapCallback=function(a){var b=P;return function(){var c=P;P=b;try{return a.apply(this,arguments)}finally{P=c;}}};
  });
  var scheduler_production_min_1 = scheduler_production_min.unstable_now;
  var scheduler_production_min_2 = scheduler_production_min.unstable_shouldYield;
  var scheduler_production_min_3 = scheduler_production_min.unstable_forceFrameRate;
  var scheduler_production_min_4 = scheduler_production_min.unstable_IdlePriority;
  var scheduler_production_min_5 = scheduler_production_min.unstable_ImmediatePriority;
  var scheduler_production_min_6 = scheduler_production_min.unstable_LowPriority;
  var scheduler_production_min_7 = scheduler_production_min.unstable_NormalPriority;
  var scheduler_production_min_8 = scheduler_production_min.unstable_Profiling;
  var scheduler_production_min_9 = scheduler_production_min.unstable_UserBlockingPriority;
  var scheduler_production_min_10 = scheduler_production_min.unstable_cancelCallback;
  var scheduler_production_min_11 = scheduler_production_min.unstable_continueExecution;
  var scheduler_production_min_12 = scheduler_production_min.unstable_getCurrentPriorityLevel;
  var scheduler_production_min_13 = scheduler_production_min.unstable_getFirstCallbackNode;
  var scheduler_production_min_14 = scheduler_production_min.unstable_next;
  var scheduler_production_min_15 = scheduler_production_min.unstable_pauseExecution;
  var scheduler_production_min_16 = scheduler_production_min.unstable_requestPaint;
  var scheduler_production_min_17 = scheduler_production_min.unstable_runWithPriority;
  var scheduler_production_min_18 = scheduler_production_min.unstable_scheduleCallback;
  var scheduler_production_min_19 = scheduler_production_min.unstable_wrapCallback;

  var scheduler = createCommonjsModule(function (module) {

  {
    module.exports = scheduler_production_min;
  }
  });

  function y(a){for(var b="https://reactjs.org/docs/error-decoder.html?invariant="+a,c=1;c<arguments.length;c++)b+="&args[]="+encodeURIComponent(arguments[c]);return "Minified React error #"+a+"; visit "+b+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}if(!react)throw Error(y(227));var ba=new Set,ca={};function da(a,b){ea(a,b);ea(a+"Capture",b);}
  function ea(a,b){ca[a]=b;for(a=0;a<b.length;a++)ba.add(b[a]);}
  var fa=!("undefined"===typeof window||"undefined"===typeof window.document||"undefined"===typeof window.document.createElement),ha=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,ia=Object.prototype.hasOwnProperty,
  ja={},ka={};function la(a){if(ia.call(ka,a))return !0;if(ia.call(ja,a))return !1;if(ha.test(a))return ka[a]=!0;ja[a]=!0;return !1}function ma(a,b,c,d){if(null!==c&&0===c.type)return !1;switch(typeof b){case "function":case "symbol":return !0;case "boolean":if(d)return !1;if(null!==c)return !c.acceptsBooleans;a=a.toLowerCase().slice(0,5);return "data-"!==a&&"aria-"!==a;default:return !1}}
  function na(a,b,c,d){if(null===b||"undefined"===typeof b||ma(a,b,c,d))return !0;if(d)return !1;if(null!==c)switch(c.type){case 3:return !b;case 4:return !1===b;case 5:return isNaN(b);case 6:return isNaN(b)||1>b}return !1}function B(a,b,c,d,e,f,g){this.acceptsBooleans=2===b||3===b||4===b;this.attributeName=d;this.attributeNamespace=e;this.mustUseProperty=c;this.propertyName=a;this.type=b;this.sanitizeURL=f;this.removeEmptyString=g;}var D={};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a){D[a]=new B(a,0,!1,a,null,!1,!1);});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(a){var b=a[0];D[b]=new B(b,1,!1,a[1],null,!1,!1);});["contentEditable","draggable","spellCheck","value"].forEach(function(a){D[a]=new B(a,2,!1,a.toLowerCase(),null,!1,!1);});
  ["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(a){D[a]=new B(a,2,!1,a,null,!1,!1);});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a){D[a]=new B(a,3,!1,a.toLowerCase(),null,!1,!1);});
  ["checked","multiple","muted","selected"].forEach(function(a){D[a]=new B(a,3,!0,a,null,!1,!1);});["capture","download"].forEach(function(a){D[a]=new B(a,4,!1,a,null,!1,!1);});["cols","rows","size","span"].forEach(function(a){D[a]=new B(a,6,!1,a,null,!1,!1);});["rowSpan","start"].forEach(function(a){D[a]=new B(a,5,!1,a.toLowerCase(),null,!1,!1);});var oa=/[\-:]([a-z])/g;function pa(a){return a[1].toUpperCase()}
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a){var b=a.replace(oa,
  pa);D[b]=new B(b,1,!1,a,null,!1,!1);});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a){var b=a.replace(oa,pa);D[b]=new B(b,1,!1,a,"http://www.w3.org/1999/xlink",!1,!1);});["xml:base","xml:lang","xml:space"].forEach(function(a){var b=a.replace(oa,pa);D[b]=new B(b,1,!1,a,"http://www.w3.org/XML/1998/namespace",!1,!1);});["tabIndex","crossOrigin"].forEach(function(a){D[a]=new B(a,1,!1,a.toLowerCase(),null,!1,!1);});
  D.xlinkHref=new B("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(a){D[a]=new B(a,1,!1,a.toLowerCase(),null,!0,!0);});
  function qa(a,b,c,d){var e=D.hasOwnProperty(b)?D[b]:null;var f=null!==e?0===e.type:d?!1:!(2<b.length)||"o"!==b[0]&&"O"!==b[0]||"n"!==b[1]&&"N"!==b[1]?!1:!0;f||(na(b,c,e,d)&&(c=null),d||null===e?la(b)&&(null===c?a.removeAttribute(b):a.setAttribute(b,""+c)):e.mustUseProperty?a[e.propertyName]=null===c?3===e.type?!1:"":c:(b=e.attributeName,d=e.attributeNamespace,null===c?a.removeAttribute(b):(e=e.type,c=3===e||4===e&&!0===c?"":""+c,d?a.setAttributeNS(d,b,c):a.setAttribute(b,c))));}
  var ra=react.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,sa=60103,ta=60106,ua=60107,wa=60108,xa=60114,ya=60109,za=60110,Aa=60112,Ba=60113,Ca=60120,Da=60115,Ea=60116,Fa=60121,Ga=60128,Ha=60129,Ia=60130,Ja=60131;
  if("function"===typeof Symbol&&Symbol.for){var E=Symbol.for;sa=E("react.element");ta=E("react.portal");ua=E("react.fragment");wa=E("react.strict_mode");xa=E("react.profiler");ya=E("react.provider");za=E("react.context");Aa=E("react.forward_ref");Ba=E("react.suspense");Ca=E("react.suspense_list");Da=E("react.memo");Ea=E("react.lazy");Fa=E("react.block");E("react.scope");Ga=E("react.opaque.id");Ha=E("react.debug_trace_mode");Ia=E("react.offscreen");Ja=E("react.legacy_hidden");}
  var Ka="function"===typeof Symbol&&Symbol.iterator;function La(a){if(null===a||"object"!==typeof a)return null;a=Ka&&a[Ka]||a["@@iterator"];return "function"===typeof a?a:null}var Ma;function Na(a){if(void 0===Ma)try{throw Error();}catch(c){var b=c.stack.trim().match(/\n( *(at )?)/);Ma=b&&b[1]||"";}return "\n"+Ma+a}var Oa=!1;
  function Pa(a,b){if(!a||Oa)return "";Oa=!0;var c=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(b)if(b=function(){throw Error();},Object.defineProperty(b.prototype,"props",{set:function(){throw Error();}}),"object"===typeof Reflect&&Reflect.construct){try{Reflect.construct(b,[]);}catch(k){var d=k;}Reflect.construct(a,[],b);}else {try{b.call();}catch(k){d=k;}a.call(b.prototype);}else {try{throw Error();}catch(k){d=k;}a();}}catch(k){if(k&&d&&"string"===typeof k.stack){for(var e=k.stack.split("\n"),
  f=d.stack.split("\n"),g=e.length-1,h=f.length-1;1<=g&&0<=h&&e[g]!==f[h];)h--;for(;1<=g&&0<=h;g--,h--)if(e[g]!==f[h]){if(1!==g||1!==h){do if(g--,h--,0>h||e[g]!==f[h])return "\n"+e[g].replace(" at new "," at ");while(1<=g&&0<=h)}break}}}finally{Oa=!1,Error.prepareStackTrace=c;}return (a=a?a.displayName||a.name:"")?Na(a):""}
  function Qa(a){switch(a.tag){case 5:return Na(a.type);case 16:return Na("Lazy");case 13:return Na("Suspense");case 19:return Na("SuspenseList");case 0:case 2:case 15:return a=Pa(a.type,!1),a;case 11:return a=Pa(a.type.render,!1),a;case 22:return a=Pa(a.type._render,!1),a;case 1:return a=Pa(a.type,!0),a;default:return ""}}
  function Ra(a){if(null==a)return null;if("function"===typeof a)return a.displayName||a.name||null;if("string"===typeof a)return a;switch(a){case ua:return "Fragment";case ta:return "Portal";case xa:return "Profiler";case wa:return "StrictMode";case Ba:return "Suspense";case Ca:return "SuspenseList"}if("object"===typeof a)switch(a.$$typeof){case za:return (a.displayName||"Context")+".Consumer";case ya:return (a._context.displayName||"Context")+".Provider";case Aa:var b=a.render;b=b.displayName||b.name||"";
  return a.displayName||(""!==b?"ForwardRef("+b+")":"ForwardRef");case Da:return Ra(a.type);case Fa:return Ra(a._render);case Ea:b=a._payload;a=a._init;try{return Ra(a(b))}catch(c){}}return null}function Sa(a){switch(typeof a){case "boolean":case "number":case "object":case "string":case "undefined":return a;default:return ""}}function Ta(a){var b=a.type;return (a=a.nodeName)&&"input"===a.toLowerCase()&&("checkbox"===b||"radio"===b)}
  function Ua(a){var b=Ta(a)?"checked":"value",c=Object.getOwnPropertyDescriptor(a.constructor.prototype,b),d=""+a[b];if(!a.hasOwnProperty(b)&&"undefined"!==typeof c&&"function"===typeof c.get&&"function"===typeof c.set){var e=c.get,f=c.set;Object.defineProperty(a,b,{configurable:!0,get:function(){return e.call(this)},set:function(a){d=""+a;f.call(this,a);}});Object.defineProperty(a,b,{enumerable:c.enumerable});return {getValue:function(){return d},setValue:function(a){d=""+a;},stopTracking:function(){a._valueTracker=
  null;delete a[b];}}}}function Va(a){a._valueTracker||(a._valueTracker=Ua(a));}function Wa(a){if(!a)return !1;var b=a._valueTracker;if(!b)return !0;var c=b.getValue();var d="";a&&(d=Ta(a)?a.checked?"true":"false":a.value);a=d;return a!==c?(b.setValue(a),!0):!1}function Xa(a){a=a||("undefined"!==typeof document?document:void 0);if("undefined"===typeof a)return null;try{return a.activeElement||a.body}catch(b){return a.body}}
  function Ya(a,b){var c=b.checked;return objectAssign({},b,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:null!=c?c:a._wrapperState.initialChecked})}function Za(a,b){var c=null==b.defaultValue?"":b.defaultValue,d=null!=b.checked?b.checked:b.defaultChecked;c=Sa(null!=b.value?b.value:c);a._wrapperState={initialChecked:d,initialValue:c,controlled:"checkbox"===b.type||"radio"===b.type?null!=b.checked:null!=b.value};}function $a(a,b){b=b.checked;null!=b&&qa(a,"checked",b,!1);}
  function ab(a,b){$a(a,b);var c=Sa(b.value),d=b.type;if(null!=c)if("number"===d){if(0===c&&""===a.value||a.value!=c)a.value=""+c;}else a.value!==""+c&&(a.value=""+c);else if("submit"===d||"reset"===d){a.removeAttribute("value");return}b.hasOwnProperty("value")?bb(a,b.type,c):b.hasOwnProperty("defaultValue")&&bb(a,b.type,Sa(b.defaultValue));null==b.checked&&null!=b.defaultChecked&&(a.defaultChecked=!!b.defaultChecked);}
  function cb(a,b,c){if(b.hasOwnProperty("value")||b.hasOwnProperty("defaultValue")){var d=b.type;if(!("submit"!==d&&"reset"!==d||void 0!==b.value&&null!==b.value))return;b=""+a._wrapperState.initialValue;c||b===a.value||(a.value=b);a.defaultValue=b;}c=a.name;""!==c&&(a.name="");a.defaultChecked=!!a._wrapperState.initialChecked;""!==c&&(a.name=c);}
  function bb(a,b,c){if("number"!==b||Xa(a.ownerDocument)!==a)null==c?a.defaultValue=""+a._wrapperState.initialValue:a.defaultValue!==""+c&&(a.defaultValue=""+c);}function db(a){var b="";react.Children.forEach(a,function(a){null!=a&&(b+=a);});return b}function eb(a,b){a=objectAssign({children:void 0},b);if(b=db(b.children))a.children=b;return a}
  function fb(a,b,c,d){a=a.options;if(b){b={};for(var e=0;e<c.length;e++)b["$"+c[e]]=!0;for(c=0;c<a.length;c++)e=b.hasOwnProperty("$"+a[c].value),a[c].selected!==e&&(a[c].selected=e),e&&d&&(a[c].defaultSelected=!0);}else {c=""+Sa(c);b=null;for(e=0;e<a.length;e++){if(a[e].value===c){a[e].selected=!0;d&&(a[e].defaultSelected=!0);return}null!==b||a[e].disabled||(b=a[e]);}null!==b&&(b.selected=!0);}}
  function gb(a,b){if(null!=b.dangerouslySetInnerHTML)throw Error(y(91));return objectAssign({},b,{value:void 0,defaultValue:void 0,children:""+a._wrapperState.initialValue})}function hb(a,b){var c=b.value;if(null==c){c=b.children;b=b.defaultValue;if(null!=c){if(null!=b)throw Error(y(92));if(Array.isArray(c)){if(!(1>=c.length))throw Error(y(93));c=c[0];}b=c;}null==b&&(b="");c=b;}a._wrapperState={initialValue:Sa(c)};}
  function ib(a,b){var c=Sa(b.value),d=Sa(b.defaultValue);null!=c&&(c=""+c,c!==a.value&&(a.value=c),null==b.defaultValue&&a.defaultValue!==c&&(a.defaultValue=c));null!=d&&(a.defaultValue=""+d);}function jb(a){var b=a.textContent;b===a._wrapperState.initialValue&&""!==b&&null!==b&&(a.value=b);}var kb={html:"http://www.w3.org/1999/xhtml",mathml:"http://www.w3.org/1998/Math/MathML",svg:"http://www.w3.org/2000/svg"};
  function lb(a){switch(a){case "svg":return "http://www.w3.org/2000/svg";case "math":return "http://www.w3.org/1998/Math/MathML";default:return "http://www.w3.org/1999/xhtml"}}function mb(a,b){return null==a||"http://www.w3.org/1999/xhtml"===a?lb(b):"http://www.w3.org/2000/svg"===a&&"foreignObject"===b?"http://www.w3.org/1999/xhtml":a}
  var nb,ob=function(a){return "undefined"!==typeof MSApp&&MSApp.execUnsafeLocalFunction?function(b,c,d,e){MSApp.execUnsafeLocalFunction(function(){return a(b,c,d,e)});}:a}(function(a,b){if(a.namespaceURI!==kb.svg||"innerHTML"in a)a.innerHTML=b;else {nb=nb||document.createElement("div");nb.innerHTML="<svg>"+b.valueOf().toString()+"</svg>";for(b=nb.firstChild;a.firstChild;)a.removeChild(a.firstChild);for(;b.firstChild;)a.appendChild(b.firstChild);}});
  function pb(a,b){if(b){var c=a.firstChild;if(c&&c===a.lastChild&&3===c.nodeType){c.nodeValue=b;return}}a.textContent=b;}
  var qb={animationIterationCount:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,
  floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},rb=["Webkit","ms","Moz","O"];Object.keys(qb).forEach(function(a){rb.forEach(function(b){b=b+a.charAt(0).toUpperCase()+a.substring(1);qb[b]=qb[a];});});function sb(a,b,c){return null==b||"boolean"===typeof b||""===b?"":c||"number"!==typeof b||0===b||qb.hasOwnProperty(a)&&qb[a]?(""+b).trim():b+"px"}
  function tb(a,b){a=a.style;for(var c in b)if(b.hasOwnProperty(c)){var d=0===c.indexOf("--"),e=sb(c,b[c],d);"float"===c&&(c="cssFloat");d?a.setProperty(c,e):a[c]=e;}}var ub=objectAssign({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});
  function vb(a,b){if(b){if(ub[a]&&(null!=b.children||null!=b.dangerouslySetInnerHTML))throw Error(y(137,a));if(null!=b.dangerouslySetInnerHTML){if(null!=b.children)throw Error(y(60));if(!("object"===typeof b.dangerouslySetInnerHTML&&"__html"in b.dangerouslySetInnerHTML))throw Error(y(61));}if(null!=b.style&&"object"!==typeof b.style)throw Error(y(62));}}
  function wb(a,b){if(-1===a.indexOf("-"))return "string"===typeof b.is;switch(a){case "annotation-xml":case "color-profile":case "font-face":case "font-face-src":case "font-face-uri":case "font-face-format":case "font-face-name":case "missing-glyph":return !1;default:return !0}}function xb(a){a=a.target||a.srcElement||window;a.correspondingUseElement&&(a=a.correspondingUseElement);return 3===a.nodeType?a.parentNode:a}var yb=null,zb=null,Ab=null;
  function Bb(a){if(a=Cb(a)){if("function"!==typeof yb)throw Error(y(280));var b=a.stateNode;b&&(b=Db(b),yb(a.stateNode,a.type,b));}}function Eb(a){zb?Ab?Ab.push(a):Ab=[a]:zb=a;}function Fb(){if(zb){var a=zb,b=Ab;Ab=zb=null;Bb(a);if(b)for(a=0;a<b.length;a++)Bb(b[a]);}}function Gb(a,b){return a(b)}function Hb(a,b,c,d,e){return a(b,c,d,e)}function Ib(){}var Jb=Gb,Kb=!1,Lb=!1;function Mb(){if(null!==zb||null!==Ab)Ib(),Fb();}
  function Nb(a,b,c){if(Lb)return a(b,c);Lb=!0;try{return Jb(a,b,c)}finally{Lb=!1,Mb();}}
  function Ob(a,b){var c=a.stateNode;if(null===c)return null;var d=Db(c);if(null===d)return null;c=d[b];a:switch(b){case "onClick":case "onClickCapture":case "onDoubleClick":case "onDoubleClickCapture":case "onMouseDown":case "onMouseDownCapture":case "onMouseMove":case "onMouseMoveCapture":case "onMouseUp":case "onMouseUpCapture":case "onMouseEnter":(d=!d.disabled)||(a=a.type,d=!("button"===a||"input"===a||"select"===a||"textarea"===a));a=!d;break a;default:a=!1;}if(a)return null;if(c&&"function"!==
  typeof c)throw Error(y(231,b,typeof c));return c}var Pb=!1;if(fa)try{var Qb={};Object.defineProperty(Qb,"passive",{get:function(){Pb=!0;}});window.addEventListener("test",Qb,Qb);window.removeEventListener("test",Qb,Qb);}catch(a){Pb=!1;}function Rb(a,b,c,d,e,f,g,h,k){var l=Array.prototype.slice.call(arguments,3);try{b.apply(c,l);}catch(n){this.onError(n);}}var Sb=!1,Tb=null,Ub=!1,Vb=null,Wb={onError:function(a){Sb=!0;Tb=a;}};function Xb(a,b,c,d,e,f,g,h,k){Sb=!1;Tb=null;Rb.apply(Wb,arguments);}
  function Yb(a,b,c,d,e,f,g,h,k){Xb.apply(this,arguments);if(Sb){if(Sb){var l=Tb;Sb=!1;Tb=null;}else throw Error(y(198));Ub||(Ub=!0,Vb=l);}}function Zb(a){var b=a,c=a;if(a.alternate)for(;b.return;)b=b.return;else {a=b;do b=a,0!==(b.flags&1026)&&(c=b.return),a=b.return;while(a)}return 3===b.tag?c:null}function $b(a){if(13===a.tag){var b=a.memoizedState;null===b&&(a=a.alternate,null!==a&&(b=a.memoizedState));if(null!==b)return b.dehydrated}return null}function ac(a){if(Zb(a)!==a)throw Error(y(188));}
  function bc(a){var b=a.alternate;if(!b){b=Zb(a);if(null===b)throw Error(y(188));return b!==a?null:a}for(var c=a,d=b;;){var e=c.return;if(null===e)break;var f=e.alternate;if(null===f){d=e.return;if(null!==d){c=d;continue}break}if(e.child===f.child){for(f=e.child;f;){if(f===c)return ac(e),a;if(f===d)return ac(e),b;f=f.sibling;}throw Error(y(188));}if(c.return!==d.return)c=e,d=f;else {for(var g=!1,h=e.child;h;){if(h===c){g=!0;c=e;d=f;break}if(h===d){g=!0;d=e;c=f;break}h=h.sibling;}if(!g){for(h=f.child;h;){if(h===
  c){g=!0;c=f;d=e;break}if(h===d){g=!0;d=f;c=e;break}h=h.sibling;}if(!g)throw Error(y(189));}}if(c.alternate!==d)throw Error(y(190));}if(3!==c.tag)throw Error(y(188));return c.stateNode.current===c?a:b}function cc(a){a=bc(a);if(!a)return null;for(var b=a;;){if(5===b.tag||6===b.tag)return b;if(b.child)b.child.return=b,b=b.child;else {if(b===a)break;for(;!b.sibling;){if(!b.return||b.return===a)return null;b=b.return;}b.sibling.return=b.return;b=b.sibling;}}return null}
  function dc(a,b){for(var c=a.alternate;null!==b;){if(b===a||b===c)return !0;b=b.return;}return !1}var ec,fc,gc,hc,ic=!1,jc=[],kc=null,lc=null,mc=null,nc=new Map,oc=new Map,pc=[],qc="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function rc(a,b,c,d,e){return {blockedOn:a,domEventName:b,eventSystemFlags:c|16,nativeEvent:e,targetContainers:[d]}}function sc(a,b){switch(a){case "focusin":case "focusout":kc=null;break;case "dragenter":case "dragleave":lc=null;break;case "mouseover":case "mouseout":mc=null;break;case "pointerover":case "pointerout":nc.delete(b.pointerId);break;case "gotpointercapture":case "lostpointercapture":oc.delete(b.pointerId);}}
  function tc(a,b,c,d,e,f){if(null===a||a.nativeEvent!==f)return a=rc(b,c,d,e,f),null!==b&&(b=Cb(b),null!==b&&fc(b)),a;a.eventSystemFlags|=d;b=a.targetContainers;null!==e&&-1===b.indexOf(e)&&b.push(e);return a}
  function uc(a,b,c,d,e){switch(b){case "focusin":return kc=tc(kc,a,b,c,d,e),!0;case "dragenter":return lc=tc(lc,a,b,c,d,e),!0;case "mouseover":return mc=tc(mc,a,b,c,d,e),!0;case "pointerover":var f=e.pointerId;nc.set(f,tc(nc.get(f)||null,a,b,c,d,e));return !0;case "gotpointercapture":return f=e.pointerId,oc.set(f,tc(oc.get(f)||null,a,b,c,d,e)),!0}return !1}
  function vc(a){var b=wc(a.target);if(null!==b){var c=Zb(b);if(null!==c)if(b=c.tag,13===b){if(b=$b(c),null!==b){a.blockedOn=b;hc(a.lanePriority,function(){scheduler.unstable_runWithPriority(a.priority,function(){gc(c);});});return}}else if(3===b&&c.stateNode.hydrate){a.blockedOn=3===c.tag?c.stateNode.containerInfo:null;return}}a.blockedOn=null;}
  function xc(a){if(null!==a.blockedOn)return !1;for(var b=a.targetContainers;0<b.length;){var c=yc(a.domEventName,a.eventSystemFlags,b[0],a.nativeEvent);if(null!==c)return b=Cb(c),null!==b&&fc(b),a.blockedOn=c,!1;b.shift();}return !0}function zc(a,b,c){xc(a)&&c.delete(b);}
  function Ac(){for(ic=!1;0<jc.length;){var a=jc[0];if(null!==a.blockedOn){a=Cb(a.blockedOn);null!==a&&ec(a);break}for(var b=a.targetContainers;0<b.length;){var c=yc(a.domEventName,a.eventSystemFlags,b[0],a.nativeEvent);if(null!==c){a.blockedOn=c;break}b.shift();}null===a.blockedOn&&jc.shift();}null!==kc&&xc(kc)&&(kc=null);null!==lc&&xc(lc)&&(lc=null);null!==mc&&xc(mc)&&(mc=null);nc.forEach(zc);oc.forEach(zc);}
  function Bc(a,b){a.blockedOn===b&&(a.blockedOn=null,ic||(ic=!0,scheduler.unstable_scheduleCallback(scheduler.unstable_NormalPriority,Ac)));}
  function Cc(a){function b(b){return Bc(b,a)}if(0<jc.length){Bc(jc[0],a);for(var c=1;c<jc.length;c++){var d=jc[c];d.blockedOn===a&&(d.blockedOn=null);}}null!==kc&&Bc(kc,a);null!==lc&&Bc(lc,a);null!==mc&&Bc(mc,a);nc.forEach(b);oc.forEach(b);for(c=0;c<pc.length;c++)d=pc[c],d.blockedOn===a&&(d.blockedOn=null);for(;0<pc.length&&(c=pc[0],null===c.blockedOn);)vc(c),null===c.blockedOn&&pc.shift();}
  function Dc(a,b){var c={};c[a.toLowerCase()]=b.toLowerCase();c["Webkit"+a]="webkit"+b;c["Moz"+a]="moz"+b;return c}var Ec={animationend:Dc("Animation","AnimationEnd"),animationiteration:Dc("Animation","AnimationIteration"),animationstart:Dc("Animation","AnimationStart"),transitionend:Dc("Transition","TransitionEnd")},Fc={},Gc={};
  fa&&(Gc=document.createElement("div").style,"AnimationEvent"in window||(delete Ec.animationend.animation,delete Ec.animationiteration.animation,delete Ec.animationstart.animation),"TransitionEvent"in window||delete Ec.transitionend.transition);function Hc(a){if(Fc[a])return Fc[a];if(!Ec[a])return a;var b=Ec[a],c;for(c in b)if(b.hasOwnProperty(c)&&c in Gc)return Fc[a]=b[c];return a}
  var Ic=Hc("animationend"),Jc=Hc("animationiteration"),Kc=Hc("animationstart"),Lc=Hc("transitionend"),Mc=new Map,Nc=new Map,Oc=["abort","abort",Ic,"animationEnd",Jc,"animationIteration",Kc,"animationStart","canplay","canPlay","canplaythrough","canPlayThrough","durationchange","durationChange","emptied","emptied","encrypted","encrypted","ended","ended","error","error","gotpointercapture","gotPointerCapture","load","load","loadeddata","loadedData","loadedmetadata","loadedMetadata","loadstart","loadStart",
  "lostpointercapture","lostPointerCapture","playing","playing","progress","progress","seeking","seeking","stalled","stalled","suspend","suspend","timeupdate","timeUpdate",Lc,"transitionEnd","waiting","waiting"];function Pc(a,b){for(var c=0;c<a.length;c+=2){var d=a[c],e=a[c+1];e="on"+(e[0].toUpperCase()+e.slice(1));Nc.set(d,b);Mc.set(d,e);da(e,[d]);}}var Qc=scheduler.unstable_now;Qc();var F=8;
  function Rc(a){if(0!==(1&a))return F=15,1;if(0!==(2&a))return F=14,2;if(0!==(4&a))return F=13,4;var b=24&a;if(0!==b)return F=12,b;if(0!==(a&32))return F=11,32;b=192&a;if(0!==b)return F=10,b;if(0!==(a&256))return F=9,256;b=3584&a;if(0!==b)return F=8,b;if(0!==(a&4096))return F=7,4096;b=4186112&a;if(0!==b)return F=6,b;b=62914560&a;if(0!==b)return F=5,b;if(a&67108864)return F=4,67108864;if(0!==(a&134217728))return F=3,134217728;b=805306368&a;if(0!==b)return F=2,b;if(0!==(1073741824&a))return F=1,1073741824;
  F=8;return a}function Sc(a){switch(a){case 99:return 15;case 98:return 10;case 97:case 96:return 8;case 95:return 2;default:return 0}}function Tc(a){switch(a){case 15:case 14:return 99;case 13:case 12:case 11:case 10:return 98;case 9:case 8:case 7:case 6:case 4:case 5:return 97;case 3:case 2:case 1:return 95;case 0:return 90;default:throw Error(y(358,a));}}
  function Uc(a,b){var c=a.pendingLanes;if(0===c)return F=0;var d=0,e=0,f=a.expiredLanes,g=a.suspendedLanes,h=a.pingedLanes;if(0!==f)d=f,e=F=15;else if(f=c&134217727,0!==f){var k=f&~g;0!==k?(d=Rc(k),e=F):(h&=f,0!==h&&(d=Rc(h),e=F));}else f=c&~g,0!==f?(d=Rc(f),e=F):0!==h&&(d=Rc(h),e=F);if(0===d)return 0;d=31-Vc(d);d=c&((0>d?0:1<<d)<<1)-1;if(0!==b&&b!==d&&0===(b&g)){Rc(b);if(e<=F)return b;F=e;}b=a.entangledLanes;if(0!==b)for(a=a.entanglements,b&=d;0<b;)c=31-Vc(b),e=1<<c,d|=a[c],b&=~e;return d}
  function Wc(a){a=a.pendingLanes&-1073741825;return 0!==a?a:a&1073741824?1073741824:0}function Xc(a,b){switch(a){case 15:return 1;case 14:return 2;case 12:return a=Yc(24&~b),0===a?Xc(10,b):a;case 10:return a=Yc(192&~b),0===a?Xc(8,b):a;case 8:return a=Yc(3584&~b),0===a&&(a=Yc(4186112&~b),0===a&&(a=512)),a;case 2:return b=Yc(805306368&~b),0===b&&(b=268435456),b}throw Error(y(358,a));}function Yc(a){return a&-a}function Zc(a){for(var b=[],c=0;31>c;c++)b.push(a);return b}
  function $c(a,b,c){a.pendingLanes|=b;var d=b-1;a.suspendedLanes&=d;a.pingedLanes&=d;a=a.eventTimes;b=31-Vc(b);a[b]=c;}var Vc=Math.clz32?Math.clz32:ad,bd=Math.log,cd=Math.LN2;function ad(a){return 0===a?32:31-(bd(a)/cd|0)|0}var dd=scheduler.unstable_UserBlockingPriority,ed=scheduler.unstable_runWithPriority,fd=!0;function gd(a,b,c,d){Kb||Ib();var e=hd,f=Kb;Kb=!0;try{Hb(e,a,b,c,d);}finally{(Kb=f)||Mb();}}function id(a,b,c,d){ed(dd,hd.bind(null,a,b,c,d));}
  function hd(a,b,c,d){if(fd){var e;if((e=0===(b&4))&&0<jc.length&&-1<qc.indexOf(a))a=rc(null,a,b,c,d),jc.push(a);else {var f=yc(a,b,c,d);if(null===f)e&&sc(a,d);else {if(e){if(-1<qc.indexOf(a)){a=rc(f,a,b,c,d);jc.push(a);return}if(uc(f,a,b,c,d))return;sc(a,d);}jd(a,b,d,null,c);}}}}
  function yc(a,b,c,d){var e=xb(d);e=wc(e);if(null!==e){var f=Zb(e);if(null===f)e=null;else {var g=f.tag;if(13===g){e=$b(f);if(null!==e)return e;e=null;}else if(3===g){if(f.stateNode.hydrate)return 3===f.tag?f.stateNode.containerInfo:null;e=null;}else f!==e&&(e=null);}}jd(a,b,d,e,c);return null}var kd=null,ld=null,md=null;
  function nd(){if(md)return md;var a,b=ld,c=b.length,d,e="value"in kd?kd.value:kd.textContent,f=e.length;for(a=0;a<c&&b[a]===e[a];a++);var g=c-a;for(d=1;d<=g&&b[c-d]===e[f-d];d++);return md=e.slice(a,1<d?1-d:void 0)}function od(a){var b=a.keyCode;"charCode"in a?(a=a.charCode,0===a&&13===b&&(a=13)):a=b;10===a&&(a=13);return 32<=a||13===a?a:0}function pd(){return !0}function qd(){return !1}
  function rd(a){function b(b,d,e,f,g){this._reactName=b;this._targetInst=e;this.type=d;this.nativeEvent=f;this.target=g;this.currentTarget=null;for(var c in a)a.hasOwnProperty(c)&&(b=a[c],this[c]=b?b(f):f[c]);this.isDefaultPrevented=(null!=f.defaultPrevented?f.defaultPrevented:!1===f.returnValue)?pd:qd;this.isPropagationStopped=qd;return this}objectAssign(b.prototype,{preventDefault:function(){this.defaultPrevented=!0;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():"unknown"!==typeof a.returnValue&&
  (a.returnValue=!1),this.isDefaultPrevented=pd);},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():"unknown"!==typeof a.cancelBubble&&(a.cancelBubble=!0),this.isPropagationStopped=pd);},persist:function(){},isPersistent:pd});return b}
  var sd={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(a){return a.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},td=rd(sd),ud=objectAssign({},sd,{view:0,detail:0}),vd=rd(ud),wd,xd,yd,Ad=objectAssign({},ud,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:zd,button:0,buttons:0,relatedTarget:function(a){return void 0===a.relatedTarget?a.fromElement===a.srcElement?a.toElement:a.fromElement:a.relatedTarget},movementX:function(a){if("movementX"in
  a)return a.movementX;a!==yd&&(yd&&"mousemove"===a.type?(wd=a.screenX-yd.screenX,xd=a.screenY-yd.screenY):xd=wd=0,yd=a);return wd},movementY:function(a){return "movementY"in a?a.movementY:xd}}),Bd=rd(Ad),Cd=objectAssign({},Ad,{dataTransfer:0}),Dd=rd(Cd),Ed=objectAssign({},ud,{relatedTarget:0}),Fd=rd(Ed),Gd=objectAssign({},sd,{animationName:0,elapsedTime:0,pseudoElement:0}),Hd=rd(Gd),Id=objectAssign({},sd,{clipboardData:function(a){return "clipboardData"in a?a.clipboardData:window.clipboardData}}),Jd=rd(Id),Kd=objectAssign({},sd,{data:0}),Ld=rd(Kd),Md={Esc:"Escape",
  Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Nd={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",
  119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Od={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Pd(a){var b=this.nativeEvent;return b.getModifierState?b.getModifierState(a):(a=Od[a])?!!b[a]:!1}function zd(){return Pd}
  var Qd=objectAssign({},ud,{key:function(a){if(a.key){var b=Md[a.key]||a.key;if("Unidentified"!==b)return b}return "keypress"===a.type?(a=od(a),13===a?"Enter":String.fromCharCode(a)):"keydown"===a.type||"keyup"===a.type?Nd[a.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:zd,charCode:function(a){return "keypress"===a.type?od(a):0},keyCode:function(a){return "keydown"===a.type||"keyup"===a.type?a.keyCode:0},which:function(a){return "keypress"===
  a.type?od(a):"keydown"===a.type||"keyup"===a.type?a.keyCode:0}}),Rd=rd(Qd),Sd=objectAssign({},Ad,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Td=rd(Sd),Ud=objectAssign({},ud,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:zd}),Vd=rd(Ud),Wd=objectAssign({},sd,{propertyName:0,elapsedTime:0,pseudoElement:0}),Xd=rd(Wd),Yd=objectAssign({},Ad,{deltaX:function(a){return "deltaX"in a?a.deltaX:"wheelDeltaX"in a?-a.wheelDeltaX:0},
  deltaY:function(a){return "deltaY"in a?a.deltaY:"wheelDeltaY"in a?-a.wheelDeltaY:"wheelDelta"in a?-a.wheelDelta:0},deltaZ:0,deltaMode:0}),Zd=rd(Yd),$d=[9,13,27,32],ae=fa&&"CompositionEvent"in window,be=null;fa&&"documentMode"in document&&(be=document.documentMode);var ce=fa&&"TextEvent"in window&&!be,de=fa&&(!ae||be&&8<be&&11>=be),ee=String.fromCharCode(32),fe=!1;
  function ge(a,b){switch(a){case "keyup":return -1!==$d.indexOf(b.keyCode);case "keydown":return 229!==b.keyCode;case "keypress":case "mousedown":case "focusout":return !0;default:return !1}}function he(a){a=a.detail;return "object"===typeof a&&"data"in a?a.data:null}var ie=!1;function je(a,b){switch(a){case "compositionend":return he(b);case "keypress":if(32!==b.which)return null;fe=!0;return ee;case "textInput":return a=b.data,a===ee&&fe?null:a;default:return null}}
  function ke(a,b){if(ie)return "compositionend"===a||!ae&&ge(a,b)?(a=nd(),md=ld=kd=null,ie=!1,a):null;switch(a){case "paste":return null;case "keypress":if(!(b.ctrlKey||b.altKey||b.metaKey)||b.ctrlKey&&b.altKey){if(b.char&&1<b.char.length)return b.char;if(b.which)return String.fromCharCode(b.which)}return null;case "compositionend":return de&&"ko"!==b.locale?null:b.data;default:return null}}
  var le={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function me(a){var b=a&&a.nodeName&&a.nodeName.toLowerCase();return "input"===b?!!le[a.type]:"textarea"===b?!0:!1}function ne(a,b,c,d){Eb(d);b=oe(b,"onChange");0<b.length&&(c=new td("onChange","change",null,c,d),a.push({event:c,listeners:b}));}var pe=null,qe=null;function re(a){se(a,0);}function te(a){var b=ue(a);if(Wa(b))return a}
  function ve(a,b){if("change"===a)return b}var we=!1;if(fa){var xe;if(fa){var ye="oninput"in document;if(!ye){var ze=document.createElement("div");ze.setAttribute("oninput","return;");ye="function"===typeof ze.oninput;}xe=ye;}else xe=!1;we=xe&&(!document.documentMode||9<document.documentMode);}function Ae(){pe&&(pe.detachEvent("onpropertychange",Be),qe=pe=null);}function Be(a){if("value"===a.propertyName&&te(qe)){var b=[];ne(b,qe,a,xb(a));a=re;if(Kb)a(b);else {Kb=!0;try{Gb(a,b);}finally{Kb=!1,Mb();}}}}
  function Ce(a,b,c){"focusin"===a?(Ae(),pe=b,qe=c,pe.attachEvent("onpropertychange",Be)):"focusout"===a&&Ae();}function De(a){if("selectionchange"===a||"keyup"===a||"keydown"===a)return te(qe)}function Ee(a,b){if("click"===a)return te(b)}function Fe(a,b){if("input"===a||"change"===a)return te(b)}function Ge(a,b){return a===b&&(0!==a||1/a===1/b)||a!==a&&b!==b}var He="function"===typeof Object.is?Object.is:Ge,Ie=Object.prototype.hasOwnProperty;
  function Je(a,b){if(He(a,b))return !0;if("object"!==typeof a||null===a||"object"!==typeof b||null===b)return !1;var c=Object.keys(a),d=Object.keys(b);if(c.length!==d.length)return !1;for(d=0;d<c.length;d++)if(!Ie.call(b,c[d])||!He(a[c[d]],b[c[d]]))return !1;return !0}function Ke(a){for(;a&&a.firstChild;)a=a.firstChild;return a}
  function Le(a,b){var c=Ke(a);a=0;for(var d;c;){if(3===c.nodeType){d=a+c.textContent.length;if(a<=b&&d>=b)return {node:c,offset:b-a};a=d;}a:{for(;c;){if(c.nextSibling){c=c.nextSibling;break a}c=c.parentNode;}c=void 0;}c=Ke(c);}}function Me(a,b){return a&&b?a===b?!0:a&&3===a.nodeType?!1:b&&3===b.nodeType?Me(a,b.parentNode):"contains"in a?a.contains(b):a.compareDocumentPosition?!!(a.compareDocumentPosition(b)&16):!1:!1}
  function Ne(){for(var a=window,b=Xa();b instanceof a.HTMLIFrameElement;){try{var c="string"===typeof b.contentWindow.location.href;}catch(d){c=!1;}if(c)a=b.contentWindow;else break;b=Xa(a.document);}return b}function Oe(a){var b=a&&a.nodeName&&a.nodeName.toLowerCase();return b&&("input"===b&&("text"===a.type||"search"===a.type||"tel"===a.type||"url"===a.type||"password"===a.type)||"textarea"===b||"true"===a.contentEditable)}
  var Pe=fa&&"documentMode"in document&&11>=document.documentMode,Qe=null,Re=null,Se=null,Te=!1;
  function Ue(a,b,c){var d=c.window===c?c.document:9===c.nodeType?c:c.ownerDocument;Te||null==Qe||Qe!==Xa(d)||(d=Qe,"selectionStart"in d&&Oe(d)?d={start:d.selectionStart,end:d.selectionEnd}:(d=(d.ownerDocument&&d.ownerDocument.defaultView||window).getSelection(),d={anchorNode:d.anchorNode,anchorOffset:d.anchorOffset,focusNode:d.focusNode,focusOffset:d.focusOffset}),Se&&Je(Se,d)||(Se=d,d=oe(Re,"onSelect"),0<d.length&&(b=new td("onSelect","select",null,b,c),a.push({event:b,listeners:d}),b.target=Qe)));}
  Pc("cancel cancel click click close close contextmenu contextMenu copy copy cut cut auxclick auxClick dblclick doubleClick dragend dragEnd dragstart dragStart drop drop focusin focus focusout blur input input invalid invalid keydown keyDown keypress keyPress keyup keyUp mousedown mouseDown mouseup mouseUp paste paste pause pause play play pointercancel pointerCancel pointerdown pointerDown pointerup pointerUp ratechange rateChange reset reset seeked seeked submit submit touchcancel touchCancel touchend touchEnd touchstart touchStart volumechange volumeChange".split(" "),
  0);Pc("drag drag dragenter dragEnter dragexit dragExit dragleave dragLeave dragover dragOver mousemove mouseMove mouseout mouseOut mouseover mouseOver pointermove pointerMove pointerout pointerOut pointerover pointerOver scroll scroll toggle toggle touchmove touchMove wheel wheel".split(" "),1);Pc(Oc,2);for(var Ve="change selectionchange textInput compositionstart compositionend compositionupdate".split(" "),We=0;We<Ve.length;We++)Nc.set(Ve[We],0);ea("onMouseEnter",["mouseout","mouseover"]);
  ea("onMouseLeave",["mouseout","mouseover"]);ea("onPointerEnter",["pointerout","pointerover"]);ea("onPointerLeave",["pointerout","pointerover"]);da("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));da("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));da("onBeforeInput",["compositionend","keypress","textInput","paste"]);da("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));
  da("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));da("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Xe="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),Ye=new Set("cancel close invalid load scroll toggle".split(" ").concat(Xe));
  function Ze(a,b,c){var d=a.type||"unknown-event";a.currentTarget=c;Yb(d,b,void 0,a);a.currentTarget=null;}
  function se(a,b){b=0!==(b&4);for(var c=0;c<a.length;c++){var d=a[c],e=d.event;d=d.listeners;a:{var f=void 0;if(b)for(var g=d.length-1;0<=g;g--){var h=d[g],k=h.instance,l=h.currentTarget;h=h.listener;if(k!==f&&e.isPropagationStopped())break a;Ze(e,h,l);f=k;}else for(g=0;g<d.length;g++){h=d[g];k=h.instance;l=h.currentTarget;h=h.listener;if(k!==f&&e.isPropagationStopped())break a;Ze(e,h,l);f=k;}}}if(Ub)throw a=Vb,Ub=!1,Vb=null,a;}
  function G(a,b){var c=$e(b),d=a+"__bubble";c.has(d)||(af(b,a,2,!1),c.add(d));}var bf="_reactListening"+Math.random().toString(36).slice(2);function cf(a){a[bf]||(a[bf]=!0,ba.forEach(function(b){Ye.has(b)||df(b,!1,a,null);df(b,!0,a,null);}));}
  function df(a,b,c,d){var e=4<arguments.length&&void 0!==arguments[4]?arguments[4]:0,f=c;"selectionchange"===a&&9!==c.nodeType&&(f=c.ownerDocument);if(null!==d&&!b&&Ye.has(a)){if("scroll"!==a)return;e|=2;f=d;}var g=$e(f),h=a+"__"+(b?"capture":"bubble");g.has(h)||(b&&(e|=4),af(f,a,e,b),g.add(h));}
  function af(a,b,c,d){var e=Nc.get(b);switch(void 0===e?2:e){case 0:e=gd;break;case 1:e=id;break;default:e=hd;}c=e.bind(null,b,c,a);e=void 0;!Pb||"touchstart"!==b&&"touchmove"!==b&&"wheel"!==b||(e=!0);d?void 0!==e?a.addEventListener(b,c,{capture:!0,passive:e}):a.addEventListener(b,c,!0):void 0!==e?a.addEventListener(b,c,{passive:e}):a.addEventListener(b,c,!1);}
  function jd(a,b,c,d,e){var f=d;if(0===(b&1)&&0===(b&2)&&null!==d)a:for(;;){if(null===d)return;var g=d.tag;if(3===g||4===g){var h=d.stateNode.containerInfo;if(h===e||8===h.nodeType&&h.parentNode===e)break;if(4===g)for(g=d.return;null!==g;){var k=g.tag;if(3===k||4===k)if(k=g.stateNode.containerInfo,k===e||8===k.nodeType&&k.parentNode===e)return;g=g.return;}for(;null!==h;){g=wc(h);if(null===g)return;k=g.tag;if(5===k||6===k){d=f=g;continue a}h=h.parentNode;}}d=d.return;}Nb(function(){var d=f,e=xb(c),g=[];
  a:{var h=Mc.get(a);if(void 0!==h){var k=td,x=a;switch(a){case "keypress":if(0===od(c))break a;case "keydown":case "keyup":k=Rd;break;case "focusin":x="focus";k=Fd;break;case "focusout":x="blur";k=Fd;break;case "beforeblur":case "afterblur":k=Fd;break;case "click":if(2===c.button)break a;case "auxclick":case "dblclick":case "mousedown":case "mousemove":case "mouseup":case "mouseout":case "mouseover":case "contextmenu":k=Bd;break;case "drag":case "dragend":case "dragenter":case "dragexit":case "dragleave":case "dragover":case "dragstart":case "drop":k=
  Dd;break;case "touchcancel":case "touchend":case "touchmove":case "touchstart":k=Vd;break;case Ic:case Jc:case Kc:k=Hd;break;case Lc:k=Xd;break;case "scroll":k=vd;break;case "wheel":k=Zd;break;case "copy":case "cut":case "paste":k=Jd;break;case "gotpointercapture":case "lostpointercapture":case "pointercancel":case "pointerdown":case "pointermove":case "pointerout":case "pointerover":case "pointerup":k=Td;}var w=0!==(b&4),z=!w&&"scroll"===a,u=w?null!==h?h+"Capture":null:h;w=[];for(var t=d,q;null!==
  t;){q=t;var v=q.stateNode;5===q.tag&&null!==v&&(q=v,null!==u&&(v=Ob(t,u),null!=v&&w.push(ef(t,v,q))));if(z)break;t=t.return;}0<w.length&&(h=new k(h,x,null,c,e),g.push({event:h,listeners:w}));}}if(0===(b&7)){a:{h="mouseover"===a||"pointerover"===a;k="mouseout"===a||"pointerout"===a;if(h&&0===(b&16)&&(x=c.relatedTarget||c.fromElement)&&(wc(x)||x[ff]))break a;if(k||h){h=e.window===e?e:(h=e.ownerDocument)?h.defaultView||h.parentWindow:window;if(k){if(x=c.relatedTarget||c.toElement,k=d,x=x?wc(x):null,null!==
  x&&(z=Zb(x),x!==z||5!==x.tag&&6!==x.tag))x=null;}else k=null,x=d;if(k!==x){w=Bd;v="onMouseLeave";u="onMouseEnter";t="mouse";if("pointerout"===a||"pointerover"===a)w=Td,v="onPointerLeave",u="onPointerEnter",t="pointer";z=null==k?h:ue(k);q=null==x?h:ue(x);h=new w(v,t+"leave",k,c,e);h.target=z;h.relatedTarget=q;v=null;wc(e)===d&&(w=new w(u,t+"enter",x,c,e),w.target=q,w.relatedTarget=z,v=w);z=v;if(k&&x)b:{w=k;u=x;t=0;for(q=w;q;q=gf(q))t++;q=0;for(v=u;v;v=gf(v))q++;for(;0<t-q;)w=gf(w),t--;for(;0<q-t;)u=
  gf(u),q--;for(;t--;){if(w===u||null!==u&&w===u.alternate)break b;w=gf(w);u=gf(u);}w=null;}else w=null;null!==k&&hf(g,h,k,w,!1);null!==x&&null!==z&&hf(g,z,x,w,!0);}}}a:{h=d?ue(d):window;k=h.nodeName&&h.nodeName.toLowerCase();if("select"===k||"input"===k&&"file"===h.type)var J=ve;else if(me(h))if(we)J=Fe;else {J=De;var K=Ce;}else (k=h.nodeName)&&"input"===k.toLowerCase()&&("checkbox"===h.type||"radio"===h.type)&&(J=Ee);if(J&&(J=J(a,d))){ne(g,J,c,e);break a}K&&K(a,h,d);"focusout"===a&&(K=h._wrapperState)&&
  K.controlled&&"number"===h.type&&bb(h,"number",h.value);}K=d?ue(d):window;switch(a){case "focusin":if(me(K)||"true"===K.contentEditable)Qe=K,Re=d,Se=null;break;case "focusout":Se=Re=Qe=null;break;case "mousedown":Te=!0;break;case "contextmenu":case "mouseup":case "dragend":Te=!1;Ue(g,c,e);break;case "selectionchange":if(Pe)break;case "keydown":case "keyup":Ue(g,c,e);}var Q;if(ae)b:{switch(a){case "compositionstart":var L="onCompositionStart";break b;case "compositionend":L="onCompositionEnd";break b;
  case "compositionupdate":L="onCompositionUpdate";break b}L=void 0;}else ie?ge(a,c)&&(L="onCompositionEnd"):"keydown"===a&&229===c.keyCode&&(L="onCompositionStart");L&&(de&&"ko"!==c.locale&&(ie||"onCompositionStart"!==L?"onCompositionEnd"===L&&ie&&(Q=nd()):(kd=e,ld="value"in kd?kd.value:kd.textContent,ie=!0)),K=oe(d,L),0<K.length&&(L=new Ld(L,a,null,c,e),g.push({event:L,listeners:K}),Q?L.data=Q:(Q=he(c),null!==Q&&(L.data=Q))));if(Q=ce?je(a,c):ke(a,c))d=oe(d,"onBeforeInput"),0<d.length&&(e=new Ld("onBeforeInput",
  "beforeinput",null,c,e),g.push({event:e,listeners:d}),e.data=Q);}se(g,b);});}function ef(a,b,c){return {instance:a,listener:b,currentTarget:c}}function oe(a,b){for(var c=b+"Capture",d=[];null!==a;){var e=a,f=e.stateNode;5===e.tag&&null!==f&&(e=f,f=Ob(a,c),null!=f&&d.unshift(ef(a,f,e)),f=Ob(a,b),null!=f&&d.push(ef(a,f,e)));a=a.return;}return d}function gf(a){if(null===a)return null;do a=a.return;while(a&&5!==a.tag);return a?a:null}
  function hf(a,b,c,d,e){for(var f=b._reactName,g=[];null!==c&&c!==d;){var h=c,k=h.alternate,l=h.stateNode;if(null!==k&&k===d)break;5===h.tag&&null!==l&&(h=l,e?(k=Ob(c,f),null!=k&&g.unshift(ef(c,k,h))):e||(k=Ob(c,f),null!=k&&g.push(ef(c,k,h))));c=c.return;}0!==g.length&&a.push({event:b,listeners:g});}function jf(){}var kf=null,lf=null;function mf(a,b){switch(a){case "button":case "input":case "select":case "textarea":return !!b.autoFocus}return !1}
  function nf(a,b){return "textarea"===a||"option"===a||"noscript"===a||"string"===typeof b.children||"number"===typeof b.children||"object"===typeof b.dangerouslySetInnerHTML&&null!==b.dangerouslySetInnerHTML&&null!=b.dangerouslySetInnerHTML.__html}var of="function"===typeof setTimeout?setTimeout:void 0,pf="function"===typeof clearTimeout?clearTimeout:void 0;function qf(a){1===a.nodeType?a.textContent="":9===a.nodeType&&(a=a.body,null!=a&&(a.textContent=""));}
  function rf(a){for(;null!=a;a=a.nextSibling){var b=a.nodeType;if(1===b||3===b)break}return a}function sf(a){a=a.previousSibling;for(var b=0;a;){if(8===a.nodeType){var c=a.data;if("$"===c||"$!"===c||"$?"===c){if(0===b)return a;b--;}else "/$"===c&&b++;}a=a.previousSibling;}return null}var tf=0;function uf(a){return {$$typeof:Ga,toString:a,valueOf:a}}var vf=Math.random().toString(36).slice(2),wf="__reactFiber$"+vf,xf="__reactProps$"+vf,ff="__reactContainer$"+vf,yf="__reactEvents$"+vf;
  function wc(a){var b=a[wf];if(b)return b;for(var c=a.parentNode;c;){if(b=c[ff]||c[wf]){c=b.alternate;if(null!==b.child||null!==c&&null!==c.child)for(a=sf(a);null!==a;){if(c=a[wf])return c;a=sf(a);}return b}a=c;c=a.parentNode;}return null}function Cb(a){a=a[wf]||a[ff];return !a||5!==a.tag&&6!==a.tag&&13!==a.tag&&3!==a.tag?null:a}function ue(a){if(5===a.tag||6===a.tag)return a.stateNode;throw Error(y(33));}function Db(a){return a[xf]||null}
  function $e(a){var b=a[yf];void 0===b&&(b=a[yf]=new Set);return b}var zf=[],Af=-1;function Bf(a){return {current:a}}function H(a){0>Af||(a.current=zf[Af],zf[Af]=null,Af--);}function I(a,b){Af++;zf[Af]=a.current;a.current=b;}var Cf={},M=Bf(Cf),N=Bf(!1),Df=Cf;
  function Ef(a,b){var c=a.type.contextTypes;if(!c)return Cf;var d=a.stateNode;if(d&&d.__reactInternalMemoizedUnmaskedChildContext===b)return d.__reactInternalMemoizedMaskedChildContext;var e={},f;for(f in c)e[f]=b[f];d&&(a=a.stateNode,a.__reactInternalMemoizedUnmaskedChildContext=b,a.__reactInternalMemoizedMaskedChildContext=e);return e}function Ff(a){a=a.childContextTypes;return null!==a&&void 0!==a}function Gf(){H(N);H(M);}function Hf(a,b,c){if(M.current!==Cf)throw Error(y(168));I(M,b);I(N,c);}
  function If(a,b,c){var d=a.stateNode;a=b.childContextTypes;if("function"!==typeof d.getChildContext)return c;d=d.getChildContext();for(var e in d)if(!(e in a))throw Error(y(108,Ra(b)||"Unknown",e));return objectAssign({},c,d)}function Jf(a){a=(a=a.stateNode)&&a.__reactInternalMemoizedMergedChildContext||Cf;Df=M.current;I(M,a);I(N,N.current);return !0}function Kf(a,b,c){var d=a.stateNode;if(!d)throw Error(y(169));c?(a=If(a,b,Df),d.__reactInternalMemoizedMergedChildContext=a,H(N),H(M),I(M,a)):H(N);I(N,c);}
  var Lf=null,Mf=null,Nf=scheduler.unstable_runWithPriority,Of=scheduler.unstable_scheduleCallback,Pf=scheduler.unstable_cancelCallback,Qf=scheduler.unstable_shouldYield,Rf=scheduler.unstable_requestPaint,Sf=scheduler.unstable_now,Tf=scheduler.unstable_getCurrentPriorityLevel,Uf=scheduler.unstable_ImmediatePriority,Vf=scheduler.unstable_UserBlockingPriority,Wf=scheduler.unstable_NormalPriority,Xf=scheduler.unstable_LowPriority,Yf=scheduler.unstable_IdlePriority,Zf={},$f=void 0!==Rf?Rf:function(){},ag=null,bg=null,cg=!1,dg=Sf(),O=1E4>dg?Sf:function(){return Sf()-dg};
  function eg(){switch(Tf()){case Uf:return 99;case Vf:return 98;case Wf:return 97;case Xf:return 96;case Yf:return 95;default:throw Error(y(332));}}function fg(a){switch(a){case 99:return Uf;case 98:return Vf;case 97:return Wf;case 96:return Xf;case 95:return Yf;default:throw Error(y(332));}}function gg(a,b){a=fg(a);return Nf(a,b)}function hg(a,b,c){a=fg(a);return Of(a,b,c)}function ig(){if(null!==bg){var a=bg;bg=null;Pf(a);}jg();}
  function jg(){if(!cg&&null!==ag){cg=!0;var a=0;try{var b=ag;gg(99,function(){for(;a<b.length;a++){var c=b[a];do c=c(!0);while(null!==c)}});ag=null;}catch(c){throw null!==ag&&(ag=ag.slice(a+1)),Of(Uf,ig),c;}finally{cg=!1;}}}var kg=ra.ReactCurrentBatchConfig;function lg(a,b){if(a&&a.defaultProps){b=objectAssign({},b);a=a.defaultProps;for(var c in a)void 0===b[c]&&(b[c]=a[c]);return b}return b}var mg=Bf(null),ng=null,og=null,pg=null;function qg(){pg=og=ng=null;}
  function rg(a){var b=mg.current;H(mg);a.type._context._currentValue=b;}function sg(a,b){for(;null!==a;){var c=a.alternate;if((a.childLanes&b)===b)if(null===c||(c.childLanes&b)===b)break;else c.childLanes|=b;else a.childLanes|=b,null!==c&&(c.childLanes|=b);a=a.return;}}function tg(a,b){ng=a;pg=og=null;a=a.dependencies;null!==a&&null!==a.firstContext&&(0!==(a.lanes&b)&&(ug=!0),a.firstContext=null);}
  function vg(a,b){if(pg!==a&&!1!==b&&0!==b){if("number"!==typeof b||1073741823===b)pg=a,b=1073741823;b={context:a,observedBits:b,next:null};if(null===og){if(null===ng)throw Error(y(308));og=b;ng.dependencies={lanes:0,firstContext:b,responders:null};}else og=og.next=b;}return a._currentValue}var wg=!1;function xg(a){a.updateQueue={baseState:a.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null},effects:null};}
  function yg(a,b){a=a.updateQueue;b.updateQueue===a&&(b.updateQueue={baseState:a.baseState,firstBaseUpdate:a.firstBaseUpdate,lastBaseUpdate:a.lastBaseUpdate,shared:a.shared,effects:a.effects});}function zg(a,b){return {eventTime:a,lane:b,tag:0,payload:null,callback:null,next:null}}function Ag(a,b){a=a.updateQueue;if(null!==a){a=a.shared;var c=a.pending;null===c?b.next=b:(b.next=c.next,c.next=b);a.pending=b;}}
  function Bg(a,b){var c=a.updateQueue,d=a.alternate;if(null!==d&&(d=d.updateQueue,c===d)){var e=null,f=null;c=c.firstBaseUpdate;if(null!==c){do{var g={eventTime:c.eventTime,lane:c.lane,tag:c.tag,payload:c.payload,callback:c.callback,next:null};null===f?e=f=g:f=f.next=g;c=c.next;}while(null!==c);null===f?e=f=b:f=f.next=b;}else e=f=b;c={baseState:d.baseState,firstBaseUpdate:e,lastBaseUpdate:f,shared:d.shared,effects:d.effects};a.updateQueue=c;return}a=c.lastBaseUpdate;null===a?c.firstBaseUpdate=b:a.next=
  b;c.lastBaseUpdate=b;}
  function Cg(a,b,c,d){var e=a.updateQueue;wg=!1;var f=e.firstBaseUpdate,g=e.lastBaseUpdate,h=e.shared.pending;if(null!==h){e.shared.pending=null;var k=h,l=k.next;k.next=null;null===g?f=l:g.next=l;g=k;var n=a.alternate;if(null!==n){n=n.updateQueue;var A=n.lastBaseUpdate;A!==g&&(null===A?n.firstBaseUpdate=l:A.next=l,n.lastBaseUpdate=k);}}if(null!==f){A=e.baseState;g=0;n=l=k=null;do{h=f.lane;var p=f.eventTime;if((d&h)===h){null!==n&&(n=n.next={eventTime:p,lane:0,tag:f.tag,payload:f.payload,callback:f.callback,
  next:null});a:{var C=a,x=f;h=b;p=c;switch(x.tag){case 1:C=x.payload;if("function"===typeof C){A=C.call(p,A,h);break a}A=C;break a;case 3:C.flags=C.flags&-4097|64;case 0:C=x.payload;h="function"===typeof C?C.call(p,A,h):C;if(null===h||void 0===h)break a;A=objectAssign({},A,h);break a;case 2:wg=!0;}}null!==f.callback&&(a.flags|=32,h=e.effects,null===h?e.effects=[f]:h.push(f));}else p={eventTime:p,lane:h,tag:f.tag,payload:f.payload,callback:f.callback,next:null},null===n?(l=n=p,k=A):n=n.next=p,g|=h;f=f.next;if(null===
  f)if(h=e.shared.pending,null===h)break;else f=h.next,h.next=null,e.lastBaseUpdate=h,e.shared.pending=null;}while(1);null===n&&(k=A);e.baseState=k;e.firstBaseUpdate=l;e.lastBaseUpdate=n;Dg|=g;a.lanes=g;a.memoizedState=A;}}function Eg(a,b,c){a=b.effects;b.effects=null;if(null!==a)for(b=0;b<a.length;b++){var d=a[b],e=d.callback;if(null!==e){d.callback=null;d=c;if("function"!==typeof e)throw Error(y(191,e));e.call(d);}}}var Fg=(new react.Component).refs;
  function Gg(a,b,c,d){b=a.memoizedState;c=c(d,b);c=null===c||void 0===c?b:objectAssign({},b,c);a.memoizedState=c;0===a.lanes&&(a.updateQueue.baseState=c);}
  var Kg={isMounted:function(a){return (a=a._reactInternals)?Zb(a)===a:!1},enqueueSetState:function(a,b,c){a=a._reactInternals;var d=Hg(),e=Ig(a),f=zg(d,e);f.payload=b;void 0!==c&&null!==c&&(f.callback=c);Ag(a,f);Jg(a,e,d);},enqueueReplaceState:function(a,b,c){a=a._reactInternals;var d=Hg(),e=Ig(a),f=zg(d,e);f.tag=1;f.payload=b;void 0!==c&&null!==c&&(f.callback=c);Ag(a,f);Jg(a,e,d);},enqueueForceUpdate:function(a,b){a=a._reactInternals;var c=Hg(),d=Ig(a),e=zg(c,d);e.tag=2;void 0!==b&&null!==b&&(e.callback=
  b);Ag(a,e);Jg(a,d,c);}};function Lg(a,b,c,d,e,f,g){a=a.stateNode;return "function"===typeof a.shouldComponentUpdate?a.shouldComponentUpdate(d,f,g):b.prototype&&b.prototype.isPureReactComponent?!Je(c,d)||!Je(e,f):!0}
  function Mg(a,b,c){var d=!1,e=Cf;var f=b.contextType;"object"===typeof f&&null!==f?f=vg(f):(e=Ff(b)?Df:M.current,d=b.contextTypes,f=(d=null!==d&&void 0!==d)?Ef(a,e):Cf);b=new b(c,f);a.memoizedState=null!==b.state&&void 0!==b.state?b.state:null;b.updater=Kg;a.stateNode=b;b._reactInternals=a;d&&(a=a.stateNode,a.__reactInternalMemoizedUnmaskedChildContext=e,a.__reactInternalMemoizedMaskedChildContext=f);return b}
  function Ng(a,b,c,d){a=b.state;"function"===typeof b.componentWillReceiveProps&&b.componentWillReceiveProps(c,d);"function"===typeof b.UNSAFE_componentWillReceiveProps&&b.UNSAFE_componentWillReceiveProps(c,d);b.state!==a&&Kg.enqueueReplaceState(b,b.state,null);}
  function Og(a,b,c,d){var e=a.stateNode;e.props=c;e.state=a.memoizedState;e.refs=Fg;xg(a);var f=b.contextType;"object"===typeof f&&null!==f?e.context=vg(f):(f=Ff(b)?Df:M.current,e.context=Ef(a,f));Cg(a,c,e,d);e.state=a.memoizedState;f=b.getDerivedStateFromProps;"function"===typeof f&&(Gg(a,b,f,c),e.state=a.memoizedState);"function"===typeof b.getDerivedStateFromProps||"function"===typeof e.getSnapshotBeforeUpdate||"function"!==typeof e.UNSAFE_componentWillMount&&"function"!==typeof e.componentWillMount||
  (b=e.state,"function"===typeof e.componentWillMount&&e.componentWillMount(),"function"===typeof e.UNSAFE_componentWillMount&&e.UNSAFE_componentWillMount(),b!==e.state&&Kg.enqueueReplaceState(e,e.state,null),Cg(a,c,e,d),e.state=a.memoizedState);"function"===typeof e.componentDidMount&&(a.flags|=4);}var Pg=Array.isArray;
  function Qg(a,b,c){a=c.ref;if(null!==a&&"function"!==typeof a&&"object"!==typeof a){if(c._owner){c=c._owner;if(c){if(1!==c.tag)throw Error(y(309));var d=c.stateNode;}if(!d)throw Error(y(147,a));var e=""+a;if(null!==b&&null!==b.ref&&"function"===typeof b.ref&&b.ref._stringRef===e)return b.ref;b=function(a){var b=d.refs;b===Fg&&(b=d.refs={});null===a?delete b[e]:b[e]=a;};b._stringRef=e;return b}if("string"!==typeof a)throw Error(y(284));if(!c._owner)throw Error(y(290,a));}return a}
  function Rg(a,b){if("textarea"!==a.type)throw Error(y(31,"[object Object]"===Object.prototype.toString.call(b)?"object with keys {"+Object.keys(b).join(", ")+"}":b));}
  function Sg(a){function b(b,c){if(a){var d=b.lastEffect;null!==d?(d.nextEffect=c,b.lastEffect=c):b.firstEffect=b.lastEffect=c;c.nextEffect=null;c.flags=8;}}function c(c,d){if(!a)return null;for(;null!==d;)b(c,d),d=d.sibling;return null}function d(a,b){for(a=new Map;null!==b;)null!==b.key?a.set(b.key,b):a.set(b.index,b),b=b.sibling;return a}function e(a,b){a=Tg(a,b);a.index=0;a.sibling=null;return a}function f(b,c,d){b.index=d;if(!a)return c;d=b.alternate;if(null!==d)return d=d.index,d<c?(b.flags=2,
  c):d;b.flags=2;return c}function g(b){a&&null===b.alternate&&(b.flags=2);return b}function h(a,b,c,d){if(null===b||6!==b.tag)return b=Ug(c,a.mode,d),b.return=a,b;b=e(b,c);b.return=a;return b}function k(a,b,c,d){if(null!==b&&b.elementType===c.type)return d=e(b,c.props),d.ref=Qg(a,b,c),d.return=a,d;d=Vg(c.type,c.key,c.props,null,a.mode,d);d.ref=Qg(a,b,c);d.return=a;return d}function l(a,b,c,d){if(null===b||4!==b.tag||b.stateNode.containerInfo!==c.containerInfo||b.stateNode.implementation!==c.implementation)return b=
  Wg(c,a.mode,d),b.return=a,b;b=e(b,c.children||[]);b.return=a;return b}function n(a,b,c,d,f){if(null===b||7!==b.tag)return b=Xg(c,a.mode,d,f),b.return=a,b;b=e(b,c);b.return=a;return b}function A(a,b,c){if("string"===typeof b||"number"===typeof b)return b=Ug(""+b,a.mode,c),b.return=a,b;if("object"===typeof b&&null!==b){switch(b.$$typeof){case sa:return c=Vg(b.type,b.key,b.props,null,a.mode,c),c.ref=Qg(a,null,b),c.return=a,c;case ta:return b=Wg(b,a.mode,c),b.return=a,b}if(Pg(b)||La(b))return b=Xg(b,
  a.mode,c,null),b.return=a,b;Rg(a,b);}return null}function p(a,b,c,d){var e=null!==b?b.key:null;if("string"===typeof c||"number"===typeof c)return null!==e?null:h(a,b,""+c,d);if("object"===typeof c&&null!==c){switch(c.$$typeof){case sa:return c.key===e?c.type===ua?n(a,b,c.props.children,d,e):k(a,b,c,d):null;case ta:return c.key===e?l(a,b,c,d):null}if(Pg(c)||La(c))return null!==e?null:n(a,b,c,d,null);Rg(a,c);}return null}function C(a,b,c,d,e){if("string"===typeof d||"number"===typeof d)return a=a.get(c)||
  null,h(b,a,""+d,e);if("object"===typeof d&&null!==d){switch(d.$$typeof){case sa:return a=a.get(null===d.key?c:d.key)||null,d.type===ua?n(b,a,d.props.children,e,d.key):k(b,a,d,e);case ta:return a=a.get(null===d.key?c:d.key)||null,l(b,a,d,e)}if(Pg(d)||La(d))return a=a.get(c)||null,n(b,a,d,e,null);Rg(b,d);}return null}function x(e,g,h,k){for(var l=null,t=null,u=g,z=g=0,q=null;null!==u&&z<h.length;z++){u.index>z?(q=u,u=null):q=u.sibling;var n=p(e,u,h[z],k);if(null===n){null===u&&(u=q);break}a&&u&&null===
  n.alternate&&b(e,u);g=f(n,g,z);null===t?l=n:t.sibling=n;t=n;u=q;}if(z===h.length)return c(e,u),l;if(null===u){for(;z<h.length;z++)u=A(e,h[z],k),null!==u&&(g=f(u,g,z),null===t?l=u:t.sibling=u,t=u);return l}for(u=d(e,u);z<h.length;z++)q=C(u,e,z,h[z],k),null!==q&&(a&&null!==q.alternate&&u.delete(null===q.key?z:q.key),g=f(q,g,z),null===t?l=q:t.sibling=q,t=q);a&&u.forEach(function(a){return b(e,a)});return l}function w(e,g,h,k){var l=La(h);if("function"!==typeof l)throw Error(y(150));h=l.call(h);if(null==
  h)throw Error(y(151));for(var t=l=null,u=g,z=g=0,q=null,n=h.next();null!==u&&!n.done;z++,n=h.next()){u.index>z?(q=u,u=null):q=u.sibling;var w=p(e,u,n.value,k);if(null===w){null===u&&(u=q);break}a&&u&&null===w.alternate&&b(e,u);g=f(w,g,z);null===t?l=w:t.sibling=w;t=w;u=q;}if(n.done)return c(e,u),l;if(null===u){for(;!n.done;z++,n=h.next())n=A(e,n.value,k),null!==n&&(g=f(n,g,z),null===t?l=n:t.sibling=n,t=n);return l}for(u=d(e,u);!n.done;z++,n=h.next())n=C(u,e,z,n.value,k),null!==n&&(a&&null!==n.alternate&&
  u.delete(null===n.key?z:n.key),g=f(n,g,z),null===t?l=n:t.sibling=n,t=n);a&&u.forEach(function(a){return b(e,a)});return l}return function(a,d,f,h){var k="object"===typeof f&&null!==f&&f.type===ua&&null===f.key;k&&(f=f.props.children);var l="object"===typeof f&&null!==f;if(l)switch(f.$$typeof){case sa:a:{l=f.key;for(k=d;null!==k;){if(k.key===l){switch(k.tag){case 7:if(f.type===ua){c(a,k.sibling);d=e(k,f.props.children);d.return=a;a=d;break a}break;default:if(k.elementType===f.type){c(a,k.sibling);
  d=e(k,f.props);d.ref=Qg(a,k,f);d.return=a;a=d;break a}}c(a,k);break}else b(a,k);k=k.sibling;}f.type===ua?(d=Xg(f.props.children,a.mode,h,f.key),d.return=a,a=d):(h=Vg(f.type,f.key,f.props,null,a.mode,h),h.ref=Qg(a,d,f),h.return=a,a=h);}return g(a);case ta:a:{for(k=f.key;null!==d;){if(d.key===k)if(4===d.tag&&d.stateNode.containerInfo===f.containerInfo&&d.stateNode.implementation===f.implementation){c(a,d.sibling);d=e(d,f.children||[]);d.return=a;a=d;break a}else {c(a,d);break}else b(a,d);d=d.sibling;}d=
  Wg(f,a.mode,h);d.return=a;a=d;}return g(a)}if("string"===typeof f||"number"===typeof f)return f=""+f,null!==d&&6===d.tag?(c(a,d.sibling),d=e(d,f),d.return=a,a=d):(c(a,d),d=Ug(f,a.mode,h),d.return=a,a=d),g(a);if(Pg(f))return x(a,d,f,h);if(La(f))return w(a,d,f,h);l&&Rg(a,f);if("undefined"===typeof f&&!k)switch(a.tag){case 1:case 22:case 0:case 11:case 15:throw Error(y(152,Ra(a.type)||"Component"));}return c(a,d)}}var Yg=Sg(!0),Zg=Sg(!1),$g={},ah=Bf($g),bh=Bf($g),ch=Bf($g);
  function dh(a){if(a===$g)throw Error(y(174));return a}function eh(a,b){I(ch,b);I(bh,a);I(ah,$g);a=b.nodeType;switch(a){case 9:case 11:b=(b=b.documentElement)?b.namespaceURI:mb(null,"");break;default:a=8===a?b.parentNode:b,b=a.namespaceURI||null,a=a.tagName,b=mb(b,a);}H(ah);I(ah,b);}function fh(){H(ah);H(bh);H(ch);}function gh(a){dh(ch.current);var b=dh(ah.current);var c=mb(b,a.type);b!==c&&(I(bh,a),I(ah,c));}function hh(a){bh.current===a&&(H(ah),H(bh));}var P=Bf(0);
  function ih(a){for(var b=a;null!==b;){if(13===b.tag){var c=b.memoizedState;if(null!==c&&(c=c.dehydrated,null===c||"$?"===c.data||"$!"===c.data))return b}else if(19===b.tag&&void 0!==b.memoizedProps.revealOrder){if(0!==(b.flags&64))return b}else if(null!==b.child){b.child.return=b;b=b.child;continue}if(b===a)break;for(;null===b.sibling;){if(null===b.return||b.return===a)return null;b=b.return;}b.sibling.return=b.return;b=b.sibling;}return null}var jh=null,kh=null,lh=!1;
  function mh(a,b){var c=nh(5,null,null,0);c.elementType="DELETED";c.type="DELETED";c.stateNode=b;c.return=a;c.flags=8;null!==a.lastEffect?(a.lastEffect.nextEffect=c,a.lastEffect=c):a.firstEffect=a.lastEffect=c;}function oh(a,b){switch(a.tag){case 5:var c=a.type;b=1!==b.nodeType||c.toLowerCase()!==b.nodeName.toLowerCase()?null:b;return null!==b?(a.stateNode=b,!0):!1;case 6:return b=""===a.pendingProps||3!==b.nodeType?null:b,null!==b?(a.stateNode=b,!0):!1;case 13:return !1;default:return !1}}
  function ph(a){if(lh){var b=kh;if(b){var c=b;if(!oh(a,b)){b=rf(c.nextSibling);if(!b||!oh(a,b)){a.flags=a.flags&-1025|2;lh=!1;jh=a;return}mh(jh,c);}jh=a;kh=rf(b.firstChild);}else a.flags=a.flags&-1025|2,lh=!1,jh=a;}}function qh(a){for(a=a.return;null!==a&&5!==a.tag&&3!==a.tag&&13!==a.tag;)a=a.return;jh=a;}
  function rh(a){if(a!==jh)return !1;if(!lh)return qh(a),lh=!0,!1;var b=a.type;if(5!==a.tag||"head"!==b&&"body"!==b&&!nf(b,a.memoizedProps))for(b=kh;b;)mh(a,b),b=rf(b.nextSibling);qh(a);if(13===a.tag){a=a.memoizedState;a=null!==a?a.dehydrated:null;if(!a)throw Error(y(317));a:{a=a.nextSibling;for(b=0;a;){if(8===a.nodeType){var c=a.data;if("/$"===c){if(0===b){kh=rf(a.nextSibling);break a}b--;}else "$"!==c&&"$!"!==c&&"$?"!==c||b++;}a=a.nextSibling;}kh=null;}}else kh=jh?rf(a.stateNode.nextSibling):null;return !0}
  function sh(){kh=jh=null;lh=!1;}var th=[];function uh(){for(var a=0;a<th.length;a++)th[a]._workInProgressVersionPrimary=null;th.length=0;}var vh=ra.ReactCurrentDispatcher,wh=ra.ReactCurrentBatchConfig,xh=0,R=null,S=null,T=null,yh=!1,zh=!1;function Ah(){throw Error(y(321));}function Bh(a,b){if(null===b)return !1;for(var c=0;c<b.length&&c<a.length;c++)if(!He(a[c],b[c]))return !1;return !0}
  function Ch(a,b,c,d,e,f){xh=f;R=b;b.memoizedState=null;b.updateQueue=null;b.lanes=0;vh.current=null===a||null===a.memoizedState?Dh:Eh;a=c(d,e);if(zh){f=0;do{zh=!1;if(!(25>f))throw Error(y(301));f+=1;T=S=null;b.updateQueue=null;vh.current=Fh;a=c(d,e);}while(zh)}vh.current=Gh;b=null!==S&&null!==S.next;xh=0;T=S=R=null;yh=!1;if(b)throw Error(y(300));return a}function Hh(){var a={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};null===T?R.memoizedState=T=a:T=T.next=a;return T}
  function Ih(){if(null===S){var a=R.alternate;a=null!==a?a.memoizedState:null;}else a=S.next;var b=null===T?R.memoizedState:T.next;if(null!==b)T=b,S=a;else {if(null===a)throw Error(y(310));S=a;a={memoizedState:S.memoizedState,baseState:S.baseState,baseQueue:S.baseQueue,queue:S.queue,next:null};null===T?R.memoizedState=T=a:T=T.next=a;}return T}function Jh(a,b){return "function"===typeof b?b(a):b}
  function Kh(a){var b=Ih(),c=b.queue;if(null===c)throw Error(y(311));c.lastRenderedReducer=a;var d=S,e=d.baseQueue,f=c.pending;if(null!==f){if(null!==e){var g=e.next;e.next=f.next;f.next=g;}d.baseQueue=e=f;c.pending=null;}if(null!==e){e=e.next;d=d.baseState;var h=g=f=null,k=e;do{var l=k.lane;if((xh&l)===l)null!==h&&(h=h.next={lane:0,action:k.action,eagerReducer:k.eagerReducer,eagerState:k.eagerState,next:null}),d=k.eagerReducer===a?k.eagerState:a(d,k.action);else {var n={lane:l,action:k.action,eagerReducer:k.eagerReducer,
  eagerState:k.eagerState,next:null};null===h?(g=h=n,f=d):h=h.next=n;R.lanes|=l;Dg|=l;}k=k.next;}while(null!==k&&k!==e);null===h?f=d:h.next=g;He(d,b.memoizedState)||(ug=!0);b.memoizedState=d;b.baseState=f;b.baseQueue=h;c.lastRenderedState=d;}return [b.memoizedState,c.dispatch]}
  function Lh(a){var b=Ih(),c=b.queue;if(null===c)throw Error(y(311));c.lastRenderedReducer=a;var d=c.dispatch,e=c.pending,f=b.memoizedState;if(null!==e){c.pending=null;var g=e=e.next;do f=a(f,g.action),g=g.next;while(g!==e);He(f,b.memoizedState)||(ug=!0);b.memoizedState=f;null===b.baseQueue&&(b.baseState=f);c.lastRenderedState=f;}return [f,d]}
  function Mh(a,b,c){var d=b._getVersion;d=d(b._source);var e=b._workInProgressVersionPrimary;if(null!==e)a=e===d;else if(a=a.mutableReadLanes,a=(xh&a)===a)b._workInProgressVersionPrimary=d,th.push(b);if(a)return c(b._source);th.push(b);throw Error(y(350));}
  function Nh(a,b,c,d){var e=U;if(null===e)throw Error(y(349));var f=b._getVersion,g=f(b._source),h=vh.current,k=h.useState(function(){return Mh(e,b,c)}),l=k[1],n=k[0];k=T;var A=a.memoizedState,p=A.refs,C=p.getSnapshot,x=A.source;A=A.subscribe;var w=R;a.memoizedState={refs:p,source:b,subscribe:d};h.useEffect(function(){p.getSnapshot=c;p.setSnapshot=l;var a=f(b._source);if(!He(g,a)){a=c(b._source);He(n,a)||(l(a),a=Ig(w),e.mutableReadLanes|=a&e.pendingLanes);a=e.mutableReadLanes;e.entangledLanes|=a;for(var d=
  e.entanglements,h=a;0<h;){var k=31-Vc(h),v=1<<k;d[k]|=a;h&=~v;}}},[c,b,d]);h.useEffect(function(){return d(b._source,function(){var a=p.getSnapshot,c=p.setSnapshot;try{c(a(b._source));var d=Ig(w);e.mutableReadLanes|=d&e.pendingLanes;}catch(q){c(function(){throw q;});}})},[b,d]);He(C,c)&&He(x,b)&&He(A,d)||(a={pending:null,dispatch:null,lastRenderedReducer:Jh,lastRenderedState:n},a.dispatch=l=Oh.bind(null,R,a),k.queue=a,k.baseQueue=null,n=Mh(e,b,c),k.memoizedState=k.baseState=n);return n}
  function Ph(a,b,c){var d=Ih();return Nh(d,a,b,c)}function Qh(a){var b=Hh();"function"===typeof a&&(a=a());b.memoizedState=b.baseState=a;a=b.queue={pending:null,dispatch:null,lastRenderedReducer:Jh,lastRenderedState:a};a=a.dispatch=Oh.bind(null,R,a);return [b.memoizedState,a]}
  function Rh(a,b,c,d){a={tag:a,create:b,destroy:c,deps:d,next:null};b=R.updateQueue;null===b?(b={lastEffect:null},R.updateQueue=b,b.lastEffect=a.next=a):(c=b.lastEffect,null===c?b.lastEffect=a.next=a:(d=c.next,c.next=a,a.next=d,b.lastEffect=a));return a}function Sh(a){var b=Hh();a={current:a};return b.memoizedState=a}function Th(){return Ih().memoizedState}function Uh(a,b,c,d){var e=Hh();R.flags|=a;e.memoizedState=Rh(1|b,c,void 0,void 0===d?null:d);}
  function Vh(a,b,c,d){var e=Ih();d=void 0===d?null:d;var f=void 0;if(null!==S){var g=S.memoizedState;f=g.destroy;if(null!==d&&Bh(d,g.deps)){Rh(b,c,f,d);return}}R.flags|=a;e.memoizedState=Rh(1|b,c,f,d);}function Wh(a,b){return Uh(516,4,a,b)}function Xh(a,b){return Vh(516,4,a,b)}function Yh(a,b){return Vh(4,2,a,b)}function Zh(a,b){if("function"===typeof b)return a=a(),b(a),function(){b(null);};if(null!==b&&void 0!==b)return a=a(),b.current=a,function(){b.current=null;}}
  function $h(a,b,c){c=null!==c&&void 0!==c?c.concat([a]):null;return Vh(4,2,Zh.bind(null,b,a),c)}function ai(){}function bi(a,b){var c=Ih();b=void 0===b?null:b;var d=c.memoizedState;if(null!==d&&null!==b&&Bh(b,d[1]))return d[0];c.memoizedState=[a,b];return a}function ci(a,b){var c=Ih();b=void 0===b?null:b;var d=c.memoizedState;if(null!==d&&null!==b&&Bh(b,d[1]))return d[0];a=a();c.memoizedState=[a,b];return a}
  function di(a,b){var c=eg();gg(98>c?98:c,function(){a(!0);});gg(97<c?97:c,function(){var c=wh.transition;wh.transition=1;try{a(!1),b();}finally{wh.transition=c;}});}
  function Oh(a,b,c){var d=Hg(),e=Ig(a),f={lane:e,action:c,eagerReducer:null,eagerState:null,next:null},g=b.pending;null===g?f.next=f:(f.next=g.next,g.next=f);b.pending=f;g=a.alternate;if(a===R||null!==g&&g===R)zh=yh=!0;else {if(0===a.lanes&&(null===g||0===g.lanes)&&(g=b.lastRenderedReducer,null!==g))try{var h=b.lastRenderedState,k=g(h,c);f.eagerReducer=g;f.eagerState=k;if(He(k,h))return}catch(l){}finally{}Jg(a,e,d);}}
  var Gh={readContext:vg,useCallback:Ah,useContext:Ah,useEffect:Ah,useImperativeHandle:Ah,useLayoutEffect:Ah,useMemo:Ah,useReducer:Ah,useRef:Ah,useState:Ah,useDebugValue:Ah,useDeferredValue:Ah,useTransition:Ah,useMutableSource:Ah,useOpaqueIdentifier:Ah,unstable_isNewReconciler:!1},Dh={readContext:vg,useCallback:function(a,b){Hh().memoizedState=[a,void 0===b?null:b];return a},useContext:vg,useEffect:Wh,useImperativeHandle:function(a,b,c){c=null!==c&&void 0!==c?c.concat([a]):null;return Uh(4,2,Zh.bind(null,
  b,a),c)},useLayoutEffect:function(a,b){return Uh(4,2,a,b)},useMemo:function(a,b){var c=Hh();b=void 0===b?null:b;a=a();c.memoizedState=[a,b];return a},useReducer:function(a,b,c){var d=Hh();b=void 0!==c?c(b):b;d.memoizedState=d.baseState=b;a=d.queue={pending:null,dispatch:null,lastRenderedReducer:a,lastRenderedState:b};a=a.dispatch=Oh.bind(null,R,a);return [d.memoizedState,a]},useRef:Sh,useState:Qh,useDebugValue:ai,useDeferredValue:function(a){var b=Qh(a),c=b[0],d=b[1];Wh(function(){var b=wh.transition;
  wh.transition=1;try{d(a);}finally{wh.transition=b;}},[a]);return c},useTransition:function(){var a=Qh(!1),b=a[0];a=di.bind(null,a[1]);Sh(a);return [a,b]},useMutableSource:function(a,b,c){var d=Hh();d.memoizedState={refs:{getSnapshot:b,setSnapshot:null},source:a,subscribe:c};return Nh(d,a,b,c)},useOpaqueIdentifier:function(){if(lh){var a=!1,b=uf(function(){a||(a=!0,c("r:"+(tf++).toString(36)));throw Error(y(355));}),c=Qh(b)[1];0===(R.mode&2)&&(R.flags|=516,Rh(5,function(){c("r:"+(tf++).toString(36));},
  void 0,null));return b}b="r:"+(tf++).toString(36);Qh(b);return b},unstable_isNewReconciler:!1},Eh={readContext:vg,useCallback:bi,useContext:vg,useEffect:Xh,useImperativeHandle:$h,useLayoutEffect:Yh,useMemo:ci,useReducer:Kh,useRef:Th,useState:function(){return Kh(Jh)},useDebugValue:ai,useDeferredValue:function(a){var b=Kh(Jh),c=b[0],d=b[1];Xh(function(){var b=wh.transition;wh.transition=1;try{d(a);}finally{wh.transition=b;}},[a]);return c},useTransition:function(){var a=Kh(Jh)[0];return [Th().current,
  a]},useMutableSource:Ph,useOpaqueIdentifier:function(){return Kh(Jh)[0]},unstable_isNewReconciler:!1},Fh={readContext:vg,useCallback:bi,useContext:vg,useEffect:Xh,useImperativeHandle:$h,useLayoutEffect:Yh,useMemo:ci,useReducer:Lh,useRef:Th,useState:function(){return Lh(Jh)},useDebugValue:ai,useDeferredValue:function(a){var b=Lh(Jh),c=b[0],d=b[1];Xh(function(){var b=wh.transition;wh.transition=1;try{d(a);}finally{wh.transition=b;}},[a]);return c},useTransition:function(){var a=Lh(Jh)[0];return [Th().current,
  a]},useMutableSource:Ph,useOpaqueIdentifier:function(){return Lh(Jh)[0]},unstable_isNewReconciler:!1},ei=ra.ReactCurrentOwner,ug=!1;function fi(a,b,c,d){b.child=null===a?Zg(b,null,c,d):Yg(b,a.child,c,d);}function gi(a,b,c,d,e){c=c.render;var f=b.ref;tg(b,e);d=Ch(a,b,c,d,f,e);if(null!==a&&!ug)return b.updateQueue=a.updateQueue,b.flags&=-517,a.lanes&=~e,hi(a,b,e);b.flags|=1;fi(a,b,d,e);return b.child}
  function ii(a,b,c,d,e,f){if(null===a){var g=c.type;if("function"===typeof g&&!ji(g)&&void 0===g.defaultProps&&null===c.compare&&void 0===c.defaultProps)return b.tag=15,b.type=g,ki(a,b,g,d,e,f);a=Vg(c.type,null,d,b,b.mode,f);a.ref=b.ref;a.return=b;return b.child=a}g=a.child;if(0===(e&f)&&(e=g.memoizedProps,c=c.compare,c=null!==c?c:Je,c(e,d)&&a.ref===b.ref))return hi(a,b,f);b.flags|=1;a=Tg(g,d);a.ref=b.ref;a.return=b;return b.child=a}
  function ki(a,b,c,d,e,f){if(null!==a&&Je(a.memoizedProps,d)&&a.ref===b.ref)if(ug=!1,0!==(f&e))0!==(a.flags&16384)&&(ug=!0);else return b.lanes=a.lanes,hi(a,b,f);return li(a,b,c,d,f)}
  function mi(a,b,c){var d=b.pendingProps,e=d.children,f=null!==a?a.memoizedState:null;if("hidden"===d.mode||"unstable-defer-without-hiding"===d.mode)if(0===(b.mode&4))b.memoizedState={baseLanes:0},ni(b,c);else if(0!==(c&1073741824))b.memoizedState={baseLanes:0},ni(b,null!==f?f.baseLanes:c);else return a=null!==f?f.baseLanes|c:c,b.lanes=b.childLanes=1073741824,b.memoizedState={baseLanes:a},ni(b,a),null;else null!==f?(d=f.baseLanes|c,b.memoizedState=null):d=c,ni(b,d);fi(a,b,e,c);return b.child}
  function oi(a,b){var c=b.ref;if(null===a&&null!==c||null!==a&&a.ref!==c)b.flags|=128;}function li(a,b,c,d,e){var f=Ff(c)?Df:M.current;f=Ef(b,f);tg(b,e);c=Ch(a,b,c,d,f,e);if(null!==a&&!ug)return b.updateQueue=a.updateQueue,b.flags&=-517,a.lanes&=~e,hi(a,b,e);b.flags|=1;fi(a,b,c,e);return b.child}
  function pi(a,b,c,d,e){if(Ff(c)){var f=!0;Jf(b);}else f=!1;tg(b,e);if(null===b.stateNode)null!==a&&(a.alternate=null,b.alternate=null,b.flags|=2),Mg(b,c,d),Og(b,c,d,e),d=!0;else if(null===a){var g=b.stateNode,h=b.memoizedProps;g.props=h;var k=g.context,l=c.contextType;"object"===typeof l&&null!==l?l=vg(l):(l=Ff(c)?Df:M.current,l=Ef(b,l));var n=c.getDerivedStateFromProps,A="function"===typeof n||"function"===typeof g.getSnapshotBeforeUpdate;A||"function"!==typeof g.UNSAFE_componentWillReceiveProps&&
  "function"!==typeof g.componentWillReceiveProps||(h!==d||k!==l)&&Ng(b,g,d,l);wg=!1;var p=b.memoizedState;g.state=p;Cg(b,d,g,e);k=b.memoizedState;h!==d||p!==k||N.current||wg?("function"===typeof n&&(Gg(b,c,n,d),k=b.memoizedState),(h=wg||Lg(b,c,h,d,p,k,l))?(A||"function"!==typeof g.UNSAFE_componentWillMount&&"function"!==typeof g.componentWillMount||("function"===typeof g.componentWillMount&&g.componentWillMount(),"function"===typeof g.UNSAFE_componentWillMount&&g.UNSAFE_componentWillMount()),"function"===
  typeof g.componentDidMount&&(b.flags|=4)):("function"===typeof g.componentDidMount&&(b.flags|=4),b.memoizedProps=d,b.memoizedState=k),g.props=d,g.state=k,g.context=l,d=h):("function"===typeof g.componentDidMount&&(b.flags|=4),d=!1);}else {g=b.stateNode;yg(a,b);h=b.memoizedProps;l=b.type===b.elementType?h:lg(b.type,h);g.props=l;A=b.pendingProps;p=g.context;k=c.contextType;"object"===typeof k&&null!==k?k=vg(k):(k=Ff(c)?Df:M.current,k=Ef(b,k));var C=c.getDerivedStateFromProps;(n="function"===typeof C||
  "function"===typeof g.getSnapshotBeforeUpdate)||"function"!==typeof g.UNSAFE_componentWillReceiveProps&&"function"!==typeof g.componentWillReceiveProps||(h!==A||p!==k)&&Ng(b,g,d,k);wg=!1;p=b.memoizedState;g.state=p;Cg(b,d,g,e);var x=b.memoizedState;h!==A||p!==x||N.current||wg?("function"===typeof C&&(Gg(b,c,C,d),x=b.memoizedState),(l=wg||Lg(b,c,l,d,p,x,k))?(n||"function"!==typeof g.UNSAFE_componentWillUpdate&&"function"!==typeof g.componentWillUpdate||("function"===typeof g.componentWillUpdate&&g.componentWillUpdate(d,
  x,k),"function"===typeof g.UNSAFE_componentWillUpdate&&g.UNSAFE_componentWillUpdate(d,x,k)),"function"===typeof g.componentDidUpdate&&(b.flags|=4),"function"===typeof g.getSnapshotBeforeUpdate&&(b.flags|=256)):("function"!==typeof g.componentDidUpdate||h===a.memoizedProps&&p===a.memoizedState||(b.flags|=4),"function"!==typeof g.getSnapshotBeforeUpdate||h===a.memoizedProps&&p===a.memoizedState||(b.flags|=256),b.memoizedProps=d,b.memoizedState=x),g.props=d,g.state=x,g.context=k,d=l):("function"!==typeof g.componentDidUpdate||
  h===a.memoizedProps&&p===a.memoizedState||(b.flags|=4),"function"!==typeof g.getSnapshotBeforeUpdate||h===a.memoizedProps&&p===a.memoizedState||(b.flags|=256),d=!1);}return qi(a,b,c,d,f,e)}
  function qi(a,b,c,d,e,f){oi(a,b);var g=0!==(b.flags&64);if(!d&&!g)return e&&Kf(b,c,!1),hi(a,b,f);d=b.stateNode;ei.current=b;var h=g&&"function"!==typeof c.getDerivedStateFromError?null:d.render();b.flags|=1;null!==a&&g?(b.child=Yg(b,a.child,null,f),b.child=Yg(b,null,h,f)):fi(a,b,h,f);b.memoizedState=d.state;e&&Kf(b,c,!0);return b.child}function ri(a){var b=a.stateNode;b.pendingContext?Hf(a,b.pendingContext,b.pendingContext!==b.context):b.context&&Hf(a,b.context,!1);eh(a,b.containerInfo);}
  var si={dehydrated:null,retryLane:0};
  function ti(a,b,c){var d=b.pendingProps,e=P.current,f=!1,g;(g=0!==(b.flags&64))||(g=null!==a&&null===a.memoizedState?!1:0!==(e&2));g?(f=!0,b.flags&=-65):null!==a&&null===a.memoizedState||void 0===d.fallback||!0===d.unstable_avoidThisFallback||(e|=1);I(P,e&1);if(null===a){void 0!==d.fallback&&ph(b);a=d.children;e=d.fallback;if(f)return a=ui(b,a,e,c),b.child.memoizedState={baseLanes:c},b.memoizedState=si,a;if("number"===typeof d.unstable_expectedLoadTime)return a=ui(b,a,e,c),b.child.memoizedState={baseLanes:c},
  b.memoizedState=si,b.lanes=33554432,a;c=vi({mode:"visible",children:a},b.mode,c,null);c.return=b;return b.child=c}if(null!==a.memoizedState){if(f)return d=wi(a,b,d.children,d.fallback,c),f=b.child,e=a.child.memoizedState,f.memoizedState=null===e?{baseLanes:c}:{baseLanes:e.baseLanes|c},f.childLanes=a.childLanes&~c,b.memoizedState=si,d;c=xi(a,b,d.children,c);b.memoizedState=null;return c}if(f)return d=wi(a,b,d.children,d.fallback,c),f=b.child,e=a.child.memoizedState,f.memoizedState=null===e?{baseLanes:c}:
  {baseLanes:e.baseLanes|c},f.childLanes=a.childLanes&~c,b.memoizedState=si,d;c=xi(a,b,d.children,c);b.memoizedState=null;return c}function ui(a,b,c,d){var e=a.mode,f=a.child;b={mode:"hidden",children:b};0===(e&2)&&null!==f?(f.childLanes=0,f.pendingProps=b):f=vi(b,e,0,null);c=Xg(c,e,d,null);f.return=a;c.return=a;f.sibling=c;a.child=f;return c}
  function xi(a,b,c,d){var e=a.child;a=e.sibling;c=Tg(e,{mode:"visible",children:c});0===(b.mode&2)&&(c.lanes=d);c.return=b;c.sibling=null;null!==a&&(a.nextEffect=null,a.flags=8,b.firstEffect=b.lastEffect=a);return b.child=c}
  function wi(a,b,c,d,e){var f=b.mode,g=a.child;a=g.sibling;var h={mode:"hidden",children:c};0===(f&2)&&b.child!==g?(c=b.child,c.childLanes=0,c.pendingProps=h,g=c.lastEffect,null!==g?(b.firstEffect=c.firstEffect,b.lastEffect=g,g.nextEffect=null):b.firstEffect=b.lastEffect=null):c=Tg(g,h);null!==a?d=Tg(a,d):(d=Xg(d,f,e,null),d.flags|=2);d.return=b;c.return=b;c.sibling=d;b.child=c;return d}function yi(a,b){a.lanes|=b;var c=a.alternate;null!==c&&(c.lanes|=b);sg(a.return,b);}
  function zi(a,b,c,d,e,f){var g=a.memoizedState;null===g?a.memoizedState={isBackwards:b,rendering:null,renderingStartTime:0,last:d,tail:c,tailMode:e,lastEffect:f}:(g.isBackwards=b,g.rendering=null,g.renderingStartTime=0,g.last=d,g.tail=c,g.tailMode=e,g.lastEffect=f);}
  function Ai(a,b,c){var d=b.pendingProps,e=d.revealOrder,f=d.tail;fi(a,b,d.children,c);d=P.current;if(0!==(d&2))d=d&1|2,b.flags|=64;else {if(null!==a&&0!==(a.flags&64))a:for(a=b.child;null!==a;){if(13===a.tag)null!==a.memoizedState&&yi(a,c);else if(19===a.tag)yi(a,c);else if(null!==a.child){a.child.return=a;a=a.child;continue}if(a===b)break a;for(;null===a.sibling;){if(null===a.return||a.return===b)break a;a=a.return;}a.sibling.return=a.return;a=a.sibling;}d&=1;}I(P,d);if(0===(b.mode&2))b.memoizedState=
  null;else switch(e){case "forwards":c=b.child;for(e=null;null!==c;)a=c.alternate,null!==a&&null===ih(a)&&(e=c),c=c.sibling;c=e;null===c?(e=b.child,b.child=null):(e=c.sibling,c.sibling=null);zi(b,!1,e,c,f,b.lastEffect);break;case "backwards":c=null;e=b.child;for(b.child=null;null!==e;){a=e.alternate;if(null!==a&&null===ih(a)){b.child=e;break}a=e.sibling;e.sibling=c;c=e;e=a;}zi(b,!0,c,null,f,b.lastEffect);break;case "together":zi(b,!1,null,null,void 0,b.lastEffect);break;default:b.memoizedState=null;}return b.child}
  function hi(a,b,c){null!==a&&(b.dependencies=a.dependencies);Dg|=b.lanes;if(0!==(c&b.childLanes)){if(null!==a&&b.child!==a.child)throw Error(y(153));if(null!==b.child){a=b.child;c=Tg(a,a.pendingProps);b.child=c;for(c.return=b;null!==a.sibling;)a=a.sibling,c=c.sibling=Tg(a,a.pendingProps),c.return=b;c.sibling=null;}return b.child}return null}var Bi,Ci,Di,Ei;
  Bi=function(a,b){for(var c=b.child;null!==c;){if(5===c.tag||6===c.tag)a.appendChild(c.stateNode);else if(4!==c.tag&&null!==c.child){c.child.return=c;c=c.child;continue}if(c===b)break;for(;null===c.sibling;){if(null===c.return||c.return===b)return;c=c.return;}c.sibling.return=c.return;c=c.sibling;}};Ci=function(){};
  Di=function(a,b,c,d){var e=a.memoizedProps;if(e!==d){a=b.stateNode;dh(ah.current);var f=null;switch(c){case "input":e=Ya(a,e);d=Ya(a,d);f=[];break;case "option":e=eb(a,e);d=eb(a,d);f=[];break;case "select":e=objectAssign({},e,{value:void 0});d=objectAssign({},d,{value:void 0});f=[];break;case "textarea":e=gb(a,e);d=gb(a,d);f=[];break;default:"function"!==typeof e.onClick&&"function"===typeof d.onClick&&(a.onclick=jf);}vb(c,d);var g;c=null;for(l in e)if(!d.hasOwnProperty(l)&&e.hasOwnProperty(l)&&null!=e[l])if("style"===
  l){var h=e[l];for(g in h)h.hasOwnProperty(g)&&(c||(c={}),c[g]="");}else "dangerouslySetInnerHTML"!==l&&"children"!==l&&"suppressContentEditableWarning"!==l&&"suppressHydrationWarning"!==l&&"autoFocus"!==l&&(ca.hasOwnProperty(l)?f||(f=[]):(f=f||[]).push(l,null));for(l in d){var k=d[l];h=null!=e?e[l]:void 0;if(d.hasOwnProperty(l)&&k!==h&&(null!=k||null!=h))if("style"===l)if(h){for(g in h)!h.hasOwnProperty(g)||k&&k.hasOwnProperty(g)||(c||(c={}),c[g]="");for(g in k)k.hasOwnProperty(g)&&h[g]!==k[g]&&(c||
  (c={}),c[g]=k[g]);}else c||(f||(f=[]),f.push(l,c)),c=k;else "dangerouslySetInnerHTML"===l?(k=k?k.__html:void 0,h=h?h.__html:void 0,null!=k&&h!==k&&(f=f||[]).push(l,k)):"children"===l?"string"!==typeof k&&"number"!==typeof k||(f=f||[]).push(l,""+k):"suppressContentEditableWarning"!==l&&"suppressHydrationWarning"!==l&&(ca.hasOwnProperty(l)?(null!=k&&"onScroll"===l&&G("scroll",a),f||h===k||(f=[])):"object"===typeof k&&null!==k&&k.$$typeof===Ga?k.toString():(f=f||[]).push(l,k));}c&&(f=f||[]).push("style",
  c);var l=f;if(b.updateQueue=l)b.flags|=4;}};Ei=function(a,b,c,d){c!==d&&(b.flags|=4);};function Fi(a,b){if(!lh)switch(a.tailMode){case "hidden":b=a.tail;for(var c=null;null!==b;)null!==b.alternate&&(c=b),b=b.sibling;null===c?a.tail=null:c.sibling=null;break;case "collapsed":c=a.tail;for(var d=null;null!==c;)null!==c.alternate&&(d=c),c=c.sibling;null===d?b||null===a.tail?a.tail=null:a.tail.sibling=null:d.sibling=null;}}
  function Gi(a,b,c){var d=b.pendingProps;switch(b.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return null;case 1:return Ff(b.type)&&Gf(),null;case 3:fh();H(N);H(M);uh();d=b.stateNode;d.pendingContext&&(d.context=d.pendingContext,d.pendingContext=null);if(null===a||null===a.child)rh(b)?b.flags|=4:d.hydrate||(b.flags|=256);Ci(b);return null;case 5:hh(b);var e=dh(ch.current);c=b.type;if(null!==a&&null!=b.stateNode)Di(a,b,c,d,e),a.ref!==b.ref&&(b.flags|=128);else {if(!d){if(null===
  b.stateNode)throw Error(y(166));return null}a=dh(ah.current);if(rh(b)){d=b.stateNode;c=b.type;var f=b.memoizedProps;d[wf]=b;d[xf]=f;switch(c){case "dialog":G("cancel",d);G("close",d);break;case "iframe":case "object":case "embed":G("load",d);break;case "video":case "audio":for(a=0;a<Xe.length;a++)G(Xe[a],d);break;case "source":G("error",d);break;case "img":case "image":case "link":G("error",d);G("load",d);break;case "details":G("toggle",d);break;case "input":Za(d,f);G("invalid",d);break;case "select":d._wrapperState=
  {wasMultiple:!!f.multiple};G("invalid",d);break;case "textarea":hb(d,f),G("invalid",d);}vb(c,f);a=null;for(var g in f)f.hasOwnProperty(g)&&(e=f[g],"children"===g?"string"===typeof e?d.textContent!==e&&(a=["children",e]):"number"===typeof e&&d.textContent!==""+e&&(a=["children",""+e]):ca.hasOwnProperty(g)&&null!=e&&"onScroll"===g&&G("scroll",d));switch(c){case "input":Va(d);cb(d,f,!0);break;case "textarea":Va(d);jb(d);break;case "select":case "option":break;default:"function"===typeof f.onClick&&(d.onclick=
  jf);}d=a;b.updateQueue=d;null!==d&&(b.flags|=4);}else {g=9===e.nodeType?e:e.ownerDocument;a===kb.html&&(a=lb(c));a===kb.html?"script"===c?(a=g.createElement("div"),a.innerHTML="<script>\x3c/script>",a=a.removeChild(a.firstChild)):"string"===typeof d.is?a=g.createElement(c,{is:d.is}):(a=g.createElement(c),"select"===c&&(g=a,d.multiple?g.multiple=!0:d.size&&(g.size=d.size))):a=g.createElementNS(a,c);a[wf]=b;a[xf]=d;Bi(a,b,!1,!1);b.stateNode=a;g=wb(c,d);switch(c){case "dialog":G("cancel",a);G("close",a);
  e=d;break;case "iframe":case "object":case "embed":G("load",a);e=d;break;case "video":case "audio":for(e=0;e<Xe.length;e++)G(Xe[e],a);e=d;break;case "source":G("error",a);e=d;break;case "img":case "image":case "link":G("error",a);G("load",a);e=d;break;case "details":G("toggle",a);e=d;break;case "input":Za(a,d);e=Ya(a,d);G("invalid",a);break;case "option":e=eb(a,d);break;case "select":a._wrapperState={wasMultiple:!!d.multiple};e=objectAssign({},d,{value:void 0});G("invalid",a);break;case "textarea":hb(a,d);e=
  gb(a,d);G("invalid",a);break;default:e=d;}vb(c,e);var h=e;for(f in h)if(h.hasOwnProperty(f)){var k=h[f];"style"===f?tb(a,k):"dangerouslySetInnerHTML"===f?(k=k?k.__html:void 0,null!=k&&ob(a,k)):"children"===f?"string"===typeof k?("textarea"!==c||""!==k)&&pb(a,k):"number"===typeof k&&pb(a,""+k):"suppressContentEditableWarning"!==f&&"suppressHydrationWarning"!==f&&"autoFocus"!==f&&(ca.hasOwnProperty(f)?null!=k&&"onScroll"===f&&G("scroll",a):null!=k&&qa(a,f,k,g));}switch(c){case "input":Va(a);cb(a,d,!1);
  break;case "textarea":Va(a);jb(a);break;case "option":null!=d.value&&a.setAttribute("value",""+Sa(d.value));break;case "select":a.multiple=!!d.multiple;f=d.value;null!=f?fb(a,!!d.multiple,f,!1):null!=d.defaultValue&&fb(a,!!d.multiple,d.defaultValue,!0);break;default:"function"===typeof e.onClick&&(a.onclick=jf);}mf(c,d)&&(b.flags|=4);}null!==b.ref&&(b.flags|=128);}return null;case 6:if(a&&null!=b.stateNode)Ei(a,b,a.memoizedProps,d);else {if("string"!==typeof d&&null===b.stateNode)throw Error(y(166));
  c=dh(ch.current);dh(ah.current);rh(b)?(d=b.stateNode,c=b.memoizedProps,d[wf]=b,d.nodeValue!==c&&(b.flags|=4)):(d=(9===c.nodeType?c:c.ownerDocument).createTextNode(d),d[wf]=b,b.stateNode=d);}return null;case 13:H(P);d=b.memoizedState;if(0!==(b.flags&64))return b.lanes=c,b;d=null!==d;c=!1;null===a?void 0!==b.memoizedProps.fallback&&rh(b):c=null!==a.memoizedState;if(d&&!c&&0!==(b.mode&2))if(null===a&&!0!==b.memoizedProps.unstable_avoidThisFallback||0!==(P.current&1))0===V&&(V=3);else {if(0===V||3===V)V=
  4;null===U||0===(Dg&134217727)&&0===(Hi&134217727)||Ii(U,W);}if(d||c)b.flags|=4;return null;case 4:return fh(),Ci(b),null===a&&cf(b.stateNode.containerInfo),null;case 10:return rg(b),null;case 17:return Ff(b.type)&&Gf(),null;case 19:H(P);d=b.memoizedState;if(null===d)return null;f=0!==(b.flags&64);g=d.rendering;if(null===g)if(f)Fi(d,!1);else {if(0!==V||null!==a&&0!==(a.flags&64))for(a=b.child;null!==a;){g=ih(a);if(null!==g){b.flags|=64;Fi(d,!1);f=g.updateQueue;null!==f&&(b.updateQueue=f,b.flags|=4);
  null===d.lastEffect&&(b.firstEffect=null);b.lastEffect=d.lastEffect;d=c;for(c=b.child;null!==c;)f=c,a=d,f.flags&=2,f.nextEffect=null,f.firstEffect=null,f.lastEffect=null,g=f.alternate,null===g?(f.childLanes=0,f.lanes=a,f.child=null,f.memoizedProps=null,f.memoizedState=null,f.updateQueue=null,f.dependencies=null,f.stateNode=null):(f.childLanes=g.childLanes,f.lanes=g.lanes,f.child=g.child,f.memoizedProps=g.memoizedProps,f.memoizedState=g.memoizedState,f.updateQueue=g.updateQueue,f.type=g.type,a=g.dependencies,
  f.dependencies=null===a?null:{lanes:a.lanes,firstContext:a.firstContext}),c=c.sibling;I(P,P.current&1|2);return b.child}a=a.sibling;}null!==d.tail&&O()>Ji&&(b.flags|=64,f=!0,Fi(d,!1),b.lanes=33554432);}else {if(!f)if(a=ih(g),null!==a){if(b.flags|=64,f=!0,c=a.updateQueue,null!==c&&(b.updateQueue=c,b.flags|=4),Fi(d,!0),null===d.tail&&"hidden"===d.tailMode&&!g.alternate&&!lh)return b=b.lastEffect=d.lastEffect,null!==b&&(b.nextEffect=null),null}else 2*O()-d.renderingStartTime>Ji&&1073741824!==c&&(b.flags|=
  64,f=!0,Fi(d,!1),b.lanes=33554432);d.isBackwards?(g.sibling=b.child,b.child=g):(c=d.last,null!==c?c.sibling=g:b.child=g,d.last=g);}return null!==d.tail?(c=d.tail,d.rendering=c,d.tail=c.sibling,d.lastEffect=b.lastEffect,d.renderingStartTime=O(),c.sibling=null,b=P.current,I(P,f?b&1|2:b&1),c):null;case 23:case 24:return Ki(),null!==a&&null!==a.memoizedState!==(null!==b.memoizedState)&&"unstable-defer-without-hiding"!==d.mode&&(b.flags|=4),null}throw Error(y(156,b.tag));}
  function Li(a){switch(a.tag){case 1:Ff(a.type)&&Gf();var b=a.flags;return b&4096?(a.flags=b&-4097|64,a):null;case 3:fh();H(N);H(M);uh();b=a.flags;if(0!==(b&64))throw Error(y(285));a.flags=b&-4097|64;return a;case 5:return hh(a),null;case 13:return H(P),b=a.flags,b&4096?(a.flags=b&-4097|64,a):null;case 19:return H(P),null;case 4:return fh(),null;case 10:return rg(a),null;case 23:case 24:return Ki(),null;default:return null}}
  function Mi(a,b){try{var c="",d=b;do c+=Qa(d),d=d.return;while(d);var e=c;}catch(f){e="\nError generating stack: "+f.message+"\n"+f.stack;}return {value:a,source:b,stack:e}}function Ni(a,b){try{console.error(b.value);}catch(c){setTimeout(function(){throw c;});}}var Oi="function"===typeof WeakMap?WeakMap:Map;function Pi(a,b,c){c=zg(-1,c);c.tag=3;c.payload={element:null};var d=b.value;c.callback=function(){Qi||(Qi=!0,Ri=d);Ni(a,b);};return c}
  function Si(a,b,c){c=zg(-1,c);c.tag=3;var d=a.type.getDerivedStateFromError;if("function"===typeof d){var e=b.value;c.payload=function(){Ni(a,b);return d(e)};}var f=a.stateNode;null!==f&&"function"===typeof f.componentDidCatch&&(c.callback=function(){"function"!==typeof d&&(null===Ti?Ti=new Set([this]):Ti.add(this),Ni(a,b));var c=b.stack;this.componentDidCatch(b.value,{componentStack:null!==c?c:""});});return c}var Ui="function"===typeof WeakSet?WeakSet:Set;
  function Vi(a){var b=a.ref;if(null!==b)if("function"===typeof b)try{b(null);}catch(c){Wi(a,c);}else b.current=null;}function Xi(a,b){switch(b.tag){case 0:case 11:case 15:case 22:return;case 1:if(b.flags&256&&null!==a){var c=a.memoizedProps,d=a.memoizedState;a=b.stateNode;b=a.getSnapshotBeforeUpdate(b.elementType===b.type?c:lg(b.type,c),d);a.__reactInternalSnapshotBeforeUpdate=b;}return;case 3:b.flags&256&&qf(b.stateNode.containerInfo);return;case 5:case 6:case 4:case 17:return}throw Error(y(163));}
  function Yi(a,b,c){switch(c.tag){case 0:case 11:case 15:case 22:b=c.updateQueue;b=null!==b?b.lastEffect:null;if(null!==b){a=b=b.next;do{if(3===(a.tag&3)){var d=a.create;a.destroy=d();}a=a.next;}while(a!==b)}b=c.updateQueue;b=null!==b?b.lastEffect:null;if(null!==b){a=b=b.next;do{var e=a;d=e.next;e=e.tag;0!==(e&4)&&0!==(e&1)&&(Zi(c,a),$i(c,a));a=d;}while(a!==b)}return;case 1:a=c.stateNode;c.flags&4&&(null===b?a.componentDidMount():(d=c.elementType===c.type?b.memoizedProps:lg(c.type,b.memoizedProps),a.componentDidUpdate(d,
  b.memoizedState,a.__reactInternalSnapshotBeforeUpdate)));b=c.updateQueue;null!==b&&Eg(c,b,a);return;case 3:b=c.updateQueue;if(null!==b){a=null;if(null!==c.child)switch(c.child.tag){case 5:a=c.child.stateNode;break;case 1:a=c.child.stateNode;}Eg(c,b,a);}return;case 5:a=c.stateNode;null===b&&c.flags&4&&mf(c.type,c.memoizedProps)&&a.focus();return;case 6:return;case 4:return;case 12:return;case 13:null===c.memoizedState&&(c=c.alternate,null!==c&&(c=c.memoizedState,null!==c&&(c=c.dehydrated,null!==c&&Cc(c))));
  return;case 19:case 17:case 20:case 21:case 23:case 24:return}throw Error(y(163));}
  function aj(a,b){for(var c=a;;){if(5===c.tag){var d=c.stateNode;if(b)d=d.style,"function"===typeof d.setProperty?d.setProperty("display","none","important"):d.display="none";else {d=c.stateNode;var e=c.memoizedProps.style;e=void 0!==e&&null!==e&&e.hasOwnProperty("display")?e.display:null;d.style.display=sb("display",e);}}else if(6===c.tag)c.stateNode.nodeValue=b?"":c.memoizedProps;else if((23!==c.tag&&24!==c.tag||null===c.memoizedState||c===a)&&null!==c.child){c.child.return=c;c=c.child;continue}if(c===
  a)break;for(;null===c.sibling;){if(null===c.return||c.return===a)return;c=c.return;}c.sibling.return=c.return;c=c.sibling;}}
  function bj(a,b){if(Mf&&"function"===typeof Mf.onCommitFiberUnmount)try{Mf.onCommitFiberUnmount(Lf,b);}catch(f){}switch(b.tag){case 0:case 11:case 14:case 15:case 22:a=b.updateQueue;if(null!==a&&(a=a.lastEffect,null!==a)){var c=a=a.next;do{var d=c,e=d.destroy;d=d.tag;if(void 0!==e)if(0!==(d&4))Zi(b,c);else {d=b;try{e();}catch(f){Wi(d,f);}}c=c.next;}while(c!==a)}break;case 1:Vi(b);a=b.stateNode;if("function"===typeof a.componentWillUnmount)try{a.props=b.memoizedProps,a.state=b.memoizedState,a.componentWillUnmount();}catch(f){Wi(b,
  f);}break;case 5:Vi(b);break;case 4:cj(a,b);}}function dj(a){a.alternate=null;a.child=null;a.dependencies=null;a.firstEffect=null;a.lastEffect=null;a.memoizedProps=null;a.memoizedState=null;a.pendingProps=null;a.return=null;a.updateQueue=null;}function ej(a){return 5===a.tag||3===a.tag||4===a.tag}
  function fj(a){a:{for(var b=a.return;null!==b;){if(ej(b))break a;b=b.return;}throw Error(y(160));}var c=b;b=c.stateNode;switch(c.tag){case 5:var d=!1;break;case 3:b=b.containerInfo;d=!0;break;case 4:b=b.containerInfo;d=!0;break;default:throw Error(y(161));}c.flags&16&&(pb(b,""),c.flags&=-17);a:b:for(c=a;;){for(;null===c.sibling;){if(null===c.return||ej(c.return)){c=null;break a}c=c.return;}c.sibling.return=c.return;for(c=c.sibling;5!==c.tag&&6!==c.tag&&18!==c.tag;){if(c.flags&2)continue b;if(null===
  c.child||4===c.tag)continue b;else c.child.return=c,c=c.child;}if(!(c.flags&2)){c=c.stateNode;break a}}d?gj(a,c,b):hj(a,c,b);}
  function gj(a,b,c){var d=a.tag,e=5===d||6===d;if(e)a=e?a.stateNode:a.stateNode.instance,b?8===c.nodeType?c.parentNode.insertBefore(a,b):c.insertBefore(a,b):(8===c.nodeType?(b=c.parentNode,b.insertBefore(a,c)):(b=c,b.appendChild(a)),c=c._reactRootContainer,null!==c&&void 0!==c||null!==b.onclick||(b.onclick=jf));else if(4!==d&&(a=a.child,null!==a))for(gj(a,b,c),a=a.sibling;null!==a;)gj(a,b,c),a=a.sibling;}
  function hj(a,b,c){var d=a.tag,e=5===d||6===d;if(e)a=e?a.stateNode:a.stateNode.instance,b?c.insertBefore(a,b):c.appendChild(a);else if(4!==d&&(a=a.child,null!==a))for(hj(a,b,c),a=a.sibling;null!==a;)hj(a,b,c),a=a.sibling;}
  function cj(a,b){for(var c=b,d=!1,e,f;;){if(!d){d=c.return;a:for(;;){if(null===d)throw Error(y(160));e=d.stateNode;switch(d.tag){case 5:f=!1;break a;case 3:e=e.containerInfo;f=!0;break a;case 4:e=e.containerInfo;f=!0;break a}d=d.return;}d=!0;}if(5===c.tag||6===c.tag){a:for(var g=a,h=c,k=h;;)if(bj(g,k),null!==k.child&&4!==k.tag)k.child.return=k,k=k.child;else {if(k===h)break a;for(;null===k.sibling;){if(null===k.return||k.return===h)break a;k=k.return;}k.sibling.return=k.return;k=k.sibling;}f?(g=e,h=c.stateNode,
  8===g.nodeType?g.parentNode.removeChild(h):g.removeChild(h)):e.removeChild(c.stateNode);}else if(4===c.tag){if(null!==c.child){e=c.stateNode.containerInfo;f=!0;c.child.return=c;c=c.child;continue}}else if(bj(a,c),null!==c.child){c.child.return=c;c=c.child;continue}if(c===b)break;for(;null===c.sibling;){if(null===c.return||c.return===b)return;c=c.return;4===c.tag&&(d=!1);}c.sibling.return=c.return;c=c.sibling;}}
  function ij(a,b){switch(b.tag){case 0:case 11:case 14:case 15:case 22:var c=b.updateQueue;c=null!==c?c.lastEffect:null;if(null!==c){var d=c=c.next;do 3===(d.tag&3)&&(a=d.destroy,d.destroy=void 0,void 0!==a&&a()),d=d.next;while(d!==c)}return;case 1:return;case 5:c=b.stateNode;if(null!=c){d=b.memoizedProps;var e=null!==a?a.memoizedProps:d;a=b.type;var f=b.updateQueue;b.updateQueue=null;if(null!==f){c[xf]=d;"input"===a&&"radio"===d.type&&null!=d.name&&$a(c,d);wb(a,e);b=wb(a,d);for(e=0;e<f.length;e+=
  2){var g=f[e],h=f[e+1];"style"===g?tb(c,h):"dangerouslySetInnerHTML"===g?ob(c,h):"children"===g?pb(c,h):qa(c,g,h,b);}switch(a){case "input":ab(c,d);break;case "textarea":ib(c,d);break;case "select":a=c._wrapperState.wasMultiple,c._wrapperState.wasMultiple=!!d.multiple,f=d.value,null!=f?fb(c,!!d.multiple,f,!1):a!==!!d.multiple&&(null!=d.defaultValue?fb(c,!!d.multiple,d.defaultValue,!0):fb(c,!!d.multiple,d.multiple?[]:"",!1));}}}return;case 6:if(null===b.stateNode)throw Error(y(162));b.stateNode.nodeValue=
  b.memoizedProps;return;case 3:c=b.stateNode;c.hydrate&&(c.hydrate=!1,Cc(c.containerInfo));return;case 12:return;case 13:null!==b.memoizedState&&(jj=O(),aj(b.child,!0));kj(b);return;case 19:kj(b);return;case 17:return;case 23:case 24:aj(b,null!==b.memoizedState);return}throw Error(y(163));}function kj(a){var b=a.updateQueue;if(null!==b){a.updateQueue=null;var c=a.stateNode;null===c&&(c=a.stateNode=new Ui);b.forEach(function(b){var d=lj.bind(null,a,b);c.has(b)||(c.add(b),b.then(d,d));});}}
  function mj(a,b){return null!==a&&(a=a.memoizedState,null===a||null!==a.dehydrated)?(b=b.memoizedState,null!==b&&null===b.dehydrated):!1}var nj=Math.ceil,oj=ra.ReactCurrentDispatcher,pj=ra.ReactCurrentOwner,X=0,U=null,Y=null,W=0,qj=0,rj=Bf(0),V=0,sj=null,tj=0,Dg=0,Hi=0,uj=0,vj=null,jj=0,Ji=Infinity;function wj(){Ji=O()+500;}var Z=null,Qi=!1,Ri=null,Ti=null,xj=!1,yj=null,zj=90,Aj=[],Bj=[],Cj=null,Dj=0,Ej=null,Fj=-1,Gj=0,Hj=0,Ij=null,Jj=!1;function Hg(){return 0!==(X&48)?O():-1!==Fj?Fj:Fj=O()}
  function Ig(a){a=a.mode;if(0===(a&2))return 1;if(0===(a&4))return 99===eg()?1:2;0===Gj&&(Gj=tj);if(0!==kg.transition){0!==Hj&&(Hj=null!==vj?vj.pendingLanes:0);a=Gj;var b=4186112&~Hj;b&=-b;0===b&&(a=4186112&~a,b=a&-a,0===b&&(b=8192));return b}a=eg();0!==(X&4)&&98===a?a=Xc(12,Gj):(a=Sc(a),a=Xc(a,Gj));return a}
  function Jg(a,b,c){if(50<Dj)throw Dj=0,Ej=null,Error(y(185));a=Kj(a,b);if(null===a)return null;$c(a,b,c);a===U&&(Hi|=b,4===V&&Ii(a,W));var d=eg();1===b?0!==(X&8)&&0===(X&48)?Lj(a):(Mj(a,c),0===X&&(wj(),ig())):(0===(X&4)||98!==d&&99!==d||(null===Cj?Cj=new Set([a]):Cj.add(a)),Mj(a,c));vj=a;}function Kj(a,b){a.lanes|=b;var c=a.alternate;null!==c&&(c.lanes|=b);c=a;for(a=a.return;null!==a;)a.childLanes|=b,c=a.alternate,null!==c&&(c.childLanes|=b),c=a,a=a.return;return 3===c.tag?c.stateNode:null}
  function Mj(a,b){for(var c=a.callbackNode,d=a.suspendedLanes,e=a.pingedLanes,f=a.expirationTimes,g=a.pendingLanes;0<g;){var h=31-Vc(g),k=1<<h,l=f[h];if(-1===l){if(0===(k&d)||0!==(k&e)){l=b;Rc(k);var n=F;f[h]=10<=n?l+250:6<=n?l+5E3:-1;}}else l<=b&&(a.expiredLanes|=k);g&=~k;}d=Uc(a,a===U?W:0);b=F;if(0===d)null!==c&&(c!==Zf&&Pf(c),a.callbackNode=null,a.callbackPriority=0);else {if(null!==c){if(a.callbackPriority===b)return;c!==Zf&&Pf(c);}15===b?(c=Lj.bind(null,a),null===ag?(ag=[c],bg=Of(Uf,jg)):ag.push(c),
  c=Zf):14===b?c=hg(99,Lj.bind(null,a)):(c=Tc(b),c=hg(c,Nj.bind(null,a)));a.callbackPriority=b;a.callbackNode=c;}}
  function Nj(a){Fj=-1;Hj=Gj=0;if(0!==(X&48))throw Error(y(327));var b=a.callbackNode;if(Oj()&&a.callbackNode!==b)return null;var c=Uc(a,a===U?W:0);if(0===c)return null;var d=c;var e=X;X|=16;var f=Pj();if(U!==a||W!==d)wj(),Qj(a,d);do try{Rj();break}catch(h){Sj(a,h);}while(1);qg();oj.current=f;X=e;null!==Y?d=0:(U=null,W=0,d=V);if(0!==(tj&Hi))Qj(a,0);else if(0!==d){2===d&&(X|=64,a.hydrate&&(a.hydrate=!1,qf(a.containerInfo)),c=Wc(a),0!==c&&(d=Tj(a,c)));if(1===d)throw b=sj,Qj(a,0),Ii(a,c),Mj(a,O()),b;a.finishedWork=
  a.current.alternate;a.finishedLanes=c;switch(d){case 0:case 1:throw Error(y(345));case 2:Uj(a);break;case 3:Ii(a,c);if((c&62914560)===c&&(d=jj+500-O(),10<d)){if(0!==Uc(a,0))break;e=a.suspendedLanes;if((e&c)!==c){Hg();a.pingedLanes|=a.suspendedLanes&e;break}a.timeoutHandle=of(Uj.bind(null,a),d);break}Uj(a);break;case 4:Ii(a,c);if((c&4186112)===c)break;d=a.eventTimes;for(e=-1;0<c;){var g=31-Vc(c);f=1<<g;g=d[g];g>e&&(e=g);c&=~f;}c=e;c=O()-c;c=(120>c?120:480>c?480:1080>c?1080:1920>c?1920:3E3>c?3E3:4320>
  c?4320:1960*nj(c/1960))-c;if(10<c){a.timeoutHandle=of(Uj.bind(null,a),c);break}Uj(a);break;case 5:Uj(a);break;default:throw Error(y(329));}}Mj(a,O());return a.callbackNode===b?Nj.bind(null,a):null}function Ii(a,b){b&=~uj;b&=~Hi;a.suspendedLanes|=b;a.pingedLanes&=~b;for(a=a.expirationTimes;0<b;){var c=31-Vc(b),d=1<<c;a[c]=-1;b&=~d;}}
  function Lj(a){if(0!==(X&48))throw Error(y(327));Oj();if(a===U&&0!==(a.expiredLanes&W)){var b=W;var c=Tj(a,b);0!==(tj&Hi)&&(b=Uc(a,b),c=Tj(a,b));}else b=Uc(a,0),c=Tj(a,b);0!==a.tag&&2===c&&(X|=64,a.hydrate&&(a.hydrate=!1,qf(a.containerInfo)),b=Wc(a),0!==b&&(c=Tj(a,b)));if(1===c)throw c=sj,Qj(a,0),Ii(a,b),Mj(a,O()),c;a.finishedWork=a.current.alternate;a.finishedLanes=b;Uj(a);Mj(a,O());return null}
  function Vj(){if(null!==Cj){var a=Cj;Cj=null;a.forEach(function(a){a.expiredLanes|=24&a.pendingLanes;Mj(a,O());});}ig();}function Wj(a,b){var c=X;X|=1;try{return a(b)}finally{X=c,0===X&&(wj(),ig());}}function Xj(a,b){var c=X;X&=-2;X|=8;try{return a(b)}finally{X=c,0===X&&(wj(),ig());}}function ni(a,b){I(rj,qj);qj|=b;tj|=b;}function Ki(){qj=rj.current;H(rj);}
  function Qj(a,b){a.finishedWork=null;a.finishedLanes=0;var c=a.timeoutHandle;-1!==c&&(a.timeoutHandle=-1,pf(c));if(null!==Y)for(c=Y.return;null!==c;){var d=c;switch(d.tag){case 1:d=d.type.childContextTypes;null!==d&&void 0!==d&&Gf();break;case 3:fh();H(N);H(M);uh();break;case 5:hh(d);break;case 4:fh();break;case 13:H(P);break;case 19:H(P);break;case 10:rg(d);break;case 23:case 24:Ki();}c=c.return;}U=a;Y=Tg(a.current,null);W=qj=tj=b;V=0;sj=null;uj=Hi=Dg=0;}
  function Sj(a,b){do{var c=Y;try{qg();vh.current=Gh;if(yh){for(var d=R.memoizedState;null!==d;){var e=d.queue;null!==e&&(e.pending=null);d=d.next;}yh=!1;}xh=0;T=S=R=null;zh=!1;pj.current=null;if(null===c||null===c.return){V=1;sj=b;Y=null;break}a:{var f=a,g=c.return,h=c,k=b;b=W;h.flags|=2048;h.firstEffect=h.lastEffect=null;if(null!==k&&"object"===typeof k&&"function"===typeof k.then){var l=k;if(0===(h.mode&2)){var n=h.alternate;n?(h.updateQueue=n.updateQueue,h.memoizedState=n.memoizedState,h.lanes=n.lanes):
  (h.updateQueue=null,h.memoizedState=null);}var A=0!==(P.current&1),p=g;do{var C;if(C=13===p.tag){var x=p.memoizedState;if(null!==x)C=null!==x.dehydrated?!0:!1;else {var w=p.memoizedProps;C=void 0===w.fallback?!1:!0!==w.unstable_avoidThisFallback?!0:A?!1:!0;}}if(C){var z=p.updateQueue;if(null===z){var u=new Set;u.add(l);p.updateQueue=u;}else z.add(l);if(0===(p.mode&2)){p.flags|=64;h.flags|=16384;h.flags&=-2981;if(1===h.tag)if(null===h.alternate)h.tag=17;else {var t=zg(-1,1);t.tag=2;Ag(h,t);}h.lanes|=1;break a}k=
  void 0;h=b;var q=f.pingCache;null===q?(q=f.pingCache=new Oi,k=new Set,q.set(l,k)):(k=q.get(l),void 0===k&&(k=new Set,q.set(l,k)));if(!k.has(h)){k.add(h);var v=Yj.bind(null,f,l,h);l.then(v,v);}p.flags|=4096;p.lanes=b;break a}p=p.return;}while(null!==p);k=Error((Ra(h.type)||"A React component")+" suspended while rendering, but no fallback UI was specified.\n\nAdd a <Suspense fallback=...> component higher in the tree to provide a loading indicator or placeholder to display.");}5!==V&&(V=2);k=Mi(k,h);p=
  g;do{switch(p.tag){case 3:f=k;p.flags|=4096;b&=-b;p.lanes|=b;var J=Pi(p,f,b);Bg(p,J);break a;case 1:f=k;var K=p.type,Q=p.stateNode;if(0===(p.flags&64)&&("function"===typeof K.getDerivedStateFromError||null!==Q&&"function"===typeof Q.componentDidCatch&&(null===Ti||!Ti.has(Q)))){p.flags|=4096;b&=-b;p.lanes|=b;var L=Si(p,f,b);Bg(p,L);break a}}p=p.return;}while(null!==p)}Zj(c);}catch(va){b=va;Y===c&&null!==c&&(Y=c=c.return);continue}break}while(1)}
  function Pj(){var a=oj.current;oj.current=Gh;return null===a?Gh:a}function Tj(a,b){var c=X;X|=16;var d=Pj();U===a&&W===b||Qj(a,b);do try{ak();break}catch(e){Sj(a,e);}while(1);qg();X=c;oj.current=d;if(null!==Y)throw Error(y(261));U=null;W=0;return V}function ak(){for(;null!==Y;)bk(Y);}function Rj(){for(;null!==Y&&!Qf();)bk(Y);}function bk(a){var b=ck(a.alternate,a,qj);a.memoizedProps=a.pendingProps;null===b?Zj(a):Y=b;pj.current=null;}
  function Zj(a){var b=a;do{var c=b.alternate;a=b.return;if(0===(b.flags&2048)){c=Gi(c,b,qj);if(null!==c){Y=c;return}c=b;if(24!==c.tag&&23!==c.tag||null===c.memoizedState||0!==(qj&1073741824)||0===(c.mode&4)){for(var d=0,e=c.child;null!==e;)d|=e.lanes|e.childLanes,e=e.sibling;c.childLanes=d;}null!==a&&0===(a.flags&2048)&&(null===a.firstEffect&&(a.firstEffect=b.firstEffect),null!==b.lastEffect&&(null!==a.lastEffect&&(a.lastEffect.nextEffect=b.firstEffect),a.lastEffect=b.lastEffect),1<b.flags&&(null!==
  a.lastEffect?a.lastEffect.nextEffect=b:a.firstEffect=b,a.lastEffect=b));}else {c=Li(b);if(null!==c){c.flags&=2047;Y=c;return}null!==a&&(a.firstEffect=a.lastEffect=null,a.flags|=2048);}b=b.sibling;if(null!==b){Y=b;return}Y=b=a;}while(null!==b);0===V&&(V=5);}function Uj(a){var b=eg();gg(99,dk.bind(null,a,b));return null}
  function dk(a,b){do Oj();while(null!==yj);if(0!==(X&48))throw Error(y(327));var c=a.finishedWork;if(null===c)return null;a.finishedWork=null;a.finishedLanes=0;if(c===a.current)throw Error(y(177));a.callbackNode=null;var d=c.lanes|c.childLanes,e=d,f=a.pendingLanes&~e;a.pendingLanes=e;a.suspendedLanes=0;a.pingedLanes=0;a.expiredLanes&=e;a.mutableReadLanes&=e;a.entangledLanes&=e;e=a.entanglements;for(var g=a.eventTimes,h=a.expirationTimes;0<f;){var k=31-Vc(f),l=1<<k;e[k]=0;g[k]=-1;h[k]=-1;f&=~l;}null!==
  Cj&&0===(d&24)&&Cj.has(a)&&Cj.delete(a);a===U&&(Y=U=null,W=0);1<c.flags?null!==c.lastEffect?(c.lastEffect.nextEffect=c,d=c.firstEffect):d=c:d=c.firstEffect;if(null!==d){e=X;X|=32;pj.current=null;kf=fd;g=Ne();if(Oe(g)){if("selectionStart"in g)h={start:g.selectionStart,end:g.selectionEnd};else a:if(h=(h=g.ownerDocument)&&h.defaultView||window,(l=h.getSelection&&h.getSelection())&&0!==l.rangeCount){h=l.anchorNode;f=l.anchorOffset;k=l.focusNode;l=l.focusOffset;try{h.nodeType,k.nodeType;}catch(va){h=null;
  break a}var n=0,A=-1,p=-1,C=0,x=0,w=g,z=null;b:for(;;){for(var u;;){w!==h||0!==f&&3!==w.nodeType||(A=n+f);w!==k||0!==l&&3!==w.nodeType||(p=n+l);3===w.nodeType&&(n+=w.nodeValue.length);if(null===(u=w.firstChild))break;z=w;w=u;}for(;;){if(w===g)break b;z===h&&++C===f&&(A=n);z===k&&++x===l&&(p=n);if(null!==(u=w.nextSibling))break;w=z;z=w.parentNode;}w=u;}h=-1===A||-1===p?null:{start:A,end:p};}else h=null;h=h||{start:0,end:0};}else h=null;lf={focusedElem:g,selectionRange:h};fd=!1;Ij=null;Jj=!1;Z=d;do try{ek();}catch(va){if(null===
  Z)throw Error(y(330));Wi(Z,va);Z=Z.nextEffect;}while(null!==Z);Ij=null;Z=d;do try{for(g=a;null!==Z;){var t=Z.flags;t&16&&pb(Z.stateNode,"");if(t&128){var q=Z.alternate;if(null!==q){var v=q.ref;null!==v&&("function"===typeof v?v(null):v.current=null);}}switch(t&1038){case 2:fj(Z);Z.flags&=-3;break;case 6:fj(Z);Z.flags&=-3;ij(Z.alternate,Z);break;case 1024:Z.flags&=-1025;break;case 1028:Z.flags&=-1025;ij(Z.alternate,Z);break;case 4:ij(Z.alternate,Z);break;case 8:h=Z;cj(g,h);var J=h.alternate;dj(h);null!==
  J&&dj(J);}Z=Z.nextEffect;}}catch(va){if(null===Z)throw Error(y(330));Wi(Z,va);Z=Z.nextEffect;}while(null!==Z);v=lf;q=Ne();t=v.focusedElem;g=v.selectionRange;if(q!==t&&t&&t.ownerDocument&&Me(t.ownerDocument.documentElement,t)){null!==g&&Oe(t)&&(q=g.start,v=g.end,void 0===v&&(v=q),"selectionStart"in t?(t.selectionStart=q,t.selectionEnd=Math.min(v,t.value.length)):(v=(q=t.ownerDocument||document)&&q.defaultView||window,v.getSelection&&(v=v.getSelection(),h=t.textContent.length,J=Math.min(g.start,h),g=void 0===
  g.end?J:Math.min(g.end,h),!v.extend&&J>g&&(h=g,g=J,J=h),h=Le(t,J),f=Le(t,g),h&&f&&(1!==v.rangeCount||v.anchorNode!==h.node||v.anchorOffset!==h.offset||v.focusNode!==f.node||v.focusOffset!==f.offset)&&(q=q.createRange(),q.setStart(h.node,h.offset),v.removeAllRanges(),J>g?(v.addRange(q),v.extend(f.node,f.offset)):(q.setEnd(f.node,f.offset),v.addRange(q))))));q=[];for(v=t;v=v.parentNode;)1===v.nodeType&&q.push({element:v,left:v.scrollLeft,top:v.scrollTop});"function"===typeof t.focus&&t.focus();for(t=
  0;t<q.length;t++)v=q[t],v.element.scrollLeft=v.left,v.element.scrollTop=v.top;}fd=!!kf;lf=kf=null;a.current=c;Z=d;do try{for(t=a;null!==Z;){var K=Z.flags;K&36&&Yi(t,Z.alternate,Z);if(K&128){q=void 0;var Q=Z.ref;if(null!==Q){var L=Z.stateNode;switch(Z.tag){case 5:q=L;break;default:q=L;}"function"===typeof Q?Q(q):Q.current=q;}}Z=Z.nextEffect;}}catch(va){if(null===Z)throw Error(y(330));Wi(Z,va);Z=Z.nextEffect;}while(null!==Z);Z=null;$f();X=e;}else a.current=c;if(xj)xj=!1,yj=a,zj=b;else for(Z=d;null!==Z;)b=
  Z.nextEffect,Z.nextEffect=null,Z.flags&8&&(K=Z,K.sibling=null,K.stateNode=null),Z=b;d=a.pendingLanes;0===d&&(Ti=null);1===d?a===Ej?Dj++:(Dj=0,Ej=a):Dj=0;c=c.stateNode;if(Mf&&"function"===typeof Mf.onCommitFiberRoot)try{Mf.onCommitFiberRoot(Lf,c,void 0,64===(c.current.flags&64));}catch(va){}Mj(a,O());if(Qi)throw Qi=!1,a=Ri,Ri=null,a;if(0!==(X&8))return null;ig();return null}
  function ek(){for(;null!==Z;){var a=Z.alternate;Jj||null===Ij||(0!==(Z.flags&8)?dc(Z,Ij)&&(Jj=!0):13===Z.tag&&mj(a,Z)&&dc(Z,Ij)&&(Jj=!0));var b=Z.flags;0!==(b&256)&&Xi(a,Z);0===(b&512)||xj||(xj=!0,hg(97,function(){Oj();return null}));Z=Z.nextEffect;}}function Oj(){if(90!==zj){var a=97<zj?97:zj;zj=90;return gg(a,fk)}return !1}function $i(a,b){Aj.push(b,a);xj||(xj=!0,hg(97,function(){Oj();return null}));}function Zi(a,b){Bj.push(b,a);xj||(xj=!0,hg(97,function(){Oj();return null}));}
  function fk(){if(null===yj)return !1;var a=yj;yj=null;if(0!==(X&48))throw Error(y(331));var b=X;X|=32;var c=Bj;Bj=[];for(var d=0;d<c.length;d+=2){var e=c[d],f=c[d+1],g=e.destroy;e.destroy=void 0;if("function"===typeof g)try{g();}catch(k){if(null===f)throw Error(y(330));Wi(f,k);}}c=Aj;Aj=[];for(d=0;d<c.length;d+=2){e=c[d];f=c[d+1];try{var h=e.create;e.destroy=h();}catch(k){if(null===f)throw Error(y(330));Wi(f,k);}}for(h=a.current.firstEffect;null!==h;)a=h.nextEffect,h.nextEffect=null,h.flags&8&&(h.sibling=
  null,h.stateNode=null),h=a;X=b;ig();return !0}function gk(a,b,c){b=Mi(c,b);b=Pi(a,b,1);Ag(a,b);b=Hg();a=Kj(a,1);null!==a&&($c(a,1,b),Mj(a,b));}
  function Wi(a,b){if(3===a.tag)gk(a,a,b);else for(var c=a.return;null!==c;){if(3===c.tag){gk(c,a,b);break}else if(1===c.tag){var d=c.stateNode;if("function"===typeof c.type.getDerivedStateFromError||"function"===typeof d.componentDidCatch&&(null===Ti||!Ti.has(d))){a=Mi(b,a);var e=Si(c,a,1);Ag(c,e);e=Hg();c=Kj(c,1);if(null!==c)$c(c,1,e),Mj(c,e);else if("function"===typeof d.componentDidCatch&&(null===Ti||!Ti.has(d)))try{d.componentDidCatch(b,a);}catch(f){}break}}c=c.return;}}
  function Yj(a,b,c){var d=a.pingCache;null!==d&&d.delete(b);b=Hg();a.pingedLanes|=a.suspendedLanes&c;U===a&&(W&c)===c&&(4===V||3===V&&(W&62914560)===W&&500>O()-jj?Qj(a,0):uj|=c);Mj(a,b);}function lj(a,b){var c=a.stateNode;null!==c&&c.delete(b);b=0;0===b&&(b=a.mode,0===(b&2)?b=1:0===(b&4)?b=99===eg()?1:2:(0===Gj&&(Gj=tj),b=Yc(62914560&~Gj),0===b&&(b=4194304)));c=Hg();a=Kj(a,b);null!==a&&($c(a,b,c),Mj(a,c));}var ck;
  ck=function(a,b,c){var d=b.lanes;if(null!==a)if(a.memoizedProps!==b.pendingProps||N.current)ug=!0;else if(0!==(c&d))ug=0!==(a.flags&16384)?!0:!1;else {ug=!1;switch(b.tag){case 3:ri(b);sh();break;case 5:gh(b);break;case 1:Ff(b.type)&&Jf(b);break;case 4:eh(b,b.stateNode.containerInfo);break;case 10:d=b.memoizedProps.value;var e=b.type._context;I(mg,e._currentValue);e._currentValue=d;break;case 13:if(null!==b.memoizedState){if(0!==(c&b.child.childLanes))return ti(a,b,c);I(P,P.current&1);b=hi(a,b,c);return null!==
  b?b.sibling:null}I(P,P.current&1);break;case 19:d=0!==(c&b.childLanes);if(0!==(a.flags&64)){if(d)return Ai(a,b,c);b.flags|=64;}e=b.memoizedState;null!==e&&(e.rendering=null,e.tail=null,e.lastEffect=null);I(P,P.current);if(d)break;else return null;case 23:case 24:return b.lanes=0,mi(a,b,c)}return hi(a,b,c)}else ug=!1;b.lanes=0;switch(b.tag){case 2:d=b.type;null!==a&&(a.alternate=null,b.alternate=null,b.flags|=2);a=b.pendingProps;e=Ef(b,M.current);tg(b,c);e=Ch(null,b,d,a,e,c);b.flags|=1;if("object"===
  typeof e&&null!==e&&"function"===typeof e.render&&void 0===e.$$typeof){b.tag=1;b.memoizedState=null;b.updateQueue=null;if(Ff(d)){var f=!0;Jf(b);}else f=!1;b.memoizedState=null!==e.state&&void 0!==e.state?e.state:null;xg(b);var g=d.getDerivedStateFromProps;"function"===typeof g&&Gg(b,d,g,a);e.updater=Kg;b.stateNode=e;e._reactInternals=b;Og(b,d,a,c);b=qi(null,b,d,!0,f,c);}else b.tag=0,fi(null,b,e,c),b=b.child;return b;case 16:e=b.elementType;a:{null!==a&&(a.alternate=null,b.alternate=null,b.flags|=2);
  a=b.pendingProps;f=e._init;e=f(e._payload);b.type=e;f=b.tag=hk(e);a=lg(e,a);switch(f){case 0:b=li(null,b,e,a,c);break a;case 1:b=pi(null,b,e,a,c);break a;case 11:b=gi(null,b,e,a,c);break a;case 14:b=ii(null,b,e,lg(e.type,a),d,c);break a}throw Error(y(306,e,""));}return b;case 0:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:lg(d,e),li(a,b,d,e,c);case 1:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:lg(d,e),pi(a,b,d,e,c);case 3:ri(b);d=b.updateQueue;if(null===a||null===d)throw Error(y(282));
  d=b.pendingProps;e=b.memoizedState;e=null!==e?e.element:null;yg(a,b);Cg(b,d,null,c);d=b.memoizedState.element;if(d===e)sh(),b=hi(a,b,c);else {e=b.stateNode;if(f=e.hydrate)kh=rf(b.stateNode.containerInfo.firstChild),jh=b,f=lh=!0;if(f){a=e.mutableSourceEagerHydrationData;if(null!=a)for(e=0;e<a.length;e+=2)f=a[e],f._workInProgressVersionPrimary=a[e+1],th.push(f);c=Zg(b,null,d,c);for(b.child=c;c;)c.flags=c.flags&-3|1024,c=c.sibling;}else fi(a,b,d,c),sh();b=b.child;}return b;case 5:return gh(b),null===a&&
  ph(b),d=b.type,e=b.pendingProps,f=null!==a?a.memoizedProps:null,g=e.children,nf(d,e)?g=null:null!==f&&nf(d,f)&&(b.flags|=16),oi(a,b),fi(a,b,g,c),b.child;case 6:return null===a&&ph(b),null;case 13:return ti(a,b,c);case 4:return eh(b,b.stateNode.containerInfo),d=b.pendingProps,null===a?b.child=Yg(b,null,d,c):fi(a,b,d,c),b.child;case 11:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:lg(d,e),gi(a,b,d,e,c);case 7:return fi(a,b,b.pendingProps,c),b.child;case 8:return fi(a,b,b.pendingProps.children,
  c),b.child;case 12:return fi(a,b,b.pendingProps.children,c),b.child;case 10:a:{d=b.type._context;e=b.pendingProps;g=b.memoizedProps;f=e.value;var h=b.type._context;I(mg,h._currentValue);h._currentValue=f;if(null!==g)if(h=g.value,f=He(h,f)?0:("function"===typeof d._calculateChangedBits?d._calculateChangedBits(h,f):1073741823)|0,0===f){if(g.children===e.children&&!N.current){b=hi(a,b,c);break a}}else for(h=b.child,null!==h&&(h.return=b);null!==h;){var k=h.dependencies;if(null!==k){g=h.child;for(var l=
  k.firstContext;null!==l;){if(l.context===d&&0!==(l.observedBits&f)){1===h.tag&&(l=zg(-1,c&-c),l.tag=2,Ag(h,l));h.lanes|=c;l=h.alternate;null!==l&&(l.lanes|=c);sg(h.return,c);k.lanes|=c;break}l=l.next;}}else g=10===h.tag?h.type===b.type?null:h.child:h.child;if(null!==g)g.return=h;else for(g=h;null!==g;){if(g===b){g=null;break}h=g.sibling;if(null!==h){h.return=g.return;g=h;break}g=g.return;}h=g;}fi(a,b,e.children,c);b=b.child;}return b;case 9:return e=b.type,f=b.pendingProps,d=f.children,tg(b,c),e=vg(e,
  f.unstable_observedBits),d=d(e),b.flags|=1,fi(a,b,d,c),b.child;case 14:return e=b.type,f=lg(e,b.pendingProps),f=lg(e.type,f),ii(a,b,e,f,d,c);case 15:return ki(a,b,b.type,b.pendingProps,d,c);case 17:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:lg(d,e),null!==a&&(a.alternate=null,b.alternate=null,b.flags|=2),b.tag=1,Ff(d)?(a=!0,Jf(b)):a=!1,tg(b,c),Mg(b,d,e),Og(b,d,e,c),qi(null,b,d,!0,a,c);case 19:return Ai(a,b,c);case 23:return mi(a,b,c);case 24:return mi(a,b,c)}throw Error(y(156,b.tag));
  };function ik(a,b,c,d){this.tag=a;this.key=c;this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null;this.index=0;this.ref=null;this.pendingProps=b;this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null;this.mode=d;this.flags=0;this.lastEffect=this.firstEffect=this.nextEffect=null;this.childLanes=this.lanes=0;this.alternate=null;}function nh(a,b,c,d){return new ik(a,b,c,d)}function ji(a){a=a.prototype;return !(!a||!a.isReactComponent)}
  function hk(a){if("function"===typeof a)return ji(a)?1:0;if(void 0!==a&&null!==a){a=a.$$typeof;if(a===Aa)return 11;if(a===Da)return 14}return 2}
  function Tg(a,b){var c=a.alternate;null===c?(c=nh(a.tag,b,a.key,a.mode),c.elementType=a.elementType,c.type=a.type,c.stateNode=a.stateNode,c.alternate=a,a.alternate=c):(c.pendingProps=b,c.type=a.type,c.flags=0,c.nextEffect=null,c.firstEffect=null,c.lastEffect=null);c.childLanes=a.childLanes;c.lanes=a.lanes;c.child=a.child;c.memoizedProps=a.memoizedProps;c.memoizedState=a.memoizedState;c.updateQueue=a.updateQueue;b=a.dependencies;c.dependencies=null===b?null:{lanes:b.lanes,firstContext:b.firstContext};
  c.sibling=a.sibling;c.index=a.index;c.ref=a.ref;return c}
  function Vg(a,b,c,d,e,f){var g=2;d=a;if("function"===typeof a)ji(a)&&(g=1);else if("string"===typeof a)g=5;else a:switch(a){case ua:return Xg(c.children,e,f,b);case Ha:g=8;e|=16;break;case wa:g=8;e|=1;break;case xa:return a=nh(12,c,b,e|8),a.elementType=xa,a.type=xa,a.lanes=f,a;case Ba:return a=nh(13,c,b,e),a.type=Ba,a.elementType=Ba,a.lanes=f,a;case Ca:return a=nh(19,c,b,e),a.elementType=Ca,a.lanes=f,a;case Ia:return vi(c,e,f,b);case Ja:return a=nh(24,c,b,e),a.elementType=Ja,a.lanes=f,a;default:if("object"===
  typeof a&&null!==a)switch(a.$$typeof){case ya:g=10;break a;case za:g=9;break a;case Aa:g=11;break a;case Da:g=14;break a;case Ea:g=16;d=null;break a;case Fa:g=22;break a}throw Error(y(130,null==a?a:typeof a,""));}b=nh(g,c,b,e);b.elementType=a;b.type=d;b.lanes=f;return b}function Xg(a,b,c,d){a=nh(7,a,d,b);a.lanes=c;return a}function vi(a,b,c,d){a=nh(23,a,d,b);a.elementType=Ia;a.lanes=c;return a}function Ug(a,b,c){a=nh(6,a,null,b);a.lanes=c;return a}
  function Wg(a,b,c){b=nh(4,null!==a.children?a.children:[],a.key,b);b.lanes=c;b.stateNode={containerInfo:a.containerInfo,pendingChildren:null,implementation:a.implementation};return b}
  function jk(a,b,c){this.tag=b;this.containerInfo=a;this.finishedWork=this.pingCache=this.current=this.pendingChildren=null;this.timeoutHandle=-1;this.pendingContext=this.context=null;this.hydrate=c;this.callbackNode=null;this.callbackPriority=0;this.eventTimes=Zc(0);this.expirationTimes=Zc(-1);this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0;this.entanglements=Zc(0);this.mutableSourceEagerHydrationData=null;}
  function kk(a,b,c){var d=3<arguments.length&&void 0!==arguments[3]?arguments[3]:null;return {$$typeof:ta,key:null==d?null:""+d,children:a,containerInfo:b,implementation:c}}
  function lk(a,b,c,d){var e=b.current,f=Hg(),g=Ig(e);a:if(c){c=c._reactInternals;b:{if(Zb(c)!==c||1!==c.tag)throw Error(y(170));var h=c;do{switch(h.tag){case 3:h=h.stateNode.context;break b;case 1:if(Ff(h.type)){h=h.stateNode.__reactInternalMemoizedMergedChildContext;break b}}h=h.return;}while(null!==h);throw Error(y(171));}if(1===c.tag){var k=c.type;if(Ff(k)){c=If(c,k,h);break a}}c=h;}else c=Cf;null===b.context?b.context=c:b.pendingContext=c;b=zg(f,g);b.payload={element:a};d=void 0===d?null:d;null!==
  d&&(b.callback=d);Ag(e,b);Jg(e,g,f);return g}function mk(a){a=a.current;if(!a.child)return null;switch(a.child.tag){case 5:return a.child.stateNode;default:return a.child.stateNode}}function nk(a,b){a=a.memoizedState;if(null!==a&&null!==a.dehydrated){var c=a.retryLane;a.retryLane=0!==c&&c<b?c:b;}}function ok(a,b){nk(a,b);(a=a.alternate)&&nk(a,b);}function pk(){return null}
  function qk(a,b,c){var d=null!=c&&null!=c.hydrationOptions&&c.hydrationOptions.mutableSources||null;c=new jk(a,b,null!=c&&!0===c.hydrate);b=nh(3,null,null,2===b?7:1===b?3:0);c.current=b;b.stateNode=c;xg(b);a[ff]=c.current;cf(8===a.nodeType?a.parentNode:a);if(d)for(a=0;a<d.length;a++){b=d[a];var e=b._getVersion;e=e(b._source);null==c.mutableSourceEagerHydrationData?c.mutableSourceEagerHydrationData=[b,e]:c.mutableSourceEagerHydrationData.push(b,e);}this._internalRoot=c;}
  qk.prototype.render=function(a){lk(a,this._internalRoot,null,null);};qk.prototype.unmount=function(){var a=this._internalRoot,b=a.containerInfo;lk(null,a,null,function(){b[ff]=null;});};function rk(a){return !(!a||1!==a.nodeType&&9!==a.nodeType&&11!==a.nodeType&&(8!==a.nodeType||" react-mount-point-unstable "!==a.nodeValue))}
  function sk(a,b){b||(b=a?9===a.nodeType?a.documentElement:a.firstChild:null,b=!(!b||1!==b.nodeType||!b.hasAttribute("data-reactroot")));if(!b)for(var c;c=a.lastChild;)a.removeChild(c);return new qk(a,0,b?{hydrate:!0}:void 0)}
  function tk(a,b,c,d,e){var f=c._reactRootContainer;if(f){var g=f._internalRoot;if("function"===typeof e){var h=e;e=function(){var a=mk(g);h.call(a);};}lk(b,g,a,e);}else {f=c._reactRootContainer=sk(c,d);g=f._internalRoot;if("function"===typeof e){var k=e;e=function(){var a=mk(g);k.call(a);};}Xj(function(){lk(b,g,a,e);});}return mk(g)}ec=function(a){if(13===a.tag){var b=Hg();Jg(a,4,b);ok(a,4);}};fc=function(a){if(13===a.tag){var b=Hg();Jg(a,67108864,b);ok(a,67108864);}};
  gc=function(a){if(13===a.tag){var b=Hg(),c=Ig(a);Jg(a,c,b);ok(a,c);}};hc=function(a,b){return b()};
  yb=function(a,b,c){switch(b){case "input":ab(a,c);b=c.name;if("radio"===c.type&&null!=b){for(c=a;c.parentNode;)c=c.parentNode;c=c.querySelectorAll("input[name="+JSON.stringify(""+b)+'][type="radio"]');for(b=0;b<c.length;b++){var d=c[b];if(d!==a&&d.form===a.form){var e=Db(d);if(!e)throw Error(y(90));Wa(d);ab(d,e);}}}break;case "textarea":ib(a,c);break;case "select":b=c.value,null!=b&&fb(a,!!c.multiple,b,!1);}};Gb=Wj;
  Hb=function(a,b,c,d,e){var f=X;X|=4;try{return gg(98,a.bind(null,b,c,d,e))}finally{X=f,0===X&&(wj(),ig());}};Ib=function(){0===(X&49)&&(Vj(),Oj());};Jb=function(a,b){var c=X;X|=2;try{return a(b)}finally{X=c,0===X&&(wj(),ig());}};function uk(a,b){var c=2<arguments.length&&void 0!==arguments[2]?arguments[2]:null;if(!rk(b))throw Error(y(200));return kk(a,b,null,c)}var vk={Events:[Cb,ue,Db,Eb,Fb,Oj,{current:!1}]},wk={findFiberByHostInstance:wc,bundleType:0,version:"17.0.2",rendererPackageName:"react-dom"};
  var xk={bundleType:wk.bundleType,version:wk.version,rendererPackageName:wk.rendererPackageName,rendererConfig:wk.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:ra.ReactCurrentDispatcher,findHostInstanceByFiber:function(a){a=cc(a);return null===a?null:a.stateNode},findFiberByHostInstance:wk.findFiberByHostInstance||
  pk,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null};if("undefined"!==typeof __REACT_DEVTOOLS_GLOBAL_HOOK__){var yk=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!yk.isDisabled&&yk.supportsFiber)try{Lf=yk.inject(xk),Mf=yk;}catch(a){}}var __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=vk;var createPortal=uk;
  var findDOMNode=function(a){if(null==a)return null;if(1===a.nodeType)return a;var b=a._reactInternals;if(void 0===b){if("function"===typeof a.render)throw Error(y(188));throw Error(y(268,Object.keys(a)));}a=cc(b);a=null===a?null:a.stateNode;return a};var flushSync=function(a,b){var c=X;if(0!==(c&48))return a(b);X|=1;try{if(a)return gg(99,a.bind(null,b))}finally{X=c,ig();}};var hydrate=function(a,b,c){if(!rk(b))throw Error(y(200));return tk(null,a,b,!0,c)};
  var render$1=function(a,b,c){if(!rk(b))throw Error(y(200));return tk(null,a,b,!1,c)};var unmountComponentAtNode=function(a){if(!rk(a))throw Error(y(40));return a._reactRootContainer?(Xj(function(){tk(null,null,a,!1,function(){a._reactRootContainer=null;a[ff]=null;});}),!0):!1};var unstable_batchedUpdates=Wj;var unstable_createPortal=function(a,b){return uk(a,b,2<arguments.length&&void 0!==arguments[2]?arguments[2]:null)};
  var unstable_renderSubtreeIntoContainer=function(a,b,c,d){if(!rk(c))throw Error(y(200));if(null==a||void 0===a._reactInternals)throw Error(y(38));return tk(a,b,c,!1,d)};var version$2="17.0.2";

  var reactDom_production_min = {
  	__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
  	createPortal: createPortal,
  	findDOMNode: findDOMNode,
  	flushSync: flushSync,
  	hydrate: hydrate,
  	render: render$1,
  	unmountComponentAtNode: unmountComponentAtNode,
  	unstable_batchedUpdates: unstable_batchedUpdates,
  	unstable_createPortal: unstable_createPortal,
  	unstable_renderSubtreeIntoContainer: unstable_renderSubtreeIntoContainer,
  	version: version$2
  };

  var reactDom = createCommonjsModule(function (module) {

  function checkDCE() {
    /* global __REACT_DEVTOOLS_GLOBAL_HOOK__ */
    if (
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === 'undefined' ||
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== 'function'
    ) {
      return;
    }
    try {
      // Verify that the code above has been dead code eliminated (DCE'd).
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
    } catch (err) {
      // DevTools shouldn't crash React, no matter what.
      // We should still report in case we break this code.
      console.error(err);
    }
  }

  {
    // DCE check should happen before ReactDOM bundle executes so that
    // DevTools can report bad minification during injection.
    checkDCE();
    module.exports = reactDom_production_min;
  }
  });
  var reactDom_1 = reactDom.render;
  var reactDom_2 = reactDom.hydrate;

  var version$3="1.1.49",_a$1;"undefined"!=typeof window&&(null===(_a$1=window.parent)||void 0===_a$1||_a$1.postMessage({type:"builder.isReactSdk",data:{value:!0,supportsPatchUpdates:"v3",priorVersion:version$3}},"*"))
  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0

  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.

  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** */;var extendStatics$1=function(e,t){return (extendStatics$1=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t;}||function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n]);})(e,t)};function __extends$1(e,t){function n(){this.constructor=e;}extendStatics$1(e,t),e.prototype=null===t?Object.create(t):(n.prototype=t.prototype,new n);}var __assign$1=function(){return (__assign$1=Object.assign||function(e){for(var t,n=1,i=arguments.length;n<i;n++)for(var r in t=arguments[n])Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e}).apply(this,arguments)};function __decorate(e,t,n,i){var r,o=arguments.length,a=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,n):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,n,i);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o<3?r(a):o>3?r(t,n,a):r(t,n))||a);return o>3&&a&&Object.defineProperty(t,n,a),a}function __metadata(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)}function __awaiter$1(e,t,n,i){return new(n||(n=Promise))((function(r,o){function a(e){try{l(i.next(e));}catch(e){o(e);}}function s(e){try{l(i.throw(e));}catch(e){o(e);}}function l(e){e.done?r(e.value):new n((function(t){t(e.value);})).then(a,s);}l((i=i.apply(e,t||[])).next());}))}function __generator$1(e,t){var n,i,r,o,a={label:0,sent:function(){if(1&r[0])throw r[1];return r[1]},trys:[],ops:[]};return o={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function s(o){return function(s){return function(o){if(n)throw new TypeError("Generator is already executing.");for(;a;)try{if(n=1,i&&(r=2&o[0]?i.return:o[0]?i.throw||((r=i.return)&&r.call(i),0):i.next)&&!(r=r.call(i,o[1])).done)return r;switch(i=0,r&&(o=[2&o[0],r.value]),o[0]){case 0:case 1:r=o;break;case 4:return a.label++,{value:o[1],done:!1};case 5:a.label++,i=o[1],o=[0];continue;case 7:o=a.ops.pop(),a.trys.pop();continue;default:if(!(r=a.trys,(r=r.length>0&&r[r.length-1])||6!==o[0]&&2!==o[0])){a=0;continue}if(3===o[0]&&(!r||o[1]>r[0]&&o[1]<r[3])){a.label=o[1];break}if(6===o[0]&&a.label<r[1]){a.label=r[1],r=o;break}if(r&&a.label<r[2]){a.label=r[2],a.ops.push(o);break}r[2]&&a.ops.pop(),a.trys.pop();continue}o=t.call(e,a);}catch(e){o=[6,e],i=0;}finally{n=r=0;}if(5&o[0])throw o[1];return {value:o[0]?o[1]:void 0,done:!0}}([o,s])}}}function __spreadArrays(){for(var e=0,t=0,n=arguments.length;t<n;t++)e+=arguments[t].length;var i=Array(e),r=0;for(t=0;t<n;t++)for(var o=arguments[t],a=0,s=o.length;a<s;a++,r++)i[r]=o[a];return i}var sizeNames=["xsmall","small","medium","large"],sizes={xsmall:{min:0,default:0,max:0},small:{min:320,default:321,max:640},medium:{min:641,default:642,max:991},large:{min:990,default:991,max:1200},getWidthForSize:function(e){return this[e].default},getSizeForWidth:function(e){for(var t=0,n=sizeNames;t<n.length;t++){var i=n[t];if(e<=this[i].max)return i}return "large"}},set=function(e,t,n){if(Object(e)!==e)return e;var i=Array.isArray(t)?t:t.toString().match(/[^.[\]]+/g);return i.slice(0,-1).reduce((function(e,t,n){return Object(e[t])===e[t]?e[t]:e[t]=Math.abs(Number(i[n+1]))>>0==+i[n+1]?[]:{}}),e)[i[i.length-1]]=n,e},safeDynamicRequire=Builder.isServer?eval("require"):function(){return null},fnCache={},api=function(e){return builder};function stringToFunction(e,t,n,i){if(void 0===t&&(t=!0),!e||!e.trim())return function(){};var r=e+":"+t;if(fnCache[r])return fnCache[r];var o=t&&!(e.includes(";")||e.includes(" return ")||e.trim().startsWith("return "))||e.trim().startsWith("builder.run"),a=function(){};try{Builder.isBrowser&&(a=new Function("state","event","block","builder","Device","update","Builder","context","\n          var names = [\n            'state',\n            'event',\n            'block',\n            'builder',\n            'Device',\n            'update',\n            'Builder',\n            'context'\n          ];\n          var rootState = state;\n          if (typeof Proxy !== 'undefined') {\n            rootState = new Proxy(rootState, {\n              set: function () {\n                return false;\n              },\n              get: function (target, key) {\n                if (names.includes(key)) {\n                  return undefined;\n                }\n                return target[key];\n              }\n            });\n          }\n          /* Alias */\n          var ctx = context;\n          with (rootState) {\n            "+(o?"return ("+e+");":e)+";\n          }\n        "));}catch(t){n&&n.push(t);var s=t&&t.message;s&&"string"==typeof s&&i&&-1===i.indexOf(s)&&i.push(s),Builder.isBrowser&&console.warn("Function compile error in "+e,t);}var l=function(){for(var t=[],i=0;i<arguments.length;i++)t[i]=arguments[i];try{if(Builder.isBrowser)return a.apply(void 0,t);var r=safeDynamicRequire("vm2").VM,o=t[0],s=t[1];return new r({timeout:100,sandbox:__assign$1(__assign$1(__assign$1(__assign$1({},o),{state:o}),{builder:api}),{event:s})}).run(e.replace(/(^|;)return /,"$1"))}catch(t){Builder.isBrowser?console.warn("Builder custom code error:",t.message||t,"in",e,t.stack||t):process.env.DEBUG&&console.debug("Builder custom code error:",t.message||t,"in",e,t.stack||t),n&&n.push(t);}};return Builder.isBrowser&&(fnCache[r]=l),l}var isPromise=function(e){return "function"==typeof e.then},isRequestInfo=function(e){return !isPromise(e)},BuilderAsyncRequestsContext=react.createContext({requests:[],errors:[],logs:[]}),BuilderStoreContext=react.createContext({state:{},rootState:{},content:{},context:{},update:function(e){return null}}),applyPatchWithMinimalMutationChain=function(e,t,n){if(void 0===n&&(n=!0),Object(e)!==e)return e;var i=t.path,r=t.op,o=t.value,a=i.split(/\//);""===a[0]&&a.shift();for(var s=n?e:__assign$1({},e),l=s,u=0;u<a.length;u++){var d=u===a.length-1,c=a[u];if(d){if("replace"===r)l[c]=o;else if("add"===r){var p=Number(c);Array.isArray(l)?"-"===c?l.push(o):l.splice(p,0,o):l[c]=o;}else if("remove"===r){p=Number(c);Array.isArray(l)?l.splice(p,1):delete l[c];}}else {var f=a[u+1],m=Object(l[c])===l[c]?l[c]:String(Number(f))===f?[]:{};l=l[c]=Array.isArray(m)?__spreadArrays(m):__assign$1({},m);}}return s},htmlEscape=function(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")},blockToHtmlString=function(e){var t;return ("<"+htmlEscape(e.tagName||"div")+' \n    class="builder-block '+e.id+" "+(e.class||"")+'"\n    builder-id="'+e.id+'"\n  '+Object.keys(e.properties||{}).map((function(t){return htmlEscape(t)+'="'+htmlEscape(e.properties[t])+'"'})).join(" ")+"\n  >"+("Text"===(null===(t=null==e?void 0:e.component)||void 0===t?void 0:t.name)?e.component.options.text:e.children?e.children.map((function(e){return blockToHtmlString(e)})).join(""):"")+"</"+(e.tagName||"div")+">").replace(/\s+/g," ")},Link=function(e){return react.createElement(BuilderStoreContext.Consumer,null,(function(t){return t.renderLink?t.renderLink(e):react.createElement("a",__assign$1({},e))}))},camelCaseToKebabCase$1=function(e){return e?e.replace(/([A-Z])/g,(function(e){return "-"+e[0].toLowerCase()})):""},kebabCaseToCamelCase=function(e){return void 0===e&&(e=""),e.replace(/-([a-z])/g,(function(e){return e[1].toUpperCase()}))},Device={desktop:0,tablet:1,mobile:2},blocksMap={},voidElements=new Set(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr","textarea"]),last=function(e){return e[e.length-1]};function omit$1(e,t){for(var n=Object.assign({},e),i=0,r=t;i<r.length;i++){delete n[r[i]];}return n}var cssCase=function(e){if(!e)return e;var t=camelCaseToKebabCase$1(e);return e[0]===e[0].toUpperCase()&&(t="-"+t),t},fastClone=function(e){return JSON.parse(JSON.stringify(e))};function capitalize(e){if(e)return e[0].toUpperCase()+e.slice(1)}var BuilderBlock=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.state={hasError:!1,updates:0},t.privateState={state:{},rootState:{},context:{},update:function(){}},t.onWindowMessage=function(e){var n=e.data;if(n)switch(n.type){case"builder.selectionChange":if(!(o=n.data))break;var i=o.selection,r=t.block&&t.block.id;r&&Array.isArray(i)&&i.indexOf(r)>-1&&setTimeout((function(){window.$block=t,window.$blocks||(window.$blocks=[]),window.$blocks.push(t);}));break;case"builder.patchUpdates":var o;if(!(o=n.data)||!o.data)break;var a=o.data[t.block.id];if(!a)return;location.href.includes("builder.debug=true")&&t.eval("debugger");for(var s=__assign$1({},t.block),l=0,u=a;l<u.length;l++){var d=u[l];applyPatchWithMinimalMutationChain(s,d);}blocksMap[t.props.block.id]=s,t.setState({updates:t.state.updates+1});}},t}return __extends$1(t,e),Object.defineProperty(t.prototype,"store",{get:function(){return this.privateState},enumerable:!0,configurable:!0}),t.getDerivedStateFromError=function(e){return {hasError:!0}},t.prototype.componentDidCatch=function(e,t){console.error("Builder block error:",e,t);},t.prototype.stringToFunction=function(e,t){return void 0===t&&(t=!0),stringToFunction(e,t,this._errors,this._logs)},Object.defineProperty(t.prototype,"block",{get:function(){return blocksMap[this.props.block.id]||this.props.block},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"emotionCss",{get:function(){var e,t,n,i=this.block;if(Builder.isServer){var r=i.animations&&i.animations[0];if(r&&"hover"!==r.trigger){var o=r&&r.steps&&r.steps[0],a=o&&o.styles;a&&(n=a);}}var s=sizeNames.slice().reverse(),l=this.block,u={};if(l.responsiveStyles)for(var d=0,c=s;d<c.length;d++){var p=c[d];"large"===p?this.props.emailMode||(u["&.builder-block"]=Object.assign({},l.responsiveStyles[p],n)):u["@media only screen and (max-width: "+sizes[p].max+"px)"]={"&.builder-block":l.responsiveStyles[p]};}var f=i.animations&&i.animations.find((function(e){return "hover"===e.trigger}));return f&&(u[":hover"]=(null===(t=null===(e=f.steps)||void 0===e?void 0:e[1])||void 0===t?void 0:t.styles)||{},u.transition="all "+f.duration+"s "+camelCaseToKebabCase$1(f.easing),f.delay&&(u.transitionDelay=f.delay+"s")),u},enumerable:!0,configurable:!0}),t.prototype.eval=function(e){return this.stringToFunction(e)(this.privateState.state,void 0,this.block,builder,Device,this.privateState.update,Builder,this.privateState.context)},t.prototype.componentWillUnmount=function(){Builder.isEditing&&removeEventListener("message",this.onWindowMessage);},t.prototype.componentDidMount=function(){var e,t=this,n=this.block,i=n&&n.animations;if(Builder.isEditing&&addEventListener("message",this.onWindowMessage),i){var r={animations:fastClone(i)};if(n.bindings)for(var o in n.bindings)if((null===(e=o.trim)||void 0===e?void 0:e.call(o))&&o.startsWith("animations.")){var a=this.stringToFunction(n.bindings[o]);void 0!==a&&set(r,o,a(this.privateState.state,null,n,builder,null,null,Builder,this.privateState.context));}Builder.animator.bindAnimations(r.animations.filter((function(e){return "hover"!==e.trigger})).map((function(e){return __assign$1(__assign$1({},e),{elementId:t.block.id})})));}},t.prototype.getElement=function(e,n){var i,r,o,a,s,l=this;void 0===e&&(e=0),void 0===n&&(n=this.privateState.state);var u,d=this.props,c=(d.child,d.fieldName,this.block),p=(c.tagName||"div").toLowerCase();if("template"===p){var f=c.children?c.children.map((function(e){return blockToHtmlString(e)})).join(" "):"";return console.debug("template html",f),jsx("template",__assign$1({},c.properties,{dangerouslySetInnerHTML:{__html:f}}))}var m=c.component&&(c.component.name||c.component.component),h=null;c.component&&!c.component.class&&(c.component&&c.component.tag?u=c.component.tag:(h=Builder.components.find((function(e){return e.name===m}))||null)&&h.class?u=h.class:h&&h.tag?u=h.tag:(null==m?void 0:m.startsWith("Builder:"))?console.warn("Missing @builder.io/widgets installation, please install and import @builder.io/widgets to use "+m.split(":")[1]+" in your content, more info here: https://github.com/BuilderIO/builder/tree/main/packages/widgets"):m&&console.warn("Missing registration for "+m+", have you included the registration in your bundle?"));var g=__assign$1(__assign$1({},c.properties),{style:{}});if(g=__assign$1(__assign$1({},g.properties),g),c.component&&(g.component=fastClone(c.component)),c.bindings)for(var v in c.bindings)if(null===(r=v.trim)||void 0===r?void 0:r.call(v)){var b=this.stringToFunction(c.bindings[v]);set(g,v,b(n,null,c,api(),Device,null,Builder,this.privateState.context));}if(g.hide)return null;if(delete g.hide,("show"in g||c.bindings&&c.bindings.show)&&!g.show)return null;if(delete g.show,c.actions){var y=function(e){if(!(null===(o=e.trim)||void 0===o?void 0:o.call(e)))return "continue";var t=c.actions[e];g["on"+capitalize(e)]=function(e){var i=n;return "undefined"!=typeof Proxy&&(i=new Proxy(n,{set:function(e,t,n){return e[t]=n,l.privateState.rootState[t]=n,!0}})),l.stringToFunction(t,!1)(i,e,l.block,builder,Device,l.privateState.update,Builder,l.privateState.context)};};for(var v in c.actions)y(v);}var _=(g.component||g.options)&&__assign$1(__assign$1({},g.options),g.component.options||g.component.data),x=voidElements.has(p),S=h&&(h.fragment||h.noWrap),k=(null===(a=g.attr)||void 0===a?void 0:a.style)||("string"==typeof g.style?g.style:"")||"";if("string"==typeof k){"object"!=typeof g.style&&(g.style={});for(var w=0,C=k.split(";");w<C.length;w++){var B=C[w].split(":");if(!B.length)return;v=B[0],b=B[1];B.length>2&&(b=B.slice(1).join(":")),g.style[kebabCaseToCamelCase(v)]=b;}}var R=__assign$1(__assign$1(__assign$1({},omit$1(g,["class","component","attr"])),((i={})["string"!=typeof p||p.includes("-")?"class":"className"]="builder-block "+this.id+(c.class?" "+c.class:"")+(!c.component||["Image","Video","Banner"].indexOf(m)>-1?"":" builder-has-component")+(g.class?" "+g.class:"")+(Builder.isEditing&&(null===(s=this.privateState.state._spacer)||void 0===s?void 0:s.parent)===c.id?" builder-spacer-parent":""),i.key=this.id+e,i["builder-id"]=this.id,i)),0!==e&&{"builder-index":e});Builder.isEditing&&(R["builder-inline-styles"]=g.attr&&g.attr.style?Object.keys(g.style).reduce((function(e,t){return (e?e+";":"")+cssCase(t)+":"+g.style[t]+";"}),""):""),(R.properties&&R.properties.href||R.href)&&"div"===p&&(p="a"),"a"===p&&(p=Link);var E=c.children||R.children||[];return jsx(react.Fragment,null,jsx(ClassNames,null,(function(e){var n=e.css;e.cx;if(!l.props.emailMode){var i=" "+n(l.emotionCss);R.class&&(R.class+=i),R.className&&(R.className+=i);}return jsx(BuilderAsyncRequestsContext.Consumer,null,(function(e){return l._asyncRequests=e&&e.requests,l._errors=e&&e.errors,l._logs=e&&e.logs,x?jsx(p,__assign$1({},R)):u&&(S||l.props.emailMode)?jsx(u,__assign$1({},_,{attributes:R,builderBlock:c,builderState:l.privateState})):jsx(p,__assign$1({},R),u&&jsx(u,__assign$1({builderState:l.privateState,builderBlock:c},_)),c.text||g.text?g.text:!u&&E&&Array.isArray(E)&&E.length?E.map((function(e,n){return jsx(t,{key:(l.id||"")+n,block:e,index:n,size:l.props.size,fieldName:l.props.fieldName,child:l.props.child,emailMode:l.props.emailMode})})):null)}))})))},Object.defineProperty(t.prototype,"id",{get:function(){var e=this.block;return e.id.startsWith("builder")?e.id:"builder-"+e.id},enumerable:!0,configurable:!0}),t.prototype.contents=function(e){var t=this,n=this.block;if(this.privateState=e,n.repeat&&n.repeat.collection){var i=n.repeat.collection,r=last((i||"").trim().split("(")[0].trim().split(".")),o=n.repeat.itemName||(r?r+"Item":"item"),a=this.stringToFunction(i)(e.state,null,n,api(),Device,null,Builder,this.privateState.context);return Array.isArray(a)?a.map((function(n,i){var r,a=__assign$1(__assign$1({},e.state),((r={$index:i,$item:n})[o]=n,r["$"+o+"Index"]=i,r));return jsx(BuilderStoreContext.Provider,{key:i,value:__assign$1(__assign$1({},e),{state:a})},t.getElement(i,a))})):null}return this.getElement()},t.prototype.render=function(){var e=this;return this.state.hasError?jsx("span",{css:{display:"inline-block",padding:5,color:"#999",fontSize:11,fontStyle:"italic"}},"Builder block error :( Check console for details"):jsx(BuilderStoreContext.Consumer,null,(function(t){return e.contents(t)}))},t}(react.Component),BuilderBlocks=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.onClickEmptyBlocks=function(){var e;Builder.isIframe&&t.noBlocks&&(null===(e=window.parent)||void 0===e||e.postMessage({type:"builder.clickEmptyBlocks",data:{parentElementId:t.parentId,dataPath:t.path}},"*"));},t.onHoverEmptyBlocks=function(){var e;Builder.isEditing&&t.noBlocks&&(null===(e=window.parent)||void 0===e||e.postMessage({type:"builder.hoverEmptyBlocks",data:{parentElementId:t.parentId,dataPath:t.path}},"*"));},t}return __extends$1(t,e),Object.defineProperty(t.prototype,"isRoot",{get:function(){return !this.props.child},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"noBlocks",{get:function(){var e=this.props.blocks;return !(e&&e.length)},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"path",{get:function(){var e=this.props.dataPath||"";return e.trim()&&(e.startsWith("this.")?e=e.replace("this.",""):e.startsWith("component.options.")||(e="component.options."+e)),e},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"parentId",{get:function(){return this.props.parentElementId?this.props.parentElementId:this.props.parent&&this.props.parent.id},enumerable:!0,configurable:!0}),t.prototype.render=function(){var e=this,t=this.props.blocks,n=this.props.emailMode?"span":"div";return jsx(n,__assign$1({className:"builder-blocks"+(this.noBlocks?" no-blocks":"")+(this.props.child?" builder-blocks-child":"")+(this.props.className?" "+this.props.className:""),"builder-type":"blocks","builder-path":Builder.isIframe?this.path:void 0,"builder-parent-id":this.parentId,css:__assign$1(__assign$1({},!this.props.emailMode&&{display:"flex",flexDirection:"column",alignItems:"stretch"}),this.props.style),onClick:function(){e.noBlocks&&e.onClickEmptyBlocks();}},Builder.isEditing&&{onMouseEnter:function(){return e.onHoverEmptyBlocks()}}),t&&Array.isArray(t)&&t.map((function(t,n){return t&&"@builder.io/sdk:Element"===t["@type"]?jsx(BuilderBlock,{key:t.id,block:t,index:n,fieldName:e.props.fieldName,child:e.props.child,emailMode:e.props.emailMode}):t}))||t)},t}(react.Component),NoWrap=function(e){return e.children};function getData(e){if(void 0!==(null==e?void 0:e.data)){var t=e.data,n=t.blocks,i=t.blocksString,r=Array.isArray(n)||"string"==typeof i,o=__assign$1(__assign$1({},e.data),r&&{blocks:n||JSON.parse(i)});return delete o.blocksString,o}}var variantsScript=function(e,t){return ("\n(function() {\n  if (window.builderNoTrack) {\n    return;\n  }\n\n  var variants = "+e+';\n  function removeVariants() {\n    variants.forEach(function (template) {\n      document.querySelector(\'template[data-template-variant-id="\' + template.id + \'"]\').remove();\n    });\n  }\n\n  if (typeof document.createElement("template").content === \'undefined\') {\n    removeVariants();\n    return ;\n  }\n\n  function setCookie(name,value,days) {\n    var expires = "";\n    if (days) {\n        var date = new Date();\n        date.setTime(date.getTime() + (days*24*60*60*1000));\n        expires = "; expires=" + date.toUTCString();\n    }\n    document.cookie = name + "=" + (value || "")  + expires + "; path=/" + "; Secure; SameSite=None";\n  }\n\n  function getCookie(name) {\n    var nameEQ = name + "=";\n    var ca = document.cookie.split(\';\');\n    for(var i=0;i < ca.length;i++) {\n        var c = ca[i];\n        while (c.charAt(0)==\' \') c = c.substring(1,c.length);\n        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);\n    }\n    return null;\n  }\n  var cookieName = \'builder.tests.'+t+"';\n  var variantInCookie = getCookie(cookieName);\n  var availableIDs = variants.map(function(vr) { return vr.id }).concat('"+t+"');\n  var variantId;\n  if (availableIDs.indexOf(variantInCookie) > -1) {\n    variantId = variantInCookie;\n  }\n  if (!variantId) {\n    var n = 0;\n    var random = Math.random();\n    for (var i = 0; i < variants.length; i++) {\n      var variant = variants[i];\n      var testRatio = variant.testRatio;\n      n += testRatio;\n      if (random < n) {\n        setCookie(cookieName, variant.id);\n        variantId = variant.id;\n        break;\n      }\n    }\n    if (!variantId) {\n      variantId = \""+t+'";\n      setCookie(cookieName, "'+t+'");\n    }\n  }\n  if (variantId && variantId !== "'+t+"\") {\n    var winningTemplate = document.querySelector('template[data-template-variant-id=\"' + variantId + '\"]');\n    if (winningTemplate) {\n      var parentNode = winningTemplate.parentNode;\n      var newParent = parentNode.cloneNode(false);\n      newParent.appendChild(winningTemplate.content.firstChild);\n      parentNode.parentNode.replaceChild(newParent, parentNode);\n    }\n  } else if (variants.length > 0) {\n    removeVariants();\n  }\n})()").replace(/\s+/g," ")},VariantsProvider=function(e){var t=e.initialContent,n=e.children;if(Builder.isBrowser&&!builder.canTrack)return n([t]);if(!Boolean(Object.keys((null==t?void 0:t.variations)||{}).length))return n([t]);var i=Object.keys(t.variations).map((function(e){return __assign$1(__assign$1({id:e},t.variations[e]),{data:getData(t.variations[e])})})),r=__spreadArrays(i,[t]);if(Builder.isServer){var o=JSON.stringify(Object.keys(t.variations||{}).map((function(e){return {id:e,testRatio:t.variations[e].testRatio}})));return react_5(react_7,null,n(r,(function(){return react_5("script",{dangerouslySetInnerHTML:{__html:variantsScript(o,t.id)}})})))}var a="builder.tests."+t.id,s=builder.getCookie(a);if(!s&&Builder.isBrowser)for(var l=0,u=Math.random(),d=0;d<i.length;d++){var c=i[d];if(u<(l+=c.testRatio)){builder.setCookie(a,c.id),s=c.id;break}}return s||(s=t.id,builder.setCookie(a,s)),n([r.find((function(e){return e.id===s}))])},BuilderContent=function(_super){function BuilderContent(){var _this=null!==_super&&_super.apply(this,arguments)||this;return _this.ref=null,_this.state={loading:!_this.props.content,data:getContentWithInfo(_this.props.content),updates:1},_this.onWindowMessage=function(event){var _a,_b,_c,message=event.data;if(message)switch(message.type){case"builder.patchUpdates":if(null===(_a=_this.props.options)||void 0===_a?void 0:_a.noEditorUpdates)return;var data=message.data;if(!data||!data.data)break;var patches=data.data[null===(_b=_this.state.data)||void 0===_b?void 0:_b.id];if(!patches||!patches.length)return;location.href.includes("builder.debug=true")&&eval("debugger");for(var _i=0,patches_1=patches;_i<patches_1.length;_i++){var patch=patches_1[_i];applyPatchWithMinimalMutationChain(_this.state.data,patch);}_this.setState({updates:_this.state.updates+1,data:_this.state.data?__assign$1({},_this.state.data):_this.state.data}),_this.props.contentLoaded&&_this.props.contentLoaded(null===(_c=_this.state.data)||void 0===_c?void 0:_c.data,_this.state.data);}},_this.subscriptions=new Subscription,_this.firstLoad=!0,_this.clicked=!1,_this.trackedImpression=!1,_this.intersectionObserver=null,_this.onClick=function(e){var t=e.nativeEvent,n=_this.data;n&&(builder.autoTrack&&_this.builder.trackInteraction(n.id,_this.renderedVariantId,_this.clicked,t,{content:n}),_this.clicked||(_this.clicked=!0));},_this}return __extends$1(BuilderContent,_super),Object.defineProperty(BuilderContent.prototype,"builder",{get:function(){return this.props.builder||builder},enumerable:!0,configurable:!0}),Object.defineProperty(BuilderContent.prototype,"name",{get:function(){var e=this.props;return "model"in e?e.model:e.modelName},enumerable:!0,configurable:!0}),Object.defineProperty(BuilderContent.prototype,"renderedVariantId",{get:function(){var e,t,n=this.props.isStatic?this.builder.getCookie("builder.tests."+(null===(e=this.data)||void 0===e?void 0:e.id)):null===(t=this.data)||void 0===t?void 0:t.variationId;if(null!==n)return n},enumerable:!0,configurable:!0}),Object.defineProperty(BuilderContent.prototype,"options",{get:function(){var e,t=__assign$1({},this.props.options||{});return this.props.content&&!(null===(e=t.initialContent)||void 0===e?void 0:e.length)&&(t.initialContent=[this.props.content]),t},enumerable:!0,configurable:!0}),Object.defineProperty(BuilderContent.prototype,"data",{get:function(){var e=(this.props.inline||!Builder.isBrowser||this.firstLoad)&&this.options.initialContent&&this.options.initialContent[0]||this.state.data;return getContentWithInfo(e)},enumerable:!0,configurable:!0}),BuilderContent.prototype.componentDidMount=function(){var e,t;if(!this.props.inline||Builder.isEditing)this.subscribeToContent();else if(this.props.inline&&(null===(t=null===(e=this.options)||void 0===e?void 0:e.initialContent)||void 0===t?void 0:t.length)){var n=this.options.initialContent[0];this.builder.trackImpression(n.id,this.renderedVariantId,void 0,{content:n});}Builder.isEditing&&addEventListener("message",this.onWindowMessage);},BuilderContent.prototype.subscribeToContent=function(){var e=this;"_inline"!==this.name&&this.subscriptions.add(builder.queueGetContent(this.name,this.options).subscribe((function(t){var n=t&&t[0];if(e.setState({data:n,loading:!1}),n&&e.firstLoad&&(e.firstLoad=!1,builder.autoTrack&&!Builder.isEditing)){var i=!1;if("function"==typeof IntersectionObserver&&e.ref)try{(e.intersectionObserver=new IntersectionObserver((function(t,i){t.forEach((function(t){t.intersectionRatio>0&&!e.trackedImpression&&(e.builder.trackImpression(n.id,e.renderedVariantId,void 0,{content:e.data}),e.data,e.trackedImpression=!0,e.ref&&i.unobserve(e.ref));}));}))).observe(e.ref),i=!0;}catch(e){console.warn("Could not bind intersection observer");}i||(e.trackedImpression=!0,e.builder.trackImpression(n.id,e.renderedVariantId,void 0,{content:n}));}e.props.contentLoaded&&e.props.contentLoaded(n&&n.data,n);}),(function(t){e.props.contentError&&(e.props.contentError(t),e.setState({loading:!1}));})));},BuilderContent.prototype.componentWillUnmount=function(){Builder.isEditing&&removeEventListener("message",this.onWindowMessage),this.subscriptions.unsubscribe(),this.intersectionObserver&&this.ref&&this.intersectionObserver.unobserve(this.ref);},BuilderContent.prototype.render=function(){var e=this;if(this.props.dataOnly)return null;var t=this.state.loading,n=this.data,i=this.props.dataOnly?NoWrap:"div";return react.createElement(VariantsProvider,{initialContent:n},(function(r,o){return react.createElement(react.Fragment,null,r.map((function(a,s){var l=s===r.length-1?react.Fragment:"template";return react.createElement(react.Fragment,{key:String((null==a?void 0:a.id)+s)},"template"!==l&&(null==o?void 0:o()),react.createElement(l,__assign$1({key:String((null==a?void 0:a.id)+s)},"template"===l&&{"data-template-variant-id":null==a?void 0:a.id}),react.createElement(i,__assign$1({},0===s&&!e.props.dataOnly&&{ref:function(t){return e.ref=t}},{className:"builder-content",onClick:e.onClick,"builder-content-id":null==a?void 0:a.id,"builder-model":e.name}),e.props.children(null==a?void 0:a.data,!e.props.inline&&t,n))))})))}))},BuilderContent}(react.Component),getContentWithInfo=function(e){var t;if(e){var n=builder.getCookie("builder.tests."+e.id),i=n===e.id?e:null===(t=e.variations)||void 0===t?void 0:t[n],r=(null==i?void 0:i.name)||((null==i?void 0:i.id)===e.id?"Default variation":"");return __assign$1(__assign$1({},e),{variationId:n,testVariationId:n,testVariationName:r})}return null};function unwrapExports$1(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}function createCommonjsModule$1(e,t){return e(t={exports:{}},t.exports),t.exports}var onChange_1=createCommonjsModule$1((function(e,t){Object.defineProperty(t,"__esModule",{value:!0});var n=Symbol("target"),i=Symbol("unsubscribe"),r=function(e,t){return t&&t.toString&&(e&&(e+="."),e+=t.toString()),e},o=function(e){return Array.isArray(e)?e.slice():Object.assign({},e)},a=function(e,t,a){if("undefined"==typeof Proxy)return e;void 0===a&&(a={});var s,l,u=Symbol("ProxyTarget"),d=!1,c=!1,p=!1,f=a.equals||Object.is,m=new WeakMap,h=new WeakMap,g=new WeakMap,v=function(e,n,i,a){if(!p)if(d){if(d&&l&&void 0!==i&&void 0!==a&&"length"!==n){var u=l;e!==s&&function(e,t){for(var n;e;)-1===(n=e.indexOf("."))&&(n=e.length),t(e.slice(0,n)),e=e.slice(n+1);}(e=e.replace(s,"").slice(1),(function(e){u[e]=o(u[e]),u=u[e];})),u[n]=i;}c=!0;}else t(r(e,n),a,i);},b=function(e,t){var n=m?m.get(e):void 0;n&&n.delete(t);},y=function(e,t){if(p)return e;h.set(e,t);var n=g.get(e);return void 0===n&&(n=new Proxy(e,x),g.set(e,n)),n},_=function(e){return p||!0===a.ignoreSymbols&&"symbol"==typeof e},x={get:function(e,t,o){if(t===u||t===n)return e;if(t===i&&""===h.get(e))return function(e){return p=!0,m=null,h=null,g=null,e}(e);var s=Reflect.get(e,t,o);if(function(e){return null===e||"object"!=typeof e&&"function"!=typeof e}(s)||function(e){return e instanceof RegExp||e instanceof Number}(s)||"constructor"===t||!0===a.isShallow)return s;var l=function(e,t){var n=m?m.get(e):void 0;if(n)return n;n=new Map,m.set(e,n);var i=n.get(t);return i||(i=Reflect.getOwnPropertyDescriptor(e,t),n.set(t,i)),i}(e,t);if(l&&!l.configurable){if(l.set&&!l.get)return;if(!1===l.writable)return s}return y(s,r(h.get(e),t))},set:function(e,t,n,i){n&&void 0!==n[u]&&(n=n[u]);var r=_(t),o=r?null:Reflect.get(e,t,i),a=Reflect.set(e[u]||e,t,n);return r||f(o,n)||v(h.get(e),t,o,n),a},defineProperty:function(e,t,n){var i=Reflect.defineProperty(e,t,n);return _(t)||(b(e,t),v(h.get(e),t,void 0,n.value)),i},deleteProperty:function(e,t){if(!Reflect.has(e,t))return !0;var n=_(t),i=n?null:Reflect.get(e,t),r=Reflect.deleteProperty(e,t);return n||(b(e,t),v(h.get(e),t,i)),r},apply:function(e,t,n){var i=t instanceof Date;if(i&&(t=t[u]),!d){d=!0,i&&(l=t.valueOf()),(Array.isArray(t)||"[object Object]"===toString.call(t))&&(l=o(t[u])),s=(s=h.get(e)).slice(0,Math.max(s.lastIndexOf("."),0));var r=Reflect.apply(e,t,n);return d=!1,(c||i&&!f(l,t.valueOf()))&&(v(s,"",l,t[u]||t),l=null,c=!1),r}return Reflect.apply(e,t,n)}},S=y(e,"");return t=t.bind(S),S};a.target=function(e){return e[n]||e},a.unsubscribe=function(e){return e[i]||e},e.exports=a,t.default=a;})),onChange=unwrapExports$1(onChange_1),nextTick$1=Builder.nextTick;function debounceNextTick(e,t,n){return void 0===t&&"function"==typeof e?debounceNextTickImpl(e):{configurable:!0,enumerable:n.enumerable,get:function(){return Object.defineProperty(this,t,{configurable:!0,enumerable:n.enumerable,value:debounceNextTickImpl(n.value)}),this[t]}}}function debounceNextTickImpl(e){var t=null,n=null;return function(){var e=t;if(t=[].slice.call(arguments),n=this,null!==e)return;nextTick$1(i);};function i(){e.apply(n,t),t=null,n=null;}}function throttle$1(e,t,n){var i,r,o;void 0===n&&(n={});var a=null,s=0,l=function(){s=!1===n.leading?0:Date.now(),a=null,o=e.apply(i,r),a||(i=r=null);};return function(){var u=Date.now();s||!1!==n.leading||(s=u);var d=t-(u-s);return i=this,r=arguments,d<=0||d>t?(a&&(clearTimeout(a),a=null),s=u,o=e.apply(i,r),a||(i=r=null)):a||!1===n.trailing||(a=setTimeout(l,d)),o}}var BuilderMetaContext=react.createContext({emailMode:!1,ampMode:!1,isServer:!1});function pick(e){for(var t=[],n=1;n<arguments.length;n++)t[n-1]=arguments[n];var i={};return t.forEach((function(t){i[t]=e[t];})),i}function omit$1$1(e){for(var t=[],n=1;n<arguments.length;n++)t[n-1]=arguments[n];var i=__assign$1({},e);return t.forEach((function(e){delete i[e];})),i}var wrapComponent=function(e){return function(t){var n,i=t.builderTag||"div",r=["children"].concat((null===(n=e.inputs)||void 0===n?void 0:n.map((function(e){return e.name})))||[]),o=omit$1$1.apply(void 0,__spreadArrays([t],r,["attributes"])),a=t;return e.noWrap?react.createElement(e.class,__assign$1({attributes:o},a)):react.createElement(i,__assign$1({},o),react.createElement(e.class,__assign$1({},a)))}},size$1=function(e){return Object.keys(e).length};function debounce(e,t,n){var i;return void 0===n&&(n=!1),function(){var r=this,o=arguments;clearTimeout(i),i=setTimeout((function(){i=null,n||e.apply(r,o);}),t),n&&!i&&e.apply(r,o);}}var fontsLoaded=new Set,fetch$1$1=Builder.isBrowser?window.fetch:require("node-fetch"),sizeMap={desktop:"large",tablet:"medium",mobile:"small"};function decorator(e){return function(){for(var t=[],n=0;n<arguments.length;n++)t[n]=arguments[n];if(3===t.length){var i=t[0],r=t[1],o=t[2];if(o&&(o.value||o.get))return t=[],a(i,r,o)}return a;function a(n,i,r){var o,a=r.value?"value":"get";return __assign$1(__assign$1({},r),((o={})[a]=e.apply(void 0,__spreadArrays([r[a]],t)),o))}}}var Throttle=decorator(throttle$1),fetchCache={},tryEval=function(e,t,n){void 0===t&&(t={});var i=e;if("string"==typeof i&&i.trim()){var r=!(i.includes(";")||i.includes(" return ")),o=function(){};try{Builder.isBrowser&&(o=new Function("state","var rootState = state;\n        if (typeof Proxy !== 'undefined') {\n          rootState = new Proxy(rootState, {\n            set: function () {\n              return false;\n            },\n            get: function (target, key) {\n              if (key === 'state') {\n                return state;\n              }\n              return target[key]\n            }\n          });\n        }\n        with (rootState) {\n          "+(r?"return ("+e+");":e)+";\n        }"));}catch(e){Builder.isBrowser&&console.warn("Could not compile javascript",e);}try{return Builder.isBrowser?o(t||{}):new(0,safeDynamicRequire("vm2").VM)({sandbox:__assign$1(__assign$1({},t),{state:t})}).run(i.replace(/(^|;)return /,"$1"))}catch(t){n&&n.push(t),Builder.isBrowser?console.warn("Builder custom code error:",t.message,"in",e,t.stack):process.env.DEBUG&&console.debug("Builder custom code error:",t.message,"in",e,t.stack);}}};function searchToObject(e){var t=(e.search||"").substring(1).split("&"),n={};for(var i in t)if(t[i]&&"string"==typeof t[i]){var r=t[i].split("=");n[decodeURIComponent(r[0])]=decodeURIComponent(r[1]);}return n}var BuilderComponent=function(e){function t(t){var n=e.call(this,t)||this;if(n.subscriptions=new Subscription,n.onStateChange=new BehaviorSubject(null),n.asServer=Builder.isServer,n.contentRef=null,n.styleRef=null,n.rootState=Builder.isServer?{}:onChange({},(function(){return n.updateState()})),n.lastJsCode="",n.lastHttpRequests={},n.httpSubscriptionPerKey={},n.ref=null,n.messageListener=function(e){var t=e.data;switch(t.type){case"builder.updateSpacer":var i=t.data;n.rootState._spacer;n.updateState((function(e){e._spacer=i;}));break;case"builder.resetState":var r=t.data,o=r.state;if(r.model===n.name){for(var a in n.rootState)"function"!=typeof n.rootState[a]&&delete n.rootState[a];Object.assign(n.rootState,o),n.setState(__assign$1(__assign$1({},n.state),{state:n.rootState,updates:(n.state&&n.state.updates||0)+1}));}break;case"builder.resetSymbolState":var s=t.data.state,l=(o=s.state,s.model,s.id);if(n.props.builderBlock&&n.props.builderBlock===l){for(var a in n.rootState)delete n.rootState[a];Object.assign(n.rootState,o),n.setState(__assign$1(__assign$1({},n.state),{state:n.rootState,updates:(n.state&&n.state.updates||0)+1}));}}},n.resizeFn=function(){var e=n.deviceSizeState;e!==n.state.state.deviceSize&&n.setState(__assign$1(__assign$1({},n.state),{updates:(n.state&&n.state.updates||0)+1,state:Object.assign(n.rootState,__assign$1(__assign$1({},n.state.state),{deviceSize:e}))}));},n.resizeListener=Builder.isEditing?throttle$1(n.resizeFn,200):debounce(n.resizeFn,400),n.mounted=!1,n.updateState=function(e){var t=n.rootState;e&&e(t),n.mounted?n.setState({update:n.updateState,state:t,updates:(n.state&&n.state.updates||0)+1}):n.state=__assign$1(__assign$1({},n.state),{update:n.updateState,state:t,updates:(n.state&&n.state.updates||0)+1}),n.notifyStateChange();},n.onContentLoaded=function(e,t){if("page"===n.name&&Builder.isBrowser&&e){var i=e.title,r=e.pageTitle,o=e.description,a=e.pageDescription;if((i||r)&&(document.title=i||r),o||a){var s=document.querySelector('meta[name="description"]');s||((s=document.createElement("meta")).setAttribute("name","description"),document.head.appendChild(s)),s.setAttribute("content",o||a);}}if(Builder.isEditing&&n.notifyStateChange(),n.props.contentLoaded&&n.props.contentLoaded(e,t),e&&e.inputs&&Array.isArray(e.inputs)&&e.inputs.length&&(e.state||(e.state={}),e.inputs.forEach((function(t){t&&t.name&&void 0!==t.defaultValue&&void 0===e.state[t.name]&&(e.state[t.name]=t.defaultValue);}))),e&&e.state){var l=__assign$1(__assign$1({},n.state),{updates:(n.state&&n.state.updates||0)+1,state:Object.assign(n.rootState,__assign$1(__assign$1(__assign$1(__assign$1({},n.state.state),{location:n.locationState,deviceSize:n.deviceSizeState,device:n.device}),e.state),n.props.data))});n.mounted?n.setState(l):n.state=l;}if(e&&e.jsCode&&Builder.isBrowser&&!n.options.codegen){var u=!1;if(Builder.isEditing&&(n.lastJsCode===e.jsCode?u=!0:n.lastJsCode=e.jsCode),!u){var d=n.state.state;try{new Function("data","ref","state","update","element","Builder","builder","context",e.jsCode)(e,n,d,n.state.update,n.ref,Builder,builder,n.state.context);}catch(t){Builder.isBrowser?console.warn("Builder custom code error:",t.message,"in",e.jsCode,t.stack):process.env.DEBUG&&console.debug("Builder custom code error:",t.message,"in",e.jsCode,t.stack);}}}if(e&&e.httpRequests&&!n.props.noAsync&&!(u=!1)){var c=function(t){var i=e.httpRequests[t];if(i&&(!n.data[t]||Builder.isEditing))if(Builder.isBrowser){var r=n.evalExpression(i);if(Builder.isEditing&&n.lastHttpRequests[t]===r)return "continue";n.lastHttpRequests[t]=r;var o=i.match(/builder\.io\/api\/v2\/([^\/\?]+)/i);o&&o[1];n.throttledHandleRequest(t,r);var a=n.httpSubscriptionPerKey[t];a&&a.unsubscribe();var s=n.httpSubscriptionPerKey[t]=n.onStateChange.subscribe((function(){var e=n.evalExpression(i);e!==r&&(n.throttledHandleRequest(t,e),n.lastHttpRequests[t]=e);}));n.subscriptions.add(s);}else n.handleRequest(t,n.evalExpression(i));};for(var p in e.httpRequests)c(p);}},n.state={context:__assign$1(__assign$1({},t.context),{apiKey:builder.apiKey||n.props.apiKey}),state:Object.assign(n.rootState,__assign$1(__assign$1(__assign$1(__assign$1({},n.inlinedContent&&n.inlinedContent.data&&n.inlinedContent.data.state),{isBrowser:Builder.isBrowser,isServer:!Builder.isBrowser,_hydrate:t.hydrate,location:n.locationState,deviceSize:n.deviceSizeState,device:n.device}),n.getHtmlData()),t.data)),updates:0,key:0,update:n.updateState},Builder.isBrowser){var i=n.props.apiKey;if(i&&i!==n.builder.apiKey&&(n.builder.apiKey=i),n.inlinedContent){var r=n.inlinedContent.content||n.inlinedContent;n.onContentLoaded(null==r?void 0:r.data,getContentWithInfo(r));}}return n}return __extends$1(t,e),Object.defineProperty(t.prototype,"options",{get:function(){return __assign$1(__assign$1({},t.defaults),this.props)},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"name",{get:function(){return this.props.model||this.props.modelName||this.props.name},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"element",{get:function(){return this.ref},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"inlinedContent",{get:function(){if(!this.isPreviewing||this.props.inlineContent)return this.props.content},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"builder",{get:function(){return this.props.builder||builder},enumerable:!0,configurable:!0}),t.prototype.getHtmlData=function(){var e=this.inlinedContent&&this.inlinedContent.id||this.props.entry,t=e&&Builder.isBrowser&&document.querySelector('script[data-builder-json="'+e+'"],script[data-builder-state="'+e+'"]');if(t)try{return JSON.parse(t.innerText)}catch(e){console.warn("Could not parse Builder.io HTML data transfer",e,t.innerText);}return {}},Object.defineProperty(t.prototype,"device",{get:function(){return this.builder.getUserAttributes().device||"desktop"},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"locationState",{get:function(){return __assign$1(__assign$1({},pick(this.location,"pathname","hostname","search","host")),{path:this.location.pathname&&this.location.pathname.split("/").slice(1)||"",query:searchToObject(this.location)})},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"deviceSizeState",{get:function(){return Builder.isBrowser?sizes.getSizeForWidth(window.innerWidth):sizeMap[this.device]||"large"},enumerable:!0,configurable:!0}),t.renderInto=function(e,n,i,r){if(void 0===n&&(n={}),void 0===i&&(i=!0),void 0===r&&(r=!1),console.debug("BuilderPage.renderInto",e,n,i,this),e){var o=null;if("string"==typeof e?o=document.querySelector(e):e instanceof Element&&(o=e),o){var a=o.classList.contains("builder-hydrated");if(!a||r){o.classList.add("builder-hydrated");var s=i&&o.innerHTML.includes("builder-block");if(!o.classList.contains("builder-component")){var l=o.querySelector(".builder-api-styles")||(o.previousElementSibling&&o.previousElementSibling.matches(".builder-api-styles")?o.previousElementSibling:null),u="";if(l)l.innerHTML.replace(/\/\*start:([^\*]+?)\*\/([\s\S]*?)\/\*end:([^\*]+?)\*\//g,(function(e,t,n){var i=null;try{i=document.querySelector('[data-emotion-css="'+t+'"]');}catch(e){console.warn(e);}return i?i.innerHTML=n:Builder.isEditing||(u+=e),e})),Builder.nextTick((function(){l.innerHTML=u;}));var d=o.querySelector(".builder-component");d?o=d:s=!1;}location.search.includes("builder.debug=true")&&console.debug("hydrate",s,o);var c=o;if(!a){var p=document.createElement("div");o.insertAdjacentElement("beforebegin",p),p.appendChild(o),c=p;}if((Builder.isEditing||Builder.isBrowser&&location.search.includes("builder.preview="))&&(s=!1),s&&o){var f=reactDom.render(react.createElement(t,__assign$1({},n)),c,c.builderRootRef);return c.builderRootRef=f,f}var m=reactDom.render(react.createElement(t,__assign$1({},n)),c,c.builderRootRef);return c.builderRootRef=m,m}console.debug("Tried to hydrate multiple times");}}},t.prototype.componentDidMount=function(){var e,t=this;this.mounted=!0,this.asServer&&(this.asServer=!1,this.updateState((function(e){e.isBrowser=!0,e.isServer=!1;}))),Builder.isIframe&&(null===(e=window.parent)||void 0===e||e.postMessage({type:"builder.sdkInjected",data:{modelName:this.name}},"*")),Builder.isBrowser&&(window.addEventListener("resize",this.resizeListener),Builder.isEditing&&window.addEventListener("message",this.messageListener),setTimeout((function(){window.dispatchEvent(new CustomEvent("builder:component:load",{detail:{ref:t}}));})));},Object.defineProperty(t.prototype,"isPreviewing",{get:function(){return (Builder.isServer||Builder.isBrowser&&Builder.isPreviewing)&&builder.previewingModel===this.name},enumerable:!0,configurable:!0}),t.prototype.notifyStateChange=function(){if(!Builder.isServer&&this&&this.state){var e=this.state.state;this.props.onStateChange&&this.props.onStateChange(e),Builder.isBrowser&&window.dispatchEvent(new CustomEvent("builder:component:stateChange",{detail:{state:e,ref:this}})),this.onStateChange.next(e);}},t.prototype.processStateFromApi=function(e){return e},Object.defineProperty(t.prototype,"location",{get:function(){return this.props.location||(Builder.isBrowser?location:{})},enumerable:!0,configurable:!0}),t.prototype.getCssFromFont=function(e,t){var n=e.family+(e.kind&&!e.kind.includes("#")?", "+e.kind:""),i=n.split(",")[0],r=e.fileUrl?e.fileUrl:e.files&&e.files.regular,o="";if(r&&n&&i&&(o+=('\n@font-face {\n  font-family: "'+n+'";\n  src: local("'+i+"\"), url('"+r+"') format('woff2');\n  font-display: fallback;\n  font-weight: 400;\n}\n        ").trim()),e.files)for(var a in e.files){if(String(Number(a))===a){var s=e.files[a];s&&s!==r&&(o+=('\n@font-face {\n  font-family: "'+n+"\";\n  src: url('"+s+"') format('woff2');\n  font-display: fallback;\n  font-weight: "+a+";\n}\n          ").trim());}}return o},t.prototype.componentWillUnmount=function(){this.unsubscribe(),Builder.isBrowser&&(window.removeEventListener("resize",this.resizeListener),window.removeEventListener("message",this.messageListener));},t.prototype.getFontCss=function(e){var t=this;return this.builder.allowCustomFonts&&(null==e?void 0:e.customFonts)&&e.customFonts.length&&e.customFonts.map((function(n){return t.getCssFromFont(n,e)})).join(" ")||""},t.prototype.ensureFontsLoaded=function(e){if(this.builder.allowCustomFonts&&(null==e?void 0:e.customFonts)&&Array.isArray(e.customFonts))for(var t=0,n=e.customFonts;t<n.length;t++){var i=n[t],r=i.fileUrl?i.fileUrl:i.files&&i.files.regular;if(!fontsLoaded.has(r)){var o=this.getCssFromFont(i,e);if(fontsLoaded.add(r),!o)continue;var a=document.createElement("style");a.className="builder-custom-font",a.setAttribute("data-builder-custom-font",r),a.innerHTML=o,document.head.appendChild(a);}}},t.prototype.getCss=function(e){var t,n=null===(t=this.useContent)||void 0===t?void 0:t.id,i=(null==e?void 0:e.cssCode)||"";return n&&(i=i.replace(/&/g,".builder-component-"+n)),i+this.getFontCss(e)},Object.defineProperty(t.prototype,"data",{get:function(){var e,t=__assign$1(__assign$1(__assign$1({},this.inlinedContent&&(null===(e=this.inlinedContent.data)||void 0===e?void 0:e.state)),this.props.data),this.state.state);return Object.assign(this.rootState,t),t},enumerable:!0,configurable:!0}),t.prototype.componentDidUpdate=function(e){var t=this;this.props.data&&e.data!==this.props.data&&this.state.update((function(e){Object.assign(e,t.props.data);})),Builder.isEditing&&this.inlinedContent&&e.content!==this.inlinedContent&&this.onContentLoaded(this.inlinedContent.data,this.inlinedContent);},t.prototype.checkStyles=function(e){if(this.styleRef){var t=this.getCss(e);this.styleRef.innerHTML!==t&&(this.styleRef.innerHTML=t);}},t.prototype.reload=function(){this.setState({key:this.state.key+1});},Object.defineProperty(t.prototype,"content",{get:function(){var e=this.inlinedContent;return e&&e.content&&(e=__assign$1(__assign$1({},e),{data:e.content})),e},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"useContent",{get:function(){return this.content||this.state.context.builderContent},enumerable:!0,configurable:!0}),t.prototype.render=function(){var e,t=this,n=this.content,i=Builder.isBrowser&&this.props.data&&size$1(this.props.data)&&hashSum(this.props.data),r=Builder.isEditing?this.name:this.props.entry;r&&!Builder.isEditing&&i&&i.length<300&&(r+=":"+i);var o=this.props.dataOnly?react.Fragment:"div",a=null===(e=this.useContent)||void 0===e?void 0:e.id;return react.createElement(o,{onClick:function(e){!Builder.isEditing||t.props.isChild||t.props.stopClickPropagationWhenEditing||e.stopPropagation();},className:"builder-component "+(a?"builder-component-"+a:""),"data-name":this.name,"data-source":"Rendered by Builder.io",key:this.state.key,ref:function(e){return t.ref=e}},react.createElement(BuilderMetaContext.Consumer,null,(function(e){return react.createElement(BuilderMetaContext.Provider,{value:"boolean"==typeof t.props.ampMode?__assign$1(__assign$1({},e),{ampMode:t.props.ampMode}):e},react.createElement(BuilderAsyncRequestsContext.Consumer,null,(function(e){var i;return t._asyncRequests=e&&e.requests,t._errors=e&&e.errors,t._logs=e&&e.logs,react.createElement(BuilderContent,{isStatic:t.props.isStatic||Builder.isStatic,key:(null===(i=t.inlinedContent)||void 0===i?void 0:i.id)||("content"in t.props&&!t.isPreviewing?"null-content-prop":"no-content-prop"),builder:t.builder,ref:function(e){return t.contentRef=e},contentLoaded:function(e,n){return t.onContentLoaded(e,n)},options:__assign$1(__assign$1(__assign$1(__assign$1(__assign$1({key:r,entry:t.props.entry},n&&{initialContent:[n]}),!n&&"content"in t.props&&!t.isPreviewing&&{initialContent:[]}),t.props.url&&{url:t.props.url}),t.props.options),t.options.codegen&&{format:"react"}),inline:t.props.inlineContent||!t.isPreviewing&&"content"in t.props,contentError:t.props.contentError,modelName:t.name||"page"},(function(e,n,i){var r;if(t.props.dataOnly)return null;i&&i.id&&(t.state.context.builderContent=i),Builder.isBrowser&&Builder.nextTick((function(){t.checkStyles(e);}));var o=t.options.codegen;if(o&&!t.Component&&(null==e?void 0:e.blocksJs)){var a=Array.from(new Set(Builder.components.map((function(e){return e.name})))),s=Builder.components.slice().reverse(),l=a.map((function(e){return s.find((function(t){return t.class&&t.name===e}))})),u=a.map((function(e){return (e||"").replace(/[^\w]+/gi,"")})),d=l.map((function(e){return wrapComponent(e)}));t.Component=(new(Function.bind.apply(Function,__spreadArrays([void 0,"jsx","_css","Builder","builder","React","useBuilderState"],u,[e.blocksJs])))).apply(void 0,__spreadArrays([jsx,css,Builder,builder,react,function(e){var t=react.useState(0)[1];return react.useState((function(){return onChange(e,(function(){t((function(e){return e+1}));}))}))[0]}],d));}return e?react.createElement("div",{"data-builder-component":t.name,"data-builder-content-id":i.id,"data-builder-variation-id":i.testVariationId||i.variationId||i.id},!o&&t.getCss(e)&&react.createElement("style",{ref:function(e){return t.styleRef=e},className:"builder-custom-styles",dangerouslySetInnerHTML:{__html:t.getCss(e)}}),react.createElement(BuilderStoreContext.Provider,{value:__assign$1(__assign$1({},t.state),{rootState:t.rootState,state:t.data,content:i,renderLink:t.props.renderLink})},o&&t.Component?react.createElement(t.Component,{data:t.data,context:t.state.context}):react.createElement(BuilderBlocks,{key:String(!!(null===(r=null==e?void 0:e.blocks)||void 0===r?void 0:r.length)),emailMode:t.props.emailMode,fieldName:"blocks",blocks:e.blocks}))):n?react.createElement("div",{"data-builder-component":t.name,className:"builder-loading"},t.props.children):react.createElement("div",{"data-builder-component":t.name,className:"builder-no-content"})}))})))})))},t.prototype.evalExpression=function(e){var t=this,n=this.data;return e.replace(/{{([^}]+)}}/g,(function(e,i){return tryEval(i,n,t._errors)}))},t.prototype.throttledHandleRequest=function(e,t){return this.handleRequest(e,t)},t.prototype.handleRequest=function(e,t){return __awaiter$1(this,void 0,void 0,(function(){var n,i,r,o,a=this;return __generator$1(this,(function(s){return Builder.isIframe&&fetchCache[t]?(this.updateState((function(n){n[e]=fetchCache[t];})),[2,fetchCache[t]]):(n=function(){return __awaiter$1(a,void 0,void 0,(function(){var n,i,r;return __generator$1(this,(function(o){switch(o.label){case 0:n=Date.now(),Builder.isBrowser||console.time("Fetch "+t),o.label=1;case 1:return o.trys.push([1,4,5,6]),[4,fetch$1$1(t)];case 2:return [4,o.sent().json()];case 3:return i=o.sent(),[3,6];case 4:return r=o.sent(),this._errors&&this._errors.push(r),this._logs&&this._logs.push("Fetch to "+t+" errored in "+(Date.now()-n)+"ms"),[2];case 5:return Builder.isBrowser||(console.timeEnd("Fetch "+t),this._logs&&this._logs.push("Fetched "+t+" in "+(Date.now()-n)+"ms")),[7];case 6:return i&&(Builder.isIframe&&(fetchCache[t]=i),this.updateState((function(t){t[e]=i;}))),[2,i]}}))}))},(i=this._asyncRequests&&this._asyncRequests.find((function(e){return isRequestInfo(e)&&e.url===t})))?((r=i.promise).then((function(t){t&&a.updateState((function(n){n[e]=t;}));})),[2,r]):(o=n(),Builder.nextTick((function(){a._asyncRequests&&a._asyncRequests.push(o);})),[2,o]))}))}))},t.prototype.unsubscribe=function(){this.subscriptions&&(this.subscriptions.unsubscribe(),this.subscriptions=new Subscription);},t.prototype.handleBuilderRequest=function(e,t){var n=this,i=tryEval(t,this.data,this._errors);this.subscriptions&&this.unsubscribe(),i&&this.subscriptions.add(this.builder.queueGetContent(i.model,i).subscribe((function(t){t&&n.updateState((function(n){n[e]=t;}));})));},t.defaults={codegen:Boolean(Builder.isBrowser&&location.href.includes("builder.codegen=true"))},__decorate([debounceNextTick,__metadata("design:type",Function),__metadata("design:paramtypes",[]),__metadata("design:returntype",void 0)],t.prototype,"notifyStateChange",null),__decorate([Throttle(100,{leading:!0,trailing:!0}),__metadata("design:type",Function),__metadata("design:paramtypes",[String,String]),__metadata("design:returntype",void 0)],t.prototype,"throttledHandleRequest",null),t}(react.Component);function BuilderBlock$1(e){return e.type="react",Builder.Component(e)}function withBuilder(e,t){return BuilderBlock$1(t)(e),e}var withChildren=function(e){var t=react.forwardRef((function(t,n){var i=t.children||t.builderBlock&&t.builderBlock.children&&t.builderBlock.children.map((function(e){return react.createElement(BuilderBlock,{key:e.id,block:e})}));return react.createElement(e,__assign$1({},t,{ref:n}),i)}));return t.builderOptions={canHaveChildren:!0},t},noWrap=function(e){var t=react.forwardRef((function(t,n){var i=__assign$1(__assign$1({},t),t.attributes);return react.createElement(e,__assign$1({},i,{ref:n}))}));return t.builderOptions={noWrap:!0},t},iconUrl="https://firebasestorage.googleapis.com/v0/b/builder-3b0a2.appspot.com/o/images%2Fbaseline-text_fields-24px%20(1).svg?alt=media&token=12177b73-0ee3-42ca-98c6-0dd003de1929",TextComponent=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.textRef=null,t}return __extends$1(t,e),t.prototype.componentDidUpdate=function(e){this.allowTextEdit&&(!this.textRef||"true"===this.textRef.contentEditable&&this.textRef===document.activeElement||this.props.text!==e.text&&(this.textRef.innerHTML=this.props.text));},t.prototype.componentDidMount=function(){this.textRef&&(this.textRef.innerHTML=this.props.text);},Object.defineProperty(t.prototype,"allowTextEdit",{get:function(){return Builder.isBrowser&&Builder.isEditing&&location.search.includes("builder.allowTextEdit=true")&&!(this.props.builderBlock&&this.props.builderBlock.bindings&&(this.props.builderBlock.bindings["component.options.text"]||this.props.builderBlock.bindings["options.text"]||this.props.builderBlock.bindings.text))},enumerable:!0,configurable:!0}),t.prototype.render=function(){var e=this,t=this.allowTextEdit,n={outline:"none","& p:first-of-type, & .builder-paragraph:first-of-type":{margin:0},"& > p, & .builder-paragraph":{color:"inherit",lineHeight:"inherit",letterSpacing:"inherit",fontWeight:"inherit",fontSize:"inherit",textAlign:"inherit",fontFamily:"inherit"}};return jsx(BuilderStoreContext.Consumer,null,(function(i){var r;return (null===(r=i.content.meta)||void 0===r?void 0:r.rtlMode)&&(n.direction="rtl"),jsx(react.Fragment,null,jsx("span",__assign$1({ref:function(t){e.textRef=t;},contentEditable:t||void 0,onInput:function(n){var i;t&&(null===(i=window.parent)||void 0===i||i.postMessage({type:"builder.textEdited",data:{id:e.props.builderBlock&&e.props.builderBlock.id,value:n.currentTarget.innerHTML}},"*"));},onKeyDown:function(n){t&&e.textRef&&27===n.which&&document.activeElement===e.textRef&&e.textRef.blur();},onFocus:function(n){var i;t&&(null===(i=window.parent)||void 0===i||i.postMessage({type:"builder.textFocused",data:{id:e.props.builderBlock&&e.props.builderBlock.id}},"*"));},onBlur:function(n){var i;t&&(null===(i=window.parent)||void 0===i||i.postMessage({type:"builder.textBlurred",data:{id:e.props.builderBlock&&e.props.builderBlock.id}},"*"));},css:n,className:"builder-text"},!t&&{dangerouslySetInnerHTML:{__html:e.props.text||e.props.content||""}})))}))},t}(react.Component),Text=withBuilder(TextComponent,{name:"Text",static:!0,image:iconUrl,inputs:[{name:"text",type:"html",required:!0,autoFocus:!0,bubble:!0,defaultValue:"Enter some text..."}],defaultStyles:{lineHeight:"normal",height:"auto",textAlign:"center"}});function Slot(e){var t=e.name,n=react_3(BuilderStoreContext),i=!n.context.symbolId;return jsx("div",__assign$1({css:{pointerEvents:"auto"}},i&&{"builder-slot":t}),jsx(BuilderBlocks,{child:!0,parentElementId:n.context.symbolId,dataPath:"symbol.data."+t,blocks:n.state[t]||[]}))}Builder.registerComponent(Slot,{name:"Slot",description:"Allow child blocks to be inserted into this content when used as a Symbol",docsLink:"https://www.builder.io/c/docs/symbols-with-blocks",image:"https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F3aad6de36eae43b59b52c85190fdef56",inputs:[{name:"name",type:"string",required:!0,defaultValue:"children"}]});var FragmentComponent=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return __extends$1(t,e),t.prototype.render=function(){return this.props.builderBlock&&this.props.builderBlock.children&&this.props.builderBlock.children.map((function(e,t){return react.createElement(BuilderBlock,{block:e,key:e.id,index:t})}))},t}(react.Component),Fragment=withBuilder(FragmentComponent,{name:"Core:Fragment",canHaveChildren:!0,noWrap:!0,static:!0,hideFromInsertMenu:!0}),DEFAULT_ASPECT_RATIO=.7004048582995948,defaultBlocks=[{"@type":"@builder.io/sdk:Element",responsiveStyles:{large:{display:"flex",flexDirection:"column",alignItems:"stretch",flexShrink:"0",position:"relative",marginTop:"30px",textAlign:"center",lineHeight:"normal",height:"auto",minHeight:"20px",minWidth:"20px",overflow:"hidden"}},component:{name:"Image",options:{image:"https://builder.io/api/v1/image/assets%2Fpwgjf0RoYWbdnJSbpBAjXNRMe9F2%2Ffb27a7c790324294af8be1c35fe30f4d",backgroundPosition:"center",backgroundSize:"cover",aspectRatio:DEFAULT_ASPECT_RATIO}}},{"@type":"@builder.io/sdk:Element",responsiveStyles:{large:{display:"flex",flexDirection:"column",alignItems:"stretch",flexShrink:"0",position:"relative",marginTop:"30px",textAlign:"center",lineHeight:"normal",height:"auto"}},component:{name:"Text",options:{text:"<p>Enter some text...</p>"}}}],ColumnsComponent=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return __extends$1(t,e),Object.defineProperty(t.prototype,"columns",{get:function(){return this.props.columns||[]},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"gutterSize",{get:function(){return "number"==typeof this.props.space?this.props.space||0:20},enumerable:!0,configurable:!0}),t.prototype.getWidth=function(e){return this.columns[e]&&this.columns[e].width||100/this.columns.length},t.prototype.getColumnWidth=function(e){var t=this.columns,n=this.gutterSize*(t.length-1)/t.length;return "calc("+this.getWidth(e)+"% - "+n+"px)"},t.prototype.render=function(){var e,t=this,n=this.columns,i=this.gutterSize;return jsx(react.Fragment,null,jsx("div",{className:"builder-columns",css:__assign$1({display:"flex"},"never"!==this.props.stackColumnsAt&&(e={},e["@media (max-width: "+("tablet"!==this.props.stackColumnsAt?639:999)+"px)"]={flexDirection:this.props.reverseColumnsWhenStacked?"column-reverse":"column",alignItems:"stretch"},e))},n.map((function(e,n){var r,o,a=e.link?Link:"div";return jsx(react.Fragment,{key:n},jsx(a,__assign$1({className:"builder-column"},e.link?{href:e.link}:null,{css:__assign$1((r={display:"flex",flexDirection:"column",alignItems:"stretch",lineHeight:"normal"},r["& > .builder-blocks"]={flexGrow:1},r.width=t.getColumnWidth(n),r.marginLeft=0===n?0:i,r),"never"!==t.props.stackColumnsAt&&(o={},o["@media (max-width: "+("tablet"!==t.props.stackColumnsAt?639:999)+"px)"]={width:"100%",marginLeft:0},o))}),jsx(BuilderBlocks,{key:n,child:!0,parentElementId:t.props.builderBlock&&t.props.builderBlock.id,blocks:e.blocks,dataPath:"component.options.columns."+n+".blocks"})))}))))},t}(react.Component),Columns=withBuilder(ColumnsComponent,{name:"Columns",static:!0,inputs:[{name:"columns",type:"array",broadcast:!0,subFields:[{name:"blocks",type:"array",hideFromUI:!0,defaultValue:defaultBlocks},{name:"width",type:"number",hideFromUI:!0,helperText:"Width %, e.g. set to 50 to fill half of the space"},{name:"link",type:"url",helperText:"Optionally set a url that clicking this column will link to"}],defaultValue:[{blocks:defaultBlocks},{blocks:defaultBlocks}],onChange:function(e){function t(){n.forEach((function(e){e.delete("width");}));}var n=e.get("columns");Array.isArray(n)&&(!n.find((function(e){return e.get("width")}))||(n.find((function(e){return !e.get("width")}))||100!==n.reduce((function(e,t){return e+t.get("width")}),0))&&t());}},{name:"space",type:"number",defaultValue:20,helperText:"Size of gap between columns",advanced:!0},{name:"stackColumnsAt",type:"string",defaultValue:"tablet",helperText:"Convert horizontal columns to vertical at what device size",enum:["tablet","mobile","never"],advanced:!0},{name:"reverseColumnsWhenStacked",type:"boolean",defaultValue:!1,helperText:"When stacking columns for mobile devices, reverse the ordering",advanced:!0}]}),EmbedComponent=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.elementRef=null,t.scriptsInserted=new Set,t.scriptsRun=new Set,t}return __extends$1(t,e),t.prototype.componentDidUpdate=function(e){this.props.content!==e.content&&this.findAndRunScripts();},t.prototype.componentDidMount=function(){this.findAndRunScripts();},t.prototype.findAndRunScripts=function(){if(this.elementRef&&"undefined"!=typeof window)for(var e=this.elementRef.getElementsByTagName("script"),t=0;t<e.length;t++){var n=e[t];if(n.src){if(this.scriptsInserted.has(n.src))continue;this.scriptsInserted.add(n.src);var i=document.createElement("script");i.async=!0,i.src=n.src,document.head.appendChild(i);}else {if(this.scriptsRun.has(n.innerText))continue;this.scriptsRun.add(n.innerText);try{new Function(n.innerText)();}catch(e){console.warn("Builder custom code component error:",e);}}}},Object.defineProperty(t.prototype,"content",{get:function(){return Builder.isServer?(this.props.content||"").replace(/<script[\s\S]*?<\/script>/g,""):this.props.content},enumerable:!0,configurable:!0}),t.prototype.render=function(){var e=this;return react.createElement("div",{ref:function(t){return e.elementRef=t},className:"builder-embed",dangerouslySetInnerHTML:{__html:this.content}})},t}(react.Component),Embed=withBuilder(EmbedComponent,{name:"Embed",static:!0,inputs:[{name:"url",type:"url",required:!0,defaultValue:"",helperText:"e.g. enter a youtube url, google map, etc",onChange:function(e){var t=e.get("url");if(t){e.set("content","Loading...");return fetch("https://iframe.ly/api/iframely?url="+t+"&api_key=ae0e60e78201a3f2b0de4b").then((function(e){return e.json()})).then((function(n){e.get("url")===t&&(n.html?e.set("content",n.html):e.set("content","Invalid url, please try another"));})).catch((function(t){e.set("content","There was an error embedding this URL, please try again or another URL");}))}e.delete("content");}},{name:"content",type:"html",defaultValue:'<div style="padding: 20px; text-align: center">(Choose an embed URL)<div>',hideFromUI:!0}]}),globalReplaceNodes={}||null,isShopify=Builder.isBrowser&&"Shopify"in window;if(Builder.isBrowser&&globalReplaceNodes){var customCodeQuerySelector_1=".builder-custom-code";try{var allCustomCodeElements_1=Array.from(document.querySelectorAll(customCodeQuerySelector_1)),builderTemplates=document.querySelectorAll("template[data-template-variant-id]");builderTemplates.length&&Array.from(builderTemplates).forEach((function(e){var t=e.content.querySelectorAll(customCodeQuerySelector_1);t.length&&(allCustomCodeElements_1=allCustomCodeElements_1.concat(Array.from(t)));})),allCustomCodeElements_1.forEach((function(e){var t=e.parentElement,n=t&&t.getAttribute("builder-id");n&&(globalReplaceNodes[n]=globalReplaceNodes[n]||[],globalReplaceNodes[n].push(isShopify?e:e.cloneNode(!0)));}));}catch(e){console.error("Builder replace nodes error:",e);}}var CustomCodeComponent=function(e){function t(t){var n,i=e.call(this,t)||this;if(i.elementRef=null,i.originalRef=null,i.scriptsInserted=new Set,i.scriptsRun=new Set,i.firstLoad=!0,i.replaceNodes=!1,i.state={hydrated:!1},Builder.isBrowser){var r=null===(n=i.props.builderBlock)||void 0===n?void 0:n.id;if(i.replaceNodes=Boolean(Builder.isBrowser&&(t.replaceNodes||isShopify)&&r&&(null==globalReplaceNodes?void 0:globalReplaceNodes[r])),i.firstLoad&&i.props.builderBlock)if(r&&(null==globalReplaceNodes?void 0:globalReplaceNodes[r])){var o=globalReplaceNodes[r].shift()||null;i.originalRef=o,0===globalReplaceNodes[r].length&&delete globalReplaceNodes[r];}else if(i.replaceNodes){var a=document.querySelectorAll("."+i.props.builderBlock.id+" .builder-custom-code");if(1===a.length){var s=a[0];i.originalRef=s,i.originalRef.remove();}}}return i}return __extends$1(t,e),Object.defineProperty(t.prototype,"noReactRender",{get:function(){var e;return Boolean(isShopify&&(null===(e=this.props.code)||void 0===e?void 0:e.match(/{[{%]/g)))},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"isHydrating",{get:function(){return !isShopify&&this.originalRef},enumerable:!0,configurable:!0}),t.prototype.componentDidUpdate=function(e){this.props.code!==e.code&&this.findAndRunScripts();},t.prototype.componentDidMount=function(){var e=this;this.firstLoad=!1,this.replaceNodes||(this.isHydrating?(this.setState({hydrated:!0}),Builder.nextTick((function(){return e.findAndRunScripts()}))):this.findAndRunScripts()),Builder.isBrowser&&this.replaceNodes&&this.originalRef&&this.elementRef&&this.elementRef.appendChild(this.originalRef);},t.prototype.findAndRunScripts=function(){if(this.elementRef&&"undefined"!=typeof window)for(var e=this.elementRef.getElementsByTagName("script"),t=0;t<e.length;t++){var n=e[t];if(n.src){if(this.scriptsInserted.has(n.src))continue;this.scriptsInserted.add(n.src);var i=document.createElement("script");i.async=!0,i.src=n.src,document.head.appendChild(i);}else if(!n.type||["text/javascript","application/javascript","application/ecmascript"].includes(n.type)){if(this.scriptsRun.has(n.innerText))continue;try{this.scriptsRun.add(n.innerText),new Function(n.innerText)();}catch(e){console.warn("Builder custom code component error:",e);}}}},Object.defineProperty(t.prototype,"code",{get:function(){return (Builder.isServer||this.isHydrating&&this.firstLoad)&&this.props.scriptsClientOnly?(this.props.code||"").replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,""):this.props.code},enumerable:!0,configurable:!0}),t.prototype.render=function(){var e=this;return react.createElement("div",__assign$1({ref:function(t){return e.elementRef=t},className:"builder-custom-code"},!this.replaceNodes&&!this.noReactRender&&{dangerouslySetInnerHTML:{__html:this.code}}))},t}(react.Component),CustomCode=withBuilder(CustomCodeComponent,{name:"Custom Code",static:!0,requiredPermissions:["editCode"],inputs:[{name:"code",type:"html",required:!0,defaultValue:"<p>Hello there, I am custom HTML code!</p>",code:!0},__assign$1({name:"replaceNodes",type:"boolean",helperText:"Preserve server rendered dom nodes",advanced:!0},isShopify&&{defaultValue:!0}),__assign$1({name:"scriptsClientOnly",type:"boolean",helperText:"Only print and run scripts on the client. Important when scripts influence DOM that could be replaced when client loads",advanced:!0},!isShopify&&{defaultValue:!0})]});function removeProtocol(e){return e.replace(/http(s)?:/,"")}function isElementInViewport(e){var t=e.getBoundingClientRect();return t.top>=0&&t.left>=0&&t.bottom<=(window.innerHeight||document.documentElement.clientHeight)&&t.right<=(window.innerWidth||document.documentElement.clientWidth)}function getShopifyImageUrl(e,t){if(!e||!(null==e?void 0:e.match(/cdn\.shopify\.com/))||!t)return e;if("master"===t)return removeProtocol(e);var n=e.match(/(_\d+x(\d+)?)?(\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?)/i);if(n){var i=e.split(n[0]),r=n[3],o=t.match("x")?t:t+"x";return removeProtocol(i[0]+"_"+o+r)}return null}var DEFAULT_ASPECT_RATIO$1=.7041;function updateQueryParam(e,t,n){void 0===e&&(e="");var i=new RegExp("([?&])"+t+"=.*?(&|$)","i"),r=-1!==e.indexOf("?")?"&":"?";return e.match(i)?e.replace(i,"$1"+t+"="+encodeURIComponent(n)+"$2"):e+r+t+"="+encodeURIComponent(n)}function getSrcSet(e){if(!e)return e;var t=[100,200,400,800,1200,1600,2e3];if(e.match(/builder\.io/)){var n=e,i=Number(e.split("?width=")[1]);return isNaN(i)||(n=n+" "+i+"w"),t.filter((function(e){return e!==i})).map((function(t){return updateQueryParam(e,"width",t)+" "+t+"w"})).concat([n]).join(", ")}return e.match(/cdn\.shopify\.com/)?t.map((function(t){return [getShopifyImageUrl(e,t+"x"+t),t]})).filter((function(e){return !!e[0]})).map((function(e){return e[0]+" "+e[1]+"w"})).concat([e]).join(", "):e}var getSizes=function(e,t){var n,i,r,o,a,s,l,u,d="";if(e){var c=e.split(","),p=c.length;d=c.map((function(e,t){return p===t+1?e.replace(/\([\s\S]*?\)/g,"").trim():e})).join(", ");}else if(t&&t.responsiveStyles){var f=[],m=!1,h=/^\d+/;if(null===(r=null===(i=null===(n=t.responsiveStyles)||void 0===n?void 0:n.small)||void 0===i?void 0:i.width)||void 0===r?void 0:r.match(h)){m=!0;var g="(max-width: 639px)"+" "+t.responsiveStyles.small.width.replace("%","vw");f.push(g);}if(null===(s=null===(a=null===(o=t.responsiveStyles)||void 0===o?void 0:o.medium)||void 0===a?void 0:a.width)||void 0===s?void 0:s.match(h)){m=!0;g="(max-width: 999px)"+" "+t.responsiveStyles.medium.width.replace("%","vw");f.push(g);}if(null===(u=null===(l=t.responsiveStyles)||void 0===l?void 0:l.large)||void 0===u?void 0:u.width){var v=t.responsiveStyles.large.width.replace("%","vw");f.push(v);}else m&&f.push("100vw");f.length&&(d=f.join(", "));}return d},ImageComponent=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.state={imageLoaded:!t.useLazyLoading,load:!t.useLazyLoading},t.pictureRef=null,t.scrollListener=null,t.intersectionObserver=null,t}return __extends$1(t,e),Object.defineProperty(t.prototype,"useLazyLoading",{get:function(){return (!Builder.isBrowser||!location.search.includes("builder.lazyLoadImages=false"))&&(!(!Builder.isBrowser||!location.href.includes("builder.lazyLoadImages=true"))||this.props.lazy)},enumerable:!0,configurable:!0}),t.prototype.componentWillUnmount=function(){Builder.isBrowser&&(this.scrollListener&&(window.removeEventListener("scroll",this.scrollListener),this.scrollListener=null),this.intersectionObserver&&this.pictureRef&&this.intersectionObserver.unobserve(this.pictureRef));},t.prototype.componentDidMount=function(){var e=this;if(this.props.lazy&&Builder.isBrowser)if(this.pictureRef&&isElementInViewport(this.pictureRef))this.setState({load:!0});else if("function"==typeof IntersectionObserver&&this.pictureRef){(this.intersectionObserver=new IntersectionObserver((function(t,n){t.forEach((function(t){t.intersectionRatio>0&&(e.setState({load:!0}),e.pictureRef&&n.unobserve(e.pictureRef));}));}))).observe(this.pictureRef);}else {var t=throttle$1((function(n){if(e.pictureRef){var i=e.pictureRef.getBoundingClientRect(),r=window.innerHeight/2;i.top<window.innerHeight+r&&(e.setState(__assign$1(__assign$1({},e.state),{load:!0})),window.removeEventListener("scroll",t),e.scrollListener=null);}}),400,{leading:!1,trailing:!0});this.scrollListener=t,window.addEventListener("scroll",t,{capture:!0,passive:!0}),t();}},Object.defineProperty(t.prototype,"image",{get:function(){return this.props.image||this.props.src},enumerable:!0,configurable:!0}),t.prototype.getSrcSet=function(){var e=this.image;if(e&&(e.match(/builder\.io/)||e.match(/cdn\.shopify\.com/)))return getSrcSet(e)},t.prototype.render=function(){var e,t=this,n=this.props,i=n.aspectRatio,r=n.lazy,o=this.props.builderBlock&&this.props.builderBlock.children,a=this.props.srcset,s=getSizes(this.props.sizes,this.props.builderBlock),l=this.image;a&&l&&l.includes("builder.io/api/v1/image")?a.includes(l.split("?")[0])||(console.debug("Removed given srcset"),a=this.getSrcSet()):l&&!a&&(a=this.getSrcSet());var u=null===(e=this.props.builderBlock)||void 0===e?void 0:e.id.startsWith("builder-pixel-"),d=this.props.fitContent;return jsx(BuilderMetaContext.Consumer,null,(function(e){var n,l=e.ampMode,c=l?"amp-img":"img",p=(!r||t.state.load||l)&&jsx(c,__assign$1({},l?{layout:"responsive",height:t.props.height||(i?Math.round(1e3*i):void 0),width:t.props.width||(i?Math.round(1e3/i):void 0)}:null,{alt:t.props.altText,key:Builder.isEditing&&"string"==typeof t.image&&t.image.split("?")[0]||void 0,role:t.props.altText?void 0:"presentation",css:__assign$1(__assign$1({opacity:l?1:t.useLazyLoading&&!t.state.imageLoaded?0:1,transition:"opacity 0.2s ease-in-out",objectFit:t.props.backgroundSize||"cover",objectPosition:t.props.backgroundPosition||"center"},i&&!l&&{position:"absolute",height:"100%",width:"100%",left:0,top:0}),l&&(n={},n["& img"]={objectFit:t.props.backgroundSize,objectPosition:t.props.backgroundPosition},n)),loading:u?"eager":"lazy",className:"builder-image"+(t.props.className?" "+t.props.className:""),src:t.image},!l&&{onLoad:function(){return t.setState({imageLoaded:!0})}},{srcSet:a,sizes:!l&&s?s:void 0}));return jsx(react.Fragment,null,l?p:jsx("picture",{ref:function(e){return t.pictureRef=e}},a&&a.match(/builder\.io/)&&!t.props.noWebp&&jsx("source",{srcSet:a.replace(/\?/g,"?format=webp&"),type:"image/webp"}),p),!i||l||d&&o&&o.length?null:jsx("div",{className:"builder-image-sizer",css:{width:"100%",paddingTop:100*i+"%",pointerEvents:"none",fontSize:0}}," "),o&&o.length?d?o.map((function(e,t){return jsx(BuilderBlock,{key:e.id,block:e})})):jsx("div",{css:{display:"flex",flexDirection:"column",alignItems:"stretch",position:"absolute",top:0,left:0,width:"100%",height:"100%"}},o.map((function(e,t){return jsx(BuilderBlock,{key:e.id,block:e})}))):null)}))},t}(react.Component),Image=withBuilder(ImageComponent,{name:"Image",static:!0,image:"https://firebasestorage.googleapis.com/v0/b/builder-3b0a2.appspot.com/o/images%2Fbaseline-insert_photo-24px.svg?alt=media&token=4e5d0ef4-f5e8-4e57-b3a9-38d63a9b9dc4",defaultStyles:{position:"relative",minHeight:"20px",minWidth:"20px",overflow:"hidden"},canHaveChildren:!0,inputs:[{name:"image",type:"file",bubble:!0,allowedFileTypes:["jpeg","jpg","png","svg"],required:!0,defaultValue:"https://cdn.builder.io/api/v1/image/assets%2Fpwgjf0RoYWbdnJSbpBAjXNRMe9F2%2Ffb27a7c790324294af8be1c35fe30f4d",onChange:function(e){e.delete("srcset"),e.delete("noWebp");var t,n,i=e.get("image"),r=e.get("aspectRatio");if(fetch(i).then((function(e){return e.blob()})).then((function(t){t.type.includes("svg")&&e.set("noWebp",!0);})),i&&(!r||.7041===r))return (t=i,void 0===n&&(n=6e4),new Promise((function(e,i){var r=document.createElement("img"),o=!1;r.onload=function(){o=!0,e(r);},r.addEventListener("error",(function(e){console.warn("Image load failed",e.error),i(e.error);})),r.src=t,setTimeout((function(){o||i(new Error("Image load timed out"));}),n);}))).then((function(t){var n,r=e.get("aspectRatio");e.get("image")!==i||r&&.7041!==r||t.width&&t.height&&(e.set("aspectRatio",(n=t.height/t.width,Math.round(1e3*n)/1e3)),e.set("height",t.height),e.set("width",t.width));}))}},{name:"backgroundSize",type:"text",defaultValue:"cover",enum:[{label:"contain",value:"contain",helperText:"The image should never get cropped"},{label:"cover",value:"cover",helperText:"The image should fill its box, cropping when needed"}]},{name:"backgroundPosition",type:"text",defaultValue:"center",enum:["center","top","left","right","bottom","top left","top right","bottom left","bottom right"]},{name:"altText",type:"string",helperText:"Text to display when the user has images off"},{name:"height",type:"number",hideFromUI:!0},{name:"width",type:"number",hideFromUI:!0},{name:"sizes",type:"string",hideFromUI:!0},{name:"srcset",type:"string",hideFromUI:!0},{name:"lazy",type:"boolean",defaultValue:!0,hideFromUI:!0},{name:"fitContent",type:"boolean",helperText:"When child blocks are provided, fit to them instead of using the image's aspect ratio",defaultValue:!0},{name:"aspectRatio",type:"number",helperText:"This is the ratio of height/width, e.g. set to 1.5 for a 300px wide and 200px tall photo. Set to 0 to not force the image to maintain it's aspect ratio",advanced:!0,defaultValue:DEFAULT_ASPECT_RATIO$1}]}),DEFAULT_ASPECT_RATIO$2=.7004048582995948,VideoComponent=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.video=null,t.containerRef=null,t.scrollListener=null,t.state={load:!t.lazyLoad},t}return __extends$1(t,e),Object.defineProperty(t.prototype,"lazyLoad",{get:function(){return !1!==this.props.lazyLoad},enumerable:!0,configurable:!0}),t.prototype.updateVideo=function(){var e=this,t=this.video;if(t){["muted","playsInline","autoPlay"].forEach((function(n){var i=n.toLowerCase();e.props[n]?t.setAttribute(i,i):t.removeAttribute(i);}));}},t.prototype.componentDidUpdate=function(){this.updateVideo();},t.prototype.componentDidMount=function(){var e=this;if(this.updateVideo(),this.lazyLoad&&Builder.isBrowser){var t=throttle$1((function(n){if(e.containerRef){var i=e.containerRef.getBoundingClientRect(),r=window.innerHeight/2;i.top<window.innerHeight+r&&(e.setState((function(e){return __assign$1(__assign$1({},e),{load:!0})})),window.removeEventListener("scroll",t),e.scrollListener=null);}}),400,{leading:!1,trailing:!0});this.scrollListener=t,window.addEventListener("scroll",t,{capture:!0,passive:!0}),t();}},t.prototype.componentWillUnmount=function(){Builder.isBrowser&&this.scrollListener&&(window.removeEventListener("scroll",this.scrollListener),this.scrollListener=null);},t.prototype.render=function(){var e=this,t=this.props,n=t.aspectRatio,i=t.children;return jsx("div",{ref:function(t){return e.containerRef=t},css:{position:"relative"}},jsx("video",{key:this.props.video||"no-src",poster:this.props.posterImage,ref:function(t){return e.video=t},autoPlay:this.props.autoPlay,muted:this.props.muted,controls:this.props.controls,loop:this.props.loop,className:"builder-video",css:__assign$1({width:"100%",height:"100%",objectFit:this.props.fit,objectPosition:this.props.position,zIndex:2,borderRadius:1},n?{position:"absolute"}:null)},(!this.lazyLoad||this.state.load)&&jsx("source",{type:"video/mp4",src:this.props.video})),!n||this.props.fitContent&&i?null:jsx("div",{css:{width:"100%",paddingTop:100*n+"%",pointerEvents:"none",fontSize:0}}),i&&this.props.fitContent?jsx("div",{css:{display:"flex",flexDirection:"column",alignItems:"stretch"}},i):i?jsx("div",{css:{pointerEvents:"none",display:"flex",flexDirection:"column",alignItems:"stretch",position:"absolute",top:0,left:0,width:"100%",height:"100%"}},i):null)},t}(react.Component),Video=Builder.registerComponent(withChildren(VideoComponent),{name:"Video",canHaveChildren:!0,defaultStyles:{minHeight:"20px",minWidth:"20px"},image:"https://firebasestorage.googleapis.com/v0/b/builder-3b0a2.appspot.com/o/images%2Fbaseline-videocam-24px%20(1).svg?alt=media&token=49a84e4a-b20e-4977-a650-047f986874bb",inputs:[{name:"video",type:"file",allowedFileTypes:["mp4"],bubble:!0,defaultValue:"https://firebasestorage.googleapis.com/v0/b/builder-3b0a2.appspot.com/o/assets%2FKQlEmWDxA0coC3PK6UvkrjwkIGI2%2F28cb070609f546cdbe5efa20e931aa4b?alt=media&token=912e9551-7a7c-4dfb-86b6-3da1537d1a7f",required:!0},{name:"posterImage",type:"file",allowedFileTypes:["jpeg","png"],helperText:"Image to show before the video plays"},{name:"autoPlay",type:"boolean",defaultValue:!0},{name:"controls",type:"boolean",defaultValue:!1},{name:"muted",type:"boolean",defaultValue:!0},{name:"loop",type:"boolean",defaultValue:!0},{name:"playsInline",type:"boolean",defaultValue:!0},{name:"fit",type:"text",defaultValue:"cover",enum:["contain","cover","fill","auto"]},{name:"fitContent",type:"boolean",helperText:"When child blocks are provided, fit to them instead of using the aspect ratio",defaultValue:!0,advanced:!0},{name:"position",type:"text",defaultValue:"center",enum:["center","top","left","right","bottom","top left","top right","bottom left","bottom right"]},{name:"height",type:"number",advanced:!0},{name:"width",type:"number",advanced:!0},{name:"aspectRatio",type:"number",advanced:!0,defaultValue:DEFAULT_ASPECT_RATIO$2},{name:"lazyLoad",type:"boolean",helperText:'Load this video "lazily" - as in only when a user scrolls near the video. Recommended for optmized performance and bandwidth consumption',defaultValue:!0,advanced:!0}]}),size$1$1=function(e){return Object.keys(e).length},isShopify$1=Builder.isBrowser&&"Shopify"in window,refs={};if(Builder.isBrowser)try{Array.from(document.querySelectorAll("[builder-static-symbol]")).forEach((function(e){var t=e.getAttribute("builder-static-symbol");t&&(refs[t]=e);}));}catch(e){console.error("Builder replace nodes error:",e);}var SymbolComponent=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.ref=null,t.staticRef=null,t}return __extends$1(t,e),Object.defineProperty(t.prototype,"placeholder",{get:function(){return jsx("div",{css:{padding:10}},"Symbols let you reuse dynamic elements across your content. Please choose a model and entry for this symbol.")},enumerable:!0,configurable:!0}),t.prototype.componentDidMount=function(){var e,t,n;this.useStatic&&this.staticRef&&refs[null===(e=this.props.builderBlock)||void 0===e?void 0:e.id]&&(null===(t=this.staticRef.parentNode)||void 0===t||t.replaceChild(refs[null===(n=this.props.builderBlock)||void 0===n?void 0:n.id],this.staticRef));},Object.defineProperty(t.prototype,"useStatic",{get:function(){var e;return Boolean(Builder.isBrowser&&refs[null===(e=this.props.builderBlock)||void 0===e?void 0:e.id]&&!(Builder.isEditing||Builder.isPreviewing))},enumerable:!0,configurable:!0}),t.prototype.render=function(){var e,t=this;if(this.useStatic)return jsx("div",{ref:function(e){return t.staticRef=e}});var n=this.props.symbol,i=!1;n||(i=!0);var r=this.props.dataOnly?NoWrap:this.props.builderBlock&&this.props.builderBlock.tagName||"div",o=n||{},a=o.model,s=o.entry,l=o.data,u=o.content,d=o.inline,c=(null==n?void 0:n.dynamic)||this.props.dynamic;a&&(s||c)||(null===(e=null==u?void 0:u.data)||void 0===e?void 0:e.blocksJs)||d||(i=!0);var p=c?void 0:[a,s].join(":"),f=Builder.isEditing?null:l&&size$1$1(l)&&hashSum(l);p&&f&&f.length<300&&(p+=":"+f);var m=this.props.attributes||{};return jsx(BuilderStoreContext.Consumer,{key:(a||"no model")+":"+(s||"no entry")},(function(e){var o,d,c,f,h,g,v,b,y;return jsx(r,__assign$1({"data-model":a},m,{className:(m.class||m.className||"")+" builder-symbol"+((null==n?void 0:n.inline)?" builder-inline-symbol":"")+((null==n?void 0:n.dynamic)||t.props.dynamic?" builder-dynamic-symbol":"")}),i?t.placeholder:jsx(BuilderComponent,__assign$1({isChild:!0,ref:function(e){return t.ref=e},context:__assign$1(__assign$1({},e.context),{symbolId:null===(o=t.props.builderBlock)||void 0===o?void 0:o.id}),modelName:a,entry:s,data:__assign$1(__assign$1(__assign$1({},l),!!t.props.inheritState&&e.state),null===(v=null===(g=null===(h=null===(f=null===(c=null===(d=t.props.builderBlock)||void 0===d?void 0:d.component)||void 0===c?void 0:c.options)||void 0===f?void 0:f.symbol)||void 0===h?void 0:h.content)||void 0===g?void 0:g.data)||void 0===v?void 0:v.state),renderLink:e.renderLink,inlineContent:null==n?void 0:n.inline},u&&{content:u},{options:{key:p,noEditorUpdates:!0},codegen:!!(null===(b=null==u?void 0:u.data)||void 0===b?void 0:b.blocksJs),hydrate:null===(y=e.state)||void 0===y?void 0:y._hydrate,builderBlock:t.props.builderBlock,dataOnly:t.props.dataOnly}),t.props.children))}))},t}(react.Component),Symbol$1=withBuilder(SymbolComponent,{name:"Symbol",noWrap:!0,static:!0,inputs:[{name:"symbol",type:"uiSymbol"},{name:"dataOnly",helperText:"Make this a data symbol that doesn't display any UI",type:"boolean",defaultValue:!1,advanced:!0,hideFromUI:!0},{name:"inheritState",helperText:"Inherit the parent component state and data",type:"boolean",defaultValue:isShopify$1,advanced:!0},{name:"renderToLiquid",helperText:"Render this symbols contents to liquid. Turn off to fetch with javascript and use custom targeting",type:"boolean",defaultValue:isShopify$1,advanced:!0,hideFromUI:!0},{name:"useChildren",hideFromUI:!0,type:"boolean"}]}),ButtonComponent=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return __extends$1(t,e),t.prototype.render=function(){var e=this.props.link?Link:"span";return react.createElement(e,__assign$1({role:"button",href:this.props.link,target:this.props.openLinkInNewTab?"_blank":void 0},this.props.attributes),this.props.text)},t}(react.Component),Button=withBuilder(ButtonComponent,{name:"Core:Button",image:"https://cdn.builder.io/api/v1/image/assets%2FIsxPKMo2gPRRKeakUztj1D6uqed2%2F81a15681c3e74df09677dfc57a615b13",defaultStyles:{appearance:"none",paddingTop:"15px",paddingBottom:"15px",paddingLeft:"25px",paddingRight:"25px",backgroundColor:"#000000",color:"white",borderRadius:"4px",textAlign:"center",cursor:"pointer"},inputs:[{name:"text",type:"text",defaultValue:"Click me!",bubble:!0},{name:"link",type:"url",bubble:!0},{name:"openLinkInNewTab",type:"boolean",defaultValue:!1,friendlyName:"Open link in new tab"}],static:!0,noWrap:!0}),SectionComponent=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.ref=null,t.unmountCallbacks=[],t.state={inView:!1},t}return __extends$1(t,e),Object.defineProperty(t.prototype,"renderContents",{get:function(){return !0!==this.props.lazyLoad||this.state.inView},enumerable:!0,configurable:!0}),t.prototype.componentWillUnmount=function(){this.unmountCallbacks.forEach((function(e){return e()}));},t.prototype.componentDidMount=function(){var e=this;if(this.props.lazyLoad)if("undefined"!=typeof IntersectionObserver&&this.ref){var t=new IntersectionObserver((function(t,n){t.forEach((function(t){t.intersectionRatio>0&&(e.setState({inView:!0}),e.ref&&n.unobserve(e.ref));}));}));t.observe(this.ref),this.unmountCallbacks.push((function(){e.ref&&t.unobserve(e.ref);}));}else this.setState({inView:!0});},t.prototype.render=function(){var e=this;return jsx("section",{ref:function(t){return e.ref=t},css:__assign$1({width:"100%",alignSelf:"stretch",flexGrow:1,boxSizing:"border-box",maxWidth:this.props.maxWidth,display:"flex",flexDirection:"column",alignItems:"stretch",marginLeft:"auto",marginRight:"auto"},this.renderContents?null:this.props.lazyStyles)},this.renderContents?jsx(react.Fragment,null,this.props.children,this.props.builderBlock&&this.props.builderBlock.children&&this.props.builderBlock.children.map((function(e,t){return jsx(BuilderBlock,{key:e.id,block:e})}))):null)},t}(react.Component),Section=withBuilder(SectionComponent,{name:"Core:Section",static:!0,image:"https://cdn.builder.io/api/v1/image/assets%2FIsxPKMo2gPRRKeakUztj1D6uqed2%2F682efef23ace49afac61748dd305c70a",inputs:[{name:"maxWidth",type:"number",defaultValue:1200},{name:"lazyLoad",type:"boolean",defaultValue:!1,advanced:!0,description:"Only render this section when in view"}],defaultStyles:{paddingLeft:"20px",paddingRight:"20px",paddingTop:"50px",paddingBottom:"50px",marginTop:"0px",width:"100vw",marginLeft:"calc(50% - 50vw)"},canHaveChildren:!0,defaultChildren:[{"@type":"@builder.io/sdk:Element",responsiveStyles:{large:{textAlign:"center"}},component:{name:"Text",options:{text:"<p><b>I am a section! My content keeps from getting too wide, so that it's easy to read even on big screens.</b></p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur</p>"}}}]}),StateProviderComponent=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return __extends$1(t,e),t.prototype.render=function(){var e=this;return react.createElement(BuilderStoreContext.Consumer,null,(function(t){return react.createElement(BuilderStoreContext.Provider,{value:__assign$1(__assign$1({},t),{state:__assign$1(__assign$1({},t.state),e.props.state),context:__assign$1(__assign$1({},t.context),e.props.context)})},e.props.builderBlock&&e.props.builderBlock.children&&e.props.builderBlock.children.map((function(e,t){return react.createElement(BuilderBlock,{block:e,key:e.id,index:t,child:!0})})),e.props.children)}))},t}(react.Component),StateProvider=withBuilder(StateProviderComponent,{name:"Builder:StateProvider",canHaveChildren:!0,static:!0,noWrap:!0,hideFromInsertMenu:!0}),prefetched=new Set;function searchToObject$1(e){var t=(e.search||"").substring(1).split("&"),n={};for(var i in t)if(t[i]&&"string"==typeof t[i]){var r=t[i].split("=");n[decodeURIComponent(r[0])]=decodeURIComponent(r[1]);}return n}var RouterComponent=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.builder=builder,t.routed=!1,t.preloadQueue=0,t.onPopState=function(e){t.updateLocationState();},t.onMouseOverOrTouchStart=function(e){if(!(t.preloadQueue>4)&&!1!==t.props.preloadOnHover){var n=t.findHrefTarget(e);if(n){var i=n.getAttribute("href");if(i){if(!t.isRelative(i)){var r=t.convertToRelative(i);if(!r)return;i=r;}if(!i.startsWith("#")&&!prefetched.has(i)){prefetched.add(i);var o=t.parseUrl(i);t.preloadQueue++;var a=builder.getUserAttributes();a.urlPath=o.pathname,a.queryString=o.search;var s=builder.get(t.model,{userAttributes:a,key:t.model+":"+o.pathname+o.search}).subscribe((function(){t.preloadQueue--,s.unsubscribe();}));}}}}},t.onClick=function(e){return __awaiter$1(t,void 0,void 0,(function(){var t,n,i,r;return __generator$1(this,(function(o){if(!1===this.props.handleRouting)return [2];if(0!==e.button||e.ctrlKey||e.defaultPrevented||e.metaKey)return [2];if(!(t=this.findHrefTarget(e)))return [2];if(t.target&&"_client"!==t.target)return [2];if(!(n=t.getAttribute("href")))return [2];if(this.props.onRoute&&(i={url:n,anchorNode:t,preventDefault:function(){this.defaultPrevented=!0;},defaultPrevented:!1},this.props.onRoute(i),i.defaultPrevented))return [2];if(!this.isRelative(n)){if(!(r=this.convertToRelative(n)))return [2];n=r;}return n.startsWith("#")||(e.preventDefault(),this.route(n)),[2]}))}))},t.privateState=null,t}return __extends$1(t,e),t.prototype.route=function(e){return this.routed=!0,window.history&&window.history.pushState?(history.pushState(null,"",e),this.updateLocationState(),!0):(location.href=e,!1)},t.prototype.updateLocationState=function(){this.privateState&&this.privateState.update((function(e){e.location=__assign$1(__assign$1({},e.location),{pathname:location.pathname,search:location.search,path:location.pathname.split("/").slice(1),query:searchToObject$1(location)});}));},Object.defineProperty(t.prototype,"model",{get:function(){return this.props.model||"page"},enumerable:!0,configurable:!0}),t.prototype.componentDidMount=function(){"undefined"!=typeof document&&(document.addEventListener("click",this.onClick),window.addEventListener("popstate",this.onPopState),document.addEventListener("mouseover",this.onMouseOverOrTouchStart),document.addEventListener("touchstart",this.onMouseOverOrTouchStart));},t.prototype.componentWillUnmount=function(){"undefined"!=typeof document&&(document.removeEventListener("click",this.onClick),document.removeEventListener("mouseover",this.onMouseOverOrTouchStart),window.removeEventListener("popstate",this.onPopState),document.removeEventListener("touchstart",this.onMouseOverOrTouchStart));},t.prototype.render=function(){var e=this,t=this.model;return jsx(BuilderStoreContext.Consumer,null,(function(n){e.privateState=n;var i=n.state&&n.state.location&&n.state.location.pathname+n.state.location.search;return jsx("div",{className:"builder-router","data-model":t},jsx("style",null,"\n                @keyframes builderLoadingSpinner {\n                  0% {\n                    transform: rotate(0deg);\n                  }\n                  100% {\n                    transform: rotate(360deg);\n                  }\n                }\n                /* TODO: overridable tag */\n                .builder-page-loading {\n                  -webkit-animation: builderLoadingSpinner 1s infinite linear;\n                  animation: builderLoadingSpinner 1s infinite linear;\n                  -webkit-transform: translateZ(0);\n                  transform: translateZ(0);\n                  border-radius: 50%;\n                  width: 36px;\n                  height: 36px;\n                  margin: 6px auto;\n                  position: relative;\n                  border: 1px solid transparent;\n                  border-left: 1px solid #808284;\n                }\n              "),jsx(BuilderComponent,{key:i,data:e.props.data,content:e.routed?void 0:e.props.content,modelName:t,options:{key:Builder.isEditing?void 0:e.model+":"+i}},e.props.children||jsx("div",{css:{display:"flex"}},jsx("div",{css:{margin:"40vh auto"},className:"builder-page-loading"}))))}))},t.prototype.findHrefTarget=function(e){for(var t=e.target;t;){if(t instanceof HTMLAnchorElement&&t.getAttribute("href"))return t;if(t===e.currentTarget)break;t=t.parentElement;}return null},t.prototype.isRelative=function(e){return !e.match(/^(\/\/|https?:\/\/)/i)},t.prototype.parseUrl=function(e){var t=document.createElement("a");return t.href=e,t},t.prototype.convertToRelative=function(e){var t=this.parseUrl(location.href),n=this.parseUrl(e);if(t.host===n.host){var i=n.pathname+(n.search?n.search:"");return i.startsWith("#")?null:i||"/"}return null},t}(react.Component),Router=withBuilder(RouterComponent,{name:"Core:Router",hideFromInsertMenu:!0,inputs:[{name:"model",type:"string",defaultValue:"page",advanced:!0},{name:"handleRouting",type:"boolean",defaultValue:!0,advanced:!0},{name:"preloadOnHover",type:"boolean",defaultValue:!0,advanced:!0},{name:"onRoute",type:"function",advanced:!0}]});function Mutation(e){var t,n,i=react.useRef(null);useWaitForSelector(e.selector,(function(t){"afterEnd"!==e.type&&(t.innerHTML=""),t.appendChild(i.current.firstElementChild);}));var r=null===(t=e.builderBlock)||void 0===t?void 0:t.children;return jsx("span",{style:{display:"none"},ref:i},jsx(BuilderBlocks,{style:{display:"inline"},child:!0,parentElementId:null===(n=e.builderBlock)||void 0===n?void 0:n.id,dataPath:"this.children",blocks:r}))}function useWaitForSelector(e,t){react.useLayoutEffect((function(){try{var n=document.querySelector(e);if(n)return void t(n)}catch(e){console.warn(e);}var i=new MutationObserver((function(){try{var n=document.querySelector(e);n&&(i.disconnect(),t(n));}catch(e){console.warn(e);}}));return i.observe(document.body,{attributes:!0,subtree:!0,characterData:!0}),function(){i.disconnect();}}),[e]);}Builder.registerComponent(Mutation,{name:"Builder:Mutation",canHaveChildren:!0,noWrap:!0,hideFromInsertMenu:!0,inputs:[{name:"type",type:"string",defaultValue:"replace",enum:[{label:"Replace",value:"replace",helperText:"Replace the contents of this site region with content from Builder"},{label:"Append",value:"afterEnd",helperText:"Append Builder content after the chosen site region"}]},{name:"selector",type:"builder:domSelector"}]});var get=function(e,t,n){var i=String.prototype.split.call(t,/[,[\].]+?/).filter(Boolean).reduce((function(e,t){return null!=e?e[t]:e}),e);return void 0===i||i===e?n:i},MULTIPART_CONTENT_TYPE="multipart/form-data",JSON_CONTENT_TYPE="application/json",ENCODED_CONTENT_TYPE="application/x-www-form-urlencoded",FormComponent=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.ref=null,t.state={state:"unsubmitted",responseData:null,formErrorMessage:""},t}return __extends$1(t,e),Object.defineProperty(t.prototype,"submissionState",{get:function(){return Builder.isEditing&&this.props.previewState||this.state.state},enumerable:!0,configurable:!0}),t.prototype.render=function(){var e=this;return jsx(BuilderStoreContext.Consumer,null,(function(t){return jsx(BuilderStoreContext.Provider,{value:__assign$1(__assign$1({},t),{state:__assign$1(__assign$1({},t.state),{formErrorMessage:e.state.formErrorMessage})})},jsx("form",__assign$1({validate:e.props.validate,ref:function(t){return e.ref=t},action:!e.props.sendWithJs&&e.props.action,method:e.props.method,name:e.props.name,onSubmit:function(t){var n,i=e.props.sendWithJs||"email"===e.props.sendSubmissionsTo;if("zapier"===e.props.sendSubmissionsTo)t.preventDefault();else if(i){if(!e.props.action&&"email"!==e.props.sendSubmissionsTo)return void t.preventDefault();t.preventDefault();var r=t.currentTarget,o=e.props.customHeaders||{},a=void 0,s=new FormData(r),l=Array.from(t.currentTarget.querySelectorAll("input,select,textarea")).filter((function(e){return !!e.name})).map((function(e){var t,n=e.name;if(e instanceof HTMLInputElement)if("radio"===e.type){if(e.checked)return {key:n,value:t=e.name}}else if("checkbox"===e.type)t=e.checked;else if("number"===e.type||"range"===e.type){var i=e.valueAsNumber;isNaN(i)||(t=i);}else t="file"===e.type?e.files:e.value;else t=e.value;return {key:n,value:t}})),u=e.props.contentType;if("email"===e.props.sendSubmissionsTo&&(u=MULTIPART_CONTENT_TYPE),Array.from(l).forEach((function(e){var t=e.value;(t instanceof File||Array.isArray(t)&&t[0]instanceof File||t instanceof FileList)&&(u=MULTIPART_CONTENT_TYPE);})),u===MULTIPART_CONTENT_TYPE)a=s;else if(u===JSON_CONTENT_TYPE){var d={};Array.from(l).forEach((function(e){var t=e.value,n=e.key;set(d,n,t);})),a=JSON.stringify(d);}else {if(u!==ENCODED_CONTENT_TYPE)return void console.error("Unsupported content type: ",u);a=Array.from(l).map((function(e){var t=e.value,n=e.key;return encodeURIComponent(n)+"="+encodeURIComponent(t)})).join("&");}u&&u!==MULTIPART_CONTENT_TYPE&&(i&&(null===(n=e.props.action)||void 0===n?void 0:n.includes("zapier.com"))||(o["content-type"]=u));var c=new CustomEvent("presubmit",{detail:{body:a}});if(e.ref&&(e.ref.dispatchEvent(c),c.defaultPrevented))return;e.setState(__assign$1(__assign$1({},e.state),{state:"sending"}));var p=("dev"===builder.env?"http://localhost:5000":"https://builder.io")+"/api/v1/form-submit?apiKey="+builder.apiKey+"&to="+btoa(e.props.sendSubmissionsToEmail||"")+"&name="+encodeURIComponent(e.props.name||"");fetch("email"===e.props.sendSubmissionsTo?p:e.props.action,{body:a,headers:o,method:e.props.method||"post"}).then((function(t){return __awaiter$1(e,void 0,void 0,(function(){var e,n,i,r,o;return __generator$1(this,(function(a){switch(a.label){case 0:return (n=t.headers.get("content-type"))&&-1!==n.indexOf(JSON_CONTENT_TYPE)?[4,t.json()]:[3,2];case 1:return e=a.sent(),[3,4];case 2:return [4,t.text()];case 3:e=a.sent(),a.label=4;case 4:if(!t.ok&&this.props.errorMessagePath&&(i=get(e,this.props.errorMessagePath))&&("string"!=typeof i&&(i=JSON.stringify(i)),this.setState(__assign$1(__assign$1({},this.state),{formErrorMessage:i}))),this.setState(__assign$1(__assign$1({},this.state),{responseData:e,state:t.ok?"success":"error"})),t.ok){if(r=new CustomEvent("submit:success",{detail:{res:t,body:e}}),this.ref){if(this.ref.dispatchEvent(r),r.defaultPrevented)return [2];!1!==this.props.resetFormOnSubmit&&this.ref.reset();}this.props.successUrl&&(this.ref?(o=new CustomEvent("route",{detail:{url:this.props.successUrl}}),this.ref.dispatchEvent(o),o.defaultPrevented||(location.href=this.props.successUrl)):location.href=this.props.successUrl);}return [2]}}))}))}),(function(t){var n=new CustomEvent("submit:error",{detail:{error:t}});e.ref&&(e.ref.dispatchEvent(n),n.defaultPrevented)||e.setState(__assign$1(__assign$1({},e.state),{responseData:t,state:"error"}));}));}}},e.props.attributes),e.props.builderBlock&&e.props.builderBlock.children&&e.props.builderBlock.children.map((function(e,t){return jsx(BuilderBlock,{key:e.id,block:e})})),"error"===e.submissionState&&jsx(BuilderBlocks,{dataPath:"errorMessage",blocks:e.props.errorMessage}),"sending"===e.submissionState&&jsx(BuilderBlocks,{dataPath:"sendingMessage",blocks:e.props.sendingMessage}),"error"===e.submissionState&&e.state.responseData&&jsx("pre",{className:"builder-form-error-text",css:{padding:10,color:"red",textAlign:"center"}},JSON.stringify(e.state.responseData,null,2)),"success"===e.submissionState&&jsx(BuilderBlocks,{dataPath:"successMessage",blocks:e.props.successMessage})))}))},t}(react.Component),Form=withBuilder(FormComponent,{name:"Form:Form",defaults:{responsiveStyles:{large:{marginTop:"15px",paddingBottom:"15px"}}},image:"https://cdn.builder.io/api/v1/image/assets%2FIsxPKMo2gPRRKeakUztj1D6uqed2%2Fef36d2a846134910b64b88e6d18c5ca5",inputs:[{name:"sendSubmissionsTo",type:"string",enum:[{label:"Send to email",value:"email",helperText:"Send form submissions to the email address of your choosing"},{label:"Custom",value:"custom",helperText:"Handle where the form requests go manually with a little code, e.g. to your own custom backend"}],defaultValue:"email"},{name:"sendSubmissionsToEmail",type:"string",required:!0,defaultValue:"your@email.com",showIf:'options.get("sendSubmissionsTo") === "email"'},{name:"sendWithJs",type:"boolean",helperText:"Set to false to use basic html form action",defaultValue:!0,showIf:'options.get("sendSubmissionsTo") === "custom"'},{name:"name",type:"string",defaultValue:"My form"},{name:"action",type:"string",helperText:"URL to send the form data to",showIf:'options.get("sendSubmissionsTo") === "custom"'},{name:"contentType",type:"string",defaultValue:JSON_CONTENT_TYPE,advanced:!0,enum:[JSON_CONTENT_TYPE,MULTIPART_CONTENT_TYPE,ENCODED_CONTENT_TYPE],showIf:'options.get("sendSubmissionsTo") === "custom" && options.get("sendWithJs") === true'},{name:"method",type:"string",showIf:'options.get("sendSubmissionsTo") === "custom"',defaultValue:"POST",advanced:!0},{name:"previewState",type:"string",enum:["unsubmitted","sending","success","error"],defaultValue:"unsubmitted",helperText:'Choose a state to edit, e.g. choose "success" to show what users see on success and edit the message',showIf:'options.get("sendSubmissionsTo") !== "zapier" && options.get("sendWithJs") === true'},{name:"successUrl",type:"url",helperText:"Optional URL to redirect the user to on form submission success",showIf:'options.get("sendSubmissionsTo") !== "zapier" && options.get("sendWithJs") === true'},{name:"resetFormOnSubmit",type:"boolean",showIf:function(e){return "custom"===e.get("sendSubmissionsTo")&&!0===e.get("sendWithJs")},advanced:!0},{name:"successMessage",type:"uiBlocks",hideFromUI:!0,defaultValue:[{"@type":"@builder.io/sdk:Element",responsiveStyles:{large:{marginTop:"10px"}},component:{name:"Text",options:{text:"<span>Thanks!</span>"}}}]},{name:"validate",type:"boolean",defaultValue:!0,advanced:!0},{name:"errorMessagePath",type:"text",advanced:!0,helperText:'Path to where to get the error message from in a JSON response to display to the user, e.g. "error.message" for a response like { "error": { "message": "this username is taken" }}'},{name:"errorMessage",type:"uiBlocks",hideFromUI:!0,defaultValue:[{"@type":"@builder.io/sdk:Element",responsiveStyles:{large:{marginTop:"10px"}},bindings:{"component.options.text":"state.formErrorMessage || block.component.options.text"},component:{name:"Text",options:{text:"<span>Form submission error :( Please check your answers and try again</span>"}}}]},{name:"sendingMessage",type:"uiBlocks",hideFromUI:!0,defaultValue:[{"@type":"@builder.io/sdk:Element",responsiveStyles:{large:{marginTop:"10px"}},component:{name:"Text",options:{text:"<span>Sending...</span>"}}}]},__assign$1(__assign$1({name:"customHeaders",type:"map"},{valueType:{type:"string"}}),{advanced:!0,showIf:'options.get("sendSubmissionsTo") === "custom" && options.get("sendWithJs") === true'})],noWrap:!0,canHaveChildren:!0,defaultChildren:[{"@type":"@builder.io/sdk:Element",responsiveStyles:{large:{marginTop:"10px"}},component:{name:"Text",options:{text:"<span>Enter your name</span>"}}},{"@type":"@builder.io/sdk:Element",responsiveStyles:{large:{marginTop:"10px"}},component:{name:"Form:Input",options:{name:"name",placeholder:"Jane Doe"}}},{"@type":"@builder.io/sdk:Element",responsiveStyles:{large:{marginTop:"10px"}},component:{name:"Text",options:{text:"<span>Enter your email</span>"}}},{"@type":"@builder.io/sdk:Element",responsiveStyles:{large:{marginTop:"10px"}},component:{name:"Form:Input",options:{name:"email",placeholder:"jane@doe.com"}}},{"@type":"@builder.io/sdk:Element",responsiveStyles:{large:{marginTop:"10px"}},component:{name:"Form:SubmitButton",options:{text:"Submit"}}}]}),FormInputComponent=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return __extends$1(t,e),t.prototype.render=function(){return react.createElement("input",__assign$1({key:Builder.isEditing&&this.props.defaultValue?this.props.defaultValue:"default-key",placeholder:this.props.placeholder,type:this.props.type,name:this.props.name,value:this.props.value,defaultValue:this.props.defaultValue,required:this.props.required},this.props.attributes))},t}(react.Component),FormInput=withBuilder(FormInputComponent,{name:"Form:Input",image:"https://cdn.builder.io/api/v1/image/assets%2FIsxPKMo2gPRRKeakUztj1D6uqed2%2Fad6f37889d9e40bbbbc72cdb5875d6ca",inputs:[{name:"type",type:"text",enum:["text","number","email","url","checkbox","radio","range","date","datetime-local","search","tel","time","file","month","week","password","color","hidden"],defaultValue:"text"},{name:"name",type:"string",required:!0,helperText:'Every input in a form needs a unique name describing what it takes, e.g. "email"'},{name:"placeholder",type:"string",defaultValue:"Hello there",helperText:"Text to display when there is no value"},{name:"defaultValue",type:"string"},{name:"value",type:"string",advanced:!0},{name:"required",type:"boolean",helperText:"Is this input required to be filled out to submit a form",defaultValue:!1}],noWrap:!0,static:!0,defaultStyles:{paddingTop:"10px",paddingBottom:"10px",paddingLeft:"10px",paddingRight:"10px",borderRadius:"3px",borderWidth:"1px",borderStyle:"solid",borderColor:"#ccc"}}),FormSubmitButtonComponent=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return __extends$1(t,e),t.prototype.render=function(){return react.createElement("button",__assign$1({type:"submit"},this.props.attributes),this.props.text)},t}(react.Component),FormSubmitButton=withBuilder(FormSubmitButtonComponent,{name:"Form:SubmitButton",image:"https://cdn.builder.io/api/v1/image/assets%2FIsxPKMo2gPRRKeakUztj1D6uqed2%2Fdf2820ffed1f4349a94c40b3221f5b98",defaultStyles:{appearance:"none",paddingTop:"15px",paddingBottom:"15px",paddingLeft:"25px",paddingRight:"25px",backgroundColor:"#3898EC",color:"white",borderRadius:"4px",cursor:"pointer"},inputs:[{name:"text",type:"text",defaultValue:"Click me"}],static:!0,noWrap:!0}),LabelComponent=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return __extends$1(t,e),t.prototype.render=function(){return react.createElement("label",__assign$1({htmlFor:this.props.for},this.props.attributes),this.props.text&&react.createElement("span",{className:"builder-label-text",dangerouslySetInnerHTML:{__html:this.props.text}}),this.props.builderBlock&&this.props.builderBlock.children&&this.props.builderBlock.children.map((function(e){return react.createElement(BuilderBlock,{key:e.id,block:e})})))},t}(react.Component),Label=withBuilder(LabelComponent,{name:"Form:Label",image:"https://cdn.builder.io/api/v1/image/assets%2FIsxPKMo2gPRRKeakUztj1D6uqed2%2F9322342f04b545fb9a8091cd801dfb5b",inputs:[{name:"text",type:"html",richText:!0,defaultValue:"Label"},{name:"for",type:"text",helperText:"The name of the input this label is for",advanced:!0}],noWrap:!0,static:!0,canHaveChildren:!0}),FormSelectComponent=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return __extends$1(t,e),t.prototype.render=function(){var e=this.props.options;return react.createElement("select",__assign$1({value:this.props.value,key:Builder.isEditing&&this.props.defaultValue?this.props.defaultValue:"default-key",defaultValue:this.props.defaultValue,name:this.props.name},this.props.attributes),e&&e.map((function(e){return react.createElement("option",{value:e.value},e.name||e.value)})))},t}(react.Component),FormSelect=withBuilder(FormSelectComponent,{name:"Form:Select",image:"https://cdn.builder.io/api/v1/image/assets%2FIsxPKMo2gPRRKeakUztj1D6uqed2%2F83acca093fb24aaf94dee136e9a4b045",defaultStyles:{alignSelf:"flex-start"},inputs:[{name:"options",type:"list",required:!0,subFields:[{name:"value",type:"text",required:!0},{name:"name",type:"text"}],defaultValue:[{value:"option 1"},{value:"option 2"}]},{name:"name",type:"string",required:!0,helperText:'Every select in a form needs a unique name describing what it gets, e.g. "email"'},{name:"defaultValue",type:"string"},{name:"value",type:"string",advanced:!0},{name:"required",type:"boolean",defaultValue:!1}],static:!0,noWrap:!0}),TextAreaComponent=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return __extends$1(t,e),t.prototype.render=function(){return react.createElement("textarea",__assign$1({placeholder:this.props.placeholder,name:this.props.name,value:this.props.value,defaultValue:this.props.defaultValue},this.props.attributes))},t}(react.Component),TextArea=withBuilder(TextAreaComponent,{name:"Form:TextArea",image:"https://cdn.builder.io/api/v1/image/assets%2FIsxPKMo2gPRRKeakUztj1D6uqed2%2Ff74a2f3de58c4c3e939204e5b6b8f6c3",inputs:[{advanced:!0,name:"value",type:"string"},{name:"name",type:"string",required:!0,helperText:'Every input in a form needs a unique name describing what it gets, e.g. "email"'},{name:"defaultValue",type:"string"},{name:"placeholder",type:"string",defaultValue:"Hello there"},{name:"required",type:"boolean",defaultValue:!1}],defaultStyles:{paddingTop:"10px",paddingBottom:"10px",paddingLeft:"10px",paddingRight:"10px",borderRadius:"3px",borderWidth:"1px",borderStyle:"solid",borderColor:"#ccc"},static:!0,noWrap:!0}),ImgComponent=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return __extends$1(t,e),t.prototype.render=function(){var e=this.props.attributes||{};return react.createElement("img",__assign$1({},this.props.attributes,{src:this.props.image||e.src}))},t}(react.Component),Img=withBuilder(ImgComponent,{name:"Raw:Img",hideFromInsertMenu:!0,image:"https://firebasestorage.googleapis.com/v0/b/builder-3b0a2.appspot.com/o/images%2Fbaseline-insert_photo-24px.svg?alt=media&token=4e5d0ef4-f5e8-4e57-b3a9-38d63a9b9dc4",inputs:[{name:"image",bubble:!0,type:"file",allowedFileTypes:["jpeg","jpg","png","svg"],required:!0}],noWrap:!0,static:!0}),RawText=function(e){var t=e.attributes||{};return react_5("span",{className:(null==t?void 0:t.class)||(null==t?void 0:t.className),dangerouslySetInnerHTML:{__html:e.text||""}})};Builder.registerComponent(RawText,{name:"Builder:RawText",hideFromInsertMenu:!0,inputs:[{name:"text",bubble:!0,type:"longText",required:!0}]}),Builder.isReact=!0;

  SteedosBuilder.isReact = true;

  exports.Builder = SteedosBuilder;
  exports.BuilderAsyncRequestsContext = BuilderAsyncRequestsContext;
  exports.BuilderBlock = BuilderBlock$1;
  exports.BuilderBlockComponent = BuilderBlock$1;
  exports.BuilderBlocks = BuilderBlocks;
  exports.BuilderComponent = BuilderComponent;
  exports.BuilderContent = BuilderContent;
  exports.BuilderMetaContext = BuilderMetaContext;
  exports.BuilderPage = BuilderComponent;
  exports.BuilderStoreContext = BuilderStoreContext;
  exports.Button = Button;
  exports.Columns = Columns;
  exports.CustomCode = CustomCode;
  exports.Dropzone = Slot;
  exports.Embed = Embed;
  exports.Form = Form;
  exports.FormInput = FormInput;
  exports.FormSelect = FormSelect;
  exports.FormSubmitButton = FormSubmitButton;
  exports.Fragment = Fragment;
  exports.Image = Image;
  exports.Img = Img;
  exports.Label = Label;
  exports.Mutation = Mutation;
  exports.RawText = RawText;
  exports.RenderContent = BuilderComponent;
  exports.Router = Router;
  exports.Section = Section;
  exports.StateProvider = StateProvider;
  exports.Symbol = Symbol$1;
  exports.Text = Text;
  exports.TextArea = TextArea;
  exports.Video = Video;
  exports.builder = builder$1;
  exports.default = builder$1;
  exports.getSrcSet = getSrcSet;
  exports.noWrap = noWrap;
  exports.onChange = onChange;
  exports.stringToFunction = stringToFunction;
  exports.withBuilder = withBuilder;
  exports.withChildren = withChildren;

  return exports;

}({}));
//# sourceMappingURL=builder-react.unpkg.js.map
