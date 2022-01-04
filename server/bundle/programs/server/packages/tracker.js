(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var meteorInstall = Package.modules.meteorInstall;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var Tracker, Deps, computation;

var require = meteorInstall({"node_modules":{"meteor":{"tracker":{"tracker.js":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/tracker/tracker.js                                                                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/////////////////////////////////////////////////////
// Package docs at http://docs.meteor.com/#tracker //
/////////////////////////////////////////////////////

/**
 * @namespace Tracker
 * @summary The namespace for Tracker-related methods.
 */
Tracker = {};
/**
 * @namespace Deps
 * @deprecated
 */

Deps = Tracker; // http://docs.meteor.com/#tracker_active

/**
 * @summary True if there is a current computation, meaning that dependencies on reactive data sources will be tracked and potentially cause the current computation to be rerun.
 * @locus Client
 * @type {Boolean}
 */

Tracker.active = false; // http://docs.meteor.com/#tracker_currentcomputation

/**
 * @summary The current computation, or `null` if there isn't one.  The current computation is the [`Tracker.Computation`](#tracker_computation) object created by the innermost active call to `Tracker.autorun`, and it's the computation that gains dependencies when reactive data sources are accessed.
 * @locus Client
 * @type {Tracker.Computation}
 */

Tracker.currentComputation = null;

function setCurrentComputation(c) {
  Tracker.currentComputation = c;
  Tracker.active = !!c;
}

function _debugFunc() {
  // We want this code to work without Meteor, and also without
  // "console" (which is technically non-standard and may be missing
  // on some browser we come across, like it was on IE 7).
  //
  // Lazy evaluation because `Meteor` does not exist right away.(??)
  return typeof Meteor !== "undefined" ? Meteor._debug : typeof console !== "undefined" && console.error ? function () {
    console.error.apply(console, arguments);
  } : function () {};
}

function _maybeSuppressMoreLogs(messagesLength) {
  // Sometimes when running tests, we intentionally suppress logs on expected
  // printed errors. Since the current implementation of _throwOrLog can log
  // multiple separate log messages, suppress all of them if at least one suppress
  // is expected as we still want them to count as one.
  if (typeof Meteor !== "undefined") {
    if (Meteor._suppressed_log_expected()) {
      Meteor._suppress_log(messagesLength - 1);
    }
  }
}

function _throwOrLog(from, e) {
  if (throwFirstError) {
    throw e;
  } else {
    var printArgs = ["Exception from Tracker " + from + " function:"];

    if (e.stack && e.message && e.name) {
      var idx = e.stack.indexOf(e.message);

      if (idx < 0 || idx > e.name.length + 2) {
        // check for "Error: "
        // message is not part of the stack
        var message = e.name + ": " + e.message;
        printArgs.push(message);
      }
    }

    printArgs.push(e.stack);

    _maybeSuppressMoreLogs(printArgs.length);

    for (var i = 0; i < printArgs.length; i++) {
      _debugFunc()(printArgs[i]);
    }
  }
} // Takes a function `f`, and wraps it in a `Meteor._noYieldsAllowed`
// block if we are running on the server. On the client, returns the
// original function (since `Meteor._noYieldsAllowed` is a
// no-op). This has the benefit of not adding an unnecessary stack
// frame on the client.


function withNoYieldsAllowed(f) {
  if (typeof Meteor === 'undefined' || Meteor.isClient) {
    return f;
  } else {
    return function () {
      var args = arguments;

      Meteor._noYieldsAllowed(function () {
        f.apply(null, args);
      });
    };
  }
}

var nextId = 1; // computations whose callbacks we should call at flush time

var pendingComputations = []; // `true` if a Tracker.flush is scheduled, or if we are in Tracker.flush now

var willFlush = false; // `true` if we are in Tracker.flush now

var inFlush = false; // `true` if we are computing a computation now, either first time
// or recompute.  This matches Tracker.active unless we are inside
// Tracker.nonreactive, which nullfies currentComputation even though
// an enclosing computation may still be running.

var inCompute = false; // `true` if the `_throwFirstError` option was passed in to the call
// to Tracker.flush that we are in. When set, throw rather than log the
// first error encountered while flushing. Before throwing the error,
// finish flushing (from a finally block), logging any subsequent
// errors.

var throwFirstError = false;
var afterFlushCallbacks = [];

function requireFlush() {
  if (!willFlush) {
    // We want this code to work without Meteor, see debugFunc above
    if (typeof Meteor !== "undefined") Meteor._setImmediate(Tracker._runFlush);else setTimeout(Tracker._runFlush, 0);
    willFlush = true;
  }
} // Tracker.Computation constructor is visible but private
// (throws an error if you try to call it)


var constructingComputation = false; //
// http://docs.meteor.com/#tracker_computation

/**
 * @summary A Computation object represents code that is repeatedly rerun
 * in response to
 * reactive data changes. Computations don't have return values; they just
 * perform actions, such as rerendering a template on the screen. Computations
 * are created using Tracker.autorun. Use stop to prevent further rerunning of a
 * computation.
 * @instancename computation
 */

Tracker.Computation = class Computation {
  constructor(f, parent, onError) {
    if (!constructingComputation) throw new Error("Tracker.Computation constructor is private; use Tracker.autorun");
    constructingComputation = false; // http://docs.meteor.com/#computation_stopped

    /**
     * @summary True if this computation has been stopped.
     * @locus Client
     * @memberOf Tracker.Computation
     * @instance
     * @name  stopped
     */

    this.stopped = false; // http://docs.meteor.com/#computation_invalidated

    /**
     * @summary True if this computation has been invalidated (and not yet rerun), or if it has been stopped.
     * @locus Client
     * @memberOf Tracker.Computation
     * @instance
     * @name  invalidated
     * @type {Boolean}
     */

    this.invalidated = false; // http://docs.meteor.com/#computation_firstrun

    /**
     * @summary True during the initial run of the computation at the time `Tracker.autorun` is called, and false on subsequent reruns and at other times.
     * @locus Client
     * @memberOf Tracker.Computation
     * @instance
     * @name  firstRun
     * @type {Boolean}
     */

    this.firstRun = true;
    this._id = nextId++;
    this._onInvalidateCallbacks = [];
    this._onStopCallbacks = []; // the plan is at some point to use the parent relation
    // to constrain the order that computations are processed

    this._parent = parent;
    this._func = f;
    this._onError = onError;
    this._recomputing = false;
    var errored = true;

    try {
      this._compute();

      errored = false;
    } finally {
      this.firstRun = false;
      if (errored) this.stop();
    }
  } // http://docs.meteor.com/#computation_oninvalidate

  /**
   * @summary Registers `callback` to run when this computation is next invalidated, or runs it immediately if the computation is already invalidated.  The callback is run exactly once and not upon future invalidations unless `onInvalidate` is called again after the computation becomes valid again.
   * @locus Client
   * @param {Function} callback Function to be called on invalidation. Receives one argument, the computation that was invalidated.
   */


  onInvalidate(f) {
    if (typeof f !== 'function') throw new Error("onInvalidate requires a function");

    if (this.invalidated) {
      Tracker.nonreactive(() => {
        withNoYieldsAllowed(f)(this);
      });
    } else {
      this._onInvalidateCallbacks.push(f);
    }
  }
  /**
   * @summary Registers `callback` to run when this computation is stopped, or runs it immediately if the computation is already stopped.  The callback is run after any `onInvalidate` callbacks.
   * @locus Client
   * @param {Function} callback Function to be called on stop. Receives one argument, the computation that was stopped.
   */


  onStop(f) {
    if (typeof f !== 'function') throw new Error("onStop requires a function");

    if (this.stopped) {
      Tracker.nonreactive(() => {
        withNoYieldsAllowed(f)(this);
      });
    } else {
      this._onStopCallbacks.push(f);
    }
  } // http://docs.meteor.com/#computation_invalidate

  /**
   * @summary Invalidates this computation so that it will be rerun.
   * @locus Client
   */


  invalidate() {
    if (!this.invalidated) {
      // if we're currently in _recompute(), don't enqueue
      // ourselves, since we'll rerun immediately anyway.
      if (!this._recomputing && !this.stopped) {
        requireFlush();
        pendingComputations.push(this);
      }

      this.invalidated = true; // callbacks can't add callbacks, because
      // this.invalidated === true.

      for (var i = 0, f; f = this._onInvalidateCallbacks[i]; i++) {
        Tracker.nonreactive(() => {
          withNoYieldsAllowed(f)(this);
        });
      }

      this._onInvalidateCallbacks = [];
    }
  } // http://docs.meteor.com/#computation_stop

  /**
   * @summary Prevents this computation from rerunning.
   * @locus Client
   */


  stop() {
    if (!this.stopped) {
      this.stopped = true;
      this.invalidate();

      for (var i = 0, f; f = this._onStopCallbacks[i]; i++) {
        Tracker.nonreactive(() => {
          withNoYieldsAllowed(f)(this);
        });
      }

      this._onStopCallbacks = [];
    }
  }

  _compute() {
    this.invalidated = false;
    var previous = Tracker.currentComputation;
    setCurrentComputation(this);
    var previousInCompute = inCompute;
    inCompute = true;

    try {
      withNoYieldsAllowed(this._func)(this);
    } finally {
      setCurrentComputation(previous);
      inCompute = previousInCompute;
    }
  }

  _needsRecompute() {
    return this.invalidated && !this.stopped;
  }

  _recompute() {
    this._recomputing = true;

    try {
      if (this._needsRecompute()) {
        try {
          this._compute();
        } catch (e) {
          if (this._onError) {
            this._onError(e);
          } else {
            _throwOrLog("recompute", e);
          }
        }
      }
    } finally {
      this._recomputing = false;
    }
  }
  /**
   * @summary Process the reactive updates for this computation immediately
   * and ensure that the computation is rerun. The computation is rerun only
   * if it is invalidated.
   * @locus Client
   */


  flush() {
    if (this._recomputing) return;

    this._recompute();
  }
  /**
   * @summary Causes the function inside this computation to run and
   * synchronously process all reactive updtes.
   * @locus Client
   */


  run() {
    this.invalidate();
    this.flush();
  }

}; //
// http://docs.meteor.com/#tracker_dependency

/**
 * @summary A Dependency represents an atomic unit of reactive data that a
 * computation might depend on. Reactive data sources such as Session or
 * Minimongo internally create different Dependency objects for different
 * pieces of data, each of which may be depended on by multiple computations.
 * When the data changes, the computations are invalidated.
 * @class
 * @instanceName dependency
 */

Tracker.Dependency = class Dependency {
  constructor() {
    this._dependentsById = Object.create(null);
  } // http://docs.meteor.com/#dependency_depend
  //
  // Adds `computation` to this set if it is not already
  // present.  Returns true if `computation` is a new member of the set.
  // If no argument, defaults to currentComputation, or does nothing
  // if there is no currentComputation.

  /**
   * @summary Declares that the current computation (or `fromComputation` if given) depends on `dependency`.  The computation will be invalidated the next time `dependency` changes.
    If there is no current computation and `depend()` is called with no arguments, it does nothing and returns false.
    Returns true if the computation is a new dependent of `dependency` rather than an existing one.
   * @locus Client
   * @param {Tracker.Computation} [fromComputation] An optional computation declared to depend on `dependency` instead of the current computation.
   * @returns {Boolean}
   */


  depend(computation) {
    if (!computation) {
      if (!Tracker.active) return false;
      computation = Tracker.currentComputation;
    }

    var id = computation._id;

    if (!(id in this._dependentsById)) {
      this._dependentsById[id] = computation;
      computation.onInvalidate(() => {
        delete this._dependentsById[id];
      });
      return true;
    }

    return false;
  } // http://docs.meteor.com/#dependency_changed

  /**
   * @summary Invalidate all dependent computations immediately and remove them as dependents.
   * @locus Client
   */


  changed() {
    for (var id in this._dependentsById) this._dependentsById[id].invalidate();
  } // http://docs.meteor.com/#dependency_hasdependents

  /**
   * @summary True if this Dependency has one or more dependent Computations, which would be invalidated if this Dependency were to change.
   * @locus Client
   * @returns {Boolean}
   */


  hasDependents() {
    for (var id in this._dependentsById) return true;

    return false;
  }

}; // http://docs.meteor.com/#tracker_flush

/**
 * @summary Process all reactive updates immediately and ensure that all invalidated computations are rerun.
 * @locus Client
 */

Tracker.flush = function (options) {
  Tracker._runFlush({
    finishSynchronously: true,
    throwFirstError: options && options._throwFirstError
  });
};
/**
 * @summary True if we are computing a computation now, either first time or recompute.  This matches Tracker.active unless we are inside Tracker.nonreactive, which nullfies currentComputation even though an enclosing computation may still be running.
 * @locus Client
 * @returns {Boolean}
 */


Tracker.inFlush = function () {
  return inFlush;
}; // Run all pending computations and afterFlush callbacks.  If we were not called
// directly via Tracker.flush, this may return before they're all done to allow
// the event loop to run a little before continuing.


Tracker._runFlush = function (options) {
  // XXX What part of the comment below is still true? (We no longer
  // have Spark)
  //
  // Nested flush could plausibly happen if, say, a flush causes
  // DOM mutation, which causes a "blur" event, which runs an
  // app event handler that calls Tracker.flush.  At the moment
  // Spark blocks event handlers during DOM mutation anyway,
  // because the LiveRange tree isn't valid.  And we don't have
  // any useful notion of a nested flush.
  //
  // https://app.asana.com/0/159908330244/385138233856
  if (Tracker.inFlush()) throw new Error("Can't call Tracker.flush while flushing");
  if (inCompute) throw new Error("Can't flush inside Tracker.autorun");
  options = options || {};
  inFlush = true;
  willFlush = true;
  throwFirstError = !!options.throwFirstError;
  var recomputedCount = 0;
  var finishedTry = false;

  try {
    while (pendingComputations.length || afterFlushCallbacks.length) {
      // recompute all pending computations
      while (pendingComputations.length) {
        var comp = pendingComputations.shift();

        comp._recompute();

        if (comp._needsRecompute()) {
          pendingComputations.unshift(comp);
        }

        if (!options.finishSynchronously && ++recomputedCount > 1000) {
          finishedTry = true;
          return;
        }
      }

      if (afterFlushCallbacks.length) {
        // call one afterFlush callback, which may
        // invalidate more computations
        var func = afterFlushCallbacks.shift();

        try {
          func();
        } catch (e) {
          _throwOrLog("afterFlush", e);
        }
      }
    }

    finishedTry = true;
  } finally {
    if (!finishedTry) {
      // we're erroring due to throwFirstError being true.
      inFlush = false; // needed before calling `Tracker.flush()` again
      // finish flushing

      Tracker._runFlush({
        finishSynchronously: options.finishSynchronously,
        throwFirstError: false
      });
    }

    willFlush = false;
    inFlush = false;

    if (pendingComputations.length || afterFlushCallbacks.length) {
      // We're yielding because we ran a bunch of computations and we aren't
      // required to finish synchronously, so we'd like to give the event loop a
      // chance. We should flush again soon.
      if (options.finishSynchronously) {
        throw new Error("still have more to do?"); // shouldn't happen
      }

      setTimeout(requireFlush, 10);
    }
  }
}; // http://docs.meteor.com/#tracker_autorun
//
// Run f(). Record its dependencies. Rerun it whenever the
// dependencies change.
//
// Returns a new Computation, which is also passed to f.
//
// Links the computation to the current computation
// so that it is stopped if the current computation is invalidated.

/**
 * @callback Tracker.ComputationFunction
 * @param {Tracker.Computation}
 */

/**
 * @summary Run a function now and rerun it later whenever its dependencies
 * change. Returns a Computation object that can be used to stop or observe the
 * rerunning.
 * @locus Client
 * @param {Tracker.ComputationFunction} runFunc The function to run. It receives
 * one argument: the Computation object that will be returned.
 * @param {Object} [options]
 * @param {Function} options.onError Optional. The function to run when an error
 * happens in the Computation. The only argument it receives is the Error
 * thrown. Defaults to the error being logged to the console.
 * @returns {Tracker.Computation}
 */


Tracker.autorun = function (f, options) {
  if (typeof f !== 'function') throw new Error('Tracker.autorun requires a function argument');
  options = options || {};
  constructingComputation = true;
  var c = new Tracker.Computation(f, Tracker.currentComputation, options.onError);
  if (Tracker.active) Tracker.onInvalidate(function () {
    c.stop();
  });
  return c;
}; // http://docs.meteor.com/#tracker_nonreactive
//
// Run `f` with no current computation, returning the return value
// of `f`.  Used to turn off reactivity for the duration of `f`,
// so that reactive data sources accessed by `f` will not result in any
// computations being invalidated.

/**
 * @summary Run a function without tracking dependencies.
 * @locus Client
 * @param {Function} func A function to call immediately.
 */


Tracker.nonreactive = function (f) {
  var previous = Tracker.currentComputation;
  setCurrentComputation(null);

  try {
    return f();
  } finally {
    setCurrentComputation(previous);
  }
}; // http://docs.meteor.com/#tracker_oninvalidate

/**
 * @summary Registers a new [`onInvalidate`](#computation_oninvalidate) callback on the current computation (which must exist), to be called immediately when the current computation is invalidated or stopped.
 * @locus Client
 * @param {Function} callback A callback function that will be invoked as `func(c)`, where `c` is the computation on which the callback is registered.
 */


Tracker.onInvalidate = function (f) {
  if (!Tracker.active) throw new Error("Tracker.onInvalidate requires a currentComputation");
  Tracker.currentComputation.onInvalidate(f);
}; // http://docs.meteor.com/#tracker_afterflush

/**
 * @summary Schedules a function to be called during the next flush, or later in the current flush if one is in progress, after all invalidated computations have been rerun.  The function will be run once and not on subsequent flushes unless `afterFlush` is called again.
 * @locus Client
 * @param {Function} callback A function to call at flush time.
 */


Tracker.afterFlush = function (f) {
  afterFlushCallbacks.push(f);
  requireFlush();
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

require("/node_modules/meteor/tracker/tracker.js");

/* Exports */
Package._define("tracker", {
  Tracker: Tracker,
  Deps: Deps
});

})();

//# sourceURL=meteor://💻app/packages/tracker.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvdHJhY2tlci90cmFja2VyLmpzIl0sIm5hbWVzIjpbIlRyYWNrZXIiLCJEZXBzIiwiYWN0aXZlIiwiY3VycmVudENvbXB1dGF0aW9uIiwic2V0Q3VycmVudENvbXB1dGF0aW9uIiwiYyIsIl9kZWJ1Z0Z1bmMiLCJNZXRlb3IiLCJfZGVidWciLCJjb25zb2xlIiwiZXJyb3IiLCJhcHBseSIsImFyZ3VtZW50cyIsIl9tYXliZVN1cHByZXNzTW9yZUxvZ3MiLCJtZXNzYWdlc0xlbmd0aCIsIl9zdXBwcmVzc2VkX2xvZ19leHBlY3RlZCIsIl9zdXBwcmVzc19sb2ciLCJfdGhyb3dPckxvZyIsImZyb20iLCJlIiwidGhyb3dGaXJzdEVycm9yIiwicHJpbnRBcmdzIiwic3RhY2siLCJtZXNzYWdlIiwibmFtZSIsImlkeCIsImluZGV4T2YiLCJsZW5ndGgiLCJwdXNoIiwiaSIsIndpdGhOb1lpZWxkc0FsbG93ZWQiLCJmIiwiaXNDbGllbnQiLCJhcmdzIiwiX25vWWllbGRzQWxsb3dlZCIsIm5leHRJZCIsInBlbmRpbmdDb21wdXRhdGlvbnMiLCJ3aWxsRmx1c2giLCJpbkZsdXNoIiwiaW5Db21wdXRlIiwiYWZ0ZXJGbHVzaENhbGxiYWNrcyIsInJlcXVpcmVGbHVzaCIsIl9zZXRJbW1lZGlhdGUiLCJfcnVuRmx1c2giLCJzZXRUaW1lb3V0IiwiY29uc3RydWN0aW5nQ29tcHV0YXRpb24iLCJDb21wdXRhdGlvbiIsImNvbnN0cnVjdG9yIiwicGFyZW50Iiwib25FcnJvciIsIkVycm9yIiwic3RvcHBlZCIsImludmFsaWRhdGVkIiwiZmlyc3RSdW4iLCJfaWQiLCJfb25JbnZhbGlkYXRlQ2FsbGJhY2tzIiwiX29uU3RvcENhbGxiYWNrcyIsIl9wYXJlbnQiLCJfZnVuYyIsIl9vbkVycm9yIiwiX3JlY29tcHV0aW5nIiwiZXJyb3JlZCIsIl9jb21wdXRlIiwic3RvcCIsIm9uSW52YWxpZGF0ZSIsIm5vbnJlYWN0aXZlIiwib25TdG9wIiwiaW52YWxpZGF0ZSIsInByZXZpb3VzIiwicHJldmlvdXNJbkNvbXB1dGUiLCJfbmVlZHNSZWNvbXB1dGUiLCJfcmVjb21wdXRlIiwiZmx1c2giLCJydW4iLCJEZXBlbmRlbmN5IiwiX2RlcGVuZGVudHNCeUlkIiwiT2JqZWN0IiwiY3JlYXRlIiwiZGVwZW5kIiwiY29tcHV0YXRpb24iLCJpZCIsImNoYW5nZWQiLCJoYXNEZXBlbmRlbnRzIiwib3B0aW9ucyIsImZpbmlzaFN5bmNocm9ub3VzbHkiLCJfdGhyb3dGaXJzdEVycm9yIiwicmVjb21wdXRlZENvdW50IiwiZmluaXNoZWRUcnkiLCJjb21wIiwic2hpZnQiLCJ1bnNoaWZ0IiwiZnVuYyIsImF1dG9ydW4iLCJhZnRlckZsdXNoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7QUFJQUEsT0FBTyxHQUFHLEVBQVY7QUFFQTs7Ozs7QUFJQUMsSUFBSSxHQUFHRCxPQUFQLEMsQ0FFQTs7QUFFQTs7Ozs7O0FBS0FBLE9BQU8sQ0FBQ0UsTUFBUixHQUFpQixLQUFqQixDLENBRUE7O0FBRUE7Ozs7OztBQUtBRixPQUFPLENBQUNHLGtCQUFSLEdBQTZCLElBQTdCOztBQUVBLFNBQVNDLHFCQUFULENBQStCQyxDQUEvQixFQUFrQztBQUNoQ0wsU0FBTyxDQUFDRyxrQkFBUixHQUE2QkUsQ0FBN0I7QUFDQUwsU0FBTyxDQUFDRSxNQUFSLEdBQWlCLENBQUMsQ0FBRUcsQ0FBcEI7QUFDRDs7QUFFRCxTQUFTQyxVQUFULEdBQXNCO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFRLE9BQU9DLE1BQVAsS0FBa0IsV0FBbEIsR0FBZ0NBLE1BQU0sQ0FBQ0MsTUFBdkMsR0FDRSxPQUFPQyxPQUFQLEtBQW1CLFdBQXBCLElBQW9DQSxPQUFPLENBQUNDLEtBQTVDLEdBQ0EsWUFBWTtBQUFFRCxXQUFPLENBQUNDLEtBQVIsQ0FBY0MsS0FBZCxDQUFvQkYsT0FBcEIsRUFBNkJHLFNB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RCxDQWhCRCxDLENBa0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztBQUtBTCxPQUFPLENBQUNpRSxXQUFSLEdBQXNCLFVBQVVsQyxDQUFWLEVBQWE7QUFDakMsTUFBSXFDLFFBQVEsR0FBR3BFLE9BQU8sQ0FBQ0csa0JBQXZCO0FBQ0FDLHVCQUFxQixDQUFDLElBQUQsQ0FBckI7O0FBQ0EsTUFBSTtBQUNGLFdBQU8yQixDQUFDLEVBQVI7QUFDRCxHQUZELFNBRVU7QUFDUjNCLHlCQUFxQixDQUFDZ0UsUUFBRCxDQUFyQjtBQUNEO0FBQ0YsQ0FSRCxDLENBVUE7O0FBRUE7Ozs7Ozs7QUFLQXBFLE9BQU8sQ0FBQ2dFLFlBQVIsR0FBdUIsVUFBVWpDLENBQVYsRUFBYTtBQUNsQyxNQUFJLENBQUUvQixPQUFPLENBQUNFLE1BQWQsRUFDRSxNQUFNLElBQUlnRCxLQUFKLENBQVUsb0RBQVYsQ0FBTjtBQUVGbEQsU0FBTyxDQUFDRyxrQkFBUixDQUEyQjZELFlBQTNCLENBQXdDakMsQ0FBeEM7QUFDRCxDQUxELEMsQ0FPQTs7QUFFQTs7Ozs7OztBQUtBL0IsT0FBTyxDQUFDNkYsVUFBUixHQUFxQixVQUFVOUQsQ0FBVixFQUFhO0FBQ2hDUyxxQkFBbUIsQ0FBQ1osSUFBcEIsQ0FBeUJHLENBQXpCO0FBQ0FVLGNBQVk7QUFDYixDQUhELEMiLCJmaWxlIjoiL3BhY2thZ2VzL3RyYWNrZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gUGFja2FnZSBkb2NzIGF0IGh0dHA6Ly9kb2NzLm1ldGVvci5jb20vI3RyYWNrZXIgLy9cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbi8qKlxuICogQG5hbWVzcGFjZSBUcmFja2VyXG4gKiBAc3VtbWFyeSBUaGUgbmFtZXNwYWNlIGZvciBUcmFja2VyLXJlbGF0ZWQgbWV0aG9kcy5cbiAqL1xuVHJhY2tlciA9IHt9O1xuXG4vKipcbiAqIEBuYW1lc3BhY2UgRGVwc1xuICogQGRlcHJlY2F0ZWRcbiAqL1xuRGVwcyA9IFRyYWNrZXI7XG5cbi8vIGh0dHA6Ly9kb2NzLm1ldGVvci5jb20vI3RyYWNrZXJfYWN0aXZlXG5cbi8qKlxuICogQHN1bW1hcnkgVHJ1ZSBpZiB0aGVyZSBpcyBhIGN1cnJlbnQgY29tcHV0YXRpb24sIG1lYW5pbmcgdGhhdCBkZXBlbmRlbmNpZXMgb24gcmVhY3RpdmUgZGF0YSBzb3VyY2VzIHdpbGwgYmUgdHJhY2tlZCBhbmQgcG90ZW50aWFsbHkgY2F1c2UgdGhlIGN1cnJlbnQgY29tcHV0YXRpb24gdG8gYmUgcmVydW4uXG4gKiBAbG9jdXMgQ2xpZW50XG4gKiBAdHlwZSB7Qm9vbGVhbn1cbiAqL1xuVHJhY2tlci5hY3RpdmUgPSBmYWxzZTtcblxuLy8gaHR0cDovL2RvY3MubWV0ZW9yLmNvbS8jdHJhY2tlcl9jdXJyZW50Y29tcHV0YXRpb25cblxuLyoqXG4gKiBAc3VtbWFyeSBUaGUgY3VycmVudCBjb21wdXRhdGlvbiwgb3IgYG51bGxgIGlmIHRoZXJlIGlzbid0IG9uZS4gIFRoZSBjdXJyZW50IGNvbXB1dGF0aW9uIGlzIHRoZSBbYFRyYWNrZXIuQ29tcHV0YXRpb25gXSgjdHJhY2tlcl9jb21wdXRhdGlvbikgb2JqZWN0IGNyZWF0ZWQgYnkgdGhlIGlubmVybW9zdCBhY3RpdmUgY2FsbCB0byBgVHJhY2tlci5hdXRvcnVuYCwgYW5kIGl0J3MgdGhlIGNvbXB1dGF0aW9uIHRoYXQgZ2FpbnMgZGVwZW5kZW5jaWVzIHdoZW4gcmVhY3RpdmUgZGF0YSBzb3VyY2VzIGFyZSBhY2Nlc3NlZC5cbiAqIEBsb2N1cyBDbGllbnRcbiAqIEB0eXBlIHtUcmFja2VyLkNvbXB1dGF0aW9ufVxuICovXG5UcmFja2VyLmN1cnJlbnRDb21wdXRhdGlvbiA9IG51bGw7XG5cbmZ1bmN0aW9uIHNldEN1cnJlbnRDb21wdXRhdGlvbihjKSB7XG4gIFRyYWNrZXIuY3VycmVudENvbXB1dGF0aW9uID0gYztcbiAgVHJhY2tlci5hY3RpdmUgPSAhISBjO1xufVxuXG5mdW5jdGlvbiBfZGVidWdGdW5jKCkge1xuICAvLyBXZSB3YW50IHRoaXMgY29kZSB0byB3b3JrIHdpdGhvdXQgTWV0ZW9yLCBhbmQgYWxzbyB3aXRob3V0XG4gIC8vIFwiY29uc29sZVwiICh3aGljaCBpcyB0ZWNobmljYWxseSBub24tc3RhbmRhcmQgYW5kIG1heSBiZSBtaXNzaW5nXG4gIC8vIG9uIHNvbWUgYnJvd3NlciB3ZSBjb21lIGFjcm9zcywgbGlrZSBpdCB3YXMgb24gSUUgNykuXG4gIC8vXG4gIC8vIExhenkgZXZhbHVhdGlvbiBiZWNhdXNlIGBNZXRlb3JgIGRvZXMgbm90IGV4aXN0IHJpZ2h0IGF3YXkuKD8/KVxuICByZXR1cm4gKHR5cGVvZiBNZXRlb3IgIT09IFwidW5kZWZpbmVkXCIgPyBNZXRlb3IuX2RlYnVnIDpcbiAgICAgICAgICAoKHR5cGVvZiBjb25zb2xlICE9PSBcInVuZGVmaW5lZFwiKSAmJiBjb25zb2xlLmVycm9yID9cbiAgICAgICAgICAgZnVuY3Rpb24gKCkgeyBjb25zb2xlLmVycm9yLmFwcGx5KGNvbnNvbGUsIGFyZ3VtZW50cyk7IH0gOlxuICAgICAgICAgICBmdW5jdGlvbiAoKSB7fSkpO1xufVxuXG5mdW5jdGlvbiBfbWF5YmVTdXBwcmVzc01vcmVMb2dzKG1lc3NhZ2VzTGVuZ3RoKSB7XG4gIC8vIFNvbWV0aW1lcyB3aGVuIHJ1bm5pbmcgdGVzdHMsIHdlIGludGVudGlvbmFsbHkgc3VwcHJlc3MgbG9ncyBvbiBleHBlY3RlZFxuICAvLyBwcmludGVkIGVycm9ycy4gU2luY2UgdGhlIGN1cnJlbnQgaW1wbGVtZW50YXRpb24gb2YgX3Rocm93T3JMb2cgY2FuIGxvZ1xuICAvLyBtdWx0aXBsZSBzZXBhcmF0ZSBsb2cgbWVzc2FnZXMsIHN1cHByZXNzIGFsbCBvZiB0aGVtIGlmIGF0IGxlYXN0IG9uZSBzdXBwcmVzc1xuICAvLyBpcyBleHBlY3RlZCBhcyB3ZSBzdGlsbCB3YW50IHRoZW0gdG8gY291bnQgYXMgb25lLlxuICBpZiAodHlwZW9mIE1ldGVvciAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGlmIChNZXRlb3IuX3N1cHByZXNzZWRfbG9nX2V4cGVjdGVkKCkpIHtcbiAgICAgIE1ldGVvci5fc3VwcHJlc3NfbG9nKG1lc3NhZ2VzTGVuZ3RoIC0gMSk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIF90aHJvd09yTG9nKGZyb20sIGUpIHtcbiAgaWYgKHRocm93Rmlyc3RFcnJvcikge1xuICAgIHRocm93IGU7XG4gIH0gZWxzZSB7XG4gICAgdmFyIHByaW50QXJncyA9IFtcIkV4Y2VwdGlvbiBmcm9tIFRyYWNrZXIgXCIgKyBmcm9tICsgXCIgZnVuY3Rpb246XCJdO1xuICAgIGlmIChlLnN0YWNrICYmIGUubWVzc2FnZSAmJiBlLm5hbWUpIHtcbiAgICAgIHZhciBpZHggPSBlLnN0YWNrLmluZGV4T2YoZS5tZXNzYWdlKTtcbiAgICAgIGlmIChpZHggPCAwIHx8IGlkeCA+IGUubmFtZS5sZW5ndGggKyAyKSB7IC8vIGNoZWNrIGZvciBcIkVycm9yOiBcIlxuICAgICAgICAvLyBtZXNzYWdlIGlzIG5vdCBwYXJ0IG9mIHRoZSBzdGFja1xuICAgICAgICB2YXIgbWVzc2FnZSA9IGUubmFtZSArIFwiOiBcIiArIGUubWVzc2FnZTtcbiAgICAgICAgcHJpbnRBcmdzLnB1c2gobWVzc2FnZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHByaW50QXJncy5wdXNoKGUuc3RhY2spO1xuICAgIF9tYXliZVN1cHByZXNzTW9yZUxvZ3MocHJpbnRBcmdzLmxlbmd0aCk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByaW50QXJncy5sZW5ndGg7IGkrKykge1xuICAgICAgX2RlYnVnRnVuYygpKHByaW50QXJnc1tpXSk7XG4gICAgfVxuICB9XG59XG5cbi8vIFRha2VzIGEgZnVuY3Rpb24gYGZgLCBhbmQgd3JhcHMgaXQgaW4gYSBgTWV0ZW9yLl9ub1lpZWxkc0FsbG93ZWRgXG4vLyBibG9jayBpZiB3ZSBhcmUgcnVubmluZyBvbiB0aGUgc2VydmVyLiBPbiB0aGUgY2xpZW50LCByZXR1cm5zIHRoZVxuLy8gb3JpZ2luYWwgZnVuY3Rpb24gKHNpbmNlIGBNZXRlb3IuX25vWWllbGRzQWxsb3dlZGAgaXMgYVxuLy8gbm8tb3ApLiBUaGlzIGhhcyB0aGUgYmVuZWZpdCBvZiBub3QgYWRkaW5nIGFuIHVubmVjZXNzYXJ5IHN0YWNrXG4vLyBmcmFtZSBvbiB0aGUgY2xpZW50LlxuZnVuY3Rpb24gd2l0aE5vWWllbGRzQWxsb3dlZChmKSB7XG4gIGlmICgodHlwZW9mIE1ldGVvciA9PT0gJ3VuZGVmaW5lZCcpIHx8IE1ldGVvci5pc0NsaWVudCkge1xuICAgIHJldHVybiBmO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgIE1ldGVvci5fbm9ZaWVsZHNBbGxvd2VkKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZi5hcHBseShudWxsLCBhcmdzKTtcbiAgICAgIH0pO1xuICAgIH07XG4gIH1cbn1cblxudmFyIG5leHRJZCA9IDE7XG4vLyBjb21wdXRhdGlvbnMgd2hvc2UgY2FsbGJhY2tzIHdlIHNob3VsZCBjYWxsIGF0IGZsdXNoIHRpbWVcbnZhciBwZW5kaW5nQ29tcHV0YXRpb25zID0gW107XG4vLyBgdHJ1ZWAgaWYgYSBUcmFja2VyLmZsdXNoIGlzIHNjaGVkdWxlZCwgb3IgaWYgd2UgYXJlIGluIFRyYWNrZXIuZmx1c2ggbm93XG52YXIgd2lsbEZsdXNoID0gZmFsc2U7XG4vLyBgdHJ1ZWAgaWYgd2UgYXJlIGluIFRyYWNrZXIuZmx1c2ggbm93XG52YXIgaW5GbHVzaCA9IGZhbHNlO1xuLy8gYHRydWVgIGlmIHdlIGFyZSBjb21wdXRpbmcgYSBjb21wdXRhdGlvbiBub3csIGVpdGhlciBmaXJzdCB0aW1lXG4vLyBvciByZWNvbXB1dGUuICBUaGlzIG1hdGNoZXMgVHJhY2tlci5hY3RpdmUgdW5sZXNzIHdlIGFyZSBpbnNpZGVcbi8vIFRyYWNrZXIubm9ucmVhY3RpdmUsIHdoaWNoIG51bGxmaWVzIGN1cnJlbnRDb21wdXRhdGlvbiBldmVuIHRob3VnaFxuLy8gYW4gZW5jbG9zaW5nIGNvbXB1dGF0aW9uIG1heSBzdGlsbCBiZSBydW5uaW5nLlxudmFyIGluQ29tcHV0ZSA9IGZhbHNlO1xuLy8gYHRydWVgIGlmIHRoZSBgX3Rocm93Rmlyc3RFcnJvcmAgb3B0aW9uIHdhcyBwYXNzZWQgaW4gdG8gdGhlIGNhbGxcbi8vIHRvIFRyYWNrZXIuZmx1c2ggdGhhdCB3ZSBhcmUgaW4uIFdoZW4gc2V0LCB0aHJvdyByYXRoZXIgdGhhbiBsb2cgdGhlXG4vLyBmaXJzdCBlcnJvciBlbmNvdW50ZXJlZCB3aGlsZSBmbHVzaGluZy4gQmVmb3JlIHRocm93aW5nIHRoZSBlcnJvcixcbi8vIGZpbmlzaCBmbHVzaGluZyAoZnJvbSBhIGZpbmFsbHkgYmxvY2spLCBsb2dnaW5nIGFueSBzdWJzZXF1ZW50XG4vLyBlcnJvcnMuXG52YXIgdGhyb3dGaXJzdEVycm9yID0gZmFsc2U7XG5cbnZhciBhZnRlckZsdXNoQ2FsbGJhY2tzID0gW107XG5cbmZ1bmN0aW9uIHJlcXVpcmVGbHVzaCgpIHtcbiAgaWYgKCEgd2lsbEZsdXNoKSB7XG4gICAgLy8gV2Ugd2FudCB0aGlzIGNvZGUgdG8gd29yayB3aXRob3V0IE1ldGVvciwgc2VlIGRlYnVnRnVuYyBhYm92ZVxuICAgIGlmICh0eXBlb2YgTWV0ZW9yICE9PSBcInVuZGVmaW5lZFwiKVxuICAgICAgTWV0ZW9yLl9zZXRJbW1lZGlhdGUoVHJhY2tlci5fcnVuRmx1c2gpO1xuICAgIGVsc2VcbiAgICAgIHNldFRpbWVvdXQoVHJhY2tlci5fcnVuRmx1c2gsIDApO1xuICAgIHdpbGxGbHVzaCA9IHRydWU7XG4gIH1cbn1cblxuLy8gVHJhY2tlci5Db21wdXRhdGlvbiBjb25zdHJ1Y3RvciBpcyB2aXNpYmxlIGJ1dCBwcml2YXRlXG4vLyAodGhyb3dzIGFuIGVycm9yIGlmIHlvdSB0cnkgdG8gY2FsbCBpdClcbnZhciBjb25zdHJ1Y3RpbmdDb21wdXRhdGlvbiA9IGZhbHNlO1xuXG4vL1xuLy8gaHR0cDovL2RvY3MubWV0ZW9yLmNvbS8jdHJhY2tlcl9jb21wdXRhdGlvblxuXG4vKipcbiAqIEBzdW1tYXJ5IEEgQ29tcHV0YXRpb24gb2JqZWN0IHJlcHJlc2VudHMgY29kZSB0aGF0IGlzIHJlcGVhdGVkbHkgcmVydW5cbiAqIGluIHJlc3BvbnNlIHRvXG4gKiByZWFjdGl2ZSBkYXRhIGNoYW5nZXMuIENvbXB1dGF0aW9ucyBkb24ndCBoYXZlIHJldHVybiB2YWx1ZXM7IHRoZXkganVzdFxuICogcGVyZm9ybSBhY3Rpb25zLCBzdWNoIGFzIHJlcmVuZGVyaW5nIGEgdGVtcGxhdGUgb24gdGhlIHNjcmVlbi4gQ29tcHV0YXRpb25zXG4gKiBhcmUgY3JlYXRlZCB1c2luZyBUcmFja2VyLmF1dG9ydW4uIFVzZSBzdG9wIHRvIHByZXZlbnQgZnVydGhlciByZXJ1bm5pbmcgb2YgYVxuICogY29tcHV0YXRpb24uXG4gKiBAaW5zdGFuY2VuYW1lIGNvbXB1dGF0aW9uXG4gKi9cblRyYWNrZXIuQ29tcHV0YXRpb24gPSBjbGFzcyBDb21wdXRhdGlvbiB7XG4gIGNvbnN0cnVjdG9yKGYsIHBhcmVudCwgb25FcnJvcikge1xuICAgIGlmICghIGNvbnN0cnVjdGluZ0NvbXB1dGF0aW9uKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBcIlRyYWNrZXIuQ29tcHV0YXRpb24gY29uc3RydWN0b3IgaXMgcHJpdmF0ZTsgdXNlIFRyYWNrZXIuYXV0b3J1blwiKTtcbiAgICBjb25zdHJ1Y3RpbmdDb21wdXRhdGlvbiA9IGZhbHNlO1xuXG4gICAgLy8gaHR0cDovL2RvY3MubWV0ZW9yLmNvbS8jY29tcHV0YXRpb25fc3RvcHBlZFxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgVHJ1ZSBpZiB0aGlzIGNvbXB1dGF0aW9uIGhhcyBiZWVuIHN0b3BwZWQuXG4gICAgICogQGxvY3VzIENsaWVudFxuICAgICAqIEBtZW1iZXJPZiBUcmFja2VyLkNvbXB1dGF0aW9uXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG5hbWUgIHN0b3BwZWRcbiAgICAgKi9cbiAgICB0aGlzLnN0b3BwZWQgPSBmYWxzZTtcblxuICAgIC8vIGh0dHA6Ly9kb2NzLm1ldGVvci5jb20vI2NvbXB1dGF0aW9uX2ludmFsaWRhdGVkXG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBUcnVlIGlmIHRoaXMgY29tcHV0YXRpb24gaGFzIGJlZW4gaW52YWxpZGF0ZWQgKGFuZCBub3QgeWV0IHJlcnVuKSwgb3IgaWYgaXQgaGFzIGJlZW4gc3RvcHBlZC5cbiAgICAgKiBAbG9jdXMgQ2xpZW50XG4gICAgICogQG1lbWJlck9mIFRyYWNrZXIuQ29tcHV0YXRpb25cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbmFtZSAgaW52YWxpZGF0ZWRcbiAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICB0aGlzLmludmFsaWRhdGVkID0gZmFsc2U7XG5cbiAgICAvLyBodHRwOi8vZG9jcy5tZXRlb3IuY29tLyNjb21wdXRhdGlvbl9maXJzdHJ1blxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgVHJ1ZSBkdXJpbmcgdGhlIGluaXRpYWwgcnVuIG9mIHRoZSBjb21wdXRhdGlvbiBhdCB0aGUgdGltZSBgVHJhY2tlci5hdXRvcnVuYCBpcyBjYWxsZWQsIGFuZCBmYWxzZSBvbiBzdWJzZXF1ZW50IHJlcnVucyBhbmQgYXQgb3RoZXIgdGltZXMuXG4gICAgICogQGxvY3VzIENsaWVudFxuICAgICAqIEBtZW1iZXJPZiBUcmFja2VyLkNvbXB1dGF0aW9uXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG5hbWUgIGZpcnN0UnVuXG4gICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICovXG4gICAgdGhpcy5maXJzdFJ1biA9IHRydWU7XG5cbiAgICB0aGlzLl9pZCA9IG5leHRJZCsrO1xuICAgIHRoaXMuX29uSW52YWxpZGF0ZUNhbGxiYWNrcyA9IFtdO1xuICAgIHRoaXMuX29uU3RvcENhbGxiYWNrcyA9IFtdO1xuICAgIC8vIHRoZSBwbGFuIGlzIGF0IHNvbWUgcG9pbnQgdG8gdXNlIHRoZSBwYXJlbnQgcmVsYXRpb25cbiAgICAvLyB0byBjb25zdHJhaW4gdGhlIG9yZGVyIHRoYXQgY29tcHV0YXRpb25zIGFyZSBwcm9jZXNzZWRcbiAgICB0aGlzLl9wYXJlbnQgPSBwYXJlbnQ7XG4gICAgdGhpcy5fZnVuYyA9IGY7XG4gICAgdGhpcy5fb25FcnJvciA9IG9uRXJyb3I7XG4gICAgdGhpcy5fcmVjb21wdXRpbmcgPSBmYWxzZTtcblxuICAgIHZhciBlcnJvcmVkID0gdHJ1ZTtcbiAgICB0cnkge1xuICAgICAgdGhpcy5fY29tcHV0ZSgpO1xuICAgICAgZXJyb3JlZCA9IGZhbHNlO1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0aGlzLmZpcnN0UnVuID0gZmFsc2U7XG4gICAgICBpZiAoZXJyb3JlZClcbiAgICAgICAgdGhpcy5zdG9wKCk7XG4gICAgfVxuICB9XG5cbiAgLy8gaHR0cDovL2RvY3MubWV0ZW9yLmNvbS8jY29tcHV0YXRpb25fb25pbnZhbGlkYXRlXG5cbiAgLyoqXG4gICAqIEBzdW1tYXJ5IFJlZ2lzdGVycyBgY2FsbGJhY2tgIHRvIHJ1biB3aGVuIHRoaXMgY29tcHV0YXRpb24gaXMgbmV4dCBpbnZhbGlkYXRlZCwgb3IgcnVucyBpdCBpbW1lZGlhdGVseSBpZiB0aGUgY29tcHV0YXRpb24gaXMgYWxyZWFkeSBpbnZhbGlkYXRlZC4gIFRoZSBjYWxsYmFjayBpcyBydW4gZXhhY3RseSBvbmNlIGFuZCBub3QgdXBvbiBmdXR1cmUgaW52YWxpZGF0aW9ucyB1bmxlc3MgYG9uSW52YWxpZGF0ZWAgaXMgY2FsbGVkIGFnYWluIGFmdGVyIHRoZSBjb21wdXRhdGlvbiBiZWNvbWVzIHZhbGlkIGFnYWluLlxuICAgKiBAbG9jdXMgQ2xpZW50XG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIEZ1bmN0aW9uIHRvIGJlIGNhbGxlZCBvbiBpbnZhbGlkYXRpb24uIFJlY2VpdmVzIG9uZSBhcmd1bWVudCwgdGhlIGNvbXB1dGF0aW9uIHRoYXQgd2FzIGludmFsaWRhdGVkLlxuICAgKi9cbiAgb25JbnZhbGlkYXRlKGYpIHtcbiAgICBpZiAodHlwZW9mIGYgIT09ICdmdW5jdGlvbicpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJvbkludmFsaWRhdGUgcmVxdWlyZXMgYSBmdW5jdGlvblwiKTtcblxuICAgIGlmICh0aGlzLmludmFsaWRhdGVkKSB7XG4gICAgICBUcmFja2VyLm5vbnJlYWN0aXZlKCgpID0+IHtcbiAgICAgICAgd2l0aE5vWWllbGRzQWxsb3dlZChmKSh0aGlzKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9vbkludmFsaWRhdGVDYWxsYmFja3MucHVzaChmKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHN1bW1hcnkgUmVnaXN0ZXJzIGBjYWxsYmFja2AgdG8gcnVuIHdoZW4gdGhpcyBjb21wdXRhdGlvbiBpcyBzdG9wcGVkLCBvciBydW5zIGl0IGltbWVkaWF0ZWx5IGlmIHRoZSBjb21wdXRhdGlvbiBpcyBhbHJlYWR5IHN0b3BwZWQuICBUaGUgY2FsbGJhY2sgaXMgcnVuIGFmdGVyIGFueSBgb25JbnZhbGlkYXRlYCBjYWxsYmFja3MuXG4gICAqIEBsb2N1cyBDbGllbnRcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgRnVuY3Rpb24gdG8gYmUgY2FsbGVkIG9uIHN0b3AuIFJlY2VpdmVzIG9uZSBhcmd1bWVudCwgdGhlIGNvbXB1dGF0aW9uIHRoYXQgd2FzIHN0b3BwZWQuXG4gICAqL1xuICBvblN0b3AoZikge1xuICAgIGlmICh0eXBlb2YgZiAhPT0gJ2Z1bmN0aW9uJylcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIm9uU3RvcCByZXF1aXJlcyBhIGZ1bmN0aW9uXCIpO1xuXG4gICAgaWYgKHRoaXMuc3RvcHBlZCkge1xuICAgICAgVHJhY2tlci5ub25yZWFjdGl2ZSgoKSA9PiB7XG4gICAgICAgIHdpdGhOb1lpZWxkc0FsbG93ZWQoZikodGhpcyk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fb25TdG9wQ2FsbGJhY2tzLnB1c2goZik7XG4gICAgfVxuICB9XG5cbiAgLy8gaHR0cDovL2RvY3MubWV0ZW9yLmNvbS8jY29tcHV0YXRpb25faW52YWxpZGF0ZVxuXG4gIC8qKlxuICAgKiBAc3VtbWFyeSBJbnZhbGlkYXRlcyB0aGlzIGNvbXB1dGF0aW9uIHNvIHRoYXQgaXQgd2lsbCBiZSByZXJ1bi5cbiAgICogQGxvY3VzIENsaWVudFxuICAgKi9cbiAgaW52YWxpZGF0ZSgpIHtcbiAgICBpZiAoISB0aGlzLmludmFsaWRhdGVkKSB7XG4gICAgICAvLyBpZiB3ZSdyZSBjdXJyZW50bHkgaW4gX3JlY29tcHV0ZSgpLCBkb24ndCBlbnF1ZXVlXG4gICAgICAvLyBvdXJzZWx2ZXMsIHNpbmNlIHdlJ2xsIHJlcnVuIGltbWVkaWF0ZWx5IGFueXdheS5cbiAgICAgIGlmICghIHRoaXMuX3JlY29tcHV0aW5nICYmICEgdGhpcy5zdG9wcGVkKSB7XG4gICAgICAgIHJlcXVpcmVGbHVzaCgpO1xuICAgICAgICBwZW5kaW5nQ29tcHV0YXRpb25zLnB1c2godGhpcyk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuaW52YWxpZGF0ZWQgPSB0cnVlO1xuXG4gICAgICAvLyBjYWxsYmFja3MgY2FuJ3QgYWRkIGNhbGxiYWNrcywgYmVjYXVzZVxuICAgICAgLy8gdGhpcy5pbnZhbGlkYXRlZCA9PT0gdHJ1ZS5cbiAgICAgIGZvcih2YXIgaSA9IDAsIGY7IGYgPSB0aGlzLl9vbkludmFsaWRhdGVDYWxsYmFja3NbaV07IGkrKykge1xuICAgICAgICBUcmFja2VyLm5vbnJlYWN0aXZlKCgpID0+IHtcbiAgICAgICAgICB3aXRoTm9ZaWVsZHNBbGxvd2VkKGYpKHRoaXMpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX29uSW52YWxpZGF0ZUNhbGxiYWNrcyA9IFtdO1xuICAgIH1cbiAgfVxuXG4gIC8vIGh0dHA6Ly9kb2NzLm1ldGVvci5jb20vI2NvbXB1dGF0aW9uX3N0b3BcblxuICAvKipcbiAgICogQHN1bW1hcnkgUHJldmVudHMgdGhpcyBjb21wdXRhdGlvbiBmcm9tIHJlcnVubmluZy5cbiAgICogQGxvY3VzIENsaWVudFxuICAgKi9cbiAgc3RvcCgpIHtcbiAgICBpZiAoISB0aGlzLnN0b3BwZWQpIHtcbiAgICAgIHRoaXMuc3RvcHBlZCA9IHRydWU7XG4gICAgICB0aGlzLmludmFsaWRhdGUoKTtcbiAgICAgIGZvcih2YXIgaSA9IDAsIGY7IGYgPSB0aGlzLl9vblN0b3BDYWxsYmFja3NbaV07IGkrKykge1xuICAgICAgICBUcmFja2VyLm5vbnJlYWN0aXZlKCgpID0+IHtcbiAgICAgICAgICB3aXRoTm9ZaWVsZHNBbGxvd2VkKGYpKHRoaXMpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX29uU3RvcENhbGxiYWNrcyA9IFtdO1xuICAgIH1cbiAgfVxuXG4gIF9jb21wdXRlKCkge1xuICAgIHRoaXMuaW52YWxpZGF0ZWQgPSBmYWxzZTtcblxuICAgIHZhciBwcmV2aW91cyA9IFRyYWNrZXIuY3VycmVudENvbXB1dGF0aW9uO1xuICAgIHNldEN1cnJlbnRDb21wdXRhdGlvbih0aGlzKTtcbiAgICB2YXIgcHJldmlvdXNJbkNvbXB1dGUgPSBpbkNvbXB1dGU7XG4gICAgaW5Db21wdXRlID0gdHJ1ZTtcbiAgICB0cnkge1xuICAgICAgd2l0aE5vWWllbGRzQWxsb3dlZCh0aGlzLl9mdW5jKSh0aGlzKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgc2V0Q3VycmVudENvbXB1dGF0aW9uKHByZXZpb3VzKTtcbiAgICAgIGluQ29tcHV0ZSA9IHByZXZpb3VzSW5Db21wdXRlO1xuICAgIH1cbiAgfVxuXG4gIF9uZWVkc1JlY29tcHV0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5pbnZhbGlkYXRlZCAmJiAhIHRoaXMuc3RvcHBlZDtcbiAgfVxuXG4gIF9yZWNvbXB1dGUoKSB7XG4gICAgdGhpcy5fcmVjb21wdXRpbmcgPSB0cnVlO1xuICAgIHRyeSB7XG4gICAgICBpZiAodGhpcy5fbmVlZHNSZWNvbXB1dGUoKSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHRoaXMuX2NvbXB1dGUoKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGlmICh0aGlzLl9vbkVycm9yKSB7XG4gICAgICAgICAgICB0aGlzLl9vbkVycm9yKGUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfdGhyb3dPckxvZyhcInJlY29tcHV0ZVwiLCBlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy5fcmVjb21wdXRpbmcgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHN1bW1hcnkgUHJvY2VzcyB0aGUgcmVhY3RpdmUgdXBkYXRlcyBmb3IgdGhpcyBjb21wdXRhdGlvbiBpbW1lZGlhdGVseVxuICAgKiBhbmQgZW5zdXJlIHRoYXQgdGhlIGNvbXB1dGF0aW9uIGlzIHJlcnVuLiBUaGUgY29tcHV0YXRpb24gaXMgcmVydW4gb25seVxuICAgKiBpZiBpdCBpcyBpbnZhbGlkYXRlZC5cbiAgICogQGxvY3VzIENsaWVudFxuICAgKi9cbiAgZmx1c2goKSB7XG4gICAgaWYgKHRoaXMuX3JlY29tcHV0aW5nKVxuICAgICAgcmV0dXJuO1xuXG4gICAgdGhpcy5fcmVjb21wdXRlKCk7XG4gIH1cblxuICAvKipcbiAgICogQHN1bW1hcnkgQ2F1c2VzIHRoZSBmdW5jdGlvbiBpbnNpZGUgdGhpcyBjb21wdXRhdGlvbiB0byBydW4gYW5kXG4gICAqIHN5bmNocm9ub3VzbHkgcHJvY2VzcyBhbGwgcmVhY3RpdmUgdXBkdGVzLlxuICAgKiBAbG9jdXMgQ2xpZW50XG4gICAqL1xuICBydW4oKSB7XG4gICAgdGhpcy5pbnZhbGlkYXRlKCk7XG4gICAgdGhpcy5mbHVzaCgpO1xuICB9XG59O1xuXG4vL1xuLy8gaHR0cDovL2RvY3MubWV0ZW9yLmNvbS8jdHJhY2tlcl9kZXBlbmRlbmN5XG5cbi8qKlxuICogQHN1bW1hcnkgQSBEZXBlbmRlbmN5IHJlcHJlc2VudHMgYW4gYXRvbWljIHVuaXQgb2YgcmVhY3RpdmUgZGF0YSB0aGF0IGFcbiAqIGNvbXB1dGF0aW9uIG1pZ2h0IGRlcGVuZCBvbi4gUmVhY3RpdmUgZGF0YSBzb3VyY2VzIHN1Y2ggYXMgU2Vzc2lvbiBvclxuICogTWluaW1vbmdvIGludGVybmFsbHkgY3JlYXRlIGRpZmZlcmVudCBEZXBlbmRlbmN5IG9iamVjdHMgZm9yIGRpZmZlcmVudFxuICogcGllY2VzIG9mIGRhdGEsIGVhY2ggb2Ygd2hpY2ggbWF5IGJlIGRlcGVuZGVkIG9uIGJ5IG11bHRpcGxlIGNvbXB1dGF0aW9ucy5cbiAqIFdoZW4gdGhlIGRhdGEgY2hhbmdlcywgdGhlIGNvbXB1dGF0aW9ucyBhcmUgaW52YWxpZGF0ZWQuXG4gKiBAY2xhc3NcbiAqIEBpbnN0YW5jZU5hbWUgZGVwZW5kZW5jeVxuICovXG5UcmFja2VyLkRlcGVuZGVuY3kgPSBjbGFzcyBEZXBlbmRlbmN5IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5fZGVwZW5kZW50c0J5SWQgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICB9XG5cbiAgLy8gaHR0cDovL2RvY3MubWV0ZW9yLmNvbS8jZGVwZW5kZW5jeV9kZXBlbmRcbiAgLy9cbiAgLy8gQWRkcyBgY29tcHV0YXRpb25gIHRvIHRoaXMgc2V0IGlmIGl0IGlzIG5vdCBhbHJlYWR5XG4gIC8vIHByZXNlbnQuICBSZXR1cm5zIHRydWUgaWYgYGNvbXB1dGF0aW9uYCBpcyBhIG5ldyBtZW1iZXIgb2YgdGhlIHNldC5cbiAgLy8gSWYgbm8gYXJndW1lbnQsIGRlZmF1bHRzIHRvIGN1cnJlbnRDb21wdXRhdGlvbiwgb3IgZG9lcyBub3RoaW5nXG4gIC8vIGlmIHRoZXJlIGlzIG5vIGN1cnJlbnRDb21wdXRhdGlvbi5cblxuICAvKipcbiAgICogQHN1bW1hcnkgRGVjbGFyZXMgdGhhdCB0aGUgY3VycmVudCBjb21wdXRhdGlvbiAob3IgYGZyb21Db21wdXRhdGlvbmAgaWYgZ2l2ZW4pIGRlcGVuZHMgb24gYGRlcGVuZGVuY3lgLiAgVGhlIGNvbXB1dGF0aW9uIHdpbGwgYmUgaW52YWxpZGF0ZWQgdGhlIG5leHQgdGltZSBgZGVwZW5kZW5jeWAgY2hhbmdlcy5cblxuICAgSWYgdGhlcmUgaXMgbm8gY3VycmVudCBjb21wdXRhdGlvbiBhbmQgYGRlcGVuZCgpYCBpcyBjYWxsZWQgd2l0aCBubyBhcmd1bWVudHMsIGl0IGRvZXMgbm90aGluZyBhbmQgcmV0dXJucyBmYWxzZS5cblxuICAgUmV0dXJucyB0cnVlIGlmIHRoZSBjb21wdXRhdGlvbiBpcyBhIG5ldyBkZXBlbmRlbnQgb2YgYGRlcGVuZGVuY3lgIHJhdGhlciB0aGFuIGFuIGV4aXN0aW5nIG9uZS5cbiAgICogQGxvY3VzIENsaWVudFxuICAgKiBAcGFyYW0ge1RyYWNrZXIuQ29tcHV0YXRpb259IFtmcm9tQ29tcHV0YXRpb25dIEFuIG9wdGlvbmFsIGNvbXB1dGF0aW9uIGRlY2xhcmVkIHRvIGRlcGVuZCBvbiBgZGVwZW5kZW5jeWAgaW5zdGVhZCBvZiB0aGUgY3VycmVudCBjb21wdXRhdGlvbi5cbiAgICogQHJldHVybnMge0Jvb2xlYW59XG4gICAqL1xuICBkZXBlbmQoY29tcHV0YXRpb24pIHtcbiAgICBpZiAoISBjb21wdXRhdGlvbikge1xuICAgICAgaWYgKCEgVHJhY2tlci5hY3RpdmUpXG4gICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgY29tcHV0YXRpb24gPSBUcmFja2VyLmN1cnJlbnRDb21wdXRhdGlvbjtcbiAgICB9XG4gICAgdmFyIGlkID0gY29tcHV0YXRpb24uX2lkO1xuICAgIGlmICghIChpZCBpbiB0aGlzLl9kZXBlbmRlbnRzQnlJZCkpIHtcbiAgICAgIHRoaXMuX2RlcGVuZGVudHNCeUlkW2lkXSA9IGNvbXB1dGF0aW9uO1xuICAgICAgY29tcHV0YXRpb24ub25JbnZhbGlkYXRlKCgpID0+IHtcbiAgICAgICAgZGVsZXRlIHRoaXMuX2RlcGVuZGVudHNCeUlkW2lkXTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIGh0dHA6Ly9kb2NzLm1ldGVvci5jb20vI2RlcGVuZGVuY3lfY2hhbmdlZFxuXG4gIC8qKlxuICAgKiBAc3VtbWFyeSBJbnZhbGlkYXRlIGFsbCBkZXBlbmRlbnQgY29tcHV0YXRpb25zIGltbWVkaWF0ZWx5IGFuZCByZW1vdmUgdGhlbSBhcyBkZXBlbmRlbnRzLlxuICAgKiBAbG9jdXMgQ2xpZW50XG4gICAqL1xuICBjaGFuZ2VkKCkge1xuICAgIGZvciAodmFyIGlkIGluIHRoaXMuX2RlcGVuZGVudHNCeUlkKVxuICAgICAgdGhpcy5fZGVwZW5kZW50c0J5SWRbaWRdLmludmFsaWRhdGUoKTtcbiAgfVxuXG4gIC8vIGh0dHA6Ly9kb2NzLm1ldGVvci5jb20vI2RlcGVuZGVuY3lfaGFzZGVwZW5kZW50c1xuXG4gIC8qKlxuICAgKiBAc3VtbWFyeSBUcnVlIGlmIHRoaXMgRGVwZW5kZW5jeSBoYXMgb25lIG9yIG1vcmUgZGVwZW5kZW50IENvbXB1dGF0aW9ucywgd2hpY2ggd291bGQgYmUgaW52YWxpZGF0ZWQgaWYgdGhpcyBEZXBlbmRlbmN5IHdlcmUgdG8gY2hhbmdlLlxuICAgKiBAbG9jdXMgQ2xpZW50XG4gICAqIEByZXR1cm5zIHtCb29sZWFufVxuICAgKi9cbiAgaGFzRGVwZW5kZW50cygpIHtcbiAgICBmb3IgKHZhciBpZCBpbiB0aGlzLl9kZXBlbmRlbnRzQnlJZClcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufTtcblxuLy8gaHR0cDovL2RvY3MubWV0ZW9yLmNvbS8jdHJhY2tlcl9mbHVzaFxuXG4vKipcbiAqIEBzdW1tYXJ5IFByb2Nlc3MgYWxsIHJlYWN0aXZlIHVwZGF0ZXMgaW1tZWRpYXRlbHkgYW5kIGVuc3VyZSB0aGF0IGFsbCBpbnZhbGlkYXRlZCBjb21wdXRhdGlvbnMgYXJlIHJlcnVuLlxuICogQGxvY3VzIENsaWVudFxuICovXG5UcmFja2VyLmZsdXNoID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgVHJhY2tlci5fcnVuRmx1c2goeyBmaW5pc2hTeW5jaHJvbm91c2x5OiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgIHRocm93Rmlyc3RFcnJvcjogb3B0aW9ucyAmJiBvcHRpb25zLl90aHJvd0ZpcnN0RXJyb3IgfSk7XG59O1xuXG4vKipcbiAqIEBzdW1tYXJ5IFRydWUgaWYgd2UgYXJlIGNvbXB1dGluZyBhIGNvbXB1dGF0aW9uIG5vdywgZWl0aGVyIGZpcnN0IHRpbWUgb3IgcmVjb21wdXRlLiAgVGhpcyBtYXRjaGVzIFRyYWNrZXIuYWN0aXZlIHVubGVzcyB3ZSBhcmUgaW5zaWRlIFRyYWNrZXIubm9ucmVhY3RpdmUsIHdoaWNoIG51bGxmaWVzIGN1cnJlbnRDb21wdXRhdGlvbiBldmVuIHRob3VnaCBhbiBlbmNsb3NpbmcgY29tcHV0YXRpb24gbWF5IHN0aWxsIGJlIHJ1bm5pbmcuXG4gKiBAbG9jdXMgQ2xpZW50XG4gKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAqL1xuVHJhY2tlci5pbkZsdXNoID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gaW5GbHVzaDtcbn1cblxuLy8gUnVuIGFsbCBwZW5kaW5nIGNvbXB1dGF0aW9ucyBhbmQgYWZ0ZXJGbHVzaCBjYWxsYmFja3MuICBJZiB3ZSB3ZXJlIG5vdCBjYWxsZWRcbi8vIGRpcmVjdGx5IHZpYSBUcmFja2VyLmZsdXNoLCB0aGlzIG1heSByZXR1cm4gYmVmb3JlIHRoZXkncmUgYWxsIGRvbmUgdG8gYWxsb3dcbi8vIHRoZSBldmVudCBsb29wIHRvIHJ1biBhIGxpdHRsZSBiZWZvcmUgY29udGludWluZy5cblRyYWNrZXIuX3J1bkZsdXNoID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgLy8gWFhYIFdoYXQgcGFydCBvZiB0aGUgY29tbWVudCBiZWxvdyBpcyBzdGlsbCB0cnVlPyAoV2Ugbm8gbG9uZ2VyXG4gIC8vIGhhdmUgU3BhcmspXG4gIC8vXG4gIC8vIE5lc3RlZCBmbHVzaCBjb3VsZCBwbGF1c2libHkgaGFwcGVuIGlmLCBzYXksIGEgZmx1c2ggY2F1c2VzXG4gIC8vIERPTSBtdXRhdGlvbiwgd2hpY2ggY2F1c2VzIGEgXCJibHVyXCIgZXZlbnQsIHdoaWNoIHJ1bnMgYW5cbiAgLy8gYXBwIGV2ZW50IGhhbmRsZXIgdGhhdCBjYWxscyBUcmFja2VyLmZsdXNoLiAgQXQgdGhlIG1vbWVudFxuICAvLyBTcGFyayBibG9ja3MgZXZlbnQgaGFuZGxlcnMgZHVyaW5nIERPTSBtdXRhdGlvbiBhbnl3YXksXG4gIC8vIGJlY2F1c2UgdGhlIExpdmVSYW5nZSB0cmVlIGlzbid0IHZhbGlkLiAgQW5kIHdlIGRvbid0IGhhdmVcbiAgLy8gYW55IHVzZWZ1bCBub3Rpb24gb2YgYSBuZXN0ZWQgZmx1c2guXG4gIC8vXG4gIC8vIGh0dHBzOi8vYXBwLmFzYW5hLmNvbS8wLzE1OTkwODMzMDI0NC8zODUxMzgyMzM4NTZcbiAgaWYgKFRyYWNrZXIuaW5GbHVzaCgpKVxuICAgIHRocm93IG5ldyBFcnJvcihcIkNhbid0IGNhbGwgVHJhY2tlci5mbHVzaCB3aGlsZSBmbHVzaGluZ1wiKTtcblxuICBpZiAoaW5Db21wdXRlKVxuICAgIHRocm93IG5ldyBFcnJvcihcIkNhbid0IGZsdXNoIGluc2lkZSBUcmFja2VyLmF1dG9ydW5cIik7XG5cbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgaW5GbHVzaCA9IHRydWU7XG4gIHdpbGxGbHVzaCA9IHRydWU7XG4gIHRocm93Rmlyc3RFcnJvciA9ICEhIG9wdGlvbnMudGhyb3dGaXJzdEVycm9yO1xuXG4gIHZhciByZWNvbXB1dGVkQ291bnQgPSAwO1xuICB2YXIgZmluaXNoZWRUcnkgPSBmYWxzZTtcbiAgdHJ5IHtcbiAgICB3aGlsZSAocGVuZGluZ0NvbXB1dGF0aW9ucy5sZW5ndGggfHxcbiAgICAgICAgICAgYWZ0ZXJGbHVzaENhbGxiYWNrcy5sZW5ndGgpIHtcblxuICAgICAgLy8gcmVjb21wdXRlIGFsbCBwZW5kaW5nIGNvbXB1dGF0aW9uc1xuICAgICAgd2hpbGUgKHBlbmRpbmdDb21wdXRhdGlvbnMubGVuZ3RoKSB7XG4gICAgICAgIHZhciBjb21wID0gcGVuZGluZ0NvbXB1dGF0aW9ucy5zaGlmdCgpO1xuICAgICAgICBjb21wLl9yZWNvbXB1dGUoKTtcbiAgICAgICAgaWYgKGNvbXAuX25lZWRzUmVjb21wdXRlKCkpIHtcbiAgICAgICAgICBwZW5kaW5nQ29tcHV0YXRpb25zLnVuc2hpZnQoY29tcCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoISBvcHRpb25zLmZpbmlzaFN5bmNocm9ub3VzbHkgJiYgKytyZWNvbXB1dGVkQ291bnQgPiAxMDAwKSB7XG4gICAgICAgICAgZmluaXNoZWRUcnkgPSB0cnVlO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoYWZ0ZXJGbHVzaENhbGxiYWNrcy5sZW5ndGgpIHtcbiAgICAgICAgLy8gY2FsbCBvbmUgYWZ0ZXJGbHVzaCBjYWxsYmFjaywgd2hpY2ggbWF5XG4gICAgICAgIC8vIGludmFsaWRhdGUgbW9yZSBjb21wdXRhdGlvbnNcbiAgICAgICAgdmFyIGZ1bmMgPSBhZnRlckZsdXNoQ2FsbGJhY2tzLnNoaWZ0KCk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZnVuYygpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgX3Rocm93T3JMb2coXCJhZnRlckZsdXNoXCIsIGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGZpbmlzaGVkVHJ5ID0gdHJ1ZTtcbiAgfSBmaW5hbGx5IHtcbiAgICBpZiAoISBmaW5pc2hlZFRyeSkge1xuICAgICAgLy8gd2UncmUgZXJyb3JpbmcgZHVlIHRvIHRocm93Rmlyc3RFcnJvciBiZWluZyB0cnVlLlxuICAgICAgaW5GbHVzaCA9IGZhbHNlOyAvLyBuZWVkZWQgYmVmb3JlIGNhbGxpbmcgYFRyYWNrZXIuZmx1c2goKWAgYWdhaW5cbiAgICAgIC8vIGZpbmlzaCBmbHVzaGluZ1xuICAgICAgVHJhY2tlci5fcnVuRmx1c2goe1xuICAgICAgICBmaW5pc2hTeW5jaHJvbm91c2x5OiBvcHRpb25zLmZpbmlzaFN5bmNocm9ub3VzbHksXG4gICAgICAgIHRocm93Rmlyc3RFcnJvcjogZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cbiAgICB3aWxsRmx1c2ggPSBmYWxzZTtcbiAgICBpbkZsdXNoID0gZmFsc2U7XG4gICAgaWYgKHBlbmRpbmdDb21wdXRhdGlvbnMubGVuZ3RoIHx8IGFmdGVyRmx1c2hDYWxsYmFja3MubGVuZ3RoKSB7XG4gICAgICAvLyBXZSdyZSB5aWVsZGluZyBiZWNhdXNlIHdlIHJhbiBhIGJ1bmNoIG9mIGNvbXB1dGF0aW9ucyBhbmQgd2UgYXJlbid0XG4gICAgICAvLyByZXF1aXJlZCB0byBmaW5pc2ggc3luY2hyb25vdXNseSwgc28gd2UnZCBsaWtlIHRvIGdpdmUgdGhlIGV2ZW50IGxvb3AgYVxuICAgICAgLy8gY2hhbmNlLiBXZSBzaG91bGQgZmx1c2ggYWdhaW4gc29vbi5cbiAgICAgIGlmIChvcHRpb25zLmZpbmlzaFN5bmNocm9ub3VzbHkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwic3RpbGwgaGF2ZSBtb3JlIHRvIGRvP1wiKTsgIC8vIHNob3VsZG4ndCBoYXBwZW5cbiAgICAgIH1cbiAgICAgIHNldFRpbWVvdXQocmVxdWlyZUZsdXNoLCAxMCk7XG4gICAgfVxuICB9XG59O1xuXG4vLyBodHRwOi8vZG9jcy5tZXRlb3IuY29tLyN0cmFja2VyX2F1dG9ydW5cbi8vXG4vLyBSdW4gZigpLiBSZWNvcmQgaXRzIGRlcGVuZGVuY2llcy4gUmVydW4gaXQgd2hlbmV2ZXIgdGhlXG4vLyBkZXBlbmRlbmNpZXMgY2hhbmdlLlxuLy9cbi8vIFJldHVybnMgYSBuZXcgQ29tcHV0YXRpb24sIHdoaWNoIGlzIGFsc28gcGFzc2VkIHRvIGYuXG4vL1xuLy8gTGlua3MgdGhlIGNvbXB1dGF0aW9uIHRvIHRoZSBjdXJyZW50IGNvbXB1dGF0aW9uXG4vLyBzbyB0aGF0IGl0IGlzIHN0b3BwZWQgaWYgdGhlIGN1cnJlbnQgY29tcHV0YXRpb24gaXMgaW52YWxpZGF0ZWQuXG5cbi8qKlxuICogQGNhbGxiYWNrIFRyYWNrZXIuQ29tcHV0YXRpb25GdW5jdGlvblxuICogQHBhcmFtIHtUcmFja2VyLkNvbXB1dGF0aW9ufVxuICovXG4vKipcbiAqIEBzdW1tYXJ5IFJ1biBhIGZ1bmN0aW9uIG5vdyBhbmQgcmVydW4gaXQgbGF0ZXIgd2hlbmV2ZXIgaXRzIGRlcGVuZGVuY2llc1xuICogY2hhbmdlLiBSZXR1cm5zIGEgQ29tcHV0YXRpb24gb2JqZWN0IHRoYXQgY2FuIGJlIHVzZWQgdG8gc3RvcCBvciBvYnNlcnZlIHRoZVxuICogcmVydW5uaW5nLlxuICogQGxvY3VzIENsaWVudFxuICogQHBhcmFtIHtUcmFja2VyLkNvbXB1dGF0aW9uRnVuY3Rpb259IHJ1bkZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHJ1bi4gSXQgcmVjZWl2ZXNcbiAqIG9uZSBhcmd1bWVudDogdGhlIENvbXB1dGF0aW9uIG9iamVjdCB0aGF0IHdpbGwgYmUgcmV0dXJuZWQuXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBvcHRpb25zLm9uRXJyb3IgT3B0aW9uYWwuIFRoZSBmdW5jdGlvbiB0byBydW4gd2hlbiBhbiBlcnJvclxuICogaGFwcGVucyBpbiB0aGUgQ29tcHV0YXRpb24uIFRoZSBvbmx5IGFyZ3VtZW50IGl0IHJlY2VpdmVzIGlzIHRoZSBFcnJvclxuICogdGhyb3duLiBEZWZhdWx0cyB0byB0aGUgZXJyb3IgYmVpbmcgbG9nZ2VkIHRvIHRoZSBjb25zb2xlLlxuICogQHJldHVybnMge1RyYWNrZXIuQ29tcHV0YXRpb259XG4gKi9cblRyYWNrZXIuYXV0b3J1biA9IGZ1bmN0aW9uIChmLCBvcHRpb25zKSB7XG4gIGlmICh0eXBlb2YgZiAhPT0gJ2Z1bmN0aW9uJylcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1RyYWNrZXIuYXV0b3J1biByZXF1aXJlcyBhIGZ1bmN0aW9uIGFyZ3VtZW50Jyk7XG5cbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgY29uc3RydWN0aW5nQ29tcHV0YXRpb24gPSB0cnVlO1xuICB2YXIgYyA9IG5ldyBUcmFja2VyLkNvbXB1dGF0aW9uKFxuICAgIGYsIFRyYWNrZXIuY3VycmVudENvbXB1dGF0aW9uLCBvcHRpb25zLm9uRXJyb3IpO1xuXG4gIGlmIChUcmFja2VyLmFjdGl2ZSlcbiAgICBUcmFja2VyLm9uSW52YWxpZGF0ZShmdW5jdGlvbiAoKSB7XG4gICAgICBjLnN0b3AoKTtcbiAgICB9KTtcblxuICByZXR1cm4gYztcbn07XG5cbi8vIGh0dHA6Ly9kb2NzLm1ldGVvci5jb20vI3RyYWNrZXJfbm9ucmVhY3RpdmVcbi8vXG4vLyBSdW4gYGZgIHdpdGggbm8gY3VycmVudCBjb21wdXRhdGlvbiwgcmV0dXJuaW5nIHRoZSByZXR1cm4gdmFsdWVcbi8vIG9mIGBmYC4gIFVzZWQgdG8gdHVybiBvZmYgcmVhY3Rpdml0eSBmb3IgdGhlIGR1cmF0aW9uIG9mIGBmYCxcbi8vIHNvIHRoYXQgcmVhY3RpdmUgZGF0YSBzb3VyY2VzIGFjY2Vzc2VkIGJ5IGBmYCB3aWxsIG5vdCByZXN1bHQgaW4gYW55XG4vLyBjb21wdXRhdGlvbnMgYmVpbmcgaW52YWxpZGF0ZWQuXG5cbi8qKlxuICogQHN1bW1hcnkgUnVuIGEgZnVuY3Rpb24gd2l0aG91dCB0cmFja2luZyBkZXBlbmRlbmNpZXMuXG4gKiBAbG9jdXMgQ2xpZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIEEgZnVuY3Rpb24gdG8gY2FsbCBpbW1lZGlhdGVseS5cbiAqL1xuVHJhY2tlci5ub25yZWFjdGl2ZSA9IGZ1bmN0aW9uIChmKSB7XG4gIHZhciBwcmV2aW91cyA9IFRyYWNrZXIuY3VycmVudENvbXB1dGF0aW9uO1xuICBzZXRDdXJyZW50Q29tcHV0YXRpb24obnVsbCk7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGYoKTtcbiAgfSBmaW5hbGx5IHtcbiAgICBzZXRDdXJyZW50Q29tcHV0YXRpb24ocHJldmlvdXMpO1xuICB9XG59O1xuXG4vLyBodHRwOi8vZG9jcy5tZXRlb3IuY29tLyN0cmFja2VyX29uaW52YWxpZGF0ZVxuXG4vKipcbiAqIEBzdW1tYXJ5IFJlZ2lzdGVycyBhIG5ldyBbYG9uSW52YWxpZGF0ZWBdKCNjb21wdXRhdGlvbl9vbmludmFsaWRhdGUpIGNhbGxiYWNrIG9uIHRoZSBjdXJyZW50IGNvbXB1dGF0aW9uICh3aGljaCBtdXN0IGV4aXN0KSwgdG8gYmUgY2FsbGVkIGltbWVkaWF0ZWx5IHdoZW4gdGhlIGN1cnJlbnQgY29tcHV0YXRpb24gaXMgaW52YWxpZGF0ZWQgb3Igc3RvcHBlZC5cbiAqIEBsb2N1cyBDbGllbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIEEgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCB3aWxsIGJlIGludm9rZWQgYXMgYGZ1bmMoYylgLCB3aGVyZSBgY2AgaXMgdGhlIGNvbXB1dGF0aW9uIG9uIHdoaWNoIHRoZSBjYWxsYmFjayBpcyByZWdpc3RlcmVkLlxuICovXG5UcmFja2VyLm9uSW52YWxpZGF0ZSA9IGZ1bmN0aW9uIChmKSB7XG4gIGlmICghIFRyYWNrZXIuYWN0aXZlKVxuICAgIHRocm93IG5ldyBFcnJvcihcIlRyYWNrZXIub25JbnZhbGlkYXRlIHJlcXVpcmVzIGEgY3VycmVudENvbXB1dGF0aW9uXCIpO1xuXG4gIFRyYWNrZXIuY3VycmVudENvbXB1dGF0aW9uLm9uSW52YWxpZGF0ZShmKTtcbn07XG5cbi8vIGh0dHA6Ly9kb2NzLm1ldGVvci5jb20vI3RyYWNrZXJfYWZ0ZXJmbHVzaFxuXG4vKipcbiAqIEBzdW1tYXJ5IFNjaGVkdWxlcyBhIGZ1bmN0aW9uIHRvIGJlIGNhbGxlZCBkdXJpbmcgdGhlIG5leHQgZmx1c2gsIG9yIGxhdGVyIGluIHRoZSBjdXJyZW50IGZsdXNoIGlmIG9uZSBpcyBpbiBwcm9ncmVzcywgYWZ0ZXIgYWxsIGludmFsaWRhdGVkIGNvbXB1dGF0aW9ucyBoYXZlIGJlZW4gcmVydW4uICBUaGUgZnVuY3Rpb24gd2lsbCBiZSBydW4gb25jZSBhbmQgbm90IG9uIHN1YnNlcXVlbnQgZmx1c2hlcyB1bmxlc3MgYGFmdGVyRmx1c2hgIGlzIGNhbGxlZCBhZ2Fpbi5cbiAqIEBsb2N1cyBDbGllbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIEEgZnVuY3Rpb24gdG8gY2FsbCBhdCBmbHVzaCB0aW1lLlxuICovXG5UcmFja2VyLmFmdGVyRmx1c2ggPSBmdW5jdGlvbiAoZikge1xuICBhZnRlckZsdXNoQ2FsbGJhY2tzLnB1c2goZik7XG4gIHJlcXVpcmVGbHVzaCgpO1xufTtcbiJdfQ==
