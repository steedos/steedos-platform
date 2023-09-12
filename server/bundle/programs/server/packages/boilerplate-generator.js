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
var value, Boilerplate;

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

const evalEnv = function () {
  var regexp = /\${([^}]+)}/g;
  return function (str, o) {
    return str.replace(regexp, function (ignore, key) {
      if (key === 'PLATFORM') {
        return 'browser';
      }

      return key === 'ROOT_URL' ? '' : (value = o[key]) == null ? '' : value;
    });
  };
}();

const headTemplate = (_ref) => {
  let {
    css,
    htmlAttributes,
    bundledJsCssUrlRewriteHook,
    sriMode,
    head,
    dynamicHead
  } = _ref;
  const replacedHead = evalEnv(head, process.env);
  var headSections = replacedHead.split(/<meteor-bundled-css[^<>]*>/, 2);
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
  }), '', ...(js || []).map(file => template('  <script type="text/javascript">delete window.jQuery;delete window.$;loadJs("<%- src %>")</script>')({
    src: bundledJsCssUrlRewriteHook(file.url),
    sri: sri(file.sri, sriMode)
  })), ...(additionalStaticJs || []).map((_ref3) => {
    let {
      contents,
      pathname
    } = _ref3;
    return inlineScriptsAllowed ? template('  <script><%= contents %></script>')({
      contents
    }) : template('  <script type="text/javascript">loadJs("<%- src %>")</script>')({
      src: rootUrlPathPrefix + pathname
    });
  }), '<script>window._ = window.lodash;</script>', '', '', '</body>', '</html>'].join('\n');
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

