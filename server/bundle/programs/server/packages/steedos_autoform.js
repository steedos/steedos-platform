(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var _ = Package.underscore._;
var ReactiveVar = Package['reactive-var'].ReactiveVar;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
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
var HTML = Package.htmljs.HTML;

/* Package-scope variables */
var __coffeescriptShare, CFDataManager;

(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                       //
// packages/steedos_autoform/i18n/en.i18n.json.js                                                        //
//                                                                                                       //
///////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                         //
Package['universe:i18n'].i18n.addTranslations('en','',{"coreform_select":"Please select ","coreform_select_user_title":"Please select user","coreform_select_org_title":"Please select organization"});
///////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                       //
// packages/steedos_autoform/i18n/zh-CN.i18n.json.js                                                     //
//                                                                                                       //
///////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                         //
Package['universe:i18n'].i18n.addTranslations('zh-CN','',{"coreform_select":"请选择","coreform_select_user_title":"请选择人员","coreform_select_org_title":"请选择部门"});
///////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

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

}).call(this);






(function(){

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

}).call(this);






(function(){

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

}).call(this);






(function(){

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

}).call(this);


/* Exports */
Package._define("steedos:autoform", {
  CFDataManager: CFDataManager
});

})();

//# sourceURL=meteor://💻app/packages/steedos_autoform.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hdXRvZm9ybS9jbGllbnQvY29yZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2NsaWVudC9jb3JlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hdXRvZm9ybS9jbGllbnQvY29yZWZvcm0vaW5wdXRUeXBlcy9jb3JlZm9ybS11c2VyL2xpYi9jZl90YWJ1bGFyX3NwYWNlX3VzZXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9jbGllbnQvY29yZWZvcm0vaW5wdXRUeXBlcy9jb3JlZm9ybS11c2VyL2xpYi9jZl90YWJ1bGFyX3NwYWNlX3VzZXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2F1dG9mb3JtL3JvdXRlcy9mb3JtdWxhX3NwYWNlX3VzZXJzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcm91dGVzL2Zvcm11bGFfc3BhY2VfdXNlcnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2F1dG9mb3JtL3JvdXRlcy9mb3JtdWxhX29yZ2FuaXphdGlvbnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9yb3V0ZXMvZm9ybXVsYV9vcmdhbml6YXRpb25zLmNvZmZlZSJdLCJuYW1lcyI6WyJUYWJ1bGFyVGFibGVzIiwiTWV0ZW9yIiwic3RhcnR1cCIsIlNpbXBsZVNjaGVtYSIsImV4dGVuZE9wdGlvbnMiLCJiZWZvcmVPcGVuRnVuY3Rpb24iLCJNYXRjaCIsIk9wdGlvbmFsIiwiT25lT2YiLCJGdW5jdGlvbiIsIlN0cmluZyIsImNmX3RhYnVsYXJfc3BhY2VfdXNlciIsIlRhYnVsYXIiLCJUYWJsZSIsIm5hbWUiLCJjb2xsZWN0aW9uIiwiZGIiLCJzcGFjZV91c2VycyIsImRyYXdDYWxsYmFjayIsInNldHRpbmdzIiwiJCIsImF0dHIiLCJjb2x1bW5zIiwiZGF0YSIsInRpdGxlIiwib3JkZXJhYmxlIiwid2lkdGgiLCJyZW5kZXIiLCJ2YWwiLCJ0eXBlIiwiZG9jIiwiaW5wdXQiLCJpbnB1dFR5cGUiLCJyZWYiLCJyZWYxIiwicmVmMiIsImN1c3RvbURhdGEiLCJtdWx0aXBsZSIsInVzZXIiLCJlbWFpbCIsImRlZmF1bHRWYWx1ZXMiLCJpbmNsdWRlcyIsIlN0ZWVkb3MiLCJhYnNvbHV0ZVVybCIsInZpc2libGUiLCJvblVubG9hZCIsImNvbnNvbGUiLCJsb2ciLCJkb20iLCJvcmRlciIsImV4dHJhRmllbGRzIiwibGVuZ3RoQ2hhbmdlIiwicGFnZUxlbmd0aCIsImluZm8iLCJzZWFyY2hpbmciLCJyZXNwb25zaXZlIiwiZGV0YWlscyIsImF1dG9XaWR0aCIsImNoYW5nZVNlbGVjdG9yIiwic2VsZWN0b3IiLCJ1c2VySWQiLCJzcGFjZSIsInNwYWNlX3VzZXIiLCJfaWQiLCIkYW5kIiwibGVuZ3RoIiwiZ2V0UHJvcGVydHkiLCJmaW5kT25lIiwiZmllbGRzIiwicGFnaW5nVHlwZSIsIkpzb25Sb3V0ZXMiLCJhZGQiLCJyZXEiLCJyZXMiLCJuZXh0IiwicXVlcnkiLCJzZWxlY3RlZCIsInNwYWNlSWQiLCJzcGFjZVVzZXJzIiwidXNlcklkcyIsImJvZHkiLCJBcnJheSIsIiRpbiIsImZpbmQiLCJmZXRjaCIsImZvckVhY2giLCJ1IiwiZnUiLCJ1X29yZyIsInVfb3JncyIsInVzZXJfZmxvd19wb3NpdGlvbnMiLCJ1c2VyX3JvbGVfaWRzIiwidXNlcl9yb2xlcyIsImluZGV4T2YiLCJpZCIsInNvcnRfbm8iLCJtb2JpbGUiLCJ3b3JrX3Bob25lIiwicG9zaXRpb24iLCJvcmdhbml6YXRpb25zIiwib3JnYW5pemF0aW9uIiwiZnVsbG5hbWUiLCJociIsImZsb3dfcG9zaXRpb25zIiwiZmxvd19yb2xlcyIsInVzZXJzIiwicm9sZSIsInJvbGVzIiwicHVzaCIsInVJZCIsIl8iLCJzdSIsInNlbmRSZXN1bHQiLCJjb2RlIiwib3JnSWRzIiwib3JncyIsInJlc19vcmdzIiwib3JnIiwib0lkIiwibyJd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QUNMLGdCQUFRNkY7QUFESDtBQUZvQixLQUEzQixDQ1FFO0FEckNILElDQUM7QURERixHIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX2F1dG9mb3JtLmpzIiwic291cmNlc0NvbnRlbnQiOlsiQFRhYnVsYXJUYWJsZXMgPSB7fTtcclxuXHJcblxyXG5NZXRlb3Iuc3RhcnR1cCAtPlxyXG5cdFNpbXBsZVNjaGVtYS5leHRlbmRPcHRpb25zKHtiZWZvcmVPcGVuRnVuY3Rpb246IE1hdGNoLk9wdGlvbmFsKE1hdGNoLk9uZU9mKEZ1bmN0aW9uLCBTdHJpbmcpKX0pIiwidGhpcy5UYWJ1bGFyVGFibGVzID0ge307XG5cbk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gU2ltcGxlU2NoZW1hLmV4dGVuZE9wdGlvbnMoe1xuICAgIGJlZm9yZU9wZW5GdW5jdGlvbjogTWF0Y2guT3B0aW9uYWwoTWF0Y2guT25lT2YoRnVuY3Rpb24sIFN0cmluZykpXG4gIH0pO1xufSk7XG4iLCJNZXRlb3Iuc3RhcnR1cCAoKS0+XHJcblx0VGFidWxhclRhYmxlcy5jZl90YWJ1bGFyX3NwYWNlX3VzZXIgPSBuZXcgVGFidWxhci5UYWJsZSh7XHJcblx0XHRuYW1lOiBcImNmX3RhYnVsYXJfc3BhY2VfdXNlclwiLFxyXG5cdFx0Y29sbGVjdGlvbjogZGIuc3BhY2VfdXNlcnMsXHJcblx0XHRkcmF3Q2FsbGJhY2s6IChzZXR0aW5ncyktPlxyXG5cdFx0XHQkKFwiI2NmX3JldmVyc2VcIikuYXR0cihcImNoZWNrZWRcIiwgZmFsc2UpXHJcblx0XHRjb2x1bW5zOiBbXHJcblx0XHRcdHtcclxuXHRcdFx0XHRkYXRhOiBcIl9pZFwiLFxyXG5cdFx0XHRcdHRpdGxlOiAnPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIG5hbWU9XCJjZl9yZXZlcnNlXCIgaWQ9XCJjZl9yZXZlcnNlXCI+JyxcclxuXHRcdFx0XHRvcmRlcmFibGU6IGZhbHNlLFxyXG5cdFx0XHRcdHdpZHRoOicxMHB4JyxcclxuXHRcdFx0XHRyZW5kZXI6ICAodmFsLCB0eXBlLCBkb2MpIC0+XHJcblxyXG5cdFx0XHRcdFx0aW5wdXRUeXBlID0gXCJjaGVja2JveFwiO1xyXG5cclxuXHRcdFx0XHRcdGlmICFUYWJ1bGFyVGFibGVzLmNmX3RhYnVsYXJfc3BhY2VfdXNlci5jdXN0b21EYXRhPy5tdWx0aXBsZVxyXG5cdFx0XHRcdFx0XHRpbnB1dFR5cGUgPSBcInJhZGlvXCJcclxuXHJcblx0XHRcdFx0XHRpbnB1dCA9ICc8aW5wdXQgdHlwZT1cIicgKyBpbnB1dFR5cGUgKyAnXCIgY2xhc3M9XCJsaXN0X2NoZWNrYm94XCIgbmFtZT1cImNmX2NvbnRhY3RzX2lkc1wiIGlkPVwiJyArIGRvYy51c2VyICsgJ1wiIHZhbHVlPVwiJyArIGRvYy51c2VyICsgJ1wiIGRhdGEtbmFtZT1cIicgKyBkb2MubmFtZSArICdcIiBkYXRhLWVtYWlsPVwiJyArIGRvYy5lbWFpbCArICdcIic7XHJcblxyXG5cdFx0XHRcdFx0aWYgVGFidWxhclRhYmxlcy5jZl90YWJ1bGFyX3NwYWNlX3VzZXIuY3VzdG9tRGF0YT8uZGVmYXVsdFZhbHVlcz8uaW5jbHVkZXMoZG9jLnVzZXIpXHJcblx0XHRcdFx0XHRcdGlucHV0ICs9IFwiIGNoZWNrZWQgXCJcclxuXHJcblx0XHRcdFx0XHRpbnB1dCArPSBcIj5cIlxyXG5cdFx0XHRcdFx0cmV0dXJuIGlucHV0XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRkYXRhOiBcIm5hbWVcIixcclxuXHRcdFx0XHRvcmRlcmFibGU6IGZhbHNlLFxyXG5cdFx0XHRcdHJlbmRlcjogICh2YWwsIHR5cGUsIGRvYykgLT5cclxuXHRcdFx0XHRcdHJldHVybiBcIjxsYWJlbCBkYXRhLXVzZXI9J1wiICsgZG9jLnVzZXIgKyBcIicgY2xhc3M9J2Zvci1pbnB1dCc+PGRpdiBjbGFzcz0ndXNlci1uYW1lJz48aW1nIHNyYz0nXCIgKyBTdGVlZG9zLmFic29sdXRlVXJsKCkgKyBcImF2YXRhci9cIitkb2MudXNlcitcIj93PTI4Jmg9MjUmZnM9MTRcIiArXCInIGNsYXNzPSdzZWxlY3RUYWctcHJvZmlsZSBpbWctY2lyY2xlJz48Zm9udD5cIiArIGRvYy5uYW1lICsgXCI8L2ZvbnQ+PC9kaXY+PC9sYWJlbD5cIlxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0ZGF0YTogXCJzb3J0X25vXCIsXHJcblx0XHRcdFx0dGl0bGU6IFwiXCIsXHJcblx0XHRcdFx0b3JkZXJhYmxlOiB0cnVlLFxyXG5cdFx0XHRcdHZpc2libGU6IGZhbHNlXHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRkYXRhOiBcIm5hbWVcIixcclxuXHRcdFx0XHR0aXRsZTogXCJcIixcclxuXHRcdFx0XHRvcmRlcmFibGU6IHRydWUsXHJcblx0XHRcdFx0dmlzaWJsZTogZmFsc2VcclxuXHRcdFx0fSx7XHJcblx0XHRcdFx0ZGF0YTogXCJlbWFpbFwiLFxyXG5cdFx0XHRcdHRpdGxlOiBcIlwiLFxyXG5cdFx0XHRcdG9yZGVyYWJsZTogZmFsc2UsXHJcblx0XHRcdFx0dmlzaWJsZTogZmFsc2VcclxuXHRcdFx0fVxyXG5cdFx0XSxcclxuXHRcdG9uVW5sb2FkOigpIC0+XHJcblx0XHRcdHJldHVybiBjb25zb2xlLmxvZyhcIm9uVW5sb2FkIG9rLi4uLlwiKTtcclxuI3NlbGVjdDpcclxuIyAgc3R5bGU6ICdzaW5nbGUnXHJcblx0XHRkb206IFwidHBcIixcclxuXHRcdG9yZGVyOltbMixcImRlc2NcIl0sWzMsXCJhc2NcIl1dLFxyXG5cdFx0ZXh0cmFGaWVsZHM6IFtcIl9pZFwiLCBcIm5hbWVcIiwgXCJ1c2VyXCIsIFwic29ydF9ub1wiLCBcImVtYWlsXCJdLFxyXG5cdFx0bGVuZ3RoQ2hhbmdlOiBmYWxzZSxcclxuXHRcdHBhZ2VMZW5ndGg6IDEwMCxcclxuXHRcdGluZm86IGZhbHNlLFxyXG5cdFx0c2VhcmNoaW5nOiB0cnVlLFxyXG5cdFx0cmVzcG9uc2l2ZTpcclxuXHRcdFx0ZGV0YWlsczogZmFsc2VcclxuXHRcdGF1dG9XaWR0aDogZmFsc2UsXHJcblx0XHRjaGFuZ2VTZWxlY3RvcjogKHNlbGVjdG9yLCB1c2VySWQpIC0+XHJcblx0XHRcdHVubGVzcyB1c2VySWRcclxuXHRcdFx0XHRyZXR1cm4ge19pZDogLTF9XHJcblx0XHRcdHNwYWNlID0gc2VsZWN0b3Iuc3BhY2VcclxuXHRcdFx0dW5sZXNzIHNwYWNlXHJcblx0XHRcdFx0aWYgc2VsZWN0b3I/LiRhbmQ/Lmxlbmd0aCA+IDBcclxuXHRcdFx0XHRcdHNwYWNlID0gc2VsZWN0b3IuJGFuZC5nZXRQcm9wZXJ0eSgnc3BhY2UnKVswXVxyXG5cdFx0XHR1bmxlc3Mgc3BhY2VcclxuXHRcdFx0XHRyZXR1cm4ge19pZDogLTF9XHJcblx0XHRcdHNwYWNlX3VzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHt1c2VyOiB1c2VySWQsc3BhY2U6c3BhY2V9LCB7ZmllbGRzOiB7X2lkOiAxfX0pXHJcblx0XHRcdHVubGVzcyBzcGFjZV91c2VyXHJcblx0XHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxyXG5cdFx0XHRyZXR1cm4gc2VsZWN0b3JcclxuXHJcbiNzY3JvbGxZOiAgICAgICAgJzQwMHB4JyxcclxuI3Njcm9sbENvbGxhcHNlOiB0cnVlLFxyXG5cdFx0cGFnaW5nVHlwZTogXCJudW1iZXJzXCJcclxuXHJcblx0fSk7XHJcbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gVGFidWxhclRhYmxlcy5jZl90YWJ1bGFyX3NwYWNlX3VzZXIgPSBuZXcgVGFidWxhci5UYWJsZSh7XG4gICAgbmFtZTogXCJjZl90YWJ1bGFyX3NwYWNlX3VzZXJcIixcbiAgICBjb2xsZWN0aW9uOiBkYi5zcGFjZV91c2VycyxcbiAgICBkcmF3Q2FsbGJhY2s6IGZ1bmN0aW9uKHNldHRpbmdzKSB7XG4gICAgICByZXR1cm4gJChcIiNjZl9yZXZlcnNlXCIpLmF0dHIoXCJjaGVja2VkXCIsIGZhbHNlKTtcbiAgICB9LFxuICAgIGNvbHVtbnM6IFtcbiAgICAgIHtcbiAgICAgICAgZGF0YTogXCJfaWRcIixcbiAgICAgICAgdGl0bGU6ICc8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgbmFtZT1cImNmX3JldmVyc2VcIiBpZD1cImNmX3JldmVyc2VcIj4nLFxuICAgICAgICBvcmRlcmFibGU6IGZhbHNlLFxuICAgICAgICB3aWR0aDogJzEwcHgnLFxuICAgICAgICByZW5kZXI6IGZ1bmN0aW9uKHZhbCwgdHlwZSwgZG9jKSB7XG4gICAgICAgICAgdmFyIGlucHV0LCBpbnB1dFR5cGUsIHJlZiwgcmVmMSwgcmVmMjtcbiAgICAgICAgICBpbnB1dFR5cGUgPSBcImNoZWNrYm94XCI7XG4gICAgICAgICAgaWYgKCEoKHJlZiA9IFRhYnVsYXJUYWJsZXMuY2ZfdGFidWxhcl9zcGFjZV91c2VyLmN1c3RvbURhdGEpICE9IG51bGwgPyByZWYubXVsdGlwbGUgOiB2b2lkIDApKSB7XG4gICAgICAgICAgICBpbnB1dFR5cGUgPSBcInJhZGlvXCI7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlucHV0ID0gJzxpbnB1dCB0eXBlPVwiJyArIGlucHV0VHlwZSArICdcIiBjbGFzcz1cImxpc3RfY2hlY2tib3hcIiBuYW1lPVwiY2ZfY29udGFjdHNfaWRzXCIgaWQ9XCInICsgZG9jLnVzZXIgKyAnXCIgdmFsdWU9XCInICsgZG9jLnVzZXIgKyAnXCIgZGF0YS1uYW1lPVwiJyArIGRvYy5uYW1lICsgJ1wiIGRhdGEtZW1haWw9XCInICsgZG9jLmVtYWlsICsgJ1wiJztcbiAgICAgICAgICBpZiAoKHJlZjEgPSBUYWJ1bGFyVGFibGVzLmNmX3RhYnVsYXJfc3BhY2VfdXNlci5jdXN0b21EYXRhKSAhPSBudWxsID8gKHJlZjIgPSByZWYxLmRlZmF1bHRWYWx1ZXMpICE9IG51bGwgPyByZWYyLmluY2x1ZGVzKGRvYy51c2VyKSA6IHZvaWQgMCA6IHZvaWQgMCkge1xuICAgICAgICAgICAgaW5wdXQgKz0gXCIgY2hlY2tlZCBcIjtcbiAgICAgICAgICB9XG4gICAgICAgICAgaW5wdXQgKz0gXCI+XCI7XG4gICAgICAgICAgcmV0dXJuIGlucHV0O1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGRhdGE6IFwibmFtZVwiLFxuICAgICAgICBvcmRlcmFibGU6IGZhbHNlLFxuICAgICAgICByZW5kZXI6IGZ1bmN0aW9uKHZhbCwgdHlwZSwgZG9jKSB7XG4gICAgICAgICAgcmV0dXJuIFwiPGxhYmVsIGRhdGEtdXNlcj0nXCIgKyBkb2MudXNlciArIFwiJyBjbGFzcz0nZm9yLWlucHV0Jz48ZGl2IGNsYXNzPSd1c2VyLW5hbWUnPjxpbWcgc3JjPSdcIiArIFN0ZWVkb3MuYWJzb2x1dGVVcmwoKSArIFwiYXZhdGFyL1wiICsgZG9jLnVzZXIgKyBcIj93PTI4Jmg9MjUmZnM9MTRcIiArIFwiJyBjbGFzcz0nc2VsZWN0VGFnLXByb2ZpbGUgaW1nLWNpcmNsZSc+PGZvbnQ+XCIgKyBkb2MubmFtZSArIFwiPC9mb250PjwvZGl2PjwvbGFiZWw+XCI7XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAgZGF0YTogXCJzb3J0X25vXCIsXG4gICAgICAgIHRpdGxlOiBcIlwiLFxuICAgICAgICBvcmRlcmFibGU6IHRydWUsXG4gICAgICAgIHZpc2libGU6IGZhbHNlXG4gICAgICB9LCB7XG4gICAgICAgIGRhdGE6IFwibmFtZVwiLFxuICAgICAgICB0aXRsZTogXCJcIixcbiAgICAgICAgb3JkZXJhYmxlOiB0cnVlLFxuICAgICAgICB2aXNpYmxlOiBmYWxzZVxuICAgICAgfSwge1xuICAgICAgICBkYXRhOiBcImVtYWlsXCIsXG4gICAgICAgIHRpdGxlOiBcIlwiLFxuICAgICAgICBvcmRlcmFibGU6IGZhbHNlLFxuICAgICAgICB2aXNpYmxlOiBmYWxzZVxuICAgICAgfVxuICAgIF0sXG4gICAgb25VbmxvYWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKFwib25VbmxvYWQgb2suLi4uXCIpO1xuICAgIH0sXG4gICAgZG9tOiBcInRwXCIsXG4gICAgb3JkZXI6IFtbMiwgXCJkZXNjXCJdLCBbMywgXCJhc2NcIl1dLFxuICAgIGV4dHJhRmllbGRzOiBbXCJfaWRcIiwgXCJuYW1lXCIsIFwidXNlclwiLCBcInNvcnRfbm9cIiwgXCJlbWFpbFwiXSxcbiAgICBsZW5ndGhDaGFuZ2U6IGZhbHNlLFxuICAgIHBhZ2VMZW5ndGg6IDEwMCxcbiAgICBpbmZvOiBmYWxzZSxcbiAgICBzZWFyY2hpbmc6IHRydWUsXG4gICAgcmVzcG9uc2l2ZToge1xuICAgICAgZGV0YWlsczogZmFsc2VcbiAgICB9LFxuICAgIGF1dG9XaWR0aDogZmFsc2UsXG4gICAgY2hhbmdlU2VsZWN0b3I6IGZ1bmN0aW9uKHNlbGVjdG9yLCB1c2VySWQpIHtcbiAgICAgIHZhciByZWYsIHNwYWNlLCBzcGFjZV91c2VyO1xuICAgICAgaWYgKCF1c2VySWQpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBfaWQ6IC0xXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBzcGFjZSA9IHNlbGVjdG9yLnNwYWNlO1xuICAgICAgaWYgKCFzcGFjZSkge1xuICAgICAgICBpZiAoKHNlbGVjdG9yICE9IG51bGwgPyAocmVmID0gc2VsZWN0b3IuJGFuZCkgIT0gbnVsbCA/IHJlZi5sZW5ndGggOiB2b2lkIDAgOiB2b2lkIDApID4gMCkge1xuICAgICAgICAgIHNwYWNlID0gc2VsZWN0b3IuJGFuZC5nZXRQcm9wZXJ0eSgnc3BhY2UnKVswXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKCFzcGFjZSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIF9pZDogLTFcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHNwYWNlX3VzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHtcbiAgICAgICAgdXNlcjogdXNlcklkLFxuICAgICAgICBzcGFjZTogc3BhY2VcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgX2lkOiAxXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgaWYgKCFzcGFjZV91c2VyKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgX2lkOiAtMVxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNlbGVjdG9yO1xuICAgIH0sXG4gICAgcGFnaW5nVHlwZTogXCJudW1iZXJzXCJcbiAgfSk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwIC0+XHJcblx0SnNvblJvdXRlcy5hZGQgXCJwb3N0XCIsIFwiL2FwaS9mb3JtdWxhL3NwYWNlX3VzZXJzXCIsIChyZXEsIHJlcywgbmV4dCkgLT5cclxuXHRcdHVzZXJJZHMgPSByZXEuYm9keS51c2VySWRzXHJcblx0XHRzcGFjZUlkID0gcmVxLnF1ZXJ5LnNwYWNlSWRcclxuXHJcblx0XHRzcGFjZVVzZXJzID0gW11cclxuXHJcblx0XHRkYXRhID0gW11cclxuXHJcblx0XHRpZiAodXNlcklkcylcclxuXHJcblx0XHRcdGlmIG5vdCB1c2VySWRzIGluc3RhbmNlb2YgQXJyYXlcclxuXHRcdFx0XHR1c2VySWRzID0gW3VzZXJJZHNdXHJcblxyXG5cdFx0XHRxdWVyeSA9IHtcclxuXHRcdFx0XHR1c2VyOiB7XHJcblx0XHRcdFx0XHQkaW46IHVzZXJJZHNcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIHNwYWNlSWRcclxuXHRcdFx0XHRxdWVyeS5zcGFjZSA9IHNwYWNlSWRcclxuXHJcblx0XHRcdHNwYWNlX3VzZXJzID0gZGIuc3BhY2VfdXNlcnMuZmluZChxdWVyeSkuZmV0Y2goKTtcclxuXHJcblx0XHRcdHNlbGVjdGVkID0gW11cclxuXHJcblx0XHRcdHNwYWNlX3VzZXJzLmZvckVhY2ggKHUpLT5cclxuXHRcdFx0XHRpZiBzZWxlY3RlZC5pbmRleE9mKHUudXNlcikgPCAwXHJcblx0XHRcdFx0XHRmdSA9IHt9XHJcblxyXG5cdFx0XHRcdFx0ZnUuaWQgPSB1LnVzZXJcclxuXHJcblx0XHRcdFx0XHRmdS5uYW1lID0gdS5uYW1lXHJcblxyXG5cdFx0XHRcdFx0ZnUuc29ydF9ubyA9IHUuc29ydF9ub1xyXG5cclxuXHRcdFx0XHRcdGZ1Lm1vYmlsZSA9IHUubW9iaWxlXHJcblxyXG5cdFx0XHRcdFx0ZnUud29ya19waG9uZSA9IHUud29ya19waG9uZVxyXG5cclxuXHRcdFx0XHRcdGZ1LnBvc2l0aW9uID0gdS5wb3NpdGlvblxyXG5cclxuXHRcdFx0XHRcdHVfb3JnID0gZGIub3JnYW5pemF0aW9ucy5maW5kT25lKHtfaWQ6IHUub3JnYW5pemF0aW9ufSwge2ZpZWxkczoge25hbWU6IDEsIGZ1bGxuYW1lOiAxfX0pXHJcblxyXG5cdFx0XHRcdFx0dV9vcmdzID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtfaWQ6IHskaW46IHUub3JnYW5pemF0aW9uc319LCB7ZmllbGRzOiB7bmFtZTogMSwgZnVsbG5hbWU6IDF9fSkuZmV0Y2goKVxyXG5cclxuXHJcblx0XHRcdFx0XHRmdS5vcmdhbml6YXRpb24gPSB7XHJcblx0XHRcdFx0XHRcdG5hbWU6IHVfb3JnPy5uYW1lLFxyXG5cdFx0XHRcdFx0XHRmdWxsbmFtZTogdV9vcmc/LmZ1bGxuYW1lXHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0ZnUub3JnYW5pemF0aW9ucyA9IHtcclxuXHRcdFx0XHRcdFx0bmFtZTogdV9vcmdzPy5nZXRQcm9wZXJ0eShcIm5hbWVcIiksXHJcblx0XHRcdFx0XHRcdGZ1bGxuYW1lOiB1X29yZ3M/LmdldFByb3BlcnR5KFwiZnVsbG5hbWVcIiksXHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0ZnUuaHIgPSB1LmhyIHx8IHt9XHJcblxyXG5cdFx0XHRcdFx0aWYgZGIuZmxvd19wb3NpdGlvbnMgJiYgZGIuZmxvd19yb2xlc1xyXG5cclxuXHRcdFx0XHRcdFx0dXNlcl9mbG93X3Bvc2l0aW9ucyA9IGRiLmZsb3dfcG9zaXRpb25zLmZpbmQoe3NwYWNlOiB1LnNwYWNlLCB1c2VyczogdS51c2VyfSwge2ZpZWxkczoge3JvbGU6IDF9fSkuZmV0Y2goKTtcclxuXHJcblx0XHRcdFx0XHRcdHVzZXJfcm9sZV9pZHMgPSB1c2VyX2Zsb3dfcG9zaXRpb25zLmdldFByb3BlcnR5KFwicm9sZVwiKTtcclxuXHJcblx0XHRcdFx0XHRcdHVzZXJfcm9sZXMgPSBkYi5mbG93X3JvbGVzLmZpbmQoe19pZDogeyRpbjogdXNlcl9yb2xlX2lkc319LCB7ZmllbGRzOiB7bmFtZTogMX19KS5mZXRjaCgpO1xyXG5cclxuXHRcdFx0XHRcdFx0ZnUucm9sZXMgPSB1c2VyX3JvbGVzLmdldFByb3BlcnR5KFwibmFtZVwiKVxyXG5cclxuXHRcdFx0XHRcdGRhdGEucHVzaCBmdVxyXG5cclxuXHRcdFx0XHRcdHNlbGVjdGVkLnB1c2ggdS51c2VyXHJcblxyXG5cdFx0XHR1c2VySWRzLmZvckVhY2ggKHVJZCktPlxyXG5cdFx0XHRcdHNwYWNlVXNlcnMucHVzaCBfLmZpbmQoZGF0YSwgKHN1KS0+IHJldHVybiBzdS5pZCA9PSB1SWQpXHJcblxyXG5cclxuXHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcclxuXHRcdFx0Y29kZTogMjAwLFxyXG5cdFx0XHRkYXRhOiB7XHJcblx0XHRcdFx0J3NwYWNlVXNlcnMnOiBzcGFjZVVzZXJzXHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBKc29uUm91dGVzLmFkZChcInBvc3RcIiwgXCIvYXBpL2Zvcm11bGEvc3BhY2VfdXNlcnNcIiwgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgICB2YXIgZGF0YSwgcXVlcnksIHNlbGVjdGVkLCBzcGFjZUlkLCBzcGFjZVVzZXJzLCBzcGFjZV91c2VycywgdXNlcklkcztcbiAgICB1c2VySWRzID0gcmVxLmJvZHkudXNlcklkcztcbiAgICBzcGFjZUlkID0gcmVxLnF1ZXJ5LnNwYWNlSWQ7XG4gICAgc3BhY2VVc2VycyA9IFtdO1xuICAgIGRhdGEgPSBbXTtcbiAgICBpZiAodXNlcklkcykge1xuICAgICAgaWYgKCF1c2VySWRzIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgdXNlcklkcyA9IFt1c2VySWRzXTtcbiAgICAgIH1cbiAgICAgIHF1ZXJ5ID0ge1xuICAgICAgICB1c2VyOiB7XG4gICAgICAgICAgJGluOiB1c2VySWRzXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBpZiAoc3BhY2VJZCkge1xuICAgICAgICBxdWVyeS5zcGFjZSA9IHNwYWNlSWQ7XG4gICAgICB9XG4gICAgICBzcGFjZV91c2VycyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQocXVlcnkpLmZldGNoKCk7XG4gICAgICBzZWxlY3RlZCA9IFtdO1xuICAgICAgc3BhY2VfdXNlcnMuZm9yRWFjaChmdW5jdGlvbih1KSB7XG4gICAgICAgIHZhciBmdSwgdV9vcmcsIHVfb3JncywgdXNlcl9mbG93X3Bvc2l0aW9ucywgdXNlcl9yb2xlX2lkcywgdXNlcl9yb2xlcztcbiAgICAgICAgaWYgKHNlbGVjdGVkLmluZGV4T2YodS51c2VyKSA8IDApIHtcbiAgICAgICAgICBmdSA9IHt9O1xuICAgICAgICAgIGZ1LmlkID0gdS51c2VyO1xuICAgICAgICAgIGZ1Lm5hbWUgPSB1Lm5hbWU7XG4gICAgICAgICAgZnUuc29ydF9ubyA9IHUuc29ydF9ubztcbiAgICAgICAgICBmdS5tb2JpbGUgPSB1Lm1vYmlsZTtcbiAgICAgICAgICBmdS53b3JrX3Bob25lID0gdS53b3JrX3Bob25lO1xuICAgICAgICAgIGZ1LnBvc2l0aW9uID0gdS5wb3NpdGlvbjtcbiAgICAgICAgICB1X29yZyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZE9uZSh7XG4gICAgICAgICAgICBfaWQ6IHUub3JnYW5pemF0aW9uXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgIG5hbWU6IDEsXG4gICAgICAgICAgICAgIGZ1bGxuYW1lOiAxXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdV9vcmdzID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtcbiAgICAgICAgICAgIF9pZDoge1xuICAgICAgICAgICAgICAkaW46IHUub3JnYW5pemF0aW9uc1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICBuYW1lOiAxLFxuICAgICAgICAgICAgICBmdWxsbmFtZTogMVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pLmZldGNoKCk7XG4gICAgICAgICAgZnUub3JnYW5pemF0aW9uID0ge1xuICAgICAgICAgICAgbmFtZTogdV9vcmcgIT0gbnVsbCA/IHVfb3JnLm5hbWUgOiB2b2lkIDAsXG4gICAgICAgICAgICBmdWxsbmFtZTogdV9vcmcgIT0gbnVsbCA/IHVfb3JnLmZ1bGxuYW1lIDogdm9pZCAwXG4gICAgICAgICAgfTtcbiAgICAgICAgICBmdS5vcmdhbml6YXRpb25zID0ge1xuICAgICAgICAgICAgbmFtZTogdV9vcmdzICE9IG51bGwgPyB1X29yZ3MuZ2V0UHJvcGVydHkoXCJuYW1lXCIpIDogdm9pZCAwLFxuICAgICAgICAgICAgZnVsbG5hbWU6IHVfb3JncyAhPSBudWxsID8gdV9vcmdzLmdldFByb3BlcnR5KFwiZnVsbG5hbWVcIikgOiB2b2lkIDBcbiAgICAgICAgICB9O1xuICAgICAgICAgIGZ1LmhyID0gdS5ociB8fCB7fTtcbiAgICAgICAgICBpZiAoZGIuZmxvd19wb3NpdGlvbnMgJiYgZGIuZmxvd19yb2xlcykge1xuICAgICAgICAgICAgdXNlcl9mbG93X3Bvc2l0aW9ucyA9IGRiLmZsb3dfcG9zaXRpb25zLmZpbmQoe1xuICAgICAgICAgICAgICBzcGFjZTogdS5zcGFjZSxcbiAgICAgICAgICAgICAgdXNlcnM6IHUudXNlclxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgICByb2xlOiAxXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLmZldGNoKCk7XG4gICAgICAgICAgICB1c2VyX3JvbGVfaWRzID0gdXNlcl9mbG93X3Bvc2l0aW9ucy5nZXRQcm9wZXJ0eShcInJvbGVcIik7XG4gICAgICAgICAgICB1c2VyX3JvbGVzID0gZGIuZmxvd19yb2xlcy5maW5kKHtcbiAgICAgICAgICAgICAgX2lkOiB7XG4gICAgICAgICAgICAgICAgJGluOiB1c2VyX3JvbGVfaWRzXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgICAgbmFtZTogMVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS5mZXRjaCgpO1xuICAgICAgICAgICAgZnUucm9sZXMgPSB1c2VyX3JvbGVzLmdldFByb3BlcnR5KFwibmFtZVwiKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZGF0YS5wdXNoKGZ1KTtcbiAgICAgICAgICByZXR1cm4gc2VsZWN0ZWQucHVzaCh1LnVzZXIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHVzZXJJZHMuZm9yRWFjaChmdW5jdGlvbih1SWQpIHtcbiAgICAgICAgcmV0dXJuIHNwYWNlVXNlcnMucHVzaChfLmZpbmQoZGF0YSwgZnVuY3Rpb24oc3UpIHtcbiAgICAgICAgICByZXR1cm4gc3UuaWQgPT09IHVJZDtcbiAgICAgICAgfSkpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiAyMDAsXG4gICAgICBkYXRhOiB7XG4gICAgICAgICdzcGFjZVVzZXJzJzogc3BhY2VVc2Vyc1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cclxuXHRKc29uUm91dGVzLmFkZCBcInBvc3RcIiwgXCIvYXBpL2Zvcm11bGEvb3JnYW5pemF0aW9uc1wiLCAocmVxLCByZXMsIG5leHQpIC0+XHJcblxyXG5cdFx0cmVzX29yZ3MgPSBbXVxyXG5cclxuXHRcdGRhdGEgPSBbXVxyXG5cclxuXHRcdG9yZ0lkcyA9IHJlcS5ib2R5Lm9yZ0lkc1xyXG5cclxuXHRcdHNwYWNlSWQgPSByZXEucXVlcnkuc3BhY2VJZFxyXG5cclxuXHRcdGlmIG9yZ0lkc1xyXG5cdFx0XHRpZiBub3Qgb3JnSWRzIGluc3RhbmNlb2YgQXJyYXlcclxuXHRcdFx0XHRvcmdJZHMgPSBbb3JnSWRzXVxyXG5cclxuXHRcdFx0cXVlcnkgPSB7X2lkOiB7JGluOiBvcmdJZHN9fVxyXG5cclxuXHRcdFx0aWYgc3BhY2VJZFxyXG5cdFx0XHRcdHF1ZXJ5LnNwYWNlID0gc3BhY2VJZFxyXG5cclxuXHRcdFx0b3JncyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZChxdWVyeSwge2ZpZWxkczoge25hbWU6IDEsIGZ1bGxuYW1lOiAxfX0pLmZldGNoKCk7XHJcblxyXG5cdFx0XHRvcmdzLmZvckVhY2ggKG9yZyktPlxyXG5cdFx0XHRcdGRhdGEucHVzaCB7aWQ6IG9yZy5faWQsIG5hbWU6IG9yZy5uYW1lLCBmdWxsbmFtZTogb3JnLmZ1bGxuYW1lfVxyXG5cclxuXHRcdFx0b3JnSWRzLmZvckVhY2ggKG9JZCktPlxyXG5cdFx0XHRcdHJlc19vcmdzLnB1c2ggXy5maW5kKGRhdGEsIChvKS0+IHJldHVybiBvLmlkID09IG9JZClcclxuXHJcblxyXG5cclxuXHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcclxuXHRcdFx0Y29kZTogMjAwLFxyXG5cdFx0XHRkYXRhOiB7XHJcblx0XHRcdFx0J29yZ3MnOiByZXNfb3Jnc1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gSnNvblJvdXRlcy5hZGQoXCJwb3N0XCIsIFwiL2FwaS9mb3JtdWxhL29yZ2FuaXphdGlvbnNcIiwgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgICB2YXIgZGF0YSwgb3JnSWRzLCBvcmdzLCBxdWVyeSwgcmVzX29yZ3MsIHNwYWNlSWQ7XG4gICAgcmVzX29yZ3MgPSBbXTtcbiAgICBkYXRhID0gW107XG4gICAgb3JnSWRzID0gcmVxLmJvZHkub3JnSWRzO1xuICAgIHNwYWNlSWQgPSByZXEucXVlcnkuc3BhY2VJZDtcbiAgICBpZiAob3JnSWRzKSB7XG4gICAgICBpZiAoIW9yZ0lkcyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgIG9yZ0lkcyA9IFtvcmdJZHNdO1xuICAgICAgfVxuICAgICAgcXVlcnkgPSB7XG4gICAgICAgIF9pZDoge1xuICAgICAgICAgICRpbjogb3JnSWRzXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBpZiAoc3BhY2VJZCkge1xuICAgICAgICBxdWVyeS5zcGFjZSA9IHNwYWNlSWQ7XG4gICAgICB9XG4gICAgICBvcmdzID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHF1ZXJ5LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIG5hbWU6IDEsXG4gICAgICAgICAgZnVsbG5hbWU6IDFcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICAgIG9yZ3MuZm9yRWFjaChmdW5jdGlvbihvcmcpIHtcbiAgICAgICAgcmV0dXJuIGRhdGEucHVzaCh7XG4gICAgICAgICAgaWQ6IG9yZy5faWQsXG4gICAgICAgICAgbmFtZTogb3JnLm5hbWUsXG4gICAgICAgICAgZnVsbG5hbWU6IG9yZy5mdWxsbmFtZVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgb3JnSWRzLmZvckVhY2goZnVuY3Rpb24ob0lkKSB7XG4gICAgICAgIHJldHVybiByZXNfb3Jncy5wdXNoKF8uZmluZChkYXRhLCBmdW5jdGlvbihvKSB7XG4gICAgICAgICAgcmV0dXJuIG8uaWQgPT09IG9JZDtcbiAgICAgICAgfSkpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiAyMDAsXG4gICAgICBkYXRhOiB7XG4gICAgICAgICdvcmdzJzogcmVzX29yZ3NcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==
