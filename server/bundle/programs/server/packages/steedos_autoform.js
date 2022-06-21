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
var TAPi18n = Package['tap:i18n'].TAPi18n;
var SimpleSchema = Package['aldeed:simple-schema'].SimpleSchema;
var MongoObject = Package['aldeed:simple-schema'].MongoObject;
var Tabular = Package['aldeed:tabular'].Tabular;
var moment = Package['momentjs:moment'].moment;
var JsonRoutes = Package['simple:json-routes'].JsonRoutes;
var RestMiddleware = Package['simple:json-routes'].RestMiddleware;
var _i18n = Package['universe:i18n']._i18n;
var i18n = Package['universe:i18n'].i18n;
var Selector = Package['steedos:base'].Selector;
var Steedos = Package['steedos:base'].Steedos;
var AjaxCollection = Package['steedos:base'].AjaxCollection;
var SteedosDataManager = Package['steedos:base'].SteedosDataManager;
var SteedosOffice = Package['steedos:base'].SteedosOffice;
var billingManager = Package['steedos:base'].billingManager;
var Sortable = Package['rubaxa:sortable'].Sortable;
var Promise = Package.promise.Promise;
var Blaze = Package.ui.Blaze;
var UI = Package.ui.UI;
var Handlebars = Package.ui.Handlebars;
var Spacebars = Package.spacebars.Spacebars;
var meteorInstall = Package.modules.meteorInstall;
var HTML = Package.htmljs.HTML;

/* Package-scope variables */
var __coffeescriptShare, CFDataManager;

