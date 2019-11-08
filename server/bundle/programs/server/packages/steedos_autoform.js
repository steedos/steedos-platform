(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var _ = Package.underscore._;
var ReactiveVar = Package['reactive-var'].ReactiveVar;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var ECMAScript = Package.ecmascript.ECMAScript;
var Random = Package.random.Random;
var DDP = Package['ddp-client'].DDP;
var DDPServer = Package['ddp-server'].DDPServer;
var check = Package.check.check;
var Match = Package.check.Match;
var DDPRateLimiter = Package['ddp-rate-limiter'].DDPRateLimiter;
var CollectionHooks = Package['matb33:collection-hooks'].CollectionHooks;
var FlowRouter = Package['kadira:flow-router'].FlowRouter;
var SubsManager = Package['meteorhacks:subs-manager'].SubsManager;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;
var SimpleSchema = Package['aldeed:simple-schema'].SimpleSchema;
var MongoObject = Package['aldeed:simple-schema'].MongoObject;
var Tabular = Package['aldeed:tabular'].Tabular;
var moment = Package['momentjs:moment'].moment;
var JsonRoutes = Package['simple:json-routes'].JsonRoutes;
var RestMiddleware = Package['simple:json-routes'].RestMiddleware;
var _i18n = Package['universe:i18n']._i18n;
var i18n = Package['universe:i18n'].i18n;
var ServerSession = Package['steedos:base'].ServerSession;
var Selector = Package['steedos:base'].Selector;
var Steedos = Package['steedos:base'].Steedos;
var AjaxCollection = Package['steedos:base'].AjaxCollection;
var SteedosDataManager = Package['steedos:base'].SteedosDataManager;
var SteedosOffice = Package['steedos:base'].SteedosOffice;
var billingManager = Package['steedos:base'].billingManager;
var Sortable = Package['rubaxa:sortable'].Sortable;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var Blaze = Package.ui.Blaze;
var UI = Package.ui.UI;
var Handlebars = Package.ui.Handlebars;
var Spacebars = Package.spacebars.Spacebars;
var meteorInstall = Package.modules.meteorInstall;
var HTML = Package.htmljs.HTML;

/* Package-scope variables */
var __coffeescriptShare, CFDataManager;

var require = meteorInstall({"node_modules":{"meteor":{"steedos:autoform":{"i18n":{"en.i18n.json.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                       //
// packages/steedos_autoform/i18n/en.i18n.json.js                                                        //
//                                                                                                       //
///////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                         //
Package['universe:i18n'].i18n.addTranslations('en','',{"coreform_select":"Please select ","coreform_select_user_title":"Please select user","coreform_select_org_title":"Please select organization"});
///////////////////////////////////////////////////////////////////////////////////////////////////////////

},"zh-CN.i18n.json.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                       //
// packages/steedos_autoform/i18n/zh-CN.i18n.json.js                                                     //
//                                                                                                       //
///////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                         //
Package['universe:i18n'].i18n.addTranslations('zh-CN','',{"coreform_select":"请选择","coreform_select_user_title":"请选择人员","coreform_select_org_title":"请选择部门"});
///////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"client":{"core.coffee":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                       //
// packages/steedos_autoform/client/core.coffee                                                          //
//                                                                                                       //
///////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                         //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
this.TabularTables = {};
Meteor.startup(function () {
  return SimpleSchema.extendOptions({
    beforeOpenFunction: Match.Optional(Match.OneOf(Function, String))
  });
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////

},"coreform":{"inputTypes":{"coreform-user":{"lib":{"cf_tabular_space_user.coffee":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                       //
// packages/steedos_autoform/client/coreform/inputTypes/coreform-user/lib/cf_tabular_space_user.coffee   //
//                                                                                                       //
///////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                         //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function () {
  return TabularTables.cf_tabular_space_user = new Tabular.Table({
    name: "cf_tabular_space_user",
    collection: db.space_users,
    drawCallback: function (settings) {
      return $("#cf_reverse").attr("checked", false);
    },
    columns: [{
      data: "_id",
      title: '<input type="checkbox" name="cf_reverse" id="cf_reverse">',
      orderable: false,
      width: '10px',
      render: function (val, type, doc) {
        var input, inputType, ref, ref1, ref2;
        inputType = "checkbox";

        if (!((ref = TabularTables.cf_tabular_space_user.customData) != null ? ref.multiple : void 0)) {
          inputType = "radio";
        }

        input = '<input type="' + inputType + '" class="list_checkbox" name="cf_contacts_ids" id="' + doc.user + '" value="' + doc.user + '" data-name="' + doc.name + '" data-email="' + doc.email + '"';

        if ((ref1 = TabularTables.cf_tabular_space_user.customData) != null ? (ref2 = ref1.defaultValues) != null ? ref2.includes(doc.user) : void 0 : void 0) {
          input += " checked ";
        }

        input += ">";
        return input;
      }
    }, {
      data: "name",
      orderable: false,
      render: function (val, type, doc) {
        return "<label data-user='" + doc.user + "' class='for-input'><div class='user-name'><img src='" + Steedos.absoluteUrl() + "avatar/" + doc.user + "?w=28&h=25&fs=14" + "' class='selectTag-profile img-circle'><font>" + doc.name + "</font></div></label>";
      }
    }, {
      data: "sort_no",
      title: "",
      orderable: true,
      visible: false
    }, {
      data: "name",
      title: "",
      orderable: true,
      visible: false
    }, {
      data: "email",
      title: "",
      orderable: false,
      visible: false
    }],
    onUnload: function () {
      return console.log("onUnload ok....");
    },
    dom: "tp",
    order: [[2, "desc"], [3, "asc"]],
    extraFields: ["_id", "name", "user", "sort_no", "email"],
    lengthChange: false,
    pageLength: 100,
    info: false,
    searching: true,
    responsive: {
      details: false
    },
    autoWidth: false,
    changeSelector: function (selector, userId) {
      var ref, space, space_user;

      if (!userId) {
        return {
          _id: -1
        };
      }

      space = selector.space;

      if (!space) {
        if ((selector != null ? (ref = selector.$and) != null ? ref.length : void 0 : void 0) > 0) {
          space = selector.$and.getProperty('space')[0];
        }
      }

      if (!space) {
        return {
          _id: -1
        };
      }

      space_user = db.space_users.findOne({
        user: userId,
        space: space
      }, {
        fields: {
          _id: 1
        }
      });

      if (!space_user) {
        return {
          _id: -1
        };
      }

      return selector;
    },
    pagingType: "numbers"
  });
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}},"routes":{"formula_space_users.coffee":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                       //
// packages/steedos_autoform/routes/formula_space_users.coffee                                           //
//                                                                                                       //
///////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                         //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function () {
  return JsonRoutes.add("post", "/api/formula/space_users", function (req, res, next) {
    var data, query, selected, spaceId, spaceUsers, space_users, userIds;
    userIds = req.body.userIds;
    spaceId = req.query.spaceId;
    spaceUsers = [];
    data = [];

    if (userIds) {
      if (!userIds instanceof Array) {
        userIds = [userIds];
      }

      query = {
        user: {
          $in: userIds
        }
      };

      if (spaceId) {
        query.space = spaceId;
      }

      space_users = db.space_users.find(query).fetch();
      selected = [];
      space_users.forEach(function (u) {
        var fu, u_org, u_orgs, user_flow_positions, user_role_ids, user_roles;

        if (selected.indexOf(u.user) < 0) {
          fu = {};
          fu.id = u.user;
          fu.name = u.name;
          fu.sort_no = u.sort_no;
          fu.mobile = u.mobile;
          fu.work_phone = u.work_phone;
          fu.position = u.position;
          u_org = db.organizations.findOne({
            _id: u.organization
          }, {
            fields: {
              name: 1,
              fullname: 1
            }
          });
          u_orgs = db.organizations.find({
            _id: {
              $in: u.organizations
            }
          }, {
            fields: {
              name: 1,
              fullname: 1
            }
          }).fetch();
          fu.organization = {
            name: u_org != null ? u_org.name : void 0,
            fullname: u_org != null ? u_org.fullname : void 0
          };
          fu.organizations = {
            name: u_orgs != null ? u_orgs.getProperty("name") : void 0,
            fullname: u_orgs != null ? u_orgs.getProperty("fullname") : void 0
          };
          fu.hr = u.hr || {};

          if (db.flow_positions && db.flow_roles) {
            user_flow_positions = db.flow_positions.find({
              space: u.space,
              users: u.user
            }, {
              fields: {
                role: 1
              }
            }).fetch();
            user_role_ids = user_flow_positions.getProperty("role");
            user_roles = db.flow_roles.find({
              _id: {
                $in: user_role_ids
              }
            }, {
              fields: {
                name: 1
              }
            }).fetch();
            fu.roles = user_roles.getProperty("name");
          }

          data.push(fu);
          return selected.push(u.user);
        }
      });
      userIds.forEach(function (uId) {
        return spaceUsers.push(_.find(data, function (su) {
          return su.id === uId;
        }));
      });
    }

    return JsonRoutes.sendResult(res, {
      code: 200,
      data: {
        'spaceUsers': spaceUsers
      }
    });
  });
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////

},"formula_organizations.coffee":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                       //
// packages/steedos_autoform/routes/formula_organizations.coffee                                         //
//                                                                                                       //
///////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                         //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function () {
  return JsonRoutes.add("post", "/api/formula/organizations", function (req, res, next) {
    var data, orgIds, orgs, query, res_orgs, spaceId;
    res_orgs = [];
    data = [];
    orgIds = req.body.orgIds;
    spaceId = req.query.spaceId;

    if (orgIds) {
      if (!orgIds instanceof Array) {
        orgIds = [orgIds];
      }

      query = {
        _id: {
          $in: orgIds
        }
      };

      if (spaceId) {
        query.space = spaceId;
      }

      orgs = db.organizations.find(query, {
        fields: {
          name: 1,
          fullname: 1
        }
      }).fetch();
      orgs.forEach(function (org) {
        return data.push({
          id: org._id,
          name: org.name,
          fullname: org.fullname
        });
      });
      orgIds.forEach(function (oId) {
        return res_orgs.push(_.find(data, function (o) {
          return o.id === oId;
        }));
      });
    }

    return JsonRoutes.sendResult(res, {
      code: 200,
      data: {
        'orgs': res_orgs
      }
    });
  });
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}},{
  "extensions": [
    ".js",
    ".json",
    ".i18n.json",
    ".coffee"
  ]
});

require("/node_modules/meteor/steedos:autoform/i18n/en.i18n.json.js");
require("/node_modules/meteor/steedos:autoform/i18n/zh-CN.i18n.json.js");
require("/node_modules/meteor/steedos:autoform/client/core.coffee");
require("/node_modules/meteor/steedos:autoform/client/coreform/inputTypes/coreform-user/lib/cf_tabular_space_user.coffee");
require("/node_modules/meteor/steedos:autoform/routes/formula_space_users.coffee");
require("/node_modules/meteor/steedos:autoform/routes/formula_organizations.coffee");

/* Exports */
Package._define("steedos:autoform", {
  CFDataManager: CFDataManager
});

})();

//# sourceURL=meteor://💻app/packages/steedos_autoform.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hdXRvZm9ybS9jbGllbnQvY29yZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2NsaWVudC9jb3JlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hdXRvZm9ybS9jbGllbnQvY29yZWZvcm0vaW5wdXRUeXBlcy9jb3JlZm9ybS11c2VyL2xpYi9jZl90YWJ1bGFyX3NwYWNlX3VzZXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9jbGllbnQvY29yZWZvcm0vaW5wdXRUeXBlcy9jb3JlZm9ybS11c2VyL2xpYi9jZl90YWJ1bGFyX3NwYWNlX3VzZXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2F1dG9mb3JtL3JvdXRlcy9mb3JtdWxhX3NwYWNlX3VzZXJzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcm91dGVzL2Zvcm11bGFfc3BhY2VfdXNlcnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2F1dG9mb3JtL3JvdXRlcy9mb3JtdWxhX29yZ2FuaXphdGlvbnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9yb3V0ZXMvZm9ybXVsYV9vcmdhbml6YXRpb25zLmNvZmZlZSJdLCJuYW1lcyI6WyJUYWJ1bGFyVGFibGVzIiwiTWV0ZW9yIiwic3RhcnR1cCIsIlNpbXBsZVNjaGVtYSIsImV4dGVuZE9wdGlvbnMiLCJiZWZvcmVPcGVuRnVuY3Rpb24iLCJNYXRjaCIsIk9wdGlvbmFsIiwiT25lT2YiLCJGdW5jdGlvbiIsIlN0cmluZyIsImNmX3RhYnVsYXJfc3BhY2VfdXNlciIsIlRhYnVsYXIiLCJUYWJsZSIsIm5hbWUiLCJjb2xsZWN0aW9uIiwiZGIiLCJzcGFjZV91c2VycyIsImRyYXdDYWxsYmFjayIsInNldHRpbmdzIiwiJCIsImF0dHIiLCJjb2x1bW5zIiwiZGF0YSIsInRpdGxlIiwib3JkZXJhYmxlIiwid2lkdGgiLCJyZW5kZXIiLCJ2YWwiLCJ0eXBlIiwiZG9jIiwiaW5wdXQiLCJpbnB1dFR5cGUiLCJyZWYiLCJyZWYxIiwicmVmMiIsImN1c3RvbURhdGEiLCJtdWx0aXBsZSIsInVzZXIiLCJlbWFpbCIsImRlZmF1bHRWYWx1ZXMiLCJpbmNsdWRlcyIsIlN0ZWVkb3MiLCJhYnNvbHV0ZVVybCIsInZpc2libGUiLCJvblVubG9hZCIsImNvbnNvbGUiLCJsb2ciLCJkb20iLCJvcmRlciIsImV4dHJhRmllbGRzIiwibGVuZ3RoQ2hhbmdlIiwicGFnZUxlbmd0aCIsImluZm8iLCJzZWFyY2hpbmciLCJyZXNwb25zaXZlIiwiZGV0YWlscyIsImF1dG9XaWR0aCIsImNoYW5nZVNlbGVjdG9yIiwic2VsZWN0b3IiLCJ1c2VySWQiLCJzcGFjZSIsInNwYWNlX3VzZXIiLCJfaWQiLCIkYW5kIiwibGVuZ3RoIiwiZ2V0UHJvcGVydHkiLCJmaW5kT25lIiwiZmllbGRzIiwicGFnaW5nVHlwZSIsIkpzb25Sb3V0ZXMiLCJhZGQiLCJyZXEiLCJyZXMiLCJuZXh0IiwicXVlcnkiLCJzZWxlY3RlZCIsInNwYWNlSWQiLCJzcGFjZVVzZXJzIiwidXNlcklkcyIsImJvZHkiLCJBcnJheSIsIiRpbiIsImZpbmQiLCJmZXRjaCIsImZvckVhY2giLCJ1IiwiZnUiLCJ1X29yZyIsInVfb3JncyIsInVzZXJfZmxvd19wb3NpdGlvbnMiLCJ1c2VyX3JvbGVfaWRzIiwidXNlcl9yb2xlcyIsImluZGV4T2YiLCJpZCIsInNvcnRfbm8iLCJtb2JpbGUiLCJ3b3JrX3Bob25lIiwicG9zaXRpb24iLCJvcmdhbml6YXRpb25zIiwib3JnYW5pemF0aW9uIiwiZnVsbG5hbWUiLCJociIsImZsb3dfcG9zaXRpb25zIiwiZmxvd19yb2xlcyIsInVzZXJzIiwicm9sZSIsInJvbGVzIiwicHVzaCIsInVJZCIsIl8iLCJzdSIsInNlbmRSZXN1bHQiLCJjb2RlIiwib3JnSWRzIiwib3JncyIsInJlc19vcmdzIiwib3JnIiwib0lkIiwibyJd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O0FEckNILElDQUM7QURERixHIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX2F1dG9mb3JtLmpzIiwic291cmNlc0NvbnRlbnQiOlsiQFRhYnVsYXJUYWJsZXMgPSB7fTtcblxuXG5NZXRlb3Iuc3RhcnR1cCAtPlxuXHRTaW1wbGVTY2hlbWEuZXh0ZW5kT3B0aW9ucyh7YmVmb3JlT3BlbkZ1bmN0aW9uOiBNYXRjaC5PcHRpb25hbChNYXRjaC5PbmVPZihGdW5jdGlvbiwgU3RyaW5nKSl9KSIsInRoaXMuVGFidWxhclRhYmxlcyA9IHt9O1xuXG5NZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIFNpbXBsZVNjaGVtYS5leHRlbmRPcHRpb25zKHtcbiAgICBiZWZvcmVPcGVuRnVuY3Rpb246IE1hdGNoLk9wdGlvbmFsKE1hdGNoLk9uZU9mKEZ1bmN0aW9uLCBTdHJpbmcpKVxuICB9KTtcbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgKCktPlxuXHRUYWJ1bGFyVGFibGVzLmNmX3RhYnVsYXJfc3BhY2VfdXNlciA9IG5ldyBUYWJ1bGFyLlRhYmxlKHtcblx0XHRuYW1lOiBcImNmX3RhYnVsYXJfc3BhY2VfdXNlclwiLFxuXHRcdGNvbGxlY3Rpb246IGRiLnNwYWNlX3VzZXJzLFxuXHRcdGRyYXdDYWxsYmFjazogKHNldHRpbmdzKS0+XG5cdFx0XHQkKFwiI2NmX3JldmVyc2VcIikuYXR0cihcImNoZWNrZWRcIiwgZmFsc2UpXG5cdFx0Y29sdW1uczogW1xuXHRcdFx0e1xuXHRcdFx0XHRkYXRhOiBcIl9pZFwiLFxuXHRcdFx0XHR0aXRsZTogJzxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBuYW1lPVwiY2ZfcmV2ZXJzZVwiIGlkPVwiY2ZfcmV2ZXJzZVwiPicsXG5cdFx0XHRcdG9yZGVyYWJsZTogZmFsc2UsXG5cdFx0XHRcdHdpZHRoOicxMHB4Jyxcblx0XHRcdFx0cmVuZGVyOiAgKHZhbCwgdHlwZSwgZG9jKSAtPlxuXG5cdFx0XHRcdFx0aW5wdXRUeXBlID0gXCJjaGVja2JveFwiO1xuXG5cdFx0XHRcdFx0aWYgIVRhYnVsYXJUYWJsZXMuY2ZfdGFidWxhcl9zcGFjZV91c2VyLmN1c3RvbURhdGE/Lm11bHRpcGxlXG5cdFx0XHRcdFx0XHRpbnB1dFR5cGUgPSBcInJhZGlvXCJcblxuXHRcdFx0XHRcdGlucHV0ID0gJzxpbnB1dCB0eXBlPVwiJyArIGlucHV0VHlwZSArICdcIiBjbGFzcz1cImxpc3RfY2hlY2tib3hcIiBuYW1lPVwiY2ZfY29udGFjdHNfaWRzXCIgaWQ9XCInICsgZG9jLnVzZXIgKyAnXCIgdmFsdWU9XCInICsgZG9jLnVzZXIgKyAnXCIgZGF0YS1uYW1lPVwiJyArIGRvYy5uYW1lICsgJ1wiIGRhdGEtZW1haWw9XCInICsgZG9jLmVtYWlsICsgJ1wiJztcblxuXHRcdFx0XHRcdGlmIFRhYnVsYXJUYWJsZXMuY2ZfdGFidWxhcl9zcGFjZV91c2VyLmN1c3RvbURhdGE/LmRlZmF1bHRWYWx1ZXM/LmluY2x1ZGVzKGRvYy51c2VyKVxuXHRcdFx0XHRcdFx0aW5wdXQgKz0gXCIgY2hlY2tlZCBcIlxuXG5cdFx0XHRcdFx0aW5wdXQgKz0gXCI+XCJcblx0XHRcdFx0XHRyZXR1cm4gaW5wdXRcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdGRhdGE6IFwibmFtZVwiLFxuXHRcdFx0XHRvcmRlcmFibGU6IGZhbHNlLFxuXHRcdFx0XHRyZW5kZXI6ICAodmFsLCB0eXBlLCBkb2MpIC0+XG5cdFx0XHRcdFx0cmV0dXJuIFwiPGxhYmVsIGRhdGEtdXNlcj0nXCIgKyBkb2MudXNlciArIFwiJyBjbGFzcz0nZm9yLWlucHV0Jz48ZGl2IGNsYXNzPSd1c2VyLW5hbWUnPjxpbWcgc3JjPSdcIiArIFN0ZWVkb3MuYWJzb2x1dGVVcmwoKSArIFwiYXZhdGFyL1wiK2RvYy51c2VyK1wiP3c9MjgmaD0yNSZmcz0xNFwiICtcIicgY2xhc3M9J3NlbGVjdFRhZy1wcm9maWxlIGltZy1jaXJjbGUnPjxmb250PlwiICsgZG9jLm5hbWUgKyBcIjwvZm9udD48L2Rpdj48L2xhYmVsPlwiXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRkYXRhOiBcInNvcnRfbm9cIixcblx0XHRcdFx0dGl0bGU6IFwiXCIsXG5cdFx0XHRcdG9yZGVyYWJsZTogdHJ1ZSxcblx0XHRcdFx0dmlzaWJsZTogZmFsc2Vcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdGRhdGE6IFwibmFtZVwiLFxuXHRcdFx0XHR0aXRsZTogXCJcIixcblx0XHRcdFx0b3JkZXJhYmxlOiB0cnVlLFxuXHRcdFx0XHR2aXNpYmxlOiBmYWxzZVxuXHRcdFx0fSx7XG5cdFx0XHRcdGRhdGE6IFwiZW1haWxcIixcblx0XHRcdFx0dGl0bGU6IFwiXCIsXG5cdFx0XHRcdG9yZGVyYWJsZTogZmFsc2UsXG5cdFx0XHRcdHZpc2libGU6IGZhbHNlXG5cdFx0XHR9XG5cdFx0XSxcblx0XHRvblVubG9hZDooKSAtPlxuXHRcdFx0cmV0dXJuIGNvbnNvbGUubG9nKFwib25VbmxvYWQgb2suLi4uXCIpO1xuI3NlbGVjdDpcbiMgIHN0eWxlOiAnc2luZ2xlJ1xuXHRcdGRvbTogXCJ0cFwiLFxuXHRcdG9yZGVyOltbMixcImRlc2NcIl0sWzMsXCJhc2NcIl1dLFxuXHRcdGV4dHJhRmllbGRzOiBbXCJfaWRcIiwgXCJuYW1lXCIsIFwidXNlclwiLCBcInNvcnRfbm9cIiwgXCJlbWFpbFwiXSxcblx0XHRsZW5ndGhDaGFuZ2U6IGZhbHNlLFxuXHRcdHBhZ2VMZW5ndGg6IDEwMCxcblx0XHRpbmZvOiBmYWxzZSxcblx0XHRzZWFyY2hpbmc6IHRydWUsXG5cdFx0cmVzcG9uc2l2ZTpcblx0XHRcdGRldGFpbHM6IGZhbHNlXG5cdFx0YXV0b1dpZHRoOiBmYWxzZSxcblx0XHRjaGFuZ2VTZWxlY3RvcjogKHNlbGVjdG9yLCB1c2VySWQpIC0+XG5cdFx0XHR1bmxlc3MgdXNlcklkXG5cdFx0XHRcdHJldHVybiB7X2lkOiAtMX1cblx0XHRcdHNwYWNlID0gc2VsZWN0b3Iuc3BhY2Vcblx0XHRcdHVubGVzcyBzcGFjZVxuXHRcdFx0XHRpZiBzZWxlY3Rvcj8uJGFuZD8ubGVuZ3RoID4gMFxuXHRcdFx0XHRcdHNwYWNlID0gc2VsZWN0b3IuJGFuZC5nZXRQcm9wZXJ0eSgnc3BhY2UnKVswXVxuXHRcdFx0dW5sZXNzIHNwYWNlXG5cdFx0XHRcdHJldHVybiB7X2lkOiAtMX1cblx0XHRcdHNwYWNlX3VzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHt1c2VyOiB1c2VySWQsc3BhY2U6c3BhY2V9LCB7ZmllbGRzOiB7X2lkOiAxfX0pXG5cdFx0XHR1bmxlc3Mgc3BhY2VfdXNlclxuXHRcdFx0XHRyZXR1cm4ge19pZDogLTF9XG5cdFx0XHRyZXR1cm4gc2VsZWN0b3JcblxuI3Njcm9sbFk6ICAgICAgICAnNDAwcHgnLFxuI3Njcm9sbENvbGxhcHNlOiB0cnVlLFxuXHRcdHBhZ2luZ1R5cGU6IFwibnVtYmVyc1wiXG5cblx0fSk7XG4iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIFRhYnVsYXJUYWJsZXMuY2ZfdGFidWxhcl9zcGFjZV91c2VyID0gbmV3IFRhYnVsYXIuVGFibGUoe1xuICAgIG5hbWU6IFwiY2ZfdGFidWxhcl9zcGFjZV91c2VyXCIsXG4gICAgY29sbGVjdGlvbjogZGIuc3BhY2VfdXNlcnMsXG4gICAgZHJhd0NhbGxiYWNrOiBmdW5jdGlvbihzZXR0aW5ncykge1xuICAgICAgcmV0dXJuICQoXCIjY2ZfcmV2ZXJzZVwiKS5hdHRyKFwiY2hlY2tlZFwiLCBmYWxzZSk7XG4gICAgfSxcbiAgICBjb2x1bW5zOiBbXG4gICAgICB7XG4gICAgICAgIGRhdGE6IFwiX2lkXCIsXG4gICAgICAgIHRpdGxlOiAnPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIG5hbWU9XCJjZl9yZXZlcnNlXCIgaWQ9XCJjZl9yZXZlcnNlXCI+JyxcbiAgICAgICAgb3JkZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd2lkdGg6ICcxMHB4JyxcbiAgICAgICAgcmVuZGVyOiBmdW5jdGlvbih2YWwsIHR5cGUsIGRvYykge1xuICAgICAgICAgIHZhciBpbnB1dCwgaW5wdXRUeXBlLCByZWYsIHJlZjEsIHJlZjI7XG4gICAgICAgICAgaW5wdXRUeXBlID0gXCJjaGVja2JveFwiO1xuICAgICAgICAgIGlmICghKChyZWYgPSBUYWJ1bGFyVGFibGVzLmNmX3RhYnVsYXJfc3BhY2VfdXNlci5jdXN0b21EYXRhKSAhPSBudWxsID8gcmVmLm11bHRpcGxlIDogdm9pZCAwKSkge1xuICAgICAgICAgICAgaW5wdXRUeXBlID0gXCJyYWRpb1wiO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpbnB1dCA9ICc8aW5wdXQgdHlwZT1cIicgKyBpbnB1dFR5cGUgKyAnXCIgY2xhc3M9XCJsaXN0X2NoZWNrYm94XCIgbmFtZT1cImNmX2NvbnRhY3RzX2lkc1wiIGlkPVwiJyArIGRvYy51c2VyICsgJ1wiIHZhbHVlPVwiJyArIGRvYy51c2VyICsgJ1wiIGRhdGEtbmFtZT1cIicgKyBkb2MubmFtZSArICdcIiBkYXRhLWVtYWlsPVwiJyArIGRvYy5lbWFpbCArICdcIic7XG4gICAgICAgICAgaWYgKChyZWYxID0gVGFidWxhclRhYmxlcy5jZl90YWJ1bGFyX3NwYWNlX3VzZXIuY3VzdG9tRGF0YSkgIT0gbnVsbCA/IChyZWYyID0gcmVmMS5kZWZhdWx0VmFsdWVzKSAhPSBudWxsID8gcmVmMi5pbmNsdWRlcyhkb2MudXNlcikgOiB2b2lkIDAgOiB2b2lkIDApIHtcbiAgICAgICAgICAgIGlucHV0ICs9IFwiIGNoZWNrZWQgXCI7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlucHV0ICs9IFwiPlwiO1xuICAgICAgICAgIHJldHVybiBpbnB1dDtcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBkYXRhOiBcIm5hbWVcIixcbiAgICAgICAgb3JkZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgcmVuZGVyOiBmdW5jdGlvbih2YWwsIHR5cGUsIGRvYykge1xuICAgICAgICAgIHJldHVybiBcIjxsYWJlbCBkYXRhLXVzZXI9J1wiICsgZG9jLnVzZXIgKyBcIicgY2xhc3M9J2Zvci1pbnB1dCc+PGRpdiBjbGFzcz0ndXNlci1uYW1lJz48aW1nIHNyYz0nXCIgKyBTdGVlZG9zLmFic29sdXRlVXJsKCkgKyBcImF2YXRhci9cIiArIGRvYy51c2VyICsgXCI/dz0yOCZoPTI1JmZzPTE0XCIgKyBcIicgY2xhc3M9J3NlbGVjdFRhZy1wcm9maWxlIGltZy1jaXJjbGUnPjxmb250PlwiICsgZG9jLm5hbWUgKyBcIjwvZm9udD48L2Rpdj48L2xhYmVsPlwiO1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGRhdGE6IFwic29ydF9ub1wiLFxuICAgICAgICB0aXRsZTogXCJcIixcbiAgICAgICAgb3JkZXJhYmxlOiB0cnVlLFxuICAgICAgICB2aXNpYmxlOiBmYWxzZVxuICAgICAgfSwge1xuICAgICAgICBkYXRhOiBcIm5hbWVcIixcbiAgICAgICAgdGl0bGU6IFwiXCIsXG4gICAgICAgIG9yZGVyYWJsZTogdHJ1ZSxcbiAgICAgICAgdmlzaWJsZTogZmFsc2VcbiAgICAgIH0sIHtcbiAgICAgICAgZGF0YTogXCJlbWFpbFwiLFxuICAgICAgICB0aXRsZTogXCJcIixcbiAgICAgICAgb3JkZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgdmlzaWJsZTogZmFsc2VcbiAgICAgIH1cbiAgICBdLFxuICAgIG9uVW5sb2FkOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZyhcIm9uVW5sb2FkIG9rLi4uLlwiKTtcbiAgICB9LFxuICAgIGRvbTogXCJ0cFwiLFxuICAgIG9yZGVyOiBbWzIsIFwiZGVzY1wiXSwgWzMsIFwiYXNjXCJdXSxcbiAgICBleHRyYUZpZWxkczogW1wiX2lkXCIsIFwibmFtZVwiLCBcInVzZXJcIiwgXCJzb3J0X25vXCIsIFwiZW1haWxcIl0sXG4gICAgbGVuZ3RoQ2hhbmdlOiBmYWxzZSxcbiAgICBwYWdlTGVuZ3RoOiAxMDAsXG4gICAgaW5mbzogZmFsc2UsXG4gICAgc2VhcmNoaW5nOiB0cnVlLFxuICAgIHJlc3BvbnNpdmU6IHtcbiAgICAgIGRldGFpbHM6IGZhbHNlXG4gICAgfSxcbiAgICBhdXRvV2lkdGg6IGZhbHNlLFxuICAgIGNoYW5nZVNlbGVjdG9yOiBmdW5jdGlvbihzZWxlY3RvciwgdXNlcklkKSB7XG4gICAgICB2YXIgcmVmLCBzcGFjZSwgc3BhY2VfdXNlcjtcbiAgICAgIGlmICghdXNlcklkKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgX2lkOiAtMVxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgc3BhY2UgPSBzZWxlY3Rvci5zcGFjZTtcbiAgICAgIGlmICghc3BhY2UpIHtcbiAgICAgICAgaWYgKChzZWxlY3RvciAhPSBudWxsID8gKHJlZiA9IHNlbGVjdG9yLiRhbmQpICE9IG51bGwgPyByZWYubGVuZ3RoIDogdm9pZCAwIDogdm9pZCAwKSA+IDApIHtcbiAgICAgICAgICBzcGFjZSA9IHNlbGVjdG9yLiRhbmQuZ2V0UHJvcGVydHkoJ3NwYWNlJylbMF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICghc3BhY2UpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBfaWQ6IC0xXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBzcGFjZV91c2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7XG4gICAgICAgIHVzZXI6IHVzZXJJZCxcbiAgICAgICAgc3BhY2U6IHNwYWNlXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGlmICghc3BhY2VfdXNlcikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIF9pZDogLTFcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzZWxlY3RvcjtcbiAgICB9LFxuICAgIHBhZ2luZ1R5cGU6IFwibnVtYmVyc1wiXG4gIH0pO1xufSk7XG4iLCJNZXRlb3Iuc3RhcnR1cCAtPlxuXHRKc29uUm91dGVzLmFkZCBcInBvc3RcIiwgXCIvYXBpL2Zvcm11bGEvc3BhY2VfdXNlcnNcIiwgKHJlcSwgcmVzLCBuZXh0KSAtPlxuXHRcdHVzZXJJZHMgPSByZXEuYm9keS51c2VySWRzXG5cdFx0c3BhY2VJZCA9IHJlcS5xdWVyeS5zcGFjZUlkXG5cblx0XHRzcGFjZVVzZXJzID0gW11cblxuXHRcdGRhdGEgPSBbXVxuXG5cdFx0aWYgKHVzZXJJZHMpXG5cblx0XHRcdGlmIG5vdCB1c2VySWRzIGluc3RhbmNlb2YgQXJyYXlcblx0XHRcdFx0dXNlcklkcyA9IFt1c2VySWRzXVxuXG5cdFx0XHRxdWVyeSA9IHtcblx0XHRcdFx0dXNlcjoge1xuXHRcdFx0XHRcdCRpbjogdXNlcklkc1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGlmIHNwYWNlSWRcblx0XHRcdFx0cXVlcnkuc3BhY2UgPSBzcGFjZUlkXG5cblx0XHRcdHNwYWNlX3VzZXJzID0gZGIuc3BhY2VfdXNlcnMuZmluZChxdWVyeSkuZmV0Y2goKTtcblxuXHRcdFx0c2VsZWN0ZWQgPSBbXVxuXG5cdFx0XHRzcGFjZV91c2Vycy5mb3JFYWNoICh1KS0+XG5cdFx0XHRcdGlmIHNlbGVjdGVkLmluZGV4T2YodS51c2VyKSA8IDBcblx0XHRcdFx0XHRmdSA9IHt9XG5cblx0XHRcdFx0XHRmdS5pZCA9IHUudXNlclxuXG5cdFx0XHRcdFx0ZnUubmFtZSA9IHUubmFtZVxuXG5cdFx0XHRcdFx0ZnUuc29ydF9ubyA9IHUuc29ydF9ub1xuXG5cdFx0XHRcdFx0ZnUubW9iaWxlID0gdS5tb2JpbGVcblxuXHRcdFx0XHRcdGZ1LndvcmtfcGhvbmUgPSB1LndvcmtfcGhvbmVcblxuXHRcdFx0XHRcdGZ1LnBvc2l0aW9uID0gdS5wb3NpdGlvblxuXG5cdFx0XHRcdFx0dV9vcmcgPSBkYi5vcmdhbml6YXRpb25zLmZpbmRPbmUoe19pZDogdS5vcmdhbml6YXRpb259LCB7ZmllbGRzOiB7bmFtZTogMSwgZnVsbG5hbWU6IDF9fSlcblxuXHRcdFx0XHRcdHVfb3JncyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7X2lkOiB7JGluOiB1Lm9yZ2FuaXphdGlvbnN9fSwge2ZpZWxkczoge25hbWU6IDEsIGZ1bGxuYW1lOiAxfX0pLmZldGNoKClcblxuXG5cdFx0XHRcdFx0ZnUub3JnYW5pemF0aW9uID0ge1xuXHRcdFx0XHRcdFx0bmFtZTogdV9vcmc/Lm5hbWUsXG5cdFx0XHRcdFx0XHRmdWxsbmFtZTogdV9vcmc/LmZ1bGxuYW1lXG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0ZnUub3JnYW5pemF0aW9ucyA9IHtcblx0XHRcdFx0XHRcdG5hbWU6IHVfb3Jncz8uZ2V0UHJvcGVydHkoXCJuYW1lXCIpLFxuXHRcdFx0XHRcdFx0ZnVsbG5hbWU6IHVfb3Jncz8uZ2V0UHJvcGVydHkoXCJmdWxsbmFtZVwiKSxcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRmdS5ociA9IHUuaHIgfHwge31cblxuXHRcdFx0XHRcdGlmIGRiLmZsb3dfcG9zaXRpb25zICYmIGRiLmZsb3dfcm9sZXNcblxuXHRcdFx0XHRcdFx0dXNlcl9mbG93X3Bvc2l0aW9ucyA9IGRiLmZsb3dfcG9zaXRpb25zLmZpbmQoe3NwYWNlOiB1LnNwYWNlLCB1c2VyczogdS51c2VyfSwge2ZpZWxkczoge3JvbGU6IDF9fSkuZmV0Y2goKTtcblxuXHRcdFx0XHRcdFx0dXNlcl9yb2xlX2lkcyA9IHVzZXJfZmxvd19wb3NpdGlvbnMuZ2V0UHJvcGVydHkoXCJyb2xlXCIpO1xuXG5cdFx0XHRcdFx0XHR1c2VyX3JvbGVzID0gZGIuZmxvd19yb2xlcy5maW5kKHtfaWQ6IHskaW46IHVzZXJfcm9sZV9pZHN9fSwge2ZpZWxkczoge25hbWU6IDF9fSkuZmV0Y2goKTtcblxuXHRcdFx0XHRcdFx0ZnUucm9sZXMgPSB1c2VyX3JvbGVzLmdldFByb3BlcnR5KFwibmFtZVwiKVxuXG5cdFx0XHRcdFx0ZGF0YS5wdXNoIGZ1XG5cblx0XHRcdFx0XHRzZWxlY3RlZC5wdXNoIHUudXNlclxuXG5cdFx0XHR1c2VySWRzLmZvckVhY2ggKHVJZCktPlxuXHRcdFx0XHRzcGFjZVVzZXJzLnB1c2ggXy5maW5kKGRhdGEsIChzdSktPiByZXR1cm4gc3UuaWQgPT0gdUlkKVxuXG5cblx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG5cdFx0XHRjb2RlOiAyMDAsXG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdCdzcGFjZVVzZXJzJzogc3BhY2VVc2Vyc1xuXHRcdFx0fVxuXHRcdH0pO1xuXG4iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIEpzb25Sb3V0ZXMuYWRkKFwicG9zdFwiLCBcIi9hcGkvZm9ybXVsYS9zcGFjZV91c2Vyc1wiLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICAgIHZhciBkYXRhLCBxdWVyeSwgc2VsZWN0ZWQsIHNwYWNlSWQsIHNwYWNlVXNlcnMsIHNwYWNlX3VzZXJzLCB1c2VySWRzO1xuICAgIHVzZXJJZHMgPSByZXEuYm9keS51c2VySWRzO1xuICAgIHNwYWNlSWQgPSByZXEucXVlcnkuc3BhY2VJZDtcbiAgICBzcGFjZVVzZXJzID0gW107XG4gICAgZGF0YSA9IFtdO1xuICAgIGlmICh1c2VySWRzKSB7XG4gICAgICBpZiAoIXVzZXJJZHMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICB1c2VySWRzID0gW3VzZXJJZHNdO1xuICAgICAgfVxuICAgICAgcXVlcnkgPSB7XG4gICAgICAgIHVzZXI6IHtcbiAgICAgICAgICAkaW46IHVzZXJJZHNcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGlmIChzcGFjZUlkKSB7XG4gICAgICAgIHF1ZXJ5LnNwYWNlID0gc3BhY2VJZDtcbiAgICAgIH1cbiAgICAgIHNwYWNlX3VzZXJzID0gZGIuc3BhY2VfdXNlcnMuZmluZChxdWVyeSkuZmV0Y2goKTtcbiAgICAgIHNlbGVjdGVkID0gW107XG4gICAgICBzcGFjZV91c2Vycy5mb3JFYWNoKGZ1bmN0aW9uKHUpIHtcbiAgICAgICAgdmFyIGZ1LCB1X29yZywgdV9vcmdzLCB1c2VyX2Zsb3dfcG9zaXRpb25zLCB1c2VyX3JvbGVfaWRzLCB1c2VyX3JvbGVzO1xuICAgICAgICBpZiAoc2VsZWN0ZWQuaW5kZXhPZih1LnVzZXIpIDwgMCkge1xuICAgICAgICAgIGZ1ID0ge307XG4gICAgICAgICAgZnUuaWQgPSB1LnVzZXI7XG4gICAgICAgICAgZnUubmFtZSA9IHUubmFtZTtcbiAgICAgICAgICBmdS5zb3J0X25vID0gdS5zb3J0X25vO1xuICAgICAgICAgIGZ1Lm1vYmlsZSA9IHUubW9iaWxlO1xuICAgICAgICAgIGZ1LndvcmtfcGhvbmUgPSB1LndvcmtfcGhvbmU7XG4gICAgICAgICAgZnUucG9zaXRpb24gPSB1LnBvc2l0aW9uO1xuICAgICAgICAgIHVfb3JnID0gZGIub3JnYW5pemF0aW9ucy5maW5kT25lKHtcbiAgICAgICAgICAgIF9pZDogdS5vcmdhbml6YXRpb25cbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgbmFtZTogMSxcbiAgICAgICAgICAgICAgZnVsbG5hbWU6IDFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICB1X29yZ3MgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe1xuICAgICAgICAgICAgX2lkOiB7XG4gICAgICAgICAgICAgICRpbjogdS5vcmdhbml6YXRpb25zXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgIG5hbWU6IDEsXG4gICAgICAgICAgICAgIGZ1bGxuYW1lOiAxXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSkuZmV0Y2goKTtcbiAgICAgICAgICBmdS5vcmdhbml6YXRpb24gPSB7XG4gICAgICAgICAgICBuYW1lOiB1X29yZyAhPSBudWxsID8gdV9vcmcubmFtZSA6IHZvaWQgMCxcbiAgICAgICAgICAgIGZ1bGxuYW1lOiB1X29yZyAhPSBudWxsID8gdV9vcmcuZnVsbG5hbWUgOiB2b2lkIDBcbiAgICAgICAgICB9O1xuICAgICAgICAgIGZ1Lm9yZ2FuaXphdGlvbnMgPSB7XG4gICAgICAgICAgICBuYW1lOiB1X29yZ3MgIT0gbnVsbCA/IHVfb3Jncy5nZXRQcm9wZXJ0eShcIm5hbWVcIikgOiB2b2lkIDAsXG4gICAgICAgICAgICBmdWxsbmFtZTogdV9vcmdzICE9IG51bGwgPyB1X29yZ3MuZ2V0UHJvcGVydHkoXCJmdWxsbmFtZVwiKSA6IHZvaWQgMFxuICAgICAgICAgIH07XG4gICAgICAgICAgZnUuaHIgPSB1LmhyIHx8IHt9O1xuICAgICAgICAgIGlmIChkYi5mbG93X3Bvc2l0aW9ucyAmJiBkYi5mbG93X3JvbGVzKSB7XG4gICAgICAgICAgICB1c2VyX2Zsb3dfcG9zaXRpb25zID0gZGIuZmxvd19wb3NpdGlvbnMuZmluZCh7XG4gICAgICAgICAgICAgIHNwYWNlOiB1LnNwYWNlLFxuICAgICAgICAgICAgICB1c2VyczogdS51c2VyXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICAgIHJvbGU6IDFcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkuZmV0Y2goKTtcbiAgICAgICAgICAgIHVzZXJfcm9sZV9pZHMgPSB1c2VyX2Zsb3dfcG9zaXRpb25zLmdldFByb3BlcnR5KFwicm9sZVwiKTtcbiAgICAgICAgICAgIHVzZXJfcm9sZXMgPSBkYi5mbG93X3JvbGVzLmZpbmQoe1xuICAgICAgICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAgICAgICAkaW46IHVzZXJfcm9sZV9pZHNcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgICBuYW1lOiAxXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLmZldGNoKCk7XG4gICAgICAgICAgICBmdS5yb2xlcyA9IHVzZXJfcm9sZXMuZ2V0UHJvcGVydHkoXCJuYW1lXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBkYXRhLnB1c2goZnUpO1xuICAgICAgICAgIHJldHVybiBzZWxlY3RlZC5wdXNoKHUudXNlcik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdXNlcklkcy5mb3JFYWNoKGZ1bmN0aW9uKHVJZCkge1xuICAgICAgICByZXR1cm4gc3BhY2VVc2Vycy5wdXNoKF8uZmluZChkYXRhLCBmdW5jdGlvbihzdSkge1xuICAgICAgICAgIHJldHVybiBzdS5pZCA9PT0gdUlkO1xuICAgICAgICB9KSk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDIwMCxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgJ3NwYWNlVXNlcnMnOiBzcGFjZVVzZXJzXG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iLCJNZXRlb3Iuc3RhcnR1cCAtPlxuXHRKc29uUm91dGVzLmFkZCBcInBvc3RcIiwgXCIvYXBpL2Zvcm11bGEvb3JnYW5pemF0aW9uc1wiLCAocmVxLCByZXMsIG5leHQpIC0+XG5cblx0XHRyZXNfb3JncyA9IFtdXG5cblx0XHRkYXRhID0gW11cblxuXHRcdG9yZ0lkcyA9IHJlcS5ib2R5Lm9yZ0lkc1xuXG5cdFx0c3BhY2VJZCA9IHJlcS5xdWVyeS5zcGFjZUlkXG5cblx0XHRpZiBvcmdJZHNcblx0XHRcdGlmIG5vdCBvcmdJZHMgaW5zdGFuY2VvZiBBcnJheVxuXHRcdFx0XHRvcmdJZHMgPSBbb3JnSWRzXVxuXG5cdFx0XHRxdWVyeSA9IHtfaWQ6IHskaW46IG9yZ0lkc319XG5cblx0XHRcdGlmIHNwYWNlSWRcblx0XHRcdFx0cXVlcnkuc3BhY2UgPSBzcGFjZUlkXG5cblx0XHRcdG9yZ3MgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQocXVlcnksIHtmaWVsZHM6IHtuYW1lOiAxLCBmdWxsbmFtZTogMX19KS5mZXRjaCgpO1xuXG5cdFx0XHRvcmdzLmZvckVhY2ggKG9yZyktPlxuXHRcdFx0XHRkYXRhLnB1c2gge2lkOiBvcmcuX2lkLCBuYW1lOiBvcmcubmFtZSwgZnVsbG5hbWU6IG9yZy5mdWxsbmFtZX1cblxuXHRcdFx0b3JnSWRzLmZvckVhY2ggKG9JZCktPlxuXHRcdFx0XHRyZXNfb3Jncy5wdXNoIF8uZmluZChkYXRhLCAobyktPiByZXR1cm4gby5pZCA9PSBvSWQpXG5cblxuXG5cdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuXHRcdFx0Y29kZTogMjAwLFxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHQnb3Jncyc6IHJlc19vcmdzXG5cdFx0XHR9XG5cdFx0fSk7XG5cbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gSnNvblJvdXRlcy5hZGQoXCJwb3N0XCIsIFwiL2FwaS9mb3JtdWxhL29yZ2FuaXphdGlvbnNcIiwgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgICB2YXIgZGF0YSwgb3JnSWRzLCBvcmdzLCBxdWVyeSwgcmVzX29yZ3MsIHNwYWNlSWQ7XG4gICAgcmVzX29yZ3MgPSBbXTtcbiAgICBkYXRhID0gW107XG4gICAgb3JnSWRzID0gcmVxLmJvZHkub3JnSWRzO1xuICAgIHNwYWNlSWQgPSByZXEucXVlcnkuc3BhY2VJZDtcbiAgICBpZiAob3JnSWRzKSB7XG4gICAgICBpZiAoIW9yZ0lkcyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgIG9yZ0lkcyA9IFtvcmdJZHNdO1xuICAgICAgfVxuICAgICAgcXVlcnkgPSB7XG4gICAgICAgIF9pZDoge1xuICAgICAgICAgICRpbjogb3JnSWRzXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBpZiAoc3BhY2VJZCkge1xuICAgICAgICBxdWVyeS5zcGFjZSA9IHNwYWNlSWQ7XG4gICAgICB9XG4gICAgICBvcmdzID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHF1ZXJ5LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIG5hbWU6IDEsXG4gICAgICAgICAgZnVsbG5hbWU6IDFcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICAgIG9yZ3MuZm9yRWFjaChmdW5jdGlvbihvcmcpIHtcbiAgICAgICAgcmV0dXJuIGRhdGEucHVzaCh7XG4gICAgICAgICAgaWQ6IG9yZy5faWQsXG4gICAgICAgICAgbmFtZTogb3JnLm5hbWUsXG4gICAgICAgICAgZnVsbG5hbWU6IG9yZy5mdWxsbmFtZVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgb3JnSWRzLmZvckVhY2goZnVuY3Rpb24ob0lkKSB7XG4gICAgICAgIHJldHVybiByZXNfb3Jncy5wdXNoKF8uZmluZChkYXRhLCBmdW5jdGlvbihvKSB7XG4gICAgICAgICAgcmV0dXJuIG8uaWQgPT09IG9JZDtcbiAgICAgICAgfSkpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiAyMDAsXG4gICAgICBkYXRhOiB7XG4gICAgICAgICdvcmdzJzogcmVzX29yZ3NcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==
