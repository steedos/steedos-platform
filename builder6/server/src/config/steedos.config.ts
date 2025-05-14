import {
  defaultsDeep,
  cloneDeep,
  compact,
  each,
  isString,
  get,
  isEmpty,
} from "lodash";
import dotenvFlow from "dotenv-flow";
dotenvFlow.config({
  path: process.cwd(),
  silent: true,
});

if (isEmpty(process.env.STEEDOS_TENANT_ENABLE_PASSWORD_LOGIN)) {
  process.env.STEEDOS_TENANT_ENABLE_PASSWORD_LOGIN = "true";
}

if (isEmpty(process.env.STEEDOS_WIDGETS_ADDITIONAL)) {
  process.env.STEEDOS_WIDGETS_ADDITIONAL = "@steedos-widgets/liveblocks";
}

if (isEmpty(process.env.STEEDOS_UNPKG_URL)) {
  process.env.STEEDOS_UNPKG_URL = "https://unpkg.steedos.cn";
}
process.env.STEEDOS_UNPKG_URL = process.env.STEEDOS_UNPKG_URL.replace(
  /\/+$/,
  "",
);

if (isEmpty(process.env.STEEDOS_BUILDER_URL)) {
  process.env.STEEDOS_BUILDER_URL = "https://6-3.builder.steedos.com";
}
process.env.STEEDOS_BUILDER_URL = process.env.STEEDOS_BUILDER_URL.replace(
  /\/+$/,
  "",
);

if (isEmpty(process.env.STEEDOS_AMIS_VERSION)) {
  process.env.STEEDOS_AMIS_VERSION = "6.3.0-patch.3";
}

if (isEmpty(process.env.STEEDOS_AMIS_URL)) {
  // process.env.STEEDOS_AMIS_URL = process.env.STEEDOS_UNPKG_URL + '/amis@' + process.env.STEEDOS_AMIS_VERSION;
  // 默认加载 https://unpkg.steedos.cn/@steedos-widgets/amis@3.6.3-patch.2， STEEDOS_AMIS_VERSION可变更版本号
  process.env.STEEDOS_AMIS_URL =
    process.env.STEEDOS_UNPKG_URL +
    "/@steedos-widgets/amis@" +
    process.env.STEEDOS_AMIS_VERSION;
} else {
  process.env.STEEDOS_AMIS_URL = process.env.STEEDOS_AMIS_URL.replace(
    "https://unpkg.com",
    process.env.STEEDOS_UNPKG_URL,
  );
}
process.env.STEEDOS_AMIS_URL = process.env.STEEDOS_AMIS_URL.replace(/\/+$/, "");

if (isEmpty(process.env.STEEDOS_WIDGETS_VERSION)) {
  process.env.STEEDOS_WIDGETS_VERSION = "v6.10.1-beta.14";
}

if (isEmpty(process.env.STEEDOS_PUBLIC_PAGE_ASSETURLS)) {
  const widgetsVersion = process.env.STEEDOS_WIDGETS_VERSION;
  const unpkgUrl = process.env.STEEDOS_UNPKG_URL;
  let steedosPublicPageAsseturls = `${unpkgUrl}/@steedos-widgets/amis-object@${widgetsVersion}/dist/assets.json`;
  if (!isEmpty(process.env.STEEDOS_WIDGETS_ADDITIONAL)) {
    process.env.STEEDOS_WIDGETS_ADDITIONAL.split(",").forEach((additional) => {
      const lastAtIndex = additional.lastIndexOf("@");
      let packageName = additional;
      let versionToUse = widgetsVersion;

      // 只有当 '@' 不在字符串开头（即大于0的位置）才视为存在版本信息
      if (lastAtIndex > 0) {
        packageName = additional.substring(0, lastAtIndex);
        versionToUse = additional.substring(lastAtIndex + 1) || widgetsVersion;
      }
      steedosPublicPageAsseturls += `,${unpkgUrl}/${packageName}@${versionToUse}/dist/assets.json`;
    });
  }
  process.env.STEEDOS_PUBLIC_PAGE_ASSETURLS = steedosPublicPageAsseturls;
}

if (isEmpty(process.env.SERIALIZER)) {
  process.env.SERIALIZER = "JSON";
}

if (isEmpty(process.env.ROOT_URL)) {
  console.error("ERROR: Environment variable ROOT_URL is not defined.");
  process.env.ROOT_URL = "http://localhost";
}

process.env.ROOT_URL = process.env.ROOT_URL.replace(/\/+$/, "");

const path = require("path");
const fs = require("fs");
const clone = require("clone");
const validator = require("validator");
const yaml = require("js-yaml");

function calcString(str: string, content: any = process.env): any {
  if (!isString(str)) {
    return str;
  }
  let calcFun: any = null;
  var reg = /(\${[^{}]*\})/g;
  let rev = str.replace(reg, function (m, $1) {
    return $1.replace(/\{\s*/, '{args["').replace(/\s*\}/, '"]}');
  });
  eval(`calcFun = function(args){return \`${rev}\`}`);
  let val = calcFun.call({}, content);
  if (isString(val) && val) {
    return val
      .replace(/\\r/g, "\r")
      .replace(/\\n/g, "\n")
      .replace(/undefined/g, "");
  } else {
    return null;
  }
}

