(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var Accounts = Package['accounts-base'].Accounts;
var check = Package.check.check;
var Match = Package.check.Match;
var _ = Package.underscore._;
var ReactiveVar = Package['reactive-var'].ReactiveVar;
var HTTP = Package.http.HTTP;
var HTTPInternals = Package.http.HTTPInternals;

/* Package-scope variables */
var Field, STATE_PAT, ERRORS_PAT, INFO_PAT, INPUT_ICONS_PAT, ObjWithStringValues, TEXTS_PAT, CONFIG_PAT, FIELD_SUB_PAT, FIELD_PAT, AT, AccountsTemplates;

(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/steedos_useraccounts-core/lib/field.js                                                              //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
// ---------------------------------------------------------------------------------
// Field object
// ---------------------------------------------------------------------------------

Field = function(field) {
  check(field, FIELD_PAT);
  _.defaults(this, field);

  this.validating = new ReactiveVar(false);
  this.status = new ReactiveVar(null);
};

if (Meteor.isClient) {
  Field.prototype.clearStatus = function() {
    return this.status.set(null);
  };
}

if (Meteor.isServer) {
  Field.prototype.clearStatus = function() {
    // Nothing to do server-side
    return;
  };
}

Field.prototype.fixValue = function(value) {
  if (this.type === "checkbox") {
    return !!value;
  }

  if (this.type === "select") {
    // TODO: something working...
    return value;
  }

  if (this.type === "radio") {
    // TODO: something working...
    return value;
  }

  // Possibly applies required transformations to the input value
  if (this.trim) {
    value = value.trim();
  }

  if (this.lowercase) {
    value = value.toLowerCase();
  }

  if (this.uppercase) {
    value = value.toUpperCase();
  }

  if (!!this.transform) {
    value = this.transform(value);
  }

  return value;
};

if (Meteor.isClient) {
  Field.prototype.getDisplayName = function(state) {
    var displayName = this.displayName;

    if (_.isFunction(displayName)) {
      displayName = displayName();
    } else if (_.isObject(displayName)) {
      displayName = displayName[state] || displayName["default"];
    }

    if (!displayName) {
      displayName = capitalize(this._id);
    }

    return displayName;
  };
}

if (Meteor.isClient) {
  Field.prototype.getPlaceholder = function(state) {
    var placeholder = this.placeholder;

    if (_.isObject(placeholder)) {
      placeholder = placeholder[state] || placeholder["default"];
    }

    if (!placeholder) {
      placeholder = capitalize(this._id);
    }

    return placeholder;
  };
}

Field.prototype.getStatus = function() {
  return this.status.get();
};

if (Meteor.isClient) {
  Field.prototype.getValue = function(templateInstance) {
    if (this.type === "checkbox") {
      return !!(templateInstance.$("#at-field-" + this._id + ":checked").val());
    }

    if (this.type === "radio") {
      return templateInstance.$("[name=at-field-"+ this._id + "]:checked").val();
    }
    var val = templateInstance.$("#at-field-" + this._id).val();
    if(val.trim){
      return val.trim();
    }
    else{
      return val;
    }
  };
}

if (Meteor.isClient) {
  Field.prototype.hasError = function() {
    return this.negativeValidation && this.status.get();
  };
}

if (Meteor.isClient) {
  Field.prototype.hasIcon = function() {
    if (this.showValidating && this.isValidating()) {
      return true;
    }

    if (this.negativeFeedback && this.hasError()) {
      return true;
    }

    if (this.positiveFeedback && this.hasSuccess()) {
      return true;
    }
  };
}

if (Meteor.isClient) {
  Field.prototype.hasSuccess = function() {
    return this.positiveValidation && this.status.get() === false;
  };
}

if (Meteor.isClient)
  Field.prototype.iconClass = function() {
    if (this.isValidating()) {
      return AccountsTemplates.texts.inputIcons["isValidating"];
    }

    if (this.hasError()) {
      return AccountsTemplates.texts.inputIcons["hasError"];
    }

    if (this.hasSuccess()) {
      return AccountsTemplates.texts.inputIcons["hasSuccess"];
    }
  };

if (Meteor.isClient) {
  Field.prototype.isValidating = function() {
    return this.validating.get();
  };
}

if (Meteor.isClient) {
  Field.prototype.setError = function(err) {
    check(err, Match.OneOf(String, undefined, Boolean));

    if (err === false) {
      return this.status.set(false);
    }

    return this.status.set(err || true);
  };
}

if (Meteor.isServer) {
  Field.prototype.setError = function(err) {
    // Nothing to do server-side
    return;
  };
}

if (Meteor.isClient) {
  Field.prototype.setSuccess = function() {
    return this.status.set(false);
  };
}

if (Meteor.isServer) {
  Field.prototype.setSuccess = function() {
    // Nothing to do server-side
    return;
  };
}

if (Meteor.isClient) {
  Field.prototype.setValidating = function(state) {
    check(state, Boolean);
    return this.validating.set(state);
  };
}

if (Meteor.isServer) {
  Field.prototype.setValidating = function(state) {
    // Nothing to do server-side
    return;
  };
}

if (Meteor.isClient) {
  Field.prototype.setValue = function(templateInstance, value) {
    if (this.type === "checkbox") {
      templateInstance.$("#at-field-" + this._id).prop('checked', true);
      return;
    }

    if (this.type === "radio") {
      templateInstance.$("[name=at-field-"+ this._id + "]").prop('checked', true);
      return;
    }

    templateInstance.$("#at-field-" + this._id).val(value);
  };
}

Field.prototype.validate = function(value, strict) {
  check(value, Match.OneOf(undefined, String, Boolean));
  this.setValidating(true);
  this.clearStatus();

  if (_.isUndefined(value) || value === '') {
    if (!!strict) {
      if (this.required) {
        this.setError(T9n.get("requiredField"));
        this.setValidating(false);

        return T9n.get("requiredField");
      } else {
        this.setSuccess();
        this.setValidating(false);

        return false;
      }
    } else {
      this.clearStatus();
      this.setValidating(false);

      return null;
    }
  }

  if(this._id === "password"){
    var result = Steedos ? Steedos.validatePassword(value) : "";
    if (result.error){
      this.setError(result.error.reason);
      this.setValidating(false);

      return result.error.reason
    }
  }

  if(!Steedos || (this._id !== "password" && this._id !== "password_again")){
    // Steedos系统中由Steedos.validatePassword函数验证密码，不需要额外验证minLength
    var valueLength = value.length;
    var minLength = this.minLength;
    if (minLength && valueLength < minLength) {
      var reason = T9n.get("minRequiredLength") + minLength.toString();
      this.setError(reason);
      this.setValidating(false);

      return reason;
    }
  }

  var maxLength = this.maxLength;
  if (maxLength && valueLength > maxLength) {
    var reason = T9n.get("maxAllowedLength") + maxLength.toString();
    this.setError(reason);
    this.setValidating(false);

    return reason;
  }

  if (this.re && valueLength && !value.match(this.re)) {
    this.setError(this.errStr);
    this.setValidating(false);

    return this.errStr;
  }

  if (this.func) {
    var result = this.func(value);
    var err = result === true ? this.errStr || true : result;

    if (_.isUndefined(result)) {
      return err;
    }

    this.status.set(err);
    this.setValidating(false);

    return err;
  }

  this.setSuccess();
  this.setValidating(false);

  return false;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/steedos_useraccounts-core/lib/core.js                                                               //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
// ---------------------------------------------------------------------------------
// Patterns for methods" parameters
// ---------------------------------------------------------------------------------

STATE_PAT = {
  changePwd: Match.Optional(String),
  enrollAccount: Match.Optional(String),
  forgotPwd: Match.Optional(String),
  // PAT new state named 'forgotPwdToken'
  forgotPwdToken: Match.Optional(String),
  resetPwd: Match.Optional(String),
  signIn: Match.Optional(String),
  signUp: Match.Optional(String),
  verifyEmail: Match.Optional(String),
  resendVerificationEmail: Match.Optional(String),
};

ERRORS_PAT = {
  accountsCreationDisabled: Match.Optional(String),
  cannotRemoveService: Match.Optional(String),
  captchaVerification: Match.Optional(String),
  loginForbidden: Match.Optional(String),
  mustBeLoggedIn: Match.Optional(String),
  pwdMismatch: Match.Optional(String),
  validationErrors: Match.Optional(String),
  verifyEmailFirst: Match.Optional(String),
};

INFO_PAT = {
  emailSent: Match.Optional(String),
  emailVerified: Match.Optional(String),
  pwdChanged: Match.Optional(String),
  pwdReset: Match.Optional(String),
  pwdSet: Match.Optional(String),
  signUpVerifyEmail: Match.Optional(String),
  verificationEmailSent: Match.Optional(String),
};

INPUT_ICONS_PAT = {
  hasError: Match.Optional(String),
  hasSuccess: Match.Optional(String),
  isValidating: Match.Optional(String),
};

ObjWithStringValues = Match.Where(function (x) {
  check(x, Object);
  _.each(_.values(x), function(value) {
      check(value, String);
  });
  return true;
});

TEXTS_PAT = {
  button: Match.Optional(STATE_PAT),
  errors: Match.Optional(ERRORS_PAT),
  info: Match.Optional(INFO_PAT),
  inputIcons: Match.Optional(INPUT_ICONS_PAT),
  maxAllowedLength: Match.Optional(String),
  minRequiredLength: Match.Optional(String),
  navSignIn: Match.Optional(String),
  navSignOut: Match.Optional(String),
  optionalField: Match.Optional(String),
  pwdLink_link: Match.Optional(String),
  pwdLink_pre: Match.Optional(String),
  pwdLink_suff: Match.Optional(String),
  requiredField: Match.Optional(String),
  resendVerificationEmailLink_pre: Match.Optional(String),
  resendVerificationEmailLink_link: Match.Optional(String),
  resendVerificationEmailLink_suff: Match.Optional(String),
  sep: Match.Optional(String),
  signInLink_link: Match.Optional(String),
  signInLink_pre: Match.Optional(String),
  signInLink_suff: Match.Optional(String),
  signUpLink_link_ent: Match.Optional(String),
  signUpLink_link_user:Match.Optional(String),
  signUpLink_pre: Match.Optional(String),
  signUpLink_suff: Match.Optional(String),
  socialAdd: Match.Optional(String),
  socialConfigure: Match.Optional(String),
  socialIcons: Match.Optional(ObjWithStringValues),
  socialRemove: Match.Optional(String),
  socialSignIn: Match.Optional(String),
  socialSignUp: Match.Optional(String),
  socialWith: Match.Optional(String),
  termsAnd: Match.Optional(String),
  termsPreamble: Match.Optional(String),
  termsPrivacy: Match.Optional(String),
  termsTerms: Match.Optional(String),
  title: Match.Optional(STATE_PAT),
};

// Configuration pattern to be checked with check
CONFIG_PAT = {
  // Behaviour
  confirmPassword: Match.Optional(Boolean),
  defaultState: Match.Optional(String),
  enablePasswordChange: Match.Optional(Boolean),
  enforceEmailVerification: Match.Optional(Boolean),
  focusFirstInput: Match.Optional(Boolean),
  forbidClientAccountCreation: Match.Optional(Boolean),
  lowercaseUsername: Match.Optional(Boolean),
  overrideLoginErrors: Match.Optional(Boolean),
  sendVerificationEmail: Match.Optional(Boolean),
  socialLoginStyle: Match.Optional(Match.OneOf("popup", "redirect")),

  // Appearance
  defaultLayout: Match.Optional(String),
  hideSignInLink: Match.Optional(Boolean),
  hideSignUpLink: Match.Optional(Boolean),
  showAddRemoveServices: Match.Optional(Boolean),
  showForgotPasswordLink: Match.Optional(Boolean),
  showResendVerificationEmailLink: Match.Optional(Boolean),
  showLabels: Match.Optional(Boolean),
  showPlaceholders: Match.Optional(Boolean),

  // Client-side Validation
  continuousValidation: Match.Optional(Boolean),
  negativeFeedback: Match.Optional(Boolean),
  negativeValidation: Match.Optional(Boolean),
  positiveFeedback: Match.Optional(Boolean),
  positiveValidation: Match.Optional(Boolean),
  showValidating: Match.Optional(Boolean),

  // Privacy Policy and Terms of Use
  privacyUrl: Match.Optional(String),
  termsUrl: Match.Optional(String),

  // Redirects
  homeRoutePath: Match.Optional(String),
  redirectTimeout: Match.Optional(Number),

  // Hooks
  onLogoutHook: Match.Optional(Function),
  onSubmitHook: Match.Optional(Function),
  preSignUpHook: Match.Optional(Function),
  postSignUpHook: Match.Optional(Function),

  texts: Match.Optional(TEXTS_PAT),

  //reCaptcha config
  reCaptcha: Match.Optional({
    data_type: Match.Optional(Match.OneOf("audio", "image")),
    secretKey: Match.Optional(String),
    siteKey: Match.Optional(String),
    theme: Match.Optional(Match.OneOf("dark", "light")),
  }),

  showReCaptcha: Match.Optional(Boolean),
};


FIELD_SUB_PAT = {
  "default": Match.Optional(String),
  changePwd: Match.Optional(String),
  enrollAccount: Match.Optional(String),
  forgotPwd: Match.Optional(String),
  resetPwd: Match.Optional(String),
  signIn: Match.Optional(String),
  signUp: Match.Optional(String),
};


// Field pattern
FIELD_PAT = {
  _id: String,
  type: String,
  required: Match.Optional(Boolean),
  displayName: Match.Optional(Match.OneOf(String, Match.Where(_.isFunction), FIELD_SUB_PAT)),
  placeholder: Match.Optional(Match.OneOf(String, FIELD_SUB_PAT)),
  select: Match.Optional([{text: String, value: Match.Any}]),
  minLength: Match.Optional(Match.Integer),
  maxLength: Match.Optional(Match.Integer),
  re: Match.Optional(RegExp),
  func: Match.Optional(Match.Where(_.isFunction)),
  errStr: Match.Optional(String),

  // Client-side Validation
  continuousValidation: Match.Optional(Boolean),
  negativeFeedback: Match.Optional(Boolean),
  negativeValidation: Match.Optional(Boolean),
  positiveValidation: Match.Optional(Boolean),
  positiveFeedback: Match.Optional(Boolean),

  // Transforms
  trim: Match.Optional(Boolean),
  lowercase: Match.Optional(Boolean),
  uppercase: Match.Optional(Boolean),
  transform: Match.Optional(Match.Where(_.isFunction)),

  // Custom options
  options: Match.Optional(Object),
  template: Match.Optional(String),
};

// -----------------------------------------------------------------------------
// AccountsTemplates object
// -----------------------------------------------------------------------------

// -------------------
// Client/Server stuff
// -------------------

// Constructor
AT = function() {

};

AT.prototype.CONFIG_PAT = CONFIG_PAT;

/*
  Each field object is represented by the following properties:
    _id:         String   (required)  // A unique field"s id / name
    type:        String   (required)  // Displayed input type
    required:    Boolean  (optional)  // Specifies Whether to fail or not when field is left empty
    displayName: String   (optional)  // The field"s name to be displayed as a label above the input element
    placeholder: String   (optional)  // The placeholder text to be displayed inside the input element
    minLength:   Integer  (optional)  // Possibly specifies the minimum allowed length
    maxLength:   Integer  (optional)  // Possibly specifies the maximum allowed length
    re:          RegExp   (optional)  // Regular expression for validation
    func:        Function (optional)  // Custom function for validation
    errStr:      String   (optional)  // Error message to be displayed in case re validation fails
*/


// Allowed input types
AT.prototype.INPUT_TYPES = [
  "checkbox",
  "email",
  "hidden",
  "password",
  "radio",
  "select",
  "tel",
  "text",
  "url",
];

// Current configuration values
AT.prototype.options = {
  // Appearance
  //defaultLayout: undefined,
  showAddRemoveServices: false,
  showForgotPasswordLink: false,
  showResendVerificationEmailLink: false,
  showLabels: true,
  showPlaceholders: true,

  // Behaviour
  confirmPassword: true,
  defaultState: "signIn",
  enablePasswordChange: false,
  focusFirstInput: !Meteor.isCordova,
  forbidClientAccountCreation: false,
  lowercaseUsername: false,
  overrideLoginErrors: true,
  sendVerificationEmail: false,
  socialLoginStyle: "popup",

  // Client-side Validation
  //continuousValidation: false,
  //negativeFeedback: false,
  //negativeValidation: false,
  //positiveValidation: false,
  //positiveFeedback: false,
  //showValidating: false,

  // Privacy Policy and Terms of Use
  privacyUrl: undefined,
  termsUrl: undefined,

  // Hooks
  onSubmitHook: undefined,
};

AT.prototype.texts = {
  button: {
    changePwd: "updateYourPassword",
    //enrollAccount: "createAccount",
    enrollAccount: "signUp",
    forgotPwd: "emailResetLink",
    // new field text named 'forgotPwdToken'
    forgotPwdToken: "pwdResetLink",
    resetPwd: "setPassword",
    signIn: "signIn",
    signUp: "signUp",
    resendVerificationEmail: "Send email again",
  },
  errors: {
    accountsCreationDisabled: "Client side accounts creation is disabled!!!",
    cannotRemoveService: "Cannot remove the only active service!",
    captchaVerification: "Captcha verification failed!",
    loginForbidden: "error.accounts.Login forbidden",
    mustBeLoggedIn: "error.accounts.Must be logged in",
    pwdMismatch: "error.pwdsDontMatch",
    validationErrors: "Validation Errors",
    verifyEmailFirst: "Please verify your email first. Check the email and follow the link!",
  },
  navSignIn: 'signIn',
  navSignOut: 'signOut',
  info: {
    emailSent: "info.emailSent",
    emailVerified: "info.emailVerified",
    pwdChanged: "info.passwordChanged",
    pwdReset: "info.passwordReset",
    pwdSet: "Password Set",
    signUpVerifyEmail: "Successful Registration! Please check your email and follow the instructions.",
    verificationEmailSent: "A new email has been sent to you. If the email doesn't show up in your inbox, be sure to check your spam folder.",
  },
  inputIcons: {
    isValidating: "fa fa-spinner fa-spin",
    hasSuccess: "fa fa-check",
    hasError: "fa fa-times",
  },
  maxAllowedLength: "Maximum allowed length",
  minRequiredLength: "The minimum length can not be less than 5 digits",
  optionalField: "optional",
  pwdLink_pre: "",
  pwdLink_link: "forgotPassword",
  pwdLink_suff: "",
  requiredField: "Required Field",
  resendVerificationEmailLink_pre: "Verification email lost?",
  resendVerificationEmailLink_link: "Send again",
  resendVerificationEmailLink_suff: "",
  sep: "OR",
  signInLink_pre: "ifYouAlreadyHaveAnAccount",
  signInLink_link: "signin",
  signInLink_suff: "",
  signUpLink_pre: "dontHaveAnAccount",
  signUpLink_link_user: "signUpFree",
  signUpLink_link_ent:"signUpEnt",
  signUpLink_suff: "",
  socialAdd: "add",
  socialConfigure: "configure",
  socialIcons: {
      "meteor-developer": "fa fa-rocket"
  },
  socialRemove: "remove",
  socialSignIn: "signIn",
  socialSignUp: "signUp",
  socialWith: "with",
  termsPreamble: "clickAgree",
  termsPrivacy: "privacyPolicy",
  termsAnd: "and",
  termsTerms: "terms",
  title: {
    changePwd: "changePassword",
    enrollAccount: "createAccount",
    forgotPwd: "resetYourPassword",
    forgotPwdToken: "inputTokenFromEmail",
    resetPwd: "resetYourPassword",
    signIn: "signIn",
    signUp: "createAccount",
    verifyEmail: "",
    resendVerificationEmail: "Send the verification email again",
  },
};

AT.prototype.SPECIAL_FIELDS = [
  "password_again",
  "username_and_email",
];

// SignIn / SignUp fields
AT.prototype._fields = [
  new Field({
    _id: "email",
    type: "email",
    required: true,
    lowercase: true,
    trim: true,
    func: function(email) {
        return !_.contains(email, '@');
    },
    errStr: 'Invalid email',
  }),
  new Field({
    _id: "password",
    type: "password",
    required: true,
    minLength: 8,
    displayName: {
        "default": "password",
        changePwd: "newPassword",
        resetPwd: "newPassword",
    },
    placeholder: {
        "default": "password",
        changePwd: "newPassword",
        resetPwd: "newPassword",
    },
  }),
  // add a new field named 'forgot_pwd_token'
  new Field({
    _id: "forgot_pwd_token",
    type: "forgot_pwd_token",
    required: false,
    trim: true,
    placeholder: {
        "default": "forgotPwdToken",
    },
  }),
];


AT.prototype._initialized = false;

// Input type validation
AT.prototype._isValidInputType = function(value) {
    return _.indexOf(this.INPUT_TYPES, value) !== -1;
};

AT.prototype.addField = function(field) {
    // Fields can be added only before initialization
    if (this._initialized) {
      throw new Error("AccountsTemplates.addField should strictly be called before AccountsTemplates.init!");
    }

    field = _.pick(field, _.keys(FIELD_PAT));
    check(field, FIELD_PAT);
    // Checks there"s currently no field called field._id
    if (_.indexOf(_.pluck(this._fields, "_id"), field._id) !== -1) {
      throw new Error("A field called " + field._id + " already exists!");
    }
    // Validates field.type
    if (!this._isValidInputType(field.type)) {
      throw new Error("field.type is not valid!");
    }
    // Checks field.minLength is strictly positive
    if (typeof field.minLength !== "undefined" && field.minLength <= 0) {
      throw new Error("field.minLength should be greater than zero!");
    }
    // Checks field.maxLength is strictly positive
    if (typeof field.maxLength !== "undefined" && field.maxLength <= 0) {
      throw new Error("field.maxLength should be greater than zero!");
    }
    // Checks field.maxLength is greater than field.minLength
    if (typeof field.minLength !== "undefined" && typeof field.minLength !== "undefined" && field.maxLength < field.minLength) {
      throw new Error("field.maxLength should be greater than field.maxLength!");
    }

    if (!(Meteor.isServer && _.contains(this.SPECIAL_FIELDS, field._id))) {
      this._fields.push(new Field(field));
    }

    return this._fields;
};

AT.prototype.addFields = function(fields) {
  var ok;

  try { // don"t bother with `typeof` - just access `length` and `catch`
    ok = fields.length > 0 && "0" in Object(fields);
  } catch (e) {
    throw new Error("field argument should be an array of valid field objects!");
  }
  if (ok) {
    _.map(fields, function(field) {
      this.addField(field);
    }, this);
  } else {
    throw new Error("field argument should be an array of valid field objects!");
  }

  return this._fields;
};

AT.prototype.configure = function(config) {
  // Configuration options can be set only before initialization
  if (this._initialized) {
    throw new Error("Configuration options must be set before AccountsTemplates.init!");
  }

  // Updates the current configuration
  check(config, CONFIG_PAT);
  var options = _.omit(config, "texts", "reCaptcha");
  this.options = _.defaults(options, this.options);

  // Possibly sets up reCaptcha options
  var reCaptcha = config.reCaptcha;
  if (reCaptcha) {
    // Updates the current button object
    this.options.reCaptcha = _.defaults(reCaptcha, this.options.reCaptcha || {});
  }

  // Possibly sets up texts...
  if (config.texts) {
    var texts = config.texts;
    var simpleTexts = _.omit(texts, "button", "errors", "info", "inputIcons", "socialIcons", "title");

    this.texts = _.defaults(simpleTexts, this.texts);

    if (texts.button) {
      // Updates the current button object
      this.texts.button = _.defaults(texts.button, this.texts.button);
    }

    if (texts.errors) {
      // Updates the current errors object
      this.texts.errors = _.defaults(texts.errors, this.texts.errors);
    }

    if (texts.info) {
      // Updates the current info object
      this.texts.info = _.defaults(texts.info, this.texts.info);
    }

    if (texts.inputIcons) {
      // Updates the current inputIcons object
      this.texts.inputIcons = _.defaults(texts.inputIcons, this.texts.inputIcons);
    }

    if (texts.socialIcons) {
      // Updates the current socialIcons object
      this.texts.socialIcons = _.defaults(texts.socialIcons, this.texts.socialIcons);
    }

    if (texts.title) {
      // Updates the current title object
      this.texts.title = _.defaults(texts.title, this.texts.title);
    }
  }
};


AT.prototype.configureRoute = function(route, options) {
  console.warn('You now need a routing package like useraccounts:iron-routing or useraccounts:flow-routing to be able to configure routes!');
};


AT.prototype.hasField = function(fieldId) {
  return !!this.getField(fieldId);
};

AT.prototype.getField = function(fieldId) {
  var field = _.filter(this._fields, function(field) {
    return field._id === fieldId;
  });

  return (field.length === 1) ? field[0] : undefined;
};

AT.prototype.getFields = function() {
    return this._fields;
};

AT.prototype.getFieldIds = function() {
    return _.pluck(this._fields, "_id");
};

AT.prototype.getRoutePath = function(route) {
    return "#";
};

AT.prototype.oauthServices = function() {
  // Extracts names of available services
  var names;

  if (Meteor.isServer) {
    names = (Accounts.oauth && Accounts.oauth.serviceNames()) || [];
  } else {
    names = (Accounts.oauth && Accounts.loginServicesConfigured() && Accounts.oauth.serviceNames()) || [];
  }
  // Extracts names of configured services
  var configuredServices = [];

  if (Accounts.loginServiceConfiguration) {
    configuredServices = _.pluck(Accounts.loginServiceConfiguration.find().fetch(), "service");
  }

  // Builds a list of objects containing service name as _id and its configuration status
  var services = _.map(names, function(name) {
    return {
      _id : name,
      configured: _.contains(configuredServices, name),
    };
  });

  // Checks whether there is a UI to configure services...
  // XXX: this only works with the accounts-ui package
  var showUnconfigured = typeof Accounts._loginButtonsSession !== "undefined";

  // Filters out unconfigured services in case they"re not to be displayed
  if (!showUnconfigured) {
    services = _.filter(services, function(service) {
      return service.configured;
    });
  }

  // Sorts services by name
  services = _.sortBy(services, function(service) {
    return service._id;
  });

  return services;
};

AT.prototype.removeField = function(fieldId) {
  // Fields can be removed only before initialization
  if (this._initialized) {
    throw new Error("AccountsTemplates.removeField should strictly be called before AccountsTemplates.init!");
  }
  // Tries to look up the field with given _id
  var index = _.indexOf(_.pluck(this._fields, "_id"), fieldId);

  if (index !== -1) {
    return this._fields.splice(index, 1)[0];
  } else if (!(Meteor.isServer && _.contains(this.SPECIAL_FIELDS, fieldId))) {
    throw new Error("A field called " + fieldId + " does not exist!");
  }
};

AT.prototype.getSpaceId = function(){
  return localStorage.getItem("signSpaceId");
}

AT.prototype.setSpaceId = function(spaceId){
  if(spaceId){
    localStorage.setItem("signSpaceId", spaceId);
  }
  else{
    localStorage.removeItem("signSpaceId");
  }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/steedos_useraccounts-core/lib/server.js                                                             //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
/* global
  AT: false,
  AccountsTemplates: false
*/
"use strict";

// Initialization
AT.prototype.init = function() {
  console.warn("[AccountsTemplates] There is no more need to call AccountsTemplates.init()! Simply remove the call ;-)");
};

AT.prototype._init = function() {
  if (this._initialized) {
    return;
  }

  // Checks there is at least one account service installed
  if (!Package["accounts-password"] && (!Accounts.oauth || Accounts.oauth.serviceNames().length === 0)) {
    throw Error("AccountsTemplates: You must add at least one account service!");
  }

  // A password field is strictly required
  var password = this.getField("password");
  if (!password) {
    throw Error("A password field is strictly required!");
  }

  if (password.type !== "password") {
    throw Error("The type of password field should be password!");
  }

  // Then we can have "username" or "email" or even both of them
  // but at least one of the two is strictly required
  var username = this.getField("username");
  var email = this.getField("email");

  if (!username && !email) {
    throw Error("At least one field out of username and email is strictly required!");
  }

  // 企业注册界面没有该字段，所以改为非必填
  // if (username && !username.required) {
  //   throw Error("The username field should be required!");
  // }

  if (email) {
    if (email.type !== "email") {
      throw Error("The type of email field should be email!");
    }

    if (username) {
      // username and email
      if (username.type !== "text") {
        throw Error("The type of username field should be text when email field is present!");
      }
    } else {
      // email only
      if (!email.required) {
        throw Error("The email field should be required when username is not present!");
      }
    }
  } else {
    // username only
    if (username.type !== "text" && username.type !== "tel") {
      throw Error("The type of username field should be text or tel!");
    }
  }

  // Possibly publish more user data in order to be able to show add/remove
  // buttons for 3rd-party services
  if (this.options.showAddRemoveServices) {
    // Publish additional current user info to get the list of registered services
    // XXX TODO: use
    // Accounts.addAutopublishFields({
    //   forLoggedInUser: ['services.facebook'],
    //   forOtherUsers: [],
    // })
    // ...adds only user.services.*.id
    Meteor.publish("userRegisteredServices", function() {
      var userId = this.userId;
      return Meteor.users.find(userId, {
        fields: {
          services: 1
        }
      });
      /*
      if (userId) {
        var user = Meteor.users.findOne(userId);
        var services_id = _.chain(user.services)
          .keys()
          .reject(function(service) {return service === "resume";})
          .map(function(service) {return "services." + service + ".id";})
          .value();
        var projection = {};
        _.each(services_id, function(key) {projection[key] = 1;});
        return Meteor.users.find(userId, {fields: projection});
      }
      */
    });
  }

  // Security stuff
  if (this.options.overrideLoginErrors) {
    Accounts.validateLoginAttempt(function(attempt) {
      if (attempt.error) {
        var reason = attempt.error.reason;
        if (reason === "User not found" || reason === "Incorrect password") {
          throw new Meteor.Error(403, AccountsTemplates.texts.errors.loginForbidden);
        }
      }
      return attempt.allowed;
    });
  }

  if (this.options.sendVerificationEmail && this.options.enforceEmailVerification) {
    Accounts.validateLoginAttempt(function(attempt) {
      if (!attempt.allowed) {
        return false;
      }

      if (attempt.type !== "password" || attempt.methodName !== "login") {
        return attempt.allowed;
      }

      var user = attempt.user;
      if (!user) {
        return attempt.allowed;
      }

      var ok = true;
      var loginEmail = attempt.methodArguments[0].user.email.toLowerCase();
      if (loginEmail) {
        var email = _.filter(user.emails, function(obj) {
          return obj.address.toLowerCase() === loginEmail;
        });
        if (!email.length || !email[0].verified) {
          ok = false;
        }
      } else {
        // we got the username, lets check there's at lease one verified email
        var emailVerified = _.chain(user.emails)
          .pluck('verified')
          .any()
          .value();

        if (!emailVerified) {
          ok = false;
        }
      }
      if (!ok) {
        throw new Meteor.Error(401, AccountsTemplates.texts.errors.verifyEmailFirst);
      }

      return attempt.allowed;
    });
  }

  //Check that reCaptcha secret keys are available
  if (this.options.showReCaptcha) {
    var atSecretKey = AccountsTemplates.options.reCaptcha && AccountsTemplates.options.reCaptcha.secretKey;
    var settingsSecretKey = Meteor.settings.reCaptcha && Meteor.settings.reCaptcha.secretKey;

    if (!atSecretKey && !settingsSecretKey) {
      throw new Meteor.Error(401, "User Accounts: reCaptcha secret key not found! Please provide it or set showReCaptcha to false.");
    }
  }

  // Marks AccountsTemplates as initialized
  this._initialized = true;
};

AccountsTemplates = new AT();

// Client side account creation is disabled by default:
// the methos ATCreateUserServer is used instead!
// to actually disable client side account creation use:
//
//    AccountsTemplates.config({
//        forbidClientAccountCreation: true
//    });

Accounts.config({
  forbidClientAccountCreation: true,
  loginExpirationInDays: Meteor.settings.public.accounts ? Meteor.settings.public.accounts.loginExpirationInDays : undefined
});

// Initialization
Meteor.startup(function() {
  AccountsTemplates._init();
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/steedos_useraccounts-core/lib/methods.js                                                            //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
/* global
  AccountsTemplates: false
*/
"use strict";

Meteor.methods({
  ATRemoveService: function(serviceName) {
    check(serviceName, String);

    var userId = this.userId;

    if (userId) {
      var user = Meteor.users.findOne(userId);
      var numServices = _.keys(user.services).length; // including "resume"
      var unset = {};

      if (numServices === 2) {
        throw new Meteor.Error(403, AccountsTemplates.texts.errors.cannotRemoveService, {});
      }

      unset["services." + serviceName] = "";
      Meteor.users.update(userId, {$unset: unset});
    }
  },
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/steedos_useraccounts-core/lib/server_methods.js                                                     //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
/* global
  AccountsTemplates
*/
"use strict";

Meteor.methods({
  ATCreateUserServer: function(options) {
    if (AccountsTemplates.options.forbidClientAccountCreation) {
      throw new Meteor.Error(403, AccountsTemplates.texts.errors.accountsCreationDisabled);
    }

    // createUser() does more checking.
    check(options, Object);
    var allFieldIds = AccountsTemplates.getFieldIds();

    // Picks-up whitelisted fields for profile
    var profile = options.profile;
    profile = _.pick(profile, allFieldIds);
    profile = _.omit(profile, "username", "email", "password");

    // Validates fields" value
    var signupInfo = _.clone(profile);
    if (options.username) {
      signupInfo.username = options.username;

      if (AccountsTemplates.options.lowercaseUsername) {
        signupInfo.username = signupInfo.username.trim().replace(/\s+/gm, ' ');
        options.profile.name = signupInfo.username;
        signupInfo.username = signupInfo.username.toLowerCase().replace(/\s+/gm, '');
        options.username = signupInfo.username;
      }
    }

    if (options.email) {
      signupInfo.email = options.email;

      if (AccountsTemplates.options.lowercaseUsername) {
        signupInfo.email = signupInfo.email.toLowerCase().replace(/\s+/gm, '');
        options.email = signupInfo.email;
      }
    }

    if (options.password) {
      signupInfo.password = options.password;
    }

    var validationErrors = {};
    var someError = false;

    // Validates fields values
    _.each(AccountsTemplates.getFields(), function(field) {
      var fieldId = field._id;
      var value = signupInfo[fieldId];

      if (fieldId === "password") {
        // Can"t Pick-up password here
        // NOTE: at this stage the password is already encripted,
        //       so there is no way to validate it!!!
        check(value, Object);
        return;
      }

      var validationErr = field.validate(value, "strict");
      if (validationErr) {
        validationErrors[fieldId] = validationErr;
        someError = true;
      }
    });

    if (AccountsTemplates.options.showReCaptcha) {
      var secretKey = null;

      if (AccountsTemplates.options.reCaptcha && AccountsTemplates.options.reCaptcha.secretKey) {
        secretKey = AccountsTemplates.options.reCaptcha.secretKey;
      } else {
        secretKey = Meteor.settings.reCaptcha.secretKey;
      }

      var apiResponse = HTTP.post("https://www.google.com/recaptcha/api/siteverify", {
        params: {
          secret: secretKey,
          response: options.profile.reCaptchaResponse,
          remoteip: this.connection.clientAddress,
        }
      }).data;

      if (!apiResponse.success) {
        throw new Meteor.Error(403, AccountsTemplates.texts.errors.captchaVerification,
          apiResponse['error-codes'] ? apiResponse['error-codes'].join(", ") : "Unknown Error.");
      }
    }

    if (someError) {
      throw new Meteor.Error(403, AccountsTemplates.texts.errors.validationErrors, validationErrors);
    }

    // Possibly removes the profile field
    if (_.isEmpty(options.profile)) {
      delete options.profile;
    }

    // Create user. result contains id and token.
    var userId = Accounts.createUser(options);
    // safety belt. createUser is supposed to throw on error. send 500 error
    // instead of sending a verification email with empty userid.
    if (! userId) {
      throw new Error("createUser failed to insert new user");
    }

    // Call postSignUpHook, if any...
    var postSignUpHook = AccountsTemplates.options.postSignUpHook;
    if (postSignUpHook) {
      postSignUpHook(userId, options);
    }

    // Send a email address verification email in case the context permits it
    // and the specific configuration flag was set to true
    if (options.email && AccountsTemplates.options.sendVerificationEmail) {
      Accounts.sendVerificationEmail(userId, options.email);
    }
  },

  // Resend a user's verification e-mail
  ATResendVerificationEmail: function (email) {
    check(email, String);

    var user = Meteor.users.findOne({ "emails.address": email });

    // Send the standard error back to the client if no user exist with this e-mail
    if (!user) {
      throw new Meteor.Error(403, "User not found");
    }

    try {
      Accounts.sendVerificationEmail(user._id);
    } catch (error) {
      // Handle error when email already verified
      // https://github.com/dwinston/send-verification-email-bug
      throw new Meteor.Error(403, "Already verified");
    }
  },
  VerifyForgotPwdToken: function (token) {
    check(token, String);
    
    var user = Meteor.users.findOne({ 'services.password.reset.token' : token });
    if (!user) {
      throw new Meteor.Error(403, "Token expired");
    }
  }
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
Package._define("steedos:useraccounts-core", {
  AccountsTemplates: AccountsTemplates
});

})();
