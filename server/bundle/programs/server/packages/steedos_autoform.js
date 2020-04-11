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

var require = meteorInstall({"node_modules":{"meteor":{"steedos:autoform":{"client":{"core.coffee":function(){

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hdXRvZm9ybS9jbGllbnQvY29yZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2NsaWVudC9jb3JlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hdXRvZm9ybS9jbGllbnQvY29yZWZvcm0vaW5wdXRUeXBlcy9jb3JlZm9ybS11c2VyL2xpYi9jZl90YWJ1bGFyX3NwYWNlX3VzZXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9jbGllbnQvY29yZWZvcm0vaW5wdXRUeXBlcy9jb3JlZm9ybS11c2VyL2xpYi9jZl90YWJ1bGFyX3NwYWNlX3VzZXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2F1dG9mb3JtL3JvdXRlcy9mb3JtdWxhX3NwYWNlX3VzZXJzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcm91dGVzL2Zvcm11bGFfc3BhY2VfdXNlcnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2F1dG9mb3JtL3JvdXRlcy9mb3JtdWxhX29yZ2FuaXphdGlvbnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9yb3V0ZXMvZm9ybXVsYV9vcmdhbml6YXRpb25zLmNvZmZlZSJdLCJuYW1lcyI6WyJUYWJ1bGFyVGFibGVzIiwiTWV0ZW9yIiwic3RhcnR1cCIsIlNpbXBsZVNjaGVtYSIsImV4dGVuZE9wdGlvbnMiLCJiZWZvcmVPcGVuRnVuY3Rpb24iLCJNYXRjaCIsIk9wdGlvbmFsIiwiT25lT2YiLCJGdW5jdGlvbiIsIlN0cmluZyIsImNmX3RhYnVsYXJfc3BhY2VfdXNlciIsIlRhYnVsYXIiLCJUYWJsZSIsIm5hbWUiLCJjb2xsZWN0aW9uIiwiZGIiLCJzcGFjZV91c2VycyIsImRyYXdDYWxsYmFjayIsInNldHRpbmdzIiwiJCIsImF0dHIiLCJjb2x1bW5zIiwiZGF0YSIsInRpdGxlIiwib3JkZXJhYmxlIiwid2lkdGgiLCJyZW5kZXIiLCJ2YWwiLCJ0eXBlIiwiZG9jIiwiaW5wdXQiLCJpbnB1dFR5cGUiLCJyZWYiLCJyZWYxIiwicmVmMiIsImN1c3RvbURhdGEiLCJtdWx0aXBsZSIsInVzZXIiLCJlbWFpbCIsImRlZmF1bHRWYWx1ZXMiLCJpbmNsdWRlcyIsIlN0ZWVkb3MiLCJhYnNvbHV0ZVVybCIsInZpc2libGUiLCJvblVubG9hZCIsImNvbnNvbGUiLCJsb2ciLCJkb20iLCJvcmRlciIsImV4dHJhRmllbGRzIiwibGVuZ3RoQ2hhbmdlIiwicGFnZUxlbmd0aCIsImluZm8iLCJzZWFyY2hpbmciLCJyZXNwb25zaXZlIiwiZGV0YWlscyIsImF1dG9XaWR0aCIsImNoYW5nZVNlbGVjdG9yIiwic2VsZWN0b3IiLCJ1c2VySWQiLCJzcGFjZSIsInNwYWNlX3VzZXIiLCJfaWQiLCIkYW5kIiwibGVuZ3RoIiwiZ2V0UHJvcGVydHkiLCJmaW5kT25lIiwiZmllbGRzIiwicGFnaW5nVHlwZSIsIkpzb25Sb3V0ZXMiLCJhZGQiLCJyZXEiLCJyZXMiLCJuZXh0IiwicXVlcnkiLCJzZWxlY3RlZCIsInNwYWNlSWQiLCJzcGFjZVVzZXJzIiwidXNlcklkcyIsImJvZHkiLCJBcnJheSIsIiRpbiIsImZpbmQiLCJmZXRjaCIsImZvckVhY2giLCJ1IiwiZnUiLCJ1X29yZyIsInVfb3JncyIsInVzZXJfZmxvd19wb3NpdGlvbnMiLCJ1c2VyX3JvbGVfaWRzIiwidXNlcl9yb2xlcyIsImluZGV4T2YiLCJpZCIsInNvcnRfbm8iLCJtb2JpbGUiLCJ3b3JrX3Bob25lIiwicG9zaXRpb24iLCJvcmdhbml6YXRpb25zIiwib3JnYW5pemF0aW9uIiwiZnVsbG5hbWUiLCJociIsImZsb3dfcG9zaXRpb25zIiwiZmxvd19yb2xlcyIsInVzZXJzIiwicm9sZSIsInJvbGVzIiwicHVzaCIsInVJZCIsIl8iLCJzdSIsInNlbmRSZXN1bHQiLCJjb2RlIiwib3JnSWRzIiwib3JncyIsInJlc19vcmdzIiwib3JnIiwib0lkIiwibyJd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bGUiOiIvcGFja2FnZXMvc3RlZWRvc19hdXRvZm9ybS5qcyIsInNvdXJjZXNDb250ZW50IjpbIkBUYWJ1bGFyVGFibGVzID0ge307XHJcblxyXG5cclxuTWV0ZW9yLnN0YXJ0dXAgLT5cclxuXHRTaW1wbGVTY2hlbWEuZXh0ZW5kT3B0aW9ucyh7YmVmb3JlT3BlbkZ1bmN0aW9uOiBNYXRjaC5PcHRpb25hbChNYXRjaC5PbmVPZihGdW5jdGlvbiwgU3RyaW5nKSl9KSIsInRoaXMuVGFidWxhclRhYmxlcyA9IHt9O1xuXG5NZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIFNpbXBsZVNjaGVtYS5leHRlbmRPcHRpb25zKHtcbiAgICBiZWZvcmVPcGVuRnVuY3Rpb246IE1hdGNoLk9wdGlvbmFsKE1hdGNoLk9uZU9mKEZ1bmN0aW9uLCBTdHJpbmcpKVxuICB9KTtcbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgKCktPlxyXG5cdFRhYnVsYXJUYWJsZXMuY2ZfdGFidWxhcl9zcGFjZV91c2VyID0gbmV3IFRhYnVsYXIuVGFibGUoe1xyXG5cdFx0bmFtZTogXCJjZl90YWJ1bGFyX3NwYWNlX3VzZXJcIixcclxuXHRcdGNvbGxlY3Rpb246IGRiLnNwYWNlX3VzZXJzLFxyXG5cdFx0ZHJhd0NhbGxiYWNrOiAoc2V0dGluZ3MpLT5cclxuXHRcdFx0JChcIiNjZl9yZXZlcnNlXCIpLmF0dHIoXCJjaGVja2VkXCIsIGZhbHNlKVxyXG5cdFx0Y29sdW1uczogW1xyXG5cdFx0XHR7XHJcblx0XHRcdFx0ZGF0YTogXCJfaWRcIixcclxuXHRcdFx0XHR0aXRsZTogJzxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBuYW1lPVwiY2ZfcmV2ZXJzZVwiIGlkPVwiY2ZfcmV2ZXJzZVwiPicsXHJcblx0XHRcdFx0b3JkZXJhYmxlOiBmYWxzZSxcclxuXHRcdFx0XHR3aWR0aDonMTBweCcsXHJcblx0XHRcdFx0cmVuZGVyOiAgKHZhbCwgdHlwZSwgZG9jKSAtPlxyXG5cclxuXHRcdFx0XHRcdGlucHV0VHlwZSA9IFwiY2hlY2tib3hcIjtcclxuXHJcblx0XHRcdFx0XHRpZiAhVGFidWxhclRhYmxlcy5jZl90YWJ1bGFyX3NwYWNlX3VzZXIuY3VzdG9tRGF0YT8ubXVsdGlwbGVcclxuXHRcdFx0XHRcdFx0aW5wdXRUeXBlID0gXCJyYWRpb1wiXHJcblxyXG5cdFx0XHRcdFx0aW5wdXQgPSAnPGlucHV0IHR5cGU9XCInICsgaW5wdXRUeXBlICsgJ1wiIGNsYXNzPVwibGlzdF9jaGVja2JveFwiIG5hbWU9XCJjZl9jb250YWN0c19pZHNcIiBpZD1cIicgKyBkb2MudXNlciArICdcIiB2YWx1ZT1cIicgKyBkb2MudXNlciArICdcIiBkYXRhLW5hbWU9XCInICsgZG9jLm5hbWUgKyAnXCIgZGF0YS1lbWFpbD1cIicgKyBkb2MuZW1haWwgKyAnXCInO1xyXG5cclxuXHRcdFx0XHRcdGlmIFRhYnVsYXJUYWJsZXMuY2ZfdGFidWxhcl9zcGFjZV91c2VyLmN1c3RvbURhdGE/LmRlZmF1bHRWYWx1ZXM/LmluY2x1ZGVzKGRvYy51c2VyKVxyXG5cdFx0XHRcdFx0XHRpbnB1dCArPSBcIiBjaGVja2VkIFwiXHJcblxyXG5cdFx0XHRcdFx0aW5wdXQgKz0gXCI+XCJcclxuXHRcdFx0XHRcdHJldHVybiBpbnB1dFxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0ZGF0YTogXCJuYW1lXCIsXHJcblx0XHRcdFx0b3JkZXJhYmxlOiBmYWxzZSxcclxuXHRcdFx0XHRyZW5kZXI6ICAodmFsLCB0eXBlLCBkb2MpIC0+XHJcblx0XHRcdFx0XHRyZXR1cm4gXCI8bGFiZWwgZGF0YS11c2VyPSdcIiArIGRvYy51c2VyICsgXCInIGNsYXNzPSdmb3ItaW5wdXQnPjxkaXYgY2xhc3M9J3VzZXItbmFtZSc+PGltZyBzcmM9J1wiICsgU3RlZWRvcy5hYnNvbHV0ZVVybCgpICsgXCJhdmF0YXIvXCIrZG9jLnVzZXIrXCI/dz0yOCZoPTI1JmZzPTE0XCIgK1wiJyBjbGFzcz0nc2VsZWN0VGFnLXByb2ZpbGUgaW1nLWNpcmNsZSc+PGZvbnQ+XCIgKyBkb2MubmFtZSArIFwiPC9mb250PjwvZGl2PjwvbGFiZWw+XCJcclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGRhdGE6IFwic29ydF9ub1wiLFxyXG5cdFx0XHRcdHRpdGxlOiBcIlwiLFxyXG5cdFx0XHRcdG9yZGVyYWJsZTogdHJ1ZSxcclxuXHRcdFx0XHR2aXNpYmxlOiBmYWxzZVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0ZGF0YTogXCJuYW1lXCIsXHJcblx0XHRcdFx0dGl0bGU6IFwiXCIsXHJcblx0XHRcdFx0b3JkZXJhYmxlOiB0cnVlLFxyXG5cdFx0XHRcdHZpc2libGU6IGZhbHNlXHJcblx0XHRcdH0se1xyXG5cdFx0XHRcdGRhdGE6IFwiZW1haWxcIixcclxuXHRcdFx0XHR0aXRsZTogXCJcIixcclxuXHRcdFx0XHRvcmRlcmFibGU6IGZhbHNlLFxyXG5cdFx0XHRcdHZpc2libGU6IGZhbHNlXHJcblx0XHRcdH1cclxuXHRcdF0sXHJcblx0XHRvblVubG9hZDooKSAtPlxyXG5cdFx0XHRyZXR1cm4gY29uc29sZS5sb2coXCJvblVubG9hZCBvay4uLi5cIik7XHJcbiNzZWxlY3Q6XHJcbiMgIHN0eWxlOiAnc2luZ2xlJ1xyXG5cdFx0ZG9tOiBcInRwXCIsXHJcblx0XHRvcmRlcjpbWzIsXCJkZXNjXCJdLFszLFwiYXNjXCJdXSxcclxuXHRcdGV4dHJhRmllbGRzOiBbXCJfaWRcIiwgXCJuYW1lXCIsIFwidXNlclwiLCBcInNvcnRfbm9cIiwgXCJlbWFpbFwiXSxcclxuXHRcdGxlbmd0aENoYW5nZTogZmFsc2UsXHJcblx0XHRwYWdlTGVuZ3RoOiAxMDAsXHJcblx0XHRpbmZvOiBmYWxzZSxcclxuXHRcdHNlYXJjaGluZzogdHJ1ZSxcclxuXHRcdHJlc3BvbnNpdmU6XHJcblx0XHRcdGRldGFpbHM6IGZhbHNlXHJcblx0XHRhdXRvV2lkdGg6IGZhbHNlLFxyXG5cdFx0Y2hhbmdlU2VsZWN0b3I6IChzZWxlY3RvciwgdXNlcklkKSAtPlxyXG5cdFx0XHR1bmxlc3MgdXNlcklkXHJcblx0XHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxyXG5cdFx0XHRzcGFjZSA9IHNlbGVjdG9yLnNwYWNlXHJcblx0XHRcdHVubGVzcyBzcGFjZVxyXG5cdFx0XHRcdGlmIHNlbGVjdG9yPy4kYW5kPy5sZW5ndGggPiAwXHJcblx0XHRcdFx0XHRzcGFjZSA9IHNlbGVjdG9yLiRhbmQuZ2V0UHJvcGVydHkoJ3NwYWNlJylbMF1cclxuXHRcdFx0dW5sZXNzIHNwYWNlXHJcblx0XHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxyXG5cdFx0XHRzcGFjZV91c2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7dXNlcjogdXNlcklkLHNwYWNlOnNwYWNlfSwge2ZpZWxkczoge19pZDogMX19KVxyXG5cdFx0XHR1bmxlc3Mgc3BhY2VfdXNlclxyXG5cdFx0XHRcdHJldHVybiB7X2lkOiAtMX1cclxuXHRcdFx0cmV0dXJuIHNlbGVjdG9yXHJcblxyXG4jc2Nyb2xsWTogICAgICAgICc0MDBweCcsXHJcbiNzY3JvbGxDb2xsYXBzZTogdHJ1ZSxcclxuXHRcdHBhZ2luZ1R5cGU6IFwibnVtYmVyc1wiXHJcblxyXG5cdH0pO1xyXG4iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIFRhYnVsYXJUYWJsZXMuY2ZfdGFidWxhcl9zcGFjZV91c2VyID0gbmV3IFRhYnVsYXIuVGFibGUoe1xuICAgIG5hbWU6IFwiY2ZfdGFidWxhcl9zcGFjZV91c2VyXCIsXG4gICAgY29sbGVjdGlvbjogZGIuc3BhY2VfdXNlcnMsXG4gICAgZHJhd0NhbGxiYWNrOiBmdW5jdGlvbihzZXR0aW5ncykge1xuICAgICAgcmV0dXJuICQoXCIjY2ZfcmV2ZXJzZVwiKS5hdHRyKFwiY2hlY2tlZFwiLCBmYWxzZSk7XG4gICAgfSxcbiAgICBjb2x1bW5zOiBbXG4gICAgICB7XG4gICAgICAgIGRhdGE6IFwiX2lkXCIsXG4gICAgICAgIHRpdGxlOiAnPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIG5hbWU9XCJjZl9yZXZlcnNlXCIgaWQ9XCJjZl9yZXZlcnNlXCI+JyxcbiAgICAgICAgb3JkZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd2lkdGg6ICcxMHB4JyxcbiAgICAgICAgcmVuZGVyOiBmdW5jdGlvbih2YWwsIHR5cGUsIGRvYykge1xuICAgICAgICAgIHZhciBpbnB1dCwgaW5wdXRUeXBlLCByZWYsIHJlZjEsIHJlZjI7XG4gICAgICAgICAgaW5wdXRUeXBlID0gXCJjaGVja2JveFwiO1xuICAgICAgICAgIGlmICghKChyZWYgPSBUYWJ1bGFyVGFibGVzLmNmX3RhYnVsYXJfc3BhY2VfdXNlci5jdXN0b21EYXRhKSAhPSBudWxsID8gcmVmLm11bHRpcGxlIDogdm9pZCAwKSkge1xuICAgICAgICAgICAgaW5wdXRUeXBlID0gXCJyYWRpb1wiO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpbnB1dCA9ICc8aW5wdXQgdHlwZT1cIicgKyBpbnB1dFR5cGUgKyAnXCIgY2xhc3M9XCJsaXN0X2NoZWNrYm94XCIgbmFtZT1cImNmX2NvbnRhY3RzX2lkc1wiIGlkPVwiJyArIGRvYy51c2VyICsgJ1wiIHZhbHVlPVwiJyArIGRvYy51c2VyICsgJ1wiIGRhdGEtbmFtZT1cIicgKyBkb2MubmFtZSArICdcIiBkYXRhLWVtYWlsPVwiJyArIGRvYy5lbWFpbCArICdcIic7XG4gICAgICAgICAgaWYgKChyZWYxID0gVGFidWxhclRhYmxlcy5jZl90YWJ1bGFyX3NwYWNlX3VzZXIuY3VzdG9tRGF0YSkgIT0gbnVsbCA/IChyZWYyID0gcmVmMS5kZWZhdWx0VmFsdWVzKSAhPSBudWxsID8gcmVmMi5pbmNsdWRlcyhkb2MudXNlcikgOiB2b2lkIDAgOiB2b2lkIDApIHtcbiAgICAgICAgICAgIGlucHV0ICs9IFwiIGNoZWNrZWQgXCI7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlucHV0ICs9IFwiPlwiO1xuICAgICAgICAgIHJldHVybiBpbnB1dDtcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBkYXRhOiBcIm5hbWVcIixcbiAgICAgICAgb3JkZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgcmVuZGVyOiBmdW5jdGlvbih2YWwsIHR5cGUsIGRvYykge1xuICAgICAgICAgIHJldHVybiBcIjxsYWJlbCBkYXRhLXVzZXI9J1wiICsgZG9jLnVzZXIgKyBcIicgY2xhc3M9J2Zvci1pbnB1dCc+PGRpdiBjbGFzcz0ndXNlci1uYW1lJz48aW1nIHNyYz0nXCIgKyBTdGVlZG9zLmFic29sdXRlVXJsKCkgKyBcImF2YXRhci9cIiArIGRvYy51c2VyICsgXCI/dz0yOCZoPTI1JmZzPTE0XCIgKyBcIicgY2xhc3M9J3NlbGVjdFRhZy1wcm9maWxlIGltZy1jaXJjbGUnPjxmb250PlwiICsgZG9jLm5hbWUgKyBcIjwvZm9udD48L2Rpdj48L2xhYmVsPlwiO1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGRhdGE6IFwic29ydF9ub1wiLFxuICAgICAgICB0aXRsZTogXCJcIixcbiAgICAgICAgb3JkZXJhYmxlOiB0cnVlLFxuICAgICAgICB2aXNpYmxlOiBmYWxzZVxuICAgICAgfSwge1xuICAgICAgICBkYXRhOiBcIm5hbWVcIixcbiAgICAgICAgdGl0bGU6IFwiXCIsXG4gICAgICAgIG9yZGVyYWJsZTogdHJ1ZSxcbiAgICAgICAgdmlzaWJsZTogZmFsc2VcbiAgICAgIH0sIHtcbiAgICAgICAgZGF0YTogXCJlbWFpbFwiLFxuICAgICAgICB0aXRsZTogXCJcIixcbiAgICAgICAgb3JkZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgdmlzaWJsZTogZmFsc2VcbiAgICAgIH1cbiAgICBdLFxuICAgIG9uVW5sb2FkOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZyhcIm9uVW5sb2FkIG9rLi4uLlwiKTtcbiAgICB9LFxuICAgIGRvbTogXCJ0cFwiLFxuICAgIG9yZGVyOiBbWzIsIFwiZGVzY1wiXSwgWzMsIFwiYXNjXCJdXSxcbiAgICBleHRyYUZpZWxkczogW1wiX2lkXCIsIFwibmFtZVwiLCBcInVzZXJcIiwgXCJzb3J0X25vXCIsIFwiZW1haWxcIl0sXG4gICAgbGVuZ3RoQ2hhbmdlOiBmYWxzZSxcbiAgICBwYWdlTGVuZ3RoOiAxMDAsXG4gICAgaW5mbzogZmFsc2UsXG4gICAgc2VhcmNoaW5nOiB0cnVlLFxuICAgIHJlc3BvbnNpdmU6IHtcbiAgICAgIGRldGFpbHM6IGZhbHNlXG4gICAgfSxcbiAgICBhdXRvV2lkdGg6IGZhbHNlLFxuICAgIGNoYW5nZVNlbGVjdG9yOiBmdW5jdGlvbihzZWxlY3RvciwgdXNlcklkKSB7XG4gICAgICB2YXIgcmVmLCBzcGFjZSwgc3BhY2VfdXNlcjtcbiAgICAgIGlmICghdXNlcklkKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgX2lkOiAtMVxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgc3BhY2UgPSBzZWxlY3Rvci5zcGFjZTtcbiAgICAgIGlmICghc3BhY2UpIHtcbiAgICAgICAgaWYgKChzZWxlY3RvciAhPSBudWxsID8gKHJlZiA9IHNlbGVjdG9yLiRhbmQpICE9IG51bGwgPyByZWYubGVuZ3RoIDogdm9pZCAwIDogdm9pZCAwKSA+IDApIHtcbiAgICAgICAgICBzcGFjZSA9IHNlbGVjdG9yLiRhbmQuZ2V0UHJvcGVydHkoJ3NwYWNlJylbMF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICghc3BhY2UpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBfaWQ6IC0xXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBzcGFjZV91c2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7XG4gICAgICAgIHVzZXI6IHVzZXJJZCxcbiAgICAgICAgc3BhY2U6IHNwYWNlXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGlmICghc3BhY2VfdXNlcikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIF9pZDogLTFcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzZWxlY3RvcjtcbiAgICB9LFxuICAgIHBhZ2luZ1R5cGU6IFwibnVtYmVyc1wiXG4gIH0pO1xufSk7XG4iLCJNZXRlb3Iuc3RhcnR1cCAtPlxyXG5cdEpzb25Sb3V0ZXMuYWRkIFwicG9zdFwiLCBcIi9hcGkvZm9ybXVsYS9zcGFjZV91c2Vyc1wiLCAocmVxLCByZXMsIG5leHQpIC0+XHJcblx0XHR1c2VySWRzID0gcmVxLmJvZHkudXNlcklkc1xyXG5cdFx0c3BhY2VJZCA9IHJlcS5xdWVyeS5zcGFjZUlkXHJcblxyXG5cdFx0c3BhY2VVc2VycyA9IFtdXHJcblxyXG5cdFx0ZGF0YSA9IFtdXHJcblxyXG5cdFx0aWYgKHVzZXJJZHMpXHJcblxyXG5cdFx0XHRpZiBub3QgdXNlcklkcyBpbnN0YW5jZW9mIEFycmF5XHJcblx0XHRcdFx0dXNlcklkcyA9IFt1c2VySWRzXVxyXG5cclxuXHRcdFx0cXVlcnkgPSB7XHJcblx0XHRcdFx0dXNlcjoge1xyXG5cdFx0XHRcdFx0JGluOiB1c2VySWRzXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiBzcGFjZUlkXHJcblx0XHRcdFx0cXVlcnkuc3BhY2UgPSBzcGFjZUlkXHJcblxyXG5cdFx0XHRzcGFjZV91c2VycyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQocXVlcnkpLmZldGNoKCk7XHJcblxyXG5cdFx0XHRzZWxlY3RlZCA9IFtdXHJcblxyXG5cdFx0XHRzcGFjZV91c2Vycy5mb3JFYWNoICh1KS0+XHJcblx0XHRcdFx0aWYgc2VsZWN0ZWQuaW5kZXhPZih1LnVzZXIpIDwgMFxyXG5cdFx0XHRcdFx0ZnUgPSB7fVxyXG5cclxuXHRcdFx0XHRcdGZ1LmlkID0gdS51c2VyXHJcblxyXG5cdFx0XHRcdFx0ZnUubmFtZSA9IHUubmFtZVxyXG5cclxuXHRcdFx0XHRcdGZ1LnNvcnRfbm8gPSB1LnNvcnRfbm9cclxuXHJcblx0XHRcdFx0XHRmdS5tb2JpbGUgPSB1Lm1vYmlsZVxyXG5cclxuXHRcdFx0XHRcdGZ1LndvcmtfcGhvbmUgPSB1LndvcmtfcGhvbmVcclxuXHJcblx0XHRcdFx0XHRmdS5wb3NpdGlvbiA9IHUucG9zaXRpb25cclxuXHJcblx0XHRcdFx0XHR1X29yZyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZE9uZSh7X2lkOiB1Lm9yZ2FuaXphdGlvbn0sIHtmaWVsZHM6IHtuYW1lOiAxLCBmdWxsbmFtZTogMX19KVxyXG5cclxuXHRcdFx0XHRcdHVfb3JncyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7X2lkOiB7JGluOiB1Lm9yZ2FuaXphdGlvbnN9fSwge2ZpZWxkczoge25hbWU6IDEsIGZ1bGxuYW1lOiAxfX0pLmZldGNoKClcclxuXHJcblxyXG5cdFx0XHRcdFx0ZnUub3JnYW5pemF0aW9uID0ge1xyXG5cdFx0XHRcdFx0XHRuYW1lOiB1X29yZz8ubmFtZSxcclxuXHRcdFx0XHRcdFx0ZnVsbG5hbWU6IHVfb3JnPy5mdWxsbmFtZVxyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGZ1Lm9yZ2FuaXphdGlvbnMgPSB7XHJcblx0XHRcdFx0XHRcdG5hbWU6IHVfb3Jncz8uZ2V0UHJvcGVydHkoXCJuYW1lXCIpLFxyXG5cdFx0XHRcdFx0XHRmdWxsbmFtZTogdV9vcmdzPy5nZXRQcm9wZXJ0eShcImZ1bGxuYW1lXCIpLFxyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGZ1LmhyID0gdS5ociB8fCB7fVxyXG5cclxuXHRcdFx0XHRcdGlmIGRiLmZsb3dfcG9zaXRpb25zICYmIGRiLmZsb3dfcm9sZXNcclxuXHJcblx0XHRcdFx0XHRcdHVzZXJfZmxvd19wb3NpdGlvbnMgPSBkYi5mbG93X3Bvc2l0aW9ucy5maW5kKHtzcGFjZTogdS5zcGFjZSwgdXNlcnM6IHUudXNlcn0sIHtmaWVsZHM6IHtyb2xlOiAxfX0pLmZldGNoKCk7XHJcblxyXG5cdFx0XHRcdFx0XHR1c2VyX3JvbGVfaWRzID0gdXNlcl9mbG93X3Bvc2l0aW9ucy5nZXRQcm9wZXJ0eShcInJvbGVcIik7XHJcblxyXG5cdFx0XHRcdFx0XHR1c2VyX3JvbGVzID0gZGIuZmxvd19yb2xlcy5maW5kKHtfaWQ6IHskaW46IHVzZXJfcm9sZV9pZHN9fSwge2ZpZWxkczoge25hbWU6IDF9fSkuZmV0Y2goKTtcclxuXHJcblx0XHRcdFx0XHRcdGZ1LnJvbGVzID0gdXNlcl9yb2xlcy5nZXRQcm9wZXJ0eShcIm5hbWVcIilcclxuXHJcblx0XHRcdFx0XHRkYXRhLnB1c2ggZnVcclxuXHJcblx0XHRcdFx0XHRzZWxlY3RlZC5wdXNoIHUudXNlclxyXG5cclxuXHRcdFx0dXNlcklkcy5mb3JFYWNoICh1SWQpLT5cclxuXHRcdFx0XHRzcGFjZVVzZXJzLnB1c2ggXy5maW5kKGRhdGEsIChzdSktPiByZXR1cm4gc3UuaWQgPT0gdUlkKVxyXG5cclxuXHJcblx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XHJcblx0XHRcdGNvZGU6IDIwMCxcclxuXHRcdFx0ZGF0YToge1xyXG5cdFx0XHRcdCdzcGFjZVVzZXJzJzogc3BhY2VVc2Vyc1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gSnNvblJvdXRlcy5hZGQoXCJwb3N0XCIsIFwiL2FwaS9mb3JtdWxhL3NwYWNlX3VzZXJzXCIsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gICAgdmFyIGRhdGEsIHF1ZXJ5LCBzZWxlY3RlZCwgc3BhY2VJZCwgc3BhY2VVc2Vycywgc3BhY2VfdXNlcnMsIHVzZXJJZHM7XG4gICAgdXNlcklkcyA9IHJlcS5ib2R5LnVzZXJJZHM7XG4gICAgc3BhY2VJZCA9IHJlcS5xdWVyeS5zcGFjZUlkO1xuICAgIHNwYWNlVXNlcnMgPSBbXTtcbiAgICBkYXRhID0gW107XG4gICAgaWYgKHVzZXJJZHMpIHtcbiAgICAgIGlmICghdXNlcklkcyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgIHVzZXJJZHMgPSBbdXNlcklkc107XG4gICAgICB9XG4gICAgICBxdWVyeSA9IHtcbiAgICAgICAgdXNlcjoge1xuICAgICAgICAgICRpbjogdXNlcklkc1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgaWYgKHNwYWNlSWQpIHtcbiAgICAgICAgcXVlcnkuc3BhY2UgPSBzcGFjZUlkO1xuICAgICAgfVxuICAgICAgc3BhY2VfdXNlcnMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHF1ZXJ5KS5mZXRjaCgpO1xuICAgICAgc2VsZWN0ZWQgPSBbXTtcbiAgICAgIHNwYWNlX3VzZXJzLmZvckVhY2goZnVuY3Rpb24odSkge1xuICAgICAgICB2YXIgZnUsIHVfb3JnLCB1X29yZ3MsIHVzZXJfZmxvd19wb3NpdGlvbnMsIHVzZXJfcm9sZV9pZHMsIHVzZXJfcm9sZXM7XG4gICAgICAgIGlmIChzZWxlY3RlZC5pbmRleE9mKHUudXNlcikgPCAwKSB7XG4gICAgICAgICAgZnUgPSB7fTtcbiAgICAgICAgICBmdS5pZCA9IHUudXNlcjtcbiAgICAgICAgICBmdS5uYW1lID0gdS5uYW1lO1xuICAgICAgICAgIGZ1LnNvcnRfbm8gPSB1LnNvcnRfbm87XG4gICAgICAgICAgZnUubW9iaWxlID0gdS5tb2JpbGU7XG4gICAgICAgICAgZnUud29ya19waG9uZSA9IHUud29ya19waG9uZTtcbiAgICAgICAgICBmdS5wb3NpdGlvbiA9IHUucG9zaXRpb247XG4gICAgICAgICAgdV9vcmcgPSBkYi5vcmdhbml6YXRpb25zLmZpbmRPbmUoe1xuICAgICAgICAgICAgX2lkOiB1Lm9yZ2FuaXphdGlvblxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICBuYW1lOiAxLFxuICAgICAgICAgICAgICBmdWxsbmFtZTogMVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHVfb3JncyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7XG4gICAgICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAgICAgJGluOiB1Lm9yZ2FuaXphdGlvbnNcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgbmFtZTogMSxcbiAgICAgICAgICAgICAgZnVsbG5hbWU6IDFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KS5mZXRjaCgpO1xuICAgICAgICAgIGZ1Lm9yZ2FuaXphdGlvbiA9IHtcbiAgICAgICAgICAgIG5hbWU6IHVfb3JnICE9IG51bGwgPyB1X29yZy5uYW1lIDogdm9pZCAwLFxuICAgICAgICAgICAgZnVsbG5hbWU6IHVfb3JnICE9IG51bGwgPyB1X29yZy5mdWxsbmFtZSA6IHZvaWQgMFxuICAgICAgICAgIH07XG4gICAgICAgICAgZnUub3JnYW5pemF0aW9ucyA9IHtcbiAgICAgICAgICAgIG5hbWU6IHVfb3JncyAhPSBudWxsID8gdV9vcmdzLmdldFByb3BlcnR5KFwibmFtZVwiKSA6IHZvaWQgMCxcbiAgICAgICAgICAgIGZ1bGxuYW1lOiB1X29yZ3MgIT0gbnVsbCA/IHVfb3Jncy5nZXRQcm9wZXJ0eShcImZ1bGxuYW1lXCIpIDogdm9pZCAwXG4gICAgICAgICAgfTtcbiAgICAgICAgICBmdS5ociA9IHUuaHIgfHwge307XG4gICAgICAgICAgaWYgKGRiLmZsb3dfcG9zaXRpb25zICYmIGRiLmZsb3dfcm9sZXMpIHtcbiAgICAgICAgICAgIHVzZXJfZmxvd19wb3NpdGlvbnMgPSBkYi5mbG93X3Bvc2l0aW9ucy5maW5kKHtcbiAgICAgICAgICAgICAgc3BhY2U6IHUuc3BhY2UsXG4gICAgICAgICAgICAgIHVzZXJzOiB1LnVzZXJcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgICAgcm9sZTogMVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS5mZXRjaCgpO1xuICAgICAgICAgICAgdXNlcl9yb2xlX2lkcyA9IHVzZXJfZmxvd19wb3NpdGlvbnMuZ2V0UHJvcGVydHkoXCJyb2xlXCIpO1xuICAgICAgICAgICAgdXNlcl9yb2xlcyA9IGRiLmZsb3dfcm9sZXMuZmluZCh7XG4gICAgICAgICAgICAgIF9pZDoge1xuICAgICAgICAgICAgICAgICRpbjogdXNlcl9yb2xlX2lkc1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICAgIG5hbWU6IDFcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkuZmV0Y2goKTtcbiAgICAgICAgICAgIGZ1LnJvbGVzID0gdXNlcl9yb2xlcy5nZXRQcm9wZXJ0eShcIm5hbWVcIik7XG4gICAgICAgICAgfVxuICAgICAgICAgIGRhdGEucHVzaChmdSk7XG4gICAgICAgICAgcmV0dXJuIHNlbGVjdGVkLnB1c2godS51c2VyKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB1c2VySWRzLmZvckVhY2goZnVuY3Rpb24odUlkKSB7XG4gICAgICAgIHJldHVybiBzcGFjZVVzZXJzLnB1c2goXy5maW5kKGRhdGEsIGZ1bmN0aW9uKHN1KSB7XG4gICAgICAgICAgcmV0dXJuIHN1LmlkID09PSB1SWQ7XG4gICAgICAgIH0pKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogMjAwLFxuICAgICAgZGF0YToge1xuICAgICAgICAnc3BhY2VVc2Vycyc6IHNwYWNlVXNlcnNcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwIC0+XHJcblx0SnNvblJvdXRlcy5hZGQgXCJwb3N0XCIsIFwiL2FwaS9mb3JtdWxhL29yZ2FuaXphdGlvbnNcIiwgKHJlcSwgcmVzLCBuZXh0KSAtPlxyXG5cclxuXHRcdHJlc19vcmdzID0gW11cclxuXHJcblx0XHRkYXRhID0gW11cclxuXHJcblx0XHRvcmdJZHMgPSByZXEuYm9keS5vcmdJZHNcclxuXHJcblx0XHRzcGFjZUlkID0gcmVxLnF1ZXJ5LnNwYWNlSWRcclxuXHJcblx0XHRpZiBvcmdJZHNcclxuXHRcdFx0aWYgbm90IG9yZ0lkcyBpbnN0YW5jZW9mIEFycmF5XHJcblx0XHRcdFx0b3JnSWRzID0gW29yZ0lkc11cclxuXHJcblx0XHRcdHF1ZXJ5ID0ge19pZDogeyRpbjogb3JnSWRzfX1cclxuXHJcblx0XHRcdGlmIHNwYWNlSWRcclxuXHRcdFx0XHRxdWVyeS5zcGFjZSA9IHNwYWNlSWRcclxuXHJcblx0XHRcdG9yZ3MgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQocXVlcnksIHtmaWVsZHM6IHtuYW1lOiAxLCBmdWxsbmFtZTogMX19KS5mZXRjaCgpO1xyXG5cclxuXHRcdFx0b3Jncy5mb3JFYWNoIChvcmcpLT5cclxuXHRcdFx0XHRkYXRhLnB1c2gge2lkOiBvcmcuX2lkLCBuYW1lOiBvcmcubmFtZSwgZnVsbG5hbWU6IG9yZy5mdWxsbmFtZX1cclxuXHJcblx0XHRcdG9yZ0lkcy5mb3JFYWNoIChvSWQpLT5cclxuXHRcdFx0XHRyZXNfb3Jncy5wdXNoIF8uZmluZChkYXRhLCAobyktPiByZXR1cm4gby5pZCA9PSBvSWQpXHJcblxyXG5cclxuXHJcblx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XHJcblx0XHRcdGNvZGU6IDIwMCxcclxuXHRcdFx0ZGF0YToge1xyXG5cdFx0XHRcdCdvcmdzJzogcmVzX29yZ3NcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG4iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIEpzb25Sb3V0ZXMuYWRkKFwicG9zdFwiLCBcIi9hcGkvZm9ybXVsYS9vcmdhbml6YXRpb25zXCIsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gICAgdmFyIGRhdGEsIG9yZ0lkcywgb3JncywgcXVlcnksIHJlc19vcmdzLCBzcGFjZUlkO1xuICAgIHJlc19vcmdzID0gW107XG4gICAgZGF0YSA9IFtdO1xuICAgIG9yZ0lkcyA9IHJlcS5ib2R5Lm9yZ0lkcztcbiAgICBzcGFjZUlkID0gcmVxLnF1ZXJ5LnNwYWNlSWQ7XG4gICAgaWYgKG9yZ0lkcykge1xuICAgICAgaWYgKCFvcmdJZHMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICBvcmdJZHMgPSBbb3JnSWRzXTtcbiAgICAgIH1cbiAgICAgIHF1ZXJ5ID0ge1xuICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAkaW46IG9yZ0lkc1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgaWYgKHNwYWNlSWQpIHtcbiAgICAgICAgcXVlcnkuc3BhY2UgPSBzcGFjZUlkO1xuICAgICAgfVxuICAgICAgb3JncyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZChxdWVyeSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBuYW1lOiAxLFxuICAgICAgICAgIGZ1bGxuYW1lOiAxXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgICBvcmdzLmZvckVhY2goZnVuY3Rpb24ob3JnKSB7XG4gICAgICAgIHJldHVybiBkYXRhLnB1c2goe1xuICAgICAgICAgIGlkOiBvcmcuX2lkLFxuICAgICAgICAgIG5hbWU6IG9yZy5uYW1lLFxuICAgICAgICAgIGZ1bGxuYW1lOiBvcmcuZnVsbG5hbWVcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIG9yZ0lkcy5mb3JFYWNoKGZ1bmN0aW9uKG9JZCkge1xuICAgICAgICByZXR1cm4gcmVzX29yZ3MucHVzaChfLmZpbmQoZGF0YSwgZnVuY3Rpb24obykge1xuICAgICAgICAgIHJldHVybiBvLmlkID09PSBvSWQ7XG4gICAgICAgIH0pKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogMjAwLFxuICAgICAgZGF0YToge1xuICAgICAgICAnb3Jncyc6IHJlc19vcmdzXG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=
