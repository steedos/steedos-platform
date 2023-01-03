(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var _ = Package.underscore._;
var ECMAScript = Package.ecmascript.ECMAScript;
var meteorInstall = Package.modules.meteorInstall;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var RoutePolicy;

var require = meteorInstall({"node_modules":{"meteor":{"routepolicy":{"main.js":function module(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// packages/routepolicy/main.js                                                                         //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
module.export({
  RoutePolicy: () => RoutePolicy
});
let RoutePolicyConstructor;
module.link("./routepolicy", {
  default(v) {
    RoutePolicyConstructor = v;
  }

}, 0);
const RoutePolicy = new RoutePolicyConstructor();
//////////////////////////////////////////////////////////////////////////////////////////////////////////

},"routepolicy.js":function module(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// packages/routepolicy/routepolicy.js                                                                  //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
module.export({
  default: () => RoutePolicy
});

class RoutePolicy {
  constructor() {
    // maps prefix to a type
    this.urlPrefixTypes = {};
  }

  urlPrefixMatches(urlPrefix, url) {
    return url.startsWith(urlPrefix);
  }

  checkType(type) {
    if (!['network', 'static-online'].includes(type)) {
      return 'the route type must be "network" or "static-online"';
    }

    return null;
  }

  checkUrlPrefix(urlPrefix, type) {
    if (!urlPrefix.startsWith('/')) {
      return 'a route URL prefix must begin with a slash';
    }

    if (urlPrefix === '/') {
      return 'a route URL prefix cannot be /';
    }

    const existingType = this.urlPrefixTypes[urlPrefix];

    if (existingType && existingType !== type) {
      return "the route URL prefix ".concat(urlPrefix, " has already been declared ") + "to be of type ".concat(existingType);
    }

    return null;
  }

  checkForConflictWithStatic(urlPrefix, type, _testManifest) {
    if (type === 'static-online') {
      return null;
    }

    const policy = this;

    function check(manifest) {
      const conflict = manifest.find(resource => resource.type === 'static' && resource.where === 'client' && policy.urlPrefixMatches(urlPrefix, resource.url));

      if (conflict) {
        return "static resource ".concat(conflict.url, " conflicts with ").concat(type, " ") + "route ".concat(urlPrefix);
      }

      return null;
    }

    ;

    if (_testManifest) {
      return check(_testManifest);
    }

    const {
      WebApp
    } = require("meteor/webapp");

    let errorMessage = null;
    Object.keys(WebApp.clientPrograms).some(arch => {
      const {
        manifest
      } = WebApp.clientPrograms[arch];
      return errorMessage = check(manifest);
    });
    return errorMessage;
  }

  declare(urlPrefix, type) {
    const problem = this.checkType(type) || this.checkUrlPrefix(urlPrefix, type) || this.checkForConflictWithStatic(urlPrefix, type);

    if (problem) {
      throw new Error(problem);
    } // TODO overlapping prefixes, e.g. /foo/ and /foo/bar/


    this.urlPrefixTypes[urlPrefix] = type;
  }

  isValidUrl(url) {
    return url.startsWith('/');
  }

  classify(url) {
    if (!this.isValidUrl(url)) {
      throw new Error("url must be a relative URL: ".concat(url));
    }

    const prefix = Object.keys(this.urlPrefixTypes).find(prefix => this.urlPrefixMatches(prefix, url));
    return prefix ? this.urlPrefixTypes[prefix] : null;
  }

  urlPrefixesFor(type) {
    return Object.entries(this.urlPrefixTypes).filter((_ref) => {
      let [_prefix, _type] = _ref;
      return _type === type;
    }).map((_ref2) => {
      let [_prefix] = _ref2;
      return _prefix;
    }).sort();
  }

}
//////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

var exports = require("/node_modules/meteor/routepolicy/main.js");

/* Exports */
Package._define("routepolicy", exports, {
  RoutePolicy: RoutePolicy
});

})();

//# sourceURL=meteor://💻app/packages/routepolicy.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvcm91dGVwb2xpY3kvbWFpbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvcm91dGVwb2xpY3kvcm91dGVwb2xpY3kuanMiXSwibmFtZXMiOlsibW9kdWxlIiwiZXhwb3J0IiwiUm91dGVQb2xpY3kiLCJSb3V0ZVBvbGljeUNvbnN0cnVjdG9yIiwibGluayIsImRlZmF1bHQiLCJ2IiwiY29uc3RydWN0b3IiLCJ1cmxQcmVmaXhUeXBlcyIsInVybFByZWZpeE1hdGNoZXMiLCJ1cmxQcmVmaXgiLCJ1cmwiLCJzdGFydHNXaXRoIiwiY2hlY2tUeXBlIiwidHlwZSIsImluY2x1ZGVzIiwiY2hlY2tVcmxQcmVmaXgiLCJleGlzdGluZ1R5cGUiLCJjaGVja0ZvckNvbmZsaWN0V2l0aFN0YXRpYyIsIl90ZXN0TWFuaWZlc3QiLCJwb2xpY3kiLCJjaGVjayIsIm1hbmlmZXN0IiwiY29uZmxpY3QiLCJmaW5kIiwicmVzb3VyY2UiLCJ3aGVyZSIsIldlYkFwcCIsInJlcXVpcmUiLCJlcnJvck1lc3NhZ2UiLCJPYmplY3QiLCJrZXlzIiwiY2xpZW50UHJvZ3JhbXMiLCJzb21lIiwiYXJjaCIsImRlY2xhcmUiLCJwcm9ibGVtIiwiRXJyb3IiLCJpc1ZhbGlkVXJsIiwiY2xhc3NpZnkiLCJwcmVmaXgiLCJ1cmxQcmVmaXhlc0ZvciIsImVudHJpZXMiLCJmaWx0ZXIiLCJfcHJlZml4IiwiX3R5cGUiLCJtYXAiLCJzb3J0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUFBLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjO0FBQUNDLGFBQVcsRUFBQyxNQUFJQTtBQUFqQixDQUFkO0FBQTZDLElBQUlDLHNCQUFKO0FBQTJCSCxNQUFNLENBQUNJLElBQVAsQ0FBWSxlQUFaLEVBQTRCO0FBQUNDLFNBQU8sQ0FBQ0MsQ0FBRCxFQUFHO0FBQUNILDBCQUFzQixHQUFDRyxDQUF2QjtBQUF5Qjs7QUFBckMsQ0FBNUIs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c0IsT0FBSixFQUFhO0FBQ1gsWUFBTSxJQUFJQyxLQUFKLENBQVVELE9BQVYsQ0FBTjtBQUNELEtBUHNCLENBUXZCOzs7QUFDQSxTQUFLNUIsY0FBTCxDQUFvQkUsU0FBcEIsSUFBaUNJLElBQWpDO0FBQ0Q7O0FBRUR3QixZQUFVLENBQUMzQixHQUFELEVBQU07QUFDZCxXQUFPQSxHQUFHLENBQUNDLFVBQUosQ0FBZSxHQUFmLENBQVA7QUFDRDs7QUFFRDJCLFVBQVEsQ0FBQzVCLEdBQUQsRUFBTTtBQUNaLFFBQUksQ0FBQyxLQUFLMkIsVUFBTCxDQUFnQjNCLEdBQWhCLENBQUwsRUFBMkI7QUFDekIsWUFBTSxJQUFJMEIsS0FBSix1Q0FBeUMxQixHQUF6QyxFQUFOO0FBQ0Q7O0FBRUQsVUFBTTZCLE1BQU0sR0FBR1YsTUFBTSxDQUFDQyxJQUFQLENBQVksS0FBS3ZCLGNBQWpCLEVBQWlDZ0IsSUFBakMsQ0FBc0NnQixNQUFNLElBQ3pELEtBQUsvQixnQkFBTCxDQUFzQitCLE1BQXRCLEVBQThCN0IsR0FBOUIsQ0FEYSxDQUFmO0FBSUEsV0FBTzZCLE1BQU0sR0FBRyxLQUFLaEMsY0FBTCxDQUFvQmdDLE1BQXBCLENBQUgsR0FBaUMsSUFBOUM7QUFDRDs7QUFFREMsZ0JBQWMsQ0FBQzNCLElBQUQsRUFBTztBQUNuQixXQUFPZ0IsTUFBTSxDQUFDWSxPQUFQLENBQWUsS0FBS2xDLGNBQXBCLEVBQ0ptQyxNQURJLENBQ0c7QUFBQSxVQUFDLENBQUNDLE9BQUQsRUFBVUMsS0FBVixDQUFEO0FBQUEsYUFBc0JBLEtBQUssS0FBSy9CLElBQWhDO0FBQUEsS0FESCxFQUVKZ0MsR0FGSSxDQUVBO0FBQUEsVUFBQyxDQUFDRixPQUFELENBQUQ7QUFBQSxhQUFlQSxPQUFmO0FBQUEsS0FGQSxFQUdKRyxJQUhJLEVBQVA7QUFJRDs7QUF6RzhCLEMiLCJmaWxlIjoiL3BhY2thZ2VzL3JvdXRlcG9saWN5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZGVmYXVsdCBhcyBSb3V0ZVBvbGljeUNvbnN0cnVjdG9yIH0gZnJvbSAnLi9yb3V0ZXBvbGljeSc7XG5leHBvcnQgY29uc3QgUm91dGVQb2xpY3kgPSBuZXcgUm91dGVQb2xpY3lDb25zdHJ1Y3RvcigpO1xuIiwiLy8gSW4gYWRkaXRpb24gdG8gbGlzdGluZyBzcGVjaWZpYyBmaWxlcyB0byBiZSBjYWNoZWQsIHRoZSBicm93c2VyXG4vLyBhcHBsaWNhdGlvbiBjYWNoZSBtYW5pZmVzdCBhbGxvd3MgVVJMcyB0byBiZSBkZXNpZ25hdGVkIGFzIE5FVFdPUktcbi8vIChhbHdheXMgZmV0Y2hlZCBmcm9tIHRoZSBJbnRlcm5ldCkgYW5kIEZBTExCQUNLICh3aGljaCB3ZSB1c2UgdG9cbi8vIHNlcnZlIGFwcCBIVE1MIG9uIGFyYml0cmFyeSBVUkxzKS5cbi8vXG4vLyBUaGUgbGltaXRhdGlvbiBvZiB0aGUgbWFuaWZlc3QgZmlsZSBmb3JtYXQgaXMgdGhhdCB0aGUgZGVzaWduYXRpb25zXG4vLyBhcmUgYnkgcHJlZml4IG9ubHk6IGlmIFwiL2Zvb1wiIGlzIGRlY2xhcmVkIE5FVFdPUksgdGhlbiBcIi9mb29iYXJcIlxuLy8gd2lsbCBhbHNvIGJlIHRyZWF0ZWQgYXMgYSBuZXR3b3JrIHJvdXRlLlxuLy9cbi8vIFJvdXRlUG9saWN5IGlzIGEgbG93LWxldmVsIEFQSSBmb3IgZGVjbGFyaW5nIHRoZSByb3V0ZSB0eXBlIG9mIFVSTCBwcmVmaXhlczpcbi8vXG4vLyBcIm5ldHdvcmtcIjogZm9yIG5ldHdvcmsgcm91dGVzIHRoYXQgc2hvdWxkIG5vdCBjb25mbGljdCB3aXRoIHN0YXRpY1xuLy8gcmVzb3VyY2VzLiAgKEZvciBleGFtcGxlLCBpZiBcIi9zb2NranMvXCIgaXMgYSBuZXR3b3JrIHJvdXRlLCB3ZVxuLy8gc2hvdWxkbid0IGhhdmUgXCIvc29ja2pzL3JlZC1zb2NrLmpwZ1wiIGFzIGEgc3RhdGljIHJlc291cmNlKS5cbi8vXG4vLyBcInN0YXRpYy1vbmxpbmVcIjogZm9yIHN0YXRpYyByZXNvdXJjZXMgd2hpY2ggc2hvdWxkIG5vdCBiZSBjYWNoZWQgaW5cbi8vIHRoZSBhcHAgY2FjaGUuICBUaGlzIGlzIGltcGxlbWVudGVkIGJ5IGFsc28gYWRkaW5nIHRoZW0gdG8gdGhlXG4vLyBORVRXT1JLIHNlY3Rpb24gKGFzIG90aGVyd2lzZSB0aGUgYnJvd3NlciB3b3VsZCByZWNlaXZlIGFwcCBIVE1MXG4vLyBmb3IgdGhlbSBiZWNhdXNlIG9mIHRoZSBGQUxMQkFDSyBzZWN0aW9uKSwgYnV0IHN0YXRpYy1vbmxpbmUgcm91dGVzXG4vLyBkb24ndCBuZWVkIHRvIGJlIGNoZWNrZWQgZm9yIGNvbmZsaWN0IHdpdGggc3RhdGljIHJlc291cmNlcy5cblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSb3V0ZVBvbGljeSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIC8vIG1hcHMgcHJlZml4IHRvIGEgdHlwZVxuICAgIHRoaXMudXJsUHJlZml4VHlwZXMgPSB7fTtcbiAgfVxuXG4gIHVybFByZWZpeE1hdGNoZXModXJsUHJlZml4LCB1cmwpIHtcbiAgICByZXR1cm4gdXJsLnN0YXJ0c1dpdGgodXJsUHJlZml4KTtcbiAgfVxuXG4gIGNoZWNrVHlwZSh0eXBlKSB7XG4gICAgaWYgKCFbJ25ldHdvcmsnLCAnc3RhdGljLW9ubGluZSddLmluY2x1ZGVzKHR5cGUpKSB7XG4gICAgICByZXR1cm4gJ3RoZSByb3V0ZSB0eXBlIG11c3QgYmUgXCJuZXR3b3JrXCIgb3IgXCJzdGF0aWMtb25saW5lXCInO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGNoZWNrVXJsUHJlZml4KHVybFByZWZpeCwgdHlwZSkge1xuICAgIGlmICghdXJsUHJlZml4LnN0YXJ0c1dpdGgoJy8nKSkge1xuICAgICAgcmV0dXJuICdhIHJvdXRlIFVSTCBwcmVmaXggbXVzdCBiZWdpbiB3aXRoIGEgc2xhc2gnO1xuICAgIH1cblxuICAgIGlmICh1cmxQcmVmaXggPT09ICcvJykge1xuICAgICAgcmV0dXJuICdhIHJvdXRlIFVSTCBwcmVmaXggY2Fubm90IGJlIC8nO1xuICAgIH1cblxuICAgIGNvbnN0IGV4aXN0aW5nVHlwZSA9IHRoaXMudXJsUHJlZml4VHlwZXNbdXJsUHJlZml4XTtcbiAgICBpZiAoZXhpc3RpbmdUeXBlICYmIGV4aXN0aW5nVHlwZSAhPT0gdHlwZSkge1xuICAgICAgcmV0dXJuIGB0aGUgcm91dGUgVVJMIHByZWZpeCAke3VybFByZWZpeH0gaGFzIGFscmVhZHkgYmVlbiBkZWNsYXJlZCBgICtcbiAgICAgICAgYHRvIGJlIG9mIHR5cGUgJHtleGlzdGluZ1R5cGV9YDtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGNoZWNrRm9yQ29uZmxpY3RXaXRoU3RhdGljKHVybFByZWZpeCwgdHlwZSwgX3Rlc3RNYW5pZmVzdCkge1xuICAgIGlmICh0eXBlID09PSAnc3RhdGljLW9ubGluZScpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHBvbGljeSA9IHRoaXM7XG5cbiAgICBmdW5jdGlvbiBjaGVjayhtYW5pZmVzdCkge1xuICAgICAgY29uc3QgY29uZmxpY3QgPSBtYW5pZmVzdC5maW5kKHJlc291cmNlID0+IChcbiAgICAgICAgcmVzb3VyY2UudHlwZSA9PT0gJ3N0YXRpYycgJiZcbiAgICAgICAgcmVzb3VyY2Uud2hlcmUgPT09ICdjbGllbnQnICYmXG4gICAgICAgIHBvbGljeS51cmxQcmVmaXhNYXRjaGVzKHVybFByZWZpeCwgcmVzb3VyY2UudXJsKVxuICAgICAgKSk7XG5cbiAgICAgIGlmIChjb25mbGljdCkge1xuICAgICAgICByZXR1cm4gYHN0YXRpYyByZXNvdXJjZSAke2NvbmZsaWN0LnVybH0gY29uZmxpY3RzIHdpdGggJHt0eXBlfSBgICtcbiAgICAgICAgICBgcm91dGUgJHt1cmxQcmVmaXh9YDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfTtcblxuICAgIGlmIChfdGVzdE1hbmlmZXN0KSB7XG4gICAgICByZXR1cm4gY2hlY2soX3Rlc3RNYW5pZmVzdCk7XG4gICAgfVxuXG4gICAgY29uc3QgeyBXZWJBcHAgfSA9IHJlcXVpcmUoXCJtZXRlb3Ivd2ViYXBwXCIpO1xuICAgIGxldCBlcnJvck1lc3NhZ2UgPSBudWxsO1xuXG4gICAgT2JqZWN0LmtleXMoV2ViQXBwLmNsaWVudFByb2dyYW1zKS5zb21lKGFyY2ggPT4ge1xuICAgICAgY29uc3QgeyBtYW5pZmVzdCB9ID0gV2ViQXBwLmNsaWVudFByb2dyYW1zW2FyY2hdO1xuICAgICAgcmV0dXJuIGVycm9yTWVzc2FnZSA9IGNoZWNrKG1hbmlmZXN0KTtcbiAgICB9KTtcblxuICAgIHJldHVybiBlcnJvck1lc3NhZ2U7XG4gIH1cblxuICBkZWNsYXJlKHVybFByZWZpeCwgdHlwZSkge1xuICAgIGNvbnN0IHByb2JsZW0gPVxuICAgICAgdGhpcy5jaGVja1R5cGUodHlwZSkgfHxcbiAgICAgIHRoaXMuY2hlY2tVcmxQcmVmaXgodXJsUHJlZml4LCB0eXBlKSB8fFxuICAgICAgdGhpcy5jaGVja0ZvckNvbmZsaWN0V2l0aFN0YXRpYyh1cmxQcmVmaXgsIHR5cGUpO1xuICAgIGlmIChwcm9ibGVtKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IocHJvYmxlbSk7XG4gICAgfVxuICAgIC8vIFRPRE8gb3ZlcmxhcHBpbmcgcHJlZml4ZXMsIGUuZy4gL2Zvby8gYW5kIC9mb28vYmFyL1xuICAgIHRoaXMudXJsUHJlZml4VHlwZXNbdXJsUHJlZml4XSA9IHR5cGU7XG4gIH1cblxuICBpc1ZhbGlkVXJsKHVybCkge1xuICAgIHJldHVybiB1cmwuc3RhcnRzV2l0aCgnLycpO1xuICB9XG5cbiAgY2xhc3NpZnkodXJsKSB7XG4gICAgaWYgKCF0aGlzLmlzVmFsaWRVcmwodXJsKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGB1cmwgbXVzdCBiZSBhIHJlbGF0aXZlIFVSTDogJHt1cmx9YCk7XG4gICAgfVxuXG4gICAgY29uc3QgcHJlZml4ID0gT2JqZWN0LmtleXModGhpcy51cmxQcmVmaXhUeXBlcykuZmluZChwcmVmaXggPT5cbiAgICAgIHRoaXMudXJsUHJlZml4TWF0Y2hlcyhwcmVmaXgsIHVybClcbiAgICApO1xuXG4gICAgcmV0dXJuIHByZWZpeCA/IHRoaXMudXJsUHJlZml4VHlwZXNbcHJlZml4XSA6IG51bGw7XG4gIH1cblxuICB1cmxQcmVmaXhlc0Zvcih0eXBlKSB7XG4gICAgcmV0dXJuIE9iamVjdC5lbnRyaWVzKHRoaXMudXJsUHJlZml4VHlwZXMpXG4gICAgICAuZmlsdGVyKChbX3ByZWZpeCwgX3R5cGVdKSA9PiBfdHlwZSA9PT0gdHlwZSlcbiAgICAgIC5tYXAoKFtfcHJlZml4XSkgPT4gX3ByZWZpeClcbiAgICAgIC5zb3J0KCk7XG4gIH1cbn1cbiJdfQ==
