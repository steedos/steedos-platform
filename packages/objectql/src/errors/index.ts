import { t } from "@steedos/i18n";
import { SteedosUserSession } from "../";

const hasOwn = Object.prototype.hasOwnProperty;
const inherits = function (Child, Parent) {
  // copy Parent static properties
  for (var key in Parent) {
    // make sure we only copy hasOwnProperty properties vs. prototype
    // properties
    if (hasOwn.call(Parent, key)) {
      Child[key] = Parent[key];
    }
  }

  // a middle member of prototype chain: takes the prototype from the Parent
  var Middle = function () {
    this.constructor = Child;
  };
  Middle.prototype = Parent.prototype;
  Child.prototype = new Middle();
  Child.__super__ = Parent.prototype;
  return Child;
};

const getLocale = (userLocale: string) => {
  let locale: string;
  if (userLocale === "zh-cn") {
    locale = "zh-CN";
  } else if (userLocale == "en-us") {
    locale = "en";
  } else {
    locale = "zh-CN";
  }
  return locale;
};

// declare type SteedosFunctionErrorType = (error: string, reason: string, details: string) => void;
const i18nError = function (
  key?: string,
  userSession?: SteedosUserSession,
  i18nOptions?: any,
) {
  if (key) {
    let lng = "en";
    if (userSession) {
      lng = getLocale(userSession.locale);
      return t(key, i18nOptions, lng);
    }
  }
  return key;
};
const SteedosFunctionError = function (
  error: string,
  reason?: string,
  details?: string,
  userSession?: SteedosUserSession,
  i18nOptions?: any,
) {
  var self = this;
  // Newer versions of DDP use this property to signify that an error
  // can be sent back and reconstructed on the calling client.
  self.isClientSafe = true;

  // String code uniquely identifying this kind of error.
  self.error = i18nError(error, userSession, i18nOptions);

  // Optional: A short human-readable summary of the error. Not
  // intended to be shown to end users, just developers. ("Not Found",
  // "Internal Server Error")
  self.reason = i18nError(reason, userSession, i18nOptions);

  // Optional: Additional information about the error, say for
  // debugging. It might be a (textual) stack trace if the server is
  // willing to provide one. The corresponding thing in HTTP would be
  // the body of a 404 or 500 response. (The difference is that we
  // never expect this to be shown to end users, only developers, so
  // it doesn't need to be pretty.)
  self.details = i18nError(details, userSession, i18nOptions);

  // This is what gets displayed at the top of a stack trace. Current
  // format is "[404]" (if no reason is set) or "File not found [404]"
  if (self.reason) self.message = self.reason + " [" + self.error + "]";
  else {
    // self.message = '[' + self.error + ']';
    self.message = self.error;
  }
};

const makeErrorType = function (
  name,
  constructor,
): (
  error: string,
  reason?: string,
  details?: string,
  userSession?: SteedosUserSession,
  i18nOptions?: any,
) => void {
  var errorClass = function (/*arguments*/) {
    // Ensure we get a proper stack trace in most Javascript environments
    if (Error.captureStackTrace) {
      // V8 environments (Chrome and Node.js)
      Error.captureStackTrace(this, errorClass);
    } else {
      // Borrow the .stack property of a native Error object.
      this.stack = new Error().stack;
    }
    // Safari magically works.

    constructor.apply(this, arguments);

    this.errorType = name;
  };

  inherits(errorClass, Error);

  return errorClass;
};

export const SteedosError = makeErrorType(
  "Steedos.Error",
  SteedosFunctionError,
);

export const sendError = function (res: any, error: any, status = 500) {
  return res.status(status).send({ state: "FAILURE", error: error.message });
};
