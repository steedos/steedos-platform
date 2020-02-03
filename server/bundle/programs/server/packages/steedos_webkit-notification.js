(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var Push = Package['raix:push'].Push;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var ECMAScript = Package.ecmascript.ECMAScript;
var SubsManager = Package['meteorhacks:subs-manager'].SubsManager;
var ServerSession = Package['steedos:base'].ServerSession;
var Selector = Package['steedos:base'].Selector;
var Steedos = Package['steedos:base'].Steedos;
var AjaxCollection = Package['steedos:base'].AjaxCollection;
var SteedosDataManager = Package['steedos:base'].SteedosDataManager;
var SteedosOffice = Package['steedos:base'].SteedosOffice;
var billingManager = Package['steedos:base'].billingManager;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var meteorInstall = Package.modules.meteorInstall;

/* Package-scope variables */
var __coffeescriptShare;

var require = meteorInstall({"node_modules":{"meteor":{"steedos:webkit-notification":{"server":{"models":{"raix_push_notifications.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////
//                                                                                 //
// packages/steedos_webkit-notification/server/models/raix_push_notifications.coff //
//                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////
                                                                                   //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
db.raix_push_notifications = Push.notifications;

if (Meteor.isServer) {
  Meteor.publish('raix_push_notifications', function () {
    var query;

    if (!this.userId) {
      return this.ready();
    }

    query = {
      query: {
        $regex: "{\"userId\":\"" + this.userId + "\","
      },
      createdAt: {
        $gt: new Date()
      }
    };
    return db.raix_push_notifications.find(query, {
      fields: {
        badge: 1,
        from: 1,
        title: 1,
        text: 1,
        payload: 1
      },
      sort: {
        createdAt: -1
      },
      limit: 5
    });
  });
}
/////////////////////////////////////////////////////////////////////////////////////

}},"methods":{"calculate_box.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////
//                                                                                 //
// packages/steedos_webkit-notification/server/methods/calculate_box.coffee        //
//                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////
                                                                                   //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({
  calculateBox: function (instanceId) {
    var box, cc_users, inbox_users, instance, userId;
    check(instanceId, String);
    userId = this.userId;
    instance = db.instances.findOne({
      _id: instanceId
    }, {
      fields: {
        inbox_users: 1,
        cc_users: 1
      }
    });
    inbox_users = instance.inbox_users;
    cc_users = instance.cc_users;
    box = "";

    if (_.indexOf(inbox_users, userId) >= 0 || _.indexOf(cc_users, userId) >= 0) {
      box = "inbox";
    } else {
      box = "outbox";
    }

    return box;
  }
});
/////////////////////////////////////////////////////////////////////////////////////

}}}}}}},{
  "extensions": [
    ".js",
    ".json",
    ".coffee"
  ]
});

require("/node_modules/meteor/steedos:webkit-notification/server/models/raix_push_notifications.coffee");
require("/node_modules/meteor/steedos:webkit-notification/server/methods/calculate_box.coffee");

/* Exports */
Package._define("steedos:webkit-notification");

})();

