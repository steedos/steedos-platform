(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ReactiveVar = Package['reactive-var'].ReactiveVar;
var ReactiveDict = Package['reactive-dict'].ReactiveDict;
var Random = Package.random.Random;
var DDP = Package['ddp-client'].DDP;
var DDPServer = Package['ddp-server'].DDPServer;
var check = Package.check.check;
var Match = Package.check.Match;
var DDPRateLimiter = Package['ddp-rate-limiter'].DDPRateLimiter;
var _ = Package.underscore._;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var ECMAScript = Package.ecmascript.ECMAScript;
var SimpleSchema = Package['aldeed:simple-schema'].SimpleSchema;
var MongoObject = Package['aldeed:simple-schema'].MongoObject;
var _i18n = Package['universe:i18n']._i18n;
var i18n = Package['universe:i18n'].i18n;
var Promise = Package.promise.Promise;
var meteorInstall = Package.modules.meteorInstall;
var FS = Package['steedos:cfs-base-package'].FS;

/* Package-scope variables */
var __coffeescriptShare;

var require = meteorInstall({"node_modules":{"meteor":{"steedos:objects-billing":{"models":{"billings.coffee":function module(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// packages/steedos_objects-billing/models/billings.coffee             //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
db.billings = new Meteor.Collection('billings');
db.billings.helpers({
  transaction_i18n: function () {
    var d, t;
    t = this.transaction;
    d = "";

    if (t === "Starting balance") {
      d = TAPi18n.__('billing_tranDetail.starting');
    } else if (t === "Payment") {
      d = TAPi18n.__('billing_tranDetail.payment');
    } else if (t === "Service adjustment") {
      d = TAPi18n.__('billing_tranDetail.adjustment');
    } else if (t === "workflow") {
      d = TAPi18n.__('billing_tranDetail.workflow');
    } else if (t === "workflow.professional") {
      d = TAPi18n.__('billing_tranDetail.workflow');
    } else if (t === "chat.professional") {
      d = TAPi18n.__('billing_tranDetail.chat');
    } else {
      d = t;
    }

    return d;
  }
});

if (Meteor.isServer) {
  db.billings._ensureIndex({
    "space": 1
  }, {
    background: true
  });
}
/////////////////////////////////////////////////////////////////////////

},"billing_pay_records.coffee":function module(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// packages/steedos_objects-billing/models/billing_pay_records.coffee  //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
db.billing_pay_records = new Meteor.Collection('billing_pay_records');
db.billing_pay_records.helpers({
  order_created: function () {
    return moment(this.created).format('YYYY-MM-DD HH:mm:ss');
  },
  order_paid: function () {
    if (this.paid) {
      return TAPi18n.__("billing.has_paid");
    } else {
      return TAPi18n.__("billing.not_paid");
    }
  },
  order_total_fee: function () {
    return (this.total_fee / 100).toString();
  }
});
/////////////////////////////////////////////////////////////////////////

},"modules.coffee":function module(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// packages/steedos_objects-billing/models/modules.coffee              //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
db.modules = new Meteor.Collection('modules');
/////////////////////////////////////////////////////////////////////////

},"modules_changelogs.coffee":function module(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// packages/steedos_objects-billing/models/modules_changelogs.coffee   //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
db.modules_changelogs = new Meteor.Collection('modules_changelogs');
/////////////////////////////////////////////////////////////////////////

},"users_changelogs.coffee":function module(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// packages/steedos_objects-billing/models/users_changelogs.coffee     //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
db.users_changelogs = new Meteor.Collection('users_changelogs');
db.users_changelogs._simpleSchema = new SimpleSchema({
  change_date: {
    type: Date
  },
  operator: {
    type: String
  },
  space: {
    type: String
  },
  operation: {
    type: String
  },
  user: {
    type: String
  },
  user_count: {
    type: Number
  },
  created: {
    type: Date
  },
  created_by: {
    type: String
  }
});

if (Meteor.isServer) {
  db.users_changelogs.before.insert(function (userId, doc) {
    doc.change_date = moment().format('YYYYMMDD');
    doc.created = new Date();
    return doc.created_by = userId;
  });
}
/////////////////////////////////////////////////////////////////////////

},"steedos_statistics.coffee":function module(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// packages/steedos_objects-billing/models/steedos_statistics.coffee   //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
db.steedos_statistics = new Meteor.Collection('steedos_statistics');
/////////////////////////////////////////////////////////////////////////

}}}}}},{
  "extensions": [
    ".js",
    ".json",
    ".coffee"
  ]
});

require("/node_modules/meteor/steedos:objects-billing/models/billings.coffee");
require("/node_modules/meteor/steedos:objects-billing/models/billing_pay_records.coffee");
require("/node_modules/meteor/steedos:objects-billing/models/modules.coffee");
require("/node_modules/meteor/steedos:objects-billing/models/modules_changelogs.coffee");
require("/node_modules/meteor/steedos:objects-billing/models/users_changelogs.coffee");
require("/node_modules/meteor/steedos:objects-billing/models/steedos_statistics.coffee");

/* Exports */
Package._define("steedos:objects-billing");

})();

