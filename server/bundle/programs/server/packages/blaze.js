(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var check = Package.check.check;
var Match = Package.check.Match;
var _ = Package.underscore._;
var ObserveSequence = Package['observe-sequence'].ObserveSequence;
var ReactiveVar = Package['reactive-var'].ReactiveVar;
var OrderedDict = Package['ordered-dict'].OrderedDict;
var ECMAScript = Package.ecmascript.ECMAScript;
var HTML = Package.htmljs.HTML;
var meteorInstall = Package.modules.meteorInstall;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var Blaze, UI, Handlebars;

var require = meteorInstall({"node_modules":{"meteor":{"blaze":{"preamble.js":function module(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/blaze/preamble.js                                                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/**
 * @namespace Blaze
 * @summary The namespace for all Blaze-related methods and classes.
 */
Blaze = {}; // Utility to HTML-escape a string.  Included for legacy reasons.
// TODO: Should be replaced with _.escape once underscore is upgraded to a newer
//       version which escapes ` (backtick) as well. Underscore 1.5.2 does not.

Blaze._escape = function () {
  var escape_map = {
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
    "`": "&#x60;",

    /* IE allows backtick-delimited attributes?? */
    "&": "&amp;"
  };

  var escape_one = function (c) {
    return escape_map[c];
  };

  return function (x) {
    return x.replace(/[&<>"'`]/g, escape_one);
  };
}();

Blaze._warn = function (msg) {
  msg = 'Warning: ' + msg;

  if (typeof console !== 'undefined' && console.warn) {
    console.warn(msg);
  }
};

var nativeBind = Function.prototype.bind; // An implementation of _.bind which allows better optimization.
// See: https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#3-managing-arguments

if (nativeBind) {
  Blaze._bind = function (func, obj) {
    if (arguments.length === 2) {
      return nativeBind.call(func, obj);
    } // Copy the arguments so this function can be optimized.


    var args = new Array(arguments.length);

    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    return nativeBind.apply(func, args.slice(1));
  };
} else {
  // A slower but backwards compatible version.
  Blaze._bind = _.bind;
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"exceptions.js":function module(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/blaze/exceptions.js                                                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var debugFunc; // We call into user code in many places, and it's nice to catch exceptions
// propagated from user code immediately so that the whole system doesn't just
// break.  Catching exceptions is easy; reporting them is hard.  This helper
// reports exceptions.
//
// Usage:
//
// ```
// try {
//   // ... someStuff ...
// } catch (e) {
//   reportUIException(e);
// }
// ```
//
// An optional second argument overrides the default message.
// Set this to `true` to cause `reportException` to throw
// the next exception rather than reporting it.  This is
// useful in unit tests that test error messages.

Blaze._throwNextException = false;

Blaze._reportException = function (e, msg) {
  if (Blaze._throwNextException) {
    Blaze._throwNextException = false;
    throw e;
  }

  if (!debugFunc) // adapted from Tracker
    debugFunc = function () {
      return typeof Meteor !== "undefined" ? Meteor._debug : typeof console !== "undefined" && console.log ? console.log : function () {};
    }; // In Chrome, `e.stack` is a multiline string that starts with the message
  // and contains a stack trace.  Furthermore, `console.log` makes it clickable.
  // `console.log` supplies the space between the two arguments.

  debugFunc()(msg || 'Exception caught in template:', e.stack || e.message || e);
};

Blaze._wrapCatchingExceptions = function (f, where) {
  if (typeof f !== 'function') return f;
  return function () {
    try {
      return f.apply(this, arguments);
    } catch (e) {
      Blaze._reportException(e, 'Exception in ' + where + ':');
    }
  };
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"view.js":function module(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/blaze/view.js                                                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/// [new] Blaze.View([name], renderMethod)
///
/// Blaze.View is the building block of reactive DOM.  Views have
/// the following features:
///
/// * lifecycle callbacks - Views are created, rendered, and destroyed,
///   and callbacks can be registered to fire when these things happen.
///
/// * parent pointer - A View points to its parentView, which is the
///   View that caused it to be rendered.  These pointers form a
///   hierarchy or tree of Views.
///
/// * render() method - A View's render() method specifies the DOM
///   (or HTML) content of the View.  If the method establishes
///   reactive dependencies, it may be re-run.
///
/// * a DOMRange - If a View is rendered to DOM, its position and
///   extent in the DOM are tracked using a DOMRange object.
///
/// When a View is constructed by calling Blaze.View, the View is
/// not yet considered "created."  It doesn't have a parentView yet,
/// and no logic has been run to initialize the View.  All real
/// work is deferred until at least creation time, when the onViewCreated
/// callbacks are fired, which happens when the View is "used" in
/// some way that requires it to be rendered.
///
/// ...more lifecycle stuff
///
/// `name` is an optional string tag identifying the View.  The only
/// time it's used is when looking in the View tree for a View of a
/// particular name; for example, data contexts are stored on Views
/// of name "with".  Names are also useful when debugging, so in
/// general it's good for functions that create Views to set the name.
/// Views associated with templates have names of the form "Template.foo".

/**
 * @class
 * @summary Constructor for a View, which represents a reactive region of DOM.
 * @locus Client
 * @param {String} [name] Optional.  A name for this type of View.  See [`view.name`](#view_name).
 * @param {Function} renderFunction A function that returns [*renderable content*](#Renderable-Content).  In this function, `this` is bound to the View.
 */
Blaze.View = function (name, render) {
  if (!(this instanceof Blaze.View)) // called without `new`
    return new Blaze.View(name, render);

  if (typeof name === 'function') {
    // omitted "name" argument
    render = name;
    name = '';
  }

  this.name = name;
  this._render = render;
  this._callbacks = {
    created: null,
    rendered: null,
    destroyed: null
  }; // Setting all properties here is good for readability,
  // and also may help Chrome optimize the code by keeping
  // the View object from changing shape too much.

  this.isCreated = false;
  this._isCreatedForExpansion = false;
  this.isRendered = false;
  this._isAttached = false;
  this.isDestroyed = false;
  this._isInRender = false;
  this.parentView = null;
  this._domrange = null; // This flag is normally set to false except for the cases when view's parent
  // was generated as part of expanding some syntactic sugar expressions or
  // methods.
  // Ex.: Blaze.renderWithData is an equivalent to creating a view with regular
  // Blaze.render and wrapping it into {{#with data}}{{/with}} view. Since the
  // users don't know anything about these generated parent views, Blaze needs
  // this information to be available on views to make smarter decisions. For
  // example: removing the generated parent view with the view on Blaze.remove.

  this._hasGeneratedParent = false; // Bindings accessible to children views (via view.lookup('name')) within the
  // closest template view.

  this._scopeBindings = {};
  this.renderCount = 0;
};

Blaze.View.prototype._render = function () {
  return null;
};

Blaze.View.prototype.onViewCreated = function (cb) {
  this._callbacks.created = this._callbacks.created || [];

  this._callbacks.created.push(cb);
};

Blaze.View.prototype._onViewRendered = function (cb) {
  this._callbacks.rendered = this._callbacks.rendered || [];

  this._callbacks.rendered.push(cb);
};

Blaze.View.prototype.onViewReady = function (cb) {
  var self = this;

  var fire = function () {
    Tracker.afterFlush(function () {
      if (!self.isDestroyed) {
        Blaze._withCurrentView(self, function () {
          cb.call(self);
        });
      }
    });
  };

  self._onViewRendered(function onViewRendered() {
    if (self.isDestroyed) return;
    if (!self._domrange.attached) self._domrange.onAttached(fire);else fire();
  });
};

Blaze.View.prototype.onViewDestroyed = function (cb) {
  this._callbacks.destroyed = this._callbacks.destroyed || [];

  this._callbacks.destroyed.push(cb);
};

Blaze.View.prototype.removeViewDestroyedListener = function (cb) {
  var destroyed = this._callbacks.destroyed;
  if (!destroyed) return;

  var index = _.lastIndexOf(destroyed, cb);

  if (index !== -1) {
    // XXX You'd think the right thing to do would be splice, but _fireCallbacks
    // gets sad if you remove callbacks while iterating over the list.  Should
    // change this to use callback-hook or EventEmitter or something else that
    // properly supports removal.
    destroyed[index] = null;
  }
}; /// View#autorun(func)
///
/// Sets up a Tracker autorun that is "scoped" to this View in two
/// important ways: 1) Blaze.currentView is automatically set
/// on every re-run, and 2) the autorun is stopped when the
/// View is destroyed.  As with Tracker.autorun, the first run of
/// the function is immediate, and a Computation object that can
/// be used to stop the autorun is returned.
///
/// View#autorun is meant to be called from View callbacks like
/// onViewCreated, or from outside the rendering process.  It may not
/// be called before the onViewCreated callbacks are fired (too early),
/// or from a render() method (too confusing).
///
/// Typically, autoruns that update the state
/// of the View (as in Blaze.With) should be started from an onViewCreated
/// callback.  Autoruns that update the DOM should be started
/// from either onViewCreated (guarded against the absence of
/// view._domrange), or onViewReady.


Blaze.View.prototype.autorun = function (f, _inViewScope, displayName) {
  var self = this; // The restrictions on when View#autorun can be called are in order
  // to avoid bad patterns, like creating a Blaze.View and immediately
  // calling autorun on it.  A freshly created View is not ready to
  // have logic run on it; it doesn't have a parentView, for example.
  // It's when the View is materialized or expanded that the onViewCreated
  // handlers are fired and the View starts up.
  //
  // Letting the render() method call `this.autorun()` is problematic
  // because of re-render.  The best we can do is to stop the old
  // autorun and start a new one for each render, but that's a pattern
  // we try to avoid internally because it leads to helpers being
  // called extra times, in the case where the autorun causes the
  // view to re-render (and thus the autorun to be torn down and a
  // new one established).
  //
  // We could lift these restrictions in various ways.  One interesting
  // idea is to allow you to call `view.autorun` after instantiating
  // `view`, and automatically wrap it in `view.onViewCreated`, deferring
  // the autorun so that it starts at an appropriate time.  However,
  // then we can't return the Computation object to the caller, because
  // it doesn't exist yet.

  if (!self.isCreated) {
    throw new Error("View#autorun must be called from the created callback at the earliest");
  }

  if (this._isInRender) {
    throw new Error("Can't call View#autorun from inside render(); try calling it from the created or rendered callback");
  }

  var templateInstanceFunc = Blaze.Template._currentTemplateInstanceFunc;

  var func = function viewAutorun(c) {
    return Blaze._withCurrentView(_inViewScope || self, function () {
      return Blaze.Template._withTemplateInstanceFunc(templateInstanceFunc, function () {
        return f.call(self, c);
      });
    });
  }; // Give the autorun function a better name for debugging and profiling.
  // The `displayName` property is not part of the spec but browsers like Chrome
  // and Firefox prefer it in debuggers over the name function was declared by.


  func.displayName = (self.name || 'anonymous') + ':' + (displayName || 'anonymous');
  var comp = Tracker.autorun(func);

  var stopComputation = function () {
    comp.stop();
  };

  self.onViewDestroyed(stopComputation);
  comp.onStop(function () {
    self.removeViewDestroyedListener(stopComputation);
  });
  return comp;
};

Blaze.View.prototype._errorIfShouldntCallSubscribe = function () {
  var self = this;

  if (!self.isCreated) {
    throw new Error("View#subscribe must be called from the created callback at the earliest");
  }

  if (self._isInRender) {
    throw new Error("Can't call View#subscribe from inside render(); try calling it from the created or rendered callback");
  }

  if (self.isDestroyed) {
    throw new Error("Can't call View#subscribe from inside the destroyed callback, try calling it inside created or rendered.");
  }
};
/**
 * Just like Blaze.View#autorun, but with Meteor.subscribe instead of
 * Tracker.autorun. Stop the subscription when the view is destroyed.
 * @return {SubscriptionHandle} A handle to the subscription so that you can
 * see if it is ready, or stop it manually
 */


Blaze.View.prototype.subscribe = function (args, options) {
  var self = this;
  options = options || {};

  self._errorIfShouldntCallSubscribe();

  var subHandle;

  if (options.connection) {
    subHandle = options.connection.subscribe.apply(options.connection, args);
  } else {
    subHandle = Meteor.subscribe.apply(Meteor, args);
  }

  self.onViewDestroyed(function () {
    subHandle.stop();
  });
  return subHandle;
};

Blaze.View.prototype.firstNode = function () {
  if (!this._isAttached) throw new Error("View must be attached before accessing its DOM");
  return this._domrange.firstNode();
};

Blaze.View.prototype.lastNode = function () {
  if (!this._isAttached) throw new Error("View must be attached before accessing its DOM");
  return this._domrange.lastNode();
};

Blaze._fireCallbacks = function (view, which) {
  Blaze._withCurrentView(view, function () {
    Tracker.nonreactive(function fireCallbacks() {
      var cbs = view._callbacks[which];

      for (var i = 0, N = cbs && cbs.length; i < N; i++) cbs[i] && cbs[i].call(view);
    });
  });
};

Blaze._createView = function (view, parentView, forExpansion) {
  if (view.isCreated) throw new Error("Can't render the same View twice");
  view.parentView = parentView || null;
  view.isCreated = true;
  if (forExpansion) view._isCreatedForExpansion = true;

  Blaze._fireCallbacks(view, 'created');
};

var doFirstRender = function (view, initialContent) {
  var domrange = new Blaze._DOMRange(initialContent);
  view._domrange = domrange;
  domrange.view = view;
  view.isRendered = true;

  Blaze._fireCallbacks(view, 'rendered');

  var teardownHook = null;
  domrange.onAttached(function attached(range, element) {
    view._isAttached = true;
    teardownHook = Blaze._DOMBackend.Teardown.onElementTeardown(element, function teardown() {
      Blaze._destroyView(view, true
      /* _skipNodes */
      );
    });
  }); // tear down the teardown hook

  view.onViewDestroyed(function () {
    teardownHook && teardownHook.stop();
    teardownHook = null;
  });
  return domrange;
}; // Take an uncreated View `view` and create and render it to DOM,
// setting up the autorun that updates the View.  Returns a new
// DOMRange, which has been associated with the View.
//
// The private arguments `_workStack` and `_intoArray` are passed in
// by Blaze._materializeDOM and are only present for recursive calls
// (when there is some other _materializeView on the stack).  If
// provided, then we avoid the mutual recursion of calling back into
// Blaze._materializeDOM so that deep View hierarchies don't blow the
// stack.  Instead, we push tasks onto workStack for the initial
// rendering and subsequent setup of the View, and they are done after
// we return.  When there is a _workStack, we do not return the new
// DOMRange, but instead push it into _intoArray from a _workStack
// task.


Blaze._materializeView = function (view, parentView, _workStack, _intoArray) {
  Blaze._createView(view, parentView);

  var domrange;
  var lastHtmljs; // We don't expect to be called in a Computation, but just in case,
  // wrap in Tracker.nonreactive.

  Tracker.nonreactive(function () {
    view.autorun(function doRender(c) {
      // `view.autorun` sets the current view.
      view.renderCount++;
      view._isInRender = true; // Any dependencies that should invalidate this Computation come
      // from this line:

      var htmljs = view._render();

      view._isInRender = false;

      if (!c.firstRun && !Blaze._isContentEqual(lastHtmljs, htmljs)) {
        Tracker.nonreactive(function doMaterialize() {
          // re-render
          var rangesAndNodes = Blaze._materializeDOM(htmljs, [], view);

          domrange.setMembers(rangesAndNodes);

          Blaze._fireCallbacks(view, 'rendered');
        });
      }

      lastHtmljs = htmljs; // Causes any nested views to stop immediately, not when we call
      // `setMembers` the next time around the autorun.  Otherwise,
      // helpers in the DOM tree to be replaced might be scheduled
      // to re-run before we have a chance to stop them.

      Tracker.onInvalidate(function () {
        if (domrange) {
          domrange.destroyMembers();
        }
      });
    }, undefined, 'materialize'); // first render.  lastHtmljs is the first htmljs.

    var initialContents;

    if (!_workStack) {
      initialContents = Blaze._materializeDOM(lastHtmljs, [], view);
      domrange = doFirstRender(view, initialContents);
      initialContents = null; // help GC because we close over this scope a lot
    } else {
      // We're being called from Blaze._materializeDOM, so to avoid
      // recursion and save stack space, provide a description of the
      // work to be done instead of doing it.  Tasks pushed onto
      // _workStack will be done in LIFO order after we return.
      // The work will still be done within a Tracker.nonreactive,
      // because it will be done by some call to Blaze._materializeDOM
      // (which is always called in a Tracker.nonreactive).
      initialContents = []; // push this function first so that it happens last

      _workStack.push(function () {
        domrange = doFirstRender(view, initialContents);
        initialContents = null; // help GC because of all the closures here

        _intoArray.push(domrange);
      }); // now push the task that calculates initialContents


      _workStack.push(Blaze._bind(Blaze._materializeDOM, null, lastHtmljs, initialContents, view, _workStack));
    }
  });

  if (!_workStack) {
    return domrange;
  } else {
    return null;
  }
}; // Expands a View to HTMLjs, calling `render` recursively on all
// Views and evaluating any dynamic attributes.  Calls the `created`
// callback, but not the `materialized` or `rendered` callbacks.
// Destroys the view immediately, unless called in a Tracker Computation,
// in which case the view will be destroyed when the Computation is
// invalidated.  If called in a Tracker Computation, the result is a
// reactive string; that is, the Computation will be invalidated
// if any changes are made to the view or subviews that might affect
// the HTML.


Blaze._expandView = function (view, parentView) {
  Blaze._createView(view, parentView, true
  /*forExpansion*/
  );

  view._isInRender = true;

  var htmljs = Blaze._withCurrentView(view, function () {
    return view._render();
  });

  view._isInRender = false;

  var result = Blaze._expand(htmljs, view);

  if (Tracker.active) {
    Tracker.onInvalidate(function () {
      Blaze._destroyView(view);
    });
  } else {
    Blaze._destroyView(view);
  }

  return result;
}; // Options: `parentView`


Blaze._HTMLJSExpander = HTML.TransformingVisitor.extend();

Blaze._HTMLJSExpander.def({
  visitObject: function (x) {
    if (x instanceof Blaze.Template) x = x.constructView();
    if (x instanceof Blaze.View) return Blaze._expandView(x, this.parentView); // this will throw an error; other objects are not allowed!

    return HTML.TransformingVisitor.prototype.visitObject.call(this, x);
  },
  visitAttributes: function (attrs) {
    // expand dynamic attributes
    if (typeof attrs === 'function') attrs = Blaze._withCurrentView(this.parentView, attrs); // call super (e.g. for case where `attrs` is an array)

    return HTML.TransformingVisitor.prototype.visitAttributes.call(this, attrs);
  },
  visitAttribute: function (name, value, tag) {
    // expand attribute values that are functions.  Any attribute value
    // that contains Views must be wrapped in a function.
    if (typeof value === 'function') value = Blaze._withCurrentView(this.parentView, value);
    return HTML.TransformingVisitor.prototype.visitAttribute.call(this, name, value, tag);
  }
}); // Return Blaze.currentView, but only if it is being rendered
// (i.e. we are in its render() method).


var currentViewIfRendering = function () {
  var view = Blaze.currentView;
  return view && view._isInRender ? view : null;
};

Blaze._expand = function (htmljs, parentView) {
  parentView = parentView || currentViewIfRendering();
  return new Blaze._HTMLJSExpander({
    parentView: parentView
  }).visit(htmljs);
};

Blaze._expandAttributes = function (attrs, parentView) {
  parentView = parentView || currentViewIfRendering();
  return new Blaze._HTMLJSExpander({
    parentView: parentView
  }).visitAttributes(attrs);
};

Blaze._destroyView = function (view, _skipNodes) {
  if (view.isDestroyed) return;
  view.isDestroyed = true;

  Blaze._fireCallbacks(view, 'destroyed'); // Destroy views and elements recursively.  If _skipNodes,
  // only recurse up to views, not elements, for the case where
  // the backend (jQuery) is recursing over the elements already.


  if (view._domrange) view._domrange.destroyMembers(_skipNodes);
};

Blaze._destroyNode = function (node) {
  if (node.nodeType === 1) Blaze._DOMBackend.Teardown.tearDownElement(node);
}; // Are the HTMLjs entities `a` and `b` the same?  We could be
// more elaborate here but the point is to catch the most basic
// cases.


Blaze._isContentEqual = function (a, b) {
  if (a instanceof HTML.Raw) {
    return b instanceof HTML.Raw && a.value === b.value;
  } else if (a == null) {
    return b == null;
  } else {
    return a === b && (typeof a === 'number' || typeof a === 'boolean' || typeof a === 'string');
  }
};
/**
 * @summary The View corresponding to the current template helper, event handler, callback, or autorun.  If there isn't one, `null`.
 * @locus Client
 * @type {Blaze.View}
 */


Blaze.currentView = null;

Blaze._withCurrentView = function (view, func) {
  var oldView = Blaze.currentView;

  try {
    Blaze.currentView = view;
    return func();
  } finally {
    Blaze.currentView = oldView;
  }
}; // Blaze.render publicly takes a View or a Template.
// Privately, it takes any HTMLJS (extended with Views and Templates)
// except null or undefined, or a function that returns any extended
// HTMLJS.


var checkRenderContent = function (content) {
  if (content === null) throw new Error("Can't render null");
  if (typeof content === 'undefined') throw new Error("Can't render undefined");
  if (content instanceof Blaze.View || content instanceof Blaze.Template || typeof content === 'function') return;

  try {
    // Throw if content doesn't look like HTMLJS at the top level
    // (i.e. verify that this is an HTML.Tag, or an array,
    // or a primitive, etc.)
    new HTML.Visitor().visit(content);
  } catch (e) {
    // Make error message suitable for public API
    throw new Error("Expected Template or View");
  }
}; // For Blaze.render and Blaze.toHTML, take content and
// wrap it in a View, unless it's a single View or
// Template already.


var contentAsView = function (content) {
  checkRenderContent(content);

  if (content instanceof Blaze.Template) {
    return content.constructView();
  } else if (content instanceof Blaze.View) {
    return content;
  } else {
    var func = content;

    if (typeof func !== 'function') {
      func = function () {
        return content;
      };
    }

    return Blaze.View('render', func);
  }
}; // For Blaze.renderWithData and Blaze.toHTMLWithData, wrap content
// in a function, if necessary, so it can be a content arg to
// a Blaze.With.


var contentAsFunc = function (content) {
  checkRenderContent(content);

  if (typeof content !== 'function') {
    return function () {
      return content;
    };
  } else {
    return content;
  }
};
/**
 * @summary Renders a template or View to DOM nodes and inserts it into the DOM, returning a rendered [View](#Blaze-View) which can be passed to [`Blaze.remove`](#Blaze-remove).
 * @locus Client
 * @param {Template|Blaze.View} templateOrView The template (e.g. `Template.myTemplate`) or View object to render.  If a template, a View object is [constructed](#template_constructview).  If a View, it must be an unrendered View, which becomes a rendered View and is returned.
 * @param {DOMNode} parentNode The node that will be the parent of the rendered template.  It must be an Element node.
 * @param {DOMNode} [nextNode] Optional. If provided, must be a child of <em>parentNode</em>; the template will be inserted before this node. If not provided, the template will be inserted as the last child of parentNode.
 * @param {Blaze.View} [parentView] Optional. If provided, it will be set as the rendered View's [`parentView`](#view_parentview).
 */


Blaze.render = function (content, parentElement, nextNode, parentView) {
  if (!parentElement) {
    Blaze._warn("Blaze.render without a parent element is deprecated. " + "You must specify where to insert the rendered content.");
  }

  if (nextNode instanceof Blaze.View) {
    // handle omitted nextNode
    parentView = nextNode;
    nextNode = null;
  } // parentElement must be a DOM node. in particular, can't be the
  // result of a call to `$`. Can't check if `parentElement instanceof
  // Node` since 'Node' is undefined in IE8.


  if (parentElement && typeof parentElement.nodeType !== 'number') throw new Error("'parentElement' must be a DOM node");
  if (nextNode && typeof nextNode.nodeType !== 'number') // 'nextNode' is optional
    throw new Error("'nextNode' must be a DOM node");
  parentView = parentView || currentViewIfRendering();
  var view = contentAsView(content);

  Blaze._materializeView(view, parentView);

  if (parentElement) {
    view._domrange.attach(parentElement, nextNode);
  }

  return view;
};

Blaze.insert = function (view, parentElement, nextNode) {
  Blaze._warn("Blaze.insert has been deprecated.  Specify where to insert the " + "rendered content in the call to Blaze.render.");

  if (!(view && view._domrange instanceof Blaze._DOMRange)) throw new Error("Expected template rendered with Blaze.render");

  view._domrange.attach(parentElement, nextNode);
};
/**
 * @summary Renders a template or View to DOM nodes with a data context.  Otherwise identical to `Blaze.render`.
 * @locus Client
 * @param {Template|Blaze.View} templateOrView The template (e.g. `Template.myTemplate`) or View object to render.
 * @param {Object|Function} data The data context to use, or a function returning a data context.  If a function is provided, it will be reactively re-run.
 * @param {DOMNode} parentNode The node that will be the parent of the rendered template.  It must be an Element node.
 * @param {DOMNode} [nextNode] Optional. If provided, must be a child of <em>parentNode</em>; the template will be inserted before this node. If not provided, the template will be inserted as the last child of parentNode.
 * @param {Blaze.View} [parentView] Optional. If provided, it will be set as the rendered View's [`parentView`](#view_parentview).
 */


Blaze.renderWithData = function (content, data, parentElement, nextNode, parentView) {
  // We defer the handling of optional arguments to Blaze.render.  At this point,
  // `nextNode` may actually be `parentView`.
  return Blaze.render(Blaze._TemplateWith(data, contentAsFunc(content)), parentElement, nextNode, parentView);
};
/**
 * @summary Removes a rendered View from the DOM, stopping all reactive updates and event listeners on it. Also destroys the Blaze.Template instance associated with the view.
 * @locus Client
 * @param {Blaze.View} renderedView The return value from `Blaze.render` or `Blaze.renderWithData`, or the `view` property of a Blaze.Template instance. Calling `Blaze.remove(Template.instance().view)` from within a template event handler will destroy the view as well as that template and trigger the template's `onDestroyed` handlers.
 */


Blaze.remove = function (view) {
  if (!(view && view._domrange instanceof Blaze._DOMRange)) throw new Error("Expected template rendered with Blaze.render");

  while (view) {
    if (!view.isDestroyed) {
      var range = view._domrange;
      if (range.attached && !range.parentRange) range.detach();
      range.destroy();
    }

    view = view._hasGeneratedParent && view.parentView;
  }
};
/**
 * @summary Renders a template or View to a string of HTML.
 * @locus Client
 * @param {Template|Blaze.View} templateOrView The template (e.g. `Template.myTemplate`) or View object from which to generate HTML.
 */


Blaze.toHTML = function (content, parentView) {
  parentView = parentView || currentViewIfRendering();
  return HTML.toHTML(Blaze._expandView(contentAsView(content), parentView));
};
/**
 * @summary Renders a template or View to HTML with a data context.  Otherwise identical to `Blaze.toHTML`.
 * @locus Client
 * @param {Template|Blaze.View} templateOrView The template (e.g. `Template.myTemplate`) or View object from which to generate HTML.
 * @param {Object|Function} data The data context to use, or a function returning a data context.
 */


Blaze.toHTMLWithData = function (content, data, parentView) {
  parentView = parentView || currentViewIfRendering();
  return HTML.toHTML(Blaze._expandView(Blaze._TemplateWith(data, contentAsFunc(content)), parentView));
};

Blaze._toText = function (htmljs, parentView, textMode) {
  if (typeof htmljs === 'function') throw new Error("Blaze._toText doesn't take a function, just HTMLjs");

  if (parentView != null && !(parentView instanceof Blaze.View)) {
    // omitted parentView argument
    textMode = parentView;
    parentView = null;
  }

  parentView = parentView || currentViewIfRendering();
  if (!textMode) throw new Error("textMode required");
  if (!(textMode === HTML.TEXTMODE.STRING || textMode === HTML.TEXTMODE.RCDATA || textMode === HTML.TEXTMODE.ATTRIBUTE)) throw new Error("Unknown textMode: " + textMode);
  return HTML.toText(Blaze._expand(htmljs, parentView), textMode);
};
/**
 * @summary Returns the current data context, or the data context that was used when rendering a particular DOM element or View from a Meteor template.
 * @locus Client
 * @param {DOMElement|Blaze.View} [elementOrView] Optional.  An element that was rendered by a Meteor, or a View.
 */


Blaze.getData = function (elementOrView) {
  var theWith;

  if (!elementOrView) {
    theWith = Blaze.getView('with');
  } else if (elementOrView instanceof Blaze.View) {
    var view = elementOrView;
    theWith = view.name === 'with' ? view : Blaze.getView(view, 'with');
  } else if (typeof elementOrView.nodeType === 'number') {
    if (elementOrView.nodeType !== 1) throw new Error("Expected DOM element");
    theWith = Blaze.getView(elementOrView, 'with');
  } else {
    throw new Error("Expected DOM element or View");
  }

  return theWith ? theWith.dataVar.get() : null;
}; // For back-compat


Blaze.getElementData = function (element) {
  Blaze._warn("Blaze.getElementData has been deprecated.  Use " + "Blaze.getData(element) instead.");

  if (element.nodeType !== 1) throw new Error("Expected DOM element");
  return Blaze.getData(element);
}; // Both arguments are optional.

/**
 * @summary Gets either the current View, or the View enclosing the given DOM element.
 * @locus Client
 * @param {DOMElement} [element] Optional.  If specified, the View enclosing `element` is returned.
 */


Blaze.getView = function (elementOrView, _viewName) {
  var viewName = _viewName;

  if (typeof elementOrView === 'string') {
    // omitted elementOrView; viewName present
    viewName = elementOrView;
    elementOrView = null;
  } // We could eventually shorten the code by folding the logic
  // from the other methods into this method.


  if (!elementOrView) {
    return Blaze._getCurrentView(viewName);
  } else if (elementOrView instanceof Blaze.View) {
    return Blaze._getParentView(elementOrView, viewName);
  } else if (typeof elementOrView.nodeType === 'number') {
    return Blaze._getElementView(elementOrView, viewName);
  } else {
    throw new Error("Expected DOM element or View");
  }
}; // Gets the current view or its nearest ancestor of name
// `name`.


Blaze._getCurrentView = function (name) {
  var view = Blaze.currentView; // Better to fail in cases where it doesn't make sense
  // to use Blaze._getCurrentView().  There will be a current
  // view anywhere it does.  You can check Blaze.currentView
  // if you want to know whether there is one or not.

  if (!view) throw new Error("There is no current view");

  if (name) {
    while (view && view.name !== name) view = view.parentView;

    return view || null;
  } else {
    // Blaze._getCurrentView() with no arguments just returns
    // Blaze.currentView.
    return view;
  }
};

Blaze._getParentView = function (view, name) {
  var v = view.parentView;

  if (name) {
    while (v && v.name !== name) v = v.parentView;
  }

  return v || null;
};

Blaze._getElementView = function (elem, name) {
  var range = Blaze._DOMRange.forElement(elem);

  var view = null;

  while (range && !view) {
    view = range.view || null;

    if (!view) {
      if (range.parentRange) range = range.parentRange;else range = Blaze._DOMRange.forElement(range.parentElement);
    }
  }

  if (name) {
    while (view && view.name !== name) view = view.parentView;

    return view || null;
  } else {
    return view;
  }
};

Blaze._addEventMap = function (view, eventMap, thisInHandler) {
  thisInHandler = thisInHandler || null;
  var handles = [];
  if (!view._domrange) throw new Error("View must have a DOMRange");

  view._domrange.onAttached(function attached_eventMaps(range, element) {
    _.each(eventMap, function (handler, spec) {
      var clauses = spec.split(/,\s+/); // iterate over clauses of spec, e.g. ['click .foo', 'click .bar']

      _.each(clauses, function (clause) {
        var parts = clause.split(/\s+/);
        if (parts.length === 0) return;
        var newEvents = parts.shift();
        var selector = parts.join(' ');
        handles.push(Blaze._EventSupport.listen(element, newEvents, selector, function (evt) {
          if (!range.containsElement(evt.currentTarget)) return null;
          var handlerThis = thisInHandler || this;
          var handlerArgs = arguments;
          return Blaze._withCurrentView(view, function () {
            return handler.apply(handlerThis, handlerArgs);
          });
        }, range, function (r) {
          return r.parentRange;
        }));
      });
    });
  });

  view.onViewDestroyed(function () {
    _.each(handles, function (h) {
      h.stop();
    });

    handles.length = 0;
  });
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"builtins.js":function module(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/blaze/builtins.js                                                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Blaze._calculateCondition = function (cond) {
  if (cond instanceof Array && cond.length === 0) cond = false;
  return !!cond;
};
/**
 * @summary Constructs a View that renders content with a data context.
 * @locus Client
 * @param {Object|Function} data An object to use as the data context, or a function returning such an object.  If a function is provided, it will be reactively re-run.
 * @param {Function} contentFunc A Function that returns [*renderable content*](#Renderable-Content).
 */


Blaze.With = function (data, contentFunc) {
  var view = Blaze.View('with', contentFunc);
  view.dataVar = new ReactiveVar();
  view.onViewCreated(function () {
    if (typeof data === 'function') {
      // `data` is a reactive function
      view.autorun(function () {
        view.dataVar.set(data());
      }, view.parentView, 'setData');
    } else {
      view.dataVar.set(data);
    }
  });
  return view;
};
/**
 * Attaches bindings to the instantiated view.
 * @param {Object} bindings A dictionary of bindings, each binding name
 * corresponds to a value or a function that will be reactively re-run.
 * @param {View} view The target.
 */


Blaze._attachBindingsToView = function (bindings, view) {
  view.onViewCreated(function () {
    _.each(bindings, function (binding, name) {
      view._scopeBindings[name] = new ReactiveVar();

      if (typeof binding === 'function') {
        view.autorun(function () {
          view._scopeBindings[name].set(binding());
        }, view.parentView);
      } else {
        view._scopeBindings[name].set(binding);
      }
    });
  });
};
/**
 * @summary Constructs a View setting the local lexical scope in the block.
 * @param {Function} bindings Dictionary mapping names of bindings to
 * values or computations to reactively re-run.
 * @param {Function} contentFunc A Function that returns [*renderable content*](#Renderable-Content).
 */


Blaze.Let = function (bindings, contentFunc) {
  var view = Blaze.View('let', contentFunc);

  Blaze._attachBindingsToView(bindings, view);

  return view;
};
/**
 * @summary Constructs a View that renders content conditionally.
 * @locus Client
 * @param {Function} conditionFunc A function to reactively re-run.  Whether the result is truthy or falsy determines whether `contentFunc` or `elseFunc` is shown.  An empty array is considered falsy.
 * @param {Function} contentFunc A Function that returns [*renderable content*](#Renderable-Content).
 * @param {Function} [elseFunc] Optional.  A Function that returns [*renderable content*](#Renderable-Content).  If no `elseFunc` is supplied, no content is shown in the "else" case.
 */


Blaze.If = function (conditionFunc, contentFunc, elseFunc, _not) {
  var conditionVar = new ReactiveVar();
  var view = Blaze.View(_not ? 'unless' : 'if', function () {
    return conditionVar.get() ? contentFunc() : elseFunc ? elseFunc() : null;
  });
  view.__conditionVar = conditionVar;
  view.onViewCreated(function () {
    this.autorun(function () {
      var cond = Blaze._calculateCondition(conditionFunc());

      conditionVar.set(_not ? !cond : cond);
    }, this.parentView, 'condition');
  });
  return view;
};
/**
 * @summary An inverted [`Blaze.If`](#Blaze-If).
 * @locus Client
 * @param {Function} conditionFunc A function to reactively re-run.  If the result is falsy, `contentFunc` is shown, otherwise `elseFunc` is shown.  An empty array is considered falsy.
 * @param {Function} contentFunc A Function that returns [*renderable content*](#Renderable-Content).
 * @param {Function} [elseFunc] Optional.  A Function that returns [*renderable content*](#Renderable-Content).  If no `elseFunc` is supplied, no content is shown in the "else" case.
 */


Blaze.Unless = function (conditionFunc, contentFunc, elseFunc) {
  return Blaze.If(conditionFunc, contentFunc, elseFunc, true
  /*_not*/
  );
};
/**
 * @summary Constructs a View that renders `contentFunc` for each item in a sequence.
 * @locus Client
 * @param {Function} argFunc A function to reactively re-run. The function can
 * return one of two options:
 *
 * 1. An object with two fields: '_variable' and '_sequence'. Each iterates over
 *   '_sequence', it may be a Cursor, an array, null, or undefined. Inside the
 *   Each body you will be able to get the current item from the sequence using
 *   the name specified in the '_variable' field.
 *
 * 2. Just a sequence (Cursor, array, null, or undefined) not wrapped into an
 *   object. Inside the Each body, the current item will be set as the data
 *   context.
 * @param {Function} contentFunc A Function that returns  [*renderable
 * content*](#Renderable-Content).
 * @param {Function} [elseFunc] A Function that returns [*renderable
 * content*](#Renderable-Content) to display in the case when there are no items
 * in the sequence.
 */


Blaze.Each = function (argFunc, contentFunc, elseFunc) {
  var eachView = Blaze.View('each', function () {
    var subviews = this.initialSubviews;
    this.initialSubviews = null;

    if (this._isCreatedForExpansion) {
      this.expandedValueDep = new Tracker.Dependency();
      this.expandedValueDep.depend();
    }

    return subviews;
  });
  eachView.initialSubviews = [];
  eachView.numItems = 0;
  eachView.inElseMode = false;
  eachView.stopHandle = null;
  eachView.contentFunc = contentFunc;
  eachView.elseFunc = elseFunc;
  eachView.argVar = new ReactiveVar();
  eachView.variableName = null; // update the @index value in the scope of all subviews in the range

  var updateIndices = function (from, to) {
    if (to === undefined) {
      to = eachView.numItems - 1;
    }

    for (var i = from; i <= to; i++) {
      var view = eachView._domrange.members[i].view;

      view._scopeBindings['@index'].set(i);
    }
  };

  eachView.onViewCreated(function () {
    // We evaluate argFunc in an autorun to make sure
    // Blaze.currentView is always set when it runs (rather than
    // passing argFunc straight to ObserveSequence).
    eachView.autorun(function () {
      // argFunc can return either a sequence as is or a wrapper object with a
      // _sequence and _variable fields set.
      var arg = argFunc();

      if (_.isObject(arg) && _.has(arg, '_sequence')) {
        eachView.variableName = arg._variable || null;
        arg = arg._sequence;
      }

      eachView.argVar.set(arg);
    }, eachView.parentView, 'collection');
    eachView.stopHandle = ObserveSequence.observe(function () {
      return eachView.argVar.get();
    }, {
      addedAt: function (id, item, index) {
        Tracker.nonreactive(function () {
          var newItemView;

          if (eachView.variableName) {
            // new-style #each (as in {{#each item in items}})
            // doesn't create a new data context
            newItemView = Blaze.View('item', eachView.contentFunc);
          } else {
            newItemView = Blaze.With(item, eachView.contentFunc);
          }

          eachView.numItems++;
          var bindings = {};
          bindings['@index'] = index;

          if (eachView.variableName) {
            bindings[eachView.variableName] = item;
          }

          Blaze._attachBindingsToView(bindings, newItemView);

          if (eachView.expandedValueDep) {
            eachView.expandedValueDep.changed();
          } else if (eachView._domrange) {
            if (eachView.inElseMode) {
              eachView._domrange.removeMember(0);

              eachView.inElseMode = false;
            }

            var range = Blaze._materializeView(newItemView, eachView);

            eachView._domrange.addMember(range, index);

            updateIndices(index);
          } else {
            eachView.initialSubviews.splice(index, 0, newItemView);
          }
        });
      },
      removedAt: function (id, item, index) {
        Tracker.nonreactive(function () {
          eachView.numItems--;

          if (eachView.expandedValueDep) {
            eachView.expandedValueDep.changed();
          } else if (eachView._domrange) {
            eachView._domrange.removeMember(index);

            updateIndices(index);

            if (eachView.elseFunc && eachView.numItems === 0) {
              eachView.inElseMode = true;

              eachView._domrange.addMember(Blaze._materializeView(Blaze.View('each_else', eachView.elseFunc), eachView), 0);
            }
          } else {
            eachView.initialSubviews.splice(index, 1);
          }
        });
      },
      changedAt: function (id, newItem, oldItem, index) {
        Tracker.nonreactive(function () {
          if (eachView.expandedValueDep) {
            eachView.expandedValueDep.changed();
          } else {
            var itemView;

            if (eachView._domrange) {
              itemView = eachView._domrange.getMember(index).view;
            } else {
              itemView = eachView.initialSubviews[index];
            }

            if (eachView.variableName) {
              itemView._scopeBindings[eachView.variableName].set(newItem);
            } else {
              itemView.dataVar.set(newItem);
            }
          }
        });
      },
      movedTo: function (id, item, fromIndex, toIndex) {
        Tracker.nonreactive(function () {
          if (eachView.expandedValueDep) {
            eachView.expandedValueDep.changed();
          } else if (eachView._domrange) {
            eachView._domrange.moveMember(fromIndex, toIndex);

            updateIndices(Math.min(fromIndex, toIndex), Math.max(fromIndex, toIndex));
          } else {
            var subviews = eachView.initialSubviews;
            var itemView = subviews[fromIndex];
            subviews.splice(fromIndex, 1);
            subviews.splice(toIndex, 0, itemView);
          }
        });
      }
    });

    if (eachView.elseFunc && eachView.numItems === 0) {
      eachView.inElseMode = true;
      eachView.initialSubviews[0] = Blaze.View('each_else', eachView.elseFunc);
    }
  });
  eachView.onViewDestroyed(function () {
    if (eachView.stopHandle) eachView.stopHandle.stop();
  });
  return eachView;
};

Blaze._TemplateWith = function (arg, contentFunc) {
  var w;
  var argFunc = arg;

  if (typeof arg !== 'function') {
    argFunc = function () {
      return arg;
    };
  } // This is a little messy.  When we compile `{{> Template.contentBlock}}`, we
  // wrap it in Blaze._InOuterTemplateScope in order to skip the intermediate
  // parent Views in the current template.  However, when there's an argument
  // (`{{> Template.contentBlock arg}}`), the argument needs to be evaluated
  // in the original scope.  There's no good order to nest
  // Blaze._InOuterTemplateScope and Spacebars.TemplateWith to achieve this,
  // so we wrap argFunc to run it in the "original parentView" of the
  // Blaze._InOuterTemplateScope.
  //
  // To make this better, reconsider _InOuterTemplateScope as a primitive.
  // Longer term, evaluate expressions in the proper lexical scope.


  var wrappedArgFunc = function () {
    var viewToEvaluateArg = null;

    if (w.parentView && w.parentView.name === 'InOuterTemplateScope') {
      viewToEvaluateArg = w.parentView.originalParentView;
    }

    if (viewToEvaluateArg) {
      return Blaze._withCurrentView(viewToEvaluateArg, argFunc);
    } else {
      return argFunc();
    }
  };

  var wrappedContentFunc = function () {
    var content = contentFunc.call(this); // Since we are generating the Blaze._TemplateWith view for the
    // user, set the flag on the child view.  If `content` is a template,
    // construct the View so that we can set the flag.

    if (content instanceof Blaze.Template) {
      content = content.constructView();
    }

    if (content instanceof Blaze.View) {
      content._hasGeneratedParent = true;
    }

    return content;
  };

  w = Blaze.With(wrappedArgFunc, wrappedContentFunc);
  w.__isTemplateWith = true;
  return w;
};

Blaze._InOuterTemplateScope = function (templateView, contentFunc) {
  var view = Blaze.View('InOuterTemplateScope', contentFunc);
  var parentView = templateView.parentView; // Hack so that if you call `{{> foo bar}}` and it expands into
  // `{{#with bar}}{{> foo}}{{/with}}`, and then `foo` is a template
  // that inserts `{{> Template.contentBlock}}`, the data context for
  // `Template.contentBlock` is not `bar` but the one enclosing that.

  if (parentView.__isTemplateWith) parentView = parentView.parentView;
  view.onViewCreated(function () {
    this.originalParentView = this.parentView;
    this.parentView = parentView;
    this.__childDoesntStartNewLexicalScope = true;
  });
  return view;
}; // XXX COMPAT WITH 0.9.0


Blaze.InOuterTemplateScope = Blaze._InOuterTemplateScope;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lookup.js":function module(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/blaze/lookup.js                                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Blaze._globalHelpers = {}; // Documented as Template.registerHelper.
// This definition also provides back-compat for `UI.registerHelper`.

Blaze.registerHelper = function (name, func) {
  Blaze._globalHelpers[name] = func;
}; // Also documented as Template.deregisterHelper


Blaze.deregisterHelper = function (name) {
  delete Blaze._globalHelpers[name];
};

var bindIfIsFunction = function (x, target) {
  if (typeof x !== 'function') return x;
  return Blaze._bind(x, target);
}; // If `x` is a function, binds the value of `this` for that function
// to the current data context.


var bindDataContext = function (x) {
  if (typeof x === 'function') {
    return function () {
      var data = Blaze.getData();
      if (data == null) data = {};
      return x.apply(data, arguments);
    };
  }

  return x;
};

Blaze._OLDSTYLE_HELPER = {};

Blaze._getTemplateHelper = function (template, name, tmplInstanceFunc) {
  // XXX COMPAT WITH 0.9.3
  var isKnownOldStyleHelper = false;

  if (template.__helpers.has(name)) {
    var helper = template.__helpers.get(name);

    if (helper === Blaze._OLDSTYLE_HELPER) {
      isKnownOldStyleHelper = true;
    } else if (helper != null) {
      return wrapHelper(bindDataContext(helper), tmplInstanceFunc);
    } else {
      return null;
    }
  } // old-style helper


  if (name in template) {
    // Only warn once per helper
    if (!isKnownOldStyleHelper) {
      template.__helpers.set(name, Blaze._OLDSTYLE_HELPER);

      if (!template._NOWARN_OLDSTYLE_HELPERS) {
        Blaze._warn('Assigning helper with `' + template.viewName + '.' + name + ' = ...` is deprecated.  Use `' + template.viewName + '.helpers(...)` instead.');
      }
    }

    if (template[name] != null) {
      return wrapHelper(bindDataContext(template[name]), tmplInstanceFunc);
    }
  }

  return null;
};

var wrapHelper = function (f, templateFunc) {
  if (typeof f !== "function") {
    return f;
  }

  return function () {
    var self = this;
    var args = arguments;
    return Blaze.Template._withTemplateInstanceFunc(templateFunc, function () {
      return Blaze._wrapCatchingExceptions(f, 'template helper').apply(self, args);
    });
  };
};

Blaze._lexicalBindingLookup = function (view, name) {
  var currentView = view;
  var blockHelpersStack = []; // walk up the views stopping at a Spacebars.include or Template view that
  // doesn't have an InOuterTemplateScope view as a parent

  do {
    // skip block helpers views
    // if we found the binding on the scope, return it
    if (_.has(currentView._scopeBindings, name)) {
      var bindingReactiveVar = currentView._scopeBindings[name];
      return function () {
        return bindingReactiveVar.get();
      };
    }
  } while (!(currentView.__startsNewLexicalScope && !(currentView.parentView && currentView.parentView.__childDoesntStartNewLexicalScope)) && (currentView = currentView.parentView));

  return null;
}; // templateInstance argument is provided to be available for possible
// alternative implementations of this function by 3rd party packages.


Blaze._getTemplate = function (name, templateInstance) {
  if (name in Blaze.Template && Blaze.Template[name] instanceof Blaze.Template) {
    return Blaze.Template[name];
  }

  return null;
};

Blaze._getGlobalHelper = function (name, templateInstance) {
  if (Blaze._globalHelpers[name] != null) {
    return wrapHelper(bindDataContext(Blaze._globalHelpers[name]), templateInstance);
  }

  return null;
}; // Looks up a name, like "foo" or "..", as a helper of the
// current template; the name of a template; a global helper;
// or a property of the data context.  Called on the View of
// a template (i.e. a View with a `.template` property,
// where the helpers are).  Used for the first name in a
// "path" in a template tag, like "foo" in `{{foo.bar}}` or
// ".." in `{{frobulate ../blah}}`.
//
// Returns a function, a non-function value, or null.  If
// a function is found, it is bound appropriately.
//
// NOTE: This function must not establish any reactive
// dependencies itself.  If there is any reactivity in the
// value, lookup should return a function.


Blaze.View.prototype.lookup = function (name, _options) {
  var template = this.template;
  var lookupTemplate = _options && _options.template;
  var helper;
  var binding;
  var boundTmplInstance;
  var foundTemplate;

  if (this.templateInstance) {
    boundTmplInstance = Blaze._bind(this.templateInstance, this);
  } // 0. looking up the parent data context with the special "../" syntax


  if (/^\./.test(name)) {
    // starts with a dot. must be a series of dots which maps to an
    // ancestor of the appropriate height.
    if (!/^(\.)+$/.test(name)) throw new Error("id starting with dot must be a series of dots");
    return Blaze._parentData(name.length - 1, true
    /*_functionWrapped*/
    );
  } // 1. look up a helper on the current template


  if (template && (helper = Blaze._getTemplateHelper(template, name, boundTmplInstance)) != null) {
    return helper;
  } // 2. look up a binding by traversing the lexical view hierarchy inside the
  // current template


  if (template && (binding = Blaze._lexicalBindingLookup(Blaze.currentView, name)) != null) {
    return binding;
  } // 3. look up a template by name


  if (lookupTemplate && (foundTemplate = Blaze._getTemplate(name, boundTmplInstance)) != null) {
    return foundTemplate;
  } // 4. look up a global helper


  if ((helper = Blaze._getGlobalHelper(name, boundTmplInstance)) != null) {
    return helper;
  } // 5. look up in a data context


  return function () {
    var isCalledAsFunction = arguments.length > 0;
    var data = Blaze.getData();
    var x = data && data[name];

    if (!x) {
      if (lookupTemplate) {
        throw new Error("No such template: " + name);
      } else if (isCalledAsFunction) {
        throw new Error("No such function: " + name);
      } else if (name.charAt(0) === '@' && (x === null || x === undefined)) {
        // Throw an error if the user tries to use a `@directive`
        // that doesn't exist.  We don't implement all directives
        // from Handlebars, so there's a potential for confusion
        // if we fail silently.  On the other hand, we want to
        // throw late in case some app or package wants to provide
        // a missing directive.
        throw new Error("Unsupported directive: " + name);
      }
    }

    if (!data) {
      return null;
    }

    if (typeof x !== 'function') {
      if (isCalledAsFunction) {
        throw new Error("Can't call non-function: " + x);
      }

      return x;
    }

    return x.apply(data, arguments);
  };
}; // Implement Spacebars' {{../..}}.
// @param height {Number} The number of '..'s


Blaze._parentData = function (height, _functionWrapped) {
  // If height is null or undefined, we default to 1, the first parent.
  if (height == null) {
    height = 1;
  }

  var theWith = Blaze.getView('with');

  for (var i = 0; i < height && theWith; i++) {
    theWith = Blaze.getView(theWith, 'with');
  }

  if (!theWith) return null;
  if (_functionWrapped) return function () {
    return theWith.dataVar.get();
  };
  return theWith.dataVar.get();
};

Blaze.View.prototype.lookupTemplate = function (name) {
  return this.lookup(name, {
    template: true
  });
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"template.js":function module(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/blaze/template.js                                                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// [new] Blaze.Template([viewName], renderFunction)
//
// `Blaze.Template` is the class of templates, like `Template.foo` in
// Meteor, which is `instanceof Template`.
//
// `viewKind` is a string that looks like "Template.foo" for templates
// defined by the compiler.

/**
 * @class
 * @summary Constructor for a Template, which is used to construct Views with particular name and content.
 * @locus Client
 * @param {String} [viewName] Optional.  A name for Views constructed by this Template.  See [`view.name`](#view_name).
 * @param {Function} renderFunction A function that returns [*renderable content*](#Renderable-Content).  This function is used as the `renderFunction` for Views constructed by this Template.
 */
Blaze.Template = function (viewName, renderFunction) {
  if (!(this instanceof Blaze.Template)) // called without `new`
    return new Blaze.Template(viewName, renderFunction);

  if (typeof viewName === 'function') {
    // omitted "viewName" argument
    renderFunction = viewName;
    viewName = '';
  }

  if (typeof viewName !== 'string') throw new Error("viewName must be a String (or omitted)");
  if (typeof renderFunction !== 'function') throw new Error("renderFunction must be a function");
  this.viewName = viewName;
  this.renderFunction = renderFunction;
  this.__helpers = new HelperMap();
  this.__eventMaps = [];
  this._callbacks = {
    created: [],
    rendered: [],
    destroyed: []
  };
};

var Template = Blaze.Template;

var HelperMap = function () {};

HelperMap.prototype.get = function (name) {
  return this[' ' + name];
};

HelperMap.prototype.set = function (name, helper) {
  this[' ' + name] = helper;
};

HelperMap.prototype.has = function (name) {
  return typeof this[' ' + name] !== 'undefined';
};
/**
 * @summary Returns true if `value` is a template object like `Template.myTemplate`.
 * @locus Client
 * @param {Any} value The value to test.
 */


Blaze.isTemplate = function (t) {
  return t instanceof Blaze.Template;
};
/**
 * @name  onCreated
 * @instance
 * @memberOf Template
 * @summary Register a function to be called when an instance of this template is created.
 * @param {Function} callback A function to be added as a callback.
 * @locus Client
 * @importFromPackage templating
 */


Template.prototype.onCreated = function (cb) {
  this._callbacks.created.push(cb);
};
/**
 * @name  onRendered
 * @instance
 * @memberOf Template
 * @summary Register a function to be called when an instance of this template is inserted into the DOM.
 * @param {Function} callback A function to be added as a callback.
 * @locus Client
 * @importFromPackage templating
 */


Template.prototype.onRendered = function (cb) {
  this._callbacks.rendered.push(cb);
};
/**
 * @name  onDestroyed
 * @instance
 * @memberOf Template
 * @summary Register a function to be called when an instance of this template is removed from the DOM and destroyed.
 * @param {Function} callback A function to be added as a callback.
 * @locus Client
 * @importFromPackage templating
 */


Template.prototype.onDestroyed = function (cb) {
  this._callbacks.destroyed.push(cb);
};

Template.prototype._getCallbacks = function (which) {
  var self = this;
  var callbacks = self[which] ? [self[which]] : []; // Fire all callbacks added with the new API (Template.onRendered())
  // as well as the old-style callback (e.g. Template.rendered) for
  // backwards-compatibility.

  callbacks = callbacks.concat(self._callbacks[which]);
  return callbacks;
};

var fireCallbacks = function (callbacks, template) {
  Template._withTemplateInstanceFunc(function () {
    return template;
  }, function () {
    for (var i = 0, N = callbacks.length; i < N; i++) {
      callbacks[i].call(template);
    }
  });
};

Template.prototype.constructView = function (contentFunc, elseFunc) {
  var self = this;
  var view = Blaze.View(self.viewName, self.renderFunction);
  view.template = self;
  view.templateContentBlock = contentFunc ? new Template('(contentBlock)', contentFunc) : null;
  view.templateElseBlock = elseFunc ? new Template('(elseBlock)', elseFunc) : null;

  if (self.__eventMaps || typeof self.events === 'object') {
    view._onViewRendered(function () {
      if (view.renderCount !== 1) return;

      if (!self.__eventMaps.length && typeof self.events === "object") {
        // Provide limited back-compat support for `.events = {...}`
        // syntax.  Pass `template.events` to the original `.events(...)`
        // function.  This code must run only once per template, in
        // order to not bind the handlers more than once, which is
        // ensured by the fact that we only do this when `__eventMaps`
        // is falsy, and we cause it to be set now.
        Template.prototype.events.call(self, self.events);
      }

      _.each(self.__eventMaps, function (m) {
        Blaze._addEventMap(view, m, view);
      });
    });
  }

  view._templateInstance = new Blaze.TemplateInstance(view);

  view.templateInstance = function () {
    // Update data, firstNode, and lastNode, and return the TemplateInstance
    // object.
    var inst = view._templateInstance;
    /**
     * @instance
     * @memberOf Blaze.TemplateInstance
     * @name  data
     * @summary The data context of this instance's latest invocation.
     * @locus Client
     */

    inst.data = Blaze.getData(view);

    if (view._domrange && !view.isDestroyed) {
      inst.firstNode = view._domrange.firstNode();
      inst.lastNode = view._domrange.lastNode();
    } else {
      // on 'created' or 'destroyed' callbacks we don't have a DomRange
      inst.firstNode = null;
      inst.lastNode = null;
    }

    return inst;
  };
  /**
   * @name  created
   * @instance
   * @memberOf Template
   * @summary Provide a callback when an instance of a template is created.
   * @locus Client
   * @deprecated in 1.1
   */
  // To avoid situations when new callbacks are added in between view
  // instantiation and event being fired, decide on all callbacks to fire
  // immediately and then fire them on the event.


  var createdCallbacks = self._getCallbacks('created');

  view.onViewCreated(function () {
    fireCallbacks(createdCallbacks, view.templateInstance());
  });
  /**
   * @name  rendered
   * @instance
   * @memberOf Template
   * @summary Provide a callback when an instance of a template is rendered.
   * @locus Client
   * @deprecated in 1.1
   */

  var renderedCallbacks = self._getCallbacks('rendered');

  view.onViewReady(function () {
    fireCallbacks(renderedCallbacks, view.templateInstance());
  });
  /**
   * @name  destroyed
   * @instance
   * @memberOf Template
   * @summary Provide a callback when an instance of a template is destroyed.
   * @locus Client
   * @deprecated in 1.1
   */

  var destroyedCallbacks = self._getCallbacks('destroyed');

  view.onViewDestroyed(function () {
    fireCallbacks(destroyedCallbacks, view.templateInstance());
  });
  return view;
};
/**
 * @class
 * @summary The class for template instances
 * @param {Blaze.View} view
 * @instanceName template
 */


Blaze.TemplateInstance = function (view) {
  if (!(this instanceof Blaze.TemplateInstance)) // called without `new`
    return new Blaze.TemplateInstance(view);
  if (!(view instanceof Blaze.View)) throw new Error("View required");
  view._templateInstance = this;
  /**
   * @name view
   * @memberOf Blaze.TemplateInstance
   * @instance
   * @summary The [View](../api/blaze.html#Blaze-View) object for this invocation of the template.
   * @locus Client
   * @type {Blaze.View}
   */

  this.view = view;
  this.data = null;
  /**
   * @name firstNode
   * @memberOf Blaze.TemplateInstance
   * @instance
   * @summary The first top-level DOM node in this template instance.
   * @locus Client
   * @type {DOMNode}
   */

  this.firstNode = null;
  /**
   * @name lastNode
   * @memberOf Blaze.TemplateInstance
   * @instance
   * @summary The last top-level DOM node in this template instance.
   * @locus Client
   * @type {DOMNode}
   */

  this.lastNode = null; // This dependency is used to identify state transitions in
  // _subscriptionHandles which could cause the result of
  // TemplateInstance#subscriptionsReady to change. Basically this is triggered
  // whenever a new subscription handle is added or when a subscription handle
  // is removed and they are not ready.

  this._allSubsReadyDep = new Tracker.Dependency();
  this._allSubsReady = false;
  this._subscriptionHandles = {};
};
/**
 * @summary Find all elements matching `selector` in this template instance, and return them as a JQuery object.
 * @locus Client
 * @param {String} selector The CSS selector to match, scoped to the template contents.
 * @returns {DOMNode[]}
 */


Blaze.TemplateInstance.prototype.$ = function (selector) {
  var view = this.view;
  if (!view._domrange) throw new Error("Can't use $ on template instance with no DOM");
  return view._domrange.$(selector);
};
/**
 * @summary Find all elements matching `selector` in this template instance.
 * @locus Client
 * @param {String} selector The CSS selector to match, scoped to the template contents.
 * @returns {DOMElement[]}
 */


Blaze.TemplateInstance.prototype.findAll = function (selector) {
  return Array.prototype.slice.call(this.$(selector));
};
/**
 * @summary Find one element matching `selector` in this template instance.
 * @locus Client
 * @param {String} selector The CSS selector to match, scoped to the template contents.
 * @returns {DOMElement}
 */


Blaze.TemplateInstance.prototype.find = function (selector) {
  var result = this.$(selector);
  return result[0] || null;
};
/**
 * @summary A version of [Tracker.autorun](https://docs.meteor.com/api/tracker.html#Tracker-autorun) that is stopped when the template is destroyed.
 * @locus Client
 * @param {Function} runFunc The function to run. It receives one argument: a Tracker.Computation object.
 */


Blaze.TemplateInstance.prototype.autorun = function (f) {
  return this.view.autorun(f);
};
/**
 * @summary A version of [Meteor.subscribe](https://docs.meteor.com/api/pubsub.html#Meteor-subscribe) that is stopped
 * when the template is destroyed.
 * @return {SubscriptionHandle} The subscription handle to the newly made
 * subscription. Call `handle.stop()` to manually stop the subscription, or
 * `handle.ready()` to find out if this particular subscription has loaded all
 * of its inital data.
 * @locus Client
 * @param {String} name Name of the subscription.  Matches the name of the
 * server's `publish()` call.
 * @param {Any} [arg1,arg2...] Optional arguments passed to publisher function
 * on server.
 * @param {Function|Object} [options] If a function is passed instead of an
 * object, it is interpreted as an `onReady` callback.
 * @param {Function} [options.onReady] Passed to [`Meteor.subscribe`](https://docs.meteor.com/api/pubsub.html#Meteor-subscribe).
 * @param {Function} [options.onStop] Passed to [`Meteor.subscribe`](https://docs.meteor.com/api/pubsub.html#Meteor-subscribe).
 * @param {DDP.Connection} [options.connection] The connection on which to make the
 * subscription.
 */


Blaze.TemplateInstance.prototype.subscribe = function ()
/* arguments */
{
  var self = this;
  var subHandles = self._subscriptionHandles;

  var args = _.toArray(arguments); // Duplicate logic from Meteor.subscribe


  var options = {};

  if (args.length) {
    var lastParam = _.last(args); // Match pattern to check if the last arg is an options argument


    var lastParamOptionsPattern = {
      onReady: Match.Optional(Function),
      // XXX COMPAT WITH 1.0.3.1 onError used to exist, but now we use
      // onStop with an error callback instead.
      onError: Match.Optional(Function),
      onStop: Match.Optional(Function),
      connection: Match.Optional(Match.Any)
    };

    if (_.isFunction(lastParam)) {
      options.onReady = args.pop();
    } else if (lastParam && !_.isEmpty(lastParam) && Match.test(lastParam, lastParamOptionsPattern)) {
      options = args.pop();
    }
  }

  var subHandle;
  var oldStopped = options.onStop;

  options.onStop = function (error) {
    // When the subscription is stopped, remove it from the set of tracked
    // subscriptions to avoid this list growing without bound
    delete subHandles[subHandle.subscriptionId]; // Removing a subscription can only change the result of subscriptionsReady
    // if we are not ready (that subscription could be the one blocking us being
    // ready).

    if (!self._allSubsReady) {
      self._allSubsReadyDep.changed();
    }

    if (oldStopped) {
      oldStopped(error);
    }
  };

  var connection = options.connection;

  var callbacks = _.pick(options, ["onReady", "onError", "onStop"]); // The callbacks are passed as the last item in the arguments array passed to
  // View#subscribe


  args.push(callbacks); // View#subscribe takes the connection as one of the options in the last
  // argument

  subHandle = self.view.subscribe.call(self.view, args, {
    connection: connection
  });

  if (!_.has(subHandles, subHandle.subscriptionId)) {
    subHandles[subHandle.subscriptionId] = subHandle; // Adding a new subscription will always cause us to transition from ready
    // to not ready, but if we are already not ready then this can't make us
    // ready.

    if (self._allSubsReady) {
      self._allSubsReadyDep.changed();
    }
  }

  return subHandle;
};
/**
 * @summary A reactive function that returns true when all of the subscriptions
 * called with [this.subscribe](#TemplateInstance-subscribe) are ready.
 * @return {Boolean} True if all subscriptions on this template instance are
 * ready.
 */


Blaze.TemplateInstance.prototype.subscriptionsReady = function () {
  this._allSubsReadyDep.depend();

  this._allSubsReady = _.all(this._subscriptionHandles, function (handle) {
    return handle.ready();
  });
  return this._allSubsReady;
};
/**
 * @summary Specify template helpers available to this template.
 * @locus Client
 * @param {Object} helpers Dictionary of helper functions by name.
 * @importFromPackage templating
 */


Template.prototype.helpers = function (dict) {
  if (!_.isObject(dict)) {
    throw new Error("Helpers dictionary has to be an object");
  }

  for (var k in dict) this.__helpers.set(k, dict[k]);
};

var canUseGetters = function () {
  if (Object.defineProperty) {
    var obj = {};

    try {
      Object.defineProperty(obj, "self", {
        get: function () {
          return obj;
        }
      });
    } catch (e) {
      return false;
    }

    return obj.self === obj;
  }

  return false;
}();

if (canUseGetters) {
  // Like Blaze.currentView but for the template instance. A function
  // rather than a value so that not all helpers are implicitly dependent
  // on the current template instance's `data` property, which would make
  // them dependent on the data context of the template inclusion.
  var currentTemplateInstanceFunc = null; // If getters are supported, define this property with a getter function
  // to make it effectively read-only, and to work around this bizarre JSC
  // bug: https://github.com/meteor/meteor/issues/9926

  Object.defineProperty(Template, "_currentTemplateInstanceFunc", {
    get: function () {
      return currentTemplateInstanceFunc;
    }
  });

  Template._withTemplateInstanceFunc = function (templateInstanceFunc, func) {
    if (typeof func !== 'function') {
      throw new Error("Expected function, got: " + func);
    }

    var oldTmplInstanceFunc = currentTemplateInstanceFunc;

    try {
      currentTemplateInstanceFunc = templateInstanceFunc;
      return func();
    } finally {
      currentTemplateInstanceFunc = oldTmplInstanceFunc;
    }
  };
} else {
  // If getters are not supported, just use a normal property.
  Template._currentTemplateInstanceFunc = null;

  Template._withTemplateInstanceFunc = function (templateInstanceFunc, func) {
    if (typeof func !== 'function') {
      throw new Error("Expected function, got: " + func);
    }

    var oldTmplInstanceFunc = Template._currentTemplateInstanceFunc;

    try {
      Template._currentTemplateInstanceFunc = templateInstanceFunc;
      return func();
    } finally {
      Template._currentTemplateInstanceFunc = oldTmplInstanceFunc;
    }
  };
}
/**
 * @summary Specify event handlers for this template.
 * @locus Client
 * @param {EventMap} eventMap Event handlers to associate with this template.
 * @importFromPackage templating
 */


Template.prototype.events = function (eventMap) {
  if (!_.isObject(eventMap)) {
    throw new Error("Event map has to be an object");
  }

  var template = this;
  var eventMap2 = {};

  for (var k in eventMap) {
    eventMap2[k] = function (k, v) {
      return function (event
      /*, ...*/
      ) {
        var view = this; // passed by EventAugmenter

        var data = Blaze.getData(event.currentTarget);
        if (data == null) data = {};
        var args = Array.prototype.slice.call(arguments);

        var tmplInstanceFunc = Blaze._bind(view.templateInstance, view);

        args.splice(1, 0, tmplInstanceFunc());
        return Template._withTemplateInstanceFunc(tmplInstanceFunc, function () {
          return v.apply(data, args);
        });
      };
    }(k, eventMap[k]);
  }

  template.__eventMaps.push(eventMap2);
};
/**
 * @function
 * @name instance
 * @memberOf Template
 * @summary The [template instance](#Template-instances) corresponding to the current template helper, event handler, callback, or autorun.  If there isn't one, `null`.
 * @locus Client
 * @returns {Blaze.TemplateInstance}
 * @importFromPackage templating
 */


Template.instance = function () {
  return Template._currentTemplateInstanceFunc && Template._currentTemplateInstanceFunc();
}; // Note: Template.currentData() is documented to take zero arguments,
// while Blaze.getData takes up to one.

/**
 * @summary
 *
 * - Inside an `onCreated`, `onRendered`, or `onDestroyed` callback, returns
 * the data context of the template.
 * - Inside an event handler, returns the data context of the template on which
 * this event handler was defined.
 * - Inside a helper, returns the data context of the DOM node where the helper
 * was used.
 *
 * Establishes a reactive dependency on the result.
 * @locus Client
 * @function
 * @importFromPackage templating
 */


Template.currentData = Blaze.getData;
/**
 * @summary Accesses other data contexts that enclose the current data context.
 * @locus Client
 * @function
 * @param {Integer} [numLevels] The number of levels beyond the current data context to look. Defaults to 1.
 * @importFromPackage templating
 */

Template.parentData = Blaze._parentData;
/**
 * @summary Defines a [helper function](#Template-helpers) which can be used from all templates.
 * @locus Client
 * @function
 * @param {String} name The name of the helper function you are defining.
 * @param {Function} function The helper function itself.
 * @importFromPackage templating
 */

Template.registerHelper = Blaze.registerHelper;
/**
 * @summary Removes a global [helper function](#Template-helpers).
 * @locus Client
 * @function
 * @param {String} name The name of the helper function you are defining.
 * @importFromPackage templating
 */

Template.deregisterHelper = Blaze.deregisterHelper;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"backcompat.js":function module(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/blaze/backcompat.js                                                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
UI = Blaze;
Blaze.ReactiveVar = ReactiveVar;
UI._templateInstance = Blaze.Template.instance;
Handlebars = {};
Handlebars.registerHelper = Blaze.registerHelper;
Handlebars._escape = Blaze._escape; // Return these from {{...}} helpers to achieve the same as returning
// strings from {{{...}}} helpers

Handlebars.SafeString = function (string) {
  this.string = string;
};

Handlebars.SafeString.prototype.toString = function () {
  return this.string.toString();
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

require("/node_modules/meteor/blaze/preamble.js");
require("/node_modules/meteor/blaze/exceptions.js");
require("/node_modules/meteor/blaze/view.js");
require("/node_modules/meteor/blaze/builtins.js");
require("/node_modules/meteor/blaze/lookup.js");
require("/node_modules/meteor/blaze/template.js");
require("/node_modules/meteor/blaze/backcompat.js");

/* Exports */
Package._define("blaze", {
  Blaze: Blaze,
  UI: UI,
  Handlebars: Handlebars
});

})();

//# sourceURL=meteor://💻app/packages/blaze.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvYmxhemUvcHJlYW1ibGUuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2JsYXplL2V4Y2VwdGlvbnMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2JsYXplL3ZpZXcuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2JsYXplL2J1aWx0aW5zLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9ibGF6ZS9sb29rdXAuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2JsYXplL3RlbXBsYXRlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9ibGF6ZS9iYWNrY29tcGF0LmpzIl0sIm5hbWVzIjpbIkJsYXplIiwiX2VzY2FwZSIsImVzY2FwZV9tYXAiLCJlc2NhcGVfb25lIiwiYyIsIngiLCJyZXBsYWNlIiwiX3dhcm4iLCJtc2ciLCJjb25zb2xlIiwid2FybiIsIm5hdGl2ZUJpbmQiLCJGdW5jdGlvbiIsInByb3RvdHlwZSIsImJpbmQiLCJfYmluZCIsImZ1bmMiLCJvYmoiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJjYWxsIiwiYXJncyIsIkFycmF5IiwiaSIsImFwcGx5Iiwic2xpY2UiLCJfIiwiZGVidWdGdW5jIiwiX3Rocm93TmV4dEV4Y2VwdGlvbiIsIl9yZXBvcnRFeGNlcHRpb24iLCJlIiwiTWV0ZW9yIiwiX2RlYnVnIiwibG9nIiwic3RhY2siLCJtZXNzYWdlIiwiX3dyYXBDYXRjaGluZ0V4Y2VwdGlvbnMiLCJmIiwid2hlcmUiLCJWaWV3IiwibmFtZSIsInJlbmRlciIsIl9yZW5kZXIiLCJfY2FsbGJhY2tzIiwiY3JlYXRlZCIsInJlbmRlcmVkIiwiZGVzdHJveWVkIiwiaXNDcmVhdGVkIiwiX2lzQ3JlYXRlZEZvckV4cGFuc2lvbiIsImlzUmVuZGVyZWQiLCJfaXNBdHRhY2hlZCIsImlzRGVzdHJveWVkIiwiX2lzSW5SZW5kZXIiLCJwYXJlbnRWaWV3IiwiX2RvbXJhbmdlIiwiX2hhc0dlbmVyYXRlZFBhcmVudCIsIl9zY29wZUJpbmRpbmdzIiwicmVuZGVyQ291bnQiLCJvblZpZXdDcmVhdGVkIiwiY2IiLCJwdXNoIiwiX29uVmlld1JlbmRlcmVkIiwib25WaWV3UmVhZHkiLCJzZWxmIiwiZmlyZSIsIlRyYWNrZXIiLCJhZnRlckZsdXNoIiwiX3dpdGhDdXJyZW50VmlldyIsIm9uVmlld1JlbmRlcmVkIiwiYXR0YWNoZWQiLCJvbkF0dGFjaGVkIiwib25WaWV3RGVzdHJveWVkIiwicmVtb3ZlVmlld0Rlc3Ryb3llZExpc3RlbmVyIiwiaW5kZXgiLCJsYXN0SW5kZXhPZiIsImF1dG9ydW4iLCJfaW5WaWV3U2NvcGUiLCJkaXNwbGF5TmFtZSIsIkVycm9yIiwidGVtcGxhdGVJbnN0YW5jZUZ1bmMiLCJUZW1wbGF0ZSIsIl9jdXJyZW50VGVtcGxhdGVJbnN0YW5jZUZ1bmMiLCJ2aWV3QXV0b3J1biIsIl93aXRoVGVtcGxhdGVJbnN0YW5jZUZ1bmMiLCJjb21wIiwic3RvcENvbXB1dGF0aW9uIiwic3RvcCIsIm9uU3RvcCIsIl9lcnJvcklmU2hvdWxkbnRDYWxsU3Vic2NyaWJlIiwic3Vic2NyaWJlIiwib3B0aW9ucyIsInN1YkhhbmRsZSIsImNvbm5lY3Rpb24iLCJmaXJzdE5vZGUiLCJsYXN0Tm9kZSIsIl9maXJlQ2FsbGJhY2tzIiwidmlldyIsIndoaWNoIiwibm9ucmVhY3RpdmUiLCJmaXJlQ2FsbGJhY2tzIiwiY2JzIiwiTiIsIl9jcmVhdGVWaWV3IiwiZm9yRXhwYW5zaW9uIiwiZG9GaXJzdFJlbmRlciIsImluaXRpYWxDb250ZW50IiwiZG9tcmFuZ2UiLCJfRE9NUmFuZ2UiLCJ0ZWFyZG93bkhvb2siLCJyYW5nZSIsImVsZW1lbnQiLCJfRE9NQmFja2VuZCIsIlRlYXJkb3duIiwib25FbGVtZW50VGVhcmRvd24iLCJ0ZWFyZG93biIsIl9kZXN0cm95VmlldyIsIl9tYXRlcmlhbGl6ZVZpZXciLCJfd29ya1N0YWNrIiwiX2ludG9BcnJheSIsImxhc3RIdG1sanMiLCJkb1JlbmRlciIsImh0bWxqcyIsImZpcnN0UnVuIiwiX2lzQ29udGVudEVxdWFsIiwiZG9NYXRlcmlhbGl6ZSIsInJhbmdlc0FuZE5vZGVzIiwiX21hdGVyaWFsaXplRE9NIiwic2V0TWVtYmVycyIsIm9uSW52YWxpZGF0ZSIsImRlc3Ryb3lNZW1iZXJzIiwidW5kZWZpbmVkIiwiaW5pdGlhbENvbnRlbnRzIiwiX2V4cGFuZFZpZXciLCJyZXN1bHQiLCJfZXhwYW5kIiwiYWN0aXZlIiwiX0hUTUxKU0V4cGFuZGVyIiwiSFRNTCIsIlRyYW5zZm9ybWluZ1Zpc2l0b3IiLCJleHRlbmQiLCJkZWYiLCJ2aXNpdE9iamVjdCIsImNvbnN0cnVjdFZpZXciLCJ2aXNpdEF0dHJpYnV0ZXMiLCJhdHRycyIsInZpc2l0QXR0cmlidXRlIiwidmFsdWUiLCJ0YWciLCJjdXJyZW50Vmlld0lmUmVuZGVyaW5nIiwiY3VycmVudFZpZXciLCJ2aXNpdCIsIl9leHBhbmRBdHRyaWJ1dGVzIiwiX3NraXBOb2RlcyIsIl9kZXN0cm95Tm9kZSIsIm5vZGUiLCJub2RlVHlwZSIsInRlYXJEb3duRWxlbWVudCIsImEiLCJiIiwiUmF3Iiwib2xkVmlldyIsImNoZWNrUmVuZGVyQ29udGVudCIsImNvbnRlbnQiLCJWaXNpdG9yIiwiY29udGVudEFzVmlldyIsImNvbnRlbnRBc0Z1bmMiLCJwYXJlbnRFbGVtZW50IiwibmV4dE5vZGUiLCJhdHRhY2giLCJpbnNlcnQiLCJyZW5kZXJXaXRoRGF0YSIsImRhdGEiLCJfVGVtcGxhdGVXaXRoIiwicmVtb3ZlIiwicGFyZW50UmFuZ2UiLCJkZXRhY2giLCJkZXN0cm95IiwidG9IVE1MIiwidG9IVE1MV2l0aERhdGEiLCJfdG9UZXh0IiwidGV4dE1vZGUiLCJURVhUTU9ERSIsIlNUUklORyIsIlJDREFUQSIsIkFUVFJJQlVURSIsInRvVGV4dCIsImdldERhdGEiLCJlbGVtZW50T3JWaWV3IiwidGhlV2l0aCIsImdldFZpZXciLCJkYXRhVmFyIiwiZ2V0IiwiZ2V0RWxlbWVudERhdGEiLCJfdmlld05hbWUiLCJ2aWV3TmFtZSIsIl9nZXRDdXJyZW50VmlldyIsIl9nZXRQYXJlbnRWaWV3IiwiX2dldEVsZW1lbnRWaWV3IiwidiIsImVsZW0iLCJmb3JFbGVtZW50IiwiX2FkZEV2ZW50TWFwIiwiZXZlbnRNYXAiLCJ0aGlzSW5IYW5kbGVyIiwiaGFuZGxlcyIsImF0dGFjaGVkX2V2ZW50TWFwcyIsImVhY2giLCJoYW5kbGVyIiwic3BlYyIsImNsYXVzZXMiLCJzcGxpdCIsImNsYXVzZSIsInBhcnRzIiwibmV3RXZlbnRzIiwic2hpZnQiLCJzZWxlY3RvciIsImpvaW4iLCJfRXZlbnRTdXBwb3J0IiwibGlzdGVuIiwiZXZ0IiwiY29udGFpbnNFbGVtZW50IiwiY3VycmVudFRhcmdldCIsImhhbmRsZXJUaGlzIiwiaGFuZGxlckFyZ3MiLCJyIiwiaCIsIl9jYWxjdWxhdGVDb25kaXRpb24iLCJjb25kIiwiV2l0aCIsImNvbnRlbnRGdW5jIiwiUmVhY3RpdmVWYXIiLCJzZXQiLCJfYXR0YWNoQmluZGluZ3NUb1ZpZXciLCJiaW5kaW5ncyIsImJpbmRpbmciLCJMZXQiLCJJZiIsImNvbmRpdGlvbkZ1bmMiLCJlbHNlRnVuYyIsIl9ub3QiLCJjb25kaXRpb25WYXIiLCJfX2NvbmRpdGlvblZhciIsIlVubGVzcyIsIkVhY2giLCJhcmdGdW5jIiwiZWFjaFZpZXciLCJzdWJ2aWV3cyIsImluaXRpYWxTdWJ2aWV3cyIsImV4cGFuZGVkVmFsdWVEZXAiLCJEZXBlbmRlbmN5IiwiZGVwZW5kIiwibnVtSXRlbXMiLCJpbkVsc2VNb2RlIiwic3RvcEhhbmRsZSIsImFyZ1ZhciIsInZhcmlhYmxlTmFtZSIsInVwZGF0ZUluZGljZXMiLCJmcm9tIiwidG8iLCJtZW1iZXJzIiwiYXJnIiwiaXNPYmplY3QiLCJoYXMiLCJfdmFyaWFibGUiLCJfc2VxdWVuY2UiLCJPYnNlcnZlU2VxdWVuY2UiLCJvYnNlcnZlIiwiYWRkZWRBdCIsImlkIiwiaXRlbSIsIm5ld0l0ZW1WaWV3IiwiY2hhbmdlZCIsInJlbW92ZU1lbWJlciIsImFkZE1lbWJlciIsInNwbGljZSIsInJlbW92ZWRBdCIsImNoYW5nZWRBdCIsIm5ld0l0ZW0iLCJvbGRJdGVtIiwiaXRlbVZpZXciLCJnZXRNZW1iZXIiLCJtb3ZlZFRvIiwiZnJvbUluZGV4IiwidG9JbmRleCIsIm1vdmVNZW1iZXIiLCJNYXRoIiwibWluIiwibWF4IiwidyIsIndyYXBwZWRBcmdGdW5jIiwidmlld1RvRXZhbHVhdGVBcmciLCJvcmlnaW5hbFBhcmVudFZpZXciLCJ3cmFwcGVkQ29udGVudEZ1bmMiLCJfX2lzVGVtcGxhdGVXaXRoIiwiX0luT3V0ZXJUZW1wbGF0ZVNjb3BlIiwidGVtcGxhdGVWaWV3IiwiX19jaGlsZERvZXNudFN0YXJ0TmV3TGV4aWNhbFNjb3BlIiwiSW5PdXRlclRlbXBsYXRlU2NvcGUiLCJfZ2xvYmFsSGVscGVycyIsInJlZ2lzdGVySGVscGVyIiwiZGVyZWdpc3RlckhlbHBlciIsImJpbmRJZklzRnVuY3Rpb24iLCJ0YXJnZXQiLCJiaW5kRGF0YUNvbnRleHQiLCJfT0xEU1RZTEVfSEVMUEVSIiwiX2dldFRlbXBsYXRlSGVscGVyIiwidGVtcGxhdGUiLCJ0bXBsSW5zdGFuY2VGdW5jIiwiaXNLbm93bk9sZFN0eWxlSGVscGVyIiwiX19oZWxwZXJzIiwiaGVscGVyIiwid3JhcEhlbHBlciIsIl9OT1dBUk5fT0xEU1RZTEVfSEVMUEVSUyIsInRlbXBsYXRlRnVuYyIsIl9sZXhpY2FsQmluZGluZ0xvb2t1cCIsImJsb2NrSGVscGVyc1N0YWNrIiwiYmluZGluZ1JlYWN0aXZlVmFyIiwiX19zdGFydHNOZXdMZXhpY2FsU2NvcGUiLCJfZ2V0VGVtcGxhdGUiLCJ0ZW1wbGF0ZUluc3RhbmNlIiwiX2dldEdsb2JhbEhlbHBlciIsImxvb2t1cCIsIl9vcHRpb25zIiwibG9va3VwVGVtcGxhdGUiLCJib3VuZFRtcGxJbnN0YW5jZSIsImZvdW5kVGVtcGxhdGUiLCJ0ZXN0IiwiX3BhcmVudERhdGEiLCJpc0NhbGxlZEFzRnVuY3Rpb24iLCJjaGFyQXQiLCJoZWlnaHQiLCJfZnVuY3Rpb25XcmFwcGVkIiwicmVuZGVyRnVuY3Rpb24iLCJIZWxwZXJNYXAiLCJfX2V2ZW50TWFwcyIsImlzVGVtcGxhdGUiLCJ0Iiwib25DcmVhdGVkIiwib25SZW5kZXJlZCIsIm9uRGVzdHJveWVkIiwiX2dldENhbGxiYWNrcyIsImNhbGxiYWNrcyIsImNvbmNhdCIsInRlbXBsYXRlQ29udGVudEJsb2NrIiwidGVtcGxhdGVFbHNlQmxvY2siLCJldmVudHMiLCJtIiwiX3RlbXBsYXRlSW5zdGFuY2UiLCJUZW1wbGF0ZUluc3RhbmNlIiwiaW5zdCIsImNyZWF0ZWRDYWxsYmFja3MiLCJyZW5kZXJlZENhbGxiYWNrcyIsImRlc3Ryb3llZENhbGxiYWNrcyIsIl9hbGxTdWJzUmVhZHlEZXAiLCJfYWxsU3Vic1JlYWR5IiwiX3N1YnNjcmlwdGlvbkhhbmRsZXMiLCIkIiwiZmluZEFsbCIsImZpbmQiLCJzdWJIYW5kbGVzIiwidG9BcnJheSIsImxhc3RQYXJhbSIsImxhc3QiLCJsYXN0UGFyYW1PcHRpb25zUGF0dGVybiIsIm9uUmVhZHkiLCJNYXRjaCIsIk9wdGlvbmFsIiwib25FcnJvciIsIkFueSIsImlzRnVuY3Rpb24iLCJwb3AiLCJpc0VtcHR5Iiwib2xkU3RvcHBlZCIsImVycm9yIiwic3Vic2NyaXB0aW9uSWQiLCJwaWNrIiwic3Vic2NyaXB0aW9uc1JlYWR5IiwiYWxsIiwiaGFuZGxlIiwicmVhZHkiLCJoZWxwZXJzIiwiZGljdCIsImsiLCJjYW5Vc2VHZXR0ZXJzIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJjdXJyZW50VGVtcGxhdGVJbnN0YW5jZUZ1bmMiLCJvbGRUbXBsSW5zdGFuY2VGdW5jIiwiZXZlbnRNYXAyIiwiZXZlbnQiLCJpbnN0YW5jZSIsImN1cnJlbnREYXRhIiwicGFyZW50RGF0YSIsIlVJIiwiSGFuZGxlYmFycyIsIlNhZmVTdHJpbmciLCJzdHJpbmciLCJ0b1N0cmluZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFJQUEsS0FBSyxHQUFHLEVBQVIsQyxDQUVBO0FBQ0E7QUFDQTs7QUFDQUEsS0FBSyxDQUFDQyxPQUFOLEdBQWlCLFlBQVc7QUFDMUIsTUFBSUMsVUFBVSxHQUFHO0FBQ2YsU0FBSyxNQURVO0FBRWYsU0FBSyxNQUZVO0FBR2YsU0FBSyxRQUhVO0FBSWYsU0FBSyxRQUpVO0FBS2YsU0FBSyxRQUxVO0FBTWYsU0FBSyxRQU5VOztBQU1BO0FBQ2YsU0FBSztBQVBVLEdBQWpCOztBQVNBLE1BQUlDLFVBQVUsR0FBRyxVQUFTQyxDQUFULEVBQVk7QUFDM0IsV0FBT0YsVUFBVSxDQUFDRSxDQUFELENBQWpCO0FBQ0QsR0FGRDs7QUFJQSxTQUFPLFVBQVVDLENBQVYsRUFBYTtBQUNsQixXQUFPQSxDQUFDLENBQUNDLE9BQUYsQ0FBVSxXQUFWLEVBQXVCSCxVQUF2QixDQUFQO0FBQ0QsR0FGRDtBQUdELENBakJlLEVBQWhCOztBQW1CQUgsS0FBSyxDQUFDTyxLQUFOLEdBQWMsVUFBVUMsR0FBVixFQUFlO0FBQzNCQSxLQUFHLEdBQUcsY0FBY0EsR0FBcEI7O0FBRUEsTUFBSyxPQUFPQyxPQUFQLEtBQW1CLFdBQXBCLElBQW9DQSxPQUFPLENBQUNDLElBQWhELEVBQXNEO0FBQ3BERCxXQUFPLENBQUNDLElBQVIsQ0FBYUYsR0FBYjtBQUNEO0FBQ0YsQ0FORDs7QUFRQSxJQUFJRyxVQUFVLEdBQUdDLFFBQVEsQ0FBQ0MsU0FBVCxDQUFtQkMsSUFBcEMsQyxDQUVBO0FBQ0E7O0FBQ0EsSUFBSUgsVUFBSixFQUFnQjtBQUNkWCxPQUFLLENBQUNlLEtBQU4sR0FBYyxVQUFVQyxJQUFWLEVBQWdCQyxHQUFoQixFQUFxQjtBQUNqQyxRQUFJQyxTQUFTLENBQUNDLE1BQVYsS0FBcUIsQ0FBekIsRUFBNEI7QUFDMUIsYUFBT1IsVUFBVSxDQUFDUyxJQUFYLENBQWdCSixJQUFoQixFQUFzQkMsR0FBdEIsQ0FBUDtBQUNELEtBSGdDLENBS2pDOzs7QUFDQSxRQUFJSSxJQUFJLEdBQUcsSUFBSUMsS0FBSixDQUFVSixTQUFTLENBQUNDLE1BQXBCLENBQVg7O0FBQ0EsU0FBSyxJQUFJSSxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHRixJQUFJLENBQUNGLE1BQXpCLEVBQWlDSSxDQUFDLEVBQWxDLEVBQXNDO0FBQ3BDRixVQUFJLENBQUNFLENBQUQsQ0FBSixHQUFVTCxTQUFTLENBQUNLLENBQUQsQ0FBbkI7QUFDRDs7QUFFRCxXQUFPWixVQUFVLENBQUNhLEtBQVgsQ0FBaUJSLElBQWpCLEVBQXVCSyxJQUFJLENBQUNJLEtBQUwsQ0FBVyxDQUFYLENBQXZCLENBQVA7QUFDRCxHQVpEO0FBYUQsQ0FkRCxNQWVLO0FBQ0g7QUFDQXpCLE9BQUssQ0FBQ2UsS0FBTixHQUFjVyxDQUFDLENBQUNaLElBQWhCO0FBQ0QsQzs7Ozs7Ozs7Ozs7QUMxREQsSUFBSWEsU0FBSixDLENBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7O0FBQ0EzQixLQUFLLENBQUM0QixtQkFBTixHQUE0QixLQUE1Qjs7QUFFQTVCLEtBQUssQ0FBQzZCLGdCQUFOLEdBQXlCLFVBQVVDLENBQVYsRUFBYXRCLEdBQWIsRUFBa0I7QUFDekMsTUFBSVIsS0FBSyxDQUFDNEIsbUJBQVYsRUFBK0I7QUFDN0I1QixTQUFLLENBQUM0QixtQkFBTixHQUE0QixLQUE1QjtBQUNBLFVBQU1FLENBQU47QUFDRDs7QUFFRCxNQUFJLENBQUVILFNBQU4sRUFDRTtBQUNBQSxhQUFTLEdBQUcsWUFBWTtBQUN0QixhQUFRLE9BQU9JLE1BQVAsS0FBa0IsV0FBbEIsR0FBZ0NBLE1BQU0sQ0FBQ0MsTUFBdkMsR0FDRSxPQUFPdkIsT0FBUCxLQUFtQixXQUFwQixJQUFvQ0EsT0FBTyxDQUFDd0IsR0FBNUMsR0FBa0R4QixPQUFPLENBQUN3QixHQUExRCxHQUNBLFlBQVksQ0FBRSxDQUZ2QjtBQUdELEtBSkQsQ0FSdUMsQ0FjekM7QUFDQTtBQUNBOztBQUNBTixXQUFTLEdBQUduQixHQUFHLElBQUksK0JBQVYsRUFBMkNzQixDQUFDLENBQUNJLEtBQUYsSUFBV0osQ0FBQyxDQUFDSyxPQUFiLElBQXdCTCxDQUFuRSxDQUFUO0FBQ0QsQ0FsQkQ7O0FBb0JBOUIsS0FBSyxDQUFDb0MsdUJBQU4sR0FBZ0MsVUFBVUMsQ0FBVixFQUFhQyxLQUFiLEVBQW9CO0FBQ2xELE1BQUksT0FBT0QsQ0FBUCxLQUFhLFVBQWpCLEVBQ0UsT0FBT0EsQ0FBUDtBQUVGLFNBQU8sWUFBWTtBQUNqQixRQUFJO0FBQ0YsYUFBT0EsQ0FBQyxDQUFDYixLQUFGLENBQVEsSUFBUixFQUFjTixTQUFkLENBQVA7QUFDRCxLQUZELENBRUUsT0FBT1ksQ0FBUCxFQUFVO0FBQ1Y5QixXQUFLLENBQUM2QixnQkFBTixDQUF1QkMsQ0FBdkIsRUFBMEIsa0JBQWtCUSxLQUFsQixHQUEwQixHQUFwRDtBQUNEO0FBQ0YsR0FORDtBQU9ELENBWEQsQzs7Ozs7Ozs7Ozs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUFPQXRDLEtBQUssQ0FBQ3VDLElBQU4sR0FBYSxVQUFVQyxJQUFWLEVBQWdCQyxNQUFoQixFQUF3QjtBQUNuQyxNQUFJLEVBQUcsZ0JBQWdCekMsS0FBSyxDQUFDdUMsSUFBekIsQ0FBSixFQUNFO0FBQ0EsV0FBTyxJQUFJdkMsS0FBSyxDQUFDdUMsSUFBVixDQUFlQyxJQUFmLEVBQXFCQyxNQUFyQixDQUFQOztBQUVGLE1BQUksT0FBT0QsSUFBUCxLQUFnQixVQUFwQixFQUFnQztBQUM5QjtBQUNBQyxVQUFNLEdBQUdELElBQVQ7QUFDQUEsUUFBSSxHQUFHLEVBQVA7QUFDRDs7QUFDRCxPQUFLQSxJQUFMLEdBQVlBLElBQVo7QUFDQSxPQUFLRSxPQUFMLEdBQWVELE1BQWY7QUFFQSxPQUFLRSxVQUFMLEdBQWtCO0FBQ2hCQyxXQUFPLEVBQUUsSUFETztBQUVoQkMsWUFBUSxFQUFFLElBRk07QUFHaEJDLGFBQVMsRUFBRTtBQUhLLEdBQWxCLENBYm1DLENBbUJuQztBQUNBO0FBQ0E7O0FBQ0EsT0FBS0MsU0FBTCxHQUFpQixLQUFqQjtBQUNBLE9BQUtDLHNCQUFMLEdBQThCLEtBQTlCO0FBQ0EsT0FBS0MsVUFBTCxHQUFrQixLQUFsQjtBQUNBLE9BQUtDLFdBQUwsR0FBbUIsS0FBbkI7QUFDQSxPQUFLQyxXQUFMLEdBQW1CLEtBQW5CO0FBQ0EsT0FBS0MsV0FBTCxHQUFtQixLQUFuQjtBQUNBLE9BQUtDLFVBQUwsR0FBa0IsSUFBbEI7QUFDQSxPQUFLQyxTQUFMLEdBQWlCLElBQWpCLENBN0JtQyxDQThCbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQSxPQUFLQyxtQkFBTCxHQUEyQixLQUEzQixDQXRDbUMsQ0F1Q25DO0FBQ0E7O0FBQ0EsT0FBS0MsY0FBTCxHQUFzQixFQUF0QjtBQUVBLE9BQUtDLFdBQUwsR0FBbUIsQ0FBbkI7QUFDRCxDQTVDRDs7QUE4Q0F6RCxLQUFLLENBQUN1QyxJQUFOLENBQVcxQixTQUFYLENBQXFCNkIsT0FBckIsR0FBK0IsWUFBWTtBQUFFLFNBQU8sSUFBUDtBQUFjLENBQTNEOztBQUVBMUMsS0FBSyxDQUFDdUMsSUFBTixDQUFXMUIsU0FBWCxDQUFxQjZDLGFBQXJCLEdBQXFDLFVBQVVDLEVBQVYsRUFBYztBQUNqRCxPQUFLaEIsVUFBTCxDQUFnQkMsT0FBaEIsR0FBMEIsS0FBS0QsVUFBTCxDQUFnQkMsT0FBaEIsSUFBMkIsRUFBckQ7O0FBQ0EsT0FBS0QsVUFBTCxDQUFnQkMsT0FBaEIsQ0FBd0JnQixJQUF4QixDQUE2QkQsRUFBN0I7QUFDRCxDQUhEOztBQUtBM0QsS0FBSyxDQUFDdUMsSUFBTixDQUFXMUIsU0FBWCxDQUFxQmdELGVBQXJCLEdBQXVDLFVBQVVGLEVBQVYsRUFBYztBQUNuRCxPQUFLaEIsVUFBTCxDQUFnQkUsUUFBaEIsR0FBMkIsS0FBS0YsVUFBTCxDQUFnQkUsUUFBaEIsSUFBNEIsRUFBdkQ7O0FBQ0EsT0FBS0YsVUFBTCxDQUFnQkUsUUFBaEIsQ0FBeUJlLElBQXpCLENBQThCRCxFQUE5QjtBQUNELENBSEQ7O0FBS0EzRCxLQUFLLENBQUN1QyxJQUFOLENBQVcxQixTQUFYLENBQXFCaUQsV0FBckIsR0FBbUMsVUFBVUgsRUFBVixFQUFjO0FBQy9DLE1BQUlJLElBQUksR0FBRyxJQUFYOztBQUNBLE1BQUlDLElBQUksR0FBRyxZQUFZO0FBQ3JCQyxXQUFPLENBQUNDLFVBQVIsQ0FBbUIsWUFBWTtBQUM3QixVQUFJLENBQUVILElBQUksQ0FBQ1osV0FBWCxFQUF3QjtBQUN0Qm5ELGFBQUssQ0FBQ21FLGdCQUFOLENBQXVCSixJQUF2QixFQUE2QixZQUFZO0FBQ3ZDSixZQUFFLENBQUN2QyxJQUFILENBQVEyQyxJQUFSO0FBQ0QsU0FGRDtBQUdEO0FBQ0YsS0FORDtBQU9ELEdBUkQ7O0FBU0FBLE1BQUksQ0FBQ0YsZUFBTCxDQUFxQixTQUFTTyxjQUFULEdBQTBCO0FBQzdDLFFBQUlMLElBQUksQ0FBQ1osV0FBVCxFQUNFO0FBQ0YsUUFBSSxDQUFFWSxJQUFJLENBQUNULFNBQUwsQ0FBZWUsUUFBckIsRUFDRU4sSUFBSSxDQUFDVCxTQUFMLENBQWVnQixVQUFmLENBQTBCTixJQUExQixFQURGLEtBR0VBLElBQUk7QUFDUCxHQVBEO0FBUUQsQ0FuQkQ7O0FBcUJBaEUsS0FBSyxDQUFDdUMsSUFBTixDQUFXMUIsU0FBWCxDQUFxQjBELGVBQXJCLEdBQXVDLFVBQVVaLEVBQVYsRUFBYztBQUNuRCxPQUFLaEIsVUFBTCxDQUFnQkcsU0FBaEIsR0FBNEIsS0FBS0gsVUFBTCxDQUFnQkcsU0FBaEIsSUFBNkIsRUFBekQ7O0FBQ0EsT0FBS0gsVUFBTCxDQUFnQkcsU0FBaEIsQ0FBMEJjLElBQTFCLENBQStCRCxFQUEvQjtBQUNELENBSEQ7O0FBSUEzRCxLQUFLLENBQUN1QyxJQUFOLENBQVcxQixTQUFYLENBQXFCMkQsMkJBQXJCLEdBQW1ELFVBQVViLEVBQVYsRUFBYztBQUMvRCxNQUFJYixTQUFTLEdBQUcsS0FBS0gsVUFBTCxDQUFnQkcsU0FBaEM7QUFDQSxNQUFJLENBQUVBLFNBQU4sRUFDRTs7QUFDRixNQUFJMkIsS0FBSyxHQUFHL0MsQ0FBQyxDQUFDZ0QsV0FBRixDQUFjNUIsU0FBZCxFQUF5QmEsRUFBekIsQ0FBWjs7QUFDQSxNQUFJYyxLQUFLLEtBQUssQ0FBQyxDQUFmLEVBQWtCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EzQixhQUFTLENBQUMyQixLQUFELENBQVQsR0FBbUIsSUFBbkI7QUFDRDtBQUNGLENBWkQsQyxDQWNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQXpFLEtBQUssQ0FBQ3VDLElBQU4sQ0FBVzFCLFNBQVgsQ0FBcUI4RCxPQUFyQixHQUErQixVQUFVdEMsQ0FBVixFQUFhdUMsWUFBYixFQUEyQkMsV0FBM0IsRUFBd0M7QUFDckUsTUFBSWQsSUFBSSxHQUFHLElBQVgsQ0FEcUUsQ0FHckU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBLE1BQUksQ0FBRUEsSUFBSSxDQUFDaEIsU0FBWCxFQUFzQjtBQUNwQixVQUFNLElBQUkrQixLQUFKLENBQVUsdUVBQVYsQ0FBTjtBQUNEOztBQUNELE1BQUksS0FBSzFCLFdBQVQsRUFBc0I7QUFDcEIsVUFBTSxJQUFJMEIsS0FBSixDQUFVLG9HQUFWLENBQU47QUFDRDs7QUFFRCxNQUFJQyxvQkFBb0IsR0FBRy9FLEtBQUssQ0FBQ2dGLFFBQU4sQ0FBZUMsNEJBQTFDOztBQUVBLE1BQUlqRSxJQUFJLEdBQUcsU0FBU2tFLFdBQVQsQ0FBcUI5RSxDQUFyQixFQUF3QjtBQUNqQyxXQUFPSixLQUFLLENBQUNtRSxnQkFBTixDQUF1QlMsWUFBWSxJQUFJYixJQUF2QyxFQUE2QyxZQUFZO0FBQzlELGFBQU8vRCxLQUFLLENBQUNnRixRQUFOLENBQWVHLHlCQUFmLENBQ0xKLG9CQURLLEVBQ2lCLFlBQVk7QUFDaEMsZUFBTzFDLENBQUMsQ0FBQ2pCLElBQUYsQ0FBTzJDLElBQVAsRUFBYTNELENBQWIsQ0FBUDtBQUNELE9BSEksQ0FBUDtBQUlELEtBTE0sQ0FBUDtBQU1ELEdBUEQsQ0FqQ3FFLENBMENyRTtBQUNBO0FBQ0E7OztBQUNBWSxNQUFJLENBQUM2RCxXQUFMLEdBQ0UsQ0FBQ2QsSUFBSSxDQUFDdkIsSUFBTCxJQUFhLFdBQWQsSUFBNkIsR0FBN0IsSUFBb0NxQyxXQUFXLElBQUksV0FBbkQsQ0FERjtBQUVBLE1BQUlPLElBQUksR0FBR25CLE9BQU8sQ0FBQ1UsT0FBUixDQUFnQjNELElBQWhCLENBQVg7O0FBRUEsTUFBSXFFLGVBQWUsR0FBRyxZQUFZO0FBQUVELFFBQUksQ0FBQ0UsSUFBTDtBQUFjLEdBQWxEOztBQUNBdkIsTUFBSSxDQUFDUSxlQUFMLENBQXFCYyxlQUFyQjtBQUNBRCxNQUFJLENBQUNHLE1BQUwsQ0FBWSxZQUFZO0FBQ3RCeEIsUUFBSSxDQUFDUywyQkFBTCxDQUFpQ2EsZUFBakM7QUFDRCxHQUZEO0FBSUEsU0FBT0QsSUFBUDtBQUNELENBeEREOztBQTBEQXBGLEtBQUssQ0FBQ3VDLElBQU4sQ0FBVzFCLFNBQVgsQ0FBcUIyRSw2QkFBckIsR0FBcUQsWUFBWTtBQUMvRCxNQUFJekIsSUFBSSxHQUFHLElBQVg7O0FBRUEsTUFBSSxDQUFFQSxJQUFJLENBQUNoQixTQUFYLEVBQXNCO0FBQ3BCLFVBQU0sSUFBSStCLEtBQUosQ0FBVSx5RUFBVixDQUFOO0FBQ0Q7O0FBQ0QsTUFBSWYsSUFBSSxDQUFDWCxXQUFULEVBQXNCO0FBQ3BCLFVBQU0sSUFBSTBCLEtBQUosQ0FBVSxzR0FBVixDQUFOO0FBQ0Q7O0FBQ0QsTUFBSWYsSUFBSSxDQUFDWixXQUFULEVBQXNCO0FBQ3BCLFVBQU0sSUFBSTJCLEtBQUosQ0FBVSwwR0FBVixDQUFOO0FBQ0Q7QUFDRixDQVpEO0FBY0E7Ozs7Ozs7O0FBTUE5RSxLQUFLLENBQUN1QyxJQUFOLENBQVcxQixTQUFYLENBQXFCNEUsU0FBckIsR0FBaUMsVUFBVXBFLElBQVYsRUFBZ0JxRSxPQUFoQixFQUF5QjtBQUN4RCxNQUFJM0IsSUFBSSxHQUFHLElBQVg7QUFDQTJCLFNBQU8sR0FBR0EsT0FBTyxJQUFJLEVBQXJCOztBQUVBM0IsTUFBSSxDQUFDeUIsNkJBQUw7O0FBRUEsTUFBSUcsU0FBSjs7QUFDQSxNQUFJRCxPQUFPLENBQUNFLFVBQVosRUFBd0I7QUFDdEJELGFBQVMsR0FBR0QsT0FBTyxDQUFDRSxVQUFSLENBQW1CSCxTQUFuQixDQUE2QmpFLEtBQTdCLENBQW1Da0UsT0FBTyxDQUFDRSxVQUEzQyxFQUF1RHZFLElBQXZELENBQVo7QUFDRCxHQUZELE1BRU87QUFDTHNFLGFBQVMsR0FBRzVELE1BQU0sQ0FBQzBELFNBQVAsQ0FBaUJqRSxLQUFqQixDQUF1Qk8sTUFBdkIsRUFBK0JWLElBQS9CLENBQVo7QUFDRDs7QUFFRDBDLE1BQUksQ0FBQ1EsZUFBTCxDQUFxQixZQUFZO0FBQy9Cb0IsYUFBUyxDQUFDTCxJQUFWO0FBQ0QsR0FGRDtBQUlBLFNBQU9LLFNBQVA7QUFDRCxDQWxCRDs7QUFvQkEzRixLQUFLLENBQUN1QyxJQUFOLENBQVcxQixTQUFYLENBQXFCZ0YsU0FBckIsR0FBaUMsWUFBWTtBQUMzQyxNQUFJLENBQUUsS0FBSzNDLFdBQVgsRUFDRSxNQUFNLElBQUk0QixLQUFKLENBQVUsZ0RBQVYsQ0FBTjtBQUVGLFNBQU8sS0FBS3hCLFNBQUwsQ0FBZXVDLFNBQWYsRUFBUDtBQUNELENBTEQ7O0FBT0E3RixLQUFLLENBQUN1QyxJQUFOLENBQVcxQixTQUFYLENBQXFCaUYsUUFBckIsR0FBZ0MsWUFBWTtBQUMxQyxNQUFJLENBQUUsS0FBSzVDLFdBQVgsRUFDRSxNQUFNLElBQUk0QixLQUFKLENBQVUsZ0RBQVYsQ0FBTjtBQUVGLFNBQU8sS0FBS3hCLFNBQUwsQ0FBZXdDLFFBQWYsRUFBUDtBQUNELENBTEQ7O0FBT0E5RixLQUFLLENBQUMrRixjQUFOLEdBQXVCLFVBQVVDLElBQVYsRUFBZ0JDLEtBQWhCLEVBQXVCO0FBQzVDakcsT0FBSyxDQUFDbUUsZ0JBQU4sQ0FBdUI2QixJQUF2QixFQUE2QixZQUFZO0FBQ3ZDL0IsV0FBTyxDQUFDaUMsV0FBUixDQUFvQixTQUFTQyxhQUFULEdBQXlCO0FBQzNDLFVBQUlDLEdBQUcsR0FBR0osSUFBSSxDQUFDckQsVUFBTCxDQUFnQnNELEtBQWhCLENBQVY7O0FBQ0EsV0FBSyxJQUFJMUUsQ0FBQyxHQUFHLENBQVIsRUFBVzhFLENBQUMsR0FBSUQsR0FBRyxJQUFJQSxHQUFHLENBQUNqRixNQUFoQyxFQUF5Q0ksQ0FBQyxHQUFHOEUsQ0FBN0MsRUFBZ0Q5RSxDQUFDLEVBQWpELEVBQ0U2RSxHQUFHLENBQUM3RSxDQUFELENBQUgsSUFBVTZFLEdBQUcsQ0FBQzdFLENBQUQsQ0FBSCxDQUFPSCxJQUFQLENBQVk0RSxJQUFaLENBQVY7QUFDSCxLQUpEO0FBS0QsR0FORDtBQU9ELENBUkQ7O0FBVUFoRyxLQUFLLENBQUNzRyxXQUFOLEdBQW9CLFVBQVVOLElBQVYsRUFBZ0IzQyxVQUFoQixFQUE0QmtELFlBQTVCLEVBQTBDO0FBQzVELE1BQUlQLElBQUksQ0FBQ2pELFNBQVQsRUFDRSxNQUFNLElBQUkrQixLQUFKLENBQVUsa0NBQVYsQ0FBTjtBQUVGa0IsTUFBSSxDQUFDM0MsVUFBTCxHQUFtQkEsVUFBVSxJQUFJLElBQWpDO0FBQ0EyQyxNQUFJLENBQUNqRCxTQUFMLEdBQWlCLElBQWpCO0FBQ0EsTUFBSXdELFlBQUosRUFDRVAsSUFBSSxDQUFDaEQsc0JBQUwsR0FBOEIsSUFBOUI7O0FBRUZoRCxPQUFLLENBQUMrRixjQUFOLENBQXFCQyxJQUFyQixFQUEyQixTQUEzQjtBQUNELENBVkQ7O0FBWUEsSUFBSVEsYUFBYSxHQUFHLFVBQVVSLElBQVYsRUFBZ0JTLGNBQWhCLEVBQWdDO0FBQ2xELE1BQUlDLFFBQVEsR0FBRyxJQUFJMUcsS0FBSyxDQUFDMkcsU0FBVixDQUFvQkYsY0FBcEIsQ0FBZjtBQUNBVCxNQUFJLENBQUMxQyxTQUFMLEdBQWlCb0QsUUFBakI7QUFDQUEsVUFBUSxDQUFDVixJQUFULEdBQWdCQSxJQUFoQjtBQUNBQSxNQUFJLENBQUMvQyxVQUFMLEdBQWtCLElBQWxCOztBQUNBakQsT0FBSyxDQUFDK0YsY0FBTixDQUFxQkMsSUFBckIsRUFBMkIsVUFBM0I7O0FBRUEsTUFBSVksWUFBWSxHQUFHLElBQW5CO0FBRUFGLFVBQVEsQ0FBQ3BDLFVBQVQsQ0FBb0IsU0FBU0QsUUFBVCxDQUFrQndDLEtBQWxCLEVBQXlCQyxPQUF6QixFQUFrQztBQUNwRGQsUUFBSSxDQUFDOUMsV0FBTCxHQUFtQixJQUFuQjtBQUVBMEQsZ0JBQVksR0FBRzVHLEtBQUssQ0FBQytHLFdBQU4sQ0FBa0JDLFFBQWxCLENBQTJCQyxpQkFBM0IsQ0FDYkgsT0FEYSxFQUNKLFNBQVNJLFFBQVQsR0FBb0I7QUFDM0JsSCxXQUFLLENBQUNtSCxZQUFOLENBQW1CbkIsSUFBbkIsRUFBeUI7QUFBSztBQUE5QjtBQUNELEtBSFksQ0FBZjtBQUlELEdBUEQsRUFUa0QsQ0FrQmxEOztBQUNBQSxNQUFJLENBQUN6QixlQUFMLENBQXFCLFlBQVk7QUFDL0JxQyxnQkFBWSxJQUFJQSxZQUFZLENBQUN0QixJQUFiLEVBQWhCO0FBQ0FzQixnQkFBWSxHQUFHLElBQWY7QUFDRCxHQUhEO0FBS0EsU0FBT0YsUUFBUDtBQUNELENBekJELEMsQ0EyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0ExRyxLQUFLLENBQUNvSCxnQkFBTixHQUF5QixVQUFVcEIsSUFBVixFQUFnQjNDLFVBQWhCLEVBQTRCZ0UsVUFBNUIsRUFBd0NDLFVBQXhDLEVBQW9EO0FBQzNFdEgsT0FBSyxDQUFDc0csV0FBTixDQUFrQk4sSUFBbEIsRUFBd0IzQyxVQUF4Qjs7QUFFQSxNQUFJcUQsUUFBSjtBQUNBLE1BQUlhLFVBQUosQ0FKMkUsQ0FLM0U7QUFDQTs7QUFDQXRELFNBQU8sQ0FBQ2lDLFdBQVIsQ0FBb0IsWUFBWTtBQUM5QkYsUUFBSSxDQUFDckIsT0FBTCxDQUFhLFNBQVM2QyxRQUFULENBQWtCcEgsQ0FBbEIsRUFBcUI7QUFDaEM7QUFDQTRGLFVBQUksQ0FBQ3ZDLFdBQUw7QUFDQXVDLFVBQUksQ0FBQzVDLFdBQUwsR0FBbUIsSUFBbkIsQ0FIZ0MsQ0FJaEM7QUFDQTs7QUFDQSxVQUFJcUUsTUFBTSxHQUFHekIsSUFBSSxDQUFDdEQsT0FBTCxFQUFiOztBQUNBc0QsVUFBSSxDQUFDNUMsV0FBTCxHQUFtQixLQUFuQjs7QUFFQSxVQUFJLENBQUVoRCxDQUFDLENBQUNzSCxRQUFKLElBQWdCLENBQUUxSCxLQUFLLENBQUMySCxlQUFOLENBQXNCSixVQUF0QixFQUFrQ0UsTUFBbEMsQ0FBdEIsRUFBaUU7QUFDL0R4RCxlQUFPLENBQUNpQyxXQUFSLENBQW9CLFNBQVMwQixhQUFULEdBQXlCO0FBQzNDO0FBQ0EsY0FBSUMsY0FBYyxHQUFHN0gsS0FBSyxDQUFDOEgsZUFBTixDQUFzQkwsTUFBdEIsRUFBOEIsRUFBOUIsRUFBa0N6QixJQUFsQyxDQUFyQjs7QUFDQVUsa0JBQVEsQ0FBQ3FCLFVBQVQsQ0FBb0JGLGNBQXBCOztBQUNBN0gsZUFBSyxDQUFDK0YsY0FBTixDQUFxQkMsSUFBckIsRUFBMkIsVUFBM0I7QUFDRCxTQUxEO0FBTUQ7O0FBQ0R1QixnQkFBVSxHQUFHRSxNQUFiLENBakJnQyxDQW1CaEM7QUFDQTtBQUNBO0FBQ0E7O0FBQ0F4RCxhQUFPLENBQUMrRCxZQUFSLENBQXFCLFlBQVk7QUFDL0IsWUFBSXRCLFFBQUosRUFBYztBQUNaQSxrQkFBUSxDQUFDdUIsY0FBVDtBQUNEO0FBQ0YsT0FKRDtBQUtELEtBNUJELEVBNEJHQyxTQTVCSCxFQTRCYyxhQTVCZCxFQUQ4QixDQStCOUI7O0FBQ0EsUUFBSUMsZUFBSjs7QUFDQSxRQUFJLENBQUVkLFVBQU4sRUFBa0I7QUFDaEJjLHFCQUFlLEdBQUduSSxLQUFLLENBQUM4SCxlQUFOLENBQXNCUCxVQUF0QixFQUFrQyxFQUFsQyxFQUFzQ3ZCLElBQXRDLENBQWxCO0FBQ0FVLGNBQVEsR0FBR0YsYUFBYSxDQUFDUixJQUFELEVBQU9tQyxlQUFQLENBQXhCO0FBQ0FBLHFCQUFlLEdBQUcsSUFBbEIsQ0FIZ0IsQ0FHUTtBQUN6QixLQUpELE1BSU87QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBQSxxQkFBZSxHQUFHLEVBQWxCLENBUkssQ0FTTDs7QUFDQWQsZ0JBQVUsQ0FBQ3pELElBQVgsQ0FBZ0IsWUFBWTtBQUMxQjhDLGdCQUFRLEdBQUdGLGFBQWEsQ0FBQ1IsSUFBRCxFQUFPbUMsZUFBUCxDQUF4QjtBQUNBQSx1QkFBZSxHQUFHLElBQWxCLENBRjBCLENBRUY7O0FBQ3hCYixrQkFBVSxDQUFDMUQsSUFBWCxDQUFnQjhDLFFBQWhCO0FBQ0QsT0FKRCxFQVZLLENBZUw7OztBQUNBVyxnQkFBVSxDQUFDekQsSUFBWCxDQUFnQjVELEtBQUssQ0FBQ2UsS0FBTixDQUFZZixLQUFLLENBQUM4SCxlQUFsQixFQUFtQyxJQUFuQyxFQUNPUCxVQURQLEVBQ21CWSxlQURuQixFQUNvQ25DLElBRHBDLEVBQzBDcUIsVUFEMUMsQ0FBaEI7QUFFRDtBQUNGLEdBeEREOztBQTBEQSxNQUFJLENBQUVBLFVBQU4sRUFBa0I7QUFDaEIsV0FBT1gsUUFBUDtBQUNELEdBRkQsTUFFTztBQUNMLFdBQU8sSUFBUDtBQUNEO0FBQ0YsQ0F0RUQsQyxDQXdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBMUcsS0FBSyxDQUFDb0ksV0FBTixHQUFvQixVQUFVcEMsSUFBVixFQUFnQjNDLFVBQWhCLEVBQTRCO0FBQzlDckQsT0FBSyxDQUFDc0csV0FBTixDQUFrQk4sSUFBbEIsRUFBd0IzQyxVQUF4QixFQUFvQztBQUFLO0FBQXpDOztBQUVBMkMsTUFBSSxDQUFDNUMsV0FBTCxHQUFtQixJQUFuQjs7QUFDQSxNQUFJcUUsTUFBTSxHQUFHekgsS0FBSyxDQUFDbUUsZ0JBQU4sQ0FBdUI2QixJQUF2QixFQUE2QixZQUFZO0FBQ3BELFdBQU9BLElBQUksQ0FBQ3RELE9BQUwsRUFBUDtBQUNELEdBRlksQ0FBYjs7QUFHQXNELE1BQUksQ0FBQzVDLFdBQUwsR0FBbUIsS0FBbkI7O0FBRUEsTUFBSWlGLE1BQU0sR0FBR3JJLEtBQUssQ0FBQ3NJLE9BQU4sQ0FBY2IsTUFBZCxFQUFzQnpCLElBQXRCLENBQWI7O0FBRUEsTUFBSS9CLE9BQU8sQ0FBQ3NFLE1BQVosRUFBb0I7QUFDbEJ0RSxXQUFPLENBQUMrRCxZQUFSLENBQXFCLFlBQVk7QUFDL0JoSSxXQUFLLENBQUNtSCxZQUFOLENBQW1CbkIsSUFBbkI7QUFDRCxLQUZEO0FBR0QsR0FKRCxNQUlPO0FBQ0xoRyxTQUFLLENBQUNtSCxZQUFOLENBQW1CbkIsSUFBbkI7QUFDRDs7QUFFRCxTQUFPcUMsTUFBUDtBQUNELENBcEJELEMsQ0FzQkE7OztBQUNBckksS0FBSyxDQUFDd0ksZUFBTixHQUF3QkMsSUFBSSxDQUFDQyxtQkFBTCxDQUF5QkMsTUFBekIsRUFBeEI7O0FBQ0EzSSxLQUFLLENBQUN3SSxlQUFOLENBQXNCSSxHQUF0QixDQUEwQjtBQUN4QkMsYUFBVyxFQUFFLFVBQVV4SSxDQUFWLEVBQWE7QUFDeEIsUUFBSUEsQ0FBQyxZQUFZTCxLQUFLLENBQUNnRixRQUF2QixFQUNFM0UsQ0FBQyxHQUFHQSxDQUFDLENBQUN5SSxhQUFGLEVBQUo7QUFDRixRQUFJekksQ0FBQyxZQUFZTCxLQUFLLENBQUN1QyxJQUF2QixFQUNFLE9BQU92QyxLQUFLLENBQUNvSSxXQUFOLENBQWtCL0gsQ0FBbEIsRUFBcUIsS0FBS2dELFVBQTFCLENBQVAsQ0FKc0IsQ0FNeEI7O0FBQ0EsV0FBT29GLElBQUksQ0FBQ0MsbUJBQUwsQ0FBeUI3SCxTQUF6QixDQUFtQ2dJLFdBQW5DLENBQStDekgsSUFBL0MsQ0FBb0QsSUFBcEQsRUFBMERmLENBQTFELENBQVA7QUFDRCxHQVR1QjtBQVV4QjBJLGlCQUFlLEVBQUUsVUFBVUMsS0FBVixFQUFpQjtBQUNoQztBQUNBLFFBQUksT0FBT0EsS0FBUCxLQUFpQixVQUFyQixFQUNFQSxLQUFLLEdBQUdoSixLQUFLLENBQUNtRSxnQkFBTixDQUF1QixLQUFLZCxVQUE1QixFQUF3QzJGLEtBQXhDLENBQVIsQ0FIOEIsQ0FLaEM7O0FBQ0EsV0FBT1AsSUFBSSxDQUFDQyxtQkFBTCxDQUF5QjdILFNBQXpCLENBQW1Da0ksZUFBbkMsQ0FBbUQzSCxJQUFuRCxDQUF3RCxJQUF4RCxFQUE4RDRILEtBQTlELENBQVA7QUFDRCxHQWpCdUI7QUFrQnhCQyxnQkFBYyxFQUFFLFVBQVV6RyxJQUFWLEVBQWdCMEcsS0FBaEIsRUFBdUJDLEdBQXZCLEVBQTRCO0FBQzFDO0FBQ0E7QUFDQSxRQUFJLE9BQU9ELEtBQVAsS0FBaUIsVUFBckIsRUFDRUEsS0FBSyxHQUFHbEosS0FBSyxDQUFDbUUsZ0JBQU4sQ0FBdUIsS0FBS2QsVUFBNUIsRUFBd0M2RixLQUF4QyxDQUFSO0FBRUYsV0FBT1QsSUFBSSxDQUFDQyxtQkFBTCxDQUF5QjdILFNBQXpCLENBQW1Db0ksY0FBbkMsQ0FBa0Q3SCxJQUFsRCxDQUNMLElBREssRUFDQ29CLElBREQsRUFDTzBHLEtBRFAsRUFDY0MsR0FEZCxDQUFQO0FBRUQ7QUExQnVCLENBQTFCLEUsQ0E2QkE7QUFDQTs7O0FBQ0EsSUFBSUMsc0JBQXNCLEdBQUcsWUFBWTtBQUN2QyxNQUFJcEQsSUFBSSxHQUFHaEcsS0FBSyxDQUFDcUosV0FBakI7QUFDQSxTQUFRckQsSUFBSSxJQUFJQSxJQUFJLENBQUM1QyxXQUFkLEdBQTZCNEMsSUFBN0IsR0FBb0MsSUFBM0M7QUFDRCxDQUhEOztBQUtBaEcsS0FBSyxDQUFDc0ksT0FBTixHQUFnQixVQUFVYixNQUFWLEVBQWtCcEUsVUFBbEIsRUFBOEI7QUFDNUNBLFlBQVUsR0FBR0EsVUFBVSxJQUFJK0Ysc0JBQXNCLEVBQWpEO0FBQ0EsU0FBUSxJQUFJcEosS0FBSyxDQUFDd0ksZUFBVixDQUNOO0FBQUNuRixjQUFVLEVBQUVBO0FBQWIsR0FETSxDQUFELENBQ3NCaUcsS0FEdEIsQ0FDNEI3QixNQUQ1QixDQUFQO0FBRUQsQ0FKRDs7QUFNQXpILEtBQUssQ0FBQ3VKLGlCQUFOLEdBQTBCLFVBQVVQLEtBQVYsRUFBaUIzRixVQUFqQixFQUE2QjtBQUNyREEsWUFBVSxHQUFHQSxVQUFVLElBQUkrRixzQkFBc0IsRUFBakQ7QUFDQSxTQUFRLElBQUlwSixLQUFLLENBQUN3SSxlQUFWLENBQ047QUFBQ25GLGNBQVUsRUFBRUE7QUFBYixHQURNLENBQUQsQ0FDc0IwRixlQUR0QixDQUNzQ0MsS0FEdEMsQ0FBUDtBQUVELENBSkQ7O0FBTUFoSixLQUFLLENBQUNtSCxZQUFOLEdBQXFCLFVBQVVuQixJQUFWLEVBQWdCd0QsVUFBaEIsRUFBNEI7QUFDL0MsTUFBSXhELElBQUksQ0FBQzdDLFdBQVQsRUFDRTtBQUNGNkMsTUFBSSxDQUFDN0MsV0FBTCxHQUFtQixJQUFuQjs7QUFFQW5ELE9BQUssQ0FBQytGLGNBQU4sQ0FBcUJDLElBQXJCLEVBQTJCLFdBQTNCLEVBTCtDLENBTy9DO0FBQ0E7QUFDQTs7O0FBRUEsTUFBSUEsSUFBSSxDQUFDMUMsU0FBVCxFQUNFMEMsSUFBSSxDQUFDMUMsU0FBTCxDQUFlMkUsY0FBZixDQUE4QnVCLFVBQTlCO0FBQ0gsQ0FiRDs7QUFlQXhKLEtBQUssQ0FBQ3lKLFlBQU4sR0FBcUIsVUFBVUMsSUFBVixFQUFnQjtBQUNuQyxNQUFJQSxJQUFJLENBQUNDLFFBQUwsS0FBa0IsQ0FBdEIsRUFDRTNKLEtBQUssQ0FBQytHLFdBQU4sQ0FBa0JDLFFBQWxCLENBQTJCNEMsZUFBM0IsQ0FBMkNGLElBQTNDO0FBQ0gsQ0FIRCxDLENBS0E7QUFDQTtBQUNBOzs7QUFDQTFKLEtBQUssQ0FBQzJILGVBQU4sR0FBd0IsVUFBVWtDLENBQVYsRUFBYUMsQ0FBYixFQUFnQjtBQUN0QyxNQUFJRCxDQUFDLFlBQVlwQixJQUFJLENBQUNzQixHQUF0QixFQUEyQjtBQUN6QixXQUFRRCxDQUFDLFlBQVlyQixJQUFJLENBQUNzQixHQUFuQixJQUE0QkYsQ0FBQyxDQUFDWCxLQUFGLEtBQVlZLENBQUMsQ0FBQ1osS0FBakQ7QUFDRCxHQUZELE1BRU8sSUFBSVcsQ0FBQyxJQUFJLElBQVQsRUFBZTtBQUNwQixXQUFRQyxDQUFDLElBQUksSUFBYjtBQUNELEdBRk0sTUFFQTtBQUNMLFdBQVFELENBQUMsS0FBS0MsQ0FBUCxLQUNILE9BQU9ELENBQVAsS0FBYSxRQUFkLElBQTRCLE9BQU9BLENBQVAsS0FBYSxTQUF6QyxJQUNDLE9BQU9BLENBQVAsS0FBYSxRQUZWLENBQVA7QUFHRDtBQUNGLENBVkQ7QUFZQTs7Ozs7OztBQUtBN0osS0FBSyxDQUFDcUosV0FBTixHQUFvQixJQUFwQjs7QUFFQXJKLEtBQUssQ0FBQ21FLGdCQUFOLEdBQXlCLFVBQVU2QixJQUFWLEVBQWdCaEYsSUFBaEIsRUFBc0I7QUFDN0MsTUFBSWdKLE9BQU8sR0FBR2hLLEtBQUssQ0FBQ3FKLFdBQXBCOztBQUNBLE1BQUk7QUFDRnJKLFNBQUssQ0FBQ3FKLFdBQU4sR0FBb0JyRCxJQUFwQjtBQUNBLFdBQU9oRixJQUFJLEVBQVg7QUFDRCxHQUhELFNBR1U7QUFDUmhCLFNBQUssQ0FBQ3FKLFdBQU4sR0FBb0JXLE9BQXBCO0FBQ0Q7QUFDRixDQVJELEMsQ0FVQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsSUFBSUMsa0JBQWtCLEdBQUcsVUFBVUMsT0FBVixFQUFtQjtBQUMxQyxNQUFJQSxPQUFPLEtBQUssSUFBaEIsRUFDRSxNQUFNLElBQUlwRixLQUFKLENBQVUsbUJBQVYsQ0FBTjtBQUNGLE1BQUksT0FBT29GLE9BQVAsS0FBbUIsV0FBdkIsRUFDRSxNQUFNLElBQUlwRixLQUFKLENBQVUsd0JBQVYsQ0FBTjtBQUVGLE1BQUtvRixPQUFPLFlBQVlsSyxLQUFLLENBQUN1QyxJQUExQixJQUNDMkgsT0FBTyxZQUFZbEssS0FBSyxDQUFDZ0YsUUFEMUIsSUFFQyxPQUFPa0YsT0FBUCxLQUFtQixVQUZ4QixFQUdFOztBQUVGLE1BQUk7QUFDRjtBQUNBO0FBQ0E7QUFDQyxRQUFJekIsSUFBSSxDQUFDMEIsT0FBVCxFQUFELENBQW1CYixLQUFuQixDQUF5QlksT0FBekI7QUFDRCxHQUxELENBS0UsT0FBT3BJLENBQVAsRUFBVTtBQUNWO0FBQ0EsVUFBTSxJQUFJZ0QsS0FBSixDQUFVLDJCQUFWLENBQU47QUFDRDtBQUNGLENBcEJELEMsQ0FzQkE7QUFDQTtBQUNBOzs7QUFDQSxJQUFJc0YsYUFBYSxHQUFHLFVBQVVGLE9BQVYsRUFBbUI7QUFDckNELG9CQUFrQixDQUFDQyxPQUFELENBQWxCOztBQUVBLE1BQUlBLE9BQU8sWUFBWWxLLEtBQUssQ0FBQ2dGLFFBQTdCLEVBQXVDO0FBQ3JDLFdBQU9rRixPQUFPLENBQUNwQixhQUFSLEVBQVA7QUFDRCxHQUZELE1BRU8sSUFBSW9CLE9BQU8sWUFBWWxLLEtBQUssQ0FBQ3VDLElBQTdCLEVBQW1DO0FBQ3hDLFdBQU8ySCxPQUFQO0FBQ0QsR0FGTSxNQUVBO0FBQ0wsUUFBSWxKLElBQUksR0FBR2tKLE9BQVg7O0FBQ0EsUUFBSSxPQUFPbEosSUFBUCxLQUFnQixVQUFwQixFQUFnQztBQUM5QkEsVUFBSSxHQUFHLFlBQVk7QUFDakIsZUFBT2tKLE9BQVA7QUFDRCxPQUZEO0FBR0Q7O0FBQ0QsV0FBT2xLLEtBQUssQ0FBQ3VDLElBQU4sQ0FBVyxRQUFYLEVBQXFCdkIsSUFBckIsQ0FBUDtBQUNEO0FBQ0YsQ0FoQkQsQyxDQWtCQTtBQUNBO0FBQ0E7OztBQUNBLElBQUlxSixhQUFhLEdBQUcsVUFBVUgsT0FBVixFQUFtQjtBQUNyQ0Qsb0JBQWtCLENBQUNDLE9BQUQsQ0FBbEI7O0FBRUEsTUFBSSxPQUFPQSxPQUFQLEtBQW1CLFVBQXZCLEVBQW1DO0FBQ2pDLFdBQU8sWUFBWTtBQUNqQixhQUFPQSxPQUFQO0FBQ0QsS0FGRDtBQUdELEdBSkQsTUFJTztBQUNMLFdBQU9BLE9BQVA7QUFDRDtBQUNGLENBVkQ7QUFZQTs7Ozs7Ozs7OztBQVFBbEssS0FBSyxDQUFDeUMsTUFBTixHQUFlLFVBQVV5SCxPQUFWLEVBQW1CSSxhQUFuQixFQUFrQ0MsUUFBbEMsRUFBNENsSCxVQUE1QyxFQUF3RDtBQUNyRSxNQUFJLENBQUVpSCxhQUFOLEVBQXFCO0FBQ25CdEssU0FBSyxDQUFDTyxLQUFOLENBQVksMERBQ0Esd0RBRFo7QUFFRDs7QUFFRCxNQUFJZ0ssUUFBUSxZQUFZdkssS0FBSyxDQUFDdUMsSUFBOUIsRUFBb0M7QUFDbEM7QUFDQWMsY0FBVSxHQUFHa0gsUUFBYjtBQUNBQSxZQUFRLEdBQUcsSUFBWDtBQUNELEdBVm9FLENBWXJFO0FBQ0E7QUFDQTs7O0FBQ0EsTUFBSUQsYUFBYSxJQUFJLE9BQU9BLGFBQWEsQ0FBQ1gsUUFBckIsS0FBa0MsUUFBdkQsRUFDRSxNQUFNLElBQUk3RSxLQUFKLENBQVUsb0NBQVYsQ0FBTjtBQUNGLE1BQUl5RixRQUFRLElBQUksT0FBT0EsUUFBUSxDQUFDWixRQUFoQixLQUE2QixRQUE3QyxFQUF1RDtBQUNyRCxVQUFNLElBQUk3RSxLQUFKLENBQVUsK0JBQVYsQ0FBTjtBQUVGekIsWUFBVSxHQUFHQSxVQUFVLElBQUkrRixzQkFBc0IsRUFBakQ7QUFFQSxNQUFJcEQsSUFBSSxHQUFHb0UsYUFBYSxDQUFDRixPQUFELENBQXhCOztBQUNBbEssT0FBSyxDQUFDb0gsZ0JBQU4sQ0FBdUJwQixJQUF2QixFQUE2QjNDLFVBQTdCOztBQUVBLE1BQUlpSCxhQUFKLEVBQW1CO0FBQ2pCdEUsUUFBSSxDQUFDMUMsU0FBTCxDQUFla0gsTUFBZixDQUFzQkYsYUFBdEIsRUFBcUNDLFFBQXJDO0FBQ0Q7O0FBRUQsU0FBT3ZFLElBQVA7QUFDRCxDQTlCRDs7QUFnQ0FoRyxLQUFLLENBQUN5SyxNQUFOLEdBQWUsVUFBVXpFLElBQVYsRUFBZ0JzRSxhQUFoQixFQUErQkMsUUFBL0IsRUFBeUM7QUFDdER2SyxPQUFLLENBQUNPLEtBQU4sQ0FBWSxvRUFDQSwrQ0FEWjs7QUFHQSxNQUFJLEVBQUd5RixJQUFJLElBQUtBLElBQUksQ0FBQzFDLFNBQUwsWUFBMEJ0RCxLQUFLLENBQUMyRyxTQUE1QyxDQUFKLEVBQ0UsTUFBTSxJQUFJN0IsS0FBSixDQUFVLDhDQUFWLENBQU47O0FBRUZrQixNQUFJLENBQUMxQyxTQUFMLENBQWVrSCxNQUFmLENBQXNCRixhQUF0QixFQUFxQ0MsUUFBckM7QUFDRCxDQVJEO0FBVUE7Ozs7Ozs7Ozs7O0FBU0F2SyxLQUFLLENBQUMwSyxjQUFOLEdBQXVCLFVBQVVSLE9BQVYsRUFBbUJTLElBQW5CLEVBQXlCTCxhQUF6QixFQUF3Q0MsUUFBeEMsRUFBa0RsSCxVQUFsRCxFQUE4RDtBQUNuRjtBQUNBO0FBQ0EsU0FBT3JELEtBQUssQ0FBQ3lDLE1BQU4sQ0FBYXpDLEtBQUssQ0FBQzRLLGFBQU4sQ0FBb0JELElBQXBCLEVBQTBCTixhQUFhLENBQUNILE9BQUQsQ0FBdkMsQ0FBYixFQUNpQkksYUFEakIsRUFDZ0NDLFFBRGhDLEVBQzBDbEgsVUFEMUMsQ0FBUDtBQUVELENBTEQ7QUFPQTs7Ozs7OztBQUtBckQsS0FBSyxDQUFDNkssTUFBTixHQUFlLFVBQVU3RSxJQUFWLEVBQWdCO0FBQzdCLE1BQUksRUFBR0EsSUFBSSxJQUFLQSxJQUFJLENBQUMxQyxTQUFMLFlBQTBCdEQsS0FBSyxDQUFDMkcsU0FBNUMsQ0FBSixFQUNFLE1BQU0sSUFBSTdCLEtBQUosQ0FBVSw4Q0FBVixDQUFOOztBQUVGLFNBQU9rQixJQUFQLEVBQWE7QUFDWCxRQUFJLENBQUVBLElBQUksQ0FBQzdDLFdBQVgsRUFBd0I7QUFDdEIsVUFBSTBELEtBQUssR0FBR2IsSUFBSSxDQUFDMUMsU0FBakI7QUFDQSxVQUFJdUQsS0FBSyxDQUFDeEMsUUFBTixJQUFrQixDQUFFd0MsS0FBSyxDQUFDaUUsV0FBOUIsRUFDRWpFLEtBQUssQ0FBQ2tFLE1BQU47QUFDRmxFLFdBQUssQ0FBQ21FLE9BQU47QUFDRDs7QUFFRGhGLFFBQUksR0FBR0EsSUFBSSxDQUFDekMsbUJBQUwsSUFBNEJ5QyxJQUFJLENBQUMzQyxVQUF4QztBQUNEO0FBQ0YsQ0FkRDtBQWdCQTs7Ozs7OztBQUtBckQsS0FBSyxDQUFDaUwsTUFBTixHQUFlLFVBQVVmLE9BQVYsRUFBbUI3RyxVQUFuQixFQUErQjtBQUM1Q0EsWUFBVSxHQUFHQSxVQUFVLElBQUkrRixzQkFBc0IsRUFBakQ7QUFFQSxTQUFPWCxJQUFJLENBQUN3QyxNQUFMLENBQVlqTCxLQUFLLENBQUNvSSxXQUFOLENBQWtCZ0MsYUFBYSxDQUFDRixPQUFELENBQS9CLEVBQTBDN0csVUFBMUMsQ0FBWixDQUFQO0FBQ0QsQ0FKRDtBQU1BOzs7Ozs7OztBQU1BckQsS0FBSyxDQUFDa0wsY0FBTixHQUF1QixVQUFVaEIsT0FBVixFQUFtQlMsSUFBbkIsRUFBeUJ0SCxVQUF6QixFQUFxQztBQUMxREEsWUFBVSxHQUFHQSxVQUFVLElBQUkrRixzQkFBc0IsRUFBakQ7QUFFQSxTQUFPWCxJQUFJLENBQUN3QyxNQUFMLENBQVlqTCxLQUFLLENBQUNvSSxXQUFOLENBQWtCcEksS0FBSyxDQUFDNEssYUFBTixDQUNuQ0QsSUFEbUMsRUFDN0JOLGFBQWEsQ0FBQ0gsT0FBRCxDQURnQixDQUFsQixFQUNjN0csVUFEZCxDQUFaLENBQVA7QUFFRCxDQUxEOztBQU9BckQsS0FBSyxDQUFDbUwsT0FBTixHQUFnQixVQUFVMUQsTUFBVixFQUFrQnBFLFVBQWxCLEVBQThCK0gsUUFBOUIsRUFBd0M7QUFDdEQsTUFBSSxPQUFPM0QsTUFBUCxLQUFrQixVQUF0QixFQUNFLE1BQU0sSUFBSTNDLEtBQUosQ0FBVSxvREFBVixDQUFOOztBQUVGLE1BQUt6QixVQUFVLElBQUksSUFBZixJQUF3QixFQUFHQSxVQUFVLFlBQVlyRCxLQUFLLENBQUN1QyxJQUEvQixDQUE1QixFQUFrRTtBQUNoRTtBQUNBNkksWUFBUSxHQUFHL0gsVUFBWDtBQUNBQSxjQUFVLEdBQUcsSUFBYjtBQUNEOztBQUNEQSxZQUFVLEdBQUdBLFVBQVUsSUFBSStGLHNCQUFzQixFQUFqRDtBQUVBLE1BQUksQ0FBRWdDLFFBQU4sRUFDRSxNQUFNLElBQUl0RyxLQUFKLENBQVUsbUJBQVYsQ0FBTjtBQUNGLE1BQUksRUFBR3NHLFFBQVEsS0FBSzNDLElBQUksQ0FBQzRDLFFBQUwsQ0FBY0MsTUFBM0IsSUFDQUYsUUFBUSxLQUFLM0MsSUFBSSxDQUFDNEMsUUFBTCxDQUFjRSxNQUQzQixJQUVBSCxRQUFRLEtBQUszQyxJQUFJLENBQUM0QyxRQUFMLENBQWNHLFNBRjlCLENBQUosRUFHRSxNQUFNLElBQUkxRyxLQUFKLENBQVUsdUJBQXVCc0csUUFBakMsQ0FBTjtBQUVGLFNBQU8zQyxJQUFJLENBQUNnRCxNQUFMLENBQVl6TCxLQUFLLENBQUNzSSxPQUFOLENBQWNiLE1BQWQsRUFBc0JwRSxVQUF0QixDQUFaLEVBQStDK0gsUUFBL0MsQ0FBUDtBQUNELENBbkJEO0FBcUJBOzs7Ozs7O0FBS0FwTCxLQUFLLENBQUMwTCxPQUFOLEdBQWdCLFVBQVVDLGFBQVYsRUFBeUI7QUFDdkMsTUFBSUMsT0FBSjs7QUFFQSxNQUFJLENBQUVELGFBQU4sRUFBcUI7QUFDbkJDLFdBQU8sR0FBRzVMLEtBQUssQ0FBQzZMLE9BQU4sQ0FBYyxNQUFkLENBQVY7QUFDRCxHQUZELE1BRU8sSUFBSUYsYUFBYSxZQUFZM0wsS0FBSyxDQUFDdUMsSUFBbkMsRUFBeUM7QUFDOUMsUUFBSXlELElBQUksR0FBRzJGLGFBQVg7QUFDQUMsV0FBTyxHQUFJNUYsSUFBSSxDQUFDeEQsSUFBTCxLQUFjLE1BQWQsR0FBdUJ3RCxJQUF2QixHQUNBaEcsS0FBSyxDQUFDNkwsT0FBTixDQUFjN0YsSUFBZCxFQUFvQixNQUFwQixDQURYO0FBRUQsR0FKTSxNQUlBLElBQUksT0FBTzJGLGFBQWEsQ0FBQ2hDLFFBQXJCLEtBQWtDLFFBQXRDLEVBQWdEO0FBQ3JELFFBQUlnQyxhQUFhLENBQUNoQyxRQUFkLEtBQTJCLENBQS9CLEVBQ0UsTUFBTSxJQUFJN0UsS0FBSixDQUFVLHNCQUFWLENBQU47QUFDRjhHLFdBQU8sR0FBRzVMLEtBQUssQ0FBQzZMLE9BQU4sQ0FBY0YsYUFBZCxFQUE2QixNQUE3QixDQUFWO0FBQ0QsR0FKTSxNQUlBO0FBQ0wsVUFBTSxJQUFJN0csS0FBSixDQUFVLDhCQUFWLENBQU47QUFDRDs7QUFFRCxTQUFPOEcsT0FBTyxHQUFHQSxPQUFPLENBQUNFLE9BQVIsQ0FBZ0JDLEdBQWhCLEVBQUgsR0FBMkIsSUFBekM7QUFDRCxDQWxCRCxDLENBb0JBOzs7QUFDQS9MLEtBQUssQ0FBQ2dNLGNBQU4sR0FBdUIsVUFBVWxGLE9BQVYsRUFBbUI7QUFDeEM5RyxPQUFLLENBQUNPLEtBQU4sQ0FBWSxvREFDQSxpQ0FEWjs7QUFHQSxNQUFJdUcsT0FBTyxDQUFDNkMsUUFBUixLQUFxQixDQUF6QixFQUNFLE1BQU0sSUFBSTdFLEtBQUosQ0FBVSxzQkFBVixDQUFOO0FBRUYsU0FBTzlFLEtBQUssQ0FBQzBMLE9BQU4sQ0FBYzVFLE9BQWQsQ0FBUDtBQUNELENBUkQsQyxDQVVBOztBQUVBOzs7Ozs7O0FBS0E5RyxLQUFLLENBQUM2TCxPQUFOLEdBQWdCLFVBQVVGLGFBQVYsRUFBeUJNLFNBQXpCLEVBQW9DO0FBQ2xELE1BQUlDLFFBQVEsR0FBR0QsU0FBZjs7QUFFQSxNQUFLLE9BQU9OLGFBQVIsS0FBMkIsUUFBL0IsRUFBeUM7QUFDdkM7QUFDQU8sWUFBUSxHQUFHUCxhQUFYO0FBQ0FBLGlCQUFhLEdBQUcsSUFBaEI7QUFDRCxHQVBpRCxDQVNsRDtBQUNBOzs7QUFDQSxNQUFJLENBQUVBLGFBQU4sRUFBcUI7QUFDbkIsV0FBTzNMLEtBQUssQ0FBQ21NLGVBQU4sQ0FBc0JELFFBQXRCLENBQVA7QUFDRCxHQUZELE1BRU8sSUFBSVAsYUFBYSxZQUFZM0wsS0FBSyxDQUFDdUMsSUFBbkMsRUFBeUM7QUFDOUMsV0FBT3ZDLEtBQUssQ0FBQ29NLGNBQU4sQ0FBcUJULGFBQXJCLEVBQW9DTyxRQUFwQyxDQUFQO0FBQ0QsR0FGTSxNQUVBLElBQUksT0FBT1AsYUFBYSxDQUFDaEMsUUFBckIsS0FBa0MsUUFBdEMsRUFBZ0Q7QUFDckQsV0FBTzNKLEtBQUssQ0FBQ3FNLGVBQU4sQ0FBc0JWLGFBQXRCLEVBQXFDTyxRQUFyQyxDQUFQO0FBQ0QsR0FGTSxNQUVBO0FBQ0wsVUFBTSxJQUFJcEgsS0FBSixDQUFVLDhCQUFWLENBQU47QUFDRDtBQUNGLENBcEJELEMsQ0FzQkE7QUFDQTs7O0FBQ0E5RSxLQUFLLENBQUNtTSxlQUFOLEdBQXdCLFVBQVUzSixJQUFWLEVBQWdCO0FBQ3RDLE1BQUl3RCxJQUFJLEdBQUdoRyxLQUFLLENBQUNxSixXQUFqQixDQURzQyxDQUV0QztBQUNBO0FBQ0E7QUFDQTs7QUFDQSxNQUFJLENBQUVyRCxJQUFOLEVBQ0UsTUFBTSxJQUFJbEIsS0FBSixDQUFVLDBCQUFWLENBQU47O0FBRUYsTUFBSXRDLElBQUosRUFBVTtBQUNSLFdBQU93RCxJQUFJLElBQUlBLElBQUksQ0FBQ3hELElBQUwsS0FBY0EsSUFBN0IsRUFDRXdELElBQUksR0FBR0EsSUFBSSxDQUFDM0MsVUFBWjs7QUFDRixXQUFPMkMsSUFBSSxJQUFJLElBQWY7QUFDRCxHQUpELE1BSU87QUFDTDtBQUNBO0FBQ0EsV0FBT0EsSUFBUDtBQUNEO0FBQ0YsQ0FsQkQ7O0FBb0JBaEcsS0FBSyxDQUFDb00sY0FBTixHQUF1QixVQUFVcEcsSUFBVixFQUFnQnhELElBQWhCLEVBQXNCO0FBQzNDLE1BQUk4SixDQUFDLEdBQUd0RyxJQUFJLENBQUMzQyxVQUFiOztBQUVBLE1BQUliLElBQUosRUFBVTtBQUNSLFdBQU84SixDQUFDLElBQUlBLENBQUMsQ0FBQzlKLElBQUYsS0FBV0EsSUFBdkIsRUFDRThKLENBQUMsR0FBR0EsQ0FBQyxDQUFDakosVUFBTjtBQUNIOztBQUVELFNBQU9pSixDQUFDLElBQUksSUFBWjtBQUNELENBVEQ7O0FBV0F0TSxLQUFLLENBQUNxTSxlQUFOLEdBQXdCLFVBQVVFLElBQVYsRUFBZ0IvSixJQUFoQixFQUFzQjtBQUM1QyxNQUFJcUUsS0FBSyxHQUFHN0csS0FBSyxDQUFDMkcsU0FBTixDQUFnQjZGLFVBQWhCLENBQTJCRCxJQUEzQixDQUFaOztBQUNBLE1BQUl2RyxJQUFJLEdBQUcsSUFBWDs7QUFDQSxTQUFPYSxLQUFLLElBQUksQ0FBRWIsSUFBbEIsRUFBd0I7QUFDdEJBLFFBQUksR0FBSWEsS0FBSyxDQUFDYixJQUFOLElBQWMsSUFBdEI7O0FBQ0EsUUFBSSxDQUFFQSxJQUFOLEVBQVk7QUFDVixVQUFJYSxLQUFLLENBQUNpRSxXQUFWLEVBQ0VqRSxLQUFLLEdBQUdBLEtBQUssQ0FBQ2lFLFdBQWQsQ0FERixLQUdFakUsS0FBSyxHQUFHN0csS0FBSyxDQUFDMkcsU0FBTixDQUFnQjZGLFVBQWhCLENBQTJCM0YsS0FBSyxDQUFDeUQsYUFBakMsQ0FBUjtBQUNIO0FBQ0Y7O0FBRUQsTUFBSTlILElBQUosRUFBVTtBQUNSLFdBQU93RCxJQUFJLElBQUlBLElBQUksQ0FBQ3hELElBQUwsS0FBY0EsSUFBN0IsRUFDRXdELElBQUksR0FBR0EsSUFBSSxDQUFDM0MsVUFBWjs7QUFDRixXQUFPMkMsSUFBSSxJQUFJLElBQWY7QUFDRCxHQUpELE1BSU87QUFDTCxXQUFPQSxJQUFQO0FBQ0Q7QUFDRixDQXBCRDs7QUFzQkFoRyxLQUFLLENBQUN5TSxZQUFOLEdBQXFCLFVBQVV6RyxJQUFWLEVBQWdCMEcsUUFBaEIsRUFBMEJDLGFBQTFCLEVBQXlDO0FBQzVEQSxlQUFhLEdBQUlBLGFBQWEsSUFBSSxJQUFsQztBQUNBLE1BQUlDLE9BQU8sR0FBRyxFQUFkO0FBRUEsTUFBSSxDQUFFNUcsSUFBSSxDQUFDMUMsU0FBWCxFQUNFLE1BQU0sSUFBSXdCLEtBQUosQ0FBVSwyQkFBVixDQUFOOztBQUVGa0IsTUFBSSxDQUFDMUMsU0FBTCxDQUFlZ0IsVUFBZixDQUEwQixTQUFTdUksa0JBQVQsQ0FBNEJoRyxLQUE1QixFQUFtQ0MsT0FBbkMsRUFBNEM7QUFDcEVwRixLQUFDLENBQUNvTCxJQUFGLENBQU9KLFFBQVAsRUFBaUIsVUFBVUssT0FBVixFQUFtQkMsSUFBbkIsRUFBeUI7QUFDeEMsVUFBSUMsT0FBTyxHQUFHRCxJQUFJLENBQUNFLEtBQUwsQ0FBVyxNQUFYLENBQWQsQ0FEd0MsQ0FFeEM7O0FBQ0F4TCxPQUFDLENBQUNvTCxJQUFGLENBQU9HLE9BQVAsRUFBZ0IsVUFBVUUsTUFBVixFQUFrQjtBQUNoQyxZQUFJQyxLQUFLLEdBQUdELE1BQU0sQ0FBQ0QsS0FBUCxDQUFhLEtBQWIsQ0FBWjtBQUNBLFlBQUlFLEtBQUssQ0FBQ2pNLE1BQU4sS0FBaUIsQ0FBckIsRUFDRTtBQUVGLFlBQUlrTSxTQUFTLEdBQUdELEtBQUssQ0FBQ0UsS0FBTixFQUFoQjtBQUNBLFlBQUlDLFFBQVEsR0FBR0gsS0FBSyxDQUFDSSxJQUFOLENBQVcsR0FBWCxDQUFmO0FBQ0FaLGVBQU8sQ0FBQ2hKLElBQVIsQ0FBYTVELEtBQUssQ0FBQ3lOLGFBQU4sQ0FBb0JDLE1BQXBCLENBQ1g1RyxPQURXLEVBQ0Z1RyxTQURFLEVBQ1NFLFFBRFQsRUFFWCxVQUFVSSxHQUFWLEVBQWU7QUFDYixjQUFJLENBQUU5RyxLQUFLLENBQUMrRyxlQUFOLENBQXNCRCxHQUFHLENBQUNFLGFBQTFCLENBQU4sRUFDRSxPQUFPLElBQVA7QUFDRixjQUFJQyxXQUFXLEdBQUduQixhQUFhLElBQUksSUFBbkM7QUFDQSxjQUFJb0IsV0FBVyxHQUFHN00sU0FBbEI7QUFDQSxpQkFBT2xCLEtBQUssQ0FBQ21FLGdCQUFOLENBQXVCNkIsSUFBdkIsRUFBNkIsWUFBWTtBQUM5QyxtQkFBTytHLE9BQU8sQ0FBQ3ZMLEtBQVIsQ0FBY3NNLFdBQWQsRUFBMkJDLFdBQTNCLENBQVA7QUFDRCxXQUZNLENBQVA7QUFHRCxTQVZVLEVBV1hsSCxLQVhXLEVBV0osVUFBVW1ILENBQVYsRUFBYTtBQUNsQixpQkFBT0EsQ0FBQyxDQUFDbEQsV0FBVDtBQUNELFNBYlUsQ0FBYjtBQWNELE9BckJEO0FBc0JELEtBekJEO0FBMEJELEdBM0JEOztBQTZCQTlFLE1BQUksQ0FBQ3pCLGVBQUwsQ0FBcUIsWUFBWTtBQUMvQjdDLEtBQUMsQ0FBQ29MLElBQUYsQ0FBT0YsT0FBUCxFQUFnQixVQUFVcUIsQ0FBVixFQUFhO0FBQzNCQSxPQUFDLENBQUMzSSxJQUFGO0FBQ0QsS0FGRDs7QUFHQXNILFdBQU8sQ0FBQ3pMLE1BQVIsR0FBaUIsQ0FBakI7QUFDRCxHQUxEO0FBTUQsQ0ExQ0QsQzs7Ozs7Ozs7Ozs7QUNwMUJBbkIsS0FBSyxDQUFDa08sbUJBQU4sR0FBNEIsVUFBVUMsSUFBVixFQUFnQjtBQUMxQyxNQUFJQSxJQUFJLFlBQVk3TSxLQUFoQixJQUF5QjZNLElBQUksQ0FBQ2hOLE1BQUwsS0FBZ0IsQ0FBN0MsRUFDRWdOLElBQUksR0FBRyxLQUFQO0FBQ0YsU0FBTyxDQUFDLENBQUVBLElBQVY7QUFDRCxDQUpEO0FBTUE7Ozs7Ozs7O0FBTUFuTyxLQUFLLENBQUNvTyxJQUFOLEdBQWEsVUFBVXpELElBQVYsRUFBZ0IwRCxXQUFoQixFQUE2QjtBQUN4QyxNQUFJckksSUFBSSxHQUFHaEcsS0FBSyxDQUFDdUMsSUFBTixDQUFXLE1BQVgsRUFBbUI4TCxXQUFuQixDQUFYO0FBRUFySSxNQUFJLENBQUM4RixPQUFMLEdBQWUsSUFBSXdDLFdBQUosRUFBZjtBQUVBdEksTUFBSSxDQUFDdEMsYUFBTCxDQUFtQixZQUFZO0FBQzdCLFFBQUksT0FBT2lILElBQVAsS0FBZ0IsVUFBcEIsRUFBZ0M7QUFDOUI7QUFDQTNFLFVBQUksQ0FBQ3JCLE9BQUwsQ0FBYSxZQUFZO0FBQ3ZCcUIsWUFBSSxDQUFDOEYsT0FBTCxDQUFheUMsR0FBYixDQUFpQjVELElBQUksRUFBckI7QUFDRCxPQUZELEVBRUczRSxJQUFJLENBQUMzQyxVQUZSLEVBRW9CLFNBRnBCO0FBR0QsS0FMRCxNQUtPO0FBQ0wyQyxVQUFJLENBQUM4RixPQUFMLENBQWF5QyxHQUFiLENBQWlCNUQsSUFBakI7QUFDRDtBQUNGLEdBVEQ7QUFXQSxTQUFPM0UsSUFBUDtBQUNELENBakJEO0FBbUJBOzs7Ozs7OztBQU1BaEcsS0FBSyxDQUFDd08scUJBQU4sR0FBOEIsVUFBVUMsUUFBVixFQUFvQnpJLElBQXBCLEVBQTBCO0FBQ3REQSxNQUFJLENBQUN0QyxhQUFMLENBQW1CLFlBQVk7QUFDN0JoQyxLQUFDLENBQUNvTCxJQUFGLENBQU8yQixRQUFQLEVBQWlCLFVBQVVDLE9BQVYsRUFBbUJsTSxJQUFuQixFQUF5QjtBQUN4Q3dELFVBQUksQ0FBQ3hDLGNBQUwsQ0FBb0JoQixJQUFwQixJQUE0QixJQUFJOEwsV0FBSixFQUE1Qjs7QUFDQSxVQUFJLE9BQU9JLE9BQVAsS0FBbUIsVUFBdkIsRUFBbUM7QUFDakMxSSxZQUFJLENBQUNyQixPQUFMLENBQWEsWUFBWTtBQUN2QnFCLGNBQUksQ0FBQ3hDLGNBQUwsQ0FBb0JoQixJQUFwQixFQUEwQitMLEdBQTFCLENBQThCRyxPQUFPLEVBQXJDO0FBQ0QsU0FGRCxFQUVHMUksSUFBSSxDQUFDM0MsVUFGUjtBQUdELE9BSkQsTUFJTztBQUNMMkMsWUFBSSxDQUFDeEMsY0FBTCxDQUFvQmhCLElBQXBCLEVBQTBCK0wsR0FBMUIsQ0FBOEJHLE9BQTlCO0FBQ0Q7QUFDRixLQVREO0FBVUQsR0FYRDtBQVlELENBYkQ7QUFlQTs7Ozs7Ozs7QUFNQTFPLEtBQUssQ0FBQzJPLEdBQU4sR0FBWSxVQUFVRixRQUFWLEVBQW9CSixXQUFwQixFQUFpQztBQUMzQyxNQUFJckksSUFBSSxHQUFHaEcsS0FBSyxDQUFDdUMsSUFBTixDQUFXLEtBQVgsRUFBa0I4TCxXQUFsQixDQUFYOztBQUNBck8sT0FBSyxDQUFDd08scUJBQU4sQ0FBNEJDLFFBQTVCLEVBQXNDekksSUFBdEM7O0FBRUEsU0FBT0EsSUFBUDtBQUNELENBTEQ7QUFPQTs7Ozs7Ozs7O0FBT0FoRyxLQUFLLENBQUM0TyxFQUFOLEdBQVcsVUFBVUMsYUFBVixFQUF5QlIsV0FBekIsRUFBc0NTLFFBQXRDLEVBQWdEQyxJQUFoRCxFQUFzRDtBQUMvRCxNQUFJQyxZQUFZLEdBQUcsSUFBSVYsV0FBSixFQUFuQjtBQUVBLE1BQUl0SSxJQUFJLEdBQUdoRyxLQUFLLENBQUN1QyxJQUFOLENBQVd3TSxJQUFJLEdBQUcsUUFBSCxHQUFjLElBQTdCLEVBQW1DLFlBQVk7QUFDeEQsV0FBT0MsWUFBWSxDQUFDakQsR0FBYixLQUFxQnNDLFdBQVcsRUFBaEMsR0FDSlMsUUFBUSxHQUFHQSxRQUFRLEVBQVgsR0FBZ0IsSUFEM0I7QUFFRCxHQUhVLENBQVg7QUFJQTlJLE1BQUksQ0FBQ2lKLGNBQUwsR0FBc0JELFlBQXRCO0FBQ0FoSixNQUFJLENBQUN0QyxhQUFMLENBQW1CLFlBQVk7QUFDN0IsU0FBS2lCLE9BQUwsQ0FBYSxZQUFZO0FBQ3ZCLFVBQUl3SixJQUFJLEdBQUduTyxLQUFLLENBQUNrTyxtQkFBTixDQUEwQlcsYUFBYSxFQUF2QyxDQUFYOztBQUNBRyxrQkFBWSxDQUFDVCxHQUFiLENBQWlCUSxJQUFJLEdBQUksQ0FBRVosSUFBTixHQUFjQSxJQUFuQztBQUNELEtBSEQsRUFHRyxLQUFLOUssVUFIUixFQUdvQixXQUhwQjtBQUlELEdBTEQ7QUFPQSxTQUFPMkMsSUFBUDtBQUNELENBaEJEO0FBa0JBOzs7Ozs7Ozs7QUFPQWhHLEtBQUssQ0FBQ2tQLE1BQU4sR0FBZSxVQUFVTCxhQUFWLEVBQXlCUixXQUF6QixFQUFzQ1MsUUFBdEMsRUFBZ0Q7QUFDN0QsU0FBTzlPLEtBQUssQ0FBQzRPLEVBQU4sQ0FBU0MsYUFBVCxFQUF3QlIsV0FBeEIsRUFBcUNTLFFBQXJDLEVBQStDO0FBQUs7QUFBcEQsR0FBUDtBQUNELENBRkQ7QUFJQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTlPLEtBQUssQ0FBQ21QLElBQU4sR0FBYSxVQUFVQyxPQUFWLEVBQW1CZixXQUFuQixFQUFnQ1MsUUFBaEMsRUFBMEM7QUFDckQsTUFBSU8sUUFBUSxHQUFHclAsS0FBSyxDQUFDdUMsSUFBTixDQUFXLE1BQVgsRUFBbUIsWUFBWTtBQUM1QyxRQUFJK00sUUFBUSxHQUFHLEtBQUtDLGVBQXBCO0FBQ0EsU0FBS0EsZUFBTCxHQUF1QixJQUF2Qjs7QUFDQSxRQUFJLEtBQUt2TSxzQkFBVCxFQUFpQztBQUMvQixXQUFLd00sZ0JBQUwsR0FBd0IsSUFBSXZMLE9BQU8sQ0FBQ3dMLFVBQVosRUFBeEI7QUFDQSxXQUFLRCxnQkFBTCxDQUFzQkUsTUFBdEI7QUFDRDs7QUFDRCxXQUFPSixRQUFQO0FBQ0QsR0FSYyxDQUFmO0FBU0FELFVBQVEsQ0FBQ0UsZUFBVCxHQUEyQixFQUEzQjtBQUNBRixVQUFRLENBQUNNLFFBQVQsR0FBb0IsQ0FBcEI7QUFDQU4sVUFBUSxDQUFDTyxVQUFULEdBQXNCLEtBQXRCO0FBQ0FQLFVBQVEsQ0FBQ1EsVUFBVCxHQUFzQixJQUF0QjtBQUNBUixVQUFRLENBQUNoQixXQUFULEdBQXVCQSxXQUF2QjtBQUNBZ0IsVUFBUSxDQUFDUCxRQUFULEdBQW9CQSxRQUFwQjtBQUNBTyxVQUFRLENBQUNTLE1BQVQsR0FBa0IsSUFBSXhCLFdBQUosRUFBbEI7QUFDQWUsVUFBUSxDQUFDVSxZQUFULEdBQXdCLElBQXhCLENBakJxRCxDQW1CckQ7O0FBQ0EsTUFBSUMsYUFBYSxHQUFHLFVBQVVDLElBQVYsRUFBZ0JDLEVBQWhCLEVBQW9CO0FBQ3RDLFFBQUlBLEVBQUUsS0FBS2hJLFNBQVgsRUFBc0I7QUFDcEJnSSxRQUFFLEdBQUdiLFFBQVEsQ0FBQ00sUUFBVCxHQUFvQixDQUF6QjtBQUNEOztBQUVELFNBQUssSUFBSXBPLENBQUMsR0FBRzBPLElBQWIsRUFBbUIxTyxDQUFDLElBQUkyTyxFQUF4QixFQUE0QjNPLENBQUMsRUFBN0IsRUFBaUM7QUFDL0IsVUFBSXlFLElBQUksR0FBR3FKLFFBQVEsQ0FBQy9MLFNBQVQsQ0FBbUI2TSxPQUFuQixDQUEyQjVPLENBQTNCLEVBQThCeUUsSUFBekM7O0FBQ0FBLFVBQUksQ0FBQ3hDLGNBQUwsQ0FBb0IsUUFBcEIsRUFBOEIrSyxHQUE5QixDQUFrQ2hOLENBQWxDO0FBQ0Q7QUFDRixHQVREOztBQVdBOE4sVUFBUSxDQUFDM0wsYUFBVCxDQUF1QixZQUFZO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBMkwsWUFBUSxDQUFDMUssT0FBVCxDQUFpQixZQUFZO0FBQzNCO0FBQ0E7QUFDQSxVQUFJeUwsR0FBRyxHQUFHaEIsT0FBTyxFQUFqQjs7QUFDQSxVQUFJMU4sQ0FBQyxDQUFDMk8sUUFBRixDQUFXRCxHQUFYLEtBQW1CMU8sQ0FBQyxDQUFDNE8sR0FBRixDQUFNRixHQUFOLEVBQVcsV0FBWCxDQUF2QixFQUFnRDtBQUM5Q2YsZ0JBQVEsQ0FBQ1UsWUFBVCxHQUF3QkssR0FBRyxDQUFDRyxTQUFKLElBQWlCLElBQXpDO0FBQ0FILFdBQUcsR0FBR0EsR0FBRyxDQUFDSSxTQUFWO0FBQ0Q7O0FBRURuQixjQUFRLENBQUNTLE1BQVQsQ0FBZ0J2QixHQUFoQixDQUFvQjZCLEdBQXBCO0FBQ0QsS0FWRCxFQVVHZixRQUFRLENBQUNoTSxVQVZaLEVBVXdCLFlBVnhCO0FBWUFnTSxZQUFRLENBQUNRLFVBQVQsR0FBc0JZLGVBQWUsQ0FBQ0MsT0FBaEIsQ0FBd0IsWUFBWTtBQUN4RCxhQUFPckIsUUFBUSxDQUFDUyxNQUFULENBQWdCL0QsR0FBaEIsRUFBUDtBQUNELEtBRnFCLEVBRW5CO0FBQ0Q0RSxhQUFPLEVBQUUsVUFBVUMsRUFBVixFQUFjQyxJQUFkLEVBQW9CcE0sS0FBcEIsRUFBMkI7QUFDbENSLGVBQU8sQ0FBQ2lDLFdBQVIsQ0FBb0IsWUFBWTtBQUM5QixjQUFJNEssV0FBSjs7QUFDQSxjQUFJekIsUUFBUSxDQUFDVSxZQUFiLEVBQTJCO0FBQ3pCO0FBQ0E7QUFDQWUsdUJBQVcsR0FBRzlRLEtBQUssQ0FBQ3VDLElBQU4sQ0FBVyxNQUFYLEVBQW1COE0sUUFBUSxDQUFDaEIsV0FBNUIsQ0FBZDtBQUNELFdBSkQsTUFJTztBQUNMeUMsdUJBQVcsR0FBRzlRLEtBQUssQ0FBQ29PLElBQU4sQ0FBV3lDLElBQVgsRUFBaUJ4QixRQUFRLENBQUNoQixXQUExQixDQUFkO0FBQ0Q7O0FBRURnQixrQkFBUSxDQUFDTSxRQUFUO0FBRUEsY0FBSWxCLFFBQVEsR0FBRyxFQUFmO0FBQ0FBLGtCQUFRLENBQUMsUUFBRCxDQUFSLEdBQXFCaEssS0FBckI7O0FBQ0EsY0FBSTRLLFFBQVEsQ0FBQ1UsWUFBYixFQUEyQjtBQUN6QnRCLG9CQUFRLENBQUNZLFFBQVEsQ0FBQ1UsWUFBVixDQUFSLEdBQWtDYyxJQUFsQztBQUNEOztBQUNEN1EsZUFBSyxDQUFDd08scUJBQU4sQ0FBNEJDLFFBQTVCLEVBQXNDcUMsV0FBdEM7O0FBRUEsY0FBSXpCLFFBQVEsQ0FBQ0csZ0JBQWIsRUFBK0I7QUFDN0JILG9CQUFRLENBQUNHLGdCQUFULENBQTBCdUIsT0FBMUI7QUFDRCxXQUZELE1BRU8sSUFBSTFCLFFBQVEsQ0FBQy9MLFNBQWIsRUFBd0I7QUFDN0IsZ0JBQUkrTCxRQUFRLENBQUNPLFVBQWIsRUFBeUI7QUFDdkJQLHNCQUFRLENBQUMvTCxTQUFULENBQW1CME4sWUFBbkIsQ0FBZ0MsQ0FBaEM7O0FBQ0EzQixzQkFBUSxDQUFDTyxVQUFULEdBQXNCLEtBQXRCO0FBQ0Q7O0FBRUQsZ0JBQUkvSSxLQUFLLEdBQUc3RyxLQUFLLENBQUNvSCxnQkFBTixDQUF1QjBKLFdBQXZCLEVBQW9DekIsUUFBcEMsQ0FBWjs7QUFDQUEsb0JBQVEsQ0FBQy9MLFNBQVQsQ0FBbUIyTixTQUFuQixDQUE2QnBLLEtBQTdCLEVBQW9DcEMsS0FBcEM7O0FBQ0F1TCx5QkFBYSxDQUFDdkwsS0FBRCxDQUFiO0FBQ0QsV0FUTSxNQVNBO0FBQ0w0SyxvQkFBUSxDQUFDRSxlQUFULENBQXlCMkIsTUFBekIsQ0FBZ0N6TSxLQUFoQyxFQUF1QyxDQUF2QyxFQUEwQ3FNLFdBQTFDO0FBQ0Q7QUFDRixTQWpDRDtBQWtDRCxPQXBDQTtBQXFDREssZUFBUyxFQUFFLFVBQVVQLEVBQVYsRUFBY0MsSUFBZCxFQUFvQnBNLEtBQXBCLEVBQTJCO0FBQ3BDUixlQUFPLENBQUNpQyxXQUFSLENBQW9CLFlBQVk7QUFDOUJtSixrQkFBUSxDQUFDTSxRQUFUOztBQUNBLGNBQUlOLFFBQVEsQ0FBQ0csZ0JBQWIsRUFBK0I7QUFDN0JILG9CQUFRLENBQUNHLGdCQUFULENBQTBCdUIsT0FBMUI7QUFDRCxXQUZELE1BRU8sSUFBSTFCLFFBQVEsQ0FBQy9MLFNBQWIsRUFBd0I7QUFDN0IrTCxvQkFBUSxDQUFDL0wsU0FBVCxDQUFtQjBOLFlBQW5CLENBQWdDdk0sS0FBaEM7O0FBQ0F1TCx5QkFBYSxDQUFDdkwsS0FBRCxDQUFiOztBQUNBLGdCQUFJNEssUUFBUSxDQUFDUCxRQUFULElBQXFCTyxRQUFRLENBQUNNLFFBQVQsS0FBc0IsQ0FBL0MsRUFBa0Q7QUFDaEROLHNCQUFRLENBQUNPLFVBQVQsR0FBc0IsSUFBdEI7O0FBQ0FQLHNCQUFRLENBQUMvTCxTQUFULENBQW1CMk4sU0FBbkIsQ0FDRWpSLEtBQUssQ0FBQ29ILGdCQUFOLENBQ0VwSCxLQUFLLENBQUN1QyxJQUFOLENBQVcsV0FBWCxFQUF1QjhNLFFBQVEsQ0FBQ1AsUUFBaEMsQ0FERixFQUVFTyxRQUZGLENBREYsRUFHZSxDQUhmO0FBSUQ7QUFDRixXQVZNLE1BVUE7QUFDTEEsb0JBQVEsQ0FBQ0UsZUFBVCxDQUF5QjJCLE1BQXpCLENBQWdDek0sS0FBaEMsRUFBdUMsQ0FBdkM7QUFDRDtBQUNGLFNBakJEO0FBa0JELE9BeERBO0FBeUREMk0sZUFBUyxFQUFFLFVBQVVSLEVBQVYsRUFBY1MsT0FBZCxFQUF1QkMsT0FBdkIsRUFBZ0M3TSxLQUFoQyxFQUF1QztBQUNoRFIsZUFBTyxDQUFDaUMsV0FBUixDQUFvQixZQUFZO0FBQzlCLGNBQUltSixRQUFRLENBQUNHLGdCQUFiLEVBQStCO0FBQzdCSCxvQkFBUSxDQUFDRyxnQkFBVCxDQUEwQnVCLE9BQTFCO0FBQ0QsV0FGRCxNQUVPO0FBQ0wsZ0JBQUlRLFFBQUo7O0FBQ0EsZ0JBQUlsQyxRQUFRLENBQUMvTCxTQUFiLEVBQXdCO0FBQ3RCaU8sc0JBQVEsR0FBR2xDLFFBQVEsQ0FBQy9MLFNBQVQsQ0FBbUJrTyxTQUFuQixDQUE2Qi9NLEtBQTdCLEVBQW9DdUIsSUFBL0M7QUFDRCxhQUZELE1BRU87QUFDTHVMLHNCQUFRLEdBQUdsQyxRQUFRLENBQUNFLGVBQVQsQ0FBeUI5SyxLQUF6QixDQUFYO0FBQ0Q7O0FBQ0QsZ0JBQUk0SyxRQUFRLENBQUNVLFlBQWIsRUFBMkI7QUFDekJ3QixzQkFBUSxDQUFDL04sY0FBVCxDQUF3QjZMLFFBQVEsQ0FBQ1UsWUFBakMsRUFBK0N4QixHQUEvQyxDQUFtRDhDLE9BQW5EO0FBQ0QsYUFGRCxNQUVPO0FBQ0xFLHNCQUFRLENBQUN6RixPQUFULENBQWlCeUMsR0FBakIsQ0FBcUI4QyxPQUFyQjtBQUNEO0FBQ0Y7QUFDRixTQWhCRDtBQWlCRCxPQTNFQTtBQTRFREksYUFBTyxFQUFFLFVBQVViLEVBQVYsRUFBY0MsSUFBZCxFQUFvQmEsU0FBcEIsRUFBK0JDLE9BQS9CLEVBQXdDO0FBQy9DMU4sZUFBTyxDQUFDaUMsV0FBUixDQUFvQixZQUFZO0FBQzlCLGNBQUltSixRQUFRLENBQUNHLGdCQUFiLEVBQStCO0FBQzdCSCxvQkFBUSxDQUFDRyxnQkFBVCxDQUEwQnVCLE9BQTFCO0FBQ0QsV0FGRCxNQUVPLElBQUkxQixRQUFRLENBQUMvTCxTQUFiLEVBQXdCO0FBQzdCK0wsb0JBQVEsQ0FBQy9MLFNBQVQsQ0FBbUJzTyxVQUFuQixDQUE4QkYsU0FBOUIsRUFBeUNDLE9BQXpDOztBQUNBM0IseUJBQWEsQ0FDWDZCLElBQUksQ0FBQ0MsR0FBTCxDQUFTSixTQUFULEVBQW9CQyxPQUFwQixDQURXLEVBQ21CRSxJQUFJLENBQUNFLEdBQUwsQ0FBU0wsU0FBVCxFQUFvQkMsT0FBcEIsQ0FEbkIsQ0FBYjtBQUVELFdBSk0sTUFJQTtBQUNMLGdCQUFJckMsUUFBUSxHQUFHRCxRQUFRLENBQUNFLGVBQXhCO0FBQ0EsZ0JBQUlnQyxRQUFRLEdBQUdqQyxRQUFRLENBQUNvQyxTQUFELENBQXZCO0FBQ0FwQyxvQkFBUSxDQUFDNEIsTUFBVCxDQUFnQlEsU0FBaEIsRUFBMkIsQ0FBM0I7QUFDQXBDLG9CQUFRLENBQUM0QixNQUFULENBQWdCUyxPQUFoQixFQUF5QixDQUF6QixFQUE0QkosUUFBNUI7QUFDRDtBQUNGLFNBYkQ7QUFjRDtBQTNGQSxLQUZtQixDQUF0Qjs7QUFnR0EsUUFBSWxDLFFBQVEsQ0FBQ1AsUUFBVCxJQUFxQk8sUUFBUSxDQUFDTSxRQUFULEtBQXNCLENBQS9DLEVBQWtEO0FBQ2hETixjQUFRLENBQUNPLFVBQVQsR0FBc0IsSUFBdEI7QUFDQVAsY0FBUSxDQUFDRSxlQUFULENBQXlCLENBQXpCLElBQ0V2UCxLQUFLLENBQUN1QyxJQUFOLENBQVcsV0FBWCxFQUF3QjhNLFFBQVEsQ0FBQ1AsUUFBakMsQ0FERjtBQUVEO0FBQ0YsR0FySEQ7QUF1SEFPLFVBQVEsQ0FBQzlLLGVBQVQsQ0FBeUIsWUFBWTtBQUNuQyxRQUFJOEssUUFBUSxDQUFDUSxVQUFiLEVBQ0VSLFFBQVEsQ0FBQ1EsVUFBVCxDQUFvQnZLLElBQXBCO0FBQ0gsR0FIRDtBQUtBLFNBQU8rSixRQUFQO0FBQ0QsQ0E1SkQ7O0FBOEpBclAsS0FBSyxDQUFDNEssYUFBTixHQUFzQixVQUFVd0YsR0FBVixFQUFlL0IsV0FBZixFQUE0QjtBQUNoRCxNQUFJMkQsQ0FBSjtBQUVBLE1BQUk1QyxPQUFPLEdBQUdnQixHQUFkOztBQUNBLE1BQUksT0FBT0EsR0FBUCxLQUFlLFVBQW5CLEVBQStCO0FBQzdCaEIsV0FBTyxHQUFHLFlBQVk7QUFDcEIsYUFBT2dCLEdBQVA7QUFDRCxLQUZEO0FBR0QsR0FSK0MsQ0FVaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsTUFBSTZCLGNBQWMsR0FBRyxZQUFZO0FBQy9CLFFBQUlDLGlCQUFpQixHQUFHLElBQXhCOztBQUNBLFFBQUlGLENBQUMsQ0FBQzNPLFVBQUYsSUFBZ0IyTyxDQUFDLENBQUMzTyxVQUFGLENBQWFiLElBQWIsS0FBc0Isc0JBQTFDLEVBQWtFO0FBQ2hFMFAsdUJBQWlCLEdBQUdGLENBQUMsQ0FBQzNPLFVBQUYsQ0FBYThPLGtCQUFqQztBQUNEOztBQUNELFFBQUlELGlCQUFKLEVBQXVCO0FBQ3JCLGFBQU9sUyxLQUFLLENBQUNtRSxnQkFBTixDQUF1QitOLGlCQUF2QixFQUEwQzlDLE9BQTFDLENBQVA7QUFDRCxLQUZELE1BRU87QUFDTCxhQUFPQSxPQUFPLEVBQWQ7QUFDRDtBQUNGLEdBVkQ7O0FBWUEsTUFBSWdELGtCQUFrQixHQUFHLFlBQVk7QUFDbkMsUUFBSWxJLE9BQU8sR0FBR21FLFdBQVcsQ0FBQ2pOLElBQVosQ0FBaUIsSUFBakIsQ0FBZCxDQURtQyxDQUduQztBQUNBO0FBQ0E7O0FBQ0EsUUFBSThJLE9BQU8sWUFBWWxLLEtBQUssQ0FBQ2dGLFFBQTdCLEVBQXVDO0FBQ3JDa0YsYUFBTyxHQUFHQSxPQUFPLENBQUNwQixhQUFSLEVBQVY7QUFDRDs7QUFDRCxRQUFJb0IsT0FBTyxZQUFZbEssS0FBSyxDQUFDdUMsSUFBN0IsRUFBbUM7QUFDakMySCxhQUFPLENBQUMzRyxtQkFBUixHQUE4QixJQUE5QjtBQUNEOztBQUVELFdBQU8yRyxPQUFQO0FBQ0QsR0FkRDs7QUFnQkE4SCxHQUFDLEdBQUdoUyxLQUFLLENBQUNvTyxJQUFOLENBQVc2RCxjQUFYLEVBQTJCRyxrQkFBM0IsQ0FBSjtBQUNBSixHQUFDLENBQUNLLGdCQUFGLEdBQXFCLElBQXJCO0FBQ0EsU0FBT0wsQ0FBUDtBQUNELENBcEREOztBQXNEQWhTLEtBQUssQ0FBQ3NTLHFCQUFOLEdBQThCLFVBQVVDLFlBQVYsRUFBd0JsRSxXQUF4QixFQUFxQztBQUNqRSxNQUFJckksSUFBSSxHQUFHaEcsS0FBSyxDQUFDdUMsSUFBTixDQUFXLHNCQUFYLEVBQW1DOEwsV0FBbkMsQ0FBWDtBQUNBLE1BQUloTCxVQUFVLEdBQUdrUCxZQUFZLENBQUNsUCxVQUE5QixDQUZpRSxDQUlqRTtBQUNBO0FBQ0E7QUFDQTs7QUFDQSxNQUFJQSxVQUFVLENBQUNnUCxnQkFBZixFQUNFaFAsVUFBVSxHQUFHQSxVQUFVLENBQUNBLFVBQXhCO0FBRUYyQyxNQUFJLENBQUN0QyxhQUFMLENBQW1CLFlBQVk7QUFDN0IsU0FBS3lPLGtCQUFMLEdBQTBCLEtBQUs5TyxVQUEvQjtBQUNBLFNBQUtBLFVBQUwsR0FBa0JBLFVBQWxCO0FBQ0EsU0FBS21QLGlDQUFMLEdBQXlDLElBQXpDO0FBQ0QsR0FKRDtBQUtBLFNBQU94TSxJQUFQO0FBQ0QsQ0FqQkQsQyxDQW1CQTs7O0FBQ0FoRyxLQUFLLENBQUN5UyxvQkFBTixHQUE2QnpTLEtBQUssQ0FBQ3NTLHFCQUFuQyxDOzs7Ozs7Ozs7OztBQ2pXQXRTLEtBQUssQ0FBQzBTLGNBQU4sR0FBdUIsRUFBdkIsQyxDQUVBO0FBQ0E7O0FBQ0ExUyxLQUFLLENBQUMyUyxjQUFOLEdBQXVCLFVBQVVuUSxJQUFWLEVBQWdCeEIsSUFBaEIsRUFBc0I7QUFDM0NoQixPQUFLLENBQUMwUyxjQUFOLENBQXFCbFEsSUFBckIsSUFBNkJ4QixJQUE3QjtBQUNELENBRkQsQyxDQUlBOzs7QUFDQWhCLEtBQUssQ0FBQzRTLGdCQUFOLEdBQXlCLFVBQVNwUSxJQUFULEVBQWU7QUFDdEMsU0FBT3hDLEtBQUssQ0FBQzBTLGNBQU4sQ0FBcUJsUSxJQUFyQixDQUFQO0FBQ0QsQ0FGRDs7QUFJQSxJQUFJcVEsZ0JBQWdCLEdBQUcsVUFBVXhTLENBQVYsRUFBYXlTLE1BQWIsRUFBcUI7QUFDMUMsTUFBSSxPQUFPelMsQ0FBUCxLQUFhLFVBQWpCLEVBQ0UsT0FBT0EsQ0FBUDtBQUNGLFNBQU9MLEtBQUssQ0FBQ2UsS0FBTixDQUFZVixDQUFaLEVBQWV5UyxNQUFmLENBQVA7QUFDRCxDQUpELEMsQ0FNQTtBQUNBOzs7QUFDQSxJQUFJQyxlQUFlLEdBQUcsVUFBVTFTLENBQVYsRUFBYTtBQUNqQyxNQUFJLE9BQU9BLENBQVAsS0FBYSxVQUFqQixFQUE2QjtBQUMzQixXQUFPLFlBQVk7QUFDakIsVUFBSXNLLElBQUksR0FBRzNLLEtBQUssQ0FBQzBMLE9BQU4sRUFBWDtBQUNBLFVBQUlmLElBQUksSUFBSSxJQUFaLEVBQ0VBLElBQUksR0FBRyxFQUFQO0FBQ0YsYUFBT3RLLENBQUMsQ0FBQ21CLEtBQUYsQ0FBUW1KLElBQVIsRUFBY3pKLFNBQWQsQ0FBUDtBQUNELEtBTEQ7QUFNRDs7QUFDRCxTQUFPYixDQUFQO0FBQ0QsQ0FWRDs7QUFZQUwsS0FBSyxDQUFDZ1QsZ0JBQU4sR0FBeUIsRUFBekI7O0FBRUFoVCxLQUFLLENBQUNpVCxrQkFBTixHQUEyQixVQUFVQyxRQUFWLEVBQW9CMVEsSUFBcEIsRUFBMEIyUSxnQkFBMUIsRUFBNEM7QUFDckU7QUFDQSxNQUFJQyxxQkFBcUIsR0FBRyxLQUE1Qjs7QUFFQSxNQUFJRixRQUFRLENBQUNHLFNBQVQsQ0FBbUIvQyxHQUFuQixDQUF1QjlOLElBQXZCLENBQUosRUFBa0M7QUFDaEMsUUFBSThRLE1BQU0sR0FBR0osUUFBUSxDQUFDRyxTQUFULENBQW1CdEgsR0FBbkIsQ0FBdUJ2SixJQUF2QixDQUFiOztBQUNBLFFBQUk4USxNQUFNLEtBQUt0VCxLQUFLLENBQUNnVCxnQkFBckIsRUFBdUM7QUFDckNJLDJCQUFxQixHQUFHLElBQXhCO0FBQ0QsS0FGRCxNQUVPLElBQUlFLE1BQU0sSUFBSSxJQUFkLEVBQW9CO0FBQ3pCLGFBQU9DLFVBQVUsQ0FBQ1IsZUFBZSxDQUFDTyxNQUFELENBQWhCLEVBQTBCSCxnQkFBMUIsQ0FBakI7QUFDRCxLQUZNLE1BRUE7QUFDTCxhQUFPLElBQVA7QUFDRDtBQUNGLEdBYm9FLENBZXJFOzs7QUFDQSxNQUFJM1EsSUFBSSxJQUFJMFEsUUFBWixFQUFzQjtBQUNwQjtBQUNBLFFBQUksQ0FBRUUscUJBQU4sRUFBNkI7QUFDM0JGLGNBQVEsQ0FBQ0csU0FBVCxDQUFtQjlFLEdBQW5CLENBQXVCL0wsSUFBdkIsRUFBNkJ4QyxLQUFLLENBQUNnVCxnQkFBbkM7O0FBQ0EsVUFBSSxDQUFFRSxRQUFRLENBQUNNLHdCQUFmLEVBQXlDO0FBQ3ZDeFQsYUFBSyxDQUFDTyxLQUFOLENBQVksNEJBQTRCMlMsUUFBUSxDQUFDaEgsUUFBckMsR0FBZ0QsR0FBaEQsR0FDQTFKLElBREEsR0FDTywrQkFEUCxHQUN5QzBRLFFBQVEsQ0FBQ2hILFFBRGxELEdBRUEseUJBRlo7QUFHRDtBQUNGOztBQUNELFFBQUlnSCxRQUFRLENBQUMxUSxJQUFELENBQVIsSUFBa0IsSUFBdEIsRUFBNEI7QUFDMUIsYUFBTytRLFVBQVUsQ0FBQ1IsZUFBZSxDQUFDRyxRQUFRLENBQUMxUSxJQUFELENBQVQsQ0FBaEIsRUFBa0MyUSxnQkFBbEMsQ0FBakI7QUFDRDtBQUNGOztBQUVELFNBQU8sSUFBUDtBQUNELENBaENEOztBQWtDQSxJQUFJSSxVQUFVLEdBQUcsVUFBVWxSLENBQVYsRUFBYW9SLFlBQWIsRUFBMkI7QUFDMUMsTUFBSSxPQUFPcFIsQ0FBUCxLQUFhLFVBQWpCLEVBQTZCO0FBQzNCLFdBQU9BLENBQVA7QUFDRDs7QUFFRCxTQUFPLFlBQVk7QUFDakIsUUFBSTBCLElBQUksR0FBRyxJQUFYO0FBQ0EsUUFBSTFDLElBQUksR0FBR0gsU0FBWDtBQUVBLFdBQU9sQixLQUFLLENBQUNnRixRQUFOLENBQWVHLHlCQUFmLENBQXlDc08sWUFBekMsRUFBdUQsWUFBWTtBQUN4RSxhQUFPelQsS0FBSyxDQUFDb0MsdUJBQU4sQ0FBOEJDLENBQTlCLEVBQWlDLGlCQUFqQyxFQUFvRGIsS0FBcEQsQ0FBMER1QyxJQUExRCxFQUFnRTFDLElBQWhFLENBQVA7QUFDRCxLQUZNLENBQVA7QUFHRCxHQVBEO0FBUUQsQ0FiRDs7QUFlQXJCLEtBQUssQ0FBQzBULHFCQUFOLEdBQThCLFVBQVUxTixJQUFWLEVBQWdCeEQsSUFBaEIsRUFBc0I7QUFDbEQsTUFBSTZHLFdBQVcsR0FBR3JELElBQWxCO0FBQ0EsTUFBSTJOLGlCQUFpQixHQUFHLEVBQXhCLENBRmtELENBSWxEO0FBQ0E7O0FBQ0EsS0FBRztBQUNEO0FBQ0E7QUFDQSxRQUFJalMsQ0FBQyxDQUFDNE8sR0FBRixDQUFNakgsV0FBVyxDQUFDN0YsY0FBbEIsRUFBa0NoQixJQUFsQyxDQUFKLEVBQTZDO0FBQzNDLFVBQUlvUixrQkFBa0IsR0FBR3ZLLFdBQVcsQ0FBQzdGLGNBQVosQ0FBMkJoQixJQUEzQixDQUF6QjtBQUNBLGFBQU8sWUFBWTtBQUNqQixlQUFPb1Isa0JBQWtCLENBQUM3SCxHQUFuQixFQUFQO0FBQ0QsT0FGRDtBQUdEO0FBQ0YsR0FURCxRQVNTLEVBQUcxQyxXQUFXLENBQUN3Syx1QkFBWixJQUNBLEVBQUd4SyxXQUFXLENBQUNoRyxVQUFaLElBQ0FnRyxXQUFXLENBQUNoRyxVQUFaLENBQXVCbVAsaUNBRDFCLENBREgsTUFHSW5KLFdBQVcsR0FBR0EsV0FBVyxDQUFDaEcsVUFIOUIsQ0FUVDs7QUFjQSxTQUFPLElBQVA7QUFDRCxDQXJCRCxDLENBdUJBO0FBQ0E7OztBQUNBckQsS0FBSyxDQUFDOFQsWUFBTixHQUFxQixVQUFVdFIsSUFBVixFQUFnQnVSLGdCQUFoQixFQUFrQztBQUNyRCxNQUFLdlIsSUFBSSxJQUFJeEMsS0FBSyxDQUFDZ0YsUUFBZixJQUE2QmhGLEtBQUssQ0FBQ2dGLFFBQU4sQ0FBZXhDLElBQWYsYUFBZ0N4QyxLQUFLLENBQUNnRixRQUF2RSxFQUFrRjtBQUNoRixXQUFPaEYsS0FBSyxDQUFDZ0YsUUFBTixDQUFleEMsSUFBZixDQUFQO0FBQ0Q7O0FBQ0QsU0FBTyxJQUFQO0FBQ0QsQ0FMRDs7QUFPQXhDLEtBQUssQ0FBQ2dVLGdCQUFOLEdBQXlCLFVBQVV4UixJQUFWLEVBQWdCdVIsZ0JBQWhCLEVBQWtDO0FBQ3pELE1BQUkvVCxLQUFLLENBQUMwUyxjQUFOLENBQXFCbFEsSUFBckIsS0FBOEIsSUFBbEMsRUFBd0M7QUFDdEMsV0FBTytRLFVBQVUsQ0FBQ1IsZUFBZSxDQUFDL1MsS0FBSyxDQUFDMFMsY0FBTixDQUFxQmxRLElBQXJCLENBQUQsQ0FBaEIsRUFBOEN1UixnQkFBOUMsQ0FBakI7QUFDRDs7QUFDRCxTQUFPLElBQVA7QUFDRCxDQUxELEMsQ0FPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQS9ULEtBQUssQ0FBQ3VDLElBQU4sQ0FBVzFCLFNBQVgsQ0FBcUJvVCxNQUFyQixHQUE4QixVQUFVelIsSUFBVixFQUFnQjBSLFFBQWhCLEVBQTBCO0FBQ3RELE1BQUloQixRQUFRLEdBQUcsS0FBS0EsUUFBcEI7QUFDQSxNQUFJaUIsY0FBYyxHQUFHRCxRQUFRLElBQUlBLFFBQVEsQ0FBQ2hCLFFBQTFDO0FBQ0EsTUFBSUksTUFBSjtBQUNBLE1BQUk1RSxPQUFKO0FBQ0EsTUFBSTBGLGlCQUFKO0FBQ0EsTUFBSUMsYUFBSjs7QUFFQSxNQUFJLEtBQUtOLGdCQUFULEVBQTJCO0FBQ3pCSyxxQkFBaUIsR0FBR3BVLEtBQUssQ0FBQ2UsS0FBTixDQUFZLEtBQUtnVCxnQkFBakIsRUFBbUMsSUFBbkMsQ0FBcEI7QUFDRCxHQVZxRCxDQVl0RDs7O0FBQ0EsTUFBSSxNQUFNTyxJQUFOLENBQVc5UixJQUFYLENBQUosRUFBc0I7QUFDcEI7QUFDQTtBQUNBLFFBQUksQ0FBQyxVQUFVOFIsSUFBVixDQUFlOVIsSUFBZixDQUFMLEVBQ0UsTUFBTSxJQUFJc0MsS0FBSixDQUFVLCtDQUFWLENBQU47QUFFRixXQUFPOUUsS0FBSyxDQUFDdVUsV0FBTixDQUFrQi9SLElBQUksQ0FBQ3JCLE1BQUwsR0FBYyxDQUFoQyxFQUFtQztBQUFLO0FBQXhDLEtBQVA7QUFFRCxHQXJCcUQsQ0F1QnREOzs7QUFDQSxNQUFJK1IsUUFBUSxJQUFLLENBQUNJLE1BQU0sR0FBR3RULEtBQUssQ0FBQ2lULGtCQUFOLENBQXlCQyxRQUF6QixFQUFtQzFRLElBQW5DLEVBQXlDNFIsaUJBQXpDLENBQVYsS0FBMEUsSUFBM0YsRUFBa0c7QUFDaEcsV0FBT2QsTUFBUDtBQUNELEdBMUJxRCxDQTRCdEQ7QUFDQTs7O0FBQ0EsTUFBSUosUUFBUSxJQUFJLENBQUN4RSxPQUFPLEdBQUcxTyxLQUFLLENBQUMwVCxxQkFBTixDQUE0QjFULEtBQUssQ0FBQ3FKLFdBQWxDLEVBQStDN0csSUFBL0MsQ0FBWCxLQUFvRSxJQUFwRixFQUEwRjtBQUN4RixXQUFPa00sT0FBUDtBQUNELEdBaENxRCxDQWtDdEQ7OztBQUNBLE1BQUl5RixjQUFjLElBQUssQ0FBQ0UsYUFBYSxHQUFHclUsS0FBSyxDQUFDOFQsWUFBTixDQUFtQnRSLElBQW5CLEVBQXlCNFIsaUJBQXpCLENBQWpCLEtBQWlFLElBQXhGLEVBQStGO0FBQzdGLFdBQU9DLGFBQVA7QUFDRCxHQXJDcUQsQ0F1Q3REOzs7QUFDQSxNQUFJLENBQUNmLE1BQU0sR0FBR3RULEtBQUssQ0FBQ2dVLGdCQUFOLENBQXVCeFIsSUFBdkIsRUFBNkI0UixpQkFBN0IsQ0FBVixLQUE4RCxJQUFsRSxFQUF3RTtBQUN0RSxXQUFPZCxNQUFQO0FBQ0QsR0ExQ3FELENBNEN0RDs7O0FBQ0EsU0FBTyxZQUFZO0FBQ2pCLFFBQUlrQixrQkFBa0IsR0FBSXRULFNBQVMsQ0FBQ0MsTUFBVixHQUFtQixDQUE3QztBQUNBLFFBQUl3SixJQUFJLEdBQUczSyxLQUFLLENBQUMwTCxPQUFOLEVBQVg7QUFDQSxRQUFJckwsQ0FBQyxHQUFHc0ssSUFBSSxJQUFJQSxJQUFJLENBQUNuSSxJQUFELENBQXBCOztBQUNBLFFBQUksQ0FBRW5DLENBQU4sRUFBUztBQUNQLFVBQUk4VCxjQUFKLEVBQW9CO0FBQ2xCLGNBQU0sSUFBSXJQLEtBQUosQ0FBVSx1QkFBdUJ0QyxJQUFqQyxDQUFOO0FBQ0QsT0FGRCxNQUVPLElBQUlnUyxrQkFBSixFQUF3QjtBQUM3QixjQUFNLElBQUkxUCxLQUFKLENBQVUsdUJBQXVCdEMsSUFBakMsQ0FBTjtBQUNELE9BRk0sTUFFQSxJQUFJQSxJQUFJLENBQUNpUyxNQUFMLENBQVksQ0FBWixNQUFtQixHQUFuQixLQUE0QnBVLENBQUMsS0FBSyxJQUFQLElBQ0NBLENBQUMsS0FBSzZILFNBRGxDLENBQUosRUFDbUQ7QUFDeEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBTSxJQUFJcEQsS0FBSixDQUFVLDRCQUE0QnRDLElBQXRDLENBQU47QUFDRDtBQUNGOztBQUNELFFBQUksQ0FBRW1JLElBQU4sRUFBWTtBQUNWLGFBQU8sSUFBUDtBQUNEOztBQUNELFFBQUksT0FBT3RLLENBQVAsS0FBYSxVQUFqQixFQUE2QjtBQUMzQixVQUFJbVUsa0JBQUosRUFBd0I7QUFDdEIsY0FBTSxJQUFJMVAsS0FBSixDQUFVLDhCQUE4QnpFLENBQXhDLENBQU47QUFDRDs7QUFDRCxhQUFPQSxDQUFQO0FBQ0Q7O0FBQ0QsV0FBT0EsQ0FBQyxDQUFDbUIsS0FBRixDQUFRbUosSUFBUixFQUFjekosU0FBZCxDQUFQO0FBQ0QsR0E5QkQ7QUErQkQsQ0E1RUQsQyxDQThFQTtBQUNBOzs7QUFDQWxCLEtBQUssQ0FBQ3VVLFdBQU4sR0FBb0IsVUFBVUcsTUFBVixFQUFrQkMsZ0JBQWxCLEVBQW9DO0FBQ3REO0FBQ0EsTUFBSUQsTUFBTSxJQUFJLElBQWQsRUFBb0I7QUFDbEJBLFVBQU0sR0FBRyxDQUFUO0FBQ0Q7O0FBQ0QsTUFBSTlJLE9BQU8sR0FBRzVMLEtBQUssQ0FBQzZMLE9BQU4sQ0FBYyxNQUFkLENBQWQ7O0FBQ0EsT0FBSyxJQUFJdEssQ0FBQyxHQUFHLENBQWIsRUFBaUJBLENBQUMsR0FBR21ULE1BQUwsSUFBZ0I5SSxPQUFoQyxFQUF5Q3JLLENBQUMsRUFBMUMsRUFBOEM7QUFDNUNxSyxXQUFPLEdBQUc1TCxLQUFLLENBQUM2TCxPQUFOLENBQWNELE9BQWQsRUFBdUIsTUFBdkIsQ0FBVjtBQUNEOztBQUVELE1BQUksQ0FBRUEsT0FBTixFQUNFLE9BQU8sSUFBUDtBQUNGLE1BQUkrSSxnQkFBSixFQUNFLE9BQU8sWUFBWTtBQUFFLFdBQU8vSSxPQUFPLENBQUNFLE9BQVIsQ0FBZ0JDLEdBQWhCLEVBQVA7QUFBK0IsR0FBcEQ7QUFDRixTQUFPSCxPQUFPLENBQUNFLE9BQVIsQ0FBZ0JDLEdBQWhCLEVBQVA7QUFDRCxDQWZEOztBQWtCQS9MLEtBQUssQ0FBQ3VDLElBQU4sQ0FBVzFCLFNBQVgsQ0FBcUJzVCxjQUFyQixHQUFzQyxVQUFVM1IsSUFBVixFQUFnQjtBQUNwRCxTQUFPLEtBQUt5UixNQUFMLENBQVl6UixJQUFaLEVBQWtCO0FBQUMwUSxZQUFRLEVBQUM7QUFBVixHQUFsQixDQUFQO0FBQ0QsQ0FGRCxDOzs7Ozs7Ozs7OztBQzNPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztBQU9BbFQsS0FBSyxDQUFDZ0YsUUFBTixHQUFpQixVQUFVa0gsUUFBVixFQUFvQjBJLGNBQXBCLEVBQW9DO0FBQ25ELE1BQUksRUFBRyxnQkFBZ0I1VSxLQUFLLENBQUNnRixRQUF6QixDQUFKLEVBQ0U7QUFDQSxXQUFPLElBQUloRixLQUFLLENBQUNnRixRQUFWLENBQW1Ca0gsUUFBbkIsRUFBNkIwSSxjQUE3QixDQUFQOztBQUVGLE1BQUksT0FBTzFJLFFBQVAsS0FBb0IsVUFBeEIsRUFBb0M7QUFDbEM7QUFDQTBJLGtCQUFjLEdBQUcxSSxRQUFqQjtBQUNBQSxZQUFRLEdBQUcsRUFBWDtBQUNEOztBQUNELE1BQUksT0FBT0EsUUFBUCxLQUFvQixRQUF4QixFQUNFLE1BQU0sSUFBSXBILEtBQUosQ0FBVSx3Q0FBVixDQUFOO0FBQ0YsTUFBSSxPQUFPOFAsY0FBUCxLQUEwQixVQUE5QixFQUNFLE1BQU0sSUFBSTlQLEtBQUosQ0FBVSxtQ0FBVixDQUFOO0FBRUYsT0FBS29ILFFBQUwsR0FBZ0JBLFFBQWhCO0FBQ0EsT0FBSzBJLGNBQUwsR0FBc0JBLGNBQXRCO0FBRUEsT0FBS3ZCLFNBQUwsR0FBaUIsSUFBSXdCLFNBQUosRUFBakI7QUFDQSxPQUFLQyxXQUFMLEdBQW1CLEVBQW5CO0FBRUEsT0FBS25TLFVBQUwsR0FBa0I7QUFDaEJDLFdBQU8sRUFBRSxFQURPO0FBRWhCQyxZQUFRLEVBQUUsRUFGTTtBQUdoQkMsYUFBUyxFQUFFO0FBSEssR0FBbEI7QUFLRCxDQTFCRDs7QUEyQkEsSUFBSWtDLFFBQVEsR0FBR2hGLEtBQUssQ0FBQ2dGLFFBQXJCOztBQUVBLElBQUk2UCxTQUFTLEdBQUcsWUFBWSxDQUFFLENBQTlCOztBQUNBQSxTQUFTLENBQUNoVSxTQUFWLENBQW9Ca0wsR0FBcEIsR0FBMEIsVUFBVXZKLElBQVYsRUFBZ0I7QUFDeEMsU0FBTyxLQUFLLE1BQUlBLElBQVQsQ0FBUDtBQUNELENBRkQ7O0FBR0FxUyxTQUFTLENBQUNoVSxTQUFWLENBQW9CME4sR0FBcEIsR0FBMEIsVUFBVS9MLElBQVYsRUFBZ0I4USxNQUFoQixFQUF3QjtBQUNoRCxPQUFLLE1BQUk5USxJQUFULElBQWlCOFEsTUFBakI7QUFDRCxDQUZEOztBQUdBdUIsU0FBUyxDQUFDaFUsU0FBVixDQUFvQnlQLEdBQXBCLEdBQTBCLFVBQVU5TixJQUFWLEVBQWdCO0FBQ3hDLFNBQVEsT0FBTyxLQUFLLE1BQUlBLElBQVQsQ0FBUCxLQUEwQixXQUFsQztBQUNELENBRkQ7QUFJQTs7Ozs7OztBQUtBeEMsS0FBSyxDQUFDK1UsVUFBTixHQUFtQixVQUFVQyxDQUFWLEVBQWE7QUFDOUIsU0FBUUEsQ0FBQyxZQUFZaFYsS0FBSyxDQUFDZ0YsUUFBM0I7QUFDRCxDQUZEO0FBSUE7Ozs7Ozs7Ozs7O0FBU0FBLFFBQVEsQ0FBQ25FLFNBQVQsQ0FBbUJvVSxTQUFuQixHQUErQixVQUFVdFIsRUFBVixFQUFjO0FBQzNDLE9BQUtoQixVQUFMLENBQWdCQyxPQUFoQixDQUF3QmdCLElBQXhCLENBQTZCRCxFQUE3QjtBQUNELENBRkQ7QUFJQTs7Ozs7Ozs7Ozs7QUFTQXFCLFFBQVEsQ0FBQ25FLFNBQVQsQ0FBbUJxVSxVQUFuQixHQUFnQyxVQUFVdlIsRUFBVixFQUFjO0FBQzVDLE9BQUtoQixVQUFMLENBQWdCRSxRQUFoQixDQUF5QmUsSUFBekIsQ0FBOEJELEVBQTlCO0FBQ0QsQ0FGRDtBQUlBOzs7Ozs7Ozs7OztBQVNBcUIsUUFBUSxDQUFDbkUsU0FBVCxDQUFtQnNVLFdBQW5CLEdBQWlDLFVBQVV4UixFQUFWLEVBQWM7QUFDN0MsT0FBS2hCLFVBQUwsQ0FBZ0JHLFNBQWhCLENBQTBCYyxJQUExQixDQUErQkQsRUFBL0I7QUFDRCxDQUZEOztBQUlBcUIsUUFBUSxDQUFDbkUsU0FBVCxDQUFtQnVVLGFBQW5CLEdBQW1DLFVBQVVuUCxLQUFWLEVBQWlCO0FBQ2xELE1BQUlsQyxJQUFJLEdBQUcsSUFBWDtBQUNBLE1BQUlzUixTQUFTLEdBQUd0UixJQUFJLENBQUNrQyxLQUFELENBQUosR0FBYyxDQUFDbEMsSUFBSSxDQUFDa0MsS0FBRCxDQUFMLENBQWQsR0FBOEIsRUFBOUMsQ0FGa0QsQ0FHbEQ7QUFDQTtBQUNBOztBQUNBb1AsV0FBUyxHQUFHQSxTQUFTLENBQUNDLE1BQVYsQ0FBaUJ2UixJQUFJLENBQUNwQixVQUFMLENBQWdCc0QsS0FBaEIsQ0FBakIsQ0FBWjtBQUNBLFNBQU9vUCxTQUFQO0FBQ0QsQ0FSRDs7QUFVQSxJQUFJbFAsYUFBYSxHQUFHLFVBQVVrUCxTQUFWLEVBQXFCbkMsUUFBckIsRUFBK0I7QUFDakRsTyxVQUFRLENBQUNHLHlCQUFULENBQ0UsWUFBWTtBQUFFLFdBQU8rTixRQUFQO0FBQWtCLEdBRGxDLEVBRUUsWUFBWTtBQUNWLFNBQUssSUFBSTNSLENBQUMsR0FBRyxDQUFSLEVBQVc4RSxDQUFDLEdBQUdnUCxTQUFTLENBQUNsVSxNQUE5QixFQUFzQ0ksQ0FBQyxHQUFHOEUsQ0FBMUMsRUFBNkM5RSxDQUFDLEVBQTlDLEVBQWtEO0FBQ2hEOFQsZUFBUyxDQUFDOVQsQ0FBRCxDQUFULENBQWFILElBQWIsQ0FBa0I4UixRQUFsQjtBQUNEO0FBQ0YsR0FOSDtBQU9ELENBUkQ7O0FBVUFsTyxRQUFRLENBQUNuRSxTQUFULENBQW1CaUksYUFBbkIsR0FBbUMsVUFBVXVGLFdBQVYsRUFBdUJTLFFBQXZCLEVBQWlDO0FBQ2xFLE1BQUkvSyxJQUFJLEdBQUcsSUFBWDtBQUNBLE1BQUlpQyxJQUFJLEdBQUdoRyxLQUFLLENBQUN1QyxJQUFOLENBQVd3QixJQUFJLENBQUNtSSxRQUFoQixFQUEwQm5JLElBQUksQ0FBQzZRLGNBQS9CLENBQVg7QUFDQTVPLE1BQUksQ0FBQ2tOLFFBQUwsR0FBZ0JuUCxJQUFoQjtBQUVBaUMsTUFBSSxDQUFDdVAsb0JBQUwsR0FDRWxILFdBQVcsR0FBRyxJQUFJckosUUFBSixDQUFhLGdCQUFiLEVBQStCcUosV0FBL0IsQ0FBSCxHQUFpRCxJQUQ5RDtBQUVBckksTUFBSSxDQUFDd1AsaUJBQUwsR0FDRTFHLFFBQVEsR0FBRyxJQUFJOUosUUFBSixDQUFhLGFBQWIsRUFBNEI4SixRQUE1QixDQUFILEdBQTJDLElBRHJEOztBQUdBLE1BQUkvSyxJQUFJLENBQUMrUSxXQUFMLElBQW9CLE9BQU8vUSxJQUFJLENBQUMwUixNQUFaLEtBQXVCLFFBQS9DLEVBQXlEO0FBQ3ZEelAsUUFBSSxDQUFDbkMsZUFBTCxDQUFxQixZQUFZO0FBQy9CLFVBQUltQyxJQUFJLENBQUN2QyxXQUFMLEtBQXFCLENBQXpCLEVBQ0U7O0FBRUYsVUFBSSxDQUFFTSxJQUFJLENBQUMrUSxXQUFMLENBQWlCM1QsTUFBbkIsSUFBNkIsT0FBTzRDLElBQUksQ0FBQzBSLE1BQVosS0FBdUIsUUFBeEQsRUFBa0U7QUFDaEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0F6USxnQkFBUSxDQUFDbkUsU0FBVCxDQUFtQjRVLE1BQW5CLENBQTBCclUsSUFBMUIsQ0FBK0IyQyxJQUEvQixFQUFxQ0EsSUFBSSxDQUFDMFIsTUFBMUM7QUFDRDs7QUFFRC9ULE9BQUMsQ0FBQ29MLElBQUYsQ0FBTy9JLElBQUksQ0FBQytRLFdBQVosRUFBeUIsVUFBVVksQ0FBVixFQUFhO0FBQ3BDMVYsYUFBSyxDQUFDeU0sWUFBTixDQUFtQnpHLElBQW5CLEVBQXlCMFAsQ0FBekIsRUFBNEIxUCxJQUE1QjtBQUNELE9BRkQ7QUFHRCxLQWpCRDtBQWtCRDs7QUFFREEsTUFBSSxDQUFDMlAsaUJBQUwsR0FBeUIsSUFBSTNWLEtBQUssQ0FBQzRWLGdCQUFWLENBQTJCNVAsSUFBM0IsQ0FBekI7O0FBQ0FBLE1BQUksQ0FBQytOLGdCQUFMLEdBQXdCLFlBQVk7QUFDbEM7QUFDQTtBQUNBLFFBQUk4QixJQUFJLEdBQUc3UCxJQUFJLENBQUMyUCxpQkFBaEI7QUFFQTs7Ozs7Ozs7QUFPQUUsUUFBSSxDQUFDbEwsSUFBTCxHQUFZM0ssS0FBSyxDQUFDMEwsT0FBTixDQUFjMUYsSUFBZCxDQUFaOztBQUVBLFFBQUlBLElBQUksQ0FBQzFDLFNBQUwsSUFBa0IsQ0FBQzBDLElBQUksQ0FBQzdDLFdBQTVCLEVBQXlDO0FBQ3ZDMFMsVUFBSSxDQUFDaFEsU0FBTCxHQUFpQkcsSUFBSSxDQUFDMUMsU0FBTCxDQUFldUMsU0FBZixFQUFqQjtBQUNBZ1EsVUFBSSxDQUFDL1AsUUFBTCxHQUFnQkUsSUFBSSxDQUFDMUMsU0FBTCxDQUFld0MsUUFBZixFQUFoQjtBQUNELEtBSEQsTUFHTztBQUNMO0FBQ0ErUCxVQUFJLENBQUNoUSxTQUFMLEdBQWlCLElBQWpCO0FBQ0FnUSxVQUFJLENBQUMvUCxRQUFMLEdBQWdCLElBQWhCO0FBQ0Q7O0FBRUQsV0FBTytQLElBQVA7QUFDRCxHQXhCRDtBQTBCQTs7Ozs7Ozs7QUFRQTtBQUNBO0FBQ0E7OztBQUNBLE1BQUlDLGdCQUFnQixHQUFHL1IsSUFBSSxDQUFDcVIsYUFBTCxDQUFtQixTQUFuQixDQUF2Qjs7QUFDQXBQLE1BQUksQ0FBQ3RDLGFBQUwsQ0FBbUIsWUFBWTtBQUM3QnlDLGlCQUFhLENBQUMyUCxnQkFBRCxFQUFtQjlQLElBQUksQ0FBQytOLGdCQUFMLEVBQW5CLENBQWI7QUFDRCxHQUZEO0FBSUE7Ozs7Ozs7OztBQVFBLE1BQUlnQyxpQkFBaUIsR0FBR2hTLElBQUksQ0FBQ3FSLGFBQUwsQ0FBbUIsVUFBbkIsQ0FBeEI7O0FBQ0FwUCxNQUFJLENBQUNsQyxXQUFMLENBQWlCLFlBQVk7QUFDM0JxQyxpQkFBYSxDQUFDNFAsaUJBQUQsRUFBb0IvUCxJQUFJLENBQUMrTixnQkFBTCxFQUFwQixDQUFiO0FBQ0QsR0FGRDtBQUlBOzs7Ozs7Ozs7QUFRQSxNQUFJaUMsa0JBQWtCLEdBQUdqUyxJQUFJLENBQUNxUixhQUFMLENBQW1CLFdBQW5CLENBQXpCOztBQUNBcFAsTUFBSSxDQUFDekIsZUFBTCxDQUFxQixZQUFZO0FBQy9CNEIsaUJBQWEsQ0FBQzZQLGtCQUFELEVBQXFCaFEsSUFBSSxDQUFDK04sZ0JBQUwsRUFBckIsQ0FBYjtBQUNELEdBRkQ7QUFJQSxTQUFPL04sSUFBUDtBQUNELENBckdEO0FBdUdBOzs7Ozs7OztBQU1BaEcsS0FBSyxDQUFDNFYsZ0JBQU4sR0FBeUIsVUFBVTVQLElBQVYsRUFBZ0I7QUFDdkMsTUFBSSxFQUFHLGdCQUFnQmhHLEtBQUssQ0FBQzRWLGdCQUF6QixDQUFKLEVBQ0U7QUFDQSxXQUFPLElBQUk1VixLQUFLLENBQUM0VixnQkFBVixDQUEyQjVQLElBQTNCLENBQVA7QUFFRixNQUFJLEVBQUdBLElBQUksWUFBWWhHLEtBQUssQ0FBQ3VDLElBQXpCLENBQUosRUFDRSxNQUFNLElBQUl1QyxLQUFKLENBQVUsZUFBVixDQUFOO0FBRUZrQixNQUFJLENBQUMyUCxpQkFBTCxHQUF5QixJQUF6QjtBQUVBOzs7Ozs7Ozs7QUFRQSxPQUFLM1AsSUFBTCxHQUFZQSxJQUFaO0FBQ0EsT0FBSzJFLElBQUwsR0FBWSxJQUFaO0FBRUE7Ozs7Ozs7OztBQVFBLE9BQUs5RSxTQUFMLEdBQWlCLElBQWpCO0FBRUE7Ozs7Ozs7OztBQVFBLE9BQUtDLFFBQUwsR0FBZ0IsSUFBaEIsQ0F2Q3VDLENBeUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBLE9BQUttUSxnQkFBTCxHQUF3QixJQUFJaFMsT0FBTyxDQUFDd0wsVUFBWixFQUF4QjtBQUNBLE9BQUt5RyxhQUFMLEdBQXFCLEtBQXJCO0FBRUEsT0FBS0Msb0JBQUwsR0FBNEIsRUFBNUI7QUFDRCxDQWxERDtBQW9EQTs7Ozs7Ozs7QUFNQW5XLEtBQUssQ0FBQzRWLGdCQUFOLENBQXVCL1UsU0FBdkIsQ0FBaUN1VixDQUFqQyxHQUFxQyxVQUFVN0ksUUFBVixFQUFvQjtBQUN2RCxNQUFJdkgsSUFBSSxHQUFHLEtBQUtBLElBQWhCO0FBQ0EsTUFBSSxDQUFFQSxJQUFJLENBQUMxQyxTQUFYLEVBQ0UsTUFBTSxJQUFJd0IsS0FBSixDQUFVLDhDQUFWLENBQU47QUFDRixTQUFPa0IsSUFBSSxDQUFDMUMsU0FBTCxDQUFlOFMsQ0FBZixDQUFpQjdJLFFBQWpCLENBQVA7QUFDRCxDQUxEO0FBT0E7Ozs7Ozs7O0FBTUF2TixLQUFLLENBQUM0VixnQkFBTixDQUF1Qi9VLFNBQXZCLENBQWlDd1YsT0FBakMsR0FBMkMsVUFBVTlJLFFBQVYsRUFBb0I7QUFDN0QsU0FBT2pNLEtBQUssQ0FBQ1QsU0FBTixDQUFnQlksS0FBaEIsQ0FBc0JMLElBQXRCLENBQTJCLEtBQUtnVixDQUFMLENBQU83SSxRQUFQLENBQTNCLENBQVA7QUFDRCxDQUZEO0FBSUE7Ozs7Ozs7O0FBTUF2TixLQUFLLENBQUM0VixnQkFBTixDQUF1Qi9VLFNBQXZCLENBQWlDeVYsSUFBakMsR0FBd0MsVUFBVS9JLFFBQVYsRUFBb0I7QUFDMUQsTUFBSWxGLE1BQU0sR0FBRyxLQUFLK04sQ0FBTCxDQUFPN0ksUUFBUCxDQUFiO0FBQ0EsU0FBT2xGLE1BQU0sQ0FBQyxDQUFELENBQU4sSUFBYSxJQUFwQjtBQUNELENBSEQ7QUFLQTs7Ozs7OztBQUtBckksS0FBSyxDQUFDNFYsZ0JBQU4sQ0FBdUIvVSxTQUF2QixDQUFpQzhELE9BQWpDLEdBQTJDLFVBQVV0QyxDQUFWLEVBQWE7QUFDdEQsU0FBTyxLQUFLMkQsSUFBTCxDQUFVckIsT0FBVixDQUFrQnRDLENBQWxCLENBQVA7QUFDRCxDQUZEO0FBSUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW1CQXJDLEtBQUssQ0FBQzRWLGdCQUFOLENBQXVCL1UsU0FBdkIsQ0FBaUM0RSxTQUFqQyxHQUE2QztBQUFVO0FBQWlCO0FBQ3RFLE1BQUkxQixJQUFJLEdBQUcsSUFBWDtBQUVBLE1BQUl3UyxVQUFVLEdBQUd4UyxJQUFJLENBQUNvUyxvQkFBdEI7O0FBQ0EsTUFBSTlVLElBQUksR0FBR0ssQ0FBQyxDQUFDOFUsT0FBRixDQUFVdFYsU0FBVixDQUFYLENBSnNFLENBTXRFOzs7QUFDQSxNQUFJd0UsT0FBTyxHQUFHLEVBQWQ7O0FBQ0EsTUFBSXJFLElBQUksQ0FBQ0YsTUFBVCxFQUFpQjtBQUNmLFFBQUlzVixTQUFTLEdBQUcvVSxDQUFDLENBQUNnVixJQUFGLENBQU9yVixJQUFQLENBQWhCLENBRGUsQ0FHZjs7O0FBQ0EsUUFBSXNWLHVCQUF1QixHQUFHO0FBQzVCQyxhQUFPLEVBQUVDLEtBQUssQ0FBQ0MsUUFBTixDQUFlbFcsUUFBZixDQURtQjtBQUU1QjtBQUNBO0FBQ0FtVyxhQUFPLEVBQUVGLEtBQUssQ0FBQ0MsUUFBTixDQUFlbFcsUUFBZixDQUptQjtBQUs1QjJFLFlBQU0sRUFBRXNSLEtBQUssQ0FBQ0MsUUFBTixDQUFlbFcsUUFBZixDQUxvQjtBQU01QmdGLGdCQUFVLEVBQUVpUixLQUFLLENBQUNDLFFBQU4sQ0FBZUQsS0FBSyxDQUFDRyxHQUFyQjtBQU5nQixLQUE5Qjs7QUFTQSxRQUFJdFYsQ0FBQyxDQUFDdVYsVUFBRixDQUFhUixTQUFiLENBQUosRUFBNkI7QUFDM0IvUSxhQUFPLENBQUNrUixPQUFSLEdBQWtCdlYsSUFBSSxDQUFDNlYsR0FBTCxFQUFsQjtBQUNELEtBRkQsTUFFTyxJQUFJVCxTQUFTLElBQUksQ0FBRS9VLENBQUMsQ0FBQ3lWLE9BQUYsQ0FBVVYsU0FBVixDQUFmLElBQXVDSSxLQUFLLENBQUN2QyxJQUFOLENBQVdtQyxTQUFYLEVBQXNCRSx1QkFBdEIsQ0FBM0MsRUFBMkY7QUFDaEdqUixhQUFPLEdBQUdyRSxJQUFJLENBQUM2VixHQUFMLEVBQVY7QUFDRDtBQUNGOztBQUVELE1BQUl2UixTQUFKO0FBQ0EsTUFBSXlSLFVBQVUsR0FBRzFSLE9BQU8sQ0FBQ0gsTUFBekI7O0FBQ0FHLFNBQU8sQ0FBQ0gsTUFBUixHQUFpQixVQUFVOFIsS0FBVixFQUFpQjtBQUNoQztBQUNBO0FBQ0EsV0FBT2QsVUFBVSxDQUFDNVEsU0FBUyxDQUFDMlIsY0FBWCxDQUFqQixDQUhnQyxDQUtoQztBQUNBO0FBQ0E7O0FBQ0EsUUFBSSxDQUFFdlQsSUFBSSxDQUFDbVMsYUFBWCxFQUEwQjtBQUN4Qm5TLFVBQUksQ0FBQ2tTLGdCQUFMLENBQXNCbEYsT0FBdEI7QUFDRDs7QUFFRCxRQUFJcUcsVUFBSixFQUFnQjtBQUNkQSxnQkFBVSxDQUFDQyxLQUFELENBQVY7QUFDRDtBQUNGLEdBZkQ7O0FBaUJBLE1BQUl6UixVQUFVLEdBQUdGLE9BQU8sQ0FBQ0UsVUFBekI7O0FBQ0EsTUFBSXlQLFNBQVMsR0FBRzNULENBQUMsQ0FBQzZWLElBQUYsQ0FBTzdSLE9BQVAsRUFBZ0IsQ0FBQyxTQUFELEVBQVksU0FBWixFQUF1QixRQUF2QixDQUFoQixDQUFoQixDQWhEc0UsQ0FrRHRFO0FBQ0E7OztBQUNBckUsTUFBSSxDQUFDdUMsSUFBTCxDQUFVeVIsU0FBVixFQXBEc0UsQ0FzRHRFO0FBQ0E7O0FBQ0ExUCxXQUFTLEdBQUc1QixJQUFJLENBQUNpQyxJQUFMLENBQVVQLFNBQVYsQ0FBb0JyRSxJQUFwQixDQUF5QjJDLElBQUksQ0FBQ2lDLElBQTlCLEVBQW9DM0UsSUFBcEMsRUFBMEM7QUFDcER1RSxjQUFVLEVBQUVBO0FBRHdDLEdBQTFDLENBQVo7O0FBSUEsTUFBSSxDQUFFbEUsQ0FBQyxDQUFDNE8sR0FBRixDQUFNaUcsVUFBTixFQUFrQjVRLFNBQVMsQ0FBQzJSLGNBQTVCLENBQU4sRUFBbUQ7QUFDakRmLGNBQVUsQ0FBQzVRLFNBQVMsQ0FBQzJSLGNBQVgsQ0FBVixHQUF1QzNSLFNBQXZDLENBRGlELENBR2pEO0FBQ0E7QUFDQTs7QUFDQSxRQUFJNUIsSUFBSSxDQUFDbVMsYUFBVCxFQUF3QjtBQUN0Qm5TLFVBQUksQ0FBQ2tTLGdCQUFMLENBQXNCbEYsT0FBdEI7QUFDRDtBQUNGOztBQUVELFNBQU9wTCxTQUFQO0FBQ0QsQ0F4RUQ7QUEwRUE7Ozs7Ozs7O0FBTUEzRixLQUFLLENBQUM0VixnQkFBTixDQUF1Qi9VLFNBQXZCLENBQWlDMlcsa0JBQWpDLEdBQXNELFlBQVk7QUFDaEUsT0FBS3ZCLGdCQUFMLENBQXNCdkcsTUFBdEI7O0FBRUEsT0FBS3dHLGFBQUwsR0FBcUJ4VSxDQUFDLENBQUMrVixHQUFGLENBQU0sS0FBS3RCLG9CQUFYLEVBQWlDLFVBQVV1QixNQUFWLEVBQWtCO0FBQ3RFLFdBQU9BLE1BQU0sQ0FBQ0MsS0FBUCxFQUFQO0FBQ0QsR0FGb0IsQ0FBckI7QUFJQSxTQUFPLEtBQUt6QixhQUFaO0FBQ0QsQ0FSRDtBQVVBOzs7Ozs7OztBQU1BbFIsUUFBUSxDQUFDbkUsU0FBVCxDQUFtQitXLE9BQW5CLEdBQTZCLFVBQVVDLElBQVYsRUFBZ0I7QUFDM0MsTUFBSSxDQUFFblcsQ0FBQyxDQUFDMk8sUUFBRixDQUFXd0gsSUFBWCxDQUFOLEVBQXdCO0FBQ3RCLFVBQU0sSUFBSS9TLEtBQUosQ0FBVSx3Q0FBVixDQUFOO0FBQ0Q7O0FBRUQsT0FBSyxJQUFJZ1QsQ0FBVCxJQUFjRCxJQUFkLEVBQ0UsS0FBS3hFLFNBQUwsQ0FBZTlFLEdBQWYsQ0FBbUJ1SixDQUFuQixFQUFzQkQsSUFBSSxDQUFDQyxDQUFELENBQTFCO0FBQ0gsQ0FQRDs7QUFTQSxJQUFJQyxhQUFhLEdBQUcsWUFBVztBQUM3QixNQUFJQyxNQUFNLENBQUNDLGNBQVgsRUFBMkI7QUFDekIsUUFBSWhYLEdBQUcsR0FBRyxFQUFWOztBQUNBLFFBQUk7QUFDRitXLFlBQU0sQ0FBQ0MsY0FBUCxDQUFzQmhYLEdBQXRCLEVBQTJCLE1BQTNCLEVBQW1DO0FBQ2pDOEssV0FBRyxFQUFFLFlBQVk7QUFBRSxpQkFBTzlLLEdBQVA7QUFBYTtBQURDLE9BQW5DO0FBR0QsS0FKRCxDQUlFLE9BQU9hLENBQVAsRUFBVTtBQUNWLGFBQU8sS0FBUDtBQUNEOztBQUNELFdBQU9iLEdBQUcsQ0FBQzhDLElBQUosS0FBYTlDLEdBQXBCO0FBQ0Q7O0FBQ0QsU0FBTyxLQUFQO0FBQ0QsQ0FibUIsRUFBcEI7O0FBZUEsSUFBSThXLGFBQUosRUFBbUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFJRywyQkFBMkIsR0FBRyxJQUFsQyxDQUxpQixDQU9qQjtBQUNBO0FBQ0E7O0FBQ0FGLFFBQU0sQ0FBQ0MsY0FBUCxDQUFzQmpULFFBQXRCLEVBQWdDLDhCQUFoQyxFQUFnRTtBQUM5RCtHLE9BQUcsRUFBRSxZQUFZO0FBQ2YsYUFBT21NLDJCQUFQO0FBQ0Q7QUFINkQsR0FBaEU7O0FBTUFsVCxVQUFRLENBQUNHLHlCQUFULEdBQXFDLFVBQVVKLG9CQUFWLEVBQWdDL0QsSUFBaEMsRUFBc0M7QUFDekUsUUFBSSxPQUFPQSxJQUFQLEtBQWdCLFVBQXBCLEVBQWdDO0FBQzlCLFlBQU0sSUFBSThELEtBQUosQ0FBVSw2QkFBNkI5RCxJQUF2QyxDQUFOO0FBQ0Q7O0FBQ0QsUUFBSW1YLG1CQUFtQixHQUFHRCwyQkFBMUI7O0FBQ0EsUUFBSTtBQUNGQSxpQ0FBMkIsR0FBR25ULG9CQUE5QjtBQUNBLGFBQU8vRCxJQUFJLEVBQVg7QUFDRCxLQUhELFNBR1U7QUFDUmtYLGlDQUEyQixHQUFHQyxtQkFBOUI7QUFDRDtBQUNGLEdBWEQ7QUFhRCxDQTdCRCxNQTZCTztBQUNMO0FBQ0FuVCxVQUFRLENBQUNDLDRCQUFULEdBQXdDLElBQXhDOztBQUVBRCxVQUFRLENBQUNHLHlCQUFULEdBQXFDLFVBQVVKLG9CQUFWLEVBQWdDL0QsSUFBaEMsRUFBc0M7QUFDekUsUUFBSSxPQUFPQSxJQUFQLEtBQWdCLFVBQXBCLEVBQWdDO0FBQzlCLFlBQU0sSUFBSThELEtBQUosQ0FBVSw2QkFBNkI5RCxJQUF2QyxDQUFOO0FBQ0Q7O0FBQ0QsUUFBSW1YLG1CQUFtQixHQUFHblQsUUFBUSxDQUFDQyw0QkFBbkM7O0FBQ0EsUUFBSTtBQUNGRCxjQUFRLENBQUNDLDRCQUFULEdBQXdDRixvQkFBeEM7QUFDQSxhQUFPL0QsSUFBSSxFQUFYO0FBQ0QsS0FIRCxTQUdVO0FBQ1JnRSxjQUFRLENBQUNDLDRCQUFULEdBQXdDa1QsbUJBQXhDO0FBQ0Q7QUFDRixHQVhEO0FBWUQ7QUFFRDs7Ozs7Ozs7QUFNQW5ULFFBQVEsQ0FBQ25FLFNBQVQsQ0FBbUI0VSxNQUFuQixHQUE0QixVQUFVL0ksUUFBVixFQUFvQjtBQUM5QyxNQUFJLENBQUVoTCxDQUFDLENBQUMyTyxRQUFGLENBQVczRCxRQUFYLENBQU4sRUFBNEI7QUFDMUIsVUFBTSxJQUFJNUgsS0FBSixDQUFVLCtCQUFWLENBQU47QUFDRDs7QUFFRCxNQUFJb08sUUFBUSxHQUFHLElBQWY7QUFDQSxNQUFJa0YsU0FBUyxHQUFHLEVBQWhCOztBQUNBLE9BQUssSUFBSU4sQ0FBVCxJQUFjcEwsUUFBZCxFQUF3QjtBQUN0QjBMLGFBQVMsQ0FBQ04sQ0FBRCxDQUFULEdBQWdCLFVBQVVBLENBQVYsRUFBYXhMLENBQWIsRUFBZ0I7QUFDOUIsYUFBTyxVQUFVK0w7QUFBSztBQUFmLFFBQTBCO0FBQy9CLFlBQUlyUyxJQUFJLEdBQUcsSUFBWCxDQUQrQixDQUNkOztBQUNqQixZQUFJMkUsSUFBSSxHQUFHM0ssS0FBSyxDQUFDMEwsT0FBTixDQUFjMk0sS0FBSyxDQUFDeEssYUFBcEIsQ0FBWDtBQUNBLFlBQUlsRCxJQUFJLElBQUksSUFBWixFQUNFQSxJQUFJLEdBQUcsRUFBUDtBQUNGLFlBQUl0SixJQUFJLEdBQUdDLEtBQUssQ0FBQ1QsU0FBTixDQUFnQlksS0FBaEIsQ0FBc0JMLElBQXRCLENBQTJCRixTQUEzQixDQUFYOztBQUNBLFlBQUlpUyxnQkFBZ0IsR0FBR25ULEtBQUssQ0FBQ2UsS0FBTixDQUFZaUYsSUFBSSxDQUFDK04sZ0JBQWpCLEVBQW1DL04sSUFBbkMsQ0FBdkI7O0FBQ0EzRSxZQUFJLENBQUM2UCxNQUFMLENBQVksQ0FBWixFQUFlLENBQWYsRUFBa0JpQyxnQkFBZ0IsRUFBbEM7QUFFQSxlQUFPbk8sUUFBUSxDQUFDRyx5QkFBVCxDQUFtQ2dPLGdCQUFuQyxFQUFxRCxZQUFZO0FBQ3RFLGlCQUFPN0csQ0FBQyxDQUFDOUssS0FBRixDQUFRbUosSUFBUixFQUFjdEosSUFBZCxDQUFQO0FBQ0QsU0FGTSxDQUFQO0FBR0QsT0FaRDtBQWFELEtBZGMsQ0FjWnlXLENBZFksRUFjVHBMLFFBQVEsQ0FBQ29MLENBQUQsQ0FkQyxDQUFmO0FBZUQ7O0FBRUQ1RSxVQUFRLENBQUM0QixXQUFULENBQXFCbFIsSUFBckIsQ0FBMEJ3VSxTQUExQjtBQUNELENBMUJEO0FBNEJBOzs7Ozs7Ozs7OztBQVNBcFQsUUFBUSxDQUFDc1QsUUFBVCxHQUFvQixZQUFZO0FBQzlCLFNBQU90VCxRQUFRLENBQUNDLDRCQUFULElBQ0ZELFFBQVEsQ0FBQ0MsNEJBQVQsRUFETDtBQUVELENBSEQsQyxDQUtBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBZUFELFFBQVEsQ0FBQ3VULFdBQVQsR0FBdUJ2WSxLQUFLLENBQUMwTCxPQUE3QjtBQUVBOzs7Ozs7OztBQU9BMUcsUUFBUSxDQUFDd1QsVUFBVCxHQUFzQnhZLEtBQUssQ0FBQ3VVLFdBQTVCO0FBRUE7Ozs7Ozs7OztBQVFBdlAsUUFBUSxDQUFDMk4sY0FBVCxHQUEwQjNTLEtBQUssQ0FBQzJTLGNBQWhDO0FBRUE7Ozs7Ozs7O0FBT0EzTixRQUFRLENBQUM0TixnQkFBVCxHQUE0QjVTLEtBQUssQ0FBQzRTLGdCQUFsQyxDOzs7Ozs7Ozs7OztBQy9sQkE2RixFQUFFLEdBQUd6WSxLQUFMO0FBRUFBLEtBQUssQ0FBQ3NPLFdBQU4sR0FBb0JBLFdBQXBCO0FBQ0FtSyxFQUFFLENBQUM5QyxpQkFBSCxHQUF1QjNWLEtBQUssQ0FBQ2dGLFFBQU4sQ0FBZXNULFFBQXRDO0FBRUFJLFVBQVUsR0FBRyxFQUFiO0FBQ0FBLFVBQVUsQ0FBQy9GLGNBQVgsR0FBNEIzUyxLQUFLLENBQUMyUyxjQUFsQztBQUVBK0YsVUFBVSxDQUFDelksT0FBWCxHQUFxQkQsS0FBSyxDQUFDQyxPQUEzQixDLENBRUE7QUFDQTs7QUFDQXlZLFVBQVUsQ0FBQ0MsVUFBWCxHQUF3QixVQUFTQyxNQUFULEVBQWlCO0FBQ3ZDLE9BQUtBLE1BQUwsR0FBY0EsTUFBZDtBQUNELENBRkQ7O0FBR0FGLFVBQVUsQ0FBQ0MsVUFBWCxDQUFzQjlYLFNBQXRCLENBQWdDZ1ksUUFBaEMsR0FBMkMsWUFBVztBQUNwRCxTQUFPLEtBQUtELE1BQUwsQ0FBWUMsUUFBWixFQUFQO0FBQ0QsQ0FGRCxDIiwiZmlsZSI6Ii9wYWNrYWdlcy9ibGF6ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQG5hbWVzcGFjZSBCbGF6ZVxuICogQHN1bW1hcnkgVGhlIG5hbWVzcGFjZSBmb3IgYWxsIEJsYXplLXJlbGF0ZWQgbWV0aG9kcyBhbmQgY2xhc3Nlcy5cbiAqL1xuQmxhemUgPSB7fTtcblxuLy8gVXRpbGl0eSB0byBIVE1MLWVzY2FwZSBhIHN0cmluZy4gIEluY2x1ZGVkIGZvciBsZWdhY3kgcmVhc29ucy5cbi8vIFRPRE86IFNob3VsZCBiZSByZXBsYWNlZCB3aXRoIF8uZXNjYXBlIG9uY2UgdW5kZXJzY29yZSBpcyB1cGdyYWRlZCB0byBhIG5ld2VyXG4vLyAgICAgICB2ZXJzaW9uIHdoaWNoIGVzY2FwZXMgYCAoYmFja3RpY2spIGFzIHdlbGwuIFVuZGVyc2NvcmUgMS41LjIgZG9lcyBub3QuXG5CbGF6ZS5fZXNjYXBlID0gKGZ1bmN0aW9uKCkge1xuICB2YXIgZXNjYXBlX21hcCA9IHtcbiAgICBcIjxcIjogXCImbHQ7XCIsXG4gICAgXCI+XCI6IFwiJmd0O1wiLFxuICAgICdcIic6IFwiJnF1b3Q7XCIsXG4gICAgXCInXCI6IFwiJiN4Mjc7XCIsXG4gICAgXCIvXCI6IFwiJiN4MkY7XCIsXG4gICAgXCJgXCI6IFwiJiN4NjA7XCIsIC8qIElFIGFsbG93cyBiYWNrdGljay1kZWxpbWl0ZWQgYXR0cmlidXRlcz8/ICovXG4gICAgXCImXCI6IFwiJmFtcDtcIlxuICB9O1xuICB2YXIgZXNjYXBlX29uZSA9IGZ1bmN0aW9uKGMpIHtcbiAgICByZXR1cm4gZXNjYXBlX21hcFtjXTtcbiAgfTtcblxuICByZXR1cm4gZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4geC5yZXBsYWNlKC9bJjw+XCInYF0vZywgZXNjYXBlX29uZSk7XG4gIH07XG59KSgpO1xuXG5CbGF6ZS5fd2FybiA9IGZ1bmN0aW9uIChtc2cpIHtcbiAgbXNnID0gJ1dhcm5pbmc6ICcgKyBtc2c7XG5cbiAgaWYgKCh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcpICYmIGNvbnNvbGUud2Fybikge1xuICAgIGNvbnNvbGUud2Fybihtc2cpO1xuICB9XG59O1xuXG52YXIgbmF0aXZlQmluZCA9IEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kO1xuXG4vLyBBbiBpbXBsZW1lbnRhdGlvbiBvZiBfLmJpbmQgd2hpY2ggYWxsb3dzIGJldHRlciBvcHRpbWl6YXRpb24uXG4vLyBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9wZXRrYWFudG9ub3YvYmx1ZWJpcmQvd2lraS9PcHRpbWl6YXRpb24ta2lsbGVycyMzLW1hbmFnaW5nLWFyZ3VtZW50c1xuaWYgKG5hdGl2ZUJpbmQpIHtcbiAgQmxhemUuX2JpbmQgPSBmdW5jdGlvbiAoZnVuYywgb2JqKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIHtcbiAgICAgIHJldHVybiBuYXRpdmVCaW5kLmNhbGwoZnVuYywgb2JqKTtcbiAgICB9XG5cbiAgICAvLyBDb3B5IHRoZSBhcmd1bWVudHMgc28gdGhpcyBmdW5jdGlvbiBjYW4gYmUgb3B0aW1pemVkLlxuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xuICAgICAgYXJnc1tpXSA9IGFyZ3VtZW50c1tpXTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmF0aXZlQmluZC5hcHBseShmdW5jLCBhcmdzLnNsaWNlKDEpKTtcbiAgfTtcbn1cbmVsc2Uge1xuICAvLyBBIHNsb3dlciBidXQgYmFja3dhcmRzIGNvbXBhdGlibGUgdmVyc2lvbi5cbiAgQmxhemUuX2JpbmQgPSBfLmJpbmQ7XG59XG4iLCJ2YXIgZGVidWdGdW5jO1xuXG4vLyBXZSBjYWxsIGludG8gdXNlciBjb2RlIGluIG1hbnkgcGxhY2VzLCBhbmQgaXQncyBuaWNlIHRvIGNhdGNoIGV4Y2VwdGlvbnNcbi8vIHByb3BhZ2F0ZWQgZnJvbSB1c2VyIGNvZGUgaW1tZWRpYXRlbHkgc28gdGhhdCB0aGUgd2hvbGUgc3lzdGVtIGRvZXNuJ3QganVzdFxuLy8gYnJlYWsuICBDYXRjaGluZyBleGNlcHRpb25zIGlzIGVhc3k7IHJlcG9ydGluZyB0aGVtIGlzIGhhcmQuICBUaGlzIGhlbHBlclxuLy8gcmVwb3J0cyBleGNlcHRpb25zLlxuLy9cbi8vIFVzYWdlOlxuLy9cbi8vIGBgYFxuLy8gdHJ5IHtcbi8vICAgLy8gLi4uIHNvbWVTdHVmZiAuLi5cbi8vIH0gY2F0Y2ggKGUpIHtcbi8vICAgcmVwb3J0VUlFeGNlcHRpb24oZSk7XG4vLyB9XG4vLyBgYGBcbi8vXG4vLyBBbiBvcHRpb25hbCBzZWNvbmQgYXJndW1lbnQgb3ZlcnJpZGVzIHRoZSBkZWZhdWx0IG1lc3NhZ2UuXG5cbi8vIFNldCB0aGlzIHRvIGB0cnVlYCB0byBjYXVzZSBgcmVwb3J0RXhjZXB0aW9uYCB0byB0aHJvd1xuLy8gdGhlIG5leHQgZXhjZXB0aW9uIHJhdGhlciB0aGFuIHJlcG9ydGluZyBpdC4gIFRoaXMgaXNcbi8vIHVzZWZ1bCBpbiB1bml0IHRlc3RzIHRoYXQgdGVzdCBlcnJvciBtZXNzYWdlcy5cbkJsYXplLl90aHJvd05leHRFeGNlcHRpb24gPSBmYWxzZTtcblxuQmxhemUuX3JlcG9ydEV4Y2VwdGlvbiA9IGZ1bmN0aW9uIChlLCBtc2cpIHtcbiAgaWYgKEJsYXplLl90aHJvd05leHRFeGNlcHRpb24pIHtcbiAgICBCbGF6ZS5fdGhyb3dOZXh0RXhjZXB0aW9uID0gZmFsc2U7XG4gICAgdGhyb3cgZTtcbiAgfVxuXG4gIGlmICghIGRlYnVnRnVuYylcbiAgICAvLyBhZGFwdGVkIGZyb20gVHJhY2tlclxuICAgIGRlYnVnRnVuYyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiAodHlwZW9mIE1ldGVvciAhPT0gXCJ1bmRlZmluZWRcIiA/IE1ldGVvci5fZGVidWcgOlxuICAgICAgICAgICAgICAoKHR5cGVvZiBjb25zb2xlICE9PSBcInVuZGVmaW5lZFwiKSAmJiBjb25zb2xlLmxvZyA/IGNvbnNvbGUubG9nIDpcbiAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHt9KSk7XG4gICAgfTtcblxuICAvLyBJbiBDaHJvbWUsIGBlLnN0YWNrYCBpcyBhIG11bHRpbGluZSBzdHJpbmcgdGhhdCBzdGFydHMgd2l0aCB0aGUgbWVzc2FnZVxuICAvLyBhbmQgY29udGFpbnMgYSBzdGFjayB0cmFjZS4gIEZ1cnRoZXJtb3JlLCBgY29uc29sZS5sb2dgIG1ha2VzIGl0IGNsaWNrYWJsZS5cbiAgLy8gYGNvbnNvbGUubG9nYCBzdXBwbGllcyB0aGUgc3BhY2UgYmV0d2VlbiB0aGUgdHdvIGFyZ3VtZW50cy5cbiAgZGVidWdGdW5jKCkobXNnIHx8ICdFeGNlcHRpb24gY2F1Z2h0IGluIHRlbXBsYXRlOicsIGUuc3RhY2sgfHwgZS5tZXNzYWdlIHx8IGUpO1xufTtcblxuQmxhemUuX3dyYXBDYXRjaGluZ0V4Y2VwdGlvbnMgPSBmdW5jdGlvbiAoZiwgd2hlcmUpIHtcbiAgaWYgKHR5cGVvZiBmICE9PSAnZnVuY3Rpb24nKVxuICAgIHJldHVybiBmO1xuXG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBmLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgQmxhemUuX3JlcG9ydEV4Y2VwdGlvbihlLCAnRXhjZXB0aW9uIGluICcgKyB3aGVyZSArICc6Jyk7XG4gICAgfVxuICB9O1xufTtcbiIsIi8vLyBbbmV3XSBCbGF6ZS5WaWV3KFtuYW1lXSwgcmVuZGVyTWV0aG9kKVxuLy8vXG4vLy8gQmxhemUuVmlldyBpcyB0aGUgYnVpbGRpbmcgYmxvY2sgb2YgcmVhY3RpdmUgRE9NLiAgVmlld3MgaGF2ZVxuLy8vIHRoZSBmb2xsb3dpbmcgZmVhdHVyZXM6XG4vLy9cbi8vLyAqIGxpZmVjeWNsZSBjYWxsYmFja3MgLSBWaWV3cyBhcmUgY3JlYXRlZCwgcmVuZGVyZWQsIGFuZCBkZXN0cm95ZWQsXG4vLy8gICBhbmQgY2FsbGJhY2tzIGNhbiBiZSByZWdpc3RlcmVkIHRvIGZpcmUgd2hlbiB0aGVzZSB0aGluZ3MgaGFwcGVuLlxuLy8vXG4vLy8gKiBwYXJlbnQgcG9pbnRlciAtIEEgVmlldyBwb2ludHMgdG8gaXRzIHBhcmVudFZpZXcsIHdoaWNoIGlzIHRoZVxuLy8vICAgVmlldyB0aGF0IGNhdXNlZCBpdCB0byBiZSByZW5kZXJlZC4gIFRoZXNlIHBvaW50ZXJzIGZvcm0gYVxuLy8vICAgaGllcmFyY2h5IG9yIHRyZWUgb2YgVmlld3MuXG4vLy9cbi8vLyAqIHJlbmRlcigpIG1ldGhvZCAtIEEgVmlldydzIHJlbmRlcigpIG1ldGhvZCBzcGVjaWZpZXMgdGhlIERPTVxuLy8vICAgKG9yIEhUTUwpIGNvbnRlbnQgb2YgdGhlIFZpZXcuICBJZiB0aGUgbWV0aG9kIGVzdGFibGlzaGVzXG4vLy8gICByZWFjdGl2ZSBkZXBlbmRlbmNpZXMsIGl0IG1heSBiZSByZS1ydW4uXG4vLy9cbi8vLyAqIGEgRE9NUmFuZ2UgLSBJZiBhIFZpZXcgaXMgcmVuZGVyZWQgdG8gRE9NLCBpdHMgcG9zaXRpb24gYW5kXG4vLy8gICBleHRlbnQgaW4gdGhlIERPTSBhcmUgdHJhY2tlZCB1c2luZyBhIERPTVJhbmdlIG9iamVjdC5cbi8vL1xuLy8vIFdoZW4gYSBWaWV3IGlzIGNvbnN0cnVjdGVkIGJ5IGNhbGxpbmcgQmxhemUuVmlldywgdGhlIFZpZXcgaXNcbi8vLyBub3QgeWV0IGNvbnNpZGVyZWQgXCJjcmVhdGVkLlwiICBJdCBkb2Vzbid0IGhhdmUgYSBwYXJlbnRWaWV3IHlldCxcbi8vLyBhbmQgbm8gbG9naWMgaGFzIGJlZW4gcnVuIHRvIGluaXRpYWxpemUgdGhlIFZpZXcuICBBbGwgcmVhbFxuLy8vIHdvcmsgaXMgZGVmZXJyZWQgdW50aWwgYXQgbGVhc3QgY3JlYXRpb24gdGltZSwgd2hlbiB0aGUgb25WaWV3Q3JlYXRlZFxuLy8vIGNhbGxiYWNrcyBhcmUgZmlyZWQsIHdoaWNoIGhhcHBlbnMgd2hlbiB0aGUgVmlldyBpcyBcInVzZWRcIiBpblxuLy8vIHNvbWUgd2F5IHRoYXQgcmVxdWlyZXMgaXQgdG8gYmUgcmVuZGVyZWQuXG4vLy9cbi8vLyAuLi5tb3JlIGxpZmVjeWNsZSBzdHVmZlxuLy8vXG4vLy8gYG5hbWVgIGlzIGFuIG9wdGlvbmFsIHN0cmluZyB0YWcgaWRlbnRpZnlpbmcgdGhlIFZpZXcuICBUaGUgb25seVxuLy8vIHRpbWUgaXQncyB1c2VkIGlzIHdoZW4gbG9va2luZyBpbiB0aGUgVmlldyB0cmVlIGZvciBhIFZpZXcgb2YgYVxuLy8vIHBhcnRpY3VsYXIgbmFtZTsgZm9yIGV4YW1wbGUsIGRhdGEgY29udGV4dHMgYXJlIHN0b3JlZCBvbiBWaWV3c1xuLy8vIG9mIG5hbWUgXCJ3aXRoXCIuICBOYW1lcyBhcmUgYWxzbyB1c2VmdWwgd2hlbiBkZWJ1Z2dpbmcsIHNvIGluXG4vLy8gZ2VuZXJhbCBpdCdzIGdvb2QgZm9yIGZ1bmN0aW9ucyB0aGF0IGNyZWF0ZSBWaWV3cyB0byBzZXQgdGhlIG5hbWUuXG4vLy8gVmlld3MgYXNzb2NpYXRlZCB3aXRoIHRlbXBsYXRlcyBoYXZlIG5hbWVzIG9mIHRoZSBmb3JtIFwiVGVtcGxhdGUuZm9vXCIuXG5cbi8qKlxuICogQGNsYXNzXG4gKiBAc3VtbWFyeSBDb25zdHJ1Y3RvciBmb3IgYSBWaWV3LCB3aGljaCByZXByZXNlbnRzIGEgcmVhY3RpdmUgcmVnaW9uIG9mIERPTS5cbiAqIEBsb2N1cyBDbGllbnRcbiAqIEBwYXJhbSB7U3RyaW5nfSBbbmFtZV0gT3B0aW9uYWwuICBBIG5hbWUgZm9yIHRoaXMgdHlwZSBvZiBWaWV3LiAgU2VlIFtgdmlldy5uYW1lYF0oI3ZpZXdfbmFtZSkuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSByZW5kZXJGdW5jdGlvbiBBIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBbKnJlbmRlcmFibGUgY29udGVudCpdKCNSZW5kZXJhYmxlLUNvbnRlbnQpLiAgSW4gdGhpcyBmdW5jdGlvbiwgYHRoaXNgIGlzIGJvdW5kIHRvIHRoZSBWaWV3LlxuICovXG5CbGF6ZS5WaWV3ID0gZnVuY3Rpb24gKG5hbWUsIHJlbmRlcikge1xuICBpZiAoISAodGhpcyBpbnN0YW5jZW9mIEJsYXplLlZpZXcpKVxuICAgIC8vIGNhbGxlZCB3aXRob3V0IGBuZXdgXG4gICAgcmV0dXJuIG5ldyBCbGF6ZS5WaWV3KG5hbWUsIHJlbmRlcik7XG5cbiAgaWYgKHR5cGVvZiBuYW1lID09PSAnZnVuY3Rpb24nKSB7XG4gICAgLy8gb21pdHRlZCBcIm5hbWVcIiBhcmd1bWVudFxuICAgIHJlbmRlciA9IG5hbWU7XG4gICAgbmFtZSA9ICcnO1xuICB9XG4gIHRoaXMubmFtZSA9IG5hbWU7XG4gIHRoaXMuX3JlbmRlciA9IHJlbmRlcjtcblxuICB0aGlzLl9jYWxsYmFja3MgPSB7XG4gICAgY3JlYXRlZDogbnVsbCxcbiAgICByZW5kZXJlZDogbnVsbCxcbiAgICBkZXN0cm95ZWQ6IG51bGxcbiAgfTtcblxuICAvLyBTZXR0aW5nIGFsbCBwcm9wZXJ0aWVzIGhlcmUgaXMgZ29vZCBmb3IgcmVhZGFiaWxpdHksXG4gIC8vIGFuZCBhbHNvIG1heSBoZWxwIENocm9tZSBvcHRpbWl6ZSB0aGUgY29kZSBieSBrZWVwaW5nXG4gIC8vIHRoZSBWaWV3IG9iamVjdCBmcm9tIGNoYW5naW5nIHNoYXBlIHRvbyBtdWNoLlxuICB0aGlzLmlzQ3JlYXRlZCA9IGZhbHNlO1xuICB0aGlzLl9pc0NyZWF0ZWRGb3JFeHBhbnNpb24gPSBmYWxzZTtcbiAgdGhpcy5pc1JlbmRlcmVkID0gZmFsc2U7XG4gIHRoaXMuX2lzQXR0YWNoZWQgPSBmYWxzZTtcbiAgdGhpcy5pc0Rlc3Ryb3llZCA9IGZhbHNlO1xuICB0aGlzLl9pc0luUmVuZGVyID0gZmFsc2U7XG4gIHRoaXMucGFyZW50VmlldyA9IG51bGw7XG4gIHRoaXMuX2RvbXJhbmdlID0gbnVsbDtcbiAgLy8gVGhpcyBmbGFnIGlzIG5vcm1hbGx5IHNldCB0byBmYWxzZSBleGNlcHQgZm9yIHRoZSBjYXNlcyB3aGVuIHZpZXcncyBwYXJlbnRcbiAgLy8gd2FzIGdlbmVyYXRlZCBhcyBwYXJ0IG9mIGV4cGFuZGluZyBzb21lIHN5bnRhY3RpYyBzdWdhciBleHByZXNzaW9ucyBvclxuICAvLyBtZXRob2RzLlxuICAvLyBFeC46IEJsYXplLnJlbmRlcldpdGhEYXRhIGlzIGFuIGVxdWl2YWxlbnQgdG8gY3JlYXRpbmcgYSB2aWV3IHdpdGggcmVndWxhclxuICAvLyBCbGF6ZS5yZW5kZXIgYW5kIHdyYXBwaW5nIGl0IGludG8ge3sjd2l0aCBkYXRhfX17ey93aXRofX0gdmlldy4gU2luY2UgdGhlXG4gIC8vIHVzZXJzIGRvbid0IGtub3cgYW55dGhpbmcgYWJvdXQgdGhlc2UgZ2VuZXJhdGVkIHBhcmVudCB2aWV3cywgQmxhemUgbmVlZHNcbiAgLy8gdGhpcyBpbmZvcm1hdGlvbiB0byBiZSBhdmFpbGFibGUgb24gdmlld3MgdG8gbWFrZSBzbWFydGVyIGRlY2lzaW9ucy4gRm9yXG4gIC8vIGV4YW1wbGU6IHJlbW92aW5nIHRoZSBnZW5lcmF0ZWQgcGFyZW50IHZpZXcgd2l0aCB0aGUgdmlldyBvbiBCbGF6ZS5yZW1vdmUuXG4gIHRoaXMuX2hhc0dlbmVyYXRlZFBhcmVudCA9IGZhbHNlO1xuICAvLyBCaW5kaW5ncyBhY2Nlc3NpYmxlIHRvIGNoaWxkcmVuIHZpZXdzICh2aWEgdmlldy5sb29rdXAoJ25hbWUnKSkgd2l0aGluIHRoZVxuICAvLyBjbG9zZXN0IHRlbXBsYXRlIHZpZXcuXG4gIHRoaXMuX3Njb3BlQmluZGluZ3MgPSB7fTtcblxuICB0aGlzLnJlbmRlckNvdW50ID0gMDtcbn07XG5cbkJsYXplLlZpZXcucHJvdG90eXBlLl9yZW5kZXIgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBudWxsOyB9O1xuXG5CbGF6ZS5WaWV3LnByb3RvdHlwZS5vblZpZXdDcmVhdGVkID0gZnVuY3Rpb24gKGNiKSB7XG4gIHRoaXMuX2NhbGxiYWNrcy5jcmVhdGVkID0gdGhpcy5fY2FsbGJhY2tzLmNyZWF0ZWQgfHwgW107XG4gIHRoaXMuX2NhbGxiYWNrcy5jcmVhdGVkLnB1c2goY2IpO1xufTtcblxuQmxhemUuVmlldy5wcm90b3R5cGUuX29uVmlld1JlbmRlcmVkID0gZnVuY3Rpb24gKGNiKSB7XG4gIHRoaXMuX2NhbGxiYWNrcy5yZW5kZXJlZCA9IHRoaXMuX2NhbGxiYWNrcy5yZW5kZXJlZCB8fCBbXTtcbiAgdGhpcy5fY2FsbGJhY2tzLnJlbmRlcmVkLnB1c2goY2IpO1xufTtcblxuQmxhemUuVmlldy5wcm90b3R5cGUub25WaWV3UmVhZHkgPSBmdW5jdGlvbiAoY2IpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB2YXIgZmlyZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBUcmFja2VyLmFmdGVyRmx1c2goZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCEgc2VsZi5pc0Rlc3Ryb3llZCkge1xuICAgICAgICBCbGF6ZS5fd2l0aEN1cnJlbnRWaWV3KHNlbGYsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjYi5jYWxsKHNlbGYpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbiAgc2VsZi5fb25WaWV3UmVuZGVyZWQoZnVuY3Rpb24gb25WaWV3UmVuZGVyZWQoKSB7XG4gICAgaWYgKHNlbGYuaXNEZXN0cm95ZWQpXG4gICAgICByZXR1cm47XG4gICAgaWYgKCEgc2VsZi5fZG9tcmFuZ2UuYXR0YWNoZWQpXG4gICAgICBzZWxmLl9kb21yYW5nZS5vbkF0dGFjaGVkKGZpcmUpO1xuICAgIGVsc2VcbiAgICAgIGZpcmUoKTtcbiAgfSk7XG59O1xuXG5CbGF6ZS5WaWV3LnByb3RvdHlwZS5vblZpZXdEZXN0cm95ZWQgPSBmdW5jdGlvbiAoY2IpIHtcbiAgdGhpcy5fY2FsbGJhY2tzLmRlc3Ryb3llZCA9IHRoaXMuX2NhbGxiYWNrcy5kZXN0cm95ZWQgfHwgW107XG4gIHRoaXMuX2NhbGxiYWNrcy5kZXN0cm95ZWQucHVzaChjYik7XG59O1xuQmxhemUuVmlldy5wcm90b3R5cGUucmVtb3ZlVmlld0Rlc3Ryb3llZExpc3RlbmVyID0gZnVuY3Rpb24gKGNiKSB7XG4gIHZhciBkZXN0cm95ZWQgPSB0aGlzLl9jYWxsYmFja3MuZGVzdHJveWVkO1xuICBpZiAoISBkZXN0cm95ZWQpXG4gICAgcmV0dXJuO1xuICB2YXIgaW5kZXggPSBfLmxhc3RJbmRleE9mKGRlc3Ryb3llZCwgY2IpO1xuICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgLy8gWFhYIFlvdSdkIHRoaW5rIHRoZSByaWdodCB0aGluZyB0byBkbyB3b3VsZCBiZSBzcGxpY2UsIGJ1dCBfZmlyZUNhbGxiYWNrc1xuICAgIC8vIGdldHMgc2FkIGlmIHlvdSByZW1vdmUgY2FsbGJhY2tzIHdoaWxlIGl0ZXJhdGluZyBvdmVyIHRoZSBsaXN0LiAgU2hvdWxkXG4gICAgLy8gY2hhbmdlIHRoaXMgdG8gdXNlIGNhbGxiYWNrLWhvb2sgb3IgRXZlbnRFbWl0dGVyIG9yIHNvbWV0aGluZyBlbHNlIHRoYXRcbiAgICAvLyBwcm9wZXJseSBzdXBwb3J0cyByZW1vdmFsLlxuICAgIGRlc3Ryb3llZFtpbmRleF0gPSBudWxsO1xuICB9XG59O1xuXG4vLy8gVmlldyNhdXRvcnVuKGZ1bmMpXG4vLy9cbi8vLyBTZXRzIHVwIGEgVHJhY2tlciBhdXRvcnVuIHRoYXQgaXMgXCJzY29wZWRcIiB0byB0aGlzIFZpZXcgaW4gdHdvXG4vLy8gaW1wb3J0YW50IHdheXM6IDEpIEJsYXplLmN1cnJlbnRWaWV3IGlzIGF1dG9tYXRpY2FsbHkgc2V0XG4vLy8gb24gZXZlcnkgcmUtcnVuLCBhbmQgMikgdGhlIGF1dG9ydW4gaXMgc3RvcHBlZCB3aGVuIHRoZVxuLy8vIFZpZXcgaXMgZGVzdHJveWVkLiAgQXMgd2l0aCBUcmFja2VyLmF1dG9ydW4sIHRoZSBmaXJzdCBydW4gb2Zcbi8vLyB0aGUgZnVuY3Rpb24gaXMgaW1tZWRpYXRlLCBhbmQgYSBDb21wdXRhdGlvbiBvYmplY3QgdGhhdCBjYW5cbi8vLyBiZSB1c2VkIHRvIHN0b3AgdGhlIGF1dG9ydW4gaXMgcmV0dXJuZWQuXG4vLy9cbi8vLyBWaWV3I2F1dG9ydW4gaXMgbWVhbnQgdG8gYmUgY2FsbGVkIGZyb20gVmlldyBjYWxsYmFja3MgbGlrZVxuLy8vIG9uVmlld0NyZWF0ZWQsIG9yIGZyb20gb3V0c2lkZSB0aGUgcmVuZGVyaW5nIHByb2Nlc3MuICBJdCBtYXkgbm90XG4vLy8gYmUgY2FsbGVkIGJlZm9yZSB0aGUgb25WaWV3Q3JlYXRlZCBjYWxsYmFja3MgYXJlIGZpcmVkICh0b28gZWFybHkpLFxuLy8vIG9yIGZyb20gYSByZW5kZXIoKSBtZXRob2QgKHRvbyBjb25mdXNpbmcpLlxuLy8vXG4vLy8gVHlwaWNhbGx5LCBhdXRvcnVucyB0aGF0IHVwZGF0ZSB0aGUgc3RhdGVcbi8vLyBvZiB0aGUgVmlldyAoYXMgaW4gQmxhemUuV2l0aCkgc2hvdWxkIGJlIHN0YXJ0ZWQgZnJvbSBhbiBvblZpZXdDcmVhdGVkXG4vLy8gY2FsbGJhY2suICBBdXRvcnVucyB0aGF0IHVwZGF0ZSB0aGUgRE9NIHNob3VsZCBiZSBzdGFydGVkXG4vLy8gZnJvbSBlaXRoZXIgb25WaWV3Q3JlYXRlZCAoZ3VhcmRlZCBhZ2FpbnN0IHRoZSBhYnNlbmNlIG9mXG4vLy8gdmlldy5fZG9tcmFuZ2UpLCBvciBvblZpZXdSZWFkeS5cbkJsYXplLlZpZXcucHJvdG90eXBlLmF1dG9ydW4gPSBmdW5jdGlvbiAoZiwgX2luVmlld1Njb3BlLCBkaXNwbGF5TmFtZSkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgLy8gVGhlIHJlc3RyaWN0aW9ucyBvbiB3aGVuIFZpZXcjYXV0b3J1biBjYW4gYmUgY2FsbGVkIGFyZSBpbiBvcmRlclxuICAvLyB0byBhdm9pZCBiYWQgcGF0dGVybnMsIGxpa2UgY3JlYXRpbmcgYSBCbGF6ZS5WaWV3IGFuZCBpbW1lZGlhdGVseVxuICAvLyBjYWxsaW5nIGF1dG9ydW4gb24gaXQuICBBIGZyZXNobHkgY3JlYXRlZCBWaWV3IGlzIG5vdCByZWFkeSB0b1xuICAvLyBoYXZlIGxvZ2ljIHJ1biBvbiBpdDsgaXQgZG9lc24ndCBoYXZlIGEgcGFyZW50VmlldywgZm9yIGV4YW1wbGUuXG4gIC8vIEl0J3Mgd2hlbiB0aGUgVmlldyBpcyBtYXRlcmlhbGl6ZWQgb3IgZXhwYW5kZWQgdGhhdCB0aGUgb25WaWV3Q3JlYXRlZFxuICAvLyBoYW5kbGVycyBhcmUgZmlyZWQgYW5kIHRoZSBWaWV3IHN0YXJ0cyB1cC5cbiAgLy9cbiAgLy8gTGV0dGluZyB0aGUgcmVuZGVyKCkgbWV0aG9kIGNhbGwgYHRoaXMuYXV0b3J1bigpYCBpcyBwcm9ibGVtYXRpY1xuICAvLyBiZWNhdXNlIG9mIHJlLXJlbmRlci4gIFRoZSBiZXN0IHdlIGNhbiBkbyBpcyB0byBzdG9wIHRoZSBvbGRcbiAgLy8gYXV0b3J1biBhbmQgc3RhcnQgYSBuZXcgb25lIGZvciBlYWNoIHJlbmRlciwgYnV0IHRoYXQncyBhIHBhdHRlcm5cbiAgLy8gd2UgdHJ5IHRvIGF2b2lkIGludGVybmFsbHkgYmVjYXVzZSBpdCBsZWFkcyB0byBoZWxwZXJzIGJlaW5nXG4gIC8vIGNhbGxlZCBleHRyYSB0aW1lcywgaW4gdGhlIGNhc2Ugd2hlcmUgdGhlIGF1dG9ydW4gY2F1c2VzIHRoZVxuICAvLyB2aWV3IHRvIHJlLXJlbmRlciAoYW5kIHRodXMgdGhlIGF1dG9ydW4gdG8gYmUgdG9ybiBkb3duIGFuZCBhXG4gIC8vIG5ldyBvbmUgZXN0YWJsaXNoZWQpLlxuICAvL1xuICAvLyBXZSBjb3VsZCBsaWZ0IHRoZXNlIHJlc3RyaWN0aW9ucyBpbiB2YXJpb3VzIHdheXMuICBPbmUgaW50ZXJlc3RpbmdcbiAgLy8gaWRlYSBpcyB0byBhbGxvdyB5b3UgdG8gY2FsbCBgdmlldy5hdXRvcnVuYCBhZnRlciBpbnN0YW50aWF0aW5nXG4gIC8vIGB2aWV3YCwgYW5kIGF1dG9tYXRpY2FsbHkgd3JhcCBpdCBpbiBgdmlldy5vblZpZXdDcmVhdGVkYCwgZGVmZXJyaW5nXG4gIC8vIHRoZSBhdXRvcnVuIHNvIHRoYXQgaXQgc3RhcnRzIGF0IGFuIGFwcHJvcHJpYXRlIHRpbWUuICBIb3dldmVyLFxuICAvLyB0aGVuIHdlIGNhbid0IHJldHVybiB0aGUgQ29tcHV0YXRpb24gb2JqZWN0IHRvIHRoZSBjYWxsZXIsIGJlY2F1c2VcbiAgLy8gaXQgZG9lc24ndCBleGlzdCB5ZXQuXG4gIGlmICghIHNlbGYuaXNDcmVhdGVkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiVmlldyNhdXRvcnVuIG11c3QgYmUgY2FsbGVkIGZyb20gdGhlIGNyZWF0ZWQgY2FsbGJhY2sgYXQgdGhlIGVhcmxpZXN0XCIpO1xuICB9XG4gIGlmICh0aGlzLl9pc0luUmVuZGVyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ2FuJ3QgY2FsbCBWaWV3I2F1dG9ydW4gZnJvbSBpbnNpZGUgcmVuZGVyKCk7IHRyeSBjYWxsaW5nIGl0IGZyb20gdGhlIGNyZWF0ZWQgb3IgcmVuZGVyZWQgY2FsbGJhY2tcIik7XG4gIH1cblxuICB2YXIgdGVtcGxhdGVJbnN0YW5jZUZ1bmMgPSBCbGF6ZS5UZW1wbGF0ZS5fY3VycmVudFRlbXBsYXRlSW5zdGFuY2VGdW5jO1xuXG4gIHZhciBmdW5jID0gZnVuY3Rpb24gdmlld0F1dG9ydW4oYykge1xuICAgIHJldHVybiBCbGF6ZS5fd2l0aEN1cnJlbnRWaWV3KF9pblZpZXdTY29wZSB8fCBzZWxmLCBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gQmxhemUuVGVtcGxhdGUuX3dpdGhUZW1wbGF0ZUluc3RhbmNlRnVuYyhcbiAgICAgICAgdGVtcGxhdGVJbnN0YW5jZUZ1bmMsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gZi5jYWxsKHNlbGYsIGMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBHaXZlIHRoZSBhdXRvcnVuIGZ1bmN0aW9uIGEgYmV0dGVyIG5hbWUgZm9yIGRlYnVnZ2luZyBhbmQgcHJvZmlsaW5nLlxuICAvLyBUaGUgYGRpc3BsYXlOYW1lYCBwcm9wZXJ0eSBpcyBub3QgcGFydCBvZiB0aGUgc3BlYyBidXQgYnJvd3NlcnMgbGlrZSBDaHJvbWVcbiAgLy8gYW5kIEZpcmVmb3ggcHJlZmVyIGl0IGluIGRlYnVnZ2VycyBvdmVyIHRoZSBuYW1lIGZ1bmN0aW9uIHdhcyBkZWNsYXJlZCBieS5cbiAgZnVuYy5kaXNwbGF5TmFtZSA9XG4gICAgKHNlbGYubmFtZSB8fCAnYW5vbnltb3VzJykgKyAnOicgKyAoZGlzcGxheU5hbWUgfHwgJ2Fub255bW91cycpO1xuICB2YXIgY29tcCA9IFRyYWNrZXIuYXV0b3J1bihmdW5jKTtcblxuICB2YXIgc3RvcENvbXB1dGF0aW9uID0gZnVuY3Rpb24gKCkgeyBjb21wLnN0b3AoKTsgfTtcbiAgc2VsZi5vblZpZXdEZXN0cm95ZWQoc3RvcENvbXB1dGF0aW9uKTtcbiAgY29tcC5vblN0b3AoZnVuY3Rpb24gKCkge1xuICAgIHNlbGYucmVtb3ZlVmlld0Rlc3Ryb3llZExpc3RlbmVyKHN0b3BDb21wdXRhdGlvbik7XG4gIH0pO1xuXG4gIHJldHVybiBjb21wO1xufTtcblxuQmxhemUuVmlldy5wcm90b3R5cGUuX2Vycm9ySWZTaG91bGRudENhbGxTdWJzY3JpYmUgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICBpZiAoISBzZWxmLmlzQ3JlYXRlZCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIlZpZXcjc3Vic2NyaWJlIG11c3QgYmUgY2FsbGVkIGZyb20gdGhlIGNyZWF0ZWQgY2FsbGJhY2sgYXQgdGhlIGVhcmxpZXN0XCIpO1xuICB9XG4gIGlmIChzZWxmLl9pc0luUmVuZGVyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ2FuJ3QgY2FsbCBWaWV3I3N1YnNjcmliZSBmcm9tIGluc2lkZSByZW5kZXIoKTsgdHJ5IGNhbGxpbmcgaXQgZnJvbSB0aGUgY3JlYXRlZCBvciByZW5kZXJlZCBjYWxsYmFja1wiKTtcbiAgfVxuICBpZiAoc2VsZi5pc0Rlc3Ryb3llZCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkNhbid0IGNhbGwgVmlldyNzdWJzY3JpYmUgZnJvbSBpbnNpZGUgdGhlIGRlc3Ryb3llZCBjYWxsYmFjaywgdHJ5IGNhbGxpbmcgaXQgaW5zaWRlIGNyZWF0ZWQgb3IgcmVuZGVyZWQuXCIpO1xuICB9XG59O1xuXG4vKipcbiAqIEp1c3QgbGlrZSBCbGF6ZS5WaWV3I2F1dG9ydW4sIGJ1dCB3aXRoIE1ldGVvci5zdWJzY3JpYmUgaW5zdGVhZCBvZlxuICogVHJhY2tlci5hdXRvcnVuLiBTdG9wIHRoZSBzdWJzY3JpcHRpb24gd2hlbiB0aGUgdmlldyBpcyBkZXN0cm95ZWQuXG4gKiBAcmV0dXJuIHtTdWJzY3JpcHRpb25IYW5kbGV9IEEgaGFuZGxlIHRvIHRoZSBzdWJzY3JpcHRpb24gc28gdGhhdCB5b3UgY2FuXG4gKiBzZWUgaWYgaXQgaXMgcmVhZHksIG9yIHN0b3AgaXQgbWFudWFsbHlcbiAqL1xuQmxhemUuVmlldy5wcm90b3R5cGUuc3Vic2NyaWJlID0gZnVuY3Rpb24gKGFyZ3MsIG9wdGlvbnMpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICBzZWxmLl9lcnJvcklmU2hvdWxkbnRDYWxsU3Vic2NyaWJlKCk7XG5cbiAgdmFyIHN1YkhhbmRsZTtcbiAgaWYgKG9wdGlvbnMuY29ubmVjdGlvbikge1xuICAgIHN1YkhhbmRsZSA9IG9wdGlvbnMuY29ubmVjdGlvbi5zdWJzY3JpYmUuYXBwbHkob3B0aW9ucy5jb25uZWN0aW9uLCBhcmdzKTtcbiAgfSBlbHNlIHtcbiAgICBzdWJIYW5kbGUgPSBNZXRlb3Iuc3Vic2NyaWJlLmFwcGx5KE1ldGVvciwgYXJncyk7XG4gIH1cblxuICBzZWxmLm9uVmlld0Rlc3Ryb3llZChmdW5jdGlvbiAoKSB7XG4gICAgc3ViSGFuZGxlLnN0b3AoKTtcbiAgfSk7XG5cbiAgcmV0dXJuIHN1YkhhbmRsZTtcbn07XG5cbkJsYXplLlZpZXcucHJvdG90eXBlLmZpcnN0Tm9kZSA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKCEgdGhpcy5faXNBdHRhY2hlZClcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJWaWV3IG11c3QgYmUgYXR0YWNoZWQgYmVmb3JlIGFjY2Vzc2luZyBpdHMgRE9NXCIpO1xuXG4gIHJldHVybiB0aGlzLl9kb21yYW5nZS5maXJzdE5vZGUoKTtcbn07XG5cbkJsYXplLlZpZXcucHJvdG90eXBlLmxhc3ROb2RlID0gZnVuY3Rpb24gKCkge1xuICBpZiAoISB0aGlzLl9pc0F0dGFjaGVkKVxuICAgIHRocm93IG5ldyBFcnJvcihcIlZpZXcgbXVzdCBiZSBhdHRhY2hlZCBiZWZvcmUgYWNjZXNzaW5nIGl0cyBET01cIik7XG5cbiAgcmV0dXJuIHRoaXMuX2RvbXJhbmdlLmxhc3ROb2RlKCk7XG59O1xuXG5CbGF6ZS5fZmlyZUNhbGxiYWNrcyA9IGZ1bmN0aW9uICh2aWV3LCB3aGljaCkge1xuICBCbGF6ZS5fd2l0aEN1cnJlbnRWaWV3KHZpZXcsIGZ1bmN0aW9uICgpIHtcbiAgICBUcmFja2VyLm5vbnJlYWN0aXZlKGZ1bmN0aW9uIGZpcmVDYWxsYmFja3MoKSB7XG4gICAgICB2YXIgY2JzID0gdmlldy5fY2FsbGJhY2tzW3doaWNoXTtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBOID0gKGNicyAmJiBjYnMubGVuZ3RoKTsgaSA8IE47IGkrKylcbiAgICAgICAgY2JzW2ldICYmIGNic1tpXS5jYWxsKHZpZXcpO1xuICAgIH0pO1xuICB9KTtcbn07XG5cbkJsYXplLl9jcmVhdGVWaWV3ID0gZnVuY3Rpb24gKHZpZXcsIHBhcmVudFZpZXcsIGZvckV4cGFuc2lvbikge1xuICBpZiAodmlldy5pc0NyZWF0ZWQpXG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ2FuJ3QgcmVuZGVyIHRoZSBzYW1lIFZpZXcgdHdpY2VcIik7XG5cbiAgdmlldy5wYXJlbnRWaWV3ID0gKHBhcmVudFZpZXcgfHwgbnVsbCk7XG4gIHZpZXcuaXNDcmVhdGVkID0gdHJ1ZTtcbiAgaWYgKGZvckV4cGFuc2lvbilcbiAgICB2aWV3Ll9pc0NyZWF0ZWRGb3JFeHBhbnNpb24gPSB0cnVlO1xuXG4gIEJsYXplLl9maXJlQ2FsbGJhY2tzKHZpZXcsICdjcmVhdGVkJyk7XG59O1xuXG52YXIgZG9GaXJzdFJlbmRlciA9IGZ1bmN0aW9uICh2aWV3LCBpbml0aWFsQ29udGVudCkge1xuICB2YXIgZG9tcmFuZ2UgPSBuZXcgQmxhemUuX0RPTVJhbmdlKGluaXRpYWxDb250ZW50KTtcbiAgdmlldy5fZG9tcmFuZ2UgPSBkb21yYW5nZTtcbiAgZG9tcmFuZ2UudmlldyA9IHZpZXc7XG4gIHZpZXcuaXNSZW5kZXJlZCA9IHRydWU7XG4gIEJsYXplLl9maXJlQ2FsbGJhY2tzKHZpZXcsICdyZW5kZXJlZCcpO1xuXG4gIHZhciB0ZWFyZG93bkhvb2sgPSBudWxsO1xuXG4gIGRvbXJhbmdlLm9uQXR0YWNoZWQoZnVuY3Rpb24gYXR0YWNoZWQocmFuZ2UsIGVsZW1lbnQpIHtcbiAgICB2aWV3Ll9pc0F0dGFjaGVkID0gdHJ1ZTtcblxuICAgIHRlYXJkb3duSG9vayA9IEJsYXplLl9ET01CYWNrZW5kLlRlYXJkb3duLm9uRWxlbWVudFRlYXJkb3duKFxuICAgICAgZWxlbWVudCwgZnVuY3Rpb24gdGVhcmRvd24oKSB7XG4gICAgICAgIEJsYXplLl9kZXN0cm95Vmlldyh2aWV3LCB0cnVlIC8qIF9za2lwTm9kZXMgKi8pO1xuICAgICAgfSk7XG4gIH0pO1xuXG4gIC8vIHRlYXIgZG93biB0aGUgdGVhcmRvd24gaG9va1xuICB2aWV3Lm9uVmlld0Rlc3Ryb3llZChmdW5jdGlvbiAoKSB7XG4gICAgdGVhcmRvd25Ib29rICYmIHRlYXJkb3duSG9vay5zdG9wKCk7XG4gICAgdGVhcmRvd25Ib29rID0gbnVsbDtcbiAgfSk7XG5cbiAgcmV0dXJuIGRvbXJhbmdlO1xufTtcblxuLy8gVGFrZSBhbiB1bmNyZWF0ZWQgVmlldyBgdmlld2AgYW5kIGNyZWF0ZSBhbmQgcmVuZGVyIGl0IHRvIERPTSxcbi8vIHNldHRpbmcgdXAgdGhlIGF1dG9ydW4gdGhhdCB1cGRhdGVzIHRoZSBWaWV3LiAgUmV0dXJucyBhIG5ld1xuLy8gRE9NUmFuZ2UsIHdoaWNoIGhhcyBiZWVuIGFzc29jaWF0ZWQgd2l0aCB0aGUgVmlldy5cbi8vXG4vLyBUaGUgcHJpdmF0ZSBhcmd1bWVudHMgYF93b3JrU3RhY2tgIGFuZCBgX2ludG9BcnJheWAgYXJlIHBhc3NlZCBpblxuLy8gYnkgQmxhemUuX21hdGVyaWFsaXplRE9NIGFuZCBhcmUgb25seSBwcmVzZW50IGZvciByZWN1cnNpdmUgY2FsbHNcbi8vICh3aGVuIHRoZXJlIGlzIHNvbWUgb3RoZXIgX21hdGVyaWFsaXplVmlldyBvbiB0aGUgc3RhY2spLiAgSWZcbi8vIHByb3ZpZGVkLCB0aGVuIHdlIGF2b2lkIHRoZSBtdXR1YWwgcmVjdXJzaW9uIG9mIGNhbGxpbmcgYmFjayBpbnRvXG4vLyBCbGF6ZS5fbWF0ZXJpYWxpemVET00gc28gdGhhdCBkZWVwIFZpZXcgaGllcmFyY2hpZXMgZG9uJ3QgYmxvdyB0aGVcbi8vIHN0YWNrLiAgSW5zdGVhZCwgd2UgcHVzaCB0YXNrcyBvbnRvIHdvcmtTdGFjayBmb3IgdGhlIGluaXRpYWxcbi8vIHJlbmRlcmluZyBhbmQgc3Vic2VxdWVudCBzZXR1cCBvZiB0aGUgVmlldywgYW5kIHRoZXkgYXJlIGRvbmUgYWZ0ZXJcbi8vIHdlIHJldHVybi4gIFdoZW4gdGhlcmUgaXMgYSBfd29ya1N0YWNrLCB3ZSBkbyBub3QgcmV0dXJuIHRoZSBuZXdcbi8vIERPTVJhbmdlLCBidXQgaW5zdGVhZCBwdXNoIGl0IGludG8gX2ludG9BcnJheSBmcm9tIGEgX3dvcmtTdGFja1xuLy8gdGFzay5cbkJsYXplLl9tYXRlcmlhbGl6ZVZpZXcgPSBmdW5jdGlvbiAodmlldywgcGFyZW50VmlldywgX3dvcmtTdGFjaywgX2ludG9BcnJheSkge1xuICBCbGF6ZS5fY3JlYXRlVmlldyh2aWV3LCBwYXJlbnRWaWV3KTtcblxuICB2YXIgZG9tcmFuZ2U7XG4gIHZhciBsYXN0SHRtbGpzO1xuICAvLyBXZSBkb24ndCBleHBlY3QgdG8gYmUgY2FsbGVkIGluIGEgQ29tcHV0YXRpb24sIGJ1dCBqdXN0IGluIGNhc2UsXG4gIC8vIHdyYXAgaW4gVHJhY2tlci5ub25yZWFjdGl2ZS5cbiAgVHJhY2tlci5ub25yZWFjdGl2ZShmdW5jdGlvbiAoKSB7XG4gICAgdmlldy5hdXRvcnVuKGZ1bmN0aW9uIGRvUmVuZGVyKGMpIHtcbiAgICAgIC8vIGB2aWV3LmF1dG9ydW5gIHNldHMgdGhlIGN1cnJlbnQgdmlldy5cbiAgICAgIHZpZXcucmVuZGVyQ291bnQrKztcbiAgICAgIHZpZXcuX2lzSW5SZW5kZXIgPSB0cnVlO1xuICAgICAgLy8gQW55IGRlcGVuZGVuY2llcyB0aGF0IHNob3VsZCBpbnZhbGlkYXRlIHRoaXMgQ29tcHV0YXRpb24gY29tZVxuICAgICAgLy8gZnJvbSB0aGlzIGxpbmU6XG4gICAgICB2YXIgaHRtbGpzID0gdmlldy5fcmVuZGVyKCk7XG4gICAgICB2aWV3Ll9pc0luUmVuZGVyID0gZmFsc2U7XG5cbiAgICAgIGlmICghIGMuZmlyc3RSdW4gJiYgISBCbGF6ZS5faXNDb250ZW50RXF1YWwobGFzdEh0bWxqcywgaHRtbGpzKSkge1xuICAgICAgICBUcmFja2VyLm5vbnJlYWN0aXZlKGZ1bmN0aW9uIGRvTWF0ZXJpYWxpemUoKSB7XG4gICAgICAgICAgLy8gcmUtcmVuZGVyXG4gICAgICAgICAgdmFyIHJhbmdlc0FuZE5vZGVzID0gQmxhemUuX21hdGVyaWFsaXplRE9NKGh0bWxqcywgW10sIHZpZXcpO1xuICAgICAgICAgIGRvbXJhbmdlLnNldE1lbWJlcnMocmFuZ2VzQW5kTm9kZXMpO1xuICAgICAgICAgIEJsYXplLl9maXJlQ2FsbGJhY2tzKHZpZXcsICdyZW5kZXJlZCcpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGxhc3RIdG1sanMgPSBodG1sanM7XG5cbiAgICAgIC8vIENhdXNlcyBhbnkgbmVzdGVkIHZpZXdzIHRvIHN0b3AgaW1tZWRpYXRlbHksIG5vdCB3aGVuIHdlIGNhbGxcbiAgICAgIC8vIGBzZXRNZW1iZXJzYCB0aGUgbmV4dCB0aW1lIGFyb3VuZCB0aGUgYXV0b3J1bi4gIE90aGVyd2lzZSxcbiAgICAgIC8vIGhlbHBlcnMgaW4gdGhlIERPTSB0cmVlIHRvIGJlIHJlcGxhY2VkIG1pZ2h0IGJlIHNjaGVkdWxlZFxuICAgICAgLy8gdG8gcmUtcnVuIGJlZm9yZSB3ZSBoYXZlIGEgY2hhbmNlIHRvIHN0b3AgdGhlbS5cbiAgICAgIFRyYWNrZXIub25JbnZhbGlkYXRlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKGRvbXJhbmdlKSB7XG4gICAgICAgICAgZG9tcmFuZ2UuZGVzdHJveU1lbWJlcnMoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSwgdW5kZWZpbmVkLCAnbWF0ZXJpYWxpemUnKTtcblxuICAgIC8vIGZpcnN0IHJlbmRlci4gIGxhc3RIdG1sanMgaXMgdGhlIGZpcnN0IGh0bWxqcy5cbiAgICB2YXIgaW5pdGlhbENvbnRlbnRzO1xuICAgIGlmICghIF93b3JrU3RhY2spIHtcbiAgICAgIGluaXRpYWxDb250ZW50cyA9IEJsYXplLl9tYXRlcmlhbGl6ZURPTShsYXN0SHRtbGpzLCBbXSwgdmlldyk7XG4gICAgICBkb21yYW5nZSA9IGRvRmlyc3RSZW5kZXIodmlldywgaW5pdGlhbENvbnRlbnRzKTtcbiAgICAgIGluaXRpYWxDb250ZW50cyA9IG51bGw7IC8vIGhlbHAgR0MgYmVjYXVzZSB3ZSBjbG9zZSBvdmVyIHRoaXMgc2NvcGUgYSBsb3RcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gV2UncmUgYmVpbmcgY2FsbGVkIGZyb20gQmxhemUuX21hdGVyaWFsaXplRE9NLCBzbyB0byBhdm9pZFxuICAgICAgLy8gcmVjdXJzaW9uIGFuZCBzYXZlIHN0YWNrIHNwYWNlLCBwcm92aWRlIGEgZGVzY3JpcHRpb24gb2YgdGhlXG4gICAgICAvLyB3b3JrIHRvIGJlIGRvbmUgaW5zdGVhZCBvZiBkb2luZyBpdC4gIFRhc2tzIHB1c2hlZCBvbnRvXG4gICAgICAvLyBfd29ya1N0YWNrIHdpbGwgYmUgZG9uZSBpbiBMSUZPIG9yZGVyIGFmdGVyIHdlIHJldHVybi5cbiAgICAgIC8vIFRoZSB3b3JrIHdpbGwgc3RpbGwgYmUgZG9uZSB3aXRoaW4gYSBUcmFja2VyLm5vbnJlYWN0aXZlLFxuICAgICAgLy8gYmVjYXVzZSBpdCB3aWxsIGJlIGRvbmUgYnkgc29tZSBjYWxsIHRvIEJsYXplLl9tYXRlcmlhbGl6ZURPTVxuICAgICAgLy8gKHdoaWNoIGlzIGFsd2F5cyBjYWxsZWQgaW4gYSBUcmFja2VyLm5vbnJlYWN0aXZlKS5cbiAgICAgIGluaXRpYWxDb250ZW50cyA9IFtdO1xuICAgICAgLy8gcHVzaCB0aGlzIGZ1bmN0aW9uIGZpcnN0IHNvIHRoYXQgaXQgaGFwcGVucyBsYXN0XG4gICAgICBfd29ya1N0YWNrLnB1c2goZnVuY3Rpb24gKCkge1xuICAgICAgICBkb21yYW5nZSA9IGRvRmlyc3RSZW5kZXIodmlldywgaW5pdGlhbENvbnRlbnRzKTtcbiAgICAgICAgaW5pdGlhbENvbnRlbnRzID0gbnVsbDsgLy8gaGVscCBHQyBiZWNhdXNlIG9mIGFsbCB0aGUgY2xvc3VyZXMgaGVyZVxuICAgICAgICBfaW50b0FycmF5LnB1c2goZG9tcmFuZ2UpO1xuICAgICAgfSk7XG4gICAgICAvLyBub3cgcHVzaCB0aGUgdGFzayB0aGF0IGNhbGN1bGF0ZXMgaW5pdGlhbENvbnRlbnRzXG4gICAgICBfd29ya1N0YWNrLnB1c2goQmxhemUuX2JpbmQoQmxhemUuX21hdGVyaWFsaXplRE9NLCBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0SHRtbGpzLCBpbml0aWFsQ29udGVudHMsIHZpZXcsIF93b3JrU3RhY2spKTtcbiAgICB9XG4gIH0pO1xuXG4gIGlmICghIF93b3JrU3RhY2spIHtcbiAgICByZXR1cm4gZG9tcmFuZ2U7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn07XG5cbi8vIEV4cGFuZHMgYSBWaWV3IHRvIEhUTUxqcywgY2FsbGluZyBgcmVuZGVyYCByZWN1cnNpdmVseSBvbiBhbGxcbi8vIFZpZXdzIGFuZCBldmFsdWF0aW5nIGFueSBkeW5hbWljIGF0dHJpYnV0ZXMuICBDYWxscyB0aGUgYGNyZWF0ZWRgXG4vLyBjYWxsYmFjaywgYnV0IG5vdCB0aGUgYG1hdGVyaWFsaXplZGAgb3IgYHJlbmRlcmVkYCBjYWxsYmFja3MuXG4vLyBEZXN0cm95cyB0aGUgdmlldyBpbW1lZGlhdGVseSwgdW5sZXNzIGNhbGxlZCBpbiBhIFRyYWNrZXIgQ29tcHV0YXRpb24sXG4vLyBpbiB3aGljaCBjYXNlIHRoZSB2aWV3IHdpbGwgYmUgZGVzdHJveWVkIHdoZW4gdGhlIENvbXB1dGF0aW9uIGlzXG4vLyBpbnZhbGlkYXRlZC4gIElmIGNhbGxlZCBpbiBhIFRyYWNrZXIgQ29tcHV0YXRpb24sIHRoZSByZXN1bHQgaXMgYVxuLy8gcmVhY3RpdmUgc3RyaW5nOyB0aGF0IGlzLCB0aGUgQ29tcHV0YXRpb24gd2lsbCBiZSBpbnZhbGlkYXRlZFxuLy8gaWYgYW55IGNoYW5nZXMgYXJlIG1hZGUgdG8gdGhlIHZpZXcgb3Igc3Vidmlld3MgdGhhdCBtaWdodCBhZmZlY3Rcbi8vIHRoZSBIVE1MLlxuQmxhemUuX2V4cGFuZFZpZXcgPSBmdW5jdGlvbiAodmlldywgcGFyZW50Vmlldykge1xuICBCbGF6ZS5fY3JlYXRlVmlldyh2aWV3LCBwYXJlbnRWaWV3LCB0cnVlIC8qZm9yRXhwYW5zaW9uKi8pO1xuXG4gIHZpZXcuX2lzSW5SZW5kZXIgPSB0cnVlO1xuICB2YXIgaHRtbGpzID0gQmxhemUuX3dpdGhDdXJyZW50Vmlldyh2aWV3LCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHZpZXcuX3JlbmRlcigpO1xuICB9KTtcbiAgdmlldy5faXNJblJlbmRlciA9IGZhbHNlO1xuXG4gIHZhciByZXN1bHQgPSBCbGF6ZS5fZXhwYW5kKGh0bWxqcywgdmlldyk7XG5cbiAgaWYgKFRyYWNrZXIuYWN0aXZlKSB7XG4gICAgVHJhY2tlci5vbkludmFsaWRhdGUoZnVuY3Rpb24gKCkge1xuICAgICAgQmxhemUuX2Rlc3Ryb3lWaWV3KHZpZXcpO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIEJsYXplLl9kZXN0cm95Vmlldyh2aWV3KTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG4vLyBPcHRpb25zOiBgcGFyZW50Vmlld2BcbkJsYXplLl9IVE1MSlNFeHBhbmRlciA9IEhUTUwuVHJhbnNmb3JtaW5nVmlzaXRvci5leHRlbmQoKTtcbkJsYXplLl9IVE1MSlNFeHBhbmRlci5kZWYoe1xuICB2aXNpdE9iamVjdDogZnVuY3Rpb24gKHgpIHtcbiAgICBpZiAoeCBpbnN0YW5jZW9mIEJsYXplLlRlbXBsYXRlKVxuICAgICAgeCA9IHguY29uc3RydWN0VmlldygpO1xuICAgIGlmICh4IGluc3RhbmNlb2YgQmxhemUuVmlldylcbiAgICAgIHJldHVybiBCbGF6ZS5fZXhwYW5kVmlldyh4LCB0aGlzLnBhcmVudFZpZXcpO1xuXG4gICAgLy8gdGhpcyB3aWxsIHRocm93IGFuIGVycm9yOyBvdGhlciBvYmplY3RzIGFyZSBub3QgYWxsb3dlZCFcbiAgICByZXR1cm4gSFRNTC5UcmFuc2Zvcm1pbmdWaXNpdG9yLnByb3RvdHlwZS52aXNpdE9iamVjdC5jYWxsKHRoaXMsIHgpO1xuICB9LFxuICB2aXNpdEF0dHJpYnV0ZXM6IGZ1bmN0aW9uIChhdHRycykge1xuICAgIC8vIGV4cGFuZCBkeW5hbWljIGF0dHJpYnV0ZXNcbiAgICBpZiAodHlwZW9mIGF0dHJzID09PSAnZnVuY3Rpb24nKVxuICAgICAgYXR0cnMgPSBCbGF6ZS5fd2l0aEN1cnJlbnRWaWV3KHRoaXMucGFyZW50VmlldywgYXR0cnMpO1xuXG4gICAgLy8gY2FsbCBzdXBlciAoZS5nLiBmb3IgY2FzZSB3aGVyZSBgYXR0cnNgIGlzIGFuIGFycmF5KVxuICAgIHJldHVybiBIVE1MLlRyYW5zZm9ybWluZ1Zpc2l0b3IucHJvdG90eXBlLnZpc2l0QXR0cmlidXRlcy5jYWxsKHRoaXMsIGF0dHJzKTtcbiAgfSxcbiAgdmlzaXRBdHRyaWJ1dGU6IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSwgdGFnKSB7XG4gICAgLy8gZXhwYW5kIGF0dHJpYnV0ZSB2YWx1ZXMgdGhhdCBhcmUgZnVuY3Rpb25zLiAgQW55IGF0dHJpYnV0ZSB2YWx1ZVxuICAgIC8vIHRoYXQgY29udGFpbnMgVmlld3MgbXVzdCBiZSB3cmFwcGVkIGluIGEgZnVuY3Rpb24uXG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgIHZhbHVlID0gQmxhemUuX3dpdGhDdXJyZW50Vmlldyh0aGlzLnBhcmVudFZpZXcsIHZhbHVlKTtcblxuICAgIHJldHVybiBIVE1MLlRyYW5zZm9ybWluZ1Zpc2l0b3IucHJvdG90eXBlLnZpc2l0QXR0cmlidXRlLmNhbGwoXG4gICAgICB0aGlzLCBuYW1lLCB2YWx1ZSwgdGFnKTtcbiAgfVxufSk7XG5cbi8vIFJldHVybiBCbGF6ZS5jdXJyZW50VmlldywgYnV0IG9ubHkgaWYgaXQgaXMgYmVpbmcgcmVuZGVyZWRcbi8vIChpLmUuIHdlIGFyZSBpbiBpdHMgcmVuZGVyKCkgbWV0aG9kKS5cbnZhciBjdXJyZW50Vmlld0lmUmVuZGVyaW5nID0gZnVuY3Rpb24gKCkge1xuICB2YXIgdmlldyA9IEJsYXplLmN1cnJlbnRWaWV3O1xuICByZXR1cm4gKHZpZXcgJiYgdmlldy5faXNJblJlbmRlcikgPyB2aWV3IDogbnVsbDtcbn07XG5cbkJsYXplLl9leHBhbmQgPSBmdW5jdGlvbiAoaHRtbGpzLCBwYXJlbnRWaWV3KSB7XG4gIHBhcmVudFZpZXcgPSBwYXJlbnRWaWV3IHx8IGN1cnJlbnRWaWV3SWZSZW5kZXJpbmcoKTtcbiAgcmV0dXJuIChuZXcgQmxhemUuX0hUTUxKU0V4cGFuZGVyKFxuICAgIHtwYXJlbnRWaWV3OiBwYXJlbnRWaWV3fSkpLnZpc2l0KGh0bWxqcyk7XG59O1xuXG5CbGF6ZS5fZXhwYW5kQXR0cmlidXRlcyA9IGZ1bmN0aW9uIChhdHRycywgcGFyZW50Vmlldykge1xuICBwYXJlbnRWaWV3ID0gcGFyZW50VmlldyB8fCBjdXJyZW50Vmlld0lmUmVuZGVyaW5nKCk7XG4gIHJldHVybiAobmV3IEJsYXplLl9IVE1MSlNFeHBhbmRlcihcbiAgICB7cGFyZW50VmlldzogcGFyZW50Vmlld30pKS52aXNpdEF0dHJpYnV0ZXMoYXR0cnMpO1xufTtcblxuQmxhemUuX2Rlc3Ryb3lWaWV3ID0gZnVuY3Rpb24gKHZpZXcsIF9za2lwTm9kZXMpIHtcbiAgaWYgKHZpZXcuaXNEZXN0cm95ZWQpXG4gICAgcmV0dXJuO1xuICB2aWV3LmlzRGVzdHJveWVkID0gdHJ1ZTtcblxuICBCbGF6ZS5fZmlyZUNhbGxiYWNrcyh2aWV3LCAnZGVzdHJveWVkJyk7XG5cbiAgLy8gRGVzdHJveSB2aWV3cyBhbmQgZWxlbWVudHMgcmVjdXJzaXZlbHkuICBJZiBfc2tpcE5vZGVzLFxuICAvLyBvbmx5IHJlY3Vyc2UgdXAgdG8gdmlld3MsIG5vdCBlbGVtZW50cywgZm9yIHRoZSBjYXNlIHdoZXJlXG4gIC8vIHRoZSBiYWNrZW5kIChqUXVlcnkpIGlzIHJlY3Vyc2luZyBvdmVyIHRoZSBlbGVtZW50cyBhbHJlYWR5LlxuXG4gIGlmICh2aWV3Ll9kb21yYW5nZSlcbiAgICB2aWV3Ll9kb21yYW5nZS5kZXN0cm95TWVtYmVycyhfc2tpcE5vZGVzKTtcbn07XG5cbkJsYXplLl9kZXN0cm95Tm9kZSA9IGZ1bmN0aW9uIChub2RlKSB7XG4gIGlmIChub2RlLm5vZGVUeXBlID09PSAxKVxuICAgIEJsYXplLl9ET01CYWNrZW5kLlRlYXJkb3duLnRlYXJEb3duRWxlbWVudChub2RlKTtcbn07XG5cbi8vIEFyZSB0aGUgSFRNTGpzIGVudGl0aWVzIGBhYCBhbmQgYGJgIHRoZSBzYW1lPyAgV2UgY291bGQgYmVcbi8vIG1vcmUgZWxhYm9yYXRlIGhlcmUgYnV0IHRoZSBwb2ludCBpcyB0byBjYXRjaCB0aGUgbW9zdCBiYXNpY1xuLy8gY2FzZXMuXG5CbGF6ZS5faXNDb250ZW50RXF1YWwgPSBmdW5jdGlvbiAoYSwgYikge1xuICBpZiAoYSBpbnN0YW5jZW9mIEhUTUwuUmF3KSB7XG4gICAgcmV0dXJuIChiIGluc3RhbmNlb2YgSFRNTC5SYXcpICYmIChhLnZhbHVlID09PSBiLnZhbHVlKTtcbiAgfSBlbHNlIGlmIChhID09IG51bGwpIHtcbiAgICByZXR1cm4gKGIgPT0gbnVsbCk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIChhID09PSBiKSAmJlxuICAgICAgKCh0eXBlb2YgYSA9PT0gJ251bWJlcicpIHx8ICh0eXBlb2YgYSA9PT0gJ2Jvb2xlYW4nKSB8fFxuICAgICAgICh0eXBlb2YgYSA9PT0gJ3N0cmluZycpKTtcbiAgfVxufTtcblxuLyoqXG4gKiBAc3VtbWFyeSBUaGUgVmlldyBjb3JyZXNwb25kaW5nIHRvIHRoZSBjdXJyZW50IHRlbXBsYXRlIGhlbHBlciwgZXZlbnQgaGFuZGxlciwgY2FsbGJhY2ssIG9yIGF1dG9ydW4uICBJZiB0aGVyZSBpc24ndCBvbmUsIGBudWxsYC5cbiAqIEBsb2N1cyBDbGllbnRcbiAqIEB0eXBlIHtCbGF6ZS5WaWV3fVxuICovXG5CbGF6ZS5jdXJyZW50VmlldyA9IG51bGw7XG5cbkJsYXplLl93aXRoQ3VycmVudFZpZXcgPSBmdW5jdGlvbiAodmlldywgZnVuYykge1xuICB2YXIgb2xkVmlldyA9IEJsYXplLmN1cnJlbnRWaWV3O1xuICB0cnkge1xuICAgIEJsYXplLmN1cnJlbnRWaWV3ID0gdmlldztcbiAgICByZXR1cm4gZnVuYygpO1xuICB9IGZpbmFsbHkge1xuICAgIEJsYXplLmN1cnJlbnRWaWV3ID0gb2xkVmlldztcbiAgfVxufTtcblxuLy8gQmxhemUucmVuZGVyIHB1YmxpY2x5IHRha2VzIGEgVmlldyBvciBhIFRlbXBsYXRlLlxuLy8gUHJpdmF0ZWx5LCBpdCB0YWtlcyBhbnkgSFRNTEpTIChleHRlbmRlZCB3aXRoIFZpZXdzIGFuZCBUZW1wbGF0ZXMpXG4vLyBleGNlcHQgbnVsbCBvciB1bmRlZmluZWQsIG9yIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGFueSBleHRlbmRlZFxuLy8gSFRNTEpTLlxudmFyIGNoZWNrUmVuZGVyQ29udGVudCA9IGZ1bmN0aW9uIChjb250ZW50KSB7XG4gIGlmIChjb250ZW50ID09PSBudWxsKVxuICAgIHRocm93IG5ldyBFcnJvcihcIkNhbid0IHJlbmRlciBudWxsXCIpO1xuICBpZiAodHlwZW9mIGNvbnRlbnQgPT09ICd1bmRlZmluZWQnKVxuICAgIHRocm93IG5ldyBFcnJvcihcIkNhbid0IHJlbmRlciB1bmRlZmluZWRcIik7XG5cbiAgaWYgKChjb250ZW50IGluc3RhbmNlb2YgQmxhemUuVmlldykgfHxcbiAgICAgIChjb250ZW50IGluc3RhbmNlb2YgQmxhemUuVGVtcGxhdGUpIHx8XG4gICAgICAodHlwZW9mIGNvbnRlbnQgPT09ICdmdW5jdGlvbicpKVxuICAgIHJldHVybjtcblxuICB0cnkge1xuICAgIC8vIFRocm93IGlmIGNvbnRlbnQgZG9lc24ndCBsb29rIGxpa2UgSFRNTEpTIGF0IHRoZSB0b3AgbGV2ZWxcbiAgICAvLyAoaS5lLiB2ZXJpZnkgdGhhdCB0aGlzIGlzIGFuIEhUTUwuVGFnLCBvciBhbiBhcnJheSxcbiAgICAvLyBvciBhIHByaW1pdGl2ZSwgZXRjLilcbiAgICAobmV3IEhUTUwuVmlzaXRvcikudmlzaXQoY29udGVudCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICAvLyBNYWtlIGVycm9yIG1lc3NhZ2Ugc3VpdGFibGUgZm9yIHB1YmxpYyBBUElcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJFeHBlY3RlZCBUZW1wbGF0ZSBvciBWaWV3XCIpO1xuICB9XG59O1xuXG4vLyBGb3IgQmxhemUucmVuZGVyIGFuZCBCbGF6ZS50b0hUTUwsIHRha2UgY29udGVudCBhbmRcbi8vIHdyYXAgaXQgaW4gYSBWaWV3LCB1bmxlc3MgaXQncyBhIHNpbmdsZSBWaWV3IG9yXG4vLyBUZW1wbGF0ZSBhbHJlYWR5LlxudmFyIGNvbnRlbnRBc1ZpZXcgPSBmdW5jdGlvbiAoY29udGVudCkge1xuICBjaGVja1JlbmRlckNvbnRlbnQoY29udGVudCk7XG5cbiAgaWYgKGNvbnRlbnQgaW5zdGFuY2VvZiBCbGF6ZS5UZW1wbGF0ZSkge1xuICAgIHJldHVybiBjb250ZW50LmNvbnN0cnVjdFZpZXcoKTtcbiAgfSBlbHNlIGlmIChjb250ZW50IGluc3RhbmNlb2YgQmxhemUuVmlldykge1xuICAgIHJldHVybiBjb250ZW50O1xuICB9IGVsc2Uge1xuICAgIHZhciBmdW5jID0gY29udGVudDtcbiAgICBpZiAodHlwZW9mIGZ1bmMgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGZ1bmMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBjb250ZW50O1xuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIEJsYXplLlZpZXcoJ3JlbmRlcicsIGZ1bmMpO1xuICB9XG59O1xuXG4vLyBGb3IgQmxhemUucmVuZGVyV2l0aERhdGEgYW5kIEJsYXplLnRvSFRNTFdpdGhEYXRhLCB3cmFwIGNvbnRlbnRcbi8vIGluIGEgZnVuY3Rpb24sIGlmIG5lY2Vzc2FyeSwgc28gaXQgY2FuIGJlIGEgY29udGVudCBhcmcgdG9cbi8vIGEgQmxhemUuV2l0aC5cbnZhciBjb250ZW50QXNGdW5jID0gZnVuY3Rpb24gKGNvbnRlbnQpIHtcbiAgY2hlY2tSZW5kZXJDb250ZW50KGNvbnRlbnQpO1xuXG4gIGlmICh0eXBlb2YgY29udGVudCAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBjb250ZW50O1xuICB9XG59O1xuXG4vKipcbiAqIEBzdW1tYXJ5IFJlbmRlcnMgYSB0ZW1wbGF0ZSBvciBWaWV3IHRvIERPTSBub2RlcyBhbmQgaW5zZXJ0cyBpdCBpbnRvIHRoZSBET00sIHJldHVybmluZyBhIHJlbmRlcmVkIFtWaWV3XSgjQmxhemUtVmlldykgd2hpY2ggY2FuIGJlIHBhc3NlZCB0byBbYEJsYXplLnJlbW92ZWBdKCNCbGF6ZS1yZW1vdmUpLlxuICogQGxvY3VzIENsaWVudFxuICogQHBhcmFtIHtUZW1wbGF0ZXxCbGF6ZS5WaWV3fSB0ZW1wbGF0ZU9yVmlldyBUaGUgdGVtcGxhdGUgKGUuZy4gYFRlbXBsYXRlLm15VGVtcGxhdGVgKSBvciBWaWV3IG9iamVjdCB0byByZW5kZXIuICBJZiBhIHRlbXBsYXRlLCBhIFZpZXcgb2JqZWN0IGlzIFtjb25zdHJ1Y3RlZF0oI3RlbXBsYXRlX2NvbnN0cnVjdHZpZXcpLiAgSWYgYSBWaWV3LCBpdCBtdXN0IGJlIGFuIHVucmVuZGVyZWQgVmlldywgd2hpY2ggYmVjb21lcyBhIHJlbmRlcmVkIFZpZXcgYW5kIGlzIHJldHVybmVkLlxuICogQHBhcmFtIHtET01Ob2RlfSBwYXJlbnROb2RlIFRoZSBub2RlIHRoYXQgd2lsbCBiZSB0aGUgcGFyZW50IG9mIHRoZSByZW5kZXJlZCB0ZW1wbGF0ZS4gIEl0IG11c3QgYmUgYW4gRWxlbWVudCBub2RlLlxuICogQHBhcmFtIHtET01Ob2RlfSBbbmV4dE5vZGVdIE9wdGlvbmFsLiBJZiBwcm92aWRlZCwgbXVzdCBiZSBhIGNoaWxkIG9mIDxlbT5wYXJlbnROb2RlPC9lbT47IHRoZSB0ZW1wbGF0ZSB3aWxsIGJlIGluc2VydGVkIGJlZm9yZSB0aGlzIG5vZGUuIElmIG5vdCBwcm92aWRlZCwgdGhlIHRlbXBsYXRlIHdpbGwgYmUgaW5zZXJ0ZWQgYXMgdGhlIGxhc3QgY2hpbGQgb2YgcGFyZW50Tm9kZS5cbiAqIEBwYXJhbSB7QmxhemUuVmlld30gW3BhcmVudFZpZXddIE9wdGlvbmFsLiBJZiBwcm92aWRlZCwgaXQgd2lsbCBiZSBzZXQgYXMgdGhlIHJlbmRlcmVkIFZpZXcncyBbYHBhcmVudFZpZXdgXSgjdmlld19wYXJlbnR2aWV3KS5cbiAqL1xuQmxhemUucmVuZGVyID0gZnVuY3Rpb24gKGNvbnRlbnQsIHBhcmVudEVsZW1lbnQsIG5leHROb2RlLCBwYXJlbnRWaWV3KSB7XG4gIGlmICghIHBhcmVudEVsZW1lbnQpIHtcbiAgICBCbGF6ZS5fd2FybihcIkJsYXplLnJlbmRlciB3aXRob3V0IGEgcGFyZW50IGVsZW1lbnQgaXMgZGVwcmVjYXRlZC4gXCIgK1xuICAgICAgICAgICAgICAgIFwiWW91IG11c3Qgc3BlY2lmeSB3aGVyZSB0byBpbnNlcnQgdGhlIHJlbmRlcmVkIGNvbnRlbnQuXCIpO1xuICB9XG5cbiAgaWYgKG5leHROb2RlIGluc3RhbmNlb2YgQmxhemUuVmlldykge1xuICAgIC8vIGhhbmRsZSBvbWl0dGVkIG5leHROb2RlXG4gICAgcGFyZW50VmlldyA9IG5leHROb2RlO1xuICAgIG5leHROb2RlID0gbnVsbDtcbiAgfVxuXG4gIC8vIHBhcmVudEVsZW1lbnQgbXVzdCBiZSBhIERPTSBub2RlLiBpbiBwYXJ0aWN1bGFyLCBjYW4ndCBiZSB0aGVcbiAgLy8gcmVzdWx0IG9mIGEgY2FsbCB0byBgJGAuIENhbid0IGNoZWNrIGlmIGBwYXJlbnRFbGVtZW50IGluc3RhbmNlb2ZcbiAgLy8gTm9kZWAgc2luY2UgJ05vZGUnIGlzIHVuZGVmaW5lZCBpbiBJRTguXG4gIGlmIChwYXJlbnRFbGVtZW50ICYmIHR5cGVvZiBwYXJlbnRFbGVtZW50Lm5vZGVUeXBlICE9PSAnbnVtYmVyJylcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCIncGFyZW50RWxlbWVudCcgbXVzdCBiZSBhIERPTSBub2RlXCIpO1xuICBpZiAobmV4dE5vZGUgJiYgdHlwZW9mIG5leHROb2RlLm5vZGVUeXBlICE9PSAnbnVtYmVyJykgLy8gJ25leHROb2RlJyBpcyBvcHRpb25hbFxuICAgIHRocm93IG5ldyBFcnJvcihcIiduZXh0Tm9kZScgbXVzdCBiZSBhIERPTSBub2RlXCIpO1xuXG4gIHBhcmVudFZpZXcgPSBwYXJlbnRWaWV3IHx8IGN1cnJlbnRWaWV3SWZSZW5kZXJpbmcoKTtcblxuICB2YXIgdmlldyA9IGNvbnRlbnRBc1ZpZXcoY29udGVudCk7XG4gIEJsYXplLl9tYXRlcmlhbGl6ZVZpZXcodmlldywgcGFyZW50Vmlldyk7XG5cbiAgaWYgKHBhcmVudEVsZW1lbnQpIHtcbiAgICB2aWV3Ll9kb21yYW5nZS5hdHRhY2gocGFyZW50RWxlbWVudCwgbmV4dE5vZGUpO1xuICB9XG5cbiAgcmV0dXJuIHZpZXc7XG59O1xuXG5CbGF6ZS5pbnNlcnQgPSBmdW5jdGlvbiAodmlldywgcGFyZW50RWxlbWVudCwgbmV4dE5vZGUpIHtcbiAgQmxhemUuX3dhcm4oXCJCbGF6ZS5pbnNlcnQgaGFzIGJlZW4gZGVwcmVjYXRlZC4gIFNwZWNpZnkgd2hlcmUgdG8gaW5zZXJ0IHRoZSBcIiArXG4gICAgICAgICAgICAgIFwicmVuZGVyZWQgY29udGVudCBpbiB0aGUgY2FsbCB0byBCbGF6ZS5yZW5kZXIuXCIpO1xuXG4gIGlmICghICh2aWV3ICYmICh2aWV3Ll9kb21yYW5nZSBpbnN0YW5jZW9mIEJsYXplLl9ET01SYW5nZSkpKVxuICAgIHRocm93IG5ldyBFcnJvcihcIkV4cGVjdGVkIHRlbXBsYXRlIHJlbmRlcmVkIHdpdGggQmxhemUucmVuZGVyXCIpO1xuXG4gIHZpZXcuX2RvbXJhbmdlLmF0dGFjaChwYXJlbnRFbGVtZW50LCBuZXh0Tm9kZSk7XG59O1xuXG4vKipcbiAqIEBzdW1tYXJ5IFJlbmRlcnMgYSB0ZW1wbGF0ZSBvciBWaWV3IHRvIERPTSBub2RlcyB3aXRoIGEgZGF0YSBjb250ZXh0LiAgT3RoZXJ3aXNlIGlkZW50aWNhbCB0byBgQmxhemUucmVuZGVyYC5cbiAqIEBsb2N1cyBDbGllbnRcbiAqIEBwYXJhbSB7VGVtcGxhdGV8QmxhemUuVmlld30gdGVtcGxhdGVPclZpZXcgVGhlIHRlbXBsYXRlIChlLmcuIGBUZW1wbGF0ZS5teVRlbXBsYXRlYCkgb3IgVmlldyBvYmplY3QgdG8gcmVuZGVyLlxuICogQHBhcmFtIHtPYmplY3R8RnVuY3Rpb259IGRhdGEgVGhlIGRhdGEgY29udGV4dCB0byB1c2UsIG9yIGEgZnVuY3Rpb24gcmV0dXJuaW5nIGEgZGF0YSBjb250ZXh0LiAgSWYgYSBmdW5jdGlvbiBpcyBwcm92aWRlZCwgaXQgd2lsbCBiZSByZWFjdGl2ZWx5IHJlLXJ1bi5cbiAqIEBwYXJhbSB7RE9NTm9kZX0gcGFyZW50Tm9kZSBUaGUgbm9kZSB0aGF0IHdpbGwgYmUgdGhlIHBhcmVudCBvZiB0aGUgcmVuZGVyZWQgdGVtcGxhdGUuICBJdCBtdXN0IGJlIGFuIEVsZW1lbnQgbm9kZS5cbiAqIEBwYXJhbSB7RE9NTm9kZX0gW25leHROb2RlXSBPcHRpb25hbC4gSWYgcHJvdmlkZWQsIG11c3QgYmUgYSBjaGlsZCBvZiA8ZW0+cGFyZW50Tm9kZTwvZW0+OyB0aGUgdGVtcGxhdGUgd2lsbCBiZSBpbnNlcnRlZCBiZWZvcmUgdGhpcyBub2RlLiBJZiBub3QgcHJvdmlkZWQsIHRoZSB0ZW1wbGF0ZSB3aWxsIGJlIGluc2VydGVkIGFzIHRoZSBsYXN0IGNoaWxkIG9mIHBhcmVudE5vZGUuXG4gKiBAcGFyYW0ge0JsYXplLlZpZXd9IFtwYXJlbnRWaWV3XSBPcHRpb25hbC4gSWYgcHJvdmlkZWQsIGl0IHdpbGwgYmUgc2V0IGFzIHRoZSByZW5kZXJlZCBWaWV3J3MgW2BwYXJlbnRWaWV3YF0oI3ZpZXdfcGFyZW50dmlldykuXG4gKi9cbkJsYXplLnJlbmRlcldpdGhEYXRhID0gZnVuY3Rpb24gKGNvbnRlbnQsIGRhdGEsIHBhcmVudEVsZW1lbnQsIG5leHROb2RlLCBwYXJlbnRWaWV3KSB7XG4gIC8vIFdlIGRlZmVyIHRoZSBoYW5kbGluZyBvZiBvcHRpb25hbCBhcmd1bWVudHMgdG8gQmxhemUucmVuZGVyLiAgQXQgdGhpcyBwb2ludCxcbiAgLy8gYG5leHROb2RlYCBtYXkgYWN0dWFsbHkgYmUgYHBhcmVudFZpZXdgLlxuICByZXR1cm4gQmxhemUucmVuZGVyKEJsYXplLl9UZW1wbGF0ZVdpdGgoZGF0YSwgY29udGVudEFzRnVuYyhjb250ZW50KSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudEVsZW1lbnQsIG5leHROb2RlLCBwYXJlbnRWaWV3KTtcbn07XG5cbi8qKlxuICogQHN1bW1hcnkgUmVtb3ZlcyBhIHJlbmRlcmVkIFZpZXcgZnJvbSB0aGUgRE9NLCBzdG9wcGluZyBhbGwgcmVhY3RpdmUgdXBkYXRlcyBhbmQgZXZlbnQgbGlzdGVuZXJzIG9uIGl0LiBBbHNvIGRlc3Ryb3lzIHRoZSBCbGF6ZS5UZW1wbGF0ZSBpbnN0YW5jZSBhc3NvY2lhdGVkIHdpdGggdGhlIHZpZXcuXG4gKiBAbG9jdXMgQ2xpZW50XG4gKiBAcGFyYW0ge0JsYXplLlZpZXd9IHJlbmRlcmVkVmlldyBUaGUgcmV0dXJuIHZhbHVlIGZyb20gYEJsYXplLnJlbmRlcmAgb3IgYEJsYXplLnJlbmRlcldpdGhEYXRhYCwgb3IgdGhlIGB2aWV3YCBwcm9wZXJ0eSBvZiBhIEJsYXplLlRlbXBsYXRlIGluc3RhbmNlLiBDYWxsaW5nIGBCbGF6ZS5yZW1vdmUoVGVtcGxhdGUuaW5zdGFuY2UoKS52aWV3KWAgZnJvbSB3aXRoaW4gYSB0ZW1wbGF0ZSBldmVudCBoYW5kbGVyIHdpbGwgZGVzdHJveSB0aGUgdmlldyBhcyB3ZWxsIGFzIHRoYXQgdGVtcGxhdGUgYW5kIHRyaWdnZXIgdGhlIHRlbXBsYXRlJ3MgYG9uRGVzdHJveWVkYCBoYW5kbGVycy5cbiAqL1xuQmxhemUucmVtb3ZlID0gZnVuY3Rpb24gKHZpZXcpIHtcbiAgaWYgKCEgKHZpZXcgJiYgKHZpZXcuX2RvbXJhbmdlIGluc3RhbmNlb2YgQmxhemUuX0RPTVJhbmdlKSkpXG4gICAgdGhyb3cgbmV3IEVycm9yKFwiRXhwZWN0ZWQgdGVtcGxhdGUgcmVuZGVyZWQgd2l0aCBCbGF6ZS5yZW5kZXJcIik7XG5cbiAgd2hpbGUgKHZpZXcpIHtcbiAgICBpZiAoISB2aWV3LmlzRGVzdHJveWVkKSB7XG4gICAgICB2YXIgcmFuZ2UgPSB2aWV3Ll9kb21yYW5nZTtcbiAgICAgIGlmIChyYW5nZS5hdHRhY2hlZCAmJiAhIHJhbmdlLnBhcmVudFJhbmdlKVxuICAgICAgICByYW5nZS5kZXRhY2goKTtcbiAgICAgIHJhbmdlLmRlc3Ryb3koKTtcbiAgICB9XG5cbiAgICB2aWV3ID0gdmlldy5faGFzR2VuZXJhdGVkUGFyZW50ICYmIHZpZXcucGFyZW50VmlldztcbiAgfVxufTtcblxuLyoqXG4gKiBAc3VtbWFyeSBSZW5kZXJzIGEgdGVtcGxhdGUgb3IgVmlldyB0byBhIHN0cmluZyBvZiBIVE1MLlxuICogQGxvY3VzIENsaWVudFxuICogQHBhcmFtIHtUZW1wbGF0ZXxCbGF6ZS5WaWV3fSB0ZW1wbGF0ZU9yVmlldyBUaGUgdGVtcGxhdGUgKGUuZy4gYFRlbXBsYXRlLm15VGVtcGxhdGVgKSBvciBWaWV3IG9iamVjdCBmcm9tIHdoaWNoIHRvIGdlbmVyYXRlIEhUTUwuXG4gKi9cbkJsYXplLnRvSFRNTCA9IGZ1bmN0aW9uIChjb250ZW50LCBwYXJlbnRWaWV3KSB7XG4gIHBhcmVudFZpZXcgPSBwYXJlbnRWaWV3IHx8IGN1cnJlbnRWaWV3SWZSZW5kZXJpbmcoKTtcblxuICByZXR1cm4gSFRNTC50b0hUTUwoQmxhemUuX2V4cGFuZFZpZXcoY29udGVudEFzVmlldyhjb250ZW50KSwgcGFyZW50VmlldykpO1xufTtcblxuLyoqXG4gKiBAc3VtbWFyeSBSZW5kZXJzIGEgdGVtcGxhdGUgb3IgVmlldyB0byBIVE1MIHdpdGggYSBkYXRhIGNvbnRleHQuICBPdGhlcndpc2UgaWRlbnRpY2FsIHRvIGBCbGF6ZS50b0hUTUxgLlxuICogQGxvY3VzIENsaWVudFxuICogQHBhcmFtIHtUZW1wbGF0ZXxCbGF6ZS5WaWV3fSB0ZW1wbGF0ZU9yVmlldyBUaGUgdGVtcGxhdGUgKGUuZy4gYFRlbXBsYXRlLm15VGVtcGxhdGVgKSBvciBWaWV3IG9iamVjdCBmcm9tIHdoaWNoIHRvIGdlbmVyYXRlIEhUTUwuXG4gKiBAcGFyYW0ge09iamVjdHxGdW5jdGlvbn0gZGF0YSBUaGUgZGF0YSBjb250ZXh0IHRvIHVzZSwgb3IgYSBmdW5jdGlvbiByZXR1cm5pbmcgYSBkYXRhIGNvbnRleHQuXG4gKi9cbkJsYXplLnRvSFRNTFdpdGhEYXRhID0gZnVuY3Rpb24gKGNvbnRlbnQsIGRhdGEsIHBhcmVudFZpZXcpIHtcbiAgcGFyZW50VmlldyA9IHBhcmVudFZpZXcgfHwgY3VycmVudFZpZXdJZlJlbmRlcmluZygpO1xuXG4gIHJldHVybiBIVE1MLnRvSFRNTChCbGF6ZS5fZXhwYW5kVmlldyhCbGF6ZS5fVGVtcGxhdGVXaXRoKFxuICAgIGRhdGEsIGNvbnRlbnRBc0Z1bmMoY29udGVudCkpLCBwYXJlbnRWaWV3KSk7XG59O1xuXG5CbGF6ZS5fdG9UZXh0ID0gZnVuY3Rpb24gKGh0bWxqcywgcGFyZW50VmlldywgdGV4dE1vZGUpIHtcbiAgaWYgKHR5cGVvZiBodG1sanMgPT09ICdmdW5jdGlvbicpXG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQmxhemUuX3RvVGV4dCBkb2Vzbid0IHRha2UgYSBmdW5jdGlvbiwganVzdCBIVE1ManNcIik7XG5cbiAgaWYgKChwYXJlbnRWaWV3ICE9IG51bGwpICYmICEgKHBhcmVudFZpZXcgaW5zdGFuY2VvZiBCbGF6ZS5WaWV3KSkge1xuICAgIC8vIG9taXR0ZWQgcGFyZW50VmlldyBhcmd1bWVudFxuICAgIHRleHRNb2RlID0gcGFyZW50VmlldztcbiAgICBwYXJlbnRWaWV3ID0gbnVsbDtcbiAgfVxuICBwYXJlbnRWaWV3ID0gcGFyZW50VmlldyB8fCBjdXJyZW50Vmlld0lmUmVuZGVyaW5nKCk7XG5cbiAgaWYgKCEgdGV4dE1vZGUpXG4gICAgdGhyb3cgbmV3IEVycm9yKFwidGV4dE1vZGUgcmVxdWlyZWRcIik7XG4gIGlmICghICh0ZXh0TW9kZSA9PT0gSFRNTC5URVhUTU9ERS5TVFJJTkcgfHxcbiAgICAgICAgIHRleHRNb2RlID09PSBIVE1MLlRFWFRNT0RFLlJDREFUQSB8fFxuICAgICAgICAgdGV4dE1vZGUgPT09IEhUTUwuVEVYVE1PREUuQVRUUklCVVRFKSlcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duIHRleHRNb2RlOiBcIiArIHRleHRNb2RlKTtcblxuICByZXR1cm4gSFRNTC50b1RleHQoQmxhemUuX2V4cGFuZChodG1sanMsIHBhcmVudFZpZXcpLCB0ZXh0TW9kZSk7XG59O1xuXG4vKipcbiAqIEBzdW1tYXJ5IFJldHVybnMgdGhlIGN1cnJlbnQgZGF0YSBjb250ZXh0LCBvciB0aGUgZGF0YSBjb250ZXh0IHRoYXQgd2FzIHVzZWQgd2hlbiByZW5kZXJpbmcgYSBwYXJ0aWN1bGFyIERPTSBlbGVtZW50IG9yIFZpZXcgZnJvbSBhIE1ldGVvciB0ZW1wbGF0ZS5cbiAqIEBsb2N1cyBDbGllbnRcbiAqIEBwYXJhbSB7RE9NRWxlbWVudHxCbGF6ZS5WaWV3fSBbZWxlbWVudE9yVmlld10gT3B0aW9uYWwuICBBbiBlbGVtZW50IHRoYXQgd2FzIHJlbmRlcmVkIGJ5IGEgTWV0ZW9yLCBvciBhIFZpZXcuXG4gKi9cbkJsYXplLmdldERhdGEgPSBmdW5jdGlvbiAoZWxlbWVudE9yVmlldykge1xuICB2YXIgdGhlV2l0aDtcblxuICBpZiAoISBlbGVtZW50T3JWaWV3KSB7XG4gICAgdGhlV2l0aCA9IEJsYXplLmdldFZpZXcoJ3dpdGgnKTtcbiAgfSBlbHNlIGlmIChlbGVtZW50T3JWaWV3IGluc3RhbmNlb2YgQmxhemUuVmlldykge1xuICAgIHZhciB2aWV3ID0gZWxlbWVudE9yVmlldztcbiAgICB0aGVXaXRoID0gKHZpZXcubmFtZSA9PT0gJ3dpdGgnID8gdmlldyA6XG4gICAgICAgICAgICAgICBCbGF6ZS5nZXRWaWV3KHZpZXcsICd3aXRoJykpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBlbGVtZW50T3JWaWV3Lm5vZGVUeXBlID09PSAnbnVtYmVyJykge1xuICAgIGlmIChlbGVtZW50T3JWaWV3Lm5vZGVUeXBlICE9PSAxKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRXhwZWN0ZWQgRE9NIGVsZW1lbnRcIik7XG4gICAgdGhlV2l0aCA9IEJsYXplLmdldFZpZXcoZWxlbWVudE9yVmlldywgJ3dpdGgnKTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJFeHBlY3RlZCBET00gZWxlbWVudCBvciBWaWV3XCIpO1xuICB9XG5cbiAgcmV0dXJuIHRoZVdpdGggPyB0aGVXaXRoLmRhdGFWYXIuZ2V0KCkgOiBudWxsO1xufTtcblxuLy8gRm9yIGJhY2stY29tcGF0XG5CbGF6ZS5nZXRFbGVtZW50RGF0YSA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gIEJsYXplLl93YXJuKFwiQmxhemUuZ2V0RWxlbWVudERhdGEgaGFzIGJlZW4gZGVwcmVjYXRlZC4gIFVzZSBcIiArXG4gICAgICAgICAgICAgIFwiQmxhemUuZ2V0RGF0YShlbGVtZW50KSBpbnN0ZWFkLlwiKTtcblxuICBpZiAoZWxlbWVudC5ub2RlVHlwZSAhPT0gMSlcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJFeHBlY3RlZCBET00gZWxlbWVudFwiKTtcblxuICByZXR1cm4gQmxhemUuZ2V0RGF0YShlbGVtZW50KTtcbn07XG5cbi8vIEJvdGggYXJndW1lbnRzIGFyZSBvcHRpb25hbC5cblxuLyoqXG4gKiBAc3VtbWFyeSBHZXRzIGVpdGhlciB0aGUgY3VycmVudCBWaWV3LCBvciB0aGUgVmlldyBlbmNsb3NpbmcgdGhlIGdpdmVuIERPTSBlbGVtZW50LlxuICogQGxvY3VzIENsaWVudFxuICogQHBhcmFtIHtET01FbGVtZW50fSBbZWxlbWVudF0gT3B0aW9uYWwuICBJZiBzcGVjaWZpZWQsIHRoZSBWaWV3IGVuY2xvc2luZyBgZWxlbWVudGAgaXMgcmV0dXJuZWQuXG4gKi9cbkJsYXplLmdldFZpZXcgPSBmdW5jdGlvbiAoZWxlbWVudE9yVmlldywgX3ZpZXdOYW1lKSB7XG4gIHZhciB2aWV3TmFtZSA9IF92aWV3TmFtZTtcblxuICBpZiAoKHR5cGVvZiBlbGVtZW50T3JWaWV3KSA9PT0gJ3N0cmluZycpIHtcbiAgICAvLyBvbWl0dGVkIGVsZW1lbnRPclZpZXc7IHZpZXdOYW1lIHByZXNlbnRcbiAgICB2aWV3TmFtZSA9IGVsZW1lbnRPclZpZXc7XG4gICAgZWxlbWVudE9yVmlldyA9IG51bGw7XG4gIH1cblxuICAvLyBXZSBjb3VsZCBldmVudHVhbGx5IHNob3J0ZW4gdGhlIGNvZGUgYnkgZm9sZGluZyB0aGUgbG9naWNcbiAgLy8gZnJvbSB0aGUgb3RoZXIgbWV0aG9kcyBpbnRvIHRoaXMgbWV0aG9kLlxuICBpZiAoISBlbGVtZW50T3JWaWV3KSB7XG4gICAgcmV0dXJuIEJsYXplLl9nZXRDdXJyZW50Vmlldyh2aWV3TmFtZSk7XG4gIH0gZWxzZSBpZiAoZWxlbWVudE9yVmlldyBpbnN0YW5jZW9mIEJsYXplLlZpZXcpIHtcbiAgICByZXR1cm4gQmxhemUuX2dldFBhcmVudFZpZXcoZWxlbWVudE9yVmlldywgdmlld05hbWUpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBlbGVtZW50T3JWaWV3Lm5vZGVUeXBlID09PSAnbnVtYmVyJykge1xuICAgIHJldHVybiBCbGF6ZS5fZ2V0RWxlbWVudFZpZXcoZWxlbWVudE9yVmlldywgdmlld05hbWUpO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkV4cGVjdGVkIERPTSBlbGVtZW50IG9yIFZpZXdcIik7XG4gIH1cbn07XG5cbi8vIEdldHMgdGhlIGN1cnJlbnQgdmlldyBvciBpdHMgbmVhcmVzdCBhbmNlc3RvciBvZiBuYW1lXG4vLyBgbmFtZWAuXG5CbGF6ZS5fZ2V0Q3VycmVudFZpZXcgPSBmdW5jdGlvbiAobmFtZSkge1xuICB2YXIgdmlldyA9IEJsYXplLmN1cnJlbnRWaWV3O1xuICAvLyBCZXR0ZXIgdG8gZmFpbCBpbiBjYXNlcyB3aGVyZSBpdCBkb2Vzbid0IG1ha2Ugc2Vuc2VcbiAgLy8gdG8gdXNlIEJsYXplLl9nZXRDdXJyZW50VmlldygpLiAgVGhlcmUgd2lsbCBiZSBhIGN1cnJlbnRcbiAgLy8gdmlldyBhbnl3aGVyZSBpdCBkb2VzLiAgWW91IGNhbiBjaGVjayBCbGF6ZS5jdXJyZW50Vmlld1xuICAvLyBpZiB5b3Ugd2FudCB0byBrbm93IHdoZXRoZXIgdGhlcmUgaXMgb25lIG9yIG5vdC5cbiAgaWYgKCEgdmlldylcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGVyZSBpcyBubyBjdXJyZW50IHZpZXdcIik7XG5cbiAgaWYgKG5hbWUpIHtcbiAgICB3aGlsZSAodmlldyAmJiB2aWV3Lm5hbWUgIT09IG5hbWUpXG4gICAgICB2aWV3ID0gdmlldy5wYXJlbnRWaWV3O1xuICAgIHJldHVybiB2aWV3IHx8IG51bGw7XG4gIH0gZWxzZSB7XG4gICAgLy8gQmxhemUuX2dldEN1cnJlbnRWaWV3KCkgd2l0aCBubyBhcmd1bWVudHMganVzdCByZXR1cm5zXG4gICAgLy8gQmxhemUuY3VycmVudFZpZXcuXG4gICAgcmV0dXJuIHZpZXc7XG4gIH1cbn07XG5cbkJsYXplLl9nZXRQYXJlbnRWaWV3ID0gZnVuY3Rpb24gKHZpZXcsIG5hbWUpIHtcbiAgdmFyIHYgPSB2aWV3LnBhcmVudFZpZXc7XG5cbiAgaWYgKG5hbWUpIHtcbiAgICB3aGlsZSAodiAmJiB2Lm5hbWUgIT09IG5hbWUpXG4gICAgICB2ID0gdi5wYXJlbnRWaWV3O1xuICB9XG5cbiAgcmV0dXJuIHYgfHwgbnVsbDtcbn07XG5cbkJsYXplLl9nZXRFbGVtZW50VmlldyA9IGZ1bmN0aW9uIChlbGVtLCBuYW1lKSB7XG4gIHZhciByYW5nZSA9IEJsYXplLl9ET01SYW5nZS5mb3JFbGVtZW50KGVsZW0pO1xuICB2YXIgdmlldyA9IG51bGw7XG4gIHdoaWxlIChyYW5nZSAmJiAhIHZpZXcpIHtcbiAgICB2aWV3ID0gKHJhbmdlLnZpZXcgfHwgbnVsbCk7XG4gICAgaWYgKCEgdmlldykge1xuICAgICAgaWYgKHJhbmdlLnBhcmVudFJhbmdlKVxuICAgICAgICByYW5nZSA9IHJhbmdlLnBhcmVudFJhbmdlO1xuICAgICAgZWxzZVxuICAgICAgICByYW5nZSA9IEJsYXplLl9ET01SYW5nZS5mb3JFbGVtZW50KHJhbmdlLnBhcmVudEVsZW1lbnQpO1xuICAgIH1cbiAgfVxuXG4gIGlmIChuYW1lKSB7XG4gICAgd2hpbGUgKHZpZXcgJiYgdmlldy5uYW1lICE9PSBuYW1lKVxuICAgICAgdmlldyA9IHZpZXcucGFyZW50VmlldztcbiAgICByZXR1cm4gdmlldyB8fCBudWxsO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB2aWV3O1xuICB9XG59O1xuXG5CbGF6ZS5fYWRkRXZlbnRNYXAgPSBmdW5jdGlvbiAodmlldywgZXZlbnRNYXAsIHRoaXNJbkhhbmRsZXIpIHtcbiAgdGhpc0luSGFuZGxlciA9ICh0aGlzSW5IYW5kbGVyIHx8IG51bGwpO1xuICB2YXIgaGFuZGxlcyA9IFtdO1xuXG4gIGlmICghIHZpZXcuX2RvbXJhbmdlKVxuICAgIHRocm93IG5ldyBFcnJvcihcIlZpZXcgbXVzdCBoYXZlIGEgRE9NUmFuZ2VcIik7XG5cbiAgdmlldy5fZG9tcmFuZ2Uub25BdHRhY2hlZChmdW5jdGlvbiBhdHRhY2hlZF9ldmVudE1hcHMocmFuZ2UsIGVsZW1lbnQpIHtcbiAgICBfLmVhY2goZXZlbnRNYXAsIGZ1bmN0aW9uIChoYW5kbGVyLCBzcGVjKSB7XG4gICAgICB2YXIgY2xhdXNlcyA9IHNwZWMuc3BsaXQoLyxcXHMrLyk7XG4gICAgICAvLyBpdGVyYXRlIG92ZXIgY2xhdXNlcyBvZiBzcGVjLCBlLmcuIFsnY2xpY2sgLmZvbycsICdjbGljayAuYmFyJ11cbiAgICAgIF8uZWFjaChjbGF1c2VzLCBmdW5jdGlvbiAoY2xhdXNlKSB7XG4gICAgICAgIHZhciBwYXJ0cyA9IGNsYXVzZS5zcGxpdCgvXFxzKy8pO1xuICAgICAgICBpZiAocGFydHMubGVuZ3RoID09PSAwKVxuICAgICAgICAgIHJldHVybjtcblxuICAgICAgICB2YXIgbmV3RXZlbnRzID0gcGFydHMuc2hpZnQoKTtcbiAgICAgICAgdmFyIHNlbGVjdG9yID0gcGFydHMuam9pbignICcpO1xuICAgICAgICBoYW5kbGVzLnB1c2goQmxhemUuX0V2ZW50U3VwcG9ydC5saXN0ZW4oXG4gICAgICAgICAgZWxlbWVudCwgbmV3RXZlbnRzLCBzZWxlY3RvcixcbiAgICAgICAgICBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgICAgICBpZiAoISByYW5nZS5jb250YWluc0VsZW1lbnQoZXZ0LmN1cnJlbnRUYXJnZXQpKVxuICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIHZhciBoYW5kbGVyVGhpcyA9IHRoaXNJbkhhbmRsZXIgfHwgdGhpcztcbiAgICAgICAgICAgIHZhciBoYW5kbGVyQXJncyA9IGFyZ3VtZW50cztcbiAgICAgICAgICAgIHJldHVybiBCbGF6ZS5fd2l0aEN1cnJlbnRWaWV3KHZpZXcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZXIuYXBwbHkoaGFuZGxlclRoaXMsIGhhbmRsZXJBcmdzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgcmFuZ2UsIGZ1bmN0aW9uIChyKSB7XG4gICAgICAgICAgICByZXR1cm4gci5wYXJlbnRSYW5nZTtcbiAgICAgICAgICB9KSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgdmlldy5vblZpZXdEZXN0cm95ZWQoZnVuY3Rpb24gKCkge1xuICAgIF8uZWFjaChoYW5kbGVzLCBmdW5jdGlvbiAoaCkge1xuICAgICAgaC5zdG9wKCk7XG4gICAgfSk7XG4gICAgaGFuZGxlcy5sZW5ndGggPSAwO1xuICB9KTtcbn07XG4iLCJCbGF6ZS5fY2FsY3VsYXRlQ29uZGl0aW9uID0gZnVuY3Rpb24gKGNvbmQpIHtcbiAgaWYgKGNvbmQgaW5zdGFuY2VvZiBBcnJheSAmJiBjb25kLmxlbmd0aCA9PT0gMClcbiAgICBjb25kID0gZmFsc2U7XG4gIHJldHVybiAhISBjb25kO1xufTtcblxuLyoqXG4gKiBAc3VtbWFyeSBDb25zdHJ1Y3RzIGEgVmlldyB0aGF0IHJlbmRlcnMgY29udGVudCB3aXRoIGEgZGF0YSBjb250ZXh0LlxuICogQGxvY3VzIENsaWVudFxuICogQHBhcmFtIHtPYmplY3R8RnVuY3Rpb259IGRhdGEgQW4gb2JqZWN0IHRvIHVzZSBhcyB0aGUgZGF0YSBjb250ZXh0LCBvciBhIGZ1bmN0aW9uIHJldHVybmluZyBzdWNoIGFuIG9iamVjdC4gIElmIGEgZnVuY3Rpb24gaXMgcHJvdmlkZWQsIGl0IHdpbGwgYmUgcmVhY3RpdmVseSByZS1ydW4uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjb250ZW50RnVuYyBBIEZ1bmN0aW9uIHRoYXQgcmV0dXJucyBbKnJlbmRlcmFibGUgY29udGVudCpdKCNSZW5kZXJhYmxlLUNvbnRlbnQpLlxuICovXG5CbGF6ZS5XaXRoID0gZnVuY3Rpb24gKGRhdGEsIGNvbnRlbnRGdW5jKSB7XG4gIHZhciB2aWV3ID0gQmxhemUuVmlldygnd2l0aCcsIGNvbnRlbnRGdW5jKTtcblxuICB2aWV3LmRhdGFWYXIgPSBuZXcgUmVhY3RpdmVWYXI7XG5cbiAgdmlldy5vblZpZXdDcmVhdGVkKGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodHlwZW9mIGRhdGEgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIC8vIGBkYXRhYCBpcyBhIHJlYWN0aXZlIGZ1bmN0aW9uXG4gICAgICB2aWV3LmF1dG9ydW4oZnVuY3Rpb24gKCkge1xuICAgICAgICB2aWV3LmRhdGFWYXIuc2V0KGRhdGEoKSk7XG4gICAgICB9LCB2aWV3LnBhcmVudFZpZXcsICdzZXREYXRhJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZpZXcuZGF0YVZhci5zZXQoZGF0YSk7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gdmlldztcbn07XG5cbi8qKlxuICogQXR0YWNoZXMgYmluZGluZ3MgdG8gdGhlIGluc3RhbnRpYXRlZCB2aWV3LlxuICogQHBhcmFtIHtPYmplY3R9IGJpbmRpbmdzIEEgZGljdGlvbmFyeSBvZiBiaW5kaW5ncywgZWFjaCBiaW5kaW5nIG5hbWVcbiAqIGNvcnJlc3BvbmRzIHRvIGEgdmFsdWUgb3IgYSBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgcmVhY3RpdmVseSByZS1ydW4uXG4gKiBAcGFyYW0ge1ZpZXd9IHZpZXcgVGhlIHRhcmdldC5cbiAqL1xuQmxhemUuX2F0dGFjaEJpbmRpbmdzVG9WaWV3ID0gZnVuY3Rpb24gKGJpbmRpbmdzLCB2aWV3KSB7XG4gIHZpZXcub25WaWV3Q3JlYXRlZChmdW5jdGlvbiAoKSB7XG4gICAgXy5lYWNoKGJpbmRpbmdzLCBmdW5jdGlvbiAoYmluZGluZywgbmFtZSkge1xuICAgICAgdmlldy5fc2NvcGVCaW5kaW5nc1tuYW1lXSA9IG5ldyBSZWFjdGl2ZVZhcjtcbiAgICAgIGlmICh0eXBlb2YgYmluZGluZyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB2aWV3LmF1dG9ydW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHZpZXcuX3Njb3BlQmluZGluZ3NbbmFtZV0uc2V0KGJpbmRpbmcoKSk7XG4gICAgICAgIH0sIHZpZXcucGFyZW50Vmlldyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2aWV3Ll9zY29wZUJpbmRpbmdzW25hbWVdLnNldChiaW5kaW5nKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59O1xuXG4vKipcbiAqIEBzdW1tYXJ5IENvbnN0cnVjdHMgYSBWaWV3IHNldHRpbmcgdGhlIGxvY2FsIGxleGljYWwgc2NvcGUgaW4gdGhlIGJsb2NrLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gYmluZGluZ3MgRGljdGlvbmFyeSBtYXBwaW5nIG5hbWVzIG9mIGJpbmRpbmdzIHRvXG4gKiB2YWx1ZXMgb3IgY29tcHV0YXRpb25zIHRvIHJlYWN0aXZlbHkgcmUtcnVuLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY29udGVudEZ1bmMgQSBGdW5jdGlvbiB0aGF0IHJldHVybnMgWypyZW5kZXJhYmxlIGNvbnRlbnQqXSgjUmVuZGVyYWJsZS1Db250ZW50KS5cbiAqL1xuQmxhemUuTGV0ID0gZnVuY3Rpb24gKGJpbmRpbmdzLCBjb250ZW50RnVuYykge1xuICB2YXIgdmlldyA9IEJsYXplLlZpZXcoJ2xldCcsIGNvbnRlbnRGdW5jKTtcbiAgQmxhemUuX2F0dGFjaEJpbmRpbmdzVG9WaWV3KGJpbmRpbmdzLCB2aWV3KTtcblxuICByZXR1cm4gdmlldztcbn07XG5cbi8qKlxuICogQHN1bW1hcnkgQ29uc3RydWN0cyBhIFZpZXcgdGhhdCByZW5kZXJzIGNvbnRlbnQgY29uZGl0aW9uYWxseS5cbiAqIEBsb2N1cyBDbGllbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNvbmRpdGlvbkZ1bmMgQSBmdW5jdGlvbiB0byByZWFjdGl2ZWx5IHJlLXJ1bi4gIFdoZXRoZXIgdGhlIHJlc3VsdCBpcyB0cnV0aHkgb3IgZmFsc3kgZGV0ZXJtaW5lcyB3aGV0aGVyIGBjb250ZW50RnVuY2Agb3IgYGVsc2VGdW5jYCBpcyBzaG93bi4gIEFuIGVtcHR5IGFycmF5IGlzIGNvbnNpZGVyZWQgZmFsc3kuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjb250ZW50RnVuYyBBIEZ1bmN0aW9uIHRoYXQgcmV0dXJucyBbKnJlbmRlcmFibGUgY29udGVudCpdKCNSZW5kZXJhYmxlLUNvbnRlbnQpLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2Vsc2VGdW5jXSBPcHRpb25hbC4gIEEgRnVuY3Rpb24gdGhhdCByZXR1cm5zIFsqcmVuZGVyYWJsZSBjb250ZW50Kl0oI1JlbmRlcmFibGUtQ29udGVudCkuICBJZiBubyBgZWxzZUZ1bmNgIGlzIHN1cHBsaWVkLCBubyBjb250ZW50IGlzIHNob3duIGluIHRoZSBcImVsc2VcIiBjYXNlLlxuICovXG5CbGF6ZS5JZiA9IGZ1bmN0aW9uIChjb25kaXRpb25GdW5jLCBjb250ZW50RnVuYywgZWxzZUZ1bmMsIF9ub3QpIHtcbiAgdmFyIGNvbmRpdGlvblZhciA9IG5ldyBSZWFjdGl2ZVZhcjtcblxuICB2YXIgdmlldyA9IEJsYXplLlZpZXcoX25vdCA/ICd1bmxlc3MnIDogJ2lmJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBjb25kaXRpb25WYXIuZ2V0KCkgPyBjb250ZW50RnVuYygpIDpcbiAgICAgIChlbHNlRnVuYyA/IGVsc2VGdW5jKCkgOiBudWxsKTtcbiAgfSk7XG4gIHZpZXcuX19jb25kaXRpb25WYXIgPSBjb25kaXRpb25WYXI7XG4gIHZpZXcub25WaWV3Q3JlYXRlZChmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5hdXRvcnVuKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBjb25kID0gQmxhemUuX2NhbGN1bGF0ZUNvbmRpdGlvbihjb25kaXRpb25GdW5jKCkpO1xuICAgICAgY29uZGl0aW9uVmFyLnNldChfbm90ID8gKCEgY29uZCkgOiBjb25kKTtcbiAgICB9LCB0aGlzLnBhcmVudFZpZXcsICdjb25kaXRpb24nKTtcbiAgfSk7XG5cbiAgcmV0dXJuIHZpZXc7XG59O1xuXG4vKipcbiAqIEBzdW1tYXJ5IEFuIGludmVydGVkIFtgQmxhemUuSWZgXSgjQmxhemUtSWYpLlxuICogQGxvY3VzIENsaWVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gY29uZGl0aW9uRnVuYyBBIGZ1bmN0aW9uIHRvIHJlYWN0aXZlbHkgcmUtcnVuLiAgSWYgdGhlIHJlc3VsdCBpcyBmYWxzeSwgYGNvbnRlbnRGdW5jYCBpcyBzaG93biwgb3RoZXJ3aXNlIGBlbHNlRnVuY2AgaXMgc2hvd24uICBBbiBlbXB0eSBhcnJheSBpcyBjb25zaWRlcmVkIGZhbHN5LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY29udGVudEZ1bmMgQSBGdW5jdGlvbiB0aGF0IHJldHVybnMgWypyZW5kZXJhYmxlIGNvbnRlbnQqXSgjUmVuZGVyYWJsZS1Db250ZW50KS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtlbHNlRnVuY10gT3B0aW9uYWwuICBBIEZ1bmN0aW9uIHRoYXQgcmV0dXJucyBbKnJlbmRlcmFibGUgY29udGVudCpdKCNSZW5kZXJhYmxlLUNvbnRlbnQpLiAgSWYgbm8gYGVsc2VGdW5jYCBpcyBzdXBwbGllZCwgbm8gY29udGVudCBpcyBzaG93biBpbiB0aGUgXCJlbHNlXCIgY2FzZS5cbiAqL1xuQmxhemUuVW5sZXNzID0gZnVuY3Rpb24gKGNvbmRpdGlvbkZ1bmMsIGNvbnRlbnRGdW5jLCBlbHNlRnVuYykge1xuICByZXR1cm4gQmxhemUuSWYoY29uZGl0aW9uRnVuYywgY29udGVudEZ1bmMsIGVsc2VGdW5jLCB0cnVlIC8qX25vdCovKTtcbn07XG5cbi8qKlxuICogQHN1bW1hcnkgQ29uc3RydWN0cyBhIFZpZXcgdGhhdCByZW5kZXJzIGBjb250ZW50RnVuY2AgZm9yIGVhY2ggaXRlbSBpbiBhIHNlcXVlbmNlLlxuICogQGxvY3VzIENsaWVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gYXJnRnVuYyBBIGZ1bmN0aW9uIHRvIHJlYWN0aXZlbHkgcmUtcnVuLiBUaGUgZnVuY3Rpb24gY2FuXG4gKiByZXR1cm4gb25lIG9mIHR3byBvcHRpb25zOlxuICpcbiAqIDEuIEFuIG9iamVjdCB3aXRoIHR3byBmaWVsZHM6ICdfdmFyaWFibGUnIGFuZCAnX3NlcXVlbmNlJy4gRWFjaCBpdGVyYXRlcyBvdmVyXG4gKiAgICdfc2VxdWVuY2UnLCBpdCBtYXkgYmUgYSBDdXJzb3IsIGFuIGFycmF5LCBudWxsLCBvciB1bmRlZmluZWQuIEluc2lkZSB0aGVcbiAqICAgRWFjaCBib2R5IHlvdSB3aWxsIGJlIGFibGUgdG8gZ2V0IHRoZSBjdXJyZW50IGl0ZW0gZnJvbSB0aGUgc2VxdWVuY2UgdXNpbmdcbiAqICAgdGhlIG5hbWUgc3BlY2lmaWVkIGluIHRoZSAnX3ZhcmlhYmxlJyBmaWVsZC5cbiAqXG4gKiAyLiBKdXN0IGEgc2VxdWVuY2UgKEN1cnNvciwgYXJyYXksIG51bGwsIG9yIHVuZGVmaW5lZCkgbm90IHdyYXBwZWQgaW50byBhblxuICogICBvYmplY3QuIEluc2lkZSB0aGUgRWFjaCBib2R5LCB0aGUgY3VycmVudCBpdGVtIHdpbGwgYmUgc2V0IGFzIHRoZSBkYXRhXG4gKiAgIGNvbnRleHQuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjb250ZW50RnVuYyBBIEZ1bmN0aW9uIHRoYXQgcmV0dXJucyAgWypyZW5kZXJhYmxlXG4gKiBjb250ZW50Kl0oI1JlbmRlcmFibGUtQ29udGVudCkuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbZWxzZUZ1bmNdIEEgRnVuY3Rpb24gdGhhdCByZXR1cm5zIFsqcmVuZGVyYWJsZVxuICogY29udGVudCpdKCNSZW5kZXJhYmxlLUNvbnRlbnQpIHRvIGRpc3BsYXkgaW4gdGhlIGNhc2Ugd2hlbiB0aGVyZSBhcmUgbm8gaXRlbXNcbiAqIGluIHRoZSBzZXF1ZW5jZS5cbiAqL1xuQmxhemUuRWFjaCA9IGZ1bmN0aW9uIChhcmdGdW5jLCBjb250ZW50RnVuYywgZWxzZUZ1bmMpIHtcbiAgdmFyIGVhY2hWaWV3ID0gQmxhemUuVmlldygnZWFjaCcsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc3Vidmlld3MgPSB0aGlzLmluaXRpYWxTdWJ2aWV3cztcbiAgICB0aGlzLmluaXRpYWxTdWJ2aWV3cyA9IG51bGw7XG4gICAgaWYgKHRoaXMuX2lzQ3JlYXRlZEZvckV4cGFuc2lvbikge1xuICAgICAgdGhpcy5leHBhbmRlZFZhbHVlRGVwID0gbmV3IFRyYWNrZXIuRGVwZW5kZW5jeTtcbiAgICAgIHRoaXMuZXhwYW5kZWRWYWx1ZURlcC5kZXBlbmQoKTtcbiAgICB9XG4gICAgcmV0dXJuIHN1YnZpZXdzO1xuICB9KTtcbiAgZWFjaFZpZXcuaW5pdGlhbFN1YnZpZXdzID0gW107XG4gIGVhY2hWaWV3Lm51bUl0ZW1zID0gMDtcbiAgZWFjaFZpZXcuaW5FbHNlTW9kZSA9IGZhbHNlO1xuICBlYWNoVmlldy5zdG9wSGFuZGxlID0gbnVsbDtcbiAgZWFjaFZpZXcuY29udGVudEZ1bmMgPSBjb250ZW50RnVuYztcbiAgZWFjaFZpZXcuZWxzZUZ1bmMgPSBlbHNlRnVuYztcbiAgZWFjaFZpZXcuYXJnVmFyID0gbmV3IFJlYWN0aXZlVmFyO1xuICBlYWNoVmlldy52YXJpYWJsZU5hbWUgPSBudWxsO1xuXG4gIC8vIHVwZGF0ZSB0aGUgQGluZGV4IHZhbHVlIGluIHRoZSBzY29wZSBvZiBhbGwgc3Vidmlld3MgaW4gdGhlIHJhbmdlXG4gIHZhciB1cGRhdGVJbmRpY2VzID0gZnVuY3Rpb24gKGZyb20sIHRvKSB7XG4gICAgaWYgKHRvID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRvID0gZWFjaFZpZXcubnVtSXRlbXMgLSAxO1xuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSBmcm9tOyBpIDw9IHRvOyBpKyspIHtcbiAgICAgIHZhciB2aWV3ID0gZWFjaFZpZXcuX2RvbXJhbmdlLm1lbWJlcnNbaV0udmlldztcbiAgICAgIHZpZXcuX3Njb3BlQmluZGluZ3NbJ0BpbmRleCddLnNldChpKTtcbiAgICB9XG4gIH07XG5cbiAgZWFjaFZpZXcub25WaWV3Q3JlYXRlZChmdW5jdGlvbiAoKSB7XG4gICAgLy8gV2UgZXZhbHVhdGUgYXJnRnVuYyBpbiBhbiBhdXRvcnVuIHRvIG1ha2Ugc3VyZVxuICAgIC8vIEJsYXplLmN1cnJlbnRWaWV3IGlzIGFsd2F5cyBzZXQgd2hlbiBpdCBydW5zIChyYXRoZXIgdGhhblxuICAgIC8vIHBhc3NpbmcgYXJnRnVuYyBzdHJhaWdodCB0byBPYnNlcnZlU2VxdWVuY2UpLlxuICAgIGVhY2hWaWV3LmF1dG9ydW4oZnVuY3Rpb24gKCkge1xuICAgICAgLy8gYXJnRnVuYyBjYW4gcmV0dXJuIGVpdGhlciBhIHNlcXVlbmNlIGFzIGlzIG9yIGEgd3JhcHBlciBvYmplY3Qgd2l0aCBhXG4gICAgICAvLyBfc2VxdWVuY2UgYW5kIF92YXJpYWJsZSBmaWVsZHMgc2V0LlxuICAgICAgdmFyIGFyZyA9IGFyZ0Z1bmMoKTtcbiAgICAgIGlmIChfLmlzT2JqZWN0KGFyZykgJiYgXy5oYXMoYXJnLCAnX3NlcXVlbmNlJykpIHtcbiAgICAgICAgZWFjaFZpZXcudmFyaWFibGVOYW1lID0gYXJnLl92YXJpYWJsZSB8fCBudWxsO1xuICAgICAgICBhcmcgPSBhcmcuX3NlcXVlbmNlO1xuICAgICAgfVxuXG4gICAgICBlYWNoVmlldy5hcmdWYXIuc2V0KGFyZyk7XG4gICAgfSwgZWFjaFZpZXcucGFyZW50VmlldywgJ2NvbGxlY3Rpb24nKTtcblxuICAgIGVhY2hWaWV3LnN0b3BIYW5kbGUgPSBPYnNlcnZlU2VxdWVuY2Uub2JzZXJ2ZShmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gZWFjaFZpZXcuYXJnVmFyLmdldCgpO1xuICAgIH0sIHtcbiAgICAgIGFkZGVkQXQ6IGZ1bmN0aW9uIChpZCwgaXRlbSwgaW5kZXgpIHtcbiAgICAgICAgVHJhY2tlci5ub25yZWFjdGl2ZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdmFyIG5ld0l0ZW1WaWV3O1xuICAgICAgICAgIGlmIChlYWNoVmlldy52YXJpYWJsZU5hbWUpIHtcbiAgICAgICAgICAgIC8vIG5ldy1zdHlsZSAjZWFjaCAoYXMgaW4ge3sjZWFjaCBpdGVtIGluIGl0ZW1zfX0pXG4gICAgICAgICAgICAvLyBkb2Vzbid0IGNyZWF0ZSBhIG5ldyBkYXRhIGNvbnRleHRcbiAgICAgICAgICAgIG5ld0l0ZW1WaWV3ID0gQmxhemUuVmlldygnaXRlbScsIGVhY2hWaWV3LmNvbnRlbnRGdW5jKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3SXRlbVZpZXcgPSBCbGF6ZS5XaXRoKGl0ZW0sIGVhY2hWaWV3LmNvbnRlbnRGdW5jKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBlYWNoVmlldy5udW1JdGVtcysrO1xuXG4gICAgICAgICAgdmFyIGJpbmRpbmdzID0ge307XG4gICAgICAgICAgYmluZGluZ3NbJ0BpbmRleCddID0gaW5kZXg7XG4gICAgICAgICAgaWYgKGVhY2hWaWV3LnZhcmlhYmxlTmFtZSkge1xuICAgICAgICAgICAgYmluZGluZ3NbZWFjaFZpZXcudmFyaWFibGVOYW1lXSA9IGl0ZW07XG4gICAgICAgICAgfVxuICAgICAgICAgIEJsYXplLl9hdHRhY2hCaW5kaW5nc1RvVmlldyhiaW5kaW5ncywgbmV3SXRlbVZpZXcpO1xuXG4gICAgICAgICAgaWYgKGVhY2hWaWV3LmV4cGFuZGVkVmFsdWVEZXApIHtcbiAgICAgICAgICAgIGVhY2hWaWV3LmV4cGFuZGVkVmFsdWVEZXAuY2hhbmdlZCgpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZWFjaFZpZXcuX2RvbXJhbmdlKSB7XG4gICAgICAgICAgICBpZiAoZWFjaFZpZXcuaW5FbHNlTW9kZSkge1xuICAgICAgICAgICAgICBlYWNoVmlldy5fZG9tcmFuZ2UucmVtb3ZlTWVtYmVyKDApO1xuICAgICAgICAgICAgICBlYWNoVmlldy5pbkVsc2VNb2RlID0gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciByYW5nZSA9IEJsYXplLl9tYXRlcmlhbGl6ZVZpZXcobmV3SXRlbVZpZXcsIGVhY2hWaWV3KTtcbiAgICAgICAgICAgIGVhY2hWaWV3Ll9kb21yYW5nZS5hZGRNZW1iZXIocmFuZ2UsIGluZGV4KTtcbiAgICAgICAgICAgIHVwZGF0ZUluZGljZXMoaW5kZXgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlYWNoVmlldy5pbml0aWFsU3Vidmlld3Muc3BsaWNlKGluZGV4LCAwLCBuZXdJdGVtVmlldyk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICByZW1vdmVkQXQ6IGZ1bmN0aW9uIChpZCwgaXRlbSwgaW5kZXgpIHtcbiAgICAgICAgVHJhY2tlci5ub25yZWFjdGl2ZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgZWFjaFZpZXcubnVtSXRlbXMtLTtcbiAgICAgICAgICBpZiAoZWFjaFZpZXcuZXhwYW5kZWRWYWx1ZURlcCkge1xuICAgICAgICAgICAgZWFjaFZpZXcuZXhwYW5kZWRWYWx1ZURlcC5jaGFuZ2VkKCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChlYWNoVmlldy5fZG9tcmFuZ2UpIHtcbiAgICAgICAgICAgIGVhY2hWaWV3Ll9kb21yYW5nZS5yZW1vdmVNZW1iZXIoaW5kZXgpO1xuICAgICAgICAgICAgdXBkYXRlSW5kaWNlcyhpbmRleCk7XG4gICAgICAgICAgICBpZiAoZWFjaFZpZXcuZWxzZUZ1bmMgJiYgZWFjaFZpZXcubnVtSXRlbXMgPT09IDApIHtcbiAgICAgICAgICAgICAgZWFjaFZpZXcuaW5FbHNlTW9kZSA9IHRydWU7XG4gICAgICAgICAgICAgIGVhY2hWaWV3Ll9kb21yYW5nZS5hZGRNZW1iZXIoXG4gICAgICAgICAgICAgICAgQmxhemUuX21hdGVyaWFsaXplVmlldyhcbiAgICAgICAgICAgICAgICAgIEJsYXplLlZpZXcoJ2VhY2hfZWxzZScsZWFjaFZpZXcuZWxzZUZ1bmMpLFxuICAgICAgICAgICAgICAgICAgZWFjaFZpZXcpLCAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZWFjaFZpZXcuaW5pdGlhbFN1YnZpZXdzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBjaGFuZ2VkQXQ6IGZ1bmN0aW9uIChpZCwgbmV3SXRlbSwgb2xkSXRlbSwgaW5kZXgpIHtcbiAgICAgICAgVHJhY2tlci5ub25yZWFjdGl2ZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKGVhY2hWaWV3LmV4cGFuZGVkVmFsdWVEZXApIHtcbiAgICAgICAgICAgIGVhY2hWaWV3LmV4cGFuZGVkVmFsdWVEZXAuY2hhbmdlZCgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgaXRlbVZpZXc7XG4gICAgICAgICAgICBpZiAoZWFjaFZpZXcuX2RvbXJhbmdlKSB7XG4gICAgICAgICAgICAgIGl0ZW1WaWV3ID0gZWFjaFZpZXcuX2RvbXJhbmdlLmdldE1lbWJlcihpbmRleCkudmlldztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGl0ZW1WaWV3ID0gZWFjaFZpZXcuaW5pdGlhbFN1YnZpZXdzW2luZGV4XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChlYWNoVmlldy52YXJpYWJsZU5hbWUpIHtcbiAgICAgICAgICAgICAgaXRlbVZpZXcuX3Njb3BlQmluZGluZ3NbZWFjaFZpZXcudmFyaWFibGVOYW1lXS5zZXQobmV3SXRlbSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBpdGVtVmlldy5kYXRhVmFyLnNldChuZXdJdGVtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIG1vdmVkVG86IGZ1bmN0aW9uIChpZCwgaXRlbSwgZnJvbUluZGV4LCB0b0luZGV4KSB7XG4gICAgICAgIFRyYWNrZXIubm9ucmVhY3RpdmUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmIChlYWNoVmlldy5leHBhbmRlZFZhbHVlRGVwKSB7XG4gICAgICAgICAgICBlYWNoVmlldy5leHBhbmRlZFZhbHVlRGVwLmNoYW5nZWQoKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGVhY2hWaWV3Ll9kb21yYW5nZSkge1xuICAgICAgICAgICAgZWFjaFZpZXcuX2RvbXJhbmdlLm1vdmVNZW1iZXIoZnJvbUluZGV4LCB0b0luZGV4KTtcbiAgICAgICAgICAgIHVwZGF0ZUluZGljZXMoXG4gICAgICAgICAgICAgIE1hdGgubWluKGZyb21JbmRleCwgdG9JbmRleCksIE1hdGgubWF4KGZyb21JbmRleCwgdG9JbmRleCkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgc3Vidmlld3MgPSBlYWNoVmlldy5pbml0aWFsU3Vidmlld3M7XG4gICAgICAgICAgICB2YXIgaXRlbVZpZXcgPSBzdWJ2aWV3c1tmcm9tSW5kZXhdO1xuICAgICAgICAgICAgc3Vidmlld3Muc3BsaWNlKGZyb21JbmRleCwgMSk7XG4gICAgICAgICAgICBzdWJ2aWV3cy5zcGxpY2UodG9JbmRleCwgMCwgaXRlbVZpZXcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAoZWFjaFZpZXcuZWxzZUZ1bmMgJiYgZWFjaFZpZXcubnVtSXRlbXMgPT09IDApIHtcbiAgICAgIGVhY2hWaWV3LmluRWxzZU1vZGUgPSB0cnVlO1xuICAgICAgZWFjaFZpZXcuaW5pdGlhbFN1YnZpZXdzWzBdID1cbiAgICAgICAgQmxhemUuVmlldygnZWFjaF9lbHNlJywgZWFjaFZpZXcuZWxzZUZ1bmMpO1xuICAgIH1cbiAgfSk7XG5cbiAgZWFjaFZpZXcub25WaWV3RGVzdHJveWVkKGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoZWFjaFZpZXcuc3RvcEhhbmRsZSlcbiAgICAgIGVhY2hWaWV3LnN0b3BIYW5kbGUuc3RvcCgpO1xuICB9KTtcblxuICByZXR1cm4gZWFjaFZpZXc7XG59O1xuXG5CbGF6ZS5fVGVtcGxhdGVXaXRoID0gZnVuY3Rpb24gKGFyZywgY29udGVudEZ1bmMpIHtcbiAgdmFyIHc7XG5cbiAgdmFyIGFyZ0Z1bmMgPSBhcmc7XG4gIGlmICh0eXBlb2YgYXJnICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgYXJnRnVuYyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBhcmc7XG4gICAgfTtcbiAgfVxuXG4gIC8vIFRoaXMgaXMgYSBsaXR0bGUgbWVzc3kuICBXaGVuIHdlIGNvbXBpbGUgYHt7PiBUZW1wbGF0ZS5jb250ZW50QmxvY2t9fWAsIHdlXG4gIC8vIHdyYXAgaXQgaW4gQmxhemUuX0luT3V0ZXJUZW1wbGF0ZVNjb3BlIGluIG9yZGVyIHRvIHNraXAgdGhlIGludGVybWVkaWF0ZVxuICAvLyBwYXJlbnQgVmlld3MgaW4gdGhlIGN1cnJlbnQgdGVtcGxhdGUuICBIb3dldmVyLCB3aGVuIHRoZXJlJ3MgYW4gYXJndW1lbnRcbiAgLy8gKGB7ez4gVGVtcGxhdGUuY29udGVudEJsb2NrIGFyZ319YCksIHRoZSBhcmd1bWVudCBuZWVkcyB0byBiZSBldmFsdWF0ZWRcbiAgLy8gaW4gdGhlIG9yaWdpbmFsIHNjb3BlLiAgVGhlcmUncyBubyBnb29kIG9yZGVyIHRvIG5lc3RcbiAgLy8gQmxhemUuX0luT3V0ZXJUZW1wbGF0ZVNjb3BlIGFuZCBTcGFjZWJhcnMuVGVtcGxhdGVXaXRoIHRvIGFjaGlldmUgdGhpcyxcbiAgLy8gc28gd2Ugd3JhcCBhcmdGdW5jIHRvIHJ1biBpdCBpbiB0aGUgXCJvcmlnaW5hbCBwYXJlbnRWaWV3XCIgb2YgdGhlXG4gIC8vIEJsYXplLl9Jbk91dGVyVGVtcGxhdGVTY29wZS5cbiAgLy9cbiAgLy8gVG8gbWFrZSB0aGlzIGJldHRlciwgcmVjb25zaWRlciBfSW5PdXRlclRlbXBsYXRlU2NvcGUgYXMgYSBwcmltaXRpdmUuXG4gIC8vIExvbmdlciB0ZXJtLCBldmFsdWF0ZSBleHByZXNzaW9ucyBpbiB0aGUgcHJvcGVyIGxleGljYWwgc2NvcGUuXG4gIHZhciB3cmFwcGVkQXJnRnVuYyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdmlld1RvRXZhbHVhdGVBcmcgPSBudWxsO1xuICAgIGlmICh3LnBhcmVudFZpZXcgJiYgdy5wYXJlbnRWaWV3Lm5hbWUgPT09ICdJbk91dGVyVGVtcGxhdGVTY29wZScpIHtcbiAgICAgIHZpZXdUb0V2YWx1YXRlQXJnID0gdy5wYXJlbnRWaWV3Lm9yaWdpbmFsUGFyZW50VmlldztcbiAgICB9XG4gICAgaWYgKHZpZXdUb0V2YWx1YXRlQXJnKSB7XG4gICAgICByZXR1cm4gQmxhemUuX3dpdGhDdXJyZW50Vmlldyh2aWV3VG9FdmFsdWF0ZUFyZywgYXJnRnVuYyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBhcmdGdW5jKCk7XG4gICAgfVxuICB9O1xuXG4gIHZhciB3cmFwcGVkQ29udGVudEZ1bmMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNvbnRlbnQgPSBjb250ZW50RnVuYy5jYWxsKHRoaXMpO1xuXG4gICAgLy8gU2luY2Ugd2UgYXJlIGdlbmVyYXRpbmcgdGhlIEJsYXplLl9UZW1wbGF0ZVdpdGggdmlldyBmb3IgdGhlXG4gICAgLy8gdXNlciwgc2V0IHRoZSBmbGFnIG9uIHRoZSBjaGlsZCB2aWV3LiAgSWYgYGNvbnRlbnRgIGlzIGEgdGVtcGxhdGUsXG4gICAgLy8gY29uc3RydWN0IHRoZSBWaWV3IHNvIHRoYXQgd2UgY2FuIHNldCB0aGUgZmxhZy5cbiAgICBpZiAoY29udGVudCBpbnN0YW5jZW9mIEJsYXplLlRlbXBsYXRlKSB7XG4gICAgICBjb250ZW50ID0gY29udGVudC5jb25zdHJ1Y3RWaWV3KCk7XG4gICAgfVxuICAgIGlmIChjb250ZW50IGluc3RhbmNlb2YgQmxhemUuVmlldykge1xuICAgICAgY29udGVudC5faGFzR2VuZXJhdGVkUGFyZW50ID0gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gY29udGVudDtcbiAgfTtcblxuICB3ID0gQmxhemUuV2l0aCh3cmFwcGVkQXJnRnVuYywgd3JhcHBlZENvbnRlbnRGdW5jKTtcbiAgdy5fX2lzVGVtcGxhdGVXaXRoID0gdHJ1ZTtcbiAgcmV0dXJuIHc7XG59O1xuXG5CbGF6ZS5fSW5PdXRlclRlbXBsYXRlU2NvcGUgPSBmdW5jdGlvbiAodGVtcGxhdGVWaWV3LCBjb250ZW50RnVuYykge1xuICB2YXIgdmlldyA9IEJsYXplLlZpZXcoJ0luT3V0ZXJUZW1wbGF0ZVNjb3BlJywgY29udGVudEZ1bmMpO1xuICB2YXIgcGFyZW50VmlldyA9IHRlbXBsYXRlVmlldy5wYXJlbnRWaWV3O1xuXG4gIC8vIEhhY2sgc28gdGhhdCBpZiB5b3UgY2FsbCBge3s+IGZvbyBiYXJ9fWAgYW5kIGl0IGV4cGFuZHMgaW50b1xuICAvLyBge3sjd2l0aCBiYXJ9fXt7PiBmb299fXt7L3dpdGh9fWAsIGFuZCB0aGVuIGBmb29gIGlzIGEgdGVtcGxhdGVcbiAgLy8gdGhhdCBpbnNlcnRzIGB7ez4gVGVtcGxhdGUuY29udGVudEJsb2NrfX1gLCB0aGUgZGF0YSBjb250ZXh0IGZvclxuICAvLyBgVGVtcGxhdGUuY29udGVudEJsb2NrYCBpcyBub3QgYGJhcmAgYnV0IHRoZSBvbmUgZW5jbG9zaW5nIHRoYXQuXG4gIGlmIChwYXJlbnRWaWV3Ll9faXNUZW1wbGF0ZVdpdGgpXG4gICAgcGFyZW50VmlldyA9IHBhcmVudFZpZXcucGFyZW50VmlldztcblxuICB2aWV3Lm9uVmlld0NyZWF0ZWQoZnVuY3Rpb24gKCkge1xuICAgIHRoaXMub3JpZ2luYWxQYXJlbnRWaWV3ID0gdGhpcy5wYXJlbnRWaWV3O1xuICAgIHRoaXMucGFyZW50VmlldyA9IHBhcmVudFZpZXc7XG4gICAgdGhpcy5fX2NoaWxkRG9lc250U3RhcnROZXdMZXhpY2FsU2NvcGUgPSB0cnVlO1xuICB9KTtcbiAgcmV0dXJuIHZpZXc7XG59O1xuXG4vLyBYWFggQ09NUEFUIFdJVEggMC45LjBcbkJsYXplLkluT3V0ZXJUZW1wbGF0ZVNjb3BlID0gQmxhemUuX0luT3V0ZXJUZW1wbGF0ZVNjb3BlO1xuIiwiQmxhemUuX2dsb2JhbEhlbHBlcnMgPSB7fTtcblxuLy8gRG9jdW1lbnRlZCBhcyBUZW1wbGF0ZS5yZWdpc3RlckhlbHBlci5cbi8vIFRoaXMgZGVmaW5pdGlvbiBhbHNvIHByb3ZpZGVzIGJhY2stY29tcGF0IGZvciBgVUkucmVnaXN0ZXJIZWxwZXJgLlxuQmxhemUucmVnaXN0ZXJIZWxwZXIgPSBmdW5jdGlvbiAobmFtZSwgZnVuYykge1xuICBCbGF6ZS5fZ2xvYmFsSGVscGVyc1tuYW1lXSA9IGZ1bmM7XG59O1xuXG4vLyBBbHNvIGRvY3VtZW50ZWQgYXMgVGVtcGxhdGUuZGVyZWdpc3RlckhlbHBlclxuQmxhemUuZGVyZWdpc3RlckhlbHBlciA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgZGVsZXRlIEJsYXplLl9nbG9iYWxIZWxwZXJzW25hbWVdO1xufTtcblxudmFyIGJpbmRJZklzRnVuY3Rpb24gPSBmdW5jdGlvbiAoeCwgdGFyZ2V0KSB7XG4gIGlmICh0eXBlb2YgeCAhPT0gJ2Z1bmN0aW9uJylcbiAgICByZXR1cm4geDtcbiAgcmV0dXJuIEJsYXplLl9iaW5kKHgsIHRhcmdldCk7XG59O1xuXG4vLyBJZiBgeGAgaXMgYSBmdW5jdGlvbiwgYmluZHMgdGhlIHZhbHVlIG9mIGB0aGlzYCBmb3IgdGhhdCBmdW5jdGlvblxuLy8gdG8gdGhlIGN1cnJlbnQgZGF0YSBjb250ZXh0LlxudmFyIGJpbmREYXRhQ29udGV4dCA9IGZ1bmN0aW9uICh4KSB7XG4gIGlmICh0eXBlb2YgeCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgZGF0YSA9IEJsYXplLmdldERhdGEoKTtcbiAgICAgIGlmIChkYXRhID09IG51bGwpXG4gICAgICAgIGRhdGEgPSB7fTtcbiAgICAgIHJldHVybiB4LmFwcGx5KGRhdGEsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgfVxuICByZXR1cm4geDtcbn07XG5cbkJsYXplLl9PTERTVFlMRV9IRUxQRVIgPSB7fTtcblxuQmxhemUuX2dldFRlbXBsYXRlSGVscGVyID0gZnVuY3Rpb24gKHRlbXBsYXRlLCBuYW1lLCB0bXBsSW5zdGFuY2VGdW5jKSB7XG4gIC8vIFhYWCBDT01QQVQgV0lUSCAwLjkuM1xuICB2YXIgaXNLbm93bk9sZFN0eWxlSGVscGVyID0gZmFsc2U7XG5cbiAgaWYgKHRlbXBsYXRlLl9faGVscGVycy5oYXMobmFtZSkpIHtcbiAgICB2YXIgaGVscGVyID0gdGVtcGxhdGUuX19oZWxwZXJzLmdldChuYW1lKTtcbiAgICBpZiAoaGVscGVyID09PSBCbGF6ZS5fT0xEU1RZTEVfSEVMUEVSKSB7XG4gICAgICBpc0tub3duT2xkU3R5bGVIZWxwZXIgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAoaGVscGVyICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB3cmFwSGVscGVyKGJpbmREYXRhQ29udGV4dChoZWxwZXIpLCB0bXBsSW5zdGFuY2VGdW5jKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG5cbiAgLy8gb2xkLXN0eWxlIGhlbHBlclxuICBpZiAobmFtZSBpbiB0ZW1wbGF0ZSkge1xuICAgIC8vIE9ubHkgd2FybiBvbmNlIHBlciBoZWxwZXJcbiAgICBpZiAoISBpc0tub3duT2xkU3R5bGVIZWxwZXIpIHtcbiAgICAgIHRlbXBsYXRlLl9faGVscGVycy5zZXQobmFtZSwgQmxhemUuX09MRFNUWUxFX0hFTFBFUik7XG4gICAgICBpZiAoISB0ZW1wbGF0ZS5fTk9XQVJOX09MRFNUWUxFX0hFTFBFUlMpIHtcbiAgICAgICAgQmxhemUuX3dhcm4oJ0Fzc2lnbmluZyBoZWxwZXIgd2l0aCBgJyArIHRlbXBsYXRlLnZpZXdOYW1lICsgJy4nICtcbiAgICAgICAgICAgICAgICAgICAgbmFtZSArICcgPSAuLi5gIGlzIGRlcHJlY2F0ZWQuICBVc2UgYCcgKyB0ZW1wbGF0ZS52aWV3TmFtZSArXG4gICAgICAgICAgICAgICAgICAgICcuaGVscGVycyguLi4pYCBpbnN0ZWFkLicpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGVtcGxhdGVbbmFtZV0gIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHdyYXBIZWxwZXIoYmluZERhdGFDb250ZXh0KHRlbXBsYXRlW25hbWVdKSwgdG1wbEluc3RhbmNlRnVuYyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59O1xuXG52YXIgd3JhcEhlbHBlciA9IGZ1bmN0aW9uIChmLCB0ZW1wbGF0ZUZ1bmMpIHtcbiAgaWYgKHR5cGVvZiBmICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICByZXR1cm4gZjtcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuXG4gICAgcmV0dXJuIEJsYXplLlRlbXBsYXRlLl93aXRoVGVtcGxhdGVJbnN0YW5jZUZ1bmModGVtcGxhdGVGdW5jLCBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gQmxhemUuX3dyYXBDYXRjaGluZ0V4Y2VwdGlvbnMoZiwgJ3RlbXBsYXRlIGhlbHBlcicpLmFwcGx5KHNlbGYsIGFyZ3MpO1xuICAgIH0pO1xuICB9O1xufTtcblxuQmxhemUuX2xleGljYWxCaW5kaW5nTG9va3VwID0gZnVuY3Rpb24gKHZpZXcsIG5hbWUpIHtcbiAgdmFyIGN1cnJlbnRWaWV3ID0gdmlldztcbiAgdmFyIGJsb2NrSGVscGVyc1N0YWNrID0gW107XG5cbiAgLy8gd2FsayB1cCB0aGUgdmlld3Mgc3RvcHBpbmcgYXQgYSBTcGFjZWJhcnMuaW5jbHVkZSBvciBUZW1wbGF0ZSB2aWV3IHRoYXRcbiAgLy8gZG9lc24ndCBoYXZlIGFuIEluT3V0ZXJUZW1wbGF0ZVNjb3BlIHZpZXcgYXMgYSBwYXJlbnRcbiAgZG8ge1xuICAgIC8vIHNraXAgYmxvY2sgaGVscGVycyB2aWV3c1xuICAgIC8vIGlmIHdlIGZvdW5kIHRoZSBiaW5kaW5nIG9uIHRoZSBzY29wZSwgcmV0dXJuIGl0XG4gICAgaWYgKF8uaGFzKGN1cnJlbnRWaWV3Ll9zY29wZUJpbmRpbmdzLCBuYW1lKSkge1xuICAgICAgdmFyIGJpbmRpbmdSZWFjdGl2ZVZhciA9IGN1cnJlbnRWaWV3Ll9zY29wZUJpbmRpbmdzW25hbWVdO1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGJpbmRpbmdSZWFjdGl2ZVZhci5nZXQoKTtcbiAgICAgIH07XG4gICAgfVxuICB9IHdoaWxlICghIChjdXJyZW50Vmlldy5fX3N0YXJ0c05ld0xleGljYWxTY29wZSAmJlxuICAgICAgICAgICAgICAhIChjdXJyZW50Vmlldy5wYXJlbnRWaWV3ICYmXG4gICAgICAgICAgICAgICAgIGN1cnJlbnRWaWV3LnBhcmVudFZpZXcuX19jaGlsZERvZXNudFN0YXJ0TmV3TGV4aWNhbFNjb3BlKSlcbiAgICAgICAgICAgJiYgKGN1cnJlbnRWaWV3ID0gY3VycmVudFZpZXcucGFyZW50VmlldykpO1xuXG4gIHJldHVybiBudWxsO1xufTtcblxuLy8gdGVtcGxhdGVJbnN0YW5jZSBhcmd1bWVudCBpcyBwcm92aWRlZCB0byBiZSBhdmFpbGFibGUgZm9yIHBvc3NpYmxlXG4vLyBhbHRlcm5hdGl2ZSBpbXBsZW1lbnRhdGlvbnMgb2YgdGhpcyBmdW5jdGlvbiBieSAzcmQgcGFydHkgcGFja2FnZXMuXG5CbGF6ZS5fZ2V0VGVtcGxhdGUgPSBmdW5jdGlvbiAobmFtZSwgdGVtcGxhdGVJbnN0YW5jZSkge1xuICBpZiAoKG5hbWUgaW4gQmxhemUuVGVtcGxhdGUpICYmIChCbGF6ZS5UZW1wbGF0ZVtuYW1lXSBpbnN0YW5jZW9mIEJsYXplLlRlbXBsYXRlKSkge1xuICAgIHJldHVybiBCbGF6ZS5UZW1wbGF0ZVtuYW1lXTtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn07XG5cbkJsYXplLl9nZXRHbG9iYWxIZWxwZXIgPSBmdW5jdGlvbiAobmFtZSwgdGVtcGxhdGVJbnN0YW5jZSkge1xuICBpZiAoQmxhemUuX2dsb2JhbEhlbHBlcnNbbmFtZV0gIT0gbnVsbCkge1xuICAgIHJldHVybiB3cmFwSGVscGVyKGJpbmREYXRhQ29udGV4dChCbGF6ZS5fZ2xvYmFsSGVscGVyc1tuYW1lXSksIHRlbXBsYXRlSW5zdGFuY2UpO1xuICB9XG4gIHJldHVybiBudWxsO1xufTtcblxuLy8gTG9va3MgdXAgYSBuYW1lLCBsaWtlIFwiZm9vXCIgb3IgXCIuLlwiLCBhcyBhIGhlbHBlciBvZiB0aGVcbi8vIGN1cnJlbnQgdGVtcGxhdGU7IHRoZSBuYW1lIG9mIGEgdGVtcGxhdGU7IGEgZ2xvYmFsIGhlbHBlcjtcbi8vIG9yIGEgcHJvcGVydHkgb2YgdGhlIGRhdGEgY29udGV4dC4gIENhbGxlZCBvbiB0aGUgVmlldyBvZlxuLy8gYSB0ZW1wbGF0ZSAoaS5lLiBhIFZpZXcgd2l0aCBhIGAudGVtcGxhdGVgIHByb3BlcnR5LFxuLy8gd2hlcmUgdGhlIGhlbHBlcnMgYXJlKS4gIFVzZWQgZm9yIHRoZSBmaXJzdCBuYW1lIGluIGFcbi8vIFwicGF0aFwiIGluIGEgdGVtcGxhdGUgdGFnLCBsaWtlIFwiZm9vXCIgaW4gYHt7Zm9vLmJhcn19YCBvclxuLy8gXCIuLlwiIGluIGB7e2Zyb2J1bGF0ZSAuLi9ibGFofX1gLlxuLy9cbi8vIFJldHVybnMgYSBmdW5jdGlvbiwgYSBub24tZnVuY3Rpb24gdmFsdWUsIG9yIG51bGwuICBJZlxuLy8gYSBmdW5jdGlvbiBpcyBmb3VuZCwgaXQgaXMgYm91bmQgYXBwcm9wcmlhdGVseS5cbi8vXG4vLyBOT1RFOiBUaGlzIGZ1bmN0aW9uIG11c3Qgbm90IGVzdGFibGlzaCBhbnkgcmVhY3RpdmVcbi8vIGRlcGVuZGVuY2llcyBpdHNlbGYuICBJZiB0aGVyZSBpcyBhbnkgcmVhY3Rpdml0eSBpbiB0aGVcbi8vIHZhbHVlLCBsb29rdXAgc2hvdWxkIHJldHVybiBhIGZ1bmN0aW9uLlxuQmxhemUuVmlldy5wcm90b3R5cGUubG9va3VwID0gZnVuY3Rpb24gKG5hbWUsIF9vcHRpb25zKSB7XG4gIHZhciB0ZW1wbGF0ZSA9IHRoaXMudGVtcGxhdGU7XG4gIHZhciBsb29rdXBUZW1wbGF0ZSA9IF9vcHRpb25zICYmIF9vcHRpb25zLnRlbXBsYXRlO1xuICB2YXIgaGVscGVyO1xuICB2YXIgYmluZGluZztcbiAgdmFyIGJvdW5kVG1wbEluc3RhbmNlO1xuICB2YXIgZm91bmRUZW1wbGF0ZTtcblxuICBpZiAodGhpcy50ZW1wbGF0ZUluc3RhbmNlKSB7XG4gICAgYm91bmRUbXBsSW5zdGFuY2UgPSBCbGF6ZS5fYmluZCh0aGlzLnRlbXBsYXRlSW5zdGFuY2UsIHRoaXMpO1xuICB9XG5cbiAgLy8gMC4gbG9va2luZyB1cCB0aGUgcGFyZW50IGRhdGEgY29udGV4dCB3aXRoIHRoZSBzcGVjaWFsIFwiLi4vXCIgc3ludGF4XG4gIGlmICgvXlxcLi8udGVzdChuYW1lKSkge1xuICAgIC8vIHN0YXJ0cyB3aXRoIGEgZG90LiBtdXN0IGJlIGEgc2VyaWVzIG9mIGRvdHMgd2hpY2ggbWFwcyB0byBhblxuICAgIC8vIGFuY2VzdG9yIG9mIHRoZSBhcHByb3ByaWF0ZSBoZWlnaHQuXG4gICAgaWYgKCEvXihcXC4pKyQvLnRlc3QobmFtZSkpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJpZCBzdGFydGluZyB3aXRoIGRvdCBtdXN0IGJlIGEgc2VyaWVzIG9mIGRvdHNcIik7XG5cbiAgICByZXR1cm4gQmxhemUuX3BhcmVudERhdGEobmFtZS5sZW5ndGggLSAxLCB0cnVlIC8qX2Z1bmN0aW9uV3JhcHBlZCovKTtcblxuICB9XG5cbiAgLy8gMS4gbG9vayB1cCBhIGhlbHBlciBvbiB0aGUgY3VycmVudCB0ZW1wbGF0ZVxuICBpZiAodGVtcGxhdGUgJiYgKChoZWxwZXIgPSBCbGF6ZS5fZ2V0VGVtcGxhdGVIZWxwZXIodGVtcGxhdGUsIG5hbWUsIGJvdW5kVG1wbEluc3RhbmNlKSkgIT0gbnVsbCkpIHtcbiAgICByZXR1cm4gaGVscGVyO1xuICB9XG5cbiAgLy8gMi4gbG9vayB1cCBhIGJpbmRpbmcgYnkgdHJhdmVyc2luZyB0aGUgbGV4aWNhbCB2aWV3IGhpZXJhcmNoeSBpbnNpZGUgdGhlXG4gIC8vIGN1cnJlbnQgdGVtcGxhdGVcbiAgaWYgKHRlbXBsYXRlICYmIChiaW5kaW5nID0gQmxhemUuX2xleGljYWxCaW5kaW5nTG9va3VwKEJsYXplLmN1cnJlbnRWaWV3LCBuYW1lKSkgIT0gbnVsbCkge1xuICAgIHJldHVybiBiaW5kaW5nO1xuICB9XG5cbiAgLy8gMy4gbG9vayB1cCBhIHRlbXBsYXRlIGJ5IG5hbWVcbiAgaWYgKGxvb2t1cFRlbXBsYXRlICYmICgoZm91bmRUZW1wbGF0ZSA9IEJsYXplLl9nZXRUZW1wbGF0ZShuYW1lLCBib3VuZFRtcGxJbnN0YW5jZSkpICE9IG51bGwpKSB7XG4gICAgcmV0dXJuIGZvdW5kVGVtcGxhdGU7XG4gIH1cblxuICAvLyA0LiBsb29rIHVwIGEgZ2xvYmFsIGhlbHBlclxuICBpZiAoKGhlbHBlciA9IEJsYXplLl9nZXRHbG9iYWxIZWxwZXIobmFtZSwgYm91bmRUbXBsSW5zdGFuY2UpKSAhPSBudWxsKSB7XG4gICAgcmV0dXJuIGhlbHBlcjtcbiAgfVxuXG4gIC8vIDUuIGxvb2sgdXAgaW4gYSBkYXRhIGNvbnRleHRcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaXNDYWxsZWRBc0Z1bmN0aW9uID0gKGFyZ3VtZW50cy5sZW5ndGggPiAwKTtcbiAgICB2YXIgZGF0YSA9IEJsYXplLmdldERhdGEoKTtcbiAgICB2YXIgeCA9IGRhdGEgJiYgZGF0YVtuYW1lXTtcbiAgICBpZiAoISB4KSB7XG4gICAgICBpZiAobG9va3VwVGVtcGxhdGUpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm8gc3VjaCB0ZW1wbGF0ZTogXCIgKyBuYW1lKTtcbiAgICAgIH0gZWxzZSBpZiAoaXNDYWxsZWRBc0Z1bmN0aW9uKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vIHN1Y2ggZnVuY3Rpb246IFwiICsgbmFtZSk7XG4gICAgICB9IGVsc2UgaWYgKG5hbWUuY2hhckF0KDApID09PSAnQCcgJiYgKCh4ID09PSBudWxsKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoeCA9PT0gdW5kZWZpbmVkKSkpIHtcbiAgICAgICAgLy8gVGhyb3cgYW4gZXJyb3IgaWYgdGhlIHVzZXIgdHJpZXMgdG8gdXNlIGEgYEBkaXJlY3RpdmVgXG4gICAgICAgIC8vIHRoYXQgZG9lc24ndCBleGlzdC4gIFdlIGRvbid0IGltcGxlbWVudCBhbGwgZGlyZWN0aXZlc1xuICAgICAgICAvLyBmcm9tIEhhbmRsZWJhcnMsIHNvIHRoZXJlJ3MgYSBwb3RlbnRpYWwgZm9yIGNvbmZ1c2lvblxuICAgICAgICAvLyBpZiB3ZSBmYWlsIHNpbGVudGx5LiAgT24gdGhlIG90aGVyIGhhbmQsIHdlIHdhbnQgdG9cbiAgICAgICAgLy8gdGhyb3cgbGF0ZSBpbiBjYXNlIHNvbWUgYXBwIG9yIHBhY2thZ2Ugd2FudHMgdG8gcHJvdmlkZVxuICAgICAgICAvLyBhIG1pc3NpbmcgZGlyZWN0aXZlLlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbnN1cHBvcnRlZCBkaXJlY3RpdmU6IFwiICsgbmFtZSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghIGRhdGEpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHggIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGlmIChpc0NhbGxlZEFzRnVuY3Rpb24pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2FuJ3QgY2FsbCBub24tZnVuY3Rpb246IFwiICsgeCk7XG4gICAgICB9XG4gICAgICByZXR1cm4geDtcbiAgICB9XG4gICAgcmV0dXJuIHguYXBwbHkoZGF0YSwgYXJndW1lbnRzKTtcbiAgfTtcbn07XG5cbi8vIEltcGxlbWVudCBTcGFjZWJhcnMnIHt7Li4vLi59fS5cbi8vIEBwYXJhbSBoZWlnaHQge051bWJlcn0gVGhlIG51bWJlciBvZiAnLi4nc1xuQmxhemUuX3BhcmVudERhdGEgPSBmdW5jdGlvbiAoaGVpZ2h0LCBfZnVuY3Rpb25XcmFwcGVkKSB7XG4gIC8vIElmIGhlaWdodCBpcyBudWxsIG9yIHVuZGVmaW5lZCwgd2UgZGVmYXVsdCB0byAxLCB0aGUgZmlyc3QgcGFyZW50LlxuICBpZiAoaGVpZ2h0ID09IG51bGwpIHtcbiAgICBoZWlnaHQgPSAxO1xuICB9XG4gIHZhciB0aGVXaXRoID0gQmxhemUuZ2V0Vmlldygnd2l0aCcpO1xuICBmb3IgKHZhciBpID0gMDsgKGkgPCBoZWlnaHQpICYmIHRoZVdpdGg7IGkrKykge1xuICAgIHRoZVdpdGggPSBCbGF6ZS5nZXRWaWV3KHRoZVdpdGgsICd3aXRoJyk7XG4gIH1cblxuICBpZiAoISB0aGVXaXRoKVxuICAgIHJldHVybiBudWxsO1xuICBpZiAoX2Z1bmN0aW9uV3JhcHBlZClcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhlV2l0aC5kYXRhVmFyLmdldCgpOyB9O1xuICByZXR1cm4gdGhlV2l0aC5kYXRhVmFyLmdldCgpO1xufTtcblxuXG5CbGF6ZS5WaWV3LnByb3RvdHlwZS5sb29rdXBUZW1wbGF0ZSA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gIHJldHVybiB0aGlzLmxvb2t1cChuYW1lLCB7dGVtcGxhdGU6dHJ1ZX0pO1xufTtcbiIsIi8vIFtuZXddIEJsYXplLlRlbXBsYXRlKFt2aWV3TmFtZV0sIHJlbmRlckZ1bmN0aW9uKVxuLy9cbi8vIGBCbGF6ZS5UZW1wbGF0ZWAgaXMgdGhlIGNsYXNzIG9mIHRlbXBsYXRlcywgbGlrZSBgVGVtcGxhdGUuZm9vYCBpblxuLy8gTWV0ZW9yLCB3aGljaCBpcyBgaW5zdGFuY2VvZiBUZW1wbGF0ZWAuXG4vL1xuLy8gYHZpZXdLaW5kYCBpcyBhIHN0cmluZyB0aGF0IGxvb2tzIGxpa2UgXCJUZW1wbGF0ZS5mb29cIiBmb3IgdGVtcGxhdGVzXG4vLyBkZWZpbmVkIGJ5IHRoZSBjb21waWxlci5cblxuLyoqXG4gKiBAY2xhc3NcbiAqIEBzdW1tYXJ5IENvbnN0cnVjdG9yIGZvciBhIFRlbXBsYXRlLCB3aGljaCBpcyB1c2VkIHRvIGNvbnN0cnVjdCBWaWV3cyB3aXRoIHBhcnRpY3VsYXIgbmFtZSBhbmQgY29udGVudC5cbiAqIEBsb2N1cyBDbGllbnRcbiAqIEBwYXJhbSB7U3RyaW5nfSBbdmlld05hbWVdIE9wdGlvbmFsLiAgQSBuYW1lIGZvciBWaWV3cyBjb25zdHJ1Y3RlZCBieSB0aGlzIFRlbXBsYXRlLiAgU2VlIFtgdmlldy5uYW1lYF0oI3ZpZXdfbmFtZSkuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSByZW5kZXJGdW5jdGlvbiBBIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBbKnJlbmRlcmFibGUgY29udGVudCpdKCNSZW5kZXJhYmxlLUNvbnRlbnQpLiAgVGhpcyBmdW5jdGlvbiBpcyB1c2VkIGFzIHRoZSBgcmVuZGVyRnVuY3Rpb25gIGZvciBWaWV3cyBjb25zdHJ1Y3RlZCBieSB0aGlzIFRlbXBsYXRlLlxuICovXG5CbGF6ZS5UZW1wbGF0ZSA9IGZ1bmN0aW9uICh2aWV3TmFtZSwgcmVuZGVyRnVuY3Rpb24pIHtcbiAgaWYgKCEgKHRoaXMgaW5zdGFuY2VvZiBCbGF6ZS5UZW1wbGF0ZSkpXG4gICAgLy8gY2FsbGVkIHdpdGhvdXQgYG5ld2BcbiAgICByZXR1cm4gbmV3IEJsYXplLlRlbXBsYXRlKHZpZXdOYW1lLCByZW5kZXJGdW5jdGlvbik7XG5cbiAgaWYgKHR5cGVvZiB2aWV3TmFtZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIC8vIG9taXR0ZWQgXCJ2aWV3TmFtZVwiIGFyZ3VtZW50XG4gICAgcmVuZGVyRnVuY3Rpb24gPSB2aWV3TmFtZTtcbiAgICB2aWV3TmFtZSA9ICcnO1xuICB9XG4gIGlmICh0eXBlb2Ygdmlld05hbWUgIT09ICdzdHJpbmcnKVxuICAgIHRocm93IG5ldyBFcnJvcihcInZpZXdOYW1lIG11c3QgYmUgYSBTdHJpbmcgKG9yIG9taXR0ZWQpXCIpO1xuICBpZiAodHlwZW9mIHJlbmRlckZ1bmN0aW9uICE9PSAnZnVuY3Rpb24nKVxuICAgIHRocm93IG5ldyBFcnJvcihcInJlbmRlckZ1bmN0aW9uIG11c3QgYmUgYSBmdW5jdGlvblwiKTtcblxuICB0aGlzLnZpZXdOYW1lID0gdmlld05hbWU7XG4gIHRoaXMucmVuZGVyRnVuY3Rpb24gPSByZW5kZXJGdW5jdGlvbjtcblxuICB0aGlzLl9faGVscGVycyA9IG5ldyBIZWxwZXJNYXA7XG4gIHRoaXMuX19ldmVudE1hcHMgPSBbXTtcblxuICB0aGlzLl9jYWxsYmFja3MgPSB7XG4gICAgY3JlYXRlZDogW10sXG4gICAgcmVuZGVyZWQ6IFtdLFxuICAgIGRlc3Ryb3llZDogW11cbiAgfTtcbn07XG52YXIgVGVtcGxhdGUgPSBCbGF6ZS5UZW1wbGF0ZTtcblxudmFyIEhlbHBlck1hcCA9IGZ1bmN0aW9uICgpIHt9O1xuSGVscGVyTWFwLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAobmFtZSkge1xuICByZXR1cm4gdGhpc1snICcrbmFtZV07XG59O1xuSGVscGVyTWFwLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiAobmFtZSwgaGVscGVyKSB7XG4gIHRoaXNbJyAnK25hbWVdID0gaGVscGVyO1xufTtcbkhlbHBlck1hcC5wcm90b3R5cGUuaGFzID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgcmV0dXJuICh0eXBlb2YgdGhpc1snICcrbmFtZV0gIT09ICd1bmRlZmluZWQnKTtcbn07XG5cbi8qKlxuICogQHN1bW1hcnkgUmV0dXJucyB0cnVlIGlmIGB2YWx1ZWAgaXMgYSB0ZW1wbGF0ZSBvYmplY3QgbGlrZSBgVGVtcGxhdGUubXlUZW1wbGF0ZWAuXG4gKiBAbG9jdXMgQ2xpZW50XG4gKiBAcGFyYW0ge0FueX0gdmFsdWUgVGhlIHZhbHVlIHRvIHRlc3QuXG4gKi9cbkJsYXplLmlzVGVtcGxhdGUgPSBmdW5jdGlvbiAodCkge1xuICByZXR1cm4gKHQgaW5zdGFuY2VvZiBCbGF6ZS5UZW1wbGF0ZSk7XG59O1xuXG4vKipcbiAqIEBuYW1lICBvbkNyZWF0ZWRcbiAqIEBpbnN0YW5jZVxuICogQG1lbWJlck9mIFRlbXBsYXRlXG4gKiBAc3VtbWFyeSBSZWdpc3RlciBhIGZ1bmN0aW9uIHRvIGJlIGNhbGxlZCB3aGVuIGFuIGluc3RhbmNlIG9mIHRoaXMgdGVtcGxhdGUgaXMgY3JlYXRlZC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIEEgZnVuY3Rpb24gdG8gYmUgYWRkZWQgYXMgYSBjYWxsYmFjay5cbiAqIEBsb2N1cyBDbGllbnRcbiAqIEBpbXBvcnRGcm9tUGFja2FnZSB0ZW1wbGF0aW5nXG4gKi9cblRlbXBsYXRlLnByb3RvdHlwZS5vbkNyZWF0ZWQgPSBmdW5jdGlvbiAoY2IpIHtcbiAgdGhpcy5fY2FsbGJhY2tzLmNyZWF0ZWQucHVzaChjYik7XG59O1xuXG4vKipcbiAqIEBuYW1lICBvblJlbmRlcmVkXG4gKiBAaW5zdGFuY2VcbiAqIEBtZW1iZXJPZiBUZW1wbGF0ZVxuICogQHN1bW1hcnkgUmVnaXN0ZXIgYSBmdW5jdGlvbiB0byBiZSBjYWxsZWQgd2hlbiBhbiBpbnN0YW5jZSBvZiB0aGlzIHRlbXBsYXRlIGlzIGluc2VydGVkIGludG8gdGhlIERPTS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIEEgZnVuY3Rpb24gdG8gYmUgYWRkZWQgYXMgYSBjYWxsYmFjay5cbiAqIEBsb2N1cyBDbGllbnRcbiAqIEBpbXBvcnRGcm9tUGFja2FnZSB0ZW1wbGF0aW5nXG4gKi9cblRlbXBsYXRlLnByb3RvdHlwZS5vblJlbmRlcmVkID0gZnVuY3Rpb24gKGNiKSB7XG4gIHRoaXMuX2NhbGxiYWNrcy5yZW5kZXJlZC5wdXNoKGNiKTtcbn07XG5cbi8qKlxuICogQG5hbWUgIG9uRGVzdHJveWVkXG4gKiBAaW5zdGFuY2VcbiAqIEBtZW1iZXJPZiBUZW1wbGF0ZVxuICogQHN1bW1hcnkgUmVnaXN0ZXIgYSBmdW5jdGlvbiB0byBiZSBjYWxsZWQgd2hlbiBhbiBpbnN0YW5jZSBvZiB0aGlzIHRlbXBsYXRlIGlzIHJlbW92ZWQgZnJvbSB0aGUgRE9NIGFuZCBkZXN0cm95ZWQuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBBIGZ1bmN0aW9uIHRvIGJlIGFkZGVkIGFzIGEgY2FsbGJhY2suXG4gKiBAbG9jdXMgQ2xpZW50XG4gKiBAaW1wb3J0RnJvbVBhY2thZ2UgdGVtcGxhdGluZ1xuICovXG5UZW1wbGF0ZS5wcm90b3R5cGUub25EZXN0cm95ZWQgPSBmdW5jdGlvbiAoY2IpIHtcbiAgdGhpcy5fY2FsbGJhY2tzLmRlc3Ryb3llZC5wdXNoKGNiKTtcbn07XG5cblRlbXBsYXRlLnByb3RvdHlwZS5fZ2V0Q2FsbGJhY2tzID0gZnVuY3Rpb24gKHdoaWNoKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdmFyIGNhbGxiYWNrcyA9IHNlbGZbd2hpY2hdID8gW3NlbGZbd2hpY2hdXSA6IFtdO1xuICAvLyBGaXJlIGFsbCBjYWxsYmFja3MgYWRkZWQgd2l0aCB0aGUgbmV3IEFQSSAoVGVtcGxhdGUub25SZW5kZXJlZCgpKVxuICAvLyBhcyB3ZWxsIGFzIHRoZSBvbGQtc3R5bGUgY2FsbGJhY2sgKGUuZy4gVGVtcGxhdGUucmVuZGVyZWQpIGZvclxuICAvLyBiYWNrd2FyZHMtY29tcGF0aWJpbGl0eS5cbiAgY2FsbGJhY2tzID0gY2FsbGJhY2tzLmNvbmNhdChzZWxmLl9jYWxsYmFja3Nbd2hpY2hdKTtcbiAgcmV0dXJuIGNhbGxiYWNrcztcbn07XG5cbnZhciBmaXJlQ2FsbGJhY2tzID0gZnVuY3Rpb24gKGNhbGxiYWNrcywgdGVtcGxhdGUpIHtcbiAgVGVtcGxhdGUuX3dpdGhUZW1wbGF0ZUluc3RhbmNlRnVuYyhcbiAgICBmdW5jdGlvbiAoKSB7IHJldHVybiB0ZW1wbGF0ZTsgfSxcbiAgICBmdW5jdGlvbiAoKSB7XG4gICAgICBmb3IgKHZhciBpID0gMCwgTiA9IGNhbGxiYWNrcy5sZW5ndGg7IGkgPCBOOyBpKyspIHtcbiAgICAgICAgY2FsbGJhY2tzW2ldLmNhbGwodGVtcGxhdGUpO1xuICAgICAgfVxuICAgIH0pO1xufTtcblxuVGVtcGxhdGUucHJvdG90eXBlLmNvbnN0cnVjdFZpZXcgPSBmdW5jdGlvbiAoY29udGVudEZ1bmMsIGVsc2VGdW5jKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdmFyIHZpZXcgPSBCbGF6ZS5WaWV3KHNlbGYudmlld05hbWUsIHNlbGYucmVuZGVyRnVuY3Rpb24pO1xuICB2aWV3LnRlbXBsYXRlID0gc2VsZjtcblxuICB2aWV3LnRlbXBsYXRlQ29udGVudEJsb2NrID0gKFxuICAgIGNvbnRlbnRGdW5jID8gbmV3IFRlbXBsYXRlKCcoY29udGVudEJsb2NrKScsIGNvbnRlbnRGdW5jKSA6IG51bGwpO1xuICB2aWV3LnRlbXBsYXRlRWxzZUJsb2NrID0gKFxuICAgIGVsc2VGdW5jID8gbmV3IFRlbXBsYXRlKCcoZWxzZUJsb2NrKScsIGVsc2VGdW5jKSA6IG51bGwpO1xuXG4gIGlmIChzZWxmLl9fZXZlbnRNYXBzIHx8IHR5cGVvZiBzZWxmLmV2ZW50cyA9PT0gJ29iamVjdCcpIHtcbiAgICB2aWV3Ll9vblZpZXdSZW5kZXJlZChmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAodmlldy5yZW5kZXJDb3VudCAhPT0gMSlcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICBpZiAoISBzZWxmLl9fZXZlbnRNYXBzLmxlbmd0aCAmJiB0eXBlb2Ygc2VsZi5ldmVudHMgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgLy8gUHJvdmlkZSBsaW1pdGVkIGJhY2stY29tcGF0IHN1cHBvcnQgZm9yIGAuZXZlbnRzID0gey4uLn1gXG4gICAgICAgIC8vIHN5bnRheC4gIFBhc3MgYHRlbXBsYXRlLmV2ZW50c2AgdG8gdGhlIG9yaWdpbmFsIGAuZXZlbnRzKC4uLilgXG4gICAgICAgIC8vIGZ1bmN0aW9uLiAgVGhpcyBjb2RlIG11c3QgcnVuIG9ubHkgb25jZSBwZXIgdGVtcGxhdGUsIGluXG4gICAgICAgIC8vIG9yZGVyIHRvIG5vdCBiaW5kIHRoZSBoYW5kbGVycyBtb3JlIHRoYW4gb25jZSwgd2hpY2ggaXNcbiAgICAgICAgLy8gZW5zdXJlZCBieSB0aGUgZmFjdCB0aGF0IHdlIG9ubHkgZG8gdGhpcyB3aGVuIGBfX2V2ZW50TWFwc2BcbiAgICAgICAgLy8gaXMgZmFsc3ksIGFuZCB3ZSBjYXVzZSBpdCB0byBiZSBzZXQgbm93LlxuICAgICAgICBUZW1wbGF0ZS5wcm90b3R5cGUuZXZlbnRzLmNhbGwoc2VsZiwgc2VsZi5ldmVudHMpO1xuICAgICAgfVxuXG4gICAgICBfLmVhY2goc2VsZi5fX2V2ZW50TWFwcywgZnVuY3Rpb24gKG0pIHtcbiAgICAgICAgQmxhemUuX2FkZEV2ZW50TWFwKHZpZXcsIG0sIHZpZXcpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICB2aWV3Ll90ZW1wbGF0ZUluc3RhbmNlID0gbmV3IEJsYXplLlRlbXBsYXRlSW5zdGFuY2Uodmlldyk7XG4gIHZpZXcudGVtcGxhdGVJbnN0YW5jZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAvLyBVcGRhdGUgZGF0YSwgZmlyc3ROb2RlLCBhbmQgbGFzdE5vZGUsIGFuZCByZXR1cm4gdGhlIFRlbXBsYXRlSW5zdGFuY2VcbiAgICAvLyBvYmplY3QuXG4gICAgdmFyIGluc3QgPSB2aWV3Ll90ZW1wbGF0ZUluc3RhbmNlO1xuXG4gICAgLyoqXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlck9mIEJsYXplLlRlbXBsYXRlSW5zdGFuY2VcbiAgICAgKiBAbmFtZSAgZGF0YVxuICAgICAqIEBzdW1tYXJ5IFRoZSBkYXRhIGNvbnRleHQgb2YgdGhpcyBpbnN0YW5jZSdzIGxhdGVzdCBpbnZvY2F0aW9uLlxuICAgICAqIEBsb2N1cyBDbGllbnRcbiAgICAgKi9cbiAgICBpbnN0LmRhdGEgPSBCbGF6ZS5nZXREYXRhKHZpZXcpO1xuXG4gICAgaWYgKHZpZXcuX2RvbXJhbmdlICYmICF2aWV3LmlzRGVzdHJveWVkKSB7XG4gICAgICBpbnN0LmZpcnN0Tm9kZSA9IHZpZXcuX2RvbXJhbmdlLmZpcnN0Tm9kZSgpO1xuICAgICAgaW5zdC5sYXN0Tm9kZSA9IHZpZXcuX2RvbXJhbmdlLmxhc3ROb2RlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIG9uICdjcmVhdGVkJyBvciAnZGVzdHJveWVkJyBjYWxsYmFja3Mgd2UgZG9uJ3QgaGF2ZSBhIERvbVJhbmdlXG4gICAgICBpbnN0LmZpcnN0Tm9kZSA9IG51bGw7XG4gICAgICBpbnN0Lmxhc3ROb2RlID0gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gaW5zdDtcbiAgfTtcblxuICAvKipcbiAgICogQG5hbWUgIGNyZWF0ZWRcbiAgICogQGluc3RhbmNlXG4gICAqIEBtZW1iZXJPZiBUZW1wbGF0ZVxuICAgKiBAc3VtbWFyeSBQcm92aWRlIGEgY2FsbGJhY2sgd2hlbiBhbiBpbnN0YW5jZSBvZiBhIHRlbXBsYXRlIGlzIGNyZWF0ZWQuXG4gICAqIEBsb2N1cyBDbGllbnRcbiAgICogQGRlcHJlY2F0ZWQgaW4gMS4xXG4gICAqL1xuICAvLyBUbyBhdm9pZCBzaXR1YXRpb25zIHdoZW4gbmV3IGNhbGxiYWNrcyBhcmUgYWRkZWQgaW4gYmV0d2VlbiB2aWV3XG4gIC8vIGluc3RhbnRpYXRpb24gYW5kIGV2ZW50IGJlaW5nIGZpcmVkLCBkZWNpZGUgb24gYWxsIGNhbGxiYWNrcyB0byBmaXJlXG4gIC8vIGltbWVkaWF0ZWx5IGFuZCB0aGVuIGZpcmUgdGhlbSBvbiB0aGUgZXZlbnQuXG4gIHZhciBjcmVhdGVkQ2FsbGJhY2tzID0gc2VsZi5fZ2V0Q2FsbGJhY2tzKCdjcmVhdGVkJyk7XG4gIHZpZXcub25WaWV3Q3JlYXRlZChmdW5jdGlvbiAoKSB7XG4gICAgZmlyZUNhbGxiYWNrcyhjcmVhdGVkQ2FsbGJhY2tzLCB2aWV3LnRlbXBsYXRlSW5zdGFuY2UoKSk7XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBAbmFtZSAgcmVuZGVyZWRcbiAgICogQGluc3RhbmNlXG4gICAqIEBtZW1iZXJPZiBUZW1wbGF0ZVxuICAgKiBAc3VtbWFyeSBQcm92aWRlIGEgY2FsbGJhY2sgd2hlbiBhbiBpbnN0YW5jZSBvZiBhIHRlbXBsYXRlIGlzIHJlbmRlcmVkLlxuICAgKiBAbG9jdXMgQ2xpZW50XG4gICAqIEBkZXByZWNhdGVkIGluIDEuMVxuICAgKi9cbiAgdmFyIHJlbmRlcmVkQ2FsbGJhY2tzID0gc2VsZi5fZ2V0Q2FsbGJhY2tzKCdyZW5kZXJlZCcpO1xuICB2aWV3Lm9uVmlld1JlYWR5KGZ1bmN0aW9uICgpIHtcbiAgICBmaXJlQ2FsbGJhY2tzKHJlbmRlcmVkQ2FsbGJhY2tzLCB2aWV3LnRlbXBsYXRlSW5zdGFuY2UoKSk7XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBAbmFtZSAgZGVzdHJveWVkXG4gICAqIEBpbnN0YW5jZVxuICAgKiBAbWVtYmVyT2YgVGVtcGxhdGVcbiAgICogQHN1bW1hcnkgUHJvdmlkZSBhIGNhbGxiYWNrIHdoZW4gYW4gaW5zdGFuY2Ugb2YgYSB0ZW1wbGF0ZSBpcyBkZXN0cm95ZWQuXG4gICAqIEBsb2N1cyBDbGllbnRcbiAgICogQGRlcHJlY2F0ZWQgaW4gMS4xXG4gICAqL1xuICB2YXIgZGVzdHJveWVkQ2FsbGJhY2tzID0gc2VsZi5fZ2V0Q2FsbGJhY2tzKCdkZXN0cm95ZWQnKTtcbiAgdmlldy5vblZpZXdEZXN0cm95ZWQoZnVuY3Rpb24gKCkge1xuICAgIGZpcmVDYWxsYmFja3MoZGVzdHJveWVkQ2FsbGJhY2tzLCB2aWV3LnRlbXBsYXRlSW5zdGFuY2UoKSk7XG4gIH0pO1xuXG4gIHJldHVybiB2aWV3O1xufTtcblxuLyoqXG4gKiBAY2xhc3NcbiAqIEBzdW1tYXJ5IFRoZSBjbGFzcyBmb3IgdGVtcGxhdGUgaW5zdGFuY2VzXG4gKiBAcGFyYW0ge0JsYXplLlZpZXd9IHZpZXdcbiAqIEBpbnN0YW5jZU5hbWUgdGVtcGxhdGVcbiAqL1xuQmxhemUuVGVtcGxhdGVJbnN0YW5jZSA9IGZ1bmN0aW9uICh2aWV3KSB7XG4gIGlmICghICh0aGlzIGluc3RhbmNlb2YgQmxhemUuVGVtcGxhdGVJbnN0YW5jZSkpXG4gICAgLy8gY2FsbGVkIHdpdGhvdXQgYG5ld2BcbiAgICByZXR1cm4gbmV3IEJsYXplLlRlbXBsYXRlSW5zdGFuY2Uodmlldyk7XG5cbiAgaWYgKCEgKHZpZXcgaW5zdGFuY2VvZiBCbGF6ZS5WaWV3KSlcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJWaWV3IHJlcXVpcmVkXCIpO1xuXG4gIHZpZXcuX3RlbXBsYXRlSW5zdGFuY2UgPSB0aGlzO1xuXG4gIC8qKlxuICAgKiBAbmFtZSB2aWV3XG4gICAqIEBtZW1iZXJPZiBCbGF6ZS5UZW1wbGF0ZUluc3RhbmNlXG4gICAqIEBpbnN0YW5jZVxuICAgKiBAc3VtbWFyeSBUaGUgW1ZpZXddKC4uL2FwaS9ibGF6ZS5odG1sI0JsYXplLVZpZXcpIG9iamVjdCBmb3IgdGhpcyBpbnZvY2F0aW9uIG9mIHRoZSB0ZW1wbGF0ZS5cbiAgICogQGxvY3VzIENsaWVudFxuICAgKiBAdHlwZSB7QmxhemUuVmlld31cbiAgICovXG4gIHRoaXMudmlldyA9IHZpZXc7XG4gIHRoaXMuZGF0YSA9IG51bGw7XG5cbiAgLyoqXG4gICAqIEBuYW1lIGZpcnN0Tm9kZVxuICAgKiBAbWVtYmVyT2YgQmxhemUuVGVtcGxhdGVJbnN0YW5jZVxuICAgKiBAaW5zdGFuY2VcbiAgICogQHN1bW1hcnkgVGhlIGZpcnN0IHRvcC1sZXZlbCBET00gbm9kZSBpbiB0aGlzIHRlbXBsYXRlIGluc3RhbmNlLlxuICAgKiBAbG9jdXMgQ2xpZW50XG4gICAqIEB0eXBlIHtET01Ob2RlfVxuICAgKi9cbiAgdGhpcy5maXJzdE5vZGUgPSBudWxsO1xuXG4gIC8qKlxuICAgKiBAbmFtZSBsYXN0Tm9kZVxuICAgKiBAbWVtYmVyT2YgQmxhemUuVGVtcGxhdGVJbnN0YW5jZVxuICAgKiBAaW5zdGFuY2VcbiAgICogQHN1bW1hcnkgVGhlIGxhc3QgdG9wLWxldmVsIERPTSBub2RlIGluIHRoaXMgdGVtcGxhdGUgaW5zdGFuY2UuXG4gICAqIEBsb2N1cyBDbGllbnRcbiAgICogQHR5cGUge0RPTU5vZGV9XG4gICAqL1xuICB0aGlzLmxhc3ROb2RlID0gbnVsbDtcblxuICAvLyBUaGlzIGRlcGVuZGVuY3kgaXMgdXNlZCB0byBpZGVudGlmeSBzdGF0ZSB0cmFuc2l0aW9ucyBpblxuICAvLyBfc3Vic2NyaXB0aW9uSGFuZGxlcyB3aGljaCBjb3VsZCBjYXVzZSB0aGUgcmVzdWx0IG9mXG4gIC8vIFRlbXBsYXRlSW5zdGFuY2Ujc3Vic2NyaXB0aW9uc1JlYWR5IHRvIGNoYW5nZS4gQmFzaWNhbGx5IHRoaXMgaXMgdHJpZ2dlcmVkXG4gIC8vIHdoZW5ldmVyIGEgbmV3IHN1YnNjcmlwdGlvbiBoYW5kbGUgaXMgYWRkZWQgb3Igd2hlbiBhIHN1YnNjcmlwdGlvbiBoYW5kbGVcbiAgLy8gaXMgcmVtb3ZlZCBhbmQgdGhleSBhcmUgbm90IHJlYWR5LlxuICB0aGlzLl9hbGxTdWJzUmVhZHlEZXAgPSBuZXcgVHJhY2tlci5EZXBlbmRlbmN5KCk7XG4gIHRoaXMuX2FsbFN1YnNSZWFkeSA9IGZhbHNlO1xuXG4gIHRoaXMuX3N1YnNjcmlwdGlvbkhhbmRsZXMgPSB7fTtcbn07XG5cbi8qKlxuICogQHN1bW1hcnkgRmluZCBhbGwgZWxlbWVudHMgbWF0Y2hpbmcgYHNlbGVjdG9yYCBpbiB0aGlzIHRlbXBsYXRlIGluc3RhbmNlLCBhbmQgcmV0dXJuIHRoZW0gYXMgYSBKUXVlcnkgb2JqZWN0LlxuICogQGxvY3VzIENsaWVudFxuICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yIFRoZSBDU1Mgc2VsZWN0b3IgdG8gbWF0Y2gsIHNjb3BlZCB0byB0aGUgdGVtcGxhdGUgY29udGVudHMuXG4gKiBAcmV0dXJucyB7RE9NTm9kZVtdfVxuICovXG5CbGF6ZS5UZW1wbGF0ZUluc3RhbmNlLnByb3RvdHlwZS4kID0gZnVuY3Rpb24gKHNlbGVjdG9yKSB7XG4gIHZhciB2aWV3ID0gdGhpcy52aWV3O1xuICBpZiAoISB2aWV3Ll9kb21yYW5nZSlcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW4ndCB1c2UgJCBvbiB0ZW1wbGF0ZSBpbnN0YW5jZSB3aXRoIG5vIERPTVwiKTtcbiAgcmV0dXJuIHZpZXcuX2RvbXJhbmdlLiQoc2VsZWN0b3IpO1xufTtcblxuLyoqXG4gKiBAc3VtbWFyeSBGaW5kIGFsbCBlbGVtZW50cyBtYXRjaGluZyBgc2VsZWN0b3JgIGluIHRoaXMgdGVtcGxhdGUgaW5zdGFuY2UuXG4gKiBAbG9jdXMgQ2xpZW50XG4gKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3IgVGhlIENTUyBzZWxlY3RvciB0byBtYXRjaCwgc2NvcGVkIHRvIHRoZSB0ZW1wbGF0ZSBjb250ZW50cy5cbiAqIEByZXR1cm5zIHtET01FbGVtZW50W119XG4gKi9cbkJsYXplLlRlbXBsYXRlSW5zdGFuY2UucHJvdG90eXBlLmZpbmRBbGwgPSBmdW5jdGlvbiAoc2VsZWN0b3IpIHtcbiAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHRoaXMuJChzZWxlY3RvcikpO1xufTtcblxuLyoqXG4gKiBAc3VtbWFyeSBGaW5kIG9uZSBlbGVtZW50IG1hdGNoaW5nIGBzZWxlY3RvcmAgaW4gdGhpcyB0ZW1wbGF0ZSBpbnN0YW5jZS5cbiAqIEBsb2N1cyBDbGllbnRcbiAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvciBUaGUgQ1NTIHNlbGVjdG9yIHRvIG1hdGNoLCBzY29wZWQgdG8gdGhlIHRlbXBsYXRlIGNvbnRlbnRzLlxuICogQHJldHVybnMge0RPTUVsZW1lbnR9XG4gKi9cbkJsYXplLlRlbXBsYXRlSW5zdGFuY2UucHJvdG90eXBlLmZpbmQgPSBmdW5jdGlvbiAoc2VsZWN0b3IpIHtcbiAgdmFyIHJlc3VsdCA9IHRoaXMuJChzZWxlY3Rvcik7XG4gIHJldHVybiByZXN1bHRbMF0gfHwgbnVsbDtcbn07XG5cbi8qKlxuICogQHN1bW1hcnkgQSB2ZXJzaW9uIG9mIFtUcmFja2VyLmF1dG9ydW5dKGh0dHBzOi8vZG9jcy5tZXRlb3IuY29tL2FwaS90cmFja2VyLmh0bWwjVHJhY2tlci1hdXRvcnVuKSB0aGF0IGlzIHN0b3BwZWQgd2hlbiB0aGUgdGVtcGxhdGUgaXMgZGVzdHJveWVkLlxuICogQGxvY3VzIENsaWVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gcnVuRnVuYyBUaGUgZnVuY3Rpb24gdG8gcnVuLiBJdCByZWNlaXZlcyBvbmUgYXJndW1lbnQ6IGEgVHJhY2tlci5Db21wdXRhdGlvbiBvYmplY3QuXG4gKi9cbkJsYXplLlRlbXBsYXRlSW5zdGFuY2UucHJvdG90eXBlLmF1dG9ydW4gPSBmdW5jdGlvbiAoZikge1xuICByZXR1cm4gdGhpcy52aWV3LmF1dG9ydW4oZik7XG59O1xuXG4vKipcbiAqIEBzdW1tYXJ5IEEgdmVyc2lvbiBvZiBbTWV0ZW9yLnN1YnNjcmliZV0oaHR0cHM6Ly9kb2NzLm1ldGVvci5jb20vYXBpL3B1YnN1Yi5odG1sI01ldGVvci1zdWJzY3JpYmUpIHRoYXQgaXMgc3RvcHBlZFxuICogd2hlbiB0aGUgdGVtcGxhdGUgaXMgZGVzdHJveWVkLlxuICogQHJldHVybiB7U3Vic2NyaXB0aW9uSGFuZGxlfSBUaGUgc3Vic2NyaXB0aW9uIGhhbmRsZSB0byB0aGUgbmV3bHkgbWFkZVxuICogc3Vic2NyaXB0aW9uLiBDYWxsIGBoYW5kbGUuc3RvcCgpYCB0byBtYW51YWxseSBzdG9wIHRoZSBzdWJzY3JpcHRpb24sIG9yXG4gKiBgaGFuZGxlLnJlYWR5KClgIHRvIGZpbmQgb3V0IGlmIHRoaXMgcGFydGljdWxhciBzdWJzY3JpcHRpb24gaGFzIGxvYWRlZCBhbGxcbiAqIG9mIGl0cyBpbml0YWwgZGF0YS5cbiAqIEBsb2N1cyBDbGllbnRcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIE5hbWUgb2YgdGhlIHN1YnNjcmlwdGlvbi4gIE1hdGNoZXMgdGhlIG5hbWUgb2YgdGhlXG4gKiBzZXJ2ZXIncyBgcHVibGlzaCgpYCBjYWxsLlxuICogQHBhcmFtIHtBbnl9IFthcmcxLGFyZzIuLi5dIE9wdGlvbmFsIGFyZ3VtZW50cyBwYXNzZWQgdG8gcHVibGlzaGVyIGZ1bmN0aW9uXG4gKiBvbiBzZXJ2ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufE9iamVjdH0gW29wdGlvbnNdIElmIGEgZnVuY3Rpb24gaXMgcGFzc2VkIGluc3RlYWQgb2YgYW5cbiAqIG9iamVjdCwgaXQgaXMgaW50ZXJwcmV0ZWQgYXMgYW4gYG9uUmVhZHlgIGNhbGxiYWNrLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdGlvbnMub25SZWFkeV0gUGFzc2VkIHRvIFtgTWV0ZW9yLnN1YnNjcmliZWBdKGh0dHBzOi8vZG9jcy5tZXRlb3IuY29tL2FwaS9wdWJzdWIuaHRtbCNNZXRlb3Itc3Vic2NyaWJlKS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRpb25zLm9uU3RvcF0gUGFzc2VkIHRvIFtgTWV0ZW9yLnN1YnNjcmliZWBdKGh0dHBzOi8vZG9jcy5tZXRlb3IuY29tL2FwaS9wdWJzdWIuaHRtbCNNZXRlb3Itc3Vic2NyaWJlKS5cbiAqIEBwYXJhbSB7RERQLkNvbm5lY3Rpb259IFtvcHRpb25zLmNvbm5lY3Rpb25dIFRoZSBjb25uZWN0aW9uIG9uIHdoaWNoIHRvIG1ha2UgdGhlXG4gKiBzdWJzY3JpcHRpb24uXG4gKi9cbkJsYXplLlRlbXBsYXRlSW5zdGFuY2UucHJvdG90eXBlLnN1YnNjcmliZSA9IGZ1bmN0aW9uICgvKiBhcmd1bWVudHMgKi8pIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIHZhciBzdWJIYW5kbGVzID0gc2VsZi5fc3Vic2NyaXB0aW9uSGFuZGxlcztcbiAgdmFyIGFyZ3MgPSBfLnRvQXJyYXkoYXJndW1lbnRzKTtcblxuICAvLyBEdXBsaWNhdGUgbG9naWMgZnJvbSBNZXRlb3Iuc3Vic2NyaWJlXG4gIHZhciBvcHRpb25zID0ge307XG4gIGlmIChhcmdzLmxlbmd0aCkge1xuICAgIHZhciBsYXN0UGFyYW0gPSBfLmxhc3QoYXJncyk7XG5cbiAgICAvLyBNYXRjaCBwYXR0ZXJuIHRvIGNoZWNrIGlmIHRoZSBsYXN0IGFyZyBpcyBhbiBvcHRpb25zIGFyZ3VtZW50XG4gICAgdmFyIGxhc3RQYXJhbU9wdGlvbnNQYXR0ZXJuID0ge1xuICAgICAgb25SZWFkeTogTWF0Y2guT3B0aW9uYWwoRnVuY3Rpb24pLFxuICAgICAgLy8gWFhYIENPTVBBVCBXSVRIIDEuMC4zLjEgb25FcnJvciB1c2VkIHRvIGV4aXN0LCBidXQgbm93IHdlIHVzZVxuICAgICAgLy8gb25TdG9wIHdpdGggYW4gZXJyb3IgY2FsbGJhY2sgaW5zdGVhZC5cbiAgICAgIG9uRXJyb3I6IE1hdGNoLk9wdGlvbmFsKEZ1bmN0aW9uKSxcbiAgICAgIG9uU3RvcDogTWF0Y2guT3B0aW9uYWwoRnVuY3Rpb24pLFxuICAgICAgY29ubmVjdGlvbjogTWF0Y2guT3B0aW9uYWwoTWF0Y2guQW55KVxuICAgIH07XG5cbiAgICBpZiAoXy5pc0Z1bmN0aW9uKGxhc3RQYXJhbSkpIHtcbiAgICAgIG9wdGlvbnMub25SZWFkeSA9IGFyZ3MucG9wKCk7XG4gICAgfSBlbHNlIGlmIChsYXN0UGFyYW0gJiYgISBfLmlzRW1wdHkobGFzdFBhcmFtKSAmJiBNYXRjaC50ZXN0KGxhc3RQYXJhbSwgbGFzdFBhcmFtT3B0aW9uc1BhdHRlcm4pKSB7XG4gICAgICBvcHRpb25zID0gYXJncy5wb3AoKTtcbiAgICB9XG4gIH1cblxuICB2YXIgc3ViSGFuZGxlO1xuICB2YXIgb2xkU3RvcHBlZCA9IG9wdGlvbnMub25TdG9wO1xuICBvcHRpb25zLm9uU3RvcCA9IGZ1bmN0aW9uIChlcnJvcikge1xuICAgIC8vIFdoZW4gdGhlIHN1YnNjcmlwdGlvbiBpcyBzdG9wcGVkLCByZW1vdmUgaXQgZnJvbSB0aGUgc2V0IG9mIHRyYWNrZWRcbiAgICAvLyBzdWJzY3JpcHRpb25zIHRvIGF2b2lkIHRoaXMgbGlzdCBncm93aW5nIHdpdGhvdXQgYm91bmRcbiAgICBkZWxldGUgc3ViSGFuZGxlc1tzdWJIYW5kbGUuc3Vic2NyaXB0aW9uSWRdO1xuXG4gICAgLy8gUmVtb3ZpbmcgYSBzdWJzY3JpcHRpb24gY2FuIG9ubHkgY2hhbmdlIHRoZSByZXN1bHQgb2Ygc3Vic2NyaXB0aW9uc1JlYWR5XG4gICAgLy8gaWYgd2UgYXJlIG5vdCByZWFkeSAodGhhdCBzdWJzY3JpcHRpb24gY291bGQgYmUgdGhlIG9uZSBibG9ja2luZyB1cyBiZWluZ1xuICAgIC8vIHJlYWR5KS5cbiAgICBpZiAoISBzZWxmLl9hbGxTdWJzUmVhZHkpIHtcbiAgICAgIHNlbGYuX2FsbFN1YnNSZWFkeURlcC5jaGFuZ2VkKCk7XG4gICAgfVxuXG4gICAgaWYgKG9sZFN0b3BwZWQpIHtcbiAgICAgIG9sZFN0b3BwZWQoZXJyb3IpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgY29ubmVjdGlvbiA9IG9wdGlvbnMuY29ubmVjdGlvbjtcbiAgdmFyIGNhbGxiYWNrcyA9IF8ucGljayhvcHRpb25zLCBbXCJvblJlYWR5XCIsIFwib25FcnJvclwiLCBcIm9uU3RvcFwiXSk7XG5cbiAgLy8gVGhlIGNhbGxiYWNrcyBhcmUgcGFzc2VkIGFzIHRoZSBsYXN0IGl0ZW0gaW4gdGhlIGFyZ3VtZW50cyBhcnJheSBwYXNzZWQgdG9cbiAgLy8gVmlldyNzdWJzY3JpYmVcbiAgYXJncy5wdXNoKGNhbGxiYWNrcyk7XG5cbiAgLy8gVmlldyNzdWJzY3JpYmUgdGFrZXMgdGhlIGNvbm5lY3Rpb24gYXMgb25lIG9mIHRoZSBvcHRpb25zIGluIHRoZSBsYXN0XG4gIC8vIGFyZ3VtZW50XG4gIHN1YkhhbmRsZSA9IHNlbGYudmlldy5zdWJzY3JpYmUuY2FsbChzZWxmLnZpZXcsIGFyZ3MsIHtcbiAgICBjb25uZWN0aW9uOiBjb25uZWN0aW9uXG4gIH0pO1xuXG4gIGlmICghIF8uaGFzKHN1YkhhbmRsZXMsIHN1YkhhbmRsZS5zdWJzY3JpcHRpb25JZCkpIHtcbiAgICBzdWJIYW5kbGVzW3N1YkhhbmRsZS5zdWJzY3JpcHRpb25JZF0gPSBzdWJIYW5kbGU7XG5cbiAgICAvLyBBZGRpbmcgYSBuZXcgc3Vic2NyaXB0aW9uIHdpbGwgYWx3YXlzIGNhdXNlIHVzIHRvIHRyYW5zaXRpb24gZnJvbSByZWFkeVxuICAgIC8vIHRvIG5vdCByZWFkeSwgYnV0IGlmIHdlIGFyZSBhbHJlYWR5IG5vdCByZWFkeSB0aGVuIHRoaXMgY2FuJ3QgbWFrZSB1c1xuICAgIC8vIHJlYWR5LlxuICAgIGlmIChzZWxmLl9hbGxTdWJzUmVhZHkpIHtcbiAgICAgIHNlbGYuX2FsbFN1YnNSZWFkeURlcC5jaGFuZ2VkKCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHN1YkhhbmRsZTtcbn07XG5cbi8qKlxuICogQHN1bW1hcnkgQSByZWFjdGl2ZSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdHJ1ZSB3aGVuIGFsbCBvZiB0aGUgc3Vic2NyaXB0aW9uc1xuICogY2FsbGVkIHdpdGggW3RoaXMuc3Vic2NyaWJlXSgjVGVtcGxhdGVJbnN0YW5jZS1zdWJzY3JpYmUpIGFyZSByZWFkeS5cbiAqIEByZXR1cm4ge0Jvb2xlYW59IFRydWUgaWYgYWxsIHN1YnNjcmlwdGlvbnMgb24gdGhpcyB0ZW1wbGF0ZSBpbnN0YW5jZSBhcmVcbiAqIHJlYWR5LlxuICovXG5CbGF6ZS5UZW1wbGF0ZUluc3RhbmNlLnByb3RvdHlwZS5zdWJzY3JpcHRpb25zUmVhZHkgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuX2FsbFN1YnNSZWFkeURlcC5kZXBlbmQoKTtcblxuICB0aGlzLl9hbGxTdWJzUmVhZHkgPSBfLmFsbCh0aGlzLl9zdWJzY3JpcHRpb25IYW5kbGVzLCBmdW5jdGlvbiAoaGFuZGxlKSB7XG4gICAgcmV0dXJuIGhhbmRsZS5yZWFkeSgpO1xuICB9KTtcblxuICByZXR1cm4gdGhpcy5fYWxsU3Vic1JlYWR5O1xufTtcblxuLyoqXG4gKiBAc3VtbWFyeSBTcGVjaWZ5IHRlbXBsYXRlIGhlbHBlcnMgYXZhaWxhYmxlIHRvIHRoaXMgdGVtcGxhdGUuXG4gKiBAbG9jdXMgQ2xpZW50XG4gKiBAcGFyYW0ge09iamVjdH0gaGVscGVycyBEaWN0aW9uYXJ5IG9mIGhlbHBlciBmdW5jdGlvbnMgYnkgbmFtZS5cbiAqIEBpbXBvcnRGcm9tUGFja2FnZSB0ZW1wbGF0aW5nXG4gKi9cblRlbXBsYXRlLnByb3RvdHlwZS5oZWxwZXJzID0gZnVuY3Rpb24gKGRpY3QpIHtcbiAgaWYgKCEgXy5pc09iamVjdChkaWN0KSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkhlbHBlcnMgZGljdGlvbmFyeSBoYXMgdG8gYmUgYW4gb2JqZWN0XCIpO1xuICB9XG5cbiAgZm9yICh2YXIgayBpbiBkaWN0KVxuICAgIHRoaXMuX19oZWxwZXJzLnNldChrLCBkaWN0W2tdKTtcbn07XG5cbnZhciBjYW5Vc2VHZXR0ZXJzID0gZnVuY3Rpb24oKSB7XG4gIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHtcbiAgICB2YXIgb2JqID0ge307XG4gICAgdHJ5IHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIFwic2VsZlwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gb2JqOyB9XG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiBvYmouc2VsZiA9PT0gb2JqO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn0oKTtcblxuaWYgKGNhblVzZUdldHRlcnMpIHtcbiAgLy8gTGlrZSBCbGF6ZS5jdXJyZW50VmlldyBidXQgZm9yIHRoZSB0ZW1wbGF0ZSBpbnN0YW5jZS4gQSBmdW5jdGlvblxuICAvLyByYXRoZXIgdGhhbiBhIHZhbHVlIHNvIHRoYXQgbm90IGFsbCBoZWxwZXJzIGFyZSBpbXBsaWNpdGx5IGRlcGVuZGVudFxuICAvLyBvbiB0aGUgY3VycmVudCB0ZW1wbGF0ZSBpbnN0YW5jZSdzIGBkYXRhYCBwcm9wZXJ0eSwgd2hpY2ggd291bGQgbWFrZVxuICAvLyB0aGVtIGRlcGVuZGVudCBvbiB0aGUgZGF0YSBjb250ZXh0IG9mIHRoZSB0ZW1wbGF0ZSBpbmNsdXNpb24uXG4gIHZhciBjdXJyZW50VGVtcGxhdGVJbnN0YW5jZUZ1bmMgPSBudWxsO1xuXG4gIC8vIElmIGdldHRlcnMgYXJlIHN1cHBvcnRlZCwgZGVmaW5lIHRoaXMgcHJvcGVydHkgd2l0aCBhIGdldHRlciBmdW5jdGlvblxuICAvLyB0byBtYWtlIGl0IGVmZmVjdGl2ZWx5IHJlYWQtb25seSwgYW5kIHRvIHdvcmsgYXJvdW5kIHRoaXMgYml6YXJyZSBKU0NcbiAgLy8gYnVnOiBodHRwczovL2dpdGh1Yi5jb20vbWV0ZW9yL21ldGVvci9pc3N1ZXMvOTkyNlxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoVGVtcGxhdGUsIFwiX2N1cnJlbnRUZW1wbGF0ZUluc3RhbmNlRnVuY1wiLCB7XG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gY3VycmVudFRlbXBsYXRlSW5zdGFuY2VGdW5jO1xuICAgIH1cbiAgfSk7XG5cbiAgVGVtcGxhdGUuX3dpdGhUZW1wbGF0ZUluc3RhbmNlRnVuYyA9IGZ1bmN0aW9uICh0ZW1wbGF0ZUluc3RhbmNlRnVuYywgZnVuYykge1xuICAgIGlmICh0eXBlb2YgZnVuYyAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRXhwZWN0ZWQgZnVuY3Rpb24sIGdvdDogXCIgKyBmdW5jKTtcbiAgICB9XG4gICAgdmFyIG9sZFRtcGxJbnN0YW5jZUZ1bmMgPSBjdXJyZW50VGVtcGxhdGVJbnN0YW5jZUZ1bmM7XG4gICAgdHJ5IHtcbiAgICAgIGN1cnJlbnRUZW1wbGF0ZUluc3RhbmNlRnVuYyA9IHRlbXBsYXRlSW5zdGFuY2VGdW5jO1xuICAgICAgcmV0dXJuIGZ1bmMoKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgY3VycmVudFRlbXBsYXRlSW5zdGFuY2VGdW5jID0gb2xkVG1wbEluc3RhbmNlRnVuYztcbiAgICB9XG4gIH07XG5cbn0gZWxzZSB7XG4gIC8vIElmIGdldHRlcnMgYXJlIG5vdCBzdXBwb3J0ZWQsIGp1c3QgdXNlIGEgbm9ybWFsIHByb3BlcnR5LlxuICBUZW1wbGF0ZS5fY3VycmVudFRlbXBsYXRlSW5zdGFuY2VGdW5jID0gbnVsbDtcblxuICBUZW1wbGF0ZS5fd2l0aFRlbXBsYXRlSW5zdGFuY2VGdW5jID0gZnVuY3Rpb24gKHRlbXBsYXRlSW5zdGFuY2VGdW5jLCBmdW5jKSB7XG4gICAgaWYgKHR5cGVvZiBmdW5jICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFeHBlY3RlZCBmdW5jdGlvbiwgZ290OiBcIiArIGZ1bmMpO1xuICAgIH1cbiAgICB2YXIgb2xkVG1wbEluc3RhbmNlRnVuYyA9IFRlbXBsYXRlLl9jdXJyZW50VGVtcGxhdGVJbnN0YW5jZUZ1bmM7XG4gICAgdHJ5IHtcbiAgICAgIFRlbXBsYXRlLl9jdXJyZW50VGVtcGxhdGVJbnN0YW5jZUZ1bmMgPSB0ZW1wbGF0ZUluc3RhbmNlRnVuYztcbiAgICAgIHJldHVybiBmdW5jKCk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIFRlbXBsYXRlLl9jdXJyZW50VGVtcGxhdGVJbnN0YW5jZUZ1bmMgPSBvbGRUbXBsSW5zdGFuY2VGdW5jO1xuICAgIH1cbiAgfTtcbn1cblxuLyoqXG4gKiBAc3VtbWFyeSBTcGVjaWZ5IGV2ZW50IGhhbmRsZXJzIGZvciB0aGlzIHRlbXBsYXRlLlxuICogQGxvY3VzIENsaWVudFxuICogQHBhcmFtIHtFdmVudE1hcH0gZXZlbnRNYXAgRXZlbnQgaGFuZGxlcnMgdG8gYXNzb2NpYXRlIHdpdGggdGhpcyB0ZW1wbGF0ZS5cbiAqIEBpbXBvcnRGcm9tUGFja2FnZSB0ZW1wbGF0aW5nXG4gKi9cblRlbXBsYXRlLnByb3RvdHlwZS5ldmVudHMgPSBmdW5jdGlvbiAoZXZlbnRNYXApIHtcbiAgaWYgKCEgXy5pc09iamVjdChldmVudE1hcCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJFdmVudCBtYXAgaGFzIHRvIGJlIGFuIG9iamVjdFwiKTtcbiAgfVxuXG4gIHZhciB0ZW1wbGF0ZSA9IHRoaXM7XG4gIHZhciBldmVudE1hcDIgPSB7fTtcbiAgZm9yICh2YXIgayBpbiBldmVudE1hcCkge1xuICAgIGV2ZW50TWFwMltrXSA9IChmdW5jdGlvbiAoaywgdikge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uIChldmVudC8qLCAuLi4qLykge1xuICAgICAgICB2YXIgdmlldyA9IHRoaXM7IC8vIHBhc3NlZCBieSBFdmVudEF1Z21lbnRlclxuICAgICAgICB2YXIgZGF0YSA9IEJsYXplLmdldERhdGEoZXZlbnQuY3VycmVudFRhcmdldCk7XG4gICAgICAgIGlmIChkYXRhID09IG51bGwpXG4gICAgICAgICAgZGF0YSA9IHt9O1xuICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgICAgIHZhciB0bXBsSW5zdGFuY2VGdW5jID0gQmxhemUuX2JpbmQodmlldy50ZW1wbGF0ZUluc3RhbmNlLCB2aWV3KTtcbiAgICAgICAgYXJncy5zcGxpY2UoMSwgMCwgdG1wbEluc3RhbmNlRnVuYygpKTtcblxuICAgICAgICByZXR1cm4gVGVtcGxhdGUuX3dpdGhUZW1wbGF0ZUluc3RhbmNlRnVuYyh0bXBsSW5zdGFuY2VGdW5jLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIHYuYXBwbHkoZGF0YSwgYXJncyk7XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICB9KShrLCBldmVudE1hcFtrXSk7XG4gIH1cblxuICB0ZW1wbGF0ZS5fX2V2ZW50TWFwcy5wdXNoKGV2ZW50TWFwMik7XG59O1xuXG4vKipcbiAqIEBmdW5jdGlvblxuICogQG5hbWUgaW5zdGFuY2VcbiAqIEBtZW1iZXJPZiBUZW1wbGF0ZVxuICogQHN1bW1hcnkgVGhlIFt0ZW1wbGF0ZSBpbnN0YW5jZV0oI1RlbXBsYXRlLWluc3RhbmNlcykgY29ycmVzcG9uZGluZyB0byB0aGUgY3VycmVudCB0ZW1wbGF0ZSBoZWxwZXIsIGV2ZW50IGhhbmRsZXIsIGNhbGxiYWNrLCBvciBhdXRvcnVuLiAgSWYgdGhlcmUgaXNuJ3Qgb25lLCBgbnVsbGAuXG4gKiBAbG9jdXMgQ2xpZW50XG4gKiBAcmV0dXJucyB7QmxhemUuVGVtcGxhdGVJbnN0YW5jZX1cbiAqIEBpbXBvcnRGcm9tUGFja2FnZSB0ZW1wbGF0aW5nXG4gKi9cblRlbXBsYXRlLmluc3RhbmNlID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gVGVtcGxhdGUuX2N1cnJlbnRUZW1wbGF0ZUluc3RhbmNlRnVuY1xuICAgICYmIFRlbXBsYXRlLl9jdXJyZW50VGVtcGxhdGVJbnN0YW5jZUZ1bmMoKTtcbn07XG5cbi8vIE5vdGU6IFRlbXBsYXRlLmN1cnJlbnREYXRhKCkgaXMgZG9jdW1lbnRlZCB0byB0YWtlIHplcm8gYXJndW1lbnRzLFxuLy8gd2hpbGUgQmxhemUuZ2V0RGF0YSB0YWtlcyB1cCB0byBvbmUuXG5cbi8qKlxuICogQHN1bW1hcnlcbiAqXG4gKiAtIEluc2lkZSBhbiBgb25DcmVhdGVkYCwgYG9uUmVuZGVyZWRgLCBvciBgb25EZXN0cm95ZWRgIGNhbGxiYWNrLCByZXR1cm5zXG4gKiB0aGUgZGF0YSBjb250ZXh0IG9mIHRoZSB0ZW1wbGF0ZS5cbiAqIC0gSW5zaWRlIGFuIGV2ZW50IGhhbmRsZXIsIHJldHVybnMgdGhlIGRhdGEgY29udGV4dCBvZiB0aGUgdGVtcGxhdGUgb24gd2hpY2hcbiAqIHRoaXMgZXZlbnQgaGFuZGxlciB3YXMgZGVmaW5lZC5cbiAqIC0gSW5zaWRlIGEgaGVscGVyLCByZXR1cm5zIHRoZSBkYXRhIGNvbnRleHQgb2YgdGhlIERPTSBub2RlIHdoZXJlIHRoZSBoZWxwZXJcbiAqIHdhcyB1c2VkLlxuICpcbiAqIEVzdGFibGlzaGVzIGEgcmVhY3RpdmUgZGVwZW5kZW5jeSBvbiB0aGUgcmVzdWx0LlxuICogQGxvY3VzIENsaWVudFxuICogQGZ1bmN0aW9uXG4gKiBAaW1wb3J0RnJvbVBhY2thZ2UgdGVtcGxhdGluZ1xuICovXG5UZW1wbGF0ZS5jdXJyZW50RGF0YSA9IEJsYXplLmdldERhdGE7XG5cbi8qKlxuICogQHN1bW1hcnkgQWNjZXNzZXMgb3RoZXIgZGF0YSBjb250ZXh0cyB0aGF0IGVuY2xvc2UgdGhlIGN1cnJlbnQgZGF0YSBjb250ZXh0LlxuICogQGxvY3VzIENsaWVudFxuICogQGZ1bmN0aW9uXG4gKiBAcGFyYW0ge0ludGVnZXJ9IFtudW1MZXZlbHNdIFRoZSBudW1iZXIgb2YgbGV2ZWxzIGJleW9uZCB0aGUgY3VycmVudCBkYXRhIGNvbnRleHQgdG8gbG9vay4gRGVmYXVsdHMgdG8gMS5cbiAqIEBpbXBvcnRGcm9tUGFja2FnZSB0ZW1wbGF0aW5nXG4gKi9cblRlbXBsYXRlLnBhcmVudERhdGEgPSBCbGF6ZS5fcGFyZW50RGF0YTtcblxuLyoqXG4gKiBAc3VtbWFyeSBEZWZpbmVzIGEgW2hlbHBlciBmdW5jdGlvbl0oI1RlbXBsYXRlLWhlbHBlcnMpIHdoaWNoIGNhbiBiZSB1c2VkIGZyb20gYWxsIHRlbXBsYXRlcy5cbiAqIEBsb2N1cyBDbGllbnRcbiAqIEBmdW5jdGlvblxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgVGhlIG5hbWUgb2YgdGhlIGhlbHBlciBmdW5jdGlvbiB5b3UgYXJlIGRlZmluaW5nLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuY3Rpb24gVGhlIGhlbHBlciBmdW5jdGlvbiBpdHNlbGYuXG4gKiBAaW1wb3J0RnJvbVBhY2thZ2UgdGVtcGxhdGluZ1xuICovXG5UZW1wbGF0ZS5yZWdpc3RlckhlbHBlciA9IEJsYXplLnJlZ2lzdGVySGVscGVyO1xuXG4vKipcbiAqIEBzdW1tYXJ5IFJlbW92ZXMgYSBnbG9iYWwgW2hlbHBlciBmdW5jdGlvbl0oI1RlbXBsYXRlLWhlbHBlcnMpLlxuICogQGxvY3VzIENsaWVudFxuICogQGZ1bmN0aW9uXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBUaGUgbmFtZSBvZiB0aGUgaGVscGVyIGZ1bmN0aW9uIHlvdSBhcmUgZGVmaW5pbmcuXG4gKiBAaW1wb3J0RnJvbVBhY2thZ2UgdGVtcGxhdGluZ1xuICovXG5UZW1wbGF0ZS5kZXJlZ2lzdGVySGVscGVyID0gQmxhemUuZGVyZWdpc3RlckhlbHBlcjtcbiIsIlVJID0gQmxhemU7XG5cbkJsYXplLlJlYWN0aXZlVmFyID0gUmVhY3RpdmVWYXI7XG5VSS5fdGVtcGxhdGVJbnN0YW5jZSA9IEJsYXplLlRlbXBsYXRlLmluc3RhbmNlO1xuXG5IYW5kbGViYXJzID0ge307XG5IYW5kbGViYXJzLnJlZ2lzdGVySGVscGVyID0gQmxhemUucmVnaXN0ZXJIZWxwZXI7XG5cbkhhbmRsZWJhcnMuX2VzY2FwZSA9IEJsYXplLl9lc2NhcGU7XG5cbi8vIFJldHVybiB0aGVzZSBmcm9tIHt7Li4ufX0gaGVscGVycyB0byBhY2hpZXZlIHRoZSBzYW1lIGFzIHJldHVybmluZ1xuLy8gc3RyaW5ncyBmcm9tIHt7ey4uLn19fSBoZWxwZXJzXG5IYW5kbGViYXJzLlNhZmVTdHJpbmcgPSBmdW5jdGlvbihzdHJpbmcpIHtcbiAgdGhpcy5zdHJpbmcgPSBzdHJpbmc7XG59O1xuSGFuZGxlYmFycy5TYWZlU3RyaW5nLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5zdHJpbmcudG9TdHJpbmcoKTtcbn07XG4iXX0=
