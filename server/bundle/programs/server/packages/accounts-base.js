(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var DDPRateLimiter = Package['ddp-rate-limiter'].DDPRateLimiter;
var check = Package.check.check;
var Match = Package.check.Match;
var Random = Package.random.Random;
var EJSON = Package.ejson.EJSON;
var Hook = Package['callback-hook'].Hook;
var DDP = Package['ddp-client'].DDP;
var DDPServer = Package['ddp-server'].DDPServer;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var meteorInstall = Package.modules.meteorInstall;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var Accounts, options, stampedLoginToken, handler, name, query, oldestValidDate, user;

var require = meteorInstall({"node_modules":{"meteor":{"accounts-base":{"server_main.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/accounts-base/server_main.js                                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
!function (module1) {
  module1.export({
    AccountsServer: () => AccountsServer
  });
  let AccountsServer;
  module1.link("./accounts_server.js", {
    AccountsServer(v) {
      AccountsServer = v;
    }

  }, 0);

  /**
   * @namespace Accounts
   * @summary The namespace for all server-side accounts-related methods.
   */
  Accounts = new AccountsServer(Meteor.server); // Users table. Don't use the normal autopublish, since we want to hide
  // some fields. Code to autopublish this is in accounts_server.js.
  // XXX Allow users to configure this collection name.

  /**
   * @summary A [Mongo.Collection](#collections) containing user documents.
   * @locus Anywhere
   * @type {Mongo.Collection}
   * @importFromPackage meteor
  */

  Meteor.users = Accounts.users;
}.call(this, module);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"accounts_common.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/accounts-base/accounts_common.js                                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let _objectSpread;

module.link("@babel/runtime/helpers/objectSpread2", {
  default(v) {
    _objectSpread = v;
  }

}, 0);
module.export({
  AccountsCommon: () => AccountsCommon,
  EXPIRE_TOKENS_INTERVAL_MS: () => EXPIRE_TOKENS_INTERVAL_MS,
  CONNECTION_CLOSE_DELAY_MS: () => CONNECTION_CLOSE_DELAY_MS
});

class AccountsCommon {
  constructor(options) {
    // Currently this is read directly by packages like accounts-password
    // and accounts-ui-unstyled.
    this._options = {}; // Note that setting this.connection = null causes this.users to be a
    // LocalCollection, which is not what we want.

    this.connection = undefined;

    this._initConnection(options || {}); // There is an allow call in accounts_server.js that restricts writes to
    // this collection.


    this.users = new Mongo.Collection("users", {
      _preventAutopublish: true,
      connection: this.connection
    }); // Callback exceptions are printed with Meteor._debug and ignored.

    this._onLoginHook = new Hook({
      bindEnvironment: false,
      debugPrintExceptions: "onLogin callback"
    });
    this._onLoginFailureHook = new Hook({
      bindEnvironment: false,
      debugPrintExceptions: "onLoginFailure callback"
    });
    this._onLogoutHook = new Hook({
      bindEnvironment: false,
      debugPrintExceptions: "onLogout callback"
    }); // Expose for testing.

    this.DEFAULT_LOGIN_EXPIRATION_DAYS = DEFAULT_LOGIN_EXPIRATION_DAYS;
    this.LOGIN_UNEXPIRING_TOKEN_DAYS = LOGIN_UNEXPIRING_TOKEN_DAYS; // Thrown when the user cancels the login process (eg, closes an oauth
    // popup, declines retina scan, etc)

    const lceName = 'Accounts.LoginCancelledError';
    this.LoginCancelledError = Meteor.makeErrorType(lceName, function (description) {
      this.message = description;
    });
    this.LoginCancelledError.prototype.name = lceName; // This is used to transmit specific subclass errors over the wire. We
    // should come up with a more generic way to do this (eg, with some sort of
    // symbolic error code rather than a number).

    this.LoginCancelledError.numericError = 0x8acdc2f; // loginServiceConfiguration and ConfigError are maintained for backwards compatibility

    Meteor.startup(() => {
      const {
        ServiceConfiguration
      } = Package['service-configuration'];
      this.loginServiceConfiguration = ServiceConfiguration.configurations;
      this.ConfigError = ServiceConfiguration.ConfigError;
    });
  }
  /**
   * @summary Get the current user id, or `null` if no user is logged in. A reactive data source.
   * @locus Anywhere
   */


  userId() {
    throw new Error("userId method not implemented");
  }
  /**
   * @summary Get the current user record, or `null` if no user is logged in. A reactive data source.
   * @locus Anywhere
   */


  user() {
    const userId = this.userId();
    return userId ? this.users.findOne(userId) : null;
  } // Set up config for the accounts system. Call this on both the client
  // and the server.
  //
  // Note that this method gets overridden on AccountsServer.prototype, but
  // the overriding method calls the overridden method.
  //
  // XXX we should add some enforcement that this is called on both the
  // client and the server. Otherwise, a user can
  // 'forbidClientAccountCreation' only on the client and while it looks
  // like their app is secure, the server will still accept createUser
  // calls. https://github.com/meteor/meteor/issues/828
  //
  // @param options {Object} an object with fields:
  // - sendVerificationEmail {Boolean}
  //     Send email address verification emails to new users created from
  //     client signups.
  // - forbidClientAccountCreation {Boolean}
  //     Do not allow clients to create accounts directly.
  // - restrictCreationByEmailDomain {Function or String}
  //     Require created users to have an email matching the function or
  //     having the string as domain.
  // - loginExpirationInDays {Number}
  //     Number of days since login until a user is logged out (login token
  //     expires).
  // - passwordResetTokenExpirationInDays {Number}
  //     Number of days since password reset token creation until the
  //     token cannt be used any longer (password reset token expires).
  // - ambiguousErrorMessages {Boolean}
  //     Return ambiguous error messages from login failures to prevent
  //     user enumeration.
  // - bcryptRounds {Number}
  //     Allows override of number of bcrypt rounds (aka work factor) used
  //     to store passwords.

  /**
   * @summary Set global accounts options.
   * @locus Anywhere
   * @param {Object} options
   * @param {Boolean} options.sendVerificationEmail New users with an email address will receive an address verification email.
   * @param {Boolean} options.forbidClientAccountCreation Calls to [`createUser`](#accounts_createuser) from the client will be rejected. In addition, if you are using [accounts-ui](#accountsui), the "Create account" link will not be available.
   * @param {String | Function} options.restrictCreationByEmailDomain If set to a string, only allows new users if the domain part of their email address matches the string. If set to a function, only allows new users if the function returns true.  The function is passed the full email address of the proposed new user.  Works with password-based sign-in and external services that expose email addresses (Google, Facebook, GitHub). All existing users still can log in after enabling this option. Example: `Accounts.config({ restrictCreationByEmailDomain: 'school.edu' })`.
   * @param {Number} options.loginExpirationInDays The number of days from when a user logs in until their token expires and they are logged out. Defaults to 90. Set to `null` to disable login expiration.
   * @param {String} options.oauthSecretKey When using the `oauth-encryption` package, the 16 byte key using to encrypt sensitive account credentials in the database, encoded in base64.  This option may only be specifed on the server.  See packages/oauth-encryption/README.md for details.
   * @param {Number} options.passwordResetTokenExpirationInDays The number of days from when a link to reset password is sent until token expires and user can't reset password with the link anymore. Defaults to 3.
   * @param {Number} options.passwordEnrollTokenExpirationInDays The number of days from when a link to set inital password is sent until token expires and user can't set password with the link anymore. Defaults to 30.
   * @param {Boolean} options.ambiguousErrorMessages Return ambiguous error messages from login failures to prevent user enumeration. Defaults to false.
   */


  config(options) {
    // We don't want users to accidentally only call Accounts.config on the
    // client, where some of the options will have partial effects (eg removing
    // the "create account" button from accounts-ui if forbidClientAccountCreation
    // is set, or redirecting Google login to a specific-domain page) without
    // having their full effects.
    if (Meteor.isServer) {
      __meteor_runtime_config__.accountsConfigCalled = true;
    } else if (!__meteor_runtime_config__.accountsConfigCalled) {
      // XXX would be nice to "crash" the client and replace the UI with an error
      // message, but there's no trivial way to do this.
      Meteor._debug("Accounts.config was called on the client but not on the " + "server; some configuration options may not take effect.");
    } // We need to validate the oauthSecretKey option at the time
    // Accounts.config is called. We also deliberately don't store the
    // oauthSecretKey in Accounts._options.


    if (Object.prototype.hasOwnProperty.call(options, 'oauthSecretKey')) {
      if (Meteor.isClient) {
        throw new Error("The oauthSecretKey option may only be specified on the server");
      }

      if (!Package["oauth-encryption"]) {
        throw new Error("The oauth-encryption package must be loaded to set oauthSecretKey");
      }

      Package["oauth-encryption"].OAuthEncryption.loadKey(options.oauthSecretKey);
      options = _objectSpread({}, options);
      delete options.oauthSecretKey;
    } // validate option keys


    const VALID_KEYS = ["sendVerificationEmail", "forbidClientAccountCreation", "passwordEnrollTokenExpirationInDays", "restrictCreationByEmailDomain", "loginExpirationInDays", "passwordResetTokenExpirationInDays", "ambiguousErrorMessages", "bcryptRounds"];
    Object.keys(options).forEach(key => {
      if (!VALID_KEYS.includes(key)) {
        throw new Error("Accounts.config: Invalid key: ".concat(key));
      }
    }); // set values in Accounts._options

    VALID_KEYS.forEach(key => {
      if (key in options) {
        if (key in this._options) {
          throw new Error("Can't set `".concat(key, "` more than once"));
        }

        this._options[key] = options[key];
      }
    });
  }
  /**
   * @summary Register a callback to be called after a login attempt succeeds.
   * @locus Anywhere
   * @param {Function} func The callback to be called when login is successful.
   *                        The callback receives a single object that
   *                        holds login details. This object contains the login
   *                        result type (password, resume, etc.) on both the
   *                        client and server. `onLogin` callbacks registered
   *                        on the server also receive extra data, such
   *                        as user details, connection information, etc.
   */


  onLogin(func) {
    let ret = this._onLoginHook.register(func); // call the just registered callback if already logged in


    this._startupCallback(ret.callback);

    return ret;
  }
  /**
   * @summary Register a callback to be called after a login attempt fails.
   * @locus Anywhere
   * @param {Function} func The callback to be called after the login has failed.
   */


  onLoginFailure(func) {
    return this._onLoginFailureHook.register(func);
  }
  /**
   * @summary Register a callback to be called after a logout attempt succeeds.
   * @locus Anywhere
   * @param {Function} func The callback to be called when logout is successful.
   */


  onLogout(func) {
    return this._onLogoutHook.register(func);
  }

  _initConnection(options) {
    if (!Meteor.isClient) {
      return;
    } // The connection used by the Accounts system. This is the connection
    // that will get logged in by Meteor.login(), and this is the
    // connection whose login state will be reflected by Meteor.userId().
    //
    // It would be much preferable for this to be in accounts_client.js,
    // but it has to be here because it's needed to create the
    // Meteor.users collection.


    if (options.connection) {
      this.connection = options.connection;
    } else if (options.ddpUrl) {
      this.connection = DDP.connect(options.ddpUrl);
    } else if (typeof __meteor_runtime_config__ !== "undefined" && __meteor_runtime_config__.ACCOUNTS_CONNECTION_URL) {
      // Temporary, internal hook to allow the server to point the client
      // to a different authentication server. This is for a very
      // particular use case that comes up when implementing a oauth
      // server. Unsupported and may go away at any point in time.
      //
      // We will eventually provide a general way to use account-base
      // against any DDP connection, not just one special one.
      this.connection = DDP.connect(__meteor_runtime_config__.ACCOUNTS_CONNECTION_URL);
    } else {
      this.connection = Meteor.connection;
    }
  }

  _getTokenLifetimeMs() {
    // When loginExpirationInDays is set to null, we'll use a really high
    // number of days (LOGIN_UNEXPIRABLE_TOKEN_DAYS) to simulate an
    // unexpiring token.
    const loginExpirationInDays = this._options.loginExpirationInDays === null ? LOGIN_UNEXPIRING_TOKEN_DAYS : this._options.loginExpirationInDays;
    return (loginExpirationInDays || DEFAULT_LOGIN_EXPIRATION_DAYS) * 24 * 60 * 60 * 1000;
  }

  _getPasswordResetTokenLifetimeMs() {
    return (this._options.passwordResetTokenExpirationInDays || DEFAULT_PASSWORD_RESET_TOKEN_EXPIRATION_DAYS) * 24 * 60 * 60 * 1000;
  }

  _getPasswordEnrollTokenLifetimeMs() {
    return (this._options.passwordEnrollTokenExpirationInDays || DEFAULT_PASSWORD_ENROLL_TOKEN_EXPIRATION_DAYS) * 24 * 60 * 60 * 1000;
  }

  _tokenExpiration(when) {
    // We pass when through the Date constructor for backwards compatibility;
    // `when` used to be a number.
    return new Date(new Date(when).getTime() + this._getTokenLifetimeMs());
  }

  _tokenExpiresSoon(when) {
    let minLifetimeMs = .1 * this._getTokenLifetimeMs();

    const minLifetimeCapMs = MIN_TOKEN_LIFETIME_CAP_SECS * 1000;

    if (minLifetimeMs > minLifetimeCapMs) {
      minLifetimeMs = minLifetimeCapMs;
    }

    return new Date() > new Date(when) - minLifetimeMs;
  } // No-op on the server, overridden on the client.


  _startupCallback(callback) {}

}

// Note that Accounts is defined separately in accounts_client.js and
// accounts_server.js.

/**
 * @summary Get the current user id, or `null` if no user is logged in. A reactive data source.
 * @locus Anywhere but publish functions
 * @importFromPackage meteor
 */
Meteor.userId = () => Accounts.userId();
/**
 * @summary Get the current user record, or `null` if no user is logged in. A reactive data source.
 * @locus Anywhere but publish functions
 * @importFromPackage meteor
 */


Meteor.user = () => Accounts.user(); // how long (in days) until a login token expires


const DEFAULT_LOGIN_EXPIRATION_DAYS = 90; // how long (in days) until reset password token expires

const DEFAULT_PASSWORD_RESET_TOKEN_EXPIRATION_DAYS = 3; // how long (in days) until enrol password token expires

const DEFAULT_PASSWORD_ENROLL_TOKEN_EXPIRATION_DAYS = 30; // Clients don't try to auto-login with a token that is going to expire within
// .1 * DEFAULT_LOGIN_EXPIRATION_DAYS, capped at MIN_TOKEN_LIFETIME_CAP_SECS.
// Tries to avoid abrupt disconnects from expiring tokens.

const MIN_TOKEN_LIFETIME_CAP_SECS = 3600; // one hour
// how often (in milliseconds) we check for expired tokens

const EXPIRE_TOKENS_INTERVAL_MS = 600 * 1000;
const CONNECTION_CLOSE_DELAY_MS = 10 * 1000;
// A large number of expiration days (approximately 100 years worth) that is
// used when creating unexpiring tokens.
const LOGIN_UNEXPIRING_TOKEN_DAYS = 365 * 100;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"accounts_server.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/accounts-base/accounts_server.js                                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let _objectWithoutProperties;

module.link("@babel/runtime/helpers/objectWithoutProperties", {
  default(v) {
    _objectWithoutProperties = v;
  }

}, 0);

let _objectSpread;

module.link("@babel/runtime/helpers/objectSpread2", {
  default(v) {
    _objectSpread = v;
  }

}, 1);
module.export({
  AccountsServer: () => AccountsServer
});
let crypto;
module.link("crypto", {
  default(v) {
    crypto = v;
  }

}, 0);
let AccountsCommon, EXPIRE_TOKENS_INTERVAL_MS, CONNECTION_CLOSE_DELAY_MS;
module.link("./accounts_common.js", {
  AccountsCommon(v) {
    AccountsCommon = v;
  },

  EXPIRE_TOKENS_INTERVAL_MS(v) {
    EXPIRE_TOKENS_INTERVAL_MS = v;
  },

  CONNECTION_CLOSE_DELAY_MS(v) {
    CONNECTION_CLOSE_DELAY_MS = v;
  }

}, 1);
const hasOwn = Object.prototype.hasOwnProperty;
/**
 * @summary Constructor for the `Accounts` namespace on the server.
 * @locus Server
 * @class AccountsServer
 * @extends AccountsCommon
 * @instancename accountsServer
 * @param {Object} server A server object such as `Meteor.server`.
 */

class AccountsServer extends AccountsCommon {
  // Note that this constructor is less likely to be instantiated multiple
  // times than the `AccountsClient` constructor, because a single server
  // can provide only one set of methods.
  constructor(server) {
    super();
    this._server = server || Meteor.server; // Set up the server's methods, as if by calling Meteor.methods.

    this._initServerMethods();

    this._initAccountDataHooks(); // If autopublish is on, publish these user fields. Login service
    // packages (eg accounts-google) add to these by calling
    // addAutopublishFields.  Notably, this isn't implemented with multiple
    // publishes since DDP only merges only across top-level fields, not
    // subfields (such as 'services.facebook.accessToken')


    this._autopublishFields = {
      loggedInUser: ['profile', 'username', 'emails'],
      otherUsers: ['profile', 'username']
    };

    this._initServerPublications(); // connectionId -> {connection, loginToken}


    this._accountData = {}; // connection id -> observe handle for the login token that this connection is
    // currently associated with, or a number. The number indicates that we are in
    // the process of setting up the observe (using a number instead of a single
    // sentinel allows multiple attempts to set up the observe to identify which
    // one was theirs).

    this._userObservesForConnections = {};
    this._nextUserObserveNumber = 1; // for the number described above.
    // list of all registered handlers.

    this._loginHandlers = [];
    setupUsersCollection(this.users);
    setupDefaultLoginHandlers(this);
    setExpireTokensInterval(this);
    this._validateLoginHook = new Hook({
      bindEnvironment: false
    });
    this._validateNewUserHooks = [defaultValidateNewUserHook.bind(this)];

    this._deleteSavedTokensForAllUsersOnStartup();

    this._skipCaseInsensitiveChecksForTest = {}; // XXX These should probably not actually be public?

    this.urls = {
      resetPassword: token => Meteor.absoluteUrl("#/reset-password/".concat(token)),
      verifyEmail: token => Meteor.absoluteUrl("#/verify-email/".concat(token)),
      enrollAccount: token => Meteor.absoluteUrl("#/enroll-account/".concat(token))
    };
    this.addDefaultRateLimit();
  } ///
  /// CURRENT USER
  ///
  // @override of "abstract" non-implementation in accounts_common.js


  userId() {
    // This function only works if called inside a method or a pubication.
    // Using any of the infomation from Meteor.user() in a method or
    // publish function will always use the value from when the function first
    // runs. This is likely not what the user expects. The way to make this work
    // in a method or publish function is to do Meteor.find(this.userId).observe
    // and recompute when the user record changes.
    const currentInvocation = DDP._CurrentMethodInvocation.get() || DDP._CurrentPublicationInvocation.get();

    if (!currentInvocation) throw new Error("Meteor.userId can only be invoked in method calls or publications.");
    return currentInvocation.userId;
  } ///
  /// LOGIN HOOKS
  ///

  /**
   * @summary Validate login attempts.
   * @locus Server
   * @param {Function} func Called whenever a login is attempted (either successful or unsuccessful).  A login can be aborted by returning a falsy value or throwing an exception.
   */


  validateLoginAttempt(func) {
    // Exceptions inside the hook callback are passed up to us.
    return this._validateLoginHook.register(func);
  }
  /**
   * @summary Set restrictions on new user creation.
   * @locus Server
   * @param {Function} func Called whenever a new user is created. Takes the new user object, and returns true to allow the creation or false to abort.
   */


  validateNewUser(func) {
    this._validateNewUserHooks.push(func);
  } ///
  /// CREATE USER HOOKS
  ///

  /**
   * @summary Customize new user creation.
   * @locus Server
   * @param {Function} func Called whenever a new user is created. Return the new user object, or throw an `Error` to abort the creation.
   */


  onCreateUser(func) {
    if (this._onCreateUserHook) {
      throw new Error("Can only call onCreateUser once");
    }

    this._onCreateUserHook = func;
  }
  /**
   * @summary Customize oauth user profile updates
   * @locus Server
   * @param {Function} func Called whenever a user is logged in via oauth. Return the profile object to be merged, or throw an `Error` to abort the creation.
   */


  onExternalLogin(func) {
    if (this._onExternalLoginHook) {
      throw new Error("Can only call onExternalLogin once");
    }

    this._onExternalLoginHook = func;
  }

  _validateLogin(connection, attempt) {
    this._validateLoginHook.each(callback => {
      let ret;

      try {
        ret = callback(cloneAttemptWithConnection(connection, attempt));
      } catch (e) {
        attempt.allowed = false; // XXX this means the last thrown error overrides previous error
        // messages. Maybe this is surprising to users and we should make
        // overriding errors more explicit. (see
        // https://github.com/meteor/meteor/issues/1960)

        attempt.error = e;
        return true;
      }

      if (!ret) {
        attempt.allowed = false; // don't override a specific error provided by a previous
        // validator or the initial attempt (eg "incorrect password").

        if (!attempt.error) attempt.error = new Meteor.Error(403, "Login forbidden");
      }

      return true;
    });
  }

  _successfulLogin(connection, attempt) {
    this._onLoginHook.each(callback => {
      callback(cloneAttemptWithConnection(connection, attempt));
      return true;
    });
  }

  _failedLogin(connection, attempt) {
    this._onLoginFailureHook.each(callback => {
      callback(cloneAttemptWithConnection(connection, attempt));
      return true;
    });
  }

  _successfulLogout(connection, userId) {
    const user = userId && this.users.findOne(userId);

    this._onLogoutHook.each(callback => {
      callback({
        user,
        connection
      });
      return true;
    });
  }

  ///
  /// LOGIN METHODS
  ///
  // Login methods return to the client an object containing these
  // fields when the user was logged in successfully:
  //
  //   id: userId
  //   token: *
  //   tokenExpires: *
  //
  // tokenExpires is optional and intends to provide a hint to the
  // client as to when the token will expire. If not provided, the
  // client will call Accounts._tokenExpiration, passing it the date
  // that it received the token.
  //
  // The login method will throw an error back to the client if the user
  // failed to log in.
  //
  //
  // Login handlers and service specific login methods such as
  // `createUser` internally return a `result` object containing these
  // fields:
  //
  //   type:
  //     optional string; the service name, overrides the handler
  //     default if present.
  //
  //   error:
  //     exception; if the user is not allowed to login, the reason why.
  //
  //   userId:
  //     string; the user id of the user attempting to login (if
  //     known), required for an allowed login.
  //
  //   options:
  //     optional object merged into the result returned by the login
  //     method; used by HAMK from SRP.
  //
  //   stampedLoginToken:
  //     optional object with `token` and `when` indicating the login
  //     token is already present in the database, returned by the
  //     "resume" login handler.
  //
  // For convenience, login methods can also throw an exception, which
  // is converted into an {error} result.  However, if the id of the
  // user attempting the login is known, a {userId, error} result should
  // be returned instead since the user id is not captured when an
  // exception is thrown.
  //
  // This internal `result` object is automatically converted into the
  // public {id, token, tokenExpires} object returned to the client.
  // Try a login method, converting thrown exceptions into an {error}
  // result.  The `type` argument is a default, inserted into the result
  // object if not explicitly returned.
  //
  // Log in a user on a connection.
  //
  // We use the method invocation to set the user id on the connection,
  // not the connection object directly. setUserId is tied to methods to
  // enforce clear ordering of method application (using wait methods on
  // the client, and a no setUserId after unblock restriction on the
  // server)
  //
  // The `stampedLoginToken` parameter is optional.  When present, it
  // indicates that the login token has already been inserted into the
  // database and doesn't need to be inserted again.  (It's used by the
  // "resume" login handler).
  _loginUser(methodInvocation, userId, stampedLoginToken) {
    if (!stampedLoginToken) {
      stampedLoginToken = this._generateStampedLoginToken();

      this._insertLoginToken(userId, stampedLoginToken);
    } // This order (and the avoidance of yields) is important to make
    // sure that when publish functions are rerun, they see a
    // consistent view of the world: the userId is set and matches
    // the login token on the connection (not that there is
    // currently a public API for reading the login token on a
    // connection).


    Meteor._noYieldsAllowed(() => this._setLoginToken(userId, methodInvocation.connection, this._hashLoginToken(stampedLoginToken.token)));

    methodInvocation.setUserId(userId);
    return {
      id: userId,
      token: stampedLoginToken.token,
      tokenExpires: this._tokenExpiration(stampedLoginToken.when)
    };
  }

  // After a login method has completed, call the login hooks.  Note
  // that `attemptLogin` is called for *all* login attempts, even ones
  // which aren't successful (such as an invalid password, etc).
  //
  // If the login is allowed and isn't aborted by a validate login hook
  // callback, log in the user.
  //
  _attemptLogin(methodInvocation, methodName, methodArgs, result) {
    if (!result) throw new Error("result is required"); // XXX A programming error in a login handler can lead to this occuring, and
    // then we don't call onLogin or onLoginFailure callbacks. Should
    // tryLoginMethod catch this case and turn it into an error?

    if (!result.userId && !result.error) throw new Error("A login method must specify a userId or an error");
    let user;
    if (result.userId) user = this.users.findOne(result.userId);
    const attempt = {
      type: result.type || "unknown",
      allowed: !!(result.userId && !result.error),
      methodName: methodName,
      methodArguments: Array.from(methodArgs)
    };

    if (result.error) {
      attempt.error = result.error;
    }

    if (user) {
      attempt.user = user;
    } // _validateLogin may mutate `attempt` by adding an error and changing allowed
    // to false, but that's the only change it can make (and the user's callbacks
    // only get a clone of `attempt`).


    this._validateLogin(methodInvocation.connection, attempt);

    if (attempt.allowed) {
      const ret = _objectSpread({}, this._loginUser(methodInvocation, result.userId, result.stampedLoginToken), {}, result.options);

      ret.type = attempt.type;

      this._successfulLogin(methodInvocation.connection, attempt);

      return ret;
    } else {
      this._failedLogin(methodInvocation.connection, attempt);

      throw attempt.error;
    }
  }

  // All service specific login methods should go through this function.
  // Ensure that thrown exceptions are caught and that login hook
  // callbacks are still called.
  //
  _loginMethod(methodInvocation, methodName, methodArgs, type, fn) {
    return this._attemptLogin(methodInvocation, methodName, methodArgs, tryLoginMethod(type, fn));
  }

  // Report a login attempt failed outside the context of a normal login
  // method. This is for use in the case where there is a multi-step login
  // procedure (eg SRP based password login). If a method early in the
  // chain fails, it should call this function to report a failure. There
  // is no corresponding method for a successful login; methods that can
  // succeed at logging a user in should always be actual login methods
  // (using either Accounts._loginMethod or Accounts.registerLoginHandler).
  _reportLoginFailure(methodInvocation, methodName, methodArgs, result) {
    const attempt = {
      type: result.type || "unknown",
      allowed: false,
      error: result.error,
      methodName: methodName,
      methodArguments: Array.from(methodArgs)
    };

    if (result.userId) {
      attempt.user = this.users.findOne(result.userId);
    }

    this._validateLogin(methodInvocation.connection, attempt);

    this._failedLogin(methodInvocation.connection, attempt); // _validateLogin may mutate attempt to set a new error message. Return
    // the modified version.


    return attempt;
  }

  ///
  /// LOGIN HANDLERS
  ///
  // The main entry point for auth packages to hook in to login.
  //
  // A login handler is a login method which can return `undefined` to
  // indicate that the login request is not handled by this handler.
  //
  // @param name {String} Optional.  The service name, used by default
  // if a specific service name isn't returned in the result.
  //
  // @param handler {Function} A function that receives an options object
  // (as passed as an argument to the `login` method) and returns one of:
  // - `undefined`, meaning don't handle;
  // - a login method result object
  registerLoginHandler(name, handler) {
    if (!handler) {
      handler = name;
      name = null;
    }

    this._loginHandlers.push({
      name: name,
      handler: handler
    });
  }

  // Checks a user's credentials against all the registered login
  // handlers, and returns a login token if the credentials are valid. It
  // is like the login method, except that it doesn't set the logged-in
  // user on the connection. Throws a Meteor.Error if logging in fails,
  // including the case where none of the login handlers handled the login
  // request. Otherwise, returns {id: userId, token: *, tokenExpires: *}.
  //
  // For example, if you want to login with a plaintext password, `options` could be
  //   { user: { username: <username> }, password: <password> }, or
  //   { user: { email: <email> }, password: <password> }.
  // Try all of the registered login handlers until one of them doesn't
  // return `undefined`, meaning it handled this call to `login`. Return
  // that return value.
  _runLoginHandlers(methodInvocation, options) {
    for (let handler of this._loginHandlers) {
      const result = tryLoginMethod(handler.name, () => handler.handler.call(methodInvocation, options));

      if (result) {
        return result;
      }

      if (result !== undefined) {
        throw new Meteor.Error(400, "A login handler should return a result or undefined");
      }
    }

    return {
      type: null,
      error: new Meteor.Error(400, "Unrecognized options for login request")
    };
  }

  // Deletes the given loginToken from the database.
  //
  // For new-style hashed token, this will cause all connections
  // associated with the token to be closed.
  //
  // Any connections associated with old-style unhashed tokens will be
  // in the process of becoming associated with hashed tokens and then
  // they'll get closed.
  destroyToken(userId, loginToken) {
    this.users.update(userId, {
      $pull: {
        "services.resume.loginTokens": {
          $or: [{
            hashedToken: loginToken
          }, {
            token: loginToken
          }]
        }
      }
    });
  }

  _initServerMethods() {
    // The methods created in this function need to be created here so that
    // this variable is available in their scope.
    const accounts = this; // This object will be populated with methods and then passed to
    // accounts._server.methods further below.

    const methods = {}; // @returns {Object|null}
    //   If successful, returns {token: reconnectToken, id: userId}
    //   If unsuccessful (for example, if the user closed the oauth login popup),
    //     throws an error describing the reason

    methods.login = function (options) {
      // Login handlers should really also check whatever field they look at in
      // options, but we don't enforce it.
      check(options, Object);

      const result = accounts._runLoginHandlers(this, options);

      return accounts._attemptLogin(this, "login", arguments, result);
    };

    methods.logout = function () {
      const token = accounts._getLoginToken(this.connection.id);

      accounts._setLoginToken(this.userId, this.connection, null);

      if (token && this.userId) {
        accounts.destroyToken(this.userId, token);
      }

      accounts._successfulLogout(this.connection, this.userId);

      this.setUserId(null);
    }; // Delete all the current user's tokens and close all open connections logged
    // in as this user. Returns a fresh new login token that this client can
    // use. Tests set Accounts._noConnectionCloseDelayForTest to delete tokens
    // immediately instead of using a delay.
    //
    // XXX COMPAT WITH 0.7.2
    // This single `logoutOtherClients` method has been replaced with two
    // methods, one that you call to get a new token, and another that you
    // call to remove all tokens except your own. The new design allows
    // clients to know when other clients have actually been logged
    // out. (The `logoutOtherClients` method guarantees the caller that
    // the other clients will be logged out at some point, but makes no
    // guarantees about when.) This method is left in for backwards
    // compatibility, especially since application code might be calling
    // this method directly.
    //
    // @returns {Object} Object with token and tokenExpires keys.


    methods.logoutOtherClients = function () {
      const user = accounts.users.findOne(this.userId, {
        fields: {
          "services.resume.loginTokens": true
        }
      });

      if (user) {
        // Save the current tokens in the database to be deleted in
        // CONNECTION_CLOSE_DELAY_MS ms. This gives other connections in the
        // caller's browser time to find the fresh token in localStorage. We save
        // the tokens in the database in case we crash before actually deleting
        // them.
        const tokens = user.services.resume.loginTokens;

        const newToken = accounts._generateStampedLoginToken();

        accounts.users.update(this.userId, {
          $set: {
            "services.resume.loginTokensToDelete": tokens,
            "services.resume.haveLoginTokensToDelete": true
          },
          $push: {
            "services.resume.loginTokens": accounts._hashStampedToken(newToken)
          }
        });
        Meteor.setTimeout(() => {
          // The observe on Meteor.users will take care of closing the connections
          // associated with `tokens`.
          accounts._deleteSavedTokensForUser(this.userId, tokens);
        }, accounts._noConnectionCloseDelayForTest ? 0 : CONNECTION_CLOSE_DELAY_MS); // We do not set the login token on this connection, but instead the
        // observe closes the connection and the client will reconnect with the
        // new token.

        return {
          token: newToken.token,
          tokenExpires: accounts._tokenExpiration(newToken.when)
        };
      } else {
        throw new Meteor.Error("You are not logged in.");
      }
    }; // Generates a new login token with the same expiration as the
    // connection's current token and saves it to the database. Associates
    // the connection with this new token and returns it. Throws an error
    // if called on a connection that isn't logged in.
    //
    // @returns Object
    //   If successful, returns { token: <new token>, id: <user id>,
    //   tokenExpires: <expiration date> }.


    methods.getNewToken = function () {
      const user = accounts.users.findOne(this.userId, {
        fields: {
          "services.resume.loginTokens": 1
        }
      });

      if (!this.userId || !user) {
        throw new Meteor.Error("You are not logged in.");
      } // Be careful not to generate a new token that has a later
      // expiration than the curren token. Otherwise, a bad guy with a
      // stolen token could use this method to stop his stolen token from
      // ever expiring.


      const currentHashedToken = accounts._getLoginToken(this.connection.id);

      const currentStampedToken = user.services.resume.loginTokens.find(stampedToken => stampedToken.hashedToken === currentHashedToken);

      if (!currentStampedToken) {
        // safety belt: this should never happen
        throw new Meteor.Error("Invalid login token");
      }

      const newStampedToken = accounts._generateStampedLoginToken();

      newStampedToken.when = currentStampedToken.when;

      accounts._insertLoginToken(this.userId, newStampedToken);

      return accounts._loginUser(this, this.userId, newStampedToken);
    }; // Removes all tokens except the token associated with the current
    // connection. Throws an error if the connection is not logged
    // in. Returns nothing on success.


    methods.removeOtherTokens = function () {
      if (!this.userId) {
        throw new Meteor.Error("You are not logged in.");
      }

      const currentToken = accounts._getLoginToken(this.connection.id);

      accounts.users.update(this.userId, {
        $pull: {
          "services.resume.loginTokens": {
            hashedToken: {
              $ne: currentToken
            }
          }
        }
      });
    }; // Allow a one-time configuration for a login service. Modifications
    // to this collection are also allowed in insecure mode.


    methods.configureLoginService = options => {
      check(options, Match.ObjectIncluding({
        service: String
      })); // Don't let random users configure a service we haven't added yet (so
      // that when we do later add it, it's set up with their configuration
      // instead of ours).
      // XXX if service configuration is oauth-specific then this code should
      //     be in accounts-oauth; if it's not then the registry should be
      //     in this package

      if (!(accounts.oauth && accounts.oauth.serviceNames().includes(options.service))) {
        throw new Meteor.Error(403, "Service unknown");
      }

      const {
        ServiceConfiguration
      } = Package['service-configuration'];
      if (ServiceConfiguration.configurations.findOne({
        service: options.service
      })) throw new Meteor.Error(403, "Service ".concat(options.service, " already configured"));
      if (hasOwn.call(options, 'secret') && usingOAuthEncryption()) options.secret = OAuthEncryption.seal(options.secret);
      ServiceConfiguration.configurations.insert(options);
    };

    accounts._server.methods(methods);
  }

  _initAccountDataHooks() {
    this._server.onConnection(connection => {
      this._accountData[connection.id] = {
        connection: connection
      };
      connection.onClose(() => {
        this._removeTokenFromConnection(connection.id);

        delete this._accountData[connection.id];
      });
    });
  }

  _initServerPublications() {
    // Bring into lexical scope for publish callbacks that need `this`
    const {
      users,
      _autopublishFields
    } = this; // Publish all login service configuration fields other than secret.

    this._server.publish("meteor.loginServiceConfiguration", () => {
      const {
        ServiceConfiguration
      } = Package['service-configuration'];
      return ServiceConfiguration.configurations.find({}, {
        fields: {
          secret: 0
        }
      });
    }, {
      is_auto: true
    }); // not techincally autopublish, but stops the warning.
    // Publish the current user's record to the client.


    this._server.publish(null, function () {
      if (this.userId) {
        return users.find({
          _id: this.userId
        }, {
          fields: {
            profile: 1,
            username: 1,
            emails: 1
          }
        });
      } else {
        return null;
      }
    },
    /*suppress autopublish warning*/
    {
      is_auto: true
    }); // Use Meteor.startup to give other packages a chance to call
    // addAutopublishFields.


    Package.autopublish && Meteor.startup(() => {
      // ['profile', 'username'] -> {profile: 1, username: 1}
      const toFieldSelector = fields => fields.reduce((prev, field) => _objectSpread({}, prev, {
        [field]: 1
      }), {});

      this._server.publish(null, function () {
        if (this.userId) {
          return users.find({
            _id: this.userId
          }, {
            fields: toFieldSelector(_autopublishFields.loggedInUser)
          });
        } else {
          return null;
        }
      },
      /*suppress autopublish warning*/
      {
        is_auto: true
      }); // XXX this publish is neither dedup-able nor is it optimized by our special
      // treatment of queries on a specific _id. Therefore this will have O(n^2)
      // run-time performance every time a user document is changed (eg someone
      // logging in). If this is a problem, we can instead write a manual publish
      // function which filters out fields based on 'this.userId'.


      this._server.publish(null, function () {
        const selector = this.userId ? {
          _id: {
            $ne: this.userId
          }
        } : {};
        return users.find(selector, {
          fields: toFieldSelector(_autopublishFields.otherUsers)
        });
      },
      /*suppress autopublish warning*/
      {
        is_auto: true
      });
    });
  }

  // Add to the list of fields or subfields to be automatically
  // published if autopublish is on. Must be called from top-level
  // code (ie, before Meteor.startup hooks run).
  //
  // @param opts {Object} with:
  //   - forLoggedInUser {Array} Array of fields published to the logged-in user
  //   - forOtherUsers {Array} Array of fields published to users that aren't logged in
  addAutopublishFields(opts) {
    this._autopublishFields.loggedInUser.push.apply(this._autopublishFields.loggedInUser, opts.forLoggedInUser);

    this._autopublishFields.otherUsers.push.apply(this._autopublishFields.otherUsers, opts.forOtherUsers);
  }

  ///
  /// ACCOUNT DATA
  ///
  // HACK: This is used by 'meteor-accounts' to get the loginToken for a
  // connection. Maybe there should be a public way to do that.
  _getAccountData(connectionId, field) {
    const data = this._accountData[connectionId];
    return data && data[field];
  }

  _setAccountData(connectionId, field, value) {
    const data = this._accountData[connectionId]; // safety belt. shouldn't happen. accountData is set in onConnection,
    // we don't have a connectionId until it is set.

    if (!data) return;
    if (value === undefined) delete data[field];else data[field] = value;
  }

  ///
  /// RECONNECT TOKENS
  ///
  /// support reconnecting using a meteor login token
  _hashLoginToken(loginToken) {
    const hash = crypto.createHash('sha256');
    hash.update(loginToken);
    return hash.digest('base64');
  }

  // {token, when} => {hashedToken, when}
  _hashStampedToken(stampedToken) {
    const {
      token
    } = stampedToken,
          hashedStampedToken = _objectWithoutProperties(stampedToken, ["token"]);

    return _objectSpread({}, hashedStampedToken, {
      hashedToken: this._hashLoginToken(token)
    });
  }

  // Using $addToSet avoids getting an index error if another client
  // logging in simultaneously has already inserted the new hashed
  // token.
  _insertHashedLoginToken(userId, hashedToken, query) {
    query = query ? _objectSpread({}, query) : {};
    query._id = userId;
    this.users.update(query, {
      $addToSet: {
        "services.resume.loginTokens": hashedToken
      }
    });
  }

  // Exported for tests.
  _insertLoginToken(userId, stampedToken, query) {
    this._insertHashedLoginToken(userId, this._hashStampedToken(stampedToken), query);
  }

  _clearAllLoginTokens(userId) {
    this.users.update(userId, {
      $set: {
        'services.resume.loginTokens': []
      }
    });
  }

  // test hook
  _getUserObserve(connectionId) {
    return this._userObservesForConnections[connectionId];
  }

  // Clean up this connection's association with the token: that is, stop
  // the observe that we started when we associated the connection with
  // this token.
  _removeTokenFromConnection(connectionId) {
    if (hasOwn.call(this._userObservesForConnections, connectionId)) {
      const observe = this._userObservesForConnections[connectionId];

      if (typeof observe === 'number') {
        // We're in the process of setting up an observe for this connection. We
        // can't clean up that observe yet, but if we delete the placeholder for
        // this connection, then the observe will get cleaned up as soon as it has
        // been set up.
        delete this._userObservesForConnections[connectionId];
      } else {
        delete this._userObservesForConnections[connectionId];
        observe.stop();
      }
    }
  }

  _getLoginToken(connectionId) {
    return this._getAccountData(connectionId, 'loginToken');
  }

  // newToken is a hashed token.
  _setLoginToken(userId, connection, newToken) {
    this._removeTokenFromConnection(connection.id);

    this._setAccountData(connection.id, 'loginToken', newToken);

    if (newToken) {
      // Set up an observe for this token. If the token goes away, we need
      // to close the connection.  We defer the observe because there's
      // no need for it to be on the critical path for login; we just need
      // to ensure that the connection will get closed at some point if
      // the token gets deleted.
      //
      // Initially, we set the observe for this connection to a number; this
      // signifies to other code (which might run while we yield) that we are in
      // the process of setting up an observe for this connection. Once the
      // observe is ready to go, we replace the number with the real observe
      // handle (unless the placeholder has been deleted or replaced by a
      // different placehold number, signifying that the connection was closed
      // already -- in this case we just clean up the observe that we started).
      const myObserveNumber = ++this._nextUserObserveNumber;
      this._userObservesForConnections[connection.id] = myObserveNumber;
      Meteor.defer(() => {
        // If something else happened on this connection in the meantime (it got
        // closed, or another call to _setLoginToken happened), just do
        // nothing. We don't need to start an observe for an old connection or old
        // token.
        if (this._userObservesForConnections[connection.id] !== myObserveNumber) {
          return;
        }

        let foundMatchingUser; // Because we upgrade unhashed login tokens to hashed tokens at
        // login time, sessions will only be logged in with a hashed
        // token. Thus we only need to observe hashed tokens here.

        const observe = this.users.find({
          _id: userId,
          'services.resume.loginTokens.hashedToken': newToken
        }, {
          fields: {
            _id: 1
          }
        }).observeChanges({
          added: () => {
            foundMatchingUser = true;
          },
          removed: connection.close // The onClose callback for the connection takes care of
          // cleaning up the observe handle and any other state we have
          // lying around.

        }); // If the user ran another login or logout command we were waiting for the
        // defer or added to fire (ie, another call to _setLoginToken occurred),
        // then we let the later one win (start an observe, etc) and just stop our
        // observe now.
        //
        // Similarly, if the connection was already closed, then the onClose
        // callback would have called _removeTokenFromConnection and there won't
        // be an entry in _userObservesForConnections. We can stop the observe.

        if (this._userObservesForConnections[connection.id] !== myObserveNumber) {
          observe.stop();
          return;
        }

        this._userObservesForConnections[connection.id] = observe;

        if (!foundMatchingUser) {
          // We've set up an observe on the user associated with `newToken`,
          // so if the new token is removed from the database, we'll close
          // the connection. But the token might have already been deleted
          // before we set up the observe, which wouldn't have closed the
          // connection because the observe wasn't running yet.
          connection.close();
        }
      });
    }
  }

  // (Also used by Meteor Accounts server and tests).
  //
  _generateStampedLoginToken() {
    return {
      token: Random.secret(),
      when: new Date()
    };
  }

  ///
  /// TOKEN EXPIRATION
  ///
  // Deletes expired password reset tokens from the database.
  //
  // Exported for tests. Also, the arguments are only used by
  // tests. oldestValidDate is simulate expiring tokens without waiting
  // for them to actually expire. userId is used by tests to only expire
  // tokens for the test user.
  _expirePasswordResetTokens(oldestValidDate, userId) {
    const tokenLifetimeMs = this._getPasswordResetTokenLifetimeMs(); // when calling from a test with extra arguments, you must specify both!


    if (oldestValidDate && !userId || !oldestValidDate && userId) {
      throw new Error("Bad test. Must specify both oldestValidDate and userId.");
    }

    oldestValidDate = oldestValidDate || new Date(new Date() - tokenLifetimeMs);
    const tokenFilter = {
      $or: [{
        "services.password.reset.reason": "reset"
      }, {
        "services.password.reset.reason": {
          $exists: false
        }
      }]
    };
    expirePasswordToken(this, oldestValidDate, tokenFilter, userId);
  } // Deletes expired password enroll tokens from the database.
  //
  // Exported for tests. Also, the arguments are only used by
  // tests. oldestValidDate is simulate expiring tokens without waiting
  // for them to actually expire. userId is used by tests to only expire
  // tokens for the test user.


  _expirePasswordEnrollTokens(oldestValidDate, userId) {
    const tokenLifetimeMs = this._getPasswordEnrollTokenLifetimeMs(); // when calling from a test with extra arguments, you must specify both!


    if (oldestValidDate && !userId || !oldestValidDate && userId) {
      throw new Error("Bad test. Must specify both oldestValidDate and userId.");
    }

    oldestValidDate = oldestValidDate || new Date(new Date() - tokenLifetimeMs);
    const tokenFilter = {
      "services.password.reset.reason": "enroll"
    };
    expirePasswordToken(this, oldestValidDate, tokenFilter, userId);
  } // Deletes expired tokens from the database and closes all open connections
  // associated with these tokens.
  //
  // Exported for tests. Also, the arguments are only used by
  // tests. oldestValidDate is simulate expiring tokens without waiting
  // for them to actually expire. userId is used by tests to only expire
  // tokens for the test user.


  _expireTokens(oldestValidDate, userId) {
    const tokenLifetimeMs = this._getTokenLifetimeMs(); // when calling from a test with extra arguments, you must specify both!


    if (oldestValidDate && !userId || !oldestValidDate && userId) {
      throw new Error("Bad test. Must specify both oldestValidDate and userId.");
    }

    oldestValidDate = oldestValidDate || new Date(new Date() - tokenLifetimeMs);
    const userFilter = userId ? {
      _id: userId
    } : {}; // Backwards compatible with older versions of meteor that stored login token
    // timestamps as numbers.

    this.users.update(_objectSpread({}, userFilter, {
      $or: [{
        "services.resume.loginTokens.when": {
          $lt: oldestValidDate
        }
      }, {
        "services.resume.loginTokens.when": {
          $lt: +oldestValidDate
        }
      }]
    }), {
      $pull: {
        "services.resume.loginTokens": {
          $or: [{
            when: {
              $lt: oldestValidDate
            }
          }, {
            when: {
              $lt: +oldestValidDate
            }
          }]
        }
      }
    }, {
      multi: true
    }); // The observe on Meteor.users will take care of closing connections for
    // expired tokens.
  }

  // @override from accounts_common.js
  config(options) {
    // Call the overridden implementation of the method.
    const superResult = AccountsCommon.prototype.config.apply(this, arguments); // If the user set loginExpirationInDays to null, then we need to clear the
    // timer that periodically expires tokens.

    if (hasOwn.call(this._options, 'loginExpirationInDays') && this._options.loginExpirationInDays === null && this.expireTokenInterval) {
      Meteor.clearInterval(this.expireTokenInterval);
      this.expireTokenInterval = null;
    }

    return superResult;
  }

  // Called by accounts-password
  insertUserDoc(options, user) {
    // - clone user document, to protect from modification
    // - add createdAt timestamp
    // - prepare an _id, so that you can modify other collections (eg
    // create a first task for every new user)
    //
    // XXX If the onCreateUser or validateNewUser hooks fail, we might
    // end up having modified some other collection
    // inappropriately. The solution is probably to have onCreateUser
    // accept two callbacks - one that gets called before inserting
    // the user document (in which you can modify its contents), and
    // one that gets called after (in which you should change other
    // collections)
    user = _objectSpread({
      createdAt: new Date(),
      _id: Random.id()
    }, user);

    if (user.services) {
      Object.keys(user.services).forEach(service => pinEncryptedFieldsToUser(user.services[service], user._id));
    }

    let fullUser;

    if (this._onCreateUserHook) {
      fullUser = this._onCreateUserHook(options, user); // This is *not* part of the API. We need this because we can't isolate
      // the global server environment between tests, meaning we can't test
      // both having a create user hook set and not having one set.

      if (fullUser === 'TEST DEFAULT HOOK') fullUser = defaultCreateUserHook(options, user);
    } else {
      fullUser = defaultCreateUserHook(options, user);
    }

    this._validateNewUserHooks.forEach(hook => {
      if (!hook(fullUser)) throw new Meteor.Error(403, "User validation failed");
    });

    let userId;

    try {
      userId = this.users.insert(fullUser);
    } catch (e) {
      // XXX string parsing sucks, maybe
      // https://jira.mongodb.org/browse/SERVER-3069 will get fixed one day
      if (!e.errmsg) throw e;
      if (e.errmsg.includes('emails.address')) throw new Meteor.Error(403, "Email already exists.");
      if (e.errmsg.includes('username')) throw new Meteor.Error(403, "Username already exists.");
      throw e;
    }

    return userId;
  }

  // Helper function: returns false if email does not match company domain from
  // the configuration.
  _testEmailDomain(email) {
    const domain = this._options.restrictCreationByEmailDomain;
    return !domain || typeof domain === 'function' && domain(email) || typeof domain === 'string' && new RegExp("@".concat(Meteor._escapeRegExp(domain), "$"), 'i').test(email);
  }

  ///
  /// CLEAN UP FOR `logoutOtherClients`
  ///
  _deleteSavedTokensForUser(userId, tokensToDelete) {
    if (tokensToDelete) {
      this.users.update(userId, {
        $unset: {
          "services.resume.haveLoginTokensToDelete": 1,
          "services.resume.loginTokensToDelete": 1
        },
        $pullAll: {
          "services.resume.loginTokens": tokensToDelete
        }
      });
    }
  }

  _deleteSavedTokensForAllUsersOnStartup() {
    // If we find users who have saved tokens to delete on startup, delete
    // them now. It's possible that the server could have crashed and come
    // back up before new tokens are found in localStorage, but this
    // shouldn't happen very often. We shouldn't put a delay here because
    // that would give a lot of power to an attacker with a stolen login
    // token and the ability to crash the server.
    Meteor.startup(() => {
      this.users.find({
        "services.resume.haveLoginTokensToDelete": true
      }, {
        "services.resume.loginTokensToDelete": 1
      }).forEach(user => {
        this._deleteSavedTokensForUser(user._id, user.services.resume.loginTokensToDelete);
      });
    });
  }

  ///
  /// MANAGING USER OBJECTS
  ///
  // Updates or creates a user after we authenticate with a 3rd party.
  //
  // @param serviceName {String} Service name (eg, twitter).
  // @param serviceData {Object} Data to store in the user's record
  //        under services[serviceName]. Must include an "id" field
  //        which is a unique identifier for the user in the service.
  // @param options {Object, optional} Other options to pass to insertUserDoc
  //        (eg, profile)
  // @returns {Object} Object with token and id keys, like the result
  //        of the "login" method.
  //
  updateOrCreateUserFromExternalService(serviceName, serviceData, options) {
    options = _objectSpread({}, options);

    if (serviceName === "password" || serviceName === "resume") {
      throw new Error("Can't use updateOrCreateUserFromExternalService with internal service " + serviceName);
    }

    if (!hasOwn.call(serviceData, 'id')) {
      throw new Error("Service data for service ".concat(serviceName, " must include id"));
    } // Look for a user with the appropriate service user id.


    const selector = {};
    const serviceIdKey = "services.".concat(serviceName, ".id"); // XXX Temporary special case for Twitter. (Issue #629)
    //   The serviceData.id will be a string representation of an integer.
    //   We want it to match either a stored string or int representation.
    //   This is to cater to earlier versions of Meteor storing twitter
    //   user IDs in number form, and recent versions storing them as strings.
    //   This can be removed once migration technology is in place, and twitter
    //   users stored with integer IDs have been migrated to string IDs.

    if (serviceName === "twitter" && !isNaN(serviceData.id)) {
      selector["$or"] = [{}, {}];
      selector["$or"][0][serviceIdKey] = serviceData.id;
      selector["$or"][1][serviceIdKey] = parseInt(serviceData.id, 10);
    } else {
      selector[serviceIdKey] = serviceData.id;
    }

    let user = this.users.findOne(selector); // When creating a new user we pass through all options. When updating an
    // existing user, by default we only process/pass through the serviceData
    // (eg, so that we keep an unexpired access token and don't cache old email
    // addresses in serviceData.email). The onExternalLogin hook can be used when
    // creating or updating a user, to modify or pass through more options as
    // needed.

    let opts = user ? {} : options;

    if (this._onExternalLoginHook) {
      opts = this._onExternalLoginHook(options, user);
    }

    if (user) {
      pinEncryptedFieldsToUser(serviceData, user._id);
      let setAttrs = {};
      Object.keys(serviceData).forEach(key => setAttrs["services.".concat(serviceName, ".").concat(key)] = serviceData[key]); // XXX Maybe we should re-use the selector above and notice if the update
      //     touches nothing?

      setAttrs = _objectSpread({}, setAttrs, {}, opts);
      this.users.update(user._id, {
        $set: setAttrs
      });
      return {
        type: serviceName,
        userId: user._id
      };
    } else {
      // Create a new user with the service data.
      user = {
        services: {}
      };
      user.services[serviceName] = serviceData;
      return {
        type: serviceName,
        userId: this.insertUserDoc(opts, user)
      };
    }
  }

  // Removes default rate limiting rule
  removeDefaultRateLimit() {
    const resp = DDPRateLimiter.removeRule(this.defaultRateLimiterRuleId);
    this.defaultRateLimiterRuleId = null;
    return resp;
  }

  // Add a default rule of limiting logins, creating new users and password reset
  // to 5 times every 10 seconds per connection.
  addDefaultRateLimit() {
    if (!this.defaultRateLimiterRuleId) {
      this.defaultRateLimiterRuleId = DDPRateLimiter.addRule({
        userId: null,
        clientAddress: null,
        type: 'method',
        name: name => ['login', 'createUser', 'resetPassword', 'forgotPassword'].includes(name),
        connectionId: connectionId => true
      }, 5, 10000);
    }
  }

}

// Give each login hook callback a fresh cloned copy of the attempt
// object, but don't clone the connection.
//
const cloneAttemptWithConnection = (connection, attempt) => {
  const clonedAttempt = EJSON.clone(attempt);
  clonedAttempt.connection = connection;
  return clonedAttempt;
};

const tryLoginMethod = (type, fn) => {
  let result;

  try {
    result = fn();
  } catch (e) {
    result = {
      error: e
    };
  }

  if (result && !result.type && type) result.type = type;
  return result;
};

const setupDefaultLoginHandlers = accounts => {
  accounts.registerLoginHandler("resume", function (options) {
    return defaultResumeLoginHandler.call(this, accounts, options);
  });
}; // Login handler for resume tokens.


const defaultResumeLoginHandler = (accounts, options) => {
  if (!options.resume) return undefined;
  check(options.resume, String);

  const hashedToken = accounts._hashLoginToken(options.resume); // First look for just the new-style hashed login token, to avoid
  // sending the unhashed token to the database in a query if we don't
  // need to.


  let user = accounts.users.findOne({
    "services.resume.loginTokens.hashedToken": hashedToken
  });

  if (!user) {
    // If we didn't find the hashed login token, try also looking for
    // the old-style unhashed token.  But we need to look for either
    // the old-style token OR the new-style token, because another
    // client connection logging in simultaneously might have already
    // converted the token.
    user = accounts.users.findOne({
      $or: [{
        "services.resume.loginTokens.hashedToken": hashedToken
      }, {
        "services.resume.loginTokens.token": options.resume
      }]
    });
  }

  if (!user) return {
    error: new Meteor.Error(403, "You've been logged out by the server. Please log in again.")
  }; // Find the token, which will either be an object with fields
  // {hashedToken, when} for a hashed token or {token, when} for an
  // unhashed token.

  let oldUnhashedStyleToken;
  let token = user.services.resume.loginTokens.find(token => token.hashedToken === hashedToken);

  if (token) {
    oldUnhashedStyleToken = false;
  } else {
    token = user.services.resume.loginTokens.find(token => token.token === options.resume);
    oldUnhashedStyleToken = true;
  }

  const tokenExpires = accounts._tokenExpiration(token.when);

  if (new Date() >= tokenExpires) return {
    userId: user._id,
    error: new Meteor.Error(403, "Your session has expired. Please log in again.")
  }; // Update to a hashed token when an unhashed token is encountered.

  if (oldUnhashedStyleToken) {
    // Only add the new hashed token if the old unhashed token still
    // exists (this avoids resurrecting the token if it was deleted
    // after we read it).  Using $addToSet avoids getting an index
    // error if another client logging in simultaneously has already
    // inserted the new hashed token.
    accounts.users.update({
      _id: user._id,
      "services.resume.loginTokens.token": options.resume
    }, {
      $addToSet: {
        "services.resume.loginTokens": {
          "hashedToken": hashedToken,
          "when": token.when
        }
      }
    }); // Remove the old token *after* adding the new, since otherwise
    // another client trying to login between our removing the old and
    // adding the new wouldn't find a token to login with.

    accounts.users.update(user._id, {
      $pull: {
        "services.resume.loginTokens": {
          "token": options.resume
        }
      }
    });
  }

  return {
    userId: user._id,
    stampedLoginToken: {
      token: options.resume,
      when: token.when
    }
  };
};

const expirePasswordToken = (accounts, oldestValidDate, tokenFilter, userId) => {
  const userFilter = userId ? {
    _id: userId
  } : {};
  const resetRangeOr = {
    $or: [{
      "services.password.reset.when": {
        $lt: oldestValidDate
      }
    }, {
      "services.password.reset.when": {
        $lt: +oldestValidDate
      }
    }]
  };
  const expireFilter = {
    $and: [tokenFilter, resetRangeOr]
  };
  accounts.users.update(_objectSpread({}, userFilter, {}, expireFilter), {
    $unset: {
      "services.password.reset": ""
    }
  }, {
    multi: true
  });
};

const setExpireTokensInterval = accounts => {
  accounts.expireTokenInterval = Meteor.setInterval(() => {
    accounts._expireTokens();

    accounts._expirePasswordResetTokens();

    accounts._expirePasswordEnrollTokens();
  }, EXPIRE_TOKENS_INTERVAL_MS);
}; ///
/// OAuth Encryption Support
///


const OAuthEncryption = Package["oauth-encryption"] && Package["oauth-encryption"].OAuthEncryption;

const usingOAuthEncryption = () => {
  return OAuthEncryption && OAuthEncryption.keyIsLoaded();
}; // OAuth service data is temporarily stored in the pending credentials
// collection during the oauth authentication process.  Sensitive data
// such as access tokens are encrypted without the user id because
// we don't know the user id yet.  We re-encrypt these fields with the
// user id included when storing the service data permanently in
// the users collection.
//


const pinEncryptedFieldsToUser = (serviceData, userId) => {
  Object.keys(serviceData).forEach(key => {
    let value = serviceData[key];
    if (OAuthEncryption && OAuthEncryption.isSealed(value)) value = OAuthEncryption.seal(OAuthEncryption.open(value), userId);
    serviceData[key] = value;
  });
}; // Encrypt unencrypted login service secrets when oauth-encryption is
// added.
//
// XXX For the oauthSecretKey to be available here at startup, the
// developer must call Accounts.config({oauthSecretKey: ...}) at load
// time, instead of in a Meteor.startup block, because the startup
// block in the app code will run after this accounts-base startup
// block.  Perhaps we need a post-startup callback?


Meteor.startup(() => {
  if (!usingOAuthEncryption()) {
    return;
  }

  const {
    ServiceConfiguration
  } = Package['service-configuration'];
  ServiceConfiguration.configurations.find({
    $and: [{
      secret: {
        $exists: true
      }
    }, {
      "secret.algorithm": {
        $exists: false
      }
    }]
  }).forEach(config => {
    ServiceConfiguration.configurations.update(config._id, {
      $set: {
        secret: OAuthEncryption.seal(config.secret)
      }
    });
  });
}); // XXX see comment on Accounts.createUser in passwords_server about adding a
// second "server options" argument.

const defaultCreateUserHook = (options, user) => {
  if (options.profile) user.profile = options.profile;
  return user;
}; // Validate new user's email or Google/Facebook/GitHub account's email


function defaultValidateNewUserHook(user) {
  const domain = this._options.restrictCreationByEmailDomain;

  if (!domain) {
    return true;
  }

  let emailIsGood = false;

  if (user.emails && user.emails.length > 0) {
    emailIsGood = user.emails.reduce((prev, email) => prev || this._testEmailDomain(email.address), false);
  } else if (user.services && Object.values(user.services).length > 0) {
    // Find any email of any service and check it
    emailIsGood = Object.values(user.services).reduce((prev, service) => service.email && this._testEmailDomain(service.email), false);
  }

  if (emailIsGood) {
    return true;
  }

  if (typeof domain === 'string') {
    throw new Meteor.Error(403, "@".concat(domain, " email required"));
  } else {
    throw new Meteor.Error(403, "Email doesn't match the criteria.");
  }
}

const setupUsersCollection = users => {
  ///
  /// RESTRICTING WRITES TO USER OBJECTS
  ///
  users.allow({
    // clients can modify the profile field of their own document, and
    // nothing else.
    update: (userId, user, fields, modifier) => {
      // make sure it is our record
      if (user._id !== userId) {
        return false;
      } // user can only modify the 'profile' field. sets to multiple
      // sub-keys (eg profile.foo and profile.bar) are merged into entry
      // in the fields list.


      if (fields.length !== 1 || fields[0] !== 'profile') {
        return false;
      }

      return true;
    },
    fetch: ['_id'] // we only look at _id.

  }); /// DEFAULT INDEXES ON USERS

  users._ensureIndex('username', {
    unique: 1,
    sparse: 1
  });

  users._ensureIndex('emails.address', {
    unique: 1,
    sparse: 1
  });

  users._ensureIndex('services.resume.loginTokens.hashedToken', {
    unique: 1,
    sparse: 1
  });

  users._ensureIndex('services.resume.loginTokens.token', {
    unique: 1,
    sparse: 1
  }); // For taking care of logoutOtherClients calls that crashed before the
  // tokens were deleted.


  users._ensureIndex('services.resume.haveLoginTokensToDelete', {
    sparse: 1
  }); // For expiring login tokens


  users._ensureIndex("services.resume.loginTokens.when", {
    sparse: 1
  }); // For expiring password tokens


  users._ensureIndex('services.password.reset.when', {
    sparse: 1
  });
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

var exports = require("/node_modules/meteor/accounts-base/server_main.js");

/* Exports */
Package._define("accounts-base", exports, {
  Accounts: Accounts
});

})();

//# sourceURL=meteor://💻app/packages/accounts-base.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvYWNjb3VudHMtYmFzZS9zZXJ2ZXJfbWFpbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvYWNjb3VudHMtYmFzZS9hY2NvdW50c19jb21tb24uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2FjY291bnRzLWJhc2UvYWNjb3VudHNfc2VydmVyLmpzIl0sIm5hbWVzIjpbIm1vZHVsZTEiLCJleHBvcnQiLCJBY2NvdW50c1NlcnZlciIsImxpbmsiLCJ2IiwiQWNjb3VudHMiLCJNZXRlb3IiLCJzZXJ2ZXIiLCJ1c2VycyIsIl9vYmplY3RTcHJlYWQiLCJtb2R1bGUiLCJkZWZhdWx0IiwiQWNjb3VudHNDb21tb24iLCJFWFBJUkVfVE9LRU5TX0lOVEVSVkFMX01TIiwiQ09OTkVDVElPTl9DTE9TRV9ERUxBWV9NUyIsImNvbnN0cnVjdG9yIiwib3B0aW9ucyIsIl9vcHRpb25zIiwiY29ubmVjdGlvbiIsInVuZGVmaW5lZCIsIl9pbml0Q29ubmVjdGlvbiIsIk1vbmdvIiwiQ29sbGVjdGlvbiIsIl9wcmV2ZW50QXV0b3B1Ymxpc2giLCJfb25Mb2dpbkhvb2siLCJIb29rIiwiYmluZEVudmlyb25tZW50IiwiZGVidWdQcmludEV4Y2VwdGlvbnMiLCJfb25Mb2dpbkZhaWx1cmVIb29rIiwiX29uTG9nb3V0SG9vayIsIkRFRkFVTFRfTE9HSU5fRVhQSVJBVElPTl9EQVlTIiwiTE9HSU5fVU5FWFBJUklOR19UT0tFTl9EQVlTIiwibGNlTmFtZSIsIkxvZ2luQ2FuY2VsbGVkRXJyb3IiLCJtYWtlRXJyb3JUeXBlIiwiZGVzY3JpcHRpb24iLCJtZXNzYWdlIiwicHJvdG90eXBlIiwibmFtZSIsIm51bWVyaWNFcnJvciIsInN0YXJ0dXAiLCJTZXJ2aWNlQ29uZmlndXJhdGlvbiIsIlBhY2thZ2UiLCJsb2dpblNlcnZpY2VDb25maWd1cmF0aW9uIiwiY29uZmlndXJhdGlvbnMiLCJDb25maWdFcnJvciIsInVzZXJJZCIsIkVycm9yIiwidXNlciIsImZpbmRPbmUiLCJjb25maWciLCJpc1NlcnZlciIsIl9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18iLCJhY2NvdW50c0NvbmZpZ0NhbGxlZCIsIl9kZWJ1ZyIsIk9iamVjdCIsImhhc093blByb3BlcnR5IiwiY2FsbCIsImlzQ2xpZW50IiwiT0F1dGhFbmNyeXB0aW9uIiwibG9hZEtleSIsIm9hdXRoU2VjcmV0S2V5IiwiVkFMSURfS0VZUyIsImtleXMiLCJmb3JFYWNoIiwia2V5IiwiaW5jbHVkZXMiLCJvbkxvZ2luIiwiZnVuYyIsInJldCIsInJlZ2lzdGVyIiwiX3N0YXJ0dXBDYWxsYmFjayIsImNhbGxiYWNrIiwib25Mb2dpbkZhaWx1cmUiLCJvbkxvZ291dCIsImRkcFVybCIsIkREUCIsImNvbm5lY3QiLCJBQ0NPVU5UU19DT05ORUNUSU9OX1VSTCIsIl9nZXRUb2tlbkxpZmV0aW1lTXMiLCJsb2dpbkV4cGlyYXRpb25JbkRheXMiLCJfZ2V0UGFzc3dvcmRSZXNldFRva2VuTGlmZXRpbWVNcyIsInBhc3N3b3JkUmVzZXRUb2tlbkV4cGlyYXRpb25JbkRheXMiLCJERUZBVUxUX1BBU1NXT1JEX1JFU0VUX1RPS0VOX0VYUElSQVRJT05fREFZUyIsIl9nZXRQYXNzd29yZEVucm9sbFRva2VuTGlmZXRpbWVNcyIsInBhc3N3b3JkRW5yb2xsVG9rZW5FeHBpcmF0aW9uSW5EYXlzIiwiREVGQVVMVF9QQVNTV09SRF9FTlJPTExfVE9LRU5fRVhQSVJBVElPTl9EQVlTIiwiX3Rva2VuRXhwaXJhdGlvbiIsIndoZW4iLCJEYXRlIiwiZ2V0VGltZSIsIl90b2tlbkV4cGlyZXNTb29uIiwibWluTGlmZXRpbWVNcyIsIm1pbkxpZmV0aW1lQ2FwTXMiLCJNSU5fVE9LRU5fTElGRVRJTUVfQ0FQX1NFQ1MiLCJfb2JqZWN0V2l0aG91dFByb3BlcnRpZXMiLCJjcnlwdG8iLCJoYXNPd24iLCJfc2VydmVyIiwiX2luaXRTZXJ2ZXJNZXRob2RzIiwiX2luaXRBY2NvdW50RGF0YUhvb2tzIiwiX2F1dG9wdWJsaXNoRmllbGRzIiwibG9nZ2VkSW5Vc2VyIiwib3RoZXJVc2VycyIsIl9pbml0U2VydmVyUHVibGljYXRpb25zIiwiX2FjY291bnREYXRhIiwiX3VzZXJPYnNlcnZlc0ZvckNvbm5lY3Rpb25zIiwiX25leHRVc2VyT2JzZXJ2ZU51bWJlciIsIl9sb2dpbkhhbmRsZXJzIiwic2V0dXBVc2Vyc0NvbGxlY3Rpb24iLCJzZXR1cERlZmF1bHRMb2dpbkhhbmRsZXJzIiwic2V0RXhwaXJlVG9rZW5zSW50ZXJ2YWwiLCJfdmFsaWRhdGVMb2dpbkhvb2siLCJfdmFsaWRhdGVOZXdVc2VySG9va3MiLCJkZWZhdWx0VmFsaWRhdGVOZXdVc2VySG9vayIsImJpbmQiLCJfZGVsZXRlU2F2ZWRUb2tlbnNGb3JBbGxVc2Vyc09uU3RhcnR1cCIsIl9za2lwQ2FzZUluc2Vuc2l0aXZlQ2hlY2tzRm9yVGVzdCIsInVybHMiLCJyZXNldFBhc3N3b3JkIiwidG9rZW4iLCJhYnNvbHV0ZVVybCIsInZlcmlmeUVtYWlsIiwiZW5yb2xsQWNjb3VudCIsImFkZERlZmF1bHRSYXRlTGltaXQiLCJjdXJyZW50SW52b2NhdGlvbiIsIl9DdXJyZW50TWV0aG9kSW52b2NhdGlvbiIsImdldCIsIl9DdXJyZW50UHVibGljYXRpb25JbnZvY2F0aW9uIiwidmFsaWRhdGVMb2dpbkF0dGVtcHQiLCJ2YWxpZGF0ZU5ld1VzZXIiLCJwdXNoIiwib25DcmVhdGVVc2VyIiwiX29uQ3JlYXRlVXNlckhvb2siLCJvbkV4dGVybmFsTG9naW4iLCJfb25FeHRlcm5hbExvZ2luSG9vayIsIl92YWxpZGF0ZUxvZ2luIiwiYXR0ZW1wdCIsImVhY2giLCJjbG9uZUF0dGVtcHRXaXRoQ29ubmVjdGlvbiIsImUiLCJhbGxvd2VkIiwiZXJyb3IiLCJfc3VjY2Vzc2Z1bExvZ2luIiwiX2ZhaWxlZExvZ2luIiwiX3N1Y2Nlc3NmdWxMb2dvdXQiLCJfbG9naW5Vc2VyIiwibWV0aG9kSW52b2NhdGlvbiIsInN0YW1wZWRMb2dpblRva2VuIiwiX2dlbmVyYXRlU3RhbXBlZExvZ2luVG9rZW4iLCJfaW5zZXJ0TG9naW5Ub2tlbiIsIl9ub1lpZWxkc0FsbG93ZWQiLCJfc2V0TG9naW5Ub2tlbiIsIl9oYXNoTG9naW5Ub2tlbiIsInNldFVzZXJJZCIsImlkIiwidG9rZW5FeHBpcmVzIiwiX2F0dGVtcHRMb2dpbiIsIm1ldGhvZE5hbWUiLCJtZXRob2RBcmdzIiwicmVzdWx0IiwidHlwZSIsIm1ldGhvZEFyZ3VtZW50cyIsIkFycmF5IiwiZnJvbSIsIl9sb2dpbk1ldGhvZCIsImZuIiwidHJ5TG9naW5NZXRob2QiLCJfcmVwb3J0TG9naW5GYWlsdXJlIiwicmVnaXN0ZXJMb2dpbkhhbmRsZXIiLCJoYW5kbGVyIiwiX3J1bkxvZ2luSGFuZGxlcnMiLCJkZXN0cm95VG9rZW4iLCJsb2dpblRva2VuIiwidXBkYXRlIiwiJHB1bGwiLCIkb3IiLCJoYXNoZWRUb2tlbiIsImFjY291bnRzIiwibWV0aG9kcyIsImxvZ2luIiwiY2hlY2siLCJhcmd1bWVudHMiLCJsb2dvdXQiLCJfZ2V0TG9naW5Ub2tlbiIsImxvZ291dE90aGVyQ2xpZW50cyIsImZpZWxkcyIsInRva2VucyIsInNlcnZpY2VzIiwicmVzdW1lIiwibG9naW5Ub2tlbnMiLCJuZXdUb2tlbiIsIiRzZXQiLCIkcHVzaCIsIl9oYXNoU3RhbXBlZFRva2VuIiwic2V0VGltZW91dCIsIl9kZWxldGVTYXZlZFRva2Vuc0ZvclVzZXIiLCJfbm9Db25uZWN0aW9uQ2xvc2VEZWxheUZvclRlc3QiLCJnZXROZXdUb2tlbiIsImN1cnJlbnRIYXNoZWRUb2tlbiIsImN1cnJlbnRTdGFtcGVkVG9rZW4iLCJmaW5kIiwic3RhbXBlZFRva2VuIiwibmV3U3RhbXBlZFRva2VuIiwicmVtb3ZlT3RoZXJUb2tlbnMiLCJjdXJyZW50VG9rZW4iLCIkbmUiLCJjb25maWd1cmVMb2dpblNlcnZpY2UiLCJNYXRjaCIsIk9iamVjdEluY2x1ZGluZyIsInNlcnZpY2UiLCJTdHJpbmciLCJvYXV0aCIsInNlcnZpY2VOYW1lcyIsInVzaW5nT0F1dGhFbmNyeXB0aW9uIiwic2VjcmV0Iiwic2VhbCIsImluc2VydCIsIm9uQ29ubmVjdGlvbiIsIm9uQ2xvc2UiLCJfcmVtb3ZlVG9rZW5Gcm9tQ29ubmVjdGlvbiIsInB1Ymxpc2giLCJpc19hdXRvIiwiX2lkIiwicHJvZmlsZSIsInVzZXJuYW1lIiwiZW1haWxzIiwiYXV0b3B1Ymxpc2giLCJ0b0ZpZWxkU2VsZWN0b3IiLCJyZWR1Y2UiLCJwcmV2IiwiZmllbGQiLCJzZWxlY3RvciIsImFkZEF1dG9wdWJsaXNoRmllbGRzIiwib3B0cyIsImFwcGx5IiwiZm9yTG9nZ2VkSW5Vc2VyIiwiZm9yT3RoZXJVc2VycyIsIl9nZXRBY2NvdW50RGF0YSIsImNvbm5lY3Rpb25JZCIsImRhdGEiLCJfc2V0QWNjb3VudERhdGEiLCJ2YWx1ZSIsImhhc2giLCJjcmVhdGVIYXNoIiwiZGlnZXN0IiwiaGFzaGVkU3RhbXBlZFRva2VuIiwiX2luc2VydEhhc2hlZExvZ2luVG9rZW4iLCJxdWVyeSIsIiRhZGRUb1NldCIsIl9jbGVhckFsbExvZ2luVG9rZW5zIiwiX2dldFVzZXJPYnNlcnZlIiwib2JzZXJ2ZSIsInN0b3AiLCJteU9ic2VydmVOdW1iZXIiLCJkZWZlciIsImZvdW5kTWF0Y2hpbmdVc2VyIiwib2JzZXJ2ZUNoYW5nZXMiLCJhZGRlZCIsInJlbW92ZWQiLCJjbG9zZSIsIlJhbmRvbSIsIl9leHBpcmVQYXNzd29yZFJlc2V0VG9rZW5zIiwib2xkZXN0VmFsaWREYXRlIiwidG9rZW5MaWZldGltZU1zIiwidG9rZW5GaWx0ZXIiLCIkZXhpc3RzIiwiZXhwaXJlUGFzc3dvcmRUb2tlbiIsIl9leHBpcmVQYXNzd29yZEVucm9sbFRva2VucyIsIl9leHBpcmVUb2tlbnMiLCJ1c2VyRmlsdGVyIiwiJGx0IiwibXVsdGkiLCJzdXBlclJlc3VsdCIsImV4cGlyZVRva2VuSW50ZXJ2YWwiLCJjbGVhckludGVydmFsIiwiaW5zZXJ0VXNlckRvYyIsImNyZWF0ZWRBdCIsInBpbkVuY3J5cHRlZEZpZWxkc1RvVXNlciIsImZ1bGxVc2VyIiwiZGVmYXVsdENyZWF0ZVVzZXJIb29rIiwiaG9vayIsImVycm1zZyIsIl90ZXN0RW1haWxEb21haW4iLCJlbWFpbCIsImRvbWFpbiIsInJlc3RyaWN0Q3JlYXRpb25CeUVtYWlsRG9tYWluIiwiUmVnRXhwIiwiX2VzY2FwZVJlZ0V4cCIsInRlc3QiLCJ0b2tlbnNUb0RlbGV0ZSIsIiR1bnNldCIsIiRwdWxsQWxsIiwibG9naW5Ub2tlbnNUb0RlbGV0ZSIsInVwZGF0ZU9yQ3JlYXRlVXNlckZyb21FeHRlcm5hbFNlcnZpY2UiLCJzZXJ2aWNlTmFtZSIsInNlcnZpY2VEYXRhIiwic2VydmljZUlkS2V5IiwiaXNOYU4iLCJwYXJzZUludCIsInNldEF0dHJzIiwicmVtb3ZlRGVmYXVsdFJhdGVMaW1pdCIsInJlc3AiLCJERFBSYXRlTGltaXRlciIsInJlbW92ZVJ1bGUiLCJkZWZhdWx0UmF0ZUxpbWl0ZXJSdWxlSWQiLCJhZGRSdWxlIiwiY2xpZW50QWRkcmVzcyIsImNsb25lZEF0dGVtcHQiLCJFSlNPTiIsImNsb25lIiwiZGVmYXVsdFJlc3VtZUxvZ2luSGFuZGxlciIsIm9sZFVuaGFzaGVkU3R5bGVUb2tlbiIsInJlc2V0UmFuZ2VPciIsImV4cGlyZUZpbHRlciIsIiRhbmQiLCJzZXRJbnRlcnZhbCIsImtleUlzTG9hZGVkIiwiaXNTZWFsZWQiLCJvcGVuIiwiZW1haWxJc0dvb2QiLCJsZW5ndGgiLCJhZGRyZXNzIiwidmFsdWVzIiwiYWxsb3ciLCJtb2RpZmllciIsImZldGNoIiwiX2Vuc3VyZUluZGV4IiwidW5pcXVlIiwic3BhcnNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBQSxTQUFPLENBQUNDLE1BQVIsQ0FBZTtBQUFDQyxrQkFBYyxFQUFDLE1BQUlBO0FBQXBCLEdBQWY7QUFBb0QsTUFBSUEsY0FBSjtBQUFtQkYsU0FBTyxDQUFDRyxJQUFSLENBQWEsc0JBQWIsRUFBb0M7QUFBQ0Qsa0JBQWMsQ0FBQ0UsQ0FBRCxF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QnZJLE1BQU0sQ0FBQyxDQUFELENBQU4sS0FBYyxTQUF6QyxFQUFvRDtBQUNsRCxlQUFPLEtBQVA7QUFDRDs7QUFFRCxhQUFPLElBQVA7QUFDRCxLQWpCUztBQWtCVjRJLFNBQUssRUFBRSxDQUFDLEtBQUQsQ0FsQkcsQ0FrQks7O0FBbEJMLEdBQVosRUFKb0MsQ0F5QnBDOztBQUNBOVQsT0FBSyxDQUFDK1QsWUFBTixDQUFtQixVQUFuQixFQUErQjtBQUFDQyxVQUFNLEVBQUUsQ0FBVDtBQUFZQyxVQUFNLEVBQUU7QUFBcEIsR0FBL0I7O0FBQ0FqVSxPQUFLLENBQUMrVCxZQUFOLENBQW1CLGdCQUFuQixFQUFxQztBQUFDQyxVQUFNLEVBQUUsQ0FBVDtBQUFZQyxVQUFNLEVBQUU7QUFBcEIsR0FBckM7O0FBQ0FqVSxPQUFLLENBQUMrVCxZQUFOLENBQW1CLHlDQUFuQixFQUNFO0FBQUNDLFVBQU0sRUFBRSxDQUFUO0FBQVlDLFVBQU0sRUFBRTtBQUFwQixHQURGOztBQUVBalUsT0FBSyxDQUFDK1QsWUFBTixDQUFtQixtQ0FBbkIsRUFDRTtBQUFDQyxVQUFNLEVBQUUsQ0FBVDtBQUFZQyxVQUFNLEVBQUU7QUFBcEIsR0FERixFQTlCb0MsQ0FnQ3BDO0FBQ0E7OztBQUNBalUsT0FBSyxDQUFDK1QsWUFBTixDQUFtQix5Q0FBbkIsRUFDRTtBQUFFRSxVQUFNLEVBQUU7QUFBVixHQURGLEVBbENvQyxDQW9DcEM7OztBQUNBalUsT0FBSyxDQUFDK1QsWUFBTixDQUFtQixrQ0FBbkIsRUFBdUQ7QUFBRUUsVUFBTSxFQUFFO0FBQVYsR0FBdkQsRUFyQ29DLENBc0NwQzs7O0FBQ0FqVSxPQUFLLENBQUMrVCxZQUFOLENBQW1CLDhCQUFuQixFQUFtRDtBQUFFRSxVQUFNLEVBQUU7QUFBVixHQUFuRDtBQUNELENBeENELEMiLCJmaWxlIjoiL3BhY2thZ2VzL2FjY291bnRzLWJhc2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBY2NvdW50c1NlcnZlciB9IGZyb20gXCIuL2FjY291bnRzX3NlcnZlci5qc1wiO1xuXG4vKipcbiAqIEBuYW1lc3BhY2UgQWNjb3VudHNcbiAqIEBzdW1tYXJ5IFRoZSBuYW1lc3BhY2UgZm9yIGFsbCBzZXJ2ZXItc2lkZSBhY2NvdW50cy1yZWxhdGVkIG1ldGhvZHMuXG4gKi9cbkFjY291bnRzID0gbmV3IEFjY291bnRzU2VydmVyKE1ldGVvci5zZXJ2ZXIpO1xuXG4vLyBVc2VycyB0YWJsZS4gRG9uJ3QgdXNlIHRoZSBub3JtYWwgYXV0b3B1Ymxpc2gsIHNpbmNlIHdlIHdhbnQgdG8gaGlkZVxuLy8gc29tZSBmaWVsZHMuIENvZGUgdG8gYXV0b3B1Ymxpc2ggdGhpcyBpcyBpbiBhY2NvdW50c19zZXJ2ZXIuanMuXG4vLyBYWFggQWxsb3cgdXNlcnMgdG8gY29uZmlndXJlIHRoaXMgY29sbGVjdGlvbiBuYW1lLlxuXG4vKipcbiAqIEBzdW1tYXJ5IEEgW01vbmdvLkNvbGxlY3Rpb25dKCNjb2xsZWN0aW9ucykgY29udGFpbmluZyB1c2VyIGRvY3VtZW50cy5cbiAqIEBsb2N1cyBBbnl3aGVyZVxuICogQHR5cGUge01vbmdvLkNvbGxlY3Rpb259XG4gKiBAaW1wb3J0RnJvbVBhY2thZ2UgbWV0ZW9yXG4qL1xuTWV0ZW9yLnVzZXJzID0gQWNjb3VudHMudXNlcnM7XG5cbmV4cG9ydCB7XG4gIC8vIFNpbmNlIHRoaXMgZmlsZSBpcyB0aGUgbWFpbiBtb2R1bGUgZm9yIHRoZSBzZXJ2ZXIgdmVyc2lvbiBvZiB0aGVcbiAgLy8gYWNjb3VudHMtYmFzZSBwYWNrYWdlLCBwcm9wZXJ0aWVzIG9mIG5vbi1lbnRyeS1wb2ludCBtb2R1bGVzIG5lZWQgdG9cbiAgLy8gYmUgcmUtZXhwb3J0ZWQgaW4gb3JkZXIgdG8gYmUgYWNjZXNzaWJsZSB0byBtb2R1bGVzIHRoYXQgaW1wb3J0IHRoZVxuICAvLyBhY2NvdW50cy1iYXNlIHBhY2thZ2UuXG4gIEFjY291bnRzU2VydmVyXG59O1xuIiwiLyoqXG4gKiBAc3VtbWFyeSBTdXBlci1jb25zdHJ1Y3RvciBmb3IgQWNjb3VudHNDbGllbnQgYW5kIEFjY291bnRzU2VydmVyLlxuICogQGxvY3VzIEFueXdoZXJlXG4gKiBAY2xhc3MgQWNjb3VudHNDb21tb25cbiAqIEBpbnN0YW5jZW5hbWUgYWNjb3VudHNDbGllbnRPclNlcnZlclxuICogQHBhcmFtIG9wdGlvbnMge09iamVjdH0gYW4gb2JqZWN0IHdpdGggZmllbGRzOlxuICogLSBjb25uZWN0aW9uIHtPYmplY3R9IE9wdGlvbmFsIEREUCBjb25uZWN0aW9uIHRvIHJldXNlLlxuICogLSBkZHBVcmwge1N0cmluZ30gT3B0aW9uYWwgVVJMIGZvciBjcmVhdGluZyBhIG5ldyBERFAgY29ubmVjdGlvbi5cbiAqL1xuZXhwb3J0IGNsYXNzIEFjY291bnRzQ29tbW9uIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIC8vIEN1cnJlbnRseSB0aGlzIGlzIHJlYWQgZGlyZWN0bHkgYnkgcGFja2FnZXMgbGlrZSBhY2NvdW50cy1wYXNzd29yZFxuICAgIC8vIGFuZCBhY2NvdW50cy11aS11bnN0eWxlZC5cbiAgICB0aGlzLl9vcHRpb25zID0ge307XG5cbiAgICAvLyBOb3RlIHRoYXQgc2V0dGluZyB0aGlzLmNvbm5lY3Rpb24gPSBudWxsIGNhdXNlcyB0aGlzLnVzZXJzIHRvIGJlIGFcbiAgICAvLyBMb2NhbENvbGxlY3Rpb24sIHdoaWNoIGlzIG5vdCB3aGF0IHdlIHdhbnQuXG4gICAgdGhpcy5jb25uZWN0aW9uID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuX2luaXRDb25uZWN0aW9uKG9wdGlvbnMgfHwge30pO1xuXG4gICAgLy8gVGhlcmUgaXMgYW4gYWxsb3cgY2FsbCBpbiBhY2NvdW50c19zZXJ2ZXIuanMgdGhhdCByZXN0cmljdHMgd3JpdGVzIHRvXG4gICAgLy8gdGhpcyBjb2xsZWN0aW9uLlxuICAgIHRoaXMudXNlcnMgPSBuZXcgTW9uZ28uQ29sbGVjdGlvbihcInVzZXJzXCIsIHtcbiAgICAgIF9wcmV2ZW50QXV0b3B1Ymxpc2g6IHRydWUsXG4gICAgICBjb25uZWN0aW9uOiB0aGlzLmNvbm5lY3Rpb25cbiAgICB9KTtcblxuICAgIC8vIENhbGxiYWNrIGV4Y2VwdGlvbnMgYXJlIHByaW50ZWQgd2l0aCBNZXRlb3IuX2RlYnVnIGFuZCBpZ25vcmVkLlxuICAgIHRoaXMuX29uTG9naW5Ib29rID0gbmV3IEhvb2soe1xuICAgICAgYmluZEVudmlyb25tZW50OiBmYWxzZSxcbiAgICAgIGRlYnVnUHJpbnRFeGNlcHRpb25zOiBcIm9uTG9naW4gY2FsbGJhY2tcIlxuICAgIH0pO1xuXG4gICAgdGhpcy5fb25Mb2dpbkZhaWx1cmVIb29rID0gbmV3IEhvb2soe1xuICAgICAgYmluZEVudmlyb25tZW50OiBmYWxzZSxcbiAgICAgIGRlYnVnUHJpbnRFeGNlcHRpb25zOiBcIm9uTG9naW5GYWlsdXJlIGNhbGxiYWNrXCJcbiAgICB9KTtcblxuICAgIHRoaXMuX29uTG9nb3V0SG9vayA9IG5ldyBIb29rKHtcbiAgICAgIGJpbmRFbnZpcm9ubWVudDogZmFsc2UsXG4gICAgICBkZWJ1Z1ByaW50RXhjZXB0aW9uczogXCJvbkxvZ291dCBjYWxsYmFja1wiXG4gICAgfSk7XG5cbiAgICAvLyBFeHBvc2UgZm9yIHRlc3RpbmcuXG4gICAgdGhpcy5ERUZBVUxUX0xPR0lOX0VYUElSQVRJT05fREFZUyA9IERFRkFVTFRfTE9HSU5fRVhQSVJBVElPTl9EQVlTO1xuICAgIHRoaXMuTE9HSU5fVU5FWFBJUklOR19UT0tFTl9EQVlTID0gTE9HSU5fVU5FWFBJUklOR19UT0tFTl9EQVlTO1xuXG4gICAgLy8gVGhyb3duIHdoZW4gdGhlIHVzZXIgY2FuY2VscyB0aGUgbG9naW4gcHJvY2VzcyAoZWcsIGNsb3NlcyBhbiBvYXV0aFxuICAgIC8vIHBvcHVwLCBkZWNsaW5lcyByZXRpbmEgc2NhbiwgZXRjKVxuICAgIGNvbnN0IGxjZU5hbWUgPSAnQWNjb3VudHMuTG9naW5DYW5jZWxsZWRFcnJvcic7XG4gICAgdGhpcy5Mb2dpbkNhbmNlbGxlZEVycm9yID0gTWV0ZW9yLm1ha2VFcnJvclR5cGUoXG4gICAgICBsY2VOYW1lLFxuICAgICAgZnVuY3Rpb24gKGRlc2NyaXB0aW9uKSB7XG4gICAgICAgIHRoaXMubWVzc2FnZSA9IGRlc2NyaXB0aW9uO1xuICAgICAgfVxuICAgICk7XG4gICAgdGhpcy5Mb2dpbkNhbmNlbGxlZEVycm9yLnByb3RvdHlwZS5uYW1lID0gbGNlTmFtZTtcblxuICAgIC8vIFRoaXMgaXMgdXNlZCB0byB0cmFuc21pdCBzcGVjaWZpYyBzdWJjbGFzcyBlcnJvcnMgb3ZlciB0aGUgd2lyZS4gV2VcbiAgICAvLyBzaG91bGQgY29tZSB1cCB3aXRoIGEgbW9yZSBnZW5lcmljIHdheSB0byBkbyB0aGlzIChlZywgd2l0aCBzb21lIHNvcnQgb2ZcbiAgICAvLyBzeW1ib2xpYyBlcnJvciBjb2RlIHJhdGhlciB0aGFuIGEgbnVtYmVyKS5cbiAgICB0aGlzLkxvZ2luQ2FuY2VsbGVkRXJyb3IubnVtZXJpY0Vycm9yID0gMHg4YWNkYzJmO1xuXG4gICAgLy8gbG9naW5TZXJ2aWNlQ29uZmlndXJhdGlvbiBhbmQgQ29uZmlnRXJyb3IgYXJlIG1haW50YWluZWQgZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5XG4gICAgTWV0ZW9yLnN0YXJ0dXAoKCkgPT4ge1xuICAgICAgY29uc3QgeyBTZXJ2aWNlQ29uZmlndXJhdGlvbiB9ID0gUGFja2FnZVsnc2VydmljZS1jb25maWd1cmF0aW9uJ107XG4gICAgICB0aGlzLmxvZ2luU2VydmljZUNvbmZpZ3VyYXRpb24gPSBTZXJ2aWNlQ29uZmlndXJhdGlvbi5jb25maWd1cmF0aW9ucztcbiAgICAgIHRoaXMuQ29uZmlnRXJyb3IgPSBTZXJ2aWNlQ29uZmlndXJhdGlvbi5Db25maWdFcnJvcjtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAc3VtbWFyeSBHZXQgdGhlIGN1cnJlbnQgdXNlciBpZCwgb3IgYG51bGxgIGlmIG5vIHVzZXIgaXMgbG9nZ2VkIGluLiBBIHJlYWN0aXZlIGRhdGEgc291cmNlLlxuICAgKiBAbG9jdXMgQW55d2hlcmVcbiAgICovXG4gIHVzZXJJZCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJ1c2VySWQgbWV0aG9kIG5vdCBpbXBsZW1lbnRlZFwiKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAc3VtbWFyeSBHZXQgdGhlIGN1cnJlbnQgdXNlciByZWNvcmQsIG9yIGBudWxsYCBpZiBubyB1c2VyIGlzIGxvZ2dlZCBpbi4gQSByZWFjdGl2ZSBkYXRhIHNvdXJjZS5cbiAgICogQGxvY3VzIEFueXdoZXJlXG4gICAqL1xuICB1c2VyKCkge1xuICAgIGNvbnN0IHVzZXJJZCA9IHRoaXMudXNlcklkKCk7XG4gICAgcmV0dXJuIHVzZXJJZCA/IHRoaXMudXNlcnMuZmluZE9uZSh1c2VySWQpIDogbnVsbDtcbiAgfVxuXG4gIC8vIFNldCB1cCBjb25maWcgZm9yIHRoZSBhY2NvdW50cyBzeXN0ZW0uIENhbGwgdGhpcyBvbiBib3RoIHRoZSBjbGllbnRcbiAgLy8gYW5kIHRoZSBzZXJ2ZXIuXG4gIC8vXG4gIC8vIE5vdGUgdGhhdCB0aGlzIG1ldGhvZCBnZXRzIG92ZXJyaWRkZW4gb24gQWNjb3VudHNTZXJ2ZXIucHJvdG90eXBlLCBidXRcbiAgLy8gdGhlIG92ZXJyaWRpbmcgbWV0aG9kIGNhbGxzIHRoZSBvdmVycmlkZGVuIG1ldGhvZC5cbiAgLy9cbiAgLy8gWFhYIHdlIHNob3VsZCBhZGQgc29tZSBlbmZvcmNlbWVudCB0aGF0IHRoaXMgaXMgY2FsbGVkIG9uIGJvdGggdGhlXG4gIC8vIGNsaWVudCBhbmQgdGhlIHNlcnZlci4gT3RoZXJ3aXNlLCBhIHVzZXIgY2FuXG4gIC8vICdmb3JiaWRDbGllbnRBY2NvdW50Q3JlYXRpb24nIG9ubHkgb24gdGhlIGNsaWVudCBhbmQgd2hpbGUgaXQgbG9va3NcbiAgLy8gbGlrZSB0aGVpciBhcHAgaXMgc2VjdXJlLCB0aGUgc2VydmVyIHdpbGwgc3RpbGwgYWNjZXB0IGNyZWF0ZVVzZXJcbiAgLy8gY2FsbHMuIGh0dHBzOi8vZ2l0aHViLmNvbS9tZXRlb3IvbWV0ZW9yL2lzc3Vlcy84MjhcbiAgLy9cbiAgLy8gQHBhcmFtIG9wdGlvbnMge09iamVjdH0gYW4gb2JqZWN0IHdpdGggZmllbGRzOlxuICAvLyAtIHNlbmRWZXJpZmljYXRpb25FbWFpbCB7Qm9vbGVhbn1cbiAgLy8gICAgIFNlbmQgZW1haWwgYWRkcmVzcyB2ZXJpZmljYXRpb24gZW1haWxzIHRvIG5ldyB1c2VycyBjcmVhdGVkIGZyb21cbiAgLy8gICAgIGNsaWVudCBzaWdudXBzLlxuICAvLyAtIGZvcmJpZENsaWVudEFjY291bnRDcmVhdGlvbiB7Qm9vbGVhbn1cbiAgLy8gICAgIERvIG5vdCBhbGxvdyBjbGllbnRzIHRvIGNyZWF0ZSBhY2NvdW50cyBkaXJlY3RseS5cbiAgLy8gLSByZXN0cmljdENyZWF0aW9uQnlFbWFpbERvbWFpbiB7RnVuY3Rpb24gb3IgU3RyaW5nfVxuICAvLyAgICAgUmVxdWlyZSBjcmVhdGVkIHVzZXJzIHRvIGhhdmUgYW4gZW1haWwgbWF0Y2hpbmcgdGhlIGZ1bmN0aW9uIG9yXG4gIC8vICAgICBoYXZpbmcgdGhlIHN0cmluZyBhcyBkb21haW4uXG4gIC8vIC0gbG9naW5FeHBpcmF0aW9uSW5EYXlzIHtOdW1iZXJ9XG4gIC8vICAgICBOdW1iZXIgb2YgZGF5cyBzaW5jZSBsb2dpbiB1bnRpbCBhIHVzZXIgaXMgbG9nZ2VkIG91dCAobG9naW4gdG9rZW5cbiAgLy8gICAgIGV4cGlyZXMpLlxuICAvLyAtIHBhc3N3b3JkUmVzZXRUb2tlbkV4cGlyYXRpb25JbkRheXMge051bWJlcn1cbiAgLy8gICAgIE51bWJlciBvZiBkYXlzIHNpbmNlIHBhc3N3b3JkIHJlc2V0IHRva2VuIGNyZWF0aW9uIHVudGlsIHRoZVxuICAvLyAgICAgdG9rZW4gY2FubnQgYmUgdXNlZCBhbnkgbG9uZ2VyIChwYXNzd29yZCByZXNldCB0b2tlbiBleHBpcmVzKS5cbiAgLy8gLSBhbWJpZ3VvdXNFcnJvck1lc3NhZ2VzIHtCb29sZWFufVxuICAvLyAgICAgUmV0dXJuIGFtYmlndW91cyBlcnJvciBtZXNzYWdlcyBmcm9tIGxvZ2luIGZhaWx1cmVzIHRvIHByZXZlbnRcbiAgLy8gICAgIHVzZXIgZW51bWVyYXRpb24uXG4gIC8vIC0gYmNyeXB0Um91bmRzIHtOdW1iZXJ9XG4gIC8vICAgICBBbGxvd3Mgb3ZlcnJpZGUgb2YgbnVtYmVyIG9mIGJjcnlwdCByb3VuZHMgKGFrYSB3b3JrIGZhY3RvcikgdXNlZFxuICAvLyAgICAgdG8gc3RvcmUgcGFzc3dvcmRzLlxuXG4gIC8qKlxuICAgKiBAc3VtbWFyeSBTZXQgZ2xvYmFsIGFjY291bnRzIG9wdGlvbnMuXG4gICAqIEBsb2N1cyBBbnl3aGVyZVxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgKiBAcGFyYW0ge0Jvb2xlYW59IG9wdGlvbnMuc2VuZFZlcmlmaWNhdGlvbkVtYWlsIE5ldyB1c2VycyB3aXRoIGFuIGVtYWlsIGFkZHJlc3Mgd2lsbCByZWNlaXZlIGFuIGFkZHJlc3MgdmVyaWZpY2F0aW9uIGVtYWlsLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IG9wdGlvbnMuZm9yYmlkQ2xpZW50QWNjb3VudENyZWF0aW9uIENhbGxzIHRvIFtgY3JlYXRlVXNlcmBdKCNhY2NvdW50c19jcmVhdGV1c2VyKSBmcm9tIHRoZSBjbGllbnQgd2lsbCBiZSByZWplY3RlZC4gSW4gYWRkaXRpb24sIGlmIHlvdSBhcmUgdXNpbmcgW2FjY291bnRzLXVpXSgjYWNjb3VudHN1aSksIHRoZSBcIkNyZWF0ZSBhY2NvdW50XCIgbGluayB3aWxsIG5vdCBiZSBhdmFpbGFibGUuXG4gICAqIEBwYXJhbSB7U3RyaW5nIHwgRnVuY3Rpb259IG9wdGlvbnMucmVzdHJpY3RDcmVhdGlvbkJ5RW1haWxEb21haW4gSWYgc2V0IHRvIGEgc3RyaW5nLCBvbmx5IGFsbG93cyBuZXcgdXNlcnMgaWYgdGhlIGRvbWFpbiBwYXJ0IG9mIHRoZWlyIGVtYWlsIGFkZHJlc3MgbWF0Y2hlcyB0aGUgc3RyaW5nLiBJZiBzZXQgdG8gYSBmdW5jdGlvbiwgb25seSBhbGxvd3MgbmV3IHVzZXJzIGlmIHRoZSBmdW5jdGlvbiByZXR1cm5zIHRydWUuICBUaGUgZnVuY3Rpb24gaXMgcGFzc2VkIHRoZSBmdWxsIGVtYWlsIGFkZHJlc3Mgb2YgdGhlIHByb3Bvc2VkIG5ldyB1c2VyLiAgV29ya3Mgd2l0aCBwYXNzd29yZC1iYXNlZCBzaWduLWluIGFuZCBleHRlcm5hbCBzZXJ2aWNlcyB0aGF0IGV4cG9zZSBlbWFpbCBhZGRyZXNzZXMgKEdvb2dsZSwgRmFjZWJvb2ssIEdpdEh1YikuIEFsbCBleGlzdGluZyB1c2VycyBzdGlsbCBjYW4gbG9nIGluIGFmdGVyIGVuYWJsaW5nIHRoaXMgb3B0aW9uLiBFeGFtcGxlOiBgQWNjb3VudHMuY29uZmlnKHsgcmVzdHJpY3RDcmVhdGlvbkJ5RW1haWxEb21haW46ICdzY2hvb2wuZWR1JyB9KWAuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBvcHRpb25zLmxvZ2luRXhwaXJhdGlvbkluRGF5cyBUaGUgbnVtYmVyIG9mIGRheXMgZnJvbSB3aGVuIGEgdXNlciBsb2dzIGluIHVudGlsIHRoZWlyIHRva2VuIGV4cGlyZXMgYW5kIHRoZXkgYXJlIGxvZ2dlZCBvdXQuIERlZmF1bHRzIHRvIDkwLiBTZXQgdG8gYG51bGxgIHRvIGRpc2FibGUgbG9naW4gZXhwaXJhdGlvbi5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMub2F1dGhTZWNyZXRLZXkgV2hlbiB1c2luZyB0aGUgYG9hdXRoLWVuY3J5cHRpb25gIHBhY2thZ2UsIHRoZSAxNiBieXRlIGtleSB1c2luZyB0byBlbmNyeXB0IHNlbnNpdGl2ZSBhY2NvdW50IGNyZWRlbnRpYWxzIGluIHRoZSBkYXRhYmFzZSwgZW5jb2RlZCBpbiBiYXNlNjQuICBUaGlzIG9wdGlvbiBtYXkgb25seSBiZSBzcGVjaWZlZCBvbiB0aGUgc2VydmVyLiAgU2VlIHBhY2thZ2VzL29hdXRoLWVuY3J5cHRpb24vUkVBRE1FLm1kIGZvciBkZXRhaWxzLlxuICAgKiBAcGFyYW0ge051bWJlcn0gb3B0aW9ucy5wYXNzd29yZFJlc2V0VG9rZW5FeHBpcmF0aW9uSW5EYXlzIFRoZSBudW1iZXIgb2YgZGF5cyBmcm9tIHdoZW4gYSBsaW5rIHRvIHJlc2V0IHBhc3N3b3JkIGlzIHNlbnQgdW50aWwgdG9rZW4gZXhwaXJlcyBhbmQgdXNlciBjYW4ndCByZXNldCBwYXNzd29yZCB3aXRoIHRoZSBsaW5rIGFueW1vcmUuIERlZmF1bHRzIHRvIDMuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBvcHRpb25zLnBhc3N3b3JkRW5yb2xsVG9rZW5FeHBpcmF0aW9uSW5EYXlzIFRoZSBudW1iZXIgb2YgZGF5cyBmcm9tIHdoZW4gYSBsaW5rIHRvIHNldCBpbml0YWwgcGFzc3dvcmQgaXMgc2VudCB1bnRpbCB0b2tlbiBleHBpcmVzIGFuZCB1c2VyIGNhbid0IHNldCBwYXNzd29yZCB3aXRoIHRoZSBsaW5rIGFueW1vcmUuIERlZmF1bHRzIHRvIDMwLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IG9wdGlvbnMuYW1iaWd1b3VzRXJyb3JNZXNzYWdlcyBSZXR1cm4gYW1iaWd1b3VzIGVycm9yIG1lc3NhZ2VzIGZyb20gbG9naW4gZmFpbHVyZXMgdG8gcHJldmVudCB1c2VyIGVudW1lcmF0aW9uLiBEZWZhdWx0cyB0byBmYWxzZS5cbiAgICovXG4gIGNvbmZpZyhvcHRpb25zKSB7XG4gICAgLy8gV2UgZG9uJ3Qgd2FudCB1c2VycyB0byBhY2NpZGVudGFsbHkgb25seSBjYWxsIEFjY291bnRzLmNvbmZpZyBvbiB0aGVcbiAgICAvLyBjbGllbnQsIHdoZXJlIHNvbWUgb2YgdGhlIG9wdGlvbnMgd2lsbCBoYXZlIHBhcnRpYWwgZWZmZWN0cyAoZWcgcmVtb3ZpbmdcbiAgICAvLyB0aGUgXCJjcmVhdGUgYWNjb3VudFwiIGJ1dHRvbiBmcm9tIGFjY291bnRzLXVpIGlmIGZvcmJpZENsaWVudEFjY291bnRDcmVhdGlvblxuICAgIC8vIGlzIHNldCwgb3IgcmVkaXJlY3RpbmcgR29vZ2xlIGxvZ2luIHRvIGEgc3BlY2lmaWMtZG9tYWluIHBhZ2UpIHdpdGhvdXRcbiAgICAvLyBoYXZpbmcgdGhlaXIgZnVsbCBlZmZlY3RzLlxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIF9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18uYWNjb3VudHNDb25maWdDYWxsZWQgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAoIV9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18uYWNjb3VudHNDb25maWdDYWxsZWQpIHtcbiAgICAgIC8vIFhYWCB3b3VsZCBiZSBuaWNlIHRvIFwiY3Jhc2hcIiB0aGUgY2xpZW50IGFuZCByZXBsYWNlIHRoZSBVSSB3aXRoIGFuIGVycm9yXG4gICAgICAvLyBtZXNzYWdlLCBidXQgdGhlcmUncyBubyB0cml2aWFsIHdheSB0byBkbyB0aGlzLlxuICAgICAgTWV0ZW9yLl9kZWJ1ZyhcIkFjY291bnRzLmNvbmZpZyB3YXMgY2FsbGVkIG9uIHRoZSBjbGllbnQgYnV0IG5vdCBvbiB0aGUgXCIgK1xuICAgICAgICAgICAgICAgICAgICBcInNlcnZlcjsgc29tZSBjb25maWd1cmF0aW9uIG9wdGlvbnMgbWF5IG5vdCB0YWtlIGVmZmVjdC5cIik7XG4gICAgfVxuXG4gICAgLy8gV2UgbmVlZCB0byB2YWxpZGF0ZSB0aGUgb2F1dGhTZWNyZXRLZXkgb3B0aW9uIGF0IHRoZSB0aW1lXG4gICAgLy8gQWNjb3VudHMuY29uZmlnIGlzIGNhbGxlZC4gV2UgYWxzbyBkZWxpYmVyYXRlbHkgZG9uJ3Qgc3RvcmUgdGhlXG4gICAgLy8gb2F1dGhTZWNyZXRLZXkgaW4gQWNjb3VudHMuX29wdGlvbnMuXG4gICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvcHRpb25zLCAnb2F1dGhTZWNyZXRLZXknKSkge1xuICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgb2F1dGhTZWNyZXRLZXkgb3B0aW9uIG1heSBvbmx5IGJlIHNwZWNpZmllZCBvbiB0aGUgc2VydmVyXCIpO1xuICAgICAgfVxuICAgICAgaWYgKCEgUGFja2FnZVtcIm9hdXRoLWVuY3J5cHRpb25cIl0pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIG9hdXRoLWVuY3J5cHRpb24gcGFja2FnZSBtdXN0IGJlIGxvYWRlZCB0byBzZXQgb2F1dGhTZWNyZXRLZXlcIik7XG4gICAgICB9XG4gICAgICBQYWNrYWdlW1wib2F1dGgtZW5jcnlwdGlvblwiXS5PQXV0aEVuY3J5cHRpb24ubG9hZEtleShvcHRpb25zLm9hdXRoU2VjcmV0S2V5KTtcbiAgICAgIG9wdGlvbnMgPSB7IC4uLm9wdGlvbnMgfTtcbiAgICAgIGRlbGV0ZSBvcHRpb25zLm9hdXRoU2VjcmV0S2V5O1xuICAgIH1cblxuICAgIC8vIHZhbGlkYXRlIG9wdGlvbiBrZXlzXG4gICAgY29uc3QgVkFMSURfS0VZUyA9IFtcInNlbmRWZXJpZmljYXRpb25FbWFpbFwiLCBcImZvcmJpZENsaWVudEFjY291bnRDcmVhdGlvblwiLCBcInBhc3N3b3JkRW5yb2xsVG9rZW5FeHBpcmF0aW9uSW5EYXlzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgXCJyZXN0cmljdENyZWF0aW9uQnlFbWFpbERvbWFpblwiLCBcImxvZ2luRXhwaXJhdGlvbkluRGF5c1wiLCBcInBhc3N3b3JkUmVzZXRUb2tlbkV4cGlyYXRpb25JbkRheXNcIixcbiAgICAgICAgICAgICAgICAgICAgICBcImFtYmlndW91c0Vycm9yTWVzc2FnZXNcIiwgXCJiY3J5cHRSb3VuZHNcIl07XG4gICAgT2JqZWN0LmtleXMob3B0aW9ucykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgaWYgKCFWQUxJRF9LRVlTLmluY2x1ZGVzKGtleSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBY2NvdW50cy5jb25maWc6IEludmFsaWQga2V5OiAke2tleX1gKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIHNldCB2YWx1ZXMgaW4gQWNjb3VudHMuX29wdGlvbnNcbiAgICBWQUxJRF9LRVlTLmZvckVhY2goa2V5ID0+IHtcbiAgICAgIGlmIChrZXkgaW4gb3B0aW9ucykge1xuICAgICAgICBpZiAoa2V5IGluIHRoaXMuX29wdGlvbnMpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbid0IHNldCBcXGAke2tleX1cXGAgbW9yZSB0aGFuIG9uY2VgKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9vcHRpb25zW2tleV0gPSBvcHRpb25zW2tleV07XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQHN1bW1hcnkgUmVnaXN0ZXIgYSBjYWxsYmFjayB0byBiZSBjYWxsZWQgYWZ0ZXIgYSBsb2dpbiBhdHRlbXB0IHN1Y2NlZWRzLlxuICAgKiBAbG9jdXMgQW55d2hlcmVcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgY2FsbGJhY2sgdG8gYmUgY2FsbGVkIHdoZW4gbG9naW4gaXMgc3VjY2Vzc2Z1bC5cbiAgICogICAgICAgICAgICAgICAgICAgICAgICBUaGUgY2FsbGJhY2sgcmVjZWl2ZXMgYSBzaW5nbGUgb2JqZWN0IHRoYXRcbiAgICogICAgICAgICAgICAgICAgICAgICAgICBob2xkcyBsb2dpbiBkZXRhaWxzLiBUaGlzIG9iamVjdCBjb250YWlucyB0aGUgbG9naW5cbiAgICogICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgdHlwZSAocGFzc3dvcmQsIHJlc3VtZSwgZXRjLikgb24gYm90aCB0aGVcbiAgICogICAgICAgICAgICAgICAgICAgICAgICBjbGllbnQgYW5kIHNlcnZlci4gYG9uTG9naW5gIGNhbGxiYWNrcyByZWdpc3RlcmVkXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgb24gdGhlIHNlcnZlciBhbHNvIHJlY2VpdmUgZXh0cmEgZGF0YSwgc3VjaFxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgIGFzIHVzZXIgZGV0YWlscywgY29ubmVjdGlvbiBpbmZvcm1hdGlvbiwgZXRjLlxuICAgKi9cbiAgb25Mb2dpbihmdW5jKSB7XG4gICAgbGV0IHJldCA9IHRoaXMuX29uTG9naW5Ib29rLnJlZ2lzdGVyKGZ1bmMpO1xuICAgIC8vIGNhbGwgdGhlIGp1c3QgcmVnaXN0ZXJlZCBjYWxsYmFjayBpZiBhbHJlYWR5IGxvZ2dlZCBpblxuICAgIHRoaXMuX3N0YXJ0dXBDYWxsYmFjayhyZXQuY2FsbGJhY2spO1xuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICAvKipcbiAgICogQHN1bW1hcnkgUmVnaXN0ZXIgYSBjYWxsYmFjayB0byBiZSBjYWxsZWQgYWZ0ZXIgYSBsb2dpbiBhdHRlbXB0IGZhaWxzLlxuICAgKiBAbG9jdXMgQW55d2hlcmVcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgY2FsbGJhY2sgdG8gYmUgY2FsbGVkIGFmdGVyIHRoZSBsb2dpbiBoYXMgZmFpbGVkLlxuICAgKi9cbiAgb25Mb2dpbkZhaWx1cmUoZnVuYykge1xuICAgIHJldHVybiB0aGlzLl9vbkxvZ2luRmFpbHVyZUhvb2sucmVnaXN0ZXIoZnVuYyk7XG4gIH1cblxuICAvKipcbiAgICogQHN1bW1hcnkgUmVnaXN0ZXIgYSBjYWxsYmFjayB0byBiZSBjYWxsZWQgYWZ0ZXIgYSBsb2dvdXQgYXR0ZW1wdCBzdWNjZWVkcy5cbiAgICogQGxvY3VzIEFueXdoZXJlXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGNhbGxiYWNrIHRvIGJlIGNhbGxlZCB3aGVuIGxvZ291dCBpcyBzdWNjZXNzZnVsLlxuICAgKi9cbiAgb25Mb2dvdXQoZnVuYykge1xuICAgIHJldHVybiB0aGlzLl9vbkxvZ291dEhvb2sucmVnaXN0ZXIoZnVuYyk7XG4gIH1cblxuICBfaW5pdENvbm5lY3Rpb24ob3B0aW9ucykge1xuICAgIGlmICghIE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFRoZSBjb25uZWN0aW9uIHVzZWQgYnkgdGhlIEFjY291bnRzIHN5c3RlbS4gVGhpcyBpcyB0aGUgY29ubmVjdGlvblxuICAgIC8vIHRoYXQgd2lsbCBnZXQgbG9nZ2VkIGluIGJ5IE1ldGVvci5sb2dpbigpLCBhbmQgdGhpcyBpcyB0aGVcbiAgICAvLyBjb25uZWN0aW9uIHdob3NlIGxvZ2luIHN0YXRlIHdpbGwgYmUgcmVmbGVjdGVkIGJ5IE1ldGVvci51c2VySWQoKS5cbiAgICAvL1xuICAgIC8vIEl0IHdvdWxkIGJlIG11Y2ggcHJlZmVyYWJsZSBmb3IgdGhpcyB0byBiZSBpbiBhY2NvdW50c19jbGllbnQuanMsXG4gICAgLy8gYnV0IGl0IGhhcyB0byBiZSBoZXJlIGJlY2F1c2UgaXQncyBuZWVkZWQgdG8gY3JlYXRlIHRoZVxuICAgIC8vIE1ldGVvci51c2VycyBjb2xsZWN0aW9uLlxuICAgIGlmIChvcHRpb25zLmNvbm5lY3Rpb24pIHtcbiAgICAgIHRoaXMuY29ubmVjdGlvbiA9IG9wdGlvbnMuY29ubmVjdGlvbjtcbiAgICB9IGVsc2UgaWYgKG9wdGlvbnMuZGRwVXJsKSB7XG4gICAgICB0aGlzLmNvbm5lY3Rpb24gPSBERFAuY29ubmVjdChvcHRpb25zLmRkcFVybCk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgX19tZXRlb3JfcnVudGltZV9jb25maWdfXyAhPT0gXCJ1bmRlZmluZWRcIiAmJlxuICAgICAgICAgICAgICAgX19tZXRlb3JfcnVudGltZV9jb25maWdfXy5BQ0NPVU5UU19DT05ORUNUSU9OX1VSTCkge1xuICAgICAgLy8gVGVtcG9yYXJ5LCBpbnRlcm5hbCBob29rIHRvIGFsbG93IHRoZSBzZXJ2ZXIgdG8gcG9pbnQgdGhlIGNsaWVudFxuICAgICAgLy8gdG8gYSBkaWZmZXJlbnQgYXV0aGVudGljYXRpb24gc2VydmVyLiBUaGlzIGlzIGZvciBhIHZlcnlcbiAgICAgIC8vIHBhcnRpY3VsYXIgdXNlIGNhc2UgdGhhdCBjb21lcyB1cCB3aGVuIGltcGxlbWVudGluZyBhIG9hdXRoXG4gICAgICAvLyBzZXJ2ZXIuIFVuc3VwcG9ydGVkIGFuZCBtYXkgZ28gYXdheSBhdCBhbnkgcG9pbnQgaW4gdGltZS5cbiAgICAgIC8vXG4gICAgICAvLyBXZSB3aWxsIGV2ZW50dWFsbHkgcHJvdmlkZSBhIGdlbmVyYWwgd2F5IHRvIHVzZSBhY2NvdW50LWJhc2VcbiAgICAgIC8vIGFnYWluc3QgYW55IEREUCBjb25uZWN0aW9uLCBub3QganVzdCBvbmUgc3BlY2lhbCBvbmUuXG4gICAgICB0aGlzLmNvbm5lY3Rpb24gPVxuICAgICAgICBERFAuY29ubmVjdChfX21ldGVvcl9ydW50aW1lX2NvbmZpZ19fLkFDQ09VTlRTX0NPTk5FQ1RJT05fVVJMKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jb25uZWN0aW9uID0gTWV0ZW9yLmNvbm5lY3Rpb247XG4gICAgfVxuICB9XG5cbiAgX2dldFRva2VuTGlmZXRpbWVNcygpIHtcbiAgICAvLyBXaGVuIGxvZ2luRXhwaXJhdGlvbkluRGF5cyBpcyBzZXQgdG8gbnVsbCwgd2UnbGwgdXNlIGEgcmVhbGx5IGhpZ2hcbiAgICAvLyBudW1iZXIgb2YgZGF5cyAoTE9HSU5fVU5FWFBJUkFCTEVfVE9LRU5fREFZUykgdG8gc2ltdWxhdGUgYW5cbiAgICAvLyB1bmV4cGlyaW5nIHRva2VuLlxuICAgIGNvbnN0IGxvZ2luRXhwaXJhdGlvbkluRGF5cyA9XG4gICAgICAodGhpcy5fb3B0aW9ucy5sb2dpbkV4cGlyYXRpb25JbkRheXMgPT09IG51bGwpXG4gICAgICAgID8gTE9HSU5fVU5FWFBJUklOR19UT0tFTl9EQVlTXG4gICAgICAgIDogdGhpcy5fb3B0aW9ucy5sb2dpbkV4cGlyYXRpb25JbkRheXM7XG4gICAgcmV0dXJuIChsb2dpbkV4cGlyYXRpb25JbkRheXNcbiAgICAgICAgfHwgREVGQVVMVF9MT0dJTl9FWFBJUkFUSU9OX0RBWVMpICogMjQgKiA2MCAqIDYwICogMTAwMDtcbiAgfVxuXG4gIF9nZXRQYXNzd29yZFJlc2V0VG9rZW5MaWZldGltZU1zKCkge1xuICAgIHJldHVybiAodGhpcy5fb3B0aW9ucy5wYXNzd29yZFJlc2V0VG9rZW5FeHBpcmF0aW9uSW5EYXlzIHx8XG4gICAgICAgICAgICBERUZBVUxUX1BBU1NXT1JEX1JFU0VUX1RPS0VOX0VYUElSQVRJT05fREFZUykgKiAyNCAqIDYwICogNjAgKiAxMDAwO1xuICB9XG5cbiAgX2dldFBhc3N3b3JkRW5yb2xsVG9rZW5MaWZldGltZU1zKCkge1xuICAgIHJldHVybiAodGhpcy5fb3B0aW9ucy5wYXNzd29yZEVucm9sbFRva2VuRXhwaXJhdGlvbkluRGF5cyB8fFxuICAgICAgICBERUZBVUxUX1BBU1NXT1JEX0VOUk9MTF9UT0tFTl9FWFBJUkFUSU9OX0RBWVMpICogMjQgKiA2MCAqIDYwICogMTAwMDtcbiAgfVxuXG4gIF90b2tlbkV4cGlyYXRpb24od2hlbikge1xuICAgIC8vIFdlIHBhc3Mgd2hlbiB0aHJvdWdoIHRoZSBEYXRlIGNvbnN0cnVjdG9yIGZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eTtcbiAgICAvLyBgd2hlbmAgdXNlZCB0byBiZSBhIG51bWJlci5cbiAgICByZXR1cm4gbmV3IERhdGUoKG5ldyBEYXRlKHdoZW4pKS5nZXRUaW1lKCkgKyB0aGlzLl9nZXRUb2tlbkxpZmV0aW1lTXMoKSk7XG4gIH1cblxuICBfdG9rZW5FeHBpcmVzU29vbih3aGVuKSB7XG4gICAgbGV0IG1pbkxpZmV0aW1lTXMgPSAuMSAqIHRoaXMuX2dldFRva2VuTGlmZXRpbWVNcygpO1xuICAgIGNvbnN0IG1pbkxpZmV0aW1lQ2FwTXMgPSBNSU5fVE9LRU5fTElGRVRJTUVfQ0FQX1NFQ1MgKiAxMDAwO1xuICAgIGlmIChtaW5MaWZldGltZU1zID4gbWluTGlmZXRpbWVDYXBNcykge1xuICAgICAgbWluTGlmZXRpbWVNcyA9IG1pbkxpZmV0aW1lQ2FwTXM7XG4gICAgfVxuICAgIHJldHVybiBuZXcgRGF0ZSgpID4gKG5ldyBEYXRlKHdoZW4pIC0gbWluTGlmZXRpbWVNcyk7XG4gIH1cblxuICAvLyBOby1vcCBvbiB0aGUgc2VydmVyLCBvdmVycmlkZGVuIG9uIHRoZSBjbGllbnQuXG4gIF9zdGFydHVwQ2FsbGJhY2soY2FsbGJhY2spIHt9XG59XG5cbi8vIE5vdGUgdGhhdCBBY2NvdW50cyBpcyBkZWZpbmVkIHNlcGFyYXRlbHkgaW4gYWNjb3VudHNfY2xpZW50LmpzIGFuZFxuLy8gYWNjb3VudHNfc2VydmVyLmpzLlxuXG4vKipcbiAqIEBzdW1tYXJ5IEdldCB0aGUgY3VycmVudCB1c2VyIGlkLCBvciBgbnVsbGAgaWYgbm8gdXNlciBpcyBsb2dnZWQgaW4uIEEgcmVhY3RpdmUgZGF0YSBzb3VyY2UuXG4gKiBAbG9jdXMgQW55d2hlcmUgYnV0IHB1Ymxpc2ggZnVuY3Rpb25zXG4gKiBAaW1wb3J0RnJvbVBhY2thZ2UgbWV0ZW9yXG4gKi9cbk1ldGVvci51c2VySWQgPSAoKSA9PiBBY2NvdW50cy51c2VySWQoKTtcblxuLyoqXG4gKiBAc3VtbWFyeSBHZXQgdGhlIGN1cnJlbnQgdXNlciByZWNvcmQsIG9yIGBudWxsYCBpZiBubyB1c2VyIGlzIGxvZ2dlZCBpbi4gQSByZWFjdGl2ZSBkYXRhIHNvdXJjZS5cbiAqIEBsb2N1cyBBbnl3aGVyZSBidXQgcHVibGlzaCBmdW5jdGlvbnNcbiAqIEBpbXBvcnRGcm9tUGFja2FnZSBtZXRlb3JcbiAqL1xuTWV0ZW9yLnVzZXIgPSAoKSA9PiBBY2NvdW50cy51c2VyKCk7XG5cbi8vIGhvdyBsb25nIChpbiBkYXlzKSB1bnRpbCBhIGxvZ2luIHRva2VuIGV4cGlyZXNcbmNvbnN0IERFRkFVTFRfTE9HSU5fRVhQSVJBVElPTl9EQVlTID0gOTA7XG4vLyBob3cgbG9uZyAoaW4gZGF5cykgdW50aWwgcmVzZXQgcGFzc3dvcmQgdG9rZW4gZXhwaXJlc1xuY29uc3QgREVGQVVMVF9QQVNTV09SRF9SRVNFVF9UT0tFTl9FWFBJUkFUSU9OX0RBWVMgPSAzO1xuLy8gaG93IGxvbmcgKGluIGRheXMpIHVudGlsIGVucm9sIHBhc3N3b3JkIHRva2VuIGV4cGlyZXNcbmNvbnN0IERFRkFVTFRfUEFTU1dPUkRfRU5ST0xMX1RPS0VOX0VYUElSQVRJT05fREFZUyA9IDMwO1xuLy8gQ2xpZW50cyBkb24ndCB0cnkgdG8gYXV0by1sb2dpbiB3aXRoIGEgdG9rZW4gdGhhdCBpcyBnb2luZyB0byBleHBpcmUgd2l0aGluXG4vLyAuMSAqIERFRkFVTFRfTE9HSU5fRVhQSVJBVElPTl9EQVlTLCBjYXBwZWQgYXQgTUlOX1RPS0VOX0xJRkVUSU1FX0NBUF9TRUNTLlxuLy8gVHJpZXMgdG8gYXZvaWQgYWJydXB0IGRpc2Nvbm5lY3RzIGZyb20gZXhwaXJpbmcgdG9rZW5zLlxuY29uc3QgTUlOX1RPS0VOX0xJRkVUSU1FX0NBUF9TRUNTID0gMzYwMDsgLy8gb25lIGhvdXJcbi8vIGhvdyBvZnRlbiAoaW4gbWlsbGlzZWNvbmRzKSB3ZSBjaGVjayBmb3IgZXhwaXJlZCB0b2tlbnNcbmV4cG9ydCBjb25zdCBFWFBJUkVfVE9LRU5TX0lOVEVSVkFMX01TID0gNjAwICogMTAwMDsgLy8gMTAgbWludXRlc1xuLy8gaG93IGxvbmcgd2Ugd2FpdCBiZWZvcmUgbG9nZ2luZyBvdXQgY2xpZW50cyB3aGVuIE1ldGVvci5sb2dvdXRPdGhlckNsaWVudHMgaXNcbi8vIGNhbGxlZFxuZXhwb3J0IGNvbnN0IENPTk5FQ1RJT05fQ0xPU0VfREVMQVlfTVMgPSAxMCAqIDEwMDA7XG4vLyBBIGxhcmdlIG51bWJlciBvZiBleHBpcmF0aW9uIGRheXMgKGFwcHJveGltYXRlbHkgMTAwIHllYXJzIHdvcnRoKSB0aGF0IGlzXG4vLyB1c2VkIHdoZW4gY3JlYXRpbmcgdW5leHBpcmluZyB0b2tlbnMuXG5jb25zdCBMT0dJTl9VTkVYUElSSU5HX1RPS0VOX0RBWVMgPSAzNjUgKiAxMDA7XG4iLCJpbXBvcnQgY3J5cHRvIGZyb20gJ2NyeXB0byc7XG5pbXBvcnQge1xuICBBY2NvdW50c0NvbW1vbixcbiAgRVhQSVJFX1RPS0VOU19JTlRFUlZBTF9NUyxcbiAgQ09OTkVDVElPTl9DTE9TRV9ERUxBWV9NU1xufSBmcm9tICcuL2FjY291bnRzX2NvbW1vbi5qcyc7XG5cbmNvbnN0IGhhc093biA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogQHN1bW1hcnkgQ29uc3RydWN0b3IgZm9yIHRoZSBgQWNjb3VudHNgIG5hbWVzcGFjZSBvbiB0aGUgc2VydmVyLlxuICogQGxvY3VzIFNlcnZlclxuICogQGNsYXNzIEFjY291bnRzU2VydmVyXG4gKiBAZXh0ZW5kcyBBY2NvdW50c0NvbW1vblxuICogQGluc3RhbmNlbmFtZSBhY2NvdW50c1NlcnZlclxuICogQHBhcmFtIHtPYmplY3R9IHNlcnZlciBBIHNlcnZlciBvYmplY3Qgc3VjaCBhcyBgTWV0ZW9yLnNlcnZlcmAuXG4gKi9cbmV4cG9ydCBjbGFzcyBBY2NvdW50c1NlcnZlciBleHRlbmRzIEFjY291bnRzQ29tbW9uIHtcbiAgLy8gTm90ZSB0aGF0IHRoaXMgY29uc3RydWN0b3IgaXMgbGVzcyBsaWtlbHkgdG8gYmUgaW5zdGFudGlhdGVkIG11bHRpcGxlXG4gIC8vIHRpbWVzIHRoYW4gdGhlIGBBY2NvdW50c0NsaWVudGAgY29uc3RydWN0b3IsIGJlY2F1c2UgYSBzaW5nbGUgc2VydmVyXG4gIC8vIGNhbiBwcm92aWRlIG9ubHkgb25lIHNldCBvZiBtZXRob2RzLlxuICBjb25zdHJ1Y3RvcihzZXJ2ZXIpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5fc2VydmVyID0gc2VydmVyIHx8IE1ldGVvci5zZXJ2ZXI7XG4gICAgLy8gU2V0IHVwIHRoZSBzZXJ2ZXIncyBtZXRob2RzLCBhcyBpZiBieSBjYWxsaW5nIE1ldGVvci5tZXRob2RzLlxuICAgIHRoaXMuX2luaXRTZXJ2ZXJNZXRob2RzKCk7XG5cbiAgICB0aGlzLl9pbml0QWNjb3VudERhdGFIb29rcygpO1xuXG4gICAgLy8gSWYgYXV0b3B1Ymxpc2ggaXMgb24sIHB1Ymxpc2ggdGhlc2UgdXNlciBmaWVsZHMuIExvZ2luIHNlcnZpY2VcbiAgICAvLyBwYWNrYWdlcyAoZWcgYWNjb3VudHMtZ29vZ2xlKSBhZGQgdG8gdGhlc2UgYnkgY2FsbGluZ1xuICAgIC8vIGFkZEF1dG9wdWJsaXNoRmllbGRzLiAgTm90YWJseSwgdGhpcyBpc24ndCBpbXBsZW1lbnRlZCB3aXRoIG11bHRpcGxlXG4gICAgLy8gcHVibGlzaGVzIHNpbmNlIEREUCBvbmx5IG1lcmdlcyBvbmx5IGFjcm9zcyB0b3AtbGV2ZWwgZmllbGRzLCBub3RcbiAgICAvLyBzdWJmaWVsZHMgKHN1Y2ggYXMgJ3NlcnZpY2VzLmZhY2Vib29rLmFjY2Vzc1Rva2VuJylcbiAgICB0aGlzLl9hdXRvcHVibGlzaEZpZWxkcyA9IHtcbiAgICAgIGxvZ2dlZEluVXNlcjogWydwcm9maWxlJywgJ3VzZXJuYW1lJywgJ2VtYWlscyddLFxuICAgICAgb3RoZXJVc2VyczogWydwcm9maWxlJywgJ3VzZXJuYW1lJ11cbiAgICB9O1xuICAgIHRoaXMuX2luaXRTZXJ2ZXJQdWJsaWNhdGlvbnMoKTtcblxuICAgIC8vIGNvbm5lY3Rpb25JZCAtPiB7Y29ubmVjdGlvbiwgbG9naW5Ub2tlbn1cbiAgICB0aGlzLl9hY2NvdW50RGF0YSA9IHt9O1xuXG4gICAgLy8gY29ubmVjdGlvbiBpZCAtPiBvYnNlcnZlIGhhbmRsZSBmb3IgdGhlIGxvZ2luIHRva2VuIHRoYXQgdGhpcyBjb25uZWN0aW9uIGlzXG4gICAgLy8gY3VycmVudGx5IGFzc29jaWF0ZWQgd2l0aCwgb3IgYSBudW1iZXIuIFRoZSBudW1iZXIgaW5kaWNhdGVzIHRoYXQgd2UgYXJlIGluXG4gICAgLy8gdGhlIHByb2Nlc3Mgb2Ygc2V0dGluZyB1cCB0aGUgb2JzZXJ2ZSAodXNpbmcgYSBudW1iZXIgaW5zdGVhZCBvZiBhIHNpbmdsZVxuICAgIC8vIHNlbnRpbmVsIGFsbG93cyBtdWx0aXBsZSBhdHRlbXB0cyB0byBzZXQgdXAgdGhlIG9ic2VydmUgdG8gaWRlbnRpZnkgd2hpY2hcbiAgICAvLyBvbmUgd2FzIHRoZWlycykuXG4gICAgdGhpcy5fdXNlck9ic2VydmVzRm9yQ29ubmVjdGlvbnMgPSB7fTtcbiAgICB0aGlzLl9uZXh0VXNlck9ic2VydmVOdW1iZXIgPSAxOyAgLy8gZm9yIHRoZSBudW1iZXIgZGVzY3JpYmVkIGFib3ZlLlxuXG4gICAgLy8gbGlzdCBvZiBhbGwgcmVnaXN0ZXJlZCBoYW5kbGVycy5cbiAgICB0aGlzLl9sb2dpbkhhbmRsZXJzID0gW107XG5cbiAgICBzZXR1cFVzZXJzQ29sbGVjdGlvbih0aGlzLnVzZXJzKTtcbiAgICBzZXR1cERlZmF1bHRMb2dpbkhhbmRsZXJzKHRoaXMpO1xuICAgIHNldEV4cGlyZVRva2Vuc0ludGVydmFsKHRoaXMpO1xuXG4gICAgdGhpcy5fdmFsaWRhdGVMb2dpbkhvb2sgPSBuZXcgSG9vayh7IGJpbmRFbnZpcm9ubWVudDogZmFsc2UgfSk7XG4gICAgdGhpcy5fdmFsaWRhdGVOZXdVc2VySG9va3MgPSBbXG4gICAgICBkZWZhdWx0VmFsaWRhdGVOZXdVc2VySG9vay5iaW5kKHRoaXMpXG4gICAgXTtcblxuICAgIHRoaXMuX2RlbGV0ZVNhdmVkVG9rZW5zRm9yQWxsVXNlcnNPblN0YXJ0dXAoKTtcblxuICAgIHRoaXMuX3NraXBDYXNlSW5zZW5zaXRpdmVDaGVja3NGb3JUZXN0ID0ge307XG5cbiAgICAvLyBYWFggVGhlc2Ugc2hvdWxkIHByb2JhYmx5IG5vdCBhY3R1YWxseSBiZSBwdWJsaWM/XG4gICAgdGhpcy51cmxzID0ge1xuICAgICAgcmVzZXRQYXNzd29yZDogdG9rZW4gPT4gTWV0ZW9yLmFic29sdXRlVXJsKGAjL3Jlc2V0LXBhc3N3b3JkLyR7dG9rZW59YCksXG4gICAgICB2ZXJpZnlFbWFpbDogdG9rZW4gPT4gTWV0ZW9yLmFic29sdXRlVXJsKGAjL3ZlcmlmeS1lbWFpbC8ke3Rva2VufWApLFxuICAgICAgZW5yb2xsQWNjb3VudDogdG9rZW4gPT4gTWV0ZW9yLmFic29sdXRlVXJsKGAjL2Vucm9sbC1hY2NvdW50LyR7dG9rZW59YCksXG4gICAgfVxuXG4gICAgdGhpcy5hZGREZWZhdWx0UmF0ZUxpbWl0KClcbiAgfVxuXG4gIC8vL1xuICAvLy8gQ1VSUkVOVCBVU0VSXG4gIC8vL1xuXG4gIC8vIEBvdmVycmlkZSBvZiBcImFic3RyYWN0XCIgbm9uLWltcGxlbWVudGF0aW9uIGluIGFjY291bnRzX2NvbW1vbi5qc1xuICB1c2VySWQoKSB7XG4gICAgLy8gVGhpcyBmdW5jdGlvbiBvbmx5IHdvcmtzIGlmIGNhbGxlZCBpbnNpZGUgYSBtZXRob2Qgb3IgYSBwdWJpY2F0aW9uLlxuICAgIC8vIFVzaW5nIGFueSBvZiB0aGUgaW5mb21hdGlvbiBmcm9tIE1ldGVvci51c2VyKCkgaW4gYSBtZXRob2Qgb3JcbiAgICAvLyBwdWJsaXNoIGZ1bmN0aW9uIHdpbGwgYWx3YXlzIHVzZSB0aGUgdmFsdWUgZnJvbSB3aGVuIHRoZSBmdW5jdGlvbiBmaXJzdFxuICAgIC8vIHJ1bnMuIFRoaXMgaXMgbGlrZWx5IG5vdCB3aGF0IHRoZSB1c2VyIGV4cGVjdHMuIFRoZSB3YXkgdG8gbWFrZSB0aGlzIHdvcmtcbiAgICAvLyBpbiBhIG1ldGhvZCBvciBwdWJsaXNoIGZ1bmN0aW9uIGlzIHRvIGRvIE1ldGVvci5maW5kKHRoaXMudXNlcklkKS5vYnNlcnZlXG4gICAgLy8gYW5kIHJlY29tcHV0ZSB3aGVuIHRoZSB1c2VyIHJlY29yZCBjaGFuZ2VzLlxuICAgIGNvbnN0IGN1cnJlbnRJbnZvY2F0aW9uID0gRERQLl9DdXJyZW50TWV0aG9kSW52b2NhdGlvbi5nZXQoKSB8fCBERFAuX0N1cnJlbnRQdWJsaWNhdGlvbkludm9jYXRpb24uZ2V0KCk7XG4gICAgaWYgKCFjdXJyZW50SW52b2NhdGlvbilcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIk1ldGVvci51c2VySWQgY2FuIG9ubHkgYmUgaW52b2tlZCBpbiBtZXRob2QgY2FsbHMgb3IgcHVibGljYXRpb25zLlwiKTtcbiAgICByZXR1cm4gY3VycmVudEludm9jYXRpb24udXNlcklkO1xuICB9XG5cbiAgLy8vXG4gIC8vLyBMT0dJTiBIT09LU1xuICAvLy9cblxuICAvKipcbiAgICogQHN1bW1hcnkgVmFsaWRhdGUgbG9naW4gYXR0ZW1wdHMuXG4gICAqIEBsb2N1cyBTZXJ2ZXJcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBDYWxsZWQgd2hlbmV2ZXIgYSBsb2dpbiBpcyBhdHRlbXB0ZWQgKGVpdGhlciBzdWNjZXNzZnVsIG9yIHVuc3VjY2Vzc2Z1bCkuICBBIGxvZ2luIGNhbiBiZSBhYm9ydGVkIGJ5IHJldHVybmluZyBhIGZhbHN5IHZhbHVlIG9yIHRocm93aW5nIGFuIGV4Y2VwdGlvbi5cbiAgICovXG4gIHZhbGlkYXRlTG9naW5BdHRlbXB0KGZ1bmMpIHtcbiAgICAvLyBFeGNlcHRpb25zIGluc2lkZSB0aGUgaG9vayBjYWxsYmFjayBhcmUgcGFzc2VkIHVwIHRvIHVzLlxuICAgIHJldHVybiB0aGlzLl92YWxpZGF0ZUxvZ2luSG9vay5yZWdpc3RlcihmdW5jKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAc3VtbWFyeSBTZXQgcmVzdHJpY3Rpb25zIG9uIG5ldyB1c2VyIGNyZWF0aW9uLlxuICAgKiBAbG9jdXMgU2VydmVyXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgQ2FsbGVkIHdoZW5ldmVyIGEgbmV3IHVzZXIgaXMgY3JlYXRlZC4gVGFrZXMgdGhlIG5ldyB1c2VyIG9iamVjdCwgYW5kIHJldHVybnMgdHJ1ZSB0byBhbGxvdyB0aGUgY3JlYXRpb24gb3IgZmFsc2UgdG8gYWJvcnQuXG4gICAqL1xuICB2YWxpZGF0ZU5ld1VzZXIoZnVuYykge1xuICAgIHRoaXMuX3ZhbGlkYXRlTmV3VXNlckhvb2tzLnB1c2goZnVuYyk7XG4gIH1cblxuICAvLy9cbiAgLy8vIENSRUFURSBVU0VSIEhPT0tTXG4gIC8vL1xuXG4gIC8qKlxuICAgKiBAc3VtbWFyeSBDdXN0b21pemUgbmV3IHVzZXIgY3JlYXRpb24uXG4gICAqIEBsb2N1cyBTZXJ2ZXJcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBDYWxsZWQgd2hlbmV2ZXIgYSBuZXcgdXNlciBpcyBjcmVhdGVkLiBSZXR1cm4gdGhlIG5ldyB1c2VyIG9iamVjdCwgb3IgdGhyb3cgYW4gYEVycm9yYCB0byBhYm9ydCB0aGUgY3JlYXRpb24uXG4gICAqL1xuICBvbkNyZWF0ZVVzZXIoZnVuYykge1xuICAgIGlmICh0aGlzLl9vbkNyZWF0ZVVzZXJIb29rKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW4gb25seSBjYWxsIG9uQ3JlYXRlVXNlciBvbmNlXCIpO1xuICAgIH1cblxuICAgIHRoaXMuX29uQ3JlYXRlVXNlckhvb2sgPSBmdW5jO1xuICB9XG5cbiAgLyoqXG4gICAqIEBzdW1tYXJ5IEN1c3RvbWl6ZSBvYXV0aCB1c2VyIHByb2ZpbGUgdXBkYXRlc1xuICAgKiBAbG9jdXMgU2VydmVyXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgQ2FsbGVkIHdoZW5ldmVyIGEgdXNlciBpcyBsb2dnZWQgaW4gdmlhIG9hdXRoLiBSZXR1cm4gdGhlIHByb2ZpbGUgb2JqZWN0IHRvIGJlIG1lcmdlZCwgb3IgdGhyb3cgYW4gYEVycm9yYCB0byBhYm9ydCB0aGUgY3JlYXRpb24uXG4gICAqL1xuICBvbkV4dGVybmFsTG9naW4oZnVuYykge1xuICAgIGlmICh0aGlzLl9vbkV4dGVybmFsTG9naW5Ib29rKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW4gb25seSBjYWxsIG9uRXh0ZXJuYWxMb2dpbiBvbmNlXCIpO1xuICAgIH1cblxuICAgIHRoaXMuX29uRXh0ZXJuYWxMb2dpbkhvb2sgPSBmdW5jO1xuICB9XG5cbiAgX3ZhbGlkYXRlTG9naW4oY29ubmVjdGlvbiwgYXR0ZW1wdCkge1xuICAgIHRoaXMuX3ZhbGlkYXRlTG9naW5Ib29rLmVhY2goY2FsbGJhY2sgPT4ge1xuICAgICAgbGV0IHJldDtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldCA9IGNhbGxiYWNrKGNsb25lQXR0ZW1wdFdpdGhDb25uZWN0aW9uKGNvbm5lY3Rpb24sIGF0dGVtcHQpKTtcbiAgICAgIH1cbiAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgIGF0dGVtcHQuYWxsb3dlZCA9IGZhbHNlO1xuICAgICAgICAvLyBYWFggdGhpcyBtZWFucyB0aGUgbGFzdCB0aHJvd24gZXJyb3Igb3ZlcnJpZGVzIHByZXZpb3VzIGVycm9yXG4gICAgICAgIC8vIG1lc3NhZ2VzLiBNYXliZSB0aGlzIGlzIHN1cnByaXNpbmcgdG8gdXNlcnMgYW5kIHdlIHNob3VsZCBtYWtlXG4gICAgICAgIC8vIG92ZXJyaWRpbmcgZXJyb3JzIG1vcmUgZXhwbGljaXQuIChzZWVcbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL21ldGVvci9tZXRlb3IvaXNzdWVzLzE5NjApXG4gICAgICAgIGF0dGVtcHQuZXJyb3IgPSBlO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGlmICghIHJldCkge1xuICAgICAgICBhdHRlbXB0LmFsbG93ZWQgPSBmYWxzZTtcbiAgICAgICAgLy8gZG9uJ3Qgb3ZlcnJpZGUgYSBzcGVjaWZpYyBlcnJvciBwcm92aWRlZCBieSBhIHByZXZpb3VzXG4gICAgICAgIC8vIHZhbGlkYXRvciBvciB0aGUgaW5pdGlhbCBhdHRlbXB0IChlZyBcImluY29ycmVjdCBwYXNzd29yZFwiKS5cbiAgICAgICAgaWYgKCFhdHRlbXB0LmVycm9yKVxuICAgICAgICAgIGF0dGVtcHQuZXJyb3IgPSBuZXcgTWV0ZW9yLkVycm9yKDQwMywgXCJMb2dpbiBmb3JiaWRkZW5cIik7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9KTtcbiAgfTtcblxuICBfc3VjY2Vzc2Z1bExvZ2luKGNvbm5lY3Rpb24sIGF0dGVtcHQpIHtcbiAgICB0aGlzLl9vbkxvZ2luSG9vay5lYWNoKGNhbGxiYWNrID0+IHtcbiAgICAgIGNhbGxiYWNrKGNsb25lQXR0ZW1wdFdpdGhDb25uZWN0aW9uKGNvbm5lY3Rpb24sIGF0dGVtcHQpKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0pO1xuICB9O1xuXG4gIF9mYWlsZWRMb2dpbihjb25uZWN0aW9uLCBhdHRlbXB0KSB7XG4gICAgdGhpcy5fb25Mb2dpbkZhaWx1cmVIb29rLmVhY2goY2FsbGJhY2sgPT4ge1xuICAgICAgY2FsbGJhY2soY2xvbmVBdHRlbXB0V2l0aENvbm5lY3Rpb24oY29ubmVjdGlvbiwgYXR0ZW1wdCkpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSk7XG4gIH07XG5cbiAgX3N1Y2Nlc3NmdWxMb2dvdXQoY29ubmVjdGlvbiwgdXNlcklkKSB7XG4gICAgY29uc3QgdXNlciA9IHVzZXJJZCAmJiB0aGlzLnVzZXJzLmZpbmRPbmUodXNlcklkKTtcbiAgICB0aGlzLl9vbkxvZ291dEhvb2suZWFjaChjYWxsYmFjayA9PiB7XG4gICAgICBjYWxsYmFjayh7IHVzZXIsIGNvbm5lY3Rpb24gfSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9KTtcbiAgfTtcblxuICAvLy9cbiAgLy8vIExPR0lOIE1FVEhPRFNcbiAgLy8vXG5cbiAgLy8gTG9naW4gbWV0aG9kcyByZXR1cm4gdG8gdGhlIGNsaWVudCBhbiBvYmplY3QgY29udGFpbmluZyB0aGVzZVxuICAvLyBmaWVsZHMgd2hlbiB0aGUgdXNlciB3YXMgbG9nZ2VkIGluIHN1Y2Nlc3NmdWxseTpcbiAgLy9cbiAgLy8gICBpZDogdXNlcklkXG4gIC8vICAgdG9rZW46ICpcbiAgLy8gICB0b2tlbkV4cGlyZXM6ICpcbiAgLy9cbiAgLy8gdG9rZW5FeHBpcmVzIGlzIG9wdGlvbmFsIGFuZCBpbnRlbmRzIHRvIHByb3ZpZGUgYSBoaW50IHRvIHRoZVxuICAvLyBjbGllbnQgYXMgdG8gd2hlbiB0aGUgdG9rZW4gd2lsbCBleHBpcmUuIElmIG5vdCBwcm92aWRlZCwgdGhlXG4gIC8vIGNsaWVudCB3aWxsIGNhbGwgQWNjb3VudHMuX3Rva2VuRXhwaXJhdGlvbiwgcGFzc2luZyBpdCB0aGUgZGF0ZVxuICAvLyB0aGF0IGl0IHJlY2VpdmVkIHRoZSB0b2tlbi5cbiAgLy9cbiAgLy8gVGhlIGxvZ2luIG1ldGhvZCB3aWxsIHRocm93IGFuIGVycm9yIGJhY2sgdG8gdGhlIGNsaWVudCBpZiB0aGUgdXNlclxuICAvLyBmYWlsZWQgdG8gbG9nIGluLlxuICAvL1xuICAvL1xuICAvLyBMb2dpbiBoYW5kbGVycyBhbmQgc2VydmljZSBzcGVjaWZpYyBsb2dpbiBtZXRob2RzIHN1Y2ggYXNcbiAgLy8gYGNyZWF0ZVVzZXJgIGludGVybmFsbHkgcmV0dXJuIGEgYHJlc3VsdGAgb2JqZWN0IGNvbnRhaW5pbmcgdGhlc2VcbiAgLy8gZmllbGRzOlxuICAvL1xuICAvLyAgIHR5cGU6XG4gIC8vICAgICBvcHRpb25hbCBzdHJpbmc7IHRoZSBzZXJ2aWNlIG5hbWUsIG92ZXJyaWRlcyB0aGUgaGFuZGxlclxuICAvLyAgICAgZGVmYXVsdCBpZiBwcmVzZW50LlxuICAvL1xuICAvLyAgIGVycm9yOlxuICAvLyAgICAgZXhjZXB0aW9uOyBpZiB0aGUgdXNlciBpcyBub3QgYWxsb3dlZCB0byBsb2dpbiwgdGhlIHJlYXNvbiB3aHkuXG4gIC8vXG4gIC8vICAgdXNlcklkOlxuICAvLyAgICAgc3RyaW5nOyB0aGUgdXNlciBpZCBvZiB0aGUgdXNlciBhdHRlbXB0aW5nIHRvIGxvZ2luIChpZlxuICAvLyAgICAga25vd24pLCByZXF1aXJlZCBmb3IgYW4gYWxsb3dlZCBsb2dpbi5cbiAgLy9cbiAgLy8gICBvcHRpb25zOlxuICAvLyAgICAgb3B0aW9uYWwgb2JqZWN0IG1lcmdlZCBpbnRvIHRoZSByZXN1bHQgcmV0dXJuZWQgYnkgdGhlIGxvZ2luXG4gIC8vICAgICBtZXRob2Q7IHVzZWQgYnkgSEFNSyBmcm9tIFNSUC5cbiAgLy9cbiAgLy8gICBzdGFtcGVkTG9naW5Ub2tlbjpcbiAgLy8gICAgIG9wdGlvbmFsIG9iamVjdCB3aXRoIGB0b2tlbmAgYW5kIGB3aGVuYCBpbmRpY2F0aW5nIHRoZSBsb2dpblxuICAvLyAgICAgdG9rZW4gaXMgYWxyZWFkeSBwcmVzZW50IGluIHRoZSBkYXRhYmFzZSwgcmV0dXJuZWQgYnkgdGhlXG4gIC8vICAgICBcInJlc3VtZVwiIGxvZ2luIGhhbmRsZXIuXG4gIC8vXG4gIC8vIEZvciBjb252ZW5pZW5jZSwgbG9naW4gbWV0aG9kcyBjYW4gYWxzbyB0aHJvdyBhbiBleGNlcHRpb24sIHdoaWNoXG4gIC8vIGlzIGNvbnZlcnRlZCBpbnRvIGFuIHtlcnJvcn0gcmVzdWx0LiAgSG93ZXZlciwgaWYgdGhlIGlkIG9mIHRoZVxuICAvLyB1c2VyIGF0dGVtcHRpbmcgdGhlIGxvZ2luIGlzIGtub3duLCBhIHt1c2VySWQsIGVycm9yfSByZXN1bHQgc2hvdWxkXG4gIC8vIGJlIHJldHVybmVkIGluc3RlYWQgc2luY2UgdGhlIHVzZXIgaWQgaXMgbm90IGNhcHR1cmVkIHdoZW4gYW5cbiAgLy8gZXhjZXB0aW9uIGlzIHRocm93bi5cbiAgLy9cbiAgLy8gVGhpcyBpbnRlcm5hbCBgcmVzdWx0YCBvYmplY3QgaXMgYXV0b21hdGljYWxseSBjb252ZXJ0ZWQgaW50byB0aGVcbiAgLy8gcHVibGljIHtpZCwgdG9rZW4sIHRva2VuRXhwaXJlc30gb2JqZWN0IHJldHVybmVkIHRvIHRoZSBjbGllbnQuXG5cbiAgLy8gVHJ5IGEgbG9naW4gbWV0aG9kLCBjb252ZXJ0aW5nIHRocm93biBleGNlcHRpb25zIGludG8gYW4ge2Vycm9yfVxuICAvLyByZXN1bHQuICBUaGUgYHR5cGVgIGFyZ3VtZW50IGlzIGEgZGVmYXVsdCwgaW5zZXJ0ZWQgaW50byB0aGUgcmVzdWx0XG4gIC8vIG9iamVjdCBpZiBub3QgZXhwbGljaXRseSByZXR1cm5lZC5cbiAgLy9cbiAgLy8gTG9nIGluIGEgdXNlciBvbiBhIGNvbm5lY3Rpb24uXG4gIC8vXG4gIC8vIFdlIHVzZSB0aGUgbWV0aG9kIGludm9jYXRpb24gdG8gc2V0IHRoZSB1c2VyIGlkIG9uIHRoZSBjb25uZWN0aW9uLFxuICAvLyBub3QgdGhlIGNvbm5lY3Rpb24gb2JqZWN0IGRpcmVjdGx5LiBzZXRVc2VySWQgaXMgdGllZCB0byBtZXRob2RzIHRvXG4gIC8vIGVuZm9yY2UgY2xlYXIgb3JkZXJpbmcgb2YgbWV0aG9kIGFwcGxpY2F0aW9uICh1c2luZyB3YWl0IG1ldGhvZHMgb25cbiAgLy8gdGhlIGNsaWVudCwgYW5kIGEgbm8gc2V0VXNlcklkIGFmdGVyIHVuYmxvY2sgcmVzdHJpY3Rpb24gb24gdGhlXG4gIC8vIHNlcnZlcilcbiAgLy9cbiAgLy8gVGhlIGBzdGFtcGVkTG9naW5Ub2tlbmAgcGFyYW1ldGVyIGlzIG9wdGlvbmFsLiAgV2hlbiBwcmVzZW50LCBpdFxuICAvLyBpbmRpY2F0ZXMgdGhhdCB0aGUgbG9naW4gdG9rZW4gaGFzIGFscmVhZHkgYmVlbiBpbnNlcnRlZCBpbnRvIHRoZVxuICAvLyBkYXRhYmFzZSBhbmQgZG9lc24ndCBuZWVkIHRvIGJlIGluc2VydGVkIGFnYWluLiAgKEl0J3MgdXNlZCBieSB0aGVcbiAgLy8gXCJyZXN1bWVcIiBsb2dpbiBoYW5kbGVyKS5cbiAgX2xvZ2luVXNlcihtZXRob2RJbnZvY2F0aW9uLCB1c2VySWQsIHN0YW1wZWRMb2dpblRva2VuKSB7XG4gICAgaWYgKCEgc3RhbXBlZExvZ2luVG9rZW4pIHtcbiAgICAgIHN0YW1wZWRMb2dpblRva2VuID0gdGhpcy5fZ2VuZXJhdGVTdGFtcGVkTG9naW5Ub2tlbigpO1xuICAgICAgdGhpcy5faW5zZXJ0TG9naW5Ub2tlbih1c2VySWQsIHN0YW1wZWRMb2dpblRva2VuKTtcbiAgICB9XG5cbiAgICAvLyBUaGlzIG9yZGVyIChhbmQgdGhlIGF2b2lkYW5jZSBvZiB5aWVsZHMpIGlzIGltcG9ydGFudCB0byBtYWtlXG4gICAgLy8gc3VyZSB0aGF0IHdoZW4gcHVibGlzaCBmdW5jdGlvbnMgYXJlIHJlcnVuLCB0aGV5IHNlZSBhXG4gICAgLy8gY29uc2lzdGVudCB2aWV3IG9mIHRoZSB3b3JsZDogdGhlIHVzZXJJZCBpcyBzZXQgYW5kIG1hdGNoZXNcbiAgICAvLyB0aGUgbG9naW4gdG9rZW4gb24gdGhlIGNvbm5lY3Rpb24gKG5vdCB0aGF0IHRoZXJlIGlzXG4gICAgLy8gY3VycmVudGx5IGEgcHVibGljIEFQSSBmb3IgcmVhZGluZyB0aGUgbG9naW4gdG9rZW4gb24gYVxuICAgIC8vIGNvbm5lY3Rpb24pLlxuICAgIE1ldGVvci5fbm9ZaWVsZHNBbGxvd2VkKCgpID0+XG4gICAgICB0aGlzLl9zZXRMb2dpblRva2VuKFxuICAgICAgICB1c2VySWQsXG4gICAgICAgIG1ldGhvZEludm9jYXRpb24uY29ubmVjdGlvbixcbiAgICAgICAgdGhpcy5faGFzaExvZ2luVG9rZW4oc3RhbXBlZExvZ2luVG9rZW4udG9rZW4pXG4gICAgICApXG4gICAgKTtcblxuICAgIG1ldGhvZEludm9jYXRpb24uc2V0VXNlcklkKHVzZXJJZCk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgaWQ6IHVzZXJJZCxcbiAgICAgIHRva2VuOiBzdGFtcGVkTG9naW5Ub2tlbi50b2tlbixcbiAgICAgIHRva2VuRXhwaXJlczogdGhpcy5fdG9rZW5FeHBpcmF0aW9uKHN0YW1wZWRMb2dpblRva2VuLndoZW4pXG4gICAgfTtcbiAgfTtcblxuICAvLyBBZnRlciBhIGxvZ2luIG1ldGhvZCBoYXMgY29tcGxldGVkLCBjYWxsIHRoZSBsb2dpbiBob29rcy4gIE5vdGVcbiAgLy8gdGhhdCBgYXR0ZW1wdExvZ2luYCBpcyBjYWxsZWQgZm9yICphbGwqIGxvZ2luIGF0dGVtcHRzLCBldmVuIG9uZXNcbiAgLy8gd2hpY2ggYXJlbid0IHN1Y2Nlc3NmdWwgKHN1Y2ggYXMgYW4gaW52YWxpZCBwYXNzd29yZCwgZXRjKS5cbiAgLy9cbiAgLy8gSWYgdGhlIGxvZ2luIGlzIGFsbG93ZWQgYW5kIGlzbid0IGFib3J0ZWQgYnkgYSB2YWxpZGF0ZSBsb2dpbiBob29rXG4gIC8vIGNhbGxiYWNrLCBsb2cgaW4gdGhlIHVzZXIuXG4gIC8vXG4gIF9hdHRlbXB0TG9naW4oXG4gICAgbWV0aG9kSW52b2NhdGlvbixcbiAgICBtZXRob2ROYW1lLFxuICAgIG1ldGhvZEFyZ3MsXG4gICAgcmVzdWx0XG4gICkge1xuICAgIGlmICghcmVzdWx0KVxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwicmVzdWx0IGlzIHJlcXVpcmVkXCIpO1xuXG4gICAgLy8gWFhYIEEgcHJvZ3JhbW1pbmcgZXJyb3IgaW4gYSBsb2dpbiBoYW5kbGVyIGNhbiBsZWFkIHRvIHRoaXMgb2NjdXJpbmcsIGFuZFxuICAgIC8vIHRoZW4gd2UgZG9uJ3QgY2FsbCBvbkxvZ2luIG9yIG9uTG9naW5GYWlsdXJlIGNhbGxiYWNrcy4gU2hvdWxkXG4gICAgLy8gdHJ5TG9naW5NZXRob2QgY2F0Y2ggdGhpcyBjYXNlIGFuZCB0dXJuIGl0IGludG8gYW4gZXJyb3I/XG4gICAgaWYgKCFyZXN1bHQudXNlcklkICYmICFyZXN1bHQuZXJyb3IpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBIGxvZ2luIG1ldGhvZCBtdXN0IHNwZWNpZnkgYSB1c2VySWQgb3IgYW4gZXJyb3JcIik7XG5cbiAgICBsZXQgdXNlcjtcbiAgICBpZiAocmVzdWx0LnVzZXJJZClcbiAgICAgIHVzZXIgPSB0aGlzLnVzZXJzLmZpbmRPbmUocmVzdWx0LnVzZXJJZCk7XG5cbiAgICBjb25zdCBhdHRlbXB0ID0ge1xuICAgICAgdHlwZTogcmVzdWx0LnR5cGUgfHwgXCJ1bmtub3duXCIsXG4gICAgICBhbGxvd2VkOiAhISAocmVzdWx0LnVzZXJJZCAmJiAhcmVzdWx0LmVycm9yKSxcbiAgICAgIG1ldGhvZE5hbWU6IG1ldGhvZE5hbWUsXG4gICAgICBtZXRob2RBcmd1bWVudHM6IEFycmF5LmZyb20obWV0aG9kQXJncylcbiAgICB9O1xuICAgIGlmIChyZXN1bHQuZXJyb3IpIHtcbiAgICAgIGF0dGVtcHQuZXJyb3IgPSByZXN1bHQuZXJyb3I7XG4gICAgfVxuICAgIGlmICh1c2VyKSB7XG4gICAgICBhdHRlbXB0LnVzZXIgPSB1c2VyO1xuICAgIH1cblxuICAgIC8vIF92YWxpZGF0ZUxvZ2luIG1heSBtdXRhdGUgYGF0dGVtcHRgIGJ5IGFkZGluZyBhbiBlcnJvciBhbmQgY2hhbmdpbmcgYWxsb3dlZFxuICAgIC8vIHRvIGZhbHNlLCBidXQgdGhhdCdzIHRoZSBvbmx5IGNoYW5nZSBpdCBjYW4gbWFrZSAoYW5kIHRoZSB1c2VyJ3MgY2FsbGJhY2tzXG4gICAgLy8gb25seSBnZXQgYSBjbG9uZSBvZiBgYXR0ZW1wdGApLlxuICAgIHRoaXMuX3ZhbGlkYXRlTG9naW4obWV0aG9kSW52b2NhdGlvbi5jb25uZWN0aW9uLCBhdHRlbXB0KTtcblxuICAgIGlmIChhdHRlbXB0LmFsbG93ZWQpIHtcbiAgICAgIGNvbnN0IHJldCA9IHtcbiAgICAgICAgLi4udGhpcy5fbG9naW5Vc2VyKFxuICAgICAgICAgIG1ldGhvZEludm9jYXRpb24sXG4gICAgICAgICAgcmVzdWx0LnVzZXJJZCxcbiAgICAgICAgICByZXN1bHQuc3RhbXBlZExvZ2luVG9rZW5cbiAgICAgICAgKSxcbiAgICAgICAgLi4ucmVzdWx0Lm9wdGlvbnNcbiAgICAgIH07XG4gICAgICByZXQudHlwZSA9IGF0dGVtcHQudHlwZTtcbiAgICAgIHRoaXMuX3N1Y2Nlc3NmdWxMb2dpbihtZXRob2RJbnZvY2F0aW9uLmNvbm5lY3Rpb24sIGF0dGVtcHQpO1xuICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aGlzLl9mYWlsZWRMb2dpbihtZXRob2RJbnZvY2F0aW9uLmNvbm5lY3Rpb24sIGF0dGVtcHQpO1xuICAgICAgdGhyb3cgYXR0ZW1wdC5lcnJvcjtcbiAgICB9XG4gIH07XG5cbiAgLy8gQWxsIHNlcnZpY2Ugc3BlY2lmaWMgbG9naW4gbWV0aG9kcyBzaG91bGQgZ28gdGhyb3VnaCB0aGlzIGZ1bmN0aW9uLlxuICAvLyBFbnN1cmUgdGhhdCB0aHJvd24gZXhjZXB0aW9ucyBhcmUgY2F1Z2h0IGFuZCB0aGF0IGxvZ2luIGhvb2tcbiAgLy8gY2FsbGJhY2tzIGFyZSBzdGlsbCBjYWxsZWQuXG4gIC8vXG4gIF9sb2dpbk1ldGhvZChcbiAgICBtZXRob2RJbnZvY2F0aW9uLFxuICAgIG1ldGhvZE5hbWUsXG4gICAgbWV0aG9kQXJncyxcbiAgICB0eXBlLFxuICAgIGZuXG4gICkge1xuICAgIHJldHVybiB0aGlzLl9hdHRlbXB0TG9naW4oXG4gICAgICBtZXRob2RJbnZvY2F0aW9uLFxuICAgICAgbWV0aG9kTmFtZSxcbiAgICAgIG1ldGhvZEFyZ3MsXG4gICAgICB0cnlMb2dpbk1ldGhvZCh0eXBlLCBmbilcbiAgICApO1xuICB9O1xuXG5cbiAgLy8gUmVwb3J0IGEgbG9naW4gYXR0ZW1wdCBmYWlsZWQgb3V0c2lkZSB0aGUgY29udGV4dCBvZiBhIG5vcm1hbCBsb2dpblxuICAvLyBtZXRob2QuIFRoaXMgaXMgZm9yIHVzZSBpbiB0aGUgY2FzZSB3aGVyZSB0aGVyZSBpcyBhIG11bHRpLXN0ZXAgbG9naW5cbiAgLy8gcHJvY2VkdXJlIChlZyBTUlAgYmFzZWQgcGFzc3dvcmQgbG9naW4pLiBJZiBhIG1ldGhvZCBlYXJseSBpbiB0aGVcbiAgLy8gY2hhaW4gZmFpbHMsIGl0IHNob3VsZCBjYWxsIHRoaXMgZnVuY3Rpb24gdG8gcmVwb3J0IGEgZmFpbHVyZS4gVGhlcmVcbiAgLy8gaXMgbm8gY29ycmVzcG9uZGluZyBtZXRob2QgZm9yIGEgc3VjY2Vzc2Z1bCBsb2dpbjsgbWV0aG9kcyB0aGF0IGNhblxuICAvLyBzdWNjZWVkIGF0IGxvZ2dpbmcgYSB1c2VyIGluIHNob3VsZCBhbHdheXMgYmUgYWN0dWFsIGxvZ2luIG1ldGhvZHNcbiAgLy8gKHVzaW5nIGVpdGhlciBBY2NvdW50cy5fbG9naW5NZXRob2Qgb3IgQWNjb3VudHMucmVnaXN0ZXJMb2dpbkhhbmRsZXIpLlxuICBfcmVwb3J0TG9naW5GYWlsdXJlKFxuICAgIG1ldGhvZEludm9jYXRpb24sXG4gICAgbWV0aG9kTmFtZSxcbiAgICBtZXRob2RBcmdzLFxuICAgIHJlc3VsdFxuICApIHtcbiAgICBjb25zdCBhdHRlbXB0ID0ge1xuICAgICAgdHlwZTogcmVzdWx0LnR5cGUgfHwgXCJ1bmtub3duXCIsXG4gICAgICBhbGxvd2VkOiBmYWxzZSxcbiAgICAgIGVycm9yOiByZXN1bHQuZXJyb3IsXG4gICAgICBtZXRob2ROYW1lOiBtZXRob2ROYW1lLFxuICAgICAgbWV0aG9kQXJndW1lbnRzOiBBcnJheS5mcm9tKG1ldGhvZEFyZ3MpXG4gICAgfTtcblxuICAgIGlmIChyZXN1bHQudXNlcklkKSB7XG4gICAgICBhdHRlbXB0LnVzZXIgPSB0aGlzLnVzZXJzLmZpbmRPbmUocmVzdWx0LnVzZXJJZCk7XG4gICAgfVxuXG4gICAgdGhpcy5fdmFsaWRhdGVMb2dpbihtZXRob2RJbnZvY2F0aW9uLmNvbm5lY3Rpb24sIGF0dGVtcHQpO1xuICAgIHRoaXMuX2ZhaWxlZExvZ2luKG1ldGhvZEludm9jYXRpb24uY29ubmVjdGlvbiwgYXR0ZW1wdCk7XG5cbiAgICAvLyBfdmFsaWRhdGVMb2dpbiBtYXkgbXV0YXRlIGF0dGVtcHQgdG8gc2V0IGEgbmV3IGVycm9yIG1lc3NhZ2UuIFJldHVyblxuICAgIC8vIHRoZSBtb2RpZmllZCB2ZXJzaW9uLlxuICAgIHJldHVybiBhdHRlbXB0O1xuICB9O1xuXG4gIC8vL1xuICAvLy8gTE9HSU4gSEFORExFUlNcbiAgLy8vXG5cbiAgLy8gVGhlIG1haW4gZW50cnkgcG9pbnQgZm9yIGF1dGggcGFja2FnZXMgdG8gaG9vayBpbiB0byBsb2dpbi5cbiAgLy9cbiAgLy8gQSBsb2dpbiBoYW5kbGVyIGlzIGEgbG9naW4gbWV0aG9kIHdoaWNoIGNhbiByZXR1cm4gYHVuZGVmaW5lZGAgdG9cbiAgLy8gaW5kaWNhdGUgdGhhdCB0aGUgbG9naW4gcmVxdWVzdCBpcyBub3QgaGFuZGxlZCBieSB0aGlzIGhhbmRsZXIuXG4gIC8vXG4gIC8vIEBwYXJhbSBuYW1lIHtTdHJpbmd9IE9wdGlvbmFsLiAgVGhlIHNlcnZpY2UgbmFtZSwgdXNlZCBieSBkZWZhdWx0XG4gIC8vIGlmIGEgc3BlY2lmaWMgc2VydmljZSBuYW1lIGlzbid0IHJldHVybmVkIGluIHRoZSByZXN1bHQuXG4gIC8vXG4gIC8vIEBwYXJhbSBoYW5kbGVyIHtGdW5jdGlvbn0gQSBmdW5jdGlvbiB0aGF0IHJlY2VpdmVzIGFuIG9wdGlvbnMgb2JqZWN0XG4gIC8vIChhcyBwYXNzZWQgYXMgYW4gYXJndW1lbnQgdG8gdGhlIGBsb2dpbmAgbWV0aG9kKSBhbmQgcmV0dXJucyBvbmUgb2Y6XG4gIC8vIC0gYHVuZGVmaW5lZGAsIG1lYW5pbmcgZG9uJ3QgaGFuZGxlO1xuICAvLyAtIGEgbG9naW4gbWV0aG9kIHJlc3VsdCBvYmplY3RcblxuICByZWdpc3RlckxvZ2luSGFuZGxlcihuYW1lLCBoYW5kbGVyKSB7XG4gICAgaWYgKCEgaGFuZGxlcikge1xuICAgICAgaGFuZGxlciA9IG5hbWU7XG4gICAgICBuYW1lID0gbnVsbDtcbiAgICB9XG5cbiAgICB0aGlzLl9sb2dpbkhhbmRsZXJzLnB1c2goe1xuICAgICAgbmFtZTogbmFtZSxcbiAgICAgIGhhbmRsZXI6IGhhbmRsZXJcbiAgICB9KTtcbiAgfTtcblxuXG4gIC8vIENoZWNrcyBhIHVzZXIncyBjcmVkZW50aWFscyBhZ2FpbnN0IGFsbCB0aGUgcmVnaXN0ZXJlZCBsb2dpblxuICAvLyBoYW5kbGVycywgYW5kIHJldHVybnMgYSBsb2dpbiB0b2tlbiBpZiB0aGUgY3JlZGVudGlhbHMgYXJlIHZhbGlkLiBJdFxuICAvLyBpcyBsaWtlIHRoZSBsb2dpbiBtZXRob2QsIGV4Y2VwdCB0aGF0IGl0IGRvZXNuJ3Qgc2V0IHRoZSBsb2dnZWQtaW5cbiAgLy8gdXNlciBvbiB0aGUgY29ubmVjdGlvbi4gVGhyb3dzIGEgTWV0ZW9yLkVycm9yIGlmIGxvZ2dpbmcgaW4gZmFpbHMsXG4gIC8vIGluY2x1ZGluZyB0aGUgY2FzZSB3aGVyZSBub25lIG9mIHRoZSBsb2dpbiBoYW5kbGVycyBoYW5kbGVkIHRoZSBsb2dpblxuICAvLyByZXF1ZXN0LiBPdGhlcndpc2UsIHJldHVybnMge2lkOiB1c2VySWQsIHRva2VuOiAqLCB0b2tlbkV4cGlyZXM6ICp9LlxuICAvL1xuICAvLyBGb3IgZXhhbXBsZSwgaWYgeW91IHdhbnQgdG8gbG9naW4gd2l0aCBhIHBsYWludGV4dCBwYXNzd29yZCwgYG9wdGlvbnNgIGNvdWxkIGJlXG4gIC8vICAgeyB1c2VyOiB7IHVzZXJuYW1lOiA8dXNlcm5hbWU+IH0sIHBhc3N3b3JkOiA8cGFzc3dvcmQ+IH0sIG9yXG4gIC8vICAgeyB1c2VyOiB7IGVtYWlsOiA8ZW1haWw+IH0sIHBhc3N3b3JkOiA8cGFzc3dvcmQ+IH0uXG5cbiAgLy8gVHJ5IGFsbCBvZiB0aGUgcmVnaXN0ZXJlZCBsb2dpbiBoYW5kbGVycyB1bnRpbCBvbmUgb2YgdGhlbSBkb2Vzbid0XG4gIC8vIHJldHVybiBgdW5kZWZpbmVkYCwgbWVhbmluZyBpdCBoYW5kbGVkIHRoaXMgY2FsbCB0byBgbG9naW5gLiBSZXR1cm5cbiAgLy8gdGhhdCByZXR1cm4gdmFsdWUuXG4gIF9ydW5Mb2dpbkhhbmRsZXJzKG1ldGhvZEludm9jYXRpb24sIG9wdGlvbnMpIHtcbiAgICBmb3IgKGxldCBoYW5kbGVyIG9mIHRoaXMuX2xvZ2luSGFuZGxlcnMpIHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHRyeUxvZ2luTWV0aG9kKFxuICAgICAgICBoYW5kbGVyLm5hbWUsXG4gICAgICAgICgpID0+IGhhbmRsZXIuaGFuZGxlci5jYWxsKG1ldGhvZEludm9jYXRpb24sIG9wdGlvbnMpXG4gICAgICApO1xuXG4gICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZXN1bHQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCJBIGxvZ2luIGhhbmRsZXIgc2hvdWxkIHJldHVybiBhIHJlc3VsdCBvciB1bmRlZmluZWRcIik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGU6IG51bGwsXG4gICAgICBlcnJvcjogbmV3IE1ldGVvci5FcnJvcig0MDAsIFwiVW5yZWNvZ25pemVkIG9wdGlvbnMgZm9yIGxvZ2luIHJlcXVlc3RcIilcbiAgICB9O1xuICB9O1xuXG4gIC8vIERlbGV0ZXMgdGhlIGdpdmVuIGxvZ2luVG9rZW4gZnJvbSB0aGUgZGF0YWJhc2UuXG4gIC8vXG4gIC8vIEZvciBuZXctc3R5bGUgaGFzaGVkIHRva2VuLCB0aGlzIHdpbGwgY2F1c2UgYWxsIGNvbm5lY3Rpb25zXG4gIC8vIGFzc29jaWF0ZWQgd2l0aCB0aGUgdG9rZW4gdG8gYmUgY2xvc2VkLlxuICAvL1xuICAvLyBBbnkgY29ubmVjdGlvbnMgYXNzb2NpYXRlZCB3aXRoIG9sZC1zdHlsZSB1bmhhc2hlZCB0b2tlbnMgd2lsbCBiZVxuICAvLyBpbiB0aGUgcHJvY2VzcyBvZiBiZWNvbWluZyBhc3NvY2lhdGVkIHdpdGggaGFzaGVkIHRva2VucyBhbmQgdGhlblxuICAvLyB0aGV5J2xsIGdldCBjbG9zZWQuXG4gIGRlc3Ryb3lUb2tlbih1c2VySWQsIGxvZ2luVG9rZW4pIHtcbiAgICB0aGlzLnVzZXJzLnVwZGF0ZSh1c2VySWQsIHtcbiAgICAgICRwdWxsOiB7XG4gICAgICAgIFwic2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zXCI6IHtcbiAgICAgICAgICAkb3I6IFtcbiAgICAgICAgICAgIHsgaGFzaGVkVG9rZW46IGxvZ2luVG9rZW4gfSxcbiAgICAgICAgICAgIHsgdG9rZW46IGxvZ2luVG9rZW4gfVxuICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIF9pbml0U2VydmVyTWV0aG9kcygpIHtcbiAgICAvLyBUaGUgbWV0aG9kcyBjcmVhdGVkIGluIHRoaXMgZnVuY3Rpb24gbmVlZCB0byBiZSBjcmVhdGVkIGhlcmUgc28gdGhhdFxuICAgIC8vIHRoaXMgdmFyaWFibGUgaXMgYXZhaWxhYmxlIGluIHRoZWlyIHNjb3BlLlxuICAgIGNvbnN0IGFjY291bnRzID0gdGhpcztcblxuXG4gICAgLy8gVGhpcyBvYmplY3Qgd2lsbCBiZSBwb3B1bGF0ZWQgd2l0aCBtZXRob2RzIGFuZCB0aGVuIHBhc3NlZCB0b1xuICAgIC8vIGFjY291bnRzLl9zZXJ2ZXIubWV0aG9kcyBmdXJ0aGVyIGJlbG93LlxuICAgIGNvbnN0IG1ldGhvZHMgPSB7fTtcblxuICAgIC8vIEByZXR1cm5zIHtPYmplY3R8bnVsbH1cbiAgICAvLyAgIElmIHN1Y2Nlc3NmdWwsIHJldHVybnMge3Rva2VuOiByZWNvbm5lY3RUb2tlbiwgaWQ6IHVzZXJJZH1cbiAgICAvLyAgIElmIHVuc3VjY2Vzc2Z1bCAoZm9yIGV4YW1wbGUsIGlmIHRoZSB1c2VyIGNsb3NlZCB0aGUgb2F1dGggbG9naW4gcG9wdXApLFxuICAgIC8vICAgICB0aHJvd3MgYW4gZXJyb3IgZGVzY3JpYmluZyB0aGUgcmVhc29uXG4gICAgbWV0aG9kcy5sb2dpbiA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAvLyBMb2dpbiBoYW5kbGVycyBzaG91bGQgcmVhbGx5IGFsc28gY2hlY2sgd2hhdGV2ZXIgZmllbGQgdGhleSBsb29rIGF0IGluXG4gICAgICAvLyBvcHRpb25zLCBidXQgd2UgZG9uJ3QgZW5mb3JjZSBpdC5cbiAgICAgIGNoZWNrKG9wdGlvbnMsIE9iamVjdCk7XG5cbiAgICAgIGNvbnN0IHJlc3VsdCA9IGFjY291bnRzLl9ydW5Mb2dpbkhhbmRsZXJzKHRoaXMsIG9wdGlvbnMpO1xuXG4gICAgICByZXR1cm4gYWNjb3VudHMuX2F0dGVtcHRMb2dpbih0aGlzLCBcImxvZ2luXCIsIGFyZ3VtZW50cywgcmVzdWx0KTtcbiAgICB9O1xuXG4gICAgbWV0aG9kcy5sb2dvdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zdCB0b2tlbiA9IGFjY291bnRzLl9nZXRMb2dpblRva2VuKHRoaXMuY29ubmVjdGlvbi5pZCk7XG4gICAgICBhY2NvdW50cy5fc2V0TG9naW5Ub2tlbih0aGlzLnVzZXJJZCwgdGhpcy5jb25uZWN0aW9uLCBudWxsKTtcbiAgICAgIGlmICh0b2tlbiAmJiB0aGlzLnVzZXJJZCkge1xuICAgICAgICBhY2NvdW50cy5kZXN0cm95VG9rZW4odGhpcy51c2VySWQsIHRva2VuKTtcbiAgICAgIH1cbiAgICAgIGFjY291bnRzLl9zdWNjZXNzZnVsTG9nb3V0KHRoaXMuY29ubmVjdGlvbiwgdGhpcy51c2VySWQpO1xuICAgICAgdGhpcy5zZXRVc2VySWQobnVsbCk7XG4gICAgfTtcblxuICAgIC8vIERlbGV0ZSBhbGwgdGhlIGN1cnJlbnQgdXNlcidzIHRva2VucyBhbmQgY2xvc2UgYWxsIG9wZW4gY29ubmVjdGlvbnMgbG9nZ2VkXG4gICAgLy8gaW4gYXMgdGhpcyB1c2VyLiBSZXR1cm5zIGEgZnJlc2ggbmV3IGxvZ2luIHRva2VuIHRoYXQgdGhpcyBjbGllbnQgY2FuXG4gICAgLy8gdXNlLiBUZXN0cyBzZXQgQWNjb3VudHMuX25vQ29ubmVjdGlvbkNsb3NlRGVsYXlGb3JUZXN0IHRvIGRlbGV0ZSB0b2tlbnNcbiAgICAvLyBpbW1lZGlhdGVseSBpbnN0ZWFkIG9mIHVzaW5nIGEgZGVsYXkuXG4gICAgLy9cbiAgICAvLyBYWFggQ09NUEFUIFdJVEggMC43LjJcbiAgICAvLyBUaGlzIHNpbmdsZSBgbG9nb3V0T3RoZXJDbGllbnRzYCBtZXRob2QgaGFzIGJlZW4gcmVwbGFjZWQgd2l0aCB0d29cbiAgICAvLyBtZXRob2RzLCBvbmUgdGhhdCB5b3UgY2FsbCB0byBnZXQgYSBuZXcgdG9rZW4sIGFuZCBhbm90aGVyIHRoYXQgeW91XG4gICAgLy8gY2FsbCB0byByZW1vdmUgYWxsIHRva2VucyBleGNlcHQgeW91ciBvd24uIFRoZSBuZXcgZGVzaWduIGFsbG93c1xuICAgIC8vIGNsaWVudHMgdG8ga25vdyB3aGVuIG90aGVyIGNsaWVudHMgaGF2ZSBhY3R1YWxseSBiZWVuIGxvZ2dlZFxuICAgIC8vIG91dC4gKFRoZSBgbG9nb3V0T3RoZXJDbGllbnRzYCBtZXRob2QgZ3VhcmFudGVlcyB0aGUgY2FsbGVyIHRoYXRcbiAgICAvLyB0aGUgb3RoZXIgY2xpZW50cyB3aWxsIGJlIGxvZ2dlZCBvdXQgYXQgc29tZSBwb2ludCwgYnV0IG1ha2VzIG5vXG4gICAgLy8gZ3VhcmFudGVlcyBhYm91dCB3aGVuLikgVGhpcyBtZXRob2QgaXMgbGVmdCBpbiBmb3IgYmFja3dhcmRzXG4gICAgLy8gY29tcGF0aWJpbGl0eSwgZXNwZWNpYWxseSBzaW5jZSBhcHBsaWNhdGlvbiBjb2RlIG1pZ2h0IGJlIGNhbGxpbmdcbiAgICAvLyB0aGlzIG1ldGhvZCBkaXJlY3RseS5cbiAgICAvL1xuICAgIC8vIEByZXR1cm5zIHtPYmplY3R9IE9iamVjdCB3aXRoIHRva2VuIGFuZCB0b2tlbkV4cGlyZXMga2V5cy5cbiAgICBtZXRob2RzLmxvZ291dE90aGVyQ2xpZW50cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnN0IHVzZXIgPSBhY2NvdW50cy51c2Vycy5maW5kT25lKHRoaXMudXNlcklkLCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIFwic2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zXCI6IHRydWVcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBpZiAodXNlcikge1xuICAgICAgICAvLyBTYXZlIHRoZSBjdXJyZW50IHRva2VucyBpbiB0aGUgZGF0YWJhc2UgdG8gYmUgZGVsZXRlZCBpblxuICAgICAgICAvLyBDT05ORUNUSU9OX0NMT1NFX0RFTEFZX01TIG1zLiBUaGlzIGdpdmVzIG90aGVyIGNvbm5lY3Rpb25zIGluIHRoZVxuICAgICAgICAvLyBjYWxsZXIncyBicm93c2VyIHRpbWUgdG8gZmluZCB0aGUgZnJlc2ggdG9rZW4gaW4gbG9jYWxTdG9yYWdlLiBXZSBzYXZlXG4gICAgICAgIC8vIHRoZSB0b2tlbnMgaW4gdGhlIGRhdGFiYXNlIGluIGNhc2Ugd2UgY3Jhc2ggYmVmb3JlIGFjdHVhbGx5IGRlbGV0aW5nXG4gICAgICAgIC8vIHRoZW0uXG4gICAgICAgIGNvbnN0IHRva2VucyA9IHVzZXIuc2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zO1xuICAgICAgICBjb25zdCBuZXdUb2tlbiA9IGFjY291bnRzLl9nZW5lcmF0ZVN0YW1wZWRMb2dpblRva2VuKCk7XG4gICAgICAgIGFjY291bnRzLnVzZXJzLnVwZGF0ZSh0aGlzLnVzZXJJZCwge1xuICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgIFwic2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zVG9EZWxldGVcIjogdG9rZW5zLFxuICAgICAgICAgICAgXCJzZXJ2aWNlcy5yZXN1bWUuaGF2ZUxvZ2luVG9rZW5zVG9EZWxldGVcIjogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgJHB1c2g6IHsgXCJzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnNcIjogYWNjb3VudHMuX2hhc2hTdGFtcGVkVG9rZW4obmV3VG9rZW4pIH1cbiAgICAgICAgfSk7XG4gICAgICAgIE1ldGVvci5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAvLyBUaGUgb2JzZXJ2ZSBvbiBNZXRlb3IudXNlcnMgd2lsbCB0YWtlIGNhcmUgb2YgY2xvc2luZyB0aGUgY29ubmVjdGlvbnNcbiAgICAgICAgICAvLyBhc3NvY2lhdGVkIHdpdGggYHRva2Vuc2AuXG4gICAgICAgICAgYWNjb3VudHMuX2RlbGV0ZVNhdmVkVG9rZW5zRm9yVXNlcih0aGlzLnVzZXJJZCwgdG9rZW5zKTtcbiAgICAgICAgfSwgYWNjb3VudHMuX25vQ29ubmVjdGlvbkNsb3NlRGVsYXlGb3JUZXN0ID8gMCA6XG4gICAgICAgICAgQ09OTkVDVElPTl9DTE9TRV9ERUxBWV9NUyk7XG4gICAgICAgIC8vIFdlIGRvIG5vdCBzZXQgdGhlIGxvZ2luIHRva2VuIG9uIHRoaXMgY29ubmVjdGlvbiwgYnV0IGluc3RlYWQgdGhlXG4gICAgICAgIC8vIG9ic2VydmUgY2xvc2VzIHRoZSBjb25uZWN0aW9uIGFuZCB0aGUgY2xpZW50IHdpbGwgcmVjb25uZWN0IHdpdGggdGhlXG4gICAgICAgIC8vIG5ldyB0b2tlbi5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB0b2tlbjogbmV3VG9rZW4udG9rZW4sXG4gICAgICAgICAgdG9rZW5FeHBpcmVzOiBhY2NvdW50cy5fdG9rZW5FeHBpcmF0aW9uKG5ld1Rva2VuLndoZW4pXG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiWW91IGFyZSBub3QgbG9nZ2VkIGluLlwiKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gR2VuZXJhdGVzIGEgbmV3IGxvZ2luIHRva2VuIHdpdGggdGhlIHNhbWUgZXhwaXJhdGlvbiBhcyB0aGVcbiAgICAvLyBjb25uZWN0aW9uJ3MgY3VycmVudCB0b2tlbiBhbmQgc2F2ZXMgaXQgdG8gdGhlIGRhdGFiYXNlLiBBc3NvY2lhdGVzXG4gICAgLy8gdGhlIGNvbm5lY3Rpb24gd2l0aCB0aGlzIG5ldyB0b2tlbiBhbmQgcmV0dXJucyBpdC4gVGhyb3dzIGFuIGVycm9yXG4gICAgLy8gaWYgY2FsbGVkIG9uIGEgY29ubmVjdGlvbiB0aGF0IGlzbid0IGxvZ2dlZCBpbi5cbiAgICAvL1xuICAgIC8vIEByZXR1cm5zIE9iamVjdFxuICAgIC8vICAgSWYgc3VjY2Vzc2Z1bCwgcmV0dXJucyB7IHRva2VuOiA8bmV3IHRva2VuPiwgaWQ6IDx1c2VyIGlkPixcbiAgICAvLyAgIHRva2VuRXhwaXJlczogPGV4cGlyYXRpb24gZGF0ZT4gfS5cbiAgICBtZXRob2RzLmdldE5ld1Rva2VuID0gZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3QgdXNlciA9IGFjY291bnRzLnVzZXJzLmZpbmRPbmUodGhpcy51c2VySWQsIHtcbiAgICAgICAgZmllbGRzOiB7IFwic2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zXCI6IDEgfVxuICAgICAgfSk7XG4gICAgICBpZiAoISB0aGlzLnVzZXJJZCB8fCAhIHVzZXIpIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcIllvdSBhcmUgbm90IGxvZ2dlZCBpbi5cIik7XG4gICAgICB9XG4gICAgICAvLyBCZSBjYXJlZnVsIG5vdCB0byBnZW5lcmF0ZSBhIG5ldyB0b2tlbiB0aGF0IGhhcyBhIGxhdGVyXG4gICAgICAvLyBleHBpcmF0aW9uIHRoYW4gdGhlIGN1cnJlbiB0b2tlbi4gT3RoZXJ3aXNlLCBhIGJhZCBndXkgd2l0aCBhXG4gICAgICAvLyBzdG9sZW4gdG9rZW4gY291bGQgdXNlIHRoaXMgbWV0aG9kIHRvIHN0b3AgaGlzIHN0b2xlbiB0b2tlbiBmcm9tXG4gICAgICAvLyBldmVyIGV4cGlyaW5nLlxuICAgICAgY29uc3QgY3VycmVudEhhc2hlZFRva2VuID0gYWNjb3VudHMuX2dldExvZ2luVG9rZW4odGhpcy5jb25uZWN0aW9uLmlkKTtcbiAgICAgIGNvbnN0IGN1cnJlbnRTdGFtcGVkVG9rZW4gPSB1c2VyLnNlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucy5maW5kKFxuICAgICAgICBzdGFtcGVkVG9rZW4gPT4gc3RhbXBlZFRva2VuLmhhc2hlZFRva2VuID09PSBjdXJyZW50SGFzaGVkVG9rZW5cbiAgICAgICk7XG4gICAgICBpZiAoISBjdXJyZW50U3RhbXBlZFRva2VuKSB7IC8vIHNhZmV0eSBiZWx0OiB0aGlzIHNob3VsZCBuZXZlciBoYXBwZW5cbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcIkludmFsaWQgbG9naW4gdG9rZW5cIik7XG4gICAgICB9XG4gICAgICBjb25zdCBuZXdTdGFtcGVkVG9rZW4gPSBhY2NvdW50cy5fZ2VuZXJhdGVTdGFtcGVkTG9naW5Ub2tlbigpO1xuICAgICAgbmV3U3RhbXBlZFRva2VuLndoZW4gPSBjdXJyZW50U3RhbXBlZFRva2VuLndoZW47XG4gICAgICBhY2NvdW50cy5faW5zZXJ0TG9naW5Ub2tlbih0aGlzLnVzZXJJZCwgbmV3U3RhbXBlZFRva2VuKTtcbiAgICAgIHJldHVybiBhY2NvdW50cy5fbG9naW5Vc2VyKHRoaXMsIHRoaXMudXNlcklkLCBuZXdTdGFtcGVkVG9rZW4pO1xuICAgIH07XG5cbiAgICAvLyBSZW1vdmVzIGFsbCB0b2tlbnMgZXhjZXB0IHRoZSB0b2tlbiBhc3NvY2lhdGVkIHdpdGggdGhlIGN1cnJlbnRcbiAgICAvLyBjb25uZWN0aW9uLiBUaHJvd3MgYW4gZXJyb3IgaWYgdGhlIGNvbm5lY3Rpb24gaXMgbm90IGxvZ2dlZFxuICAgIC8vIGluLiBSZXR1cm5zIG5vdGhpbmcgb24gc3VjY2Vzcy5cbiAgICBtZXRob2RzLnJlbW92ZU90aGVyVG9rZW5zID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCEgdGhpcy51c2VySWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcIllvdSBhcmUgbm90IGxvZ2dlZCBpbi5cIik7XG4gICAgICB9XG4gICAgICBjb25zdCBjdXJyZW50VG9rZW4gPSBhY2NvdW50cy5fZ2V0TG9naW5Ub2tlbih0aGlzLmNvbm5lY3Rpb24uaWQpO1xuICAgICAgYWNjb3VudHMudXNlcnMudXBkYXRlKHRoaXMudXNlcklkLCB7XG4gICAgICAgICRwdWxsOiB7XG4gICAgICAgICAgXCJzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnNcIjogeyBoYXNoZWRUb2tlbjogeyAkbmU6IGN1cnJlbnRUb2tlbiB9IH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8vIEFsbG93IGEgb25lLXRpbWUgY29uZmlndXJhdGlvbiBmb3IgYSBsb2dpbiBzZXJ2aWNlLiBNb2RpZmljYXRpb25zXG4gICAgLy8gdG8gdGhpcyBjb2xsZWN0aW9uIGFyZSBhbHNvIGFsbG93ZWQgaW4gaW5zZWN1cmUgbW9kZS5cbiAgICBtZXRob2RzLmNvbmZpZ3VyZUxvZ2luU2VydmljZSA9IChvcHRpb25zKSA9PiB7XG4gICAgICBjaGVjayhvcHRpb25zLCBNYXRjaC5PYmplY3RJbmNsdWRpbmcoe3NlcnZpY2U6IFN0cmluZ30pKTtcbiAgICAgIC8vIERvbid0IGxldCByYW5kb20gdXNlcnMgY29uZmlndXJlIGEgc2VydmljZSB3ZSBoYXZlbid0IGFkZGVkIHlldCAoc29cbiAgICAgIC8vIHRoYXQgd2hlbiB3ZSBkbyBsYXRlciBhZGQgaXQsIGl0J3Mgc2V0IHVwIHdpdGggdGhlaXIgY29uZmlndXJhdGlvblxuICAgICAgLy8gaW5zdGVhZCBvZiBvdXJzKS5cbiAgICAgIC8vIFhYWCBpZiBzZXJ2aWNlIGNvbmZpZ3VyYXRpb24gaXMgb2F1dGgtc3BlY2lmaWMgdGhlbiB0aGlzIGNvZGUgc2hvdWxkXG4gICAgICAvLyAgICAgYmUgaW4gYWNjb3VudHMtb2F1dGg7IGlmIGl0J3Mgbm90IHRoZW4gdGhlIHJlZ2lzdHJ5IHNob3VsZCBiZVxuICAgICAgLy8gICAgIGluIHRoaXMgcGFja2FnZVxuICAgICAgaWYgKCEoYWNjb3VudHMub2F1dGhcbiAgICAgICAgJiYgYWNjb3VudHMub2F1dGguc2VydmljZU5hbWVzKCkuaW5jbHVkZXMob3B0aW9ucy5zZXJ2aWNlKSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiU2VydmljZSB1bmtub3duXCIpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB7IFNlcnZpY2VDb25maWd1cmF0aW9uIH0gPSBQYWNrYWdlWydzZXJ2aWNlLWNvbmZpZ3VyYXRpb24nXTtcbiAgICAgIGlmIChTZXJ2aWNlQ29uZmlndXJhdGlvbi5jb25maWd1cmF0aW9ucy5maW5kT25lKHtzZXJ2aWNlOiBvcHRpb25zLnNlcnZpY2V9KSlcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIGBTZXJ2aWNlICR7b3B0aW9ucy5zZXJ2aWNlfSBhbHJlYWR5IGNvbmZpZ3VyZWRgKTtcblxuICAgICAgaWYgKGhhc093bi5jYWxsKG9wdGlvbnMsICdzZWNyZXQnKSAmJiB1c2luZ09BdXRoRW5jcnlwdGlvbigpKVxuICAgICAgICBvcHRpb25zLnNlY3JldCA9IE9BdXRoRW5jcnlwdGlvbi5zZWFsKG9wdGlvbnMuc2VjcmV0KTtcblxuICAgICAgU2VydmljZUNvbmZpZ3VyYXRpb24uY29uZmlndXJhdGlvbnMuaW5zZXJ0KG9wdGlvbnMpO1xuICAgIH07XG5cbiAgICBhY2NvdW50cy5fc2VydmVyLm1ldGhvZHMobWV0aG9kcyk7XG4gIH07XG5cbiAgX2luaXRBY2NvdW50RGF0YUhvb2tzKCkge1xuICAgIHRoaXMuX3NlcnZlci5vbkNvbm5lY3Rpb24oY29ubmVjdGlvbiA9PiB7XG4gICAgICB0aGlzLl9hY2NvdW50RGF0YVtjb25uZWN0aW9uLmlkXSA9IHtcbiAgICAgICAgY29ubmVjdGlvbjogY29ubmVjdGlvblxuICAgICAgfTtcblxuICAgICAgY29ubmVjdGlvbi5vbkNsb3NlKCgpID0+IHtcbiAgICAgICAgdGhpcy5fcmVtb3ZlVG9rZW5Gcm9tQ29ubmVjdGlvbihjb25uZWN0aW9uLmlkKTtcbiAgICAgICAgZGVsZXRlIHRoaXMuX2FjY291bnREYXRhW2Nvbm5lY3Rpb24uaWRdO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH07XG5cbiAgX2luaXRTZXJ2ZXJQdWJsaWNhdGlvbnMoKSB7XG4gICAgLy8gQnJpbmcgaW50byBsZXhpY2FsIHNjb3BlIGZvciBwdWJsaXNoIGNhbGxiYWNrcyB0aGF0IG5lZWQgYHRoaXNgXG4gICAgY29uc3QgeyB1c2VycywgX2F1dG9wdWJsaXNoRmllbGRzIH0gPSB0aGlzO1xuXG4gICAgLy8gUHVibGlzaCBhbGwgbG9naW4gc2VydmljZSBjb25maWd1cmF0aW9uIGZpZWxkcyBvdGhlciB0aGFuIHNlY3JldC5cbiAgICB0aGlzLl9zZXJ2ZXIucHVibGlzaChcIm1ldGVvci5sb2dpblNlcnZpY2VDb25maWd1cmF0aW9uXCIsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgU2VydmljZUNvbmZpZ3VyYXRpb24gfSA9IFBhY2thZ2VbJ3NlcnZpY2UtY29uZmlndXJhdGlvbiddO1xuICAgICAgcmV0dXJuIFNlcnZpY2VDb25maWd1cmF0aW9uLmNvbmZpZ3VyYXRpb25zLmZpbmQoe30sIHtmaWVsZHM6IHtzZWNyZXQ6IDB9fSk7XG4gICAgfSwge2lzX2F1dG86IHRydWV9KTsgLy8gbm90IHRlY2hpbmNhbGx5IGF1dG9wdWJsaXNoLCBidXQgc3RvcHMgdGhlIHdhcm5pbmcuXG5cbiAgICAvLyBQdWJsaXNoIHRoZSBjdXJyZW50IHVzZXIncyByZWNvcmQgdG8gdGhlIGNsaWVudC5cbiAgICB0aGlzLl9zZXJ2ZXIucHVibGlzaChudWxsLCBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAodGhpcy51c2VySWQpIHtcbiAgICAgICAgcmV0dXJuIHVzZXJzLmZpbmQoe1xuICAgICAgICAgIF9pZDogdGhpcy51c2VySWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgcHJvZmlsZTogMSxcbiAgICAgICAgICAgIHVzZXJuYW1lOiAxLFxuICAgICAgICAgICAgZW1haWxzOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgIH0sIC8qc3VwcHJlc3MgYXV0b3B1Ymxpc2ggd2FybmluZyove2lzX2F1dG86IHRydWV9KTtcblxuICAgIC8vIFVzZSBNZXRlb3Iuc3RhcnR1cCB0byBnaXZlIG90aGVyIHBhY2thZ2VzIGEgY2hhbmNlIHRvIGNhbGxcbiAgICAvLyBhZGRBdXRvcHVibGlzaEZpZWxkcy5cbiAgICBQYWNrYWdlLmF1dG9wdWJsaXNoICYmIE1ldGVvci5zdGFydHVwKCgpID0+IHtcbiAgICAgIC8vIFsncHJvZmlsZScsICd1c2VybmFtZSddIC0+IHtwcm9maWxlOiAxLCB1c2VybmFtZTogMX1cbiAgICAgIGNvbnN0IHRvRmllbGRTZWxlY3RvciA9IGZpZWxkcyA9PiBmaWVsZHMucmVkdWNlKChwcmV2LCBmaWVsZCkgPT4gKFxuICAgICAgICAgIHsgLi4ucHJldiwgW2ZpZWxkXTogMSB9KSxcbiAgICAgICAge31cbiAgICAgICk7XG4gICAgICB0aGlzLl9zZXJ2ZXIucHVibGlzaChudWxsLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLnVzZXJJZCkge1xuICAgICAgICAgIHJldHVybiB1c2Vycy5maW5kKHsgX2lkOiB0aGlzLnVzZXJJZCB9LCB7XG4gICAgICAgICAgICBmaWVsZHM6IHRvRmllbGRTZWxlY3RvcihfYXV0b3B1Ymxpc2hGaWVsZHMubG9nZ2VkSW5Vc2VyKSxcbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICB9LCAvKnN1cHByZXNzIGF1dG9wdWJsaXNoIHdhcm5pbmcqL3tpc19hdXRvOiB0cnVlfSk7XG5cbiAgICAgIC8vIFhYWCB0aGlzIHB1Ymxpc2ggaXMgbmVpdGhlciBkZWR1cC1hYmxlIG5vciBpcyBpdCBvcHRpbWl6ZWQgYnkgb3VyIHNwZWNpYWxcbiAgICAgIC8vIHRyZWF0bWVudCBvZiBxdWVyaWVzIG9uIGEgc3BlY2lmaWMgX2lkLiBUaGVyZWZvcmUgdGhpcyB3aWxsIGhhdmUgTyhuXjIpXG4gICAgICAvLyBydW4tdGltZSBwZXJmb3JtYW5jZSBldmVyeSB0aW1lIGEgdXNlciBkb2N1bWVudCBpcyBjaGFuZ2VkIChlZyBzb21lb25lXG4gICAgICAvLyBsb2dnaW5nIGluKS4gSWYgdGhpcyBpcyBhIHByb2JsZW0sIHdlIGNhbiBpbnN0ZWFkIHdyaXRlIGEgbWFudWFsIHB1Ymxpc2hcbiAgICAgIC8vIGZ1bmN0aW9uIHdoaWNoIGZpbHRlcnMgb3V0IGZpZWxkcyBiYXNlZCBvbiAndGhpcy51c2VySWQnLlxuICAgICAgdGhpcy5fc2VydmVyLnB1Ymxpc2gobnVsbCwgZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zdCBzZWxlY3RvciA9IHRoaXMudXNlcklkID8geyBfaWQ6IHsgJG5lOiB0aGlzLnVzZXJJZCB9IH0gOiB7fTtcbiAgICAgICAgcmV0dXJuIHVzZXJzLmZpbmQoc2VsZWN0b3IsIHtcbiAgICAgICAgICBmaWVsZHM6IHRvRmllbGRTZWxlY3RvcihfYXV0b3B1Ymxpc2hGaWVsZHMub3RoZXJVc2VycyksXG4gICAgICAgIH0pXG4gICAgICB9LCAvKnN1cHByZXNzIGF1dG9wdWJsaXNoIHdhcm5pbmcqL3tpc19hdXRvOiB0cnVlfSk7XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gQWRkIHRvIHRoZSBsaXN0IG9mIGZpZWxkcyBvciBzdWJmaWVsZHMgdG8gYmUgYXV0b21hdGljYWxseVxuICAvLyBwdWJsaXNoZWQgaWYgYXV0b3B1Ymxpc2ggaXMgb24uIE11c3QgYmUgY2FsbGVkIGZyb20gdG9wLWxldmVsXG4gIC8vIGNvZGUgKGllLCBiZWZvcmUgTWV0ZW9yLnN0YXJ0dXAgaG9va3MgcnVuKS5cbiAgLy9cbiAgLy8gQHBhcmFtIG9wdHMge09iamVjdH0gd2l0aDpcbiAgLy8gICAtIGZvckxvZ2dlZEluVXNlciB7QXJyYXl9IEFycmF5IG9mIGZpZWxkcyBwdWJsaXNoZWQgdG8gdGhlIGxvZ2dlZC1pbiB1c2VyXG4gIC8vICAgLSBmb3JPdGhlclVzZXJzIHtBcnJheX0gQXJyYXkgb2YgZmllbGRzIHB1Ymxpc2hlZCB0byB1c2VycyB0aGF0IGFyZW4ndCBsb2dnZWQgaW5cbiAgYWRkQXV0b3B1Ymxpc2hGaWVsZHMob3B0cykge1xuICAgIHRoaXMuX2F1dG9wdWJsaXNoRmllbGRzLmxvZ2dlZEluVXNlci5wdXNoLmFwcGx5KFxuICAgICAgdGhpcy5fYXV0b3B1Ymxpc2hGaWVsZHMubG9nZ2VkSW5Vc2VyLCBvcHRzLmZvckxvZ2dlZEluVXNlcik7XG4gICAgdGhpcy5fYXV0b3B1Ymxpc2hGaWVsZHMub3RoZXJVc2Vycy5wdXNoLmFwcGx5KFxuICAgICAgdGhpcy5fYXV0b3B1Ymxpc2hGaWVsZHMub3RoZXJVc2Vycywgb3B0cy5mb3JPdGhlclVzZXJzKTtcbiAgfTtcblxuICAvLy9cbiAgLy8vIEFDQ09VTlQgREFUQVxuICAvLy9cblxuICAvLyBIQUNLOiBUaGlzIGlzIHVzZWQgYnkgJ21ldGVvci1hY2NvdW50cycgdG8gZ2V0IHRoZSBsb2dpblRva2VuIGZvciBhXG4gIC8vIGNvbm5lY3Rpb24uIE1heWJlIHRoZXJlIHNob3VsZCBiZSBhIHB1YmxpYyB3YXkgdG8gZG8gdGhhdC5cbiAgX2dldEFjY291bnREYXRhKGNvbm5lY3Rpb25JZCwgZmllbGQpIHtcbiAgICBjb25zdCBkYXRhID0gdGhpcy5fYWNjb3VudERhdGFbY29ubmVjdGlvbklkXTtcbiAgICByZXR1cm4gZGF0YSAmJiBkYXRhW2ZpZWxkXTtcbiAgfTtcblxuICBfc2V0QWNjb3VudERhdGEoY29ubmVjdGlvbklkLCBmaWVsZCwgdmFsdWUpIHtcbiAgICBjb25zdCBkYXRhID0gdGhpcy5fYWNjb3VudERhdGFbY29ubmVjdGlvbklkXTtcblxuICAgIC8vIHNhZmV0eSBiZWx0LiBzaG91bGRuJ3QgaGFwcGVuLiBhY2NvdW50RGF0YSBpcyBzZXQgaW4gb25Db25uZWN0aW9uLFxuICAgIC8vIHdlIGRvbid0IGhhdmUgYSBjb25uZWN0aW9uSWQgdW50aWwgaXQgaXMgc2V0LlxuICAgIGlmICghZGF0YSlcbiAgICAgIHJldHVybjtcblxuICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKVxuICAgICAgZGVsZXRlIGRhdGFbZmllbGRdO1xuICAgIGVsc2VcbiAgICAgIGRhdGFbZmllbGRdID0gdmFsdWU7XG4gIH07XG5cbiAgLy8vXG4gIC8vLyBSRUNPTk5FQ1QgVE9LRU5TXG4gIC8vL1xuICAvLy8gc3VwcG9ydCByZWNvbm5lY3RpbmcgdXNpbmcgYSBtZXRlb3IgbG9naW4gdG9rZW5cblxuICBfaGFzaExvZ2luVG9rZW4obG9naW5Ub2tlbikge1xuICAgIGNvbnN0IGhhc2ggPSBjcnlwdG8uY3JlYXRlSGFzaCgnc2hhMjU2Jyk7XG4gICAgaGFzaC51cGRhdGUobG9naW5Ub2tlbik7XG4gICAgcmV0dXJuIGhhc2guZGlnZXN0KCdiYXNlNjQnKTtcbiAgfTtcblxuICAvLyB7dG9rZW4sIHdoZW59ID0+IHtoYXNoZWRUb2tlbiwgd2hlbn1cbiAgX2hhc2hTdGFtcGVkVG9rZW4oc3RhbXBlZFRva2VuKSB7XG4gICAgY29uc3QgeyB0b2tlbiwgLi4uaGFzaGVkU3RhbXBlZFRva2VuIH0gPSBzdGFtcGVkVG9rZW47XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLmhhc2hlZFN0YW1wZWRUb2tlbixcbiAgICAgIGhhc2hlZFRva2VuOiB0aGlzLl9oYXNoTG9naW5Ub2tlbih0b2tlbilcbiAgICB9O1xuICB9O1xuXG4gIC8vIFVzaW5nICRhZGRUb1NldCBhdm9pZHMgZ2V0dGluZyBhbiBpbmRleCBlcnJvciBpZiBhbm90aGVyIGNsaWVudFxuICAvLyBsb2dnaW5nIGluIHNpbXVsdGFuZW91c2x5IGhhcyBhbHJlYWR5IGluc2VydGVkIHRoZSBuZXcgaGFzaGVkXG4gIC8vIHRva2VuLlxuICBfaW5zZXJ0SGFzaGVkTG9naW5Ub2tlbih1c2VySWQsIGhhc2hlZFRva2VuLCBxdWVyeSkge1xuICAgIHF1ZXJ5ID0gcXVlcnkgPyB7IC4uLnF1ZXJ5IH0gOiB7fTtcbiAgICBxdWVyeS5faWQgPSB1c2VySWQ7XG4gICAgdGhpcy51c2Vycy51cGRhdGUocXVlcnksIHtcbiAgICAgICRhZGRUb1NldDoge1xuICAgICAgICBcInNlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vuc1wiOiBoYXNoZWRUb2tlblxuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIC8vIEV4cG9ydGVkIGZvciB0ZXN0cy5cbiAgX2luc2VydExvZ2luVG9rZW4odXNlcklkLCBzdGFtcGVkVG9rZW4sIHF1ZXJ5KSB7XG4gICAgdGhpcy5faW5zZXJ0SGFzaGVkTG9naW5Ub2tlbihcbiAgICAgIHVzZXJJZCxcbiAgICAgIHRoaXMuX2hhc2hTdGFtcGVkVG9rZW4oc3RhbXBlZFRva2VuKSxcbiAgICAgIHF1ZXJ5XG4gICAgKTtcbiAgfTtcblxuICBfY2xlYXJBbGxMb2dpblRva2Vucyh1c2VySWQpIHtcbiAgICB0aGlzLnVzZXJzLnVwZGF0ZSh1c2VySWQsIHtcbiAgICAgICRzZXQ6IHtcbiAgICAgICAgJ3NlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucyc6IFtdXG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gdGVzdCBob29rXG4gIF9nZXRVc2VyT2JzZXJ2ZShjb25uZWN0aW9uSWQpIHtcbiAgICByZXR1cm4gdGhpcy5fdXNlck9ic2VydmVzRm9yQ29ubmVjdGlvbnNbY29ubmVjdGlvbklkXTtcbiAgfTtcblxuICAvLyBDbGVhbiB1cCB0aGlzIGNvbm5lY3Rpb24ncyBhc3NvY2lhdGlvbiB3aXRoIHRoZSB0b2tlbjogdGhhdCBpcywgc3RvcFxuICAvLyB0aGUgb2JzZXJ2ZSB0aGF0IHdlIHN0YXJ0ZWQgd2hlbiB3ZSBhc3NvY2lhdGVkIHRoZSBjb25uZWN0aW9uIHdpdGhcbiAgLy8gdGhpcyB0b2tlbi5cbiAgX3JlbW92ZVRva2VuRnJvbUNvbm5lY3Rpb24oY29ubmVjdGlvbklkKSB7XG4gICAgaWYgKGhhc093bi5jYWxsKHRoaXMuX3VzZXJPYnNlcnZlc0ZvckNvbm5lY3Rpb25zLCBjb25uZWN0aW9uSWQpKSB7XG4gICAgICBjb25zdCBvYnNlcnZlID0gdGhpcy5fdXNlck9ic2VydmVzRm9yQ29ubmVjdGlvbnNbY29ubmVjdGlvbklkXTtcbiAgICAgIGlmICh0eXBlb2Ygb2JzZXJ2ZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgLy8gV2UncmUgaW4gdGhlIHByb2Nlc3Mgb2Ygc2V0dGluZyB1cCBhbiBvYnNlcnZlIGZvciB0aGlzIGNvbm5lY3Rpb24uIFdlXG4gICAgICAgIC8vIGNhbid0IGNsZWFuIHVwIHRoYXQgb2JzZXJ2ZSB5ZXQsIGJ1dCBpZiB3ZSBkZWxldGUgdGhlIHBsYWNlaG9sZGVyIGZvclxuICAgICAgICAvLyB0aGlzIGNvbm5lY3Rpb24sIHRoZW4gdGhlIG9ic2VydmUgd2lsbCBnZXQgY2xlYW5lZCB1cCBhcyBzb29uIGFzIGl0IGhhc1xuICAgICAgICAvLyBiZWVuIHNldCB1cC5cbiAgICAgICAgZGVsZXRlIHRoaXMuX3VzZXJPYnNlcnZlc0ZvckNvbm5lY3Rpb25zW2Nvbm5lY3Rpb25JZF07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkZWxldGUgdGhpcy5fdXNlck9ic2VydmVzRm9yQ29ubmVjdGlvbnNbY29ubmVjdGlvbklkXTtcbiAgICAgICAgb2JzZXJ2ZS5zdG9wKCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIF9nZXRMb2dpblRva2VuKGNvbm5lY3Rpb25JZCkge1xuICAgIHJldHVybiB0aGlzLl9nZXRBY2NvdW50RGF0YShjb25uZWN0aW9uSWQsICdsb2dpblRva2VuJyk7XG4gIH07XG5cbiAgLy8gbmV3VG9rZW4gaXMgYSBoYXNoZWQgdG9rZW4uXG4gIF9zZXRMb2dpblRva2VuKHVzZXJJZCwgY29ubmVjdGlvbiwgbmV3VG9rZW4pIHtcbiAgICB0aGlzLl9yZW1vdmVUb2tlbkZyb21Db25uZWN0aW9uKGNvbm5lY3Rpb24uaWQpO1xuICAgIHRoaXMuX3NldEFjY291bnREYXRhKGNvbm5lY3Rpb24uaWQsICdsb2dpblRva2VuJywgbmV3VG9rZW4pO1xuXG4gICAgaWYgKG5ld1Rva2VuKSB7XG4gICAgICAvLyBTZXQgdXAgYW4gb2JzZXJ2ZSBmb3IgdGhpcyB0b2tlbi4gSWYgdGhlIHRva2VuIGdvZXMgYXdheSwgd2UgbmVlZFxuICAgICAgLy8gdG8gY2xvc2UgdGhlIGNvbm5lY3Rpb24uICBXZSBkZWZlciB0aGUgb2JzZXJ2ZSBiZWNhdXNlIHRoZXJlJ3NcbiAgICAgIC8vIG5vIG5lZWQgZm9yIGl0IHRvIGJlIG9uIHRoZSBjcml0aWNhbCBwYXRoIGZvciBsb2dpbjsgd2UganVzdCBuZWVkXG4gICAgICAvLyB0byBlbnN1cmUgdGhhdCB0aGUgY29ubmVjdGlvbiB3aWxsIGdldCBjbG9zZWQgYXQgc29tZSBwb2ludCBpZlxuICAgICAgLy8gdGhlIHRva2VuIGdldHMgZGVsZXRlZC5cbiAgICAgIC8vXG4gICAgICAvLyBJbml0aWFsbHksIHdlIHNldCB0aGUgb2JzZXJ2ZSBmb3IgdGhpcyBjb25uZWN0aW9uIHRvIGEgbnVtYmVyOyB0aGlzXG4gICAgICAvLyBzaWduaWZpZXMgdG8gb3RoZXIgY29kZSAod2hpY2ggbWlnaHQgcnVuIHdoaWxlIHdlIHlpZWxkKSB0aGF0IHdlIGFyZSBpblxuICAgICAgLy8gdGhlIHByb2Nlc3Mgb2Ygc2V0dGluZyB1cCBhbiBvYnNlcnZlIGZvciB0aGlzIGNvbm5lY3Rpb24uIE9uY2UgdGhlXG4gICAgICAvLyBvYnNlcnZlIGlzIHJlYWR5IHRvIGdvLCB3ZSByZXBsYWNlIHRoZSBudW1iZXIgd2l0aCB0aGUgcmVhbCBvYnNlcnZlXG4gICAgICAvLyBoYW5kbGUgKHVubGVzcyB0aGUgcGxhY2Vob2xkZXIgaGFzIGJlZW4gZGVsZXRlZCBvciByZXBsYWNlZCBieSBhXG4gICAgICAvLyBkaWZmZXJlbnQgcGxhY2Vob2xkIG51bWJlciwgc2lnbmlmeWluZyB0aGF0IHRoZSBjb25uZWN0aW9uIHdhcyBjbG9zZWRcbiAgICAgIC8vIGFscmVhZHkgLS0gaW4gdGhpcyBjYXNlIHdlIGp1c3QgY2xlYW4gdXAgdGhlIG9ic2VydmUgdGhhdCB3ZSBzdGFydGVkKS5cbiAgICAgIGNvbnN0IG15T2JzZXJ2ZU51bWJlciA9ICsrdGhpcy5fbmV4dFVzZXJPYnNlcnZlTnVtYmVyO1xuICAgICAgdGhpcy5fdXNlck9ic2VydmVzRm9yQ29ubmVjdGlvbnNbY29ubmVjdGlvbi5pZF0gPSBteU9ic2VydmVOdW1iZXI7XG4gICAgICBNZXRlb3IuZGVmZXIoKCkgPT4ge1xuICAgICAgICAvLyBJZiBzb21ldGhpbmcgZWxzZSBoYXBwZW5lZCBvbiB0aGlzIGNvbm5lY3Rpb24gaW4gdGhlIG1lYW50aW1lIChpdCBnb3RcbiAgICAgICAgLy8gY2xvc2VkLCBvciBhbm90aGVyIGNhbGwgdG8gX3NldExvZ2luVG9rZW4gaGFwcGVuZWQpLCBqdXN0IGRvXG4gICAgICAgIC8vIG5vdGhpbmcuIFdlIGRvbid0IG5lZWQgdG8gc3RhcnQgYW4gb2JzZXJ2ZSBmb3IgYW4gb2xkIGNvbm5lY3Rpb24gb3Igb2xkXG4gICAgICAgIC8vIHRva2VuLlxuICAgICAgICBpZiAodGhpcy5fdXNlck9ic2VydmVzRm9yQ29ubmVjdGlvbnNbY29ubmVjdGlvbi5pZF0gIT09IG15T2JzZXJ2ZU51bWJlcikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBmb3VuZE1hdGNoaW5nVXNlcjtcbiAgICAgICAgLy8gQmVjYXVzZSB3ZSB1cGdyYWRlIHVuaGFzaGVkIGxvZ2luIHRva2VucyB0byBoYXNoZWQgdG9rZW5zIGF0XG4gICAgICAgIC8vIGxvZ2luIHRpbWUsIHNlc3Npb25zIHdpbGwgb25seSBiZSBsb2dnZWQgaW4gd2l0aCBhIGhhc2hlZFxuICAgICAgICAvLyB0b2tlbi4gVGh1cyB3ZSBvbmx5IG5lZWQgdG8gb2JzZXJ2ZSBoYXNoZWQgdG9rZW5zIGhlcmUuXG4gICAgICAgIGNvbnN0IG9ic2VydmUgPSB0aGlzLnVzZXJzLmZpbmQoe1xuICAgICAgICAgIF9pZDogdXNlcklkLFxuICAgICAgICAgICdzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnMuaGFzaGVkVG9rZW4nOiBuZXdUb2tlblxuICAgICAgICB9LCB7IGZpZWxkczogeyBfaWQ6IDEgfSB9KS5vYnNlcnZlQ2hhbmdlcyh7XG4gICAgICAgICAgYWRkZWQ6ICgpID0+IHtcbiAgICAgICAgICAgIGZvdW5kTWF0Y2hpbmdVc2VyID0gdHJ1ZTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHJlbW92ZWQ6IGNvbm5lY3Rpb24uY2xvc2UsXG4gICAgICAgICAgLy8gVGhlIG9uQ2xvc2UgY2FsbGJhY2sgZm9yIHRoZSBjb25uZWN0aW9uIHRha2VzIGNhcmUgb2ZcbiAgICAgICAgICAvLyBjbGVhbmluZyB1cCB0aGUgb2JzZXJ2ZSBoYW5kbGUgYW5kIGFueSBvdGhlciBzdGF0ZSB3ZSBoYXZlXG4gICAgICAgICAgLy8gbHlpbmcgYXJvdW5kLlxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBJZiB0aGUgdXNlciByYW4gYW5vdGhlciBsb2dpbiBvciBsb2dvdXQgY29tbWFuZCB3ZSB3ZXJlIHdhaXRpbmcgZm9yIHRoZVxuICAgICAgICAvLyBkZWZlciBvciBhZGRlZCB0byBmaXJlIChpZSwgYW5vdGhlciBjYWxsIHRvIF9zZXRMb2dpblRva2VuIG9jY3VycmVkKSxcbiAgICAgICAgLy8gdGhlbiB3ZSBsZXQgdGhlIGxhdGVyIG9uZSB3aW4gKHN0YXJ0IGFuIG9ic2VydmUsIGV0YykgYW5kIGp1c3Qgc3RvcCBvdXJcbiAgICAgICAgLy8gb2JzZXJ2ZSBub3cuXG4gICAgICAgIC8vXG4gICAgICAgIC8vIFNpbWlsYXJseSwgaWYgdGhlIGNvbm5lY3Rpb24gd2FzIGFscmVhZHkgY2xvc2VkLCB0aGVuIHRoZSBvbkNsb3NlXG4gICAgICAgIC8vIGNhbGxiYWNrIHdvdWxkIGhhdmUgY2FsbGVkIF9yZW1vdmVUb2tlbkZyb21Db25uZWN0aW9uIGFuZCB0aGVyZSB3b24ndFxuICAgICAgICAvLyBiZSBhbiBlbnRyeSBpbiBfdXNlck9ic2VydmVzRm9yQ29ubmVjdGlvbnMuIFdlIGNhbiBzdG9wIHRoZSBvYnNlcnZlLlxuICAgICAgICBpZiAodGhpcy5fdXNlck9ic2VydmVzRm9yQ29ubmVjdGlvbnNbY29ubmVjdGlvbi5pZF0gIT09IG15T2JzZXJ2ZU51bWJlcikge1xuICAgICAgICAgIG9ic2VydmUuc3RvcCgpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3VzZXJPYnNlcnZlc0ZvckNvbm5lY3Rpb25zW2Nvbm5lY3Rpb24uaWRdID0gb2JzZXJ2ZTtcblxuICAgICAgICBpZiAoISBmb3VuZE1hdGNoaW5nVXNlcikge1xuICAgICAgICAgIC8vIFdlJ3ZlIHNldCB1cCBhbiBvYnNlcnZlIG9uIHRoZSB1c2VyIGFzc29jaWF0ZWQgd2l0aCBgbmV3VG9rZW5gLFxuICAgICAgICAgIC8vIHNvIGlmIHRoZSBuZXcgdG9rZW4gaXMgcmVtb3ZlZCBmcm9tIHRoZSBkYXRhYmFzZSwgd2UnbGwgY2xvc2VcbiAgICAgICAgICAvLyB0aGUgY29ubmVjdGlvbi4gQnV0IHRoZSB0b2tlbiBtaWdodCBoYXZlIGFscmVhZHkgYmVlbiBkZWxldGVkXG4gICAgICAgICAgLy8gYmVmb3JlIHdlIHNldCB1cCB0aGUgb2JzZXJ2ZSwgd2hpY2ggd291bGRuJ3QgaGF2ZSBjbG9zZWQgdGhlXG4gICAgICAgICAgLy8gY29ubmVjdGlvbiBiZWNhdXNlIHRoZSBvYnNlcnZlIHdhc24ndCBydW5uaW5nIHlldC5cbiAgICAgICAgICBjb25uZWN0aW9uLmNsb3NlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICAvLyAoQWxzbyB1c2VkIGJ5IE1ldGVvciBBY2NvdW50cyBzZXJ2ZXIgYW5kIHRlc3RzKS5cbiAgLy9cbiAgX2dlbmVyYXRlU3RhbXBlZExvZ2luVG9rZW4oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHRva2VuOiBSYW5kb20uc2VjcmV0KCksXG4gICAgICB3aGVuOiBuZXcgRGF0ZVxuICAgIH07XG4gIH07XG5cbiAgLy8vXG4gIC8vLyBUT0tFTiBFWFBJUkFUSU9OXG4gIC8vL1xuXG4gIC8vIERlbGV0ZXMgZXhwaXJlZCBwYXNzd29yZCByZXNldCB0b2tlbnMgZnJvbSB0aGUgZGF0YWJhc2UuXG4gIC8vXG4gIC8vIEV4cG9ydGVkIGZvciB0ZXN0cy4gQWxzbywgdGhlIGFyZ3VtZW50cyBhcmUgb25seSB1c2VkIGJ5XG4gIC8vIHRlc3RzLiBvbGRlc3RWYWxpZERhdGUgaXMgc2ltdWxhdGUgZXhwaXJpbmcgdG9rZW5zIHdpdGhvdXQgd2FpdGluZ1xuICAvLyBmb3IgdGhlbSB0byBhY3R1YWxseSBleHBpcmUuIHVzZXJJZCBpcyB1c2VkIGJ5IHRlc3RzIHRvIG9ubHkgZXhwaXJlXG4gIC8vIHRva2VucyBmb3IgdGhlIHRlc3QgdXNlci5cbiAgX2V4cGlyZVBhc3N3b3JkUmVzZXRUb2tlbnMob2xkZXN0VmFsaWREYXRlLCB1c2VySWQpIHtcbiAgICBjb25zdCB0b2tlbkxpZmV0aW1lTXMgPSB0aGlzLl9nZXRQYXNzd29yZFJlc2V0VG9rZW5MaWZldGltZU1zKCk7XG5cbiAgICAvLyB3aGVuIGNhbGxpbmcgZnJvbSBhIHRlc3Qgd2l0aCBleHRyYSBhcmd1bWVudHMsIHlvdSBtdXN0IHNwZWNpZnkgYm90aCFcbiAgICBpZiAoKG9sZGVzdFZhbGlkRGF0ZSAmJiAhdXNlcklkKSB8fCAoIW9sZGVzdFZhbGlkRGF0ZSAmJiB1c2VySWQpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJCYWQgdGVzdC4gTXVzdCBzcGVjaWZ5IGJvdGggb2xkZXN0VmFsaWREYXRlIGFuZCB1c2VySWQuXCIpO1xuICAgIH1cblxuICAgIG9sZGVzdFZhbGlkRGF0ZSA9IG9sZGVzdFZhbGlkRGF0ZSB8fFxuICAgICAgKG5ldyBEYXRlKG5ldyBEYXRlKCkgLSB0b2tlbkxpZmV0aW1lTXMpKTtcblxuICAgIGNvbnN0IHRva2VuRmlsdGVyID0ge1xuICAgICAgJG9yOiBbXG4gICAgICAgIHsgXCJzZXJ2aWNlcy5wYXNzd29yZC5yZXNldC5yZWFzb25cIjogXCJyZXNldFwifSxcbiAgICAgICAgeyBcInNlcnZpY2VzLnBhc3N3b3JkLnJlc2V0LnJlYXNvblwiOiB7JGV4aXN0czogZmFsc2V9fVxuICAgICAgXVxuICAgIH07XG5cbiAgICBleHBpcmVQYXNzd29yZFRva2VuKHRoaXMsIG9sZGVzdFZhbGlkRGF0ZSwgdG9rZW5GaWx0ZXIsIHVzZXJJZCk7XG4gIH1cblxuICAvLyBEZWxldGVzIGV4cGlyZWQgcGFzc3dvcmQgZW5yb2xsIHRva2VucyBmcm9tIHRoZSBkYXRhYmFzZS5cbiAgLy9cbiAgLy8gRXhwb3J0ZWQgZm9yIHRlc3RzLiBBbHNvLCB0aGUgYXJndW1lbnRzIGFyZSBvbmx5IHVzZWQgYnlcbiAgLy8gdGVzdHMuIG9sZGVzdFZhbGlkRGF0ZSBpcyBzaW11bGF0ZSBleHBpcmluZyB0b2tlbnMgd2l0aG91dCB3YWl0aW5nXG4gIC8vIGZvciB0aGVtIHRvIGFjdHVhbGx5IGV4cGlyZS4gdXNlcklkIGlzIHVzZWQgYnkgdGVzdHMgdG8gb25seSBleHBpcmVcbiAgLy8gdG9rZW5zIGZvciB0aGUgdGVzdCB1c2VyLlxuICBfZXhwaXJlUGFzc3dvcmRFbnJvbGxUb2tlbnMob2xkZXN0VmFsaWREYXRlLCB1c2VySWQpIHtcbiAgICBjb25zdCB0b2tlbkxpZmV0aW1lTXMgPSB0aGlzLl9nZXRQYXNzd29yZEVucm9sbFRva2VuTGlmZXRpbWVNcygpO1xuXG4gICAgLy8gd2hlbiBjYWxsaW5nIGZyb20gYSB0ZXN0IHdpdGggZXh0cmEgYXJndW1lbnRzLCB5b3UgbXVzdCBzcGVjaWZ5IGJvdGghXG4gICAgaWYgKChvbGRlc3RWYWxpZERhdGUgJiYgIXVzZXJJZCkgfHwgKCFvbGRlc3RWYWxpZERhdGUgJiYgdXNlcklkKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQmFkIHRlc3QuIE11c3Qgc3BlY2lmeSBib3RoIG9sZGVzdFZhbGlkRGF0ZSBhbmQgdXNlcklkLlwiKTtcbiAgICB9XG5cbiAgICBvbGRlc3RWYWxpZERhdGUgPSBvbGRlc3RWYWxpZERhdGUgfHxcbiAgICAgIChuZXcgRGF0ZShuZXcgRGF0ZSgpIC0gdG9rZW5MaWZldGltZU1zKSk7XG5cbiAgICBjb25zdCB0b2tlbkZpbHRlciA9IHtcbiAgICAgIFwic2VydmljZXMucGFzc3dvcmQucmVzZXQucmVhc29uXCI6IFwiZW5yb2xsXCJcbiAgICB9O1xuXG4gICAgZXhwaXJlUGFzc3dvcmRUb2tlbih0aGlzLCBvbGRlc3RWYWxpZERhdGUsIHRva2VuRmlsdGVyLCB1c2VySWQpO1xuICB9XG5cbiAgLy8gRGVsZXRlcyBleHBpcmVkIHRva2VucyBmcm9tIHRoZSBkYXRhYmFzZSBhbmQgY2xvc2VzIGFsbCBvcGVuIGNvbm5lY3Rpb25zXG4gIC8vIGFzc29jaWF0ZWQgd2l0aCB0aGVzZSB0b2tlbnMuXG4gIC8vXG4gIC8vIEV4cG9ydGVkIGZvciB0ZXN0cy4gQWxzbywgdGhlIGFyZ3VtZW50cyBhcmUgb25seSB1c2VkIGJ5XG4gIC8vIHRlc3RzLiBvbGRlc3RWYWxpZERhdGUgaXMgc2ltdWxhdGUgZXhwaXJpbmcgdG9rZW5zIHdpdGhvdXQgd2FpdGluZ1xuICAvLyBmb3IgdGhlbSB0byBhY3R1YWxseSBleHBpcmUuIHVzZXJJZCBpcyB1c2VkIGJ5IHRlc3RzIHRvIG9ubHkgZXhwaXJlXG4gIC8vIHRva2VucyBmb3IgdGhlIHRlc3QgdXNlci5cbiAgX2V4cGlyZVRva2VucyhvbGRlc3RWYWxpZERhdGUsIHVzZXJJZCkge1xuICAgIGNvbnN0IHRva2VuTGlmZXRpbWVNcyA9IHRoaXMuX2dldFRva2VuTGlmZXRpbWVNcygpO1xuXG4gICAgLy8gd2hlbiBjYWxsaW5nIGZyb20gYSB0ZXN0IHdpdGggZXh0cmEgYXJndW1lbnRzLCB5b3UgbXVzdCBzcGVjaWZ5IGJvdGghXG4gICAgaWYgKChvbGRlc3RWYWxpZERhdGUgJiYgIXVzZXJJZCkgfHwgKCFvbGRlc3RWYWxpZERhdGUgJiYgdXNlcklkKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQmFkIHRlc3QuIE11c3Qgc3BlY2lmeSBib3RoIG9sZGVzdFZhbGlkRGF0ZSBhbmQgdXNlcklkLlwiKTtcbiAgICB9XG5cbiAgICBvbGRlc3RWYWxpZERhdGUgPSBvbGRlc3RWYWxpZERhdGUgfHxcbiAgICAgIChuZXcgRGF0ZShuZXcgRGF0ZSgpIC0gdG9rZW5MaWZldGltZU1zKSk7XG4gICAgY29uc3QgdXNlckZpbHRlciA9IHVzZXJJZCA/IHtfaWQ6IHVzZXJJZH0gOiB7fTtcblxuXG4gICAgLy8gQmFja3dhcmRzIGNvbXBhdGlibGUgd2l0aCBvbGRlciB2ZXJzaW9ucyBvZiBtZXRlb3IgdGhhdCBzdG9yZWQgbG9naW4gdG9rZW5cbiAgICAvLyB0aW1lc3RhbXBzIGFzIG51bWJlcnMuXG4gICAgdGhpcy51c2Vycy51cGRhdGUoeyAuLi51c2VyRmlsdGVyLFxuICAgICAgJG9yOiBbXG4gICAgICAgIHsgXCJzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnMud2hlblwiOiB7ICRsdDogb2xkZXN0VmFsaWREYXRlIH0gfSxcbiAgICAgICAgeyBcInNlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucy53aGVuXCI6IHsgJGx0OiArb2xkZXN0VmFsaWREYXRlIH0gfVxuICAgICAgXVxuICAgIH0sIHtcbiAgICAgICRwdWxsOiB7XG4gICAgICAgIFwic2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zXCI6IHtcbiAgICAgICAgICAkb3I6IFtcbiAgICAgICAgICAgIHsgd2hlbjogeyAkbHQ6IG9sZGVzdFZhbGlkRGF0ZSB9IH0sXG4gICAgICAgICAgICB7IHdoZW46IHsgJGx0OiArb2xkZXN0VmFsaWREYXRlIH0gfVxuICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIHsgbXVsdGk6IHRydWUgfSk7XG4gICAgLy8gVGhlIG9ic2VydmUgb24gTWV0ZW9yLnVzZXJzIHdpbGwgdGFrZSBjYXJlIG9mIGNsb3NpbmcgY29ubmVjdGlvbnMgZm9yXG4gICAgLy8gZXhwaXJlZCB0b2tlbnMuXG4gIH07XG5cbiAgLy8gQG92ZXJyaWRlIGZyb20gYWNjb3VudHNfY29tbW9uLmpzXG4gIGNvbmZpZyhvcHRpb25zKSB7XG4gICAgLy8gQ2FsbCB0aGUgb3ZlcnJpZGRlbiBpbXBsZW1lbnRhdGlvbiBvZiB0aGUgbWV0aG9kLlxuICAgIGNvbnN0IHN1cGVyUmVzdWx0ID0gQWNjb3VudHNDb21tb24ucHJvdG90eXBlLmNvbmZpZy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgLy8gSWYgdGhlIHVzZXIgc2V0IGxvZ2luRXhwaXJhdGlvbkluRGF5cyB0byBudWxsLCB0aGVuIHdlIG5lZWQgdG8gY2xlYXIgdGhlXG4gICAgLy8gdGltZXIgdGhhdCBwZXJpb2RpY2FsbHkgZXhwaXJlcyB0b2tlbnMuXG4gICAgaWYgKGhhc093bi5jYWxsKHRoaXMuX29wdGlvbnMsICdsb2dpbkV4cGlyYXRpb25JbkRheXMnKSAmJlxuICAgICAgdGhpcy5fb3B0aW9ucy5sb2dpbkV4cGlyYXRpb25JbkRheXMgPT09IG51bGwgJiZcbiAgICAgIHRoaXMuZXhwaXJlVG9rZW5JbnRlcnZhbCkge1xuICAgICAgTWV0ZW9yLmNsZWFySW50ZXJ2YWwodGhpcy5leHBpcmVUb2tlbkludGVydmFsKTtcbiAgICAgIHRoaXMuZXhwaXJlVG9rZW5JbnRlcnZhbCA9IG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN1cGVyUmVzdWx0O1xuICB9O1xuXG4gIC8vIENhbGxlZCBieSBhY2NvdW50cy1wYXNzd29yZFxuICBpbnNlcnRVc2VyRG9jKG9wdGlvbnMsIHVzZXIpIHtcbiAgICAvLyAtIGNsb25lIHVzZXIgZG9jdW1lbnQsIHRvIHByb3RlY3QgZnJvbSBtb2RpZmljYXRpb25cbiAgICAvLyAtIGFkZCBjcmVhdGVkQXQgdGltZXN0YW1wXG4gICAgLy8gLSBwcmVwYXJlIGFuIF9pZCwgc28gdGhhdCB5b3UgY2FuIG1vZGlmeSBvdGhlciBjb2xsZWN0aW9ucyAoZWdcbiAgICAvLyBjcmVhdGUgYSBmaXJzdCB0YXNrIGZvciBldmVyeSBuZXcgdXNlcilcbiAgICAvL1xuICAgIC8vIFhYWCBJZiB0aGUgb25DcmVhdGVVc2VyIG9yIHZhbGlkYXRlTmV3VXNlciBob29rcyBmYWlsLCB3ZSBtaWdodFxuICAgIC8vIGVuZCB1cCBoYXZpbmcgbW9kaWZpZWQgc29tZSBvdGhlciBjb2xsZWN0aW9uXG4gICAgLy8gaW5hcHByb3ByaWF0ZWx5LiBUaGUgc29sdXRpb24gaXMgcHJvYmFibHkgdG8gaGF2ZSBvbkNyZWF0ZVVzZXJcbiAgICAvLyBhY2NlcHQgdHdvIGNhbGxiYWNrcyAtIG9uZSB0aGF0IGdldHMgY2FsbGVkIGJlZm9yZSBpbnNlcnRpbmdcbiAgICAvLyB0aGUgdXNlciBkb2N1bWVudCAoaW4gd2hpY2ggeW91IGNhbiBtb2RpZnkgaXRzIGNvbnRlbnRzKSwgYW5kXG4gICAgLy8gb25lIHRoYXQgZ2V0cyBjYWxsZWQgYWZ0ZXIgKGluIHdoaWNoIHlvdSBzaG91bGQgY2hhbmdlIG90aGVyXG4gICAgLy8gY29sbGVjdGlvbnMpXG4gICAgdXNlciA9IHtcbiAgICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoKSxcbiAgICAgIF9pZDogUmFuZG9tLmlkKCksXG4gICAgICAuLi51c2VyLFxuICAgIH07XG5cbiAgICBpZiAodXNlci5zZXJ2aWNlcykge1xuICAgICAgT2JqZWN0LmtleXModXNlci5zZXJ2aWNlcykuZm9yRWFjaChzZXJ2aWNlID0+XG4gICAgICAgIHBpbkVuY3J5cHRlZEZpZWxkc1RvVXNlcih1c2VyLnNlcnZpY2VzW3NlcnZpY2VdLCB1c2VyLl9pZClcbiAgICAgICk7XG4gICAgfVxuXG4gICAgbGV0IGZ1bGxVc2VyO1xuICAgIGlmICh0aGlzLl9vbkNyZWF0ZVVzZXJIb29rKSB7XG4gICAgICBmdWxsVXNlciA9IHRoaXMuX29uQ3JlYXRlVXNlckhvb2sob3B0aW9ucywgdXNlcik7XG5cbiAgICAgIC8vIFRoaXMgaXMgKm5vdCogcGFydCBvZiB0aGUgQVBJLiBXZSBuZWVkIHRoaXMgYmVjYXVzZSB3ZSBjYW4ndCBpc29sYXRlXG4gICAgICAvLyB0aGUgZ2xvYmFsIHNlcnZlciBlbnZpcm9ubWVudCBiZXR3ZWVuIHRlc3RzLCBtZWFuaW5nIHdlIGNhbid0IHRlc3RcbiAgICAgIC8vIGJvdGggaGF2aW5nIGEgY3JlYXRlIHVzZXIgaG9vayBzZXQgYW5kIG5vdCBoYXZpbmcgb25lIHNldC5cbiAgICAgIGlmIChmdWxsVXNlciA9PT0gJ1RFU1QgREVGQVVMVCBIT09LJylcbiAgICAgICAgZnVsbFVzZXIgPSBkZWZhdWx0Q3JlYXRlVXNlckhvb2sob3B0aW9ucywgdXNlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZ1bGxVc2VyID0gZGVmYXVsdENyZWF0ZVVzZXJIb29rKG9wdGlvbnMsIHVzZXIpO1xuICAgIH1cblxuICAgIHRoaXMuX3ZhbGlkYXRlTmV3VXNlckhvb2tzLmZvckVhY2goaG9vayA9PiB7XG4gICAgICBpZiAoISBob29rKGZ1bGxVc2VyKSlcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiVXNlciB2YWxpZGF0aW9uIGZhaWxlZFwiKTtcbiAgICB9KTtcblxuICAgIGxldCB1c2VySWQ7XG4gICAgdHJ5IHtcbiAgICAgIHVzZXJJZCA9IHRoaXMudXNlcnMuaW5zZXJ0KGZ1bGxVc2VyKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAvLyBYWFggc3RyaW5nIHBhcnNpbmcgc3Vja3MsIG1heWJlXG4gICAgICAvLyBodHRwczovL2ppcmEubW9uZ29kYi5vcmcvYnJvd3NlL1NFUlZFUi0zMDY5IHdpbGwgZ2V0IGZpeGVkIG9uZSBkYXlcbiAgICAgIGlmICghZS5lcnJtc2cpIHRocm93IGU7XG4gICAgICBpZiAoZS5lcnJtc2cuaW5jbHVkZXMoJ2VtYWlscy5hZGRyZXNzJykpXG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBcIkVtYWlsIGFscmVhZHkgZXhpc3RzLlwiKTtcbiAgICAgIGlmIChlLmVycm1zZy5pbmNsdWRlcygndXNlcm5hbWUnKSlcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiVXNlcm5hbWUgYWxyZWFkeSBleGlzdHMuXCIpO1xuICAgICAgdGhyb3cgZTtcbiAgICB9XG4gICAgcmV0dXJuIHVzZXJJZDtcbiAgfTtcblxuICAvLyBIZWxwZXIgZnVuY3Rpb246IHJldHVybnMgZmFsc2UgaWYgZW1haWwgZG9lcyBub3QgbWF0Y2ggY29tcGFueSBkb21haW4gZnJvbVxuICAvLyB0aGUgY29uZmlndXJhdGlvbi5cbiAgX3Rlc3RFbWFpbERvbWFpbihlbWFpbCkge1xuICAgIGNvbnN0IGRvbWFpbiA9IHRoaXMuX29wdGlvbnMucmVzdHJpY3RDcmVhdGlvbkJ5RW1haWxEb21haW47XG5cbiAgICByZXR1cm4gIWRvbWFpbiB8fFxuICAgICAgKHR5cGVvZiBkb21haW4gPT09ICdmdW5jdGlvbicgJiYgZG9tYWluKGVtYWlsKSkgfHxcbiAgICAgICh0eXBlb2YgZG9tYWluID09PSAnc3RyaW5nJyAmJlxuICAgICAgICAobmV3IFJlZ0V4cChgQCR7TWV0ZW9yLl9lc2NhcGVSZWdFeHAoZG9tYWluKX0kYCwgJ2knKSkudGVzdChlbWFpbCkpO1xuICB9O1xuXG4gIC8vL1xuICAvLy8gQ0xFQU4gVVAgRk9SIGBsb2dvdXRPdGhlckNsaWVudHNgXG4gIC8vL1xuXG4gIF9kZWxldGVTYXZlZFRva2Vuc0ZvclVzZXIodXNlcklkLCB0b2tlbnNUb0RlbGV0ZSkge1xuICAgIGlmICh0b2tlbnNUb0RlbGV0ZSkge1xuICAgICAgdGhpcy51c2Vycy51cGRhdGUodXNlcklkLCB7XG4gICAgICAgICR1bnNldDoge1xuICAgICAgICAgIFwic2VydmljZXMucmVzdW1lLmhhdmVMb2dpblRva2Vuc1RvRGVsZXRlXCI6IDEsXG4gICAgICAgICAgXCJzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnNUb0RlbGV0ZVwiOiAxXG4gICAgICAgIH0sXG4gICAgICAgICRwdWxsQWxsOiB7XG4gICAgICAgICAgXCJzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnNcIjogdG9rZW5zVG9EZWxldGVcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gIF9kZWxldGVTYXZlZFRva2Vuc0ZvckFsbFVzZXJzT25TdGFydHVwKCkge1xuICAgIC8vIElmIHdlIGZpbmQgdXNlcnMgd2hvIGhhdmUgc2F2ZWQgdG9rZW5zIHRvIGRlbGV0ZSBvbiBzdGFydHVwLCBkZWxldGVcbiAgICAvLyB0aGVtIG5vdy4gSXQncyBwb3NzaWJsZSB0aGF0IHRoZSBzZXJ2ZXIgY291bGQgaGF2ZSBjcmFzaGVkIGFuZCBjb21lXG4gICAgLy8gYmFjayB1cCBiZWZvcmUgbmV3IHRva2VucyBhcmUgZm91bmQgaW4gbG9jYWxTdG9yYWdlLCBidXQgdGhpc1xuICAgIC8vIHNob3VsZG4ndCBoYXBwZW4gdmVyeSBvZnRlbi4gV2Ugc2hvdWxkbid0IHB1dCBhIGRlbGF5IGhlcmUgYmVjYXVzZVxuICAgIC8vIHRoYXQgd291bGQgZ2l2ZSBhIGxvdCBvZiBwb3dlciB0byBhbiBhdHRhY2tlciB3aXRoIGEgc3RvbGVuIGxvZ2luXG4gICAgLy8gdG9rZW4gYW5kIHRoZSBhYmlsaXR5IHRvIGNyYXNoIHRoZSBzZXJ2ZXIuXG4gICAgTWV0ZW9yLnN0YXJ0dXAoKCkgPT4ge1xuICAgICAgdGhpcy51c2Vycy5maW5kKHtcbiAgICAgICAgXCJzZXJ2aWNlcy5yZXN1bWUuaGF2ZUxvZ2luVG9rZW5zVG9EZWxldGVcIjogdHJ1ZVxuICAgICAgfSwge1xuICAgICAgICBcInNlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vuc1RvRGVsZXRlXCI6IDFcbiAgICAgIH0pLmZvckVhY2godXNlciA9PiB7XG4gICAgICAgIHRoaXMuX2RlbGV0ZVNhdmVkVG9rZW5zRm9yVXNlcihcbiAgICAgICAgICB1c2VyLl9pZCxcbiAgICAgICAgICB1c2VyLnNlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vuc1RvRGVsZXRlXG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcblxuICAvLy9cbiAgLy8vIE1BTkFHSU5HIFVTRVIgT0JKRUNUU1xuICAvLy9cblxuICAvLyBVcGRhdGVzIG9yIGNyZWF0ZXMgYSB1c2VyIGFmdGVyIHdlIGF1dGhlbnRpY2F0ZSB3aXRoIGEgM3JkIHBhcnR5LlxuICAvL1xuICAvLyBAcGFyYW0gc2VydmljZU5hbWUge1N0cmluZ30gU2VydmljZSBuYW1lIChlZywgdHdpdHRlcikuXG4gIC8vIEBwYXJhbSBzZXJ2aWNlRGF0YSB7T2JqZWN0fSBEYXRhIHRvIHN0b3JlIGluIHRoZSB1c2VyJ3MgcmVjb3JkXG4gIC8vICAgICAgICB1bmRlciBzZXJ2aWNlc1tzZXJ2aWNlTmFtZV0uIE11c3QgaW5jbHVkZSBhbiBcImlkXCIgZmllbGRcbiAgLy8gICAgICAgIHdoaWNoIGlzIGEgdW5pcXVlIGlkZW50aWZpZXIgZm9yIHRoZSB1c2VyIGluIHRoZSBzZXJ2aWNlLlxuICAvLyBAcGFyYW0gb3B0aW9ucyB7T2JqZWN0LCBvcHRpb25hbH0gT3RoZXIgb3B0aW9ucyB0byBwYXNzIHRvIGluc2VydFVzZXJEb2NcbiAgLy8gICAgICAgIChlZywgcHJvZmlsZSlcbiAgLy8gQHJldHVybnMge09iamVjdH0gT2JqZWN0IHdpdGggdG9rZW4gYW5kIGlkIGtleXMsIGxpa2UgdGhlIHJlc3VsdFxuICAvLyAgICAgICAgb2YgdGhlIFwibG9naW5cIiBtZXRob2QuXG4gIC8vXG4gIHVwZGF0ZU9yQ3JlYXRlVXNlckZyb21FeHRlcm5hbFNlcnZpY2UoXG4gICAgc2VydmljZU5hbWUsXG4gICAgc2VydmljZURhdGEsXG4gICAgb3B0aW9uc1xuICApIHtcbiAgICBvcHRpb25zID0geyAuLi5vcHRpb25zIH07XG5cbiAgICBpZiAoc2VydmljZU5hbWUgPT09IFwicGFzc3dvcmRcIiB8fCBzZXJ2aWNlTmFtZSA9PT0gXCJyZXN1bWVcIikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBcIkNhbid0IHVzZSB1cGRhdGVPckNyZWF0ZVVzZXJGcm9tRXh0ZXJuYWxTZXJ2aWNlIHdpdGggaW50ZXJuYWwgc2VydmljZSBcIlxuICAgICAgICArIHNlcnZpY2VOYW1lKTtcbiAgICB9XG4gICAgaWYgKCFoYXNPd24uY2FsbChzZXJ2aWNlRGF0YSwgJ2lkJykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYFNlcnZpY2UgZGF0YSBmb3Igc2VydmljZSAke3NlcnZpY2VOYW1lfSBtdXN0IGluY2x1ZGUgaWRgKTtcbiAgICB9XG5cbiAgICAvLyBMb29rIGZvciBhIHVzZXIgd2l0aCB0aGUgYXBwcm9wcmlhdGUgc2VydmljZSB1c2VyIGlkLlxuICAgIGNvbnN0IHNlbGVjdG9yID0ge307XG4gICAgY29uc3Qgc2VydmljZUlkS2V5ID0gYHNlcnZpY2VzLiR7c2VydmljZU5hbWV9LmlkYDtcblxuICAgIC8vIFhYWCBUZW1wb3Jhcnkgc3BlY2lhbCBjYXNlIGZvciBUd2l0dGVyLiAoSXNzdWUgIzYyOSlcbiAgICAvLyAgIFRoZSBzZXJ2aWNlRGF0YS5pZCB3aWxsIGJlIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIGFuIGludGVnZXIuXG4gICAgLy8gICBXZSB3YW50IGl0IHRvIG1hdGNoIGVpdGhlciBhIHN0b3JlZCBzdHJpbmcgb3IgaW50IHJlcHJlc2VudGF0aW9uLlxuICAgIC8vICAgVGhpcyBpcyB0byBjYXRlciB0byBlYXJsaWVyIHZlcnNpb25zIG9mIE1ldGVvciBzdG9yaW5nIHR3aXR0ZXJcbiAgICAvLyAgIHVzZXIgSURzIGluIG51bWJlciBmb3JtLCBhbmQgcmVjZW50IHZlcnNpb25zIHN0b3JpbmcgdGhlbSBhcyBzdHJpbmdzLlxuICAgIC8vICAgVGhpcyBjYW4gYmUgcmVtb3ZlZCBvbmNlIG1pZ3JhdGlvbiB0ZWNobm9sb2d5IGlzIGluIHBsYWNlLCBhbmQgdHdpdHRlclxuICAgIC8vICAgdXNlcnMgc3RvcmVkIHdpdGggaW50ZWdlciBJRHMgaGF2ZSBiZWVuIG1pZ3JhdGVkIHRvIHN0cmluZyBJRHMuXG4gICAgaWYgKHNlcnZpY2VOYW1lID09PSBcInR3aXR0ZXJcIiAmJiAhaXNOYU4oc2VydmljZURhdGEuaWQpKSB7XG4gICAgICBzZWxlY3RvcltcIiRvclwiXSA9IFt7fSx7fV07XG4gICAgICBzZWxlY3RvcltcIiRvclwiXVswXVtzZXJ2aWNlSWRLZXldID0gc2VydmljZURhdGEuaWQ7XG4gICAgICBzZWxlY3RvcltcIiRvclwiXVsxXVtzZXJ2aWNlSWRLZXldID0gcGFyc2VJbnQoc2VydmljZURhdGEuaWQsIDEwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2VsZWN0b3Jbc2VydmljZUlkS2V5XSA9IHNlcnZpY2VEYXRhLmlkO1xuICAgIH1cblxuICAgIGxldCB1c2VyID0gdGhpcy51c2Vycy5maW5kT25lKHNlbGVjdG9yKTtcblxuICAgIC8vIFdoZW4gY3JlYXRpbmcgYSBuZXcgdXNlciB3ZSBwYXNzIHRocm91Z2ggYWxsIG9wdGlvbnMuIFdoZW4gdXBkYXRpbmcgYW5cbiAgICAvLyBleGlzdGluZyB1c2VyLCBieSBkZWZhdWx0IHdlIG9ubHkgcHJvY2Vzcy9wYXNzIHRocm91Z2ggdGhlIHNlcnZpY2VEYXRhXG4gICAgLy8gKGVnLCBzbyB0aGF0IHdlIGtlZXAgYW4gdW5leHBpcmVkIGFjY2VzcyB0b2tlbiBhbmQgZG9uJ3QgY2FjaGUgb2xkIGVtYWlsXG4gICAgLy8gYWRkcmVzc2VzIGluIHNlcnZpY2VEYXRhLmVtYWlsKS4gVGhlIG9uRXh0ZXJuYWxMb2dpbiBob29rIGNhbiBiZSB1c2VkIHdoZW5cbiAgICAvLyBjcmVhdGluZyBvciB1cGRhdGluZyBhIHVzZXIsIHRvIG1vZGlmeSBvciBwYXNzIHRocm91Z2ggbW9yZSBvcHRpb25zIGFzXG4gICAgLy8gbmVlZGVkLlxuICAgIGxldCBvcHRzID0gdXNlciA/IHt9IDogb3B0aW9ucztcbiAgICBpZiAodGhpcy5fb25FeHRlcm5hbExvZ2luSG9vaykge1xuICAgICAgb3B0cyA9IHRoaXMuX29uRXh0ZXJuYWxMb2dpbkhvb2sob3B0aW9ucywgdXNlcik7XG4gICAgfVxuXG4gICAgaWYgKHVzZXIpIHtcbiAgICAgIHBpbkVuY3J5cHRlZEZpZWxkc1RvVXNlcihzZXJ2aWNlRGF0YSwgdXNlci5faWQpO1xuXG4gICAgICBsZXQgc2V0QXR0cnMgPSB7fTtcbiAgICAgIE9iamVjdC5rZXlzKHNlcnZpY2VEYXRhKS5mb3JFYWNoKGtleSA9PlxuICAgICAgICBzZXRBdHRyc1tgc2VydmljZXMuJHtzZXJ2aWNlTmFtZX0uJHtrZXl9YF0gPSBzZXJ2aWNlRGF0YVtrZXldXG4gICAgICApO1xuXG4gICAgICAvLyBYWFggTWF5YmUgd2Ugc2hvdWxkIHJlLXVzZSB0aGUgc2VsZWN0b3IgYWJvdmUgYW5kIG5vdGljZSBpZiB0aGUgdXBkYXRlXG4gICAgICAvLyAgICAgdG91Y2hlcyBub3RoaW5nP1xuICAgICAgc2V0QXR0cnMgPSB7IC4uLnNldEF0dHJzLCAuLi5vcHRzIH07XG4gICAgICB0aGlzLnVzZXJzLnVwZGF0ZSh1c2VyLl9pZCwge1xuICAgICAgICAkc2V0OiBzZXRBdHRyc1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IHNlcnZpY2VOYW1lLFxuICAgICAgICB1c2VySWQ6IHVzZXIuX2lkXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBDcmVhdGUgYSBuZXcgdXNlciB3aXRoIHRoZSBzZXJ2aWNlIGRhdGEuXG4gICAgICB1c2VyID0ge3NlcnZpY2VzOiB7fX07XG4gICAgICB1c2VyLnNlcnZpY2VzW3NlcnZpY2VOYW1lXSA9IHNlcnZpY2VEYXRhO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogc2VydmljZU5hbWUsXG4gICAgICAgIHVzZXJJZDogdGhpcy5pbnNlcnRVc2VyRG9jKG9wdHMsIHVzZXIpXG4gICAgICB9O1xuICAgIH1cbiAgfTtcblxuICAvLyBSZW1vdmVzIGRlZmF1bHQgcmF0ZSBsaW1pdGluZyBydWxlXG4gIHJlbW92ZURlZmF1bHRSYXRlTGltaXQoKSB7XG4gICAgY29uc3QgcmVzcCA9IEREUFJhdGVMaW1pdGVyLnJlbW92ZVJ1bGUodGhpcy5kZWZhdWx0UmF0ZUxpbWl0ZXJSdWxlSWQpO1xuICAgIHRoaXMuZGVmYXVsdFJhdGVMaW1pdGVyUnVsZUlkID0gbnVsbDtcbiAgICByZXR1cm4gcmVzcDtcbiAgfTtcblxuICAvLyBBZGQgYSBkZWZhdWx0IHJ1bGUgb2YgbGltaXRpbmcgbG9naW5zLCBjcmVhdGluZyBuZXcgdXNlcnMgYW5kIHBhc3N3b3JkIHJlc2V0XG4gIC8vIHRvIDUgdGltZXMgZXZlcnkgMTAgc2Vjb25kcyBwZXIgY29ubmVjdGlvbi5cbiAgYWRkRGVmYXVsdFJhdGVMaW1pdCgpIHtcbiAgICBpZiAoIXRoaXMuZGVmYXVsdFJhdGVMaW1pdGVyUnVsZUlkKSB7XG4gICAgICB0aGlzLmRlZmF1bHRSYXRlTGltaXRlclJ1bGVJZCA9IEREUFJhdGVMaW1pdGVyLmFkZFJ1bGUoe1xuICAgICAgICB1c2VySWQ6IG51bGwsXG4gICAgICAgIGNsaWVudEFkZHJlc3M6IG51bGwsXG4gICAgICAgIHR5cGU6ICdtZXRob2QnLFxuICAgICAgICBuYW1lOiBuYW1lID0+IFsnbG9naW4nLCAnY3JlYXRlVXNlcicsICdyZXNldFBhc3N3b3JkJywgJ2ZvcmdvdFBhc3N3b3JkJ11cbiAgICAgICAgICAuaW5jbHVkZXMobmFtZSksXG4gICAgICAgIGNvbm5lY3Rpb25JZDogKGNvbm5lY3Rpb25JZCkgPT4gdHJ1ZSxcbiAgICAgIH0sIDUsIDEwMDAwKTtcbiAgICB9XG4gIH07XG5cbn1cblxuLy8gR2l2ZSBlYWNoIGxvZ2luIGhvb2sgY2FsbGJhY2sgYSBmcmVzaCBjbG9uZWQgY29weSBvZiB0aGUgYXR0ZW1wdFxuLy8gb2JqZWN0LCBidXQgZG9uJ3QgY2xvbmUgdGhlIGNvbm5lY3Rpb24uXG4vL1xuY29uc3QgY2xvbmVBdHRlbXB0V2l0aENvbm5lY3Rpb24gPSAoY29ubmVjdGlvbiwgYXR0ZW1wdCkgPT4ge1xuICBjb25zdCBjbG9uZWRBdHRlbXB0ID0gRUpTT04uY2xvbmUoYXR0ZW1wdCk7XG4gIGNsb25lZEF0dGVtcHQuY29ubmVjdGlvbiA9IGNvbm5lY3Rpb247XG4gIHJldHVybiBjbG9uZWRBdHRlbXB0O1xufTtcblxuY29uc3QgdHJ5TG9naW5NZXRob2QgPSAodHlwZSwgZm4pID0+IHtcbiAgbGV0IHJlc3VsdDtcbiAgdHJ5IHtcbiAgICByZXN1bHQgPSBmbigpO1xuICB9XG4gIGNhdGNoIChlKSB7XG4gICAgcmVzdWx0ID0ge2Vycm9yOiBlfTtcbiAgfVxuXG4gIGlmIChyZXN1bHQgJiYgIXJlc3VsdC50eXBlICYmIHR5cGUpXG4gICAgcmVzdWx0LnR5cGUgPSB0eXBlO1xuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5jb25zdCBzZXR1cERlZmF1bHRMb2dpbkhhbmRsZXJzID0gYWNjb3VudHMgPT4ge1xuICBhY2NvdW50cy5yZWdpc3RlckxvZ2luSGFuZGxlcihcInJlc3VtZVwiLCBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIHJldHVybiBkZWZhdWx0UmVzdW1lTG9naW5IYW5kbGVyLmNhbGwodGhpcywgYWNjb3VudHMsIG9wdGlvbnMpO1xuICB9KTtcbn07XG5cbi8vIExvZ2luIGhhbmRsZXIgZm9yIHJlc3VtZSB0b2tlbnMuXG5jb25zdCBkZWZhdWx0UmVzdW1lTG9naW5IYW5kbGVyID0gKGFjY291bnRzLCBvcHRpb25zKSA9PiB7XG4gIGlmICghb3B0aW9ucy5yZXN1bWUpXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcblxuICBjaGVjayhvcHRpb25zLnJlc3VtZSwgU3RyaW5nKTtcblxuICBjb25zdCBoYXNoZWRUb2tlbiA9IGFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihvcHRpb25zLnJlc3VtZSk7XG5cbiAgLy8gRmlyc3QgbG9vayBmb3IganVzdCB0aGUgbmV3LXN0eWxlIGhhc2hlZCBsb2dpbiB0b2tlbiwgdG8gYXZvaWRcbiAgLy8gc2VuZGluZyB0aGUgdW5oYXNoZWQgdG9rZW4gdG8gdGhlIGRhdGFiYXNlIGluIGEgcXVlcnkgaWYgd2UgZG9uJ3RcbiAgLy8gbmVlZCB0by5cbiAgbGV0IHVzZXIgPSBhY2NvdW50cy51c2Vycy5maW5kT25lKFxuICAgIHtcInNlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucy5oYXNoZWRUb2tlblwiOiBoYXNoZWRUb2tlbn0pO1xuXG4gIGlmICghIHVzZXIpIHtcbiAgICAvLyBJZiB3ZSBkaWRuJ3QgZmluZCB0aGUgaGFzaGVkIGxvZ2luIHRva2VuLCB0cnkgYWxzbyBsb29raW5nIGZvclxuICAgIC8vIHRoZSBvbGQtc3R5bGUgdW5oYXNoZWQgdG9rZW4uICBCdXQgd2UgbmVlZCB0byBsb29rIGZvciBlaXRoZXJcbiAgICAvLyB0aGUgb2xkLXN0eWxlIHRva2VuIE9SIHRoZSBuZXctc3R5bGUgdG9rZW4sIGJlY2F1c2UgYW5vdGhlclxuICAgIC8vIGNsaWVudCBjb25uZWN0aW9uIGxvZ2dpbmcgaW4gc2ltdWx0YW5lb3VzbHkgbWlnaHQgaGF2ZSBhbHJlYWR5XG4gICAgLy8gY29udmVydGVkIHRoZSB0b2tlbi5cbiAgICB1c2VyID0gYWNjb3VudHMudXNlcnMuZmluZE9uZSh7XG4gICAgICAkb3I6IFtcbiAgICAgICAge1wic2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VufSxcbiAgICAgICAge1wic2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLnRva2VuXCI6IG9wdGlvbnMucmVzdW1lfVxuICAgICAgXVxuICAgIH0pO1xuICB9XG5cbiAgaWYgKCEgdXNlcilcbiAgICByZXR1cm4ge1xuICAgICAgZXJyb3I6IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBcIllvdSd2ZSBiZWVuIGxvZ2dlZCBvdXQgYnkgdGhlIHNlcnZlci4gUGxlYXNlIGxvZyBpbiBhZ2Fpbi5cIilcbiAgICB9O1xuXG4gIC8vIEZpbmQgdGhlIHRva2VuLCB3aGljaCB3aWxsIGVpdGhlciBiZSBhbiBvYmplY3Qgd2l0aCBmaWVsZHNcbiAgLy8ge2hhc2hlZFRva2VuLCB3aGVufSBmb3IgYSBoYXNoZWQgdG9rZW4gb3Ige3Rva2VuLCB3aGVufSBmb3IgYW5cbiAgLy8gdW5oYXNoZWQgdG9rZW4uXG4gIGxldCBvbGRVbmhhc2hlZFN0eWxlVG9rZW47XG4gIGxldCB0b2tlbiA9IHVzZXIuc2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmZpbmQodG9rZW4gPT5cbiAgICB0b2tlbi5oYXNoZWRUb2tlbiA9PT0gaGFzaGVkVG9rZW5cbiAgKTtcbiAgaWYgKHRva2VuKSB7XG4gICAgb2xkVW5oYXNoZWRTdHlsZVRva2VuID0gZmFsc2U7XG4gIH0gZWxzZSB7XG4gICAgdG9rZW4gPSB1c2VyLnNlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucy5maW5kKHRva2VuID0+XG4gICAgICB0b2tlbi50b2tlbiA9PT0gb3B0aW9ucy5yZXN1bWVcbiAgICApO1xuICAgIG9sZFVuaGFzaGVkU3R5bGVUb2tlbiA9IHRydWU7XG4gIH1cblxuICBjb25zdCB0b2tlbkV4cGlyZXMgPSBhY2NvdW50cy5fdG9rZW5FeHBpcmF0aW9uKHRva2VuLndoZW4pO1xuICBpZiAobmV3IERhdGUoKSA+PSB0b2tlbkV4cGlyZXMpXG4gICAgcmV0dXJuIHtcbiAgICAgIHVzZXJJZDogdXNlci5faWQsXG4gICAgICBlcnJvcjogbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiWW91ciBzZXNzaW9uIGhhcyBleHBpcmVkLiBQbGVhc2UgbG9nIGluIGFnYWluLlwiKVxuICAgIH07XG5cbiAgLy8gVXBkYXRlIHRvIGEgaGFzaGVkIHRva2VuIHdoZW4gYW4gdW5oYXNoZWQgdG9rZW4gaXMgZW5jb3VudGVyZWQuXG4gIGlmIChvbGRVbmhhc2hlZFN0eWxlVG9rZW4pIHtcbiAgICAvLyBPbmx5IGFkZCB0aGUgbmV3IGhhc2hlZCB0b2tlbiBpZiB0aGUgb2xkIHVuaGFzaGVkIHRva2VuIHN0aWxsXG4gICAgLy8gZXhpc3RzICh0aGlzIGF2b2lkcyByZXN1cnJlY3RpbmcgdGhlIHRva2VuIGlmIGl0IHdhcyBkZWxldGVkXG4gICAgLy8gYWZ0ZXIgd2UgcmVhZCBpdCkuICBVc2luZyAkYWRkVG9TZXQgYXZvaWRzIGdldHRpbmcgYW4gaW5kZXhcbiAgICAvLyBlcnJvciBpZiBhbm90aGVyIGNsaWVudCBsb2dnaW5nIGluIHNpbXVsdGFuZW91c2x5IGhhcyBhbHJlYWR5XG4gICAgLy8gaW5zZXJ0ZWQgdGhlIG5ldyBoYXNoZWQgdG9rZW4uXG4gICAgYWNjb3VudHMudXNlcnMudXBkYXRlKFxuICAgICAge1xuICAgICAgICBfaWQ6IHVzZXIuX2lkLFxuICAgICAgICBcInNlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucy50b2tlblwiOiBvcHRpb25zLnJlc3VtZVxuICAgICAgfSxcbiAgICAgIHskYWRkVG9TZXQ6IHtcbiAgICAgICAgICBcInNlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vuc1wiOiB7XG4gICAgICAgICAgICBcImhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VuLFxuICAgICAgICAgICAgXCJ3aGVuXCI6IHRva2VuLndoZW5cbiAgICAgICAgICB9XG4gICAgICAgIH19XG4gICAgKTtcblxuICAgIC8vIFJlbW92ZSB0aGUgb2xkIHRva2VuICphZnRlciogYWRkaW5nIHRoZSBuZXcsIHNpbmNlIG90aGVyd2lzZVxuICAgIC8vIGFub3RoZXIgY2xpZW50IHRyeWluZyB0byBsb2dpbiBiZXR3ZWVuIG91ciByZW1vdmluZyB0aGUgb2xkIGFuZFxuICAgIC8vIGFkZGluZyB0aGUgbmV3IHdvdWxkbid0IGZpbmQgYSB0b2tlbiB0byBsb2dpbiB3aXRoLlxuICAgIGFjY291bnRzLnVzZXJzLnVwZGF0ZSh1c2VyLl9pZCwge1xuICAgICAgJHB1bGw6IHtcbiAgICAgICAgXCJzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnNcIjogeyBcInRva2VuXCI6IG9wdGlvbnMucmVzdW1lIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgdXNlcklkOiB1c2VyLl9pZCxcbiAgICBzdGFtcGVkTG9naW5Ub2tlbjoge1xuICAgICAgdG9rZW46IG9wdGlvbnMucmVzdW1lLFxuICAgICAgd2hlbjogdG9rZW4ud2hlblxuICAgIH1cbiAgfTtcbn07XG5cbmNvbnN0IGV4cGlyZVBhc3N3b3JkVG9rZW4gPSAoXG4gIGFjY291bnRzLFxuICBvbGRlc3RWYWxpZERhdGUsXG4gIHRva2VuRmlsdGVyLFxuICB1c2VySWRcbikgPT4ge1xuICBjb25zdCB1c2VyRmlsdGVyID0gdXNlcklkID8ge19pZDogdXNlcklkfSA6IHt9O1xuICBjb25zdCByZXNldFJhbmdlT3IgPSB7XG4gICAgJG9yOiBbXG4gICAgICB7IFwic2VydmljZXMucGFzc3dvcmQucmVzZXQud2hlblwiOiB7ICRsdDogb2xkZXN0VmFsaWREYXRlIH0gfSxcbiAgICAgIHsgXCJzZXJ2aWNlcy5wYXNzd29yZC5yZXNldC53aGVuXCI6IHsgJGx0OiArb2xkZXN0VmFsaWREYXRlIH0gfVxuICAgIF1cbiAgfTtcbiAgY29uc3QgZXhwaXJlRmlsdGVyID0geyAkYW5kOiBbdG9rZW5GaWx0ZXIsIHJlc2V0UmFuZ2VPcl0gfTtcblxuICBhY2NvdW50cy51c2Vycy51cGRhdGUoey4uLnVzZXJGaWx0ZXIsIC4uLmV4cGlyZUZpbHRlcn0sIHtcbiAgICAkdW5zZXQ6IHtcbiAgICAgIFwic2VydmljZXMucGFzc3dvcmQucmVzZXRcIjogXCJcIlxuICAgIH1cbiAgfSwgeyBtdWx0aTogdHJ1ZSB9KTtcbn07XG5cbmNvbnN0IHNldEV4cGlyZVRva2Vuc0ludGVydmFsID0gYWNjb3VudHMgPT4ge1xuICBhY2NvdW50cy5leHBpcmVUb2tlbkludGVydmFsID0gTWV0ZW9yLnNldEludGVydmFsKCgpID0+IHtcbiAgICBhY2NvdW50cy5fZXhwaXJlVG9rZW5zKCk7XG4gICAgYWNjb3VudHMuX2V4cGlyZVBhc3N3b3JkUmVzZXRUb2tlbnMoKTtcbiAgICBhY2NvdW50cy5fZXhwaXJlUGFzc3dvcmRFbnJvbGxUb2tlbnMoKTtcbiAgfSwgRVhQSVJFX1RPS0VOU19JTlRFUlZBTF9NUyk7XG59O1xuXG4vLy9cbi8vLyBPQXV0aCBFbmNyeXB0aW9uIFN1cHBvcnRcbi8vL1xuXG5jb25zdCBPQXV0aEVuY3J5cHRpb24gPVxuICBQYWNrYWdlW1wib2F1dGgtZW5jcnlwdGlvblwiXSAmJlxuICBQYWNrYWdlW1wib2F1dGgtZW5jcnlwdGlvblwiXS5PQXV0aEVuY3J5cHRpb247XG5cbmNvbnN0IHVzaW5nT0F1dGhFbmNyeXB0aW9uID0gKCkgPT4ge1xuICByZXR1cm4gT0F1dGhFbmNyeXB0aW9uICYmIE9BdXRoRW5jcnlwdGlvbi5rZXlJc0xvYWRlZCgpO1xufTtcblxuLy8gT0F1dGggc2VydmljZSBkYXRhIGlzIHRlbXBvcmFyaWx5IHN0b3JlZCBpbiB0aGUgcGVuZGluZyBjcmVkZW50aWFsc1xuLy8gY29sbGVjdGlvbiBkdXJpbmcgdGhlIG9hdXRoIGF1dGhlbnRpY2F0aW9uIHByb2Nlc3MuICBTZW5zaXRpdmUgZGF0YVxuLy8gc3VjaCBhcyBhY2Nlc3MgdG9rZW5zIGFyZSBlbmNyeXB0ZWQgd2l0aG91dCB0aGUgdXNlciBpZCBiZWNhdXNlXG4vLyB3ZSBkb24ndCBrbm93IHRoZSB1c2VyIGlkIHlldC4gIFdlIHJlLWVuY3J5cHQgdGhlc2UgZmllbGRzIHdpdGggdGhlXG4vLyB1c2VyIGlkIGluY2x1ZGVkIHdoZW4gc3RvcmluZyB0aGUgc2VydmljZSBkYXRhIHBlcm1hbmVudGx5IGluXG4vLyB0aGUgdXNlcnMgY29sbGVjdGlvbi5cbi8vXG5jb25zdCBwaW5FbmNyeXB0ZWRGaWVsZHNUb1VzZXIgPSAoc2VydmljZURhdGEsIHVzZXJJZCkgPT4ge1xuICBPYmplY3Qua2V5cyhzZXJ2aWNlRGF0YSkuZm9yRWFjaChrZXkgPT4ge1xuICAgIGxldCB2YWx1ZSA9IHNlcnZpY2VEYXRhW2tleV07XG4gICAgaWYgKE9BdXRoRW5jcnlwdGlvbiAmJiBPQXV0aEVuY3J5cHRpb24uaXNTZWFsZWQodmFsdWUpKVxuICAgICAgdmFsdWUgPSBPQXV0aEVuY3J5cHRpb24uc2VhbChPQXV0aEVuY3J5cHRpb24ub3Blbih2YWx1ZSksIHVzZXJJZCk7XG4gICAgc2VydmljZURhdGFba2V5XSA9IHZhbHVlO1xuICB9KTtcbn07XG5cblxuLy8gRW5jcnlwdCB1bmVuY3J5cHRlZCBsb2dpbiBzZXJ2aWNlIHNlY3JldHMgd2hlbiBvYXV0aC1lbmNyeXB0aW9uIGlzXG4vLyBhZGRlZC5cbi8vXG4vLyBYWFggRm9yIHRoZSBvYXV0aFNlY3JldEtleSB0byBiZSBhdmFpbGFibGUgaGVyZSBhdCBzdGFydHVwLCB0aGVcbi8vIGRldmVsb3BlciBtdXN0IGNhbGwgQWNjb3VudHMuY29uZmlnKHtvYXV0aFNlY3JldEtleTogLi4ufSkgYXQgbG9hZFxuLy8gdGltZSwgaW5zdGVhZCBvZiBpbiBhIE1ldGVvci5zdGFydHVwIGJsb2NrLCBiZWNhdXNlIHRoZSBzdGFydHVwXG4vLyBibG9jayBpbiB0aGUgYXBwIGNvZGUgd2lsbCBydW4gYWZ0ZXIgdGhpcyBhY2NvdW50cy1iYXNlIHN0YXJ0dXBcbi8vIGJsb2NrLiAgUGVyaGFwcyB3ZSBuZWVkIGEgcG9zdC1zdGFydHVwIGNhbGxiYWNrP1xuXG5NZXRlb3Iuc3RhcnR1cCgoKSA9PiB7XG4gIGlmICghIHVzaW5nT0F1dGhFbmNyeXB0aW9uKCkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCB7IFNlcnZpY2VDb25maWd1cmF0aW9uIH0gPSBQYWNrYWdlWydzZXJ2aWNlLWNvbmZpZ3VyYXRpb24nXTtcblxuICBTZXJ2aWNlQ29uZmlndXJhdGlvbi5jb25maWd1cmF0aW9ucy5maW5kKHtcbiAgICAkYW5kOiBbe1xuICAgICAgc2VjcmV0OiB7ICRleGlzdHM6IHRydWUgfVxuICAgIH0sIHtcbiAgICAgIFwic2VjcmV0LmFsZ29yaXRobVwiOiB7ICRleGlzdHM6IGZhbHNlIH1cbiAgICB9XVxuICB9KS5mb3JFYWNoKGNvbmZpZyA9PiB7XG4gICAgU2VydmljZUNvbmZpZ3VyYXRpb24uY29uZmlndXJhdGlvbnMudXBkYXRlKGNvbmZpZy5faWQsIHtcbiAgICAgICRzZXQ6IHtcbiAgICAgICAgc2VjcmV0OiBPQXV0aEVuY3J5cHRpb24uc2VhbChjb25maWcuc2VjcmV0KVxuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbn0pO1xuXG4vLyBYWFggc2VlIGNvbW1lbnQgb24gQWNjb3VudHMuY3JlYXRlVXNlciBpbiBwYXNzd29yZHNfc2VydmVyIGFib3V0IGFkZGluZyBhXG4vLyBzZWNvbmQgXCJzZXJ2ZXIgb3B0aW9uc1wiIGFyZ3VtZW50LlxuY29uc3QgZGVmYXVsdENyZWF0ZVVzZXJIb29rID0gKG9wdGlvbnMsIHVzZXIpID0+IHtcbiAgaWYgKG9wdGlvbnMucHJvZmlsZSlcbiAgICB1c2VyLnByb2ZpbGUgPSBvcHRpb25zLnByb2ZpbGU7XG4gIHJldHVybiB1c2VyO1xufTtcblxuLy8gVmFsaWRhdGUgbmV3IHVzZXIncyBlbWFpbCBvciBHb29nbGUvRmFjZWJvb2svR2l0SHViIGFjY291bnQncyBlbWFpbFxuZnVuY3Rpb24gZGVmYXVsdFZhbGlkYXRlTmV3VXNlckhvb2sodXNlcikge1xuICBjb25zdCBkb21haW4gPSB0aGlzLl9vcHRpb25zLnJlc3RyaWN0Q3JlYXRpb25CeUVtYWlsRG9tYWluO1xuICBpZiAoIWRvbWFpbikge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgbGV0IGVtYWlsSXNHb29kID0gZmFsc2U7XG4gIGlmICh1c2VyLmVtYWlscyAmJiB1c2VyLmVtYWlscy5sZW5ndGggPiAwKSB7XG4gICAgZW1haWxJc0dvb2QgPSB1c2VyLmVtYWlscy5yZWR1Y2UoXG4gICAgICAocHJldiwgZW1haWwpID0+IHByZXYgfHwgdGhpcy5fdGVzdEVtYWlsRG9tYWluKGVtYWlsLmFkZHJlc3MpLCBmYWxzZVxuICAgICk7XG4gIH0gZWxzZSBpZiAodXNlci5zZXJ2aWNlcyAmJiBPYmplY3QudmFsdWVzKHVzZXIuc2VydmljZXMpLmxlbmd0aCA+IDApIHtcbiAgICAvLyBGaW5kIGFueSBlbWFpbCBvZiBhbnkgc2VydmljZSBhbmQgY2hlY2sgaXRcbiAgICBlbWFpbElzR29vZCA9IE9iamVjdC52YWx1ZXModXNlci5zZXJ2aWNlcykucmVkdWNlKFxuICAgICAgKHByZXYsIHNlcnZpY2UpID0+IHNlcnZpY2UuZW1haWwgJiYgdGhpcy5fdGVzdEVtYWlsRG9tYWluKHNlcnZpY2UuZW1haWwpLFxuICAgICAgZmFsc2UsXG4gICAgKTtcbiAgfVxuXG4gIGlmIChlbWFpbElzR29vZCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBkb21haW4gPT09ICdzdHJpbmcnKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIGBAJHtkb21haW59IGVtYWlsIHJlcXVpcmVkYCk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiRW1haWwgZG9lc24ndCBtYXRjaCB0aGUgY3JpdGVyaWEuXCIpO1xuICB9XG59XG5cbmNvbnN0IHNldHVwVXNlcnNDb2xsZWN0aW9uID0gdXNlcnMgPT4ge1xuICAvLy9cbiAgLy8vIFJFU1RSSUNUSU5HIFdSSVRFUyBUTyBVU0VSIE9CSkVDVFNcbiAgLy8vXG4gIHVzZXJzLmFsbG93KHtcbiAgICAvLyBjbGllbnRzIGNhbiBtb2RpZnkgdGhlIHByb2ZpbGUgZmllbGQgb2YgdGhlaXIgb3duIGRvY3VtZW50LCBhbmRcbiAgICAvLyBub3RoaW5nIGVsc2UuXG4gICAgdXBkYXRlOiAodXNlcklkLCB1c2VyLCBmaWVsZHMsIG1vZGlmaWVyKSA9PiB7XG4gICAgICAvLyBtYWtlIHN1cmUgaXQgaXMgb3VyIHJlY29yZFxuICAgICAgaWYgKHVzZXIuX2lkICE9PSB1c2VySWQpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICAvLyB1c2VyIGNhbiBvbmx5IG1vZGlmeSB0aGUgJ3Byb2ZpbGUnIGZpZWxkLiBzZXRzIHRvIG11bHRpcGxlXG4gICAgICAvLyBzdWIta2V5cyAoZWcgcHJvZmlsZS5mb28gYW5kIHByb2ZpbGUuYmFyKSBhcmUgbWVyZ2VkIGludG8gZW50cnlcbiAgICAgIC8vIGluIHRoZSBmaWVsZHMgbGlzdC5cbiAgICAgIGlmIChmaWVsZHMubGVuZ3RoICE9PSAxIHx8IGZpZWxkc1swXSAhPT0gJ3Byb2ZpbGUnKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgICBmZXRjaDogWydfaWQnXSAvLyB3ZSBvbmx5IGxvb2sgYXQgX2lkLlxuICB9KTtcblxuICAvLy8gREVGQVVMVCBJTkRFWEVTIE9OIFVTRVJTXG4gIHVzZXJzLl9lbnN1cmVJbmRleCgndXNlcm5hbWUnLCB7dW5pcXVlOiAxLCBzcGFyc2U6IDF9KTtcbiAgdXNlcnMuX2Vuc3VyZUluZGV4KCdlbWFpbHMuYWRkcmVzcycsIHt1bmlxdWU6IDEsIHNwYXJzZTogMX0pO1xuICB1c2Vycy5fZW5zdXJlSW5kZXgoJ3NlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucy5oYXNoZWRUb2tlbicsXG4gICAge3VuaXF1ZTogMSwgc3BhcnNlOiAxfSk7XG4gIHVzZXJzLl9lbnN1cmVJbmRleCgnc2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLnRva2VuJyxcbiAgICB7dW5pcXVlOiAxLCBzcGFyc2U6IDF9KTtcbiAgLy8gRm9yIHRha2luZyBjYXJlIG9mIGxvZ291dE90aGVyQ2xpZW50cyBjYWxscyB0aGF0IGNyYXNoZWQgYmVmb3JlIHRoZVxuICAvLyB0b2tlbnMgd2VyZSBkZWxldGVkLlxuICB1c2Vycy5fZW5zdXJlSW5kZXgoJ3NlcnZpY2VzLnJlc3VtZS5oYXZlTG9naW5Ub2tlbnNUb0RlbGV0ZScsXG4gICAgeyBzcGFyc2U6IDEgfSk7XG4gIC8vIEZvciBleHBpcmluZyBsb2dpbiB0b2tlbnNcbiAgdXNlcnMuX2Vuc3VyZUluZGV4KFwic2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLndoZW5cIiwgeyBzcGFyc2U6IDEgfSk7XG4gIC8vIEZvciBleHBpcmluZyBwYXNzd29yZCB0b2tlbnNcbiAgdXNlcnMuX2Vuc3VyZUluZGV4KCdzZXJ2aWNlcy5wYXNzd29yZC5yZXNldC53aGVuJywgeyBzcGFyc2U6IDEgfSk7XG59O1xuIl19
