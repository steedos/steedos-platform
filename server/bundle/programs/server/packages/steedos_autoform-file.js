(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var check = Package.check.check;
var Match = Package.check.Match;
var _ = Package.underscore._;
var ReactiveVar = Package['reactive-var'].ReactiveVar;
var _i18n = Package['universe:i18n']._i18n;
var i18n = Package['universe:i18n'].i18n;
var Promise = Package.promise.Promise;
var SimpleSchema = Package['aldeed:simple-schema'].SimpleSchema;
var MongoObject = Package['aldeed:simple-schema'].MongoObject;
var FS = Package['steedos:cfs-base-package'].FS;

/* Package-scope variables */
var __coffeescriptShare;

(function(){

////////////////////////////////////////////////////////////////////////////
//                                                                        //
// packages/steedos_autoform-file/lib/server/publish.coffee               //
//                                                                        //
////////////////////////////////////////////////////////////////////////////
                                                                          //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.publish('autoformFileDoc', function (collectionName, docId) {
  var collection;
  check(collectionName, String);
  check(docId, String);
  collection = FS._collections[collectionName] || global[collectionName];

  if (collection) {
    return collection.find({
      _id: docId
    });
  }
});
////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
Package._define("steedos:autoform-file");

})();

//# sourceURL=meteor://💻app/packages/steedos_autoform-file.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hdXRvZm9ybS1maWxlL2xpYi9zZXJ2ZXIvcHVibGlzaC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9zZXJ2ZXIvcHVibGlzaC5jb2ZmZWUiXSwibmFtZXMiOlsiTWV0ZW9yIiwicHVibGlzaCIsImNvbGxlY3Rpb25OYW1lIiwiZG9jSWQiLCJjb2xsZWN0aW9uIiwiY2hlY2siLCJTdHJpbmciLCJGUyIsIl9jb2xsZWN0aW9ucyIsImdsb2JhbCIsImZpbmQiLCJfaWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUFBLE9BQU9DLE9BQVAsQ0FBZSxpQkFBZixFQUFrQyxVQUFDQyxjQUFELEVBQWlCQyxLQUFqQjtBQUNoQyxNQUFBQyxVQUFBO0FBQUFDLFFBQU1ILGNBQU4sRUFBc0JJLE1BQXRCO0FBQ0FELFFBQU1GLEtBQU4sRUFBYUcsTUFBYjtBQUVBRixlQUFhRyxHQUFHQyxZQUFILENBQWdCTixjQUFoQixLQUFtQ08sT0FBT1AsY0FBUCxDQUFoRDs7QUFDQSxNQUFHRSxVQUFIO0FDQ0UsV0RBQUEsV0FBV00sSUFBWCxDQUNFO0FBQUFDLFdBQUtSO0FBQUwsS0FERixDQ0FBO0FBR0Q7QURUSCxHIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX2F1dG9mb3JtLWZpbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJNZXRlb3IucHVibGlzaCAnYXV0b2Zvcm1GaWxlRG9jJywgKGNvbGxlY3Rpb25OYW1lLCBkb2NJZCkgLT5cbiAgY2hlY2sgY29sbGVjdGlvbk5hbWUsIFN0cmluZ1xuICBjaGVjayBkb2NJZCwgU3RyaW5nXG5cbiAgY29sbGVjdGlvbiA9IEZTLl9jb2xsZWN0aW9uc1tjb2xsZWN0aW9uTmFtZV0gb3IgZ2xvYmFsW2NvbGxlY3Rpb25OYW1lXVxuICBpZiBjb2xsZWN0aW9uXG4gICAgY29sbGVjdGlvbi5maW5kXG4gICAgICBfaWQ6IGRvY0lkXG4iLCJNZXRlb3IucHVibGlzaCgnYXV0b2Zvcm1GaWxlRG9jJywgZnVuY3Rpb24oY29sbGVjdGlvbk5hbWUsIGRvY0lkKSB7XG4gIHZhciBjb2xsZWN0aW9uO1xuICBjaGVjayhjb2xsZWN0aW9uTmFtZSwgU3RyaW5nKTtcbiAgY2hlY2soZG9jSWQsIFN0cmluZyk7XG4gIGNvbGxlY3Rpb24gPSBGUy5fY29sbGVjdGlvbnNbY29sbGVjdGlvbk5hbWVdIHx8IGdsb2JhbFtjb2xsZWN0aW9uTmFtZV07XG4gIGlmIChjb2xsZWN0aW9uKSB7XG4gICAgcmV0dXJuIGNvbGxlY3Rpb24uZmluZCh7XG4gICAgICBfaWQ6IGRvY0lkXG4gICAgfSk7XG4gIH1cbn0pO1xuIl19
