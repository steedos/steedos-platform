(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var check = Package.check.check;
var Match = Package.check.Match;
var FlowRouter = Package['kadira:flow-router'].FlowRouter;
var _ = Package.underscore._;
var AccountsTemplates = Package['steedos:useraccounts-core'].AccountsTemplates;
var meteorInstall = Package.modules.meteorInstall;
var Accounts = Package['accounts-base'].Accounts;

var require = meteorInstall({"node_modules":{"meteor":{"steedos:useraccounts-flow-routing":{"lib":{"core.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_useraccounts-flow-routing/lib/core.js                                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/* global
  AccountsTemplates: false,
  BlazeLayout: false,
  FlowRouter: false
*/
'use strict';

// ---------------------------------------------------------------------------------

// Patterns for methods" parameters

// ---------------------------------------------------------------------------------

// Add new configuration options
_.extend(AccountsTemplates.CONFIG_PAT, {
  defaultLayoutType: Match.Optional(String),
  defaultLayout: Match.Optional(Match.OneOf(String, Match.Where(_.isFunction))),
  defaultTemplate: Match.Optional(String),
  defaultLayoutRegions: Match.Optional(Object),
  defaultContentRegion: Match.Optional(String),
  renderLayout: Match.Optional(Object),
  contentRange: Match.Optional(String),
});

// Route configuration pattern to be checked with check
var ROUTE_PAT = {
  name: Match.Optional(String),
  path: Match.Optional(String),
  template: Match.Optional(String),
  layoutTemplate: Match.Optional(String),
  renderLayout: Match.Optional(Object),
  contentRange: Match.Optional(String),
  redirect: Match.Optional(Match.OneOf(String, Match.Where(_.isFunction))),
};

/*
  Routes configuration can be done by calling AccountsTemplates.configureRoute with the route name and the
  following options in a separate object. E.g. AccountsTemplates.configureRoute("gingIn", option);
    name:           String (optional). A unique route"s name to be passed to iron-router
    path:           String (optional). A unique route"s path to be passed to iron-router
    template:       String (optional). The name of the template to be rendered
    layoutTemplate: String (optional). The name of the layout to be used
    redirect:       String (optional). The name of the route (or its path) where to redirect after form submit
*/


// Allowed routes along with theirs default configuration values
AccountsTemplates.ROUTE_DEFAULT = {
  changePwd:      { name: "atChangePwd",      path: "/change-password"},
  enrollAccount:  { name: "atEnrollAccount",  path: "/enroll-account"},
  ensureSignedIn: { name: "atEnsureSignedIn", path: null},
  forgotPwd:      { name: "atForgotPwd",      path: "/forgot-password"},
  // add new route named "forgotPwdToken"
  forgotPwdToken: { name: "atForgotPwdToken", path: "/forgot-password-token"},
  resetPwd:       { name: "atResetPwd",       path: "/reset-password"},
  signIn:         { name: "atSignIn",         path: "/sign-in"},
  signUp:         { name: "atSignUp",         path: "/sign-up"},
  verifyEmail:    { name: "atVerifyEmail",    path: "/verify-email"},
  resendVerificationEmail: { name: "atResendVerificationEmail", path: "/send-again"}
};

// Current configuration values
AccountsTemplates.options.defaultLayoutRegions = {};
// Redirects
AccountsTemplates.options.homeRoutePath = "/";
AccountsTemplates.options.redirectTimeout = 2000; // 2 seconds

// Known routes used to filter out previous path for redirects...
AccountsTemplates.knownRoutes = [];

// Configured routes
AccountsTemplates.routes = {};

AccountsTemplates.configureRoute = function(route, options) {
  check(route, String);
  check(options, Match.OneOf(undefined, Match.ObjectIncluding(ROUTE_PAT)));
  options = _.clone(options);
  // Route Configuration can be done only before initialization
  if (this._initialized) {
    throw new Error("Route Configuration can be done only before AccountsTemplates.init!");
  }
  // Only allowed routes can be configured
  if (!(route in this.ROUTE_DEFAULT)) {
    throw new Error("Unknown Route!");
  }
  // Allow route configuration only once
  if (route in this.routes) {
    throw new Error("Route already configured!");
  }

  // Possibly adds a initial / to the provided path
  if (options && options.path && options.path[0] !== "/") {
    options.path = "/" + options.path;
  }

  // Updates the current configuration
  options = _.defaults(options || {}, this.ROUTE_DEFAULT[route]);

  // Store route options
  this.routes[route] = options;

  // Known routes are used to filter out previous path for redirects...
  AccountsTemplates.knownRoutes.push(options.name);

  if (Meteor.isServer) {
    // Configures "reset password" email link
    if (route === "resetPwd") {
      var resetPwdPath = options.path.substr(1);
      Accounts.urls.resetPassword = function(token) {
        return Meteor.absoluteUrl(resetPwdPath + "/" + token);
      };
    }
    // Configures "enroll account" email link
    if (route === "enrollAccount") {
      var enrollAccountPath = options.path.substr(1);
      Accounts.urls.enrollAccount = function(token) {
        return Meteor.absoluteUrl(enrollAccountPath + "/" + token);
      };
    }
    // Configures "verify email" email link
    if (route === "verifyEmail") {
      var verifyEmailPath = options.path.substr(1);
      Accounts.urls.verifyEmail = function(token) {
        return Meteor.absoluteUrl(verifyEmailPath + "/" + token);
      };
    }
  }

  if (route === "ensureSignedIn") {
    return;
  }
  if (route === "changePwd" && !AccountsTemplates.options.enablePasswordChange) {
    throw new Error("changePwd route configured but enablePasswordChange set to false!");
  }
  if (route === "forgotPwd" && !AccountsTemplates.options.showForgotPasswordLink) {
    throw new Error("forgotPwd route configured but showForgotPasswordLink set to false!");
  }
  if (route === "signUp" && AccountsTemplates.options.forbidClientAccountCreation) {
    throw new Error("signUp route configured but forbidClientAccountCreation set to true!");
  }

  // Use BlazeLayout by default
  var defaultLayoutType = AccountsTemplates.options.defaultLayoutType || 'blaze';
  // fullPageAtForm template unless user specified a different site-wide default
  var defaultTemplate = AccountsTemplates.options.defaultTemplate || "fullPageAtForm";
  // Determines the default layout to be used in case no specific one is
  // specified for single routes
  var defaultLayout = AccountsTemplates.options.defaultLayout;
  var defaultLayoutRegions = AccountsTemplates.options.defaultLayoutRegions;
  var defaultContentRegion = AccountsTemplates.options.defaultContentRegion;

  var name = options.name; // Default provided...
  var path = options.path; // Default provided...
  var layoutType = options.layoutType || defaultLayoutType;
  var template = options.template || defaultTemplate;
  var layoutTemplate = options.layoutTemplate || defaultLayout;
  var contentRegion = options.contentRegion || defaultContentRegion;
  var layoutRegions = _.clone(options.layoutRegions || defaultLayoutRegions || {});

  if (layoutType === "blaze") {

    // Ensure that we have the required packages to render Blaze templates

    if (Package['kadira:blaze-layout']) {
      var BlazeLayout = Package['kadira:blaze-layout'].BlazeLayout;
    } else {
      throw new Error("useraccounts:flow-routing requires that your project includes kadira:blaze-layout package.");
    }

    // Strings are assumed to be Blaze template names
    layoutRegions[contentRegion] = template;
  }

  if (layoutType === "blaze-to-react") {

    // Ensure that we have the required packages to render Blaze templates
    //
    // For now we need to render the main template using BlazeToReact

    if (Package['react-runtime']) {
      var React = Package['react-runtime'].React;
    } else {
      throw new Error("layoutTemplate is a React element but React runtime package is not found");
    }

    if (Package['kadira:react-layout']) {
      var ReactLayout = Package['kadira:react-layout'].ReactLayout;
    } else {
      throw new Error("useraccounts:flow-routing requires that your project includes kadira:react-layout package.");
    }

    if (Package['gwendall:blaze-to-react']) {
      var BlazeToReact = Package['gwendall:blaze-to-react'].BlazeToReact;
    } else {
      throw new Error("useraccounts:flow-routing requires that your project includes the gwendall:blaze-to-react package.");
    }

    layoutRegions[contentRegion] = React.createElement(BlazeToReact, { blazeTemplate: template });
  }

  function doLayout() {
    if (layoutType === "blaze-to-react") {

      // The layout template is a React Class.
      // We need to render using ReactLayout and BlazeToReact

      ReactLayout.render(layoutTemplate, layoutRegions);
    } else {
      // Render using BlazeLayout
      BlazeLayout.render(layoutTemplate, layoutRegions);
    }
  }

  // Possibly adds token parameter
  if (_.contains(["enrollAccount", "resetPwd", "verifyEmail"], route)) {
    path += "/:paramToken";
    if (route === "verifyEmail") {
      FlowRouter.route(path, {
        name: name,
        triggersEnter: [
          function() {
            AccountsTemplates.setState(route);
            AccountsTemplates.setDisabled(true);
          }
        ],
        action: function(params) {
          doLayout();

          var token = params.paramToken;
          if (Meteor.isClient) {
             Accounts.verifyEmail(token, function(error) {
               AccountsTemplates.setDisabled(false);
               AccountsTemplates.submitCallback(error, route, function() {
                 AccountsTemplates.state.form.set("result", AccountsTemplates.texts.info.emailVerified);
               });
             });
          }
        }
      });
    } else {
      FlowRouter.route(path, {
        name: name,
        triggersEnter: [
          function() {
            AccountsTemplates.setState(route);
          }
        ],
        action: function(params) {
          doLayout();
        }
      });
    }
  } else {
    FlowRouter.route(path, {
      name: name,
      triggersEnter: [
        function() {
          var redirect = false;
          if (route === 'changePwd') {
            if (!Meteor.loggingIn() && !Meteor.userId()) {
              redirect = true;
            }
          } else if (Meteor.userId()) {
            redirect = true;
          }
          if (redirect) {
            AccountsTemplates.postSubmitRedirect(route);
          } else {
            AccountsTemplates.setState(route);
          }
        }
      ],
      action: function() {
        doLayout();
      }
    });
  }
};


AccountsTemplates.getRouteName = function(route) {
  if (route in this.routes) {
    return this.routes[route].name;
  }
  return null;
};

AccountsTemplates.getRoutePath = function(route) {
  if (route in this.routes) {
    return this.routes[route].path;
  }
  return "#";
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

require("/node_modules/meteor/steedos:useraccounts-flow-routing/lib/core.js");

/* Exports */
Package._define("steedos:useraccounts-flow-routing");

})();