//# sourceURL=meteor://💻app/packages/steedos_webkit-notification.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc193ZWJraXQtbm90aWZpY2F0aW9uL3NlcnZlci9tb2RlbHMvcmFpeF9wdXNoX25vdGlmaWNhdGlvbnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbW9kZWxzL3JhaXhfcHVzaF9ub3RpZmljYXRpb25zLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc193ZWJraXQtbm90aWZpY2F0aW9uL3NlcnZlci9tZXRob2RzL2NhbGN1bGF0ZV9ib3guY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9jYWxjdWxhdGVfYm94LmNvZmZlZSJdLCJuYW1lcyI6WyJkYiIsInJhaXhfcHVzaF9ub3RpZmljYXRpb25zIiwiUHVzaCIsIm5vdGlmaWNhdGlvbnMiLCJNZXRlb3IiLCJpc1NlcnZlciIsInB1Ymxpc2giLCJxdWVyeSIsInVzZXJJZCIsInJlYWR5IiwiJHJlZ2V4IiwiY3JlYXRlZEF0IiwiJGd0IiwiRGF0ZSIsImZpbmQiLCJmaWVsZHMiLCJiYWRnZSIsImZyb20iLCJ0aXRsZSIsInRleHQiLCJwYXlsb2FkIiwic29ydCIsImxpbWl0IiwibWV0aG9kcyIsImNhbGN1bGF0ZUJveCIsImluc3RhbmNlSWQiLCJib3giLCJjY191c2VycyIsImluYm94X3VzZXJzIiwiaW5zdGFuY2UiLCJjaGVjayIsIlN0cmluZyIsImluc3RhbmNlcyIsImZpbmRPbmUiLCJfaWQiLCJfIiwiaW5kZXhPZiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUdBQSxHQUFHQyx1QkFBSCxHQUE2QkMsS0FBS0MsYUFBbEM7O0FBRUEsSUFBR0MsT0FBT0MsUUFBVjtBQUNJRCxTQUFPRSxPQUFQLENBQWUseUJBQWYsRUFBMEM7QUFFdEMsUUFBQUMsS0FBQTs7QUFBQSxTQUFPLEtBQUtDLE1BQVo7QUFDSSxhQUFPLEtBQUtDLEtBQUwsRUFBUDtBQ0ZQOztBRE1HRixZQUFRO0FBQUNBLGFBQU87QUFBQ0csZ0JBQU8sbUJBQW1CLEtBQUtGLE1BQXhCLEdBQWlDO0FBQXpDLE9BQVI7QUFBd0RHLGlCQUFVO0FBQUNDLGFBQUssSUFBSUMsSUFBSjtBQUFOO0FBQWxFLEtBQVI7QUFFQSxXQUFPYixHQUFHQyx1QkFBSCxDQUEyQmEsSUFBM0IsQ0FBZ0NQLEtBQWhDLEVBQXVDO0FBQUNRLGNBQVE7QUFBQ0MsZUFBTSxDQUFQO0FBQVVDLGNBQUssQ0FBZjtBQUFrQkMsZUFBTyxDQUF6QjtBQUE0QkMsY0FBSyxDQUFqQztBQUFvQ0MsaUJBQVE7QUFBNUMsT0FBVDtBQUF5REMsWUFBSztBQUFDVixtQkFBVSxDQUFDO0FBQVosT0FBOUQ7QUFBNkVXLGFBQU07QUFBbkYsS0FBdkMsQ0FBUDtBQVRKO0FDd0JILEM7Ozs7Ozs7Ozs7OztBQzlCRGxCLE9BQU9tQixPQUFQLENBQ0M7QUFBQUMsZ0JBQWMsVUFBQ0MsVUFBRDtBQUNiLFFBQUFDLEdBQUEsRUFBQUMsUUFBQSxFQUFBQyxXQUFBLEVBQUFDLFFBQUEsRUFBQXJCLE1BQUE7QUFBQXNCLFVBQU1MLFVBQU4sRUFBa0JNLE1BQWxCO0FBQ0F2QixhQUFTLEtBQUtBLE1BQWQ7QUFDQXFCLGVBQVc3QixHQUFHZ0MsU0FBSCxDQUFhQyxPQUFiLENBQXFCO0FBQUNDLFdBQUtUO0FBQU4sS0FBckIsRUFBdUM7QUFBQ1YsY0FBUTtBQUFDYSxxQkFBYSxDQUFkO0FBQWlCRCxrQkFBVTtBQUEzQjtBQUFULEtBQXZDLENBQVg7QUFDQUMsa0JBQWNDLFNBQVNELFdBQXZCO0FBQ0FELGVBQVdFLFNBQVNGLFFBQXBCO0FBRUFELFVBQU0sRUFBTjs7QUFFQSxRQUFHUyxFQUFFQyxPQUFGLENBQVVSLFdBQVYsRUFBdUJwQixNQUF2QixLQUFrQyxDQUFsQyxJQUF1QzJCLEVBQUVDLE9BQUYsQ0FBVVQsUUFBVixFQUFvQm5CLE1BQXBCLEtBQStCLENBQXpFO0FBQ0NrQixZQUFNLE9BQU47QUFERDtBQUdDQSxZQUFNLFFBQU47QUNPRTs7QURMSCxXQUFPQSxHQUFQO0FBZEQ7QUFBQSxDQURELEUiLCJmaWxlIjoiL3BhY2thZ2VzL3N0ZWVkb3Nfd2Via2l0LW5vdGlmaWNhdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG4jIGRiLnJhaXhfcHVzaF9ub3RpZmljYXRpb25zID0gbmV3IE1vbmdvLkNvbGxlY3Rpb24oJ19yYWl4X3B1c2hfbm90aWZpY2F0aW9ucycpO1xyXG5cclxuZGIucmFpeF9wdXNoX25vdGlmaWNhdGlvbnMgPSBQdXNoLm5vdGlmaWNhdGlvbnNcclxuXHJcbmlmIE1ldGVvci5pc1NlcnZlclxyXG4gICAgTWV0ZW9yLnB1Ymxpc2ggJ3JhaXhfcHVzaF9ub3RpZmljYXRpb25zJywgLT5cclxuXHJcbiAgICAgICAgdW5sZXNzIHRoaXMudXNlcklkXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlYWR5KClcclxuXHJcbiAgICAgICAgIyBhcHBOYW1lID0gXCJ3b3JrZmxvd1wiXHJcbiAgICAgICAgXHJcbiAgICAgICAgcXVlcnkgPSB7cXVlcnk6IHskcmVnZXg6XCJ7XFxcInVzZXJJZFxcXCI6XFxcIlwiICsgdGhpcy51c2VySWQgKyBcIlxcXCIsXCJ9LGNyZWF0ZWRBdDp7JGd0OiBuZXcgRGF0ZSgpfX1cclxuXHJcbiAgICAgICAgcmV0dXJuIGRiLnJhaXhfcHVzaF9ub3RpZmljYXRpb25zLmZpbmQocXVlcnksIHtmaWVsZHM6IHtiYWRnZToxLCBmcm9tOjEsIHRpdGxlOiAxLCB0ZXh0OjEsIHBheWxvYWQ6MX0sIHNvcnQ6e2NyZWF0ZWRBdDotMX0sbGltaXQ6NX0pIiwiZGIucmFpeF9wdXNoX25vdGlmaWNhdGlvbnMgPSBQdXNoLm5vdGlmaWNhdGlvbnM7XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgTWV0ZW9yLnB1Ymxpc2goJ3JhaXhfcHVzaF9ub3RpZmljYXRpb25zJywgZnVuY3Rpb24oKSB7XG4gICAgdmFyIHF1ZXJ5O1xuICAgIGlmICghdGhpcy51c2VySWQpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gICAgfVxuICAgIHF1ZXJ5ID0ge1xuICAgICAgcXVlcnk6IHtcbiAgICAgICAgJHJlZ2V4OiBcIntcXFwidXNlcklkXFxcIjpcXFwiXCIgKyB0aGlzLnVzZXJJZCArIFwiXFxcIixcIlxuICAgICAgfSxcbiAgICAgIGNyZWF0ZWRBdDoge1xuICAgICAgICAkZ3Q6IG5ldyBEYXRlKClcbiAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBkYi5yYWl4X3B1c2hfbm90aWZpY2F0aW9ucy5maW5kKHF1ZXJ5LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgYmFkZ2U6IDEsXG4gICAgICAgIGZyb206IDEsXG4gICAgICAgIHRpdGxlOiAxLFxuICAgICAgICB0ZXh0OiAxLFxuICAgICAgICBwYXlsb2FkOiAxXG4gICAgICB9LFxuICAgICAgc29ydDoge1xuICAgICAgICBjcmVhdGVkQXQ6IC0xXG4gICAgICB9LFxuICAgICAgbGltaXQ6IDVcbiAgICB9KTtcbiAgfSk7XG59XG4iLCJNZXRlb3IubWV0aG9kc1xyXG5cdGNhbGN1bGF0ZUJveDogKGluc3RhbmNlSWQpIC0+XHJcblx0XHRjaGVjayBpbnN0YW5jZUlkLCBTdHJpbmdcclxuXHRcdHVzZXJJZCA9IHRoaXMudXNlcklkXHJcblx0XHRpbnN0YW5jZSA9IGRiLmluc3RhbmNlcy5maW5kT25lKHtfaWQ6IGluc3RhbmNlSWR9LHtmaWVsZHM6IHtpbmJveF91c2VyczogMSwgY2NfdXNlcnM6IDF9fSlcclxuXHRcdGluYm94X3VzZXJzID0gaW5zdGFuY2UuaW5ib3hfdXNlcnNcclxuXHRcdGNjX3VzZXJzID0gaW5zdGFuY2UuY2NfdXNlcnNcclxuXHJcblx0XHRib3ggPSBcIlwiXHJcblxyXG5cdFx0aWYgXy5pbmRleE9mKGluYm94X3VzZXJzLCB1c2VySWQpID49IDAgfHwgXy5pbmRleE9mKGNjX3VzZXJzLCB1c2VySWQpID49IDBcclxuXHRcdFx0Ym94ID0gXCJpbmJveFwiXHJcblx0XHRlbHNlXHJcblx0XHRcdGJveCA9IFwib3V0Ym94XCJcclxuXHJcblx0XHRyZXR1cm4gYm94IiwiTWV0ZW9yLm1ldGhvZHMoe1xuICBjYWxjdWxhdGVCb3g6IGZ1bmN0aW9uKGluc3RhbmNlSWQpIHtcbiAgICB2YXIgYm94LCBjY191c2VycywgaW5ib3hfdXNlcnMsIGluc3RhbmNlLCB1c2VySWQ7XG4gICAgY2hlY2soaW5zdGFuY2VJZCwgU3RyaW5nKTtcbiAgICB1c2VySWQgPSB0aGlzLnVzZXJJZDtcbiAgICBpbnN0YW5jZSA9IGRiLmluc3RhbmNlcy5maW5kT25lKHtcbiAgICAgIF9pZDogaW5zdGFuY2VJZFxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBpbmJveF91c2VyczogMSxcbiAgICAgICAgY2NfdXNlcnM6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpbmJveF91c2VycyA9IGluc3RhbmNlLmluYm94X3VzZXJzO1xuICAgIGNjX3VzZXJzID0gaW5zdGFuY2UuY2NfdXNlcnM7XG4gICAgYm94ID0gXCJcIjtcbiAgICBpZiAoXy5pbmRleE9mKGluYm94X3VzZXJzLCB1c2VySWQpID49IDAgfHwgXy5pbmRleE9mKGNjX3VzZXJzLCB1c2VySWQpID49IDApIHtcbiAgICAgIGJveCA9IFwiaW5ib3hcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgYm94ID0gXCJvdXRib3hcIjtcbiAgICB9XG4gICAgcmV0dXJuIGJveDtcbiAgfVxufSk7XG4iXX0=