const evalEnv = function () {
  var regexp = /\${([^}]+)}/g;
  return function (str, o) {
    return str.replace(regexp, function (ignore, key) {
      if (key === 'PLATFORM') {
        return 'cordova';
      }

      return (value = o[key]) == null ? '' : value;
    });
  };
}(); // Template function for rendering the boilerplate html for cordova


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
  const replacedHead = evalEnv(head, process.env);
  var headSections = replacedHead.split(/<meteor-bundled-css[^<>]*>/, 2);
  var cssBundle = [// We are explicitly not using bundledJsCssUrlRewriteHook: in cordova we serve assets up directly from disk, so rewriting the URL does not make sense
  ...(css || []).map(file => template('  <link rel="stylesheet" type="text/css" class="__meteor-css__" href="<%- href %>">')({
    href: file.url
  }))].join('\n');
  return ['<html>', '<head>', '  <meta charset="utf-8">', '  <meta name="format-detection" content="telephone=no">', '  <meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, height=device-height, viewport-fit=cover">', '  <meta name="msapplication-tap-highlight" content="no">', '  <meta http-equiv="Content-Security-Policy" content="default-src * gap: data: blob: \'unsafe-inline\' \'unsafe-eval\' ws: wss:;">', headSections.length === 1 ? [cssBundle, headSections[0]].join('\n') : [headSections[0], cssBundle, headSections[1]].join('\n'), '  <script type="text/javascript">', template('    __meteor_runtime_config__ = JSON.parse(decodeURIComponent(<%= conf %>));')({
    conf: meteorRuntimeConfig
  }), '    if (/Android/i.test(navigator.userAgent)) {', // When Android app is emulated, it cannot connect to localhost,
  // instead it should connect to 10.0.2.2
  // (unless we\'re using an http proxy; then it works!)
  '      if (!__meteor_runtime_config__.httpProxyPort) {', '        __meteor_runtime_config__.ROOT_URL = (__meteor_runtime_config__.ROOT_URL || \'\').replace(/localhost/i, \'10.0.2.2\');', '        __meteor_runtime_config__.DDP_DEFAULT_CONNECTION_URL = (__meteor_runtime_config__.DDP_DEFAULT_CONNECTION_URL || \'\').replace(/localhost/i, \'10.0.2.2\');', '      }', '    }', 'if(!document.body){\n' + '    var tempBody = document.createElement("body");\n' + '    document.body = tempBody;\n' + '    document.addEventListener(\'DOMContentLoaded\', (event) => {\n' + '        tempBody.remove()\n' + '    });\n' + '}', '  </script>', '', '  <script type="text/javascript" src="/cordova.js"></script>', ...(js || []).map(file => template('  <script type="text/javascript">loadJs("<%- src %>")</script>')({
    src: file.url
  })), ...(additionalStaticJs || []).map((_ref2) => {
    let {
      contents,
      pathname
    } = _ref2;
    return inlineScriptsAllowed ? template('  <script><%= contents %></script>')({
      contents
    }) : template('  <script type="text/javascript">loadJs("<%- src %>")</script>')({
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvYm9pbGVycGxhdGUtZ2VuZXJhdG9yL2dlbmVyYXRvci5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvYm9pbGVycGxhdGUtZ2VuZXJhdG9yL3RlbXBsYXRlLXdlYi5icm93c2VyLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9ib2lsZXJwbGF0ZS1nZW5lcmF0b3IvdGVtcGxhdGUtd2ViLmNvcmRvdmEuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2JvaWxlcnBsYXRlLWdlbmVyYXRvci90ZW1wbGF0ZS5qcyJdLCJuYW1lcyI6WyJfb2JqZWN0U3ByZWFkIiwibW9kdWxlIiwibGluayIsImRlZmF1bHQiLCJ2IiwiZXhwb3J0IiwiQm9pbGVycGxhdGUiLCJyZWFkRmlsZSIsImNyZWF0ZVN0cmVhbSIsImNyZWF0ZSIsIldlYkJyb3dzZXJUZW1wbGF0ZSIsIldlYkNvcmRvdmFUZW1wbGF0ZSIsInJlYWRVdGY4RmlsZVN5bmMiLCJmaWxlbmFtZSIsIk1ldGVvciIsIndyYXBBc3luYyIsImlkZW50aXR5IiwidmFsdWUiLCJhcHBlbmRUb1N0cmVhbSIsImNodW5rIiwic3RyZWFtIiwiYXBwZW5kIiwiQnVmZmVyIiwiZnJvbSIsImlzQnVmZmVyIiwicmVhZCIsInNob3VsZFdhcm5BYm91dFRvSFRNTERlcHJlY2F0aW9uIiwiaXNQcm9kdWN0aW9uIiwiY29uc3RydWN0b3IiLCJhcmNoIiwibWFuaWZlc3QiLCJvcHRpb25zIiwiaGVhZFRlbXBsYXRlIiwiY2xvc2VUZW1wbGF0ZSIsImdldFRlbXBsYXRlIiwiYmFzZURhdGEiLCJfZ2VuZXJhdGVCb2lsZXJwbGF0ZUZyb21NYW5pZmVzdCIsInRvSFRNTCIsImV4dHJhRGF0YSIsImNvbnNvbGUiLCJlcnJvciIsInRyYWNlIiwidG9IVE1MQXN5bmMiLCJhd2FpdCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwidG9IVE1MU3RyZWFtIiwiY2h1bmtzIiwib24iLCJwdXNoIiwiY29uY2F0IiwidG9TdHJpbmciLCJFcnJvciIsImRhdGEiLCJzdGFydCIsImJvZHkiLCJkeW5hbWljQm9keSIsImVuZCIsInJlc3BvbnNlIiwidXJsTWFwcGVyIiwicGF0aE1hcHBlciIsImJhc2VEYXRhRXh0ZW5zaW9uIiwiaW5saW5lIiwiYm9pbGVycGxhdGVCYXNlRGF0YSIsImNzcyIsImpzIiwiaGVhZCIsIm1ldGVvck1hbmlmZXN0IiwiSlNPTiIsInN0cmluZ2lmeSIsImZvckVhY2giLCJpdGVtIiwidXJsUGF0aCIsInVybCIsIml0ZW1PYmoiLCJzY3JpcHRDb250ZW50IiwicGF0aCIsInNyaSIsInR5cGUiLCJ3aGVyZSIsInN0YXJ0c1dpdGgiLCJwcmVmaXgiLCJzcGxpdCIsImpvaW4iLCJ0ZW1wbGF0ZSIsIm1vZGUiLCJldmFsRW52IiwicmVnZXhwIiwic3RyIiwibyIsInJlcGxhY2UiLCJpZ25vcmUiLCJrZXkiLCJodG1sQXR0cmlidXRlcyIsImJ1bmRsZWRKc0Nzc1VybFJld3JpdGVIb29rIiwic3JpTW9kZSIsImR5bmFtaWNIZWFkIiwicmVwbGFjZWRIZWFkIiwicHJvY2VzcyIsImVudiIsImhlYWRTZWN0aW9ucyIsImNzc0J1bmRsZSIsIm1hcCIsImZpbGUiLCJocmVmIiwiT2JqZWN0Iiwia2V5cyIsImF0dHJOYW1lIiwiYXR0clZhbHVlIiwibGVuZ3RoIiwibWV0ZW9yUnVudGltZUNvbmZpZyIsInJvb3RVcmxQYXRoUHJlZml4IiwiaW5saW5lU2NyaXB0c0FsbG93ZWQiLCJhZGRpdGlvbmFsU3RhdGljSnMiLCJjb25mIiwic3JjIiwiY29udGVudHMiLCJwYXRobmFtZSIsImFic29sdXRlVXJsIiwiXyIsInRleHQiLCJldmFsdWF0ZSIsImludGVycG9sYXRlIiwiZXNjYXBlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSUEsYUFBSjs7QUFBa0JDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLHNDQUFaLEVBQW1EO0FBQUNDLFNB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LGlCQURjO0FBRTVCQyxlQUFXLEVBQUcsa0JBRmM7QUFHNUJDLFVBQU0sRUFBUTtBQUhjLEdBQXZCLENBQVA7QUFLRDs7QUFBQSxDIiwiZmlsZSI6Ii9wYWNrYWdlcy9ib2lsZXJwbGF0ZS1nZW5lcmF0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyByZWFkRmlsZSB9IGZyb20gJ2ZzJztcbmltcG9ydCB7IGNyZWF0ZSBhcyBjcmVhdGVTdHJlYW0gfSBmcm9tIFwiY29tYmluZWQtc3RyZWFtMlwiO1xuXG5pbXBvcnQgV2ViQnJvd3NlclRlbXBsYXRlIGZyb20gJy4vdGVtcGxhdGUtd2ViLmJyb3dzZXInO1xuaW1wb3J0IFdlYkNvcmRvdmFUZW1wbGF0ZSBmcm9tICcuL3RlbXBsYXRlLXdlYi5jb3Jkb3ZhJztcblxuLy8gQ29waWVkIGZyb20gd2ViYXBwX3NlcnZlclxuY29uc3QgcmVhZFV0ZjhGaWxlU3luYyA9IGZpbGVuYW1lID0+IE1ldGVvci53cmFwQXN5bmMocmVhZEZpbGUpKGZpbGVuYW1lLCAndXRmOCcpO1xuXG5jb25zdCBpZGVudGl0eSA9IHZhbHVlID0+IHZhbHVlO1xuXG5mdW5jdGlvbiBhcHBlbmRUb1N0cmVhbShjaHVuaywgc3RyZWFtKSB7XG4gIGlmICh0eXBlb2YgY2h1bmsgPT09IFwic3RyaW5nXCIpIHtcbiAgICBzdHJlYW0uYXBwZW5kKEJ1ZmZlci5mcm9tKGNodW5rLCBcInV0ZjhcIikpO1xuICB9IGVsc2UgaWYgKEJ1ZmZlci5pc0J1ZmZlcihjaHVuaykgfHxcbiAgICAgICAgICAgICB0eXBlb2YgY2h1bmsucmVhZCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgc3RyZWFtLmFwcGVuZChjaHVuayk7XG4gIH1cbn1cblxubGV0IHNob3VsZFdhcm5BYm91dFRvSFRNTERlcHJlY2F0aW9uID0gISBNZXRlb3IuaXNQcm9kdWN0aW9uO1xuXG5leHBvcnQgY2xhc3MgQm9pbGVycGxhdGUge1xuICBjb25zdHJ1Y3RvcihhcmNoLCBtYW5pZmVzdCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgeyBoZWFkVGVtcGxhdGUsIGNsb3NlVGVtcGxhdGUgfSA9IGdldFRlbXBsYXRlKGFyY2gpO1xuICAgIHRoaXMuaGVhZFRlbXBsYXRlID0gaGVhZFRlbXBsYXRlO1xuICAgIHRoaXMuY2xvc2VUZW1wbGF0ZSA9IGNsb3NlVGVtcGxhdGU7XG4gICAgdGhpcy5iYXNlRGF0YSA9IG51bGw7XG5cbiAgICB0aGlzLl9nZW5lcmF0ZUJvaWxlcnBsYXRlRnJvbU1hbmlmZXN0KFxuICAgICAgbWFuaWZlc3QsXG4gICAgICBvcHRpb25zXG4gICAgKTtcbiAgfVxuXG4gIHRvSFRNTChleHRyYURhdGEpIHtcbiAgICBpZiAoc2hvdWxkV2FybkFib3V0VG9IVE1MRGVwcmVjYXRpb24pIHtcbiAgICAgIHNob3VsZFdhcm5BYm91dFRvSFRNTERlcHJlY2F0aW9uID0gZmFsc2U7XG4gICAgICBjb25zb2xlLmVycm9yKFxuICAgICAgICBcIlRoZSBCb2lsZXJwbGF0ZSN0b0hUTUwgbWV0aG9kIGhhcyBiZWVuIGRlcHJlY2F0ZWQuIFwiICtcbiAgICAgICAgICBcIlBsZWFzZSB1c2UgQm9pbGVycGxhdGUjdG9IVE1MU3RyZWFtIGluc3RlYWQuXCJcbiAgICAgICk7XG4gICAgICBjb25zb2xlLnRyYWNlKCk7XG4gICAgfVxuXG4gICAgLy8gQ2FsbGluZyAuYXdhaXQoKSByZXF1aXJlcyBhIEZpYmVyLlxuICAgIHJldHVybiB0aGlzLnRvSFRNTEFzeW5jKGV4dHJhRGF0YSkuYXdhaXQoKTtcbiAgfVxuXG4gIC8vIFJldHVybnMgYSBQcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gYSBzdHJpbmcgb2YgSFRNTC5cbiAgdG9IVE1MQXN5bmMoZXh0cmFEYXRhKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IHN0cmVhbSA9IHRoaXMudG9IVE1MU3RyZWFtKGV4dHJhRGF0YSk7XG4gICAgICBjb25zdCBjaHVua3MgPSBbXTtcbiAgICAgIHN0cmVhbS5vbihcImRhdGFcIiwgY2h1bmsgPT4gY2h1bmtzLnB1c2goY2h1bmspKTtcbiAgICAgIHN0cmVhbS5vbihcImVuZFwiLCAoKSA9PiB7XG4gICAgICAgIHJlc29sdmUoQnVmZmVyLmNvbmNhdChjaHVua3MpLnRvU3RyaW5nKFwidXRmOFwiKSk7XG4gICAgICB9KTtcbiAgICAgIHN0cmVhbS5vbihcImVycm9yXCIsIHJlamVjdCk7XG4gICAgfSk7XG4gIH1cblxuICAvLyBUaGUgJ2V4dHJhRGF0YScgYXJndW1lbnQgY2FuIGJlIHVzZWQgdG8gZXh0ZW5kICdzZWxmLmJhc2VEYXRhJy4gSXRzXG4gIC8vIHB1cnBvc2UgaXMgdG8gYWxsb3cgeW91IHRvIHNwZWNpZnkgZGF0YSB0aGF0IHlvdSBtaWdodCBub3Qga25vdyBhdFxuICAvLyB0aGUgdGltZSB0aGF0IHlvdSBjb25zdHJ1Y3QgdGhlIEJvaWxlcnBsYXRlIG9iamVjdC4gKGUuZy4gaXQgaXMgdXNlZFxuICAvLyBieSAnd2ViYXBwJyB0byBzcGVjaWZ5IGRhdGEgdGhhdCBpcyBvbmx5IGtub3duIGF0IHJlcXVlc3QtdGltZSkuXG4gIC8vIHRoaXMgcmV0dXJucyBhIHN0cmVhbVxuICB0b0hUTUxTdHJlYW0oZXh0cmFEYXRhKSB7XG4gICAgaWYgKCF0aGlzLmJhc2VEYXRhIHx8ICF0aGlzLmhlYWRUZW1wbGF0ZSB8fCAhdGhpcy5jbG9zZVRlbXBsYXRlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0JvaWxlcnBsYXRlIGRpZCBub3QgaW5zdGFudGlhdGUgY29ycmVjdGx5LicpO1xuICAgIH1cblxuICAgIGNvbnN0IGRhdGEgPSB7Li4udGhpcy5iYXNlRGF0YSwgLi4uZXh0cmFEYXRhfTtcbiAgICBjb25zdCBzdGFydCA9IFwiPCFET0NUWVBFIGh0bWw+XFxuXCIgKyB0aGlzLmhlYWRUZW1wbGF0ZShkYXRhKTtcblxuICAgIGNvbnN0IHsgYm9keSwgZHluYW1pY0JvZHkgfSA9IGRhdGE7XG5cbiAgICBjb25zdCBlbmQgPSB0aGlzLmNsb3NlVGVtcGxhdGUoZGF0YSk7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBjcmVhdGVTdHJlYW0oKTtcblxuICAgIGFwcGVuZFRvU3RyZWFtKHN0YXJ0LCByZXNwb25zZSk7XG5cbiAgICBpZiAoYm9keSkge1xuICAgICAgYXBwZW5kVG9TdHJlYW0oYm9keSwgcmVzcG9uc2UpO1xuICAgIH1cblxuICAgIGlmIChkeW5hbWljQm9keSkge1xuICAgICAgYXBwZW5kVG9TdHJlYW0oZHluYW1pY0JvZHksIHJlc3BvbnNlKTtcbiAgICB9XG5cbiAgICBhcHBlbmRUb1N0cmVhbShlbmQsIHJlc3BvbnNlKTtcblxuICAgIHJldHVybiByZXNwb25zZTtcbiAgfVxuXG4gIC8vIFhYWCBFeHBvcnRlZCB0byBhbGxvdyBjbGllbnQtc2lkZSBvbmx5IGNoYW5nZXMgdG8gcmVidWlsZCB0aGUgYm9pbGVycGxhdGVcbiAgLy8gd2l0aG91dCByZXF1aXJpbmcgYSBmdWxsIHNlcnZlciByZXN0YXJ0LlxuICAvLyBQcm9kdWNlcyBhbiBIVE1MIHN0cmluZyB3aXRoIGdpdmVuIG1hbmlmZXN0IGFuZCBib2lsZXJwbGF0ZVNvdXJjZS5cbiAgLy8gT3B0aW9uYWxseSB0YWtlcyB1cmxNYXBwZXIgaW4gY2FzZSB1cmxzIGZyb20gbWFuaWZlc3QgbmVlZCB0byBiZSBwcmVmaXhlZFxuICAvLyBvciByZXdyaXR0ZW4uXG4gIC8vIE9wdGlvbmFsbHkgdGFrZXMgcGF0aE1hcHBlciBmb3IgcmVzb2x2aW5nIHJlbGF0aXZlIGZpbGUgc3lzdGVtIHBhdGhzLlxuICAvLyBPcHRpb25hbGx5IGFsbG93cyB0byBvdmVycmlkZSBmaWVsZHMgb2YgdGhlIGRhdGEgY29udGV4dC5cbiAgX2dlbmVyYXRlQm9pbGVycGxhdGVGcm9tTWFuaWZlc3QobWFuaWZlc3QsIHtcbiAgICB1cmxNYXBwZXIgPSBpZGVudGl0eSxcbiAgICBwYXRoTWFwcGVyID0gaWRlbnRpdHksXG4gICAgYmFzZURhdGFFeHRlbnNpb24sXG4gICAgaW5saW5lLFxuICB9ID0ge30pIHtcblxuICAgIGNvbnN0IGJvaWxlcnBsYXRlQmFzZURhdGEgPSB7XG4gICAgICBjc3M6IFtdLFxuICAgICAganM6IFtdLFxuICAgICAgaGVhZDogJycsXG4gICAgICBib2R5OiAnJyxcbiAgICAgIG1ldGVvck1hbmlmZXN0OiBKU09OLnN0cmluZ2lmeShtYW5pZmVzdCksXG4gICAgICAuLi5iYXNlRGF0YUV4dGVuc2lvbixcbiAgICB9O1xuXG4gICAgbWFuaWZlc3QuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGNvbnN0IHVybFBhdGggPSB1cmxNYXBwZXIoaXRlbS51cmwpO1xuICAgICAgY29uc3QgaXRlbU9iaiA9IHsgdXJsOiB1cmxQYXRoIH07XG5cbiAgICAgIGlmIChpbmxpbmUpIHtcbiAgICAgICAgaXRlbU9iai5zY3JpcHRDb250ZW50ID0gcmVhZFV0ZjhGaWxlU3luYyhcbiAgICAgICAgICBwYXRoTWFwcGVyKGl0ZW0ucGF0aCkpO1xuICAgICAgICBpdGVtT2JqLmlubGluZSA9IHRydWU7XG4gICAgICB9IGVsc2UgaWYgKGl0ZW0uc3JpKSB7XG4gICAgICAgIGl0ZW1PYmouc3JpID0gaXRlbS5zcmk7XG4gICAgICB9XG5cbiAgICAgIGlmIChpdGVtLnR5cGUgPT09ICdjc3MnICYmIGl0ZW0ud2hlcmUgPT09ICdjbGllbnQnKSB7XG4gICAgICAgIGJvaWxlcnBsYXRlQmFzZURhdGEuY3NzLnB1c2goaXRlbU9iaik7XG4gICAgICB9XG5cbiAgICAgIGlmIChpdGVtLnR5cGUgPT09ICdqcycgJiYgaXRlbS53aGVyZSA9PT0gJ2NsaWVudCcgJiZcbiAgICAgICAgLy8gRHluYW1pYyBKUyBtb2R1bGVzIHNob3VsZCBub3QgYmUgbG9hZGVkIGVhZ2VybHkgaW4gdGhlXG4gICAgICAgIC8vIGluaXRpYWwgSFRNTCBvZiB0aGUgYXBwLlxuICAgICAgICAhaXRlbS5wYXRoLnN0YXJ0c1dpdGgoJ2R5bmFtaWMvJykpIHtcbiAgICAgICAgYm9pbGVycGxhdGVCYXNlRGF0YS5qcy5wdXNoKGl0ZW1PYmopO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXRlbS50eXBlID09PSAnaGVhZCcpIHtcbiAgICAgICAgYm9pbGVycGxhdGVCYXNlRGF0YS5oZWFkID1cbiAgICAgICAgICByZWFkVXRmOEZpbGVTeW5jKHBhdGhNYXBwZXIoaXRlbS5wYXRoKSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChpdGVtLnR5cGUgPT09ICdib2R5Jykge1xuICAgICAgICBib2lsZXJwbGF0ZUJhc2VEYXRhLmJvZHkgPVxuICAgICAgICAgIHJlYWRVdGY4RmlsZVN5bmMocGF0aE1hcHBlcihpdGVtLnBhdGgpKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuYmFzZURhdGEgPSBib2lsZXJwbGF0ZUJhc2VEYXRhO1xuICB9XG59O1xuXG4vLyBSZXR1cm5zIGEgdGVtcGxhdGUgZnVuY3Rpb24gdGhhdCwgd2hlbiBjYWxsZWQsIHByb2R1Y2VzIHRoZSBib2lsZXJwbGF0ZVxuLy8gaHRtbCBhcyBhIHN0cmluZy5cbmZ1bmN0aW9uIGdldFRlbXBsYXRlKGFyY2gpIHtcbiAgY29uc3QgcHJlZml4ID0gYXJjaC5zcGxpdChcIi5cIiwgMikuam9pbihcIi5cIik7XG5cbiAgaWYgKHByZWZpeCA9PT0gXCJ3ZWIuYnJvd3NlclwiKSB7XG4gICAgcmV0dXJuIFdlYkJyb3dzZXJUZW1wbGF0ZTtcbiAgfVxuXG4gIGlmIChwcmVmaXggPT09IFwid2ViLmNvcmRvdmFcIikge1xuICAgIHJldHVybiBXZWJDb3Jkb3ZhVGVtcGxhdGU7XG4gIH1cblxuICB0aHJvdyBuZXcgRXJyb3IoXCJVbnN1cHBvcnRlZCBhcmNoOiBcIiArIGFyY2gpO1xufVxuIiwiaW1wb3J0IHRlbXBsYXRlIGZyb20gJy4vdGVtcGxhdGUnO1xuXG5jb25zdCBzcmkgPSAoc3JpLCBtb2RlKSA9PlxuICAoc3JpICYmIG1vZGUpID8gYCBpbnRlZ3JpdHk9XCJzaGE1MTItJHtzcml9XCIgY3Jvc3NvcmlnaW49XCIke21vZGV9XCJgIDogJyc7XG5cbmNvbnN0IGV2YWxFbnYgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciByZWdleHAgPSAvXFwkeyhbXn1dKyl9L2c7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKHN0ciwgbykge1xuICAgICAgICByZXR1cm4gc3RyLnJlcGxhY2UocmVnZXhwLCBmdW5jdGlvbihpZ25vcmUsIGtleSl7XG4gICAgICAgICAgICAgIGlmKGtleSA9PT0gJ1BMQVRGT1JNJyl7XG4gICAgICAgICAgICAgICAgcmV0dXJuICdicm93c2VyJztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4ga2V5ID09PSAnUk9PVF9VUkwnID8gJycgOiAodmFsdWUgPSBvW2tleV0pID09IG51bGwgPyAnJyA6IHZhbHVlO1xuICAgICAgICB9KTtcbiAgfVxufSkoKVxuXG5leHBvcnQgY29uc3QgaGVhZFRlbXBsYXRlID0gKHtcbiAgY3NzLFxuICBodG1sQXR0cmlidXRlcyxcbiAgYnVuZGxlZEpzQ3NzVXJsUmV3cml0ZUhvb2ssXG4gIHNyaU1vZGUsXG4gIGhlYWQsXG4gIGR5bmFtaWNIZWFkLFxufSkgPT4ge1xuICBjb25zdCByZXBsYWNlZEhlYWQgPSBldmFsRW52KGhlYWQsIHByb2Nlc3MuZW52KTtcbiAgdmFyIGhlYWRTZWN0aW9ucyA9IHJlcGxhY2VkSGVhZC5zcGxpdCgvPG1ldGVvci1idW5kbGVkLWNzc1tePD5dKj4vLCAyKTtcbiAgdmFyIGNzc0J1bmRsZSA9IFsuLi4oY3NzIHx8IFtdKS5tYXAoZmlsZSA9PlxuICAgIHRlbXBsYXRlKCcgIDxsaW5rIHJlbD1cInN0eWxlc2hlZXRcIiB0eXBlPVwidGV4dC9jc3NcIiBjbGFzcz1cIl9fbWV0ZW9yLWNzc19fXCIgaHJlZj1cIjwlLSBocmVmICU+XCI8JT0gc3JpICU+PicpKHtcbiAgICAgIGhyZWY6IGJ1bmRsZWRKc0Nzc1VybFJld3JpdGVIb29rKGZpbGUudXJsKSxcbiAgICAgIHNyaTogc3JpKGZpbGUuc3JpLCBzcmlNb2RlKSxcbiAgICB9KVxuICApXS5qb2luKCdcXG4nKTtcblxuICByZXR1cm4gW1xuICAgICc8aHRtbCcgKyBPYmplY3Qua2V5cyhodG1sQXR0cmlidXRlcyB8fCB7fSkubWFwKFxuICAgICAga2V5ID0+IHRlbXBsYXRlKCcgPCU9IGF0dHJOYW1lICU+PVwiPCUtIGF0dHJWYWx1ZSAlPlwiJykoe1xuICAgICAgICBhdHRyTmFtZToga2V5LFxuICAgICAgICBhdHRyVmFsdWU6IGh0bWxBdHRyaWJ1dGVzW2tleV0sXG4gICAgICB9KVxuICAgICkuam9pbignJykgKyAnPicsXG5cbiAgICAnPGhlYWQ+JyxcblxuICAgIChoZWFkU2VjdGlvbnMubGVuZ3RoID09PSAxKVxuICAgICAgPyBbY3NzQnVuZGxlLCBoZWFkU2VjdGlvbnNbMF1dLmpvaW4oJ1xcbicpXG4gICAgICA6IFtoZWFkU2VjdGlvbnNbMF0sIGNzc0J1bmRsZSwgaGVhZFNlY3Rpb25zWzFdXS5qb2luKCdcXG4nKSxcblxuICAgIGR5bmFtaWNIZWFkLFxuICAgICc8L2hlYWQ+JyxcbiAgICAnPGJvZHk+JyxcbiAgXS5qb2luKCdcXG4nKTtcbn07XG5cbi8vIFRlbXBsYXRlIGZ1bmN0aW9uIGZvciByZW5kZXJpbmcgdGhlIGJvaWxlcnBsYXRlIGh0bWwgZm9yIGJyb3dzZXJzXG5leHBvcnQgY29uc3QgY2xvc2VUZW1wbGF0ZSA9ICh7XG4gIG1ldGVvclJ1bnRpbWVDb25maWcsXG4gIHJvb3RVcmxQYXRoUHJlZml4LFxuICBpbmxpbmVTY3JpcHRzQWxsb3dlZCxcbiAganMsXG4gIGFkZGl0aW9uYWxTdGF0aWNKcyxcbiAgYnVuZGxlZEpzQ3NzVXJsUmV3cml0ZUhvb2ssXG4gIHNyaU1vZGUsXG59KSA9PiBbXG4gICcnLFxuICBpbmxpbmVTY3JpcHRzQWxsb3dlZFxuICAgID8gdGVtcGxhdGUoJyAgPHNjcmlwdCB0eXBlPVwidGV4dC9qYXZhc2NyaXB0XCI+X19tZXRlb3JfcnVudGltZV9jb25maWdfXyA9IEpTT04ucGFyc2UoZGVjb2RlVVJJQ29tcG9uZW50KDwlPSBjb25mICU+KSk8L3NjcmlwdD4nKSh7XG4gICAgICBjb25mOiBtZXRlb3JSdW50aW1lQ29uZmlnLFxuICAgIH0pXG4gICAgOiB0ZW1wbGF0ZSgnICA8c2NyaXB0IHR5cGU9XCJ0ZXh0L2phdmFzY3JpcHRcIiBzcmM9XCI8JS0gc3JjICU+L21ldGVvcl9ydW50aW1lX2NvbmZpZy5qc1wiPjwvc2NyaXB0PicpKHtcbiAgICAgIHNyYzogcm9vdFVybFBhdGhQcmVmaXgsXG4gICAgfSksXG4gICcnLFxuXG4gIC4uLihqcyB8fCBbXSkubWFwKGZpbGUgPT5cbiAgICB0ZW1wbGF0ZSgnICA8c2NyaXB0IHR5cGU9XCJ0ZXh0L2phdmFzY3JpcHRcIj5kZWxldGUgd2luZG93LmpRdWVyeTtkZWxldGUgd2luZG93LiQ7bG9hZEpzKFwiPCUtIHNyYyAlPlwiKTwvc2NyaXB0PicpKHtcbiAgICAgIHNyYzogYnVuZGxlZEpzQ3NzVXJsUmV3cml0ZUhvb2soZmlsZS51cmwpLFxuICAgICAgc3JpOiBzcmkoZmlsZS5zcmksIHNyaU1vZGUpLFxuICAgIH0pXG4gICksXG5cbiAgLi4uKGFkZGl0aW9uYWxTdGF0aWNKcyB8fCBbXSkubWFwKCh7IGNvbnRlbnRzLCBwYXRobmFtZSB9KSA9PiAoXG4gICAgaW5saW5lU2NyaXB0c0FsbG93ZWRcbiAgICAgID8gdGVtcGxhdGUoJyAgPHNjcmlwdD48JT0gY29udGVudHMgJT48L3NjcmlwdD4nKSh7XG4gICAgICAgIGNvbnRlbnRzLFxuICAgICAgfSlcbiAgICAgIDogdGVtcGxhdGUoJyAgPHNjcmlwdCB0eXBlPVwidGV4dC9qYXZhc2NyaXB0XCI+bG9hZEpzKFwiPCUtIHNyYyAlPlwiKTwvc2NyaXB0PicpKHtcbiAgICAgICAgc3JjOiByb290VXJsUGF0aFByZWZpeCArIHBhdGhuYW1lLFxuICAgICAgfSlcbiAgKSksXG4gICc8c2NyaXB0PndpbmRvdy5fID0gd2luZG93LmxvZGFzaDs8L3NjcmlwdD4nLFxuICAnJyxcbiAgJycsXG4gICc8L2JvZHk+JyxcbiAgJzwvaHRtbD4nXG5dLmpvaW4oJ1xcbicpO1xuIiwiaW1wb3J0IHRlbXBsYXRlIGZyb20gJy4vdGVtcGxhdGUnO1xuXG5jb25zdCBldmFsRW52ID0gKGZ1bmN0aW9uKCkge1xuICB2YXIgcmVnZXhwID0gL1xcJHsoW159XSspfS9nO1xuXG4gIHJldHVybiBmdW5jdGlvbihzdHIsIG8pIHtcbiAgICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKHJlZ2V4cCwgZnVuY3Rpb24oaWdub3JlLCBrZXkpe1xuICAgICAgICAgICAgICBpZihrZXkgPT09ICdQTEFURk9STScpe1xuICAgICAgICAgICAgICAgIHJldHVybiAnY29yZG92YSc7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuICh2YWx1ZSA9IG9ba2V5XSkgPT0gbnVsbCA/ICcnIDogdmFsdWU7XG4gICAgICAgIH0pO1xuICB9XG59KSgpXG5cbi8vIFRlbXBsYXRlIGZ1bmN0aW9uIGZvciByZW5kZXJpbmcgdGhlIGJvaWxlcnBsYXRlIGh0bWwgZm9yIGNvcmRvdmFcbmV4cG9ydCBjb25zdCBoZWFkVGVtcGxhdGUgPSAoe1xuICBtZXRlb3JSdW50aW1lQ29uZmlnLFxuICByb290VXJsUGF0aFByZWZpeCxcbiAgaW5saW5lU2NyaXB0c0FsbG93ZWQsXG4gIGNzcyxcbiAganMsXG4gIGFkZGl0aW9uYWxTdGF0aWNKcyxcbiAgaHRtbEF0dHJpYnV0ZXMsXG4gIGJ1bmRsZWRKc0Nzc1VybFJld3JpdGVIb29rLFxuICBoZWFkLFxuICBkeW5hbWljSGVhZCxcbn0pID0+IHtcbiAgY29uc3QgcmVwbGFjZWRIZWFkID0gZXZhbEVudihoZWFkLCBwcm9jZXNzLmVudik7XG4gIHZhciBoZWFkU2VjdGlvbnMgPSByZXBsYWNlZEhlYWQuc3BsaXQoLzxtZXRlb3ItYnVuZGxlZC1jc3NbXjw+XSo+LywgMik7XG4gIHZhciBjc3NCdW5kbGUgPSBbXG4gICAgLy8gV2UgYXJlIGV4cGxpY2l0bHkgbm90IHVzaW5nIGJ1bmRsZWRKc0Nzc1VybFJld3JpdGVIb29rOiBpbiBjb3Jkb3ZhIHdlIHNlcnZlIGFzc2V0cyB1cCBkaXJlY3RseSBmcm9tIGRpc2ssIHNvIHJld3JpdGluZyB0aGUgVVJMIGRvZXMgbm90IG1ha2Ugc2Vuc2VcbiAgICAuLi4oY3NzIHx8IFtdKS5tYXAoZmlsZSA9PlxuICAgICAgdGVtcGxhdGUoJyAgPGxpbmsgcmVsPVwic3R5bGVzaGVldFwiIHR5cGU9XCJ0ZXh0L2Nzc1wiIGNsYXNzPVwiX19tZXRlb3ItY3NzX19cIiBocmVmPVwiPCUtIGhyZWYgJT5cIj4nKSh7XG4gICAgICAgIGhyZWY6IGZpbGUudXJsLFxuICAgICAgfSlcbiAgKV0uam9pbignXFxuJyk7XG5cbiAgcmV0dXJuIFtcbiAgICAnPGh0bWw+JyxcbiAgICAnPGhlYWQ+JyxcbiAgICAnICA8bWV0YSBjaGFyc2V0PVwidXRmLThcIj4nLFxuICAgICcgIDxtZXRhIG5hbWU9XCJmb3JtYXQtZGV0ZWN0aW9uXCIgY29udGVudD1cInRlbGVwaG9uZT1ub1wiPicsXG4gICAgJyAgPG1ldGEgbmFtZT1cInZpZXdwb3J0XCIgY29udGVudD1cInVzZXItc2NhbGFibGU9bm8sIGluaXRpYWwtc2NhbGU9MSwgbWF4aW11bS1zY2FsZT0xLCBtaW5pbXVtLXNjYWxlPTEsIHdpZHRoPWRldmljZS13aWR0aCwgaGVpZ2h0PWRldmljZS1oZWlnaHQsIHZpZXdwb3J0LWZpdD1jb3ZlclwiPicsXG4gICAgJyAgPG1ldGEgbmFtZT1cIm1zYXBwbGljYXRpb24tdGFwLWhpZ2hsaWdodFwiIGNvbnRlbnQ9XCJub1wiPicsXG4gICAgJyAgPG1ldGEgaHR0cC1lcXVpdj1cIkNvbnRlbnQtU2VjdXJpdHktUG9saWN5XCIgY29udGVudD1cImRlZmF1bHQtc3JjICogZ2FwOiBkYXRhOiBibG9iOiBcXCd1bnNhZmUtaW5saW5lXFwnIFxcJ3Vuc2FmZS1ldmFsXFwnIHdzOiB3c3M6O1wiPicsXG5cbiAgKGhlYWRTZWN0aW9ucy5sZW5ndGggPT09IDEpXG4gICAgPyBbY3NzQnVuZGxlLCBoZWFkU2VjdGlvbnNbMF1dLmpvaW4oJ1xcbicpXG4gICAgOiBbaGVhZFNlY3Rpb25zWzBdLCBjc3NCdW5kbGUsIGhlYWRTZWN0aW9uc1sxXV0uam9pbignXFxuJyksXG5cbiAgICAnICA8c2NyaXB0IHR5cGU9XCJ0ZXh0L2phdmFzY3JpcHRcIj4nLFxuICAgIHRlbXBsYXRlKCcgICAgX19tZXRlb3JfcnVudGltZV9jb25maWdfXyA9IEpTT04ucGFyc2UoZGVjb2RlVVJJQ29tcG9uZW50KDwlPSBjb25mICU+KSk7Jykoe1xuICAgICAgY29uZjogbWV0ZW9yUnVudGltZUNvbmZpZyxcbiAgICB9KSxcbiAgICAnICAgIGlmICgvQW5kcm9pZC9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkpIHsnLFxuICAgIC8vIFdoZW4gQW5kcm9pZCBhcHAgaXMgZW11bGF0ZWQsIGl0IGNhbm5vdCBjb25uZWN0IHRvIGxvY2FsaG9zdCxcbiAgICAvLyBpbnN0ZWFkIGl0IHNob3VsZCBjb25uZWN0IHRvIDEwLjAuMi4yXG4gICAgLy8gKHVubGVzcyB3ZVxcJ3JlIHVzaW5nIGFuIGh0dHAgcHJveHk7IHRoZW4gaXQgd29ya3MhKVxuICAgICcgICAgICBpZiAoIV9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18uaHR0cFByb3h5UG9ydCkgeycsXG4gICAgJyAgICAgICAgX19tZXRlb3JfcnVudGltZV9jb25maWdfXy5ST09UX1VSTCA9IChfX21ldGVvcl9ydW50aW1lX2NvbmZpZ19fLlJPT1RfVVJMIHx8IFxcJ1xcJykucmVwbGFjZSgvbG9jYWxob3N0L2ksIFxcJzEwLjAuMi4yXFwnKTsnLFxuICAgICcgICAgICAgIF9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18uRERQX0RFRkFVTFRfQ09OTkVDVElPTl9VUkwgPSAoX19tZXRlb3JfcnVudGltZV9jb25maWdfXy5ERFBfREVGQVVMVF9DT05ORUNUSU9OX1VSTCB8fCBcXCdcXCcpLnJlcGxhY2UoL2xvY2FsaG9zdC9pLCBcXCcxMC4wLjIuMlxcJyk7JyxcbiAgICAnICAgICAgfScsXG4gICAgJyAgICB9JyxcbiAgICAnaWYoIWRvY3VtZW50LmJvZHkpe1xcbicgK1xuICAgICcgICAgdmFyIHRlbXBCb2R5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJvZHlcIik7XFxuJyArXG4gICAgJyAgICBkb2N1bWVudC5ib2R5ID0gdGVtcEJvZHk7XFxuJyArXG4gICAgJyAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFxcJ0RPTUNvbnRlbnRMb2FkZWRcXCcsIChldmVudCkgPT4ge1xcbicgK1xuICAgICcgICAgICAgIHRlbXBCb2R5LnJlbW92ZSgpXFxuJyArXG4gICAgJyAgICB9KTtcXG4nICtcbiAgICAnfScsXG4gICAgJyAgPC9zY3JpcHQ+JyxcbiAgICAnJyxcbiAgICAnICA8c2NyaXB0IHR5cGU9XCJ0ZXh0L2phdmFzY3JpcHRcIiBzcmM9XCIvY29yZG92YS5qc1wiPjwvc2NyaXB0PicsXG5cbiAgICAuLi4oanMgfHwgW10pLm1hcChmaWxlID0+XG4gICAgICB0ZW1wbGF0ZSgnICA8c2NyaXB0IHR5cGU9XCJ0ZXh0L2phdmFzY3JpcHRcIj5sb2FkSnMoXCI8JS0gc3JjICU+XCIpPC9zY3JpcHQ+Jykoe1xuICAgICAgICBzcmM6IGZpbGUudXJsLFxuICAgICAgfSlcbiAgICApLFxuXG4gICAgLi4uKGFkZGl0aW9uYWxTdGF0aWNKcyB8fCBbXSkubWFwKCh7IGNvbnRlbnRzLCBwYXRobmFtZSB9KSA9PiAoXG4gICAgICBpbmxpbmVTY3JpcHRzQWxsb3dlZFxuICAgICAgICA/IHRlbXBsYXRlKCcgIDxzY3JpcHQ+PCU9IGNvbnRlbnRzICU+PC9zY3JpcHQ+Jykoe1xuICAgICAgICAgIGNvbnRlbnRzLFxuICAgICAgICB9KVxuICAgICAgICA6IHRlbXBsYXRlKCcgIDxzY3JpcHQgdHlwZT1cInRleHQvamF2YXNjcmlwdFwiPmxvYWRKcyhcIjwlLSBzcmMgJT5cIik8L3NjcmlwdD4nKSh7XG4gICAgICAgICAgc3JjOiBNZXRlb3IuYWJzb2x1dGVVcmwocGF0aG5hbWUpXG4gICAgICAgIH0pXG4gICAgKSksXG4gICAgJycsXG4gICAgJzwvaGVhZD4nLFxuICAgICcnLFxuICAgICc8Ym9keT4nLFxuICBdLmpvaW4oJ1xcbicpO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGNsb3NlVGVtcGxhdGUoKSB7XG4gIHJldHVybiBcIjwvYm9keT5cXG48L2h0bWw+XCI7XG59XG4iLCJpbXBvcnQgeyBfIH0gZnJvbSAnbWV0ZW9yL3VuZGVyc2NvcmUnO1xuXG4vLyBBcyBpZGVudGlmaWVkIGluIGlzc3VlICM5MTQ5LCB3aGVuIGFuIGFwcGxpY2F0aW9uIG92ZXJyaWRlcyB0aGUgZGVmYXVsdFxuLy8gXy50ZW1wbGF0ZSBzZXR0aW5ncyB1c2luZyBfLnRlbXBsYXRlU2V0dGluZ3MsIHRob3NlIG5ldyBzZXR0aW5ncyBhcmVcbi8vIHVzZWQgYW55d2hlcmUgXy50ZW1wbGF0ZSBpcyB1c2VkLCBpbmNsdWRpbmcgd2l0aGluIHRoZVxuLy8gYm9pbGVycGxhdGUtZ2VuZXJhdG9yLiBUbyBoYW5kbGUgdGhpcywgXy50ZW1wbGF0ZSBzZXR0aW5ncyB0aGF0IGhhdmVcbi8vIGJlZW4gdmVyaWZpZWQgdG8gd29yayBhcmUgb3ZlcnJpZGRlbiBoZXJlIG9uIGVhY2ggXy50ZW1wbGF0ZSBjYWxsLlxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdGVtcGxhdGUodGV4dCkge1xuICByZXR1cm4gXy50ZW1wbGF0ZSh0ZXh0LCBudWxsLCB7XG4gICAgZXZhbHVhdGUgICAgOiAvPCUoW1xcc1xcU10rPyklPi9nLFxuICAgIGludGVycG9sYXRlIDogLzwlPShbXFxzXFxTXSs/KSU+L2csXG4gICAgZXNjYXBlICAgICAgOiAvPCUtKFtcXHNcXFNdKz8pJT4vZyxcbiAgfSk7XG59O1xuIl19
