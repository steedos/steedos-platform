(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var Base64 = Package.base64.Base64;
var meteorInstall = Package.modules.meteorInstall;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var EJSON;

var require = meteorInstall({"node_modules":{"meteor":{"ejson":{"ejson.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// packages/ejson/ejson.js                                                                                     //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
module.export({
  EJSON: () => EJSON
});
let isFunction, isObject, keysOf, lengthOf, hasOwn, convertMapToObject, isArguments, isInfOrNaN, handleError;
module.link("./utils", {
  isFunction(v) {
    isFunction = v;
  },

  isObject(v) {
    isObject = v;
  },

  keysOf(v) {
    keysOf = v;
  },

  lengthOf(v) {
    lengthOf = v;
  },

  hasOwn(v) {
    hasOwn = v;
  },

  convertMapToObject(v) {
    convertMapToObject = v;
  },

  isArguments(v) {
    isArguments = v;
  },

  isInfOrNaN(v) {
    isInfOrNaN = v;
  },

  handleError(v) {
    handleError = v;
  }

}, 0);

/**
 * @namespace
 * @summary Namespace for EJSON functions
 */
const EJSON = {}; // Custom type interface definition

/**
 * @class CustomType
 * @instanceName customType
 * @memberOf EJSON
 * @summary The interface that a class must satisfy to be able to become an
 * EJSON custom type via EJSON.addType.
 */

/**
 * @function typeName
 * @memberOf EJSON.CustomType
 * @summary Return the tag used to identify this type.  This must match the
 *          tag used to register this type with
 *          [`EJSON.addType`](#ejson_add_type).
 * @locus Anywhere
 * @instance
 */

/**
 * @function toJSONValue
 * @memberOf EJSON.CustomType
 * @summary Serialize this instance into a JSON-compatible value.
 * @locus Anywhere
 * @instance
 */

/**
 * @function clone
 * @memberOf EJSON.CustomType
 * @summary Return a value `r` such that `this.equals(r)` is true, and
 *          modifications to `r` do not affect `this` and vice versa.
 * @locus Anywhere
 * @instance
 */

/**
 * @function equals
 * @memberOf EJSON.CustomType
 * @summary Return `true` if `other` has a value equal to `this`; `false`
 *          otherwise.
 * @locus Anywhere
 * @param {Object} other Another object to compare this to.
 * @instance
 */

const customTypes = new Map(); // Add a custom type, using a method of your choice to get to and
// from a basic JSON-able representation.  The factory argument
// is a function of JSON-able --> your object
// The type you add must have:
// - A toJSONValue() method, so that Meteor can serialize it
// - a typeName() method, to show how to look it up in our type table.
// It is okay if these methods are monkey-patched on.
// EJSON.clone will use toJSONValue and the given factory to produce
// a clone, but you may specify a method clone() that will be
// used instead.
// Similarly, EJSON.equals will use toJSONValue to make comparisons,
// but you may provide a method equals() instead.

/**
 * @summary Add a custom datatype to EJSON.
 * @locus Anywhere
 * @param {String} name A tag for your custom type; must be unique among
 *                      custom data types defined in your project, and must
 *                      match the result of your type's `typeName` method.
 * @param {Function} factory A function that deserializes a JSON-compatible
 *                           value into an instance of your type.  This should
 *                           match the serialization performed by your
 *                           type's `toJSONValue` method.
 */

EJSON.addType = (name, factory) => {
  if (customTypes.has(name)) {
    throw new Error("Type ".concat(name, " already present"));
  }

  customTypes.set(name, factory);
};

const builtinConverters = [{
  // Date
  matchJSONValue(obj) {
    return hasOwn(obj, '$date') && lengthOf(obj) === 1;
  },

  matchObject(obj) {
    return obj instanceof Date;
  },

  toJSONValue(obj) {
    return {
      $date: obj.getTime()
    };
  },

  fromJSONValue(obj) {
    return new Date(obj.$date);
  }

}, {
  // RegExp
  matchJSONValue(obj) {
    return hasOwn(obj, '$regexp') && hasOwn(obj, '$flags') && lengthOf(obj) === 2;
  },

  matchObject(obj) {
    return obj instanceof RegExp;
  },

  toJSONValue(regexp) {
    return {
      $regexp: regexp.source,
      $flags: regexp.flags
    };
  },

  fromJSONValue(obj) {
    // Replaces duplicate / invalid flags.
    return new RegExp(obj.$regexp, obj.$flags // Cut off flags at 50 chars to avoid abusing RegExp for DOS.
    .slice(0, 50).replace(/[^gimuy]/g, '').replace(/(.)(?=.*\1)/g, ''));
  }

}, {
  // NaN, Inf, -Inf. (These are the only objects with typeof !== 'object'
  // which we match.)
  matchJSONValue(obj) {
    return hasOwn(obj, '$InfNaN') && lengthOf(obj) === 1;
  },

  matchObject: isInfOrNaN,

  toJSONValue(obj) {
    let sign;

    if (Number.isNaN(obj)) {
      sign = 0;
    } else if (obj === Infinity) {
      sign = 1;
    } else {
      sign = -1;
    }

    return {
      $InfNaN: sign
    };
  },

  fromJSONValue(obj) {
    return obj.$InfNaN / 0;
  }

}, {
  // Binary
  matchJSONValue(obj) {
    return hasOwn(obj, '$binary') && lengthOf(obj) === 1;
  },

  matchObject(obj) {
    return typeof Uint8Array !== 'undefined' && obj instanceof Uint8Array || obj && hasOwn(obj, '$Uint8ArrayPolyfill');
  },

  toJSONValue(obj) {
    return {
      $binary: Base64.encode(obj)
    };
  },

  fromJSONValue(obj) {
    return Base64.decode(obj.$binary);
  }

}, {
  // Escaping one level
  matchJSONValue(obj) {
    return hasOwn(obj, '$escape') && lengthOf(obj) === 1;
  },

  matchObject(obj) {
    let match = false;

    if (obj) {
      const keyCount = lengthOf(obj);

      if (keyCount === 1 || keyCount === 2) {
        match = builtinConverters.some(converter => converter.matchJSONValue(obj));
      }
    }

    return match;
  },

  toJSONValue(obj) {
    const newObj = {};
    keysOf(obj).forEach(key => {
      newObj[key] = EJSON.toJSONValue(obj[key]);
    });
    return {
      $escape: newObj
    };
  },

  fromJSONValue(obj) {
    const newObj = {};
    keysOf(obj.$escape).forEach(key => {
      newObj[key] = EJSON.fromJSONValue(obj.$escape[key]);
    });
    return newObj;
  }

}, {
  // Custom
  matchJSONValue(obj) {
    return hasOwn(obj, '$type') && hasOwn(obj, '$value') && lengthOf(obj) === 2;
  },

  matchObject(obj) {
    return EJSON._isCustomType(obj);
  },

  toJSONValue(obj) {
    const jsonValue = Meteor._noYieldsAllowed(() => obj.toJSONValue());

    return {
      $type: obj.typeName(),
      $value: jsonValue
    };
  },

  fromJSONValue(obj) {
    const typeName = obj.$type;

    if (!customTypes.has(typeName)) {
      throw new Error("Custom EJSON type ".concat(typeName, " is not defined"));
    }

    const converter = customTypes.get(typeName);
    return Meteor._noYieldsAllowed(() => converter(obj.$value));
  }

}];

EJSON._isCustomType = obj => obj && isFunction(obj.toJSONValue) && isFunction(obj.typeName) && customTypes.has(obj.typeName());

EJSON._getTypes = function () {
  let isOriginal = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  return isOriginal ? customTypes : convertMapToObject(customTypes);
};

EJSON._getConverters = () => builtinConverters; // Either return the JSON-compatible version of the argument, or undefined (if
// the item isn't itself replaceable, but maybe some fields in it are)


const toJSONValueHelper = item => {
  for (let i = 0; i < builtinConverters.length; i++) {
    const converter = builtinConverters[i];

    if (converter.matchObject(item)) {
      return converter.toJSONValue(item);
    }
  }

  return undefined;
}; // for both arrays and objects, in-place modification.


const adjustTypesToJSONValue = obj => {
  // Is it an atom that we need to adjust?
  if (obj === null) {
    return null;
  }

  const maybeChanged = toJSONValueHelper(obj);

  if (maybeChanged !== undefined) {
    return maybeChanged;
  } // Other atoms are unchanged.


  if (!isObject(obj)) {
    return obj;
  } // Iterate over array or object structure.


  keysOf(obj).forEach(key => {
    const value = obj[key];

    if (!isObject(value) && value !== undefined && !isInfOrNaN(value)) {
      return; // continue
    }

    const changed = toJSONValueHelper(value);

    if (changed) {
      obj[key] = changed;
      return; // on to the next key
    } // if we get here, value is an object but not adjustable
    // at this level.  recurse.


    adjustTypesToJSONValue(value);
  });
  return obj;
};

EJSON._adjustTypesToJSONValue = adjustTypesToJSONValue;
/**
 * @summary Serialize an EJSON-compatible value into its plain JSON
 *          representation.
 * @locus Anywhere
 * @param {EJSON} val A value to serialize to plain JSON.
 */

EJSON.toJSONValue = item => {
  const changed = toJSONValueHelper(item);

  if (changed !== undefined) {
    return changed;
  }

  let newItem = item;

  if (isObject(item)) {
    newItem = EJSON.clone(item);
    adjustTypesToJSONValue(newItem);
  }

  return newItem;
}; // Either return the argument changed to have the non-json
// rep of itself (the Object version) or the argument itself.
// DOES NOT RECURSE.  For actually getting the fully-changed value, use
// EJSON.fromJSONValue


const fromJSONValueHelper = value => {
  if (isObject(value) && value !== null) {
    const keys = keysOf(value);

    if (keys.length <= 2 && keys.every(k => typeof k === 'string' && k.substr(0, 1) === '$')) {
      for (let i = 0; i < builtinConverters.length; i++) {
        const converter = builtinConverters[i];

        if (converter.matchJSONValue(value)) {
          return converter.fromJSONValue(value);
        }
      }
    }
  }

  return value;
}; // for both arrays and objects. Tries its best to just
// use the object you hand it, but may return something
// different if the object you hand it itself needs changing.


const adjustTypesFromJSONValue = obj => {
  if (obj === null) {
    return null;
  }

  const maybeChanged = fromJSONValueHelper(obj);

  if (maybeChanged !== obj) {
    return maybeChanged;
  } // Other atoms are unchanged.


  if (!isObject(obj)) {
    return obj;
  }

  keysOf(obj).forEach(key => {
    const value = obj[key];

    if (isObject(value)) {
      const changed = fromJSONValueHelper(value);

      if (value !== changed) {
        obj[key] = changed;
        return;
      } // if we get here, value is an object but not adjustable
      // at this level.  recurse.


      adjustTypesFromJSONValue(value);
    }
  });
  return obj;
};

EJSON._adjustTypesFromJSONValue = adjustTypesFromJSONValue;
/**
 * @summary Deserialize an EJSON value from its plain JSON representation.
 * @locus Anywhere
 * @param {JSONCompatible} val A value to deserialize into EJSON.
 */

EJSON.fromJSONValue = item => {
  let changed = fromJSONValueHelper(item);

  if (changed === item && isObject(item)) {
    changed = EJSON.clone(item);
    adjustTypesFromJSONValue(changed);
  }

  return changed;
};
/**
 * @summary Serialize a value to a string. For EJSON values, the serialization
 *          fully represents the value. For non-EJSON values, serializes the
 *          same way as `JSON.stringify`.
 * @locus Anywhere
 * @param {EJSON} val A value to stringify.
 * @param {Object} [options]
 * @param {Boolean | Integer | String} options.indent Indents objects and
 * arrays for easy readability.  When `true`, indents by 2 spaces; when an
 * integer, indents by that number of spaces; and when a string, uses the
 * string as the indentation pattern.
 * @param {Boolean} options.canonical When `true`, stringifies keys in an
 *                                    object in sorted order.
 */


EJSON.stringify = handleError((item, options) => {
  let serialized;
  const json = EJSON.toJSONValue(item);

  if (options && (options.canonical || options.indent)) {
    let canonicalStringify;
    module.link("./stringify", {
      default(v) {
        canonicalStringify = v;
      }

    }, 1);
    serialized = canonicalStringify(json, options);
  } else {
    serialized = JSON.stringify(json);
  }

  return serialized;
});
/**
 * @summary Parse a string into an EJSON value. Throws an error if the string
 *          is not valid EJSON.
 * @locus Anywhere
 * @param {String} str A string to parse into an EJSON value.
 */

EJSON.parse = item => {
  if (typeof item !== 'string') {
    throw new Error('EJSON.parse argument should be a string');
  }

  return EJSON.fromJSONValue(JSON.parse(item));
};
/**
 * @summary Returns true if `x` is a buffer of binary data, as returned from
 *          [`EJSON.newBinary`](#ejson_new_binary).
 * @param {Object} x The variable to check.
 * @locus Anywhere
 */


EJSON.isBinary = obj => {
  return !!(typeof Uint8Array !== 'undefined' && obj instanceof Uint8Array || obj && obj.$Uint8ArrayPolyfill);
};
/**
 * @summary Return true if `a` and `b` are equal to each other.  Return false
 *          otherwise.  Uses the `equals` method on `a` if present, otherwise
 *          performs a deep comparison.
 * @locus Anywhere
 * @param {EJSON} a
 * @param {EJSON} b
 * @param {Object} [options]
 * @param {Boolean} options.keyOrderSensitive Compare in key sensitive order,
 * if supported by the JavaScript implementation.  For example, `{a: 1, b: 2}`
 * is equal to `{b: 2, a: 1}` only when `keyOrderSensitive` is `false`.  The
 * default is `false`.
 */


EJSON.equals = (a, b, options) => {
  let i;
  const keyOrderSensitive = !!(options && options.keyOrderSensitive);

  if (a === b) {
    return true;
  } // This differs from the IEEE spec for NaN equality, b/c we don't want
  // anything ever with a NaN to be poisoned from becoming equal to anything.


  if (Number.isNaN(a) && Number.isNaN(b)) {
    return true;
  } // if either one is falsy, they'd have to be === to be equal


  if (!a || !b) {
    return false;
  }

  if (!(isObject(a) && isObject(b))) {
    return false;
  }

  if (a instanceof Date && b instanceof Date) {
    return a.valueOf() === b.valueOf();
  }

  if (EJSON.isBinary(a) && EJSON.isBinary(b)) {
    if (a.length !== b.length) {
      return false;
    }

    for (i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        return false;
      }
    }

    return true;
  }

  if (isFunction(a.equals)) {
    return a.equals(b, options);
  }

  if (isFunction(b.equals)) {
    return b.equals(a, options);
  }

  if (a instanceof Array) {
    if (!(b instanceof Array)) {
      return false;
    }

    if (a.length !== b.length) {
      return false;
    }

    for (i = 0; i < a.length; i++) {
      if (!EJSON.equals(a[i], b[i], options)) {
        return false;
      }
    }

    return true;
  } // fallback for custom types that don't implement their own equals


  switch (EJSON._isCustomType(a) + EJSON._isCustomType(b)) {
    case 1:
      return false;

    case 2:
      return EJSON.equals(EJSON.toJSONValue(a), EJSON.toJSONValue(b));

    default: // Do nothing

  } // fall back to structural equality of objects


  let ret;
  const aKeys = keysOf(a);
  const bKeys = keysOf(b);

  if (keyOrderSensitive) {
    i = 0;
    ret = aKeys.every(key => {
      if (i >= bKeys.length) {
        return false;
      }

      if (key !== bKeys[i]) {
        return false;
      }

      if (!EJSON.equals(a[key], b[bKeys[i]], options)) {
        return false;
      }

      i++;
      return true;
    });
  } else {
    i = 0;
    ret = aKeys.every(key => {
      if (!hasOwn(b, key)) {
        return false;
      }

      if (!EJSON.equals(a[key], b[key], options)) {
        return false;
      }

      i++;
      return true;
    });
  }

  return ret && i === bKeys.length;
};
/**
 * @summary Return a deep copy of `val`.
 * @locus Anywhere
 * @param {EJSON} val A value to copy.
 */


EJSON.clone = v => {
  let ret;

  if (!isObject(v)) {
    return v;
  }

  if (v === null) {
    return null; // null has typeof "object"
  }

  if (v instanceof Date) {
    return new Date(v.getTime());
  } // RegExps are not really EJSON elements (eg we don't define a serialization
  // for them), but they're immutable anyway, so we can support them in clone.


  if (v instanceof RegExp) {
    return v;
  }

  if (EJSON.isBinary(v)) {
    ret = EJSON.newBinary(v.length);

    for (let i = 0; i < v.length; i++) {
      ret[i] = v[i];
    }

    return ret;
  }

  if (Array.isArray(v)) {
    return v.map(EJSON.clone);
  }

  if (isArguments(v)) {
    return Array.from(v).map(EJSON.clone);
  } // handle general user-defined typed Objects if they have a clone method


  if (isFunction(v.clone)) {
    return v.clone();
  } // handle other custom types


  if (EJSON._isCustomType(v)) {
    return EJSON.fromJSONValue(EJSON.clone(EJSON.toJSONValue(v)), true);
  } // handle other objects


  ret = {};
  keysOf(v).forEach(key => {
    ret[key] = EJSON.clone(v[key]);
  });
  return ret;
};
/**
 * @summary Allocate a new buffer of binary data that EJSON can serialize.
 * @locus Anywhere
 * @param {Number} size The number of bytes of binary data to allocate.
 */
// EJSON.newBinary is the public documented API for this functionality,
// but the implementation is in the 'base64' package to avoid
// introducing a circular dependency. (If the implementation were here,
// then 'base64' would have to use EJSON.newBinary, and 'ejson' would
// also have to use 'base64'.)


EJSON.newBinary = Base64.newBinary;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"stringify.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// packages/ejson/stringify.js                                                                                 //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
// Based on json2.js from https://github.com/douglascrockford/JSON-js
//
//    json2.js
//    2012-10-08
//
//    Public Domain.
//
//    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
function quote(string) {
  return JSON.stringify(string);
}

const str = (key, holder, singleIndent, outerIndent, canonical) => {
  const value = holder[key]; // What happens next depends on the value's type.

  switch (typeof value) {
    case 'string':
      return quote(value);

    case 'number':
      // JSON numbers must be finite. Encode non-finite numbers as null.
      return isFinite(value) ? String(value) : 'null';

    case 'boolean':
      return String(value);
    // If the type is 'object', we might be dealing with an object or an array or
    // null.

    case 'object':
      {
        // Due to a specification blunder in ECMAScript, typeof null is 'object',
        // so watch out for that case.
        if (!value) {
          return 'null';
        } // Make an array to hold the partial results of stringifying this object
        // value.


        const innerIndent = outerIndent + singleIndent;
        const partial = [];
        let v; // Is the value an array?

        if (Array.isArray(value) || {}.hasOwnProperty.call(value, 'callee')) {
          // The value is an array. Stringify every element. Use null as a
          // placeholder for non-JSON values.
          const length = value.length;

          for (let i = 0; i < length; i += 1) {
            partial[i] = str(i, value, singleIndent, innerIndent, canonical) || 'null';
          } // Join all of the elements together, separated with commas, and wrap
          // them in brackets.


          if (partial.length === 0) {
            v = '[]';
          } else if (innerIndent) {
            v = '[\n' + innerIndent + partial.join(',\n' + innerIndent) + '\n' + outerIndent + ']';
          } else {
            v = '[' + partial.join(',') + ']';
          }

          return v;
        } // Iterate through all of the keys in the object.


        let keys = Object.keys(value);

        if (canonical) {
          keys = keys.sort();
        }

        keys.forEach(k => {
          v = str(k, value, singleIndent, innerIndent, canonical);

          if (v) {
            partial.push(quote(k) + (innerIndent ? ': ' : ':') + v);
          }
        }); // Join all of the member texts together, separated with commas,
        // and wrap them in braces.

        if (partial.length === 0) {
          v = '{}';
        } else if (innerIndent) {
          v = '{\n' + innerIndent + partial.join(',\n' + innerIndent) + '\n' + outerIndent + '}';
        } else {
          v = '{' + partial.join(',') + '}';
        }

        return v;
      }

    default: // Do nothing

  }
}; // If the JSON object does not yet have a stringify method, give it one.


const canonicalStringify = (value, options) => {
  // Make a fake root object containing our value under the key of ''.
  // Return the result of stringifying the value.
  const allOptions = Object.assign({
    indent: '',
    canonical: false
  }, options);

  if (allOptions.indent === true) {
    allOptions.indent = '  ';
  } else if (typeof allOptions.indent === 'number') {
    let newIndent = '';

    for (let i = 0; i < allOptions.indent; i++) {
      newIndent += ' ';
    }

    allOptions.indent = newIndent;
  }

  return str('', {
    '': value
  }, allOptions.indent, '', allOptions.canonical);
};

module.exportDefault(canonicalStringify);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"utils.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// packages/ejson/utils.js                                                                                     //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
module.export({
  isFunction: () => isFunction,
  isObject: () => isObject,
  keysOf: () => keysOf,
  lengthOf: () => lengthOf,
  hasOwn: () => hasOwn,
  convertMapToObject: () => convertMapToObject,
  isArguments: () => isArguments,
  isInfOrNaN: () => isInfOrNaN,
  checkError: () => checkError,
  handleError: () => handleError
});

const isFunction = fn => typeof fn === 'function';

const isObject = fn => typeof fn === 'object';

const keysOf = obj => Object.keys(obj);

const lengthOf = obj => Object.keys(obj).length;

const hasOwn = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);

const convertMapToObject = map => Array.from(map).reduce((acc, _ref) => {
  let [key, value] = _ref;
  // reassign to not create new object
  acc[key] = value;
  return acc;
}, {});

const isArguments = obj => obj != null && hasOwn(obj, 'callee');

const isInfOrNaN = obj => Number.isNaN(obj) || obj === Infinity || obj === -Infinity;

const checkError = {
  maxStack: msgError => new RegExp('Maximum call stack size exceeded', 'g').test(msgError)
};

const handleError = fn => function () {
  try {
    return fn.apply(this, arguments);
  } catch (error) {
    const isMaxStack = checkError.maxStack(error.message);

    if (isMaxStack) {
      throw new Error('Converting circular structure to JSON');
    }

    throw error;
  }
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

var exports = require("/node_modules/meteor/ejson/ejson.js");

/* Exports */
Package._define("ejson", exports, {
  EJSON: EJSON
});

})();

//# sourceURL=meteor://💻app/packages/ejson.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZWpzb24vZWpzb24uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2Vqc29uL3N0cmluZ2lmeS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZWpzb24vdXRpbHMuanMiXSwibmFtZXMiOlsibW9kdWxlIiwiZXhwb3J0IiwiRUpTT04iLCJpc0Z1bmN0aW9uIiwiaXNPYmplY3QiLCJrZXlzT2YiLCJsZW5ndGhPZiIsImhhc093biIsImNvbnZlcnRNYXBUb09iamVjdCIsImlzQXJndW1lbnRzIiwiaXNJbmZPck5hTiIsImhhbmRsZUVycm9yIiwibGluayIsInYiLCJjdXN0b21UeXBlcyIsIk1hcCIsImFkZFR5cGUiLCJuYW1lIiwiZmFjdG9yeSIsImhhcyIsIkVycm9yIiwic2V0IiwiYnVpbHRpbkNvbnZlcnRlcnMiLCJtYXRjaEpTT05WYWx1ZSIsIm9iaiIsIm1hdGNoT2JqZWN0IiwiRGF0ZSIsInRvSlNPTlZhbHVlIiwiJGRhdGUiLCJnZXRUaW1lIiwiZnJvbUpTT05WYWx1ZSIsIlJlZ0V4cCIsInJlZ2V4cCIsIiRyZWdleHAiLCJzb3VyY2UiLCIkZmxhZ3MiLCJmbGFncyIsInNsaWNlIiwicmVwbGFjZSIsInNpZ24iLCJOdW1iZXIiLCJpc05hTiIsIkluZmluaXR5IiwiJEluZk5hTiIsIlVpbnQ4QXJyYXkiLCIkYmluYXJ5IiwiQmFzZTY0IiwiZW5jb2RlIiwiZGVjb2RlIiwibWF0Y2giLCJrZXlDb3VudCIsInNvbWUiLCJjb252ZXJ0ZXIiLCJuZXdPYmoiLCJmb3JFYWNoIiwia2V5IiwiJGVzY2FwZSIsIl9pc0N1c3RvbVR5cGUiLCJqc29uVmFsdWUiLCJNZXRlb3IiLCJfbm9ZaWVsZHNBbGxvd2VkIiwiJHR5cGUiLCJ0eXBlTmFtZSIsIiR2YWx1ZSIsImdldCIsIl9nZXRUeXBlcyIsImlzT3JpZ2luYWwiLCJfZ2V0Q29udmVydGVycyIsInRvSlNPTlZhbHVlSGVscGVyIiwiaXRlbSIsImkiLCJsZW5ndGgiLCJ1bmRlZmluZWQiLCJhZGp1c3RUeXBlc1RvSlNPTlZhbHVlIiwibWF5YmVDaGFuZ2VkIiwidmFsdWUiLCJjaGFuZ2VkIiwiX2FkanVzdFR5cGVzVG9KU09OVmFsdWUiLCJuZXdJdGVtIiwiY2xvbmUiLCJmcm9tSlNPTlZhbHVlSGVscGVyIiwia2V5cyIsImV2ZXJ5IiwiayIsInN1YnN0ciIsImFkanVzdFR5cGVzRnJvbUpTT05WYWx1ZSIsIl9hZGp1c3RUeXBlc0Zyb21KU09OVmFsdWUiLCJzdHJpbmdpZnkiLCJvcHRpb25zIiwic2VyaWFsaXplZCIsImpzb24iLCJjYW5vbmljYWwiLCJpbmRlbnQiLCJjYW5vbmljYWxTdHJpbmdpZnkiLCJkZWZhdWx0IiwiSlNPTiIsInBhcnNlIiwiaXNCaW5hcnkiLCIkVWludDhBcnJheVBvbHlmaWxsIiwiZXF1YWxzIiwiYSIsImIiLCJrZXlPcmRlclNlbnNpdGl2ZSIsInZhbHVlT2YiLCJBcnJheSIsInJldCIsImFLZXlzIiwiYktleXMiLCJuZXdCaW5hcnkiLCJpc0FycmF5IiwibWFwIiwiZnJvbSIsInF1b3RlIiwic3RyaW5nIiwic3RyIiwiaG9sZGVyIiwic2luZ2xlSW5kZW50Iiwib3V0ZXJJbmRlbnQiLCJpc0Zpbml0ZSIsIlN0cmluZyIsImlubmVySW5kZW50IiwicGFydGlhbCIsImhhc093blByb3BlcnR5IiwiY2FsbCIsImpvaW4iLCJPYmplY3QiLCJzb3J0IiwicHVzaCIsImFsbE9wdGlvbnMiLCJhc3NpZ24iLCJuZXdJbmRlbnQiLCJleHBvcnREZWZhdWx0IiwiY2hlY2tFcnJvciIsImZuIiwicHJvcCIsInByb3RvdHlwZSIsInJlZHVjZSIsImFjYyIsIm1heFN0YWNrIiwibXNnRXJyb3IiLCJ0ZXN0IiwiYXBwbHkiLCJhcmd1bWVudHMiLCJlcnJvciIsImlzTWF4U3RhY2siLCJtZXNzYWdlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUFBLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjO0FBQUNDLE9BQUssRUFB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QUssQ0FBQ2tCLFFBRHBEOztBQUdBLE1BQU0wRixVQUFVLEdBQUc7QUFDeEJNLFVBQVEsRUFBR0MsUUFBRCxJQUFjLElBQUk1RyxNQUFKLENBQVcsa0NBQVgsRUFBK0MsR0FBL0MsRUFBb0Q2RyxJQUFwRCxDQUF5REQsUUFBekQ7QUFEQSxDQUFuQjs7QUFJQSxNQUFNaEksV0FBVyxHQUFJMEgsRUFBRCxJQUFRLFlBQVc7QUFDNUMsTUFBSTtBQUNGLFdBQU9BLEVBQUUsQ0FBQ1EsS0FBSCxDQUFTLElBQVQsRUFBZUMsU0FBZixDQUFQO0FBQ0QsR0FGRCxDQUVFLE9BQU9DLEtBQVAsRUFBYztBQUNkLFVBQU1DLFVBQVUsR0FBR1osVUFBVSxDQUFDTSxRQUFYLENBQW9CSyxLQUFLLENBQUNFLE9BQTFCLENBQW5COztBQUNBLFFBQUlELFVBQUosRUFBZ0I7QUFDZCxZQUFNLElBQUk1SCxLQUFKLENBQVUsdUNBQVYsQ0FBTjtBQUNEOztBQUNELFVBQU0ySCxLQUFOO0FBQ0Q7QUFDRixDQVZNLEMiLCJmaWxlIjoiL3BhY2thZ2VzL2Vqc29uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgaXNGdW5jdGlvbixcbiAgaXNPYmplY3QsXG4gIGtleXNPZixcbiAgbGVuZ3RoT2YsXG4gIGhhc093bixcbiAgY29udmVydE1hcFRvT2JqZWN0LFxuICBpc0FyZ3VtZW50cyxcbiAgaXNJbmZPck5hTixcbiAgaGFuZGxlRXJyb3IsXG59IGZyb20gJy4vdXRpbHMnO1xuXG4vKipcbiAqIEBuYW1lc3BhY2VcbiAqIEBzdW1tYXJ5IE5hbWVzcGFjZSBmb3IgRUpTT04gZnVuY3Rpb25zXG4gKi9cbmNvbnN0IEVKU09OID0ge307XG5cbi8vIEN1c3RvbSB0eXBlIGludGVyZmFjZSBkZWZpbml0aW9uXG4vKipcbiAqIEBjbGFzcyBDdXN0b21UeXBlXG4gKiBAaW5zdGFuY2VOYW1lIGN1c3RvbVR5cGVcbiAqIEBtZW1iZXJPZiBFSlNPTlxuICogQHN1bW1hcnkgVGhlIGludGVyZmFjZSB0aGF0IGEgY2xhc3MgbXVzdCBzYXRpc2Z5IHRvIGJlIGFibGUgdG8gYmVjb21lIGFuXG4gKiBFSlNPTiBjdXN0b20gdHlwZSB2aWEgRUpTT04uYWRkVHlwZS5cbiAqL1xuXG4vKipcbiAqIEBmdW5jdGlvbiB0eXBlTmFtZVxuICogQG1lbWJlck9mIEVKU09OLkN1c3RvbVR5cGVcbiAqIEBzdW1tYXJ5IFJldHVybiB0aGUgdGFnIHVzZWQgdG8gaWRlbnRpZnkgdGhpcyB0eXBlLiAgVGhpcyBtdXN0IG1hdGNoIHRoZVxuICogICAgICAgICAgdGFnIHVzZWQgdG8gcmVnaXN0ZXIgdGhpcyB0eXBlIHdpdGhcbiAqICAgICAgICAgIFtgRUpTT04uYWRkVHlwZWBdKCNlanNvbl9hZGRfdHlwZSkuXG4gKiBAbG9jdXMgQW55d2hlcmVcbiAqIEBpbnN0YW5jZVxuICovXG5cbi8qKlxuICogQGZ1bmN0aW9uIHRvSlNPTlZhbHVlXG4gKiBAbWVtYmVyT2YgRUpTT04uQ3VzdG9tVHlwZVxuICogQHN1bW1hcnkgU2VyaWFsaXplIHRoaXMgaW5zdGFuY2UgaW50byBhIEpTT04tY29tcGF0aWJsZSB2YWx1ZS5cbiAqIEBsb2N1cyBBbnl3aGVyZVxuICogQGluc3RhbmNlXG4gKi9cblxuLyoqXG4gKiBAZnVuY3Rpb24gY2xvbmVcbiAqIEBtZW1iZXJPZiBFSlNPTi5DdXN0b21UeXBlXG4gKiBAc3VtbWFyeSBSZXR1cm4gYSB2YWx1ZSBgcmAgc3VjaCB0aGF0IGB0aGlzLmVxdWFscyhyKWAgaXMgdHJ1ZSwgYW5kXG4gKiAgICAgICAgICBtb2RpZmljYXRpb25zIHRvIGByYCBkbyBub3QgYWZmZWN0IGB0aGlzYCBhbmQgdmljZSB2ZXJzYS5cbiAqIEBsb2N1cyBBbnl3aGVyZVxuICogQGluc3RhbmNlXG4gKi9cblxuLyoqXG4gKiBAZnVuY3Rpb24gZXF1YWxzXG4gKiBAbWVtYmVyT2YgRUpTT04uQ3VzdG9tVHlwZVxuICogQHN1bW1hcnkgUmV0dXJuIGB0cnVlYCBpZiBgb3RoZXJgIGhhcyBhIHZhbHVlIGVxdWFsIHRvIGB0aGlzYDsgYGZhbHNlYFxuICogICAgICAgICAgb3RoZXJ3aXNlLlxuICogQGxvY3VzIEFueXdoZXJlXG4gKiBAcGFyYW0ge09iamVjdH0gb3RoZXIgQW5vdGhlciBvYmplY3QgdG8gY29tcGFyZSB0aGlzIHRvLlxuICogQGluc3RhbmNlXG4gKi9cblxuY29uc3QgY3VzdG9tVHlwZXMgPSBuZXcgTWFwKCk7XG5cbi8vIEFkZCBhIGN1c3RvbSB0eXBlLCB1c2luZyBhIG1ldGhvZCBvZiB5b3VyIGNob2ljZSB0byBnZXQgdG8gYW5kXG4vLyBmcm9tIGEgYmFzaWMgSlNPTi1hYmxlIHJlcHJlc2VudGF0aW9uLiAgVGhlIGZhY3RvcnkgYXJndW1lbnRcbi8vIGlzIGEgZnVuY3Rpb24gb2YgSlNPTi1hYmxlIC0tPiB5b3VyIG9iamVjdFxuLy8gVGhlIHR5cGUgeW91IGFkZCBtdXN0IGhhdmU6XG4vLyAtIEEgdG9KU09OVmFsdWUoKSBtZXRob2QsIHNvIHRoYXQgTWV0ZW9yIGNhbiBzZXJpYWxpemUgaXRcbi8vIC0gYSB0eXBlTmFtZSgpIG1ldGhvZCwgdG8gc2hvdyBob3cgdG8gbG9vayBpdCB1cCBpbiBvdXIgdHlwZSB0YWJsZS5cbi8vIEl0IGlzIG9rYXkgaWYgdGhlc2UgbWV0aG9kcyBhcmUgbW9ua2V5LXBhdGNoZWQgb24uXG4vLyBFSlNPTi5jbG9uZSB3aWxsIHVzZSB0b0pTT05WYWx1ZSBhbmQgdGhlIGdpdmVuIGZhY3RvcnkgdG8gcHJvZHVjZVxuLy8gYSBjbG9uZSwgYnV0IHlvdSBtYXkgc3BlY2lmeSBhIG1ldGhvZCBjbG9uZSgpIHRoYXQgd2lsbCBiZVxuLy8gdXNlZCBpbnN0ZWFkLlxuLy8gU2ltaWxhcmx5LCBFSlNPTi5lcXVhbHMgd2lsbCB1c2UgdG9KU09OVmFsdWUgdG8gbWFrZSBjb21wYXJpc29ucyxcbi8vIGJ1dCB5b3UgbWF5IHByb3ZpZGUgYSBtZXRob2QgZXF1YWxzKCkgaW5zdGVhZC5cbi8qKlxuICogQHN1bW1hcnkgQWRkIGEgY3VzdG9tIGRhdGF0eXBlIHRvIEVKU09OLlxuICogQGxvY3VzIEFueXdoZXJlXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBBIHRhZyBmb3IgeW91ciBjdXN0b20gdHlwZTsgbXVzdCBiZSB1bmlxdWUgYW1vbmdcbiAqICAgICAgICAgICAgICAgICAgICAgIGN1c3RvbSBkYXRhIHR5cGVzIGRlZmluZWQgaW4geW91ciBwcm9qZWN0LCBhbmQgbXVzdFxuICogICAgICAgICAgICAgICAgICAgICAgbWF0Y2ggdGhlIHJlc3VsdCBvZiB5b3VyIHR5cGUncyBgdHlwZU5hbWVgIG1ldGhvZC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZhY3RvcnkgQSBmdW5jdGlvbiB0aGF0IGRlc2VyaWFsaXplcyBhIEpTT04tY29tcGF0aWJsZVxuICogICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSBpbnRvIGFuIGluc3RhbmNlIG9mIHlvdXIgdHlwZS4gIFRoaXMgc2hvdWxkXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoIHRoZSBzZXJpYWxpemF0aW9uIHBlcmZvcm1lZCBieSB5b3VyXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGUncyBgdG9KU09OVmFsdWVgIG1ldGhvZC5cbiAqL1xuRUpTT04uYWRkVHlwZSA9IChuYW1lLCBmYWN0b3J5KSA9PiB7XG4gIGlmIChjdXN0b21UeXBlcy5oYXMobmFtZSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFR5cGUgJHtuYW1lfSBhbHJlYWR5IHByZXNlbnRgKTtcbiAgfVxuICBjdXN0b21UeXBlcy5zZXQobmFtZSwgZmFjdG9yeSk7XG59O1xuXG5jb25zdCBidWlsdGluQ29udmVydGVycyA9IFtcbiAgeyAvLyBEYXRlXG4gICAgbWF0Y2hKU09OVmFsdWUob2JqKSB7XG4gICAgICByZXR1cm4gaGFzT3duKG9iaiwgJyRkYXRlJykgJiYgbGVuZ3RoT2Yob2JqKSA9PT0gMTtcbiAgICB9LFxuICAgIG1hdGNoT2JqZWN0KG9iaikge1xuICAgICAgcmV0dXJuIG9iaiBpbnN0YW5jZW9mIERhdGU7XG4gICAgfSxcbiAgICB0b0pTT05WYWx1ZShvYmopIHtcbiAgICAgIHJldHVybiB7JGRhdGU6IG9iai5nZXRUaW1lKCl9O1xuICAgIH0sXG4gICAgZnJvbUpTT05WYWx1ZShvYmopIHtcbiAgICAgIHJldHVybiBuZXcgRGF0ZShvYmouJGRhdGUpO1xuICAgIH0sXG4gIH0sXG4gIHsgLy8gUmVnRXhwXG4gICAgbWF0Y2hKU09OVmFsdWUob2JqKSB7XG4gICAgICByZXR1cm4gaGFzT3duKG9iaiwgJyRyZWdleHAnKVxuICAgICAgICAmJiBoYXNPd24ob2JqLCAnJGZsYWdzJylcbiAgICAgICAgJiYgbGVuZ3RoT2Yob2JqKSA9PT0gMjtcbiAgICB9LFxuICAgIG1hdGNoT2JqZWN0KG9iaikge1xuICAgICAgcmV0dXJuIG9iaiBpbnN0YW5jZW9mIFJlZ0V4cDtcbiAgICB9LFxuICAgIHRvSlNPTlZhbHVlKHJlZ2V4cCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgJHJlZ2V4cDogcmVnZXhwLnNvdXJjZSxcbiAgICAgICAgJGZsYWdzOiByZWdleHAuZmxhZ3NcbiAgICAgIH07XG4gICAgfSxcbiAgICBmcm9tSlNPTlZhbHVlKG9iaikge1xuICAgICAgLy8gUmVwbGFjZXMgZHVwbGljYXRlIC8gaW52YWxpZCBmbGFncy5cbiAgICAgIHJldHVybiBuZXcgUmVnRXhwKFxuICAgICAgICBvYmouJHJlZ2V4cCxcbiAgICAgICAgb2JqLiRmbGFnc1xuICAgICAgICAgIC8vIEN1dCBvZmYgZmxhZ3MgYXQgNTAgY2hhcnMgdG8gYXZvaWQgYWJ1c2luZyBSZWdFeHAgZm9yIERPUy5cbiAgICAgICAgICAuc2xpY2UoMCwgNTApXG4gICAgICAgICAgLnJlcGxhY2UoL1teZ2ltdXldL2csJycpXG4gICAgICAgICAgLnJlcGxhY2UoLyguKSg/PS4qXFwxKS9nLCAnJylcbiAgICAgICk7XG4gICAgfSxcbiAgfSxcbiAgeyAvLyBOYU4sIEluZiwgLUluZi4gKFRoZXNlIGFyZSB0aGUgb25seSBvYmplY3RzIHdpdGggdHlwZW9mICE9PSAnb2JqZWN0J1xuICAgIC8vIHdoaWNoIHdlIG1hdGNoLilcbiAgICBtYXRjaEpTT05WYWx1ZShvYmopIHtcbiAgICAgIHJldHVybiBoYXNPd24ob2JqLCAnJEluZk5hTicpICYmIGxlbmd0aE9mKG9iaikgPT09IDE7XG4gICAgfSxcbiAgICBtYXRjaE9iamVjdDogaXNJbmZPck5hTixcbiAgICB0b0pTT05WYWx1ZShvYmopIHtcbiAgICAgIGxldCBzaWduO1xuICAgICAgaWYgKE51bWJlci5pc05hTihvYmopKSB7XG4gICAgICAgIHNpZ24gPSAwO1xuICAgICAgfSBlbHNlIGlmIChvYmogPT09IEluZmluaXR5KSB7XG4gICAgICAgIHNpZ24gPSAxO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2lnbiA9IC0xO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHskSW5mTmFOOiBzaWdufTtcbiAgICB9LFxuICAgIGZyb21KU09OVmFsdWUob2JqKSB7XG4gICAgICByZXR1cm4gb2JqLiRJbmZOYU4gLyAwO1xuICAgIH0sXG4gIH0sXG4gIHsgLy8gQmluYXJ5XG4gICAgbWF0Y2hKU09OVmFsdWUob2JqKSB7XG4gICAgICByZXR1cm4gaGFzT3duKG9iaiwgJyRiaW5hcnknKSAmJiBsZW5ndGhPZihvYmopID09PSAxO1xuICAgIH0sXG4gICAgbWF0Y2hPYmplY3Qob2JqKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIFVpbnQ4QXJyYXkgIT09ICd1bmRlZmluZWQnICYmIG9iaiBpbnN0YW5jZW9mIFVpbnQ4QXJyYXlcbiAgICAgICAgfHwgKG9iaiAmJiBoYXNPd24ob2JqLCAnJFVpbnQ4QXJyYXlQb2x5ZmlsbCcpKTtcbiAgICB9LFxuICAgIHRvSlNPTlZhbHVlKG9iaikge1xuICAgICAgcmV0dXJuIHskYmluYXJ5OiBCYXNlNjQuZW5jb2RlKG9iail9O1xuICAgIH0sXG4gICAgZnJvbUpTT05WYWx1ZShvYmopIHtcbiAgICAgIHJldHVybiBCYXNlNjQuZGVjb2RlKG9iai4kYmluYXJ5KTtcbiAgICB9LFxuICB9LFxuICB7IC8vIEVzY2FwaW5nIG9uZSBsZXZlbFxuICAgIG1hdGNoSlNPTlZhbHVlKG9iaikge1xuICAgICAgcmV0dXJuIGhhc093bihvYmosICckZXNjYXBlJykgJiYgbGVuZ3RoT2Yob2JqKSA9PT0gMTtcbiAgICB9LFxuICAgIG1hdGNoT2JqZWN0KG9iaikge1xuICAgICAgbGV0IG1hdGNoID0gZmFsc2U7XG4gICAgICBpZiAob2JqKSB7XG4gICAgICAgIGNvbnN0IGtleUNvdW50ID0gbGVuZ3RoT2Yob2JqKTtcbiAgICAgICAgaWYgKGtleUNvdW50ID09PSAxIHx8IGtleUNvdW50ID09PSAyKSB7XG4gICAgICAgICAgbWF0Y2ggPVxuICAgICAgICAgICAgYnVpbHRpbkNvbnZlcnRlcnMuc29tZShjb252ZXJ0ZXIgPT4gY29udmVydGVyLm1hdGNoSlNPTlZhbHVlKG9iaikpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbWF0Y2g7XG4gICAgfSxcbiAgICB0b0pTT05WYWx1ZShvYmopIHtcbiAgICAgIGNvbnN0IG5ld09iaiA9IHt9O1xuICAgICAga2V5c09mKG9iaikuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICBuZXdPYmpba2V5XSA9IEVKU09OLnRvSlNPTlZhbHVlKG9ialtrZXldKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHskZXNjYXBlOiBuZXdPYmp9O1xuICAgIH0sXG4gICAgZnJvbUpTT05WYWx1ZShvYmopIHtcbiAgICAgIGNvbnN0IG5ld09iaiA9IHt9O1xuICAgICAga2V5c09mKG9iai4kZXNjYXBlKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgIG5ld09ialtrZXldID0gRUpTT04uZnJvbUpTT05WYWx1ZShvYmouJGVzY2FwZVtrZXldKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIG5ld09iajtcbiAgICB9LFxuICB9LFxuICB7IC8vIEN1c3RvbVxuICAgIG1hdGNoSlNPTlZhbHVlKG9iaikge1xuICAgICAgcmV0dXJuIGhhc093bihvYmosICckdHlwZScpXG4gICAgICAgICYmIGhhc093bihvYmosICckdmFsdWUnKSAmJiBsZW5ndGhPZihvYmopID09PSAyO1xuICAgIH0sXG4gICAgbWF0Y2hPYmplY3Qob2JqKSB7XG4gICAgICByZXR1cm4gRUpTT04uX2lzQ3VzdG9tVHlwZShvYmopO1xuICAgIH0sXG4gICAgdG9KU09OVmFsdWUob2JqKSB7XG4gICAgICBjb25zdCBqc29uVmFsdWUgPSBNZXRlb3IuX25vWWllbGRzQWxsb3dlZCgoKSA9PiBvYmoudG9KU09OVmFsdWUoKSk7XG4gICAgICByZXR1cm4geyR0eXBlOiBvYmoudHlwZU5hbWUoKSwgJHZhbHVlOiBqc29uVmFsdWV9O1xuICAgIH0sXG4gICAgZnJvbUpTT05WYWx1ZShvYmopIHtcbiAgICAgIGNvbnN0IHR5cGVOYW1lID0gb2JqLiR0eXBlO1xuICAgICAgaWYgKCFjdXN0b21UeXBlcy5oYXModHlwZU5hbWUpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQ3VzdG9tIEVKU09OIHR5cGUgJHt0eXBlTmFtZX0gaXMgbm90IGRlZmluZWRgKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGNvbnZlcnRlciA9IGN1c3RvbVR5cGVzLmdldCh0eXBlTmFtZSk7XG4gICAgICByZXR1cm4gTWV0ZW9yLl9ub1lpZWxkc0FsbG93ZWQoKCkgPT4gY29udmVydGVyKG9iai4kdmFsdWUpKTtcbiAgICB9LFxuICB9LFxuXTtcblxuRUpTT04uX2lzQ3VzdG9tVHlwZSA9IChvYmopID0+IChcbiAgb2JqICYmXG4gIGlzRnVuY3Rpb24ob2JqLnRvSlNPTlZhbHVlKSAmJlxuICBpc0Z1bmN0aW9uKG9iai50eXBlTmFtZSkgJiZcbiAgY3VzdG9tVHlwZXMuaGFzKG9iai50eXBlTmFtZSgpKVxuKTtcblxuRUpTT04uX2dldFR5cGVzID0gKGlzT3JpZ2luYWwgPSBmYWxzZSkgPT4gKGlzT3JpZ2luYWwgPyBjdXN0b21UeXBlcyA6IGNvbnZlcnRNYXBUb09iamVjdChjdXN0b21UeXBlcykpO1xuXG5FSlNPTi5fZ2V0Q29udmVydGVycyA9ICgpID0+IGJ1aWx0aW5Db252ZXJ0ZXJzO1xuXG4vLyBFaXRoZXIgcmV0dXJuIHRoZSBKU09OLWNvbXBhdGlibGUgdmVyc2lvbiBvZiB0aGUgYXJndW1lbnQsIG9yIHVuZGVmaW5lZCAoaWZcbi8vIHRoZSBpdGVtIGlzbid0IGl0c2VsZiByZXBsYWNlYWJsZSwgYnV0IG1heWJlIHNvbWUgZmllbGRzIGluIGl0IGFyZSlcbmNvbnN0IHRvSlNPTlZhbHVlSGVscGVyID0gaXRlbSA9PiB7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYnVpbHRpbkNvbnZlcnRlcnMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBjb252ZXJ0ZXIgPSBidWlsdGluQ29udmVydGVyc1tpXTtcbiAgICBpZiAoY29udmVydGVyLm1hdGNoT2JqZWN0KGl0ZW0pKSB7XG4gICAgICByZXR1cm4gY29udmVydGVyLnRvSlNPTlZhbHVlKGl0ZW0pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufTtcblxuLy8gZm9yIGJvdGggYXJyYXlzIGFuZCBvYmplY3RzLCBpbi1wbGFjZSBtb2RpZmljYXRpb24uXG5jb25zdCBhZGp1c3RUeXBlc1RvSlNPTlZhbHVlID0gb2JqID0+IHtcbiAgLy8gSXMgaXQgYW4gYXRvbSB0aGF0IHdlIG5lZWQgdG8gYWRqdXN0P1xuICBpZiAob2JqID09PSBudWxsKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBjb25zdCBtYXliZUNoYW5nZWQgPSB0b0pTT05WYWx1ZUhlbHBlcihvYmopO1xuICBpZiAobWF5YmVDaGFuZ2VkICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gbWF5YmVDaGFuZ2VkO1xuICB9XG5cbiAgLy8gT3RoZXIgYXRvbXMgYXJlIHVuY2hhbmdlZC5cbiAgaWYgKCFpc09iamVjdChvYmopKSB7XG4gICAgcmV0dXJuIG9iajtcbiAgfVxuXG4gIC8vIEl0ZXJhdGUgb3ZlciBhcnJheSBvciBvYmplY3Qgc3RydWN0dXJlLlxuICBrZXlzT2Yob2JqKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgY29uc3QgdmFsdWUgPSBvYmpba2V5XTtcbiAgICBpZiAoIWlzT2JqZWN0KHZhbHVlKSAmJiB2YWx1ZSAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgICFpc0luZk9yTmFOKHZhbHVlKSkge1xuICAgICAgcmV0dXJuOyAvLyBjb250aW51ZVxuICAgIH1cblxuICAgIGNvbnN0IGNoYW5nZWQgPSB0b0pTT05WYWx1ZUhlbHBlcih2YWx1ZSk7XG4gICAgaWYgKGNoYW5nZWQpIHtcbiAgICAgIG9ialtrZXldID0gY2hhbmdlZDtcbiAgICAgIHJldHVybjsgLy8gb24gdG8gdGhlIG5leHQga2V5XG4gICAgfVxuICAgIC8vIGlmIHdlIGdldCBoZXJlLCB2YWx1ZSBpcyBhbiBvYmplY3QgYnV0IG5vdCBhZGp1c3RhYmxlXG4gICAgLy8gYXQgdGhpcyBsZXZlbC4gIHJlY3Vyc2UuXG4gICAgYWRqdXN0VHlwZXNUb0pTT05WYWx1ZSh2YWx1ZSk7XG4gIH0pO1xuICByZXR1cm4gb2JqO1xufTtcblxuRUpTT04uX2FkanVzdFR5cGVzVG9KU09OVmFsdWUgPSBhZGp1c3RUeXBlc1RvSlNPTlZhbHVlO1xuXG4vKipcbiAqIEBzdW1tYXJ5IFNlcmlhbGl6ZSBhbiBFSlNPTi1jb21wYXRpYmxlIHZhbHVlIGludG8gaXRzIHBsYWluIEpTT05cbiAqICAgICAgICAgIHJlcHJlc2VudGF0aW9uLlxuICogQGxvY3VzIEFueXdoZXJlXG4gKiBAcGFyYW0ge0VKU09OfSB2YWwgQSB2YWx1ZSB0byBzZXJpYWxpemUgdG8gcGxhaW4gSlNPTi5cbiAqL1xuRUpTT04udG9KU09OVmFsdWUgPSBpdGVtID0+IHtcbiAgY29uc3QgY2hhbmdlZCA9IHRvSlNPTlZhbHVlSGVscGVyKGl0ZW0pO1xuICBpZiAoY2hhbmdlZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGNoYW5nZWQ7XG4gIH1cblxuICBsZXQgbmV3SXRlbSA9IGl0ZW07XG4gIGlmIChpc09iamVjdChpdGVtKSkge1xuICAgIG5ld0l0ZW0gPSBFSlNPTi5jbG9uZShpdGVtKTtcbiAgICBhZGp1c3RUeXBlc1RvSlNPTlZhbHVlKG5ld0l0ZW0pO1xuICB9XG4gIHJldHVybiBuZXdJdGVtO1xufTtcblxuLy8gRWl0aGVyIHJldHVybiB0aGUgYXJndW1lbnQgY2hhbmdlZCB0byBoYXZlIHRoZSBub24tanNvblxuLy8gcmVwIG9mIGl0c2VsZiAodGhlIE9iamVjdCB2ZXJzaW9uKSBvciB0aGUgYXJndW1lbnQgaXRzZWxmLlxuLy8gRE9FUyBOT1QgUkVDVVJTRS4gIEZvciBhY3R1YWxseSBnZXR0aW5nIHRoZSBmdWxseS1jaGFuZ2VkIHZhbHVlLCB1c2Vcbi8vIEVKU09OLmZyb21KU09OVmFsdWVcbmNvbnN0IGZyb21KU09OVmFsdWVIZWxwZXIgPSB2YWx1ZSA9PiB7XG4gIGlmIChpc09iamVjdCh2YWx1ZSkgJiYgdmFsdWUgIT09IG51bGwpIHtcbiAgICBjb25zdCBrZXlzID0ga2V5c09mKHZhbHVlKTtcbiAgICBpZiAoa2V5cy5sZW5ndGggPD0gMlxuICAgICAgICAmJiBrZXlzLmV2ZXJ5KGsgPT4gdHlwZW9mIGsgPT09ICdzdHJpbmcnICYmIGsuc3Vic3RyKDAsIDEpID09PSAnJCcpKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJ1aWx0aW5Db252ZXJ0ZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGNvbnZlcnRlciA9IGJ1aWx0aW5Db252ZXJ0ZXJzW2ldO1xuICAgICAgICBpZiAoY29udmVydGVyLm1hdGNoSlNPTlZhbHVlKHZhbHVlKSkge1xuICAgICAgICAgIHJldHVybiBjb252ZXJ0ZXIuZnJvbUpTT05WYWx1ZSh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHZhbHVlO1xufTtcblxuLy8gZm9yIGJvdGggYXJyYXlzIGFuZCBvYmplY3RzLiBUcmllcyBpdHMgYmVzdCB0byBqdXN0XG4vLyB1c2UgdGhlIG9iamVjdCB5b3UgaGFuZCBpdCwgYnV0IG1heSByZXR1cm4gc29tZXRoaW5nXG4vLyBkaWZmZXJlbnQgaWYgdGhlIG9iamVjdCB5b3UgaGFuZCBpdCBpdHNlbGYgbmVlZHMgY2hhbmdpbmcuXG5jb25zdCBhZGp1c3RUeXBlc0Zyb21KU09OVmFsdWUgPSBvYmogPT4ge1xuICBpZiAob2JqID09PSBudWxsKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBjb25zdCBtYXliZUNoYW5nZWQgPSBmcm9tSlNPTlZhbHVlSGVscGVyKG9iaik7XG4gIGlmIChtYXliZUNoYW5nZWQgIT09IG9iaikge1xuICAgIHJldHVybiBtYXliZUNoYW5nZWQ7XG4gIH1cblxuICAvLyBPdGhlciBhdG9tcyBhcmUgdW5jaGFuZ2VkLlxuICBpZiAoIWlzT2JqZWN0KG9iaikpIHtcbiAgICByZXR1cm4gb2JqO1xuICB9XG5cbiAga2V5c09mKG9iaikuZm9yRWFjaChrZXkgPT4ge1xuICAgIGNvbnN0IHZhbHVlID0gb2JqW2tleV07XG4gICAgaWYgKGlzT2JqZWN0KHZhbHVlKSkge1xuICAgICAgY29uc3QgY2hhbmdlZCA9IGZyb21KU09OVmFsdWVIZWxwZXIodmFsdWUpO1xuICAgICAgaWYgKHZhbHVlICE9PSBjaGFuZ2VkKSB7XG4gICAgICAgIG9ialtrZXldID0gY2hhbmdlZDtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgLy8gaWYgd2UgZ2V0IGhlcmUsIHZhbHVlIGlzIGFuIG9iamVjdCBidXQgbm90IGFkanVzdGFibGVcbiAgICAgIC8vIGF0IHRoaXMgbGV2ZWwuICByZWN1cnNlLlxuICAgICAgYWRqdXN0VHlwZXNGcm9tSlNPTlZhbHVlKHZhbHVlKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gb2JqO1xufTtcblxuRUpTT04uX2FkanVzdFR5cGVzRnJvbUpTT05WYWx1ZSA9IGFkanVzdFR5cGVzRnJvbUpTT05WYWx1ZTtcblxuLyoqXG4gKiBAc3VtbWFyeSBEZXNlcmlhbGl6ZSBhbiBFSlNPTiB2YWx1ZSBmcm9tIGl0cyBwbGFpbiBKU09OIHJlcHJlc2VudGF0aW9uLlxuICogQGxvY3VzIEFueXdoZXJlXG4gKiBAcGFyYW0ge0pTT05Db21wYXRpYmxlfSB2YWwgQSB2YWx1ZSB0byBkZXNlcmlhbGl6ZSBpbnRvIEVKU09OLlxuICovXG5FSlNPTi5mcm9tSlNPTlZhbHVlID0gaXRlbSA9PiB7XG4gIGxldCBjaGFuZ2VkID0gZnJvbUpTT05WYWx1ZUhlbHBlcihpdGVtKTtcbiAgaWYgKGNoYW5nZWQgPT09IGl0ZW0gJiYgaXNPYmplY3QoaXRlbSkpIHtcbiAgICBjaGFuZ2VkID0gRUpTT04uY2xvbmUoaXRlbSk7XG4gICAgYWRqdXN0VHlwZXNGcm9tSlNPTlZhbHVlKGNoYW5nZWQpO1xuICB9XG4gIHJldHVybiBjaGFuZ2VkO1xufTtcblxuLyoqXG4gKiBAc3VtbWFyeSBTZXJpYWxpemUgYSB2YWx1ZSB0byBhIHN0cmluZy4gRm9yIEVKU09OIHZhbHVlcywgdGhlIHNlcmlhbGl6YXRpb25cbiAqICAgICAgICAgIGZ1bGx5IHJlcHJlc2VudHMgdGhlIHZhbHVlLiBGb3Igbm9uLUVKU09OIHZhbHVlcywgc2VyaWFsaXplcyB0aGVcbiAqICAgICAgICAgIHNhbWUgd2F5IGFzIGBKU09OLnN0cmluZ2lmeWAuXG4gKiBAbG9jdXMgQW55d2hlcmVcbiAqIEBwYXJhbSB7RUpTT059IHZhbCBBIHZhbHVlIHRvIHN0cmluZ2lmeS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc11cbiAqIEBwYXJhbSB7Qm9vbGVhbiB8IEludGVnZXIgfCBTdHJpbmd9IG9wdGlvbnMuaW5kZW50IEluZGVudHMgb2JqZWN0cyBhbmRcbiAqIGFycmF5cyBmb3IgZWFzeSByZWFkYWJpbGl0eS4gIFdoZW4gYHRydWVgLCBpbmRlbnRzIGJ5IDIgc3BhY2VzOyB3aGVuIGFuXG4gKiBpbnRlZ2VyLCBpbmRlbnRzIGJ5IHRoYXQgbnVtYmVyIG9mIHNwYWNlczsgYW5kIHdoZW4gYSBzdHJpbmcsIHVzZXMgdGhlXG4gKiBzdHJpbmcgYXMgdGhlIGluZGVudGF0aW9uIHBhdHRlcm4uXG4gKiBAcGFyYW0ge0Jvb2xlYW59IG9wdGlvbnMuY2Fub25pY2FsIFdoZW4gYHRydWVgLCBzdHJpbmdpZmllcyBrZXlzIGluIGFuXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdCBpbiBzb3J0ZWQgb3JkZXIuXG4gKi9cbkVKU09OLnN0cmluZ2lmeSA9IGhhbmRsZUVycm9yKChpdGVtLCBvcHRpb25zKSA9PiB7XG4gIGxldCBzZXJpYWxpemVkO1xuICBjb25zdCBqc29uID0gRUpTT04udG9KU09OVmFsdWUoaXRlbSk7XG4gIGlmIChvcHRpb25zICYmIChvcHRpb25zLmNhbm9uaWNhbCB8fCBvcHRpb25zLmluZGVudCkpIHtcbiAgICBpbXBvcnQgY2Fub25pY2FsU3RyaW5naWZ5IGZyb20gJy4vc3RyaW5naWZ5JztcbiAgICBzZXJpYWxpemVkID0gY2Fub25pY2FsU3RyaW5naWZ5KGpzb24sIG9wdGlvbnMpO1xuICB9IGVsc2Uge1xuICAgIHNlcmlhbGl6ZWQgPSBKU09OLnN0cmluZ2lmeShqc29uKTtcbiAgfVxuICByZXR1cm4gc2VyaWFsaXplZDtcbn0pO1xuXG4vKipcbiAqIEBzdW1tYXJ5IFBhcnNlIGEgc3RyaW5nIGludG8gYW4gRUpTT04gdmFsdWUuIFRocm93cyBhbiBlcnJvciBpZiB0aGUgc3RyaW5nXG4gKiAgICAgICAgICBpcyBub3QgdmFsaWQgRUpTT04uXG4gKiBAbG9jdXMgQW55d2hlcmVcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgQSBzdHJpbmcgdG8gcGFyc2UgaW50byBhbiBFSlNPTiB2YWx1ZS5cbiAqL1xuRUpTT04ucGFyc2UgPSBpdGVtID0+IHtcbiAgaWYgKHR5cGVvZiBpdGVtICE9PSAnc3RyaW5nJykge1xuICAgIHRocm93IG5ldyBFcnJvcignRUpTT04ucGFyc2UgYXJndW1lbnQgc2hvdWxkIGJlIGEgc3RyaW5nJyk7XG4gIH1cbiAgcmV0dXJuIEVKU09OLmZyb21KU09OVmFsdWUoSlNPTi5wYXJzZShpdGVtKSk7XG59O1xuXG4vKipcbiAqIEBzdW1tYXJ5IFJldHVybnMgdHJ1ZSBpZiBgeGAgaXMgYSBidWZmZXIgb2YgYmluYXJ5IGRhdGEsIGFzIHJldHVybmVkIGZyb21cbiAqICAgICAgICAgIFtgRUpTT04ubmV3QmluYXJ5YF0oI2Vqc29uX25ld19iaW5hcnkpLlxuICogQHBhcmFtIHtPYmplY3R9IHggVGhlIHZhcmlhYmxlIHRvIGNoZWNrLlxuICogQGxvY3VzIEFueXdoZXJlXG4gKi9cbkVKU09OLmlzQmluYXJ5ID0gb2JqID0+IHtcbiAgcmV0dXJuICEhKCh0eXBlb2YgVWludDhBcnJheSAhPT0gJ3VuZGVmaW5lZCcgJiYgb2JqIGluc3RhbmNlb2YgVWludDhBcnJheSkgfHxcbiAgICAob2JqICYmIG9iai4kVWludDhBcnJheVBvbHlmaWxsKSk7XG59O1xuXG4vKipcbiAqIEBzdW1tYXJ5IFJldHVybiB0cnVlIGlmIGBhYCBhbmQgYGJgIGFyZSBlcXVhbCB0byBlYWNoIG90aGVyLiAgUmV0dXJuIGZhbHNlXG4gKiAgICAgICAgICBvdGhlcndpc2UuICBVc2VzIHRoZSBgZXF1YWxzYCBtZXRob2Qgb24gYGFgIGlmIHByZXNlbnQsIG90aGVyd2lzZVxuICogICAgICAgICAgcGVyZm9ybXMgYSBkZWVwIGNvbXBhcmlzb24uXG4gKiBAbG9jdXMgQW55d2hlcmVcbiAqIEBwYXJhbSB7RUpTT059IGFcbiAqIEBwYXJhbSB7RUpTT059IGJcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc11cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gb3B0aW9ucy5rZXlPcmRlclNlbnNpdGl2ZSBDb21wYXJlIGluIGtleSBzZW5zaXRpdmUgb3JkZXIsXG4gKiBpZiBzdXBwb3J0ZWQgYnkgdGhlIEphdmFTY3JpcHQgaW1wbGVtZW50YXRpb24uICBGb3IgZXhhbXBsZSwgYHthOiAxLCBiOiAyfWBcbiAqIGlzIGVxdWFsIHRvIGB7YjogMiwgYTogMX1gIG9ubHkgd2hlbiBga2V5T3JkZXJTZW5zaXRpdmVgIGlzIGBmYWxzZWAuICBUaGVcbiAqIGRlZmF1bHQgaXMgYGZhbHNlYC5cbiAqL1xuRUpTT04uZXF1YWxzID0gKGEsIGIsIG9wdGlvbnMpID0+IHtcbiAgbGV0IGk7XG4gIGNvbnN0IGtleU9yZGVyU2Vuc2l0aXZlID0gISEob3B0aW9ucyAmJiBvcHRpb25zLmtleU9yZGVyU2Vuc2l0aXZlKTtcbiAgaWYgKGEgPT09IGIpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8vIFRoaXMgZGlmZmVycyBmcm9tIHRoZSBJRUVFIHNwZWMgZm9yIE5hTiBlcXVhbGl0eSwgYi9jIHdlIGRvbid0IHdhbnRcbiAgLy8gYW55dGhpbmcgZXZlciB3aXRoIGEgTmFOIHRvIGJlIHBvaXNvbmVkIGZyb20gYmVjb21pbmcgZXF1YWwgdG8gYW55dGhpbmcuXG4gIGlmIChOdW1iZXIuaXNOYU4oYSkgJiYgTnVtYmVyLmlzTmFOKGIpKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvLyBpZiBlaXRoZXIgb25lIGlzIGZhbHN5LCB0aGV5J2QgaGF2ZSB0byBiZSA9PT0gdG8gYmUgZXF1YWxcbiAgaWYgKCFhIHx8ICFiKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKCEoaXNPYmplY3QoYSkgJiYgaXNPYmplY3QoYikpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKGEgaW5zdGFuY2VvZiBEYXRlICYmIGIgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgcmV0dXJuIGEudmFsdWVPZigpID09PSBiLnZhbHVlT2YoKTtcbiAgfVxuXG4gIGlmIChFSlNPTi5pc0JpbmFyeShhKSAmJiBFSlNPTi5pc0JpbmFyeShiKSkge1xuICAgIGlmIChhLmxlbmd0aCAhPT0gYi5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgZm9yIChpID0gMDsgaSA8IGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChhW2ldICE9PSBiW2ldKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBpZiAoaXNGdW5jdGlvbihhLmVxdWFscykpIHtcbiAgICByZXR1cm4gYS5lcXVhbHMoYiwgb3B0aW9ucyk7XG4gIH1cblxuICBpZiAoaXNGdW5jdGlvbihiLmVxdWFscykpIHtcbiAgICByZXR1cm4gYi5lcXVhbHMoYSwgb3B0aW9ucyk7XG4gIH1cblxuICBpZiAoYSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgaWYgKCEoYiBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAoYS5sZW5ndGggIT09IGIubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGZvciAoaSA9IDA7IGkgPCBhLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoIUVKU09OLmVxdWFscyhhW2ldLCBiW2ldLCBvcHRpb25zKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLy8gZmFsbGJhY2sgZm9yIGN1c3RvbSB0eXBlcyB0aGF0IGRvbid0IGltcGxlbWVudCB0aGVpciBvd24gZXF1YWxzXG4gIHN3aXRjaCAoRUpTT04uX2lzQ3VzdG9tVHlwZShhKSArIEVKU09OLl9pc0N1c3RvbVR5cGUoYikpIHtcbiAgICBjYXNlIDE6IHJldHVybiBmYWxzZTtcbiAgICBjYXNlIDI6IHJldHVybiBFSlNPTi5lcXVhbHMoRUpTT04udG9KU09OVmFsdWUoYSksIEVKU09OLnRvSlNPTlZhbHVlKGIpKTtcbiAgICBkZWZhdWx0OiAvLyBEbyBub3RoaW5nXG4gIH1cblxuICAvLyBmYWxsIGJhY2sgdG8gc3RydWN0dXJhbCBlcXVhbGl0eSBvZiBvYmplY3RzXG4gIGxldCByZXQ7XG4gIGNvbnN0IGFLZXlzID0ga2V5c09mKGEpO1xuICBjb25zdCBiS2V5cyA9IGtleXNPZihiKTtcbiAgaWYgKGtleU9yZGVyU2Vuc2l0aXZlKSB7XG4gICAgaSA9IDA7XG4gICAgcmV0ID0gYUtleXMuZXZlcnkoa2V5ID0+IHtcbiAgICAgIGlmIChpID49IGJLZXlzLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAoa2V5ICE9PSBiS2V5c1tpXSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAoIUVKU09OLmVxdWFscyhhW2tleV0sIGJbYktleXNbaV1dLCBvcHRpb25zKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBpKys7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBpID0gMDtcbiAgICByZXQgPSBhS2V5cy5ldmVyeShrZXkgPT4ge1xuICAgICAgaWYgKCFoYXNPd24oYiwga2V5KSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAoIUVKU09OLmVxdWFscyhhW2tleV0sIGJba2V5XSwgb3B0aW9ucykpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgaSsrO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIHJldCAmJiBpID09PSBiS2V5cy5sZW5ndGg7XG59O1xuXG4vKipcbiAqIEBzdW1tYXJ5IFJldHVybiBhIGRlZXAgY29weSBvZiBgdmFsYC5cbiAqIEBsb2N1cyBBbnl3aGVyZVxuICogQHBhcmFtIHtFSlNPTn0gdmFsIEEgdmFsdWUgdG8gY29weS5cbiAqL1xuRUpTT04uY2xvbmUgPSB2ID0+IHtcbiAgbGV0IHJldDtcbiAgaWYgKCFpc09iamVjdCh2KSkge1xuICAgIHJldHVybiB2O1xuICB9XG5cbiAgaWYgKHYgPT09IG51bGwpIHtcbiAgICByZXR1cm4gbnVsbDsgLy8gbnVsbCBoYXMgdHlwZW9mIFwib2JqZWN0XCJcbiAgfVxuXG4gIGlmICh2IGluc3RhbmNlb2YgRGF0ZSkge1xuICAgIHJldHVybiBuZXcgRGF0ZSh2LmdldFRpbWUoKSk7XG4gIH1cblxuICAvLyBSZWdFeHBzIGFyZSBub3QgcmVhbGx5IEVKU09OIGVsZW1lbnRzIChlZyB3ZSBkb24ndCBkZWZpbmUgYSBzZXJpYWxpemF0aW9uXG4gIC8vIGZvciB0aGVtKSwgYnV0IHRoZXkncmUgaW1tdXRhYmxlIGFueXdheSwgc28gd2UgY2FuIHN1cHBvcnQgdGhlbSBpbiBjbG9uZS5cbiAgaWYgKHYgaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICByZXR1cm4gdjtcbiAgfVxuXG4gIGlmIChFSlNPTi5pc0JpbmFyeSh2KSkge1xuICAgIHJldCA9IEVKU09OLm5ld0JpbmFyeSh2Lmxlbmd0aCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2Lmxlbmd0aDsgaSsrKSB7XG4gICAgICByZXRbaV0gPSB2W2ldO1xuICAgIH1cbiAgICByZXR1cm4gcmV0O1xuICB9XG5cbiAgaWYgKEFycmF5LmlzQXJyYXkodikpIHtcbiAgICByZXR1cm4gdi5tYXAoRUpTT04uY2xvbmUpO1xuICB9XG5cbiAgaWYgKGlzQXJndW1lbnRzKHYpKSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20odikubWFwKEVKU09OLmNsb25lKTtcbiAgfVxuXG4gIC8vIGhhbmRsZSBnZW5lcmFsIHVzZXItZGVmaW5lZCB0eXBlZCBPYmplY3RzIGlmIHRoZXkgaGF2ZSBhIGNsb25lIG1ldGhvZFxuICBpZiAoaXNGdW5jdGlvbih2LmNsb25lKSkge1xuICAgIHJldHVybiB2LmNsb25lKCk7XG4gIH1cblxuICAvLyBoYW5kbGUgb3RoZXIgY3VzdG9tIHR5cGVzXG4gIGlmIChFSlNPTi5faXNDdXN0b21UeXBlKHYpKSB7XG4gICAgcmV0dXJuIEVKU09OLmZyb21KU09OVmFsdWUoRUpTT04uY2xvbmUoRUpTT04udG9KU09OVmFsdWUodikpLCB0cnVlKTtcbiAgfVxuXG4gIC8vIGhhbmRsZSBvdGhlciBvYmplY3RzXG4gIHJldCA9IHt9O1xuICBrZXlzT2YodikuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgcmV0W2tleV0gPSBFSlNPTi5jbG9uZSh2W2tleV0pO1xuICB9KTtcbiAgcmV0dXJuIHJldDtcbn07XG5cbi8qKlxuICogQHN1bW1hcnkgQWxsb2NhdGUgYSBuZXcgYnVmZmVyIG9mIGJpbmFyeSBkYXRhIHRoYXQgRUpTT04gY2FuIHNlcmlhbGl6ZS5cbiAqIEBsb2N1cyBBbnl3aGVyZVxuICogQHBhcmFtIHtOdW1iZXJ9IHNpemUgVGhlIG51bWJlciBvZiBieXRlcyBvZiBiaW5hcnkgZGF0YSB0byBhbGxvY2F0ZS5cbiAqL1xuLy8gRUpTT04ubmV3QmluYXJ5IGlzIHRoZSBwdWJsaWMgZG9jdW1lbnRlZCBBUEkgZm9yIHRoaXMgZnVuY3Rpb25hbGl0eSxcbi8vIGJ1dCB0aGUgaW1wbGVtZW50YXRpb24gaXMgaW4gdGhlICdiYXNlNjQnIHBhY2thZ2UgdG8gYXZvaWRcbi8vIGludHJvZHVjaW5nIGEgY2lyY3VsYXIgZGVwZW5kZW5jeS4gKElmIHRoZSBpbXBsZW1lbnRhdGlvbiB3ZXJlIGhlcmUsXG4vLyB0aGVuICdiYXNlNjQnIHdvdWxkIGhhdmUgdG8gdXNlIEVKU09OLm5ld0JpbmFyeSwgYW5kICdlanNvbicgd291bGRcbi8vIGFsc28gaGF2ZSB0byB1c2UgJ2Jhc2U2NCcuKVxuRUpTT04ubmV3QmluYXJ5ID0gQmFzZTY0Lm5ld0JpbmFyeTtcblxuZXhwb3J0IHsgRUpTT04gfTtcbiIsIi8vIEJhc2VkIG9uIGpzb24yLmpzIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL2RvdWdsYXNjcm9ja2ZvcmQvSlNPTi1qc1xuLy9cbi8vICAgIGpzb24yLmpzXG4vLyAgICAyMDEyLTEwLTA4XG4vL1xuLy8gICAgUHVibGljIERvbWFpbi5cbi8vXG4vLyAgICBOTyBXQVJSQU5UWSBFWFBSRVNTRUQgT1IgSU1QTElFRC4gVVNFIEFUIFlPVVIgT1dOIFJJU0suXG5cbmZ1bmN0aW9uIHF1b3RlKHN0cmluZykge1xuICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoc3RyaW5nKTtcbn1cblxuY29uc3Qgc3RyID0gKGtleSwgaG9sZGVyLCBzaW5nbGVJbmRlbnQsIG91dGVySW5kZW50LCBjYW5vbmljYWwpID0+IHtcbiAgY29uc3QgdmFsdWUgPSBob2xkZXJba2V5XTtcblxuICAvLyBXaGF0IGhhcHBlbnMgbmV4dCBkZXBlbmRzIG9uIHRoZSB2YWx1ZSdzIHR5cGUuXG4gIHN3aXRjaCAodHlwZW9mIHZhbHVlKSB7XG4gIGNhc2UgJ3N0cmluZyc6XG4gICAgcmV0dXJuIHF1b3RlKHZhbHVlKTtcbiAgY2FzZSAnbnVtYmVyJzpcbiAgICAvLyBKU09OIG51bWJlcnMgbXVzdCBiZSBmaW5pdGUuIEVuY29kZSBub24tZmluaXRlIG51bWJlcnMgYXMgbnVsbC5cbiAgICByZXR1cm4gaXNGaW5pdGUodmFsdWUpID8gU3RyaW5nKHZhbHVlKSA6ICdudWxsJztcbiAgY2FzZSAnYm9vbGVhbic6XG4gICAgcmV0dXJuIFN0cmluZyh2YWx1ZSk7XG4gIC8vIElmIHRoZSB0eXBlIGlzICdvYmplY3QnLCB3ZSBtaWdodCBiZSBkZWFsaW5nIHdpdGggYW4gb2JqZWN0IG9yIGFuIGFycmF5IG9yXG4gIC8vIG51bGwuXG4gIGNhc2UgJ29iamVjdCc6IHtcbiAgICAvLyBEdWUgdG8gYSBzcGVjaWZpY2F0aW9uIGJsdW5kZXIgaW4gRUNNQVNjcmlwdCwgdHlwZW9mIG51bGwgaXMgJ29iamVjdCcsXG4gICAgLy8gc28gd2F0Y2ggb3V0IGZvciB0aGF0IGNhc2UuXG4gICAgaWYgKCF2YWx1ZSkge1xuICAgICAgcmV0dXJuICdudWxsJztcbiAgICB9XG4gICAgLy8gTWFrZSBhbiBhcnJheSB0byBob2xkIHRoZSBwYXJ0aWFsIHJlc3VsdHMgb2Ygc3RyaW5naWZ5aW5nIHRoaXMgb2JqZWN0XG4gICAgLy8gdmFsdWUuXG4gICAgY29uc3QgaW5uZXJJbmRlbnQgPSBvdXRlckluZGVudCArIHNpbmdsZUluZGVudDtcbiAgICBjb25zdCBwYXJ0aWFsID0gW107XG4gICAgbGV0IHY7XG5cbiAgICAvLyBJcyB0aGUgdmFsdWUgYW4gYXJyYXk/XG4gICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpIHx8ICh7fSkuaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgJ2NhbGxlZScpKSB7XG4gICAgICAvLyBUaGUgdmFsdWUgaXMgYW4gYXJyYXkuIFN0cmluZ2lmeSBldmVyeSBlbGVtZW50LiBVc2UgbnVsbCBhcyBhXG4gICAgICAvLyBwbGFjZWhvbGRlciBmb3Igbm9uLUpTT04gdmFsdWVzLlxuICAgICAgY29uc3QgbGVuZ3RoID0gdmFsdWUubGVuZ3RoO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBwYXJ0aWFsW2ldID1cbiAgICAgICAgICBzdHIoaSwgdmFsdWUsIHNpbmdsZUluZGVudCwgaW5uZXJJbmRlbnQsIGNhbm9uaWNhbCkgfHwgJ251bGwnO1xuICAgICAgfVxuXG4gICAgICAvLyBKb2luIGFsbCBvZiB0aGUgZWxlbWVudHMgdG9nZXRoZXIsIHNlcGFyYXRlZCB3aXRoIGNvbW1hcywgYW5kIHdyYXBcbiAgICAgIC8vIHRoZW0gaW4gYnJhY2tldHMuXG4gICAgICBpZiAocGFydGlhbC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgdiA9ICdbXSc7XG4gICAgICB9IGVsc2UgaWYgKGlubmVySW5kZW50KSB7XG4gICAgICAgIHYgPSAnW1xcbicgK1xuICAgICAgICAgIGlubmVySW5kZW50ICtcbiAgICAgICAgICBwYXJ0aWFsLmpvaW4oJyxcXG4nICtcbiAgICAgICAgICBpbm5lckluZGVudCkgK1xuICAgICAgICAgICdcXG4nICtcbiAgICAgICAgICBvdXRlckluZGVudCArXG4gICAgICAgICAgJ10nO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdiA9ICdbJyArIHBhcnRpYWwuam9pbignLCcpICsgJ10nO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHY7XG4gICAgfVxuXG4gICAgLy8gSXRlcmF0ZSB0aHJvdWdoIGFsbCBvZiB0aGUga2V5cyBpbiB0aGUgb2JqZWN0LlxuICAgIGxldCBrZXlzID0gT2JqZWN0LmtleXModmFsdWUpO1xuICAgIGlmIChjYW5vbmljYWwpIHtcbiAgICAgIGtleXMgPSBrZXlzLnNvcnQoKTtcbiAgICB9XG4gICAga2V5cy5mb3JFYWNoKGsgPT4ge1xuICAgICAgdiA9IHN0cihrLCB2YWx1ZSwgc2luZ2xlSW5kZW50LCBpbm5lckluZGVudCwgY2Fub25pY2FsKTtcbiAgICAgIGlmICh2KSB7XG4gICAgICAgIHBhcnRpYWwucHVzaChxdW90ZShrKSArIChpbm5lckluZGVudCA/ICc6ICcgOiAnOicpICsgdik7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBKb2luIGFsbCBvZiB0aGUgbWVtYmVyIHRleHRzIHRvZ2V0aGVyLCBzZXBhcmF0ZWQgd2l0aCBjb21tYXMsXG4gICAgLy8gYW5kIHdyYXAgdGhlbSBpbiBicmFjZXMuXG4gICAgaWYgKHBhcnRpYWwubGVuZ3RoID09PSAwKSB7XG4gICAgICB2ID0gJ3t9JztcbiAgICB9IGVsc2UgaWYgKGlubmVySW5kZW50KSB7XG4gICAgICB2ID0gJ3tcXG4nICtcbiAgICAgICAgaW5uZXJJbmRlbnQgK1xuICAgICAgICBwYXJ0aWFsLmpvaW4oJyxcXG4nICtcbiAgICAgICAgaW5uZXJJbmRlbnQpICtcbiAgICAgICAgJ1xcbicgK1xuICAgICAgICBvdXRlckluZGVudCArXG4gICAgICAgICd9JztcbiAgICB9IGVsc2Uge1xuICAgICAgdiA9ICd7JyArIHBhcnRpYWwuam9pbignLCcpICsgJ30nO1xuICAgIH1cbiAgICByZXR1cm4gdjtcbiAgfVxuXG4gIGRlZmF1bHQ6IC8vIERvIG5vdGhpbmdcbiAgfVxufTtcblxuLy8gSWYgdGhlIEpTT04gb2JqZWN0IGRvZXMgbm90IHlldCBoYXZlIGEgc3RyaW5naWZ5IG1ldGhvZCwgZ2l2ZSBpdCBvbmUuXG5jb25zdCBjYW5vbmljYWxTdHJpbmdpZnkgPSAodmFsdWUsIG9wdGlvbnMpID0+IHtcbiAgLy8gTWFrZSBhIGZha2Ugcm9vdCBvYmplY3QgY29udGFpbmluZyBvdXIgdmFsdWUgdW5kZXIgdGhlIGtleSBvZiAnJy5cbiAgLy8gUmV0dXJuIHRoZSByZXN1bHQgb2Ygc3RyaW5naWZ5aW5nIHRoZSB2YWx1ZS5cbiAgY29uc3QgYWxsT3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe1xuICAgIGluZGVudDogJycsXG4gICAgY2Fub25pY2FsOiBmYWxzZSxcbiAgfSwgb3B0aW9ucyk7XG4gIGlmIChhbGxPcHRpb25zLmluZGVudCA9PT0gdHJ1ZSkge1xuICAgIGFsbE9wdGlvbnMuaW5kZW50ID0gJyAgJztcbiAgfSBlbHNlIGlmICh0eXBlb2YgYWxsT3B0aW9ucy5pbmRlbnQgPT09ICdudW1iZXInKSB7XG4gICAgbGV0IG5ld0luZGVudCA9ICcnO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYWxsT3B0aW9ucy5pbmRlbnQ7IGkrKykge1xuICAgICAgbmV3SW5kZW50ICs9ICcgJztcbiAgICB9XG4gICAgYWxsT3B0aW9ucy5pbmRlbnQgPSBuZXdJbmRlbnQ7XG4gIH1cbiAgcmV0dXJuIHN0cignJywgeycnOiB2YWx1ZX0sIGFsbE9wdGlvbnMuaW5kZW50LCAnJywgYWxsT3B0aW9ucy5jYW5vbmljYWwpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY2Fub25pY2FsU3RyaW5naWZ5O1xuIiwiZXhwb3J0IGNvbnN0IGlzRnVuY3Rpb24gPSAoZm4pID0+IHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJztcblxuZXhwb3J0IGNvbnN0IGlzT2JqZWN0ID0gKGZuKSA9PiB0eXBlb2YgZm4gPT09ICdvYmplY3QnO1xuXG5leHBvcnQgY29uc3Qga2V5c09mID0gKG9iaikgPT4gT2JqZWN0LmtleXMob2JqKTtcblxuZXhwb3J0IGNvbnN0IGxlbmd0aE9mID0gKG9iaikgPT4gT2JqZWN0LmtleXMob2JqKS5sZW5ndGg7XG5cbmV4cG9ydCBjb25zdCBoYXNPd24gPSAob2JqLCBwcm9wKSA9PiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTtcblxuZXhwb3J0IGNvbnN0IGNvbnZlcnRNYXBUb09iamVjdCA9IChtYXApID0+IEFycmF5LmZyb20obWFwKS5yZWR1Y2UoKGFjYywgW2tleSwgdmFsdWVdKSA9PiB7XG4gIC8vIHJlYXNzaWduIHRvIG5vdCBjcmVhdGUgbmV3IG9iamVjdFxuICBhY2Nba2V5XSA9IHZhbHVlO1xuICByZXR1cm4gYWNjO1xufSwge30pO1xuXG5leHBvcnQgY29uc3QgaXNBcmd1bWVudHMgPSBvYmogPT4gb2JqICE9IG51bGwgJiYgaGFzT3duKG9iaiwgJ2NhbGxlZScpO1xuXG5leHBvcnQgY29uc3QgaXNJbmZPck5hTiA9XG4gIG9iaiA9PiBOdW1iZXIuaXNOYU4ob2JqKSB8fCBvYmogPT09IEluZmluaXR5IHx8IG9iaiA9PT0gLUluZmluaXR5O1xuXG5leHBvcnQgY29uc3QgY2hlY2tFcnJvciA9IHtcbiAgbWF4U3RhY2s6IChtc2dFcnJvcikgPT4gbmV3IFJlZ0V4cCgnTWF4aW11bSBjYWxsIHN0YWNrIHNpemUgZXhjZWVkZWQnLCAnZycpLnRlc3QobXNnRXJyb3IpLFxufTtcblxuZXhwb3J0IGNvbnN0IGhhbmRsZUVycm9yID0gKGZuKSA9PiBmdW5jdGlvbigpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zdCBpc01heFN0YWNrID0gY2hlY2tFcnJvci5tYXhTdGFjayhlcnJvci5tZXNzYWdlKTtcbiAgICBpZiAoaXNNYXhTdGFjaykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDb252ZXJ0aW5nIGNpcmN1bGFyIHN0cnVjdHVyZSB0byBKU09OJylcbiAgICB9XG4gICAgdGhyb3cgZXJyb3I7XG4gIH1cbn07XG4iXX0=
