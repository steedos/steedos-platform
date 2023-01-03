(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var meteorInstall = Package.modules.meteorInstall;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var Random;

var require = meteorInstall({"node_modules":{"meteor":{"random":{"random.js":function module(require){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/random/random.js                                                                                     //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
// We use cryptographically strong PRNGs (crypto.getRandomBytes() on the server,
// window.crypto.getRandomValues() in the browser) when available. If these
// PRNGs fail, we fall back to the Alea PRNG, which is not cryptographically
// strong, and we seed it with various sources such as the date, Math.random,
// and window size on the client.  When using crypto.getRandomValues(), our
// primitive is hexString(), from which we construct fraction(). When using
// window.crypto.getRandomValues() or alea, the primitive is fraction and we use
// that to construct hex string.
if (Meteor.isServer) var nodeCrypto = Npm.require('crypto'); // see http://baagoe.org/en/wiki/Better_random_numbers_for_javascript
// for a full discussion and Alea implementation.

var Alea = function () {
  function Mash() {
    var n = 0xefc8249d;

    var mash = function (data) {
      data = data.toString();

      for (var i = 0; i < data.length; i++) {
        n += data.charCodeAt(i);
        var h = 0.02519603282416938 * n;
        n = h >>> 0;
        h -= n;
        h *= n;
        n = h >>> 0;
        h -= n;
        n += h * 0x100000000; // 2^32
      }

      return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
    };

    mash.version = 'Mash 0.9';
    return mash;
  }

  return function (args) {
    var s0 = 0;
    var s1 = 0;
    var s2 = 0;
    var c = 1;

    if (args.length == 0) {
      args = [+new Date()];
    }

    var mash = Mash();
    s0 = mash(' ');
    s1 = mash(' ');
    s2 = mash(' ');

    for (var i = 0; i < args.length; i++) {
      s0 -= mash(args[i]);

      if (s0 < 0) {
        s0 += 1;
      }

      s1 -= mash(args[i]);

      if (s1 < 0) {
        s1 += 1;
      }

      s2 -= mash(args[i]);

      if (s2 < 0) {
        s2 += 1;
      }
    }

    mash = null;

    var random = function () {
      var t = 2091639 * s0 + c * 2.3283064365386963e-10; // 2^-32

      s0 = s1;
      s1 = s2;
      return s2 = t - (c = t | 0);
    };

    random.uint32 = function () {
      return random() * 0x100000000; // 2^32
    };

    random.fract53 = function () {
      return random() + (random() * 0x200000 | 0) * 1.1102230246251565e-16; // 2^-53
    };

    random.version = 'Alea 0.9';
    random.args = args;
    return random;
  }(Array.prototype.slice.call(arguments));
};

var UNMISTAKABLE_CHARS = "23456789ABCDEFGHJKLMNPQRSTWXYZabcdefghijkmnopqrstuvwxyz";
var BASE64_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" + "0123456789-_"; // `type` is one of `RandomGenerator.Type` as defined below.
//
// options:
// - seeds: (required, only for RandomGenerator.Type.ALEA) an array
//   whose items will be `toString`ed and used as the seed to the Alea
//   algorithm

var RandomGenerator = function (type, options) {
  var self = this;
  self.type = type;

  if (!RandomGenerator.Type[type]) {
    throw new Error("Unknown random generator type: " + type);
  }

  if (type === RandomGenerator.Type.ALEA) {
    if (!options.seeds) {
      throw new Error("No seeds were provided for Alea PRNG");
    }

    self.alea = Alea.apply(null, options.seeds);
  }
}; // Types of PRNGs supported by the `RandomGenerator` class


RandomGenerator.Type = {
  // Use Node's built-in `crypto.getRandomBytes` (cryptographically
  // secure but not seedable, runs only on the server). Reverts to
  // `crypto.getPseudoRandomBytes` in the extremely uncommon case that
  // there isn't enough entropy yet
  NODE_CRYPTO: "NODE_CRYPTO",
  // Use non-IE browser's built-in `window.crypto.getRandomValues`
  // (cryptographically secure but not seedable, runs only in the
  // browser).
  BROWSER_CRYPTO: "BROWSER_CRYPTO",
  // Use the *fast*, seedaable and not cryptographically secure
  // Alea algorithm
  ALEA: "ALEA"
};
/**
 * @name Random.fraction
 * @summary Return a number between 0 and 1, like `Math.random`.
 * @locus Anywhere
 */

RandomGenerator.prototype.fraction = function () {
  var self = this;

  if (self.type === RandomGenerator.Type.ALEA) {
    return self.alea();
  } else if (self.type === RandomGenerator.Type.NODE_CRYPTO) {
    var numerator = parseInt(self.hexString(8), 16);
    return numerator * 2.3283064365386963e-10; // 2^-32
  } else if (self.type === RandomGenerator.Type.BROWSER_CRYPTO) {
    var array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] * 2.3283064365386963e-10; // 2^-32
  } else {
    throw new Error('Unknown random generator type: ' + self.type);
  }
};
/**
 * @name Random.hexString
 * @summary Return a random string of `n` hexadecimal digits.
 * @locus Anywhere
 * @param {Number} n Length of the string
 */


RandomGenerator.prototype.hexString = function (digits) {
  var self = this;

  if (self.type === RandomGenerator.Type.NODE_CRYPTO) {
    var numBytes = Math.ceil(digits / 2);
    var bytes; // Try to get cryptographically strong randomness. Fall back to
    // non-cryptographically strong if not available.

    try {
      bytes = nodeCrypto.randomBytes(numBytes);
    } catch (e) {
      // XXX should re-throw any error except insufficient entropy
      bytes = nodeCrypto.pseudoRandomBytes(numBytes);
    }

    var result = bytes.toString("hex"); // If the number of digits is odd, we'll have generated an extra 4 bits
    // of randomness, so we need to trim the last digit.

    return result.substring(0, digits);
  } else {
    return this._randomString(digits, "0123456789abcdef");
  }
};

RandomGenerator.prototype._randomString = function (charsCount, alphabet) {
  var self = this;
  var digits = [];

  for (var i = 0; i < charsCount; i++) {
    digits[i] = self.choice(alphabet);
  }

  return digits.join("");
};
/**
 * @name Random.id
 * @summary Return a unique identifier, such as `"Jjwjg6gouWLXhMGKW"`, that is
 * likely to be unique in the whole world.
 * @locus Anywhere
 * @param {Number} [n] Optional length of the identifier in characters
 *   (defaults to 17)
 */


RandomGenerator.prototype.id = function (charsCount) {
  var self = this; // 17 characters is around 96 bits of entropy, which is the amount of
  // state in the Alea PRNG.

  if (charsCount === undefined) charsCount = 17;
  return self._randomString(charsCount, UNMISTAKABLE_CHARS);
};
/**
 * @name Random.secret
 * @summary Return a random string of printable characters with 6 bits of
 * entropy per character. Use `Random.secret` for security-critical secrets
 * that are intended for machine, rather than human, consumption.
 * @locus Anywhere
 * @param {Number} [n] Optional length of the secret string (defaults to 43
 *   characters, or 256 bits of entropy)
 */


RandomGenerator.prototype.secret = function (charsCount) {
  var self = this; // Default to 256 bits of entropy, or 43 characters at 6 bits per
  // character.

  if (charsCount === undefined) charsCount = 43;
  return self._randomString(charsCount, BASE64_CHARS);
};
/**
 * @name Random.choice
 * @summary Return a random element of the given array or string.
 * @locus Anywhere
 * @param {Array|String} arrayOrString Array or string to choose from
 */


RandomGenerator.prototype.choice = function (arrayOrString) {
  var index = Math.floor(this.fraction() * arrayOrString.length);
  if (typeof arrayOrString === "string") return arrayOrString.substr(index, 1);else return arrayOrString[index];
}; // instantiate RNG.  Heuristically collect entropy from various sources when a
// cryptographic PRNG isn't available.
// client sources


var height = typeof window !== 'undefined' && window.innerHeight || typeof document !== 'undefined' && document.documentElement && document.documentElement.clientHeight || typeof document !== 'undefined' && document.body && document.body.clientHeight || 1;
var width = typeof window !== 'undefined' && window.innerWidth || typeof document !== 'undefined' && document.documentElement && document.documentElement.clientWidth || typeof document !== 'undefined' && document.body && document.body.clientWidth || 1;
var agent = typeof navigator !== 'undefined' && navigator.userAgent || "";

function createAleaGeneratorWithGeneratedSeed() {
  return new RandomGenerator(RandomGenerator.Type.ALEA, {
    seeds: [new Date(), height, width, agent, Math.random()]
  });
}

;

if (Meteor.isServer) {
  Random = new RandomGenerator(RandomGenerator.Type.NODE_CRYPTO);
} else {
  if (typeof window !== "undefined" && window.crypto && window.crypto.getRandomValues) {
    Random = new RandomGenerator(RandomGenerator.Type.BROWSER_CRYPTO);
  } else {
    // On IE 10 and below, there's no browser crypto API
    // available. Fall back to Alea
    //
    // XXX looks like at the moment, we use Alea in IE 11 as well,
    // which has `window.msCrypto` instead of `window.crypto`.
    Random = createAleaGeneratorWithGeneratedSeed();
  }
} // Create a non-cryptographically secure PRNG with a given seed (using
// the Alea algorithm)


Random.createWithSeeds = function () {
  for (var _len = arguments.length, seeds = new Array(_len), _key = 0; _key < _len; _key++) {
    seeds[_key] = arguments[_key];
  }

  if (seeds.length === 0) {
    throw new Error("No seeds were provided");
  }

  return new RandomGenerator(RandomGenerator.Type.ALEA, {
    seeds: seeds
  });
}; // Used like `Random`, but much faster and not cryptographically
// secure


Random.insecure = createAleaGeneratorWithGeneratedSeed();
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

require("/node_modules/meteor/random/random.js");

/* Exports */
Package._define("random", {
  Random: Random
});

})();

//# sourceURL=meteor://💻app/packages/random.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvcmFuZG9tL3JhbmRvbS5qcyJdLCJuYW1lcyI6WyJNZXRlb3IiLCJpc1NlcnZlciIsIm5vZGVDcnlwdG8iLCJOcG0iLCJyZXF1aXJlIiwiQWxlYSIsIk1hc2giLCJuIiwibWFzaCIsImRhdGEiLCJ0b1N0cmluZyIsImkiLCJsZW5ndGgiLCJjaGFyQ29kZUF0IiwiaCIsInZlcnNpb24iLCJhcmdzIiwiczAiLCJzMSIsInMyIiwiYyIsIkRhdGUiLCJyYW5kb20iLCJ0IiwidWludDMyIiwiZnJhY3Q1MyIsIkFycmF5IiwicHJvdG90eXBlIiwic2xpY2UiLCJjYWxsIiwiYXJndW1lbnRzIiwiVU5NSVNUQUtBQkxFX0NIQVJTIiwiQkFTRTY0X0NIQVJTIiwiUmFuZG9tR2VuZXJhdG9yIiwidHlwZSIsIm9wdGlvbnMiLCJzZWxmIiwiVHlwZSIsIkVycm9yIiwiQUxFQSIsInNlZWRzIiwiYWxlYSIsImFwcGx5IiwiTk9ERV9DUllQVE8iLCJCUk9XU0VSX0NSWVBUTyIsImZyYWN0aW9uIiwibnVtZXJhdG9yIiwicGFyc2VJbnQiLCJoZXhTdHJpbmciLCJhcnJheSIsIlVpbnQzMkFycmF5Iiwid2luZG93IiwiY3J5cHRvIiwiZ2V0UmFuZG9tVmFsdWVzIiwiZGlnaXRzIiwibnVtQnl0ZXMiLCJNYXRoIiwiY2VpbCIsImJ5dGVzIiwicmFuZG9tQnl0ZXMiLCJlIiwicHNldWRvUmFuZG9tQnl0ZXMiLCJyZXN1bHQiLCJzdWJzdHJpbmciLCJfcmFuZG9tU3RyaW5nIiwiY2hhcnNDb3VudCIsImFscGhhYmV0IiwiY2hvaWNlIiwiam9pbiIsImlkIiwidW5kZWZpbmVkIiwic2VjcmV0IiwiYXJyYXlPclN0cmluZyIsImluZGV4IiwiZmxvb3IiLCJzdWJzdHIiLCJoZWlnaHQiLCJpbm5lckhlaWdodCIsImRvY3VtZW50IiwiZG9jdW1lbnRFbGVtZW50IiwiY2xpZW50SGVpZ2h0IiwiYm9keSIsIndpZHRoIiwiaW5uZXJXaWR0aCIsImNsaWVudFdpZHRoIiwiYWdlbnQiLCJuYXZpZ2F0b3IiLCJ1c2VyQWdlbnQiLCJjcmVhdGVBbGVhR2VuZXJhdG9yV2l0aEdlbmVyYXRlZFNlZWQiLCJSYW5kb20iLCJjcmVhdGVXaXRoU2VlZHMiLCJpbnNlY3VyZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBLElBQUlBLE1BQU0sQ0FBQ0MsUUFBWCxFQUNFLElBQUlDLFVBQVUsR0FBR0MsR0FBRyxDQUFDQyxPQUFKLENBQVksUUFBWixDQUFqQixDLENBRUY7QUFDQTs7QUFDQSxJQUFJQyxJQUFJLEdBQUcsWUFBWTtBQUNyQixXQUFTQyxJQUFULEdBQWdCO0FBQ2QsUUFBSUMsQ0FBQyxHQUFHLFVBQVI7O0FBRUEsUUFBSUMsSUFBSSxHQUFHLFVBQVNDLElBQVQsRUFBZTtBQUN4QkEsVUFBSSxHQUFHQSxJQUFJLENBQUNDLFFBQUwsRUFBUDs7QUFDQSxXQUFLLElBQUlDLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdGLElBQUksQ0FBQ0csTUFBekIsRUFBaUNELENBQUMsRUFBbEMsRUFBc0M7QUFDcENKLFNBQUMsSUFBSUUsSUFBSSxDQUFDSSxVQUFMLENBQWdCRixDQUFoQixDQUFMO0FBQ0EsWUFBSUcsQ0FBQyxHQUFHLHNCQUFzQlAsQ0FBOUI7QUFDQUEsU0FBQyxHQUFHTyxDQUFDLEtBQUssQ0FBVjtBQUNBQSxTQUFDLElBQUlQLENBQUw7QUFDQU8sU0FBQyxJQUFJUCxDQUFMO0FBQ0FBLFNBQUMsR0FBR08sQ0FBQyxLQUFLLENBQVY7QUFDQUEsU0FBQyxJQUFJUCxDQUFMO0FBQ0FBLFNBQUMsSUFBSU8sQ0FBQyxHQUFHLFdBQVQsQ0FSb0MsQ0FRZDtBQUN2Qjs7QUFDRCxhQUFPLENBQUNQLENBQUMsS0FBSyxDQUFQLElBQVksc0JBQW5CLENBWndCLENBWW1CO0FBQzVDLEtBYkQ7O0FBZUFDLFFBQUksQ0FBQ08sT0FBTCxHQUFlLFVBQWY7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MEJHLEtBQTFCLEVBQWlDN0IsSUFBSSxDQUFDbEMsTUFBTCxFQUFqQztBQUFSLEdBRkssQ0FBUDtBQUdEOztBQUFBOztBQUVELElBQUl0QixNQUFNLENBQUNDLFFBQVgsRUFBcUI7QUFDbkJ3RixRQUFNLEdBQUcsSUFBSXhELGVBQUosQ0FBb0JBLGVBQWUsQ0FBQ0ksSUFBaEIsQ0FBcUJNLFdBQXpDLENBQVQ7QUFDRCxDQUZELE1BRU87QUFDTCxNQUFJLE9BQU9RLE1BQVAsS0FBa0IsV0FBbEIsSUFBaUNBLE1BQU0sQ0FBQ0MsTUFBeEMsSUFDQUQsTUFBTSxDQUFDQyxNQUFQLENBQWNDLGVBRGxCLEVBQ21DO0FBQ2pDb0MsVUFBTSxHQUFHLElBQUl4RCxlQUFKLENBQW9CQSxlQUFlLENBQUNJLElBQWhCLENBQXFCTyxjQUF6QyxDQUFUO0FBQ0QsR0FIRCxNQUdPO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBNkMsVUFBTSxHQUFHRCxvQ0FBb0MsRUFBN0M7QUFDRDtBQUNGLEMsQ0FFRDtBQUNBOzs7QUFDQUMsTUFBTSxDQUFDQyxlQUFQLEdBQXlCLFlBQW9CO0FBQUEsb0NBQVBsRCxLQUFPO0FBQVBBLFNBQU87QUFBQTs7QUFDM0MsTUFBSUEsS0FBSyxDQUFDNUIsTUFBTixLQUFpQixDQUFyQixFQUF3QjtBQUN0QixVQUFNLElBQUkwQixLQUFKLENBQVUsd0JBQVYsQ0FBTjtBQUNEOztBQUNELFNBQU8sSUFBSUwsZUFBSixDQUFvQkEsZUFBZSxDQUFDSSxJQUFoQixDQUFxQkUsSUFBekMsRUFBK0M7QUFBQ0MsU0FBSyxFQUFFQTtBQUFSLEdBQS9DLENBQVA7QUFDRCxDQUxELEMsQ0FPQTtBQUNBOzs7QUFDQWlELE1BQU0sQ0FBQ0UsUUFBUCxHQUFrQkgsb0NBQW9DLEVBQXRELEMiLCJmaWxlIjoiL3BhY2thZ2VzL3JhbmRvbS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIFdlIHVzZSBjcnlwdG9ncmFwaGljYWxseSBzdHJvbmcgUFJOR3MgKGNyeXB0by5nZXRSYW5kb21CeXRlcygpIG9uIHRoZSBzZXJ2ZXIsXG4vLyB3aW5kb3cuY3J5cHRvLmdldFJhbmRvbVZhbHVlcygpIGluIHRoZSBicm93c2VyKSB3aGVuIGF2YWlsYWJsZS4gSWYgdGhlc2Vcbi8vIFBSTkdzIGZhaWwsIHdlIGZhbGwgYmFjayB0byB0aGUgQWxlYSBQUk5HLCB3aGljaCBpcyBub3QgY3J5cHRvZ3JhcGhpY2FsbHlcbi8vIHN0cm9uZywgYW5kIHdlIHNlZWQgaXQgd2l0aCB2YXJpb3VzIHNvdXJjZXMgc3VjaCBhcyB0aGUgZGF0ZSwgTWF0aC5yYW5kb20sXG4vLyBhbmQgd2luZG93IHNpemUgb24gdGhlIGNsaWVudC4gIFdoZW4gdXNpbmcgY3J5cHRvLmdldFJhbmRvbVZhbHVlcygpLCBvdXJcbi8vIHByaW1pdGl2ZSBpcyBoZXhTdHJpbmcoKSwgZnJvbSB3aGljaCB3ZSBjb25zdHJ1Y3QgZnJhY3Rpb24oKS4gV2hlbiB1c2luZ1xuLy8gd2luZG93LmNyeXB0by5nZXRSYW5kb21WYWx1ZXMoKSBvciBhbGVhLCB0aGUgcHJpbWl0aXZlIGlzIGZyYWN0aW9uIGFuZCB3ZSB1c2Vcbi8vIHRoYXQgdG8gY29uc3RydWN0IGhleCBzdHJpbmcuXG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpXG4gIHZhciBub2RlQ3J5cHRvID0gTnBtLnJlcXVpcmUoJ2NyeXB0bycpO1xuXG4vLyBzZWUgaHR0cDovL2JhYWdvZS5vcmcvZW4vd2lraS9CZXR0ZXJfcmFuZG9tX251bWJlcnNfZm9yX2phdmFzY3JpcHRcbi8vIGZvciBhIGZ1bGwgZGlzY3Vzc2lvbiBhbmQgQWxlYSBpbXBsZW1lbnRhdGlvbi5cbnZhciBBbGVhID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBNYXNoKCkge1xuICAgIHZhciBuID0gMHhlZmM4MjQ5ZDtcblxuICAgIHZhciBtYXNoID0gZnVuY3Rpb24oZGF0YSkge1xuICAgICAgZGF0YSA9IGRhdGEudG9TdHJpbmcoKTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICBuICs9IGRhdGEuY2hhckNvZGVBdChpKTtcbiAgICAgICAgdmFyIGggPSAwLjAyNTE5NjAzMjgyNDE2OTM4ICogbjtcbiAgICAgICAgbiA9IGggPj4+IDA7XG4gICAgICAgIGggLT0gbjtcbiAgICAgICAgaCAqPSBuO1xuICAgICAgICBuID0gaCA+Pj4gMDtcbiAgICAgICAgaCAtPSBuO1xuICAgICAgICBuICs9IGggKiAweDEwMDAwMDAwMDsgLy8gMl4zMlxuICAgICAgfVxuICAgICAgcmV0dXJuIChuID4+PiAwKSAqIDIuMzI4MzA2NDM2NTM4Njk2M2UtMTA7IC8vIDJeLTMyXG4gICAgfTtcblxuICAgIG1hc2gudmVyc2lvbiA9ICdNYXNoIDAuOSc7XG4gICAgcmV0dXJuIG1hc2g7XG4gIH1cblxuICByZXR1cm4gKGZ1bmN0aW9uIChhcmdzKSB7XG4gICAgdmFyIHMwID0gMDtcbiAgICB2YXIgczEgPSAwO1xuICAgIHZhciBzMiA9IDA7XG4gICAgdmFyIGMgPSAxO1xuXG4gICAgaWYgKGFyZ3MubGVuZ3RoID09IDApIHtcbiAgICAgIGFyZ3MgPSBbK25ldyBEYXRlXTtcbiAgICB9XG4gICAgdmFyIG1hc2ggPSBNYXNoKCk7XG4gICAgczAgPSBtYXNoKCcgJyk7XG4gICAgczEgPSBtYXNoKCcgJyk7XG4gICAgczIgPSBtYXNoKCcgJyk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIHMwIC09IG1hc2goYXJnc1tpXSk7XG4gICAgICBpZiAoczAgPCAwKSB7XG4gICAgICAgIHMwICs9IDE7XG4gICAgICB9XG4gICAgICBzMSAtPSBtYXNoKGFyZ3NbaV0pO1xuICAgICAgaWYgKHMxIDwgMCkge1xuICAgICAgICBzMSArPSAxO1xuICAgICAgfVxuICAgICAgczIgLT0gbWFzaChhcmdzW2ldKTtcbiAgICAgIGlmIChzMiA8IDApIHtcbiAgICAgICAgczIgKz0gMTtcbiAgICAgIH1cbiAgICB9XG4gICAgbWFzaCA9IG51bGw7XG5cbiAgICB2YXIgcmFuZG9tID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgdCA9IDIwOTE2MzkgKiBzMCArIGMgKiAyLjMyODMwNjQzNjUzODY5NjNlLTEwOyAvLyAyXi0zMlxuICAgICAgczAgPSBzMTtcbiAgICAgIHMxID0gczI7XG4gICAgICByZXR1cm4gczIgPSB0IC0gKGMgPSB0IHwgMCk7XG4gICAgfTtcbiAgICByYW5kb20udWludDMyID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gcmFuZG9tKCkgKiAweDEwMDAwMDAwMDsgLy8gMl4zMlxuICAgIH07XG4gICAgcmFuZG9tLmZyYWN0NTMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiByYW5kb20oKSArXG4gICAgICAgIChyYW5kb20oKSAqIDB4MjAwMDAwIHwgMCkgKiAxLjExMDIyMzAyNDYyNTE1NjVlLTE2OyAvLyAyXi01M1xuICAgIH07XG4gICAgcmFuZG9tLnZlcnNpb24gPSAnQWxlYSAwLjknO1xuICAgIHJhbmRvbS5hcmdzID0gYXJncztcbiAgICByZXR1cm4gcmFuZG9tO1xuXG4gIH0gKEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cykpKTtcbn07XG5cbnZhciBVTk1JU1RBS0FCTEVfQ0hBUlMgPSBcIjIzNDU2Nzg5QUJDREVGR0hKS0xNTlBRUlNUV1hZWmFiY2RlZmdoaWprbW5vcHFyc3R1dnd4eXpcIjtcbnZhciBCQVNFNjRfQ0hBUlMgPSBcImFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVpcIiArXG4gIFwiMDEyMzQ1Njc4OS1fXCI7XG5cbi8vIGB0eXBlYCBpcyBvbmUgb2YgYFJhbmRvbUdlbmVyYXRvci5UeXBlYCBhcyBkZWZpbmVkIGJlbG93LlxuLy9cbi8vIG9wdGlvbnM6XG4vLyAtIHNlZWRzOiAocmVxdWlyZWQsIG9ubHkgZm9yIFJhbmRvbUdlbmVyYXRvci5UeXBlLkFMRUEpIGFuIGFycmF5XG4vLyAgIHdob3NlIGl0ZW1zIHdpbGwgYmUgYHRvU3RyaW5nYGVkIGFuZCB1c2VkIGFzIHRoZSBzZWVkIHRvIHRoZSBBbGVhXG4vLyAgIGFsZ29yaXRobVxudmFyIFJhbmRvbUdlbmVyYXRvciA9IGZ1bmN0aW9uICh0eXBlLCBvcHRpb25zKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgc2VsZi50eXBlID0gdHlwZTtcblxuICBpZiAoIVJhbmRvbUdlbmVyYXRvci5UeXBlW3R5cGVdKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiVW5rbm93biByYW5kb20gZ2VuZXJhdG9yIHR5cGU6IFwiICsgdHlwZSk7XG4gIH1cblxuICBpZiAodHlwZSA9PT0gUmFuZG9tR2VuZXJhdG9yLlR5cGUuQUxFQSkge1xuICAgIGlmICghb3B0aW9ucy5zZWVkcykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm8gc2VlZHMgd2VyZSBwcm92aWRlZCBmb3IgQWxlYSBQUk5HXCIpO1xuICAgIH1cbiAgICBzZWxmLmFsZWEgPSBBbGVhLmFwcGx5KG51bGwsIG9wdGlvbnMuc2VlZHMpO1xuICB9XG59O1xuXG4vLyBUeXBlcyBvZiBQUk5HcyBzdXBwb3J0ZWQgYnkgdGhlIGBSYW5kb21HZW5lcmF0b3JgIGNsYXNzXG5SYW5kb21HZW5lcmF0b3IuVHlwZSA9IHtcbiAgLy8gVXNlIE5vZGUncyBidWlsdC1pbiBgY3J5cHRvLmdldFJhbmRvbUJ5dGVzYCAoY3J5cHRvZ3JhcGhpY2FsbHlcbiAgLy8gc2VjdXJlIGJ1dCBub3Qgc2VlZGFibGUsIHJ1bnMgb25seSBvbiB0aGUgc2VydmVyKS4gUmV2ZXJ0cyB0b1xuICAvLyBgY3J5cHRvLmdldFBzZXVkb1JhbmRvbUJ5dGVzYCBpbiB0aGUgZXh0cmVtZWx5IHVuY29tbW9uIGNhc2UgdGhhdFxuICAvLyB0aGVyZSBpc24ndCBlbm91Z2ggZW50cm9weSB5ZXRcbiAgTk9ERV9DUllQVE86IFwiTk9ERV9DUllQVE9cIixcblxuICAvLyBVc2Ugbm9uLUlFIGJyb3dzZXIncyBidWlsdC1pbiBgd2luZG93LmNyeXB0by5nZXRSYW5kb21WYWx1ZXNgXG4gIC8vIChjcnlwdG9ncmFwaGljYWxseSBzZWN1cmUgYnV0IG5vdCBzZWVkYWJsZSwgcnVucyBvbmx5IGluIHRoZVxuICAvLyBicm93c2VyKS5cbiAgQlJPV1NFUl9DUllQVE86IFwiQlJPV1NFUl9DUllQVE9cIixcblxuICAvLyBVc2UgdGhlICpmYXN0Kiwgc2VlZGFhYmxlIGFuZCBub3QgY3J5cHRvZ3JhcGhpY2FsbHkgc2VjdXJlXG4gIC8vIEFsZWEgYWxnb3JpdGhtXG4gIEFMRUE6IFwiQUxFQVwiLFxufTtcblxuLyoqXG4gKiBAbmFtZSBSYW5kb20uZnJhY3Rpb25cbiAqIEBzdW1tYXJ5IFJldHVybiBhIG51bWJlciBiZXR3ZWVuIDAgYW5kIDEsIGxpa2UgYE1hdGgucmFuZG9tYC5cbiAqIEBsb2N1cyBBbnl3aGVyZVxuICovXG5SYW5kb21HZW5lcmF0b3IucHJvdG90eXBlLmZyYWN0aW9uID0gZnVuY3Rpb24gKCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIGlmIChzZWxmLnR5cGUgPT09IFJhbmRvbUdlbmVyYXRvci5UeXBlLkFMRUEpIHtcbiAgICByZXR1cm4gc2VsZi5hbGVhKCk7XG4gIH0gZWxzZSBpZiAoc2VsZi50eXBlID09PSBSYW5kb21HZW5lcmF0b3IuVHlwZS5OT0RFX0NSWVBUTykge1xuICAgIHZhciBudW1lcmF0b3IgPSBwYXJzZUludChzZWxmLmhleFN0cmluZyg4KSwgMTYpO1xuICAgIHJldHVybiBudW1lcmF0b3IgKiAyLjMyODMwNjQzNjUzODY5NjNlLTEwOyAvLyAyXi0zMlxuICB9IGVsc2UgaWYgKHNlbGYudHlwZSA9PT0gUmFuZG9tR2VuZXJhdG9yLlR5cGUuQlJPV1NFUl9DUllQVE8pIHtcbiAgICB2YXIgYXJyYXkgPSBuZXcgVWludDMyQXJyYXkoMSk7XG4gICAgd2luZG93LmNyeXB0by5nZXRSYW5kb21WYWx1ZXMoYXJyYXkpO1xuICAgIHJldHVybiBhcnJheVswXSAqIDIuMzI4MzA2NDM2NTM4Njk2M2UtMTA7IC8vIDJeLTMyXG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIHJhbmRvbSBnZW5lcmF0b3IgdHlwZTogJyArIHNlbGYudHlwZSk7XG4gIH1cbn07XG5cbi8qKlxuICogQG5hbWUgUmFuZG9tLmhleFN0cmluZ1xuICogQHN1bW1hcnkgUmV0dXJuIGEgcmFuZG9tIHN0cmluZyBvZiBgbmAgaGV4YWRlY2ltYWwgZGlnaXRzLlxuICogQGxvY3VzIEFueXdoZXJlXG4gKiBAcGFyYW0ge051bWJlcn0gbiBMZW5ndGggb2YgdGhlIHN0cmluZ1xuICovXG5SYW5kb21HZW5lcmF0b3IucHJvdG90eXBlLmhleFN0cmluZyA9IGZ1bmN0aW9uIChkaWdpdHMpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBpZiAoc2VsZi50eXBlID09PSBSYW5kb21HZW5lcmF0b3IuVHlwZS5OT0RFX0NSWVBUTykge1xuICAgIHZhciBudW1CeXRlcyA9IE1hdGguY2VpbChkaWdpdHMgLyAyKTtcbiAgICB2YXIgYnl0ZXM7XG4gICAgLy8gVHJ5IHRvIGdldCBjcnlwdG9ncmFwaGljYWxseSBzdHJvbmcgcmFuZG9tbmVzcy4gRmFsbCBiYWNrIHRvXG4gICAgLy8gbm9uLWNyeXB0b2dyYXBoaWNhbGx5IHN0cm9uZyBpZiBub3QgYXZhaWxhYmxlLlxuICAgIHRyeSB7XG4gICAgICBieXRlcyA9IG5vZGVDcnlwdG8ucmFuZG9tQnl0ZXMobnVtQnl0ZXMpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIC8vIFhYWCBzaG91bGQgcmUtdGhyb3cgYW55IGVycm9yIGV4Y2VwdCBpbnN1ZmZpY2llbnQgZW50cm9weVxuICAgICAgYnl0ZXMgPSBub2RlQ3J5cHRvLnBzZXVkb1JhbmRvbUJ5dGVzKG51bUJ5dGVzKTtcbiAgICB9XG4gICAgdmFyIHJlc3VsdCA9IGJ5dGVzLnRvU3RyaW5nKFwiaGV4XCIpO1xuICAgIC8vIElmIHRoZSBudW1iZXIgb2YgZGlnaXRzIGlzIG9kZCwgd2UnbGwgaGF2ZSBnZW5lcmF0ZWQgYW4gZXh0cmEgNCBiaXRzXG4gICAgLy8gb2YgcmFuZG9tbmVzcywgc28gd2UgbmVlZCB0byB0cmltIHRoZSBsYXN0IGRpZ2l0LlxuICAgIHJldHVybiByZXN1bHQuc3Vic3RyaW5nKDAsIGRpZ2l0cyk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHRoaXMuX3JhbmRvbVN0cmluZyhkaWdpdHMsIFwiMDEyMzQ1Njc4OWFiY2RlZlwiKTtcbiAgfVxufTtcblxuUmFuZG9tR2VuZXJhdG9yLnByb3RvdHlwZS5fcmFuZG9tU3RyaW5nID0gZnVuY3Rpb24gKGNoYXJzQ291bnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxwaGFiZXQpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB2YXIgZGlnaXRzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY2hhcnNDb3VudDsgaSsrKSB7XG4gICAgZGlnaXRzW2ldID0gc2VsZi5jaG9pY2UoYWxwaGFiZXQpO1xuICB9XG4gIHJldHVybiBkaWdpdHMuam9pbihcIlwiKTtcbn07XG5cbi8qKlxuICogQG5hbWUgUmFuZG9tLmlkXG4gKiBAc3VtbWFyeSBSZXR1cm4gYSB1bmlxdWUgaWRlbnRpZmllciwgc3VjaCBhcyBgXCJKandqZzZnb3VXTFhoTUdLV1wiYCwgdGhhdCBpc1xuICogbGlrZWx5IHRvIGJlIHVuaXF1ZSBpbiB0aGUgd2hvbGUgd29ybGQuXG4gKiBAbG9jdXMgQW55d2hlcmVcbiAqIEBwYXJhbSB7TnVtYmVyfSBbbl0gT3B0aW9uYWwgbGVuZ3RoIG9mIHRoZSBpZGVudGlmaWVyIGluIGNoYXJhY3RlcnNcbiAqICAgKGRlZmF1bHRzIHRvIDE3KVxuICovXG5SYW5kb21HZW5lcmF0b3IucHJvdG90eXBlLmlkID0gZnVuY3Rpb24gKGNoYXJzQ291bnQpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICAvLyAxNyBjaGFyYWN0ZXJzIGlzIGFyb3VuZCA5NiBiaXRzIG9mIGVudHJvcHksIHdoaWNoIGlzIHRoZSBhbW91bnQgb2ZcbiAgLy8gc3RhdGUgaW4gdGhlIEFsZWEgUFJORy5cbiAgaWYgKGNoYXJzQ291bnQgPT09IHVuZGVmaW5lZClcbiAgICBjaGFyc0NvdW50ID0gMTc7XG5cbiAgcmV0dXJuIHNlbGYuX3JhbmRvbVN0cmluZyhjaGFyc0NvdW50LCBVTk1JU1RBS0FCTEVfQ0hBUlMpO1xufTtcblxuLyoqXG4gKiBAbmFtZSBSYW5kb20uc2VjcmV0XG4gKiBAc3VtbWFyeSBSZXR1cm4gYSByYW5kb20gc3RyaW5nIG9mIHByaW50YWJsZSBjaGFyYWN0ZXJzIHdpdGggNiBiaXRzIG9mXG4gKiBlbnRyb3B5IHBlciBjaGFyYWN0ZXIuIFVzZSBgUmFuZG9tLnNlY3JldGAgZm9yIHNlY3VyaXR5LWNyaXRpY2FsIHNlY3JldHNcbiAqIHRoYXQgYXJlIGludGVuZGVkIGZvciBtYWNoaW5lLCByYXRoZXIgdGhhbiBodW1hbiwgY29uc3VtcHRpb24uXG4gKiBAbG9jdXMgQW55d2hlcmVcbiAqIEBwYXJhbSB7TnVtYmVyfSBbbl0gT3B0aW9uYWwgbGVuZ3RoIG9mIHRoZSBzZWNyZXQgc3RyaW5nIChkZWZhdWx0cyB0byA0M1xuICogICBjaGFyYWN0ZXJzLCBvciAyNTYgYml0cyBvZiBlbnRyb3B5KVxuICovXG5SYW5kb21HZW5lcmF0b3IucHJvdG90eXBlLnNlY3JldCA9IGZ1bmN0aW9uIChjaGFyc0NvdW50KSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgLy8gRGVmYXVsdCB0byAyNTYgYml0cyBvZiBlbnRyb3B5LCBvciA0MyBjaGFyYWN0ZXJzIGF0IDYgYml0cyBwZXJcbiAgLy8gY2hhcmFjdGVyLlxuICBpZiAoY2hhcnNDb3VudCA9PT0gdW5kZWZpbmVkKVxuICAgIGNoYXJzQ291bnQgPSA0MztcbiAgcmV0dXJuIHNlbGYuX3JhbmRvbVN0cmluZyhjaGFyc0NvdW50LCBCQVNFNjRfQ0hBUlMpO1xufTtcblxuLyoqXG4gKiBAbmFtZSBSYW5kb20uY2hvaWNlXG4gKiBAc3VtbWFyeSBSZXR1cm4gYSByYW5kb20gZWxlbWVudCBvZiB0aGUgZ2l2ZW4gYXJyYXkgb3Igc3RyaW5nLlxuICogQGxvY3VzIEFueXdoZXJlXG4gKiBAcGFyYW0ge0FycmF5fFN0cmluZ30gYXJyYXlPclN0cmluZyBBcnJheSBvciBzdHJpbmcgdG8gY2hvb3NlIGZyb21cbiAqL1xuUmFuZG9tR2VuZXJhdG9yLnByb3RvdHlwZS5jaG9pY2UgPSBmdW5jdGlvbiAoYXJyYXlPclN0cmluZykge1xuICB2YXIgaW5kZXggPSBNYXRoLmZsb29yKHRoaXMuZnJhY3Rpb24oKSAqIGFycmF5T3JTdHJpbmcubGVuZ3RoKTtcbiAgaWYgKHR5cGVvZiBhcnJheU9yU3RyaW5nID09PSBcInN0cmluZ1wiKVxuICAgIHJldHVybiBhcnJheU9yU3RyaW5nLnN1YnN0cihpbmRleCwgMSk7XG4gIGVsc2VcbiAgICByZXR1cm4gYXJyYXlPclN0cmluZ1tpbmRleF07XG59O1xuXG4vLyBpbnN0YW50aWF0ZSBSTkcuICBIZXVyaXN0aWNhbGx5IGNvbGxlY3QgZW50cm9weSBmcm9tIHZhcmlvdXMgc291cmNlcyB3aGVuIGFcbi8vIGNyeXB0b2dyYXBoaWMgUFJORyBpc24ndCBhdmFpbGFibGUuXG5cbi8vIGNsaWVudCBzb3VyY2VzXG52YXIgaGVpZ2h0ID0gKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5pbm5lckhlaWdodCkgfHxcbiAgICAgICh0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnXG4gICAgICAgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50XG4gICAgICAgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodCkgfHxcbiAgICAgICh0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnXG4gICAgICAgJiYgZG9jdW1lbnQuYm9keVxuICAgICAgICYmIGRvY3VtZW50LmJvZHkuY2xpZW50SGVpZ2h0KSB8fFxuICAgICAgMTtcblxudmFyIHdpZHRoID0gKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5pbm5lcldpZHRoKSB8fFxuICAgICAgKHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCdcbiAgICAgICAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnRcbiAgICAgICAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGgpIHx8XG4gICAgICAodHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJ1xuICAgICAgICYmIGRvY3VtZW50LmJvZHlcbiAgICAgICAmJiBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoKSB8fFxuICAgICAgMTtcblxudmFyIGFnZW50ID0gKHR5cGVvZiBuYXZpZ2F0b3IgIT09ICd1bmRlZmluZWQnICYmIG5hdmlnYXRvci51c2VyQWdlbnQpIHx8IFwiXCI7XG5cbmZ1bmN0aW9uIGNyZWF0ZUFsZWFHZW5lcmF0b3JXaXRoR2VuZXJhdGVkU2VlZCgpIHtcbiAgcmV0dXJuIG5ldyBSYW5kb21HZW5lcmF0b3IoXG4gICAgUmFuZG9tR2VuZXJhdG9yLlR5cGUuQUxFQSxcbiAgICB7c2VlZHM6IFtuZXcgRGF0ZSwgaGVpZ2h0LCB3aWR0aCwgYWdlbnQsIE1hdGgucmFuZG9tKCldfSk7XG59O1xuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIFJhbmRvbSA9IG5ldyBSYW5kb21HZW5lcmF0b3IoUmFuZG9tR2VuZXJhdG9yLlR5cGUuTk9ERV9DUllQVE8pO1xufSBlbHNlIHtcbiAgaWYgKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgJiYgd2luZG93LmNyeXB0byAmJlxuICAgICAgd2luZG93LmNyeXB0by5nZXRSYW5kb21WYWx1ZXMpIHtcbiAgICBSYW5kb20gPSBuZXcgUmFuZG9tR2VuZXJhdG9yKFJhbmRvbUdlbmVyYXRvci5UeXBlLkJST1dTRVJfQ1JZUFRPKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBPbiBJRSAxMCBhbmQgYmVsb3csIHRoZXJlJ3Mgbm8gYnJvd3NlciBjcnlwdG8gQVBJXG4gICAgLy8gYXZhaWxhYmxlLiBGYWxsIGJhY2sgdG8gQWxlYVxuICAgIC8vXG4gICAgLy8gWFhYIGxvb2tzIGxpa2UgYXQgdGhlIG1vbWVudCwgd2UgdXNlIEFsZWEgaW4gSUUgMTEgYXMgd2VsbCxcbiAgICAvLyB3aGljaCBoYXMgYHdpbmRvdy5tc0NyeXB0b2AgaW5zdGVhZCBvZiBgd2luZG93LmNyeXB0b2AuXG4gICAgUmFuZG9tID0gY3JlYXRlQWxlYUdlbmVyYXRvcldpdGhHZW5lcmF0ZWRTZWVkKCk7XG4gIH1cbn1cblxuLy8gQ3JlYXRlIGEgbm9uLWNyeXB0b2dyYXBoaWNhbGx5IHNlY3VyZSBQUk5HIHdpdGggYSBnaXZlbiBzZWVkICh1c2luZ1xuLy8gdGhlIEFsZWEgYWxnb3JpdGhtKVxuUmFuZG9tLmNyZWF0ZVdpdGhTZWVkcyA9IGZ1bmN0aW9uICguLi5zZWVkcykge1xuICBpZiAoc2VlZHMubGVuZ3RoID09PSAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiTm8gc2VlZHMgd2VyZSBwcm92aWRlZFwiKTtcbiAgfVxuICByZXR1cm4gbmV3IFJhbmRvbUdlbmVyYXRvcihSYW5kb21HZW5lcmF0b3IuVHlwZS5BTEVBLCB7c2VlZHM6IHNlZWRzfSk7XG59O1xuXG4vLyBVc2VkIGxpa2UgYFJhbmRvbWAsIGJ1dCBtdWNoIGZhc3RlciBhbmQgbm90IGNyeXB0b2dyYXBoaWNhbGx5XG4vLyBzZWN1cmVcblJhbmRvbS5pbnNlY3VyZSA9IGNyZWF0ZUFsZWFHZW5lcmF0b3JXaXRoR2VuZXJhdGVkU2VlZCgpO1xuIl19
