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
    pagingType: "numbers"
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hdXRvZm9ybS9jbGllbnQvY29yZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2NsaWVudC9jb3JlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hdXRvZm9ybS9jbGllbnQvY29yZWZvcm0vaW5wdXRUeXBlcy9jb3JlZm9ybS11c2VyL2xpYi9jZl90YWJ1bGFyX3NwYWNlX3VzZXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9jbGllbnQvY29yZWZvcm0vaW5wdXRUeXBlcy9jb3JlZm9ybS11c2VyL2xpYi9jZl90YWJ1bGFyX3NwYWNlX3VzZXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2F1dG9mb3JtL3JvdXRlcy9mb3JtdWxhX3NwYWNlX3VzZXJzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcm91dGVzL2Zvcm11bGFfc3BhY2VfdXNlcnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2F1dG9mb3JtL3JvdXRlcy9mb3JtdWxhX29yZ2FuaXphdGlvbnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9yb3V0ZXMvZm9ybXVsYV9vcmdhbml6YXRpb25zLmNvZmZlZSJdLCJuYW1lcyI6WyJUYWJ1bGFyVGFibGVzIiwiTWV0ZW9yIiwic3RhcnR1cCIsIlNpbXBsZVNjaGVtYSIsImV4dGVuZE9wdGlvbnMiLCJiZWZvcmVPcGVuRnVuY3Rpb24iLCJNYXRjaCIsIk9wdGlvbmFsIiwiT25lT2YiLCJGdW5jdGlvbiIsIlN0cmluZyIsImNmX3RhYnVsYXJfc3BhY2VfdXNlciIsIlRhYnVsYXIiLCJUYWJsZSIsIm5hbWUiLCJjb2xsZWN0aW9uIiwiZGIiLCJzcGFjZV91c2VycyIsImRyYXdDYWxsYmFjayIsInNldHRpbmdzIiwiJCIsImF0dHIiLCJjb2x1bW5zIiwiZGF0YSIsInRpdGxlIiwib3JkZXJhYmxlIiwid2lkdGgiLCJyZW5kZXIiLCJ2YWwiLCJ0eXBlIiwiZG9jIiwiaW5wdXQiLCJpbnB1dFR5cGUiLCJyZWYiLCJyZWYxIiwicmVmMiIsImN1c3RvbURhdGEiLCJtdWx0aXBsZSIsInVzZXIiLCJlbWFpbCIsImRlZmF1bHRWYWx1ZXMiLCJpbmNsdWRlcyIsInZpc2libGUiLCJvblVubG9hZCIsImNvbnNvbGUiLCJsb2ciLCJkb20iLCJvcmRlciIsImV4dHJhRmllbGRzIiwibGVuZ3RoQ2hhbmdlIiwicGFnZUxlbmd0aCIsImluZm8iLCJzZWFyY2hpbmciLCJyZXNwb25zaXZlIiwiZGV0YWlscyIsImF1dG9XaWR0aCIsImNoYW5nZVNlbGVjdG9yIiwic2VsZWN0b3IiLCJ1c2VySWQiLCJzcGFjZSIsInNwYWNlX3VzZXIiLCJfaWQiLCIkYW5kIiwibGVuZ3RoIiwiZ2V0UHJvcGVydHkiLCJmaW5kT25lIiwiZmllbGRzIiwicGFnaW5nVHlwZSIsIkpzb25Sb3V0ZXMiLCJhZGQiLCJyZXEiLCJyZXMiLCJuZXh0IiwicXVlcnkiLCJzZWxlY3RlZCIsInNwYWNlSWQiLCJzcGFjZVVzZXJzIiwidXNlcklkcyIsImJvZHkiLCJBcnJheSIsIiRpbiIsImZpbmQiLCJmZXRjaCIsImZvckVhY2giLCJ1IiwiZnUiLCJ1X29yZyIsInVfb3JncyIsInVzZXJfZmxvd19wb3NpdGlvbnMiLCJ1c2VyX3JvbGVfaWRzIiwidXNlcl9yb2xlcyIsImluZGV4T2YiLCJpZCIsInNvcnRfbm8iLCJtb2JpbGUiLCJ3b3JrX3Bob25lIiwicG9zaXRpb24iLCJvcmdhbml6YXRpb25zIiwib3JnYW5pemF0aW9uIiwiZnVsbG5hbWUiLCJociIsImZsb3dfcG9zaXRpb25zIiwiZmxvd19yb2xlcyIsInVzZXJzIiwicm9sZSIsInJvbGVzIiwicHVzaCIsInVJZCIsIl8iLCJzdSIsInNlbmRSZXN1bHQiLCJjb2RlIiwib3JnSWRzIiwib3JncyIsInJlc19vcmdzIiwib3JnIiwib0lkIiwibyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7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O0FBRUEsUUFBR3FDLE1BQUg7QUFDQyxVQUFHLENBQUlBLE1BQUosWUFBc0JqQyxLQUF6QjtBQUNDaUMsaUJBQVMsQ0FBQ0EsTUFBRCxDQUFUO0FDSEc7O0FES0p2QyxjQUFRO0FBQUNaLGFBQUs7QUFBQ21CLGVBQUtnQztBQUFOO0FBQU4sT0FBUjs7QUFFQSxVQUFHckMsT0FBSDtBQUNDRixjQUFNZCxLQUFOLEdBQWNnQixPQUFkO0FDQUc7O0FERUpzQyxhQUFPakcsR0FBR2lGLGFBQUgsQ0FBaUJoQixJQUFqQixDQUFzQlIsS0FBdEIsRUFBNkI7QUFBQ1AsZ0JBQVE7QUFBQ3BELGdCQUFNLENBQVA7QUFBVXFGLG9CQUFVO0FBQXBCO0FBQVQsT0FBN0IsRUFBK0RqQixLQUEvRCxFQUFQO0FBRUErQixXQUFLOUIsT0FBTCxDQUFhLFVBQUNnQyxHQUFEO0FDSVIsZURISjVGLEtBQUttRixJQUFMLENBQVU7QUFBQ2QsY0FBSXVCLElBQUl0RCxHQUFUO0FBQWMvQyxnQkFBTXFHLElBQUlyRyxJQUF4QjtBQUE4QnFGLG9CQUFVZ0IsSUFBSWhCO0FBQTVDLFNBQVYsQ0NHSTtBREpMO0FBR0FhLGFBQU83QixPQUFQLENBQWUsVUFBQ2lDLEdBQUQ7QUNRVixlRFBKRixTQUFTUixJQUFULENBQWNFLEVBQUUzQixJQUFGLENBQU8xRCxJQUFQLEVBQWEsVUFBQzhGLENBQUQ7QUFBTSxpQkFBT0EsRUFBRXpCLEVBQUYsS0FBUXdCLEdBQWY7QUFBbkIsVUFBZCxDQ09JO0FEUkw7QUNZRTs7QUFDRCxXRFJGaEQsV0FBVzBDLFVBQVgsQ0FBc0J2QyxHQUF0QixFQUEyQjtBQUMxQndDLFlBQU0sR0FEb0I7QUFFMUJ4RixZQUFNO0FBQ0wsZ0JBQVEyRjtBQURIO0FBRm9CLEtBQTNCLENDUUU7QURyQ0gsSUNBQztBRERGLEciLCJmaWxlIjoiL3BhY2thZ2VzL3N0ZWVkb3NfYXV0b2Zvcm0uanMiLCJzb3VyY2VzQ29udGVudCI6WyJAVGFidWxhclRhYmxlcyA9IHt9O1xyXG5cclxuXHJcbk1ldGVvci5zdGFydHVwIC0+XHJcblx0U2ltcGxlU2NoZW1hLmV4dGVuZE9wdGlvbnMoe2JlZm9yZU9wZW5GdW5jdGlvbjogTWF0Y2guT3B0aW9uYWwoTWF0Y2guT25lT2YoRnVuY3Rpb24sIFN0cmluZykpfSkiLCJ0aGlzLlRhYnVsYXJUYWJsZXMgPSB7fTtcblxuTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBTaW1wbGVTY2hlbWEuZXh0ZW5kT3B0aW9ucyh7XG4gICAgYmVmb3JlT3BlbkZ1bmN0aW9uOiBNYXRjaC5PcHRpb25hbChNYXRjaC5PbmVPZihGdW5jdGlvbiwgU3RyaW5nKSlcbiAgfSk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwICgpLT5cclxuXHRUYWJ1bGFyVGFibGVzLmNmX3RhYnVsYXJfc3BhY2VfdXNlciA9IG5ldyBUYWJ1bGFyLlRhYmxlKHtcclxuXHRcdG5hbWU6IFwiY2ZfdGFidWxhcl9zcGFjZV91c2VyXCIsXHJcblx0XHRjb2xsZWN0aW9uOiBkYi5zcGFjZV91c2VycyxcclxuXHRcdGRyYXdDYWxsYmFjazogKHNldHRpbmdzKS0+XHJcblx0XHRcdCQoXCIjY2ZfcmV2ZXJzZVwiKS5hdHRyKFwiY2hlY2tlZFwiLCBmYWxzZSlcclxuXHRcdGNvbHVtbnM6IFtcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGRhdGE6IFwiX2lkXCIsXHJcblx0XHRcdFx0dGl0bGU6ICc8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgbmFtZT1cImNmX3JldmVyc2VcIiBpZD1cImNmX3JldmVyc2VcIj4nLFxyXG5cdFx0XHRcdG9yZGVyYWJsZTogZmFsc2UsXHJcblx0XHRcdFx0d2lkdGg6JzEwcHgnLFxyXG5cdFx0XHRcdHJlbmRlcjogICh2YWwsIHR5cGUsIGRvYykgLT5cclxuXHJcblx0XHRcdFx0XHRpbnB1dFR5cGUgPSBcImNoZWNrYm94XCI7XHJcblxyXG5cdFx0XHRcdFx0aWYgIVRhYnVsYXJUYWJsZXMuY2ZfdGFidWxhcl9zcGFjZV91c2VyLmN1c3RvbURhdGE/Lm11bHRpcGxlXHJcblx0XHRcdFx0XHRcdGlucHV0VHlwZSA9IFwicmFkaW9cIlxyXG5cclxuXHRcdFx0XHRcdGlucHV0ID0gJzxpbnB1dCB0eXBlPVwiJyArIGlucHV0VHlwZSArICdcIiBjbGFzcz1cImxpc3RfY2hlY2tib3hcIiBuYW1lPVwiY2ZfY29udGFjdHNfaWRzXCIgaWQ9XCInICsgZG9jLnVzZXIgKyAnXCIgdmFsdWU9XCInICsgZG9jLnVzZXIgKyAnXCIgZGF0YS1uYW1lPVwiJyArIGRvYy5uYW1lICsgJ1wiIGRhdGEtZW1haWw9XCInICsgZG9jLmVtYWlsICsgJ1wiJztcclxuXHJcblx0XHRcdFx0XHRpZiBUYWJ1bGFyVGFibGVzLmNmX3RhYnVsYXJfc3BhY2VfdXNlci5jdXN0b21EYXRhPy5kZWZhdWx0VmFsdWVzPy5pbmNsdWRlcyhkb2MudXNlcilcclxuXHRcdFx0XHRcdFx0aW5wdXQgKz0gXCIgY2hlY2tlZCBcIlxyXG5cclxuXHRcdFx0XHRcdGlucHV0ICs9IFwiPlwiXHJcblx0XHRcdFx0XHRyZXR1cm4gaW5wdXRcclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGRhdGE6IFwibmFtZVwiLFxyXG5cdFx0XHRcdG9yZGVyYWJsZTogZmFsc2UsXHJcblx0XHRcdFx0cmVuZGVyOiAgKHZhbCwgdHlwZSwgZG9jKSAtPlxyXG5cdFx0XHRcdFx0cmV0dXJuIFwiPGxhYmVsIGRhdGEtdXNlcj0nXCIgKyBkb2MudXNlciArIFwiJyBjbGFzcz0nZm9yLWlucHV0Jz48ZGl2IGNsYXNzPSd1c2VyLW5hbWUnPjxmb250PlwiICsgZG9jLm5hbWUgKyBcIjwvZm9udD48L2Rpdj48L2xhYmVsPlwiXHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRkYXRhOiBcInNvcnRfbm9cIixcclxuXHRcdFx0XHR0aXRsZTogXCJcIixcclxuXHRcdFx0XHRvcmRlcmFibGU6IHRydWUsXHJcblx0XHRcdFx0dmlzaWJsZTogZmFsc2VcclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGRhdGE6IFwibmFtZVwiLFxyXG5cdFx0XHRcdHRpdGxlOiBcIlwiLFxyXG5cdFx0XHRcdG9yZGVyYWJsZTogdHJ1ZSxcclxuXHRcdFx0XHR2aXNpYmxlOiBmYWxzZVxyXG5cdFx0XHR9LHtcclxuXHRcdFx0XHRkYXRhOiBcImVtYWlsXCIsXHJcblx0XHRcdFx0dGl0bGU6IFwiXCIsXHJcblx0XHRcdFx0b3JkZXJhYmxlOiBmYWxzZSxcclxuXHRcdFx0XHR2aXNpYmxlOiBmYWxzZVxyXG5cdFx0XHR9XHJcblx0XHRdLFxyXG5cdFx0b25VbmxvYWQ6KCkgLT5cclxuXHRcdFx0cmV0dXJuIGNvbnNvbGUubG9nKFwib25VbmxvYWQgb2suLi4uXCIpO1xyXG4jc2VsZWN0OlxyXG4jICBzdHlsZTogJ3NpbmdsZSdcclxuXHRcdGRvbTogXCJ0cFwiLFxyXG5cdFx0b3JkZXI6W1syLFwiZGVzY1wiXSxbMyxcImFzY1wiXV0sXHJcblx0XHRleHRyYUZpZWxkczogW1wiX2lkXCIsIFwibmFtZVwiLCBcInVzZXJcIiwgXCJzb3J0X25vXCIsIFwiZW1haWxcIl0sXHJcblx0XHRsZW5ndGhDaGFuZ2U6IGZhbHNlLFxyXG5cdFx0cGFnZUxlbmd0aDogMTAwLFxyXG5cdFx0aW5mbzogZmFsc2UsXHJcblx0XHRzZWFyY2hpbmc6IHRydWUsXHJcblx0XHRyZXNwb25zaXZlOlxyXG5cdFx0XHRkZXRhaWxzOiBmYWxzZVxyXG5cdFx0YXV0b1dpZHRoOiBmYWxzZSxcclxuXHRcdGNoYW5nZVNlbGVjdG9yOiAoc2VsZWN0b3IsIHVzZXJJZCkgLT5cclxuXHRcdFx0dW5sZXNzIHVzZXJJZFxyXG5cdFx0XHRcdHJldHVybiB7X2lkOiAtMX1cclxuXHRcdFx0c3BhY2UgPSBzZWxlY3Rvci5zcGFjZVxyXG5cdFx0XHR1bmxlc3Mgc3BhY2VcclxuXHRcdFx0XHRpZiBzZWxlY3Rvcj8uJGFuZD8ubGVuZ3RoID4gMFxyXG5cdFx0XHRcdFx0c3BhY2UgPSBzZWxlY3Rvci4kYW5kLmdldFByb3BlcnR5KCdzcGFjZScpWzBdXHJcblx0XHRcdHVubGVzcyBzcGFjZVxyXG5cdFx0XHRcdHJldHVybiB7X2lkOiAtMX1cclxuXHRcdFx0c3BhY2VfdXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe3VzZXI6IHVzZXJJZCxzcGFjZTpzcGFjZX0sIHtmaWVsZHM6IHtfaWQ6IDF9fSlcclxuXHRcdFx0dW5sZXNzIHNwYWNlX3VzZXJcclxuXHRcdFx0XHRyZXR1cm4ge19pZDogLTF9XHJcblx0XHRcdHJldHVybiBzZWxlY3RvclxyXG5cclxuI3Njcm9sbFk6ICAgICAgICAnNDAwcHgnLFxyXG4jc2Nyb2xsQ29sbGFwc2U6IHRydWUsXHJcblx0XHRwYWdpbmdUeXBlOiBcIm51bWJlcnNcIlxyXG5cclxuXHR9KTtcclxuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBUYWJ1bGFyVGFibGVzLmNmX3RhYnVsYXJfc3BhY2VfdXNlciA9IG5ldyBUYWJ1bGFyLlRhYmxlKHtcbiAgICBuYW1lOiBcImNmX3RhYnVsYXJfc3BhY2VfdXNlclwiLFxuICAgIGNvbGxlY3Rpb246IGRiLnNwYWNlX3VzZXJzLFxuICAgIGRyYXdDYWxsYmFjazogZnVuY3Rpb24oc2V0dGluZ3MpIHtcbiAgICAgIHJldHVybiAkKFwiI2NmX3JldmVyc2VcIikuYXR0cihcImNoZWNrZWRcIiwgZmFsc2UpO1xuICAgIH0sXG4gICAgY29sdW1uczogW1xuICAgICAge1xuICAgICAgICBkYXRhOiBcIl9pZFwiLFxuICAgICAgICB0aXRsZTogJzxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBuYW1lPVwiY2ZfcmV2ZXJzZVwiIGlkPVwiY2ZfcmV2ZXJzZVwiPicsXG4gICAgICAgIG9yZGVyYWJsZTogZmFsc2UsXG4gICAgICAgIHdpZHRoOiAnMTBweCcsXG4gICAgICAgIHJlbmRlcjogZnVuY3Rpb24odmFsLCB0eXBlLCBkb2MpIHtcbiAgICAgICAgICB2YXIgaW5wdXQsIGlucHV0VHlwZSwgcmVmLCByZWYxLCByZWYyO1xuICAgICAgICAgIGlucHV0VHlwZSA9IFwiY2hlY2tib3hcIjtcbiAgICAgICAgICBpZiAoISgocmVmID0gVGFidWxhclRhYmxlcy5jZl90YWJ1bGFyX3NwYWNlX3VzZXIuY3VzdG9tRGF0YSkgIT0gbnVsbCA/IHJlZi5tdWx0aXBsZSA6IHZvaWQgMCkpIHtcbiAgICAgICAgICAgIGlucHV0VHlwZSA9IFwicmFkaW9cIjtcbiAgICAgICAgICB9XG4gICAgICAgICAgaW5wdXQgPSAnPGlucHV0IHR5cGU9XCInICsgaW5wdXRUeXBlICsgJ1wiIGNsYXNzPVwibGlzdF9jaGVja2JveFwiIG5hbWU9XCJjZl9jb250YWN0c19pZHNcIiBpZD1cIicgKyBkb2MudXNlciArICdcIiB2YWx1ZT1cIicgKyBkb2MudXNlciArICdcIiBkYXRhLW5hbWU9XCInICsgZG9jLm5hbWUgKyAnXCIgZGF0YS1lbWFpbD1cIicgKyBkb2MuZW1haWwgKyAnXCInO1xuICAgICAgICAgIGlmICgocmVmMSA9IFRhYnVsYXJUYWJsZXMuY2ZfdGFidWxhcl9zcGFjZV91c2VyLmN1c3RvbURhdGEpICE9IG51bGwgPyAocmVmMiA9IHJlZjEuZGVmYXVsdFZhbHVlcykgIT0gbnVsbCA/IHJlZjIuaW5jbHVkZXMoZG9jLnVzZXIpIDogdm9pZCAwIDogdm9pZCAwKSB7XG4gICAgICAgICAgICBpbnB1dCArPSBcIiBjaGVja2VkIFwiO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpbnB1dCArPSBcIj5cIjtcbiAgICAgICAgICByZXR1cm4gaW5wdXQ7XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAgZGF0YTogXCJuYW1lXCIsXG4gICAgICAgIG9yZGVyYWJsZTogZmFsc2UsXG4gICAgICAgIHJlbmRlcjogZnVuY3Rpb24odmFsLCB0eXBlLCBkb2MpIHtcbiAgICAgICAgICByZXR1cm4gXCI8bGFiZWwgZGF0YS11c2VyPSdcIiArIGRvYy51c2VyICsgXCInIGNsYXNzPSdmb3ItaW5wdXQnPjxkaXYgY2xhc3M9J3VzZXItbmFtZSc+PGZvbnQ+XCIgKyBkb2MubmFtZSArIFwiPC9mb250PjwvZGl2PjwvbGFiZWw+XCI7XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAgZGF0YTogXCJzb3J0X25vXCIsXG4gICAgICAgIHRpdGxlOiBcIlwiLFxuICAgICAgICBvcmRlcmFibGU6IHRydWUsXG4gICAgICAgIHZpc2libGU6IGZhbHNlXG4gICAgICB9LCB7XG4gICAgICAgIGRhdGE6IFwibmFtZVwiLFxuICAgICAgICB0aXRsZTogXCJcIixcbiAgICAgICAgb3JkZXJhYmxlOiB0cnVlLFxuICAgICAgICB2aXNpYmxlOiBmYWxzZVxuICAgICAgfSwge1xuICAgICAgICBkYXRhOiBcImVtYWlsXCIsXG4gICAgICAgIHRpdGxlOiBcIlwiLFxuICAgICAgICBvcmRlcmFibGU6IGZhbHNlLFxuICAgICAgICB2aXNpYmxlOiBmYWxzZVxuICAgICAgfVxuICAgIF0sXG4gICAgb25VbmxvYWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKFwib25VbmxvYWQgb2suLi4uXCIpO1xuICAgIH0sXG4gICAgZG9tOiBcInRwXCIsXG4gICAgb3JkZXI6IFtbMiwgXCJkZXNjXCJdLCBbMywgXCJhc2NcIl1dLFxuICAgIGV4dHJhRmllbGRzOiBbXCJfaWRcIiwgXCJuYW1lXCIsIFwidXNlclwiLCBcInNvcnRfbm9cIiwgXCJlbWFpbFwiXSxcbiAgICBsZW5ndGhDaGFuZ2U6IGZhbHNlLFxuICAgIHBhZ2VMZW5ndGg6IDEwMCxcbiAgICBpbmZvOiBmYWxzZSxcbiAgICBzZWFyY2hpbmc6IHRydWUsXG4gICAgcmVzcG9uc2l2ZToge1xuICAgICAgZGV0YWlsczogZmFsc2VcbiAgICB9LFxuICAgIGF1dG9XaWR0aDogZmFsc2UsXG4gICAgY2hhbmdlU2VsZWN0b3I6IGZ1bmN0aW9uKHNlbGVjdG9yLCB1c2VySWQpIHtcbiAgICAgIHZhciByZWYsIHNwYWNlLCBzcGFjZV91c2VyO1xuICAgICAgaWYgKCF1c2VySWQpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBfaWQ6IC0xXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBzcGFjZSA9IHNlbGVjdG9yLnNwYWNlO1xuICAgICAgaWYgKCFzcGFjZSkge1xuICAgICAgICBpZiAoKHNlbGVjdG9yICE9IG51bGwgPyAocmVmID0gc2VsZWN0b3IuJGFuZCkgIT0gbnVsbCA/IHJlZi5sZW5ndGggOiB2b2lkIDAgOiB2b2lkIDApID4gMCkge1xuICAgICAgICAgIHNwYWNlID0gc2VsZWN0b3IuJGFuZC5nZXRQcm9wZXJ0eSgnc3BhY2UnKVswXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKCFzcGFjZSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIF9pZDogLTFcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHNwYWNlX3VzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHtcbiAgICAgICAgdXNlcjogdXNlcklkLFxuICAgICAgICBzcGFjZTogc3BhY2VcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgX2lkOiAxXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgaWYgKCFzcGFjZV91c2VyKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgX2lkOiAtMVxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNlbGVjdG9yO1xuICAgIH0sXG4gICAgcGFnaW5nVHlwZTogXCJudW1iZXJzXCJcbiAgfSk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwIC0+XHJcblx0SnNvblJvdXRlcy5hZGQgXCJwb3N0XCIsIFwiL2FwaS9mb3JtdWxhL3NwYWNlX3VzZXJzXCIsIChyZXEsIHJlcywgbmV4dCkgLT5cclxuXHRcdHVzZXJJZHMgPSByZXEuYm9keS51c2VySWRzXHJcblx0XHRzcGFjZUlkID0gcmVxLnF1ZXJ5LnNwYWNlSWRcclxuXHJcblx0XHRzcGFjZVVzZXJzID0gW11cclxuXHJcblx0XHRkYXRhID0gW11cclxuXHJcblx0XHRpZiAodXNlcklkcylcclxuXHJcblx0XHRcdGlmIG5vdCB1c2VySWRzIGluc3RhbmNlb2YgQXJyYXlcclxuXHRcdFx0XHR1c2VySWRzID0gW3VzZXJJZHNdXHJcblxyXG5cdFx0XHRxdWVyeSA9IHtcclxuXHRcdFx0XHR1c2VyOiB7XHJcblx0XHRcdFx0XHQkaW46IHVzZXJJZHNcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIHNwYWNlSWRcclxuXHRcdFx0XHRxdWVyeS5zcGFjZSA9IHNwYWNlSWRcclxuXHJcblx0XHRcdHNwYWNlX3VzZXJzID0gZGIuc3BhY2VfdXNlcnMuZmluZChxdWVyeSkuZmV0Y2goKTtcclxuXHJcblx0XHRcdHNlbGVjdGVkID0gW11cclxuXHJcblx0XHRcdHNwYWNlX3VzZXJzLmZvckVhY2ggKHUpLT5cclxuXHRcdFx0XHRpZiBzZWxlY3RlZC5pbmRleE9mKHUudXNlcikgPCAwXHJcblx0XHRcdFx0XHRmdSA9IHt9XHJcblxyXG5cdFx0XHRcdFx0ZnUuaWQgPSB1LnVzZXJcclxuXHJcblx0XHRcdFx0XHRmdS5uYW1lID0gdS5uYW1lXHJcblxyXG5cdFx0XHRcdFx0ZnUuc29ydF9ubyA9IHUuc29ydF9ub1xyXG5cclxuXHRcdFx0XHRcdGZ1Lm1vYmlsZSA9IHUubW9iaWxlXHJcblxyXG5cdFx0XHRcdFx0ZnUud29ya19waG9uZSA9IHUud29ya19waG9uZVxyXG5cclxuXHRcdFx0XHRcdGZ1LnBvc2l0aW9uID0gdS5wb3NpdGlvblxyXG5cclxuXHRcdFx0XHRcdHVfb3JnID0gZGIub3JnYW5pemF0aW9ucy5maW5kT25lKHtfaWQ6IHUub3JnYW5pemF0aW9ufSwge2ZpZWxkczoge25hbWU6IDEsIGZ1bGxuYW1lOiAxfX0pXHJcblxyXG5cdFx0XHRcdFx0dV9vcmdzID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtfaWQ6IHskaW46IHUub3JnYW5pemF0aW9uc319LCB7ZmllbGRzOiB7bmFtZTogMSwgZnVsbG5hbWU6IDF9fSkuZmV0Y2goKVxyXG5cclxuXHJcblx0XHRcdFx0XHRmdS5vcmdhbml6YXRpb24gPSB7XHJcblx0XHRcdFx0XHRcdG5hbWU6IHVfb3JnPy5uYW1lLFxyXG5cdFx0XHRcdFx0XHRmdWxsbmFtZTogdV9vcmc/LmZ1bGxuYW1lXHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0ZnUub3JnYW5pemF0aW9ucyA9IHtcclxuXHRcdFx0XHRcdFx0bmFtZTogdV9vcmdzPy5nZXRQcm9wZXJ0eShcIm5hbWVcIiksXHJcblx0XHRcdFx0XHRcdGZ1bGxuYW1lOiB1X29yZ3M/LmdldFByb3BlcnR5KFwiZnVsbG5hbWVcIiksXHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0ZnUuaHIgPSB1LmhyIHx8IHt9XHJcblxyXG5cdFx0XHRcdFx0aWYgZGIuZmxvd19wb3NpdGlvbnMgJiYgZGIuZmxvd19yb2xlc1xyXG5cclxuXHRcdFx0XHRcdFx0dXNlcl9mbG93X3Bvc2l0aW9ucyA9IGRiLmZsb3dfcG9zaXRpb25zLmZpbmQoe3NwYWNlOiB1LnNwYWNlLCB1c2VyczogdS51c2VyfSwge2ZpZWxkczoge3JvbGU6IDF9fSkuZmV0Y2goKTtcclxuXHJcblx0XHRcdFx0XHRcdHVzZXJfcm9sZV9pZHMgPSB1c2VyX2Zsb3dfcG9zaXRpb25zLmdldFByb3BlcnR5KFwicm9sZVwiKTtcclxuXHJcblx0XHRcdFx0XHRcdHVzZXJfcm9sZXMgPSBkYi5mbG93X3JvbGVzLmZpbmQoe19pZDogeyRpbjogdXNlcl9yb2xlX2lkc319LCB7ZmllbGRzOiB7bmFtZTogMX19KS5mZXRjaCgpO1xyXG5cclxuXHRcdFx0XHRcdFx0ZnUucm9sZXMgPSB1c2VyX3JvbGVzLmdldFByb3BlcnR5KFwibmFtZVwiKVxyXG5cclxuXHRcdFx0XHRcdGRhdGEucHVzaCBmdVxyXG5cclxuXHRcdFx0XHRcdHNlbGVjdGVkLnB1c2ggdS51c2VyXHJcblxyXG5cdFx0XHR1c2VySWRzLmZvckVhY2ggKHVJZCktPlxyXG5cdFx0XHRcdHNwYWNlVXNlcnMucHVzaCBfLmZpbmQoZGF0YSwgKHN1KS0+IHJldHVybiBzdS5pZCA9PSB1SWQpXHJcblxyXG5cclxuXHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcclxuXHRcdFx0Y29kZTogMjAwLFxyXG5cdFx0XHRkYXRhOiB7XHJcblx0XHRcdFx0J3NwYWNlVXNlcnMnOiBzcGFjZVVzZXJzXHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBKc29uUm91dGVzLmFkZChcInBvc3RcIiwgXCIvYXBpL2Zvcm11bGEvc3BhY2VfdXNlcnNcIiwgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgICB2YXIgZGF0YSwgcXVlcnksIHNlbGVjdGVkLCBzcGFjZUlkLCBzcGFjZVVzZXJzLCBzcGFjZV91c2VycywgdXNlcklkcztcbiAgICB1c2VySWRzID0gcmVxLmJvZHkudXNlcklkcztcbiAgICBzcGFjZUlkID0gcmVxLnF1ZXJ5LnNwYWNlSWQ7XG4gICAgc3BhY2VVc2VycyA9IFtdO1xuICAgIGRhdGEgPSBbXTtcbiAgICBpZiAodXNlcklkcykge1xuICAgICAgaWYgKCF1c2VySWRzIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgdXNlcklkcyA9IFt1c2VySWRzXTtcbiAgICAgIH1cbiAgICAgIHF1ZXJ5ID0ge1xuICAgICAgICB1c2VyOiB7XG4gICAgICAgICAgJGluOiB1c2VySWRzXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBpZiAoc3BhY2VJZCkge1xuICAgICAgICBxdWVyeS5zcGFjZSA9IHNwYWNlSWQ7XG4gICAgICB9XG4gICAgICBzcGFjZV91c2VycyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQocXVlcnkpLmZldGNoKCk7XG4gICAgICBzZWxlY3RlZCA9IFtdO1xuICAgICAgc3BhY2VfdXNlcnMuZm9yRWFjaChmdW5jdGlvbih1KSB7XG4gICAgICAgIHZhciBmdSwgdV9vcmcsIHVfb3JncywgdXNlcl9mbG93X3Bvc2l0aW9ucywgdXNlcl9yb2xlX2lkcywgdXNlcl9yb2xlcztcbiAgICAgICAgaWYgKHNlbGVjdGVkLmluZGV4T2YodS51c2VyKSA8IDApIHtcbiAgICAgICAgICBmdSA9IHt9O1xuICAgICAgICAgIGZ1LmlkID0gdS51c2VyO1xuICAgICAgICAgIGZ1Lm5hbWUgPSB1Lm5hbWU7XG4gICAgICAgICAgZnUuc29ydF9ubyA9IHUuc29ydF9ubztcbiAgICAgICAgICBmdS5tb2JpbGUgPSB1Lm1vYmlsZTtcbiAgICAgICAgICBmdS53b3JrX3Bob25lID0gdS53b3JrX3Bob25lO1xuICAgICAgICAgIGZ1LnBvc2l0aW9uID0gdS5wb3NpdGlvbjtcbiAgICAgICAgICB1X29yZyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZE9uZSh7XG4gICAgICAgICAgICBfaWQ6IHUub3JnYW5pemF0aW9uXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgIG5hbWU6IDEsXG4gICAgICAgICAgICAgIGZ1bGxuYW1lOiAxXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdV9vcmdzID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtcbiAgICAgICAgICAgIF9pZDoge1xuICAgICAgICAgICAgICAkaW46IHUub3JnYW5pemF0aW9uc1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICBuYW1lOiAxLFxuICAgICAgICAgICAgICBmdWxsbmFtZTogMVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pLmZldGNoKCk7XG4gICAgICAgICAgZnUub3JnYW5pemF0aW9uID0ge1xuICAgICAgICAgICAgbmFtZTogdV9vcmcgIT0gbnVsbCA/IHVfb3JnLm5hbWUgOiB2b2lkIDAsXG4gICAgICAgICAgICBmdWxsbmFtZTogdV9vcmcgIT0gbnVsbCA/IHVfb3JnLmZ1bGxuYW1lIDogdm9pZCAwXG4gICAgICAgICAgfTtcbiAgICAgICAgICBmdS5vcmdhbml6YXRpb25zID0ge1xuICAgICAgICAgICAgbmFtZTogdV9vcmdzICE9IG51bGwgPyB1X29yZ3MuZ2V0UHJvcGVydHkoXCJuYW1lXCIpIDogdm9pZCAwLFxuICAgICAgICAgICAgZnVsbG5hbWU6IHVfb3JncyAhPSBudWxsID8gdV9vcmdzLmdldFByb3BlcnR5KFwiZnVsbG5hbWVcIikgOiB2b2lkIDBcbiAgICAgICAgICB9O1xuICAgICAgICAgIGZ1LmhyID0gdS5ociB8fCB7fTtcbiAgICAgICAgICBpZiAoZGIuZmxvd19wb3NpdGlvbnMgJiYgZGIuZmxvd19yb2xlcykge1xuICAgICAgICAgICAgdXNlcl9mbG93X3Bvc2l0aW9ucyA9IGRiLmZsb3dfcG9zaXRpb25zLmZpbmQoe1xuICAgICAgICAgICAgICBzcGFjZTogdS5zcGFjZSxcbiAgICAgICAgICAgICAgdXNlcnM6IHUudXNlclxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgICByb2xlOiAxXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLmZldGNoKCk7XG4gICAgICAgICAgICB1c2VyX3JvbGVfaWRzID0gdXNlcl9mbG93X3Bvc2l0aW9ucy5nZXRQcm9wZXJ0eShcInJvbGVcIik7XG4gICAgICAgICAgICB1c2VyX3JvbGVzID0gZGIuZmxvd19yb2xlcy5maW5kKHtcbiAgICAgICAgICAgICAgX2lkOiB7XG4gICAgICAgICAgICAgICAgJGluOiB1c2VyX3JvbGVfaWRzXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgICAgbmFtZTogMVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS5mZXRjaCgpO1xuICAgICAgICAgICAgZnUucm9sZXMgPSB1c2VyX3JvbGVzLmdldFByb3BlcnR5KFwibmFtZVwiKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZGF0YS5wdXNoKGZ1KTtcbiAgICAgICAgICByZXR1cm4gc2VsZWN0ZWQucHVzaCh1LnVzZXIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHVzZXJJZHMuZm9yRWFjaChmdW5jdGlvbih1SWQpIHtcbiAgICAgICAgcmV0dXJuIHNwYWNlVXNlcnMucHVzaChfLmZpbmQoZGF0YSwgZnVuY3Rpb24oc3UpIHtcbiAgICAgICAgICByZXR1cm4gc3UuaWQgPT09IHVJZDtcbiAgICAgICAgfSkpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiAyMDAsXG4gICAgICBkYXRhOiB7XG4gICAgICAgICdzcGFjZVVzZXJzJzogc3BhY2VVc2Vyc1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cclxuXHRKc29uUm91dGVzLmFkZCBcInBvc3RcIiwgXCIvYXBpL2Zvcm11bGEvb3JnYW5pemF0aW9uc1wiLCAocmVxLCByZXMsIG5leHQpIC0+XHJcblxyXG5cdFx0cmVzX29yZ3MgPSBbXVxyXG5cclxuXHRcdGRhdGEgPSBbXVxyXG5cclxuXHRcdG9yZ0lkcyA9IHJlcS5ib2R5Lm9yZ0lkc1xyXG5cclxuXHRcdHNwYWNlSWQgPSByZXEucXVlcnkuc3BhY2VJZFxyXG5cclxuXHRcdGlmIG9yZ0lkc1xyXG5cdFx0XHRpZiBub3Qgb3JnSWRzIGluc3RhbmNlb2YgQXJyYXlcclxuXHRcdFx0XHRvcmdJZHMgPSBbb3JnSWRzXVxyXG5cclxuXHRcdFx0cXVlcnkgPSB7X2lkOiB7JGluOiBvcmdJZHN9fVxyXG5cclxuXHRcdFx0aWYgc3BhY2VJZFxyXG5cdFx0XHRcdHF1ZXJ5LnNwYWNlID0gc3BhY2VJZFxyXG5cclxuXHRcdFx0b3JncyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZChxdWVyeSwge2ZpZWxkczoge25hbWU6IDEsIGZ1bGxuYW1lOiAxfX0pLmZldGNoKCk7XHJcblxyXG5cdFx0XHRvcmdzLmZvckVhY2ggKG9yZyktPlxyXG5cdFx0XHRcdGRhdGEucHVzaCB7aWQ6IG9yZy5faWQsIG5hbWU6IG9yZy5uYW1lLCBmdWxsbmFtZTogb3JnLmZ1bGxuYW1lfVxyXG5cclxuXHRcdFx0b3JnSWRzLmZvckVhY2ggKG9JZCktPlxyXG5cdFx0XHRcdHJlc19vcmdzLnB1c2ggXy5maW5kKGRhdGEsIChvKS0+IHJldHVybiBvLmlkID09IG9JZClcclxuXHJcblxyXG5cclxuXHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcclxuXHRcdFx0Y29kZTogMjAwLFxyXG5cdFx0XHRkYXRhOiB7XHJcblx0XHRcdFx0J29yZ3MnOiByZXNfb3Jnc1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gSnNvblJvdXRlcy5hZGQoXCJwb3N0XCIsIFwiL2FwaS9mb3JtdWxhL29yZ2FuaXphdGlvbnNcIiwgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgICB2YXIgZGF0YSwgb3JnSWRzLCBvcmdzLCBxdWVyeSwgcmVzX29yZ3MsIHNwYWNlSWQ7XG4gICAgcmVzX29yZ3MgPSBbXTtcbiAgICBkYXRhID0gW107XG4gICAgb3JnSWRzID0gcmVxLmJvZHkub3JnSWRzO1xuICAgIHNwYWNlSWQgPSByZXEucXVlcnkuc3BhY2VJZDtcbiAgICBpZiAob3JnSWRzKSB7XG4gICAgICBpZiAoIW9yZ0lkcyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgIG9yZ0lkcyA9IFtvcmdJZHNdO1xuICAgICAgfVxuICAgICAgcXVlcnkgPSB7XG4gICAgICAgIF9pZDoge1xuICAgICAgICAgICRpbjogb3JnSWRzXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBpZiAoc3BhY2VJZCkge1xuICAgICAgICBxdWVyeS5zcGFjZSA9IHNwYWNlSWQ7XG4gICAgICB9XG4gICAgICBvcmdzID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHF1ZXJ5LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIG5hbWU6IDEsXG4gICAgICAgICAgZnVsbG5hbWU6IDFcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICAgIG9yZ3MuZm9yRWFjaChmdW5jdGlvbihvcmcpIHtcbiAgICAgICAgcmV0dXJuIGRhdGEucHVzaCh7XG4gICAgICAgICAgaWQ6IG9yZy5faWQsXG4gICAgICAgICAgbmFtZTogb3JnLm5hbWUsXG4gICAgICAgICAgZnVsbG5hbWU6IG9yZy5mdWxsbmFtZVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgb3JnSWRzLmZvckVhY2goZnVuY3Rpb24ob0lkKSB7XG4gICAgICAgIHJldHVybiByZXNfb3Jncy5wdXNoKF8uZmluZChkYXRhLCBmdW5jdGlvbihvKSB7XG4gICAgICAgICAgcmV0dXJuIG8uaWQgPT09IG9JZDtcbiAgICAgICAgfSkpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiAyMDAsXG4gICAgICBkYXRhOiB7XG4gICAgICAgICdvcmdzJzogcmVzX29yZ3NcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==