var require = meteorInstall({"node_modules":{"meteor":{"steedos:autoform":{"client":{"core.coffee":function module(){

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

},"coreform":{"inputTypes":{"coreform-user":{"lib":{"cf_tabular_space_user.coffee":function module(){

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
        return "<label data-user='" + doc.user + "' class='for-input'><div class='user-name'><font>" + doc.name + "</font></div></label>";
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
    pagingType: "numbers",
    displayStart: 0
  });
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}},"routes":{"formula_space_users.coffee":function module(){

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

},"formula_organizations.coffee":function module(){

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
    ".coffee"
  ]
});

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hdXRvZm9ybS9jbGllbnQvY29yZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2NsaWVudC9jb3JlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hdXRvZm9ybS9jbGllbnQvY29yZWZvcm0vaW5wdXRUeXBlcy9jb3JlZm9ybS11c2VyL2xpYi9jZl90YWJ1bGFyX3NwYWNlX3VzZXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9jbGllbnQvY29yZWZvcm0vaW5wdXRUeXBlcy9jb3JlZm9ybS11c2VyL2xpYi9jZl90YWJ1bGFyX3NwYWNlX3VzZXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2F1dG9mb3JtL3JvdXRlcy9mb3JtdWxhX3NwYWNlX3VzZXJzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcm91dGVzL2Zvcm11bGFfc3BhY2VfdXNlcnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2F1dG9mb3JtL3JvdXRlcy9mb3JtdWxhX29yZ2FuaXphdGlvbnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9yb3V0ZXMvZm9ybXVsYV9vcmdhbml6YXRpb25zLmNvZmZlZSJdLCJuYW1lcyI6WyJUYWJ1bGFyVGFibGVzIiwiTWV0ZW9yIiwic3RhcnR1cCIsIlNpbXBsZVNjaGVtYSIsImV4dGVuZE9wdGlvbnMiLCJiZWZvcmVPcGVuRnVuY3Rpb24iLCJNYXRjaCIsIk9wdGlvbmFsIiwiT25lT2YiLCJGdW5jdGlvbiIsIlN0cmluZyIsImNmX3RhYnVsYXJfc3BhY2VfdXNlciIsIlRhYnVsYXIiLCJUYWJsZSIsIm5hbWUiLCJjb2xsZWN0aW9uIiwiZGIiLCJzcGFjZV91c2VycyIsImRyYXdDYWxsYmFjayIsInNldHRpbmdzIiwiJCIsImF0dHIiLCJjb2x1bW5zIiwiZGF0YSIsInRpdGxlIiwib3JkZXJhYmxlIiwid2lkdGgiLCJyZW5kZXIiLCJ2YWwiLCJ0eXBlIiwiZG9jIiwiaW5wdXQiLCJpbnB1dFR5cGUiLCJyZWYiLCJyZWYxIiwicmVmMiIsImN1c3RvbURhdGEiLCJtdWx0aXBsZSIsInVzZXIiLCJlbWFpbCIsImRlZmF1bHRWYWx1ZXMiLCJpbmNsdWRlcyIsInZpc2libGUiLCJvblVubG9hZCIsImNvbnNvbGUiLCJsb2ciLCJkb20iLCJvcmRlciIsImV4dHJhRmllbGRzIiwibGVuZ3RoQ2hhbmdlIiwicGFnZUxlbmd0aCIsImluZm8iLCJzZWFyY2hpbmciLCJyZXNwb25zaXZlIiwiZGV0YWlscyIsImF1dG9XaWR0aCIsImNoYW5nZVNlbGVjdG9yIiwic2VsZWN0b3IiLCJ1c2VySWQiLCJzcGFjZSIsInNwYWNlX3VzZXIiLCJfaWQiLCIkYW5kIiwibGVuZ3RoIiwiZ2V0UHJvcGVydHkiLCJmaW5kT25lIiwiZmllbGRzIiwicGFnaW5nVHlwZSIsImRpc3BsYXlTdGFydCIsIkpzb25Sb3V0ZXMiLCJhZGQiLCJyZXEiLCJyZXMiLCJuZXh0IiwicXVlcnkiLCJzZWxlY3RlZCIsInNwYWNlSWQiLCJzcGFjZVVzZXJzIiwidXNlcklkcyIsImJvZHkiLCJBcnJheSIsIiRpbiIsImZpbmQiLCJmZXRjaCIsImZvckVhY2giLCJ1IiwiZnUiLCJ1X29yZyIsInVfb3JncyIsInVzZXJfZmxvd19wb3NpdGlvbnMiLCJ1c2VyX3JvbGVfaWRzIiwidXNlcl9yb2xlcyIsImluZGV4T2YiLCJpZCIsInNvcnRfbm8iLCJtb2JpbGUiLCJ3b3JrX3Bob25lIiwicG9zaXRpb24iLCJvcmdhbml6YXRpb25zIiwib3JnYW5pemF0aW9uIiwiZnVsbG5hbWUiLCJociIsImZsb3dfcG9zaXRpb25zIiwiZmxvd19yb2xlcyIsInVzZXJzIiwicm9sZSIsInJvbGVzIiwicHVzaCIsInVJZCIsIl8iLCJzdSIsInNlbmRSZXN1bHQiLCJjb2RlIiwib3JnSWRzIiwib3JncyIsInJlc19vcmdzIiwib3JnIiwib0lkIiwibyJdLCJtYXBwaW5n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IHt9O1xuXG5cbk1ldGVvci5zdGFydHVwIC0+XG5cdFNpbXBsZVNjaGVtYS5leHRlbmRPcHRpb25zKHtiZWZvcmVPcGVuRnVuY3Rpb246IE1hdGNoLk9wdGlvbmFsKE1hdGNoLk9uZU9mKEZ1bmN0aW9uLCBTdHJpbmcpKX0pIiwidGhpcy5UYWJ1bGFyVGFibGVzID0ge307XG5cbk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gU2ltcGxlU2NoZW1hLmV4dGVuZE9wdGlvbnMoe1xuICAgIGJlZm9yZU9wZW5GdW5jdGlvbjogTWF0Y2guT3B0aW9uYWwoTWF0Y2guT25lT2YoRnVuY3Rpb24sIFN0cmluZykpXG4gIH0pO1xufSk7XG4iLCJNZXRlb3Iuc3RhcnR1cCAoKS0+XG5cdFRhYnVsYXJUYWJsZXMuY2ZfdGFidWxhcl9zcGFjZV91c2VyID0gbmV3IFRhYnVsYXIuVGFibGUoe1xuXHRcdG5hbWU6IFwiY2ZfdGFidWxhcl9zcGFjZV91c2VyXCIsXG5cdFx0Y29sbGVjdGlvbjogZGIuc3BhY2VfdXNlcnMsXG5cdFx0ZHJhd0NhbGxiYWNrOiAoc2V0dGluZ3MpLT5cblx0XHRcdCQoXCIjY2ZfcmV2ZXJzZVwiKS5hdHRyKFwiY2hlY2tlZFwiLCBmYWxzZSlcblx0XHRjb2x1bW5zOiBbXG5cdFx0XHR7XG5cdFx0XHRcdGRhdGE6IFwiX2lkXCIsXG5cdFx0XHRcdHRpdGxlOiAnPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIG5hbWU9XCJjZl9yZXZlcnNlXCIgaWQ9XCJjZl9yZXZlcnNlXCI+Jyxcblx0XHRcdFx0b3JkZXJhYmxlOiBmYWxzZSxcblx0XHRcdFx0d2lkdGg6JzEwcHgnLFxuXHRcdFx0XHRyZW5kZXI6ICAodmFsLCB0eXBlLCBkb2MpIC0+XG5cblx0XHRcdFx0XHRpbnB1dFR5cGUgPSBcImNoZWNrYm94XCI7XG5cblx0XHRcdFx0XHRpZiAhVGFidWxhclRhYmxlcy5jZl90YWJ1bGFyX3NwYWNlX3VzZXIuY3VzdG9tRGF0YT8ubXVsdGlwbGVcblx0XHRcdFx0XHRcdGlucHV0VHlwZSA9IFwicmFkaW9cIlxuXG5cdFx0XHRcdFx0aW5wdXQgPSAnPGlucHV0IHR5cGU9XCInICsgaW5wdXRUeXBlICsgJ1wiIGNsYXNzPVwibGlzdF9jaGVja2JveFwiIG5hbWU9XCJjZl9jb250YWN0c19pZHNcIiBpZD1cIicgKyBkb2MudXNlciArICdcIiB2YWx1ZT1cIicgKyBkb2MudXNlciArICdcIiBkYXRhLW5hbWU9XCInICsgZG9jLm5hbWUgKyAnXCIgZGF0YS1lbWFpbD1cIicgKyBkb2MuZW1haWwgKyAnXCInO1xuXG5cdFx0XHRcdFx0aWYgVGFidWxhclRhYmxlcy5jZl90YWJ1bGFyX3NwYWNlX3VzZXIuY3VzdG9tRGF0YT8uZGVmYXVsdFZhbHVlcz8uaW5jbHVkZXMoZG9jLnVzZXIpXG5cdFx0XHRcdFx0XHRpbnB1dCArPSBcIiBjaGVja2VkIFwiXG5cblx0XHRcdFx0XHRpbnB1dCArPSBcIj5cIlxuXHRcdFx0XHRcdHJldHVybiBpbnB1dFxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0ZGF0YTogXCJuYW1lXCIsXG5cdFx0XHRcdG9yZGVyYWJsZTogZmFsc2UsXG5cdFx0XHRcdHJlbmRlcjogICh2YWwsIHR5cGUsIGRvYykgLT5cblx0XHRcdFx0XHRyZXR1cm4gXCI8bGFiZWwgZGF0YS11c2VyPSdcIiArIGRvYy51c2VyICsgXCInIGNsYXNzPSdmb3ItaW5wdXQnPjxkaXYgY2xhc3M9J3VzZXItbmFtZSc+PGZvbnQ+XCIgKyBkb2MubmFtZSArIFwiPC9mb250PjwvZGl2PjwvbGFiZWw+XCJcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdGRhdGE6IFwic29ydF9ub1wiLFxuXHRcdFx0XHR0aXRsZTogXCJcIixcblx0XHRcdFx0b3JkZXJhYmxlOiB0cnVlLFxuXHRcdFx0XHR2aXNpYmxlOiBmYWxzZVxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0ZGF0YTogXCJuYW1lXCIsXG5cdFx0XHRcdHRpdGxlOiBcIlwiLFxuXHRcdFx0XHRvcmRlcmFibGU6IHRydWUsXG5cdFx0XHRcdHZpc2libGU6IGZhbHNlXG5cdFx0XHR9LHtcblx0XHRcdFx0ZGF0YTogXCJlbWFpbFwiLFxuXHRcdFx0XHR0aXRsZTogXCJcIixcblx0XHRcdFx0b3JkZXJhYmxlOiBmYWxzZSxcblx0XHRcdFx0dmlzaWJsZTogZmFsc2Vcblx0XHRcdH1cblx0XHRdLFxuXHRcdG9uVW5sb2FkOigpIC0+XG5cdFx0XHRyZXR1cm4gY29uc29sZS5sb2coXCJvblVubG9hZCBvay4uLi5cIik7XG4jc2VsZWN0OlxuIyAgc3R5bGU6ICdzaW5nbGUnXG5cdFx0ZG9tOiBcInRwXCIsXG5cdFx0b3JkZXI6W1syLFwiZGVzY1wiXSxbMyxcImFzY1wiXV0sXG5cdFx0ZXh0cmFGaWVsZHM6IFtcIl9pZFwiLCBcIm5hbWVcIiwgXCJ1c2VyXCIsIFwic29ydF9ub1wiLCBcImVtYWlsXCJdLFxuXHRcdGxlbmd0aENoYW5nZTogZmFsc2UsXG5cdFx0cGFnZUxlbmd0aDogMTAwLFxuXHRcdGluZm86IGZhbHNlLFxuXHRcdHNlYXJjaGluZzogdHJ1ZSxcblx0XHRyZXNwb25zaXZlOlxuXHRcdFx0ZGV0YWlsczogZmFsc2Vcblx0XHRhdXRvV2lkdGg6IGZhbHNlLFxuXHRcdGNoYW5nZVNlbGVjdG9yOiAoc2VsZWN0b3IsIHVzZXJJZCkgLT5cblx0XHRcdHVubGVzcyB1c2VySWRcblx0XHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxuXHRcdFx0c3BhY2UgPSBzZWxlY3Rvci5zcGFjZVxuXHRcdFx0dW5sZXNzIHNwYWNlXG5cdFx0XHRcdGlmIHNlbGVjdG9yPy4kYW5kPy5sZW5ndGggPiAwXG5cdFx0XHRcdFx0c3BhY2UgPSBzZWxlY3Rvci4kYW5kLmdldFByb3BlcnR5KCdzcGFjZScpWzBdXG5cdFx0XHR1bmxlc3Mgc3BhY2Vcblx0XHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxuXHRcdFx0c3BhY2VfdXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe3VzZXI6IHVzZXJJZCxzcGFjZTpzcGFjZX0sIHtmaWVsZHM6IHtfaWQ6IDF9fSlcblx0XHRcdHVubGVzcyBzcGFjZV91c2VyXG5cdFx0XHRcdHJldHVybiB7X2lkOiAtMX1cblx0XHRcdHJldHVybiBzZWxlY3RvclxuXG4jc2Nyb2xsWTogICAgICAgICc0MDBweCcsXG4jc2Nyb2xsQ29sbGFwc2U6IHRydWUsXG5cdFx0cGFnaW5nVHlwZTogXCJudW1iZXJzXCJcblx0XHRkaXNwbGF5U3RhcnQ6IDBcblx0fSk7XG4iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIFRhYnVsYXJUYWJsZXMuY2ZfdGFidWxhcl9zcGFjZV91c2VyID0gbmV3IFRhYnVsYXIuVGFibGUoe1xuICAgIG5hbWU6IFwiY2ZfdGFidWxhcl9zcGFjZV91c2VyXCIsXG4gICAgY29sbGVjdGlvbjogZGIuc3BhY2VfdXNlcnMsXG4gICAgZHJhd0NhbGxiYWNrOiBmdW5jdGlvbihzZXR0aW5ncykge1xuICAgICAgcmV0dXJuICQoXCIjY2ZfcmV2ZXJzZVwiKS5hdHRyKFwiY2hlY2tlZFwiLCBmYWxzZSk7XG4gICAgfSxcbiAgICBjb2x1bW5zOiBbXG4gICAgICB7XG4gICAgICAgIGRhdGE6IFwiX2lkXCIsXG4gICAgICAgIHRpdGxlOiAnPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIG5hbWU9XCJjZl9yZXZlcnNlXCIgaWQ9XCJjZl9yZXZlcnNlXCI+JyxcbiAgICAgICAgb3JkZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd2lkdGg6ICcxMHB4JyxcbiAgICAgICAgcmVuZGVyOiBmdW5jdGlvbih2YWwsIHR5cGUsIGRvYykge1xuICAgICAgICAgIHZhciBpbnB1dCwgaW5wdXRUeXBlLCByZWYsIHJlZjEsIHJlZjI7XG4gICAgICAgICAgaW5wdXRUeXBlID0gXCJjaGVja2JveFwiO1xuICAgICAgICAgIGlmICghKChyZWYgPSBUYWJ1bGFyVGFibGVzLmNmX3RhYnVsYXJfc3BhY2VfdXNlci5jdXN0b21EYXRhKSAhPSBudWxsID8gcmVmLm11bHRpcGxlIDogdm9pZCAwKSkge1xuICAgICAgICAgICAgaW5wdXRUeXBlID0gXCJyYWRpb1wiO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpbnB1dCA9ICc8aW5wdXQgdHlwZT1cIicgKyBpbnB1dFR5cGUgKyAnXCIgY2xhc3M9XCJsaXN0X2NoZWNrYm94XCIgbmFtZT1cImNmX2NvbnRhY3RzX2lkc1wiIGlkPVwiJyArIGRvYy51c2VyICsgJ1wiIHZhbHVlPVwiJyArIGRvYy51c2VyICsgJ1wiIGRhdGEtbmFtZT1cIicgKyBkb2MubmFtZSArICdcIiBkYXRhLWVtYWlsPVwiJyArIGRvYy5lbWFpbCArICdcIic7XG4gICAgICAgICAgaWYgKChyZWYxID0gVGFidWxhclRhYmxlcy5jZl90YWJ1bGFyX3NwYWNlX3VzZXIuY3VzdG9tRGF0YSkgIT0gbnVsbCA/IChyZWYyID0gcmVmMS5kZWZhdWx0VmFsdWVzKSAhPSBudWxsID8gcmVmMi5pbmNsdWRlcyhkb2MudXNlcikgOiB2b2lkIDAgOiB2b2lkIDApIHtcbiAgICAgICAgICAgIGlucHV0ICs9IFwiIGNoZWNrZWQgXCI7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlucHV0ICs9IFwiPlwiO1xuICAgICAgICAgIHJldHVybiBpbnB1dDtcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBkYXRhOiBcIm5hbWVcIixcbiAgICAgICAgb3JkZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgcmVuZGVyOiBmdW5jdGlvbih2YWwsIHR5cGUsIGRvYykge1xuICAgICAgICAgIHJldHVybiBcIjxsYWJlbCBkYXRhLXVzZXI9J1wiICsgZG9jLnVzZXIgKyBcIicgY2xhc3M9J2Zvci1pbnB1dCc+PGRpdiBjbGFzcz0ndXNlci1uYW1lJz48Zm9udD5cIiArIGRvYy5uYW1lICsgXCI8L2ZvbnQ+PC9kaXY+PC9sYWJlbD5cIjtcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBkYXRhOiBcInNvcnRfbm9cIixcbiAgICAgICAgdGl0bGU6IFwiXCIsXG4gICAgICAgIG9yZGVyYWJsZTogdHJ1ZSxcbiAgICAgICAgdmlzaWJsZTogZmFsc2VcbiAgICAgIH0sIHtcbiAgICAgICAgZGF0YTogXCJuYW1lXCIsXG4gICAgICAgIHRpdGxlOiBcIlwiLFxuICAgICAgICBvcmRlcmFibGU6IHRydWUsXG4gICAgICAgIHZpc2libGU6IGZhbHNlXG4gICAgICB9LCB7XG4gICAgICAgIGRhdGE6IFwiZW1haWxcIixcbiAgICAgICAgdGl0bGU6IFwiXCIsXG4gICAgICAgIG9yZGVyYWJsZTogZmFsc2UsXG4gICAgICAgIHZpc2libGU6IGZhbHNlXG4gICAgICB9XG4gICAgXSxcbiAgICBvblVubG9hZDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY29uc29sZS5sb2coXCJvblVubG9hZCBvay4uLi5cIik7XG4gICAgfSxcbiAgICBkb206IFwidHBcIixcbiAgICBvcmRlcjogW1syLCBcImRlc2NcIl0sIFszLCBcImFzY1wiXV0sXG4gICAgZXh0cmFGaWVsZHM6IFtcIl9pZFwiLCBcIm5hbWVcIiwgXCJ1c2VyXCIsIFwic29ydF9ub1wiLCBcImVtYWlsXCJdLFxuICAgIGxlbmd0aENoYW5nZTogZmFsc2UsXG4gICAgcGFnZUxlbmd0aDogMTAwLFxuICAgIGluZm86IGZhbHNlLFxuICAgIHNlYXJjaGluZzogdHJ1ZSxcbiAgICByZXNwb25zaXZlOiB7XG4gICAgICBkZXRhaWxzOiBmYWxzZVxuICAgIH0sXG4gICAgYXV0b1dpZHRoOiBmYWxzZSxcbiAgICBjaGFuZ2VTZWxlY3RvcjogZnVuY3Rpb24oc2VsZWN0b3IsIHVzZXJJZCkge1xuICAgICAgdmFyIHJlZiwgc3BhY2UsIHNwYWNlX3VzZXI7XG4gICAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIF9pZDogLTFcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHNwYWNlID0gc2VsZWN0b3Iuc3BhY2U7XG4gICAgICBpZiAoIXNwYWNlKSB7XG4gICAgICAgIGlmICgoc2VsZWN0b3IgIT0gbnVsbCA/IChyZWYgPSBzZWxlY3Rvci4kYW5kKSAhPSBudWxsID8gcmVmLmxlbmd0aCA6IHZvaWQgMCA6IHZvaWQgMCkgPiAwKSB7XG4gICAgICAgICAgc3BhY2UgPSBzZWxlY3Rvci4kYW5kLmdldFByb3BlcnR5KCdzcGFjZScpWzBdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoIXNwYWNlKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgX2lkOiAtMVxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgc3BhY2VfdXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe1xuICAgICAgICB1c2VyOiB1c2VySWQsXG4gICAgICAgIHNwYWNlOiBzcGFjZVxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDFcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBpZiAoIXNwYWNlX3VzZXIpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBfaWQ6IC0xXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4gc2VsZWN0b3I7XG4gICAgfSxcbiAgICBwYWdpbmdUeXBlOiBcIm51bWJlcnNcIixcbiAgICBkaXNwbGF5U3RhcnQ6IDBcbiAgfSk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwIC0+XG5cdEpzb25Sb3V0ZXMuYWRkIFwicG9zdFwiLCBcIi9hcGkvZm9ybXVsYS9zcGFjZV91c2Vyc1wiLCAocmVxLCByZXMsIG5leHQpIC0+XG5cdFx0dXNlcklkcyA9IHJlcS5ib2R5LnVzZXJJZHNcblx0XHRzcGFjZUlkID0gcmVxLnF1ZXJ5LnNwYWNlSWRcblxuXHRcdHNwYWNlVXNlcnMgPSBbXVxuXG5cdFx0ZGF0YSA9IFtdXG5cblx0XHRpZiAodXNlcklkcylcblxuXHRcdFx0aWYgbm90IHVzZXJJZHMgaW5zdGFuY2VvZiBBcnJheVxuXHRcdFx0XHR1c2VySWRzID0gW3VzZXJJZHNdXG5cblx0XHRcdHF1ZXJ5ID0ge1xuXHRcdFx0XHR1c2VyOiB7XG5cdFx0XHRcdFx0JGluOiB1c2VySWRzXG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgc3BhY2VJZFxuXHRcdFx0XHRxdWVyeS5zcGFjZSA9IHNwYWNlSWRcblxuXHRcdFx0c3BhY2VfdXNlcnMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHF1ZXJ5KS5mZXRjaCgpO1xuXG5cdFx0XHRzZWxlY3RlZCA9IFtdXG5cblx0XHRcdHNwYWNlX3VzZXJzLmZvckVhY2ggKHUpLT5cblx0XHRcdFx0aWYgc2VsZWN0ZWQuaW5kZXhPZih1LnVzZXIpIDwgMFxuXHRcdFx0XHRcdGZ1ID0ge31cblxuXHRcdFx0XHRcdGZ1LmlkID0gdS51c2VyXG5cblx0XHRcdFx0XHRmdS5uYW1lID0gdS5uYW1lXG5cblx0XHRcdFx0XHRmdS5zb3J0X25vID0gdS5zb3J0X25vXG5cblx0XHRcdFx0XHRmdS5tb2JpbGUgPSB1Lm1vYmlsZVxuXG5cdFx0XHRcdFx0ZnUud29ya19waG9uZSA9IHUud29ya19waG9uZVxuXG5cdFx0XHRcdFx0ZnUucG9zaXRpb24gPSB1LnBvc2l0aW9uXG5cblx0XHRcdFx0XHR1X29yZyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZE9uZSh7X2lkOiB1Lm9yZ2FuaXphdGlvbn0sIHtmaWVsZHM6IHtuYW1lOiAxLCBmdWxsbmFtZTogMX19KVxuXG5cdFx0XHRcdFx0dV9vcmdzID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtfaWQ6IHskaW46IHUub3JnYW5pemF0aW9uc319LCB7ZmllbGRzOiB7bmFtZTogMSwgZnVsbG5hbWU6IDF9fSkuZmV0Y2goKVxuXG5cblx0XHRcdFx0XHRmdS5vcmdhbml6YXRpb24gPSB7XG5cdFx0XHRcdFx0XHRuYW1lOiB1X29yZz8ubmFtZSxcblx0XHRcdFx0XHRcdGZ1bGxuYW1lOiB1X29yZz8uZnVsbG5hbWVcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRmdS5vcmdhbml6YXRpb25zID0ge1xuXHRcdFx0XHRcdFx0bmFtZTogdV9vcmdzPy5nZXRQcm9wZXJ0eShcIm5hbWVcIiksXG5cdFx0XHRcdFx0XHRmdWxsbmFtZTogdV9vcmdzPy5nZXRQcm9wZXJ0eShcImZ1bGxuYW1lXCIpLFxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGZ1LmhyID0gdS5ociB8fCB7fVxuXG5cdFx0XHRcdFx0aWYgZGIuZmxvd19wb3NpdGlvbnMgJiYgZGIuZmxvd19yb2xlc1xuXG5cdFx0XHRcdFx0XHR1c2VyX2Zsb3dfcG9zaXRpb25zID0gZGIuZmxvd19wb3NpdGlvbnMuZmluZCh7c3BhY2U6IHUuc3BhY2UsIHVzZXJzOiB1LnVzZXJ9LCB7ZmllbGRzOiB7cm9sZTogMX19KS5mZXRjaCgpO1xuXG5cdFx0XHRcdFx0XHR1c2VyX3JvbGVfaWRzID0gdXNlcl9mbG93X3Bvc2l0aW9ucy5nZXRQcm9wZXJ0eShcInJvbGVcIik7XG5cblx0XHRcdFx0XHRcdHVzZXJfcm9sZXMgPSBkYi5mbG93X3JvbGVzLmZpbmQoe19pZDogeyRpbjogdXNlcl9yb2xlX2lkc319LCB7ZmllbGRzOiB7bmFtZTogMX19KS5mZXRjaCgpO1xuXG5cdFx0XHRcdFx0XHRmdS5yb2xlcyA9IHVzZXJfcm9sZXMuZ2V0UHJvcGVydHkoXCJuYW1lXCIpXG5cblx0XHRcdFx0XHRkYXRhLnB1c2ggZnVcblxuXHRcdFx0XHRcdHNlbGVjdGVkLnB1c2ggdS51c2VyXG5cblx0XHRcdHVzZXJJZHMuZm9yRWFjaCAodUlkKS0+XG5cdFx0XHRcdHNwYWNlVXNlcnMucHVzaCBfLmZpbmQoZGF0YSwgKHN1KS0+IHJldHVybiBzdS5pZCA9PSB1SWQpXG5cblxuXHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcblx0XHRcdGNvZGU6IDIwMCxcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0J3NwYWNlVXNlcnMnOiBzcGFjZVVzZXJzXG5cdFx0XHR9XG5cdFx0fSk7XG5cbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gSnNvblJvdXRlcy5hZGQoXCJwb3N0XCIsIFwiL2FwaS9mb3JtdWxhL3NwYWNlX3VzZXJzXCIsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gICAgdmFyIGRhdGEsIHF1ZXJ5LCBzZWxlY3RlZCwgc3BhY2VJZCwgc3BhY2VVc2Vycywgc3BhY2VfdXNlcnMsIHVzZXJJZHM7XG4gICAgdXNlcklkcyA9IHJlcS5ib2R5LnVzZXJJZHM7XG4gICAgc3BhY2VJZCA9IHJlcS5xdWVyeS5zcGFjZUlkO1xuICAgIHNwYWNlVXNlcnMgPSBbXTtcbiAgICBkYXRhID0gW107XG4gICAgaWYgKHVzZXJJZHMpIHtcbiAgICAgIGlmICghdXNlcklkcyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgIHVzZXJJZHMgPSBbdXNlcklkc107XG4gICAgICB9XG4gICAgICBxdWVyeSA9IHtcbiAgICAgICAgdXNlcjoge1xuICAgICAgICAgICRpbjogdXNlcklkc1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgaWYgKHNwYWNlSWQpIHtcbiAgICAgICAgcXVlcnkuc3BhY2UgPSBzcGFjZUlkO1xuICAgICAgfVxuICAgICAgc3BhY2VfdXNlcnMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHF1ZXJ5KS5mZXRjaCgpO1xuICAgICAgc2VsZWN0ZWQgPSBbXTtcbiAgICAgIHNwYWNlX3VzZXJzLmZvckVhY2goZnVuY3Rpb24odSkge1xuICAgICAgICB2YXIgZnUsIHVfb3JnLCB1X29yZ3MsIHVzZXJfZmxvd19wb3NpdGlvbnMsIHVzZXJfcm9sZV9pZHMsIHVzZXJfcm9sZXM7XG4gICAgICAgIGlmIChzZWxlY3RlZC5pbmRleE9mKHUudXNlcikgPCAwKSB7XG4gICAgICAgICAgZnUgPSB7fTtcbiAgICAgICAgICBmdS5pZCA9IHUudXNlcjtcbiAgICAgICAgICBmdS5uYW1lID0gdS5uYW1lO1xuICAgICAgICAgIGZ1LnNvcnRfbm8gPSB1LnNvcnRfbm87XG4gICAgICAgICAgZnUubW9iaWxlID0gdS5tb2JpbGU7XG4gICAgICAgICAgZnUud29ya19waG9uZSA9IHUud29ya19waG9uZTtcbiAgICAgICAgICBmdS5wb3NpdGlvbiA9IHUucG9zaXRpb247XG4gICAgICAgICAgdV9vcmcgPSBkYi5vcmdhbml6YXRpb25zLmZpbmRPbmUoe1xuICAgICAgICAgICAgX2lkOiB1Lm9yZ2FuaXphdGlvblxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICBuYW1lOiAxLFxuICAgICAgICAgICAgICBmdWxsbmFtZTogMVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHVfb3JncyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7XG4gICAgICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAgICAgJGluOiB1Lm9yZ2FuaXphdGlvbnNcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgbmFtZTogMSxcbiAgICAgICAgICAgICAgZnVsbG5hbWU6IDFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KS5mZXRjaCgpO1xuICAgICAgICAgIGZ1Lm9yZ2FuaXphdGlvbiA9IHtcbiAgICAgICAgICAgIG5hbWU6IHVfb3JnICE9IG51bGwgPyB1X29yZy5uYW1lIDogdm9pZCAwLFxuICAgICAgICAgICAgZnVsbG5hbWU6IHVfb3JnICE9IG51bGwgPyB1X29yZy5mdWxsbmFtZSA6IHZvaWQgMFxuICAgICAgICAgIH07XG4gICAgICAgICAgZnUub3JnYW5pemF0aW9ucyA9IHtcbiAgICAgICAgICAgIG5hbWU6IHVfb3JncyAhPSBudWxsID8gdV9vcmdzLmdldFByb3BlcnR5KFwibmFtZVwiKSA6IHZvaWQgMCxcbiAgICAgICAgICAgIGZ1bGxuYW1lOiB1X29yZ3MgIT0gbnVsbCA/IHVfb3Jncy5nZXRQcm9wZXJ0eShcImZ1bGxuYW1lXCIpIDogdm9pZCAwXG4gICAgICAgICAgfTtcbiAgICAgICAgICBmdS5ociA9IHUuaHIgfHwge307XG4gICAgICAgICAgaWYgKGRiLmZsb3dfcG9zaXRpb25zICYmIGRiLmZsb3dfcm9sZXMpIHtcbiAgICAgICAgICAgIHVzZXJfZmxvd19wb3NpdGlvbnMgPSBkYi5mbG93X3Bvc2l0aW9ucy5maW5kKHtcbiAgICAgICAgICAgICAgc3BhY2U6IHUuc3BhY2UsXG4gICAgICAgICAgICAgIHVzZXJzOiB1LnVzZXJcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgICAgcm9sZTogMVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS5mZXRjaCgpO1xuICAgICAgICAgICAgdXNlcl9yb2xlX2lkcyA9IHVzZXJfZmxvd19wb3NpdGlvbnMuZ2V0UHJvcGVydHkoXCJyb2xlXCIpO1xuICAgICAgICAgICAgdXNlcl9yb2xlcyA9IGRiLmZsb3dfcm9sZXMuZmluZCh7XG4gICAgICAgICAgICAgIF9pZDoge1xuICAgICAgICAgICAgICAgICRpbjogdXNlcl9yb2xlX2lkc1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICAgIG5hbWU6IDFcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkuZmV0Y2goKTtcbiAgICAgICAgICAgIGZ1LnJvbGVzID0gdXNlcl9yb2xlcy5nZXRQcm9wZXJ0eShcIm5hbWVcIik7XG4gICAgICAgICAgfVxuICAgICAgICAgIGRhdGEucHVzaChmdSk7XG4gICAgICAgICAgcmV0dXJuIHNlbGVjdGVkLnB1c2godS51c2VyKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB1c2VySWRzLmZvckVhY2goZnVuY3Rpb24odUlkKSB7XG4gICAgICAgIHJldHVybiBzcGFjZVVzZXJzLnB1c2goXy5maW5kKGRhdGEsIGZ1bmN0aW9uKHN1KSB7XG4gICAgICAgICAgcmV0dXJuIHN1LmlkID09PSB1SWQ7XG4gICAgICAgIH0pKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogMjAwLFxuICAgICAgZGF0YToge1xuICAgICAgICAnc3BhY2VVc2Vycyc6IHNwYWNlVXNlcnNcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwIC0+XG5cdEpzb25Sb3V0ZXMuYWRkIFwicG9zdFwiLCBcIi9hcGkvZm9ybXVsYS9vcmdhbml6YXRpb25zXCIsIChyZXEsIHJlcywgbmV4dCkgLT5cblxuXHRcdHJlc19vcmdzID0gW11cblxuXHRcdGRhdGEgPSBbXVxuXG5cdFx0b3JnSWRzID0gcmVxLmJvZHkub3JnSWRzXG5cblx0XHRzcGFjZUlkID0gcmVxLnF1ZXJ5LnNwYWNlSWRcblxuXHRcdGlmIG9yZ0lkc1xuXHRcdFx0aWYgbm90IG9yZ0lkcyBpbnN0YW5jZW9mIEFycmF5XG5cdFx0XHRcdG9yZ0lkcyA9IFtvcmdJZHNdXG5cblx0XHRcdHF1ZXJ5ID0ge19pZDogeyRpbjogb3JnSWRzfX1cblxuXHRcdFx0aWYgc3BhY2VJZFxuXHRcdFx0XHRxdWVyeS5zcGFjZSA9IHNwYWNlSWRcblxuXHRcdFx0b3JncyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZChxdWVyeSwge2ZpZWxkczoge25hbWU6IDEsIGZ1bGxuYW1lOiAxfX0pLmZldGNoKCk7XG5cblx0XHRcdG9yZ3MuZm9yRWFjaCAob3JnKS0+XG5cdFx0XHRcdGRhdGEucHVzaCB7aWQ6IG9yZy5faWQsIG5hbWU6IG9yZy5uYW1lLCBmdWxsbmFtZTogb3JnLmZ1bGxuYW1lfVxuXG5cdFx0XHRvcmdJZHMuZm9yRWFjaCAob0lkKS0+XG5cdFx0XHRcdHJlc19vcmdzLnB1c2ggXy5maW5kKGRhdGEsIChvKS0+IHJldHVybiBvLmlkID09IG9JZClcblxuXG5cblx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG5cdFx0XHRjb2RlOiAyMDAsXG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdCdvcmdzJzogcmVzX29yZ3Ncblx0XHRcdH1cblx0XHR9KTtcblxuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBKc29uUm91dGVzLmFkZChcInBvc3RcIiwgXCIvYXBpL2Zvcm11bGEvb3JnYW5pemF0aW9uc1wiLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICAgIHZhciBkYXRhLCBvcmdJZHMsIG9yZ3MsIHF1ZXJ5LCByZXNfb3Jncywgc3BhY2VJZDtcbiAgICByZXNfb3JncyA9IFtdO1xuICAgIGRhdGEgPSBbXTtcbiAgICBvcmdJZHMgPSByZXEuYm9keS5vcmdJZHM7XG4gICAgc3BhY2VJZCA9IHJlcS5xdWVyeS5zcGFjZUlkO1xuICAgIGlmIChvcmdJZHMpIHtcbiAgICAgIGlmICghb3JnSWRzIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgb3JnSWRzID0gW29yZ0lkc107XG4gICAgICB9XG4gICAgICBxdWVyeSA9IHtcbiAgICAgICAgX2lkOiB7XG4gICAgICAgICAgJGluOiBvcmdJZHNcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGlmIChzcGFjZUlkKSB7XG4gICAgICAgIHF1ZXJ5LnNwYWNlID0gc3BhY2VJZDtcbiAgICAgIH1cbiAgICAgIG9yZ3MgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQocXVlcnksIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgbmFtZTogMSxcbiAgICAgICAgICBmdWxsbmFtZTogMVxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgICAgb3Jncy5mb3JFYWNoKGZ1bmN0aW9uKG9yZykge1xuICAgICAgICByZXR1cm4gZGF0YS5wdXNoKHtcbiAgICAgICAgICBpZDogb3JnLl9pZCxcbiAgICAgICAgICBuYW1lOiBvcmcubmFtZSxcbiAgICAgICAgICBmdWxsbmFtZTogb3JnLmZ1bGxuYW1lXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICBvcmdJZHMuZm9yRWFjaChmdW5jdGlvbihvSWQpIHtcbiAgICAgICAgcmV0dXJuIHJlc19vcmdzLnB1c2goXy5maW5kKGRhdGEsIGZ1bmN0aW9uKG8pIHtcbiAgICAgICAgICByZXR1cm4gby5pZCA9PT0gb0lkO1xuICAgICAgICB9KSk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDIwMCxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgJ29yZ3MnOiByZXNfb3Jnc1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19
