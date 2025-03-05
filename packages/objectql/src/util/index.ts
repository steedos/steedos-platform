/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { isJsonMap, JsonMap } from "@salesforce/ts-types";
import { loadCoreValidators } from "../validators";
const odataMongodb = require("@steedos/odata-v4-mongodb");
const crypto = require("crypto");
const yaml = require("js-yaml");
const fs = require("fs");
const path = require("path");
const _ = require("underscore");
var clone = require("clone");
import { has, getJsonMap } from "@salesforce/ts-types";
let STEEDOS_CONFIG: any = {};
const configName = "steedos-config.yml";
const licenseName = ".license";
import { defaultsDeep } from "lodash";
import { broker, getObject } from "..";
export * from "./transform";
export * from "./permission_shares";
export * from "./suffix";
export * from "./locale";
export * from "./field";
export * from "./function_expression";
export * from "./convert";

const validator = require("validator");

exports.loadJSONFile = (filePath: string) => {
  return JSON.parse(fs.readFileSync(filePath, "utf8").normalize("NFC"));
};

exports.loadYmlFile = (filePath: string) => {
  return yaml.load(fs.readFileSync(filePath, "utf8"));
};

let loadFile = (filePath: string) => {
  let json: JsonMap = {};
  try {
    let extname = path.extname(filePath);
    if (extname.toLocaleLowerCase() == ".json")
      json = JSON.parse(fs.readFileSync(filePath, "utf8").normalize("NFC"));
    else if (extname.toLocaleLowerCase() == ".yml")
      json = yaml.load(fs.readFileSync(filePath, "utf8"));
    else if (extname.toLocaleLowerCase() == ".js")
      json = clone(require(filePath));
  } catch (error) {
    console.error("loadFile error", filePath, error);
  }
  return json;
};
exports.loadFile = loadFile;

exports.isObjectFile = (filePath: string) => {
  return (
    !fs.statSync(filePath).isDirectory() &&
    (filePath.endsWith(".object.yml") || filePath.endsWith(".object.json"))
  );
};
let isAppFile = (filePath: string) => {
  return (
    !fs.statSync(filePath).isDirectory() &&
    (filePath.endsWith(".app.yml") || filePath.endsWith(".app.js"))
  );
};
exports.isAppFile = isAppFile;

exports.isTriggerFile = (filePath: string) => {
  return (
    !fs.statSync(filePath).isDirectory() && filePath.endsWith(".trigger.js")
  );
};

exports.isActionFile = (filePath: string) => {
  return (
    !fs.statSync(filePath).isDirectory() && filePath.endsWith(".action.js")
  );
};

exports.isFieldFile = (filePath: string) => {
  return (
    !fs.statSync(filePath).isDirectory() &&
    (filePath.endsWith(".field.yml") || filePath.endsWith(".field.js"))
  );
};

exports.isReportFile = (filePath: string) => {
  return (
    !fs.statSync(filePath).isDirectory() &&
    (filePath.endsWith(".report.yml") || filePath.endsWith(".report.js"))
  );
};

export function getBaseDirectory() {
  //return require('app-root-path').path
  let cwd = process.cwd();
  if (cwd.indexOf(".meteor") > -1) {
    return cwd.split(".meteor")[0];
  }
  return cwd;
}

function calcString(str: string, content: any = process.env): string {
  if (!_.isString(str)) {
    return str;
  }

  let calcFun: Function;
  var reg = /(\${[^{}]*\})/g;
  let rev = str.replace(reg, function (m, $1) {
    return $1.replace(/\{\s*/, '{args["').replace(/\s*\}/, '"]}');
  });
  eval(`calcFun = function(args){return \`${rev}\`}`);
  let val = calcFun.call({}, content);
  if (_.isString(val) && val) {
    return val
      .replace(/\\r/g, "\r")
      .replace(/\\n/g, "\n")
      .replace(/undefined/g, "");
  } else {
    return null;
  }
}

function calcSteedosConfig(config: JsonMap) {
  _.each(config, (v: never, k: string) => {
    if (isJsonMap(v)) {
      let _d = getJsonMap(config, k);
      if (isJsonMap(_d)) {
        config[k] = calcSteedosConfig(clone(_d));
      } else {
        config[k] = calcString(v);
        if (
          k &&
          _.isString(k) &&
          k.startsWith("enable_") &&
          config[k] &&
          _.isString(config[k])
        ) {
          config[k] = validator.toBoolean(config[k], true);
        }
      }
    } else {
      config[k] = calcString(v);
      if (
        k &&
        _.isString(k) &&
        k.startsWith("enable_") &&
        config[k] &&
        _.isString(config[k])
      ) {
        config[k] = validator.toBoolean(config[k], true);
      }
    }
  });

  return config;
}

