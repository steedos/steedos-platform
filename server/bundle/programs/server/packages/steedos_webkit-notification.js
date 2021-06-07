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
var Selector = Package['steedos:base'].Selector;
var Steedos = Package['steedos:base'].Steedos;
var AjaxCollection = Package['steedos:base'].AjaxCollection;
var SteedosDataManager = Package['steedos:base'].SteedosDataManager;
var SteedosOffice = Package['steedos:base'].SteedosOffice;
var billingManager = Package['steedos:base'].billingManager;
var Promise = Package.promise.Promise;
var meteorInstall = Package.modules.meteorInstall;

/* Package-scope variables */
var __coffeescriptShare;

var require = meteorInstall({"node_modules":{"meteor":{"steedos:webkit-notification":{"server":{"models":{"raix_push_notifications.coffee":function module(){

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

}},"methods":{"calculate_box.coffee":function module(){

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc193ZWJraXQtbm90aWZpY2F0aW9uL3NlcnZlci9tb2RlbHMvcmFpeF9wdXNoX25vdGlmaWNhdGlvbnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbW9kZWxzL3JhaXhfcHVzaF9ub3RpZmljYXRpb25zLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc193ZWJraXQtbm90aWZpY2F0aW9uL3NlcnZlci9tZXRob2RzL2NhbGN1bGF0ZV9ib3guY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9jYWxjdWxhdGVfYm94LmNvZmZlZSJdLCJuYW1lcyI6WyJkYiIsInJhaXhfcHVzaF9ub3RpZmljYXRpb25zIiwiUHVzaCIsIm5vdGlmaWNhdGlvbnMiLCJNZXRlb3IiLCJpc1NlcnZlciIsInB1Ymxpc2giLCJxdWVyeSIsInVzZXJJZCIsInJlYWR5IiwiJHJlZ2V4IiwiY3JlYXRlZEF0IiwiJGd0IiwiRGF0ZSIsImZpbmQiLCJmaWVsZHMiLCJiYWRnZSIsImZyb20iLCJ0aXRsZSIsInRleHQiLCJwYXlsb2FkIiwic29ydCIsImxpbWl0IiwibWV0aG9kcyIsImNhbGN1bGF0ZUJveCIsImluc3RhbmNlSWQiLCJib3giLCJjY191c2VycyIsImluYm94X3VzZXJzIiwiaW5zdGFuY2UiLCJjaGVjayIsIlN0cmluZyIsImluc3RhbmNlcyIsImZpbmRPbmUiLCJfaWQiLCJfIiwiaW5kZXhPZiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFHQUEsR0FBR0MsdUJBQUgsR0FBNkJDLEtBQUtDLGFBQWxDOztBQUVBLElBQUdDLE9BQU9DLFFBQVY7QUFDSUQsU0FBT0UsT0FBUCxDQUFlLHlCQUFmLEVBQTBDO0FBRXRDLFFBQUFDLEtBQUE7O0FBQUEsU0FBTyxLQUFLQyxNQUFaO0FBQ0ksYUFBTyxLQUFLQyxLQUFMLEVBQVA7QUNGUDs7QURNR0YsWUFBUTtBQUFDQSxhQUFPO0FBQUNHLGdCQUFPLG1CQUFtQixLQUFLRixNQUF4QixHQUFpQztBQUF6QyxPQUFSO0FBQXdERyxpQkFBVTtBQUFDQyxhQUFLLElBQUlDLElBQUo7QUFBTjtBQUFsRSxLQUFSO0FBRUEsV0FBT2IsR0FBR0MsdUJBQUgsQ0FBMkJhLElBQTNCLENBQWdDUCxLQUFoQyxFQUF1QztBQUFDUSxjQUFRO0FBQUNDLGVBQU0sQ0FBUDtBQUFVQyxjQUFLLENBQWY7QUFBa0JDLGVBQU8sQ0FBekI7QUFBNEJDLGNBQUssQ0FBakM7QUFBb0NDLGlCQUFRO0FBQTVDLE9BQVQ7QUFBeURDLFlBQUs7QUFBQ1YsbUJBQVUsQ0FBQztBQUFaLE9BQTlEO0FBQTZFVyxhQUFNO0FBQW5GLEtBQXZDLENBQVA7QUFUSjtBQ3dCSCxDOzs7Ozs7Ozs7Ozs7QUM5QkRsQixPQUFPbUIsT0FBUCxDQUNDO0FBQUFDLGdCQUFjLFVBQUNDLFVBQUQ7QUFDYixRQUFBQyxHQUFBLEVBQUFDLFFBQUEsRUFBQUMsV0FBQSxFQUFBQyxRQUFBLEVBQUFyQixNQUFBO0FBQUFzQixVQUFNTCxVQUFOLEVBQWtCTSxNQUFsQjtBQUNBdkIsYUFBUyxLQUFLQSxNQUFkO0FBQ0FxQixlQUFXN0IsR0FBR2dDLFNBQUgsQ0FBYUMsT0FBYixDQUFxQjtBQUFDQyxXQUFLVDtBQUFOLEtBQXJCLEVBQXVDO0FBQUNWLGNBQVE7QUFBQ2EscUJBQWEsQ0FBZDtBQUFpQkQsa0JBQVU7QUFBM0I7QUFBVCxLQUF2QyxDQUFYO0FBQ0FDLGtCQUFjQyxTQUFTRCxXQUF2QjtBQUNBRCxlQUFXRSxTQUFTRixRQUFwQjtBQUVBRCxVQUFNLEVBQU47O0FBRUEsUUFBR1MsRUFBRUMsT0FBRixDQUFVUixXQUFWLEVBQXVCcEIsTUFBdkIsS0FBa0MsQ0FBbEMsSUFBdUMyQixFQUFFQyxPQUFGLENBQVVULFFBQVYsRUFBb0JuQixNQUFwQixLQUErQixDQUF6RTtBQUNDa0IsWUFBTSxPQUFOO0FBREQ7QUFHQ0EsWUFBTSxRQUFOO0FDT0U7O0FETEgsV0FBT0EsR0FBUDtBQWREO0FBQUEsQ0FERCxFIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX3dlYmtpdC1ub3RpZmljYXRpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbiMgZGIucmFpeF9wdXNoX25vdGlmaWNhdGlvbnMgPSBuZXcgTW9uZ28uQ29sbGVjdGlvbignX3JhaXhfcHVzaF9ub3RpZmljYXRpb25zJyk7XG5cbmRiLnJhaXhfcHVzaF9ub3RpZmljYXRpb25zID0gUHVzaC5ub3RpZmljYXRpb25zXG5cbmlmIE1ldGVvci5pc1NlcnZlclxuICAgIE1ldGVvci5wdWJsaXNoICdyYWl4X3B1c2hfbm90aWZpY2F0aW9ucycsIC0+XG5cbiAgICAgICAgdW5sZXNzIHRoaXMudXNlcklkXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZWFkeSgpXG5cbiAgICAgICAgIyBhcHBOYW1lID0gXCJ3b3JrZmxvd1wiXG4gICAgICAgIFxuICAgICAgICBxdWVyeSA9IHtxdWVyeTogeyRyZWdleDpcIntcXFwidXNlcklkXFxcIjpcXFwiXCIgKyB0aGlzLnVzZXJJZCArIFwiXFxcIixcIn0sY3JlYXRlZEF0OnskZ3Q6IG5ldyBEYXRlKCl9fVxuXG4gICAgICAgIHJldHVybiBkYi5yYWl4X3B1c2hfbm90aWZpY2F0aW9ucy5maW5kKHF1ZXJ5LCB7ZmllbGRzOiB7YmFkZ2U6MSwgZnJvbToxLCB0aXRsZTogMSwgdGV4dDoxLCBwYXlsb2FkOjF9LCBzb3J0OntjcmVhdGVkQXQ6LTF9LGxpbWl0OjV9KSIsImRiLnJhaXhfcHVzaF9ub3RpZmljYXRpb25zID0gUHVzaC5ub3RpZmljYXRpb25zO1xuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIE1ldGVvci5wdWJsaXNoKCdyYWl4X3B1c2hfbm90aWZpY2F0aW9ucycsIGZ1bmN0aW9uKCkge1xuICAgIHZhciBxdWVyeTtcbiAgICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICAgIH1cbiAgICBxdWVyeSA9IHtcbiAgICAgIHF1ZXJ5OiB7XG4gICAgICAgICRyZWdleDogXCJ7XFxcInVzZXJJZFxcXCI6XFxcIlwiICsgdGhpcy51c2VySWQgKyBcIlxcXCIsXCJcbiAgICAgIH0sXG4gICAgICBjcmVhdGVkQXQ6IHtcbiAgICAgICAgJGd0OiBuZXcgRGF0ZSgpXG4gICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gZGIucmFpeF9wdXNoX25vdGlmaWNhdGlvbnMuZmluZChxdWVyeSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIGJhZGdlOiAxLFxuICAgICAgICBmcm9tOiAxLFxuICAgICAgICB0aXRsZTogMSxcbiAgICAgICAgdGV4dDogMSxcbiAgICAgICAgcGF5bG9hZDogMVxuICAgICAgfSxcbiAgICAgIHNvcnQ6IHtcbiAgICAgICAgY3JlYXRlZEF0OiAtMVxuICAgICAgfSxcbiAgICAgIGxpbWl0OiA1XG4gICAgfSk7XG4gIH0pO1xufVxuIiwiTWV0ZW9yLm1ldGhvZHNcblx0Y2FsY3VsYXRlQm94OiAoaW5zdGFuY2VJZCkgLT5cblx0XHRjaGVjayBpbnN0YW5jZUlkLCBTdHJpbmdcblx0XHR1c2VySWQgPSB0aGlzLnVzZXJJZFxuXHRcdGluc3RhbmNlID0gZGIuaW5zdGFuY2VzLmZpbmRPbmUoe19pZDogaW5zdGFuY2VJZH0se2ZpZWxkczoge2luYm94X3VzZXJzOiAxLCBjY191c2VyczogMX19KVxuXHRcdGluYm94X3VzZXJzID0gaW5zdGFuY2UuaW5ib3hfdXNlcnNcblx0XHRjY191c2VycyA9IGluc3RhbmNlLmNjX3VzZXJzXG5cblx0XHRib3ggPSBcIlwiXG5cblx0XHRpZiBfLmluZGV4T2YoaW5ib3hfdXNlcnMsIHVzZXJJZCkgPj0gMCB8fCBfLmluZGV4T2YoY2NfdXNlcnMsIHVzZXJJZCkgPj0gMFxuXHRcdFx0Ym94ID0gXCJpbmJveFwiXG5cdFx0ZWxzZVxuXHRcdFx0Ym94ID0gXCJvdXRib3hcIlxuXG5cdFx0cmV0dXJuIGJveCIsIk1ldGVvci5tZXRob2RzKHtcbiAgY2FsY3VsYXRlQm94OiBmdW5jdGlvbihpbnN0YW5jZUlkKSB7XG4gICAgdmFyIGJveCwgY2NfdXNlcnMsIGluYm94X3VzZXJzLCBpbnN0YW5jZSwgdXNlcklkO1xuICAgIGNoZWNrKGluc3RhbmNlSWQsIFN0cmluZyk7XG4gICAgdXNlcklkID0gdGhpcy51c2VySWQ7XG4gICAgaW5zdGFuY2UgPSBkYi5pbnN0YW5jZXMuZmluZE9uZSh7XG4gICAgICBfaWQ6IGluc3RhbmNlSWRcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgaW5ib3hfdXNlcnM6IDEsXG4gICAgICAgIGNjX3VzZXJzOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgaW5ib3hfdXNlcnMgPSBpbnN0YW5jZS5pbmJveF91c2VycztcbiAgICBjY191c2VycyA9IGluc3RhbmNlLmNjX3VzZXJzO1xuICAgIGJveCA9IFwiXCI7XG4gICAgaWYgKF8uaW5kZXhPZihpbmJveF91c2VycywgdXNlcklkKSA+PSAwIHx8IF8uaW5kZXhPZihjY191c2VycywgdXNlcklkKSA+PSAwKSB7XG4gICAgICBib3ggPSBcImluYm94XCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGJveCA9IFwib3V0Ym94XCI7XG4gICAgfVxuICAgIHJldHVybiBib3g7XG4gIH1cbn0pO1xuIl19
