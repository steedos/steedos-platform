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
  head = head.replace(/\/unpkg.com\//g, __meteor_runtime_config__.ROOT_URL + "/unpkg.com/");
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvYm9pbGVycGxhdGUtZ2VuZXJhdG9yL2dlbmVyYXRvci5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvYm9pbGVycGxhdGUtZ2VuZXJhdG9yL3RlbXBsYXRlLXdlYi5icm93c2VyLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9ib2lsZXJwbGF0ZS1nZW5lcmF0b3IvdGVtcGxhdGUtd2ViLmNvcmRvdmEuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2JvaWxlcnBsYXRlLWdlbmVyYXRvci90ZW1wbGF0ZS5qcyJdLCJuYW1lcyI6WyJfb2JqZWN0U3ByZWFkIiwibW9kdWxlIiwibGluayIsImRlZmF1bHQiLCJ2IiwiZXhwb3J0IiwiQm9pbGVycGxhdGUiLCJyZWFkRmlsZSIsImNyZWF0ZVN0cmVhbSIsImNyZWF0ZSIsIldlYkJyb3dzZXJUZW1wbGF0ZSIsIldlYkNvcmRvdmFUZW1wbGF0ZSIsInJlYWRVdGY4RmlsZVN5bmMiLCJmaWxlbmFtZSIsIk1ldGVvciIsIndyYXBBc3luYyIsImlkZW50aXR5IiwidmFsdWUiLCJhcHBlbmRUb1N0cmVhbSIsImNodW5rIiwic3RyZWFtIiwiYXBwZW5kIiwiQnVmZmVyIiwiZnJvbSIsImlzQnVmZmVyIiwicmVhZCIsInNob3VsZFdhcm5BYm91dFRvSFRNTERlcHJlY2F0aW9uIiwiaXNQcm9kdWN0aW9uIiwiY29uc3RydWN0b3IiLCJhcmNoIiwibWFuaWZlc3QiLCJvcHRpb25zIiwiaGVhZFRlbXBsYXRlIiwiY2xvc2VUZW1wbGF0ZSIsImdldFRlbXBsYXRlIiwiYmFzZURhdGEiLCJfZ2VuZXJhdGVCb2lsZXJwbGF0ZUZyb21NYW5pZmVzdCIsInRvSFRNTCIsImV4dHJhRGF0YSIsImNvbnNvbGUiLCJlcnJvciIsInRyYWNlIiwidG9IVE1MQXN5bmMiLCJhd2FpdCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwidG9IVE1MU3RyZWFtIiwiY2h1bmtzIiwib24iLCJwdXNoIiwiY29uY2F0IiwidG9TdHJpbmciLCJFcnJvciIsImRhdGEiLCJzdGFydCIsImJvZHkiLCJkeW5hbWljQm9keSIsImVuZCIsInJlc3BvbnNlIiwidXJsTWFwcGVyIiwicGF0aE1hcHBlciIsImJhc2VEYXRhRXh0ZW5zaW9uIiwiaW5saW5lIiwiYm9pbGVycGxhdGVCYXNlRGF0YSIsImNzcyIsImpzIiwiaGVhZCIsIm1ldGVvck1hbmlmZXN0IiwiSlNPTiIsInN0cmluZ2lmeSIsImZvckVhY2giLCJpdGVtIiwidXJsUGF0aCIsInVybCIsIml0ZW1PYmoiLCJzY3JpcHRDb250ZW50IiwicGF0aCIsInNyaSIsInR5cGUiLCJ3aGVyZSIsInN0YXJ0c1dpdGgiLCJwcmVmaXgiLCJzcGxpdCIsImpvaW4iLCJ0ZW1wbGF0ZSIsIm1vZGUiLCJodG1sQXR0cmlidXRlcyIsImJ1bmRsZWRKc0Nzc1VybFJld3JpdGVIb29rIiwic3JpTW9kZSIsImR5bmFtaWNIZWFkIiwiaGVhZFNlY3Rpb25zIiwiY3NzQnVuZGxlIiwibWFwIiwiZmlsZSIsImhyZWYiLCJPYmplY3QiLCJrZXlzIiwia2V5IiwiYXR0ck5hbWUiLCJhdHRyVmFsdWUiLCJsZW5ndGgiLCJtZXRlb3JSdW50aW1lQ29uZmlnIiwicm9vdFVybFBhdGhQcmVmaXgiLCJpbmxpbmVTY3JpcHRzQWxsb3dlZCIsImFkZGl0aW9uYWxTdGF0aWNKcyIsImNvbmYiLCJzcmMiLCJjb250ZW50cyIsInBhdGhuYW1lIiwicmVwbGFjZSIsIl9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18iLCJST09UX1VSTCIsImFic29sdXRlVXJsIiwiXyIsInRleHQiLCJldmFsdWF0ZSIsImludGVycG9sYXRlIiwiZXNjYXBlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSUEsYUFBSjs7QUFBa0JDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLHNDQUFaLEVBQW1EO0FBQUNDLFNBQU8sQ0FBQ0MsQ0FBRCxFQUFHO0FBQUNKLGlCQUFh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Q0FBVzhCLElBQVgsRUFBaUIsSUFBakIsRUFBdUI7QUFDNUJDLFlBQVEsRUFBTSxpQkFEYztBQUU1QkMsZUFBVyxFQUFHLGtCQUZjO0FBRzVCQyxVQUFNLEVBQVE7QUFIYyxHQUF2QixDQUFQO0FBS0Q7O0FBQUEsQyIsImZpbGUiOiIvcGFja2FnZXMvYm9pbGVycGxhdGUtZ2VuZXJhdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgcmVhZEZpbGUgfSBmcm9tICdmcyc7XG5pbXBvcnQgeyBjcmVhdGUgYXMgY3JlYXRlU3RyZWFtIH0gZnJvbSBcImNvbWJpbmVkLXN0cmVhbTJcIjtcblxuaW1wb3J0IFdlYkJyb3dzZXJUZW1wbGF0ZSBmcm9tICcuL3RlbXBsYXRlLXdlYi5icm93c2VyJztcbmltcG9ydCBXZWJDb3Jkb3ZhVGVtcGxhdGUgZnJvbSAnLi90ZW1wbGF0ZS13ZWIuY29yZG92YSc7XG5cbi8vIENvcGllZCBmcm9tIHdlYmFwcF9zZXJ2ZXJcbmNvbnN0IHJlYWRVdGY4RmlsZVN5bmMgPSBmaWxlbmFtZSA9PiBNZXRlb3Iud3JhcEFzeW5jKHJlYWRGaWxlKShmaWxlbmFtZSwgJ3V0ZjgnKTtcblxuY29uc3QgaWRlbnRpdHkgPSB2YWx1ZSA9PiB2YWx1ZTtcblxuZnVuY3Rpb24gYXBwZW5kVG9TdHJlYW0oY2h1bmssIHN0cmVhbSkge1xuICBpZiAodHlwZW9mIGNodW5rID09PSBcInN0cmluZ1wiKSB7XG4gICAgc3RyZWFtLmFwcGVuZChCdWZmZXIuZnJvbShjaHVuaywgXCJ1dGY4XCIpKTtcbiAgfSBlbHNlIGlmIChCdWZmZXIuaXNCdWZmZXIoY2h1bmspIHx8XG4gICAgICAgICAgICAgdHlwZW9mIGNodW5rLnJlYWQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHN0cmVhbS5hcHBlbmQoY2h1bmspO1xuICB9XG59XG5cbmxldCBzaG91bGRXYXJuQWJvdXRUb0hUTUxEZXByZWNhdGlvbiA9ICEgTWV0ZW9yLmlzUHJvZHVjdGlvbjtcblxuZXhwb3J0IGNsYXNzIEJvaWxlcnBsYXRlIHtcbiAgY29uc3RydWN0b3IoYXJjaCwgbWFuaWZlc3QsIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IHsgaGVhZFRlbXBsYXRlLCBjbG9zZVRlbXBsYXRlIH0gPSBnZXRUZW1wbGF0ZShhcmNoKTtcbiAgICB0aGlzLmhlYWRUZW1wbGF0ZSA9IGhlYWRUZW1wbGF0ZTtcbiAgICB0aGlzLmNsb3NlVGVtcGxhdGUgPSBjbG9zZVRlbXBsYXRlO1xuICAgIHRoaXMuYmFzZURhdGEgPSBudWxsO1xuXG4gICAgdGhpcy5fZ2VuZXJhdGVCb2lsZXJwbGF0ZUZyb21NYW5pZmVzdChcbiAgICAgIG1hbmlmZXN0LFxuICAgICAgb3B0aW9uc1xuICAgICk7XG4gIH1cblxuICB0b0hUTUwoZXh0cmFEYXRhKSB7XG4gICAgaWYgKHNob3VsZFdhcm5BYm91dFRvSFRNTERlcHJlY2F0aW9uKSB7XG4gICAgICBzaG91bGRXYXJuQWJvdXRUb0hUTUxEZXByZWNhdGlvbiA9IGZhbHNlO1xuICAgICAgY29uc29sZS5lcnJvcihcbiAgICAgICAgXCJUaGUgQm9pbGVycGxhdGUjdG9IVE1MIG1ldGhvZCBoYXMgYmVlbiBkZXByZWNhdGVkLiBcIiArXG4gICAgICAgICAgXCJQbGVhc2UgdXNlIEJvaWxlcnBsYXRlI3RvSFRNTFN0cmVhbSBpbnN0ZWFkLlwiXG4gICAgICApO1xuICAgICAgY29uc29sZS50cmFjZSgpO1xuICAgIH1cblxuICAgIC8vIENhbGxpbmcgLmF3YWl0KCkgcmVxdWlyZXMgYSBGaWJlci5cbiAgICByZXR1cm4gdGhpcy50b0hUTUxBc3luYyhleHRyYURhdGEpLmF3YWl0KCk7XG4gIH1cblxuICAvLyBSZXR1cm5zIGEgUHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIGEgc3RyaW5nIG9mIEhUTUwuXG4gIHRvSFRNTEFzeW5jKGV4dHJhRGF0YSkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCBzdHJlYW0gPSB0aGlzLnRvSFRNTFN0cmVhbShleHRyYURhdGEpO1xuICAgICAgY29uc3QgY2h1bmtzID0gW107XG4gICAgICBzdHJlYW0ub24oXCJkYXRhXCIsIGNodW5rID0+IGNodW5rcy5wdXNoKGNodW5rKSk7XG4gICAgICBzdHJlYW0ub24oXCJlbmRcIiwgKCkgPT4ge1xuICAgICAgICByZXNvbHZlKEJ1ZmZlci5jb25jYXQoY2h1bmtzKS50b1N0cmluZyhcInV0ZjhcIikpO1xuICAgICAgfSk7XG4gICAgICBzdHJlYW0ub24oXCJlcnJvclwiLCByZWplY3QpO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gVGhlICdleHRyYURhdGEnIGFyZ3VtZW50IGNhbiBiZSB1c2VkIHRvIGV4dGVuZCAnc2VsZi5iYXNlRGF0YScuIEl0c1xuICAvLyBwdXJwb3NlIGlzIHRvIGFsbG93IHlvdSB0byBzcGVjaWZ5IGRhdGEgdGhhdCB5b3UgbWlnaHQgbm90IGtub3cgYXRcbiAgLy8gdGhlIHRpbWUgdGhhdCB5b3UgY29uc3RydWN0IHRoZSBCb2lsZXJwbGF0ZSBvYmplY3QuIChlLmcuIGl0IGlzIHVzZWRcbiAgLy8gYnkgJ3dlYmFwcCcgdG8gc3BlY2lmeSBkYXRhIHRoYXQgaXMgb25seSBrbm93biBhdCByZXF1ZXN0LXRpbWUpLlxuICAvLyB0aGlzIHJldHVybnMgYSBzdHJlYW1cbiAgdG9IVE1MU3RyZWFtKGV4dHJhRGF0YSkge1xuICAgIGlmICghdGhpcy5iYXNlRGF0YSB8fCAhdGhpcy5oZWFkVGVtcGxhdGUgfHwgIXRoaXMuY2xvc2VUZW1wbGF0ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdCb2lsZXJwbGF0ZSBkaWQgbm90IGluc3RhbnRpYXRlIGNvcnJlY3RseS4nKTtcbiAgICB9XG5cbiAgICBjb25zdCBkYXRhID0gey4uLnRoaXMuYmFzZURhdGEsIC4uLmV4dHJhRGF0YX07XG4gICAgY29uc3Qgc3RhcnQgPSBcIjwhRE9DVFlQRSBodG1sPlxcblwiICsgdGhpcy5oZWFkVGVtcGxhdGUoZGF0YSk7XG5cbiAgICBjb25zdCB7IGJvZHksIGR5bmFtaWNCb2R5IH0gPSBkYXRhO1xuXG4gICAgY29uc3QgZW5kID0gdGhpcy5jbG9zZVRlbXBsYXRlKGRhdGEpO1xuICAgIGNvbnN0IHJlc3BvbnNlID0gY3JlYXRlU3RyZWFtKCk7XG5cbiAgICBhcHBlbmRUb1N0cmVhbShzdGFydCwgcmVzcG9uc2UpO1xuXG4gICAgaWYgKGJvZHkpIHtcbiAgICAgIGFwcGVuZFRvU3RyZWFtKGJvZHksIHJlc3BvbnNlKTtcbiAgICB9XG5cbiAgICBpZiAoZHluYW1pY0JvZHkpIHtcbiAgICAgIGFwcGVuZFRvU3RyZWFtKGR5bmFtaWNCb2R5LCByZXNwb25zZSk7XG4gICAgfVxuXG4gICAgYXBwZW5kVG9TdHJlYW0oZW5kLCByZXNwb25zZSk7XG5cbiAgICByZXR1cm4gcmVzcG9uc2U7XG4gIH1cblxuICAvLyBYWFggRXhwb3J0ZWQgdG8gYWxsb3cgY2xpZW50LXNpZGUgb25seSBjaGFuZ2VzIHRvIHJlYnVpbGQgdGhlIGJvaWxlcnBsYXRlXG4gIC8vIHdpdGhvdXQgcmVxdWlyaW5nIGEgZnVsbCBzZXJ2ZXIgcmVzdGFydC5cbiAgLy8gUHJvZHVjZXMgYW4gSFRNTCBzdHJpbmcgd2l0aCBnaXZlbiBtYW5pZmVzdCBhbmQgYm9pbGVycGxhdGVTb3VyY2UuXG4gIC8vIE9wdGlvbmFsbHkgdGFrZXMgdXJsTWFwcGVyIGluIGNhc2UgdXJscyBmcm9tIG1hbmlmZXN0IG5lZWQgdG8gYmUgcHJlZml4ZWRcbiAgLy8gb3IgcmV3cml0dGVuLlxuICAvLyBPcHRpb25hbGx5IHRha2VzIHBhdGhNYXBwZXIgZm9yIHJlc29sdmluZyByZWxhdGl2ZSBmaWxlIHN5c3RlbSBwYXRocy5cbiAgLy8gT3B0aW9uYWxseSBhbGxvd3MgdG8gb3ZlcnJpZGUgZmllbGRzIG9mIHRoZSBkYXRhIGNvbnRleHQuXG4gIF9nZW5lcmF0ZUJvaWxlcnBsYXRlRnJvbU1hbmlmZXN0KG1hbmlmZXN0LCB7XG4gICAgdXJsTWFwcGVyID0gaWRlbnRpdHksXG4gICAgcGF0aE1hcHBlciA9IGlkZW50aXR5LFxuICAgIGJhc2VEYXRhRXh0ZW5zaW9uLFxuICAgIGlubGluZSxcbiAgfSA9IHt9KSB7XG5cbiAgICBjb25zdCBib2lsZXJwbGF0ZUJhc2VEYXRhID0ge1xuICAgICAgY3NzOiBbXSxcbiAgICAgIGpzOiBbXSxcbiAgICAgIGhlYWQ6ICcnLFxuICAgICAgYm9keTogJycsXG4gICAgICBtZXRlb3JNYW5pZmVzdDogSlNPTi5zdHJpbmdpZnkobWFuaWZlc3QpLFxuICAgICAgLi4uYmFzZURhdGFFeHRlbnNpb24sXG4gICAgfTtcblxuICAgIG1hbmlmZXN0LmZvckVhY2goaXRlbSA9PiB7XG4gICAgICBjb25zdCB1cmxQYXRoID0gdXJsTWFwcGVyKGl0ZW0udXJsKTtcbiAgICAgIGNvbnN0IGl0ZW1PYmogPSB7IHVybDogdXJsUGF0aCB9O1xuXG4gICAgICBpZiAoaW5saW5lKSB7XG4gICAgICAgIGl0ZW1PYmouc2NyaXB0Q29udGVudCA9IHJlYWRVdGY4RmlsZVN5bmMoXG4gICAgICAgICAgcGF0aE1hcHBlcihpdGVtLnBhdGgpKTtcbiAgICAgICAgaXRlbU9iai5pbmxpbmUgPSB0cnVlO1xuICAgICAgfSBlbHNlIGlmIChpdGVtLnNyaSkge1xuICAgICAgICBpdGVtT2JqLnNyaSA9IGl0ZW0uc3JpO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXRlbS50eXBlID09PSAnY3NzJyAmJiBpdGVtLndoZXJlID09PSAnY2xpZW50Jykge1xuICAgICAgICBib2lsZXJwbGF0ZUJhc2VEYXRhLmNzcy5wdXNoKGl0ZW1PYmopO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXRlbS50eXBlID09PSAnanMnICYmIGl0ZW0ud2hlcmUgPT09ICdjbGllbnQnICYmXG4gICAgICAgIC8vIER5bmFtaWMgSlMgbW9kdWxlcyBzaG91bGQgbm90IGJlIGxvYWRlZCBlYWdlcmx5IGluIHRoZVxuICAgICAgICAvLyBpbml0aWFsIEhUTUwgb2YgdGhlIGFwcC5cbiAgICAgICAgIWl0ZW0ucGF0aC5zdGFydHNXaXRoKCdkeW5hbWljLycpKSB7XG4gICAgICAgIGJvaWxlcnBsYXRlQmFzZURhdGEuanMucHVzaChpdGVtT2JqKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGl0ZW0udHlwZSA9PT0gJ2hlYWQnKSB7XG4gICAgICAgIGJvaWxlcnBsYXRlQmFzZURhdGEuaGVhZCA9XG4gICAgICAgICAgcmVhZFV0ZjhGaWxlU3luYyhwYXRoTWFwcGVyKGl0ZW0ucGF0aCkpO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXRlbS50eXBlID09PSAnYm9keScpIHtcbiAgICAgICAgYm9pbGVycGxhdGVCYXNlRGF0YS5ib2R5ID1cbiAgICAgICAgICByZWFkVXRmOEZpbGVTeW5jKHBhdGhNYXBwZXIoaXRlbS5wYXRoKSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLmJhc2VEYXRhID0gYm9pbGVycGxhdGVCYXNlRGF0YTtcbiAgfVxufTtcblxuLy8gUmV0dXJucyBhIHRlbXBsYXRlIGZ1bmN0aW9uIHRoYXQsIHdoZW4gY2FsbGVkLCBwcm9kdWNlcyB0aGUgYm9pbGVycGxhdGVcbi8vIGh0bWwgYXMgYSBzdHJpbmcuXG5mdW5jdGlvbiBnZXRUZW1wbGF0ZShhcmNoKSB7XG4gIGNvbnN0IHByZWZpeCA9IGFyY2guc3BsaXQoXCIuXCIsIDIpLmpvaW4oXCIuXCIpO1xuXG4gIGlmIChwcmVmaXggPT09IFwid2ViLmJyb3dzZXJcIikge1xuICAgIHJldHVybiBXZWJCcm93c2VyVGVtcGxhdGU7XG4gIH1cblxuICBpZiAocHJlZml4ID09PSBcIndlYi5jb3Jkb3ZhXCIpIHtcbiAgICByZXR1cm4gV2ViQ29yZG92YVRlbXBsYXRlO1xuICB9XG5cbiAgdGhyb3cgbmV3IEVycm9yKFwiVW5zdXBwb3J0ZWQgYXJjaDogXCIgKyBhcmNoKTtcbn1cbiIsImltcG9ydCB0ZW1wbGF0ZSBmcm9tICcuL3RlbXBsYXRlJztcblxuY29uc3Qgc3JpID0gKHNyaSwgbW9kZSkgPT5cbiAgKHNyaSAmJiBtb2RlKSA/IGAgaW50ZWdyaXR5PVwic2hhNTEyLSR7c3JpfVwiIGNyb3Nzb3JpZ2luPVwiJHttb2RlfVwiYCA6ICcnO1xuXG5leHBvcnQgY29uc3QgaGVhZFRlbXBsYXRlID0gKHtcbiAgY3NzLFxuICBodG1sQXR0cmlidXRlcyxcbiAgYnVuZGxlZEpzQ3NzVXJsUmV3cml0ZUhvb2ssXG4gIHNyaU1vZGUsXG4gIGhlYWQsXG4gIGR5bmFtaWNIZWFkLFxufSkgPT4ge1xuICB2YXIgaGVhZFNlY3Rpb25zID0gaGVhZC5zcGxpdCgvPG1ldGVvci1idW5kbGVkLWNzc1tePD5dKj4vLCAyKTtcbiAgdmFyIGNzc0J1bmRsZSA9IFsuLi4oY3NzIHx8IFtdKS5tYXAoZmlsZSA9PlxuICAgIHRlbXBsYXRlKCcgIDxsaW5rIHJlbD1cInN0eWxlc2hlZXRcIiB0eXBlPVwidGV4dC9jc3NcIiBjbGFzcz1cIl9fbWV0ZW9yLWNzc19fXCIgaHJlZj1cIjwlLSBocmVmICU+XCI8JT0gc3JpICU+PicpKHtcbiAgICAgIGhyZWY6IGJ1bmRsZWRKc0Nzc1VybFJld3JpdGVIb29rKGZpbGUudXJsKSxcbiAgICAgIHNyaTogc3JpKGZpbGUuc3JpLCBzcmlNb2RlKSxcbiAgICB9KVxuICApXS5qb2luKCdcXG4nKTtcblxuICByZXR1cm4gW1xuICAgICc8aHRtbCcgKyBPYmplY3Qua2V5cyhodG1sQXR0cmlidXRlcyB8fCB7fSkubWFwKFxuICAgICAga2V5ID0+IHRlbXBsYXRlKCcgPCU9IGF0dHJOYW1lICU+PVwiPCUtIGF0dHJWYWx1ZSAlPlwiJykoe1xuICAgICAgICBhdHRyTmFtZToga2V5LFxuICAgICAgICBhdHRyVmFsdWU6IGh0bWxBdHRyaWJ1dGVzW2tleV0sXG4gICAgICB9KVxuICAgICkuam9pbignJykgKyAnPicsXG5cbiAgICAnPGhlYWQ+JyxcblxuICAgIChoZWFkU2VjdGlvbnMubGVuZ3RoID09PSAxKVxuICAgICAgPyBbY3NzQnVuZGxlLCBoZWFkU2VjdGlvbnNbMF1dLmpvaW4oJ1xcbicpXG4gICAgICA6IFtoZWFkU2VjdGlvbnNbMF0sIGNzc0J1bmRsZSwgaGVhZFNlY3Rpb25zWzFdXS5qb2luKCdcXG4nKSxcblxuICAgIGR5bmFtaWNIZWFkLFxuICAgICc8L2hlYWQ+JyxcbiAgICAnPGJvZHk+JyxcbiAgXS5qb2luKCdcXG4nKTtcbn07XG5cbi8vIFRlbXBsYXRlIGZ1bmN0aW9uIGZvciByZW5kZXJpbmcgdGhlIGJvaWxlcnBsYXRlIGh0bWwgZm9yIGJyb3dzZXJzXG5leHBvcnQgY29uc3QgY2xvc2VUZW1wbGF0ZSA9ICh7XG4gIG1ldGVvclJ1bnRpbWVDb25maWcsXG4gIHJvb3RVcmxQYXRoUHJlZml4LFxuICBpbmxpbmVTY3JpcHRzQWxsb3dlZCxcbiAganMsXG4gIGFkZGl0aW9uYWxTdGF0aWNKcyxcbiAgYnVuZGxlZEpzQ3NzVXJsUmV3cml0ZUhvb2ssXG4gIHNyaU1vZGUsXG59KSA9PiBbXG4gICcnLFxuICBpbmxpbmVTY3JpcHRzQWxsb3dlZFxuICAgID8gdGVtcGxhdGUoJyAgPHNjcmlwdCB0eXBlPVwidGV4dC9qYXZhc2NyaXB0XCI+X19tZXRlb3JfcnVudGltZV9jb25maWdfXyA9IEpTT04ucGFyc2UoZGVjb2RlVVJJQ29tcG9uZW50KDwlPSBjb25mICU+KSk8L3NjcmlwdD4nKSh7XG4gICAgICBjb25mOiBtZXRlb3JSdW50aW1lQ29uZmlnLFxuICAgIH0pXG4gICAgOiB0ZW1wbGF0ZSgnICA8c2NyaXB0IHR5cGU9XCJ0ZXh0L2phdmFzY3JpcHRcIiBzcmM9XCI8JS0gc3JjICU+L21ldGVvcl9ydW50aW1lX2NvbmZpZy5qc1wiPjwvc2NyaXB0PicpKHtcbiAgICAgIHNyYzogcm9vdFVybFBhdGhQcmVmaXgsXG4gICAgfSksXG4gICcnLFxuXG4gIC4uLihqcyB8fCBbXSkubWFwKGZpbGUgPT5cbiAgICB0ZW1wbGF0ZSgnICA8c2NyaXB0IHR5cGU9XCJ0ZXh0L2phdmFzY3JpcHRcIiBzcmM9XCI8JS0gc3JjICU+XCI8JT0gc3JpICU+Pjwvc2NyaXB0PicpKHtcbiAgICAgIHNyYzogYnVuZGxlZEpzQ3NzVXJsUmV3cml0ZUhvb2soZmlsZS51cmwpLFxuICAgICAgc3JpOiBzcmkoZmlsZS5zcmksIHNyaU1vZGUpLFxuICAgIH0pXG4gICksXG5cbiAgLi4uKGFkZGl0aW9uYWxTdGF0aWNKcyB8fCBbXSkubWFwKCh7IGNvbnRlbnRzLCBwYXRobmFtZSB9KSA9PiAoXG4gICAgaW5saW5lU2NyaXB0c0FsbG93ZWRcbiAgICAgID8gdGVtcGxhdGUoJyAgPHNjcmlwdD48JT0gY29udGVudHMgJT48L3NjcmlwdD4nKSh7XG4gICAgICAgIGNvbnRlbnRzLFxuICAgICAgfSlcbiAgICAgIDogdGVtcGxhdGUoJyAgPHNjcmlwdCB0eXBlPVwidGV4dC9qYXZhc2NyaXB0XCIgc3JjPVwiPCUtIHNyYyAlPlwiPjwvc2NyaXB0PicpKHtcbiAgICAgICAgc3JjOiByb290VXJsUGF0aFByZWZpeCArIHBhdGhuYW1lLFxuICAgICAgfSlcbiAgKSksXG5cbiAgJycsXG4gICcnLFxuICAnPC9ib2R5PicsXG4gICc8L2h0bWw+J1xuXS5qb2luKCdcXG4nKTtcbiIsImltcG9ydCB0ZW1wbGF0ZSBmcm9tICcuL3RlbXBsYXRlJztcblxuLy8gVGVtcGxhdGUgZnVuY3Rpb24gZm9yIHJlbmRlcmluZyB0aGUgYm9pbGVycGxhdGUgaHRtbCBmb3IgY29yZG92YVxuZXhwb3J0IGNvbnN0IGhlYWRUZW1wbGF0ZSA9ICh7XG4gIG1ldGVvclJ1bnRpbWVDb25maWcsXG4gIHJvb3RVcmxQYXRoUHJlZml4LFxuICBpbmxpbmVTY3JpcHRzQWxsb3dlZCxcbiAgY3NzLFxuICBqcyxcbiAgYWRkaXRpb25hbFN0YXRpY0pzLFxuICBodG1sQXR0cmlidXRlcyxcbiAgYnVuZGxlZEpzQ3NzVXJsUmV3cml0ZUhvb2ssXG4gIGhlYWQsXG4gIGR5bmFtaWNIZWFkLFxufSkgPT4ge1xuICBoZWFkID0gaGVhZC5yZXBsYWNlKC9cXC91bnBrZy5jb21cXC8vZywgX19tZXRlb3JfcnVudGltZV9jb25maWdfXy5ST09UX1VSTCArIFwiL3VucGtnLmNvbS9cIik7XG4gIHZhciBoZWFkU2VjdGlvbnMgPSBoZWFkLnNwbGl0KC88bWV0ZW9yLWJ1bmRsZWQtY3NzW148Pl0qPi8sIDIpO1xuICB2YXIgY3NzQnVuZGxlID0gW1xuICAgIC8vIFdlIGFyZSBleHBsaWNpdGx5IG5vdCB1c2luZyBidW5kbGVkSnNDc3NVcmxSZXdyaXRlSG9vazogaW4gY29yZG92YSB3ZSBzZXJ2ZSBhc3NldHMgdXAgZGlyZWN0bHkgZnJvbSBkaXNrLCBzbyByZXdyaXRpbmcgdGhlIFVSTCBkb2VzIG5vdCBtYWtlIHNlbnNlXG4gICAgLi4uKGNzcyB8fCBbXSkubWFwKGZpbGUgPT5cbiAgICAgIHRlbXBsYXRlKCcgIDxsaW5rIHJlbD1cInN0eWxlc2hlZXRcIiB0eXBlPVwidGV4dC9jc3NcIiBjbGFzcz1cIl9fbWV0ZW9yLWNzc19fXCIgaHJlZj1cIjwlLSBocmVmICU+XCI+Jykoe1xuICAgICAgICBocmVmOiBmaWxlLnVybCxcbiAgICAgIH0pXG4gICldLmpvaW4oJ1xcbicpO1xuXG4gIHJldHVybiBbXG4gICAgJzxodG1sPicsXG4gICAgJzxoZWFkPicsXG4gICAgJyAgPG1ldGEgY2hhcnNldD1cInV0Zi04XCI+JyxcbiAgICAnICA8bWV0YSBuYW1lPVwiZm9ybWF0LWRldGVjdGlvblwiIGNvbnRlbnQ9XCJ0ZWxlcGhvbmU9bm9cIj4nLFxuICAgICcgIDxtZXRhIG5hbWU9XCJ2aWV3cG9ydFwiIGNvbnRlbnQ9XCJ1c2VyLXNjYWxhYmxlPW5vLCBpbml0aWFsLXNjYWxlPTEsIG1heGltdW0tc2NhbGU9MSwgbWluaW11bS1zY2FsZT0xLCB3aWR0aD1kZXZpY2Utd2lkdGgsIGhlaWdodD1kZXZpY2UtaGVpZ2h0LCB2aWV3cG9ydC1maXQ9Y292ZXJcIj4nLFxuICAgICcgIDxtZXRhIG5hbWU9XCJtc2FwcGxpY2F0aW9uLXRhcC1oaWdobGlnaHRcIiBjb250ZW50PVwibm9cIj4nLFxuICAgICcgIDxtZXRhIGh0dHAtZXF1aXY9XCJDb250ZW50LVNlY3VyaXR5LVBvbGljeVwiIGNvbnRlbnQ9XCJkZWZhdWx0LXNyYyAqIGdhcDogZGF0YTogYmxvYjogXFwndW5zYWZlLWlubGluZVxcJyBcXCd1bnNhZmUtZXZhbFxcJyB3czogd3NzOjtcIj4nLFxuXG4gIChoZWFkU2VjdGlvbnMubGVuZ3RoID09PSAxKVxuICAgID8gW2Nzc0J1bmRsZSwgaGVhZFNlY3Rpb25zWzBdXS5qb2luKCdcXG4nKVxuICAgIDogW2hlYWRTZWN0aW9uc1swXSwgY3NzQnVuZGxlLCBoZWFkU2VjdGlvbnNbMV1dLmpvaW4oJ1xcbicpLFxuXG4gICAgJyAgPHNjcmlwdCB0eXBlPVwidGV4dC9qYXZhc2NyaXB0XCI+JyxcbiAgICB0ZW1wbGF0ZSgnICAgIF9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18gPSBKU09OLnBhcnNlKGRlY29kZVVSSUNvbXBvbmVudCg8JT0gY29uZiAlPikpOycpKHtcbiAgICAgIGNvbmY6IG1ldGVvclJ1bnRpbWVDb25maWcsXG4gICAgfSksXG4gICAgJyAgICBpZiAoL0FuZHJvaWQvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpKSB7JyxcbiAgICAvLyBXaGVuIEFuZHJvaWQgYXBwIGlzIGVtdWxhdGVkLCBpdCBjYW5ub3QgY29ubmVjdCB0byBsb2NhbGhvc3QsXG4gICAgLy8gaW5zdGVhZCBpdCBzaG91bGQgY29ubmVjdCB0byAxMC4wLjIuMlxuICAgIC8vICh1bmxlc3Mgd2VcXCdyZSB1c2luZyBhbiBodHRwIHByb3h5OyB0aGVuIGl0IHdvcmtzISlcbiAgICAnICAgICAgaWYgKCFfX21ldGVvcl9ydW50aW1lX2NvbmZpZ19fLmh0dHBQcm94eVBvcnQpIHsnLFxuICAgICcgICAgICAgIF9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18uUk9PVF9VUkwgPSAoX19tZXRlb3JfcnVudGltZV9jb25maWdfXy5ST09UX1VSTCB8fCBcXCdcXCcpLnJlcGxhY2UoL2xvY2FsaG9zdC9pLCBcXCcxMC4wLjIuMlxcJyk7JyxcbiAgICAnICAgICAgICBfX21ldGVvcl9ydW50aW1lX2NvbmZpZ19fLkREUF9ERUZBVUxUX0NPTk5FQ1RJT05fVVJMID0gKF9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18uRERQX0RFRkFVTFRfQ09OTkVDVElPTl9VUkwgfHwgXFwnXFwnKS5yZXBsYWNlKC9sb2NhbGhvc3QvaSwgXFwnMTAuMC4yLjJcXCcpOycsXG4gICAgJyAgICAgIH0nLFxuICAgICcgICAgfScsXG4gICAgJ2lmKCFkb2N1bWVudC5ib2R5KXtcXG4nICtcbiAgICAnICAgIHZhciB0ZW1wQm9keSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJib2R5XCIpO1xcbicgK1xuICAgICcgICAgZG9jdW1lbnQuYm9keSA9IHRlbXBCb2R5O1xcbicgK1xuICAgICcgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcXCdET01Db250ZW50TG9hZGVkXFwnLCAoZXZlbnQpID0+IHtcXG4nICtcbiAgICAnICAgICAgICB0ZW1wQm9keS5yZW1vdmUoKVxcbicgK1xuICAgICcgICAgfSk7XFxuJyArXG4gICAgJ30nLFxuICAgICcgIDwvc2NyaXB0PicsXG4gICAgJycsXG4gICAgJyAgPHNjcmlwdCB0eXBlPVwidGV4dC9qYXZhc2NyaXB0XCIgc3JjPVwiL2NvcmRvdmEuanNcIj48L3NjcmlwdD4nLFxuXG4gICAgLi4uKGpzIHx8IFtdKS5tYXAoZmlsZSA9PlxuICAgICAgdGVtcGxhdGUoJyAgPHNjcmlwdCB0eXBlPVwidGV4dC9qYXZhc2NyaXB0XCIgc3JjPVwiPCUtIHNyYyAlPlwiPjwvc2NyaXB0PicpKHtcbiAgICAgICAgc3JjOiBmaWxlLnVybCxcbiAgICAgIH0pXG4gICAgKSxcblxuICAgIC4uLihhZGRpdGlvbmFsU3RhdGljSnMgfHwgW10pLm1hcCgoeyBjb250ZW50cywgcGF0aG5hbWUgfSkgPT4gKFxuICAgICAgaW5saW5lU2NyaXB0c0FsbG93ZWRcbiAgICAgICAgPyB0ZW1wbGF0ZSgnICA8c2NyaXB0PjwlPSBjb250ZW50cyAlPjwvc2NyaXB0PicpKHtcbiAgICAgICAgICBjb250ZW50cyxcbiAgICAgICAgfSlcbiAgICAgICAgOiB0ZW1wbGF0ZSgnICA8c2NyaXB0IHR5cGU9XCJ0ZXh0L2phdmFzY3JpcHRcIiBzcmM9XCI8JS0gc3JjICU+XCI+PC9zY3JpcHQ+Jykoe1xuICAgICAgICAgIHNyYzogTWV0ZW9yLmFic29sdXRlVXJsKHBhdGhuYW1lKVxuICAgICAgICB9KVxuICAgICkpLFxuICAgICcnLFxuICAgICc8L2hlYWQ+JyxcbiAgICAnJyxcbiAgICAnPGJvZHk+JyxcbiAgXS5qb2luKCdcXG4nKTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBjbG9zZVRlbXBsYXRlKCkge1xuICByZXR1cm4gXCI8L2JvZHk+XFxuPC9odG1sPlwiO1xufVxuIiwiaW1wb3J0IHsgXyB9IGZyb20gJ21ldGVvci91bmRlcnNjb3JlJztcblxuLy8gQXMgaWRlbnRpZmllZCBpbiBpc3N1ZSAjOTE0OSwgd2hlbiBhbiBhcHBsaWNhdGlvbiBvdmVycmlkZXMgdGhlIGRlZmF1bHRcbi8vIF8udGVtcGxhdGUgc2V0dGluZ3MgdXNpbmcgXy50ZW1wbGF0ZVNldHRpbmdzLCB0aG9zZSBuZXcgc2V0dGluZ3MgYXJlXG4vLyB1c2VkIGFueXdoZXJlIF8udGVtcGxhdGUgaXMgdXNlZCwgaW5jbHVkaW5nIHdpdGhpbiB0aGVcbi8vIGJvaWxlcnBsYXRlLWdlbmVyYXRvci4gVG8gaGFuZGxlIHRoaXMsIF8udGVtcGxhdGUgc2V0dGluZ3MgdGhhdCBoYXZlXG4vLyBiZWVuIHZlcmlmaWVkIHRvIHdvcmsgYXJlIG92ZXJyaWRkZW4gaGVyZSBvbiBlYWNoIF8udGVtcGxhdGUgY2FsbC5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHRlbXBsYXRlKHRleHQpIHtcbiAgcmV0dXJuIF8udGVtcGxhdGUodGV4dCwgbnVsbCwge1xuICAgIGV2YWx1YXRlICAgIDogLzwlKFtcXHNcXFNdKz8pJT4vZyxcbiAgICBpbnRlcnBvbGF0ZSA6IC88JT0oW1xcc1xcU10rPyklPi9nLFxuICAgIGVzY2FwZSAgICAgIDogLzwlLShbXFxzXFxTXSs/KSU+L2csXG4gIH0pO1xufTtcbiJdfQ==
