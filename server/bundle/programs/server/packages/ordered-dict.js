(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var meteorInstall = Package.modules.meteorInstall;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var OrderedDict;

var require = meteorInstall({"node_modules":{"meteor":{"ordered-dict":{"ordered_dict.js":function module(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// packages/ordered-dict/ordered_dict.js                                                                //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
module.export({
  OrderedDict: () => OrderedDict
});

// This file defines an ordered dictionary abstraction that is useful for
// maintaining a dataset backed by observeChanges.  It supports ordering items
// by specifying the item they now come before.
// The implementation is a dictionary that contains nodes of a doubly-linked
// list as its values.
// constructs a new element struct
// next and prev are whole elements, not keys.
function element(key, value, next, prev) {
  return {
    key: key,
    value: value,
    next: next,
    prev: prev
  };
}

class OrderedDict {
  constructor() {
    this._dict = Object.create(null);
    this._first = null;
    this._last = null;
    this._size = 0;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (typeof args[0] === 'function') {
      this._stringify = args.shift();
    } else {
      this._stringify = function (x) {
        return x;
      };
    }

    args.forEach(kv => this.putBefore(kv[0], kv[1], null));
  } // the "prefix keys with a space" thing comes from here
  // https://github.com/documentcloud/underscore/issues/376#issuecomment-2815649


  _k(key) {
    return " " + this._stringify(key);
  }

  empty() {
    return !this._first;
  }

  size() {
    return this._size;
  }

  _linkEltIn(elt) {
    if (!elt.next) {
      elt.prev = this._last;
      if (this._last) this._last.next = elt;
      this._last = elt;
    } else {
      elt.prev = elt.next.prev;
      elt.next.prev = elt;
      if (elt.prev) elt.prev.next = elt;
    }

    if (this._first === null || this._first === elt.next) this._first = elt;
  }

  _linkEltOut(elt) {
    if (elt.next) elt.next.prev = elt.prev;
    if (elt.prev) elt.prev.next = elt.next;
    if (elt === this._last) this._last = elt.prev;
    if (elt === this._first) this._first = elt.next;
  }

  putBefore(key, item, before) {
    if (this._dict[this._k(key)]) throw new Error("Item " + key + " already present in OrderedDict");
    var elt = before ? element(key, item, this._dict[this._k(before)]) : element(key, item, null);
    if (typeof elt.next === "undefined") throw new Error("could not find item to put this one before");

    this._linkEltIn(elt);

    this._dict[this._k(key)] = elt;
    this._size++;
  }

  append(key, item) {
    this.putBefore(key, item, null);
  }

  remove(key) {
    var elt = this._dict[this._k(key)];

    if (typeof elt === "undefined") throw new Error("Item " + key + " not present in OrderedDict");

    this._linkEltOut(elt);

    this._size--;
    delete this._dict[this._k(key)];
    return elt.value;
  }

  get(key) {
    if (this.has(key)) {
      return this._dict[this._k(key)].value;
    }
  }

  has(key) {
    return Object.prototype.hasOwnProperty.call(this._dict, this._k(key));
  } // Iterate through the items in this dictionary in order, calling
  // iter(value, key, index) on each one.
  // Stops whenever iter returns OrderedDict.BREAK, or after the last element.


  forEach(iter) {
    let context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var i = 0;
    var elt = this._first;

    while (elt !== null) {
      var b = iter.call(context, elt.value, elt.key, i);
      if (b === OrderedDict.BREAK) return;
      elt = elt.next;
      i++;
    }
  }

  first() {
    if (this.empty()) {
      return;
    }

    return this._first.key;
  }

  firstValue() {
    if (this.empty()) {
      return;
    }

    return this._first.value;
  }

  last() {
    if (this.empty()) {
      return;
    }

    return this._last.key;
  }

  lastValue() {
    if (this.empty()) {
      return;
    }

    return this._last.value;
  }

  prev(key) {
    if (this.has(key)) {
      var elt = this._dict[this._k(key)];

      if (elt.prev) return elt.prev.key;
    }

    return null;
  }

  next(key) {
    if (this.has(key)) {
      var elt = this._dict[this._k(key)];

      if (elt.next) return elt.next.key;
    }

    return null;
  }

  moveBefore(key, before) {
    var elt = this._dict[this._k(key)];

    var eltBefore = before ? this._dict[this._k(before)] : null;

    if (typeof elt === "undefined") {
      throw new Error("Item to move is not present");
    }

    if (typeof eltBefore === "undefined") {
      throw new Error("Could not find element to move this one before");
    }

    if (eltBefore === elt.next) // no moving necessary
      return; // remove from its old place

    this._linkEltOut(elt); // patch into its new place


    elt.next = eltBefore;

    this._linkEltIn(elt);
  } // Linear, sadly.


  indexOf(key) {
    var ret = null;
    this.forEach((v, k, i) => {
      if (this._k(k) === this._k(key)) {
        ret = i;
        return OrderedDict.BREAK;
      }

      return;
    });
    return ret;
  }

  _checkRep() {
    Object.keys(this._dict).forEach(k => {
      const v = this._dict[k];

      if (v.next === v) {
        throw new Error("Next is a loop");
      }

      if (v.prev === v) {
        throw new Error("Prev is a loop");
      }
    });
  }

}

OrderedDict.BREAK = {
  "break": true
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

var exports = require("/node_modules/meteor/ordered-dict/ordered_dict.js");

/* Exports */
Package._define("ordered-dict", exports, {
  OrderedDict: OrderedDict
});

})();

//# sourceURL=meteor://💻app/packages/ordered-dict.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvb3JkZXJlZC1kaWN0L29yZGVyZWRfZGljdC5qcyJdLCJuYW1lcyI6WyJtb2R1bGUiLCJleHBvcnQiLCJPcmRlcmVkRGljdCIsImVsZW1lbnQiLCJrZXkiLCJ2YWx1ZSIsIm5leHQiLCJwcmV2IiwiY29uc3RydWN0b3IiLCJfZGljdCIsIk9iamVjdCIsImNyZWF0ZSIsIl9maXJzdCIsIl9sYXN0IiwiX3NpemUiLCJhcmdzIiwiX3N0cmluZ2lmeSIsInNoaWZ0IiwieCIsImZvckVhY2giLCJrdiIsInB1dEJlZm9yZSIsIl9rIiwiZW1wdHkiLCJzaXplIiwiX2xpbmtFbHRJbiIsImVsdCIsIl9saW5rRWx0T3V0IiwiaXRlbSIsImJlZm9yZSIsIkVycm9yIiwiYXBwZW5kIiwicmVtb3ZlIiwiZ2V0IiwiaGFzIiwicHJvdG90eXBlIiwiaGFzT3duUHJvcGVydHkiLCJjYWxsIiwiaXRlciIsImNvbnRleHQiLCJpIiwiYiIsIkJSRUFLIiwiZmlyc3QiLCJmaXJzdFZhbHVlIiwibGFzdCIsImxhc3RWYWx1ZSIsIm1vdmVCZWZvcmUiLCJlbHRCZWZvcmUiLCJpbmRleE9mIiwicmV0IiwidiIsImsiLCJfY2hlY2tSZXAiLCJrZXlzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQUEsTUFBTSxDQUFDQyxNQUFQLENBQWM7QUFBQ0MsYUFBVyxFQUFDLE1BQUlBO0FBQWpCLENBQWQ7O0FBQUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQSxTQUFTQyxPQUFULENBQWlCQyxHQUFqQixFQUFzQkMsS0FBdEIsRUFBNkJDLElBQTdCLEVBQW1DQyxJQUFuQyxFQUF5QztBQUN2QyxTQUFPO0FBQ0xILE9BQUcsRUFBRUEsR0FEQTtBQUVMQyxTQUFLLEVBQUVBLEtBRkY7QUFHTEMsUUFBSSxFQUFFQSxJQUhEO0FBSUxDLFFBQUksRUFBRUE7QUFKRCxHQUFQO0FBTUQ7O0FBRU0sTUFBTUwsV0FBTixD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OiIvcGFja2FnZXMvb3JkZXJlZC1kaWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gVGhpcyBmaWxlIGRlZmluZXMgYW4gb3JkZXJlZCBkaWN0aW9uYXJ5IGFic3RyYWN0aW9uIHRoYXQgaXMgdXNlZnVsIGZvclxuLy8gbWFpbnRhaW5pbmcgYSBkYXRhc2V0IGJhY2tlZCBieSBvYnNlcnZlQ2hhbmdlcy4gIEl0IHN1cHBvcnRzIG9yZGVyaW5nIGl0ZW1zXG4vLyBieSBzcGVjaWZ5aW5nIHRoZSBpdGVtIHRoZXkgbm93IGNvbWUgYmVmb3JlLlxuXG4vLyBUaGUgaW1wbGVtZW50YXRpb24gaXMgYSBkaWN0aW9uYXJ5IHRoYXQgY29udGFpbnMgbm9kZXMgb2YgYSBkb3VibHktbGlua2VkXG4vLyBsaXN0IGFzIGl0cyB2YWx1ZXMuXG5cbi8vIGNvbnN0cnVjdHMgYSBuZXcgZWxlbWVudCBzdHJ1Y3Rcbi8vIG5leHQgYW5kIHByZXYgYXJlIHdob2xlIGVsZW1lbnRzLCBub3Qga2V5cy5cbmZ1bmN0aW9uIGVsZW1lbnQoa2V5LCB2YWx1ZSwgbmV4dCwgcHJldikge1xuICByZXR1cm4ge1xuICAgIGtleToga2V5LFxuICAgIHZhbHVlOiB2YWx1ZSxcbiAgICBuZXh0OiBuZXh0LFxuICAgIHByZXY6IHByZXZcbiAgfTtcbn1cblxuZXhwb3J0IGNsYXNzIE9yZGVyZWREaWN0IHtcbiAgY29uc3RydWN0b3IoLi4uYXJncykge1xuICAgIHRoaXMuX2RpY3QgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIHRoaXMuX2ZpcnN0ID0gbnVsbDtcbiAgICB0aGlzLl9sYXN0ID0gbnVsbDtcbiAgICB0aGlzLl9zaXplID0gMDtcblxuICAgIGlmICh0eXBlb2YgYXJnc1swXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhpcy5fc3RyaW5naWZ5ID0gYXJncy5zaGlmdCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9zdHJpbmdpZnkgPSBmdW5jdGlvbiAoeCkgeyByZXR1cm4geDsgfTtcbiAgICB9XG5cbiAgICBhcmdzLmZvckVhY2goa3YgPT4gdGhpcy5wdXRCZWZvcmUoa3ZbMF0sIGt2WzFdLCBudWxsKSk7XG4gIH1cblxuICAvLyB0aGUgXCJwcmVmaXgga2V5cyB3aXRoIGEgc3BhY2VcIiB0aGluZyBjb21lcyBmcm9tIGhlcmVcbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2RvY3VtZW50Y2xvdWQvdW5kZXJzY29yZS9pc3N1ZXMvMzc2I2lzc3VlY29tbWVudC0yODE1NjQ5XG4gIF9rKGtleSkge1xuICAgIHJldHVybiBcIiBcIiArIHRoaXMuX3N0cmluZ2lmeShrZXkpO1xuICB9XG5cbiAgZW1wdHkoKSB7XG4gICAgcmV0dXJuICF0aGlzLl9maXJzdDtcbiAgfVxuXG4gIHNpemUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NpemU7XG4gIH1cblxuICBfbGlua0VsdEluKGVsdCkge1xuICAgIGlmICghZWx0Lm5leHQpIHtcbiAgICAgIGVsdC5wcmV2ID0gdGhpcy5fbGFzdDtcbiAgICAgIGlmICh0aGlzLl9sYXN0KVxuICAgICAgICB0aGlzLl9sYXN0Lm5leHQgPSBlbHQ7XG4gICAgICB0aGlzLl9sYXN0ID0gZWx0O1xuICAgIH0gZWxzZSB7XG4gICAgICBlbHQucHJldiA9IGVsdC5uZXh0LnByZXY7XG4gICAgICBlbHQubmV4dC5wcmV2ID0gZWx0O1xuICAgICAgaWYgKGVsdC5wcmV2KVxuICAgICAgICBlbHQucHJldi5uZXh0ID0gZWx0O1xuICAgIH1cbiAgICBpZiAodGhpcy5fZmlyc3QgPT09IG51bGwgfHwgdGhpcy5fZmlyc3QgPT09IGVsdC5uZXh0KVxuICAgICAgdGhpcy5fZmlyc3QgPSBlbHQ7XG4gIH1cblxuICBfbGlua0VsdE91dChlbHQpIHtcbiAgICBpZiAoZWx0Lm5leHQpXG4gICAgICBlbHQubmV4dC5wcmV2ID0gZWx0LnByZXY7XG4gICAgaWYgKGVsdC5wcmV2KVxuICAgICAgZWx0LnByZXYubmV4dCA9IGVsdC5uZXh0O1xuICAgIGlmIChlbHQgPT09IHRoaXMuX2xhc3QpXG4gICAgICB0aGlzLl9sYXN0ID0gZWx0LnByZXY7XG4gICAgaWYgKGVsdCA9PT0gdGhpcy5fZmlyc3QpXG4gICAgICB0aGlzLl9maXJzdCA9IGVsdC5uZXh0O1xuICB9XG5cbiAgcHV0QmVmb3JlKGtleSwgaXRlbSwgYmVmb3JlKSB7XG4gICAgaWYgKHRoaXMuX2RpY3RbdGhpcy5fayhrZXkpXSlcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkl0ZW0gXCIgKyBrZXkgKyBcIiBhbHJlYWR5IHByZXNlbnQgaW4gT3JkZXJlZERpY3RcIik7XG4gICAgdmFyIGVsdCA9IGJlZm9yZSA/XG4gICAgICBlbGVtZW50KGtleSwgaXRlbSwgdGhpcy5fZGljdFt0aGlzLl9rKGJlZm9yZSldKSA6XG4gICAgICBlbGVtZW50KGtleSwgaXRlbSwgbnVsbCk7XG4gICAgaWYgKHR5cGVvZiBlbHQubmV4dCA9PT0gXCJ1bmRlZmluZWRcIilcbiAgICAgIHRocm93IG5ldyBFcnJvcihcImNvdWxkIG5vdCBmaW5kIGl0ZW0gdG8gcHV0IHRoaXMgb25lIGJlZm9yZVwiKTtcbiAgICB0aGlzLl9saW5rRWx0SW4oZWx0KTtcbiAgICB0aGlzLl9kaWN0W3RoaXMuX2soa2V5KV0gPSBlbHQ7XG4gICAgdGhpcy5fc2l6ZSsrO1xuICB9XG5cbiAgYXBwZW5kKGtleSwgaXRlbSkge1xuICAgIHRoaXMucHV0QmVmb3JlKGtleSwgaXRlbSwgbnVsbCk7XG4gIH1cblxuICByZW1vdmUoa2V5KSB7XG4gICAgdmFyIGVsdCA9IHRoaXMuX2RpY3RbdGhpcy5fayhrZXkpXTtcbiAgICBpZiAodHlwZW9mIGVsdCA9PT0gXCJ1bmRlZmluZWRcIilcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkl0ZW0gXCIgKyBrZXkgKyBcIiBub3QgcHJlc2VudCBpbiBPcmRlcmVkRGljdFwiKTtcbiAgICB0aGlzLl9saW5rRWx0T3V0KGVsdCk7XG4gICAgdGhpcy5fc2l6ZS0tO1xuICAgIGRlbGV0ZSB0aGlzLl9kaWN0W3RoaXMuX2soa2V5KV07XG4gICAgcmV0dXJuIGVsdC52YWx1ZTtcbiAgfVxuXG4gIGdldChrZXkpIHtcbiAgICBpZiAodGhpcy5oYXMoa2V5KSkge1xuICAgICAgcmV0dXJuIHRoaXMuX2RpY3RbdGhpcy5fayhrZXkpXS52YWx1ZTtcbiAgICB9XG4gIH1cblxuICBoYXMoa2V5KSB7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChcbiAgICAgIHRoaXMuX2RpY3QsXG4gICAgICB0aGlzLl9rKGtleSlcbiAgICApO1xuICB9XG5cbiAgLy8gSXRlcmF0ZSB0aHJvdWdoIHRoZSBpdGVtcyBpbiB0aGlzIGRpY3Rpb25hcnkgaW4gb3JkZXIsIGNhbGxpbmdcbiAgLy8gaXRlcih2YWx1ZSwga2V5LCBpbmRleCkgb24gZWFjaCBvbmUuXG5cbiAgLy8gU3RvcHMgd2hlbmV2ZXIgaXRlciByZXR1cm5zIE9yZGVyZWREaWN0LkJSRUFLLCBvciBhZnRlciB0aGUgbGFzdCBlbGVtZW50LlxuICBmb3JFYWNoKGl0ZXIsIGNvbnRleHQgPSBudWxsKSB7XG4gICAgdmFyIGkgPSAwO1xuICAgIHZhciBlbHQgPSB0aGlzLl9maXJzdDtcbiAgICB3aGlsZSAoZWx0ICE9PSBudWxsKSB7XG4gICAgICB2YXIgYiA9IGl0ZXIuY2FsbChjb250ZXh0LCBlbHQudmFsdWUsIGVsdC5rZXksIGkpO1xuICAgICAgaWYgKGIgPT09IE9yZGVyZWREaWN0LkJSRUFLKSByZXR1cm47XG4gICAgICBlbHQgPSBlbHQubmV4dDtcbiAgICAgIGkrKztcbiAgICB9XG4gIH1cblxuICBmaXJzdCgpIHtcbiAgICBpZiAodGhpcy5lbXB0eSgpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9maXJzdC5rZXk7XG4gIH1cblxuICBmaXJzdFZhbHVlKCkge1xuICAgIGlmICh0aGlzLmVtcHR5KCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2ZpcnN0LnZhbHVlO1xuICB9XG5cbiAgbGFzdCgpIHtcbiAgICBpZiAodGhpcy5lbXB0eSgpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9sYXN0LmtleTtcbiAgfVxuXG4gIGxhc3RWYWx1ZSgpIHtcbiAgICBpZiAodGhpcy5lbXB0eSgpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9sYXN0LnZhbHVlO1xuICB9XG5cbiAgcHJldihrZXkpIHtcbiAgICBpZiAodGhpcy5oYXMoa2V5KSkge1xuICAgICAgdmFyIGVsdCA9IHRoaXMuX2RpY3RbdGhpcy5fayhrZXkpXTtcbiAgICAgIGlmIChlbHQucHJldilcbiAgICAgICAgcmV0dXJuIGVsdC5wcmV2LmtleTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBuZXh0KGtleSkge1xuICAgIGlmICh0aGlzLmhhcyhrZXkpKSB7XG4gICAgICB2YXIgZWx0ID0gdGhpcy5fZGljdFt0aGlzLl9rKGtleSldO1xuICAgICAgaWYgKGVsdC5uZXh0KVxuICAgICAgICByZXR1cm4gZWx0Lm5leHQua2V5O1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIG1vdmVCZWZvcmUoa2V5LCBiZWZvcmUpIHtcbiAgICB2YXIgZWx0ID0gdGhpcy5fZGljdFt0aGlzLl9rKGtleSldO1xuICAgIHZhciBlbHRCZWZvcmUgPSBiZWZvcmUgPyB0aGlzLl9kaWN0W3RoaXMuX2soYmVmb3JlKV0gOiBudWxsO1xuICAgIGlmICh0eXBlb2YgZWx0ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJdGVtIHRvIG1vdmUgaXMgbm90IHByZXNlbnRcIik7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgZWx0QmVmb3JlID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZCBub3QgZmluZCBlbGVtZW50IHRvIG1vdmUgdGhpcyBvbmUgYmVmb3JlXCIpO1xuICAgIH1cbiAgICBpZiAoZWx0QmVmb3JlID09PSBlbHQubmV4dCkgLy8gbm8gbW92aW5nIG5lY2Vzc2FyeVxuICAgICAgcmV0dXJuO1xuICAgIC8vIHJlbW92ZSBmcm9tIGl0cyBvbGQgcGxhY2VcbiAgICB0aGlzLl9saW5rRWx0T3V0KGVsdCk7XG4gICAgLy8gcGF0Y2ggaW50byBpdHMgbmV3IHBsYWNlXG4gICAgZWx0Lm5leHQgPSBlbHRCZWZvcmU7XG4gICAgdGhpcy5fbGlua0VsdEluKGVsdCk7XG4gIH1cblxuICAvLyBMaW5lYXIsIHNhZGx5LlxuICBpbmRleE9mKGtleSkge1xuICAgIHZhciByZXQgPSBudWxsO1xuICAgIHRoaXMuZm9yRWFjaCgodiwgaywgaSkgPT4ge1xuICAgICAgaWYgKHRoaXMuX2soaykgPT09IHRoaXMuX2soa2V5KSkge1xuICAgICAgICByZXQgPSBpO1xuICAgICAgICByZXR1cm4gT3JkZXJlZERpY3QuQlJFQUs7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfSk7XG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIF9jaGVja1JlcCgpIHtcbiAgICBPYmplY3Qua2V5cyh0aGlzLl9kaWN0KS5mb3JFYWNoKGsgPT4ge1xuICAgICAgY29uc3QgdiA9IHRoaXMuX2RpY3Rba107XG4gICAgICBpZiAodi5uZXh0ID09PSB2KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5leHQgaXMgYSBsb29wXCIpO1xuICAgICAgfVxuICAgICAgaWYgKHYucHJldiA9PT0gdikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJQcmV2IGlzIGEgbG9vcFwiKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG5PcmRlcmVkRGljdC5CUkVBSyA9IHtcImJyZWFrXCI6IHRydWV9O1xuIl19
