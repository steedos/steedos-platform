/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2025-02-17 09:16:48
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-03-04 15:56:02
 * @Description:
 */

import { Account } from "./account";
import { Space } from "./space";
import { BaseObject } from "./object";
import { User } from "./user";
import { Workflow } from "./workflow";
import { ProcessManager } from "./process";
import SObject from "./sobject";
import { ServiceRecordsApi } from "./serviceRecordsApi";

declare const fun;
const SObjects = {};
let client = null;
export const Steedos = {
  __hotRecords: {},
  Connection: (baseURL: string, authToken: string) => {
    client = new ServiceRecordsApi(baseURL, authToken);
  },
  absoluteUrl: (url: string) => {
    return ((window as any).Builder?.settings?.context?.rootUrl || "") + url;
  },
  getRelativeUrl: (url: string) => {
    return ((window as any).Builder?.settings?.context?.rootUrl || "") + url;
  },
  isSpaceAdmin: () => {
    return (window as any).Builder?.settings?.context?.user?.is_space_admin;
  },
  // 当前用户是否是传入的分部的任意一个管理员, 是则返回true
  isCompanyAdmin: (companyIds) => {
    const user = (window as any).Builder?.settings?.context?.user;

    if (user) {
      console.warn("TODO fix: Steedos.isCompanyAdmin");
      return false;
    }
    return false;
  },
  logout: (redirect?) => {
    localStorage.removeItem("steedos:spaceId");
    localStorage.removeItem("steedos:token");
    localStorage.removeItem("steedos:userId");
    localStorage.removeItem("steedos:was_logged_in");
    localStorage.removeItem("Meteor.loginToken");
    localStorage.removeItem("Meteor.Meteor.loginTokenExpires");
    localStorage.removeItem("Meteor.Meteor.userId");
    sessionStorage.clear();
    if (redirect)
      window.location.href = Steedos.absoluteUrl(
        "/logout?redirect_uri=" + redirect,
      );
    else window.location.href = Steedos.absoluteUrl("/logout");
  },
  validatePassword: (pwd) => {
    let reason = (window as any).t("password_invalid");
    let valid = true;

    if (!pwd) {
      valid = false;
    }

    const passwordConfig = (Steedos as any).settings?.public?.password;

    const passwordPolicy = passwordConfig?.policy;

    const passwordPolicyError =
      passwordConfig?.policyError ||
      passwordConfig?.policyerror ||
      "密码不符合规则";

    const passwordPolicies = passwordConfig?.policies;

    const policyFunction = passwordConfig?.policyFunction;

    if (valid && passwordPolicy) {
      if (!new RegExp(passwordPolicy).test(pwd || "")) {
        reason = passwordPolicyError;
        valid = false;
      } else {
        valid = true;
      }
    }

    if (valid && passwordPolicies) {
      for (const item of passwordPolicies) {
        if (valid) {
          if (!new RegExp(item.policy).test(pwd || "")) {
            reason = item.policyError || "密码不符合规则";
            valid = false;
          } else {
            valid = true;
          }
        }
      }
    }

    if (valid && policyFunction) {
      try {
        window.eval("var fun = " + policyFunction);
        fun(pwd);
        valid = true;
      } catch (e) {
        valid = false;
        reason = e.message;
      }
    }

    if (valid) {
      return true;
    } else {
      return { error: { reason: reason } };
    }
  },
  openWindow: (url, target, options) => {
    return window.open(url, target, options);
  },
  isMobile: () => {
    return $(window).width() < 767;
  },
  Account,
  Space,
  Object: BaseObject,
  sobject: (objectName) => {
    var sObject = (SObjects[objectName] =
      SObjects[objectName] || new SObject(objectName, client));
    return sObject;
  },
  User,
  Workflow,
  ProcessManager,
};

function _innerWaitForThing(obj, path, func) {
  const timeGap = 100;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let thing = null;
      if (lodash.isFunction(func)) {
        thing = func(obj, path);
      } else {
        thing = lodash.get(obj, path);
      }
      if (thing) {
        return resolve(thing);
      }
      reject();
    }, timeGap);
  }).catch(() => {
    return _innerWaitForThing(obj, path, func);
  });
}

(window as any).waitForThing = (obj, path, func) => {
  let thing = null;
  if (lodash.isFunction(func)) {
    thing = func(obj, path);
  } else {
    thing = lodash.get(obj, path);
  }
  if (thing) {
    return Promise.resolve(thing);
  }
  return _innerWaitForThing(obj, path, func);
};

(window as any).signOut = Steedos.logout;