export function getSteedosConfig() {
  if (!_.isEmpty(STEEDOS_CONFIG)) {
    return STEEDOS_CONFIG;
  }
  let config: any;
  let configPath = path.join(getBaseDirectory(), configName);
  if (fs.existsSync(configPath) && !fs.statSync(configPath).isDirectory()) {
    config = loadFile(configPath);
    if (config.env) {
      _.each(config.env, function (item, key) {
        process.env[key] = calcString(item);
      });
    }
    let emailConfig = config.email;
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
    STEEDOS_CONFIG = calcSteedosConfig(config);
    // }else{
    //     throw new Error('Config file not found: ' + configPath);
  }
  STEEDOS_CONFIG = defaultsDeep(broker.getSettings(), STEEDOS_CONFIG);
  if (STEEDOS_CONFIG) {
    (STEEDOS_CONFIG as any).setTenant = (tenant) => {
      STEEDOS_CONFIG.tenant = defaultsDeep(tenant, STEEDOS_CONFIG.tenant);
      STEEDOS_CONFIG.public.accounts.disabled_account_register =
        tenant.disabled_account_register;
    };
  }
  return STEEDOS_CONFIG;
}

export function getLicense() {
  let license = "";
  let licensePath = path.join(getBaseDirectory(), licenseName);
  if (fs.existsSync(licensePath) && !fs.statSync(licensePath).isDirectory()) {
    license = clone(fs.readFileSync(licensePath, "utf-8"));
  }
  return license;
}

export function writeLicense(license) {
  let licensePath = path.join(getBaseDirectory(), licenseName);
  fs.writeFileSync(licensePath, license, "utf8");
}

