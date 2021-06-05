(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var __coffeescriptShare;

(function(){

///////////////////////////////////////////////////////////////////////////////
//                                                                           //
// packages/steedos_creator-autoform-modals/lib/server/core.coffee           //
//                                                                           //
///////////////////////////////////////////////////////////////////////////////
                                                                             //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({
  "af_multiple_update": function (options) {
    var _ids, _object_name, collection, object, ref;

    check(options, Object);
    ref = options['$set'], _ids = ref._ids, _object_name = ref._object_name;
    check(_ids, String);
    check(_object_name, String);
    delete options['$set']._ids;
    delete options['$set']._object_name;
    object = Creator.getObject(_object_name);

    if (!object) {
      throw new Meteor.Error(403, "未找到指定对象");
      return false;
    }

    collection = object.db;
    collection.update({
      _id: {
        $in: _ids.split(",")
      }
    }, options, {
      multi: true
    });
    return true;
  },
  "af_update": function (options, id) {
    var _object_name, collection, object;

    _object_name = options["$set"]._object_name;
    check(options, Object);
    check(_object_name, String);
    delete options["$set"]._ids;
    delete options["$set"]._object_name;
    object = Creator.getObject(_object_name);

    if (!object) {
      throw new Meteor.Error(403, "未找到指定对象");
      return false;
    }

    collection = object.db;
    collection.update({
      _id: id
    }, options);
    return true;
  },
  "af_insert": function (options) {
    var _id, _object_name, collection, object;

    _object_name = options._object_name;
    check(options, Object);
    check(_object_name, String);
    delete options._ids;
    delete options._object_name;
    object = Creator.getObject(_object_name);

    if (!object) {
      throw new Meteor.Error(403, "未找到指定对象");
      return false;
    }

    collection = object.db;
    _id = collection.insert(options);
    return collection.findOne(_id);
  }
});
///////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
Package._define("steedos:creator-autoform-modals");

})();

