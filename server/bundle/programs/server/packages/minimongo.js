(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var DiffSequence = Package['diff-sequence'].DiffSequence;
var ECMAScript = Package.ecmascript.ECMAScript;
var EJSON = Package.ejson.EJSON;
var GeoJSON = Package['geojson-utils'].GeoJSON;
var IdMap = Package['id-map'].IdMap;
var MongoID = Package['mongo-id'].MongoID;
var OrderedDict = Package['ordered-dict'].OrderedDict;
var Random = Package.random.Random;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var meteorInstall = Package.modules.meteorInstall;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var operand, selectorValue, MinimongoTest, MinimongoError, selector, doc, callback, options, oldResults, a, b, LocalCollection, Minimongo;

var require = meteorInstall({"node_modules":{"meteor":{"minimongo":{"minimongo_server.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/minimongo/minimongo_server.js                                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.link("./minimongo_common.js");
let hasOwn, isNumericKey, isOperatorObject, pathsToTree, projectionDetails;
module.link("./common.js", {
  hasOwn(v) {
    hasOwn = v;
  },

  isNumericKey(v) {
    isNumericKey = v;
  },

  isOperatorObject(v) {
    isOperatorObject = v;
  },

  pathsToTree(v) {
    pathsToTree = v;
  },

  projectionDetails(v) {
    projectionDetails = v;
  }

}, 0);

Minimongo._pathsElidingNumericKeys = paths => paths.map(path => path.split('.').filter(part => !isNumericKey(part)).join('.')); // Returns true if the modifier applied to some document may change the result
// of matching the document by selector
// The modifier is always in a form of Object:
//  - $set
//    - 'a.b.22.z': value
//    - 'foo.bar': 42
//  - $unset
//    - 'abc.d': 1


Minimongo.Matcher.prototype.affectedByModifier = function (modifier) {
  // safe check for $set/$unset being objects
  modifier = Object.assign({
    $set: {},
    $unset: {}
  }, modifier);

  const meaningfulPaths = this._getPaths();

  const modifiedPaths = [].concat(Object.keys(modifier.$set), Object.keys(modifier.$unset));
  return modifiedPaths.some(path => {
    const mod = path.split('.');
    return meaningfulPaths.some(meaningfulPath => {
      const sel = meaningfulPath.split('.');
      let i = 0,
          j = 0;

      while (i < sel.length && j < mod.length) {
        if (isNumericKey(sel[i]) && isNumericKey(mod[j])) {
          // foo.4.bar selector affected by foo.4 modifier
          // foo.3.bar selector unaffected by foo.4 modifier
          if (sel[i] === mod[j]) {
            i++;
            j++;
          } else {
            return false;
          }
        } else if (isNumericKey(sel[i])) {
          // foo.4.bar selector unaffected by foo.bar modifier
          return false;
        } else if (isNumericKey(mod[j])) {
          j++;
        } else if (sel[i] === mod[j]) {
          i++;
          j++;
        } else {
          return false;
        }
      } // One is a prefix of another, taking numeric fields into account


      return true;
    });
  });
}; // @param modifier - Object: MongoDB-styled modifier with `$set`s and `$unsets`
//                           only. (assumed to come from oplog)
// @returns - Boolean: if after applying the modifier, selector can start
//                     accepting the modified value.
// NOTE: assumes that document affected by modifier didn't match this Matcher
// before, so if modifier can't convince selector in a positive change it would
// stay 'false'.
// Currently doesn't support $-operators and numeric indices precisely.


Minimongo.Matcher.prototype.canBecomeTrueByModifier = function (modifier) {
  if (!this.affectedByModifier(modifier)) {
    return false;
  }

  if (!this.isSimple()) {
    return true;
  }

  modifier = Object.assign({
    $set: {},
    $unset: {}
  }, modifier);
  const modifierPaths = [].concat(Object.keys(modifier.$set), Object.keys(modifier.$unset));

  if (this._getPaths().some(pathHasNumericKeys) || modifierPaths.some(pathHasNumericKeys)) {
    return true;
  } // check if there is a $set or $unset that indicates something is an
  // object rather than a scalar in the actual object where we saw $-operator
  // NOTE: it is correct since we allow only scalars in $-operators
  // Example: for selector {'a.b': {$gt: 5}} the modifier {'a.b.c':7} would
  // definitely set the result to false as 'a.b' appears to be an object.


  const expectedScalarIsObject = Object.keys(this._selector).some(path => {
    if (!isOperatorObject(this._selector[path])) {
      return false;
    }

    return modifierPaths.some(modifierPath => modifierPath.startsWith("".concat(path, ".")));
  });

  if (expectedScalarIsObject) {
    return false;
  } // See if we can apply the modifier on the ideally matching object. If it
  // still matches the selector, then the modifier could have turned the real
  // object in the database into something matching.


  const matchingDocument = EJSON.clone(this.matchingDocument()); // The selector is too complex, anything can happen.

  if (matchingDocument === null) {
    return true;
  }

  try {
    LocalCollection._modify(matchingDocument, modifier);
  } catch (error) {
    // Couldn't set a property on a field which is a scalar or null in the
    // selector.
    // Example:
    // real document: { 'a.b': 3 }
    // selector: { 'a': 12 }
    // converted selector (ideal document): { 'a': 12 }
    // modifier: { $set: { 'a.b': 4 } }
    // We don't know what real document was like but from the error raised by
    // $set on a scalar field we can reason that the structure of real document
    // is completely different.
    if (error.name === 'MinimongoError' && error.setPropertyError) {
      return false;
    }

    throw error;
  }

  return this.documentMatches(matchingDocument).result;
}; // Knows how to combine a mongo selector and a fields projection to a new fields
// projection taking into account active fields from the passed selector.
// @returns Object - projection object (same as fields option of mongo cursor)


Minimongo.Matcher.prototype.combineIntoProjection = function (projection) {
  const selectorPaths = Minimongo._pathsElidingNumericKeys(this._getPaths()); // Special case for $where operator in the selector - projection should depend
  // on all fields of the document. getSelectorPaths returns a list of paths
  // selector depends on. If one of the paths is '' (empty string) representing
  // the root or the whole document, complete projection should be returned.


  if (selectorPaths.includes('')) {
    return {};
  }

  return combineImportantPathsIntoProjection(selectorPaths, projection);
}; // Returns an object that would match the selector if possible or null if the
// selector is too complex for us to analyze
// { 'a.b': { ans: 42 }, 'foo.bar': null, 'foo.baz': "something" }
// => { a: { b: { ans: 42 } }, foo: { bar: null, baz: "something" } }


Minimongo.Matcher.prototype.matchingDocument = function () {
  // check if it was computed before
  if (this._matchingDocument !== undefined) {
    return this._matchingDocument;
  } // If the analysis of this selector is too hard for our implementation
  // fallback to "YES"


  let fallback = false;
  this._matchingDocument = pathsToTree(this._getPaths(), path => {
    const valueSelector = this._selector[path];

    if (isOperatorObject(valueSelector)) {
      // if there is a strict equality, there is a good
      // chance we can use one of those as "matching"
      // dummy value
      if (valueSelector.$eq) {
        return valueSelector.$eq;
      }

      if (valueSelector.$in) {
        const matcher = new Minimongo.Matcher({
          placeholder: valueSelector
        }); // Return anything from $in that matches the whole selector for this
        // path. If nothing matches, returns `undefined` as nothing can make
        // this selector into `true`.

        return valueSelector.$in.find(placeholder => matcher.documentMatches({
          placeholder
        }).result);
      }

      if (onlyContainsKeys(valueSelector, ['$gt', '$gte', '$lt', '$lte'])) {
        let lowerBound = -Infinity;
        let upperBound = Infinity;
        ['$lte', '$lt'].forEach(op => {
          if (hasOwn.call(valueSelector, op) && valueSelector[op] < upperBound) {
            upperBound = valueSelector[op];
          }
        });
        ['$gte', '$gt'].forEach(op => {
          if (hasOwn.call(valueSelector, op) && valueSelector[op] > lowerBound) {
            lowerBound = valueSelector[op];
          }
        });
        const middle = (lowerBound + upperBound) / 2;
        const matcher = new Minimongo.Matcher({
          placeholder: valueSelector
        });

        if (!matcher.documentMatches({
          placeholder: middle
        }).result && (middle === lowerBound || middle === upperBound)) {
          fallback = true;
        }

        return middle;
      }

      if (onlyContainsKeys(valueSelector, ['$nin', '$ne'])) {
        // Since this._isSimple makes sure $nin and $ne are not combined with
        // objects or arrays, we can confidently return an empty object as it
        // never matches any scalar.
        return {};
      }

      fallback = true;
    }

    return this._selector[path];
  }, x => x);

  if (fallback) {
    this._matchingDocument = null;
  }

  return this._matchingDocument;
}; // Minimongo.Sorter gets a similar method, which delegates to a Matcher it made
// for this exact purpose.


Minimongo.Sorter.prototype.affectedByModifier = function (modifier) {
  return this._selectorForAffectedByModifier.affectedByModifier(modifier);
};

Minimongo.Sorter.prototype.combineIntoProjection = function (projection) {
  return combineImportantPathsIntoProjection(Minimongo._pathsElidingNumericKeys(this._getPaths()), projection);
};

function combineImportantPathsIntoProjection(paths, projection) {
  const details = projectionDetails(projection); // merge the paths to include

  const tree = pathsToTree(paths, path => true, (node, path, fullPath) => true, details.tree);
  const mergedProjection = treeToPaths(tree);

  if (details.including) {
    // both selector and projection are pointing on fields to include
    // so we can just return the merged tree
    return mergedProjection;
  } // selector is pointing at fields to include
  // projection is pointing at fields to exclude
  // make sure we don't exclude important paths


  const mergedExclProjection = {};
  Object.keys(mergedProjection).forEach(path => {
    if (!mergedProjection[path]) {
      mergedExclProjection[path] = false;
    }
  });
  return mergedExclProjection;
}

function getPaths(selector) {
  return Object.keys(new Minimongo.Matcher(selector)._paths); // XXX remove it?
  // return Object.keys(selector).map(k => {
  //   // we don't know how to handle $where because it can be anything
  //   if (k === '$where') {
  //     return ''; // matches everything
  //   }
  //   // we branch from $or/$and/$nor operator
  //   if (['$or', '$and', '$nor'].includes(k)) {
  //     return selector[k].map(getPaths);
  //   }
  //   // the value is a literal or some comparison operator
  //   return k;
  // })
  //   .reduce((a, b) => a.concat(b), [])
  //   .filter((a, b, c) => c.indexOf(a) === b);
} // A helper to ensure object has only certain keys


function onlyContainsKeys(obj, keys) {
  return Object.keys(obj).every(k => keys.includes(k));
}

function pathHasNumericKeys(path) {
  return path.split('.').some(isNumericKey);
} // Returns a set of key paths similar to
// { 'foo.bar': 1, 'a.b.c': 1 }


function treeToPaths(tree) {
  let prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  const result = {};
  Object.keys(tree).forEach(key => {
    const value = tree[key];

    if (value === Object(value)) {
      Object.assign(result, treeToPaths(value, "".concat(prefix + key, ".")));
    } else {
      result[prefix + key] = value;
    }
  });
  return result;
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"common.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/minimongo/common.js                                                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  hasOwn: () => hasOwn,
  ELEMENT_OPERATORS: () => ELEMENT_OPERATORS,
  compileDocumentSelector: () => compileDocumentSelector,
  equalityElementMatcher: () => equalityElementMatcher,
  expandArraysInBranches: () => expandArraysInBranches,
  isIndexable: () => isIndexable,
  isNumericKey: () => isNumericKey,
  isOperatorObject: () => isOperatorObject,
  makeLookupFunction: () => makeLookupFunction,
  nothingMatcher: () => nothingMatcher,
  pathsToTree: () => pathsToTree,
  populateDocumentWithQueryFields: () => populateDocumentWithQueryFields,
  projectionDetails: () => projectionDetails,
  regexpElementMatcher: () => regexpElementMatcher
});
let LocalCollection;
module.link("./local_collection.js", {
  default(v) {
    LocalCollection = v;
  }

}, 0);
const hasOwn = Object.prototype.hasOwnProperty;
const ELEMENT_OPERATORS = {
  $lt: makeInequality(cmpValue => cmpValue < 0),
  $gt: makeInequality(cmpValue => cmpValue > 0),
  $lte: makeInequality(cmpValue => cmpValue <= 0),
  $gte: makeInequality(cmpValue => cmpValue >= 0),
  $mod: {
    compileElementSelector(operand) {
      if (!(Array.isArray(operand) && operand.length === 2 && typeof operand[0] === 'number' && typeof operand[1] === 'number')) {
        throw Error('argument to $mod must be an array of two numbers');
      } // XXX could require to be ints or round or something


      const divisor = operand[0];
      const remainder = operand[1];
      return value => typeof value === 'number' && value % divisor === remainder;
    }

  },
  $in: {
    compileElementSelector(operand) {
      if (!Array.isArray(operand)) {
        throw Error('$in needs an array');
      }

      const elementMatchers = operand.map(option => {
        if (option instanceof RegExp) {
          return regexpElementMatcher(option);
        }

        if (isOperatorObject(option)) {
          throw Error('cannot nest $ under $in');
        }

        return equalityElementMatcher(option);
      });
      return value => {
        // Allow {a: {$in: [null]}} to match when 'a' does not exist.
        if (value === undefined) {
          value = null;
        }

        return elementMatchers.some(matcher => matcher(value));
      };
    }

  },
  $size: {
    // {a: [[5, 5]]} must match {a: {$size: 1}} but not {a: {$size: 2}}, so we
    // don't want to consider the element [5,5] in the leaf array [[5,5]] as a
    // possible value.
    dontExpandLeafArrays: true,

    compileElementSelector(operand) {
      if (typeof operand === 'string') {
        // Don't ask me why, but by experimentation, this seems to be what Mongo
        // does.
        operand = 0;
      } else if (typeof operand !== 'number') {
        throw Error('$size needs a number');
      }

      return value => Array.isArray(value) && value.length === operand;
    }

  },
  $type: {
    // {a: [5]} must not match {a: {$type: 4}} (4 means array), but it should
    // match {a: {$type: 1}} (1 means number), and {a: [[5]]} must match {$a:
    // {$type: 4}}. Thus, when we see a leaf array, we *should* expand it but
    // should *not* include it itself.
    dontIncludeLeafArrays: true,

    compileElementSelector(operand) {
      if (typeof operand === 'string') {
        const operandAliasMap = {
          'double': 1,
          'string': 2,
          'object': 3,
          'array': 4,
          'binData': 5,
          'undefined': 6,
          'objectId': 7,
          'bool': 8,
          'date': 9,
          'null': 10,
          'regex': 11,
          'dbPointer': 12,
          'javascript': 13,
          'symbol': 14,
          'javascriptWithScope': 15,
          'int': 16,
          'timestamp': 17,
          'long': 18,
          'decimal': 19,
          'minKey': -1,
          'maxKey': 127
        };

        if (!hasOwn.call(operandAliasMap, operand)) {
          throw Error("unknown string alias for $type: ".concat(operand));
        }

        operand = operandAliasMap[operand];
      } else if (typeof operand === 'number') {
        if (operand === 0 || operand < -1 || operand > 19 && operand !== 127) {
          throw Error("Invalid numerical $type code: ".concat(operand));
        }
      } else {
        throw Error('argument to $type is not a number or a string');
      }

      return value => value !== undefined && LocalCollection._f._type(value) === operand;
    }

  },
  $bitsAllSet: {
    compileElementSelector(operand) {
      const mask = getOperandBitmask(operand, '$bitsAllSet');
      return value => {
        const bitmask = getValueBitmask(value, mask.length);
        return bitmask && mask.every((byte, i) => (bitmask[i] & byte) === byte);
      };
    }

  },
  $bitsAnySet: {
    compileElementSelector(operand) {
      const mask = getOperandBitmask(operand, '$bitsAnySet');
      return value => {
        const bitmask = getValueBitmask(value, mask.length);
        return bitmask && mask.some((byte, i) => (~bitmask[i] & byte) !== byte);
      };
    }

  },
  $bitsAllClear: {
    compileElementSelector(operand) {
      const mask = getOperandBitmask(operand, '$bitsAllClear');
      return value => {
        const bitmask = getValueBitmask(value, mask.length);
        return bitmask && mask.every((byte, i) => !(bitmask[i] & byte));
      };
    }

  },
  $bitsAnyClear: {
    compileElementSelector(operand) {
      const mask = getOperandBitmask(operand, '$bitsAnyClear');
      return value => {
        const bitmask = getValueBitmask(value, mask.length);
        return bitmask && mask.some((byte, i) => (bitmask[i] & byte) !== byte);
      };
    }

  },
  $regex: {
    compileElementSelector(operand, valueSelector) {
      if (!(typeof operand === 'string' || operand instanceof RegExp)) {
        throw Error('$regex has to be a string or RegExp');
      }

      let regexp;

      if (valueSelector.$options !== undefined) {
        // Options passed in $options (even the empty string) always overrides
        // options in the RegExp object itself.
        // Be clear that we only support the JS-supported options, not extended
        // ones (eg, Mongo supports x and s). Ideally we would implement x and s
        // by transforming the regexp, but not today...
        if (/[^gim]/.test(valueSelector.$options)) {
          throw new Error('Only the i, m, and g regexp options are supported');
        }

        const source = operand instanceof RegExp ? operand.source : operand;
        regexp = new RegExp(source, valueSelector.$options);
      } else if (operand instanceof RegExp) {
        regexp = operand;
      } else {
        regexp = new RegExp(operand);
      }

      return regexpElementMatcher(regexp);
    }

  },
  $elemMatch: {
    dontExpandLeafArrays: true,

    compileElementSelector(operand, valueSelector, matcher) {
      if (!LocalCollection._isPlainObject(operand)) {
        throw Error('$elemMatch need an object');
      }

      const isDocMatcher = !isOperatorObject(Object.keys(operand).filter(key => !hasOwn.call(LOGICAL_OPERATORS, key)).reduce((a, b) => Object.assign(a, {
        [b]: operand[b]
      }), {}), true);
      let subMatcher;

      if (isDocMatcher) {
        // This is NOT the same as compileValueSelector(operand), and not just
        // because of the slightly different calling convention.
        // {$elemMatch: {x: 3}} means "an element has a field x:3", not
        // "consists only of a field x:3". Also, regexps and sub-$ are allowed.
        subMatcher = compileDocumentSelector(operand, matcher, {
          inElemMatch: true
        });
      } else {
        subMatcher = compileValueSelector(operand, matcher);
      }

      return value => {
        if (!Array.isArray(value)) {
          return false;
        }

        for (let i = 0; i < value.length; ++i) {
          const arrayElement = value[i];
          let arg;

          if (isDocMatcher) {
            // We can only match {$elemMatch: {b: 3}} against objects.
            // (We can also match against arrays, if there's numeric indices,
            // eg {$elemMatch: {'0.b': 3}} or {$elemMatch: {0: 3}}.)
            if (!isIndexable(arrayElement)) {
              return false;
            }

            arg = arrayElement;
          } else {
            // dontIterate ensures that {a: {$elemMatch: {$gt: 5}}} matches
            // {a: [8]} but not {a: [[8]]}
            arg = [{
              value: arrayElement,
              dontIterate: true
            }];
          } // XXX support $near in $elemMatch by propagating $distance?


          if (subMatcher(arg).result) {
            return i; // specially understood to mean "use as arrayIndices"
          }
        }

        return false;
      };
    }

  }
};
// Operators that appear at the top level of a document selector.
const LOGICAL_OPERATORS = {
  $and(subSelector, matcher, inElemMatch) {
    return andDocumentMatchers(compileArrayOfDocumentSelectors(subSelector, matcher, inElemMatch));
  },

  $or(subSelector, matcher, inElemMatch) {
    const matchers = compileArrayOfDocumentSelectors(subSelector, matcher, inElemMatch); // Special case: if there is only one matcher, use it directly, *preserving*
    // any arrayIndices it returns.

    if (matchers.length === 1) {
      return matchers[0];
    }

    return doc => {
      const result = matchers.some(fn => fn(doc).result); // $or does NOT set arrayIndices when it has multiple
      // sub-expressions. (Tested against MongoDB.)

      return {
        result
      };
    };
  },

  $nor(subSelector, matcher, inElemMatch) {
    const matchers = compileArrayOfDocumentSelectors(subSelector, matcher, inElemMatch);
    return doc => {
      const result = matchers.every(fn => !fn(doc).result); // Never set arrayIndices, because we only match if nothing in particular
      // 'matched' (and because this is consistent with MongoDB).

      return {
        result
      };
    };
  },

  $where(selectorValue, matcher) {
    // Record that *any* path may be used.
    matcher._recordPathUsed('');

    matcher._hasWhere = true;

    if (!(selectorValue instanceof Function)) {
      // XXX MongoDB seems to have more complex logic to decide where or or not
      // to add 'return'; not sure exactly what it is.
      selectorValue = Function('obj', "return ".concat(selectorValue));
    } // We make the document available as both `this` and `obj`.
    // // XXX not sure what we should do if this throws


    return doc => ({
      result: selectorValue.call(doc, doc)
    });
  },

  // This is just used as a comment in the query (in MongoDB, it also ends up in
  // query logs); it has no effect on the actual selection.
  $comment() {
    return () => ({
      result: true
    });
  }

}; // Operators that (unlike LOGICAL_OPERATORS) pertain to individual paths in a
// document, but (unlike ELEMENT_OPERATORS) do not have a simple definition as
// "match each branched value independently and combine with
// convertElementMatcherToBranchedMatcher".

const VALUE_OPERATORS = {
  $eq(operand) {
    return convertElementMatcherToBranchedMatcher(equalityElementMatcher(operand));
  },

  $not(operand, valueSelector, matcher) {
    return invertBranchedMatcher(compileValueSelector(operand, matcher));
  },

  $ne(operand) {
    return invertBranchedMatcher(convertElementMatcherToBranchedMatcher(equalityElementMatcher(operand)));
  },

  $nin(operand) {
    return invertBranchedMatcher(convertElementMatcherToBranchedMatcher(ELEMENT_OPERATORS.$in.compileElementSelector(operand)));
  },

  $exists(operand) {
    const exists = convertElementMatcherToBranchedMatcher(value => value !== undefined);
    return operand ? exists : invertBranchedMatcher(exists);
  },

  // $options just provides options for $regex; its logic is inside $regex
  $options(operand, valueSelector) {
    if (!hasOwn.call(valueSelector, '$regex')) {
      throw Error('$options needs a $regex');
    }

    return everythingMatcher;
  },

  // $maxDistance is basically an argument to $near
  $maxDistance(operand, valueSelector) {
    if (!valueSelector.$near) {
      throw Error('$maxDistance needs a $near');
    }

    return everythingMatcher;
  },

  $all(operand, valueSelector, matcher) {
    if (!Array.isArray(operand)) {
      throw Error('$all requires array');
    } // Not sure why, but this seems to be what MongoDB does.


    if (operand.length === 0) {
      return nothingMatcher;
    }

    const branchedMatchers = operand.map(criterion => {
      // XXX handle $all/$elemMatch combination
      if (isOperatorObject(criterion)) {
        throw Error('no $ expressions in $all');
      } // This is always a regexp or equality selector.


      return compileValueSelector(criterion, matcher);
    }); // andBranchedMatchers does NOT require all selectors to return true on the
    // SAME branch.

    return andBranchedMatchers(branchedMatchers);
  },

  $near(operand, valueSelector, matcher, isRoot) {
    if (!isRoot) {
      throw Error('$near can\'t be inside another $ operator');
    }

    matcher._hasGeoQuery = true; // There are two kinds of geodata in MongoDB: legacy coordinate pairs and
    // GeoJSON. They use different distance metrics, too. GeoJSON queries are
    // marked with a $geometry property, though legacy coordinates can be
    // matched using $geometry.

    let maxDistance, point, distance;

    if (LocalCollection._isPlainObject(operand) && hasOwn.call(operand, '$geometry')) {
      // GeoJSON "2dsphere" mode.
      maxDistance = operand.$maxDistance;
      point = operand.$geometry;

      distance = value => {
        // XXX: for now, we don't calculate the actual distance between, say,
        // polygon and circle. If people care about this use-case it will get
        // a priority.
        if (!value) {
          return null;
        }

        if (!value.type) {
          return GeoJSON.pointDistance(point, {
            type: 'Point',
            coordinates: pointToArray(value)
          });
        }

        if (value.type === 'Point') {
          return GeoJSON.pointDistance(point, value);
        }

        return GeoJSON.geometryWithinRadius(value, point, maxDistance) ? 0 : maxDistance + 1;
      };
    } else {
      maxDistance = valueSelector.$maxDistance;

      if (!isIndexable(operand)) {
        throw Error('$near argument must be coordinate pair or GeoJSON');
      }

      point = pointToArray(operand);

      distance = value => {
        if (!isIndexable(value)) {
          return null;
        }

        return distanceCoordinatePairs(point, value);
      };
    }

    return branchedValues => {
      // There might be multiple points in the document that match the given
      // field. Only one of them needs to be within $maxDistance, but we need to
      // evaluate all of them and use the nearest one for the implicit sort
      // specifier. (That's why we can't just use ELEMENT_OPERATORS here.)
      //
      // Note: This differs from MongoDB's implementation, where a document will
      // actually show up *multiple times* in the result set, with one entry for
      // each within-$maxDistance branching point.
      const result = {
        result: false
      };
      expandArraysInBranches(branchedValues).every(branch => {
        // if operation is an update, don't skip branches, just return the first
        // one (#3599)
        let curDistance;

        if (!matcher._isUpdate) {
          if (!(typeof branch.value === 'object')) {
            return true;
          }

          curDistance = distance(branch.value); // Skip branches that aren't real points or are too far away.

          if (curDistance === null || curDistance > maxDistance) {
            return true;
          } // Skip anything that's a tie.


          if (result.distance !== undefined && result.distance <= curDistance) {
            return true;
          }
        }

        result.result = true;
        result.distance = curDistance;

        if (branch.arrayIndices) {
          result.arrayIndices = branch.arrayIndices;
        } else {
          delete result.arrayIndices;
        }

        return !matcher._isUpdate;
      });
      return result;
    };
  }

}; // NB: We are cheating and using this function to implement 'AND' for both
// 'document matchers' and 'branched matchers'. They both return result objects
// but the argument is different: for the former it's a whole doc, whereas for
// the latter it's an array of 'branched values'.

function andSomeMatchers(subMatchers) {
  if (subMatchers.length === 0) {
    return everythingMatcher;
  }

  if (subMatchers.length === 1) {
    return subMatchers[0];
  }

  return docOrBranches => {
    const match = {};
    match.result = subMatchers.every(fn => {
      const subResult = fn(docOrBranches); // Copy a 'distance' number out of the first sub-matcher that has
      // one. Yes, this means that if there are multiple $near fields in a
      // query, something arbitrary happens; this appears to be consistent with
      // Mongo.

      if (subResult.result && subResult.distance !== undefined && match.distance === undefined) {
        match.distance = subResult.distance;
      } // Similarly, propagate arrayIndices from sub-matchers... but to match
      // MongoDB behavior, this time the *last* sub-matcher with arrayIndices
      // wins.


      if (subResult.result && subResult.arrayIndices) {
        match.arrayIndices = subResult.arrayIndices;
      }

      return subResult.result;
    }); // If we didn't actually match, forget any extra metadata we came up with.

    if (!match.result) {
      delete match.distance;
      delete match.arrayIndices;
    }

    return match;
  };
}

const andDocumentMatchers = andSomeMatchers;
const andBranchedMatchers = andSomeMatchers;

function compileArrayOfDocumentSelectors(selectors, matcher, inElemMatch) {
  if (!Array.isArray(selectors) || selectors.length === 0) {
    throw Error('$and/$or/$nor must be nonempty array');
  }

  return selectors.map(subSelector => {
    if (!LocalCollection._isPlainObject(subSelector)) {
      throw Error('$or/$and/$nor entries need to be full objects');
    }

    return compileDocumentSelector(subSelector, matcher, {
      inElemMatch
    });
  });
} // Takes in a selector that could match a full document (eg, the original
// selector). Returns a function mapping document->result object.
//
// matcher is the Matcher object we are compiling.
//
// If this is the root document selector (ie, not wrapped in $and or the like),
// then isRoot is true. (This is used by $near.)


function compileDocumentSelector(docSelector, matcher) {
  let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  const docMatchers = Object.keys(docSelector).map(key => {
    const subSelector = docSelector[key];

    if (key.substr(0, 1) === '$') {
      // Outer operators are either logical operators (they recurse back into
      // this function), or $where.
      if (!hasOwn.call(LOGICAL_OPERATORS, key)) {
        throw new Error("Unrecognized logical operator: ".concat(key));
      }

      matcher._isSimple = false;
      return LOGICAL_OPERATORS[key](subSelector, matcher, options.inElemMatch);
    } // Record this path, but only if we aren't in an elemMatcher, since in an
    // elemMatch this is a path inside an object in an array, not in the doc
    // root.


    if (!options.inElemMatch) {
      matcher._recordPathUsed(key);
    } // Don't add a matcher if subSelector is a function -- this is to match
    // the behavior of Meteor on the server (inherited from the node mongodb
    // driver), which is to ignore any part of a selector which is a function.


    if (typeof subSelector === 'function') {
      return undefined;
    }

    const lookUpByIndex = makeLookupFunction(key);
    const valueMatcher = compileValueSelector(subSelector, matcher, options.isRoot);
    return doc => valueMatcher(lookUpByIndex(doc));
  }).filter(Boolean);
  return andDocumentMatchers(docMatchers);
}

// Takes in a selector that could match a key-indexed value in a document; eg,
// {$gt: 5, $lt: 9}, or a regular expression, or any non-expression object (to
// indicate equality).  Returns a branched matcher: a function mapping
// [branched value]->result object.
function compileValueSelector(valueSelector, matcher, isRoot) {
  if (valueSelector instanceof RegExp) {
    matcher._isSimple = false;
    return convertElementMatcherToBranchedMatcher(regexpElementMatcher(valueSelector));
  }

  if (isOperatorObject(valueSelector)) {
    return operatorBranchedMatcher(valueSelector, matcher, isRoot);
  }

  return convertElementMatcherToBranchedMatcher(equalityElementMatcher(valueSelector));
} // Given an element matcher (which evaluates a single value), returns a branched
// value (which evaluates the element matcher on all the branches and returns a
// more structured return value possibly including arrayIndices).


function convertElementMatcherToBranchedMatcher(elementMatcher) {
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return branches => {
    const expanded = options.dontExpandLeafArrays ? branches : expandArraysInBranches(branches, options.dontIncludeLeafArrays);
    const match = {};
    match.result = expanded.some(element => {
      let matched = elementMatcher(element.value); // Special case for $elemMatch: it means "true, and use this as an array
      // index if I didn't already have one".

      if (typeof matched === 'number') {
        // XXX This code dates from when we only stored a single array index
        // (for the outermost array). Should we be also including deeper array
        // indices from the $elemMatch match?
        if (!element.arrayIndices) {
          element.arrayIndices = [matched];
        }

        matched = true;
      } // If some element matched, and it's tagged with array indices, include
      // those indices in our result object.


      if (matched && element.arrayIndices) {
        match.arrayIndices = element.arrayIndices;
      }

      return matched;
    });
    return match;
  };
} // Helpers for $near.


function distanceCoordinatePairs(a, b) {
  const pointA = pointToArray(a);
  const pointB = pointToArray(b);
  return Math.hypot(pointA[0] - pointB[0], pointA[1] - pointB[1]);
} // Takes something that is not an operator object and returns an element matcher
// for equality with that thing.


function equalityElementMatcher(elementSelector) {
  if (isOperatorObject(elementSelector)) {
    throw Error('Can\'t create equalityValueSelector for operator object');
  } // Special-case: null and undefined are equal (if you got undefined in there
  // somewhere, or if you got it due to some branch being non-existent in the
  // weird special case), even though they aren't with EJSON.equals.
  // undefined or null


  if (elementSelector == null) {
    return value => value == null;
  }

  return value => LocalCollection._f._equal(elementSelector, value);
}

function everythingMatcher(docOrBranchedValues) {
  return {
    result: true
  };
}

function expandArraysInBranches(branches, skipTheArrays) {
  const branchesOut = [];
  branches.forEach(branch => {
    const thisIsArray = Array.isArray(branch.value); // We include the branch itself, *UNLESS* we it's an array that we're going
    // to iterate and we're told to skip arrays.  (That's right, we include some
    // arrays even skipTheArrays is true: these are arrays that were found via
    // explicit numerical indices.)

    if (!(skipTheArrays && thisIsArray && !branch.dontIterate)) {
      branchesOut.push({
        arrayIndices: branch.arrayIndices,
        value: branch.value
      });
    }

    if (thisIsArray && !branch.dontIterate) {
      branch.value.forEach((value, i) => {
        branchesOut.push({
          arrayIndices: (branch.arrayIndices || []).concat(i),
          value
        });
      });
    }
  });
  return branchesOut;
}

// Helpers for $bitsAllSet/$bitsAnySet/$bitsAllClear/$bitsAnyClear.
function getOperandBitmask(operand, selector) {
  // numeric bitmask
  // You can provide a numeric bitmask to be matched against the operand field.
  // It must be representable as a non-negative 32-bit signed integer.
  // Otherwise, $bitsAllSet will return an error.
  if (Number.isInteger(operand) && operand >= 0) {
    return new Uint8Array(new Int32Array([operand]).buffer);
  } // bindata bitmask
  // You can also use an arbitrarily large BinData instance as a bitmask.


  if (EJSON.isBinary(operand)) {
    return new Uint8Array(operand.buffer);
  } // position list
  // If querying a list of bit positions, each <position> must be a non-negative
  // integer. Bit positions start at 0 from the least significant bit.


  if (Array.isArray(operand) && operand.every(x => Number.isInteger(x) && x >= 0)) {
    const buffer = new ArrayBuffer((Math.max(...operand) >> 3) + 1);
    const view = new Uint8Array(buffer);
    operand.forEach(x => {
      view[x >> 3] |= 1 << (x & 0x7);
    });
    return view;
  } // bad operand


  throw Error("operand to ".concat(selector, " must be a numeric bitmask (representable as a ") + 'non-negative 32-bit signed integer), a bindata bitmask or an array with ' + 'bit positions (non-negative integers)');
}

function getValueBitmask(value, length) {
  // The field value must be either numerical or a BinData instance. Otherwise,
  // $bits... will not match the current document.
  // numerical
  if (Number.isSafeInteger(value)) {
    // $bits... will not match numerical values that cannot be represented as a
    // signed 64-bit integer. This can be the case if a value is either too
    // large or small to fit in a signed 64-bit integer, or if it has a
    // fractional component.
    const buffer = new ArrayBuffer(Math.max(length, 2 * Uint32Array.BYTES_PER_ELEMENT));
    let view = new Uint32Array(buffer, 0, 2);
    view[0] = value % ((1 << 16) * (1 << 16)) | 0;
    view[1] = value / ((1 << 16) * (1 << 16)) | 0; // sign extension

    if (value < 0) {
      view = new Uint8Array(buffer, 2);
      view.forEach((byte, i) => {
        view[i] = 0xff;
      });
    }

    return new Uint8Array(buffer);
  } // bindata


  if (EJSON.isBinary(value)) {
    return new Uint8Array(value.buffer);
  } // no match


  return false;
} // Actually inserts a key value into the selector document
// However, this checks there is no ambiguity in setting
// the value for the given key, throws otherwise


function insertIntoDocument(document, key, value) {
  Object.keys(document).forEach(existingKey => {
    if (existingKey.length > key.length && existingKey.indexOf("".concat(key, ".")) === 0 || key.length > existingKey.length && key.indexOf("".concat(existingKey, ".")) === 0) {
      throw new Error("cannot infer query fields to set, both paths '".concat(existingKey, "' and ") + "'".concat(key, "' are matched"));
    } else if (existingKey === key) {
      throw new Error("cannot infer query fields to set, path '".concat(key, "' is matched twice"));
    }
  });
  document[key] = value;
} // Returns a branched matcher that matches iff the given matcher does not.
// Note that this implicitly "deMorganizes" the wrapped function.  ie, it
// means that ALL branch values need to fail to match innerBranchedMatcher.


function invertBranchedMatcher(branchedMatcher) {
  return branchValues => {
    // We explicitly choose to strip arrayIndices here: it doesn't make sense to
    // say "update the array element that does not match something", at least
    // in mongo-land.
    return {
      result: !branchedMatcher(branchValues).result
    };
  };
}

function isIndexable(obj) {
  return Array.isArray(obj) || LocalCollection._isPlainObject(obj);
}

function isNumericKey(s) {
  return /^[0-9]+$/.test(s);
}

function isOperatorObject(valueSelector, inconsistentOK) {
  if (!LocalCollection._isPlainObject(valueSelector)) {
    return false;
  }

  let theseAreOperators = undefined;
  Object.keys(valueSelector).forEach(selKey => {
    const thisIsOperator = selKey.substr(0, 1) === '$';

    if (theseAreOperators === undefined) {
      theseAreOperators = thisIsOperator;
    } else if (theseAreOperators !== thisIsOperator) {
      if (!inconsistentOK) {
        throw new Error("Inconsistent operator: ".concat(JSON.stringify(valueSelector)));
      }

      theseAreOperators = false;
    }
  });
  return !!theseAreOperators; // {} has no operators
}

// Helper for $lt/$gt/$lte/$gte.
function makeInequality(cmpValueComparator) {
  return {
    compileElementSelector(operand) {
      // Arrays never compare false with non-arrays for any inequality.
      // XXX This was behavior we observed in pre-release MongoDB 2.5, but
      //     it seems to have been reverted.
      //     See https://jira.mongodb.org/browse/SERVER-11444
      if (Array.isArray(operand)) {
        return () => false;
      } // Special case: consider undefined and null the same (so true with
      // $gte/$lte).


      if (operand === undefined) {
        operand = null;
      }

      const operandType = LocalCollection._f._type(operand);

      return value => {
        if (value === undefined) {
          value = null;
        } // Comparisons are never true among things of different type (except
        // null vs undefined).


        if (LocalCollection._f._type(value) !== operandType) {
          return false;
        }

        return cmpValueComparator(LocalCollection._f._cmp(value, operand));
      };
    }

  };
} // makeLookupFunction(key) returns a lookup function.
//
// A lookup function takes in a document and returns an array of matching
// branches.  If no arrays are found while looking up the key, this array will
// have exactly one branches (possibly 'undefined', if some segment of the key
// was not found).
//
// If arrays are found in the middle, this can have more than one element, since
// we 'branch'. When we 'branch', if there are more key segments to look up,
// then we only pursue branches that are plain objects (not arrays or scalars).
// This means we can actually end up with no branches!
//
// We do *NOT* branch on arrays that are found at the end (ie, at the last
// dotted member of the key). We just return that array; if you want to
// effectively 'branch' over the array's values, post-process the lookup
// function with expandArraysInBranches.
//
// Each branch is an object with keys:
//  - value: the value at the branch
//  - dontIterate: an optional bool; if true, it means that 'value' is an array
//    that expandArraysInBranches should NOT expand. This specifically happens
//    when there is a numeric index in the key, and ensures the
//    perhaps-surprising MongoDB behavior where {'a.0': 5} does NOT
//    match {a: [[5]]}.
//  - arrayIndices: if any array indexing was done during lookup (either due to
//    explicit numeric indices or implicit branching), this will be an array of
//    the array indices used, from outermost to innermost; it is falsey or
//    absent if no array index is used. If an explicit numeric index is used,
//    the index will be followed in arrayIndices by the string 'x'.
//
//    Note: arrayIndices is used for two purposes. First, it is used to
//    implement the '$' modifier feature, which only ever looks at its first
//    element.
//
//    Second, it is used for sort key generation, which needs to be able to tell
//    the difference between different paths. Moreover, it needs to
//    differentiate between explicit and implicit branching, which is why
//    there's the somewhat hacky 'x' entry: this means that explicit and
//    implicit array lookups will have different full arrayIndices paths. (That
//    code only requires that different paths have different arrayIndices; it
//    doesn't actually 'parse' arrayIndices. As an alternative, arrayIndices
//    could contain objects with flags like 'implicit', but I think that only
//    makes the code surrounding them more complex.)
//
//    (By the way, this field ends up getting passed around a lot without
//    cloning, so never mutate any arrayIndices field/var in this package!)
//
//
// At the top level, you may only pass in a plain object or array.
//
// See the test 'minimongo - lookup' for some examples of what lookup functions
// return.


function makeLookupFunction(key) {
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const parts = key.split('.');
  const firstPart = parts.length ? parts[0] : '';
  const lookupRest = parts.length > 1 && makeLookupFunction(parts.slice(1).join('.'), options);

  const omitUnnecessaryFields = result => {
    if (!result.dontIterate) {
      delete result.dontIterate;
    }

    if (result.arrayIndices && !result.arrayIndices.length) {
      delete result.arrayIndices;
    }

    return result;
  }; // Doc will always be a plain object or an array.
  // apply an explicit numeric index, an array.


  return function (doc) {
    let arrayIndices = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    if (Array.isArray(doc)) {
      // If we're being asked to do an invalid lookup into an array (non-integer
      // or out-of-bounds), return no results (which is different from returning
      // a single undefined result, in that `null` equality checks won't match).
      if (!(isNumericKey(firstPart) && firstPart < doc.length)) {
        return [];
      } // Remember that we used this array index. Include an 'x' to indicate that
      // the previous index came from being considered as an explicit array
      // index (not branching).


      arrayIndices = arrayIndices.concat(+firstPart, 'x');
    } // Do our first lookup.


    const firstLevel = doc[firstPart]; // If there is no deeper to dig, return what we found.
    //
    // If what we found is an array, most value selectors will choose to treat
    // the elements of the array as matchable values in their own right, but
    // that's done outside of the lookup function. (Exceptions to this are $size
    // and stuff relating to $elemMatch.  eg, {a: {$size: 2}} does not match {a:
    // [[1, 2]]}.)
    //
    // That said, if we just did an *explicit* array lookup (on doc) to find
    // firstLevel, and firstLevel is an array too, we do NOT want value
    // selectors to iterate over it.  eg, {'a.0': 5} does not match {a: [[5]]}.
    // So in that case, we mark the return value as 'don't iterate'.

    if (!lookupRest) {
      return [omitUnnecessaryFields({
        arrayIndices,
        dontIterate: Array.isArray(doc) && Array.isArray(firstLevel),
        value: firstLevel
      })];
    } // We need to dig deeper.  But if we can't, because what we've found is not
    // an array or plain object, we're done. If we just did a numeric index into
    // an array, we return nothing here (this is a change in Mongo 2.5 from
    // Mongo 2.4, where {'a.0.b': null} stopped matching {a: [5]}). Otherwise,
    // return a single `undefined` (which can, for example, match via equality
    // with `null`).


    if (!isIndexable(firstLevel)) {
      if (Array.isArray(doc)) {
        return [];
      }

      return [omitUnnecessaryFields({
        arrayIndices,
        value: undefined
      })];
    }

    const result = [];

    const appendToResult = more => {
      result.push(...more);
    }; // Dig deeper: look up the rest of the parts on whatever we've found.
    // (lookupRest is smart enough to not try to do invalid lookups into
    // firstLevel if it's an array.)


    appendToResult(lookupRest(firstLevel, arrayIndices)); // If we found an array, then in *addition* to potentially treating the next
    // part as a literal integer lookup, we should also 'branch': try to look up
    // the rest of the parts on each array element in parallel.
    //
    // In this case, we *only* dig deeper into array elements that are plain
    // objects. (Recall that we only got this far if we have further to dig.)
    // This makes sense: we certainly don't dig deeper into non-indexable
    // objects. And it would be weird to dig into an array: it's simpler to have
    // a rule that explicit integer indexes only apply to an outer array, not to
    // an array you find after a branching search.
    //
    // In the special case of a numeric part in a *sort selector* (not a query
    // selector), we skip the branching: we ONLY allow the numeric part to mean
    // 'look up this index' in that case, not 'also look up this index in all
    // the elements of the array'.

    if (Array.isArray(firstLevel) && !(isNumericKey(parts[1]) && options.forSort)) {
      firstLevel.forEach((branch, arrayIndex) => {
        if (LocalCollection._isPlainObject(branch)) {
          appendToResult(lookupRest(branch, arrayIndices.concat(arrayIndex)));
        }
      });
    }

    return result;
  };
}

// Object exported only for unit testing.
// Use it to export private functions to test in Tinytest.
MinimongoTest = {
  makeLookupFunction
};

MinimongoError = function (message) {
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (typeof message === 'string' && options.field) {
    message += " for field '".concat(options.field, "'");
  }

  const error = new Error(message);
  error.name = 'MinimongoError';
  return error;
};

function nothingMatcher(docOrBranchedValues) {
  return {
    result: false
  };
}

// Takes an operator object (an object with $ keys) and returns a branched
// matcher for it.
function operatorBranchedMatcher(valueSelector, matcher, isRoot) {
  // Each valueSelector works separately on the various branches.  So one
  // operator can match one branch and another can match another branch.  This
  // is OK.
  const operatorMatchers = Object.keys(valueSelector).map(operator => {
    const operand = valueSelector[operator];
    const simpleRange = ['$lt', '$lte', '$gt', '$gte'].includes(operator) && typeof operand === 'number';
    const simpleEquality = ['$ne', '$eq'].includes(operator) && operand !== Object(operand);
    const simpleInclusion = ['$in', '$nin'].includes(operator) && Array.isArray(operand) && !operand.some(x => x === Object(x));

    if (!(simpleRange || simpleInclusion || simpleEquality)) {
      matcher._isSimple = false;
    }

    if (hasOwn.call(VALUE_OPERATORS, operator)) {
      return VALUE_OPERATORS[operator](operand, valueSelector, matcher, isRoot);
    }

    if (hasOwn.call(ELEMENT_OPERATORS, operator)) {
      const options = ELEMENT_OPERATORS[operator];
      return convertElementMatcherToBranchedMatcher(options.compileElementSelector(operand, valueSelector, matcher), options);
    }

    throw new Error("Unrecognized operator: ".concat(operator));
  });
  return andBranchedMatchers(operatorMatchers);
} // paths - Array: list of mongo style paths
// newLeafFn - Function: of form function(path) should return a scalar value to
//                       put into list created for that path
// conflictFn - Function: of form function(node, path, fullPath) is called
//                        when building a tree path for 'fullPath' node on
//                        'path' was already a leaf with a value. Must return a
//                        conflict resolution.
// initial tree - Optional Object: starting tree.
// @returns - Object: tree represented as a set of nested objects


function pathsToTree(paths, newLeafFn, conflictFn) {
  let root = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  paths.forEach(path => {
    const pathArray = path.split('.');
    let tree = root; // use .every just for iteration with break

    const success = pathArray.slice(0, -1).every((key, i) => {
      if (!hasOwn.call(tree, key)) {
        tree[key] = {};
      } else if (tree[key] !== Object(tree[key])) {
        tree[key] = conflictFn(tree[key], pathArray.slice(0, i + 1).join('.'), path); // break out of loop if we are failing for this path

        if (tree[key] !== Object(tree[key])) {
          return false;
        }
      }

      tree = tree[key];
      return true;
    });

    if (success) {
      const lastKey = pathArray[pathArray.length - 1];

      if (hasOwn.call(tree, lastKey)) {
        tree[lastKey] = conflictFn(tree[lastKey], path, path);
      } else {
        tree[lastKey] = newLeafFn(path);
      }
    }
  });
  return root;
}

// Makes sure we get 2 elements array and assume the first one to be x and
// the second one to y no matter what user passes.
// In case user passes { lon: x, lat: y } returns [x, y]
function pointToArray(point) {
  return Array.isArray(point) ? point.slice() : [point.x, point.y];
} // Creating a document from an upsert is quite tricky.
// E.g. this selector: {"$or": [{"b.foo": {"$all": ["bar"]}}]}, should result
// in: {"b.foo": "bar"}
// But this selector: {"$or": [{"b": {"foo": {"$all": ["bar"]}}}]} should throw
// an error
// Some rules (found mainly with trial & error, so there might be more):
// - handle all childs of $and (or implicit $and)
// - handle $or nodes with exactly 1 child
// - ignore $or nodes with more than 1 child
// - ignore $nor and $not nodes
// - throw when a value can not be set unambiguously
// - every value for $all should be dealt with as separate $eq-s
// - threat all children of $all as $eq setters (=> set if $all.length === 1,
//   otherwise throw error)
// - you can not mix '$'-prefixed keys and non-'$'-prefixed keys
// - you can only have dotted keys on a root-level
// - you can not have '$'-prefixed keys more than one-level deep in an object
// Handles one key/value pair to put in the selector document


function populateDocumentWithKeyValue(document, key, value) {
  if (value && Object.getPrototypeOf(value) === Object.prototype) {
    populateDocumentWithObject(document, key, value);
  } else if (!(value instanceof RegExp)) {
    insertIntoDocument(document, key, value);
  }
} // Handles a key, value pair to put in the selector document
// if the value is an object


function populateDocumentWithObject(document, key, value) {
  const keys = Object.keys(value);
  const unprefixedKeys = keys.filter(op => op[0] !== '$');

  if (unprefixedKeys.length > 0 || !keys.length) {
    // Literal (possibly empty) object ( or empty object )
    // Don't allow mixing '$'-prefixed with non-'$'-prefixed fields
    if (keys.length !== unprefixedKeys.length) {
      throw new Error("unknown operator: ".concat(unprefixedKeys[0]));
    }

    validateObject(value, key);
    insertIntoDocument(document, key, value);
  } else {
    Object.keys(value).forEach(op => {
      const object = value[op];

      if (op === '$eq') {
        populateDocumentWithKeyValue(document, key, object);
      } else if (op === '$all') {
        // every value for $all should be dealt with as separate $eq-s
        object.forEach(element => populateDocumentWithKeyValue(document, key, element));
      }
    });
  }
} // Fills a document with certain fields from an upsert selector


function populateDocumentWithQueryFields(query) {
  let document = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (Object.getPrototypeOf(query) === Object.prototype) {
    // handle implicit $and
    Object.keys(query).forEach(key => {
      const value = query[key];

      if (key === '$and') {
        // handle explicit $and
        value.forEach(element => populateDocumentWithQueryFields(element, document));
      } else if (key === '$or') {
        // handle $or nodes with exactly 1 child
        if (value.length === 1) {
          populateDocumentWithQueryFields(value[0], document);
        }
      } else if (key[0] !== '$') {
        // Ignore other '$'-prefixed logical selectors
        populateDocumentWithKeyValue(document, key, value);
      }
    });
  } else {
    // Handle meteor-specific shortcut for selecting _id
    if (LocalCollection._selectorIsId(query)) {
      insertIntoDocument(document, '_id', query);
    }
  }

  return document;
}

function projectionDetails(fields) {
  // Find the non-_id keys (_id is handled specially because it is included
  // unless explicitly excluded). Sort the keys, so that our code to detect
  // overlaps like 'foo' and 'foo.bar' can assume that 'foo' comes first.
  let fieldsKeys = Object.keys(fields).sort(); // If _id is the only field in the projection, do not remove it, since it is
  // required to determine if this is an exclusion or exclusion. Also keep an
  // inclusive _id, since inclusive _id follows the normal rules about mixing
  // inclusive and exclusive fields. If _id is not the only field in the
  // projection and is exclusive, remove it so it can be handled later by a
  // special case, since exclusive _id is always allowed.

  if (!(fieldsKeys.length === 1 && fieldsKeys[0] === '_id') && !(fieldsKeys.includes('_id') && fields._id)) {
    fieldsKeys = fieldsKeys.filter(key => key !== '_id');
  }

  let including = null; // Unknown

  fieldsKeys.forEach(keyPath => {
    const rule = !!fields[keyPath];

    if (including === null) {
      including = rule;
    } // This error message is copied from MongoDB shell


    if (including !== rule) {
      throw MinimongoError('You cannot currently mix including and excluding fields.');
    }
  });
  const projectionRulesTree = pathsToTree(fieldsKeys, path => including, (node, path, fullPath) => {
    // Check passed projection fields' keys: If you have two rules such as
    // 'foo.bar' and 'foo.bar.baz', then the result becomes ambiguous. If
    // that happens, there is a probability you are doing something wrong,
    // framework should notify you about such mistake earlier on cursor
    // compilation step than later during runtime.  Note, that real mongo
    // doesn't do anything about it and the later rule appears in projection
    // project, more priority it takes.
    //
    // Example, assume following in mongo shell:
    // > db.coll.insert({ a: { b: 23, c: 44 } })
    // > db.coll.find({}, { 'a': 1, 'a.b': 1 })
    // {"_id": ObjectId("520bfe456024608e8ef24af3"), "a": {"b": 23}}
    // > db.coll.find({}, { 'a.b': 1, 'a': 1 })
    // {"_id": ObjectId("520bfe456024608e8ef24af3"), "a": {"b": 23, "c": 44}}
    //
    // Note, how second time the return set of keys is different.
    const currentPath = fullPath;
    const anotherPath = path;
    throw MinimongoError("both ".concat(currentPath, " and ").concat(anotherPath, " found in fields option, ") + 'using both of them may trigger unexpected behavior. Did you mean to ' + 'use only one of them?');
  });
  return {
    including,
    tree: projectionRulesTree
  };
}

function regexpElementMatcher(regexp) {
  return value => {
    if (value instanceof RegExp) {
      return value.toString() === regexp.toString();
    } // Regexps only work against strings.


    if (typeof value !== 'string') {
      return false;
    } // Reset regexp's state to avoid inconsistent matching for objects with the
    // same value on consecutive calls of regexp.test. This happens only if the
    // regexp has the 'g' flag. Also note that ES6 introduces a new flag 'y' for
    // which we should *not* change the lastIndex but MongoDB doesn't support
    // either of these flags.


    regexp.lastIndex = 0;
    return regexp.test(value);
  };
}

// Validates the key in a path.
// Objects that are nested more then 1 level cannot have dotted fields
// or fields starting with '$'
function validateKeyInPath(key, path) {
  if (key.includes('.')) {
    throw new Error("The dotted field '".concat(key, "' in '").concat(path, ".").concat(key, " is not valid for storage."));
  }

  if (key[0] === '$') {
    throw new Error("The dollar ($) prefixed field  '".concat(path, ".").concat(key, " is not valid for storage."));
  }
} // Recursively validates an object that is nested more than one level deep


function validateObject(object, path) {
  if (object && Object.getPrototypeOf(object) === Object.prototype) {
    Object.keys(object).forEach(key => {
      validateKeyInPath(key, path);
      validateObject(object[key], path + '.' + key);
    });
  }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"cursor.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/minimongo/cursor.js                                                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  default: () => Cursor
});
let LocalCollection;
module.link("./local_collection.js", {
  default(v) {
    LocalCollection = v;
  }

}, 0);
let hasOwn;
module.link("./common.js", {
  hasOwn(v) {
    hasOwn = v;
  }

}, 1);

class Cursor {
  // don't call this ctor directly.  use LocalCollection.find().
  constructor(collection, selector) {
    let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    this.collection = collection;
    this.sorter = null;
    this.matcher = new Minimongo.Matcher(selector);

    if (LocalCollection._selectorIsIdPerhapsAsObject(selector)) {
      // stash for fast _id and { _id }
      this._selectorId = hasOwn.call(selector, '_id') ? selector._id : selector;
    } else {
      this._selectorId = undefined;

      if (this.matcher.hasGeoQuery() || options.sort) {
        this.sorter = new Minimongo.Sorter(options.sort || []);
      }
    }

    this.skip = options.skip || 0;
    this.limit = options.limit;
    this.fields = options.fields;
    this._projectionFn = LocalCollection._compileProjection(this.fields || {});
    this._transform = LocalCollection.wrapTransform(options.transform); // by default, queries register w/ Tracker when it is available.

    if (typeof Tracker !== 'undefined') {
      this.reactive = options.reactive === undefined ? true : options.reactive;
    }
  }
  /**
   * @summary Returns the number of documents that match a query.
   * @memberOf Mongo.Cursor
   * @method  count
   * @param {boolean} [applySkipLimit=true] If set to `false`, the value
   *                                         returned will reflect the total
   *                                         number of matching documents,
   *                                         ignoring any value supplied for
   *                                         limit
   * @instance
   * @locus Anywhere
   * @returns {Number}
   */


  count() {
    let applySkipLimit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

    if (this.reactive) {
      // allow the observe to be unordered
      this._depend({
        added: true,
        removed: true
      }, true);
    }

    return this._getRawObjects({
      ordered: true,
      applySkipLimit
    }).length;
  }
  /**
   * @summary Return all matching documents as an Array.
   * @memberOf Mongo.Cursor
   * @method  fetch
   * @instance
   * @locus Anywhere
   * @returns {Object[]}
   */


  fetch() {
    const result = [];
    this.forEach(doc => {
      result.push(doc);
    });
    return result;
  }

  [Symbol.iterator]() {
    if (this.reactive) {
      this._depend({
        addedBefore: true,
        removed: true,
        changed: true,
        movedBefore: true
      });
    }

    let index = 0;

    const objects = this._getRawObjects({
      ordered: true
    });

    return {
      next: () => {
        if (index < objects.length) {
          // This doubles as a clone operation.
          let element = this._projectionFn(objects[index++]);

          if (this._transform) element = this._transform(element);
          return {
            value: element
          };
        }

        return {
          done: true
        };
      }
    };
  }
  /**
   * @callback IterationCallback
   * @param {Object} doc
   * @param {Number} index
   */

  /**
   * @summary Call `callback` once for each matching document, sequentially and
   *          synchronously.
   * @locus Anywhere
   * @method  forEach
   * @instance
   * @memberOf Mongo.Cursor
   * @param {IterationCallback} callback Function to call. It will be called
   *                                     with three arguments: the document, a
   *                                     0-based index, and <em>cursor</em>
   *                                     itself.
   * @param {Any} [thisArg] An object which will be the value of `this` inside
   *                        `callback`.
   */


  forEach(callback, thisArg) {
    if (this.reactive) {
      this._depend({
        addedBefore: true,
        removed: true,
        changed: true,
        movedBefore: true
      });
    }

    this._getRawObjects({
      ordered: true
    }).forEach((element, i) => {
      // This doubles as a clone operation.
      element = this._projectionFn(element);

      if (this._transform) {
        element = this._transform(element);
      }

      callback.call(thisArg, element, i, this);
    });
  }

  getTransform() {
    return this._transform;
  }
  /**
   * @summary Map callback over all matching documents.  Returns an Array.
   * @locus Anywhere
   * @method map
   * @instance
   * @memberOf Mongo.Cursor
   * @param {IterationCallback} callback Function to call. It will be called
   *                                     with three arguments: the document, a
   *                                     0-based index, and <em>cursor</em>
   *                                     itself.
   * @param {Any} [thisArg] An object which will be the value of `this` inside
   *                        `callback`.
   */


  map(callback, thisArg) {
    const result = [];
    this.forEach((doc, i) => {
      result.push(callback.call(thisArg, doc, i, this));
    });
    return result;
  } // options to contain:
  //  * callbacks for observe():
  //    - addedAt (document, atIndex)
  //    - added (document)
  //    - changedAt (newDocument, oldDocument, atIndex)
  //    - changed (newDocument, oldDocument)
  //    - removedAt (document, atIndex)
  //    - removed (document)
  //    - movedTo (document, oldIndex, newIndex)
  //
  // attributes available on returned query handle:
  //  * stop(): end updates
  //  * collection: the collection this query is querying
  //
  // iff x is a returned query handle, (x instanceof
  // LocalCollection.ObserveHandle) is true
  //
  // initial results delivered through added callback
  // XXX maybe callbacks should take a list of objects, to expose transactions?
  // XXX maybe support field limiting (to limit what you're notified on)

  /**
   * @summary Watch a query.  Receive callbacks as the result set changes.
   * @locus Anywhere
   * @memberOf Mongo.Cursor
   * @instance
   * @param {Object} callbacks Functions to call to deliver the result set as it
   *                           changes
   */


  observe(options) {
    return LocalCollection._observeFromObserveChanges(this, options);
  }
  /**
   * @summary Watch a query. Receive callbacks as the result set changes. Only
   *          the differences between the old and new documents are passed to
   *          the callbacks.
   * @locus Anywhere
   * @memberOf Mongo.Cursor
   * @instance
   * @param {Object} callbacks Functions to call to deliver the result set as it
   *                           changes
   */


  observeChanges(options) {
    const ordered = LocalCollection._observeChangesCallbacksAreOrdered(options); // there are several places that assume you aren't combining skip/limit with
    // unordered observe.  eg, update's EJSON.clone, and the "there are several"
    // comment in _modifyAndNotify
    // XXX allow skip/limit with unordered observe


    if (!options._allow_unordered && !ordered && (this.skip || this.limit)) {
      throw new Error("Must use an ordered observe with skip or limit (i.e. 'addedBefore' " + "for observeChanges or 'addedAt' for observe, instead of 'added').");
    }

    if (this.fields && (this.fields._id === 0 || this.fields._id === false)) {
      throw Error('You may not observe a cursor with {fields: {_id: 0}}');
    }

    const distances = this.matcher.hasGeoQuery() && ordered && new LocalCollection._IdMap();
    const query = {
      cursor: this,
      dirty: false,
      distances,
      matcher: this.matcher,
      // not fast pathed
      ordered,
      projectionFn: this._projectionFn,
      resultsSnapshot: null,
      sorter: ordered && this.sorter
    };
    let qid; // Non-reactive queries call added[Before] and then never call anything
    // else.

    if (this.reactive) {
      qid = this.collection.next_qid++;
      this.collection.queries[qid] = query;
    }

    query.results = this._getRawObjects({
      ordered,
      distances: query.distances
    });

    if (this.collection.paused) {
      query.resultsSnapshot = ordered ? [] : new LocalCollection._IdMap();
    } // wrap callbacks we were passed. callbacks only fire when not paused and
    // are never undefined
    // Filters out blacklisted fields according to cursor's projection.
    // XXX wrong place for this?
    // furthermore, callbacks enqueue until the operation we're working on is
    // done.


    const wrapCallback = fn => {
      if (!fn) {
        return () => {};
      }

      const self = this;
      return function ()
      /* args*/
      {
        if (self.collection.paused) {
          return;
        }

        const args = arguments;

        self.collection._observeQueue.queueTask(() => {
          fn.apply(this, args);
        });
      };
    };

    query.added = wrapCallback(options.added);
    query.changed = wrapCallback(options.changed);
    query.removed = wrapCallback(options.removed);

    if (ordered) {
      query.addedBefore = wrapCallback(options.addedBefore);
      query.movedBefore = wrapCallback(options.movedBefore);
    }

    if (!options._suppress_initial && !this.collection.paused) {
      query.results.forEach(doc => {
        const fields = EJSON.clone(doc);
        delete fields._id;

        if (ordered) {
          query.addedBefore(doc._id, this._projectionFn(fields), null);
        }

        query.added(doc._id, this._projectionFn(fields));
      });
    }

    const handle = Object.assign(new LocalCollection.ObserveHandle(), {
      collection: this.collection,
      stop: () => {
        if (this.reactive) {
          delete this.collection.queries[qid];
        }
      }
    });

    if (this.reactive && Tracker.active) {
      // XXX in many cases, the same observe will be recreated when
      // the current autorun is rerun.  we could save work by
      // letting it linger across rerun and potentially get
      // repurposed if the same observe is performed, using logic
      // similar to that of Meteor.subscribe.
      Tracker.onInvalidate(() => {
        handle.stop();
      });
    } // run the observe callbacks resulting from the initial contents
    // before we leave the observe.


    this.collection._observeQueue.drain();

    return handle;
  } // Since we don't actually have a "nextObject" interface, there's really no
  // reason to have a "rewind" interface.  All it did was make multiple calls
  // to fetch/map/forEach return nothing the second time.
  // XXX COMPAT WITH 0.8.1


  rewind() {} // XXX Maybe we need a version of observe that just calls a callback if
  // anything changed.


  _depend(changers, _allow_unordered) {
    if (Tracker.active) {
      const dependency = new Tracker.Dependency();
      const notify = dependency.changed.bind(dependency);
      dependency.depend();
      const options = {
        _allow_unordered,
        _suppress_initial: true
      };
      ['added', 'addedBefore', 'changed', 'movedBefore', 'removed'].forEach(fn => {
        if (changers[fn]) {
          options[fn] = notify;
        }
      }); // observeChanges will stop() when this computation is invalidated

      this.observeChanges(options);
    }
  }

  _getCollectionName() {
    return this.collection.name;
  } // Returns a collection of matching objects, but doesn't deep copy them.
  //
  // If ordered is set, returns a sorted array, respecting sorter, skip, and
  // limit properties of the query provided that options.applySkipLimit is
  // not set to false (#1201). If sorter is falsey, no sort -- you get the
  // natural order.
  //
  // If ordered is not set, returns an object mapping from ID to doc (sorter,
  // skip and limit should not be set).
  //
  // If ordered is set and this cursor is a $near geoquery, then this function
  // will use an _IdMap to track each distance from the $near argument point in
  // order to use it as a sort key. If an _IdMap is passed in the 'distances'
  // argument, this function will clear it and use it for this purpose
  // (otherwise it will just create its own _IdMap). The observeChanges
  // implementation uses this to remember the distances after this function
  // returns.


  _getRawObjects() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    // By default this method will respect skip and limit because .fetch(),
    // .forEach() etc... expect this behaviour. It can be forced to ignore
    // skip and limit by setting applySkipLimit to false (.count() does this,
    // for example)
    const applySkipLimit = options.applySkipLimit !== false; // XXX use OrderedDict instead of array, and make IdMap and OrderedDict
    // compatible

    const results = options.ordered ? [] : new LocalCollection._IdMap(); // fast path for single ID value

    if (this._selectorId !== undefined) {
      // If you have non-zero skip and ask for a single id, you get nothing.
      // This is so it matches the behavior of the '{_id: foo}' path.
      if (applySkipLimit && this.skip) {
        return results;
      }

      const selectedDoc = this.collection._docs.get(this._selectorId);

      if (selectedDoc) {
        if (options.ordered) {
          results.push(selectedDoc);
        } else {
          results.set(this._selectorId, selectedDoc);
        }
      }

      return results;
    } // slow path for arbitrary selector, sort, skip, limit
    // in the observeChanges case, distances is actually part of the "query"
    // (ie, live results set) object.  in other cases, distances is only used
    // inside this function.


    let distances;

    if (this.matcher.hasGeoQuery() && options.ordered) {
      if (options.distances) {
        distances = options.distances;
        distances.clear();
      } else {
        distances = new LocalCollection._IdMap();
      }
    }

    this.collection._docs.forEach((doc, id) => {
      const matchResult = this.matcher.documentMatches(doc);

      if (matchResult.result) {
        if (options.ordered) {
          results.push(doc);

          if (distances && matchResult.distance !== undefined) {
            distances.set(id, matchResult.distance);
          }
        } else {
          results.set(id, doc);
        }
      } // Override to ensure all docs are matched if ignoring skip & limit


      if (!applySkipLimit) {
        return true;
      } // Fast path for limited unsorted queries.
      // XXX 'length' check here seems wrong for ordered


      return !this.limit || this.skip || this.sorter || results.length !== this.limit;
    });

    if (!options.ordered) {
      return results;
    }

    if (this.sorter) {
      results.sort(this.sorter.getComparator({
        distances
      }));
    } // Return the full set of results if there is no skip or limit or if we're
    // ignoring them


    if (!applySkipLimit || !this.limit && !this.skip) {
      return results;
    }

    return results.slice(this.skip, this.limit ? this.limit + this.skip : results.length);
  }

  _publishCursor(subscription) {
    // XXX minimongo should not depend on mongo-livedata!
    if (!Package.mongo) {
      throw new Error('Can\'t publish from Minimongo without the `mongo` package.');
    }

    if (!this.collection.name) {
      throw new Error('Can\'t publish a cursor from a collection without a name.');
    }

    return Package.mongo.Mongo.Collection._publishCursor(this, subscription, this.collection.name);
  }

}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"local_collection.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/minimongo/local_collection.js                                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  default: () => LocalCollection
});
let Cursor;
module.link("./cursor.js", {
  default(v) {
    Cursor = v;
  }

}, 0);
let ObserveHandle;
module.link("./observe_handle.js", {
  default(v) {
    ObserveHandle = v;
  }

}, 1);
let hasOwn, isIndexable, isNumericKey, isOperatorObject, populateDocumentWithQueryFields, projectionDetails;
module.link("./common.js", {
  hasOwn(v) {
    hasOwn = v;
  },

  isIndexable(v) {
    isIndexable = v;
  },

  isNumericKey(v) {
    isNumericKey = v;
  },

  isOperatorObject(v) {
    isOperatorObject = v;
  },

  populateDocumentWithQueryFields(v) {
    populateDocumentWithQueryFields = v;
  },

  projectionDetails(v) {
    projectionDetails = v;
  }

}, 2);

class LocalCollection {
  constructor(name) {
    this.name = name; // _id -> document (also containing id)

    this._docs = new LocalCollection._IdMap();
    this._observeQueue = new Meteor._SynchronousQueue();
    this.next_qid = 1; // live query id generator
    // qid -> live query object. keys:
    //  ordered: bool. ordered queries have addedBefore/movedBefore callbacks.
    //  results: array (ordered) or object (unordered) of current results
    //    (aliased with this._docs!)
    //  resultsSnapshot: snapshot of results. null if not paused.
    //  cursor: Cursor object for the query.
    //  selector, sorter, (callbacks): functions

    this.queries = Object.create(null); // null if not saving originals; an IdMap from id to original document value
    // if saving originals. See comments before saveOriginals().

    this._savedOriginals = null; // True when observers are paused and we should not send callbacks.

    this.paused = false;
  } // options may include sort, skip, limit, reactive
  // sort may be any of these forms:
  //     {a: 1, b: -1}
  //     [["a", "asc"], ["b", "desc"]]
  //     ["a", ["b", "desc"]]
  //   (in the first form you're beholden to key enumeration order in
  //   your javascript VM)
  //
  // reactive: if given, and false, don't register with Tracker (default
  // is true)
  //
  // XXX possibly should support retrieving a subset of fields? and
  // have it be a hint (ignored on the client, when not copying the
  // doc?)
  //
  // XXX sort does not yet support subkeys ('a.b') .. fix that!
  // XXX add one more sort form: "key"
  // XXX tests


  find(selector, options) {
    // default syntax for everything is to omit the selector argument.
    // but if selector is explicitly passed in as false or undefined, we
    // want a selector that matches nothing.
    if (arguments.length === 0) {
      selector = {};
    }

    return new LocalCollection.Cursor(this, selector, options);
  }

  findOne(selector) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (arguments.length === 0) {
      selector = {};
    } // NOTE: by setting limit 1 here, we end up using very inefficient
    // code that recomputes the whole query on each update. The upside is
    // that when you reactively depend on a findOne you only get
    // invalidated when the found object changes, not any object in the
    // collection. Most findOne will be by id, which has a fast path, so
    // this might not be a big deal. In most cases, invalidation causes
    // the called to re-query anyway, so this should be a net performance
    // improvement.


    options.limit = 1;
    return this.find(selector, options).fetch()[0];
  } // XXX possibly enforce that 'undefined' does not appear (we assume
  // this in our handling of null and $exists)


  insert(doc, callback) {
    doc = EJSON.clone(doc);
    assertHasValidFieldNames(doc); // if you really want to use ObjectIDs, set this global.
    // Mongo.Collection specifies its own ids and does not use this code.

    if (!hasOwn.call(doc, '_id')) {
      doc._id = LocalCollection._useOID ? new MongoID.ObjectID() : Random.id();
    }

    const id = doc._id;

    if (this._docs.has(id)) {
      throw MinimongoError("Duplicate _id '".concat(id, "'"));
    }

    this._saveOriginal(id, undefined);

    this._docs.set(id, doc);

    const queriesToRecompute = []; // trigger live queries that match

    Object.keys(this.queries).forEach(qid => {
      const query = this.queries[qid];

      if (query.dirty) {
        return;
      }

      const matchResult = query.matcher.documentMatches(doc);

      if (matchResult.result) {
        if (query.distances && matchResult.distance !== undefined) {
          query.distances.set(id, matchResult.distance);
        }

        if (query.cursor.skip || query.cursor.limit) {
          queriesToRecompute.push(qid);
        } else {
          LocalCollection._insertInResults(query, doc);
        }
      }
    });
    queriesToRecompute.forEach(qid => {
      if (this.queries[qid]) {
        this._recomputeResults(this.queries[qid]);
      }
    });

    this._observeQueue.drain(); // Defer because the caller likely doesn't expect the callback to be run
    // immediately.


    if (callback) {
      Meteor.defer(() => {
        callback(null, id);
      });
    }

    return id;
  } // Pause the observers. No callbacks from observers will fire until
  // 'resumeObservers' is called.


  pauseObservers() {
    // No-op if already paused.
    if (this.paused) {
      return;
    } // Set the 'paused' flag such that new observer messages don't fire.


    this.paused = true; // Take a snapshot of the query results for each query.

    Object.keys(this.queries).forEach(qid => {
      const query = this.queries[qid];
      query.resultsSnapshot = EJSON.clone(query.results);
    });
  }

  remove(selector, callback) {
    // Easy special case: if we're not calling observeChanges callbacks and
    // we're not saving originals and we got asked to remove everything, then
    // just empty everything directly.
    if (this.paused && !this._savedOriginals && EJSON.equals(selector, {})) {
      const result = this._docs.size();

      this._docs.clear();

      Object.keys(this.queries).forEach(qid => {
        const query = this.queries[qid];

        if (query.ordered) {
          query.results = [];
        } else {
          query.results.clear();
        }
      });

      if (callback) {
        Meteor.defer(() => {
          callback(null, result);
        });
      }

      return result;
    }

    const matcher = new Minimongo.Matcher(selector);
    const remove = [];

    this._eachPossiblyMatchingDoc(selector, (doc, id) => {
      if (matcher.documentMatches(doc).result) {
        remove.push(id);
      }
    });

    const queriesToRecompute = [];
    const queryRemove = [];

    for (let i = 0; i < remove.length; i++) {
      const removeId = remove[i];

      const removeDoc = this._docs.get(removeId);

      Object.keys(this.queries).forEach(qid => {
        const query = this.queries[qid];

        if (query.dirty) {
          return;
        }

        if (query.matcher.documentMatches(removeDoc).result) {
          if (query.cursor.skip || query.cursor.limit) {
            queriesToRecompute.push(qid);
          } else {
            queryRemove.push({
              qid,
              doc: removeDoc
            });
          }
        }
      });

      this._saveOriginal(removeId, removeDoc);

      this._docs.remove(removeId);
    } // run live query callbacks _after_ we've removed the documents.


    queryRemove.forEach(remove => {
      const query = this.queries[remove.qid];

      if (query) {
        query.distances && query.distances.remove(remove.doc._id);

        LocalCollection._removeFromResults(query, remove.doc);
      }
    });
    queriesToRecompute.forEach(qid => {
      const query = this.queries[qid];

      if (query) {
        this._recomputeResults(query);
      }
    });

    this._observeQueue.drain();

    const result = remove.length;

    if (callback) {
      Meteor.defer(() => {
        callback(null, result);
      });
    }

    return result;
  } // Resume the observers. Observers immediately receive change
  // notifications to bring them to the current state of the
  // database. Note that this is not just replaying all the changes that
  // happened during the pause, it is a smarter 'coalesced' diff.


  resumeObservers() {
    // No-op if not paused.
    if (!this.paused) {
      return;
    } // Unset the 'paused' flag. Make sure to do this first, otherwise
    // observer methods won't actually fire when we trigger them.


    this.paused = false;
    Object.keys(this.queries).forEach(qid => {
      const query = this.queries[qid];

      if (query.dirty) {
        query.dirty = false; // re-compute results will perform `LocalCollection._diffQueryChanges`
        // automatically.

        this._recomputeResults(query, query.resultsSnapshot);
      } else {
        // Diff the current results against the snapshot and send to observers.
        // pass the query object for its observer callbacks.
        LocalCollection._diffQueryChanges(query.ordered, query.resultsSnapshot, query.results, query, {
          projectionFn: query.projectionFn
        });
      }

      query.resultsSnapshot = null;
    });

    this._observeQueue.drain();
  }

  retrieveOriginals() {
    if (!this._savedOriginals) {
      throw new Error('Called retrieveOriginals without saveOriginals');
    }

    const originals = this._savedOriginals;
    this._savedOriginals = null;
    return originals;
  } // To track what documents are affected by a piece of code, call
  // saveOriginals() before it and retrieveOriginals() after it.
  // retrieveOriginals returns an object whose keys are the ids of the documents
  // that were affected since the call to saveOriginals(), and the values are
  // equal to the document's contents at the time of saveOriginals. (In the case
  // of an inserted document, undefined is the value.) You must alternate
  // between calls to saveOriginals() and retrieveOriginals().


  saveOriginals() {
    if (this._savedOriginals) {
      throw new Error('Called saveOriginals twice without retrieveOriginals');
    }

    this._savedOriginals = new LocalCollection._IdMap();
  } // XXX atomicity: if multi is true, and one modification fails, do
  // we rollback the whole operation, or what?


  update(selector, mod, options, callback) {
    if (!callback && options instanceof Function) {
      callback = options;
      options = null;
    }

    if (!options) {
      options = {};
    }

    const matcher = new Minimongo.Matcher(selector, true); // Save the original results of any query that we might need to
    // _recomputeResults on, because _modifyAndNotify will mutate the objects in
    // it. (We don't need to save the original results of paused queries because
    // they already have a resultsSnapshot and we won't be diffing in
    // _recomputeResults.)

    const qidToOriginalResults = {}; // We should only clone each document once, even if it appears in multiple
    // queries

    const docMap = new LocalCollection._IdMap();

    const idsMatched = LocalCollection._idsMatchedBySelector(selector);

    Object.keys(this.queries).forEach(qid => {
      const query = this.queries[qid];

      if ((query.cursor.skip || query.cursor.limit) && !this.paused) {
        // Catch the case of a reactive `count()` on a cursor with skip
        // or limit, which registers an unordered observe. This is a
        // pretty rare case, so we just clone the entire result set with
        // no optimizations for documents that appear in these result
        // sets and other queries.
        if (query.results instanceof LocalCollection._IdMap) {
          qidToOriginalResults[qid] = query.results.clone();
          return;
        }

        if (!(query.results instanceof Array)) {
          throw new Error('Assertion failed: query.results not an array');
        } // Clones a document to be stored in `qidToOriginalResults`
        // because it may be modified before the new and old result sets
        // are diffed. But if we know exactly which document IDs we're
        // going to modify, then we only need to clone those.


        const memoizedCloneIfNeeded = doc => {
          if (docMap.has(doc._id)) {
            return docMap.get(doc._id);
          }

          const docToMemoize = idsMatched && !idsMatched.some(id => EJSON.equals(id, doc._id)) ? doc : EJSON.clone(doc);
          docMap.set(doc._id, docToMemoize);
          return docToMemoize;
        };

        qidToOriginalResults[qid] = query.results.map(memoizedCloneIfNeeded);
      }
    });
    const recomputeQids = {};
    let updateCount = 0;

    this._eachPossiblyMatchingDoc(selector, (doc, id) => {
      const queryResult = matcher.documentMatches(doc);

      if (queryResult.result) {
        // XXX Should we save the original even if mod ends up being a no-op?
        this._saveOriginal(id, doc);

        this._modifyAndNotify(doc, mod, recomputeQids, queryResult.arrayIndices);

        ++updateCount;

        if (!options.multi) {
          return false; // break
        }
      }

      return true;
    });

    Object.keys(recomputeQids).forEach(qid => {
      const query = this.queries[qid];

      if (query) {
        this._recomputeResults(query, qidToOriginalResults[qid]);
      }
    });

    this._observeQueue.drain(); // If we are doing an upsert, and we didn't modify any documents yet, then
    // it's time to do an insert. Figure out what document we are inserting, and
    // generate an id for it.


    let insertedId;

    if (updateCount === 0 && options.upsert) {
      const doc = LocalCollection._createUpsertDocument(selector, mod);

      if (!doc._id && options.insertedId) {
        doc._id = options.insertedId;
      }

      insertedId = this.insert(doc);
      updateCount = 1;
    } // Return the number of affected documents, or in the upsert case, an object
    // containing the number of affected docs and the id of the doc that was
    // inserted, if any.


    let result;

    if (options._returnObject) {
      result = {
        numberAffected: updateCount
      };

      if (insertedId !== undefined) {
        result.insertedId = insertedId;
      }
    } else {
      result = updateCount;
    }

    if (callback) {
      Meteor.defer(() => {
        callback(null, result);
      });
    }

    return result;
  } // A convenience wrapper on update. LocalCollection.upsert(sel, mod) is
  // equivalent to LocalCollection.update(sel, mod, {upsert: true,
  // _returnObject: true}).


  upsert(selector, mod, options, callback) {
    if (!callback && typeof options === 'function') {
      callback = options;
      options = {};
    }

    return this.update(selector, mod, Object.assign({}, options, {
      upsert: true,
      _returnObject: true
    }), callback);
  } // Iterates over a subset of documents that could match selector; calls
  // fn(doc, id) on each of them.  Specifically, if selector specifies
  // specific _id's, it only looks at those.  doc is *not* cloned: it is the
  // same object that is in _docs.


  _eachPossiblyMatchingDoc(selector, fn) {
    const specificIds = LocalCollection._idsMatchedBySelector(selector);

    if (specificIds) {
      specificIds.some(id => {
        const doc = this._docs.get(id);

        if (doc) {
          return fn(doc, id) === false;
        }
      });
    } else {
      this._docs.forEach(fn);
    }
  }

  _modifyAndNotify(doc, mod, recomputeQids, arrayIndices) {
    const matched_before = {};
    Object.keys(this.queries).forEach(qid => {
      const query = this.queries[qid];

      if (query.dirty) {
        return;
      }

      if (query.ordered) {
        matched_before[qid] = query.matcher.documentMatches(doc).result;
      } else {
        // Because we don't support skip or limit (yet) in unordered queries, we
        // can just do a direct lookup.
        matched_before[qid] = query.results.has(doc._id);
      }
    });
    const old_doc = EJSON.clone(doc);

    LocalCollection._modify(doc, mod, {
      arrayIndices
    });

    Object.keys(this.queries).forEach(qid => {
      const query = this.queries[qid];

      if (query.dirty) {
        return;
      }

      const afterMatch = query.matcher.documentMatches(doc);
      const after = afterMatch.result;
      const before = matched_before[qid];

      if (after && query.distances && afterMatch.distance !== undefined) {
        query.distances.set(doc._id, afterMatch.distance);
      }

      if (query.cursor.skip || query.cursor.limit) {
        // We need to recompute any query where the doc may have been in the
        // cursor's window either before or after the update. (Note that if skip
        // or limit is set, "before" and "after" being true do not necessarily
        // mean that the document is in the cursor's output after skip/limit is
        // applied... but if they are false, then the document definitely is NOT
        // in the output. So it's safe to skip recompute if neither before or
        // after are true.)
        if (before || after) {
          recomputeQids[qid] = true;
        }
      } else if (before && !after) {
        LocalCollection._removeFromResults(query, doc);
      } else if (!before && after) {
        LocalCollection._insertInResults(query, doc);
      } else if (before && after) {
        LocalCollection._updateInResults(query, doc, old_doc);
      }
    });
  } // Recomputes the results of a query and runs observe callbacks for the
  // difference between the previous results and the current results (unless
  // paused). Used for skip/limit queries.
  //
  // When this is used by insert or remove, it can just use query.results for
  // the old results (and there's no need to pass in oldResults), because these
  // operations don't mutate the documents in the collection. Update needs to
  // pass in an oldResults which was deep-copied before the modifier was
  // applied.
  //
  // oldResults is guaranteed to be ignored if the query is not paused.


  _recomputeResults(query, oldResults) {
    if (this.paused) {
      // There's no reason to recompute the results now as we're still paused.
      // By flagging the query as "dirty", the recompute will be performed
      // when resumeObservers is called.
      query.dirty = true;
      return;
    }

    if (!this.paused && !oldResults) {
      oldResults = query.results;
    }

    if (query.distances) {
      query.distances.clear();
    }

    query.results = query.cursor._getRawObjects({
      distances: query.distances,
      ordered: query.ordered
    });

    if (!this.paused) {
      LocalCollection._diffQueryChanges(query.ordered, oldResults, query.results, query, {
        projectionFn: query.projectionFn
      });
    }
  }

  _saveOriginal(id, doc) {
    // Are we even trying to save originals?
    if (!this._savedOriginals) {
      return;
    } // Have we previously mutated the original (and so 'doc' is not actually
    // original)?  (Note the 'has' check rather than truth: we store undefined
    // here for inserted docs!)


    if (this._savedOriginals.has(id)) {
      return;
    }

    this._savedOriginals.set(id, EJSON.clone(doc));
  }

}

LocalCollection.Cursor = Cursor;
LocalCollection.ObserveHandle = ObserveHandle; // XXX maybe move these into another ObserveHelpers package or something
// _CachingChangeObserver is an object which receives observeChanges callbacks
// and keeps a cache of the current cursor state up to date in this.docs. Users
// of this class should read the docs field but not modify it. You should pass
// the "applyChange" field as the callbacks to the underlying observeChanges
// call. Optionally, you can specify your own observeChanges callbacks which are
// invoked immediately before the docs field is updated; this object is made
// available as `this` to those callbacks.

LocalCollection._CachingChangeObserver = class _CachingChangeObserver {
  constructor() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    const orderedFromCallbacks = options.callbacks && LocalCollection._observeChangesCallbacksAreOrdered(options.callbacks);

    if (hasOwn.call(options, 'ordered')) {
      this.ordered = options.ordered;

      if (options.callbacks && options.ordered !== orderedFromCallbacks) {
        throw Error('ordered option doesn\'t match callbacks');
      }
    } else if (options.callbacks) {
      this.ordered = orderedFromCallbacks;
    } else {
      throw Error('must provide ordered or callbacks');
    }

    const callbacks = options.callbacks || {};

    if (this.ordered) {
      this.docs = new OrderedDict(MongoID.idStringify);
      this.applyChange = {
        addedBefore: (id, fields, before) => {
          const doc = EJSON.clone(fields);
          doc._id = id;

          if (callbacks.addedBefore) {
            callbacks.addedBefore.call(this, id, fields, before);
          } // This line triggers if we provide added with movedBefore.


          if (callbacks.added) {
            callbacks.added.call(this, id, fields);
          } // XXX could `before` be a falsy ID?  Technically
          // idStringify seems to allow for them -- though
          // OrderedDict won't call stringify on a falsy arg.


          this.docs.putBefore(id, doc, before || null);
        },
        movedBefore: (id, before) => {
          const doc = this.docs.get(id);

          if (callbacks.movedBefore) {
            callbacks.movedBefore.call(this, id, before);
          }

          this.docs.moveBefore(id, before || null);
        }
      };
    } else {
      this.docs = new LocalCollection._IdMap();
      this.applyChange = {
        added: (id, fields) => {
          const doc = EJSON.clone(fields);

          if (callbacks.added) {
            callbacks.added.call(this, id, fields);
          }

          doc._id = id;
          this.docs.set(id, doc);
        }
      };
    } // The methods in _IdMap and OrderedDict used by these callbacks are
    // identical.


    this.applyChange.changed = (id, fields) => {
      const doc = this.docs.get(id);

      if (!doc) {
        throw new Error("Unknown id for changed: ".concat(id));
      }

      if (callbacks.changed) {
        callbacks.changed.call(this, id, EJSON.clone(fields));
      }

      DiffSequence.applyChanges(doc, fields);
    };

    this.applyChange.removed = id => {
      if (callbacks.removed) {
        callbacks.removed.call(this, id);
      }

      this.docs.remove(id);
    };
  }

};
LocalCollection._IdMap = class _IdMap extends IdMap {
  constructor() {
    super(MongoID.idStringify, MongoID.idParse);
  }

}; // Wrap a transform function to return objects that have the _id field
// of the untransformed document. This ensures that subsystems such as
// the observe-sequence package that call `observe` can keep track of
// the documents identities.
//
// - Require that it returns objects
// - If the return value has an _id field, verify that it matches the
//   original _id field
// - If the return value doesn't have an _id field, add it back.

LocalCollection.wrapTransform = transform => {
  if (!transform) {
    return null;
  } // No need to doubly-wrap transforms.


  if (transform.__wrappedTransform__) {
    return transform;
  }

  const wrapped = doc => {
    if (!hasOwn.call(doc, '_id')) {
      // XXX do we ever have a transform on the oplog's collection? because that
      // collection has no _id.
      throw new Error('can only transform documents with _id');
    }

    const id = doc._id; // XXX consider making tracker a weak dependency and checking
    // Package.tracker here

    const transformed = Tracker.nonreactive(() => transform(doc));

    if (!LocalCollection._isPlainObject(transformed)) {
      throw new Error('transform must return object');
    }

    if (hasOwn.call(transformed, '_id')) {
      if (!EJSON.equals(transformed._id, id)) {
        throw new Error('transformed document can\'t have different _id');
      }
    } else {
      transformed._id = id;
    }

    return transformed;
  };

  wrapped.__wrappedTransform__ = true;
  return wrapped;
}; // XXX the sorted-query logic below is laughably inefficient. we'll
// need to come up with a better datastructure for this.
//
// XXX the logic for observing with a skip or a limit is even more
// laughably inefficient. we recompute the whole results every time!
// This binary search puts a value between any equal values, and the first
// lesser value.


LocalCollection._binarySearch = (cmp, array, value) => {
  let first = 0;
  let range = array.length;

  while (range > 0) {
    const halfRange = Math.floor(range / 2);

    if (cmp(value, array[first + halfRange]) >= 0) {
      first += halfRange + 1;
      range -= halfRange + 1;
    } else {
      range = halfRange;
    }
  }

  return first;
};

LocalCollection._checkSupportedProjection = fields => {
  if (fields !== Object(fields) || Array.isArray(fields)) {
    throw MinimongoError('fields option must be an object');
  }

  Object.keys(fields).forEach(keyPath => {
    if (keyPath.split('.').includes('$')) {
      throw MinimongoError('Minimongo doesn\'t support $ operator in projections yet.');
    }

    const value = fields[keyPath];

    if (typeof value === 'object' && ['$elemMatch', '$meta', '$slice'].some(key => hasOwn.call(value, key))) {
      throw MinimongoError('Minimongo doesn\'t support operators in projections yet.');
    }

    if (![1, 0, true, false].includes(value)) {
      throw MinimongoError('Projection values should be one of 1, 0, true, or false');
    }
  });
}; // Knows how to compile a fields projection to a predicate function.
// @returns - Function: a closure that filters out an object according to the
//            fields projection rules:
//            @param obj - Object: MongoDB-styled document
//            @returns - Object: a document with the fields filtered out
//                       according to projection rules. Doesn't retain subfields
//                       of passed argument.


LocalCollection._compileProjection = fields => {
  LocalCollection._checkSupportedProjection(fields);

  const _idProjection = fields._id === undefined ? true : fields._id;

  const details = projectionDetails(fields); // returns transformed doc according to ruleTree

  const transform = (doc, ruleTree) => {
    // Special case for "sets"
    if (Array.isArray(doc)) {
      return doc.map(subdoc => transform(subdoc, ruleTree));
    }

    const result = details.including ? {} : EJSON.clone(doc);
    Object.keys(ruleTree).forEach(key => {
      if (!hasOwn.call(doc, key)) {
        return;
      }

      const rule = ruleTree[key];

      if (rule === Object(rule)) {
        // For sub-objects/subsets we branch
        if (doc[key] === Object(doc[key])) {
          result[key] = transform(doc[key], rule);
        }
      } else if (details.including) {
        // Otherwise we don't even touch this subfield
        result[key] = EJSON.clone(doc[key]);
      } else {
        delete result[key];
      }
    });
    return result;
  };

  return doc => {
    const result = transform(doc, details.tree);

    if (_idProjection && hasOwn.call(doc, '_id')) {
      result._id = doc._id;
    }

    if (!_idProjection && hasOwn.call(result, '_id')) {
      delete result._id;
    }

    return result;
  };
}; // Calculates the document to insert in case we're doing an upsert and the
// selector does not match any elements


LocalCollection._createUpsertDocument = (selector, modifier) => {
  const selectorDocument = populateDocumentWithQueryFields(selector);

  const isModify = LocalCollection._isModificationMod(modifier);

  const newDoc = {};

  if (selectorDocument._id) {
    newDoc._id = selectorDocument._id;
    delete selectorDocument._id;
  } // This double _modify call is made to help with nested properties (see issue
  // #8631). We do this even if it's a replacement for validation purposes (e.g.
  // ambiguous id's)


  LocalCollection._modify(newDoc, {
    $set: selectorDocument
  });

  LocalCollection._modify(newDoc, modifier, {
    isInsert: true
  });

  if (isModify) {
    return newDoc;
  } // Replacement can take _id from query document


  const replacement = Object.assign({}, modifier);

  if (newDoc._id) {
    replacement._id = newDoc._id;
  }

  return replacement;
};

LocalCollection._diffObjects = (left, right, callbacks) => {
  return DiffSequence.diffObjects(left, right, callbacks);
}; // ordered: bool.
// old_results and new_results: collections of documents.
//    if ordered, they are arrays.
//    if unordered, they are IdMaps


LocalCollection._diffQueryChanges = (ordered, oldResults, newResults, observer, options) => DiffSequence.diffQueryChanges(ordered, oldResults, newResults, observer, options);

LocalCollection._diffQueryOrderedChanges = (oldResults, newResults, observer, options) => DiffSequence.diffQueryOrderedChanges(oldResults, newResults, observer, options);

LocalCollection._diffQueryUnorderedChanges = (oldResults, newResults, observer, options) => DiffSequence.diffQueryUnorderedChanges(oldResults, newResults, observer, options);

LocalCollection._findInOrderedResults = (query, doc) => {
  if (!query.ordered) {
    throw new Error('Can\'t call _findInOrderedResults on unordered query');
  }

  for (let i = 0; i < query.results.length; i++) {
    if (query.results[i] === doc) {
      return i;
    }
  }

  throw Error('object missing from query');
}; // If this is a selector which explicitly constrains the match by ID to a finite
// number of documents, returns a list of their IDs.  Otherwise returns
// null. Note that the selector may have other restrictions so it may not even
// match those document!  We care about $in and $and since those are generated
// access-controlled update and remove.


LocalCollection._idsMatchedBySelector = selector => {
  // Is the selector just an ID?
  if (LocalCollection._selectorIsId(selector)) {
    return [selector];
  }

  if (!selector) {
    return null;
  } // Do we have an _id clause?


  if (hasOwn.call(selector, '_id')) {
    // Is the _id clause just an ID?
    if (LocalCollection._selectorIsId(selector._id)) {
      return [selector._id];
    } // Is the _id clause {_id: {$in: ["x", "y", "z"]}}?


    if (selector._id && Array.isArray(selector._id.$in) && selector._id.$in.length && selector._id.$in.every(LocalCollection._selectorIsId)) {
      return selector._id.$in;
    }

    return null;
  } // If this is a top-level $and, and any of the clauses constrain their
  // documents, then the whole selector is constrained by any one clause's
  // constraint. (Well, by their intersection, but that seems unlikely.)


  if (Array.isArray(selector.$and)) {
    for (let i = 0; i < selector.$and.length; ++i) {
      const subIds = LocalCollection._idsMatchedBySelector(selector.$and[i]);

      if (subIds) {
        return subIds;
      }
    }
  }

  return null;
};

LocalCollection._insertInResults = (query, doc) => {
  const fields = EJSON.clone(doc);
  delete fields._id;

  if (query.ordered) {
    if (!query.sorter) {
      query.addedBefore(doc._id, query.projectionFn(fields), null);
      query.results.push(doc);
    } else {
      const i = LocalCollection._insertInSortedList(query.sorter.getComparator({
        distances: query.distances
      }), query.results, doc);

      let next = query.results[i + 1];

      if (next) {
        next = next._id;
      } else {
        next = null;
      }

      query.addedBefore(doc._id, query.projectionFn(fields), next);
    }

    query.added(doc._id, query.projectionFn(fields));
  } else {
    query.added(doc._id, query.projectionFn(fields));
    query.results.set(doc._id, doc);
  }
};

LocalCollection._insertInSortedList = (cmp, array, value) => {
  if (array.length === 0) {
    array.push(value);
    return 0;
  }

  const i = LocalCollection._binarySearch(cmp, array, value);

  array.splice(i, 0, value);
  return i;
};

LocalCollection._isModificationMod = mod => {
  let isModify = false;
  let isReplace = false;
  Object.keys(mod).forEach(key => {
    if (key.substr(0, 1) === '$') {
      isModify = true;
    } else {
      isReplace = true;
    }
  });

  if (isModify && isReplace) {
    throw new Error('Update parameter cannot have both modifier and non-modifier fields.');
  }

  return isModify;
}; // XXX maybe this should be EJSON.isObject, though EJSON doesn't know about
// RegExp
// XXX note that _type(undefined) === 3!!!!


LocalCollection._isPlainObject = x => {
  return x && LocalCollection._f._type(x) === 3;
}; // XXX need a strategy for passing the binding of $ into this
// function, from the compiled selector
//
// maybe just {key.up.to.just.before.dollarsign: array_index}
//
// XXX atomicity: if one modification fails, do we roll back the whole
// change?
//
// options:
//   - isInsert is set when _modify is being called to compute the document to
//     insert as part of an upsert operation. We use this primarily to figure
//     out when to set the fields in $setOnInsert, if present.


LocalCollection._modify = function (doc, modifier) {
  let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  if (!LocalCollection._isPlainObject(modifier)) {
    throw MinimongoError('Modifier must be an object');
  } // Make sure the caller can't mutate our data structures.


  modifier = EJSON.clone(modifier);
  const isModifier = isOperatorObject(modifier);
  const newDoc = isModifier ? EJSON.clone(doc) : modifier;

  if (isModifier) {
    // apply modifiers to the doc.
    Object.keys(modifier).forEach(operator => {
      // Treat $setOnInsert as $set if this is an insert.
      const setOnInsert = options.isInsert && operator === '$setOnInsert';
      const modFunc = MODIFIERS[setOnInsert ? '$set' : operator];
      const operand = modifier[operator];

      if (!modFunc) {
        throw MinimongoError("Invalid modifier specified ".concat(operator));
      }

      Object.keys(operand).forEach(keypath => {
        const arg = operand[keypath];

        if (keypath === '') {
          throw MinimongoError('An empty update path is not valid.');
        }

        const keyparts = keypath.split('.');

        if (!keyparts.every(Boolean)) {
          throw MinimongoError("The update path '".concat(keypath, "' contains an empty field name, ") + 'which is not allowed.');
        }

        const target = findModTarget(newDoc, keyparts, {
          arrayIndices: options.arrayIndices,
          forbidArray: operator === '$rename',
          noCreate: NO_CREATE_MODIFIERS[operator]
        });
        modFunc(target, keyparts.pop(), arg, keypath, newDoc);
      });
    });

    if (doc._id && !EJSON.equals(doc._id, newDoc._id)) {
      throw MinimongoError("After applying the update to the document {_id: \"".concat(doc._id, "\", ...},") + ' the (immutable) field \'_id\' was found to have been altered to ' + "_id: \"".concat(newDoc._id, "\""));
    }
  } else {
    if (doc._id && modifier._id && !EJSON.equals(doc._id, modifier._id)) {
      throw MinimongoError("The _id field cannot be changed from {_id: \"".concat(doc._id, "\"} to ") + "{_id: \"".concat(modifier._id, "\"}"));
    } // replace the whole document


    assertHasValidFieldNames(modifier);
  } // move new document into place.


  Object.keys(doc).forEach(key => {
    // Note: this used to be for (var key in doc) however, this does not
    // work right in Opera. Deleting from a doc while iterating over it
    // would sometimes cause opera to skip some keys.
    if (key !== '_id') {
      delete doc[key];
    }
  });
  Object.keys(newDoc).forEach(key => {
    doc[key] = newDoc[key];
  });
};

LocalCollection._observeFromObserveChanges = (cursor, observeCallbacks) => {
  const transform = cursor.getTransform() || (doc => doc);

  let suppressed = !!observeCallbacks._suppress_initial;
  let observeChangesCallbacks;

  if (LocalCollection._observeCallbacksAreOrdered(observeCallbacks)) {
    // The "_no_indices" option sets all index arguments to -1 and skips the
    // linear scans required to generate them.  This lets observers that don't
    // need absolute indices benefit from the other features of this API --
    // relative order, transforms, and applyChanges -- without the speed hit.
    const indices = !observeCallbacks._no_indices;
    observeChangesCallbacks = {
      addedBefore(id, fields, before) {
        if (suppressed || !(observeCallbacks.addedAt || observeCallbacks.added)) {
          return;
        }

        const doc = transform(Object.assign(fields, {
          _id: id
        }));

        if (observeCallbacks.addedAt) {
          observeCallbacks.addedAt(doc, indices ? before ? this.docs.indexOf(before) : this.docs.size() : -1, before);
        } else {
          observeCallbacks.added(doc);
        }
      },

      changed(id, fields) {
        if (!(observeCallbacks.changedAt || observeCallbacks.changed)) {
          return;
        }

        let doc = EJSON.clone(this.docs.get(id));

        if (!doc) {
          throw new Error("Unknown id for changed: ".concat(id));
        }

        const oldDoc = transform(EJSON.clone(doc));
        DiffSequence.applyChanges(doc, fields);

        if (observeCallbacks.changedAt) {
          observeCallbacks.changedAt(transform(doc), oldDoc, indices ? this.docs.indexOf(id) : -1);
        } else {
          observeCallbacks.changed(transform(doc), oldDoc);
        }
      },

      movedBefore(id, before) {
        if (!observeCallbacks.movedTo) {
          return;
        }

        const from = indices ? this.docs.indexOf(id) : -1;
        let to = indices ? before ? this.docs.indexOf(before) : this.docs.size() : -1; // When not moving backwards, adjust for the fact that removing the
        // document slides everything back one slot.

        if (to > from) {
          --to;
        }

        observeCallbacks.movedTo(transform(EJSON.clone(this.docs.get(id))), from, to, before || null);
      },

      removed(id) {
        if (!(observeCallbacks.removedAt || observeCallbacks.removed)) {
          return;
        } // technically maybe there should be an EJSON.clone here, but it's about
        // to be removed from this.docs!


        const doc = transform(this.docs.get(id));

        if (observeCallbacks.removedAt) {
          observeCallbacks.removedAt(doc, indices ? this.docs.indexOf(id) : -1);
        } else {
          observeCallbacks.removed(doc);
        }
      }

    };
  } else {
    observeChangesCallbacks = {
      added(id, fields) {
        if (!suppressed && observeCallbacks.added) {
          observeCallbacks.added(transform(Object.assign(fields, {
            _id: id
          })));
        }
      },

      changed(id, fields) {
        if (observeCallbacks.changed) {
          const oldDoc = this.docs.get(id);
          const doc = EJSON.clone(oldDoc);
          DiffSequence.applyChanges(doc, fields);
          observeCallbacks.changed(transform(doc), transform(EJSON.clone(oldDoc)));
        }
      },

      removed(id) {
        if (observeCallbacks.removed) {
          observeCallbacks.removed(transform(this.docs.get(id)));
        }
      }

    };
  }

  const changeObserver = new LocalCollection._CachingChangeObserver({
    callbacks: observeChangesCallbacks
  });
  const handle = cursor.observeChanges(changeObserver.applyChange);
  suppressed = false;
  return handle;
};

LocalCollection._observeCallbacksAreOrdered = callbacks => {
  if (callbacks.added && callbacks.addedAt) {
    throw new Error('Please specify only one of added() and addedAt()');
  }

  if (callbacks.changed && callbacks.changedAt) {
    throw new Error('Please specify only one of changed() and changedAt()');
  }

  if (callbacks.removed && callbacks.removedAt) {
    throw new Error('Please specify only one of removed() and removedAt()');
  }

  return !!(callbacks.addedAt || callbacks.changedAt || callbacks.movedTo || callbacks.removedAt);
};

LocalCollection._observeChangesCallbacksAreOrdered = callbacks => {
  if (callbacks.added && callbacks.addedBefore) {
    throw new Error('Please specify only one of added() and addedBefore()');
  }

  return !!(callbacks.addedBefore || callbacks.movedBefore);
};

LocalCollection._removeFromResults = (query, doc) => {
  if (query.ordered) {
    const i = LocalCollection._findInOrderedResults(query, doc);

    query.removed(doc._id);
    query.results.splice(i, 1);
  } else {
    const id = doc._id; // in case callback mutates doc

    query.removed(doc._id);
    query.results.remove(id);
  }
}; // Is this selector just shorthand for lookup by _id?


LocalCollection._selectorIsId = selector => typeof selector === 'number' || typeof selector === 'string' || selector instanceof MongoID.ObjectID; // Is the selector just lookup by _id (shorthand or not)?


LocalCollection._selectorIsIdPerhapsAsObject = selector => LocalCollection._selectorIsId(selector) || LocalCollection._selectorIsId(selector && selector._id) && Object.keys(selector).length === 1;

LocalCollection._updateInResults = (query, doc, old_doc) => {
  if (!EJSON.equals(doc._id, old_doc._id)) {
    throw new Error('Can\'t change a doc\'s _id while updating');
  }

  const projectionFn = query.projectionFn;
  const changedFields = DiffSequence.makeChangedFields(projectionFn(doc), projectionFn(old_doc));

  if (!query.ordered) {
    if (Object.keys(changedFields).length) {
      query.changed(doc._id, changedFields);
      query.results.set(doc._id, doc);
    }

    return;
  }

  const old_idx = LocalCollection._findInOrderedResults(query, doc);

  if (Object.keys(changedFields).length) {
    query.changed(doc._id, changedFields);
  }

  if (!query.sorter) {
    return;
  } // just take it out and put it back in again, and see if the index changes


  query.results.splice(old_idx, 1);

  const new_idx = LocalCollection._insertInSortedList(query.sorter.getComparator({
    distances: query.distances
  }), query.results, doc);

  if (old_idx !== new_idx) {
    let next = query.results[new_idx + 1];

    if (next) {
      next = next._id;
    } else {
      next = null;
    }

    query.movedBefore && query.movedBefore(doc._id, next);
  }
};

const MODIFIERS = {
  $currentDate(target, field, arg) {
    if (typeof arg === 'object' && hasOwn.call(arg, '$type')) {
      if (arg.$type !== 'date') {
        throw MinimongoError('Minimongo does currently only support the date type in ' + '$currentDate modifiers', {
          field
        });
      }
    } else if (arg !== true) {
      throw MinimongoError('Invalid $currentDate modifier', {
        field
      });
    }

    target[field] = new Date();
  },

  $min(target, field, arg) {
    if (typeof arg !== 'number') {
      throw MinimongoError('Modifier $min allowed for numbers only', {
        field
      });
    }

    if (field in target) {
      if (typeof target[field] !== 'number') {
        throw MinimongoError('Cannot apply $min modifier to non-number', {
          field
        });
      }

      if (target[field] > arg) {
        target[field] = arg;
      }
    } else {
      target[field] = arg;
    }
  },

  $max(target, field, arg) {
    if (typeof arg !== 'number') {
      throw MinimongoError('Modifier $max allowed for numbers only', {
        field
      });
    }

    if (field in target) {
      if (typeof target[field] !== 'number') {
        throw MinimongoError('Cannot apply $max modifier to non-number', {
          field
        });
      }

      if (target[field] < arg) {
        target[field] = arg;
      }
    } else {
      target[field] = arg;
    }
  },

  $inc(target, field, arg) {
    if (typeof arg !== 'number') {
      throw MinimongoError('Modifier $inc allowed for numbers only', {
        field
      });
    }

    if (field in target) {
      if (typeof target[field] !== 'number') {
        throw MinimongoError('Cannot apply $inc modifier to non-number', {
          field
        });
      }

      target[field] += arg;
    } else {
      target[field] = arg;
    }
  },

  $set(target, field, arg) {
    if (target !== Object(target)) {
      // not an array or an object
      const error = MinimongoError('Cannot set property on non-object field', {
        field
      });
      error.setPropertyError = true;
      throw error;
    }

    if (target === null) {
      const error = MinimongoError('Cannot set property on null', {
        field
      });
      error.setPropertyError = true;
      throw error;
    }

    assertHasValidFieldNames(arg);
    target[field] = arg;
  },

  $setOnInsert(target, field, arg) {// converted to `$set` in `_modify`
  },

  $unset(target, field, arg) {
    if (target !== undefined) {
      if (target instanceof Array) {
        if (field in target) {
          target[field] = null;
        }
      } else {
        delete target[field];
      }
    }
  },

  $push(target, field, arg) {
    if (target[field] === undefined) {
      target[field] = [];
    }

    if (!(target[field] instanceof Array)) {
      throw MinimongoError('Cannot apply $push modifier to non-array', {
        field
      });
    }

    if (!(arg && arg.$each)) {
      // Simple mode: not $each
      assertHasValidFieldNames(arg);
      target[field].push(arg);
      return;
    } // Fancy mode: $each (and maybe $slice and $sort and $position)


    const toPush = arg.$each;

    if (!(toPush instanceof Array)) {
      throw MinimongoError('$each must be an array', {
        field
      });
    }

    assertHasValidFieldNames(toPush); // Parse $position

    let position = undefined;

    if ('$position' in arg) {
      if (typeof arg.$position !== 'number') {
        throw MinimongoError('$position must be a numeric value', {
          field
        });
      } // XXX should check to make sure integer


      if (arg.$position < 0) {
        throw MinimongoError('$position in $push must be zero or positive', {
          field
        });
      }

      position = arg.$position;
    } // Parse $slice.


    let slice = undefined;

    if ('$slice' in arg) {
      if (typeof arg.$slice !== 'number') {
        throw MinimongoError('$slice must be a numeric value', {
          field
        });
      } // XXX should check to make sure integer


      slice = arg.$slice;
    } // Parse $sort.


    let sortFunction = undefined;

    if (arg.$sort) {
      if (slice === undefined) {
        throw MinimongoError('$sort requires $slice to be present', {
          field
        });
      } // XXX this allows us to use a $sort whose value is an array, but that's
      // actually an extension of the Node driver, so it won't work
      // server-side. Could be confusing!
      // XXX is it correct that we don't do geo-stuff here?


      sortFunction = new Minimongo.Sorter(arg.$sort).getComparator();
      toPush.forEach(element => {
        if (LocalCollection._f._type(element) !== 3) {
          throw MinimongoError('$push like modifiers using $sort require all elements to be ' + 'objects', {
            field
          });
        }
      });
    } // Actually push.


    if (position === undefined) {
      toPush.forEach(element => {
        target[field].push(element);
      });
    } else {
      const spliceArguments = [position, 0];
      toPush.forEach(element => {
        spliceArguments.push(element);
      });
      target[field].splice(...spliceArguments);
    } // Actually sort.


    if (sortFunction) {
      target[field].sort(sortFunction);
    } // Actually slice.


    if (slice !== undefined) {
      if (slice === 0) {
        target[field] = []; // differs from Array.slice!
      } else if (slice < 0) {
        target[field] = target[field].slice(slice);
      } else {
        target[field] = target[field].slice(0, slice);
      }
    }
  },

  $pushAll(target, field, arg) {
    if (!(typeof arg === 'object' && arg instanceof Array)) {
      throw MinimongoError('Modifier $pushAll/pullAll allowed for arrays only');
    }

    assertHasValidFieldNames(arg);
    const toPush = target[field];

    if (toPush === undefined) {
      target[field] = arg;
    } else if (!(toPush instanceof Array)) {
      throw MinimongoError('Cannot apply $pushAll modifier to non-array', {
        field
      });
    } else {
      toPush.push(...arg);
    }
  },

  $addToSet(target, field, arg) {
    let isEach = false;

    if (typeof arg === 'object') {
      // check if first key is '$each'
      const keys = Object.keys(arg);

      if (keys[0] === '$each') {
        isEach = true;
      }
    }

    const values = isEach ? arg.$each : [arg];
    assertHasValidFieldNames(values);
    const toAdd = target[field];

    if (toAdd === undefined) {
      target[field] = values;
    } else if (!(toAdd instanceof Array)) {
      throw MinimongoError('Cannot apply $addToSet modifier to non-array', {
        field
      });
    } else {
      values.forEach(value => {
        if (toAdd.some(element => LocalCollection._f._equal(value, element))) {
          return;
        }

        toAdd.push(value);
      });
    }
  },

  $pop(target, field, arg) {
    if (target === undefined) {
      return;
    }

    const toPop = target[field];

    if (toPop === undefined) {
      return;
    }

    if (!(toPop instanceof Array)) {
      throw MinimongoError('Cannot apply $pop modifier to non-array', {
        field
      });
    }

    if (typeof arg === 'number' && arg < 0) {
      toPop.splice(0, 1);
    } else {
      toPop.pop();
    }
  },

  $pull(target, field, arg) {
    if (target === undefined) {
      return;
    }

    const toPull = target[field];

    if (toPull === undefined) {
      return;
    }

    if (!(toPull instanceof Array)) {
      throw MinimongoError('Cannot apply $pull/pullAll modifier to non-array', {
        field
      });
    }

    let out;

    if (arg != null && typeof arg === 'object' && !(arg instanceof Array)) {
      // XXX would be much nicer to compile this once, rather than
      // for each document we modify.. but usually we're not
      // modifying that many documents, so we'll let it slide for
      // now
      // XXX Minimongo.Matcher isn't up for the job, because we need
      // to permit stuff like {$pull: {a: {$gt: 4}}}.. something
      // like {$gt: 4} is not normally a complete selector.
      // same issue as $elemMatch possibly?
      const matcher = new Minimongo.Matcher(arg);
      out = toPull.filter(element => !matcher.documentMatches(element).result);
    } else {
      out = toPull.filter(element => !LocalCollection._f._equal(element, arg));
    }

    target[field] = out;
  },

  $pullAll(target, field, arg) {
    if (!(typeof arg === 'object' && arg instanceof Array)) {
      throw MinimongoError('Modifier $pushAll/pullAll allowed for arrays only', {
        field
      });
    }

    if (target === undefined) {
      return;
    }

    const toPull = target[field];

    if (toPull === undefined) {
      return;
    }

    if (!(toPull instanceof Array)) {
      throw MinimongoError('Cannot apply $pull/pullAll modifier to non-array', {
        field
      });
    }

    target[field] = toPull.filter(object => !arg.some(element => LocalCollection._f._equal(object, element)));
  },

  $rename(target, field, arg, keypath, doc) {
    // no idea why mongo has this restriction..
    if (keypath === arg) {
      throw MinimongoError('$rename source must differ from target', {
        field
      });
    }

    if (target === null) {
      throw MinimongoError('$rename source field invalid', {
        field
      });
    }

    if (typeof arg !== 'string') {
      throw MinimongoError('$rename target must be a string', {
        field
      });
    }

    if (arg.includes('\0')) {
      // Null bytes are not allowed in Mongo field names
      // https://docs.mongodb.com/manual/reference/limits/#Restrictions-on-Field-Names
      throw MinimongoError('The \'to\' field for $rename cannot contain an embedded null byte', {
        field
      });
    }

    if (target === undefined) {
      return;
    }

    const object = target[field];
    delete target[field];
    const keyparts = arg.split('.');
    const target2 = findModTarget(doc, keyparts, {
      forbidArray: true
    });

    if (target2 === null) {
      throw MinimongoError('$rename target field invalid', {
        field
      });
    }

    target2[keyparts.pop()] = object;
  },

  $bit(target, field, arg) {
    // XXX mongo only supports $bit on integers, and we only support
    // native javascript numbers (doubles) so far, so we can't support $bit
    throw MinimongoError('$bit is not supported', {
      field
    });
  },

  $v() {// As discussed in https://github.com/meteor/meteor/issues/9623,
    // the `$v` operator is not needed by Meteor, but problems can occur if
    // it's not at least callable (as of Mongo >= 3.6). It's defined here as
    // a no-op to work around these problems.
  }

};
const NO_CREATE_MODIFIERS = {
  $pop: true,
  $pull: true,
  $pullAll: true,
  $rename: true,
  $unset: true
}; // Make sure field names do not contain Mongo restricted
// characters ('.', '$', '\0').
// https://docs.mongodb.com/manual/reference/limits/#Restrictions-on-Field-Names

const invalidCharMsg = {
  $: 'start with \'$\'',
  '.': 'contain \'.\'',
  '\0': 'contain null bytes'
}; // checks if all field names in an object are valid

function assertHasValidFieldNames(doc) {
  if (doc && typeof doc === 'object') {
    JSON.stringify(doc, (key, value) => {
      assertIsValidFieldName(key);
      return value;
    });
  }
}

function assertIsValidFieldName(key) {
  let match;

  if (typeof key === 'string' && (match = key.match(/^\$|\.|\0/))) {
    throw MinimongoError("Key ".concat(key, " must not ").concat(invalidCharMsg[match[0]]));
  }
} // for a.b.c.2.d.e, keyparts should be ['a', 'b', 'c', '2', 'd', 'e'],
// and then you would operate on the 'e' property of the returned
// object.
//
// if options.noCreate is falsey, creates intermediate levels of
// structure as necessary, like mkdir -p (and raises an exception if
// that would mean giving a non-numeric property to an array.) if
// options.noCreate is true, return undefined instead.
//
// may modify the last element of keyparts to signal to the caller that it needs
// to use a different value to index into the returned object (for example,
// ['a', '01'] -> ['a', 1]).
//
// if forbidArray is true, return null if the keypath goes through an array.
//
// if options.arrayIndices is set, use its first element for the (first) '$' in
// the path.


function findModTarget(doc, keyparts) {
  let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  let usedArrayIndex = false;

  for (let i = 0; i < keyparts.length; i++) {
    const last = i === keyparts.length - 1;
    let keypart = keyparts[i];

    if (!isIndexable(doc)) {
      if (options.noCreate) {
        return undefined;
      }

      const error = MinimongoError("cannot use the part '".concat(keypart, "' to traverse ").concat(doc));
      error.setPropertyError = true;
      throw error;
    }

    if (doc instanceof Array) {
      if (options.forbidArray) {
        return null;
      }

      if (keypart === '$') {
        if (usedArrayIndex) {
          throw MinimongoError('Too many positional (i.e. \'$\') elements');
        }

        if (!options.arrayIndices || !options.arrayIndices.length) {
          throw MinimongoError('The positional operator did not find the match needed from the ' + 'query');
        }

        keypart = options.arrayIndices[0];
        usedArrayIndex = true;
      } else if (isNumericKey(keypart)) {
        keypart = parseInt(keypart);
      } else {
        if (options.noCreate) {
          return undefined;
        }

        throw MinimongoError("can't append to array using string field name [".concat(keypart, "]"));
      }

      if (last) {
        keyparts[i] = keypart; // handle 'a.01'
      }

      if (options.noCreate && keypart >= doc.length) {
        return undefined;
      }

      while (doc.length < keypart) {
        doc.push(null);
      }

      if (!last) {
        if (doc.length === keypart) {
          doc.push({});
        } else if (typeof doc[keypart] !== 'object') {
          throw MinimongoError("can't modify field '".concat(keyparts[i + 1], "' of list value ") + JSON.stringify(doc[keypart]));
        }
      }
    } else {
      assertIsValidFieldName(keypart);

      if (!(keypart in doc)) {
        if (options.noCreate) {
          return undefined;
        }

        if (!last) {
          doc[keypart] = {};
        }
      }
    }

    if (last) {
      return doc;
    }

    doc = doc[keypart];
  } // notreached

}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"matcher.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/minimongo/matcher.js                                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  default: () => Matcher
});
let LocalCollection;
module.link("./local_collection.js", {
  default(v) {
    LocalCollection = v;
  }

}, 0);
let compileDocumentSelector, hasOwn, nothingMatcher;
module.link("./common.js", {
  compileDocumentSelector(v) {
    compileDocumentSelector = v;
  },

  hasOwn(v) {
    hasOwn = v;
  },

  nothingMatcher(v) {
    nothingMatcher = v;
  }

}, 1);

class Matcher {
  constructor(selector, isUpdate) {
    // A set (object mapping string -> *) of all of the document paths looked
    // at by the selector. Also includes the empty string if it may look at any
    // path (eg, $where).
    this._paths = {}; // Set to true if compilation finds a $near.

    this._hasGeoQuery = false; // Set to true if compilation finds a $where.

    this._hasWhere = false; // Set to false if compilation finds anything other than a simple equality
    // or one or more of '$gt', '$gte', '$lt', '$lte', '$ne', '$in', '$nin' used
    // with scalars as operands.

    this._isSimple = true; // Set to a dummy document which always matches this Matcher. Or set to null
    // if such document is too hard to find.

    this._matchingDocument = undefined; // A clone of the original selector. It may just be a function if the user
    // passed in a function; otherwise is definitely an object (eg, IDs are
    // translated into {_id: ID} first. Used by canBecomeTrueByModifier and
    // Sorter._useWithMatcher.

    this._selector = null;
    this._docMatcher = this._compileSelector(selector); // Set to true if selection is done for an update operation
    // Default is false
    // Used for $near array update (issue #3599)

    this._isUpdate = isUpdate;
  }

  documentMatches(doc) {
    if (doc !== Object(doc)) {
      throw Error('documentMatches needs a document');
    }

    return this._docMatcher(doc);
  }

  hasGeoQuery() {
    return this._hasGeoQuery;
  }

  hasWhere() {
    return this._hasWhere;
  }

  isSimple() {
    return this._isSimple;
  } // Given a selector, return a function that takes one argument, a
  // document. It returns a result object.


  _compileSelector(selector) {
    // you can pass a literal function instead of a selector
    if (selector instanceof Function) {
      this._isSimple = false;
      this._selector = selector;

      this._recordPathUsed('');

      return doc => ({
        result: !!selector.call(doc)
      });
    } // shorthand -- scalar _id


    if (LocalCollection._selectorIsId(selector)) {
      this._selector = {
        _id: selector
      };

      this._recordPathUsed('_id');

      return doc => ({
        result: EJSON.equals(doc._id, selector)
      });
    } // protect against dangerous selectors.  falsey and {_id: falsey} are both
    // likely programmer error, and not what you want, particularly for
    // destructive operations.


    if (!selector || hasOwn.call(selector, '_id') && !selector._id) {
      this._isSimple = false;
      return nothingMatcher;
    } // Top level can't be an array or true or binary.


    if (Array.isArray(selector) || EJSON.isBinary(selector) || typeof selector === 'boolean') {
      throw new Error("Invalid selector: ".concat(selector));
    }

    this._selector = EJSON.clone(selector);
    return compileDocumentSelector(selector, this, {
      isRoot: true
    });
  } // Returns a list of key paths the given selector is looking for. It includes
  // the empty string if there is a $where.


  _getPaths() {
    return Object.keys(this._paths);
  }

  _recordPathUsed(path) {
    this._paths[path] = true;
  }

}

// helpers used by compiled selector code
LocalCollection._f = {
  // XXX for _all and _in, consider building 'inquery' at compile time..
  _type(v) {
    if (typeof v === 'number') {
      return 1;
    }

    if (typeof v === 'string') {
      return 2;
    }

    if (typeof v === 'boolean') {
      return 8;
    }

    if (Array.isArray(v)) {
      return 4;
    }

    if (v === null) {
      return 10;
    } // note that typeof(/x/) === "object"


    if (v instanceof RegExp) {
      return 11;
    }

    if (typeof v === 'function') {
      return 13;
    }

    if (v instanceof Date) {
      return 9;
    }

    if (EJSON.isBinary(v)) {
      return 5;
    }

    if (v instanceof MongoID.ObjectID) {
      return 7;
    } // object


    return 3; // XXX support some/all of these:
    // 14, symbol
    // 15, javascript code with scope
    // 16, 18: 32-bit/64-bit integer
    // 17, timestamp
    // 255, minkey
    // 127, maxkey
  },

  // deep equality test: use for literal document and array matches
  _equal(a, b) {
    return EJSON.equals(a, b, {
      keyOrderSensitive: true
    });
  },

  // maps a type code to a value that can be used to sort values of different
  // types
  _typeorder(t) {
    // http://www.mongodb.org/display/DOCS/What+is+the+Compare+Order+for+BSON+Types
    // XXX what is the correct sort position for Javascript code?
    // ('100' in the matrix below)
    // XXX minkey/maxkey
    return [-1, // (not a type)
    1, // number
    2, // string
    3, // object
    4, // array
    5, // binary
    -1, // deprecated
    6, // ObjectID
    7, // bool
    8, // Date
    0, // null
    9, // RegExp
    -1, // deprecated
    100, // JS code
    2, // deprecated (symbol)
    100, // JS code
    1, // 32-bit int
    8, // Mongo timestamp
    1 // 64-bit int
    ][t];
  },

  // compare two values of unknown type according to BSON ordering
  // semantics. (as an extension, consider 'undefined' to be less than
  // any other value.) return negative if a is less, positive if b is
  // less, or 0 if equal
  _cmp(a, b) {
    if (a === undefined) {
      return b === undefined ? 0 : -1;
    }

    if (b === undefined) {
      return 1;
    }

    let ta = LocalCollection._f._type(a);

    let tb = LocalCollection._f._type(b);

    const oa = LocalCollection._f._typeorder(ta);

    const ob = LocalCollection._f._typeorder(tb);

    if (oa !== ob) {
      return oa < ob ? -1 : 1;
    } // XXX need to implement this if we implement Symbol or integers, or
    // Timestamp


    if (ta !== tb) {
      throw Error('Missing type coercion logic in _cmp');
    }

    if (ta === 7) {
      // ObjectID
      // Convert to string.
      ta = tb = 2;
      a = a.toHexString();
      b = b.toHexString();
    }

    if (ta === 9) {
      // Date
      // Convert to millis.
      ta = tb = 1;
      a = a.getTime();
      b = b.getTime();
    }

    if (ta === 1) // double
      return a - b;
    if (tb === 2) // string
      return a < b ? -1 : a === b ? 0 : 1;

    if (ta === 3) {
      // Object
      // this could be much more efficient in the expected case ...
      const toArray = object => {
        const result = [];
        Object.keys(object).forEach(key => {
          result.push(key, object[key]);
        });
        return result;
      };

      return LocalCollection._f._cmp(toArray(a), toArray(b));
    }

    if (ta === 4) {
      // Array
      for (let i = 0;; i++) {
        if (i === a.length) {
          return i === b.length ? 0 : -1;
        }

        if (i === b.length) {
          return 1;
        }

        const s = LocalCollection._f._cmp(a[i], b[i]);

        if (s !== 0) {
          return s;
        }
      }
    }

    if (ta === 5) {
      // binary
      // Surprisingly, a small binary blob is always less than a large one in
      // Mongo.
      if (a.length !== b.length) {
        return a.length - b.length;
      }

      for (let i = 0; i < a.length; i++) {
        if (a[i] < b[i]) {
          return -1;
        }

        if (a[i] > b[i]) {
          return 1;
        }
      }

      return 0;
    }

    if (ta === 8) {
      // boolean
      if (a) {
        return b ? 0 : 1;
      }

      return b ? -1 : 0;
    }

    if (ta === 10) // null
      return 0;
    if (ta === 11) // regexp
      throw Error('Sorting not supported on regular expression'); // XXX
    // 13: javascript code
    // 14: symbol
    // 15: javascript code with scope
    // 16: 32-bit integer
    // 17: timestamp
    // 18: 64-bit integer
    // 255: minkey
    // 127: maxkey

    if (ta === 13) // javascript code
      throw Error('Sorting not supported on Javascript code'); // XXX

    throw Error('Unknown type to sort');
  }

};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"minimongo_common.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/minimongo/minimongo_common.js                                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let LocalCollection_;
module.link("./local_collection.js", {
  default(v) {
    LocalCollection_ = v;
  }

}, 0);
let Matcher;
module.link("./matcher.js", {
  default(v) {
    Matcher = v;
  }

}, 1);
let Sorter;
module.link("./sorter.js", {
  default(v) {
    Sorter = v;
  }

}, 2);
LocalCollection = LocalCollection_;
Minimongo = {
  LocalCollection: LocalCollection_,
  Matcher,
  Sorter
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"observe_handle.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/minimongo/observe_handle.js                                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  default: () => ObserveHandle
});

class ObserveHandle {}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"sorter.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/minimongo/sorter.js                                                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  default: () => Sorter
});
let ELEMENT_OPERATORS, equalityElementMatcher, expandArraysInBranches, hasOwn, isOperatorObject, makeLookupFunction, regexpElementMatcher;
module.link("./common.js", {
  ELEMENT_OPERATORS(v) {
    ELEMENT_OPERATORS = v;
  },

  equalityElementMatcher(v) {
    equalityElementMatcher = v;
  },

  expandArraysInBranches(v) {
    expandArraysInBranches = v;
  },

  hasOwn(v) {
    hasOwn = v;
  },

  isOperatorObject(v) {
    isOperatorObject = v;
  },

  makeLookupFunction(v) {
    makeLookupFunction = v;
  },

  regexpElementMatcher(v) {
    regexpElementMatcher = v;
  }

}, 0);

class Sorter {
  constructor(spec) {
    this._sortSpecParts = [];
    this._sortFunction = null;

    const addSpecPart = (path, ascending) => {
      if (!path) {
        throw Error('sort keys must be non-empty');
      }

      if (path.charAt(0) === '$') {
        throw Error("unsupported sort key: ".concat(path));
      }

      this._sortSpecParts.push({
        ascending,
        lookup: makeLookupFunction(path, {
          forSort: true
        }),
        path
      });
    };

    if (spec instanceof Array) {
      spec.forEach(element => {
        if (typeof element === 'string') {
          addSpecPart(element, true);
        } else {
          addSpecPart(element[0], element[1] !== 'desc');
        }
      });
    } else if (typeof spec === 'object') {
      Object.keys(spec).forEach(key => {
        addSpecPart(key, spec[key] >= 0);
      });
    } else if (typeof spec === 'function') {
      this._sortFunction = spec;
    } else {
      throw Error("Bad sort specification: ".concat(JSON.stringify(spec)));
    } // If a function is specified for sorting, we skip the rest.


    if (this._sortFunction) {
      return;
    } // To implement affectedByModifier, we piggy-back on top of Matcher's
    // affectedByModifier code; we create a selector that is affected by the
    // same modifiers as this sort order. This is only implemented on the
    // server.


    if (this.affectedByModifier) {
      const selector = {};

      this._sortSpecParts.forEach(spec => {
        selector[spec.path] = 1;
      });

      this._selectorForAffectedByModifier = new Minimongo.Matcher(selector);
    }

    this._keyComparator = composeComparators(this._sortSpecParts.map((spec, i) => this._keyFieldComparator(i)));
  }

  getComparator(options) {
    // If sort is specified or have no distances, just use the comparator from
    // the source specification (which defaults to "everything is equal".
    // issue #3599
    // https://docs.mongodb.com/manual/reference/operator/query/near/#sort-operation
    // sort effectively overrides $near
    if (this._sortSpecParts.length || !options || !options.distances) {
      return this._getBaseComparator();
    }

    const distances = options.distances; // Return a comparator which compares using $near distances.

    return (a, b) => {
      if (!distances.has(a._id)) {
        throw Error("Missing distance for ".concat(a._id));
      }

      if (!distances.has(b._id)) {
        throw Error("Missing distance for ".concat(b._id));
      }

      return distances.get(a._id) - distances.get(b._id);
    };
  } // Takes in two keys: arrays whose lengths match the number of spec
  // parts. Returns negative, 0, or positive based on using the sort spec to
  // compare fields.


  _compareKeys(key1, key2) {
    if (key1.length !== this._sortSpecParts.length || key2.length !== this._sortSpecParts.length) {
      throw Error('Key has wrong length');
    }

    return this._keyComparator(key1, key2);
  } // Iterates over each possible "key" from doc (ie, over each branch), calling
  // 'cb' with the key.


  _generateKeysFromDoc(doc, cb) {
    if (this._sortSpecParts.length === 0) {
      throw new Error('can\'t generate keys without a spec');
    }

    const pathFromIndices = indices => "".concat(indices.join(','), ",");

    let knownPaths = null; // maps index -> ({'' -> value} or {path -> value})

    const valuesByIndexAndPath = this._sortSpecParts.map(spec => {
      // Expand any leaf arrays that we find, and ignore those arrays
      // themselves.  (We never sort based on an array itself.)
      let branches = expandArraysInBranches(spec.lookup(doc), true); // If there are no values for a key (eg, key goes to an empty array),
      // pretend we found one undefined value.

      if (!branches.length) {
        branches = [{
          value: void 0
        }];
      }

      const element = Object.create(null);
      let usedPaths = false;
      branches.forEach(branch => {
        if (!branch.arrayIndices) {
          // If there are no array indices for a branch, then it must be the
          // only branch, because the only thing that produces multiple branches
          // is the use of arrays.
          if (branches.length > 1) {
            throw Error('multiple branches but no array used?');
          }

          element[''] = branch.value;
          return;
        }

        usedPaths = true;
        const path = pathFromIndices(branch.arrayIndices);

        if (hasOwn.call(element, path)) {
          throw Error("duplicate path: ".concat(path));
        }

        element[path] = branch.value; // If two sort fields both go into arrays, they have to go into the
        // exact same arrays and we have to find the same paths.  This is
        // roughly the same condition that makes MongoDB throw this strange
        // error message.  eg, the main thing is that if sort spec is {a: 1,
        // b:1} then a and b cannot both be arrays.
        //
        // (In MongoDB it seems to be OK to have {a: 1, 'a.x.y': 1} where 'a'
        // and 'a.x.y' are both arrays, but we don't allow this for now.
        // #NestedArraySort
        // XXX achieve full compatibility here

        if (knownPaths && !hasOwn.call(knownPaths, path)) {
          throw Error('cannot index parallel arrays');
        }
      });

      if (knownPaths) {
        // Similarly to above, paths must match everywhere, unless this is a
        // non-array field.
        if (!hasOwn.call(element, '') && Object.keys(knownPaths).length !== Object.keys(element).length) {
          throw Error('cannot index parallel arrays!');
        }
      } else if (usedPaths) {
        knownPaths = {};
        Object.keys(element).forEach(path => {
          knownPaths[path] = true;
        });
      }

      return element;
    });

    if (!knownPaths) {
      // Easy case: no use of arrays.
      const soleKey = valuesByIndexAndPath.map(values => {
        if (!hasOwn.call(values, '')) {
          throw Error('no value in sole key case?');
        }

        return values[''];
      });
      cb(soleKey);
      return;
    }

    Object.keys(knownPaths).forEach(path => {
      const key = valuesByIndexAndPath.map(values => {
        if (hasOwn.call(values, '')) {
          return values[''];
        }

        if (!hasOwn.call(values, path)) {
          throw Error('missing path?');
        }

        return values[path];
      });
      cb(key);
    });
  } // Returns a comparator that represents the sort specification (but not
  // including a possible geoquery distance tie-breaker).


  _getBaseComparator() {
    if (this._sortFunction) {
      return this._sortFunction;
    } // If we're only sorting on geoquery distance and no specs, just say
    // everything is equal.


    if (!this._sortSpecParts.length) {
      return (doc1, doc2) => 0;
    }

    return (doc1, doc2) => {
      const key1 = this._getMinKeyFromDoc(doc1);

      const key2 = this._getMinKeyFromDoc(doc2);

      return this._compareKeys(key1, key2);
    };
  } // Finds the minimum key from the doc, according to the sort specs.  (We say
  // "minimum" here but this is with respect to the sort spec, so "descending"
  // sort fields mean we're finding the max for that field.)
  //
  // Note that this is NOT "find the minimum value of the first field, the
  // minimum value of the second field, etc"... it's "choose the
  // lexicographically minimum value of the key vector, allowing only keys which
  // you can find along the same paths".  ie, for a doc {a: [{x: 0, y: 5}, {x:
  // 1, y: 3}]} with sort spec {'a.x': 1, 'a.y': 1}, the only keys are [0,5] and
  // [1,3], and the minimum key is [0,5]; notably, [0,3] is NOT a key.


  _getMinKeyFromDoc(doc) {
    let minKey = null;

    this._generateKeysFromDoc(doc, key => {
      if (minKey === null) {
        minKey = key;
        return;
      }

      if (this._compareKeys(key, minKey) < 0) {
        minKey = key;
      }
    });

    return minKey;
  }

  _getPaths() {
    return this._sortSpecParts.map(part => part.path);
  } // Given an index 'i', returns a comparator that compares two key arrays based
  // on field 'i'.


  _keyFieldComparator(i) {
    const invert = !this._sortSpecParts[i].ascending;
    return (key1, key2) => {
      const compare = LocalCollection._f._cmp(key1[i], key2[i]);

      return invert ? -compare : compare;
    };
  }

}

// Given an array of comparators
// (functions (a,b)->(negative or positive or zero)), returns a single
// comparator which uses each comparator in order and returns the first
// non-zero value.
function composeComparators(comparatorArray) {
  return (a, b) => {
    for (let i = 0; i < comparatorArray.length; ++i) {
      const compare = comparatorArray[i](a, b);

      if (compare !== 0) {
        return compare;
      }
    }

    return 0;
  };
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

var exports = require("/node_modules/meteor/minimongo/minimongo_server.js");

/* Exports */
Package._define("minimongo", exports, {
  LocalCollection: LocalCollection,
  Minimongo: Minimongo,
  MinimongoTest: MinimongoTest,
  MinimongoError: MinimongoError
});

})();

//# sourceURL=meteor://💻app/packages/minimongo.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvbWluaW1vbmdvL21pbmltb25nb19zZXJ2ZXIuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL21pbmltb25nby9jb21tb24uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL21pbmltb25nby9jdXJzb3IuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL21pbmltb25nby9sb2NhbF9jb2xsZWN0aW9uLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9taW5pbW9uZ28vbWF0Y2hlci5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvbWluaW1vbmdvL21pbmltb25nb19jb21tb24uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL21pbmltb25nby9vYnNlcnZlX2hhbmRsZS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvbWluaW1vbmdvL3NvcnRlci5qcyJdLCJuYW1lcyI6WyJtb2R1bGUiLCJsaW5rIiwiaGFzT3duIiwiaXNOdW1lcmljS2V5IiwiaXNPcGVyYXRvck9iamVjdCIsInBhdGhzVG9UcmVlIiwicHJvamVjdGlvbkRldGFpbHMiLCJ2IiwiTWluaW1vbmdvIiwiX3BhdGhzRWxpZGluZ051bWVyaWNLZXlzIiwicGF0aHMiLCJtYXAiLCJwYXRoIiwic3BsaXQiLCJmaWx0ZXIiLCJwYXJ0Iiwiam9pbiIsIk1hdGNoZXIiLCJwcm90b3R5cGUiLCJhZmZlY3RlZEJ5TW9kaWZpZXIiLCJtb2RpZmllciIsIk9iamVjdCIsImFzc2lnbiIsIiRzZXQiLCIkdW5zZXQiLCJtZWFuaW5nZnVsUGF0aHMiLCJfZ2V0UGF0aHMiLCJtb2RpZmllZFBhdGhzIiwiY29uY2F0Iiwia2V5cyIsInNvbWUiLCJtb2QiLCJtZWFuaW5nZnVsUGF0aCIsInNlbCIsImkiLCJqIiwibGVuZ3RoIiwiY2FuQmVjb21lVHJ1ZUJ5TW9kaWZpZXIiLCJpc1NpbXBsZSIsIm1vZGlmaWVyUGF0aHMiLCJwYXRoSGFzTnVtZXJpY0tleXMiLCJleHBlY3RlZFNjYWxhcklzT2JqZWN0IiwiX3NlbGVjdG9yIiwibW9kaWZpZXJQYXRoIiwic3RhcnRzV2l0aCIsIm1hdGNoaW5nRG9jdW1lbnQiLCJFSlNPTiIsImNsb25lIiwiTG9jYWxDb2xsZWN0aW9uIiwiX21vZGlmeSIsImVycm9yIiwibmFtZSIsInNldFByb3BlcnR5RXJyb3IiLCJkb2N1bWVudE1hdGNoZXMiLCJyZXN1bHQiLCJjb21iaW5lSW50b1Byb2plY3Rpb24iLCJwcm9qZWN0aW9uIiwic2VsZWN0b3JQYXRocyIsImluY2x1ZGVzIiwiY29tYmluZUltcG9ydGFudFBhdGhzSW50b1Byb2plY3Rpb24iLCJfbWF0Y2hpbmdEb2N1bWVudCIsInVuZGVmaW5lZCIsImZhbGxiYWNrIiwidmFsdWVTZWxlY3RvciIsIiRlcSIsIiRpbiIsIm1hdGNoZXIiLCJwbGFjZWhvbGRlciIsImZpbmQiLCJvbmx5Q29udGFpbnNLZXlzIiwibG93ZXJCb3VuZCIsIkluZmluaXR5IiwidXBwZXJCb3VuZCIsImZvckVhY2giLCJvcCIsImNhbGwiLCJtaWRkbGUiLCJ4IiwiU29ydGVyIiwiX3NlbGVjdG9yRm9yQWZmZWN0ZWRCeU1vZGlmaWVyIiwiZGV0YWlscyIsInRyZWUiLCJub2RlIiwiZnVsbFBhdGgiLCJtZXJnZWRQcm9qZWN0aW9uIiwidHJlZVRvUGF0aHMiLCJpbmNsdWRpbmciLCJtZXJnZWRFeGNsUHJvamVjdGlvbiIsImdldFBhdGhzIiwic2VsZWN0b3IiLCJfcGF0aHMiLCJvYmoiLCJldmVyeSIsImsiLCJwcmVmaXgiLCJrZXkiLCJ2YWx1ZSIsImV4cG9ydCIsIkVMRU1FTlRfT1BFUkFUT1JTIiwiY29tcGlsZURvY3VtZW50U2VsZWN0b3IiLCJlcXVhbGl0eUVsZW1lbnRNYXRjaGVyIiwiZXhwYW5kQXJyYXlzSW5CcmFuY2hlcyIsImlzSW5kZXhhYmxlIiwibWFrZUxvb2t1cEZ1bmN0aW9uIiwibm90aGluZ01hdGNoZXIiLCJwb3B1bGF0ZURvY3VtZW50V2l0aFF1ZXJ5RmllbGRzIiwicmVnZXhwRWxlbWVudE1hdGNoZXIiLCJkZWZhdWx0IiwiaGFzT3duUHJvcGVydHkiLCIkbHQiLCJtYWtlSW5lcXVhbGl0eSIsImNtcFZhbHVlIiwiJGd0IiwiJGx0ZSIsIiRndGUiLCIkbW9kIiwiY29tcGlsZUVsZW1lbnRTZWxlY3RvciIsIm9wZXJhbmQiLCJBcnJheSIsImlzQXJyYXkiLCJFcnJvciIsImRpdmlzb3IiLCJyZW1haW5kZXIiLCJlbGVtZW50TWF0Y2hlcnMiLCJvcHRpb24iLCJSZWdFeHAiLCIkc2l6ZSIsImRvbnRFeHBhbmRMZWFmQXJyYXlzIiwiJHR5cGUiLCJkb250SW5jbHVkZUxlYWZBcnJheXMiLCJvcGVyYW5kQWxpYXNNYXAiLCJfZiIsIl90eXBlIiwiJGJpdHNBbGxTZXQiLCJtYXNrIiwiZ2V0T3BlcmFuZEJpdG1hc2siLCJiaXRtYXNrIiwiZ2V0VmFsdWVCaXRtYXNrIiwiYnl0ZSIsIiRiaXRzQW55U2V0IiwiJGJpdHNBbGxDbGVhciIsIiRiaXRzQW55Q2xlYXIiLCIkcmVnZXgiLCJyZWdleHAiLCIkb3B0aW9ucyIsInRlc3QiLCJzb3VyY2UiLCIkZWxlbU1hdGNoIiwiX2lzUGxhaW5PYmplY3QiLCJpc0RvY01hdGNoZXIiLCJMT0dJQ0FMX09QRVJBVE9SUyIsInJlZHVjZSIsImEiLCJiIiwic3ViTWF0Y2hlciIsImluRWxlbU1hdGNoIiwiY29tcGlsZVZhbHVlU2VsZWN0b3IiLCJhcnJheUVsZW1lbnQiLCJhcmciLCJkb250SXRlcmF0ZSIsIiRhbmQiLCJzdWJTZWxlY3RvciIsImFuZERvY3VtZW50TWF0Y2hlcnMiLCJjb21waWxlQXJyYXlPZkRvY3VtZW50U2VsZWN0b3JzIiwiJG9yIiwibWF0Y2hlcnMiLCJkb2MiLCJmbiIsIiRub3IiLCIkd2hlcmUiLCJzZWxlY3RvclZhbHVlIiwiX3JlY29yZFBhdGhVc2VkIiwiX2hhc1doZXJlIiwiRnVuY3Rpb24iLCIkY29tbWVudCIsIlZBTFVFX09QRVJBVE9SUyIsImNvbnZlcnRFbGVtZW50TWF0Y2hlclRvQnJhbmNoZWRNYXRjaGVyIiwiJG5vdCIsImludmVydEJyYW5jaGVkTWF0Y2hlciIsIiRuZSIsIiRuaW4iLCIkZXhpc3RzIiwiZXhpc3RzIiwiZXZlcnl0aGluZ01hdGNoZXIiLCIkbWF4RGlzdGFuY2UiLCIkbmVhciIsIiRhbGwiLCJicmFuY2hlZE1hdGNoZXJzIiwiY3JpdGVyaW9uIiwiYW5kQnJhbmNoZWRNYXRjaGVycyIsImlzUm9vdCIsIl9oYXNHZW9RdWVyeSIsIm1heERpc3RhbmNlIiwicG9pbnQiLCJkaXN0YW5jZSIsIiRnZW9tZXRyeSIsInR5cGUiLCJHZW9KU09OIiwicG9pbnREaXN0YW5jZSIsImNvb3JkaW5hdGVzIiwicG9pbnRUb0FycmF5IiwiZ2VvbWV0cnlXaXRoaW5SYWRpdXMiLCJkaXN0YW5jZUNvb3JkaW5hdGVQYWlycyIsImJyYW5jaGVkVmFsdWVzIiwiYnJhbmNoIiwiY3VyRGlzdGFuY2UiLCJfaXNVcGRhdGUiLCJhcnJheUluZGljZXMiLCJhbmRTb21lTWF0Y2hlcnMiLCJzdWJNYXRjaGVycyIsImRvY09yQnJhbmNoZXMiLCJtYXRjaCIsInN1YlJlc3VsdCIsInNlbGVjdG9ycyIsImRvY1NlbGVjdG9yIiwib3B0aW9ucyIsImRvY01hdGNoZXJzIiwic3Vic3RyIiwiX2lzU2ltcGxlIiwibG9va1VwQnlJbmRleCIsInZhbHVlTWF0Y2hlciIsIkJvb2xlYW4iLCJvcGVyYXRvckJyYW5jaGVkTWF0Y2hlciIsImVsZW1lbnRNYXRjaGVyIiwiYnJhbmNoZXMiLCJleHBhbmRlZCIsImVsZW1lbnQiLCJtYXRjaGVkIiwicG9pbnRBIiwicG9pbnRCIiwiTWF0aCIsImh5cG90IiwiZWxlbWVudFNlbGVjdG9yIiwiX2VxdWFsIiwiZG9jT3JCcmFuY2hlZFZhbHVlcyIsInNraXBUaGVBcnJheXMiLCJicmFuY2hlc091dCIsInRoaXNJc0FycmF5IiwicHVzaCIsIk51bWJlciIsImlzSW50ZWdlciIsIlVpbnQ4QXJyYXkiLCJJbnQzMkFycmF5IiwiYnVmZmVyIiwiaXNCaW5hcnkiLCJBcnJheUJ1ZmZlciIsIm1heCIsInZpZXciLCJpc1NhZmVJbnRlZ2VyIiwiVWludDMyQXJyYXkiLCJCWVRFU19QRVJfRUxFTUVOVCIsImluc2VydEludG9Eb2N1bWVudCIsImRvY3VtZW50IiwiZXhpc3RpbmdLZXkiLCJpbmRleE9mIiwiYnJhbmNoZWRNYXRjaGVyIiwiYnJhbmNoVmFsdWVzIiwicyIsImluY29uc2lzdGVudE9LIiwidGhlc2VBcmVPcGVyYXRvcnMiLCJzZWxLZXkiLCJ0aGlzSXNPcGVyYXRvciIsIkpTT04iLCJzdHJpbmdpZnkiLCJjbXBWYWx1ZUNvbXBhcmF0b3IiLCJvcGVyYW5kVHlwZSIsIl9jbXAiLCJwYXJ0cyIsImZpcnN0UGFydCIsImxvb2t1cFJlc3QiLCJzbGljZSIsIm9taXRVbm5lY2Vzc2FyeUZpZWxkcyIsImZpcnN0TGV2ZWwiLCJhcHBlbmRUb1Jlc3VsdCIsIm1vcmUiLCJmb3JTb3J0IiwiYXJyYXlJbmRleCIsIk1pbmltb25nb1Rlc3QiLCJNaW5pbW9uZ29FcnJvciIsIm1lc3NhZ2UiLCJmaWVsZCIsIm9wZXJhdG9yTWF0Y2hlcnMiLCJvcGVyYXRvciIsInNpbXBsZVJhbmdlIiwic2ltcGxlRXF1YWxpdHkiLCJzaW1wbGVJbmNsdXNpb24iLCJuZXdMZWFmRm4iLCJjb25mbGljdEZuIiwicm9vdCIsInBhdGhBcnJheSIsInN1Y2Nlc3MiLCJsYXN0S2V5IiwieSIsInBvcHVsYXRlRG9jdW1lbnRXaXRoS2V5VmFsdWUiLCJnZXRQcm90b3R5cGVPZiIsInBvcHVsYXRlRG9jdW1lbnRXaXRoT2JqZWN0IiwidW5wcmVmaXhlZEtleXMiLCJ2YWxpZGF0ZU9iamVjdCIsIm9iamVjdCIsInF1ZXJ5IiwiX3NlbGVjdG9ySXNJZCIsImZpZWxkcyIsImZpZWxkc0tleXMiLCJzb3J0IiwiX2lkIiwia2V5UGF0aCIsInJ1bGUiLCJwcm9qZWN0aW9uUnVsZXNUcmVlIiwiY3VycmVudFBhdGgiLCJhbm90aGVyUGF0aCIsInRvU3RyaW5nIiwibGFzdEluZGV4IiwidmFsaWRhdGVLZXlJblBhdGgiLCJDdXJzb3IiLCJjb25zdHJ1Y3RvciIsImNvbGxlY3Rpb24iLCJzb3J0ZXIiLCJfc2VsZWN0b3JJc0lkUGVyaGFwc0FzT2JqZWN0IiwiX3NlbGVjdG9ySWQiLCJoYXNHZW9RdWVyeSIsInNraXAiLCJsaW1pdCIsIl9wcm9qZWN0aW9uRm4iLCJfY29tcGlsZVByb2plY3Rpb24iLCJfdHJhbnNmb3JtIiwid3JhcFRyYW5zZm9ybSIsInRyYW5zZm9ybSIsIlRyYWNrZXIiLCJyZWFjdGl2ZSIsImNvdW50IiwiYXBwbHlTa2lwTGltaXQiLCJfZGVwZW5kIiwiYWRkZWQiLCJyZW1vdmVkIiwiX2dldFJhd09iamVjdHMiLCJvcmRlcmVkIiwiZmV0Y2giLCJTeW1ib2wiLCJpdGVyYXRvciIsImFkZGVkQmVmb3JlIiwiY2hhbmdlZCIsIm1vdmVkQmVmb3JlIiwiaW5kZXgiLCJvYmplY3RzIiwibmV4dCIsImRvbmUiLCJjYWxsYmFjayIsInRoaXNBcmciLCJnZXRUcmFuc2Zvcm0iLCJvYnNlcnZlIiwiX29ic2VydmVGcm9tT2JzZXJ2ZUNoYW5nZXMiLCJvYnNlcnZlQ2hhbmdlcyIsIl9vYnNlcnZlQ2hhbmdlc0NhbGxiYWNrc0FyZU9yZGVyZWQiLCJfYWxsb3dfdW5vcmRlcmVkIiwiZGlzdGFuY2VzIiwiX0lkTWFwIiwiY3Vyc29yIiwiZGlydHkiLCJwcm9qZWN0aW9uRm4iLCJyZXN1bHRzU25hcHNob3QiLCJxaWQiLCJuZXh0X3FpZCIsInF1ZXJpZXMiLCJyZXN1bHRzIiwicGF1c2VkIiwid3JhcENhbGxiYWNrIiwic2VsZiIsImFyZ3MiLCJhcmd1bWVudHMiLCJfb2JzZXJ2ZVF1ZXVlIiwicXVldWVUYXNrIiwiYXBwbHkiLCJfc3VwcHJlc3NfaW5pdGlhbCIsImhhbmRsZSIsIk9ic2VydmVIYW5kbGUiLCJzdG9wIiwiYWN0aXZlIiwib25JbnZhbGlkYXRlIiwiZHJhaW4iLCJyZXdpbmQiLCJjaGFuZ2VycyIsImRlcGVuZGVuY3kiLCJEZXBlbmRlbmN5Iiwibm90aWZ5IiwiYmluZCIsImRlcGVuZCIsIl9nZXRDb2xsZWN0aW9uTmFtZSIsInNlbGVjdGVkRG9jIiwiX2RvY3MiLCJnZXQiLCJzZXQiLCJjbGVhciIsImlkIiwibWF0Y2hSZXN1bHQiLCJnZXRDb21wYXJhdG9yIiwiX3B1Ymxpc2hDdXJzb3IiLCJzdWJzY3JpcHRpb24iLCJQYWNrYWdlIiwibW9uZ28iLCJNb25nbyIsIkNvbGxlY3Rpb24iLCJNZXRlb3IiLCJfU3luY2hyb25vdXNRdWV1ZSIsImNyZWF0ZSIsIl9zYXZlZE9yaWdpbmFscyIsImZpbmRPbmUiLCJpbnNlcnQiLCJhc3NlcnRIYXNWYWxpZEZpZWxkTmFtZXMiLCJfdXNlT0lEIiwiTW9uZ29JRCIsIk9iamVjdElEIiwiUmFuZG9tIiwiaGFzIiwiX3NhdmVPcmlnaW5hbCIsInF1ZXJpZXNUb1JlY29tcHV0ZSIsIl9pbnNlcnRJblJlc3VsdHMiLCJfcmVjb21wdXRlUmVzdWx0cyIsImRlZmVyIiwicGF1c2VPYnNlcnZlcnMiLCJyZW1vdmUiLCJlcXVhbHMiLCJzaXplIiwiX2VhY2hQb3NzaWJseU1hdGNoaW5nRG9jIiwicXVlcnlSZW1vdmUiLCJyZW1vdmVJZCIsInJlbW92ZURvYyIsIl9yZW1vdmVGcm9tUmVzdWx0cyIsInJlc3VtZU9ic2VydmVycyIsIl9kaWZmUXVlcnlDaGFuZ2VzIiwicmV0cmlldmVPcmlnaW5hbHMiLCJvcmlnaW5hbHMiLCJzYXZlT3JpZ2luYWxzIiwidXBkYXRlIiwicWlkVG9PcmlnaW5hbFJlc3VsdHMiLCJkb2NNYXAiLCJpZHNNYXRjaGVkIiwiX2lkc01hdGNoZWRCeVNlbGVjdG9yIiwibWVtb2l6ZWRDbG9uZUlmTmVlZGVkIiwiZG9jVG9NZW1vaXplIiwicmVjb21wdXRlUWlkcyIsInVwZGF0ZUNvdW50IiwicXVlcnlSZXN1bHQiLCJfbW9kaWZ5QW5kTm90aWZ5IiwibXVsdGkiLCJpbnNlcnRlZElkIiwidXBzZXJ0IiwiX2NyZWF0ZVVwc2VydERvY3VtZW50IiwiX3JldHVybk9iamVjdCIsIm51bWJlckFmZmVjdGVkIiwic3BlY2lmaWNJZHMiLCJtYXRjaGVkX2JlZm9yZSIsIm9sZF9kb2MiLCJhZnRlck1hdGNoIiwiYWZ0ZXIiLCJiZWZvcmUiLCJfdXBkYXRlSW5SZXN1bHRzIiwib2xkUmVzdWx0cyIsIl9DYWNoaW5nQ2hhbmdlT2JzZXJ2ZXIiLCJvcmRlcmVkRnJvbUNhbGxiYWNrcyIsImNhbGxiYWNrcyIsImRvY3MiLCJPcmRlcmVkRGljdCIsImlkU3RyaW5naWZ5IiwiYXBwbHlDaGFuZ2UiLCJwdXRCZWZvcmUiLCJtb3ZlQmVmb3JlIiwiRGlmZlNlcXVlbmNlIiwiYXBwbHlDaGFuZ2VzIiwiSWRNYXAiLCJpZFBhcnNlIiwiX193cmFwcGVkVHJhbnNmb3JtX18iLCJ3cmFwcGVkIiwidHJhbnNmb3JtZWQiLCJub25yZWFjdGl2ZSIsIl9iaW5hcnlTZWFyY2giLCJjbXAiLCJhcnJheSIsImZpcnN0IiwicmFuZ2UiLCJoYWxmUmFuZ2UiLCJmbG9vciIsIl9jaGVja1N1cHBvcnRlZFByb2plY3Rpb24iLCJfaWRQcm9qZWN0aW9uIiwicnVsZVRyZWUiLCJzdWJkb2MiLCJzZWxlY3RvckRvY3VtZW50IiwiaXNNb2RpZnkiLCJfaXNNb2RpZmljYXRpb25Nb2QiLCJuZXdEb2MiLCJpc0luc2VydCIsInJlcGxhY2VtZW50IiwiX2RpZmZPYmplY3RzIiwibGVmdCIsInJpZ2h0IiwiZGlmZk9iamVjdHMiLCJuZXdSZXN1bHRzIiwib2JzZXJ2ZXIiLCJkaWZmUXVlcnlDaGFuZ2VzIiwiX2RpZmZRdWVyeU9yZGVyZWRDaGFuZ2VzIiwiZGlmZlF1ZXJ5T3JkZXJlZENoYW5nZXMiLCJfZGlmZlF1ZXJ5VW5vcmRlcmVkQ2hhbmdlcyIsImRpZmZRdWVyeVVub3JkZXJlZENoYW5nZXMiLCJfZmluZEluT3JkZXJlZFJlc3VsdHMiLCJzdWJJZHMiLCJfaW5zZXJ0SW5Tb3J0ZWRMaXN0Iiwic3BsaWNlIiwiaXNSZXBsYWNlIiwiaXNNb2RpZmllciIsInNldE9uSW5zZXJ0IiwibW9kRnVuYyIsIk1PRElGSUVSUyIsImtleXBhdGgiLCJrZXlwYXJ0cyIsInRhcmdldCIsImZpbmRNb2RUYXJnZXQiLCJmb3JiaWRBcnJheSIsIm5vQ3JlYXRlIiwiTk9fQ1JFQVRFX01PRElGSUVSUyIsInBvcCIsIm9ic2VydmVDYWxsYmFja3MiLCJzdXBwcmVzc2VkIiwib2JzZXJ2ZUNoYW5nZXNDYWxsYmFja3MiLCJfb2JzZXJ2ZUNhbGxiYWNrc0FyZU9yZGVyZWQiLCJpbmRpY2VzIiwiX25vX2luZGljZXMiLCJhZGRlZEF0IiwiY2hhbmdlZEF0Iiwib2xkRG9jIiwibW92ZWRUbyIsImZyb20iLCJ0byIsInJlbW92ZWRBdCIsImNoYW5nZU9ic2VydmVyIiwiY2hhbmdlZEZpZWxkcyIsIm1ha2VDaGFuZ2VkRmllbGRzIiwib2xkX2lkeCIsIm5ld19pZHgiLCIkY3VycmVudERhdGUiLCJEYXRlIiwiJG1pbiIsIiRtYXgiLCIkaW5jIiwiJHNldE9uSW5zZXJ0IiwiJHB1c2giLCIkZWFjaCIsInRvUHVzaCIsInBvc2l0aW9uIiwiJHBvc2l0aW9uIiwiJHNsaWNlIiwic29ydEZ1bmN0aW9uIiwiJHNvcnQiLCJzcGxpY2VBcmd1bWVudHMiLCIkcHVzaEFsbCIsIiRhZGRUb1NldCIsImlzRWFjaCIsInZhbHVlcyIsInRvQWRkIiwiJHBvcCIsInRvUG9wIiwiJHB1bGwiLCJ0b1B1bGwiLCJvdXQiLCIkcHVsbEFsbCIsIiRyZW5hbWUiLCJ0YXJnZXQyIiwiJGJpdCIsIiR2IiwiaW52YWxpZENoYXJNc2ciLCIkIiwiYXNzZXJ0SXNWYWxpZEZpZWxkTmFtZSIsInVzZWRBcnJheUluZGV4IiwibGFzdCIsImtleXBhcnQiLCJwYXJzZUludCIsImlzVXBkYXRlIiwiX2RvY01hdGNoZXIiLCJfY29tcGlsZVNlbGVjdG9yIiwiaGFzV2hlcmUiLCJrZXlPcmRlclNlbnNpdGl2ZSIsIl90eXBlb3JkZXIiLCJ0IiwidGEiLCJ0YiIsIm9hIiwib2IiLCJ0b0hleFN0cmluZyIsImdldFRpbWUiLCJ0b0FycmF5IiwiTG9jYWxDb2xsZWN0aW9uXyIsInNwZWMiLCJfc29ydFNwZWNQYXJ0cyIsIl9zb3J0RnVuY3Rpb24iLCJhZGRTcGVjUGFydCIsImFzY2VuZGluZyIsImNoYXJBdCIsImxvb2t1cCIsIl9rZXlDb21wYXJhdG9yIiwiY29tcG9zZUNvbXBhcmF0b3JzIiwiX2tleUZpZWxkQ29tcGFyYXRvciIsIl9nZXRCYXNlQ29tcGFyYXRvciIsIl9jb21wYXJlS2V5cyIsImtleTEiLCJrZXkyIiwiX2dlbmVyYXRlS2V5c0Zyb21Eb2MiLCJjYiIsInBhdGhGcm9tSW5kaWNlcyIsImtub3duUGF0aHMiLCJ2YWx1ZXNCeUluZGV4QW5kUGF0aCIsInVzZWRQYXRocyIsInNvbGVLZXkiLCJkb2MxIiwiZG9jMiIsIl9nZXRNaW5LZXlGcm9tRG9jIiwibWluS2V5IiwiaW52ZXJ0IiwiY29tcGFyZSIsImNvbXBhcmF0b3JBcnJheSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUFBLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLHVCQUFaO0FBQXFDLElBQUlDLE1BQUosRUFBV0MsWUFBWCxFQUF3QkMsZ0JBQXhCLEVBQXlDQyxXQUF6QyxFQUFxREMsaUJBQXJEO0FBQXVFTixNQUFNLENBQUNDLElBQVAsQ0FBWSxhQUFaLEVBQTBCO0FBQUNDLFFBQU0sQ0FBQ0ssQ0FBRCxFQUFHO0FBQUNMLFVBQU0sR0FBQ0ssQ0FBUDtBQUFTLEdBQXBCOztBQUFxQkosY0FBWSxDQUFDSSxDQUFELEVBQUc7QUFBQ0osZ0JBQVksR0FBQ0ksQ0FBYjtBQUFlLEdBQXBEOztBQUFxREgsa0JBQWdCLENBQUNHLENBQUQsRUFBRztBQUFDSCxvQkFBZ0IsR0FBQ0csQ0FBakI7QUFBbUIsR0FBNUY7O0FBQTZGRixhQUFXLENBQUNFLENBQUQsRUFBRztBQUFDRixlQUFXLEdBQUNFLENBQVo7QUFBYyxHQUExSDs7QUFBMkhELG1CQUFpQixDQUFDQyxDQUFELEVBQUc7QUFBQ0QscUJBQWlCLEdBQUNDLENBQWxCO0FBQW9COztBQUFwSyxDQUExQixFQUFnTSxDQUFoTTs7QUFTNUdDLFNBQVMsQ0FBQ0Msd0JBQVYsR0FBcUNDLEtBQUssSUFBSUEsS0FB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c1I1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVNsQixrQkFBVCxDQUE0Qm1CLGVBQTVCLEVBQTZDO0FBQzNDLFNBQU8sQ0FBQ2hkLENBQUQsRUFBSUMsQ0FBSixLQUFVO0FBQ2YsU0FBSyxJQUFJdkgsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR3NrQixlQUFlLENBQUNwa0IsTUFBcEMsRUFBNEMsRUFBRUYsQ0FBOUMsRUFBaUQ7QUFDL0MsWUFBTXFrQixPQUFPLEdBQUdDLGVBQWUsQ0FBQ3RrQixDQUFELENBQWYsQ0FBbUJzSCxDQUFuQixFQUFzQkMsQ0FBdEIsQ0FBaEI7O0FBQ0EsVUFBSThjLE9BQU8sS0FBSyxDQUFoQixFQUFtQjtBQUNqQixlQUFPQSxPQUFQO0FBQ0Q7QUFDRjs7QUFFRCxXQUFPLENBQVA7QUFDRCxHQVREO0FBVUQsQyIsImZpbGUiOiIvcGFja2FnZXMvbWluaW1vbmdvLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICcuL21pbmltb25nb19jb21tb24uanMnO1xuaW1wb3J0IHtcbiAgaGFzT3duLFxuICBpc051bWVyaWNLZXksXG4gIGlzT3BlcmF0b3JPYmplY3QsXG4gIHBhdGhzVG9UcmVlLFxuICBwcm9qZWN0aW9uRGV0YWlscyxcbn0gZnJvbSAnLi9jb21tb24uanMnO1xuXG5NaW5pbW9uZ28uX3BhdGhzRWxpZGluZ051bWVyaWNLZXlzID0gcGF0aHMgPT4gcGF0aHMubWFwKHBhdGggPT5cbiAgcGF0aC5zcGxpdCgnLicpLmZpbHRlcihwYXJ0ID0+ICFpc051bWVyaWNLZXkocGFydCkpLmpvaW4oJy4nKVxuKTtcblxuLy8gUmV0dXJucyB0cnVlIGlmIHRoZSBtb2RpZmllciBhcHBsaWVkIHRvIHNvbWUgZG9jdW1lbnQgbWF5IGNoYW5nZSB0aGUgcmVzdWx0XG4vLyBvZiBtYXRjaGluZyB0aGUgZG9jdW1lbnQgYnkgc2VsZWN0b3Jcbi8vIFRoZSBtb2RpZmllciBpcyBhbHdheXMgaW4gYSBmb3JtIG9mIE9iamVjdDpcbi8vICAtICRzZXRcbi8vICAgIC0gJ2EuYi4yMi56JzogdmFsdWVcbi8vICAgIC0gJ2Zvby5iYXInOiA0MlxuLy8gIC0gJHVuc2V0XG4vLyAgICAtICdhYmMuZCc6IDFcbk1pbmltb25nby5NYXRjaGVyLnByb3RvdHlwZS5hZmZlY3RlZEJ5TW9kaWZpZXIgPSBmdW5jdGlvbihtb2RpZmllcikge1xuICAvLyBzYWZlIGNoZWNrIGZvciAkc2V0LyR1bnNldCBiZWluZyBvYmplY3RzXG4gIG1vZGlmaWVyID0gT2JqZWN0LmFzc2lnbih7JHNldDoge30sICR1bnNldDoge319LCBtb2RpZmllcik7XG5cbiAgY29uc3QgbWVhbmluZ2Z1bFBhdGhzID0gdGhpcy5fZ2V0UGF0aHMoKTtcbiAgY29uc3QgbW9kaWZpZWRQYXRocyA9IFtdLmNvbmNhdChcbiAgICBPYmplY3Qua2V5cyhtb2RpZmllci4kc2V0KSxcbiAgICBPYmplY3Qua2V5cyhtb2RpZmllci4kdW5zZXQpXG4gICk7XG5cbiAgcmV0dXJuIG1vZGlmaWVkUGF0aHMuc29tZShwYXRoID0+IHtcbiAgICBjb25zdCBtb2QgPSBwYXRoLnNwbGl0KCcuJyk7XG5cbiAgICByZXR1cm4gbWVhbmluZ2Z1bFBhdGhzLnNvbWUobWVhbmluZ2Z1bFBhdGggPT4ge1xuICAgICAgY29uc3Qgc2VsID0gbWVhbmluZ2Z1bFBhdGguc3BsaXQoJy4nKTtcblxuICAgICAgbGV0IGkgPSAwLCBqID0gMDtcblxuICAgICAgd2hpbGUgKGkgPCBzZWwubGVuZ3RoICYmIGogPCBtb2QubGVuZ3RoKSB7XG4gICAgICAgIGlmIChpc051bWVyaWNLZXkoc2VsW2ldKSAmJiBpc051bWVyaWNLZXkobW9kW2pdKSkge1xuICAgICAgICAgIC8vIGZvby40LmJhciBzZWxlY3RvciBhZmZlY3RlZCBieSBmb28uNCBtb2RpZmllclxuICAgICAgICAgIC8vIGZvby4zLmJhciBzZWxlY3RvciB1bmFmZmVjdGVkIGJ5IGZvby40IG1vZGlmaWVyXG4gICAgICAgICAgaWYgKHNlbFtpXSA9PT0gbW9kW2pdKSB7XG4gICAgICAgICAgICBpKys7XG4gICAgICAgICAgICBqKys7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoaXNOdW1lcmljS2V5KHNlbFtpXSkpIHtcbiAgICAgICAgICAvLyBmb28uNC5iYXIgc2VsZWN0b3IgdW5hZmZlY3RlZCBieSBmb28uYmFyIG1vZGlmaWVyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9IGVsc2UgaWYgKGlzTnVtZXJpY0tleShtb2Rbal0pKSB7XG4gICAgICAgICAgaisrO1xuICAgICAgICB9IGVsc2UgaWYgKHNlbFtpXSA9PT0gbW9kW2pdKSB7XG4gICAgICAgICAgaSsrO1xuICAgICAgICAgIGorKztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gT25lIGlzIGEgcHJlZml4IG9mIGFub3RoZXIsIHRha2luZyBudW1lcmljIGZpZWxkcyBpbnRvIGFjY291bnRcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0pO1xuICB9KTtcbn07XG5cbi8vIEBwYXJhbSBtb2RpZmllciAtIE9iamVjdDogTW9uZ29EQi1zdHlsZWQgbW9kaWZpZXIgd2l0aCBgJHNldGBzIGFuZCBgJHVuc2V0c2Bcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgb25seS4gKGFzc3VtZWQgdG8gY29tZSBmcm9tIG9wbG9nKVxuLy8gQHJldHVybnMgLSBCb29sZWFuOiBpZiBhZnRlciBhcHBseWluZyB0aGUgbW9kaWZpZXIsIHNlbGVjdG9yIGNhbiBzdGFydFxuLy8gICAgICAgICAgICAgICAgICAgICBhY2NlcHRpbmcgdGhlIG1vZGlmaWVkIHZhbHVlLlxuLy8gTk9URTogYXNzdW1lcyB0aGF0IGRvY3VtZW50IGFmZmVjdGVkIGJ5IG1vZGlmaWVyIGRpZG4ndCBtYXRjaCB0aGlzIE1hdGNoZXJcbi8vIGJlZm9yZSwgc28gaWYgbW9kaWZpZXIgY2FuJ3QgY29udmluY2Ugc2VsZWN0b3IgaW4gYSBwb3NpdGl2ZSBjaGFuZ2UgaXQgd291bGRcbi8vIHN0YXkgJ2ZhbHNlJy5cbi8vIEN1cnJlbnRseSBkb2Vzbid0IHN1cHBvcnQgJC1vcGVyYXRvcnMgYW5kIG51bWVyaWMgaW5kaWNlcyBwcmVjaXNlbHkuXG5NaW5pbW9uZ28uTWF0Y2hlci5wcm90b3R5cGUuY2FuQmVjb21lVHJ1ZUJ5TW9kaWZpZXIgPSBmdW5jdGlvbihtb2RpZmllcikge1xuICBpZiAoIXRoaXMuYWZmZWN0ZWRCeU1vZGlmaWVyKG1vZGlmaWVyKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmICghdGhpcy5pc1NpbXBsZSgpKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBtb2RpZmllciA9IE9iamVjdC5hc3NpZ24oeyRzZXQ6IHt9LCAkdW5zZXQ6IHt9fSwgbW9kaWZpZXIpO1xuXG4gIGNvbnN0IG1vZGlmaWVyUGF0aHMgPSBbXS5jb25jYXQoXG4gICAgT2JqZWN0LmtleXMobW9kaWZpZXIuJHNldCksXG4gICAgT2JqZWN0LmtleXMobW9kaWZpZXIuJHVuc2V0KVxuICApO1xuXG4gIGlmICh0aGlzLl9nZXRQYXRocygpLnNvbWUocGF0aEhhc051bWVyaWNLZXlzKSB8fFxuICAgICAgbW9kaWZpZXJQYXRocy5zb21lKHBhdGhIYXNOdW1lcmljS2V5cykpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8vIGNoZWNrIGlmIHRoZXJlIGlzIGEgJHNldCBvciAkdW5zZXQgdGhhdCBpbmRpY2F0ZXMgc29tZXRoaW5nIGlzIGFuXG4gIC8vIG9iamVjdCByYXRoZXIgdGhhbiBhIHNjYWxhciBpbiB0aGUgYWN0dWFsIG9iamVjdCB3aGVyZSB3ZSBzYXcgJC1vcGVyYXRvclxuICAvLyBOT1RFOiBpdCBpcyBjb3JyZWN0IHNpbmNlIHdlIGFsbG93IG9ubHkgc2NhbGFycyBpbiAkLW9wZXJhdG9yc1xuICAvLyBFeGFtcGxlOiBmb3Igc2VsZWN0b3IgeydhLmInOiB7JGd0OiA1fX0gdGhlIG1vZGlmaWVyIHsnYS5iLmMnOjd9IHdvdWxkXG4gIC8vIGRlZmluaXRlbHkgc2V0IHRoZSByZXN1bHQgdG8gZmFsc2UgYXMgJ2EuYicgYXBwZWFycyB0byBiZSBhbiBvYmplY3QuXG4gIGNvbnN0IGV4cGVjdGVkU2NhbGFySXNPYmplY3QgPSBPYmplY3Qua2V5cyh0aGlzLl9zZWxlY3Rvcikuc29tZShwYXRoID0+IHtcbiAgICBpZiAoIWlzT3BlcmF0b3JPYmplY3QodGhpcy5fc2VsZWN0b3JbcGF0aF0pKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1vZGlmaWVyUGF0aHMuc29tZShtb2RpZmllclBhdGggPT5cbiAgICAgIG1vZGlmaWVyUGF0aC5zdGFydHNXaXRoKGAke3BhdGh9LmApXG4gICAgKTtcbiAgfSk7XG5cbiAgaWYgKGV4cGVjdGVkU2NhbGFySXNPYmplY3QpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvLyBTZWUgaWYgd2UgY2FuIGFwcGx5IHRoZSBtb2RpZmllciBvbiB0aGUgaWRlYWxseSBtYXRjaGluZyBvYmplY3QuIElmIGl0XG4gIC8vIHN0aWxsIG1hdGNoZXMgdGhlIHNlbGVjdG9yLCB0aGVuIHRoZSBtb2RpZmllciBjb3VsZCBoYXZlIHR1cm5lZCB0aGUgcmVhbFxuICAvLyBvYmplY3QgaW4gdGhlIGRhdGFiYXNlIGludG8gc29tZXRoaW5nIG1hdGNoaW5nLlxuICBjb25zdCBtYXRjaGluZ0RvY3VtZW50ID0gRUpTT04uY2xvbmUodGhpcy5tYXRjaGluZ0RvY3VtZW50KCkpO1xuXG4gIC8vIFRoZSBzZWxlY3RvciBpcyB0b28gY29tcGxleCwgYW55dGhpbmcgY2FuIGhhcHBlbi5cbiAgaWYgKG1hdGNoaW5nRG9jdW1lbnQgPT09IG51bGwpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHRyeSB7XG4gICAgTG9jYWxDb2xsZWN0aW9uLl9tb2RpZnkobWF0Y2hpbmdEb2N1bWVudCwgbW9kaWZpZXIpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIC8vIENvdWxkbid0IHNldCBhIHByb3BlcnR5IG9uIGEgZmllbGQgd2hpY2ggaXMgYSBzY2FsYXIgb3IgbnVsbCBpbiB0aGVcbiAgICAvLyBzZWxlY3Rvci5cbiAgICAvLyBFeGFtcGxlOlxuICAgIC8vIHJlYWwgZG9jdW1lbnQ6IHsgJ2EuYic6IDMgfVxuICAgIC8vIHNlbGVjdG9yOiB7ICdhJzogMTIgfVxuICAgIC8vIGNvbnZlcnRlZCBzZWxlY3RvciAoaWRlYWwgZG9jdW1lbnQpOiB7ICdhJzogMTIgfVxuICAgIC8vIG1vZGlmaWVyOiB7ICRzZXQ6IHsgJ2EuYic6IDQgfSB9XG4gICAgLy8gV2UgZG9uJ3Qga25vdyB3aGF0IHJlYWwgZG9jdW1lbnQgd2FzIGxpa2UgYnV0IGZyb20gdGhlIGVycm9yIHJhaXNlZCBieVxuICAgIC8vICRzZXQgb24gYSBzY2FsYXIgZmllbGQgd2UgY2FuIHJlYXNvbiB0aGF0IHRoZSBzdHJ1Y3R1cmUgb2YgcmVhbCBkb2N1bWVudFxuICAgIC8vIGlzIGNvbXBsZXRlbHkgZGlmZmVyZW50LlxuICAgIGlmIChlcnJvci5uYW1lID09PSAnTWluaW1vbmdvRXJyb3InICYmIGVycm9yLnNldFByb3BlcnR5RXJyb3IpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB0aHJvdyBlcnJvcjtcbiAgfVxuXG4gIHJldHVybiB0aGlzLmRvY3VtZW50TWF0Y2hlcyhtYXRjaGluZ0RvY3VtZW50KS5yZXN1bHQ7XG59O1xuXG4vLyBLbm93cyBob3cgdG8gY29tYmluZSBhIG1vbmdvIHNlbGVjdG9yIGFuZCBhIGZpZWxkcyBwcm9qZWN0aW9uIHRvIGEgbmV3IGZpZWxkc1xuLy8gcHJvamVjdGlvbiB0YWtpbmcgaW50byBhY2NvdW50IGFjdGl2ZSBmaWVsZHMgZnJvbSB0aGUgcGFzc2VkIHNlbGVjdG9yLlxuLy8gQHJldHVybnMgT2JqZWN0IC0gcHJvamVjdGlvbiBvYmplY3QgKHNhbWUgYXMgZmllbGRzIG9wdGlvbiBvZiBtb25nbyBjdXJzb3IpXG5NaW5pbW9uZ28uTWF0Y2hlci5wcm90b3R5cGUuY29tYmluZUludG9Qcm9qZWN0aW9uID0gZnVuY3Rpb24ocHJvamVjdGlvbikge1xuICBjb25zdCBzZWxlY3RvclBhdGhzID0gTWluaW1vbmdvLl9wYXRoc0VsaWRpbmdOdW1lcmljS2V5cyh0aGlzLl9nZXRQYXRocygpKTtcblxuICAvLyBTcGVjaWFsIGNhc2UgZm9yICR3aGVyZSBvcGVyYXRvciBpbiB0aGUgc2VsZWN0b3IgLSBwcm9qZWN0aW9uIHNob3VsZCBkZXBlbmRcbiAgLy8gb24gYWxsIGZpZWxkcyBvZiB0aGUgZG9jdW1lbnQuIGdldFNlbGVjdG9yUGF0aHMgcmV0dXJucyBhIGxpc3Qgb2YgcGF0aHNcbiAgLy8gc2VsZWN0b3IgZGVwZW5kcyBvbi4gSWYgb25lIG9mIHRoZSBwYXRocyBpcyAnJyAoZW1wdHkgc3RyaW5nKSByZXByZXNlbnRpbmdcbiAgLy8gdGhlIHJvb3Qgb3IgdGhlIHdob2xlIGRvY3VtZW50LCBjb21wbGV0ZSBwcm9qZWN0aW9uIHNob3VsZCBiZSByZXR1cm5lZC5cbiAgaWYgKHNlbGVjdG9yUGF0aHMuaW5jbHVkZXMoJycpKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgcmV0dXJuIGNvbWJpbmVJbXBvcnRhbnRQYXRoc0ludG9Qcm9qZWN0aW9uKHNlbGVjdG9yUGF0aHMsIHByb2plY3Rpb24pO1xufTtcblxuLy8gUmV0dXJucyBhbiBvYmplY3QgdGhhdCB3b3VsZCBtYXRjaCB0aGUgc2VsZWN0b3IgaWYgcG9zc2libGUgb3IgbnVsbCBpZiB0aGVcbi8vIHNlbGVjdG9yIGlzIHRvbyBjb21wbGV4IGZvciB1cyB0byBhbmFseXplXG4vLyB7ICdhLmInOiB7IGFuczogNDIgfSwgJ2Zvby5iYXInOiBudWxsLCAnZm9vLmJheic6IFwic29tZXRoaW5nXCIgfVxuLy8gPT4geyBhOiB7IGI6IHsgYW5zOiA0MiB9IH0sIGZvbzogeyBiYXI6IG51bGwsIGJhejogXCJzb21ldGhpbmdcIiB9IH1cbk1pbmltb25nby5NYXRjaGVyLnByb3RvdHlwZS5tYXRjaGluZ0RvY3VtZW50ID0gZnVuY3Rpb24oKSB7XG4gIC8vIGNoZWNrIGlmIGl0IHdhcyBjb21wdXRlZCBiZWZvcmVcbiAgaWYgKHRoaXMuX21hdGNoaW5nRG9jdW1lbnQgIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiB0aGlzLl9tYXRjaGluZ0RvY3VtZW50O1xuICB9XG5cbiAgLy8gSWYgdGhlIGFuYWx5c2lzIG9mIHRoaXMgc2VsZWN0b3IgaXMgdG9vIGhhcmQgZm9yIG91ciBpbXBsZW1lbnRhdGlvblxuICAvLyBmYWxsYmFjayB0byBcIllFU1wiXG4gIGxldCBmYWxsYmFjayA9IGZhbHNlO1xuXG4gIHRoaXMuX21hdGNoaW5nRG9jdW1lbnQgPSBwYXRoc1RvVHJlZShcbiAgICB0aGlzLl9nZXRQYXRocygpLFxuICAgIHBhdGggPT4ge1xuICAgICAgY29uc3QgdmFsdWVTZWxlY3RvciA9IHRoaXMuX3NlbGVjdG9yW3BhdGhdO1xuXG4gICAgICBpZiAoaXNPcGVyYXRvck9iamVjdCh2YWx1ZVNlbGVjdG9yKSkge1xuICAgICAgICAvLyBpZiB0aGVyZSBpcyBhIHN0cmljdCBlcXVhbGl0eSwgdGhlcmUgaXMgYSBnb29kXG4gICAgICAgIC8vIGNoYW5jZSB3ZSBjYW4gdXNlIG9uZSBvZiB0aG9zZSBhcyBcIm1hdGNoaW5nXCJcbiAgICAgICAgLy8gZHVtbXkgdmFsdWVcbiAgICAgICAgaWYgKHZhbHVlU2VsZWN0b3IuJGVxKSB7XG4gICAgICAgICAgcmV0dXJuIHZhbHVlU2VsZWN0b3IuJGVxO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHZhbHVlU2VsZWN0b3IuJGluKSB7XG4gICAgICAgICAgY29uc3QgbWF0Y2hlciA9IG5ldyBNaW5pbW9uZ28uTWF0Y2hlcih7cGxhY2Vob2xkZXI6IHZhbHVlU2VsZWN0b3J9KTtcblxuICAgICAgICAgIC8vIFJldHVybiBhbnl0aGluZyBmcm9tICRpbiB0aGF0IG1hdGNoZXMgdGhlIHdob2xlIHNlbGVjdG9yIGZvciB0aGlzXG4gICAgICAgICAgLy8gcGF0aC4gSWYgbm90aGluZyBtYXRjaGVzLCByZXR1cm5zIGB1bmRlZmluZWRgIGFzIG5vdGhpbmcgY2FuIG1ha2VcbiAgICAgICAgICAvLyB0aGlzIHNlbGVjdG9yIGludG8gYHRydWVgLlxuICAgICAgICAgIHJldHVybiB2YWx1ZVNlbGVjdG9yLiRpbi5maW5kKHBsYWNlaG9sZGVyID0+XG4gICAgICAgICAgICBtYXRjaGVyLmRvY3VtZW50TWF0Y2hlcyh7cGxhY2Vob2xkZXJ9KS5yZXN1bHRcbiAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9ubHlDb250YWluc0tleXModmFsdWVTZWxlY3RvciwgWyckZ3QnLCAnJGd0ZScsICckbHQnLCAnJGx0ZSddKSkge1xuICAgICAgICAgIGxldCBsb3dlckJvdW5kID0gLUluZmluaXR5O1xuICAgICAgICAgIGxldCB1cHBlckJvdW5kID0gSW5maW5pdHk7XG5cbiAgICAgICAgICBbJyRsdGUnLCAnJGx0J10uZm9yRWFjaChvcCA9PiB7XG4gICAgICAgICAgICBpZiAoaGFzT3duLmNhbGwodmFsdWVTZWxlY3Rvciwgb3ApICYmXG4gICAgICAgICAgICAgICAgdmFsdWVTZWxlY3RvcltvcF0gPCB1cHBlckJvdW5kKSB7XG4gICAgICAgICAgICAgIHVwcGVyQm91bmQgPSB2YWx1ZVNlbGVjdG9yW29wXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIFsnJGd0ZScsICckZ3QnXS5mb3JFYWNoKG9wID0+IHtcbiAgICAgICAgICAgIGlmIChoYXNPd24uY2FsbCh2YWx1ZVNlbGVjdG9yLCBvcCkgJiZcbiAgICAgICAgICAgICAgICB2YWx1ZVNlbGVjdG9yW29wXSA+IGxvd2VyQm91bmQpIHtcbiAgICAgICAgICAgICAgbG93ZXJCb3VuZCA9IHZhbHVlU2VsZWN0b3Jbb3BdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgY29uc3QgbWlkZGxlID0gKGxvd2VyQm91bmQgKyB1cHBlckJvdW5kKSAvIDI7XG4gICAgICAgICAgY29uc3QgbWF0Y2hlciA9IG5ldyBNaW5pbW9uZ28uTWF0Y2hlcih7cGxhY2Vob2xkZXI6IHZhbHVlU2VsZWN0b3J9KTtcblxuICAgICAgICAgIGlmICghbWF0Y2hlci5kb2N1bWVudE1hdGNoZXMoe3BsYWNlaG9sZGVyOiBtaWRkbGV9KS5yZXN1bHQgJiZcbiAgICAgICAgICAgICAgKG1pZGRsZSA9PT0gbG93ZXJCb3VuZCB8fCBtaWRkbGUgPT09IHVwcGVyQm91bmQpKSB7XG4gICAgICAgICAgICBmYWxsYmFjayA9IHRydWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIG1pZGRsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvbmx5Q29udGFpbnNLZXlzKHZhbHVlU2VsZWN0b3IsIFsnJG5pbicsICckbmUnXSkpIHtcbiAgICAgICAgICAvLyBTaW5jZSB0aGlzLl9pc1NpbXBsZSBtYWtlcyBzdXJlICRuaW4gYW5kICRuZSBhcmUgbm90IGNvbWJpbmVkIHdpdGhcbiAgICAgICAgICAvLyBvYmplY3RzIG9yIGFycmF5cywgd2UgY2FuIGNvbmZpZGVudGx5IHJldHVybiBhbiBlbXB0eSBvYmplY3QgYXMgaXRcbiAgICAgICAgICAvLyBuZXZlciBtYXRjaGVzIGFueSBzY2FsYXIuXG4gICAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgZmFsbGJhY2sgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5fc2VsZWN0b3JbcGF0aF07XG4gICAgfSxcbiAgICB4ID0+IHgpO1xuXG4gIGlmIChmYWxsYmFjaykge1xuICAgIHRoaXMuX21hdGNoaW5nRG9jdW1lbnQgPSBudWxsO1xuICB9XG5cbiAgcmV0dXJuIHRoaXMuX21hdGNoaW5nRG9jdW1lbnQ7XG59O1xuXG4vLyBNaW5pbW9uZ28uU29ydGVyIGdldHMgYSBzaW1pbGFyIG1ldGhvZCwgd2hpY2ggZGVsZWdhdGVzIHRvIGEgTWF0Y2hlciBpdCBtYWRlXG4vLyBmb3IgdGhpcyBleGFjdCBwdXJwb3NlLlxuTWluaW1vbmdvLlNvcnRlci5wcm90b3R5cGUuYWZmZWN0ZWRCeU1vZGlmaWVyID0gZnVuY3Rpb24obW9kaWZpZXIpIHtcbiAgcmV0dXJuIHRoaXMuX3NlbGVjdG9yRm9yQWZmZWN0ZWRCeU1vZGlmaWVyLmFmZmVjdGVkQnlNb2RpZmllcihtb2RpZmllcik7XG59O1xuXG5NaW5pbW9uZ28uU29ydGVyLnByb3RvdHlwZS5jb21iaW5lSW50b1Byb2plY3Rpb24gPSBmdW5jdGlvbihwcm9qZWN0aW9uKSB7XG4gIHJldHVybiBjb21iaW5lSW1wb3J0YW50UGF0aHNJbnRvUHJvamVjdGlvbihcbiAgICBNaW5pbW9uZ28uX3BhdGhzRWxpZGluZ051bWVyaWNLZXlzKHRoaXMuX2dldFBhdGhzKCkpLFxuICAgIHByb2plY3Rpb25cbiAgKTtcbn07XG5cbmZ1bmN0aW9uIGNvbWJpbmVJbXBvcnRhbnRQYXRoc0ludG9Qcm9qZWN0aW9uKHBhdGhzLCBwcm9qZWN0aW9uKSB7XG4gIGNvbnN0IGRldGFpbHMgPSBwcm9qZWN0aW9uRGV0YWlscyhwcm9qZWN0aW9uKTtcblxuICAvLyBtZXJnZSB0aGUgcGF0aHMgdG8gaW5jbHVkZVxuICBjb25zdCB0cmVlID0gcGF0aHNUb1RyZWUoXG4gICAgcGF0aHMsXG4gICAgcGF0aCA9PiB0cnVlLFxuICAgIChub2RlLCBwYXRoLCBmdWxsUGF0aCkgPT4gdHJ1ZSxcbiAgICBkZXRhaWxzLnRyZWVcbiAgKTtcbiAgY29uc3QgbWVyZ2VkUHJvamVjdGlvbiA9IHRyZWVUb1BhdGhzKHRyZWUpO1xuXG4gIGlmIChkZXRhaWxzLmluY2x1ZGluZykge1xuICAgIC8vIGJvdGggc2VsZWN0b3IgYW5kIHByb2plY3Rpb24gYXJlIHBvaW50aW5nIG9uIGZpZWxkcyB0byBpbmNsdWRlXG4gICAgLy8gc28gd2UgY2FuIGp1c3QgcmV0dXJuIHRoZSBtZXJnZWQgdHJlZVxuICAgIHJldHVybiBtZXJnZWRQcm9qZWN0aW9uO1xuICB9XG5cbiAgLy8gc2VsZWN0b3IgaXMgcG9pbnRpbmcgYXQgZmllbGRzIHRvIGluY2x1ZGVcbiAgLy8gcHJvamVjdGlvbiBpcyBwb2ludGluZyBhdCBmaWVsZHMgdG8gZXhjbHVkZVxuICAvLyBtYWtlIHN1cmUgd2UgZG9uJ3QgZXhjbHVkZSBpbXBvcnRhbnQgcGF0aHNcbiAgY29uc3QgbWVyZ2VkRXhjbFByb2plY3Rpb24gPSB7fTtcblxuICBPYmplY3Qua2V5cyhtZXJnZWRQcm9qZWN0aW9uKS5mb3JFYWNoKHBhdGggPT4ge1xuICAgIGlmICghbWVyZ2VkUHJvamVjdGlvbltwYXRoXSkge1xuICAgICAgbWVyZ2VkRXhjbFByb2plY3Rpb25bcGF0aF0gPSBmYWxzZTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBtZXJnZWRFeGNsUHJvamVjdGlvbjtcbn1cblxuZnVuY3Rpb24gZ2V0UGF0aHMoc2VsZWN0b3IpIHtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKG5ldyBNaW5pbW9uZ28uTWF0Y2hlcihzZWxlY3RvcikuX3BhdGhzKTtcblxuICAvLyBYWFggcmVtb3ZlIGl0P1xuICAvLyByZXR1cm4gT2JqZWN0LmtleXMoc2VsZWN0b3IpLm1hcChrID0+IHtcbiAgLy8gICAvLyB3ZSBkb24ndCBrbm93IGhvdyB0byBoYW5kbGUgJHdoZXJlIGJlY2F1c2UgaXQgY2FuIGJlIGFueXRoaW5nXG4gIC8vICAgaWYgKGsgPT09ICckd2hlcmUnKSB7XG4gIC8vICAgICByZXR1cm4gJyc7IC8vIG1hdGNoZXMgZXZlcnl0aGluZ1xuICAvLyAgIH1cblxuICAvLyAgIC8vIHdlIGJyYW5jaCBmcm9tICRvci8kYW5kLyRub3Igb3BlcmF0b3JcbiAgLy8gICBpZiAoWyckb3InLCAnJGFuZCcsICckbm9yJ10uaW5jbHVkZXMoaykpIHtcbiAgLy8gICAgIHJldHVybiBzZWxlY3RvcltrXS5tYXAoZ2V0UGF0aHMpO1xuICAvLyAgIH1cblxuICAvLyAgIC8vIHRoZSB2YWx1ZSBpcyBhIGxpdGVyYWwgb3Igc29tZSBjb21wYXJpc29uIG9wZXJhdG9yXG4gIC8vICAgcmV0dXJuIGs7XG4gIC8vIH0pXG4gIC8vICAgLnJlZHVjZSgoYSwgYikgPT4gYS5jb25jYXQoYiksIFtdKVxuICAvLyAgIC5maWx0ZXIoKGEsIGIsIGMpID0+IGMuaW5kZXhPZihhKSA9PT0gYik7XG59XG5cbi8vIEEgaGVscGVyIHRvIGVuc3VyZSBvYmplY3QgaGFzIG9ubHkgY2VydGFpbiBrZXlzXG5mdW5jdGlvbiBvbmx5Q29udGFpbnNLZXlzKG9iaiwga2V5cykge1xuICByZXR1cm4gT2JqZWN0LmtleXMob2JqKS5ldmVyeShrID0+IGtleXMuaW5jbHVkZXMoaykpO1xufVxuXG5mdW5jdGlvbiBwYXRoSGFzTnVtZXJpY0tleXMocGF0aCkge1xuICByZXR1cm4gcGF0aC5zcGxpdCgnLicpLnNvbWUoaXNOdW1lcmljS2V5KTtcbn1cblxuLy8gUmV0dXJucyBhIHNldCBvZiBrZXkgcGF0aHMgc2ltaWxhciB0b1xuLy8geyAnZm9vLmJhcic6IDEsICdhLmIuYyc6IDEgfVxuZnVuY3Rpb24gdHJlZVRvUGF0aHModHJlZSwgcHJlZml4ID0gJycpIHtcbiAgY29uc3QgcmVzdWx0ID0ge307XG5cbiAgT2JqZWN0LmtleXModHJlZSkuZm9yRWFjaChrZXkgPT4ge1xuICAgIGNvbnN0IHZhbHVlID0gdHJlZVtrZXldO1xuICAgIGlmICh2YWx1ZSA9PT0gT2JqZWN0KHZhbHVlKSkge1xuICAgICAgT2JqZWN0LmFzc2lnbihyZXN1bHQsIHRyZWVUb1BhdGhzKHZhbHVlLCBgJHtwcmVmaXggKyBrZXl9LmApKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0W3ByZWZpeCArIGtleV0gPSB2YWx1ZTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiByZXN1bHQ7XG59XG4iLCJpbXBvcnQgTG9jYWxDb2xsZWN0aW9uIGZyb20gJy4vbG9jYWxfY29sbGVjdGlvbi5qcyc7XG5cbmV4cG9ydCBjb25zdCBoYXNPd24gPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG4vLyBFYWNoIGVsZW1lbnQgc2VsZWN0b3IgY29udGFpbnM6XG4vLyAgLSBjb21waWxlRWxlbWVudFNlbGVjdG9yLCBhIGZ1bmN0aW9uIHdpdGggYXJnczpcbi8vICAgIC0gb3BlcmFuZCAtIHRoZSBcInJpZ2h0IGhhbmQgc2lkZVwiIG9mIHRoZSBvcGVyYXRvclxuLy8gICAgLSB2YWx1ZVNlbGVjdG9yIC0gdGhlIFwiY29udGV4dFwiIGZvciB0aGUgb3BlcmF0b3IgKHNvIHRoYXQgJHJlZ2V4IGNhbiBmaW5kXG4vLyAgICAgICRvcHRpb25zKVxuLy8gICAgLSBtYXRjaGVyIC0gdGhlIE1hdGNoZXIgdGhpcyBpcyBnb2luZyBpbnRvIChzbyB0aGF0ICRlbGVtTWF0Y2ggY2FuIGNvbXBpbGVcbi8vICAgICAgbW9yZSB0aGluZ3MpXG4vLyAgICByZXR1cm5pbmcgYSBmdW5jdGlvbiBtYXBwaW5nIGEgc2luZ2xlIHZhbHVlIHRvIGJvb2wuXG4vLyAgLSBkb250RXhwYW5kTGVhZkFycmF5cywgYSBib29sIHdoaWNoIHByZXZlbnRzIGV4cGFuZEFycmF5c0luQnJhbmNoZXMgZnJvbVxuLy8gICAgYmVpbmcgY2FsbGVkXG4vLyAgLSBkb250SW5jbHVkZUxlYWZBcnJheXMsIGEgYm9vbCB3aGljaCBjYXVzZXMgYW4gYXJndW1lbnQgdG8gYmUgcGFzc2VkIHRvXG4vLyAgICBleHBhbmRBcnJheXNJbkJyYW5jaGVzIGlmIGl0IGlzIGNhbGxlZFxuZXhwb3J0IGNvbnN0IEVMRU1FTlRfT1BFUkFUT1JTID0ge1xuICAkbHQ6IG1ha2VJbmVxdWFsaXR5KGNtcFZhbHVlID0+IGNtcFZhbHVlIDwgMCksXG4gICRndDogbWFrZUluZXF1YWxpdHkoY21wVmFsdWUgPT4gY21wVmFsdWUgPiAwKSxcbiAgJGx0ZTogbWFrZUluZXF1YWxpdHkoY21wVmFsdWUgPT4gY21wVmFsdWUgPD0gMCksXG4gICRndGU6IG1ha2VJbmVxdWFsaXR5KGNtcFZhbHVlID0+IGNtcFZhbHVlID49IDApLFxuICAkbW9kOiB7XG4gICAgY29tcGlsZUVsZW1lbnRTZWxlY3RvcihvcGVyYW5kKSB7XG4gICAgICBpZiAoIShBcnJheS5pc0FycmF5KG9wZXJhbmQpICYmIG9wZXJhbmQubGVuZ3RoID09PSAyXG4gICAgICAgICAgICAmJiB0eXBlb2Ygb3BlcmFuZFswXSA9PT0gJ251bWJlcidcbiAgICAgICAgICAgICYmIHR5cGVvZiBvcGVyYW5kWzFdID09PSAnbnVtYmVyJykpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoJ2FyZ3VtZW50IHRvICRtb2QgbXVzdCBiZSBhbiBhcnJheSBvZiB0d28gbnVtYmVycycpO1xuICAgICAgfVxuXG4gICAgICAvLyBYWFggY291bGQgcmVxdWlyZSB0byBiZSBpbnRzIG9yIHJvdW5kIG9yIHNvbWV0aGluZ1xuICAgICAgY29uc3QgZGl2aXNvciA9IG9wZXJhbmRbMF07XG4gICAgICBjb25zdCByZW1haW5kZXIgPSBvcGVyYW5kWzFdO1xuICAgICAgcmV0dXJuIHZhbHVlID0+IChcbiAgICAgICAgdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiB2YWx1ZSAlIGRpdmlzb3IgPT09IHJlbWFpbmRlclxuICAgICAgKTtcbiAgICB9LFxuICB9LFxuICAkaW46IHtcbiAgICBjb21waWxlRWxlbWVudFNlbGVjdG9yKG9wZXJhbmQpIHtcbiAgICAgIGlmICghQXJyYXkuaXNBcnJheShvcGVyYW5kKSkge1xuICAgICAgICB0aHJvdyBFcnJvcignJGluIG5lZWRzIGFuIGFycmF5Jyk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGVsZW1lbnRNYXRjaGVycyA9IG9wZXJhbmQubWFwKG9wdGlvbiA9PiB7XG4gICAgICAgIGlmIChvcHRpb24gaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICAgICAgICByZXR1cm4gcmVnZXhwRWxlbWVudE1hdGNoZXIob3B0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc09wZXJhdG9yT2JqZWN0KG9wdGlvbikpIHtcbiAgICAgICAgICB0aHJvdyBFcnJvcignY2Fubm90IG5lc3QgJCB1bmRlciAkaW4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBlcXVhbGl0eUVsZW1lbnRNYXRjaGVyKG9wdGlvbik7XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHZhbHVlID0+IHtcbiAgICAgICAgLy8gQWxsb3cge2E6IHskaW46IFtudWxsXX19IHRvIG1hdGNoIHdoZW4gJ2EnIGRvZXMgbm90IGV4aXN0LlxuICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHZhbHVlID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBlbGVtZW50TWF0Y2hlcnMuc29tZShtYXRjaGVyID0+IG1hdGNoZXIodmFsdWUpKTtcbiAgICAgIH07XG4gICAgfSxcbiAgfSxcbiAgJHNpemU6IHtcbiAgICAvLyB7YTogW1s1LCA1XV19IG11c3QgbWF0Y2gge2E6IHskc2l6ZTogMX19IGJ1dCBub3Qge2E6IHskc2l6ZTogMn19LCBzbyB3ZVxuICAgIC8vIGRvbid0IHdhbnQgdG8gY29uc2lkZXIgdGhlIGVsZW1lbnQgWzUsNV0gaW4gdGhlIGxlYWYgYXJyYXkgW1s1LDVdXSBhcyBhXG4gICAgLy8gcG9zc2libGUgdmFsdWUuXG4gICAgZG9udEV4cGFuZExlYWZBcnJheXM6IHRydWUsXG4gICAgY29tcGlsZUVsZW1lbnRTZWxlY3RvcihvcGVyYW5kKSB7XG4gICAgICBpZiAodHlwZW9mIG9wZXJhbmQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIC8vIERvbid0IGFzayBtZSB3aHksIGJ1dCBieSBleHBlcmltZW50YXRpb24sIHRoaXMgc2VlbXMgdG8gYmUgd2hhdCBNb25nb1xuICAgICAgICAvLyBkb2VzLlxuICAgICAgICBvcGVyYW5kID0gMDtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIG9wZXJhbmQgIT09ICdudW1iZXInKSB7XG4gICAgICAgIHRocm93IEVycm9yKCckc2l6ZSBuZWVkcyBhIG51bWJlcicpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdmFsdWUgPT4gQXJyYXkuaXNBcnJheSh2YWx1ZSkgJiYgdmFsdWUubGVuZ3RoID09PSBvcGVyYW5kO1xuICAgIH0sXG4gIH0sXG4gICR0eXBlOiB7XG4gICAgLy8ge2E6IFs1XX0gbXVzdCBub3QgbWF0Y2gge2E6IHskdHlwZTogNH19ICg0IG1lYW5zIGFycmF5KSwgYnV0IGl0IHNob3VsZFxuICAgIC8vIG1hdGNoIHthOiB7JHR5cGU6IDF9fSAoMSBtZWFucyBudW1iZXIpLCBhbmQge2E6IFtbNV1dfSBtdXN0IG1hdGNoIHskYTpcbiAgICAvLyB7JHR5cGU6IDR9fS4gVGh1cywgd2hlbiB3ZSBzZWUgYSBsZWFmIGFycmF5LCB3ZSAqc2hvdWxkKiBleHBhbmQgaXQgYnV0XG4gICAgLy8gc2hvdWxkICpub3QqIGluY2x1ZGUgaXQgaXRzZWxmLlxuICAgIGRvbnRJbmNsdWRlTGVhZkFycmF5czogdHJ1ZSxcbiAgICBjb21waWxlRWxlbWVudFNlbGVjdG9yKG9wZXJhbmQpIHtcbiAgICAgIGlmICh0eXBlb2Ygb3BlcmFuZCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgY29uc3Qgb3BlcmFuZEFsaWFzTWFwID0ge1xuICAgICAgICAgICdkb3VibGUnOiAxLFxuICAgICAgICAgICdzdHJpbmcnOiAyLFxuICAgICAgICAgICdvYmplY3QnOiAzLFxuICAgICAgICAgICdhcnJheSc6IDQsXG4gICAgICAgICAgJ2JpbkRhdGEnOiA1LFxuICAgICAgICAgICd1bmRlZmluZWQnOiA2LFxuICAgICAgICAgICdvYmplY3RJZCc6IDcsXG4gICAgICAgICAgJ2Jvb2wnOiA4LFxuICAgICAgICAgICdkYXRlJzogOSxcbiAgICAgICAgICAnbnVsbCc6IDEwLFxuICAgICAgICAgICdyZWdleCc6IDExLFxuICAgICAgICAgICdkYlBvaW50ZXInOiAxMixcbiAgICAgICAgICAnamF2YXNjcmlwdCc6IDEzLFxuICAgICAgICAgICdzeW1ib2wnOiAxNCxcbiAgICAgICAgICAnamF2YXNjcmlwdFdpdGhTY29wZSc6IDE1LFxuICAgICAgICAgICdpbnQnOiAxNixcbiAgICAgICAgICAndGltZXN0YW1wJzogMTcsXG4gICAgICAgICAgJ2xvbmcnOiAxOCxcbiAgICAgICAgICAnZGVjaW1hbCc6IDE5LFxuICAgICAgICAgICdtaW5LZXknOiAtMSxcbiAgICAgICAgICAnbWF4S2V5JzogMTI3LFxuICAgICAgICB9O1xuICAgICAgICBpZiAoIWhhc093bi5jYWxsKG9wZXJhbmRBbGlhc01hcCwgb3BlcmFuZCkpIHtcbiAgICAgICAgICB0aHJvdyBFcnJvcihgdW5rbm93biBzdHJpbmcgYWxpYXMgZm9yICR0eXBlOiAke29wZXJhbmR9YCk7XG4gICAgICAgIH1cbiAgICAgICAgb3BlcmFuZCA9IG9wZXJhbmRBbGlhc01hcFtvcGVyYW5kXTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIG9wZXJhbmQgPT09ICdudW1iZXInKSB7XG4gICAgICAgIGlmIChvcGVyYW5kID09PSAwIHx8IG9wZXJhbmQgPCAtMVxuICAgICAgICAgIHx8IChvcGVyYW5kID4gMTkgJiYgb3BlcmFuZCAhPT0gMTI3KSkge1xuICAgICAgICAgIHRocm93IEVycm9yKGBJbnZhbGlkIG51bWVyaWNhbCAkdHlwZSBjb2RlOiAke29wZXJhbmR9YCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IEVycm9yKCdhcmd1bWVudCB0byAkdHlwZSBpcyBub3QgYSBudW1iZXIgb3IgYSBzdHJpbmcnKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHZhbHVlID0+IChcbiAgICAgICAgdmFsdWUgIT09IHVuZGVmaW5lZCAmJiBMb2NhbENvbGxlY3Rpb24uX2YuX3R5cGUodmFsdWUpID09PSBvcGVyYW5kXG4gICAgICApO1xuICAgIH0sXG4gIH0sXG4gICRiaXRzQWxsU2V0OiB7XG4gICAgY29tcGlsZUVsZW1lbnRTZWxlY3RvcihvcGVyYW5kKSB7XG4gICAgICBjb25zdCBtYXNrID0gZ2V0T3BlcmFuZEJpdG1hc2sob3BlcmFuZCwgJyRiaXRzQWxsU2V0Jyk7XG4gICAgICByZXR1cm4gdmFsdWUgPT4ge1xuICAgICAgICBjb25zdCBiaXRtYXNrID0gZ2V0VmFsdWVCaXRtYXNrKHZhbHVlLCBtYXNrLmxlbmd0aCk7XG4gICAgICAgIHJldHVybiBiaXRtYXNrICYmIG1hc2suZXZlcnkoKGJ5dGUsIGkpID0+IChiaXRtYXNrW2ldICYgYnl0ZSkgPT09IGJ5dGUpO1xuICAgICAgfTtcbiAgICB9LFxuICB9LFxuICAkYml0c0FueVNldDoge1xuICAgIGNvbXBpbGVFbGVtZW50U2VsZWN0b3Iob3BlcmFuZCkge1xuICAgICAgY29uc3QgbWFzayA9IGdldE9wZXJhbmRCaXRtYXNrKG9wZXJhbmQsICckYml0c0FueVNldCcpO1xuICAgICAgcmV0dXJuIHZhbHVlID0+IHtcbiAgICAgICAgY29uc3QgYml0bWFzayA9IGdldFZhbHVlQml0bWFzayh2YWx1ZSwgbWFzay5sZW5ndGgpO1xuICAgICAgICByZXR1cm4gYml0bWFzayAmJiBtYXNrLnNvbWUoKGJ5dGUsIGkpID0+ICh+Yml0bWFza1tpXSAmIGJ5dGUpICE9PSBieXRlKTtcbiAgICAgIH07XG4gICAgfSxcbiAgfSxcbiAgJGJpdHNBbGxDbGVhcjoge1xuICAgIGNvbXBpbGVFbGVtZW50U2VsZWN0b3Iob3BlcmFuZCkge1xuICAgICAgY29uc3QgbWFzayA9IGdldE9wZXJhbmRCaXRtYXNrKG9wZXJhbmQsICckYml0c0FsbENsZWFyJyk7XG4gICAgICByZXR1cm4gdmFsdWUgPT4ge1xuICAgICAgICBjb25zdCBiaXRtYXNrID0gZ2V0VmFsdWVCaXRtYXNrKHZhbHVlLCBtYXNrLmxlbmd0aCk7XG4gICAgICAgIHJldHVybiBiaXRtYXNrICYmIG1hc2suZXZlcnkoKGJ5dGUsIGkpID0+ICEoYml0bWFza1tpXSAmIGJ5dGUpKTtcbiAgICAgIH07XG4gICAgfSxcbiAgfSxcbiAgJGJpdHNBbnlDbGVhcjoge1xuICAgIGNvbXBpbGVFbGVtZW50U2VsZWN0b3Iob3BlcmFuZCkge1xuICAgICAgY29uc3QgbWFzayA9IGdldE9wZXJhbmRCaXRtYXNrKG9wZXJhbmQsICckYml0c0FueUNsZWFyJyk7XG4gICAgICByZXR1cm4gdmFsdWUgPT4ge1xuICAgICAgICBjb25zdCBiaXRtYXNrID0gZ2V0VmFsdWVCaXRtYXNrKHZhbHVlLCBtYXNrLmxlbmd0aCk7XG4gICAgICAgIHJldHVybiBiaXRtYXNrICYmIG1hc2suc29tZSgoYnl0ZSwgaSkgPT4gKGJpdG1hc2tbaV0gJiBieXRlKSAhPT0gYnl0ZSk7XG4gICAgICB9O1xuICAgIH0sXG4gIH0sXG4gICRyZWdleDoge1xuICAgIGNvbXBpbGVFbGVtZW50U2VsZWN0b3Iob3BlcmFuZCwgdmFsdWVTZWxlY3Rvcikge1xuICAgICAgaWYgKCEodHlwZW9mIG9wZXJhbmQgPT09ICdzdHJpbmcnIHx8IG9wZXJhbmQgaW5zdGFuY2VvZiBSZWdFeHApKSB7XG4gICAgICAgIHRocm93IEVycm9yKCckcmVnZXggaGFzIHRvIGJlIGEgc3RyaW5nIG9yIFJlZ0V4cCcpO1xuICAgICAgfVxuXG4gICAgICBsZXQgcmVnZXhwO1xuICAgICAgaWYgKHZhbHVlU2VsZWN0b3IuJG9wdGlvbnMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAvLyBPcHRpb25zIHBhc3NlZCBpbiAkb3B0aW9ucyAoZXZlbiB0aGUgZW1wdHkgc3RyaW5nKSBhbHdheXMgb3ZlcnJpZGVzXG4gICAgICAgIC8vIG9wdGlvbnMgaW4gdGhlIFJlZ0V4cCBvYmplY3QgaXRzZWxmLlxuXG4gICAgICAgIC8vIEJlIGNsZWFyIHRoYXQgd2Ugb25seSBzdXBwb3J0IHRoZSBKUy1zdXBwb3J0ZWQgb3B0aW9ucywgbm90IGV4dGVuZGVkXG4gICAgICAgIC8vIG9uZXMgKGVnLCBNb25nbyBzdXBwb3J0cyB4IGFuZCBzKS4gSWRlYWxseSB3ZSB3b3VsZCBpbXBsZW1lbnQgeCBhbmQgc1xuICAgICAgICAvLyBieSB0cmFuc2Zvcm1pbmcgdGhlIHJlZ2V4cCwgYnV0IG5vdCB0b2RheS4uLlxuICAgICAgICBpZiAoL1teZ2ltXS8udGVzdCh2YWx1ZVNlbGVjdG9yLiRvcHRpb25zKSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignT25seSB0aGUgaSwgbSwgYW5kIGcgcmVnZXhwIG9wdGlvbnMgYXJlIHN1cHBvcnRlZCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc291cmNlID0gb3BlcmFuZCBpbnN0YW5jZW9mIFJlZ0V4cCA/IG9wZXJhbmQuc291cmNlIDogb3BlcmFuZDtcbiAgICAgICAgcmVnZXhwID0gbmV3IFJlZ0V4cChzb3VyY2UsIHZhbHVlU2VsZWN0b3IuJG9wdGlvbnMpO1xuICAgICAgfSBlbHNlIGlmIChvcGVyYW5kIGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgICAgIHJlZ2V4cCA9IG9wZXJhbmQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZWdleHAgPSBuZXcgUmVnRXhwKG9wZXJhbmQpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVnZXhwRWxlbWVudE1hdGNoZXIocmVnZXhwKTtcbiAgICB9LFxuICB9LFxuICAkZWxlbU1hdGNoOiB7XG4gICAgZG9udEV4cGFuZExlYWZBcnJheXM6IHRydWUsXG4gICAgY29tcGlsZUVsZW1lbnRTZWxlY3RvcihvcGVyYW5kLCB2YWx1ZVNlbGVjdG9yLCBtYXRjaGVyKSB7XG4gICAgICBpZiAoIUxvY2FsQ29sbGVjdGlvbi5faXNQbGFpbk9iamVjdChvcGVyYW5kKSkge1xuICAgICAgICB0aHJvdyBFcnJvcignJGVsZW1NYXRjaCBuZWVkIGFuIG9iamVjdCcpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBpc0RvY01hdGNoZXIgPSAhaXNPcGVyYXRvck9iamVjdChcbiAgICAgICAgT2JqZWN0LmtleXMob3BlcmFuZClcbiAgICAgICAgICAuZmlsdGVyKGtleSA9PiAhaGFzT3duLmNhbGwoTE9HSUNBTF9PUEVSQVRPUlMsIGtleSkpXG4gICAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gT2JqZWN0LmFzc2lnbihhLCB7W2JdOiBvcGVyYW5kW2JdfSksIHt9KSxcbiAgICAgICAgdHJ1ZSk7XG5cbiAgICAgIGxldCBzdWJNYXRjaGVyO1xuICAgICAgaWYgKGlzRG9jTWF0Y2hlcikge1xuICAgICAgICAvLyBUaGlzIGlzIE5PVCB0aGUgc2FtZSBhcyBjb21waWxlVmFsdWVTZWxlY3RvcihvcGVyYW5kKSwgYW5kIG5vdCBqdXN0XG4gICAgICAgIC8vIGJlY2F1c2Ugb2YgdGhlIHNsaWdodGx5IGRpZmZlcmVudCBjYWxsaW5nIGNvbnZlbnRpb24uXG4gICAgICAgIC8vIHskZWxlbU1hdGNoOiB7eDogM319IG1lYW5zIFwiYW4gZWxlbWVudCBoYXMgYSBmaWVsZCB4OjNcIiwgbm90XG4gICAgICAgIC8vIFwiY29uc2lzdHMgb25seSBvZiBhIGZpZWxkIHg6M1wiLiBBbHNvLCByZWdleHBzIGFuZCBzdWItJCBhcmUgYWxsb3dlZC5cbiAgICAgICAgc3ViTWF0Y2hlciA9XG4gICAgICAgICAgY29tcGlsZURvY3VtZW50U2VsZWN0b3Iob3BlcmFuZCwgbWF0Y2hlciwge2luRWxlbU1hdGNoOiB0cnVlfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdWJNYXRjaGVyID0gY29tcGlsZVZhbHVlU2VsZWN0b3Iob3BlcmFuZCwgbWF0Y2hlcik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB2YWx1ZSA9PiB7XG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZhbHVlLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgY29uc3QgYXJyYXlFbGVtZW50ID0gdmFsdWVbaV07XG4gICAgICAgICAgbGV0IGFyZztcbiAgICAgICAgICBpZiAoaXNEb2NNYXRjaGVyKSB7XG4gICAgICAgICAgICAvLyBXZSBjYW4gb25seSBtYXRjaCB7JGVsZW1NYXRjaDoge2I6IDN9fSBhZ2FpbnN0IG9iamVjdHMuXG4gICAgICAgICAgICAvLyAoV2UgY2FuIGFsc28gbWF0Y2ggYWdhaW5zdCBhcnJheXMsIGlmIHRoZXJlJ3MgbnVtZXJpYyBpbmRpY2VzLFxuICAgICAgICAgICAgLy8gZWcgeyRlbGVtTWF0Y2g6IHsnMC5iJzogM319IG9yIHskZWxlbU1hdGNoOiB7MDogM319LilcbiAgICAgICAgICAgIGlmICghaXNJbmRleGFibGUoYXJyYXlFbGVtZW50KSkge1xuICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGFyZyA9IGFycmF5RWxlbWVudDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gZG9udEl0ZXJhdGUgZW5zdXJlcyB0aGF0IHthOiB7JGVsZW1NYXRjaDogeyRndDogNX19fSBtYXRjaGVzXG4gICAgICAgICAgICAvLyB7YTogWzhdfSBidXQgbm90IHthOiBbWzhdXX1cbiAgICAgICAgICAgIGFyZyA9IFt7dmFsdWU6IGFycmF5RWxlbWVudCwgZG9udEl0ZXJhdGU6IHRydWV9XTtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gWFhYIHN1cHBvcnQgJG5lYXIgaW4gJGVsZW1NYXRjaCBieSBwcm9wYWdhdGluZyAkZGlzdGFuY2U/XG4gICAgICAgICAgaWYgKHN1Yk1hdGNoZXIoYXJnKS5yZXN1bHQpIHtcbiAgICAgICAgICAgIHJldHVybiBpOyAvLyBzcGVjaWFsbHkgdW5kZXJzdG9vZCB0byBtZWFuIFwidXNlIGFzIGFycmF5SW5kaWNlc1wiXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfTtcbiAgICB9LFxuICB9LFxufTtcblxuLy8gT3BlcmF0b3JzIHRoYXQgYXBwZWFyIGF0IHRoZSB0b3AgbGV2ZWwgb2YgYSBkb2N1bWVudCBzZWxlY3Rvci5cbmNvbnN0IExPR0lDQUxfT1BFUkFUT1JTID0ge1xuICAkYW5kKHN1YlNlbGVjdG9yLCBtYXRjaGVyLCBpbkVsZW1NYXRjaCkge1xuICAgIHJldHVybiBhbmREb2N1bWVudE1hdGNoZXJzKFxuICAgICAgY29tcGlsZUFycmF5T2ZEb2N1bWVudFNlbGVjdG9ycyhzdWJTZWxlY3RvciwgbWF0Y2hlciwgaW5FbGVtTWF0Y2gpXG4gICAgKTtcbiAgfSxcblxuICAkb3Ioc3ViU2VsZWN0b3IsIG1hdGNoZXIsIGluRWxlbU1hdGNoKSB7XG4gICAgY29uc3QgbWF0Y2hlcnMgPSBjb21waWxlQXJyYXlPZkRvY3VtZW50U2VsZWN0b3JzKFxuICAgICAgc3ViU2VsZWN0b3IsXG4gICAgICBtYXRjaGVyLFxuICAgICAgaW5FbGVtTWF0Y2hcbiAgICApO1xuXG4gICAgLy8gU3BlY2lhbCBjYXNlOiBpZiB0aGVyZSBpcyBvbmx5IG9uZSBtYXRjaGVyLCB1c2UgaXQgZGlyZWN0bHksICpwcmVzZXJ2aW5nKlxuICAgIC8vIGFueSBhcnJheUluZGljZXMgaXQgcmV0dXJucy5cbiAgICBpZiAobWF0Y2hlcnMubGVuZ3RoID09PSAxKSB7XG4gICAgICByZXR1cm4gbWF0Y2hlcnNbMF07XG4gICAgfVxuXG4gICAgcmV0dXJuIGRvYyA9PiB7XG4gICAgICBjb25zdCByZXN1bHQgPSBtYXRjaGVycy5zb21lKGZuID0+IGZuKGRvYykucmVzdWx0KTtcbiAgICAgIC8vICRvciBkb2VzIE5PVCBzZXQgYXJyYXlJbmRpY2VzIHdoZW4gaXQgaGFzIG11bHRpcGxlXG4gICAgICAvLyBzdWItZXhwcmVzc2lvbnMuIChUZXN0ZWQgYWdhaW5zdCBNb25nb0RCLilcbiAgICAgIHJldHVybiB7cmVzdWx0fTtcbiAgICB9O1xuICB9LFxuXG4gICRub3Ioc3ViU2VsZWN0b3IsIG1hdGNoZXIsIGluRWxlbU1hdGNoKSB7XG4gICAgY29uc3QgbWF0Y2hlcnMgPSBjb21waWxlQXJyYXlPZkRvY3VtZW50U2VsZWN0b3JzKFxuICAgICAgc3ViU2VsZWN0b3IsXG4gICAgICBtYXRjaGVyLFxuICAgICAgaW5FbGVtTWF0Y2hcbiAgICApO1xuICAgIHJldHVybiBkb2MgPT4ge1xuICAgICAgY29uc3QgcmVzdWx0ID0gbWF0Y2hlcnMuZXZlcnkoZm4gPT4gIWZuKGRvYykucmVzdWx0KTtcbiAgICAgIC8vIE5ldmVyIHNldCBhcnJheUluZGljZXMsIGJlY2F1c2Ugd2Ugb25seSBtYXRjaCBpZiBub3RoaW5nIGluIHBhcnRpY3VsYXJcbiAgICAgIC8vICdtYXRjaGVkJyAoYW5kIGJlY2F1c2UgdGhpcyBpcyBjb25zaXN0ZW50IHdpdGggTW9uZ29EQikuXG4gICAgICByZXR1cm4ge3Jlc3VsdH07XG4gICAgfTtcbiAgfSxcblxuICAkd2hlcmUoc2VsZWN0b3JWYWx1ZSwgbWF0Y2hlcikge1xuICAgIC8vIFJlY29yZCB0aGF0ICphbnkqIHBhdGggbWF5IGJlIHVzZWQuXG4gICAgbWF0Y2hlci5fcmVjb3JkUGF0aFVzZWQoJycpO1xuICAgIG1hdGNoZXIuX2hhc1doZXJlID0gdHJ1ZTtcblxuICAgIGlmICghKHNlbGVjdG9yVmFsdWUgaW5zdGFuY2VvZiBGdW5jdGlvbikpIHtcbiAgICAgIC8vIFhYWCBNb25nb0RCIHNlZW1zIHRvIGhhdmUgbW9yZSBjb21wbGV4IGxvZ2ljIHRvIGRlY2lkZSB3aGVyZSBvciBvciBub3RcbiAgICAgIC8vIHRvIGFkZCAncmV0dXJuJzsgbm90IHN1cmUgZXhhY3RseSB3aGF0IGl0IGlzLlxuICAgICAgc2VsZWN0b3JWYWx1ZSA9IEZ1bmN0aW9uKCdvYmonLCBgcmV0dXJuICR7c2VsZWN0b3JWYWx1ZX1gKTtcbiAgICB9XG5cbiAgICAvLyBXZSBtYWtlIHRoZSBkb2N1bWVudCBhdmFpbGFibGUgYXMgYm90aCBgdGhpc2AgYW5kIGBvYmpgLlxuICAgIC8vIC8vIFhYWCBub3Qgc3VyZSB3aGF0IHdlIHNob3VsZCBkbyBpZiB0aGlzIHRocm93c1xuICAgIHJldHVybiBkb2MgPT4gKHtyZXN1bHQ6IHNlbGVjdG9yVmFsdWUuY2FsbChkb2MsIGRvYyl9KTtcbiAgfSxcblxuICAvLyBUaGlzIGlzIGp1c3QgdXNlZCBhcyBhIGNvbW1lbnQgaW4gdGhlIHF1ZXJ5IChpbiBNb25nb0RCLCBpdCBhbHNvIGVuZHMgdXAgaW5cbiAgLy8gcXVlcnkgbG9ncyk7IGl0IGhhcyBubyBlZmZlY3Qgb24gdGhlIGFjdHVhbCBzZWxlY3Rpb24uXG4gICRjb21tZW50KCkge1xuICAgIHJldHVybiAoKSA9PiAoe3Jlc3VsdDogdHJ1ZX0pO1xuICB9LFxufTtcblxuLy8gT3BlcmF0b3JzIHRoYXQgKHVubGlrZSBMT0dJQ0FMX09QRVJBVE9SUykgcGVydGFpbiB0byBpbmRpdmlkdWFsIHBhdGhzIGluIGFcbi8vIGRvY3VtZW50LCBidXQgKHVubGlrZSBFTEVNRU5UX09QRVJBVE9SUykgZG8gbm90IGhhdmUgYSBzaW1wbGUgZGVmaW5pdGlvbiBhc1xuLy8gXCJtYXRjaCBlYWNoIGJyYW5jaGVkIHZhbHVlIGluZGVwZW5kZW50bHkgYW5kIGNvbWJpbmUgd2l0aFxuLy8gY29udmVydEVsZW1lbnRNYXRjaGVyVG9CcmFuY2hlZE1hdGNoZXJcIi5cbmNvbnN0IFZBTFVFX09QRVJBVE9SUyA9IHtcbiAgJGVxKG9wZXJhbmQpIHtcbiAgICByZXR1cm4gY29udmVydEVsZW1lbnRNYXRjaGVyVG9CcmFuY2hlZE1hdGNoZXIoXG4gICAgICBlcXVhbGl0eUVsZW1lbnRNYXRjaGVyKG9wZXJhbmQpXG4gICAgKTtcbiAgfSxcbiAgJG5vdChvcGVyYW5kLCB2YWx1ZVNlbGVjdG9yLCBtYXRjaGVyKSB7XG4gICAgcmV0dXJuIGludmVydEJyYW5jaGVkTWF0Y2hlcihjb21waWxlVmFsdWVTZWxlY3RvcihvcGVyYW5kLCBtYXRjaGVyKSk7XG4gIH0sXG4gICRuZShvcGVyYW5kKSB7XG4gICAgcmV0dXJuIGludmVydEJyYW5jaGVkTWF0Y2hlcihcbiAgICAgIGNvbnZlcnRFbGVtZW50TWF0Y2hlclRvQnJhbmNoZWRNYXRjaGVyKGVxdWFsaXR5RWxlbWVudE1hdGNoZXIob3BlcmFuZCkpXG4gICAgKTtcbiAgfSxcbiAgJG5pbihvcGVyYW5kKSB7XG4gICAgcmV0dXJuIGludmVydEJyYW5jaGVkTWF0Y2hlcihcbiAgICAgIGNvbnZlcnRFbGVtZW50TWF0Y2hlclRvQnJhbmNoZWRNYXRjaGVyKFxuICAgICAgICBFTEVNRU5UX09QRVJBVE9SUy4kaW4uY29tcGlsZUVsZW1lbnRTZWxlY3RvcihvcGVyYW5kKVxuICAgICAgKVxuICAgICk7XG4gIH0sXG4gICRleGlzdHMob3BlcmFuZCkge1xuICAgIGNvbnN0IGV4aXN0cyA9IGNvbnZlcnRFbGVtZW50TWF0Y2hlclRvQnJhbmNoZWRNYXRjaGVyKFxuICAgICAgdmFsdWUgPT4gdmFsdWUgIT09IHVuZGVmaW5lZFxuICAgICk7XG4gICAgcmV0dXJuIG9wZXJhbmQgPyBleGlzdHMgOiBpbnZlcnRCcmFuY2hlZE1hdGNoZXIoZXhpc3RzKTtcbiAgfSxcbiAgLy8gJG9wdGlvbnMganVzdCBwcm92aWRlcyBvcHRpb25zIGZvciAkcmVnZXg7IGl0cyBsb2dpYyBpcyBpbnNpZGUgJHJlZ2V4XG4gICRvcHRpb25zKG9wZXJhbmQsIHZhbHVlU2VsZWN0b3IpIHtcbiAgICBpZiAoIWhhc093bi5jYWxsKHZhbHVlU2VsZWN0b3IsICckcmVnZXgnKSkge1xuICAgICAgdGhyb3cgRXJyb3IoJyRvcHRpb25zIG5lZWRzIGEgJHJlZ2V4Jyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGV2ZXJ5dGhpbmdNYXRjaGVyO1xuICB9LFxuICAvLyAkbWF4RGlzdGFuY2UgaXMgYmFzaWNhbGx5IGFuIGFyZ3VtZW50IHRvICRuZWFyXG4gICRtYXhEaXN0YW5jZShvcGVyYW5kLCB2YWx1ZVNlbGVjdG9yKSB7XG4gICAgaWYgKCF2YWx1ZVNlbGVjdG9yLiRuZWFyKSB7XG4gICAgICB0aHJvdyBFcnJvcignJG1heERpc3RhbmNlIG5lZWRzIGEgJG5lYXInKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZXZlcnl0aGluZ01hdGNoZXI7XG4gIH0sXG4gICRhbGwob3BlcmFuZCwgdmFsdWVTZWxlY3RvciwgbWF0Y2hlcikge1xuICAgIGlmICghQXJyYXkuaXNBcnJheShvcGVyYW5kKSkge1xuICAgICAgdGhyb3cgRXJyb3IoJyRhbGwgcmVxdWlyZXMgYXJyYXknKTtcbiAgICB9XG5cbiAgICAvLyBOb3Qgc3VyZSB3aHksIGJ1dCB0aGlzIHNlZW1zIHRvIGJlIHdoYXQgTW9uZ29EQiBkb2VzLlxuICAgIGlmIChvcGVyYW5kLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIG5vdGhpbmdNYXRjaGVyO1xuICAgIH1cblxuICAgIGNvbnN0IGJyYW5jaGVkTWF0Y2hlcnMgPSBvcGVyYW5kLm1hcChjcml0ZXJpb24gPT4ge1xuICAgICAgLy8gWFhYIGhhbmRsZSAkYWxsLyRlbGVtTWF0Y2ggY29tYmluYXRpb25cbiAgICAgIGlmIChpc09wZXJhdG9yT2JqZWN0KGNyaXRlcmlvbikpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoJ25vICQgZXhwcmVzc2lvbnMgaW4gJGFsbCcpO1xuICAgICAgfVxuXG4gICAgICAvLyBUaGlzIGlzIGFsd2F5cyBhIHJlZ2V4cCBvciBlcXVhbGl0eSBzZWxlY3Rvci5cbiAgICAgIHJldHVybiBjb21waWxlVmFsdWVTZWxlY3Rvcihjcml0ZXJpb24sIG1hdGNoZXIpO1xuICAgIH0pO1xuXG4gICAgLy8gYW5kQnJhbmNoZWRNYXRjaGVycyBkb2VzIE5PVCByZXF1aXJlIGFsbCBzZWxlY3RvcnMgdG8gcmV0dXJuIHRydWUgb24gdGhlXG4gICAgLy8gU0FNRSBicmFuY2guXG4gICAgcmV0dXJuIGFuZEJyYW5jaGVkTWF0Y2hlcnMoYnJhbmNoZWRNYXRjaGVycyk7XG4gIH0sXG4gICRuZWFyKG9wZXJhbmQsIHZhbHVlU2VsZWN0b3IsIG1hdGNoZXIsIGlzUm9vdCkge1xuICAgIGlmICghaXNSb290KSB7XG4gICAgICB0aHJvdyBFcnJvcignJG5lYXIgY2FuXFwndCBiZSBpbnNpZGUgYW5vdGhlciAkIG9wZXJhdG9yJyk7XG4gICAgfVxuXG4gICAgbWF0Y2hlci5faGFzR2VvUXVlcnkgPSB0cnVlO1xuXG4gICAgLy8gVGhlcmUgYXJlIHR3byBraW5kcyBvZiBnZW9kYXRhIGluIE1vbmdvREI6IGxlZ2FjeSBjb29yZGluYXRlIHBhaXJzIGFuZFxuICAgIC8vIEdlb0pTT04uIFRoZXkgdXNlIGRpZmZlcmVudCBkaXN0YW5jZSBtZXRyaWNzLCB0b28uIEdlb0pTT04gcXVlcmllcyBhcmVcbiAgICAvLyBtYXJrZWQgd2l0aCBhICRnZW9tZXRyeSBwcm9wZXJ0eSwgdGhvdWdoIGxlZ2FjeSBjb29yZGluYXRlcyBjYW4gYmVcbiAgICAvLyBtYXRjaGVkIHVzaW5nICRnZW9tZXRyeS5cbiAgICBsZXQgbWF4RGlzdGFuY2UsIHBvaW50LCBkaXN0YW5jZTtcbiAgICBpZiAoTG9jYWxDb2xsZWN0aW9uLl9pc1BsYWluT2JqZWN0KG9wZXJhbmQpICYmIGhhc093bi5jYWxsKG9wZXJhbmQsICckZ2VvbWV0cnknKSkge1xuICAgICAgLy8gR2VvSlNPTiBcIjJkc3BoZXJlXCIgbW9kZS5cbiAgICAgIG1heERpc3RhbmNlID0gb3BlcmFuZC4kbWF4RGlzdGFuY2U7XG4gICAgICBwb2ludCA9IG9wZXJhbmQuJGdlb21ldHJ5O1xuICAgICAgZGlzdGFuY2UgPSB2YWx1ZSA9PiB7XG4gICAgICAgIC8vIFhYWDogZm9yIG5vdywgd2UgZG9uJ3QgY2FsY3VsYXRlIHRoZSBhY3R1YWwgZGlzdGFuY2UgYmV0d2Vlbiwgc2F5LFxuICAgICAgICAvLyBwb2x5Z29uIGFuZCBjaXJjbGUuIElmIHBlb3BsZSBjYXJlIGFib3V0IHRoaXMgdXNlLWNhc2UgaXQgd2lsbCBnZXRcbiAgICAgICAgLy8gYSBwcmlvcml0eS5cbiAgICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF2YWx1ZS50eXBlKSB7XG4gICAgICAgICAgcmV0dXJuIEdlb0pTT04ucG9pbnREaXN0YW5jZShcbiAgICAgICAgICAgIHBvaW50LFxuICAgICAgICAgICAge3R5cGU6ICdQb2ludCcsIGNvb3JkaW5hdGVzOiBwb2ludFRvQXJyYXkodmFsdWUpfVxuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodmFsdWUudHlwZSA9PT0gJ1BvaW50Jykge1xuICAgICAgICAgIHJldHVybiBHZW9KU09OLnBvaW50RGlzdGFuY2UocG9pbnQsIHZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBHZW9KU09OLmdlb21ldHJ5V2l0aGluUmFkaXVzKHZhbHVlLCBwb2ludCwgbWF4RGlzdGFuY2UpXG4gICAgICAgICAgPyAwXG4gICAgICAgICAgOiBtYXhEaXN0YW5jZSArIDE7XG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBtYXhEaXN0YW5jZSA9IHZhbHVlU2VsZWN0b3IuJG1heERpc3RhbmNlO1xuXG4gICAgICBpZiAoIWlzSW5kZXhhYmxlKG9wZXJhbmQpKSB7XG4gICAgICAgIHRocm93IEVycm9yKCckbmVhciBhcmd1bWVudCBtdXN0IGJlIGNvb3JkaW5hdGUgcGFpciBvciBHZW9KU09OJyk7XG4gICAgICB9XG5cbiAgICAgIHBvaW50ID0gcG9pbnRUb0FycmF5KG9wZXJhbmQpO1xuXG4gICAgICBkaXN0YW5jZSA9IHZhbHVlID0+IHtcbiAgICAgICAgaWYgKCFpc0luZGV4YWJsZSh2YWx1ZSkpIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkaXN0YW5jZUNvb3JkaW5hdGVQYWlycyhwb2ludCwgdmFsdWUpO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gYnJhbmNoZWRWYWx1ZXMgPT4ge1xuICAgICAgLy8gVGhlcmUgbWlnaHQgYmUgbXVsdGlwbGUgcG9pbnRzIGluIHRoZSBkb2N1bWVudCB0aGF0IG1hdGNoIHRoZSBnaXZlblxuICAgICAgLy8gZmllbGQuIE9ubHkgb25lIG9mIHRoZW0gbmVlZHMgdG8gYmUgd2l0aGluICRtYXhEaXN0YW5jZSwgYnV0IHdlIG5lZWQgdG9cbiAgICAgIC8vIGV2YWx1YXRlIGFsbCBvZiB0aGVtIGFuZCB1c2UgdGhlIG5lYXJlc3Qgb25lIGZvciB0aGUgaW1wbGljaXQgc29ydFxuICAgICAgLy8gc3BlY2lmaWVyLiAoVGhhdCdzIHdoeSB3ZSBjYW4ndCBqdXN0IHVzZSBFTEVNRU5UX09QRVJBVE9SUyBoZXJlLilcbiAgICAgIC8vXG4gICAgICAvLyBOb3RlOiBUaGlzIGRpZmZlcnMgZnJvbSBNb25nb0RCJ3MgaW1wbGVtZW50YXRpb24sIHdoZXJlIGEgZG9jdW1lbnQgd2lsbFxuICAgICAgLy8gYWN0dWFsbHkgc2hvdyB1cCAqbXVsdGlwbGUgdGltZXMqIGluIHRoZSByZXN1bHQgc2V0LCB3aXRoIG9uZSBlbnRyeSBmb3JcbiAgICAgIC8vIGVhY2ggd2l0aGluLSRtYXhEaXN0YW5jZSBicmFuY2hpbmcgcG9pbnQuXG4gICAgICBjb25zdCByZXN1bHQgPSB7cmVzdWx0OiBmYWxzZX07XG4gICAgICBleHBhbmRBcnJheXNJbkJyYW5jaGVzKGJyYW5jaGVkVmFsdWVzKS5ldmVyeShicmFuY2ggPT4ge1xuICAgICAgICAvLyBpZiBvcGVyYXRpb24gaXMgYW4gdXBkYXRlLCBkb24ndCBza2lwIGJyYW5jaGVzLCBqdXN0IHJldHVybiB0aGUgZmlyc3RcbiAgICAgICAgLy8gb25lICgjMzU5OSlcbiAgICAgICAgbGV0IGN1ckRpc3RhbmNlO1xuICAgICAgICBpZiAoIW1hdGNoZXIuX2lzVXBkYXRlKSB7XG4gICAgICAgICAgaWYgKCEodHlwZW9mIGJyYW5jaC52YWx1ZSA9PT0gJ29iamVjdCcpKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjdXJEaXN0YW5jZSA9IGRpc3RhbmNlKGJyYW5jaC52YWx1ZSk7XG5cbiAgICAgICAgICAvLyBTa2lwIGJyYW5jaGVzIHRoYXQgYXJlbid0IHJlYWwgcG9pbnRzIG9yIGFyZSB0b28gZmFyIGF3YXkuXG4gICAgICAgICAgaWYgKGN1ckRpc3RhbmNlID09PSBudWxsIHx8IGN1ckRpc3RhbmNlID4gbWF4RGlzdGFuY2UpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIFNraXAgYW55dGhpbmcgdGhhdCdzIGEgdGllLlxuICAgICAgICAgIGlmIChyZXN1bHQuZGlzdGFuY2UgIT09IHVuZGVmaW5lZCAmJiByZXN1bHQuZGlzdGFuY2UgPD0gY3VyRGlzdGFuY2UpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJlc3VsdC5yZXN1bHQgPSB0cnVlO1xuICAgICAgICByZXN1bHQuZGlzdGFuY2UgPSBjdXJEaXN0YW5jZTtcblxuICAgICAgICBpZiAoYnJhbmNoLmFycmF5SW5kaWNlcykge1xuICAgICAgICAgIHJlc3VsdC5hcnJheUluZGljZXMgPSBicmFuY2guYXJyYXlJbmRpY2VzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRlbGV0ZSByZXN1bHQuYXJyYXlJbmRpY2VzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICFtYXRjaGVyLl9pc1VwZGF0ZTtcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gIH0sXG59O1xuXG4vLyBOQjogV2UgYXJlIGNoZWF0aW5nIGFuZCB1c2luZyB0aGlzIGZ1bmN0aW9uIHRvIGltcGxlbWVudCAnQU5EJyBmb3IgYm90aFxuLy8gJ2RvY3VtZW50IG1hdGNoZXJzJyBhbmQgJ2JyYW5jaGVkIG1hdGNoZXJzJy4gVGhleSBib3RoIHJldHVybiByZXN1bHQgb2JqZWN0c1xuLy8gYnV0IHRoZSBhcmd1bWVudCBpcyBkaWZmZXJlbnQ6IGZvciB0aGUgZm9ybWVyIGl0J3MgYSB3aG9sZSBkb2MsIHdoZXJlYXMgZm9yXG4vLyB0aGUgbGF0dGVyIGl0J3MgYW4gYXJyYXkgb2YgJ2JyYW5jaGVkIHZhbHVlcycuXG5mdW5jdGlvbiBhbmRTb21lTWF0Y2hlcnMoc3ViTWF0Y2hlcnMpIHtcbiAgaWYgKHN1Yk1hdGNoZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBldmVyeXRoaW5nTWF0Y2hlcjtcbiAgfVxuXG4gIGlmIChzdWJNYXRjaGVycy5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4gc3ViTWF0Y2hlcnNbMF07XG4gIH1cblxuICByZXR1cm4gZG9jT3JCcmFuY2hlcyA9PiB7XG4gICAgY29uc3QgbWF0Y2ggPSB7fTtcbiAgICBtYXRjaC5yZXN1bHQgPSBzdWJNYXRjaGVycy5ldmVyeShmbiA9PiB7XG4gICAgICBjb25zdCBzdWJSZXN1bHQgPSBmbihkb2NPckJyYW5jaGVzKTtcblxuICAgICAgLy8gQ29weSBhICdkaXN0YW5jZScgbnVtYmVyIG91dCBvZiB0aGUgZmlyc3Qgc3ViLW1hdGNoZXIgdGhhdCBoYXNcbiAgICAgIC8vIG9uZS4gWWVzLCB0aGlzIG1lYW5zIHRoYXQgaWYgdGhlcmUgYXJlIG11bHRpcGxlICRuZWFyIGZpZWxkcyBpbiBhXG4gICAgICAvLyBxdWVyeSwgc29tZXRoaW5nIGFyYml0cmFyeSBoYXBwZW5zOyB0aGlzIGFwcGVhcnMgdG8gYmUgY29uc2lzdGVudCB3aXRoXG4gICAgICAvLyBNb25nby5cbiAgICAgIGlmIChzdWJSZXN1bHQucmVzdWx0ICYmXG4gICAgICAgICAgc3ViUmVzdWx0LmRpc3RhbmNlICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgICBtYXRjaC5kaXN0YW5jZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIG1hdGNoLmRpc3RhbmNlID0gc3ViUmVzdWx0LmRpc3RhbmNlO1xuICAgICAgfVxuXG4gICAgICAvLyBTaW1pbGFybHksIHByb3BhZ2F0ZSBhcnJheUluZGljZXMgZnJvbSBzdWItbWF0Y2hlcnMuLi4gYnV0IHRvIG1hdGNoXG4gICAgICAvLyBNb25nb0RCIGJlaGF2aW9yLCB0aGlzIHRpbWUgdGhlICpsYXN0KiBzdWItbWF0Y2hlciB3aXRoIGFycmF5SW5kaWNlc1xuICAgICAgLy8gd2lucy5cbiAgICAgIGlmIChzdWJSZXN1bHQucmVzdWx0ICYmIHN1YlJlc3VsdC5hcnJheUluZGljZXMpIHtcbiAgICAgICAgbWF0Y2guYXJyYXlJbmRpY2VzID0gc3ViUmVzdWx0LmFycmF5SW5kaWNlcztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHN1YlJlc3VsdC5yZXN1bHQ7XG4gICAgfSk7XG5cbiAgICAvLyBJZiB3ZSBkaWRuJ3QgYWN0dWFsbHkgbWF0Y2gsIGZvcmdldCBhbnkgZXh0cmEgbWV0YWRhdGEgd2UgY2FtZSB1cCB3aXRoLlxuICAgIGlmICghbWF0Y2gucmVzdWx0KSB7XG4gICAgICBkZWxldGUgbWF0Y2guZGlzdGFuY2U7XG4gICAgICBkZWxldGUgbWF0Y2guYXJyYXlJbmRpY2VzO1xuICAgIH1cblxuICAgIHJldHVybiBtYXRjaDtcbiAgfTtcbn1cblxuY29uc3QgYW5kRG9jdW1lbnRNYXRjaGVycyA9IGFuZFNvbWVNYXRjaGVycztcbmNvbnN0IGFuZEJyYW5jaGVkTWF0Y2hlcnMgPSBhbmRTb21lTWF0Y2hlcnM7XG5cbmZ1bmN0aW9uIGNvbXBpbGVBcnJheU9mRG9jdW1lbnRTZWxlY3RvcnMoc2VsZWN0b3JzLCBtYXRjaGVyLCBpbkVsZW1NYXRjaCkge1xuICBpZiAoIUFycmF5LmlzQXJyYXkoc2VsZWN0b3JzKSB8fCBzZWxlY3RvcnMubGVuZ3RoID09PSAwKSB7XG4gICAgdGhyb3cgRXJyb3IoJyRhbmQvJG9yLyRub3IgbXVzdCBiZSBub25lbXB0eSBhcnJheScpO1xuICB9XG5cbiAgcmV0dXJuIHNlbGVjdG9ycy5tYXAoc3ViU2VsZWN0b3IgPT4ge1xuICAgIGlmICghTG9jYWxDb2xsZWN0aW9uLl9pc1BsYWluT2JqZWN0KHN1YlNlbGVjdG9yKSkge1xuICAgICAgdGhyb3cgRXJyb3IoJyRvci8kYW5kLyRub3IgZW50cmllcyBuZWVkIHRvIGJlIGZ1bGwgb2JqZWN0cycpO1xuICAgIH1cblxuICAgIHJldHVybiBjb21waWxlRG9jdW1lbnRTZWxlY3RvcihzdWJTZWxlY3RvciwgbWF0Y2hlciwge2luRWxlbU1hdGNofSk7XG4gIH0pO1xufVxuXG4vLyBUYWtlcyBpbiBhIHNlbGVjdG9yIHRoYXQgY291bGQgbWF0Y2ggYSBmdWxsIGRvY3VtZW50IChlZywgdGhlIG9yaWdpbmFsXG4vLyBzZWxlY3RvcikuIFJldHVybnMgYSBmdW5jdGlvbiBtYXBwaW5nIGRvY3VtZW50LT5yZXN1bHQgb2JqZWN0LlxuLy9cbi8vIG1hdGNoZXIgaXMgdGhlIE1hdGNoZXIgb2JqZWN0IHdlIGFyZSBjb21waWxpbmcuXG4vL1xuLy8gSWYgdGhpcyBpcyB0aGUgcm9vdCBkb2N1bWVudCBzZWxlY3RvciAoaWUsIG5vdCB3cmFwcGVkIGluICRhbmQgb3IgdGhlIGxpa2UpLFxuLy8gdGhlbiBpc1Jvb3QgaXMgdHJ1ZS4gKFRoaXMgaXMgdXNlZCBieSAkbmVhci4pXG5leHBvcnQgZnVuY3Rpb24gY29tcGlsZURvY3VtZW50U2VsZWN0b3IoZG9jU2VsZWN0b3IsIG1hdGNoZXIsIG9wdGlvbnMgPSB7fSkge1xuICBjb25zdCBkb2NNYXRjaGVycyA9IE9iamVjdC5rZXlzKGRvY1NlbGVjdG9yKS5tYXAoa2V5ID0+IHtcbiAgICBjb25zdCBzdWJTZWxlY3RvciA9IGRvY1NlbGVjdG9yW2tleV07XG5cbiAgICBpZiAoa2V5LnN1YnN0cigwLCAxKSA9PT0gJyQnKSB7XG4gICAgICAvLyBPdXRlciBvcGVyYXRvcnMgYXJlIGVpdGhlciBsb2dpY2FsIG9wZXJhdG9ycyAodGhleSByZWN1cnNlIGJhY2sgaW50b1xuICAgICAgLy8gdGhpcyBmdW5jdGlvbiksIG9yICR3aGVyZS5cbiAgICAgIGlmICghaGFzT3duLmNhbGwoTE9HSUNBTF9PUEVSQVRPUlMsIGtleSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnJlY29nbml6ZWQgbG9naWNhbCBvcGVyYXRvcjogJHtrZXl9YCk7XG4gICAgICB9XG5cbiAgICAgIG1hdGNoZXIuX2lzU2ltcGxlID0gZmFsc2U7XG4gICAgICByZXR1cm4gTE9HSUNBTF9PUEVSQVRPUlNba2V5XShzdWJTZWxlY3RvciwgbWF0Y2hlciwgb3B0aW9ucy5pbkVsZW1NYXRjaCk7XG4gICAgfVxuXG4gICAgLy8gUmVjb3JkIHRoaXMgcGF0aCwgYnV0IG9ubHkgaWYgd2UgYXJlbid0IGluIGFuIGVsZW1NYXRjaGVyLCBzaW5jZSBpbiBhblxuICAgIC8vIGVsZW1NYXRjaCB0aGlzIGlzIGEgcGF0aCBpbnNpZGUgYW4gb2JqZWN0IGluIGFuIGFycmF5LCBub3QgaW4gdGhlIGRvY1xuICAgIC8vIHJvb3QuXG4gICAgaWYgKCFvcHRpb25zLmluRWxlbU1hdGNoKSB7XG4gICAgICBtYXRjaGVyLl9yZWNvcmRQYXRoVXNlZChrZXkpO1xuICAgIH1cblxuICAgIC8vIERvbid0IGFkZCBhIG1hdGNoZXIgaWYgc3ViU2VsZWN0b3IgaXMgYSBmdW5jdGlvbiAtLSB0aGlzIGlzIHRvIG1hdGNoXG4gICAgLy8gdGhlIGJlaGF2aW9yIG9mIE1ldGVvciBvbiB0aGUgc2VydmVyIChpbmhlcml0ZWQgZnJvbSB0aGUgbm9kZSBtb25nb2RiXG4gICAgLy8gZHJpdmVyKSwgd2hpY2ggaXMgdG8gaWdub3JlIGFueSBwYXJ0IG9mIGEgc2VsZWN0b3Igd2hpY2ggaXMgYSBmdW5jdGlvbi5cbiAgICBpZiAodHlwZW9mIHN1YlNlbGVjdG9yID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGNvbnN0IGxvb2tVcEJ5SW5kZXggPSBtYWtlTG9va3VwRnVuY3Rpb24oa2V5KTtcbiAgICBjb25zdCB2YWx1ZU1hdGNoZXIgPSBjb21waWxlVmFsdWVTZWxlY3RvcihcbiAgICAgIHN1YlNlbGVjdG9yLFxuICAgICAgbWF0Y2hlcixcbiAgICAgIG9wdGlvbnMuaXNSb290XG4gICAgKTtcblxuICAgIHJldHVybiBkb2MgPT4gdmFsdWVNYXRjaGVyKGxvb2tVcEJ5SW5kZXgoZG9jKSk7XG4gIH0pLmZpbHRlcihCb29sZWFuKTtcblxuICByZXR1cm4gYW5kRG9jdW1lbnRNYXRjaGVycyhkb2NNYXRjaGVycyk7XG59XG5cbi8vIFRha2VzIGluIGEgc2VsZWN0b3IgdGhhdCBjb3VsZCBtYXRjaCBhIGtleS1pbmRleGVkIHZhbHVlIGluIGEgZG9jdW1lbnQ7IGVnLFxuLy8geyRndDogNSwgJGx0OiA5fSwgb3IgYSByZWd1bGFyIGV4cHJlc3Npb24sIG9yIGFueSBub24tZXhwcmVzc2lvbiBvYmplY3QgKHRvXG4vLyBpbmRpY2F0ZSBlcXVhbGl0eSkuICBSZXR1cm5zIGEgYnJhbmNoZWQgbWF0Y2hlcjogYSBmdW5jdGlvbiBtYXBwaW5nXG4vLyBbYnJhbmNoZWQgdmFsdWVdLT5yZXN1bHQgb2JqZWN0LlxuZnVuY3Rpb24gY29tcGlsZVZhbHVlU2VsZWN0b3IodmFsdWVTZWxlY3RvciwgbWF0Y2hlciwgaXNSb290KSB7XG4gIGlmICh2YWx1ZVNlbGVjdG9yIGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgbWF0Y2hlci5faXNTaW1wbGUgPSBmYWxzZTtcbiAgICByZXR1cm4gY29udmVydEVsZW1lbnRNYXRjaGVyVG9CcmFuY2hlZE1hdGNoZXIoXG4gICAgICByZWdleHBFbGVtZW50TWF0Y2hlcih2YWx1ZVNlbGVjdG9yKVxuICAgICk7XG4gIH1cblxuICBpZiAoaXNPcGVyYXRvck9iamVjdCh2YWx1ZVNlbGVjdG9yKSkge1xuICAgIHJldHVybiBvcGVyYXRvckJyYW5jaGVkTWF0Y2hlcih2YWx1ZVNlbGVjdG9yLCBtYXRjaGVyLCBpc1Jvb3QpO1xuICB9XG5cbiAgcmV0dXJuIGNvbnZlcnRFbGVtZW50TWF0Y2hlclRvQnJhbmNoZWRNYXRjaGVyKFxuICAgIGVxdWFsaXR5RWxlbWVudE1hdGNoZXIodmFsdWVTZWxlY3RvcilcbiAgKTtcbn1cblxuLy8gR2l2ZW4gYW4gZWxlbWVudCBtYXRjaGVyICh3aGljaCBldmFsdWF0ZXMgYSBzaW5nbGUgdmFsdWUpLCByZXR1cm5zIGEgYnJhbmNoZWRcbi8vIHZhbHVlICh3aGljaCBldmFsdWF0ZXMgdGhlIGVsZW1lbnQgbWF0Y2hlciBvbiBhbGwgdGhlIGJyYW5jaGVzIGFuZCByZXR1cm5zIGFcbi8vIG1vcmUgc3RydWN0dXJlZCByZXR1cm4gdmFsdWUgcG9zc2libHkgaW5jbHVkaW5nIGFycmF5SW5kaWNlcykuXG5mdW5jdGlvbiBjb252ZXJ0RWxlbWVudE1hdGNoZXJUb0JyYW5jaGVkTWF0Y2hlcihlbGVtZW50TWF0Y2hlciwgb3B0aW9ucyA9IHt9KSB7XG4gIHJldHVybiBicmFuY2hlcyA9PiB7XG4gICAgY29uc3QgZXhwYW5kZWQgPSBvcHRpb25zLmRvbnRFeHBhbmRMZWFmQXJyYXlzXG4gICAgICA/IGJyYW5jaGVzXG4gICAgICA6IGV4cGFuZEFycmF5c0luQnJhbmNoZXMoYnJhbmNoZXMsIG9wdGlvbnMuZG9udEluY2x1ZGVMZWFmQXJyYXlzKTtcblxuICAgIGNvbnN0IG1hdGNoID0ge307XG4gICAgbWF0Y2gucmVzdWx0ID0gZXhwYW5kZWQuc29tZShlbGVtZW50ID0+IHtcbiAgICAgIGxldCBtYXRjaGVkID0gZWxlbWVudE1hdGNoZXIoZWxlbWVudC52YWx1ZSk7XG5cbiAgICAgIC8vIFNwZWNpYWwgY2FzZSBmb3IgJGVsZW1NYXRjaDogaXQgbWVhbnMgXCJ0cnVlLCBhbmQgdXNlIHRoaXMgYXMgYW4gYXJyYXlcbiAgICAgIC8vIGluZGV4IGlmIEkgZGlkbid0IGFscmVhZHkgaGF2ZSBvbmVcIi5cbiAgICAgIGlmICh0eXBlb2YgbWF0Y2hlZCA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgLy8gWFhYIFRoaXMgY29kZSBkYXRlcyBmcm9tIHdoZW4gd2Ugb25seSBzdG9yZWQgYSBzaW5nbGUgYXJyYXkgaW5kZXhcbiAgICAgICAgLy8gKGZvciB0aGUgb3V0ZXJtb3N0IGFycmF5KS4gU2hvdWxkIHdlIGJlIGFsc28gaW5jbHVkaW5nIGRlZXBlciBhcnJheVxuICAgICAgICAvLyBpbmRpY2VzIGZyb20gdGhlICRlbGVtTWF0Y2ggbWF0Y2g/XG4gICAgICAgIGlmICghZWxlbWVudC5hcnJheUluZGljZXMpIHtcbiAgICAgICAgICBlbGVtZW50LmFycmF5SW5kaWNlcyA9IFttYXRjaGVkXTtcbiAgICAgICAgfVxuXG4gICAgICAgIG1hdGNoZWQgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBJZiBzb21lIGVsZW1lbnQgbWF0Y2hlZCwgYW5kIGl0J3MgdGFnZ2VkIHdpdGggYXJyYXkgaW5kaWNlcywgaW5jbHVkZVxuICAgICAgLy8gdGhvc2UgaW5kaWNlcyBpbiBvdXIgcmVzdWx0IG9iamVjdC5cbiAgICAgIGlmIChtYXRjaGVkICYmIGVsZW1lbnQuYXJyYXlJbmRpY2VzKSB7XG4gICAgICAgIG1hdGNoLmFycmF5SW5kaWNlcyA9IGVsZW1lbnQuYXJyYXlJbmRpY2VzO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbWF0Y2hlZDtcbiAgICB9KTtcblxuICAgIHJldHVybiBtYXRjaDtcbiAgfTtcbn1cblxuLy8gSGVscGVycyBmb3IgJG5lYXIuXG5mdW5jdGlvbiBkaXN0YW5jZUNvb3JkaW5hdGVQYWlycyhhLCBiKSB7XG4gIGNvbnN0IHBvaW50QSA9IHBvaW50VG9BcnJheShhKTtcbiAgY29uc3QgcG9pbnRCID0gcG9pbnRUb0FycmF5KGIpO1xuXG4gIHJldHVybiBNYXRoLmh5cG90KHBvaW50QVswXSAtIHBvaW50QlswXSwgcG9pbnRBWzFdIC0gcG9pbnRCWzFdKTtcbn1cblxuLy8gVGFrZXMgc29tZXRoaW5nIHRoYXQgaXMgbm90IGFuIG9wZXJhdG9yIG9iamVjdCBhbmQgcmV0dXJucyBhbiBlbGVtZW50IG1hdGNoZXJcbi8vIGZvciBlcXVhbGl0eSB3aXRoIHRoYXQgdGhpbmcuXG5leHBvcnQgZnVuY3Rpb24gZXF1YWxpdHlFbGVtZW50TWF0Y2hlcihlbGVtZW50U2VsZWN0b3IpIHtcbiAgaWYgKGlzT3BlcmF0b3JPYmplY3QoZWxlbWVudFNlbGVjdG9yKSkge1xuICAgIHRocm93IEVycm9yKCdDYW5cXCd0IGNyZWF0ZSBlcXVhbGl0eVZhbHVlU2VsZWN0b3IgZm9yIG9wZXJhdG9yIG9iamVjdCcpO1xuICB9XG5cbiAgLy8gU3BlY2lhbC1jYXNlOiBudWxsIGFuZCB1bmRlZmluZWQgYXJlIGVxdWFsIChpZiB5b3UgZ290IHVuZGVmaW5lZCBpbiB0aGVyZVxuICAvLyBzb21ld2hlcmUsIG9yIGlmIHlvdSBnb3QgaXQgZHVlIHRvIHNvbWUgYnJhbmNoIGJlaW5nIG5vbi1leGlzdGVudCBpbiB0aGVcbiAgLy8gd2VpcmQgc3BlY2lhbCBjYXNlKSwgZXZlbiB0aG91Z2ggdGhleSBhcmVuJ3Qgd2l0aCBFSlNPTi5lcXVhbHMuXG4gIC8vIHVuZGVmaW5lZCBvciBudWxsXG4gIGlmIChlbGVtZW50U2VsZWN0b3IgPT0gbnVsbCkge1xuICAgIHJldHVybiB2YWx1ZSA9PiB2YWx1ZSA9PSBudWxsO1xuICB9XG5cbiAgcmV0dXJuIHZhbHVlID0+IExvY2FsQ29sbGVjdGlvbi5fZi5fZXF1YWwoZWxlbWVudFNlbGVjdG9yLCB2YWx1ZSk7XG59XG5cbmZ1bmN0aW9uIGV2ZXJ5dGhpbmdNYXRjaGVyKGRvY09yQnJhbmNoZWRWYWx1ZXMpIHtcbiAgcmV0dXJuIHtyZXN1bHQ6IHRydWV9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZXhwYW5kQXJyYXlzSW5CcmFuY2hlcyhicmFuY2hlcywgc2tpcFRoZUFycmF5cykge1xuICBjb25zdCBicmFuY2hlc091dCA9IFtdO1xuXG4gIGJyYW5jaGVzLmZvckVhY2goYnJhbmNoID0+IHtcbiAgICBjb25zdCB0aGlzSXNBcnJheSA9IEFycmF5LmlzQXJyYXkoYnJhbmNoLnZhbHVlKTtcblxuICAgIC8vIFdlIGluY2x1ZGUgdGhlIGJyYW5jaCBpdHNlbGYsICpVTkxFU1MqIHdlIGl0J3MgYW4gYXJyYXkgdGhhdCB3ZSdyZSBnb2luZ1xuICAgIC8vIHRvIGl0ZXJhdGUgYW5kIHdlJ3JlIHRvbGQgdG8gc2tpcCBhcnJheXMuICAoVGhhdCdzIHJpZ2h0LCB3ZSBpbmNsdWRlIHNvbWVcbiAgICAvLyBhcnJheXMgZXZlbiBza2lwVGhlQXJyYXlzIGlzIHRydWU6IHRoZXNlIGFyZSBhcnJheXMgdGhhdCB3ZXJlIGZvdW5kIHZpYVxuICAgIC8vIGV4cGxpY2l0IG51bWVyaWNhbCBpbmRpY2VzLilcbiAgICBpZiAoIShza2lwVGhlQXJyYXlzICYmIHRoaXNJc0FycmF5ICYmICFicmFuY2guZG9udEl0ZXJhdGUpKSB7XG4gICAgICBicmFuY2hlc091dC5wdXNoKHthcnJheUluZGljZXM6IGJyYW5jaC5hcnJheUluZGljZXMsIHZhbHVlOiBicmFuY2gudmFsdWV9KTtcbiAgICB9XG5cbiAgICBpZiAodGhpc0lzQXJyYXkgJiYgIWJyYW5jaC5kb250SXRlcmF0ZSkge1xuICAgICAgYnJhbmNoLnZhbHVlLmZvckVhY2goKHZhbHVlLCBpKSA9PiB7XG4gICAgICAgIGJyYW5jaGVzT3V0LnB1c2goe1xuICAgICAgICAgIGFycmF5SW5kaWNlczogKGJyYW5jaC5hcnJheUluZGljZXMgfHwgW10pLmNvbmNhdChpKSxcbiAgICAgICAgICB2YWx1ZVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGJyYW5jaGVzT3V0O1xufVxuXG4vLyBIZWxwZXJzIGZvciAkYml0c0FsbFNldC8kYml0c0FueVNldC8kYml0c0FsbENsZWFyLyRiaXRzQW55Q2xlYXIuXG5mdW5jdGlvbiBnZXRPcGVyYW5kQml0bWFzayhvcGVyYW5kLCBzZWxlY3Rvcikge1xuICAvLyBudW1lcmljIGJpdG1hc2tcbiAgLy8gWW91IGNhbiBwcm92aWRlIGEgbnVtZXJpYyBiaXRtYXNrIHRvIGJlIG1hdGNoZWQgYWdhaW5zdCB0aGUgb3BlcmFuZCBmaWVsZC5cbiAgLy8gSXQgbXVzdCBiZSByZXByZXNlbnRhYmxlIGFzIGEgbm9uLW5lZ2F0aXZlIDMyLWJpdCBzaWduZWQgaW50ZWdlci5cbiAgLy8gT3RoZXJ3aXNlLCAkYml0c0FsbFNldCB3aWxsIHJldHVybiBhbiBlcnJvci5cbiAgaWYgKE51bWJlci5pc0ludGVnZXIob3BlcmFuZCkgJiYgb3BlcmFuZCA+PSAwKSB7XG4gICAgcmV0dXJuIG5ldyBVaW50OEFycmF5KG5ldyBJbnQzMkFycmF5KFtvcGVyYW5kXSkuYnVmZmVyKTtcbiAgfVxuXG4gIC8vIGJpbmRhdGEgYml0bWFza1xuICAvLyBZb3UgY2FuIGFsc28gdXNlIGFuIGFyYml0cmFyaWx5IGxhcmdlIEJpbkRhdGEgaW5zdGFuY2UgYXMgYSBiaXRtYXNrLlxuICBpZiAoRUpTT04uaXNCaW5hcnkob3BlcmFuZCkpIHtcbiAgICByZXR1cm4gbmV3IFVpbnQ4QXJyYXkob3BlcmFuZC5idWZmZXIpO1xuICB9XG5cbiAgLy8gcG9zaXRpb24gbGlzdFxuICAvLyBJZiBxdWVyeWluZyBhIGxpc3Qgb2YgYml0IHBvc2l0aW9ucywgZWFjaCA8cG9zaXRpb24+IG11c3QgYmUgYSBub24tbmVnYXRpdmVcbiAgLy8gaW50ZWdlci4gQml0IHBvc2l0aW9ucyBzdGFydCBhdCAwIGZyb20gdGhlIGxlYXN0IHNpZ25pZmljYW50IGJpdC5cbiAgaWYgKEFycmF5LmlzQXJyYXkob3BlcmFuZCkgJiZcbiAgICAgIG9wZXJhbmQuZXZlcnkoeCA9PiBOdW1iZXIuaXNJbnRlZ2VyKHgpICYmIHggPj0gMCkpIHtcbiAgICBjb25zdCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoKE1hdGgubWF4KC4uLm9wZXJhbmQpID4+IDMpICsgMSk7XG4gICAgY29uc3QgdmlldyA9IG5ldyBVaW50OEFycmF5KGJ1ZmZlcik7XG5cbiAgICBvcGVyYW5kLmZvckVhY2goeCA9PiB7XG4gICAgICB2aWV3W3ggPj4gM10gfD0gMSA8PCAoeCAmIDB4Nyk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdmlldztcbiAgfVxuXG4gIC8vIGJhZCBvcGVyYW5kXG4gIHRocm93IEVycm9yKFxuICAgIGBvcGVyYW5kIHRvICR7c2VsZWN0b3J9IG11c3QgYmUgYSBudW1lcmljIGJpdG1hc2sgKHJlcHJlc2VudGFibGUgYXMgYSBgICtcbiAgICAnbm9uLW5lZ2F0aXZlIDMyLWJpdCBzaWduZWQgaW50ZWdlciksIGEgYmluZGF0YSBiaXRtYXNrIG9yIGFuIGFycmF5IHdpdGggJyArXG4gICAgJ2JpdCBwb3NpdGlvbnMgKG5vbi1uZWdhdGl2ZSBpbnRlZ2VycyknXG4gICk7XG59XG5cbmZ1bmN0aW9uIGdldFZhbHVlQml0bWFzayh2YWx1ZSwgbGVuZ3RoKSB7XG4gIC8vIFRoZSBmaWVsZCB2YWx1ZSBtdXN0IGJlIGVpdGhlciBudW1lcmljYWwgb3IgYSBCaW5EYXRhIGluc3RhbmNlLiBPdGhlcndpc2UsXG4gIC8vICRiaXRzLi4uIHdpbGwgbm90IG1hdGNoIHRoZSBjdXJyZW50IGRvY3VtZW50LlxuXG4gIC8vIG51bWVyaWNhbFxuICBpZiAoTnVtYmVyLmlzU2FmZUludGVnZXIodmFsdWUpKSB7XG4gICAgLy8gJGJpdHMuLi4gd2lsbCBub3QgbWF0Y2ggbnVtZXJpY2FsIHZhbHVlcyB0aGF0IGNhbm5vdCBiZSByZXByZXNlbnRlZCBhcyBhXG4gICAgLy8gc2lnbmVkIDY0LWJpdCBpbnRlZ2VyLiBUaGlzIGNhbiBiZSB0aGUgY2FzZSBpZiBhIHZhbHVlIGlzIGVpdGhlciB0b29cbiAgICAvLyBsYXJnZSBvciBzbWFsbCB0byBmaXQgaW4gYSBzaWduZWQgNjQtYml0IGludGVnZXIsIG9yIGlmIGl0IGhhcyBhXG4gICAgLy8gZnJhY3Rpb25hbCBjb21wb25lbnQuXG4gICAgY29uc3QgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKFxuICAgICAgTWF0aC5tYXgobGVuZ3RoLCAyICogVWludDMyQXJyYXkuQllURVNfUEVSX0VMRU1FTlQpXG4gICAgKTtcblxuICAgIGxldCB2aWV3ID0gbmV3IFVpbnQzMkFycmF5KGJ1ZmZlciwgMCwgMik7XG4gICAgdmlld1swXSA9IHZhbHVlICUgKCgxIDw8IDE2KSAqICgxIDw8IDE2KSkgfCAwO1xuICAgIHZpZXdbMV0gPSB2YWx1ZSAvICgoMSA8PCAxNikgKiAoMSA8PCAxNikpIHwgMDtcblxuICAgIC8vIHNpZ24gZXh0ZW5zaW9uXG4gICAgaWYgKHZhbHVlIDwgMCkge1xuICAgICAgdmlldyA9IG5ldyBVaW50OEFycmF5KGJ1ZmZlciwgMik7XG4gICAgICB2aWV3LmZvckVhY2goKGJ5dGUsIGkpID0+IHtcbiAgICAgICAgdmlld1tpXSA9IDB4ZmY7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFVpbnQ4QXJyYXkoYnVmZmVyKTtcbiAgfVxuXG4gIC8vIGJpbmRhdGFcbiAgaWYgKEVKU09OLmlzQmluYXJ5KHZhbHVlKSkge1xuICAgIHJldHVybiBuZXcgVWludDhBcnJheSh2YWx1ZS5idWZmZXIpO1xuICB9XG5cbiAgLy8gbm8gbWF0Y2hcbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vLyBBY3R1YWxseSBpbnNlcnRzIGEga2V5IHZhbHVlIGludG8gdGhlIHNlbGVjdG9yIGRvY3VtZW50XG4vLyBIb3dldmVyLCB0aGlzIGNoZWNrcyB0aGVyZSBpcyBubyBhbWJpZ3VpdHkgaW4gc2V0dGluZ1xuLy8gdGhlIHZhbHVlIGZvciB0aGUgZ2l2ZW4ga2V5LCB0aHJvd3Mgb3RoZXJ3aXNlXG5mdW5jdGlvbiBpbnNlcnRJbnRvRG9jdW1lbnQoZG9jdW1lbnQsIGtleSwgdmFsdWUpIHtcbiAgT2JqZWN0LmtleXMoZG9jdW1lbnQpLmZvckVhY2goZXhpc3RpbmdLZXkgPT4ge1xuICAgIGlmIChcbiAgICAgIChleGlzdGluZ0tleS5sZW5ndGggPiBrZXkubGVuZ3RoICYmIGV4aXN0aW5nS2V5LmluZGV4T2YoYCR7a2V5fS5gKSA9PT0gMCkgfHxcbiAgICAgIChrZXkubGVuZ3RoID4gZXhpc3RpbmdLZXkubGVuZ3RoICYmIGtleS5pbmRleE9mKGAke2V4aXN0aW5nS2V5fS5gKSA9PT0gMClcbiAgICApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYGNhbm5vdCBpbmZlciBxdWVyeSBmaWVsZHMgdG8gc2V0LCBib3RoIHBhdGhzICcke2V4aXN0aW5nS2V5fScgYW5kIGAgK1xuICAgICAgICBgJyR7a2V5fScgYXJlIG1hdGNoZWRgXG4gICAgICApO1xuICAgIH0gZWxzZSBpZiAoZXhpc3RpbmdLZXkgPT09IGtleSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgY2Fubm90IGluZmVyIHF1ZXJ5IGZpZWxkcyB0byBzZXQsIHBhdGggJyR7a2V5fScgaXMgbWF0Y2hlZCB0d2ljZWBcbiAgICAgICk7XG4gICAgfVxuICB9KTtcblxuICBkb2N1bWVudFtrZXldID0gdmFsdWU7XG59XG5cbi8vIFJldHVybnMgYSBicmFuY2hlZCBtYXRjaGVyIHRoYXQgbWF0Y2hlcyBpZmYgdGhlIGdpdmVuIG1hdGNoZXIgZG9lcyBub3QuXG4vLyBOb3RlIHRoYXQgdGhpcyBpbXBsaWNpdGx5IFwiZGVNb3JnYW5pemVzXCIgdGhlIHdyYXBwZWQgZnVuY3Rpb24uICBpZSwgaXRcbi8vIG1lYW5zIHRoYXQgQUxMIGJyYW5jaCB2YWx1ZXMgbmVlZCB0byBmYWlsIHRvIG1hdGNoIGlubmVyQnJhbmNoZWRNYXRjaGVyLlxuZnVuY3Rpb24gaW52ZXJ0QnJhbmNoZWRNYXRjaGVyKGJyYW5jaGVkTWF0Y2hlcikge1xuICByZXR1cm4gYnJhbmNoVmFsdWVzID0+IHtcbiAgICAvLyBXZSBleHBsaWNpdGx5IGNob29zZSB0byBzdHJpcCBhcnJheUluZGljZXMgaGVyZTogaXQgZG9lc24ndCBtYWtlIHNlbnNlIHRvXG4gICAgLy8gc2F5IFwidXBkYXRlIHRoZSBhcnJheSBlbGVtZW50IHRoYXQgZG9lcyBub3QgbWF0Y2ggc29tZXRoaW5nXCIsIGF0IGxlYXN0XG4gICAgLy8gaW4gbW9uZ28tbGFuZC5cbiAgICByZXR1cm4ge3Jlc3VsdDogIWJyYW5jaGVkTWF0Y2hlcihicmFuY2hWYWx1ZXMpLnJlc3VsdH07XG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0luZGV4YWJsZShvYmopIHtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkob2JqKSB8fCBMb2NhbENvbGxlY3Rpb24uX2lzUGxhaW5PYmplY3Qob2JqKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzTnVtZXJpY0tleShzKSB7XG4gIHJldHVybiAvXlswLTldKyQvLnRlc3Qocyk7XG59XG5cbi8vIFJldHVybnMgdHJ1ZSBpZiB0aGlzIGlzIGFuIG9iamVjdCB3aXRoIGF0IGxlYXN0IG9uZSBrZXkgYW5kIGFsbCBrZXlzIGJlZ2luXG4vLyB3aXRoICQuICBVbmxlc3MgaW5jb25zaXN0ZW50T0sgaXMgc2V0LCB0aHJvd3MgaWYgc29tZSBrZXlzIGJlZ2luIHdpdGggJCBhbmRcbi8vIG90aGVycyBkb24ndC5cbmV4cG9ydCBmdW5jdGlvbiBpc09wZXJhdG9yT2JqZWN0KHZhbHVlU2VsZWN0b3IsIGluY29uc2lzdGVudE9LKSB7XG4gIGlmICghTG9jYWxDb2xsZWN0aW9uLl9pc1BsYWluT2JqZWN0KHZhbHVlU2VsZWN0b3IpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgbGV0IHRoZXNlQXJlT3BlcmF0b3JzID0gdW5kZWZpbmVkO1xuICBPYmplY3Qua2V5cyh2YWx1ZVNlbGVjdG9yKS5mb3JFYWNoKHNlbEtleSA9PiB7XG4gICAgY29uc3QgdGhpc0lzT3BlcmF0b3IgPSBzZWxLZXkuc3Vic3RyKDAsIDEpID09PSAnJCc7XG5cbiAgICBpZiAodGhlc2VBcmVPcGVyYXRvcnMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhlc2VBcmVPcGVyYXRvcnMgPSB0aGlzSXNPcGVyYXRvcjtcbiAgICB9IGVsc2UgaWYgKHRoZXNlQXJlT3BlcmF0b3JzICE9PSB0aGlzSXNPcGVyYXRvcikge1xuICAgICAgaWYgKCFpbmNvbnNpc3RlbnRPSykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYEluY29uc2lzdGVudCBvcGVyYXRvcjogJHtKU09OLnN0cmluZ2lmeSh2YWx1ZVNlbGVjdG9yKX1gXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIHRoZXNlQXJlT3BlcmF0b3JzID0gZmFsc2U7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gISF0aGVzZUFyZU9wZXJhdG9yczsgLy8ge30gaGFzIG5vIG9wZXJhdG9yc1xufVxuXG4vLyBIZWxwZXIgZm9yICRsdC8kZ3QvJGx0ZS8kZ3RlLlxuZnVuY3Rpb24gbWFrZUluZXF1YWxpdHkoY21wVmFsdWVDb21wYXJhdG9yKSB7XG4gIHJldHVybiB7XG4gICAgY29tcGlsZUVsZW1lbnRTZWxlY3RvcihvcGVyYW5kKSB7XG4gICAgICAvLyBBcnJheXMgbmV2ZXIgY29tcGFyZSBmYWxzZSB3aXRoIG5vbi1hcnJheXMgZm9yIGFueSBpbmVxdWFsaXR5LlxuICAgICAgLy8gWFhYIFRoaXMgd2FzIGJlaGF2aW9yIHdlIG9ic2VydmVkIGluIHByZS1yZWxlYXNlIE1vbmdvREIgMi41LCBidXRcbiAgICAgIC8vICAgICBpdCBzZWVtcyB0byBoYXZlIGJlZW4gcmV2ZXJ0ZWQuXG4gICAgICAvLyAgICAgU2VlIGh0dHBzOi8vamlyYS5tb25nb2RiLm9yZy9icm93c2UvU0VSVkVSLTExNDQ0XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShvcGVyYW5kKSkge1xuICAgICAgICByZXR1cm4gKCkgPT4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIC8vIFNwZWNpYWwgY2FzZTogY29uc2lkZXIgdW5kZWZpbmVkIGFuZCBudWxsIHRoZSBzYW1lIChzbyB0cnVlIHdpdGhcbiAgICAgIC8vICRndGUvJGx0ZSkuXG4gICAgICBpZiAob3BlcmFuZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIG9wZXJhbmQgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBvcGVyYW5kVHlwZSA9IExvY2FsQ29sbGVjdGlvbi5fZi5fdHlwZShvcGVyYW5kKTtcblxuICAgICAgcmV0dXJuIHZhbHVlID0+IHtcbiAgICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB2YWx1ZSA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDb21wYXJpc29ucyBhcmUgbmV2ZXIgdHJ1ZSBhbW9uZyB0aGluZ3Mgb2YgZGlmZmVyZW50IHR5cGUgKGV4Y2VwdFxuICAgICAgICAvLyBudWxsIHZzIHVuZGVmaW5lZCkuXG4gICAgICAgIGlmIChMb2NhbENvbGxlY3Rpb24uX2YuX3R5cGUodmFsdWUpICE9PSBvcGVyYW5kVHlwZSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjbXBWYWx1ZUNvbXBhcmF0b3IoTG9jYWxDb2xsZWN0aW9uLl9mLl9jbXAodmFsdWUsIG9wZXJhbmQpKTtcbiAgICAgIH07XG4gICAgfSxcbiAgfTtcbn1cblxuLy8gbWFrZUxvb2t1cEZ1bmN0aW9uKGtleSkgcmV0dXJucyBhIGxvb2t1cCBmdW5jdGlvbi5cbi8vXG4vLyBBIGxvb2t1cCBmdW5jdGlvbiB0YWtlcyBpbiBhIGRvY3VtZW50IGFuZCByZXR1cm5zIGFuIGFycmF5IG9mIG1hdGNoaW5nXG4vLyBicmFuY2hlcy4gIElmIG5vIGFycmF5cyBhcmUgZm91bmQgd2hpbGUgbG9va2luZyB1cCB0aGUga2V5LCB0aGlzIGFycmF5IHdpbGxcbi8vIGhhdmUgZXhhY3RseSBvbmUgYnJhbmNoZXMgKHBvc3NpYmx5ICd1bmRlZmluZWQnLCBpZiBzb21lIHNlZ21lbnQgb2YgdGhlIGtleVxuLy8gd2FzIG5vdCBmb3VuZCkuXG4vL1xuLy8gSWYgYXJyYXlzIGFyZSBmb3VuZCBpbiB0aGUgbWlkZGxlLCB0aGlzIGNhbiBoYXZlIG1vcmUgdGhhbiBvbmUgZWxlbWVudCwgc2luY2Vcbi8vIHdlICdicmFuY2gnLiBXaGVuIHdlICdicmFuY2gnLCBpZiB0aGVyZSBhcmUgbW9yZSBrZXkgc2VnbWVudHMgdG8gbG9vayB1cCxcbi8vIHRoZW4gd2Ugb25seSBwdXJzdWUgYnJhbmNoZXMgdGhhdCBhcmUgcGxhaW4gb2JqZWN0cyAobm90IGFycmF5cyBvciBzY2FsYXJzKS5cbi8vIFRoaXMgbWVhbnMgd2UgY2FuIGFjdHVhbGx5IGVuZCB1cCB3aXRoIG5vIGJyYW5jaGVzIVxuLy9cbi8vIFdlIGRvICpOT1QqIGJyYW5jaCBvbiBhcnJheXMgdGhhdCBhcmUgZm91bmQgYXQgdGhlIGVuZCAoaWUsIGF0IHRoZSBsYXN0XG4vLyBkb3R0ZWQgbWVtYmVyIG9mIHRoZSBrZXkpLiBXZSBqdXN0IHJldHVybiB0aGF0IGFycmF5OyBpZiB5b3Ugd2FudCB0b1xuLy8gZWZmZWN0aXZlbHkgJ2JyYW5jaCcgb3ZlciB0aGUgYXJyYXkncyB2YWx1ZXMsIHBvc3QtcHJvY2VzcyB0aGUgbG9va3VwXG4vLyBmdW5jdGlvbiB3aXRoIGV4cGFuZEFycmF5c0luQnJhbmNoZXMuXG4vL1xuLy8gRWFjaCBicmFuY2ggaXMgYW4gb2JqZWN0IHdpdGgga2V5czpcbi8vICAtIHZhbHVlOiB0aGUgdmFsdWUgYXQgdGhlIGJyYW5jaFxuLy8gIC0gZG9udEl0ZXJhdGU6IGFuIG9wdGlvbmFsIGJvb2w7IGlmIHRydWUsIGl0IG1lYW5zIHRoYXQgJ3ZhbHVlJyBpcyBhbiBhcnJheVxuLy8gICAgdGhhdCBleHBhbmRBcnJheXNJbkJyYW5jaGVzIHNob3VsZCBOT1QgZXhwYW5kLiBUaGlzIHNwZWNpZmljYWxseSBoYXBwZW5zXG4vLyAgICB3aGVuIHRoZXJlIGlzIGEgbnVtZXJpYyBpbmRleCBpbiB0aGUga2V5LCBhbmQgZW5zdXJlcyB0aGVcbi8vICAgIHBlcmhhcHMtc3VycHJpc2luZyBNb25nb0RCIGJlaGF2aW9yIHdoZXJlIHsnYS4wJzogNX0gZG9lcyBOT1Rcbi8vICAgIG1hdGNoIHthOiBbWzVdXX0uXG4vLyAgLSBhcnJheUluZGljZXM6IGlmIGFueSBhcnJheSBpbmRleGluZyB3YXMgZG9uZSBkdXJpbmcgbG9va3VwIChlaXRoZXIgZHVlIHRvXG4vLyAgICBleHBsaWNpdCBudW1lcmljIGluZGljZXMgb3IgaW1wbGljaXQgYnJhbmNoaW5nKSwgdGhpcyB3aWxsIGJlIGFuIGFycmF5IG9mXG4vLyAgICB0aGUgYXJyYXkgaW5kaWNlcyB1c2VkLCBmcm9tIG91dGVybW9zdCB0byBpbm5lcm1vc3Q7IGl0IGlzIGZhbHNleSBvclxuLy8gICAgYWJzZW50IGlmIG5vIGFycmF5IGluZGV4IGlzIHVzZWQuIElmIGFuIGV4cGxpY2l0IG51bWVyaWMgaW5kZXggaXMgdXNlZCxcbi8vICAgIHRoZSBpbmRleCB3aWxsIGJlIGZvbGxvd2VkIGluIGFycmF5SW5kaWNlcyBieSB0aGUgc3RyaW5nICd4Jy5cbi8vXG4vLyAgICBOb3RlOiBhcnJheUluZGljZXMgaXMgdXNlZCBmb3IgdHdvIHB1cnBvc2VzLiBGaXJzdCwgaXQgaXMgdXNlZCB0b1xuLy8gICAgaW1wbGVtZW50IHRoZSAnJCcgbW9kaWZpZXIgZmVhdHVyZSwgd2hpY2ggb25seSBldmVyIGxvb2tzIGF0IGl0cyBmaXJzdFxuLy8gICAgZWxlbWVudC5cbi8vXG4vLyAgICBTZWNvbmQsIGl0IGlzIHVzZWQgZm9yIHNvcnQga2V5IGdlbmVyYXRpb24sIHdoaWNoIG5lZWRzIHRvIGJlIGFibGUgdG8gdGVsbFxuLy8gICAgdGhlIGRpZmZlcmVuY2UgYmV0d2VlbiBkaWZmZXJlbnQgcGF0aHMuIE1vcmVvdmVyLCBpdCBuZWVkcyB0b1xuLy8gICAgZGlmZmVyZW50aWF0ZSBiZXR3ZWVuIGV4cGxpY2l0IGFuZCBpbXBsaWNpdCBicmFuY2hpbmcsIHdoaWNoIGlzIHdoeVxuLy8gICAgdGhlcmUncyB0aGUgc29tZXdoYXQgaGFja3kgJ3gnIGVudHJ5OiB0aGlzIG1lYW5zIHRoYXQgZXhwbGljaXQgYW5kXG4vLyAgICBpbXBsaWNpdCBhcnJheSBsb29rdXBzIHdpbGwgaGF2ZSBkaWZmZXJlbnQgZnVsbCBhcnJheUluZGljZXMgcGF0aHMuIChUaGF0XG4vLyAgICBjb2RlIG9ubHkgcmVxdWlyZXMgdGhhdCBkaWZmZXJlbnQgcGF0aHMgaGF2ZSBkaWZmZXJlbnQgYXJyYXlJbmRpY2VzOyBpdFxuLy8gICAgZG9lc24ndCBhY3R1YWxseSAncGFyc2UnIGFycmF5SW5kaWNlcy4gQXMgYW4gYWx0ZXJuYXRpdmUsIGFycmF5SW5kaWNlc1xuLy8gICAgY291bGQgY29udGFpbiBvYmplY3RzIHdpdGggZmxhZ3MgbGlrZSAnaW1wbGljaXQnLCBidXQgSSB0aGluayB0aGF0IG9ubHlcbi8vICAgIG1ha2VzIHRoZSBjb2RlIHN1cnJvdW5kaW5nIHRoZW0gbW9yZSBjb21wbGV4Lilcbi8vXG4vLyAgICAoQnkgdGhlIHdheSwgdGhpcyBmaWVsZCBlbmRzIHVwIGdldHRpbmcgcGFzc2VkIGFyb3VuZCBhIGxvdCB3aXRob3V0XG4vLyAgICBjbG9uaW5nLCBzbyBuZXZlciBtdXRhdGUgYW55IGFycmF5SW5kaWNlcyBmaWVsZC92YXIgaW4gdGhpcyBwYWNrYWdlISlcbi8vXG4vL1xuLy8gQXQgdGhlIHRvcCBsZXZlbCwgeW91IG1heSBvbmx5IHBhc3MgaW4gYSBwbGFpbiBvYmplY3Qgb3IgYXJyYXkuXG4vL1xuLy8gU2VlIHRoZSB0ZXN0ICdtaW5pbW9uZ28gLSBsb29rdXAnIGZvciBzb21lIGV4YW1wbGVzIG9mIHdoYXQgbG9va3VwIGZ1bmN0aW9uc1xuLy8gcmV0dXJuLlxuZXhwb3J0IGZ1bmN0aW9uIG1ha2VMb29rdXBGdW5jdGlvbihrZXksIG9wdGlvbnMgPSB7fSkge1xuICBjb25zdCBwYXJ0cyA9IGtleS5zcGxpdCgnLicpO1xuICBjb25zdCBmaXJzdFBhcnQgPSBwYXJ0cy5sZW5ndGggPyBwYXJ0c1swXSA6ICcnO1xuICBjb25zdCBsb29rdXBSZXN0ID0gKFxuICAgIHBhcnRzLmxlbmd0aCA+IDEgJiZcbiAgICBtYWtlTG9va3VwRnVuY3Rpb24ocGFydHMuc2xpY2UoMSkuam9pbignLicpLCBvcHRpb25zKVxuICApO1xuXG4gIGNvbnN0IG9taXRVbm5lY2Vzc2FyeUZpZWxkcyA9IHJlc3VsdCA9PiB7XG4gICAgaWYgKCFyZXN1bHQuZG9udEl0ZXJhdGUpIHtcbiAgICAgIGRlbGV0ZSByZXN1bHQuZG9udEl0ZXJhdGU7XG4gICAgfVxuXG4gICAgaWYgKHJlc3VsdC5hcnJheUluZGljZXMgJiYgIXJlc3VsdC5hcnJheUluZGljZXMubGVuZ3RoKSB7XG4gICAgICBkZWxldGUgcmVzdWx0LmFycmF5SW5kaWNlcztcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIERvYyB3aWxsIGFsd2F5cyBiZSBhIHBsYWluIG9iamVjdCBvciBhbiBhcnJheS5cbiAgLy8gYXBwbHkgYW4gZXhwbGljaXQgbnVtZXJpYyBpbmRleCwgYW4gYXJyYXkuXG4gIHJldHVybiAoZG9jLCBhcnJheUluZGljZXMgPSBbXSkgPT4ge1xuICAgIGlmIChBcnJheS5pc0FycmF5KGRvYykpIHtcbiAgICAgIC8vIElmIHdlJ3JlIGJlaW5nIGFza2VkIHRvIGRvIGFuIGludmFsaWQgbG9va3VwIGludG8gYW4gYXJyYXkgKG5vbi1pbnRlZ2VyXG4gICAgICAvLyBvciBvdXQtb2YtYm91bmRzKSwgcmV0dXJuIG5vIHJlc3VsdHMgKHdoaWNoIGlzIGRpZmZlcmVudCBmcm9tIHJldHVybmluZ1xuICAgICAgLy8gYSBzaW5nbGUgdW5kZWZpbmVkIHJlc3VsdCwgaW4gdGhhdCBgbnVsbGAgZXF1YWxpdHkgY2hlY2tzIHdvbid0IG1hdGNoKS5cbiAgICAgIGlmICghKGlzTnVtZXJpY0tleShmaXJzdFBhcnQpICYmIGZpcnN0UGFydCA8IGRvYy5sZW5ndGgpKSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICAgIH1cblxuICAgICAgLy8gUmVtZW1iZXIgdGhhdCB3ZSB1c2VkIHRoaXMgYXJyYXkgaW5kZXguIEluY2x1ZGUgYW4gJ3gnIHRvIGluZGljYXRlIHRoYXRcbiAgICAgIC8vIHRoZSBwcmV2aW91cyBpbmRleCBjYW1lIGZyb20gYmVpbmcgY29uc2lkZXJlZCBhcyBhbiBleHBsaWNpdCBhcnJheVxuICAgICAgLy8gaW5kZXggKG5vdCBicmFuY2hpbmcpLlxuICAgICAgYXJyYXlJbmRpY2VzID0gYXJyYXlJbmRpY2VzLmNvbmNhdCgrZmlyc3RQYXJ0LCAneCcpO1xuICAgIH1cblxuICAgIC8vIERvIG91ciBmaXJzdCBsb29rdXAuXG4gICAgY29uc3QgZmlyc3RMZXZlbCA9IGRvY1tmaXJzdFBhcnRdO1xuXG4gICAgLy8gSWYgdGhlcmUgaXMgbm8gZGVlcGVyIHRvIGRpZywgcmV0dXJuIHdoYXQgd2UgZm91bmQuXG4gICAgLy9cbiAgICAvLyBJZiB3aGF0IHdlIGZvdW5kIGlzIGFuIGFycmF5LCBtb3N0IHZhbHVlIHNlbGVjdG9ycyB3aWxsIGNob29zZSB0byB0cmVhdFxuICAgIC8vIHRoZSBlbGVtZW50cyBvZiB0aGUgYXJyYXkgYXMgbWF0Y2hhYmxlIHZhbHVlcyBpbiB0aGVpciBvd24gcmlnaHQsIGJ1dFxuICAgIC8vIHRoYXQncyBkb25lIG91dHNpZGUgb2YgdGhlIGxvb2t1cCBmdW5jdGlvbi4gKEV4Y2VwdGlvbnMgdG8gdGhpcyBhcmUgJHNpemVcbiAgICAvLyBhbmQgc3R1ZmYgcmVsYXRpbmcgdG8gJGVsZW1NYXRjaC4gIGVnLCB7YTogeyRzaXplOiAyfX0gZG9lcyBub3QgbWF0Y2gge2E6XG4gICAgLy8gW1sxLCAyXV19LilcbiAgICAvL1xuICAgIC8vIFRoYXQgc2FpZCwgaWYgd2UganVzdCBkaWQgYW4gKmV4cGxpY2l0KiBhcnJheSBsb29rdXAgKG9uIGRvYykgdG8gZmluZFxuICAgIC8vIGZpcnN0TGV2ZWwsIGFuZCBmaXJzdExldmVsIGlzIGFuIGFycmF5IHRvbywgd2UgZG8gTk9UIHdhbnQgdmFsdWVcbiAgICAvLyBzZWxlY3RvcnMgdG8gaXRlcmF0ZSBvdmVyIGl0LiAgZWcsIHsnYS4wJzogNX0gZG9lcyBub3QgbWF0Y2gge2E6IFtbNV1dfS5cbiAgICAvLyBTbyBpbiB0aGF0IGNhc2UsIHdlIG1hcmsgdGhlIHJldHVybiB2YWx1ZSBhcyAnZG9uJ3QgaXRlcmF0ZScuXG4gICAgaWYgKCFsb29rdXBSZXN0KSB7XG4gICAgICByZXR1cm4gW29taXRVbm5lY2Vzc2FyeUZpZWxkcyh7XG4gICAgICAgIGFycmF5SW5kaWNlcyxcbiAgICAgICAgZG9udEl0ZXJhdGU6IEFycmF5LmlzQXJyYXkoZG9jKSAmJiBBcnJheS5pc0FycmF5KGZpcnN0TGV2ZWwpLFxuICAgICAgICB2YWx1ZTogZmlyc3RMZXZlbFxuICAgICAgfSldO1xuICAgIH1cblxuICAgIC8vIFdlIG5lZWQgdG8gZGlnIGRlZXBlci4gIEJ1dCBpZiB3ZSBjYW4ndCwgYmVjYXVzZSB3aGF0IHdlJ3ZlIGZvdW5kIGlzIG5vdFxuICAgIC8vIGFuIGFycmF5IG9yIHBsYWluIG9iamVjdCwgd2UncmUgZG9uZS4gSWYgd2UganVzdCBkaWQgYSBudW1lcmljIGluZGV4IGludG9cbiAgICAvLyBhbiBhcnJheSwgd2UgcmV0dXJuIG5vdGhpbmcgaGVyZSAodGhpcyBpcyBhIGNoYW5nZSBpbiBNb25nbyAyLjUgZnJvbVxuICAgIC8vIE1vbmdvIDIuNCwgd2hlcmUgeydhLjAuYic6IG51bGx9IHN0b3BwZWQgbWF0Y2hpbmcge2E6IFs1XX0pLiBPdGhlcndpc2UsXG4gICAgLy8gcmV0dXJuIGEgc2luZ2xlIGB1bmRlZmluZWRgICh3aGljaCBjYW4sIGZvciBleGFtcGxlLCBtYXRjaCB2aWEgZXF1YWxpdHlcbiAgICAvLyB3aXRoIGBudWxsYCkuXG4gICAgaWYgKCFpc0luZGV4YWJsZShmaXJzdExldmVsKSkge1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZG9jKSkge1xuICAgICAgICByZXR1cm4gW107XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBbb21pdFVubmVjZXNzYXJ5RmllbGRzKHthcnJheUluZGljZXMsIHZhbHVlOiB1bmRlZmluZWR9KV07XG4gICAgfVxuXG4gICAgY29uc3QgcmVzdWx0ID0gW107XG4gICAgY29uc3QgYXBwZW5kVG9SZXN1bHQgPSBtb3JlID0+IHtcbiAgICAgIHJlc3VsdC5wdXNoKC4uLm1vcmUpO1xuICAgIH07XG5cbiAgICAvLyBEaWcgZGVlcGVyOiBsb29rIHVwIHRoZSByZXN0IG9mIHRoZSBwYXJ0cyBvbiB3aGF0ZXZlciB3ZSd2ZSBmb3VuZC5cbiAgICAvLyAobG9va3VwUmVzdCBpcyBzbWFydCBlbm91Z2ggdG8gbm90IHRyeSB0byBkbyBpbnZhbGlkIGxvb2t1cHMgaW50b1xuICAgIC8vIGZpcnN0TGV2ZWwgaWYgaXQncyBhbiBhcnJheS4pXG4gICAgYXBwZW5kVG9SZXN1bHQobG9va3VwUmVzdChmaXJzdExldmVsLCBhcnJheUluZGljZXMpKTtcblxuICAgIC8vIElmIHdlIGZvdW5kIGFuIGFycmF5LCB0aGVuIGluICphZGRpdGlvbiogdG8gcG90ZW50aWFsbHkgdHJlYXRpbmcgdGhlIG5leHRcbiAgICAvLyBwYXJ0IGFzIGEgbGl0ZXJhbCBpbnRlZ2VyIGxvb2t1cCwgd2Ugc2hvdWxkIGFsc28gJ2JyYW5jaCc6IHRyeSB0byBsb29rIHVwXG4gICAgLy8gdGhlIHJlc3Qgb2YgdGhlIHBhcnRzIG9uIGVhY2ggYXJyYXkgZWxlbWVudCBpbiBwYXJhbGxlbC5cbiAgICAvL1xuICAgIC8vIEluIHRoaXMgY2FzZSwgd2UgKm9ubHkqIGRpZyBkZWVwZXIgaW50byBhcnJheSBlbGVtZW50cyB0aGF0IGFyZSBwbGFpblxuICAgIC8vIG9iamVjdHMuIChSZWNhbGwgdGhhdCB3ZSBvbmx5IGdvdCB0aGlzIGZhciBpZiB3ZSBoYXZlIGZ1cnRoZXIgdG8gZGlnLilcbiAgICAvLyBUaGlzIG1ha2VzIHNlbnNlOiB3ZSBjZXJ0YWlubHkgZG9uJ3QgZGlnIGRlZXBlciBpbnRvIG5vbi1pbmRleGFibGVcbiAgICAvLyBvYmplY3RzLiBBbmQgaXQgd291bGQgYmUgd2VpcmQgdG8gZGlnIGludG8gYW4gYXJyYXk6IGl0J3Mgc2ltcGxlciB0byBoYXZlXG4gICAgLy8gYSBydWxlIHRoYXQgZXhwbGljaXQgaW50ZWdlciBpbmRleGVzIG9ubHkgYXBwbHkgdG8gYW4gb3V0ZXIgYXJyYXksIG5vdCB0b1xuICAgIC8vIGFuIGFycmF5IHlvdSBmaW5kIGFmdGVyIGEgYnJhbmNoaW5nIHNlYXJjaC5cbiAgICAvL1xuICAgIC8vIEluIHRoZSBzcGVjaWFsIGNhc2Ugb2YgYSBudW1lcmljIHBhcnQgaW4gYSAqc29ydCBzZWxlY3RvciogKG5vdCBhIHF1ZXJ5XG4gICAgLy8gc2VsZWN0b3IpLCB3ZSBza2lwIHRoZSBicmFuY2hpbmc6IHdlIE9OTFkgYWxsb3cgdGhlIG51bWVyaWMgcGFydCB0byBtZWFuXG4gICAgLy8gJ2xvb2sgdXAgdGhpcyBpbmRleCcgaW4gdGhhdCBjYXNlLCBub3QgJ2Fsc28gbG9vayB1cCB0aGlzIGluZGV4IGluIGFsbFxuICAgIC8vIHRoZSBlbGVtZW50cyBvZiB0aGUgYXJyYXknLlxuICAgIGlmIChBcnJheS5pc0FycmF5KGZpcnN0TGV2ZWwpICYmXG4gICAgICAgICEoaXNOdW1lcmljS2V5KHBhcnRzWzFdKSAmJiBvcHRpb25zLmZvclNvcnQpKSB7XG4gICAgICBmaXJzdExldmVsLmZvckVhY2goKGJyYW5jaCwgYXJyYXlJbmRleCkgPT4ge1xuICAgICAgICBpZiAoTG9jYWxDb2xsZWN0aW9uLl9pc1BsYWluT2JqZWN0KGJyYW5jaCkpIHtcbiAgICAgICAgICBhcHBlbmRUb1Jlc3VsdChsb29rdXBSZXN0KGJyYW5jaCwgYXJyYXlJbmRpY2VzLmNvbmNhdChhcnJheUluZGV4KSkpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufVxuXG4vLyBPYmplY3QgZXhwb3J0ZWQgb25seSBmb3IgdW5pdCB0ZXN0aW5nLlxuLy8gVXNlIGl0IHRvIGV4cG9ydCBwcml2YXRlIGZ1bmN0aW9ucyB0byB0ZXN0IGluIFRpbnl0ZXN0LlxuTWluaW1vbmdvVGVzdCA9IHttYWtlTG9va3VwRnVuY3Rpb259O1xuTWluaW1vbmdvRXJyb3IgPSAobWVzc2FnZSwgb3B0aW9ucyA9IHt9KSA9PiB7XG4gIGlmICh0eXBlb2YgbWVzc2FnZSA9PT0gJ3N0cmluZycgJiYgb3B0aW9ucy5maWVsZCkge1xuICAgIG1lc3NhZ2UgKz0gYCBmb3IgZmllbGQgJyR7b3B0aW9ucy5maWVsZH0nYDtcbiAgfVxuXG4gIGNvbnN0IGVycm9yID0gbmV3IEVycm9yKG1lc3NhZ2UpO1xuICBlcnJvci5uYW1lID0gJ01pbmltb25nb0Vycm9yJztcbiAgcmV0dXJuIGVycm9yO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIG5vdGhpbmdNYXRjaGVyKGRvY09yQnJhbmNoZWRWYWx1ZXMpIHtcbiAgcmV0dXJuIHtyZXN1bHQ6IGZhbHNlfTtcbn1cblxuLy8gVGFrZXMgYW4gb3BlcmF0b3Igb2JqZWN0IChhbiBvYmplY3Qgd2l0aCAkIGtleXMpIGFuZCByZXR1cm5zIGEgYnJhbmNoZWRcbi8vIG1hdGNoZXIgZm9yIGl0LlxuZnVuY3Rpb24gb3BlcmF0b3JCcmFuY2hlZE1hdGNoZXIodmFsdWVTZWxlY3RvciwgbWF0Y2hlciwgaXNSb290KSB7XG4gIC8vIEVhY2ggdmFsdWVTZWxlY3RvciB3b3JrcyBzZXBhcmF0ZWx5IG9uIHRoZSB2YXJpb3VzIGJyYW5jaGVzLiAgU28gb25lXG4gIC8vIG9wZXJhdG9yIGNhbiBtYXRjaCBvbmUgYnJhbmNoIGFuZCBhbm90aGVyIGNhbiBtYXRjaCBhbm90aGVyIGJyYW5jaC4gIFRoaXNcbiAgLy8gaXMgT0suXG4gIGNvbnN0IG9wZXJhdG9yTWF0Y2hlcnMgPSBPYmplY3Qua2V5cyh2YWx1ZVNlbGVjdG9yKS5tYXAob3BlcmF0b3IgPT4ge1xuICAgIGNvbnN0IG9wZXJhbmQgPSB2YWx1ZVNlbGVjdG9yW29wZXJhdG9yXTtcblxuICAgIGNvbnN0IHNpbXBsZVJhbmdlID0gKFxuICAgICAgWyckbHQnLCAnJGx0ZScsICckZ3QnLCAnJGd0ZSddLmluY2x1ZGVzKG9wZXJhdG9yKSAmJlxuICAgICAgdHlwZW9mIG9wZXJhbmQgPT09ICdudW1iZXInXG4gICAgKTtcblxuICAgIGNvbnN0IHNpbXBsZUVxdWFsaXR5ID0gKFxuICAgICAgWyckbmUnLCAnJGVxJ10uaW5jbHVkZXMob3BlcmF0b3IpICYmXG4gICAgICBvcGVyYW5kICE9PSBPYmplY3Qob3BlcmFuZClcbiAgICApO1xuXG4gICAgY29uc3Qgc2ltcGxlSW5jbHVzaW9uID0gKFxuICAgICAgWyckaW4nLCAnJG5pbiddLmluY2x1ZGVzKG9wZXJhdG9yKVxuICAgICAgJiYgQXJyYXkuaXNBcnJheShvcGVyYW5kKVxuICAgICAgJiYgIW9wZXJhbmQuc29tZSh4ID0+IHggPT09IE9iamVjdCh4KSlcbiAgICApO1xuXG4gICAgaWYgKCEoc2ltcGxlUmFuZ2UgfHwgc2ltcGxlSW5jbHVzaW9uIHx8IHNpbXBsZUVxdWFsaXR5KSkge1xuICAgICAgbWF0Y2hlci5faXNTaW1wbGUgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoaGFzT3duLmNhbGwoVkFMVUVfT1BFUkFUT1JTLCBvcGVyYXRvcikpIHtcbiAgICAgIHJldHVybiBWQUxVRV9PUEVSQVRPUlNbb3BlcmF0b3JdKG9wZXJhbmQsIHZhbHVlU2VsZWN0b3IsIG1hdGNoZXIsIGlzUm9vdCk7XG4gICAgfVxuXG4gICAgaWYgKGhhc093bi5jYWxsKEVMRU1FTlRfT1BFUkFUT1JTLCBvcGVyYXRvcikpIHtcbiAgICAgIGNvbnN0IG9wdGlvbnMgPSBFTEVNRU5UX09QRVJBVE9SU1tvcGVyYXRvcl07XG4gICAgICByZXR1cm4gY29udmVydEVsZW1lbnRNYXRjaGVyVG9CcmFuY2hlZE1hdGNoZXIoXG4gICAgICAgIG9wdGlvbnMuY29tcGlsZUVsZW1lbnRTZWxlY3RvcihvcGVyYW5kLCB2YWx1ZVNlbGVjdG9yLCBtYXRjaGVyKSxcbiAgICAgICAgb3B0aW9uc1xuICAgICAgKTtcbiAgICB9XG5cbiAgICB0aHJvdyBuZXcgRXJyb3IoYFVucmVjb2duaXplZCBvcGVyYXRvcjogJHtvcGVyYXRvcn1gKTtcbiAgfSk7XG5cbiAgcmV0dXJuIGFuZEJyYW5jaGVkTWF0Y2hlcnMob3BlcmF0b3JNYXRjaGVycyk7XG59XG5cbi8vIHBhdGhzIC0gQXJyYXk6IGxpc3Qgb2YgbW9uZ28gc3R5bGUgcGF0aHNcbi8vIG5ld0xlYWZGbiAtIEZ1bmN0aW9uOiBvZiBmb3JtIGZ1bmN0aW9uKHBhdGgpIHNob3VsZCByZXR1cm4gYSBzY2FsYXIgdmFsdWUgdG9cbi8vICAgICAgICAgICAgICAgICAgICAgICBwdXQgaW50byBsaXN0IGNyZWF0ZWQgZm9yIHRoYXQgcGF0aFxuLy8gY29uZmxpY3RGbiAtIEZ1bmN0aW9uOiBvZiBmb3JtIGZ1bmN0aW9uKG5vZGUsIHBhdGgsIGZ1bGxQYXRoKSBpcyBjYWxsZWRcbi8vICAgICAgICAgICAgICAgICAgICAgICAgd2hlbiBidWlsZGluZyBhIHRyZWUgcGF0aCBmb3IgJ2Z1bGxQYXRoJyBub2RlIG9uXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICdwYXRoJyB3YXMgYWxyZWFkeSBhIGxlYWYgd2l0aCBhIHZhbHVlLiBNdXN0IHJldHVybiBhXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZsaWN0IHJlc29sdXRpb24uXG4vLyBpbml0aWFsIHRyZWUgLSBPcHRpb25hbCBPYmplY3Q6IHN0YXJ0aW5nIHRyZWUuXG4vLyBAcmV0dXJucyAtIE9iamVjdDogdHJlZSByZXByZXNlbnRlZCBhcyBhIHNldCBvZiBuZXN0ZWQgb2JqZWN0c1xuZXhwb3J0IGZ1bmN0aW9uIHBhdGhzVG9UcmVlKHBhdGhzLCBuZXdMZWFmRm4sIGNvbmZsaWN0Rm4sIHJvb3QgPSB7fSkge1xuICBwYXRocy5mb3JFYWNoKHBhdGggPT4ge1xuICAgIGNvbnN0IHBhdGhBcnJheSA9IHBhdGguc3BsaXQoJy4nKTtcbiAgICBsZXQgdHJlZSA9IHJvb3Q7XG5cbiAgICAvLyB1c2UgLmV2ZXJ5IGp1c3QgZm9yIGl0ZXJhdGlvbiB3aXRoIGJyZWFrXG4gICAgY29uc3Qgc3VjY2VzcyA9IHBhdGhBcnJheS5zbGljZSgwLCAtMSkuZXZlcnkoKGtleSwgaSkgPT4ge1xuICAgICAgaWYgKCFoYXNPd24uY2FsbCh0cmVlLCBrZXkpKSB7XG4gICAgICAgIHRyZWVba2V5XSA9IHt9O1xuICAgICAgfSBlbHNlIGlmICh0cmVlW2tleV0gIT09IE9iamVjdCh0cmVlW2tleV0pKSB7XG4gICAgICAgIHRyZWVba2V5XSA9IGNvbmZsaWN0Rm4oXG4gICAgICAgICAgdHJlZVtrZXldLFxuICAgICAgICAgIHBhdGhBcnJheS5zbGljZSgwLCBpICsgMSkuam9pbignLicpLFxuICAgICAgICAgIHBhdGhcbiAgICAgICAgKTtcblxuICAgICAgICAvLyBicmVhayBvdXQgb2YgbG9vcCBpZiB3ZSBhcmUgZmFpbGluZyBmb3IgdGhpcyBwYXRoXG4gICAgICAgIGlmICh0cmVlW2tleV0gIT09IE9iamVjdCh0cmVlW2tleV0pKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRyZWUgPSB0cmVlW2tleV07XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0pO1xuXG4gICAgaWYgKHN1Y2Nlc3MpIHtcbiAgICAgIGNvbnN0IGxhc3RLZXkgPSBwYXRoQXJyYXlbcGF0aEFycmF5Lmxlbmd0aCAtIDFdO1xuICAgICAgaWYgKGhhc093bi5jYWxsKHRyZWUsIGxhc3RLZXkpKSB7XG4gICAgICAgIHRyZWVbbGFzdEtleV0gPSBjb25mbGljdEZuKHRyZWVbbGFzdEtleV0sIHBhdGgsIHBhdGgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdHJlZVtsYXN0S2V5XSA9IG5ld0xlYWZGbihwYXRoKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiByb290O1xufVxuXG4vLyBNYWtlcyBzdXJlIHdlIGdldCAyIGVsZW1lbnRzIGFycmF5IGFuZCBhc3N1bWUgdGhlIGZpcnN0IG9uZSB0byBiZSB4IGFuZFxuLy8gdGhlIHNlY29uZCBvbmUgdG8geSBubyBtYXR0ZXIgd2hhdCB1c2VyIHBhc3Nlcy5cbi8vIEluIGNhc2UgdXNlciBwYXNzZXMgeyBsb246IHgsIGxhdDogeSB9IHJldHVybnMgW3gsIHldXG5mdW5jdGlvbiBwb2ludFRvQXJyYXkocG9pbnQpIHtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkocG9pbnQpID8gcG9pbnQuc2xpY2UoKSA6IFtwb2ludC54LCBwb2ludC55XTtcbn1cblxuLy8gQ3JlYXRpbmcgYSBkb2N1bWVudCBmcm9tIGFuIHVwc2VydCBpcyBxdWl0ZSB0cmlja3kuXG4vLyBFLmcuIHRoaXMgc2VsZWN0b3I6IHtcIiRvclwiOiBbe1wiYi5mb29cIjoge1wiJGFsbFwiOiBbXCJiYXJcIl19fV19LCBzaG91bGQgcmVzdWx0XG4vLyBpbjoge1wiYi5mb29cIjogXCJiYXJcIn1cbi8vIEJ1dCB0aGlzIHNlbGVjdG9yOiB7XCIkb3JcIjogW3tcImJcIjoge1wiZm9vXCI6IHtcIiRhbGxcIjogW1wiYmFyXCJdfX19XX0gc2hvdWxkIHRocm93XG4vLyBhbiBlcnJvclxuXG4vLyBTb21lIHJ1bGVzIChmb3VuZCBtYWlubHkgd2l0aCB0cmlhbCAmIGVycm9yLCBzbyB0aGVyZSBtaWdodCBiZSBtb3JlKTpcbi8vIC0gaGFuZGxlIGFsbCBjaGlsZHMgb2YgJGFuZCAob3IgaW1wbGljaXQgJGFuZClcbi8vIC0gaGFuZGxlICRvciBub2RlcyB3aXRoIGV4YWN0bHkgMSBjaGlsZFxuLy8gLSBpZ25vcmUgJG9yIG5vZGVzIHdpdGggbW9yZSB0aGFuIDEgY2hpbGRcbi8vIC0gaWdub3JlICRub3IgYW5kICRub3Qgbm9kZXNcbi8vIC0gdGhyb3cgd2hlbiBhIHZhbHVlIGNhbiBub3QgYmUgc2V0IHVuYW1iaWd1b3VzbHlcbi8vIC0gZXZlcnkgdmFsdWUgZm9yICRhbGwgc2hvdWxkIGJlIGRlYWx0IHdpdGggYXMgc2VwYXJhdGUgJGVxLXNcbi8vIC0gdGhyZWF0IGFsbCBjaGlsZHJlbiBvZiAkYWxsIGFzICRlcSBzZXR0ZXJzICg9PiBzZXQgaWYgJGFsbC5sZW5ndGggPT09IDEsXG4vLyAgIG90aGVyd2lzZSB0aHJvdyBlcnJvcilcbi8vIC0geW91IGNhbiBub3QgbWl4ICckJy1wcmVmaXhlZCBrZXlzIGFuZCBub24tJyQnLXByZWZpeGVkIGtleXNcbi8vIC0geW91IGNhbiBvbmx5IGhhdmUgZG90dGVkIGtleXMgb24gYSByb290LWxldmVsXG4vLyAtIHlvdSBjYW4gbm90IGhhdmUgJyQnLXByZWZpeGVkIGtleXMgbW9yZSB0aGFuIG9uZS1sZXZlbCBkZWVwIGluIGFuIG9iamVjdFxuXG4vLyBIYW5kbGVzIG9uZSBrZXkvdmFsdWUgcGFpciB0byBwdXQgaW4gdGhlIHNlbGVjdG9yIGRvY3VtZW50XG5mdW5jdGlvbiBwb3B1bGF0ZURvY3VtZW50V2l0aEtleVZhbHVlKGRvY3VtZW50LCBrZXksIHZhbHVlKSB7XG4gIGlmICh2YWx1ZSAmJiBPYmplY3QuZ2V0UHJvdG90eXBlT2YodmFsdWUpID09PSBPYmplY3QucHJvdG90eXBlKSB7XG4gICAgcG9wdWxhdGVEb2N1bWVudFdpdGhPYmplY3QoZG9jdW1lbnQsIGtleSwgdmFsdWUpO1xuICB9IGVsc2UgaWYgKCEodmFsdWUgaW5zdGFuY2VvZiBSZWdFeHApKSB7XG4gICAgaW5zZXJ0SW50b0RvY3VtZW50KGRvY3VtZW50LCBrZXksIHZhbHVlKTtcbiAgfVxufVxuXG4vLyBIYW5kbGVzIGEga2V5LCB2YWx1ZSBwYWlyIHRvIHB1dCBpbiB0aGUgc2VsZWN0b3IgZG9jdW1lbnRcbi8vIGlmIHRoZSB2YWx1ZSBpcyBhbiBvYmplY3RcbmZ1bmN0aW9uIHBvcHVsYXRlRG9jdW1lbnRXaXRoT2JqZWN0KGRvY3VtZW50LCBrZXksIHZhbHVlKSB7XG4gIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyh2YWx1ZSk7XG4gIGNvbnN0IHVucHJlZml4ZWRLZXlzID0ga2V5cy5maWx0ZXIob3AgPT4gb3BbMF0gIT09ICckJyk7XG5cbiAgaWYgKHVucHJlZml4ZWRLZXlzLmxlbmd0aCA+IDAgfHwgIWtleXMubGVuZ3RoKSB7XG4gICAgLy8gTGl0ZXJhbCAocG9zc2libHkgZW1wdHkpIG9iamVjdCAoIG9yIGVtcHR5IG9iamVjdCApXG4gICAgLy8gRG9uJ3QgYWxsb3cgbWl4aW5nICckJy1wcmVmaXhlZCB3aXRoIG5vbi0nJCctcHJlZml4ZWQgZmllbGRzXG4gICAgaWYgKGtleXMubGVuZ3RoICE9PSB1bnByZWZpeGVkS2V5cy5sZW5ndGgpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgdW5rbm93biBvcGVyYXRvcjogJHt1bnByZWZpeGVkS2V5c1swXX1gKTtcbiAgICB9XG5cbiAgICB2YWxpZGF0ZU9iamVjdCh2YWx1ZSwga2V5KTtcbiAgICBpbnNlcnRJbnRvRG9jdW1lbnQoZG9jdW1lbnQsIGtleSwgdmFsdWUpO1xuICB9IGVsc2Uge1xuICAgIE9iamVjdC5rZXlzKHZhbHVlKS5mb3JFYWNoKG9wID0+IHtcbiAgICAgIGNvbnN0IG9iamVjdCA9IHZhbHVlW29wXTtcblxuICAgICAgaWYgKG9wID09PSAnJGVxJykge1xuICAgICAgICBwb3B1bGF0ZURvY3VtZW50V2l0aEtleVZhbHVlKGRvY3VtZW50LCBrZXksIG9iamVjdCk7XG4gICAgICB9IGVsc2UgaWYgKG9wID09PSAnJGFsbCcpIHtcbiAgICAgICAgLy8gZXZlcnkgdmFsdWUgZm9yICRhbGwgc2hvdWxkIGJlIGRlYWx0IHdpdGggYXMgc2VwYXJhdGUgJGVxLXNcbiAgICAgICAgb2JqZWN0LmZvckVhY2goZWxlbWVudCA9PlxuICAgICAgICAgIHBvcHVsYXRlRG9jdW1lbnRXaXRoS2V5VmFsdWUoZG9jdW1lbnQsIGtleSwgZWxlbWVudClcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG4vLyBGaWxscyBhIGRvY3VtZW50IHdpdGggY2VydGFpbiBmaWVsZHMgZnJvbSBhbiB1cHNlcnQgc2VsZWN0b3JcbmV4cG9ydCBmdW5jdGlvbiBwb3B1bGF0ZURvY3VtZW50V2l0aFF1ZXJ5RmllbGRzKHF1ZXJ5LCBkb2N1bWVudCA9IHt9KSB7XG4gIGlmIChPYmplY3QuZ2V0UHJvdG90eXBlT2YocXVlcnkpID09PSBPYmplY3QucHJvdG90eXBlKSB7XG4gICAgLy8gaGFuZGxlIGltcGxpY2l0ICRhbmRcbiAgICBPYmplY3Qua2V5cyhxdWVyeSkuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgY29uc3QgdmFsdWUgPSBxdWVyeVtrZXldO1xuXG4gICAgICBpZiAoa2V5ID09PSAnJGFuZCcpIHtcbiAgICAgICAgLy8gaGFuZGxlIGV4cGxpY2l0ICRhbmRcbiAgICAgICAgdmFsdWUuZm9yRWFjaChlbGVtZW50ID0+XG4gICAgICAgICAgcG9wdWxhdGVEb2N1bWVudFdpdGhRdWVyeUZpZWxkcyhlbGVtZW50LCBkb2N1bWVudClcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSBpZiAoa2V5ID09PSAnJG9yJykge1xuICAgICAgICAvLyBoYW5kbGUgJG9yIG5vZGVzIHdpdGggZXhhY3RseSAxIGNoaWxkXG4gICAgICAgIGlmICh2YWx1ZS5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICBwb3B1bGF0ZURvY3VtZW50V2l0aFF1ZXJ5RmllbGRzKHZhbHVlWzBdLCBkb2N1bWVudCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoa2V5WzBdICE9PSAnJCcpIHtcbiAgICAgICAgLy8gSWdub3JlIG90aGVyICckJy1wcmVmaXhlZCBsb2dpY2FsIHNlbGVjdG9yc1xuICAgICAgICBwb3B1bGF0ZURvY3VtZW50V2l0aEtleVZhbHVlKGRvY3VtZW50LCBrZXksIHZhbHVlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICAvLyBIYW5kbGUgbWV0ZW9yLXNwZWNpZmljIHNob3J0Y3V0IGZvciBzZWxlY3RpbmcgX2lkXG4gICAgaWYgKExvY2FsQ29sbGVjdGlvbi5fc2VsZWN0b3JJc0lkKHF1ZXJ5KSkge1xuICAgICAgaW5zZXJ0SW50b0RvY3VtZW50KGRvY3VtZW50LCAnX2lkJywgcXVlcnkpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBkb2N1bWVudDtcbn1cblxuLy8gVHJhdmVyc2VzIHRoZSBrZXlzIG9mIHBhc3NlZCBwcm9qZWN0aW9uIGFuZCBjb25zdHJ1Y3RzIGEgdHJlZSB3aGVyZSBhbGxcbi8vIGxlYXZlcyBhcmUgZWl0aGVyIGFsbCBUcnVlIG9yIGFsbCBGYWxzZVxuLy8gQHJldHVybnMgT2JqZWN0OlxuLy8gIC0gdHJlZSAtIE9iamVjdCAtIHRyZWUgcmVwcmVzZW50YXRpb24gb2Yga2V5cyBpbnZvbHZlZCBpbiBwcm9qZWN0aW9uXG4vLyAgKGV4Y2VwdGlvbiBmb3IgJ19pZCcgYXMgaXQgaXMgYSBzcGVjaWFsIGNhc2UgaGFuZGxlZCBzZXBhcmF0ZWx5KVxuLy8gIC0gaW5jbHVkaW5nIC0gQm9vbGVhbiAtIFwidGFrZSBvbmx5IGNlcnRhaW4gZmllbGRzXCIgdHlwZSBvZiBwcm9qZWN0aW9uXG5leHBvcnQgZnVuY3Rpb24gcHJvamVjdGlvbkRldGFpbHMoZmllbGRzKSB7XG4gIC8vIEZpbmQgdGhlIG5vbi1faWQga2V5cyAoX2lkIGlzIGhhbmRsZWQgc3BlY2lhbGx5IGJlY2F1c2UgaXQgaXMgaW5jbHVkZWRcbiAgLy8gdW5sZXNzIGV4cGxpY2l0bHkgZXhjbHVkZWQpLiBTb3J0IHRoZSBrZXlzLCBzbyB0aGF0IG91ciBjb2RlIHRvIGRldGVjdFxuICAvLyBvdmVybGFwcyBsaWtlICdmb28nIGFuZCAnZm9vLmJhcicgY2FuIGFzc3VtZSB0aGF0ICdmb28nIGNvbWVzIGZpcnN0LlxuICBsZXQgZmllbGRzS2V5cyA9IE9iamVjdC5rZXlzKGZpZWxkcykuc29ydCgpO1xuXG4gIC8vIElmIF9pZCBpcyB0aGUgb25seSBmaWVsZCBpbiB0aGUgcHJvamVjdGlvbiwgZG8gbm90IHJlbW92ZSBpdCwgc2luY2UgaXQgaXNcbiAgLy8gcmVxdWlyZWQgdG8gZGV0ZXJtaW5lIGlmIHRoaXMgaXMgYW4gZXhjbHVzaW9uIG9yIGV4Y2x1c2lvbi4gQWxzbyBrZWVwIGFuXG4gIC8vIGluY2x1c2l2ZSBfaWQsIHNpbmNlIGluY2x1c2l2ZSBfaWQgZm9sbG93cyB0aGUgbm9ybWFsIHJ1bGVzIGFib3V0IG1peGluZ1xuICAvLyBpbmNsdXNpdmUgYW5kIGV4Y2x1c2l2ZSBmaWVsZHMuIElmIF9pZCBpcyBub3QgdGhlIG9ubHkgZmllbGQgaW4gdGhlXG4gIC8vIHByb2plY3Rpb24gYW5kIGlzIGV4Y2x1c2l2ZSwgcmVtb3ZlIGl0IHNvIGl0IGNhbiBiZSBoYW5kbGVkIGxhdGVyIGJ5IGFcbiAgLy8gc3BlY2lhbCBjYXNlLCBzaW5jZSBleGNsdXNpdmUgX2lkIGlzIGFsd2F5cyBhbGxvd2VkLlxuICBpZiAoIShmaWVsZHNLZXlzLmxlbmd0aCA9PT0gMSAmJiBmaWVsZHNLZXlzWzBdID09PSAnX2lkJykgJiZcbiAgICAgICEoZmllbGRzS2V5cy5pbmNsdWRlcygnX2lkJykgJiYgZmllbGRzLl9pZCkpIHtcbiAgICBmaWVsZHNLZXlzID0gZmllbGRzS2V5cy5maWx0ZXIoa2V5ID0+IGtleSAhPT0gJ19pZCcpO1xuICB9XG5cbiAgbGV0IGluY2x1ZGluZyA9IG51bGw7IC8vIFVua25vd25cblxuICBmaWVsZHNLZXlzLmZvckVhY2goa2V5UGF0aCA9PiB7XG4gICAgY29uc3QgcnVsZSA9ICEhZmllbGRzW2tleVBhdGhdO1xuXG4gICAgaWYgKGluY2x1ZGluZyA9PT0gbnVsbCkge1xuICAgICAgaW5jbHVkaW5nID0gcnVsZTtcbiAgICB9XG5cbiAgICAvLyBUaGlzIGVycm9yIG1lc3NhZ2UgaXMgY29waWVkIGZyb20gTW9uZ29EQiBzaGVsbFxuICAgIGlmIChpbmNsdWRpbmcgIT09IHJ1bGUpIHtcbiAgICAgIHRocm93IE1pbmltb25nb0Vycm9yKFxuICAgICAgICAnWW91IGNhbm5vdCBjdXJyZW50bHkgbWl4IGluY2x1ZGluZyBhbmQgZXhjbHVkaW5nIGZpZWxkcy4nXG4gICAgICApO1xuICAgIH1cbiAgfSk7XG5cbiAgY29uc3QgcHJvamVjdGlvblJ1bGVzVHJlZSA9IHBhdGhzVG9UcmVlKFxuICAgIGZpZWxkc0tleXMsXG4gICAgcGF0aCA9PiBpbmNsdWRpbmcsXG4gICAgKG5vZGUsIHBhdGgsIGZ1bGxQYXRoKSA9PiB7XG4gICAgICAvLyBDaGVjayBwYXNzZWQgcHJvamVjdGlvbiBmaWVsZHMnIGtleXM6IElmIHlvdSBoYXZlIHR3byBydWxlcyBzdWNoIGFzXG4gICAgICAvLyAnZm9vLmJhcicgYW5kICdmb28uYmFyLmJheicsIHRoZW4gdGhlIHJlc3VsdCBiZWNvbWVzIGFtYmlndW91cy4gSWZcbiAgICAgIC8vIHRoYXQgaGFwcGVucywgdGhlcmUgaXMgYSBwcm9iYWJpbGl0eSB5b3UgYXJlIGRvaW5nIHNvbWV0aGluZyB3cm9uZyxcbiAgICAgIC8vIGZyYW1ld29yayBzaG91bGQgbm90aWZ5IHlvdSBhYm91dCBzdWNoIG1pc3Rha2UgZWFybGllciBvbiBjdXJzb3JcbiAgICAgIC8vIGNvbXBpbGF0aW9uIHN0ZXAgdGhhbiBsYXRlciBkdXJpbmcgcnVudGltZS4gIE5vdGUsIHRoYXQgcmVhbCBtb25nb1xuICAgICAgLy8gZG9lc24ndCBkbyBhbnl0aGluZyBhYm91dCBpdCBhbmQgdGhlIGxhdGVyIHJ1bGUgYXBwZWFycyBpbiBwcm9qZWN0aW9uXG4gICAgICAvLyBwcm9qZWN0LCBtb3JlIHByaW9yaXR5IGl0IHRha2VzLlxuICAgICAgLy9cbiAgICAgIC8vIEV4YW1wbGUsIGFzc3VtZSBmb2xsb3dpbmcgaW4gbW9uZ28gc2hlbGw6XG4gICAgICAvLyA+IGRiLmNvbGwuaW5zZXJ0KHsgYTogeyBiOiAyMywgYzogNDQgfSB9KVxuICAgICAgLy8gPiBkYi5jb2xsLmZpbmQoe30sIHsgJ2EnOiAxLCAnYS5iJzogMSB9KVxuICAgICAgLy8ge1wiX2lkXCI6IE9iamVjdElkKFwiNTIwYmZlNDU2MDI0NjA4ZThlZjI0YWYzXCIpLCBcImFcIjoge1wiYlwiOiAyM319XG4gICAgICAvLyA+IGRiLmNvbGwuZmluZCh7fSwgeyAnYS5iJzogMSwgJ2EnOiAxIH0pXG4gICAgICAvLyB7XCJfaWRcIjogT2JqZWN0SWQoXCI1MjBiZmU0NTYwMjQ2MDhlOGVmMjRhZjNcIiksIFwiYVwiOiB7XCJiXCI6IDIzLCBcImNcIjogNDR9fVxuICAgICAgLy9cbiAgICAgIC8vIE5vdGUsIGhvdyBzZWNvbmQgdGltZSB0aGUgcmV0dXJuIHNldCBvZiBrZXlzIGlzIGRpZmZlcmVudC5cbiAgICAgIGNvbnN0IGN1cnJlbnRQYXRoID0gZnVsbFBhdGg7XG4gICAgICBjb25zdCBhbm90aGVyUGF0aCA9IHBhdGg7XG4gICAgICB0aHJvdyBNaW5pbW9uZ29FcnJvcihcbiAgICAgICAgYGJvdGggJHtjdXJyZW50UGF0aH0gYW5kICR7YW5vdGhlclBhdGh9IGZvdW5kIGluIGZpZWxkcyBvcHRpb24sIGAgK1xuICAgICAgICAndXNpbmcgYm90aCBvZiB0aGVtIG1heSB0cmlnZ2VyIHVuZXhwZWN0ZWQgYmVoYXZpb3IuIERpZCB5b3UgbWVhbiB0byAnICtcbiAgICAgICAgJ3VzZSBvbmx5IG9uZSBvZiB0aGVtPydcbiAgICAgICk7XG4gICAgfSk7XG5cbiAgcmV0dXJuIHtpbmNsdWRpbmcsIHRyZWU6IHByb2plY3Rpb25SdWxlc1RyZWV9O1xufVxuXG4vLyBUYWtlcyBhIFJlZ0V4cCBvYmplY3QgYW5kIHJldHVybnMgYW4gZWxlbWVudCBtYXRjaGVyLlxuZXhwb3J0IGZ1bmN0aW9uIHJlZ2V4cEVsZW1lbnRNYXRjaGVyKHJlZ2V4cCkge1xuICByZXR1cm4gdmFsdWUgPT4ge1xuICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgICAgcmV0dXJuIHZhbHVlLnRvU3RyaW5nKCkgPT09IHJlZ2V4cC50b1N0cmluZygpO1xuICAgIH1cblxuICAgIC8vIFJlZ2V4cHMgb25seSB3b3JrIGFnYWluc3Qgc3RyaW5ncy5cbiAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIFJlc2V0IHJlZ2V4cCdzIHN0YXRlIHRvIGF2b2lkIGluY29uc2lzdGVudCBtYXRjaGluZyBmb3Igb2JqZWN0cyB3aXRoIHRoZVxuICAgIC8vIHNhbWUgdmFsdWUgb24gY29uc2VjdXRpdmUgY2FsbHMgb2YgcmVnZXhwLnRlc3QuIFRoaXMgaGFwcGVucyBvbmx5IGlmIHRoZVxuICAgIC8vIHJlZ2V4cCBoYXMgdGhlICdnJyBmbGFnLiBBbHNvIG5vdGUgdGhhdCBFUzYgaW50cm9kdWNlcyBhIG5ldyBmbGFnICd5JyBmb3JcbiAgICAvLyB3aGljaCB3ZSBzaG91bGQgKm5vdCogY2hhbmdlIHRoZSBsYXN0SW5kZXggYnV0IE1vbmdvREIgZG9lc24ndCBzdXBwb3J0XG4gICAgLy8gZWl0aGVyIG9mIHRoZXNlIGZsYWdzLlxuICAgIHJlZ2V4cC5sYXN0SW5kZXggPSAwO1xuXG4gICAgcmV0dXJuIHJlZ2V4cC50ZXN0KHZhbHVlKTtcbiAgfTtcbn1cblxuLy8gVmFsaWRhdGVzIHRoZSBrZXkgaW4gYSBwYXRoLlxuLy8gT2JqZWN0cyB0aGF0IGFyZSBuZXN0ZWQgbW9yZSB0aGVuIDEgbGV2ZWwgY2Fubm90IGhhdmUgZG90dGVkIGZpZWxkc1xuLy8gb3IgZmllbGRzIHN0YXJ0aW5nIHdpdGggJyQnXG5mdW5jdGlvbiB2YWxpZGF0ZUtleUluUGF0aChrZXksIHBhdGgpIHtcbiAgaWYgKGtleS5pbmNsdWRlcygnLicpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYFRoZSBkb3R0ZWQgZmllbGQgJyR7a2V5fScgaW4gJyR7cGF0aH0uJHtrZXl9IGlzIG5vdCB2YWxpZCBmb3Igc3RvcmFnZS5gXG4gICAgKTtcbiAgfVxuXG4gIGlmIChrZXlbMF0gPT09ICckJykge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGBUaGUgZG9sbGFyICgkKSBwcmVmaXhlZCBmaWVsZCAgJyR7cGF0aH0uJHtrZXl9IGlzIG5vdCB2YWxpZCBmb3Igc3RvcmFnZS5gXG4gICAgKTtcbiAgfVxufVxuXG4vLyBSZWN1cnNpdmVseSB2YWxpZGF0ZXMgYW4gb2JqZWN0IHRoYXQgaXMgbmVzdGVkIG1vcmUgdGhhbiBvbmUgbGV2ZWwgZGVlcFxuZnVuY3Rpb24gdmFsaWRhdGVPYmplY3Qob2JqZWN0LCBwYXRoKSB7XG4gIGlmIChvYmplY3QgJiYgT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iamVjdCkgPT09IE9iamVjdC5wcm90b3R5cGUpIHtcbiAgICBPYmplY3Qua2V5cyhvYmplY3QpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgIHZhbGlkYXRlS2V5SW5QYXRoKGtleSwgcGF0aCk7XG4gICAgICB2YWxpZGF0ZU9iamVjdChvYmplY3Rba2V5XSwgcGF0aCArICcuJyArIGtleSk7XG4gICAgfSk7XG4gIH1cbn1cbiIsImltcG9ydCBMb2NhbENvbGxlY3Rpb24gZnJvbSAnLi9sb2NhbF9jb2xsZWN0aW9uLmpzJztcbmltcG9ydCB7IGhhc093biB9IGZyb20gJy4vY29tbW9uLmpzJztcblxuLy8gQ3Vyc29yOiBhIHNwZWNpZmljYXRpb24gZm9yIGEgcGFydGljdWxhciBzdWJzZXQgb2YgZG9jdW1lbnRzLCB3LyBhIGRlZmluZWRcbi8vIG9yZGVyLCBsaW1pdCwgYW5kIG9mZnNldC4gIGNyZWF0aW5nIGEgQ3Vyc29yIHdpdGggTG9jYWxDb2xsZWN0aW9uLmZpbmQoKSxcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEN1cnNvciB7XG4gIC8vIGRvbid0IGNhbGwgdGhpcyBjdG9yIGRpcmVjdGx5LiAgdXNlIExvY2FsQ29sbGVjdGlvbi5maW5kKCkuXG4gIGNvbnN0cnVjdG9yKGNvbGxlY3Rpb24sIHNlbGVjdG9yLCBvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLmNvbGxlY3Rpb24gPSBjb2xsZWN0aW9uO1xuICAgIHRoaXMuc29ydGVyID0gbnVsbDtcbiAgICB0aGlzLm1hdGNoZXIgPSBuZXcgTWluaW1vbmdvLk1hdGNoZXIoc2VsZWN0b3IpO1xuXG4gICAgaWYgKExvY2FsQ29sbGVjdGlvbi5fc2VsZWN0b3JJc0lkUGVyaGFwc0FzT2JqZWN0KHNlbGVjdG9yKSkge1xuICAgICAgLy8gc3Rhc2ggZm9yIGZhc3QgX2lkIGFuZCB7IF9pZCB9XG4gICAgICB0aGlzLl9zZWxlY3RvcklkID0gaGFzT3duLmNhbGwoc2VsZWN0b3IsICdfaWQnKVxuICAgICAgICA/IHNlbGVjdG9yLl9pZFxuICAgICAgICA6IHNlbGVjdG9yO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9zZWxlY3RvcklkID0gdW5kZWZpbmVkO1xuXG4gICAgICBpZiAodGhpcy5tYXRjaGVyLmhhc0dlb1F1ZXJ5KCkgfHwgb3B0aW9ucy5zb3J0KSB7XG4gICAgICAgIHRoaXMuc29ydGVyID0gbmV3IE1pbmltb25nby5Tb3J0ZXIob3B0aW9ucy5zb3J0IHx8IFtdKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnNraXAgPSBvcHRpb25zLnNraXAgfHwgMDtcbiAgICB0aGlzLmxpbWl0ID0gb3B0aW9ucy5saW1pdDtcbiAgICB0aGlzLmZpZWxkcyA9IG9wdGlvbnMuZmllbGRzO1xuXG4gICAgdGhpcy5fcHJvamVjdGlvbkZuID0gTG9jYWxDb2xsZWN0aW9uLl9jb21waWxlUHJvamVjdGlvbih0aGlzLmZpZWxkcyB8fCB7fSk7XG5cbiAgICB0aGlzLl90cmFuc2Zvcm0gPSBMb2NhbENvbGxlY3Rpb24ud3JhcFRyYW5zZm9ybShvcHRpb25zLnRyYW5zZm9ybSk7XG5cbiAgICAvLyBieSBkZWZhdWx0LCBxdWVyaWVzIHJlZ2lzdGVyIHcvIFRyYWNrZXIgd2hlbiBpdCBpcyBhdmFpbGFibGUuXG4gICAgaWYgKHR5cGVvZiBUcmFja2VyICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgdGhpcy5yZWFjdGl2ZSA9IG9wdGlvbnMucmVhY3RpdmUgPT09IHVuZGVmaW5lZCA/IHRydWUgOiBvcHRpb25zLnJlYWN0aXZlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAc3VtbWFyeSBSZXR1cm5zIHRoZSBudW1iZXIgb2YgZG9jdW1lbnRzIHRoYXQgbWF0Y2ggYSBxdWVyeS5cbiAgICogQG1lbWJlck9mIE1vbmdvLkN1cnNvclxuICAgKiBAbWV0aG9kICBjb3VudFxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IFthcHBseVNraXBMaW1pdD10cnVlXSBJZiBzZXQgdG8gYGZhbHNlYCwgdGhlIHZhbHVlXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm5lZCB3aWxsIHJlZmxlY3QgdGhlIHRvdGFsXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBudW1iZXIgb2YgbWF0Y2hpbmcgZG9jdW1lbnRzLFxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWdub3JpbmcgYW55IHZhbHVlIHN1cHBsaWVkIGZvclxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGltaXRcbiAgICogQGluc3RhbmNlXG4gICAqIEBsb2N1cyBBbnl3aGVyZVxuICAgKiBAcmV0dXJucyB7TnVtYmVyfVxuICAgKi9cbiAgY291bnQoYXBwbHlTa2lwTGltaXQgPSB0cnVlKSB7XG4gICAgaWYgKHRoaXMucmVhY3RpdmUpIHtcbiAgICAgIC8vIGFsbG93IHRoZSBvYnNlcnZlIHRvIGJlIHVub3JkZXJlZFxuICAgICAgdGhpcy5fZGVwZW5kKHthZGRlZDogdHJ1ZSwgcmVtb3ZlZDogdHJ1ZX0sIHRydWUpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9nZXRSYXdPYmplY3RzKHtcbiAgICAgIG9yZGVyZWQ6IHRydWUsXG4gICAgICBhcHBseVNraXBMaW1pdFxuICAgIH0pLmxlbmd0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAc3VtbWFyeSBSZXR1cm4gYWxsIG1hdGNoaW5nIGRvY3VtZW50cyBhcyBhbiBBcnJheS5cbiAgICogQG1lbWJlck9mIE1vbmdvLkN1cnNvclxuICAgKiBAbWV0aG9kICBmZXRjaFxuICAgKiBAaW5zdGFuY2VcbiAgICogQGxvY3VzIEFueXdoZXJlXG4gICAqIEByZXR1cm5zIHtPYmplY3RbXX1cbiAgICovXG4gIGZldGNoKCkge1xuICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xuXG4gICAgdGhpcy5mb3JFYWNoKGRvYyA9PiB7XG4gICAgICByZXN1bHQucHVzaChkb2MpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIFtTeW1ib2wuaXRlcmF0b3JdKCkge1xuICAgIGlmICh0aGlzLnJlYWN0aXZlKSB7XG4gICAgICB0aGlzLl9kZXBlbmQoe1xuICAgICAgICBhZGRlZEJlZm9yZTogdHJ1ZSxcbiAgICAgICAgcmVtb3ZlZDogdHJ1ZSxcbiAgICAgICAgY2hhbmdlZDogdHJ1ZSxcbiAgICAgICAgbW92ZWRCZWZvcmU6IHRydWV9KTtcbiAgICB9XG5cbiAgICBsZXQgaW5kZXggPSAwO1xuICAgIGNvbnN0IG9iamVjdHMgPSB0aGlzLl9nZXRSYXdPYmplY3RzKHtvcmRlcmVkOiB0cnVlfSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgbmV4dDogKCkgPT4ge1xuICAgICAgICBpZiAoaW5kZXggPCBvYmplY3RzLmxlbmd0aCkge1xuICAgICAgICAgIC8vIFRoaXMgZG91YmxlcyBhcyBhIGNsb25lIG9wZXJhdGlvbi5cbiAgICAgICAgICBsZXQgZWxlbWVudCA9IHRoaXMuX3Byb2plY3Rpb25GbihvYmplY3RzW2luZGV4KytdKTtcblxuICAgICAgICAgIGlmICh0aGlzLl90cmFuc2Zvcm0pXG4gICAgICAgICAgICBlbGVtZW50ID0gdGhpcy5fdHJhbnNmb3JtKGVsZW1lbnQpO1xuXG4gICAgICAgICAgcmV0dXJuIHt2YWx1ZTogZWxlbWVudH07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge2RvbmU6IHRydWV9O1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogQGNhbGxiYWNrIEl0ZXJhdGlvbkNhbGxiYWNrXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkb2NcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4XG4gICAqL1xuICAvKipcbiAgICogQHN1bW1hcnkgQ2FsbCBgY2FsbGJhY2tgIG9uY2UgZm9yIGVhY2ggbWF0Y2hpbmcgZG9jdW1lbnQsIHNlcXVlbnRpYWxseSBhbmRcbiAgICogICAgICAgICAgc3luY2hyb25vdXNseS5cbiAgICogQGxvY3VzIEFueXdoZXJlXG4gICAqIEBtZXRob2QgIGZvckVhY2hcbiAgICogQGluc3RhbmNlXG4gICAqIEBtZW1iZXJPZiBNb25nby5DdXJzb3JcbiAgICogQHBhcmFtIHtJdGVyYXRpb25DYWxsYmFja30gY2FsbGJhY2sgRnVuY3Rpb24gdG8gY2FsbC4gSXQgd2lsbCBiZSBjYWxsZWRcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2l0aCB0aHJlZSBhcmd1bWVudHM6IHRoZSBkb2N1bWVudCwgYVxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAwLWJhc2VkIGluZGV4LCBhbmQgPGVtPmN1cnNvcjwvZW0+XG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0c2VsZi5cbiAgICogQHBhcmFtIHtBbnl9IFt0aGlzQXJnXSBBbiBvYmplY3Qgd2hpY2ggd2lsbCBiZSB0aGUgdmFsdWUgb2YgYHRoaXNgIGluc2lkZVxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgIGBjYWxsYmFja2AuXG4gICAqL1xuICBmb3JFYWNoKGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgaWYgKHRoaXMucmVhY3RpdmUpIHtcbiAgICAgIHRoaXMuX2RlcGVuZCh7XG4gICAgICAgIGFkZGVkQmVmb3JlOiB0cnVlLFxuICAgICAgICByZW1vdmVkOiB0cnVlLFxuICAgICAgICBjaGFuZ2VkOiB0cnVlLFxuICAgICAgICBtb3ZlZEJlZm9yZTogdHJ1ZX0pO1xuICAgIH1cblxuICAgIHRoaXMuX2dldFJhd09iamVjdHMoe29yZGVyZWQ6IHRydWV9KS5mb3JFYWNoKChlbGVtZW50LCBpKSA9PiB7XG4gICAgICAvLyBUaGlzIGRvdWJsZXMgYXMgYSBjbG9uZSBvcGVyYXRpb24uXG4gICAgICBlbGVtZW50ID0gdGhpcy5fcHJvamVjdGlvbkZuKGVsZW1lbnQpO1xuXG4gICAgICBpZiAodGhpcy5fdHJhbnNmb3JtKSB7XG4gICAgICAgIGVsZW1lbnQgPSB0aGlzLl90cmFuc2Zvcm0oZWxlbWVudCk7XG4gICAgICB9XG5cbiAgICAgIGNhbGxiYWNrLmNhbGwodGhpc0FyZywgZWxlbWVudCwgaSwgdGhpcyk7XG4gICAgfSk7XG4gIH1cblxuICBnZXRUcmFuc2Zvcm0oKSB7XG4gICAgcmV0dXJuIHRoaXMuX3RyYW5zZm9ybTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAc3VtbWFyeSBNYXAgY2FsbGJhY2sgb3ZlciBhbGwgbWF0Y2hpbmcgZG9jdW1lbnRzLiAgUmV0dXJucyBhbiBBcnJheS5cbiAgICogQGxvY3VzIEFueXdoZXJlXG4gICAqIEBtZXRob2QgbWFwXG4gICAqIEBpbnN0YW5jZVxuICAgKiBAbWVtYmVyT2YgTW9uZ28uQ3Vyc29yXG4gICAqIEBwYXJhbSB7SXRlcmF0aW9uQ2FsbGJhY2t9IGNhbGxiYWNrIEZ1bmN0aW9uIHRvIGNhbGwuIEl0IHdpbGwgYmUgY2FsbGVkXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpdGggdGhyZWUgYXJndW1lbnRzOiB0aGUgZG9jdW1lbnQsIGFcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMC1iYXNlZCBpbmRleCwgYW5kIDxlbT5jdXJzb3I8L2VtPlxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdHNlbGYuXG4gICAqIEBwYXJhbSB7QW55fSBbdGhpc0FyZ10gQW4gb2JqZWN0IHdoaWNoIHdpbGwgYmUgdGhlIHZhbHVlIG9mIGB0aGlzYCBpbnNpZGVcbiAgICogICAgICAgICAgICAgICAgICAgICAgICBgY2FsbGJhY2tgLlxuICAgKi9cbiAgbWFwKGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gW107XG5cbiAgICB0aGlzLmZvckVhY2goKGRvYywgaSkgPT4ge1xuICAgICAgcmVzdWx0LnB1c2goY2FsbGJhY2suY2FsbCh0aGlzQXJnLCBkb2MsIGksIHRoaXMpKTtcbiAgICB9KTtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvLyBvcHRpb25zIHRvIGNvbnRhaW46XG4gIC8vICAqIGNhbGxiYWNrcyBmb3Igb2JzZXJ2ZSgpOlxuICAvLyAgICAtIGFkZGVkQXQgKGRvY3VtZW50LCBhdEluZGV4KVxuICAvLyAgICAtIGFkZGVkIChkb2N1bWVudClcbiAgLy8gICAgLSBjaGFuZ2VkQXQgKG5ld0RvY3VtZW50LCBvbGREb2N1bWVudCwgYXRJbmRleClcbiAgLy8gICAgLSBjaGFuZ2VkIChuZXdEb2N1bWVudCwgb2xkRG9jdW1lbnQpXG4gIC8vICAgIC0gcmVtb3ZlZEF0IChkb2N1bWVudCwgYXRJbmRleClcbiAgLy8gICAgLSByZW1vdmVkIChkb2N1bWVudClcbiAgLy8gICAgLSBtb3ZlZFRvIChkb2N1bWVudCwgb2xkSW5kZXgsIG5ld0luZGV4KVxuICAvL1xuICAvLyBhdHRyaWJ1dGVzIGF2YWlsYWJsZSBvbiByZXR1cm5lZCBxdWVyeSBoYW5kbGU6XG4gIC8vICAqIHN0b3AoKTogZW5kIHVwZGF0ZXNcbiAgLy8gICogY29sbGVjdGlvbjogdGhlIGNvbGxlY3Rpb24gdGhpcyBxdWVyeSBpcyBxdWVyeWluZ1xuICAvL1xuICAvLyBpZmYgeCBpcyBhIHJldHVybmVkIHF1ZXJ5IGhhbmRsZSwgKHggaW5zdGFuY2VvZlxuICAvLyBMb2NhbENvbGxlY3Rpb24uT2JzZXJ2ZUhhbmRsZSkgaXMgdHJ1ZVxuICAvL1xuICAvLyBpbml0aWFsIHJlc3VsdHMgZGVsaXZlcmVkIHRocm91Z2ggYWRkZWQgY2FsbGJhY2tcbiAgLy8gWFhYIG1heWJlIGNhbGxiYWNrcyBzaG91bGQgdGFrZSBhIGxpc3Qgb2Ygb2JqZWN0cywgdG8gZXhwb3NlIHRyYW5zYWN0aW9ucz9cbiAgLy8gWFhYIG1heWJlIHN1cHBvcnQgZmllbGQgbGltaXRpbmcgKHRvIGxpbWl0IHdoYXQgeW91J3JlIG5vdGlmaWVkIG9uKVxuXG4gIC8qKlxuICAgKiBAc3VtbWFyeSBXYXRjaCBhIHF1ZXJ5LiAgUmVjZWl2ZSBjYWxsYmFja3MgYXMgdGhlIHJlc3VsdCBzZXQgY2hhbmdlcy5cbiAgICogQGxvY3VzIEFueXdoZXJlXG4gICAqIEBtZW1iZXJPZiBNb25nby5DdXJzb3JcbiAgICogQGluc3RhbmNlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjYWxsYmFja3MgRnVuY3Rpb25zIHRvIGNhbGwgdG8gZGVsaXZlciB0aGUgcmVzdWx0IHNldCBhcyBpdFxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZXNcbiAgICovXG4gIG9ic2VydmUob3B0aW9ucykge1xuICAgIHJldHVybiBMb2NhbENvbGxlY3Rpb24uX29ic2VydmVGcm9tT2JzZXJ2ZUNoYW5nZXModGhpcywgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogQHN1bW1hcnkgV2F0Y2ggYSBxdWVyeS4gUmVjZWl2ZSBjYWxsYmFja3MgYXMgdGhlIHJlc3VsdCBzZXQgY2hhbmdlcy4gT25seVxuICAgKiAgICAgICAgICB0aGUgZGlmZmVyZW5jZXMgYmV0d2VlbiB0aGUgb2xkIGFuZCBuZXcgZG9jdW1lbnRzIGFyZSBwYXNzZWQgdG9cbiAgICogICAgICAgICAgdGhlIGNhbGxiYWNrcy5cbiAgICogQGxvY3VzIEFueXdoZXJlXG4gICAqIEBtZW1iZXJPZiBNb25nby5DdXJzb3JcbiAgICogQGluc3RhbmNlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjYWxsYmFja3MgRnVuY3Rpb25zIHRvIGNhbGwgdG8gZGVsaXZlciB0aGUgcmVzdWx0IHNldCBhcyBpdFxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZXNcbiAgICovXG4gIG9ic2VydmVDaGFuZ2VzKG9wdGlvbnMpIHtcbiAgICBjb25zdCBvcmRlcmVkID0gTG9jYWxDb2xsZWN0aW9uLl9vYnNlcnZlQ2hhbmdlc0NhbGxiYWNrc0FyZU9yZGVyZWQob3B0aW9ucyk7XG5cbiAgICAvLyB0aGVyZSBhcmUgc2V2ZXJhbCBwbGFjZXMgdGhhdCBhc3N1bWUgeW91IGFyZW4ndCBjb21iaW5pbmcgc2tpcC9saW1pdCB3aXRoXG4gICAgLy8gdW5vcmRlcmVkIG9ic2VydmUuICBlZywgdXBkYXRlJ3MgRUpTT04uY2xvbmUsIGFuZCB0aGUgXCJ0aGVyZSBhcmUgc2V2ZXJhbFwiXG4gICAgLy8gY29tbWVudCBpbiBfbW9kaWZ5QW5kTm90aWZ5XG4gICAgLy8gWFhYIGFsbG93IHNraXAvbGltaXQgd2l0aCB1bm9yZGVyZWQgb2JzZXJ2ZVxuICAgIGlmICghb3B0aW9ucy5fYWxsb3dfdW5vcmRlcmVkICYmICFvcmRlcmVkICYmICh0aGlzLnNraXAgfHwgdGhpcy5saW1pdCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgXCJNdXN0IHVzZSBhbiBvcmRlcmVkIG9ic2VydmUgd2l0aCBza2lwIG9yIGxpbWl0IChpLmUuICdhZGRlZEJlZm9yZScgXCIgK1xuICAgICAgICBcImZvciBvYnNlcnZlQ2hhbmdlcyBvciAnYWRkZWRBdCcgZm9yIG9ic2VydmUsIGluc3RlYWQgb2YgJ2FkZGVkJykuXCJcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZmllbGRzICYmICh0aGlzLmZpZWxkcy5faWQgPT09IDAgfHwgdGhpcy5maWVsZHMuX2lkID09PSBmYWxzZSkpIHtcbiAgICAgIHRocm93IEVycm9yKCdZb3UgbWF5IG5vdCBvYnNlcnZlIGEgY3Vyc29yIHdpdGgge2ZpZWxkczoge19pZDogMH19Jyk7XG4gICAgfVxuXG4gICAgY29uc3QgZGlzdGFuY2VzID0gKFxuICAgICAgdGhpcy5tYXRjaGVyLmhhc0dlb1F1ZXJ5KCkgJiZcbiAgICAgIG9yZGVyZWQgJiZcbiAgICAgIG5ldyBMb2NhbENvbGxlY3Rpb24uX0lkTWFwXG4gICAgKTtcblxuICAgIGNvbnN0IHF1ZXJ5ID0ge1xuICAgICAgY3Vyc29yOiB0aGlzLFxuICAgICAgZGlydHk6IGZhbHNlLFxuICAgICAgZGlzdGFuY2VzLFxuICAgICAgbWF0Y2hlcjogdGhpcy5tYXRjaGVyLCAvLyBub3QgZmFzdCBwYXRoZWRcbiAgICAgIG9yZGVyZWQsXG4gICAgICBwcm9qZWN0aW9uRm46IHRoaXMuX3Byb2plY3Rpb25GbixcbiAgICAgIHJlc3VsdHNTbmFwc2hvdDogbnVsbCxcbiAgICAgIHNvcnRlcjogb3JkZXJlZCAmJiB0aGlzLnNvcnRlclxuICAgIH07XG5cbiAgICBsZXQgcWlkO1xuXG4gICAgLy8gTm9uLXJlYWN0aXZlIHF1ZXJpZXMgY2FsbCBhZGRlZFtCZWZvcmVdIGFuZCB0aGVuIG5ldmVyIGNhbGwgYW55dGhpbmdcbiAgICAvLyBlbHNlLlxuICAgIGlmICh0aGlzLnJlYWN0aXZlKSB7XG4gICAgICBxaWQgPSB0aGlzLmNvbGxlY3Rpb24ubmV4dF9xaWQrKztcbiAgICAgIHRoaXMuY29sbGVjdGlvbi5xdWVyaWVzW3FpZF0gPSBxdWVyeTtcbiAgICB9XG5cbiAgICBxdWVyeS5yZXN1bHRzID0gdGhpcy5fZ2V0UmF3T2JqZWN0cyh7b3JkZXJlZCwgZGlzdGFuY2VzOiBxdWVyeS5kaXN0YW5jZXN9KTtcblxuICAgIGlmICh0aGlzLmNvbGxlY3Rpb24ucGF1c2VkKSB7XG4gICAgICBxdWVyeS5yZXN1bHRzU25hcHNob3QgPSBvcmRlcmVkID8gW10gOiBuZXcgTG9jYWxDb2xsZWN0aW9uLl9JZE1hcDtcbiAgICB9XG5cbiAgICAvLyB3cmFwIGNhbGxiYWNrcyB3ZSB3ZXJlIHBhc3NlZC4gY2FsbGJhY2tzIG9ubHkgZmlyZSB3aGVuIG5vdCBwYXVzZWQgYW5kXG4gICAgLy8gYXJlIG5ldmVyIHVuZGVmaW5lZFxuICAgIC8vIEZpbHRlcnMgb3V0IGJsYWNrbGlzdGVkIGZpZWxkcyBhY2NvcmRpbmcgdG8gY3Vyc29yJ3MgcHJvamVjdGlvbi5cbiAgICAvLyBYWFggd3JvbmcgcGxhY2UgZm9yIHRoaXM/XG5cbiAgICAvLyBmdXJ0aGVybW9yZSwgY2FsbGJhY2tzIGVucXVldWUgdW50aWwgdGhlIG9wZXJhdGlvbiB3ZSdyZSB3b3JraW5nIG9uIGlzXG4gICAgLy8gZG9uZS5cbiAgICBjb25zdCB3cmFwQ2FsbGJhY2sgPSBmbiA9PiB7XG4gICAgICBpZiAoIWZuKSB7XG4gICAgICAgIHJldHVybiAoKSA9PiB7fTtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oLyogYXJncyovKSB7XG4gICAgICAgIGlmIChzZWxmLmNvbGxlY3Rpb24ucGF1c2VkKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgYXJncyA9IGFyZ3VtZW50cztcblxuICAgICAgICBzZWxmLmNvbGxlY3Rpb24uX29ic2VydmVRdWV1ZS5xdWV1ZVRhc2soKCkgPT4ge1xuICAgICAgICAgIGZuLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgfTtcblxuICAgIHF1ZXJ5LmFkZGVkID0gd3JhcENhbGxiYWNrKG9wdGlvbnMuYWRkZWQpO1xuICAgIHF1ZXJ5LmNoYW5nZWQgPSB3cmFwQ2FsbGJhY2sob3B0aW9ucy5jaGFuZ2VkKTtcbiAgICBxdWVyeS5yZW1vdmVkID0gd3JhcENhbGxiYWNrKG9wdGlvbnMucmVtb3ZlZCk7XG5cbiAgICBpZiAob3JkZXJlZCkge1xuICAgICAgcXVlcnkuYWRkZWRCZWZvcmUgPSB3cmFwQ2FsbGJhY2sob3B0aW9ucy5hZGRlZEJlZm9yZSk7XG4gICAgICBxdWVyeS5tb3ZlZEJlZm9yZSA9IHdyYXBDYWxsYmFjayhvcHRpb25zLm1vdmVkQmVmb3JlKTtcbiAgICB9XG5cbiAgICBpZiAoIW9wdGlvbnMuX3N1cHByZXNzX2luaXRpYWwgJiYgIXRoaXMuY29sbGVjdGlvbi5wYXVzZWQpIHtcbiAgICAgIHF1ZXJ5LnJlc3VsdHMuZm9yRWFjaChkb2MgPT4ge1xuICAgICAgICBjb25zdCBmaWVsZHMgPSBFSlNPTi5jbG9uZShkb2MpO1xuXG4gICAgICAgIGRlbGV0ZSBmaWVsZHMuX2lkO1xuXG4gICAgICAgIGlmIChvcmRlcmVkKSB7XG4gICAgICAgICAgcXVlcnkuYWRkZWRCZWZvcmUoZG9jLl9pZCwgdGhpcy5fcHJvamVjdGlvbkZuKGZpZWxkcyksIG51bGwpO1xuICAgICAgICB9XG5cbiAgICAgICAgcXVlcnkuYWRkZWQoZG9jLl9pZCwgdGhpcy5fcHJvamVjdGlvbkZuKGZpZWxkcykpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgaGFuZGxlID0gT2JqZWN0LmFzc2lnbihuZXcgTG9jYWxDb2xsZWN0aW9uLk9ic2VydmVIYW5kbGUsIHtcbiAgICAgIGNvbGxlY3Rpb246IHRoaXMuY29sbGVjdGlvbixcbiAgICAgIHN0b3A6ICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMucmVhY3RpdmUpIHtcbiAgICAgICAgICBkZWxldGUgdGhpcy5jb2xsZWN0aW9uLnF1ZXJpZXNbcWlkXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMucmVhY3RpdmUgJiYgVHJhY2tlci5hY3RpdmUpIHtcbiAgICAgIC8vIFhYWCBpbiBtYW55IGNhc2VzLCB0aGUgc2FtZSBvYnNlcnZlIHdpbGwgYmUgcmVjcmVhdGVkIHdoZW5cbiAgICAgIC8vIHRoZSBjdXJyZW50IGF1dG9ydW4gaXMgcmVydW4uICB3ZSBjb3VsZCBzYXZlIHdvcmsgYnlcbiAgICAgIC8vIGxldHRpbmcgaXQgbGluZ2VyIGFjcm9zcyByZXJ1biBhbmQgcG90ZW50aWFsbHkgZ2V0XG4gICAgICAvLyByZXB1cnBvc2VkIGlmIHRoZSBzYW1lIG9ic2VydmUgaXMgcGVyZm9ybWVkLCB1c2luZyBsb2dpY1xuICAgICAgLy8gc2ltaWxhciB0byB0aGF0IG9mIE1ldGVvci5zdWJzY3JpYmUuXG4gICAgICBUcmFja2VyLm9uSW52YWxpZGF0ZSgoKSA9PiB7XG4gICAgICAgIGhhbmRsZS5zdG9wKCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBydW4gdGhlIG9ic2VydmUgY2FsbGJhY2tzIHJlc3VsdGluZyBmcm9tIHRoZSBpbml0aWFsIGNvbnRlbnRzXG4gICAgLy8gYmVmb3JlIHdlIGxlYXZlIHRoZSBvYnNlcnZlLlxuICAgIHRoaXMuY29sbGVjdGlvbi5fb2JzZXJ2ZVF1ZXVlLmRyYWluKCk7XG5cbiAgICByZXR1cm4gaGFuZGxlO1xuICB9XG5cbiAgLy8gU2luY2Ugd2UgZG9uJ3QgYWN0dWFsbHkgaGF2ZSBhIFwibmV4dE9iamVjdFwiIGludGVyZmFjZSwgdGhlcmUncyByZWFsbHkgbm9cbiAgLy8gcmVhc29uIHRvIGhhdmUgYSBcInJld2luZFwiIGludGVyZmFjZS4gIEFsbCBpdCBkaWQgd2FzIG1ha2UgbXVsdGlwbGUgY2FsbHNcbiAgLy8gdG8gZmV0Y2gvbWFwL2ZvckVhY2ggcmV0dXJuIG5vdGhpbmcgdGhlIHNlY29uZCB0aW1lLlxuICAvLyBYWFggQ09NUEFUIFdJVEggMC44LjFcbiAgcmV3aW5kKCkge31cblxuICAvLyBYWFggTWF5YmUgd2UgbmVlZCBhIHZlcnNpb24gb2Ygb2JzZXJ2ZSB0aGF0IGp1c3QgY2FsbHMgYSBjYWxsYmFjayBpZlxuICAvLyBhbnl0aGluZyBjaGFuZ2VkLlxuICBfZGVwZW5kKGNoYW5nZXJzLCBfYWxsb3dfdW5vcmRlcmVkKSB7XG4gICAgaWYgKFRyYWNrZXIuYWN0aXZlKSB7XG4gICAgICBjb25zdCBkZXBlbmRlbmN5ID0gbmV3IFRyYWNrZXIuRGVwZW5kZW5jeTtcbiAgICAgIGNvbnN0IG5vdGlmeSA9IGRlcGVuZGVuY3kuY2hhbmdlZC5iaW5kKGRlcGVuZGVuY3kpO1xuXG4gICAgICBkZXBlbmRlbmN5LmRlcGVuZCgpO1xuXG4gICAgICBjb25zdCBvcHRpb25zID0ge19hbGxvd191bm9yZGVyZWQsIF9zdXBwcmVzc19pbml0aWFsOiB0cnVlfTtcblxuICAgICAgWydhZGRlZCcsICdhZGRlZEJlZm9yZScsICdjaGFuZ2VkJywgJ21vdmVkQmVmb3JlJywgJ3JlbW92ZWQnXVxuICAgICAgICAuZm9yRWFjaChmbiA9PiB7XG4gICAgICAgICAgaWYgKGNoYW5nZXJzW2ZuXSkge1xuICAgICAgICAgICAgb3B0aW9uc1tmbl0gPSBub3RpZnk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgLy8gb2JzZXJ2ZUNoYW5nZXMgd2lsbCBzdG9wKCkgd2hlbiB0aGlzIGNvbXB1dGF0aW9uIGlzIGludmFsaWRhdGVkXG4gICAgICB0aGlzLm9ic2VydmVDaGFuZ2VzKG9wdGlvbnMpO1xuICAgIH1cbiAgfVxuXG4gIF9nZXRDb2xsZWN0aW9uTmFtZSgpIHtcbiAgICByZXR1cm4gdGhpcy5jb2xsZWN0aW9uLm5hbWU7XG4gIH1cblxuICAvLyBSZXR1cm5zIGEgY29sbGVjdGlvbiBvZiBtYXRjaGluZyBvYmplY3RzLCBidXQgZG9lc24ndCBkZWVwIGNvcHkgdGhlbS5cbiAgLy9cbiAgLy8gSWYgb3JkZXJlZCBpcyBzZXQsIHJldHVybnMgYSBzb3J0ZWQgYXJyYXksIHJlc3BlY3Rpbmcgc29ydGVyLCBza2lwLCBhbmRcbiAgLy8gbGltaXQgcHJvcGVydGllcyBvZiB0aGUgcXVlcnkgcHJvdmlkZWQgdGhhdCBvcHRpb25zLmFwcGx5U2tpcExpbWl0IGlzXG4gIC8vIG5vdCBzZXQgdG8gZmFsc2UgKCMxMjAxKS4gSWYgc29ydGVyIGlzIGZhbHNleSwgbm8gc29ydCAtLSB5b3UgZ2V0IHRoZVxuICAvLyBuYXR1cmFsIG9yZGVyLlxuICAvL1xuICAvLyBJZiBvcmRlcmVkIGlzIG5vdCBzZXQsIHJldHVybnMgYW4gb2JqZWN0IG1hcHBpbmcgZnJvbSBJRCB0byBkb2MgKHNvcnRlcixcbiAgLy8gc2tpcCBhbmQgbGltaXQgc2hvdWxkIG5vdCBiZSBzZXQpLlxuICAvL1xuICAvLyBJZiBvcmRlcmVkIGlzIHNldCBhbmQgdGhpcyBjdXJzb3IgaXMgYSAkbmVhciBnZW9xdWVyeSwgdGhlbiB0aGlzIGZ1bmN0aW9uXG4gIC8vIHdpbGwgdXNlIGFuIF9JZE1hcCB0byB0cmFjayBlYWNoIGRpc3RhbmNlIGZyb20gdGhlICRuZWFyIGFyZ3VtZW50IHBvaW50IGluXG4gIC8vIG9yZGVyIHRvIHVzZSBpdCBhcyBhIHNvcnQga2V5LiBJZiBhbiBfSWRNYXAgaXMgcGFzc2VkIGluIHRoZSAnZGlzdGFuY2VzJ1xuICAvLyBhcmd1bWVudCwgdGhpcyBmdW5jdGlvbiB3aWxsIGNsZWFyIGl0IGFuZCB1c2UgaXQgZm9yIHRoaXMgcHVycG9zZVxuICAvLyAob3RoZXJ3aXNlIGl0IHdpbGwganVzdCBjcmVhdGUgaXRzIG93biBfSWRNYXApLiBUaGUgb2JzZXJ2ZUNoYW5nZXNcbiAgLy8gaW1wbGVtZW50YXRpb24gdXNlcyB0aGlzIHRvIHJlbWVtYmVyIHRoZSBkaXN0YW5jZXMgYWZ0ZXIgdGhpcyBmdW5jdGlvblxuICAvLyByZXR1cm5zLlxuICBfZ2V0UmF3T2JqZWN0cyhvcHRpb25zID0ge30pIHtcbiAgICAvLyBCeSBkZWZhdWx0IHRoaXMgbWV0aG9kIHdpbGwgcmVzcGVjdCBza2lwIGFuZCBsaW1pdCBiZWNhdXNlIC5mZXRjaCgpLFxuICAgIC8vIC5mb3JFYWNoKCkgZXRjLi4uIGV4cGVjdCB0aGlzIGJlaGF2aW91ci4gSXQgY2FuIGJlIGZvcmNlZCB0byBpZ25vcmVcbiAgICAvLyBza2lwIGFuZCBsaW1pdCBieSBzZXR0aW5nIGFwcGx5U2tpcExpbWl0IHRvIGZhbHNlICguY291bnQoKSBkb2VzIHRoaXMsXG4gICAgLy8gZm9yIGV4YW1wbGUpXG4gICAgY29uc3QgYXBwbHlTa2lwTGltaXQgPSBvcHRpb25zLmFwcGx5U2tpcExpbWl0ICE9PSBmYWxzZTtcblxuICAgIC8vIFhYWCB1c2UgT3JkZXJlZERpY3QgaW5zdGVhZCBvZiBhcnJheSwgYW5kIG1ha2UgSWRNYXAgYW5kIE9yZGVyZWREaWN0XG4gICAgLy8gY29tcGF0aWJsZVxuICAgIGNvbnN0IHJlc3VsdHMgPSBvcHRpb25zLm9yZGVyZWQgPyBbXSA6IG5ldyBMb2NhbENvbGxlY3Rpb24uX0lkTWFwO1xuXG4gICAgLy8gZmFzdCBwYXRoIGZvciBzaW5nbGUgSUQgdmFsdWVcbiAgICBpZiAodGhpcy5fc2VsZWN0b3JJZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBJZiB5b3UgaGF2ZSBub24temVybyBza2lwIGFuZCBhc2sgZm9yIGEgc2luZ2xlIGlkLCB5b3UgZ2V0IG5vdGhpbmcuXG4gICAgICAvLyBUaGlzIGlzIHNvIGl0IG1hdGNoZXMgdGhlIGJlaGF2aW9yIG9mIHRoZSAne19pZDogZm9vfScgcGF0aC5cbiAgICAgIGlmIChhcHBseVNraXBMaW1pdCAmJiB0aGlzLnNraXApIHtcbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHNlbGVjdGVkRG9jID0gdGhpcy5jb2xsZWN0aW9uLl9kb2NzLmdldCh0aGlzLl9zZWxlY3RvcklkKTtcblxuICAgICAgaWYgKHNlbGVjdGVkRG9jKSB7XG4gICAgICAgIGlmIChvcHRpb25zLm9yZGVyZWQpIHtcbiAgICAgICAgICByZXN1bHRzLnB1c2goc2VsZWN0ZWREb2MpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdHMuc2V0KHRoaXMuX3NlbGVjdG9ySWQsIHNlbGVjdGVkRG9jKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9XG5cbiAgICAvLyBzbG93IHBhdGggZm9yIGFyYml0cmFyeSBzZWxlY3Rvciwgc29ydCwgc2tpcCwgbGltaXRcblxuICAgIC8vIGluIHRoZSBvYnNlcnZlQ2hhbmdlcyBjYXNlLCBkaXN0YW5jZXMgaXMgYWN0dWFsbHkgcGFydCBvZiB0aGUgXCJxdWVyeVwiXG4gICAgLy8gKGllLCBsaXZlIHJlc3VsdHMgc2V0KSBvYmplY3QuICBpbiBvdGhlciBjYXNlcywgZGlzdGFuY2VzIGlzIG9ubHkgdXNlZFxuICAgIC8vIGluc2lkZSB0aGlzIGZ1bmN0aW9uLlxuICAgIGxldCBkaXN0YW5jZXM7XG4gICAgaWYgKHRoaXMubWF0Y2hlci5oYXNHZW9RdWVyeSgpICYmIG9wdGlvbnMub3JkZXJlZCkge1xuICAgICAgaWYgKG9wdGlvbnMuZGlzdGFuY2VzKSB7XG4gICAgICAgIGRpc3RhbmNlcyA9IG9wdGlvbnMuZGlzdGFuY2VzO1xuICAgICAgICBkaXN0YW5jZXMuY2xlYXIoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRpc3RhbmNlcyA9IG5ldyBMb2NhbENvbGxlY3Rpb24uX0lkTWFwKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5jb2xsZWN0aW9uLl9kb2NzLmZvckVhY2goKGRvYywgaWQpID0+IHtcbiAgICAgIGNvbnN0IG1hdGNoUmVzdWx0ID0gdGhpcy5tYXRjaGVyLmRvY3VtZW50TWF0Y2hlcyhkb2MpO1xuXG4gICAgICBpZiAobWF0Y2hSZXN1bHQucmVzdWx0KSB7XG4gICAgICAgIGlmIChvcHRpb25zLm9yZGVyZWQpIHtcbiAgICAgICAgICByZXN1bHRzLnB1c2goZG9jKTtcblxuICAgICAgICAgIGlmIChkaXN0YW5jZXMgJiYgbWF0Y2hSZXN1bHQuZGlzdGFuY2UgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgZGlzdGFuY2VzLnNldChpZCwgbWF0Y2hSZXN1bHQuZGlzdGFuY2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXN1bHRzLnNldChpZCwgZG9jKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBPdmVycmlkZSB0byBlbnN1cmUgYWxsIGRvY3MgYXJlIG1hdGNoZWQgaWYgaWdub3Jpbmcgc2tpcCAmIGxpbWl0XG4gICAgICBpZiAoIWFwcGx5U2tpcExpbWl0KSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBGYXN0IHBhdGggZm9yIGxpbWl0ZWQgdW5zb3J0ZWQgcXVlcmllcy5cbiAgICAgIC8vIFhYWCAnbGVuZ3RoJyBjaGVjayBoZXJlIHNlZW1zIHdyb25nIGZvciBvcmRlcmVkXG4gICAgICByZXR1cm4gKFxuICAgICAgICAhdGhpcy5saW1pdCB8fFxuICAgICAgICB0aGlzLnNraXAgfHxcbiAgICAgICAgdGhpcy5zb3J0ZXIgfHxcbiAgICAgICAgcmVzdWx0cy5sZW5ndGggIT09IHRoaXMubGltaXRcbiAgICAgICk7XG4gICAgfSk7XG5cbiAgICBpZiAoIW9wdGlvbnMub3JkZXJlZCkge1xuICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc29ydGVyKSB7XG4gICAgICByZXN1bHRzLnNvcnQodGhpcy5zb3J0ZXIuZ2V0Q29tcGFyYXRvcih7ZGlzdGFuY2VzfSkpO1xuICAgIH1cblxuICAgIC8vIFJldHVybiB0aGUgZnVsbCBzZXQgb2YgcmVzdWx0cyBpZiB0aGVyZSBpcyBubyBza2lwIG9yIGxpbWl0IG9yIGlmIHdlJ3JlXG4gICAgLy8gaWdub3JpbmcgdGhlbVxuICAgIGlmICghYXBwbHlTa2lwTGltaXQgfHwgKCF0aGlzLmxpbWl0ICYmICF0aGlzLnNraXApKSB7XG4gICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0cy5zbGljZShcbiAgICAgIHRoaXMuc2tpcCxcbiAgICAgIHRoaXMubGltaXQgPyB0aGlzLmxpbWl0ICsgdGhpcy5za2lwIDogcmVzdWx0cy5sZW5ndGhcbiAgICApO1xuICB9XG5cbiAgX3B1Ymxpc2hDdXJzb3Ioc3Vic2NyaXB0aW9uKSB7XG4gICAgLy8gWFhYIG1pbmltb25nbyBzaG91bGQgbm90IGRlcGVuZCBvbiBtb25nby1saXZlZGF0YSFcbiAgICBpZiAoIVBhY2thZ2UubW9uZ28pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ0NhblxcJ3QgcHVibGlzaCBmcm9tIE1pbmltb25nbyB3aXRob3V0IHRoZSBgbW9uZ29gIHBhY2thZ2UuJ1xuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuY29sbGVjdGlvbi5uYW1lKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdDYW5cXCd0IHB1Ymxpc2ggYSBjdXJzb3IgZnJvbSBhIGNvbGxlY3Rpb24gd2l0aG91dCBhIG5hbWUuJ1xuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gUGFja2FnZS5tb25nby5Nb25nby5Db2xsZWN0aW9uLl9wdWJsaXNoQ3Vyc29yKFxuICAgICAgdGhpcyxcbiAgICAgIHN1YnNjcmlwdGlvbixcbiAgICAgIHRoaXMuY29sbGVjdGlvbi5uYW1lXG4gICAgKTtcbiAgfVxufVxuIiwiaW1wb3J0IEN1cnNvciBmcm9tICcuL2N1cnNvci5qcyc7XG5pbXBvcnQgT2JzZXJ2ZUhhbmRsZSBmcm9tICcuL29ic2VydmVfaGFuZGxlLmpzJztcbmltcG9ydCB7XG4gIGhhc093bixcbiAgaXNJbmRleGFibGUsXG4gIGlzTnVtZXJpY0tleSxcbiAgaXNPcGVyYXRvck9iamVjdCxcbiAgcG9wdWxhdGVEb2N1bWVudFdpdGhRdWVyeUZpZWxkcyxcbiAgcHJvamVjdGlvbkRldGFpbHMsXG59IGZyb20gJy4vY29tbW9uLmpzJztcblxuLy8gWFhYIHR5cGUgY2hlY2tpbmcgb24gc2VsZWN0b3JzIChncmFjZWZ1bCBlcnJvciBpZiBtYWxmb3JtZWQpXG5cbi8vIExvY2FsQ29sbGVjdGlvbjogYSBzZXQgb2YgZG9jdW1lbnRzIHRoYXQgc3VwcG9ydHMgcXVlcmllcyBhbmQgbW9kaWZpZXJzLlxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9jYWxDb2xsZWN0aW9uIHtcbiAgY29uc3RydWN0b3IobmFtZSkge1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgLy8gX2lkIC0+IGRvY3VtZW50IChhbHNvIGNvbnRhaW5pbmcgaWQpXG4gICAgdGhpcy5fZG9jcyA9IG5ldyBMb2NhbENvbGxlY3Rpb24uX0lkTWFwO1xuXG4gICAgdGhpcy5fb2JzZXJ2ZVF1ZXVlID0gbmV3IE1ldGVvci5fU3luY2hyb25vdXNRdWV1ZSgpO1xuXG4gICAgdGhpcy5uZXh0X3FpZCA9IDE7IC8vIGxpdmUgcXVlcnkgaWQgZ2VuZXJhdG9yXG5cbiAgICAvLyBxaWQgLT4gbGl2ZSBxdWVyeSBvYmplY3QuIGtleXM6XG4gICAgLy8gIG9yZGVyZWQ6IGJvb2wuIG9yZGVyZWQgcXVlcmllcyBoYXZlIGFkZGVkQmVmb3JlL21vdmVkQmVmb3JlIGNhbGxiYWNrcy5cbiAgICAvLyAgcmVzdWx0czogYXJyYXkgKG9yZGVyZWQpIG9yIG9iamVjdCAodW5vcmRlcmVkKSBvZiBjdXJyZW50IHJlc3VsdHNcbiAgICAvLyAgICAoYWxpYXNlZCB3aXRoIHRoaXMuX2RvY3MhKVxuICAgIC8vICByZXN1bHRzU25hcHNob3Q6IHNuYXBzaG90IG9mIHJlc3VsdHMuIG51bGwgaWYgbm90IHBhdXNlZC5cbiAgICAvLyAgY3Vyc29yOiBDdXJzb3Igb2JqZWN0IGZvciB0aGUgcXVlcnkuXG4gICAgLy8gIHNlbGVjdG9yLCBzb3J0ZXIsIChjYWxsYmFja3MpOiBmdW5jdGlvbnNcbiAgICB0aGlzLnF1ZXJpZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG4gICAgLy8gbnVsbCBpZiBub3Qgc2F2aW5nIG9yaWdpbmFsczsgYW4gSWRNYXAgZnJvbSBpZCB0byBvcmlnaW5hbCBkb2N1bWVudCB2YWx1ZVxuICAgIC8vIGlmIHNhdmluZyBvcmlnaW5hbHMuIFNlZSBjb21tZW50cyBiZWZvcmUgc2F2ZU9yaWdpbmFscygpLlxuICAgIHRoaXMuX3NhdmVkT3JpZ2luYWxzID0gbnVsbDtcblxuICAgIC8vIFRydWUgd2hlbiBvYnNlcnZlcnMgYXJlIHBhdXNlZCBhbmQgd2Ugc2hvdWxkIG5vdCBzZW5kIGNhbGxiYWNrcy5cbiAgICB0aGlzLnBhdXNlZCA9IGZhbHNlO1xuICB9XG5cbiAgLy8gb3B0aW9ucyBtYXkgaW5jbHVkZSBzb3J0LCBza2lwLCBsaW1pdCwgcmVhY3RpdmVcbiAgLy8gc29ydCBtYXkgYmUgYW55IG9mIHRoZXNlIGZvcm1zOlxuICAvLyAgICAge2E6IDEsIGI6IC0xfVxuICAvLyAgICAgW1tcImFcIiwgXCJhc2NcIl0sIFtcImJcIiwgXCJkZXNjXCJdXVxuICAvLyAgICAgW1wiYVwiLCBbXCJiXCIsIFwiZGVzY1wiXV1cbiAgLy8gICAoaW4gdGhlIGZpcnN0IGZvcm0geW91J3JlIGJlaG9sZGVuIHRvIGtleSBlbnVtZXJhdGlvbiBvcmRlciBpblxuICAvLyAgIHlvdXIgamF2YXNjcmlwdCBWTSlcbiAgLy9cbiAgLy8gcmVhY3RpdmU6IGlmIGdpdmVuLCBhbmQgZmFsc2UsIGRvbid0IHJlZ2lzdGVyIHdpdGggVHJhY2tlciAoZGVmYXVsdFxuICAvLyBpcyB0cnVlKVxuICAvL1xuICAvLyBYWFggcG9zc2libHkgc2hvdWxkIHN1cHBvcnQgcmV0cmlldmluZyBhIHN1YnNldCBvZiBmaWVsZHM/IGFuZFxuICAvLyBoYXZlIGl0IGJlIGEgaGludCAoaWdub3JlZCBvbiB0aGUgY2xpZW50LCB3aGVuIG5vdCBjb3B5aW5nIHRoZVxuICAvLyBkb2M/KVxuICAvL1xuICAvLyBYWFggc29ydCBkb2VzIG5vdCB5ZXQgc3VwcG9ydCBzdWJrZXlzICgnYS5iJykgLi4gZml4IHRoYXQhXG4gIC8vIFhYWCBhZGQgb25lIG1vcmUgc29ydCBmb3JtOiBcImtleVwiXG4gIC8vIFhYWCB0ZXN0c1xuICBmaW5kKHNlbGVjdG9yLCBvcHRpb25zKSB7XG4gICAgLy8gZGVmYXVsdCBzeW50YXggZm9yIGV2ZXJ5dGhpbmcgaXMgdG8gb21pdCB0aGUgc2VsZWN0b3IgYXJndW1lbnQuXG4gICAgLy8gYnV0IGlmIHNlbGVjdG9yIGlzIGV4cGxpY2l0bHkgcGFzc2VkIGluIGFzIGZhbHNlIG9yIHVuZGVmaW5lZCwgd2VcbiAgICAvLyB3YW50IGEgc2VsZWN0b3IgdGhhdCBtYXRjaGVzIG5vdGhpbmcuXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgIHNlbGVjdG9yID0ge307XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBMb2NhbENvbGxlY3Rpb24uQ3Vyc29yKHRoaXMsIHNlbGVjdG9yLCBvcHRpb25zKTtcbiAgfVxuXG4gIGZpbmRPbmUoc2VsZWN0b3IsIG9wdGlvbnMgPSB7fSkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICBzZWxlY3RvciA9IHt9O1xuICAgIH1cblxuICAgIC8vIE5PVEU6IGJ5IHNldHRpbmcgbGltaXQgMSBoZXJlLCB3ZSBlbmQgdXAgdXNpbmcgdmVyeSBpbmVmZmljaWVudFxuICAgIC8vIGNvZGUgdGhhdCByZWNvbXB1dGVzIHRoZSB3aG9sZSBxdWVyeSBvbiBlYWNoIHVwZGF0ZS4gVGhlIHVwc2lkZSBpc1xuICAgIC8vIHRoYXQgd2hlbiB5b3UgcmVhY3RpdmVseSBkZXBlbmQgb24gYSBmaW5kT25lIHlvdSBvbmx5IGdldFxuICAgIC8vIGludmFsaWRhdGVkIHdoZW4gdGhlIGZvdW5kIG9iamVjdCBjaGFuZ2VzLCBub3QgYW55IG9iamVjdCBpbiB0aGVcbiAgICAvLyBjb2xsZWN0aW9uLiBNb3N0IGZpbmRPbmUgd2lsbCBiZSBieSBpZCwgd2hpY2ggaGFzIGEgZmFzdCBwYXRoLCBzb1xuICAgIC8vIHRoaXMgbWlnaHQgbm90IGJlIGEgYmlnIGRlYWwuIEluIG1vc3QgY2FzZXMsIGludmFsaWRhdGlvbiBjYXVzZXNcbiAgICAvLyB0aGUgY2FsbGVkIHRvIHJlLXF1ZXJ5IGFueXdheSwgc28gdGhpcyBzaG91bGQgYmUgYSBuZXQgcGVyZm9ybWFuY2VcbiAgICAvLyBpbXByb3ZlbWVudC5cbiAgICBvcHRpb25zLmxpbWl0ID0gMTtcblxuICAgIHJldHVybiB0aGlzLmZpbmQoc2VsZWN0b3IsIG9wdGlvbnMpLmZldGNoKClbMF07XG4gIH1cblxuICAvLyBYWFggcG9zc2libHkgZW5mb3JjZSB0aGF0ICd1bmRlZmluZWQnIGRvZXMgbm90IGFwcGVhciAod2UgYXNzdW1lXG4gIC8vIHRoaXMgaW4gb3VyIGhhbmRsaW5nIG9mIG51bGwgYW5kICRleGlzdHMpXG4gIGluc2VydChkb2MsIGNhbGxiYWNrKSB7XG4gICAgZG9jID0gRUpTT04uY2xvbmUoZG9jKTtcblxuICAgIGFzc2VydEhhc1ZhbGlkRmllbGROYW1lcyhkb2MpO1xuXG4gICAgLy8gaWYgeW91IHJlYWxseSB3YW50IHRvIHVzZSBPYmplY3RJRHMsIHNldCB0aGlzIGdsb2JhbC5cbiAgICAvLyBNb25nby5Db2xsZWN0aW9uIHNwZWNpZmllcyBpdHMgb3duIGlkcyBhbmQgZG9lcyBub3QgdXNlIHRoaXMgY29kZS5cbiAgICBpZiAoIWhhc093bi5jYWxsKGRvYywgJ19pZCcpKSB7XG4gICAgICBkb2MuX2lkID0gTG9jYWxDb2xsZWN0aW9uLl91c2VPSUQgPyBuZXcgTW9uZ29JRC5PYmplY3RJRCgpIDogUmFuZG9tLmlkKCk7XG4gICAgfVxuXG4gICAgY29uc3QgaWQgPSBkb2MuX2lkO1xuXG4gICAgaWYgKHRoaXMuX2RvY3MuaGFzKGlkKSkge1xuICAgICAgdGhyb3cgTWluaW1vbmdvRXJyb3IoYER1cGxpY2F0ZSBfaWQgJyR7aWR9J2ApO1xuICAgIH1cblxuICAgIHRoaXMuX3NhdmVPcmlnaW5hbChpZCwgdW5kZWZpbmVkKTtcbiAgICB0aGlzLl9kb2NzLnNldChpZCwgZG9jKTtcblxuICAgIGNvbnN0IHF1ZXJpZXNUb1JlY29tcHV0ZSA9IFtdO1xuXG4gICAgLy8gdHJpZ2dlciBsaXZlIHF1ZXJpZXMgdGhhdCBtYXRjaFxuICAgIE9iamVjdC5rZXlzKHRoaXMucXVlcmllcykuZm9yRWFjaChxaWQgPT4ge1xuICAgICAgY29uc3QgcXVlcnkgPSB0aGlzLnF1ZXJpZXNbcWlkXTtcblxuICAgICAgaWYgKHF1ZXJ5LmRpcnR5KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbWF0Y2hSZXN1bHQgPSBxdWVyeS5tYXRjaGVyLmRvY3VtZW50TWF0Y2hlcyhkb2MpO1xuXG4gICAgICBpZiAobWF0Y2hSZXN1bHQucmVzdWx0KSB7XG4gICAgICAgIGlmIChxdWVyeS5kaXN0YW5jZXMgJiYgbWF0Y2hSZXN1bHQuZGlzdGFuY2UgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHF1ZXJ5LmRpc3RhbmNlcy5zZXQoaWQsIG1hdGNoUmVzdWx0LmRpc3RhbmNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChxdWVyeS5jdXJzb3Iuc2tpcCB8fCBxdWVyeS5jdXJzb3IubGltaXQpIHtcbiAgICAgICAgICBxdWVyaWVzVG9SZWNvbXB1dGUucHVzaChxaWQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIExvY2FsQ29sbGVjdGlvbi5faW5zZXJ0SW5SZXN1bHRzKHF1ZXJ5LCBkb2MpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBxdWVyaWVzVG9SZWNvbXB1dGUuZm9yRWFjaChxaWQgPT4ge1xuICAgICAgaWYgKHRoaXMucXVlcmllc1txaWRdKSB7XG4gICAgICAgIHRoaXMuX3JlY29tcHV0ZVJlc3VsdHModGhpcy5xdWVyaWVzW3FpZF0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5fb2JzZXJ2ZVF1ZXVlLmRyYWluKCk7XG5cbiAgICAvLyBEZWZlciBiZWNhdXNlIHRoZSBjYWxsZXIgbGlrZWx5IGRvZXNuJ3QgZXhwZWN0IHRoZSBjYWxsYmFjayB0byBiZSBydW5cbiAgICAvLyBpbW1lZGlhdGVseS5cbiAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgIE1ldGVvci5kZWZlcigoKSA9PiB7XG4gICAgICAgIGNhbGxiYWNrKG51bGwsIGlkKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBpZDtcbiAgfVxuXG4gIC8vIFBhdXNlIHRoZSBvYnNlcnZlcnMuIE5vIGNhbGxiYWNrcyBmcm9tIG9ic2VydmVycyB3aWxsIGZpcmUgdW50aWxcbiAgLy8gJ3Jlc3VtZU9ic2VydmVycycgaXMgY2FsbGVkLlxuICBwYXVzZU9ic2VydmVycygpIHtcbiAgICAvLyBOby1vcCBpZiBhbHJlYWR5IHBhdXNlZC5cbiAgICBpZiAodGhpcy5wYXVzZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBTZXQgdGhlICdwYXVzZWQnIGZsYWcgc3VjaCB0aGF0IG5ldyBvYnNlcnZlciBtZXNzYWdlcyBkb24ndCBmaXJlLlxuICAgIHRoaXMucGF1c2VkID0gdHJ1ZTtcblxuICAgIC8vIFRha2UgYSBzbmFwc2hvdCBvZiB0aGUgcXVlcnkgcmVzdWx0cyBmb3IgZWFjaCBxdWVyeS5cbiAgICBPYmplY3Qua2V5cyh0aGlzLnF1ZXJpZXMpLmZvckVhY2gocWlkID0+IHtcbiAgICAgIGNvbnN0IHF1ZXJ5ID0gdGhpcy5xdWVyaWVzW3FpZF07XG4gICAgICBxdWVyeS5yZXN1bHRzU25hcHNob3QgPSBFSlNPTi5jbG9uZShxdWVyeS5yZXN1bHRzKTtcbiAgICB9KTtcbiAgfVxuXG4gIHJlbW92ZShzZWxlY3RvciwgY2FsbGJhY2spIHtcbiAgICAvLyBFYXN5IHNwZWNpYWwgY2FzZTogaWYgd2UncmUgbm90IGNhbGxpbmcgb2JzZXJ2ZUNoYW5nZXMgY2FsbGJhY2tzIGFuZFxuICAgIC8vIHdlJ3JlIG5vdCBzYXZpbmcgb3JpZ2luYWxzIGFuZCB3ZSBnb3QgYXNrZWQgdG8gcmVtb3ZlIGV2ZXJ5dGhpbmcsIHRoZW5cbiAgICAvLyBqdXN0IGVtcHR5IGV2ZXJ5dGhpbmcgZGlyZWN0bHkuXG4gICAgaWYgKHRoaXMucGF1c2VkICYmICF0aGlzLl9zYXZlZE9yaWdpbmFscyAmJiBFSlNPTi5lcXVhbHMoc2VsZWN0b3IsIHt9KSkge1xuICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy5fZG9jcy5zaXplKCk7XG5cbiAgICAgIHRoaXMuX2RvY3MuY2xlYXIoKTtcblxuICAgICAgT2JqZWN0LmtleXModGhpcy5xdWVyaWVzKS5mb3JFYWNoKHFpZCA9PiB7XG4gICAgICAgIGNvbnN0IHF1ZXJ5ID0gdGhpcy5xdWVyaWVzW3FpZF07XG5cbiAgICAgICAgaWYgKHF1ZXJ5Lm9yZGVyZWQpIHtcbiAgICAgICAgICBxdWVyeS5yZXN1bHRzID0gW107XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcXVlcnkucmVzdWx0cy5jbGVhcigpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgIE1ldGVvci5kZWZlcigoKSA9PiB7XG4gICAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzdWx0KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgY29uc3QgbWF0Y2hlciA9IG5ldyBNaW5pbW9uZ28uTWF0Y2hlcihzZWxlY3Rvcik7XG4gICAgY29uc3QgcmVtb3ZlID0gW107XG5cbiAgICB0aGlzLl9lYWNoUG9zc2libHlNYXRjaGluZ0RvYyhzZWxlY3RvciwgKGRvYywgaWQpID0+IHtcbiAgICAgIGlmIChtYXRjaGVyLmRvY3VtZW50TWF0Y2hlcyhkb2MpLnJlc3VsdCkge1xuICAgICAgICByZW1vdmUucHVzaChpZCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCBxdWVyaWVzVG9SZWNvbXB1dGUgPSBbXTtcbiAgICBjb25zdCBxdWVyeVJlbW92ZSA9IFtdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZW1vdmUubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHJlbW92ZUlkID0gcmVtb3ZlW2ldO1xuICAgICAgY29uc3QgcmVtb3ZlRG9jID0gdGhpcy5fZG9jcy5nZXQocmVtb3ZlSWQpO1xuXG4gICAgICBPYmplY3Qua2V5cyh0aGlzLnF1ZXJpZXMpLmZvckVhY2gocWlkID0+IHtcbiAgICAgICAgY29uc3QgcXVlcnkgPSB0aGlzLnF1ZXJpZXNbcWlkXTtcblxuICAgICAgICBpZiAocXVlcnkuZGlydHkpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocXVlcnkubWF0Y2hlci5kb2N1bWVudE1hdGNoZXMocmVtb3ZlRG9jKS5yZXN1bHQpIHtcbiAgICAgICAgICBpZiAocXVlcnkuY3Vyc29yLnNraXAgfHwgcXVlcnkuY3Vyc29yLmxpbWl0KSB7XG4gICAgICAgICAgICBxdWVyaWVzVG9SZWNvbXB1dGUucHVzaChxaWQpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBxdWVyeVJlbW92ZS5wdXNoKHtxaWQsIGRvYzogcmVtb3ZlRG9jfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5fc2F2ZU9yaWdpbmFsKHJlbW92ZUlkLCByZW1vdmVEb2MpO1xuICAgICAgdGhpcy5fZG9jcy5yZW1vdmUocmVtb3ZlSWQpO1xuICAgIH1cblxuICAgIC8vIHJ1biBsaXZlIHF1ZXJ5IGNhbGxiYWNrcyBfYWZ0ZXJfIHdlJ3ZlIHJlbW92ZWQgdGhlIGRvY3VtZW50cy5cbiAgICBxdWVyeVJlbW92ZS5mb3JFYWNoKHJlbW92ZSA9PiB7XG4gICAgICBjb25zdCBxdWVyeSA9IHRoaXMucXVlcmllc1tyZW1vdmUucWlkXTtcblxuICAgICAgaWYgKHF1ZXJ5KSB7XG4gICAgICAgIHF1ZXJ5LmRpc3RhbmNlcyAmJiBxdWVyeS5kaXN0YW5jZXMucmVtb3ZlKHJlbW92ZS5kb2MuX2lkKTtcbiAgICAgICAgTG9jYWxDb2xsZWN0aW9uLl9yZW1vdmVGcm9tUmVzdWx0cyhxdWVyeSwgcmVtb3ZlLmRvYyk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBxdWVyaWVzVG9SZWNvbXB1dGUuZm9yRWFjaChxaWQgPT4ge1xuICAgICAgY29uc3QgcXVlcnkgPSB0aGlzLnF1ZXJpZXNbcWlkXTtcblxuICAgICAgaWYgKHF1ZXJ5KSB7XG4gICAgICAgIHRoaXMuX3JlY29tcHV0ZVJlc3VsdHMocXVlcnkpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5fb2JzZXJ2ZVF1ZXVlLmRyYWluKCk7XG5cbiAgICBjb25zdCByZXN1bHQgPSByZW1vdmUubGVuZ3RoO1xuXG4gICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICBNZXRlb3IuZGVmZXIoKCkgPT4ge1xuICAgICAgICBjYWxsYmFjayhudWxsLCByZXN1bHQpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8vIFJlc3VtZSB0aGUgb2JzZXJ2ZXJzLiBPYnNlcnZlcnMgaW1tZWRpYXRlbHkgcmVjZWl2ZSBjaGFuZ2VcbiAgLy8gbm90aWZpY2F0aW9ucyB0byBicmluZyB0aGVtIHRvIHRoZSBjdXJyZW50IHN0YXRlIG9mIHRoZVxuICAvLyBkYXRhYmFzZS4gTm90ZSB0aGF0IHRoaXMgaXMgbm90IGp1c3QgcmVwbGF5aW5nIGFsbCB0aGUgY2hhbmdlcyB0aGF0XG4gIC8vIGhhcHBlbmVkIGR1cmluZyB0aGUgcGF1c2UsIGl0IGlzIGEgc21hcnRlciAnY29hbGVzY2VkJyBkaWZmLlxuICByZXN1bWVPYnNlcnZlcnMoKSB7XG4gICAgLy8gTm8tb3AgaWYgbm90IHBhdXNlZC5cbiAgICBpZiAoIXRoaXMucGF1c2VkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gVW5zZXQgdGhlICdwYXVzZWQnIGZsYWcuIE1ha2Ugc3VyZSB0byBkbyB0aGlzIGZpcnN0LCBvdGhlcndpc2VcbiAgICAvLyBvYnNlcnZlciBtZXRob2RzIHdvbid0IGFjdHVhbGx5IGZpcmUgd2hlbiB3ZSB0cmlnZ2VyIHRoZW0uXG4gICAgdGhpcy5wYXVzZWQgPSBmYWxzZTtcblxuICAgIE9iamVjdC5rZXlzKHRoaXMucXVlcmllcykuZm9yRWFjaChxaWQgPT4ge1xuICAgICAgY29uc3QgcXVlcnkgPSB0aGlzLnF1ZXJpZXNbcWlkXTtcblxuICAgICAgaWYgKHF1ZXJ5LmRpcnR5KSB7XG4gICAgICAgIHF1ZXJ5LmRpcnR5ID0gZmFsc2U7XG5cbiAgICAgICAgLy8gcmUtY29tcHV0ZSByZXN1bHRzIHdpbGwgcGVyZm9ybSBgTG9jYWxDb2xsZWN0aW9uLl9kaWZmUXVlcnlDaGFuZ2VzYFxuICAgICAgICAvLyBhdXRvbWF0aWNhbGx5LlxuICAgICAgICB0aGlzLl9yZWNvbXB1dGVSZXN1bHRzKHF1ZXJ5LCBxdWVyeS5yZXN1bHRzU25hcHNob3QpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gRGlmZiB0aGUgY3VycmVudCByZXN1bHRzIGFnYWluc3QgdGhlIHNuYXBzaG90IGFuZCBzZW5kIHRvIG9ic2VydmVycy5cbiAgICAgICAgLy8gcGFzcyB0aGUgcXVlcnkgb2JqZWN0IGZvciBpdHMgb2JzZXJ2ZXIgY2FsbGJhY2tzLlxuICAgICAgICBMb2NhbENvbGxlY3Rpb24uX2RpZmZRdWVyeUNoYW5nZXMoXG4gICAgICAgICAgcXVlcnkub3JkZXJlZCxcbiAgICAgICAgICBxdWVyeS5yZXN1bHRzU25hcHNob3QsXG4gICAgICAgICAgcXVlcnkucmVzdWx0cyxcbiAgICAgICAgICBxdWVyeSxcbiAgICAgICAgICB7cHJvamVjdGlvbkZuOiBxdWVyeS5wcm9qZWN0aW9uRm59XG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIHF1ZXJ5LnJlc3VsdHNTbmFwc2hvdCA9IG51bGw7XG4gICAgfSk7XG5cbiAgICB0aGlzLl9vYnNlcnZlUXVldWUuZHJhaW4oKTtcbiAgfVxuXG4gIHJldHJpZXZlT3JpZ2luYWxzKCkge1xuICAgIGlmICghdGhpcy5fc2F2ZWRPcmlnaW5hbHMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2FsbGVkIHJldHJpZXZlT3JpZ2luYWxzIHdpdGhvdXQgc2F2ZU9yaWdpbmFscycpO1xuICAgIH1cblxuICAgIGNvbnN0IG9yaWdpbmFscyA9IHRoaXMuX3NhdmVkT3JpZ2luYWxzO1xuXG4gICAgdGhpcy5fc2F2ZWRPcmlnaW5hbHMgPSBudWxsO1xuXG4gICAgcmV0dXJuIG9yaWdpbmFscztcbiAgfVxuXG4gIC8vIFRvIHRyYWNrIHdoYXQgZG9jdW1lbnRzIGFyZSBhZmZlY3RlZCBieSBhIHBpZWNlIG9mIGNvZGUsIGNhbGxcbiAgLy8gc2F2ZU9yaWdpbmFscygpIGJlZm9yZSBpdCBhbmQgcmV0cmlldmVPcmlnaW5hbHMoKSBhZnRlciBpdC5cbiAgLy8gcmV0cmlldmVPcmlnaW5hbHMgcmV0dXJucyBhbiBvYmplY3Qgd2hvc2Uga2V5cyBhcmUgdGhlIGlkcyBvZiB0aGUgZG9jdW1lbnRzXG4gIC8vIHRoYXQgd2VyZSBhZmZlY3RlZCBzaW5jZSB0aGUgY2FsbCB0byBzYXZlT3JpZ2luYWxzKCksIGFuZCB0aGUgdmFsdWVzIGFyZVxuICAvLyBlcXVhbCB0byB0aGUgZG9jdW1lbnQncyBjb250ZW50cyBhdCB0aGUgdGltZSBvZiBzYXZlT3JpZ2luYWxzLiAoSW4gdGhlIGNhc2VcbiAgLy8gb2YgYW4gaW5zZXJ0ZWQgZG9jdW1lbnQsIHVuZGVmaW5lZCBpcyB0aGUgdmFsdWUuKSBZb3UgbXVzdCBhbHRlcm5hdGVcbiAgLy8gYmV0d2VlbiBjYWxscyB0byBzYXZlT3JpZ2luYWxzKCkgYW5kIHJldHJpZXZlT3JpZ2luYWxzKCkuXG4gIHNhdmVPcmlnaW5hbHMoKSB7XG4gICAgaWYgKHRoaXMuX3NhdmVkT3JpZ2luYWxzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NhbGxlZCBzYXZlT3JpZ2luYWxzIHR3aWNlIHdpdGhvdXQgcmV0cmlldmVPcmlnaW5hbHMnKTtcbiAgICB9XG5cbiAgICB0aGlzLl9zYXZlZE9yaWdpbmFscyA9IG5ldyBMb2NhbENvbGxlY3Rpb24uX0lkTWFwO1xuICB9XG5cbiAgLy8gWFhYIGF0b21pY2l0eTogaWYgbXVsdGkgaXMgdHJ1ZSwgYW5kIG9uZSBtb2RpZmljYXRpb24gZmFpbHMsIGRvXG4gIC8vIHdlIHJvbGxiYWNrIHRoZSB3aG9sZSBvcGVyYXRpb24sIG9yIHdoYXQ/XG4gIHVwZGF0ZShzZWxlY3RvciwgbW9kLCBvcHRpb25zLCBjYWxsYmFjaykge1xuICAgIGlmICghIGNhbGxiYWNrICYmIG9wdGlvbnMgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuICAgICAgY2FsbGJhY2sgPSBvcHRpb25zO1xuICAgICAgb3B0aW9ucyA9IG51bGw7XG4gICAgfVxuXG4gICAgaWYgKCFvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0ge307XG4gICAgfVxuXG4gICAgY29uc3QgbWF0Y2hlciA9IG5ldyBNaW5pbW9uZ28uTWF0Y2hlcihzZWxlY3RvciwgdHJ1ZSk7XG5cbiAgICAvLyBTYXZlIHRoZSBvcmlnaW5hbCByZXN1bHRzIG9mIGFueSBxdWVyeSB0aGF0IHdlIG1pZ2h0IG5lZWQgdG9cbiAgICAvLyBfcmVjb21wdXRlUmVzdWx0cyBvbiwgYmVjYXVzZSBfbW9kaWZ5QW5kTm90aWZ5IHdpbGwgbXV0YXRlIHRoZSBvYmplY3RzIGluXG4gICAgLy8gaXQuIChXZSBkb24ndCBuZWVkIHRvIHNhdmUgdGhlIG9yaWdpbmFsIHJlc3VsdHMgb2YgcGF1c2VkIHF1ZXJpZXMgYmVjYXVzZVxuICAgIC8vIHRoZXkgYWxyZWFkeSBoYXZlIGEgcmVzdWx0c1NuYXBzaG90IGFuZCB3ZSB3b24ndCBiZSBkaWZmaW5nIGluXG4gICAgLy8gX3JlY29tcHV0ZVJlc3VsdHMuKVxuICAgIGNvbnN0IHFpZFRvT3JpZ2luYWxSZXN1bHRzID0ge307XG5cbiAgICAvLyBXZSBzaG91bGQgb25seSBjbG9uZSBlYWNoIGRvY3VtZW50IG9uY2UsIGV2ZW4gaWYgaXQgYXBwZWFycyBpbiBtdWx0aXBsZVxuICAgIC8vIHF1ZXJpZXNcbiAgICBjb25zdCBkb2NNYXAgPSBuZXcgTG9jYWxDb2xsZWN0aW9uLl9JZE1hcDtcbiAgICBjb25zdCBpZHNNYXRjaGVkID0gTG9jYWxDb2xsZWN0aW9uLl9pZHNNYXRjaGVkQnlTZWxlY3RvcihzZWxlY3Rvcik7XG5cbiAgICBPYmplY3Qua2V5cyh0aGlzLnF1ZXJpZXMpLmZvckVhY2gocWlkID0+IHtcbiAgICAgIGNvbnN0IHF1ZXJ5ID0gdGhpcy5xdWVyaWVzW3FpZF07XG5cbiAgICAgIGlmICgocXVlcnkuY3Vyc29yLnNraXAgfHwgcXVlcnkuY3Vyc29yLmxpbWl0KSAmJiAhIHRoaXMucGF1c2VkKSB7XG4gICAgICAgIC8vIENhdGNoIHRoZSBjYXNlIG9mIGEgcmVhY3RpdmUgYGNvdW50KClgIG9uIGEgY3Vyc29yIHdpdGggc2tpcFxuICAgICAgICAvLyBvciBsaW1pdCwgd2hpY2ggcmVnaXN0ZXJzIGFuIHVub3JkZXJlZCBvYnNlcnZlLiBUaGlzIGlzIGFcbiAgICAgICAgLy8gcHJldHR5IHJhcmUgY2FzZSwgc28gd2UganVzdCBjbG9uZSB0aGUgZW50aXJlIHJlc3VsdCBzZXQgd2l0aFxuICAgICAgICAvLyBubyBvcHRpbWl6YXRpb25zIGZvciBkb2N1bWVudHMgdGhhdCBhcHBlYXIgaW4gdGhlc2UgcmVzdWx0XG4gICAgICAgIC8vIHNldHMgYW5kIG90aGVyIHF1ZXJpZXMuXG4gICAgICAgIGlmIChxdWVyeS5yZXN1bHRzIGluc3RhbmNlb2YgTG9jYWxDb2xsZWN0aW9uLl9JZE1hcCkge1xuICAgICAgICAgIHFpZFRvT3JpZ2luYWxSZXN1bHRzW3FpZF0gPSBxdWVyeS5yZXN1bHRzLmNsb25lKCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCEocXVlcnkucmVzdWx0cyBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQXNzZXJ0aW9uIGZhaWxlZDogcXVlcnkucmVzdWx0cyBub3QgYW4gYXJyYXknKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENsb25lcyBhIGRvY3VtZW50IHRvIGJlIHN0b3JlZCBpbiBgcWlkVG9PcmlnaW5hbFJlc3VsdHNgXG4gICAgICAgIC8vIGJlY2F1c2UgaXQgbWF5IGJlIG1vZGlmaWVkIGJlZm9yZSB0aGUgbmV3IGFuZCBvbGQgcmVzdWx0IHNldHNcbiAgICAgICAgLy8gYXJlIGRpZmZlZC4gQnV0IGlmIHdlIGtub3cgZXhhY3RseSB3aGljaCBkb2N1bWVudCBJRHMgd2UncmVcbiAgICAgICAgLy8gZ29pbmcgdG8gbW9kaWZ5LCB0aGVuIHdlIG9ubHkgbmVlZCB0byBjbG9uZSB0aG9zZS5cbiAgICAgICAgY29uc3QgbWVtb2l6ZWRDbG9uZUlmTmVlZGVkID0gZG9jID0+IHtcbiAgICAgICAgICBpZiAoZG9jTWFwLmhhcyhkb2MuX2lkKSkge1xuICAgICAgICAgICAgcmV0dXJuIGRvY01hcC5nZXQoZG9jLl9pZCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29uc3QgZG9jVG9NZW1vaXplID0gKFxuICAgICAgICAgICAgaWRzTWF0Y2hlZCAmJlxuICAgICAgICAgICAgIWlkc01hdGNoZWQuc29tZShpZCA9PiBFSlNPTi5lcXVhbHMoaWQsIGRvYy5faWQpKVxuICAgICAgICAgICkgPyBkb2MgOiBFSlNPTi5jbG9uZShkb2MpO1xuXG4gICAgICAgICAgZG9jTWFwLnNldChkb2MuX2lkLCBkb2NUb01lbW9pemUpO1xuXG4gICAgICAgICAgcmV0dXJuIGRvY1RvTWVtb2l6ZTtcbiAgICAgICAgfTtcblxuICAgICAgICBxaWRUb09yaWdpbmFsUmVzdWx0c1txaWRdID0gcXVlcnkucmVzdWx0cy5tYXAobWVtb2l6ZWRDbG9uZUlmTmVlZGVkKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnN0IHJlY29tcHV0ZVFpZHMgPSB7fTtcblxuICAgIGxldCB1cGRhdGVDb3VudCA9IDA7XG5cbiAgICB0aGlzLl9lYWNoUG9zc2libHlNYXRjaGluZ0RvYyhzZWxlY3RvciwgKGRvYywgaWQpID0+IHtcbiAgICAgIGNvbnN0IHF1ZXJ5UmVzdWx0ID0gbWF0Y2hlci5kb2N1bWVudE1hdGNoZXMoZG9jKTtcblxuICAgICAgaWYgKHF1ZXJ5UmVzdWx0LnJlc3VsdCkge1xuICAgICAgICAvLyBYWFggU2hvdWxkIHdlIHNhdmUgdGhlIG9yaWdpbmFsIGV2ZW4gaWYgbW9kIGVuZHMgdXAgYmVpbmcgYSBuby1vcD9cbiAgICAgICAgdGhpcy5fc2F2ZU9yaWdpbmFsKGlkLCBkb2MpO1xuICAgICAgICB0aGlzLl9tb2RpZnlBbmROb3RpZnkoXG4gICAgICAgICAgZG9jLFxuICAgICAgICAgIG1vZCxcbiAgICAgICAgICByZWNvbXB1dGVRaWRzLFxuICAgICAgICAgIHF1ZXJ5UmVzdWx0LmFycmF5SW5kaWNlc1xuICAgICAgICApO1xuXG4gICAgICAgICsrdXBkYXRlQ291bnQ7XG5cbiAgICAgICAgaWYgKCFvcHRpb25zLm11bHRpKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlOyAvLyBicmVha1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0pO1xuXG4gICAgT2JqZWN0LmtleXMocmVjb21wdXRlUWlkcykuZm9yRWFjaChxaWQgPT4ge1xuICAgICAgY29uc3QgcXVlcnkgPSB0aGlzLnF1ZXJpZXNbcWlkXTtcblxuICAgICAgaWYgKHF1ZXJ5KSB7XG4gICAgICAgIHRoaXMuX3JlY29tcHV0ZVJlc3VsdHMocXVlcnksIHFpZFRvT3JpZ2luYWxSZXN1bHRzW3FpZF0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5fb2JzZXJ2ZVF1ZXVlLmRyYWluKCk7XG5cbiAgICAvLyBJZiB3ZSBhcmUgZG9pbmcgYW4gdXBzZXJ0LCBhbmQgd2UgZGlkbid0IG1vZGlmeSBhbnkgZG9jdW1lbnRzIHlldCwgdGhlblxuICAgIC8vIGl0J3MgdGltZSB0byBkbyBhbiBpbnNlcnQuIEZpZ3VyZSBvdXQgd2hhdCBkb2N1bWVudCB3ZSBhcmUgaW5zZXJ0aW5nLCBhbmRcbiAgICAvLyBnZW5lcmF0ZSBhbiBpZCBmb3IgaXQuXG4gICAgbGV0IGluc2VydGVkSWQ7XG4gICAgaWYgKHVwZGF0ZUNvdW50ID09PSAwICYmIG9wdGlvbnMudXBzZXJ0KSB7XG4gICAgICBjb25zdCBkb2MgPSBMb2NhbENvbGxlY3Rpb24uX2NyZWF0ZVVwc2VydERvY3VtZW50KHNlbGVjdG9yLCBtb2QpO1xuICAgICAgaWYgKCEgZG9jLl9pZCAmJiBvcHRpb25zLmluc2VydGVkSWQpIHtcbiAgICAgICAgZG9jLl9pZCA9IG9wdGlvbnMuaW5zZXJ0ZWRJZDtcbiAgICAgIH1cblxuICAgICAgaW5zZXJ0ZWRJZCA9IHRoaXMuaW5zZXJ0KGRvYyk7XG4gICAgICB1cGRhdGVDb3VudCA9IDE7XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIHRoZSBudW1iZXIgb2YgYWZmZWN0ZWQgZG9jdW1lbnRzLCBvciBpbiB0aGUgdXBzZXJ0IGNhc2UsIGFuIG9iamVjdFxuICAgIC8vIGNvbnRhaW5pbmcgdGhlIG51bWJlciBvZiBhZmZlY3RlZCBkb2NzIGFuZCB0aGUgaWQgb2YgdGhlIGRvYyB0aGF0IHdhc1xuICAgIC8vIGluc2VydGVkLCBpZiBhbnkuXG4gICAgbGV0IHJlc3VsdDtcbiAgICBpZiAob3B0aW9ucy5fcmV0dXJuT2JqZWN0KSB7XG4gICAgICByZXN1bHQgPSB7bnVtYmVyQWZmZWN0ZWQ6IHVwZGF0ZUNvdW50fTtcblxuICAgICAgaWYgKGluc2VydGVkSWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXN1bHQuaW5zZXJ0ZWRJZCA9IGluc2VydGVkSWQ7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdCA9IHVwZGF0ZUNvdW50O1xuICAgIH1cblxuICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgTWV0ZW9yLmRlZmVyKCgpID0+IHtcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzdWx0KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvLyBBIGNvbnZlbmllbmNlIHdyYXBwZXIgb24gdXBkYXRlLiBMb2NhbENvbGxlY3Rpb24udXBzZXJ0KHNlbCwgbW9kKSBpc1xuICAvLyBlcXVpdmFsZW50IHRvIExvY2FsQ29sbGVjdGlvbi51cGRhdGUoc2VsLCBtb2QsIHt1cHNlcnQ6IHRydWUsXG4gIC8vIF9yZXR1cm5PYmplY3Q6IHRydWV9KS5cbiAgdXBzZXJ0KHNlbGVjdG9yLCBtb2QsIG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gICAgaWYgKCFjYWxsYmFjayAmJiB0eXBlb2Ygb3B0aW9ucyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY2FsbGJhY2sgPSBvcHRpb25zO1xuICAgICAgb3B0aW9ucyA9IHt9O1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnVwZGF0ZShcbiAgICAgIHNlbGVjdG9yLFxuICAgICAgbW9kLFxuICAgICAgT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucywge3Vwc2VydDogdHJ1ZSwgX3JldHVybk9iamVjdDogdHJ1ZX0pLFxuICAgICAgY2FsbGJhY2tcbiAgICApO1xuICB9XG5cbiAgLy8gSXRlcmF0ZXMgb3ZlciBhIHN1YnNldCBvZiBkb2N1bWVudHMgdGhhdCBjb3VsZCBtYXRjaCBzZWxlY3RvcjsgY2FsbHNcbiAgLy8gZm4oZG9jLCBpZCkgb24gZWFjaCBvZiB0aGVtLiAgU3BlY2lmaWNhbGx5LCBpZiBzZWxlY3RvciBzcGVjaWZpZXNcbiAgLy8gc3BlY2lmaWMgX2lkJ3MsIGl0IG9ubHkgbG9va3MgYXQgdGhvc2UuICBkb2MgaXMgKm5vdCogY2xvbmVkOiBpdCBpcyB0aGVcbiAgLy8gc2FtZSBvYmplY3QgdGhhdCBpcyBpbiBfZG9jcy5cbiAgX2VhY2hQb3NzaWJseU1hdGNoaW5nRG9jKHNlbGVjdG9yLCBmbikge1xuICAgIGNvbnN0IHNwZWNpZmljSWRzID0gTG9jYWxDb2xsZWN0aW9uLl9pZHNNYXRjaGVkQnlTZWxlY3RvcihzZWxlY3Rvcik7XG5cbiAgICBpZiAoc3BlY2lmaWNJZHMpIHtcbiAgICAgIHNwZWNpZmljSWRzLnNvbWUoaWQgPT4ge1xuICAgICAgICBjb25zdCBkb2MgPSB0aGlzLl9kb2NzLmdldChpZCk7XG5cbiAgICAgICAgaWYgKGRvYykge1xuICAgICAgICAgIHJldHVybiBmbihkb2MsIGlkKSA9PT0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9kb2NzLmZvckVhY2goZm4pO1xuICAgIH1cbiAgfVxuXG4gIF9tb2RpZnlBbmROb3RpZnkoZG9jLCBtb2QsIHJlY29tcHV0ZVFpZHMsIGFycmF5SW5kaWNlcykge1xuICAgIGNvbnN0IG1hdGNoZWRfYmVmb3JlID0ge307XG5cbiAgICBPYmplY3Qua2V5cyh0aGlzLnF1ZXJpZXMpLmZvckVhY2gocWlkID0+IHtcbiAgICAgIGNvbnN0IHF1ZXJ5ID0gdGhpcy5xdWVyaWVzW3FpZF07XG5cbiAgICAgIGlmIChxdWVyeS5kaXJ0eSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChxdWVyeS5vcmRlcmVkKSB7XG4gICAgICAgIG1hdGNoZWRfYmVmb3JlW3FpZF0gPSBxdWVyeS5tYXRjaGVyLmRvY3VtZW50TWF0Y2hlcyhkb2MpLnJlc3VsdDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEJlY2F1c2Ugd2UgZG9uJ3Qgc3VwcG9ydCBza2lwIG9yIGxpbWl0ICh5ZXQpIGluIHVub3JkZXJlZCBxdWVyaWVzLCB3ZVxuICAgICAgICAvLyBjYW4ganVzdCBkbyBhIGRpcmVjdCBsb29rdXAuXG4gICAgICAgIG1hdGNoZWRfYmVmb3JlW3FpZF0gPSBxdWVyeS5yZXN1bHRzLmhhcyhkb2MuX2lkKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnN0IG9sZF9kb2MgPSBFSlNPTi5jbG9uZShkb2MpO1xuXG4gICAgTG9jYWxDb2xsZWN0aW9uLl9tb2RpZnkoZG9jLCBtb2QsIHthcnJheUluZGljZXN9KTtcblxuICAgIE9iamVjdC5rZXlzKHRoaXMucXVlcmllcykuZm9yRWFjaChxaWQgPT4ge1xuICAgICAgY29uc3QgcXVlcnkgPSB0aGlzLnF1ZXJpZXNbcWlkXTtcblxuICAgICAgaWYgKHF1ZXJ5LmRpcnR5KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgYWZ0ZXJNYXRjaCA9IHF1ZXJ5Lm1hdGNoZXIuZG9jdW1lbnRNYXRjaGVzKGRvYyk7XG4gICAgICBjb25zdCBhZnRlciA9IGFmdGVyTWF0Y2gucmVzdWx0O1xuICAgICAgY29uc3QgYmVmb3JlID0gbWF0Y2hlZF9iZWZvcmVbcWlkXTtcblxuICAgICAgaWYgKGFmdGVyICYmIHF1ZXJ5LmRpc3RhbmNlcyAmJiBhZnRlck1hdGNoLmRpc3RhbmNlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcXVlcnkuZGlzdGFuY2VzLnNldChkb2MuX2lkLCBhZnRlck1hdGNoLmRpc3RhbmNlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHF1ZXJ5LmN1cnNvci5za2lwIHx8IHF1ZXJ5LmN1cnNvci5saW1pdCkge1xuICAgICAgICAvLyBXZSBuZWVkIHRvIHJlY29tcHV0ZSBhbnkgcXVlcnkgd2hlcmUgdGhlIGRvYyBtYXkgaGF2ZSBiZWVuIGluIHRoZVxuICAgICAgICAvLyBjdXJzb3IncyB3aW5kb3cgZWl0aGVyIGJlZm9yZSBvciBhZnRlciB0aGUgdXBkYXRlLiAoTm90ZSB0aGF0IGlmIHNraXBcbiAgICAgICAgLy8gb3IgbGltaXQgaXMgc2V0LCBcImJlZm9yZVwiIGFuZCBcImFmdGVyXCIgYmVpbmcgdHJ1ZSBkbyBub3QgbmVjZXNzYXJpbHlcbiAgICAgICAgLy8gbWVhbiB0aGF0IHRoZSBkb2N1bWVudCBpcyBpbiB0aGUgY3Vyc29yJ3Mgb3V0cHV0IGFmdGVyIHNraXAvbGltaXQgaXNcbiAgICAgICAgLy8gYXBwbGllZC4uLiBidXQgaWYgdGhleSBhcmUgZmFsc2UsIHRoZW4gdGhlIGRvY3VtZW50IGRlZmluaXRlbHkgaXMgTk9UXG4gICAgICAgIC8vIGluIHRoZSBvdXRwdXQuIFNvIGl0J3Mgc2FmZSB0byBza2lwIHJlY29tcHV0ZSBpZiBuZWl0aGVyIGJlZm9yZSBvclxuICAgICAgICAvLyBhZnRlciBhcmUgdHJ1ZS4pXG4gICAgICAgIGlmIChiZWZvcmUgfHwgYWZ0ZXIpIHtcbiAgICAgICAgICByZWNvbXB1dGVRaWRzW3FpZF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGJlZm9yZSAmJiAhYWZ0ZXIpIHtcbiAgICAgICAgTG9jYWxDb2xsZWN0aW9uLl9yZW1vdmVGcm9tUmVzdWx0cyhxdWVyeSwgZG9jKTtcbiAgICAgIH0gZWxzZSBpZiAoIWJlZm9yZSAmJiBhZnRlcikge1xuICAgICAgICBMb2NhbENvbGxlY3Rpb24uX2luc2VydEluUmVzdWx0cyhxdWVyeSwgZG9jKTtcbiAgICAgIH0gZWxzZSBpZiAoYmVmb3JlICYmIGFmdGVyKSB7XG4gICAgICAgIExvY2FsQ29sbGVjdGlvbi5fdXBkYXRlSW5SZXN1bHRzKHF1ZXJ5LCBkb2MsIG9sZF9kb2MpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLy8gUmVjb21wdXRlcyB0aGUgcmVzdWx0cyBvZiBhIHF1ZXJ5IGFuZCBydW5zIG9ic2VydmUgY2FsbGJhY2tzIGZvciB0aGVcbiAgLy8gZGlmZmVyZW5jZSBiZXR3ZWVuIHRoZSBwcmV2aW91cyByZXN1bHRzIGFuZCB0aGUgY3VycmVudCByZXN1bHRzICh1bmxlc3NcbiAgLy8gcGF1c2VkKS4gVXNlZCBmb3Igc2tpcC9saW1pdCBxdWVyaWVzLlxuICAvL1xuICAvLyBXaGVuIHRoaXMgaXMgdXNlZCBieSBpbnNlcnQgb3IgcmVtb3ZlLCBpdCBjYW4ganVzdCB1c2UgcXVlcnkucmVzdWx0cyBmb3JcbiAgLy8gdGhlIG9sZCByZXN1bHRzIChhbmQgdGhlcmUncyBubyBuZWVkIHRvIHBhc3MgaW4gb2xkUmVzdWx0cyksIGJlY2F1c2UgdGhlc2VcbiAgLy8gb3BlcmF0aW9ucyBkb24ndCBtdXRhdGUgdGhlIGRvY3VtZW50cyBpbiB0aGUgY29sbGVjdGlvbi4gVXBkYXRlIG5lZWRzIHRvXG4gIC8vIHBhc3MgaW4gYW4gb2xkUmVzdWx0cyB3aGljaCB3YXMgZGVlcC1jb3BpZWQgYmVmb3JlIHRoZSBtb2RpZmllciB3YXNcbiAgLy8gYXBwbGllZC5cbiAgLy9cbiAgLy8gb2xkUmVzdWx0cyBpcyBndWFyYW50ZWVkIHRvIGJlIGlnbm9yZWQgaWYgdGhlIHF1ZXJ5IGlzIG5vdCBwYXVzZWQuXG4gIF9yZWNvbXB1dGVSZXN1bHRzKHF1ZXJ5LCBvbGRSZXN1bHRzKSB7XG4gICAgaWYgKHRoaXMucGF1c2VkKSB7XG4gICAgICAvLyBUaGVyZSdzIG5vIHJlYXNvbiB0byByZWNvbXB1dGUgdGhlIHJlc3VsdHMgbm93IGFzIHdlJ3JlIHN0aWxsIHBhdXNlZC5cbiAgICAgIC8vIEJ5IGZsYWdnaW5nIHRoZSBxdWVyeSBhcyBcImRpcnR5XCIsIHRoZSByZWNvbXB1dGUgd2lsbCBiZSBwZXJmb3JtZWRcbiAgICAgIC8vIHdoZW4gcmVzdW1lT2JzZXJ2ZXJzIGlzIGNhbGxlZC5cbiAgICAgIHF1ZXJ5LmRpcnR5ID0gdHJ1ZTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMucGF1c2VkICYmICFvbGRSZXN1bHRzKSB7XG4gICAgICBvbGRSZXN1bHRzID0gcXVlcnkucmVzdWx0cztcbiAgICB9XG5cbiAgICBpZiAocXVlcnkuZGlzdGFuY2VzKSB7XG4gICAgICBxdWVyeS5kaXN0YW5jZXMuY2xlYXIoKTtcbiAgICB9XG5cbiAgICBxdWVyeS5yZXN1bHRzID0gcXVlcnkuY3Vyc29yLl9nZXRSYXdPYmplY3RzKHtcbiAgICAgIGRpc3RhbmNlczogcXVlcnkuZGlzdGFuY2VzLFxuICAgICAgb3JkZXJlZDogcXVlcnkub3JkZXJlZFxuICAgIH0pO1xuXG4gICAgaWYgKCF0aGlzLnBhdXNlZCkge1xuICAgICAgTG9jYWxDb2xsZWN0aW9uLl9kaWZmUXVlcnlDaGFuZ2VzKFxuICAgICAgICBxdWVyeS5vcmRlcmVkLFxuICAgICAgICBvbGRSZXN1bHRzLFxuICAgICAgICBxdWVyeS5yZXN1bHRzLFxuICAgICAgICBxdWVyeSxcbiAgICAgICAge3Byb2plY3Rpb25GbjogcXVlcnkucHJvamVjdGlvbkZufVxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBfc2F2ZU9yaWdpbmFsKGlkLCBkb2MpIHtcbiAgICAvLyBBcmUgd2UgZXZlbiB0cnlpbmcgdG8gc2F2ZSBvcmlnaW5hbHM/XG4gICAgaWYgKCF0aGlzLl9zYXZlZE9yaWdpbmFscykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIEhhdmUgd2UgcHJldmlvdXNseSBtdXRhdGVkIHRoZSBvcmlnaW5hbCAoYW5kIHNvICdkb2MnIGlzIG5vdCBhY3R1YWxseVxuICAgIC8vIG9yaWdpbmFsKT8gIChOb3RlIHRoZSAnaGFzJyBjaGVjayByYXRoZXIgdGhhbiB0cnV0aDogd2Ugc3RvcmUgdW5kZWZpbmVkXG4gICAgLy8gaGVyZSBmb3IgaW5zZXJ0ZWQgZG9jcyEpXG4gICAgaWYgKHRoaXMuX3NhdmVkT3JpZ2luYWxzLmhhcyhpZCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9zYXZlZE9yaWdpbmFscy5zZXQoaWQsIEVKU09OLmNsb25lKGRvYykpO1xuICB9XG59XG5cbkxvY2FsQ29sbGVjdGlvbi5DdXJzb3IgPSBDdXJzb3I7XG5cbkxvY2FsQ29sbGVjdGlvbi5PYnNlcnZlSGFuZGxlID0gT2JzZXJ2ZUhhbmRsZTtcblxuLy8gWFhYIG1heWJlIG1vdmUgdGhlc2UgaW50byBhbm90aGVyIE9ic2VydmVIZWxwZXJzIHBhY2thZ2Ugb3Igc29tZXRoaW5nXG5cbi8vIF9DYWNoaW5nQ2hhbmdlT2JzZXJ2ZXIgaXMgYW4gb2JqZWN0IHdoaWNoIHJlY2VpdmVzIG9ic2VydmVDaGFuZ2VzIGNhbGxiYWNrc1xuLy8gYW5kIGtlZXBzIGEgY2FjaGUgb2YgdGhlIGN1cnJlbnQgY3Vyc29yIHN0YXRlIHVwIHRvIGRhdGUgaW4gdGhpcy5kb2NzLiBVc2Vyc1xuLy8gb2YgdGhpcyBjbGFzcyBzaG91bGQgcmVhZCB0aGUgZG9jcyBmaWVsZCBidXQgbm90IG1vZGlmeSBpdC4gWW91IHNob3VsZCBwYXNzXG4vLyB0aGUgXCJhcHBseUNoYW5nZVwiIGZpZWxkIGFzIHRoZSBjYWxsYmFja3MgdG8gdGhlIHVuZGVybHlpbmcgb2JzZXJ2ZUNoYW5nZXNcbi8vIGNhbGwuIE9wdGlvbmFsbHksIHlvdSBjYW4gc3BlY2lmeSB5b3VyIG93biBvYnNlcnZlQ2hhbmdlcyBjYWxsYmFja3Mgd2hpY2ggYXJlXG4vLyBpbnZva2VkIGltbWVkaWF0ZWx5IGJlZm9yZSB0aGUgZG9jcyBmaWVsZCBpcyB1cGRhdGVkOyB0aGlzIG9iamVjdCBpcyBtYWRlXG4vLyBhdmFpbGFibGUgYXMgYHRoaXNgIHRvIHRob3NlIGNhbGxiYWNrcy5cbkxvY2FsQ29sbGVjdGlvbi5fQ2FjaGluZ0NoYW5nZU9ic2VydmVyID0gY2xhc3MgX0NhY2hpbmdDaGFuZ2VPYnNlcnZlciB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IG9yZGVyZWRGcm9tQ2FsbGJhY2tzID0gKFxuICAgICAgb3B0aW9ucy5jYWxsYmFja3MgJiZcbiAgICAgIExvY2FsQ29sbGVjdGlvbi5fb2JzZXJ2ZUNoYW5nZXNDYWxsYmFja3NBcmVPcmRlcmVkKG9wdGlvbnMuY2FsbGJhY2tzKVxuICAgICk7XG5cbiAgICBpZiAoaGFzT3duLmNhbGwob3B0aW9ucywgJ29yZGVyZWQnKSkge1xuICAgICAgdGhpcy5vcmRlcmVkID0gb3B0aW9ucy5vcmRlcmVkO1xuXG4gICAgICBpZiAob3B0aW9ucy5jYWxsYmFja3MgJiYgb3B0aW9ucy5vcmRlcmVkICE9PSBvcmRlcmVkRnJvbUNhbGxiYWNrcykge1xuICAgICAgICB0aHJvdyBFcnJvcignb3JkZXJlZCBvcHRpb24gZG9lc25cXCd0IG1hdGNoIGNhbGxiYWNrcycpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAob3B0aW9ucy5jYWxsYmFja3MpIHtcbiAgICAgIHRoaXMub3JkZXJlZCA9IG9yZGVyZWRGcm9tQ2FsbGJhY2tzO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBFcnJvcignbXVzdCBwcm92aWRlIG9yZGVyZWQgb3IgY2FsbGJhY2tzJyk7XG4gICAgfVxuXG4gICAgY29uc3QgY2FsbGJhY2tzID0gb3B0aW9ucy5jYWxsYmFja3MgfHwge307XG5cbiAgICBpZiAodGhpcy5vcmRlcmVkKSB7XG4gICAgICB0aGlzLmRvY3MgPSBuZXcgT3JkZXJlZERpY3QoTW9uZ29JRC5pZFN0cmluZ2lmeSk7XG4gICAgICB0aGlzLmFwcGx5Q2hhbmdlID0ge1xuICAgICAgICBhZGRlZEJlZm9yZTogKGlkLCBmaWVsZHMsIGJlZm9yZSkgPT4ge1xuICAgICAgICAgIGNvbnN0IGRvYyA9IEVKU09OLmNsb25lKGZpZWxkcyk7XG5cbiAgICAgICAgICBkb2MuX2lkID0gaWQ7XG5cbiAgICAgICAgICBpZiAoY2FsbGJhY2tzLmFkZGVkQmVmb3JlKSB7XG4gICAgICAgICAgICBjYWxsYmFja3MuYWRkZWRCZWZvcmUuY2FsbCh0aGlzLCBpZCwgZmllbGRzLCBiZWZvcmUpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIFRoaXMgbGluZSB0cmlnZ2VycyBpZiB3ZSBwcm92aWRlIGFkZGVkIHdpdGggbW92ZWRCZWZvcmUuXG4gICAgICAgICAgaWYgKGNhbGxiYWNrcy5hZGRlZCkge1xuICAgICAgICAgICAgY2FsbGJhY2tzLmFkZGVkLmNhbGwodGhpcywgaWQsIGZpZWxkcyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gWFhYIGNvdWxkIGBiZWZvcmVgIGJlIGEgZmFsc3kgSUQ/ICBUZWNobmljYWxseVxuICAgICAgICAgIC8vIGlkU3RyaW5naWZ5IHNlZW1zIHRvIGFsbG93IGZvciB0aGVtIC0tIHRob3VnaFxuICAgICAgICAgIC8vIE9yZGVyZWREaWN0IHdvbid0IGNhbGwgc3RyaW5naWZ5IG9uIGEgZmFsc3kgYXJnLlxuICAgICAgICAgIHRoaXMuZG9jcy5wdXRCZWZvcmUoaWQsIGRvYywgYmVmb3JlIHx8IG51bGwpO1xuICAgICAgICB9LFxuICAgICAgICBtb3ZlZEJlZm9yZTogKGlkLCBiZWZvcmUpID0+IHtcbiAgICAgICAgICBjb25zdCBkb2MgPSB0aGlzLmRvY3MuZ2V0KGlkKTtcblxuICAgICAgICAgIGlmIChjYWxsYmFja3MubW92ZWRCZWZvcmUpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrcy5tb3ZlZEJlZm9yZS5jYWxsKHRoaXMsIGlkLCBiZWZvcmUpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuZG9jcy5tb3ZlQmVmb3JlKGlkLCBiZWZvcmUgfHwgbnVsbCk7XG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRvY3MgPSBuZXcgTG9jYWxDb2xsZWN0aW9uLl9JZE1hcDtcbiAgICAgIHRoaXMuYXBwbHlDaGFuZ2UgPSB7XG4gICAgICAgIGFkZGVkOiAoaWQsIGZpZWxkcykgPT4ge1xuICAgICAgICAgIGNvbnN0IGRvYyA9IEVKU09OLmNsb25lKGZpZWxkcyk7XG5cbiAgICAgICAgICBpZiAoY2FsbGJhY2tzLmFkZGVkKSB7XG4gICAgICAgICAgICBjYWxsYmFja3MuYWRkZWQuY2FsbCh0aGlzLCBpZCwgZmllbGRzKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBkb2MuX2lkID0gaWQ7XG5cbiAgICAgICAgICB0aGlzLmRvY3Muc2V0KGlkLCAgZG9jKTtcbiAgICAgICAgfSxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gVGhlIG1ldGhvZHMgaW4gX0lkTWFwIGFuZCBPcmRlcmVkRGljdCB1c2VkIGJ5IHRoZXNlIGNhbGxiYWNrcyBhcmVcbiAgICAvLyBpZGVudGljYWwuXG4gICAgdGhpcy5hcHBseUNoYW5nZS5jaGFuZ2VkID0gKGlkLCBmaWVsZHMpID0+IHtcbiAgICAgIGNvbnN0IGRvYyA9IHRoaXMuZG9jcy5nZXQoaWQpO1xuXG4gICAgICBpZiAoIWRvYykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gaWQgZm9yIGNoYW5nZWQ6ICR7aWR9YCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChjYWxsYmFja3MuY2hhbmdlZCkge1xuICAgICAgICBjYWxsYmFja3MuY2hhbmdlZC5jYWxsKHRoaXMsIGlkLCBFSlNPTi5jbG9uZShmaWVsZHMpKTtcbiAgICAgIH1cblxuICAgICAgRGlmZlNlcXVlbmNlLmFwcGx5Q2hhbmdlcyhkb2MsIGZpZWxkcyk7XG4gICAgfTtcblxuICAgIHRoaXMuYXBwbHlDaGFuZ2UucmVtb3ZlZCA9IGlkID0+IHtcbiAgICAgIGlmIChjYWxsYmFja3MucmVtb3ZlZCkge1xuICAgICAgICBjYWxsYmFja3MucmVtb3ZlZC5jYWxsKHRoaXMsIGlkKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5kb2NzLnJlbW92ZShpZCk7XG4gICAgfTtcbiAgfVxufTtcblxuTG9jYWxDb2xsZWN0aW9uLl9JZE1hcCA9IGNsYXNzIF9JZE1hcCBleHRlbmRzIElkTWFwIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoTW9uZ29JRC5pZFN0cmluZ2lmeSwgTW9uZ29JRC5pZFBhcnNlKTtcbiAgfVxufTtcblxuLy8gV3JhcCBhIHRyYW5zZm9ybSBmdW5jdGlvbiB0byByZXR1cm4gb2JqZWN0cyB0aGF0IGhhdmUgdGhlIF9pZCBmaWVsZFxuLy8gb2YgdGhlIHVudHJhbnNmb3JtZWQgZG9jdW1lbnQuIFRoaXMgZW5zdXJlcyB0aGF0IHN1YnN5c3RlbXMgc3VjaCBhc1xuLy8gdGhlIG9ic2VydmUtc2VxdWVuY2UgcGFja2FnZSB0aGF0IGNhbGwgYG9ic2VydmVgIGNhbiBrZWVwIHRyYWNrIG9mXG4vLyB0aGUgZG9jdW1lbnRzIGlkZW50aXRpZXMuXG4vL1xuLy8gLSBSZXF1aXJlIHRoYXQgaXQgcmV0dXJucyBvYmplY3RzXG4vLyAtIElmIHRoZSByZXR1cm4gdmFsdWUgaGFzIGFuIF9pZCBmaWVsZCwgdmVyaWZ5IHRoYXQgaXQgbWF0Y2hlcyB0aGVcbi8vICAgb3JpZ2luYWwgX2lkIGZpZWxkXG4vLyAtIElmIHRoZSByZXR1cm4gdmFsdWUgZG9lc24ndCBoYXZlIGFuIF9pZCBmaWVsZCwgYWRkIGl0IGJhY2suXG5Mb2NhbENvbGxlY3Rpb24ud3JhcFRyYW5zZm9ybSA9IHRyYW5zZm9ybSA9PiB7XG4gIGlmICghdHJhbnNmb3JtKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvLyBObyBuZWVkIHRvIGRvdWJseS13cmFwIHRyYW5zZm9ybXMuXG4gIGlmICh0cmFuc2Zvcm0uX193cmFwcGVkVHJhbnNmb3JtX18pIHtcbiAgICByZXR1cm4gdHJhbnNmb3JtO1xuICB9XG5cbiAgY29uc3Qgd3JhcHBlZCA9IGRvYyA9PiB7XG4gICAgaWYgKCFoYXNPd24uY2FsbChkb2MsICdfaWQnKSkge1xuICAgICAgLy8gWFhYIGRvIHdlIGV2ZXIgaGF2ZSBhIHRyYW5zZm9ybSBvbiB0aGUgb3Bsb2cncyBjb2xsZWN0aW9uPyBiZWNhdXNlIHRoYXRcbiAgICAgIC8vIGNvbGxlY3Rpb24gaGFzIG5vIF9pZC5cbiAgICAgIHRocm93IG5ldyBFcnJvcignY2FuIG9ubHkgdHJhbnNmb3JtIGRvY3VtZW50cyB3aXRoIF9pZCcpO1xuICAgIH1cblxuICAgIGNvbnN0IGlkID0gZG9jLl9pZDtcblxuICAgIC8vIFhYWCBjb25zaWRlciBtYWtpbmcgdHJhY2tlciBhIHdlYWsgZGVwZW5kZW5jeSBhbmQgY2hlY2tpbmdcbiAgICAvLyBQYWNrYWdlLnRyYWNrZXIgaGVyZVxuICAgIGNvbnN0IHRyYW5zZm9ybWVkID0gVHJhY2tlci5ub25yZWFjdGl2ZSgoKSA9PiB0cmFuc2Zvcm0oZG9jKSk7XG5cbiAgICBpZiAoIUxvY2FsQ29sbGVjdGlvbi5faXNQbGFpbk9iamVjdCh0cmFuc2Zvcm1lZCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcigndHJhbnNmb3JtIG11c3QgcmV0dXJuIG9iamVjdCcpO1xuICAgIH1cblxuICAgIGlmIChoYXNPd24uY2FsbCh0cmFuc2Zvcm1lZCwgJ19pZCcpKSB7XG4gICAgICBpZiAoIUVKU09OLmVxdWFscyh0cmFuc2Zvcm1lZC5faWQsIGlkKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3RyYW5zZm9ybWVkIGRvY3VtZW50IGNhblxcJ3QgaGF2ZSBkaWZmZXJlbnQgX2lkJyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRyYW5zZm9ybWVkLl9pZCA9IGlkO1xuICAgIH1cblxuICAgIHJldHVybiB0cmFuc2Zvcm1lZDtcbiAgfTtcblxuICB3cmFwcGVkLl9fd3JhcHBlZFRyYW5zZm9ybV9fID0gdHJ1ZTtcblxuICByZXR1cm4gd3JhcHBlZDtcbn07XG5cbi8vIFhYWCB0aGUgc29ydGVkLXF1ZXJ5IGxvZ2ljIGJlbG93IGlzIGxhdWdoYWJseSBpbmVmZmljaWVudC4gd2UnbGxcbi8vIG5lZWQgdG8gY29tZSB1cCB3aXRoIGEgYmV0dGVyIGRhdGFzdHJ1Y3R1cmUgZm9yIHRoaXMuXG4vL1xuLy8gWFhYIHRoZSBsb2dpYyBmb3Igb2JzZXJ2aW5nIHdpdGggYSBza2lwIG9yIGEgbGltaXQgaXMgZXZlbiBtb3JlXG4vLyBsYXVnaGFibHkgaW5lZmZpY2llbnQuIHdlIHJlY29tcHV0ZSB0aGUgd2hvbGUgcmVzdWx0cyBldmVyeSB0aW1lIVxuXG4vLyBUaGlzIGJpbmFyeSBzZWFyY2ggcHV0cyBhIHZhbHVlIGJldHdlZW4gYW55IGVxdWFsIHZhbHVlcywgYW5kIHRoZSBmaXJzdFxuLy8gbGVzc2VyIHZhbHVlLlxuTG9jYWxDb2xsZWN0aW9uLl9iaW5hcnlTZWFyY2ggPSAoY21wLCBhcnJheSwgdmFsdWUpID0+IHtcbiAgbGV0IGZpcnN0ID0gMDtcbiAgbGV0IHJhbmdlID0gYXJyYXkubGVuZ3RoO1xuXG4gIHdoaWxlIChyYW5nZSA+IDApIHtcbiAgICBjb25zdCBoYWxmUmFuZ2UgPSBNYXRoLmZsb29yKHJhbmdlIC8gMik7XG5cbiAgICBpZiAoY21wKHZhbHVlLCBhcnJheVtmaXJzdCArIGhhbGZSYW5nZV0pID49IDApIHtcbiAgICAgIGZpcnN0ICs9IGhhbGZSYW5nZSArIDE7XG4gICAgICByYW5nZSAtPSBoYWxmUmFuZ2UgKyAxO1xuICAgIH0gZWxzZSB7XG4gICAgICByYW5nZSA9IGhhbGZSYW5nZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmlyc3Q7XG59O1xuXG5Mb2NhbENvbGxlY3Rpb24uX2NoZWNrU3VwcG9ydGVkUHJvamVjdGlvbiA9IGZpZWxkcyA9PiB7XG4gIGlmIChmaWVsZHMgIT09IE9iamVjdChmaWVsZHMpIHx8IEFycmF5LmlzQXJyYXkoZmllbGRzKSkge1xuICAgIHRocm93IE1pbmltb25nb0Vycm9yKCdmaWVsZHMgb3B0aW9uIG11c3QgYmUgYW4gb2JqZWN0Jyk7XG4gIH1cblxuICBPYmplY3Qua2V5cyhmaWVsZHMpLmZvckVhY2goa2V5UGF0aCA9PiB7XG4gICAgaWYgKGtleVBhdGguc3BsaXQoJy4nKS5pbmNsdWRlcygnJCcpKSB7XG4gICAgICB0aHJvdyBNaW5pbW9uZ29FcnJvcihcbiAgICAgICAgJ01pbmltb25nbyBkb2VzblxcJ3Qgc3VwcG9ydCAkIG9wZXJhdG9yIGluIHByb2plY3Rpb25zIHlldC4nXG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IHZhbHVlID0gZmllbGRzW2tleVBhdGhdO1xuXG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiZcbiAgICAgICAgWyckZWxlbU1hdGNoJywgJyRtZXRhJywgJyRzbGljZSddLnNvbWUoa2V5ID0+XG4gICAgICAgICAgaGFzT3duLmNhbGwodmFsdWUsIGtleSlcbiAgICAgICAgKSkge1xuICAgICAgdGhyb3cgTWluaW1vbmdvRXJyb3IoXG4gICAgICAgICdNaW5pbW9uZ28gZG9lc25cXCd0IHN1cHBvcnQgb3BlcmF0b3JzIGluIHByb2plY3Rpb25zIHlldC4nXG4gICAgICApO1xuICAgIH1cblxuICAgIGlmICghWzEsIDAsIHRydWUsIGZhbHNlXS5pbmNsdWRlcyh2YWx1ZSkpIHtcbiAgICAgIHRocm93IE1pbmltb25nb0Vycm9yKFxuICAgICAgICAnUHJvamVjdGlvbiB2YWx1ZXMgc2hvdWxkIGJlIG9uZSBvZiAxLCAwLCB0cnVlLCBvciBmYWxzZSdcbiAgICAgICk7XG4gICAgfVxuICB9KTtcbn07XG5cbi8vIEtub3dzIGhvdyB0byBjb21waWxlIGEgZmllbGRzIHByb2plY3Rpb24gdG8gYSBwcmVkaWNhdGUgZnVuY3Rpb24uXG4vLyBAcmV0dXJucyAtIEZ1bmN0aW9uOiBhIGNsb3N1cmUgdGhhdCBmaWx0ZXJzIG91dCBhbiBvYmplY3QgYWNjb3JkaW5nIHRvIHRoZVxuLy8gICAgICAgICAgICBmaWVsZHMgcHJvamVjdGlvbiBydWxlczpcbi8vICAgICAgICAgICAgQHBhcmFtIG9iaiAtIE9iamVjdDogTW9uZ29EQi1zdHlsZWQgZG9jdW1lbnRcbi8vICAgICAgICAgICAgQHJldHVybnMgLSBPYmplY3Q6IGEgZG9jdW1lbnQgd2l0aCB0aGUgZmllbGRzIGZpbHRlcmVkIG91dFxuLy8gICAgICAgICAgICAgICAgICAgICAgIGFjY29yZGluZyB0byBwcm9qZWN0aW9uIHJ1bGVzLiBEb2Vzbid0IHJldGFpbiBzdWJmaWVsZHNcbi8vICAgICAgICAgICAgICAgICAgICAgICBvZiBwYXNzZWQgYXJndW1lbnQuXG5Mb2NhbENvbGxlY3Rpb24uX2NvbXBpbGVQcm9qZWN0aW9uID0gZmllbGRzID0+IHtcbiAgTG9jYWxDb2xsZWN0aW9uLl9jaGVja1N1cHBvcnRlZFByb2plY3Rpb24oZmllbGRzKTtcblxuICBjb25zdCBfaWRQcm9qZWN0aW9uID0gZmllbGRzLl9pZCA9PT0gdW5kZWZpbmVkID8gdHJ1ZSA6IGZpZWxkcy5faWQ7XG4gIGNvbnN0IGRldGFpbHMgPSBwcm9qZWN0aW9uRGV0YWlscyhmaWVsZHMpO1xuXG4gIC8vIHJldHVybnMgdHJhbnNmb3JtZWQgZG9jIGFjY29yZGluZyB0byBydWxlVHJlZVxuICBjb25zdCB0cmFuc2Zvcm0gPSAoZG9jLCBydWxlVHJlZSkgPT4ge1xuICAgIC8vIFNwZWNpYWwgY2FzZSBmb3IgXCJzZXRzXCJcbiAgICBpZiAoQXJyYXkuaXNBcnJheShkb2MpKSB7XG4gICAgICByZXR1cm4gZG9jLm1hcChzdWJkb2MgPT4gdHJhbnNmb3JtKHN1YmRvYywgcnVsZVRyZWUpKTtcbiAgICB9XG5cbiAgICBjb25zdCByZXN1bHQgPSBkZXRhaWxzLmluY2x1ZGluZyA/IHt9IDogRUpTT04uY2xvbmUoZG9jKTtcblxuICAgIE9iamVjdC5rZXlzKHJ1bGVUcmVlKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICBpZiAoIWhhc093bi5jYWxsKGRvYywga2V5KSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJ1bGUgPSBydWxlVHJlZVtrZXldO1xuXG4gICAgICBpZiAocnVsZSA9PT0gT2JqZWN0KHJ1bGUpKSB7XG4gICAgICAgIC8vIEZvciBzdWItb2JqZWN0cy9zdWJzZXRzIHdlIGJyYW5jaFxuICAgICAgICBpZiAoZG9jW2tleV0gPT09IE9iamVjdChkb2Nba2V5XSkpIHtcbiAgICAgICAgICByZXN1bHRba2V5XSA9IHRyYW5zZm9ybShkb2Nba2V5XSwgcnVsZSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoZGV0YWlscy5pbmNsdWRpbmcpIHtcbiAgICAgICAgLy8gT3RoZXJ3aXNlIHdlIGRvbid0IGV2ZW4gdG91Y2ggdGhpcyBzdWJmaWVsZFxuICAgICAgICByZXN1bHRba2V5XSA9IEVKU09OLmNsb25lKGRvY1trZXldKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRlbGV0ZSByZXN1bHRba2V5XTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgcmV0dXJuIGRvYyA9PiB7XG4gICAgY29uc3QgcmVzdWx0ID0gdHJhbnNmb3JtKGRvYywgZGV0YWlscy50cmVlKTtcblxuICAgIGlmIChfaWRQcm9qZWN0aW9uICYmIGhhc093bi5jYWxsKGRvYywgJ19pZCcpKSB7XG4gICAgICByZXN1bHQuX2lkID0gZG9jLl9pZDtcbiAgICB9XG5cbiAgICBpZiAoIV9pZFByb2plY3Rpb24gJiYgaGFzT3duLmNhbGwocmVzdWx0LCAnX2lkJykpIHtcbiAgICAgIGRlbGV0ZSByZXN1bHQuX2lkO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG59O1xuXG4vLyBDYWxjdWxhdGVzIHRoZSBkb2N1bWVudCB0byBpbnNlcnQgaW4gY2FzZSB3ZSdyZSBkb2luZyBhbiB1cHNlcnQgYW5kIHRoZVxuLy8gc2VsZWN0b3IgZG9lcyBub3QgbWF0Y2ggYW55IGVsZW1lbnRzXG5Mb2NhbENvbGxlY3Rpb24uX2NyZWF0ZVVwc2VydERvY3VtZW50ID0gKHNlbGVjdG9yLCBtb2RpZmllcikgPT4ge1xuICBjb25zdCBzZWxlY3RvckRvY3VtZW50ID0gcG9wdWxhdGVEb2N1bWVudFdpdGhRdWVyeUZpZWxkcyhzZWxlY3Rvcik7XG4gIGNvbnN0IGlzTW9kaWZ5ID0gTG9jYWxDb2xsZWN0aW9uLl9pc01vZGlmaWNhdGlvbk1vZChtb2RpZmllcik7XG5cbiAgY29uc3QgbmV3RG9jID0ge307XG5cbiAgaWYgKHNlbGVjdG9yRG9jdW1lbnQuX2lkKSB7XG4gICAgbmV3RG9jLl9pZCA9IHNlbGVjdG9yRG9jdW1lbnQuX2lkO1xuICAgIGRlbGV0ZSBzZWxlY3RvckRvY3VtZW50Ll9pZDtcbiAgfVxuXG4gIC8vIFRoaXMgZG91YmxlIF9tb2RpZnkgY2FsbCBpcyBtYWRlIHRvIGhlbHAgd2l0aCBuZXN0ZWQgcHJvcGVydGllcyAoc2VlIGlzc3VlXG4gIC8vICM4NjMxKS4gV2UgZG8gdGhpcyBldmVuIGlmIGl0J3MgYSByZXBsYWNlbWVudCBmb3IgdmFsaWRhdGlvbiBwdXJwb3NlcyAoZS5nLlxuICAvLyBhbWJpZ3VvdXMgaWQncylcbiAgTG9jYWxDb2xsZWN0aW9uLl9tb2RpZnkobmV3RG9jLCB7JHNldDogc2VsZWN0b3JEb2N1bWVudH0pO1xuICBMb2NhbENvbGxlY3Rpb24uX21vZGlmeShuZXdEb2MsIG1vZGlmaWVyLCB7aXNJbnNlcnQ6IHRydWV9KTtcblxuICBpZiAoaXNNb2RpZnkpIHtcbiAgICByZXR1cm4gbmV3RG9jO1xuICB9XG5cbiAgLy8gUmVwbGFjZW1lbnQgY2FuIHRha2UgX2lkIGZyb20gcXVlcnkgZG9jdW1lbnRcbiAgY29uc3QgcmVwbGFjZW1lbnQgPSBPYmplY3QuYXNzaWduKHt9LCBtb2RpZmllcik7XG4gIGlmIChuZXdEb2MuX2lkKSB7XG4gICAgcmVwbGFjZW1lbnQuX2lkID0gbmV3RG9jLl9pZDtcbiAgfVxuXG4gIHJldHVybiByZXBsYWNlbWVudDtcbn07XG5cbkxvY2FsQ29sbGVjdGlvbi5fZGlmZk9iamVjdHMgPSAobGVmdCwgcmlnaHQsIGNhbGxiYWNrcykgPT4ge1xuICByZXR1cm4gRGlmZlNlcXVlbmNlLmRpZmZPYmplY3RzKGxlZnQsIHJpZ2h0LCBjYWxsYmFja3MpO1xufTtcblxuLy8gb3JkZXJlZDogYm9vbC5cbi8vIG9sZF9yZXN1bHRzIGFuZCBuZXdfcmVzdWx0czogY29sbGVjdGlvbnMgb2YgZG9jdW1lbnRzLlxuLy8gICAgaWYgb3JkZXJlZCwgdGhleSBhcmUgYXJyYXlzLlxuLy8gICAgaWYgdW5vcmRlcmVkLCB0aGV5IGFyZSBJZE1hcHNcbkxvY2FsQ29sbGVjdGlvbi5fZGlmZlF1ZXJ5Q2hhbmdlcyA9IChvcmRlcmVkLCBvbGRSZXN1bHRzLCBuZXdSZXN1bHRzLCBvYnNlcnZlciwgb3B0aW9ucykgPT5cbiAgRGlmZlNlcXVlbmNlLmRpZmZRdWVyeUNoYW5nZXMob3JkZXJlZCwgb2xkUmVzdWx0cywgbmV3UmVzdWx0cywgb2JzZXJ2ZXIsIG9wdGlvbnMpXG47XG5cbkxvY2FsQ29sbGVjdGlvbi5fZGlmZlF1ZXJ5T3JkZXJlZENoYW5nZXMgPSAob2xkUmVzdWx0cywgbmV3UmVzdWx0cywgb2JzZXJ2ZXIsIG9wdGlvbnMpID0+XG4gIERpZmZTZXF1ZW5jZS5kaWZmUXVlcnlPcmRlcmVkQ2hhbmdlcyhvbGRSZXN1bHRzLCBuZXdSZXN1bHRzLCBvYnNlcnZlciwgb3B0aW9ucylcbjtcblxuTG9jYWxDb2xsZWN0aW9uLl9kaWZmUXVlcnlVbm9yZGVyZWRDaGFuZ2VzID0gKG9sZFJlc3VsdHMsIG5ld1Jlc3VsdHMsIG9ic2VydmVyLCBvcHRpb25zKSA9PlxuICBEaWZmU2VxdWVuY2UuZGlmZlF1ZXJ5VW5vcmRlcmVkQ2hhbmdlcyhvbGRSZXN1bHRzLCBuZXdSZXN1bHRzLCBvYnNlcnZlciwgb3B0aW9ucylcbjtcblxuTG9jYWxDb2xsZWN0aW9uLl9maW5kSW5PcmRlcmVkUmVzdWx0cyA9IChxdWVyeSwgZG9jKSA9PiB7XG4gIGlmICghcXVlcnkub3JkZXJlZCkge1xuICAgIHRocm93IG5ldyBFcnJvcignQ2FuXFwndCBjYWxsIF9maW5kSW5PcmRlcmVkUmVzdWx0cyBvbiB1bm9yZGVyZWQgcXVlcnknKTtcbiAgfVxuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcXVlcnkucmVzdWx0cy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChxdWVyeS5yZXN1bHRzW2ldID09PSBkb2MpIHtcbiAgICAgIHJldHVybiBpO1xuICAgIH1cbiAgfVxuXG4gIHRocm93IEVycm9yKCdvYmplY3QgbWlzc2luZyBmcm9tIHF1ZXJ5Jyk7XG59O1xuXG4vLyBJZiB0aGlzIGlzIGEgc2VsZWN0b3Igd2hpY2ggZXhwbGljaXRseSBjb25zdHJhaW5zIHRoZSBtYXRjaCBieSBJRCB0byBhIGZpbml0ZVxuLy8gbnVtYmVyIG9mIGRvY3VtZW50cywgcmV0dXJucyBhIGxpc3Qgb2YgdGhlaXIgSURzLiAgT3RoZXJ3aXNlIHJldHVybnNcbi8vIG51bGwuIE5vdGUgdGhhdCB0aGUgc2VsZWN0b3IgbWF5IGhhdmUgb3RoZXIgcmVzdHJpY3Rpb25zIHNvIGl0IG1heSBub3QgZXZlblxuLy8gbWF0Y2ggdGhvc2UgZG9jdW1lbnQhICBXZSBjYXJlIGFib3V0ICRpbiBhbmQgJGFuZCBzaW5jZSB0aG9zZSBhcmUgZ2VuZXJhdGVkXG4vLyBhY2Nlc3MtY29udHJvbGxlZCB1cGRhdGUgYW5kIHJlbW92ZS5cbkxvY2FsQ29sbGVjdGlvbi5faWRzTWF0Y2hlZEJ5U2VsZWN0b3IgPSBzZWxlY3RvciA9PiB7XG4gIC8vIElzIHRoZSBzZWxlY3RvciBqdXN0IGFuIElEP1xuICBpZiAoTG9jYWxDb2xsZWN0aW9uLl9zZWxlY3RvcklzSWQoc2VsZWN0b3IpKSB7XG4gICAgcmV0dXJuIFtzZWxlY3Rvcl07XG4gIH1cblxuICBpZiAoIXNlbGVjdG9yKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvLyBEbyB3ZSBoYXZlIGFuIF9pZCBjbGF1c2U/XG4gIGlmIChoYXNPd24uY2FsbChzZWxlY3RvciwgJ19pZCcpKSB7XG4gICAgLy8gSXMgdGhlIF9pZCBjbGF1c2UganVzdCBhbiBJRD9cbiAgICBpZiAoTG9jYWxDb2xsZWN0aW9uLl9zZWxlY3RvcklzSWQoc2VsZWN0b3IuX2lkKSkge1xuICAgICAgcmV0dXJuIFtzZWxlY3Rvci5faWRdO1xuICAgIH1cblxuICAgIC8vIElzIHRoZSBfaWQgY2xhdXNlIHtfaWQ6IHskaW46IFtcInhcIiwgXCJ5XCIsIFwielwiXX19P1xuICAgIGlmIChzZWxlY3Rvci5faWRcbiAgICAgICAgJiYgQXJyYXkuaXNBcnJheShzZWxlY3Rvci5faWQuJGluKVxuICAgICAgICAmJiBzZWxlY3Rvci5faWQuJGluLmxlbmd0aFxuICAgICAgICAmJiBzZWxlY3Rvci5faWQuJGluLmV2ZXJ5KExvY2FsQ29sbGVjdGlvbi5fc2VsZWN0b3JJc0lkKSkge1xuICAgICAgcmV0dXJuIHNlbGVjdG9yLl9pZC4kaW47XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvLyBJZiB0aGlzIGlzIGEgdG9wLWxldmVsICRhbmQsIGFuZCBhbnkgb2YgdGhlIGNsYXVzZXMgY29uc3RyYWluIHRoZWlyXG4gIC8vIGRvY3VtZW50cywgdGhlbiB0aGUgd2hvbGUgc2VsZWN0b3IgaXMgY29uc3RyYWluZWQgYnkgYW55IG9uZSBjbGF1c2Unc1xuICAvLyBjb25zdHJhaW50LiAoV2VsbCwgYnkgdGhlaXIgaW50ZXJzZWN0aW9uLCBidXQgdGhhdCBzZWVtcyB1bmxpa2VseS4pXG4gIGlmIChBcnJheS5pc0FycmF5KHNlbGVjdG9yLiRhbmQpKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZWxlY3Rvci4kYW5kLmxlbmd0aDsgKytpKSB7XG4gICAgICBjb25zdCBzdWJJZHMgPSBMb2NhbENvbGxlY3Rpb24uX2lkc01hdGNoZWRCeVNlbGVjdG9yKHNlbGVjdG9yLiRhbmRbaV0pO1xuXG4gICAgICBpZiAoc3ViSWRzKSB7XG4gICAgICAgIHJldHVybiBzdWJJZHM7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59O1xuXG5Mb2NhbENvbGxlY3Rpb24uX2luc2VydEluUmVzdWx0cyA9IChxdWVyeSwgZG9jKSA9PiB7XG4gIGNvbnN0IGZpZWxkcyA9IEVKU09OLmNsb25lKGRvYyk7XG5cbiAgZGVsZXRlIGZpZWxkcy5faWQ7XG5cbiAgaWYgKHF1ZXJ5Lm9yZGVyZWQpIHtcbiAgICBpZiAoIXF1ZXJ5LnNvcnRlcikge1xuICAgICAgcXVlcnkuYWRkZWRCZWZvcmUoZG9jLl9pZCwgcXVlcnkucHJvamVjdGlvbkZuKGZpZWxkcyksIG51bGwpO1xuICAgICAgcXVlcnkucmVzdWx0cy5wdXNoKGRvYyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGkgPSBMb2NhbENvbGxlY3Rpb24uX2luc2VydEluU29ydGVkTGlzdChcbiAgICAgICAgcXVlcnkuc29ydGVyLmdldENvbXBhcmF0b3Ioe2Rpc3RhbmNlczogcXVlcnkuZGlzdGFuY2VzfSksXG4gICAgICAgIHF1ZXJ5LnJlc3VsdHMsXG4gICAgICAgIGRvY1xuICAgICAgKTtcblxuICAgICAgbGV0IG5leHQgPSBxdWVyeS5yZXN1bHRzW2kgKyAxXTtcbiAgICAgIGlmIChuZXh0KSB7XG4gICAgICAgIG5leHQgPSBuZXh0Ll9pZDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5leHQgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICBxdWVyeS5hZGRlZEJlZm9yZShkb2MuX2lkLCBxdWVyeS5wcm9qZWN0aW9uRm4oZmllbGRzKSwgbmV4dCk7XG4gICAgfVxuXG4gICAgcXVlcnkuYWRkZWQoZG9jLl9pZCwgcXVlcnkucHJvamVjdGlvbkZuKGZpZWxkcykpO1xuICB9IGVsc2Uge1xuICAgIHF1ZXJ5LmFkZGVkKGRvYy5faWQsIHF1ZXJ5LnByb2plY3Rpb25GbihmaWVsZHMpKTtcbiAgICBxdWVyeS5yZXN1bHRzLnNldChkb2MuX2lkLCBkb2MpO1xuICB9XG59O1xuXG5Mb2NhbENvbGxlY3Rpb24uX2luc2VydEluU29ydGVkTGlzdCA9IChjbXAsIGFycmF5LCB2YWx1ZSkgPT4ge1xuICBpZiAoYXJyYXkubGVuZ3RoID09PSAwKSB7XG4gICAgYXJyYXkucHVzaCh2YWx1ZSk7XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICBjb25zdCBpID0gTG9jYWxDb2xsZWN0aW9uLl9iaW5hcnlTZWFyY2goY21wLCBhcnJheSwgdmFsdWUpO1xuXG4gIGFycmF5LnNwbGljZShpLCAwLCB2YWx1ZSk7XG5cbiAgcmV0dXJuIGk7XG59O1xuXG5Mb2NhbENvbGxlY3Rpb24uX2lzTW9kaWZpY2F0aW9uTW9kID0gbW9kID0+IHtcbiAgbGV0IGlzTW9kaWZ5ID0gZmFsc2U7XG4gIGxldCBpc1JlcGxhY2UgPSBmYWxzZTtcblxuICBPYmplY3Qua2V5cyhtb2QpLmZvckVhY2goa2V5ID0+IHtcbiAgICBpZiAoa2V5LnN1YnN0cigwLCAxKSA9PT0gJyQnKSB7XG4gICAgICBpc01vZGlmeSA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlzUmVwbGFjZSA9IHRydWU7XG4gICAgfVxuICB9KTtcblxuICBpZiAoaXNNb2RpZnkgJiYgaXNSZXBsYWNlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgJ1VwZGF0ZSBwYXJhbWV0ZXIgY2Fubm90IGhhdmUgYm90aCBtb2RpZmllciBhbmQgbm9uLW1vZGlmaWVyIGZpZWxkcy4nXG4gICAgKTtcbiAgfVxuXG4gIHJldHVybiBpc01vZGlmeTtcbn07XG5cbi8vIFhYWCBtYXliZSB0aGlzIHNob3VsZCBiZSBFSlNPTi5pc09iamVjdCwgdGhvdWdoIEVKU09OIGRvZXNuJ3Qga25vdyBhYm91dFxuLy8gUmVnRXhwXG4vLyBYWFggbm90ZSB0aGF0IF90eXBlKHVuZGVmaW5lZCkgPT09IDMhISEhXG5Mb2NhbENvbGxlY3Rpb24uX2lzUGxhaW5PYmplY3QgPSB4ID0+IHtcbiAgcmV0dXJuIHggJiYgTG9jYWxDb2xsZWN0aW9uLl9mLl90eXBlKHgpID09PSAzO1xufTtcblxuLy8gWFhYIG5lZWQgYSBzdHJhdGVneSBmb3IgcGFzc2luZyB0aGUgYmluZGluZyBvZiAkIGludG8gdGhpc1xuLy8gZnVuY3Rpb24sIGZyb20gdGhlIGNvbXBpbGVkIHNlbGVjdG9yXG4vL1xuLy8gbWF5YmUganVzdCB7a2V5LnVwLnRvLmp1c3QuYmVmb3JlLmRvbGxhcnNpZ246IGFycmF5X2luZGV4fVxuLy9cbi8vIFhYWCBhdG9taWNpdHk6IGlmIG9uZSBtb2RpZmljYXRpb24gZmFpbHMsIGRvIHdlIHJvbGwgYmFjayB0aGUgd2hvbGVcbi8vIGNoYW5nZT9cbi8vXG4vLyBvcHRpb25zOlxuLy8gICAtIGlzSW5zZXJ0IGlzIHNldCB3aGVuIF9tb2RpZnkgaXMgYmVpbmcgY2FsbGVkIHRvIGNvbXB1dGUgdGhlIGRvY3VtZW50IHRvXG4vLyAgICAgaW5zZXJ0IGFzIHBhcnQgb2YgYW4gdXBzZXJ0IG9wZXJhdGlvbi4gV2UgdXNlIHRoaXMgcHJpbWFyaWx5IHRvIGZpZ3VyZVxuLy8gICAgIG91dCB3aGVuIHRvIHNldCB0aGUgZmllbGRzIGluICRzZXRPbkluc2VydCwgaWYgcHJlc2VudC5cbkxvY2FsQ29sbGVjdGlvbi5fbW9kaWZ5ID0gKGRvYywgbW9kaWZpZXIsIG9wdGlvbnMgPSB7fSkgPT4ge1xuICBpZiAoIUxvY2FsQ29sbGVjdGlvbi5faXNQbGFpbk9iamVjdChtb2RpZmllcikpIHtcbiAgICB0aHJvdyBNaW5pbW9uZ29FcnJvcignTW9kaWZpZXIgbXVzdCBiZSBhbiBvYmplY3QnKTtcbiAgfVxuXG4gIC8vIE1ha2Ugc3VyZSB0aGUgY2FsbGVyIGNhbid0IG11dGF0ZSBvdXIgZGF0YSBzdHJ1Y3R1cmVzLlxuICBtb2RpZmllciA9IEVKU09OLmNsb25lKG1vZGlmaWVyKTtcblxuICBjb25zdCBpc01vZGlmaWVyID0gaXNPcGVyYXRvck9iamVjdChtb2RpZmllcik7XG4gIGNvbnN0IG5ld0RvYyA9IGlzTW9kaWZpZXIgPyBFSlNPTi5jbG9uZShkb2MpIDogbW9kaWZpZXI7XG5cbiAgaWYgKGlzTW9kaWZpZXIpIHtcbiAgICAvLyBhcHBseSBtb2RpZmllcnMgdG8gdGhlIGRvYy5cbiAgICBPYmplY3Qua2V5cyhtb2RpZmllcikuZm9yRWFjaChvcGVyYXRvciA9PiB7XG4gICAgICAvLyBUcmVhdCAkc2V0T25JbnNlcnQgYXMgJHNldCBpZiB0aGlzIGlzIGFuIGluc2VydC5cbiAgICAgIGNvbnN0IHNldE9uSW5zZXJ0ID0gb3B0aW9ucy5pc0luc2VydCAmJiBvcGVyYXRvciA9PT0gJyRzZXRPbkluc2VydCc7XG4gICAgICBjb25zdCBtb2RGdW5jID0gTU9ESUZJRVJTW3NldE9uSW5zZXJ0ID8gJyRzZXQnIDogb3BlcmF0b3JdO1xuICAgICAgY29uc3Qgb3BlcmFuZCA9IG1vZGlmaWVyW29wZXJhdG9yXTtcblxuICAgICAgaWYgKCFtb2RGdW5jKSB7XG4gICAgICAgIHRocm93IE1pbmltb25nb0Vycm9yKGBJbnZhbGlkIG1vZGlmaWVyIHNwZWNpZmllZCAke29wZXJhdG9yfWApO1xuICAgICAgfVxuXG4gICAgICBPYmplY3Qua2V5cyhvcGVyYW5kKS5mb3JFYWNoKGtleXBhdGggPT4ge1xuICAgICAgICBjb25zdCBhcmcgPSBvcGVyYW5kW2tleXBhdGhdO1xuXG4gICAgICAgIGlmIChrZXlwYXRoID09PSAnJykge1xuICAgICAgICAgIHRocm93IE1pbmltb25nb0Vycm9yKCdBbiBlbXB0eSB1cGRhdGUgcGF0aCBpcyBub3QgdmFsaWQuJyk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBrZXlwYXJ0cyA9IGtleXBhdGguc3BsaXQoJy4nKTtcblxuICAgICAgICBpZiAoIWtleXBhcnRzLmV2ZXJ5KEJvb2xlYW4pKSB7XG4gICAgICAgICAgdGhyb3cgTWluaW1vbmdvRXJyb3IoXG4gICAgICAgICAgICBgVGhlIHVwZGF0ZSBwYXRoICcke2tleXBhdGh9JyBjb250YWlucyBhbiBlbXB0eSBmaWVsZCBuYW1lLCBgICtcbiAgICAgICAgICAgICd3aGljaCBpcyBub3QgYWxsb3dlZC4nXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHRhcmdldCA9IGZpbmRNb2RUYXJnZXQobmV3RG9jLCBrZXlwYXJ0cywge1xuICAgICAgICAgIGFycmF5SW5kaWNlczogb3B0aW9ucy5hcnJheUluZGljZXMsXG4gICAgICAgICAgZm9yYmlkQXJyYXk6IG9wZXJhdG9yID09PSAnJHJlbmFtZScsXG4gICAgICAgICAgbm9DcmVhdGU6IE5PX0NSRUFURV9NT0RJRklFUlNbb3BlcmF0b3JdXG4gICAgICAgIH0pO1xuXG4gICAgICAgIG1vZEZ1bmModGFyZ2V0LCBrZXlwYXJ0cy5wb3AoKSwgYXJnLCBrZXlwYXRoLCBuZXdEb2MpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpZiAoZG9jLl9pZCAmJiAhRUpTT04uZXF1YWxzKGRvYy5faWQsIG5ld0RvYy5faWQpKSB7XG4gICAgICB0aHJvdyBNaW5pbW9uZ29FcnJvcihcbiAgICAgICAgYEFmdGVyIGFwcGx5aW5nIHRoZSB1cGRhdGUgdG8gdGhlIGRvY3VtZW50IHtfaWQ6IFwiJHtkb2MuX2lkfVwiLCAuLi59LGAgK1xuICAgICAgICAnIHRoZSAoaW1tdXRhYmxlKSBmaWVsZCBcXCdfaWRcXCcgd2FzIGZvdW5kIHRvIGhhdmUgYmVlbiBhbHRlcmVkIHRvICcgK1xuICAgICAgICBgX2lkOiBcIiR7bmV3RG9jLl9pZH1cImBcbiAgICAgICk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChkb2MuX2lkICYmIG1vZGlmaWVyLl9pZCAmJiAhRUpTT04uZXF1YWxzKGRvYy5faWQsIG1vZGlmaWVyLl9pZCkpIHtcbiAgICAgIHRocm93IE1pbmltb25nb0Vycm9yKFxuICAgICAgICBgVGhlIF9pZCBmaWVsZCBjYW5ub3QgYmUgY2hhbmdlZCBmcm9tIHtfaWQ6IFwiJHtkb2MuX2lkfVwifSB0byBgICtcbiAgICAgICAgYHtfaWQ6IFwiJHttb2RpZmllci5faWR9XCJ9YFxuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyByZXBsYWNlIHRoZSB3aG9sZSBkb2N1bWVudFxuICAgIGFzc2VydEhhc1ZhbGlkRmllbGROYW1lcyhtb2RpZmllcik7XG4gIH1cblxuICAvLyBtb3ZlIG5ldyBkb2N1bWVudCBpbnRvIHBsYWNlLlxuICBPYmplY3Qua2V5cyhkb2MpLmZvckVhY2goa2V5ID0+IHtcbiAgICAvLyBOb3RlOiB0aGlzIHVzZWQgdG8gYmUgZm9yICh2YXIga2V5IGluIGRvYykgaG93ZXZlciwgdGhpcyBkb2VzIG5vdFxuICAgIC8vIHdvcmsgcmlnaHQgaW4gT3BlcmEuIERlbGV0aW5nIGZyb20gYSBkb2Mgd2hpbGUgaXRlcmF0aW5nIG92ZXIgaXRcbiAgICAvLyB3b3VsZCBzb21ldGltZXMgY2F1c2Ugb3BlcmEgdG8gc2tpcCBzb21lIGtleXMuXG4gICAgaWYgKGtleSAhPT0gJ19pZCcpIHtcbiAgICAgIGRlbGV0ZSBkb2Nba2V5XTtcbiAgICB9XG4gIH0pO1xuXG4gIE9iamVjdC5rZXlzKG5ld0RvYykuZm9yRWFjaChrZXkgPT4ge1xuICAgIGRvY1trZXldID0gbmV3RG9jW2tleV07XG4gIH0pO1xufTtcblxuTG9jYWxDb2xsZWN0aW9uLl9vYnNlcnZlRnJvbU9ic2VydmVDaGFuZ2VzID0gKGN1cnNvciwgb2JzZXJ2ZUNhbGxiYWNrcykgPT4ge1xuICBjb25zdCB0cmFuc2Zvcm0gPSBjdXJzb3IuZ2V0VHJhbnNmb3JtKCkgfHwgKGRvYyA9PiBkb2MpO1xuICBsZXQgc3VwcHJlc3NlZCA9ICEhb2JzZXJ2ZUNhbGxiYWNrcy5fc3VwcHJlc3NfaW5pdGlhbDtcblxuICBsZXQgb2JzZXJ2ZUNoYW5nZXNDYWxsYmFja3M7XG4gIGlmIChMb2NhbENvbGxlY3Rpb24uX29ic2VydmVDYWxsYmFja3NBcmVPcmRlcmVkKG9ic2VydmVDYWxsYmFja3MpKSB7XG4gICAgLy8gVGhlIFwiX25vX2luZGljZXNcIiBvcHRpb24gc2V0cyBhbGwgaW5kZXggYXJndW1lbnRzIHRvIC0xIGFuZCBza2lwcyB0aGVcbiAgICAvLyBsaW5lYXIgc2NhbnMgcmVxdWlyZWQgdG8gZ2VuZXJhdGUgdGhlbS4gIFRoaXMgbGV0cyBvYnNlcnZlcnMgdGhhdCBkb24ndFxuICAgIC8vIG5lZWQgYWJzb2x1dGUgaW5kaWNlcyBiZW5lZml0IGZyb20gdGhlIG90aGVyIGZlYXR1cmVzIG9mIHRoaXMgQVBJIC0tXG4gICAgLy8gcmVsYXRpdmUgb3JkZXIsIHRyYW5zZm9ybXMsIGFuZCBhcHBseUNoYW5nZXMgLS0gd2l0aG91dCB0aGUgc3BlZWQgaGl0LlxuICAgIGNvbnN0IGluZGljZXMgPSAhb2JzZXJ2ZUNhbGxiYWNrcy5fbm9faW5kaWNlcztcblxuICAgIG9ic2VydmVDaGFuZ2VzQ2FsbGJhY2tzID0ge1xuICAgICAgYWRkZWRCZWZvcmUoaWQsIGZpZWxkcywgYmVmb3JlKSB7XG4gICAgICAgIGlmIChzdXBwcmVzc2VkIHx8ICEob2JzZXJ2ZUNhbGxiYWNrcy5hZGRlZEF0IHx8IG9ic2VydmVDYWxsYmFja3MuYWRkZWQpKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZG9jID0gdHJhbnNmb3JtKE9iamVjdC5hc3NpZ24oZmllbGRzLCB7X2lkOiBpZH0pKTtcblxuICAgICAgICBpZiAob2JzZXJ2ZUNhbGxiYWNrcy5hZGRlZEF0KSB7XG4gICAgICAgICAgb2JzZXJ2ZUNhbGxiYWNrcy5hZGRlZEF0KFxuICAgICAgICAgICAgZG9jLFxuICAgICAgICAgICAgaW5kaWNlc1xuICAgICAgICAgICAgICA/IGJlZm9yZVxuICAgICAgICAgICAgICAgID8gdGhpcy5kb2NzLmluZGV4T2YoYmVmb3JlKVxuICAgICAgICAgICAgICAgIDogdGhpcy5kb2NzLnNpemUoKVxuICAgICAgICAgICAgICA6IC0xLFxuICAgICAgICAgICAgYmVmb3JlXG4gICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvYnNlcnZlQ2FsbGJhY2tzLmFkZGVkKGRvYyk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBjaGFuZ2VkKGlkLCBmaWVsZHMpIHtcbiAgICAgICAgaWYgKCEob2JzZXJ2ZUNhbGxiYWNrcy5jaGFuZ2VkQXQgfHwgb2JzZXJ2ZUNhbGxiYWNrcy5jaGFuZ2VkKSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBkb2MgPSBFSlNPTi5jbG9uZSh0aGlzLmRvY3MuZ2V0KGlkKSk7XG4gICAgICAgIGlmICghZG9jKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmtub3duIGlkIGZvciBjaGFuZ2VkOiAke2lkfWApO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgb2xkRG9jID0gdHJhbnNmb3JtKEVKU09OLmNsb25lKGRvYykpO1xuXG4gICAgICAgIERpZmZTZXF1ZW5jZS5hcHBseUNoYW5nZXMoZG9jLCBmaWVsZHMpO1xuXG4gICAgICAgIGlmIChvYnNlcnZlQ2FsbGJhY2tzLmNoYW5nZWRBdCkge1xuICAgICAgICAgIG9ic2VydmVDYWxsYmFja3MuY2hhbmdlZEF0KFxuICAgICAgICAgICAgdHJhbnNmb3JtKGRvYyksXG4gICAgICAgICAgICBvbGREb2MsXG4gICAgICAgICAgICBpbmRpY2VzID8gdGhpcy5kb2NzLmluZGV4T2YoaWQpIDogLTFcbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG9ic2VydmVDYWxsYmFja3MuY2hhbmdlZCh0cmFuc2Zvcm0oZG9jKSwgb2xkRG9jKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIG1vdmVkQmVmb3JlKGlkLCBiZWZvcmUpIHtcbiAgICAgICAgaWYgKCFvYnNlcnZlQ2FsbGJhY2tzLm1vdmVkVG8pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBmcm9tID0gaW5kaWNlcyA/IHRoaXMuZG9jcy5pbmRleE9mKGlkKSA6IC0xO1xuICAgICAgICBsZXQgdG8gPSBpbmRpY2VzXG4gICAgICAgICAgPyBiZWZvcmVcbiAgICAgICAgICAgID8gdGhpcy5kb2NzLmluZGV4T2YoYmVmb3JlKVxuICAgICAgICAgICAgOiB0aGlzLmRvY3Muc2l6ZSgpXG4gICAgICAgICAgOiAtMTtcblxuICAgICAgICAvLyBXaGVuIG5vdCBtb3ZpbmcgYmFja3dhcmRzLCBhZGp1c3QgZm9yIHRoZSBmYWN0IHRoYXQgcmVtb3ZpbmcgdGhlXG4gICAgICAgIC8vIGRvY3VtZW50IHNsaWRlcyBldmVyeXRoaW5nIGJhY2sgb25lIHNsb3QuXG4gICAgICAgIGlmICh0byA+IGZyb20pIHtcbiAgICAgICAgICAtLXRvO1xuICAgICAgICB9XG5cbiAgICAgICAgb2JzZXJ2ZUNhbGxiYWNrcy5tb3ZlZFRvKFxuICAgICAgICAgIHRyYW5zZm9ybShFSlNPTi5jbG9uZSh0aGlzLmRvY3MuZ2V0KGlkKSkpLFxuICAgICAgICAgIGZyb20sXG4gICAgICAgICAgdG8sXG4gICAgICAgICAgYmVmb3JlIHx8IG51bGxcbiAgICAgICAgKTtcbiAgICAgIH0sXG4gICAgICByZW1vdmVkKGlkKSB7XG4gICAgICAgIGlmICghKG9ic2VydmVDYWxsYmFja3MucmVtb3ZlZEF0IHx8IG9ic2VydmVDYWxsYmFja3MucmVtb3ZlZCkpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyB0ZWNobmljYWxseSBtYXliZSB0aGVyZSBzaG91bGQgYmUgYW4gRUpTT04uY2xvbmUgaGVyZSwgYnV0IGl0J3MgYWJvdXRcbiAgICAgICAgLy8gdG8gYmUgcmVtb3ZlZCBmcm9tIHRoaXMuZG9jcyFcbiAgICAgICAgY29uc3QgZG9jID0gdHJhbnNmb3JtKHRoaXMuZG9jcy5nZXQoaWQpKTtcblxuICAgICAgICBpZiAob2JzZXJ2ZUNhbGxiYWNrcy5yZW1vdmVkQXQpIHtcbiAgICAgICAgICBvYnNlcnZlQ2FsbGJhY2tzLnJlbW92ZWRBdChkb2MsIGluZGljZXMgPyB0aGlzLmRvY3MuaW5kZXhPZihpZCkgOiAtMSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb2JzZXJ2ZUNhbGxiYWNrcy5yZW1vdmVkKGRvYyk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICBvYnNlcnZlQ2hhbmdlc0NhbGxiYWNrcyA9IHtcbiAgICAgIGFkZGVkKGlkLCBmaWVsZHMpIHtcbiAgICAgICAgaWYgKCFzdXBwcmVzc2VkICYmIG9ic2VydmVDYWxsYmFja3MuYWRkZWQpIHtcbiAgICAgICAgICBvYnNlcnZlQ2FsbGJhY2tzLmFkZGVkKHRyYW5zZm9ybShPYmplY3QuYXNzaWduKGZpZWxkcywge19pZDogaWR9KSkpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgY2hhbmdlZChpZCwgZmllbGRzKSB7XG4gICAgICAgIGlmIChvYnNlcnZlQ2FsbGJhY2tzLmNoYW5nZWQpIHtcbiAgICAgICAgICBjb25zdCBvbGREb2MgPSB0aGlzLmRvY3MuZ2V0KGlkKTtcbiAgICAgICAgICBjb25zdCBkb2MgPSBFSlNPTi5jbG9uZShvbGREb2MpO1xuXG4gICAgICAgICAgRGlmZlNlcXVlbmNlLmFwcGx5Q2hhbmdlcyhkb2MsIGZpZWxkcyk7XG5cbiAgICAgICAgICBvYnNlcnZlQ2FsbGJhY2tzLmNoYW5nZWQoXG4gICAgICAgICAgICB0cmFuc2Zvcm0oZG9jKSxcbiAgICAgICAgICAgIHRyYW5zZm9ybShFSlNPTi5jbG9uZShvbGREb2MpKVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICByZW1vdmVkKGlkKSB7XG4gICAgICAgIGlmIChvYnNlcnZlQ2FsbGJhY2tzLnJlbW92ZWQpIHtcbiAgICAgICAgICBvYnNlcnZlQ2FsbGJhY2tzLnJlbW92ZWQodHJhbnNmb3JtKHRoaXMuZG9jcy5nZXQoaWQpKSk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG4gIGNvbnN0IGNoYW5nZU9ic2VydmVyID0gbmV3IExvY2FsQ29sbGVjdGlvbi5fQ2FjaGluZ0NoYW5nZU9ic2VydmVyKHtcbiAgICBjYWxsYmFja3M6IG9ic2VydmVDaGFuZ2VzQ2FsbGJhY2tzXG4gIH0pO1xuXG4gIGNvbnN0IGhhbmRsZSA9IGN1cnNvci5vYnNlcnZlQ2hhbmdlcyhjaGFuZ2VPYnNlcnZlci5hcHBseUNoYW5nZSk7XG5cbiAgc3VwcHJlc3NlZCA9IGZhbHNlO1xuXG4gIHJldHVybiBoYW5kbGU7XG59O1xuXG5Mb2NhbENvbGxlY3Rpb24uX29ic2VydmVDYWxsYmFja3NBcmVPcmRlcmVkID0gY2FsbGJhY2tzID0+IHtcbiAgaWYgKGNhbGxiYWNrcy5hZGRlZCAmJiBjYWxsYmFja3MuYWRkZWRBdCkge1xuICAgIHRocm93IG5ldyBFcnJvcignUGxlYXNlIHNwZWNpZnkgb25seSBvbmUgb2YgYWRkZWQoKSBhbmQgYWRkZWRBdCgpJyk7XG4gIH1cblxuICBpZiAoY2FsbGJhY2tzLmNoYW5nZWQgJiYgY2FsbGJhY2tzLmNoYW5nZWRBdCkge1xuICAgIHRocm93IG5ldyBFcnJvcignUGxlYXNlIHNwZWNpZnkgb25seSBvbmUgb2YgY2hhbmdlZCgpIGFuZCBjaGFuZ2VkQXQoKScpO1xuICB9XG5cbiAgaWYgKGNhbGxiYWNrcy5yZW1vdmVkICYmIGNhbGxiYWNrcy5yZW1vdmVkQXQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1BsZWFzZSBzcGVjaWZ5IG9ubHkgb25lIG9mIHJlbW92ZWQoKSBhbmQgcmVtb3ZlZEF0KCknKTtcbiAgfVxuXG4gIHJldHVybiAhIShcbiAgICBjYWxsYmFja3MuYWRkZWRBdCB8fFxuICAgIGNhbGxiYWNrcy5jaGFuZ2VkQXQgfHxcbiAgICBjYWxsYmFja3MubW92ZWRUbyB8fFxuICAgIGNhbGxiYWNrcy5yZW1vdmVkQXRcbiAgKTtcbn07XG5cbkxvY2FsQ29sbGVjdGlvbi5fb2JzZXJ2ZUNoYW5nZXNDYWxsYmFja3NBcmVPcmRlcmVkID0gY2FsbGJhY2tzID0+IHtcbiAgaWYgKGNhbGxiYWNrcy5hZGRlZCAmJiBjYWxsYmFja3MuYWRkZWRCZWZvcmUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1BsZWFzZSBzcGVjaWZ5IG9ubHkgb25lIG9mIGFkZGVkKCkgYW5kIGFkZGVkQmVmb3JlKCknKTtcbiAgfVxuXG4gIHJldHVybiAhIShjYWxsYmFja3MuYWRkZWRCZWZvcmUgfHwgY2FsbGJhY2tzLm1vdmVkQmVmb3JlKTtcbn07XG5cbkxvY2FsQ29sbGVjdGlvbi5fcmVtb3ZlRnJvbVJlc3VsdHMgPSAocXVlcnksIGRvYykgPT4ge1xuICBpZiAocXVlcnkub3JkZXJlZCkge1xuICAgIGNvbnN0IGkgPSBMb2NhbENvbGxlY3Rpb24uX2ZpbmRJbk9yZGVyZWRSZXN1bHRzKHF1ZXJ5LCBkb2MpO1xuXG4gICAgcXVlcnkucmVtb3ZlZChkb2MuX2lkKTtcbiAgICBxdWVyeS5yZXN1bHRzLnNwbGljZShpLCAxKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBpZCA9IGRvYy5faWQ7ICAvLyBpbiBjYXNlIGNhbGxiYWNrIG11dGF0ZXMgZG9jXG5cbiAgICBxdWVyeS5yZW1vdmVkKGRvYy5faWQpO1xuICAgIHF1ZXJ5LnJlc3VsdHMucmVtb3ZlKGlkKTtcbiAgfVxufTtcblxuLy8gSXMgdGhpcyBzZWxlY3RvciBqdXN0IHNob3J0aGFuZCBmb3IgbG9va3VwIGJ5IF9pZD9cbkxvY2FsQ29sbGVjdGlvbi5fc2VsZWN0b3JJc0lkID0gc2VsZWN0b3IgPT5cbiAgdHlwZW9mIHNlbGVjdG9yID09PSAnbnVtYmVyJyB8fFxuICB0eXBlb2Ygc2VsZWN0b3IgPT09ICdzdHJpbmcnIHx8XG4gIHNlbGVjdG9yIGluc3RhbmNlb2YgTW9uZ29JRC5PYmplY3RJRFxuO1xuXG4vLyBJcyB0aGUgc2VsZWN0b3IganVzdCBsb29rdXAgYnkgX2lkIChzaG9ydGhhbmQgb3Igbm90KT9cbkxvY2FsQ29sbGVjdGlvbi5fc2VsZWN0b3JJc0lkUGVyaGFwc0FzT2JqZWN0ID0gc2VsZWN0b3IgPT5cbiAgTG9jYWxDb2xsZWN0aW9uLl9zZWxlY3RvcklzSWQoc2VsZWN0b3IpIHx8XG4gIExvY2FsQ29sbGVjdGlvbi5fc2VsZWN0b3JJc0lkKHNlbGVjdG9yICYmIHNlbGVjdG9yLl9pZCkgJiZcbiAgT2JqZWN0LmtleXMoc2VsZWN0b3IpLmxlbmd0aCA9PT0gMVxuO1xuXG5Mb2NhbENvbGxlY3Rpb24uX3VwZGF0ZUluUmVzdWx0cyA9IChxdWVyeSwgZG9jLCBvbGRfZG9jKSA9PiB7XG4gIGlmICghRUpTT04uZXF1YWxzKGRvYy5faWQsIG9sZF9kb2MuX2lkKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignQ2FuXFwndCBjaGFuZ2UgYSBkb2NcXCdzIF9pZCB3aGlsZSB1cGRhdGluZycpO1xuICB9XG5cbiAgY29uc3QgcHJvamVjdGlvbkZuID0gcXVlcnkucHJvamVjdGlvbkZuO1xuICBjb25zdCBjaGFuZ2VkRmllbGRzID0gRGlmZlNlcXVlbmNlLm1ha2VDaGFuZ2VkRmllbGRzKFxuICAgIHByb2plY3Rpb25Gbihkb2MpLFxuICAgIHByb2plY3Rpb25GbihvbGRfZG9jKVxuICApO1xuXG4gIGlmICghcXVlcnkub3JkZXJlZCkge1xuICAgIGlmIChPYmplY3Qua2V5cyhjaGFuZ2VkRmllbGRzKS5sZW5ndGgpIHtcbiAgICAgIHF1ZXJ5LmNoYW5nZWQoZG9jLl9pZCwgY2hhbmdlZEZpZWxkcyk7XG4gICAgICBxdWVyeS5yZXN1bHRzLnNldChkb2MuX2lkLCBkb2MpO1xuICAgIH1cblxuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IG9sZF9pZHggPSBMb2NhbENvbGxlY3Rpb24uX2ZpbmRJbk9yZGVyZWRSZXN1bHRzKHF1ZXJ5LCBkb2MpO1xuXG4gIGlmIChPYmplY3Qua2V5cyhjaGFuZ2VkRmllbGRzKS5sZW5ndGgpIHtcbiAgICBxdWVyeS5jaGFuZ2VkKGRvYy5faWQsIGNoYW5nZWRGaWVsZHMpO1xuICB9XG5cbiAgaWYgKCFxdWVyeS5zb3J0ZXIpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBqdXN0IHRha2UgaXQgb3V0IGFuZCBwdXQgaXQgYmFjayBpbiBhZ2FpbiwgYW5kIHNlZSBpZiB0aGUgaW5kZXggY2hhbmdlc1xuICBxdWVyeS5yZXN1bHRzLnNwbGljZShvbGRfaWR4LCAxKTtcblxuICBjb25zdCBuZXdfaWR4ID0gTG9jYWxDb2xsZWN0aW9uLl9pbnNlcnRJblNvcnRlZExpc3QoXG4gICAgcXVlcnkuc29ydGVyLmdldENvbXBhcmF0b3Ioe2Rpc3RhbmNlczogcXVlcnkuZGlzdGFuY2VzfSksXG4gICAgcXVlcnkucmVzdWx0cyxcbiAgICBkb2NcbiAgKTtcblxuICBpZiAob2xkX2lkeCAhPT0gbmV3X2lkeCkge1xuICAgIGxldCBuZXh0ID0gcXVlcnkucmVzdWx0c1tuZXdfaWR4ICsgMV07XG4gICAgaWYgKG5leHQpIHtcbiAgICAgIG5leHQgPSBuZXh0Ll9pZDtcbiAgICB9IGVsc2Uge1xuICAgICAgbmV4dCA9IG51bGw7XG4gICAgfVxuXG4gICAgcXVlcnkubW92ZWRCZWZvcmUgJiYgcXVlcnkubW92ZWRCZWZvcmUoZG9jLl9pZCwgbmV4dCk7XG4gIH1cbn07XG5cbmNvbnN0IE1PRElGSUVSUyA9IHtcbiAgJGN1cnJlbnREYXRlKHRhcmdldCwgZmllbGQsIGFyZykge1xuICAgIGlmICh0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBoYXNPd24uY2FsbChhcmcsICckdHlwZScpKSB7XG4gICAgICBpZiAoYXJnLiR0eXBlICE9PSAnZGF0ZScpIHtcbiAgICAgICAgdGhyb3cgTWluaW1vbmdvRXJyb3IoXG4gICAgICAgICAgJ01pbmltb25nbyBkb2VzIGN1cnJlbnRseSBvbmx5IHN1cHBvcnQgdGhlIGRhdGUgdHlwZSBpbiAnICtcbiAgICAgICAgICAnJGN1cnJlbnREYXRlIG1vZGlmaWVycycsXG4gICAgICAgICAge2ZpZWxkfVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoYXJnICE9PSB0cnVlKSB7XG4gICAgICB0aHJvdyBNaW5pbW9uZ29FcnJvcignSW52YWxpZCAkY3VycmVudERhdGUgbW9kaWZpZXInLCB7ZmllbGR9KTtcbiAgICB9XG5cbiAgICB0YXJnZXRbZmllbGRdID0gbmV3IERhdGUoKTtcbiAgfSxcbiAgJG1pbih0YXJnZXQsIGZpZWxkLCBhcmcpIHtcbiAgICBpZiAodHlwZW9mIGFyZyAhPT0gJ251bWJlcicpIHtcbiAgICAgIHRocm93IE1pbmltb25nb0Vycm9yKCdNb2RpZmllciAkbWluIGFsbG93ZWQgZm9yIG51bWJlcnMgb25seScsIHtmaWVsZH0pO1xuICAgIH1cblxuICAgIGlmIChmaWVsZCBpbiB0YXJnZXQpIHtcbiAgICAgIGlmICh0eXBlb2YgdGFyZ2V0W2ZpZWxkXSAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgdGhyb3cgTWluaW1vbmdvRXJyb3IoXG4gICAgICAgICAgJ0Nhbm5vdCBhcHBseSAkbWluIG1vZGlmaWVyIHRvIG5vbi1udW1iZXInLFxuICAgICAgICAgIHtmaWVsZH1cbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRhcmdldFtmaWVsZF0gPiBhcmcpIHtcbiAgICAgICAgdGFyZ2V0W2ZpZWxkXSA9IGFyZztcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGFyZ2V0W2ZpZWxkXSA9IGFyZztcbiAgICB9XG4gIH0sXG4gICRtYXgodGFyZ2V0LCBmaWVsZCwgYXJnKSB7XG4gICAgaWYgKHR5cGVvZiBhcmcgIT09ICdudW1iZXInKSB7XG4gICAgICB0aHJvdyBNaW5pbW9uZ29FcnJvcignTW9kaWZpZXIgJG1heCBhbGxvd2VkIGZvciBudW1iZXJzIG9ubHknLCB7ZmllbGR9KTtcbiAgICB9XG5cbiAgICBpZiAoZmllbGQgaW4gdGFyZ2V0KSB7XG4gICAgICBpZiAodHlwZW9mIHRhcmdldFtmaWVsZF0gIT09ICdudW1iZXInKSB7XG4gICAgICAgIHRocm93IE1pbmltb25nb0Vycm9yKFxuICAgICAgICAgICdDYW5ub3QgYXBwbHkgJG1heCBtb2RpZmllciB0byBub24tbnVtYmVyJyxcbiAgICAgICAgICB7ZmllbGR9XG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0YXJnZXRbZmllbGRdIDwgYXJnKSB7XG4gICAgICAgIHRhcmdldFtmaWVsZF0gPSBhcmc7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRhcmdldFtmaWVsZF0gPSBhcmc7XG4gICAgfVxuICB9LFxuICAkaW5jKHRhcmdldCwgZmllbGQsIGFyZykge1xuICAgIGlmICh0eXBlb2YgYXJnICE9PSAnbnVtYmVyJykge1xuICAgICAgdGhyb3cgTWluaW1vbmdvRXJyb3IoJ01vZGlmaWVyICRpbmMgYWxsb3dlZCBmb3IgbnVtYmVycyBvbmx5Jywge2ZpZWxkfSk7XG4gICAgfVxuXG4gICAgaWYgKGZpZWxkIGluIHRhcmdldCkge1xuICAgICAgaWYgKHR5cGVvZiB0YXJnZXRbZmllbGRdICE9PSAnbnVtYmVyJykge1xuICAgICAgICB0aHJvdyBNaW5pbW9uZ29FcnJvcihcbiAgICAgICAgICAnQ2Fubm90IGFwcGx5ICRpbmMgbW9kaWZpZXIgdG8gbm9uLW51bWJlcicsXG4gICAgICAgICAge2ZpZWxkfVxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICB0YXJnZXRbZmllbGRdICs9IGFyZztcbiAgICB9IGVsc2Uge1xuICAgICAgdGFyZ2V0W2ZpZWxkXSA9IGFyZztcbiAgICB9XG4gIH0sXG4gICRzZXQodGFyZ2V0LCBmaWVsZCwgYXJnKSB7XG4gICAgaWYgKHRhcmdldCAhPT0gT2JqZWN0KHRhcmdldCkpIHsgLy8gbm90IGFuIGFycmF5IG9yIGFuIG9iamVjdFxuICAgICAgY29uc3QgZXJyb3IgPSBNaW5pbW9uZ29FcnJvcihcbiAgICAgICAgJ0Nhbm5vdCBzZXQgcHJvcGVydHkgb24gbm9uLW9iamVjdCBmaWVsZCcsXG4gICAgICAgIHtmaWVsZH1cbiAgICAgICk7XG4gICAgICBlcnJvci5zZXRQcm9wZXJ0eUVycm9yID0gdHJ1ZTtcbiAgICAgIHRocm93IGVycm9yO1xuICAgIH1cblxuICAgIGlmICh0YXJnZXQgPT09IG51bGwpIHtcbiAgICAgIGNvbnN0IGVycm9yID0gTWluaW1vbmdvRXJyb3IoJ0Nhbm5vdCBzZXQgcHJvcGVydHkgb24gbnVsbCcsIHtmaWVsZH0pO1xuICAgICAgZXJyb3Iuc2V0UHJvcGVydHlFcnJvciA9IHRydWU7XG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9XG5cbiAgICBhc3NlcnRIYXNWYWxpZEZpZWxkTmFtZXMoYXJnKTtcblxuICAgIHRhcmdldFtmaWVsZF0gPSBhcmc7XG4gIH0sXG4gICRzZXRPbkluc2VydCh0YXJnZXQsIGZpZWxkLCBhcmcpIHtcbiAgICAvLyBjb252ZXJ0ZWQgdG8gYCRzZXRgIGluIGBfbW9kaWZ5YFxuICB9LFxuICAkdW5zZXQodGFyZ2V0LCBmaWVsZCwgYXJnKSB7XG4gICAgaWYgKHRhcmdldCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAodGFyZ2V0IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgaWYgKGZpZWxkIGluIHRhcmdldCkge1xuICAgICAgICAgIHRhcmdldFtmaWVsZF0gPSBudWxsO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkZWxldGUgdGFyZ2V0W2ZpZWxkXTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gICRwdXNoKHRhcmdldCwgZmllbGQsIGFyZykge1xuICAgIGlmICh0YXJnZXRbZmllbGRdID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRhcmdldFtmaWVsZF0gPSBbXTtcbiAgICB9XG5cbiAgICBpZiAoISh0YXJnZXRbZmllbGRdIGluc3RhbmNlb2YgQXJyYXkpKSB7XG4gICAgICB0aHJvdyBNaW5pbW9uZ29FcnJvcignQ2Fubm90IGFwcGx5ICRwdXNoIG1vZGlmaWVyIHRvIG5vbi1hcnJheScsIHtmaWVsZH0pO1xuICAgIH1cblxuICAgIGlmICghKGFyZyAmJiBhcmcuJGVhY2gpKSB7XG4gICAgICAvLyBTaW1wbGUgbW9kZTogbm90ICRlYWNoXG4gICAgICBhc3NlcnRIYXNWYWxpZEZpZWxkTmFtZXMoYXJnKTtcblxuICAgICAgdGFyZ2V0W2ZpZWxkXS5wdXNoKGFyZyk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBGYW5jeSBtb2RlOiAkZWFjaCAoYW5kIG1heWJlICRzbGljZSBhbmQgJHNvcnQgYW5kICRwb3NpdGlvbilcbiAgICBjb25zdCB0b1B1c2ggPSBhcmcuJGVhY2g7XG4gICAgaWYgKCEodG9QdXNoIGluc3RhbmNlb2YgQXJyYXkpKSB7XG4gICAgICB0aHJvdyBNaW5pbW9uZ29FcnJvcignJGVhY2ggbXVzdCBiZSBhbiBhcnJheScsIHtmaWVsZH0pO1xuICAgIH1cblxuICAgIGFzc2VydEhhc1ZhbGlkRmllbGROYW1lcyh0b1B1c2gpO1xuXG4gICAgLy8gUGFyc2UgJHBvc2l0aW9uXG4gICAgbGV0IHBvc2l0aW9uID0gdW5kZWZpbmVkO1xuICAgIGlmICgnJHBvc2l0aW9uJyBpbiBhcmcpIHtcbiAgICAgIGlmICh0eXBlb2YgYXJnLiRwb3NpdGlvbiAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgdGhyb3cgTWluaW1vbmdvRXJyb3IoJyRwb3NpdGlvbiBtdXN0IGJlIGEgbnVtZXJpYyB2YWx1ZScsIHtmaWVsZH0pO1xuICAgICAgfVxuXG4gICAgICAvLyBYWFggc2hvdWxkIGNoZWNrIHRvIG1ha2Ugc3VyZSBpbnRlZ2VyXG4gICAgICBpZiAoYXJnLiRwb3NpdGlvbiA8IDApIHtcbiAgICAgICAgdGhyb3cgTWluaW1vbmdvRXJyb3IoXG4gICAgICAgICAgJyRwb3NpdGlvbiBpbiAkcHVzaCBtdXN0IGJlIHplcm8gb3IgcG9zaXRpdmUnLFxuICAgICAgICAgIHtmaWVsZH1cbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgcG9zaXRpb24gPSBhcmcuJHBvc2l0aW9uO1xuICAgIH1cblxuICAgIC8vIFBhcnNlICRzbGljZS5cbiAgICBsZXQgc2xpY2UgPSB1bmRlZmluZWQ7XG4gICAgaWYgKCckc2xpY2UnIGluIGFyZykge1xuICAgICAgaWYgKHR5cGVvZiBhcmcuJHNsaWNlICE9PSAnbnVtYmVyJykge1xuICAgICAgICB0aHJvdyBNaW5pbW9uZ29FcnJvcignJHNsaWNlIG11c3QgYmUgYSBudW1lcmljIHZhbHVlJywge2ZpZWxkfSk7XG4gICAgICB9XG5cbiAgICAgIC8vIFhYWCBzaG91bGQgY2hlY2sgdG8gbWFrZSBzdXJlIGludGVnZXJcbiAgICAgIHNsaWNlID0gYXJnLiRzbGljZTtcbiAgICB9XG5cbiAgICAvLyBQYXJzZSAkc29ydC5cbiAgICBsZXQgc29ydEZ1bmN0aW9uID0gdW5kZWZpbmVkO1xuICAgIGlmIChhcmcuJHNvcnQpIHtcbiAgICAgIGlmIChzbGljZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRocm93IE1pbmltb25nb0Vycm9yKCckc29ydCByZXF1aXJlcyAkc2xpY2UgdG8gYmUgcHJlc2VudCcsIHtmaWVsZH0pO1xuICAgICAgfVxuXG4gICAgICAvLyBYWFggdGhpcyBhbGxvd3MgdXMgdG8gdXNlIGEgJHNvcnQgd2hvc2UgdmFsdWUgaXMgYW4gYXJyYXksIGJ1dCB0aGF0J3NcbiAgICAgIC8vIGFjdHVhbGx5IGFuIGV4dGVuc2lvbiBvZiB0aGUgTm9kZSBkcml2ZXIsIHNvIGl0IHdvbid0IHdvcmtcbiAgICAgIC8vIHNlcnZlci1zaWRlLiBDb3VsZCBiZSBjb25mdXNpbmchXG4gICAgICAvLyBYWFggaXMgaXQgY29ycmVjdCB0aGF0IHdlIGRvbid0IGRvIGdlby1zdHVmZiBoZXJlP1xuICAgICAgc29ydEZ1bmN0aW9uID0gbmV3IE1pbmltb25nby5Tb3J0ZXIoYXJnLiRzb3J0KS5nZXRDb21wYXJhdG9yKCk7XG5cbiAgICAgIHRvUHVzaC5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuICAgICAgICBpZiAoTG9jYWxDb2xsZWN0aW9uLl9mLl90eXBlKGVsZW1lbnQpICE9PSAzKSB7XG4gICAgICAgICAgdGhyb3cgTWluaW1vbmdvRXJyb3IoXG4gICAgICAgICAgICAnJHB1c2ggbGlrZSBtb2RpZmllcnMgdXNpbmcgJHNvcnQgcmVxdWlyZSBhbGwgZWxlbWVudHMgdG8gYmUgJyArXG4gICAgICAgICAgICAnb2JqZWN0cycsXG4gICAgICAgICAgICB7ZmllbGR9XG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gQWN0dWFsbHkgcHVzaC5cbiAgICBpZiAocG9zaXRpb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgdG9QdXNoLmZvckVhY2goZWxlbWVudCA9PiB7XG4gICAgICAgIHRhcmdldFtmaWVsZF0ucHVzaChlbGVtZW50KTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBzcGxpY2VBcmd1bWVudHMgPSBbcG9zaXRpb24sIDBdO1xuXG4gICAgICB0b1B1c2guZm9yRWFjaChlbGVtZW50ID0+IHtcbiAgICAgICAgc3BsaWNlQXJndW1lbnRzLnB1c2goZWxlbWVudCk7XG4gICAgICB9KTtcblxuICAgICAgdGFyZ2V0W2ZpZWxkXS5zcGxpY2UoLi4uc3BsaWNlQXJndW1lbnRzKTtcbiAgICB9XG5cbiAgICAvLyBBY3R1YWxseSBzb3J0LlxuICAgIGlmIChzb3J0RnVuY3Rpb24pIHtcbiAgICAgIHRhcmdldFtmaWVsZF0uc29ydChzb3J0RnVuY3Rpb24pO1xuICAgIH1cblxuICAgIC8vIEFjdHVhbGx5IHNsaWNlLlxuICAgIGlmIChzbGljZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAoc2xpY2UgPT09IDApIHtcbiAgICAgICAgdGFyZ2V0W2ZpZWxkXSA9IFtdOyAvLyBkaWZmZXJzIGZyb20gQXJyYXkuc2xpY2UhXG4gICAgICB9IGVsc2UgaWYgKHNsaWNlIDwgMCkge1xuICAgICAgICB0YXJnZXRbZmllbGRdID0gdGFyZ2V0W2ZpZWxkXS5zbGljZShzbGljZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0YXJnZXRbZmllbGRdID0gdGFyZ2V0W2ZpZWxkXS5zbGljZSgwLCBzbGljZSk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuICAkcHVzaEFsbCh0YXJnZXQsIGZpZWxkLCBhcmcpIHtcbiAgICBpZiAoISh0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICAgIHRocm93IE1pbmltb25nb0Vycm9yKCdNb2RpZmllciAkcHVzaEFsbC9wdWxsQWxsIGFsbG93ZWQgZm9yIGFycmF5cyBvbmx5Jyk7XG4gICAgfVxuXG4gICAgYXNzZXJ0SGFzVmFsaWRGaWVsZE5hbWVzKGFyZyk7XG5cbiAgICBjb25zdCB0b1B1c2ggPSB0YXJnZXRbZmllbGRdO1xuXG4gICAgaWYgKHRvUHVzaCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0YXJnZXRbZmllbGRdID0gYXJnO1xuICAgIH0gZWxzZSBpZiAoISh0b1B1c2ggaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICAgIHRocm93IE1pbmltb25nb0Vycm9yKFxuICAgICAgICAnQ2Fubm90IGFwcGx5ICRwdXNoQWxsIG1vZGlmaWVyIHRvIG5vbi1hcnJheScsXG4gICAgICAgIHtmaWVsZH1cbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRvUHVzaC5wdXNoKC4uLmFyZyk7XG4gICAgfVxuICB9LFxuICAkYWRkVG9TZXQodGFyZ2V0LCBmaWVsZCwgYXJnKSB7XG4gICAgbGV0IGlzRWFjaCA9IGZhbHNlO1xuXG4gICAgaWYgKHR5cGVvZiBhcmcgPT09ICdvYmplY3QnKSB7XG4gICAgICAvLyBjaGVjayBpZiBmaXJzdCBrZXkgaXMgJyRlYWNoJ1xuICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKGFyZyk7XG4gICAgICBpZiAoa2V5c1swXSA9PT0gJyRlYWNoJykge1xuICAgICAgICBpc0VhY2ggPSB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHZhbHVlcyA9IGlzRWFjaCA/IGFyZy4kZWFjaCA6IFthcmddO1xuXG4gICAgYXNzZXJ0SGFzVmFsaWRGaWVsZE5hbWVzKHZhbHVlcyk7XG5cbiAgICBjb25zdCB0b0FkZCA9IHRhcmdldFtmaWVsZF07XG4gICAgaWYgKHRvQWRkID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRhcmdldFtmaWVsZF0gPSB2YWx1ZXM7XG4gICAgfSBlbHNlIGlmICghKHRvQWRkIGluc3RhbmNlb2YgQXJyYXkpKSB7XG4gICAgICB0aHJvdyBNaW5pbW9uZ29FcnJvcihcbiAgICAgICAgJ0Nhbm5vdCBhcHBseSAkYWRkVG9TZXQgbW9kaWZpZXIgdG8gbm9uLWFycmF5JyxcbiAgICAgICAge2ZpZWxkfVxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFsdWVzLmZvckVhY2godmFsdWUgPT4ge1xuICAgICAgICBpZiAodG9BZGQuc29tZShlbGVtZW50ID0+IExvY2FsQ29sbGVjdGlvbi5fZi5fZXF1YWwodmFsdWUsIGVsZW1lbnQpKSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRvQWRkLnB1c2godmFsdWUpO1xuICAgICAgfSk7XG4gICAgfVxuICB9LFxuICAkcG9wKHRhcmdldCwgZmllbGQsIGFyZykge1xuICAgIGlmICh0YXJnZXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHRvUG9wID0gdGFyZ2V0W2ZpZWxkXTtcblxuICAgIGlmICh0b1BvcCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCEodG9Qb3AgaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICAgIHRocm93IE1pbmltb25nb0Vycm9yKCdDYW5ub3QgYXBwbHkgJHBvcCBtb2RpZmllciB0byBub24tYXJyYXknLCB7ZmllbGR9KTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGFyZyA9PT0gJ251bWJlcicgJiYgYXJnIDwgMCkge1xuICAgICAgdG9Qb3Auc3BsaWNlKDAsIDEpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0b1BvcC5wb3AoKTtcbiAgICB9XG4gIH0sXG4gICRwdWxsKHRhcmdldCwgZmllbGQsIGFyZykge1xuICAgIGlmICh0YXJnZXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHRvUHVsbCA9IHRhcmdldFtmaWVsZF07XG4gICAgaWYgKHRvUHVsbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCEodG9QdWxsIGluc3RhbmNlb2YgQXJyYXkpKSB7XG4gICAgICB0aHJvdyBNaW5pbW9uZ29FcnJvcihcbiAgICAgICAgJ0Nhbm5vdCBhcHBseSAkcHVsbC9wdWxsQWxsIG1vZGlmaWVyIHRvIG5vbi1hcnJheScsXG4gICAgICAgIHtmaWVsZH1cbiAgICAgICk7XG4gICAgfVxuXG4gICAgbGV0IG91dDtcbiAgICBpZiAoYXJnICE9IG51bGwgJiYgdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgIShhcmcgaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICAgIC8vIFhYWCB3b3VsZCBiZSBtdWNoIG5pY2VyIHRvIGNvbXBpbGUgdGhpcyBvbmNlLCByYXRoZXIgdGhhblxuICAgICAgLy8gZm9yIGVhY2ggZG9jdW1lbnQgd2UgbW9kaWZ5Li4gYnV0IHVzdWFsbHkgd2UncmUgbm90XG4gICAgICAvLyBtb2RpZnlpbmcgdGhhdCBtYW55IGRvY3VtZW50cywgc28gd2UnbGwgbGV0IGl0IHNsaWRlIGZvclxuICAgICAgLy8gbm93XG5cbiAgICAgIC8vIFhYWCBNaW5pbW9uZ28uTWF0Y2hlciBpc24ndCB1cCBmb3IgdGhlIGpvYiwgYmVjYXVzZSB3ZSBuZWVkXG4gICAgICAvLyB0byBwZXJtaXQgc3R1ZmYgbGlrZSB7JHB1bGw6IHthOiB7JGd0OiA0fX19Li4gc29tZXRoaW5nXG4gICAgICAvLyBsaWtlIHskZ3Q6IDR9IGlzIG5vdCBub3JtYWxseSBhIGNvbXBsZXRlIHNlbGVjdG9yLlxuICAgICAgLy8gc2FtZSBpc3N1ZSBhcyAkZWxlbU1hdGNoIHBvc3NpYmx5P1xuICAgICAgY29uc3QgbWF0Y2hlciA9IG5ldyBNaW5pbW9uZ28uTWF0Y2hlcihhcmcpO1xuXG4gICAgICBvdXQgPSB0b1B1bGwuZmlsdGVyKGVsZW1lbnQgPT4gIW1hdGNoZXIuZG9jdW1lbnRNYXRjaGVzKGVsZW1lbnQpLnJlc3VsdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dCA9IHRvUHVsbC5maWx0ZXIoZWxlbWVudCA9PiAhTG9jYWxDb2xsZWN0aW9uLl9mLl9lcXVhbChlbGVtZW50LCBhcmcpKTtcbiAgICB9XG5cbiAgICB0YXJnZXRbZmllbGRdID0gb3V0O1xuICB9LFxuICAkcHVsbEFsbCh0YXJnZXQsIGZpZWxkLCBhcmcpIHtcbiAgICBpZiAoISh0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICAgIHRocm93IE1pbmltb25nb0Vycm9yKFxuICAgICAgICAnTW9kaWZpZXIgJHB1c2hBbGwvcHVsbEFsbCBhbGxvd2VkIGZvciBhcnJheXMgb25seScsXG4gICAgICAgIHtmaWVsZH1cbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKHRhcmdldCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgdG9QdWxsID0gdGFyZ2V0W2ZpZWxkXTtcblxuICAgIGlmICh0b1B1bGwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghKHRvUHVsbCBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgdGhyb3cgTWluaW1vbmdvRXJyb3IoXG4gICAgICAgICdDYW5ub3QgYXBwbHkgJHB1bGwvcHVsbEFsbCBtb2RpZmllciB0byBub24tYXJyYXknLFxuICAgICAgICB7ZmllbGR9XG4gICAgICApO1xuICAgIH1cblxuICAgIHRhcmdldFtmaWVsZF0gPSB0b1B1bGwuZmlsdGVyKG9iamVjdCA9PlxuICAgICAgIWFyZy5zb21lKGVsZW1lbnQgPT4gTG9jYWxDb2xsZWN0aW9uLl9mLl9lcXVhbChvYmplY3QsIGVsZW1lbnQpKVxuICAgICk7XG4gIH0sXG4gICRyZW5hbWUodGFyZ2V0LCBmaWVsZCwgYXJnLCBrZXlwYXRoLCBkb2MpIHtcbiAgICAvLyBubyBpZGVhIHdoeSBtb25nbyBoYXMgdGhpcyByZXN0cmljdGlvbi4uXG4gICAgaWYgKGtleXBhdGggPT09IGFyZykge1xuICAgICAgdGhyb3cgTWluaW1vbmdvRXJyb3IoJyRyZW5hbWUgc291cmNlIG11c3QgZGlmZmVyIGZyb20gdGFyZ2V0Jywge2ZpZWxkfSk7XG4gICAgfVxuXG4gICAgaWYgKHRhcmdldCA9PT0gbnVsbCkge1xuICAgICAgdGhyb3cgTWluaW1vbmdvRXJyb3IoJyRyZW5hbWUgc291cmNlIGZpZWxkIGludmFsaWQnLCB7ZmllbGR9KTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGFyZyAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IE1pbmltb25nb0Vycm9yKCckcmVuYW1lIHRhcmdldCBtdXN0IGJlIGEgc3RyaW5nJywge2ZpZWxkfSk7XG4gICAgfVxuXG4gICAgaWYgKGFyZy5pbmNsdWRlcygnXFwwJykpIHtcbiAgICAgIC8vIE51bGwgYnl0ZXMgYXJlIG5vdCBhbGxvd2VkIGluIE1vbmdvIGZpZWxkIG5hbWVzXG4gICAgICAvLyBodHRwczovL2RvY3MubW9uZ29kYi5jb20vbWFudWFsL3JlZmVyZW5jZS9saW1pdHMvI1Jlc3RyaWN0aW9ucy1vbi1GaWVsZC1OYW1lc1xuICAgICAgdGhyb3cgTWluaW1vbmdvRXJyb3IoXG4gICAgICAgICdUaGUgXFwndG9cXCcgZmllbGQgZm9yICRyZW5hbWUgY2Fubm90IGNvbnRhaW4gYW4gZW1iZWRkZWQgbnVsbCBieXRlJyxcbiAgICAgICAge2ZpZWxkfVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAodGFyZ2V0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBvYmplY3QgPSB0YXJnZXRbZmllbGRdO1xuXG4gICAgZGVsZXRlIHRhcmdldFtmaWVsZF07XG5cbiAgICBjb25zdCBrZXlwYXJ0cyA9IGFyZy5zcGxpdCgnLicpO1xuICAgIGNvbnN0IHRhcmdldDIgPSBmaW5kTW9kVGFyZ2V0KGRvYywga2V5cGFydHMsIHtmb3JiaWRBcnJheTogdHJ1ZX0pO1xuXG4gICAgaWYgKHRhcmdldDIgPT09IG51bGwpIHtcbiAgICAgIHRocm93IE1pbmltb25nb0Vycm9yKCckcmVuYW1lIHRhcmdldCBmaWVsZCBpbnZhbGlkJywge2ZpZWxkfSk7XG4gICAgfVxuXG4gICAgdGFyZ2V0MltrZXlwYXJ0cy5wb3AoKV0gPSBvYmplY3Q7XG4gIH0sXG4gICRiaXQodGFyZ2V0LCBmaWVsZCwgYXJnKSB7XG4gICAgLy8gWFhYIG1vbmdvIG9ubHkgc3VwcG9ydHMgJGJpdCBvbiBpbnRlZ2VycywgYW5kIHdlIG9ubHkgc3VwcG9ydFxuICAgIC8vIG5hdGl2ZSBqYXZhc2NyaXB0IG51bWJlcnMgKGRvdWJsZXMpIHNvIGZhciwgc28gd2UgY2FuJ3Qgc3VwcG9ydCAkYml0XG4gICAgdGhyb3cgTWluaW1vbmdvRXJyb3IoJyRiaXQgaXMgbm90IHN1cHBvcnRlZCcsIHtmaWVsZH0pO1xuICB9LFxuICAkdigpIHtcbiAgICAvLyBBcyBkaXNjdXNzZWQgaW4gaHR0cHM6Ly9naXRodWIuY29tL21ldGVvci9tZXRlb3IvaXNzdWVzLzk2MjMsXG4gICAgLy8gdGhlIGAkdmAgb3BlcmF0b3IgaXMgbm90IG5lZWRlZCBieSBNZXRlb3IsIGJ1dCBwcm9ibGVtcyBjYW4gb2NjdXIgaWZcbiAgICAvLyBpdCdzIG5vdCBhdCBsZWFzdCBjYWxsYWJsZSAoYXMgb2YgTW9uZ28gPj0gMy42KS4gSXQncyBkZWZpbmVkIGhlcmUgYXNcbiAgICAvLyBhIG5vLW9wIHRvIHdvcmsgYXJvdW5kIHRoZXNlIHByb2JsZW1zLlxuICB9XG59O1xuXG5jb25zdCBOT19DUkVBVEVfTU9ESUZJRVJTID0ge1xuICAkcG9wOiB0cnVlLFxuICAkcHVsbDogdHJ1ZSxcbiAgJHB1bGxBbGw6IHRydWUsXG4gICRyZW5hbWU6IHRydWUsXG4gICR1bnNldDogdHJ1ZVxufTtcblxuLy8gTWFrZSBzdXJlIGZpZWxkIG5hbWVzIGRvIG5vdCBjb250YWluIE1vbmdvIHJlc3RyaWN0ZWRcbi8vIGNoYXJhY3RlcnMgKCcuJywgJyQnLCAnXFwwJykuXG4vLyBodHRwczovL2RvY3MubW9uZ29kYi5jb20vbWFudWFsL3JlZmVyZW5jZS9saW1pdHMvI1Jlc3RyaWN0aW9ucy1vbi1GaWVsZC1OYW1lc1xuY29uc3QgaW52YWxpZENoYXJNc2cgPSB7XG4gICQ6ICdzdGFydCB3aXRoIFxcJyRcXCcnLFxuICAnLic6ICdjb250YWluIFxcJy5cXCcnLFxuICAnXFwwJzogJ2NvbnRhaW4gbnVsbCBieXRlcydcbn07XG5cbi8vIGNoZWNrcyBpZiBhbGwgZmllbGQgbmFtZXMgaW4gYW4gb2JqZWN0IGFyZSB2YWxpZFxuZnVuY3Rpb24gYXNzZXJ0SGFzVmFsaWRGaWVsZE5hbWVzKGRvYykge1xuICBpZiAoZG9jICYmIHR5cGVvZiBkb2MgPT09ICdvYmplY3QnKSB7XG4gICAgSlNPTi5zdHJpbmdpZnkoZG9jLCAoa2V5LCB2YWx1ZSkgPT4ge1xuICAgICAgYXNzZXJ0SXNWYWxpZEZpZWxkTmFtZShrZXkpO1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIGFzc2VydElzVmFsaWRGaWVsZE5hbWUoa2V5KSB7XG4gIGxldCBtYXRjaDtcbiAgaWYgKHR5cGVvZiBrZXkgPT09ICdzdHJpbmcnICYmIChtYXRjaCA9IGtleS5tYXRjaCgvXlxcJHxcXC58XFwwLykpKSB7XG4gICAgdGhyb3cgTWluaW1vbmdvRXJyb3IoYEtleSAke2tleX0gbXVzdCBub3QgJHtpbnZhbGlkQ2hhck1zZ1ttYXRjaFswXV19YCk7XG4gIH1cbn1cblxuLy8gZm9yIGEuYi5jLjIuZC5lLCBrZXlwYXJ0cyBzaG91bGQgYmUgWydhJywgJ2InLCAnYycsICcyJywgJ2QnLCAnZSddLFxuLy8gYW5kIHRoZW4geW91IHdvdWxkIG9wZXJhdGUgb24gdGhlICdlJyBwcm9wZXJ0eSBvZiB0aGUgcmV0dXJuZWRcbi8vIG9iamVjdC5cbi8vXG4vLyBpZiBvcHRpb25zLm5vQ3JlYXRlIGlzIGZhbHNleSwgY3JlYXRlcyBpbnRlcm1lZGlhdGUgbGV2ZWxzIG9mXG4vLyBzdHJ1Y3R1cmUgYXMgbmVjZXNzYXJ5LCBsaWtlIG1rZGlyIC1wIChhbmQgcmFpc2VzIGFuIGV4Y2VwdGlvbiBpZlxuLy8gdGhhdCB3b3VsZCBtZWFuIGdpdmluZyBhIG5vbi1udW1lcmljIHByb3BlcnR5IHRvIGFuIGFycmF5LikgaWZcbi8vIG9wdGlvbnMubm9DcmVhdGUgaXMgdHJ1ZSwgcmV0dXJuIHVuZGVmaW5lZCBpbnN0ZWFkLlxuLy9cbi8vIG1heSBtb2RpZnkgdGhlIGxhc3QgZWxlbWVudCBvZiBrZXlwYXJ0cyB0byBzaWduYWwgdG8gdGhlIGNhbGxlciB0aGF0IGl0IG5lZWRzXG4vLyB0byB1c2UgYSBkaWZmZXJlbnQgdmFsdWUgdG8gaW5kZXggaW50byB0aGUgcmV0dXJuZWQgb2JqZWN0IChmb3IgZXhhbXBsZSxcbi8vIFsnYScsICcwMSddIC0+IFsnYScsIDFdKS5cbi8vXG4vLyBpZiBmb3JiaWRBcnJheSBpcyB0cnVlLCByZXR1cm4gbnVsbCBpZiB0aGUga2V5cGF0aCBnb2VzIHRocm91Z2ggYW4gYXJyYXkuXG4vL1xuLy8gaWYgb3B0aW9ucy5hcnJheUluZGljZXMgaXMgc2V0LCB1c2UgaXRzIGZpcnN0IGVsZW1lbnQgZm9yIHRoZSAoZmlyc3QpICckJyBpblxuLy8gdGhlIHBhdGguXG5mdW5jdGlvbiBmaW5kTW9kVGFyZ2V0KGRvYywga2V5cGFydHMsIG9wdGlvbnMgPSB7fSkge1xuICBsZXQgdXNlZEFycmF5SW5kZXggPSBmYWxzZTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGtleXBhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgbGFzdCA9IGkgPT09IGtleXBhcnRzLmxlbmd0aCAtIDE7XG4gICAgbGV0IGtleXBhcnQgPSBrZXlwYXJ0c1tpXTtcblxuICAgIGlmICghaXNJbmRleGFibGUoZG9jKSkge1xuICAgICAgaWYgKG9wdGlvbnMubm9DcmVhdGUpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZXJyb3IgPSBNaW5pbW9uZ29FcnJvcihcbiAgICAgICAgYGNhbm5vdCB1c2UgdGhlIHBhcnQgJyR7a2V5cGFydH0nIHRvIHRyYXZlcnNlICR7ZG9jfWBcbiAgICAgICk7XG4gICAgICBlcnJvci5zZXRQcm9wZXJ0eUVycm9yID0gdHJ1ZTtcbiAgICAgIHRocm93IGVycm9yO1xuICAgIH1cblxuICAgIGlmIChkb2MgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgaWYgKG9wdGlvbnMuZm9yYmlkQXJyYXkpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIGlmIChrZXlwYXJ0ID09PSAnJCcpIHtcbiAgICAgICAgaWYgKHVzZWRBcnJheUluZGV4KSB7XG4gICAgICAgICAgdGhyb3cgTWluaW1vbmdvRXJyb3IoJ1RvbyBtYW55IHBvc2l0aW9uYWwgKGkuZS4gXFwnJFxcJykgZWxlbWVudHMnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghb3B0aW9ucy5hcnJheUluZGljZXMgfHwgIW9wdGlvbnMuYXJyYXlJbmRpY2VzLmxlbmd0aCkge1xuICAgICAgICAgIHRocm93IE1pbmltb25nb0Vycm9yKFxuICAgICAgICAgICAgJ1RoZSBwb3NpdGlvbmFsIG9wZXJhdG9yIGRpZCBub3QgZmluZCB0aGUgbWF0Y2ggbmVlZGVkIGZyb20gdGhlICcgK1xuICAgICAgICAgICAgJ3F1ZXJ5J1xuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBrZXlwYXJ0ID0gb3B0aW9ucy5hcnJheUluZGljZXNbMF07XG4gICAgICAgIHVzZWRBcnJheUluZGV4ID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSBpZiAoaXNOdW1lcmljS2V5KGtleXBhcnQpKSB7XG4gICAgICAgIGtleXBhcnQgPSBwYXJzZUludChrZXlwYXJ0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChvcHRpb25zLm5vQ3JlYXRlKSB7XG4gICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRocm93IE1pbmltb25nb0Vycm9yKFxuICAgICAgICAgIGBjYW4ndCBhcHBlbmQgdG8gYXJyYXkgdXNpbmcgc3RyaW5nIGZpZWxkIG5hbWUgWyR7a2V5cGFydH1dYFxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBpZiAobGFzdCkge1xuICAgICAgICBrZXlwYXJ0c1tpXSA9IGtleXBhcnQ7IC8vIGhhbmRsZSAnYS4wMSdcbiAgICAgIH1cblxuICAgICAgaWYgKG9wdGlvbnMubm9DcmVhdGUgJiYga2V5cGFydCA+PSBkb2MubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIHdoaWxlIChkb2MubGVuZ3RoIDwga2V5cGFydCkge1xuICAgICAgICBkb2MucHVzaChudWxsKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFsYXN0KSB7XG4gICAgICAgIGlmIChkb2MubGVuZ3RoID09PSBrZXlwYXJ0KSB7XG4gICAgICAgICAgZG9jLnB1c2goe30pO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBkb2Nba2V5cGFydF0gIT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgdGhyb3cgTWluaW1vbmdvRXJyb3IoXG4gICAgICAgICAgICBgY2FuJ3QgbW9kaWZ5IGZpZWxkICcke2tleXBhcnRzW2kgKyAxXX0nIG9mIGxpc3QgdmFsdWUgYCArXG4gICAgICAgICAgICBKU09OLnN0cmluZ2lmeShkb2Nba2V5cGFydF0pXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBhc3NlcnRJc1ZhbGlkRmllbGROYW1lKGtleXBhcnQpO1xuXG4gICAgICBpZiAoIShrZXlwYXJ0IGluIGRvYykpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMubm9DcmVhdGUpIHtcbiAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFsYXN0KSB7XG4gICAgICAgICAgZG9jW2tleXBhcnRdID0ge307XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobGFzdCkge1xuICAgICAgcmV0dXJuIGRvYztcbiAgICB9XG5cbiAgICBkb2MgPSBkb2Nba2V5cGFydF07XG4gIH1cblxuICAvLyBub3RyZWFjaGVkXG59XG4iLCJpbXBvcnQgTG9jYWxDb2xsZWN0aW9uIGZyb20gJy4vbG9jYWxfY29sbGVjdGlvbi5qcyc7XG5pbXBvcnQge1xuICBjb21waWxlRG9jdW1lbnRTZWxlY3RvcixcbiAgaGFzT3duLFxuICBub3RoaW5nTWF0Y2hlcixcbn0gZnJvbSAnLi9jb21tb24uanMnO1xuXG4vLyBUaGUgbWluaW1vbmdvIHNlbGVjdG9yIGNvbXBpbGVyIVxuXG4vLyBUZXJtaW5vbG9neTpcbi8vICAtIGEgJ3NlbGVjdG9yJyBpcyB0aGUgRUpTT04gb2JqZWN0IHJlcHJlc2VudGluZyBhIHNlbGVjdG9yXG4vLyAgLSBhICdtYXRjaGVyJyBpcyBpdHMgY29tcGlsZWQgZm9ybSAod2hldGhlciBhIGZ1bGwgTWluaW1vbmdvLk1hdGNoZXJcbi8vICAgIG9iamVjdCBvciBvbmUgb2YgdGhlIGNvbXBvbmVudCBsYW1iZGFzIHRoYXQgbWF0Y2hlcyBwYXJ0cyBvZiBpdClcbi8vICAtIGEgJ3Jlc3VsdCBvYmplY3QnIGlzIGFuIG9iamVjdCB3aXRoIGEgJ3Jlc3VsdCcgZmllbGQgYW5kIG1heWJlXG4vLyAgICBkaXN0YW5jZSBhbmQgYXJyYXlJbmRpY2VzLlxuLy8gIC0gYSAnYnJhbmNoZWQgdmFsdWUnIGlzIGFuIG9iamVjdCB3aXRoIGEgJ3ZhbHVlJyBmaWVsZCBhbmQgbWF5YmVcbi8vICAgICdkb250SXRlcmF0ZScgYW5kICdhcnJheUluZGljZXMnLlxuLy8gIC0gYSAnZG9jdW1lbnQnIGlzIGEgdG9wLWxldmVsIG9iamVjdCB0aGF0IGNhbiBiZSBzdG9yZWQgaW4gYSBjb2xsZWN0aW9uLlxuLy8gIC0gYSAnbG9va3VwIGZ1bmN0aW9uJyBpcyBhIGZ1bmN0aW9uIHRoYXQgdGFrZXMgaW4gYSBkb2N1bWVudCBhbmQgcmV0dXJuc1xuLy8gICAgYW4gYXJyYXkgb2YgJ2JyYW5jaGVkIHZhbHVlcycuXG4vLyAgLSBhICdicmFuY2hlZCBtYXRjaGVyJyBtYXBzIGZyb20gYW4gYXJyYXkgb2YgYnJhbmNoZWQgdmFsdWVzIHRvIGEgcmVzdWx0XG4vLyAgICBvYmplY3QuXG4vLyAgLSBhbiAnZWxlbWVudCBtYXRjaGVyJyBtYXBzIGZyb20gYSBzaW5nbGUgdmFsdWUgdG8gYSBib29sLlxuXG4vLyBNYWluIGVudHJ5IHBvaW50LlxuLy8gICB2YXIgbWF0Y2hlciA9IG5ldyBNaW5pbW9uZ28uTWF0Y2hlcih7YTogeyRndDogNX19KTtcbi8vICAgaWYgKG1hdGNoZXIuZG9jdW1lbnRNYXRjaGVzKHthOiA3fSkpIC4uLlxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWF0Y2hlciB7XG4gIGNvbnN0cnVjdG9yKHNlbGVjdG9yLCBpc1VwZGF0ZSkge1xuICAgIC8vIEEgc2V0IChvYmplY3QgbWFwcGluZyBzdHJpbmcgLT4gKikgb2YgYWxsIG9mIHRoZSBkb2N1bWVudCBwYXRocyBsb29rZWRcbiAgICAvLyBhdCBieSB0aGUgc2VsZWN0b3IuIEFsc28gaW5jbHVkZXMgdGhlIGVtcHR5IHN0cmluZyBpZiBpdCBtYXkgbG9vayBhdCBhbnlcbiAgICAvLyBwYXRoIChlZywgJHdoZXJlKS5cbiAgICB0aGlzLl9wYXRocyA9IHt9O1xuICAgIC8vIFNldCB0byB0cnVlIGlmIGNvbXBpbGF0aW9uIGZpbmRzIGEgJG5lYXIuXG4gICAgdGhpcy5faGFzR2VvUXVlcnkgPSBmYWxzZTtcbiAgICAvLyBTZXQgdG8gdHJ1ZSBpZiBjb21waWxhdGlvbiBmaW5kcyBhICR3aGVyZS5cbiAgICB0aGlzLl9oYXNXaGVyZSA9IGZhbHNlO1xuICAgIC8vIFNldCB0byBmYWxzZSBpZiBjb21waWxhdGlvbiBmaW5kcyBhbnl0aGluZyBvdGhlciB0aGFuIGEgc2ltcGxlIGVxdWFsaXR5XG4gICAgLy8gb3Igb25lIG9yIG1vcmUgb2YgJyRndCcsICckZ3RlJywgJyRsdCcsICckbHRlJywgJyRuZScsICckaW4nLCAnJG5pbicgdXNlZFxuICAgIC8vIHdpdGggc2NhbGFycyBhcyBvcGVyYW5kcy5cbiAgICB0aGlzLl9pc1NpbXBsZSA9IHRydWU7XG4gICAgLy8gU2V0IHRvIGEgZHVtbXkgZG9jdW1lbnQgd2hpY2ggYWx3YXlzIG1hdGNoZXMgdGhpcyBNYXRjaGVyLiBPciBzZXQgdG8gbnVsbFxuICAgIC8vIGlmIHN1Y2ggZG9jdW1lbnQgaXMgdG9vIGhhcmQgdG8gZmluZC5cbiAgICB0aGlzLl9tYXRjaGluZ0RvY3VtZW50ID0gdW5kZWZpbmVkO1xuICAgIC8vIEEgY2xvbmUgb2YgdGhlIG9yaWdpbmFsIHNlbGVjdG9yLiBJdCBtYXkganVzdCBiZSBhIGZ1bmN0aW9uIGlmIHRoZSB1c2VyXG4gICAgLy8gcGFzc2VkIGluIGEgZnVuY3Rpb247IG90aGVyd2lzZSBpcyBkZWZpbml0ZWx5IGFuIG9iamVjdCAoZWcsIElEcyBhcmVcbiAgICAvLyB0cmFuc2xhdGVkIGludG8ge19pZDogSUR9IGZpcnN0LiBVc2VkIGJ5IGNhbkJlY29tZVRydWVCeU1vZGlmaWVyIGFuZFxuICAgIC8vIFNvcnRlci5fdXNlV2l0aE1hdGNoZXIuXG4gICAgdGhpcy5fc2VsZWN0b3IgPSBudWxsO1xuICAgIHRoaXMuX2RvY01hdGNoZXIgPSB0aGlzLl9jb21waWxlU2VsZWN0b3Ioc2VsZWN0b3IpO1xuICAgIC8vIFNldCB0byB0cnVlIGlmIHNlbGVjdGlvbiBpcyBkb25lIGZvciBhbiB1cGRhdGUgb3BlcmF0aW9uXG4gICAgLy8gRGVmYXVsdCBpcyBmYWxzZVxuICAgIC8vIFVzZWQgZm9yICRuZWFyIGFycmF5IHVwZGF0ZSAoaXNzdWUgIzM1OTkpXG4gICAgdGhpcy5faXNVcGRhdGUgPSBpc1VwZGF0ZTtcbiAgfVxuXG4gIGRvY3VtZW50TWF0Y2hlcyhkb2MpIHtcbiAgICBpZiAoZG9jICE9PSBPYmplY3QoZG9jKSkge1xuICAgICAgdGhyb3cgRXJyb3IoJ2RvY3VtZW50TWF0Y2hlcyBuZWVkcyBhIGRvY3VtZW50Jyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX2RvY01hdGNoZXIoZG9jKTtcbiAgfVxuXG4gIGhhc0dlb1F1ZXJ5KCkge1xuICAgIHJldHVybiB0aGlzLl9oYXNHZW9RdWVyeTtcbiAgfVxuXG4gIGhhc1doZXJlKCkge1xuICAgIHJldHVybiB0aGlzLl9oYXNXaGVyZTtcbiAgfVxuXG4gIGlzU2ltcGxlKCkge1xuICAgIHJldHVybiB0aGlzLl9pc1NpbXBsZTtcbiAgfVxuXG4gIC8vIEdpdmVuIGEgc2VsZWN0b3IsIHJldHVybiBhIGZ1bmN0aW9uIHRoYXQgdGFrZXMgb25lIGFyZ3VtZW50LCBhXG4gIC8vIGRvY3VtZW50LiBJdCByZXR1cm5zIGEgcmVzdWx0IG9iamVjdC5cbiAgX2NvbXBpbGVTZWxlY3RvcihzZWxlY3Rvcikge1xuICAgIC8vIHlvdSBjYW4gcGFzcyBhIGxpdGVyYWwgZnVuY3Rpb24gaW5zdGVhZCBvZiBhIHNlbGVjdG9yXG4gICAgaWYgKHNlbGVjdG9yIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcbiAgICAgIHRoaXMuX2lzU2ltcGxlID0gZmFsc2U7XG4gICAgICB0aGlzLl9zZWxlY3RvciA9IHNlbGVjdG9yO1xuICAgICAgdGhpcy5fcmVjb3JkUGF0aFVzZWQoJycpO1xuXG4gICAgICByZXR1cm4gZG9jID0+ICh7cmVzdWx0OiAhIXNlbGVjdG9yLmNhbGwoZG9jKX0pO1xuICAgIH1cblxuICAgIC8vIHNob3J0aGFuZCAtLSBzY2FsYXIgX2lkXG4gICAgaWYgKExvY2FsQ29sbGVjdGlvbi5fc2VsZWN0b3JJc0lkKHNlbGVjdG9yKSkge1xuICAgICAgdGhpcy5fc2VsZWN0b3IgPSB7X2lkOiBzZWxlY3Rvcn07XG4gICAgICB0aGlzLl9yZWNvcmRQYXRoVXNlZCgnX2lkJyk7XG5cbiAgICAgIHJldHVybiBkb2MgPT4gKHtyZXN1bHQ6IEVKU09OLmVxdWFscyhkb2MuX2lkLCBzZWxlY3Rvcil9KTtcbiAgICB9XG5cbiAgICAvLyBwcm90ZWN0IGFnYWluc3QgZGFuZ2Vyb3VzIHNlbGVjdG9ycy4gIGZhbHNleSBhbmQge19pZDogZmFsc2V5fSBhcmUgYm90aFxuICAgIC8vIGxpa2VseSBwcm9ncmFtbWVyIGVycm9yLCBhbmQgbm90IHdoYXQgeW91IHdhbnQsIHBhcnRpY3VsYXJseSBmb3JcbiAgICAvLyBkZXN0cnVjdGl2ZSBvcGVyYXRpb25zLlxuICAgIGlmICghc2VsZWN0b3IgfHwgaGFzT3duLmNhbGwoc2VsZWN0b3IsICdfaWQnKSAmJiAhc2VsZWN0b3IuX2lkKSB7XG4gICAgICB0aGlzLl9pc1NpbXBsZSA9IGZhbHNlO1xuICAgICAgcmV0dXJuIG5vdGhpbmdNYXRjaGVyO1xuICAgIH1cblxuICAgIC8vIFRvcCBsZXZlbCBjYW4ndCBiZSBhbiBhcnJheSBvciB0cnVlIG9yIGJpbmFyeS5cbiAgICBpZiAoQXJyYXkuaXNBcnJheShzZWxlY3RvcikgfHxcbiAgICAgICAgRUpTT04uaXNCaW5hcnkoc2VsZWN0b3IpIHx8XG4gICAgICAgIHR5cGVvZiBzZWxlY3RvciA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgc2VsZWN0b3I6ICR7c2VsZWN0b3J9YCk7XG4gICAgfVxuXG4gICAgdGhpcy5fc2VsZWN0b3IgPSBFSlNPTi5jbG9uZShzZWxlY3Rvcik7XG5cbiAgICByZXR1cm4gY29tcGlsZURvY3VtZW50U2VsZWN0b3Ioc2VsZWN0b3IsIHRoaXMsIHtpc1Jvb3Q6IHRydWV9KTtcbiAgfVxuXG4gIC8vIFJldHVybnMgYSBsaXN0IG9mIGtleSBwYXRocyB0aGUgZ2l2ZW4gc2VsZWN0b3IgaXMgbG9va2luZyBmb3IuIEl0IGluY2x1ZGVzXG4gIC8vIHRoZSBlbXB0eSBzdHJpbmcgaWYgdGhlcmUgaXMgYSAkd2hlcmUuXG4gIF9nZXRQYXRocygpIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5fcGF0aHMpO1xuICB9XG5cbiAgX3JlY29yZFBhdGhVc2VkKHBhdGgpIHtcbiAgICB0aGlzLl9wYXRoc1twYXRoXSA9IHRydWU7XG4gIH1cbn1cblxuLy8gaGVscGVycyB1c2VkIGJ5IGNvbXBpbGVkIHNlbGVjdG9yIGNvZGVcbkxvY2FsQ29sbGVjdGlvbi5fZiA9IHtcbiAgLy8gWFhYIGZvciBfYWxsIGFuZCBfaW4sIGNvbnNpZGVyIGJ1aWxkaW5nICdpbnF1ZXJ5JyBhdCBjb21waWxlIHRpbWUuLlxuICBfdHlwZSh2KSB7XG4gICAgaWYgKHR5cGVvZiB2ID09PSAnbnVtYmVyJykge1xuICAgICAgcmV0dXJuIDE7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiB2ID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIDI7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiB2ID09PSAnYm9vbGVhbicpIHtcbiAgICAgIHJldHVybiA4O1xuICAgIH1cblxuICAgIGlmIChBcnJheS5pc0FycmF5KHYpKSB7XG4gICAgICByZXR1cm4gNDtcbiAgICB9XG5cbiAgICBpZiAodiA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIDEwO1xuICAgIH1cblxuICAgIC8vIG5vdGUgdGhhdCB0eXBlb2YoL3gvKSA9PT0gXCJvYmplY3RcIlxuICAgIGlmICh2IGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgICByZXR1cm4gMTE7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiB2ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gMTM7XG4gICAgfVxuXG4gICAgaWYgKHYgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICByZXR1cm4gOTtcbiAgICB9XG5cbiAgICBpZiAoRUpTT04uaXNCaW5hcnkodikpIHtcbiAgICAgIHJldHVybiA1O1xuICAgIH1cblxuICAgIGlmICh2IGluc3RhbmNlb2YgTW9uZ29JRC5PYmplY3RJRCkge1xuICAgICAgcmV0dXJuIDc7XG4gICAgfVxuXG4gICAgLy8gb2JqZWN0XG4gICAgcmV0dXJuIDM7XG5cbiAgICAvLyBYWFggc3VwcG9ydCBzb21lL2FsbCBvZiB0aGVzZTpcbiAgICAvLyAxNCwgc3ltYm9sXG4gICAgLy8gMTUsIGphdmFzY3JpcHQgY29kZSB3aXRoIHNjb3BlXG4gICAgLy8gMTYsIDE4OiAzMi1iaXQvNjQtYml0IGludGVnZXJcbiAgICAvLyAxNywgdGltZXN0YW1wXG4gICAgLy8gMjU1LCBtaW5rZXlcbiAgICAvLyAxMjcsIG1heGtleVxuICB9LFxuXG4gIC8vIGRlZXAgZXF1YWxpdHkgdGVzdDogdXNlIGZvciBsaXRlcmFsIGRvY3VtZW50IGFuZCBhcnJheSBtYXRjaGVzXG4gIF9lcXVhbChhLCBiKSB7XG4gICAgcmV0dXJuIEVKU09OLmVxdWFscyhhLCBiLCB7a2V5T3JkZXJTZW5zaXRpdmU6IHRydWV9KTtcbiAgfSxcblxuICAvLyBtYXBzIGEgdHlwZSBjb2RlIHRvIGEgdmFsdWUgdGhhdCBjYW4gYmUgdXNlZCB0byBzb3J0IHZhbHVlcyBvZiBkaWZmZXJlbnRcbiAgLy8gdHlwZXNcbiAgX3R5cGVvcmRlcih0KSB7XG4gICAgLy8gaHR0cDovL3d3dy5tb25nb2RiLm9yZy9kaXNwbGF5L0RPQ1MvV2hhdCtpcyt0aGUrQ29tcGFyZStPcmRlcitmb3IrQlNPTitUeXBlc1xuICAgIC8vIFhYWCB3aGF0IGlzIHRoZSBjb3JyZWN0IHNvcnQgcG9zaXRpb24gZm9yIEphdmFzY3JpcHQgY29kZT9cbiAgICAvLyAoJzEwMCcgaW4gdGhlIG1hdHJpeCBiZWxvdylcbiAgICAvLyBYWFggbWlua2V5L21heGtleVxuICAgIHJldHVybiBbXG4gICAgICAtMSwgIC8vIChub3QgYSB0eXBlKVxuICAgICAgMSwgICAvLyBudW1iZXJcbiAgICAgIDIsICAgLy8gc3RyaW5nXG4gICAgICAzLCAgIC8vIG9iamVjdFxuICAgICAgNCwgICAvLyBhcnJheVxuICAgICAgNSwgICAvLyBiaW5hcnlcbiAgICAgIC0xLCAgLy8gZGVwcmVjYXRlZFxuICAgICAgNiwgICAvLyBPYmplY3RJRFxuICAgICAgNywgICAvLyBib29sXG4gICAgICA4LCAgIC8vIERhdGVcbiAgICAgIDAsICAgLy8gbnVsbFxuICAgICAgOSwgICAvLyBSZWdFeHBcbiAgICAgIC0xLCAgLy8gZGVwcmVjYXRlZFxuICAgICAgMTAwLCAvLyBKUyBjb2RlXG4gICAgICAyLCAgIC8vIGRlcHJlY2F0ZWQgKHN5bWJvbClcbiAgICAgIDEwMCwgLy8gSlMgY29kZVxuICAgICAgMSwgICAvLyAzMi1iaXQgaW50XG4gICAgICA4LCAgIC8vIE1vbmdvIHRpbWVzdGFtcFxuICAgICAgMSAgICAvLyA2NC1iaXQgaW50XG4gICAgXVt0XTtcbiAgfSxcblxuICAvLyBjb21wYXJlIHR3byB2YWx1ZXMgb2YgdW5rbm93biB0eXBlIGFjY29yZGluZyB0byBCU09OIG9yZGVyaW5nXG4gIC8vIHNlbWFudGljcy4gKGFzIGFuIGV4dGVuc2lvbiwgY29uc2lkZXIgJ3VuZGVmaW5lZCcgdG8gYmUgbGVzcyB0aGFuXG4gIC8vIGFueSBvdGhlciB2YWx1ZS4pIHJldHVybiBuZWdhdGl2ZSBpZiBhIGlzIGxlc3MsIHBvc2l0aXZlIGlmIGIgaXNcbiAgLy8gbGVzcywgb3IgMCBpZiBlcXVhbFxuICBfY21wKGEsIGIpIHtcbiAgICBpZiAoYSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gYiA9PT0gdW5kZWZpbmVkID8gMCA6IC0xO1xuICAgIH1cblxuICAgIGlmIChiID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiAxO1xuICAgIH1cblxuICAgIGxldCB0YSA9IExvY2FsQ29sbGVjdGlvbi5fZi5fdHlwZShhKTtcbiAgICBsZXQgdGIgPSBMb2NhbENvbGxlY3Rpb24uX2YuX3R5cGUoYik7XG5cbiAgICBjb25zdCBvYSA9IExvY2FsQ29sbGVjdGlvbi5fZi5fdHlwZW9yZGVyKHRhKTtcbiAgICBjb25zdCBvYiA9IExvY2FsQ29sbGVjdGlvbi5fZi5fdHlwZW9yZGVyKHRiKTtcblxuICAgIGlmIChvYSAhPT0gb2IpIHtcbiAgICAgIHJldHVybiBvYSA8IG9iID8gLTEgOiAxO1xuICAgIH1cblxuICAgIC8vIFhYWCBuZWVkIHRvIGltcGxlbWVudCB0aGlzIGlmIHdlIGltcGxlbWVudCBTeW1ib2wgb3IgaW50ZWdlcnMsIG9yXG4gICAgLy8gVGltZXN0YW1wXG4gICAgaWYgKHRhICE9PSB0Yikge1xuICAgICAgdGhyb3cgRXJyb3IoJ01pc3NpbmcgdHlwZSBjb2VyY2lvbiBsb2dpYyBpbiBfY21wJyk7XG4gICAgfVxuXG4gICAgaWYgKHRhID09PSA3KSB7IC8vIE9iamVjdElEXG4gICAgICAvLyBDb252ZXJ0IHRvIHN0cmluZy5cbiAgICAgIHRhID0gdGIgPSAyO1xuICAgICAgYSA9IGEudG9IZXhTdHJpbmcoKTtcbiAgICAgIGIgPSBiLnRvSGV4U3RyaW5nKCk7XG4gICAgfVxuXG4gICAgaWYgKHRhID09PSA5KSB7IC8vIERhdGVcbiAgICAgIC8vIENvbnZlcnQgdG8gbWlsbGlzLlxuICAgICAgdGEgPSB0YiA9IDE7XG4gICAgICBhID0gYS5nZXRUaW1lKCk7XG4gICAgICBiID0gYi5nZXRUaW1lKCk7XG4gICAgfVxuXG4gICAgaWYgKHRhID09PSAxKSAvLyBkb3VibGVcbiAgICAgIHJldHVybiBhIC0gYjtcblxuICAgIGlmICh0YiA9PT0gMikgLy8gc3RyaW5nXG4gICAgICByZXR1cm4gYSA8IGIgPyAtMSA6IGEgPT09IGIgPyAwIDogMTtcblxuICAgIGlmICh0YSA9PT0gMykgeyAvLyBPYmplY3RcbiAgICAgIC8vIHRoaXMgY291bGQgYmUgbXVjaCBtb3JlIGVmZmljaWVudCBpbiB0aGUgZXhwZWN0ZWQgY2FzZSAuLi5cbiAgICAgIGNvbnN0IHRvQXJyYXkgPSBvYmplY3QgPT4ge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBbXTtcblxuICAgICAgICBPYmplY3Qua2V5cyhvYmplY3QpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICByZXN1bHQucHVzaChrZXksIG9iamVjdFtrZXldKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiBMb2NhbENvbGxlY3Rpb24uX2YuX2NtcCh0b0FycmF5KGEpLCB0b0FycmF5KGIpKTtcbiAgICB9XG5cbiAgICBpZiAodGEgPT09IDQpIHsgLy8gQXJyYXlcbiAgICAgIGZvciAobGV0IGkgPSAwOyA7IGkrKykge1xuICAgICAgICBpZiAoaSA9PT0gYS5sZW5ndGgpIHtcbiAgICAgICAgICByZXR1cm4gaSA9PT0gYi5sZW5ndGggPyAwIDogLTE7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaSA9PT0gYi5sZW5ndGgpIHtcbiAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHMgPSBMb2NhbENvbGxlY3Rpb24uX2YuX2NtcChhW2ldLCBiW2ldKTtcbiAgICAgICAgaWYgKHMgIT09IDApIHtcbiAgICAgICAgICByZXR1cm4gcztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0YSA9PT0gNSkgeyAvLyBiaW5hcnlcbiAgICAgIC8vIFN1cnByaXNpbmdseSwgYSBzbWFsbCBiaW5hcnkgYmxvYiBpcyBhbHdheXMgbGVzcyB0aGFuIGEgbGFyZ2Ugb25lIGluXG4gICAgICAvLyBNb25nby5cbiAgICAgIGlmIChhLmxlbmd0aCAhPT0gYi5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIGEubGVuZ3RoIC0gYi5sZW5ndGg7XG4gICAgICB9XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYS5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoYVtpXSA8IGJbaV0pIHtcbiAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYVtpXSA+IGJbaV0pIHtcbiAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBpZiAodGEgPT09IDgpIHsgLy8gYm9vbGVhblxuICAgICAgaWYgKGEpIHtcbiAgICAgICAgcmV0dXJuIGIgPyAwIDogMTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGIgPyAtMSA6IDA7XG4gICAgfVxuXG4gICAgaWYgKHRhID09PSAxMCkgLy8gbnVsbFxuICAgICAgcmV0dXJuIDA7XG5cbiAgICBpZiAodGEgPT09IDExKSAvLyByZWdleHBcbiAgICAgIHRocm93IEVycm9yKCdTb3J0aW5nIG5vdCBzdXBwb3J0ZWQgb24gcmVndWxhciBleHByZXNzaW9uJyk7IC8vIFhYWFxuXG4gICAgLy8gMTM6IGphdmFzY3JpcHQgY29kZVxuICAgIC8vIDE0OiBzeW1ib2xcbiAgICAvLyAxNTogamF2YXNjcmlwdCBjb2RlIHdpdGggc2NvcGVcbiAgICAvLyAxNjogMzItYml0IGludGVnZXJcbiAgICAvLyAxNzogdGltZXN0YW1wXG4gICAgLy8gMTg6IDY0LWJpdCBpbnRlZ2VyXG4gICAgLy8gMjU1OiBtaW5rZXlcbiAgICAvLyAxMjc6IG1heGtleVxuICAgIGlmICh0YSA9PT0gMTMpIC8vIGphdmFzY3JpcHQgY29kZVxuICAgICAgdGhyb3cgRXJyb3IoJ1NvcnRpbmcgbm90IHN1cHBvcnRlZCBvbiBKYXZhc2NyaXB0IGNvZGUnKTsgLy8gWFhYXG5cbiAgICB0aHJvdyBFcnJvcignVW5rbm93biB0eXBlIHRvIHNvcnQnKTtcbiAgfSxcbn07XG4iLCJpbXBvcnQgTG9jYWxDb2xsZWN0aW9uXyBmcm9tICcuL2xvY2FsX2NvbGxlY3Rpb24uanMnO1xuaW1wb3J0IE1hdGNoZXIgZnJvbSAnLi9tYXRjaGVyLmpzJztcbmltcG9ydCBTb3J0ZXIgZnJvbSAnLi9zb3J0ZXIuanMnO1xuXG5Mb2NhbENvbGxlY3Rpb24gPSBMb2NhbENvbGxlY3Rpb25fO1xuTWluaW1vbmdvID0ge1xuICAgIExvY2FsQ29sbGVjdGlvbjogTG9jYWxDb2xsZWN0aW9uXyxcbiAgICBNYXRjaGVyLFxuICAgIFNvcnRlclxufTtcbiIsIi8vIE9ic2VydmVIYW5kbGU6IHRoZSByZXR1cm4gdmFsdWUgb2YgYSBsaXZlIHF1ZXJ5LlxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgT2JzZXJ2ZUhhbmRsZSB7fVxuIiwiaW1wb3J0IHtcbiAgRUxFTUVOVF9PUEVSQVRPUlMsXG4gIGVxdWFsaXR5RWxlbWVudE1hdGNoZXIsXG4gIGV4cGFuZEFycmF5c0luQnJhbmNoZXMsXG4gIGhhc093bixcbiAgaXNPcGVyYXRvck9iamVjdCxcbiAgbWFrZUxvb2t1cEZ1bmN0aW9uLFxuICByZWdleHBFbGVtZW50TWF0Y2hlcixcbn0gZnJvbSAnLi9jb21tb24uanMnO1xuXG4vLyBHaXZlIGEgc29ydCBzcGVjLCB3aGljaCBjYW4gYmUgaW4gYW55IG9mIHRoZXNlIGZvcm1zOlxuLy8gICB7XCJrZXkxXCI6IDEsIFwia2V5MlwiOiAtMX1cbi8vICAgW1tcImtleTFcIiwgXCJhc2NcIl0sIFtcImtleTJcIiwgXCJkZXNjXCJdXVxuLy8gICBbXCJrZXkxXCIsIFtcImtleTJcIiwgXCJkZXNjXCJdXVxuLy9cbi8vICguLiB3aXRoIHRoZSBmaXJzdCBmb3JtIGJlaW5nIGRlcGVuZGVudCBvbiB0aGUga2V5IGVudW1lcmF0aW9uXG4vLyBiZWhhdmlvciBvZiB5b3VyIGphdmFzY3JpcHQgVk0sIHdoaWNoIHVzdWFsbHkgZG9lcyB3aGF0IHlvdSBtZWFuIGluXG4vLyB0aGlzIGNhc2UgaWYgdGhlIGtleSBuYW1lcyBkb24ndCBsb29rIGxpa2UgaW50ZWdlcnMgLi4pXG4vL1xuLy8gcmV0dXJuIGEgZnVuY3Rpb24gdGhhdCB0YWtlcyB0d28gb2JqZWN0cywgYW5kIHJldHVybnMgLTEgaWYgdGhlXG4vLyBmaXJzdCBvYmplY3QgY29tZXMgZmlyc3QgaW4gb3JkZXIsIDEgaWYgdGhlIHNlY29uZCBvYmplY3QgY29tZXNcbi8vIGZpcnN0LCBvciAwIGlmIG5laXRoZXIgb2JqZWN0IGNvbWVzIGJlZm9yZSB0aGUgb3RoZXIuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNvcnRlciB7XG4gIGNvbnN0cnVjdG9yKHNwZWMpIHtcbiAgICB0aGlzLl9zb3J0U3BlY1BhcnRzID0gW107XG4gICAgdGhpcy5fc29ydEZ1bmN0aW9uID0gbnVsbDtcblxuICAgIGNvbnN0IGFkZFNwZWNQYXJ0ID0gKHBhdGgsIGFzY2VuZGluZykgPT4ge1xuICAgICAgaWYgKCFwYXRoKSB7XG4gICAgICAgIHRocm93IEVycm9yKCdzb3J0IGtleXMgbXVzdCBiZSBub24tZW1wdHknKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHBhdGguY2hhckF0KDApID09PSAnJCcpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoYHVuc3VwcG9ydGVkIHNvcnQga2V5OiAke3BhdGh9YCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3NvcnRTcGVjUGFydHMucHVzaCh7XG4gICAgICAgIGFzY2VuZGluZyxcbiAgICAgICAgbG9va3VwOiBtYWtlTG9va3VwRnVuY3Rpb24ocGF0aCwge2ZvclNvcnQ6IHRydWV9KSxcbiAgICAgICAgcGF0aFxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIGlmIChzcGVjIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgIHNwZWMuZm9yRWFjaChlbGVtZW50ID0+IHtcbiAgICAgICAgaWYgKHR5cGVvZiBlbGVtZW50ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIGFkZFNwZWNQYXJ0KGVsZW1lbnQsIHRydWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGFkZFNwZWNQYXJ0KGVsZW1lbnRbMF0sIGVsZW1lbnRbMV0gIT09ICdkZXNjJyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHNwZWMgPT09ICdvYmplY3QnKSB7XG4gICAgICBPYmplY3Qua2V5cyhzcGVjKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgIGFkZFNwZWNQYXJ0KGtleSwgc3BlY1trZXldID49IDApO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2Ygc3BlYyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhpcy5fc29ydEZ1bmN0aW9uID0gc3BlYztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgRXJyb3IoYEJhZCBzb3J0IHNwZWNpZmljYXRpb246ICR7SlNPTi5zdHJpbmdpZnkoc3BlYyl9YCk7XG4gICAgfVxuXG4gICAgLy8gSWYgYSBmdW5jdGlvbiBpcyBzcGVjaWZpZWQgZm9yIHNvcnRpbmcsIHdlIHNraXAgdGhlIHJlc3QuXG4gICAgaWYgKHRoaXMuX3NvcnRGdW5jdGlvbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFRvIGltcGxlbWVudCBhZmZlY3RlZEJ5TW9kaWZpZXIsIHdlIHBpZ2d5LWJhY2sgb24gdG9wIG9mIE1hdGNoZXInc1xuICAgIC8vIGFmZmVjdGVkQnlNb2RpZmllciBjb2RlOyB3ZSBjcmVhdGUgYSBzZWxlY3RvciB0aGF0IGlzIGFmZmVjdGVkIGJ5IHRoZVxuICAgIC8vIHNhbWUgbW9kaWZpZXJzIGFzIHRoaXMgc29ydCBvcmRlci4gVGhpcyBpcyBvbmx5IGltcGxlbWVudGVkIG9uIHRoZVxuICAgIC8vIHNlcnZlci5cbiAgICBpZiAodGhpcy5hZmZlY3RlZEJ5TW9kaWZpZXIpIHtcbiAgICAgIGNvbnN0IHNlbGVjdG9yID0ge307XG5cbiAgICAgIHRoaXMuX3NvcnRTcGVjUGFydHMuZm9yRWFjaChzcGVjID0+IHtcbiAgICAgICAgc2VsZWN0b3Jbc3BlYy5wYXRoXSA9IDE7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5fc2VsZWN0b3JGb3JBZmZlY3RlZEJ5TW9kaWZpZXIgPSBuZXcgTWluaW1vbmdvLk1hdGNoZXIoc2VsZWN0b3IpO1xuICAgIH1cblxuICAgIHRoaXMuX2tleUNvbXBhcmF0b3IgPSBjb21wb3NlQ29tcGFyYXRvcnMoXG4gICAgICB0aGlzLl9zb3J0U3BlY1BhcnRzLm1hcCgoc3BlYywgaSkgPT4gdGhpcy5fa2V5RmllbGRDb21wYXJhdG9yKGkpKVxuICAgICk7XG4gIH1cblxuICBnZXRDb21wYXJhdG9yKG9wdGlvbnMpIHtcbiAgICAvLyBJZiBzb3J0IGlzIHNwZWNpZmllZCBvciBoYXZlIG5vIGRpc3RhbmNlcywganVzdCB1c2UgdGhlIGNvbXBhcmF0b3IgZnJvbVxuICAgIC8vIHRoZSBzb3VyY2Ugc3BlY2lmaWNhdGlvbiAod2hpY2ggZGVmYXVsdHMgdG8gXCJldmVyeXRoaW5nIGlzIGVxdWFsXCIuXG4gICAgLy8gaXNzdWUgIzM1OTlcbiAgICAvLyBodHRwczovL2RvY3MubW9uZ29kYi5jb20vbWFudWFsL3JlZmVyZW5jZS9vcGVyYXRvci9xdWVyeS9uZWFyLyNzb3J0LW9wZXJhdGlvblxuICAgIC8vIHNvcnQgZWZmZWN0aXZlbHkgb3ZlcnJpZGVzICRuZWFyXG4gICAgaWYgKHRoaXMuX3NvcnRTcGVjUGFydHMubGVuZ3RoIHx8ICFvcHRpb25zIHx8ICFvcHRpb25zLmRpc3RhbmNlcykge1xuICAgICAgcmV0dXJuIHRoaXMuX2dldEJhc2VDb21wYXJhdG9yKCk7XG4gICAgfVxuXG4gICAgY29uc3QgZGlzdGFuY2VzID0gb3B0aW9ucy5kaXN0YW5jZXM7XG5cbiAgICAvLyBSZXR1cm4gYSBjb21wYXJhdG9yIHdoaWNoIGNvbXBhcmVzIHVzaW5nICRuZWFyIGRpc3RhbmNlcy5cbiAgICByZXR1cm4gKGEsIGIpID0+IHtcbiAgICAgIGlmICghZGlzdGFuY2VzLmhhcyhhLl9pZCkpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoYE1pc3NpbmcgZGlzdGFuY2UgZm9yICR7YS5faWR9YCk7XG4gICAgICB9XG5cbiAgICAgIGlmICghZGlzdGFuY2VzLmhhcyhiLl9pZCkpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoYE1pc3NpbmcgZGlzdGFuY2UgZm9yICR7Yi5faWR9YCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBkaXN0YW5jZXMuZ2V0KGEuX2lkKSAtIGRpc3RhbmNlcy5nZXQoYi5faWQpO1xuICAgIH07XG4gIH1cblxuICAvLyBUYWtlcyBpbiB0d28ga2V5czogYXJyYXlzIHdob3NlIGxlbmd0aHMgbWF0Y2ggdGhlIG51bWJlciBvZiBzcGVjXG4gIC8vIHBhcnRzLiBSZXR1cm5zIG5lZ2F0aXZlLCAwLCBvciBwb3NpdGl2ZSBiYXNlZCBvbiB1c2luZyB0aGUgc29ydCBzcGVjIHRvXG4gIC8vIGNvbXBhcmUgZmllbGRzLlxuICBfY29tcGFyZUtleXMoa2V5MSwga2V5Mikge1xuICAgIGlmIChrZXkxLmxlbmd0aCAhPT0gdGhpcy5fc29ydFNwZWNQYXJ0cy5sZW5ndGggfHxcbiAgICAgICAga2V5Mi5sZW5ndGggIT09IHRoaXMuX3NvcnRTcGVjUGFydHMubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBFcnJvcignS2V5IGhhcyB3cm9uZyBsZW5ndGgnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fa2V5Q29tcGFyYXRvcihrZXkxLCBrZXkyKTtcbiAgfVxuXG4gIC8vIEl0ZXJhdGVzIG92ZXIgZWFjaCBwb3NzaWJsZSBcImtleVwiIGZyb20gZG9jIChpZSwgb3ZlciBlYWNoIGJyYW5jaCksIGNhbGxpbmdcbiAgLy8gJ2NiJyB3aXRoIHRoZSBrZXkuXG4gIF9nZW5lcmF0ZUtleXNGcm9tRG9jKGRvYywgY2IpIHtcbiAgICBpZiAodGhpcy5fc29ydFNwZWNQYXJ0cy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignY2FuXFwndCBnZW5lcmF0ZSBrZXlzIHdpdGhvdXQgYSBzcGVjJyk7XG4gICAgfVxuXG4gICAgY29uc3QgcGF0aEZyb21JbmRpY2VzID0gaW5kaWNlcyA9PiBgJHtpbmRpY2VzLmpvaW4oJywnKX0sYDtcblxuICAgIGxldCBrbm93blBhdGhzID0gbnVsbDtcblxuICAgIC8vIG1hcHMgaW5kZXggLT4gKHsnJyAtPiB2YWx1ZX0gb3Ige3BhdGggLT4gdmFsdWV9KVxuICAgIGNvbnN0IHZhbHVlc0J5SW5kZXhBbmRQYXRoID0gdGhpcy5fc29ydFNwZWNQYXJ0cy5tYXAoc3BlYyA9PiB7XG4gICAgICAvLyBFeHBhbmQgYW55IGxlYWYgYXJyYXlzIHRoYXQgd2UgZmluZCwgYW5kIGlnbm9yZSB0aG9zZSBhcnJheXNcbiAgICAgIC8vIHRoZW1zZWx2ZXMuICAoV2UgbmV2ZXIgc29ydCBiYXNlZCBvbiBhbiBhcnJheSBpdHNlbGYuKVxuICAgICAgbGV0IGJyYW5jaGVzID0gZXhwYW5kQXJyYXlzSW5CcmFuY2hlcyhzcGVjLmxvb2t1cChkb2MpLCB0cnVlKTtcblxuICAgICAgLy8gSWYgdGhlcmUgYXJlIG5vIHZhbHVlcyBmb3IgYSBrZXkgKGVnLCBrZXkgZ29lcyB0byBhbiBlbXB0eSBhcnJheSksXG4gICAgICAvLyBwcmV0ZW5kIHdlIGZvdW5kIG9uZSB1bmRlZmluZWQgdmFsdWUuXG4gICAgICBpZiAoIWJyYW5jaGVzLmxlbmd0aCkge1xuICAgICAgICBicmFuY2hlcyA9IFt7IHZhbHVlOiB2b2lkIDAgfV07XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGVsZW1lbnQgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgbGV0IHVzZWRQYXRocyA9IGZhbHNlO1xuXG4gICAgICBicmFuY2hlcy5mb3JFYWNoKGJyYW5jaCA9PiB7XG4gICAgICAgIGlmICghYnJhbmNoLmFycmF5SW5kaWNlcykge1xuICAgICAgICAgIC8vIElmIHRoZXJlIGFyZSBubyBhcnJheSBpbmRpY2VzIGZvciBhIGJyYW5jaCwgdGhlbiBpdCBtdXN0IGJlIHRoZVxuICAgICAgICAgIC8vIG9ubHkgYnJhbmNoLCBiZWNhdXNlIHRoZSBvbmx5IHRoaW5nIHRoYXQgcHJvZHVjZXMgbXVsdGlwbGUgYnJhbmNoZXNcbiAgICAgICAgICAvLyBpcyB0aGUgdXNlIG9mIGFycmF5cy5cbiAgICAgICAgICBpZiAoYnJhbmNoZXMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgdGhyb3cgRXJyb3IoJ211bHRpcGxlIGJyYW5jaGVzIGJ1dCBubyBhcnJheSB1c2VkPycpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGVsZW1lbnRbJyddID0gYnJhbmNoLnZhbHVlO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHVzZWRQYXRocyA9IHRydWU7XG5cbiAgICAgICAgY29uc3QgcGF0aCA9IHBhdGhGcm9tSW5kaWNlcyhicmFuY2guYXJyYXlJbmRpY2VzKTtcblxuICAgICAgICBpZiAoaGFzT3duLmNhbGwoZWxlbWVudCwgcGF0aCkpIHtcbiAgICAgICAgICB0aHJvdyBFcnJvcihgZHVwbGljYXRlIHBhdGg6ICR7cGF0aH1gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGVsZW1lbnRbcGF0aF0gPSBicmFuY2gudmFsdWU7XG5cbiAgICAgICAgLy8gSWYgdHdvIHNvcnQgZmllbGRzIGJvdGggZ28gaW50byBhcnJheXMsIHRoZXkgaGF2ZSB0byBnbyBpbnRvIHRoZVxuICAgICAgICAvLyBleGFjdCBzYW1lIGFycmF5cyBhbmQgd2UgaGF2ZSB0byBmaW5kIHRoZSBzYW1lIHBhdGhzLiAgVGhpcyBpc1xuICAgICAgICAvLyByb3VnaGx5IHRoZSBzYW1lIGNvbmRpdGlvbiB0aGF0IG1ha2VzIE1vbmdvREIgdGhyb3cgdGhpcyBzdHJhbmdlXG4gICAgICAgIC8vIGVycm9yIG1lc3NhZ2UuICBlZywgdGhlIG1haW4gdGhpbmcgaXMgdGhhdCBpZiBzb3J0IHNwZWMgaXMge2E6IDEsXG4gICAgICAgIC8vIGI6MX0gdGhlbiBhIGFuZCBiIGNhbm5vdCBib3RoIGJlIGFycmF5cy5cbiAgICAgICAgLy9cbiAgICAgICAgLy8gKEluIE1vbmdvREIgaXQgc2VlbXMgdG8gYmUgT0sgdG8gaGF2ZSB7YTogMSwgJ2EueC55JzogMX0gd2hlcmUgJ2EnXG4gICAgICAgIC8vIGFuZCAnYS54LnknIGFyZSBib3RoIGFycmF5cywgYnV0IHdlIGRvbid0IGFsbG93IHRoaXMgZm9yIG5vdy5cbiAgICAgICAgLy8gI05lc3RlZEFycmF5U29ydFxuICAgICAgICAvLyBYWFggYWNoaWV2ZSBmdWxsIGNvbXBhdGliaWxpdHkgaGVyZVxuICAgICAgICBpZiAoa25vd25QYXRocyAmJiAhaGFzT3duLmNhbGwoa25vd25QYXRocywgcGF0aCkpIHtcbiAgICAgICAgICB0aHJvdyBFcnJvcignY2Fubm90IGluZGV4IHBhcmFsbGVsIGFycmF5cycpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgaWYgKGtub3duUGF0aHMpIHtcbiAgICAgICAgLy8gU2ltaWxhcmx5IHRvIGFib3ZlLCBwYXRocyBtdXN0IG1hdGNoIGV2ZXJ5d2hlcmUsIHVubGVzcyB0aGlzIGlzIGFcbiAgICAgICAgLy8gbm9uLWFycmF5IGZpZWxkLlxuICAgICAgICBpZiAoIWhhc093bi5jYWxsKGVsZW1lbnQsICcnKSAmJlxuICAgICAgICAgICAgT2JqZWN0LmtleXMoa25vd25QYXRocykubGVuZ3RoICE9PSBPYmplY3Qua2V5cyhlbGVtZW50KS5sZW5ndGgpIHtcbiAgICAgICAgICB0aHJvdyBFcnJvcignY2Fubm90IGluZGV4IHBhcmFsbGVsIGFycmF5cyEnKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh1c2VkUGF0aHMpIHtcbiAgICAgICAga25vd25QYXRocyA9IHt9O1xuXG4gICAgICAgIE9iamVjdC5rZXlzKGVsZW1lbnQpLmZvckVhY2gocGF0aCA9PiB7XG4gICAgICAgICAga25vd25QYXRoc1twYXRoXSA9IHRydWU7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZWxlbWVudDtcbiAgICB9KTtcblxuICAgIGlmICgha25vd25QYXRocykge1xuICAgICAgLy8gRWFzeSBjYXNlOiBubyB1c2Ugb2YgYXJyYXlzLlxuICAgICAgY29uc3Qgc29sZUtleSA9IHZhbHVlc0J5SW5kZXhBbmRQYXRoLm1hcCh2YWx1ZXMgPT4ge1xuICAgICAgICBpZiAoIWhhc093bi5jYWxsKHZhbHVlcywgJycpKSB7XG4gICAgICAgICAgdGhyb3cgRXJyb3IoJ25vIHZhbHVlIGluIHNvbGUga2V5IGNhc2U/Jyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdmFsdWVzWycnXTtcbiAgICAgIH0pO1xuXG4gICAgICBjYihzb2xlS2V5KTtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIE9iamVjdC5rZXlzKGtub3duUGF0aHMpLmZvckVhY2gocGF0aCA9PiB7XG4gICAgICBjb25zdCBrZXkgPSB2YWx1ZXNCeUluZGV4QW5kUGF0aC5tYXAodmFsdWVzID0+IHtcbiAgICAgICAgaWYgKGhhc093bi5jYWxsKHZhbHVlcywgJycpKSB7XG4gICAgICAgICAgcmV0dXJuIHZhbHVlc1snJ107XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWhhc093bi5jYWxsKHZhbHVlcywgcGF0aCkpIHtcbiAgICAgICAgICB0aHJvdyBFcnJvcignbWlzc2luZyBwYXRoPycpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlc1twYXRoXTtcbiAgICAgIH0pO1xuXG4gICAgICBjYihrZXkpO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gUmV0dXJucyBhIGNvbXBhcmF0b3IgdGhhdCByZXByZXNlbnRzIHRoZSBzb3J0IHNwZWNpZmljYXRpb24gKGJ1dCBub3RcbiAgLy8gaW5jbHVkaW5nIGEgcG9zc2libGUgZ2VvcXVlcnkgZGlzdGFuY2UgdGllLWJyZWFrZXIpLlxuICBfZ2V0QmFzZUNvbXBhcmF0b3IoKSB7XG4gICAgaWYgKHRoaXMuX3NvcnRGdW5jdGlvbikge1xuICAgICAgcmV0dXJuIHRoaXMuX3NvcnRGdW5jdGlvbjtcbiAgICB9XG5cbiAgICAvLyBJZiB3ZSdyZSBvbmx5IHNvcnRpbmcgb24gZ2VvcXVlcnkgZGlzdGFuY2UgYW5kIG5vIHNwZWNzLCBqdXN0IHNheVxuICAgIC8vIGV2ZXJ5dGhpbmcgaXMgZXF1YWwuXG4gICAgaWYgKCF0aGlzLl9zb3J0U3BlY1BhcnRzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIChkb2MxLCBkb2MyKSA9PiAwO1xuICAgIH1cblxuICAgIHJldHVybiAoZG9jMSwgZG9jMikgPT4ge1xuICAgICAgY29uc3Qga2V5MSA9IHRoaXMuX2dldE1pbktleUZyb21Eb2MoZG9jMSk7XG4gICAgICBjb25zdCBrZXkyID0gdGhpcy5fZ2V0TWluS2V5RnJvbURvYyhkb2MyKTtcbiAgICAgIHJldHVybiB0aGlzLl9jb21wYXJlS2V5cyhrZXkxLCBrZXkyKTtcbiAgICB9O1xuICB9XG5cbiAgLy8gRmluZHMgdGhlIG1pbmltdW0ga2V5IGZyb20gdGhlIGRvYywgYWNjb3JkaW5nIHRvIHRoZSBzb3J0IHNwZWNzLiAgKFdlIHNheVxuICAvLyBcIm1pbmltdW1cIiBoZXJlIGJ1dCB0aGlzIGlzIHdpdGggcmVzcGVjdCB0byB0aGUgc29ydCBzcGVjLCBzbyBcImRlc2NlbmRpbmdcIlxuICAvLyBzb3J0IGZpZWxkcyBtZWFuIHdlJ3JlIGZpbmRpbmcgdGhlIG1heCBmb3IgdGhhdCBmaWVsZC4pXG4gIC8vXG4gIC8vIE5vdGUgdGhhdCB0aGlzIGlzIE5PVCBcImZpbmQgdGhlIG1pbmltdW0gdmFsdWUgb2YgdGhlIGZpcnN0IGZpZWxkLCB0aGVcbiAgLy8gbWluaW11bSB2YWx1ZSBvZiB0aGUgc2Vjb25kIGZpZWxkLCBldGNcIi4uLiBpdCdzIFwiY2hvb3NlIHRoZVxuICAvLyBsZXhpY29ncmFwaGljYWxseSBtaW5pbXVtIHZhbHVlIG9mIHRoZSBrZXkgdmVjdG9yLCBhbGxvd2luZyBvbmx5IGtleXMgd2hpY2hcbiAgLy8geW91IGNhbiBmaW5kIGFsb25nIHRoZSBzYW1lIHBhdGhzXCIuICBpZSwgZm9yIGEgZG9jIHthOiBbe3g6IDAsIHk6IDV9LCB7eDpcbiAgLy8gMSwgeTogM31dfSB3aXRoIHNvcnQgc3BlYyB7J2EueCc6IDEsICdhLnknOiAxfSwgdGhlIG9ubHkga2V5cyBhcmUgWzAsNV0gYW5kXG4gIC8vIFsxLDNdLCBhbmQgdGhlIG1pbmltdW0ga2V5IGlzIFswLDVdOyBub3RhYmx5LCBbMCwzXSBpcyBOT1QgYSBrZXkuXG4gIF9nZXRNaW5LZXlGcm9tRG9jKGRvYykge1xuICAgIGxldCBtaW5LZXkgPSBudWxsO1xuXG4gICAgdGhpcy5fZ2VuZXJhdGVLZXlzRnJvbURvYyhkb2MsIGtleSA9PiB7XG4gICAgICBpZiAobWluS2V5ID09PSBudWxsKSB7XG4gICAgICAgIG1pbktleSA9IGtleTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5fY29tcGFyZUtleXMoa2V5LCBtaW5LZXkpIDwgMCkge1xuICAgICAgICBtaW5LZXkgPSBrZXk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gbWluS2V5O1xuICB9XG5cbiAgX2dldFBhdGhzKCkge1xuICAgIHJldHVybiB0aGlzLl9zb3J0U3BlY1BhcnRzLm1hcChwYXJ0ID0+IHBhcnQucGF0aCk7XG4gIH1cblxuICAvLyBHaXZlbiBhbiBpbmRleCAnaScsIHJldHVybnMgYSBjb21wYXJhdG9yIHRoYXQgY29tcGFyZXMgdHdvIGtleSBhcnJheXMgYmFzZWRcbiAgLy8gb24gZmllbGQgJ2knLlxuICBfa2V5RmllbGRDb21wYXJhdG9yKGkpIHtcbiAgICBjb25zdCBpbnZlcnQgPSAhdGhpcy5fc29ydFNwZWNQYXJ0c1tpXS5hc2NlbmRpbmc7XG5cbiAgICByZXR1cm4gKGtleTEsIGtleTIpID0+IHtcbiAgICAgIGNvbnN0IGNvbXBhcmUgPSBMb2NhbENvbGxlY3Rpb24uX2YuX2NtcChrZXkxW2ldLCBrZXkyW2ldKTtcbiAgICAgIHJldHVybiBpbnZlcnQgPyAtY29tcGFyZSA6IGNvbXBhcmU7XG4gICAgfTtcbiAgfVxufVxuXG4vLyBHaXZlbiBhbiBhcnJheSBvZiBjb21wYXJhdG9yc1xuLy8gKGZ1bmN0aW9ucyAoYSxiKS0+KG5lZ2F0aXZlIG9yIHBvc2l0aXZlIG9yIHplcm8pKSwgcmV0dXJucyBhIHNpbmdsZVxuLy8gY29tcGFyYXRvciB3aGljaCB1c2VzIGVhY2ggY29tcGFyYXRvciBpbiBvcmRlciBhbmQgcmV0dXJucyB0aGUgZmlyc3Rcbi8vIG5vbi16ZXJvIHZhbHVlLlxuZnVuY3Rpb24gY29tcG9zZUNvbXBhcmF0b3JzKGNvbXBhcmF0b3JBcnJheSkge1xuICByZXR1cm4gKGEsIGIpID0+IHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbXBhcmF0b3JBcnJheS5sZW5ndGg7ICsraSkge1xuICAgICAgY29uc3QgY29tcGFyZSA9IGNvbXBhcmF0b3JBcnJheVtpXShhLCBiKTtcbiAgICAgIGlmIChjb21wYXJlICE9PSAwKSB7XG4gICAgICAgIHJldHVybiBjb21wYXJlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiAwO1xuICB9O1xufVxuIl19
