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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzLWJpbGxpbmcvbW9kZWxzL2JpbGxpbmdzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbW9kZWxzL2JpbGxpbmdzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzLWJpbGxpbmcvbW9kZWxzL2JpbGxpbmdfcGF5X3JlY29yZHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9tb2RlbHMvYmlsbGluZ19wYXlfcmVjb3Jkcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy1iaWxsaW5nL21vZGVscy9tb2R1bGVzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzLWJpbGxpbmcvbW9kZWxzL21vZHVsZXNfY2hhbmdlbG9ncy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy1iaWxsaW5nL21vZGVscy91c2Vyc19jaGFuZ2Vsb2dzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbW9kZWxzL3VzZXJzX2NoYW5nZWxvZ3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMtYmlsbGluZy9tb2RlbHMvc3RlZWRvc19zdGF0aXN0aWNzLmNvZmZlZSJdLCJuYW1lcyI6WyJkYiIsImJpbGxpbmdzIiwiTWV0ZW9yIiwiQ29sbGVjdGlvbiIsImhlbHBlcnMiLCJ0cmFuc2FjdGlvbl9pMThuIiwiZCIsInQiLCJ0cmFuc2FjdGlvbiIsIlRBUGkxOG4iLCJfXyIsImlzU2VydmVyIiwiX2Vuc3VyZUluZGV4IiwiYmFja2dyb3VuZCIsImJpbGxpbmdfcGF5X3JlY29yZHMiLCJvcmRlcl9jcmVhdGVkIiwibW9tZW50IiwiY3JlYXRlZCIsImZvcm1hdCIsIm9yZGVyX3BhaWQiLCJwYWlkIiwib3JkZXJfdG90YWxfZmVlIiwidG90YWxfZmVlIiwidG9TdHJpbmciLCJtb2R1bGVzIiwibW9kdWxlc19jaGFuZ2Vsb2dzIiwidXNlcnNfY2hhbmdlbG9ncyIsIl9zaW1wbGVTY2hlbWEiLCJTaW1wbGVTY2hlbWEiLCJjaGFuZ2VfZGF0ZSIsInR5cGUiLCJEYXRlIiwib3BlcmF0b3IiLCJTdHJpbmciLCJzcGFjZSIsIm9wZXJhdGlvbiIsInVzZXIiLCJ1c2VyX2NvdW50IiwiTnVtYmVyIiwiY3JlYXRlZF9ieSIsImJlZm9yZSIsImluc2VydCIsInVzZXJJZCIsImRvYyIsInN0ZWVkb3Nfc3RhdGlzdGljcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQUEsR0FBR0MsUUFBSCxHQUFjLElBQUlDLE9BQU9DLFVBQVgsQ0FBc0IsVUFBdEIsQ0FBZDtBQUdBSCxHQUFHQyxRQUFILENBQVlHLE9BQVosQ0FDQztBQUFBQyxvQkFBa0I7QUFDakIsUUFBQUMsQ0FBQSxFQUFBQyxDQUFBO0FBQUFBLFFBQUksS0FBS0MsV0FBVDtBQUNBRixRQUFJLEVBQUo7O0FBQ0EsUUFBR0MsTUFBSyxrQkFBUjtBQUNDRCxVQUFJRyxRQUFRQyxFQUFSLENBQVcsNkJBQVgsQ0FBSjtBQURELFdBRUssSUFBR0gsTUFBSyxTQUFSO0FBQ0pELFVBQUlHLFFBQVFDLEVBQVIsQ0FBVyw0QkFBWCxDQUFKO0FBREksV0FFQSxJQUFHSCxNQUFLLG9CQUFSO0FBQ0pELFVBQUlHLFFBQVFDLEVBQVIsQ0FBVywrQkFBWCxDQUFKO0FBREksV0FFQSxJQUFHSCxNQUFLLFVBQVI7QUFDSkQsVUFBSUcsUUFBUUMsRUFBUixDQUFXLDZCQUFYLENBQUo7QUFESSxXQUVBLElBQUdILE1BQUssdUJBQVI7QUFDSkQsVUFBSUcsUUFBUUMsRUFBUixDQUFXLDZCQUFYLENBQUo7QUFESSxXQUVBLElBQUdILE1BQUssbUJBQVI7QUFDSkQsVUFBSUcsUUFBUUMsRUFBUixDQUFXLHlCQUFYLENBQUo7QUFESTtBQUdKSixVQUFJQyxDQUFKO0FDQ0U7O0FEQ0gsV0FBT0QsQ0FBUDtBQWxCRDtBQUFBLENBREQ7O0FBcUJBLElBQUdKLE9BQU9TLFFBQVY7QUFDQ1gsS0FBR0MsUUFBSCxDQUFZVyxZQUFaLENBQXlCO0FBQ3hCLGFBQVM7QUFEZSxHQUF6QixFQUVFO0FBQUNDLGdCQUFZO0FBQWIsR0FGRjtBQ09BLEM7Ozs7Ozs7Ozs7OztBQ2hDRGIsR0FBR2MsbUJBQUgsR0FBeUIsSUFBSVosT0FBT0MsVUFBWCxDQUFzQixxQkFBdEIsQ0FBekI7QUFFQUgsR0FBR2MsbUJBQUgsQ0FBdUJWLE9BQXZCLENBQ0M7QUFBQVcsaUJBQWU7QUFDZCxXQUFPQyxPQUFPLEtBQUtDLE9BQVosRUFBcUJDLE1BQXJCLENBQTRCLHFCQUE1QixDQUFQO0FBREQ7QUFHQUMsY0FBWTtBQUNKLFFBQUcsS0FBS0MsSUFBUjtBQ0NILGFERHFCWCxRQUFRQyxFQUFSLENBQVcsa0JBQVgsQ0NDckI7QURERztBQ0dILGFESHlERCxRQUFRQyxFQUFSLENBQVcsa0JBQVgsQ0NHekQ7QUFDRDtBRFJKO0FBTUFXLG1CQUFpQjtBQUNoQixXQUFPLENBQUMsS0FBS0MsU0FBTCxHQUFlLEdBQWhCLEVBQXFCQyxRQUFyQixFQUFQO0FBUEQ7QUFBQSxDQURELEU7Ozs7Ozs7Ozs7OztBRUZBdkIsR0FBR3dCLE9BQUgsR0FBYSxJQUFJdEIsT0FBT0MsVUFBWCxDQUFzQixTQUF0QixDQUFiLEM7Ozs7Ozs7Ozs7OztBQ0FBSCxHQUFHeUIsa0JBQUgsR0FBd0IsSUFBSXZCLE9BQU9DLFVBQVgsQ0FBc0Isb0JBQXRCLENBQXhCLEM7Ozs7Ozs7Ozs7OztBQ0FBSCxHQUFHMEIsZ0JBQUgsR0FBc0IsSUFBSXhCLE9BQU9DLFVBQVgsQ0FBc0Isa0JBQXRCLENBQXRCO0FBRUFILEdBQUcwQixnQkFBSCxDQUFvQkMsYUFBcEIsR0FBb0MsSUFBSUMsWUFBSixDQUVsQztBQUFBQyxlQUNFO0FBQUFDLFVBQU1DO0FBQU4sR0FERjtBQUdBQyxZQUNFO0FBQUFGLFVBQU1HO0FBQU4sR0FKRjtBQU1BQyxTQUNFO0FBQUFKLFVBQU1HO0FBQU4sR0FQRjtBQVNBRSxhQUNFO0FBQUFMLFVBQU1HO0FBQU4sR0FWRjtBQVlBRyxRQUNFO0FBQUFOLFVBQU1HO0FBQU4sR0FiRjtBQWVBSSxjQUNFO0FBQUFQLFVBQU1RO0FBQU4sR0FoQkY7QUFrQkFyQixXQUNFO0FBQUFhLFVBQU1DO0FBQU4sR0FuQkY7QUFxQkFRLGNBQ0U7QUFBQVQsVUFBTUc7QUFBTjtBQXRCRixDQUZrQyxDQUFwQzs7QUEyQkEsSUFBRy9CLE9BQU9TLFFBQVY7QUFDRVgsS0FBRzBCLGdCQUFILENBQW9CYyxNQUFwQixDQUEyQkMsTUFBM0IsQ0FBa0MsVUFBQ0MsTUFBRCxFQUFTQyxHQUFUO0FBQ2hDQSxRQUFJZCxXQUFKLEdBQWtCYixTQUFTRSxNQUFULENBQWdCLFVBQWhCLENBQWxCO0FBQ0F5QixRQUFJMUIsT0FBSixHQUFjLElBQUljLElBQUosRUFBZDtBQ0NBLFdEQUFZLElBQUlKLFVBQUosR0FBaUJHLE1DQWpCO0FESEY7QUNLRCxDOzs7Ozs7Ozs7Ozs7QUNuQ0QxQyxHQUFHNEMsa0JBQUgsR0FBd0IsSUFBSTFDLE9BQU9DLFVBQVgsQ0FBc0Isb0JBQXRCLENBQXhCLEMiLCJmaWxlIjoiL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy1iaWxsaW5nLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGIuYmlsbGluZ3MgPSBuZXcgTWV0ZW9yLkNvbGxlY3Rpb24oJ2JpbGxpbmdzJylcblxuXG5kYi5iaWxsaW5ncy5oZWxwZXJzXG5cdHRyYW5zYWN0aW9uX2kxOG46ICgpLT5cblx0XHR0ID0gdGhpcy50cmFuc2FjdGlvblxuXHRcdGQgPSBcIlwiXG5cdFx0aWYgdCBpcyBcIlN0YXJ0aW5nIGJhbGFuY2VcIlxuXHRcdFx0ZCA9IFRBUGkxOG4uX18oJ2JpbGxpbmdfdHJhbkRldGFpbC5zdGFydGluZycpXG5cdFx0ZWxzZSBpZiB0IGlzIFwiUGF5bWVudFwiXG5cdFx0XHRkID0gVEFQaTE4bi5fXygnYmlsbGluZ190cmFuRGV0YWlsLnBheW1lbnQnKVxuXHRcdGVsc2UgaWYgdCBpcyBcIlNlcnZpY2UgYWRqdXN0bWVudFwiXG5cdFx0XHRkID0gVEFQaTE4bi5fXygnYmlsbGluZ190cmFuRGV0YWlsLmFkanVzdG1lbnQnKVxuXHRcdGVsc2UgaWYgdCBpcyBcIndvcmtmbG93XCJcblx0XHRcdGQgPSBUQVBpMThuLl9fKCdiaWxsaW5nX3RyYW5EZXRhaWwud29ya2Zsb3cnKVxuXHRcdGVsc2UgaWYgdCBpcyBcIndvcmtmbG93LnByb2Zlc3Npb25hbFwiXG5cdFx0XHRkID0gVEFQaTE4bi5fXygnYmlsbGluZ190cmFuRGV0YWlsLndvcmtmbG93Jylcblx0XHRlbHNlIGlmIHQgaXMgXCJjaGF0LnByb2Zlc3Npb25hbFwiXG5cdFx0XHRkID0gVEFQaTE4bi5fXygnYmlsbGluZ190cmFuRGV0YWlsLmNoYXQnKVxuXHRcdGVsc2Vcblx0XHRcdGQgPSB0XG5cblx0XHRyZXR1cm4gZFxuXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcblx0ZGIuYmlsbGluZ3MuX2Vuc3VyZUluZGV4KHtcblx0XHRcInNwYWNlXCI6IDFcblx0fSx7YmFja2dyb3VuZDogdHJ1ZX0pIiwiZGIuYmlsbGluZ3MgPSBuZXcgTWV0ZW9yLkNvbGxlY3Rpb24oJ2JpbGxpbmdzJyk7XG5cbmRiLmJpbGxpbmdzLmhlbHBlcnMoe1xuICB0cmFuc2FjdGlvbl9pMThuOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgZCwgdDtcbiAgICB0ID0gdGhpcy50cmFuc2FjdGlvbjtcbiAgICBkID0gXCJcIjtcbiAgICBpZiAodCA9PT0gXCJTdGFydGluZyBiYWxhbmNlXCIpIHtcbiAgICAgIGQgPSBUQVBpMThuLl9fKCdiaWxsaW5nX3RyYW5EZXRhaWwuc3RhcnRpbmcnKTtcbiAgICB9IGVsc2UgaWYgKHQgPT09IFwiUGF5bWVudFwiKSB7XG4gICAgICBkID0gVEFQaTE4bi5fXygnYmlsbGluZ190cmFuRGV0YWlsLnBheW1lbnQnKTtcbiAgICB9IGVsc2UgaWYgKHQgPT09IFwiU2VydmljZSBhZGp1c3RtZW50XCIpIHtcbiAgICAgIGQgPSBUQVBpMThuLl9fKCdiaWxsaW5nX3RyYW5EZXRhaWwuYWRqdXN0bWVudCcpO1xuICAgIH0gZWxzZSBpZiAodCA9PT0gXCJ3b3JrZmxvd1wiKSB7XG4gICAgICBkID0gVEFQaTE4bi5fXygnYmlsbGluZ190cmFuRGV0YWlsLndvcmtmbG93Jyk7XG4gICAgfSBlbHNlIGlmICh0ID09PSBcIndvcmtmbG93LnByb2Zlc3Npb25hbFwiKSB7XG4gICAgICBkID0gVEFQaTE4bi5fXygnYmlsbGluZ190cmFuRGV0YWlsLndvcmtmbG93Jyk7XG4gICAgfSBlbHNlIGlmICh0ID09PSBcImNoYXQucHJvZmVzc2lvbmFsXCIpIHtcbiAgICAgIGQgPSBUQVBpMThuLl9fKCdiaWxsaW5nX3RyYW5EZXRhaWwuY2hhdCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBkID0gdDtcbiAgICB9XG4gICAgcmV0dXJuIGQ7XG4gIH1cbn0pO1xuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIGRiLmJpbGxpbmdzLl9lbnN1cmVJbmRleCh7XG4gICAgXCJzcGFjZVwiOiAxXG4gIH0sIHtcbiAgICBiYWNrZ3JvdW5kOiB0cnVlXG4gIH0pO1xufVxuIiwiZGIuYmlsbGluZ19wYXlfcmVjb3JkcyA9IG5ldyBNZXRlb3IuQ29sbGVjdGlvbignYmlsbGluZ19wYXlfcmVjb3JkcycpXG5cbmRiLmJpbGxpbmdfcGF5X3JlY29yZHMuaGVscGVyc1xuXHRvcmRlcl9jcmVhdGVkOiAoKS0+XG5cdFx0cmV0dXJuIG1vbWVudCh0aGlzLmNyZWF0ZWQpLmZvcm1hdCgnWVlZWS1NTS1ERCBISDptbTpzcycpXG5cblx0b3JkZXJfcGFpZDogKCktPlxuXHRcdHJldHVybiBpZiB0aGlzLnBhaWQgdGhlbiBUQVBpMThuLl9fKFwiYmlsbGluZy5oYXNfcGFpZFwiKSBlbHNlIFRBUGkxOG4uX18oXCJiaWxsaW5nLm5vdF9wYWlkXCIpXG5cblx0b3JkZXJfdG90YWxfZmVlOiAoKS0+XG5cdFx0cmV0dXJuICh0aGlzLnRvdGFsX2ZlZS8xMDApLnRvU3RyaW5nKClcblxuIyBDcmVhdG9yLk9iamVjdHMuYmlsbGluZ19wYXlfcmVjb3JkcyA9IFxuIyBcdG5hbWU6IFwiYmlsbGluZ19wYXlfcmVjb3Jkc1wiXG4jIFx0bGFiZWw6IFwi6K6i5Y2VXCJcbiMgXHRpY29uOiBcImFwcHNcIlxuIyBcdGZpZWxkczpcbiMgXHRcdGluZm86XG4jIFx0XHRcdGxhYmVsOlwi6K+m5Y2V6K+m5oOFXCJcbiMgXHRcdFx0dHlwZTogXCJvYmplY3RcIlxuIyBcdFx0XHRibGFja2JveDogdHJ1ZVxuIyBcdFx0XHRvbWl0OiB0cnVlXG4jIFx0XHRcdGhpZGRlbjogdHJ1ZVxuXHRcdFxuIyBcdFx0dG90YWxfZmVlOlxuIyBcdFx0XHRsYWJlbDpcIumHkemine+/pVwiXG4jIFx0XHRcdHR5cGU6IFwibnVtYmVyXCJcbiMgXHRcdFx0ZGVmYXVsdFZhbHVlOiAxMDBcbiMgXHRcdFx0b21pdDogdHJ1ZVxuXHRcdFxuIyBcdFx0cGFpZDpcbiMgXHRcdFx0bGFiZWw6XCLlt7Lku5jmrL5cIlxuIyBcdFx0XHR0eXBlOiBcImJvb2xlYW5cIlxuIyBcdFx0XHRvbWl0OiB0cnVlXG4jIFx0XHRcdGRlZmF1bHRWYWx1ZTogZmFsc2Vcblx0XHRcbiMgXHRcdG1vZHVsZXM6XG4jIFx0XHRcdGxhYmVsOlwi5qih5Z2XXCJcbiMgXHRcdFx0dHlwZTogXCJbdGV4dF1cIlxuIyBcdFx0XHRibGFja2JveDogdHJ1ZVxuIyBcdFx0XHRvbWl0OiB0cnVlXG5cdFx0XG4jIFx0XHRlbmRfZGF0ZTpcbiMgXHRcdFx0bGFiZWw6XCLnp5/nlKjml6XmnJ/oh7NcIlxuIyBcdFx0XHR0eXBlOiBcImRhdGVcIlxuIyBcdFx0XHRvbWl0OiB0cnVlXG5cdFx0XG4jIFx0XHR1c2VyX2NvdW50OlxuIyBcdFx0XHRsYWJlbDpcIuWQjeminVwiXG4jIFx0XHRcdHR5cGU6IFwibnVtYmVyXCJcbiMgXHRcdFx0b21pdDogdHJ1ZVxuXG4jIFx0bGlzdF92aWV3czpcbiMgXHRcdGFsbDpcbiMgXHRcdFx0bGFiZWw6IFwi5omA5pyJXCJcbiMgXHRcdFx0ZmlsdGVyX3Njb3BlOiBcInNwYWNlXCJcbiMgXHRcdFx0Y29sdW1uczogW1wibW9kdWxlc1wiLCBcInVzZXJfY291bnRcIiwgXCJlbmRfZGF0ZVwiLCBcInRvdGFsX2ZlZVwiLCBcInBhaWRcIiwgXCJjcmVhdGVkXCJdXG5cdFxuIyBcdHBlcm1pc3Npb25fc2V0OlxuIyBcdFx0dXNlcjpcbiMgXHRcdFx0YWxsb3dDcmVhdGU6IGZhbHNlXG4jIFx0XHRcdGFsbG93RGVsZXRlOiBmYWxzZVxuIyBcdFx0XHRhbGxvd0VkaXQ6IGZhbHNlXG4jIFx0XHRcdGFsbG93UmVhZDogZmFsc2VcbiMgXHRcdFx0bW9kaWZ5QWxsUmVjb3JkczogZmFsc2VcbiMgXHRcdFx0dmlld0FsbFJlY29yZHM6IGZhbHNlIFxuIyBcdFx0YWRtaW46XG4jIFx0XHRcdGFsbG93Q3JlYXRlOiBmYWxzZVxuIyBcdFx0XHRhbGxvd0RlbGV0ZTogZmFsc2VcbiMgXHRcdFx0YWxsb3dFZGl0OiBmYWxzZVxuIyBcdFx0XHRhbGxvd1JlYWQ6IHRydWVcbiMgXHRcdFx0bW9kaWZ5QWxsUmVjb3JkczogZmFsc2VcbiMgXHRcdFx0dmlld0FsbFJlY29yZHM6IHRydWUiLCJkYi5iaWxsaW5nX3BheV9yZWNvcmRzID0gbmV3IE1ldGVvci5Db2xsZWN0aW9uKCdiaWxsaW5nX3BheV9yZWNvcmRzJyk7XG5cbmRiLmJpbGxpbmdfcGF5X3JlY29yZHMuaGVscGVycyh7XG4gIG9yZGVyX2NyZWF0ZWQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBtb21lbnQodGhpcy5jcmVhdGVkKS5mb3JtYXQoJ1lZWVktTU0tREQgSEg6bW06c3MnKTtcbiAgfSxcbiAgb3JkZXJfcGFpZDogZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMucGFpZCkge1xuICAgICAgcmV0dXJuIFRBUGkxOG4uX18oXCJiaWxsaW5nLmhhc19wYWlkXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gVEFQaTE4bi5fXyhcImJpbGxpbmcubm90X3BhaWRcIik7XG4gICAgfVxuICB9LFxuICBvcmRlcl90b3RhbF9mZWU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAodGhpcy50b3RhbF9mZWUgLyAxMDApLnRvU3RyaW5nKCk7XG4gIH1cbn0pO1xuIiwiZGIubW9kdWxlcyA9IG5ldyBNZXRlb3IuQ29sbGVjdGlvbignbW9kdWxlcycpIiwiZGIubW9kdWxlc19jaGFuZ2Vsb2dzID0gbmV3IE1ldGVvci5Db2xsZWN0aW9uKCdtb2R1bGVzX2NoYW5nZWxvZ3MnKSIsImRiLnVzZXJzX2NoYW5nZWxvZ3MgPSBuZXcgTWV0ZW9yLkNvbGxlY3Rpb24oJ3VzZXJzX2NoYW5nZWxvZ3MnKVxuXG5kYi51c2Vyc19jaGFuZ2Vsb2dzLl9zaW1wbGVTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hXG4gICMg5pel5pyf77yM6K6w5b2V5LqL5Lu25Y+R55Sf55qE5pe26Ze077yM5qC85byP77yaWVlZWU1NRERcbiAgY2hhbmdlX2RhdGU6XG4gICAgdHlwZTogRGF0ZVxuICAjIOaTjeS9nOiAhVxuICBvcGVyYXRvcjpcbiAgICB0eXBlOiBTdHJpbmdcbiAgIyDlt6XkvZzljLpcbiAgc3BhY2U6XG4gICAgdHlwZTogU3RyaW5nXG4gICMgYWRk77yI5aKe5Yqg77yJZGVsZXRl77yI5Yig6Zmk77yJZW5hYmxl77yI5ZCv55So77yJZGlzYWJsZe+8iOWBnOeUqO+8iVxuICBvcGVyYXRpb246XG4gICAgdHlwZTogU3RyaW5nXG4gICMg5a+56LGh77yMdXNlcl9pZFxuICB1c2VyOlxuICAgIHR5cGU6IFN0cmluZ1xuICAjIOW3peS9nOWMuuS4reWQr+eUqOeahOeUqOaIt+aVsFxuICB1c2VyX2NvdW50OlxuICAgIHR5cGU6IE51bWJlclxuICAjIOWIm+W7uuaXtumXtFxuICBjcmVhdGVkOlxuICAgIHR5cGU6IERhdGVcbiAgIyDliJvlu7rkurpcbiAgY3JlYXRlZF9ieTpcbiAgICB0eXBlOiBTdHJpbmdcblxuXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcbiAgZGIudXNlcnNfY2hhbmdlbG9ncy5iZWZvcmUuaW5zZXJ0ICh1c2VySWQsIGRvYykgLT5cbiAgICBkb2MuY2hhbmdlX2RhdGUgPSBtb21lbnQoKS5mb3JtYXQoJ1lZWVlNTUREJyk7XG4gICAgZG9jLmNyZWF0ZWQgPSBuZXcgRGF0ZSgpO1xuICAgIGRvYy5jcmVhdGVkX2J5ID0gdXNlcklkO1xuXG4iLCJkYi51c2Vyc19jaGFuZ2Vsb2dzID0gbmV3IE1ldGVvci5Db2xsZWN0aW9uKCd1c2Vyc19jaGFuZ2Vsb2dzJyk7XG5cbmRiLnVzZXJzX2NoYW5nZWxvZ3MuX3NpbXBsZVNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBjaGFuZ2VfZGF0ZToge1xuICAgIHR5cGU6IERhdGVcbiAgfSxcbiAgb3BlcmF0b3I6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgc3BhY2U6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgb3BlcmF0aW9uOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIHVzZXI6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgdXNlcl9jb3VudDoge1xuICAgIHR5cGU6IE51bWJlclxuICB9LFxuICBjcmVhdGVkOiB7XG4gICAgdHlwZTogRGF0ZVxuICB9LFxuICBjcmVhdGVkX2J5OiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH1cbn0pO1xuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIGRiLnVzZXJzX2NoYW5nZWxvZ3MuYmVmb3JlLmluc2VydChmdW5jdGlvbih1c2VySWQsIGRvYykge1xuICAgIGRvYy5jaGFuZ2VfZGF0ZSA9IG1vbWVudCgpLmZvcm1hdCgnWVlZWU1NREQnKTtcbiAgICBkb2MuY3JlYXRlZCA9IG5ldyBEYXRlKCk7XG4gICAgcmV0dXJuIGRvYy5jcmVhdGVkX2J5ID0gdXNlcklkO1xuICB9KTtcbn1cbiIsImRiLnN0ZWVkb3Nfc3RhdGlzdGljcyA9IG5ldyBNZXRlb3IuQ29sbGVjdGlvbignc3RlZWRvc19zdGF0aXN0aWNzJylcbiJdfQ==