export function getRandomString(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function getTemplateSpaceId() {
  let steedosConfig = getSteedosConfig();
  if (
    steedosConfig &&
    steedosConfig.public &&
    steedosConfig.public.templateSpaceId
  ) {
    return steedosConfig.public.templateSpaceId;
  }
}

export function getCloudAdminSpaceId() {
  return process.env.STEEDOS_TENANT_MASTER_ID;
}

export function isTemplateSpace(spaceId) {
  let steedosConfig = getSteedosConfig();

  if (
    spaceId &&
    steedosConfig &&
    steedosConfig.public &&
    steedosConfig.public.templateSpaceId &&
    spaceId === steedosConfig.public.templateSpaceId
  ) {
    return true;
  }

  return false;
}

export function isCloudAdminSpace(spaceId) {
  let steedosConfig = getSteedosConfig();
  if (spaceId && spaceId === process.env.STEEDOS_TENANT_MASTER_ID) {
    return true;
  }
  return false;
}

export function getMD5(data) {
  let md5 = crypto.createHash("md5");
  return md5.update(data).digest("hex");
}

/**
 * 获取对象字段的基本数据类型，目前支持以下数据类型：
 * "text",
 * "boolean",
 * "date",
 * "datetime",
 * "number",
 * "currency",
 * "percent"
 * @param objectFields 对象字段集合，即getObjectConfig(object_name)得到的结果
 * @param key 字段名
 */
export function getFieldDataType(objectFields: any, key: string): string {
  var field: any, result: string;
  if (objectFields && key) {
    field = objectFields[key];
    result = field && field.type;
    if (["formula", "summary"].indexOf(result) > -1) {
      result = field.data_type;
    }
    return result;
  } else {
    return "text";
  }
}

export function isValidDate(date: any): boolean {
  return date instanceof Date && !isNaN(date.getTime());
}

export function processFilters(filters: [], objectFields: any) {
  if (filters && filters.length) {
    filters.forEach((filter: any) => {
      if (!(!_.isArray(filter) && _.isObject(filter))) {
        // 只有{field:xx,operation:xx,value:xx}格式的才支持转换
        return;
      }
      if (!filter.field) {
        throw new Error("object_fields_error_filter_item_field_required");
      }
      if (!filter.operation) {
        throw new Error("object_fields_error_filter_item_operation_required");
      }
      if (!filter.value) {
        throw new Error("object_fields_error_filter_item_value_required");
      }
      // "text","boolean","date","datetime","number","currency","percent"
      let dataType = getFieldDataType(objectFields, filter.field);
      if (["number", "currency", "percent"].indexOf(dataType) > -1) {
        if (typeof filter.value === "string") {
          filter.value = Number(filter.value);
          if (isNaN(filter.value)) {
            throw new Error("object_fields_error_filter_item_invalid_number");
          }
        }
      } else if (dataType === "boolean") {
        if (typeof filter.value === "string") {
          if (["true", "True", "TRUE", "1"].indexOf(filter.value.trim()) > -1) {
            filter.value = true;
          } else if (
            ["false", "False", "FALSE", "0"].indexOf(filter.value.trim()) > -1
          ) {
            filter.value = false;
          } else {
            throw new Error("object_fields_error_filter_item_invalid_boolean");
          }
        }
      } else if (dataType === "date") {
        if (typeof filter.value === "string") {
          // 这里转换为按utc的0点时间值来过滤
          // 实测输入2020-02-12,new Date结果为2020-02-12T00:00:00.000Z
          filter.value = new Date(filter.value);
          if (!isValidDate(filter.value)) {
            throw new Error("object_fields_error_filter_item_invalid_date");
          }
        }
      } else if (dataType === "datetime") {
        if (typeof filter.value === "string") {
          // 这里转换为按utc时间值来过滤
          // 实测输入2020-02-12 12:00,new Date结果为2020-02-12T04:00:00.000Z
          filter.value = new Date(filter.value);
          if (!isValidDate(filter.value)) {
            throw new Error("object_fields_error_filter_item_invalid_date");
          }
        }
      }
    });
  }
}

export function absoluteUrl(path, options?) {
  // path is optional
  if (!options && typeof path === "object") {
    options = path;
    path = undefined;
  }
  const rootUrl = process.env.ROOT_URL;
  // merge options with defaults
  options = Object.assign({}, { rootUrl: rootUrl }, options || {});

  var url = options.rootUrl;
  if (!url)
    throw new Error(
      "Must pass options.rootUrl or set ROOT_URL in the server environment",
    );

  if (!/^http[s]?:\/\//i.test(url))
    // url starts with 'http://' or 'https://'
    url = "http://" + url; // we will later fix to https if options.secure is set

  if (!url.endsWith("/")) {
    url += "/";
  }

  if (path) {
    // join url and path with a / separator
    while (path.startsWith("/")) {
      path = path.slice(1);
    }
    url += path;
  }

  // turn http to https if secure option is set, and we're not talking
  // to localhost.
  if (
    options.secure &&
    /^http:/.test(url) && // url starts with 'http:'
    !/http:\/\/localhost[:\/]/.test(url) && // doesn't match localhost
    !/http:\/\/127\.0\.0\.1[:\/]/.test(url)
  )
    // or 127.0.0.1
    url = url.replace(/^http:/, "https:");

  if (options.replaceLocalhost)
    url = url.replace(/^http:\/\/localhost([:\/].*)/, "http://127.0.0.1$1");

  return url;
}

export function validateFilters(filters: [], objectFields: any) {
  processFilters(clone(filters), objectFields);
}

export async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function parserFilters(filters) {
  if (_.isString(filters)) {
    filters = odataMongodb.createFilter(filters);
  }
  let query: any = {};
  if (_.isArray(filters) && filters.length > 0 && _.isArray(filters[0])) {
    _.each(filters, function (filter) {
      Object.assign(query, parserFilters(filter));
    });
  } else if (_.isArray(filters) && filters.length > 0) {
    if (filters[1] && filters[1] == "=") {
      let key = filters[0];
      let value = filters[2];
      Object.assign(query, { [key]: value });
    } else if (filters[1] && (filters[1] == "!=" || filters[1] == "<>")) {
      let key = filters[0];
      let value = filters[2];
      Object.assign(query, { [key]: { $ne: value } });
    } else if (filters[1] && filters[1] == "in") {
      let key = filters[0];
      let value = filters[2];
      Object.assign(query, { [key]: { $in: value } });
    } else {
      _.each(filters, function (filter) {
        let parsedFilters = parserFilters(filter);
        if (
          query._id &&
          query._id.$ne &&
          parsedFilters._id &&
          parsedFilters._id.$ne
        ) {
          parsedFilters._id.$ne = [parsedFilters._id.$ne];
          parsedFilters._id.$ne = parsedFilters._id.$ne.concat(query._id.$ne);
          delete query._id;
        }
        Object.assign(query, parsedFilters);
      });
    }
  } else {
    _.each(filters, function (v, k) {
      if (_.isArray(v) && v.length > 0) {
        Object.assign(query, parserFilters(v));
      } else {
        if (k === "$and") {
          Object.assign(query, parserFilters(v));
        } else {
          if (_.isArray(filters) && _.isObject(v)) {
            Object.assign(query, v);
          } else {
            Object.assign(query, { [k]: v });
          }
        }
      }
    });
  }
  return query;
}

export function clearRequireCache(filename) {
  /* istanbul ignore next */
  Object.keys(require.cache).forEach(function (key) {
    if (key == filename) {
      delete require.cache[key];
    }
  });
}

export function loadService(broker, filename) {
  clearRequireCache(filename);
  return broker.loadService(filename);
}

loadCoreValidators();

const isAPIName = function (apiName) {
  var reg = new RegExp("^[a-z]([a-z0-9]|_(?!_))*[a-z0-9]$");
  if (!reg.test(apiName)) {
    throw new Error(
      "API 名称只能包含小写字母、数字，必须以字母开头，不能以下划线字符结尾或包含两个连续的下划线字符",
    );
  }
  if (apiName.length > 50) {
    throw new Error("名称长度不能大于50个字符");
  }
  return true;
};

export async function checkAPIName(
  objectName,
  fieldName,
  fieldValue,
  recordId,
  filters,
) {
  isAPIName(fieldValue);
  if (!filters) {
    filters = [];
  }
  filters.push([fieldName, "=", fieldValue]);
  if (recordId) {
    filters.push(["_id", "!=", recordId]);
  }

  var count = await getObject(objectName).count({ filters: filters });

  if (count > 0) {
    throw new Error("该 API 名称 已存在或先前已使用过。请选择其他名称。");
  }
}
