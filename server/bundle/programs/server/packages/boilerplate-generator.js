(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var _ = Package.underscore._;
var meteorInstall = Package.modules.meteorInstall;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var Boilerplate;

var require = meteorInstall({"node_modules":{"meteor":{"boilerplate-generator":{"generator.js":function module(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/boilerplate-generator/generator.js                                                                       //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
let _objectSpread;

module.link("@babel/runtime/helpers/objectSpread2", {
  default(v) {
    _objectSpread = v;
  }

}, 0);
module.export({
  Boilerplate: () => Boilerplate
});
let readFile;
module.link("fs", {
  readFile(v) {
    readFile = v;
  }

}, 0);
let createStream;
module.link("combined-stream2", {
  create(v) {
    createStream = v;
  }

}, 1);
let WebBrowserTemplate;
module.link("./template-web.browser", {
  default(v) {
    WebBrowserTemplate = v;
  }

}, 2);
let WebCordovaTemplate;
module.link("./template-web.cordova", {
  default(v) {
    WebCordovaTemplate = v;
  }

}, 3);

// Copied from webapp_server
const readUtf8FileSync = filename => Meteor.wrapAsync(readFile)(filename, 'utf8');

const identity = value => value;

function appendToStream(chunk, stream) {
  if (typeof chunk === "string") {
    stream.append(Buffer.from(chunk, "utf8"));
  } else if (Buffer.isBuffer(chunk) || typeof chunk.read === "function") {
    stream.append(chunk);
  }
}

let shouldWarnAboutToHTMLDeprecation = !Meteor.isProduction;

class Boilerplate {
  constructor(arch, manifest) {
    let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    const {
      headTemplate,
      closeTemplate
    } = getTemplate(arch);
    this.headTemplate = headTemplate;
    this.closeTemplate = closeTemplate;
    this.baseData = null;

    this._generateBoilerplateFromManifest(manifest, options);
  }

  toHTML(extraData) {
    if (shouldWarnAboutToHTMLDeprecation) {
      shouldWarnAboutToHTMLDeprecation = false;
      console.error("The Boilerplate#toHTML method has been deprecated. " + "Please use Boilerplate#toHTMLStream instead.");
      console.trace();
    } // Calling .await() requires a Fiber.


    return this.toHTMLAsync(extraData).await();
  } // Returns a Promise that resolves to a string of HTML.


  toHTMLAsync(extraData) {
    return new Promise((resolve, reject) => {
      const stream = this.toHTMLStream(extraData);
      const chunks = [];
      stream.on("data", chunk => chunks.push(chunk));
      stream.on("end", () => {
        resolve(Buffer.concat(chunks).toString("utf8"));
      });
      stream.on("error", reject);
    });
  } // The 'extraData' argument can be used to extend 'self.baseData'. Its
  // purpose is to allow you to specify data that you might not know at
  // the time that you construct the Boilerplate object. (e.g. it is used
  // by 'webapp' to specify data that is only known at request-time).
  // this returns a stream


  toHTMLStream(extraData) {
    if (!this.baseData || !this.headTemplate || !this.closeTemplate) {
      throw new Error('Boilerplate did not instantiate correctly.');
    }

    const data = _objectSpread({}, this.baseData, {}, extraData);

    const start = "<!DOCTYPE html>\n" + this.headTemplate(data);
    const {
      body,
      dynamicBody
    } = data;
    const end = this.closeTemplate(data);
    const response = createStream();
    appendToStream(start, response);

    if (body) {
      appendToStream(body, response);
    }

    if (dynamicBody) {
      appendToStream(dynamicBody, response);
    }

    appendToStream(end, response);
    return response;
  } // XXX Exported to allow client-side only changes to rebuild the boilerplate
  // without requiring a full server restart.
  // Produces an HTML string with given manifest and boilerplateSource.
  // Optionally takes urlMapper in case urls from manifest need to be prefixed
  // or rewritten.
  // Optionally takes pathMapper for resolving relative file system paths.
  // Optionally allows to override fields of the data context.


  _generateBoilerplateFromManifest(manifest) {
    let {
      urlMapper = identity,
      pathMapper = identity,
      baseDataExtension,
      inline
    } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    const boilerplateBaseData = _objectSpread({
      css: [],
      js: [],
      head: '',
      body: '',
      meteorManifest: JSON.stringify(manifest)
    }, baseDataExtension);

    manifest.forEach(item => {
      const urlPath = urlMapper(item.url);
      const itemObj = {
        url: urlPath
      };

      if (inline) {
        itemObj.scriptContent = readUtf8FileSync(pathMapper(item.path));
        itemObj.inline = true;
      } else if (item.sri) {
        itemObj.sri = item.sri;
      }

      if (item.type === 'css' && item.where === 'client') {
        boilerplateBaseData.css.push(itemObj);
      }

      if (item.type === 'js' && item.where === 'client' && // Dynamic JS modules should not be loaded eagerly in the
      // initial HTML of the app.
      !item.path.startsWith('dynamic/')) {
        boilerplateBaseData.js.push(itemObj);
      }

      if (item.type === 'head') {
        boilerplateBaseData.head = readUtf8FileSync(pathMapper(item.path));
      }

      if (item.type === 'body') {
        boilerplateBaseData.body = readUtf8FileSync(pathMapper(item.path));
      }
    });
    this.baseData = boilerplateBaseData;
  }

}

; // Returns a template function that, when called, produces the boilerplate
// html as a string.

function getTemplate(arch) {
  const prefix = arch.split(".", 2).join(".");

  if (prefix === "web.browser") {
    return WebBrowserTemplate;
  }

  if (prefix === "web.cordova") {
    return WebCordovaTemplate;
  }

  throw new Error("Unsupported arch: " + arch);
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"template-web.browser.js":function module(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/boilerplate-generator/template-web.browser.js                                                            //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
module.export({
  headTemplate: () => headTemplate,
  closeTemplate: () => closeTemplate
});
let template;
module.link("./template", {
  default(v) {
    template = v;
  }

}, 0);

const sri = (sri, mode) => sri && mode ? " integrity=\"sha512-".concat(sri, "\" crossorigin=\"").concat(mode, "\"") : '';

const headTemplate = (_ref) => {
  let {
    css,
    htmlAttributes,
    bundledJsCssUrlRewriteHook,
    sriMode,
    head,
    dynamicHead
  } = _ref;
  var headSections = head.split(/<meteor-bundled-css[^<>]*>/, 2);
  var cssBundle = [...(css || []).map(file => template('  <link rel="stylesheet" type="text/css" class="__meteor-css__" href="<%- href %>"<%= sri %>>')({
    href: bundledJsCssUrlRewriteHook(file.url),
    sri: sri(file.sri, sriMode)
  }))].join('\n');
  return ['<html' + Object.keys(htmlAttributes || {}).map(key => template(' <%= attrName %>="<%- attrValue %>"')({
    attrName: key,
    attrValue: htmlAttributes[key]
  })).join('') + '>', '<head>', headSections.length === 1 ? [cssBundle, headSections[0]].join('\n') : [headSections[0], cssBundle, headSections[1]].join('\n'), dynamicHead, '</head>', '<body>'].join('\n');
};

const closeTemplate = (_ref2) => {
  let {
    meteorRuntimeConfig,
    rootUrlPathPrefix,
    inlineScriptsAllowed,
    js,
    additionalStaticJs,
    bundledJsCssUrlRewriteHook,
    sriMode
  } = _ref2;
  return ['', inlineScriptsAllowed ? template('  <script type="text/javascript">__meteor_runtime_config__ = JSON.parse(decodeURIComponent(<%= conf %>))</script>')({
    conf: meteorRuntimeConfig
  }) : template('  <script type="text/javascript" src="<%- src %>/meteor_runtime_config.js"></script>')({
    src: rootUrlPathPrefix
  }), '', ...(js || []).map(file => template('  <script type="text/javascript" src="<%- src %>"<%= sri %>></script>')({
    src: bundledJsCssUrlRewriteHook(file.url),
    sri: sri(file.sri, sriMode)
  })), ...(additionalStaticJs || []).map((_ref3) => {
    let {
      contents,
      pathname
    } = _ref3;
    return inlineScriptsAllowed ? template('  <script><%= contents %></script>')({
      contents
    }) : template('  <script type="text/javascript" src="<%- src %>"></script>')({
      src: rootUrlPathPrefix + pathname
    });
  }), '', '', '</body>', '</html>'].join('\n');
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"template-web.cordova.js":function module(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/boilerplate-generator/template-web.cordova.js                                                            //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
module.export({
  headTemplate: () => headTemplate,
  closeTemplate: () => closeTemplate
});
let template;
module.link("./template", {
  default(v) {
    template = v;
  }

}, 0);

const headTemplate = (_ref) => {
  let {
    meteorRuntimeConfig,
    rootUrlPathPrefix,
    inlineScriptsAllowed,
    css,
    js,
    additionalStaticJs,
    htmlAttributes,
    bundledJsCssUrlRewriteHook,
    head,
    dynamicHead
  } = _ref;
  var headSections = head.split(/<meteor-bundled-css[^<>]*>/, 2);
  var cssBundle = [// We are explicitly not using bundledJsCssUrlRewriteHook: in cordova we serve assets up directly from disk, so rewriting the URL does not make sense
  ...(css || []).map(file => template('  <link rel="stylesheet" type="text/css" class="__meteor-css__" href="<%- href %>">')({
    href: file.url
  }))].join('\n');
  return ['<html>', '<head>', '  <meta charset="utf-8">', '  <meta name="format-detection" content="telephone=no">', '  <meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, height=device-height, viewport-fit=cover">', '  <meta name="msapplication-tap-highlight" content="no">', '  <meta http-equiv="Content-Security-Policy" content="default-src * gap: data: blob: \'unsafe-inline\' \'unsafe-eval\' ws: wss:;">', headSections.length === 1 ? [cssBundle, headSections[0]].join('\n') : [headSections[0], cssBundle, headSections[1]].join('\n'), '  <script type="text/javascript">', template('    __meteor_runtime_config__ = JSON.parse(decodeURIComponent(<%= conf %>));')({
    conf: meteorRuntimeConfig
  }), '    if (/Android/i.test(navigator.userAgent)) {', // When Android app is emulated, it cannot connect to localhost,
  // instead it should connect to 10.0.2.2
  // (unless we\'re using an http proxy; then it works!)
  '      if (!__meteor_runtime_config__.httpProxyPort) {', '        __meteor_runtime_config__.ROOT_URL = (__meteor_runtime_config__.ROOT_URL || \'\').replace(/localhost/i, \'10.0.2.2\');', '        __meteor_runtime_config__.DDP_DEFAULT_CONNECTION_URL = (__meteor_runtime_config__.DDP_DEFAULT_CONNECTION_URL || \'\').replace(/localhost/i, \'10.0.2.2\');', '      }', '    }', 'if(!document.body){\n' + '    var tempBody = document.createElement("body");\n' + '    document.body = tempBody;\n' + '    document.addEventListener(\'DOMContentLoaded\', (event) => {\n' + '        tempBody.remove()\n' + '    });\n' + '}', '  </script>', '', '  <script type="text/javascript" src="/cordova.js"></script>', ...(js || []).map(file => template('  <script type="text/javascript" src="<%- src %>"></script>')({
    src: file.url
  })), ...(additionalStaticJs || []).map((_ref2) => {
    let {
      contents,
      pathname
    } = _ref2;
    return inlineScriptsAllowed ? template('  <script><%= contents %></script>')({
      contents
    }) : template('  <script type="text/javascript" src="<%- src %>"></script>')({
      src: Meteor.absoluteUrl(pathname)
    });
  }), '', '</head>', '', '<body>'].join('\n');
};

function closeTemplate() {
  return "</body>\n</html>";
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"template.js":function module(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/boilerplate-generator/template.js                                                                        //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
module.export({
  default: () => template
});

let _;

module.link("meteor/underscore", {
  _(v) {
    _ = v;
  }

}, 0);

function template(text) {
  return _.template(text, null, {
    evaluate: /<%([\s\S]+?)%>/g,
    interpolate: /<%=([\s\S]+?)%>/g,
    escape: /<%-([\s\S]+?)%>/g
  });
}

;
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"node_modules":{"combined-stream2":{"package.json":function module(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// node_modules/meteor/boilerplate-generator/node_modules/combined-stream2/package.json                              //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
module.exports = {
  "name": "combined-stream2",
  "version": "1.1.2",
  "main": "index.js"
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function module(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// node_modules/meteor/boilerplate-generator/node_modules/combined-stream2/index.js                                  //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
module.useNode();
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

var exports = require("/node_modules/meteor/boilerplate-generator/generator.js");

/* Exports */
Package._define("boilerplate-generator", exports, {
  Boilerplate: Boilerplate
});

})();

//# sourceURL=meteor://💻app/packages/boilerplate-generator.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvYm9pbGVycGxhdGUtZ2VuZXJhdG9yL2dlbmVyYXRvci5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvYm9pbGVycGxhdGUtZ2VuZXJhdG9yL3RlbXBsYXRlLXdlYi5icm93c2VyLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9ib2lsZXJwbGF0ZS1nZW5lcmF0b3IvdGVtcGxhdGUtd2ViLmNvcmRvdmEuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2JvaWxlcnBsYXRlLWdlbmVyYXRvci90ZW1wbGF0ZS5qcyJdLCJuYW1lcyI6WyJfb2JqZWN0U3ByZWFkIiwibW9kdWxlIiwibGluayIsImRlZmF1bHQiLCJ2IiwiZXhwb3J0IiwiQm9pbGVycGxhdGUiLCJyZWFkRmlsZSIsImNyZWF0ZVN0cmVhbSIsImNyZWF0ZSIsIldlYkJyb3dzZXJUZW1wbGF0ZSIsIldlYkNvcmRvdmFUZW1wbGF0ZSIsInJlYWRVdGY4RmlsZVN5bmMiLCJmaWxlbmFtZSIsIk1ldGVvciIsIndyYXBBc3luYyIsImlkZW50aXR5IiwidmFsdWUiLCJhcHBlbmRUb1N0cmVhbSIsImNodW5rIiwic3RyZWFtIiwiYXBwZW5kIiwiQnVmZmVyIiwiZnJvbSIsImlzQnVmZmVyIiwicmVhZCIsInNob3VsZFdhcm5BYm91dFRvSFRNTERlcHJlY2F0aW9uIiwiaXNQcm9kdWN0aW9uIiwiY29uc3RydWN0b3IiLCJhcmNoIiwibWFuaWZlc3QiLCJvcHRpb25zIiwiaGVhZFRlbXBsYXRlIiwiY2xvc2VUZW1wbGF0ZSIsImdldFRlbXBsYXRlIiwiYmFzZURhdGEiLCJfZ2VuZXJhdGVCb2lsZXJwbGF0ZUZyb21NYW5pZmVzdCIsInRvSFRNTCIsImV4dHJhRGF0YSIsImNvbnNvbGUiLCJlcnJvciIsInRyYWNlIiwidG9IVE1MQXN5bmMiLCJhd2FpdCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwidG9IVE1MU3RyZWFtIiwiY2h1bmtzIiwib24iLCJwdXNoIiwiY29uY2F0IiwidG9TdHJpbmciLCJFcnJvciIsImRhdGEiLCJzdGFydCIsImJvZHkiLCJkeW5hbWljQm9keSIsImVuZCIsInJlc3BvbnNlIiwidXJsTWFwcGVyIiwicGF0aE1hcHBlciIsImJhc2VEYXRhRXh0ZW5zaW9uIiwiaW5saW5lIiwiYm9pbGVycGxhdGVCYXNlRGF0YSIsImNzcyIsImpzIiwiaGVhZCIsIm1ldGVvck1hbmlmZXN0IiwiSlNPTiIsInN0cmluZ2lmeSIsImZvckVhY2giLCJpdGVtIiwidXJsUGF0aCIsInVybCIsIml0ZW1PYmoiLCJzY3JpcHRDb250ZW50IiwicGF0aCIsInNyaSIsInR5cGUiLCJ3aGVyZSIsInN0YXJ0c1dpdGgiLCJwcmVmaXgiLCJzcGxpdCIsImpvaW4iLCJ0ZW1wbGF0ZSIsIm1vZGUiLCJodG1sQXR0cmlidXRlcyIsImJ1bmRsZWRKc0Nzc1VybFJld3JpdGVIb29rIiwic3JpTW9kZSIsImR5bmFtaWNIZWFkIiwiaGVhZFNlY3Rpb25zIiwiY3NzQnVuZGxlIiwibWFwIiwiZmlsZSIsImhyZWYiLCJPYmplY3QiLCJrZXlzIiwia2V5IiwiYXR0ck5hbWUiLCJhdHRyVmFsdWUiLCJsZW5ndGgiLCJtZXRlb3JSdW50aW1lQ29uZmlnIiwicm9vdFVybFBhdGhQcmVmaXgiLCJpbmxpbmVTY3JpcHRzQWxsb3dlZCIsImFkZGl0aW9uYWxTdGF0aWNKcyIsImNvbmYiLCJzcmMiLCJjb250ZW50cyIsInBhdGhuYW1lIiwiYWJzb2x1dGVVcmwiLCJfIiwidGV4dCIsImV2YWx1YXRlIiwiaW50ZXJwb2xhdGUiLCJlc2NhcGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxhQUFKOztBQUFrQkMsTUFBTSxDQUFDQyxJQUFQLENBQVksc0NBQVosRUFBbUQ7QUFBQ0MsU0FBTyxDQUFDQyxDQUFELEVBQUc7QUFBQ0osaUJBQWEsR0FBQ0ksQ0FBZDtBQUFnQjs7QUFBNUIsQ0FBbkQsRUFBaUYsQ0FBakY7QUFBbEJI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cy9ib2lsZXJwbGF0ZS1nZW5lcmF0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyByZWFkRmlsZSB9IGZyb20gJ2ZzJztcclxuaW1wb3J0IHsgY3JlYXRlIGFzIGNyZWF0ZVN0cmVhbSB9IGZyb20gXCJjb21iaW5lZC1zdHJlYW0yXCI7XHJcblxyXG5pbXBvcnQgV2ViQnJvd3NlclRlbXBsYXRlIGZyb20gJy4vdGVtcGxhdGUtd2ViLmJyb3dzZXInO1xyXG5pbXBvcnQgV2ViQ29yZG92YVRlbXBsYXRlIGZyb20gJy4vdGVtcGxhdGUtd2ViLmNvcmRvdmEnO1xyXG5cclxuLy8gQ29waWVkIGZyb20gd2ViYXBwX3NlcnZlclxyXG5jb25zdCByZWFkVXRmOEZpbGVTeW5jID0gZmlsZW5hbWUgPT4gTWV0ZW9yLndyYXBBc3luYyhyZWFkRmlsZSkoZmlsZW5hbWUsICd1dGY4Jyk7XHJcblxyXG5jb25zdCBpZGVudGl0eSA9IHZhbHVlID0+IHZhbHVlO1xyXG5cclxuZnVuY3Rpb24gYXBwZW5kVG9TdHJlYW0oY2h1bmssIHN0cmVhbSkge1xyXG4gIGlmICh0eXBlb2YgY2h1bmsgPT09IFwic3RyaW5nXCIpIHtcclxuICAgIHN0cmVhbS5hcHBlbmQoQnVmZmVyLmZyb20oY2h1bmssIFwidXRmOFwiKSk7XHJcbiAgfSBlbHNlIGlmIChCdWZmZXIuaXNCdWZmZXIoY2h1bmspIHx8XHJcbiAgICAgICAgICAgICB0eXBlb2YgY2h1bmsucmVhZCA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICBzdHJlYW0uYXBwZW5kKGNodW5rKTtcclxuICB9XHJcbn1cclxuXHJcbmxldCBzaG91bGRXYXJuQWJvdXRUb0hUTUxEZXByZWNhdGlvbiA9ICEgTWV0ZW9yLmlzUHJvZHVjdGlvbjtcclxuXHJcbmV4cG9ydCBjbGFzcyBCb2lsZXJwbGF0ZSB7XHJcbiAgY29uc3RydWN0b3IoYXJjaCwgbWFuaWZlc3QsIG9wdGlvbnMgPSB7fSkge1xyXG4gICAgY29uc3QgeyBoZWFkVGVtcGxhdGUsIGNsb3NlVGVtcGxhdGUgfSA9IGdldFRlbXBsYXRlKGFyY2gpO1xyXG4gICAgdGhpcy5oZWFkVGVtcGxhdGUgPSBoZWFkVGVtcGxhdGU7XHJcbiAgICB0aGlzLmNsb3NlVGVtcGxhdGUgPSBjbG9zZVRlbXBsYXRlO1xyXG4gICAgdGhpcy5iYXNlRGF0YSA9IG51bGw7XHJcblxyXG4gICAgdGhpcy5fZ2VuZXJhdGVCb2lsZXJwbGF0ZUZyb21NYW5pZmVzdChcclxuICAgICAgbWFuaWZlc3QsXHJcbiAgICAgIG9wdGlvbnNcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICB0b0hUTUwoZXh0cmFEYXRhKSB7XHJcbiAgICBpZiAoc2hvdWxkV2FybkFib3V0VG9IVE1MRGVwcmVjYXRpb24pIHtcclxuICAgICAgc2hvdWxkV2FybkFib3V0VG9IVE1MRGVwcmVjYXRpb24gPSBmYWxzZTtcclxuICAgICAgY29uc29sZS5lcnJvcihcclxuICAgICAgICBcIlRoZSBCb2lsZXJwbGF0ZSN0b0hUTUwgbWV0aG9kIGhhcyBiZWVuIGRlcHJlY2F0ZWQuIFwiICtcclxuICAgICAgICAgIFwiUGxlYXNlIHVzZSBCb2lsZXJwbGF0ZSN0b0hUTUxTdHJlYW0gaW5zdGVhZC5cIlxyXG4gICAgICApO1xyXG4gICAgICBjb25zb2xlLnRyYWNlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ2FsbGluZyAuYXdhaXQoKSByZXF1aXJlcyBhIEZpYmVyLlxyXG4gICAgcmV0dXJuIHRoaXMudG9IVE1MQXN5bmMoZXh0cmFEYXRhKS5hd2FpdCgpO1xyXG4gIH1cclxuXHJcbiAgLy8gUmV0dXJucyBhIFByb21pc2UgdGhhdCByZXNvbHZlcyB0byBhIHN0cmluZyBvZiBIVE1MLlxyXG4gIHRvSFRNTEFzeW5jKGV4dHJhRGF0YSkge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgY29uc3Qgc3RyZWFtID0gdGhpcy50b0hUTUxTdHJlYW0oZXh0cmFEYXRhKTtcclxuICAgICAgY29uc3QgY2h1bmtzID0gW107XHJcbiAgICAgIHN0cmVhbS5vbihcImRhdGFcIiwgY2h1bmsgPT4gY2h1bmtzLnB1c2goY2h1bmspKTtcclxuICAgICAgc3RyZWFtLm9uKFwiZW5kXCIsICgpID0+IHtcclxuICAgICAgICByZXNvbHZlKEJ1ZmZlci5jb25jYXQoY2h1bmtzKS50b1N0cmluZyhcInV0ZjhcIikpO1xyXG4gICAgICB9KTtcclxuICAgICAgc3RyZWFtLm9uKFwiZXJyb3JcIiwgcmVqZWN0KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy8gVGhlICdleHRyYURhdGEnIGFyZ3VtZW50IGNhbiBiZSB1c2VkIHRvIGV4dGVuZCAnc2VsZi5iYXNlRGF0YScuIEl0c1xyXG4gIC8vIHB1cnBvc2UgaXMgdG8gYWxsb3cgeW91IHRvIHNwZWNpZnkgZGF0YSB0aGF0IHlvdSBtaWdodCBub3Qga25vdyBhdFxyXG4gIC8vIHRoZSB0aW1lIHRoYXQgeW91IGNvbnN0cnVjdCB0aGUgQm9pbGVycGxhdGUgb2JqZWN0LiAoZS5nLiBpdCBpcyB1c2VkXHJcbiAgLy8gYnkgJ3dlYmFwcCcgdG8gc3BlY2lmeSBkYXRhIHRoYXQgaXMgb25seSBrbm93biBhdCByZXF1ZXN0LXRpbWUpLlxyXG4gIC8vIHRoaXMgcmV0dXJucyBhIHN0cmVhbVxyXG4gIHRvSFRNTFN0cmVhbShleHRyYURhdGEpIHtcclxuICAgIGlmICghdGhpcy5iYXNlRGF0YSB8fCAhdGhpcy5oZWFkVGVtcGxhdGUgfHwgIXRoaXMuY2xvc2VUZW1wbGF0ZSkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0JvaWxlcnBsYXRlIGRpZCBub3QgaW5zdGFudGlhdGUgY29ycmVjdGx5LicpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGRhdGEgPSB7Li4udGhpcy5iYXNlRGF0YSwgLi4uZXh0cmFEYXRhfTtcclxuICAgIGNvbnN0IHN0YXJ0ID0gXCI8IURPQ1RZUEUgaHRtbD5cXG5cIiArIHRoaXMuaGVhZFRlbXBsYXRlKGRhdGEpO1xyXG5cclxuICAgIGNvbnN0IHsgYm9keSwgZHluYW1pY0JvZHkgfSA9IGRhdGE7XHJcblxyXG4gICAgY29uc3QgZW5kID0gdGhpcy5jbG9zZVRlbXBsYXRlKGRhdGEpO1xyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBjcmVhdGVTdHJlYW0oKTtcclxuXHJcbiAgICBhcHBlbmRUb1N0cmVhbShzdGFydCwgcmVzcG9uc2UpO1xyXG5cclxuICAgIGlmIChib2R5KSB7XHJcbiAgICAgIGFwcGVuZFRvU3RyZWFtKGJvZHksIHJlc3BvbnNlKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZHluYW1pY0JvZHkpIHtcclxuICAgICAgYXBwZW5kVG9TdHJlYW0oZHluYW1pY0JvZHksIHJlc3BvbnNlKTtcclxuICAgIH1cclxuXHJcbiAgICBhcHBlbmRUb1N0cmVhbShlbmQsIHJlc3BvbnNlKTtcclxuXHJcbiAgICByZXR1cm4gcmVzcG9uc2U7XHJcbiAgfVxyXG5cclxuICAvLyBYWFggRXhwb3J0ZWQgdG8gYWxsb3cgY2xpZW50LXNpZGUgb25seSBjaGFuZ2VzIHRvIHJlYnVpbGQgdGhlIGJvaWxlcnBsYXRlXHJcbiAgLy8gd2l0aG91dCByZXF1aXJpbmcgYSBmdWxsIHNlcnZlciByZXN0YXJ0LlxyXG4gIC8vIFByb2R1Y2VzIGFuIEhUTUwgc3RyaW5nIHdpdGggZ2l2ZW4gbWFuaWZlc3QgYW5kIGJvaWxlcnBsYXRlU291cmNlLlxyXG4gIC8vIE9wdGlvbmFsbHkgdGFrZXMgdXJsTWFwcGVyIGluIGNhc2UgdXJscyBmcm9tIG1hbmlmZXN0IG5lZWQgdG8gYmUgcHJlZml4ZWRcclxuICAvLyBvciByZXdyaXR0ZW4uXHJcbiAgLy8gT3B0aW9uYWxseSB0YWtlcyBwYXRoTWFwcGVyIGZvciByZXNvbHZpbmcgcmVsYXRpdmUgZmlsZSBzeXN0ZW0gcGF0aHMuXHJcbiAgLy8gT3B0aW9uYWxseSBhbGxvd3MgdG8gb3ZlcnJpZGUgZmllbGRzIG9mIHRoZSBkYXRhIGNvbnRleHQuXHJcbiAgX2dlbmVyYXRlQm9pbGVycGxhdGVGcm9tTWFuaWZlc3QobWFuaWZlc3QsIHtcclxuICAgIHVybE1hcHBlciA9IGlkZW50aXR5LFxyXG4gICAgcGF0aE1hcHBlciA9IGlkZW50aXR5LFxyXG4gICAgYmFzZURhdGFFeHRlbnNpb24sXHJcbiAgICBpbmxpbmUsXHJcbiAgfSA9IHt9KSB7XHJcblxyXG4gICAgY29uc3QgYm9pbGVycGxhdGVCYXNlRGF0YSA9IHtcclxuICAgICAgY3NzOiBbXSxcclxuICAgICAganM6IFtdLFxyXG4gICAgICBoZWFkOiAnJyxcclxuICAgICAgYm9keTogJycsXHJcbiAgICAgIG1ldGVvck1hbmlmZXN0OiBKU09OLnN0cmluZ2lmeShtYW5pZmVzdCksXHJcbiAgICAgIC4uLmJhc2VEYXRhRXh0ZW5zaW9uLFxyXG4gICAgfTtcclxuXHJcbiAgICBtYW5pZmVzdC5mb3JFYWNoKGl0ZW0gPT4ge1xyXG4gICAgICBjb25zdCB1cmxQYXRoID0gdXJsTWFwcGVyKGl0ZW0udXJsKTtcclxuICAgICAgY29uc3QgaXRlbU9iaiA9IHsgdXJsOiB1cmxQYXRoIH07XHJcblxyXG4gICAgICBpZiAoaW5saW5lKSB7XHJcbiAgICAgICAgaXRlbU9iai5zY3JpcHRDb250ZW50ID0gcmVhZFV0ZjhGaWxlU3luYyhcclxuICAgICAgICAgIHBhdGhNYXBwZXIoaXRlbS5wYXRoKSk7XHJcbiAgICAgICAgaXRlbU9iai5pbmxpbmUgPSB0cnVlO1xyXG4gICAgICB9IGVsc2UgaWYgKGl0ZW0uc3JpKSB7XHJcbiAgICAgICAgaXRlbU9iai5zcmkgPSBpdGVtLnNyaTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGl0ZW0udHlwZSA9PT0gJ2NzcycgJiYgaXRlbS53aGVyZSA9PT0gJ2NsaWVudCcpIHtcclxuICAgICAgICBib2lsZXJwbGF0ZUJhc2VEYXRhLmNzcy5wdXNoKGl0ZW1PYmopO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoaXRlbS50eXBlID09PSAnanMnICYmIGl0ZW0ud2hlcmUgPT09ICdjbGllbnQnICYmXHJcbiAgICAgICAgLy8gRHluYW1pYyBKUyBtb2R1bGVzIHNob3VsZCBub3QgYmUgbG9hZGVkIGVhZ2VybHkgaW4gdGhlXHJcbiAgICAgICAgLy8gaW5pdGlhbCBIVE1MIG9mIHRoZSBhcHAuXHJcbiAgICAgICAgIWl0ZW0ucGF0aC5zdGFydHNXaXRoKCdkeW5hbWljLycpKSB7XHJcbiAgICAgICAgYm9pbGVycGxhdGVCYXNlRGF0YS5qcy5wdXNoKGl0ZW1PYmopO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoaXRlbS50eXBlID09PSAnaGVhZCcpIHtcclxuICAgICAgICBib2lsZXJwbGF0ZUJhc2VEYXRhLmhlYWQgPVxyXG4gICAgICAgICAgcmVhZFV0ZjhGaWxlU3luYyhwYXRoTWFwcGVyKGl0ZW0ucGF0aCkpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoaXRlbS50eXBlID09PSAnYm9keScpIHtcclxuICAgICAgICBib2lsZXJwbGF0ZUJhc2VEYXRhLmJvZHkgPVxyXG4gICAgICAgICAgcmVhZFV0ZjhGaWxlU3luYyhwYXRoTWFwcGVyKGl0ZW0ucGF0aCkpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmJhc2VEYXRhID0gYm9pbGVycGxhdGVCYXNlRGF0YTtcclxuICB9XHJcbn07XHJcblxyXG4vLyBSZXR1cm5zIGEgdGVtcGxhdGUgZnVuY3Rpb24gdGhhdCwgd2hlbiBjYWxsZWQsIHByb2R1Y2VzIHRoZSBib2lsZXJwbGF0ZVxyXG4vLyBodG1sIGFzIGEgc3RyaW5nLlxyXG5mdW5jdGlvbiBnZXRUZW1wbGF0ZShhcmNoKSB7XHJcbiAgY29uc3QgcHJlZml4ID0gYXJjaC5zcGxpdChcIi5cIiwgMikuam9pbihcIi5cIik7XHJcblxyXG4gIGlmIChwcmVmaXggPT09IFwid2ViLmJyb3dzZXJcIikge1xyXG4gICAgcmV0dXJuIFdlYkJyb3dzZXJUZW1wbGF0ZTtcclxuICB9XHJcblxyXG4gIGlmIChwcmVmaXggPT09IFwid2ViLmNvcmRvdmFcIikge1xyXG4gICAgcmV0dXJuIFdlYkNvcmRvdmFUZW1wbGF0ZTtcclxuICB9XHJcblxyXG4gIHRocm93IG5ldyBFcnJvcihcIlVuc3VwcG9ydGVkIGFyY2g6IFwiICsgYXJjaCk7XHJcbn1cclxuIiwiaW1wb3J0IHRlbXBsYXRlIGZyb20gJy4vdGVtcGxhdGUnO1xyXG5cclxuY29uc3Qgc3JpID0gKHNyaSwgbW9kZSkgPT5cclxuICAoc3JpICYmIG1vZGUpID8gYCBpbnRlZ3JpdHk9XCJzaGE1MTItJHtzcml9XCIgY3Jvc3NvcmlnaW49XCIke21vZGV9XCJgIDogJyc7XHJcblxyXG5leHBvcnQgY29uc3QgaGVhZFRlbXBsYXRlID0gKHtcclxuICBjc3MsXHJcbiAgaHRtbEF0dHJpYnV0ZXMsXHJcbiAgYnVuZGxlZEpzQ3NzVXJsUmV3cml0ZUhvb2ssXHJcbiAgc3JpTW9kZSxcclxuICBoZWFkLFxyXG4gIGR5bmFtaWNIZWFkLFxyXG59KSA9PiB7XHJcbiAgdmFyIGhlYWRTZWN0aW9ucyA9IGhlYWQuc3BsaXQoLzxtZXRlb3ItYnVuZGxlZC1jc3NbXjw+XSo+LywgMik7XHJcbiAgdmFyIGNzc0J1bmRsZSA9IFsuLi4oY3NzIHx8IFtdKS5tYXAoZmlsZSA9PlxyXG4gICAgdGVtcGxhdGUoJyAgPGxpbmsgcmVsPVwic3R5bGVzaGVldFwiIHR5cGU9XCJ0ZXh0L2Nzc1wiIGNsYXNzPVwiX19tZXRlb3ItY3NzX19cIiBocmVmPVwiPCUtIGhyZWYgJT5cIjwlPSBzcmkgJT4+Jykoe1xyXG4gICAgICBocmVmOiBidW5kbGVkSnNDc3NVcmxSZXdyaXRlSG9vayhmaWxlLnVybCksXHJcbiAgICAgIHNyaTogc3JpKGZpbGUuc3JpLCBzcmlNb2RlKSxcclxuICAgIH0pXHJcbiAgKV0uam9pbignXFxuJyk7XHJcblxyXG4gIHJldHVybiBbXHJcbiAgICAnPGh0bWwnICsgT2JqZWN0LmtleXMoaHRtbEF0dHJpYnV0ZXMgfHwge30pLm1hcChcclxuICAgICAga2V5ID0+IHRlbXBsYXRlKCcgPCU9IGF0dHJOYW1lICU+PVwiPCUtIGF0dHJWYWx1ZSAlPlwiJykoe1xyXG4gICAgICAgIGF0dHJOYW1lOiBrZXksXHJcbiAgICAgICAgYXR0clZhbHVlOiBodG1sQXR0cmlidXRlc1trZXldLFxyXG4gICAgICB9KVxyXG4gICAgKS5qb2luKCcnKSArICc+JyxcclxuXHJcbiAgICAnPGhlYWQ+JyxcclxuXHJcbiAgICAoaGVhZFNlY3Rpb25zLmxlbmd0aCA9PT0gMSlcclxuICAgICAgPyBbY3NzQnVuZGxlLCBoZWFkU2VjdGlvbnNbMF1dLmpvaW4oJ1xcbicpXHJcbiAgICAgIDogW2hlYWRTZWN0aW9uc1swXSwgY3NzQnVuZGxlLCBoZWFkU2VjdGlvbnNbMV1dLmpvaW4oJ1xcbicpLFxyXG5cclxuICAgIGR5bmFtaWNIZWFkLFxyXG4gICAgJzwvaGVhZD4nLFxyXG4gICAgJzxib2R5PicsXHJcbiAgXS5qb2luKCdcXG4nKTtcclxufTtcclxuXHJcbi8vIFRlbXBsYXRlIGZ1bmN0aW9uIGZvciByZW5kZXJpbmcgdGhlIGJvaWxlcnBsYXRlIGh0bWwgZm9yIGJyb3dzZXJzXHJcbmV4cG9ydCBjb25zdCBjbG9zZVRlbXBsYXRlID0gKHtcclxuICBtZXRlb3JSdW50aW1lQ29uZmlnLFxyXG4gIHJvb3RVcmxQYXRoUHJlZml4LFxyXG4gIGlubGluZVNjcmlwdHNBbGxvd2VkLFxyXG4gIGpzLFxyXG4gIGFkZGl0aW9uYWxTdGF0aWNKcyxcclxuICBidW5kbGVkSnNDc3NVcmxSZXdyaXRlSG9vayxcclxuICBzcmlNb2RlLFxyXG59KSA9PiBbXHJcbiAgJycsXHJcbiAgaW5saW5lU2NyaXB0c0FsbG93ZWRcclxuICAgID8gdGVtcGxhdGUoJyAgPHNjcmlwdCB0eXBlPVwidGV4dC9qYXZhc2NyaXB0XCI+X19tZXRlb3JfcnVudGltZV9jb25maWdfXyA9IEpTT04ucGFyc2UoZGVjb2RlVVJJQ29tcG9uZW50KDwlPSBjb25mICU+KSk8L3NjcmlwdD4nKSh7XHJcbiAgICAgIGNvbmY6IG1ldGVvclJ1bnRpbWVDb25maWcsXHJcbiAgICB9KVxyXG4gICAgOiB0ZW1wbGF0ZSgnICA8c2NyaXB0IHR5cGU9XCJ0ZXh0L2phdmFzY3JpcHRcIiBzcmM9XCI8JS0gc3JjICU+L21ldGVvcl9ydW50aW1lX2NvbmZpZy5qc1wiPjwvc2NyaXB0PicpKHtcclxuICAgICAgc3JjOiByb290VXJsUGF0aFByZWZpeCxcclxuICAgIH0pLFxyXG4gICcnLFxyXG5cclxuICAuLi4oanMgfHwgW10pLm1hcChmaWxlID0+XHJcbiAgICB0ZW1wbGF0ZSgnICA8c2NyaXB0IHR5cGU9XCJ0ZXh0L2phdmFzY3JpcHRcIiBzcmM9XCI8JS0gc3JjICU+XCI8JT0gc3JpICU+Pjwvc2NyaXB0PicpKHtcclxuICAgICAgc3JjOiBidW5kbGVkSnNDc3NVcmxSZXdyaXRlSG9vayhmaWxlLnVybCksXHJcbiAgICAgIHNyaTogc3JpKGZpbGUuc3JpLCBzcmlNb2RlKSxcclxuICAgIH0pXHJcbiAgKSxcclxuXHJcbiAgLi4uKGFkZGl0aW9uYWxTdGF0aWNKcyB8fCBbXSkubWFwKCh7IGNvbnRlbnRzLCBwYXRobmFtZSB9KSA9PiAoXHJcbiAgICBpbmxpbmVTY3JpcHRzQWxsb3dlZFxyXG4gICAgICA/IHRlbXBsYXRlKCcgIDxzY3JpcHQ+PCU9IGNvbnRlbnRzICU+PC9zY3JpcHQ+Jykoe1xyXG4gICAgICAgIGNvbnRlbnRzLFxyXG4gICAgICB9KVxyXG4gICAgICA6IHRlbXBsYXRlKCcgIDxzY3JpcHQgdHlwZT1cInRleHQvamF2YXNjcmlwdFwiIHNyYz1cIjwlLSBzcmMgJT5cIj48L3NjcmlwdD4nKSh7XHJcbiAgICAgICAgc3JjOiByb290VXJsUGF0aFByZWZpeCArIHBhdGhuYW1lLFxyXG4gICAgICB9KVxyXG4gICkpLFxyXG5cclxuICAnJyxcclxuICAnJyxcclxuICAnPC9ib2R5PicsXHJcbiAgJzwvaHRtbD4nXHJcbl0uam9pbignXFxuJyk7XHJcbiIsImltcG9ydCB0ZW1wbGF0ZSBmcm9tICcuL3RlbXBsYXRlJztcclxuXHJcbi8vIFRlbXBsYXRlIGZ1bmN0aW9uIGZvciByZW5kZXJpbmcgdGhlIGJvaWxlcnBsYXRlIGh0bWwgZm9yIGNvcmRvdmFcclxuZXhwb3J0IGNvbnN0IGhlYWRUZW1wbGF0ZSA9ICh7XHJcbiAgbWV0ZW9yUnVudGltZUNvbmZpZyxcclxuICByb290VXJsUGF0aFByZWZpeCxcclxuICBpbmxpbmVTY3JpcHRzQWxsb3dlZCxcclxuICBjc3MsXHJcbiAganMsXHJcbiAgYWRkaXRpb25hbFN0YXRpY0pzLFxyXG4gIGh0bWxBdHRyaWJ1dGVzLFxyXG4gIGJ1bmRsZWRKc0Nzc1VybFJld3JpdGVIb29rLFxyXG4gIGhlYWQsXHJcbiAgZHluYW1pY0hlYWQsXHJcbn0pID0+IHtcclxuICB2YXIgaGVhZFNlY3Rpb25zID0gaGVhZC5zcGxpdCgvPG1ldGVvci1idW5kbGVkLWNzc1tePD5dKj4vLCAyKTtcclxuICB2YXIgY3NzQnVuZGxlID0gW1xyXG4gICAgLy8gV2UgYXJlIGV4cGxpY2l0bHkgbm90IHVzaW5nIGJ1bmRsZWRKc0Nzc1VybFJld3JpdGVIb29rOiBpbiBjb3Jkb3ZhIHdlIHNlcnZlIGFzc2V0cyB1cCBkaXJlY3RseSBmcm9tIGRpc2ssIHNvIHJld3JpdGluZyB0aGUgVVJMIGRvZXMgbm90IG1ha2Ugc2Vuc2VcclxuICAgIC4uLihjc3MgfHwgW10pLm1hcChmaWxlID0+XHJcbiAgICAgIHRlbXBsYXRlKCcgIDxsaW5rIHJlbD1cInN0eWxlc2hlZXRcIiB0eXBlPVwidGV4dC9jc3NcIiBjbGFzcz1cIl9fbWV0ZW9yLWNzc19fXCIgaHJlZj1cIjwlLSBocmVmICU+XCI+Jykoe1xyXG4gICAgICAgIGhyZWY6IGZpbGUudXJsLFxyXG4gICAgICB9KVxyXG4gICldLmpvaW4oJ1xcbicpO1xyXG5cclxuICByZXR1cm4gW1xyXG4gICAgJzxodG1sPicsXHJcbiAgICAnPGhlYWQ+JyxcclxuICAgICcgIDxtZXRhIGNoYXJzZXQ9XCJ1dGYtOFwiPicsXHJcbiAgICAnICA8bWV0YSBuYW1lPVwiZm9ybWF0LWRldGVjdGlvblwiIGNvbnRlbnQ9XCJ0ZWxlcGhvbmU9bm9cIj4nLFxyXG4gICAgJyAgPG1ldGEgbmFtZT1cInZpZXdwb3J0XCIgY29udGVudD1cInVzZXItc2NhbGFibGU9bm8sIGluaXRpYWwtc2NhbGU9MSwgbWF4aW11bS1zY2FsZT0xLCBtaW5pbXVtLXNjYWxlPTEsIHdpZHRoPWRldmljZS13aWR0aCwgaGVpZ2h0PWRldmljZS1oZWlnaHQsIHZpZXdwb3J0LWZpdD1jb3ZlclwiPicsXHJcbiAgICAnICA8bWV0YSBuYW1lPVwibXNhcHBsaWNhdGlvbi10YXAtaGlnaGxpZ2h0XCIgY29udGVudD1cIm5vXCI+JyxcclxuICAgICcgIDxtZXRhIGh0dHAtZXF1aXY9XCJDb250ZW50LVNlY3VyaXR5LVBvbGljeVwiIGNvbnRlbnQ9XCJkZWZhdWx0LXNyYyAqIGdhcDogZGF0YTogYmxvYjogXFwndW5zYWZlLWlubGluZVxcJyBcXCd1bnNhZmUtZXZhbFxcJyB3czogd3NzOjtcIj4nLFxyXG5cclxuICAoaGVhZFNlY3Rpb25zLmxlbmd0aCA9PT0gMSlcclxuICAgID8gW2Nzc0J1bmRsZSwgaGVhZFNlY3Rpb25zWzBdXS5qb2luKCdcXG4nKVxyXG4gICAgOiBbaGVhZFNlY3Rpb25zWzBdLCBjc3NCdW5kbGUsIGhlYWRTZWN0aW9uc1sxXV0uam9pbignXFxuJyksXHJcblxyXG4gICAgJyAgPHNjcmlwdCB0eXBlPVwidGV4dC9qYXZhc2NyaXB0XCI+JyxcclxuICAgIHRlbXBsYXRlKCcgICAgX19tZXRlb3JfcnVudGltZV9jb25maWdfXyA9IEpTT04ucGFyc2UoZGVjb2RlVVJJQ29tcG9uZW50KDwlPSBjb25mICU+KSk7Jykoe1xyXG4gICAgICBjb25mOiBtZXRlb3JSdW50aW1lQ29uZmlnLFxyXG4gICAgfSksXHJcbiAgICAnICAgIGlmICgvQW5kcm9pZC9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkpIHsnLFxyXG4gICAgLy8gV2hlbiBBbmRyb2lkIGFwcCBpcyBlbXVsYXRlZCwgaXQgY2Fubm90IGNvbm5lY3QgdG8gbG9jYWxob3N0LFxyXG4gICAgLy8gaW5zdGVhZCBpdCBzaG91bGQgY29ubmVjdCB0byAxMC4wLjIuMlxyXG4gICAgLy8gKHVubGVzcyB3ZVxcJ3JlIHVzaW5nIGFuIGh0dHAgcHJveHk7IHRoZW4gaXQgd29ya3MhKVxyXG4gICAgJyAgICAgIGlmICghX19tZXRlb3JfcnVudGltZV9jb25maWdfXy5odHRwUHJveHlQb3J0KSB7JyxcclxuICAgICcgICAgICAgIF9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18uUk9PVF9VUkwgPSAoX19tZXRlb3JfcnVudGltZV9jb25maWdfXy5ST09UX1VSTCB8fCBcXCdcXCcpLnJlcGxhY2UoL2xvY2FsaG9zdC9pLCBcXCcxMC4wLjIuMlxcJyk7JyxcclxuICAgICcgICAgICAgIF9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18uRERQX0RFRkFVTFRfQ09OTkVDVElPTl9VUkwgPSAoX19tZXRlb3JfcnVudGltZV9jb25maWdfXy5ERFBfREVGQVVMVF9DT05ORUNUSU9OX1VSTCB8fCBcXCdcXCcpLnJlcGxhY2UoL2xvY2FsaG9zdC9pLCBcXCcxMC4wLjIuMlxcJyk7JyxcclxuICAgICcgICAgICB9JyxcclxuICAgICcgICAgfScsXHJcbiAgICAnaWYoIWRvY3VtZW50LmJvZHkpe1xcbicgK1xyXG4gICAgJyAgICB2YXIgdGVtcEJvZHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYm9keVwiKTtcXG4nICtcclxuICAgICcgICAgZG9jdW1lbnQuYm9keSA9IHRlbXBCb2R5O1xcbicgK1xyXG4gICAgJyAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFxcJ0RPTUNvbnRlbnRMb2FkZWRcXCcsIChldmVudCkgPT4ge1xcbicgK1xyXG4gICAgJyAgICAgICAgdGVtcEJvZHkucmVtb3ZlKClcXG4nICtcclxuICAgICcgICAgfSk7XFxuJyArXHJcbiAgICAnfScsXHJcbiAgICAnICA8L3NjcmlwdD4nLFxyXG4gICAgJycsXHJcbiAgICAnICA8c2NyaXB0IHR5cGU9XCJ0ZXh0L2phdmFzY3JpcHRcIiBzcmM9XCIvY29yZG92YS5qc1wiPjwvc2NyaXB0PicsXHJcblxyXG4gICAgLi4uKGpzIHx8IFtdKS5tYXAoZmlsZSA9PlxyXG4gICAgICB0ZW1wbGF0ZSgnICA8c2NyaXB0IHR5cGU9XCJ0ZXh0L2phdmFzY3JpcHRcIiBzcmM9XCI8JS0gc3JjICU+XCI+PC9zY3JpcHQ+Jykoe1xyXG4gICAgICAgIHNyYzogZmlsZS51cmwsXHJcbiAgICAgIH0pXHJcbiAgICApLFxyXG5cclxuICAgIC4uLihhZGRpdGlvbmFsU3RhdGljSnMgfHwgW10pLm1hcCgoeyBjb250ZW50cywgcGF0aG5hbWUgfSkgPT4gKFxyXG4gICAgICBpbmxpbmVTY3JpcHRzQWxsb3dlZFxyXG4gICAgICAgID8gdGVtcGxhdGUoJyAgPHNjcmlwdD48JT0gY29udGVudHMgJT48L3NjcmlwdD4nKSh7XHJcbiAgICAgICAgICBjb250ZW50cyxcclxuICAgICAgICB9KVxyXG4gICAgICAgIDogdGVtcGxhdGUoJyAgPHNjcmlwdCB0eXBlPVwidGV4dC9qYXZhc2NyaXB0XCIgc3JjPVwiPCUtIHNyYyAlPlwiPjwvc2NyaXB0PicpKHtcclxuICAgICAgICAgIHNyYzogTWV0ZW9yLmFic29sdXRlVXJsKHBhdGhuYW1lKVxyXG4gICAgICAgIH0pXHJcbiAgICApKSxcclxuICAgICcnLFxyXG4gICAgJzwvaGVhZD4nLFxyXG4gICAgJycsXHJcbiAgICAnPGJvZHk+JyxcclxuICBdLmpvaW4oJ1xcbicpO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNsb3NlVGVtcGxhdGUoKSB7XHJcbiAgcmV0dXJuIFwiPC9ib2R5PlxcbjwvaHRtbD5cIjtcclxufVxyXG4iLCJpbXBvcnQgeyBfIH0gZnJvbSAnbWV0ZW9yL3VuZGVyc2NvcmUnO1xyXG5cclxuLy8gQXMgaWRlbnRpZmllZCBpbiBpc3N1ZSAjOTE0OSwgd2hlbiBhbiBhcHBsaWNhdGlvbiBvdmVycmlkZXMgdGhlIGRlZmF1bHRcclxuLy8gXy50ZW1wbGF0ZSBzZXR0aW5ncyB1c2luZyBfLnRlbXBsYXRlU2V0dGluZ3MsIHRob3NlIG5ldyBzZXR0aW5ncyBhcmVcclxuLy8gdXNlZCBhbnl3aGVyZSBfLnRlbXBsYXRlIGlzIHVzZWQsIGluY2x1ZGluZyB3aXRoaW4gdGhlXHJcbi8vIGJvaWxlcnBsYXRlLWdlbmVyYXRvci4gVG8gaGFuZGxlIHRoaXMsIF8udGVtcGxhdGUgc2V0dGluZ3MgdGhhdCBoYXZlXHJcbi8vIGJlZW4gdmVyaWZpZWQgdG8gd29yayBhcmUgb3ZlcnJpZGRlbiBoZXJlIG9uIGVhY2ggXy50ZW1wbGF0ZSBjYWxsLlxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB0ZW1wbGF0ZSh0ZXh0KSB7XHJcbiAgcmV0dXJuIF8udGVtcGxhdGUodGV4dCwgbnVsbCwge1xyXG4gICAgZXZhbHVhdGUgICAgOiAvPCUoW1xcc1xcU10rPyklPi9nLFxyXG4gICAgaW50ZXJwb2xhdGUgOiAvPCU9KFtcXHNcXFNdKz8pJT4vZyxcclxuICAgIGVzY2FwZSAgICAgIDogLzwlLShbXFxzXFxTXSs/KSU+L2csXHJcbiAgfSk7XHJcbn07XHJcbiJdfQ==
