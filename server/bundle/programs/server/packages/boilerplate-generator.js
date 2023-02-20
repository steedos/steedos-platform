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
      return (value = o[key]) == null ? '' : value;
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
  var regexp = /\${([^{]+)}/g;
  return function (str, o) {
    return str.replace(regexp, function (ignore, key) {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvYm9pbGVycGxhdGUtZ2VuZXJhdG9yL2dlbmVyYXRvci5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvYm9pbGVycGxhdGUtZ2VuZXJhdG9yL3RlbXBsYXRlLXdlYi5icm93c2VyLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9ib2lsZXJwbGF0ZS1nZW5lcmF0b3IvdGVtcGxhdGUtd2ViLmNvcmRvdmEuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2JvaWxlcnBsYXRlLWdlbmVyYXRvci90ZW1wbGF0ZS5qcyJdLCJuYW1lcyI6WyJfb2JqZWN0U3ByZWFkIiwibW9kdWxlIiwibGluayIsImRlZmF1bHQiLCJ2IiwiZXhwb3J0IiwiQm9pbGVycGxhdGUiLCJyZWFkRmlsZSIsImNyZWF0ZVN0cmVhbSIsImNyZWF0ZSIsIldlYkJyb3dzZXJUZW1wbGF0ZSIsIldlYkNvcmRvdmFUZW1wbGF0ZSIsInJlYWRVdGY4RmlsZVN5bmMiLCJmaWxlbmFtZSIsIk1ldGVvciIsIndyYXBBc3luYyIsImlkZW50aXR5IiwidmFsdWUiLCJhcHBlbmRUb1N0cmVhbSIsImNodW5rIiwic3RyZWFtIiwiYXBwZW5kIiwiQnVmZmVyIiwiZnJvbSIsImlzQnVmZmVyIiwicmVhZCIsInNob3VsZFdhcm5BYm91dFRvSFRNTERlcHJlY2F0aW9uIiwiaXNQcm9kdWN0aW9uIiwiY29uc3RydWN0b3IiLCJhcmNoIiwibWFuaWZlc3QiLCJvcHRpb25zIiwiaGVhZFRlbXBsYXRlIiwiY2xvc2VUZW1wbGF0ZSIsImdldFRlbXBsYXRlIiwiYmFzZURhdGEiLCJfZ2VuZXJhdGVCb2lsZXJwbGF0ZUZyb21NYW5pZmVzdCIsInRvSFRNTCIsImV4dHJhRGF0YSIsImNvbnNvbGUiLCJlcnJvciIsInRyYWNlIiwidG9IVE1MQXN5bmMiLCJhd2FpdCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwidG9IVE1MU3RyZWFtIiwiY2h1bmtzIiwib24iLCJwdXNoIiwiY29uY2F0IiwidG9TdHJpbmciLCJFcnJvciIsImRhdGEiLCJzdGFydCIsImJvZHkiLCJkeW5hbWljQm9keSIsImVuZCIsInJlc3BvbnNlIiwidXJsTWFwcGVyIiwicGF0aE1hcHBlciIsImJhc2VEYXRhRXh0ZW5zaW9uIiwiaW5saW5lIiwiYm9pbGVycGxhdGVCYXNlRGF0YSIsImNzcyIsImpzIiwiaGVhZCIsIm1ldGVvck1hbmlmZXN0IiwiSlNPTiIsInN0cmluZ2lmeSIsImZvckVhY2giLCJpdGVtIiwidXJsUGF0aCIsInVybCIsIml0ZW1PYmoiLCJzY3JpcHRDb250ZW50IiwicGF0aCIsInNyaSIsInR5cGUiLCJ3aGVyZSIsInN0YXJ0c1dpdGgiLCJwcmVmaXgiLCJzcGxpdCIsImpvaW4iLCJ0ZW1wbGF0ZSIsIm1vZGUiLCJldmFsRW52IiwicmVnZXhwIiwic3RyIiwibyIsInJlcGxhY2UiLCJpZ25vcmUiLCJrZXkiLCJodG1sQXR0cmlidXRlcyIsImJ1bmRsZWRKc0Nzc1VybFJld3JpdGVIb29rIiwic3JpTW9kZSIsImR5bmFtaWNIZWFkIiwicmVwbGFjZWRIZWFkIiwicHJvY2VzcyIsImVudiIsImhlYWRTZWN0aW9ucyIsImNzc0J1bmRsZSIsIm1hcCIsImZpbGUiLCJocmVmIiwiT2JqZWN0Iiwia2V5cyIsImF0dHJOYW1lIiwiYXR0clZhbHVlIiwibGVuZ3RoIiwibWV0ZW9yUnVudGltZUNvbmZpZyIsInJvb3RVcmxQYXRoUHJlZml4IiwiaW5saW5lU2NyaXB0c0FsbG93ZWQiLCJhZGRpdGlvbmFsU3RhdGljSnMiLCJjb25mIiwic3JjIiwiY29udGVudHMiLCJwYXRobmFtZSIsImFic29sdXRlVXJsIiwiXyIsInRleHQiLCJldmFsdWF0ZSIsImludGVycG9sYXRlIiwiZXNjYXBlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSUEsYUFBSjs7QUFBa0JDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLHNDQUFaLEVBQW1EO0FBQUNDLFNB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cG9ydCB7IHJlYWRGaWxlIH0gZnJvbSAnZnMnO1xuaW1wb3J0IHsgY3JlYXRlIGFzIGNyZWF0ZVN0cmVhbSB9IGZyb20gXCJjb21iaW5lZC1zdHJlYW0yXCI7XG5cbmltcG9ydCBXZWJCcm93c2VyVGVtcGxhdGUgZnJvbSAnLi90ZW1wbGF0ZS13ZWIuYnJvd3Nlcic7XG5pbXBvcnQgV2ViQ29yZG92YVRlbXBsYXRlIGZyb20gJy4vdGVtcGxhdGUtd2ViLmNvcmRvdmEnO1xuXG4vLyBDb3BpZWQgZnJvbSB3ZWJhcHBfc2VydmVyXG5jb25zdCByZWFkVXRmOEZpbGVTeW5jID0gZmlsZW5hbWUgPT4gTWV0ZW9yLndyYXBBc3luYyhyZWFkRmlsZSkoZmlsZW5hbWUsICd1dGY4Jyk7XG5cbmNvbnN0IGlkZW50aXR5ID0gdmFsdWUgPT4gdmFsdWU7XG5cbmZ1bmN0aW9uIGFwcGVuZFRvU3RyZWFtKGNodW5rLCBzdHJlYW0pIHtcbiAgaWYgKHR5cGVvZiBjaHVuayA9PT0gXCJzdHJpbmdcIikge1xuICAgIHN0cmVhbS5hcHBlbmQoQnVmZmVyLmZyb20oY2h1bmssIFwidXRmOFwiKSk7XG4gIH0gZWxzZSBpZiAoQnVmZmVyLmlzQnVmZmVyKGNodW5rKSB8fFxuICAgICAgICAgICAgIHR5cGVvZiBjaHVuay5yZWFkID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBzdHJlYW0uYXBwZW5kKGNodW5rKTtcbiAgfVxufVxuXG5sZXQgc2hvdWxkV2FybkFib3V0VG9IVE1MRGVwcmVjYXRpb24gPSAhIE1ldGVvci5pc1Byb2R1Y3Rpb247XG5cbmV4cG9ydCBjbGFzcyBCb2lsZXJwbGF0ZSB7XG4gIGNvbnN0cnVjdG9yKGFyY2gsIG1hbmlmZXN0LCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCB7IGhlYWRUZW1wbGF0ZSwgY2xvc2VUZW1wbGF0ZSB9ID0gZ2V0VGVtcGxhdGUoYXJjaCk7XG4gICAgdGhpcy5oZWFkVGVtcGxhdGUgPSBoZWFkVGVtcGxhdGU7XG4gICAgdGhpcy5jbG9zZVRlbXBsYXRlID0gY2xvc2VUZW1wbGF0ZTtcbiAgICB0aGlzLmJhc2VEYXRhID0gbnVsbDtcblxuICAgIHRoaXMuX2dlbmVyYXRlQm9pbGVycGxhdGVGcm9tTWFuaWZlc3QoXG4gICAgICBtYW5pZmVzdCxcbiAgICAgIG9wdGlvbnNcbiAgICApO1xuICB9XG5cbiAgdG9IVE1MKGV4dHJhRGF0YSkge1xuICAgIGlmIChzaG91bGRXYXJuQWJvdXRUb0hUTUxEZXByZWNhdGlvbikge1xuICAgICAgc2hvdWxkV2FybkFib3V0VG9IVE1MRGVwcmVjYXRpb24gPSBmYWxzZTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgIFwiVGhlIEJvaWxlcnBsYXRlI3RvSFRNTCBtZXRob2QgaGFzIGJlZW4gZGVwcmVjYXRlZC4gXCIgK1xuICAgICAgICAgIFwiUGxlYXNlIHVzZSBCb2lsZXJwbGF0ZSN0b0hUTUxTdHJlYW0gaW5zdGVhZC5cIlxuICAgICAgKTtcbiAgICAgIGNvbnNvbGUudHJhY2UoKTtcbiAgICB9XG5cbiAgICAvLyBDYWxsaW5nIC5hd2FpdCgpIHJlcXVpcmVzIGEgRmliZXIuXG4gICAgcmV0dXJuIHRoaXMudG9IVE1MQXN5bmMoZXh0cmFEYXRhKS5hd2FpdCgpO1xuICB9XG5cbiAgLy8gUmV0dXJucyBhIFByb21pc2UgdGhhdCByZXNvbHZlcyB0byBhIHN0cmluZyBvZiBIVE1MLlxuICB0b0hUTUxBc3luYyhleHRyYURhdGEpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3Qgc3RyZWFtID0gdGhpcy50b0hUTUxTdHJlYW0oZXh0cmFEYXRhKTtcbiAgICAgIGNvbnN0IGNodW5rcyA9IFtdO1xuICAgICAgc3RyZWFtLm9uKFwiZGF0YVwiLCBjaHVuayA9PiBjaHVua3MucHVzaChjaHVuaykpO1xuICAgICAgc3RyZWFtLm9uKFwiZW5kXCIsICgpID0+IHtcbiAgICAgICAgcmVzb2x2ZShCdWZmZXIuY29uY2F0KGNodW5rcykudG9TdHJpbmcoXCJ1dGY4XCIpKTtcbiAgICAgIH0pO1xuICAgICAgc3RyZWFtLm9uKFwiZXJyb3JcIiwgcmVqZWN0KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIFRoZSAnZXh0cmFEYXRhJyBhcmd1bWVudCBjYW4gYmUgdXNlZCB0byBleHRlbmQgJ3NlbGYuYmFzZURhdGEnLiBJdHNcbiAgLy8gcHVycG9zZSBpcyB0byBhbGxvdyB5b3UgdG8gc3BlY2lmeSBkYXRhIHRoYXQgeW91IG1pZ2h0IG5vdCBrbm93IGF0XG4gIC8vIHRoZSB0aW1lIHRoYXQgeW91IGNvbnN0cnVjdCB0aGUgQm9pbGVycGxhdGUgb2JqZWN0LiAoZS5nLiBpdCBpcyB1c2VkXG4gIC8vIGJ5ICd3ZWJhcHAnIHRvIHNwZWNpZnkgZGF0YSB0aGF0IGlzIG9ubHkga25vd24gYXQgcmVxdWVzdC10aW1lKS5cbiAgLy8gdGhpcyByZXR1cm5zIGEgc3RyZWFtXG4gIHRvSFRNTFN0cmVhbShleHRyYURhdGEpIHtcbiAgICBpZiAoIXRoaXMuYmFzZURhdGEgfHwgIXRoaXMuaGVhZFRlbXBsYXRlIHx8ICF0aGlzLmNsb3NlVGVtcGxhdGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQm9pbGVycGxhdGUgZGlkIG5vdCBpbnN0YW50aWF0ZSBjb3JyZWN0bHkuJyk7XG4gICAgfVxuXG4gICAgY29uc3QgZGF0YSA9IHsuLi50aGlzLmJhc2VEYXRhLCAuLi5leHRyYURhdGF9O1xuICAgIGNvbnN0IHN0YXJ0ID0gXCI8IURPQ1RZUEUgaHRtbD5cXG5cIiArIHRoaXMuaGVhZFRlbXBsYXRlKGRhdGEpO1xuXG4gICAgY29uc3QgeyBib2R5LCBkeW5hbWljQm9keSB9ID0gZGF0YTtcblxuICAgIGNvbnN0IGVuZCA9IHRoaXMuY2xvc2VUZW1wbGF0ZShkYXRhKTtcbiAgICBjb25zdCByZXNwb25zZSA9IGNyZWF0ZVN0cmVhbSgpO1xuXG4gICAgYXBwZW5kVG9TdHJlYW0oc3RhcnQsIHJlc3BvbnNlKTtcblxuICAgIGlmIChib2R5KSB7XG4gICAgICBhcHBlbmRUb1N0cmVhbShib2R5LCByZXNwb25zZSk7XG4gICAgfVxuXG4gICAgaWYgKGR5bmFtaWNCb2R5KSB7XG4gICAgICBhcHBlbmRUb1N0cmVhbShkeW5hbWljQm9keSwgcmVzcG9uc2UpO1xuICAgIH1cblxuICAgIGFwcGVuZFRvU3RyZWFtKGVuZCwgcmVzcG9uc2UpO1xuXG4gICAgcmV0dXJuIHJlc3BvbnNlO1xuICB9XG5cbiAgLy8gWFhYIEV4cG9ydGVkIHRvIGFsbG93IGNsaWVudC1zaWRlIG9ubHkgY2hhbmdlcyB0byByZWJ1aWxkIHRoZSBib2lsZXJwbGF0ZVxuICAvLyB3aXRob3V0IHJlcXVpcmluZyBhIGZ1bGwgc2VydmVyIHJlc3RhcnQuXG4gIC8vIFByb2R1Y2VzIGFuIEhUTUwgc3RyaW5nIHdpdGggZ2l2ZW4gbWFuaWZlc3QgYW5kIGJvaWxlcnBsYXRlU291cmNlLlxuICAvLyBPcHRpb25hbGx5IHRha2VzIHVybE1hcHBlciBpbiBjYXNlIHVybHMgZnJvbSBtYW5pZmVzdCBuZWVkIHRvIGJlIHByZWZpeGVkXG4gIC8vIG9yIHJld3JpdHRlbi5cbiAgLy8gT3B0aW9uYWxseSB0YWtlcyBwYXRoTWFwcGVyIGZvciByZXNvbHZpbmcgcmVsYXRpdmUgZmlsZSBzeXN0ZW0gcGF0aHMuXG4gIC8vIE9wdGlvbmFsbHkgYWxsb3dzIHRvIG92ZXJyaWRlIGZpZWxkcyBvZiB0aGUgZGF0YSBjb250ZXh0LlxuICBfZ2VuZXJhdGVCb2lsZXJwbGF0ZUZyb21NYW5pZmVzdChtYW5pZmVzdCwge1xuICAgIHVybE1hcHBlciA9IGlkZW50aXR5LFxuICAgIHBhdGhNYXBwZXIgPSBpZGVudGl0eSxcbiAgICBiYXNlRGF0YUV4dGVuc2lvbixcbiAgICBpbmxpbmUsXG4gIH0gPSB7fSkge1xuXG4gICAgY29uc3QgYm9pbGVycGxhdGVCYXNlRGF0YSA9IHtcbiAgICAgIGNzczogW10sXG4gICAgICBqczogW10sXG4gICAgICBoZWFkOiAnJyxcbiAgICAgIGJvZHk6ICcnLFxuICAgICAgbWV0ZW9yTWFuaWZlc3Q6IEpTT04uc3RyaW5naWZ5KG1hbmlmZXN0KSxcbiAgICAgIC4uLmJhc2VEYXRhRXh0ZW5zaW9uLFxuICAgIH07XG5cbiAgICBtYW5pZmVzdC5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgY29uc3QgdXJsUGF0aCA9IHVybE1hcHBlcihpdGVtLnVybCk7XG4gICAgICBjb25zdCBpdGVtT2JqID0geyB1cmw6IHVybFBhdGggfTtcblxuICAgICAgaWYgKGlubGluZSkge1xuICAgICAgICBpdGVtT2JqLnNjcmlwdENvbnRlbnQgPSByZWFkVXRmOEZpbGVTeW5jKFxuICAgICAgICAgIHBhdGhNYXBwZXIoaXRlbS5wYXRoKSk7XG4gICAgICAgIGl0ZW1PYmouaW5saW5lID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSBpZiAoaXRlbS5zcmkpIHtcbiAgICAgICAgaXRlbU9iai5zcmkgPSBpdGVtLnNyaTtcbiAgICAgIH1cblxuICAgICAgaWYgKGl0ZW0udHlwZSA9PT0gJ2NzcycgJiYgaXRlbS53aGVyZSA9PT0gJ2NsaWVudCcpIHtcbiAgICAgICAgYm9pbGVycGxhdGVCYXNlRGF0YS5jc3MucHVzaChpdGVtT2JqKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGl0ZW0udHlwZSA9PT0gJ2pzJyAmJiBpdGVtLndoZXJlID09PSAnY2xpZW50JyAmJlxuICAgICAgICAvLyBEeW5hbWljIEpTIG1vZHVsZXMgc2hvdWxkIG5vdCBiZSBsb2FkZWQgZWFnZXJseSBpbiB0aGVcbiAgICAgICAgLy8gaW5pdGlhbCBIVE1MIG9mIHRoZSBhcHAuXG4gICAgICAgICFpdGVtLnBhdGguc3RhcnRzV2l0aCgnZHluYW1pYy8nKSkge1xuICAgICAgICBib2lsZXJwbGF0ZUJhc2VEYXRhLmpzLnB1c2goaXRlbU9iaik7XG4gICAgICB9XG5cbiAgICAgIGlmIChpdGVtLnR5cGUgPT09ICdoZWFkJykge1xuICAgICAgICBib2lsZXJwbGF0ZUJhc2VEYXRhLmhlYWQgPVxuICAgICAgICAgIHJlYWRVdGY4RmlsZVN5bmMocGF0aE1hcHBlcihpdGVtLnBhdGgpKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGl0ZW0udHlwZSA9PT0gJ2JvZHknKSB7XG4gICAgICAgIGJvaWxlcnBsYXRlQmFzZURhdGEuYm9keSA9XG4gICAgICAgICAgcmVhZFV0ZjhGaWxlU3luYyhwYXRoTWFwcGVyKGl0ZW0ucGF0aCkpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5iYXNlRGF0YSA9IGJvaWxlcnBsYXRlQmFzZURhdGE7XG4gIH1cbn07XG5cbi8vIFJldHVybnMgYSB0ZW1wbGF0ZSBmdW5jdGlvbiB0aGF0LCB3aGVuIGNhbGxlZCwgcHJvZHVjZXMgdGhlIGJvaWxlcnBsYXRlXG4vLyBodG1sIGFzIGEgc3RyaW5nLlxuZnVuY3Rpb24gZ2V0VGVtcGxhdGUoYXJjaCkge1xuICBjb25zdCBwcmVmaXggPSBhcmNoLnNwbGl0KFwiLlwiLCAyKS5qb2luKFwiLlwiKTtcblxuICBpZiAocHJlZml4ID09PSBcIndlYi5icm93c2VyXCIpIHtcbiAgICByZXR1cm4gV2ViQnJvd3NlclRlbXBsYXRlO1xuICB9XG5cbiAgaWYgKHByZWZpeCA9PT0gXCJ3ZWIuY29yZG92YVwiKSB7XG4gICAgcmV0dXJuIFdlYkNvcmRvdmFUZW1wbGF0ZTtcbiAgfVxuXG4gIHRocm93IG5ldyBFcnJvcihcIlVuc3VwcG9ydGVkIGFyY2g6IFwiICsgYXJjaCk7XG59XG4iLCJpbXBvcnQgdGVtcGxhdGUgZnJvbSAnLi90ZW1wbGF0ZSc7XG5cbmNvbnN0IHNyaSA9IChzcmksIG1vZGUpID0+XG4gIChzcmkgJiYgbW9kZSkgPyBgIGludGVncml0eT1cInNoYTUxMi0ke3NyaX1cIiBjcm9zc29yaWdpbj1cIiR7bW9kZX1cImAgOiAnJztcblxuY29uc3QgZXZhbEVudiA9IChmdW5jdGlvbigpIHtcbiAgdmFyIHJlZ2V4cCA9IC9cXCR7KFtefV0rKX0vZztcblxuICByZXR1cm4gZnVuY3Rpb24oc3RyLCBvKSB7XG4gICAgICAgIHJldHVybiBzdHIucmVwbGFjZShyZWdleHAsIGZ1bmN0aW9uKGlnbm9yZSwga2V5KXtcbiAgICAgICAgICAgICAgcmV0dXJuICh2YWx1ZSA9IG9ba2V5XSkgPT0gbnVsbCA/ICcnIDogdmFsdWU7XG4gICAgICAgIH0pO1xuICB9XG59KSgpXG5cbmV4cG9ydCBjb25zdCBoZWFkVGVtcGxhdGUgPSAoe1xuICBjc3MsXG4gIGh0bWxBdHRyaWJ1dGVzLFxuICBidW5kbGVkSnNDc3NVcmxSZXdyaXRlSG9vayxcbiAgc3JpTW9kZSxcbiAgaGVhZCxcbiAgZHluYW1pY0hlYWQsXG59KSA9PiB7XG4gIGNvbnN0IHJlcGxhY2VkSGVhZCA9IGV2YWxFbnYoaGVhZCwgcHJvY2Vzcy5lbnYpO1xuICB2YXIgaGVhZFNlY3Rpb25zID0gcmVwbGFjZWRIZWFkLnNwbGl0KC88bWV0ZW9yLWJ1bmRsZWQtY3NzW148Pl0qPi8sIDIpO1xuICB2YXIgY3NzQnVuZGxlID0gWy4uLihjc3MgfHwgW10pLm1hcChmaWxlID0+XG4gICAgdGVtcGxhdGUoJyAgPGxpbmsgcmVsPVwic3R5bGVzaGVldFwiIHR5cGU9XCJ0ZXh0L2Nzc1wiIGNsYXNzPVwiX19tZXRlb3ItY3NzX19cIiBocmVmPVwiPCUtIGhyZWYgJT5cIjwlPSBzcmkgJT4+Jykoe1xuICAgICAgaHJlZjogYnVuZGxlZEpzQ3NzVXJsUmV3cml0ZUhvb2soZmlsZS51cmwpLFxuICAgICAgc3JpOiBzcmkoZmlsZS5zcmksIHNyaU1vZGUpLFxuICAgIH0pXG4gICldLmpvaW4oJ1xcbicpO1xuXG4gIHJldHVybiBbXG4gICAgJzxodG1sJyArIE9iamVjdC5rZXlzKGh0bWxBdHRyaWJ1dGVzIHx8IHt9KS5tYXAoXG4gICAgICBrZXkgPT4gdGVtcGxhdGUoJyA8JT0gYXR0ck5hbWUgJT49XCI8JS0gYXR0clZhbHVlICU+XCInKSh7XG4gICAgICAgIGF0dHJOYW1lOiBrZXksXG4gICAgICAgIGF0dHJWYWx1ZTogaHRtbEF0dHJpYnV0ZXNba2V5XSxcbiAgICAgIH0pXG4gICAgKS5qb2luKCcnKSArICc+JyxcblxuICAgICc8aGVhZD4nLFxuXG4gICAgKGhlYWRTZWN0aW9ucy5sZW5ndGggPT09IDEpXG4gICAgICA/IFtjc3NCdW5kbGUsIGhlYWRTZWN0aW9uc1swXV0uam9pbignXFxuJylcbiAgICAgIDogW2hlYWRTZWN0aW9uc1swXSwgY3NzQnVuZGxlLCBoZWFkU2VjdGlvbnNbMV1dLmpvaW4oJ1xcbicpLFxuXG4gICAgZHluYW1pY0hlYWQsXG4gICAgJzwvaGVhZD4nLFxuICAgICc8Ym9keT4nLFxuICBdLmpvaW4oJ1xcbicpO1xufTtcblxuLy8gVGVtcGxhdGUgZnVuY3Rpb24gZm9yIHJlbmRlcmluZyB0aGUgYm9pbGVycGxhdGUgaHRtbCBmb3IgYnJvd3NlcnNcbmV4cG9ydCBjb25zdCBjbG9zZVRlbXBsYXRlID0gKHtcbiAgbWV0ZW9yUnVudGltZUNvbmZpZyxcbiAgcm9vdFVybFBhdGhQcmVmaXgsXG4gIGlubGluZVNjcmlwdHNBbGxvd2VkLFxuICBqcyxcbiAgYWRkaXRpb25hbFN0YXRpY0pzLFxuICBidW5kbGVkSnNDc3NVcmxSZXdyaXRlSG9vayxcbiAgc3JpTW9kZSxcbn0pID0+IFtcbiAgJycsXG4gIGlubGluZVNjcmlwdHNBbGxvd2VkXG4gICAgPyB0ZW1wbGF0ZSgnICA8c2NyaXB0IHR5cGU9XCJ0ZXh0L2phdmFzY3JpcHRcIj5fX21ldGVvcl9ydW50aW1lX2NvbmZpZ19fID0gSlNPTi5wYXJzZShkZWNvZGVVUklDb21wb25lbnQoPCU9IGNvbmYgJT4pKTwvc2NyaXB0PicpKHtcbiAgICAgIGNvbmY6IG1ldGVvclJ1bnRpbWVDb25maWcsXG4gICAgfSlcbiAgICA6IHRlbXBsYXRlKCcgIDxzY3JpcHQgdHlwZT1cInRleHQvamF2YXNjcmlwdFwiIHNyYz1cIjwlLSBzcmMgJT4vbWV0ZW9yX3J1bnRpbWVfY29uZmlnLmpzXCI+PC9zY3JpcHQ+Jykoe1xuICAgICAgc3JjOiByb290VXJsUGF0aFByZWZpeCxcbiAgICB9KSxcbiAgJycsXG5cbiAgLi4uKGpzIHx8IFtdKS5tYXAoZmlsZSA9PlxuICAgIHRlbXBsYXRlKCcgIDxzY3JpcHQgdHlwZT1cInRleHQvamF2YXNjcmlwdFwiIHNyYz1cIjwlLSBzcmMgJT5cIjwlPSBzcmkgJT4+PC9zY3JpcHQ+Jykoe1xuICAgICAgc3JjOiBidW5kbGVkSnNDc3NVcmxSZXdyaXRlSG9vayhmaWxlLnVybCksXG4gICAgICBzcmk6IHNyaShmaWxlLnNyaSwgc3JpTW9kZSksXG4gICAgfSlcbiAgKSxcblxuICAuLi4oYWRkaXRpb25hbFN0YXRpY0pzIHx8IFtdKS5tYXAoKHsgY29udGVudHMsIHBhdGhuYW1lIH0pID0+IChcbiAgICBpbmxpbmVTY3JpcHRzQWxsb3dlZFxuICAgICAgPyB0ZW1wbGF0ZSgnICA8c2NyaXB0PjwlPSBjb250ZW50cyAlPjwvc2NyaXB0PicpKHtcbiAgICAgICAgY29udGVudHMsXG4gICAgICB9KVxuICAgICAgOiB0ZW1wbGF0ZSgnICA8c2NyaXB0IHR5cGU9XCJ0ZXh0L2phdmFzY3JpcHRcIiBzcmM9XCI8JS0gc3JjICU+XCI+PC9zY3JpcHQ+Jykoe1xuICAgICAgICBzcmM6IHJvb3RVcmxQYXRoUHJlZml4ICsgcGF0aG5hbWUsXG4gICAgICB9KVxuICApKSxcbiAgJzxzY3JpcHQ+d2luZG93Ll8gPSB3aW5kb3cubG9kYXNoOzwvc2NyaXB0PicsXG4gICcnLFxuICAnJyxcbiAgJzwvYm9keT4nLFxuICAnPC9odG1sPidcbl0uam9pbignXFxuJyk7XG4iLCJpbXBvcnQgdGVtcGxhdGUgZnJvbSAnLi90ZW1wbGF0ZSc7XG5cbmNvbnN0IGV2YWxFbnYgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciByZWdleHAgPSAvXFwkeyhbXntdKyl9L2c7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKHN0ciwgbykge1xuICAgICAgICByZXR1cm4gc3RyLnJlcGxhY2UocmVnZXhwLCBmdW5jdGlvbihpZ25vcmUsIGtleSl7XG4gICAgICAgICAgICAgIHJldHVybiAodmFsdWUgPSBvW2tleV0pID09IG51bGwgPyAnJyA6IHZhbHVlO1xuICAgICAgICB9KTtcbiAgfVxufSkoKVxuXG4vLyBUZW1wbGF0ZSBmdW5jdGlvbiBmb3IgcmVuZGVyaW5nIHRoZSBib2lsZXJwbGF0ZSBodG1sIGZvciBjb3Jkb3ZhXG5leHBvcnQgY29uc3QgaGVhZFRlbXBsYXRlID0gKHtcbiAgbWV0ZW9yUnVudGltZUNvbmZpZyxcbiAgcm9vdFVybFBhdGhQcmVmaXgsXG4gIGlubGluZVNjcmlwdHNBbGxvd2VkLFxuICBjc3MsXG4gIGpzLFxuICBhZGRpdGlvbmFsU3RhdGljSnMsXG4gIGh0bWxBdHRyaWJ1dGVzLFxuICBidW5kbGVkSnNDc3NVcmxSZXdyaXRlSG9vayxcbiAgaGVhZCxcbiAgZHluYW1pY0hlYWQsXG59KSA9PiB7XG4gIGNvbnN0IHJlcGxhY2VkSGVhZCA9IGV2YWxFbnYoaGVhZCwgcHJvY2Vzcy5lbnYpO1xuICB2YXIgaGVhZFNlY3Rpb25zID0gcmVwbGFjZWRIZWFkLnNwbGl0KC88bWV0ZW9yLWJ1bmRsZWQtY3NzW148Pl0qPi8sIDIpO1xuICB2YXIgY3NzQnVuZGxlID0gW1xuICAgIC8vIFdlIGFyZSBleHBsaWNpdGx5IG5vdCB1c2luZyBidW5kbGVkSnNDc3NVcmxSZXdyaXRlSG9vazogaW4gY29yZG92YSB3ZSBzZXJ2ZSBhc3NldHMgdXAgZGlyZWN0bHkgZnJvbSBkaXNrLCBzbyByZXdyaXRpbmcgdGhlIFVSTCBkb2VzIG5vdCBtYWtlIHNlbnNlXG4gICAgLi4uKGNzcyB8fCBbXSkubWFwKGZpbGUgPT5cbiAgICAgIHRlbXBsYXRlKCcgIDxsaW5rIHJlbD1cInN0eWxlc2hlZXRcIiB0eXBlPVwidGV4dC9jc3NcIiBjbGFzcz1cIl9fbWV0ZW9yLWNzc19fXCIgaHJlZj1cIjwlLSBocmVmICU+XCI+Jykoe1xuICAgICAgICBocmVmOiBmaWxlLnVybCxcbiAgICAgIH0pXG4gICldLmpvaW4oJ1xcbicpO1xuXG4gIHJldHVybiBbXG4gICAgJzxodG1sPicsXG4gICAgJzxoZWFkPicsXG4gICAgJyAgPG1ldGEgY2hhcnNldD1cInV0Zi04XCI+JyxcbiAgICAnICA8bWV0YSBuYW1lPVwiZm9ybWF0LWRldGVjdGlvblwiIGNvbnRlbnQ9XCJ0ZWxlcGhvbmU9bm9cIj4nLFxuICAgICcgIDxtZXRhIG5hbWU9XCJ2aWV3cG9ydFwiIGNvbnRlbnQ9XCJ1c2VyLXNjYWxhYmxlPW5vLCBpbml0aWFsLXNjYWxlPTEsIG1heGltdW0tc2NhbGU9MSwgbWluaW11bS1zY2FsZT0xLCB3aWR0aD1kZXZpY2Utd2lkdGgsIGhlaWdodD1kZXZpY2UtaGVpZ2h0LCB2aWV3cG9ydC1maXQ9Y292ZXJcIj4nLFxuICAgICcgIDxtZXRhIG5hbWU9XCJtc2FwcGxpY2F0aW9uLXRhcC1oaWdobGlnaHRcIiBjb250ZW50PVwibm9cIj4nLFxuICAgICcgIDxtZXRhIGh0dHAtZXF1aXY9XCJDb250ZW50LVNlY3VyaXR5LVBvbGljeVwiIGNvbnRlbnQ9XCJkZWZhdWx0LXNyYyAqIGdhcDogZGF0YTogYmxvYjogXFwndW5zYWZlLWlubGluZVxcJyBcXCd1bnNhZmUtZXZhbFxcJyB3czogd3NzOjtcIj4nLFxuXG4gIChoZWFkU2VjdGlvbnMubGVuZ3RoID09PSAxKVxuICAgID8gW2Nzc0J1bmRsZSwgaGVhZFNlY3Rpb25zWzBdXS5qb2luKCdcXG4nKVxuICAgIDogW2hlYWRTZWN0aW9uc1swXSwgY3NzQnVuZGxlLCBoZWFkU2VjdGlvbnNbMV1dLmpvaW4oJ1xcbicpLFxuXG4gICAgJyAgPHNjcmlwdCB0eXBlPVwidGV4dC9qYXZhc2NyaXB0XCI+JyxcbiAgICB0ZW1wbGF0ZSgnICAgIF9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18gPSBKU09OLnBhcnNlKGRlY29kZVVSSUNvbXBvbmVudCg8JT0gY29uZiAlPikpOycpKHtcbiAgICAgIGNvbmY6IG1ldGVvclJ1bnRpbWVDb25maWcsXG4gICAgfSksXG4gICAgJyAgICBpZiAoL0FuZHJvaWQvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpKSB7JyxcbiAgICAvLyBXaGVuIEFuZHJvaWQgYXBwIGlzIGVtdWxhdGVkLCBpdCBjYW5ub3QgY29ubmVjdCB0byBsb2NhbGhvc3QsXG4gICAgLy8gaW5zdGVhZCBpdCBzaG91bGQgY29ubmVjdCB0byAxMC4wLjIuMlxuICAgIC8vICh1bmxlc3Mgd2VcXCdyZSB1c2luZyBhbiBodHRwIHByb3h5OyB0aGVuIGl0IHdvcmtzISlcbiAgICAnICAgICAgaWYgKCFfX21ldGVvcl9ydW50aW1lX2NvbmZpZ19fLmh0dHBQcm94eVBvcnQpIHsnLFxuICAgICcgICAgICAgIF9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18uUk9PVF9VUkwgPSAoX19tZXRlb3JfcnVudGltZV9jb25maWdfXy5ST09UX1VSTCB8fCBcXCdcXCcpLnJlcGxhY2UoL2xvY2FsaG9zdC9pLCBcXCcxMC4wLjIuMlxcJyk7JyxcbiAgICAnICAgICAgICBfX21ldGVvcl9ydW50aW1lX2NvbmZpZ19fLkREUF9ERUZBVUxUX0NPTk5FQ1RJT05fVVJMID0gKF9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18uRERQX0RFRkFVTFRfQ09OTkVDVElPTl9VUkwgfHwgXFwnXFwnKS5yZXBsYWNlKC9sb2NhbGhvc3QvaSwgXFwnMTAuMC4yLjJcXCcpOycsXG4gICAgJyAgICAgIH0nLFxuICAgICcgICAgfScsXG4gICAgJ2lmKCFkb2N1bWVudC5ib2R5KXtcXG4nICtcbiAgICAnICAgIHZhciB0ZW1wQm9keSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJib2R5XCIpO1xcbicgK1xuICAgICcgICAgZG9jdW1lbnQuYm9keSA9IHRlbXBCb2R5O1xcbicgK1xuICAgICcgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcXCdET01Db250ZW50TG9hZGVkXFwnLCAoZXZlbnQpID0+IHtcXG4nICtcbiAgICAnICAgICAgICB0ZW1wQm9keS5yZW1vdmUoKVxcbicgK1xuICAgICcgICAgfSk7XFxuJyArXG4gICAgJ30nLFxuICAgICcgIDwvc2NyaXB0PicsXG4gICAgJycsXG4gICAgJyAgPHNjcmlwdCB0eXBlPVwidGV4dC9qYXZhc2NyaXB0XCIgc3JjPVwiL2NvcmRvdmEuanNcIj48L3NjcmlwdD4nLFxuXG4gICAgLi4uKGpzIHx8IFtdKS5tYXAoZmlsZSA9PlxuICAgICAgdGVtcGxhdGUoJyAgPHNjcmlwdCB0eXBlPVwidGV4dC9qYXZhc2NyaXB0XCIgc3JjPVwiPCUtIHNyYyAlPlwiPjwvc2NyaXB0PicpKHtcbiAgICAgICAgc3JjOiBmaWxlLnVybCxcbiAgICAgIH0pXG4gICAgKSxcblxuICAgIC4uLihhZGRpdGlvbmFsU3RhdGljSnMgfHwgW10pLm1hcCgoeyBjb250ZW50cywgcGF0aG5hbWUgfSkgPT4gKFxuICAgICAgaW5saW5lU2NyaXB0c0FsbG93ZWRcbiAgICAgICAgPyB0ZW1wbGF0ZSgnICA8c2NyaXB0PjwlPSBjb250ZW50cyAlPjwvc2NyaXB0PicpKHtcbiAgICAgICAgICBjb250ZW50cyxcbiAgICAgICAgfSlcbiAgICAgICAgOiB0ZW1wbGF0ZSgnICA8c2NyaXB0IHR5cGU9XCJ0ZXh0L2phdmFzY3JpcHRcIiBzcmM9XCI8JS0gc3JjICU+XCI+PC9zY3JpcHQ+Jykoe1xuICAgICAgICAgIHNyYzogTWV0ZW9yLmFic29sdXRlVXJsKHBhdGhuYW1lKVxuICAgICAgICB9KVxuICAgICkpLFxuICAgICcnLFxuICAgICc8L2hlYWQ+JyxcbiAgICAnJyxcbiAgICAnPGJvZHk+JyxcbiAgXS5qb2luKCdcXG4nKTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBjbG9zZVRlbXBsYXRlKCkge1xuICByZXR1cm4gXCI8L2JvZHk+XFxuPC9odG1sPlwiO1xufVxuIiwiaW1wb3J0IHsgXyB9IGZyb20gJ21ldGVvci91bmRlcnNjb3JlJztcblxuLy8gQXMgaWRlbnRpZmllZCBpbiBpc3N1ZSAjOTE0OSwgd2hlbiBhbiBhcHBsaWNhdGlvbiBvdmVycmlkZXMgdGhlIGRlZmF1bHRcbi8vIF8udGVtcGxhdGUgc2V0dGluZ3MgdXNpbmcgXy50ZW1wbGF0ZVNldHRpbmdzLCB0aG9zZSBuZXcgc2V0dGluZ3MgYXJlXG4vLyB1c2VkIGFueXdoZXJlIF8udGVtcGxhdGUgaXMgdXNlZCwgaW5jbHVkaW5nIHdpdGhpbiB0aGVcbi8vIGJvaWxlcnBsYXRlLWdlbmVyYXRvci4gVG8gaGFuZGxlIHRoaXMsIF8udGVtcGxhdGUgc2V0dGluZ3MgdGhhdCBoYXZlXG4vLyBiZWVuIHZlcmlmaWVkIHRvIHdvcmsgYXJlIG92ZXJyaWRkZW4gaGVyZSBvbiBlYWNoIF8udGVtcGxhdGUgY2FsbC5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHRlbXBsYXRlKHRleHQpIHtcbiAgcmV0dXJuIF8udGVtcGxhdGUodGV4dCwgbnVsbCwge1xuICAgIGV2YWx1YXRlICAgIDogLzwlKFtcXHNcXFNdKz8pJT4vZyxcbiAgICBpbnRlcnBvbGF0ZSA6IC88JT0oW1xcc1xcU10rPyklPi9nLFxuICAgIGVzY2FwZSAgICAgIDogLzwlLShbXFxzXFxTXSs/KSU+L2csXG4gIH0pO1xufTtcbiJdfQ==
