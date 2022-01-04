(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var EJSON = Package.ejson.EJSON;
var meteorInstall = Package.modules.meteorInstall;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var IdMap;

var require = meteorInstall({"node_modules":{"meteor":{"id-map":{"id-map.js":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                        //
// packages/id-map/id-map.js                                                              //
//                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////
                                                                                          //
module.export({
  IdMap: () => IdMap
});
const hasOwn = Object.prototype.hasOwnProperty;

class IdMap {
  constructor(idStringify, idParse) {
    this.clear();
    this._idStringify = idStringify || JSON.stringify;
    this._idParse = idParse || JSON.parse;
  } // Some of these methods are designed to match methods on OrderedDict, since
  // (eg) ObserveMultiplex and _CachingChangeObserver use them interchangeably.
  // (Conceivably, this should be replaced with "UnorderedDict" with a specific
  // set of methods that overlap between the two.)


  get(id) {
    var key = this._idStringify(id);

    return this._map[key];
  }

  set(id, value) {
    var key = this._idStringify(id);

    this._map[key] = value;
  }

  remove(id) {
    var key = this._idStringify(id);

    delete this._map[key];
  }

  has(id) {
    var key = this._idStringify(id);

    return hasOwn.call(this._map, key);
  }

  empty() {
    for (let key in this._map) {
      return false;
    }

    return true;
  }

  clear() {
    this._map = Object.create(null);
  } // Iterates over the items in the map. Return `false` to break the loop.


  forEach(iterator) {
    // don't use _.each, because we can't break out of it.
    var keys = Object.keys(this._map);

    for (var i = 0; i < keys.length; i++) {
      var breakIfFalse = iterator.call(null, this._map[keys[i]], this._idParse(keys[i]));

      if (breakIfFalse === false) {
        return;
      }
    }
  }

  size() {
    return Object.keys(this._map).length;
  }

  setDefault(id, def) {
    var key = this._idStringify(id);

    if (hasOwn.call(this._map, key)) {
      return this._map[key];
    }

    this._map[key] = def;
    return def;
  } // Assumes that values are EJSON-cloneable, and that we don't need to clone
  // IDs (ie, that nobody is going to mutate an ObjectId).


  clone() {
    var clone = new IdMap(this._idStringify, this._idParse);
    this.forEach(function (value, id) {
      clone.set(id, EJSON.clone(value));
    });
    return clone;
  }

}
////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

var exports = require("/node_modules/meteor/id-map/id-map.js");

/* Exports */
Package._define("id-map", exports, {
  IdMap: IdMap
});

})();

//# sourceURL=meteor://💻app/packages/id-map.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvaWQtbWFwL2lkLW1hcC5qcyJdLCJuYW1lcyI6WyJtb2R1bGUiLCJleHBvcnQiLCJJZE1hcCIsImhhc093biIsIk9iamVjdCIsInByb3RvdHlwZSIsImhhc093blByb3BlcnR5IiwiY29uc3RydWN0b3IiLCJpZFN0cmluZ2lmeSIsImlkUGFyc2UiLCJjbGVhciIsIl9pZFN0cmluZ2lmeSIsIkpTT04iLCJzdHJpbmdpZnkiLCJfaWRQYXJzZSIsInBhcnNlIiwiZ2V0IiwiaWQiLCJrZXkiLCJfbWFwIiwic2V0IiwidmFsdWUiLCJyZW1vdmUiLCJoYXMiLCJjYWxsIiwiZW1wdHkiLCJjcmVhdGUiLCJmb3JFYWNoIiwiaXRlcmF0b3IiLCJrZXlzIiwiaSIsImxlbmd0aCIsImJyZWFrSWZGYWxzZSIsInNpemUiLCJzZXREZWZhdWx0IiwiZGVmIiwiY2xvbmUiLCJFSlNPTiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBQSxNQUFNLENBQUNDLE1BQVAsQ0FBYztBQUFDQyxPQUFLLEVBQUMsTUFBSUE7QUFBWCxDQUFkO0FBQUEsTUFBTUMsTUFBTSxHQUFHQyxNQUFNLENBQUNDLFNBQVAsQ0FBaUJDLGNBQWhDOztBQUVPLE1BQU1KLEtBQU4sQ0FBWTtBQUNqQkssYUFBVyxDQUFDQyxXQUFELEVBQWNDLE9BQWQsRUFBdUI7QUFDaEMsU0FBS0MsS0FBTDtBQUNBLFNBQUtDLFlBQUwsR0FBb0JILFdBQVcsSUFBSUksSUFBSSxDQUFDQyxTQUF4QztBQUNBLFNBQUtDLFFBQUwsR0FBZ0JMLE9BQU8sSUFBSUcsSUFBSSxDQUFDRyxLQUFoQztBQUNELEdBTGdCLENBT25CO0FBQ0E7QUFDQTtBQUNBOzs7QUFFRUMsS0FBRyxDQUFDQyxFQUFELEVBQUs7QUFDTixRQUFJQyxHQUFHLEdBQUcsS0FBS1AsWUFBTCxDQUFrQk0sRUFBbEIsQ0FBVjs7QUFDQSxXQUFPLEtBQUtFLElBQUwsQ0FBVUQsR0FBVixDQUFQO0FBQ0Q7O0FBRURFLEtBQUcsQ0FBQ0gsRUFBRCxFQUFLSSxLQUFMLEVBQVk7QUFDYixRQUFJSCxHQUFHLEdBQUcsS0FBS1AsWUFBTCxDQUFrQk0sRUFBbEIsQ0FBVjs7QUFDQSxTQUFLRSxJQUFMLENBQVVELEdBQVYsSUFBaUJHLEtBQWpCO0FBQ0Q7O0FBRURDLFFBQU0sQ0FBQ0wsRUFBRCxFQUFLO0FBQ1QsUUFBSUMsR0FBRyxHQUFHLEtBQUtQLFlBQUwsQ0FBa0JNLEVBQWxCLENBQVY7O0FBQ0EsV0FBTyxLQUFLRSxJQUFMLENBQVVELEdBQVYsQ0FBUDtBQUNEOztBQUVESyxLQUFHLENBQUNOLEVBQUQsRUFBSztBQUNOLFFBQUlDLEdBQUcsR0FBRyxLQUFLUCxZQUFMLENBQWtCTSxFQUFsQixDQUFWOztBQUNBLFdBQU9kLE1BQU0sQ0FBQ3FCLElBQVAsQ0FBWSxLQUFLTCxJQUFqQixFQUF1QkQsR0FBdkIsQ0FBUDtBQUNEOztBQUVETyxPQUFLLEdBQUc7QUFDTixTQUFLLElBQUlQLEdBQVQsSUFBZ0IsS0FBS0MsSUFBckIsRUFBMkI7QUFDekIsYUFBTyxLQUFQO0FBQ0Q7O0FBQ0QsV0FBTyxJQUFQO0FBQ0Q7O0FBRURULE9BQUssR0FBRztBQUNOLFNBQUtTLElBQUwsR0FBWWYsTUFBTSxDQUFDc0IsTUFBUCxDQUFjLElBQWQsQ0FBWjtBQUNELEdBekNnQixDQTJDakI7OztBQUNBQyxTQUFPLENBQUNDLFFBQUQsRUFBVztBQUNoQjtBQUNBLFFBQUlDLElBQUksR0FBR3pCLE1BQU0sQ0FBQ3lCLElBQVAsQ0FBWSxLQUFLVixJQUFqQixDQUFYOztBQUNBLFNBQUssSUFBSVcsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR0QsSUFBSSxDQUFDRSxNQUF6QixFQUFpQ0QsQ0FBQyxFQUFsQyxFQUFzQztBQUNwQyxVQUFJRSxZQUFZLEdBQUdKLFFBQVEsQ0FBQ0osSUFBVCxDQUNqQixJQURpQixFQUVqQixLQUFLTCxJQUFMLENBQVVVLElBQUksQ0FBQ0MsQ0FBRCxDQUFkLENBRmlCLEVBR2pCLEtBQUtoQixRQUFMLENBQWNlLElBQUksQ0FBQ0MsQ0FBRCxDQUFsQixDQUhpQixDQUFuQjs7QUFLQSxVQUFJRSxZQUFZLEtBQUssS0FBckIsRUFBNEI7QUFDMUI7QUFDRDtBQUNGO0FBQ0Y7O0FBRURDLE1BQUksR0FBRztBQUNMLFdBQU83QixNQUFNLENBQUN5QixJQUFQLENBQVksS0FBS1YsSUFBakIsRUFBdUJZLE1BQTlCO0FBQ0Q7O0FBRURHLFlBQVUsQ0FBQ2pCLEVBQUQsRUFBS2tCLEdBQUwsRUFBVTtBQUNsQixRQUFJakIsR0FBRyxHQUFHLEtBQUtQLFlBQUwsQ0FBa0JNLEVBQWxCLENBQVY7O0FBQ0EsUUFBSWQsTUFBTSxDQUFDcUIsSUFBUCxDQUFZLEtBQUtMLElBQWpCLEVBQXVCRCxHQUF2QixDQUFKLEVBQWlDO0FBQy9CLGFBQU8sS0FBS0MsSUFBTCxDQUFVRCxHQUFWLENBQVA7QUFDRDs7QUFDRCxTQUFLQyxJQUFMLENBQVVELEdBQVYsSUFBaUJpQixHQUFqQjtBQUNBLFdBQU9BLEdBQVA7QUFDRCxHQXRFZ0IsQ0F3RWpCO0FBQ0E7OztBQUNBQyxPQUFLLEdBQUc7QUFDTixRQUFJQSxLQUFLLEdBQUcsSUFBSWxDLEtBQUosQ0FBVSxLQUFLUyxZQUFmLEVBQTZCLEtBQUtHLFFBQWxDLENBQVo7QUFDQSxTQUFLYSxPQUFMLENBQWEsVUFBVU4sS0FBVixFQUFpQkosRUFBakIsRUFBcUI7QUFDaENtQixXQUFLLENBQUNoQixHQUFOLENBQVVILEVBQVYsRUFBY29CLEtBQUssQ0FBQ0QsS0FBTixDQUFZZixLQUFaLENBQWQ7QUFDRCxLQUZEO0FBR0EsV0FBT2UsS0FBUDtBQUNEOztBQWhGZ0IsQyIsImZpbGUiOiIvcGFja2FnZXMvaWQtbWFwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgaGFzT3duID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcblxuZXhwb3J0IGNsYXNzIElkTWFwIHtcbiAgY29uc3RydWN0b3IoaWRTdHJpbmdpZnksIGlkUGFyc2UpIHtcbiAgICB0aGlzLmNsZWFyKCk7XG4gICAgdGhpcy5faWRTdHJpbmdpZnkgPSBpZFN0cmluZ2lmeSB8fCBKU09OLnN0cmluZ2lmeTtcbiAgICB0aGlzLl9pZFBhcnNlID0gaWRQYXJzZSB8fCBKU09OLnBhcnNlO1xuICB9XG5cbi8vIFNvbWUgb2YgdGhlc2UgbWV0aG9kcyBhcmUgZGVzaWduZWQgdG8gbWF0Y2ggbWV0aG9kcyBvbiBPcmRlcmVkRGljdCwgc2luY2Vcbi8vIChlZykgT2JzZXJ2ZU11bHRpcGxleCBhbmQgX0NhY2hpbmdDaGFuZ2VPYnNlcnZlciB1c2UgdGhlbSBpbnRlcmNoYW5nZWFibHkuXG4vLyAoQ29uY2VpdmFibHksIHRoaXMgc2hvdWxkIGJlIHJlcGxhY2VkIHdpdGggXCJVbm9yZGVyZWREaWN0XCIgd2l0aCBhIHNwZWNpZmljXG4vLyBzZXQgb2YgbWV0aG9kcyB0aGF0IG92ZXJsYXAgYmV0d2VlbiB0aGUgdHdvLilcblxuICBnZXQoaWQpIHtcbiAgICB2YXIga2V5ID0gdGhpcy5faWRTdHJpbmdpZnkoaWQpO1xuICAgIHJldHVybiB0aGlzLl9tYXBba2V5XTtcbiAgfVxuXG4gIHNldChpZCwgdmFsdWUpIHtcbiAgICB2YXIga2V5ID0gdGhpcy5faWRTdHJpbmdpZnkoaWQpO1xuICAgIHRoaXMuX21hcFtrZXldID0gdmFsdWU7XG4gIH1cblxuICByZW1vdmUoaWQpIHtcbiAgICB2YXIga2V5ID0gdGhpcy5faWRTdHJpbmdpZnkoaWQpO1xuICAgIGRlbGV0ZSB0aGlzLl9tYXBba2V5XTtcbiAgfVxuXG4gIGhhcyhpZCkge1xuICAgIHZhciBrZXkgPSB0aGlzLl9pZFN0cmluZ2lmeShpZCk7XG4gICAgcmV0dXJuIGhhc093bi5jYWxsKHRoaXMuX21hcCwga2V5KTtcbiAgfVxuXG4gIGVtcHR5KCkge1xuICAgIGZvciAobGV0IGtleSBpbiB0aGlzLl9tYXApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBjbGVhcigpIHtcbiAgICB0aGlzLl9tYXAgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICB9XG5cbiAgLy8gSXRlcmF0ZXMgb3ZlciB0aGUgaXRlbXMgaW4gdGhlIG1hcC4gUmV0dXJuIGBmYWxzZWAgdG8gYnJlYWsgdGhlIGxvb3AuXG4gIGZvckVhY2goaXRlcmF0b3IpIHtcbiAgICAvLyBkb24ndCB1c2UgXy5lYWNoLCBiZWNhdXNlIHdlIGNhbid0IGJyZWFrIG91dCBvZiBpdC5cbiAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHRoaXMuX21hcCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgYnJlYWtJZkZhbHNlID0gaXRlcmF0b3IuY2FsbChcbiAgICAgICAgbnVsbCxcbiAgICAgICAgdGhpcy5fbWFwW2tleXNbaV1dLFxuICAgICAgICB0aGlzLl9pZFBhcnNlKGtleXNbaV0pXG4gICAgICApO1xuICAgICAgaWYgKGJyZWFrSWZGYWxzZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHNpemUoKSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMuX21hcCkubGVuZ3RoO1xuICB9XG5cbiAgc2V0RGVmYXVsdChpZCwgZGVmKSB7XG4gICAgdmFyIGtleSA9IHRoaXMuX2lkU3RyaW5naWZ5KGlkKTtcbiAgICBpZiAoaGFzT3duLmNhbGwodGhpcy5fbWFwLCBrZXkpKSB7XG4gICAgICByZXR1cm4gdGhpcy5fbWFwW2tleV07XG4gICAgfVxuICAgIHRoaXMuX21hcFtrZXldID0gZGVmO1xuICAgIHJldHVybiBkZWY7XG4gIH1cblxuICAvLyBBc3N1bWVzIHRoYXQgdmFsdWVzIGFyZSBFSlNPTi1jbG9uZWFibGUsIGFuZCB0aGF0IHdlIGRvbid0IG5lZWQgdG8gY2xvbmVcbiAgLy8gSURzIChpZSwgdGhhdCBub2JvZHkgaXMgZ29pbmcgdG8gbXV0YXRlIGFuIE9iamVjdElkKS5cbiAgY2xvbmUoKSB7XG4gICAgdmFyIGNsb25lID0gbmV3IElkTWFwKHRoaXMuX2lkU3RyaW5naWZ5LCB0aGlzLl9pZFBhcnNlKTtcbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24gKHZhbHVlLCBpZCkge1xuICAgICAgY2xvbmUuc2V0KGlkLCBFSlNPTi5jbG9uZSh2YWx1ZSkpO1xuICAgIH0pO1xuICAgIHJldHVybiBjbG9uZTtcbiAgfVxufVxuIl19
