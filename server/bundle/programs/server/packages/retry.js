(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var Random = Package.random.Random;
var meteorInstall = Package.modules.meteorInstall;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var Retry;

var require = meteorInstall({"node_modules":{"meteor":{"retry":{"retry.js":function module(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////
//                                                                              //
// packages/retry/retry.js                                                      //
//                                                                              //
//////////////////////////////////////////////////////////////////////////////////
                                                                                //
module.export({
  Retry: () => Retry
});

class Retry {
  constructor() {
    let {
      baseTimeout = 1000,
      exponent = 2.2,
      // The default is high-ish to ensure a server can recover from a
      // failure caused by load.
      maxTimeout = 5 * 60 * 1000,
      minTimeout = 10,
      minCount = 2,
      fuzz = 0.5
    } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    this.baseTimeout = baseTimeout;
    this.exponent = exponent;
    this.maxTimeout = maxTimeout;
    this.minTimeout = minTimeout;
    this.minCount = minCount;
    this.fuzz = fuzz;
    this.retryTimer = null;
  } // Reset a pending retry, if any.


  clear() {
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
    }

    this.retryTimer = null;
  } // Calculate how long to wait in milliseconds to retry, based on the
  // `count` of which retry this is.


  _timeout(count) {
    if (count < this.minCount) {
      return this.minTimeout;
    } // fuzz the timeout randomly, to avoid reconnect storms when a
    // server goes down.


    var timeout = Math.min(this.maxTimeout, this.baseTimeout * Math.pow(this.exponent, count)) * (Random.fraction() * this.fuzz + (1 - this.fuzz / 2));
    return timeout;
  } // Call `fn` after a delay, based on the `count` of which retry this is.


  retryLater(count, fn) {
    var timeout = this._timeout(count);

    if (this.retryTimer) clearTimeout(this.retryTimer);
    this.retryTimer = Meteor.setTimeout(fn, timeout);
    return timeout;
  }

}
//////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

var exports = require("/node_modules/meteor/retry/retry.js");

/* Exports */
Package._define("retry", exports, {
  Retry: Retry
});

})();

//# sourceURL=meteor://💻app/packages/retry.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvcmV0cnkvcmV0cnkuanMiXSwibmFtZXMiOlsibW9kdWxlIiwiZXhwb3J0IiwiUmV0cnkiLCJjb25zdHJ1Y3RvciIsImJhc2VUaW1lb3V0IiwiZXhwb25lbnQiLCJtYXhUaW1lb3V0IiwibWluVGltZW91dCIsIm1pbkNvdW50IiwiZnV6eiIsInJldHJ5VGltZXIiLCJjbGVhciIsImNsZWFyVGltZW91dCIsIl90aW1lb3V0IiwiY291bnQiLCJ0aW1lb3V0IiwiTWF0aCIsIm1pbiIsInBvdyIsIlJhbmRvbSIsImZyYWN0aW9uIiwicmV0cnlMYXRlciIsImZuIiwiTWV0ZW9yIiwic2V0VGltZW91dCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBQSxNQUFNLENBQUNDLE1BQVAsQ0FBYztBQUFDQyxPQUFLLEVBQUMsTUFBSUE7QUFBWCxDQUFkOztBQVVPLE1BQU1BLEtBQU4sQ0FBWTtBQUNqQkMsYUFBVyxHQVNIO0FBQUEsUUFUSTtBQUNWQyxpQkFBVyxHQUFHLElBREo7QUFFVkMsY0FBUSxHQUFHLEdBRkQ7QUFHVjtBQUNBO0FBQ0FDLGdCQUFVLEdBQUcsSUFBSSxFQUFKLEdBQVMsSUFMWjtBQU1WQyxnQkFBVSxHQUFHLEVBTkg7QUFPVkMsY0FBUSxHQUFHLENBUEQ7QUFRVkMsVUFBSSxHQUFHO0FBUkcsS0FTSix1RUFBSixFQUFJO0FBQ04sU0FBS0wsV0FBTCxHQUFtQkEsV0FBbkI7QUFDQSxTQUFLQyxRQUFMLEdBQWdCQSxRQUFoQjtBQUNBLFNBQUtDLFVBQUwsR0FBa0JBLFVBQWxCO0FBQ0EsU0FBS0MsVUFBTCxHQUFrQkEsVUFBbEI7QUFDQSxTQUFLQyxRQUFMLEdBQWdCQSxRQUFoQjtBQUNBLFNBQUtDLElBQUwsR0FBWUEsSUFBWjtBQUNBLFNBQUtDLFVBQUwsR0FBa0IsSUFBbEI7QUFDRCxHQWxCZ0IsQ0FvQmpCOzs7QUFDQUMsT0FBSyxHQUFHO0FBQ04sUUFBSSxLQUFLRCxVQUFULEVBQXFCO0FBQ25CRSxrQkFBWSxDQUFDLEtBQUtGLFVBQU4sQ0FBWjtBQUNEOztBQUNELFNBQUtBLFVBQUwsR0FBa0IsSUFBbEI7QUFDRCxHQTFCZ0IsQ0E0QmpCO0FBQ0E7OztBQUNBRyxVQUFRLENBQUNDLEtBQUQsRUFBUTtBQUNkLFFBQUlBLEtBQUssR0FBRyxLQUFLTixRQUFqQixFQUEyQjtBQUN6QixhQUFPLEtBQUtELFVBQVo7QUFDRCxLQUhhLENBS2Q7QUFDQTs7O0FBQ0EsUUFBSVEsT0FBTyxHQUFHQyxJQUFJLENBQUNDLEdBQUwsQ0FDWixLQUFLWCxVQURPLEVBRVosS0FBS0YsV0FBTCxHQUFtQlksSUFBSSxDQUFDRSxHQUFMLENBQVMsS0FBS2IsUUFBZCxFQUF3QlMsS0FBeEIsQ0FGUCxLQUlaSyxNQUFNLENBQUNDLFFBQVAsS0FBb0IsS0FBS1gsSUFBekIsSUFBaUMsSUFBSSxLQUFLQSxJQUFMLEdBQVksQ0FBakQsQ0FKWSxDQUFkO0FBT0EsV0FBT00sT0FBUDtBQUNELEdBN0NnQixDQStDakI7OztBQUNBTSxZQUFVLENBQUNQLEtBQUQsRUFBUVEsRUFBUixFQUFZO0FBQ3BCLFFBQUlQLE9BQU8sR0FBRyxLQUFLRixRQUFMLENBQWNDLEtBQWQsQ0FBZDs7QUFDQSxRQUFJLEtBQUtKLFVBQVQsRUFDRUUsWUFBWSxDQUFDLEtBQUtGLFVBQU4sQ0FBWjtBQUNGLFNBQUtBLFVBQUwsR0FBa0JhLE1BQU0sQ0FBQ0MsVUFBUCxDQUFrQkYsRUFBbEIsRUFBc0JQLE9BQXRCLENBQWxCO0FBQ0EsV0FBT0EsT0FBUDtBQUNEOztBQXREZ0IsQyIsImZpbGUiOiIvcGFja2FnZXMvcmV0cnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBSZXRyeSBsb2dpYyB3aXRoIGFuIGV4cG9uZW50aWFsIGJhY2tvZmYuXG4vL1xuLy8gb3B0aW9uczpcbi8vICBiYXNlVGltZW91dDogdGltZSBmb3IgaW5pdGlhbCByZWNvbm5lY3QgYXR0ZW1wdCAobXMpLlxuLy8gIGV4cG9uZW50OiBleHBvbmVudGlhbCBmYWN0b3IgdG8gaW5jcmVhc2UgdGltZW91dCBlYWNoIGF0dGVtcHQuXG4vLyAgbWF4VGltZW91dDogbWF4aW11bSB0aW1lIGJldHdlZW4gcmV0cmllcyAobXMpLlxuLy8gIG1pbkNvdW50OiBob3cgbWFueSB0aW1lcyB0byByZWNvbm5lY3QgXCJpbnN0YW50bHlcIi5cbi8vICBtaW5UaW1lb3V0OiB0aW1lIHRvIHdhaXQgZm9yIHRoZSBmaXJzdCBgbWluQ291bnRgIHJldHJpZXMgKG1zKS5cbi8vICBmdXp6OiBmYWN0b3IgdG8gcmFuZG9taXplIHJldHJ5IHRpbWVzIGJ5ICh0byBhdm9pZCByZXRyeSBzdG9ybXMpLlxuXG5leHBvcnQgY2xhc3MgUmV0cnkge1xuICBjb25zdHJ1Y3Rvcih7XG4gICAgYmFzZVRpbWVvdXQgPSAxMDAwLFxuICAgIGV4cG9uZW50ID0gMi4yLFxuICAgIC8vIFRoZSBkZWZhdWx0IGlzIGhpZ2gtaXNoIHRvIGVuc3VyZSBhIHNlcnZlciBjYW4gcmVjb3ZlciBmcm9tIGFcbiAgICAvLyBmYWlsdXJlIGNhdXNlZCBieSBsb2FkLlxuICAgIG1heFRpbWVvdXQgPSA1ICogNjAgKiAxMDAwLFxuICAgIG1pblRpbWVvdXQgPSAxMCxcbiAgICBtaW5Db3VudCA9IDIsXG4gICAgZnV6eiA9IDAuNSxcbiAgfSA9IHt9KSB7XG4gICAgdGhpcy5iYXNlVGltZW91dCA9IGJhc2VUaW1lb3V0O1xuICAgIHRoaXMuZXhwb25lbnQgPSBleHBvbmVudDtcbiAgICB0aGlzLm1heFRpbWVvdXQgPSBtYXhUaW1lb3V0O1xuICAgIHRoaXMubWluVGltZW91dCA9IG1pblRpbWVvdXQ7XG4gICAgdGhpcy5taW5Db3VudCA9IG1pbkNvdW50O1xuICAgIHRoaXMuZnV6eiA9IGZ1eno7XG4gICAgdGhpcy5yZXRyeVRpbWVyID0gbnVsbDtcbiAgfVxuXG4gIC8vIFJlc2V0IGEgcGVuZGluZyByZXRyeSwgaWYgYW55LlxuICBjbGVhcigpIHtcbiAgICBpZiAodGhpcy5yZXRyeVRpbWVyKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5yZXRyeVRpbWVyKTtcbiAgICB9XG4gICAgdGhpcy5yZXRyeVRpbWVyID0gbnVsbDtcbiAgfVxuXG4gIC8vIENhbGN1bGF0ZSBob3cgbG9uZyB0byB3YWl0IGluIG1pbGxpc2Vjb25kcyB0byByZXRyeSwgYmFzZWQgb24gdGhlXG4gIC8vIGBjb3VudGAgb2Ygd2hpY2ggcmV0cnkgdGhpcyBpcy5cbiAgX3RpbWVvdXQoY291bnQpIHtcbiAgICBpZiAoY291bnQgPCB0aGlzLm1pbkNvdW50KSB7XG4gICAgICByZXR1cm4gdGhpcy5taW5UaW1lb3V0O1xuICAgIH1cblxuICAgIC8vIGZ1enogdGhlIHRpbWVvdXQgcmFuZG9tbHksIHRvIGF2b2lkIHJlY29ubmVjdCBzdG9ybXMgd2hlbiBhXG4gICAgLy8gc2VydmVyIGdvZXMgZG93bi5cbiAgICB2YXIgdGltZW91dCA9IE1hdGgubWluKFxuICAgICAgdGhpcy5tYXhUaW1lb3V0LFxuICAgICAgdGhpcy5iYXNlVGltZW91dCAqIE1hdGgucG93KHRoaXMuZXhwb25lbnQsIGNvdW50KVxuICAgICkgKiAoXG4gICAgICBSYW5kb20uZnJhY3Rpb24oKSAqIHRoaXMuZnV6eiArICgxIC0gdGhpcy5mdXp6IC8gMilcbiAgICApO1xuXG4gICAgcmV0dXJuIHRpbWVvdXQ7XG4gIH1cblxuICAvLyBDYWxsIGBmbmAgYWZ0ZXIgYSBkZWxheSwgYmFzZWQgb24gdGhlIGBjb3VudGAgb2Ygd2hpY2ggcmV0cnkgdGhpcyBpcy5cbiAgcmV0cnlMYXRlcihjb3VudCwgZm4pIHtcbiAgICB2YXIgdGltZW91dCA9IHRoaXMuX3RpbWVvdXQoY291bnQpO1xuICAgIGlmICh0aGlzLnJldHJ5VGltZXIpXG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5yZXRyeVRpbWVyKTtcbiAgICB0aGlzLnJldHJ5VGltZXIgPSBNZXRlb3Iuc2V0VGltZW91dChmbiwgdGltZW91dCk7XG4gICAgcmV0dXJuIHRpbWVvdXQ7XG4gIH1cbn1cbiJdfQ==
