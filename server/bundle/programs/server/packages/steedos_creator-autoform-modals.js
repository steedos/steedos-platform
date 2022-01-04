(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var __coffeescriptShare, SteedosTable, CreatorTable, trs, label, thead, fieldValues, str, keyLength, addItemTr, defaultValue;

(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/steedos_creator-autoform-modals/lib/server/core.coffee                                                  //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
Package._define("steedos:creator-autoform-modals");

})();

//# sourceURL=meteor://💻app/packages/steedos_creator-autoform-modals.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jcmVhdG9yLWF1dG9mb3JtLW1vZGFscy9saWIvc2VydmVyL2NvcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvc2VydmVyL2NvcmUuY29mZmVlIl0sIm5hbWVzIjpbIk1ldGVvciIsIm1ldGhvZHMiLCJvcHRpb25zIiwiX2lkcyIsIl9vYmplY3RfbmFtZSIsImNvbGxlY3Rpb24iLCJvYmplY3QiLCJyZWYiLCJjaGVjayIsIk9iamVjdCIsIlN0cmluZyIsIkNyZWF0b3IiLCJnZXRPYmplY3QiLCJFcnJvciIsImRiIiwidXBkYXRlIiwiX2lkIiwiJGluIiwic3BsaXQiLCJtdWx0aSIsImlkIiwiaW5zZXJ0IiwiZmluZE9uZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQUEsT0FBT0MsT0FBUCxDQUNDO0FBQUEsd0JBQXNCLFVBQUNDLE9BQUQ7QUFDckIsUUFBQUMsSUFBQSxFQUFBQyxZQUFBLEVBQUFDLFVBQUEsRUFBQUMsTUFBQSxFQUFBQyxHQUFBOztBQUFBQyxVQUFNTixPQUFOLEVBQWVPLE1BQWY7QUFDQUYsVUFBd0JMLFFBQVEsTUFBUixDQUF4QixFQUFFQyxPQUFBSSxJQUFBSixJQUFGLEVBQVFDLGVBQUFHLElBQUFILFlBQVI7QUFDQUksVUFBTUwsSUFBTixFQUFZTyxNQUFaO0FBQ0FGLFVBQU1KLFlBQU4sRUFBb0JNLE1BQXBCO0FBRUEsV0FBT1IsUUFBUSxNQUFSLEVBQWdCQyxJQUF2QjtBQUNBLFdBQU9ELFFBQVEsTUFBUixFQUFnQkUsWUFBdkI7QUFDQUUsYUFBU0ssUUFBUUMsU0FBUixDQUFrQlIsWUFBbEIsQ0FBVDs7QUFDQSxTQUFPRSxNQUFQO0FBQ0MsWUFBTSxJQUFJTixPQUFPYSxLQUFYLENBQWlCLEdBQWpCLEVBQXNCLFNBQXRCLENBQU47QUFDQSxhQUFPLEtBQVA7QUNDRTs7QURBSFIsaUJBQWFDLE9BQU9RLEVBQXBCO0FBRUFULGVBQVdVLE1BQVgsQ0FBa0I7QUFDakJDLFdBQUs7QUFBQ0MsYUFBS2QsS0FBS2UsS0FBTCxDQUFXLEdBQVg7QUFBTjtBQURZLEtBQWxCLEVBRUdoQixPQUZILEVBRVk7QUFBQ2lCLGFBQU07QUFBUCxLQUZaO0FBR0EsV0FBTyxJQUFQO0FBakJEO0FBbUJBLGVBQWEsVUFBQ2pCLE9BQUQsRUFBVWtCLEVBQVY7QUFDWixRQUFBaEIsWUFBQSxFQUFBQyxVQUFBLEVBQUFDLE1BQUE7O0FBQUFGLG1CQUFlRixRQUFRLE1BQVIsRUFBZ0JFLFlBQS9CO0FBRUFJLFVBQU1OLE9BQU4sRUFBZU8sTUFBZjtBQUNBRCxVQUFNSixZQUFOLEVBQW9CTSxNQUFwQjtBQUNBLFdBQU9SLFFBQVEsTUFBUixFQUFnQkMsSUFBdkI7QUFDQSxXQUFPRCxRQUFRLE1BQVIsRUFBZ0JFLFlBQXZCO0FBQ0FFLGFBQVNLLFFBQVFDLFNBQVIsQ0FBa0JSLFlBQWxCLENBQVQ7O0FBQ0EsU0FBT0UsTUFBUDtBQUNDLFlBQU0sSUFBSU4sT0FBT2EsS0FBWCxDQUFpQixHQUFqQixFQUFzQixTQUF0QixDQUFOO0FBQ0EsYUFBTyxLQUFQO0FDS0U7O0FESkhSLGlCQUFhQyxPQUFPUSxFQUFwQjtBQUNBVCxlQUFXVSxNQUFYLENBQWtCO0FBQUNDLFdBQUtJO0FBQU4sS0FBbEIsRUFBNkJsQixPQUE3QjtBQUNBLFdBQU8sSUFBUDtBQWhDRDtBQWtDQSxlQUFhLFVBQUNBLE9BQUQ7QUFDWixRQUFBYyxHQUFBLEVBQUFaLFlBQUEsRUFBQUMsVUFBQSxFQUFBQyxNQUFBOztBQUFDRixtQkFBZ0JGLFFBQUFFLFlBQWhCO0FBQ0RJLFVBQU1OLE9BQU4sRUFBZU8sTUFBZjtBQUNBRCxVQUFNSixZQUFOLEVBQW9CTSxNQUFwQjtBQUNBLFdBQU9SLFFBQVFDLElBQWY7QUFDQSxXQUFPRCxRQUFRRSxZQUFmO0FBQ0FFLGFBQVNLLFFBQVFDLFNBQVIsQ0FBa0JSLFlBQWxCLENBQVQ7O0FBQ0EsU0FBT0UsTUFBUDtBQUNDLFlBQU0sSUFBSU4sT0FBT2EsS0FBWCxDQUFpQixHQUFqQixFQUFzQixTQUF0QixDQUFOO0FBQ0EsYUFBTyxLQUFQO0FDU0U7O0FEUkhSLGlCQUFhQyxPQUFPUSxFQUFwQjtBQUNBRSxVQUFNWCxXQUFXZ0IsTUFBWCxDQUFrQm5CLE9BQWxCLENBQU47QUFDQSxXQUFPRyxXQUFXaUIsT0FBWCxDQUFtQk4sR0FBbkIsQ0FBUDtBQTlDRDtBQUFBLENBREQsRSIsImZpbGUiOiIvcGFja2FnZXMvc3RlZWRvc19jcmVhdG9yLWF1dG9mb3JtLW1vZGFscy5qcyIsInNvdXJjZXNDb250ZW50IjpbIk1ldGVvci5tZXRob2RzXG5cdFwiYWZfbXVsdGlwbGVfdXBkYXRlXCI6IChvcHRpb25zKS0+XG5cdFx0Y2hlY2sgb3B0aW9ucywgT2JqZWN0XG5cdFx0eyBfaWRzLCBfb2JqZWN0X25hbWV9ID0gb3B0aW9uc1snJHNldCddXG5cdFx0Y2hlY2sgX2lkcywgU3RyaW5nXG5cdFx0Y2hlY2sgX29iamVjdF9uYW1lLCBTdHJpbmdcblxuXHRcdGRlbGV0ZSBvcHRpb25zWyckc2V0J10uX2lkc1xuXHRcdGRlbGV0ZSBvcHRpb25zWyckc2V0J10uX29iamVjdF9uYW1lXG5cdFx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QoX29iamVjdF9uYW1lKVxuXHRcdHVubGVzcyBvYmplY3Rcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBcIuacquaJvuWIsOaMh+WumuWvueixoVwiKVxuXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0Y29sbGVjdGlvbiA9IG9iamVjdC5kYlxuXHRcdCMgY29uc29sZS5sb2cgXCJhZl9tb2RhbF9tdWx0aXBsZV91cGRhdGUsb3B0aW9uczI6XCIsIG9wdGlvbnNcblx0XHRjb2xsZWN0aW9uLnVwZGF0ZSB7XG5cdFx0XHRfaWQ6IHskaW46IF9pZHMuc3BsaXQoXCIsXCIpfVxuXHRcdH0sIG9wdGlvbnMsIHttdWx0aTp0cnVlfVxuXHRcdHJldHVybiB0cnVlXG5cblx0XCJhZl91cGRhdGVcIjogKG9wdGlvbnMsIGlkKS0+XG5cdFx0X29iamVjdF9uYW1lID0gb3B0aW9uc1tcIiRzZXRcIl0uX29iamVjdF9uYW1lXG5cblx0XHRjaGVjayBvcHRpb25zLCBPYmplY3Rcblx0XHRjaGVjayBfb2JqZWN0X25hbWUsIFN0cmluZ1xuXHRcdGRlbGV0ZSBvcHRpb25zW1wiJHNldFwiXS5faWRzXG5cdFx0ZGVsZXRlIG9wdGlvbnNbXCIkc2V0XCJdLl9vYmplY3RfbmFtZVxuXHRcdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KF9vYmplY3RfbmFtZSlcblx0XHR1bmxlc3Mgb2JqZWN0XG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMywgXCLmnKrmib7liLDmjIflrprlr7nosaFcIilcblx0XHRcdHJldHVybiBmYWxzZVxuXHRcdGNvbGxlY3Rpb24gPSBvYmplY3QuZGJcblx0XHRjb2xsZWN0aW9uLnVwZGF0ZSB7X2lkOiBpZH0sIG9wdGlvbnNcblx0XHRyZXR1cm4gdHJ1ZVxuXG5cdFwiYWZfaW5zZXJ0XCI6IChvcHRpb25zKS0+XG5cdFx0e19vYmplY3RfbmFtZX0gPSBvcHRpb25zXG5cdFx0Y2hlY2sgb3B0aW9ucywgT2JqZWN0XG5cdFx0Y2hlY2sgX29iamVjdF9uYW1lLCBTdHJpbmdcblx0XHRkZWxldGUgb3B0aW9ucy5faWRzXG5cdFx0ZGVsZXRlIG9wdGlvbnMuX29iamVjdF9uYW1lXG5cdFx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QoX29iamVjdF9uYW1lKVxuXHRcdHVubGVzcyBvYmplY3Rcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBcIuacquaJvuWIsOaMh+WumuWvueixoVwiKVxuXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0Y29sbGVjdGlvbiA9IG9iamVjdC5kYlxuXHRcdF9pZCA9IGNvbGxlY3Rpb24uaW5zZXJ0IG9wdGlvbnNcblx0XHRyZXR1cm4gY29sbGVjdGlvbi5maW5kT25lKF9pZCkiLCJNZXRlb3IubWV0aG9kcyh7XG4gIFwiYWZfbXVsdGlwbGVfdXBkYXRlXCI6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICB2YXIgX2lkcywgX29iamVjdF9uYW1lLCBjb2xsZWN0aW9uLCBvYmplY3QsIHJlZjtcbiAgICBjaGVjayhvcHRpb25zLCBPYmplY3QpO1xuICAgIHJlZiA9IG9wdGlvbnNbJyRzZXQnXSwgX2lkcyA9IHJlZi5faWRzLCBfb2JqZWN0X25hbWUgPSByZWYuX29iamVjdF9uYW1lO1xuICAgIGNoZWNrKF9pZHMsIFN0cmluZyk7XG4gICAgY2hlY2soX29iamVjdF9uYW1lLCBTdHJpbmcpO1xuICAgIGRlbGV0ZSBvcHRpb25zWyckc2V0J10uX2lkcztcbiAgICBkZWxldGUgb3B0aW9uc1snJHNldCddLl9vYmplY3RfbmFtZTtcbiAgICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChfb2JqZWN0X25hbWUpO1xuICAgIGlmICghb2JqZWN0KSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMywgXCLmnKrmib7liLDmjIflrprlr7nosaFcIik7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGNvbGxlY3Rpb24gPSBvYmplY3QuZGI7XG4gICAgY29sbGVjdGlvbi51cGRhdGUoe1xuICAgICAgX2lkOiB7XG4gICAgICAgICRpbjogX2lkcy5zcGxpdChcIixcIilcbiAgICAgIH1cbiAgICB9LCBvcHRpb25zLCB7XG4gICAgICBtdWx0aTogdHJ1ZVxuICAgIH0pO1xuICAgIHJldHVybiB0cnVlO1xuICB9LFxuICBcImFmX3VwZGF0ZVwiOiBmdW5jdGlvbihvcHRpb25zLCBpZCkge1xuICAgIHZhciBfb2JqZWN0X25hbWUsIGNvbGxlY3Rpb24sIG9iamVjdDtcbiAgICBfb2JqZWN0X25hbWUgPSBvcHRpb25zW1wiJHNldFwiXS5fb2JqZWN0X25hbWU7XG4gICAgY2hlY2sob3B0aW9ucywgT2JqZWN0KTtcbiAgICBjaGVjayhfb2JqZWN0X25hbWUsIFN0cmluZyk7XG4gICAgZGVsZXRlIG9wdGlvbnNbXCIkc2V0XCJdLl9pZHM7XG4gICAgZGVsZXRlIG9wdGlvbnNbXCIkc2V0XCJdLl9vYmplY3RfbmFtZTtcbiAgICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChfb2JqZWN0X25hbWUpO1xuICAgIGlmICghb2JqZWN0KSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMywgXCLmnKrmib7liLDmjIflrprlr7nosaFcIik7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGNvbGxlY3Rpb24gPSBvYmplY3QuZGI7XG4gICAgY29sbGVjdGlvbi51cGRhdGUoe1xuICAgICAgX2lkOiBpZFxuICAgIH0sIG9wdGlvbnMpO1xuICAgIHJldHVybiB0cnVlO1xuICB9LFxuICBcImFmX2luc2VydFwiOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgdmFyIF9pZCwgX29iamVjdF9uYW1lLCBjb2xsZWN0aW9uLCBvYmplY3Q7XG4gICAgX29iamVjdF9uYW1lID0gb3B0aW9ucy5fb2JqZWN0X25hbWU7XG4gICAgY2hlY2sob3B0aW9ucywgT2JqZWN0KTtcbiAgICBjaGVjayhfb2JqZWN0X25hbWUsIFN0cmluZyk7XG4gICAgZGVsZXRlIG9wdGlvbnMuX2lkcztcbiAgICBkZWxldGUgb3B0aW9ucy5fb2JqZWN0X25hbWU7XG4gICAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QoX29iamVjdF9uYW1lKTtcbiAgICBpZiAoIW9iamVjdCkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwi5pyq5om+5Yiw5oyH5a6a5a+56LGhXCIpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjb2xsZWN0aW9uID0gb2JqZWN0LmRiO1xuICAgIF9pZCA9IGNvbGxlY3Rpb24uaW5zZXJ0KG9wdGlvbnMpO1xuICAgIHJldHVybiBjb2xsZWN0aW9uLmZpbmRPbmUoX2lkKTtcbiAgfVxufSk7XG4iXX0=