//# sourceURL=meteor://💻app/packages/steedos_creator-autoform-modals.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jcmVhdG9yLWF1dG9mb3JtLW1vZGFscy9saWIvc2VydmVyL2NvcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvc2VydmVyL2NvcmUuY29mZmVlIl0sIm5hbWVzIjpbIk1ldGVvciIsIm1ldGhvZHMiLCJvcHRpb25zIiwiX2lkcyIsIl9vYmplY3RfbmFtZSIsImNvbGxlY3Rpb24iLCJvYmplY3QiLCJyZWYiLCJjaGVjayIsIk9iamVjdCIsIlN0cmluZyIsIkNyZWF0b3IiLCJnZXRPYmplY3QiLCJFcnJvciIsImRiIiwidXBkYXRlIiwiX2lkIiwiJGluIiwic3BsaXQiLCJtdWx0aSIsImlkIiwiaW5zZXJ0IiwiZmluZE9uZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQUEsT0FBT0MsT0FBUCxDQUNDO0FBQUEsd0JBQXNCLFVBQUNDLE9BQUQ7QUFDckIsUUFBQUMsSUFBQSxFQUFBQyxZQUFBLEVBQUFDLFVBQUEsRUFBQUMsTUFBQSxFQUFBQyxHQUFBOztBQUFBQyxVQUFNTixPQUFOLEVBQWVPLE1BQWY7QUFDQUYsVUFBd0JMLFFBQVEsTUFBUixDQUF4QixFQUFFQyxPQUFBSSxJQUFBSixJQUFGLEVBQVFDLGVBQUFHLElBQUFILFlBQVI7QUFDQUksVUFBTUwsSUFBTixFQUFZTyxNQUFaO0FBQ0FGLFVBQU1KLFlBQU4sRUFBb0JNLE1BQXBCO0FBRUEsV0FBT1IsUUFBUSxNQUFSLEVBQWdCQyxJQUF2QjtBQUNBLFdBQU9ELFFBQVEsTUFBUixFQUFnQkUsWUFBdkI7QUFDQUUsYUFBU0ssUUFBUUMsU0FBUixDQUFrQlIsWUFBbEIsQ0FBVDs7QUFDQSxTQUFPRSxNQUFQO0FBQ0MsWUFBTSxJQUFJTixPQUFPYSxLQUFYLENBQWlCLEdBQWpCLEVBQXNCLFNBQXRCLENBQU47QUFDQSxhQUFPLEtBQVA7QUNDRTs7QURBSFIsaUJBQWFDLE9BQU9RLEVBQXBCO0FBRUFULGVBQVdVLE1BQVgsQ0FBa0I7QUFDakJDLFdBQUs7QUFBQ0MsYUFBS2QsS0FBS2UsS0FBTCxDQUFXLEdBQVg7QUFBTjtBQURZLEtBQWxCLEVBRUdoQixPQUZILEVBRVk7QUFBQ2lCLGFBQU07QUFBUCxLQUZaO0FBR0EsV0FBTyxJQUFQO0FBakJEO0FBbUJBLGVBQWEsVUFBQ2pCLE9BQUQsRUFBVWtCLEVBQVY7QUFDWixRQUFBaEIsWUFBQSxFQUFBQyxVQUFBLEVBQUFDLE1BQUE7O0FBQUFGLG1CQUFlRixRQUFRLE1BQVIsRUFBZ0JFLFlBQS9CO0FBRUFJLFVBQU1OLE9BQU4sRUFBZU8sTUFBZjtBQUNBRCxVQUFNSixZQUFOLEVBQW9CTSxNQUFwQjtBQUNBLFdBQU9SLFFBQVEsTUFBUixFQUFnQkMsSUFBdkI7QUFDQSxXQUFPRCxRQUFRLE1BQVIsRUFBZ0JFLFlBQXZCO0FBQ0FFLGFBQVNLLFFBQVFDLFNBQVIsQ0FBa0JSLFlBQWxCLENBQVQ7O0FBQ0EsU0FBT0UsTUFBUDtBQUNDLFlBQU0sSUFBSU4sT0FBT2EsS0FBWCxDQUFpQixHQUFqQixFQUFzQixTQUF0QixDQUFOO0FBQ0EsYUFBTyxLQUFQO0FDS0U7O0FESkhSLGlCQUFhQyxPQUFPUSxFQUFwQjtBQUNBVCxlQUFXVSxNQUFYLENBQWtCO0FBQUNDLFdBQUtJO0FBQU4sS0FBbEIsRUFBNkJsQixPQUE3QjtBQUNBLFdBQU8sSUFBUDtBQWhDRDtBQWtDQSxlQUFhLFVBQUNBLE9BQUQ7QUFDWixRQUFBYyxHQUFBLEVBQUFaLFlBQUEsRUFBQUMsVUFBQSxFQUFBQyxNQUFBOztBQUFDRixtQkFBZ0JGLFFBQUFFLFlBQWhCO0FBQ0RJLFVBQU1OLE9BQU4sRUFBZU8sTUFBZjtBQUNBRCxVQUFNSixZQUFOLEVBQW9CTSxNQUFwQjtBQUNBLFdBQU9SLFFBQVFDLElBQWY7QUFDQSxXQUFPRCxRQUFRRSxZQUFmO0FBQ0FFLGFBQVNLLFFBQVFDLFNBQVIsQ0FBa0JSLFlBQWxCLENBQVQ7O0FBQ0EsU0FBT0UsTUFBUDtBQUNDLFlBQU0sSUFBSU4sT0FBT2EsS0FBWCxDQUFpQixHQUFqQixFQUFzQixTQUF0QixDQUFOO0FBQ0EsYUFBTyxLQUFQO0FDU0U7O0FEUkhSLGlCQUFhQyxPQUFPUSxFQUFwQjtBQUNBRSxVQUFNWCxXQUFXZ0IsTUFBWCxDQUFrQm5CLE9BQWxCLENBQU47QUFDQSxXQUFPRyxXQUFXaUIsT0FBWCxDQUFtQk4sR0FBbkIsQ0FBUDtBQTlDRDtBQUFBLENBREQsRSIsImZpbGUiOiIvcGFja2FnZXMvc3RlZWRvc19jcmVhdG9yLWF1dG9mb3JtLW1vZGFscy5qcyIsInNvdXJjZXNDb250ZW50IjpbIk1ldGVvci5tZXRob2RzXHJcblx0XCJhZl9tdWx0aXBsZV91cGRhdGVcIjogKG9wdGlvbnMpLT5cclxuXHRcdGNoZWNrIG9wdGlvbnMsIE9iamVjdFxyXG5cdFx0eyBfaWRzLCBfb2JqZWN0X25hbWV9ID0gb3B0aW9uc1snJHNldCddXHJcblx0XHRjaGVjayBfaWRzLCBTdHJpbmdcclxuXHRcdGNoZWNrIF9vYmplY3RfbmFtZSwgU3RyaW5nXHJcblxyXG5cdFx0ZGVsZXRlIG9wdGlvbnNbJyRzZXQnXS5faWRzXHJcblx0XHRkZWxldGUgb3B0aW9uc1snJHNldCddLl9vYmplY3RfbmFtZVxyXG5cdFx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QoX29iamVjdF9uYW1lKVxyXG5cdFx0dW5sZXNzIG9iamVjdFxyXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMywgXCLmnKrmib7liLDmjIflrprlr7nosaFcIilcclxuXHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHRjb2xsZWN0aW9uID0gb2JqZWN0LmRiXHJcblx0XHQjIGNvbnNvbGUubG9nIFwiYWZfbW9kYWxfbXVsdGlwbGVfdXBkYXRlLG9wdGlvbnMyOlwiLCBvcHRpb25zXHJcblx0XHRjb2xsZWN0aW9uLnVwZGF0ZSB7XHJcblx0XHRcdF9pZDogeyRpbjogX2lkcy5zcGxpdChcIixcIil9XHJcblx0XHR9LCBvcHRpb25zLCB7bXVsdGk6dHJ1ZX1cclxuXHRcdHJldHVybiB0cnVlXHJcblxyXG5cdFwiYWZfdXBkYXRlXCI6IChvcHRpb25zLCBpZCktPlxyXG5cdFx0X29iamVjdF9uYW1lID0gb3B0aW9uc1tcIiRzZXRcIl0uX29iamVjdF9uYW1lXHJcblxyXG5cdFx0Y2hlY2sgb3B0aW9ucywgT2JqZWN0XHJcblx0XHRjaGVjayBfb2JqZWN0X25hbWUsIFN0cmluZ1xyXG5cdFx0ZGVsZXRlIG9wdGlvbnNbXCIkc2V0XCJdLl9pZHNcclxuXHRcdGRlbGV0ZSBvcHRpb25zW1wiJHNldFwiXS5fb2JqZWN0X25hbWVcclxuXHRcdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KF9vYmplY3RfbmFtZSlcclxuXHRcdHVubGVzcyBvYmplY3RcclxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwi5pyq5om+5Yiw5oyH5a6a5a+56LGhXCIpXHJcblx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0Y29sbGVjdGlvbiA9IG9iamVjdC5kYlxyXG5cdFx0Y29sbGVjdGlvbi51cGRhdGUge19pZDogaWR9LCBvcHRpb25zXHJcblx0XHRyZXR1cm4gdHJ1ZVxyXG5cclxuXHRcImFmX2luc2VydFwiOiAob3B0aW9ucyktPlxyXG5cdFx0e19vYmplY3RfbmFtZX0gPSBvcHRpb25zXHJcblx0XHRjaGVjayBvcHRpb25zLCBPYmplY3RcclxuXHRcdGNoZWNrIF9vYmplY3RfbmFtZSwgU3RyaW5nXHJcblx0XHRkZWxldGUgb3B0aW9ucy5faWRzXHJcblx0XHRkZWxldGUgb3B0aW9ucy5fb2JqZWN0X25hbWVcclxuXHRcdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KF9vYmplY3RfbmFtZSlcclxuXHRcdHVubGVzcyBvYmplY3RcclxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwi5pyq5om+5Yiw5oyH5a6a5a+56LGhXCIpXHJcblx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0Y29sbGVjdGlvbiA9IG9iamVjdC5kYlxyXG5cdFx0X2lkID0gY29sbGVjdGlvbi5pbnNlcnQgb3B0aW9uc1xyXG5cdFx0cmV0dXJuIGNvbGxlY3Rpb24uZmluZE9uZShfaWQpIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICBcImFmX211bHRpcGxlX3VwZGF0ZVwiOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgdmFyIF9pZHMsIF9vYmplY3RfbmFtZSwgY29sbGVjdGlvbiwgb2JqZWN0LCByZWY7XG4gICAgY2hlY2sob3B0aW9ucywgT2JqZWN0KTtcbiAgICByZWYgPSBvcHRpb25zWyckc2V0J10sIF9pZHMgPSByZWYuX2lkcywgX29iamVjdF9uYW1lID0gcmVmLl9vYmplY3RfbmFtZTtcbiAgICBjaGVjayhfaWRzLCBTdHJpbmcpO1xuICAgIGNoZWNrKF9vYmplY3RfbmFtZSwgU3RyaW5nKTtcbiAgICBkZWxldGUgb3B0aW9uc1snJHNldCddLl9pZHM7XG4gICAgZGVsZXRlIG9wdGlvbnNbJyRzZXQnXS5fb2JqZWN0X25hbWU7XG4gICAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QoX29iamVjdF9uYW1lKTtcbiAgICBpZiAoIW9iamVjdCkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwi5pyq5om+5Yiw5oyH5a6a5a+56LGhXCIpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjb2xsZWN0aW9uID0gb2JqZWN0LmRiO1xuICAgIGNvbGxlY3Rpb24udXBkYXRlKHtcbiAgICAgIF9pZDoge1xuICAgICAgICAkaW46IF9pZHMuc3BsaXQoXCIsXCIpXG4gICAgICB9XG4gICAgfSwgb3B0aW9ucywge1xuICAgICAgbXVsdGk6IHRydWVcbiAgICB9KTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcbiAgXCJhZl91cGRhdGVcIjogZnVuY3Rpb24ob3B0aW9ucywgaWQpIHtcbiAgICB2YXIgX29iamVjdF9uYW1lLCBjb2xsZWN0aW9uLCBvYmplY3Q7XG4gICAgX29iamVjdF9uYW1lID0gb3B0aW9uc1tcIiRzZXRcIl0uX29iamVjdF9uYW1lO1xuICAgIGNoZWNrKG9wdGlvbnMsIE9iamVjdCk7XG4gICAgY2hlY2soX29iamVjdF9uYW1lLCBTdHJpbmcpO1xuICAgIGRlbGV0ZSBvcHRpb25zW1wiJHNldFwiXS5faWRzO1xuICAgIGRlbGV0ZSBvcHRpb25zW1wiJHNldFwiXS5fb2JqZWN0X25hbWU7XG4gICAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QoX29iamVjdF9uYW1lKTtcbiAgICBpZiAoIW9iamVjdCkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwi5pyq5om+5Yiw5oyH5a6a5a+56LGhXCIpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjb2xsZWN0aW9uID0gb2JqZWN0LmRiO1xuICAgIGNvbGxlY3Rpb24udXBkYXRlKHtcbiAgICAgIF9pZDogaWRcbiAgICB9LCBvcHRpb25zKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcbiAgXCJhZl9pbnNlcnRcIjogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIHZhciBfaWQsIF9vYmplY3RfbmFtZSwgY29sbGVjdGlvbiwgb2JqZWN0O1xuICAgIF9vYmplY3RfbmFtZSA9IG9wdGlvbnMuX29iamVjdF9uYW1lO1xuICAgIGNoZWNrKG9wdGlvbnMsIE9iamVjdCk7XG4gICAgY2hlY2soX29iamVjdF9uYW1lLCBTdHJpbmcpO1xuICAgIGRlbGV0ZSBvcHRpb25zLl9pZHM7XG4gICAgZGVsZXRlIG9wdGlvbnMuX29iamVjdF9uYW1lO1xuICAgIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KF9vYmplY3RfbmFtZSk7XG4gICAgaWYgKCFvYmplY3QpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBcIuacquaJvuWIsOaMh+WumuWvueixoVwiKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY29sbGVjdGlvbiA9IG9iamVjdC5kYjtcbiAgICBfaWQgPSBjb2xsZWN0aW9uLmluc2VydChvcHRpb25zKTtcbiAgICByZXR1cm4gY29sbGVjdGlvbi5maW5kT25lKF9pZCk7XG4gIH1cbn0pO1xuIl19
