(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var _ = Package.underscore._;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var Boilerplate;

var require = meteorInstall({"node_modules":{"meteor":{"boilerplate-generator":{"generator.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/boilerplate-generator/generator.js                                                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

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
  constructor(arch, manifest, options = {}) {
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

    const data = (0, _objectSpread2.default)({}, this.baseData, extraData);
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


  _generateBoilerplateFromManifest(manifest, {
    urlMapper = identity,
    pathMapper = identity,
    baseDataExtension,
    inline
  } = {}) {
    const boilerplateBaseData = (0, _objectSpread2.default)({
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"template-web.browser.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/boilerplate-generator/template-web.browser.js                                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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

const sri = (sri, mode) => sri && mode ? ` integrity="sha512-${sri}" crossorigin="${mode}"` : '';

const headTemplate = ({
  css,
  htmlAttributes,
  bundledJsCssUrlRewriteHook,
  sriMode,
  head,
  dynamicHead
}) => {
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

const closeTemplate = ({
  meteorRuntimeConfig,
  rootUrlPathPrefix,
  inlineScriptsAllowed,
  js,
  additionalStaticJs,
  bundledJsCssUrlRewriteHook,
  sriMode
}) => ['', inlineScriptsAllowed ? template('  <script type="text/javascript">__meteor_runtime_config__ = JSON.parse(decodeURIComponent(<%= conf %>))</script>')({
  conf: meteorRuntimeConfig
}) : template('  <script type="text/javascript" src="<%- src %>/meteor_runtime_config.js"></script>')({
  src: rootUrlPathPrefix
}), '', ...(js || []).map(file => template('  <script type="text/javascript" src="<%- src %>"<%= sri %>></script>')({
  src: bundledJsCssUrlRewriteHook(file.url),
  sri: sri(file.sri, sriMode)
})), ...(additionalStaticJs || []).map(({
  contents,
  pathname
}) => inlineScriptsAllowed ? template('  <script><%= contents %></script>')({
  contents
}) : template('  <script type="text/javascript" src="<%- src %>"></script>')({
  src: rootUrlPathPrefix + pathname
})), '', '', '</body>', '</html>'].join('\n');
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"template-web.cordova.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/boilerplate-generator/template-web.cordova.js                                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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

const headTemplate = ({
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
}) => {
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
  '      if (!__meteor_runtime_config__.httpProxyPort) {', '        __meteor_runtime_config__.ROOT_URL = (__meteor_runtime_config__.ROOT_URL || \'\').replace(/localhost/i, \'10.0.2.2\');', '        __meteor_runtime_config__.DDP_DEFAULT_CONNECTION_URL = (__meteor_runtime_config__.DDP_DEFAULT_CONNECTION_URL || \'\').replace(/localhost/i, \'10.0.2.2\');', '      }', '    }', '  </script>', '', '  <script type="text/javascript" src="/cordova.js"></script>', ...(js || []).map(file => template('  <script type="text/javascript" src="<%- src %>"></script>')({
    src: file.url
  })), ...(additionalStaticJs || []).map(({
    contents,
    pathname
  }) => inlineScriptsAllowed ? template('  <script><%= contents %></script>')({
    contents
  }) : template('  <script type="text/javascript" src="<%- src %>"></script>')({
    src: rootUrlPathPrefix + pathname
  })), '', '</head>', '', '<body>'].join('\n');
};

function closeTemplate() {
  return "</body>\n</html>";
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"template.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/boilerplate-generator/template.js                                                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"node_modules":{"combined-stream2":{"package.json":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/boilerplate-generator/node_modules/combined-stream2/package.json                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.exports = {
  "name": "combined-stream2",
  "version": "1.1.2",
  "main": "index.js"
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/boilerplate-generator/node_modules/combined-stream2/index.js                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.useNode();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvYm9pbGVycGxhdGUtZ2VuZXJhdG9yL2dlbmVyYXRvci5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvYm9pbGVycGxhdGUtZ2VuZXJhdG9yL3RlbXBsYXRlLXdlYi5icm93c2VyLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9ib2lsZXJwbGF0ZS1nZW5lcmF0b3IvdGVtcGxhdGUtd2ViLmNvcmRvdmEuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2JvaWxlcnBsYXRlLWdlbmVyYXRvci90ZW1wbGF0ZS5qcyJdLCJuYW1lcyI6WyJtb2R1bGUiLCJleHBvcnQiLCJCb2lsZXJwbGF0ZSIsInJlYWRGaWxlIiwibGluayIsInYiLCJjcmVhdGVTdHJlYW0iLCJjcmVhdGUiLCJXZWJCcm93c2VyVGVtcGxhdGUiLCJkZWZhdWx0IiwiV2ViQ29yZG92YVRlbXBsYXRlIiwicmVhZFV0ZjhGaWxlU3luYyIsImZpbGVuYW1lIiwiTWV0ZW9yIiwid3JhcEFzeW5jIiwiaWRlbnRpdHkiLCJ2YWx1ZSIsImFwcGVuZFRvU3RyZWFtIiwiY2h1bmsiLCJzdHJlYW0iLCJhcHBlbmQiLCJCdWZmZXIiLCJmcm9tIiwiaXNCdWZmZXIiLCJyZWFkIiwic2hvdWxkV2FybkFib3V0VG9IVE1MRGVwcmVjYXRpb24iLCJpc1Byb2R1Y3Rpb24iLCJjb25zdHJ1Y3RvciIsImFyY2giLCJtYW5pZmVzdCIsIm9wdGlvbnMiLCJoZWFkVGVtcGxhdGUiLCJjbG9zZVRlbXBsYXRlIiwiZ2V0VGVtcGxhdGUiLCJiYXNlRGF0YSIsIl9nZW5lcmF0ZUJvaWxlcnBsYXRlRnJvbU1hbmlmZXN0IiwidG9IVE1MIiwiZXh0cmFEYXRhIiwiY29uc29sZSIsImVycm9yIiwidHJhY2UiLCJ0b0hUTUxBc3luYyIsImF3YWl0IiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJ0b0hUTUxTdHJlYW0iLCJjaHVua3MiLCJvbiIsInB1c2giLCJjb25jYXQiLCJ0b1N0cmluZyIsIkVycm9yIiwiZGF0YSIsInN0YXJ0IiwiYm9keSIsImR5bmFtaWNCb2R5IiwiZW5kIiwicmVzcG9uc2UiLCJ1cmxNYXBwZXIiLCJwYXRoTWFwcGVyIiwiYmFzZURhdGFFeHRlbnNpb24iLCJpbmxpbmUiLCJib2lsZXJwbGF0ZUJhc2VEYXRhIiwiY3NzIiwianMiLCJoZWFkIiwibWV0ZW9yTWFuaWZlc3QiLCJKU09OIiwic3RyaW5naWZ5IiwiZm9yRWFjaCIsIml0ZW0iLCJ1cmxQYXRoIiwidXJsIiwiaXRlbU9iaiIsInNjcmlwdENvbnRlbnQiLCJwYXRoIiwic3JpIiwidHlwZSIsIndoZXJlIiwic3RhcnRzV2l0aCIsInByZWZpeCIsInNwbGl0Iiwiam9pbiIsInRlbXBsYXRlIiwibW9kZSIsImh0bWxBdHRyaWJ1dGVzIiwiYnVuZGxlZEpzQ3NzVXJsUmV3cml0ZUhvb2siLCJzcmlNb2RlIiwiZHluYW1pY0hlYWQiLCJoZWFkU2VjdGlvbnMiLCJjc3NCdW5kbGUiLCJtYXAiLCJmaWxlIiwiaHJlZiIsIk9iamVjdCIsImtleXMiLCJrZXkiLCJhdHRyTmFtZSIsImF0dHJWYWx1ZSIsImxlbmd0aCIsIm1ldGVvclJ1bnRpbWVDb25maWciLCJyb290VXJsUGF0aFByZWZpeCIsImlubGluZVNjcmlwdHNBbGxvd2VkIiwiYWRkaXRpb25hbFN0YXRpY0pzIiwiY29uZiIsInNyYyIsImNvbnRlbnRzIiwicGF0aG5hbWUiLCJfIiwidGV4dCIsImV2YWx1YXRlIiwiaW50ZXJwb2xhdGUiLCJlc2NhcGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBQSxNQUFNLENBQUNDLE1BQVAsQ0FBYztBQUFDQyxhQUFXLEVBQUMsTUFBSUE7QUFBakIsQ0FBZDtBQUE2QyxJQUFJQyxRQUFKO0FBQWFILE1BQU0sQ0FBQ0ksSUFBUCxDQUFZLElBQVosRUFBaUI7QUFBQ0QsVUFBUSxDQUFDRSxDQUFELEVBQUc7QUFBQ0YsWUFBUSxHQUFDRSxDQUFUO0FBQVc7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TCxFQTdDSyxFQThDTCxTQTlDSyxFQStDTCxFQS9DSyxFQWdETCxRQWhESyxFQWlETHpCLElBakRLLENBaURBLElBakRBLENBQVA7QUFrREQsQ0F2RU07O0FBeUVBLFNBQVNuRCxhQUFULEdBQXlCO0FBQzlCLFNBQU8sa0JBQVA7QUFDRCxDOzs7Ozs7Ozs7OztBQzlFRGhDLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjO0FBQUNRLFNBQU8sRUFBQyxNQUFJMkU7QUFBYixDQUFkOztBQUFzQyxJQUFJeUIsQ0FBSjs7QUFBTTdHLE1BQU0sQ0FBQ0ksSUFBUCxDQUFZLG1CQUFaLEVBQWdDO0FBQUN5RyxHQUFDLENBQUN4RyxDQUFELEVBQUc7QUFBQ3dHLEtBQUMsR0FBQ3hHLENBQUY7QUFBSTs7QUFBVixDQUFoQyxFQUE0QyxDQUE1Qzs7QUFPN0IsU0FBUytFLFFBQVQsQ0FBa0IwQixJQUFsQixFQUF3QjtBQUNyQyxTQUFPRCxDQUFDLENBQUN6QixRQUFGLENBQVcwQixJQUFYLEVBQWlCLElBQWpCLEVBQXVCO0FBQzVCQyxZQUFRLEVBQU0saUJBRGM7QUFFNUJDLGVBQVcsRUFBRyxrQkFGYztBQUc1QkMsVUFBTSxFQUFRO0FBSGMsR0FBdkIsQ0FBUDtBQUtEOztBQUFBLEMiLCJmaWxlIjoiL3BhY2thZ2VzL2JvaWxlcnBsYXRlLWdlbmVyYXRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHJlYWRGaWxlIH0gZnJvbSAnZnMnO1xuaW1wb3J0IHsgY3JlYXRlIGFzIGNyZWF0ZVN0cmVhbSB9IGZyb20gXCJjb21iaW5lZC1zdHJlYW0yXCI7XG5cbmltcG9ydCBXZWJCcm93c2VyVGVtcGxhdGUgZnJvbSAnLi90ZW1wbGF0ZS13ZWIuYnJvd3Nlcic7XG5pbXBvcnQgV2ViQ29yZG92YVRlbXBsYXRlIGZyb20gJy4vdGVtcGxhdGUtd2ViLmNvcmRvdmEnO1xuXG4vLyBDb3BpZWQgZnJvbSB3ZWJhcHBfc2VydmVyXG5jb25zdCByZWFkVXRmOEZpbGVTeW5jID0gZmlsZW5hbWUgPT4gTWV0ZW9yLndyYXBBc3luYyhyZWFkRmlsZSkoZmlsZW5hbWUsICd1dGY4Jyk7XG5cbmNvbnN0IGlkZW50aXR5ID0gdmFsdWUgPT4gdmFsdWU7XG5cbmZ1bmN0aW9uIGFwcGVuZFRvU3RyZWFtKGNodW5rLCBzdHJlYW0pIHtcbiAgaWYgKHR5cGVvZiBjaHVuayA9PT0gXCJzdHJpbmdcIikge1xuICAgIHN0cmVhbS5hcHBlbmQoQnVmZmVyLmZyb20oY2h1bmssIFwidXRmOFwiKSk7XG4gIH0gZWxzZSBpZiAoQnVmZmVyLmlzQnVmZmVyKGNodW5rKSB8fFxuICAgICAgICAgICAgIHR5cGVvZiBjaHVuay5yZWFkID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBzdHJlYW0uYXBwZW5kKGNodW5rKTtcbiAgfVxufVxuXG5sZXQgc2hvdWxkV2FybkFib3V0VG9IVE1MRGVwcmVjYXRpb24gPSAhIE1ldGVvci5pc1Byb2R1Y3Rpb247XG5cbmV4cG9ydCBjbGFzcyBCb2lsZXJwbGF0ZSB7XG4gIGNvbnN0cnVjdG9yKGFyY2gsIG1hbmlmZXN0LCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCB7IGhlYWRUZW1wbGF0ZSwgY2xvc2VUZW1wbGF0ZSB9ID0gZ2V0VGVtcGxhdGUoYXJjaCk7XG4gICAgdGhpcy5oZWFkVGVtcGxhdGUgPSBoZWFkVGVtcGxhdGU7XG4gICAgdGhpcy5jbG9zZVRlbXBsYXRlID0gY2xvc2VUZW1wbGF0ZTtcbiAgICB0aGlzLmJhc2VEYXRhID0gbnVsbDtcblxuICAgIHRoaXMuX2dlbmVyYXRlQm9pbGVycGxhdGVGcm9tTWFuaWZlc3QoXG4gICAgICBtYW5pZmVzdCxcbiAgICAgIG9wdGlvbnNcbiAgICApO1xuICB9XG5cbiAgdG9IVE1MKGV4dHJhRGF0YSkge1xuICAgIGlmIChzaG91bGRXYXJuQWJvdXRUb0hUTUxEZXByZWNhdGlvbikge1xuICAgICAgc2hvdWxkV2FybkFib3V0VG9IVE1MRGVwcmVjYXRpb24gPSBmYWxzZTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgIFwiVGhlIEJvaWxlcnBsYXRlI3RvSFRNTCBtZXRob2QgaGFzIGJlZW4gZGVwcmVjYXRlZC4gXCIgK1xuICAgICAgICAgIFwiUGxlYXNlIHVzZSBCb2lsZXJwbGF0ZSN0b0hUTUxTdHJlYW0gaW5zdGVhZC5cIlxuICAgICAgKTtcbiAgICAgIGNvbnNvbGUudHJhY2UoKTtcbiAgICB9XG5cbiAgICAvLyBDYWxsaW5nIC5hd2FpdCgpIHJlcXVpcmVzIGEgRmliZXIuXG4gICAgcmV0dXJuIHRoaXMudG9IVE1MQXN5bmMoZXh0cmFEYXRhKS5hd2FpdCgpO1xuICB9XG5cbiAgLy8gUmV0dXJucyBhIFByb21pc2UgdGhhdCByZXNvbHZlcyB0byBhIHN0cmluZyBvZiBIVE1MLlxuICB0b0hUTUxBc3luYyhleHRyYURhdGEpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3Qgc3RyZWFtID0gdGhpcy50b0hUTUxTdHJlYW0oZXh0cmFEYXRhKTtcbiAgICAgIGNvbnN0IGNodW5rcyA9IFtdO1xuICAgICAgc3RyZWFtLm9uKFwiZGF0YVwiLCBjaHVuayA9PiBjaHVua3MucHVzaChjaHVuaykpO1xuICAgICAgc3RyZWFtLm9uKFwiZW5kXCIsICgpID0+IHtcbiAgICAgICAgcmVzb2x2ZShCdWZmZXIuY29uY2F0KGNodW5rcykudG9TdHJpbmcoXCJ1dGY4XCIpKTtcbiAgICAgIH0pO1xuICAgICAgc3RyZWFtLm9uKFwiZXJyb3JcIiwgcmVqZWN0KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIFRoZSAnZXh0cmFEYXRhJyBhcmd1bWVudCBjYW4gYmUgdXNlZCB0byBleHRlbmQgJ3NlbGYuYmFzZURhdGEnLiBJdHNcbiAgLy8gcHVycG9zZSBpcyB0byBhbGxvdyB5b3UgdG8gc3BlY2lmeSBkYXRhIHRoYXQgeW91IG1pZ2h0IG5vdCBrbm93IGF0XG4gIC8vIHRoZSB0aW1lIHRoYXQgeW91IGNvbnN0cnVjdCB0aGUgQm9pbGVycGxhdGUgb2JqZWN0LiAoZS5nLiBpdCBpcyB1c2VkXG4gIC8vIGJ5ICd3ZWJhcHAnIHRvIHNwZWNpZnkgZGF0YSB0aGF0IGlzIG9ubHkga25vd24gYXQgcmVxdWVzdC10aW1lKS5cbiAgLy8gdGhpcyByZXR1cm5zIGEgc3RyZWFtXG4gIHRvSFRNTFN0cmVhbShleHRyYURhdGEpIHtcbiAgICBpZiAoIXRoaXMuYmFzZURhdGEgfHwgIXRoaXMuaGVhZFRlbXBsYXRlIHx8ICF0aGlzLmNsb3NlVGVtcGxhdGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQm9pbGVycGxhdGUgZGlkIG5vdCBpbnN0YW50aWF0ZSBjb3JyZWN0bHkuJyk7XG4gICAgfVxuXG4gICAgY29uc3QgZGF0YSA9IHsuLi50aGlzLmJhc2VEYXRhLCAuLi5leHRyYURhdGF9O1xuICAgIGNvbnN0IHN0YXJ0ID0gXCI8IURPQ1RZUEUgaHRtbD5cXG5cIiArIHRoaXMuaGVhZFRlbXBsYXRlKGRhdGEpO1xuXG4gICAgY29uc3QgeyBib2R5LCBkeW5hbWljQm9keSB9ID0gZGF0YTtcblxuICAgIGNvbnN0IGVuZCA9IHRoaXMuY2xvc2VUZW1wbGF0ZShkYXRhKTtcbiAgICBjb25zdCByZXNwb25zZSA9IGNyZWF0ZVN0cmVhbSgpO1xuXG4gICAgYXBwZW5kVG9TdHJlYW0oc3RhcnQsIHJlc3BvbnNlKTtcblxuICAgIGlmIChib2R5KSB7XG4gICAgICBhcHBlbmRUb1N0cmVhbShib2R5LCByZXNwb25zZSk7XG4gICAgfVxuXG4gICAgaWYgKGR5bmFtaWNCb2R5KSB7XG4gICAgICBhcHBlbmRUb1N0cmVhbShkeW5hbWljQm9keSwgcmVzcG9uc2UpO1xuICAgIH1cblxuICAgIGFwcGVuZFRvU3RyZWFtKGVuZCwgcmVzcG9uc2UpO1xuXG4gICAgcmV0dXJuIHJlc3BvbnNlO1xuICB9XG5cbiAgLy8gWFhYIEV4cG9ydGVkIHRvIGFsbG93IGNsaWVudC1zaWRlIG9ubHkgY2hhbmdlcyB0byByZWJ1aWxkIHRoZSBib2lsZXJwbGF0ZVxuICAvLyB3aXRob3V0IHJlcXVpcmluZyBhIGZ1bGwgc2VydmVyIHJlc3RhcnQuXG4gIC8vIFByb2R1Y2VzIGFuIEhUTUwgc3RyaW5nIHdpdGggZ2l2ZW4gbWFuaWZlc3QgYW5kIGJvaWxlcnBsYXRlU291cmNlLlxuICAvLyBPcHRpb25hbGx5IHRha2VzIHVybE1hcHBlciBpbiBjYXNlIHVybHMgZnJvbSBtYW5pZmVzdCBuZWVkIHRvIGJlIHByZWZpeGVkXG4gIC8vIG9yIHJld3JpdHRlbi5cbiAgLy8gT3B0aW9uYWxseSB0YWtlcyBwYXRoTWFwcGVyIGZvciByZXNvbHZpbmcgcmVsYXRpdmUgZmlsZSBzeXN0ZW0gcGF0aHMuXG4gIC8vIE9wdGlvbmFsbHkgYWxsb3dzIHRvIG92ZXJyaWRlIGZpZWxkcyBvZiB0aGUgZGF0YSBjb250ZXh0LlxuICBfZ2VuZXJhdGVCb2lsZXJwbGF0ZUZyb21NYW5pZmVzdChtYW5pZmVzdCwge1xuICAgIHVybE1hcHBlciA9IGlkZW50aXR5LFxuICAgIHBhdGhNYXBwZXIgPSBpZGVudGl0eSxcbiAgICBiYXNlRGF0YUV4dGVuc2lvbixcbiAgICBpbmxpbmUsXG4gIH0gPSB7fSkge1xuXG4gICAgY29uc3QgYm9pbGVycGxhdGVCYXNlRGF0YSA9IHtcbiAgICAgIGNzczogW10sXG4gICAgICBqczogW10sXG4gICAgICBoZWFkOiAnJyxcbiAgICAgIGJvZHk6ICcnLFxuICAgICAgbWV0ZW9yTWFuaWZlc3Q6IEpTT04uc3RyaW5naWZ5KG1hbmlmZXN0KSxcbiAgICAgIC4uLmJhc2VEYXRhRXh0ZW5zaW9uLFxuICAgIH07XG5cbiAgICBtYW5pZmVzdC5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgY29uc3QgdXJsUGF0aCA9IHVybE1hcHBlcihpdGVtLnVybCk7XG4gICAgICBjb25zdCBpdGVtT2JqID0geyB1cmw6IHVybFBhdGggfTtcblxuICAgICAgaWYgKGlubGluZSkge1xuICAgICAgICBpdGVtT2JqLnNjcmlwdENvbnRlbnQgPSByZWFkVXRmOEZpbGVTeW5jKFxuICAgICAgICAgIHBhdGhNYXBwZXIoaXRlbS5wYXRoKSk7XG4gICAgICAgIGl0ZW1PYmouaW5saW5lID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSBpZiAoaXRlbS5zcmkpIHtcbiAgICAgICAgaXRlbU9iai5zcmkgPSBpdGVtLnNyaTtcbiAgICAgIH1cblxuICAgICAgaWYgKGl0ZW0udHlwZSA9PT0gJ2NzcycgJiYgaXRlbS53aGVyZSA9PT0gJ2NsaWVudCcpIHtcbiAgICAgICAgYm9pbGVycGxhdGVCYXNlRGF0YS5jc3MucHVzaChpdGVtT2JqKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGl0ZW0udHlwZSA9PT0gJ2pzJyAmJiBpdGVtLndoZXJlID09PSAnY2xpZW50JyAmJlxuICAgICAgICAvLyBEeW5hbWljIEpTIG1vZHVsZXMgc2hvdWxkIG5vdCBiZSBsb2FkZWQgZWFnZXJseSBpbiB0aGVcbiAgICAgICAgLy8gaW5pdGlhbCBIVE1MIG9mIHRoZSBhcHAuXG4gICAgICAgICFpdGVtLnBhdGguc3RhcnRzV2l0aCgnZHluYW1pYy8nKSkge1xuICAgICAgICBib2lsZXJwbGF0ZUJhc2VEYXRhLmpzLnB1c2goaXRlbU9iaik7XG4gICAgICB9XG5cbiAgICAgIGlmIChpdGVtLnR5cGUgPT09ICdoZWFkJykge1xuICAgICAgICBib2lsZXJwbGF0ZUJhc2VEYXRhLmhlYWQgPVxuICAgICAgICAgIHJlYWRVdGY4RmlsZVN5bmMocGF0aE1hcHBlcihpdGVtLnBhdGgpKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGl0ZW0udHlwZSA9PT0gJ2JvZHknKSB7XG4gICAgICAgIGJvaWxlcnBsYXRlQmFzZURhdGEuYm9keSA9XG4gICAgICAgICAgcmVhZFV0ZjhGaWxlU3luYyhwYXRoTWFwcGVyKGl0ZW0ucGF0aCkpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5iYXNlRGF0YSA9IGJvaWxlcnBsYXRlQmFzZURhdGE7XG4gIH1cbn07XG5cbi8vIFJldHVybnMgYSB0ZW1wbGF0ZSBmdW5jdGlvbiB0aGF0LCB3aGVuIGNhbGxlZCwgcHJvZHVjZXMgdGhlIGJvaWxlcnBsYXRlXG4vLyBodG1sIGFzIGEgc3RyaW5nLlxuZnVuY3Rpb24gZ2V0VGVtcGxhdGUoYXJjaCkge1xuICBjb25zdCBwcmVmaXggPSBhcmNoLnNwbGl0KFwiLlwiLCAyKS5qb2luKFwiLlwiKTtcblxuICBpZiAocHJlZml4ID09PSBcIndlYi5icm93c2VyXCIpIHtcbiAgICByZXR1cm4gV2ViQnJvd3NlclRlbXBsYXRlO1xuICB9XG5cbiAgaWYgKHByZWZpeCA9PT0gXCJ3ZWIuY29yZG92YVwiKSB7XG4gICAgcmV0dXJuIFdlYkNvcmRvdmFUZW1wbGF0ZTtcbiAgfVxuXG4gIHRocm93IG5ldyBFcnJvcihcIlVuc3VwcG9ydGVkIGFyY2g6IFwiICsgYXJjaCk7XG59XG4iLCJpbXBvcnQgdGVtcGxhdGUgZnJvbSAnLi90ZW1wbGF0ZSc7XG5cbmNvbnN0IHNyaSA9IChzcmksIG1vZGUpID0+XG4gIChzcmkgJiYgbW9kZSkgPyBgIGludGVncml0eT1cInNoYTUxMi0ke3NyaX1cIiBjcm9zc29yaWdpbj1cIiR7bW9kZX1cImAgOiAnJztcblxuZXhwb3J0IGNvbnN0IGhlYWRUZW1wbGF0ZSA9ICh7XG4gIGNzcyxcbiAgaHRtbEF0dHJpYnV0ZXMsXG4gIGJ1bmRsZWRKc0Nzc1VybFJld3JpdGVIb29rLFxuICBzcmlNb2RlLFxuICBoZWFkLFxuICBkeW5hbWljSGVhZCxcbn0pID0+IHtcbiAgdmFyIGhlYWRTZWN0aW9ucyA9IGhlYWQuc3BsaXQoLzxtZXRlb3ItYnVuZGxlZC1jc3NbXjw+XSo+LywgMik7XG4gIHZhciBjc3NCdW5kbGUgPSBbLi4uKGNzcyB8fCBbXSkubWFwKGZpbGUgPT5cbiAgICB0ZW1wbGF0ZSgnICA8bGluayByZWw9XCJzdHlsZXNoZWV0XCIgdHlwZT1cInRleHQvY3NzXCIgY2xhc3M9XCJfX21ldGVvci1jc3NfX1wiIGhyZWY9XCI8JS0gaHJlZiAlPlwiPCU9IHNyaSAlPj4nKSh7XG4gICAgICBocmVmOiBidW5kbGVkSnNDc3NVcmxSZXdyaXRlSG9vayhmaWxlLnVybCksXG4gICAgICBzcmk6IHNyaShmaWxlLnNyaSwgc3JpTW9kZSksXG4gICAgfSlcbiAgKV0uam9pbignXFxuJyk7XG5cbiAgcmV0dXJuIFtcbiAgICAnPGh0bWwnICsgT2JqZWN0LmtleXMoaHRtbEF0dHJpYnV0ZXMgfHwge30pLm1hcChcbiAgICAgIGtleSA9PiB0ZW1wbGF0ZSgnIDwlPSBhdHRyTmFtZSAlPj1cIjwlLSBhdHRyVmFsdWUgJT5cIicpKHtcbiAgICAgICAgYXR0ck5hbWU6IGtleSxcbiAgICAgICAgYXR0clZhbHVlOiBodG1sQXR0cmlidXRlc1trZXldLFxuICAgICAgfSlcbiAgICApLmpvaW4oJycpICsgJz4nLFxuXG4gICAgJzxoZWFkPicsXG5cbiAgICAoaGVhZFNlY3Rpb25zLmxlbmd0aCA9PT0gMSlcbiAgICAgID8gW2Nzc0J1bmRsZSwgaGVhZFNlY3Rpb25zWzBdXS5qb2luKCdcXG4nKVxuICAgICAgOiBbaGVhZFNlY3Rpb25zWzBdLCBjc3NCdW5kbGUsIGhlYWRTZWN0aW9uc1sxXV0uam9pbignXFxuJyksXG5cbiAgICBkeW5hbWljSGVhZCxcbiAgICAnPC9oZWFkPicsXG4gICAgJzxib2R5PicsXG4gIF0uam9pbignXFxuJyk7XG59O1xuXG4vLyBUZW1wbGF0ZSBmdW5jdGlvbiBmb3IgcmVuZGVyaW5nIHRoZSBib2lsZXJwbGF0ZSBodG1sIGZvciBicm93c2Vyc1xuZXhwb3J0IGNvbnN0IGNsb3NlVGVtcGxhdGUgPSAoe1xuICBtZXRlb3JSdW50aW1lQ29uZmlnLFxuICByb290VXJsUGF0aFByZWZpeCxcbiAgaW5saW5lU2NyaXB0c0FsbG93ZWQsXG4gIGpzLFxuICBhZGRpdGlvbmFsU3RhdGljSnMsXG4gIGJ1bmRsZWRKc0Nzc1VybFJld3JpdGVIb29rLFxuICBzcmlNb2RlLFxufSkgPT4gW1xuICAnJyxcbiAgaW5saW5lU2NyaXB0c0FsbG93ZWRcbiAgICA/IHRlbXBsYXRlKCcgIDxzY3JpcHQgdHlwZT1cInRleHQvamF2YXNjcmlwdFwiPl9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18gPSBKU09OLnBhcnNlKGRlY29kZVVSSUNvbXBvbmVudCg8JT0gY29uZiAlPikpPC9zY3JpcHQ+Jykoe1xuICAgICAgY29uZjogbWV0ZW9yUnVudGltZUNvbmZpZyxcbiAgICB9KVxuICAgIDogdGVtcGxhdGUoJyAgPHNjcmlwdCB0eXBlPVwidGV4dC9qYXZhc2NyaXB0XCIgc3JjPVwiPCUtIHNyYyAlPi9tZXRlb3JfcnVudGltZV9jb25maWcuanNcIj48L3NjcmlwdD4nKSh7XG4gICAgICBzcmM6IHJvb3RVcmxQYXRoUHJlZml4LFxuICAgIH0pLFxuICAnJyxcblxuICAuLi4oanMgfHwgW10pLm1hcChmaWxlID0+XG4gICAgdGVtcGxhdGUoJyAgPHNjcmlwdCB0eXBlPVwidGV4dC9qYXZhc2NyaXB0XCIgc3JjPVwiPCUtIHNyYyAlPlwiPCU9IHNyaSAlPj48L3NjcmlwdD4nKSh7XG4gICAgICBzcmM6IGJ1bmRsZWRKc0Nzc1VybFJld3JpdGVIb29rKGZpbGUudXJsKSxcbiAgICAgIHNyaTogc3JpKGZpbGUuc3JpLCBzcmlNb2RlKSxcbiAgICB9KVxuICApLFxuXG4gIC4uLihhZGRpdGlvbmFsU3RhdGljSnMgfHwgW10pLm1hcCgoeyBjb250ZW50cywgcGF0aG5hbWUgfSkgPT4gKFxuICAgIGlubGluZVNjcmlwdHNBbGxvd2VkXG4gICAgICA/IHRlbXBsYXRlKCcgIDxzY3JpcHQ+PCU9IGNvbnRlbnRzICU+PC9zY3JpcHQ+Jykoe1xuICAgICAgICBjb250ZW50cyxcbiAgICAgIH0pXG4gICAgICA6IHRlbXBsYXRlKCcgIDxzY3JpcHQgdHlwZT1cInRleHQvamF2YXNjcmlwdFwiIHNyYz1cIjwlLSBzcmMgJT5cIj48L3NjcmlwdD4nKSh7XG4gICAgICAgIHNyYzogcm9vdFVybFBhdGhQcmVmaXggKyBwYXRobmFtZSxcbiAgICAgIH0pXG4gICkpLFxuXG4gICcnLFxuICAnJyxcbiAgJzwvYm9keT4nLFxuICAnPC9odG1sPidcbl0uam9pbignXFxuJyk7XG4iLCJpbXBvcnQgdGVtcGxhdGUgZnJvbSAnLi90ZW1wbGF0ZSc7XG5cbi8vIFRlbXBsYXRlIGZ1bmN0aW9uIGZvciByZW5kZXJpbmcgdGhlIGJvaWxlcnBsYXRlIGh0bWwgZm9yIGNvcmRvdmFcbmV4cG9ydCBjb25zdCBoZWFkVGVtcGxhdGUgPSAoe1xuICBtZXRlb3JSdW50aW1lQ29uZmlnLFxuICByb290VXJsUGF0aFByZWZpeCxcbiAgaW5saW5lU2NyaXB0c0FsbG93ZWQsXG4gIGNzcyxcbiAganMsXG4gIGFkZGl0aW9uYWxTdGF0aWNKcyxcbiAgaHRtbEF0dHJpYnV0ZXMsXG4gIGJ1bmRsZWRKc0Nzc1VybFJld3JpdGVIb29rLFxuICBoZWFkLFxuICBkeW5hbWljSGVhZCxcbn0pID0+IHtcbiAgdmFyIGhlYWRTZWN0aW9ucyA9IGhlYWQuc3BsaXQoLzxtZXRlb3ItYnVuZGxlZC1jc3NbXjw+XSo+LywgMik7XG4gIHZhciBjc3NCdW5kbGUgPSBbXG4gICAgLy8gV2UgYXJlIGV4cGxpY2l0bHkgbm90IHVzaW5nIGJ1bmRsZWRKc0Nzc1VybFJld3JpdGVIb29rOiBpbiBjb3Jkb3ZhIHdlIHNlcnZlIGFzc2V0cyB1cCBkaXJlY3RseSBmcm9tIGRpc2ssIHNvIHJld3JpdGluZyB0aGUgVVJMIGRvZXMgbm90IG1ha2Ugc2Vuc2VcbiAgICAuLi4oY3NzIHx8IFtdKS5tYXAoZmlsZSA9PlxuICAgICAgdGVtcGxhdGUoJyAgPGxpbmsgcmVsPVwic3R5bGVzaGVldFwiIHR5cGU9XCJ0ZXh0L2Nzc1wiIGNsYXNzPVwiX19tZXRlb3ItY3NzX19cIiBocmVmPVwiPCUtIGhyZWYgJT5cIj4nKSh7XG4gICAgICAgIGhyZWY6IGZpbGUudXJsLFxuICAgICAgfSlcbiAgKV0uam9pbignXFxuJyk7XG5cbiAgcmV0dXJuIFtcbiAgICAnPGh0bWw+JyxcbiAgICAnPGhlYWQ+JyxcbiAgICAnICA8bWV0YSBjaGFyc2V0PVwidXRmLThcIj4nLFxuICAgICcgIDxtZXRhIG5hbWU9XCJmb3JtYXQtZGV0ZWN0aW9uXCIgY29udGVudD1cInRlbGVwaG9uZT1ub1wiPicsXG4gICAgJyAgPG1ldGEgbmFtZT1cInZpZXdwb3J0XCIgY29udGVudD1cInVzZXItc2NhbGFibGU9bm8sIGluaXRpYWwtc2NhbGU9MSwgbWF4aW11bS1zY2FsZT0xLCBtaW5pbXVtLXNjYWxlPTEsIHdpZHRoPWRldmljZS13aWR0aCwgaGVpZ2h0PWRldmljZS1oZWlnaHQsIHZpZXdwb3J0LWZpdD1jb3ZlclwiPicsXG4gICAgJyAgPG1ldGEgbmFtZT1cIm1zYXBwbGljYXRpb24tdGFwLWhpZ2hsaWdodFwiIGNvbnRlbnQ9XCJub1wiPicsXG4gICAgJyAgPG1ldGEgaHR0cC1lcXVpdj1cIkNvbnRlbnQtU2VjdXJpdHktUG9saWN5XCIgY29udGVudD1cImRlZmF1bHQtc3JjICogZ2FwOiBkYXRhOiBibG9iOiBcXCd1bnNhZmUtaW5saW5lXFwnIFxcJ3Vuc2FmZS1ldmFsXFwnIHdzOiB3c3M6O1wiPicsXG5cbiAgKGhlYWRTZWN0aW9ucy5sZW5ndGggPT09IDEpXG4gICAgPyBbY3NzQnVuZGxlLCBoZWFkU2VjdGlvbnNbMF1dLmpvaW4oJ1xcbicpXG4gICAgOiBbaGVhZFNlY3Rpb25zWzBdLCBjc3NCdW5kbGUsIGhlYWRTZWN0aW9uc1sxXV0uam9pbignXFxuJyksXG5cbiAgICAnICA8c2NyaXB0IHR5cGU9XCJ0ZXh0L2phdmFzY3JpcHRcIj4nLFxuICAgIHRlbXBsYXRlKCcgICAgX19tZXRlb3JfcnVudGltZV9jb25maWdfXyA9IEpTT04ucGFyc2UoZGVjb2RlVVJJQ29tcG9uZW50KDwlPSBjb25mICU+KSk7Jykoe1xuICAgICAgY29uZjogbWV0ZW9yUnVudGltZUNvbmZpZyxcbiAgICB9KSxcbiAgICAnICAgIGlmICgvQW5kcm9pZC9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkpIHsnLFxuICAgIC8vIFdoZW4gQW5kcm9pZCBhcHAgaXMgZW11bGF0ZWQsIGl0IGNhbm5vdCBjb25uZWN0IHRvIGxvY2FsaG9zdCxcbiAgICAvLyBpbnN0ZWFkIGl0IHNob3VsZCBjb25uZWN0IHRvIDEwLjAuMi4yXG4gICAgLy8gKHVubGVzcyB3ZVxcJ3JlIHVzaW5nIGFuIGh0dHAgcHJveHk7IHRoZW4gaXQgd29ya3MhKVxuICAgICcgICAgICBpZiAoIV9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18uaHR0cFByb3h5UG9ydCkgeycsXG4gICAgJyAgICAgICAgX19tZXRlb3JfcnVudGltZV9jb25maWdfXy5ST09UX1VSTCA9IChfX21ldGVvcl9ydW50aW1lX2NvbmZpZ19fLlJPT1RfVVJMIHx8IFxcJ1xcJykucmVwbGFjZSgvbG9jYWxob3N0L2ksIFxcJzEwLjAuMi4yXFwnKTsnLFxuICAgICcgICAgICAgIF9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18uRERQX0RFRkFVTFRfQ09OTkVDVElPTl9VUkwgPSAoX19tZXRlb3JfcnVudGltZV9jb25maWdfXy5ERFBfREVGQVVMVF9DT05ORUNUSU9OX1VSTCB8fCBcXCdcXCcpLnJlcGxhY2UoL2xvY2FsaG9zdC9pLCBcXCcxMC4wLjIuMlxcJyk7JyxcbiAgICAnICAgICAgfScsXG4gICAgJyAgICB9JyxcbiAgICAnICA8L3NjcmlwdD4nLFxuICAgICcnLFxuICAgICcgIDxzY3JpcHQgdHlwZT1cInRleHQvamF2YXNjcmlwdFwiIHNyYz1cIi9jb3Jkb3ZhLmpzXCI+PC9zY3JpcHQ+JyxcblxuICAgIC4uLihqcyB8fCBbXSkubWFwKGZpbGUgPT5cbiAgICAgIHRlbXBsYXRlKCcgIDxzY3JpcHQgdHlwZT1cInRleHQvamF2YXNjcmlwdFwiIHNyYz1cIjwlLSBzcmMgJT5cIj48L3NjcmlwdD4nKSh7XG4gICAgICAgIHNyYzogZmlsZS51cmwsXG4gICAgICB9KVxuICAgICksXG5cbiAgICAuLi4oYWRkaXRpb25hbFN0YXRpY0pzIHx8IFtdKS5tYXAoKHsgY29udGVudHMsIHBhdGhuYW1lIH0pID0+IChcbiAgICAgIGlubGluZVNjcmlwdHNBbGxvd2VkXG4gICAgICAgID8gdGVtcGxhdGUoJyAgPHNjcmlwdD48JT0gY29udGVudHMgJT48L3NjcmlwdD4nKSh7XG4gICAgICAgICAgY29udGVudHMsXG4gICAgICAgIH0pXG4gICAgICAgIDogdGVtcGxhdGUoJyAgPHNjcmlwdCB0eXBlPVwidGV4dC9qYXZhc2NyaXB0XCIgc3JjPVwiPCUtIHNyYyAlPlwiPjwvc2NyaXB0PicpKHtcbiAgICAgICAgICBzcmM6IHJvb3RVcmxQYXRoUHJlZml4ICsgcGF0aG5hbWVcbiAgICAgICAgfSlcbiAgICApKSxcbiAgICAnJyxcbiAgICAnPC9oZWFkPicsXG4gICAgJycsXG4gICAgJzxib2R5PicsXG4gIF0uam9pbignXFxuJyk7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gY2xvc2VUZW1wbGF0ZSgpIHtcbiAgcmV0dXJuIFwiPC9ib2R5PlxcbjwvaHRtbD5cIjtcbn1cbiIsImltcG9ydCB7IF8gfSBmcm9tICdtZXRlb3IvdW5kZXJzY29yZSc7XG5cbi8vIEFzIGlkZW50aWZpZWQgaW4gaXNzdWUgIzkxNDksIHdoZW4gYW4gYXBwbGljYXRpb24gb3ZlcnJpZGVzIHRoZSBkZWZhdWx0XG4vLyBfLnRlbXBsYXRlIHNldHRpbmdzIHVzaW5nIF8udGVtcGxhdGVTZXR0aW5ncywgdGhvc2UgbmV3IHNldHRpbmdzIGFyZVxuLy8gdXNlZCBhbnl3aGVyZSBfLnRlbXBsYXRlIGlzIHVzZWQsIGluY2x1ZGluZyB3aXRoaW4gdGhlXG4vLyBib2lsZXJwbGF0ZS1nZW5lcmF0b3IuIFRvIGhhbmRsZSB0aGlzLCBfLnRlbXBsYXRlIHNldHRpbmdzIHRoYXQgaGF2ZVxuLy8gYmVlbiB2ZXJpZmllZCB0byB3b3JrIGFyZSBvdmVycmlkZGVuIGhlcmUgb24gZWFjaCBfLnRlbXBsYXRlIGNhbGwuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB0ZW1wbGF0ZSh0ZXh0KSB7XG4gIHJldHVybiBfLnRlbXBsYXRlKHRleHQsIG51bGwsIHtcbiAgICBldmFsdWF0ZSAgICA6IC88JShbXFxzXFxTXSs/KSU+L2csXG4gICAgaW50ZXJwb2xhdGUgOiAvPCU9KFtcXHNcXFNdKz8pJT4vZyxcbiAgICBlc2NhcGUgICAgICA6IC88JS0oW1xcc1xcU10rPyklPi9nLFxuICB9KTtcbn07XG4iXX0=
