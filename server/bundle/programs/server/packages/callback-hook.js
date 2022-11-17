(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var meteorInstall = Package.modules.meteorInstall;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var options, Hook;

var require = meteorInstall({"node_modules":{"meteor":{"callback-hook":{"hook.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                 //
// packages/callback-hook/hook.js                                                                  //
//                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                   //
module.export({
  Hook: () => Hook
});
// XXX This pattern is under development. Do not add more callsites
// using this package for now. See:
// https://meteor.hackpad.com/Design-proposal-Hooks-YxvgEW06q6f
//
// Encapsulates the pattern of registering callbacks on a hook.
//
// The `each` method of the hook calls its iterator function argument
// with each registered callback.  This allows the hook to
// conditionally decide not to call the callback (if, for example, the
// observed object has been closed or terminated).
//
// By default, callbacks are bound with `Meteor.bindEnvironment`, so they will be
// called with the Meteor environment of the calling code that
// registered the callback. Override by passing { bindEnvironment: false }
// to the constructor.
//
// Registering a callback returns an object with a single `stop`
// method which unregisters the callback.
//
// The code is careful to allow a callback to be safely unregistered
// while the callbacks are being iterated over.
//
// If the hook is configured with the `exceptionHandler` option, the
// handler will be called if a called callback throws an exception.
// By default (if the exception handler doesn't itself throw an
// exception, or if the iterator function doesn't return a falsy value
// to terminate the calling of callbacks), the remaining callbacks
// will still be called.
//
// Alternatively, the `debugPrintExceptions` option can be specified
// as string describing the callback.  On an exception the string and
// the exception will be printed to the console log with
// `Meteor._debug`, and the exception otherwise ignored.
//
// If an exception handler isn't specified, exceptions thrown in the
// callback will propagate up to the iterator function, and will
// terminate calling the remaining callbacks if not caught.
const hasOwn = Object.prototype.hasOwnProperty;

class Hook {
  constructor(options) {
    options = options || {};
    this.nextCallbackId = 0;
    this.callbacks = Object.create(null); // Whether to wrap callbacks with Meteor.bindEnvironment

    this.bindEnvironment = true;

    if (options.bindEnvironment === false) {
      this.bindEnvironment = false;
    }

    if (options.exceptionHandler) {
      this.exceptionHandler = options.exceptionHandler;
    } else if (options.debugPrintExceptions) {
      if (typeof options.debugPrintExceptions !== "string") {
        throw new Error("Hook option debugPrintExceptions should be a string");
      }

      this.exceptionHandler = options.debugPrintExceptions;
    }
  }

  register(callback) {
    var exceptionHandler = this.exceptionHandler || function (exception) {
      // Note: this relies on the undocumented fact that if bindEnvironment's
      // onException throws, and you are invoking the callback either in the
      // browser or from within a Fiber in Node, the exception is propagated.
      throw exception;
    };

    if (this.bindEnvironment) {
      callback = Meteor.bindEnvironment(callback, exceptionHandler);
    } else {
      callback = dontBindEnvironment(callback, exceptionHandler);
    }

    var id = this.nextCallbackId++;
    this.callbacks[id] = callback;
    return {
      callback,
      stop: () => {
        delete this.callbacks[id];
      }
    };
  } // For each registered callback, call the passed iterator function
  // with the callback.
  //
  // The iterator function can choose whether or not to call the
  // callback.  (For example, it might not call the callback if the
  // observed object has been closed or terminated).
  //
  // The iteration is stopped if the iterator function returns a falsy
  // value or throws an exception.
  //


  each(iterator) {
    // Invoking bindEnvironment'd callbacks outside of a Fiber in Node doesn't
    // run them to completion (and exceptions thrown from onException are not
    // propagated), so we need to be in a Fiber.
    Meteor._nodeCodeMustBeInFiber();

    var ids = Object.keys(this.callbacks);

    for (var i = 0; i < ids.length; ++i) {
      var id = ids[i]; // check to see if the callback was removed during iteration

      if (hasOwn.call(this.callbacks, id)) {
        var callback = this.callbacks[id];

        if (!iterator(callback)) {
          break;
        }
      }
    }
  }

}

// Copied from Meteor.bindEnvironment and removed all the env stuff.
function dontBindEnvironment(func, onException, _this) {
  if (!onException || typeof onException === 'string') {
    var description = onException || "callback of async function";

    onException = function (error) {
      Meteor._debug("Exception in " + description, error);
    };
  }

  return function () {
    try {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var ret = func.apply(_this, args);
    } catch (e) {
      onException(e);
    }

    return ret;
  };
}
/////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

var exports = require("/node_modules/meteor/callback-hook/hook.js");

/* Exports */
Package._define("callback-hook", exports, {
  Hook: Hook
});

})();

//# sourceURL=meteor://💻app/packages/callback-hook.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY2FsbGJhY2staG9vay9ob29rLmpzIl0sIm5hbWVzIjpbIm1vZHVsZSIsImV4cG9ydCIsIkhvb2siLCJoYXNPd24iLCJPYmplY3QiLCJwcm90b3R5cGUiLCJoYXNPd25Qcm9wZXJ0eSIsImNvbnN0cnVjdG9yIiwib3B0aW9ucyIsIm5leHRDYWxsYmFja0lkIiwiY2FsbGJhY2tzIiwiY3JlYXRlIiwiYmluZEVudmlyb25tZW50IiwiZXhjZXB0aW9uSGFuZGxlciIsImRlYnVnUHJpbnRFeGNlcHRpb25zIiwiRXJyb3IiLCJyZWdpc3RlciIsImNhbGxiYWNrIiwiZXhjZXB0aW9uIiwiTWV0ZW9yIiwiZG9udEJpbmRFbnZpcm9ubWVudCIsImlkIiwic3RvcCIsImVhY2giLCJpdGVyYXRvciIsIl9ub2RlQ29kZU11c3RCZUluRmliZXIiLCJpZHMiLCJrZXlzIiwiaSIsImxlbmd0aCIsImNhbGwiLCJmdW5jIiwib25FeGNlcHRpb24iLCJfdGhpcyIsImRlc2NyaXB0aW9uIiwiZXJyb3IiLCJfZGVidWciLCJhcmdzIiwicmV0IiwiYXBwbHkiLCJlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQUEsTUFBTSxDQUFDQyxNQUFQLENBQWM7QUFBQ0MsTUFBSSxFQUFDLE1BQUlBO0FBQVYsQ0FBZDtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUEsTUFBTUMsTUFBTSxHQUFHQyxNQUFNLENBQUNDLFNBQVAsQ0FBaUJDLGNBQWhDOztBQUVPLE1BQU1KLElBQU4sQ0FBVztBQUNoQkssYUFBVyxDQUFDQyxPQUFELEVB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LFlBQW1CO0FBQ3hCLFFBQUk7QUFBQSx3Q0FEY0UsSUFDZDtBQURjQSxZQUNkO0FBQUE7O0FBQ0YsVUFBSUMsR0FBRyxHQUFHUCxJQUFJLENBQUNRLEtBQUwsQ0FBV04sS0FBWCxFQUFrQkksSUFBbEIsQ0FBVjtBQUNELEtBRkQsQ0FFRSxPQUFPRyxDQUFQLEVBQVU7QUFDVlIsaUJBQVcsQ0FBQ1EsQ0FBRCxDQUFYO0FBQ0Q7O0FBQ0QsV0FBT0YsR0FBUDtBQUNELEdBUEQ7QUFRRCxDIiwiZmlsZSI6Ii9wYWNrYWdlcy9jYWxsYmFjay1ob29rLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gWFhYIFRoaXMgcGF0dGVybiBpcyB1bmRlciBkZXZlbG9wbWVudC4gRG8gbm90IGFkZCBtb3JlIGNhbGxzaXRlc1xuLy8gdXNpbmcgdGhpcyBwYWNrYWdlIGZvciBub3cuIFNlZTpcbi8vIGh0dHBzOi8vbWV0ZW9yLmhhY2twYWQuY29tL0Rlc2lnbi1wcm9wb3NhbC1Ib29rcy1ZeHZnRVcwNnE2ZlxuLy9cbi8vIEVuY2Fwc3VsYXRlcyB0aGUgcGF0dGVybiBvZiByZWdpc3RlcmluZyBjYWxsYmFja3Mgb24gYSBob29rLlxuLy9cbi8vIFRoZSBgZWFjaGAgbWV0aG9kIG9mIHRoZSBob29rIGNhbGxzIGl0cyBpdGVyYXRvciBmdW5jdGlvbiBhcmd1bWVudFxuLy8gd2l0aCBlYWNoIHJlZ2lzdGVyZWQgY2FsbGJhY2suICBUaGlzIGFsbG93cyB0aGUgaG9vayB0b1xuLy8gY29uZGl0aW9uYWxseSBkZWNpZGUgbm90IHRvIGNhbGwgdGhlIGNhbGxiYWNrIChpZiwgZm9yIGV4YW1wbGUsIHRoZVxuLy8gb2JzZXJ2ZWQgb2JqZWN0IGhhcyBiZWVuIGNsb3NlZCBvciB0ZXJtaW5hdGVkKS5cbi8vXG4vLyBCeSBkZWZhdWx0LCBjYWxsYmFja3MgYXJlIGJvdW5kIHdpdGggYE1ldGVvci5iaW5kRW52aXJvbm1lbnRgLCBzbyB0aGV5IHdpbGwgYmVcbi8vIGNhbGxlZCB3aXRoIHRoZSBNZXRlb3IgZW52aXJvbm1lbnQgb2YgdGhlIGNhbGxpbmcgY29kZSB0aGF0XG4vLyByZWdpc3RlcmVkIHRoZSBjYWxsYmFjay4gT3ZlcnJpZGUgYnkgcGFzc2luZyB7IGJpbmRFbnZpcm9ubWVudDogZmFsc2UgfVxuLy8gdG8gdGhlIGNvbnN0cnVjdG9yLlxuLy9cbi8vIFJlZ2lzdGVyaW5nIGEgY2FsbGJhY2sgcmV0dXJucyBhbiBvYmplY3Qgd2l0aCBhIHNpbmdsZSBgc3RvcGBcbi8vIG1ldGhvZCB3aGljaCB1bnJlZ2lzdGVycyB0aGUgY2FsbGJhY2suXG4vL1xuLy8gVGhlIGNvZGUgaXMgY2FyZWZ1bCB0byBhbGxvdyBhIGNhbGxiYWNrIHRvIGJlIHNhZmVseSB1bnJlZ2lzdGVyZWRcbi8vIHdoaWxlIHRoZSBjYWxsYmFja3MgYXJlIGJlaW5nIGl0ZXJhdGVkIG92ZXIuXG4vL1xuLy8gSWYgdGhlIGhvb2sgaXMgY29uZmlndXJlZCB3aXRoIHRoZSBgZXhjZXB0aW9uSGFuZGxlcmAgb3B0aW9uLCB0aGVcbi8vIGhhbmRsZXIgd2lsbCBiZSBjYWxsZWQgaWYgYSBjYWxsZWQgY2FsbGJhY2sgdGhyb3dzIGFuIGV4Y2VwdGlvbi5cbi8vIEJ5IGRlZmF1bHQgKGlmIHRoZSBleGNlcHRpb24gaGFuZGxlciBkb2Vzbid0IGl0c2VsZiB0aHJvdyBhblxuLy8gZXhjZXB0aW9uLCBvciBpZiB0aGUgaXRlcmF0b3IgZnVuY3Rpb24gZG9lc24ndCByZXR1cm4gYSBmYWxzeSB2YWx1ZVxuLy8gdG8gdGVybWluYXRlIHRoZSBjYWxsaW5nIG9mIGNhbGxiYWNrcyksIHRoZSByZW1haW5pbmcgY2FsbGJhY2tzXG4vLyB3aWxsIHN0aWxsIGJlIGNhbGxlZC5cbi8vXG4vLyBBbHRlcm5hdGl2ZWx5LCB0aGUgYGRlYnVnUHJpbnRFeGNlcHRpb25zYCBvcHRpb24gY2FuIGJlIHNwZWNpZmllZFxuLy8gYXMgc3RyaW5nIGRlc2NyaWJpbmcgdGhlIGNhbGxiYWNrLiAgT24gYW4gZXhjZXB0aW9uIHRoZSBzdHJpbmcgYW5kXG4vLyB0aGUgZXhjZXB0aW9uIHdpbGwgYmUgcHJpbnRlZCB0byB0aGUgY29uc29sZSBsb2cgd2l0aFxuLy8gYE1ldGVvci5fZGVidWdgLCBhbmQgdGhlIGV4Y2VwdGlvbiBvdGhlcndpc2UgaWdub3JlZC5cbi8vXG4vLyBJZiBhbiBleGNlcHRpb24gaGFuZGxlciBpc24ndCBzcGVjaWZpZWQsIGV4Y2VwdGlvbnMgdGhyb3duIGluIHRoZVxuLy8gY2FsbGJhY2sgd2lsbCBwcm9wYWdhdGUgdXAgdG8gdGhlIGl0ZXJhdG9yIGZ1bmN0aW9uLCBhbmQgd2lsbFxuLy8gdGVybWluYXRlIGNhbGxpbmcgdGhlIHJlbWFpbmluZyBjYWxsYmFja3MgaWYgbm90IGNhdWdodC5cblxuY29uc3QgaGFzT3duID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcblxuZXhwb3J0IGNsYXNzIEhvb2sge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgdGhpcy5uZXh0Q2FsbGJhY2tJZCA9IDA7XG4gICAgdGhpcy5jYWxsYmFja3MgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIC8vIFdoZXRoZXIgdG8gd3JhcCBjYWxsYmFja3Mgd2l0aCBNZXRlb3IuYmluZEVudmlyb25tZW50XG4gICAgdGhpcy5iaW5kRW52aXJvbm1lbnQgPSB0cnVlO1xuICAgIGlmIChvcHRpb25zLmJpbmRFbnZpcm9ubWVudCA9PT0gZmFsc2UpIHtcbiAgICAgIHRoaXMuYmluZEVudmlyb25tZW50ID0gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMuZXhjZXB0aW9uSGFuZGxlcikge1xuICAgICAgdGhpcy5leGNlcHRpb25IYW5kbGVyID0gb3B0aW9ucy5leGNlcHRpb25IYW5kbGVyO1xuICAgIH0gZWxzZSBpZiAob3B0aW9ucy5kZWJ1Z1ByaW50RXhjZXB0aW9ucykge1xuICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLmRlYnVnUHJpbnRFeGNlcHRpb25zICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkhvb2sgb3B0aW9uIGRlYnVnUHJpbnRFeGNlcHRpb25zIHNob3VsZCBiZSBhIHN0cmluZ1wiKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuZXhjZXB0aW9uSGFuZGxlciA9IG9wdGlvbnMuZGVidWdQcmludEV4Y2VwdGlvbnM7XG4gICAgfVxuICB9XG5cbiAgcmVnaXN0ZXIoY2FsbGJhY2spIHtcbiAgICB2YXIgZXhjZXB0aW9uSGFuZGxlciA9IHRoaXMuZXhjZXB0aW9uSGFuZGxlciB8fCBmdW5jdGlvbiAoZXhjZXB0aW9uKSB7XG4gICAgICAvLyBOb3RlOiB0aGlzIHJlbGllcyBvbiB0aGUgdW5kb2N1bWVudGVkIGZhY3QgdGhhdCBpZiBiaW5kRW52aXJvbm1lbnQnc1xuICAgICAgLy8gb25FeGNlcHRpb24gdGhyb3dzLCBhbmQgeW91IGFyZSBpbnZva2luZyB0aGUgY2FsbGJhY2sgZWl0aGVyIGluIHRoZVxuICAgICAgLy8gYnJvd3NlciBvciBmcm9tIHdpdGhpbiBhIEZpYmVyIGluIE5vZGUsIHRoZSBleGNlcHRpb24gaXMgcHJvcGFnYXRlZC5cbiAgICAgIHRocm93IGV4Y2VwdGlvbjtcbiAgICB9O1xuXG4gICAgaWYgKHRoaXMuYmluZEVudmlyb25tZW50KSB7XG4gICAgICBjYWxsYmFjayA9IE1ldGVvci5iaW5kRW52aXJvbm1lbnQoY2FsbGJhY2ssIGV4Y2VwdGlvbkhhbmRsZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjYWxsYmFjayA9IGRvbnRCaW5kRW52aXJvbm1lbnQoY2FsbGJhY2ssIGV4Y2VwdGlvbkhhbmRsZXIpO1xuICAgIH1cblxuICAgIHZhciBpZCA9IHRoaXMubmV4dENhbGxiYWNrSWQrKztcbiAgICB0aGlzLmNhbGxiYWNrc1tpZF0gPSBjYWxsYmFjaztcblxuICAgIHJldHVybiB7XG4gICAgICBjYWxsYmFjayxcbiAgICAgIHN0b3A6ICgpID0+IHtcbiAgICAgICAgZGVsZXRlIHRoaXMuY2FsbGJhY2tzW2lkXTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLy8gRm9yIGVhY2ggcmVnaXN0ZXJlZCBjYWxsYmFjaywgY2FsbCB0aGUgcGFzc2VkIGl0ZXJhdG9yIGZ1bmN0aW9uXG4gIC8vIHdpdGggdGhlIGNhbGxiYWNrLlxuICAvL1xuICAvLyBUaGUgaXRlcmF0b3IgZnVuY3Rpb24gY2FuIGNob29zZSB3aGV0aGVyIG9yIG5vdCB0byBjYWxsIHRoZVxuICAvLyBjYWxsYmFjay4gIChGb3IgZXhhbXBsZSwgaXQgbWlnaHQgbm90IGNhbGwgdGhlIGNhbGxiYWNrIGlmIHRoZVxuICAvLyBvYnNlcnZlZCBvYmplY3QgaGFzIGJlZW4gY2xvc2VkIG9yIHRlcm1pbmF0ZWQpLlxuICAvL1xuICAvLyBUaGUgaXRlcmF0aW9uIGlzIHN0b3BwZWQgaWYgdGhlIGl0ZXJhdG9yIGZ1bmN0aW9uIHJldHVybnMgYSBmYWxzeVxuICAvLyB2YWx1ZSBvciB0aHJvd3MgYW4gZXhjZXB0aW9uLlxuICAvL1xuICBlYWNoKGl0ZXJhdG9yKSB7XG4gICAgLy8gSW52b2tpbmcgYmluZEVudmlyb25tZW50J2QgY2FsbGJhY2tzIG91dHNpZGUgb2YgYSBGaWJlciBpbiBOb2RlIGRvZXNuJ3RcbiAgICAvLyBydW4gdGhlbSB0byBjb21wbGV0aW9uIChhbmQgZXhjZXB0aW9ucyB0aHJvd24gZnJvbSBvbkV4Y2VwdGlvbiBhcmUgbm90XG4gICAgLy8gcHJvcGFnYXRlZCksIHNvIHdlIG5lZWQgdG8gYmUgaW4gYSBGaWJlci5cbiAgICBNZXRlb3IuX25vZGVDb2RlTXVzdEJlSW5GaWJlcigpO1xuXG4gICAgdmFyIGlkcyA9IE9iamVjdC5rZXlzKHRoaXMuY2FsbGJhY2tzKTtcbiAgICBmb3IgKHZhciBpID0gMDsgIGkgPCBpZHMubGVuZ3RoOyAgKytpKSB7XG4gICAgICB2YXIgaWQgPSBpZHNbaV07XG4gICAgICAvLyBjaGVjayB0byBzZWUgaWYgdGhlIGNhbGxiYWNrIHdhcyByZW1vdmVkIGR1cmluZyBpdGVyYXRpb25cbiAgICAgIGlmIChoYXNPd24uY2FsbCh0aGlzLmNhbGxiYWNrcywgaWQpKSB7XG4gICAgICAgIHZhciBjYWxsYmFjayA9IHRoaXMuY2FsbGJhY2tzW2lkXTtcbiAgICAgICAgaWYgKCEgaXRlcmF0b3IoY2FsbGJhY2spKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLy8gQ29waWVkIGZyb20gTWV0ZW9yLmJpbmRFbnZpcm9ubWVudCBhbmQgcmVtb3ZlZCBhbGwgdGhlIGVudiBzdHVmZi5cbmZ1bmN0aW9uIGRvbnRCaW5kRW52aXJvbm1lbnQoZnVuYywgb25FeGNlcHRpb24sIF90aGlzKSB7XG4gIGlmICghb25FeGNlcHRpb24gfHwgdHlwZW9mKG9uRXhjZXB0aW9uKSA9PT0gJ3N0cmluZycpIHtcbiAgICB2YXIgZGVzY3JpcHRpb24gPSBvbkV4Y2VwdGlvbiB8fCBcImNhbGxiYWNrIG9mIGFzeW5jIGZ1bmN0aW9uXCI7XG4gICAgb25FeGNlcHRpb24gPSBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgIE1ldGVvci5fZGVidWcoXG4gICAgICAgIFwiRXhjZXB0aW9uIGluIFwiICsgZGVzY3JpcHRpb24sXG4gICAgICAgIGVycm9yXG4gICAgICApO1xuICAgIH07XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICB0cnkge1xuICAgICAgdmFyIHJldCA9IGZ1bmMuYXBwbHkoX3RoaXMsIGFyZ3MpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIG9uRXhjZXB0aW9uKGUpO1xuICAgIH1cbiAgICByZXR1cm4gcmV0O1xuICB9O1xufVxuIl19