function calcSteedosConfig(config: any) {
  each(config, (v: never, k: string) => {
    if (isJsonMap(v)) {
      let _d = get(config, k);
      if (isJsonMap(_d)) {
        config[k] = calcSteedosConfig(clone(_d));
      } else {
        config[k] = calcString(v);
        if (
          k &&
          isString(k) &&
          k.startsWith("enable_") &&
          config[k] &&
          isString(config[k])
        ) {
          config[k] = validator.toBoolean(config[k], true);
        }
      }
    } else {
      config[k] = calcString(v);
      if (
        k &&
        isString(k) &&
        k.startsWith("enable_") &&
        config[k] &&
        isString(config[k])
      ) {
        config[k] = validator.toBoolean(config[k], true);
      }
    }
  });

  return config;
}

export default class SteedosConfig {
  static loadSettings = (filePath: string) => {
    try {
      const settings = yaml.load(fs.readFileSync(filePath, "utf8"));

      if (settings.env) {
        each(settings.env, function (item, key) {
          process.env[key] = calcString(item);
        });
      }
      let emailConfig = settings.email;
      if (emailConfig) {
        if (
          !emailConfig.url &&
          emailConfig.host &&
          emailConfig.port &&
          emailConfig.username &&
          emailConfig.password
        ) {
          let url = `smtps://${emailConfig.username}:${emailConfig.password}@${emailConfig.host}:${emailConfig.port}/`;
          emailConfig.url = url;
        }
        if (emailConfig.url) {
          process.env["MAIL_URL"] = calcString(emailConfig.url);
        }
        if (emailConfig.from) {
          // 测试下来注册用户时不用MAIL_FROM这个环境变量也是可以的，这里重写是为了保险起见，怕其他地方用到这个环境变量
          process.env["MAIL_FROM"] = calcString(emailConfig.from);
        }
      }
      const res = calcSteedosConfig(settings);
      if (res) {
        (res as any).setTenant = (tenant) => {
          res.tenant = defaultsDeep(tenant, res.tenant);
        };
      }
      return res;
    } catch (error) {
      console.error("loadFile error", filePath, error);
    }
  };

  static loadDefaultSettings() {
    const filePath = path.join(
      __dirname,
      "..",
      "..",
      "default.steedos.settings.yml",
    );
    if (fs.existsSync(filePath) && !fs.statSync(filePath).isDirectory()) {
      return SteedosConfig.loadSettings(filePath);
    } else {
      return null;
    }
  }

  static loadProjectSettings() {
    let configPath = path.join(process.cwd(), "steedos-config.yml");
    if (fs.existsSync(configPath) && !fs.statSync(configPath).isDirectory()) {
      return SteedosConfig.loadSettings(configPath);
    } else {
      return {};
    }
  }

  static getSteedosConfig() {
    const loadProjectSettings = SteedosConfig.loadProjectSettings();
    const _projectConfig = defaultsDeep({}, { settings: loadProjectSettings });

    const defaultSettings = SteedosConfig.loadDefaultSettings();

    const _defaultConfig = defaultsDeep({}, { settings: defaultSettings });

    const res = cloneDeep(_defaultConfig);

    const mods = cloneDeep(_projectConfig);

    Object.keys(mods).forEach((key) => {
      if (["created", "started", "stopped"].indexOf(key) !== -1) {
        const functionArray = SteedosConfig.mergeSchemaLifecycleHandlers(
          mods[key],
          res[key],
        );
        if (functionArray.length > 0) {
          res[key] = function (broker) {
            functionArray.forEach((fn: any) => fn.call(this, broker));
          };
        }
      } else if (["tracing", "metrics", "logger"].indexOf(key) !== -1) {
        res[key] = mods[key];
      } else {
        res[key] = defaultsDeep({ [key]: mods[key] }, { [key]: res[key] })[key];
      }
    });

    return res;
  }

  static mergeSchemaLifecycleHandlers(src, target) {
    return compact(SteedosConfig.flatten([target, src]));
  }

  static flatten(arr) {
    return Array.prototype.reduce.call(arr, (a, b) => a.concat(b), []);
  }
}

export function isObject(value) {
  return (
    value != null && (typeof value === "object" || typeof value === "function")
  );
}

export function isFunction(value) {
  return typeof value === "function";
}

export function isPlainObject(value) {
  const isObjectObject = (o) =>
    isObject(o) && Object.prototype.toString.call(o) === "[object Object]";
  if (!isObjectObject(value)) return false;
  const ctor = value.constructor;
  if (!isFunction(ctor)) return false;
  if (!isObjectObject(ctor.prototype)) return false;
  if (!ctor.prototype.hasOwnProperty("isPrototypeOf")) return false;
  return true;
}

export function isJsonMap(value) {
  return isPlainObject(value);
}

export const steedosConfig = SteedosConfig.getSteedosConfig();
