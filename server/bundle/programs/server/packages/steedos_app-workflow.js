(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ReactiveVar = Package['reactive-var'].ReactiveVar;
var ReactiveDict = Package['reactive-dict'].ReactiveDict;
var ECMAScript = Package.ecmascript.ECMAScript;
var Random = Package.random.Random;
var DDP = Package['ddp-client'].DDP;
var DDPServer = Package['ddp-server'].DDPServer;
var check = Package.check.check;
var Match = Package.check.Match;
var DDPRateLimiter = Package['ddp-rate-limiter'].DDPRateLimiter;
var _ = Package.underscore._;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var Blaze = Package.blaze.Blaze;
var UI = Package.blaze.UI;
var Handlebars = Package.blaze.Handlebars;
var JsonRoutes = Package['simple:json-routes'].JsonRoutes;
var RestMiddleware = Package['simple:json-routes'].RestMiddleware;
var SimpleSchema = Package['aldeed:simple-schema'].SimpleSchema;
var MongoObject = Package['aldeed:simple-schema'].MongoObject;
var FlowRouter = Package['kadira:flow-router'].FlowRouter;
var Tabular = Package['aldeed:tabular'].Tabular;
var Template = Package['meteorhacks:ssr'].Template;
var SSR = Package['meteorhacks:ssr'].SSR;
var Selector = Package['steedos:base'].Selector;
var Steedos = Package['steedos:base'].Steedos;
var AjaxCollection = Package['steedos:base'].AjaxCollection;
var SteedosDataManager = Package['steedos:base'].SteedosDataManager;
var SteedosOffice = Package['steedos:base'].SteedosOffice;
var billingManager = Package['steedos:base'].billingManager;
var WebhookQueue = Package['steedos:webhookqueue'].WebhookQueue;
var _i18n = Package['universe:i18n']._i18n;
var i18n = Package['universe:i18n'].i18n;
var Promise = Package.promise.Promise;
var meteorInstall = Package.modules.meteorInstall;
var HTML = Package.htmljs.HTML;
var Collection2 = Package['aldeed:collection2-core'].Collection2;
var FS = Package['steedos:cfs-base-package'].FS;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;

/* Package-scope variables */
var __coffeescriptShare;

var require = meteorInstall({"node_modules":{"meteor":{"steedos:app-workflow":{"checkNpm.js":function module(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                           //
// packages/steedos_app-workflow/checkNpm.js                                                                 //
//                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                             //
let checkNpmVersions;
module.link("meteor/tmeasday:check-npm-versions", {
  checkNpmVersions(v) {
    checkNpmVersions = v;
  }

}, 0);
checkNpmVersions({
  eval: ">=0.1.2"
}, 'steedos:app-workflow');
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"core.coffee":function module(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                           //
// packages/steedos_app-workflow/core.coffee                                                                 //
//                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                             //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
this.WorkflowCore = {};

if (Meteor.isClient) {
  WorkflowCore.openFlowDesign = function (locale, space, flow, companyId) {
    var flowName, iframe_url, ref, title, url;
    url = "/applications/designer/current/" + locale.toLocaleLowerCase() + "/?spaceId=" + space;

    if (flow) {
      url = url + ("&flowId=" + flow);
    }

    if (companyId && !Creator.isSpaceAdmin(space, Meteor.userId())) {
      url = url + ("&companyId=" + companyId);
    }

    url = encodeURIComponent(Steedos.absoluteUrl(url));
    title = "" + t("Workflow Designer");

    if (flow) {
      flowName = (ref = db.flows.findOne(flow)) != null ? ref.name : void 0;

      if (flowName) {
        title = flowName + " | " + title;
      }
    }

    title = encodeURIComponent(title);
    iframe_url = "/api/workflow/designer?url=" + url + "&title=" + title;
    return Steedos.openWindow(Steedos.absoluteUrl(iframe_url));
  };

  WorkflowCore.openFormDesign = function (locale, space, form, companyId) {
    return Modal.show('formDesign', {
      formId: form
    }, {
      keyboard: false,
      backdrop: "static"
    });
  };

  Meteor.startup(function () {
    return $(document).keydown(function (e) {
      if (e.keyCode === "13" || e.key === "Enter") {
        if ($(".flow-modal").length !== 1) {
          return;
        }

        if (e.target.tagName !== "TEXTAREA" || $(e.target).closest("div").hasClass("bootstrap-tagsinput")) {
          if ($(".flow-modal").length === 1) {
            return $(".flow-modal .btn-confirm").click();
          }
        }
      }
    });
  });
}

if (Meteor.isServer) {
  WorkflowCore.checkCreatePermissions = function (spaceId, uid, company_id) {
    if (company_id) {
      if (Creator.getCollection("company").find({
        _id: company_id,
        space: spaceId
      }).count() === 0) {
        return false;
      }
    }

    return true;
  };
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"server":{"methods":{"flow_copy.coffee":function module(require){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                           //
// packages/steedos_app-workflow/server/methods/flow_copy.coffee                                             //
//                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                             //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var workflowMethods;
workflowMethods = require('@steedos/workflow').workflowMethods;
Meteor.methods({
  flow_copy: function (spaceId, flowId, options) {
    return workflowMethods.flow_copy.apply(this, arguments);
  }
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"distribute.coffee":function module(require){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                           //
// packages/steedos_app-workflow/server/methods/distribute.coffee                                            //
//                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                             //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var workflowMethods;
workflowMethods = require('@steedos/workflow').workflowMethods;
Meteor.methods({
  get_distribute_flows: function (options) {
    return workflowMethods.get_distribute_flows.apply(this, arguments);
  },
  update_distribute_settings: function (flow_id, distribute_optional_users_id, step_flows, distribute_to_self, distribute_end_notification, upload_after_being_distributed) {
    return workflowMethods.update_distribute_settings.apply(this, arguments);
  }
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"workflow.app.coffee":function module(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                           //
// packages/steedos_app-workflow/workflow.app.coffee                                                         //
//                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                             //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"cfs":{"instances.coffee":function module(require){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                           //
// packages/steedos_app-workflow/cfs/instances.coffee                                                        //
//                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                             //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
fs_store;
var fs_store, ref, ref1, ref2, store_name;
store_name = "instances";

if (((ref = Meteor.settings["public"].cfs) != null ? ref.store : void 0) === "OSS") {
  if (Meteor.isClient) {
    fs_store = new FS.Store.OSS(store_name);
  } else if (Meteor.isServer) {
    fs_store = new FS.Store.OSS(store_name, Meteor.settings.cfs.aliyun);
  }
} else if (((ref1 = Meteor.settings["public"].cfs) != null ? ref1.store : void 0) === "S3") {
  if (Meteor.isClient) {
    fs_store = new FS.Store.S3(store_name);
  } else if (Meteor.isServer) {
    fs_store = new FS.Store.S3(store_name, Meteor.settings.cfs.aws);
  }
} else if (((ref2 = Meteor.settings["public"].cfs) != null ? ref2.store : void 0) === "STEEDOSCLOUD") {
  if (Meteor.isClient) {
    fs_store = new FS.Store.STEEDOSCLOUD(store_name);
  } else if (Meteor.isServer) {
    fs_store = new FS.Store.STEEDOSCLOUD(store_name, Meteor.settings.cfs.steedosCloud);
  }
} else {
  if (Meteor.isClient) {
    fs_store = new FS.Store.FileSystem(store_name);
  } else if (Meteor.isServer) {
    fs_store = new FS.Store.FileSystem(store_name, {
      path: require('path').join(process.env.STEEDOS_STORAGE_DIR, "files/" + store_name),
      fileKeyMaker: function (fileObj) {
        var absolutePath, extention, filename, filenameInStore, final_filename, ins_id, mkdirp, month, name, name_split, now, path, pathname, store, year;
        store = fileObj && fileObj._getInfo(store_name);

        if (store && store.key) {
          return store.key;
        }

        filename = fileObj.name();
        filenameInStore = fileObj.name({
          store: store_name
        });
        name = filenameInStore || filename;
        name_split = name.split('.');
        extention = name_split.pop();
        final_filename = name_split.join('.').substring(0, 50) + '.' + extention;
        now = new Date();
        year = now.getFullYear();
        month = now.getMonth() + 1;
        ins_id = fileObj.metadata.instance;
        path = require('path');
        mkdirp = require('mkdirp');
        pathname = path.join(process.env.STEEDOS_STORAGE_DIR, "files/" + store_name + "/" + year + '/' + month + '/' + ins_id);
        absolutePath = path.resolve(pathname);
        mkdirp.sync(absolutePath);
        return year + '/' + month + '/' + ins_id + '/' + fileObj.collectionName + '-' + fileObj._id + '-' + final_filename;
      }
    });
  }
}

cfs[store_name] = new FS.Collection(store_name, {
  stores: [fs_store]
});
cfs[store_name].allow({
  download: function () {
    return true;
  }
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}},{
  "extensions": [
    ".js",
    ".json",
    ".coffee"
  ]
});

require("/node_modules/meteor/steedos:app-workflow/checkNpm.js");
require("/node_modules/meteor/steedos:app-workflow/core.coffee");
require("/node_modules/meteor/steedos:app-workflow/server/methods/flow_copy.coffee");
require("/node_modules/meteor/steedos:app-workflow/workflow.app.coffee");
require("/node_modules/meteor/steedos:app-workflow/cfs/instances.coffee");
require("/node_modules/meteor/steedos:app-workflow/server/methods/distribute.coffee");

/* Exports */
Package._define("steedos:app-workflow", {
  Template: Template
});

})();

//# sourceURL=meteor://💻app/packages/steedos_app-workflow.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczphcHAtd29ya2Zsb3cvY2hlY2tOcG0uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYXBwLXdvcmtmbG93L2NvcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9jb3JlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hcHAtd29ya2Zsb3cvc2VydmVyL21ldGhvZHMvZmxvd19jb3B5LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hcHAtd29ya2Zsb3cvc2VydmVyL21ldGhvZHMvZGlzdHJpYnV0ZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYXBwLXdvcmtmbG93L2Nmcy9pbnN0YW5jZXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9jZnMvaW5zdGFuY2VzLmNvZmZlZSJdLCJuYW1lcyI6WyJjaGVja05wbVZlcnNpb25zIiwibW9kdWxlIiwibGluayIsInYiLCJldmFsIiwiV29ya2Zsb3dDb3JlIiwiTWV0ZW9yIiwiaXNDbGllbnQiLCJvcGVuRmxvd0Rlc2lnbiIsImxvY2FsZSIsInNwYWNlIiwiZmxvdyIsImNvbXBhbnlJZCIsImZsb3dOYW1lIiwiaWZyYW1lX3VybCIsInJlZiIsInRpdGxlIiwidXJsIiwidG9Mb2NhbGVMb3dlckNhc2UiLCJDcmVhdG9yIiwiaXNTcGFjZUFkbWluIiwidXNlcklkIiwiZW5jb2RlVVJJQ29tcG9uZW50IiwiU3RlZWRvcyIsImFic29sdXRlVXJsIiwidCIsImRiIiwiZmxvd3MiLCJmaW5kT25lIiwibmFtZSIsIm9wZW5XaW5kb3ciLCJvcGVuRm9ybURlc2lnbiIsImZvcm0iLCJNb2RhbCIsInNob3ciLCJmb3JtSWQiLCJrZXlib2FyZCIsImJhY2tkcm9wIiwic3RhcnR1cCIsIiQiLCJkb2N1bWVudCIsImtleWRvd24iLCJlIiwia2V5Q29kZSIsImtleSIsImxlbmd0aCIsInRhcmdldCIsInRhZ05hbWUiLCJjbG9zZXN0IiwiaGFzQ2xhc3MiLCJjbGljayIsImlzU2VydmVyIiwiY2hlY2tDcmVhdGVQZXJtaXNzaW9ucyIsInNwYWNlSWQiLCJ1aWQiLCJjb21wYW55X2lkIiwiZ2V0Q29sbGVjdGlvbiIsImZpbmQiLCJfaWQiLCJjb3VudCIsIndvcmtmbG93TWV0aG9kcyIsInJlcXVpcmUiLCJtZXRob2RzIiwiZmxvd19jb3B5IiwiZmxvd0lkIiwib3B0aW9ucyIsImFwcGx5IiwiYXJndW1lbnRzIiwiZ2V0X2Rpc3RyaWJ1dGVfZmxvd3MiLCJ1cGRhdGVfZGlzdHJpYnV0ZV9zZXR0aW5ncyIsImZsb3dfaWQiLCJkaXN0cmlidXRlX29wdGlvbmFsX3VzZXJzX2lkIiwic3RlcF9mbG93cyIsImRpc3RyaWJ1dGVfdG9fc2VsZiIsImRpc3RyaWJ1dGVfZW5kX25vdGlmaWNhdGlvbiIsInVwbG9hZF9hZnRlcl9iZWluZ19kaXN0cmlidXRlZCIsImZzX3N0b3JlIiwicmVmMSIsInJlZjIiLCJzdG9yZV9uYW1lIiwic2V0dGluZ3MiLCJjZnMiLCJzdG9yZSIsIkZTIiwiU3RvcmUiLCJPU1MiLCJhbGl5dW4iLCJTMyIsImF3cyIsIlNURUVET1NDTE9VRCIsInN0ZWVkb3NDbG91ZCIsIkZpbGVTeXN0ZW0iLCJwYXRoIiwiam9pbiIsInByb2Nlc3MiLCJlbnYiLCJTVEVFRE9TX1NUT1JBR0VfRElSIiwiZmlsZUtleU1ha2VyIiwiZmlsZU9iaiIsImFic29sdXRlUGF0aCIsImV4dGVudGlvbiIsImZpbGVuYW1lIiwiZmlsZW5hbWVJblN0b3JlIiwiZmluYWxfZmlsZW5hbWUiLCJpbnNfaWQiLCJta2RpcnAiLCJtb250aCIsIm5hbWVfc3BsaXQiLCJub3ciLCJwYXRobmFtZSIsInllYXIiLCJfZ2V0SW5mbyIsInNwbGl0IiwicG9wIiwic3Vic3RyaW5nIiwiRGF0ZSIsImdldEZ1bGxZZWFyIiwiZ2V0TW9udGgiLCJtZXRhZGF0YSIsImluc3RhbmNlIiwicmVzb2x2ZSIsInN5bmMiLCJjb2xsZWN0aW9uTmFtZSIsIkNvbGxlY3Rpb24iLCJzdG9yZXMiLCJhbGxvdyIsImRvd25sb2FkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxnQkFBSjtBQUFxQkMsTUFBTSxDQUFDQyxJQUFQLENBQVksb0NBQVosRUFBaUQ7QUFBQ0Ysa0JBQWdCLENBQUNHLENBQUQsRUFBRztBQUFDSCxvQkFBZ0IsR0FBQ0csQ0FBakI7QUFBbUI7O0FBQXhDLENBQWpELEVBQTJGLENBQTNGO0FBR3JCSCxnQkFBZ0IsQ0FBQztBQUNoQkksTUFBSSxFQUFFO0FBRFUsQ0FBRCxFQUViLHNCQUZhLENBQWhCLEM7Ozs7Ozs7Ozs7OztBQ0hBLEtBQUNDLFlBQUQsR0FBZ0IsRUFBaEI7O0FBRUEsSUFBR0MsT0FBT0MsUUFBVjtBQUNDRixlQUFhRyxjQUFiLEdBQThCLFVBQUNDLE1BQUQsRUFBU0MsS0FBVCxFQUFnQkMsSUFBaEIsRUFBc0JDLFNBQXRCO0FBQzdCLFFBQUFDLFFBQUEsRUFBQUMsVUFBQSxFQUFBQyxHQUFBLEVBQUFDLEtBQUEsRUFBQUMsR0FBQTtBQUFBQSxVQUFNLG9DQUFrQ1IsT0FBT1MsaUJBQVAsRUFBbEMsR0FBNkQsWUFBN0QsR0FBeUVSLEtBQS9FOztBQUNBLFFBQUdDLElBQUg7QUFDQ00sWUFBTUEsT0FBTSxhQUFXTixJQUFqQixDQUFOO0FDRUU7O0FEREgsUUFBR0MsYUFBYSxDQUFDTyxRQUFRQyxZQUFSLENBQXFCVixLQUFyQixFQUE0QkosT0FBT2UsTUFBUCxFQUE1QixDQUFqQjtBQUNDSixZQUFNQSxPQUFNLGdCQUFjTCxTQUFwQixDQUFOO0FDR0U7O0FEREhLLFVBQU1LLG1CQUFtQkMsUUFBUUMsV0FBUixDQUFvQlAsR0FBcEIsQ0FBbkIsQ0FBTjtBQUNBRCxZQUFRLEtBQUdTLEVBQUUsbUJBQUYsQ0FBWDs7QUFDQSxRQUFHZCxJQUFIO0FBQ0NFLGlCQUFBLENBQUFF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ZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX2FwcC13b3JrZmxvdy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG5cdGNoZWNrTnBtVmVyc2lvbnNcbn0gZnJvbSAnbWV0ZW9yL3RtZWFzZGF5OmNoZWNrLW5wbS12ZXJzaW9ucyc7XG5jaGVja05wbVZlcnNpb25zKHtcblx0ZXZhbDogXCI+PTAuMS4yXCIsXG59LCAnc3RlZWRvczphcHAtd29ya2Zsb3cnKTsiLCJAV29ya2Zsb3dDb3JlID0ge31cblxuaWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFdvcmtmbG93Q29yZS5vcGVuRmxvd0Rlc2lnbiA9IChsb2NhbGUsIHNwYWNlLCBmbG93LCBjb21wYW55SWQpLT5cblx0XHR1cmwgPSBcIi9hcHBsaWNhdGlvbnMvZGVzaWduZXIvY3VycmVudC8je2xvY2FsZS50b0xvY2FsZUxvd2VyQ2FzZSgpfS8/c3BhY2VJZD0je3NwYWNlfVwiXG5cdFx0aWYgZmxvd1xuXHRcdFx0dXJsID0gdXJsICsgXCImZmxvd0lkPSN7Zmxvd31cIlxuXHRcdGlmIGNvbXBhbnlJZCAmJiAhQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2UsIE1ldGVvci51c2VySWQoKSlcblx0XHRcdHVybCA9IHVybCArIFwiJmNvbXBhbnlJZD0je2NvbXBhbnlJZH1cIlxuXHRcdFxuXHRcdHVybCA9IGVuY29kZVVSSUNvbXBvbmVudChTdGVlZG9zLmFic29sdXRlVXJsKHVybCkpXG5cdFx0dGl0bGUgPSBcIiN7dChcIldvcmtmbG93IERlc2lnbmVyXCIpfVwiXG5cdFx0aWYgZmxvd1xuXHRcdFx0Zmxvd05hbWUgPSBkYi5mbG93cy5maW5kT25lKGZsb3cpPy5uYW1lXG5cdFx0XHRpZiBmbG93TmFtZVxuXHRcdFx0XHR0aXRsZSA9IFwiI3tmbG93TmFtZX0gfCAje3RpdGxlfVwiXG5cdFx0dGl0bGUgPSBlbmNvZGVVUklDb21wb25lbnQodGl0bGUpXG5cdFx0aWZyYW1lX3VybCA9IFwiL2FwaS93b3JrZmxvdy9kZXNpZ25lcj91cmw9I3t1cmx9JnRpdGxlPSN7dGl0bGV9XCJcblx0XHRTdGVlZG9zLm9wZW5XaW5kb3cgU3RlZWRvcy5hYnNvbHV0ZVVybChpZnJhbWVfdXJsKVxuXHRXb3JrZmxvd0NvcmUub3BlbkZvcm1EZXNpZ24gPSAobG9jYWxlLCBzcGFjZSwgZm9ybSwgY29tcGFueUlkKS0+XG5cdFx0TW9kYWwuc2hvdygnZm9ybURlc2lnbicsIHtmb3JtSWQ6IGZvcm19LCB7a2V5Ym9hcmQ6ZmFsc2UsIGJhY2tkcm9wOiBcInN0YXRpY1wifSlcblxuXHRNZXRlb3Iuc3RhcnR1cCAtPlxuXHRcdCQoZG9jdW1lbnQpLmtleWRvd24gKGUpIC0+XG5cdFx0XHRpZiBlLmtleUNvZGUgPT0gXCIxM1wiIG9yIGUua2V5ID09IFwiRW50ZXJcIlxuXHRcdFx0XHRpZiAkKFwiLmZsb3ctbW9kYWxcIikubGVuZ3RoICE9IDFcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdGlmIGUudGFyZ2V0LnRhZ05hbWUgIT0gXCJURVhUQVJFQVwiIG9yICQoZS50YXJnZXQpLmNsb3Nlc3QoXCJkaXZcIikuaGFzQ2xhc3MoXCJib290c3RyYXAtdGFnc2lucHV0XCIpXG5cdFx0XHRcdFx0aWYgJChcIi5mbG93LW1vZGFsXCIpLmxlbmd0aCA9PSAxXG5cdFx0XHRcdFx0XHQkKFwiLmZsb3ctbW9kYWwgLmJ0bi1jb25maXJtXCIpLmNsaWNrKClcblxuaWYgTWV0ZW9yLmlzU2VydmVyXG5cdFdvcmtmbG93Q29yZS5jaGVja0NyZWF0ZVBlcm1pc3Npb25zID0gKHNwYWNlSWQsIHVpZCwgY29tcGFueV9pZCktPlxuI1x0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMoc3BhY2VJZCwgdWlkLCAnZmxvd3MnKVxuI1xuI1x0XHRpZiAhcGVybWlzc2lvbnMuYWxsb3dDcmVhdGVcbiNcdFx0XHRyZXR1cm4gZmFsc2VcbiNcbiNcdFx0IyDlpoLmnpzkuI3mmK/lt6XkvZzljLrnrqHnkIblkZgsIOWImeW/hemhu+imgeaMh+WummNvbXBhbnlfaWRcbiNcdFx0aWYgIVN0ZWVkb3MuaXNTcGFjZUFkbWluKHNwYWNlSWQsIHVpZClcbiNcdFx0XHR1c2VyQ29tcGFueUlkID0gQ3JlYXRvci5nZXRVc2VyQ29tcGFueUlkKHVpZCwgc3BhY2VJZClcbiNcdFx0XHRpZiAhY29tcGFueV9pZCB8fCAhdXNlckNvbXBhbnlJZCB8fCBjb21wYW55X2lkICE9IHVzZXJDb21wYW55SWRcbiNcdFx0XHRcdHJldHVybiBmYWxzZVxuXG5cdFx0aWYgY29tcGFueV9pZFxuXHRcdFx0aWYgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwiY29tcGFueVwiKS5maW5kKHsgX2lkOiBjb21wYW55X2lkLCBzcGFjZTogc3BhY2VJZCB9KS5jb3VudCgpID09IDBcblx0XHRcdFx0cmV0dXJuIGZhbHNlXG5cblx0XHRyZXR1cm4gdHJ1ZSIsInRoaXMuV29ya2Zsb3dDb3JlID0ge307XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgV29ya2Zsb3dDb3JlLm9wZW5GbG93RGVzaWduID0gZnVuY3Rpb24obG9jYWxlLCBzcGFjZSwgZmxvdywgY29tcGFueUlkKSB7XG4gICAgdmFyIGZsb3dOYW1lLCBpZnJhbWVfdXJsLCByZWYsIHRpdGxlLCB1cmw7XG4gICAgdXJsID0gXCIvYXBwbGljYXRpb25zL2Rlc2lnbmVyL2N1cnJlbnQvXCIgKyAobG9jYWxlLnRvTG9jYWxlTG93ZXJDYXNlKCkpICsgXCIvP3NwYWNlSWQ9XCIgKyBzcGFjZTtcbiAgICBpZiAoZmxvdykge1xuICAgICAgdXJsID0gdXJsICsgKFwiJmZsb3dJZD1cIiArIGZsb3cpO1xuICAgIH1cbiAgICBpZiAoY29tcGFueUlkICYmICFDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZSwgTWV0ZW9yLnVzZXJJZCgpKSkge1xuICAgICAgdXJsID0gdXJsICsgKFwiJmNvbXBhbnlJZD1cIiArIGNvbXBhbnlJZCk7XG4gICAgfVxuICAgIHVybCA9IGVuY29kZVVSSUNvbXBvbmVudChTdGVlZG9zLmFic29sdXRlVXJsKHVybCkpO1xuICAgIHRpdGxlID0gXCJcIiArICh0KFwiV29ya2Zsb3cgRGVzaWduZXJcIikpO1xuICAgIGlmIChmbG93KSB7XG4gICAgICBmbG93TmFtZSA9IChyZWYgPSBkYi5mbG93cy5maW5kT25lKGZsb3cpKSAhPSBudWxsID8gcmVmLm5hbWUgOiB2b2lkIDA7XG4gICAgICBpZiAoZmxvd05hbWUpIHtcbiAgICAgICAgdGl0bGUgPSBmbG93TmFtZSArIFwiIHwgXCIgKyB0aXRsZTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGl0bGUgPSBlbmNvZGVVUklDb21wb25lbnQodGl0bGUpO1xuICAgIGlmcmFtZV91cmwgPSBcIi9hcGkvd29ya2Zsb3cvZGVzaWduZXI/dXJsPVwiICsgdXJsICsgXCImdGl0bGU9XCIgKyB0aXRsZTtcbiAgICByZXR1cm4gU3RlZWRvcy5vcGVuV2luZG93KFN0ZWVkb3MuYWJzb2x1dGVVcmwoaWZyYW1lX3VybCkpO1xuICB9O1xuICBXb3JrZmxvd0NvcmUub3BlbkZvcm1EZXNpZ24gPSBmdW5jdGlvbihsb2NhbGUsIHNwYWNlLCBmb3JtLCBjb21wYW55SWQpIHtcbiAgICByZXR1cm4gTW9kYWwuc2hvdygnZm9ybURlc2lnbicsIHtcbiAgICAgIGZvcm1JZDogZm9ybVxuICAgIH0sIHtcbiAgICAgIGtleWJvYXJkOiBmYWxzZSxcbiAgICAgIGJhY2tkcm9wOiBcInN0YXRpY1wiXG4gICAgfSk7XG4gIH07XG4gIE1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAkKGRvY3VtZW50KS5rZXlkb3duKGZ1bmN0aW9uKGUpIHtcbiAgICAgIGlmIChlLmtleUNvZGUgPT09IFwiMTNcIiB8fCBlLmtleSA9PT0gXCJFbnRlclwiKSB7XG4gICAgICAgIGlmICgkKFwiLmZsb3ctbW9kYWxcIikubGVuZ3RoICE9PSAxKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlLnRhcmdldC50YWdOYW1lICE9PSBcIlRFWFRBUkVBXCIgfHwgJChlLnRhcmdldCkuY2xvc2VzdChcImRpdlwiKS5oYXNDbGFzcyhcImJvb3RzdHJhcC10YWdzaW5wdXRcIikpIHtcbiAgICAgICAgICBpZiAoJChcIi5mbG93LW1vZGFsXCIpLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgcmV0dXJuICQoXCIuZmxvdy1tb2RhbCAuYnRuLWNvbmZpcm1cIikuY2xpY2soKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgV29ya2Zsb3dDb3JlLmNoZWNrQ3JlYXRlUGVybWlzc2lvbnMgPSBmdW5jdGlvbihzcGFjZUlkLCB1aWQsIGNvbXBhbnlfaWQpIHtcbiAgICBpZiAoY29tcGFueV9pZCkge1xuICAgICAgaWYgKENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcImNvbXBhbnlcIikuZmluZCh7XG4gICAgICAgIF9pZDogY29tcGFueV9pZCxcbiAgICAgICAgc3BhY2U6IHNwYWNlSWRcbiAgICAgIH0pLmNvdW50KCkgPT09IDApIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcbn1cbiIsInsgd29ya2Zsb3dNZXRob2RzIH0gPSByZXF1aXJlKCdAc3RlZWRvcy93b3JrZmxvdycpXG5NZXRlb3IubWV0aG9kc1xuXHRmbG93X2NvcHk6IChzcGFjZUlkLCBmbG93SWQsIG9wdGlvbnMpLT5cblx0XHRyZXR1cm4gd29ya2Zsb3dNZXRob2RzLmZsb3dfY29weS5hcHBseSh0aGlzLCBhcmd1bWVudHMpIiwieyB3b3JrZmxvd01ldGhvZHMgfSA9IHJlcXVpcmUoJ0BzdGVlZG9zL3dvcmtmbG93Jylcbk1ldGVvci5tZXRob2RzXG5cdGdldF9kaXN0cmlidXRlX2Zsb3dzOiAob3B0aW9ucykgLT5cblx0XHRyZXR1cm4gd29ya2Zsb3dNZXRob2RzLmdldF9kaXN0cmlidXRlX2Zsb3dzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcblxuXHR1cGRhdGVfZGlzdHJpYnV0ZV9zZXR0aW5nczogKGZsb3dfaWQsIGRpc3RyaWJ1dGVfb3B0aW9uYWxfdXNlcnNfaWQsIHN0ZXBfZmxvd3MsIGRpc3RyaWJ1dGVfdG9fc2VsZiwgZGlzdHJpYnV0ZV9lbmRfbm90aWZpY2F0aW9uLCB1cGxvYWRfYWZ0ZXJfYmVpbmdfZGlzdHJpYnV0ZWQpIC0+XG5cdFx0cmV0dXJuIHdvcmtmbG93TWV0aG9kcy51cGRhdGVfZGlzdHJpYnV0ZV9zZXR0aW5ncy5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG4iLCJmc19zdG9yZVxuc3RvcmVfbmFtZSA9IFwiaW5zdGFuY2VzXCJcbmlmIE1ldGVvci5zZXR0aW5ncy5wdWJsaWMuY2ZzPy5zdG9yZSA9PSBcIk9TU1wiXG4gICAgaWYgTWV0ZW9yLmlzQ2xpZW50XG4gICAgICAgIGZzX3N0b3JlID0gbmV3IEZTLlN0b3JlLk9TUyhzdG9yZV9uYW1lKVxuICAgIGVsc2UgaWYgTWV0ZW9yLmlzU2VydmVyXG4gICAgICAgIGZzX3N0b3JlID0gbmV3IEZTLlN0b3JlLk9TUyBzdG9yZV9uYW1lLCBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmFsaXl1blxuXG5lbHNlIGlmIE1ldGVvci5zZXR0aW5ncy5wdWJsaWMuY2ZzPy5zdG9yZSA9PSBcIlMzXCJcbiAgICBpZiBNZXRlb3IuaXNDbGllbnRcbiAgICAgICAgZnNfc3RvcmUgPSBuZXcgRlMuU3RvcmUuUzMoc3RvcmVfbmFtZSlcbiAgICBlbHNlIGlmIE1ldGVvci5pc1NlcnZlclxuICAgICAgICBmc19zdG9yZSA9IG5ldyBGUy5TdG9yZS5TMyBzdG9yZV9uYW1lLCBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmF3c1xuXG5lbHNlIGlmIE1ldGVvci5zZXR0aW5ncy5wdWJsaWMuY2ZzPy5zdG9yZSA9PSBcIlNURUVET1NDTE9VRFwiXG4gICAgaWYgTWV0ZW9yLmlzQ2xpZW50XG4gICAgICAgIGZzX3N0b3JlID0gbmV3IEZTLlN0b3JlLlNURUVET1NDTE9VRChzdG9yZV9uYW1lKVxuICAgIGVsc2UgaWYgTWV0ZW9yLmlzU2VydmVyXG4gICAgICAgIGZzX3N0b3JlID0gbmV3IEZTLlN0b3JlLlNURUVET1NDTE9VRCBzdG9yZV9uYW1lLCBNZXRlb3Iuc2V0dGluZ3MuY2ZzLnN0ZWVkb3NDbG91ZFxuZWxzZVxuICAgIGlmIE1ldGVvci5pc0NsaWVudFxuICAgICAgICBmc19zdG9yZSA9IG5ldyBGUy5TdG9yZS5GaWxlU3lzdGVtKHN0b3JlX25hbWUpXG4gICAgZWxzZSBpZiBNZXRlb3IuaXNTZXJ2ZXJcbiAgICAgICAgZnNfc3RvcmUgPSBuZXcgRlMuU3RvcmUuRmlsZVN5c3RlbShzdG9yZV9uYW1lLCB7XG4gICAgICAgICAgICAgICAgcGF0aDogcmVxdWlyZSgncGF0aCcpLmpvaW4ocHJvY2Vzcy5lbnYuU1RFRURPU19TVE9SQUdFX0RJUiwgXCJmaWxlcy8je3N0b3JlX25hbWV9XCIpLFxuICAgICAgICAgICAgICAgIGZpbGVLZXlNYWtlcjogKGZpbGVPYmopLT5cbiAgICAgICAgICAgICAgICAgICAgIyBMb29rdXAgdGhlIGNvcHlcbiAgICAgICAgICAgICAgICAgICAgc3RvcmUgPSBmaWxlT2JqIGFuZCBmaWxlT2JqLl9nZXRJbmZvKHN0b3JlX25hbWUpXG4gICAgICAgICAgICAgICAgICAgICMgSWYgdGhlIHN0b3JlIGFuZCBrZXkgaXMgZm91bmQgcmV0dXJuIHRoZSBrZXlcbiAgICAgICAgICAgICAgICAgICAgaWYgc3RvcmUgYW5kIHN0b3JlLmtleVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0b3JlLmtleVxuXG4gICAgICAgICAgICAgICAgICAgICMgVE8gQ1VTVE9NSVpFLCBSRVBMQUNFIENPREUgQUZURVIgVEhJUyBQT0lOVFxuXG4gICAgICAgICAgICAgICAgICAgIGZpbGVuYW1lID0gZmlsZU9iai5uYW1lKCk7XG4gICAgICAgICAgICAgICAgICAgIGZpbGVuYW1lSW5TdG9yZSA9IGZpbGVPYmoubmFtZSh7c3RvcmU6IHN0b3JlX25hbWV9KVxuXG4gICAgICAgICAgICAgICAgICAgIG5hbWUgPSBmaWxlbmFtZUluU3RvcmUgfHwgZmlsZW5hbWVcblxuICAgICAgICAgICAgICAgICAgICBuYW1lX3NwbGl0ID0gbmFtZS5zcGxpdCgnLicpXG4gICAgICAgICAgICAgICAgICAgIGV4dGVudGlvbiA9IG5hbWVfc3BsaXQucG9wKClcblxuICAgICAgICAgICAgICAgICAgICBmaW5hbF9maWxlbmFtZSA9IG5hbWVfc3BsaXQuam9pbignLicpLnN1YnN0cmluZygwLDUwKSArICcuJyArIGV4dGVudGlvblxuXG4gICAgICAgICAgICAgICAgICAgIG5vdyA9IG5ldyBEYXRlXG4gICAgICAgICAgICAgICAgICAgIHllYXIgPSBub3cuZ2V0RnVsbFllYXIoKVxuICAgICAgICAgICAgICAgICAgICBtb250aCA9IG5vdy5nZXRNb250aCgpICsgMVxuICAgICAgICAgICAgICAgICAgICBpbnNfaWQgPSBmaWxlT2JqLm1ldGFkYXRhLmluc3RhbmNlXG5cbiAgICAgICAgICAgICAgICAgICAgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuICAgICAgICAgICAgICAgICAgICBta2RpcnAgPSByZXF1aXJlKCdta2RpcnAnKVxuICAgICAgICAgICAgICAgICAgICBwYXRobmFtZSA9IHBhdGguam9pbihwcm9jZXNzLmVudi5TVEVFRE9TX1NUT1JBR0VfRElSLCBcImZpbGVzLyN7c3RvcmVfbmFtZX0vXCIgKyB5ZWFyICsgJy8nICsgbW9udGggKyAnLycgKyBpbnNfaWQpXG4gICAgICAgICAgICAgICAgICAgICMgU2V0IGFic29sdXRlIHBhdGhcbiAgICAgICAgICAgICAgICAgICAgYWJzb2x1dGVQYXRoID0gcGF0aC5yZXNvbHZlKHBhdGhuYW1lKVxuICAgICAgICAgICAgICAgICAgICAjIEVuc3VyZSB0aGUgcGF0aCBleGlzdHNcbiAgICAgICAgICAgICAgICAgICAgbWtkaXJwLnN5bmMoYWJzb2x1dGVQYXRoKVxuXG4gICAgICAgICAgICAgICAgICAgICMgSWYgbm8gc3RvcmUga2V5IGZvdW5kIHdlIHJlc29sdmUgLyBnZW5lcmF0ZSBhIGtleVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geWVhciArICcvJyArIG1vbnRoICsgJy8nICsgaW5zX2lkICsgJy8nICsgZmlsZU9iai5jb2xsZWN0aW9uTmFtZSArICctJyArIGZpbGVPYmouX2lkICsgJy0nICsgZmluYWxfZmlsZW5hbWVcblxuICAgICAgICAgICAgfSlcblxuY2ZzW3N0b3JlX25hbWVdID0gbmV3IEZTLkNvbGxlY3Rpb24gc3RvcmVfbmFtZSxcbiAgICBzdG9yZXM6IFtmc19zdG9yZV1cblxuY2ZzW3N0b3JlX25hbWVdLmFsbG93XG4gICAgZG93bmxvYWQ6IC0+XG4gICAgICAgIHJldHVybiB0cnVlO1xuXG4iLCJmc19zdG9yZTtcbnZhciBmc19zdG9yZSwgcmVmLCByZWYxLCByZWYyLCBzdG9yZV9uYW1lO1xuXG5zdG9yZV9uYW1lID0gXCJpbnN0YW5jZXNcIjtcblxuaWYgKCgocmVmID0gTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdLmNmcykgIT0gbnVsbCA/IHJlZi5zdG9yZSA6IHZvaWQgMCkgPT09IFwiT1NTXCIpIHtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGZzX3N0b3JlID0gbmV3IEZTLlN0b3JlLk9TUyhzdG9yZV9uYW1lKTtcbiAgfSBlbHNlIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICBmc19zdG9yZSA9IG5ldyBGUy5TdG9yZS5PU1Moc3RvcmVfbmFtZSwgTWV0ZW9yLnNldHRpbmdzLmNmcy5hbGl5dW4pO1xuICB9XG59IGVsc2UgaWYgKCgocmVmMSA9IE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXS5jZnMpICE9IG51bGwgPyByZWYxLnN0b3JlIDogdm9pZCAwKSA9PT0gXCJTM1wiKSB7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBmc19zdG9yZSA9IG5ldyBGUy5TdG9yZS5TMyhzdG9yZV9uYW1lKTtcbiAgfSBlbHNlIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICBmc19zdG9yZSA9IG5ldyBGUy5TdG9yZS5TMyhzdG9yZV9uYW1lLCBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmF3cyk7XG4gIH1cbn0gZWxzZSBpZiAoKChyZWYyID0gTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdLmNmcykgIT0gbnVsbCA/IHJlZjIuc3RvcmUgOiB2b2lkIDApID09PSBcIlNURUVET1NDTE9VRFwiKSB7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBmc19zdG9yZSA9IG5ldyBGUy5TdG9yZS5TVEVFRE9TQ0xPVUQoc3RvcmVfbmFtZSk7XG4gIH0gZWxzZSBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgZnNfc3RvcmUgPSBuZXcgRlMuU3RvcmUuU1RFRURPU0NMT1VEKHN0b3JlX25hbWUsIE1ldGVvci5zZXR0aW5ncy5jZnMuc3RlZWRvc0Nsb3VkKTtcbiAgfVxufSBlbHNlIHtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGZzX3N0b3JlID0gbmV3IEZTLlN0b3JlLkZpbGVTeXN0ZW0oc3RvcmVfbmFtZSk7XG4gIH0gZWxzZSBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgZnNfc3RvcmUgPSBuZXcgRlMuU3RvcmUuRmlsZVN5c3RlbShzdG9yZV9uYW1lLCB7XG4gICAgICBwYXRoOiByZXF1aXJlKCdwYXRoJykuam9pbihwcm9jZXNzLmVudi5TVEVFRE9TX1NUT1JBR0VfRElSLCBcImZpbGVzL1wiICsgc3RvcmVfbmFtZSksXG4gICAgICBmaWxlS2V5TWFrZXI6IGZ1bmN0aW9uKGZpbGVPYmopIHtcbiAgICAgICAgdmFyIGFic29sdXRlUGF0aCwgZXh0ZW50aW9uLCBmaWxlbmFtZSwgZmlsZW5hbWVJblN0b3JlLCBmaW5hbF9maWxlbmFtZSwgaW5zX2lkLCBta2RpcnAsIG1vbnRoLCBuYW1lLCBuYW1lX3NwbGl0LCBub3csIHBhdGgsIHBhdGhuYW1lLCBzdG9yZSwgeWVhcjtcbiAgICAgICAgc3RvcmUgPSBmaWxlT2JqICYmIGZpbGVPYmouX2dldEluZm8oc3RvcmVfbmFtZSk7XG4gICAgICAgIGlmIChzdG9yZSAmJiBzdG9yZS5rZXkpIHtcbiAgICAgICAgICByZXR1cm4gc3RvcmUua2V5O1xuICAgICAgICB9XG4gICAgICAgIGZpbGVuYW1lID0gZmlsZU9iai5uYW1lKCk7XG4gICAgICAgIGZpbGVuYW1lSW5TdG9yZSA9IGZpbGVPYmoubmFtZSh7XG4gICAgICAgICAgc3RvcmU6IHN0b3JlX25hbWVcbiAgICAgICAgfSk7XG4gICAgICAgIG5hbWUgPSBmaWxlbmFtZUluU3RvcmUgfHwgZmlsZW5hbWU7XG4gICAgICAgIG5hbWVfc3BsaXQgPSBuYW1lLnNwbGl0KCcuJyk7XG4gICAgICAgIGV4dGVudGlvbiA9IG5hbWVfc3BsaXQucG9wKCk7XG4gICAgICAgIGZpbmFsX2ZpbGVuYW1lID0gbmFtZV9zcGxpdC5qb2luKCcuJykuc3Vic3RyaW5nKDAsIDUwKSArICcuJyArIGV4dGVudGlvbjtcbiAgICAgICAgbm93ID0gbmV3IERhdGU7XG4gICAgICAgIHllYXIgPSBub3cuZ2V0RnVsbFllYXIoKTtcbiAgICAgICAgbW9udGggPSBub3cuZ2V0TW9udGgoKSArIDE7XG4gICAgICAgIGluc19pZCA9IGZpbGVPYmoubWV0YWRhdGEuaW5zdGFuY2U7XG4gICAgICAgIHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG4gICAgICAgIG1rZGlycCA9IHJlcXVpcmUoJ21rZGlycCcpO1xuICAgICAgICBwYXRobmFtZSA9IHBhdGguam9pbihwcm9jZXNzLmVudi5TVEVFRE9TX1NUT1JBR0VfRElSLCAoXCJmaWxlcy9cIiArIHN0b3JlX25hbWUgKyBcIi9cIikgKyB5ZWFyICsgJy8nICsgbW9udGggKyAnLycgKyBpbnNfaWQpO1xuICAgICAgICBhYnNvbHV0ZVBhdGggPSBwYXRoLnJlc29sdmUocGF0aG5hbWUpO1xuICAgICAgICBta2RpcnAuc3luYyhhYnNvbHV0ZVBhdGgpO1xuICAgICAgICByZXR1cm4geWVhciArICcvJyArIG1vbnRoICsgJy8nICsgaW5zX2lkICsgJy8nICsgZmlsZU9iai5jb2xsZWN0aW9uTmFtZSArICctJyArIGZpbGVPYmouX2lkICsgJy0nICsgZmluYWxfZmlsZW5hbWU7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cblxuY2ZzW3N0b3JlX25hbWVdID0gbmV3IEZTLkNvbGxlY3Rpb24oc3RvcmVfbmFtZSwge1xuICBzdG9yZXM6IFtmc19zdG9yZV1cbn0pO1xuXG5jZnNbc3RvcmVfbmFtZV0uYWxsb3coe1xuICBkb3dubG9hZDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn0pO1xuIl19
