(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var __coffeescriptShare;

(function(){

/////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                         //
// packages/steedos_autoform-modals/lib/server/core.coffee                                 //
//                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////
                                                                                           //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({
  "af_modal_multiple_update": function (options) {
    var collection, doc, object, object_name, target_ids;
    check(options, Object);
    target_ids = options.target_ids, doc = options.doc, object_name = options.object_name;
    check(target_ids, Array);
    check(doc, Object);
    check(object_name, String);
    object = Creator.getObject(object_name);

    if (!object) {
      throw new Meteor.Error(403, "未找到指定对象");
      return false;
    }

    collection = object.db;
    collection.update({
      _id: {
        $in: target_ids
      }
    }, doc, {
      multi: true
    });
    return true;
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
Package._define("steedos:autoform-modals");

})();

//# sourceURL=meteor://💻app/packages/steedos_autoform-modals.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hdXRvZm9ybS1tb2RhbHMvbGliL3NlcnZlci9jb3JlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL3NlcnZlci9jb3JlLmNvZmZlZSJdLCJuYW1lcyI6WyJNZXRlb3IiLCJtZXRob2RzIiwib3B0aW9ucyIsImNvbGxlY3Rpb24iLCJkb2MiLCJvYmplY3QiLCJvYmplY3RfbmFtZSIsInRhcmdldF9pZHMiLCJjaGVjayIsIk9iamVjdCIsIkFycmF5IiwiU3RyaW5nIiwiQ3JlYXRvciIsImdldE9iamVjdCIsIkVycm9yIiwiZGIiLCJ1cGRhdGUiLCJfaWQiLCIkaW4iLCJtdWx0aSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQUEsT0FBT0MsT0FBUCxDQUNDO0FBQUEsOEJBQTRCLFVBQUNDLE9BQUQ7QUFDM0IsUUFBQUMsVUFBQSxFQUFBQyxHQUFBLEVBQUFDLE1BQUEsRUFBQUMsV0FBQSxFQUFBQyxVQUFBO0FBQUFDLFVBQU1OLE9BQU4sRUFBZU8sTUFBZjtBQUNFRixpQkFBQUwsUUFBQUssVUFBQSxFQUFZSCxNQUFBRixRQUFBRSxHQUFaLEVBQWlCRSxjQUFBSixRQUFBSSxXQUFqQjtBQUNGRSxVQUFNRCxVQUFOLEVBQWtCRyxLQUFsQjtBQUNBRixVQUFNSixHQUFOLEVBQVdLLE1BQVg7QUFDQUQsVUFBTUYsV0FBTixFQUFtQkssTUFBbkI7QUFFQU4sYUFBU08sUUFBUUMsU0FBUixDQUFrQlAsV0FBbEIsQ0FBVDs7QUFDQSxTQUFPRCxNQUFQO0FBQ0MsWUFBTSxJQUFJTCxPQUFPYyxLQUFYLENBQWlCLEdBQWpCLEVBQXNCLFNBQXRCLENBQU47QUFDQSxhQUFPLEtBQVA7QUNDRTs7QURBSFgsaUJBQWFFLE9BQU9VLEVBQXBCO0FBQ0FaLGVBQVdhLE1BQVgsQ0FBa0I7QUFDakJDLFdBQUs7QUFBQ0MsYUFBS1g7QUFBTjtBQURZLEtBQWxCLEVBRUdILEdBRkgsRUFFUTtBQUFDZSxhQUFNO0FBQVAsS0FGUjtBQUdBLFdBQU8sSUFBUDtBQWZEO0FBQUEsQ0FERCxFIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX2F1dG9mb3JtLW1vZGFscy5qcyIsInNvdXJjZXNDb250ZW50IjpbIk1ldGVvci5tZXRob2RzXHJcblx0XCJhZl9tb2RhbF9tdWx0aXBsZV91cGRhdGVcIjogKG9wdGlvbnMpLT5cclxuXHRcdGNoZWNrIG9wdGlvbnMsIE9iamVjdFxyXG5cdFx0eyB0YXJnZXRfaWRzLCBkb2MsIG9iamVjdF9uYW1lfSA9IG9wdGlvbnNcclxuXHRcdGNoZWNrIHRhcmdldF9pZHMsIEFycmF5XHJcblx0XHRjaGVjayBkb2MsIE9iamVjdFxyXG5cdFx0Y2hlY2sgb2JqZWN0X25hbWUsIFN0cmluZ1xyXG5cclxuXHRcdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxyXG5cdFx0dW5sZXNzIG9iamVjdFxyXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMywgXCLmnKrmib7liLDmjIflrprlr7nosaFcIilcclxuXHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHRjb2xsZWN0aW9uID0gb2JqZWN0LmRiXHJcblx0XHRjb2xsZWN0aW9uLnVwZGF0ZSB7XHJcblx0XHRcdF9pZDogeyRpbjogdGFyZ2V0X2lkc31cclxuXHRcdH0sIGRvYywge211bHRpOnRydWV9XHJcblx0XHRyZXR1cm4gdHJ1ZTsiLCJNZXRlb3IubWV0aG9kcyh7XG4gIFwiYWZfbW9kYWxfbXVsdGlwbGVfdXBkYXRlXCI6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICB2YXIgY29sbGVjdGlvbiwgZG9jLCBvYmplY3QsIG9iamVjdF9uYW1lLCB0YXJnZXRfaWRzO1xuICAgIGNoZWNrKG9wdGlvbnMsIE9iamVjdCk7XG4gICAgdGFyZ2V0X2lkcyA9IG9wdGlvbnMudGFyZ2V0X2lkcywgZG9jID0gb3B0aW9ucy5kb2MsIG9iamVjdF9uYW1lID0gb3B0aW9ucy5vYmplY3RfbmFtZTtcbiAgICBjaGVjayh0YXJnZXRfaWRzLCBBcnJheSk7XG4gICAgY2hlY2soZG9jLCBPYmplY3QpO1xuICAgIGNoZWNrKG9iamVjdF9uYW1lLCBTdHJpbmcpO1xuICAgIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgICBpZiAoIW9iamVjdCkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwi5pyq5om+5Yiw5oyH5a6a5a+56LGhXCIpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjb2xsZWN0aW9uID0gb2JqZWN0LmRiO1xuICAgIGNvbGxlY3Rpb24udXBkYXRlKHtcbiAgICAgIF9pZDoge1xuICAgICAgICAkaW46IHRhcmdldF9pZHNcbiAgICAgIH1cbiAgICB9LCBkb2MsIHtcbiAgICAgIG11bHRpOiB0cnVlXG4gICAgfSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn0pO1xuIl19
