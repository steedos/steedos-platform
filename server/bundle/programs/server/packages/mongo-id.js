(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var EJSON = Package.ejson.EJSON;
var IdMap = Package['id-map'].IdMap;
var Random = Package.random.Random;
var ECMAScript = Package.ecmascript.ECMAScript;
var meteorInstall = Package.modules.meteorInstall;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var hexString, MongoID;

var require = meteorInstall({"node_modules":{"meteor":{"mongo-id":{"id.js":function module(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                           //
// packages/mongo-id/id.js                                                                   //
//                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////
                                                                                             //
module.export({
  MongoID: () => MongoID
});
let EJSON;
module.link("meteor/ejson", {
  EJSON(v) {
    EJSON = v;
  }

}, 0);
let Random;
module.link("meteor/random", {
  Random(v) {
    Random = v;
  }

}, 1);
const MongoID = {};

MongoID._looksLikeObjectID = str => str.length === 24 && str.match(/^[0-9a-f]*$/);

MongoID.ObjectID = class ObjectID {
  constructor(hexString) {
    //random-based impl of Mongo ObjectID
    if (hexString) {
      hexString = hexString.toLowerCase();

      if (!MongoID._looksLikeObjectID(hexString)) {
        throw new Error('Invalid hexadecimal string for creating an ObjectID');
      } // meant to work with _.isEqual(), which relies on structural equality


      this._str = hexString;
    } else {
      this._str = Random.hexString(24);
    }
  }

  equals(other) {
    return other instanceof MongoID.ObjectID && this.valueOf() === other.valueOf();
  }

  toString() {
    return "ObjectID(\"".concat(this._str, "\")");
  }

  clone() {
    return new MongoID.ObjectID(this._str);
  }

  typeName() {
    return 'oid';
  }

  getTimestamp() {
    return Number.parseInt(this._str.substr(0, 8), 16);
  }

  valueOf() {
    return this._str;
  }

  toJSONValue() {
    return this.valueOf();
  }

  toHexString() {
    return this.valueOf();
  }

};
EJSON.addType('oid', str => new MongoID.ObjectID(str));

MongoID.idStringify = id => {
  if (id instanceof MongoID.ObjectID) {
    return id.valueOf();
  } else if (typeof id === 'string') {
    if (id === '') {
      return id;
    } else if (id.startsWith('-') || // escape previously dashed strings
    id.startsWith('~') || // escape escaped numbers, true, false
    MongoID._looksLikeObjectID(id) || // escape object-id-form strings
    id.startsWith('{')) {
      // escape object-form strings, for maybe implementing later
      return "-".concat(id);
    } else {
      return id; // other strings go through unchanged.
    }
  } else if (id === undefined) {
    return '-';
  } else if (typeof id === 'object' && id !== null) {
    throw new Error('Meteor does not currently support objects other than ObjectID as ids');
  } else {
    // Numbers, true, false, null
    return "~".concat(JSON.stringify(id));
  }
};

MongoID.idParse = id => {
  if (id === '') {
    return id;
  } else if (id === '-') {
    return undefined;
  } else if (id.startsWith('-')) {
    return id.substr(1);
  } else if (id.startsWith('~')) {
    return JSON.parse(id.substr(1));
  } else if (MongoID._looksLikeObjectID(id)) {
    return new MongoID.ObjectID(id);
  } else {
    return id;
  }
};
///////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

var exports = require("/node_modules/meteor/mongo-id/id.js");

/* Exports */
Package._define("mongo-id", exports, {
  MongoID: MongoID
});

})();

//# sourceURL=meteor://💻app/packages/mongo-id.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvbW9uZ28taWQvaWQuanMiXSwibmFtZXMiOlsibW9kdWxlIiwiZXhwb3J0IiwiTW9uZ29JRCIsIkVKU09OIiwibGluayIsInYiLCJSYW5kb20iLCJfbG9va3NMaWtlT2JqZWN0SUQiLCJzdHIiLCJsZW5ndGgiLCJtYXRjaCIsIk9iamVjdElEIiwiY29uc3RydWN0b3IiLCJoZXhTdHJpbmciLCJ0b0xvd2VyQ2FzZSIsIkVycm9yIiwiX3N0ciIsImVxdWFscyIsIm90aGVyIiwidmFsdWVPZiIsInRvU3RyaW5nIiwiY2xvbmUiLCJ0eXBlTmFtZSIsImdldFRpbWVzdGFtcCIsIk51bWJlciIsInBhcnNlSW50Iiwic3Vic3RyIiwidG9KU09OVmFsdWUiLCJ0b0hleFN0cmluZyIsImFkZFR5cGUiLCJpZFN0cmluZ2lmeSIsImlkIiwic3RhcnRzV2l0aCIsInVuZGVmaW5lZCIsIkpTT04iLCJzdHJpbmdpZnkiLCJpZFBhcnNlIiwicGFyc2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBQSxNQUFNLENBQUNDLE1BQVAsQ0FBYztBQUFDQyxTQUFPLEVBQUMsTUFBSUE7QUFBYixDQUFkO0FBQXFDLElBQUlDLEtBQUo7QUFBVUgsTUFBTSxDQUFDSSxJQUFQLENBQVksY0FBWixFQUEyQjtBQUFDRCxPQUFLLENBQUNFLENBQUQsRUFBRztBQUFDRixTQUFLLEdBQUNFLENBQU47QUFBUTs7QUFBbEIsQ0FBM0IsRUFBK0MsQ0FBL0M7QUFBa0QsSUFBSUMsTUFBSjtBQUFXTixNQUFNLENBQUNJLElBQVAsQ0FBWSxlQUFaLEVBQTRCO0FBQUNFLFFBQU0sQ0FBQ0QsQ0FBRCxFQUFHO0FBQUNDLFVBQU0sR0FBQ0QsQ0FBUDtBQUFTOztBQUFwQixDQUE1QixFQUFrRCxDQUFsRDtBQUc1RyxNQUFNSCxPQUFPLEdBQUcsRUFBaEI7O0FBRUFBLE9BQU8sQ0FBQ0ssa0JBQVIsR0FBNkJDLEdBQUcsSUFBSUEsR0FB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dUJBN0IsT0FBTyxDQUFDa0MsT0FBUixHQUFtQkwsRUFBRCxJQUFRO0FBQ3hCLE1BQUlBLEVBQUUsS0FBSyxFQUFYLEVBQWU7QUFDYixXQUFPQSxFQUFQO0FBQ0QsR0FGRCxNQUVPLElBQUlBLEVBQUUsS0FBSyxHQUFYLEVBQWdCO0FBQ3JCLFdBQU9FLFNBQVA7QUFDRCxHQUZNLE1BRUEsSUFBSUYsRUFBRSxDQUFDQyxVQUFILENBQWMsR0FBZCxDQUFKLEVBQXdCO0FBQzdCLFdBQU9ELEVBQUUsQ0FBQ0wsTUFBSCxDQUFVLENBQVYsQ0FBUDtBQUNELEdBRk0sTUFFQSxJQUFJSyxFQUFFLENBQUNDLFVBQUgsQ0FBYyxHQUFkLENBQUosRUFBd0I7QUFDN0IsV0FBT0UsSUFBSSxDQUFDRyxLQUFMLENBQVdOLEVBQUUsQ0FBQ0wsTUFBSCxDQUFVLENBQVYsQ0FBWCxDQUFQO0FBQ0QsR0FGTSxNQUVBLElBQUl4QixPQUFPLENBQUNLLGtCQUFSLENBQTJCd0IsRUFBM0IsQ0FBSixFQUFvQztBQUN6QyxXQUFPLElBQUk3QixPQUFPLENBQUNTLFFBQVosQ0FBcUJvQixFQUFyQixDQUFQO0FBQ0QsR0FGTSxNQUVBO0FBQ0wsV0FBT0EsRUFBUDtBQUNEO0FBQ0YsQ0FkRCxDIiwiZmlsZSI6Ii9wYWNrYWdlcy9tb25nby1pZC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEVKU09OIH0gZnJvbSAnbWV0ZW9yL2Vqc29uJztcbmltcG9ydCB7IFJhbmRvbSB9IGZyb20gJ21ldGVvci9yYW5kb20nO1xuXG5jb25zdCBNb25nb0lEID0ge307XG5cbk1vbmdvSUQuX2xvb2tzTGlrZU9iamVjdElEID0gc3RyID0+IHN0ci5sZW5ndGggPT09IDI0ICYmIHN0ci5tYXRjaCgvXlswLTlhLWZdKiQvKTtcblxuTW9uZ29JRC5PYmplY3RJRCA9IGNsYXNzIE9iamVjdElEIHtcbiAgY29uc3RydWN0b3IgKGhleFN0cmluZykge1xuICAgIC8vcmFuZG9tLWJhc2VkIGltcGwgb2YgTW9uZ28gT2JqZWN0SURcbiAgICBpZiAoaGV4U3RyaW5nKSB7XG4gICAgICBoZXhTdHJpbmcgPSBoZXhTdHJpbmcudG9Mb3dlckNhc2UoKTtcbiAgICAgIGlmICghTW9uZ29JRC5fbG9va3NMaWtlT2JqZWN0SUQoaGV4U3RyaW5nKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgaGV4YWRlY2ltYWwgc3RyaW5nIGZvciBjcmVhdGluZyBhbiBPYmplY3RJRCcpO1xuICAgICAgfVxuICAgICAgLy8gbWVhbnQgdG8gd29yayB3aXRoIF8uaXNFcXVhbCgpLCB3aGljaCByZWxpZXMgb24gc3RydWN0dXJhbCBlcXVhbGl0eVxuICAgICAgdGhpcy5fc3RyID0gaGV4U3RyaW5nO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9zdHIgPSBSYW5kb20uaGV4U3RyaW5nKDI0KTtcbiAgICB9XG4gIH1cblxuICBlcXVhbHMob3RoZXIpIHtcbiAgICByZXR1cm4gb3RoZXIgaW5zdGFuY2VvZiBNb25nb0lELk9iamVjdElEICYmXG4gICAgdGhpcy52YWx1ZU9mKCkgPT09IG90aGVyLnZhbHVlT2YoKTtcbiAgfVxuXG4gIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiBgT2JqZWN0SUQoXCIke3RoaXMuX3N0cn1cIilgO1xuICB9XG5cbiAgY2xvbmUoKSB7XG4gICAgcmV0dXJuIG5ldyBNb25nb0lELk9iamVjdElEKHRoaXMuX3N0cik7XG4gIH1cblxuICB0eXBlTmFtZSgpIHtcbiAgICByZXR1cm4gJ29pZCc7XG4gIH1cbiAgXG4gIGdldFRpbWVzdGFtcCgpIHtcbiAgICByZXR1cm4gTnVtYmVyLnBhcnNlSW50KHRoaXMuX3N0ci5zdWJzdHIoMCwgOCksIDE2KTtcbiAgfVxuXG4gIHZhbHVlT2YoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0cjtcbiAgfVxuXG4gIHRvSlNPTlZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLnZhbHVlT2YoKTtcbiAgfVxuXG4gIHRvSGV4U3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLnZhbHVlT2YoKTtcbiAgfVxuXG59XG5cbkVKU09OLmFkZFR5cGUoJ29pZCcsIHN0ciA9PiBuZXcgTW9uZ29JRC5PYmplY3RJRChzdHIpKTtcblxuTW9uZ29JRC5pZFN0cmluZ2lmeSA9IChpZCkgPT4ge1xuICBpZiAoaWQgaW5zdGFuY2VvZiBNb25nb0lELk9iamVjdElEKSB7XG4gICAgcmV0dXJuIGlkLnZhbHVlT2YoKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgaWQgPT09ICdzdHJpbmcnKSB7XG4gICAgaWYgKGlkID09PSAnJykge1xuICAgICAgcmV0dXJuIGlkO1xuICAgIH0gZWxzZSBpZiAoaWQuc3RhcnRzV2l0aCgnLScpIHx8IC8vIGVzY2FwZSBwcmV2aW91c2x5IGRhc2hlZCBzdHJpbmdzXG4gICAgICAgICAgICAgICBpZC5zdGFydHNXaXRoKCd+JykgfHwgLy8gZXNjYXBlIGVzY2FwZWQgbnVtYmVycywgdHJ1ZSwgZmFsc2VcbiAgICAgICAgICAgICAgIE1vbmdvSUQuX2xvb2tzTGlrZU9iamVjdElEKGlkKSB8fCAvLyBlc2NhcGUgb2JqZWN0LWlkLWZvcm0gc3RyaW5nc1xuICAgICAgICAgICAgICAgaWQuc3RhcnRzV2l0aCgneycpKSB7IC8vIGVzY2FwZSBvYmplY3QtZm9ybSBzdHJpbmdzLCBmb3IgbWF5YmUgaW1wbGVtZW50aW5nIGxhdGVyXG4gICAgICByZXR1cm4gYC0ke2lkfWA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBpZDsgLy8gb3RoZXIgc3RyaW5ncyBnbyB0aHJvdWdoIHVuY2hhbmdlZC5cbiAgICB9XG4gIH0gZWxzZSBpZiAoaWQgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiAnLSc7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGlkID09PSAnb2JqZWN0JyAmJiBpZCAhPT0gbnVsbCkge1xuICAgIHRocm93IG5ldyBFcnJvcignTWV0ZW9yIGRvZXMgbm90IGN1cnJlbnRseSBzdXBwb3J0IG9iamVjdHMgb3RoZXIgdGhhbiBPYmplY3RJRCBhcyBpZHMnKTtcbiAgfSBlbHNlIHsgLy8gTnVtYmVycywgdHJ1ZSwgZmFsc2UsIG51bGxcbiAgICByZXR1cm4gYH4ke0pTT04uc3RyaW5naWZ5KGlkKX1gO1xuICB9XG59O1xuXG5Nb25nb0lELmlkUGFyc2UgPSAoaWQpID0+IHtcbiAgaWYgKGlkID09PSAnJykge1xuICAgIHJldHVybiBpZDtcbiAgfSBlbHNlIGlmIChpZCA9PT0gJy0nKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfSBlbHNlIGlmIChpZC5zdGFydHNXaXRoKCctJykpIHtcbiAgICByZXR1cm4gaWQuc3Vic3RyKDEpO1xuICB9IGVsc2UgaWYgKGlkLnN0YXJ0c1dpdGgoJ34nKSkge1xuICAgIHJldHVybiBKU09OLnBhcnNlKGlkLnN1YnN0cigxKSk7XG4gIH0gZWxzZSBpZiAoTW9uZ29JRC5fbG9va3NMaWtlT2JqZWN0SUQoaWQpKSB7XG4gICAgcmV0dXJuIG5ldyBNb25nb0lELk9iamVjdElEKGlkKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gaWQ7XG4gIH1cbn07XG5cbmV4cG9ydCB7IE1vbmdvSUQgfTtcbiJdfQ==
