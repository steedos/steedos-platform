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

///////////////////////////////////////////////////////////////////////////////////////
//                                                                                   //
// packages/steedos_objects-billing/models/billings.coffee                           //
//                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////
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
///////////////////////////////////////////////////////////////////////////////////////

},"billing_pay_records.coffee":function module(){

///////////////////////////////////////////////////////////////////////////////////////
//                                                                                   //
// packages/steedos_objects-billing/models/billing_pay_records.coffee                //
//                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////
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
Creator.Objects.billing_pay_records = {
  name: "billing_pay_records",
  label: "订单",
  icon: "apps",
  fields: {
    info: {
      label: "详单详情",
      type: "object",
      blackbox: true,
      omit: true,
      hidden: true
    },
    total_fee: {
      label: "金额￥",
      type: "number",
      defaultValue: 100,
      omit: true
    },
    paid: {
      label: "已付款",
      type: "boolean",
      omit: true,
      defaultValue: false
    },
    modules: {
      label: "模块",
      type: "[text]",
      blackbox: true,
      omit: true
    },
    end_date: {
      label: "租用日期至",
      type: "date",
      omit: true
    },
    user_count: {
      label: "名额",
      type: "number",
      omit: true
    }
  },
  list_views: {
    all: {
      label: "所有",
      filter_scope: "space",
      columns: ["modules", "user_count", "end_date", "total_fee", "paid", "created"]
    }
  },
  permission_set: {
    user: {
      allowCreate: false,
      allowDelete: false,
      allowEdit: false,
      allowRead: false,
      modifyAllRecords: false,
      viewAllRecords: false
    },
    admin: {
      allowCreate: false,
      allowDelete: false,
      allowEdit: false,
      allowRead: true,
      modifyAllRecords: false,
      viewAllRecords: true
    }
  }
};
///////////////////////////////////////////////////////////////////////////////////////

},"modules.coffee":function module(){

///////////////////////////////////////////////////////////////////////////////////////
//                                                                                   //
// packages/steedos_objects-billing/models/modules.coffee                            //
//                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////
                                                                                     //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
db.modules = new Meteor.Collection('modules');
///////////////////////////////////////////////////////////////////////////////////////

},"modules_changelogs.coffee":function module(){

///////////////////////////////////////////////////////////////////////////////////////
//                                                                                   //
// packages/steedos_objects-billing/models/modules_changelogs.coffee                 //
//                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////
                                                                                     //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
db.modules_changelogs = new Meteor.Collection('modules_changelogs');
///////////////////////////////////////////////////////////////////////////////////////

},"users_changelogs.coffee":function module(){

///////////////////////////////////////////////////////////////////////////////////////
//                                                                                   //
// packages/steedos_objects-billing/models/users_changelogs.coffee                   //
//                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////
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
///////////////////////////////////////////////////////////////////////////////////////

},"steedos_statistics.coffee":function module(){

///////////////////////////////////////////////////////////////////////////////////////
//                                                                                   //
// packages/steedos_objects-billing/models/steedos_statistics.coffee                 //
//                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////
                                                                                     //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
db.steedos_statistics = new Meteor.Collection('steedos_statistics');
///////////////////////////////////////////////////////////////////////////////////////

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzLWJpbGxpbmcvbW9kZWxzL2JpbGxpbmdzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbW9kZWxzL2JpbGxpbmdzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzLWJpbGxpbmcvbW9kZWxzL2JpbGxpbmdfcGF5X3JlY29yZHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9tb2RlbHMvYmlsbGluZ19wYXlfcmVjb3Jkcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy1iaWxsaW5nL21vZGVscy9tb2R1bGVzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzLWJpbGxpbmcvbW9kZWxzL21vZHVsZXNfY2hhbmdlbG9ncy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy1iaWxsaW5nL21vZGVscy91c2Vyc19jaGFuZ2Vsb2dzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbW9kZWxzL3VzZXJzX2NoYW5nZWxvZ3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMtYmlsbGluZy9tb2RlbHMvc3RlZWRvc19zdGF0aXN0aWNzLmNvZmZlZSJdLCJuYW1lcyI6WyJkYiIsImJpbGxpbmdzIiwiTWV0ZW9yIiwiQ29sbGVjdGlvbiIsImhlbHBlcnMiLCJ0cmFuc2FjdGlvbl9pMThuIiwiZCIsInQiLCJ0cmFuc2FjdGlvbiIsIlRBUGkxOG4iLCJfXyIsImlzU2VydmVyIiwiX2Vuc3VyZUluZGV4IiwiYmFja2dyb3VuZCIsImJpbGxpbmdfcGF5X3JlY29yZHMiLCJvcmRlcl9jcmVhdGVkIiwibW9tZW50IiwiY3JlYXRlZCIsImZvcm1hdCIsIm9yZGVyX3BhaWQiLCJwYWlkIiwib3JkZXJfdG90YWxfZmVlIiwidG90YWxfZmVlIiwidG9TdHJpbmciLCJDcmVhdG9yIiwiT2JqZWN0cyIsIm5hbWUiLCJsYWJlbCIsImljb24iLCJmaWVsZHMiLCJpbmZvIiwidHlwZSIsImJsYWNrYm94Iiwib21pdCIsImhpZGRlbiIsImRlZmF1bHRWYWx1ZSIsIm1vZHVsZXMiLCJlbmRfZGF0ZSIsInVzZXJfY291bnQiLCJsaXN0X3ZpZXdzIiwiYWxsIiwiZmlsdGVyX3Njb3BlIiwiY29sdW1ucyIsInBlcm1pc3Npb25fc2V0IiwidXNlciIsImFsbG93Q3JlYXRlIiwiYWxsb3dEZWxldGUiLCJhbGxvd0VkaXQiLCJhbGxvd1JlYWQiLCJtb2RpZnlBbGxSZWNvcmRzIiwidmlld0FsbFJlY29yZHMiLCJhZG1pbiIsIm1vZHVsZXNfY2hhbmdlbG9ncyIsInVzZXJzX2NoYW5nZWxvZ3MiLCJfc2ltcGxlU2NoZW1hIiwiU2ltcGxlU2NoZW1hIiwiY2hhbmdlX2RhdGUiLCJEYXRlIiwib3BlcmF0b3IiLCJTdHJpbmciLCJzcGFjZSIsIm9wZXJhdGlvbiIsIk51bWJlciIsImNyZWF0ZWRfYnkiLCJiZWZvcmUiLCJpbnNlcnQiLCJ1c2VySWQiLCJkb2MiLCJzdGVlZG9zX3N0YXRpc3RpY3MiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUFBLEdBQUdDLFFBQUgsR0FBYyxJQUFJQyxPQUFPQyxVQUFYLENBQXNCLFVBQXRCLENBQWQ7QUFHQUgsR0FBR0MsUUFBSCxDQUFZRyxPQUFaLENBQ0M7QUFBQUMsb0JBQWtCO0FBQ2pCLFFBQUFDLENBQUEsRUFBQUMsQ0FBQTtBQUFBQSxRQUFJLEtBQUtDLFdBQVQ7QUFDQUYsUUFBSSxFQUFKOztBQUNBLFFBQUdDLE1BQUssa0JBQVI7QUFDQ0QsVUFBSUcsUUFBUUMsRUFBUixDQUFXLDZCQUFYLENBQUo7QUFERCxXQUVLLElBQUdILE1BQUssU0FBUjtBQUNKRCxVQUFJRyxRQUFRQyxFQUFSLENBQVcsNEJBQVgsQ0FBSjtBQURJ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QUF0QixDQUF4QixDIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMtYmlsbGluZy5qcyIsInNvdXJjZXNDb250ZW50IjpbImRiLmJpbGxpbmdzID0gbmV3IE1ldGVvci5Db2xsZWN0aW9uKCdiaWxsaW5ncycpXG5cblxuZGIuYmlsbGluZ3MuaGVscGVyc1xuXHR0cmFuc2FjdGlvbl9pMThuOiAoKS0+XG5cdFx0dCA9IHRoaXMudHJhbnNhY3Rpb25cblx0XHRkID0gXCJcIlxuXHRcdGlmIHQgaXMgXCJTdGFydGluZyBiYWxhbmNlXCJcblx0XHRcdGQgPSBUQVBpMThuLl9fKCdiaWxsaW5nX3RyYW5EZXRhaWwuc3RhcnRpbmcnKVxuXHRcdGVsc2UgaWYgdCBpcyBcIlBheW1lbnRcIlxuXHRcdFx0ZCA9IFRBUGkxOG4uX18oJ2JpbGxpbmdfdHJhbkRldGFpbC5wYXltZW50Jylcblx0XHRlbHNlIGlmIHQgaXMgXCJTZXJ2aWNlIGFkanVzdG1lbnRcIlxuXHRcdFx0ZCA9IFRBUGkxOG4uX18oJ2JpbGxpbmdfdHJhbkRldGFpbC5hZGp1c3RtZW50Jylcblx0XHRlbHNlIGlmIHQgaXMgXCJ3b3JrZmxvd1wiXG5cdFx0XHRkID0gVEFQaTE4bi5fXygnYmlsbGluZ190cmFuRGV0YWlsLndvcmtmbG93Jylcblx0XHRlbHNlIGlmIHQgaXMgXCJ3b3JrZmxvdy5wcm9mZXNzaW9uYWxcIlxuXHRcdFx0ZCA9IFRBUGkxOG4uX18oJ2JpbGxpbmdfdHJhbkRldGFpbC53b3JrZmxvdycpXG5cdFx0ZWxzZSBpZiB0IGlzIFwiY2hhdC5wcm9mZXNzaW9uYWxcIlxuXHRcdFx0ZCA9IFRBUGkxOG4uX18oJ2JpbGxpbmdfdHJhbkRldGFpbC5jaGF0Jylcblx0XHRlbHNlXG5cdFx0XHRkID0gdFxuXG5cdFx0cmV0dXJuIGRcblxuaWYgTWV0ZW9yLmlzU2VydmVyXG5cdGRiLmJpbGxpbmdzLl9lbnN1cmVJbmRleCh7XG5cdFx0XCJzcGFjZVwiOiAxXG5cdH0se2JhY2tncm91bmQ6IHRydWV9KSIsImRiLmJpbGxpbmdzID0gbmV3IE1ldGVvci5Db2xsZWN0aW9uKCdiaWxsaW5ncycpO1xuXG5kYi5iaWxsaW5ncy5oZWxwZXJzKHtcbiAgdHJhbnNhY3Rpb25faTE4bjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGQsIHQ7XG4gICAgdCA9IHRoaXMudHJhbnNhY3Rpb247XG4gICAgZCA9IFwiXCI7XG4gICAgaWYgKHQgPT09IFwiU3RhcnRpbmcgYmFsYW5jZVwiKSB7XG4gICAgICBkID0gVEFQaTE4bi5fXygnYmlsbGluZ190cmFuRGV0YWlsLnN0YXJ0aW5nJyk7XG4gICAgfSBlbHNlIGlmICh0ID09PSBcIlBheW1lbnRcIikge1xuICAgICAgZCA9IFRBUGkxOG4uX18oJ2JpbGxpbmdfdHJhbkRldGFpbC5wYXltZW50Jyk7XG4gICAgfSBlbHNlIGlmICh0ID09PSBcIlNlcnZpY2UgYWRqdXN0bWVudFwiKSB7XG4gICAgICBkID0gVEFQaTE4bi5fXygnYmlsbGluZ190cmFuRGV0YWlsLmFkanVzdG1lbnQnKTtcbiAgICB9IGVsc2UgaWYgKHQgPT09IFwid29ya2Zsb3dcIikge1xuICAgICAgZCA9IFRBUGkxOG4uX18oJ2JpbGxpbmdfdHJhbkRldGFpbC53b3JrZmxvdycpO1xuICAgIH0gZWxzZSBpZiAodCA9PT0gXCJ3b3JrZmxvdy5wcm9mZXNzaW9uYWxcIikge1xuICAgICAgZCA9IFRBUGkxOG4uX18oJ2JpbGxpbmdfdHJhbkRldGFpbC53b3JrZmxvdycpO1xuICAgIH0gZWxzZSBpZiAodCA9PT0gXCJjaGF0LnByb2Zlc3Npb25hbFwiKSB7XG4gICAgICBkID0gVEFQaTE4bi5fXygnYmlsbGluZ190cmFuRGV0YWlsLmNoYXQnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZCA9IHQ7XG4gICAgfVxuICAgIHJldHVybiBkO1xuICB9XG59KTtcblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBkYi5iaWxsaW5ncy5fZW5zdXJlSW5kZXgoe1xuICAgIFwic3BhY2VcIjogMVxuICB9LCB7XG4gICAgYmFja2dyb3VuZDogdHJ1ZVxuICB9KTtcbn1cbiIsImRiLmJpbGxpbmdfcGF5X3JlY29yZHMgPSBuZXcgTWV0ZW9yLkNvbGxlY3Rpb24oJ2JpbGxpbmdfcGF5X3JlY29yZHMnKVxuXG5kYi5iaWxsaW5nX3BheV9yZWNvcmRzLmhlbHBlcnNcblx0b3JkZXJfY3JlYXRlZDogKCktPlxuXHRcdHJldHVybiBtb21lbnQodGhpcy5jcmVhdGVkKS5mb3JtYXQoJ1lZWVktTU0tREQgSEg6bW06c3MnKVxuXG5cdG9yZGVyX3BhaWQ6ICgpLT5cblx0XHRyZXR1cm4gaWYgdGhpcy5wYWlkIHRoZW4gVEFQaTE4bi5fXyhcImJpbGxpbmcuaGFzX3BhaWRcIikgZWxzZSBUQVBpMThuLl9fKFwiYmlsbGluZy5ub3RfcGFpZFwiKVxuXG5cdG9yZGVyX3RvdGFsX2ZlZTogKCktPlxuXHRcdHJldHVybiAodGhpcy50b3RhbF9mZWUvMTAwKS50b1N0cmluZygpXG5cbkNyZWF0b3IuT2JqZWN0cy5iaWxsaW5nX3BheV9yZWNvcmRzID0gXG5cdG5hbWU6IFwiYmlsbGluZ19wYXlfcmVjb3Jkc1wiXG5cdGxhYmVsOiBcIuiuouWNlVwiXG5cdGljb246IFwiYXBwc1wiXG5cdGZpZWxkczpcblx0XHRpbmZvOlxuXHRcdFx0bGFiZWw6XCLor6bljZXor6bmg4VcIlxuXHRcdFx0dHlwZTogXCJvYmplY3RcIlxuXHRcdFx0YmxhY2tib3g6IHRydWVcblx0XHRcdG9taXQ6IHRydWVcblx0XHRcdGhpZGRlbjogdHJ1ZVxuXHRcdFxuXHRcdHRvdGFsX2ZlZTpcblx0XHRcdGxhYmVsOlwi6YeR6aKd77+lXCJcblx0XHRcdHR5cGU6IFwibnVtYmVyXCJcblx0XHRcdGRlZmF1bHRWYWx1ZTogMTAwXG5cdFx0XHRvbWl0OiB0cnVlXG5cdFx0XG5cdFx0cGFpZDpcblx0XHRcdGxhYmVsOlwi5bey5LuY5qy+XCJcblx0XHRcdHR5cGU6IFwiYm9vbGVhblwiXG5cdFx0XHRvbWl0OiB0cnVlXG5cdFx0XHRkZWZhdWx0VmFsdWU6IGZhbHNlXG5cdFx0XG5cdFx0bW9kdWxlczpcblx0XHRcdGxhYmVsOlwi5qih5Z2XXCJcblx0XHRcdHR5cGU6IFwiW3RleHRdXCJcblx0XHRcdGJsYWNrYm94OiB0cnVlXG5cdFx0XHRvbWl0OiB0cnVlXG5cdFx0XG5cdFx0ZW5kX2RhdGU6XG5cdFx0XHRsYWJlbDpcIuenn+eUqOaXpeacn+iHs1wiXG5cdFx0XHR0eXBlOiBcImRhdGVcIlxuXHRcdFx0b21pdDogdHJ1ZVxuXHRcdFxuXHRcdHVzZXJfY291bnQ6XG5cdFx0XHRsYWJlbDpcIuWQjeminVwiXG5cdFx0XHR0eXBlOiBcIm51bWJlclwiXG5cdFx0XHRvbWl0OiB0cnVlXG5cblx0bGlzdF92aWV3czpcblx0XHRhbGw6XG5cdFx0XHRsYWJlbDogXCLmiYDmnIlcIlxuXHRcdFx0ZmlsdGVyX3Njb3BlOiBcInNwYWNlXCJcblx0XHRcdGNvbHVtbnM6IFtcIm1vZHVsZXNcIiwgXCJ1c2VyX2NvdW50XCIsIFwiZW5kX2RhdGVcIiwgXCJ0b3RhbF9mZWVcIiwgXCJwYWlkXCIsIFwiY3JlYXRlZFwiXVxuXHRcblx0cGVybWlzc2lvbl9zZXQ6XG5cdFx0dXNlcjpcblx0XHRcdGFsbG93Q3JlYXRlOiBmYWxzZVxuXHRcdFx0YWxsb3dEZWxldGU6IGZhbHNlXG5cdFx0XHRhbGxvd0VkaXQ6IGZhbHNlXG5cdFx0XHRhbGxvd1JlYWQ6IGZhbHNlXG5cdFx0XHRtb2RpZnlBbGxSZWNvcmRzOiBmYWxzZVxuXHRcdFx0dmlld0FsbFJlY29yZHM6IGZhbHNlIFxuXHRcdGFkbWluOlxuXHRcdFx0YWxsb3dDcmVhdGU6IGZhbHNlXG5cdFx0XHRhbGxvd0RlbGV0ZTogZmFsc2Vcblx0XHRcdGFsbG93RWRpdDogZmFsc2Vcblx0XHRcdGFsbG93UmVhZDogdHJ1ZVxuXHRcdFx0bW9kaWZ5QWxsUmVjb3JkczogZmFsc2Vcblx0XHRcdHZpZXdBbGxSZWNvcmRzOiB0cnVlIiwiZGIuYmlsbGluZ19wYXlfcmVjb3JkcyA9IG5ldyBNZXRlb3IuQ29sbGVjdGlvbignYmlsbGluZ19wYXlfcmVjb3JkcycpO1xuXG5kYi5iaWxsaW5nX3BheV9yZWNvcmRzLmhlbHBlcnMoe1xuICBvcmRlcl9jcmVhdGVkOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gbW9tZW50KHRoaXMuY3JlYXRlZCkuZm9ybWF0KCdZWVlZLU1NLUREIEhIOm1tOnNzJyk7XG4gIH0sXG4gIG9yZGVyX3BhaWQ6IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLnBhaWQpIHtcbiAgICAgIHJldHVybiBUQVBpMThuLl9fKFwiYmlsbGluZy5oYXNfcGFpZFwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFRBUGkxOG4uX18oXCJiaWxsaW5nLm5vdF9wYWlkXCIpO1xuICAgIH1cbiAgfSxcbiAgb3JkZXJfdG90YWxfZmVlOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKHRoaXMudG90YWxfZmVlIC8gMTAwKS50b1N0cmluZygpO1xuICB9XG59KTtcblxuQ3JlYXRvci5PYmplY3RzLmJpbGxpbmdfcGF5X3JlY29yZHMgPSB7XG4gIG5hbWU6IFwiYmlsbGluZ19wYXlfcmVjb3Jkc1wiLFxuICBsYWJlbDogXCLorqLljZVcIixcbiAgaWNvbjogXCJhcHBzXCIsXG4gIGZpZWxkczoge1xuICAgIGluZm86IHtcbiAgICAgIGxhYmVsOiBcIuivpuWNleivpuaDhVwiLFxuICAgICAgdHlwZTogXCJvYmplY3RcIixcbiAgICAgIGJsYWNrYm94OiB0cnVlLFxuICAgICAgb21pdDogdHJ1ZSxcbiAgICAgIGhpZGRlbjogdHJ1ZVxuICAgIH0sXG4gICAgdG90YWxfZmVlOiB7XG4gICAgICBsYWJlbDogXCLph5Hpop3vv6VcIixcbiAgICAgIHR5cGU6IFwibnVtYmVyXCIsXG4gICAgICBkZWZhdWx0VmFsdWU6IDEwMCxcbiAgICAgIG9taXQ6IHRydWVcbiAgICB9LFxuICAgIHBhaWQ6IHtcbiAgICAgIGxhYmVsOiBcIuW3suS7mOasvlwiLFxuICAgICAgdHlwZTogXCJib29sZWFuXCIsXG4gICAgICBvbWl0OiB0cnVlLFxuICAgICAgZGVmYXVsdFZhbHVlOiBmYWxzZVxuICAgIH0sXG4gICAgbW9kdWxlczoge1xuICAgICAgbGFiZWw6IFwi5qih5Z2XXCIsXG4gICAgICB0eXBlOiBcIlt0ZXh0XVwiLFxuICAgICAgYmxhY2tib3g6IHRydWUsXG4gICAgICBvbWl0OiB0cnVlXG4gICAgfSxcbiAgICBlbmRfZGF0ZToge1xuICAgICAgbGFiZWw6IFwi56ef55So5pel5pyf6IezXCIsXG4gICAgICB0eXBlOiBcImRhdGVcIixcbiAgICAgIG9taXQ6IHRydWVcbiAgICB9LFxuICAgIHVzZXJfY291bnQ6IHtcbiAgICAgIGxhYmVsOiBcIuWQjeminVwiLFxuICAgICAgdHlwZTogXCJudW1iZXJcIixcbiAgICAgIG9taXQ6IHRydWVcbiAgICB9XG4gIH0sXG4gIGxpc3Rfdmlld3M6IHtcbiAgICBhbGw6IHtcbiAgICAgIGxhYmVsOiBcIuaJgOaciVwiLFxuICAgICAgZmlsdGVyX3Njb3BlOiBcInNwYWNlXCIsXG4gICAgICBjb2x1bW5zOiBbXCJtb2R1bGVzXCIsIFwidXNlcl9jb3VudFwiLCBcImVuZF9kYXRlXCIsIFwidG90YWxfZmVlXCIsIFwicGFpZFwiLCBcImNyZWF0ZWRcIl1cbiAgICB9XG4gIH0sXG4gIHBlcm1pc3Npb25fc2V0OiB7XG4gICAgdXNlcjoge1xuICAgICAgYWxsb3dDcmVhdGU6IGZhbHNlLFxuICAgICAgYWxsb3dEZWxldGU6IGZhbHNlLFxuICAgICAgYWxsb3dFZGl0OiBmYWxzZSxcbiAgICAgIGFsbG93UmVhZDogZmFsc2UsXG4gICAgICBtb2RpZnlBbGxSZWNvcmRzOiBmYWxzZSxcbiAgICAgIHZpZXdBbGxSZWNvcmRzOiBmYWxzZVxuICAgIH0sXG4gICAgYWRtaW46IHtcbiAgICAgIGFsbG93Q3JlYXRlOiBmYWxzZSxcbiAgICAgIGFsbG93RGVsZXRlOiBmYWxzZSxcbiAgICAgIGFsbG93RWRpdDogZmFsc2UsXG4gICAgICBhbGxvd1JlYWQ6IHRydWUsXG4gICAgICBtb2RpZnlBbGxSZWNvcmRzOiBmYWxzZSxcbiAgICAgIHZpZXdBbGxSZWNvcmRzOiB0cnVlXG4gICAgfVxuICB9XG59O1xuIiwiZGIubW9kdWxlcyA9IG5ldyBNZXRlb3IuQ29sbGVjdGlvbignbW9kdWxlcycpIiwiZGIubW9kdWxlc19jaGFuZ2Vsb2dzID0gbmV3IE1ldGVvci5Db2xsZWN0aW9uKCdtb2R1bGVzX2NoYW5nZWxvZ3MnKSIsImRiLnVzZXJzX2NoYW5nZWxvZ3MgPSBuZXcgTWV0ZW9yLkNvbGxlY3Rpb24oJ3VzZXJzX2NoYW5nZWxvZ3MnKVxuXG5kYi51c2Vyc19jaGFuZ2Vsb2dzLl9zaW1wbGVTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hXG4gICMg5pel5pyf77yM6K6w5b2V5LqL5Lu25Y+R55Sf55qE5pe26Ze077yM5qC85byP77yaWVlZWU1NRERcbiAgY2hhbmdlX2RhdGU6XG4gICAgdHlwZTogRGF0ZVxuICAjIOaTjeS9nOiAhVxuICBvcGVyYXRvcjpcbiAgICB0eXBlOiBTdHJpbmdcbiAgIyDlt6XkvZzljLpcbiAgc3BhY2U6XG4gICAgdHlwZTogU3RyaW5nXG4gICMgYWRk77yI5aKe5Yqg77yJZGVsZXRl77yI5Yig6Zmk77yJZW5hYmxl77yI5ZCv55So77yJZGlzYWJsZe+8iOWBnOeUqO+8iVxuICBvcGVyYXRpb246XG4gICAgdHlwZTogU3RyaW5nXG4gICMg5a+56LGh77yMdXNlcl9pZFxuICB1c2VyOlxuICAgIHR5cGU6IFN0cmluZ1xuICAjIOW3peS9nOWMuuS4reWQr+eUqOeahOeUqOaIt+aVsFxuICB1c2VyX2NvdW50OlxuICAgIHR5cGU6IE51bWJlclxuICAjIOWIm+W7uuaXtumXtFxuICBjcmVhdGVkOlxuICAgIHR5cGU6IERhdGVcbiAgIyDliJvlu7rkurpcbiAgY3JlYXRlZF9ieTpcbiAgICB0eXBlOiBTdHJpbmdcblxuXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcbiAgZGIudXNlcnNfY2hhbmdlbG9ncy5iZWZvcmUuaW5zZXJ0ICh1c2VySWQsIGRvYykgLT5cbiAgICBkb2MuY2hhbmdlX2RhdGUgPSBtb21lbnQoKS5mb3JtYXQoJ1lZWVlNTUREJyk7XG4gICAgZG9jLmNyZWF0ZWQgPSBuZXcgRGF0ZSgpO1xuICAgIGRvYy5jcmVhdGVkX2J5ID0gdXNlcklkO1xuXG4iLCJkYi51c2Vyc19jaGFuZ2Vsb2dzID0gbmV3IE1ldGVvci5Db2xsZWN0aW9uKCd1c2Vyc19jaGFuZ2Vsb2dzJyk7XG5cbmRiLnVzZXJzX2NoYW5nZWxvZ3MuX3NpbXBsZVNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBjaGFuZ2VfZGF0ZToge1xuICAgIHR5cGU6IERhdGVcbiAgfSxcbiAgb3BlcmF0b3I6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgc3BhY2U6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgb3BlcmF0aW9uOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIHVzZXI6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgdXNlcl9jb3VudDoge1xuICAgIHR5cGU6IE51bWJlclxuICB9LFxuICBjcmVhdGVkOiB7XG4gICAgdHlwZTogRGF0ZVxuICB9LFxuICBjcmVhdGVkX2J5OiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH1cbn0pO1xuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIGRiLnVzZXJzX2NoYW5nZWxvZ3MuYmVmb3JlLmluc2VydChmdW5jdGlvbih1c2VySWQsIGRvYykge1xuICAgIGRvYy5jaGFuZ2VfZGF0ZSA9IG1vbWVudCgpLmZvcm1hdCgnWVlZWU1NREQnKTtcbiAgICBkb2MuY3JlYXRlZCA9IG5ldyBEYXRlKCk7XG4gICAgcmV0dXJuIGRvYy5jcmVhdGVkX2J5ID0gdXNlcklkO1xuICB9KTtcbn1cbiIsImRiLnN0ZWVkb3Nfc3RhdGlzdGljcyA9IG5ldyBNZXRlb3IuQ29sbGVjdGlvbignc3RlZWRvc19zdGF0aXN0aWNzJylcbiJdfQ==
