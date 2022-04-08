var ReactSteedos = (function (exports, React, reactDom, stream, designSystem) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    function _interopNamespace(e) {
        if (e && e.__esModule) return e;
        var n = Object.create(null);
        if (e) {
            Object.keys(e).forEach(function (k) {
                if (k !== 'default') {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () { return e[k]; }
                    });
                }
            });
        }
        n["default"] = e;
        return Object.freeze(n);
    }

    var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
    var React__namespace = /*#__PURE__*/_interopNamespace(React);

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
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends$4(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
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

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    function __awaiter$1(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator$1(thisArg, body) {
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

    function __spreadArray$1(to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    }

    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function getAugmentedNamespace(n) {
    	if (n.__esModule) return n;
    	var a = Object.defineProperty({}, '__esModule', {value: true});
    	Object.keys(n).forEach(function (k) {
    		var d = Object.getOwnPropertyDescriptor(n, k);
    		Object.defineProperty(a, k, d.get ? d : {
    			enumerable: true,
    			get: function () {
    				return n[k];
    			}
    		});
    	});
    	return a;
    }

    function commonjsRequire (path) {
    	throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
    }

    var propTypes$2 = {exports: {}};

    /**
     * Copyright (c) 2013-present, Facebook, Inc.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */

    var ReactPropTypesSecret$1 = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';
    var ReactPropTypesSecret_1 = ReactPropTypesSecret$1;

    /**
     * Copyright (c) 2013-present, Facebook, Inc.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */

    var ReactPropTypesSecret = ReactPropTypesSecret_1;

    function emptyFunction() {}

    function emptyFunctionWithReset() {}

    emptyFunctionWithReset.resetWarningCache = emptyFunction;

    var factoryWithThrowingShims = function factoryWithThrowingShims() {
      function shim(props, propName, componentName, location, propFullName, secret) {
        if (secret === ReactPropTypesSecret) {
          // It is still safe when called from React.
          return;
        }

        var err = new Error('Calling PropTypes validators directly is not supported by the `prop-types` package. ' + 'Use PropTypes.checkPropTypes() to call them. ' + 'Read more at http://fb.me/use-check-prop-types');
        err.name = 'Invariant Violation';
        throw err;
      }
      shim.isRequired = shim;

      function getShim() {
        return shim;
      }
      // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.

      var ReactPropTypes = {
        array: shim,
        bigint: shim,
        bool: shim,
        func: shim,
        number: shim,
        object: shim,
        string: shim,
        symbol: shim,
        any: shim,
        arrayOf: getShim,
        element: shim,
        elementType: shim,
        instanceOf: getShim,
        node: shim,
        objectOf: getShim,
        oneOf: getShim,
        oneOfType: getShim,
        shape: getShim,
        exact: getShim,
        checkPropTypes: emptyFunctionWithReset,
        resetWarningCache: emptyFunction
      };
      ReactPropTypes.PropTypes = ReactPropTypes;
      return ReactPropTypes;
    };

    /**
     * Copyright (c) 2013-present, Facebook, Inc.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */

    {
      // By explicitly using `prop-types` you are opting into new production behavior.
      // http://fb.me/prop-types-in-prod
      propTypes$2.exports = factoryWithThrowingShims();
    }

    var PropTypes = propTypes$2.exports;

    var ReactReduxContext = /*#__PURE__*/React__default["default"].createContext(null);

    // Default to a dummy "batch" implementation that just runs the callback
    function defaultNoopBatch(callback) {
      callback();
    }

    var batch = defaultNoopBatch; // Allow injecting another batching function later

    var setBatch = function setBatch(newBatch) {
      return batch = newBatch;
    }; // Supply a getter just to skip dealing with ESM bindings

    var getBatch = function getBatch() {
      return batch;
    };

    // well as nesting subscriptions of descendant components, so that we can ensure the
    // ancestor components re-render before descendants

    function createListenerCollection() {
      var batch = getBatch();
      var first = null;
      var last = null;
      return {
        clear: function clear() {
          first = null;
          last = null;
        },
        notify: function notify() {
          batch(function () {
            var listener = first;

            while (listener) {
              listener.callback();
              listener = listener.next;
            }
          });
        },
        get: function get() {
          var listeners = [];
          var listener = first;

          while (listener) {
            listeners.push(listener);
            listener = listener.next;
          }

          return listeners;
        },
        subscribe: function subscribe(callback) {
          var isSubscribed = true;
          var listener = last = {
            callback: callback,
            next: null,
            prev: last
          };

          if (listener.prev) {
            listener.prev.next = listener;
          } else {
            first = listener;
          }

          return function unsubscribe() {
            if (!isSubscribed || first === null) return;
            isSubscribed = false;

            if (listener.next) {
              listener.next.prev = listener.prev;
            } else {
              last = listener.prev;
            }

            if (listener.prev) {
              listener.prev.next = listener.next;
            } else {
              first = listener.next;
            }
          };
        }
      };
    }

    var nullListeners = {
      notify: function notify() {},
      get: function get() {
        return [];
      }
    };
    function createSubscription(store, parentSub) {
      var unsubscribe;
      var listeners = nullListeners;

      function addNestedSub(listener) {
        trySubscribe();
        return listeners.subscribe(listener);
      }

      function notifyNestedSubs() {
        listeners.notify();
      }

      function handleChangeWrapper() {
        if (subscription.onStateChange) {
          subscription.onStateChange();
        }
      }

      function isSubscribed() {
        return Boolean(unsubscribe);
      }

      function trySubscribe() {
        if (!unsubscribe) {
          unsubscribe = parentSub ? parentSub.addNestedSub(handleChangeWrapper) : store.subscribe(handleChangeWrapper);
          listeners = createListenerCollection();
        }
      }

      function tryUnsubscribe() {
        if (unsubscribe) {
          unsubscribe();
          unsubscribe = undefined;
          listeners.clear();
          listeners = nullListeners;
        }
      }

      var subscription = {
        addNestedSub: addNestedSub,
        notifyNestedSubs: notifyNestedSubs,
        handleChangeWrapper: handleChangeWrapper,
        isSubscribed: isSubscribed,
        trySubscribe: trySubscribe,
        tryUnsubscribe: tryUnsubscribe,
        getListeners: function getListeners() {
          return listeners;
        }
      };
      return subscription;
    }

    // To get around it, we can conditionally useEffect on the server (no-op) and
    // useLayoutEffect in the browser. We need useLayoutEffect to ensure the store
    // subscription callback always has the selector from the latest render commit
    // available, otherwise a store update may happen between render and the effect,
    // which may cause missed updates; we also must ensure the store subscription
    // is created synchronously, otherwise a store update may occur before the
    // subscription is created and an inconsistent state may be observed

    var useIsomorphicLayoutEffect = typeof window !== 'undefined' && typeof window.document !== 'undefined' && typeof window.document.createElement !== 'undefined' ? React.useLayoutEffect : React.useEffect;

    function Provider(_ref) {
      var store = _ref.store,
          context = _ref.context,
          children = _ref.children;
      var contextValue = React.useMemo(function () {
        var subscription = createSubscription(store);
        return {
          store: store,
          subscription: subscription
        };
      }, [store]);
      var previousState = React.useMemo(function () {
        return store.getState();
      }, [store]);
      useIsomorphicLayoutEffect(function () {
        var subscription = contextValue.subscription;
        subscription.onStateChange = subscription.notifyNestedSubs;
        subscription.trySubscribe();

        if (previousState !== store.getState()) {
          subscription.notifyNestedSubs();
        }

        return function () {
          subscription.tryUnsubscribe();
          subscription.onStateChange = null;
        };
      }, [contextValue, previousState]);
      var Context = context || ReactReduxContext;
      return /*#__PURE__*/React__default["default"].createElement(Context.Provider, {
        value: contextValue
      }, children);
    }

    function _extends$2() {
      _extends$2 = Object.assign || function (target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i];

          for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              target[key] = source[key];
            }
          }
        }

        return target;
      };

      return _extends$2.apply(this, arguments);
    }

    function _objectWithoutPropertiesLoose$1(source, excluded) {
      if (source == null) return {};
      var target = {};
      var sourceKeys = Object.keys(source);
      var key, i;

      for (i = 0; i < sourceKeys.length; i++) {
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        target[key] = source[key];
      }

      return target;
    }

    var reactIs$2 = {exports: {}};

    function ownKeys$2(object, enumerableOnly) {
      var keys = Object.keys(object);

      if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        enumerableOnly && (symbols = symbols.filter(function (sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        })), keys.push.apply(keys, symbols);
      }

      return keys;
    }

    function _objectSpread2$1(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = null != arguments[i] ? arguments[i] : {};
        i % 2 ? ownKeys$2(Object(source), !0).forEach(function (key) {
          _defineProperty$2(target, key, source[key]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$2(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }

      return target;
    }

    function _typeof$1(obj) {
      "@babel/helpers - typeof";

      return _typeof$1 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
        return typeof obj;
      } : function (obj) {
        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      }, _typeof$1(obj);
    }

    function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
      try {
        var info = gen[key](arg);
        var value = info.value;
      } catch (error) {
        reject(error);
        return;
      }

      if (info.done) {
        resolve(value);
      } else {
        Promise.resolve(value).then(_next, _throw);
      }
    }

    function _asyncToGenerator(fn) {
      return function () {
        var self = this,
            args = arguments;
        return new Promise(function (resolve, reject) {
          var gen = fn.apply(self, args);

          function _next(value) {
            asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
          }

          function _throw(err) {
            asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
          }

          _next(undefined);
        });
      };
    }

    function _classCallCheck$1(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }

    function _defineProperties$1(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    function _createClass$1(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties$1(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties$1(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", {
        writable: false
      });
      return Constructor;
    }

    function _defineProperty$2(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }

      return obj;
    }

    function _extends$1() {
      _extends$1 = Object.assign || function (target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i];

          for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              target[key] = source[key];
            }
          }
        }

        return target;
      };

      return _extends$1.apply(this, arguments);
    }

    function _inherits(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
      }

      subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
          value: subClass,
          writable: true,
          configurable: true
        }
      });
      Object.defineProperty(subClass, "prototype", {
        writable: false
      });
      if (superClass) _setPrototypeOf(subClass, superClass);
    }

    function _getPrototypeOf(o) {
      _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
      };
      return _getPrototypeOf(o);
    }

    function _setPrototypeOf(o, p) {
      _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
      };

      return _setPrototypeOf(o, p);
    }

    function _isNativeReflectConstruct() {
      if (typeof Reflect === "undefined" || !Reflect.construct) return false;
      if (Reflect.construct.sham) return false;
      if (typeof Proxy === "function") return true;

      try {
        Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
        return true;
      } catch (e) {
        return false;
      }
    }

    function _objectWithoutPropertiesLoose(source, excluded) {
      if (source == null) return {};
      var target = {};
      var sourceKeys = Object.keys(source);
      var key, i;

      for (i = 0; i < sourceKeys.length; i++) {
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        target[key] = source[key];
      }

      return target;
    }

    function _objectWithoutProperties(source, excluded) {
      if (source == null) return {};

      var target = _objectWithoutPropertiesLoose(source, excluded);

      var key, i;

      if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

        for (i = 0; i < sourceSymbolKeys.length; i++) {
          key = sourceSymbolKeys[i];
          if (excluded.indexOf(key) >= 0) continue;
          if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
          target[key] = source[key];
        }
      }

      return target;
    }

    function _assertThisInitialized(self) {
      if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      }

      return self;
    }

    function _possibleConstructorReturn(self, call) {
      if (call && (typeof call === "object" || typeof call === "function")) {
        return call;
      } else if (call !== void 0) {
        throw new TypeError("Derived constructors may only return object or undefined");
      }

      return _assertThisInitialized(self);
    }

    function _createSuper(Derived) {
      var hasNativeReflectConstruct = _isNativeReflectConstruct();

      return function _createSuperInternal() {
        var Super = _getPrototypeOf(Derived),
            result;

        if (hasNativeReflectConstruct) {
          var NewTarget = _getPrototypeOf(this).constructor;

          result = Reflect.construct(Super, arguments, NewTarget);
        } else {
          result = Super.apply(this, arguments);
        }

        return _possibleConstructorReturn(this, result);
      };
    }

    function _taggedTemplateLiteral(strings, raw) {
      if (!raw) {
        raw = strings.slice(0);
      }

      return Object.freeze(Object.defineProperties(strings, {
        raw: {
          value: Object.freeze(raw)
        }
      }));
    }

    function _slicedToArray(arr, i) {
      return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
    }

    function _toConsumableArray(arr) {
      return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
    }

    function _arrayWithoutHoles(arr) {
      if (Array.isArray(arr)) return _arrayLikeToArray(arr);
    }

    function _arrayWithHoles(arr) {
      if (Array.isArray(arr)) return arr;
    }

    function _iterableToArray(iter) {
      if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
    }

    function _iterableToArrayLimit(arr, i) {
      var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

      if (_i == null) return;
      var _arr = [];
      var _n = true;
      var _d = false;

      var _s, _e;

      try {
        for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"] != null) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    function _unsupportedIterableToArray(o, minLen) {
      if (!o) return;
      if (typeof o === "string") return _arrayLikeToArray(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor) n = o.constructor.name;
      if (n === "Map" || n === "Set") return Array.from(o);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
    }

    function _arrayLikeToArray(arr, len) {
      if (len == null || len > arr.length) len = arr.length;

      for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

      return arr2;
    }

    function _nonIterableSpread() {
      throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    function _nonIterableRest() {
      throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var reactIs_production_min$1 = {};

    var b$1 = "function" === typeof Symbol && Symbol.for,
        c$2 = b$1 ? Symbol.for("react.element") : 60103,
        d$2 = b$1 ? Symbol.for("react.portal") : 60106,
        e$1 = b$1 ? Symbol.for("react.fragment") : 60107,
        f$2 = b$1 ? Symbol.for("react.strict_mode") : 60108,
        g$2 = b$1 ? Symbol.for("react.profiler") : 60114,
        h$2 = b$1 ? Symbol.for("react.provider") : 60109,
        k$1 = b$1 ? Symbol.for("react.context") : 60110,
        l$2 = b$1 ? Symbol.for("react.async_mode") : 60111,
        m$2 = b$1 ? Symbol.for("react.concurrent_mode") : 60111,
        n$2 = b$1 ? Symbol.for("react.forward_ref") : 60112,
        p$2 = b$1 ? Symbol.for("react.suspense") : 60113,
        q$2 = b$1 ? Symbol.for("react.suspense_list") : 60120,
        r$2 = b$1 ? Symbol.for("react.memo") : 60115,
        t$2 = b$1 ? Symbol.for("react.lazy") : 60116,
        v$2 = b$1 ? Symbol.for("react.block") : 60121,
        w$2 = b$1 ? Symbol.for("react.fundamental") : 60117,
        x$2 = b$1 ? Symbol.for("react.responder") : 60118,
        y$2 = b$1 ? Symbol.for("react.scope") : 60119;

    function z$2(a) {
      if ("object" === _typeof$1(a) && null !== a) {
        var u = a.$$typeof;

        switch (u) {
          case c$2:
            switch (a = a.type, a) {
              case l$2:
              case m$2:
              case e$1:
              case g$2:
              case f$2:
              case p$2:
                return a;

              default:
                switch (a = a && a.$$typeof, a) {
                  case k$1:
                  case n$2:
                  case t$2:
                  case r$2:
                  case h$2:
                    return a;

                  default:
                    return u;
                }

            }

          case d$2:
            return u;
        }
      }
    }

    function A$2(a) {
      return z$2(a) === m$2;
    }

    reactIs_production_min$1.AsyncMode = l$2;
    reactIs_production_min$1.ConcurrentMode = m$2;
    reactIs_production_min$1.ContextConsumer = k$1;
    reactIs_production_min$1.ContextProvider = h$2;
    reactIs_production_min$1.Element = c$2;
    reactIs_production_min$1.ForwardRef = n$2;
    reactIs_production_min$1.Fragment = e$1;
    reactIs_production_min$1.Lazy = t$2;
    reactIs_production_min$1.Memo = r$2;
    reactIs_production_min$1.Portal = d$2;
    reactIs_production_min$1.Profiler = g$2;
    reactIs_production_min$1.StrictMode = f$2;
    reactIs_production_min$1.Suspense = p$2;

    reactIs_production_min$1.isAsyncMode = function (a) {
      return A$2(a) || z$2(a) === l$2;
    };

    reactIs_production_min$1.isConcurrentMode = A$2;

    reactIs_production_min$1.isContextConsumer = function (a) {
      return z$2(a) === k$1;
    };

    reactIs_production_min$1.isContextProvider = function (a) {
      return z$2(a) === h$2;
    };

    reactIs_production_min$1.isElement = function (a) {
      return "object" === _typeof$1(a) && null !== a && a.$$typeof === c$2;
    };

    reactIs_production_min$1.isForwardRef = function (a) {
      return z$2(a) === n$2;
    };

    reactIs_production_min$1.isFragment = function (a) {
      return z$2(a) === e$1;
    };

    reactIs_production_min$1.isLazy = function (a) {
      return z$2(a) === t$2;
    };

    reactIs_production_min$1.isMemo = function (a) {
      return z$2(a) === r$2;
    };

    reactIs_production_min$1.isPortal = function (a) {
      return z$2(a) === d$2;
    };

    reactIs_production_min$1.isProfiler = function (a) {
      return z$2(a) === g$2;
    };

    reactIs_production_min$1.isStrictMode = function (a) {
      return z$2(a) === f$2;
    };

    reactIs_production_min$1.isSuspense = function (a) {
      return z$2(a) === p$2;
    };

    reactIs_production_min$1.isValidElementType = function (a) {
      return "string" === typeof a || "function" === typeof a || a === e$1 || a === m$2 || a === g$2 || a === f$2 || a === p$2 || a === q$2 || "object" === _typeof$1(a) && null !== a && (a.$$typeof === t$2 || a.$$typeof === r$2 || a.$$typeof === h$2 || a.$$typeof === k$1 || a.$$typeof === n$2 || a.$$typeof === w$2 || a.$$typeof === x$2 || a.$$typeof === y$2 || a.$$typeof === v$2);
    };

    reactIs_production_min$1.typeOf = z$2;

    {
      reactIs$2.exports = reactIs_production_min$1;
    }

    var reactIs$1 = reactIs$2.exports;
    /**
     * Copyright 2015, Yahoo! Inc.
     * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
     */

    var REACT_STATICS$1 = {
      childContextTypes: true,
      contextType: true,
      contextTypes: true,
      defaultProps: true,
      displayName: true,
      getDefaultProps: true,
      getDerivedStateFromError: true,
      getDerivedStateFromProps: true,
      mixins: true,
      propTypes: true,
      type: true
    };
    var KNOWN_STATICS$1 = {
      name: true,
      length: true,
      prototype: true,
      caller: true,
      callee: true,
      arguments: true,
      arity: true
    };
    var FORWARD_REF_STATICS = {
      '$$typeof': true,
      render: true,
      defaultProps: true,
      displayName: true,
      propTypes: true
    };
    var MEMO_STATICS = {
      '$$typeof': true,
      compare: true,
      defaultProps: true,
      displayName: true,
      propTypes: true,
      type: true
    };
    var TYPE_STATICS$1 = {};
    TYPE_STATICS$1[reactIs$1.ForwardRef] = FORWARD_REF_STATICS;
    TYPE_STATICS$1[reactIs$1.Memo] = MEMO_STATICS;

    function getStatics(component) {
      // React v16.11 and below
      if (reactIs$1.isMemo(component)) {
        return MEMO_STATICS;
      } // React v16.12 and above


      return TYPE_STATICS$1[component['$$typeof']] || REACT_STATICS$1;
    }

    var defineProperty$2 = Object.defineProperty;
    var getOwnPropertyNames$1 = Object.getOwnPropertyNames;
    var getOwnPropertySymbols$1 = Object.getOwnPropertySymbols;
    var getOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor;
    var getPrototypeOf$1 = Object.getPrototypeOf;
    var objectPrototype$1 = Object.prototype;

    function hoistNonReactStatics$1(targetComponent, sourceComponent, blacklist) {
      if (typeof sourceComponent !== 'string') {
        // don't hoist over string (html) components
        if (objectPrototype$1) {
          var inheritedComponent = getPrototypeOf$1(sourceComponent);

          if (inheritedComponent && inheritedComponent !== objectPrototype$1) {
            hoistNonReactStatics$1(targetComponent, inheritedComponent, blacklist);
          }
        }

        var keys = getOwnPropertyNames$1(sourceComponent);

        if (getOwnPropertySymbols$1) {
          keys = keys.concat(getOwnPropertySymbols$1(sourceComponent));
        }

        var targetStatics = getStatics(targetComponent);
        var sourceStatics = getStatics(sourceComponent);

        for (var i = 0; i < keys.length; ++i) {
          var key = keys[i];

          if (!KNOWN_STATICS$1[key] && !(blacklist && blacklist[key]) && !(sourceStatics && sourceStatics[key]) && !(targetStatics && targetStatics[key])) {
            var descriptor = getOwnPropertyDescriptor$1(sourceComponent, key);

            try {
              // Avoid failures from read-only properties
              defineProperty$2(targetComponent, key, descriptor);
            } catch (e) {}
          }
        }
      }

      return targetComponent;
    }

    var hoistNonReactStatics_cjs = hoistNonReactStatics$1;

    var reactIs = {exports: {}};

    var reactIs_production_min = {};

    var b = 60103,
        c$1 = 60106,
        d$1 = 60107,
        e = 60108,
        f$1 = 60114,
        g$1 = 60109,
        h$1 = 60110,
        k = 60112,
        l$1 = 60113,
        m$1 = 60120,
        n$1 = 60115,
        p$1 = 60116,
        q$1 = 60121,
        r$1 = 60122,
        u$1 = 60117,
        v$1 = 60129,
        w$1 = 60131;

    if ("function" === typeof Symbol && Symbol.for) {
      var x$1 = Symbol.for;
      b = x$1("react.element");
      c$1 = x$1("react.portal");
      d$1 = x$1("react.fragment");
      e = x$1("react.strict_mode");
      f$1 = x$1("react.profiler");
      g$1 = x$1("react.provider");
      h$1 = x$1("react.context");
      k = x$1("react.forward_ref");
      l$1 = x$1("react.suspense");
      m$1 = x$1("react.suspense_list");
      n$1 = x$1("react.memo");
      p$1 = x$1("react.lazy");
      q$1 = x$1("react.block");
      r$1 = x$1("react.server.block");
      u$1 = x$1("react.fundamental");
      v$1 = x$1("react.debug_trace_mode");
      w$1 = x$1("react.legacy_hidden");
    }

    function y$1(a) {
      if ("object" === _typeof$1(a) && null !== a) {
        var t = a.$$typeof;

        switch (t) {
          case b:
            switch (a = a.type, a) {
              case d$1:
              case f$1:
              case e:
              case l$1:
              case m$1:
                return a;

              default:
                switch (a = a && a.$$typeof, a) {
                  case h$1:
                  case k:
                  case p$1:
                  case n$1:
                  case g$1:
                    return a;

                  default:
                    return t;
                }

            }

          case c$1:
            return t;
        }
      }
    }

    var z$1 = g$1,
        A$1 = b,
        B$1 = k,
        C = d$1,
        D = p$1,
        E$1 = n$1,
        F = c$1,
        G$1 = f$1,
        H = e,
        I$1 = l$1;
    reactIs_production_min.ContextConsumer = h$1;
    reactIs_production_min.ContextProvider = z$1;
    reactIs_production_min.Element = A$1;
    reactIs_production_min.ForwardRef = B$1;
    reactIs_production_min.Fragment = C;
    reactIs_production_min.Lazy = D;
    reactIs_production_min.Memo = E$1;
    reactIs_production_min.Portal = F;
    reactIs_production_min.Profiler = G$1;
    reactIs_production_min.StrictMode = H;
    reactIs_production_min.Suspense = I$1;

    reactIs_production_min.isAsyncMode = function () {
      return !1;
    };

    reactIs_production_min.isConcurrentMode = function () {
      return !1;
    };

    reactIs_production_min.isContextConsumer = function (a) {
      return y$1(a) === h$1;
    };

    reactIs_production_min.isContextProvider = function (a) {
      return y$1(a) === g$1;
    };

    reactIs_production_min.isElement = function (a) {
      return "object" === _typeof$1(a) && null !== a && a.$$typeof === b;
    };

    reactIs_production_min.isForwardRef = function (a) {
      return y$1(a) === k;
    };

    reactIs_production_min.isFragment = function (a) {
      return y$1(a) === d$1;
    };

    reactIs_production_min.isLazy = function (a) {
      return y$1(a) === p$1;
    };

    reactIs_production_min.isMemo = function (a) {
      return y$1(a) === n$1;
    };

    reactIs_production_min.isPortal = function (a) {
      return y$1(a) === c$1;
    };

    reactIs_production_min.isProfiler = function (a) {
      return y$1(a) === f$1;
    };

    reactIs_production_min.isStrictMode = function (a) {
      return y$1(a) === e;
    };

    reactIs_production_min.isSuspense = function (a) {
      return y$1(a) === l$1;
    };

    reactIs_production_min.isValidElementType = function (a) {
      return "string" === typeof a || "function" === typeof a || a === d$1 || a === f$1 || a === v$1 || a === e || a === l$1 || a === m$1 || a === w$1 || "object" === _typeof$1(a) && null !== a && (a.$$typeof === p$1 || a.$$typeof === n$1 || a.$$typeof === g$1 || a.$$typeof === h$1 || a.$$typeof === k || a.$$typeof === u$1 || a.$$typeof === q$1 || a[0] === r$1) ? !0 : !1;
    };

    reactIs_production_min.typeOf = y$1;

    {
      reactIs.exports = reactIs_production_min;
    }

    var _excluded$7 = ["getDisplayName", "methodName", "renderCountProp", "shouldHandleStateChanges", "storeKey", "withRef", "forwardRef", "context"],
        _excluded2$1 = ["reactReduxForwardedRef"];

    var EMPTY_ARRAY$1 = [];
    var NO_SUBSCRIPTION_ARRAY = [null, null];

    function storeStateUpdatesReducer(state, action) {
      var updateCount = state[1];
      return [action.payload, updateCount + 1];
    }

    function useIsomorphicLayoutEffectWithArgs(effectFunc, effectArgs, dependencies) {
      useIsomorphicLayoutEffect(function () {
        return effectFunc.apply(void 0, effectArgs);
      }, dependencies);
    }

    function captureWrapperProps(lastWrapperProps, lastChildProps, renderIsScheduled, wrapperProps, actualChildProps, childPropsFromStoreUpdate, notifyNestedSubs) {
      // We want to capture the wrapper props and child props we used for later comparisons
      lastWrapperProps.current = wrapperProps;
      lastChildProps.current = actualChildProps;
      renderIsScheduled.current = false; // If the render was from a store update, clear out that reference and cascade the subscriber update

      if (childPropsFromStoreUpdate.current) {
        childPropsFromStoreUpdate.current = null;
        notifyNestedSubs();
      }
    }

    function subscribeUpdates(shouldHandleStateChanges, store, subscription, childPropsSelector, lastWrapperProps, lastChildProps, renderIsScheduled, childPropsFromStoreUpdate, notifyNestedSubs, forceComponentUpdateDispatch) {
      // If we're not subscribed to the store, nothing to do here
      if (!shouldHandleStateChanges) return; // Capture values for checking if and when this component unmounts

      var didUnsubscribe = false;
      var lastThrownError = null; // We'll run this callback every time a store subscription update propagates to this component

      var checkForUpdates = function checkForUpdates() {
        if (didUnsubscribe) {
          // Don't run stale listeners.
          // Redux doesn't guarantee unsubscriptions happen until next dispatch.
          return;
        }

        var latestStoreState = store.getState();
        var newChildProps, error;

        try {
          // Actually run the selector with the most recent store state and wrapper props
          // to determine what the child props should be
          newChildProps = childPropsSelector(latestStoreState, lastWrapperProps.current);
        } catch (e) {
          error = e;
          lastThrownError = e;
        }

        if (!error) {
          lastThrownError = null;
        } // If the child props haven't changed, nothing to do here - cascade the subscription update


        if (newChildProps === lastChildProps.current) {
          if (!renderIsScheduled.current) {
            notifyNestedSubs();
          }
        } else {
          // Save references to the new child props.  Note that we track the "child props from store update"
          // as a ref instead of a useState/useReducer because we need a way to determine if that value has
          // been processed.  If this went into useState/useReducer, we couldn't clear out the value without
          // forcing another re-render, which we don't want.
          lastChildProps.current = newChildProps;
          childPropsFromStoreUpdate.current = newChildProps;
          renderIsScheduled.current = true; // If the child props _did_ change (or we caught an error), this wrapper component needs to re-render

          forceComponentUpdateDispatch({
            type: 'STORE_UPDATED',
            payload: {
              error: error
            }
          });
        }
      }; // Actually subscribe to the nearest connected ancestor (or store)


      subscription.onStateChange = checkForUpdates;
      subscription.trySubscribe(); // Pull data from the store after first render in case the store has
      // changed since we began.

      checkForUpdates();

      var unsubscribeWrapper = function unsubscribeWrapper() {
        didUnsubscribe = true;
        subscription.tryUnsubscribe();
        subscription.onStateChange = null;

        if (lastThrownError) {
          // It's possible that we caught an error due to a bad mapState function, but the
          // parent re-rendered without this component and we're about to unmount.
          // This shouldn't happen as long as we do top-down subscriptions correctly, but
          // if we ever do those wrong, this throw will surface the error in our tests.
          // In that case, throw the error from here so it doesn't get lost.
          throw lastThrownError;
        }
      };

      return unsubscribeWrapper;
    }

    var initStateUpdates = function initStateUpdates() {
      return [null, 0];
    };

    function connectAdvanced(
    /*
      selectorFactory is a func that is responsible for returning the selector function used to
      compute new props from state, props, and dispatch. For example:
          export default connectAdvanced((dispatch, options) => (state, props) => ({
          thing: state.things[props.thingId],
          saveThing: fields => dispatch(actionCreators.saveThing(props.thingId, fields)),
        }))(YourComponent)
        Access to dispatch is provided to the factory so selectorFactories can bind actionCreators
      outside of their selector as an optimization. Options passed to connectAdvanced are passed to
      the selectorFactory, along with displayName and WrappedComponent, as the second argument.
        Note that selectorFactory is responsible for all caching/memoization of inbound and outbound
      props. Do not use connectAdvanced directly without memoizing results between calls to your
      selector, otherwise the Connect component will re-render on every state or props change.
    */
    selectorFactory, // options object:
    _ref) {
      if (_ref === void 0) {
        _ref = {};
      }

      var _ref2 = _ref,
          _ref2$getDisplayName = _ref2.getDisplayName,
          getDisplayName = _ref2$getDisplayName === void 0 ? function (name) {
        return "ConnectAdvanced(" + name + ")";
      } : _ref2$getDisplayName,
          _ref2$methodName = _ref2.methodName,
          methodName = _ref2$methodName === void 0 ? 'connectAdvanced' : _ref2$methodName,
          _ref2$renderCountProp = _ref2.renderCountProp,
          renderCountProp = _ref2$renderCountProp === void 0 ? undefined : _ref2$renderCountProp,
          _ref2$shouldHandleSta = _ref2.shouldHandleStateChanges,
          shouldHandleStateChanges = _ref2$shouldHandleSta === void 0 ? true : _ref2$shouldHandleSta,
          _ref2$storeKey = _ref2.storeKey,
          storeKey = _ref2$storeKey === void 0 ? 'store' : _ref2$storeKey;
          _ref2.withRef;
          var _ref2$forwardRef = _ref2.forwardRef,
          forwardRef = _ref2$forwardRef === void 0 ? false : _ref2$forwardRef,
          _ref2$context = _ref2.context,
          context = _ref2$context === void 0 ? ReactReduxContext : _ref2$context,
          connectOptions = _objectWithoutPropertiesLoose$1(_ref2, _excluded$7);

      var Context = context;
      return function wrapWithConnect(WrappedComponent) {

        var wrappedComponentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
        var displayName = getDisplayName(wrappedComponentName);

        var selectorFactoryOptions = _extends$2({}, connectOptions, {
          getDisplayName: getDisplayName,
          methodName: methodName,
          renderCountProp: renderCountProp,
          shouldHandleStateChanges: shouldHandleStateChanges,
          storeKey: storeKey,
          displayName: displayName,
          wrappedComponentName: wrappedComponentName,
          WrappedComponent: WrappedComponent
        });

        var pure = connectOptions.pure;

        function createChildSelector(store) {
          return selectorFactory(store.dispatch, selectorFactoryOptions);
        } // If we aren't running in "pure" mode, we don't want to memoize values.
        // To avoid conditionally calling hooks, we fall back to a tiny wrapper
        // that just executes the given callback immediately.


        var usePureOnlyMemo = pure ? React.useMemo : function (callback) {
          return callback();
        };

        function ConnectFunction(props) {
          var _useMemo = React.useMemo(function () {
            // Distinguish between actual "data" props that were passed to the wrapper component,
            // and values needed to control behavior (forwarded refs, alternate context instances).
            // To maintain the wrapperProps object reference, memoize this destructuring.
            var reactReduxForwardedRef = props.reactReduxForwardedRef,
                wrapperProps = _objectWithoutPropertiesLoose$1(props, _excluded2$1);

            return [props.context, reactReduxForwardedRef, wrapperProps];
          }, [props]),
              propsContext = _useMemo[0],
              reactReduxForwardedRef = _useMemo[1],
              wrapperProps = _useMemo[2];

          var ContextToUse = React.useMemo(function () {
            // Users may optionally pass in a custom context instance to use instead of our ReactReduxContext.
            // Memoize the check that determines which context instance we should use.
            return propsContext && propsContext.Consumer && reactIs.exports.isContextConsumer( /*#__PURE__*/React__default["default"].createElement(propsContext.Consumer, null)) ? propsContext : Context;
          }, [propsContext, Context]); // Retrieve the store and ancestor subscription via context, if available

          var contextValue = React.useContext(ContextToUse); // The store _must_ exist as either a prop or in context.
          // We'll check to see if it _looks_ like a Redux store first.
          // This allows us to pass through a `store` prop that is just a plain value.

          var didStoreComeFromProps = Boolean(props.store) && Boolean(props.store.getState) && Boolean(props.store.dispatch);
          Boolean(contextValue) && Boolean(contextValue.store);


          var store = didStoreComeFromProps ? props.store : contextValue.store;
          var childPropsSelector = React.useMemo(function () {
            // The child props selector needs the store reference as an input.
            // Re-create this selector whenever the store changes.
            return createChildSelector(store);
          }, [store]);

          var _useMemo2 = React.useMemo(function () {
            if (!shouldHandleStateChanges) return NO_SUBSCRIPTION_ARRAY; // This Subscription's source should match where store came from: props vs. context. A component
            // connected to the store via props shouldn't use subscription from context, or vice versa.
            // This Subscription's source should match where store came from: props vs. context. A component
            // connected to the store via props shouldn't use subscription from context, or vice versa.

            var subscription = createSubscription(store, didStoreComeFromProps ? null : contextValue.subscription); // `notifyNestedSubs` is duplicated to handle the case where the component is unmounted in
            // the middle of the notification loop, where `subscription` will then be null. This can
            // probably be avoided if Subscription's listeners logic is changed to not call listeners
            // that have been unsubscribed in the  middle of the notification loop.
            // `notifyNestedSubs` is duplicated to handle the case where the component is unmounted in
            // the middle of the notification loop, where `subscription` will then be null. This can
            // probably be avoided if Subscription's listeners logic is changed to not call listeners
            // that have been unsubscribed in the  middle of the notification loop.

            var notifyNestedSubs = subscription.notifyNestedSubs.bind(subscription);
            return [subscription, notifyNestedSubs];
          }, [store, didStoreComeFromProps, contextValue]),
              subscription = _useMemo2[0],
              notifyNestedSubs = _useMemo2[1]; // Determine what {store, subscription} value should be put into nested context, if necessary,
          // and memoize that value to avoid unnecessary context updates.


          var overriddenContextValue = React.useMemo(function () {
            if (didStoreComeFromProps) {
              // This component is directly subscribed to a store from props.
              // We don't want descendants reading from this store - pass down whatever
              // the existing context value is from the nearest connected ancestor.
              return contextValue;
            } // Otherwise, put this component's subscription instance into context, so that
            // connected descendants won't update until after this component is done


            return _extends$2({}, contextValue, {
              subscription: subscription
            });
          }, [didStoreComeFromProps, contextValue, subscription]); // We need to force this wrapper component to re-render whenever a Redux store update
          // causes a change to the calculated child component props (or we caught an error in mapState)

          var _useReducer = React.useReducer(storeStateUpdatesReducer, EMPTY_ARRAY$1, initStateUpdates),
              _useReducer$ = _useReducer[0],
              previousStateUpdateResult = _useReducer$[0],
              forceComponentUpdateDispatch = _useReducer[1]; // Propagate any mapState/mapDispatch errors upwards


          if (previousStateUpdateResult && previousStateUpdateResult.error) {
            throw previousStateUpdateResult.error;
          } // Set up refs to coordinate values between the subscription effect and the render logic


          var lastChildProps = React.useRef();
          var lastWrapperProps = React.useRef(wrapperProps);
          var childPropsFromStoreUpdate = React.useRef();
          var renderIsScheduled = React.useRef(false);
          var actualChildProps = usePureOnlyMemo(function () {
            // Tricky logic here:
            // - This render may have been triggered by a Redux store update that produced new child props
            // - However, we may have gotten new wrapper props after that
            // If we have new child props, and the same wrapper props, we know we should use the new child props as-is.
            // But, if we have new wrapper props, those might change the child props, so we have to recalculate things.
            // So, we'll use the child props from store update only if the wrapper props are the same as last time.
            if (childPropsFromStoreUpdate.current && wrapperProps === lastWrapperProps.current) {
              return childPropsFromStoreUpdate.current;
            } // TODO We're reading the store directly in render() here. Bad idea?
            // This will likely cause Bad Things (TM) to happen in Concurrent Mode.
            // Note that we do this because on renders _not_ caused by store updates, we need the latest store state
            // to determine what the child props should be.


            return childPropsSelector(store.getState(), wrapperProps);
          }, [store, previousStateUpdateResult, wrapperProps]); // We need this to execute synchronously every time we re-render. However, React warns
          // about useLayoutEffect in SSR, so we try to detect environment and fall back to
          // just useEffect instead to avoid the warning, since neither will run anyway.

          useIsomorphicLayoutEffectWithArgs(captureWrapperProps, [lastWrapperProps, lastChildProps, renderIsScheduled, wrapperProps, actualChildProps, childPropsFromStoreUpdate, notifyNestedSubs]); // Our re-subscribe logic only runs when the store/subscription setup changes

          useIsomorphicLayoutEffectWithArgs(subscribeUpdates, [shouldHandleStateChanges, store, subscription, childPropsSelector, lastWrapperProps, lastChildProps, renderIsScheduled, childPropsFromStoreUpdate, notifyNestedSubs, forceComponentUpdateDispatch], [store, subscription, childPropsSelector]); // Now that all that's done, we can finally try to actually render the child component.
          // We memoize the elements for the rendered child component as an optimization.

          var renderedWrappedComponent = React.useMemo(function () {
            return /*#__PURE__*/React__default["default"].createElement(WrappedComponent, _extends$2({}, actualChildProps, {
              ref: reactReduxForwardedRef
            }));
          }, [reactReduxForwardedRef, WrappedComponent, actualChildProps]); // If React sees the exact same element reference as last time, it bails out of re-rendering
          // that child, same as if it was wrapped in React.memo() or returned false from shouldComponentUpdate.

          var renderedChild = React.useMemo(function () {
            if (shouldHandleStateChanges) {
              // If this component is subscribed to store updates, we need to pass its own
              // subscription instance down to our descendants. That means rendering the same
              // Context instance, and putting a different value into the context.
              return /*#__PURE__*/React__default["default"].createElement(ContextToUse.Provider, {
                value: overriddenContextValue
              }, renderedWrappedComponent);
            }

            return renderedWrappedComponent;
          }, [ContextToUse, renderedWrappedComponent, overriddenContextValue]);
          return renderedChild;
        } // If we're in "pure" mode, ensure our wrapper component only re-renders when incoming props have changed.


        var Connect = pure ? /*#__PURE__*/React__default["default"].memo(ConnectFunction) : ConnectFunction;
        Connect.WrappedComponent = WrappedComponent;
        Connect.displayName = ConnectFunction.displayName = displayName;

        if (forwardRef) {
          var forwarded = /*#__PURE__*/React__default["default"].forwardRef(function forwardConnectRef(props, ref) {
            return /*#__PURE__*/React__default["default"].createElement(Connect, _extends$2({}, props, {
              reactReduxForwardedRef: ref
            }));
          });
          forwarded.displayName = displayName;
          forwarded.WrappedComponent = WrappedComponent;
          return hoistNonReactStatics_cjs(forwarded, WrappedComponent);
        }

        return hoistNonReactStatics_cjs(Connect, WrappedComponent);
      };
    }

    function is(x, y) {
      if (x === y) {
        return x !== 0 || y !== 0 || 1 / x === 1 / y;
      } else {
        return x !== x && y !== y;
      }
    }

    function shallowEqual(objA, objB) {
      if (is(objA, objB)) return true;

      if (_typeof$1(objA) !== 'object' || objA === null || _typeof$1(objB) !== 'object' || objB === null) {
        return false;
      }

      var keysA = Object.keys(objA);
      var keysB = Object.keys(objB);
      if (keysA.length !== keysB.length) return false;

      for (var i = 0; i < keysA.length; i++) {
        if (!Object.prototype.hasOwnProperty.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
          return false;
        }
      }

      return true;
    }

    function bindActionCreators$1(actionCreators, dispatch) {
      var boundActionCreators = {};

      var _loop = function _loop(key) {
        var actionCreator = actionCreators[key];

        if (typeof actionCreator === 'function') {
          boundActionCreators[key] = function () {
            return dispatch(actionCreator.apply(void 0, arguments));
          };
        }
      };

      for (var key in actionCreators) {
        _loop(key);
      }

      return boundActionCreators;
    }

    function wrapMapToPropsConstant(getConstant) {
      return function initConstantSelector(dispatch, options) {
        var constant = getConstant(dispatch, options);

        function constantSelector() {
          return constant;
        }

        constantSelector.dependsOnOwnProps = false;
        return constantSelector;
      };
    } // dependsOnOwnProps is used by createMapToPropsProxy to determine whether to pass props as args
    // to the mapToProps function being wrapped. It is also used by makePurePropsSelector to determine
    // whether mapToProps needs to be invoked when props have changed.
    //
    // A length of one signals that mapToProps does not depend on props from the parent component.
    // A length of zero is assumed to mean mapToProps is getting args via arguments or ...args and
    // therefore not reporting its length accurately..

    function getDependsOnOwnProps(mapToProps) {
      return mapToProps.dependsOnOwnProps !== null && mapToProps.dependsOnOwnProps !== undefined ? Boolean(mapToProps.dependsOnOwnProps) : mapToProps.length !== 1;
    } // Used by whenMapStateToPropsIsFunction and whenMapDispatchToPropsIsFunction,
    // this function wraps mapToProps in a proxy function which does several things:
    //
    //  * Detects whether the mapToProps function being called depends on props, which
    //    is used by selectorFactory to decide if it should reinvoke on props changes.
    //
    //  * On first call, handles mapToProps if returns another function, and treats that
    //    new function as the true mapToProps for subsequent calls.
    //
    //  * On first call, verifies the first result is a plain object, in order to warn
    //    the developer that their mapToProps function is not returning a valid result.
    //

    function wrapMapToPropsFunc(mapToProps, methodName) {
      return function initProxySelector(dispatch, _ref) {
        _ref.displayName;

        var proxy = function mapToPropsProxy(stateOrDispatch, ownProps) {
          return proxy.dependsOnOwnProps ? proxy.mapToProps(stateOrDispatch, ownProps) : proxy.mapToProps(stateOrDispatch);
        }; // allow detectFactoryAndVerify to get ownProps


        proxy.dependsOnOwnProps = true;

        proxy.mapToProps = function detectFactoryAndVerify(stateOrDispatch, ownProps) {
          proxy.mapToProps = mapToProps;
          proxy.dependsOnOwnProps = getDependsOnOwnProps(mapToProps);
          var props = proxy(stateOrDispatch, ownProps);

          if (typeof props === 'function') {
            proxy.mapToProps = props;
            proxy.dependsOnOwnProps = getDependsOnOwnProps(props);
            props = proxy(stateOrDispatch, ownProps);
          }
          return props;
        };

        return proxy;
      };
    }

    function whenMapDispatchToPropsIsFunction(mapDispatchToProps) {
      return typeof mapDispatchToProps === 'function' ? wrapMapToPropsFunc(mapDispatchToProps) : undefined;
    }
    function whenMapDispatchToPropsIsMissing(mapDispatchToProps) {
      return !mapDispatchToProps ? wrapMapToPropsConstant(function (dispatch) {
        return {
          dispatch: dispatch
        };
      }) : undefined;
    }
    function whenMapDispatchToPropsIsObject(mapDispatchToProps) {
      return mapDispatchToProps && _typeof$1(mapDispatchToProps) === 'object' ? wrapMapToPropsConstant(function (dispatch) {
        return bindActionCreators$1(mapDispatchToProps, dispatch);
      }) : undefined;
    }
    var defaultMapDispatchToPropsFactories = [whenMapDispatchToPropsIsFunction, whenMapDispatchToPropsIsMissing, whenMapDispatchToPropsIsObject];

    function whenMapStateToPropsIsFunction(mapStateToProps) {
      return typeof mapStateToProps === 'function' ? wrapMapToPropsFunc(mapStateToProps) : undefined;
    }
    function whenMapStateToPropsIsMissing(mapStateToProps) {
      return !mapStateToProps ? wrapMapToPropsConstant(function () {
        return {};
      }) : undefined;
    }
    var defaultMapStateToPropsFactories = [whenMapStateToPropsIsFunction, whenMapStateToPropsIsMissing];

    function defaultMergeProps(stateProps, dispatchProps, ownProps) {
      return _extends$2({}, ownProps, stateProps, dispatchProps);
    }
    function wrapMergePropsFunc(mergeProps) {
      return function initMergePropsProxy(dispatch, _ref) {
        _ref.displayName;
            var pure = _ref.pure,
            areMergedPropsEqual = _ref.areMergedPropsEqual;
        var hasRunOnce = false;
        var mergedProps;
        return function mergePropsProxy(stateProps, dispatchProps, ownProps) {
          var nextMergedProps = mergeProps(stateProps, dispatchProps, ownProps);

          if (hasRunOnce) {
            if (!pure || !areMergedPropsEqual(nextMergedProps, mergedProps)) mergedProps = nextMergedProps;
          } else {
            hasRunOnce = true;
            mergedProps = nextMergedProps;
          }

          return mergedProps;
        };
      };
    }
    function whenMergePropsIsFunction(mergeProps) {
      return typeof mergeProps === 'function' ? wrapMergePropsFunc(mergeProps) : undefined;
    }
    function whenMergePropsIsOmitted(mergeProps) {
      return !mergeProps ? function () {
        return defaultMergeProps;
      } : undefined;
    }
    var defaultMergePropsFactories = [whenMergePropsIsFunction, whenMergePropsIsOmitted];

    var _excluded$6 = ["initMapStateToProps", "initMapDispatchToProps", "initMergeProps"];
    function impureFinalPropsSelectorFactory(mapStateToProps, mapDispatchToProps, mergeProps, dispatch) {
      return function impureFinalPropsSelector(state, ownProps) {
        return mergeProps(mapStateToProps(state, ownProps), mapDispatchToProps(dispatch, ownProps), ownProps);
      };
    }
    function pureFinalPropsSelectorFactory(mapStateToProps, mapDispatchToProps, mergeProps, dispatch, _ref) {
      var areStatesEqual = _ref.areStatesEqual,
          areOwnPropsEqual = _ref.areOwnPropsEqual,
          areStatePropsEqual = _ref.areStatePropsEqual;
      var hasRunAtLeastOnce = false;
      var state;
      var ownProps;
      var stateProps;
      var dispatchProps;
      var mergedProps;

      function handleFirstCall(firstState, firstOwnProps) {
        state = firstState;
        ownProps = firstOwnProps;
        stateProps = mapStateToProps(state, ownProps);
        dispatchProps = mapDispatchToProps(dispatch, ownProps);
        mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
        hasRunAtLeastOnce = true;
        return mergedProps;
      }

      function handleNewPropsAndNewState() {
        stateProps = mapStateToProps(state, ownProps);
        if (mapDispatchToProps.dependsOnOwnProps) dispatchProps = mapDispatchToProps(dispatch, ownProps);
        mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
        return mergedProps;
      }

      function handleNewProps() {
        if (mapStateToProps.dependsOnOwnProps) stateProps = mapStateToProps(state, ownProps);
        if (mapDispatchToProps.dependsOnOwnProps) dispatchProps = mapDispatchToProps(dispatch, ownProps);
        mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
        return mergedProps;
      }

      function handleNewState() {
        var nextStateProps = mapStateToProps(state, ownProps);
        var statePropsChanged = !areStatePropsEqual(nextStateProps, stateProps);
        stateProps = nextStateProps;
        if (statePropsChanged) mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
        return mergedProps;
      }

      function handleSubsequentCalls(nextState, nextOwnProps) {
        var propsChanged = !areOwnPropsEqual(nextOwnProps, ownProps);
        var stateChanged = !areStatesEqual(nextState, state);
        state = nextState;
        ownProps = nextOwnProps;
        if (propsChanged && stateChanged) return handleNewPropsAndNewState();
        if (propsChanged) return handleNewProps();
        if (stateChanged) return handleNewState();
        return mergedProps;
      }

      return function pureFinalPropsSelector(nextState, nextOwnProps) {
        return hasRunAtLeastOnce ? handleSubsequentCalls(nextState, nextOwnProps) : handleFirstCall(nextState, nextOwnProps);
      };
    } // TODO: Add more comments
    // If pure is true, the selector returned by selectorFactory will memoize its results,
    // allowing connectAdvanced's shouldComponentUpdate to return false if final
    // props have not changed. If false, the selector will always return a new
    // object and shouldComponentUpdate will always return true.

    function finalPropsSelectorFactory(dispatch, _ref2) {
      var initMapStateToProps = _ref2.initMapStateToProps,
          initMapDispatchToProps = _ref2.initMapDispatchToProps,
          initMergeProps = _ref2.initMergeProps,
          options = _objectWithoutPropertiesLoose$1(_ref2, _excluded$6);

      var mapStateToProps = initMapStateToProps(dispatch, options);
      var mapDispatchToProps = initMapDispatchToProps(dispatch, options);
      var mergeProps = initMergeProps(dispatch, options);

      var selectorFactory = options.pure ? pureFinalPropsSelectorFactory : impureFinalPropsSelectorFactory;
      return selectorFactory(mapStateToProps, mapDispatchToProps, mergeProps, dispatch, options);
    }

    var _excluded$5 = ["pure", "areStatesEqual", "areOwnPropsEqual", "areStatePropsEqual", "areMergedPropsEqual"];
    /*
      connect is a facade over connectAdvanced. It turns its args into a compatible
      selectorFactory, which has the signature:

        (dispatch, options) => (nextState, nextOwnProps) => nextFinalProps
      
      connect passes its args to connectAdvanced as options, which will in turn pass them to
      selectorFactory each time a Connect component instance is instantiated or hot reloaded.

      selectorFactory returns a final props selector from its mapStateToProps,
      mapStateToPropsFactories, mapDispatchToProps, mapDispatchToPropsFactories, mergeProps,
      mergePropsFactories, and pure args.

      The resulting final props selector is called by the Connect component instance whenever
      it receives new props or store state.
     */

    function match(arg, factories, name) {
      for (var i = factories.length - 1; i >= 0; i--) {
        var result = factories[i](arg);
        if (result) return result;
      }

      return function (dispatch, options) {
        throw new Error("Invalid value of type " + _typeof$1(arg) + " for " + name + " argument when connecting component " + options.wrappedComponentName + ".");
      };
    }

    function strictEqual(a, b) {
      return a === b;
    } // createConnect with default args builds the 'official' connect behavior. Calling it with
    // different options opens up some testing and extensibility scenarios


    function createConnect(_temp) {
      var _ref = _temp === void 0 ? {} : _temp,
          _ref$connectHOC = _ref.connectHOC,
          connectHOC = _ref$connectHOC === void 0 ? connectAdvanced : _ref$connectHOC,
          _ref$mapStateToPropsF = _ref.mapStateToPropsFactories,
          mapStateToPropsFactories = _ref$mapStateToPropsF === void 0 ? defaultMapStateToPropsFactories : _ref$mapStateToPropsF,
          _ref$mapDispatchToPro = _ref.mapDispatchToPropsFactories,
          mapDispatchToPropsFactories = _ref$mapDispatchToPro === void 0 ? defaultMapDispatchToPropsFactories : _ref$mapDispatchToPro,
          _ref$mergePropsFactor = _ref.mergePropsFactories,
          mergePropsFactories = _ref$mergePropsFactor === void 0 ? defaultMergePropsFactories : _ref$mergePropsFactor,
          _ref$selectorFactory = _ref.selectorFactory,
          selectorFactory = _ref$selectorFactory === void 0 ? finalPropsSelectorFactory : _ref$selectorFactory;

      return function connect(mapStateToProps, mapDispatchToProps, mergeProps, _ref2) {
        if (_ref2 === void 0) {
          _ref2 = {};
        }

        var _ref3 = _ref2,
            _ref3$pure = _ref3.pure,
            pure = _ref3$pure === void 0 ? true : _ref3$pure,
            _ref3$areStatesEqual = _ref3.areStatesEqual,
            areStatesEqual = _ref3$areStatesEqual === void 0 ? strictEqual : _ref3$areStatesEqual,
            _ref3$areOwnPropsEqua = _ref3.areOwnPropsEqual,
            areOwnPropsEqual = _ref3$areOwnPropsEqua === void 0 ? shallowEqual : _ref3$areOwnPropsEqua,
            _ref3$areStatePropsEq = _ref3.areStatePropsEqual,
            areStatePropsEqual = _ref3$areStatePropsEq === void 0 ? shallowEqual : _ref3$areStatePropsEq,
            _ref3$areMergedPropsE = _ref3.areMergedPropsEqual,
            areMergedPropsEqual = _ref3$areMergedPropsE === void 0 ? shallowEqual : _ref3$areMergedPropsE,
            extraOptions = _objectWithoutPropertiesLoose$1(_ref3, _excluded$5);

        var initMapStateToProps = match(mapStateToProps, mapStateToPropsFactories, 'mapStateToProps');
        var initMapDispatchToProps = match(mapDispatchToProps, mapDispatchToPropsFactories, 'mapDispatchToProps');
        var initMergeProps = match(mergeProps, mergePropsFactories, 'mergeProps');
        return connectHOC(selectorFactory, _extends$2({
          // used in error messages
          methodName: 'connect',
          // used to compute Connect's displayName from the wrapped component's displayName.
          getDisplayName: function getDisplayName(name) {
            return "Connect(" + name + ")";
          },
          // if mapStateToProps is falsy, the Connect component doesn't subscribe to store state changes
          shouldHandleStateChanges: Boolean(mapStateToProps),
          // passed through to selectorFactory
          initMapStateToProps: initMapStateToProps,
          initMapDispatchToProps: initMapDispatchToProps,
          initMergeProps: initMergeProps,
          pure: pure,
          areStatesEqual: areStatesEqual,
          areOwnPropsEqual: areOwnPropsEqual,
          areStatePropsEqual: areStatePropsEqual,
          areMergedPropsEqual: areMergedPropsEqual
        }, extraOptions));
      };
    }
    var connect = /*#__PURE__*/createConnect();

    // with standard React renderers (ReactDOM, React Native)

    setBatch(reactDom.unstable_batchedUpdates);

    // Current version.
    var VERSION = '1.13.2'; // Establish the root object, `window` (`self`) in the browser, `global`
    // on the server, or `this` in some virtual machines. We use `self`
    // instead of `window` for `WebWorker` support.

    var root = (typeof self === "undefined" ? "undefined" : _typeof$1(self)) == 'object' && self.self === self && self || (typeof global === "undefined" ? "undefined" : _typeof$1(global)) == 'object' && global.global === global && global || Function('return this')() || {}; // Save bytes in the minified (but not gzipped) version:

    var ArrayProto = Array.prototype,
        ObjProto = Object.prototype;
    var SymbolProto = typeof Symbol !== 'undefined' ? Symbol.prototype : null; // Create quick reference variables for speed access to core prototypes.

    var push = ArrayProto.push,
        slice = ArrayProto.slice,
        toString = ObjProto.toString,
        hasOwnProperty = ObjProto.hasOwnProperty; // Modern feature detection.

    var supportsArrayBuffer = typeof ArrayBuffer !== 'undefined',
        supportsDataView = typeof DataView !== 'undefined'; // All **ECMAScript 5+** native function implementations that we hope to use
    // are declared here.

    var nativeIsArray = Array.isArray,
        nativeKeys = Object.keys,
        nativeCreate = Object.create,
        nativeIsView = supportsArrayBuffer && ArrayBuffer.isView; // Create references to these builtin functions because we override them.

    var _isNaN = isNaN,
        _isFinite = isFinite; // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.

    var hasEnumBug = !{
      toString: null
    }.propertyIsEnumerable('toString');
    var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString', 'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString']; // The largest integer that can be represented exactly.

    var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;

    // Some functions take a variable number of arguments, or a few expected
    // arguments at the beginning and then a variable number of values to operate
    // on. This helper accumulates all remaining arguments past the function’s
    // argument length (or an explicit `startIndex`), into an array that becomes
    // the last argument. Similar to ES6’s "rest parameter".
    function restArguments(func, startIndex) {
      startIndex = startIndex == null ? func.length - 1 : +startIndex;
      return function () {
        var length = Math.max(arguments.length - startIndex, 0),
            rest = Array(length),
            index = 0;

        for (; index < length; index++) {
          rest[index] = arguments[index + startIndex];
        }

        switch (startIndex) {
          case 0:
            return func.call(this, rest);

          case 1:
            return func.call(this, arguments[0], rest);

          case 2:
            return func.call(this, arguments[0], arguments[1], rest);
        }

        var args = Array(startIndex + 1);

        for (index = 0; index < startIndex; index++) {
          args[index] = arguments[index];
        }

        args[startIndex] = rest;
        return func.apply(this, args);
      };
    }

    // Is a given variable an object?
    function isObject(obj) {
      var type = _typeof$1(obj);

      return type === 'function' || type === 'object' && !!obj;
    }

    // Is a given value equal to null?
    function isNull(obj) {
      return obj === null;
    }

    // Is a given variable undefined?
    function isUndefined(obj) {
      return obj === void 0;
    }

    function isBoolean(obj) {
      return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
    }

    // Is a given value a DOM element?
    function isElement(obj) {
      return !!(obj && obj.nodeType === 1);
    }

    function tagTester(name) {
      var tag = '[object ' + name + ']';
      return function (obj) {
        return toString.call(obj) === tag;
      };
    }

    var isString = tagTester('String');

    var isNumber = tagTester('Number');

    var isDate = tagTester('Date');

    var isRegExp = tagTester('RegExp');

    var isError = tagTester('Error');

    var isSymbol$1 = tagTester('Symbol');

    var isArrayBuffer = tagTester('ArrayBuffer');

    var isFunction$1 = tagTester('Function'); // Optimize `isFunction` if appropriate. Work around some `typeof` bugs in old
    // v8, IE 11 (#1621), Safari 8 (#1929), and PhantomJS (#2236).

    var nodelist = root.document && root.document.childNodes;

    if (typeof /./ != 'function' && (typeof Int8Array === "undefined" ? "undefined" : _typeof$1(Int8Array)) != 'object' && typeof nodelist != 'function') {
      isFunction$1 = function isFunction(obj) {
        return typeof obj == 'function' || false;
      };
    }

    var isFunction$2 = isFunction$1;

    var hasObjectTag = tagTester('Object');

    // In IE 11, the most common among them, this problem also applies to
    // `Map`, `WeakMap` and `Set`.

    var hasStringTagBug = supportsDataView && hasObjectTag(new DataView(new ArrayBuffer(8))),
        isIE11 = typeof Map !== 'undefined' && hasObjectTag(new Map());

    var isDataView = tagTester('DataView'); // In IE 10 - Edge 13, we need a different heuristic
    // to determine whether an object is a `DataView`.

    function ie10IsDataView(obj) {
      return obj != null && isFunction$2(obj.getInt8) && isArrayBuffer(obj.buffer);
    }

    var isDataView$1 = hasStringTagBug ? ie10IsDataView : isDataView;

    // Delegates to ECMA5's native `Array.isArray`.

    var isArray$1 = nativeIsArray || tagTester('Array');

    function has$1(obj, key) {
      return obj != null && hasOwnProperty.call(obj, key);
    }

    var isArguments = tagTester('Arguments'); // Define a fallback version of the method in browsers (ahem, IE < 9), where
    // there isn't any inspectable "Arguments" type.

    (function () {
      if (!isArguments(arguments)) {
        isArguments = function isArguments(obj) {
          return has$1(obj, 'callee');
        };
      }
    })();

    var isArguments$1 = isArguments;

    function isFinite$1(obj) {
      return !isSymbol$1(obj) && _isFinite(obj) && !isNaN(parseFloat(obj));
    }

    function isNaN$1(obj) {
      return isNumber(obj) && _isNaN(obj);
    }

    // Predicate-generating function. Often useful outside of Underscore.
    function constant(value) {
      return function () {
        return value;
      };
    }

    function createSizePropertyCheck(getSizeProperty) {
      return function (collection) {
        var sizeProperty = getSizeProperty(collection);
        return typeof sizeProperty == 'number' && sizeProperty >= 0 && sizeProperty <= MAX_ARRAY_INDEX;
      };
    }

    // Internal helper to generate a function to obtain property `key` from `obj`.
    function shallowProperty(key) {
      return function (obj) {
        return obj == null ? void 0 : obj[key];
      };
    }

    var getByteLength = shallowProperty('byteLength');

    // `ArrayBuffer` et al.

    var isBufferLike = createSizePropertyCheck(getByteLength);

    var typedArrayPattern = /\[object ((I|Ui)nt(8|16|32)|Float(32|64)|Uint8Clamped|Big(I|Ui)nt64)Array\]/;

    function isTypedArray(obj) {
      // `ArrayBuffer.isView` is the most future-proof, so use it when available.
      // Otherwise, fall back on the above regular expression.
      return nativeIsView ? nativeIsView(obj) && !isDataView$1(obj) : isBufferLike(obj) && typedArrayPattern.test(toString.call(obj));
    }

    var isTypedArray$1 = supportsArrayBuffer ? isTypedArray : constant(false);

    var getLength = shallowProperty('length');

    // `collectNonEnumProps` used to depend on `_.contains`, but this led to
    // circular imports. `emulatedSet` is a one-off solution that only works for
    // arrays of strings.

    function emulatedSet(keys) {
      var hash = {};

      for (var l = keys.length, i = 0; i < l; ++i) {
        hash[keys[i]] = true;
      }

      return {
        contains: function contains(key) {
          return hash[key] === true;
        },
        push: function push(key) {
          hash[key] = true;
          return keys.push(key);
        }
      };
    } // Internal helper. Checks `keys` for the presence of keys in IE < 9 that won't
    // be iterated by `for key in ...` and thus missed. Extends `keys` in place if
    // needed.


    function collectNonEnumProps(obj, keys) {
      keys = emulatedSet(keys);
      var nonEnumIdx = nonEnumerableProps.length;
      var constructor = obj.constructor;
      var proto = isFunction$2(constructor) && constructor.prototype || ObjProto; // Constructor is a special case.

      var prop = 'constructor';
      if (has$1(obj, prop) && !keys.contains(prop)) keys.push(prop);

      while (nonEnumIdx--) {
        prop = nonEnumerableProps[nonEnumIdx];

        if (prop in obj && obj[prop] !== proto[prop] && !keys.contains(prop)) {
          keys.push(prop);
        }
      }
    }

    // Delegates to **ECMAScript 5**'s native `Object.keys`.

    function keys(obj) {
      if (!isObject(obj)) return [];
      if (nativeKeys) return nativeKeys(obj);
      var keys = [];

      for (var key in obj) {
        if (has$1(obj, key)) keys.push(key);
      } // Ahem, IE < 9.


      if (hasEnumBug) collectNonEnumProps(obj, keys);
      return keys;
    }

    // An "empty" object has no enumerable own-properties.

    function isEmpty(obj) {
      if (obj == null) return true; // Skip the more expensive `toString`-based type checks if `obj` has no
      // `.length`.

      var length = getLength(obj);
      if (typeof length == 'number' && (isArray$1(obj) || isString(obj) || isArguments$1(obj))) return length === 0;
      return getLength(keys(obj)) === 0;
    }

    function isMatch(object, attrs) {
      var _keys = keys(attrs),
          length = _keys.length;

      if (object == null) return !length;
      var obj = Object(object);

      for (var i = 0; i < length; i++) {
        var key = _keys[i];
        if (attrs[key] !== obj[key] || !(key in obj)) return false;
      }

      return true;
    }

    // be used OO-style. This wrapper holds altered versions of all functions added
    // through `_.mixin`. Wrapped objects may be chained.

    function _$6(obj) {
      if (obj instanceof _$6) return obj;
      if (!(this instanceof _$6)) return new _$6(obj);
      this._wrapped = obj;
    }
    _$6.VERSION = VERSION; // Extracts the result from a wrapped and chained object.

    _$6.prototype.value = function () {
      return this._wrapped;
    }; // Provide unwrapping proxies for some methods used in engine operations
    // such as arithmetic and JSON stringification.


    _$6.prototype.valueOf = _$6.prototype.toJSON = _$6.prototype.value;

    _$6.prototype.toString = function () {
      return String(this._wrapped);
    };

    // typed array or DataView to a new view, reusing the buffer.

    function toBufferView(bufferSource) {
      return new Uint8Array(bufferSource.buffer || bufferSource, bufferSource.byteOffset || 0, getByteLength(bufferSource));
    }

    var tagDataView = '[object DataView]'; // Internal recursive comparison function for `_.isEqual`.

    function eq(a, b, aStack, bStack) {
      // Identical objects are equal. `0 === -0`, but they aren't identical.
      // See the [Harmony `egal` proposal](https://wiki.ecmascript.org/doku.php?id=harmony:egal).
      if (a === b) return a !== 0 || 1 / a === 1 / b; // `null` or `undefined` only equal to itself (strict comparison).

      if (a == null || b == null) return false; // `NaN`s are equivalent, but non-reflexive.

      if (a !== a) return b !== b; // Exhaust primitive checks

      var type = _typeof$1(a);

      if (type !== 'function' && type !== 'object' && _typeof$1(b) != 'object') return false;
      return deepEq(a, b, aStack, bStack);
    } // Internal recursive comparison function for `_.isEqual`.


    function deepEq(a, b, aStack, bStack) {
      // Unwrap any wrapped objects.
      if (a instanceof _$6) a = a._wrapped;
      if (b instanceof _$6) b = b._wrapped; // Compare `[[Class]]` names.

      var className = toString.call(a);
      if (className !== toString.call(b)) return false; // Work around a bug in IE 10 - Edge 13.

      if (hasStringTagBug && className == '[object Object]' && isDataView$1(a)) {
        if (!isDataView$1(b)) return false;
        className = tagDataView;
      }

      switch (className) {
        // These types are compared by value.
        case '[object RegExp]': // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')

        case '[object String]':
          // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
          // equivalent to `new String("5")`.
          return '' + a === '' + b;

        case '[object Number]':
          // `NaN`s are equivalent, but non-reflexive.
          // Object(NaN) is equivalent to NaN.
          if (+a !== +a) return +b !== +b; // An `egal` comparison is performed for other numeric values.

          return +a === 0 ? 1 / +a === 1 / b : +a === +b;

        case '[object Date]':
        case '[object Boolean]':
          // Coerce dates and booleans to numeric primitive values. Dates are compared by their
          // millisecond representations. Note that invalid dates with millisecond representations
          // of `NaN` are not equivalent.
          return +a === +b;

        case '[object Symbol]':
          return SymbolProto.valueOf.call(a) === SymbolProto.valueOf.call(b);

        case '[object ArrayBuffer]':
        case tagDataView:
          // Coerce to typed array so we can fall through.
          return deepEq(toBufferView(a), toBufferView(b), aStack, bStack);
      }

      var areArrays = className === '[object Array]';

      if (!areArrays && isTypedArray$1(a)) {
        var byteLength = getByteLength(a);
        if (byteLength !== getByteLength(b)) return false;
        if (a.buffer === b.buffer && a.byteOffset === b.byteOffset) return true;
        areArrays = true;
      }

      if (!areArrays) {
        if (_typeof$1(a) != 'object' || _typeof$1(b) != 'object') return false; // Objects with different constructors are not equivalent, but `Object`s or `Array`s
        // from different frames are.

        var aCtor = a.constructor,
            bCtor = b.constructor;

        if (aCtor !== bCtor && !(isFunction$2(aCtor) && aCtor instanceof aCtor && isFunction$2(bCtor) && bCtor instanceof bCtor) && 'constructor' in a && 'constructor' in b) {
          return false;
        }
      } // Assume equality for cyclic structures. The algorithm for detecting cyclic
      // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
      // Initializing stack of traversed objects.
      // It's done here since we only need them for objects and arrays comparison.


      aStack = aStack || [];
      bStack = bStack || [];
      var length = aStack.length;

      while (length--) {
        // Linear search. Performance is inversely proportional to the number of
        // unique nested structures.
        if (aStack[length] === a) return bStack[length] === b;
      } // Add the first object to the stack of traversed objects.


      aStack.push(a);
      bStack.push(b); // Recursively compare objects and arrays.

      if (areArrays) {
        // Compare array lengths to determine if a deep comparison is necessary.
        length = a.length;
        if (length !== b.length) return false; // Deep compare the contents, ignoring non-numeric properties.

        while (length--) {
          if (!eq(a[length], b[length], aStack, bStack)) return false;
        }
      } else {
        // Deep compare objects.
        var _keys = keys(a),
            key;

        length = _keys.length; // Ensure that both objects contain the same number of properties before comparing deep equality.

        if (keys(b).length !== length) return false;

        while (length--) {
          // Deep compare each member
          key = _keys[length];
          if (!(has$1(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
        }
      } // Remove the first object from the stack of traversed objects.


      aStack.pop();
      bStack.pop();
      return true;
    } // Perform a deep comparison to check if two objects are equal.


    function isEqual$1(a, b) {
      return eq(a, b);
    }

    function allKeys(obj) {
      if (!isObject(obj)) return [];
      var keys = [];

      for (var key in obj) {
        keys.push(key);
      } // Ahem, IE < 9.


      if (hasEnumBug) collectNonEnumProps(obj, keys);
      return keys;
    }

    // some types in IE 11, we use a fingerprinting heuristic instead, based
    // on the methods. It's not great, but it's the best we got.
    // The fingerprint method lists are defined below.

    function ie11fingerprint(methods) {
      var length = getLength(methods);
      return function (obj) {
        if (obj == null) return false; // `Map`, `WeakMap` and `Set` have no enumerable keys.

        var keys = allKeys(obj);
        if (getLength(keys)) return false;

        for (var i = 0; i < length; i++) {
          if (!isFunction$2(obj[methods[i]])) return false;
        } // If we are testing against `WeakMap`, we need to ensure that
        // `obj` doesn't have a `forEach` method in order to distinguish
        // it from a regular `Map`.


        return methods !== weakMapMethods || !isFunction$2(obj[forEachName]);
      };
    } // In the interest of compact minification, we write
    // each string in the fingerprints only once.

    var forEachName = 'forEach',
        hasName = 'has',
        commonInit = ['clear', 'delete'],
        mapTail = ['get', hasName, 'set']; // `Map`, `WeakMap` and `Set` each have slightly different
    // combinations of the above sublists.

    var mapMethods = commonInit.concat(forEachName, mapTail),
        weakMapMethods = commonInit.concat(mapTail),
        setMethods = ['add'].concat(commonInit, forEachName, hasName);

    var isMap = isIE11 ? ie11fingerprint(mapMethods) : tagTester('Map');

    var isWeakMap = isIE11 ? ie11fingerprint(weakMapMethods) : tagTester('WeakMap');

    var isSet = isIE11 ? ie11fingerprint(setMethods) : tagTester('Set');

    var isWeakSet = tagTester('WeakSet');

    function values(obj) {
      var _keys = keys(obj);

      var length = _keys.length;
      var values = Array(length);

      for (var i = 0; i < length; i++) {
        values[i] = obj[_keys[i]];
      }

      return values;
    }

    // The opposite of `_.object` with one argument.

    function pairs(obj) {
      var _keys = keys(obj);

      var length = _keys.length;
      var pairs = Array(length);

      for (var i = 0; i < length; i++) {
        pairs[i] = [_keys[i], obj[_keys[i]]];
      }

      return pairs;
    }

    function invert(obj) {
      var result = {};

      var _keys = keys(obj);

      for (var i = 0, length = _keys.length; i < length; i++) {
        result[obj[_keys[i]]] = _keys[i];
      }

      return result;
    }

    function functions(obj) {
      var names = [];

      for (var key in obj) {
        if (isFunction$2(obj[key])) names.push(key);
      }

      return names.sort();
    }

    // An internal function for creating assigner functions.
    function createAssigner(keysFunc, defaults) {
      return function (obj) {
        var length = arguments.length;
        if (defaults) obj = Object(obj);
        if (length < 2 || obj == null) return obj;

        for (var index = 1; index < length; index++) {
          var source = arguments[index],
              keys = keysFunc(source),
              l = keys.length;

          for (var i = 0; i < l; i++) {
            var key = keys[i];
            if (!defaults || obj[key] === void 0) obj[key] = source[key];
          }
        }

        return obj;
      };
    }

    var extend = createAssigner(allKeys);

    // object(s).
    // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)

    var extendOwn = createAssigner(keys);

    var defaults = createAssigner(allKeys, true);

    function ctor() {
      return function () {};
    } // An internal function for creating a new object that inherits from another.


    function baseCreate(prototype) {
      if (!isObject(prototype)) return {};
      if (nativeCreate) return nativeCreate(prototype);
      var Ctor = ctor();
      Ctor.prototype = prototype;
      var result = new Ctor();
      Ctor.prototype = null;
      return result;
    }

    // If additional properties are provided then they will be added to the
    // created object.

    function create(prototype, props) {
      var result = baseCreate(prototype);
      if (props) extendOwn(result, props);
      return result;
    }

    function clone(obj) {
      if (!isObject(obj)) return obj;
      return isArray$1(obj) ? obj.slice() : extend({}, obj);
    }

    // Invokes `interceptor` with the `obj` and then returns `obj`.
    // The primary purpose of this method is to "tap into" a method chain, in
    // order to perform operations on intermediate results within the chain.
    function tap(obj, interceptor) {
      interceptor(obj);
      return obj;
    }

    // Like `_.iteratee`, this function can be customized.

    function toPath$1(path) {
      return isArray$1(path) ? path : [path];
    }
    _$6.toPath = toPath$1;

    // Similar to `cb` for `_.iteratee`.

    function toPath(path) {
      return _$6.toPath(path);
    }

    // Internal function to obtain a nested property in `obj` along `path`.
    function deepGet(obj, path) {
      var length = path.length;

      for (var i = 0; i < length; i++) {
        if (obj == null) return void 0;
        obj = obj[path[i]];
      }

      return length ? obj : void 0;
    }

    // If any property in `path` does not exist or if the value is
    // `undefined`, return `defaultValue` instead.
    // The `path` is normalized through `_.toPath`.

    function get(object, path, defaultValue) {
      var value = deepGet(object, toPath(path));
      return isUndefined(value) ? defaultValue : value;
    }

    // itself (in other words, not on a prototype). Unlike the internal `has`
    // function, this public version can also traverse nested properties.

    function has(obj, path) {
      path = toPath(path);
      var length = path.length;

      for (var i = 0; i < length; i++) {
        var key = path[i];
        if (!has$1(obj, key)) return false;
        obj = obj[key];
      }

      return !!length;
    }

    // Keep the identity function around for default iteratees.
    function identity(value) {
      return value;
    }

    // `key:value` pairs.

    function matcher(attrs) {
      attrs = extendOwn({}, attrs);
      return function (obj) {
        return isMatch(obj, attrs);
      };
    }

    // properties down the given `path`, specified as an array of keys or indices.

    function property(path) {
      path = toPath(path);
      return function (obj) {
        return deepGet(obj, path);
      };
    }

    // Internal function that returns an efficient (for current engines) version
    // of the passed-in callback, to be repeatedly applied in other Underscore
    // functions.
    function optimizeCb(func, context, argCount) {
      if (context === void 0) return func;

      switch (argCount == null ? 3 : argCount) {
        case 1:
          return function (value) {
            return func.call(context, value);
          };
        // The 2-argument case is omitted because we’re not using it.

        case 3:
          return function (value, index, collection) {
            return func.call(context, value, index, collection);
          };

        case 4:
          return function (accumulator, value, index, collection) {
            return func.call(context, accumulator, value, index, collection);
          };
      }

      return function () {
        return func.apply(context, arguments);
      };
    }

    // element in a collection, returning the desired result — either `_.identity`,
    // an arbitrary callback, a property matcher, or a property accessor.

    function baseIteratee(value, context, argCount) {
      if (value == null) return identity;
      if (isFunction$2(value)) return optimizeCb(value, context, argCount);
      if (isObject(value) && !isArray$1(value)) return matcher(value);
      return property(value);
    }

    // `_.iteratee` if they want additional predicate/iteratee shorthand styles.
    // This abstraction hides the internal-only `argCount` argument.

    function iteratee(value, context) {
      return baseIteratee(value, context, Infinity);
    }
    _$6.iteratee = iteratee;

    // `_.iteratee` if overridden, otherwise `baseIteratee`.

    function cb(value, context, argCount) {
      if (_$6.iteratee !== iteratee) return _$6.iteratee(value, context);
      return baseIteratee(value, context, argCount);
    }

    // In contrast to `_.map` it returns an object.

    function mapObject(obj, iteratee, context) {
      iteratee = cb(iteratee, context);

      var _keys = keys(obj),
          length = _keys.length,
          results = {};

      for (var index = 0; index < length; index++) {
        var currentKey = _keys[index];
        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
      }

      return results;
    }

    // Predicate-generating function. Often useful outside of Underscore.
    function noop() {}

    function propertyOf(obj) {
      if (obj == null) return noop;
      return function (path) {
        return get(obj, path);
      };
    }

    function times(n, iteratee, context) {
      var accum = Array(Math.max(0, n));
      iteratee = optimizeCb(iteratee, context, 1);

      for (var i = 0; i < n; i++) {
        accum[i] = iteratee(i);
      }

      return accum;
    }

    // Return a random integer between `min` and `max` (inclusive).
    function random(min, max) {
      if (max == null) {
        max = min;
        min = 0;
      }

      return min + Math.floor(Math.random() * (max - min + 1));
    }

    // A (possibly faster) way to get the current timestamp as an integer.
    var now = Date.now || function () {
      return new Date().getTime();
    };

    // to/from HTML interpolation.

    function createEscaper(map) {
      var escaper = function escaper(match) {
        return map[match];
      }; // Regexes for identifying a key that needs to be escaped.


      var source = '(?:' + keys(map).join('|') + ')';
      var testRegexp = RegExp(source);
      var replaceRegexp = RegExp(source, 'g');
      return function (string) {
        string = string == null ? '' : '' + string;
        return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
      };
    }

    // Internal list of HTML entities for escaping.
    var escapeMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '`': '&#x60;'
    };

    var escape$1 = createEscaper(escapeMap);

    var unescapeMap = invert(escapeMap);

    var unescape = createEscaper(unescapeMap);

    // following template settings to use alternative delimiters.

    var templateSettings = _$6.templateSettings = {
      evaluate: /<%([\s\S]+?)%>/g,
      interpolate: /<%=([\s\S]+?)%>/g,
      escape: /<%-([\s\S]+?)%>/g
    };

    // interpolation, evaluation or escaping regex, we need one that is
    // guaranteed not to match.

    var noMatch = /(.)^/; // Certain characters need to be escaped so that they can be put into a
    // string literal.

    var escapes = {
      "'": "'",
      '\\': '\\',
      '\r': 'r',
      '\n': 'n',
      "\u2028": 'u2028',
      "\u2029": 'u2029'
    };
    var escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;

    function escapeChar(match) {
      return '\\' + escapes[match];
    } // In order to prevent third-party code injection through
    // `_.templateSettings.variable`, we test it against the following regular
    // expression. It is intentionally a bit more liberal than just matching valid
    // identifiers, but still prevents possible loopholes through defaults or
    // destructuring assignment.


    var bareIdentifier = /^\s*(\w|\$)+\s*$/; // JavaScript micro-templating, similar to John Resig's implementation.
    // Underscore templating handles arbitrary delimiters, preserves whitespace,
    // and correctly escapes quotes within interpolated code.
    // NB: `oldSettings` only exists for backwards compatibility.

    function template(text, settings, oldSettings) {
      if (!settings && oldSettings) settings = oldSettings;
      settings = defaults({}, settings, _$6.templateSettings); // Combine delimiters into one regular expression via alternation.

      var matcher = RegExp([(settings.escape || noMatch).source, (settings.interpolate || noMatch).source, (settings.evaluate || noMatch).source].join('|') + '|$', 'g'); // Compile the template source, escaping string literals appropriately.

      var index = 0;
      var source = "__p+='";
      text.replace(matcher, function (match, escape, interpolate, evaluate, offset) {
        source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
        index = offset + match.length;

        if (escape) {
          source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
        } else if (interpolate) {
          source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
        } else if (evaluate) {
          source += "';\n" + evaluate + "\n__p+='";
        } // Adobe VMs need the match returned to produce the correct offset.


        return match;
      });
      source += "';\n";
      var argument = settings.variable;

      if (argument) {
        // Insure against third-party code injection. (CVE-2021-23358)
        if (!bareIdentifier.test(argument)) throw new Error('variable is not a bare identifier: ' + argument);
      } else {
        // If a variable is not specified, place data values in local scope.
        source = 'with(obj||{}){\n' + source + '}\n';
        argument = 'obj';
      }

      source = "var __t,__p='',__j=Array.prototype.join," + "print=function(){__p+=__j.call(arguments,'');};\n" + source + 'return __p;\n';
      var render;

      try {
        render = new Function(argument, '_', source);
      } catch (e) {
        e.source = source;
        throw e;
      }

      var template = function template(data) {
        return render.call(this, data, _$6);
      }; // Provide the compiled source as a convenience for precompilation.


      template.source = 'function(' + argument + '){\n' + source + '}';
      return template;
    }

    // is invoked with its parent as context. Returns the value of the final
    // child, or `fallback` if any child is undefined.

    function result(obj, path, fallback) {
      path = toPath(path);
      var length = path.length;

      if (!length) {
        return isFunction$2(fallback) ? fallback.call(obj) : fallback;
      }

      for (var i = 0; i < length; i++) {
        var prop = obj == null ? void 0 : obj[path[i]];

        if (prop === void 0) {
          prop = fallback;
          i = length; // Ensure we don't continue iterating.
        }

        obj = isFunction$2(prop) ? prop.call(obj) : prop;
      }

      return obj;
    }

    // Generate a unique integer id (unique within the entire client session).
    // Useful for temporary DOM ids.
    var idCounter = 0;
    function uniqueId(prefix) {
      var id = ++idCounter + '';
      return prefix ? prefix + id : id;
    }

    function chain(obj) {
      var instance = _$6(obj);

      instance._chain = true;
      return instance;
    }

    // `args`. Determines whether to execute a function as a constructor or as a
    // normal function.

    function executeBound(sourceFunc, boundFunc, context, callingContext, args) {
      if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
      var self = baseCreate(sourceFunc.prototype);
      var result = sourceFunc.apply(self, args);
      if (isObject(result)) return result;
      return self;
    }

    // arguments pre-filled, without changing its dynamic `this` context. `_` acts
    // as a placeholder by default, allowing any combination of arguments to be
    // pre-filled. Set `_.partial.placeholder` for a custom placeholder argument.

    var partial = restArguments(function (func, boundArgs) {
      var placeholder = partial.placeholder;

      var bound = function bound() {
        var position = 0,
            length = boundArgs.length;
        var args = Array(length);

        for (var i = 0; i < length; i++) {
          args[i] = boundArgs[i] === placeholder ? arguments[position++] : boundArgs[i];
        }

        while (position < arguments.length) {
          args.push(arguments[position++]);
        }

        return executeBound(func, bound, this, this, args);
      };

      return bound;
    });
    partial.placeholder = _$6;

    // optionally).

    var bind = restArguments(function (func, context, args) {
      if (!isFunction$2(func)) throw new TypeError('Bind must be called on a function');
      var bound = restArguments(function (callArgs) {
        return executeBound(func, bound, context, this, args.concat(callArgs));
      });
      return bound;
    });

    // should be iterated as an array or as an object.
    // Related: https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
    // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094

    var isArrayLike = createSizePropertyCheck(getLength);

    function flatten$2(input, depth, strict, output) {
      output = output || [];

      if (!depth && depth !== 0) {
        depth = Infinity;
      } else if (depth <= 0) {
        return output.concat(input);
      }

      var idx = output.length;

      for (var i = 0, length = getLength(input); i < length; i++) {
        var value = input[i];

        if (isArrayLike(value) && (isArray$1(value) || isArguments$1(value))) {
          // Flatten current level of array or arguments object.
          if (depth > 1) {
            flatten$2(value, depth - 1, strict, output);
            idx = output.length;
          } else {
            var j = 0,
                len = value.length;

            while (j < len) {
              output[idx++] = value[j++];
            }
          }
        } else if (!strict) {
          output[idx++] = value;
        }
      }

      return output;
    }

    // are the method names to be bound. Useful for ensuring that all callbacks
    // defined on an object belong to it.

    var bindAll = restArguments(function (obj, keys) {
      keys = flatten$2(keys, false, false);
      var index = keys.length;
      if (index < 1) throw new Error('bindAll must be passed function names');

      while (index--) {
        var key = keys[index];
        obj[key] = bind(obj[key], obj);
      }

      return obj;
    });

    function memoize$1(func, hasher) {
      var memoize = function memoize(key) {
        var cache = memoize.cache;
        var address = '' + (hasher ? hasher.apply(this, arguments) : key);
        if (!has$1(cache, address)) cache[address] = func.apply(this, arguments);
        return cache[address];
      };

      memoize.cache = {};
      return memoize;
    }

    // it with the arguments supplied.

    var delay = restArguments(function (func, wait, args) {
      return setTimeout(function () {
        return func.apply(null, args);
      }, wait);
    });

    // cleared.

    var defer = partial(delay, _$6, 1);

    // during a given window of time. Normally, the throttled function will run
    // as much as it can, without ever going more than once per `wait` duration;
    // but if you'd like to disable the execution on the leading edge, pass
    // `{leading: false}`. To disable execution on the trailing edge, ditto.

    function throttle(func, wait, options) {
      var timeout, context, args, result;
      var previous = 0;
      if (!options) options = {};

      var later = function later() {
        previous = options.leading === false ? 0 : now();
        timeout = null;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      };

      var throttled = function throttled() {
        var _now = now();

        if (!previous && options.leading === false) previous = _now;
        var remaining = wait - (_now - previous);
        context = this;
        args = arguments;

        if (remaining <= 0 || remaining > wait) {
          if (timeout) {
            clearTimeout(timeout);
            timeout = null;
          }

          previous = _now;
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        } else if (!timeout && options.trailing !== false) {
          timeout = setTimeout(later, remaining);
        }

        return result;
      };

      throttled.cancel = function () {
        clearTimeout(timeout);
        previous = 0;
        timeout = context = args = null;
      };

      return throttled;
    }

    // function is triggered. The end of a sequence is defined by the `wait`
    // parameter. If `immediate` is passed, the argument function will be
    // triggered at the beginning of the sequence instead of at the end.

    function debounce(func, wait, immediate) {
      var timeout, previous, args, result, context;

      var later = function later() {
        var passed = now() - previous;

        if (wait > passed) {
          timeout = setTimeout(later, wait - passed);
        } else {
          timeout = null;
          if (!immediate) result = func.apply(context, args); // This check is needed because `func` can recursively invoke `debounced`.

          if (!timeout) args = context = null;
        }
      };

      var debounced = restArguments(function (_args) {
        context = this;
        args = _args;
        previous = now();

        if (!timeout) {
          timeout = setTimeout(later, wait);
          if (immediate) result = func.apply(context, args);
        }

        return result;
      });

      debounced.cancel = function () {
        clearTimeout(timeout);
        timeout = args = context = null;
      };

      return debounced;
    }

    // allowing you to adjust arguments, run code before and after, and
    // conditionally execute the original function.

    function wrap(func, wrapper) {
      return partial(wrapper, func);
    }

    // Returns a negated version of the passed-in predicate.
    function negate(predicate) {
      return function () {
        return !predicate.apply(this, arguments);
      };
    }

    // Returns a function that is the composition of a list of functions, each
    // consuming the return value of the function that follows.
    function compose$2() {
      var args = arguments;
      var start = args.length - 1;
      return function () {
        var i = start;
        var result = args[start].apply(this, arguments);

        while (i--) {
          result = args[i].call(this, result);
        }

        return result;
      };
    }

    // Returns a function that will only be executed on and after the Nth call.
    function after(times, func) {
      return function () {
        if (--times < 1) {
          return func.apply(this, arguments);
        }
      };
    }

    // Returns a function that will only be executed up to (but not including) the
    // Nth call.
    function before(times, func) {
      var memo;
      return function () {
        if (--times > 0) {
          memo = func.apply(this, arguments);
        }

        if (times <= 1) func = null;
        return memo;
      };
    }

    // often you call it. Useful for lazy initialization.

    var once = partial(before, 2);

    function findKey(obj, predicate, context) {
      predicate = cb(predicate, context);

      var _keys = keys(obj),
          key;

      for (var i = 0, length = _keys.length; i < length; i++) {
        key = _keys[i];
        if (predicate(obj[key], key, obj)) return key;
      }
    }

    function createPredicateIndexFinder(dir) {
      return function (array, predicate, context) {
        predicate = cb(predicate, context);
        var length = getLength(array);
        var index = dir > 0 ? 0 : length - 1;

        for (; index >= 0 && index < length; index += dir) {
          if (predicate(array[index], index, array)) return index;
        }

        return -1;
      };
    }

    var findIndex = createPredicateIndexFinder(1);

    var findLastIndex = createPredicateIndexFinder(-1);

    // an object should be inserted so as to maintain order. Uses binary search.

    function sortedIndex(array, obj, iteratee, context) {
      iteratee = cb(iteratee, context, 1);
      var value = iteratee(obj);
      var low = 0,
          high = getLength(array);

      while (low < high) {
        var mid = Math.floor((low + high) / 2);
        if (iteratee(array[mid]) < value) low = mid + 1;else high = mid;
      }

      return low;
    }

    function createIndexFinder(dir, predicateFind, sortedIndex) {
      return function (array, item, idx) {
        var i = 0,
            length = getLength(array);

        if (typeof idx == 'number') {
          if (dir > 0) {
            i = idx >= 0 ? idx : Math.max(idx + length, i);
          } else {
            length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
          }
        } else if (sortedIndex && idx && length) {
          idx = sortedIndex(array, item);
          return array[idx] === item ? idx : -1;
        }

        if (item !== item) {
          idx = predicateFind(slice.call(array, i, length), isNaN$1);
          return idx >= 0 ? idx + i : -1;
        }

        for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
          if (array[idx] === item) return idx;
        }

        return -1;
      };
    }

    // or -1 if the item is not included in the array.
    // If the array is large and already in sort order, pass `true`
    // for **isSorted** to use binary search.

    var indexOf = createIndexFinder(1, findIndex, sortedIndex);

    // or -1 if the item is not included in the array.

    var lastIndexOf = createIndexFinder(-1, findLastIndex);

    function find(obj, predicate, context) {
      var keyFinder = isArrayLike(obj) ? findIndex : findKey;
      var key = keyFinder(obj, predicate, context);
      if (key !== void 0 && key !== -1) return obj[key];
    }

    // object containing specific `key:value` pairs.

    function findWhere(obj, attrs) {
      return find(obj, matcher(attrs));
    }

    // implementation, aka `forEach`.
    // Handles raw objects in addition to array-likes. Treats all
    // sparse array-likes as if they were dense.

    function each(obj, iteratee, context) {
      iteratee = optimizeCb(iteratee, context);
      var i, length;

      if (isArrayLike(obj)) {
        for (i = 0, length = obj.length; i < length; i++) {
          iteratee(obj[i], i, obj);
        }
      } else {
        var _keys = keys(obj);

        for (i = 0, length = _keys.length; i < length; i++) {
          iteratee(obj[_keys[i]], _keys[i], obj);
        }
      }

      return obj;
    }

    function map(obj, iteratee, context) {
      iteratee = cb(iteratee, context);

      var _keys = !isArrayLike(obj) && keys(obj),
          length = (_keys || obj).length,
          results = Array(length);

      for (var index = 0; index < length; index++) {
        var currentKey = _keys ? _keys[index] : index;
        results[index] = iteratee(obj[currentKey], currentKey, obj);
      }

      return results;
    }

    function createReduce(dir) {
      // Wrap code that reassigns argument variables in a separate function than
      // the one that accesses `arguments.length` to avoid a perf hit. (#1991)
      var reducer = function reducer(obj, iteratee, memo, initial) {
        var _keys = !isArrayLike(obj) && keys(obj),
            length = (_keys || obj).length,
            index = dir > 0 ? 0 : length - 1;

        if (!initial) {
          memo = obj[_keys ? _keys[index] : index];
          index += dir;
        }

        for (; index >= 0 && index < length; index += dir) {
          var currentKey = _keys ? _keys[index] : index;
          memo = iteratee(memo, obj[currentKey], currentKey, obj);
        }

        return memo;
      };

      return function (obj, iteratee, memo, context) {
        var initial = arguments.length >= 3;
        return reducer(obj, optimizeCb(iteratee, context, 4), memo, initial);
      };
    }

    // or `foldl`.

    var reduce = createReduce(1);

    var reduceRight = createReduce(-1);

    function filter$1(obj, predicate, context) {
      var results = [];
      predicate = cb(predicate, context);
      each(obj, function (value, index, list) {
        if (predicate(value, index, list)) results.push(value);
      });
      return results;
    }

    function reject(obj, predicate, context) {
      return filter$1(obj, negate(cb(predicate)), context);
    }

    function every(obj, predicate, context) {
      predicate = cb(predicate, context);

      var _keys = !isArrayLike(obj) && keys(obj),
          length = (_keys || obj).length;

      for (var index = 0; index < length; index++) {
        var currentKey = _keys ? _keys[index] : index;
        if (!predicate(obj[currentKey], currentKey, obj)) return false;
      }

      return true;
    }

    function some(obj, predicate, context) {
      predicate = cb(predicate, context);

      var _keys = !isArrayLike(obj) && keys(obj),
          length = (_keys || obj).length;

      for (var index = 0; index < length; index++) {
        var currentKey = _keys ? _keys[index] : index;
        if (predicate(obj[currentKey], currentKey, obj)) return true;
      }

      return false;
    }

    function contains(obj, item, fromIndex, guard) {
      if (!isArrayLike(obj)) obj = values(obj);
      if (typeof fromIndex != 'number' || guard) fromIndex = 0;
      return indexOf(obj, item, fromIndex) >= 0;
    }

    var invoke = restArguments(function (obj, path, args) {
      var contextPath, func;

      if (isFunction$2(path)) {
        func = path;
      } else {
        path = toPath(path);
        contextPath = path.slice(0, -1);
        path = path[path.length - 1];
      }

      return map(obj, function (context) {
        var method = func;

        if (!method) {
          if (contextPath && contextPath.length) {
            context = deepGet(context, contextPath);
          }

          if (context == null) return void 0;
          method = context[path];
        }

        return method == null ? method : method.apply(context, args);
      });
    });

    function pluck(obj, key) {
      return map(obj, property(key));
    }

    // objects containing specific `key:value` pairs.

    function where(obj, attrs) {
      return filter$1(obj, matcher(attrs));
    }

    function max(obj, iteratee, context) {
      var result = -Infinity,
          lastComputed = -Infinity,
          value,
          computed;

      if (iteratee == null || typeof iteratee == 'number' && _typeof$1(obj[0]) != 'object' && obj != null) {
        obj = isArrayLike(obj) ? obj : values(obj);

        for (var i = 0, length = obj.length; i < length; i++) {
          value = obj[i];

          if (value != null && value > result) {
            result = value;
          }
        }
      } else {
        iteratee = cb(iteratee, context);
        each(obj, function (v, index, list) {
          computed = iteratee(v, index, list);

          if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
            result = v;
            lastComputed = computed;
          }
        });
      }

      return result;
    }

    function min(obj, iteratee, context) {
      var result = Infinity,
          lastComputed = Infinity,
          value,
          computed;

      if (iteratee == null || typeof iteratee == 'number' && _typeof$1(obj[0]) != 'object' && obj != null) {
        obj = isArrayLike(obj) ? obj : values(obj);

        for (var i = 0, length = obj.length; i < length; i++) {
          value = obj[i];

          if (value != null && value < result) {
            result = value;
          }
        }
      } else {
        iteratee = cb(iteratee, context);
        each(obj, function (v, index, list) {
          computed = iteratee(v, index, list);

          if (computed < lastComputed || computed === Infinity && result === Infinity) {
            result = v;
            lastComputed = computed;
          }
        });
      }

      return result;
    }

    var reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;
    function toArray(obj) {
      if (!obj) return [];
      if (isArray$1(obj)) return slice.call(obj);

      if (isString(obj)) {
        // Keep surrogate pair characters together.
        return obj.match(reStrSymbol);
      }

      if (isArrayLike(obj)) return map(obj, identity);
      return values(obj);
    }

    // [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
    // If **n** is not specified, returns a single random element.
    // The internal `guard` argument allows it to work with `_.map`.

    function sample(obj, n, guard) {
      if (n == null || guard) {
        if (!isArrayLike(obj)) obj = values(obj);
        return obj[random(obj.length - 1)];
      }

      var sample = toArray(obj);
      var length = getLength(sample);
      n = Math.max(Math.min(n, length), 0);
      var last = length - 1;

      for (var index = 0; index < n; index++) {
        var rand = random(index, last);
        var temp = sample[index];
        sample[index] = sample[rand];
        sample[rand] = temp;
      }

      return sample.slice(0, n);
    }

    function shuffle(obj) {
      return sample(obj, Infinity);
    }

    function sortBy(obj, iteratee, context) {
      var index = 0;
      iteratee = cb(iteratee, context);
      return pluck(map(obj, function (value, key, list) {
        return {
          value: value,
          index: index++,
          criteria: iteratee(value, key, list)
        };
      }).sort(function (left, right) {
        var a = left.criteria;
        var b = right.criteria;

        if (a !== b) {
          if (a > b || a === void 0) return 1;
          if (a < b || b === void 0) return -1;
        }

        return left.index - right.index;
      }), 'value');
    }

    function group(behavior, partition) {
      return function (obj, iteratee, context) {
        var result = partition ? [[], []] : {};
        iteratee = cb(iteratee, context);
        each(obj, function (value, index) {
          var key = iteratee(value, index, obj);
          behavior(result, value, key);
        });
        return result;
      };
    }

    // to group by, or a function that returns the criterion.

    var groupBy = group(function (result, value, key) {
      if (has$1(result, key)) result[key].push(value);else result[key] = [value];
    });

    // when you know that your index values will be unique.

    var indexBy = group(function (result, value, key) {
      result[key] = value;
    });

    // either a string attribute to count by, or a function that returns the
    // criterion.

    var countBy = group(function (result, value, key) {
      if (has$1(result, key)) result[key]++;else result[key] = 1;
    });

    // truth test, and one whose elements all do not pass the truth test.

    var partition = group(function (result, value, pass) {
      result[pass ? 0 : 1].push(value);
    }, true);

    function size(obj) {
      if (obj == null) return 0;
      return isArrayLike(obj) ? obj.length : keys(obj).length;
    }

    // Internal `_.pick` helper function to determine whether `key` is an enumerable
    // property name of `obj`.
    function keyInObj(value, key, obj) {
      return key in obj;
    }

    var pick = restArguments(function (obj, keys) {
      var result = {},
          iteratee = keys[0];
      if (obj == null) return result;

      if (isFunction$2(iteratee)) {
        if (keys.length > 1) iteratee = optimizeCb(iteratee, keys[1]);
        keys = allKeys(obj);
      } else {
        iteratee = keyInObj;
        keys = flatten$2(keys, false, false);
        obj = Object(obj);
      }

      for (var i = 0, length = keys.length; i < length; i++) {
        var key = keys[i];
        var value = obj[key];
        if (iteratee(value, key, obj)) result[key] = value;
      }

      return result;
    });

    var omit = restArguments(function (obj, keys) {
      var iteratee = keys[0],
          context;

      if (isFunction$2(iteratee)) {
        iteratee = negate(iteratee);
        if (keys.length > 1) context = keys[1];
      } else {
        keys = map(flatten$2(keys, false, false), String);

        iteratee = function iteratee(value, key) {
          return !contains(keys, key);
        };
      }

      return pick(obj, iteratee, context);
    });

    // the arguments object. Passing **n** will return all the values in
    // the array, excluding the last N.

    function initial(array, n, guard) {
      return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
    }

    // values in the array. The **guard** check allows it to work with `_.map`.

    function first(array, n, guard) {
      if (array == null || array.length < 1) return n == null || guard ? void 0 : [];
      if (n == null || guard) return array[0];
      return initial(array, array.length - n);
    }

    // the `arguments` object. Passing an **n** will return the rest N values in the
    // `array`.

    function rest(array, n, guard) {
      return slice.call(array, n == null || guard ? 1 : n);
    }

    // values in the array.

    function last(array, n, guard) {
      if (array == null || array.length < 1) return n == null || guard ? void 0 : [];
      if (n == null || guard) return array[array.length - 1];
      return rest(array, Math.max(0, array.length - n));
    }

    function compact(array) {
      return filter$1(array, Boolean);
    }

    // Passing `true` or `false` as `depth` means `1` or `Infinity`, respectively.

    function flatten$1(array, depth) {
      return flatten$2(array, depth, false);
    }

    // Only the elements present in just the first array will remain.

    var difference = restArguments(function (array, rest) {
      rest = flatten$2(rest, true, true);
      return filter$1(array, function (value) {
        return !contains(rest, value);
      });
    });

    var without = restArguments(function (array, otherArrays) {
      return difference(array, otherArrays);
    });

    // been sorted, you have the option of using a faster algorithm.
    // The faster algorithm will not work with an iteratee if the iteratee
    // is not a one-to-one function, so providing an iteratee will disable
    // the faster algorithm.

    function uniq(array, isSorted, iteratee, context) {
      if (!isBoolean(isSorted)) {
        context = iteratee;
        iteratee = isSorted;
        isSorted = false;
      }

      if (iteratee != null) iteratee = cb(iteratee, context);
      var result = [];
      var seen = [];

      for (var i = 0, length = getLength(array); i < length; i++) {
        var value = array[i],
            computed = iteratee ? iteratee(value, i, array) : value;

        if (isSorted && !iteratee) {
          if (!i || seen !== computed) result.push(value);
          seen = computed;
        } else if (iteratee) {
          if (!contains(seen, computed)) {
            seen.push(computed);
            result.push(value);
          }
        } else if (!contains(result, value)) {
          result.push(value);
        }
      }

      return result;
    }

    // the passed-in arrays.

    var union = restArguments(function (arrays) {
      return uniq(flatten$2(arrays, true, true));
    });

    // passed-in arrays.

    function intersection(array) {
      var result = [];
      var argsLength = arguments.length;

      for (var i = 0, length = getLength(array); i < length; i++) {
        var item = array[i];
        if (contains(result, item)) continue;
        var j;

        for (j = 1; j < argsLength; j++) {
          if (!contains(arguments[j], item)) break;
        }

        if (j === argsLength) result.push(item);
      }

      return result;
    }

    // each array's elements on shared indices.

    function unzip(array) {
      var length = array && max(array, getLength).length || 0;
      var result = Array(length);

      for (var index = 0; index < length; index++) {
        result[index] = pluck(array, index);
      }

      return result;
    }

    // an index go together.

    var zip = restArguments(unzip);

    // pairs, or two parallel arrays of the same length -- one of keys, and one of
    // the corresponding values. Passing by pairs is the reverse of `_.pairs`.

    function object(list, values) {
      var result = {};

      for (var i = 0, length = getLength(list); i < length; i++) {
        if (values) {
          result[list[i]] = values[i];
        } else {
          result[list[i][0]] = list[i][1];
        }
      }

      return result;
    }

    // Generate an integer Array containing an arithmetic progression. A port of
    // the native Python `range()` function. See
    // [the Python documentation](https://docs.python.org/library/functions.html#range).
    function range$1(start, stop, step) {
      if (stop == null) {
        stop = start || 0;
        start = 0;
      }

      if (!step) {
        step = stop < start ? -1 : 1;
      }

      var length = Math.max(Math.ceil((stop - start) / step), 0);
      var range = Array(length);

      for (var idx = 0; idx < length; idx++, start += step) {
        range[idx] = start;
      }

      return range;
    }

    // items.

    function chunk(array, count) {
      if (count == null || count < 1) return [];
      var result = [];
      var i = 0,
          length = array.length;

      while (i < length) {
        result.push(slice.call(array, i, i += count));
      }

      return result;
    }

    function chainResult(instance, obj) {
      return instance._chain ? _$6(obj).chain() : obj;
    }

    function mixin(obj) {
      each(functions(obj), function (name) {
        var func = _$6[name] = obj[name];

        _$6.prototype[name] = function () {
          var args = [this._wrapped];
          push.apply(args, arguments);
          return chainResult(this, func.apply(_$6, args));
        };
      });
      return _$6;
    }

    each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function (name) {
      var method = ArrayProto[name];

      _$6.prototype[name] = function () {
        var obj = this._wrapped;

        if (obj != null) {
          method.apply(obj, arguments);

          if ((name === 'shift' || name === 'splice') && obj.length === 0) {
            delete obj[0];
          }
        }

        return chainResult(this, obj);
      };
    }); // Add all accessor `Array` functions to the wrapper.

    each(['concat', 'join', 'slice'], function (name) {
      var method = ArrayProto[name];

      _$6.prototype[name] = function () {
        var obj = this._wrapped;
        if (obj != null) obj = method.apply(obj, arguments);
        return chainResult(this, obj);
      };
    });

    // Named Exports

    var allExports = /*#__PURE__*/Object.freeze({
        __proto__: null,
        VERSION: VERSION,
        restArguments: restArguments,
        isObject: isObject,
        isNull: isNull,
        isUndefined: isUndefined,
        isBoolean: isBoolean,
        isElement: isElement,
        isString: isString,
        isNumber: isNumber,
        isDate: isDate,
        isRegExp: isRegExp,
        isError: isError,
        isSymbol: isSymbol$1,
        isArrayBuffer: isArrayBuffer,
        isDataView: isDataView$1,
        isArray: isArray$1,
        isFunction: isFunction$2,
        isArguments: isArguments$1,
        isFinite: isFinite$1,
        isNaN: isNaN$1,
        isTypedArray: isTypedArray$1,
        isEmpty: isEmpty,
        isMatch: isMatch,
        isEqual: isEqual$1,
        isMap: isMap,
        isWeakMap: isWeakMap,
        isSet: isSet,
        isWeakSet: isWeakSet,
        keys: keys,
        allKeys: allKeys,
        values: values,
        pairs: pairs,
        invert: invert,
        functions: functions,
        methods: functions,
        extend: extend,
        extendOwn: extendOwn,
        assign: extendOwn,
        defaults: defaults,
        create: create,
        clone: clone,
        tap: tap,
        get: get,
        has: has,
        mapObject: mapObject,
        identity: identity,
        constant: constant,
        noop: noop,
        toPath: toPath$1,
        property: property,
        propertyOf: propertyOf,
        matcher: matcher,
        matches: matcher,
        times: times,
        random: random,
        now: now,
        escape: escape$1,
        unescape: unescape,
        templateSettings: templateSettings,
        template: template,
        result: result,
        uniqueId: uniqueId,
        chain: chain,
        iteratee: iteratee,
        partial: partial,
        bind: bind,
        bindAll: bindAll,
        memoize: memoize$1,
        delay: delay,
        defer: defer,
        throttle: throttle,
        debounce: debounce,
        wrap: wrap,
        negate: negate,
        compose: compose$2,
        after: after,
        before: before,
        once: once,
        findKey: findKey,
        findIndex: findIndex,
        findLastIndex: findLastIndex,
        sortedIndex: sortedIndex,
        indexOf: indexOf,
        lastIndexOf: lastIndexOf,
        find: find,
        detect: find,
        findWhere: findWhere,
        each: each,
        forEach: each,
        map: map,
        collect: map,
        reduce: reduce,
        foldl: reduce,
        inject: reduce,
        reduceRight: reduceRight,
        foldr: reduceRight,
        filter: filter$1,
        select: filter$1,
        reject: reject,
        every: every,
        all: every,
        some: some,
        any: some,
        contains: contains,
        includes: contains,
        include: contains,
        invoke: invoke,
        pluck: pluck,
        where: where,
        max: max,
        min: min,
        shuffle: shuffle,
        sample: sample,
        sortBy: sortBy,
        groupBy: groupBy,
        indexBy: indexBy,
        countBy: countBy,
        partition: partition,
        toArray: toArray,
        size: size,
        pick: pick,
        omit: omit,
        first: first,
        head: first,
        take: first,
        initial: initial,
        last: last,
        rest: rest,
        tail: rest,
        drop: rest,
        compact: compact,
        flatten: flatten$1,
        without: without,
        uniq: uniq,
        unique: uniq,
        union: union,
        intersection: intersection,
        difference: difference,
        unzip: unzip,
        transpose: unzip,
        zip: zip,
        object: object,
        range: range$1,
        chunk: chunk,
        mixin: mixin,
        'default': _$6
    });

    // Default Export

    var _$5 = mixin(allExports); // Legacy Node.js API.


    _$5._ = _$5; // Export the Underscore API.

    // ESM Exports

    var indexAll = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': _$5,
        VERSION: VERSION,
        restArguments: restArguments,
        isObject: isObject,
        isNull: isNull,
        isUndefined: isUndefined,
        isBoolean: isBoolean,
        isElement: isElement,
        isString: isString,
        isNumber: isNumber,
        isDate: isDate,
        isRegExp: isRegExp,
        isError: isError,
        isSymbol: isSymbol$1,
        isArrayBuffer: isArrayBuffer,
        isDataView: isDataView$1,
        isArray: isArray$1,
        isFunction: isFunction$2,
        isArguments: isArguments$1,
        isFinite: isFinite$1,
        isNaN: isNaN$1,
        isTypedArray: isTypedArray$1,
        isEmpty: isEmpty,
        isMatch: isMatch,
        isEqual: isEqual$1,
        isMap: isMap,
        isWeakMap: isWeakMap,
        isSet: isSet,
        isWeakSet: isWeakSet,
        keys: keys,
        allKeys: allKeys,
        values: values,
        pairs: pairs,
        invert: invert,
        functions: functions,
        methods: functions,
        extend: extend,
        extendOwn: extendOwn,
        assign: extendOwn,
        defaults: defaults,
        create: create,
        clone: clone,
        tap: tap,
        get: get,
        has: has,
        mapObject: mapObject,
        identity: identity,
        constant: constant,
        noop: noop,
        toPath: toPath$1,
        property: property,
        propertyOf: propertyOf,
        matcher: matcher,
        matches: matcher,
        times: times,
        random: random,
        now: now,
        escape: escape$1,
        unescape: unescape,
        templateSettings: templateSettings,
        template: template,
        result: result,
        uniqueId: uniqueId,
        chain: chain,
        iteratee: iteratee,
        partial: partial,
        bind: bind,
        bindAll: bindAll,
        memoize: memoize$1,
        delay: delay,
        defer: defer,
        throttle: throttle,
        debounce: debounce,
        wrap: wrap,
        negate: negate,
        compose: compose$2,
        after: after,
        before: before,
        once: once,
        findKey: findKey,
        findIndex: findIndex,
        findLastIndex: findLastIndex,
        sortedIndex: sortedIndex,
        indexOf: indexOf,
        lastIndexOf: lastIndexOf,
        find: find,
        detect: find,
        findWhere: findWhere,
        each: each,
        forEach: each,
        map: map,
        collect: map,
        reduce: reduce,
        foldl: reduce,
        inject: reduce,
        reduceRight: reduceRight,
        foldr: reduceRight,
        filter: filter$1,
        select: filter$1,
        reject: reject,
        every: every,
        all: every,
        some: some,
        any: some,
        contains: contains,
        includes: contains,
        include: contains,
        invoke: invoke,
        pluck: pluck,
        where: where,
        max: max,
        min: min,
        shuffle: shuffle,
        sample: sample,
        sortBy: sortBy,
        groupBy: groupBy,
        indexBy: indexBy,
        countBy: countBy,
        partition: partition,
        toArray: toArray,
        size: size,
        pick: pick,
        omit: omit,
        first: first,
        head: first,
        take: first,
        initial: initial,
        last: last,
        rest: rest,
        tail: rest,
        drop: rest,
        compact: compact,
        flatten: flatten$1,
        without: without,
        uniq: uniq,
        unique: uniq,
        union: union,
        intersection: intersection,
        difference: difference,
        unzip: unzip,
        transpose: unzip,
        zip: zip,
        object: object,
        range: range$1,
        chunk: chunk,
        mixin: mixin
    });

    var getCookie = function (name) {
        var pattern = RegExp(name + "=.[^;]*");
        var matched = document.cookie.match(pattern);
        if (matched) {
            var cookie = matched[0].split('=');
            return cookie[1];
        }
        return '';
    };

    function _defineProperty$1(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }

      return obj;
    }

    function ownKeys$1(object, enumerableOnly) {
      var keys = Object.keys(object);

      if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) symbols = symbols.filter(function (sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
        keys.push.apply(keys, symbols);
      }

      return keys;
    }

    function _objectSpread2(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i] != null ? arguments[i] : {};

        if (i % 2) {
          ownKeys$1(Object(source), true).forEach(function (key) {
            _defineProperty$1(target, key, source[key]);
          });
        } else if (Object.getOwnPropertyDescriptors) {
          Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
        } else {
          ownKeys$1(Object(source)).forEach(function (key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
          });
        }
      }

      return target;
    }

    /**
     * Adapted from React: https://github.com/facebook/react/blob/master/packages/shared/formatProdErrorMessage.js
     *
     * Do not require this module directly! Use normal throw error calls. These messages will be replaced with error codes
     * during build.
     * @param {number} code
     */

    function formatProdErrorMessage(code) {
      return "Minified Redux error #" + code + "; visit https://redux.js.org/Errors?code=" + code + " for the full message or " + 'use the non-minified dev environment for full errors. ';
    } // Inlined version of the `symbol-observable` polyfill


    var $$observable = function () {
      return typeof Symbol === 'function' && Symbol.observable || '@@observable';
    }();
    /**
     * These are private action types reserved by Redux.
     * For any unknown actions, you must return the current state.
     * If the current state is undefined, you must return the initial state.
     * Do not reference these action types directly in your code.
     */


    var randomString = function randomString() {
      return Math.random().toString(36).substring(7).split('').join('.');
    };

    var ActionTypes = {
      INIT: "@@redux/INIT" + randomString(),
      REPLACE: "@@redux/REPLACE" + randomString(),
      PROBE_UNKNOWN_ACTION: function PROBE_UNKNOWN_ACTION() {
        return "@@redux/PROBE_UNKNOWN_ACTION" + randomString();
      }
    };
    /**
     * @param {any} obj The object to inspect.
     * @returns {boolean} True if the argument appears to be a plain object.
     */

    function isPlainObject$2(obj) {
      if (_typeof$1(obj) !== 'object' || obj === null) return false;
      var proto = obj;

      while (Object.getPrototypeOf(proto) !== null) {
        proto = Object.getPrototypeOf(proto);
      }

      return Object.getPrototypeOf(obj) === proto;
    } // Inlined / shortened version of `kindOf` from https://github.com/jonschlinkert/kind-of
    /**
     * Creates a Redux store that holds the state tree.
     * The only way to change the data in the store is to call `dispatch()` on it.
     *
     * There should only be a single store in your app. To specify how different
     * parts of the state tree respond to actions, you may combine several reducers
     * into a single reducer function by using `combineReducers`.
     *
     * @param {Function} reducer A function that returns the next state tree, given
     * the current state tree and the action to handle.
     *
     * @param {any} [preloadedState] The initial state. You may optionally specify it
     * to hydrate the state from the server in universal apps, or to restore a
     * previously serialized user session.
     * If you use `combineReducers` to produce the root reducer function, this must be
     * an object with the same shape as `combineReducers` keys.
     *
     * @param {Function} [enhancer] The store enhancer. You may optionally specify it
     * to enhance the store with third-party capabilities such as middleware,
     * time travel, persistence, etc. The only store enhancer that ships with Redux
     * is `applyMiddleware()`.
     *
     * @returns {Store} A Redux store that lets you read the state, dispatch actions
     * and subscribe to changes.
     */


    function createStore(reducer, preloadedState, enhancer) {
      var _ref2;

      if (typeof preloadedState === 'function' && typeof enhancer === 'function' || typeof enhancer === 'function' && typeof arguments[3] === 'function') {
        throw new Error(formatProdErrorMessage(0) );
      }

      if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
        enhancer = preloadedState;
        preloadedState = undefined;
      }

      if (typeof enhancer !== 'undefined') {
        if (typeof enhancer !== 'function') {
          throw new Error(formatProdErrorMessage(1) );
        }

        return enhancer(createStore)(reducer, preloadedState);
      }

      if (typeof reducer !== 'function') {
        throw new Error(formatProdErrorMessage(2) );
      }

      var currentReducer = reducer;
      var currentState = preloadedState;
      var currentListeners = [];
      var nextListeners = currentListeners;
      var isDispatching = false;
      /**
       * This makes a shallow copy of currentListeners so we can use
       * nextListeners as a temporary list while dispatching.
       *
       * This prevents any bugs around consumers calling
       * subscribe/unsubscribe in the middle of a dispatch.
       */

      function ensureCanMutateNextListeners() {
        if (nextListeners === currentListeners) {
          nextListeners = currentListeners.slice();
        }
      }
      /**
       * Reads the state tree managed by the store.
       *
       * @returns {any} The current state tree of your application.
       */


      function getState() {
        if (isDispatching) {
          throw new Error(formatProdErrorMessage(3) );
        }

        return currentState;
      }
      /**
       * Adds a change listener. It will be called any time an action is dispatched,
       * and some part of the state tree may potentially have changed. You may then
       * call `getState()` to read the current state tree inside the callback.
       *
       * You may call `dispatch()` from a change listener, with the following
       * caveats:
       *
       * 1. The subscriptions are snapshotted just before every `dispatch()` call.
       * If you subscribe or unsubscribe while the listeners are being invoked, this
       * will not have any effect on the `dispatch()` that is currently in progress.
       * However, the next `dispatch()` call, whether nested or not, will use a more
       * recent snapshot of the subscription list.
       *
       * 2. The listener should not expect to see all state changes, as the state
       * might have been updated multiple times during a nested `dispatch()` before
       * the listener is called. It is, however, guaranteed that all subscribers
       * registered before the `dispatch()` started will be called with the latest
       * state by the time it exits.
       *
       * @param {Function} listener A callback to be invoked on every dispatch.
       * @returns {Function} A function to remove this change listener.
       */


      function subscribe(listener) {
        if (typeof listener !== 'function') {
          throw new Error(formatProdErrorMessage(4) );
        }

        if (isDispatching) {
          throw new Error(formatProdErrorMessage(5) );
        }

        var isSubscribed = true;
        ensureCanMutateNextListeners();
        nextListeners.push(listener);
        return function unsubscribe() {
          if (!isSubscribed) {
            return;
          }

          if (isDispatching) {
            throw new Error(formatProdErrorMessage(6) );
          }

          isSubscribed = false;
          ensureCanMutateNextListeners();
          var index = nextListeners.indexOf(listener);
          nextListeners.splice(index, 1);
          currentListeners = null;
        };
      }
      /**
       * Dispatches an action. It is the only way to trigger a state change.
       *
       * The `reducer` function, used to create the store, will be called with the
       * current state tree and the given `action`. Its return value will
       * be considered the **next** state of the tree, and the change listeners
       * will be notified.
       *
       * The base implementation only supports plain object actions. If you want to
       * dispatch a Promise, an Observable, a thunk, or something else, you need to
       * wrap your store creating function into the corresponding middleware. For
       * example, see the documentation for the `redux-thunk` package. Even the
       * middleware will eventually dispatch plain object actions using this method.
       *
       * @param {Object} action A plain object representing “what changed”. It is
       * a good idea to keep actions serializable so you can record and replay user
       * sessions, or use the time travelling `redux-devtools`. An action must have
       * a `type` property which may not be `undefined`. It is a good idea to use
       * string constants for action types.
       *
       * @returns {Object} For convenience, the same action object you dispatched.
       *
       * Note that, if you use a custom middleware, it may wrap `dispatch()` to
       * return something else (for example, a Promise you can await).
       */


      function dispatch(action) {
        if (!isPlainObject$2(action)) {
          throw new Error(formatProdErrorMessage(7) );
        }

        if (typeof action.type === 'undefined') {
          throw new Error(formatProdErrorMessage(8) );
        }

        if (isDispatching) {
          throw new Error(formatProdErrorMessage(9) );
        }

        try {
          isDispatching = true;
          currentState = currentReducer(currentState, action);
        } finally {
          isDispatching = false;
        }

        var listeners = currentListeners = nextListeners;

        for (var i = 0; i < listeners.length; i++) {
          var listener = listeners[i];
          listener();
        }

        return action;
      }
      /**
       * Replaces the reducer currently used by the store to calculate the state.
       *
       * You might need this if your app implements code splitting and you want to
       * load some of the reducers dynamically. You might also need this if you
       * implement a hot reloading mechanism for Redux.
       *
       * @param {Function} nextReducer The reducer for the store to use instead.
       * @returns {void}
       */


      function replaceReducer(nextReducer) {
        if (typeof nextReducer !== 'function') {
          throw new Error(formatProdErrorMessage(10) );
        }

        currentReducer = nextReducer; // This action has a similiar effect to ActionTypes.INIT.
        // Any reducers that existed in both the new and old rootReducer
        // will receive the previous state. This effectively populates
        // the new state tree with any relevant data from the old one.

        dispatch({
          type: ActionTypes.REPLACE
        });
      }
      /**
       * Interoperability point for observable/reactive libraries.
       * @returns {observable} A minimal observable of state changes.
       * For more information, see the observable proposal:
       * https://github.com/tc39/proposal-observable
       */


      function observable() {
        var _ref;

        var outerSubscribe = subscribe;
        return _ref = {
          /**
           * The minimal observable subscription method.
           * @param {Object} observer Any object that can be used as an observer.
           * The observer object should have a `next` method.
           * @returns {subscription} An object with an `unsubscribe` method that can
           * be used to unsubscribe the observable from the store, and prevent further
           * emission of values from the observable.
           */
          subscribe: function subscribe(observer) {
            if (_typeof$1(observer) !== 'object' || observer === null) {
              throw new Error(formatProdErrorMessage(11) );
            }

            function observeState() {
              if (observer.next) {
                observer.next(getState());
              }
            }

            observeState();
            var unsubscribe = outerSubscribe(observeState);
            return {
              unsubscribe: unsubscribe
            };
          }
        }, _ref[$$observable] = function () {
          return this;
        }, _ref;
      } // When a store is created, an "INIT" action is dispatched so that every
      // reducer returns their initial state. This effectively populates
      // the initial state tree.


      dispatch({
        type: ActionTypes.INIT
      });
      return _ref2 = {
        dispatch: dispatch,
        subscribe: subscribe,
        getState: getState,
        replaceReducer: replaceReducer
      }, _ref2[$$observable] = observable, _ref2;
    }

    function assertReducerShape(reducers) {
      Object.keys(reducers).forEach(function (key) {
        var reducer = reducers[key];
        var initialState = reducer(undefined, {
          type: ActionTypes.INIT
        });

        if (typeof initialState === 'undefined') {
          throw new Error(formatProdErrorMessage(12) );
        }

        if (typeof reducer(undefined, {
          type: ActionTypes.PROBE_UNKNOWN_ACTION()
        }) === 'undefined') {
          throw new Error(formatProdErrorMessage(13) );
        }
      });
    }
    /**
     * Turns an object whose values are different reducer functions, into a single
     * reducer function. It will call every child reducer, and gather their results
     * into a single state object, whose keys correspond to the keys of the passed
     * reducer functions.
     *
     * @param {Object} reducers An object whose values correspond to different
     * reducer functions that need to be combined into one. One handy way to obtain
     * it is to use ES6 `import * as reducers` syntax. The reducers may never return
     * undefined for any action. Instead, they should return their initial state
     * if the state passed to them was undefined, and the current state for any
     * unrecognized action.
     *
     * @returns {Function} A reducer function that invokes every reducer inside the
     * passed object, and builds a state object with the same shape.
     */


    function combineReducers(reducers) {
      var reducerKeys = Object.keys(reducers);
      var finalReducers = {};

      for (var i = 0; i < reducerKeys.length; i++) {
        var key = reducerKeys[i];

        if (typeof reducers[key] === 'function') {
          finalReducers[key] = reducers[key];
        }
      }

      var finalReducerKeys = Object.keys(finalReducers); // This is used to make sure we don't warn about the same

      var shapeAssertionError;

      try {
        assertReducerShape(finalReducers);
      } catch (e) {
        shapeAssertionError = e;
      }

      return function combination(state, action) {
        if (state === void 0) {
          state = {};
        }

        if (shapeAssertionError) {
          throw shapeAssertionError;
        }

        var hasChanged = false;
        var nextState = {};

        for (var _i = 0; _i < finalReducerKeys.length; _i++) {
          var _key = finalReducerKeys[_i];
          var reducer = finalReducers[_key];
          var previousStateForKey = state[_key];
          var nextStateForKey = reducer(previousStateForKey, action);

          if (typeof nextStateForKey === 'undefined') {
            action && action.type;
            throw new Error(formatProdErrorMessage(14) );
          }

          nextState[_key] = nextStateForKey;
          hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
        }

        hasChanged = hasChanged || finalReducerKeys.length !== Object.keys(state).length;
        return hasChanged ? nextState : state;
      };
    }

    function bindActionCreator(actionCreator, dispatch) {
      return function () {
        return dispatch(actionCreator.apply(this, arguments));
      };
    }
    /**
     * Turns an object whose values are action creators, into an object with the
     * same keys, but with every function wrapped into a `dispatch` call so they
     * may be invoked directly. This is just a convenience method, as you can call
     * `store.dispatch(MyActionCreators.doSomething())` yourself just fine.
     *
     * For convenience, you can also pass an action creator as the first argument,
     * and get a dispatch wrapped function in return.
     *
     * @param {Function|Object} actionCreators An object whose values are action
     * creator functions. One handy way to obtain it is to use ES6 `import * as`
     * syntax. You may also pass a single function.
     *
     * @param {Function} dispatch The `dispatch` function available on your Redux
     * store.
     *
     * @returns {Function|Object} The object mimicking the original object, but with
     * every action creator wrapped into the `dispatch` call. If you passed a
     * function as `actionCreators`, the return value will also be a single
     * function.
     */


    function bindActionCreators(actionCreators, dispatch) {
      if (typeof actionCreators === 'function') {
        return bindActionCreator(actionCreators, dispatch);
      }

      if (_typeof$1(actionCreators) !== 'object' || actionCreators === null) {
        throw new Error(formatProdErrorMessage(16) );
      }

      var boundActionCreators = {};

      for (var key in actionCreators) {
        var actionCreator = actionCreators[key];

        if (typeof actionCreator === 'function') {
          boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
        }
      }

      return boundActionCreators;
    }
    /**
     * Composes single-argument functions from right to left. The rightmost
     * function can take multiple arguments as it provides the signature for
     * the resulting composite function.
     *
     * @param {...Function} funcs The functions to compose.
     * @returns {Function} A function obtained by composing the argument functions
     * from right to left. For example, compose(f, g, h) is identical to doing
     * (...args) => f(g(h(...args))).
     */


    function compose$1() {
      for (var _len = arguments.length, funcs = new Array(_len), _key = 0; _key < _len; _key++) {
        funcs[_key] = arguments[_key];
      }

      if (funcs.length === 0) {
        return function (arg) {
          return arg;
        };
      }

      if (funcs.length === 1) {
        return funcs[0];
      }

      return funcs.reduce(function (a, b) {
        return function () {
          return a(b.apply(void 0, arguments));
        };
      });
    }
    /**
     * Creates a store enhancer that applies middleware to the dispatch method
     * of the Redux store. This is handy for a variety of tasks, such as expressing
     * asynchronous actions in a concise manner, or logging every action payload.
     *
     * See `redux-thunk` package as an example of the Redux middleware.
     *
     * Because middleware is potentially asynchronous, this should be the first
     * store enhancer in the composition chain.
     *
     * Note that each middleware will be given the `dispatch` and `getState` functions
     * as named arguments.
     *
     * @param {...Function} middlewares The middleware chain to be applied.
     * @returns {Function} A store enhancer applying the middleware.
     */


    function applyMiddleware() {
      for (var _len = arguments.length, middlewares = new Array(_len), _key = 0; _key < _len; _key++) {
        middlewares[_key] = arguments[_key];
      }

      return function (createStore) {
        return function () {
          var store = createStore.apply(void 0, arguments);

          var _dispatch = function dispatch() {
            throw new Error(formatProdErrorMessage(15) );
          };

          var middlewareAPI = {
            getState: store.getState,
            dispatch: function dispatch() {
              return _dispatch.apply(void 0, arguments);
            }
          };
          var chain = middlewares.map(function (middleware) {
            return middleware(middlewareAPI);
          });
          _dispatch = compose$1.apply(void 0, chain)(store.dispatch);
          return _objectSpread2(_objectSpread2({}, store), {}, {
            dispatch: _dispatch
          });
        };
      };
    }

    var redux = /*#__PURE__*/Object.freeze({
        __proto__: null,
        __DO_NOT_USE__ActionTypes: ActionTypes,
        applyMiddleware: applyMiddleware,
        bindActionCreators: bindActionCreators,
        combineReducers: combineReducers,
        compose: compose$1,
        createStore: createStore
    });

    /** A function that accepts a potential "extra argument" value to be injected later,
     * and returns an instance of the thunk middleware that uses that value
     */
    function createThunkMiddleware(extraArgument) {
      // Standard Redux middleware definition pattern:
      // See: https://redux.js.org/tutorials/fundamentals/part-4-store#writing-custom-middleware
      var middleware = function middleware(_ref) {
        var dispatch = _ref.dispatch,
            getState = _ref.getState;
        return function (next) {
          return function (action) {
            // The thunk middleware looks for any functions that were passed to `store.dispatch`.
            // If this "action" is really a function, call it and return the result.
            if (typeof action === 'function') {
              // Inject the store's `dispatch` and `getState` methods, as well as any "extra arg"
              return action(dispatch, getState, extraArgument);
            } // Otherwise, pass the action down the middleware chain as usual


            return next(action);
          };
        };
      };

      return middleware;
    }

    var thunk = createThunkMiddleware(); // Attach the factory function so users can create a customized version
    // with whatever "extra arg" they want to inject into their thunks

    thunk.withExtraArgument = createThunkMiddleware;
    var thunkMiddleware = thunk;

    exports.RequestStatusOption = void 0;
    (function (RequestStatusOption) {
        RequestStatusOption["NOT_STARTED"] = "not_started";
        RequestStatusOption["STARTED"] = "started";
        RequestStatusOption["SUCCESS"] = "success";
        RequestStatusOption["FAILURE"] = "failure";
        RequestStatusOption["CANCELLED"] = "cancelled";
    })(exports.RequestStatusOption || (exports.RequestStatusOption = {}));

    function creatorAppsSelector(state) {
        var apps = state.entities ? state.entities.apps : {};
        var assigned_apps = state.entities ? state.entities.assigned_apps : [];
        var adminApp, sortedApps;
        _$5.each(apps, function (app, key) {
            if (!app._id) {
                app._id = key;
            }
            if (app.is_creator) ;
            else {
                // 非creator应该一律不显示
                app.visible = false;
            }
        });
        sortedApps = _$5.sortBy(_$5.values(apps), 'sort');
        var creatorApps = {};
        adminApp = {};
        // 按钮sort排序次序设置Creator.Apps值
        _$5.each(sortedApps, function (n) {
            if (n._id === "admin") {
                return adminApp = n;
            }
            else {
                return creatorApps[n._id] = n;
            }
        });
        // admin菜单显示在最后
        creatorApps.admin = adminApp;
        if (assigned_apps.length) {
            _$5.each(creatorApps, function (app, key) {
                if (assigned_apps.indexOf(key) > -1) {
                    app.visible = app.is_creator;
                }
                else {
                    app.visible = false;
                }
            });
        }
        return creatorApps;
    }
    function visibleAppsSelector(state, includeAdmin) {
        if (includeAdmin === void 0) { includeAdmin = true; }
        var creatorApps = creatorAppsSelector(state);
        var apps = [];
        _$5.each(creatorApps, function (v, k) {
            if ((v.visible !== false && v._id !== "admin") || (includeAdmin && v._id === "admin")) {
                apps.push(v);
            }
        });
        return apps;
    }
    function isRequestStarted(state) {
        return state.requests.bootStrap.getBootStrap.status === exports.RequestStatusOption.STARTED;
    }
    function isRequestSuccess(state) {
        return state.requests.bootStrap.getBootStrap.status === exports.RequestStatusOption.SUCCESS;
    }
    function isRequestFailure(state) {
        return state.requests.bootStrap.getBootStrap.status === exports.RequestStatusOption.FAILURE;
    }
    function getRequestStatus(state) {
        return state.requests.bootStrap.getBootStrap.status;
    }
    function getRequestError(state) {
        return state.requests.bootStrap.getBootStrap.error;
    }
    function getBootstrapData(state) {
        return state.entities;
    }

    function settingsStateSelector(state) {
        return state.settings ? state.settings : undefined;
    }
    function dataServicesSelector(state) {
        return state.settings ? state.settings.services.steedos : undefined;
    }

    function entityStateSelector(state, entityName) {
        return state.entities ? state.entities[entityName] : undefined;
    }
    function getObject(state, objectName) {
        return state.entities ? state.entities.objects[objectName] : undefined;
    }

    function viewStateSelector(state, id) {
        return state.views.byId ? state.views.byId[id] : undefined;
    }

    function pluginInstanceSelector(state, name) {
        var instances = state.plugins ? state.plugins.instances : {};
        return instances[name];
    }
    function pluginComponentsSelector(state, name) {
        var components = state.plugins ? state.plugins.components : {};
        if (components) {
            return components[name] ? components[name] : [];
        }
        else {
            return [];
        }
    }
    function pluginComponentObjectSelector(state, name, id) {
        var components = pluginComponentsSelector(state, name);
        return components.find(function (n) { return n.id === id; });
    }
    function pluginComponentSelector(state, name, id) {
        var componentObject = pluginComponentObjectSelector(state, name, id);
        return componentObject ? componentObject.component : null;
    }

    function getProfile(state) {
        return state.entities ? state.entities.user : undefined;
    }

    var states = /*#__PURE__*/Object.freeze({
        __proto__: null,
        creatorAppsSelector: creatorAppsSelector,
        visibleAppsSelector: visibleAppsSelector,
        isRequestStarted: isRequestStarted,
        isRequestSuccess: isRequestSuccess,
        isRequestFailure: isRequestFailure,
        getRequestStatus: getRequestStatus,
        getRequestError: getRequestError,
        getBootstrapData: getBootstrapData,
        settingsStateSelector: settingsStateSelector,
        dataServicesSelector: dataServicesSelector,
        entityStateSelector: entityStateSelector,
        getObject: getObject,
        viewStateSelector: viewStateSelector,
        pluginInstanceSelector: pluginInstanceSelector,
        pluginComponentsSelector: pluginComponentsSelector,
        pluginComponentObjectSelector: pluginComponentObjectSelector,
        pluginComponentSelector: pluginComponentSelector,
        getProfile: getProfile
    });

    var tsOdataClient = {};

    var ODataContext$1 = {};

    Object.defineProperty(ODataContext$1, "__esModule", {
      value: true
    });
    ODataContext$1.ODataContext = void 0;
    /**
     * Base ODataContext class; expected to implement specific versions of OData.
     */

    var ODataContext =
    /** @class */
    function () {
      function ODataContext(basePath) {
        this.basePath = basePath;
      }

      return ODataContext;
    }();

    ODataContext$1.ODataContext = ODataContext;

    var ODataQuery = {};

    var FieldReference$1 = {};

    Object.defineProperty(FieldReference$1, "__esModule", {
      value: true
    });
    FieldReference$1.FieldReference = void 0;
    /**
     * Represnets a reference to a field (instead of a literal value).
     */

    var FieldReference =
    /** @class */
    function () {
      function FieldReference(field) {
        this.field = field;
      }

      FieldReference.prototype.toString = function () {
        return this.field;
      };

      return FieldReference;
    }();

    FieldReference$1.FieldReference = FieldReference;

    var Expression$1 = {};

    var Literal$1 = {};

    Object.defineProperty(Literal$1, "__esModule", {
      value: true
    });
    Literal$1.Literal = void 0;
    /**
     * Represents a literal value, the provided type may be different than that of the runtime type (e.g., Guid instead of a string).
     */

    var Literal =
    /** @class */
    function () {
      function Literal(value, literalType) {
        this.value = value;
        this.literalType = literalType;
      }

      return Literal;
    }();

    Literal$1.Literal = Literal;

    var __extends$3 = commonjsGlobal && commonjsGlobal.__extends || function () {
      var _extendStatics = function extendStatics(d, b) {
        _extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function (d, b) {
          d.__proto__ = b;
        } || function (d, b) {
          for (var p in b) {
            if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
          }
        };

        return _extendStatics(d, b);
      };

      return function (d, b) {
        if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");

        _extendStatics(d, b);

        function __() {
          this.constructor = d;
        }

        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();

    Object.defineProperty(Expression$1, "__esModule", {
      value: true
    });
    Expression$1.TypedExpression = Expression$1.Expression = void 0;
    var Literal_1$1 = Literal$1;
    /**
     * Provides a way of expression operations that can be evaluated at run-time
     */

    var Expression =
    /** @class */
    function () {
      function Expression(operator, operands, previous) {
        this.operator = operator;
        this.operands = operands;
        this.previous = previous;
      }
      /**
       * Helper method to create a literal value with an optional type provided.
       * @param value The literal value.
       * @param literalType The type of the literal value (may be different than the runtime type given).
       */


      Expression.literal = function (value, literalType) {
        if (literalType === void 0) {
          literalType = _typeof$1(value);
        }

        return new TypedExpression("literal"
        /* Literal */
        , [new Literal_1$1.Literal(value, literalType)]);
      };

      return Expression;
    }();

    Expression$1.Expression = Expression;
    /**
     * An @type {Expression} that indicates the type of the result. Primarily used for providing type checking for TypeScript.
     */

    var TypedExpression =
    /** @class */
    function (_super) {
      __extends$3(TypedExpression, _super);

      function TypedExpression() {
        return _super !== null && _super.apply(this, arguments) || this;
      }

      return TypedExpression;
    }(Expression);

    Expression$1.TypedExpression = TypedExpression;

    var PredicateBuilder$1 = {};

    var BooleanPredicateBuilder$1 = {};

    Object.defineProperty(BooleanPredicateBuilder$1, "__esModule", {
      value: true
    });
    BooleanPredicateBuilder$1.BooleanPredicateBuilder = void 0;
    var Expression_1$2 = Expression$1;
    /**
     * Builds predicates based on boolean conditions.
     */

    var BooleanPredicateBuilder =
    /** @class */
    function () {
      function BooleanPredicateBuilder(expression) {
        this.expression = expression;
      }
      /**
       * Create an AND condition with a previous filter clause.
       * @param predicate Use the same FilterBuilder that this method chain was invoked with.
       */


      BooleanPredicateBuilder.prototype.and = function (predicate) {
        if (!this.expression) throw new Error("'and' predicate must come after a non-empty Predicate");
        if (!predicate.expression) throw new Error("'and' predicate must have at least one non-empty Predicate");
        return new BooleanPredicateBuilder(new Expression_1$2.Expression("and"
        /* And */
        , [this.expression, predicate.expression]));
      };
      /**
       * Create an OR condition with a previous filter clause.
       * @param predicate Use the same FilterBuilder that this method chain was invoked with.
       */


      BooleanPredicateBuilder.prototype.or = function (predicate) {
        if (!this.expression) throw new Error("'or' predicate must come after a non-empty Predicate");
        if (!predicate.expression) throw new Error("'or' predicate must have at least one non-empty Predicate");
        return new BooleanPredicateBuilder(new Expression_1$2.Expression("or"
        /* Or */
        , [this.expression, predicate.expression]));
      };

      return BooleanPredicateBuilder;
    }();

    BooleanPredicateBuilder$1.BooleanPredicateBuilder = BooleanPredicateBuilder;

    Object.defineProperty(PredicateBuilder$1, "__esModule", {
      value: true
    });
    PredicateBuilder$1.PredicateBuilder = void 0;
    var FieldReference_1$1 = FieldReference$1;
    var Expression_1$1 = Expression$1;
    var BooleanPredicateBuilder_1 = BooleanPredicateBuilder$1;

    var PredicateBuilder =
    /** @class */
    function () {
      function PredicateBuilder(expression) {
        this.expression = expression;
      }
      /**
       * Negates the result of the predicate provided.
       * @param predicate Use the same FilterBuilder that this method chain was invoked with.
       */


      PredicateBuilder.prototype.not = function (predicate) {
        if (!predicate.expression) throw new Error("'and' predicate must have at least one non-empty Predicate");
        return new BooleanPredicateBuilder_1.BooleanPredicateBuilder(new Expression_1$1.Expression("not"
        /* Not */
        , [this.expression], predicate.expression));
      };
      /**
       * Returns a reference used by FilterBuilder to allow comparisons to other values within the record.
       * @param field
       */


      PredicateBuilder.prototype.fieldReference = function (field) {
        return new Expression_1$1.TypedExpression("fieldReference"
        /* FieldReference */
        , [new FieldReference_1$1.FieldReference(field)]);
      };
      /**
       * Filters based on equality of a field with the provided value.
       * @param field
       * @param value
       */


      PredicateBuilder.prototype.equals = function (field, value) {
        var expression = new Expression_1$1.Expression("equals"
        /* Equals */
        , [new FieldReference_1$1.FieldReference(field), value], this.expression);
        return new BooleanPredicateBuilder_1.BooleanPredicateBuilder(expression);
      };
      /**
       * Filters based on the field not having the provided value.
       * @param field
       * @param value
       */


      PredicateBuilder.prototype.notEquals = function (field, value) {
        var expression = new Expression_1$1.Expression("notEquals"
        /* NotEquals */
        , [new FieldReference_1$1.FieldReference(field), value], this.expression);
        return new BooleanPredicateBuilder_1.BooleanPredicateBuilder(expression);
      };
      /**
       * Filters based on the field being greater than (>) the provided value.
       * @param field
       * @param value
       */


      PredicateBuilder.prototype.greaterThan = function (field, value) {
        var expression = new Expression_1$1.Expression("greaterThan"
        /* GreaterThan */
        , [new FieldReference_1$1.FieldReference(field), value], this.expression);
        return new BooleanPredicateBuilder_1.BooleanPredicateBuilder(expression);
      };
      /**
       * Filters based on the field being less than (<) the provided value.
       * @param field
       * @param value
       */


      PredicateBuilder.prototype.lessThan = function (field, value) {
        var expression = new Expression_1$1.Expression("lessThan"
        /* LessThan */
        , [new FieldReference_1$1.FieldReference(field), value], this.expression);
        return new BooleanPredicateBuilder_1.BooleanPredicateBuilder(expression);
      };
      /**
       * Filters based on the field being greater than or equal to (>=) the provided value.
       * @param field
       * @param value
       */


      PredicateBuilder.prototype.greaterThanOrEqualTo = function (field, value) {
        var expression = new Expression_1$1.Expression("greaterThanOrEqualTo"
        /* GreaterThanOrEqualTo */
        , [new FieldReference_1$1.FieldReference(field), value], this.expression);
        return new BooleanPredicateBuilder_1.BooleanPredicateBuilder(expression);
      };
      /**
       * Filters based on the field being greater than or equal to (<=) the provided value.
       * @param field
       * @param value
       */


      PredicateBuilder.prototype.lessThanOrEqualTo = function (field, value) {
        var expression = new Expression_1$1.Expression("lessThanOrEqualTo"
        /* LessThanOrEqualTo */
        , [new FieldReference_1$1.FieldReference(field), value], this.expression);
        return new BooleanPredicateBuilder_1.BooleanPredicateBuilder(expression);
      };
      /**
       * Filters based on the field containing the provided value.
       * @param field
       * @param value
       */


      PredicateBuilder.prototype.contains = function (field, value) {
        var expression = new Expression_1$1.Expression("contains"
        /* Contains */
        , [new FieldReference_1$1.FieldReference(field), value], this.expression);
        return new BooleanPredicateBuilder_1.BooleanPredicateBuilder(expression);
      };
      /**
       * Filters based on field starting with the provided value.
       * @param field
       * @param value
       */


      PredicateBuilder.prototype.startsWith = function (field, value) {
        var expression = new Expression_1$1.Expression("startsWith"
        /* StartsWith */
        , [new FieldReference_1$1.FieldReference(field), value], this.expression);
        return new BooleanPredicateBuilder_1.BooleanPredicateBuilder(expression);
      };
      /**
       * Filters based on the field ending with the provided value.
       * @param field
       * @param value
       */


      PredicateBuilder.prototype.endsWith = function (field, value) {
        var expression = new Expression_1$1.Expression("endsWith"
        /* EndsWith */
        , [new FieldReference_1$1.FieldReference(field), value], this.expression);
        return new BooleanPredicateBuilder_1.BooleanPredicateBuilder(expression);
      };
      /**
       * Filters based on the field being any one of the provided values.
       * @param field
       * @param values
       */


      PredicateBuilder.prototype.any = function (field, values) {
        var expression = new Expression_1$1.Expression("in"
        /* In */
        , [new FieldReference_1$1.FieldReference(field), Array.from(values)], this.expression);
        return new BooleanPredicateBuilder_1.BooleanPredicateBuilder(expression);
      };

      return PredicateBuilder;
    }();

    PredicateBuilder$1.PredicateBuilder = PredicateBuilder;

    var ODataV4QueryProvider$1 = {};

    var ODataQueryProvider$1 = {};

    Object.defineProperty(ODataQueryProvider$1, "__esModule", {
      value: true
    });
    ODataQueryProvider$1.ODataQueryProvider = void 0;
    var ODataQuery_1 = ODataQuery;
    /**
     * Base type used by all @type {ODataQueryProvider} implementations.
     */

    var ODataQueryProvider =
    /** @class */
    function () {
      function ODataQueryProvider() {}
      /**
       * Creates a new @type {ODataQuery} using the current provider.
       * @param expression The @type {Expression} the query will be based on.
       */


      ODataQueryProvider.prototype.createQuery = function (expression) {
        return new ODataQuery_1.ODataQuery(this, expression);
      };

      return ODataQueryProvider;
    }();

    ODataQueryProvider$1.ODataQueryProvider = ODataQueryProvider;

    var ODataV4ExpressionVisitor$1 = {};

    var TypedExpressionVisitor$1 = {};

    Object.defineProperty(TypedExpressionVisitor$1, "__esModule", {
      value: true
    });
    TypedExpressionVisitor$1.TypedExpressionVisitor = void 0;
    /**
     * Evaluates Expression by calling methods on type that follow the pattern of '[operator]Visitor'.
     * The operands are passed in as parameters.
     */

    var TypedExpressionVisitor =
    /** @class */
    function () {
      function TypedExpressionVisitor() {}

      TypedExpressionVisitor.prototype.visit = function (expression) {
        if (!expression) throw new Error("'expression' is a required parameter.");
        if (expression.previous) this.visit(expression.previous);
        var member = this[expression.operator + "Visitor"];
        if (typeof member !== "function") throw new Error("No method found named '" + expression.operator + "Visitor'; '" + expression.operator + "' operator is not supported.");
        member.apply(this, expression.operands);
      };

      return TypedExpressionVisitor;
    }();

    TypedExpressionVisitor$1.TypedExpressionVisitor = TypedExpressionVisitor;

    var __extends$2 = commonjsGlobal && commonjsGlobal.__extends || function () {
      var _extendStatics = function extendStatics(d, b) {
        _extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function (d, b) {
          d.__proto__ = b;
        } || function (d, b) {
          for (var p in b) {
            if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
          }
        };

        return _extendStatics(d, b);
      };

      return function (d, b) {
        if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");

        _extendStatics(d, b);

        function __() {
          this.constructor = d;
        }

        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();

    var __spreadArray = commonjsGlobal && commonjsGlobal.__spreadArray || function (to, from) {
      for (var i = 0, il = from.length, j = to.length; i < il; i++, j++) {
        to[j] = from[i];
      }

      return to;
    };

    Object.defineProperty(ODataV4ExpressionVisitor$1, "__esModule", {
      value: true
    });
    ODataV4ExpressionVisitor$1.ODataV4ExpressionVisitor = void 0;
    var TypedExpressionVisitor_1 = TypedExpressionVisitor$1;
    var FieldReference_1 = FieldReference$1;
    var Expression_1 = Expression$1;
    var Literal_1 = Literal$1;
    /**
     * Converts a version-agnistic @type {Expression} into an object that holds information that adheres to ODataV4 speifications.
     */

    var ODataV4ExpressionVisitor =
    /** @class */
    function (_super) {
      __extends$2(ODataV4ExpressionVisitor, _super);

      function ODataV4ExpressionVisitor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;

        _this.oDataQuery = {};
        return _this;
      }

      ODataV4ExpressionVisitor.prototype.selectVisitor = function () {
        var fields = [];

        for (var _i = 0; _i < arguments.length; _i++) {
          fields[_i] = arguments[_i];
        }

        this.oDataQuery.select = fields.map(function (f) {
          return f.toString();
        });
      };

      ODataV4ExpressionVisitor.prototype.orderByVisitor = function () {
        var _a;

        var fields = [];

        for (var _i = 0; _i < arguments.length; _i++) {
          fields[_i] = arguments[_i];
        }

        if (!this.oDataQuery.orderBy) this.oDataQuery.orderBy = [];

        (_a = this.oDataQuery.orderBy).push.apply(_a, fields.map(function (f) {
          return {
            field: f.toString()
          };
        }));
      };

      ODataV4ExpressionVisitor.prototype.orderByDescendingVisitor = function () {
        var _a;

        var fields = [];

        for (var _i = 0; _i < arguments.length; _i++) {
          fields[_i] = arguments[_i];
        }

        if (!this.oDataQuery.orderBy) this.oDataQuery.orderBy = [];

        (_a = this.oDataQuery.orderBy).push.apply(_a, fields.map(function (f) {
          return {
            field: f.toString(),
            sort: 'desc'
          };
        }));
      };

      ODataV4ExpressionVisitor.prototype.skipVisitor = function (value) {
        this.oDataQuery.skip = value;
      };

      ODataV4ExpressionVisitor.prototype.topVisitor = function (value) {
        this.oDataQuery.top = value;
      };

      ODataV4ExpressionVisitor.prototype.expandVisitor = function () {
        var _a;

        var fields = [];

        for (var _i = 0; _i < arguments.length; _i++) {
          fields[_i] = arguments[_i];
        }

        if (!this.oDataQuery.expand || this.oDataQuery.expand.some(function (v) {
          return v === "*";
        })) this.oDataQuery.expand = [];

        (_a = this.oDataQuery.expand).push.apply(_a, fields.map(function (f) {
          return f.toString();
        })); //ensure unique values


        this.oDataQuery.expand = Array.from(new Set(this.oDataQuery.expand));
      };

      ODataV4ExpressionVisitor.prototype.expandAllVisitor = function () {
        this.oDataQuery.expand = ["*"];
      };

      ODataV4ExpressionVisitor.prototype.getWithCountVisitor = function () {
        this.oDataQuery.count = true;
      };

      ODataV4ExpressionVisitor.prototype.getByKeyVisitor = function (key) {
        if (key instanceof Expression_1.Expression) {
          if (key.operator !== "literal"
          /* Literal */
          ) throw new Error("Only literal expressions allowed for " + "literal"
          /* Literal */
          + " expession types");
          key = key.operands[0];
        }

        if (!(key instanceof Literal_1.Literal)) key = new Literal_1.Literal(key);
        this.oDataQuery.key = this.deriveLiteral(key);
      };

      ODataV4ExpressionVisitor.prototype.predicateVisitor = function (predicate) {
        if (!predicate.expression) return;
        if (predicate.expression.previous) throw new Error("Filter Expressions cannot have a value for 'previous', only operands");
        var filter = this.translatePredicateExpression(predicate.expression);

        if (this.oDataQuery.filter && filter.length > 1) {
          filter = __spreadArray(__spreadArray(['('], filter), [')']);
        }

        if (!this.oDataQuery.filter) this.oDataQuery.filter = "";
        this.oDataQuery.filter += filter.join(' ');
      };

      ODataV4ExpressionVisitor.prototype.translatePredicateExpression = function (expression) {
        var _this = this;

        var translation = [];

        for (var _i = 0, _a = expression.operands; _i < _a.length; _i++) {
          var operand = _a[_i];

          if (operand instanceof Literal_1.Literal) {
            translation.push([this.deriveLiteral(operand)]);
          } else if (operand instanceof FieldReference_1.FieldReference) {
            translation.push([operand.toString()]);
          } else if (operand instanceof Expression_1.Expression) {
            translation.push(this.translatePredicateExpression(operand));
          } else if (operand instanceof Array) {
            translation.push([operand.map(function (i) {
              return _this.deriveLiteral(new Literal_1.Literal(i));
            }).join(',')]);
          } else //assume this is a literal without the type specified
            translation.push([this.deriveLiteral(new Literal_1.Literal(operand))]);
        }

        if (translation.length === 1) {
          switch (expression.operator) {
            case "not"
            /* Not */
            :
              return ['not ' + this.reduceTranslatedExpression(translation[0])];

            default:
              throw new Error("Operator '" + expression.operator + "' is not supported");
          }
        } else if (translation.length === 2) {
          var left = translation[0],
              right = translation[1];

          switch (expression.operator) {
            case "and"
            /* And */
            :
              return [this.reduceTranslatedExpression(left), 'and', this.reduceTranslatedExpression(right)];

            case "or"
            /* Or */
            :
              return [this.reduceTranslatedExpression(left), 'or', this.reduceTranslatedExpression(right)];

            case "equals"
            /* Equals */
            :
              return [this.reduceTranslatedExpression(left) + " eq " + this.reduceTranslatedExpression(right)];

            case "greaterThan"
            /* GreaterThan */
            :
              return [this.reduceTranslatedExpression(left) + " gt " + this.reduceTranslatedExpression(right)];

            case "greaterThanOrEqualTo"
            /* GreaterThanOrEqualTo */
            :
              return [this.reduceTranslatedExpression(left) + " ge " + this.reduceTranslatedExpression(right)];

            case "lessThan"
            /* LessThan */
            :
              return [this.reduceTranslatedExpression(left) + " lt " + this.reduceTranslatedExpression(right)];

            case "lessThanOrEqualTo"
            /* LessThanOrEqualTo */
            :
              return [this.reduceTranslatedExpression(left) + " le " + this.reduceTranslatedExpression(right)];

            case "notEquals"
            /* NotEquals */
            :
              return [this.reduceTranslatedExpression(left) + " ne " + this.reduceTranslatedExpression(right)];

            case "contains"
            /* Contains */
            :
              return ["contains(" + this.reduceTranslatedExpression(left) + "," + this.reduceTranslatedExpression(right) + ")"];

            case "startsWith"
            /* StartsWith */
            :
              return ["startsWith(" + this.reduceTranslatedExpression(left) + "," + this.reduceTranslatedExpression(right) + ")"];

            case "endsWith"
            /* EndsWith */
            :
              return ["endsWith(" + this.reduceTranslatedExpression(left) + "," + this.reduceTranslatedExpression(right) + ")"];

            case "in"
            /* In */
            :
              return [this.reduceTranslatedExpression(left) + " in (" + this.reduceTranslatedExpression(right) + ")"];

            default:
              throw new Error("Operator '" + expression.operator + "' is not supported");
          }
        }

        throw new Error("Operator '" + expression.operator + "' is not supported");
      };

      ODataV4ExpressionVisitor.prototype.reduceTranslatedExpression = function (value) {
        if (value.length === 0) return "";
        if (value.length === 1) return "" + value[0];
        return "(" + value.join(' ') + ")";
      };

      ODataV4ExpressionVisitor.prototype.deriveLiteral = function (literal) {
        var value = literal.value;

        switch (literal.literalType) {
          case "date"
          /* Date */
          :
            return new Date(value).toISOString().substring(0, 10);

          case "guid"
          /* Guid */
          :
            return value.toString();
        }

        switch (_typeof$1(value)) {
          case "string":
            return "'" + value + "'";

          case "number":
          case "boolean":
            return value.toString();

          case "undefined":
            return 'null';

          case "function":
            throw new Error("function not supported");

          case "symbol":
            throw new Error("symbol not supported");

          case "object":
            //objects handled below
            break;

          default:
            throw new Error("Unhandled primitive type: " + value);
        }

        if (value === null) return "null";
        if (value instanceof Date) return value.toISOString();
        return value.toString();
      };

      return ODataV4ExpressionVisitor;
    }(TypedExpressionVisitor_1.TypedExpressionVisitor);

    ODataV4ExpressionVisitor$1.ODataV4ExpressionVisitor = ODataV4ExpressionVisitor;

    var __extends$1 = commonjsGlobal && commonjsGlobal.__extends || function () {
      var _extendStatics = function extendStatics(d, b) {
        _extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function (d, b) {
          d.__proto__ = b;
        } || function (d, b) {
          for (var p in b) {
            if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
          }
        };

        return _extendStatics(d, b);
      };

      return function (d, b) {
        if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");

        _extendStatics(d, b);

        function __() {
          this.constructor = d;
        }

        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();

    var __awaiter = commonjsGlobal && commonjsGlobal.__awaiter || function (thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function (resolve) {
          resolve(value);
        });
      }

      return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }

        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }

        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }

        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };

    var __generator = commonjsGlobal && commonjsGlobal.__generator || function (thisArg, body) {
      var _ = {
        label: 0,
        sent: function sent() {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      },
          f,
          y,
          t,
          g;
      return g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
      }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
        return this;
      }), g;

      function verb(n) {
        return function (v) {
          return step([n, v]);
        };
      }

      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");

        while (_) {
          try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];

            switch (op[0]) {
              case 0:
              case 1:
                t = op;
                break;

              case 4:
                _.label++;
                return {
                  value: op[1],
                  done: false
                };

              case 5:
                _.label++;
                y = op[1];
                op = [0];
                continue;

              case 7:
                op = _.ops.pop();

                _.trys.pop();

                continue;

              default:
                if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                  _ = 0;
                  continue;
                }

                if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                  _.label = op[1];
                  break;
                }

                if (op[0] === 6 && _.label < t[1]) {
                  _.label = t[1];
                  t = op;
                  break;
                }

                if (t && _.label < t[2]) {
                  _.label = t[2];

                  _.ops.push(op);

                  break;
                }

                if (t[2]) _.ops.pop();

                _.trys.pop();

                continue;
            }

            op = body.call(thisArg, _);
          } catch (e) {
            op = [6, e];
            y = 0;
          } finally {
            f = t = 0;
          }
        }

        if (op[0] & 5) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };

    Object.defineProperty(ODataV4QueryProvider$1, "__esModule", {
      value: true
    });
    ODataV4QueryProvider$1.ODataV4QueryProvider = void 0;
    var ODataQueryProvider_1 = ODataQueryProvider$1;
    var ODataV4ExpressionVisitor_1 = ODataV4ExpressionVisitor$1;
    /**
     * A class used to generate queries that will ultimately be translated into ODataV4 queries.
     * Consumed by ODataContext classes; can also be used directly in lieu of creating an ODataContext class.
     */

    var ODataV4QueryProvider =
    /** @class */
    function (_super) {
      __extends$1(ODataV4QueryProvider, _super);

      function ODataV4QueryProvider(path, requestInit) {
        var _this = _super.call(this) || this;

        _this.path = path;
        _this.requestInit = requestInit;
        return _this;
      }

      ODataV4QueryProvider.createQuery = function (path, requestInit) {
        return new ODataV4QueryProvider(path, requestInit).createQuery();
      };

      ODataV4QueryProvider.prototype.executeQueryAsync = function (expression) {
        var _a, _b;

        return __awaiter(this, void 0, void 0, function () {
          var url, init, response, _c, _d, _e;

          return __generator(this, function (_f) {
            switch (_f.label) {
              case 0:
                url = this.buildQuery(expression);
                init = (_b = (_a = this.requestInit) === null || _a === void 0 ? void 0 : _a.call(this)) !== null && _b !== void 0 ? _b : {};
                if (!(init instanceof Promise)) return [3
                /*break*/
                , 2];
                return [4
                /*yield*/
                , init];

              case 1:
                init = _f.sent();
                _f.label = 2;

              case 2:
                return [4
                /*yield*/
                , fetch(url, init)];

              case 3:
                response = _f.sent();
                if (!response.ok) return [3
                /*break*/
                , 5];
                return [4
                /*yield*/
                , response.json()];

              case 4:
                return [2
                /*return*/
                , _f.sent()];

              case 5:
                _c = Error.bind;
                _e = (_d = JSON).stringify;
                return [4
                /*yield*/
                , response.json()];

              case 6:
                throw new (_c.apply(Error, [void 0, _e.apply(_d, [_f.sent()])]))();
            }
          });
        });
      };

      ODataV4QueryProvider.prototype.buildQuery = function (expression) {
        return expression ? this.generateUrl(expression) : this.path;
      };

      ODataV4QueryProvider.prototype.generateUrl = function (expression) {
        var visitor = new ODataV4ExpressionVisitor_1.ODataV4ExpressionVisitor();
        visitor.visit(expression);
        var path = this.path;
        if (visitor.oDataQuery.key) path += "(" + visitor.oDataQuery.key + ")";
        var queryString = this.buildQueryString(visitor.oDataQuery);
        return path + queryString;
      };

      ODataV4QueryProvider.prototype.buildQueryString = function (query) {
        var queryString = [];
        if (query.filter) queryString.push("$filter=" + encodeURIComponent(query.filter));

        if (query.orderBy) {
          queryString.push("$orderby=" + encodeURIComponent(query.orderBy.map(function (o) {
            return o.sort ? o.field + " " + o.sort : o.field;
          }).join(',')));
        }

        if (query.select) queryString.push("$select=" + encodeURIComponent(query.select.join(',')));
        if (query.skip) queryString.push("$skip=" + Math.floor(query.skip));
        if (typeof query.top === "number" && query.top >= 0) queryString.push("$top=" + Math.floor(query.top));
        if (query.count) queryString.push("$count=true");
        if (query.expand) queryString.push("$expand=" + encodeURIComponent(query.expand.join(',')));
        if (queryString.length > 0) return '?' + queryString.join("&");
        return "";
      };

      return ODataV4QueryProvider;
    }(ODataQueryProvider_1.ODataQueryProvider);

    ODataV4QueryProvider$1.ODataV4QueryProvider = ODataV4QueryProvider;

    (function (exports) {

      var __awaiter = commonjsGlobal && commonjsGlobal.__awaiter || function (thisArg, _arguments, P, generator) {
        function adopt(value) {
          return value instanceof P ? value : new P(function (resolve) {
            resolve(value);
          });
        }

        return new (P || (P = Promise))(function (resolve, reject) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          }

          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e) {
              reject(e);
            }
          }

          function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
          }

          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      };

      var __generator = commonjsGlobal && commonjsGlobal.__generator || function (thisArg, body) {
        var _ = {
          label: 0,
          sent: function sent() {
            if (t[0] & 1) throw t[1];
            return t[1];
          },
          trys: [],
          ops: []
        },
            f,
            y,
            t,
            g;
        return g = {
          next: verb(0),
          "throw": verb(1),
          "return": verb(2)
        }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
          return this;
        }), g;

        function verb(n) {
          return function (v) {
            return step([n, v]);
          };
        }

        function step(op) {
          if (f) throw new TypeError("Generator is already executing.");

          while (_) {
            try {
              if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
              if (y = 0, t) op = [op[0] & 2, t.value];

              switch (op[0]) {
                case 0:
                case 1:
                  t = op;
                  break;

                case 4:
                  _.label++;
                  return {
                    value: op[1],
                    done: false
                  };

                case 5:
                  _.label++;
                  y = op[1];
                  op = [0];
                  continue;

                case 7:
                  op = _.ops.pop();

                  _.trys.pop();

                  continue;

                default:
                  if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                    _ = 0;
                    continue;
                  }

                  if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                    _.label = op[1];
                    break;
                  }

                  if (op[0] === 6 && _.label < t[1]) {
                    _.label = t[1];
                    t = op;
                    break;
                  }

                  if (t && _.label < t[2]) {
                    _.label = t[2];

                    _.ops.push(op);

                    break;
                  }

                  if (t[2]) _.ops.pop();

                  _.trys.pop();

                  continue;
              }

              op = body.call(thisArg, _);
            } catch (e) {
              op = [6, e];
              y = 0;
            } finally {
              f = t = 0;
            }
          }

          if (op[0] & 5) throw op[1];
          return {
            value: op[0] ? op[1] : void 0,
            done: true
          };
        }
      };

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.ODataQuery = exports.resolveQuery = void 0;
      var FieldReference_1 = FieldReference$1;
      var Expression_1 = Expression$1;
      var PredicateBuilder_1 = PredicateBuilder$1;
      var ODataV4QueryProvider_1 = ODataV4QueryProvider$1;
      /**
       * A symbol used to retrieve the resulting query from the @type {ODataQueryProvider}.
       */

      exports.resolveQuery = Symbol();
      /**
       * Represents a query against an OData source.
       * This query is agnostic of the version of OData supported by the server (the provided @type {ODataQueryProvider} is responsible for translating the query into the correct syntax for the desired OData version supported by the endpoint).
       */

      var ODataQuery =
      /** @class */
      function () {
        function ODataQuery(provider, expression) {
          this.provider = provider;
          this.expression = expression;
        }

        ODataQuery.forV4 = function (endpoint, requestInit) {
          return new ODataQuery(new ODataV4QueryProvider_1.ODataV4QueryProvider(endpoint, requestInit));
        };
        /**
         * Limits the fields that are returned; the most recent call to select() will be used.
         * @param fields
         */


        ODataQuery.prototype.select = function () {
          var fields = [];

          for (var _i = 0; _i < arguments.length; _i++) {
            fields[_i] = arguments[_i];
          }

          var expression = new Expression_1.Expression("select"
          /* Select */
          , fields.map(function (v) {
            return new FieldReference_1.FieldReference(v);
          }), this.expression);
          return this.provider.createQuery(expression);
        };
        /**
         * Returns the top n records; the most recent call to top() will be used.
         * @param n
         */


        ODataQuery.prototype.top = function (n) {
          var expression = new Expression_1.Expression("top"
          /* Top */
          , [n], this.expression);
          return this.provider.createQuery(expression);
        };
        /**
         * Omits the first n records from appear in the returned records; the most recent call to skip() will be used.
         * @param n
         */


        ODataQuery.prototype.skip = function (n) {
          var expression = new Expression_1.Expression("skip"
          /* Skip */
          , [n], this.expression);
          return this.provider.createQuery(expression);
        };
        /**
         * Determines the sort order (ascending) of the records; calls or orderBy() and orderByDescending() are cumulative.
         * @param fields
         */


        ODataQuery.prototype.orderBy = function () {
          var fields = [];

          for (var _i = 0; _i < arguments.length; _i++) {
            fields[_i] = arguments[_i];
          }

          var expression = new Expression_1.Expression("orderBy"
          /* OrderBy */
          , fields.map(function (f) {
            return new FieldReference_1.FieldReference(f);
          }), this.expression);
          return this.provider.createQuery(expression);
        };
        /**
         * Determines the sort order (descending) of the records; calls to orderBy() and orderByDescending() are cumulative.
         * @param fields
         */


        ODataQuery.prototype.orderByDescending = function () {
          var fields = [];

          for (var _i = 0; _i < arguments.length; _i++) {
            fields[_i] = arguments[_i];
          }

          var expression = new Expression_1.Expression("orderByDescending"
          /* OrderByDescending */
          , fields.map(function (f) {
            return new FieldReference_1.FieldReference(f);
          }), this.expression);
          return this.provider.createQuery(expression);
        };
        /**
         * Filters the records based on the resulting FilterBuilder; calls to filter() and customFilter() are cumulative (as well as UNIONed (AND))
         * @param predicate Either an existing FilterBuilder, or a function that takes in an empty FilterBuilder and returns a FilterBuilder instance.
         */


        ODataQuery.prototype.filter = function (predicate) {
          if (typeof predicate === "function") predicate = predicate(new PredicateBuilder_1.PredicateBuilder());
          var expression = new Expression_1.Expression("predicate"
          /* Predicate */
          , [predicate], this.expression);
          return this.provider.createQuery(expression);
        };
        /**
         * Includes the indicated arrays are to be returned as part of the query results.
         * @param fields
         */


        ODataQuery.prototype.expand = function () {
          var fields = [];

          for (var _i = 0; _i < arguments.length; _i++) {
            fields[_i] = arguments[_i];
          }

          var expression = new Expression_1.Expression("expand"
          /* Expand */
          , fields.map(function (f) {
            return new FieldReference_1.FieldReference(f);
          }), this.expression);
          return this.provider.createQuery(expression);
        };
        /**
         * Includes all arrays as part of the query results.
         * @param fields
         */


        ODataQuery.prototype.expandAll = function () {
          var expression = new Expression_1.Expression("expandAll"
          /* ExpandAll */
          , [], this.expression);
          return this.provider.createQuery(expression);
        };
        /**
         * Returns a single record with the provided key value. Some functions (such as top, skip, filter, etc.) are ignored when this function is invoked.
         * @param key
         */


        ODataQuery.prototype.getAsync = function (key) {
          return __awaiter(this, void 0, void 0, function () {
            var expression;
            return __generator(this, function (_a) {
              switch (_a.label) {
                case 0:
                  expression = new Expression_1.Expression("getByKey"
                  /* GetByKey */
                  , [key], this.expression);
                  return [4
                  /*yield*/
                  , this.provider.executeQueryAsync(expression)];

                case 1:
                  return [2
                  /*return*/
                  , _a.sent()];
              }
            });
          });
        };
        /**
         * Returns a set of records.
         */


        ODataQuery.prototype.getManyAsync = function () {
          return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
              switch (_a.label) {
                case 0:
                  return [4
                  /*yield*/
                  , this.provider.executeQueryAsync(this.expression)];

                case 1:
                  return [2
                  /*return*/
                  , _a.sent()];
              }
            });
          });
        };
        /**
         * Returns a set of records, including the total count of records, which may not be the same as the number of records return if the results are paginated.
         */


        ODataQuery.prototype.getManyWithCountAsync = function () {
          return __awaiter(this, void 0, void 0, function () {
            var expression;
            return __generator(this, function (_a) {
              switch (_a.label) {
                case 0:
                  expression = new Expression_1.Expression("getWithCount"
                  /* GetWithCount */
                  , [], this.expression);
                  return [4
                  /*yield*/
                  , this.provider.executeQueryAsync(expression)];

                case 1:
                  return [2
                  /*return*/
                  , _a.sent()];
              }
            });
          });
        };

        ODataQuery.prototype[exports.resolveQuery] = function () {
          return this.provider.buildQuery(this.expression);
        };

        return ODataQuery;
      }();

      exports.ODataQuery = ODataQuery;
    })(ODataQuery);

    var v4 = {};

    var ODataV4Context$1 = {};

    var __extends = commonjsGlobal && commonjsGlobal.__extends || function () {
      var _extendStatics = function extendStatics(d, b) {
        _extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function (d, b) {
          d.__proto__ = b;
        } || function (d, b) {
          for (var p in b) {
            if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
          }
        };

        return _extendStatics(d, b);
      };

      return function (d, b) {
        if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");

        _extendStatics(d, b);

        function __() {
          this.constructor = d;
        }

        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();

    Object.defineProperty(ODataV4Context$1, "__esModule", {
      value: true
    });
    ODataV4Context$1.ODataV4Context = void 0;
    var ODataV4QueryProvider_1 = ODataV4QueryProvider$1;
    var ODataContext_1 = ODataContext$1;
    /**
     * Base ODataContext class; use this class as a base for communicating with services that are compatible with OData v4.
     * This context uses the fetch library; if the runtime environment does not support fetch, please use a polyfill.
     */

    var ODataV4Context =
    /** @class */
    function (_super) {
      __extends(ODataV4Context, _super);

      function ODataV4Context(basePath, requestInit) {
        var _this = _super.call(this, basePath) || this;

        _this.requestInit = requestInit;
        return _this;
      }

      ODataV4Context.prototype.createQuery = function (endpoint) {
        return new ODataV4QueryProvider_1.ODataV4QueryProvider(this.basePath + endpoint, this.requestInit).createQuery();
      };

      return ODataV4Context;
    }(ODataContext_1.ODataContext);

    ODataV4Context$1.ODataV4Context = ODataV4Context;

    (function (exports) {

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.ODataV4QueryProvider = exports.ODataV4Context = void 0;
      var ODataV4Context_1 = ODataV4Context$1;
      Object.defineProperty(exports, "ODataV4Context", {
        enumerable: true,
        get: function get() {
          return ODataV4Context_1.ODataV4Context;
        }
      });
      var ODataV4QueryProvider_1 = ODataV4QueryProvider$1;
      Object.defineProperty(exports, "ODataV4QueryProvider", {
        enumerable: true,
        get: function get() {
          return ODataV4QueryProvider_1.ODataV4QueryProvider;
        }
      });
    })(v4);

    (function (exports) {

      var __createBinding = commonjsGlobal && commonjsGlobal.__createBinding || (Object.create ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        Object.defineProperty(o, k2, {
          enumerable: true,
          get: function get() {
            return m[k];
          }
        });
      } : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });

      var __exportStar = commonjsGlobal && commonjsGlobal.__exportStar || function (m, exports) {
        for (var p in m) {
          if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
        }
      };

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.ODataQuery = exports.ODataContext = void 0;
      var ODataContext_1 = ODataContext$1;
      Object.defineProperty(exports, "ODataContext", {
        enumerable: true,
        get: function get() {
          return ODataContext_1.ODataContext;
        }
      });
      var ODataQuery_1 = ODataQuery;
      Object.defineProperty(exports, "ODataQuery", {
        enumerable: true,
        get: function get() {
          return ODataQuery_1.ODataQuery;
        }
      });

      __exportStar(v4, exports);
    })(tsOdataClient);

    var lib = {};

    function _interopRequireDefault$1(obj) {
      return obj && obj.__esModule ? obj : {
        "default": obj
      };
    }

    var interopRequireDefault = _interopRequireDefault$1;

    function _defineProperty(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }

      return obj;
    }

    var defineProperty = _defineProperty;

    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }

    var classCallCheck$1 = _classCallCheck;

    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties(Constructor, staticProps);
      return Constructor;
    }

    var createClass$1 = _createClass;

    var date_formatter = {};

    function leftPad(text, length) {
      while (text.length < length) {
        text = "0" + text;
      }

      return text;
    }

    var FORMAT_TYPES = {
      "3": "abbreviated",
      "4": "wide",
      "5": "narrow"
    };
    var LDML_FORMATTERS = {
      y: function y(date, count, useUtc) {
        var year = date[useUtc ? "getUTCFullYear" : "getFullYear"]();

        if (count === 2) {
          year = year % 100;
        }

        return leftPad(year.toString(), count);
      },
      M: function M(date, count, useUtc, dateParts) {
        var month = date[useUtc ? "getUTCMonth" : "getMonth"]();
        var formatType = FORMAT_TYPES[count];

        if (formatType) {
          return dateParts.getMonthNames(formatType, "format")[month];
        }

        return leftPad((month + 1).toString(), Math.min(count, 2));
      },
      L: function L(date, count, useUtc, dateParts) {
        var month = date[useUtc ? "getUTCMonth" : "getMonth"]();
        var formatType = FORMAT_TYPES[count];

        if (formatType) {
          return dateParts.getMonthNames(formatType, "standalone")[month];
        }

        return leftPad((month + 1).toString(), Math.min(count, 2));
      },
      Q: function Q(date, count, useUtc, dateParts) {
        var month = date[useUtc ? "getUTCMonth" : "getMonth"]();
        var quarter = Math.floor(month / 3);
        var formatType = FORMAT_TYPES[count];

        if (formatType) {
          return dateParts.getQuarterNames(formatType)[quarter];
        }

        return leftPad((quarter + 1).toString(), Math.min(count, 2));
      },
      E: function E(date, count, useUtc, dateParts) {
        var day = date[useUtc ? "getUTCDay" : "getDay"]();
        var formatType = FORMAT_TYPES[count < 3 ? 3 : count];
        return dateParts.getDayNames(formatType)[day];
      },
      a: function a(date, count, useUtc, dateParts) {
        var hours = date[useUtc ? "getUTCHours" : "getHours"](),
            period = hours < 12 ? 0 : 1,
            formatType = FORMAT_TYPES[count];
        return dateParts.getPeriodNames(formatType)[period];
      },
      d: function d(date, count, useUtc) {
        return leftPad(date[useUtc ? "getUTCDate" : "getDate"]().toString(), Math.min(count, 2));
      },
      H: function H(date, count, useUtc) {
        return leftPad(date[useUtc ? "getUTCHours" : "getHours"]().toString(), Math.min(count, 2));
      },
      h: function h(date, count, useUtc) {
        var hours = date[useUtc ? "getUTCHours" : "getHours"]();
        return leftPad((hours % 12 || 12).toString(), Math.min(count, 2));
      },
      m: function m(date, count, useUtc) {
        return leftPad(date[useUtc ? "getUTCMinutes" : "getMinutes"]().toString(), Math.min(count, 2));
      },
      s: function s(date, count, useUtc) {
        return leftPad(date[useUtc ? "getUTCSeconds" : "getSeconds"]().toString(), Math.min(count, 2));
      },
      S: function S(date, count, useUtc) {
        return leftPad(date[useUtc ? "getUTCMilliseconds" : "getMilliseconds"]().toString(), 3).substr(0, count);
      },
      x: function x(date, count, useUtc) {
        var timezoneOffset = useUtc ? 0 : date.getTimezoneOffset(),
            signPart = timezoneOffset > 0 ? "-" : "+",
            timezoneOffsetAbs = Math.abs(timezoneOffset),
            hours = Math.floor(timezoneOffsetAbs / 60),
            minutes = timezoneOffsetAbs % 60,
            hoursPart = leftPad(hours.toString(), 2),
            minutesPart = leftPad(minutes.toString(), 2);
        return signPart + hoursPart + (count >= 3 ? ":" : "") + (count > 1 || minutes ? minutesPart : "");
      },
      X: function X(date, count, useUtc) {
        if (useUtc || !date.getTimezoneOffset()) {
          return "Z";
        }

        return LDML_FORMATTERS.x(date, count, useUtc);
      },
      Z: function Z(date, count, useUtc) {
        return LDML_FORMATTERS.X(date, count >= 5 ? 3 : 2, useUtc);
      }
    };

    var getFormatter = function getFormatter(format, dateParts) {
      return function (date) {
        var charIndex,
            formatter,
            _char,
            charCount = 0,
            separator = "'",
            isEscaping = false,
            isCurrentCharEqualsNext,
            result = "";

        if (!date) return null;
        if (!format) return date;
        var useUtc = format[format.length - 1] === "Z" || format.slice(-3) === "'Z'";

        for (charIndex = 0; charIndex < format.length; charIndex++) {
          _char = format[charIndex];
          formatter = LDML_FORMATTERS[_char];
          isCurrentCharEqualsNext = _char === format[charIndex + 1];
          charCount++;

          if (!isCurrentCharEqualsNext) {
            if (formatter && !isEscaping) {
              result += formatter(date, charCount, useUtc, dateParts);
            }

            charCount = 0;
          }

          if (_char === separator && !isCurrentCharEqualsNext) {
            isEscaping = !isEscaping;
          } else if (isEscaping || !formatter) {
            result += _char;
          }

          if (_char === separator && isCurrentCharEqualsNext) {
            charIndex++;
          }
        }

        return result;
      };
    };

    date_formatter.getFormatter = getFormatter;

    var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        PERIODS = ["AM", "PM"],
        QUARTERS = ["Q1", "Q2", "Q3", "Q4"];

    var cutCaptions = function cutCaptions(captions, format) {
      var lengthByFormat = {
        abbreviated: 3,
        "short": 2,
        narrow: 1
      };
      return captions.map(function (caption) {
        return caption.substr(0, lengthByFormat[format]);
      });
    };

    var default_date_names = {
      getMonthNames: function getMonthNames(format) {
        return cutCaptions(MONTHS, format);
      },
      getDayNames: function getDayNames(format) {
        return cutCaptions(DAYS, format);
      },
      getQuarterNames: function getQuarterNames(format) {
        return QUARTERS;
      },
      getPeriodNames: function getPeriodNames(format) {
        return PERIODS;
      }
    };

    var _interopRequireDefault = interopRequireDefault;

    var _defineProperty2 = _interopRequireDefault(defineProperty);

    var _classCallCheck2 = _interopRequireDefault(classCallCheck$1);

    var _createClass2 = _interopRequireDefault(createClass$1);

    function ownKeys(object, enumerableOnly) {
      var keys = Object.keys(object);

      if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) symbols = symbols.filter(function (sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
        keys.push.apply(keys, symbols);
      }

      return keys;
    }

    function _objectSpread(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i] != null ? arguments[i] : {};

        if (i % 2) {
          ownKeys(Object(source), true).forEach(function (key) {
            (0, _defineProperty2["default"])(target, key, source[key]);
          });
        } else if (Object.getOwnPropertyDescriptors) {
          Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
        } else {
          ownKeys(Object(source)).forEach(function (key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
          });
        }
      }

      return target;
    } // const DevExpress = require("devextreme/bundles/modules/core");
    // const DevExpressData = require("devextreme/bundles/modules/data");
    // const DevExpressOData = require("devextreme/bundles/modules/data.odata");


    var getLDMLFormatter = date_formatter.getFormatter; // const Guid = require("devextreme/core/guid");
    // const EdmLiteral = require("devextreme/data/odata/utils").EdmLiteral;

    var DevExpressData = {
      utils: {
        isConjunctiveOperator: function isConjunctiveOperator(condition) {
          return /^(and|&&|&)$/i.test(condition);
        },
        normalizeBinaryCriterion: function normalizeBinaryCriterion(crit) {
          return [crit[0], crit.length < 3 ? "=" : String(crit[1]).toLowerCase(), crit.length < 2 ? true : crit[crit.length - 1]];
        },
        isUnaryOperation: function isUnaryOperation(crit) {
          return crit[0] === "!" && Array.isArray(crit[1]);
        }
      }
    }; // const defaultDateNames = DevExpress.localization.date;

    var defaultDateNames = default_date_names;
    var DevExpressOData = {
      pad: function pad(text, length, right) {
        text = String(text);

        while (text.length < length) {
          text = right ? text + "0" : "0" + text;
        }

        return text;
      },
      padLeft2: function padLeft2(text) {
        return this.pad(text, 2);
      },
      serializePropName: function serializePropName(propName) {
        return propName.replace(/\./g, "/");
      },
      serializeValue: function serializeValue(value, protocolVersion) {
        if (value === undefined) {
          // 解决value为undefined的时候解析异常，需要返回null值
          // 有可能serializeValueV4函数中if (value instanceof Guid)逻辑被注释掉造成的，放开应该就会自动返回null
          return null;
        }

        switch (protocolVersion) {
          case 2:
            return this.serializeValueV2(value);

          case 3:
            return this.serializeValueV2(value);

          case 4:
            return this.serializeValueV4(value);

          default:
            return this.serializeValueV4(value);
        }
      },
      serializeValueV2: function serializeValueV2(value) {
        if (value instanceof Date) {
          return this.serializeDate(value);
        } // if (value instanceof Guid) {
        //     return "guid'" + value + "'";
        // }
        // if (value instanceof EdmLiteral) {
        //     return value.valueOf();
        // }


        if (typeof value === "string") {
          return this.serializeString(value);
        }

        return String(value);
      },
      serializeValueV4: function serializeValueV4(value) {
        var _this = this;

        if (value instanceof Date) {
          return this.formatISO8601(value, false, false);
        } // if (value instanceof Guid) {
        //     return value.valueOf();
        // }


        if (Array.isArray(value)) {
          return "[" + value.map(function (item) {
            return _this.serializeValueV4(item);
          }).join(",") + "]";
        }

        return this.serializeValueV2(value);
      },
      serializeString: function serializeString(value) {
        return "'" + value.replace(/'/g, "''") + "'";
      },
      serializeDate: function serializeDate(value, serializationFormat) {
        if (!serializationFormat) {
          return value;
        }

        if (!(value instanceof Date)) {
          return null;
        }

        if (serializationFormat === "number") {
          return value && value.valueOf ? value.valueOf() : null;
        }

        return getLDMLFormatter(serializationFormat, defaultDateNames)(value);
      },
      formatISO8601: function formatISO8601(date, skipZeroTime, skipTimezone) {
        var bag = [];

        var isZeroTime = function isZeroTime() {
          return date.getUTCHours() + date.getUTCMinutes() + date.getUTCSeconds() + date.getUTCMilliseconds() < 1;
        };

        bag.push(date.getUTCFullYear());
        bag.push("-");
        bag.push(this.padLeft2(date.getUTCMonth() + 1));
        bag.push("-");
        bag.push(this.padLeft2(date.getUTCDate()));

        if (!(skipZeroTime && isZeroTime())) {
          bag.push("T");
          bag.push(this.padLeft2(date.getUTCHours()));
          bag.push(":");
          bag.push(this.padLeft2(date.getUTCMinutes()));
          bag.push(":");
          bag.push(this.padLeft2(date.getUTCSeconds()));

          if (date.getUTCMilliseconds()) {
            bag.push(".");
            bag.push(this.pad(date.getUTCMilliseconds(), 3));
          }

          if (!skipTimezone) {
            bag.push("Z");
          }
        }

        return bag.join("");
      }
    };

    var SteedosFilter$1 = /*#__PURE__*/function () {
      function SteedosFilter(filters) {
        var odataProtocolVersion = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;
        var forceLowerCase = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
        (0, _classCallCheck2["default"])(this, SteedosFilter);
        this.filters = filters || [];
        this.protocolVersion = odataProtocolVersion;
        this.forceLowerCase = forceLowerCase;
        this.formatters = {
          "=": this.createBinaryOperationFormatter("eq"),
          "<>": this.createBinaryOperationFormatter("ne"),
          ">": this.createBinaryOperationFormatter("gt"),
          ">=": this.createBinaryOperationFormatter("ge"),
          "<": this.createBinaryOperationFormatter("lt"),
          "<=": this.createBinaryOperationFormatter("le"),
          "startswith": this.createStringFuncFormatter("startswith"),
          "endswith": this.createStringFuncFormatter("endswith")
        };
        this.formattersV2 = _objectSpread(_objectSpread({}, this.formatters), {
          "contains": this.createStringFuncFormatter("substringof", true),
          "notcontains": this.createStringFuncFormatter("not substringof", true)
        });
        this.formattersV4 = _objectSpread(_objectSpread({}, this.formatters), {
          "contains": this.createStringFuncFormatter("contains"),
          "notcontains": this.createStringFuncFormatter("not contains"),
          "notstartswith": this.createStringFuncFormatter("not startswith"),
          "notendswith": this.createStringFuncFormatter("not endswith")
        });
      }

      (0, _createClass2["default"])(SteedosFilter, [{
        key: "createBinaryOperationFormatter",
        value: function createBinaryOperationFormatter(op) {
          return function (prop, val) {
            return prop + " " + op + " " + val;
          };
        }
      }, {
        key: "createStringFuncFormatter",
        value: function createStringFuncFormatter(op, reverse) {
          var _this2 = this;

          return function (prop, val) {
            var bag = [op, "("];

            if (_this2.forceLowerCase) {
              // prop = prop.indexOf("tolower(") === -1 ? "tolower(" + prop + ")" : prop;
              // forceLowerCase时不需要在prop外面增加tolower(..)，因为odata-v4-mongodb等包不支持
              val = val.toLowerCase();
            }

            if (reverse) {
              bag.push(val, ",", prop);
            } else {
              bag.push(prop, ",", val);
            }

            bag.push(")");
            return bag.join("");
          };
        }
      }, {
        key: "compileUnary",
        value: function compileUnary(criteria) {
          var op = criteria[0],
              crit = this.compileCore(criteria[1]);

          if (op === "!") {
            return "not (" + crit + ")";
          }

          throw new Error("E4003");
        }
      }, {
        key: "compileGroup",
        value: function compileGroup(criteria) {
          var _this3 = this;

          var bag = [],
              groupOperator,
              nextGroupOperator;
          criteria.forEach(function (criterion) {
            if (Array.isArray(criterion)) {
              if (bag.length > 1 && groupOperator !== nextGroupOperator) {
                throw new Error("E4019");
              }

              bag.push("(" + _this3.compileCore(criterion) + ")");
              groupOperator = nextGroupOperator;
              nextGroupOperator = "and";
            } else {
              nextGroupOperator = DevExpressData.utils.isConjunctiveOperator(criterion) ? "and" : "or";
            }
          });
          return bag.join(" " + groupOperator + " ");
        }
      }, {
        key: "compileBinary",
        value: function compileBinary(criteria) {
          criteria = DevExpressData.utils.normalizeBinaryCriterion(criteria);
          var op = criteria[1],
              formatters = this.protocolVersion === 4 ? this.formattersV4 : this.formattersV2,
              formatter = formatters[op.toLowerCase()];

          if (!formatter) {
            throw new Error("E4003");
          }

          var fieldName = criteria[0],
              value = criteria[2];
          return formatter(DevExpressOData.serializePropName(fieldName), DevExpressOData.serializeValue(value, this.protocolVersion));
        }
      }, {
        key: "compileCore",
        value: function compileCore(criteria) {
          if (!criteria || criteria.length === 0) {
            return "";
          }

          if (Array.isArray(criteria[0])) {
            return this.compileGroup(criteria);
          }

          if (DevExpressData.utils.isUnaryOperation(criteria)) {
            return this.compileUnary(criteria);
          }

          return this.compileBinary(criteria);
        }
      }, {
        key: "formatFiltersToODataQuery",
        value: function formatFiltersToODataQuery() {
          // 转换filters为odata串
          var filters = this.filters;
          var query = this.compileCore(filters);
          return query;
        }
      }]);
      return SteedosFilter;
    }();

    var filter = SteedosFilter$1;

    var format = {};

    var require$$0$1 = /*@__PURE__*/getAugmentedNamespace(indexAll);

    var utils$1 = {};

    var moment$2 = {exports: {}};

    (function (module, exports) {

      (function (global, factory) {
        module.exports = factory() ;
      })(commonjsGlobal, function () {

        var hookCallback;

        function hooks() {
          return hookCallback.apply(null, arguments);
        } // This is done to register the method called with moment()
        // without creating circular dependencies.


        function setHookCallback(callback) {
          hookCallback = callback;
        }

        function isArray(input) {
          return input instanceof Array || Object.prototype.toString.call(input) === '[object Array]';
        }

        function isObject(input) {
          // IE8 will treat undefined and null as object if it wasn't for
          // input != null
          return input != null && Object.prototype.toString.call(input) === '[object Object]';
        }

        function hasOwnProp(a, b) {
          return Object.prototype.hasOwnProperty.call(a, b);
        }

        function isObjectEmpty(obj) {
          if (Object.getOwnPropertyNames) {
            return Object.getOwnPropertyNames(obj).length === 0;
          } else {
            var k;

            for (k in obj) {
              if (hasOwnProp(obj, k)) {
                return false;
              }
            }

            return true;
          }
        }

        function isUndefined(input) {
          return input === void 0;
        }

        function isNumber(input) {
          return typeof input === 'number' || Object.prototype.toString.call(input) === '[object Number]';
        }

        function isDate(input) {
          return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
        }

        function map(arr, fn) {
          var res = [],
              i,
              arrLen = arr.length;

          for (i = 0; i < arrLen; ++i) {
            res.push(fn(arr[i], i));
          }

          return res;
        }

        function extend(a, b) {
          for (var i in b) {
            if (hasOwnProp(b, i)) {
              a[i] = b[i];
            }
          }

          if (hasOwnProp(b, 'toString')) {
            a.toString = b.toString;
          }

          if (hasOwnProp(b, 'valueOf')) {
            a.valueOf = b.valueOf;
          }

          return a;
        }

        function createUTC(input, format, locale, strict) {
          return createLocalOrUTC(input, format, locale, strict, true).utc();
        }

        function defaultParsingFlags() {
          // We need to deep clone this object.
          return {
            empty: false,
            unusedTokens: [],
            unusedInput: [],
            overflow: -2,
            charsLeftOver: 0,
            nullInput: false,
            invalidEra: null,
            invalidMonth: null,
            invalidFormat: false,
            userInvalidated: false,
            iso: false,
            parsedDateParts: [],
            era: null,
            meridiem: null,
            rfc2822: false,
            weekdayMismatch: false
          };
        }

        function getParsingFlags(m) {
          if (m._pf == null) {
            m._pf = defaultParsingFlags();
          }

          return m._pf;
        }

        var some;

        if (Array.prototype.some) {
          some = Array.prototype.some;
        } else {
          some = function some(fun) {
            var t = Object(this),
                len = t.length >>> 0,
                i;

            for (i = 0; i < len; i++) {
              if (i in t && fun.call(this, t[i], i, t)) {
                return true;
              }
            }

            return false;
          };
        }

        function isValid(m) {
          if (m._isValid == null) {
            var flags = getParsingFlags(m),
                parsedParts = some.call(flags.parsedDateParts, function (i) {
              return i != null;
            }),
                isNowValid = !isNaN(m._d.getTime()) && flags.overflow < 0 && !flags.empty && !flags.invalidEra && !flags.invalidMonth && !flags.invalidWeekday && !flags.weekdayMismatch && !flags.nullInput && !flags.invalidFormat && !flags.userInvalidated && (!flags.meridiem || flags.meridiem && parsedParts);

            if (m._strict) {
              isNowValid = isNowValid && flags.charsLeftOver === 0 && flags.unusedTokens.length === 0 && flags.bigHour === undefined;
            }

            if (Object.isFrozen == null || !Object.isFrozen(m)) {
              m._isValid = isNowValid;
            } else {
              return isNowValid;
            }
          }

          return m._isValid;
        }

        function createInvalid(flags) {
          var m = createUTC(NaN);

          if (flags != null) {
            extend(getParsingFlags(m), flags);
          } else {
            getParsingFlags(m).userInvalidated = true;
          }

          return m;
        } // Plugins that add properties should also add the key here (null value),
        // so we can properly clone ourselves.


        var momentProperties = hooks.momentProperties = [],
            updateInProgress = false;

        function copyConfig(to, from) {
          var i,
              prop,
              val,
              momentPropertiesLen = momentProperties.length;

          if (!isUndefined(from._isAMomentObject)) {
            to._isAMomentObject = from._isAMomentObject;
          }

          if (!isUndefined(from._i)) {
            to._i = from._i;
          }

          if (!isUndefined(from._f)) {
            to._f = from._f;
          }

          if (!isUndefined(from._l)) {
            to._l = from._l;
          }

          if (!isUndefined(from._strict)) {
            to._strict = from._strict;
          }

          if (!isUndefined(from._tzm)) {
            to._tzm = from._tzm;
          }

          if (!isUndefined(from._isUTC)) {
            to._isUTC = from._isUTC;
          }

          if (!isUndefined(from._offset)) {
            to._offset = from._offset;
          }

          if (!isUndefined(from._pf)) {
            to._pf = getParsingFlags(from);
          }

          if (!isUndefined(from._locale)) {
            to._locale = from._locale;
          }

          if (momentPropertiesLen > 0) {
            for (i = 0; i < momentPropertiesLen; i++) {
              prop = momentProperties[i];
              val = from[prop];

              if (!isUndefined(val)) {
                to[prop] = val;
              }
            }
          }

          return to;
        } // Moment prototype object


        function Moment(config) {
          copyConfig(this, config);
          this._d = new Date(config._d != null ? config._d.getTime() : NaN);

          if (!this.isValid()) {
            this._d = new Date(NaN);
          } // Prevent infinite loop in case updateOffset creates new moment
          // objects.


          if (updateInProgress === false) {
            updateInProgress = true;
            hooks.updateOffset(this);
            updateInProgress = false;
          }
        }

        function isMoment(obj) {
          return obj instanceof Moment || obj != null && obj._isAMomentObject != null;
        }

        function warn(msg) {
          if (hooks.suppressDeprecationWarnings === false && typeof console !== 'undefined' && console.warn) {
            console.warn('Deprecation warning: ' + msg);
          }
        }

        function deprecate(msg, fn) {
          var firstTime = true;
          return extend(function () {
            if (hooks.deprecationHandler != null) {
              hooks.deprecationHandler(null, msg);
            }

            if (firstTime) {
              var args = [],
                  arg,
                  i,
                  key,
                  argLen = arguments.length;

              for (i = 0; i < argLen; i++) {
                arg = '';

                if (_typeof$1(arguments[i]) === 'object') {
                  arg += '\n[' + i + '] ';

                  for (key in arguments[0]) {
                    if (hasOwnProp(arguments[0], key)) {
                      arg += key + ': ' + arguments[0][key] + ', ';
                    }
                  }

                  arg = arg.slice(0, -2); // Remove trailing comma and space
                } else {
                  arg = arguments[i];
                }

                args.push(arg);
              }

              warn(msg + '\nArguments: ' + Array.prototype.slice.call(args).join('') + '\n' + new Error().stack);
              firstTime = false;
            }

            return fn.apply(this, arguments);
          }, fn);
        }

        var deprecations = {};

        function deprecateSimple(name, msg) {
          if (hooks.deprecationHandler != null) {
            hooks.deprecationHandler(name, msg);
          }

          if (!deprecations[name]) {
            warn(msg);
            deprecations[name] = true;
          }
        }

        hooks.suppressDeprecationWarnings = false;
        hooks.deprecationHandler = null;

        function isFunction(input) {
          return typeof Function !== 'undefined' && input instanceof Function || Object.prototype.toString.call(input) === '[object Function]';
        }

        function set(config) {
          var prop, i;

          for (i in config) {
            if (hasOwnProp(config, i)) {
              prop = config[i];

              if (isFunction(prop)) {
                this[i] = prop;
              } else {
                this['_' + i] = prop;
              }
            }
          }

          this._config = config; // Lenient ordinal parsing accepts just a number in addition to
          // number + (possibly) stuff coming from _dayOfMonthOrdinalParse.
          // TODO: Remove "ordinalParse" fallback in next major release.

          this._dayOfMonthOrdinalParseLenient = new RegExp((this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) + '|' + /\d{1,2}/.source);
        }

        function mergeConfigs(parentConfig, childConfig) {
          var res = extend({}, parentConfig),
              prop;

          for (prop in childConfig) {
            if (hasOwnProp(childConfig, prop)) {
              if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
                res[prop] = {};
                extend(res[prop], parentConfig[prop]);
                extend(res[prop], childConfig[prop]);
              } else if (childConfig[prop] != null) {
                res[prop] = childConfig[prop];
              } else {
                delete res[prop];
              }
            }
          }

          for (prop in parentConfig) {
            if (hasOwnProp(parentConfig, prop) && !hasOwnProp(childConfig, prop) && isObject(parentConfig[prop])) {
              // make sure changes to properties don't modify parent config
              res[prop] = extend({}, res[prop]);
            }
          }

          return res;
        }

        function Locale(config) {
          if (config != null) {
            this.set(config);
          }
        }

        var keys;

        if (Object.keys) {
          keys = Object.keys;
        } else {
          keys = function keys(obj) {
            var i,
                res = [];

            for (i in obj) {
              if (hasOwnProp(obj, i)) {
                res.push(i);
              }
            }

            return res;
          };
        }

        var defaultCalendar = {
          sameDay: '[Today at] LT',
          nextDay: '[Tomorrow at] LT',
          nextWeek: 'dddd [at] LT',
          lastDay: '[Yesterday at] LT',
          lastWeek: '[Last] dddd [at] LT',
          sameElse: 'L'
        };

        function calendar(key, mom, now) {
          var output = this._calendar[key] || this._calendar['sameElse'];
          return isFunction(output) ? output.call(mom, now) : output;
        }

        function zeroFill(number, targetLength, forceSign) {
          var absNumber = '' + Math.abs(number),
              zerosToFill = targetLength - absNumber.length,
              sign = number >= 0;
          return (sign ? forceSign ? '+' : '' : '-') + Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
        }

        var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|N{1,5}|YYYYYY|YYYYY|YYYY|YY|y{2,4}|yo?|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g,
            localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,
            formatFunctions = {},
            formatTokenFunctions = {}; // token:    'M'
        // padded:   ['MM', 2]
        // ordinal:  'Mo'
        // callback: function () { this.month() + 1 }

        function addFormatToken(token, padded, ordinal, callback) {
          var func = callback;

          if (typeof callback === 'string') {
            func = function func() {
              return this[callback]();
            };
          }

          if (token) {
            formatTokenFunctions[token] = func;
          }

          if (padded) {
            formatTokenFunctions[padded[0]] = function () {
              return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
            };
          }

          if (ordinal) {
            formatTokenFunctions[ordinal] = function () {
              return this.localeData().ordinal(func.apply(this, arguments), token);
            };
          }
        }

        function removeFormattingTokens(input) {
          if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, '');
          }

          return input.replace(/\\/g, '');
        }

        function makeFormatFunction(format) {
          var array = format.match(formattingTokens),
              i,
              length;

          for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
              array[i] = formatTokenFunctions[array[i]];
            } else {
              array[i] = removeFormattingTokens(array[i]);
            }
          }

          return function (mom) {
            var output = '',
                i;

            for (i = 0; i < length; i++) {
              output += isFunction(array[i]) ? array[i].call(mom, format) : array[i];
            }

            return output;
          };
        } // format date using native date object


        function formatMoment(m, format) {
          if (!m.isValid()) {
            return m.localeData().invalidDate();
          }

          format = expandFormat(format, m.localeData());
          formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);
          return formatFunctions[format](m);
        }

        function expandFormat(format, locale) {
          var i = 5;

          function replaceLongDateFormatTokens(input) {
            return locale.longDateFormat(input) || input;
          }

          localFormattingTokens.lastIndex = 0;

          while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
            localFormattingTokens.lastIndex = 0;
            i -= 1;
          }

          return format;
        }

        var defaultLongDateFormat = {
          LTS: 'h:mm:ss A',
          LT: 'h:mm A',
          L: 'MM/DD/YYYY',
          LL: 'MMMM D, YYYY',
          LLL: 'MMMM D, YYYY h:mm A',
          LLLL: 'dddd, MMMM D, YYYY h:mm A'
        };

        function longDateFormat(key) {
          var format = this._longDateFormat[key],
              formatUpper = this._longDateFormat[key.toUpperCase()];

          if (format || !formatUpper) {
            return format;
          }

          this._longDateFormat[key] = formatUpper.match(formattingTokens).map(function (tok) {
            if (tok === 'MMMM' || tok === 'MM' || tok === 'DD' || tok === 'dddd') {
              return tok.slice(1);
            }

            return tok;
          }).join('');
          return this._longDateFormat[key];
        }

        var defaultInvalidDate = 'Invalid date';

        function invalidDate() {
          return this._invalidDate;
        }

        var defaultOrdinal = '%d',
            defaultDayOfMonthOrdinalParse = /\d{1,2}/;

        function ordinal(number) {
          return this._ordinal.replace('%d', number);
        }

        var defaultRelativeTime = {
          future: 'in %s',
          past: '%s ago',
          s: 'a few seconds',
          ss: '%d seconds',
          m: 'a minute',
          mm: '%d minutes',
          h: 'an hour',
          hh: '%d hours',
          d: 'a day',
          dd: '%d days',
          w: 'a week',
          ww: '%d weeks',
          M: 'a month',
          MM: '%d months',
          y: 'a year',
          yy: '%d years'
        };

        function relativeTime(number, withoutSuffix, string, isFuture) {
          var output = this._relativeTime[string];
          return isFunction(output) ? output(number, withoutSuffix, string, isFuture) : output.replace(/%d/i, number);
        }

        function pastFuture(diff, output) {
          var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
          return isFunction(format) ? format(output) : format.replace(/%s/i, output);
        }

        var aliases = {};

        function addUnitAlias(unit, shorthand) {
          var lowerCase = unit.toLowerCase();
          aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
        }

        function normalizeUnits(units) {
          return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
        }

        function normalizeObjectUnits(inputObject) {
          var normalizedInput = {},
              normalizedProp,
              prop;

          for (prop in inputObject) {
            if (hasOwnProp(inputObject, prop)) {
              normalizedProp = normalizeUnits(prop);

              if (normalizedProp) {
                normalizedInput[normalizedProp] = inputObject[prop];
              }
            }
          }

          return normalizedInput;
        }

        var priorities = {};

        function addUnitPriority(unit, priority) {
          priorities[unit] = priority;
        }

        function getPrioritizedUnits(unitsObj) {
          var units = [],
              u;

          for (u in unitsObj) {
            if (hasOwnProp(unitsObj, u)) {
              units.push({
                unit: u,
                priority: priorities[u]
              });
            }
          }

          units.sort(function (a, b) {
            return a.priority - b.priority;
          });
          return units;
        }

        function isLeapYear(year) {
          return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
        }

        function absFloor(number) {
          if (number < 0) {
            // -0 -> 0
            return Math.ceil(number) || 0;
          } else {
            return Math.floor(number);
          }
        }

        function toInt(argumentForCoercion) {
          var coercedNumber = +argumentForCoercion,
              value = 0;

          if (coercedNumber !== 0 && isFinite(coercedNumber)) {
            value = absFloor(coercedNumber);
          }

          return value;
        }

        function makeGetSet(unit, keepTime) {
          return function (value) {
            if (value != null) {
              set$1(this, unit, value);
              hooks.updateOffset(this, keepTime);
              return this;
            } else {
              return get(this, unit);
            }
          };
        }

        function get(mom, unit) {
          return mom.isValid() ? mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]() : NaN;
        }

        function set$1(mom, unit, value) {
          if (mom.isValid() && !isNaN(value)) {
            if (unit === 'FullYear' && isLeapYear(mom.year()) && mom.month() === 1 && mom.date() === 29) {
              value = toInt(value);

              mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value, mom.month(), daysInMonth(value, mom.month()));
            } else {
              mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
            }
          }
        } // MOMENTS


        function stringGet(units) {
          units = normalizeUnits(units);

          if (isFunction(this[units])) {
            return this[units]();
          }

          return this;
        }

        function stringSet(units, value) {
          if (_typeof$1(units) === 'object') {
            units = normalizeObjectUnits(units);
            var prioritized = getPrioritizedUnits(units),
                i,
                prioritizedLen = prioritized.length;

            for (i = 0; i < prioritizedLen; i++) {
              this[prioritized[i].unit](units[prioritized[i].unit]);
            }
          } else {
            units = normalizeUnits(units);

            if (isFunction(this[units])) {
              return this[units](value);
            }
          }

          return this;
        }

        var match1 = /\d/,
            //       0 - 9
        match2 = /\d\d/,
            //      00 - 99
        match3 = /\d{3}/,
            //     000 - 999
        match4 = /\d{4}/,
            //    0000 - 9999
        match6 = /[+-]?\d{6}/,
            // -999999 - 999999
        match1to2 = /\d\d?/,
            //       0 - 99
        match3to4 = /\d\d\d\d?/,
            //     999 - 9999
        match5to6 = /\d\d\d\d\d\d?/,
            //   99999 - 999999
        match1to3 = /\d{1,3}/,
            //       0 - 999
        match1to4 = /\d{1,4}/,
            //       0 - 9999
        match1to6 = /[+-]?\d{1,6}/,
            // -999999 - 999999
        matchUnsigned = /\d+/,
            //       0 - inf
        matchSigned = /[+-]?\d+/,
            //    -inf - inf
        matchOffset = /Z|[+-]\d\d:?\d\d/gi,
            // +00:00 -00:00 +0000 -0000 or Z
        matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi,
            // +00 -00 +00:00 -00:00 +0000 -0000 or Z
        matchTimestamp = /[+-]?\d+(\.\d{1,3})?/,
            // 123456789 123456789.123
        // any word (or two) characters or numbers including two/three word month in arabic.
        // includes scottish gaelic two word and hyphenated months
        matchWord = /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i,
            regexes;
        regexes = {};

        function addRegexToken(token, regex, strictRegex) {
          regexes[token] = isFunction(regex) ? regex : function (isStrict, localeData) {
            return isStrict && strictRegex ? strictRegex : regex;
          };
        }

        function getParseRegexForToken(token, config) {
          if (!hasOwnProp(regexes, token)) {
            return new RegExp(unescapeFormat(token));
          }

          return regexes[token](config._strict, config._locale);
        } // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript


        function unescapeFormat(s) {
          return regexEscape(s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
            return p1 || p2 || p3 || p4;
          }));
        }

        function regexEscape(s) {
          return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        }

        var tokens = {};

        function addParseToken(token, callback) {
          var i,
              func = callback,
              tokenLen;

          if (typeof token === 'string') {
            token = [token];
          }

          if (isNumber(callback)) {
            func = function func(input, array) {
              array[callback] = toInt(input);
            };
          }

          tokenLen = token.length;

          for (i = 0; i < tokenLen; i++) {
            tokens[token[i]] = func;
          }
        }

        function addWeekParseToken(token, callback) {
          addParseToken(token, function (input, array, config, token) {
            config._w = config._w || {};
            callback(input, config._w, config, token);
          });
        }

        function addTimeToArrayFromToken(token, input, config) {
          if (input != null && hasOwnProp(tokens, token)) {
            tokens[token](input, config._a, config, token);
          }
        }

        var YEAR = 0,
            MONTH = 1,
            DATE = 2,
            HOUR = 3,
            MINUTE = 4,
            SECOND = 5,
            MILLISECOND = 6,
            WEEK = 7,
            WEEKDAY = 8;

        function mod(n, x) {
          return (n % x + x) % x;
        }

        var indexOf;

        if (Array.prototype.indexOf) {
          indexOf = Array.prototype.indexOf;
        } else {
          indexOf = function indexOf(o) {
            // I know
            var i;

            for (i = 0; i < this.length; ++i) {
              if (this[i] === o) {
                return i;
              }
            }

            return -1;
          };
        }

        function daysInMonth(year, month) {
          if (isNaN(year) || isNaN(month)) {
            return NaN;
          }

          var modMonth = mod(month, 12);
          year += (month - modMonth) / 12;
          return modMonth === 1 ? isLeapYear(year) ? 29 : 28 : 31 - modMonth % 7 % 2;
        } // FORMATTING


        addFormatToken('M', ['MM', 2], 'Mo', function () {
          return this.month() + 1;
        });
        addFormatToken('MMM', 0, 0, function (format) {
          return this.localeData().monthsShort(this, format);
        });
        addFormatToken('MMMM', 0, 0, function (format) {
          return this.localeData().months(this, format);
        }); // ALIASES

        addUnitAlias('month', 'M'); // PRIORITY

        addUnitPriority('month', 8); // PARSING

        addRegexToken('M', match1to2);
        addRegexToken('MM', match1to2, match2);
        addRegexToken('MMM', function (isStrict, locale) {
          return locale.monthsShortRegex(isStrict);
        });
        addRegexToken('MMMM', function (isStrict, locale) {
          return locale.monthsRegex(isStrict);
        });
        addParseToken(['M', 'MM'], function (input, array) {
          array[MONTH] = toInt(input) - 1;
        });
        addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
          var month = config._locale.monthsParse(input, token, config._strict); // if we didn't find a month name, mark the date as invalid.


          if (month != null) {
            array[MONTH] = month;
          } else {
            getParsingFlags(config).invalidMonth = input;
          }
        }); // LOCALES

        var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
            defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
            MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/,
            defaultMonthsShortRegex = matchWord,
            defaultMonthsRegex = matchWord;

        function localeMonths(m, format) {
          if (!m) {
            return isArray(this._months) ? this._months : this._months['standalone'];
          }

          return isArray(this._months) ? this._months[m.month()] : this._months[(this._months.isFormat || MONTHS_IN_FORMAT).test(format) ? 'format' : 'standalone'][m.month()];
        }

        function localeMonthsShort(m, format) {
          if (!m) {
            return isArray(this._monthsShort) ? this._monthsShort : this._monthsShort['standalone'];
          }

          return isArray(this._monthsShort) ? this._monthsShort[m.month()] : this._monthsShort[MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'][m.month()];
        }

        function handleStrictParse(monthName, format, strict) {
          var i,
              ii,
              mom,
              llc = monthName.toLocaleLowerCase();

          if (!this._monthsParse) {
            // this is not used
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];

            for (i = 0; i < 12; ++i) {
              mom = createUTC([2000, i]);
              this._shortMonthsParse[i] = this.monthsShort(mom, '').toLocaleLowerCase();
              this._longMonthsParse[i] = this.months(mom, '').toLocaleLowerCase();
            }
          }

          if (strict) {
            if (format === 'MMM') {
              ii = indexOf.call(this._shortMonthsParse, llc);
              return ii !== -1 ? ii : null;
            } else {
              ii = indexOf.call(this._longMonthsParse, llc);
              return ii !== -1 ? ii : null;
            }
          } else {
            if (format === 'MMM') {
              ii = indexOf.call(this._shortMonthsParse, llc);

              if (ii !== -1) {
                return ii;
              }

              ii = indexOf.call(this._longMonthsParse, llc);
              return ii !== -1 ? ii : null;
            } else {
              ii = indexOf.call(this._longMonthsParse, llc);

              if (ii !== -1) {
                return ii;
              }

              ii = indexOf.call(this._shortMonthsParse, llc);
              return ii !== -1 ? ii : null;
            }
          }
        }

        function localeMonthsParse(monthName, format, strict) {
          var i, mom, regex;

          if (this._monthsParseExact) {
            return handleStrictParse.call(this, monthName, format, strict);
          }

          if (!this._monthsParse) {
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
          } // TODO: add sorting
          // Sorting makes sure if one month (or abbr) is a prefix of another
          // see sorting in computeMonthsParse


          for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, i]);

            if (strict && !this._longMonthsParse[i]) {
              this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
              this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
            }

            if (!strict && !this._monthsParse[i]) {
              regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
              this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
            } // test the regex


            if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
              return i;
            } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
              return i;
            } else if (!strict && this._monthsParse[i].test(monthName)) {
              return i;
            }
          }
        } // MOMENTS


        function setMonth(mom, value) {
          var dayOfMonth;

          if (!mom.isValid()) {
            // No op
            return mom;
          }

          if (typeof value === 'string') {
            if (/^\d+$/.test(value)) {
              value = toInt(value);
            } else {
              value = mom.localeData().monthsParse(value); // TODO: Another silent failure?

              if (!isNumber(value)) {
                return mom;
              }
            }
          }

          dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));

          mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);

          return mom;
        }

        function getSetMonth(value) {
          if (value != null) {
            setMonth(this, value);
            hooks.updateOffset(this, true);
            return this;
          } else {
            return get(this, 'Month');
          }
        }

        function getDaysInMonth() {
          return daysInMonth(this.year(), this.month());
        }

        function monthsShortRegex(isStrict) {
          if (this._monthsParseExact) {
            if (!hasOwnProp(this, '_monthsRegex')) {
              computeMonthsParse.call(this);
            }

            if (isStrict) {
              return this._monthsShortStrictRegex;
            } else {
              return this._monthsShortRegex;
            }
          } else {
            if (!hasOwnProp(this, '_monthsShortRegex')) {
              this._monthsShortRegex = defaultMonthsShortRegex;
            }

            return this._monthsShortStrictRegex && isStrict ? this._monthsShortStrictRegex : this._monthsShortRegex;
          }
        }

        function monthsRegex(isStrict) {
          if (this._monthsParseExact) {
            if (!hasOwnProp(this, '_monthsRegex')) {
              computeMonthsParse.call(this);
            }

            if (isStrict) {
              return this._monthsStrictRegex;
            } else {
              return this._monthsRegex;
            }
          } else {
            if (!hasOwnProp(this, '_monthsRegex')) {
              this._monthsRegex = defaultMonthsRegex;
            }

            return this._monthsStrictRegex && isStrict ? this._monthsStrictRegex : this._monthsRegex;
          }
        }

        function computeMonthsParse() {
          function cmpLenRev(a, b) {
            return b.length - a.length;
          }

          var shortPieces = [],
              longPieces = [],
              mixedPieces = [],
              i,
              mom;

          for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, i]);
            shortPieces.push(this.monthsShort(mom, ''));
            longPieces.push(this.months(mom, ''));
            mixedPieces.push(this.months(mom, ''));
            mixedPieces.push(this.monthsShort(mom, ''));
          } // Sorting makes sure if one month (or abbr) is a prefix of another it
          // will match the longer piece.


          shortPieces.sort(cmpLenRev);
          longPieces.sort(cmpLenRev);
          mixedPieces.sort(cmpLenRev);

          for (i = 0; i < 12; i++) {
            shortPieces[i] = regexEscape(shortPieces[i]);
            longPieces[i] = regexEscape(longPieces[i]);
          }

          for (i = 0; i < 24; i++) {
            mixedPieces[i] = regexEscape(mixedPieces[i]);
          }

          this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
          this._monthsShortRegex = this._monthsRegex;
          this._monthsStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
          this._monthsShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
        } // FORMATTING


        addFormatToken('Y', 0, 0, function () {
          var y = this.year();
          return y <= 9999 ? zeroFill(y, 4) : '+' + y;
        });
        addFormatToken(0, ['YY', 2], 0, function () {
          return this.year() % 100;
        });
        addFormatToken(0, ['YYYY', 4], 0, 'year');
        addFormatToken(0, ['YYYYY', 5], 0, 'year');
        addFormatToken(0, ['YYYYYY', 6, true], 0, 'year'); // ALIASES

        addUnitAlias('year', 'y'); // PRIORITIES

        addUnitPriority('year', 1); // PARSING

        addRegexToken('Y', matchSigned);
        addRegexToken('YY', match1to2, match2);
        addRegexToken('YYYY', match1to4, match4);
        addRegexToken('YYYYY', match1to6, match6);
        addRegexToken('YYYYYY', match1to6, match6);
        addParseToken(['YYYYY', 'YYYYYY'], YEAR);
        addParseToken('YYYY', function (input, array) {
          array[YEAR] = input.length === 2 ? hooks.parseTwoDigitYear(input) : toInt(input);
        });
        addParseToken('YY', function (input, array) {
          array[YEAR] = hooks.parseTwoDigitYear(input);
        });
        addParseToken('Y', function (input, array) {
          array[YEAR] = parseInt(input, 10);
        }); // HELPERS

        function daysInYear(year) {
          return isLeapYear(year) ? 366 : 365;
        } // HOOKS


        hooks.parseTwoDigitYear = function (input) {
          return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
        }; // MOMENTS


        var getSetYear = makeGetSet('FullYear', true);

        function getIsLeapYear() {
          return isLeapYear(this.year());
        }

        function createDate(y, m, d, h, M, s, ms) {
          // can't just apply() to create a date:
          // https://stackoverflow.com/q/181348
          var date; // the date constructor remaps years 0-99 to 1900-1999

          if (y < 100 && y >= 0) {
            // preserve leap years using a full 400 year cycle, then reset
            date = new Date(y + 400, m, d, h, M, s, ms);

            if (isFinite(date.getFullYear())) {
              date.setFullYear(y);
            }
          } else {
            date = new Date(y, m, d, h, M, s, ms);
          }

          return date;
        }

        function createUTCDate(y) {
          var date, args; // the Date.UTC function remaps years 0-99 to 1900-1999

          if (y < 100 && y >= 0) {
            args = Array.prototype.slice.call(arguments); // preserve leap years using a full 400 year cycle, then reset

            args[0] = y + 400;
            date = new Date(Date.UTC.apply(null, args));

            if (isFinite(date.getUTCFullYear())) {
              date.setUTCFullYear(y);
            }
          } else {
            date = new Date(Date.UTC.apply(null, arguments));
          }

          return date;
        } // start-of-first-week - start-of-year


        function firstWeekOffset(year, dow, doy) {
          var // first-week day -- which january is always in the first week (4 for iso, 1 for other)
          fwd = 7 + dow - doy,
              // first-week day local weekday -- which local weekday is fwd
          fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;
          return -fwdlw + fwd - 1;
        } // https://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday


        function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
          var localWeekday = (7 + weekday - dow) % 7,
              weekOffset = firstWeekOffset(year, dow, doy),
              dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,
              resYear,
              resDayOfYear;

          if (dayOfYear <= 0) {
            resYear = year - 1;
            resDayOfYear = daysInYear(resYear) + dayOfYear;
          } else if (dayOfYear > daysInYear(year)) {
            resYear = year + 1;
            resDayOfYear = dayOfYear - daysInYear(year);
          } else {
            resYear = year;
            resDayOfYear = dayOfYear;
          }

          return {
            year: resYear,
            dayOfYear: resDayOfYear
          };
        }

        function weekOfYear(mom, dow, doy) {
          var weekOffset = firstWeekOffset(mom.year(), dow, doy),
              week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,
              resWeek,
              resYear;

          if (week < 1) {
            resYear = mom.year() - 1;
            resWeek = week + weeksInYear(resYear, dow, doy);
          } else if (week > weeksInYear(mom.year(), dow, doy)) {
            resWeek = week - weeksInYear(mom.year(), dow, doy);
            resYear = mom.year() + 1;
          } else {
            resYear = mom.year();
            resWeek = week;
          }

          return {
            week: resWeek,
            year: resYear
          };
        }

        function weeksInYear(year, dow, doy) {
          var weekOffset = firstWeekOffset(year, dow, doy),
              weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
          return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
        } // FORMATTING


        addFormatToken('w', ['ww', 2], 'wo', 'week');
        addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek'); // ALIASES

        addUnitAlias('week', 'w');
        addUnitAlias('isoWeek', 'W'); // PRIORITIES

        addUnitPriority('week', 5);
        addUnitPriority('isoWeek', 5); // PARSING

        addRegexToken('w', match1to2);
        addRegexToken('ww', match1to2, match2);
        addRegexToken('W', match1to2);
        addRegexToken('WW', match1to2, match2);
        addWeekParseToken(['w', 'ww', 'W', 'WW'], function (input, week, config, token) {
          week[token.substr(0, 1)] = toInt(input);
        }); // HELPERS
        // LOCALES

        function localeWeek(mom) {
          return weekOfYear(mom, this._week.dow, this._week.doy).week;
        }

        var defaultLocaleWeek = {
          dow: 0,
          // Sunday is the first day of the week.
          doy: 6 // The week that contains Jan 6th is the first week of the year.

        };

        function localeFirstDayOfWeek() {
          return this._week.dow;
        }

        function localeFirstDayOfYear() {
          return this._week.doy;
        } // MOMENTS


        function getSetWeek(input) {
          var week = this.localeData().week(this);
          return input == null ? week : this.add((input - week) * 7, 'd');
        }

        function getSetISOWeek(input) {
          var week = weekOfYear(this, 1, 4).week;
          return input == null ? week : this.add((input - week) * 7, 'd');
        } // FORMATTING


        addFormatToken('d', 0, 'do', 'day');
        addFormatToken('dd', 0, 0, function (format) {
          return this.localeData().weekdaysMin(this, format);
        });
        addFormatToken('ddd', 0, 0, function (format) {
          return this.localeData().weekdaysShort(this, format);
        });
        addFormatToken('dddd', 0, 0, function (format) {
          return this.localeData().weekdays(this, format);
        });
        addFormatToken('e', 0, 0, 'weekday');
        addFormatToken('E', 0, 0, 'isoWeekday'); // ALIASES

        addUnitAlias('day', 'd');
        addUnitAlias('weekday', 'e');
        addUnitAlias('isoWeekday', 'E'); // PRIORITY

        addUnitPriority('day', 11);
        addUnitPriority('weekday', 11);
        addUnitPriority('isoWeekday', 11); // PARSING

        addRegexToken('d', match1to2);
        addRegexToken('e', match1to2);
        addRegexToken('E', match1to2);
        addRegexToken('dd', function (isStrict, locale) {
          return locale.weekdaysMinRegex(isStrict);
        });
        addRegexToken('ddd', function (isStrict, locale) {
          return locale.weekdaysShortRegex(isStrict);
        });
        addRegexToken('dddd', function (isStrict, locale) {
          return locale.weekdaysRegex(isStrict);
        });
        addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config, token) {
          var weekday = config._locale.weekdaysParse(input, token, config._strict); // if we didn't get a weekday name, mark the date as invalid


          if (weekday != null) {
            week.d = weekday;
          } else {
            getParsingFlags(config).invalidWeekday = input;
          }
        });
        addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
          week[token] = toInt(input);
        }); // HELPERS

        function parseWeekday(input, locale) {
          if (typeof input !== 'string') {
            return input;
          }

          if (!isNaN(input)) {
            return parseInt(input, 10);
          }

          input = locale.weekdaysParse(input);

          if (typeof input === 'number') {
            return input;
          }

          return null;
        }

        function parseIsoWeekday(input, locale) {
          if (typeof input === 'string') {
            return locale.weekdaysParse(input) % 7 || 7;
          }

          return isNaN(input) ? null : input;
        } // LOCALES


        function shiftWeekdays(ws, n) {
          return ws.slice(n, 7).concat(ws.slice(0, n));
        }

        var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
            defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
            defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
            defaultWeekdaysRegex = matchWord,
            defaultWeekdaysShortRegex = matchWord,
            defaultWeekdaysMinRegex = matchWord;

        function localeWeekdays(m, format) {
          var weekdays = isArray(this._weekdays) ? this._weekdays : this._weekdays[m && m !== true && this._weekdays.isFormat.test(format) ? 'format' : 'standalone'];
          return m === true ? shiftWeekdays(weekdays, this._week.dow) : m ? weekdays[m.day()] : weekdays;
        }

        function localeWeekdaysShort(m) {
          return m === true ? shiftWeekdays(this._weekdaysShort, this._week.dow) : m ? this._weekdaysShort[m.day()] : this._weekdaysShort;
        }

        function localeWeekdaysMin(m) {
          return m === true ? shiftWeekdays(this._weekdaysMin, this._week.dow) : m ? this._weekdaysMin[m.day()] : this._weekdaysMin;
        }

        function handleStrictParse$1(weekdayName, format, strict) {
          var i,
              ii,
              mom,
              llc = weekdayName.toLocaleLowerCase();

          if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._minWeekdaysParse = [];

            for (i = 0; i < 7; ++i) {
              mom = createUTC([2000, 1]).day(i);
              this._minWeekdaysParse[i] = this.weekdaysMin(mom, '').toLocaleLowerCase();
              this._shortWeekdaysParse[i] = this.weekdaysShort(mom, '').toLocaleLowerCase();
              this._weekdaysParse[i] = this.weekdays(mom, '').toLocaleLowerCase();
            }
          }

          if (strict) {
            if (format === 'dddd') {
              ii = indexOf.call(this._weekdaysParse, llc);
              return ii !== -1 ? ii : null;
            } else if (format === 'ddd') {
              ii = indexOf.call(this._shortWeekdaysParse, llc);
              return ii !== -1 ? ii : null;
            } else {
              ii = indexOf.call(this._minWeekdaysParse, llc);
              return ii !== -1 ? ii : null;
            }
          } else {
            if (format === 'dddd') {
              ii = indexOf.call(this._weekdaysParse, llc);

              if (ii !== -1) {
                return ii;
              }

              ii = indexOf.call(this._shortWeekdaysParse, llc);

              if (ii !== -1) {
                return ii;
              }

              ii = indexOf.call(this._minWeekdaysParse, llc);
              return ii !== -1 ? ii : null;
            } else if (format === 'ddd') {
              ii = indexOf.call(this._shortWeekdaysParse, llc);

              if (ii !== -1) {
                return ii;
              }

              ii = indexOf.call(this._weekdaysParse, llc);

              if (ii !== -1) {
                return ii;
              }

              ii = indexOf.call(this._minWeekdaysParse, llc);
              return ii !== -1 ? ii : null;
            } else {
              ii = indexOf.call(this._minWeekdaysParse, llc);

              if (ii !== -1) {
                return ii;
              }

              ii = indexOf.call(this._weekdaysParse, llc);

              if (ii !== -1) {
                return ii;
              }

              ii = indexOf.call(this._shortWeekdaysParse, llc);
              return ii !== -1 ? ii : null;
            }
          }
        }

        function localeWeekdaysParse(weekdayName, format, strict) {
          var i, mom, regex;

          if (this._weekdaysParseExact) {
            return handleStrictParse$1.call(this, weekdayName, format, strict);
          }

          if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._minWeekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._fullWeekdaysParse = [];
          }

          for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, 1]).day(i);

            if (strict && !this._fullWeekdaysParse[i]) {
              this._fullWeekdaysParse[i] = new RegExp('^' + this.weekdays(mom, '').replace('.', '\\.?') + '$', 'i');
              this._shortWeekdaysParse[i] = new RegExp('^' + this.weekdaysShort(mom, '').replace('.', '\\.?') + '$', 'i');
              this._minWeekdaysParse[i] = new RegExp('^' + this.weekdaysMin(mom, '').replace('.', '\\.?') + '$', 'i');
            }

            if (!this._weekdaysParse[i]) {
              regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
              this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
            } // test the regex


            if (strict && format === 'dddd' && this._fullWeekdaysParse[i].test(weekdayName)) {
              return i;
            } else if (strict && format === 'ddd' && this._shortWeekdaysParse[i].test(weekdayName)) {
              return i;
            } else if (strict && format === 'dd' && this._minWeekdaysParse[i].test(weekdayName)) {
              return i;
            } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
              return i;
            }
          }
        } // MOMENTS


        function getSetDayOfWeek(input) {
          if (!this.isValid()) {
            return input != null ? this : NaN;
          }

          var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();

          if (input != null) {
            input = parseWeekday(input, this.localeData());
            return this.add(input - day, 'd');
          } else {
            return day;
          }
        }

        function getSetLocaleDayOfWeek(input) {
          if (!this.isValid()) {
            return input != null ? this : NaN;
          }

          var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
          return input == null ? weekday : this.add(input - weekday, 'd');
        }

        function getSetISODayOfWeek(input) {
          if (!this.isValid()) {
            return input != null ? this : NaN;
          } // behaves the same as moment#day except
          // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
          // as a setter, sunday should belong to the previous week.


          if (input != null) {
            var weekday = parseIsoWeekday(input, this.localeData());
            return this.day(this.day() % 7 ? weekday : weekday - 7);
          } else {
            return this.day() || 7;
          }
        }

        function weekdaysRegex(isStrict) {
          if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
              computeWeekdaysParse.call(this);
            }

            if (isStrict) {
              return this._weekdaysStrictRegex;
            } else {
              return this._weekdaysRegex;
            }
          } else {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
              this._weekdaysRegex = defaultWeekdaysRegex;
            }

            return this._weekdaysStrictRegex && isStrict ? this._weekdaysStrictRegex : this._weekdaysRegex;
          }
        }

        function weekdaysShortRegex(isStrict) {
          if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
              computeWeekdaysParse.call(this);
            }

            if (isStrict) {
              return this._weekdaysShortStrictRegex;
            } else {
              return this._weekdaysShortRegex;
            }
          } else {
            if (!hasOwnProp(this, '_weekdaysShortRegex')) {
              this._weekdaysShortRegex = defaultWeekdaysShortRegex;
            }

            return this._weekdaysShortStrictRegex && isStrict ? this._weekdaysShortStrictRegex : this._weekdaysShortRegex;
          }
        }

        function weekdaysMinRegex(isStrict) {
          if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
              computeWeekdaysParse.call(this);
            }

            if (isStrict) {
              return this._weekdaysMinStrictRegex;
            } else {
              return this._weekdaysMinRegex;
            }
          } else {
            if (!hasOwnProp(this, '_weekdaysMinRegex')) {
              this._weekdaysMinRegex = defaultWeekdaysMinRegex;
            }

            return this._weekdaysMinStrictRegex && isStrict ? this._weekdaysMinStrictRegex : this._weekdaysMinRegex;
          }
        }

        function computeWeekdaysParse() {
          function cmpLenRev(a, b) {
            return b.length - a.length;
          }

          var minPieces = [],
              shortPieces = [],
              longPieces = [],
              mixedPieces = [],
              i,
              mom,
              minp,
              shortp,
              longp;

          for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, 1]).day(i);
            minp = regexEscape(this.weekdaysMin(mom, ''));
            shortp = regexEscape(this.weekdaysShort(mom, ''));
            longp = regexEscape(this.weekdays(mom, ''));
            minPieces.push(minp);
            shortPieces.push(shortp);
            longPieces.push(longp);
            mixedPieces.push(minp);
            mixedPieces.push(shortp);
            mixedPieces.push(longp);
          } // Sorting makes sure if one weekday (or abbr) is a prefix of another it
          // will match the longer piece.


          minPieces.sort(cmpLenRev);
          shortPieces.sort(cmpLenRev);
          longPieces.sort(cmpLenRev);
          mixedPieces.sort(cmpLenRev);
          this._weekdaysRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
          this._weekdaysShortRegex = this._weekdaysRegex;
          this._weekdaysMinRegex = this._weekdaysRegex;
          this._weekdaysStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
          this._weekdaysShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
          this._weekdaysMinStrictRegex = new RegExp('^(' + minPieces.join('|') + ')', 'i');
        } // FORMATTING


        function hFormat() {
          return this.hours() % 12 || 12;
        }

        function kFormat() {
          return this.hours() || 24;
        }

        addFormatToken('H', ['HH', 2], 0, 'hour');
        addFormatToken('h', ['hh', 2], 0, hFormat);
        addFormatToken('k', ['kk', 2], 0, kFormat);
        addFormatToken('hmm', 0, 0, function () {
          return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);
        });
        addFormatToken('hmmss', 0, 0, function () {
          return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2) + zeroFill(this.seconds(), 2);
        });
        addFormatToken('Hmm', 0, 0, function () {
          return '' + this.hours() + zeroFill(this.minutes(), 2);
        });
        addFormatToken('Hmmss', 0, 0, function () {
          return '' + this.hours() + zeroFill(this.minutes(), 2) + zeroFill(this.seconds(), 2);
        });

        function meridiem(token, lowercase) {
          addFormatToken(token, 0, 0, function () {
            return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
          });
        }

        meridiem('a', true);
        meridiem('A', false); // ALIASES

        addUnitAlias('hour', 'h'); // PRIORITY

        addUnitPriority('hour', 13); // PARSING

        function matchMeridiem(isStrict, locale) {
          return locale._meridiemParse;
        }

        addRegexToken('a', matchMeridiem);
        addRegexToken('A', matchMeridiem);
        addRegexToken('H', match1to2);
        addRegexToken('h', match1to2);
        addRegexToken('k', match1to2);
        addRegexToken('HH', match1to2, match2);
        addRegexToken('hh', match1to2, match2);
        addRegexToken('kk', match1to2, match2);
        addRegexToken('hmm', match3to4);
        addRegexToken('hmmss', match5to6);
        addRegexToken('Hmm', match3to4);
        addRegexToken('Hmmss', match5to6);
        addParseToken(['H', 'HH'], HOUR);
        addParseToken(['k', 'kk'], function (input, array, config) {
          var kInput = toInt(input);
          array[HOUR] = kInput === 24 ? 0 : kInput;
        });
        addParseToken(['a', 'A'], function (input, array, config) {
          config._isPm = config._locale.isPM(input);
          config._meridiem = input;
        });
        addParseToken(['h', 'hh'], function (input, array, config) {
          array[HOUR] = toInt(input);
          getParsingFlags(config).bigHour = true;
        });
        addParseToken('hmm', function (input, array, config) {
          var pos = input.length - 2;
          array[HOUR] = toInt(input.substr(0, pos));
          array[MINUTE] = toInt(input.substr(pos));
          getParsingFlags(config).bigHour = true;
        });
        addParseToken('hmmss', function (input, array, config) {
          var pos1 = input.length - 4,
              pos2 = input.length - 2;
          array[HOUR] = toInt(input.substr(0, pos1));
          array[MINUTE] = toInt(input.substr(pos1, 2));
          array[SECOND] = toInt(input.substr(pos2));
          getParsingFlags(config).bigHour = true;
        });
        addParseToken('Hmm', function (input, array, config) {
          var pos = input.length - 2;
          array[HOUR] = toInt(input.substr(0, pos));
          array[MINUTE] = toInt(input.substr(pos));
        });
        addParseToken('Hmmss', function (input, array, config) {
          var pos1 = input.length - 4,
              pos2 = input.length - 2;
          array[HOUR] = toInt(input.substr(0, pos1));
          array[MINUTE] = toInt(input.substr(pos1, 2));
          array[SECOND] = toInt(input.substr(pos2));
        }); // LOCALES

        function localeIsPM(input) {
          // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
          // Using charAt should be more compatible.
          return (input + '').toLowerCase().charAt(0) === 'p';
        }

        var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i,
            // Setting the hour should keep the time, because the user explicitly
        // specified which hour they want. So trying to maintain the same hour (in
        // a new timezone) makes sense. Adding/subtracting hours does not follow
        // this rule.
        getSetHour = makeGetSet('Hours', true);

        function localeMeridiem(hours, minutes, isLower) {
          if (hours > 11) {
            return isLower ? 'pm' : 'PM';
          } else {
            return isLower ? 'am' : 'AM';
          }
        }

        var baseConfig = {
          calendar: defaultCalendar,
          longDateFormat: defaultLongDateFormat,
          invalidDate: defaultInvalidDate,
          ordinal: defaultOrdinal,
          dayOfMonthOrdinalParse: defaultDayOfMonthOrdinalParse,
          relativeTime: defaultRelativeTime,
          months: defaultLocaleMonths,
          monthsShort: defaultLocaleMonthsShort,
          week: defaultLocaleWeek,
          weekdays: defaultLocaleWeekdays,
          weekdaysMin: defaultLocaleWeekdaysMin,
          weekdaysShort: defaultLocaleWeekdaysShort,
          meridiemParse: defaultLocaleMeridiemParse
        }; // internal storage for locale config files

        var locales = {},
            localeFamilies = {},
            globalLocale;

        function commonPrefix(arr1, arr2) {
          var i,
              minl = Math.min(arr1.length, arr2.length);

          for (i = 0; i < minl; i += 1) {
            if (arr1[i] !== arr2[i]) {
              return i;
            }
          }

          return minl;
        }

        function normalizeLocale(key) {
          return key ? key.toLowerCase().replace('_', '-') : key;
        } // pick the locale from the array
        // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
        // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root


        function chooseLocale(names) {
          var i = 0,
              j,
              next,
              locale,
              split;

          while (i < names.length) {
            split = normalizeLocale(names[i]).split('-');
            j = split.length;
            next = normalizeLocale(names[i + 1]);
            next = next ? next.split('-') : null;

            while (j > 0) {
              locale = loadLocale(split.slice(0, j).join('-'));

              if (locale) {
                return locale;
              }

              if (next && next.length >= j && commonPrefix(split, next) >= j - 1) {
                //the next array item is better than a shallower substring of this one
                break;
              }

              j--;
            }

            i++;
          }

          return globalLocale;
        }

        function isLocaleNameSane(name) {
          // Prevent names that look like filesystem paths, i.e contain '/' or '\'
          return name.match('^[^/\\\\]*$') != null;
        }

        function loadLocale(name) {
          var oldLocale = null,
              aliasedRequire; // TODO: Find a better way to register and load all the locales in Node

          if (locales[name] === undefined && 'object' !== 'undefined' && module && module.exports && isLocaleNameSane(name)) {
            try {
              oldLocale = globalLocale._abbr;
              aliasedRequire = commonjsRequire;
              aliasedRequire('./locale/' + name);
              getSetGlobalLocale(oldLocale);
            } catch (e) {
              // mark as not found to avoid repeating expensive file require call causing high CPU
              // when trying to find en-US, en_US, en-us for every format call
              locales[name] = null; // null means not found
            }
          }

          return locales[name];
        } // This function will load locale and then set the global locale.  If
        // no arguments are passed in, it will simply return the current global
        // locale key.


        function getSetGlobalLocale(key, values) {
          var data;

          if (key) {
            if (isUndefined(values)) {
              data = getLocale(key);
            } else {
              data = defineLocale(key, values);
            }

            if (data) {
              // moment.duration._locale = moment._locale = data;
              globalLocale = data;
            } else {
              if (typeof console !== 'undefined' && console.warn) {
                //warn user if arguments are passed but the locale could not be set
                console.warn('Locale ' + key + ' not found. Did you forget to load it?');
              }
            }
          }

          return globalLocale._abbr;
        }

        function defineLocale(name, config) {
          if (config !== null) {
            var locale,
                parentConfig = baseConfig;
            config.abbr = name;

            if (locales[name] != null) {
              deprecateSimple('defineLocaleOverride', 'use moment.updateLocale(localeName, config) to change ' + 'an existing locale. moment.defineLocale(localeName, ' + 'config) should only be used for creating a new locale ' + 'See http://momentjs.com/guides/#/warnings/define-locale/ for more info.');
              parentConfig = locales[name]._config;
            } else if (config.parentLocale != null) {
              if (locales[config.parentLocale] != null) {
                parentConfig = locales[config.parentLocale]._config;
              } else {
                locale = loadLocale(config.parentLocale);

                if (locale != null) {
                  parentConfig = locale._config;
                } else {
                  if (!localeFamilies[config.parentLocale]) {
                    localeFamilies[config.parentLocale] = [];
                  }

                  localeFamilies[config.parentLocale].push({
                    name: name,
                    config: config
                  });
                  return null;
                }
              }
            }

            locales[name] = new Locale(mergeConfigs(parentConfig, config));

            if (localeFamilies[name]) {
              localeFamilies[name].forEach(function (x) {
                defineLocale(x.name, x.config);
              });
            } // backwards compat for now: also set the locale
            // make sure we set the locale AFTER all child locales have been
            // created, so we won't end up with the child locale set.


            getSetGlobalLocale(name);
            return locales[name];
          } else {
            // useful for testing
            delete locales[name];
            return null;
          }
        }

        function updateLocale(name, config) {
          if (config != null) {
            var locale,
                tmpLocale,
                parentConfig = baseConfig;

            if (locales[name] != null && locales[name].parentLocale != null) {
              // Update existing child locale in-place to avoid memory-leaks
              locales[name].set(mergeConfigs(locales[name]._config, config));
            } else {
              // MERGE
              tmpLocale = loadLocale(name);

              if (tmpLocale != null) {
                parentConfig = tmpLocale._config;
              }

              config = mergeConfigs(parentConfig, config);

              if (tmpLocale == null) {
                // updateLocale is called for creating a new locale
                // Set abbr so it will have a name (getters return
                // undefined otherwise).
                config.abbr = name;
              }

              locale = new Locale(config);
              locale.parentLocale = locales[name];
              locales[name] = locale;
            } // backwards compat for now: also set the locale


            getSetGlobalLocale(name);
          } else {
            // pass null for config to unupdate, useful for tests
            if (locales[name] != null) {
              if (locales[name].parentLocale != null) {
                locales[name] = locales[name].parentLocale;

                if (name === getSetGlobalLocale()) {
                  getSetGlobalLocale(name);
                }
              } else if (locales[name] != null) {
                delete locales[name];
              }
            }
          }

          return locales[name];
        } // returns locale data


        function getLocale(key) {
          var locale;

          if (key && key._locale && key._locale._abbr) {
            key = key._locale._abbr;
          }

          if (!key) {
            return globalLocale;
          }

          if (!isArray(key)) {
            //short-circuit everything else
            locale = loadLocale(key);

            if (locale) {
              return locale;
            }

            key = [key];
          }

          return chooseLocale(key);
        }

        function listLocales() {
          return keys(locales);
        }

        function checkOverflow(m) {
          var overflow,
              a = m._a;

          if (a && getParsingFlags(m).overflow === -2) {
            overflow = a[MONTH] < 0 || a[MONTH] > 11 ? MONTH : a[DATE] < 1 || a[DATE] > daysInMonth(a[YEAR], a[MONTH]) ? DATE : a[HOUR] < 0 || a[HOUR] > 24 || a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0) ? HOUR : a[MINUTE] < 0 || a[MINUTE] > 59 ? MINUTE : a[SECOND] < 0 || a[SECOND] > 59 ? SECOND : a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND : -1;

            if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
              overflow = DATE;
            }

            if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
              overflow = WEEK;
            }

            if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
              overflow = WEEKDAY;
            }

            getParsingFlags(m).overflow = overflow;
          }

          return m;
        } // iso 8601 regex
        // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)


        var extendedIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
            basicIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d|))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
            tzRegex = /Z|[+-]\d\d(?::?\d\d)?/,
            isoDates = [['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/], ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/], ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/], ['GGGG-[W]WW', /\d{4}-W\d\d/, false], ['YYYY-DDD', /\d{4}-\d{3}/], ['YYYY-MM', /\d{4}-\d\d/, false], ['YYYYYYMMDD', /[+-]\d{10}/], ['YYYYMMDD', /\d{8}/], ['GGGG[W]WWE', /\d{4}W\d{3}/], ['GGGG[W]WW', /\d{4}W\d{2}/, false], ['YYYYDDD', /\d{7}/], ['YYYYMM', /\d{6}/, false], ['YYYY', /\d{4}/, false]],
            // iso time formats and regexes
        isoTimes = [['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/], ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/], ['HH:mm:ss', /\d\d:\d\d:\d\d/], ['HH:mm', /\d\d:\d\d/], ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/], ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/], ['HHmmss', /\d\d\d\d\d\d/], ['HHmm', /\d\d\d\d/], ['HH', /\d\d/]],
            aspNetJsonRegex = /^\/?Date\((-?\d+)/i,
            // RFC 2822 regex: For details see https://tools.ietf.org/html/rfc2822#section-3.3
        rfc2822 = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/,
            obsOffsets = {
          UT: 0,
          GMT: 0,
          EDT: -4 * 60,
          EST: -5 * 60,
          CDT: -5 * 60,
          CST: -6 * 60,
          MDT: -6 * 60,
          MST: -7 * 60,
          PDT: -7 * 60,
          PST: -8 * 60
        }; // date from iso format

        function configFromISO(config) {
          var i,
              l,
              string = config._i,
              match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string),
              allowTime,
              dateFormat,
              timeFormat,
              tzFormat,
              isoDatesLen = isoDates.length,
              isoTimesLen = isoTimes.length;

          if (match) {
            getParsingFlags(config).iso = true;

            for (i = 0, l = isoDatesLen; i < l; i++) {
              if (isoDates[i][1].exec(match[1])) {
                dateFormat = isoDates[i][0];
                allowTime = isoDates[i][2] !== false;
                break;
              }
            }

            if (dateFormat == null) {
              config._isValid = false;
              return;
            }

            if (match[3]) {
              for (i = 0, l = isoTimesLen; i < l; i++) {
                if (isoTimes[i][1].exec(match[3])) {
                  // match[2] should be 'T' or space
                  timeFormat = (match[2] || ' ') + isoTimes[i][0];
                  break;
                }
              }

              if (timeFormat == null) {
                config._isValid = false;
                return;
              }
            }

            if (!allowTime && timeFormat != null) {
              config._isValid = false;
              return;
            }

            if (match[4]) {
              if (tzRegex.exec(match[4])) {
                tzFormat = 'Z';
              } else {
                config._isValid = false;
                return;
              }
            }

            config._f = dateFormat + (timeFormat || '') + (tzFormat || '');
            configFromStringAndFormat(config);
          } else {
            config._isValid = false;
          }
        }

        function extractFromRFC2822Strings(yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr) {
          var result = [untruncateYear(yearStr), defaultLocaleMonthsShort.indexOf(monthStr), parseInt(dayStr, 10), parseInt(hourStr, 10), parseInt(minuteStr, 10)];

          if (secondStr) {
            result.push(parseInt(secondStr, 10));
          }

          return result;
        }

        function untruncateYear(yearStr) {
          var year = parseInt(yearStr, 10);

          if (year <= 49) {
            return 2000 + year;
          } else if (year <= 999) {
            return 1900 + year;
          }

          return year;
        }

        function preprocessRFC2822(s) {
          // Remove comments and folding whitespace and replace multiple-spaces with a single space
          return s.replace(/\([^)]*\)|[\n\t]/g, ' ').replace(/(\s\s+)/g, ' ').replace(/^\s\s*/, '').replace(/\s\s*$/, '');
        }

        function checkWeekday(weekdayStr, parsedInput, config) {
          if (weekdayStr) {
            // TODO: Replace the vanilla JS Date object with an independent day-of-week check.
            var weekdayProvided = defaultLocaleWeekdaysShort.indexOf(weekdayStr),
                weekdayActual = new Date(parsedInput[0], parsedInput[1], parsedInput[2]).getDay();

            if (weekdayProvided !== weekdayActual) {
              getParsingFlags(config).weekdayMismatch = true;
              config._isValid = false;
              return false;
            }
          }

          return true;
        }

        function calculateOffset(obsOffset, militaryOffset, numOffset) {
          if (obsOffset) {
            return obsOffsets[obsOffset];
          } else if (militaryOffset) {
            // the only allowed military tz is Z
            return 0;
          } else {
            var hm = parseInt(numOffset, 10),
                m = hm % 100,
                h = (hm - m) / 100;
            return h * 60 + m;
          }
        } // date and time from ref 2822 format


        function configFromRFC2822(config) {
          var match = rfc2822.exec(preprocessRFC2822(config._i)),
              parsedArray;

          if (match) {
            parsedArray = extractFromRFC2822Strings(match[4], match[3], match[2], match[5], match[6], match[7]);

            if (!checkWeekday(match[1], parsedArray, config)) {
              return;
            }

            config._a = parsedArray;
            config._tzm = calculateOffset(match[8], match[9], match[10]);
            config._d = createUTCDate.apply(null, config._a);

            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);

            getParsingFlags(config).rfc2822 = true;
          } else {
            config._isValid = false;
          }
        } // date from 1) ASP.NET, 2) ISO, 3) RFC 2822 formats, or 4) optional fallback if parsing isn't strict


        function configFromString(config) {
          var matched = aspNetJsonRegex.exec(config._i);

          if (matched !== null) {
            config._d = new Date(+matched[1]);
            return;
          }

          configFromISO(config);

          if (config._isValid === false) {
            delete config._isValid;
          } else {
            return;
          }

          configFromRFC2822(config);

          if (config._isValid === false) {
            delete config._isValid;
          } else {
            return;
          }

          if (config._strict) {
            config._isValid = false;
          } else {
            // Final attempt, use Input Fallback
            hooks.createFromInputFallback(config);
          }
        }

        hooks.createFromInputFallback = deprecate('value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), ' + 'which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are ' + 'discouraged. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.', function (config) {
          config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
        }); // Pick the first defined of two or three arguments.

        function defaults(a, b, c) {
          if (a != null) {
            return a;
          }

          if (b != null) {
            return b;
          }

          return c;
        }

        function currentDateArray(config) {
          // hooks is actually the exported moment object
          var nowValue = new Date(hooks.now());

          if (config._useUTC) {
            return [nowValue.getUTCFullYear(), nowValue.getUTCMonth(), nowValue.getUTCDate()];
          }

          return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
        } // convert an array to a date.
        // the array should mirror the parameters below
        // note: all values past the year are optional and will default to the lowest possible value.
        // [year, month, day , hour, minute, second, millisecond]


        function configFromArray(config) {
          var i,
              date,
              input = [],
              currentDate,
              expectedWeekday,
              yearToUse;

          if (config._d) {
            return;
          }

          currentDate = currentDateArray(config); //compute day of the year from weeks and weekdays

          if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
            dayOfYearFromWeekInfo(config);
          } //if the day of the year is set, figure out what it is


          if (config._dayOfYear != null) {
            yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

            if (config._dayOfYear > daysInYear(yearToUse) || config._dayOfYear === 0) {
              getParsingFlags(config)._overflowDayOfYear = true;
            }

            date = createUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
          } // Default to current date.
          // * if no year, month, day of month are given, default to today
          // * if day of month is given, default month and year
          // * if month is given, default only year
          // * if year is given, don't default anything


          for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentDate[i];
          } // Zero out whatever was not defaulted, including time


          for (; i < 7; i++) {
            config._a[i] = input[i] = config._a[i] == null ? i === 2 ? 1 : 0 : config._a[i];
          } // Check for 24:00:00.000


          if (config._a[HOUR] === 24 && config._a[MINUTE] === 0 && config._a[SECOND] === 0 && config._a[MILLISECOND] === 0) {
            config._nextDay = true;
            config._a[HOUR] = 0;
          }

          config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);
          expectedWeekday = config._useUTC ? config._d.getUTCDay() : config._d.getDay(); // Apply timezone offset from input. The actual utcOffset can be changed
          // with parseZone.

          if (config._tzm != null) {
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
          }

          if (config._nextDay) {
            config._a[HOUR] = 24;
          } // check for mismatching day of week


          if (config._w && typeof config._w.d !== 'undefined' && config._w.d !== expectedWeekday) {
            getParsingFlags(config).weekdayMismatch = true;
          }
        }

        function dayOfYearFromWeekInfo(config) {
          var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow, curWeek;
          w = config._w;

          if (w.GG != null || w.W != null || w.E != null) {
            dow = 1;
            doy = 4; // TODO: We need to take the current isoWeekYear, but that depends on
            // how we interpret now (local, utc, fixed offset). So create
            // a now version of current config (take local/utc/offset flags, and
            // create now).

            weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(createLocal(), 1, 4).year);
            week = defaults(w.W, 1);
            weekday = defaults(w.E, 1);

            if (weekday < 1 || weekday > 7) {
              weekdayOverflow = true;
            }
          } else {
            dow = config._locale._week.dow;
            doy = config._locale._week.doy;
            curWeek = weekOfYear(createLocal(), dow, doy);
            weekYear = defaults(w.gg, config._a[YEAR], curWeek.year); // Default to current week.

            week = defaults(w.w, curWeek.week);

            if (w.d != null) {
              // weekday -- low day numbers are considered next week
              weekday = w.d;

              if (weekday < 0 || weekday > 6) {
                weekdayOverflow = true;
              }
            } else if (w.e != null) {
              // local weekday -- counting starts from beginning of week
              weekday = w.e + dow;

              if (w.e < 0 || w.e > 6) {
                weekdayOverflow = true;
              }
            } else {
              // default to beginning of week
              weekday = dow;
            }
          }

          if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
            getParsingFlags(config)._overflowWeeks = true;
          } else if (weekdayOverflow != null) {
            getParsingFlags(config)._overflowWeekday = true;
          } else {
            temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
            config._a[YEAR] = temp.year;
            config._dayOfYear = temp.dayOfYear;
          }
        } // constant that refers to the ISO standard


        hooks.ISO_8601 = function () {}; // constant that refers to the RFC 2822 form


        hooks.RFC_2822 = function () {}; // date from string and format string


        function configFromStringAndFormat(config) {
          // TODO: Move this to another part of the creation flow to prevent circular deps
          if (config._f === hooks.ISO_8601) {
            configFromISO(config);
            return;
          }

          if (config._f === hooks.RFC_2822) {
            configFromRFC2822(config);
            return;
          }

          config._a = [];
          getParsingFlags(config).empty = true; // This array is used to make a Date, either with `new Date` or `Date.UTC`

          var string = '' + config._i,
              i,
              parsedInput,
              tokens,
              token,
              skipped,
              stringLength = string.length,
              totalParsedInputLength = 0,
              era,
              tokenLen;
          tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];
          tokenLen = tokens.length;

          for (i = 0; i < tokenLen; i++) {
            token = tokens[i];
            parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];

            if (parsedInput) {
              skipped = string.substr(0, string.indexOf(parsedInput));

              if (skipped.length > 0) {
                getParsingFlags(config).unusedInput.push(skipped);
              }

              string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
              totalParsedInputLength += parsedInput.length;
            } // don't parse if it's not a known token


            if (formatTokenFunctions[token]) {
              if (parsedInput) {
                getParsingFlags(config).empty = false;
              } else {
                getParsingFlags(config).unusedTokens.push(token);
              }

              addTimeToArrayFromToken(token, parsedInput, config);
            } else if (config._strict && !parsedInput) {
              getParsingFlags(config).unusedTokens.push(token);
            }
          } // add remaining unparsed input length to the string


          getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;

          if (string.length > 0) {
            getParsingFlags(config).unusedInput.push(string);
          } // clear _12h flag if hour is <= 12


          if (config._a[HOUR] <= 12 && getParsingFlags(config).bigHour === true && config._a[HOUR] > 0) {
            getParsingFlags(config).bigHour = undefined;
          }

          getParsingFlags(config).parsedDateParts = config._a.slice(0);
          getParsingFlags(config).meridiem = config._meridiem; // handle meridiem

          config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem); // handle era

          era = getParsingFlags(config).era;

          if (era !== null) {
            config._a[YEAR] = config._locale.erasConvertYear(era, config._a[YEAR]);
          }

          configFromArray(config);
          checkOverflow(config);
        }

        function meridiemFixWrap(locale, hour, meridiem) {
          var isPm;

          if (meridiem == null) {
            // nothing to do
            return hour;
          }

          if (locale.meridiemHour != null) {
            return locale.meridiemHour(hour, meridiem);
          } else if (locale.isPM != null) {
            // Fallback
            isPm = locale.isPM(meridiem);

            if (isPm && hour < 12) {
              hour += 12;
            }

            if (!isPm && hour === 12) {
              hour = 0;
            }

            return hour;
          } else {
            // this is not supposed to happen
            return hour;
          }
        } // date from string and array of format strings


        function configFromStringAndArray(config) {
          var tempConfig,
              bestMoment,
              scoreToBeat,
              i,
              currentScore,
              validFormatFound,
              bestFormatIsValid = false,
              configfLen = config._f.length;

          if (configfLen === 0) {
            getParsingFlags(config).invalidFormat = true;
            config._d = new Date(NaN);
            return;
          }

          for (i = 0; i < configfLen; i++) {
            currentScore = 0;
            validFormatFound = false;
            tempConfig = copyConfig({}, config);

            if (config._useUTC != null) {
              tempConfig._useUTC = config._useUTC;
            }

            tempConfig._f = config._f[i];
            configFromStringAndFormat(tempConfig);

            if (isValid(tempConfig)) {
              validFormatFound = true;
            } // if there is any input that was not parsed add a penalty for that format


            currentScore += getParsingFlags(tempConfig).charsLeftOver; //or tokens

            currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;
            getParsingFlags(tempConfig).score = currentScore;

            if (!bestFormatIsValid) {
              if (scoreToBeat == null || currentScore < scoreToBeat || validFormatFound) {
                scoreToBeat = currentScore;
                bestMoment = tempConfig;

                if (validFormatFound) {
                  bestFormatIsValid = true;
                }
              }
            } else {
              if (currentScore < scoreToBeat) {
                scoreToBeat = currentScore;
                bestMoment = tempConfig;
              }
            }
          }

          extend(config, bestMoment || tempConfig);
        }

        function configFromObject(config) {
          if (config._d) {
            return;
          }

          var i = normalizeObjectUnits(config._i),
              dayOrDate = i.day === undefined ? i.date : i.day;
          config._a = map([i.year, i.month, dayOrDate, i.hour, i.minute, i.second, i.millisecond], function (obj) {
            return obj && parseInt(obj, 10);
          });
          configFromArray(config);
        }

        function createFromConfig(config) {
          var res = new Moment(checkOverflow(prepareConfig(config)));

          if (res._nextDay) {
            // Adding is smart enough around DST
            res.add(1, 'd');
            res._nextDay = undefined;
          }

          return res;
        }

        function prepareConfig(config) {
          var input = config._i,
              format = config._f;
          config._locale = config._locale || getLocale(config._l);

          if (input === null || format === undefined && input === '') {
            return createInvalid({
              nullInput: true
            });
          }

          if (typeof input === 'string') {
            config._i = input = config._locale.preparse(input);
          }

          if (isMoment(input)) {
            return new Moment(checkOverflow(input));
          } else if (isDate(input)) {
            config._d = input;
          } else if (isArray(format)) {
            configFromStringAndArray(config);
          } else if (format) {
            configFromStringAndFormat(config);
          } else {
            configFromInput(config);
          }

          if (!isValid(config)) {
            config._d = null;
          }

          return config;
        }

        function configFromInput(config) {
          var input = config._i;

          if (isUndefined(input)) {
            config._d = new Date(hooks.now());
          } else if (isDate(input)) {
            config._d = new Date(input.valueOf());
          } else if (typeof input === 'string') {
            configFromString(config);
          } else if (isArray(input)) {
            config._a = map(input.slice(0), function (obj) {
              return parseInt(obj, 10);
            });
            configFromArray(config);
          } else if (isObject(input)) {
            configFromObject(config);
          } else if (isNumber(input)) {
            // from milliseconds
            config._d = new Date(input);
          } else {
            hooks.createFromInputFallback(config);
          }
        }

        function createLocalOrUTC(input, format, locale, strict, isUTC) {
          var c = {};

          if (format === true || format === false) {
            strict = format;
            format = undefined;
          }

          if (locale === true || locale === false) {
            strict = locale;
            locale = undefined;
          }

          if (isObject(input) && isObjectEmpty(input) || isArray(input) && input.length === 0) {
            input = undefined;
          } // object construction must be done this way.
          // https://github.com/moment/moment/issues/1423


          c._isAMomentObject = true;
          c._useUTC = c._isUTC = isUTC;
          c._l = locale;
          c._i = input;
          c._f = format;
          c._strict = strict;
          return createFromConfig(c);
        }

        function createLocal(input, format, locale, strict) {
          return createLocalOrUTC(input, format, locale, strict, false);
        }

        var prototypeMin = deprecate('moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/', function () {
          var other = createLocal.apply(null, arguments);

          if (this.isValid() && other.isValid()) {
            return other < this ? this : other;
          } else {
            return createInvalid();
          }
        }),
            prototypeMax = deprecate('moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/', function () {
          var other = createLocal.apply(null, arguments);

          if (this.isValid() && other.isValid()) {
            return other > this ? this : other;
          } else {
            return createInvalid();
          }
        }); // Pick a moment m from moments so that m[fn](other) is true for all
        // other. This relies on the function fn to be transitive.
        //
        // moments should either be an array of moment objects or an array, whose
        // first element is an array of moment objects.

        function pickBy(fn, moments) {
          var res, i;

          if (moments.length === 1 && isArray(moments[0])) {
            moments = moments[0];
          }

          if (!moments.length) {
            return createLocal();
          }

          res = moments[0];

          for (i = 1; i < moments.length; ++i) {
            if (!moments[i].isValid() || moments[i][fn](res)) {
              res = moments[i];
            }
          }

          return res;
        } // TODO: Use [].sort instead?


        function min() {
          var args = [].slice.call(arguments, 0);
          return pickBy('isBefore', args);
        }

        function max() {
          var args = [].slice.call(arguments, 0);
          return pickBy('isAfter', args);
        }

        var now = function now() {
          return Date.now ? Date.now() : +new Date();
        };

        var ordering = ['year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second', 'millisecond'];

        function isDurationValid(m) {
          var key,
              unitHasDecimal = false,
              i,
              orderLen = ordering.length;

          for (key in m) {
            if (hasOwnProp(m, key) && !(indexOf.call(ordering, key) !== -1 && (m[key] == null || !isNaN(m[key])))) {
              return false;
            }
          }

          for (i = 0; i < orderLen; ++i) {
            if (m[ordering[i]]) {
              if (unitHasDecimal) {
                return false; // only allow non-integers for smallest unit
              }

              if (parseFloat(m[ordering[i]]) !== toInt(m[ordering[i]])) {
                unitHasDecimal = true;
              }
            }
          }

          return true;
        }

        function isValid$1() {
          return this._isValid;
        }

        function createInvalid$1() {
          return createDuration(NaN);
        }

        function Duration(duration) {
          var normalizedInput = normalizeObjectUnits(duration),
              years = normalizedInput.year || 0,
              quarters = normalizedInput.quarter || 0,
              months = normalizedInput.month || 0,
              weeks = normalizedInput.week || normalizedInput.isoWeek || 0,
              days = normalizedInput.day || 0,
              hours = normalizedInput.hour || 0,
              minutes = normalizedInput.minute || 0,
              seconds = normalizedInput.second || 0,
              milliseconds = normalizedInput.millisecond || 0;
          this._isValid = isDurationValid(normalizedInput); // representation for dateAddRemove

          this._milliseconds = +milliseconds + seconds * 1e3 + // 1000
          minutes * 6e4 + // 1000 * 60
          hours * 1000 * 60 * 60; //using 1000 * 60 * 60 instead of 36e5 to avoid floating point rounding errors https://github.com/moment/moment/issues/2978
          // Because of dateAddRemove treats 24 hours as different from a
          // day when working around DST, we need to store them separately

          this._days = +days + weeks * 7; // It is impossible to translate months into days without knowing
          // which months you are are talking about, so we have to store
          // it separately.

          this._months = +months + quarters * 3 + years * 12;
          this._data = {};
          this._locale = getLocale();

          this._bubble();
        }

        function isDuration(obj) {
          return obj instanceof Duration;
        }

        function absRound(number) {
          if (number < 0) {
            return Math.round(-1 * number) * -1;
          } else {
            return Math.round(number);
          }
        } // compare two arrays, return the number of differences


        function compareArrays(array1, array2, dontConvert) {
          var len = Math.min(array1.length, array2.length),
              lengthDiff = Math.abs(array1.length - array2.length),
              diffs = 0,
              i;

          for (i = 0; i < len; i++) {
            if (dontConvert && array1[i] !== array2[i] || !dontConvert && toInt(array1[i]) !== toInt(array2[i])) {
              diffs++;
            }
          }

          return diffs + lengthDiff;
        } // FORMATTING


        function offset(token, separator) {
          addFormatToken(token, 0, 0, function () {
            var offset = this.utcOffset(),
                sign = '+';

            if (offset < 0) {
              offset = -offset;
              sign = '-';
            }

            return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~offset % 60, 2);
          });
        }

        offset('Z', ':');
        offset('ZZ', ''); // PARSING

        addRegexToken('Z', matchShortOffset);
        addRegexToken('ZZ', matchShortOffset);
        addParseToken(['Z', 'ZZ'], function (input, array, config) {
          config._useUTC = true;
          config._tzm = offsetFromString(matchShortOffset, input);
        }); // HELPERS
        // timezone chunker
        // '+10:00' > ['10',  '00']
        // '-1530'  > ['-15', '30']

        var chunkOffset = /([\+\-]|\d\d)/gi;

        function offsetFromString(matcher, string) {
          var matches = (string || '').match(matcher),
              chunk,
              parts,
              minutes;

          if (matches === null) {
            return null;
          }

          chunk = matches[matches.length - 1] || [];
          parts = (chunk + '').match(chunkOffset) || ['-', 0, 0];
          minutes = +(parts[1] * 60) + toInt(parts[2]);
          return minutes === 0 ? 0 : parts[0] === '+' ? minutes : -minutes;
        } // Return a moment from input, that is local/utc/zone equivalent to model.


        function cloneWithOffset(input, model) {
          var res, diff;

          if (model._isUTC) {
            res = model.clone();
            diff = (isMoment(input) || isDate(input) ? input.valueOf() : createLocal(input).valueOf()) - res.valueOf(); // Use low-level api, because this fn is low-level api.

            res._d.setTime(res._d.valueOf() + diff);

            hooks.updateOffset(res, false);
            return res;
          } else {
            return createLocal(input).local();
          }
        }

        function getDateOffset(m) {
          // On Firefox.24 Date#getTimezoneOffset returns a floating point.
          // https://github.com/moment/moment/pull/1871
          return -Math.round(m._d.getTimezoneOffset());
        } // HOOKS
        // This function will be called whenever a moment is mutated.
        // It is intended to keep the offset in sync with the timezone.


        hooks.updateOffset = function () {}; // MOMENTS
        // keepLocalTime = true means only change the timezone, without
        // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
        // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
        // +0200, so we adjust the time as needed, to be valid.
        //
        // Keeping the time actually adds/subtracts (one hour)
        // from the actual represented time. That is why we call updateOffset
        // a second time. In case it wants us to change the offset again
        // _changeInProgress == true case, then we have to adjust, because
        // there is no such time in the given timezone.


        function getSetOffset(input, keepLocalTime, keepMinutes) {
          var offset = this._offset || 0,
              localAdjust;

          if (!this.isValid()) {
            return input != null ? this : NaN;
          }

          if (input != null) {
            if (typeof input === 'string') {
              input = offsetFromString(matchShortOffset, input);

              if (input === null) {
                return this;
              }
            } else if (Math.abs(input) < 16 && !keepMinutes) {
              input = input * 60;
            }

            if (!this._isUTC && keepLocalTime) {
              localAdjust = getDateOffset(this);
            }

            this._offset = input;
            this._isUTC = true;

            if (localAdjust != null) {
              this.add(localAdjust, 'm');
            }

            if (offset !== input) {
              if (!keepLocalTime || this._changeInProgress) {
                addSubtract(this, createDuration(input - offset, 'm'), 1, false);
              } else if (!this._changeInProgress) {
                this._changeInProgress = true;
                hooks.updateOffset(this, true);
                this._changeInProgress = null;
              }
            }

            return this;
          } else {
            return this._isUTC ? offset : getDateOffset(this);
          }
        }

        function getSetZone(input, keepLocalTime) {
          if (input != null) {
            if (typeof input !== 'string') {
              input = -input;
            }

            this.utcOffset(input, keepLocalTime);
            return this;
          } else {
            return -this.utcOffset();
          }
        }

        function setOffsetToUTC(keepLocalTime) {
          return this.utcOffset(0, keepLocalTime);
        }

        function setOffsetToLocal(keepLocalTime) {
          if (this._isUTC) {
            this.utcOffset(0, keepLocalTime);
            this._isUTC = false;

            if (keepLocalTime) {
              this.subtract(getDateOffset(this), 'm');
            }
          }

          return this;
        }

        function setOffsetToParsedOffset() {
          if (this._tzm != null) {
            this.utcOffset(this._tzm, false, true);
          } else if (typeof this._i === 'string') {
            var tZone = offsetFromString(matchOffset, this._i);

            if (tZone != null) {
              this.utcOffset(tZone);
            } else {
              this.utcOffset(0, true);
            }
          }

          return this;
        }

        function hasAlignedHourOffset(input) {
          if (!this.isValid()) {
            return false;
          }

          input = input ? createLocal(input).utcOffset() : 0;
          return (this.utcOffset() - input) % 60 === 0;
        }

        function isDaylightSavingTime() {
          return this.utcOffset() > this.clone().month(0).utcOffset() || this.utcOffset() > this.clone().month(5).utcOffset();
        }

        function isDaylightSavingTimeShifted() {
          if (!isUndefined(this._isDSTShifted)) {
            return this._isDSTShifted;
          }

          var c = {},
              other;
          copyConfig(c, this);
          c = prepareConfig(c);

          if (c._a) {
            other = c._isUTC ? createUTC(c._a) : createLocal(c._a);
            this._isDSTShifted = this.isValid() && compareArrays(c._a, other.toArray()) > 0;
          } else {
            this._isDSTShifted = false;
          }

          return this._isDSTShifted;
        }

        function isLocal() {
          return this.isValid() ? !this._isUTC : false;
        }

        function isUtcOffset() {
          return this.isValid() ? this._isUTC : false;
        }

        function isUtc() {
          return this.isValid() ? this._isUTC && this._offset === 0 : false;
        } // ASP.NET json date format regex


        var aspNetRegex = /^(-|\+)?(?:(\d*)[. ])?(\d+):(\d+)(?::(\d+)(\.\d*)?)?$/,
            // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
        // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
        // and further modified to allow for strings containing both week and day
        isoRegex = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;

        function createDuration(input, key) {
          var duration = input,
              // matching against regexp is expensive, do it on demand
          match = null,
              sign,
              ret,
              diffRes;

          if (isDuration(input)) {
            duration = {
              ms: input._milliseconds,
              d: input._days,
              M: input._months
            };
          } else if (isNumber(input) || !isNaN(+input)) {
            duration = {};

            if (key) {
              duration[key] = +input;
            } else {
              duration.milliseconds = +input;
            }
          } else if (match = aspNetRegex.exec(input)) {
            sign = match[1] === '-' ? -1 : 1;
            duration = {
              y: 0,
              d: toInt(match[DATE]) * sign,
              h: toInt(match[HOUR]) * sign,
              m: toInt(match[MINUTE]) * sign,
              s: toInt(match[SECOND]) * sign,
              ms: toInt(absRound(match[MILLISECOND] * 1000)) * sign // the millisecond decimal point is included in the match

            };
          } else if (match = isoRegex.exec(input)) {
            sign = match[1] === '-' ? -1 : 1;
            duration = {
              y: parseIso(match[2], sign),
              M: parseIso(match[3], sign),
              w: parseIso(match[4], sign),
              d: parseIso(match[5], sign),
              h: parseIso(match[6], sign),
              m: parseIso(match[7], sign),
              s: parseIso(match[8], sign)
            };
          } else if (duration == null) {
            // checks for null or undefined
            duration = {};
          } else if (_typeof$1(duration) === 'object' && ('from' in duration || 'to' in duration)) {
            diffRes = momentsDifference(createLocal(duration.from), createLocal(duration.to));
            duration = {};
            duration.ms = diffRes.milliseconds;
            duration.M = diffRes.months;
          }

          ret = new Duration(duration);

          if (isDuration(input) && hasOwnProp(input, '_locale')) {
            ret._locale = input._locale;
          }

          if (isDuration(input) && hasOwnProp(input, '_isValid')) {
            ret._isValid = input._isValid;
          }

          return ret;
        }

        createDuration.fn = Duration.prototype;
        createDuration.invalid = createInvalid$1;

        function parseIso(inp, sign) {
          // We'd normally use ~~inp for this, but unfortunately it also
          // converts floats to ints.
          // inp may be undefined, so careful calling replace on it.
          var res = inp && parseFloat(inp.replace(',', '.')); // apply sign while we're at it

          return (isNaN(res) ? 0 : res) * sign;
        }

        function positiveMomentsDifference(base, other) {
          var res = {};
          res.months = other.month() - base.month() + (other.year() - base.year()) * 12;

          if (base.clone().add(res.months, 'M').isAfter(other)) {
            --res.months;
          }

          res.milliseconds = +other - +base.clone().add(res.months, 'M');
          return res;
        }

        function momentsDifference(base, other) {
          var res;

          if (!(base.isValid() && other.isValid())) {
            return {
              milliseconds: 0,
              months: 0
            };
          }

          other = cloneWithOffset(other, base);

          if (base.isBefore(other)) {
            res = positiveMomentsDifference(base, other);
          } else {
            res = positiveMomentsDifference(other, base);
            res.milliseconds = -res.milliseconds;
            res.months = -res.months;
          }

          return res;
        } // TODO: remove 'name' arg after deprecation is removed


        function createAdder(direction, name) {
          return function (val, period) {
            var dur, tmp; //invert the arguments, but complain about it

            if (period !== null && !isNaN(+period)) {
              deprecateSimple(name, 'moment().' + name + '(period, number) is deprecated. Please use moment().' + name + '(number, period). ' + 'See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.');
              tmp = val;
              val = period;
              period = tmp;
            }

            dur = createDuration(val, period);
            addSubtract(this, dur, direction);
            return this;
          };
        }

        function addSubtract(mom, duration, isAdding, updateOffset) {
          var milliseconds = duration._milliseconds,
              days = absRound(duration._days),
              months = absRound(duration._months);

          if (!mom.isValid()) {
            // No op
            return;
          }

          updateOffset = updateOffset == null ? true : updateOffset;

          if (months) {
            setMonth(mom, get(mom, 'Month') + months * isAdding);
          }

          if (days) {
            set$1(mom, 'Date', get(mom, 'Date') + days * isAdding);
          }

          if (milliseconds) {
            mom._d.setTime(mom._d.valueOf() + milliseconds * isAdding);
          }

          if (updateOffset) {
            hooks.updateOffset(mom, days || months);
          }
        }

        var add = createAdder(1, 'add'),
            subtract = createAdder(-1, 'subtract');

        function isString(input) {
          return typeof input === 'string' || input instanceof String;
        } // type MomentInput = Moment | Date | string | number | (number | string)[] | MomentInputObject | void; // null | undefined


        function isMomentInput(input) {
          return isMoment(input) || isDate(input) || isString(input) || isNumber(input) || isNumberOrStringArray(input) || isMomentInputObject(input) || input === null || input === undefined;
        }

        function isMomentInputObject(input) {
          var objectTest = isObject(input) && !isObjectEmpty(input),
              propertyTest = false,
              properties = ['years', 'year', 'y', 'months', 'month', 'M', 'days', 'day', 'd', 'dates', 'date', 'D', 'hours', 'hour', 'h', 'minutes', 'minute', 'm', 'seconds', 'second', 's', 'milliseconds', 'millisecond', 'ms'],
              i,
              property,
              propertyLen = properties.length;

          for (i = 0; i < propertyLen; i += 1) {
            property = properties[i];
            propertyTest = propertyTest || hasOwnProp(input, property);
          }

          return objectTest && propertyTest;
        }

        function isNumberOrStringArray(input) {
          var arrayTest = isArray(input),
              dataTypeTest = false;

          if (arrayTest) {
            dataTypeTest = input.filter(function (item) {
              return !isNumber(item) && isString(input);
            }).length === 0;
          }

          return arrayTest && dataTypeTest;
        }

        function isCalendarSpec(input) {
          var objectTest = isObject(input) && !isObjectEmpty(input),
              propertyTest = false,
              properties = ['sameDay', 'nextDay', 'lastDay', 'nextWeek', 'lastWeek', 'sameElse'],
              i,
              property;

          for (i = 0; i < properties.length; i += 1) {
            property = properties[i];
            propertyTest = propertyTest || hasOwnProp(input, property);
          }

          return objectTest && propertyTest;
        }

        function getCalendarFormat(myMoment, now) {
          var diff = myMoment.diff(now, 'days', true);
          return diff < -6 ? 'sameElse' : diff < -1 ? 'lastWeek' : diff < 0 ? 'lastDay' : diff < 1 ? 'sameDay' : diff < 2 ? 'nextDay' : diff < 7 ? 'nextWeek' : 'sameElse';
        }

        function calendar$1(time, formats) {
          // Support for single parameter, formats only overload to the calendar function
          if (arguments.length === 1) {
            if (!arguments[0]) {
              time = undefined;
              formats = undefined;
            } else if (isMomentInput(arguments[0])) {
              time = arguments[0];
              formats = undefined;
            } else if (isCalendarSpec(arguments[0])) {
              formats = arguments[0];
              time = undefined;
            }
          } // We want to compare the start of today, vs this.
          // Getting start-of-today depends on whether we're local/utc/offset or not.


          var now = time || createLocal(),
              sod = cloneWithOffset(now, this).startOf('day'),
              format = hooks.calendarFormat(this, sod) || 'sameElse',
              output = formats && (isFunction(formats[format]) ? formats[format].call(this, now) : formats[format]);
          return this.format(output || this.localeData().calendar(format, this, createLocal(now)));
        }

        function clone() {
          return new Moment(this);
        }

        function isAfter(input, units) {
          var localInput = isMoment(input) ? input : createLocal(input);

          if (!(this.isValid() && localInput.isValid())) {
            return false;
          }

          units = normalizeUnits(units) || 'millisecond';

          if (units === 'millisecond') {
            return this.valueOf() > localInput.valueOf();
          } else {
            return localInput.valueOf() < this.clone().startOf(units).valueOf();
          }
        }

        function isBefore(input, units) {
          var localInput = isMoment(input) ? input : createLocal(input);

          if (!(this.isValid() && localInput.isValid())) {
            return false;
          }

          units = normalizeUnits(units) || 'millisecond';

          if (units === 'millisecond') {
            return this.valueOf() < localInput.valueOf();
          } else {
            return this.clone().endOf(units).valueOf() < localInput.valueOf();
          }
        }

        function isBetween(from, to, units, inclusivity) {
          var localFrom = isMoment(from) ? from : createLocal(from),
              localTo = isMoment(to) ? to : createLocal(to);

          if (!(this.isValid() && localFrom.isValid() && localTo.isValid())) {
            return false;
          }

          inclusivity = inclusivity || '()';
          return (inclusivity[0] === '(' ? this.isAfter(localFrom, units) : !this.isBefore(localFrom, units)) && (inclusivity[1] === ')' ? this.isBefore(localTo, units) : !this.isAfter(localTo, units));
        }

        function isSame(input, units) {
          var localInput = isMoment(input) ? input : createLocal(input),
              inputMs;

          if (!(this.isValid() && localInput.isValid())) {
            return false;
          }

          units = normalizeUnits(units) || 'millisecond';

          if (units === 'millisecond') {
            return this.valueOf() === localInput.valueOf();
          } else {
            inputMs = localInput.valueOf();
            return this.clone().startOf(units).valueOf() <= inputMs && inputMs <= this.clone().endOf(units).valueOf();
          }
        }

        function isSameOrAfter(input, units) {
          return this.isSame(input, units) || this.isAfter(input, units);
        }

        function isSameOrBefore(input, units) {
          return this.isSame(input, units) || this.isBefore(input, units);
        }

        function diff(input, units, asFloat) {
          var that, zoneDelta, output;

          if (!this.isValid()) {
            return NaN;
          }

          that = cloneWithOffset(input, this);

          if (!that.isValid()) {
            return NaN;
          }

          zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;
          units = normalizeUnits(units);

          switch (units) {
            case 'year':
              output = monthDiff(this, that) / 12;
              break;

            case 'month':
              output = monthDiff(this, that);
              break;

            case 'quarter':
              output = monthDiff(this, that) / 3;
              break;

            case 'second':
              output = (this - that) / 1e3;
              break;
            // 1000

            case 'minute':
              output = (this - that) / 6e4;
              break;
            // 1000 * 60

            case 'hour':
              output = (this - that) / 36e5;
              break;
            // 1000 * 60 * 60

            case 'day':
              output = (this - that - zoneDelta) / 864e5;
              break;
            // 1000 * 60 * 60 * 24, negate dst

            case 'week':
              output = (this - that - zoneDelta) / 6048e5;
              break;
            // 1000 * 60 * 60 * 24 * 7, negate dst

            default:
              output = this - that;
          }

          return asFloat ? output : absFloor(output);
        }

        function monthDiff(a, b) {
          if (a.date() < b.date()) {
            // end-of-month calculations work correct when the start month has more
            // days than the end month.
            return -monthDiff(b, a);
          } // difference in months


          var wholeMonthDiff = (b.year() - a.year()) * 12 + (b.month() - a.month()),
              // b is in (anchor - 1 month, anchor + 1 month)
          anchor = a.clone().add(wholeMonthDiff, 'months'),
              anchor2,
              adjust;

          if (b - anchor < 0) {
            anchor2 = a.clone().add(wholeMonthDiff - 1, 'months'); // linear across the month

            adjust = (b - anchor) / (anchor - anchor2);
          } else {
            anchor2 = a.clone().add(wholeMonthDiff + 1, 'months'); // linear across the month

            adjust = (b - anchor) / (anchor2 - anchor);
          } //check for negative zero, return zero if negative zero


          return -(wholeMonthDiff + adjust) || 0;
        }

        hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';
        hooks.defaultFormatUtc = 'YYYY-MM-DDTHH:mm:ss[Z]';

        function toString() {
          return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
        }

        function toISOString(keepOffset) {
          if (!this.isValid()) {
            return null;
          }

          var utc = keepOffset !== true,
              m = utc ? this.clone().utc() : this;

          if (m.year() < 0 || m.year() > 9999) {
            return formatMoment(m, utc ? 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]' : 'YYYYYY-MM-DD[T]HH:mm:ss.SSSZ');
          }

          if (isFunction(Date.prototype.toISOString)) {
            // native implementation is ~50x faster, use it when we can
            if (utc) {
              return this.toDate().toISOString();
            } else {
              return new Date(this.valueOf() + this.utcOffset() * 60 * 1000).toISOString().replace('Z', formatMoment(m, 'Z'));
            }
          }

          return formatMoment(m, utc ? 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]' : 'YYYY-MM-DD[T]HH:mm:ss.SSSZ');
        }
        /**
         * Return a human readable representation of a moment that can
         * also be evaluated to get a new moment which is the same
         *
         * @link https://nodejs.org/dist/latest/docs/api/util.html#util_custom_inspect_function_on_objects
         */


        function inspect() {
          if (!this.isValid()) {
            return 'moment.invalid(/* ' + this._i + ' */)';
          }

          var func = 'moment',
              zone = '',
              prefix,
              year,
              datetime,
              suffix;

          if (!this.isLocal()) {
            func = this.utcOffset() === 0 ? 'moment.utc' : 'moment.parseZone';
            zone = 'Z';
          }

          prefix = '[' + func + '("]';
          year = 0 <= this.year() && this.year() <= 9999 ? 'YYYY' : 'YYYYYY';
          datetime = '-MM-DD[T]HH:mm:ss.SSS';
          suffix = zone + '[")]';
          return this.format(prefix + year + datetime + suffix);
        }

        function format(inputString) {
          if (!inputString) {
            inputString = this.isUtc() ? hooks.defaultFormatUtc : hooks.defaultFormat;
          }

          var output = formatMoment(this, inputString);
          return this.localeData().postformat(output);
        }

        function from(time, withoutSuffix) {
          if (this.isValid() && (isMoment(time) && time.isValid() || createLocal(time).isValid())) {
            return createDuration({
              to: this,
              from: time
            }).locale(this.locale()).humanize(!withoutSuffix);
          } else {
            return this.localeData().invalidDate();
          }
        }

        function fromNow(withoutSuffix) {
          return this.from(createLocal(), withoutSuffix);
        }

        function to(time, withoutSuffix) {
          if (this.isValid() && (isMoment(time) && time.isValid() || createLocal(time).isValid())) {
            return createDuration({
              from: this,
              to: time
            }).locale(this.locale()).humanize(!withoutSuffix);
          } else {
            return this.localeData().invalidDate();
          }
        }

        function toNow(withoutSuffix) {
          return this.to(createLocal(), withoutSuffix);
        } // If passed a locale key, it will set the locale for this
        // instance.  Otherwise, it will return the locale configuration
        // variables for this instance.


        function locale(key) {
          var newLocaleData;

          if (key === undefined) {
            return this._locale._abbr;
          } else {
            newLocaleData = getLocale(key);

            if (newLocaleData != null) {
              this._locale = newLocaleData;
            }

            return this;
          }
        }

        var lang = deprecate('moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.', function (key) {
          if (key === undefined) {
            return this.localeData();
          } else {
            return this.locale(key);
          }
        });

        function localeData() {
          return this._locale;
        }

        var MS_PER_SECOND = 1000,
            MS_PER_MINUTE = 60 * MS_PER_SECOND,
            MS_PER_HOUR = 60 * MS_PER_MINUTE,
            MS_PER_400_YEARS = (365 * 400 + 97) * 24 * MS_PER_HOUR; // actual modulo - handles negative numbers (for dates before 1970):

        function mod$1(dividend, divisor) {
          return (dividend % divisor + divisor) % divisor;
        }

        function localStartOfDate(y, m, d) {
          // the date constructor remaps years 0-99 to 1900-1999
          if (y < 100 && y >= 0) {
            // preserve leap years using a full 400 year cycle, then reset
            return new Date(y + 400, m, d) - MS_PER_400_YEARS;
          } else {
            return new Date(y, m, d).valueOf();
          }
        }

        function utcStartOfDate(y, m, d) {
          // Date.UTC remaps years 0-99 to 1900-1999
          if (y < 100 && y >= 0) {
            // preserve leap years using a full 400 year cycle, then reset
            return Date.UTC(y + 400, m, d) - MS_PER_400_YEARS;
          } else {
            return Date.UTC(y, m, d);
          }
        }

        function startOf(units) {
          var time, startOfDate;
          units = normalizeUnits(units);

          if (units === undefined || units === 'millisecond' || !this.isValid()) {
            return this;
          }

          startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;

          switch (units) {
            case 'year':
              time = startOfDate(this.year(), 0, 1);
              break;

            case 'quarter':
              time = startOfDate(this.year(), this.month() - this.month() % 3, 1);
              break;

            case 'month':
              time = startOfDate(this.year(), this.month(), 1);
              break;

            case 'week':
              time = startOfDate(this.year(), this.month(), this.date() - this.weekday());
              break;

            case 'isoWeek':
              time = startOfDate(this.year(), this.month(), this.date() - (this.isoWeekday() - 1));
              break;

            case 'day':
            case 'date':
              time = startOfDate(this.year(), this.month(), this.date());
              break;

            case 'hour':
              time = this._d.valueOf();
              time -= mod$1(time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE), MS_PER_HOUR);
              break;

            case 'minute':
              time = this._d.valueOf();
              time -= mod$1(time, MS_PER_MINUTE);
              break;

            case 'second':
              time = this._d.valueOf();
              time -= mod$1(time, MS_PER_SECOND);
              break;
          }

          this._d.setTime(time);

          hooks.updateOffset(this, true);
          return this;
        }

        function endOf(units) {
          var time, startOfDate;
          units = normalizeUnits(units);

          if (units === undefined || units === 'millisecond' || !this.isValid()) {
            return this;
          }

          startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;

          switch (units) {
            case 'year':
              time = startOfDate(this.year() + 1, 0, 1) - 1;
              break;

            case 'quarter':
              time = startOfDate(this.year(), this.month() - this.month() % 3 + 3, 1) - 1;
              break;

            case 'month':
              time = startOfDate(this.year(), this.month() + 1, 1) - 1;
              break;

            case 'week':
              time = startOfDate(this.year(), this.month(), this.date() - this.weekday() + 7) - 1;
              break;

            case 'isoWeek':
              time = startOfDate(this.year(), this.month(), this.date() - (this.isoWeekday() - 1) + 7) - 1;
              break;

            case 'day':
            case 'date':
              time = startOfDate(this.year(), this.month(), this.date() + 1) - 1;
              break;

            case 'hour':
              time = this._d.valueOf();
              time += MS_PER_HOUR - mod$1(time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE), MS_PER_HOUR) - 1;
              break;

            case 'minute':
              time = this._d.valueOf();
              time += MS_PER_MINUTE - mod$1(time, MS_PER_MINUTE) - 1;
              break;

            case 'second':
              time = this._d.valueOf();
              time += MS_PER_SECOND - mod$1(time, MS_PER_SECOND) - 1;
              break;
          }

          this._d.setTime(time);

          hooks.updateOffset(this, true);
          return this;
        }

        function valueOf() {
          return this._d.valueOf() - (this._offset || 0) * 60000;
        }

        function unix() {
          return Math.floor(this.valueOf() / 1000);
        }

        function toDate() {
          return new Date(this.valueOf());
        }

        function toArray() {
          var m = this;
          return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
        }

        function toObject() {
          var m = this;
          return {
            years: m.year(),
            months: m.month(),
            date: m.date(),
            hours: m.hours(),
            minutes: m.minutes(),
            seconds: m.seconds(),
            milliseconds: m.milliseconds()
          };
        }

        function toJSON() {
          // new Date(NaN).toJSON() === null
          return this.isValid() ? this.toISOString() : null;
        }

        function isValid$2() {
          return isValid(this);
        }

        function parsingFlags() {
          return extend({}, getParsingFlags(this));
        }

        function invalidAt() {
          return getParsingFlags(this).overflow;
        }

        function creationData() {
          return {
            input: this._i,
            format: this._f,
            locale: this._locale,
            isUTC: this._isUTC,
            strict: this._strict
          };
        }

        addFormatToken('N', 0, 0, 'eraAbbr');
        addFormatToken('NN', 0, 0, 'eraAbbr');
        addFormatToken('NNN', 0, 0, 'eraAbbr');
        addFormatToken('NNNN', 0, 0, 'eraName');
        addFormatToken('NNNNN', 0, 0, 'eraNarrow');
        addFormatToken('y', ['y', 1], 'yo', 'eraYear');
        addFormatToken('y', ['yy', 2], 0, 'eraYear');
        addFormatToken('y', ['yyy', 3], 0, 'eraYear');
        addFormatToken('y', ['yyyy', 4], 0, 'eraYear');
        addRegexToken('N', matchEraAbbr);
        addRegexToken('NN', matchEraAbbr);
        addRegexToken('NNN', matchEraAbbr);
        addRegexToken('NNNN', matchEraName);
        addRegexToken('NNNNN', matchEraNarrow);
        addParseToken(['N', 'NN', 'NNN', 'NNNN', 'NNNNN'], function (input, array, config, token) {
          var era = config._locale.erasParse(input, token, config._strict);

          if (era) {
            getParsingFlags(config).era = era;
          } else {
            getParsingFlags(config).invalidEra = input;
          }
        });
        addRegexToken('y', matchUnsigned);
        addRegexToken('yy', matchUnsigned);
        addRegexToken('yyy', matchUnsigned);
        addRegexToken('yyyy', matchUnsigned);
        addRegexToken('yo', matchEraYearOrdinal);
        addParseToken(['y', 'yy', 'yyy', 'yyyy'], YEAR);
        addParseToken(['yo'], function (input, array, config, token) {
          var match;

          if (config._locale._eraYearOrdinalRegex) {
            match = input.match(config._locale._eraYearOrdinalRegex);
          }

          if (config._locale.eraYearOrdinalParse) {
            array[YEAR] = config._locale.eraYearOrdinalParse(input, match);
          } else {
            array[YEAR] = parseInt(input, 10);
          }
        });

        function localeEras(m, format) {
          var i,
              l,
              date,
              eras = this._eras || getLocale('en')._eras;

          for (i = 0, l = eras.length; i < l; ++i) {
            switch (_typeof$1(eras[i].since)) {
              case 'string':
                // truncate time
                date = hooks(eras[i].since).startOf('day');
                eras[i].since = date.valueOf();
                break;
            }

            switch (_typeof$1(eras[i].until)) {
              case 'undefined':
                eras[i].until = +Infinity;
                break;

              case 'string':
                // truncate time
                date = hooks(eras[i].until).startOf('day').valueOf();
                eras[i].until = date.valueOf();
                break;
            }
          }

          return eras;
        }

        function localeErasParse(eraName, format, strict) {
          var i,
              l,
              eras = this.eras(),
              name,
              abbr,
              narrow;
          eraName = eraName.toUpperCase();

          for (i = 0, l = eras.length; i < l; ++i) {
            name = eras[i].name.toUpperCase();
            abbr = eras[i].abbr.toUpperCase();
            narrow = eras[i].narrow.toUpperCase();

            if (strict) {
              switch (format) {
                case 'N':
                case 'NN':
                case 'NNN':
                  if (abbr === eraName) {
                    return eras[i];
                  }

                  break;

                case 'NNNN':
                  if (name === eraName) {
                    return eras[i];
                  }

                  break;

                case 'NNNNN':
                  if (narrow === eraName) {
                    return eras[i];
                  }

                  break;
              }
            } else if ([name, abbr, narrow].indexOf(eraName) >= 0) {
              return eras[i];
            }
          }
        }

        function localeErasConvertYear(era, year) {
          var dir = era.since <= era.until ? +1 : -1;

          if (year === undefined) {
            return hooks(era.since).year();
          } else {
            return hooks(era.since).year() + (year - era.offset) * dir;
          }
        }

        function getEraName() {
          var i,
              l,
              val,
              eras = this.localeData().eras();

          for (i = 0, l = eras.length; i < l; ++i) {
            // truncate time
            val = this.clone().startOf('day').valueOf();

            if (eras[i].since <= val && val <= eras[i].until) {
              return eras[i].name;
            }

            if (eras[i].until <= val && val <= eras[i].since) {
              return eras[i].name;
            }
          }

          return '';
        }

        function getEraNarrow() {
          var i,
              l,
              val,
              eras = this.localeData().eras();

          for (i = 0, l = eras.length; i < l; ++i) {
            // truncate time
            val = this.clone().startOf('day').valueOf();

            if (eras[i].since <= val && val <= eras[i].until) {
              return eras[i].narrow;
            }

            if (eras[i].until <= val && val <= eras[i].since) {
              return eras[i].narrow;
            }
          }

          return '';
        }

        function getEraAbbr() {
          var i,
              l,
              val,
              eras = this.localeData().eras();

          for (i = 0, l = eras.length; i < l; ++i) {
            // truncate time
            val = this.clone().startOf('day').valueOf();

            if (eras[i].since <= val && val <= eras[i].until) {
              return eras[i].abbr;
            }

            if (eras[i].until <= val && val <= eras[i].since) {
              return eras[i].abbr;
            }
          }

          return '';
        }

        function getEraYear() {
          var i,
              l,
              dir,
              val,
              eras = this.localeData().eras();

          for (i = 0, l = eras.length; i < l; ++i) {
            dir = eras[i].since <= eras[i].until ? +1 : -1; // truncate time

            val = this.clone().startOf('day').valueOf();

            if (eras[i].since <= val && val <= eras[i].until || eras[i].until <= val && val <= eras[i].since) {
              return (this.year() - hooks(eras[i].since).year()) * dir + eras[i].offset;
            }
          }

          return this.year();
        }

        function erasNameRegex(isStrict) {
          if (!hasOwnProp(this, '_erasNameRegex')) {
            computeErasParse.call(this);
          }

          return isStrict ? this._erasNameRegex : this._erasRegex;
        }

        function erasAbbrRegex(isStrict) {
          if (!hasOwnProp(this, '_erasAbbrRegex')) {
            computeErasParse.call(this);
          }

          return isStrict ? this._erasAbbrRegex : this._erasRegex;
        }

        function erasNarrowRegex(isStrict) {
          if (!hasOwnProp(this, '_erasNarrowRegex')) {
            computeErasParse.call(this);
          }

          return isStrict ? this._erasNarrowRegex : this._erasRegex;
        }

        function matchEraAbbr(isStrict, locale) {
          return locale.erasAbbrRegex(isStrict);
        }

        function matchEraName(isStrict, locale) {
          return locale.erasNameRegex(isStrict);
        }

        function matchEraNarrow(isStrict, locale) {
          return locale.erasNarrowRegex(isStrict);
        }

        function matchEraYearOrdinal(isStrict, locale) {
          return locale._eraYearOrdinalRegex || matchUnsigned;
        }

        function computeErasParse() {
          var abbrPieces = [],
              namePieces = [],
              narrowPieces = [],
              mixedPieces = [],
              i,
              l,
              eras = this.eras();

          for (i = 0, l = eras.length; i < l; ++i) {
            namePieces.push(regexEscape(eras[i].name));
            abbrPieces.push(regexEscape(eras[i].abbr));
            narrowPieces.push(regexEscape(eras[i].narrow));
            mixedPieces.push(regexEscape(eras[i].name));
            mixedPieces.push(regexEscape(eras[i].abbr));
            mixedPieces.push(regexEscape(eras[i].narrow));
          }

          this._erasRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
          this._erasNameRegex = new RegExp('^(' + namePieces.join('|') + ')', 'i');
          this._erasAbbrRegex = new RegExp('^(' + abbrPieces.join('|') + ')', 'i');
          this._erasNarrowRegex = new RegExp('^(' + narrowPieces.join('|') + ')', 'i');
        } // FORMATTING


        addFormatToken(0, ['gg', 2], 0, function () {
          return this.weekYear() % 100;
        });
        addFormatToken(0, ['GG', 2], 0, function () {
          return this.isoWeekYear() % 100;
        });

        function addWeekYearFormatToken(token, getter) {
          addFormatToken(0, [token, token.length], 0, getter);
        }

        addWeekYearFormatToken('gggg', 'weekYear');
        addWeekYearFormatToken('ggggg', 'weekYear');
        addWeekYearFormatToken('GGGG', 'isoWeekYear');
        addWeekYearFormatToken('GGGGG', 'isoWeekYear'); // ALIASES

        addUnitAlias('weekYear', 'gg');
        addUnitAlias('isoWeekYear', 'GG'); // PRIORITY

        addUnitPriority('weekYear', 1);
        addUnitPriority('isoWeekYear', 1); // PARSING

        addRegexToken('G', matchSigned);
        addRegexToken('g', matchSigned);
        addRegexToken('GG', match1to2, match2);
        addRegexToken('gg', match1to2, match2);
        addRegexToken('GGGG', match1to4, match4);
        addRegexToken('gggg', match1to4, match4);
        addRegexToken('GGGGG', match1to6, match6);
        addRegexToken('ggggg', match1to6, match6);
        addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (input, week, config, token) {
          week[token.substr(0, 2)] = toInt(input);
        });
        addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
          week[token] = hooks.parseTwoDigitYear(input);
        }); // MOMENTS

        function getSetWeekYear(input) {
          return getSetWeekYearHelper.call(this, input, this.week(), this.weekday(), this.localeData()._week.dow, this.localeData()._week.doy);
        }

        function getSetISOWeekYear(input) {
          return getSetWeekYearHelper.call(this, input, this.isoWeek(), this.isoWeekday(), 1, 4);
        }

        function getISOWeeksInYear() {
          return weeksInYear(this.year(), 1, 4);
        }

        function getISOWeeksInISOWeekYear() {
          return weeksInYear(this.isoWeekYear(), 1, 4);
        }

        function getWeeksInYear() {
          var weekInfo = this.localeData()._week;

          return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
        }

        function getWeeksInWeekYear() {
          var weekInfo = this.localeData()._week;

          return weeksInYear(this.weekYear(), weekInfo.dow, weekInfo.doy);
        }

        function getSetWeekYearHelper(input, week, weekday, dow, doy) {
          var weeksTarget;

          if (input == null) {
            return weekOfYear(this, dow, doy).year;
          } else {
            weeksTarget = weeksInYear(input, dow, doy);

            if (week > weeksTarget) {
              week = weeksTarget;
            }

            return setWeekAll.call(this, input, week, weekday, dow, doy);
          }
        }

        function setWeekAll(weekYear, week, weekday, dow, doy) {
          var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy),
              date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);
          this.year(date.getUTCFullYear());
          this.month(date.getUTCMonth());
          this.date(date.getUTCDate());
          return this;
        } // FORMATTING


        addFormatToken('Q', 0, 'Qo', 'quarter'); // ALIASES

        addUnitAlias('quarter', 'Q'); // PRIORITY

        addUnitPriority('quarter', 7); // PARSING

        addRegexToken('Q', match1);
        addParseToken('Q', function (input, array) {
          array[MONTH] = (toInt(input) - 1) * 3;
        }); // MOMENTS

        function getSetQuarter(input) {
          return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
        } // FORMATTING


        addFormatToken('D', ['DD', 2], 'Do', 'date'); // ALIASES

        addUnitAlias('date', 'D'); // PRIORITY

        addUnitPriority('date', 9); // PARSING

        addRegexToken('D', match1to2);
        addRegexToken('DD', match1to2, match2);
        addRegexToken('Do', function (isStrict, locale) {
          // TODO: Remove "ordinalParse" fallback in next major release.
          return isStrict ? locale._dayOfMonthOrdinalParse || locale._ordinalParse : locale._dayOfMonthOrdinalParseLenient;
        });
        addParseToken(['D', 'DD'], DATE);
        addParseToken('Do', function (input, array) {
          array[DATE] = toInt(input.match(match1to2)[0]);
        }); // MOMENTS

        var getSetDayOfMonth = makeGetSet('Date', true); // FORMATTING

        addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear'); // ALIASES

        addUnitAlias('dayOfYear', 'DDD'); // PRIORITY

        addUnitPriority('dayOfYear', 4); // PARSING

        addRegexToken('DDD', match1to3);
        addRegexToken('DDDD', match3);
        addParseToken(['DDD', 'DDDD'], function (input, array, config) {
          config._dayOfYear = toInt(input);
        }); // HELPERS
        // MOMENTS

        function getSetDayOfYear(input) {
          var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
          return input == null ? dayOfYear : this.add(input - dayOfYear, 'd');
        } // FORMATTING


        addFormatToken('m', ['mm', 2], 0, 'minute'); // ALIASES

        addUnitAlias('minute', 'm'); // PRIORITY

        addUnitPriority('minute', 14); // PARSING

        addRegexToken('m', match1to2);
        addRegexToken('mm', match1to2, match2);
        addParseToken(['m', 'mm'], MINUTE); // MOMENTS

        var getSetMinute = makeGetSet('Minutes', false); // FORMATTING

        addFormatToken('s', ['ss', 2], 0, 'second'); // ALIASES

        addUnitAlias('second', 's'); // PRIORITY

        addUnitPriority('second', 15); // PARSING

        addRegexToken('s', match1to2);
        addRegexToken('ss', match1to2, match2);
        addParseToken(['s', 'ss'], SECOND); // MOMENTS

        var getSetSecond = makeGetSet('Seconds', false); // FORMATTING

        addFormatToken('S', 0, 0, function () {
          return ~~(this.millisecond() / 100);
        });
        addFormatToken(0, ['SS', 2], 0, function () {
          return ~~(this.millisecond() / 10);
        });
        addFormatToken(0, ['SSS', 3], 0, 'millisecond');
        addFormatToken(0, ['SSSS', 4], 0, function () {
          return this.millisecond() * 10;
        });
        addFormatToken(0, ['SSSSS', 5], 0, function () {
          return this.millisecond() * 100;
        });
        addFormatToken(0, ['SSSSSS', 6], 0, function () {
          return this.millisecond() * 1000;
        });
        addFormatToken(0, ['SSSSSSS', 7], 0, function () {
          return this.millisecond() * 10000;
        });
        addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
          return this.millisecond() * 100000;
        });
        addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
          return this.millisecond() * 1000000;
        }); // ALIASES

        addUnitAlias('millisecond', 'ms'); // PRIORITY

        addUnitPriority('millisecond', 16); // PARSING

        addRegexToken('S', match1to3, match1);
        addRegexToken('SS', match1to3, match2);
        addRegexToken('SSS', match1to3, match3);
        var token, getSetMillisecond;

        for (token = 'SSSS'; token.length <= 9; token += 'S') {
          addRegexToken(token, matchUnsigned);
        }

        function parseMs(input, array) {
          array[MILLISECOND] = toInt(('0.' + input) * 1000);
        }

        for (token = 'S'; token.length <= 9; token += 'S') {
          addParseToken(token, parseMs);
        }

        getSetMillisecond = makeGetSet('Milliseconds', false); // FORMATTING

        addFormatToken('z', 0, 0, 'zoneAbbr');
        addFormatToken('zz', 0, 0, 'zoneName'); // MOMENTS

        function getZoneAbbr() {
          return this._isUTC ? 'UTC' : '';
        }

        function getZoneName() {
          return this._isUTC ? 'Coordinated Universal Time' : '';
        }

        var proto = Moment.prototype;
        proto.add = add;
        proto.calendar = calendar$1;
        proto.clone = clone;
        proto.diff = diff;
        proto.endOf = endOf;
        proto.format = format;
        proto.from = from;
        proto.fromNow = fromNow;
        proto.to = to;
        proto.toNow = toNow;
        proto.get = stringGet;
        proto.invalidAt = invalidAt;
        proto.isAfter = isAfter;
        proto.isBefore = isBefore;
        proto.isBetween = isBetween;
        proto.isSame = isSame;
        proto.isSameOrAfter = isSameOrAfter;
        proto.isSameOrBefore = isSameOrBefore;
        proto.isValid = isValid$2;
        proto.lang = lang;
        proto.locale = locale;
        proto.localeData = localeData;
        proto.max = prototypeMax;
        proto.min = prototypeMin;
        proto.parsingFlags = parsingFlags;
        proto.set = stringSet;
        proto.startOf = startOf;
        proto.subtract = subtract;
        proto.toArray = toArray;
        proto.toObject = toObject;
        proto.toDate = toDate;
        proto.toISOString = toISOString;
        proto.inspect = inspect;

        if (typeof Symbol !== 'undefined' && Symbol.for != null) {
          proto[Symbol.for('nodejs.util.inspect.custom')] = function () {
            return 'Moment<' + this.format() + '>';
          };
        }

        proto.toJSON = toJSON;
        proto.toString = toString;
        proto.unix = unix;
        proto.valueOf = valueOf;
        proto.creationData = creationData;
        proto.eraName = getEraName;
        proto.eraNarrow = getEraNarrow;
        proto.eraAbbr = getEraAbbr;
        proto.eraYear = getEraYear;
        proto.year = getSetYear;
        proto.isLeapYear = getIsLeapYear;
        proto.weekYear = getSetWeekYear;
        proto.isoWeekYear = getSetISOWeekYear;
        proto.quarter = proto.quarters = getSetQuarter;
        proto.month = getSetMonth;
        proto.daysInMonth = getDaysInMonth;
        proto.week = proto.weeks = getSetWeek;
        proto.isoWeek = proto.isoWeeks = getSetISOWeek;
        proto.weeksInYear = getWeeksInYear;
        proto.weeksInWeekYear = getWeeksInWeekYear;
        proto.isoWeeksInYear = getISOWeeksInYear;
        proto.isoWeeksInISOWeekYear = getISOWeeksInISOWeekYear;
        proto.date = getSetDayOfMonth;
        proto.day = proto.days = getSetDayOfWeek;
        proto.weekday = getSetLocaleDayOfWeek;
        proto.isoWeekday = getSetISODayOfWeek;
        proto.dayOfYear = getSetDayOfYear;
        proto.hour = proto.hours = getSetHour;
        proto.minute = proto.minutes = getSetMinute;
        proto.second = proto.seconds = getSetSecond;
        proto.millisecond = proto.milliseconds = getSetMillisecond;
        proto.utcOffset = getSetOffset;
        proto.utc = setOffsetToUTC;
        proto.local = setOffsetToLocal;
        proto.parseZone = setOffsetToParsedOffset;
        proto.hasAlignedHourOffset = hasAlignedHourOffset;
        proto.isDST = isDaylightSavingTime;
        proto.isLocal = isLocal;
        proto.isUtcOffset = isUtcOffset;
        proto.isUtc = isUtc;
        proto.isUTC = isUtc;
        proto.zoneAbbr = getZoneAbbr;
        proto.zoneName = getZoneName;
        proto.dates = deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth);
        proto.months = deprecate('months accessor is deprecated. Use month instead', getSetMonth);
        proto.years = deprecate('years accessor is deprecated. Use year instead', getSetYear);
        proto.zone = deprecate('moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/', getSetZone);
        proto.isDSTShifted = deprecate('isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information', isDaylightSavingTimeShifted);

        function createUnix(input) {
          return createLocal(input * 1000);
        }

        function createInZone() {
          return createLocal.apply(null, arguments).parseZone();
        }

        function preParsePostFormat(string) {
          return string;
        }

        var proto$1 = Locale.prototype;
        proto$1.calendar = calendar;
        proto$1.longDateFormat = longDateFormat;
        proto$1.invalidDate = invalidDate;
        proto$1.ordinal = ordinal;
        proto$1.preparse = preParsePostFormat;
        proto$1.postformat = preParsePostFormat;
        proto$1.relativeTime = relativeTime;
        proto$1.pastFuture = pastFuture;
        proto$1.set = set;
        proto$1.eras = localeEras;
        proto$1.erasParse = localeErasParse;
        proto$1.erasConvertYear = localeErasConvertYear;
        proto$1.erasAbbrRegex = erasAbbrRegex;
        proto$1.erasNameRegex = erasNameRegex;
        proto$1.erasNarrowRegex = erasNarrowRegex;
        proto$1.months = localeMonths;
        proto$1.monthsShort = localeMonthsShort;
        proto$1.monthsParse = localeMonthsParse;
        proto$1.monthsRegex = monthsRegex;
        proto$1.monthsShortRegex = monthsShortRegex;
        proto$1.week = localeWeek;
        proto$1.firstDayOfYear = localeFirstDayOfYear;
        proto$1.firstDayOfWeek = localeFirstDayOfWeek;
        proto$1.weekdays = localeWeekdays;
        proto$1.weekdaysMin = localeWeekdaysMin;
        proto$1.weekdaysShort = localeWeekdaysShort;
        proto$1.weekdaysParse = localeWeekdaysParse;
        proto$1.weekdaysRegex = weekdaysRegex;
        proto$1.weekdaysShortRegex = weekdaysShortRegex;
        proto$1.weekdaysMinRegex = weekdaysMinRegex;
        proto$1.isPM = localeIsPM;
        proto$1.meridiem = localeMeridiem;

        function get$1(format, index, field, setter) {
          var locale = getLocale(),
              utc = createUTC().set(setter, index);
          return locale[field](utc, format);
        }

        function listMonthsImpl(format, index, field) {
          if (isNumber(format)) {
            index = format;
            format = undefined;
          }

          format = format || '';

          if (index != null) {
            return get$1(format, index, field, 'month');
          }

          var i,
              out = [];

          for (i = 0; i < 12; i++) {
            out[i] = get$1(format, i, field, 'month');
          }

          return out;
        } // ()
        // (5)
        // (fmt, 5)
        // (fmt)
        // (true)
        // (true, 5)
        // (true, fmt, 5)
        // (true, fmt)


        function listWeekdaysImpl(localeSorted, format, index, field) {
          if (typeof localeSorted === 'boolean') {
            if (isNumber(format)) {
              index = format;
              format = undefined;
            }

            format = format || '';
          } else {
            format = localeSorted;
            index = format;
            localeSorted = false;

            if (isNumber(format)) {
              index = format;
              format = undefined;
            }

            format = format || '';
          }

          var locale = getLocale(),
              shift = localeSorted ? locale._week.dow : 0,
              i,
              out = [];

          if (index != null) {
            return get$1(format, (index + shift) % 7, field, 'day');
          }

          for (i = 0; i < 7; i++) {
            out[i] = get$1(format, (i + shift) % 7, field, 'day');
          }

          return out;
        }

        function listMonths(format, index) {
          return listMonthsImpl(format, index, 'months');
        }

        function listMonthsShort(format, index) {
          return listMonthsImpl(format, index, 'monthsShort');
        }

        function listWeekdays(localeSorted, format, index) {
          return listWeekdaysImpl(localeSorted, format, index, 'weekdays');
        }

        function listWeekdaysShort(localeSorted, format, index) {
          return listWeekdaysImpl(localeSorted, format, index, 'weekdaysShort');
        }

        function listWeekdaysMin(localeSorted, format, index) {
          return listWeekdaysImpl(localeSorted, format, index, 'weekdaysMin');
        }

        getSetGlobalLocale('en', {
          eras: [{
            since: '0001-01-01',
            until: +Infinity,
            offset: 1,
            name: 'Anno Domini',
            narrow: 'AD',
            abbr: 'AD'
          }, {
            since: '0000-12-31',
            until: -Infinity,
            offset: 1,
            name: 'Before Christ',
            narrow: 'BC',
            abbr: 'BC'
          }],
          dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
          ordinal: function ordinal(number) {
            var b = number % 10,
                output = toInt(number % 100 / 10) === 1 ? 'th' : b === 1 ? 'st' : b === 2 ? 'nd' : b === 3 ? 'rd' : 'th';
            return number + output;
          }
        }); // Side effect imports

        hooks.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', getSetGlobalLocale);
        hooks.langData = deprecate('moment.langData is deprecated. Use moment.localeData instead.', getLocale);
        var mathAbs = Math.abs;

        function abs() {
          var data = this._data;
          this._milliseconds = mathAbs(this._milliseconds);
          this._days = mathAbs(this._days);
          this._months = mathAbs(this._months);
          data.milliseconds = mathAbs(data.milliseconds);
          data.seconds = mathAbs(data.seconds);
          data.minutes = mathAbs(data.minutes);
          data.hours = mathAbs(data.hours);
          data.months = mathAbs(data.months);
          data.years = mathAbs(data.years);
          return this;
        }

        function addSubtract$1(duration, input, value, direction) {
          var other = createDuration(input, value);
          duration._milliseconds += direction * other._milliseconds;
          duration._days += direction * other._days;
          duration._months += direction * other._months;
          return duration._bubble();
        } // supports only 2.0-style add(1, 's') or add(duration)


        function add$1(input, value) {
          return addSubtract$1(this, input, value, 1);
        } // supports only 2.0-style subtract(1, 's') or subtract(duration)


        function subtract$1(input, value) {
          return addSubtract$1(this, input, value, -1);
        }

        function absCeil(number) {
          if (number < 0) {
            return Math.floor(number);
          } else {
            return Math.ceil(number);
          }
        }

        function bubble() {
          var milliseconds = this._milliseconds,
              days = this._days,
              months = this._months,
              data = this._data,
              seconds,
              minutes,
              hours,
              years,
              monthsFromDays; // if we have a mix of positive and negative values, bubble down first
          // check: https://github.com/moment/moment/issues/2166

          if (!(milliseconds >= 0 && days >= 0 && months >= 0 || milliseconds <= 0 && days <= 0 && months <= 0)) {
            milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
            days = 0;
            months = 0;
          } // The following code bubbles up values, see the tests for
          // examples of what that means.


          data.milliseconds = milliseconds % 1000;
          seconds = absFloor(milliseconds / 1000);
          data.seconds = seconds % 60;
          minutes = absFloor(seconds / 60);
          data.minutes = minutes % 60;
          hours = absFloor(minutes / 60);
          data.hours = hours % 24;
          days += absFloor(hours / 24); // convert days to months

          monthsFromDays = absFloor(daysToMonths(days));
          months += monthsFromDays;
          days -= absCeil(monthsToDays(monthsFromDays)); // 12 months -> 1 year

          years = absFloor(months / 12);
          months %= 12;
          data.days = days;
          data.months = months;
          data.years = years;
          return this;
        }

        function daysToMonths(days) {
          // 400 years have 146097 days (taking into account leap year rules)
          // 400 years have 12 months === 4800
          return days * 4800 / 146097;
        }

        function monthsToDays(months) {
          // the reverse of daysToMonths
          return months * 146097 / 4800;
        }

        function as(units) {
          if (!this.isValid()) {
            return NaN;
          }

          var days,
              months,
              milliseconds = this._milliseconds;
          units = normalizeUnits(units);

          if (units === 'month' || units === 'quarter' || units === 'year') {
            days = this._days + milliseconds / 864e5;
            months = this._months + daysToMonths(days);

            switch (units) {
              case 'month':
                return months;

              case 'quarter':
                return months / 3;

              case 'year':
                return months / 12;
            }
          } else {
            // handle milliseconds separately because of floating point math errors (issue #1867)
            days = this._days + Math.round(monthsToDays(this._months));

            switch (units) {
              case 'week':
                return days / 7 + milliseconds / 6048e5;

              case 'day':
                return days + milliseconds / 864e5;

              case 'hour':
                return days * 24 + milliseconds / 36e5;

              case 'minute':
                return days * 1440 + milliseconds / 6e4;

              case 'second':
                return days * 86400 + milliseconds / 1000;
              // Math.floor prevents floating point math errors here

              case 'millisecond':
                return Math.floor(days * 864e5) + milliseconds;

              default:
                throw new Error('Unknown unit ' + units);
            }
          }
        } // TODO: Use this.as('ms')?


        function valueOf$1() {
          if (!this.isValid()) {
            return NaN;
          }

          return this._milliseconds + this._days * 864e5 + this._months % 12 * 2592e6 + toInt(this._months / 12) * 31536e6;
        }

        function makeAs(alias) {
          return function () {
            return this.as(alias);
          };
        }

        var asMilliseconds = makeAs('ms'),
            asSeconds = makeAs('s'),
            asMinutes = makeAs('m'),
            asHours = makeAs('h'),
            asDays = makeAs('d'),
            asWeeks = makeAs('w'),
            asMonths = makeAs('M'),
            asQuarters = makeAs('Q'),
            asYears = makeAs('y');

        function clone$1() {
          return createDuration(this);
        }

        function get$2(units) {
          units = normalizeUnits(units);
          return this.isValid() ? this[units + 's']() : NaN;
        }

        function makeGetter(name) {
          return function () {
            return this.isValid() ? this._data[name] : NaN;
          };
        }

        var milliseconds = makeGetter('milliseconds'),
            seconds = makeGetter('seconds'),
            minutes = makeGetter('minutes'),
            hours = makeGetter('hours'),
            days = makeGetter('days'),
            months = makeGetter('months'),
            years = makeGetter('years');

        function weeks() {
          return absFloor(this.days() / 7);
        }

        var round = Math.round,
            thresholds = {
          ss: 44,
          // a few seconds to seconds
          s: 45,
          // seconds to minute
          m: 45,
          // minutes to hour
          h: 22,
          // hours to day
          d: 26,
          // days to month/week
          w: null,
          // weeks to month
          M: 11 // months to year

        }; // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize

        function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
          return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
        }

        function relativeTime$1(posNegDuration, withoutSuffix, thresholds, locale) {
          var duration = createDuration(posNegDuration).abs(),
              seconds = round(duration.as('s')),
              minutes = round(duration.as('m')),
              hours = round(duration.as('h')),
              days = round(duration.as('d')),
              months = round(duration.as('M')),
              weeks = round(duration.as('w')),
              years = round(duration.as('y')),
              a = seconds <= thresholds.ss && ['s', seconds] || seconds < thresholds.s && ['ss', seconds] || minutes <= 1 && ['m'] || minutes < thresholds.m && ['mm', minutes] || hours <= 1 && ['h'] || hours < thresholds.h && ['hh', hours] || days <= 1 && ['d'] || days < thresholds.d && ['dd', days];

          if (thresholds.w != null) {
            a = a || weeks <= 1 && ['w'] || weeks < thresholds.w && ['ww', weeks];
          }

          a = a || months <= 1 && ['M'] || months < thresholds.M && ['MM', months] || years <= 1 && ['y'] || ['yy', years];
          a[2] = withoutSuffix;
          a[3] = +posNegDuration > 0;
          a[4] = locale;
          return substituteTimeAgo.apply(null, a);
        } // This function allows you to set the rounding function for relative time strings


        function getSetRelativeTimeRounding(roundingFunction) {
          if (roundingFunction === undefined) {
            return round;
          }

          if (typeof roundingFunction === 'function') {
            round = roundingFunction;
            return true;
          }

          return false;
        } // This function allows you to set a threshold for relative time strings


        function getSetRelativeTimeThreshold(threshold, limit) {
          if (thresholds[threshold] === undefined) {
            return false;
          }

          if (limit === undefined) {
            return thresholds[threshold];
          }

          thresholds[threshold] = limit;

          if (threshold === 's') {
            thresholds.ss = limit - 1;
          }

          return true;
        }

        function humanize(argWithSuffix, argThresholds) {
          if (!this.isValid()) {
            return this.localeData().invalidDate();
          }

          var withSuffix = false,
              th = thresholds,
              locale,
              output;

          if (_typeof$1(argWithSuffix) === 'object') {
            argThresholds = argWithSuffix;
            argWithSuffix = false;
          }

          if (typeof argWithSuffix === 'boolean') {
            withSuffix = argWithSuffix;
          }

          if (_typeof$1(argThresholds) === 'object') {
            th = Object.assign({}, thresholds, argThresholds);

            if (argThresholds.s != null && argThresholds.ss == null) {
              th.ss = argThresholds.s - 1;
            }
          }

          locale = this.localeData();
          output = relativeTime$1(this, !withSuffix, th, locale);

          if (withSuffix) {
            output = locale.pastFuture(+this, output);
          }

          return locale.postformat(output);
        }

        var abs$1 = Math.abs;

        function sign(x) {
          return (x > 0) - (x < 0) || +x;
        }

        function toISOString$1() {
          // for ISO strings we do not use the normal bubbling rules:
          //  * milliseconds bubble up until they become hours
          //  * days do not bubble at all
          //  * months bubble up until they become years
          // This is because there is no context-free conversion between hours and days
          // (think of clock changes)
          // and also not between days and months (28-31 days per month)
          if (!this.isValid()) {
            return this.localeData().invalidDate();
          }

          var seconds = abs$1(this._milliseconds) / 1000,
              days = abs$1(this._days),
              months = abs$1(this._months),
              minutes,
              hours,
              years,
              s,
              total = this.asSeconds(),
              totalSign,
              ymSign,
              daysSign,
              hmsSign;

          if (!total) {
            // this is the same as C#'s (Noda) and python (isodate)...
            // but not other JS (goog.date)
            return 'P0D';
          } // 3600 seconds -> 60 minutes -> 1 hour


          minutes = absFloor(seconds / 60);
          hours = absFloor(minutes / 60);
          seconds %= 60;
          minutes %= 60; // 12 months -> 1 year

          years = absFloor(months / 12);
          months %= 12; // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js

          s = seconds ? seconds.toFixed(3).replace(/\.?0+$/, '') : '';
          totalSign = total < 0 ? '-' : '';
          ymSign = sign(this._months) !== sign(total) ? '-' : '';
          daysSign = sign(this._days) !== sign(total) ? '-' : '';
          hmsSign = sign(this._milliseconds) !== sign(total) ? '-' : '';
          return totalSign + 'P' + (years ? ymSign + years + 'Y' : '') + (months ? ymSign + months + 'M' : '') + (days ? daysSign + days + 'D' : '') + (hours || minutes || seconds ? 'T' : '') + (hours ? hmsSign + hours + 'H' : '') + (minutes ? hmsSign + minutes + 'M' : '') + (seconds ? hmsSign + s + 'S' : '');
        }

        var proto$2 = Duration.prototype;
        proto$2.isValid = isValid$1;
        proto$2.abs = abs;
        proto$2.add = add$1;
        proto$2.subtract = subtract$1;
        proto$2.as = as;
        proto$2.asMilliseconds = asMilliseconds;
        proto$2.asSeconds = asSeconds;
        proto$2.asMinutes = asMinutes;
        proto$2.asHours = asHours;
        proto$2.asDays = asDays;
        proto$2.asWeeks = asWeeks;
        proto$2.asMonths = asMonths;
        proto$2.asQuarters = asQuarters;
        proto$2.asYears = asYears;
        proto$2.valueOf = valueOf$1;
        proto$2._bubble = bubble;
        proto$2.clone = clone$1;
        proto$2.get = get$2;
        proto$2.milliseconds = milliseconds;
        proto$2.seconds = seconds;
        proto$2.minutes = minutes;
        proto$2.hours = hours;
        proto$2.days = days;
        proto$2.weeks = weeks;
        proto$2.months = months;
        proto$2.years = years;
        proto$2.humanize = humanize;
        proto$2.toISOString = toISOString$1;
        proto$2.toString = toISOString$1;
        proto$2.toJSON = toISOString$1;
        proto$2.locale = locale;
        proto$2.localeData = localeData;
        proto$2.toIsoString = deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', toISOString$1);
        proto$2.lang = lang; // FORMATTING

        addFormatToken('X', 0, 0, 'unix');
        addFormatToken('x', 0, 0, 'valueOf'); // PARSING

        addRegexToken('x', matchSigned);
        addRegexToken('X', matchTimestamp);
        addParseToken('X', function (input, array, config) {
          config._d = new Date(parseFloat(input) * 1000);
        });
        addParseToken('x', function (input, array, config) {
          config._d = new Date(toInt(input));
        }); //! moment.js

        hooks.version = '2.29.2';
        setHookCallback(createLocal);
        hooks.fn = proto;
        hooks.min = min;
        hooks.max = max;
        hooks.now = now;
        hooks.utc = createUTC;
        hooks.unix = createUnix;
        hooks.months = listMonths;
        hooks.isDate = isDate;
        hooks.locale = getSetGlobalLocale;
        hooks.invalid = createInvalid;
        hooks.duration = createDuration;
        hooks.isMoment = isMoment;
        hooks.weekdays = listWeekdays;
        hooks.parseZone = createInZone;
        hooks.localeData = getLocale;
        hooks.isDuration = isDuration;
        hooks.monthsShort = listMonthsShort;
        hooks.weekdaysMin = listWeekdaysMin;
        hooks.defineLocale = defineLocale;
        hooks.updateLocale = updateLocale;
        hooks.locales = listLocales;
        hooks.weekdaysShort = listWeekdaysShort;
        hooks.normalizeUnits = normalizeUnits;
        hooks.relativeTimeRounding = getSetRelativeTimeRounding;
        hooks.relativeTimeThreshold = getSetRelativeTimeThreshold;
        hooks.calendarFormat = getCalendarFormat;
        hooks.prototype = proto; // currently HTML5 input type only supports 24-hour formats

        hooks.HTML5_FMT = {
          DATETIME_LOCAL: 'YYYY-MM-DDTHH:mm',
          // <input type="datetime-local" />
          DATETIME_LOCAL_SECONDS: 'YYYY-MM-DDTHH:mm:ss',
          // <input type="datetime-local" step="1" />
          DATETIME_LOCAL_MS: 'YYYY-MM-DDTHH:mm:ss.SSS',
          // <input type="datetime-local" step="0.001" />
          DATE: 'YYYY-MM-DD',
          // <input type="date" />
          TIME: 'HH:mm',
          // <input type="time" />
          TIME_SECONDS: 'HH:mm:ss',
          // <input type="time" step="1" />
          TIME_MS: 'HH:mm:ss.SSS',
          // <input type="time" step="0.001" />
          WEEK: 'GGGG-[W]WW',
          // <input type="week" />
          MONTH: 'YYYY-MM' // <input type="month" />

        };
        return hooks;
      });
    })(moment$2);

    var moment$1 = moment$2.exports;

    var moment = moment$2.exports;

    var t$1 = function t(key) {
      return key;
    };

    var getMonthDays = function getMonthDays(year, month) {
      var days, endDate, millisecond, startDate;

      if (month === 11) {
        return 31;
      }

      millisecond = 1000 * 60 * 60 * 24;
      startDate = new Date(year, month, 1);
      endDate = new Date(year, month + 1, 1);
      days = (endDate - startDate) / millisecond;
      return days;
    };

    var getNextQuarterFirstDay = function getNextQuarterFirstDay(year, month) {
      if (!year) {
        year = new Date().getFullYear();
      }

      if (!month) {
        month = new Date().getMonth();
      }

      if (month < 3) {
        month = 3;
      } else if (month < 6) {
        month = 6;
      } else if (month < 9) {
        month = 9;
      } else {
        year++;
        month = 0;
      }

      return new Date(year, month, 1);
    };

    var getLastMonthFirstDay = function getLastMonthFirstDay(year, month) {
      if (!year) {
        year = new Date().getFullYear();
      }

      if (!month) {
        month = new Date().getMonth();
      } // 月份为0代表本年的第一月


      if (month === 0) {
        month = 11;
        year--;
        return new Date(year, month, 1);
      } // 否则,只减去月份


      month--;
      return new Date(year, month, 1);
    };

    var getQuarterStartMonth = function getQuarterStartMonth(month) {
      if (!month) {
        month = new Date().getMonth();
      }

      if (month < 3) {
        return 0;
      } else if (month < 6) {
        return 3;
      } else if (month < 9) {
        return 6;
      }

      return 9;
    };

    var getLastQuarterFirstDay = function getLastQuarterFirstDay(year, month) {
      if (!year) {
        year = new Date().getFullYear();
      }

      if (!month) {
        month = new Date().getMonth();
      }

      if (month < 3) {
        year--;
        month = 9;
      } else if (month < 6) {
        month = 0;
      } else if (month < 9) {
        month = 3;
      } else {
        month = 6;
      }

      return new Date(year, month, 1);
    };

    var getBetweenTimeBuiltinValueItem = function getBetweenTimeBuiltinValueItem(key, utcOffset) {
      // 过滤器between运算符，现算日期/日期时间类型字段的values值
      var currentMonth, currentYear, endValue, firstDay, label, lastDay, lastMonday, lastMonthFinalDay, lastMonthFirstDay, lastQuarterEndDay, lastQuarterStartDay, lastSunday, last_120_days, last_30_days, last_60_days, last_7_days, last_90_days, millisecond, minusDay, monday, month, nextMonday, nextMonthFinalDay, nextMonthFirstDay, nextQuarterEndDay, nextQuarterStartDay, nextSunday, nextYear, next_120_days, next_30_days, next_60_days, next_7_days, next_90_days, now, previousYear, startValue, strEndDay, strFirstDay, strLastDay, strMonday, strStartDay, strSunday, strToday, strTomorrow, strYestday, sunday, thisQuarterEndDay, thisQuarterStartDay, tomorrow, values, week, year, yestday;
      now = new Date(); // 一天的毫秒数

      millisecond = 1000 * 60 * 60 * 24;
      yestday = new Date(now.getTime() - millisecond);
      tomorrow = new Date(now.getTime() + millisecond); // 一周中的某一天

      week = now.getDay(); // 减去的天数

      minusDay = week !== 0 ? week - 1 : 6;
      monday = new Date(now.getTime() - minusDay * millisecond);
      sunday = new Date(monday.getTime() + 6 * millisecond); // 上周日

      lastSunday = new Date(monday.getTime() - millisecond); // 上周一

      lastMonday = new Date(lastSunday.getTime() - millisecond * 6); // 下周一

      nextMonday = new Date(sunday.getTime() + millisecond); // 下周日

      nextSunday = new Date(nextMonday.getTime() + millisecond * 6);
      currentYear = now.getFullYear();
      previousYear = currentYear - 1;
      nextYear = currentYear + 1; // 当前月份

      currentMonth = now.getMonth(); // 计数年、月

      year = now.getFullYear();
      month = now.getMonth(); // 本月第一天

      firstDay = new Date(currentYear, currentMonth, 1); // 当为12月的时候年份需要加1
      // 月份需要更新为0 也就是下一年的第一个月

      if (currentMonth === 11) {
        year++;
        month++;
      } else {
        month++;
      }

      nextMonthFirstDay = new Date(year, month, 1);
      nextMonthFinalDay = new Date(year, month, getMonthDays(year, month));
      lastDay = new Date(nextMonthFirstDay.getTime() - millisecond);
      lastMonthFirstDay = getLastMonthFirstDay(currentYear, currentMonth);
      lastMonthFinalDay = new Date(firstDay.getTime() - millisecond);
      thisQuarterStartDay = new Date(currentYear, getQuarterStartMonth(currentMonth), 1);
      thisQuarterEndDay = new Date(currentYear, getQuarterStartMonth(currentMonth) + 2, getMonthDays(currentYear, getQuarterStartMonth(currentMonth) + 2));
      lastQuarterStartDay = getLastQuarterFirstDay(currentYear, currentMonth);
      lastQuarterEndDay = new Date(lastQuarterStartDay.getFullYear(), lastQuarterStartDay.getMonth() + 2, getMonthDays(lastQuarterStartDay.getFullYear(), lastQuarterStartDay.getMonth() + 2));
      nextQuarterStartDay = getNextQuarterFirstDay(currentYear, currentMonth);
      nextQuarterEndDay = new Date(nextQuarterStartDay.getFullYear(), nextQuarterStartDay.getMonth() + 2, getMonthDays(nextQuarterStartDay.getFullYear(), nextQuarterStartDay.getMonth() + 2));
      last_7_days = new Date(now.getTime() - 6 * millisecond);
      last_30_days = new Date(now.getTime() - 29 * millisecond);
      last_60_days = new Date(now.getTime() - 59 * millisecond);
      last_90_days = new Date(now.getTime() - 89 * millisecond);
      last_120_days = new Date(now.getTime() - 119 * millisecond);
      next_7_days = new Date(now.getTime() + 6 * millisecond);
      next_30_days = new Date(now.getTime() + 29 * millisecond);
      next_60_days = new Date(now.getTime() + 59 * millisecond);
      next_90_days = new Date(now.getTime() + 89 * millisecond);
      next_120_days = new Date(now.getTime() + 119 * millisecond);

      switch (key) {
        case "last_year":
          // 去年
          label = t$1("creator_filter_operation_between_last_year");
          startValue = new Date(previousYear + "-01-01T00:00:00Z");
          endValue = new Date(previousYear + "-12-31T23:59:59Z");
          break;

        case "this_year":
          // 今年
          label = t$1("creator_filter_operation_between_this_year");
          startValue = new Date(currentYear + "-01-01T00:00:00Z");
          endValue = new Date(currentYear + "-12-31T23:59:59Z");
          break;

        case "next_year":
          // 明年
          label = t$1("creator_filter_operation_between_next_year");
          startValue = new Date(nextYear + "-01-01T00:00:00Z");
          endValue = new Date(nextYear + "-12-31T23:59:59Z");
          break;

        case "last_quarter":
          // 上季度
          strFirstDay = moment(lastQuarterStartDay).format("YYYY-MM-DD");
          strLastDay = moment(lastQuarterEndDay).format("YYYY-MM-DD");
          label = t$1("creator_filter_operation_between_last_quarter");
          startValue = new Date(strFirstDay + "T00:00:00Z");
          endValue = new Date(strLastDay + "T23:59:59Z");
          break;

        case "this_quarter":
          // 本季度
          strFirstDay = moment(thisQuarterStartDay).format("YYYY-MM-DD");
          strLastDay = moment(thisQuarterEndDay).format("YYYY-MM-DD");
          label = t$1("creator_filter_operation_between_this_quarter");
          startValue = new Date(strFirstDay + "T00:00:00Z");
          endValue = new Date(strLastDay + "T23:59:59Z");
          break;

        case "next_quarter":
          // 下季度
          strFirstDay = moment(nextQuarterStartDay).format("YYYY-MM-DD");
          strLastDay = moment(nextQuarterEndDay).format("YYYY-MM-DD");
          label = t$1("creator_filter_operation_between_next_quarter");
          startValue = new Date(strFirstDay + "T00:00:00Z");
          endValue = new Date(strLastDay + "T23:59:59Z");
          break;

        case "last_month":
          // 上月
          strFirstDay = moment(lastMonthFirstDay).format("YYYY-MM-DD");
          strLastDay = moment(lastMonthFinalDay).format("YYYY-MM-DD");
          label = t$1("creator_filter_operation_between_last_month");
          startValue = new Date(strFirstDay + "T00:00:00Z");
          endValue = new Date(strLastDay + "T23:59:59Z");
          break;

        case "this_month":
          // 本月
          strFirstDay = moment(firstDay).format("YYYY-MM-DD");
          strLastDay = moment(lastDay).format("YYYY-MM-DD");
          label = t$1("creator_filter_operation_between_this_month");
          startValue = new Date(strFirstDay + "T00:00:00Z");
          endValue = new Date(strLastDay + "T23:59:59Z");
          break;

        case "next_month":
          // 下月
          strFirstDay = moment(nextMonthFirstDay).format("YYYY-MM-DD");
          strLastDay = moment(nextMonthFinalDay).format("YYYY-MM-DD");
          label = t$1("creator_filter_operation_between_next_month");
          startValue = new Date(strFirstDay + "T00:00:00Z");
          endValue = new Date(strLastDay + "T23:59:59Z");
          break;

        case "last_week":
          // 上周
          strMonday = moment(lastMonday).format("YYYY-MM-DD");
          strSunday = moment(lastSunday).format("YYYY-MM-DD");
          label = t$1("creator_filter_operation_between_last_week");
          startValue = new Date(strMonday + "T00:00:00Z");
          endValue = new Date(strSunday + "T23:59:59Z");
          break;

        case "this_week":
          // 本周
          strMonday = moment(monday).format("YYYY-MM-DD");
          strSunday = moment(sunday).format("YYYY-MM-DD");
          label = t$1("creator_filter_operation_between_this_week");
          startValue = new Date(strMonday + "T00:00:00Z");
          endValue = new Date(strSunday + "T23:59:59Z");
          break;

        case "next_week":
          // 下周
          strMonday = moment(nextMonday).format("YYYY-MM-DD");
          strSunday = moment(nextSunday).format("YYYY-MM-DD");
          label = t$1("creator_filter_operation_between_next_week");
          startValue = new Date(strMonday + "T00:00:00Z");
          endValue = new Date(strSunday + "T23:59:59Z");
          break;

        case "yestday":
          // 昨天
          strYestday = moment(yestday).format("YYYY-MM-DD");
          label = t$1("creator_filter_operation_between_yestday");
          startValue = new Date(strYestday + "T00:00:00Z");
          endValue = new Date(strYestday + "T23:59:59Z");
          break;

        case "today":
          // 今天
          strToday = moment(now).format("YYYY-MM-DD");
          label = t$1("creator_filter_operation_between_today");
          startValue = new Date(strToday + "T00:00:00Z");
          endValue = new Date(strToday + "T23:59:59Z");
          break;

        case "tomorrow":
          // 明天
          strTomorrow = moment(tomorrow).format("YYYY-MM-DD");
          label = t$1("creator_filter_operation_between_tomorrow");
          startValue = new Date(strTomorrow + "T00:00:00Z");
          endValue = new Date(strTomorrow + "T23:59:59Z");
          break;

        case "last_7_days":
          // 过去7天
          strStartDay = moment(last_7_days).format("YYYY-MM-DD");
          strEndDay = moment(now).format("YYYY-MM-DD");
          label = t$1("creator_filter_operation_between_last_7_days");
          startValue = new Date(strStartDay + "T00:00:00Z");
          endValue = new Date(strEndDay + "T23:59:59Z");
          break;

        case "last_30_days":
          // 过去30天
          strStartDay = moment(last_30_days).format("YYYY-MM-DD");
          strEndDay = moment(now).format("YYYY-MM-DD");
          label = t$1("creator_filter_operation_between_last_30_days");
          startValue = new Date(strStartDay + "T00:00:00Z");
          endValue = new Date(strEndDay + "T23:59:59Z");
          break;

        case "last_60_days":
          // 过去60天
          strStartDay = moment(last_60_days).format("YYYY-MM-DD");
          strEndDay = moment(now).format("YYYY-MM-DD");
          label = t$1("creator_filter_operation_between_last_60_days");
          startValue = new Date(strStartDay + "T00:00:00Z");
          endValue = new Date(strEndDay + "T23:59:59Z");
          break;

        case "last_90_days":
          // 过去90天
          strStartDay = moment(last_90_days).format("YYYY-MM-DD");
          strEndDay = moment(now).format("YYYY-MM-DD");
          label = t$1("creator_filter_operation_between_last_90_days");
          startValue = new Date(strStartDay + "T00:00:00Z");
          endValue = new Date(strEndDay + "T23:59:59Z");
          break;

        case "last_120_days":
          // 过去120天
          strStartDay = moment(last_120_days).format("YYYY-MM-DD");
          strEndDay = moment(now).format("YYYY-MM-DD");
          label = t$1("creator_filter_operation_between_last_120_days");
          startValue = new Date(strStartDay + "T00:00:00Z");
          endValue = new Date(strEndDay + "T23:59:59Z");
          break;

        case "next_7_days":
          // 未来7天
          strStartDay = moment(now).format("YYYY-MM-DD");
          strEndDay = moment(next_7_days).format("YYYY-MM-DD");
          label = t$1("creator_filter_operation_between_next_7_days");
          startValue = new Date(strStartDay + "T00:00:00Z");
          endValue = new Date(strEndDay + "T23:59:59Z");
          break;

        case "next_30_days":
          // 未来30天
          strStartDay = moment(now).format("YYYY-MM-DD");
          strEndDay = moment(next_30_days).format("YYYY-MM-DD");
          label = t$1("creator_filter_operation_between_next_30_days");
          startValue = new Date(strStartDay + "T00:00:00Z");
          endValue = new Date(strEndDay + "T23:59:59Z");
          break;

        case "next_60_days":
          // 未来60天
          strStartDay = moment(now).format("YYYY-MM-DD");
          strEndDay = moment(next_60_days).format("YYYY-MM-DD");
          label = t$1("creator_filter_operation_between_next_60_days");
          startValue = new Date(strStartDay + "T00:00:00Z");
          endValue = new Date(strEndDay + "T23:59:59Z");
          break;

        case "next_90_days":
          // 未来90天
          strStartDay = moment(now).format("YYYY-MM-DD");
          strEndDay = moment(next_90_days).format("YYYY-MM-DD");
          label = t$1("creator_filter_operation_between_next_90_days");
          startValue = new Date(strStartDay + "T00:00:00Z");
          endValue = new Date(strEndDay + "T23:59:59Z");
          break;

        case "next_120_days":
          // 未来120天
          strStartDay = moment(now).format("YYYY-MM-DD");
          strEndDay = moment(next_120_days).format("YYYY-MM-DD");
          label = t$1("creator_filter_operation_between_next_120_days");
          startValue = new Date(strStartDay + "T00:00:00Z");
          endValue = new Date(strEndDay + "T23:59:59Z");
      }

      values = [startValue, endValue]; // 时间类型字段，应该考虑偏移时区值，否则过滤数据存在偏差
      // 日期类型字段，数据库本来就存的是UTC的0点；
      // 日期类型字段，目前creator代码（2019年08月07号存的）存的是UTC的16点，见：https://github.com/steedos/creator/issues/1271；
      // 比如用户想搜索2019-08-07的数据，请求会是：((created ge 2019-08-06T16:00:00Z) and (created le 2019-08-07T15:59:59Z)) ，
      // 如果数据库中存储的是2019-08-07T16:00:00Z而不是2019-08-07T00:00:00Z，那么就搜索不到数据。
      // 所以，日期类型字段，要求存储的是UTC的0点，而不可以是16点，否则可能搜索不到数据。

      if (utcOffset) {
        values = values.map(function (fv) {
          if (fv) {
            // 注意这里取的值是moment().utcOffset() / 60得到的，不是new Date().getTimezoneOffset() / 60
            // 它们的值正好为正负关系，北京时间前者为 +8，后者为 -8
            fv = new Date(fv.getTime()); // clone fv的值以防止原来的值被更改

            fv.setHours(fv.getHours() - utcOffset);
          }

          return fv;
        });
      }

      return {
        label: label,
        key: key,
        values: values
      };
    };

    var getBetweenBuiltinValueItem = function getBetweenBuiltinValueItem(key, utcOffset) {
      return getBetweenTimeBuiltinValueItem(key, utcOffset);
    };

    var isBetweenFilterOperation = function isBetweenFilterOperation(operation) {
      return operation === "between";
    };

    utils$1.getMonthDays = getMonthDays;
    utils$1.getQuarterStartMonth = getQuarterStartMonth;
    utils$1.getLastMonthFirstDay = getLastMonthFirstDay;
    utils$1.getLastQuarterFirstDay = getLastQuarterFirstDay;
    utils$1.getNextQuarterFirstDay = getNextQuarterFirstDay;
    utils$1.getBetweenBuiltinValueItem = getBetweenBuiltinValueItem;
    utils$1.getBetweenTimeBuiltinValueItem = getBetweenTimeBuiltinValueItem;
    utils$1.isBetweenFilterOperation = isBetweenFilterOperation;

    var formula$1 = {};

    var checkFormula = function checkFormula(formula) {
      return typeof formula === "string" && /\{\w+(\.\w+)?\}/.test(formula);
    }; // "{userId}"转换为"this['userId']","{user.name}"转换为"this['user'].['name']"


    var prepareFormula = function prepareFormula(formula) {
      var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "this";
      var reg, rev;
      reg = /(\{[^{}]*\})/g;
      rev = formula.replace(reg, function (m, $1) {
        return prefix + $1.replace(/\{\s*/, "[\"").replace(/\s*\}/, "\"]").replace(/\s*\.\s*/g, "\"][\"");
      });
      return rev;
    };

    var evaluateFormula = function evaluateFormula(formula, context) {
      if (checkFormula(formula)) {
        formula = prepareFormula(formula);
        return function () {
          return eval(formula);
        }.call(context);
      } else {
        return formula;
      }
    };

    formula$1.evaluateFormula = evaluateFormula;

    var SteedosFilter = filter;
    var _$4 = require$$0$1;
    var utils = utils$1;
    var formula = formula$1; // 正则包括encodeURIComponent函数编码的11个特殊符号;/?:@&=+$,#
    // 还包括convertSpecialCharacter函数中转义的特殊符号^$()*+?.\|[]{}
    // 注意encodeURIComponent("\\(")的结果是%5C(，需要特别处理
    // 注意encodeURIComponent("\\.")的结果是%5C.，需要特别处理
    // 注意encodeURIComponent("\\*")的结果是%5C*，因为不需要encodeURIComponent函数编码，所以不用加入REG_FOR_ENCORD变量

    var REG_FOR_ENCORD = /\;|\/|\?|\:|\@|\&|\=|\+|\$|\,|\#|\^|(\\\()|(\\\))|(\\\.)|\\|\||\[|\]|\{|\}/;
    /**
        ^$()*+?.\|[]{}等特殊符号需要转义，否则有可能会报错且无法正确识别
        encodeURIComponent函数并不能完全编码上述所有特殊符号
        这里保持跟版本1.23一样的处理逻辑，只是额外判断了下避免重复转义或重复执行encodeURIComponent编码的可能
     */

    var convertSpecialCharacter = function convertSpecialCharacter(str) {
      // if(str.indexOf("\\") > -1){
      //     // 如果有转义符号就按已经执行过转义处理，否则重复转义会有问题
      //     return str;
      // }
      // encodeURIComponent("\\(")的结果是%5C(,进一步转义的话会变成%5C\(，里面包括了符号\，会通过上面的正则REG_FOR_ENCORD，
      // 从而造成重复执行encodeURIComponent，所以这个不可以进一步转义，否则会搜索不到正确结果
      // 类似的有符号.*
      if (str.indexOf("%5C(") > -1 || str.indexOf("%5C)") > -1) {
        return str;
      }

      if (str.indexOf("%5C.") > -1) {
        return str;
      }

      if (str.indexOf("%5C*") > -1) {
        return str;
      }

      return str.replace(/([\^\$\(\)\*\+\?\.\\\|\[\]\{\}])/g, "\\$1");
    };

    var extendUserContext = function extendUserContext(userContext, utcOffset) {
      if (!userContext.now) {
        userContext.now = new Date();
      }

      return userContext;
    };

    var formatFiltersToDev = function formatFiltersToDev(filters) {
      var userContext = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
        userId: null,
        spaceId: null,
        user: {
          utcOffset: 0
        }
      };

      if (_$4.isNull(filters) || _$4.isUndefined(filters)) {
        return;
      }

      var utcOffset = userContext.user ? userContext.user.utcOffset : 0;
      userContext = extendUserContext(userContext); // 2019-03-23T01:00:33.524Z或2019-03-23T01:00:33Z这种格式

      var regDate = /^\d{4}-\d{1,2}-\d{1,2}(T|\s)\d{1,2}\:\d{1,2}(\:\d{1,2}(\.\d{1,3})?)?(Z)?$/;

      var _filtersLooper, selector;

      if (!_$4.isFunction(filters) && !filters.length) {
        return;
      }

      selector = [];

      _filtersLooper = function filtersLooper(filters_loop) {
        var builtinValue, field, i, isBetweenOperation, option, ref, sub_selector, tempFilters, tempLooperResult, value;
        tempFilters = [];
        tempLooperResult = null;

        if (filters_loop === "!") {
          return filters_loop;
        }

        if (_$4.isFunction(filters_loop)) {
          filters_loop = filters_loop();
        }

        if (!_$4.isArray(filters_loop)) {
          if (_$4.isObject(filters_loop)) {
            // 当filters不是[Array]类型而是[Object]类型时，进行格式转换
            if (filters_loop.operation) {
              filters_loop = [filters_loop.field, filters_loop.operation, filters_loop.value];
            } else {
              return null;
            }
          } else {
            return null;
          }
        }

        if (filters_loop.length === 1) {
          // 只有一个元素，进一步解析其内容
          tempLooperResult = _filtersLooper(filters_loop[0]);

          if (tempLooperResult) {
            tempFilters.push(tempLooperResult);
          }
        } else if (filters_loop.length === 2) {
          // 只有两个元素，进一步解析其内容，省略"and"连接符，但是有"and"效果
          filters_loop.forEach(function (n, i) {
            tempLooperResult = _filtersLooper(n);

            if (tempLooperResult) {
              return tempFilters.push(tempLooperResult);
            }
          });
        } else if (filters_loop.length === 3) {
          // 只有三个元素，可能中间是"or","and"连接符也可能是普通数组，区别对待解析
          if (_$4.include(["or", "and"], filters_loop[1])) {
            // 中间有"or","and"连接符，则循环filters_loop，依次用filtersLooper解析其过虑条件
            // 最后生成的结果格式：tempFilters = [filtersLooper(filters_loop[0]), filters_loop[1], filtersLooper(filters_loop[2]), ...]
            // 因要判断filtersLooper(filters_loop[0])及filtersLooper(filters_loop[2])是否为空
            // 所以不能直接写：tempFilters = [filtersLooper(filters_loop[0]), filters_loop[1], filtersLooper(filters_loop[2])]
            tempFilters = [];
            i = 0;

            while (i < filters_loop.length) {
              if (_$4.include(["or", "and"], filters_loop[i])) {
                i++;
                continue;
              }

              tempLooperResult = _filtersLooper(filters_loop[i]);

              if (!tempLooperResult) {
                i++;
                continue;
              }

              if (i > 0) {
                tempFilters.push(filters_loop[i - 1]);
              }

              tempFilters.push(tempLooperResult);
              i++;
            }

            if (_$4.include(["or", "and"], tempFilters[0])) {
              tempFilters.shift();
            }
          } else {
            if (_$4.isString(filters_loop[1])) {
              // 第二个元素为字符串，则认为是某一个具体的过虑条件
              field = filters_loop[0];
              option = filters_loop[1];
              value = filters_loop[2];

              if (_$4.isFunction(value)) {
                value = value();
              }

              if (option === "!=") {
                // 支持!=为不等于操作
                option = "<>";
              }

              value = formula.evaluateFormula(value, userContext);
              sub_selector = [];
              isBetweenOperation = utils.isBetweenFilterOperation(option);

              if (isBetweenOperation && _$4.isString(value)) {
                // 如果是between运算符内置值，则取出对应values作为过滤值
                // 比如value为last_year，返回对应的时间值
                builtinValue = utils.getBetweenBuiltinValueItem(value, utcOffset);

                if (builtinValue) {
                  value = builtinValue.values;
                }
              }

              if (_$4.isArray(value)) {
                value = value.map(function (item) {
                  if (typeof item === "string") {
                    if (["contains", "startswith", "endswith", "notcontains", "notstartswith", "notendswith"].indexOf(option) > -1) {
                      item = convertSpecialCharacter(item);
                    }

                    if (regDate.test(item)) {
                      // 如果item正好是regDate格式，则转换为Date类型
                      item = new Date(item);
                    } else if (REG_FOR_ENCORD.test(item)) {
                      item = encodeURIComponent(item);
                    }
                  }

                  return item;
                });

                if (["=", "in"].indexOf(option) > -1) {
                  if (value.length) {
                    _$4.each(value, function (v) {
                      return sub_selector.push([field, "=", v], "or");
                    });
                  } else {
                    // 空数组返回空值
                    sub_selector.push([field, "=", "__badQueryForEmptyArray"], "and");
                  }
                } else if (["<>", "notin"].indexOf(option) > -1) {
                  _$4.each(value, function (v) {
                    return sub_selector.push([field, "<>", v], "and");
                  });
                } else if (["notcontains", "notstartswith", "notendswith"].indexOf(option) > -1) {
                  _$4.each(value, function (v) {
                    return sub_selector.push([field, option, v], "and");
                  });
                } else if (isBetweenOperation) {
                  if (value.length > 0) {
                    if ([null, undefined, ''].indexOf(value[0]) < 0 || [null, undefined, ''].indexOf(value[1]) < 0) {
                      if ([null, undefined, ''].indexOf(value[0]) < 0) {
                        sub_selector.push([field, ">=", value[0]], "and");
                      }

                      if ([null, undefined, ''].indexOf(value[1]) < 0) {
                        sub_selector.push([field, "<=", value[1]], "and");
                      }
                    }
                  }
                } else {
                  // contains、startswith、endswith等，如果value为空数组，不加任何条件，即查找所有数据
                  _$4.each(value, function (v) {
                    return sub_selector.push([field, option, v], "or");
                  });
                }

                if (sub_selector[sub_selector.length - 1] === "and" || sub_selector[sub_selector.length - 1] === "or") {
                  sub_selector.pop();
                }

                if (sub_selector.length) {
                  tempFilters = sub_selector;
                }
              } else if (value === false) {
                // boolean类型字段优化，选择否时，应该兼容undefined值的情况
                // 主要是为了落地版本，目前我们有的项目yml中一些字段是项目交付上线后再加的，
                // 就造成按false搜索时搜索不到老数据（因为老数据中该字段值为空）
                if (option === "=") {
                  tempFilters = [[field, "=", false], "or", [field, "=", null]];
                } else if (option === "<>") {
                  tempFilters = [field, "=", true];
                }
              } else {
                if (isBetweenOperation && !_$4.isArray(value)) ; else {
                  if (typeof value === "string") {
                    if (["contains", "startswith", "endswith", "notcontains", "notstartswith", "notendswith"].indexOf(option) > -1) {
                      value = convertSpecialCharacter(value);
                    }

                    if (regDate.test(value)) {
                      // 如果value正好是regDate格式，则转换为Date类型
                      value = new Date(value);
                    } else if (REG_FOR_ENCORD.test(value)) {
                      value = encodeURIComponent(value);
                    }
                  }

                  tempFilters = [field, option, value];
                }
              }
            } else {
              // 普通数组，当成完整过虑条件进一步循环解析每个条件
              filters_loop.forEach(function (n, i) {
                tempLooperResult = _filtersLooper(n);

                if (tempLooperResult) {
                  return tempFilters.push(tempLooperResult);
                }
              });
            }
          }
        } else {
          // 超过3个元素的数组，可能中间是"or","and"连接符也可能是普通数组，区别对待解析
          if ((ref = _$4.intersection(["or", "and"], filters_loop)) != null ? ref.length : void 0) {
            // 中间有"or","and"连接符，则循环filters_loop，依次用filtersLooper解析其过虑条件
            // 最后生成的结果格式：tempFilters = [filtersLooper(filters_loop[0]), filters_loop[1], filtersLooper(filters_loop[2]), ...]
            // 因要判断filtersLooper(filters_loop[0])及filtersLooper(filters_loop[2])是否为空
            // 所以不能直接写：tempFilters = [filtersLooper(filters_loop[0]), filters_loop[1], filtersLooper(filters_loop[2])]
            tempFilters = [];
            i = 0;

            while (i < filters_loop.length) {
              if (_$4.include(["or", "and"], filters_loop[i])) {
                i++;
                continue;
              }

              tempLooperResult = _filtersLooper(filters_loop[i]);

              if (!tempLooperResult) {
                i++;
                continue;
              }

              if (i > 0) {
                tempFilters.push(filters_loop[i - 1]);
              }

              tempFilters.push(tempLooperResult);
              i++;
            }

            if (_$4.include(["or", "and"], tempFilters[0])) {
              tempFilters.shift();
            }
          } else {
            // 普通过虑条件，当成完整过虑条件进一步循环解析每个条件
            filters_loop.forEach(function (n, i) {
              tempLooperResult = _filtersLooper(n);

              if (tempLooperResult) {
                return tempFilters.push(tempLooperResult);
              }
            });
          }
        }

        if (tempFilters.length) {
          return tempFilters;
        } else {
          return null;
        }
      };

      selector = _filtersLooper(filters);
      return selector;
    };

    var formatFiltersToODataQuery$1 = function formatFiltersToODataQuery(filters, userContext, odataProtocolVersion, forceLowerCase) {
      var devFilters = formatFiltersToDev(filters, userContext);
      return new SteedosFilter(devFilters, odataProtocolVersion, forceLowerCase).formatFiltersToODataQuery();
    };

    format.formatFiltersToDev = formatFiltersToDev;
    format.formatFiltersToODataQuery = formatFiltersToODataQuery$1;

    var graphql = {};

    var _$3 = require$$0$1;
    var _require = format,
        formatFiltersToODataQuery = _require.formatFiltersToODataQuery; // 把"a.b.c"这种字符fieldName转换为{"a":{"b":{"c":{}}}}这种json

    var expandFieldName = function expandFieldName(initial, fieldName) {
      _$3.reduce(fieldName.split("."), function (m, k) {
        if (!m[k]) {
          m[k] = {};
        }

        return m[k];
      }, initial);

      return initial;
    }; // 把["a.b.c","x.y","x.z","m"]这种字符fieldName转换为{"a":{"b":{"c":{}}},"x":{"y":{},"z":{}},"m":{}}这种json对象格式


    var expandFieldNames = function expandFieldNames(fieldNames) {
      var initial = {};
      fieldNames.forEach(function (n) {
        expandFieldName(initial, n);
      });
      return initial;
    };

    var generateIndents = function generateIndents(count) {
      return Array(count).fill("    ").join("");
    };
    /** 
    把{"a":{"b":{"c":{}}}}这种json转换为字符格式：
    {
        a {
            b {
                c
            }
        }
    }
    */


    var reduceGraphqlFieldsQuery = function reduceGraphqlFieldsQuery(fields, indentsCount) {
      if (!indentsCount) {
        indentsCount = 0;
      }

      var itemQuery;
      return " {\n".concat(_$3.map(fields, function (fieldValue, fieldKey) {
        itemQuery = generateIndents(indentsCount) + generateIndents(1) + fieldKey;

        if (_$3.isEmpty(fieldValue)) {
          itemQuery += "\n";
        } else {
          indentsCount += 1;
          itemQuery += reduceGraphqlFieldsQuery(fieldValue, indentsCount);
          indentsCount -= 1;
        }

        return itemQuery;
      }).join("")).concat(generateIndents(indentsCount), "}\n");
    };

    var formatFieldsToGraphqlQuery = function formatFieldsToGraphqlQuery(fields) {
      if (_$3.isString(fields)) {
        fields = fields.split(",");
      }

      var expandedFields = expandFieldNames(fields);
      return reduceGraphqlFieldsQuery(expandedFields, 3);
    };
    /**
     * 
     * 
     * 把filters和fields转换为如下格式的graphql请求串
      query {
        contracts(filters:[
          [
            "create_date",
            "between",
            "this_year"
          ]
      ]) {
          name
          amount
          contract_type {
            name
          }
        }
      }
     * @param {*} filters ,请求的过滤条件
     * @param {*} fields ,请求的字段，支持["a.b.c","m","n"]或"a.b.c,m,n"这种语法
     */


    var formatFiltersToGraphqlQuery = function formatFiltersToGraphqlQuery(objectName, filters, fields, userContext, odataProtocolVersion, forceLowerCase) {
      if (!_$3.isString(filters)) {
        filters = formatFiltersToODataQuery(filters, userContext, odataProtocolVersion, forceLowerCase);
      }

      var filtersWrap = filters ? "(filters:\"".concat(filters, "\")") : "";
      var graphqlFields = formatFieldsToGraphqlQuery(fields);
      var graphqlQuery = "\n        query {\n            ".concat(objectName).concat(filtersWrap).concat(graphqlFields, "\n        }\n    ");
      return graphqlQuery;
    };

    graphql.formatFiltersToGraphqlQuery = formatFiltersToGraphqlQuery;

    (function (exports) {

      var SteedosFilter = filter;
      var format$1 = format;
      var utils = utils$1;
      var formula = formula$1;
      var graphql$1 = graphql;
      exports.SteedosFilter = SteedosFilter;
      Object.assign(exports, utils, formula, format$1, graphql$1);
    })(lib);

    var fetch_umd = {exports: {}};

    (function (module, exports) {
      (function (global, factory) {
        factory(exports) ;
      })(commonjsGlobal, function (exports) {

        var global = typeof globalThis !== 'undefined' && globalThis || typeof self !== 'undefined' && self || typeof global !== 'undefined' && global;
        var support = {
          searchParams: 'URLSearchParams' in global,
          iterable: 'Symbol' in global && 'iterator' in Symbol,
          blob: 'FileReader' in global && 'Blob' in global && function () {
            try {
              new Blob();
              return true;
            } catch (e) {
              return false;
            }
          }(),
          formData: 'FormData' in global,
          arrayBuffer: 'ArrayBuffer' in global
        };

        function isDataView(obj) {
          return obj && DataView.prototype.isPrototypeOf(obj);
        }

        if (support.arrayBuffer) {
          var viewClasses = ['[object Int8Array]', '[object Uint8Array]', '[object Uint8ClampedArray]', '[object Int16Array]', '[object Uint16Array]', '[object Int32Array]', '[object Uint32Array]', '[object Float32Array]', '[object Float64Array]'];

          var isArrayBufferView = ArrayBuffer.isView || function (obj) {
            return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1;
          };
        }

        function normalizeName(name) {
          if (typeof name !== 'string') {
            name = String(name);
          }

          if (/[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(name) || name === '') {
            throw new TypeError('Invalid character in header field name: "' + name + '"');
          }

          return name.toLowerCase();
        }

        function normalizeValue(value) {
          if (typeof value !== 'string') {
            value = String(value);
          }

          return value;
        } // Build a destructive iterator for the value list


        function iteratorFor(items) {
          var iterator = {
            next: function next() {
              var value = items.shift();
              return {
                done: value === undefined,
                value: value
              };
            }
          };

          if (support.iterable) {
            iterator[Symbol.iterator] = function () {
              return iterator;
            };
          }

          return iterator;
        }

        function Headers(headers) {
          this.map = {};

          if (headers instanceof Headers) {
            headers.forEach(function (value, name) {
              this.append(name, value);
            }, this);
          } else if (Array.isArray(headers)) {
            headers.forEach(function (header) {
              this.append(header[0], header[1]);
            }, this);
          } else if (headers) {
            Object.getOwnPropertyNames(headers).forEach(function (name) {
              this.append(name, headers[name]);
            }, this);
          }
        }

        Headers.prototype.append = function (name, value) {
          name = normalizeName(name);
          value = normalizeValue(value);
          var oldValue = this.map[name];
          this.map[name] = oldValue ? oldValue + ', ' + value : value;
        };

        Headers.prototype['delete'] = function (name) {
          delete this.map[normalizeName(name)];
        };

        Headers.prototype.get = function (name) {
          name = normalizeName(name);
          return this.has(name) ? this.map[name] : null;
        };

        Headers.prototype.has = function (name) {
          return this.map.hasOwnProperty(normalizeName(name));
        };

        Headers.prototype.set = function (name, value) {
          this.map[normalizeName(name)] = normalizeValue(value);
        };

        Headers.prototype.forEach = function (callback, thisArg) {
          for (var name in this.map) {
            if (this.map.hasOwnProperty(name)) {
              callback.call(thisArg, this.map[name], name, this);
            }
          }
        };

        Headers.prototype.keys = function () {
          var items = [];
          this.forEach(function (value, name) {
            items.push(name);
          });
          return iteratorFor(items);
        };

        Headers.prototype.values = function () {
          var items = [];
          this.forEach(function (value) {
            items.push(value);
          });
          return iteratorFor(items);
        };

        Headers.prototype.entries = function () {
          var items = [];
          this.forEach(function (value, name) {
            items.push([name, value]);
          });
          return iteratorFor(items);
        };

        if (support.iterable) {
          Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
        }

        function consumed(body) {
          if (body.bodyUsed) {
            return Promise.reject(new TypeError('Already read'));
          }

          body.bodyUsed = true;
        }

        function fileReaderReady(reader) {
          return new Promise(function (resolve, reject) {
            reader.onload = function () {
              resolve(reader.result);
            };

            reader.onerror = function () {
              reject(reader.error);
            };
          });
        }

        function readBlobAsArrayBuffer(blob) {
          var reader = new FileReader();
          var promise = fileReaderReady(reader);
          reader.readAsArrayBuffer(blob);
          return promise;
        }

        function readBlobAsText(blob) {
          var reader = new FileReader();
          var promise = fileReaderReady(reader);
          reader.readAsText(blob);
          return promise;
        }

        function readArrayBufferAsText(buf) {
          var view = new Uint8Array(buf);
          var chars = new Array(view.length);

          for (var i = 0; i < view.length; i++) {
            chars[i] = String.fromCharCode(view[i]);
          }

          return chars.join('');
        }

        function bufferClone(buf) {
          if (buf.slice) {
            return buf.slice(0);
          } else {
            var view = new Uint8Array(buf.byteLength);
            view.set(new Uint8Array(buf));
            return view.buffer;
          }
        }

        function Body() {
          this.bodyUsed = false;

          this._initBody = function (body) {
            /*
              fetch-mock wraps the Response object in an ES6 Proxy to
              provide useful test harness features such as flush. However, on
              ES5 browsers without fetch or Proxy support pollyfills must be used;
              the proxy-pollyfill is unable to proxy an attribute unless it exists
              on the object before the Proxy is created. This change ensures
              Response.bodyUsed exists on the instance, while maintaining the
              semantic of setting Request.bodyUsed in the constructor before
              _initBody is called.
            */
            this.bodyUsed = this.bodyUsed;
            this._bodyInit = body;

            if (!body) {
              this._bodyText = '';
            } else if (typeof body === 'string') {
              this._bodyText = body;
            } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
              this._bodyBlob = body;
            } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
              this._bodyFormData = body;
            } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
              this._bodyText = body.toString();
            } else if (support.arrayBuffer && support.blob && isDataView(body)) {
              this._bodyArrayBuffer = bufferClone(body.buffer); // IE 10-11 can't handle a DataView body.

              this._bodyInit = new Blob([this._bodyArrayBuffer]);
            } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
              this._bodyArrayBuffer = bufferClone(body);
            } else {
              this._bodyText = body = Object.prototype.toString.call(body);
            }

            if (!this.headers.get('content-type')) {
              if (typeof body === 'string') {
                this.headers.set('content-type', 'text/plain;charset=UTF-8');
              } else if (this._bodyBlob && this._bodyBlob.type) {
                this.headers.set('content-type', this._bodyBlob.type);
              } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
                this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
              }
            }
          };

          if (support.blob) {
            this.blob = function () {
              var rejected = consumed(this);

              if (rejected) {
                return rejected;
              }

              if (this._bodyBlob) {
                return Promise.resolve(this._bodyBlob);
              } else if (this._bodyArrayBuffer) {
                return Promise.resolve(new Blob([this._bodyArrayBuffer]));
              } else if (this._bodyFormData) {
                throw new Error('could not read FormData body as blob');
              } else {
                return Promise.resolve(new Blob([this._bodyText]));
              }
            };

            this.arrayBuffer = function () {
              if (this._bodyArrayBuffer) {
                var isConsumed = consumed(this);

                if (isConsumed) {
                  return isConsumed;
                }

                if (ArrayBuffer.isView(this._bodyArrayBuffer)) {
                  return Promise.resolve(this._bodyArrayBuffer.buffer.slice(this._bodyArrayBuffer.byteOffset, this._bodyArrayBuffer.byteOffset + this._bodyArrayBuffer.byteLength));
                } else {
                  return Promise.resolve(this._bodyArrayBuffer);
                }
              } else {
                return this.blob().then(readBlobAsArrayBuffer);
              }
            };
          }

          this.text = function () {
            var rejected = consumed(this);

            if (rejected) {
              return rejected;
            }

            if (this._bodyBlob) {
              return readBlobAsText(this._bodyBlob);
            } else if (this._bodyArrayBuffer) {
              return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer));
            } else if (this._bodyFormData) {
              throw new Error('could not read FormData body as text');
            } else {
              return Promise.resolve(this._bodyText);
            }
          };

          if (support.formData) {
            this.formData = function () {
              return this.text().then(decode);
            };
          }

          this.json = function () {
            return this.text().then(JSON.parse);
          };

          return this;
        } // HTTP methods whose capitalization should be normalized


        var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

        function normalizeMethod(method) {
          var upcased = method.toUpperCase();
          return methods.indexOf(upcased) > -1 ? upcased : method;
        }

        function Request(input, options) {
          if (!(this instanceof Request)) {
            throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
          }

          options = options || {};
          var body = options.body;

          if (input instanceof Request) {
            if (input.bodyUsed) {
              throw new TypeError('Already read');
            }

            this.url = input.url;
            this.credentials = input.credentials;

            if (!options.headers) {
              this.headers = new Headers(input.headers);
            }

            this.method = input.method;
            this.mode = input.mode;
            this.signal = input.signal;

            if (!body && input._bodyInit != null) {
              body = input._bodyInit;
              input.bodyUsed = true;
            }
          } else {
            this.url = String(input);
          }

          this.credentials = options.credentials || this.credentials || 'same-origin';

          if (options.headers || !this.headers) {
            this.headers = new Headers(options.headers);
          }

          this.method = normalizeMethod(options.method || this.method || 'GET');
          this.mode = options.mode || this.mode || null;
          this.signal = options.signal || this.signal;
          this.referrer = null;

          if ((this.method === 'GET' || this.method === 'HEAD') && body) {
            throw new TypeError('Body not allowed for GET or HEAD requests');
          }

          this._initBody(body);

          if (this.method === 'GET' || this.method === 'HEAD') {
            if (options.cache === 'no-store' || options.cache === 'no-cache') {
              // Search for a '_' parameter in the query string
              var reParamSearch = /([?&])_=[^&]*/;

              if (reParamSearch.test(this.url)) {
                // If it already exists then set the value with the current time
                this.url = this.url.replace(reParamSearch, '$1_=' + new Date().getTime());
              } else {
                // Otherwise add a new '_' parameter to the end with the current time
                var reQueryString = /\?/;
                this.url += (reQueryString.test(this.url) ? '&' : '?') + '_=' + new Date().getTime();
              }
            }
          }
        }

        Request.prototype.clone = function () {
          return new Request(this, {
            body: this._bodyInit
          });
        };

        function decode(body) {
          var form = new FormData();
          body.trim().split('&').forEach(function (bytes) {
            if (bytes) {
              var split = bytes.split('=');
              var name = split.shift().replace(/\+/g, ' ');
              var value = split.join('=').replace(/\+/g, ' ');
              form.append(decodeURIComponent(name), decodeURIComponent(value));
            }
          });
          return form;
        }

        function parseHeaders(rawHeaders) {
          var headers = new Headers(); // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
          // https://tools.ietf.org/html/rfc7230#section-3.2

          var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' '); // Avoiding split via regex to work around a common IE11 bug with the core-js 3.6.0 regex polyfill
          // https://github.com/github/fetch/issues/748
          // https://github.com/zloirock/core-js/issues/751

          preProcessedHeaders.split('\r').map(function (header) {
            return header.indexOf('\n') === 0 ? header.substr(1, header.length) : header;
          }).forEach(function (line) {
            var parts = line.split(':');
            var key = parts.shift().trim();

            if (key) {
              var value = parts.join(':').trim();
              headers.append(key, value);
            }
          });
          return headers;
        }

        Body.call(Request.prototype);

        function Response(bodyInit, options) {
          if (!(this instanceof Response)) {
            throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
          }

          if (!options) {
            options = {};
          }

          this.type = 'default';
          this.status = options.status === undefined ? 200 : options.status;
          this.ok = this.status >= 200 && this.status < 300;
          this.statusText = options.statusText === undefined ? '' : '' + options.statusText;
          this.headers = new Headers(options.headers);
          this.url = options.url || '';

          this._initBody(bodyInit);
        }

        Body.call(Response.prototype);

        Response.prototype.clone = function () {
          return new Response(this._bodyInit, {
            status: this.status,
            statusText: this.statusText,
            headers: new Headers(this.headers),
            url: this.url
          });
        };

        Response.error = function () {
          var response = new Response(null, {
            status: 0,
            statusText: ''
          });
          response.type = 'error';
          return response;
        };

        var redirectStatuses = [301, 302, 303, 307, 308];

        Response.redirect = function (url, status) {
          if (redirectStatuses.indexOf(status) === -1) {
            throw new RangeError('Invalid status code');
          }

          return new Response(null, {
            status: status,
            headers: {
              location: url
            }
          });
        };

        exports.DOMException = global.DOMException;

        try {
          new exports.DOMException();
        } catch (err) {
          exports.DOMException = function (message, name) {
            this.message = message;
            this.name = name;
            var error = Error(message);
            this.stack = error.stack;
          };

          exports.DOMException.prototype = Object.create(Error.prototype);
          exports.DOMException.prototype.constructor = exports.DOMException;
        }

        function fetch(input, init) {
          return new Promise(function (resolve, reject) {
            var request = new Request(input, init);

            if (request.signal && request.signal.aborted) {
              return reject(new exports.DOMException('Aborted', 'AbortError'));
            }

            var xhr = new XMLHttpRequest();

            function abortXhr() {
              xhr.abort();
            }

            xhr.onload = function () {
              var options = {
                status: xhr.status,
                statusText: xhr.statusText,
                headers: parseHeaders(xhr.getAllResponseHeaders() || '')
              };
              options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
              var body = 'response' in xhr ? xhr.response : xhr.responseText;
              setTimeout(function () {
                resolve(new Response(body, options));
              }, 0);
            };

            xhr.onerror = function () {
              setTimeout(function () {
                reject(new TypeError('Network request failed'));
              }, 0);
            };

            xhr.ontimeout = function () {
              setTimeout(function () {
                reject(new TypeError('Network request failed'));
              }, 0);
            };

            xhr.onabort = function () {
              setTimeout(function () {
                reject(new exports.DOMException('Aborted', 'AbortError'));
              }, 0);
            };

            function fixUrl(url) {
              try {
                return url === '' && global.location.href ? global.location.href : url;
              } catch (e) {
                return url;
              }
            }

            xhr.open(request.method, fixUrl(request.url), true);

            if (request.credentials === 'include') {
              xhr.withCredentials = true;
            } else if (request.credentials === 'omit') {
              xhr.withCredentials = false;
            }

            if ('responseType' in xhr) {
              if (support.blob) {
                xhr.responseType = 'blob';
              } else if (support.arrayBuffer && request.headers.get('Content-Type') && request.headers.get('Content-Type').indexOf('application/octet-stream') !== -1) {
                xhr.responseType = 'arraybuffer';
              }
            }

            if (init && _typeof$1(init.headers) === 'object' && !(init.headers instanceof Headers)) {
              Object.getOwnPropertyNames(init.headers).forEach(function (name) {
                xhr.setRequestHeader(name, normalizeValue(init.headers[name]));
              });
            } else {
              request.headers.forEach(function (value, name) {
                xhr.setRequestHeader(name, value);
              });
            }

            if (request.signal) {
              request.signal.addEventListener('abort', abortXhr);

              xhr.onreadystatechange = function () {
                // DONE (success or failure)
                if (xhr.readyState === 4) {
                  request.signal.removeEventListener('abort', abortXhr);
                }
              };
            }

            xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
          });
        }

        fetch.polyfill = true;

        if (!global.fetch) {
          global.fetch = fetch;
          global.Headers = Headers;
          global.Request = Request;
          global.Response = Response;
        }

        exports.Headers = Headers;
        exports.Request = Request;
        exports.Response = Response;
        exports.fetch = fetch;
        Object.defineProperty(exports, '__esModule', {
          value: true
        });
      });
    })(fetch_umd, fetch_umd.exports);

    function request(url, opts) {
        if (opts === void 0) { opts = {}; }
        return __awaiter$1(this, void 0, void 0, function () {
            var options, authToken, userId, authHeaders, spaceId, response, _a, _b, _c;
            return __generator$1(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        options = Object.assign({ method: "GET", compress: false }, opts);
                        authToken = getAuthToken();
                        userId = getUserId();
                        authHeaders = {
                            'X-Auth-Token': authToken,
                            'X-User-Id': userId
                        };
                        spaceId = options.spaceId || getSpaceId();
                        if (spaceId) {
                            authHeaders['X-Space-Id'] = spaceId;
                        }
                        options.headers = __assign(__assign({}, options.headers), authHeaders);
                        return [4 /*yield*/, fetch_umd.exports.fetch(url, options)];
                    case 1:
                        response = _d.sent();
                        if (!response.ok) return [3 /*break*/, 3];
                        return [4 /*yield*/, response.json()];
                    case 2: return [2 /*return*/, _d.sent()];
                    case 3:
                        _a = Error.bind;
                        _c = (_b = JSON).stringify;
                        return [4 /*yield*/, response.json()];
                    case 4: throw new (_a.apply(Error, [void 0, _c.apply(_b, [_d.sent()])]))();
                }
            });
        });
    }

    function getSelect(columns) {
        return _$5.uniq(_$5.compact(_$5.pluck(columns, 'field'))).map(function (n) {
            // odata请求中a.b需要换成a/b
            return n.replace(".", "/");
        });
    }
    function getExpand(columns) {
        return _$5.pluck(_$5.filter(columns, function (column) {
            if (column.hidden) {
                // 隐藏的字段不需要expand，比如grid那边的company_id、company_ids、locked等
                return false;
            }
            if (column.type === 'lookup' || column.type === 'master_detail') {
                return true;
            }
            return false;
        }), 'field');
    }
    function convertSortToString(sort) {
        return sort.map(function (n) {
            if (_$5.isArray(n)) {
                return n.join(" ");
            }
            else {
                return "".concat(n.field_name, " ").concat(n.order);
            }
        }).join(",");
    }
    function getODataFilter(options, $select) {
        if (options.filters || options.baseFilters || (options.search && $select)) {
            var searchMode = options.searchMode, baseFilters = options.baseFilters;
            var result = void 0, _filters = void 0, _query_1;
            if (options.filters && (options.filters.length || typeof options.filters === "function")) {
                _filters = options.filters;
            }
            if (options.search && $select) {
                $select = _$5.union($select, ["_id"]);
                _query_1 = [];
                $select.forEach(function (element, i) {
                    if (i > 0) {
                        _query_1.push('or');
                    }
                    _query_1.push([element, 'contains', options.search]);
                });
            }
            if (searchMode && _query_1) {
                result = _query_1;
            }
            else if (_filters && _query_1) {
                result = [_filters, 'and', _query_1];
            }
            else if (_filters) {
                result = _filters;
            }
            else if (_query_1) {
                result = _query_1;
            }
            if (result) {
                if (baseFilters) {
                    result = [baseFilters, 'and', result];
                }
            }
            else {
                if (baseFilters) {
                    result = baseFilters;
                }
            }
            if (!result) {
                return "";
            }
            var userContext = {};
            var state = window.store ? window.store.getState() : store.getState();
            if (state.entities.user) {
                // 新版本的bootstrap接口返回的是user，要处理下
                userContext.userId = state.entities.user.userId;
                userContext.spaceId = state.entities.user.spaceId;
                userContext.user = state.entities.user;
            }
            else {
                // 老版本的bootstrap接口返回的是USER_CONTEXT，直接取值
                userContext = state.entities.USER_CONTEXT;
            }
            return lib.formatFiltersToODataQuery(result, userContext);
        }
        else {
            return "";
        }
    }
    function query(service, options) {
        if (options === void 0) { options = { pageSize: 10, currentPage: 0 }; }
        return __awaiter$1(this, void 0, void 0, function () {
            var currentPage, pageSize, objectName, columns, sort, count, $select, $expand, skip, authToken, userId, endpoint, requestInit, baseQuery, query, odataFilter, odataUrl, spaceId, results;
            return __generator$1(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        currentPage = options.currentPage, pageSize = options.pageSize, objectName = options.objectName, columns = options.columns, sort = options.sort, count = options.count;
                        $select = getSelect(columns);
                        $expand = getExpand(columns);
                        skip = currentPage * pageSize;
                        authToken = getAuthToken();
                        userId = getUserId();
                        endpoint = options.endpoint ? options.endpoint : "".concat(service, "/api/v4/").concat(objectName);
                        requestInit = function () {
                            return {
                                headers: {
                                    'X-Auth-Token': authToken,
                                    'X-User-Id': userId
                                }
                            };
                        };
                        baseQuery = tsOdataClient.ODataV4QueryProvider.createQuery(endpoint, requestInit);
                        query = baseQuery.skip(skip || 0);
                        if (_$5.isNumber(pageSize)) {
                            query = query.top(pageSize);
                        }
                        if ($select) {
                            query = query.select.apply(query, $select);
                        }
                        _$5.each($expand, function (e) {
                            query = query.expand(e);
                        });
                        odataFilter = getODataFilter(options, $select);
                        odataUrl = query.provider.buildQuery(query.expression);
                        if (odataFilter) {
                            odataUrl = "".concat(odataUrl, "&$filter=").concat(encodeURIComponent(odataFilter));
                        }
                        if (_$5.isArray(sort)) {
                            sort = convertSortToString(sort);
                        }
                        if (sort) {
                            sort = sort.replace(/, /g, ",").trim(); //清除空格符
                            odataUrl = "".concat(odataUrl, "&$orderby=").concat(encodeURIComponent(sort));
                        }
                        if (count === undefined) {
                            odataUrl = "".concat(odataUrl, "&$count=false");
                        }
                        else {
                            odataUrl = "".concat(odataUrl, "&$count=").concat(count);
                        }
                        spaceId = options.spaceId || getSpaceId();
                        return [4 /*yield*/, request(odataUrl, { spaceId: spaceId })];
                    case 1:
                        results = _a.sent();
                        return [2 /*return*/, results];
                }
            });
        });
    }

    function createAction(actionType, partialStateName, partialStateValue, options) {
        return {
            type: actionType,
            payload: __assign({ partialStateName: partialStateName, partialStateValue: partialStateValue }, options)
        };
    }

    function keyMirror(obj) {
        var key;
        var mirrored = {};
        if (obj && typeof obj === 'object') {
            for (key in obj) {
                if (obj.hasOwnProperty(key)) {
                    mirrored[key] = key;
                }
            }
        }
        return mirrored;
    }

    var BootstrapTypes = keyMirror({
        GET_BOOTSTRAP_REQUEST: null,
        GET_BOOTSTRAP_SUCCESS: null,
        GET_BOOTSTRAP_FAILURE: null,
    });

    var FavoritesTypes = keyMirror({
        GET_FAVORITES_REQUEST: null,
        GET_FAVORITES_SUCCESS: null,
        GET_FAVORITES_FAILURE: null,
        CHANGE_FAVORITES_RECORDS: null,
        CHANGE_FAVORITES_ACTIONSELECTED: null,
        CHANGE_FAVORITES_ACTIONDISABLED: null,
        CHANGE_FAVORITES_ASSISTIVETEXT: null
    });

    function loadBootstrapDataRequest(dispatch, actionType, dataService, options) {
        dispatch(createAction(actionType, BootstrapTypes.GET_BOOTSTRAP_REQUEST, {}, {}));
        return loadBootstrapData(dataService, options).then(function (sauce) { return dispatch(loadBootstrapDataSauce(actionType, sauce)); }, function (error) { return dispatch(loadDataError$1(actionType, error, options)); });
    }
    function loadBootstrapData(dataService, options) {
        return __awaiter$1(this, void 0, void 0, function () {
            var spaceId, url;
            return __generator$1(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spaceId = options.spaceId || getSpaceId();
                        url = "".concat(dataService, "/api/bootstrap/").concat(spaceId);
                        return [4 /*yield*/, request(url)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    }
    function loadBootstrapDataSauce(actionType, results, options) {
        return createAction(actionType, BootstrapTypes.GET_BOOTSTRAP_SUCCESS, results, { objectName: 'bootstrap' });
    }
    function loadDataError$1(actionType, error, options) {
        return createAction(actionType, BootstrapTypes.GET_BOOTSTRAP_FAILURE, { error: error }, options);
    }

    var BOOTSTRAP_STATE_CHANGE_ACTION = 'BOOTSTRAP_STATE_CHANGE';
    function createBootstrapAction(partialStateName, partialStateValue) {
        return createAction(BOOTSTRAP_STATE_CHANGE_ACTION, partialStateName, partialStateValue, {});
    }
    function loadBootstrapEntitiesData(options) {
        return function (dispatch, getState) {
            var service = dataServicesSelector(getState());
            return loadBootstrapDataRequest(dispatch, BOOTSTRAP_STATE_CHANGE_ACTION, service, options);
        };
    }

    function transformEntityState$5(state, payload) {
        return Object.assign({}, state, __assign({}, payload.partialStateValue));
    }
    function reducer$d(state, action) {
        if (state === void 0) { state = {}; }
        if (action.type === BOOTSTRAP_STATE_CHANGE_ACTION) {
            var payload = action.payload;
            switch (payload.partialStateName) {
                case BootstrapTypes.GET_BOOTSTRAP_SUCCESS:
                    return transformEntityState$5(state, payload);
            }
            return state;
        }
        return state;
    }

    function updateState$1(oldState, newState) {
        return Object.assign({}, oldState, newState);
    }
    function reducer$c(state, action) {
        if (state === void 0) { state = {}; }
        switch (action.type) {
            case BOOTSTRAP_STATE_CHANGE_ACTION:
                return updateState$1(state, reducer$d(state, action));
        }
        return state;
    }

    var settings = function (state, action) {
        if (state === void 0) { state = {}; }
        switch (action.type) {
            case 'RECEIVED_SETTINGS':
                return Object.assign({}, state, action.data);
            default:
                return state;
        }
    };

    var _$2 = require('underscore');
    function loadEntitiesDataRequest(dispatch, actionType, dataService, options) {
        return loadData(dataService, options).then(function (sauce) { return dispatch(loadDataSauce(actionType, sauce, options)); }, function (error) { return dispatch(loadDataError(actionType, error, options)); });
    }
    function loadData(dataService, options) {
        return __awaiter$1(this, void 0, void 0, function () {
            return __generator$1(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, query(dataService, options)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    }
    function loadDataSauce(actionType, results, options) {
        var records = results.value;
        var totalCount = results["@odata.count"] || 0;
        records = records.map(function (item) {
            item.id = item._id;
            return item;
        });
        var partialStateName = 'loadDataSauce';
        if (!_$2.isEmpty(options.RequestStatus) && options.RequestStatus.SUCCESS) {
            partialStateName = options.RequestStatus.SUCCESS;
        }
        return createAction(actionType, partialStateName, { records: records, totalCount: totalCount }, options);
    }
    function loadDataError(actionType, error, options) {
        var partialStateName = 'loadDataError';
        if (!_$2.isEmpty(options.RequestStatus) && options.RequestStatus.FAILURE) {
            partialStateName = options.RequestStatus.FAILURE;
        }
        return createAction(actionType, partialStateName, { error: error }, options);
    }

    var GRID_STATE_CHANGE_ACTION = 'GRID_STATE_CHANGE';
    function createGridAction(partialStateName, partialStateValue, options) {
        if (["currentPage", "pageSize", "filters", "search"].includes(partialStateName)) {
            return function (dispatch, getState) {
                var _a;
                var entityState = viewStateSelector(getState(), options.id);
                var service = dataServicesSelector(getState());
                var newOptions = Object.assign({}, options, entityState, (_a = {}, _a[partialStateName] = partialStateValue, _a));
                if (["filters", "search"].includes(partialStateName)) {
                    newOptions = Object.assign({}, newOptions, { "currentPage": 0 });
                }
                dispatch(createGridAction("loading", true, options));
                loadEntitiesDataRequest(dispatch, GRID_STATE_CHANGE_ACTION, service, newOptions);
                dispatch(createAction(GRID_STATE_CHANGE_ACTION, partialStateName, partialStateValue, options));
            };
        }
        else {
            return createAction(GRID_STATE_CHANGE_ACTION, partialStateName, partialStateValue, options);
        }
    }
    function loadGridEntitiesData(options) {
        return function (dispatch, getState) {
            var service = dataServicesSelector(getState());
            dispatch(createGridAction("loading", true, options));
            return loadEntitiesDataRequest(dispatch, GRID_STATE_CHANGE_ACTION, service, options);
        };
    }

    var DXGRID_STATE_CHANGE_ACTION = 'DXGRID_STATE_CHANGE';
    function createDXGridAction(partialStateName, partialStateValue, options) {
        if (["currentPage", "pageSize", "filters"].includes(partialStateName)) {
            return function (dispatch, getState) {
                var _a;
                var entityState = entityStateSelector(getState(), options.objectName);
                var service = dataServicesSelector(getState());
                var newOptions = Object.assign({}, entityState, (_a = {}, _a[partialStateName] = partialStateValue, _a));
                loadEntitiesDataRequest(dispatch, DXGRID_STATE_CHANGE_ACTION, service, newOptions);
                dispatch(createAction(DXGRID_STATE_CHANGE_ACTION, partialStateName, partialStateValue, options));
            };
        }
        else {
            return createAction(DXGRID_STATE_CHANGE_ACTION, partialStateName, partialStateValue, options);
        }
    }
    function loadDXGridEntitiesData(options) {
        return function (dispatch, getState) {
            var service = dataServicesSelector(getState());
            return loadEntitiesDataRequest(dispatch, DXGRID_STATE_CHANGE_ACTION, service, options);
        };
    }

    var TREE_STATE_CHANGE_ACTION = 'TREE_STATE_CHANGE';
    var createTreeAction = function (partialStateName, partialStateValue, options) {
        return createAction(TREE_STATE_CHANGE_ACTION, partialStateName, partialStateValue, options);
    };
    function loadTreeEntitiesData(options) {
        return function (dispatch, getState) {
            var service = dataServicesSelector(getState());
            return loadEntitiesDataRequest(dispatch, TREE_STATE_CHANGE_ACTION, service, options);
        };
    }

    var ORGANIZATIONS_STATE_CHANGE_ACTION = 'ORGANIZATIONS_STATE_CHANGE';
    var createOrganizationsAction = function (partialStateName, partialStateValue, options) {
        return createAction(ORGANIZATIONS_STATE_CHANGE_ACTION, partialStateName, partialStateValue, options);
    };
    function loadOrganizationsEntitiesData(options) {
        if (options === void 0) { options = {}; }
        return function (dispatch, getState) {
            var service = dataServicesSelector(getState());
            return loadEntitiesDataRequest(dispatch, ORGANIZATIONS_STATE_CHANGE_ACTION, service, options);
        };
    }

    var CATEGORIES_STATE_CHANGE_ACTION = 'CATEGORIES_STATE_CHANGE';
    var createCategoriesAction = function (partialStateName, partialStateValue, options) {
        return createAction(CATEGORIES_STATE_CHANGE_ACTION, partialStateName, partialStateValue, options);
    };
    function loadCategoriesEntitiesData(options) {
        if (options === void 0) { options = {}; }
        return function (dispatch, getState) {
            var service = dataServicesSelector(getState());
            return loadEntitiesDataRequest(dispatch, CATEGORIES_STATE_CHANGE_ACTION, service, options);
        };
    }

    var FLOWSMODAL_STATE_CHANGE_ACTION = 'FLOWSMODAL_STATE_CHANGE';
    var createFlowsModalAction = function (partialStateName, partialStateValue, options) {
        return createAction(FLOWSMODAL_STATE_CHANGE_ACTION, partialStateName, partialStateValue, options);
    };

    var GRIDMODAL_STATE_CHANGE_ACTION = 'GRIDMODAL_STATE_CHANGE';
    var createGridModalAction = function (partialStateName, partialStateValue, options) {
        return createAction(GRIDMODAL_STATE_CHANGE_ACTION, partialStateName, partialStateValue, options);
    };

    var MODAL_STATE_CHANGE_ACTION = 'MODAL_STATE_CHANGE';
    var createModalAction = function (partialStateName, partialStateValue, options) {
        return createAction(MODAL_STATE_CHANGE_ACTION, partialStateName, partialStateValue, options);
    };

    var VIEWS_STATE_CHANGE_ACTION = 'VIEWS_STATE_CHANGE';
    var removeViewAction = function (viewId) {
        return createAction(VIEWS_STATE_CHANGE_ACTION, 'removeView', {}, { id: viewId });
    };

    var LOOKUP_STATE_CHANGE_ACTION = 'LOOKUP_STATE_CHANGE';
    var createLookupAction = function (partialStateName, partialStateValue, options) {
        return createAction(LOOKUP_STATE_CHANGE_ACTION, partialStateName, partialStateValue, options);
    };
    function loadLookupEntitiesData(options) {
        return function (dispatch, getState) {
            var service = dataServicesSelector(getState());
            return loadEntitiesDataRequest(dispatch, LOOKUP_STATE_CHANGE_ACTION, service, options);
        };
    }

    function executeApiRequest(dispatch, actionType, dataService, options) {
        return executeApi(dataService, options).then(function (sauce) { return dispatch(executeApiSauce(actionType, sauce, options)); }, function (error) { return dispatch(executeApiError(actionType, error, options)); });
    }
    function executeApi(dataService, options) {
        return __awaiter$1(this, void 0, void 0, function () {
            var url, method;
            return __generator$1(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = options.url, method = options.method;
                        return [4 /*yield*/, request(dataService + url, {
                                method: method ? method : "POST"
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    }
    function executeApiSauce(actionType, results, options) {
        return createAction(actionType, 'executeApiSauce', results, options);
    }
    function executeApiError(actionType, error, options) {
        return createAction(actionType, 'executeApiError', { error: error }, options);
    }

    var NOTIFICATIONS_STATE_CHANGE_ACTION = 'NOTIFICATIONS_STATE_CHANGE';
    var NOTIFICATIONS_COUNT_CHANGE_ACTION = 'NOTIFICATIONS_COUNT_CHANGE';
    var NOTIFICATIONS_INTERVAL_CHANGE_ACTION = 'NOTIFICATIONS_INTERVAL_CHANGE';
    function loadNotificationsData(options) {
        options = Object.assign({}, options, {
            objectName: "notifications",
            columns: [
                { field: "name" },
                { field: "body" },
                { field: "related_to" },
                { field: "related_name" },
                { field: "url" },
                { field: "owner" },
                { field: "is_read" },
                { field: "from" },
                { field: "created" }
            ]
        });
        if (!options.pageSize) {
            options.pageSize = 10;
        }
        if (!options.filters) {
            // 默认过滤当前用户收到的工作区范围所有通知
            options.filters = [
                ['owner', '=', '{userId}']
            ];
        }
        if (!options.sort) {
            options.sort = "created desc, name";
        }
        return function (dispatch, getState) {
            dispatch(loadNotificationsItems(options));
            dispatch(loadNotificationsCount(options));
        };
    }
    function loadNotificationsItems(options) {
        return function (dispatch, getState) {
            var service = dataServicesSelector(getState());
            dispatch(createAction(NOTIFICATIONS_STATE_CHANGE_ACTION, "loading", true, options));
            loadEntitiesDataRequest(dispatch, NOTIFICATIONS_STATE_CHANGE_ACTION, service, options);
        };
    }
    function loadNotificationsCount(options) {
        return function (dispatch, getState) {
            var service = dataServicesSelector(getState());
            // options.count = true;
            options = __assign(__assign({}, options), { count: true, pageSize: 0 });
            options.filters = __spreadArray$1([], options.filters, true);
            // 只显示未读数量
            options.filters.push([['is_read', '=', null], 'or', ['is_read', '=', false]]);
            dispatch(createAction(NOTIFICATIONS_COUNT_CHANGE_ACTION, "countLoading", true, options));
            loadEntitiesDataRequest(dispatch, NOTIFICATIONS_COUNT_CHANGE_ACTION, service, options);
        };
    }
    function loadNotificationsDataInterval(options) {
        return function (dispatch, getState) {
            var interval = options.interval ? options.interval : 5 * 60;
            var intervalCount = 1;
            var entityState = viewStateSelector(getState(), options.id);
            if (entityState && entityState.intervalId) {
                intervalCount = entityState.intervalCount + 1;
                clearTimeout(entityState.intervalId);
            }
            var intervalId = setTimeout(function () {
                dispatch(loadNotificationsDataInterval(options));
            }, interval * 1000);
            var intervalTime = new Date();
            dispatch(createAction(NOTIFICATIONS_INTERVAL_CHANGE_ACTION, 'startInterval', { intervalId: intervalId, intervalCount: intervalCount, intervalTime: intervalTime }, options));
            if (entityState && entityState.loading) {
                // 如果当前正在请求数据，说明网络可能有问题或者options.interval值太小执行间隔太短不执行请求。
                return;
            }
            dispatch(loadNotificationsData(options));
        };
    }
    function clearNotificationsInterval(options) {
        return function (dispatch, getState) {
            var entityState = viewStateSelector(getState(), options.id);
            if (entityState) {
                clearTimeout(entityState.intervalId);
            }
            dispatch(createAction(NOTIFICATIONS_INTERVAL_CHANGE_ACTION, 'clearInterval', { intervalId: null, intervalCount: 0, intervalTime: null }, options));
        };
    }
    function postNotificationsMethod(options) {
        return function (dispatch, getState) {
            var service = dataServicesSelector(getState());
            dispatch(createAction(NOTIFICATIONS_STATE_CHANGE_ACTION, "methodLoading", true, options));
            if (!options.url) {
                options.url = "/api/v4/notifications/".concat(options.methodRecordId, "/").concat(options.methodName);
            }
            return executeApiRequest(dispatch, NOTIFICATIONS_STATE_CHANGE_ACTION, service, options).then(function (sauce) {
                var entityState = viewStateSelector(getState(), options.id);
                var partialStateName = sauce.payload.partialStateName;
                var partialStateValue = sauce.payload.partialStateValue;
                if (partialStateName === "executeApiSauce" && partialStateValue.success) {
                    if (options.methodName === "markReadAll") {
                        // 如果全部标记为已读成功，则自动设置store中所有通知记录为已读状态
                        var records = __spreadArray$1([], entityState.rows, true);
                        records = records.map(function (item) {
                            var re = __assign({}, item);
                            re.is_read = true;
                            return re;
                        });
                        dispatch(createAction(NOTIFICATIONS_STATE_CHANGE_ACTION, options.methodName, { records: records }, options));
                    }
                }
                else if (partialStateName === "executeApiError" || !partialStateValue.success) {
                    dispatch(createAction(NOTIFICATIONS_STATE_CHANGE_ACTION, "executeApiError", partialStateValue, options));
                }
            });
        };
    }

    var FAVORITES_STATE_CHANGE_ACTION = 'FAVORITES_STATE_CHANGE';
    function loadFavoritesEntitiesData(options) {
        return function (dispatch, getState) {
            dispatch(createAction(FAVORITES_STATE_CHANGE_ACTION, FavoritesTypes.GET_FAVORITES_REQUEST, {}, {}));
            var service = dataServicesSelector(getState());
            return loadEntitiesDataRequest(dispatch, FAVORITES_STATE_CHANGE_ACTION, service, Object.assign({ RequestStatus: {
                    SUCCESS: FavoritesTypes.GET_FAVORITES_SUCCESS,
                    FAILURE: FavoritesTypes.GET_FAVORITES_FAILURE
                } }, options));
        };
    }
    function changeActionSelected$1(actionSelected, id) {
        return function (dispatch, getState) {
            dispatch(createAction(FAVORITES_STATE_CHANGE_ACTION, FavoritesTypes.CHANGE_FAVORITES_ACTIONSELECTED, { actionSelected: actionSelected }, { id: id }));
        };
    }
    function changeActionDisabled$1(actionDisabled, id) {
        return function (dispatch, getState) {
            dispatch(createAction(FAVORITES_STATE_CHANGE_ACTION, FavoritesTypes.CHANGE_FAVORITES_ACTIONDISABLED, { actionDisabled: actionDisabled }, { id: id }));
        };
    }
    function changeRecords$1(records, id) {
        return function (dispatch, getState) {
            dispatch(createAction(FAVORITES_STATE_CHANGE_ACTION, FavoritesTypes.CHANGE_FAVORITES_RECORDS, { records: records }, { id: id }));
        };
    }
    function changeAssistiveText$1(assistiveText, id) {
        return function (dispatch, getState) {
            dispatch(createAction(FAVORITES_STATE_CHANGE_ACTION, FavoritesTypes.CHANGE_FAVORITES_ASSISTIVETEXT, { assistiveText: assistiveText }, { id: id }));
        };
    }

    function n(n) {
      for (var t = arguments.length, r = Array(t > 1 ? t - 1 : 0), e = 1; e < t; e++) {
        r[e - 1] = arguments[e];
      }

      throw Error("[Immer] minified error nr: " + n + (r.length ? " " + r.join(",") : "") + ". Find the full error at: https://bit.ly/3cXEKWf");
    }

    function t(n) {
      return !!n && !!n[G];
    }

    function r(n) {
      return !!n && (function (n) {
        if (!n || "object" != _typeof$1(n)) return !1;
        var t = Object.getPrototypeOf(n);
        return !t || t === Object.prototype;
      }(n) || Array.isArray(n) || !!n[B] || !!n.constructor[B] || c(n) || s(n));
    }

    function i(n, t, r) {
      void 0 === r && (r = !1), 0 === o(n) ? (r ? Object.keys : Q)(n).forEach(function (r) {
        return t(r, n[r], n);
      }) : n.forEach(function (r, e) {
        return t(e, r, n);
      });
    }

    function o(n) {
      var t = n[G];
      return t ? t.i > 3 ? t.i - 4 : t.i : Array.isArray(n) ? 1 : c(n) ? 2 : s(n) ? 3 : 0;
    }

    function u(n, t) {
      return 2 === o(n) ? n.has(t) : Object.prototype.hasOwnProperty.call(n, t);
    }

    function a(n, t) {
      return 2 === o(n) ? n.get(t) : n[t];
    }

    function f(n, t) {
      return n === t ? 0 !== n || 1 / n == 1 / t : n != n && t != t;
    }

    function c(n) {
      return U && n instanceof Map;
    }

    function s(n) {
      return W && n instanceof Set;
    }

    function v(n) {
      return n.o || n.t;
    }

    function p(t, r) {
      if (void 0 === r && (r = !1), Array.isArray(t)) return t.slice();
      var e = Object.create(Object.getPrototypeOf(t));
      return i(t, function (i) {
        if (i !== G) {
          var o = Object.getOwnPropertyDescriptor(t, i),
              u = o.value;
          o.get && (r || n(1), u = o.get.call(t)), o.enumerable ? e[i] = u : Object.defineProperty(e, i, {
            value: u,
            writable: !0,
            configurable: !0
          });
        }
      }), e;
    }

    function d(n, e) {
      t(n) || h(n) || !r(n) || (o(n) > 1 && (n.set = n.add = n.clear = n.delete = l), Object.freeze(n), e && i(n, function (n, t) {
        return d(t, !0);
      }, !0));
    }

    function l() {
      n(2);
    }

    function h(n) {
      return null == n || "object" != _typeof$1(n) || Object.isFrozen(n);
    }

    function y(t) {
      var r = V[t];
      return r || n(19, t), r;
    }

    function m() {
      return K;
    }

    function _$1(n, t) {
      t && (y("Patches"), n.u = [], n.s = [], n.v = t);
    }

    function j(n) {
      O(n), n.p.forEach(w), n.p = null;
    }

    function O(n) {
      n === K && (K = n.l);
    }

    function g(n) {
      return K = {
        p: [],
        l: K,
        h: n,
        m: !0,
        _: 0
      };
    }

    function w(n) {
      var t = n[G];
      0 === t.i || 1 === t.i ? t.j() : t.O = !0;
    }

    function S(t, e) {
      e._ = e.p.length;
      var i = e.p[0],
          o = void 0 !== t && t !== i;
      return e.h.g || y("ES5").S(e, t, o), o ? (i[G].P && (j(e), n(4)), r(t) && (t = P(e, t), e.l || A(e, t)), e.u && y("Patches").M(i[G], t, e.u, e.s)) : t = P(e, i, []), j(e), e.u && e.v(e.u, e.s), t !== q ? t : void 0;
    }

    function P(n, t, r) {
      if (h(t)) return t;
      var e = t[G];
      if (!e) return i(t, function (i, o) {
        return M(n, e, t, i, o, r);
      }, !0), t;
      if (e.A !== n) return t;
      if (!e.P) return A(n, e.t, !0), e.t;

      if (!e.I) {
        e.I = !0, e.A._--;
        var o = 4 === e.i || 5 === e.i ? e.o = p(e.k, !0) : e.o;
        i(o, function (t, i) {
          return M(n, e, o, t, i, r);
        }), A(n, o, !1), r && n.u && y("Patches").R(e, r, n.u, n.s);
      }

      return e.o;
    }

    function M(e, i, c, s, v, p) {
      if (t(v)) {
        var d = P(e, v, p && i && 3 !== i.i && !u(i.D, s) ? p.concat(s) : void 0);
        if (h = s, y = d, 2 === (b = o(l = c)) ? l.set(h, y) : 3 === b ? (l.delete(h), l.add(y)) : l[h] = y, !t(d)) return;
        e.m = !1;
      }

      var l, h, y, b;

      if ((!i || !f(v, a(i.t, s))) && r(v)) {
        if (!e.h.N && e._ < 1) return;
        P(e, v), i && i.A.l || A(e, v);
      }
    }

    function A(n, t, r) {
      void 0 === r && (r = !1), n.h.N && n.m && d(t, r);
    }

    function x(n, t) {
      var r = n[G],
          e = Reflect.getOwnPropertyDescriptor(r ? v(r) : n, t);
      return e && e.value;
    }

    function z(n) {
      if (!n.P) {
        if (n.P = !0, 0 === n.i || 1 === n.i) {
          var t = n.o = p(n.t);
          i(n.p, function (n, r) {
            t[n] = r;
          }), n.p = void 0;
        }

        n.l && z(n.l);
      }
    }

    function I(n) {
      n.o || (n.o = p(n.t));
    }

    function E(n, t, r) {
      var e = c(t) ? y("MapSet").T(t, r) : s(t) ? y("MapSet").F(t, r) : n.g ? function (n, t) {
        var r = Array.isArray(n),
            e = {
          i: r ? 1 : 0,
          A: t ? t.A : m(),
          P: !1,
          I: !1,
          D: {},
          l: t,
          t: n,
          k: null,
          p: {},
          o: null,
          j: null,
          C: !1
        },
            i = e,
            o = Y;
        r && (i = [e], o = Z);
        var u = Proxy.revocable(i, o),
            a = u.revoke,
            f = u.proxy;
        return e.k = f, e.j = a, f;
      }(t, r) : y("ES5").J(t, r);
      return (r ? r.A : m()).p.push(e), e;
    }

    var J,
        K,
        $ = "undefined" != typeof Symbol && "symbol" == _typeof$1(Symbol("x")),
        U = "undefined" != typeof Map,
        W = "undefined" != typeof Set,
        X = "undefined" != typeof Proxy && void 0 !== Proxy.revocable && "undefined" != typeof Reflect,
        q = $ ? Symbol("immer-nothing") : ((J = {})["immer-nothing"] = !0, J),
        B = $ ? Symbol("immer-draftable") : "__$immer_draftable",
        G = $ ? Symbol("immer-state") : "__$immer_state",
        Q = "undefined" != typeof Reflect && Reflect.ownKeys ? Reflect.ownKeys : void 0 !== Object.getOwnPropertySymbols ? function (n) {
      return Object.getOwnPropertyNames(n).concat(Object.getOwnPropertySymbols(n));
    } : Object.getOwnPropertyNames,
        V = {},
        Y = {
      get: function get(n, t) {
        if (t === G) return n;
        var e = n.p;
        if (!n.P && u(e, t)) return e[t];
        var i = v(n)[t];
        if (n.I || !r(i)) return i;

        if (n.P) {
          if (i !== x(n.t, t)) return i;
          e = n.o;
        }

        return e[t] = E(n.A.h, i, n);
      },
      has: function has(n, t) {
        return t in v(n);
      },
      ownKeys: function ownKeys(n) {
        return Reflect.ownKeys(v(n));
      },
      set: function set(n, t, r) {
        if (!n.P) {
          var e = x(n.t, t);
          if (r ? f(e, r) || r === n.p[t] : f(e, r) && t in n.t) return !0;
          I(n), z(n);
        }

        return n.D[t] = !0, n.o[t] = r, !0;
      },
      deleteProperty: function deleteProperty(n, t) {
        return void 0 !== x(n.t, t) || t in n.t ? (n.D[t] = !1, I(n), z(n)) : n.D[t] && delete n.D[t], n.o && delete n.o[t], !0;
      },
      getOwnPropertyDescriptor: function getOwnPropertyDescriptor(n, t) {
        var r = v(n),
            e = Reflect.getOwnPropertyDescriptor(r, t);
        return e && (e.writable = !0, e.configurable = 1 !== n.i || "length" !== t), e;
      },
      defineProperty: function defineProperty() {
        n(11);
      },
      getPrototypeOf: function getPrototypeOf(n) {
        return Object.getPrototypeOf(n.t);
      },
      setPrototypeOf: function setPrototypeOf() {
        n(12);
      }
    },
        Z = {};

    i(Y, function (n, t) {
      Z[n] = function () {
        return arguments[0] = arguments[0][0], t.apply(this, arguments);
      };
    }), Z.deleteProperty = function (t, r) {
      return Y.deleteProperty.call(this, t[0], r);
    }, Z.set = function (t, r, e) {
      return Y.set.call(this, t[0], r, e, t[0]);
    };

    var nn = function () {
      function e(n) {
        this.g = X, this.N = "production" !== "production", "boolean" == typeof (null == n ? void 0 : n.useProxies) && this.setUseProxies(n.useProxies), "boolean" == typeof (null == n ? void 0 : n.autoFreeze) && this.setAutoFreeze(n.autoFreeze), this.produce = this.produce.bind(this), this.produceWithPatches = this.produceWithPatches.bind(this);
      }

      var i = e.prototype;
      return i.produce = function (t, e, i) {
        if ("function" == typeof t && "function" != typeof e) {
          var o = e;
          e = t;
          var u = this;
          return function (n) {
            var t = this;
            void 0 === n && (n = o);

            for (var r = arguments.length, i = Array(r > 1 ? r - 1 : 0), a = 1; a < r; a++) {
              i[a - 1] = arguments[a];
            }

            return u.produce(n, function (n) {
              var r;
              return (r = e).call.apply(r, [t, n].concat(i));
            });
          };
        }

        var a;

        if ("function" != typeof e && n(6), void 0 !== i && "function" != typeof i && n(7), r(t)) {
          var f = g(this),
              c = E(this, t, void 0),
              s = !0;

          try {
            a = e(c), s = !1;
          } finally {
            s ? j(f) : O(f);
          }

          return "undefined" != typeof Promise && a instanceof Promise ? a.then(function (n) {
            return _$1(f, i), S(n, f);
          }, function (n) {
            throw j(f), n;
          }) : (_$1(f, i), S(a, f));
        }

        if ((a = e(t)) !== q) return void 0 === a && (a = t), this.N && d(a, !0), a;
      }, i.produceWithPatches = function (n, t) {
        var r,
            e,
            i = this;
        return "function" == typeof n ? function (t) {
          for (var r = arguments.length, e = Array(r > 1 ? r - 1 : 0), o = 1; o < r; o++) {
            e[o - 1] = arguments[o];
          }

          return i.produceWithPatches(t, function (t) {
            return n.apply(void 0, [t].concat(e));
          });
        } : [this.produce(n, t, function (n, t) {
          r = n, e = t;
        }), r, e];
      }, i.createDraft = function (t) {
        r(t) || n(8);
        var e = g(this),
            i = E(this, t, void 0);
        return i[G].C = !0, O(e), i;
      }, i.finishDraft = function (t, r) {
        var e = t && t[G];
        var i = e.A;
        return _$1(i, r), S(void 0, i);
      }, i.setAutoFreeze = function (n) {
        this.N = n;
      }, i.setUseProxies = function (t) {
        X || n(20), this.g = t;
      }, i.applyPatches = function (n, r) {
        var e;

        for (e = r.length - 1; e >= 0; e--) {
          var i = r[e];

          if (0 === i.path.length && "replace" === i.op) {
            n = i.value;
            break;
          }
        }

        var o = y("Patches").U;
        return t(n) ? o(n, r) : this.produce(n, function (n) {
          return o(n, r.slice(e + 1));
        });
      }, e;
    }(),
        tn = new nn(),
        rn = tn.produce;
        tn.produceWithPatches.bind(tn);
        tn.setAutoFreeze.bind(tn);
        tn.setUseProxies.bind(tn);
        tn.applyPatches.bind(tn);
        tn.createDraft.bind(tn);
        tn.finishDraft.bind(tn);

    var produce = rn;

    /**
     * return: {id: {label: ,type: , id}}
     * @param records 待转换的数据
     */
    function transformData(records) {
        var items = {};
        records.forEach(function (element) {
            var item = { id: element._id, label: element.name };
            if (_$5.isEmpty(element.children)) {
                item.type = 'item';
            }
            else {
                item.type = 'branch';
                item.nodes = element.children;
            }
            items[element._id] = item;
        });
        return items;
    }
    //TODO: 优化expandClick，click
    var reducer$b = produce(function (draft, action) {
        if (draft === void 0) { draft = {}; }
        if (action.type === TREE_STATE_CHANGE_ACTION) {
            var payload = action.payload;
            var value = payload.partialStateValue;
            var nodeId = value.node ? value.node.id : "";
            switch (payload.partialStateName) {
                case 'expandClick':
                    draft.nodes[value.node.id]["expanded"] = value.expand;
                    break;
                case 'click':
                    var selectedNodeIds = draft.selectedNode || [];
                    if (selectedNodeIds.length > 0) {
                        draft.nodes[selectedNodeIds[0]].selected = false;
                    }
                    var selected = value.select ? true : value.node.selected;
                    draft.nodes[nodeId]["selected"] = selected;
                    if (selected) {
                        draft.selectedNode = [nodeId];
                    }
                    break;
                case 'loadDataSauce':
                    draft.nodes = transformData(payload.partialStateValue.records);
                    draft.totalCount = payload.partialStateValue.totalCount;
                    break;
                case 'changeNode':
                    draft.nodes[value.node.id] = Object.assign({}, draft.nodes[value.node.id], value.node);
                    break;
                case 'changeNodes':
                    _$5.each(value.nodes, function (node) {
                        draft.nodes[node.id] = Object.assign({}, draft.nodes[node.id], node);
                    });
                    break;
                case 'setNode':
                    draft.nodes[value.node.id] = Object.assign({}, value.node);
                    break;
                case 'setNodes':
                    draft.nodes = value.nodes;
                    break;
            }
            draft[payload.partialStateName] = payload.partialStateValue;
            // return Object.assign({}, draft, { [payload.partialStateName]: payload.partialStateValue });
        }
        return draft;
    });

    function transformEntityState$4(state, payload) {
        return Object.assign({}, state, { rows: payload.partialStateValue.records, totalCount: payload.partialStateValue.totalCount });
    }
    function reducer$a(state, action) {
        var _a;
        if (state === void 0) { state = {}; }
        if (action.type === DXGRID_STATE_CHANGE_ACTION) {
            var payload = action.payload;
            switch (payload.partialStateName) {
                case 'loadDataSauce':
                    return transformEntityState$4(state, payload);
            }
            return Object.assign({}, state, (_a = {}, _a[payload.partialStateName] = payload.partialStateValue, _a));
        }
        return state;
    }

    function transformEntityState$3(state, payload, options) {
        return Object.assign({}, state, { rows: payload.partialStateValue.records, totalCount: payload.partialStateValue.totalCount }, options);
    }
    function reducer$9(state, action) {
        var _a;
        if (state === void 0) { state = {}; }
        if (action.type === GRID_STATE_CHANGE_ACTION) {
            var payload = action.payload;
            switch (payload.partialStateName) {
                case 'loadDataSauce':
                    return transformEntityState$3(state, payload, { loading: false });
                case 'requestRemoveSelectedOption':
                    return Object.assign({}, state, { selection: payload.partialStateValue });
                case 'search':
                    return Object.assign({}, state, { search: payload.partialStateValue }, { loading: false, currentPage: 0 });
                case 'filters':
                    return Object.assign({}, state, { loading: true, currentPage: 0 });
                case 'currentPage':
                    return Object.assign({}, state, { currentPage: payload.partialStateValue }, { loading: true });
            }
            return Object.assign({}, state, (_a = {}, _a[payload.partialStateName] = payload.partialStateValue, _a));
        }
        return state;
    }

    function getRootNodes$1(records) {
        if (records.length > 0) {
            return _$5.map(records, function (record) {
                return {
                    expanded: true,
                    id: record._id,
                    label: record.name,
                    selected: true,
                    type: 'branch',
                    nodes: record.children || []
                };
            });
        }
        return _$5.pluck(records, '_id');
    }
    function reducer$8(state, action) {
        var _a;
        if (state === void 0) { state = {}; }
        if (action.type === ORGANIZATIONS_STATE_CHANGE_ACTION) {
            var payload = action.payload;
            switch (payload.partialStateName) {
                case 'loadDataSauce':
                    return Object.assign({}, state, { rootNodes: getRootNodes$1(payload.partialStateValue.records) });
            }
            return Object.assign({}, state, (_a = {}, _a[payload.partialStateName] = payload.partialStateValue, _a));
        }
        return state;
    }

    function transformEntityState$2(state, payload, options) {
        return Object.assign({}, state, { rows: payload.partialStateValue.records, totalCount: payload.partialStateValue.totalCount }, options);
    }
    function transformEntityStateForCount(state, payload, options) {
        return Object.assign({}, state, { unreadCount: payload.partialStateValue.totalCount }, options);
    }
    function transformEntityStateForMark(state, payload, options) {
        return Object.assign({}, state, { rows: payload.partialStateValue.records, unreadCount: 0 }, options);
    }
    function reducer$7(state, action) {
        var _a;
        if (state === void 0) { state = {}; }
        var payload = action.payload;
        var defaultPayLoad = (_a = {}, _a[payload.partialStateName] = payload.partialStateValue, _a);
        if (action.type === NOTIFICATIONS_STATE_CHANGE_ACTION) {
            switch (payload.partialStateName) {
                case 'loadDataSauce':
                    return transformEntityState$2(state, payload, { loading: false, itemsLoaded: true });
                case 'loadDataError':
                    return Object.assign({}, state, defaultPayLoad, { loading: false });
                case 'executeApiSauce':
                    return Object.assign({}, state, defaultPayLoad, { methodLoading: false });
                case 'executeApiError':
                    return Object.assign({}, state, defaultPayLoad, { methodLoading: false });
                case 'markReadAll':
                    return transformEntityStateForMark(state, payload, {});
            }
            return Object.assign({}, state, defaultPayLoad);
        }
        else if (action.type === NOTIFICATIONS_COUNT_CHANGE_ACTION) {
            switch (payload.partialStateName) {
                case 'loadDataSauce':
                    return transformEntityStateForCount(state, payload, { countLoading: false });
                case 'loadDataError':
                    return Object.assign({}, state, defaultPayLoad, { countLoading: false });
            }
            return Object.assign({}, state, defaultPayLoad);
        }
        else if (action.type === NOTIFICATIONS_INTERVAL_CHANGE_ACTION) {
            return Object.assign({}, state, {
                intervalId: payload.partialStateValue.intervalId,
                intervalCount: payload.partialStateValue.intervalCount,
                intervalTime: payload.partialStateValue.intervalTime
            });
        }
        return state;
    }

    function transformEntityState$1(state, payload) {
        return Object.assign({}, state, { records: payload.partialStateValue.records, totalCount: payload.partialStateValue.totalCount });
    }
    function changeActionSelected(state, payload) {
        return Object.assign({}, state, { actionSelected: payload.partialStateValue.actionSelected });
    }
    function changeActionDisabled(state, payload) {
        return Object.assign({}, state, { actionDisabled: payload.partialStateValue.actionDisabled });
    }
    function changeRecords(state, payload) {
        return Object.assign({}, state, { records: payload.partialStateValue.records, totalCount: payload.partialStateValue.records.length });
    }
    function changeAssistiveText(state, payload) {
        return Object.assign({}, state, { assistiveText: payload.partialStateValue.assistiveText });
    }
    function reducer$6(state, action) {
        if (state === void 0) { state = {}; }
        if (action.type === FAVORITES_STATE_CHANGE_ACTION) {
            var payload = action.payload;
            switch (payload.partialStateName) {
                case FavoritesTypes.GET_FAVORITES_SUCCESS:
                    return transformEntityState$1(state, payload);
                case FavoritesTypes.CHANGE_FAVORITES_ACTIONSELECTED:
                    return changeActionSelected(state, payload);
                case FavoritesTypes.CHANGE_FAVORITES_ACTIONDISABLED:
                    return changeActionDisabled(state, payload);
                case FavoritesTypes.CHANGE_FAVORITES_RECORDS:
                    return changeRecords(state, payload);
                case FavoritesTypes.CHANGE_FAVORITES_ASSISTIVETEXT:
                    return changeAssistiveText(state, payload);
            }
            return state;
        }
        return state;
    }

    function getRootNodes(records) {
        return _$5.pluck(records, '_id');
    }
    function reducer$5(state, action) {
        var _a;
        if (state === void 0) { state = {}; }
        if (action.type === CATEGORIES_STATE_CHANGE_ACTION) {
            var payload = action.payload;
            switch (payload.partialStateName) {
                case 'loadDataSauce':
                    return Object.assign({}, state, { rootNodes: getRootNodes(payload.partialStateValue.records) });
            }
            return Object.assign({}, state, (_a = {}, _a[payload.partialStateName] = payload.partialStateValue, _a));
        }
        return state;
    }

    function reducer$4(state, action) {
        var _a;
        if (state === void 0) { state = {}; }
        if (action.type === FLOWSMODAL_STATE_CHANGE_ACTION) {
            var payload = action.payload;
            return Object.assign({}, state, (_a = {}, _a[payload.partialStateName] = payload.partialStateValue, _a));
        }
        return state;
    }

    function reducer$3(state, action) {
        var _a;
        if (state === void 0) { state = {}; }
        if (action.type === GRIDMODAL_STATE_CHANGE_ACTION) {
            var payload = action.payload;
            return Object.assign({}, state, (_a = {}, _a[payload.partialStateName] = payload.partialStateValue, _a));
        }
        return state;
    }

    function transformEntityState(state, payload, options) {
        return Object.assign({}, state, { rows: payload.partialStateValue.records }, options);
    }
    function reducer$2(state, action) {
        var _a;
        if (state === void 0) { state = {}; }
        if (action.type === LOOKUP_STATE_CHANGE_ACTION) {
            var payload = action.payload;
            switch (payload.partialStateName) {
                case 'loadDataSauce':
                    return transformEntityState(state, payload, { loading: false });
            }
            return Object.assign({}, state, (_a = {}, _a[payload.partialStateName] = payload.partialStateValue, _a));
        }
        return state;
    }

    function reducer$1(state, action) {
        var _a;
        if (state === void 0) { state = {}; }
        if (action.type === MODAL_STATE_CHANGE_ACTION) {
            var payload = action.payload;
            return Object.assign({}, state, (_a = {}, _a[payload.partialStateName] = payload.partialStateValue, _a));
        }
        return state;
    }

    function changeState(id, draft, newState) {
        return draft[id] = newState;
    }
    function getState(state, id) {
        return state ? state[id] : { id: id };
    }
    var byId = produce(function (draft, action) {
        if (draft === void 0) { draft = {}; }
        var id, viewState;
        if (action.payload) {
            id = action.payload.id;
            viewState = getState(draft, id);
        }
        switch (action.type) {
            case DXGRID_STATE_CHANGE_ACTION:
                changeState(id, draft, reducer$a(viewState, action));
                break;
            case GRID_STATE_CHANGE_ACTION:
                changeState(id, draft, reducer$9(viewState, action));
                break;
            case TREE_STATE_CHANGE_ACTION:
                changeState(id, draft, reducer$b(viewState, action));
                break;
            case ORGANIZATIONS_STATE_CHANGE_ACTION:
                changeState(id, draft, reducer$8(viewState, action));
                break;
            case NOTIFICATIONS_STATE_CHANGE_ACTION:
                changeState(id, draft, reducer$7(viewState, action));
                break;
            case NOTIFICATIONS_COUNT_CHANGE_ACTION:
                changeState(id, draft, reducer$7(viewState, action));
                break;
            case NOTIFICATIONS_INTERVAL_CHANGE_ACTION:
                changeState(id, draft, reducer$7(viewState, action));
                break;
            case FAVORITES_STATE_CHANGE_ACTION:
                changeState(id, draft, reducer$6(viewState, action));
                break;
            case CATEGORIES_STATE_CHANGE_ACTION:
                changeState(id, draft, reducer$5(viewState, action));
                break;
            case FLOWSMODAL_STATE_CHANGE_ACTION:
                changeState(id, draft, reducer$4(viewState, action));
                break;
            case GRIDMODAL_STATE_CHANGE_ACTION:
                changeState(id, draft, reducer$3(viewState, action));
                break;
            case LOOKUP_STATE_CHANGE_ACTION:
                changeState(id, draft, reducer$2(viewState, action));
                break;
            case MODAL_STATE_CHANGE_ACTION:
                changeState(id, draft, reducer$1(viewState, action));
                break;
            case VIEWS_STATE_CHANGE_ACTION:
                changeState(id, draft, {});
                break;
        }
        return draft;
    });
    var viewsReducer = combineReducers({
        byId: byId
    });

    var PLUGIN_INSTANCE_RECEIVED_ACTION = 'PLUGIN_INSTANCE_RECEIVED';
    var PLUGIN_COMPONENT_RECEIVED_ACTION = 'PLUGIN_COMPONENT_RECEIVED';
    function receivePluginInstance(name, instance) {
        return createAction(PLUGIN_INSTANCE_RECEIVED_ACTION, 'received', { name: name, instance: instance }, null);
    }
    function receivePluginComponent(name, data) {
        return createAction(PLUGIN_COMPONENT_RECEIVED_ACTION, 'received', { name: name, data: data }, null);
    }

    function updateState(oldState, newState) {
        return Object.assign({}, oldState, newState);
    }
    function transformInstanceState(oldState, newState) {
        var _a;
        var result = oldState.instances ? oldState.instances : {};
        result = Object.assign({}, result, (_a = {}, _a[newState.name] = newState.instance, _a));
        return updateState(oldState, { "instances": result });
    }
    function transformObjectHomeComponentState(oldState, newState) {
        var result = oldState.components ? oldState.components : {};
        var resultName = result[newState.name] ? __spreadArray$1([], result[newState.name], true) : [];
        if (resultName.find(function (n) { return newState.data && n.id === newState.data.id; })) {
            console.warn("The same plugin component ".concat(newState.data.id, " is already exists,you need to check your repeated component id"));
        }
        resultName.push(newState.data);
        result[newState.name] = resultName;
        return updateState(oldState, { "components": result });
    }
    function reducer(state, action) {
        var _a, _b;
        if (state === void 0) { state = {}; }
        if (action.type === PLUGIN_INSTANCE_RECEIVED_ACTION) {
            var payload = action.payload;
            switch (payload.partialStateName) {
                case "received":
                    return transformInstanceState(state, payload.partialStateValue);
            }
            return Object.assign({}, state, (_a = {}, _a[payload.partialStateName] = payload.partialStateValue, _a));
        }
        else if (action.type === PLUGIN_COMPONENT_RECEIVED_ACTION) {
            var payload = action.payload;
            switch (payload.partialStateName) {
                case "received":
                    return transformObjectHomeComponentState(state, payload.partialStateValue);
            }
            return Object.assign({}, state, (_b = {}, _b[payload.partialStateName] = payload.partialStateValue, _b));
        }
        return state;
    }

    // Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
    function initialRequestState() {
        return {
            status: exports.RequestStatusOption.NOT_STARTED,
            error: null,
        };
    }
    function handleRequest(REQUEST, SUCCESS, FAILURE, state, action) {
        switch (action.type) {
            case REQUEST:
                return __assign(__assign({}, state), { status: exports.RequestStatusOption.STARTED });
            case SUCCESS:
                return __assign(__assign({}, state), { status: exports.RequestStatusOption.SUCCESS, error: null });
            case FAILURE: {
                return __assign(__assign({}, state), { status: exports.RequestStatusOption.FAILURE, error: action.error });
            }
            default:
                return state;
        }
    }

    function getBootStrap(state, action) {
        if (state === void 0) { state = initialRequestState(); }
        if (action.type === BOOTSTRAP_STATE_CHANGE_ACTION) {
            var payload = action.payload;
            var partialStateValue = payload.partialStateValue;
            var error = partialStateValue.error ? partialStateValue.error.toString() : '';
            var newState = handleRequest(BootstrapTypes.GET_BOOTSTRAP_REQUEST, BootstrapTypes.GET_BOOTSTRAP_SUCCESS, BootstrapTypes.GET_BOOTSTRAP_FAILURE, state, { type: payload.partialStateName, error: error, data: partialStateValue });
            return newState;
        }
        return state;
    }
    var bootStrap = combineReducers({
        getBootStrap: getBootStrap
    });

    var requests = combineReducers({
        bootStrap: bootStrap
    });

    var combinedReducer = combineReducers({
        entities: reducer$c,
        settings: settings,
        views: viewsReducer,
        plugins: reducer,
        requests: requests
    });
    // function updateState(oldState: any, newState: any){
    //     return Object.assign({}, oldState, newState)
    // }
    function crossSliceReducer(state, action) {
        if (action.type === TREE_STATE_CHANGE_ACTION) {
            switch (action.partialStateName) {
                default:
                    return state;
            }
        }
        else {
            return state;
        }
    }
    function rootReducer(state, action) {
        var intermediateState = combinedReducer(state, action);
        var finalState = crossSliceReducer(intermediateState, action);
        return finalState;
    }

    var require$$0 = /*@__PURE__*/getAugmentedNamespace(redux);

    var compose = require$$0.compose;
    var composeWithDevTools = typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : function () {
      if (arguments.length === 0) return undefined;
      if (_typeof$1(arguments[0]) === 'object') return compose;
      return compose.apply(null, arguments);
    };

    (function (module, exports) {

      (function (global, factory) {
        typeof commonjsRequire === 'function' ? factory(moment$2.exports) : factory(global.moment);
      })(commonjsGlobal, function (moment) {

        var zhCn = moment.defineLocale('zh-cn', {
          months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
          monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
          weekdays: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
          weekdaysShort: '周日_周一_周二_周三_周四_周五_周六'.split('_'),
          weekdaysMin: '日_一_二_三_四_五_六'.split('_'),
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'YYYY/MM/DD',
            LL: 'YYYY年M月D日',
            LLL: 'YYYY年M月D日Ah点mm分',
            LLLL: 'YYYY年M月D日ddddAh点mm分',
            l: 'YYYY/M/D',
            ll: 'YYYY年M月D日',
            lll: 'YYYY年M月D日 HH:mm',
            llll: 'YYYY年M月D日dddd HH:mm'
          },
          meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
          meridiemHour: function meridiemHour(hour, meridiem) {
            if (hour === 12) {
              hour = 0;
            }

            if (meridiem === '凌晨' || meridiem === '早上' || meridiem === '上午') {
              return hour;
            } else if (meridiem === '下午' || meridiem === '晚上') {
              return hour + 12;
            } else {
              // '中午'
              return hour >= 11 ? hour : hour + 12;
            }
          },
          meridiem: function meridiem(hour, minute, isLower) {
            var hm = hour * 100 + minute;

            if (hm < 600) {
              return '凌晨';
            } else if (hm < 900) {
              return '早上';
            } else if (hm < 1130) {
              return '上午';
            } else if (hm < 1230) {
              return '中午';
            } else if (hm < 1800) {
              return '下午';
            } else {
              return '晚上';
            }
          },
          calendar: {
            sameDay: '[今天]LT',
            nextDay: '[明天]LT',
            nextWeek: function nextWeek(now) {
              if (now.week() !== this.week()) {
                return '[下]dddLT';
              } else {
                return '[本]dddLT';
              }
            },
            lastDay: '[昨天]LT',
            lastWeek: function lastWeek(now) {
              if (this.week() !== now.week()) {
                return '[上]dddLT';
              } else {
                return '[本]dddLT';
              }
            },
            sameElse: 'L'
          },
          dayOfMonthOrdinalParse: /\d{1,2}(日|月|周)/,
          ordinal: function ordinal(number, period) {
            switch (period) {
              case 'd':
              case 'D':
              case 'DDD':
                return number + '日';

              case 'M':
                return number + '月';

              case 'w':
              case 'W':
                return number + '周';

              default:
                return number;
            }
          },
          relativeTime: {
            future: '%s后',
            past: '%s前',
            s: '几秒',
            ss: '%d 秒',
            m: '1 分钟',
            mm: '%d 分钟',
            h: '1 小时',
            hh: '%d 小时',
            d: '1 天',
            dd: '%d 天',
            w: '1 周',
            ww: '%d 周',
            M: '1 个月',
            MM: '%d 个月',
            y: '1 年',
            yy: '%d 年'
          },
          week: {
            // GB/T 7408-1994《数据元和交换格式·信息交换·日期和时间表示法》与ISO 8601:1988等效
            dow: 1,
            // Monday is the first day of the week.
            doy: 4 // The week that contains Jan 4th is the first week of the year.

          }
        });
        return zhCn;
      });
    })();

    var composeEnhancers = composeWithDevTools({
      realtime: true
    });
    var steedosService = process.env.REACT_APP_API_BASE_URL;

    if (window && window.Meteor) {
      steedosService = window.Steedos.absoluteUrl('', true);
    }

    if (steedosService) {
      // 去掉url中的最后一个斜杠
      steedosService = steedosService.replace(/\/$/, "");
    }

    var initialStore = {
      settings: {
        services: {
          steedos: steedosService
        }
      }
    };
    var store = createStore(rootReducer, Object.assign({}, initialStore), composeEnhancers(applyMiddleware(thunkMiddleware)));

    window.store = store; // }

    function createDashboardAction(partialStateName, partialStateValue) {
    }

    var FLOWSTREE_STATE_CHANGE_ACTION = 'FLOWSTREE_STATE_CHANGE';
    var createFlowsTreeAction = function (partialStateName, partialStateValue, options) {
        return createAction(FLOWSTREE_STATE_CHANGE_ACTION, partialStateName, partialStateValue, options);
    };
    function loadFlowsTreeEntitiesData(options) {
        return function (dispatch, getState) {
            var service = dataServicesSelector(getState());
            return loadEntitiesDataRequest(dispatch, FLOWSTREE_STATE_CHANGE_ACTION, service, options);
        };
    }

    var stylis_min = {exports: {}};

    (function (module, exports) {
      !function (e) {
        module.exports = e(null) ;
      }(function e(a) {

        var r = /^\0+/g,
            c = /[\0\r\f]/g,
            s = /: */g,
            t = /zoo|gra/,
            i = /([,: ])(transform)/g,
            f = /,+\s*(?![^(]*[)])/g,
            n = / +\s*(?![^(]*[)])/g,
            l = / *[\0] */g,
            o = /,\r+?/g,
            h = /([\t\r\n ])*\f?&/g,
            u = /:global\(((?:[^\(\)\[\]]*|\[.*\]|\([^\(\)]*\))*)\)/g,
            d = /\W+/g,
            b = /@(k\w+)\s*(\S*)\s*/,
            p = /::(place)/g,
            k = /:(read-only)/g,
            g = /\s+(?=[{\];=:>])/g,
            A = /([[}=:>])\s+/g,
            C = /(\{[^{]+?);(?=\})/g,
            w = /\s{2,}/g,
            v = /([^\(])(:+) */g,
            m = /[svh]\w+-[tblr]{2}/,
            x = /\(\s*(.*)\s*\)/g,
            $ = /([\s\S]*?);/g,
            y = /-self|flex-/g,
            O = /[^]*?(:[rp][el]a[\w-]+)[^]*/,
            j = /stretch|:\s*\w+\-(?:conte|avail)/,
            z = /([^-])(image-set\()/,
            N = "-webkit-",
            S = "-moz-",
            F = "-ms-",
            W = 59,
            q = 125,
            B = 123,
            D = 40,
            E = 41,
            G = 91,
            H = 93,
            I = 10,
            J = 13,
            K = 9,
            L = 64,
            M = 32,
            P = 38,
            Q = 45,
            R = 95,
            T = 42,
            U = 44,
            V = 58,
            X = 39,
            Y = 34,
            Z = 47,
            _ = 62,
            ee = 43,
            ae = 126,
            re = 0,
            ce = 12,
            se = 11,
            te = 107,
            ie = 109,
            fe = 115,
            ne = 112,
            le = 111,
            oe = 105,
            he = 99,
            ue = 100,
            de = 112,
            be = 1,
            pe = 1,
            ke = 0,
            ge = 1,
            Ae = 1,
            Ce = 1,
            we = 0,
            ve = 0,
            me = 0,
            xe = [],
            $e = [],
            ye = 0,
            Oe = null,
            je = -2,
            ze = -1,
            Ne = 0,
            Se = 1,
            Fe = 2,
            We = 3,
            qe = 0,
            Be = 1,
            De = "",
            Ee = "",
            Ge = "";

        function He(e, a, s, t, i) {
          for (var f, n, o = 0, h = 0, u = 0, d = 0, g = 0, A = 0, C = 0, w = 0, m = 0, $ = 0, y = 0, O = 0, j = 0, z = 0, R = 0, we = 0, $e = 0, Oe = 0, je = 0, ze = s.length, Je = ze - 1, Re = "", Te = "", Ue = "", Ve = "", Xe = "", Ye = ""; R < ze;) {
            if (C = s.charCodeAt(R), R === Je) if (h + d + u + o !== 0) {
              if (0 !== h) C = h === Z ? I : Z;
              d = u = o = 0, ze++, Je++;
            }

            if (h + d + u + o === 0) {
              if (R === Je) {
                if (we > 0) Te = Te.replace(c, "");

                if (Te.trim().length > 0) {
                  switch (C) {
                    case M:
                    case K:
                    case W:
                    case J:
                    case I:
                      break;

                    default:
                      Te += s.charAt(R);
                  }

                  C = W;
                }
              }

              if (1 === $e) switch (C) {
                case B:
                case q:
                case W:
                case Y:
                case X:
                case D:
                case E:
                case U:
                  $e = 0;

                case K:
                case J:
                case I:
                case M:
                  break;

                default:
                  for ($e = 0, je = R, g = C, R--, C = W; je < ze;) {
                    switch (s.charCodeAt(je++)) {
                      case I:
                      case J:
                      case W:
                        ++R, C = g, je = ze;
                        break;

                      case V:
                        if (we > 0) ++R, C = g;

                      case B:
                        je = ze;
                    }
                  }

              }

              switch (C) {
                case B:
                  for (g = (Te = Te.trim()).charCodeAt(0), y = 1, je = ++R; R < ze;) {
                    switch (C = s.charCodeAt(R)) {
                      case B:
                        y++;
                        break;

                      case q:
                        y--;
                        break;

                      case Z:
                        switch (A = s.charCodeAt(R + 1)) {
                          case T:
                          case Z:
                            R = Qe(A, R, Je, s);
                        }

                        break;

                      case G:
                        C++;

                      case D:
                        C++;

                      case Y:
                      case X:
                        for (; R++ < Je && s.charCodeAt(R) !== C;) {
                        }

                    }

                    if (0 === y) break;
                    R++;
                  }

                  if (Ue = s.substring(je, R), g === re) g = (Te = Te.replace(r, "").trim()).charCodeAt(0);

                  switch (g) {
                    case L:
                      if (we > 0) Te = Te.replace(c, "");

                      switch (A = Te.charCodeAt(1)) {
                        case ue:
                        case ie:
                        case fe:
                        case Q:
                          f = a;
                          break;

                        default:
                          f = xe;
                      }

                      if (je = (Ue = He(a, f, Ue, A, i + 1)).length, me > 0 && 0 === je) je = Te.length;
                      if (ye > 0) if (f = Ie(xe, Te, Oe), n = Pe(We, Ue, f, a, pe, be, je, A, i, t), Te = f.join(""), void 0 !== n) if (0 === (je = (Ue = n.trim()).length)) A = 0, Ue = "";
                      if (je > 0) switch (A) {
                        case fe:
                          Te = Te.replace(x, Me);

                        case ue:
                        case ie:
                        case Q:
                          Ue = Te + "{" + Ue + "}";
                          break;

                        case te:
                          if (Ue = (Te = Te.replace(b, "$1 $2" + (Be > 0 ? De : ""))) + "{" + Ue + "}", 1 === Ae || 2 === Ae && Le("@" + Ue, 3)) Ue = "@" + N + Ue + "@" + Ue;else Ue = "@" + Ue;
                          break;

                        default:
                          if (Ue = Te + Ue, t === de) Ve += Ue, Ue = "";
                      } else Ue = "";
                      break;

                    default:
                      Ue = He(a, Ie(a, Te, Oe), Ue, t, i + 1);
                  }

                  Xe += Ue, O = 0, $e = 0, z = 0, we = 0, Oe = 0, j = 0, Te = "", Ue = "", C = s.charCodeAt(++R);
                  break;

                case q:
                case W:
                  if ((je = (Te = (we > 0 ? Te.replace(c, "") : Te).trim()).length) > 1) {
                    if (0 === z) if ((g = Te.charCodeAt(0)) === Q || g > 96 && g < 123) je = (Te = Te.replace(" ", ":")).length;
                    if (ye > 0) if (void 0 !== (n = Pe(Se, Te, a, e, pe, be, Ve.length, t, i, t))) if (0 === (je = (Te = n.trim()).length)) Te = "\0\0";

                    switch (g = Te.charCodeAt(0), A = Te.charCodeAt(1), g) {
                      case re:
                        break;

                      case L:
                        if (A === oe || A === he) {
                          Ye += Te + s.charAt(R);
                          break;
                        }

                      default:
                        if (Te.charCodeAt(je - 1) === V) break;
                        Ve += Ke(Te, g, A, Te.charCodeAt(2));
                    }
                  }

                  O = 0, $e = 0, z = 0, we = 0, Oe = 0, Te = "", C = s.charCodeAt(++R);
              }
            }

            switch (C) {
              case J:
              case I:
                if (h + d + u + o + ve === 0) switch ($) {
                  case E:
                  case X:
                  case Y:
                  case L:
                  case ae:
                  case _:
                  case T:
                  case ee:
                  case Z:
                  case Q:
                  case V:
                  case U:
                  case W:
                  case B:
                  case q:
                    break;

                  default:
                    if (z > 0) $e = 1;
                }
                if (h === Z) h = 0;else if (ge + O === 0 && t !== te && Te.length > 0) we = 1, Te += "\0";
                if (ye * qe > 0) Pe(Ne, Te, a, e, pe, be, Ve.length, t, i, t);
                be = 1, pe++;
                break;

              case W:
              case q:
                if (h + d + u + o === 0) {
                  be++;
                  break;
                }

              default:
                switch (be++, Re = s.charAt(R), C) {
                  case K:
                  case M:
                    if (d + o + h === 0) switch (w) {
                      case U:
                      case V:
                      case K:
                      case M:
                        Re = "";
                        break;

                      default:
                        if (C !== M) Re = " ";
                    }
                    break;

                  case re:
                    Re = "\\0";
                    break;

                  case ce:
                    Re = "\\f";
                    break;

                  case se:
                    Re = "\\v";
                    break;

                  case P:
                    if (d + h + o === 0 && ge > 0) Oe = 1, we = 1, Re = "\f" + Re;
                    break;

                  case 108:
                    if (d + h + o + ke === 0 && z > 0) switch (R - z) {
                      case 2:
                        if (w === ne && s.charCodeAt(R - 3) === V) ke = w;

                      case 8:
                        if (m === le) ke = m;
                    }
                    break;

                  case V:
                    if (d + h + o === 0) z = R;
                    break;

                  case U:
                    if (h + u + d + o === 0) we = 1, Re += "\r";
                    break;

                  case Y:
                  case X:
                    if (0 === h) d = d === C ? 0 : 0 === d ? C : d;
                    break;

                  case G:
                    if (d + h + u === 0) o++;
                    break;

                  case H:
                    if (d + h + u === 0) o--;
                    break;

                  case E:
                    if (d + h + o === 0) u--;
                    break;

                  case D:
                    if (d + h + o === 0) {
                      if (0 === O) switch (2 * w + 3 * m) {
                        case 533:
                          break;

                        default:
                          y = 0, O = 1;
                      }
                      u++;
                    }

                    break;

                  case L:
                    if (h + u + d + o + z + j === 0) j = 1;
                    break;

                  case T:
                  case Z:
                    if (d + o + u > 0) break;

                    switch (h) {
                      case 0:
                        switch (2 * C + 3 * s.charCodeAt(R + 1)) {
                          case 235:
                            h = Z;
                            break;

                          case 220:
                            je = R, h = T;
                        }

                        break;

                      case T:
                        if (C === Z && w === T && je + 2 !== R) {
                          if (33 === s.charCodeAt(je + 2)) Ve += s.substring(je, R + 1);
                          Re = "", h = 0;
                        }

                    }

                }

                if (0 === h) {
                  if (ge + d + o + j === 0 && t !== te && C !== W) switch (C) {
                    case U:
                    case ae:
                    case _:
                    case ee:
                    case E:
                    case D:
                      if (0 === O) {
                        switch (w) {
                          case K:
                          case M:
                          case I:
                          case J:
                            Re += "\0";
                            break;

                          default:
                            Re = "\0" + Re + (C === U ? "" : "\0");
                        }

                        we = 1;
                      } else switch (C) {
                        case D:
                          if (z + 7 === R && 108 === w) z = 0;
                          O = ++y;
                          break;

                        case E:
                          if (0 == (O = --y)) we = 1, Re += "\0";
                      }

                      break;

                    case K:
                    case M:
                      switch (w) {
                        case re:
                        case B:
                        case q:
                        case W:
                        case U:
                        case ce:
                        case K:
                        case M:
                        case I:
                        case J:
                          break;

                        default:
                          if (0 === O) we = 1, Re += "\0";
                      }

                  }
                  if (Te += Re, C !== M && C !== K) $ = C;
                }

            }

            m = w, w = C, R++;
          }

          if (je = Ve.length, me > 0) if (0 === je && 0 === Xe.length && 0 === a[0].length == false) if (t !== ie || 1 === a.length && (ge > 0 ? Ee : Ge) === a[0]) je = a.join(",").length + 2;

          if (je > 0) {
            if (f = 0 === ge && t !== te ? function (e) {
              for (var a, r, s = 0, t = e.length, i = Array(t); s < t; ++s) {
                for (var f = e[s].split(l), n = "", o = 0, h = 0, u = 0, d = 0, b = f.length; o < b; ++o) {
                  if (0 === (h = (r = f[o]).length) && b > 1) continue;
                  if (u = n.charCodeAt(n.length - 1), d = r.charCodeAt(0), a = "", 0 !== o) switch (u) {
                    case T:
                    case ae:
                    case _:
                    case ee:
                    case M:
                    case D:
                      break;

                    default:
                      a = " ";
                  }

                  switch (d) {
                    case P:
                      r = a + Ee;

                    case ae:
                    case _:
                    case ee:
                    case M:
                    case E:
                    case D:
                      break;

                    case G:
                      r = a + r + Ee;
                      break;

                    case V:
                      switch (2 * r.charCodeAt(1) + 3 * r.charCodeAt(2)) {
                        case 530:
                          if (Ce > 0) {
                            r = a + r.substring(8, h - 1);
                            break;
                          }

                        default:
                          if (o < 1 || f[o - 1].length < 1) r = a + Ee + r;
                      }

                      break;

                    case U:
                      a = "";

                    default:
                      if (h > 1 && r.indexOf(":") > 0) r = a + r.replace(v, "$1" + Ee + "$2");else r = a + r + Ee;
                  }

                  n += r;
                }

                i[s] = n.replace(c, "").trim();
              }

              return i;
            }(a) : a, ye > 0) if (void 0 !== (n = Pe(Fe, Ve, f, e, pe, be, je, t, i, t)) && 0 === (Ve = n).length) return Ye + Ve + Xe;

            if (Ve = f.join(",") + "{" + Ve + "}", Ae * ke != 0) {
              if (2 === Ae && !Le(Ve, 2)) ke = 0;

              switch (ke) {
                case le:
                  Ve = Ve.replace(k, ":" + S + "$1") + Ve;
                  break;

                case ne:
                  Ve = Ve.replace(p, "::" + N + "input-$1") + Ve.replace(p, "::" + S + "$1") + Ve.replace(p, ":" + F + "input-$1") + Ve;
              }

              ke = 0;
            }
          }

          return Ye + Ve + Xe;
        }

        function Ie(e, a, r) {
          var c = a.trim().split(o),
              s = c,
              t = c.length,
              i = e.length;

          switch (i) {
            case 0:
            case 1:
              for (var f = 0, n = 0 === i ? "" : e[0] + " "; f < t; ++f) {
                s[f] = Je(n, s[f], r, i).trim();
              }

              break;

            default:
              f = 0;
              var l = 0;

              for (s = []; f < t; ++f) {
                for (var h = 0; h < i; ++h) {
                  s[l++] = Je(e[h] + " ", c[f], r, i).trim();
                }
              }

          }

          return s;
        }

        function Je(e, a, r, c) {
          var s = a,
              t = s.charCodeAt(0);
          if (t < 33) t = (s = s.trim()).charCodeAt(0);

          switch (t) {
            case P:
              switch (ge + c) {
                case 0:
                case 1:
                  if (0 === e.trim().length) break;

                default:
                  return s.replace(h, "$1" + e.trim());
              }

              break;

            case V:
              switch (s.charCodeAt(1)) {
                case 103:
                  if (Ce > 0 && ge > 0) return s.replace(u, "$1").replace(h, "$1" + Ge);
                  break;

                default:
                  return e.trim() + s.replace(h, "$1" + e.trim());
              }

            default:
              if (r * ge > 0 && s.indexOf("\f") > 0) return s.replace(h, (e.charCodeAt(0) === V ? "" : "$1") + e.trim());
          }

          return e + s;
        }

        function Ke(e, a, r, c) {
          var l,
              o = 0,
              h = e + ";",
              u = 2 * a + 3 * r + 4 * c;
          if (944 === u) return function (e) {
            var a = e.length,
                r = e.indexOf(":", 9) + 1,
                c = e.substring(0, r).trim(),
                s = e.substring(r, a - 1).trim();

            switch (e.charCodeAt(9) * Be) {
              case 0:
                break;

              case Q:
                if (110 !== e.charCodeAt(10)) break;

              default:
                for (var t = s.split((s = "", f)), i = 0, r = 0, a = t.length; i < a; r = 0, ++i) {
                  for (var l = t[i], o = l.split(n); l = o[r];) {
                    var h = l.charCodeAt(0);
                    if (1 === Be && (h > L && h < 90 || h > 96 && h < 123 || h === R || h === Q && l.charCodeAt(1) !== Q)) switch (isNaN(parseFloat(l)) + (-1 !== l.indexOf("("))) {
                      case 1:
                        switch (l) {
                          case "infinite":
                          case "alternate":
                          case "backwards":
                          case "running":
                          case "normal":
                          case "forwards":
                          case "both":
                          case "none":
                          case "linear":
                          case "ease":
                          case "ease-in":
                          case "ease-out":
                          case "ease-in-out":
                          case "paused":
                          case "reverse":
                          case "alternate-reverse":
                          case "inherit":
                          case "initial":
                          case "unset":
                          case "step-start":
                          case "step-end":
                            break;

                          default:
                            l += De;
                        }

                    }
                    o[r++] = l;
                  }

                  s += (0 === i ? "" : ",") + o.join(" ");
                }

            }

            if (s = c + s + ";", 1 === Ae || 2 === Ae && Le(s, 1)) return N + s + s;
            return s;
          }(h);else if (0 === Ae || 2 === Ae && !Le(h, 1)) return h;

          switch (u) {
            case 1015:
              return 97 === h.charCodeAt(10) ? N + h + h : h;

            case 951:
              return 116 === h.charCodeAt(3) ? N + h + h : h;

            case 963:
              return 110 === h.charCodeAt(5) ? N + h + h : h;

            case 1009:
              if (100 !== h.charCodeAt(4)) break;

            case 969:
            case 942:
              return N + h + h;

            case 978:
              return N + h + S + h + h;

            case 1019:
            case 983:
              return N + h + S + h + F + h + h;

            case 883:
              if (h.charCodeAt(8) === Q) return N + h + h;
              if (h.indexOf("image-set(", 11) > 0) return h.replace(z, "$1" + N + "$2") + h;
              return h;

            case 932:
              if (h.charCodeAt(4) === Q) switch (h.charCodeAt(5)) {
                case 103:
                  return N + "box-" + h.replace("-grow", "") + N + h + F + h.replace("grow", "positive") + h;

                case 115:
                  return N + h + F + h.replace("shrink", "negative") + h;

                case 98:
                  return N + h + F + h.replace("basis", "preferred-size") + h;
              }
              return N + h + F + h + h;

            case 964:
              return N + h + F + "flex-" + h + h;

            case 1023:
              if (99 !== h.charCodeAt(8)) break;
              return l = h.substring(h.indexOf(":", 15)).replace("flex-", "").replace("space-between", "justify"), N + "box-pack" + l + N + h + F + "flex-pack" + l + h;

            case 1005:
              return t.test(h) ? h.replace(s, ":" + N) + h.replace(s, ":" + S) + h : h;

            case 1e3:
              switch (o = (l = h.substring(13).trim()).indexOf("-") + 1, l.charCodeAt(0) + l.charCodeAt(o)) {
                case 226:
                  l = h.replace(m, "tb");
                  break;

                case 232:
                  l = h.replace(m, "tb-rl");
                  break;

                case 220:
                  l = h.replace(m, "lr");
                  break;

                default:
                  return h;
              }

              return N + h + F + l + h;

            case 1017:
              if (-1 === h.indexOf("sticky", 9)) return h;

            case 975:
              switch (o = (h = e).length - 10, u = (l = (33 === h.charCodeAt(o) ? h.substring(0, o) : h).substring(e.indexOf(":", 7) + 1).trim()).charCodeAt(0) + (0 | l.charCodeAt(7))) {
                case 203:
                  if (l.charCodeAt(8) < 111) break;

                case 115:
                  h = h.replace(l, N + l) + ";" + h;
                  break;

                case 207:
                case 102:
                  h = h.replace(l, N + (u > 102 ? "inline-" : "") + "box") + ";" + h.replace(l, N + l) + ";" + h.replace(l, F + l + "box") + ";" + h;
              }

              return h + ";";

            case 938:
              if (h.charCodeAt(5) === Q) switch (h.charCodeAt(6)) {
                case 105:
                  return l = h.replace("-items", ""), N + h + N + "box-" + l + F + "flex-" + l + h;

                case 115:
                  return N + h + F + "flex-item-" + h.replace(y, "") + h;

                default:
                  return N + h + F + "flex-line-pack" + h.replace("align-content", "").replace(y, "") + h;
              }
              break;

            case 973:
            case 989:
              if (h.charCodeAt(3) !== Q || 122 === h.charCodeAt(4)) break;

            case 931:
            case 953:
              if (true === j.test(e)) if (115 === (l = e.substring(e.indexOf(":") + 1)).charCodeAt(0)) return Ke(e.replace("stretch", "fill-available"), a, r, c).replace(":fill-available", ":stretch");else return h.replace(l, N + l) + h.replace(l, S + l.replace("fill-", "")) + h;
              break;

            case 962:
              if (h = N + h + (102 === h.charCodeAt(5) ? F + h : "") + h, r + c === 211 && 105 === h.charCodeAt(13) && h.indexOf("transform", 10) > 0) return h.substring(0, h.indexOf(";", 27) + 1).replace(i, "$1" + N + "$2") + h;
          }

          return h;
        }

        function Le(e, a) {
          var r = e.indexOf(1 === a ? ":" : "{"),
              c = e.substring(0, 3 !== a ? r : 10),
              s = e.substring(r + 1, e.length - 1);
          return Oe(2 !== a ? c : c.replace(O, "$1"), s, a);
        }

        function Me(e, a) {
          var r = Ke(a, a.charCodeAt(0), a.charCodeAt(1), a.charCodeAt(2));
          return r !== a + ";" ? r.replace($, " or ($1)").substring(4) : "(" + a + ")";
        }

        function Pe(e, a, r, c, s, t, i, f, n, l) {
          for (var o, h = 0, u = a; h < ye; ++h) {
            switch (o = $e[h].call(Te, e, u, r, c, s, t, i, f, n, l)) {
              case void 0:
              case false:
              case true:
              case null:
                break;

              default:
                u = o;
            }
          }

          if (u !== a) return u;
        }

        function Qe(e, a, r, c) {
          for (var s = a + 1; s < r; ++s) {
            switch (c.charCodeAt(s)) {
              case Z:
                if (e === T) if (c.charCodeAt(s - 1) === T && a + 2 !== s) return s + 1;
                break;

              case I:
                if (e === Z) return s + 1;
            }
          }

          return s;
        }

        function Re(e) {
          for (var a in e) {
            var r = e[a];

            switch (a) {
              case "keyframe":
                Be = 0 | r;
                break;

              case "global":
                Ce = 0 | r;
                break;

              case "cascade":
                ge = 0 | r;
                break;

              case "compress":
                we = 0 | r;
                break;

              case "semicolon":
                ve = 0 | r;
                break;

              case "preserve":
                me = 0 | r;
                break;

              case "prefix":
                if (Oe = null, !r) Ae = 0;else if ("function" != typeof r) Ae = 1;else Ae = 2, Oe = r;
            }
          }

          return Re;
        }

        function Te(a, r) {
          if (void 0 !== this && this.constructor === Te) return e(a);
          var s = a,
              t = s.charCodeAt(0);
          if (t < 33) t = (s = s.trim()).charCodeAt(0);
          if (Be > 0) De = s.replace(d, t === G ? "" : "-");
          if (t = 1, 1 === ge) Ge = s;else Ee = s;
          var i,
              f = [Ge];
          if (ye > 0) if (void 0 !== (i = Pe(ze, r, f, f, pe, be, 0, 0, 0, 0)) && "string" == typeof i) r = i;
          var n = He(xe, f, r, 0, 0);
          if (ye > 0) if (void 0 !== (i = Pe(je, n, f, f, pe, be, n.length, 0, 0, 0)) && "string" != typeof (n = i)) t = 0;
          return De = "", Ge = "", Ee = "", ke = 0, pe = 1, be = 1, we * t == 0 ? n : n.replace(c, "").replace(g, "").replace(A, "$1").replace(C, "$1").replace(w, " ");
        }

        if (Te.use = function e(a) {
          switch (a) {
            case void 0:
            case null:
              ye = $e.length = 0;
              break;

            default:
              if ("function" == typeof a) $e[ye++] = a;else if ("object" == _typeof$1(a)) for (var r = 0, c = a.length; r < c; ++r) {
                e(a[r]);
              } else qe = 0 | !!a;
          }

          return e;
        }, Te.set = Re, void 0 !== a) Re(a);
        return Te;
      });
    })(stylis_min);

    var Stylis = stylis_min.exports;

    var stylisRuleSheet = {exports: {}};

    (function (module, exports) {
      (function (factory) {
        module['exports'] = factory() ;
      })(function () {

        return function (insertRule) {
          var delimiter = '/*|*/';
          var needle = delimiter + '}';

          function toSheet(block) {
            if (block) try {
              insertRule(block + '}');
            } catch (e) {}
          }

          return function ruleSheet(context, content, selectors, parents, line, column, length, ns, depth, at) {
            switch (context) {
              // property
              case 1:
                // @import
                if (depth === 0 && content.charCodeAt(0) === 64) return insertRule(content + ';'), '';
                break;
              // selector

              case 2:
                if (ns === 0) return content + delimiter;
                break;
              // at-rule

              case 3:
                switch (ns) {
                  // @font-face, @page
                  case 102:
                  case 112:
                    return insertRule(selectors[0] + content), '';

                  default:
                    return content + (at === 0 ? delimiter : '');
                }

              case -2:
                content.split(needle).forEach(toSheet);
            }
          };
        };
      });
    })(stylisRuleSheet);

    var _insertRulePlugin = stylisRuleSheet.exports;

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
      // SVG-related properties
      fillOpacity: 1,
      floodOpacity: 1,
      stopOpacity: 1,
      strokeDasharray: 1,
      strokeDashoffset: 1,
      strokeMiterlimit: 1,
      strokeOpacity: 1,
      strokeWidth: 1
    };

    var safeIsNaN = Number.isNaN || function ponyfill(value) {
      return typeof value === 'number' && value !== value;
    };

    function isEqual(first, second) {
      if (first === second) {
        return true;
      }

      if (safeIsNaN(first) && safeIsNaN(second)) {
        return true;
      }

      return false;
    }

    function areInputsEqual(newInputs, lastInputs) {
      if (newInputs.length !== lastInputs.length) {
        return false;
      }

      for (var i = 0; i < newInputs.length; i++) {
        if (!isEqual(newInputs[i], lastInputs[i])) {
          return false;
        }
      }

      return true;
    }

    function memoizeOne(resultFn, isEqual) {
      if (isEqual === void 0) {
        isEqual = areInputsEqual;
      }

      var lastThis;
      var lastArgs = [];
      var lastResult;
      var calledOnce = false;

      function memoized() {
        var newArgs = [];

        for (var _i = 0; _i < arguments.length; _i++) {
          newArgs[_i] = arguments[_i];
        }

        if (calledOnce && lastThis === this && isEqual(newArgs, lastArgs)) {
          return lastResult;
        }

        lastResult = resultFn.apply(this, newArgs);
        calledOnce = true;
        lastThis = this;
        lastArgs = newArgs;
        return lastResult;
      }

      return memoized;
    }

    function memoize(fn) {
      var cache = {};
      return function (arg) {
        if (cache[arg] === undefined) cache[arg] = fn(arg);
        return cache[arg];
      };
    }

    var reactPropsRegex = /^((children|dangerouslySetInnerHTML|key|ref|autoFocus|defaultValue|defaultChecked|innerHTML|suppressContentEditableWarning|suppressHydrationWarning|valueLink|accept|acceptCharset|accessKey|action|allow|allowUserMedia|allowPaymentRequest|allowFullScreen|allowTransparency|alt|async|autoComplete|autoPlay|capture|cellPadding|cellSpacing|challenge|charSet|checked|cite|classID|className|cols|colSpan|content|contentEditable|contextMenu|controls|controlsList|coords|crossOrigin|data|dateTime|decoding|default|defer|dir|disabled|disablePictureInPicture|download|draggable|encType|form|formAction|formEncType|formMethod|formNoValidate|formTarget|frameBorder|headers|height|hidden|high|href|hrefLang|htmlFor|httpEquiv|id|inputMode|integrity|is|keyParams|keyType|kind|label|lang|list|loading|loop|low|marginHeight|marginWidth|max|maxLength|media|mediaGroup|method|min|minLength|multiple|muted|name|nonce|noValidate|open|optimum|pattern|placeholder|playsInline|poster|preload|profile|radioGroup|readOnly|referrerPolicy|rel|required|reversed|role|rows|rowSpan|sandbox|scope|scoped|scrolling|seamless|selected|shape|size|sizes|slot|span|spellCheck|src|srcDoc|srcLang|srcSet|start|step|style|summary|tabIndex|target|title|type|useMap|value|width|wmode|wrap|about|datatype|inlist|prefix|property|resource|typeof|vocab|autoCapitalize|autoCorrect|autoSave|color|inert|itemProp|itemScope|itemType|itemID|itemRef|on|results|security|unselectable|accentHeight|accumulate|additive|alignmentBaseline|allowReorder|alphabetic|amplitude|arabicForm|ascent|attributeName|attributeType|autoReverse|azimuth|baseFrequency|baselineShift|baseProfile|bbox|begin|bias|by|calcMode|capHeight|clip|clipPathUnits|clipPath|clipRule|colorInterpolation|colorInterpolationFilters|colorProfile|colorRendering|contentScriptType|contentStyleType|cursor|cx|cy|d|decelerate|descent|diffuseConstant|direction|display|divisor|dominantBaseline|dur|dx|dy|edgeMode|elevation|enableBackground|end|exponent|externalResourcesRequired|fill|fillOpacity|fillRule|filter|filterRes|filterUnits|floodColor|floodOpacity|focusable|fontFamily|fontSize|fontSizeAdjust|fontStretch|fontStyle|fontVariant|fontWeight|format|from|fr|fx|fy|g1|g2|glyphName|glyphOrientationHorizontal|glyphOrientationVertical|glyphRef|gradientTransform|gradientUnits|hanging|horizAdvX|horizOriginX|ideographic|imageRendering|in|in2|intercept|k|k1|k2|k3|k4|kernelMatrix|kernelUnitLength|kerning|keyPoints|keySplines|keyTimes|lengthAdjust|letterSpacing|lightingColor|limitingConeAngle|local|markerEnd|markerMid|markerStart|markerHeight|markerUnits|markerWidth|mask|maskContentUnits|maskUnits|mathematical|mode|numOctaves|offset|opacity|operator|order|orient|orientation|origin|overflow|overlinePosition|overlineThickness|panose1|paintOrder|pathLength|patternContentUnits|patternTransform|patternUnits|pointerEvents|points|pointsAtX|pointsAtY|pointsAtZ|preserveAlpha|preserveAspectRatio|primitiveUnits|r|radius|refX|refY|renderingIntent|repeatCount|repeatDur|requiredExtensions|requiredFeatures|restart|result|rotate|rx|ry|scale|seed|shapeRendering|slope|spacing|specularConstant|specularExponent|speed|spreadMethod|startOffset|stdDeviation|stemh|stemv|stitchTiles|stopColor|stopOpacity|strikethroughPosition|strikethroughThickness|string|stroke|strokeDasharray|strokeDashoffset|strokeLinecap|strokeLinejoin|strokeMiterlimit|strokeOpacity|strokeWidth|surfaceScale|systemLanguage|tableValues|targetX|targetY|textAnchor|textDecoration|textRendering|textLength|to|transform|u1|u2|underlinePosition|underlineThickness|unicode|unicodeBidi|unicodeRange|unitsPerEm|vAlphabetic|vHanging|vIdeographic|vMathematical|values|vectorEffect|version|vertAdvY|vertOriginX|vertOriginY|viewBox|viewTarget|visibility|widths|wordSpacing|writingMode|x|xHeight|x1|x2|xChannelSelector|xlinkActuate|xlinkArcrole|xlinkHref|xlinkRole|xlinkShow|xlinkTitle|xlinkType|xmlBase|xmlns|xmlnsXlink|xmlLang|xmlSpace|y|y1|y2|yChannelSelector|z|zoomAndPan|for|class|autofocus)|(([Dd][Aa][Tt][Aa]|[Aa][Rr][Ii][Aa]|x)-.*))$/; // https://esbench.com/bench/5bfee68a4cd7e6009ef61d23

    var index$8 = memoize(function (prop) {
      return reactPropsRegex.test(prop) || prop.charCodeAt(0) === 111
      /* o */
      && prop.charCodeAt(1) === 110
      /* n */
      && prop.charCodeAt(2) < 91;
    }
    /* Z+1 */
    );

    /**
     * Returns the object type of the given payload
     *
     * @param {*} payload
     * @returns {string}
     */
    function getType(payload) {
      return Object.prototype.toString.call(payload).slice(8, -1);
    }
    /**
     * Returns whether the payload is a plain JavaScript object (excluding special classes or objects with other prototypes)
     *
     * @param {*} payload
     * @returns {payload is PlainObject}
     */


    function isPlainObject$1(payload) {
      if (getType(payload) !== 'Object') return false;
      return payload.constructor === Object && Object.getPrototypeOf(payload) === Object.prototype;
    }
    /**
     * Returns whether the payload is an array
     *
     * @param {any} payload
     * @returns {payload is any[]}
     */


    function isArray(payload) {
      return getType(payload) === 'Array';
    }
    /**
     * Returns whether the payload is a Symbol
     *
     * @param {*} payload
     * @returns {payload is symbol}
     */


    function isSymbol(payload) {
      return getType(payload) === 'Symbol';
    }

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
    ***************************************************************************** */

    function __spreadArrays() {
      for (var s = 0, i = 0, il = arguments.length; i < il; i++) {
        s += arguments[i].length;
      }

      for (var r = Array(s), k = 0, i = 0; i < il; i++) {
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) {
          r[k] = a[j];
        }
      }

      return r;
    }

    function assignProp(carry, key, newVal, originalObject) {
      var propType = originalObject.propertyIsEnumerable(key) ? 'enumerable' : 'nonenumerable';
      if (propType === 'enumerable') carry[key] = newVal;

      if (propType === 'nonenumerable') {
        Object.defineProperty(carry, key, {
          value: newVal,
          enumerable: false,
          writable: true,
          configurable: true
        });
      }
    }

    function mergeRecursively(origin, newComer, extensions) {
      // work directly on newComer if its not an object
      if (!isPlainObject$1(newComer)) {
        // extend merge rules
        if (extensions && isArray(extensions)) {
          extensions.forEach(function (extend) {
            newComer = extend(origin, newComer);
          });
        }

        return newComer;
      } // define newObject to merge all values upon


      var newObject = {};

      if (isPlainObject$1(origin)) {
        var props_1 = Object.getOwnPropertyNames(origin);
        var symbols_1 = Object.getOwnPropertySymbols(origin);
        newObject = __spreadArrays(props_1, symbols_1).reduce(function (carry, key) {
          // @ts-ignore
          var targetVal = origin[key];

          if (!isSymbol(key) && !Object.getOwnPropertyNames(newComer).includes(key) || isSymbol(key) && !Object.getOwnPropertySymbols(newComer).includes(key)) {
            assignProp(carry, key, targetVal, origin);
          }

          return carry;
        }, {});
      }

      var props = Object.getOwnPropertyNames(newComer);
      var symbols = Object.getOwnPropertySymbols(newComer);

      var result = __spreadArrays(props, symbols).reduce(function (carry, key) {
        // re-define the origin and newComer as targetVal and newVal
        var newVal = newComer[key];
        var targetVal = isPlainObject$1(origin) // @ts-ignore
        ? origin[key] : undefined; // extend merge rules

        if (extensions && isArray(extensions)) {
          extensions.forEach(function (extend) {
            newVal = extend(targetVal, newVal);
          });
        } // When newVal is an object do the merge recursively


        if (targetVal !== undefined && isPlainObject$1(newVal)) {
          newVal = mergeRecursively(targetVal, newVal, extensions);
        }

        assignProp(carry, key, newVal, newComer);
        return carry;
      }, newObject);

      return result;
    }
    /**
     * Merge anything recursively.
     * Objects get merged, special objects (classes etc.) are re-assigned "as is".
     * Basic types overwrite objects or other basic types.
     *
     * @param {(IConfig | any)} origin
     * @param {...any[]} newComers
     * @returns the result
     */


    function merge(origin) {
      var newComers = [];

      for (var _i = 1; _i < arguments.length; _i++) {
        newComers[_i - 1] = arguments[_i];
      }

      var extensions = null;
      var base = origin;

      if (isPlainObject$1(origin) && origin.extensions && Object.keys(origin).length === 1) {
        base = {};
        extensions = origin.extensions;
      }

      return newComers.reduce(function (result, newComer) {
        return mergeRecursively(result, newComer, extensions);
      }, base);
    }

    var interleave = function interleave(strings, interpolations) {
      var result = [strings[0]];

      for (var i = 0, len = interpolations.length; i < len; i += 1) {
        result.push(interpolations[i], strings[i + 1]);
      }

      return result;
    };

    var _typeof = typeof Symbol === "function" && _typeof$1(Symbol.iterator) === "symbol" ? function (obj) {
      return _typeof$1(obj);
    } : function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof$1(obj);
    };

    var classCallCheck = function classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    };

    var createClass = function () {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }

      return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
      };
    }();

    var _extends = Object.assign || function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

    var inherits = function inherits(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + _typeof$1(superClass));
      }

      subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
          value: subClass,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    };

    var objectWithoutProperties = function objectWithoutProperties(obj, keys) {
      var target = {};

      for (var i in obj) {
        if (keys.indexOf(i) >= 0) continue;
        if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
        target[i] = obj[i];
      }

      return target;
    };

    var possibleConstructorReturn = function possibleConstructorReturn(self, call) {
      if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      }

      return call && (_typeof$1(call) === "object" || typeof call === "function") ? call : self;
    }; // 


    var isPlainObject = function isPlainObject(x) {
      return (typeof x === 'undefined' ? 'undefined' : _typeof(x)) === 'object' && x.constructor === Object;
    }; // 


    var EMPTY_ARRAY = Object.freeze([]);
    var EMPTY_OBJECT = Object.freeze({}); // 

    function isFunction(test) {
      return typeof test === 'function';
    } // 


    function getComponentName(target) {
      return target.displayName || target.name || 'Component';
    } // 


    function isStatelessFunction(test) {
      return typeof test === 'function' && !(test.prototype && test.prototype.isReactComponent);
    } // 


    function isStyledComponent(target) {
      return target && typeof target.styledComponentId === 'string';
    } // 


    var SC_ATTR = typeof process !== 'undefined' && (process.env.REACT_APP_SC_ATTR || process.env.SC_ATTR) || 'data-styled';
    var SC_VERSION_ATTR = 'data-styled-version';
    var SC_STREAM_ATTR = 'data-styled-streamed';
    var IS_BROWSER = typeof window !== 'undefined' && 'HTMLElement' in window;
    var DISABLE_SPEEDY = typeof SC_DISABLE_SPEEDY === 'boolean' && SC_DISABLE_SPEEDY || typeof process !== 'undefined' && (process.env.REACT_APP_SC_DISABLE_SPEEDY || process.env.SC_DISABLE_SPEEDY) || "production" !== 'production'; // Shared empty execution context when generating static styles
    /**
     * Create an error file out of errors.md for development and a simple web link to the full errors
     * in production mode.
     */


    var StyledComponentsError = function (_Error) {
      inherits(StyledComponentsError, _Error);

      function StyledComponentsError(code) {
        classCallCheck(this, StyledComponentsError);

        for (var _len = arguments.length, interpolations = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          interpolations[_key - 1] = arguments[_key];
        }

        var _this; {
          var _this = possibleConstructorReturn(this, _Error.call(this, 'An error occurred. See https://github.com/styled-components/styled-components/blob/master/packages/styled-components/src/utils/errors.md#' + code + ' for more information.' + (interpolations.length > 0 ? ' Additional arguments: ' + interpolations.join(', ') : '')));
        }

        return possibleConstructorReturn(_this);
      }

      return StyledComponentsError;
    }(Error); // 


    var SC_COMPONENT_ID = /^[^\S\n]*?\/\* sc-component-id:\s*(\S+)\s+\*\//gm;

    var extractComps = function extractComps(maybeCSS) {
      var css = '' + (maybeCSS || ''); // Definitely a string, and a clone

      var existingComponents = [];
      css.replace(SC_COMPONENT_ID, function (match, componentId, matchIndex) {
        existingComponents.push({
          componentId: componentId,
          matchIndex: matchIndex
        });
        return match;
      });
      return existingComponents.map(function (_ref, i) {
        var componentId = _ref.componentId,
            matchIndex = _ref.matchIndex;
        var nextComp = existingComponents[i + 1];
        var cssFromDOM = nextComp ? css.slice(matchIndex, nextComp.matchIndex) : css.slice(matchIndex);
        return {
          componentId: componentId,
          cssFromDOM: cssFromDOM
        };
      });
    }; // 


    var COMMENT_REGEX = /^\s*\/\/.*$/gm; // NOTE: This stylis instance is only used to split rules from SSR'd style tags

    var stylisSplitter = new Stylis({
      global: false,
      cascade: true,
      keyframe: false,
      prefix: false,
      compress: false,
      semicolon: true
    });
    var stylis = new Stylis({
      global: false,
      cascade: true,
      keyframe: false,
      prefix: true,
      compress: false,
      semicolon: false // NOTE: This means "autocomplete missing semicolons"

    }); // Wrap `insertRulePlugin to build a list of rules,
    // and then make our own plugin to return the rules. This
    // makes it easier to hook into the existing SSR architecture

    var parsingRules = []; // eslint-disable-next-line consistent-return

    var returnRulesPlugin = function returnRulesPlugin(context) {
      if (context === -2) {
        var parsedRules = parsingRules;
        parsingRules = [];
        return parsedRules;
      }
    };

    var parseRulesPlugin = _insertRulePlugin(function (rule) {
      parsingRules.push(rule);
    });

    var _componentId = void 0;

    var _selector = void 0;

    var _selectorRegexp = void 0;

    var selfReferenceReplacer = function selfReferenceReplacer(match, offset, string) {
      if ( // the first self-ref is always untouched
      offset > 0 && // there should be at least two self-refs to do a replacement (.b > .b)
      string.slice(0, offset).indexOf(_selector) !== -1 && // no consecutive self refs (.b.b); that is a precedence boost and treated differently
      string.slice(offset - _selector.length, offset) !== _selector) {
        return '.' + _componentId;
      }

      return match;
    };
    /**
     * When writing a style like
     *
     * & + & {
     *   color: red;
     * }
     *
     * The second ampersand should be a reference to the static component class. stylis
     * has no knowledge of static class so we have to intelligently replace the base selector.
     */


    var selfReferenceReplacementPlugin = function selfReferenceReplacementPlugin(context, _, selectors) {
      if (context === 2 && selectors.length && selectors[0].lastIndexOf(_selector) > 0) {
        // eslint-disable-next-line no-param-reassign
        selectors[0] = selectors[0].replace(_selectorRegexp, selfReferenceReplacer);
      }
    };

    stylis.use([selfReferenceReplacementPlugin, parseRulesPlugin, returnRulesPlugin]);
    stylisSplitter.use([parseRulesPlugin, returnRulesPlugin]);

    var splitByRules = function splitByRules(css) {
      return stylisSplitter('', css);
    };

    function stringifyRules(rules, selector, prefix) {
      var componentId = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '&';
      var flatCSS = rules.join('').replace(COMMENT_REGEX, ''); // replace JS comments

      var cssStr = selector && prefix ? prefix + ' ' + selector + ' { ' + flatCSS + ' }' : flatCSS; // stylis has no concept of state to be passed to plugins
      // but since JS is single=threaded, we can rely on that to ensure
      // these properties stay in sync with the current stylis run

      _componentId = componentId;
      _selector = selector;
      _selectorRegexp = new RegExp('\\' + _selector + '\\b', 'g');
      return stylis(prefix || !selector ? '' : selector, cssStr);
    } // 

    /* eslint-disable camelcase, no-undef */


    var getNonce = function getNonce() {
      return typeof __webpack_nonce__ !== 'undefined' ? __webpack_nonce__ : null;
    }; // 

    /* These are helpers for the StyleTags to keep track of the injected
     * rule names for each (component) ID that they're keeping track of.
     * They're crucial for detecting whether a name has already been
     * injected.
     * (This excludes rehydrated names) */

    /* adds a new ID:name pairing to a names dictionary */


    var addNameForId = function addNameForId(names, id, name) {
      if (name) {
        // eslint-disable-next-line no-param-reassign
        var namesForId = names[id] || (names[id] = Object.create(null));
        namesForId[name] = true;
      }
    };
    /* resets an ID entirely by overwriting it in the dictionary */


    var resetIdNames = function resetIdNames(names, id) {
      // eslint-disable-next-line no-param-reassign
      names[id] = Object.create(null);
    };
    /* factory for a names dictionary checking the existance of an ID:name pairing */


    var hasNameForId = function hasNameForId(names) {
      return function (id, name) {
        return names[id] !== undefined && names[id][name];
      };
    };
    /* stringifies names for the html/element output */


    var stringifyNames = function stringifyNames(names) {
      var str = ''; // eslint-disable-next-line guard-for-in

      for (var id in names) {
        str += Object.keys(names[id]).join(' ') + ' ';
      }

      return str.trim();
    };
    /* clones the nested names dictionary */


    var cloneNames = function cloneNames(names) {
      var clone = Object.create(null); // eslint-disable-next-line guard-for-in

      for (var id in names) {
        clone[id] = _extends({}, names[id]);
      }

      return clone;
    }; // 

    /* These are helpers that deal with the insertRule (aka speedy) API
     * They are used in the StyleTags and specifically the speedy tag
     */

    /* retrieve a sheet for a given style tag */


    var sheetForTag = function sheetForTag(tag) {
      // $FlowFixMe
      if (tag.sheet) return tag.sheet;
      /* Firefox quirk requires us to step through all stylesheets to find one owned by the given tag */

      var size = tag.ownerDocument.styleSheets.length;

      for (var i = 0; i < size; i += 1) {
        var sheet = tag.ownerDocument.styleSheets[i]; // $FlowFixMe

        if (sheet.ownerNode === tag) return sheet;
      }
      /* we should always be able to find a tag */


      throw new StyledComponentsError(10);
    };
    /* insert a rule safely and return whether it was actually injected */


    var safeInsertRule = function safeInsertRule(sheet, cssRule, index) {
      /* abort early if cssRule string is falsy */
      if (!cssRule) return false;
      var maxIndex = sheet.cssRules.length;

      try {
        /* use insertRule and cap passed index with maxIndex (no of cssRules) */
        sheet.insertRule(cssRule, index <= maxIndex ? index : maxIndex);
      } catch (err) {
        /* any error indicates an invalid rule */
        return false;
      }

      return true;
    };
    /* deletes `size` rules starting from `removalIndex` */


    var deleteRules = function deleteRules(sheet, removalIndex, size) {
      var lowerBound = removalIndex - size;

      for (var i = removalIndex; i > lowerBound; i -= 1) {
        sheet.deleteRule(i);
      }
    }; // 

    /* this marker separates component styles and is important for rehydration */


    var makeTextMarker = function makeTextMarker(id) {
      return '\n/* sc-component-id: ' + id + ' */\n';
    };
    /* add up all numbers in array up until and including the index */


    var addUpUntilIndex = function addUpUntilIndex(sizes, index) {
      var totalUpToIndex = 0;

      for (var i = 0; i <= index; i += 1) {
        totalUpToIndex += sizes[i];
      }

      return totalUpToIndex;
    };
    /* create a new style tag after lastEl */


    var makeStyleTag = function makeStyleTag(target, tagEl, insertBefore) {
      var targetDocument = document;
      if (target) targetDocument = target.ownerDocument;else if (tagEl) targetDocument = tagEl.ownerDocument;
      var el = targetDocument.createElement('style');
      el.setAttribute(SC_ATTR, '');
      el.setAttribute(SC_VERSION_ATTR, "4.4.1");
      var nonce = getNonce();

      if (nonce) {
        el.setAttribute('nonce', nonce);
      }
      /* Work around insertRule quirk in EdgeHTML */


      el.appendChild(targetDocument.createTextNode(''));

      if (target && !tagEl) {
        /* Append to target when no previous element was passed */
        target.appendChild(el);
      } else {
        if (!tagEl || !target || !tagEl.parentNode) {
          throw new StyledComponentsError(6);
        }
        /* Insert new style tag after the previous one */


        tagEl.parentNode.insertBefore(el, insertBefore ? tagEl : tagEl.nextSibling);
      }

      return el;
    };
    /* takes a css factory function and outputs an html styled tag factory */


    var wrapAsHtmlTag = function wrapAsHtmlTag(css, names) {
      return function (additionalAttrs) {
        var nonce = getNonce();
        var attrs = [nonce && 'nonce="' + nonce + '"', SC_ATTR + '="' + stringifyNames(names) + '"', SC_VERSION_ATTR + '="' + "4.4.1" + '"', additionalAttrs];
        var htmlAttr = attrs.filter(Boolean).join(' ');
        return '<style ' + htmlAttr + '>' + css() + '</style>';
      };
    };
    /* takes a css factory function and outputs an element factory */


    var wrapAsElement = function wrapAsElement(css, names) {
      return function () {
        var _props;

        var props = (_props = {}, _props[SC_ATTR] = stringifyNames(names), _props[SC_VERSION_ATTR] = "4.4.1", _props);
        var nonce = getNonce();

        if (nonce) {
          // $FlowFixMe
          props.nonce = nonce;
        } // eslint-disable-next-line react/no-danger


        return /*#__PURE__*/React__default["default"].createElement('style', _extends({}, props, {
          dangerouslySetInnerHTML: {
            __html: css()
          }
        }));
      };
    };

    var getIdsFromMarkersFactory = function getIdsFromMarkersFactory(markers) {
      return function () {
        return Object.keys(markers);
      };
    };
    /* speedy tags utilise insertRule */


    var makeSpeedyTag = function makeSpeedyTag(el, getImportRuleTag) {
      var names = Object.create(null);
      var markers = Object.create(null);
      var sizes = [];
      var extractImport = getImportRuleTag !== undefined;
      /* indicates whether getImportRuleTag was called */

      var usedImportRuleTag = false;

      var insertMarker = function insertMarker(id) {
        var prev = markers[id];

        if (prev !== undefined) {
          return prev;
        }

        markers[id] = sizes.length;
        sizes.push(0);
        resetIdNames(names, id);
        return markers[id];
      };

      var insertRules = function insertRules(id, cssRules, name) {
        var marker = insertMarker(id);
        var sheet = sheetForTag(el);
        var insertIndex = addUpUntilIndex(sizes, marker);
        var injectedRules = 0;
        var importRules = [];
        var cssRulesSize = cssRules.length;

        for (var i = 0; i < cssRulesSize; i += 1) {
          var cssRule = cssRules[i];
          var mayHaveImport = extractImport;
          /* @import rules are reordered to appear first */

          if (mayHaveImport && cssRule.indexOf('@import') !== -1) {
            importRules.push(cssRule);
          } else if (safeInsertRule(sheet, cssRule, insertIndex + injectedRules)) {
            mayHaveImport = false;
            injectedRules += 1;
          }
        }

        if (extractImport && importRules.length > 0) {
          usedImportRuleTag = true; // $FlowFixMe

          getImportRuleTag().insertRules(id + '-import', importRules);
        }

        sizes[marker] += injectedRules;
        /* add up no of injected rules */

        addNameForId(names, id, name);
      };

      var removeRules = function removeRules(id) {
        var marker = markers[id];
        if (marker === undefined) return; // $FlowFixMe

        if (el.isConnected === false) return;
        var size = sizes[marker];
        var sheet = sheetForTag(el);
        var removalIndex = addUpUntilIndex(sizes, marker) - 1;
        deleteRules(sheet, removalIndex, size);
        sizes[marker] = 0;
        resetIdNames(names, id);

        if (extractImport && usedImportRuleTag) {
          // $FlowFixMe
          getImportRuleTag().removeRules(id + '-import');
        }
      };

      var css = function css() {
        var _sheetForTag = sheetForTag(el),
            cssRules = _sheetForTag.cssRules;

        var str = ''; // eslint-disable-next-line guard-for-in

        for (var id in markers) {
          str += makeTextMarker(id);
          var marker = markers[id];
          var end = addUpUntilIndex(sizes, marker);
          var size = sizes[marker];

          for (var i = end - size; i < end; i += 1) {
            var rule = cssRules[i];

            if (rule !== undefined) {
              str += rule.cssText;
            }
          }
        }

        return str;
      };

      return {
        clone: function clone() {
          throw new StyledComponentsError(5);
        },
        css: css,
        getIds: getIdsFromMarkersFactory(markers),
        hasNameForId: hasNameForId(names),
        insertMarker: insertMarker,
        insertRules: insertRules,
        removeRules: removeRules,
        sealed: false,
        styleTag: el,
        toElement: wrapAsElement(css, names),
        toHTML: wrapAsHtmlTag(css, names)
      };
    };

    var makeTextNode = function makeTextNode(targetDocument, id) {
      return targetDocument.createTextNode(makeTextMarker(id));
    };

    var makeBrowserTag = function makeBrowserTag(el, getImportRuleTag) {
      var names = Object.create(null);
      var markers = Object.create(null);
      var extractImport = getImportRuleTag !== undefined;
      /* indicates whether getImportRuleTag was called */

      var usedImportRuleTag = false;

      var insertMarker = function insertMarker(id) {
        var prev = markers[id];

        if (prev !== undefined) {
          return prev;
        }

        markers[id] = makeTextNode(el.ownerDocument, id);
        el.appendChild(markers[id]);
        names[id] = Object.create(null);
        return markers[id];
      };

      var insertRules = function insertRules(id, cssRules, name) {
        var marker = insertMarker(id);
        var importRules = [];
        var cssRulesSize = cssRules.length;

        for (var i = 0; i < cssRulesSize; i += 1) {
          var rule = cssRules[i];
          var mayHaveImport = extractImport;

          if (mayHaveImport && rule.indexOf('@import') !== -1) {
            importRules.push(rule);
          } else {
            mayHaveImport = false;
            var separator = i === cssRulesSize - 1 ? '' : ' ';
            marker.appendData('' + rule + separator);
          }
        }

        addNameForId(names, id, name);

        if (extractImport && importRules.length > 0) {
          usedImportRuleTag = true; // $FlowFixMe

          getImportRuleTag().insertRules(id + '-import', importRules);
        }
      };

      var removeRules = function removeRules(id) {
        var marker = markers[id];
        if (marker === undefined) return;
        /* create new empty text node and replace the current one */

        var newMarker = makeTextNode(el.ownerDocument, id);
        el.replaceChild(newMarker, marker);
        markers[id] = newMarker;
        resetIdNames(names, id);

        if (extractImport && usedImportRuleTag) {
          // $FlowFixMe
          getImportRuleTag().removeRules(id + '-import');
        }
      };

      var css = function css() {
        var str = ''; // eslint-disable-next-line guard-for-in

        for (var id in markers) {
          str += markers[id].data;
        }

        return str;
      };

      return {
        clone: function clone() {
          throw new StyledComponentsError(5);
        },
        css: css,
        getIds: getIdsFromMarkersFactory(markers),
        hasNameForId: hasNameForId(names),
        insertMarker: insertMarker,
        insertRules: insertRules,
        removeRules: removeRules,
        sealed: false,
        styleTag: el,
        toElement: wrapAsElement(css, names),
        toHTML: wrapAsHtmlTag(css, names)
      };
    };

    var makeServerTag = function makeServerTag(namesArg, markersArg) {
      var names = namesArg === undefined ? Object.create(null) : namesArg;
      var markers = markersArg === undefined ? Object.create(null) : markersArg;

      var insertMarker = function insertMarker(id) {
        var prev = markers[id];

        if (prev !== undefined) {
          return prev;
        }

        return markers[id] = [''];
      };

      var insertRules = function insertRules(id, cssRules, name) {
        var marker = insertMarker(id);
        marker[0] += cssRules.join(' ');
        addNameForId(names, id, name);
      };

      var removeRules = function removeRules(id) {
        var marker = markers[id];
        if (marker === undefined) return;
        marker[0] = '';
        resetIdNames(names, id);
      };

      var css = function css() {
        var str = ''; // eslint-disable-next-line guard-for-in

        for (var id in markers) {
          var cssForId = markers[id][0];

          if (cssForId) {
            str += makeTextMarker(id) + cssForId;
          }
        }

        return str;
      };

      var clone = function clone() {
        var namesClone = cloneNames(names);
        var markersClone = Object.create(null); // eslint-disable-next-line guard-for-in

        for (var id in markers) {
          markersClone[id] = [markers[id][0]];
        }

        return makeServerTag(namesClone, markersClone);
      };

      var tag = {
        clone: clone,
        css: css,
        getIds: getIdsFromMarkersFactory(markers),
        hasNameForId: hasNameForId(names),
        insertMarker: insertMarker,
        insertRules: insertRules,
        removeRules: removeRules,
        sealed: false,
        styleTag: null,
        toElement: wrapAsElement(css, names),
        toHTML: wrapAsHtmlTag(css, names)
      };
      return tag;
    };

    var makeTag = function makeTag(target, tagEl, forceServer, insertBefore, getImportRuleTag) {
      if (IS_BROWSER && !forceServer) {
        var el = makeStyleTag(target, tagEl, insertBefore);

        if (DISABLE_SPEEDY) {
          return makeBrowserTag(el, getImportRuleTag);
        } else {
          return makeSpeedyTag(el, getImportRuleTag);
        }
      }

      return makeServerTag();
    };

    var rehydrate = function rehydrate(tag, els, extracted) {
      /* add all extracted components to the new tag */
      for (var i = 0, len = extracted.length; i < len; i += 1) {
        var _extracted$i = extracted[i],
            componentId = _extracted$i.componentId,
            cssFromDOM = _extracted$i.cssFromDOM;
        var cssRules = splitByRules(cssFromDOM);
        tag.insertRules(componentId, cssRules);
      }
      /* remove old HTMLStyleElements, since they have been rehydrated */


      for (var _i = 0, _len = els.length; _i < _len; _i += 1) {
        var el = els[_i];

        if (el.parentNode) {
          el.parentNode.removeChild(el);
        }
      }
    }; // 


    var SPLIT_REGEX = /\s+/;
    /* determine the maximum number of components before tags are sharded */

    var MAX_SIZE = void 0;

    if (IS_BROWSER) {
      /* in speedy mode we can keep a lot more rules in a sheet before a slowdown can be expected */
      MAX_SIZE = DISABLE_SPEEDY ? 40 : 1000;
    } else {
      /* for servers we do not need to shard at all */
      MAX_SIZE = -1;
    }

    var sheetRunningId = 0;
    var master = void 0;

    var StyleSheet = function () {
      /* a map from ids to tags */

      /* deferred rules for a given id */

      /* this is used for not reinjecting rules via hasNameForId() */

      /* when rules for an id are removed using remove() we have to ignore rehydratedNames for it */

      /* a list of tags belonging to this StyleSheet */

      /* a tag for import rules */

      /* current capacity until a new tag must be created */

      /* children (aka clones) of this StyleSheet inheriting all and future injections */
      function StyleSheet() {
        var _this = this;

        var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : IS_BROWSER ? document.head : null;
        var forceServer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        classCallCheck(this, StyleSheet);

        this.getImportRuleTag = function () {
          var importRuleTag = _this.importRuleTag;

          if (importRuleTag !== undefined) {
            return importRuleTag;
          }

          var firstTag = _this.tags[0];
          var insertBefore = true;
          return _this.importRuleTag = makeTag(_this.target, firstTag ? firstTag.styleTag : null, _this.forceServer, insertBefore);
        };

        sheetRunningId += 1;
        this.id = sheetRunningId;
        this.forceServer = forceServer;
        this.target = forceServer ? null : target;
        this.tagMap = {};
        this.deferred = {};
        this.rehydratedNames = {};
        this.ignoreRehydratedNames = {};
        this.tags = [];
        this.capacity = 1;
        this.clones = [];
      }
      /* rehydrate all SSR'd style tags */


      StyleSheet.prototype.rehydrate = function rehydrate$$1() {
        if (!IS_BROWSER || this.forceServer) return this;
        var els = [];
        var extracted = [];
        var isStreamed = false;
        /* retrieve all of our SSR style elements from the DOM */

        var nodes = document.querySelectorAll('style[' + SC_ATTR + '][' + SC_VERSION_ATTR + '="' + "4.4.1" + '"]');
        var nodesSize = nodes.length;
        /* abort rehydration if no previous style tags were found */

        if (!nodesSize) return this;

        for (var i = 0; i < nodesSize; i += 1) {
          var el = nodes[i];
          /* check if style tag is a streamed tag */

          if (!isStreamed) isStreamed = !!el.getAttribute(SC_STREAM_ATTR);
          /* retrieve all component names */

          var elNames = (el.getAttribute(SC_ATTR) || '').trim().split(SPLIT_REGEX);
          var elNamesSize = elNames.length;

          for (var j = 0, name; j < elNamesSize; j += 1) {
            name = elNames[j];
            /* add rehydrated name to sheet to avoid re-adding styles */

            this.rehydratedNames[name] = true;
          }
          /* extract all components and their CSS */


          extracted.push.apply(extracted, extractComps(el.textContent));
          /* store original HTMLStyleElement */

          els.push(el);
        }
        /* abort rehydration if nothing was extracted */


        var extractedSize = extracted.length;
        if (!extractedSize) return this;
        /* create a tag to be used for rehydration */

        var tag = this.makeTag(null);
        rehydrate(tag, els, extracted);
        /* reset capacity and adjust MAX_SIZE by the initial size of the rehydration */

        this.capacity = Math.max(1, MAX_SIZE - extractedSize);
        this.tags.push(tag);
        /* retrieve all component ids */

        for (var _j = 0; _j < extractedSize; _j += 1) {
          this.tagMap[extracted[_j].componentId] = tag;
        }

        return this;
      };
      /* retrieve a "master" instance of StyleSheet which is typically used when no other is available
       * The master StyleSheet is targeted by createGlobalStyle, keyframes, and components outside of any
        * StyleSheetManager's context */

      /* reset the internal "master" instance */


      StyleSheet.reset = function reset() {
        var forceServer = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        master = new StyleSheet(undefined, forceServer).rehydrate();
      };
      /* adds "children" to the StyleSheet that inherit all of the parents' rules
       * while their own rules do not affect the parent */


      StyleSheet.prototype.clone = function clone() {
        var sheet = new StyleSheet(this.target, this.forceServer);
        /* add to clone array */

        this.clones.push(sheet);
        /* clone all tags */

        sheet.tags = this.tags.map(function (tag) {
          var ids = tag.getIds();
          var newTag = tag.clone();
          /* reconstruct tagMap */

          for (var i = 0; i < ids.length; i += 1) {
            sheet.tagMap[ids[i]] = newTag;
          }

          return newTag;
        });
        /* clone other maps */

        sheet.rehydratedNames = _extends({}, this.rehydratedNames);
        sheet.deferred = _extends({}, this.deferred);
        return sheet;
      };
      /* force StyleSheet to create a new tag on the next injection */


      StyleSheet.prototype.sealAllTags = function sealAllTags() {
        this.capacity = 1;
        this.tags.forEach(function (tag) {
          // eslint-disable-next-line no-param-reassign
          tag.sealed = true;
        });
      };

      StyleSheet.prototype.makeTag = function makeTag$$1(tag) {
        var lastEl = tag ? tag.styleTag : null;
        var insertBefore = false;
        return makeTag(this.target, lastEl, this.forceServer, insertBefore, this.getImportRuleTag);
      };
      /* get a tag for a given componentId, assign the componentId to one, or shard */


      StyleSheet.prototype.getTagForId = function getTagForId(id) {
        /* simply return a tag, when the componentId was already assigned one */
        var prev = this.tagMap[id];

        if (prev !== undefined && !prev.sealed) {
          return prev;
        }

        var tag = this.tags[this.tags.length - 1];
        /* shard (create a new tag) if the tag is exhausted (See MAX_SIZE) */

        this.capacity -= 1;

        if (this.capacity === 0) {
          this.capacity = MAX_SIZE;
          tag = this.makeTag(tag);
          this.tags.push(tag);
        }

        return this.tagMap[id] = tag;
      };
      /* mainly for createGlobalStyle to check for its id */


      StyleSheet.prototype.hasId = function hasId(id) {
        return this.tagMap[id] !== undefined;
      };
      /* caching layer checking id+name to already have a corresponding tag and injected rules */


      StyleSheet.prototype.hasNameForId = function hasNameForId(id, name) {
        /* exception for rehydrated names which are checked separately */
        if (this.ignoreRehydratedNames[id] === undefined && this.rehydratedNames[name]) {
          return true;
        }

        var tag = this.tagMap[id];
        return tag !== undefined && tag.hasNameForId(id, name);
      };
      /* registers a componentId and registers it on its tag */


      StyleSheet.prototype.deferredInject = function deferredInject(id, cssRules) {
        /* don't inject when the id is already registered */
        if (this.tagMap[id] !== undefined) return;
        var clones = this.clones;

        for (var i = 0; i < clones.length; i += 1) {
          clones[i].deferredInject(id, cssRules);
        }

        this.getTagForId(id).insertMarker(id);
        this.deferred[id] = cssRules;
      };
      /* injects rules for a given id with a name that will need to be cached */


      StyleSheet.prototype.inject = function inject(id, cssRules, name) {
        var clones = this.clones;

        for (var i = 0; i < clones.length; i += 1) {
          clones[i].inject(id, cssRules, name);
        }

        var tag = this.getTagForId(id);
        /* add deferred rules for component */

        if (this.deferred[id] !== undefined) {
          // Combine passed cssRules with previously deferred CSS rules
          // NOTE: We cannot mutate the deferred array itself as all clones
          // do the same (see clones[i].inject)
          var rules = this.deferred[id].concat(cssRules);
          tag.insertRules(id, rules, name);
          this.deferred[id] = undefined;
        } else {
          tag.insertRules(id, cssRules, name);
        }
      };
      /* removes all rules for a given id, which doesn't remove its marker but resets it */


      StyleSheet.prototype.remove = function remove(id) {
        var tag = this.tagMap[id];
        if (tag === undefined) return;
        var clones = this.clones;

        for (var i = 0; i < clones.length; i += 1) {
          clones[i].remove(id);
        }
        /* remove all rules from the tag */


        tag.removeRules(id);
        /* ignore possible rehydrated names */

        this.ignoreRehydratedNames[id] = true;
        /* delete possible deferred rules */

        this.deferred[id] = undefined;
      };

      StyleSheet.prototype.toHTML = function toHTML() {
        return this.tags.map(function (tag) {
          return tag.toHTML();
        }).join('');
      };

      StyleSheet.prototype.toReactElements = function toReactElements() {
        var id = this.id;
        return this.tags.map(function (tag, i) {
          var key = 'sc-' + id + '-' + i;
          return /*#__PURE__*/React.cloneElement(tag.toElement(), {
            key: key
          });
        });
      };

      createClass(StyleSheet, null, [{
        key: 'master',
        get: function get$$1() {
          return master || (master = new StyleSheet().rehydrate());
        }
        /* NOTE: This is just for backwards-compatibility with jest-styled-components */

      }, {
        key: 'instance',
        get: function get$$1() {
          return StyleSheet.master;
        }
      }]);
      return StyleSheet;
    }(); // 


    var Keyframes = function () {
      function Keyframes(name, rules) {
        var _this = this;

        classCallCheck(this, Keyframes);

        this.inject = function (styleSheet) {
          if (!styleSheet.hasNameForId(_this.id, _this.name)) {
            styleSheet.inject(_this.id, _this.rules, _this.name);
          }
        };

        this.toString = function () {
          throw new StyledComponentsError(12, String(_this.name));
        };

        this.name = name;
        this.rules = rules;
        this.id = 'sc-keyframes-' + name;
      }

      Keyframes.prototype.getName = function getName() {
        return this.name;
      };

      return Keyframes;
    }(); // 

    /**
     * inlined version of
     * https://github.com/facebook/fbjs/blob/master/packages/fbjs/src/core/hyphenateStyleName.js
     */


    var uppercasePattern = /([A-Z])/g;
    var msPattern = /^ms-/;
    /**
     * Hyphenates a camelcased CSS property name, for example:
     *
     *   > hyphenateStyleName('backgroundColor')
     *   < "background-color"
     *   > hyphenateStyleName('MozTransition')
     *   < "-moz-transition"
     *   > hyphenateStyleName('msTransition')
     *   < "-ms-transition"
     *
     * As Modernizr suggests (http://modernizr.com/docs/#prefixed), an `ms` prefix
     * is converted to `-ms-`.
     *
     * @param {string} string
     * @return {string}
     */

    function hyphenateStyleName(string) {
      return string.replace(uppercasePattern, '-$1').toLowerCase().replace(msPattern, '-ms-');
    } // 
    // Taken from https://github.com/facebook/react/blob/b87aabdfe1b7461e7331abb3601d9e6bb27544bc/packages/react-dom/src/shared/dangerousStyleValue.js


    function addUnitIfNeeded(name, value) {
      // https://github.com/amilajack/eslint-plugin-flowtype-errors/issues/133
      // $FlowFixMe
      if (value == null || typeof value === 'boolean' || value === '') {
        return '';
      }

      if (typeof value === 'number' && value !== 0 && !(name in unitlessKeys)) {
        return value + 'px'; // Presumes implicit 'px' suffix for unitless numbers
      }

      return String(value).trim();
    } // 

    /**
     * It's falsish not falsy because 0 is allowed.
     */


    var isFalsish = function isFalsish(chunk) {
      return chunk === undefined || chunk === null || chunk === false || chunk === '';
    };

    var objToCssArray = function objToCssArray(obj, prevKey) {
      var rules = [];
      var keys = Object.keys(obj);
      keys.forEach(function (key) {
        if (!isFalsish(obj[key])) {
          if (isPlainObject(obj[key])) {
            rules.push.apply(rules, objToCssArray(obj[key], key));
            return rules;
          } else if (isFunction(obj[key])) {
            rules.push(hyphenateStyleName(key) + ':', obj[key], ';');
            return rules;
          }

          rules.push(hyphenateStyleName(key) + ': ' + addUnitIfNeeded(key, obj[key]) + ';');
        }

        return rules;
      });
      return prevKey ? [prevKey + ' {'].concat(rules, ['}']) : rules;
    };

    function flatten(chunk, executionContext, styleSheet) {
      if (Array.isArray(chunk)) {
        var ruleSet = [];

        for (var i = 0, len = chunk.length, result; i < len; i += 1) {
          result = flatten(chunk[i], executionContext, styleSheet);
          if (result === null) continue;else if (Array.isArray(result)) ruleSet.push.apply(ruleSet, result);else ruleSet.push(result);
        }

        return ruleSet;
      }

      if (isFalsish(chunk)) {
        return null;
      }
      /* Handle other components */


      if (isStyledComponent(chunk)) {
        return '.' + chunk.styledComponentId;
      }
      /* Either execute or defer the function */


      if (isFunction(chunk)) {
        if (isStatelessFunction(chunk) && executionContext) {
          var _result = chunk(executionContext);

          return flatten(_result, executionContext, styleSheet);
        } else return chunk;
      }

      if (chunk instanceof Keyframes) {
        if (styleSheet) {
          chunk.inject(styleSheet);
          return chunk.getName();
        } else return chunk;
      }
      /* Handle objects */


      return isPlainObject(chunk) ? objToCssArray(chunk) : chunk.toString();
    } // 


    function css(styles) {
      for (var _len = arguments.length, interpolations = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        interpolations[_key - 1] = arguments[_key];
      }

      if (isFunction(styles) || isPlainObject(styles)) {
        // $FlowFixMe
        return flatten(interleave(EMPTY_ARRAY, [styles].concat(interpolations)));
      } // $FlowFixMe


      return flatten(interleave(styles, interpolations));
    } // 


    function constructWithOptions(componentConstructor, tag) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : EMPTY_OBJECT;

      if (!reactIs$2.exports.isValidElementType(tag)) {
        throw new StyledComponentsError(1, String(tag));
      }
      /* This is callable directly as a template function */
      // $FlowFixMe: Not typed to avoid destructuring arguments


      var templateFunction = function templateFunction() {
        return componentConstructor(tag, options, css.apply(undefined, arguments));
      };
      /* If config methods are called, wrap up a new template function and merge options */


      templateFunction.withConfig = function (config) {
        return constructWithOptions(componentConstructor, tag, _extends({}, options, config));
      };
      /* Modify/inject new props at runtime */


      templateFunction.attrs = function (attrs) {
        return constructWithOptions(componentConstructor, tag, _extends({}, options, {
          attrs: Array.prototype.concat(options.attrs, attrs).filter(Boolean)
        }));
      };

      return templateFunction;
    } // 
    // Source: https://github.com/garycourt/murmurhash-js/blob/master/murmurhash2_gc.js


    function murmurhash(c) {
      for (var e = c.length | 0, a = e | 0, d = 0, b; e >= 4;) {
        b = c.charCodeAt(d) & 255 | (c.charCodeAt(++d) & 255) << 8 | (c.charCodeAt(++d) & 255) << 16 | (c.charCodeAt(++d) & 255) << 24, b = 1540483477 * (b & 65535) + ((1540483477 * (b >>> 16) & 65535) << 16), b ^= b >>> 24, b = 1540483477 * (b & 65535) + ((1540483477 * (b >>> 16) & 65535) << 16), a = 1540483477 * (a & 65535) + ((1540483477 * (a >>> 16) & 65535) << 16) ^ b, e -= 4, ++d;
      }

      switch (e) {
        case 3:
          a ^= (c.charCodeAt(d + 2) & 255) << 16;

        case 2:
          a ^= (c.charCodeAt(d + 1) & 255) << 8;

        case 1:
          a ^= c.charCodeAt(d) & 255, a = 1540483477 * (a & 65535) + ((1540483477 * (a >>> 16) & 65535) << 16);
      }

      a ^= a >>> 13;
      a = 1540483477 * (a & 65535) + ((1540483477 * (a >>> 16) & 65535) << 16);
      return (a ^ a >>> 15) >>> 0;
    } // 

    /* eslint-disable no-bitwise */

    /* This is the "capacity" of our alphabet i.e. 2x26 for all letters plus their capitalised
     * counterparts */


    var charsLength = 52;
    /* start at 75 for 'a' until 'z' (25) and then start at 65 for capitalised letters */

    var getAlphabeticChar = function getAlphabeticChar(code) {
      return String.fromCharCode(code + (code > 25 ? 39 : 97));
    };
    /* input a number, usually a hash and convert it to base-52 */


    function generateAlphabeticName(code) {
      var name = '';
      var x = void 0;
      /* get a char and divide by alphabet-length */

      for (x = code; x > charsLength; x = Math.floor(x / charsLength)) {
        name = getAlphabeticChar(x % charsLength) + name;
      }

      return getAlphabeticChar(x % charsLength) + name;
    } // 


    function hasFunctionObjectKey(obj) {
      // eslint-disable-next-line guard-for-in, no-restricted-syntax
      for (var key in obj) {
        if (isFunction(obj[key])) {
          return true;
        }
      }

      return false;
    }

    function isStaticRules(rules, attrs) {
      for (var i = 0; i < rules.length; i += 1) {
        var rule = rules[i]; // recursive case

        if (Array.isArray(rule) && !isStaticRules(rule, attrs)) {
          return false;
        } else if (isFunction(rule) && !isStyledComponent(rule)) {
          // functions are allowed to be static if they're just being
          // used to get the classname of a nested styled component
          return false;
        }
      }

      if (attrs.some(function (x) {
        return isFunction(x) || hasFunctionObjectKey(x);
      })) return false;
      return true;
    } // 

    /* combines hashStr (murmurhash) and nameGenerator for convenience */


    var hasher = function hasher(str) {
      return generateAlphabeticName(murmurhash(str));
    };
    /*
     ComponentStyle is all the CSS-specific stuff, not
     the React-specific stuff.
     */


    var ComponentStyle = function () {
      function ComponentStyle(rules, attrs, componentId) {
        classCallCheck(this, ComponentStyle);
        this.rules = rules;
        this.isStatic = isStaticRules(rules, attrs);
        this.componentId = componentId;

        if (!StyleSheet.master.hasId(componentId)) {
          StyleSheet.master.deferredInject(componentId, []);
        }
      }
      /*
       * Flattens a rule set into valid CSS
       * Hashes it, wraps the whole chunk in a .hash1234 {}
       * Returns the hash to be injected on render()
       * */


      ComponentStyle.prototype.generateAndInjectStyles = function generateAndInjectStyles(executionContext, styleSheet) {
        var isStatic = this.isStatic,
            componentId = this.componentId,
            lastClassName = this.lastClassName;

        if (IS_BROWSER && isStatic && typeof lastClassName === 'string' && styleSheet.hasNameForId(componentId, lastClassName)) {
          return lastClassName;
        }

        var flatCSS = flatten(this.rules, executionContext, styleSheet);
        var name = hasher(this.componentId + flatCSS.join(''));

        if (!styleSheet.hasNameForId(componentId, name)) {
          styleSheet.inject(this.componentId, stringifyRules(flatCSS, '.' + name, undefined, componentId), name);
        }

        this.lastClassName = name;
        return name;
      };

      ComponentStyle.generateName = function generateName(str) {
        return hasher(str);
      };

      return ComponentStyle;
    }(); // 


    var determineTheme = function determineTheme(props, fallbackTheme) {
      var defaultProps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : EMPTY_OBJECT; // Props should take precedence over ThemeProvider, which should take precedence over
      // defaultProps, but React automatically puts defaultProps on props.

      /* eslint-disable react/prop-types, flowtype-errors/show-errors */

      var isDefaultTheme = defaultProps ? props.theme === defaultProps.theme : false;
      var theme = props.theme && !isDefaultTheme ? props.theme : fallbackTheme || defaultProps.theme;
      /* eslint-enable */

      return theme;
    }; // 


    var escapeRegex = /[[\].#*$><+~=|^:(),"'`-]+/g;
    var dashesAtEnds = /(^-|-$)/g;
    /**
     * TODO: Explore using CSS.escape when it becomes more available
     * in evergreen browsers.
     */

    function escape(str) {
      return str // Replace all possible CSS selectors
      .replace(escapeRegex, '-') // Remove extraneous hyphens at the start and end
      .replace(dashesAtEnds, '');
    } // 


    function isTag(target) {
      return typeof target === 'string' && (true);
    } // 


    function generateDisplayName(target) {
      // $FlowFixMe
      return isTag(target) ? 'styled.' + target : 'Styled(' + getComponentName(target) + ')';
    }

    var _TYPE_STATICS;

    var REACT_STATICS = {
      childContextTypes: true,
      contextTypes: true,
      defaultProps: true,
      displayName: true,
      getDerivedStateFromProps: true,
      propTypes: true,
      type: true
    };
    var KNOWN_STATICS = {
      name: true,
      length: true,
      prototype: true,
      caller: true,
      callee: true,
      arguments: true,
      arity: true
    };
    var TYPE_STATICS = (_TYPE_STATICS = {}, _TYPE_STATICS[reactIs$2.exports.ForwardRef] = {
      $$typeof: true,
      render: true
    }, _TYPE_STATICS);
    var defineProperty$1 = Object.defineProperty,
        getOwnPropertyNames = Object.getOwnPropertyNames,
        _Object$getOwnPropert = Object.getOwnPropertySymbols,
        getOwnPropertySymbols = _Object$getOwnPropert === undefined ? function () {
      return [];
    } : _Object$getOwnPropert,
        getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor,
        getPrototypeOf = Object.getPrototypeOf,
        objectPrototype = Object.prototype;
    var arrayPrototype = Array.prototype;

    function hoistNonReactStatics(targetComponent, sourceComponent, blacklist) {
      if (typeof sourceComponent !== 'string') {
        // don't hoist over string (html) components
        var inheritedComponent = getPrototypeOf(sourceComponent);

        if (inheritedComponent && inheritedComponent !== objectPrototype) {
          hoistNonReactStatics(targetComponent, inheritedComponent, blacklist);
        }

        var keys = arrayPrototype.concat(getOwnPropertyNames(sourceComponent), // $FlowFixMe
        getOwnPropertySymbols(sourceComponent));
        var targetStatics = TYPE_STATICS[targetComponent.$$typeof] || REACT_STATICS;
        var sourceStatics = TYPE_STATICS[sourceComponent.$$typeof] || REACT_STATICS;
        var i = keys.length;
        var descriptor = void 0;
        var key = void 0; // eslint-disable-next-line no-plusplus

        while (i--) {
          key = keys[i];

          if ( // $FlowFixMe
          !KNOWN_STATICS[key] && !(blacklist && blacklist[key]) && !(sourceStatics && sourceStatics[key]) && // $FlowFixMe
          !(targetStatics && targetStatics[key])) {
            descriptor = getOwnPropertyDescriptor(sourceComponent, key);

            if (descriptor) {
              try {
                // Avoid failures from read-only properties
                defineProperty$1(targetComponent, key, descriptor);
              } catch (e) {
                /* fail silently */
              }
            }
          }
        }

        return targetComponent;
      }

      return targetComponent;
    } // 


    function isDerivedReactComponent(fn) {
      return !!(fn && fn.prototype && fn.prototype.isReactComponent);
    } // 


    var ThemeContext = /*#__PURE__*/React.createContext();
    var ThemeConsumer = ThemeContext.Consumer;
    /**
     * Provide a theme to an entire react component tree via context
     */

    (function (_Component) {
      inherits(ThemeProvider, _Component);

      function ThemeProvider(props) {
        classCallCheck(this, ThemeProvider);

        var _this = possibleConstructorReturn(this, _Component.call(this, props));

        _this.getContext = memoizeOne(_this.getContext.bind(_this));
        _this.renderInner = _this.renderInner.bind(_this);
        return _this;
      }

      ThemeProvider.prototype.render = function render() {
        if (!this.props.children) return null;
        return /*#__PURE__*/React__default["default"].createElement(ThemeContext.Consumer, null, this.renderInner);
      };

      ThemeProvider.prototype.renderInner = function renderInner(outerTheme) {
        var context = this.getContext(this.props.theme, outerTheme);
        return /*#__PURE__*/React__default["default"].createElement(ThemeContext.Provider, {
          value: context
        }, this.props.children);
      };
      /**
       * Get the theme from the props, supporting both (outerTheme) => {}
       * as well as object notation
       */


      ThemeProvider.prototype.getTheme = function getTheme(theme, outerTheme) {
        if (isFunction(theme)) {
          var mergedTheme = theme(outerTheme);

          return mergedTheme;
        }

        if (theme === null || Array.isArray(theme) || (typeof theme === 'undefined' ? 'undefined' : _typeof(theme)) !== 'object') {
          throw new StyledComponentsError(8);
        }

        return _extends({}, outerTheme, theme);
      };

      ThemeProvider.prototype.getContext = function getContext(theme, outerTheme) {
        return this.getTheme(theme, outerTheme);
      };

      return ThemeProvider;
    })(React.Component); // 


    var StyleSheetContext = /*#__PURE__*/React.createContext();
    var StyleSheetConsumer = StyleSheetContext.Consumer;

    (function (_Component) {
      inherits(StyleSheetManager, _Component);

      function StyleSheetManager(props) {
        classCallCheck(this, StyleSheetManager);

        var _this = possibleConstructorReturn(this, _Component.call(this, props));

        _this.getContext = memoizeOne(_this.getContext);
        return _this;
      }

      StyleSheetManager.prototype.getContext = function getContext(sheet, target) {
        if (sheet) {
          return sheet;
        } else if (target) {
          return new StyleSheet(target);
        } else {
          throw new StyledComponentsError(4);
        }
      };

      StyleSheetManager.prototype.render = function render() {
        var _props = this.props,
            children = _props.children,
            sheet = _props.sheet,
            target = _props.target;
        return /*#__PURE__*/React__default["default"].createElement(StyleSheetContext.Provider, {
          value: this.getContext(sheet, target)
        }, children);
      };

      return StyleSheetManager;
    })(React.Component);

    var identifiers = {};
    /* We depend on components having unique IDs */

    function generateId$1(_ComponentStyle, _displayName, parentComponentId) {
      var displayName = typeof _displayName !== 'string' ? 'sc' : escape(_displayName);
      /**
       * This ensures uniqueness if two components happen to share
       * the same displayName.
       */

      var nr = (identifiers[displayName] || 0) + 1;
      identifiers[displayName] = nr;

      var componentId = displayName + '-' + _ComponentStyle.generateName(displayName + nr);

      return parentComponentId ? parentComponentId + '-' + componentId : componentId;
    } // $FlowFixMe


    var StyledComponent = function (_Component) {
      inherits(StyledComponent, _Component);

      function StyledComponent() {
        classCallCheck(this, StyledComponent);

        var _this = possibleConstructorReturn(this, _Component.call(this));

        _this.attrs = {};
        _this.renderOuter = _this.renderOuter.bind(_this);
        _this.renderInner = _this.renderInner.bind(_this);

        return _this;
      }

      StyledComponent.prototype.render = function render() {
        return /*#__PURE__*/React__default["default"].createElement(StyleSheetConsumer, null, this.renderOuter);
      };

      StyledComponent.prototype.renderOuter = function renderOuter() {
        var styleSheet = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : StyleSheet.master;
        this.styleSheet = styleSheet; // No need to subscribe a static component to theme changes, it won't change anything

        if (this.props.forwardedComponent.componentStyle.isStatic) return this.renderInner();
        return /*#__PURE__*/React__default["default"].createElement(ThemeConsumer, null, this.renderInner);
      };

      StyledComponent.prototype.renderInner = function renderInner(theme) {
        var _props$forwardedCompo = this.props.forwardedComponent,
            componentStyle = _props$forwardedCompo.componentStyle,
            defaultProps = _props$forwardedCompo.defaultProps;
            _props$forwardedCompo.displayName;
            var foldedComponentIds = _props$forwardedCompo.foldedComponentIds,
            styledComponentId = _props$forwardedCompo.styledComponentId,
            target = _props$forwardedCompo.target;
        var generatedClassName = void 0;

        if (componentStyle.isStatic) {
          generatedClassName = this.generateAndInjectStyles(EMPTY_OBJECT, this.props);
        } else {
          generatedClassName = this.generateAndInjectStyles(determineTheme(this.props, theme, defaultProps) || EMPTY_OBJECT, this.props);
        }

        var elementToBeCreated = this.props.as || this.attrs.as || target;
        var isTargetTag = isTag(elementToBeCreated);
        var propsForElement = {};

        var computedProps = _extends({}, this.props, this.attrs);

        var key = void 0; // eslint-disable-next-line guard-for-in

        for (key in computedProps) {

          if (key === 'forwardedComponent' || key === 'as') {
            continue;
          } else if (key === 'forwardedRef') propsForElement.ref = computedProps[key];else if (key === 'forwardedAs') propsForElement.as = computedProps[key];else if (!isTargetTag || index$8(key)) {
            // Don't pass through non HTML tags through to HTML elements
            propsForElement[key] = computedProps[key];
          }
        }

        if (this.props.style && this.attrs.style) {
          propsForElement.style = _extends({}, this.attrs.style, this.props.style);
        }

        propsForElement.className = Array.prototype.concat(foldedComponentIds, styledComponentId, generatedClassName !== styledComponentId ? generatedClassName : null, this.props.className, this.attrs.className).filter(Boolean).join(' ');
        return /*#__PURE__*/React.createElement(elementToBeCreated, propsForElement);
      };

      StyledComponent.prototype.buildExecutionContext = function buildExecutionContext(theme, props, attrs) {
        var _this2 = this;

        var context = _extends({}, props, {
          theme: theme
        });

        if (!attrs.length) return context;
        this.attrs = {};
        attrs.forEach(function (attrDef) {
          var resolvedAttrDef = attrDef;
          var attrDefWasFn = false;
          var attr = void 0;
          var key = void 0;

          if (isFunction(resolvedAttrDef)) {
            // $FlowFixMe
            resolvedAttrDef = resolvedAttrDef(context);
            attrDefWasFn = true;
          }
          /* eslint-disable guard-for-in */
          // $FlowFixMe


          for (key in resolvedAttrDef) {
            attr = resolvedAttrDef[key];

            if (!attrDefWasFn) {
              if (isFunction(attr) && !isDerivedReactComponent(attr) && !isStyledComponent(attr)) {

                attr = attr(context);
              }
            }

            _this2.attrs[key] = attr;
            context[key] = attr;
          }
          /* eslint-enable */

        });
        return context;
      };

      StyledComponent.prototype.generateAndInjectStyles = function generateAndInjectStyles(theme, props) {
        var _props$forwardedCompo2 = props.forwardedComponent,
            attrs = _props$forwardedCompo2.attrs,
            componentStyle = _props$forwardedCompo2.componentStyle;
            _props$forwardedCompo2.warnTooManyClasses; // statically styled-components don't need to build an execution context object,
        // and shouldn't be increasing the number of class names

        if (componentStyle.isStatic && !attrs.length) {
          return componentStyle.generateAndInjectStyles(EMPTY_OBJECT, this.styleSheet);
        }

        var className = componentStyle.generateAndInjectStyles(this.buildExecutionContext(theme, props, attrs), this.styleSheet);
        return className;
      };

      return StyledComponent;
    }(React.Component);

    function createStyledComponent(target, options, rules) {
      var isTargetStyledComp = isStyledComponent(target);
      var isClass = !isTag(target);
      var _options$displayName = options.displayName,
          displayName = _options$displayName === undefined ? generateDisplayName(target) : _options$displayName,
          _options$componentId = options.componentId,
          componentId = _options$componentId === undefined ? generateId$1(ComponentStyle, options.displayName, options.parentComponentId) : _options$componentId,
          _options$ParentCompon = options.ParentComponent,
          ParentComponent = _options$ParentCompon === undefined ? StyledComponent : _options$ParentCompon,
          _options$attrs = options.attrs,
          attrs = _options$attrs === undefined ? EMPTY_ARRAY : _options$attrs;
      var styledComponentId = options.displayName && options.componentId ? escape(options.displayName) + '-' + options.componentId : options.componentId || componentId; // fold the underlying StyledComponent attrs up (implicit extend)

      var finalAttrs = // $FlowFixMe
      isTargetStyledComp && target.attrs ? Array.prototype.concat(target.attrs, attrs).filter(Boolean) : attrs;
      var componentStyle = new ComponentStyle(isTargetStyledComp ? // fold the underlying StyledComponent rules up (implicit extend)
      // $FlowFixMe
      target.componentStyle.rules.concat(rules) : rules, finalAttrs, styledComponentId);
      /**
       * forwardRef creates a new interim component, which we'll take advantage of
       * instead of extending ParentComponent to create _another_ interim class
       */

      var WrappedStyledComponent = void 0;

      var forwardRef = function forwardRef(props, ref) {
        return /*#__PURE__*/React__default["default"].createElement(ParentComponent, _extends({}, props, {
          forwardedComponent: WrappedStyledComponent,
          forwardedRef: ref
        }));
      };

      forwardRef.displayName = displayName;
      WrappedStyledComponent = /*#__PURE__*/React__default["default"].forwardRef(forwardRef);
      WrappedStyledComponent.displayName = displayName; // $FlowFixMe

      WrappedStyledComponent.attrs = finalAttrs; // $FlowFixMe

      WrappedStyledComponent.componentStyle = componentStyle; // $FlowFixMe

      WrappedStyledComponent.foldedComponentIds = isTargetStyledComp ? // $FlowFixMe
      Array.prototype.concat(target.foldedComponentIds, target.styledComponentId) : EMPTY_ARRAY; // $FlowFixMe

      WrappedStyledComponent.styledComponentId = styledComponentId; // fold the underlying StyledComponent target up since we folded the styles
      // $FlowFixMe

      WrappedStyledComponent.target = isTargetStyledComp ? target.target : target; // $FlowFixMe

      WrappedStyledComponent.withComponent = function withComponent(tag) {
        var previousComponentId = options.componentId,
            optionsToCopy = objectWithoutProperties(options, ['componentId']);
        var newComponentId = previousComponentId && previousComponentId + '-' + (isTag(tag) ? tag : escape(getComponentName(tag)));

        var newOptions = _extends({}, optionsToCopy, {
          attrs: finalAttrs,
          componentId: newComponentId,
          ParentComponent: ParentComponent
        });

        return createStyledComponent(tag, newOptions, rules);
      }; // $FlowFixMe


      Object.defineProperty(WrappedStyledComponent, 'defaultProps', {
        get: function get$$1() {
          return this._foldedDefaultProps;
        },
        set: function set$$1(obj) {
          // $FlowFixMe
          this._foldedDefaultProps = isTargetStyledComp ? merge(target.defaultProps, obj) : obj;
        }
      });


      WrappedStyledComponent.toString = function () {
        return '.' + WrappedStyledComponent.styledComponentId;
      };

      if (isClass) {
        hoistNonReactStatics(WrappedStyledComponent, target, {
          // all SC-specific things should not be hoisted
          attrs: true,
          componentStyle: true,
          displayName: true,
          foldedComponentIds: true,
          styledComponentId: true,
          target: true,
          withComponent: true
        });
      }

      return WrappedStyledComponent;
    } // 
    // Thanks to ReactDOMFactories for this handy list!


    var domElements = ['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'big', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'marquee', 'menu', 'menuitem', 'meta', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr', // SVG
    'circle', 'clipPath', 'defs', 'ellipse', 'foreignObject', 'g', 'image', 'line', 'linearGradient', 'marker', 'mask', 'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect', 'stop', 'svg', 'text', 'tspan']; // 

    var styled = function styled(tag) {
      return constructWithOptions(createStyledComponent, tag);
    }; // Shorthands for all valid HTML Elements


    domElements.forEach(function (domElement) {
      styled[domElement] = styled(domElement);
    }); // 
    // place our cache into shared context so it'll persist between HMRs


    if (IS_BROWSER) {
      window.scCGSHMRCache = {};
    }


    var styled$1 = styled;

    var _excluded$4 = ["children"];

    var _templateObject$g, _templateObject2$3;
    var IFrameContainer = styled$1.div(_templateObject$g || (_templateObject$g = _taggedTemplateLiteral(["\n    display: flex;\n    height: 100%;\n    width: 100%;\n"])));
    var IFrame = styled$1.iframe(_templateObject2$3 || (_templateObject2$3 = _taggedTemplateLiteral(["\n    margin: 1rem 1rem 0 1rem;\n    flex: 1;\n    border-radius: .25rem .25rem 0 0;\n"])));

    var ObjectHomeIFrame = function ObjectHomeIFrame(_ref) {
      _ref.children;
          var props = _objectWithoutProperties(_ref, _excluded$4);

      return /*#__PURE__*/React__namespace.createElement(Provider, {
        store: store
      }, /*#__PURE__*/React__namespace.createElement(Bootstrap, null, /*#__PURE__*/React__namespace.createElement(IFrameContainer, null, /*#__PURE__*/React__namespace.createElement(IFrame, props))));
    };

    var generateIFrame = function generateIFrame(url) {
      return function (Wrapcomponent) {
        return function () {
          var props = {};

          if (typeof url === "string") {
            props.src = url;
          } else if (typeof url === "function") {
            props.src = url();
          }

          return /*#__PURE__*/React__namespace.createElement(Wrapcomponent, props);
        };
      };
    };

    var _ = require('underscore');
    /**
    * Register a plugin to window
    */
    var registerPlugin = function (pluginName, pluginInstance) {
        // 保存到 store 中。
        // 调用 pluginInstance.initialize() 函数
        store.dispatch(receivePluginInstance(pluginName, pluginInstance));
        var registry = new PluginRegistry(pluginName);
        pluginInstance.initialize(registry, store);
    };
    var registerWindowLibraries = function () {
        // window["React"] = React;
        // window["PropTypes"] = PropTypes;
        // window["ReactDom"] = ReactDom;
        // window["Redux"] = Redux;
        // window["ReactRedux"] = ReactRedux;
        // window["ReactDesignSystem"] = ReactDesignSystem;
        // window["ReactSteedos"] = ReactSteedos;
        // window["StyledComponents"] = styled;
        // window["ReduxThunk"] = ReduxThunk;
        // window["Immer"] = Immer;
        // window["TSODataClient"] = TSODataClient;
        // window["NodeFetch"] = NodeFetch;
        // window["SteedosFilters"] = SteedosFilters;
        window["registerPlugin"] = registerPlugin;
    };
    function dispatchPluginComponentAction(name, pluginId, component, id) {
        if (id === void 0) { id = ""; }
        if (!id) {
            id = generateId();
        }
        store.dispatch(receivePluginComponent(name, {
            id: id,
            pluginId: pluginId,
            component: component
        }));
        return id;
    }
    function generateId() {
        // implementation taken from http://stackoverflow.com/a/2117523
        var id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
        id = id.replace(/[xy]/g, function (c) {
            var r = Math.floor(Math.random() * 16);
            var v;
            if (c === 'x') {
                v = r;
            }
            else {
                v = (r & 0x3) | 0x8;
            }
            return v.toString(16);
        });
        return id;
    }
    var PluginRegistry = /** @class */ (function () {
        function PluginRegistry(id) {
            var _this = this;
            /**
            * Register a component that show a dashboard to the object home
            */
            this.registerObjectHomeComponent = function (objectName, componentClass) {
                // 保存到 store 中。
                dispatchPluginComponentAction("ObjectHome", _this.id, componentClass, objectName);
            };
            /**
            * Register a component that show a iframe as the dashboard to the object home
            */
            this.registerObjectIFrameHomeComponent = function (objectName, url, componentClass) {
                if (componentClass) {
                    componentClass = generateIFrame(url)(componentClass);
                }
                else {
                    componentClass = generateIFrame(url)(ObjectHomeIFrame);
                }
                // 保存到 store 中。
                dispatchPluginComponentAction("ObjectHome", _this.id, componentClass, objectName);
            };
            /**
            * Register a component that show a dashboard to the app
            */
            this.registerDashboardComponent = function (appNames, componentClass) {
                // 保存到 store 中。
                if (!_.isArray(appNames)) {
                    appNames = appNames.split(",");
                }
                appNames.forEach(function (item) {
                    dispatchPluginComponentAction("Dashboard", _this.id, componentClass, item);
                });
            };
            /**
            * Register a component that show a iframe as the dashboard to the app
            */
            this.registerDashboardIFrameComponent = function (appNames, url, componentClass) {
                if (componentClass) {
                    componentClass = generateIFrame(url)(componentClass);
                }
                else {
                    componentClass = generateIFrame(url)(ObjectHomeIFrame);
                }
                // 保存到 store 中。
                if (!_.isArray(appNames)) {
                    appNames = appNames.split(",");
                }
                appNames.forEach(function (item) {
                    dispatchPluginComponentAction("Dashboard", _this.id, componentClass, item);
                });
            };
            /**
            * Register a component that show a dashboard
            */
            this.registerNotificationsComponent = function (name, componentClass) {
                // 保存到 store 中。
                dispatchPluginComponentAction("Notifications", _this.id, componentClass, name);
            };
            this.id = id;
        }
        return PluginRegistry;
    }());

    var getObjectRecordUrl = function getObjectRecordUrl(objectName, recordId) {
      var url = "/app/-/".concat(objectName, "/view/").concat(recordId);
      return getRelativeUrl(url);
    };
    var getObjectUrl = function getObjectUrl(objectName) {
      var url = "/app/-/".concat(objectName);
      return getRelativeUrl(url);
    };
    var getAbsoluteUrl = function getAbsoluteUrl(url) {
      if (window.Meteor && !/^http(s?):\/\//.test(url)) {
        return window.Steedos.absoluteUrl(url);
      }

      return url;
    };
    var getRelativeUrl = function getRelativeUrl(url) {
      if (window.Meteor && !/^http(s?):\/\//.test(url)) {
        return window.Creator.getRelativeUrl(url);
      }

      return url;
    };
    var isMobile = function isMobile() {
      if (window.Steedos && window.Steedos.isMobile()) {
        // Steedos.isMobile中写的是：$(window).width()<767
        return true;
      } else {
        return window.outerWidth < 767;
      }
    };
    var getWidgetReductsConfig = function getWidgetReductsConfig() {
      // 简化组件时默认的标准配置
      return {
        "instances_pendings": {
          "label": "待审核文件",
          "position": "CENTER_TOP",
          "type": "object",
          "objectName": "instances",
          "filters": [[["inbox_users", "=", "{userId}"], "or", ["cc_users", "=", "{userId}"]]],
          "sort": "modified desc",
          "columns": [{
            "label": "名称",
            "field": "name",
            "href": true
          }, {
            "label": "提交人",
            "field": "submitter_name",
            "width": "10rem"
          }, {
            "label": "修改时间",
            "field": "modified",
            "type": "datetime",
            "width": "10rem"
          }],
          "noHeader": false,
          "unborderedRow": true,
          "showAllLink": false,
          "illustration": {
            "messageBody": "您没有待审核文件。"
          },
          rowIcon: {
            category: "standard",
            name: "task",
            size: "small"
          }
        },
        "announcements_week": {
          "label": "本周公告",
          "position": "CENTER_TOP",
          "type": "object",
          "objectName": "announcements",
          "filters": [[["owner", "=", "{userId}"], 'or', ["members", "=", "{userId}"]], ['created', 'between', 'last_7_days']],
          "sort": "created desc",
          "columns": [{
            "field": "name",
            "label": "标题",
            "href": true
          }, {
            "field": "created",
            "label": "发布时间",
            "width": "10rem",
            "type": "datetime"
          }],
          "noHeader": false,
          "unborderedRow": true,
          "showAllLink": true,
          "illustration": {
            "messageBody": "本周没有新公告。"
          },
          rowIcon: {
            category: "standard",
            name: "announcement",
            size: "small"
          }
        },
        "tasks_today": {
          "label": "今日任务",
          "position": "RIGHT",
          "type": "object",
          "objectName": "tasks",
          "filters": [["assignees", "=", "{userId}"], ["state", "<>", "complete"], ['due_date', 'between', 'last_30_days']],
          "sort": "due_date",
          "columns": [{
            "field": "name",
            "label": "主题",
            "href": true
          }],
          "unborderedRow": true,
          "showAllLink": true,
          "illustration": {
            "messageBody": "您今天没有待办任务。"
          },
          "noHeader": true,
          rowIcon: {
            category: "standard",
            name: "timesheet_entry",
            size: "small"
          }
        },
        "events_today": {
          label: "今日日程",
          position: "RIGHT",
          type: "object",
          objectName: "events",
          filters: function filters() {
            var Creator = window.Creator;
            var utcOffset = Creator && Creator.USER_CONTEXT.user && Creator.USER_CONTEXT.user.utcOffset;

            if (!utcOffset && utcOffset !== 0) {
              utcOffset = moment$1().utcOffset() / 60;
            }

            var today = lib.getBetweenTimeBuiltinValueItem("today", utcOffset);
            var start = today.values[0];
            var end = today.values[1];
            return [[['owner', '=', '{userId}'], 'or', ['assignees', '=', '{userId}']], [['end', '>=', start], ['start', '<=', end]]];
          },
          sort: "start desc, end",
          columns: [{
            field: "name",
            label: "主题",
            href: true
          }],
          unborderedRow: true,
          showAllLink: true,
          illustration: {
            messageBody: "您今天没有日程。"
          },
          "noHeader": true,
          rowIcon: {
            category: "standard",
            name: "event",
            size: "small"
          }
        }
      };
    };

    var _templateObject$f, _templateObject2$2, _templateObject3$1, _templateObject4$1;
    var Container$2 = styled$1.div(_templateObject$f || (_templateObject$f = _taggedTemplateLiteral(["\n    &.loading{\n        .slds-button_icon-container{\n            display: none;\n        }\n    }\n    .slds-popover__body{\n        max-height: 420px;\n        overflow-y: auto;\n    }\n    .slds-popover{\n        .slds-popover__body{\n            padding: 0;\n            width: 100%;\n        }\n    }\n    @media (max-width: 767px) {\n        .slds-notification-badge{\n            top: 6px;\n            right: 6px;\n        }\n        .slds-global-actions__notifications{\n            width: 2.75rem!important;\n            height: 2.75rem!important;\n        }\n    }\n"])));
    var LoadingContainer = styled$1.div(_templateObject2$2 || (_templateObject2$2 = _taggedTemplateLiteral(["\n    text-align: center;\n"])));
    var EmptyContainer = styled$1.div(_templateObject3$1 || (_templateObject3$1 = _taggedTemplateLiteral(["\n    text-align: center;\n    padding: .5rem .75rem;\n"])));
    var ContentContainer = styled$1.div(_templateObject4$1 || (_templateObject4$1 = _taggedTemplateLiteral(["\n    .slds-avatar img{\n        width: 100%;\n        height: 100%;\n    }\n"])));

    var LoadingIcon = function LoadingIcon(props) {
      return /*#__PURE__*/React__namespace.createElement(designSystem.Icon, {
        containerStyle: {
          backgroundColor: 'transparent'
        },
        style: {
          fill: '#000'
        },
        category: "standard",
        colorVariant: "base",
        name: "generic_loading"
      });
    };

    var HeaderNotificationsCustomHeading = function HeaderNotificationsCustomHeading(props) {
      return /*#__PURE__*/React__namespace.createElement("div", null, /*#__PURE__*/React__namespace.createElement("span", null, props.title), props.isUnreadEmpty ? null : /*#__PURE__*/React__namespace.createElement(designSystem.Button, {
        label: props.assistiveText.markAllAsRead,
        onClick: props.onMarkReadAll,
        variant: "link",
        style: {
          float: "right",
          fontSize: "0.9rem",
          marginTop: "0.12rem",
          outline: "none"
        },
        iconCategory: "standard",
        iconName: props.isMethodLoading ? "generic_loading" : "",
        iconSize: "large"
      }));
    };

    HeaderNotificationsCustomHeading.displayName = 'HeaderNotificationsCustomHeading';

    var getItemUrl = function getItemUrl(item) {
      if (window.Meteor && window.Steedos.isMobile()) {
        return 'javascript:void(0);';
      } else {
        return getRelativeUrl("/api/v4/notifications/".concat(item._id, "/read"));
      }
    };

    var itemOnClick = function itemOnClick(item) {
      if (window.Meteor && window.Steedos.isMobile()) {
        window.$.ajax({
          url: getAbsoluteUrl("/api/v4/notifications/".concat(item._id, "/read?async")),
          type: "get",
          data: {},
          async: false,
          beforeSend: function beforeSend(request) {
            request.setRequestHeader('X-User-Id', getUserId());
            request.setRequestHeader('X-Auth-Token', getAuthToken());
            request.setRequestHeader('X-Space-Id', getSpaceId());
          },
          success: function success(result) {
            if (result && result.redirect) {
              //此处连续调用2次click用于解决IOS设备上，点击通知记录后，popover不关闭问题。
              window.$(".slds-button_icon", window.$('#header-notifications-popover-id-popover')).trigger('click');
              window.$(".slds-button_icon", window.$('#header-notifications-popover-id-popover')).trigger('click');
              var url = result.redirect;
              var ROOT_URL_PATH_PREFIX = window.__meteor_runtime_config__.ROOT_URL_PATH_PREFIX;

              if (ROOT_URL_PATH_PREFIX && url.startsWith(ROOT_URL_PATH_PREFIX)) {
                url = url.replace(ROOT_URL_PATH_PREFIX, '');
              }

              window.FlowRouter.go(url);
            }
          }
        });
      }
    };

    var getItemAvatarUrl = function getItemAvatarUrl(item) {
      if (item.from) {
        return getAbsoluteUrl("/avatar/".concat(item.from));
      } else {
        return getRelativeUrl("/packages/steedos_lightning-design-system/client/images/themes/oneSalesforce/lightning_lite_profile_avatar_96.png");
      }
    };

    var HeaderNotificationsCustomContent = function HeaderNotificationsCustomContent(props) {
      if (props.isEmpty) {
        return /*#__PURE__*/React__namespace.createElement(EmptyContainer, null, props.assistiveText.emptyNotifications);
      } else if (props.isLoading) {
        return /*#__PURE__*/React__namespace.createElement(LoadingContainer, null, /*#__PURE__*/React__namespace.createElement(LoadingIcon, null));
      } else {
        return /*#__PURE__*/React__namespace.createElement(ContentContainer, null, /*#__PURE__*/React__namespace.createElement("ul", {
          id: "header-notifications-custom-popover-content"
        }, props.items.map(function (item) {
          return /*#__PURE__*/React__namespace.createElement("li", {
            className: "slds-global-header__notification ".concat(item.is_read ? '' : 'slds-global-header__notification_unread'),
            key: "notification-item-".concat(item._id)
          }, /*#__PURE__*/React__namespace.createElement("div", {
            className: "slds-media slds-has-flexi-truncate slds-p-around_x-small"
          }, /*#__PURE__*/React__namespace.createElement("div", {
            className: "slds-media__figure"
          }, /*#__PURE__*/React__namespace.createElement("span", {
            className: "slds-avatar slds-avatar_small"
          }, /*#__PURE__*/React__namespace.createElement("img", {
            alt: item.name,
            src: getItemAvatarUrl(item),
            title: "".concat(item.name, "\"")
          }))), /*#__PURE__*/React__namespace.createElement("div", {
            className: "slds-media__body"
          }, /*#__PURE__*/React__namespace.createElement("div", {
            className: "slds-grid slds-grid_align-spread"
          }, /*#__PURE__*/React__namespace.createElement("a", {
            href: getItemUrl(item),
            target: "_blank",
            className: "slds-text-link_reset slds-has-flexi-truncate",
            onClick: function onClick() {
              itemOnClick(item);
            }
          }, /*#__PURE__*/React__namespace.createElement("h3", {
            className: "slds-truncate",
            title: "".concat(item.name)
          }, /*#__PURE__*/React__namespace.createElement("strong", null, "".concat(item.name))), /*#__PURE__*/React__namespace.createElement("p", {
            className: "slds-truncate",
            title: item.body
          }, item.body), /*#__PURE__*/React__namespace.createElement("p", {
            className: "slds-m-top_x-small slds-text-color_weak"
          }, moment$1(item.created).startOf().fromNow(), ' ', item.is_read ? null : /*#__PURE__*/React__namespace.createElement("abbr", {
            className: "slds-text-link slds-m-horizontal_xxx-small",
            title: "unread"
          }, "\u25CF")))))));
        })));
      }
    };

    HeaderNotificationsCustomContent.displayName = 'HeaderNotificationsCustomContent';

    var Notifications$1 = /*#__PURE__*/function (_React$Component) {
      _inherits(Notifications, _React$Component);

      var _super = _createSuper(Notifications);

      function Notifications(props) {
        var _this;

        _classCallCheck$1(this, Notifications);

        _this = _super.call(this, props);

        _defineProperty$2(_assertThisInitialized(_this), "state", {});

        return _this;
      }

      _createClass$1(Notifications, [{
        key: "componentDidMount",
        value: function componentDidMount() {
          var init = this.props.init;

          if (init) {
            var options = Object.assign({}, this.props, {
              pageSize: this.props.top
            });
            init(options);
          }
        }
      }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
          var exist = this.props.exist;

          if (exist) {
            exist(this.props);
          }
        }
      }, {
        key: "getPopover",
        value: function getPopover() {
          var _this$props = this.props,
              items = _this$props.rows,
              isLoading = _this$props.loading,
              isMethodLoading = _this$props.methodLoading,
              isItemsLoaded = _this$props.itemsLoaded,
              title = _this$props.title,
              onMarkReadAll = _this$props.onMarkReadAll,
              unreadCount = _this$props.unreadCount,
              assistiveText = _this$props.assistiveText;
          var isEmpty = isLoading ? false : items.length === 0;
          var isUnreadEmpty = !!!unreadCount;
          return /*#__PURE__*/React__namespace.createElement(designSystem.Popover, {
            ariaLabelledby: "header-notifications-custom-popover-content",
            body: /*#__PURE__*/React__namespace.createElement(HeaderNotificationsCustomContent, {
              isLoading: isItemsLoaded ? false : isLoading,
              isEmpty: isEmpty,
              items: items,
              assistiveText: assistiveText
            }),
            heading: /*#__PURE__*/React__namespace.createElement(HeaderNotificationsCustomHeading, {
              isUnreadEmpty: isUnreadEmpty,
              title: title,
              onMarkReadAll: onMarkReadAll,
              isMethodLoading: isMethodLoading,
              assistiveText: assistiveText
            }),
            id: "header-notifications-popover-id"
          });
        }
      }, {
        key: "render",
        value: function render() {
          var _this$props2 = this.props,
              unreadCount = _this$props2.unreadCount,
              countLoading = _this$props2.countLoading,
              assistiveText = _this$props2.assistiveText;
          var popover = this.getPopover();
          return /*#__PURE__*/React__namespace.createElement(Container$2, {
            className: countLoading ? "loading" : ""
          }, /*#__PURE__*/React__namespace.createElement(designSystem.GlobalHeaderNotifications, {
            assistiveText: {
              newNotificationsAfter: assistiveText.newNotificationsAfter,
              newNotificationsBefore: assistiveText.newNotificationsBefore,
              noNotifications: assistiveText.noNotifications
            },
            notificationCount: countLoading ? 0 : unreadCount,
            popover: popover
          }), countLoading ? /*#__PURE__*/React__namespace.createElement(LoadingIcon, null) : "");
        }
      }]);

      return Notifications;
    }(React__namespace.Component);

    _defineProperty$2(Notifications$1, "defaultProps", {
      title: "通知",
      rows: [],
      top: 10,
      loadDataAfterRender: true,
      assistiveText: {
        newNotificationsAfter: "条新通知",
        newNotificationsBefore: "收到",
        noNotifications: "无新通知",
        markAllAsRead: "全部标记为已读",
        emptyNotifications: "您现在没有任何通知。"
      }
    });

    _defineProperty$2(Notifications$1, "propTypes", {
      title: PropTypes.string,
      rows: PropTypes.array,
      interval: PropTypes.number,
      //定时多少秒抓取一次数据
      filters: PropTypes.array,
      //过滤条件，默认过滤当前用户收到的工作区范围所有通知
      top: PropTypes.number,
      //抓取多少条数据
      sort: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
      // 未配置时为"created desc, name"
      markReadAllApiUrl: PropTypes.string,
      //全部标记为已读的url可配置，默认不需要配置，未配置时为：/api/v4/notifications/all/markReadAll
      loadDataAfterRender: PropTypes.bool,
      //组件加载后是否默认请求一次数据
      assistiveText: PropTypes.shape({
        newNotificationsAfter: PropTypes.string,
        newNotificationsBefore: PropTypes.string,
        noNotifications: PropTypes.string,
        markAllAsRead: PropTypes.string,
        emptyNotifications: PropTypes.string
      })
    });

    function mapStateToProps$b() {
        return function (state, ownProps) {
            ownProps.id = ownProps.id || makeNewID(ownProps);
            var entityState = viewStateSelector(state, ownProps.id) || {};
            return Object.assign({}, entityState, __assign(__assign({}, entityState), ownProps));
        };
    }
    var mapDispatchToProps$f = function (dispatch, ownProps) {
        return ({
            init: function (options) {
                if (options.interval) {
                    dispatch(loadNotificationsDataInterval(options));
                }
                else if (options.loadDataAfterRender) {
                    dispatch(loadNotificationsData(options));
                }
            },
            exist: function (options) {
                if (options.interval) {
                    dispatch(clearNotificationsInterval(options));
                }
            },
            onMarkReadAll: function (event, data) {
                var options;
                if (ownProps.markReadAllApiUrl) {
                    options = { url: ownProps.markReadAllApiUrl, methodName: "markReadAll" };
                }
                else {
                    options = { methodRecordId: "all", methodName: "markReadAll" };
                }
                dispatch(postNotificationsMethod(__assign(__assign({}, ownProps), options)));
            },
        });
    };
    var Notifications = connect(mapStateToProps$b, mapDispatchToProps$f)(Notifications$1);

    var HeaderNotifications = function (_a) {
        _a.children; var props = __rest(_a, ["children"]);
        return (React__default["default"].createElement(Provider, { store: store },
            React__default["default"].createElement(Bootstrap, null,
                React__default["default"].createElement(Notifications, __assign({}, props)))));
    };
    var DefaultPlugin = /** @class */ (function () {
        function DefaultPlugin() {
        }
        DefaultPlugin.prototype.initialize = function (registry, store) {
            registry.registerNotificationsComponent('steedos-default-header-notifications', HeaderNotifications);
        };
        return DefaultPlugin;
    }());
    var registerDefaultPlugins = function () {
        registerPlugin('com.steedos.default', new DefaultPlugin());
    };

    var getUserId = function getUserId() {
      if (window.Meteor) {
        return window.Meteor.userId();
      }

      return getCookie("X-User-Id");
    };
    var getAuthToken = function getAuthToken() {
      if (window.Meteor) {
        return window.Accounts._storedLoginToken();
      }

      return getCookie("X-Auth-Token");
    };
    var getSpaceId = function getSpaceId() {
      if (window.Meteor) {
        return window.Steedos.spaceId();
      }

      return getCookie("X-Space-Id");
    };

    var Bootstrap$1 = /*#__PURE__*/function (_React$Component) {
      _inherits(Bootstrap, _React$Component);

      var _super = _createSuper(Bootstrap);

      function Bootstrap() {
        var _this;

        _classCallCheck$1(this, Bootstrap);

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        _this = _super.call.apply(_super, [this].concat(args));

        _defineProperty$2(_assertThisInitialized(_this), "state", {
          isBootstrapLoaded: false
        });

        return _this;
      }

      _createClass$1(Bootstrap, [{
        key: "getChildContext",
        value: function getChildContext() {
          var iconPath = getRelativeUrl('/assets/icons');
          return {
            iconPath: iconPath
          };
        }
      }, {
        key: "componentDidMount",
        value: function componentDidMount() {
          var _this$props = this.props,
              loadBootstrap = _this$props.loadBootstrap,
              isBootstrapLoaded = _this$props.isBootstrapLoaded,
              isRequestStarted = _this$props.isRequestStarted;

          if (!isBootstrapLoaded && !isRequestStarted && loadBootstrap) {
            loadBootstrap(this.props);
          }
        }
      }, {
        key: "render",
        value: function render() {
          var isBootstrapLoaded = this.props.isBootstrapLoaded;

          if (!isBootstrapLoaded) {
            return null;
          }

          return /*#__PURE__*/React__namespace.createElement(React__namespace.Fragment, null, this.props.children);
        }
      }]);

      return Bootstrap;
    }(React__namespace.Component);

    _defineProperty$2(Bootstrap$1, "defaultProps", {});

    _defineProperty$2(Bootstrap$1, "propTypes", {});

    Bootstrap$1.childContextTypes = {
      iconPath: PropTypes.string
    };

    function mapStateToProps$a() {
        return function (state, ownProps) {
            var space = entityStateSelector(state, "space") || null;
            return Object.assign({ isBootstrapLoaded: !!space }, __assign(__assign({}, ownProps), { isRequestStarted: isRequestStarted(state) }));
        };
    }
    var mapDispatchToProps$e = function (dispatch, ownProps) {
        return ({
            // handleChanged: (event: any, data: any) => dispatch(createActionBootstrap('changeSpace', data.spaceId)),
            loadBootstrap: function (options) {
                dispatch(loadBootstrapEntitiesData(options));
            }
        });
    };
    var Bootstrap = connect(mapStateToProps$a, mapDispatchToProps$e)(Bootstrap$1);

    // 	...elem,
    // 	...{
    // 		icon: (
    // 			<Icon
    // 				assistiveText={{ label: 'Account' }}
    // 				category="standard"
    // 				name={elem.type}
    // 			/>
    // 		),
    // 	},
    // }));

    /**
     *
     * TODO 
     * 	1 selection Icon 
     *  2 已选中项，文字不居中
     *  3 指定对象，选择对象下的数据
     *  4 支持filters
     * @class lookup
     * @extends {React.Component}
     */

    var lookup = /*#__PURE__*/function (_React$Component) {
      _inherits(lookup, _React$Component);

      var _super = _createSuper(lookup);

      function lookup(props) {
        var _this;

        _classCallCheck$1(this, lookup);

        _this = _super.call(this, props);
        _this.state = {
          inputValue: props.search || '',
          selection: []
        };
        return _this;
      }

      _createClass$1(lookup, [{
        key: "componentDidMount",
        value: function componentDidMount() {
          if (this.props.autoload && this.props.init && this.props.isOpen !== false) {
            this.props.init(this.props);
          }
        }
      }, {
        key: "render",
        value: function render() {
          var _this2 = this;

          var _this$props = this.props,
              id = _this$props.id,
              className = _this$props.className,
              selection = _this$props.selection,
              optionsHiddenSelected = _this$props.optionsHiddenSelected,
              column = _this$props.column,
              placeholderReadOnly = _this$props.placeholderReadOnly,
              label = _this$props.label,
              onSearch = _this$props.onSearch,
              onRequestRemoveSelectedOption = _this$props.onRequestRemoveSelectedOption,
              selectionLabel = _this$props.selectionLabel,
              search = _this$props.search,
              onChange = _this$props.onChange;
              _this$props.objectName;
              var isOpen = _this$props.isOpen,
              rows = _this$props.rows,
              multiple = _this$props.multiple,
              variant = _this$props.variant;
          var selections;

          if (selection) {
            selections = [];

            _$5.forEach(selection, function (item) {
              var label;

              if (selectionLabel) {
                if (_$5.isFunction(selectionLabel)) {
                  label = selectionLabel(item);
                } else {
                  label = item[selectionLabel];
                }
              } else {
                label = item['name'];
              } // item.icon = (
              // 	<Icon
              // 		assistiveText={{ label: 'Account' }}
              // 		category="standard"
              // 		name="account"
              // 	/>
              // )


              selections.push(Object.assign({}, item, {
                label: label
              }));
            });
          }

          var options = [];
          var _rows = rows;

          if (rows.length === 0 && column && column.rows) {
            _rows = column.rows;
          }

          _$5.each(_rows, function (row) {
            options.push({
              id: row._id || row.id,
              label: row.name
            });
          });

          return /*#__PURE__*/React__default["default"].createElement(designSystem.Combobox, {
            id: id || "combobox-base",
            className: className,
            disabled: this.props.disabled,
            isOpen: isOpen,
            events: {
              onChange: onChange || function (event, data) {
                _this2.setState({
                  inputValue: data.value
                });

                if (data.value === '' && search) {
                  onSearch(event, data);
                }
              },
              onRequestRemoveSelectedOption: onRequestRemoveSelectedOption || function (event, data) {
                if (_this2.props.action) {
                  _this2.props.action('onSelect').apply(void 0, [event].concat(_toConsumableArray(Object.keys(data).map(function (key) {
                    return data[key];
                  })), [column]));
                }

                _this2.setState({
                  inputValue: '',
                  selection: data.selection
                });
              },
              onSubmit: onSearch,
              onSelect: function onSelect(event, data) {
                if (_this2.props.action) {
                  _this2.props.action('onSelect').apply(void 0, [event].concat(_toConsumableArray(Object.keys(data).map(function (key) {
                    return data[key];
                  })), [column]));
                } else if (console) {
                  console.log('onSelect', event, data);
                }

                _this2.setState({
                  inputValue: '',
                  selection: data.selection
                });
              }
            },
            labels: {
              label: label,
              placeholder: "\u641C\u7D22",
              //${object.label}
              placeholderReadOnly: placeholderReadOnly,
              multipleOptionsSelected: "\u5DF2\u9009\u4E2D".concat(this.state.selection.length, "\u9879")
            },
            multiple: multiple,
            options: designSystem.comboboxFilterAndLimit({
              inputValue: this.state.inputValue,
              limit: 10000,
              options: options,
              //accountsWithIcon
              selection: !optionsHiddenSelected ? [] : this.state.selection
            }),
            menuItemVisibleLength: 10,
            selection: selections || this.state.selection,
            value: this.state.inputValue,
            variant: variant
          });
        }
      }]);

      return lookup;
    }(React__default["default"].Component);

    _defineProperty$2(lookup, "defaultProps", {
      object: {},
      rows: [],
      multiple: false,
      variant: "base",
      optionsHiddenSelected: false,
      autoload: false
    });

    function mapStateToProps$9() {
        return function (state, ownProps) {
            ownProps.id = ownProps.id || makeNewID(ownProps);
            var entityState = viewStateSelector(state, ownProps.id) || {};
            return Object.assign({}, entityState, __assign(__assign({}, entityState), ownProps));
        };
    }
    var mapDispatchToProps$d = function (dispatch, ownProps) {
        var mapDispatch = {
            onSearch: function (event, data) { return dispatch(ownProps.onSearch(event, data)); },
            init: function (options) { return dispatch(loadLookupEntitiesData(options)); }
        };
        if (ownProps.onRequestRemoveSelectedOption) {
            mapDispatch.onRequestRemoveSelectedOption = function (event, data) { return dispatch(ownProps.onRequestRemoveSelectedOption(event, Object.assign({ column: ownProps.column }, data))); };
        }
        return mapDispatch;
    };
    var Lookup = connect(mapStateToProps$9, mapDispatchToProps$d)(lookup);

    var _templateObject$e;
    var FiltersContainer = styled$1.div(_templateObject$e || (_templateObject$e = _taggedTemplateLiteral(["\n    // padding: 1rem;\n    .slds-dropdown-trigger{\n        float: left;\n        .slds-dropdown_medium{\n            padding: 0;\n        }\n    }\n    // .slds-form-element{\n    //     width: 200px;\n    //     display: inline-block;\n    //     margin-right: 1rem\n    // }\n"])));
    var selectionLabel = 'name';
    var _columns = [{
      field: 'name',
      label: '分类'
    }];
    var variant = 'readonly';

    var filters = /*#__PURE__*/function (_React$Component) {
      _inherits(filters, _React$Component);

      var _super = _createSuper(filters);

      function filters(props) {
        var _this;

        _classCallCheck$1(this, filters);

        _this = _super.call(this, props);

        _defineProperty$2(_assertThisInitialized(_this), "getGridFilters", function (data, column) {
          var _filters = [];

          _$5.each(data, function (item) {
            if (_filters.length > 0) {
              _filters.push('or');
            }

            _filters.push([column.field, "=", item.id]);
          });

          return _filters;
        });

        _defineProperty$2(_assertThisInitialized(_this), "onSelect", function (event, data, column) {
          // console.log('this', this);
          // console.log('onSelect', event, data, column);
          var _this$props = _this.props,
              onSelect = _this$props.onSelect,
              gridProps = _this$props.gridProps;

          var _filters2 = _this.getGridFilters(data, column);

          if (onSelect) {
            return onSelect("filters", _filters2, gridProps);
          }
        });

        _defineProperty$2(_assertThisInitialized(_this), "onRequestRemoveSelectedOption", function (event, data) {
          // console.log(data);
          var _filters3 = _this.getGridFilters(data.selection, data.column);

          var gridProps = _this.props.gridProps;
          return createGridAction("filters", _filters3, gridProps);
        });

        _defineProperty$2(_assertThisInitialized(_this), "action", function (name) {
          if (name === 'onSelect') {
            return _this.onSelect;
          }
        });

        return _this;
      }

      _createClass$1(filters, [{
        key: "render",
        value: function render() {
          var _this2 = this;

          var _this$props2 = this.props,
              objectName = _this$props2.objectName,
              columns = _this$props2.columns;

          var getFilters = function getFilters(columns) {
            var _filters4 = [];

            _$5.each(columns, function (column) {
              if (column.enableFilter) {
                if (column.reference_to || column.rows) {
                  _filters4.push(
                  /*#__PURE__*/
                  // <Dropdown>
                  //     <DropdownTrigger>
                  //         <Button
                  //             iconCategory="utility"
                  //             iconName="down"
                  //             iconPosition="right"
                  //             label={column.label}
                  //         />
                  //     </DropdownTrigger>
                  //     <Lookup className="filter-item" id={`${objectName}_filter_${column.field}`} variant="readonly" objectName={column.reference_to} selectionLabel={selectionLabel} columns={_columns} isOpen={true} action={action}></Lookup>
                  // </Dropdown>
                  React__default["default"].createElement(Lookup, {
                    className: "filter-item",
                    id: "".concat(objectName, "_filter_").concat(column.field),
                    key: "".concat(objectName, "_filter_").concat(column.field),
                    variant: variant,
                    objectName: column.reference_to,
                    placeholderReadOnly: "".concat(column.label),
                    selectionLabel: selectionLabel,
                    columns: _columns,
                    column: column,
                    action: _this2.action,
                    multiple: true,
                    autoload: _$5.has(column, 'reference_to')
                  }));
                }
              }
            });

            return _filters4;
          };

          return /*#__PURE__*/React__default["default"].createElement(FiltersContainer, {
            className: "slds-p-vertical_x-small slds-p-horizontal_x-small"
          }, getFilters(columns));
        }
      }]);

      return filters;
    }(React__default["default"].Component);

    _defineProperty$2(filters, "propTypes", {
      // action: PropTypes.func.isRequired,
      objectName: PropTypes.string.isRequired,
      columns: PropTypes.arrayOf(PropTypes.shape({
        field: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        width: PropTypes.string,
        hidden: PropTypes.bool,
        onClick: PropTypes.func,
        format: PropTypes.func
      })).isRequired
    });

    // function makeMapStateToProps() {
    //     return (state: any, ownProps: any) => {
    //         let profileState = {profile: getProfile(state) || {}}
    //         return Object.assign({}, profileState, {...profileState, ...ownProps});
    //     };
    // }
    function mapStateToProps$8() {
        return function (state, ownProps) {
            ownProps.id = ownProps.id || makeNewID(ownProps);
            return Object.assign({}, ownProps);
        };
    }
    var mapDispatchToProps$c = function (dispatch, ownProps) {
        return ({
            onSelect: function (partialStateName, partialStateValue, options) { return dispatch(createGridAction(partialStateName, partialStateValue, options)); }
        });
    };
    var GridFilters = connect(mapStateToProps$8, mapDispatchToProps$c)(filters);

    /**
     * ## Constants
     */

    var BASE_SHIFT = 0;
    var TITLE_SHIFT = 1;
    var TITLES = {
      first: 'First',
      prev: "\xAB",
      prevSet: '...',
      nextSet: '...',
      next: "\xBB",
      last: 'Last'
    };
    /**
     * ## Constructor
     */

    var Pager = /*#__PURE__*/function (_React$Component) {
      _inherits(Pager, _React$Component);

      var _super = _createSuper(Pager);

      function Pager(props) {
        var _this;

        _classCallCheck$1(this, Pager);

        _this = _super.call(this, props);
        _this.handleFirstPage = _this.handleFirstPage.bind(_assertThisInitialized(_this));
        _this.handlePreviousPage = _this.handlePreviousPage.bind(_assertThisInitialized(_this));
        _this.handleNextPage = _this.handleNextPage.bind(_assertThisInitialized(_this));
        _this.handleLastPage = _this.handleLastPage.bind(_assertThisInitialized(_this));
        _this.handleMorePrevPages = _this.handleMorePrevPages.bind(_assertThisInitialized(_this));
        _this.handleMoreNextPages = _this.handleMoreNextPages.bind(_assertThisInitialized(_this));
        _this.handlePageChanged = _this.handlePageChanged.bind(_assertThisInitialized(_this));
        return _this;
      }
      /* ========================= HELPERS ==============================*/


      _createClass$1(Pager, [{
        key: "getTitles",
        value: function getTitles(key) {
          return this.props.titles[key] || TITLES[key];
        }
        /**
         * Calculates "blocks" of buttons with page numbers.
         */

      }, {
        key: "calcBlocks",
        value: function calcBlocks() {
          var props = this.props;
          var total = props.total;
          var blockSize = props.visiblePages;
          var current = props.current + TITLE_SHIFT;
          var blocks = Math.ceil(total / blockSize);
          var currBlock = Math.ceil(current / blockSize) - TITLE_SHIFT;
          return {
            total: blocks,
            current: currBlock,
            size: blockSize
          };
        }
      }, {
        key: "isPrevDisabled",
        value: function isPrevDisabled() {
          return this.props.current <= BASE_SHIFT;
        }
      }, {
        key: "isNextDisabled",
        value: function isNextDisabled() {
          return this.props.current >= this.props.total - TITLE_SHIFT;
        }
      }, {
        key: "isPrevMoreHidden",
        value: function isPrevMoreHidden() {
          var blocks = this.calcBlocks();
          return blocks.total === TITLE_SHIFT || blocks.current === BASE_SHIFT;
        }
      }, {
        key: "isNextMoreHidden",
        value: function isNextMoreHidden() {
          var blocks = this.calcBlocks();
          return blocks.total === TITLE_SHIFT || blocks.current === blocks.total - TITLE_SHIFT;
        }
      }, {
        key: "visibleRange",
        value: function visibleRange() {
          var blocks = this.calcBlocks();
          var start = blocks.current * blocks.size;
          var delta = this.props.total - start;
          var end = start + (delta > blocks.size ? blocks.size : delta);
          return [start + TITLE_SHIFT, end + TITLE_SHIFT];
        }
        /* ========================= HANDLERS =============================*/

      }, {
        key: "handleFirstPage",
        value: function handleFirstPage() {
          if (!this.isPrevDisabled()) {
            this.handlePageChanged(BASE_SHIFT);
          }
        }
      }, {
        key: "handlePreviousPage",
        value: function handlePreviousPage() {
          if (!this.isPrevDisabled()) {
            this.handlePageChanged(this.props.current - TITLE_SHIFT);
          }
        }
      }, {
        key: "handleNextPage",
        value: function handleNextPage() {
          if (!this.isNextDisabled()) {
            this.handlePageChanged(this.props.current + TITLE_SHIFT);
          }
        }
      }, {
        key: "handleLastPage",
        value: function handleLastPage() {
          if (!this.isNextDisabled()) {
            this.handlePageChanged(this.props.total - TITLE_SHIFT);
          }
        }
        /**
         * Chooses page, that is one before min of currently visible
         * pages.
         */

      }, {
        key: "handleMorePrevPages",
        value: function handleMorePrevPages() {
          var blocks = this.calcBlocks();
          this.handlePageChanged(blocks.current * blocks.size - TITLE_SHIFT);
        }
        /**
         * Chooses page, that is one after max of currently visible
         * pages.
         */

      }, {
        key: "handleMoreNextPages",
        value: function handleMoreNextPages() {
          var blocks = this.calcBlocks();
          this.handlePageChanged((blocks.current + TITLE_SHIFT) * blocks.size);
        }
      }, {
        key: "handlePageChanged",
        value: function handlePageChanged(num) {
          var handler = this.props.onPageChanged;
          if (handler) handler(num);
        }
        /* ========================= RENDERS ==============================*/

        /**
         * ### renderPages()
         * Renders block of pages' buttons with numbers.
         * @param {Number[]} range - pair of [start, from], `from` - not inclusive.
         * @return {React.Element[]} - array of React nodes.
         */

      }, {
        key: "renderPages",
        value: function renderPages(pair) {
          var _this2 = this;

          return range(pair[0], pair[1]).map(function (num, idx) {
            var current = num - TITLE_SHIFT;

            var onClick = _this2.handlePageChanged.bind(_this2, current);

            var isActive = _this2.props.current === current;
            return /*#__PURE__*/React__default["default"].createElement(Page, {
              key: idx,
              index: idx,
              isActive: isActive,
              className: "btn-numbered-page",
              onClick: onClick
            }, num);
          });
        }
      }, {
        key: "render",
        value: function render() {
          var titles = this.getTitles.bind(this);
          var className = "pagination";

          if (this.props.className) {
            className += " " + this.props.className;
          }

          return /*#__PURE__*/React__default["default"].createElement("nav", null, /*#__PURE__*/React__default["default"].createElement("ul", {
            className: className
          }, /*#__PURE__*/React__default["default"].createElement(Page, {
            className: "btn-first-page",
            key: "btn-first-page",
            isDisabled: this.isPrevDisabled(),
            onClick: this.handleFirstPage
          }, titles('first')), /*#__PURE__*/React__default["default"].createElement(Page, {
            className: "btn-prev-page",
            key: "btn-prev-page",
            isDisabled: this.isPrevDisabled(),
            onClick: this.handlePreviousPage
          }, titles('prev')), /*#__PURE__*/React__default["default"].createElement(Page, {
            className: "btn-prev-more",
            key: "btn-prev-more",
            isHidden: this.isPrevMoreHidden(),
            onClick: this.handleMorePrevPages
          }, titles('prevSet')), this.renderPages(this.visibleRange()), /*#__PURE__*/React__default["default"].createElement(Page, {
            className: "btn-next-more",
            key: "btn-next-more",
            isHidden: this.isNextMoreHidden(),
            onClick: this.handleMoreNextPages
          }, titles('nextSet')), /*#__PURE__*/React__default["default"].createElement(Page, {
            className: "btn-next-page",
            key: "btn-next-page",
            isDisabled: this.isNextDisabled(),
            onClick: this.handleNextPage
          }, titles('next')), /*#__PURE__*/React__default["default"].createElement(Page, {
            className: "btn-last-page",
            key: "btn-last-page",
            isDisabled: this.isNextDisabled(),
            onClick: this.handleLastPage
          }, titles('last'))));
        }
      }]);

      return Pager;
    }(React__default["default"].Component);

    Pager.propTypes = {
      current: PropTypes.number,
      total: PropTypes.number.isRequired,
      visiblePages: PropTypes.number,
      titles: PropTypes.object,
      onPageChanged: PropTypes.func
    };
    Pager.defaultProps = {
      current: 0,
      visiblePages: 3,
      titles: TITLES
    };

    var Page = function Page(props) {
      if (props.isHidden) return null;
      var baseCss = props.className ? "".concat(props.className, " ") : '';
      var fullCss = "".concat(baseCss).concat(props.isActive ? ' active' : '').concat(props.isDisabled ? ' disabled' : '');
      return /*#__PURE__*/React__default["default"].createElement("li", {
        key: props.index,
        className: fullCss
      }, /*#__PURE__*/React__default["default"].createElement("a", {
        onClick: props.onClick
      }, props.children));
    };

    Page.propTypes = {
      isHidden: PropTypes.bool,
      isActive: PropTypes.bool,
      isDisabled: PropTypes.bool,
      className: PropTypes.string,
      onClick: PropTypes.func
    };

    function range(start, end) {
      var res = [];

      for (var i = start; i < end; i++) {
        res.push(i);
      }

      return res;
    }

    var _excluded$3 = ["children"],
        _excluded2 = ["children"];

    var _templateObject$d;

    var marked$1 = require('marked/lib/marked.js');

    var Counter$7 = styled$1.div(_templateObject$d || (_templateObject$d = _taggedTemplateLiteral(["\n\theight: 100%;\n\t&.slds-grid-no-header{\n\t\t.slds-table thead{\n\t\t\tdisplay: none;\n\t\t}\n\t}\n\t&>.slds-grid_vertical{\n\t\t/*fix IE11 \u5BBD\u5EA6\u5728\u95E8\u6237\u754C\u9762\u4F1A\u8DF3\u51FAwidget\u8303\u56F4*/\n\t\twidth: 100%;\n\t\t/*fix IE11 grid\u5217\u8868\u9876\u90E8th\u5217\u6807\u9898\u680F\u6587\u5B57\u9AD8\u5EA6\u6CA1\u6709\u5C45\u4E2D\u5BF9\u9F50*/\n\t\t.slds-table_header-fixed{\n\t\t\t.slds-cell-fixed{\n\t\t\t\t.slds-p-horizontal_x-small{\n\t\t\t\t\tline-height: 2rem!important\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n\t.slds-illustration.slds-illustration_small .slds-illustration__svg {\n\t\t/*fix IE11 \u9AD8\u5EA6\u672A\u5B9A\u4E49\u4F1A\u9020\u6210footer\u6709\u5185\u5BB9\u65F6\u5E95\u90E8\u754C\u9762\u9519\u4E71*/\n\t\theight: 10rem;\n\t}\n"])));

    var formatFileSize$1 = function formatFileSize(filesize) {
      var rev, unit;
      rev = filesize / 1024.00;
      unit = 'KB';

      if (rev > 1024.00) {
        rev = rev / 1024.00;
        unit = 'MB';
      }

      if (rev > 1024.00) {
        rev = rev / 1024.00;
        unit = 'GB';
      }

      return rev.toFixed(2) + unit;
    };

    var CustomDataTableCell = function CustomDataTableCell(_ref) {
      var children = _ref.children,
          props = _objectWithoutProperties(_ref, _excluded$3);

      var field = props.field;
      var _onClick = field.onClick,
          format = field.format;

      if (_$5.isFunction(format)) {
        children = format(children, props.item, props.options);
      }

      if (children || _$5.isBoolean(children)) {
        switch (field.type) {
          case 'datetime':
            if (_$5.isString(children) && /\d+Z$/.test(children)) {
              children = moment$1(children).format('YYYY-MM-DD H:mm');
            } else {
              var utcOffset = moment$1().utcOffset() / 60;
              children = moment$1(children).add(utcOffset, "hours").format('YYYY-MM-DD H:mm');
            }

            break;

          case 'date':
            if (_$5.isString(children) && /\d+Z$/.test(children)) {
              children = moment$1.utc(children).format('YYYY-MM-DD');
            } else {
              children = moment$1(children).format('YYYY-MM-DD');
            }

            break;

          case 'boolean':
            children = children ? '是' : '否';
            break;

          case 'lookup':
            children = children._NAME_FIELD_VALUE;
            break;

          case 'master_detail':
            children = children._NAME_FIELD_VALUE;
            break;

          case 'filesize':
            children = formatFileSize$1(children);
            break;

          case 'markdown':
            children = /*#__PURE__*/React__default["default"].createElement("div", {
              dangerouslySetInnerHTML: {
                __html: marked$1(children)
              }
            });
            break;
        }
      }

      if (_$5.isFunction(_onClick)) {
        return /*#__PURE__*/React__default["default"].createElement(designSystem.DataTableCell, _extends$1({
          title: children
        }, props), /*#__PURE__*/React__default["default"].createElement("a", {
          onClick: function onClick(event) {
            event.preventDefault();

            _onClick(event, props.item);
          }
        }, children));
      }

      var title = typeof children === "string" ? children : "";
      return /*#__PURE__*/React__default["default"].createElement(designSystem.DataTableCell, _extends$1({
        title: title
      }, props), children);
    };

    CustomDataTableCell.displayName = designSystem.DataTableCell.displayName;

    var CustomDataTableIconCell = function CustomDataTableIconCell(_ref2) {
      _ref2.children;
          var props = _objectWithoutProperties(_ref2, _excluded2);

      return /*#__PURE__*/React__default["default"].createElement(designSystem.DataTableCell, props, /*#__PURE__*/React__default["default"].createElement(designSystem.Icon, {
        category: props.category,
        name: props.name,
        size: props.size
      }));
    };

    CustomDataTableIconCell.displayName = designSystem.DataTableCell.displayName;

    var Grid$1 = /*#__PURE__*/function (_React$Component) {
      _inherits(Grid, _React$Component);

      var _super = _createSuper(Grid);

      function Grid() {
        var _this;

        _classCallCheck$1(this, Grid);

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        _this = _super.call.apply(_super, [this].concat(args));

        _defineProperty$2(_assertThisInitialized(_this), "state", {
          // sortColumn: 'opportunityName',
          // sortColumnDirection: {
          // 	opportunityName: 'asc',
          // },
          items: _this.props.rows,
          selection: _this.props.selection
        });

        _defineProperty$2(_assertThisInitialized(_this), "isEnableSearch", function () {
          var enableSearch = _this.props.enableSearch;
          return enableSearch || false;
        });

        _defineProperty$2(_assertThisInitialized(_this), "getObjectName", function () {
          var objectName = _this.props.objectName;
          return objectName;
        });

        _defineProperty$2(_assertThisInitialized(_this), "handleChanged", function (event, data) {
          _this.setState({
            selection: data.selection
          });

          console.log(event, data);
        });

        _defineProperty$2(_assertThisInitialized(_this), "handleRowAction", function (item, action) {
          console.log(item, action);
        });

        _defineProperty$2(_assertThisInitialized(_this), "handleSort", function (sortColumn) {
          if (_this.props.log) {
            for (var _len2 = arguments.length, rest = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
              rest[_key2 - 1] = arguments[_key2];
            }

            _this.props.log('sort').apply(void 0, [sortColumn].concat(rest));
          }

          var sortProperty = sortColumn.property;
          var sortDirection = sortColumn.sortDirection;
          var newState = {
            sortColumn: sortProperty,
            sortColumnDirection: _defineProperty$2({}, sortProperty, sortDirection),
            items: _toConsumableArray(_this.state.items)
          }; // needs to work in both directions

          newState.items = newState.items.sort(function (a, b) {
            var val = 0;

            if (a[sortProperty] > b[sortProperty]) {
              val = 1;
            }

            if (a[sortProperty] < b[sortProperty]) {
              val = -1;
            }

            if (sortDirection === 'desc') {
              val *= -1;
            }

            return val;
          });

          _this.setState(newState);
        });

        return _this;
      }

      _createClass$1(Grid, [{
        key: "componentDidMount",
        value: function componentDidMount() {
          if (this.props.init) {
            this.props.init(this.props);
          }
        }
      }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
          var _this$props = this.props,
              keep = _this$props.keep,
              removeViewAction = _this$props.removeViewAction,
              id = _this$props.id;

          if (!keep) {
            removeViewAction(id);
          }
        }
      }, {
        key: "getDataTableEmpty",
        value: function getDataTableEmpty(isEmpty) {
          if (!isEmpty) {
            return null;
          }

          var illustration = this.props.illustration;

          if (!illustration) {
            illustration = {};
          }

          if (!illustration.messageBody) {
            illustration.messageBody = "没有可显示的项目";
          }

          if (!illustration.path) {
            illustration.path = getRelativeUrl("/assets/images/illustrations/empty-state-no-results.svg#no-results");
          }

          return function () {
            return /*#__PURE__*/React__default["default"].createElement(designSystem.Illustration, {
              heading: illustration.heading,
              messageBody: illustration.messageBody,
              name: illustration.name,
              path: illustration.path
            });
          };
        }
      }, {
        key: "render",
        value: function render() {
          var _this2 = this;

          var _this$props2 = this.props,
              rows = _this$props2.rows,
              handleChanged = _this$props2.handleChanged,
              selection = _this$props2.selection,
              selectionLabel = _this$props2.selectionLabel,
              selectRows = _this$props2.selectRows,
              objectName = _this$props2.objectName,
              search = _this$props2.search,
              columns = _this$props2.columns,
              id = _this$props2.id,
              noHeader = _this$props2.noHeader,
              unborderedRow = _this$props2.unborderedRow,
              sort = _this$props2.sort,
              rowIcon = _this$props2.rowIcon,
              enableFilters = _this$props2.enableFilters,
              pager = _this$props2.pager,
              handlePageChanged = _this$props2.handlePageChanged,
              totalCount = _this$props2.totalCount,
              pageSize = _this$props2.pageSize,
              currentPage = _this$props2.currentPage;

          var dataTableColumns = _$5.map(columns, function (column) {
            if (!column.hidden) {
              return /*#__PURE__*/React__default["default"].createElement(designSystem.DataTableColumn, {
                label: column.label,
                property: column.field,
                key: column.field,
                width: column.width
              }, /*#__PURE__*/React__default["default"].createElement(CustomDataTableCell, {
                field: column,
                options: _this2.props
              }));
            }
          });

          if (rowIcon) {
            var iconWidth = rowIcon.width;

            if (!iconWidth) {
              iconWidth = "3rem";
            }

            dataTableColumns.unshift( /*#__PURE__*/React__default["default"].createElement(designSystem.DataTableColumn, {
              label: "",
              key: "grid-first-column-icon",
              width: iconWidth
            }, /*#__PURE__*/React__default["default"].createElement(CustomDataTableIconCell, rowIcon)));
          }

          var pagerTotal = Math.ceil(totalCount / pageSize);
          var pagerOptions = pager;

          if (pagerOptions && typeof pagerOptions === "boolean") {
            pagerOptions = {
              visiblePages: 3,
              titles: {
                first: '<|',
                last: '|>'
              }
            };
          }

          var onRequestRemoveSelectedOption = function onRequestRemoveSelectedOption(event, data) {
            return createGridAction('requestRemoveSelectedOption', data.selection, _this2.props);
          };

          var onSearch = function onSearch(event, data) {
            var newOptions = {}; //TODO:重写的currentPage未生效，但是count生效了

            if (pagerOptions) {
              newOptions.count = true;
              newOptions.currentPage = 0; // pagerOptions.currentPage = 0;
            }

            return createGridAction('search', data.value, Object.assign({}, _this2.props, newOptions));
          };

          var DataTableSearch = function DataTableSearch() {
            if (_this2.isEnableSearch()) {
              return /*#__PURE__*/React__default["default"].createElement("div", {
                className: "slds-p-vertical_x-small slds-p-horizontal_x-small slds-shrink-none slds-theme_shade"
              }, /*#__PURE__*/React__default["default"].createElement(Lookup, {
                isOpen: false,
                id: id,
                objectName: objectName,
                search: search,
                selectionLabel: selectionLabel,
                onRequestRemoveSelectedOption: onRequestRemoveSelectedOption,
                onSearch: onSearch
              }));
            } else {
              return null;
            }
          };

          var items = rows || this.state.items;
          var isLoading = this.props.loading;
          var isEmpty = isLoading ? false : items.length === 0;
          var DataTableEmpty = this.getDataTableEmpty(isEmpty);
          var extraClassNames = [];

          if (noHeader) {
            extraClassNames.push('slds-grid-no-header');
          }

          var extraClassName = extraClassNames.length ? extraClassNames.join(" ") : "";
          return /*#__PURE__*/React__default["default"].createElement(Counter$7, {
            className: "slds-grid slds-nowrap ".concat(extraClassName)
          }, /*#__PURE__*/React__default["default"].createElement("div", {
            className: "slds-col slds-grid slds-grid_vertical slds-nowrap"
          }, /*#__PURE__*/React__default["default"].createElement(DataTableSearch, null), enableFilters && /*#__PURE__*/React__default["default"].createElement(GridFilters, {
            columns: columns,
            objectName: objectName,
            gridProps: this.props
          }), isEmpty ? /*#__PURE__*/React__default["default"].createElement(DataTableEmpty, null) : /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement(designSystem.DataTable, {
            assistiveText: {
              actionsHeader: 'actions',
              columnSort: 'sort this column',
              columnSortedAscending: 'asc',
              columnSortedDescending: 'desc',
              selectAllRows: 'all rows',
              selectRow: 'Select this row'
            },
            unborderedRow: unborderedRow,
            sort: sort,
            fixedHeader: !noHeader,
            fixedLayout: true,
            items: items,
            id: id,
            onRowChange: handleChanged || this.handleChanged // onSort={this.handleSort}
            ,
            selection: selection || this.state.selection,
            selectRows: selectRows
          }, dataTableColumns), pagerOptions && pagerTotal > 1 ? /*#__PURE__*/React__default["default"].createElement(Pager, {
            total: pagerTotal,
            current: currentPage,
            visiblePages: pagerOptions.visiblePages,
            onPageChanged: handlePageChanged,
            titles: pagerOptions.titles
          }) : null)));
        }
      }]);

      return Grid;
    }(React__default["default"].Component);

    _defineProperty$2(Grid$1, "displayName", 'SteedosDataTable');

    _defineProperty$2(Grid$1, "defaultProps", {
      rows: [],
      selection: [],
      selectRows: false,
      type: 'text',
      noHeader: false,
      unborderedRow: false,
      enableFilters: false
    });

    _defineProperty$2(Grid$1, "propTypes", {
      objectName: PropTypes.string.isRequired,
      columns: PropTypes.arrayOf(PropTypes.shape({
        field: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        width: PropTypes.string,
        // wrap: PropTypes.bool,
        hidden: PropTypes.bool,
        onClick: PropTypes.func,
        format: PropTypes.func
      })).isRequired,
      enableSearch: PropTypes.bool,
      enableFilters: PropTypes.bool,
      pageSize: PropTypes.number,
      searchMode: PropTypes.oneOf(['omitFilters']),
      selectionLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
      selectRows: PropTypes.oneOf(['radio', 'checkbox', false]),
      type: PropTypes.oneOf(['date', 'datetime', 'boolean', 'lookup', 'master_detail', 'text']),
      id: PropTypes.string,
      illustration: PropTypes.shape({
        heading: PropTypes.string,
        messageBody: PropTypes.string,
        name: PropTypes.string,
        path: PropTypes.string
      }),
      noHeader: PropTypes.bool,
      unborderedRow: PropTypes.bool,
      sort: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
      rowIcon: PropTypes.shape({
        width: PropTypes.string,
        category: PropTypes.string,
        name: PropTypes.string,
        size: PropTypes.string
      }),
      baseFilters: PropTypes.array,
      spaceId: PropTypes.string,
      keep: PropTypes.bool,
      pager: PropTypes.oneOfType([PropTypes.shape({
        visiblePages: PropTypes.number,
        titles: PropTypes.shape({
          first: PropTypes.string,
          prev: PropTypes.string,
          prevSet: PropTypes.string,
          nextSet: PropTypes.string,
          next: PropTypes.string,
          last: PropTypes.string
        })
      }), PropTypes.bool])
    });

    function mapStateToProps$7() {
        return function (state, ownProps) {
            ownProps.id = ownProps.id || makeNewID(ownProps);
            var entityState = viewStateSelector(state, ownProps.id) || {};
            return Object.assign({}, entityState, __assign(__assign({}, entityState), ownProps));
        };
    }
    var mapDispatchToProps$b = function (dispatch, ownProps) {
        return ({
            handleChanged: function (event, data) { dispatch(createGridAction('selection', data.selection, ownProps)); },
            handlePageChanged: function (currentPage) {
                var newOptions = {};
                if (ownProps.pager) {
                    newOptions.count = true;
                }
                dispatch(createGridAction('currentPage', currentPage, Object.assign({}, ownProps, newOptions)));
            },
            init: function (options) {
                var newOptions = {};
                if (options.pager) {
                    newOptions.count = true;
                }
                dispatch(loadGridEntitiesData(Object.assign({}, options, newOptions)));
            },
            removeViewAction: function (viewId) { return dispatch(removeViewAction(viewId)); },
        });
    };
    var Grid = connect(mapStateToProps$7, mapDispatchToProps$b)(Grid$1);

    var _excluded$2 = ["label", "objectName", "filters", "columns", "illustration", "showAllLink", "hrefTarget", "noHeader", "assistiveText"];

    var _templateObject$c;
    var WidgetObjectContent = styled$1.div(_templateObject$c || (_templateObject$c = _taggedTemplateLiteral(["\n    .slds-table{\n        thead{\n            th{\n                &:first-child{\n                    .slds-p-horizontal_x-small{\n                        padding-left: 1rem;\n                    }\n                }\n            }\n        }\n        tbody{\n            td{\n                &:first-child{\n                    padding-left: 1rem;\n                }\n            }\n        }\n    }\n"])));

    var WidgetObject$1 = /*#__PURE__*/function (_React$Component) {
      _inherits(WidgetObject, _React$Component);

      var _super = _createSuper(WidgetObject);

      function WidgetObject(props) {
        var _this;

        _classCallCheck$1(this, WidgetObject);

        _this = _super.call(this, props);

        _defineProperty$2(_assertThisInitialized(_this), "state", {});

        return _this;
      }

      _createClass$1(WidgetObject, [{
        key: "convertObjectProps",
        value: function convertObjectProps() {
          var _this$props = this.props,
              label = _this$props.label,
              objectName = _this$props.objectName,
              filters = _this$props.filters,
              columns = _this$props.columns,
              illustration = _this$props.illustration,
              showAllLink = _this$props.showAllLink,
              hrefTarget = _this$props.hrefTarget,
              noHeader = _this$props.noHeader,
              assistiveText = _this$props.assistiveText,
              others = _objectWithoutProperties(_this$props, _excluded$2);

          if (!label) {
            label = assistiveText.label;
          }

          if (isMobile()) {
            // 手机上强制把noHeader设置为true，且只显示href为true的字段
            noHeader = true;
            columns = columns.filter(function (item) {
              return item.href;
            });
          }

          return _objectSpread2$1({
            label: label,
            objectName: objectName,
            cellListColumns: columns ? columns.map(function (column) {
              if (column.href && typeof column.format !== "function") {
                column.format = function (children, data, options) {
                  var spaceId = getSpaceId();
                  var url = "/app/-/".concat(objectName, "/view/").concat(data.id);

                  if (objectName === "instances") {
                    url = "/workflow/space/".concat(spaceId, "/inbox/").concat(data.id);
                  }

                  url = getRelativeUrl(url);
                  return /*#__PURE__*/React__namespace.createElement("a", {
                    target: hrefTarget,
                    href: url,
                    title: children
                  }, children);
                };
              }

              return column;
            }) : [],
            filters: filters,
            illustration: illustration,
            showAllLink: showAllLink,
            hrefTarget: hrefTarget,
            noHeader: noHeader
          }, others);
        }
      }, {
        key: "componentDidMount",
        value: function componentDidMount() {
          var init = this.props.init;

          if (init) {
            init(this.props);
          }
        }
      }, {
        key: "getObjectUrl",
        value: function getObjectUrl(objectName) {
          var url = "/app/-/".concat(objectName);
          url = getRelativeUrl(url);
          return url;
        }
      }, {
        key: "render",
        value: function render() {
          var convertedObjectProps = this.convertObjectProps();
          var assistiveText = this.props.assistiveText;
          var label = convertedObjectProps.label,
              objectName = convertedObjectProps.objectName,
              selectionLabel = convertedObjectProps.selectionLabel,
              cellListColumns = convertedObjectProps.cellListColumns,
              filters = convertedObjectProps.filters,
              illustration = convertedObjectProps.illustration,
              showAllLink = convertedObjectProps.showAllLink,
              hrefTarget = convertedObjectProps.hrefTarget,
              footer = convertedObjectProps.footer,
              noHeader = convertedObjectProps.noHeader,
              unborderedRow = convertedObjectProps.unborderedRow,
              sort = convertedObjectProps.sort,
              rowIcon = convertedObjectProps.rowIcon,
              maxRows = convertedObjectProps.maxRows;
          var cardFooter;

          if (_$5.isFunction(footer)) {
            cardFooter = footer(convertedObjectProps);
          } else if (showAllLink) {
            cardFooter = /*#__PURE__*/React__namespace.createElement("a", {
              href: this.getObjectUrl(objectName),
              target: hrefTarget
            }, assistiveText.allLinkLabel);
          }

          return /*#__PURE__*/React__namespace.createElement(designSystem.Card, {
            heading: label,
            footer: cardFooter
          }, /*#__PURE__*/React__namespace.createElement(WidgetObjectContent, null, /*#__PURE__*/React__namespace.createElement(Grid, {
            searchMode: "omitFilters",
            pageSize: maxRows === "all" ? null : maxRows,
            objectName: objectName,
            columns: cellListColumns,
            selectionLabel: selectionLabel,
            filters: filters,
            illustration: illustration,
            noHeader: noHeader,
            unborderedRow: unborderedRow,
            sort: sort,
            rowIcon: rowIcon
          })));
        }
      }]);

      return WidgetObject;
    }(React__namespace.Component);

    _defineProperty$2(WidgetObject$1, "defaultProps", {
      maxRows: 5,
      assistiveText: {
        label: "对象名称",
        allLinkLabel: "查看全部",
        illustrationMessageBody: "没有可显示的项目"
      }
    });

    _defineProperty$2(WidgetObject$1, "propTypes", {
      label: PropTypes.string,
      objectName: PropTypes.string,
      filters: PropTypes.oneOfType([PropTypes.array, PropTypes.func]),
      columns: PropTypes.arrayOf(PropTypes.shape({
        field: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        width: PropTypes.string,
        // wrap: PropTypes.bool,
        hidden: PropTypes.bool,
        onClick: PropTypes.func,
        format: PropTypes.func,
        href: PropTypes.bool
      })),
      illustration: PropTypes.shape({
        heading: PropTypes.string,
        messageBody: PropTypes.string,
        name: PropTypes.string,
        path: PropTypes.string
      }),
      showAllLink: PropTypes.bool,
      hrefTarget: PropTypes.string,
      footer: PropTypes.func,
      noHeader: PropTypes.bool,
      unborderedRow: PropTypes.bool,
      sort: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
      rowIcon: PropTypes.shape({
        width: PropTypes.string,
        category: PropTypes.string,
        name: PropTypes.string,
        size: PropTypes.string
      }),
      maxRows: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      assistiveText: PropTypes.shape({
        label: PropTypes.string,
        allLinkLabel: PropTypes.string
      })
    });

    function mapStateToProps$6() {
        return function (state, ownProps) {
            ownProps.id = ownProps.id || makeNewID(ownProps);
            var entityState = viewStateSelector(state, ownProps.id) || {};
            return Object.assign({}, entityState, __assign(__assign({}, entityState), ownProps));
        };
    }
    var mapDispatchToProps$a = function (dispatch, ownProps) {
        return ({
            init: function (options) {
                // dispatch(loadEntitiesData(options))
            }
        });
    };
    var WidgetObject = connect(mapStateToProps$6, mapDispatchToProps$a)(WidgetObject$1);

    var classnames = {exports: {}};

    (function (module) {
      /* global define */
      (function () {

        var hasOwn = {}.hasOwnProperty;

        function classNames() {
          var classes = [];

          for (var i = 0; i < arguments.length; i++) {
            var arg = arguments[i];
            if (!arg) continue;

            var argType = _typeof$1(arg);

            if (argType === 'string' || argType === 'number') {
              classes.push(arg);
            } else if (Array.isArray(arg)) {
              if (arg.length) {
                var inner = classNames.apply(null, arg);

                if (inner) {
                  classes.push(inner);
                }
              }
            } else if (argType === 'object') {
              if (arg.toString === Object.prototype.toString) {
                for (var key in arg) {
                  if (hasOwn.call(arg, key) && arg[key]) {
                    classes.push(key);
                  }
                }
              } else {
                classes.push(arg.toString());
              }
            }
          }

          return classes.join(' ');
        }

        if (module.exports) {
          classNames.default = classNames;
          module.exports = classNames;
        } else {
          window.classNames = classNames;
        }
      })();
    })(classnames);

    var classNames = classnames.exports;

    var _templateObject$b;
    var AppLauncherDesktopInternal = styled$1.div(_templateObject$b || (_templateObject$b = _taggedTemplateLiteral(["\n    padding: 0px 1rem;\n    .slds-section.slds-is-open{\n        .slds-section__content{\n            padding-top: 0px;\n        }\n    }\n    .slds-section__title{\n        display: none;\n    }\n    &.slds-app-launcher__show-all-items{\n        .slds-section__title{\n            display: block;\n        }\n    }\n    .slds-link{\n        color: #006dcc;\n        text-decoration: none;\n        transition: color .1s linear;\n        background-color: transparent;\n        cursor: pointer;\n        &:hover, &:focus{\n            text-decoration: underline;\n            color: #005fb2;\n        }\n    }\n    &.slds-app-launcher__mobile{\n        .slds-medium-size--1-of-3, .slds-medium-size_1-of-3{\n            width: 100%;\n        }\n    }\n    &.slds-app-launcher__mini{\n        .slds-app-launcher__tile{\n            flex-direction: column;\n            .slds-app-launcher__tile-figure{\n                justify-content: center;\n                padding-bottom: 0;\n                flex-direction: row;\n            }\n            .slds-app-launcher__tile-body{\n                text-align: center;\n                background: #fff;\n                &> div {\n                    display: none;\n                }\n                .slds-link{\n                    &>span{\n                        overflow: hidden;\n                        width: 100%;\n                        display: inline-block;\n                        white-space: nowrap;\n                        text-overflow: ellipsis;\n                    }\n                }\n            }\n        }\n        .slds-medium-size--1-of-3, .slds-medium-size_1-of-3 {\n            width: 16%;\n            @media (max-width: 1280px) {\n                width: 20%;\n            }\n            @media (max-width: 1024px) {\n                width: 20%;\n            }\n            @media (max-width: 767px) {\n                width: 25%;\n            }\n        }\n        &.slds-app-launcher__mobile{\n            .slds-medium-size--1-of-3, .slds-medium-size_1-of-3 {\n                width: 25%;\n                @media (max-width: 1680px) {\n                    width: 33.33%;\n                }\n                @media (max-width: 1280px) {\n                    width: 50%;\n                }\n                @media (max-width: 960px) {\n                    width: 100%;\n                }\n                @media (max-width: 767px) {\n                    width: 33.3333%;\n                }\n            }\n        }\n    }\n"])));

    var WidgetApps$1 = /*#__PURE__*/function (_React$Component) {
      _inherits(WidgetApps, _React$Component);

      var _super = _createSuper(WidgetApps);

      function WidgetApps(props) {
        var _this;

        _classCallCheck$1(this, WidgetApps);

        _this = _super.call(this, props);

        _defineProperty$2(_assertThisInitialized(_this), "state", {
          apps: []
        });

        return _this;
      }

      _createClass$1(WidgetApps, [{
        key: "componentDidMount",
        value: function componentDidMount() {
          var init = this.props.init;

          if (init) {
            init(this.props);
          }
        }
      }, {
        key: "getAppUrl",
        value: function getAppUrl(app, token) {
          var url = "/app/".concat(app._id);

          if (app.url) {
            url = app.url;
          }

          url = getRelativeUrl(url);

          if (url.indexOf("?") > -1) {
            url += "&token=".concat(token);
          } else {
            url += "?token=".concat(token);
          }

          return url;
        }
      }, {
        key: "onTileClick",
        value: function onTileClick(event, app, tile, index) {
          if (app && window.Creator && window.Creator.openApp) {
            window.Creator.openApp(app._id, event);
          }

          var onTileClick = this.props.onTileClick;

          if (onTileClick) {
            onTileClick.call(this, event, app, tile, index);
          }
        }
      }, {
        key: "getAppCells",
        value: function getAppCells(apps) {
          var _this2 = this;

          if (apps) {
            var onTileClick = this.onTileClick; //TODO 标准参数不应该直接从cookies中获取，因为手机版暂时获取不到cookie

            var token = getCookie("X-Access-Token");
            var self = this;
            return _$5.map(apps, function (app, key) {
              if (app && app.label) {
                var url = _this2.getAppUrl(app, token);

                var target = app.is_new_window ? "_blank" : null;
                return /*#__PURE__*/React__namespace.createElement(designSystem.AppLauncherTile, {
                  assistiveText: {
                    dragIconText: app.label
                  },
                  key: key,
                  description: app.description,
                  iconNode: /*#__PURE__*/React__namespace.createElement(designSystem.Icon, {
                    assistiveText: {
                      label: app.label
                    },
                    category: "standard",
                    name: app.icon_slds
                  }),
                  title: app.label,
                  href: url,
                  target: target,
                  onClick: function onClick(e) {
                    onTileClick.call(self, e, app, _objectSpread2$1({}, _this2), key);
                  },
                  isDraggable: false
                });
              }
            });
          } else {
            return null;
          }
        }
      }, {
        key: "render",
        value: function render() {
          var _this$props = this.props,
              label = _this$props.label,
              apps = _this$props.apps,
              mobile = _this$props.mobile,
              showAllItems = _this$props.showAllItems,
              ignoreApps = _this$props.ignoreApps,
              assistiveText = _this$props.assistiveText,
              mini = _this$props.mini;

          if (ignoreApps && ignoreApps.length) {
            apps = _$5.reject(apps, function (o) {
              return ignoreApps.indexOf(o._id) > -1;
            });
          }

          if (!label) {
            label = assistiveText.label;
          }

          if (!assistiveText.tilesSectionLabel) {
            // tilesSectionLabel必填，所以要避免报错
            assistiveText.tilesSectionLabel = WidgetApps.defaultProps.assistiveText.tilesSectionLabel;
          }

          if (!assistiveText.linksSectionLabel) {
            assistiveText.linksSectionLabel = WidgetApps.defaultProps.assistiveText.linksSectionLabel;
          }

          var appCells = this.getAppCells(apps);
          var appLauncherDesktopInternal;

          if (mobile) {
            appLauncherDesktopInternal = /*#__PURE__*/React__namespace.createElement(AppLauncherDesktopInternal, {
              className: classNames({
                'slds-app-launcher__mini': mini === true
              }, "slds-app-launcher__content slds-app-launcher__mobile")
            }, /*#__PURE__*/React__namespace.createElement(designSystem.AppLauncherExpandableSection, {
              title: assistiveText.tilesSectionLabel
            }, appCells));
          } else {
            appLauncherDesktopInternal = /*#__PURE__*/React__namespace.createElement(AppLauncherDesktopInternal, {
              className: classNames({
                'slds-app-launcher__show-all-items': showAllItems === true,
                'slds-app-launcher__mini': mini === true
              }, "slds-app-launcher__content")
            }, /*#__PURE__*/React__namespace.createElement(designSystem.AppLauncherExpandableSection, {
              title: assistiveText.tilesSectionLabel
            }, appCells));
          }

          return /*#__PURE__*/React__namespace.createElement(designSystem.Card, {
            heading: label
          }, appLauncherDesktopInternal);
        }
      }]);

      return WidgetApps;
    }(React__namespace.Component);

    _defineProperty$2(WidgetApps$1, "defaultProps", {
      mobile: false,
      mini: false,
      showAllItems: false,
      assistiveText: {
        label: "应用",
        tilesSectionLabel: "所有应用",
        linksSectionLabel: "所有对象"
      }
    });

    _defineProperty$2(WidgetApps$1, "propTypes", {
      label: PropTypes.string,
      apps: PropTypes.array,
      mobile: PropTypes.bool,
      mini: PropTypes.bool,
      showAllItems: PropTypes.bool,
      ignoreApps: PropTypes.array,
      onTileClick: PropTypes.func,
      assistiveText: PropTypes.shape({
        label: PropTypes.string,
        tilesSectionLabel: PropTypes.string,
        linksSectionLabel: PropTypes.string
      })
    });

    function mapStateToProps$5() {
        return function (state, ownProps) {
            var apps = visibleAppsSelector(state);
            return Object.assign({}, { apps: apps }, __assign({}, ownProps));
        };
    }
    var mapDispatchToProps$9 = function (dispatch, ownProps) {
        return ({
            init: function (options) {
            }
        });
    };
    var WidgetApps = connect(mapStateToProps$5, mapDispatchToProps$9)(WidgetApps$1);

    var WidgetRemote$1 = /*#__PURE__*/function (_React$Component) {
      _inherits(WidgetRemote, _React$Component);

      var _super = _createSuper(WidgetRemote);

      function WidgetRemote(props) {
        var _this;

        _classCallCheck$1(this, WidgetRemote);

        _this = _super.call(this, props);

        _defineProperty$2(_assertThisInitialized(_this), "state", {
          renderFun: _this.props.renderFun,
          errorMsg: _this.props.string
        });

        var url = _this.props.url;
        _this.remoteComponentFetched = _this.remoteComponentFetched.bind(_assertThisInitialized(_this));
        _this.remoteComponentFetchFaild = _this.remoteComponentFetchFaild.bind(_assertThisInitialized(_this));

        _this.fetchRemoteComponent(url).then(_this.remoteComponentFetched).catch(_this.remoteComponentFetchFaild);

        return _this;
      }

      _createClass$1(WidgetRemote, [{
        key: "componentDidMount",
        value: function componentDidMount() {}
      }, {
        key: "fetchRemoteComponent",
        value: function () {
          var _fetchRemoteComponent = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(url) {
            var response;
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return fetch(url);

                  case 2:
                    response = _context.sent;

                    if (!response.ok) {
                      _context.next = 7;
                      break;
                    }

                    _context.next = 6;
                    return response.text();

                  case 6:
                    return _context.abrupt("return", _context.sent);

                  case 7:
                    throw new Error(response.statusText);

                  case 8:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee);
          }));

          function fetchRemoteComponent(_x) {
            return _fetchRemoteComponent.apply(this, arguments);
          }

          return fetchRemoteComponent;
        }()
      }, {
        key: "remoteComponentFetched",
        value: function remoteComponentFetched(res) {
          this.setState({
            renderFun: eval(res)
          });
        }
      }, {
        key: "remoteComponentFetchFaild",
        value: function remoteComponentFetchFaild(res) {
          this.setState({
            errorMsg: res.message
          });
        }
      }, {
        key: "render",
        value: function render() {
          var _this$state = this.state,
              renderFun = _this$state.renderFun,
              errorMsg = _this$state.errorMsg;

          if (!renderFun) {
            if (errorMsg) {
              return /*#__PURE__*/React__namespace.createElement("div", null, "\u52A0\u8F7D\u8FDC\u7A0B\u7EC4\u4EF6\u5931\u8D25\uFF1A", errorMsg);
            } else {
              return /*#__PURE__*/React__namespace.createElement("div", null, "...");
            }
          }

          return /*#__PURE__*/React__namespace.createElement("div", null, renderFun(React__namespace, this.props, store.getState, states));
        }
      }]);

      return WidgetRemote;
    }(React__namespace.Component);

    _defineProperty$2(WidgetRemote$1, "propTypes", {
      url: PropTypes.string,
      renderFun: PropTypes.func
    });

    _defineProperty$2(WidgetRemote$1, "displayName", 'RemoteWidget');

    function mapStateToProps$4() {
        return function (state, ownProps) {
            return Object.assign({}, __assign({}, ownProps));
        };
    }
    var mapDispatchToProps$8 = function (dispatch, ownProps) {
        return ({
            init: function (options) {
            }
        });
    };
    var WidgetRemote = connect(mapStateToProps$4, mapDispatchToProps$8)(WidgetRemote$1);

    var WidgetConnect = (function (propsProxyFunction) {
      return function (WrappedComponent) {
        return /*#__PURE__*/function (_React$Component) {
          _inherits(_class, _React$Component);

          var _super = _createSuper(_class);

          function _class() {
            _classCallCheck$1(this, _class);

            return _super.apply(this, arguments);
          }

          _createClass$1(_class, [{
            key: "render",
            value: function render() {
              var props = propsProxyFunction(this.props);
              return /*#__PURE__*/React__namespace.createElement(WrappedComponent, props);
            }
          }]);

          return _class;
        }(React__namespace.Component);
      };
    });

    var config = getWidgetReductsConfig();
    var dealColumnsLabelAssistiveText = function (assistiveText, columns) {
        var assistiveTextColumns = assistiveText.columns;
        if (!assistiveTextColumns) {
            return;
        }
        columns.forEach(function (column) {
            var field = column.field;
            var assistiveColumnLabelText = assistiveTextColumns[field];
            if (assistiveColumnLabelText) {
                column.label = assistiveColumnLabelText;
            }
        });
    };
    var WidgetInstancesPendings = WidgetConnect(function (props) {
        var adapted = {};
        if (props.position === "RIGHT") {
            adapted.columns = [{
                    "label": "名称",
                    "field": "name",
                    "href": true
                }];
            adapted.noHeader = true;
        }
        var adaptedConfig = Object.assign({}, config.instances_pendings, adapted);
        var assistiveText = props.assistiveText;
        if (assistiveText) {
            if (assistiveText.label) {
                adaptedConfig.label = assistiveText.label;
            }
            dealColumnsLabelAssistiveText(assistiveText, adaptedConfig.columns);
            if (assistiveText.illustrationMessageBody) {
                if (!adaptedConfig.illustration) {
                    adaptedConfig.illustration = { messageBody: "" };
                }
                adaptedConfig.illustration.messageBody = assistiveText.illustrationMessageBody;
            }
        }
        return Object.assign({}, adaptedConfig, props);
    })(WidgetObject);
    WidgetInstancesPendings.displayName = "WidgetInstancesPendings";
    var WidgetAnnouncementsWeek = WidgetConnect(function (props) {
        var adapted = {};
        if (props.position === "RIGHT") {
            adapted.columns = [{
                    "field": "name",
                    "label": "标题",
                    "href": true
                }];
            adapted.noHeader = true;
        }
        var adaptedConfig = Object.assign({}, config.announcements_week, adapted);
        var assistiveText = props.assistiveText;
        if (assistiveText) {
            if (assistiveText.label) {
                adaptedConfig.label = assistiveText.label;
            }
            dealColumnsLabelAssistiveText(assistiveText, adaptedConfig.columns);
            if (assistiveText.illustrationMessageBody) {
                if (!adaptedConfig.illustration) {
                    adaptedConfig.illustration = { messageBody: "" };
                }
                adaptedConfig.illustration.messageBody = assistiveText.illustrationMessageBody;
            }
        }
        return Object.assign({}, adaptedConfig, props);
    })(WidgetObject);
    WidgetAnnouncementsWeek.displayName = "WidgetAnnouncementsWeek";
    var WidgetTasksToday = WidgetConnect(function (props) {
        var adapted = {};
        if (props.position !== "RIGHT") {
            adapted.columns = [{
                    "field": "name",
                    "label": "主题",
                    "href": true
                }, {
                    "field": "due_date",
                    "label": "到期日期",
                    "width": "10rem",
                    "type": "date"
                }];
            adapted.noHeader = false;
        }
        var adaptedConfig = Object.assign({}, config.tasks_today, adapted);
        var assistiveText = props.assistiveText;
        if (assistiveText) {
            if (assistiveText.label) {
                adaptedConfig.label = assistiveText.label;
            }
            dealColumnsLabelAssistiveText(assistiveText, adaptedConfig.columns);
            if (assistiveText.illustrationMessageBody) {
                if (!adaptedConfig.illustration) {
                    adaptedConfig.illustration = { messageBody: "" };
                }
                adaptedConfig.illustration.messageBody = assistiveText.illustrationMessageBody;
            }
        }
        return Object.assign({}, adaptedConfig, props);
    })(WidgetObject);
    WidgetTasksToday.displayName = "WidgetTasksToday";
    var WidgetEventsToday = WidgetConnect(function (props) {
        var adapted = {};
        if (props.position !== "RIGHT") {
            adapted.columns = [{
                    field: "name",
                    label: "主题",
                    href: true
                }, {
                    "field": "start",
                    "label": "开始时间",
                    "width": "10rem",
                    "type": "datetime"
                }];
            adapted.noHeader = false;
        }
        var adaptedConfig = Object.assign({}, config.events_today, adapted);
        var assistiveText = props.assistiveText;
        if (assistiveText) {
            if (assistiveText.label) {
                adaptedConfig.label = assistiveText.label;
            }
            dealColumnsLabelAssistiveText(assistiveText, adaptedConfig.columns);
            if (assistiveText.illustrationMessageBody) {
                if (!adaptedConfig.illustration) {
                    adaptedConfig.illustration = { messageBody: "" };
                }
                adaptedConfig.illustration.messageBody = assistiveText.illustrationMessageBody;
            }
        }
        return Object.assign({}, adaptedConfig, props);
    })(WidgetObject);
    WidgetEventsToday.displayName = "WidgetEventsToday";

    var _templateObject$a, _templateObject2$1, _templateObject3, _templateObject4, _templateObject5;

    var Container$1 = styled$1.div(_templateObject$a || (_templateObject$a = _taggedTemplateLiteral(["\n    display: flex;\n    flex: 1;\n    flex-wrap: wrap;\n    margin: 1rem;\n    @media (max-width: 767px) {\n        margin: 0rem;\n        margin-bottom: 1rem;\n        .slds-grid{\n            .slds-card{\n                border: none;\n                border-radius: 0;\n            }\n        }\n    }\n    &>.slds-dashboard-column-center{\n        .slds-dashboard-cell-bottom-left{\n            padding-right: 0.5rem;\n            margin-top: 1rem;\n            @media (max-width: 767px) {\n                padding-right: 0;\n            }\n        }\n        .slds-dashboard-cell-bottom-right{\n            padding-left: 0.5rem;\n            margin-top: 1rem;\n            @media (max-width: 767px) {\n                padding-left: 0;\n            }\n        }\n    }\n    &>.slds-dashboard-column-right{\n        margin-left: 1rem;\n        @media (max-width: 767px) {\n            margin-left: 0;\n        }\n    }\n    &>.slds-dashboard-column{\n        @media (max-width: 767px) {\n            &:not(:first-of-type){\n                margin-top: 1rem;\n            }\n        }\n    }\n    .steedos-tabs-container+.slds-card{\n        margin-top: 1rem;\n    }\n    .slds-card+.steedos-tabs-container{\n        margin-top: 1rem;\n    }\n    .steedos-tabs-container+.steedos-tabs-container{\n        margin-top: 1rem;\n    }\n    .steedos-tabs-container{\n        .slds-tabs_default{\n            border: 1px solid #dddbda;\n            border-radius: .25rem;\n        }\n        .slds-tabs_default, .slds-tabs_scoped{\n            box-shadow: 0 2px 2px 0 rgba(0,0,0,.1);\n            &>.slds-tabs_default__content, &>.slds-tabs_scoped__content{\n                &>.slds-card{\n                    border: none;\n                    box-shadow: none;\n                    margin: -1rem;\n                    &>.slds-card__header{\n                        display: none;\n                    }\n                }\n            }\n        }\n        .slds-tabs_default{\n            &>.slds-tabs_default__content{\n                &>.slds-card{\n                    margin: -1rem 0;\n                }\n            }\n        }\n        .slds-vertical-tabs{\n            &.slds-tabs_default{\n                overflow: unset;\n                box-shadow: unset;\n                border: none;\n                .slds-tabs_default__nav, .slds-tabs_default__content{\n                    box-shadow: 0 2px 2px 0 rgba(0,0,0,.1);\n                }\n                &>.slds-tabs_default__content{\n                    &>.slds-card{\n                        margin: -1rem;\n                    }\n                }\n            }\n            &.slds-tabs_scoped{\n                box-shadow: 0 2px 2px 0 rgba(0,0,0,.1);\n            }\n            &.slds-tabs_default, &.slds-tabs_scoped{\n                &>.slds-tabs_default__content, &>.slds-tabs_scoped__content{\n                    &>.slds-card{\n                        &>.slds-card__header{\n                            display: flex;\n                        }\n                    }\n                }\n            }\n        }\n    }\n"])));
    var Column = styled$1.div(_templateObject2$1 || (_templateObject2$1 = _taggedTemplateLiteral(["\n    display: flex;\n    flex: 1;\n    flex-wrap: wrap;\n    align-content: flex-start;\n    &:nth-child(2){\n        flex: 0 0 33%;\n        @media (max-width: 767px) {\n            flex: 0 0 100%;\n        }\n    }\n"])));
    var Cell = styled$1.div(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n    flex: 0 0 100%;\n    align-content: flex-start;\n    &.flex-split{\n        flex: 1;\n        @media (max-width: 767px) {\n            flex: 0 0 100%;\n        }\n    }\n    .slds-card__body{\n        min-height: 7.6rem;\n        .slds-illustration.slds-illustration_small{\n            .slds-illustration__svg{\n                height: 8rem;\n                margin-bottom: 0.4rem;\n                margin: -0.8rem 0;\n            }\n            .slds-text-longform{\n                p{\n                    margin-bottom: 0;\n                }\n            }\n        }\n    }\n    .slds-card__footer{\n        margin-top: 0px;\n    }\n"])));

    var Dashboard = /*#__PURE__*/function (_React$Component) {
      _inherits(Dashboard, _React$Component);

      var _super = _createSuper(Dashboard);

      function Dashboard(props) {
        var _this;

        _classCallCheck$1(this, Dashboard);

        _this = _super.call(this, props);

        _defineProperty$2(_assertThisInitialized(_this), "state", {
          leftSection: _this.props.leftSection,
          centerTopSection: _this.props.centerTopSection,
          centerBottomLeftSection: _this.props.centerBottomLeftSection,
          centerBottomRightSection: _this.props.centerBottomRightSection,
          rightSection: _this.props.rightSection
        });

        return _this;
      }

      _createClass$1(Dashboard, [{
        key: "componentDidMount",
        value: function componentDidMount() {
          var init = this.props.init;

          if (init) {
            init(this.props);
          }
        }
      }, {
        key: "convertConfigItemToSection",
        value: function convertConfigItemToSection(value, key) {
          switch (value.type) {
            case "apps":
              if (value.position === "RIGHT") {
                value.mobile = true;
              }

              var Creator = window.Creator;
              var currentApp = Creator && Creator.getApp();

              if (currentApp && currentApp._id) {
                if (!value.ignoreApps) {
                  value.ignoreApps = [];
                }

                value.ignoreApps.push(currentApp._id);
              }

              return /*#__PURE__*/React__namespace.createElement(WidgetApps, _extends$1({
                key: key
              }, value));

            case "object":
              return /*#__PURE__*/React__namespace.createElement(WidgetObject, _extends$1({
                key: key
              }, value));

            case "react":
              if (typeof value.component === "function") {
                return /*#__PURE__*/React__namespace.createElement(React__namespace.Fragment, {
                  key: key
                }, value.component(value));
              } else if (typeof value.component === "string" && value.component.length) {
                return /*#__PURE__*/React__namespace.createElement(WidgetRemote, {
                  key: key,
                  label: value.label,
                  url: value.component,
                  assistiveText: value.assistiveText
                });
              }

            case "html":
              if (!(typeof value.html === "string" && value.html.length)) {
                value.html = "";
              }

              var markup = {
                __html: value.html
              };
              var NoLabelWrapDiv = styled$1.article(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n                    position: relative;\n                    padding: 0;\n                    background: #fff;\n                    border: 1px solid #dddbda;\n                    border-radius: .25rem;\n                    background-clip: padding-box;\n                    -webkit-box-shadow: 0 2px 2px 0 rgba(0,0,0,.1);\n                    box-shadow: 0 2px 2px 0 rgba(0,0,0,.1);\n                    .slds-card__body{\n                        padding: 0 1rem;\n                        min-height: auto;\n                    }\n                "])));
              var LabelWrapDiv = styled$1.article(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n                    .slds-card__body{\n                        padding: 0 1rem;\n                        min-height: auto;\n                    }\n                "])));
              return /*#__PURE__*/React__namespace.createElement(React__namespace.Fragment, {
                key: key
              }, value.label ? /*#__PURE__*/React__namespace.createElement(LabelWrapDiv, {
                className: "slds-card"
              }, /*#__PURE__*/React__namespace.createElement("div", {
                className: "slds-card__header slds-grid"
              }, /*#__PURE__*/React__namespace.createElement("div", {
                className: "slds-media slds-media_center slds-has-flexi-truncate"
              }, /*#__PURE__*/React__namespace.createElement("div", {
                className: "slds-media__body"
              }, /*#__PURE__*/React__namespace.createElement("h2", {
                className: "slds-text-heading_small slds-truncate",
                title: "{value.label}"
              }, value.label))), /*#__PURE__*/React__namespace.createElement("div", {
                className: "slds-no-flex"
              })), /*#__PURE__*/React__namespace.createElement("div", {
                className: "slds-card__body",
                dangerouslySetInnerHTML: markup
              })) : /*#__PURE__*/React__namespace.createElement(NoLabelWrapDiv, {
                className: "slds-card",
                dangerouslySetInnerHTML: markup
              }));

            case "instances_pendings":
              return /*#__PURE__*/React__namespace.createElement(WidgetInstancesPendings, _extends$1({
                key: key
              }, value));

            case "announcements_week":
              return /*#__PURE__*/React__namespace.createElement(WidgetAnnouncementsWeek, _extends$1({
                key: key
              }, value));

            case "tasks_today":
              return /*#__PURE__*/React__namespace.createElement(WidgetTasksToday, _extends$1({
                key: key
              }, value));

            case "events_today":
              return /*#__PURE__*/React__namespace.createElement(WidgetEventsToday, _extends$1({
                key: key
              }, value));
            // case "tabs":
            //     return value.panels ? (<Tabs key={key} {...value}>
            //         {
            //             value.panels.map((panel, index) => {
            //                 // panel.assistiveText一般为空，继承相关类型的assistiveText即可，不过panel本身定义的assistiveText优先
            //                 panel.assistiveText = Object.assign({}, value.assistiveText && value.assistiveText[panel.type], panel.assistiveText);
            //                 let panelLabel = panel.label;
            //                 if(!panelLabel){
            //                     panelLabel = panel.assistiveText.label;
            //                 }
            //                 return <TabsPanel key={`${key}_panel_${index}`} label={panelLabel}>
            //                     {this.convertConfigItemToSection(panel, `${key}_panel_content_${index}`)}
            //                 </TabsPanel>
            //             })
            //         }
            //     </Tabs>) : null
          }
        }
      }, {
        key: "convertConfigToSection",
        value: function convertConfigToSection(config, assistiveText) {
          var _this2 = this;

          var result = {},
              section;
          var widgetsAssistiveText = assistiveText && assistiveText.widgets;

          _$5.each(config, function (value, key) {
            if (widgetsAssistiveText) {
              // widget本身的assistiveText配置优先于传入的dashboard中的assistiveText中相关widget类型的assistiveText配置
              if (["instances_pendings", "announcements_week", "tasks_today", "events_today"].indexOf(value.type) > -1) {
                // object简化的类型，应该继承object类型的assistiveText配置
                value.assistiveText = _$5.extend({}, widgetsAssistiveText["object"], widgetsAssistiveText[value.type], value.assistiveText);
              } else if (value.type === "tabs") {
                // tabs类型，应该把所有类型的assistiveText配置都传入备用，格式为{`${widgettype}`:`${assistiveTextContent}`}，示例：{events_today: {label: "Events today", columns...},tasks_today:{label: "Tasks today", columns...}}
                value.assistiveText = _$5.extend({}, widgetsAssistiveText, value.assistiveText);
              } else {
                value.assistiveText = _$5.extend({}, widgetsAssistiveText[value.type], value.assistiveText);
              }
            }

            switch (value.position) {
              case "LEFT":
                section = _this2.convertConfigItemToSection(value, key);

                if (section) {
                  if (!result.leftSection) {
                    result.leftSection = [];
                  }

                  result.leftSection.push(section);
                }

                break;

              case "CENTER_TOP":
                section = _this2.convertConfigItemToSection(value, key);

                if (section) {
                  if (!result.centerTopSection) {
                    result.centerTopSection = [];
                  }

                  result.centerTopSection.push(section);
                }

                break;

              case "CENTER_BOTTOM_LEFT":
                section = _this2.convertConfigItemToSection(value, key);

                if (section) {
                  if (!result.centerBottomLeftSection) {
                    result.centerBottomLeftSection = [];
                  }

                  result.centerBottomLeftSection.push(section);
                }

                break;

              case "CENTER_BOTTOM_RIGHT":
                section = _this2.convertConfigItemToSection(value, key);

                if (section) {
                  if (!result.centerBottomRightSection) {
                    result.centerBottomRightSection = [];
                  }

                  result.centerBottomRightSection.push(section);
                }

                break;

              case "RIGHT":
                section = _this2.convertConfigItemToSection(value, key);

                if (section) {
                  if (!result.rightSection) {
                    result.rightSection = [];
                  }

                  result.rightSection.push(section);
                }

                break;
            }
          });

          return result;
        }
      }, {
        key: "render",
        value: function render() {
          var _this$props = this.props,
              config = _this$props.config,
              assistiveText = _this$props.assistiveText;
          var configSection = {};

          if (config) {
            configSection = this.convertConfigToSection(config, assistiveText);
          }

          var _this$state$configSec = _objectSpread2$1(_objectSpread2$1({}, this.state), configSection);
              _this$state$configSec.leftSection;
              var centerTopSection = _this$state$configSec.centerTopSection,
              centerBottomLeftSection = _this$state$configSec.centerBottomLeftSection,
              centerBottomRightSection = _this$state$configSec.centerBottomRightSection,
              rightSection = _this$state$configSec.rightSection;

          return /*#__PURE__*/React__namespace.createElement(Container$1, {
            className: "slds-dashboard"
          }, /*#__PURE__*/React__namespace.createElement(Column, {
            className: "slds-dashboard-column slds-dashboard-column-center"
          }, centerTopSection ? /*#__PURE__*/React__namespace.createElement(Cell, {
            className: "slds-dashboard-cell slds-dashboard-cell-center-top"
          }, /*#__PURE__*/React__namespace.createElement("div", {
            className: "slds-grid slds-grid_vertical"
          }, centerTopSection)) : null, centerBottomLeftSection ? /*#__PURE__*/React__namespace.createElement(Cell, {
            className: "slds-dashboard-cell flex-split slds-dashboard-cell-bottom-left"
          }, /*#__PURE__*/React__namespace.createElement("div", {
            className: "slds-grid slds-grid_vertical"
          }, centerBottomLeftSection)) : null, centerBottomRightSection ? /*#__PURE__*/React__namespace.createElement(Cell, {
            className: "slds-dashboard-cell flex-split slds-dashboard-cell-bottom-right"
          }, /*#__PURE__*/React__namespace.createElement("div", {
            className: "slds-grid slds-grid_vertical"
          }, centerBottomRightSection)) : null), /*#__PURE__*/React__namespace.createElement(Column, {
            className: "slds-dashboard-column slds-dashboard-column-right"
          }, rightSection ? /*#__PURE__*/React__namespace.createElement(Cell, {
            className: "slds-dashboard-cell"
          }, /*#__PURE__*/React__namespace.createElement("div", {
            className: "slds-grid slds-grid_vertical"
          }, rightSection)) : null));
        }
      }]);

      return Dashboard;
    }(React__namespace.Component);

    _defineProperty$2(Dashboard, "defaultProps", {
      leftSection: null,
      centerTopSection: /*#__PURE__*/React__namespace.createElement(WidgetApps, null),
      centerBottomLeftSection: null,
      centerBottomRightSection: null,
      rightSection: null
    });

    _defineProperty$2(Dashboard, "propTypes", {
      config: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
      leftSection: PropTypes.node,
      centerTopSection: PropTypes.node,
      centerBottomLeftSection: PropTypes.node,
      centerBottomRightSection: PropTypes.node,
      rightSection: PropTypes.node,
      assistiveText: PropTypes.shape({
        widgets: PropTypes.object
      })
    });

    _defineProperty$2(Dashboard, "displayName", 'Dashboard');

    function mapStateToProps$3() {
        return function (state, ownProps) {
            return Object.assign({}, __assign({}, ownProps));
        };
    }
    var mapDispatchToProps$7 = function (dispatch, ownProps) {
        return ({
            init: function (options) {
            }
        });
    };
    var index$7 = connect(mapStateToProps$3, mapDispatchToProps$7)(Dashboard);

    var _templateObject$9;
    var DISPLAY_NAME$1 = 'ListItemContent';
    var propTypes$1 = {
      /**
       * **Item to be displayed**
       * * `label`: The main label displayed on the top left.
       * * `topRightText`: The text displayed on the top right.
       * * `bottomLeftText`: The text displayed on the bottom left.
       * * `bottomRightText`: The text displayed on the bottom right.
       */
      item: PropTypes.shape({
        label: PropTypes.string,
        topRightText: PropTypes.string,
        bottomLeftText: PropTypes.string,
        bottomRightText: PropTypes.string,
        content: PropTypes.object,
        rows: PropTypes.arrayOf(PropTypes.shape({
          label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
          topRightText: PropTypes.oneOfType([PropTypes.string, PropTypes.node])
        })),
        rowIcon: PropTypes.shape({
          width: PropTypes.string,
          category: PropTypes.string,
          name: PropTypes.string,
          size: PropTypes.string
        })
      })
    };
    var defaultProps$2 = {};
    var ListItemContainer = styled$1.div(_templateObject$9 || (_templateObject$9 = _taggedTemplateLiteral(["\n\tdisplay: flex;\n\talign-items: center;\n\t.slds-text-heading_small{\n\t\tflex: 1;\n\t\twidth: 100%;\n\t\t&>.slds-grid{\n\t\t\t.list-item-left-label{\n\t\t\t\tflex: 1;\n\t\t\t}\n\t\t\t.list-item-right-text{\n\t\t\t\tmargin-left: 1rem;\n\t\t\t\tmax-width: 50%;\n\t\t\t}\n\t\t}\n\t}\n"])));

    var ListItemContent = function ListItemContent(_ref) {
      var item = _ref.item;
      return /*#__PURE__*/React__default["default"].createElement(ListItemContainer, {
        key: item.key
      }, item.rowIcon ? /*#__PURE__*/React__default["default"].createElement("span", {
        className: "list-item-left-icon"
      }, /*#__PURE__*/React__default["default"].createElement(designSystem.Icon, {
        category: item.rowIcon.category ? item.rowIcon.category : "standard",
        name: item.rowIcon.name,
        size: item.rowIcon.size
      })) : null, /*#__PURE__*/React__default["default"].createElement("span", {
        className: classNames('slds-text-heading_small', item.rowIcon ? 'slds-m-left_medium' : null)
      }, item.rows ? item.rows.map(function (itemOption, index) {
        return /*#__PURE__*/React__default["default"].createElement("div", {
          className: "slds-grid slds-wrap",
          key: itemOption.key
        }, /*#__PURE__*/React__default["default"].createElement("span", {
          className: classNames('slds-truncate list-item-left-label', index === 0 ? 'slds-text-body_regular slds-text-color_default' : null),
          title: typeof itemOption.label.props.children === "string" ? itemOption.label.props.children : null
        }, itemOption.label), itemOption.topRightText ? /*#__PURE__*/React__default["default"].createElement("span", {
          className: "slds-truncate slds-col_bump-left list-item-right-text",
          title: typeof itemOption.topRightText.props.children === "string" ? itemOption.topRightText.props.children : null
        }, itemOption.topRightText) : null);
      }) : /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement("div", {
        className: "slds-grid slds-wrap"
      }, /*#__PURE__*/React__default["default"].createElement("span", {
        className: "slds-truncate slds-text-body_regular slds-text-color_default",
        title: item.label
      }, item.label), /*#__PURE__*/React__default["default"].createElement("span", {
        className: "slds-truncate slds-col_bump-left",
        title: item.topRightText
      }, item.topRightText)), /*#__PURE__*/React__default["default"].createElement("div", {
        className: "slds-grid slds-wrap"
      }, /*#__PURE__*/React__default["default"].createElement("span", {
        className: "slds-truncate",
        title: item.bottomLeftText
      }, item.bottomLeftText), /*#__PURE__*/React__default["default"].createElement("span", {
        className: "slds-truncate slds-col_bump-left",
        title: item.bottomLeftText
      }, item.bottomRightText)))));
    };

    ListItemContent.displayName = DISPLAY_NAME$1;
    ListItemContent.propTypes = propTypes$1;
    ListItemContent.defaultProps = defaultProps$2;

    var DISPLAY_NAME = 'ListItemWithContent';
    var propsTypes = {
      /**
       * **Assistive text for accessibility**
       * * `unreadItem`: The unread indicator.
       */
      assistiveText: PropTypes.shape({
        unreadItem: PropTypes.string
      }),

      /**
       * Item to be displayed
       */
      item: PropTypes.object.isRequired,

      /**
       * Allows multiple item to be selection
       */
      multiple: PropTypes.bool,

      /**
       * Shows the item as `focused`.
       */
      isFocused: PropTypes.bool.isRequired,

      /**
       * Shows the item as `selected`.
       */
      isSelected: PropTypes.bool.isRequired,

      /**
       * Shows the item as `unread`.
       */
      isUnread: PropTypes.bool,

      /**
       * **Event Callbacks**
       * * `onClick`: Called when the item is clicked.
       * * * Event
       * * * Meta data
       * * * * `item`: The original item.
       * * * * `isSelected`: Is the item selected.
       * * * * `isUnread`: Is the item unread.
       */
      events: PropTypes.shape({
        onClick: PropTypes.func.isRequired
      }),

      /**
       * Reference to the list item component
       */
      listItemRef: PropTypes.func,

      /**
       * The list item href generate function
       */
      listItemHref: PropTypes.func
    };
    var defaultProps$1 = {
      assistiveText: {
        unreadItem: 'Unread Item'
      },
      events: {}
    };
    /**
     * HOC that wraps the list item content with selection and unread functionality.
     * @param ListItemContent {node} A React component
     * @returns {ListItemWithContent} A React component
     */

    var listItemWithContent = function listItemWithContent(ListItemContent) {
      var ListItemWithContent = /*#__PURE__*/function (_React$Component) {
        _inherits(ListItemWithContent, _React$Component);

        var _super = _createSuper(ListItemWithContent);

        function ListItemWithContent() {
          _classCallCheck$1(this, ListItemWithContent);

          return _super.apply(this, arguments);
        }

        _createClass$1(ListItemWithContent, [{
          key: "onClick",
          value: function onClick(event) {
            this.props.events.onClick(event, {
              item: this.props.item,
              isSelected: this.props.isSelected,
              isUnread: this.props.isUnread
            });
          }
        }, {
          key: "unread",
          value: function unread() {
            return this.props.isUnread ? /*#__PURE__*/React__default["default"].createElement("abbr", {
              className: "slds-indicator_unread",
              title: this.props.assistiveText.unreadItem,
              "aria-label": this.props.assistiveText.unreadItem
            }, /*#__PURE__*/React__default["default"].createElement("span", {
              className: "slds-assistive-text"
            }, '●')) : null;
          }
        }, {
          key: "render",
          value: function render() {
            var _this = this;

            return /*#__PURE__*/React__default["default"].createElement("li", {
              className: classNames('slds-split-view__list-item', {
                'slds-is-unread': this.props.isUnread
              }),
              role: "presentation"
            }, /*#__PURE__*/React__default["default"].createElement("a", {
              className: "slds-split-view__list-item-action slds-grow slds-has-flexi-truncate",
              role: "option",
              ref: this.props.listItemRef,
              "aria-selected": this.props.multiple ? !!this.props.isSelected : this.props.isSelected,
              tabIndex: this.props.isFocused ? 0 : -1,
              href: this.props.listItemHref ? this.props.listItemHref(this.props.item) : "javascript:void(0);" // eslint-disable-line no-script-url
              ,
              onClick: function onClick(e) {
                return _this.onClick(e);
              }
            }, this.unread(), /*#__PURE__*/React__default["default"].createElement(ListItemContent, this.props)));
          }
        }]);

        return ListItemWithContent;
      }(React__default["default"].Component);

      _defineProperty$2(ListItemWithContent, "displayName", "".concat(DISPLAY_NAME, "(").concat(ListItemContent.displayName || ListItemContent.name || 'Component', ")"));

      _defineProperty$2(ListItemWithContent, "propTypes", propsTypes);

      _defineProperty$2(ListItemWithContent, "defaultProps", defaultProps$1);

      return ListItemWithContent;
    };

    var SORT_OPTIONS = Object.freeze({
      UP: 'up',
      DOWN: 'down'
    });
    var propTypes = {
      /**
       * **Assistive text for accessibility**
       * * `list`: aria label for the list
       * * `sort`
       *    * `sortedBy`: Clickable sort header for the list.
       *    * `descending`: Descending sorting.
       *    * `ascending`: Ascending sorting.
       */
      assistiveText: PropTypes.shape({
        list: PropTypes.string,
        sort: PropTypes.shape({
          sortedBy: PropTypes.string,
          descending: PropTypes.string,
          ascending: PropTypes.string
        }),
        unreadItem: PropTypes.string
      }),

      /**
       * CSS classes to be added to the parent `div` tag.
       */
      className: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.string]),

      /**
       * Event Callbacks
       * * `onSelect`: Called when a list item is selected. Previously, this event was called when an item was focused. The UX pattern has changed and this event is now called on pressing enter or mouse click.
       *    * event {object} List item click event
       *    * Meta {object}
       *       * selectedItems {array} List of selected items.
       *       * item {object} Last selected item.
       * * `onSort`: Called when the list is sorted.
       *    * event {object} Sort click event
       */
      events: PropTypes.shape({
        onSelect: PropTypes.func.isRequired,
        onSort: PropTypes.func
      }),

      /**
       * HTML id for component.
       */
      id: PropTypes.string,

      /**
       * **Text labels for internationalization**
       * * `header`: This is the header of the list.
       */
      labels: PropTypes.shape({
        header: PropTypes.string
      }),

      /**
       * The direction of the sort arrow. Option are:
       * * SORT_OPTIONS.UP: `up`
       * * SORT_OPTIONS.DOWN: `down`
       */
      sortDirection: PropTypes.oneOf([SORT_OPTIONS.UP, SORT_OPTIONS.DOWN]),

      /**
       * Allows multiple item to be selection
       */
      multiple: PropTypes.bool,

      /**
       * The list of items.
       * It is recommended that you have a unique `id` for each item.
       */
      options: PropTypes.array.isRequired,

      /**
       * Accepts an array of item objects. For single selection, pass in an array of one object.
       */
      selection: PropTypes.array,

      /**
       * Accepts an array of item objects. For single unread, pass in an array of one object.
       */
      unread: PropTypes.array,

      /**
       * Custom list item template for the list item content. The select and unread functionality wraps the custom list item.
       * This should be a React component that accepts props.
       */
      listItem: PropTypes.func,

      /**
       * The list item href generate function
       */
      listItemHref: PropTypes.func
    };
    var defaultProps = {
      assistiveText: {
        list: 'Select an item to open it in a new workspace tab.',
        sort: {
          sortedBy: 'Sorted by',
          descending: 'Descending',
          ascending: 'Ascending'
        }
      },
      events: {},
      labels: {},
      selection: [],
      unread: []
    };
    /**
     * The menu with the ARIA role of a listbox.
     */

    var Listbox = /*#__PURE__*/function (_React$Component) {
      _inherits(Listbox, _React$Component);

      var _super = _createSuper(Listbox);

      function Listbox(props) {
        var _this;

        _classCallCheck$1(this, Listbox);

        _this = _super.call(this, props);
        _this.listItemComponents = {};
        _this.state = {
          currentSelectedItem: null,
          currentFocusedListItem: {
            index: 0,
            item: null
          }
        }; // Generates the list item template

        _this.ListItemWithContent = listItemWithContent(props.listItem || ListItemContent);
        return _this;
      }

      _createClass$1(Listbox, [{
        key: "componentDidMount",
        value: function componentDidMount() {
          this.focusFirstItem();
        }
      }, {
        key: "isListItemFocused",
        value: function isListItemFocused(item) {
          return this.state.currentFocusedListItem.item === item;
        }
      }, {
        key: "isSelected",
        value: function isSelected(item) {
          return this.props.selection.includes(item);
        }
      }, {
        key: "isUnread",
        value: function isUnread(item) {
          return this.props.unread.includes(item);
        }
      }, {
        key: "handleKeyDown",
        value: function handleKeyDown(event) {// if (this.props.multiple && event.key === 'a' && event.ctrlKey) {
          // 	// select / deselect all
          // 	eventUtil.trap(event);
          // 	if (this.props.options === this.props.selection) {
          // 		this.deselectAllListItems(event);
          // 	} else {
          // 		this.selectAllListItems(event);
          // 	}
          // } else if (event.key === 'ArrowUp') {
          // 	eventUtil.trap(event);
          // 	this.moveToPreviousItem(event);
          // } else if (event.key === 'ArrowDown') {
          // 	eventUtil.trap(event);
          // 	this.moveToNextItem(event);
          // }
        }
      }, {
        key: "moveToNextItem",
        value: function moveToNextItem(event) {
          var nextFocusIndex = this.state.currentFocusedListItem.index === this.props.options.length - 1 ? 0 : this.state.currentFocusedListItem.index + 1;
          this.moveToIndex(event, nextFocusIndex);
        }
      }, {
        key: "moveToPreviousItem",
        value: function moveToPreviousItem(event) {
          var previousFocusIndex = this.state.currentFocusedListItem.index === 0 ? this.props.options.length - 1 : this.state.currentFocusedListItem.index - 1;
          this.moveToIndex(event, previousFocusIndex);
        }
      }, {
        key: "moveToIndex",
        value: function moveToIndex(event, index) {
          var item = this.props.options[index];
          this.focusItem(item);
        }
      }, {
        key: "focusFirstItem",
        value: function focusFirstItem() {
          var _this2 = this;

          var firstSelectedItem = this.props.options.find(function (item) {
            return _this2.props.selection.includes(item);
          }) || this.props.options[0];

          if (firstSelectedItem) {
            this.focusItem(firstSelectedItem, true);
          }
        }
      }, {
        key: "focusItem",
        value: function focusItem(item, setDataOnly) {
          var index = this.props.options.indexOf(item);

          if (!setDataOnly) {
            this.listItemComponents[index].focus();
          }

          this.setState({
            currentFocusedListItem: {
              index: index,
              item: item
            }
          });
        }
      }, {
        key: "deselectAllListItems",
        value: function deselectAllListItems(event) {
          this.setState({
            currentSelectedItem: null
          });
          this.props.events.onSelect(event, {
            selectedItems: [],
            item: null
          });
        }
      }, {
        key: "selectAllListItems",
        value: function selectAllListItems(event) {
          this.props.events.onSelect(event, {
            selectedItems: this.props.options,
            item: this.state.currentSelectedItem
          });
        }
      }, {
        key: "selectListItem",
        value: function selectListItem(item, event) {
          var selectedItems = [item];

          if (this.props.multiple) {
            if (event.metaKey) {
              selectedItems = this.props.selection.includes(item) ? this.props.selection.filter(function (i) {
                return i !== item;
              }) : [item].concat(_toConsumableArray(this.props.selection));
            } else if (event.shiftKey) {
              var _sort = [this.props.options.indexOf(this.state.currentSelectedItem), this.props.options.indexOf(item)].sort(),
                  _sort2 = _slicedToArray(_sort, 2),
                  begin = _sort2[0],
                  end = _sort2[1];

              var addToSelection = this.props.options.slice(begin, end + 1);
              selectedItems = [].concat(_toConsumableArray(addToSelection), _toConsumableArray(this.props.selection.filter(function (i) {
                return !addToSelection.includes(i);
              })));
            }
          }

          this.setState({
            currentSelectedItem: item
          });
          this.props.events.onSelect(event, {
            selectedItems: selectedItems,
            item: item
          });
        }
      }, {
        key: "handleOnSelect",
        value: function handleOnSelect(event, _ref) {
          var item = _ref.item;
          this.selectListItem(item, event);
          this.focusItem(item);
        }
      }, {
        key: "sortDirection",
        value: function sortDirection() {
          return this.props.sortDirection ? /*#__PURE__*/React__default["default"].createElement(designSystem.Icon, {
            category: "utility",
            name: this.props.sortDirection === SORT_OPTIONS.DOWN ? 'arrowdown' : 'arrowup',
            size: "xx-small",
            className: "slds-align-top"
          }) : null;
        }
      }, {
        key: "headerWrapper",
        value: function headerWrapper(children) {
          return this.props.events.onSort ? /*#__PURE__*/React__default["default"].createElement("a", {
            "aria-live": "polite",
            style: {
              borderTop: '0'
            },
            href: "javascript:void(0);" // eslint-disable-line no-script-url
            ,
            role: "button",
            className: "slds-split-view__list-header slds-grid slds-text-link_reset",
            onClick: this.props.events.onSort
          }, children) : /*#__PURE__*/React__default["default"].createElement("div", {
            style: {
              borderTop: '0'
            },
            className: "slds-split-view__list-header slds-grid"
          }, children);
        }
      }, {
        key: "header",
        value: function header() {
          return this.props.labels.header ? this.headerWrapper( /*#__PURE__*/React__default["default"].createElement("span", {
            "aria-sort": this.props.sortDirection === SORT_OPTIONS.DOWN ? this.props.assistiveText.sort.descending : this.props.assistiveText.sort.ascending
          }, /*#__PURE__*/React__default["default"].createElement("span", {
            className: "slds-assistive-text"
          }, this.props.assistiveText.sort.sortedBy, ': '), /*#__PURE__*/React__default["default"].createElement("span", null, this.props.labels.header, this.sortDirection()), /*#__PURE__*/React__default["default"].createElement("span", {
            className: "slds-assistive-text"
          }, '- ', this.props.sortDirection === SORT_OPTIONS.DOWN ? this.props.assistiveText.sort.descending : this.props.assistiveText.sort.ascending))) : null;
        }
      }, {
        key: "addListItemComponent",
        value: function addListItemComponent(component, index) {
          this.listItemComponents[index] = component;
        }
      }, {
        key: "listItems",
        value: function listItems() {
          var _this3 = this;

          var ListItemWithContent = this.ListItemWithContent;
          return this.props.options.map(function (item, index) {
            return /*#__PURE__*/React__default["default"].createElement(ListItemWithContent, {
              key: item.id || index,
              assistiveText: {
                unreadItem: _this3.props.assistiveText.unreadItem
              },
              listItemRef: function listItemRef(component) {
                _this3.addListItemComponent(component, index);
              },
              item: item,
              listItemHref: _this3.props.listItemHref,
              isFocused: _this3.isListItemFocused(item),
              isSelected: _this3.isSelected(item),
              isUnread: _this3.isUnread(item),
              events: {
                onClick: function onClick(event, meta) {
                  return _this3.handleOnSelect(event, meta);
                }
              },
              multiple: _this3.props.multiple
            });
          });
        }
      }, {
        key: "render",
        value: function render() {
          var _this4 = this;

          return /*#__PURE__*/React__default["default"].createElement("div", {
            id: this.props.id,
            className: classNames('slds-grid slds-grid_vertical slds-scrollable_none', this.props.className)
          }, this.header(), /*#__PURE__*/React__default["default"].createElement("ul", {
            className: "slds-scrollable_y",
            "aria-label": this.props.assistiveText.list,
            "aria-multiselectable": this.props.multiple,
            role: "listbox",
            onKeyDown: function onKeyDown(event) {
              return _this4.handleKeyDown(event);
            }
          }, this.listItems()));
        }
      }]);

      return Listbox;
    }(React__default["default"].Component);

    _defineProperty$2(Listbox, "displayName", "LISTBOX");

    _defineProperty$2(Listbox, "propTypes", propTypes);

    _defineProperty$2(Listbox, "defaultProps", defaultProps);

    var _templateObject$8, _templateObject2;
    var STATS = {
      init: '',
      pulling: 'pulling',
      enough: 'pulling enough',
      refreshing: 'refreshing',
      refreshed: 'refreshed',
      reset: 'reset',
      loading: 'loading' // loading more

    }; // 拖拽的缓动公式 - easeOutSine

    function easing(distance) {
      // t: current time, b: begInnIng value, c: change In value, d: duration
      var t = distance;
      var b = 0;
      var d = window.screen.availHeight; // 允许拖拽的最大距离

      var c = d / 2.5; // 提示标签最大有效拖拽距离

      return c * Math.sin(t / d * (Math.PI / 2)) + b;
    }

    var PullableContainer = styled$1.div(_templateObject$8 || (_templateObject$8 = _taggedTemplateLiteral(["\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  height: 100%;\n  overflow: hidden;\n  display: flex;\n  flex-direction: column;\n\n  // .pullable-msg:after {\n  //   content: \"\u4E0B\u62C9\u5237\u65B0\";\n  // }\n  // .state-pulling.enough .pullable-msg:after {\n  //   content: \"\u677E\u5F00\u5237\u65B0\";\n  // }\n  // .state-refreshed .pullable-msg:after {\n  //   content: \"\u5237\u65B0\u6210\u529F\";\n  // }\n  // .pullable-loading:after {\n  //   content: \"\u6B63\u5728\u52A0\u8F7D...\";\n  // }\n  // .pullable-symbol .pullable-loading:after {\n  //   content: \"\u6B63\u5728\u5237\u65B0...\";\n  // }\n  .pullable-btn:after {\n    // content: \"\u70B9\u51FB\u52A0\u8F7D\u66F4\u591A\";\n    content: \"\u25BC\";\n    color: #006dcc;\n    cursor: pointer;\n  }\n  .pullable {\n    position: relative;\n    font-size: 14px;\n    background: #fff;\n  }\n  .state-pulling {\n    overflow-y: hidden !important;\n  }\n  .pullable-symbol {\n    position: absolute;\n    top: 0;\n    left: 0;\n    right: 0;\n    color: #7676a1;\n    text-align: center;\n    height: 48px;\n    overflow: hidden;\n  }\n  .state- .pullable-symbol,\n  .state-reset .pullable-symbol {\n    height: 0;\n  }\n  .state-reset .pullable-symbol {\n    transition: height 0s 0.2s;\n  }\n  .state-loading .pullable-symbol {\n    display: none;\n  }\n  .pullable-msg {\n    line-height: 48px;\n  }\n  .state-pulling .pullable-msg i,\n  .state-reset .pullable-msg i {\n    display: inline-block;\n    font-size: 2em;\n    margin-right: 0.6em;\n    vertical-align: middle;\n    height: 1em;\n    border-left: 1px solid;\n    position: relative;\n    transition: transform 0.3s ease;\n  }\n  .state-pulling .pullable-msg i:before,\n  .state-reset .pullable-msg i:before,\n  .state-pulling .pullable-msg i:after,\n  .state-reset .pullable-msg i:after {\n    content: \"\";\n    position: absolute;\n    font-size: 0.5em;\n    width: 1em;\n    bottom: 0px;\n    border-top: 1px solid;\n  }\n  .state-pulling .pullable-msg i:before,\n  .state-reset .pullable-msg i:before {\n    right: 1px;\n    transform: rotate(50deg);\n    transform-origin: right;\n  }\n  .state-pulling .pullable-msg i:after,\n  .state-reset .pullable-msg i:after {\n    left: 0px;\n    transform: rotate(-50deg);\n    transform-origin: left;\n  }\n  .state-pulling.enough .pullable-msg i {\n    transform: rotate(180deg);\n  }\n  .state-refreshing .pullable-msg {\n    height: 0;\n    opacity: 0;\n  }\n  .state-refreshed .pullable-msg {\n    opacity: 1;\n    transition: opacity 1s;\n  }\n  .state-refreshed .pullable-msg i {\n    display: inline-block;\n    box-sizing: content-box;\n    vertical-align: middle;\n    margin-right: 10px;\n    font-size: 20px;\n    height: 1em;\n    width: 1em;\n    border: 1px solid;\n    border-radius: 100%;\n    position: relative;\n  }\n  .state-refreshed .pullable-msg i:before {\n    content: \"\";\n    position: absolute;\n    top: 3px;\n    left: 7px;\n    height: 11px;\n    width: 5px;\n    border: solid;\n    border-width: 0 1px 1px 0;\n    transform: rotate(40deg);\n  }\n  .pullable-body {\n    margin-top: -1px;\n    padding-top: 1px;\n    background: #fff;\n  }\n  .state-refreshing .pullable-body {\n    transform: translate3d(0, 48px, 0);\n    transition: transform 0.2s;\n  }\n  .state-refreshed .pullable-body {\n    animation: refreshed 0.4s;\n  }\n  .state-reset .pullable-body {\n    transition: transform 0.2s;\n  }\n  @keyframes refreshed {\n    0% {\n      transform: translate3d(0, 48px, 0);\n    }\n    50% {\n      transform: translate3d(0, 48px, 0);\n    }\n  }\n  .state-refreshing .pullable-footer {\n    display: none;\n  }\n  .pullable-footer .pullable-btn {\n    color: #484869;\n    text-align: center;\n    line-height: 48px;\n  }\n  .state-loading .pullable-footer .pullable-btn {\n    display: none;\n  }\n  .pullable-loading {\n    display: none;\n    text-align: center;\n    line-height: 48px;\n    color: #7676a1;\n  }\n  .pullable-loading .ui-loading {\n    font-size: 20px;\n    margin-right: 9px;\n  }\n  .state-refreshing .pullable-symbol .pullable-loading,\n  .state-loading .pullable-footer .pullable-loading {\n    display: block;\n  }\n  @media (max-width: 767px) {\n    .pullable-footer{\n      // \u624B\u673A\u4E0A\u4E0D\u663E\u793A\u52A0\u8F7D\u66F4\u591A\u6309\u94AE\uFF0C\u56E0\u4E3A\u624B\u673A\u4E0A\u6027\u80FD\u95EE\u9898state-loading\u6837\u5F0F\u7C7B\u52A0\u8F7D\u5230dom\u4E2D\u6709\u5EF6\u65F6\u4F1A\u5148\u770B\u5230\u8BE5\u6309\u94AE\n      .pullable-btn {\n        display: none;\n      }\n      // \u624B\u673A\u4E0A\u4E5F\u56E0\u4E3A\u6027\u80FD\u95EE\u9898state-loading\u6837\u5F0F\u7C7B\u52A0\u8F7D\u5230dom\u4E2D\u6709\u5EF6\u65F6\uFF0C\u6240\u4EE5\u9ED8\u8BA4\u663E\u793A\u51FA\u6765\n      .pullable-loading {\n        display: block;\n      }\n    }\n  }\n  @keyframes circle {\n    100% {\n      transform: rotate(360deg);\n    }\n  }\n  .ui-loading {\n    display: inline-block;\n    vertical-align: middle;\n    font-size: 12px;\n    width: 1em;\n    height: 1em;\n    border: 2px solid #9494b6;\n    border-top-color: rgba(255, 255, 255, 0.4);\n    border-radius: 100%;\n    animation: circle 0.8s infinite linear;\n  }\n  #ui-waiting .ui-loading {\n    border: 2px solid #fff;\n    border-top-color: #9494b6;\n  }\n  @keyframes pullable-progressing {\n    0% {\n      width: 0;\n    }\n    10% {\n      width: 40%;\n    }\n    20% {\n      width: 75%;\n    }\n    30% {\n      width: 95%;\n    }\n  }\n  @keyframes pullable-progressed {\n    0% {\n      opacity: 1;\n    }\n  }\n  .pullable-progress {\n    position: relative;\n  }\n  .pullable-progress:before {\n    content: \"\";\n    z-index: 1000;\n    position: absolute;\n    top: 0;\n    left: 0;\n    height: 2px;\n    background-color: #08bf06;\n    width: 99%;\n    animation: pullable-progressing 9s ease-out;\n  }\n  .ed.pullable-progress:before {\n    opacity: 0;\n    width: 100%;\n    animation: pullable-progressed 1s;\n  }\n"])));
    var PullableScroller = styled$1.div(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  flex: 1;\n  overflow-x: hidden;\n  overflow-y: scroll;\n  -webkit-overflow-scrolling: touch;\n  \n"]))); // pull to refresh
    // tap bottom to load more

    var Pullable = /*#__PURE__*/function (_React$Component) {
      _inherits(Pullable, _React$Component);

      var _super = _createSuper(Pullable);

      function Pullable() {
        var _this;

        _classCallCheck$1(this, Pullable);

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        _this = _super.call.apply(_super, [this].concat(args));

        _defineProperty$2(_assertThisInitialized(_this), "state", {
          loaderState: STATS.init,
          pullHeight: 0,
          progressed: 0
        });

        _defineProperty$2(_assertThisInitialized(_this), "touchStart", function (e) {
          if (!_this.canRefresh()) return;

          if (e.touches.length === 1) {
            var _assertThisInitialize = _assertThisInitialized(_this),
                panel = _assertThisInitialize.panel;

            _this.initialTouch = {
              clientY: e.touches[0].clientY,
              scrollTop: panel.scrollTop
            };
          }
        });

        _defineProperty$2(_assertThisInitialized(_this), "touchMove", function (e) {
          if (!_this.canRefresh()) return;

          var _assertThisInitialize2 = _assertThisInitialized(_this),
              panel = _assertThisInitialize2.panel;

          var distanceToRefresh = _this.props.distanceToRefresh;
          var scrollTop = panel.scrollTop;

          var distance = _this.calculateDistance(e.touches[0]);

          if (distance > 0 && scrollTop <= 0) {
            var pullDistance = distance - _this.initialTouch.scrollTop;

            if (pullDistance < 0) {
              // 修复 webview 滚动过程中 touchstart 时计算panel.scrollTop不准
              pullDistance = 0;
              _this.initialTouch.scrollTop = distance;
            }

            var pullHeight = easing(pullDistance);
            if (pullHeight) e.preventDefault(); // 减弱滚动

            _this.setState({
              loaderState: pullHeight > distanceToRefresh ? STATS.enough : STATS.pulling,
              pullHeight: pullHeight
            });
          }
        });

        _defineProperty$2(_assertThisInitialized(_this), "touchEnd", function () {
          if (!_this.canRefresh()) return;
          var endState = {
            loaderState: STATS.reset,
            pullHeight: 0
          };

          if (_this.state.loaderState === STATS.enough) {
            // refreshing
            _this.setState({
              loaderState: STATS.refreshing,
              pullHeight: 0
            }); // trigger refresh action


            _this.props.onRefresh(function () {
              // resolve
              _this.setState({
                loaderState: STATS.refreshed,
                pullHeight: 0
              });
            }, function () {
              // reject
              _this.setState(endState); // reset

            });
          } else _this.setState(endState); // reset

        });

        _defineProperty$2(_assertThisInitialized(_this), "loadMore", function () {
          _this.setState({
            loaderState: STATS.loading
          });

          _this.props.onLoadMore(function () {
            // resolve
            _this.setState({
              loaderState: STATS.init
            });
          });
        });

        _defineProperty$2(_assertThisInitialized(_this), "scroll", function (e) {
          if (_this.props.autoLoadMore && _this.props.hasMore && (_this.state.loaderState !== STATS.loading || !_this.props.loading)) {
            var panel = e.currentTarget;
            var scrollBottom = panel.scrollHeight - panel.clientHeight - panel.scrollTop;

            if (panel.scrollTop === 0) {
              // 如果是变更过滤条件时重新加载scrollTop为0，不应该加载下一页
              return;
            }

            if (scrollBottom < 5) _this.loadMore();
          }
        });

        _defineProperty$2(_assertThisInitialized(_this), "animationEnd", function () {
          var newState = {};
          if (_this.state.loaderState === STATS.refreshed || !_this.props.loading) newState.loaderState = STATS.init;
          if (_this.props.initializing > 1) newState.progressed = 1;

          _this.setState(newState);
        });

        _defineProperty$2(_assertThisInitialized(_this), "initialTouch", void 0);

        return _this;
      }

      _createClass$1(Pullable, [{
        key: "componentWillReceiveProps",
        value: function componentWillReceiveProps(nextProps) {
          if (nextProps.initializing < 2) {
            this.setState({
              progressed: 0 // reset progress animation state

            });
          }
        }
      }, {
        key: "setInitialTouch",
        value: function setInitialTouch(touch) {
          this.initialTouch = {
            clientY: touch.clientY
          };
        }
      }, {
        key: "calculateDistance",
        value: function calculateDistance(touch) {
          return touch.clientY - this.initialTouch.clientY;
        }
      }, {
        key: "canRefresh",
        value: function canRefresh() {
          var _this$props = this.props,
              onRefresh = _this$props.onRefresh,
              loading = _this$props.loading;
          var loaderState = this.state.loaderState;
          return onRefresh && ([STATS.refreshing, STATS.loading].indexOf(loaderState) < 0 || !loading);
        }
      }, {
        key: "render",
        value: function render() {
          var _this2 = this;

          var _this$props2 = this.props,
              children = _this$props2.children,
              className = _this$props2.className,
              hasMore = _this$props2.hasMore,
              initializing = _this$props2.initializing,
              loading = _this$props2.loading;
          var _this$state = this.state,
              loaderState = _this$state.loaderState,
              pullHeight = _this$state.pullHeight,
              progressed = _this$state.progressed;
          var footer = hasMore ? /*#__PURE__*/React__default["default"].createElement("div", {
            className: "pullable-footer"
          }, /*#__PURE__*/React__default["default"].createElement("div", {
            className: "pullable-btn",
            onClick: this.loadMore
          }), /*#__PURE__*/React__default["default"].createElement("div", {
            className: "pullable-loading"
          }, /*#__PURE__*/React__default["default"].createElement("i", {
            className: "ui-loading"
          }))) : null;
          var pullHeightValue = pullHeight;

          if (!loading && loaderState === STATS.refreshing) {
            pullHeightValue = 0;
          }

          var style = pullHeightValue ? {
            WebkitTransform: "translate3d(0,".concat(pullHeight, "px,0)")
          } : null;
          var progressClassName = '';

          if (!progressed) {
            if (initializing > 0) progressClassName += ' pullable-progress';
            if (initializing > 1) progressClassName += ' ed';
          }

          var loaderStateClassName = loaderState;

          if (!loading) {
            if (loaderState === STATS.loading) {
              loaderStateClassName = STATS.init;
            } else if (loaderState === STATS.refreshing) {
              loaderStateClassName = STATS.refreshed;
            }
          } else {
            loaderStateClassName = loaderState || STATS.refreshing;
          }

          return /*#__PURE__*/React__default["default"].createElement(PullableContainer, {
            className: "pullable-container ".concat(className)
          }, /*#__PURE__*/React__default["default"].createElement(PullableScroller, {
            ref: function ref(el) {
              _this2.panel = el;
            },
            className: "pullable state-".concat(loaderStateClassName, " ").concat(className).concat(progressClassName),
            onScroll: this.scroll,
            onTouchStart: this.touchStart,
            onTouchMove: this.touchMove,
            onTouchEnd: this.touchEnd,
            onAnimationEnd: this.animationEnd
          }, /*#__PURE__*/React__default["default"].createElement("div", {
            className: "pullable-symbol"
          }, /*#__PURE__*/React__default["default"].createElement("div", {
            className: "pullable-msg"
          }, /*#__PURE__*/React__default["default"].createElement("i", null)), /*#__PURE__*/React__default["default"].createElement("div", {
            className: "pullable-loading"
          }, /*#__PURE__*/React__default["default"].createElement("i", {
            className: "ui-loading"
          }))), /*#__PURE__*/React__default["default"].createElement("div", {
            className: "pullable-body",
            style: style
          }, children), footer));
        }
      }]);

      return Pullable;
    }(React__default["default"].Component);

    Pullable.defaultProps = {
      distanceToRefresh: 60,
      autoLoadMore: 1,
      loading: true
    };

    var _excluded$1 = ["children"];

    var marked = require('marked/lib/marked.js');

    var formatFileSize = function formatFileSize(filesize) {
      var rev, unit;
      rev = filesize / 1024.00;
      unit = 'KB';

      if (rev > 1024.00) {
        rev = rev / 1024.00;
        unit = 'MB';
      }

      if (rev > 1024.00) {
        rev = rev / 1024.00;
        unit = 'GB';
      }

      return rev.toFixed(2) + unit;
    };

    var getSelectFieldLabel = function getSelectFieldLabel(field, fieldValue, doc) {
      var _options, _val, _values, ref, self_val, val;

      _options = field.allOptions || field.options;
      _values = doc || {}; // record_val是grid字段类型传入的，先不考虑
      // _record_val = this.record_val;

      if (_$5.isFunction(field.options)) {
        _options = field.options(_values);
      }

      if (_$5.isFunction(field.optionsFunction)) {
        _options = field.optionsFunction(_values);
      }

      if (_$5.isArray(fieldValue)) {
        self_val = fieldValue;
        _val = [];

        _$5.each(_options, function (_o) {
          if (_$5.indexOf(self_val, _o.value) > -1) {
            return _val.push(_o.label);
          }
        });

        val = _val.join(",");
      } else {
        val = (ref = _$5.findWhere(_options, {
          value: fieldValue
        })) != null ? ref.label : void 0;
      }

      if (!val) {
        val = fieldValue;
      }

      return val;
    };

    var getNumberFieldLabel = function getNumberFieldLabel(field, fieldValue, doc) {
      var fieldScale, reg, val;
      fieldScale = 0;

      if (field.scale) {
        fieldScale = field.scale;
      } else if (field.scale !== 0) {
        fieldScale = field.type === "currency" ? 2 : 0;
      }

      val = Number(fieldValue).toFixed(fieldScale);
      reg = /(\d)(?=(\d{3})+\.)/g;

      if (fieldScale === 0) {
        reg = /(\d)(?=(\d{3})+\b)/g;
      }

      val = val.replace(reg, '$1,');
      return val;
    };

    var FieldLabel = function FieldLabel(_ref) {
      var children = _ref.children,
          props = _objectWithoutProperties(_ref, _excluded$1);

      var field = props.field,
          doc = props.doc;
      field.onClick;
          var format = field.format;
      var Creator = window.Creator;

      if (Creator && _$5.isFunction(Creator.getTableCellData)) {
        if (_$5.isFunction(format)) {
          // 如果有特殊需求，可以在creator中定义format函数，在里面调用Creator.getTableCellData处理显示逻辑
          children = format(children, doc, props.options);
        } else {
          var cellData = Creator.getTableCellData({
            field: field,
            doc: doc,
            val: children,
            object_name: props.options.objectName,
            _id: doc._id
          });
          children = cellData.map(function (item) {
            return item.value;
          }).join(",");
        }
      } else {
        if (_$5.isFunction(format)) {
          children = format(children, doc, props.options);
        }

        if (children || _$5.isBoolean(children) || _$5.isNumber(children)) {
          switch (field.type) {
            case 'datetime':
              if (_$5.isString(children) && /\d+Z$/.test(children)) {
                children = moment$1(children).format('YYYY-MM-DD H:mm');
              } else {
                var utcOffset = moment$1().utcOffset() / 60;
                children = moment$1(children).add(utcOffset, "hours").format('YYYY-MM-DD H:mm');
              }

              break;

            case 'date':
              if (_$5.isString(children) && /\d+Z$/.test(children)) {
                children = moment$1.utc(children).format('YYYY-MM-DD');
              } else {
                children = moment$1(children).format('YYYY-MM-DD');
              }

              break;

            case 'boolean':
              children = children ? '是' : '否';
              break;

            case 'select':
              children = getSelectFieldLabel(field, children, doc);
              break;

            case 'number':
              children = getNumberFieldLabel(field, children);
              break;

            case 'currency':
              children = getNumberFieldLabel(field, children);
              break;

            case 'lookup':
              if (!_$5.isArray(children)) {
                children = [children];
              }

              children = children.map(function (item) {
                return item._NAME_FIELD_VALUE;
              }).join(",");
              break;

            case 'master_detail':
              children = children._NAME_FIELD_VALUE;
              break;

            case 'filesize':
              children = formatFileSize(children);
              break;

            case 'grid':
              // grid字段显示为空字符
              children = "";
              break;

            case 'location':
              children = children ? children.address : "";
              break;

            case 'image':
              // image字段显示为空字符
              children = "";
              break;

            case 'avatar':
              // avatar字段显示为空字符
              children = "";
              break;

            case 'code':
              children = children ? "..." : "";
              break;

            case 'password':
              children = children ? "******" : "";
              break;
            // case 'url':
            // 	children = getUrlFieldLabel(field, children, doc)
            // 	break;
            // case 'email':
            // 	children = getEmailFieldLabel(field, children, doc)
            // 	break;

            case 'textarea':
              if (children) {
                children = children.replace(/\n/g, '\n<br>');
                children = children.replace(/ /g, '&nbsp;');
              }

              break;

            case 'html':
              // html字段显示为空字符
              children = "";

            case 'markdown':
              children = /*#__PURE__*/React__default["default"].createElement("div", {
                dangerouslySetInnerHTML: {
                  __html: marked(children)
                }
              });
              break;
          }
        }
      }

      return /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, children);
    };

    FieldLabel.displayName = "ListItemFieldLabel";

    var _templateObject$7;
    var ListContainer = styled$1.div(_templateObject$7 || (_templateObject$7 = _taggedTemplateLiteral(["\n\tposition: relative;\n\theight: 100%;\n\t.slds-split-view__list-item-action{\n\t\tpadding: 0.6rem 1rem;\n\t\t.slds-text-heading_small{\n\t\t\t.slds-grid{\n\t\t\t\tcolor: #777;\n\t\t\t\tmargin-bottom: 0.35rem;\n\t\t\t\t&:first-child{\n\t\t\t\t\tcolor: #080707;\n\t\t\t\t\t.list-item-left-label{\n\t\t\t\t\t\tfont-weight: bold;\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\t&:last-child{\n\t\t\t\t\tmargin-bottom: 0;\n\t\t\t\t}\n\t\t\t\t.slds-text-body_regular{\n\t\t\t\t\tfont-size: unset;\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n\t&.list-filtering{\n\t\t.list-filtering-bar{\n\t\t\theight: 2.5rem;\n\t\t\tline-height: 2.5rem;\n\t\t\tpadding: 0 1rem;\n\t\t\tborder-bottom: solid 1px #ddd;\n\t\t\t.slds-truncate{\n\t\t\t\tfont-size: 1rem;\n\t\t\t\tcolor: #666;\n\t\t\t}\n\t\t\t.slds-button{\n\t\t\t\tfloat: right;\n\t\t\t\theight: 2.5rem;\n\t\t\t\tline-height: 2.5rem;\n\t\t\t\tpadding: 0 0.5rem;\n\t\t\t\tmargin-right: -0.5rem;\n\t\t\t\t.slds-button__icon{\n\t\t\t\t\twidth: 1.25rem;\n\t\t\t\t\theight: 1.25rem;\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\t.pullable-container{\n\t\t\tmargin-top: 2.5rem;\n\t\t\tpadding-bottom: 2.5rem;\n\t\t}\n\t}\n\t&.slds-grid-no-header{\n\t\t.slds-table thead{\n\t\t\tdisplay: none;\n\t\t}\n\t}\n\t&>.slds-grid_vertical{\n\t\t/*fix IE11 \u5BBD\u5EA6\u5728\u95E8\u6237\u754C\u9762\u4F1A\u8DF3\u51FAwidget\u8303\u56F4*/\n\t\twidth: 100%;\n\t\t/*fix IE11 grid\u5217\u8868\u9876\u90E8th\u5217\u6807\u9898\u680F\u6587\u5B57\u9AD8\u5EA6\u6CA1\u6709\u5C45\u4E2D\u5BF9\u9F50*/\n\t\t.slds-table_header-fixed{\n\t\t\t.slds-cell-fixed{\n\t\t\t\t.slds-p-horizontal_x-small{\n\t\t\t\t\tline-height: 2rem!important\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n\t.slds-illustration.slds-illustration_small .slds-illustration__svg {\n\t\t/*fix IE11 \u9AD8\u5EA6\u672A\u5B9A\u4E49\u4F1A\u9020\u6210footer\u6709\u5185\u5BB9\u65F6\u5E95\u90E8\u754C\u9762\u9519\u4E71*/\n\t\theight: 10rem;\n\t}\n\t.steedos-list-footer{\n\t\tdisplay: flex;\n\t\tjustify-content: flex-end;\n\t\tpadding: 0.35rem 1rem 0.35rem 1rem;\n\t}\n"])));

    var List = /*#__PURE__*/function (_React$Component) {
      _inherits(List, _React$Component);

      var _super = _createSuper(List);

      function List() {
        var _this;

        _classCallCheck$1(this, List);

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        _this = _super.call.apply(_super, [this].concat(args));

        _defineProperty$2(_assertThisInitialized(_this), "state", {
          items: _this.props.rows,
          selection: _this.props.selection
        });

        _defineProperty$2(_assertThisInitialized(_this), "isEnableSearch", function () {
          var enableSearch = _this.props.enableSearch;
          return enableSearch || false;
        });

        _defineProperty$2(_assertThisInitialized(_this), "getObjectName", function () {
          var objectName = _this.props.objectName;
          return objectName;
        });

        _defineProperty$2(_assertThisInitialized(_this), "handleChanged", function (event, data) {
          _this.setState({
            selection: data.selection
          });

          console.log(event, data);
        });

        return _this;
      }

      _createClass$1(List, [{
        key: "componentDidMount",
        value: function componentDidMount() {
          if (this.props.init) {
            this.props.init(this.props);
          }
        }
      }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
          var _this$props = this.props,
              keep = _this$props.keep,
              removeViewAction = _this$props.removeViewAction,
              id = _this$props.id;

          if (!keep) {
            removeViewAction(id);
          }
        }
      }, {
        key: "getDataTableEmpty",
        value: function getDataTableEmpty(isEmpty) {
          if (!isEmpty) {
            return React__default["default"].Fragment;
          }

          var showIllustration = this.props.showIllustration;

          if (!showIllustration) {
            return React__default["default"].Fragment;
          }

          var illustration = this.props.illustration;

          if (!illustration) {
            illustration = {};
          }

          if (!illustration.messageBody) {
            illustration.messageBody = "没有可显示的项目";
          }

          if (!illustration.path) {
            illustration.path = getRelativeUrl("/assets/images/illustrations/empty-state-no-results.svg#no-results");
          }

          return function () {
            return /*#__PURE__*/React__default["default"].createElement(designSystem.Illustration, {
              heading: illustration.heading,
              messageBody: illustration.messageBody,
              name: illustration.name,
              path: illustration.path
            });
          };
        }
      }, {
        key: "getListOptions",
        value: function getListOptions(items, columns, rowIcon, rowIconKey) {
          var _this2 = this;

          var results = items.map(function (item) {
            var itemRows = [],
                itemTag = 0,
                itemOption = {},
                fieldNode,
                fieldValue;
            columns.forEach(function (column) {
              if (column.hidden) {
                return;
              } // 调用_.reduce函数是因为column.field可能是a.b这种格式，比如cfs_files_filerecord对象的original.name


              fieldValue = _$5.reduce(column.field.split("."), function (value, key) {
                return value[key];
              }, item);
              fieldNode = /*#__PURE__*/React__default["default"].createElement(FieldLabel, {
                field: column,
                options: _this2.props,
                doc: item
              }, fieldValue);

              if (column.is_wide) {
                if (itemTag !== 0) {
                  itemRows.push(itemOption);
                }

                itemOption = {
                  key: "".concat(item._id, "_").concat(itemRows.length, "_wide")
                };
                itemOption.label = fieldNode;
                itemTag = 0;
                itemRows.push(itemOption);
              } else {
                if (itemTag === 0) {
                  itemOption = {
                    key: "".concat(item._id, "_").concat(itemRows.length)
                  };
                  itemOption.label = fieldNode;
                  itemTag++;
                } else {
                  itemOption.topRightText = fieldNode;
                  itemTag = 0;
                  itemRows.push(itemOption);
                }
              }
            });

            if (itemTag !== 0) {
              itemRows.push(itemOption);
            }

            if (rowIconKey) {
              rowIcon = item[rowIconKey];

              if (typeof rowIcon === "string") {
                rowIcon = {
                  category: "standard",
                  name: rowIcon
                };
              }
            }

            return {
              key: item._id,
              rows: itemRows,
              rowIcon: rowIcon,
              content: item
            };
          });
          return results;
        }
      }, {
        key: "render",
        value: function render() {
          var _this3 = this;

          var _this$props2 = this.props,
              rows = _this$props2.rows;
              _this$props2.handleChanged;
              _this$props2.selection;
              _this$props2.selectionLabel;
              _this$props2.selectRows;
              _this$props2.objectName;
              _this$props2.search;
              var columns = _this$props2.columns;
              _this$props2.id;
              _this$props2.noHeader;
              _this$props2.unborderedRow;
              _this$props2.sort;
              var rowIcon = _this$props2.rowIcon,
              rowIconKey = _this$props2.rowIconKey,
              pager = _this$props2.pager;
              _this$props2.handlePageChanged;
              _this$props2.handleLoadMore;
              var totalCount = _this$props2.totalCount,
              pageSize = _this$props2.pageSize,
              currentPage = _this$props2.currentPage,
              showMoreLink = _this$props2.showMoreLink,
              filteringText = _this$props2.filteringText,
              resetFiltering = _this$props2.resetFiltering;
          var isLoading = this.props.loading;
          var items = rows;

          if (!currentPage) {
            // 每次currentPage为0或undefined时，清空滚动条数据
            this.state.items = [];
          }

          var listOptions = this.state.items;

          if (!isLoading && items.length) {
            var currentPageListOptions = this.getListOptions(items, columns, rowIcon, rowIconKey);
            listOptions = _$5.union(this.state.items, currentPageListOptions);
            this.state.items = listOptions;
          }

          var isEmpty = isLoading ? false : items.length === 0;
          var DataTableEmpty = this.getDataTableEmpty(isEmpty);
          var listItemHref = this.props.listItemHref ? this.props.listItemHref : function (item) {
            return getObjectRecordUrl(_this3.props.objectName, item.content._id);
          };
          var moreLinkHref = this.props.moreLinkHref ? this.props.moreLinkHref : function (props) {
            return getObjectUrl(props.objectName);
          };
          var pagerTotal = Math.ceil(totalCount / pageSize);
          var hasMore = (currentPage ? currentPage : 0) < pagerTotal - 1;

          var onLoadMore = function onLoadMore() {
            _this3.props.handleLoadMore((currentPage ? currentPage : 0) + 1);
          };

          var onRefresh = function onRefresh() {
            _this3.state.items = [];

            _this3.props.handleRefresh((currentPage ? currentPage : 0) + 1);
          };

          var onResetFiltering = function onResetFiltering() {
            if (typeof resetFiltering === "function") {
              resetFiltering();
            }

            _this3.props.handleResetFiltering();
          };

          var footer;

          if (showMoreLink && !pager && hasMore) {
            footer = /*#__PURE__*/React__default["default"].createElement("div", {
              className: "steedos-list-footer"
            }, /*#__PURE__*/React__default["default"].createElement("a", {
              href: moreLinkHref(this.props)
            }, "\u66F4\u591A"));
          }

          var ListContent = function ListContent() {
            return /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement(Listbox, {
              key: "2",
              options: listOptions,
              events: {
                // onSort: this.sortList,
                onSelect: function onSelect(event, _ref) {// this.setState({
                  // 	unread: this.state.unread.filter((i) => i !== item),
                  // 	selected: selectedItems,
                  // });

                  _ref.selectedItems;
                      _ref.item;
                }
              } // selection={this.state.selected}
              // unread={this.state.unread}
              ,
              listItem: _this3.props.listItem,
              listItemHref: listItemHref
            }), footer ? footer : null);
          };

          var FilteringBar = function FilteringBar() {
            return /*#__PURE__*/React__default["default"].createElement("div", {
              className: "list-filtering-bar"
            }, /*#__PURE__*/React__default["default"].createElement("span", {
              className: "slds-truncate"
            }, filteringText), /*#__PURE__*/React__default["default"].createElement(designSystem.Button, {
              assistiveText: {
                icon: 'Icon Bare Small'
              },
              iconCategory: "utility",
              iconName: "clear",
              iconSize: "large",
              iconVariant: "bare",
              onClick: function onClick() {
                onResetFiltering();
              },
              variant: "icon"
            }));
          };

          return /*#__PURE__*/React__default["default"].createElement(ListContainer, {
            className: classNames('steedos-list slds-nowrap', filteringText ? 'list-filtering' : null)
          }, filteringText ? /*#__PURE__*/React__default["default"].createElement(FilteringBar, null) : null, isEmpty ? /*#__PURE__*/React__default["default"].createElement(DataTableEmpty, null) : pager ? /*#__PURE__*/React__default["default"].createElement(Pullable, {
            onRefresh: onRefresh,
            onLoadMore: onLoadMore,
            hasMore: hasMore,
            loading: isLoading
          }, /*#__PURE__*/React__default["default"].createElement(ListContent, null)) : /*#__PURE__*/React__default["default"].createElement(ListContent, null));
        }
      }]);

      return List;
    }(React__default["default"].Component);

    _defineProperty$2(List, "displayName", 'SteedosDataList');

    _defineProperty$2(List, "defaultProps", {
      rows: [],
      rowIconKey: "",
      selection: [],
      showIllustration: true
    });

    _defineProperty$2(List, "propTypes", {
      objectName: PropTypes.string.isRequired,
      columns: PropTypes.arrayOf(PropTypes.shape({
        field: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        hidden: PropTypes.bool,
        type: PropTypes.oneOf(['date', 'datetime', 'boolean', 'lookup', 'master_detail', 'text', 'select', 'number', 'currency', 'percent', 'autonumber', 'filesize', 'file', 'grid', 'location', 'image', 'avatar', 'code', 'password', 'url', 'email', 'textarea', 'html', 'markdown', 'formula', 'summary']),
        options: PropTypes.oneOfType([PropTypes.func, PropTypes.array]),
        allOptions: PropTypes.oneOfType([PropTypes.func, PropTypes.array]),
        reference_to: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
        optionsFunction: PropTypes.func,
        scale: PropTypes.number,
        is_wide: PropTypes.bool,
        format: PropTypes.func
      })).isRequired,
      pageSize: PropTypes.number,
      sort: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
      rowIcon: PropTypes.shape({
        width: PropTypes.string,
        category: PropTypes.string,
        name: PropTypes.string,
        size: PropTypes.string
      }),
      rowIconKey: PropTypes.string,
      showIllustration: PropTypes.bool,
      illustration: PropTypes.shape({
        heading: PropTypes.string,
        messageBody: PropTypes.string,
        name: PropTypes.string,
        path: PropTypes.string
      }),

      /**
       * Custom list item template for the list item content. The select and unread functionality wraps the custom list item.
       * This should be a React component that accepts props.
       */
      listItem: PropTypes.func,

      /**
       * The list item href generate function
       */
      listItemHref: PropTypes.func,

      /**
       * Whether to show the more link on footer
       */
      showMoreLink: PropTypes.bool,

      /**
       * The more link href generate function
       */
      moreLinkHref: PropTypes.func,

      /**
       * The reset function for filtering state
       */
      resetFiltering: PropTypes.func
    });

    function mapStateToProps$2() {
        return function (state, ownProps) {
            ownProps.id = ownProps.id || makeNewID(ownProps);
            var entityState = viewStateSelector(state, ownProps.id) || {};
            return Object.assign({}, entityState, __assign(__assign({}, entityState), ownProps));
        };
    }
    var mapDispatchToProps$6 = function (dispatch, ownProps) {
        return ({
            handleChanged: function (event, data) { dispatch(createGridAction('selection', data.selection, ownProps)); },
            handleRefresh: function () {
                var newOptions = {};
                if (ownProps.pager || ownProps.showMoreLink) {
                    newOptions.count = true;
                }
                dispatch(createGridAction('currentPage', 0, Object.assign({}, ownProps, newOptions)));
            },
            handleLoadMore: function (currentPage) {
                var newOptions = {};
                newOptions.count = true;
                dispatch(createGridAction('currentPage', currentPage, Object.assign({}, ownProps, newOptions)));
            },
            handleResetFiltering: function () {
                var newOptions = {};
                dispatch(createGridAction('filteringText', null, Object.assign({}, ownProps, newOptions)));
            },
            init: function (options) {
                var newOptions = {};
                if (ownProps.pager || ownProps.showMoreLink) {
                    newOptions.count = true;
                }
                dispatch(loadGridEntitiesData(Object.assign({}, options, newOptions)));
            },
            removeViewAction: function (viewId) { return dispatch(removeViewAction(viewId)); },
        });
    };
    var index$6 = connect(mapStateToProps$2, mapDispatchToProps$6)(List);

    var _templateObject$6;
    var Counter$6 = styled$1.div(_templateObject$6 || (_templateObject$6 = _taggedTemplateLiteral(["\n\twidth: 100%;\n"])));

    var SFTree = /*#__PURE__*/function (_React$Component) {
      _inherits(SFTree, _React$Component);

      var _super = _createSuper(SFTree);

      function SFTree(props) {
        var _this;

        _classCallCheck$1(this, SFTree);

        _this = _super.call(this, props);

        _defineProperty$2(_assertThisInitialized(_this), "state", {
          rootNodes: _this.props.rootNodes,
          nodes: _this.props.nodes
        });

        _defineProperty$2(_assertThisInitialized(_this), "getNodes", function (node) {
          if (!node.nodes) {
            return [];
          }

          var _this$props$nodes = _this.props.nodes,
              stateNodes = _this$props$nodes === void 0 ? {} : _this$props$nodes;
          var nodes = [];
          var childrenNode;
          node.nodes.forEach(function (element) {
            childrenNode = stateNodes[element];

            if (childrenNode) {
              nodes.push(childrenNode);
            }
          });
          return nodes;
        });

        _defineProperty$2(_assertThisInitialized(_this), "handleExpandClick", function (event, data) {
          // log({
          // 	action: this.props.action,
          // 	customLog: this.props.log,
          // 	event,
          // 	eventName: 'Expand Branch',
          // 	data,
          // });
          var selected = data.select ? true : data.node.selected;
          var nodes = _this.props.nodes;
          Object.assign(nodes, _defineProperty$2({}, data.node.id, _objectSpread2$1(_objectSpread2$1({}, data.node), {}, {
            expanded: data.expand,
            selected: selected
          })));

          _this.setState(function (prevState) {
            return _objectSpread2$1(_objectSpread2$1({}, prevState), {}, {
              nodes: _objectSpread2$1(_objectSpread2$1({}, prevState.nodes), _defineProperty$2({}, data.node.id, _objectSpread2$1(_objectSpread2$1({}, data.node), {}, {
                expanded: data.expand,
                selected: selected
              })))
            });
          });
        });

        _defineProperty$2(_assertThisInitialized(_this), "handleClick", function (event, data) {
          // log({
          // 	action: this.props.action,
          // 	customLog: this.props.log,
          // 	event,
          // 	eventName: 'Node Selected',
          // 	data,
          // });
          if (_this.props.multipleSelection) {
            if (!_this.props.noBranchSelection || _this.props.noBranchSelection && data.node.type !== 'branch') {
              // Take the previous state, expand it, overwrite the `nodes` key with the previous state's `nodes` key expanded with the id of the node just clicked selected
              _this.setState(function (prevState) {
                return _objectSpread2$1(_objectSpread2$1({}, prevState), {}, {
                  nodes: _objectSpread2$1(_objectSpread2$1({}, prevState.nodes), _defineProperty$2({}, data.node.id, _objectSpread2$1(_objectSpread2$1({}, data.node), {}, {
                    selected: data.select
                  })))
                });
              });
            }
          } else if (_this.props.noBranchSelection && data.node.type === 'branch') {
            // OPEN BRANCH/FOLDER WHEN CLICKED
            // Although not codified in SLDS, this takes the click callback and turns it into the expand callback, and should be used for item only selection.
            _this.setState(function (prevState) {
              return _objectSpread2$1(_objectSpread2$1({}, prevState), {}, {
                nodes: _objectSpread2$1(_objectSpread2$1({}, prevState.nodes), _defineProperty$2({}, data.node.id, _objectSpread2$1(_objectSpread2$1({}, data.node), {}, {
                  expanded: !data.node.expanded
                })))
              });
            });
          } else {
            // SINGLE SELECTION
            // Take the previous state, expand it, overwrite the `nodes` key with the previous state's `nodes` key expanded with the id of the node just clicked selected and the previously selected node unselected.
            var nodes = _this.props.nodes;
            Object.assign(nodes, _defineProperty$2({}, data.node.id, _objectSpread2$1(_objectSpread2$1({}, data.node), {}, {
              selected: data.select
            })));

            _this.setState(function (prevState) {
              // Gaurd against no selection with the following. `selectedNode`
              // is the previously selected "current state" that is about to
              // be updated
              var selectedNode = prevState.selectedNode ? _defineProperty$2({}, prevState.selectedNode.id, _objectSpread2$1(_objectSpread2$1({}, prevState.nodes[prevState.selectedNode.id]), {}, {
                selected: false
              })) : {};
              return _objectSpread2$1(_objectSpread2$1({}, prevState), {}, {
                nodes: _objectSpread2$1(_objectSpread2$1({}, prevState.nodes), _objectSpread2$1(_defineProperty$2({}, data.node.id, _objectSpread2$1(_objectSpread2$1({}, data.node), {}, {
                  selected: data.select
                })), selectedNode)),
                selectedNode: data.node
              });
            });
          }
        });

        _defineProperty$2(_assertThisInitialized(_this), "handleScroll", function (event, data) {// log({
          // 	action: this.props.action,
          // 	event,
          // 	eventName: 'Tree scrolled',
          // 	data,
          // });
        });

        _defineProperty$2(_assertThisInitialized(_this), "setTimeoutId", null);

        _defineProperty$2(_assertThisInitialized(_this), "searchString", function (str, searchTermStr) {
          var logic = '&';

          if (searchTermStr.startsWith("| ")) {
            logic = "|";
            searchTermStr = searchTermStr.replace("| ", "");
          }
          var strLowerCase = str.toLocaleLowerCase();

          var searchTermArray = _$5.compact(searchTermStr.split(' '));

          _$5.map(searchTermArray, function (searchTerm) {
            return searchTerm.toLocaleLowerCase();
          });

          if (logic === '&') {
            return _$5.every(searchTermArray, function (searchTerm) {
              return strLowerCase.indexOf(searchTerm) > -1;
            });
          } else {
            return _$5.some(searchTermArray, function (searchTerm) {
              return strLowerCase.indexOf(searchTerm) > -1;
            });
          }
        });

        _defineProperty$2(_assertThisInitialized(_this), "searchFunction", function (searchTerm) {
          var _this$props = _this.props,
              _this$props$nodes2 = _this$props.nodes,
              stateNodes = _this$props$nodes2 === void 0 ? {} : _this$props$nodes2,
              changeNodes = _this$props.changeNodes,
              treeId = _this$props.id;
          var childrenNode;
          var changeNodesData = [];

          _$5.each(stateNodes, function (node) {
            if (node.type != 'item' && node.nodes) {
              var childrenNodes = node._cnodes || node.nodes;
              var _nodes = node.nodes;
              var childrenNodeData = null;
              childrenNodes.forEach(function (element) {
                childrenNode = stateNodes[element];

                if (childrenNode) {
                  if (searchTerm && childrenNode.type === 'item') {
                    var _cnodes = node._cnodes || node.nodes; // console.log('node.label', childrenNode, childrenNode.label);


                    if (childrenNode.label && _$5.isString(childrenNode.label) && _this.searchString(childrenNode.label, searchTerm)) {
                      _nodes = _$5.union(_nodes, [childrenNode.id]);
                    } else if (childrenNode.assistiveText && _$5.isString(childrenNode.assistiveText) && _this.searchString(childrenNode.assistiveText, searchTerm)) {
                      _nodes = _$5.union(_nodes, [childrenNode.id]);
                    } else {
                      // console.log('node.nodes', node.nodes);
                      _nodes = _$5.difference(_nodes, [childrenNode.id]);
                    } // console.log('_nodes', _nodes);


                    var expanded = node.expanded;

                    if (_nodes.length > 0) {
                      expanded = true;
                    } else {
                      expanded = false;
                    }

                    childrenNodeData = {
                      id: node.id,
                      nodes: _nodes,
                      _cnodes: _cnodes,
                      label: node.label,
                      expanded: expanded
                    };
                  }
                }
              });

              if (childrenNodeData) {
                changeNodesData.push(childrenNodeData);
              }
            }

            if (!searchTerm) {
              // console.log('unsearchTerm node._cnodes', node);
              if (node._cnodes) {
                changeNodesData.push({
                  id: node.id,
                  nodes: node._cnodes,
                  _cnodes: node._cnodes,
                  label: node.label
                });
              }
            }
          });

          changeNodes({
            nodes: changeNodesData
          }, {
            id: treeId
          });
        });

        _defineProperty$2(_assertThisInitialized(_this), "handleSearchChange", function (event) {
          _this.setState({
            searchTerm: event.target.value
          });

          var searchTerm = event.target.value || "";
          searchTerm = searchTerm.trim(); // console.log('searchTerm', searchTerm);

          if (_this.setTimeoutId != null) {
            clearTimeout(_this.setTimeoutId);
            _this.setTimeoutId = null;
          }

          _this.setTimeoutId = setTimeout(function () {
            _this.searchFunction(searchTerm);
          }, 300);
        });

        if (!_this.props.id) {
          _this.id = "".concat(_this.props.objectName, "-tree");
        }

        return _this;
      }

      _createClass$1(SFTree, [{
        key: "componentDidMount",
        value: function componentDidMount() {
          if (this.props.init) {
            this.props.init(this.props);
          }
        }
      }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
          var _this$props2 = this.props,
              keep = _this$props2.keep,
              removeViewAction = _this$props2.removeViewAction,
              id = _this$props2.id;

          if (!keep) {
            removeViewAction(id);
          }
        }
      }, {
        key: "render",
        value: function render() {
          var _this$props3 = this.props,
              assistiveText = _this$props3.assistiveText,
              searchable = _this$props3.searchable,
              className = _this$props3.className,
              getNodes = _this$props3.getNodes,
              noHeading = _this$props3.noHeading,
              id = _this$props3.id,
              listStyle = _this$props3.listStyle,
              listClassName = _this$props3.listClassName,
              rootNodes = _this$props3.rootNodes,
              searchTerm = _this$props3.searchTerm,
              onExpandClick = _this$props3.onExpandClick,
              onClick = _this$props3.onClick,
              onScroll = _this$props3.onScroll;
          return /*#__PURE__*/React__default["default"].createElement(Counter$6, null, searchable ? /*#__PURE__*/React__default["default"].createElement("div", null, /*#__PURE__*/React__default["default"].createElement(designSystem.Search, {
            assistiveText: {
              label: 'Search Tree'
            },
            id: "example-search",
            value: searchTerm,
            onChange: this.handleSearchChange
          })) : null, /*#__PURE__*/React__default["default"].createElement(designSystem.Tree, {
            assistiveText: assistiveText,
            className: className,
            getNodes: getNodes || this.getNodes,
            heading: !noHeading && this.props.heading,
            id: id || this.id,
            listStyle: listStyle,
            listClassName: listClassName,
            nodes: rootNodes,
            onExpandClick: onExpandClick || this.handleExpandClick,
            onClick: onClick || this.handleClick,
            onScroll: onScroll || this.handleScroll // searchTerm={searchTerm || this.state.searchTerm}

          }));
        }
      }]);

      return SFTree;
    }(React__default["default"].Component);

    _defineProperty$2(SFTree, "defaultProps", {
      heading: 'Tree',
      noHeading: true,
      nodes: [],
      selectedNode: []
    });

    _defineProperty$2(SFTree, "propTypes", {
      objectName: PropTypes.string.isRequired,
      rootNodes: PropTypes.array.isRequired,
      getNodes: PropTypes.func,
      id: PropTypes.string,
      onClick: PropTypes.func,
      init: PropTypes.func,
      spaceId: PropTypes.string,
      keep: PropTypes.bool
    });

    function mapStateToProps$1() {
        return function (state, ownProps) {
            ownProps.id = ownProps.id || makeNewID(ownProps);
            var entityState = viewStateSelector(state, ownProps.id) || {};
            return entityState;
        };
    }
    var mapDispatchToProps$5 = function (dispatch, ownProps) {
        var props = {
            removeViewAction: function (viewId) { return dispatch(removeViewAction(viewId)); },
            changeNode: function (partialStateValue, options) { return dispatch(createTreeAction("changeNode", partialStateValue, options)); },
            changeNodes: function (partialStateValue, options) { return dispatch(createTreeAction("changeNodes", partialStateValue, options)); }
        };
        if (ownProps.init) {
            props.init = function (options) { return dispatch(ownProps.init(options)); };
        }
        if (ownProps.onClick) {
            props.onExpandClick = function (event, data) { return dispatch(createTreeAction('expandClick', data, ownProps)); };
            props.onClick = function (event, data) { return dispatch(ownProps.onClick(event, data)); };
        }
        return props;
    };
    var SteedosTree = connect(mapStateToProps$1, mapDispatchToProps$5)(SFTree);

    var OrganizationsTree = /** @class */ (function (_super) {
        __extends$4(OrganizationsTree, _super);
        function OrganizationsTree(props) {
            var _this = _super.call(this, props) || this;
            if (_$5.isEmpty(props.rootNodes)) {
                props.dispatch(loadOrganizationsEntitiesData({ id: props.id, objectName: props.objectName, filters: [["parent", "=", null]], columns: props.columns }));
            }
            return _this;
        }
        OrganizationsTree.prototype.render = function () {
            var _this = this;
            //Tree props
            var _a = this.props, rootNodes = _a.rootNodes, onClick = _a.onClick, objectName = _a.objectName, columns = _a.columns, id = _a.id;
            var getNodes = function (node) {
                if (!node.nodes) {
                    return [];
                }
                var _a = _this.props.nodes, stateNodes = _a === void 0 ? {} : _a;
                var nodes = [];
                node.nodes.forEach(function (element) {
                    if (_$5.isString(element)) {
                        if (stateNodes[element]) {
                            nodes.push(stateNodes[element]);
                        }
                    }
                    else {
                        if (stateNodes[element.id]) {
                            nodes.push(Object.assign({ expanded: true }, stateNodes[element.id]));
                        }
                    }
                });
                return nodes;
            };
            var init = function (options) {
                var newOptions = Object.assign({}, options);
                newOptions.columns = columns;
                return loadTreeEntitiesData(newOptions);
            };
            return (React__namespace.createElement(SteedosTree, { objectName: objectName, rootNodes: rootNodes, getNodes: getNodes, onClick: onClick, init: init, id: id }));
        };
        OrganizationsTree.defaultProps = {
            valueField: '_id',
            width: '300px',
            objectName: 'organizations',
            columns: [{ field: 'name' }, { field: 'fullname' }, { field: 'children' }]
        };
        OrganizationsTree.propTypes = {
            rootNodes: PropTypes.array.isRequired,
            id: PropTypes.string,
            multiple: PropTypes.bool,
            valueField: PropTypes.string,
            onClick: PropTypes.func
        };
        return OrganizationsTree;
    }(React__namespace.Component));

    function makeMapStateToProps$6() {
        return function (state, ownProps) {
            ownProps.id = ownProps.id || makeNewID(ownProps);
            var entityState = viewStateSelector(state, ownProps.id) || {};
            return Object.assign({}, entityState, __assign(__assign({}, entityState), ownProps));
        };
    }
    var Organizations = connect(makeMapStateToProps$6)(OrganizationsTree);

    var Counter$5 = styled$1.div(templateObject_1$1 || (templateObject_1$1 = __makeTemplateObject(["\n    display: flex;\n"], ["\n    display: flex;\n"])));
    var OrgsCounter = styled$1.div(templateObject_2$1 || (templateObject_2$1 = __makeTemplateObject(["\n    position: fixed;\n    top: 0;\n    bottom: 0;\n    left: 0;\n    display: flex;\n    width: 24rem;\n    overflow: hidden;\n    overflow-y: auto;\n"], ["\n    position: fixed;\n    top: 0;\n    bottom: 0;\n    left: 0;\n    display: flex;\n    width: 24rem;\n    overflow: hidden;\n    overflow-y: auto;\n"])));
    var UsersCounter = styled$1.div(templateObject_3$1 || (templateObject_3$1 = __makeTemplateObject(["\n    margin-left: 24rem;\n    &>.slds-grid{\n        position: absolute;\n        width: calc(100% - 24rem);\n    }\n"], ["\n    margin-left: 24rem;\n    &>.slds-grid{\n        position: absolute;\n        width: calc(100% - 24rem);\n    }\n"])));
    var gridObjectName$1 = "space_users";
    var gridColumns$1 = [
        {
            field: 'name',
            label: '姓名'
        },
        {
            field: 'email',
            label: '邮箱'
        },
        {
            field: 'mobile',
            label: '手机号'
        },
        {
            field: 'user',
            label: 'userId',
            hidden: true
        }
    ];
    var SelectUsers = /** @class */ (function (_super) {
        __extends$4(SelectUsers, _super);
        function SelectUsers(props) {
            return _super.call(this, props) || this;
        }
        SelectUsers.prototype.render = function () {
            // let getRowId = (row: any) => row[(this.props as any).valueField]
            var _a = this.props, rootNodes = _a.rootNodes, selectionLabel = _a.selectionLabel, searchMode = _a.searchMode, multiple = _a.multiple, pageSize = _a.pageSize, treeId = _a.treeId, gridId = _a.gridId;
            var onClick = function (event, data) {
                return function (dispatch, getState) {
                    dispatch(createGridAction("filters", [["organizations", "=", data.node.id]], { id: gridId, objectName: gridObjectName$1, columns: gridColumns$1, searchMode: searchMode, pageSize: pageSize, baseFilters: [["user_accepted", "=", true]] }));
                    dispatch({
                        type: 'TREE_STATE_CHANGE',
                        payload: {
                            partialStateName: 'click',
                            partialStateValue: data,
                            objectName: 'organizations',
                            id: treeId
                        }
                    });
                };
            };
            //Tree props
            var selectRows = 'radio';
            if (multiple) {
                selectRows = 'checkbox';
            }
            return (React__namespace.createElement(Counter$5, { className: "select-users" },
                React__namespace.createElement(OrgsCounter, { className: "organizations" },
                    React__namespace.createElement(Organizations, { id: treeId, rootNodes: rootNodes, onClick: onClick })),
                React__namespace.createElement(UsersCounter, { className: "users" },
                    React__namespace.createElement(Grid, { baseFilters: ["user_accepted", "=", true], id: gridId, objectName: gridObjectName$1, enableSearch: true, columns: gridColumns$1, searchMode: searchMode, pageSize: pageSize, selectionLabel: selectionLabel, selectRows: selectRows }))));
        };
        SelectUsers.defaultProps = {
            valueField: '_id',
            selectionLabel: 'name',
            rootNodes: [],
            pageSize: 200,
            treeId: makeNewID({}),
            gridId: makeNewID({})
        };
        SelectUsers.propTypes = {
            rootNodes: PropTypes.array,
            multiple: PropTypes.bool,
            valueField: PropTypes.string,
            selectionLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
            searchMode: PropTypes.oneOf(['omitFilters']),
            pageSize: PropTypes.number,
            treeId: PropTypes.string,
            gridId: PropTypes.string
        };
        return SelectUsers;
    }(React__namespace.Component));
    var templateObject_1$1, templateObject_2$1, templateObject_3$1;

    var getRecordIcon = function getRecordIcon(record) {
      var icon = null;

      if (record.object_name) {
        var object = getObject(store.getState(), record.object_name);

        if (object) {
          var objectIcon = object.icon;
          var category = 'standard';
          var name = objectIcon;
          var title = record.name || '';
          var foo = name != null ? name.split(".") : void 0;

          if (foo && foo.length > 1) {
            category = foo[0];
            name = foo[1];
          }

          icon = /*#__PURE__*/React__default["default"].createElement(designSystem.Icon, {
            category: category,
            name: name,
            title: title,
            className: "slds-icon--small"
          });
        }
      }

      return icon;
    };

    var getRecordBody = function getRecordBody(record) {
      var body = null;

      if (record.object_name) {
        var object = getObject(store.getState(), record.object_name);

        if (object) {
          body = /*#__PURE__*/React__default["default"].createElement("div", {
            id: record._id
          }, /*#__PURE__*/React__default["default"].createElement("span", {
            className: "slds-listbox__option-text slds-listbox__option-text_entity"
          }, record.name), /*#__PURE__*/React__default["default"].createElement("span", {
            className: "slds-listbox__option-meta slds-text-body--small slds-listbox__option-meta_entity"
          }, object.label));
        }
      }

      return body;
    };

    var _onClick = function onClick(record, recordOnClick) {
      if (recordOnClick) {
        //此处连续调用2次click用于解决IOS设备上，点击关注记录后，popover不关闭问题。
        window.$(".slds-button_icon", window.$('#header-favorites-popover-id-popover')).trigger('click');
        window.$(".slds-button_icon", window.$('#header-favorites-popover-id-popover')).trigger('click');
        recordOnClick(record);
      }
    };

    var getBody = function getBody(records, recordOnClick) {
      if (records) {
        return /*#__PURE__*/React__default["default"].createElement("div", {
          id: "favoritesContent",
          className: "slds-listbox_vertical"
        }, records.map(function (record, index) {
          return /*#__PURE__*/React__default["default"].createElement("div", {
            className: "slds-listbox__option",
            onClick: function onClick() {
              _onClick(record, recordOnClick);
            },
            key: record._id
          }, /*#__PURE__*/React__default["default"].createElement(designSystem.MediaObject, {
            className: "slds-listbox__option_entity",
            body: getRecordBody(record),
            figure: getRecordIcon(record),
            verticalCenter: true
          }));
        }));
      } else {
        return '';
      }
    };

    var favorites = /*#__PURE__*/function (_React$Component) {
      _inherits(favorites, _React$Component);

      var _super = _createSuper(favorites);

      function favorites(props) {
        var _this;

        _classCallCheck$1(this, favorites);

        _this = _super.call(this, props);
        _this.state = {
          favoritesActionSelected: false
        };
        return _this;
      }

      _createClass$1(favorites, [{
        key: "componentDidMount",
        value: function componentDidMount() {
          if (this.props.init) {
            this.props.init(this.props);
          }
        }
      }, {
        key: "render",
        value: function render() {
          var _this$props = this.props,
              title = _this$props.title,
              records = _this$props.records,
              onToggleActionSelected = _this$props.onToggleActionSelected,
              actionSelected = _this$props.actionSelected,
              actionDisabled = _this$props.actionDisabled,
              recordOnClick = _this$props.recordOnClick,
              assistiveText = _this$props.assistiveText,
              editOnClick = _this$props.editOnClick;
          return /*#__PURE__*/React__default["default"].createElement(designSystem.GlobalHeaderFavorites, {
            actionSelected: actionSelected,
            actionDisabled: actionDisabled,
            assistiveText: assistiveText,
            onToggleActionSelected: onToggleActionSelected,
            popover: /*#__PURE__*/React__default["default"].createElement(designSystem.Popover, {
              ariaLabelledby: "favorites-heading",
              body: getBody(records, recordOnClick),
              classNameBody: "slds-p-around_none",
              align: "bottom right",
              footer: /*#__PURE__*/React__default["default"].createElement("div", {
                className: "slds-media slds-media--center slds-p-left--none"
              }, /*#__PURE__*/React__default["default"].createElement("a", {
                className: "footerAction slds-grow",
                href: "javacript:void(0);",
                onClick: function onClick() {
                  editOnClick();
                }
              }, /*#__PURE__*/React__default["default"].createElement("div", {
                className: "slds-media slds-media--center slds-p-left--medium"
              }, /*#__PURE__*/React__default["default"].createElement("div", {
                className: "slds-icon--x-small slds-icon_container slds-media__figure"
              }, /*#__PURE__*/React__default["default"].createElement(designSystem.Icon, {
                category: "utility",
                name: "edit",
                size: "x-small",
                style: {
                  fill: 'currentColor'
                }
              })), /*#__PURE__*/React__default["default"].createElement("div", {
                className: "slds-media__body slds-m-left--none"
              }, assistiveText.editFavorites)))),
              heading: title,
              id: "header-favorites-popover-id"
            })
          });
        }
      }]);

      return favorites;
    }(React__default["default"].Component);

    _defineProperty$2(favorites, "defaultProps", {
      title: "我的收藏夹",
      assistiveText: {
        editFavorites: "编辑收藏夹"
      }
    });

    _defineProperty$2(favorites, "propTypes", {
      title: PropTypes.string,
      objectName: PropTypes.string.isRequired,
      recordOnClick: PropTypes.func.isRequired,
      editOnClick: PropTypes.func.isRequired,
      onToggleActionSelected: PropTypes.func.isRequired,
      assistiveText: PropTypes.shape({
        editFavorites: PropTypes.string
      })
    });

    function mapStateToProps() {
        return function (state, ownProps) {
            ownProps.id = ownProps.id || makeNewID(ownProps);
            var entityState = viewStateSelector(state, ownProps.id) || {};
            return Object.assign({}, entityState, __assign(__assign({}, entityState), ownProps), { objectName: "favorites", columns: [{ field: "name" }, { field: "object_name" }, { field: "record_type" }, { field: "record_id" }], sort: "sort_no desc" });
        };
    }
    var mapDispatchToProps$4 = function (dispatch, ownProps) {
        return ({
        // init: (options: any) => dispatch(loadFavoritesEntitiesData(options))
        });
    };
    var index$5 = connect(mapStateToProps, mapDispatchToProps$4)(favorites);

    var gridObjectName = "flows";
    var gridColumns = [
        {
            field: 'name',
            label: '流程名'
        }, {
            field: 'description',
            type: 'markdown',
            label: '描述'
        }
    ];
    var Counter$4 = styled$1.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    display: flex;\n"], ["\n    display: flex;\n"])));
    var CategoriesCounter = styled$1.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    position: fixed;\n    display: flex;\n    width: 14rem;\n    overflow: hidden;\n    overflow-y: auto;\n"], ["\n    position: fixed;\n    display: flex;\n    width: 14rem;\n    overflow: hidden;\n    overflow-y: auto;\n"])));
    var FlowsCounter = styled$1.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n    margin-left: 14rem;\n    width: calc(100%);\n    height: 500px;\n    border-left: 1px solid #d5d5da;\n"], ["\n    margin-left: 14rem;\n    width: calc(100%);\n    height: 500px;\n    border-left: 1px solid #d5d5da;\n"])));
    var Flows$1 = /** @class */ (function (_super) {
        __extends$4(Flows, _super);
        function Flows(props) {
            var _this = _super.call(this, props) || this;
            if (_$5.isEmpty(props.rootNodes)) {
                var spaceId = _this.props.spaceId;
                props.dispatch(loadCategoriesEntitiesData({ id: props.treeId, spaceId: spaceId, objectName: "categories", filters: [], columns: [{ field: 'name' }] }));
            }
            return _this;
        }
        Flows.prototype.render = function () {
            var _a = this.props, searchMode = _a.searchMode, multiple = _a.multiple, pageSize = _a.pageSize, rootNodes = _a.rootNodes, treeId = _a.treeId, gridId = _a.gridId, spaceId = _a.spaceId, gridProp = _a.gridProp, treeProp = _a.treeProp, disabledSelectRows = _a.disabledSelectRows;
            var init = function (options) {
                var newOptions = Object.assign({}, options, { id: treeId, spaceId: spaceId });
                newOptions.columns = [{ field: 'name' }];
                return loadTreeEntitiesData(newOptions);
            };
            var onClick = function (event, data) {
                return function (dispatch, getState) {
                    dispatch(createGridAction("filters", [["category", "=", data.node.id]], { id: gridId, spaceId: spaceId, objectName: gridObjectName, columns: gridColumns, searchMode: searchMode, pageSize: pageSize, baseFilters: [["state", "=", "enabled"]] }));
                    dispatch({
                        type: 'TREE_STATE_CHANGE',
                        payload: {
                            partialStateName: 'click',
                            partialStateValue: data,
                            objectName: 'categories',
                            id: treeId
                        }
                    });
                };
            };
            var selectRows = 'radio';
            if (multiple) {
                selectRows = 'checkbox';
            }
            if (disabledSelectRows) {
                selectRows = null;
            }
            return (React__namespace.createElement(Counter$4, { className: "flows-list" },
                React__namespace.createElement(CategoriesCounter, { className: "categories" },
                    React__namespace.createElement(SteedosTree, __assign({ objectName: "categories", rootNodes: rootNodes, onClick: onClick, init: init, id: treeId }, treeProp, { spaceId: spaceId }))),
                React__namespace.createElement(FlowsCounter, { className: "flows" },
                    React__namespace.createElement(Grid, __assign({ id: gridId, objectName: gridObjectName, enableSearch: true, columns: gridColumns, selectRows: selectRows, baseFilters: [["state", "=", "enabled"]], searchMode: searchMode }, gridProp, { spaceId: spaceId })))));
        };
        Flows.defaultProps = {
            valueField: '_id',
            selectionLabel: 'name',
            rootNodes: [],
            pageSize: 200,
            treeId: makeNewID({}),
            gridId: makeNewID({})
        };
        return Flows;
    }(React__namespace.Component));
    var templateObject_1, templateObject_2, templateObject_3;

    function makeMapStateToProps$5() {
        return function (state, ownProps) {
            ownProps.id = ownProps.id || makeNewID(ownProps);
            var entityState = viewStateSelector(state, ownProps.id) || {};
            return Object.assign({}, entityState, __assign(__assign({}, entityState), ownProps));
        };
    }
    var Flows = connect(makeMapStateToProps$5)(Flows$1);

    var _templateObject$5;
    var Counter$3 = styled$1.div(_templateObject$5 || (_templateObject$5 = _taggedTemplateLiteral(["\n    &>.slds-modal__content{\n        overflow: hidden;\n    }\n"])));

    var FlowsModal = /*#__PURE__*/function (_React$Component) {
      _inherits(FlowsModal, _React$Component);

      var _super = _createSuper(FlowsModal);

      function FlowsModal(props) {
        var _this;

        _classCallCheck$1(this, FlowsModal);

        _this = _super.call(this, props);

        _defineProperty$2(_assertThisInitialized(_this), "toggleOpen", function () {
          var _this$props = _this.props,
              id = _this$props.id,
              closeModal = _this$props.closeModal;
          closeModal(id);
        });

        _defineProperty$2(_assertThisInitialized(_this), "confirmClick", function () {
          var onConfirm = _this.props.onConfirm;

          if (onConfirm) {
            onConfirm();
          }

          _this.toggleOpen();
        });

        var appElement = props.appElement;
        designSystem.Settings.setAppElement(appElement);
        return _this;
      }

      _createClass$1(FlowsModal, [{
        key: "render",
        value: function render() {
          var _this$props2 = this.props,
              confirmLabel = _this$props2.confirmLabel,
              size = _this$props2.size,
              heading = _this$props2.heading,
              isOpen = _this$props2.isOpen,
              id = _this$props2.id,
              treeId = _this$props2.treeId,
              gridId = _this$props2.gridId,
              multiple = _this$props2.multiple,
              spaceId = _this$props2.spaceId,
              gridProp = _this$props2.gridProp,
              treeProp = _this$props2.treeProp,
              disabledSelectRows = _this$props2.disabledSelectRows;
          return /*#__PURE__*/React__namespace.createElement(Counter$3, null, /*#__PURE__*/React__namespace.createElement(designSystem.Modal, {
            isOpen: isOpen,
            onRequestClose: this.toggleOpen,
            contentStyle: {
              overflow: 'hidden'
            },
            footer: [/*#__PURE__*/React__namespace.createElement(designSystem.Button, {
              label: confirmLabel,
              variant: "brand",
              onClick: this.confirmClick,
              key: "confirm"
            }), /*#__PURE__*/React__namespace.createElement(designSystem.Button, {
              label: "\u53D6\u6D88",
              onClick: this.toggleOpen,
              key: "cancel"
            })],
            heading: heading,
            size: size,
            id: id
          }, /*#__PURE__*/React__namespace.createElement(Flows, {
            searchMode: "omitFilters",
            treeId: treeId,
            gridId: gridId,
            multiple: multiple,
            disabledSelectRows: disabledSelectRows,
            spaceId: spaceId,
            gridProp: gridProp,
            treeProp: treeProp
          })));
        }
      }]);

      return FlowsModal;
    }(React__namespace.Component);

    _defineProperty$2(FlowsModal, "defaultProps", {
      confirmLabel: "确定",
      size: "medium",
      heading: "选择模板流程",
      isOpen: false
    });

    _defineProperty$2(FlowsModal, "propTypes", {
      onConfirm: PropTypes.func,
      confirmLabel: PropTypes.string,
      heading: PropTypes.string,
      size: PropTypes.oneOf(['small', 'medium', 'large']),
      isOpen: PropTypes.bool,
      appElement: PropTypes.string.isRequired,
      id: PropTypes.string,
      treeId: PropTypes.string,
      gridId: PropTypes.string,
      multiple: PropTypes.bool,
      spaceId: PropTypes.string,
      gridProp: PropTypes.any,
      treeProp: PropTypes.any
    });

    function makeMapStateToProps$4() {
        return function (state, ownProps) {
            ownProps.id = ownProps.id || makeNewID(ownProps);
            var entityState = viewStateSelector(state, ownProps.id) || {};
            return Object.assign({}, entityState, __assign(__assign({}, entityState), ownProps));
        };
    }
    var mapDispatchToProps$3 = function (dispatch, ownProps) {
        return ({
            closeModal: function (modalId) { return dispatch(createFlowsModalAction('isOpen', false, { id: modalId })); },
        });
    };
    var index$4 = connect(makeMapStateToProps$4, mapDispatchToProps$3)(FlowsModal);

    var _templateObject$4;
    var Counter$2 = styled$1.div(_templateObject$4 || (_templateObject$4 = _taggedTemplateLiteral(["\n    &>.slds-modal__content{\n        overflow: hidden;\n    }\n"])));

    var GridModal = /*#__PURE__*/function (_React$Component) {
      _inherits(GridModal, _React$Component);

      var _super = _createSuper(GridModal);

      function GridModal(props) {
        var _this;

        _classCallCheck$1(this, GridModal);

        _this = _super.call(this, props);

        _defineProperty$2(_assertThisInitialized(_this), "toggleOpen", function () {
          var _this$props = _this.props,
              id = _this$props.id,
              closeModal = _this$props.closeModal;
          closeModal(id);
        });

        _defineProperty$2(_assertThisInitialized(_this), "confirmClick", function () {
          var onConfirm = _this.props.onConfirm;

          if (onConfirm) {
            onConfirm();
          }

          _this.toggleOpen();
        });

        var appElement = props.appElement;
        designSystem.Settings.setAppElement(appElement);
        return _this;
      }

      _createClass$1(GridModal, [{
        key: "render",
        value: function render() {
          var _this$props2 = this.props,
              confirmLabel = _this$props2.confirmLabel,
              size = _this$props2.size,
              heading = _this$props2.heading,
              isOpen = _this$props2.isOpen,
              id = _this$props2.id,
              gridProp = _this$props2.gridProp;
          return /*#__PURE__*/React__namespace.createElement(Counter$2, null, /*#__PURE__*/React__namespace.createElement(designSystem.Modal, {
            isOpen: isOpen,
            onRequestClose: this.toggleOpen,
            contentStyle: {
              overflow: 'hidden'
            },
            footer: [/*#__PURE__*/React__namespace.createElement(designSystem.Button, {
              label: confirmLabel,
              variant: "brand",
              onClick: this.confirmClick,
              key: "confirm"
            }), /*#__PURE__*/React__namespace.createElement(designSystem.Button, {
              label: "\u53D6\u6D88",
              onClick: this.toggleOpen,
              key: "cancel"
            })],
            heading: heading,
            size: size,
            id: id
          }, /*#__PURE__*/React__namespace.createElement(Grid, gridProp)));
        }
      }]);

      return GridModal;
    }(React__namespace.Component);

    _defineProperty$2(GridModal, "defaultProps", {
      confirmLabel: "确定",
      size: "medium",
      isOpen: false
    });

    _defineProperty$2(GridModal, "propTypes", {
      onConfirm: PropTypes.func,
      confirmLabel: PropTypes.string,
      heading: PropTypes.string.isRequired,
      size: PropTypes.oneOf(['small', 'medium', 'large']),
      isOpen: PropTypes.bool,
      appElement: PropTypes.string.isRequired,
      id: PropTypes.string,
      gridProp: PropTypes.any
    });

    function makeMapStateToProps$3() {
        return function (state, ownProps) {
            ownProps.id = ownProps.id || makeNewID(ownProps);
            var entityState = viewStateSelector(state, ownProps.id) || {};
            return Object.assign({}, entityState, __assign(__assign({}, entityState), ownProps));
        };
    }
    var mapDispatchToProps$2 = function (dispatch, ownProps) {
        return ({
            closeModal: function (modalId) { return dispatch(createGridModalAction('isOpen', false, { id: modalId })); },
        });
    };
    var index$3 = connect(makeMapStateToProps$3, mapDispatchToProps$2)(GridModal);

    var _templateObject$3;
    var ProfileContainer = styled$1.div(_templateObject$3 || (_templateObject$3 = _taggedTemplateLiteral(["\n    .slds-popover__body, .slds-popover__footer{\n        padding: 0px;\n    }\n\n    .slds-avatar{\n        img{\n            height: 100%;\n        }\n    }\n\n    .user-profile-content{\n        .slds-avatar{\n            width: 2.4rem;\n            height: 2.4rem;\n            .slds-icon{\n                width: 2.4rem;\n                height: 2.4rem;\n            }\n        }\n    }\n\n    .slds-popover__header{\n        display: none;\n    }\n"])));

    var profile = /*#__PURE__*/function (_React$Component) {
      _inherits(profile, _React$Component);

      var _super = _createSuper(profile);

      function profile(props) {
        var _this;

        _classCallCheck$1(this, profile);

        _this = _super.call(this, props);

        _defineProperty$2(_assertThisInitialized(_this), "settingsAccount", function (e) {
          e.preventDefault();
          var settingsAccountClick = _this.props.settingsAccountClick;

          if (settingsAccountClick && _$5.isFunction(settingsAccountClick)) {
            settingsAccountClick();
          }
        });

        _defineProperty$2(_assertThisInitialized(_this), "logoutAccount", function (e) {
          e.preventDefault();
          var logoutAccountClick = _this.props.logoutAccountClick;

          if (logoutAccountClick && _$5.isFunction(logoutAccountClick)) {
            logoutAccountClick();
          }
        });

        return _this;
      }

      _createClass$1(profile, [{
        key: "render",
        value: function render() {
          var _this2 = this;

          var _this$props = this.props,
              _profile = _this$props.profile,
              avatarURL = _this$props.avatarURL,
              footers = _this$props.footers,
              assistiveText = _this$props.assistiveText;
          return /*#__PURE__*/React__default["default"].createElement(ProfileContainer, null, /*#__PURE__*/React__default["default"].createElement(designSystem.GlobalHeaderProfile, {
            popover: /*#__PURE__*/React__default["default"].createElement(designSystem.Popover, {
              hasNoCloseButton: true,
              body: /*#__PURE__*/React__default["default"].createElement(designSystem.MediaObject, {
                className: "user-profile-content slds-var-p-around_medium",
                body: /*#__PURE__*/React__default["default"].createElement("div", {
                  id: "profile-".concat(_profile.userId),
                  className: "slds-m-left_x-small"
                }, /*#__PURE__*/React__default["default"].createElement("span", {
                  className: "slds-listbox__option-text slds-listbox__option-text_entity slds-m-bottom_x-small"
                }, _profile.name), /*#__PURE__*/React__default["default"].createElement("span", {
                  className: "slds-listbox__option-meta slds-text-body--small slds-listbox__option-meta_entity slds-m-bottom_x-small"
                }, window.location.hostname), /*#__PURE__*/React__default["default"].createElement("span", null, /*#__PURE__*/React__default["default"].createElement("a", {
                  className: "slds-p-right--medium",
                  href: "javacript:void(0);",
                  onClick: function onClick(e) {
                    _this2.settingsAccount(e);
                  }
                }, assistiveText.settings), /*#__PURE__*/React__default["default"].createElement("a", {
                  href: "javacript:void(0);",
                  onClick: function onClick(e) {
                    _this2.logoutAccount(e);
                  }
                }, assistiveText.logout))),
                figure: /*#__PURE__*/React__default["default"].createElement(designSystem.Avatar, {
                  imgSrc: avatarURL,
                  imgAlt: _profile.name,
                  title: _profile.name
                })
              }),
              id: "header-profile-popover-id",
              ariaLabelledby: "",
              footer: /*#__PURE__*/React__default["default"].createElement("div", {
                className: "profile-footer slds-var-p-around_medium"
              }, footers.map(function (item, _index) {
                return /*#__PURE__*/React__default["default"].createElement("div", {
                  key: "profile-footer-".concat(item.id || _index),
                  className: "slds-media slds-media--center slds-p-left--none"
                }, /*#__PURE__*/React__default["default"].createElement("a", {
                  className: "footerAction slds-grow",
                  href: "javacript:void(0);",
                  onClick: function onClick(e) {
                    e.preventDefault();
                    item.onClick(e);
                  }
                }, /*#__PURE__*/React__default["default"].createElement("div", {
                  className: "slds-media slds-media--center slds-p-bottom_x-small"
                }, /*#__PURE__*/React__default["default"].createElement("div", {
                  className: "slds-media__body slds-m-left--none"
                }, item.label))));
              }))
            }),
            userName: _profile.name,
            avatar: /*#__PURE__*/React__default["default"].createElement(designSystem.Avatar, {
              imgSrc: avatarURL,
              imgAlt: _profile.name,
              title: _profile.name
            })
          }));
        }
      }]);

      return profile;
    }(React__default["default"].Component);

    _defineProperty$2(profile, "defaultProps", {
      footers: [],
      assistiveText: PropTypes.shape({
        settings: "账户设置",
        logout: "注销"
      })
    });

    _defineProperty$2(profile, "propTypes", {
      settingsAccountClick: PropTypes.func.isRequired,
      logoutAccountClick: PropTypes.func.isRequired,
      avatarURL: PropTypes.string.isRequired,
      footers: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
        onClick: PropTypes.func.isRequired
      })),
      assistiveText: PropTypes.shape({
        settings: PropTypes.string,
        logout: PropTypes.string
      })
    });

    function makeMapStateToProps$2() {
        return function (state, ownProps) {
            var profileState = { profile: getProfile(state) || {} };
            return Object.assign({}, profileState, __assign(__assign({}, profileState), ownProps));
        };
    }
    var index$2 = connect(makeMapStateToProps$2)(profile);

    var _templateObject$2;
    var Counter$1 = styled$1.div(_templateObject$2 || (_templateObject$2 = _taggedTemplateLiteral(["\n    &>.slds-modal__content{\n        overflow: hidden;\n    }\n    .slds-tree_container{\n        width: 100%;\n        max-width: 100%;\n        margin-bottom: 1rem;\n    }\n\t#example-search{\n\t\tborder-radius: 0 !important;\n\t}\n"])));
    var objectName = "flows";
    var columns = [{
      field: 'name',
      label: '流程名',
      width: '30%'
    }, {
      field: 'category',
      type: 'lookup',
      label: '分类',
      reference_to: 'categories'
    }];

    var FlowsTree = /*#__PURE__*/function (_React$Component) {
      _inherits(FlowsTree, _React$Component);

      var _super = _createSuper(FlowsTree);

      function FlowsTree() {
        _classCallCheck$1(this, FlowsTree);

        return _super.apply(this, arguments);
      }

      _createClass$1(FlowsTree, [{
        key: "componentDidMount",
        value: function componentDidMount() {
          if (this.props.loadData) {
            this.props.loadData({
              objectName: objectName,
              columns: columns
            });
          }
        }
      }, {
        key: "render",
        value: function render() {
          var onClick = function onClick(event, data) {
            return function (dispatch, getState) {
              if (data.node.type === 'branch') {
                dispatch({
                  type: 'TREE_STATE_CHANGE',
                  payload: {
                    partialStateName: 'expandClick',
                    partialStateValue: Object.assign({}, data, {
                      expand: !data.node.expanded
                    }),
                    objectName: 'categories',
                    id: treeId
                  }
                });
              }

              dispatch({
                type: 'TREE_STATE_CHANGE',
                payload: {
                  partialStateName: 'click',
                  partialStateValue: data,
                  objectName: 'categories',
                  id: treeId
                }
              });
            };
          };

          var _this$props = this.props,
              rootNodes = _this$props.rootNodes;
              _this$props.nodes;
              var treeId = _this$props.treeId,
              searchable = _this$props.searchable;
          return /*#__PURE__*/React__namespace.createElement(Counter$1, null, /*#__PURE__*/React__namespace.createElement(SteedosTree, {
            searchable: searchable,
            objectName: objectName,
            rootNodes: rootNodes,
            onClick: onClick,
            id: treeId
          }));
        }
      }]);

      return FlowsTree;
    }(React__namespace.Component);

    _defineProperty$2(FlowsTree, "propTypes", {
      id: PropTypes.string
    });

    function makeMapStateToProps$1() {
        return function (state, ownProps) {
            ownProps.id = ownProps.id || makeNewID(ownProps);
            var entityState = viewStateSelector(state, ownProps.id) || {};
            return Object.assign({}, entityState, __assign(__assign({}, entityState), ownProps));
        };
    }
    var mapDispatchToProps$1 = function (dispatch, ownProps) {
        return ({
            loadData: function (options) { return dispatch(createTreeAction("setNodes", { nodes: ownProps.nodes }, { id: ownProps.treeId })); },
        });
    };
    var index$1 = connect(makeMapStateToProps$1, mapDispatchToProps$1)(FlowsTree);

    var _templateObject$1;
    var Counter = styled$1.div(_templateObject$1 || (_templateObject$1 = _taggedTemplateLiteral(["\n    &>.slds-modal__content{\n        overflow: hidden;\n    }\n"])));

    var SteedosModal = /*#__PURE__*/function (_React$Component) {
      _inherits(SteedosModal, _React$Component);

      var _super = _createSuper(SteedosModal);

      function SteedosModal(props) {
        var _this;

        _classCallCheck$1(this, SteedosModal);

        _this = _super.call(this, props);

        _defineProperty$2(_assertThisInitialized(_this), "toggleOpen", function () {
          var _this$props = _this.props,
              id = _this$props.id,
              closeModal = _this$props.closeModal;
          closeModal(id);
        });

        _defineProperty$2(_assertThisInitialized(_this), "confirmClick", function () {
          var onConfirm = _this.props.onConfirm;

          if (onConfirm) {
            onConfirm();
          }

          _this.toggleOpen();
        });

        var appElement = props.appElement;
        designSystem.Settings.setAppElement(appElement);
        return _this;
      }

      _createClass$1(SteedosModal, [{
        key: "render",
        value: function render() {
          var _this$props2 = this.props,
              confirmLabel = _this$props2.confirmLabel,
              size = _this$props2.size,
              heading = _this$props2.heading,
              isOpen = _this$props2.isOpen,
              id = _this$props2.id,
              align = _this$props2.align,
              footer = _this$props2.footer,
              header = _this$props2.header,
              tagline = _this$props2.tagline;
          var _footer = [/*#__PURE__*/React__namespace.createElement(designSystem.Button, {
            label: confirmLabel,
            variant: "brand",
            onClick: this.confirmClick,
            key: "confirm"
          }), /*#__PURE__*/React__namespace.createElement(designSystem.Button, {
            label: "\u53D6\u6D88",
            onClick: this.toggleOpen,
            key: "cancel"
          })];

          if (footer === undefined) {
            footer = _footer;
          }

          return /*#__PURE__*/React__namespace.createElement(Counter, null, /*#__PURE__*/React__namespace.createElement(designSystem.Modal, {
            isOpen: isOpen,
            onRequestClose: this.toggleOpen,
            contentStyle: {
              overflow: 'hidden',
              userSelect: "none"
            },
            footer: footer,
            heading: heading,
            size: size,
            id: id,
            align: align,
            headerClassName: id,
            header: header,
            tagline: tagline
          }, this.props.children));
        }
      }]);

      return SteedosModal;
    }(React__namespace.Component);

    _defineProperty$2(SteedosModal, "defaultProps", {
      confirmLabel: "确定",
      size: "medium",
      isOpen: false
    });

    _defineProperty$2(SteedosModal, "propTypes", {
      onConfirm: PropTypes.func,
      confirmLabel: PropTypes.string,
      heading: PropTypes.any.isRequired,
      size: PropTypes.oneOf(['small', 'medium', 'large']),
      align: PropTypes.oneOf(['top', 'center']),
      isOpen: PropTypes.bool,
      appElement: PropTypes.string.isRequired,
      id: PropTypes.string
    });

    function makeMapStateToProps() {
        return function (state, ownProps) {
            ownProps.id = ownProps.id || makeNewID(ownProps);
            var entityState = viewStateSelector(state, ownProps.id) || {};
            return Object.assign({}, entityState, __assign(__assign({}, entityState), ownProps));
        };
    }
    var mapDispatchToProps = function (dispatch, ownProps) {
        return ({
            closeModal: function (modalId) { return dispatch(createModalAction('isOpen', false, { id: modalId })); },
        });
    };
    var index = connect(makeMapStateToProps, mapDispatchToProps)(SteedosModal);

    var Illustration = /*#__PURE__*/function (_React$Component) {
      _inherits(Illustration, _React$Component);

      var _super = _createSuper(Illustration);

      function Illustration() {
        _classCallCheck$1(this, Illustration);

        return _super.apply(this, arguments);
      }

      _createClass$1(Illustration, [{
        key: "render",
        value: function render() {
          var _this$props = this.props,
              name = _this$props.name,
              style = _this$props.style,
              size = _this$props.size,
              illustrationSvgName = _this$props.illustrationSvgName,
              heading = _this$props.heading,
              messageBody = _this$props.messageBody,
              className = _this$props.className,
              illustrationSvg = _this$props.illustrationSvg;

          if (!name) {
            name = illustrationSvgName;
          }

          var kababCaseName = name ? name.replace(/_| /g, '-').toLowerCase() : '';

          var styles = _objectSpread2$1({}, style);

          var IllustrationSvg = null;

          if (illustrationSvg) {
            IllustrationSvg = illustrationSvg;
            illustrationSvg = /*#__PURE__*/React__default["default"].createElement(IllustrationSvg, {
              name: kababCaseName,
              style: styles
            });
          }

          if (illustrationSvg) {
            return /*#__PURE__*/React__default["default"].createElement("div", {
              className: classNames(className, 'slds-illustration', {
                'slds-illustration_small': size === 'small',
                'slds-illustration_large': size === 'large'
              })
            }, illustrationSvg, /*#__PURE__*/React__default["default"].createElement("div", {
              className: "slds-text-longform"
            }, heading ? /*#__PURE__*/React__default["default"].createElement("h3", {
              className: "slds-text-heading_medium"
            }, heading) : null, messageBody ? /*#__PURE__*/React__default["default"].createElement("p", {
              className: "slds-text-body_regular"
            }, messageBody) : null));
          } else {
            return /*#__PURE__*/React__default["default"].createElement(designSystem.Illustration, this.props);
          }
        }
      }]);

      return Illustration;
    }(React__default["default"].Component);

    _defineProperty$2(Illustration, "displayName", designSystem.Illustration.displayName);

    Illustration.defaultProps = designSystem.Illustration.defaultProps;
    Illustration.propTypes = _objectSpread2$1(_objectSpread2$1({}, designSystem.Illustration.propTypes), {}, {
      illustrationSvgName: PropTypes.string,
      illustrationSvg: PropTypes.object
    });

    var _excluded = ["vertical", "triggerByHover", "className"];

    var _templateObject;
    var Container = styled$1.div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    .slds-vertical-tabs{\n        &.slds-tabs_default, &.slds-tabs_scoped{\n            background: unset;\n            .slds-tabs_default__nav, .slds-tabs_scoped__nav{\n                width: 12rem;\n                border-right: 1px solid #dddbda;\n                background: #f3f2f2;\n                display: block;\n                border-left: none;\n                border-bottom: none;\n                border-top: none;\n                border-radius: 0;\n                .slds-tabs_default__item, .slds-tabs_scoped__item{\n                    display: flex;\n                    align-items: center;\n                    overflow: hidden;\n                    border-bottom: 1px solid #dddbda;\n                    color: #3e3e3c;\n                    &.slds-active{\n                        margin-right: -1px;\n                        border-right: 0;\n                        background: #fff;\n                        color: #006dcc;\n                    }\n                    .slds-tabs_default__link, .slds-tabs_scoped__link{\n                        display: flex;\n                        flex: 1 1 0%;\n                        align-items: center;\n                        min-width: 0;\n                        padding: .75rem;\n                        // color: currentColor;\n                        width: 100%;\n                    }\n                    &:focus{\n                        outline: none;\n                    }\n                }\n            }\n            .slds-tabs_default__content, .slds-tabs_scoped__content{\n                flex: 1;\n                padding: 1rem;\n                background: #fff;\n                border: none;\n            }\n        }\n        &.slds-tabs_default{\n            border: none;\n            .slds-tabs_default__nav{\n                border: 1px solid #dddbda;\n                border-radius: .25rem;\n                padding: .25rem;\n                background: #fff;\n                width: 8rem;\n                .slds-tabs_default__item{\n                    border: none;\n                    &.slds-active{\n                        margin-right: 0;\n                        color: #080707;\n                        &:after{\n                            content: \"\";\n                            width: 3px;\n                            height: 1rem;\n                            position: absolute;\n                            right: 0.25rem;\n                            left: auto;\n                            top: 50%;\n                            margin-top: -0.5rem;\n                        }\n                    }\n                    &:hover{\n                        &:after{\n                            content: \"\";\n                            width: 3px;\n                            height: 1rem;\n                            position: absolute;\n                            right: 0.25rem;\n                            left: auto;\n                            top: 50%;\n                            margin-top: -0.5rem;\n                        }\n                    }\n                    .slds-tabs_default__link{\n                        justify-content: center;\n                    }\n                }\n            }\n            .slds-tabs_default__content{\n                border: 1px solid #dddbda;\n                border-radius: .25rem;\n                margin-left: 1rem;\n            }\n        }\n        &.slds-tabs_scoped{\n            .slds-tabs_scoped__content{\n                border-radius: 0;\n            }\n        }\n    }\n"])));

    var Tabs = /*#__PURE__*/function (_React$Component) {
      _inherits(Tabs, _React$Component);

      var _super = _createSuper(Tabs);

      function Tabs(props) {
        var _this;

        _classCallCheck$1(this, Tabs);

        _this = _super.call(this, props);

        _defineProperty$2(_assertThisInitialized(_this), "handleMove", function (e) {
          var item = e.target.closest(".slds-tabs_default__item, .slds-tabs_scoped__item");

          if (item) {
            _this.refs.tabs.handleClick(e);
          }
        });

        return _this;
      }

      _createClass$1(Tabs, [{
        key: "render",
        value: function render() {
          var _this$props = this.props,
              vertical = _this$props.vertical,
              triggerByHover = _this$props.triggerByHover,
              className = _this$props.className,
              props = _objectWithoutProperties(_this$props, _excluded);

          var containerProps = {};

          if (triggerByHover) {
            containerProps.onMouseMove = this.handleMove;
          }

          return /*#__PURE__*/React__namespace.createElement(Container, _extends$1({
            className: "steedos-tabs-container"
          }, containerProps), /*#__PURE__*/React__namespace.createElement(designSystem.Tabs, _extends$1({}, props, {
            className: classNames({
              'slds-vertical-tabs': vertical === true
            }, className),
            ref: "tabs"
          })));
        }
      }]);

      return Tabs;
    }(React__namespace.Component);

    _defineProperty$2(Tabs, "defaultProps", _$5.extend({}, designSystem.Tabs.defaultProps, {
      vertical: false,
      triggerByHover: false
    }));

    _defineProperty$2(Tabs, "propTypes", _$5.extend({}, designSystem.Tabs.propTypes, {
      vertical: PropTypes.bool,
      triggerByHover: PropTypes.bool
    }));

    function getRandomString(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    function makeNewID(props) {
        return props.id ? props.id : getRandomString(16);
    }

    exports.BOOTSTRAP_STATE_CHANGE_ACTION = BOOTSTRAP_STATE_CHANGE_ACTION;
    exports.Bootstrap = Bootstrap;
    exports.CATEGORIES_STATE_CHANGE_ACTION = CATEGORIES_STATE_CHANGE_ACTION;
    exports.DXGRID_STATE_CHANGE_ACTION = DXGRID_STATE_CHANGE_ACTION;
    exports.Dashboard = index$7;
    exports.FAVORITES_STATE_CHANGE_ACTION = FAVORITES_STATE_CHANGE_ACTION;
    exports.FLOWSMODAL_STATE_CHANGE_ACTION = FLOWSMODAL_STATE_CHANGE_ACTION;
    exports.FLOWSTREE_STATE_CHANGE_ACTION = FLOWSTREE_STATE_CHANGE_ACTION;
    exports.Favorites = index$5;
    exports.Flows = Flows;
    exports.FlowsModal = index$4;
    exports.FlowsTree = index$1;
    exports.GRIDMODAL_STATE_CHANGE_ACTION = GRIDMODAL_STATE_CHANGE_ACTION;
    exports.GRID_STATE_CHANGE_ACTION = GRID_STATE_CHANGE_ACTION;
    exports.Grid = Grid;
    exports.GridModal = index$3;
    exports.HeaderProfile = index$2;
    exports.Illustration = Illustration;
    exports.LOOKUP_STATE_CHANGE_ACTION = LOOKUP_STATE_CHANGE_ACTION;
    exports.List = index$6;
    exports.Lookup = Lookup;
    exports.MODAL_STATE_CHANGE_ACTION = MODAL_STATE_CHANGE_ACTION;
    exports.Modal = index;
    exports.NOTIFICATIONS_COUNT_CHANGE_ACTION = NOTIFICATIONS_COUNT_CHANGE_ACTION;
    exports.NOTIFICATIONS_INTERVAL_CHANGE_ACTION = NOTIFICATIONS_INTERVAL_CHANGE_ACTION;
    exports.NOTIFICATIONS_STATE_CHANGE_ACTION = NOTIFICATIONS_STATE_CHANGE_ACTION;
    exports.Notifications = Notifications;
    exports.ORGANIZATIONS_STATE_CHANGE_ACTION = ORGANIZATIONS_STATE_CHANGE_ACTION;
    exports.Organizations = Organizations;
    exports.PLUGIN_COMPONENT_RECEIVED_ACTION = PLUGIN_COMPONENT_RECEIVED_ACTION;
    exports.PLUGIN_INSTANCE_RECEIVED_ACTION = PLUGIN_INSTANCE_RECEIVED_ACTION;
    exports.PluginRegistry = PluginRegistry;
    exports.SelectUsers = SelectUsers;
    exports.TREE_STATE_CHANGE_ACTION = TREE_STATE_CHANGE_ACTION;
    exports.Tabs = Tabs;
    exports.Tree = SteedosTree;
    exports.VIEWS_STATE_CHANGE_ACTION = VIEWS_STATE_CHANGE_ACTION;
    exports.WidgetApps = WidgetApps;
    exports.WidgetObject = WidgetObject;
    exports.changeActionDisabled = changeActionDisabled$1;
    exports.changeActionSelected = changeActionSelected$1;
    exports.changeAssistiveText = changeAssistiveText$1;
    exports.changeRecords = changeRecords$1;
    exports.clearNotificationsInterval = clearNotificationsInterval;
    exports.createAction = createAction;
    exports.createBootstrapAction = createBootstrapAction;
    exports.createCategoriesAction = createCategoriesAction;
    exports.createDXGridAction = createDXGridAction;
    exports.createDashboardAction = createDashboardAction;
    exports.createFlowsModalAction = createFlowsModalAction;
    exports.createFlowsTreeAction = createFlowsTreeAction;
    exports.createGridAction = createGridAction;
    exports.createGridModalAction = createGridModalAction;
    exports.createLookupAction = createLookupAction;
    exports.createModalAction = createModalAction;
    exports.createOrganizationsAction = createOrganizationsAction;
    exports.createTreeAction = createTreeAction;
    exports.creatorAppsSelector = creatorAppsSelector;
    exports.dataServicesSelector = dataServicesSelector;
    exports.entityStateSelector = entityStateSelector;
    exports.executeApi = executeApi;
    exports.executeApiRequest = executeApiRequest;
    exports.generateId = generateId;
    exports.getAbsoluteUrl = getAbsoluteUrl;
    exports.getAuthToken = getAuthToken;
    exports.getBootstrapData = getBootstrapData;
    exports.getCookie = getCookie;
    exports.getObject = getObject;
    exports.getObjectRecordUrl = getObjectRecordUrl;
    exports.getObjectUrl = getObjectUrl;
    exports.getProfile = getProfile;
    exports.getRelativeUrl = getRelativeUrl;
    exports.getRequestError = getRequestError;
    exports.getRequestStatus = getRequestStatus;
    exports.getSpaceId = getSpaceId;
    exports.getUserId = getUserId;
    exports.getWidgetReductsConfig = getWidgetReductsConfig;
    exports.isMobile = isMobile;
    exports.isRequestFailure = isRequestFailure;
    exports.isRequestStarted = isRequestStarted;
    exports.isRequestSuccess = isRequestSuccess;
    exports.loadBootstrapData = loadBootstrapData;
    exports.loadBootstrapDataRequest = loadBootstrapDataRequest;
    exports.loadBootstrapEntitiesData = loadBootstrapEntitiesData;
    exports.loadCategoriesEntitiesData = loadCategoriesEntitiesData;
    exports.loadDXGridEntitiesData = loadDXGridEntitiesData;
    exports.loadEntitiesDataRequest = loadEntitiesDataRequest;
    exports.loadFavoritesEntitiesData = loadFavoritesEntitiesData;
    exports.loadFlowsTreeEntitiesData = loadFlowsTreeEntitiesData;
    exports.loadGridEntitiesData = loadGridEntitiesData;
    exports.loadLookupEntitiesData = loadLookupEntitiesData;
    exports.loadNotificationsCount = loadNotificationsCount;
    exports.loadNotificationsData = loadNotificationsData;
    exports.loadNotificationsDataInterval = loadNotificationsDataInterval;
    exports.loadNotificationsItems = loadNotificationsItems;
    exports.loadOrganizationsEntitiesData = loadOrganizationsEntitiesData;
    exports.loadTreeEntitiesData = loadTreeEntitiesData;
    exports.makeNewID = makeNewID;
    exports.pluginComponentObjectSelector = pluginComponentObjectSelector;
    exports.pluginComponentSelector = pluginComponentSelector;
    exports.pluginComponentsSelector = pluginComponentsSelector;
    exports.pluginInstanceSelector = pluginInstanceSelector;
    exports.postNotificationsMethod = postNotificationsMethod;
    exports.query = query;
    exports.receivePluginComponent = receivePluginComponent;
    exports.receivePluginInstance = receivePluginInstance;
    exports.registerDefaultPlugins = registerDefaultPlugins;
    exports.registerPlugin = registerPlugin;
    exports.registerWindowLibraries = registerWindowLibraries;
    exports.removeViewAction = removeViewAction;
    exports.request = request;
    exports.rootReducer = rootReducer;
    exports.settingsStateSelector = settingsStateSelector;
    exports.store = store;
    exports.viewStateSelector = viewStateSelector;
    exports.visibleAppsSelector = visibleAppsSelector;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({}, React, ReactDOM, null, DesignSystem);