//# sourceURL=meteor://💻app/packages/steedos_objects-billing.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzLWJpbGxpbmcvbW9kZWxzL2JpbGxpbmdzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbW9kZWxzL2JpbGxpbmdzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzLWJpbGxpbmcvbW9kZWxzL2JpbGxpbmdfcGF5X3JlY29yZHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9tb2RlbHMvYmlsbGluZ19wYXlfcmVjb3Jkcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy1iaWxsaW5nL21vZGVscy9tb2R1bGVzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzLWJpbGxpbmcvbW9kZWxzL21vZHVsZXNfY2hhbmdlbG9ncy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy1iaWxsaW5nL21vZGVscy91c2Vyc19jaGFuZ2Vsb2dzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbW9kZWxzL3VzZXJzX2NoYW5nZWxvZ3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMtYmlsbGluZy9tb2RlbHMvc3RlZWRvc19zdGF0aXN0aWNzLmNvZmZlZSJdLCJuYW1lcyI6WyJkYiIsImJpbGxpbmdzIiwiTWV0ZW9yIiwiQ29sbGVjdGlvbiIsImhlbHBlcnMiLCJ0cmFuc2FjdGlvbl9pMThuIiwiZCIsInQiLCJ0cmFuc2FjdGlvbiIsIlRBUGkxOG4iLCJfXyIsImlzU2VydmVyIiwiX2Vuc3VyZUluZGV4IiwiYmFja2dyb3VuZCIsImJpbGxpbmdfcGF5X3JlY29yZHMiLCJvcmRlcl9jcmVhdGVkIiwibW9tZW50IiwiY3JlYXRlZCIsImZvcm1hdCIsIm9yZGVyX3BhaWQiLCJwYWlkIiwib3JkZXJfdG90YWxfZmVlIiwidG90YWxfZmVlIiwidG9TdHJpbmciLCJtb2R1bGVzIiwibW9kdWxlc19jaGFuZ2Vsb2dzIiwidXNlcnNfY2hhbmdlbG9ncyIsIl9zaW1wbGVTY2hlbWEiLCJTaW1wbGVTY2hlbWEiLCJjaGFuZ2VfZGF0ZSIsInR5cGUiLCJEYXRlIiwib3BlcmF0b3IiLCJTdHJpbmciLCJzcGFjZSIsIm9wZXJhdGlvbiIsInVzZXIiLCJ1c2VyX2NvdW50IiwiTnVtYmVyIiwiY3JlYXRlZF9ieSIsImJlZm9yZSIsImluc2VydCIsInVzZXJJZCIsImRvYyIsInN0ZWVkb3Nfc3RhdGlzdGljcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQUEsR0FBR0MsUUFBSCxHQUFjLElBQUlDLE9BQU9DLFVBQVgsQ0FBc0IsVUFBdEIsQ0FBZDtBQUdBSCxHQUFHQyxRQUFILENBQVlHLE9BQVosQ0FDQztBQUFBQyxvQkFBa0I7QUFDakIsUUFBQUMsQ0FBQSxFQUFBQyxDQUFBO0FBQUFBLFFBQUksS0FBS0MsV0FBVDtBQUNBRixRQUFJLEVBQUo7O0FBQ0EsUUFBR0MsTUFBSyxrQkFBUjtBQUNDRCxVQUFJRyxRQUFRQyxFQUFSLENBQVcsNkJBQVgsQ0FBSjtBQURELFdBRUssSUFBR0gsTUFBSyxTQUFSO0FBQ0pELFVBQUlHLFFBQVFDLEVBQVIsQ0FBVyw0QkFBWCxDQUFKO0FBREksV0FFQSxJQUFHSCxNQUFLLG9CQUFSO0FBQ0pELFVBQUlHLFFBQVFDLEVBQVIsQ0FBVywrQkFBWCxDQUFKO0FBREksV0FFQSxJQUFHSCxNQUFLLFVBQVI7QUFDSkQsVUFBSUcsUUFBUUMsRUFBUixDQUFXLDZCQUFYLENBQUo7QUFESSxXQUVBLElBQUdILE1BQUssdUJBQVI7QUFDSkQsVUFBSUcsUUFBUUMsRUFBUixDQUFXLDZCQUFYLENBQUo7QUFESSxXQUVBLElBQUdILE1BQUssbUJBQVI7QUFDSkQsVUFBSUcsUUFBUUMsRUFBUixDQUFXLHlCQUFYLENBQUo7QUFESTtBQUdKSixVQUFJQyxDQUFKO0FDQ0U7O0FEQ0gsV0FBT0QsQ0FBUDtBQWxCRDtBQUFBLENBREQ7O0FBcUJBLElBQUdKLE9BQU9TLFFBQVY7QUFDQ1gsS0FBR0MsUUFBSCxDQUFZVyxZQUFaLENBQXlCO0FBQ3hCLGFBQVM7QUFEZSxHQUF6QixFQUVFO0FBQUNDLGdCQUFZO0FBQWIsR0FGRjtBQ09BLEM7Ozs7Ozs7Ozs7OztBQ2hDRGIsR0FBR2MsbUJBQUgsR0FBeUIsSUFBSVosT0FBT0MsVUFBWCxDQUFzQixxQkFBdEIsQ0FBekI7QUFFQUgsR0FBR2MsbUJBQUgsQ0FBdUJWLE9BQXZCLENBQ0M7QUFBQVcsaUJBQWU7QUFDZCxXQUFPQyxPQUFPLEtBQUtDLE9BQVosRUFBcUJDLE1BQXJCLENBQTRCLHFCQUE1QixDQUFQO0FBREQ7QUFHQUMsY0FBWTtBQUNKLFFBQUcsS0FBS0MsSUFBUjtBQ0NILGFERHFCWCxRQUFRQyxFQUFSLENBQVcsa0JBQVgsQ0NDckI7QURERztBQ0dILGFESHlERCxRQUFRQyxFQUFSLENBQVcsa0JBQVgsQ0NHekQ7QUFDRDtBRFJKO0FBTUFXLG1CQUFpQjtBQUNoQixXQUFPLENBQUMsS0FBS0MsU0FBTCxHQUFlLEdBQWhCLEVBQXFCQyxRQUFyQixFQUFQO0FBUEQ7QUFBQSxDQURELEU7Ozs7Ozs7Ozs7OztBRUZBdkIsR0FBR3dCLE9BQUgsR0FBYSxJQUFJdEIsT0FBT0MsVUFBWCxDQUFzQixTQUF0QixDQUFiLEM7Ozs7Ozs7Ozs7OztBQ0FBSCxHQUFHeUIsa0JBQUgsR0FBd0IsSUFBSXZCLE9BQU9DLFVBQVgsQ0FBc0Isb0JBQXRCLENBQXhCLEM7Ozs7Ozs7Ozs7OztBQ0FBSCxHQUFHMEIsZ0JBQUgsR0FBc0IsSUFBSXhCLE9BQU9DLFVBQVgsQ0FBc0Isa0JBQXRCLENBQXRCO0FBRUFILEdBQUcwQixnQkFBSCxDQUFvQkMsYUFBcEIsR0FBb0MsSUFBSUMsWUFBSixDQUVsQztBQUFBQyxlQUNFO0FBQUFDLFVBQU1DO0FBQU4sR0FERjtBQUdBQyxZQUNFO0FBQUFGLFVBQU1HO0FBQU4sR0FKRjtBQU1BQyxTQUNFO0FBQUFKLFVBQU1HO0FBQU4sR0FQRjtBQVNBRSxhQUNFO0FBQUFMLFVBQU1HO0FBQU4sR0FWRjtBQVlBRyxRQUNFO0FBQUFOLFVBQU1HO0FBQU4sR0FiRjtBQWVBSSxjQUNFO0FBQUFQLFVBQU1RO0FBQU4sR0FoQkY7QUFrQkFyQixXQUNFO0FBQUFhLFVBQU1DO0FBQU4sR0FuQkY7QUFxQkFRLGNBQ0U7QUFBQVQsVUFBTUc7QUFBTjtBQXRCRixDQUZrQyxDQUFwQzs7QUEyQkEsSUFBRy9CLE9BQU9TLFFBQVY7QUFDRVgsS0FBRzBCLGdCQUFILENBQW9CYyxNQUFwQixDQUEyQkMsTUFBM0IsQ0FBa0MsVUFBQ0MsTUFBRCxFQUFTQyxHQUFUO0FBQ2hDQSxRQUFJZCxXQUFKLEdBQWtCYixTQUFTRSxNQUFULENBQWdCLFVBQWhCLENBQWxCO0FBQ0F5QixRQUFJMUIsT0FBSixHQUFjLElBQUljLElBQUosRUFBZDtBQ0NBLFdEQUFZLElBQUlKLFVBQUosR0FBaUJHLE1DQWpCO0FESEY7QUNLRCxDOzs7Ozs7Ozs7Ozs7QUNuQ0QxQyxHQUFHNEMsa0JBQUgsR0FBd0IsSUFBSTFDLE9BQU9DLFVBQVgsQ0FBc0Isb0JBQXRCLENBQXhCLEMiLCJmaWxlIjoiL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy1iaWxsaW5nLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGIuYmlsbGluZ3MgPSBuZXcgTWV0ZW9yLkNvbGxlY3Rpb24oJ2JpbGxpbmdzJylcclxuXHJcblxyXG5kYi5iaWxsaW5ncy5oZWxwZXJzXHJcblx0dHJhbnNhY3Rpb25faTE4bjogKCktPlxyXG5cdFx0dCA9IHRoaXMudHJhbnNhY3Rpb25cclxuXHRcdGQgPSBcIlwiXHJcblx0XHRpZiB0IGlzIFwiU3RhcnRpbmcgYmFsYW5jZVwiXHJcblx0XHRcdGQgPSBUQVBpMThuLl9fKCdiaWxsaW5nX3RyYW5EZXRhaWwuc3RhcnRpbmcnKVxyXG5cdFx0ZWxzZSBpZiB0IGlzIFwiUGF5bWVudFwiXHJcblx0XHRcdGQgPSBUQVBpMThuLl9fKCdiaWxsaW5nX3RyYW5EZXRhaWwucGF5bWVudCcpXHJcblx0XHRlbHNlIGlmIHQgaXMgXCJTZXJ2aWNlIGFkanVzdG1lbnRcIlxyXG5cdFx0XHRkID0gVEFQaTE4bi5fXygnYmlsbGluZ190cmFuRGV0YWlsLmFkanVzdG1lbnQnKVxyXG5cdFx0ZWxzZSBpZiB0IGlzIFwid29ya2Zsb3dcIlxyXG5cdFx0XHRkID0gVEFQaTE4bi5fXygnYmlsbGluZ190cmFuRGV0YWlsLndvcmtmbG93JylcclxuXHRcdGVsc2UgaWYgdCBpcyBcIndvcmtmbG93LnByb2Zlc3Npb25hbFwiXHJcblx0XHRcdGQgPSBUQVBpMThuLl9fKCdiaWxsaW5nX3RyYW5EZXRhaWwud29ya2Zsb3cnKVxyXG5cdFx0ZWxzZSBpZiB0IGlzIFwiY2hhdC5wcm9mZXNzaW9uYWxcIlxyXG5cdFx0XHRkID0gVEFQaTE4bi5fXygnYmlsbGluZ190cmFuRGV0YWlsLmNoYXQnKVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRkID0gdFxyXG5cclxuXHRcdHJldHVybiBkXHJcblxyXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcclxuXHRkYi5iaWxsaW5ncy5fZW5zdXJlSW5kZXgoe1xyXG5cdFx0XCJzcGFjZVwiOiAxXHJcblx0fSx7YmFja2dyb3VuZDogdHJ1ZX0pIiwiZGIuYmlsbGluZ3MgPSBuZXcgTWV0ZW9yLkNvbGxlY3Rpb24oJ2JpbGxpbmdzJyk7XG5cbmRiLmJpbGxpbmdzLmhlbHBlcnMoe1xuICB0cmFuc2FjdGlvbl9pMThuOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgZCwgdDtcbiAgICB0ID0gdGhpcy50cmFuc2FjdGlvbjtcbiAgICBkID0gXCJcIjtcbiAgICBpZiAodCA9PT0gXCJTdGFydGluZyBiYWxhbmNlXCIpIHtcbiAgICAgIGQgPSBUQVBpMThuLl9fKCdiaWxsaW5nX3RyYW5EZXRhaWwuc3RhcnRpbmcnKTtcbiAgICB9IGVsc2UgaWYgKHQgPT09IFwiUGF5bWVudFwiKSB7XG4gICAgICBkID0gVEFQaTE4bi5fXygnYmlsbGluZ190cmFuRGV0YWlsLnBheW1lbnQnKTtcbiAgICB9IGVsc2UgaWYgKHQgPT09IFwiU2VydmljZSBhZGp1c3RtZW50XCIpIHtcbiAgICAgIGQgPSBUQVBpMThuLl9fKCdiaWxsaW5nX3RyYW5EZXRhaWwuYWRqdXN0bWVudCcpO1xuICAgIH0gZWxzZSBpZiAodCA9PT0gXCJ3b3JrZmxvd1wiKSB7XG4gICAgICBkID0gVEFQaTE4bi5fXygnYmlsbGluZ190cmFuRGV0YWlsLndvcmtmbG93Jyk7XG4gICAgfSBlbHNlIGlmICh0ID09PSBcIndvcmtmbG93LnByb2Zlc3Npb25hbFwiKSB7XG4gICAgICBkID0gVEFQaTE4bi5fXygnYmlsbGluZ190cmFuRGV0YWlsLndvcmtmbG93Jyk7XG4gICAgfSBlbHNlIGlmICh0ID09PSBcImNoYXQucHJvZmVzc2lvbmFsXCIpIHtcbiAgICAgIGQgPSBUQVBpMThuLl9fKCdiaWxsaW5nX3RyYW5EZXRhaWwuY2hhdCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBkID0gdDtcbiAgICB9XG4gICAgcmV0dXJuIGQ7XG4gIH1cbn0pO1xuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIGRiLmJpbGxpbmdzLl9lbnN1cmVJbmRleCh7XG4gICAgXCJzcGFjZVwiOiAxXG4gIH0sIHtcbiAgICBiYWNrZ3JvdW5kOiB0cnVlXG4gIH0pO1xufVxuIiwiZGIuYmlsbGluZ19wYXlfcmVjb3JkcyA9IG5ldyBNZXRlb3IuQ29sbGVjdGlvbignYmlsbGluZ19wYXlfcmVjb3JkcycpXHJcblxyXG5kYi5iaWxsaW5nX3BheV9yZWNvcmRzLmhlbHBlcnNcclxuXHRvcmRlcl9jcmVhdGVkOiAoKS0+XHJcblx0XHRyZXR1cm4gbW9tZW50KHRoaXMuY3JlYXRlZCkuZm9ybWF0KCdZWVlZLU1NLUREIEhIOm1tOnNzJylcclxuXHJcblx0b3JkZXJfcGFpZDogKCktPlxyXG5cdFx0cmV0dXJuIGlmIHRoaXMucGFpZCB0aGVuIFRBUGkxOG4uX18oXCJiaWxsaW5nLmhhc19wYWlkXCIpIGVsc2UgVEFQaTE4bi5fXyhcImJpbGxpbmcubm90X3BhaWRcIilcclxuXHJcblx0b3JkZXJfdG90YWxfZmVlOiAoKS0+XHJcblx0XHRyZXR1cm4gKHRoaXMudG90YWxfZmVlLzEwMCkudG9TdHJpbmcoKVxyXG5cclxuIyBDcmVhdG9yLk9iamVjdHMuYmlsbGluZ19wYXlfcmVjb3JkcyA9IFxyXG4jIFx0bmFtZTogXCJiaWxsaW5nX3BheV9yZWNvcmRzXCJcclxuIyBcdGxhYmVsOiBcIuiuouWNlVwiXHJcbiMgXHRpY29uOiBcImFwcHNcIlxyXG4jIFx0ZmllbGRzOlxyXG4jIFx0XHRpbmZvOlxyXG4jIFx0XHRcdGxhYmVsOlwi6K+m5Y2V6K+m5oOFXCJcclxuIyBcdFx0XHR0eXBlOiBcIm9iamVjdFwiXHJcbiMgXHRcdFx0YmxhY2tib3g6IHRydWVcclxuIyBcdFx0XHRvbWl0OiB0cnVlXHJcbiMgXHRcdFx0aGlkZGVuOiB0cnVlXHJcblx0XHRcclxuIyBcdFx0dG90YWxfZmVlOlxyXG4jIFx0XHRcdGxhYmVsOlwi6YeR6aKd77+lXCJcclxuIyBcdFx0XHR0eXBlOiBcIm51bWJlclwiXHJcbiMgXHRcdFx0ZGVmYXVsdFZhbHVlOiAxMDBcclxuIyBcdFx0XHRvbWl0OiB0cnVlXHJcblx0XHRcclxuIyBcdFx0cGFpZDpcclxuIyBcdFx0XHRsYWJlbDpcIuW3suS7mOasvlwiXHJcbiMgXHRcdFx0dHlwZTogXCJib29sZWFuXCJcclxuIyBcdFx0XHRvbWl0OiB0cnVlXHJcbiMgXHRcdFx0ZGVmYXVsdFZhbHVlOiBmYWxzZVxyXG5cdFx0XHJcbiMgXHRcdG1vZHVsZXM6XHJcbiMgXHRcdFx0bGFiZWw6XCLmqKHlnZdcIlxyXG4jIFx0XHRcdHR5cGU6IFwiW3RleHRdXCJcclxuIyBcdFx0XHRibGFja2JveDogdHJ1ZVxyXG4jIFx0XHRcdG9taXQ6IHRydWVcclxuXHRcdFxyXG4jIFx0XHRlbmRfZGF0ZTpcclxuIyBcdFx0XHRsYWJlbDpcIuenn+eUqOaXpeacn+iHs1wiXHJcbiMgXHRcdFx0dHlwZTogXCJkYXRlXCJcclxuIyBcdFx0XHRvbWl0OiB0cnVlXHJcblx0XHRcclxuIyBcdFx0dXNlcl9jb3VudDpcclxuIyBcdFx0XHRsYWJlbDpcIuWQjeminVwiXHJcbiMgXHRcdFx0dHlwZTogXCJudW1iZXJcIlxyXG4jIFx0XHRcdG9taXQ6IHRydWVcclxuXHJcbiMgXHRsaXN0X3ZpZXdzOlxyXG4jIFx0XHRhbGw6XHJcbiMgXHRcdFx0bGFiZWw6IFwi5omA5pyJXCJcclxuIyBcdFx0XHRmaWx0ZXJfc2NvcGU6IFwic3BhY2VcIlxyXG4jIFx0XHRcdGNvbHVtbnM6IFtcIm1vZHVsZXNcIiwgXCJ1c2VyX2NvdW50XCIsIFwiZW5kX2RhdGVcIiwgXCJ0b3RhbF9mZWVcIiwgXCJwYWlkXCIsIFwiY3JlYXRlZFwiXVxyXG5cdFxyXG4jIFx0cGVybWlzc2lvbl9zZXQ6XHJcbiMgXHRcdHVzZXI6XHJcbiMgXHRcdFx0YWxsb3dDcmVhdGU6IGZhbHNlXHJcbiMgXHRcdFx0YWxsb3dEZWxldGU6IGZhbHNlXHJcbiMgXHRcdFx0YWxsb3dFZGl0OiBmYWxzZVxyXG4jIFx0XHRcdGFsbG93UmVhZDogZmFsc2VcclxuIyBcdFx0XHRtb2RpZnlBbGxSZWNvcmRzOiBmYWxzZVxyXG4jIFx0XHRcdHZpZXdBbGxSZWNvcmRzOiBmYWxzZSBcclxuIyBcdFx0YWRtaW46XHJcbiMgXHRcdFx0YWxsb3dDcmVhdGU6IGZhbHNlXHJcbiMgXHRcdFx0YWxsb3dEZWxldGU6IGZhbHNlXHJcbiMgXHRcdFx0YWxsb3dFZGl0OiBmYWxzZVxyXG4jIFx0XHRcdGFsbG93UmVhZDogdHJ1ZVxyXG4jIFx0XHRcdG1vZGlmeUFsbFJlY29yZHM6IGZhbHNlXHJcbiMgXHRcdFx0dmlld0FsbFJlY29yZHM6IHRydWUiLCJkYi5iaWxsaW5nX3BheV9yZWNvcmRzID0gbmV3IE1ldGVvci5Db2xsZWN0aW9uKCdiaWxsaW5nX3BheV9yZWNvcmRzJyk7XG5cbmRiLmJpbGxpbmdfcGF5X3JlY29yZHMuaGVscGVycyh7XG4gIG9yZGVyX2NyZWF0ZWQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBtb21lbnQodGhpcy5jcmVhdGVkKS5mb3JtYXQoJ1lZWVktTU0tREQgSEg6bW06c3MnKTtcbiAgfSxcbiAgb3JkZXJfcGFpZDogZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMucGFpZCkge1xuICAgICAgcmV0dXJuIFRBUGkxOG4uX18oXCJiaWxsaW5nLmhhc19wYWlkXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gVEFQaTE4bi5fXyhcImJpbGxpbmcubm90X3BhaWRcIik7XG4gICAgfVxuICB9LFxuICBvcmRlcl90b3RhbF9mZWU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAodGhpcy50b3RhbF9mZWUgLyAxMDApLnRvU3RyaW5nKCk7XG4gIH1cbn0pO1xuIiwiZGIubW9kdWxlcyA9IG5ldyBNZXRlb3IuQ29sbGVjdGlvbignbW9kdWxlcycpIiwiZGIubW9kdWxlc19jaGFuZ2Vsb2dzID0gbmV3IE1ldGVvci5Db2xsZWN0aW9uKCdtb2R1bGVzX2NoYW5nZWxvZ3MnKSIsImRiLnVzZXJzX2NoYW5nZWxvZ3MgPSBuZXcgTWV0ZW9yLkNvbGxlY3Rpb24oJ3VzZXJzX2NoYW5nZWxvZ3MnKVxyXG5cclxuZGIudXNlcnNfY2hhbmdlbG9ncy5fc2ltcGxlU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYVxyXG4gICMg5pel5pyf77yM6K6w5b2V5LqL5Lu25Y+R55Sf55qE5pe26Ze077yM5qC85byP77yaWVlZWU1NRERcclxuICBjaGFuZ2VfZGF0ZTpcclxuICAgIHR5cGU6IERhdGVcclxuICAjIOaTjeS9nOiAhVxyXG4gIG9wZXJhdG9yOlxyXG4gICAgdHlwZTogU3RyaW5nXHJcbiAgIyDlt6XkvZzljLpcclxuICBzcGFjZTpcclxuICAgIHR5cGU6IFN0cmluZ1xyXG4gICMgYWRk77yI5aKe5Yqg77yJZGVsZXRl77yI5Yig6Zmk77yJZW5hYmxl77yI5ZCv55So77yJZGlzYWJsZe+8iOWBnOeUqO+8iVxyXG4gIG9wZXJhdGlvbjpcclxuICAgIHR5cGU6IFN0cmluZ1xyXG4gICMg5a+56LGh77yMdXNlcl9pZFxyXG4gIHVzZXI6XHJcbiAgICB0eXBlOiBTdHJpbmdcclxuICAjIOW3peS9nOWMuuS4reWQr+eUqOeahOeUqOaIt+aVsFxyXG4gIHVzZXJfY291bnQ6XHJcbiAgICB0eXBlOiBOdW1iZXJcclxuICAjIOWIm+W7uuaXtumXtFxyXG4gIGNyZWF0ZWQ6XHJcbiAgICB0eXBlOiBEYXRlXHJcbiAgIyDliJvlu7rkurpcclxuICBjcmVhdGVkX2J5OlxyXG4gICAgdHlwZTogU3RyaW5nXHJcblxyXG5cclxuaWYgTWV0ZW9yLmlzU2VydmVyXHJcbiAgZGIudXNlcnNfY2hhbmdlbG9ncy5iZWZvcmUuaW5zZXJ0ICh1c2VySWQsIGRvYykgLT5cclxuICAgIGRvYy5jaGFuZ2VfZGF0ZSA9IG1vbWVudCgpLmZvcm1hdCgnWVlZWU1NREQnKTtcclxuICAgIGRvYy5jcmVhdGVkID0gbmV3IERhdGUoKTtcclxuICAgIGRvYy5jcmVhdGVkX2J5ID0gdXNlcklkO1xyXG5cclxuIiwiZGIudXNlcnNfY2hhbmdlbG9ncyA9IG5ldyBNZXRlb3IuQ29sbGVjdGlvbigndXNlcnNfY2hhbmdlbG9ncycpO1xuXG5kYi51c2Vyc19jaGFuZ2Vsb2dzLl9zaW1wbGVTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgY2hhbmdlX2RhdGU6IHtcbiAgICB0eXBlOiBEYXRlXG4gIH0sXG4gIG9wZXJhdG9yOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIHNwYWNlOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIG9wZXJhdGlvbjoge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICB1c2VyOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIHVzZXJfY291bnQ6IHtcbiAgICB0eXBlOiBOdW1iZXJcbiAgfSxcbiAgY3JlYXRlZDoge1xuICAgIHR5cGU6IERhdGVcbiAgfSxcbiAgY3JlYXRlZF9ieToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9XG59KTtcblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBkYi51c2Vyc19jaGFuZ2Vsb2dzLmJlZm9yZS5pbnNlcnQoZnVuY3Rpb24odXNlcklkLCBkb2MpIHtcbiAgICBkb2MuY2hhbmdlX2RhdGUgPSBtb21lbnQoKS5mb3JtYXQoJ1lZWVlNTUREJyk7XG4gICAgZG9jLmNyZWF0ZWQgPSBuZXcgRGF0ZSgpO1xuICAgIHJldHVybiBkb2MuY3JlYXRlZF9ieSA9IHVzZXJJZDtcbiAgfSk7XG59XG4iLCJkYi5zdGVlZG9zX3N0YXRpc3RpY3MgPSBuZXcgTWV0ZW9yLkNvbGxlY3Rpb24oJ3N0ZWVkb3Nfc3RhdGlzdGljcycpXHJcbiJdfQ==
