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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hdXRvZm9ybS9jbGllbnQvY29yZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2NsaWVudC9jb3JlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hdXRvZm9ybS9jbGllbnQvY29yZWZvcm0vaW5wdXRUeXBlcy9jb3JlZm9ybS11c2VyL2xpYi9jZl90YWJ1bGFyX3NwYWNlX3VzZXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9jbGllbnQvY29yZWZvcm0vaW5wdXRUeXBlcy9jb3JlZm9ybS11c2VyL2xpYi9jZl90YWJ1bGFyX3NwYWNlX3VzZXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2F1dG9mb3JtL3JvdXRlcy9mb3JtdWxhX3NwYWNlX3VzZXJzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcm91dGVzL2Zvcm11bGFfc3BhY2VfdXNlcnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2F1dG9mb3JtL3JvdXRlcy9mb3JtdWxhX29yZ2FuaXphdGlvbnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9yb3V0ZXMvZm9ybXVsYV9vcmdhbml6YXRpb25zLmNvZmZlZSJdLCJuYW1lcyI6WyJUYWJ1bGFyVGFibGVzIiwiTWV0ZW9yIiwic3RhcnR1cCIsIlNpbXBsZVNjaGVtYSIsImV4dGVuZE9wdGlvbnMiLCJiZWZvcmVPcGVuRnVuY3Rpb24iLCJNYXRjaCIsIk9wdGlvbmFsIiwiT25lT2YiLCJGdW5jdGlvbiIsIlN0cmluZyIsImNmX3RhYnVsYXJfc3BhY2VfdXNlciIsIlRhYnVsYXIiLCJUYWJsZSIsIm5hbWUiLCJjb2xsZWN0aW9uIiwiZGIiLCJzcGFjZV91c2VycyIsImRyYXdDYWxsYmFjayIsInNldHRpbmdzIiwiJCIsImF0dHIiLCJjb2x1bW5zIiwiZGF0YSIsInRpdGxlIiwib3JkZXJhYmxlIiwid2lkdGgiLCJyZW5kZXIiLCJ2YWwiLCJ0eXBlIiwiZG9jIiwiaW5wdXQiLCJpbnB1dFR5cGUiLCJyZWYiLCJyZWYxIiwicmVmMiIsImN1c3RvbURhdGEiLCJtdWx0aXBsZSIsInVzZXIiLCJlbWFpbCIsImRlZmF1bHRWYWx1ZXMiLCJpbmNsdWRlcyIsInZpc2libGUiLCJvblVubG9hZCIsImNvbnNvbGUiLCJsb2ciLCJkb20iLCJvcmRlciIsImV4dHJhRmllbGRzIiwibGVuZ3RoQ2hhbmdlIiwicGFnZUxlbmd0aCIsImluZm8iLCJzZWFyY2hpbmciLCJyZXNwb25zaXZlIiwiZGV0YWlscyIsImF1dG9XaWR0aCIsImNoYW5nZVNlbGVjdG9yIiwic2VsZWN0b3IiLCJ1c2VySWQiLCJzcGFjZSIsInNwYWNlX3VzZXIiLCJfaWQiLCIkYW5kIiwibGVuZ3RoIiwiZ2V0UHJvcGVydHkiLCJmaW5kT25lIiwiZmllbGRzIiwicGFnaW5nVHlwZSIsIkpzb25Sb3V0ZXMiLCJhZGQiLCJyZXEiLCJyZXMiLCJuZXh0IiwicXVlcnkiLCJzZWxlY3RlZCIsInNwYWNlSWQiLCJzcGFjZVVzZXJzIiwidXNlcklkcyIsImJvZHkiLCJBcnJheSIsIiRpbiIsImZpbmQiLCJmZXRjaCIsImZvckVhY2giLCJ1IiwiZnUiLCJ1X29yZyIsInVfb3JncyIsInVzZXJfZmxvd19wb3NpdGlvbnMiLCJ1c2VyX3JvbGVfaWRzIiwidXNlcl9yb2xlcyIsImluZGV4T2YiLCJpZCIsInNvcnRfbm8iLCJtb2JpbGUiLCJ3b3JrX3Bob25lIiwicG9zaXRpb24iLCJvcmdhbml6YXRpb25zIiwib3JnYW5pemF0aW9uIiwiZnVsbG5hbWUiLCJociIsImZsb3dfcG9zaXRpb25zIiwiZmxvd19yb2xlcyIsInVzZXJzIiwicm9sZSIsInJvbGVzIiwicHVzaCIsInVJZCIsIl8iLCJzdSIsInNlbmRSZXN1bHQiLCJjb2RlIiwib3JnSWRzIiwib3JncyIsInJlc19vcmdzIiwib3JnIiwib0lkIiwibyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7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O0FBRUEsUUFBR3FDLE1BQUg7QUFDQyxVQUFHLENBQUlBLE1BQUosWUFBc0JqQyxLQUF6QjtBQUNDaUMsaUJBQVMsQ0FBQ0EsTUFBRCxDQUFUO0FDSEc7O0FES0p2QyxjQUFRO0FBQUNaLGFBQUs7QUFBQ21CLGVBQUtnQztBQUFOO0FBQU4sT0FBUjs7QUFFQSxVQUFHckMsT0FBSDtBQUNDRixjQUFNZCxLQUFOLEdBQWNnQixPQUFkO0FDQUc7O0FERUpzQyxhQUFPakcsR0FBR2lGLGFBQUgsQ0FBaUJoQixJQUFqQixDQUFzQlIsS0FBdEIsRUFBNkI7QUFBQ1AsZ0JBQVE7QUFBQ3BELGdCQUFNLENBQVA7QUFBVXFGLG9CQUFVO0FBQXBCO0FBQVQsT0FBN0IsRUFBK0RqQixLQUEvRCxFQUFQO0FBRUErQixXQUFLOUIsT0FBTCxDQUFhLFVBQUNnQyxHQUFEO0FDSVIsZURISjVGLEtBQUttRixJQUFMLENBQVU7QUFBQ2QsY0FBSXVCLElBQUl0RCxHQUFUO0FBQWMvQyxnQkFBTXFHLElBQUlyRyxJQUF4QjtBQUE4QnFGLG9CQUFVZ0IsSUFBSWhCO0FBQTVDLFNBQVYsQ0NHSTtBREpMO0FBR0FhLGFBQU83QixPQUFQLENBQWUsVUFBQ2lDLEdBQUQ7QUNRVixlRFBKRixTQUFTUixJQUFULENBQWNFLEVBQUUzQixJQUFGLENBQU8xRCxJQUFQLEVBQWEsVUFBQzhGLENBQUQ7QUFBTSxpQkFBT0EsRUFBRXpCLEVBQUYsS0FBUXdCLEdBQWY7QUFBbkIsVUFBZCxDQ09JO0FEUkw7QUNZRTs7QUFDRCxXRFJGaEQsV0FBVzBDLFVBQVgsQ0FBc0J2QyxHQUF0QixFQUEyQjtBQUMxQndDLFlBQU0sR0FEb0I7QUFFMUJ4RixZQUFNO0FBQ0wsZ0JBQVEyRjtBQURIO0FBRm9CLEtBQTNCLENDUUU7QURyQ0gsSUNBQztBRERGLEciLCJmaWxlIjoiL3BhY2thZ2VzL3N0ZWVkb3NfYXV0b2Zvcm0uanMiLCJzb3VyY2VzQ29udGVudCI6WyJAVGFidWxhclRhYmxlcyA9IHt9O1xuXG5cbk1ldGVvci5zdGFydHVwIC0+XG5cdFNpbXBsZVNjaGVtYS5leHRlbmRPcHRpb25zKHtiZWZvcmVPcGVuRnVuY3Rpb246IE1hdGNoLk9wdGlvbmFsKE1hdGNoLk9uZU9mKEZ1bmN0aW9uLCBTdHJpbmcpKX0pIiwidGhpcy5UYWJ1bGFyVGFibGVzID0ge307XG5cbk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gU2ltcGxlU2NoZW1hLmV4dGVuZE9wdGlvbnMoe1xuICAgIGJlZm9yZU9wZW5GdW5jdGlvbjogTWF0Y2guT3B0aW9uYWwoTWF0Y2guT25lT2YoRnVuY3Rpb24sIFN0cmluZykpXG4gIH0pO1xufSk7XG4iLCJNZXRlb3Iuc3RhcnR1cCAoKS0+XG5cdFRhYnVsYXJUYWJsZXMuY2ZfdGFidWxhcl9zcGFjZV91c2VyID0gbmV3IFRhYnVsYXIuVGFibGUoe1xuXHRcdG5hbWU6IFwiY2ZfdGFidWxhcl9zcGFjZV91c2VyXCIsXG5cdFx0Y29sbGVjdGlvbjogZGIuc3BhY2VfdXNlcnMsXG5cdFx0ZHJhd0NhbGxiYWNrOiAoc2V0dGluZ3MpLT5cblx0XHRcdCQoXCIjY2ZfcmV2ZXJzZVwiKS5hdHRyKFwiY2hlY2tlZFwiLCBmYWxzZSlcblx0XHRjb2x1bW5zOiBbXG5cdFx0XHR7XG5cdFx0XHRcdGRhdGE6IFwiX2lkXCIsXG5cdFx0XHRcdHRpdGxlOiAnPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIG5hbWU9XCJjZl9yZXZlcnNlXCIgaWQ9XCJjZl9yZXZlcnNlXCI+Jyxcblx0XHRcdFx0b3JkZXJhYmxlOiBmYWxzZSxcblx0XHRcdFx0d2lkdGg6JzEwcHgnLFxuXHRcdFx0XHRyZW5kZXI6ICAodmFsLCB0eXBlLCBkb2MpIC0+XG5cblx0XHRcdFx0XHRpbnB1dFR5cGUgPSBcImNoZWNrYm94XCI7XG5cblx0XHRcdFx0XHRpZiAhVGFidWxhclRhYmxlcy5jZl90YWJ1bGFyX3NwYWNlX3VzZXIuY3VzdG9tRGF0YT8ubXVsdGlwbGVcblx0XHRcdFx0XHRcdGlucHV0VHlwZSA9IFwicmFkaW9cIlxuXG5cdFx0XHRcdFx0aW5wdXQgPSAnPGlucHV0IHR5cGU9XCInICsgaW5wdXRUeXBlICsgJ1wiIGNsYXNzPVwibGlzdF9jaGVja2JveFwiIG5hbWU9XCJjZl9jb250YWN0c19pZHNcIiBpZD1cIicgKyBkb2MudXNlciArICdcIiB2YWx1ZT1cIicgKyBkb2MudXNlciArICdcIiBkYXRhLW5hbWU9XCInICsgZG9jLm5hbWUgKyAnXCIgZGF0YS1lbWFpbD1cIicgKyBkb2MuZW1haWwgKyAnXCInO1xuXG5cdFx0XHRcdFx0aWYgVGFidWxhclRhYmxlcy5jZl90YWJ1bGFyX3NwYWNlX3VzZXIuY3VzdG9tRGF0YT8uZGVmYXVsdFZhbHVlcz8uaW5jbHVkZXMoZG9jLnVzZXIpXG5cdFx0XHRcdFx0XHRpbnB1dCArPSBcIiBjaGVja2VkIFwiXG5cblx0XHRcdFx0XHRpbnB1dCArPSBcIj5cIlxuXHRcdFx0XHRcdHJldHVybiBpbnB1dFxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0ZGF0YTogXCJuYW1lXCIsXG5cdFx0XHRcdG9yZGVyYWJsZTogZmFsc2UsXG5cdFx0XHRcdHJlbmRlcjogICh2YWwsIHR5cGUsIGRvYykgLT5cblx0XHRcdFx0XHRyZXR1cm4gXCI8bGFiZWwgZGF0YS11c2VyPSdcIiArIGRvYy51c2VyICsgXCInIGNsYXNzPSdmb3ItaW5wdXQnPjxkaXYgY2xhc3M9J3VzZXItbmFtZSc+PGZvbnQ+XCIgKyBkb2MubmFtZSArIFwiPC9mb250PjwvZGl2PjwvbGFiZWw+XCJcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdGRhdGE6IFwic29ydF9ub1wiLFxuXHRcdFx0XHR0aXRsZTogXCJcIixcblx0XHRcdFx0b3JkZXJhYmxlOiB0cnVlLFxuXHRcdFx0XHR2aXNpYmxlOiBmYWxzZVxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0ZGF0YTogXCJuYW1lXCIsXG5cdFx0XHRcdHRpdGxlOiBcIlwiLFxuXHRcdFx0XHRvcmRlcmFibGU6IHRydWUsXG5cdFx0XHRcdHZpc2libGU6IGZhbHNlXG5cdFx0XHR9LHtcblx0XHRcdFx0ZGF0YTogXCJlbWFpbFwiLFxuXHRcdFx0XHR0aXRsZTogXCJcIixcblx0XHRcdFx0b3JkZXJhYmxlOiBmYWxzZSxcblx0XHRcdFx0dmlzaWJsZTogZmFsc2Vcblx0XHRcdH1cblx0XHRdLFxuXHRcdG9uVW5sb2FkOigpIC0+XG5cdFx0XHRyZXR1cm4gY29uc29sZS5sb2coXCJvblVubG9hZCBvay4uLi5cIik7XG4jc2VsZWN0OlxuIyAgc3R5bGU6ICdzaW5nbGUnXG5cdFx0ZG9tOiBcInRwXCIsXG5cdFx0b3JkZXI6W1syLFwiZGVzY1wiXSxbMyxcImFzY1wiXV0sXG5cdFx0ZXh0cmFGaWVsZHM6IFtcIl9pZFwiLCBcIm5hbWVcIiwgXCJ1c2VyXCIsIFwic29ydF9ub1wiLCBcImVtYWlsXCJdLFxuXHRcdGxlbmd0aENoYW5nZTogZmFsc2UsXG5cdFx0cGFnZUxlbmd0aDogMTAwLFxuXHRcdGluZm86IGZhbHNlLFxuXHRcdHNlYXJjaGluZzogdHJ1ZSxcblx0XHRyZXNwb25zaXZlOlxuXHRcdFx0ZGV0YWlsczogZmFsc2Vcblx0XHRhdXRvV2lkdGg6IGZhbHNlLFxuXHRcdGNoYW5nZVNlbGVjdG9yOiAoc2VsZWN0b3IsIHVzZXJJZCkgLT5cblx0XHRcdHVubGVzcyB1c2VySWRcblx0XHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxuXHRcdFx0c3BhY2UgPSBzZWxlY3Rvci5zcGFjZVxuXHRcdFx0dW5sZXNzIHNwYWNlXG5cdFx0XHRcdGlmIHNlbGVjdG9yPy4kYW5kPy5sZW5ndGggPiAwXG5cdFx0XHRcdFx0c3BhY2UgPSBzZWxlY3Rvci4kYW5kLmdldFByb3BlcnR5KCdzcGFjZScpWzBdXG5cdFx0XHR1bmxlc3Mgc3BhY2Vcblx0XHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxuXHRcdFx0c3BhY2VfdXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe3VzZXI6IHVzZXJJZCxzcGFjZTpzcGFjZX0sIHtmaWVsZHM6IHtfaWQ6IDF9fSlcblx0XHRcdHVubGVzcyBzcGFjZV91c2VyXG5cdFx0XHRcdHJldHVybiB7X2lkOiAtMX1cblx0XHRcdHJldHVybiBzZWxlY3RvclxuXG4jc2Nyb2xsWTogICAgICAgICc0MDBweCcsXG4jc2Nyb2xsQ29sbGFwc2U6IHRydWUsXG5cdFx0cGFnaW5nVHlwZTogXCJudW1iZXJzXCJcblxuXHR9KTtcbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gVGFidWxhclRhYmxlcy5jZl90YWJ1bGFyX3NwYWNlX3VzZXIgPSBuZXcgVGFidWxhci5UYWJsZSh7XG4gICAgbmFtZTogXCJjZl90YWJ1bGFyX3NwYWNlX3VzZXJcIixcbiAgICBjb2xsZWN0aW9uOiBkYi5zcGFjZV91c2VycyxcbiAgICBkcmF3Q2FsbGJhY2s6IGZ1bmN0aW9uKHNldHRpbmdzKSB7XG4gICAgICByZXR1cm4gJChcIiNjZl9yZXZlcnNlXCIpLmF0dHIoXCJjaGVja2VkXCIsIGZhbHNlKTtcbiAgICB9LFxuICAgIGNvbHVtbnM6IFtcbiAgICAgIHtcbiAgICAgICAgZGF0YTogXCJfaWRcIixcbiAgICAgICAgdGl0bGU6ICc8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgbmFtZT1cImNmX3JldmVyc2VcIiBpZD1cImNmX3JldmVyc2VcIj4nLFxuICAgICAgICBvcmRlcmFibGU6IGZhbHNlLFxuICAgICAgICB3aWR0aDogJzEwcHgnLFxuICAgICAgICByZW5kZXI6IGZ1bmN0aW9uKHZhbCwgdHlwZSwgZG9jKSB7XG4gICAgICAgICAgdmFyIGlucHV0LCBpbnB1dFR5cGUsIHJlZiwgcmVmMSwgcmVmMjtcbiAgICAgICAgICBpbnB1dFR5cGUgPSBcImNoZWNrYm94XCI7XG4gICAgICAgICAgaWYgKCEoKHJlZiA9IFRhYnVsYXJUYWJsZXMuY2ZfdGFidWxhcl9zcGFjZV91c2VyLmN1c3RvbURhdGEpICE9IG51bGwgPyByZWYubXVsdGlwbGUgOiB2b2lkIDApKSB7XG4gICAgICAgICAgICBpbnB1dFR5cGUgPSBcInJhZGlvXCI7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlucHV0ID0gJzxpbnB1dCB0eXBlPVwiJyArIGlucHV0VHlwZSArICdcIiBjbGFzcz1cImxpc3RfY2hlY2tib3hcIiBuYW1lPVwiY2ZfY29udGFjdHNfaWRzXCIgaWQ9XCInICsgZG9jLnVzZXIgKyAnXCIgdmFsdWU9XCInICsgZG9jLnVzZXIgKyAnXCIgZGF0YS1uYW1lPVwiJyArIGRvYy5uYW1lICsgJ1wiIGRhdGEtZW1haWw9XCInICsgZG9jLmVtYWlsICsgJ1wiJztcbiAgICAgICAgICBpZiAoKHJlZjEgPSBUYWJ1bGFyVGFibGVzLmNmX3RhYnVsYXJfc3BhY2VfdXNlci5jdXN0b21EYXRhKSAhPSBudWxsID8gKHJlZjIgPSByZWYxLmRlZmF1bHRWYWx1ZXMpICE9IG51bGwgPyByZWYyLmluY2x1ZGVzKGRvYy51c2VyKSA6IHZvaWQgMCA6IHZvaWQgMCkge1xuICAgICAgICAgICAgaW5wdXQgKz0gXCIgY2hlY2tlZCBcIjtcbiAgICAgICAgICB9XG4gICAgICAgICAgaW5wdXQgKz0gXCI+XCI7XG4gICAgICAgICAgcmV0dXJuIGlucHV0O1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGRhdGE6IFwibmFtZVwiLFxuICAgICAgICBvcmRlcmFibGU6IGZhbHNlLFxuICAgICAgICByZW5kZXI6IGZ1bmN0aW9uKHZhbCwgdHlwZSwgZG9jKSB7XG4gICAgICAgICAgcmV0dXJuIFwiPGxhYmVsIGRhdGEtdXNlcj0nXCIgKyBkb2MudXNlciArIFwiJyBjbGFzcz0nZm9yLWlucHV0Jz48ZGl2IGNsYXNzPSd1c2VyLW5hbWUnPjxmb250PlwiICsgZG9jLm5hbWUgKyBcIjwvZm9udD48L2Rpdj48L2xhYmVsPlwiO1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGRhdGE6IFwic29ydF9ub1wiLFxuICAgICAgICB0aXRsZTogXCJcIixcbiAgICAgICAgb3JkZXJhYmxlOiB0cnVlLFxuICAgICAgICB2aXNpYmxlOiBmYWxzZVxuICAgICAgfSwge1xuICAgICAgICBkYXRhOiBcIm5hbWVcIixcbiAgICAgICAgdGl0bGU6IFwiXCIsXG4gICAgICAgIG9yZGVyYWJsZTogdHJ1ZSxcbiAgICAgICAgdmlzaWJsZTogZmFsc2VcbiAgICAgIH0sIHtcbiAgICAgICAgZGF0YTogXCJlbWFpbFwiLFxuICAgICAgICB0aXRsZTogXCJcIixcbiAgICAgICAgb3JkZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgdmlzaWJsZTogZmFsc2VcbiAgICAgIH1cbiAgICBdLFxuICAgIG9uVW5sb2FkOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZyhcIm9uVW5sb2FkIG9rLi4uLlwiKTtcbiAgICB9LFxuICAgIGRvbTogXCJ0cFwiLFxuICAgIG9yZGVyOiBbWzIsIFwiZGVzY1wiXSwgWzMsIFwiYXNjXCJdXSxcbiAgICBleHRyYUZpZWxkczogW1wiX2lkXCIsIFwibmFtZVwiLCBcInVzZXJcIiwgXCJzb3J0X25vXCIsIFwiZW1haWxcIl0sXG4gICAgbGVuZ3RoQ2hhbmdlOiBmYWxzZSxcbiAgICBwYWdlTGVuZ3RoOiAxMDAsXG4gICAgaW5mbzogZmFsc2UsXG4gICAgc2VhcmNoaW5nOiB0cnVlLFxuICAgIHJlc3BvbnNpdmU6IHtcbiAgICAgIGRldGFpbHM6IGZhbHNlXG4gICAgfSxcbiAgICBhdXRvV2lkdGg6IGZhbHNlLFxuICAgIGNoYW5nZVNlbGVjdG9yOiBmdW5jdGlvbihzZWxlY3RvciwgdXNlcklkKSB7XG4gICAgICB2YXIgcmVmLCBzcGFjZSwgc3BhY2VfdXNlcjtcbiAgICAgIGlmICghdXNlcklkKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgX2lkOiAtMVxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgc3BhY2UgPSBzZWxlY3Rvci5zcGFjZTtcbiAgICAgIGlmICghc3BhY2UpIHtcbiAgICAgICAgaWYgKChzZWxlY3RvciAhPSBudWxsID8gKHJlZiA9IHNlbGVjdG9yLiRhbmQpICE9IG51bGwgPyByZWYubGVuZ3RoIDogdm9pZCAwIDogdm9pZCAwKSA+IDApIHtcbiAgICAgICAgICBzcGFjZSA9IHNlbGVjdG9yLiRhbmQuZ2V0UHJvcGVydHkoJ3NwYWNlJylbMF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICghc3BhY2UpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBfaWQ6IC0xXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBzcGFjZV91c2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7XG4gICAgICAgIHVzZXI6IHVzZXJJZCxcbiAgICAgICAgc3BhY2U6IHNwYWNlXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGlmICghc3BhY2VfdXNlcikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIF9pZDogLTFcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzZWxlY3RvcjtcbiAgICB9LFxuICAgIHBhZ2luZ1R5cGU6IFwibnVtYmVyc1wiXG4gIH0pO1xufSk7XG4iLCJNZXRlb3Iuc3RhcnR1cCAtPlxuXHRKc29uUm91dGVzLmFkZCBcInBvc3RcIiwgXCIvYXBpL2Zvcm11bGEvc3BhY2VfdXNlcnNcIiwgKHJlcSwgcmVzLCBuZXh0KSAtPlxuXHRcdHVzZXJJZHMgPSByZXEuYm9keS51c2VySWRzXG5cdFx0c3BhY2VJZCA9IHJlcS5xdWVyeS5zcGFjZUlkXG5cblx0XHRzcGFjZVVzZXJzID0gW11cblxuXHRcdGRhdGEgPSBbXVxuXG5cdFx0aWYgKHVzZXJJZHMpXG5cblx0XHRcdGlmIG5vdCB1c2VySWRzIGluc3RhbmNlb2YgQXJyYXlcblx0XHRcdFx0dXNlcklkcyA9IFt1c2VySWRzXVxuXG5cdFx0XHRxdWVyeSA9IHtcblx0XHRcdFx0dXNlcjoge1xuXHRcdFx0XHRcdCRpbjogdXNlcklkc1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGlmIHNwYWNlSWRcblx0XHRcdFx0cXVlcnkuc3BhY2UgPSBzcGFjZUlkXG5cblx0XHRcdHNwYWNlX3VzZXJzID0gZGIuc3BhY2VfdXNlcnMuZmluZChxdWVyeSkuZmV0Y2goKTtcblxuXHRcdFx0c2VsZWN0ZWQgPSBbXVxuXG5cdFx0XHRzcGFjZV91c2Vycy5mb3JFYWNoICh1KS0+XG5cdFx0XHRcdGlmIHNlbGVjdGVkLmluZGV4T2YodS51c2VyKSA8IDBcblx0XHRcdFx0XHRmdSA9IHt9XG5cblx0XHRcdFx0XHRmdS5pZCA9IHUudXNlclxuXG5cdFx0XHRcdFx0ZnUubmFtZSA9IHUubmFtZVxuXG5cdFx0XHRcdFx0ZnUuc29ydF9ubyA9IHUuc29ydF9ub1xuXG5cdFx0XHRcdFx0ZnUubW9iaWxlID0gdS5tb2JpbGVcblxuXHRcdFx0XHRcdGZ1LndvcmtfcGhvbmUgPSB1LndvcmtfcGhvbmVcblxuXHRcdFx0XHRcdGZ1LnBvc2l0aW9uID0gdS5wb3NpdGlvblxuXG5cdFx0XHRcdFx0dV9vcmcgPSBkYi5vcmdhbml6YXRpb25zLmZpbmRPbmUoe19pZDogdS5vcmdhbml6YXRpb259LCB7ZmllbGRzOiB7bmFtZTogMSwgZnVsbG5hbWU6IDF9fSlcblxuXHRcdFx0XHRcdHVfb3JncyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7X2lkOiB7JGluOiB1Lm9yZ2FuaXphdGlvbnN9fSwge2ZpZWxkczoge25hbWU6IDEsIGZ1bGxuYW1lOiAxfX0pLmZldGNoKClcblxuXG5cdFx0XHRcdFx0ZnUub3JnYW5pemF0aW9uID0ge1xuXHRcdFx0XHRcdFx0bmFtZTogdV9vcmc/Lm5hbWUsXG5cdFx0XHRcdFx0XHRmdWxsbmFtZTogdV9vcmc/LmZ1bGxuYW1lXG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0ZnUub3JnYW5pemF0aW9ucyA9IHtcblx0XHRcdFx0XHRcdG5hbWU6IHVfb3Jncz8uZ2V0UHJvcGVydHkoXCJuYW1lXCIpLFxuXHRcdFx0XHRcdFx0ZnVsbG5hbWU6IHVfb3Jncz8uZ2V0UHJvcGVydHkoXCJmdWxsbmFtZVwiKSxcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRmdS5ociA9IHUuaHIgfHwge31cblxuXHRcdFx0XHRcdGlmIGRiLmZsb3dfcG9zaXRpb25zICYmIGRiLmZsb3dfcm9sZXNcblxuXHRcdFx0XHRcdFx0dXNlcl9mbG93X3Bvc2l0aW9ucyA9IGRiLmZsb3dfcG9zaXRpb25zLmZpbmQoe3NwYWNlOiB1LnNwYWNlLCB1c2VyczogdS51c2VyfSwge2ZpZWxkczoge3JvbGU6IDF9fSkuZmV0Y2goKTtcblxuXHRcdFx0XHRcdFx0dXNlcl9yb2xlX2lkcyA9IHVzZXJfZmxvd19wb3NpdGlvbnMuZ2V0UHJvcGVydHkoXCJyb2xlXCIpO1xuXG5cdFx0XHRcdFx0XHR1c2VyX3JvbGVzID0gZGIuZmxvd19yb2xlcy5maW5kKHtfaWQ6IHskaW46IHVzZXJfcm9sZV9pZHN9fSwge2ZpZWxkczoge25hbWU6IDF9fSkuZmV0Y2goKTtcblxuXHRcdFx0XHRcdFx0ZnUucm9sZXMgPSB1c2VyX3JvbGVzLmdldFByb3BlcnR5KFwibmFtZVwiKVxuXG5cdFx0XHRcdFx0ZGF0YS5wdXNoIGZ1XG5cblx0XHRcdFx0XHRzZWxlY3RlZC5wdXNoIHUudXNlclxuXG5cdFx0XHR1c2VySWRzLmZvckVhY2ggKHVJZCktPlxuXHRcdFx0XHRzcGFjZVVzZXJzLnB1c2ggXy5maW5kKGRhdGEsIChzdSktPiByZXR1cm4gc3UuaWQgPT0gdUlkKVxuXG5cblx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG5cdFx0XHRjb2RlOiAyMDAsXG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdCdzcGFjZVVzZXJzJzogc3BhY2VVc2Vyc1xuXHRcdFx0fVxuXHRcdH0pO1xuXG4iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIEpzb25Sb3V0ZXMuYWRkKFwicG9zdFwiLCBcIi9hcGkvZm9ybXVsYS9zcGFjZV91c2Vyc1wiLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICAgIHZhciBkYXRhLCBxdWVyeSwgc2VsZWN0ZWQsIHNwYWNlSWQsIHNwYWNlVXNlcnMsIHNwYWNlX3VzZXJzLCB1c2VySWRzO1xuICAgIHVzZXJJZHMgPSByZXEuYm9keS51c2VySWRzO1xuICAgIHNwYWNlSWQgPSByZXEucXVlcnkuc3BhY2VJZDtcbiAgICBzcGFjZVVzZXJzID0gW107XG4gICAgZGF0YSA9IFtdO1xuICAgIGlmICh1c2VySWRzKSB7XG4gICAgICBpZiAoIXVzZXJJZHMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICB1c2VySWRzID0gW3VzZXJJZHNdO1xuICAgICAgfVxuICAgICAgcXVlcnkgPSB7XG4gICAgICAgIHVzZXI6IHtcbiAgICAgICAgICAkaW46IHVzZXJJZHNcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGlmIChzcGFjZUlkKSB7XG4gICAgICAgIHF1ZXJ5LnNwYWNlID0gc3BhY2VJZDtcbiAgICAgIH1cbiAgICAgIHNwYWNlX3VzZXJzID0gZGIuc3BhY2VfdXNlcnMuZmluZChxdWVyeSkuZmV0Y2goKTtcbiAgICAgIHNlbGVjdGVkID0gW107XG4gICAgICBzcGFjZV91c2Vycy5mb3JFYWNoKGZ1bmN0aW9uKHUpIHtcbiAgICAgICAgdmFyIGZ1LCB1X29yZywgdV9vcmdzLCB1c2VyX2Zsb3dfcG9zaXRpb25zLCB1c2VyX3JvbGVfaWRzLCB1c2VyX3JvbGVzO1xuICAgICAgICBpZiAoc2VsZWN0ZWQuaW5kZXhPZih1LnVzZXIpIDwgMCkge1xuICAgICAgICAgIGZ1ID0ge307XG4gICAgICAgICAgZnUuaWQgPSB1LnVzZXI7XG4gICAgICAgICAgZnUubmFtZSA9IHUubmFtZTtcbiAgICAgICAgICBmdS5zb3J0X25vID0gdS5zb3J0X25vO1xuICAgICAgICAgIGZ1Lm1vYmlsZSA9IHUubW9iaWxlO1xuICAgICAgICAgIGZ1LndvcmtfcGhvbmUgPSB1LndvcmtfcGhvbmU7XG4gICAgICAgICAgZnUucG9zaXRpb24gPSB1LnBvc2l0aW9uO1xuICAgICAgICAgIHVfb3JnID0gZGIub3JnYW5pemF0aW9ucy5maW5kT25lKHtcbiAgICAgICAgICAgIF9pZDogdS5vcmdhbml6YXRpb25cbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgbmFtZTogMSxcbiAgICAgICAgICAgICAgZnVsbG5hbWU6IDFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICB1X29yZ3MgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe1xuICAgICAgICAgICAgX2lkOiB7XG4gICAgICAgICAgICAgICRpbjogdS5vcmdhbml6YXRpb25zXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgIG5hbWU6IDEsXG4gICAgICAgICAgICAgIGZ1bGxuYW1lOiAxXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSkuZmV0Y2goKTtcbiAgICAgICAgICBmdS5vcmdhbml6YXRpb24gPSB7XG4gICAgICAgICAgICBuYW1lOiB1X29yZyAhPSBudWxsID8gdV9vcmcubmFtZSA6IHZvaWQgMCxcbiAgICAgICAgICAgIGZ1bGxuYW1lOiB1X29yZyAhPSBudWxsID8gdV9vcmcuZnVsbG5hbWUgOiB2b2lkIDBcbiAgICAgICAgICB9O1xuICAgICAgICAgIGZ1Lm9yZ2FuaXphdGlvbnMgPSB7XG4gICAgICAgICAgICBuYW1lOiB1X29yZ3MgIT0gbnVsbCA/IHVfb3Jncy5nZXRQcm9wZXJ0eShcIm5hbWVcIikgOiB2b2lkIDAsXG4gICAgICAgICAgICBmdWxsbmFtZTogdV9vcmdzICE9IG51bGwgPyB1X29yZ3MuZ2V0UHJvcGVydHkoXCJmdWxsbmFtZVwiKSA6IHZvaWQgMFxuICAgICAgICAgIH07XG4gICAgICAgICAgZnUuaHIgPSB1LmhyIHx8IHt9O1xuICAgICAgICAgIGlmIChkYi5mbG93X3Bvc2l0aW9ucyAmJiBkYi5mbG93X3JvbGVzKSB7XG4gICAgICAgICAgICB1c2VyX2Zsb3dfcG9zaXRpb25zID0gZGIuZmxvd19wb3NpdGlvbnMuZmluZCh7XG4gICAgICAgICAgICAgIHNwYWNlOiB1LnNwYWNlLFxuICAgICAgICAgICAgICB1c2VyczogdS51c2VyXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICAgIHJvbGU6IDFcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkuZmV0Y2goKTtcbiAgICAgICAgICAgIHVzZXJfcm9sZV9pZHMgPSB1c2VyX2Zsb3dfcG9zaXRpb25zLmdldFByb3BlcnR5KFwicm9sZVwiKTtcbiAgICAgICAgICAgIHVzZXJfcm9sZXMgPSBkYi5mbG93X3JvbGVzLmZpbmQoe1xuICAgICAgICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAgICAgICAkaW46IHVzZXJfcm9sZV9pZHNcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgICBuYW1lOiAxXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLmZldGNoKCk7XG4gICAgICAgICAgICBmdS5yb2xlcyA9IHVzZXJfcm9sZXMuZ2V0UHJvcGVydHkoXCJuYW1lXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBkYXRhLnB1c2goZnUpO1xuICAgICAgICAgIHJldHVybiBzZWxlY3RlZC5wdXNoKHUudXNlcik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdXNlcklkcy5mb3JFYWNoKGZ1bmN0aW9uKHVJZCkge1xuICAgICAgICByZXR1cm4gc3BhY2VVc2Vycy5wdXNoKF8uZmluZChkYXRhLCBmdW5jdGlvbihzdSkge1xuICAgICAgICAgIHJldHVybiBzdS5pZCA9PT0gdUlkO1xuICAgICAgICB9KSk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDIwMCxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgJ3NwYWNlVXNlcnMnOiBzcGFjZVVzZXJzXG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iLCJNZXRlb3Iuc3RhcnR1cCAtPlxuXHRKc29uUm91dGVzLmFkZCBcInBvc3RcIiwgXCIvYXBpL2Zvcm11bGEvb3JnYW5pemF0aW9uc1wiLCAocmVxLCByZXMsIG5leHQpIC0+XG5cblx0XHRyZXNfb3JncyA9IFtdXG5cblx0XHRkYXRhID0gW11cblxuXHRcdG9yZ0lkcyA9IHJlcS5ib2R5Lm9yZ0lkc1xuXG5cdFx0c3BhY2VJZCA9IHJlcS5xdWVyeS5zcGFjZUlkXG5cblx0XHRpZiBvcmdJZHNcblx0XHRcdGlmIG5vdCBvcmdJZHMgaW5zdGFuY2VvZiBBcnJheVxuXHRcdFx0XHRvcmdJZHMgPSBbb3JnSWRzXVxuXG5cdFx0XHRxdWVyeSA9IHtfaWQ6IHskaW46IG9yZ0lkc319XG5cblx0XHRcdGlmIHNwYWNlSWRcblx0XHRcdFx0cXVlcnkuc3BhY2UgPSBzcGFjZUlkXG5cblx0XHRcdG9yZ3MgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQocXVlcnksIHtmaWVsZHM6IHtuYW1lOiAxLCBmdWxsbmFtZTogMX19KS5mZXRjaCgpO1xuXG5cdFx0XHRvcmdzLmZvckVhY2ggKG9yZyktPlxuXHRcdFx0XHRkYXRhLnB1c2gge2lkOiBvcmcuX2lkLCBuYW1lOiBvcmcubmFtZSwgZnVsbG5hbWU6IG9yZy5mdWxsbmFtZX1cblxuXHRcdFx0b3JnSWRzLmZvckVhY2ggKG9JZCktPlxuXHRcdFx0XHRyZXNfb3Jncy5wdXNoIF8uZmluZChkYXRhLCAobyktPiByZXR1cm4gby5pZCA9PSBvSWQpXG5cblxuXG5cdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuXHRcdFx0Y29kZTogMjAwLFxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHQnb3Jncyc6IHJlc19vcmdzXG5cdFx0XHR9XG5cdFx0fSk7XG5cbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gSnNvblJvdXRlcy5hZGQoXCJwb3N0XCIsIFwiL2FwaS9mb3JtdWxhL29yZ2FuaXphdGlvbnNcIiwgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgICB2YXIgZGF0YSwgb3JnSWRzLCBvcmdzLCBxdWVyeSwgcmVzX29yZ3MsIHNwYWNlSWQ7XG4gICAgcmVzX29yZ3MgPSBbXTtcbiAgICBkYXRhID0gW107XG4gICAgb3JnSWRzID0gcmVxLmJvZHkub3JnSWRzO1xuICAgIHNwYWNlSWQgPSByZXEucXVlcnkuc3BhY2VJZDtcbiAgICBpZiAob3JnSWRzKSB7XG4gICAgICBpZiAoIW9yZ0lkcyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgIG9yZ0lkcyA9IFtvcmdJZHNdO1xuICAgICAgfVxuICAgICAgcXVlcnkgPSB7XG4gICAgICAgIF9pZDoge1xuICAgICAgICAgICRpbjogb3JnSWRzXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBpZiAoc3BhY2VJZCkge1xuICAgICAgICBxdWVyeS5zcGFjZSA9IHNwYWNlSWQ7XG4gICAgICB9XG4gICAgICBvcmdzID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHF1ZXJ5LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIG5hbWU6IDEsXG4gICAgICAgICAgZnVsbG5hbWU6IDFcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICAgIG9yZ3MuZm9yRWFjaChmdW5jdGlvbihvcmcpIHtcbiAgICAgICAgcmV0dXJuIGRhdGEucHVzaCh7XG4gICAgICAgICAgaWQ6IG9yZy5faWQsXG4gICAgICAgICAgbmFtZTogb3JnLm5hbWUsXG4gICAgICAgICAgZnVsbG5hbWU6IG9yZy5mdWxsbmFtZVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgb3JnSWRzLmZvckVhY2goZnVuY3Rpb24ob0lkKSB7XG4gICAgICAgIHJldHVybiByZXNfb3Jncy5wdXNoKF8uZmluZChkYXRhLCBmdW5jdGlvbihvKSB7XG4gICAgICAgICAgcmV0dXJuIG8uaWQgPT09IG9JZDtcbiAgICAgICAgfSkpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiAyMDAsXG4gICAgICBkYXRhOiB7XG4gICAgICAgICdvcmdzJzogcmVzX29yZ3NcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==
