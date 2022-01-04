(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var check = Package.check.check;
var Match = Package.check.Match;
var meteorInstall = Package.modules.meteorInstall;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var ValidationError;

var require = meteorInstall({"node_modules":{"meteor":{"mdg:validation-error":{"validation-error.js":function module(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/mdg_validation-error/validation-error.js                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// The "details" property of the ValidationError must be an array of objects
// containing at least two properties. The "name" and "type" properties are
// required.
const errorsPattern = [Match.ObjectIncluding({
  name: String,
  type: String
})];
ValidationError = class extends Meteor.Error {
  constructor(errors) {
    let message = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ValidationError.DEFAULT_MESSAGE;
    check(errors, errorsPattern);
    check(message, String);
    return super(ValidationError.ERROR_CODE, message, errors);
  } // Static method checking if a given Meteor.Error is an instance of
  // ValidationError.


  static is(err) {
    return err instanceof Meteor.Error && err.error === ValidationError.ERROR_CODE;
  }

}; // Universal validation error code to be use in applications and packages.

ValidationError.ERROR_CODE = 'validation-error'; // Default validation error message that can be changed globally.

ValidationError.DEFAULT_MESSAGE = 'Validation failed';
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

require("/node_modules/meteor/mdg:validation-error/validation-error.js");

/* Exports */
Package._define("mdg:validation-error", {
  ValidationError: ValidationError
});

})();

//# sourceURL=meteor://💻app/packages/mdg_validation-error.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvbWRnOnZhbGlkYXRpb24tZXJyb3IvdmFsaWRhdGlvbi1lcnJvci5qcyJdLCJuYW1lcyI6WyJlcnJvcnNQYXR0ZXJuIiwiTWF0Y2giLCJPYmplY3RJbmNsdWRpbmciLCJuYW1lIiwiU3RyaW5nIiwidHlwZSIsIlZhbGlkYXRpb25FcnJvciIsIk1ldGVvciIsIkVycm9yIiwiY29uc3RydWN0b3IiLCJlcnJvcnMiLCJtZXNzYWdlIiwiREVGQVVMVF9NRVNTQUdFIiwiY2hlY2siLCJFUlJPUl9DT0RFIiwiaXMiLCJlcnIiLCJlcnJvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQSxNQUFNQSxhQUFhLEdBQUcsQ0FBQ0MsS0FBSyxDQUFDQyxlQUFOLENBQXNCO0FBQzNDQyxNQUFJLEVBQUVDLE1BRHFDO0FBRTNDQyxNQUFJLEVBQUVEO0FBRnFDLENBQXRCLENBQUQsQ0FBdEI7QUFLQUUsZUFBZSxHQUFHLGNBQWNDLE1BQU0sQ0FBQ0MsS0FBckIsQ0FBMkI7QUFDM0NDLGFBQVcsQ0FBQ0MsTUFBRCxFQUFvRDtBQUFBLFFBQTNDQyxPQUEyQyx1RUFBakNMLGVBQWUsQ0FBQ00sZUFBaUI7QUFDN0RDLFNBQUssQ0FBQ0gsTUFBRCxFQUFTVixhQUFULENBQUw7QUFDQWEsU0FBSyxDQUFDRixPQUFELEVBQVVQLE1BQVYsQ0FBTDtBQUVBLFdBQU8sTUFBTUUsZUFBZSxDQUFDUSxVQUF0QixFQUFrQ0gsT0FBbEMsRUFBMkNELE1BQTNDLENBQVA7QUFDRCxHQU4wQyxDQVEzQztBQUNBOzs7QUFDQSxTQUFPSyxFQUFQLENBQVVDLEdBQVYsRUFBZTtBQUNiLFdBQU9BLEdBQUcsWUFBWVQsTUFBTSxDQUFDQyxLQUF0QixJQUErQlEsR0FBRyxDQUFDQyxLQUFKLEtBQWNYLGVBQWUsQ0FBQ1EsVUFBcEU7QUFDRDs7QUFaMEMsQ0FBN0MsQyxDQWVBOztBQUNBUixlQUFlLENBQUNRLFVBQWhCLEdBQTZCLGtCQUE3QixDLENBQ0E7O0FBQ0FSLGVBQWUsQ0FBQ00sZUFBaEIsR0FBa0MsbUJBQWxDLEMiLCJmaWxlIjoiL3BhY2thZ2VzL21kZ192YWxpZGF0aW9uLWVycm9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gVGhlIFwiZGV0YWlsc1wiIHByb3BlcnR5IG9mIHRoZSBWYWxpZGF0aW9uRXJyb3IgbXVzdCBiZSBhbiBhcnJheSBvZiBvYmplY3RzXG4vLyBjb250YWluaW5nIGF0IGxlYXN0IHR3byBwcm9wZXJ0aWVzLiBUaGUgXCJuYW1lXCIgYW5kIFwidHlwZVwiIHByb3BlcnRpZXMgYXJlXG4vLyByZXF1aXJlZC5cbmNvbnN0IGVycm9yc1BhdHRlcm4gPSBbTWF0Y2guT2JqZWN0SW5jbHVkaW5nKHtcbiAgbmFtZTogU3RyaW5nLFxuICB0eXBlOiBTdHJpbmdcbn0pXTtcblxuVmFsaWRhdGlvbkVycm9yID0gY2xhc3MgZXh0ZW5kcyBNZXRlb3IuRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihlcnJvcnMsIG1lc3NhZ2UgPSBWYWxpZGF0aW9uRXJyb3IuREVGQVVMVF9NRVNTQUdFKSB7XG4gICAgY2hlY2soZXJyb3JzLCBlcnJvcnNQYXR0ZXJuKTtcbiAgICBjaGVjayhtZXNzYWdlLCBTdHJpbmcpO1xuXG4gICAgcmV0dXJuIHN1cGVyKFZhbGlkYXRpb25FcnJvci5FUlJPUl9DT0RFLCBtZXNzYWdlLCBlcnJvcnMpO1xuICB9XG5cbiAgLy8gU3RhdGljIG1ldGhvZCBjaGVja2luZyBpZiBhIGdpdmVuIE1ldGVvci5FcnJvciBpcyBhbiBpbnN0YW5jZSBvZlxuICAvLyBWYWxpZGF0aW9uRXJyb3IuXG4gIHN0YXRpYyBpcyhlcnIpIHtcbiAgICByZXR1cm4gZXJyIGluc3RhbmNlb2YgTWV0ZW9yLkVycm9yICYmIGVyci5lcnJvciA9PT0gVmFsaWRhdGlvbkVycm9yLkVSUk9SX0NPREU7XG4gIH07XG59O1xuXG4vLyBVbml2ZXJzYWwgdmFsaWRhdGlvbiBlcnJvciBjb2RlIHRvIGJlIHVzZSBpbiBhcHBsaWNhdGlvbnMgYW5kIHBhY2thZ2VzLlxuVmFsaWRhdGlvbkVycm9yLkVSUk9SX0NPREUgPSAndmFsaWRhdGlvbi1lcnJvcic7XG4vLyBEZWZhdWx0IHZhbGlkYXRpb24gZXJyb3IgbWVzc2FnZSB0aGF0IGNhbiBiZSBjaGFuZ2VkIGdsb2JhbGx5LlxuVmFsaWRhdGlvbkVycm9yLkRFRkFVTFRfTUVTU0FHRSA9ICdWYWxpZGF0aW9uIGZhaWxlZCc7XG4iXX0=
