/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-04-23 13:35:17
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-11-25 10:41:20
 * @Description:
 */
import * as vm from "vm";
const _ = require("lodash");
import { ObjectId } from "mongodb";
import axios from "axios";
const objectql = require("@steedos/objectql");

function str2function(contents, ...args) {
  try {
    let fn = new Function(...args, contents);
    return fn;
  } catch (e) {
    console.warn(e);
    return null;
  }
}

// Cached npm modules (loaded once)
let _npmModules = null;
function getNpmModules() {
  if (!_npmModules) {
    _npmModules = {
      _: require("lodash"),
      lodash: require("lodash"),
      moment: require("moment"),
      validator: require("validator"),
      filters: require("@steedos/filters"),
      axios: require("axios"),
      formData: require("form-data"),
      mongodb: require("mongodb"),
      sequelize: require("sequelize"),
    };
  }
  return _npmModules;
}

// Cached compiled scripts (V8 compilation cached)
const _compiledTriggerScripts = new Map<
  string,
  { script: vm.Script; handler: string }
>();

const sendPost = async (url, body, options) => {
  try {
    return await axios.post(url, body, options);
  } catch (error) {
    throw new Error(`请求失败(${error.message}): ${url}`);
  }
};

/**
 * 
 * 请求参数(body): {
       objectName,
       userId,
       spaceId,
       doc
 * } 
 * 接口返回参数结构:
        {
            "error": {
                "code": "",
                "message": "",
            },
            "data": {

            }
        }
 */
const runUrlTrigger = async (trigger, thisArg, args) => {
  if (!trigger.url) {
    throw new Error(`触发器「${trigger.name}」缺少URL`);
  }

  const headers = {
    "Content-Type": "application/json",
  };

  if (trigger.authentication_type == "header") {
    headers[trigger.authentication_header_key] =
      trigger.authentication_header_value;
  }

  const { data: rsBody, status: httpStatus } = await sendPost(
    trigger.url,
    args && args.length > 0 ? args[0].params : {},
    { headers },
  );
  if (httpStatus !== 200) {
    throw new Error(`请求失败: ${trigger.url}`);
  }
  let { error, data } = rsBody;

  if (error && error.message) {
    throw new Error(error.message);
  }
  return data;
};

export const runTriggerFunction = async (trigger, thisArg, ...args) => {
  if (trigger.type === "url") {
    return await runUrlTrigger(trigger, thisArg, args);
  }
  const db = objectql.getDataSource("default").adapter;
  const npm = getNpmModules();

  // ----- code trigger -----
  // Get or compile script (V8 compilation is cached)
  const cacheKey = `${trigger.listenTo}.${trigger.name}`;
  const triggerFileName = `${trigger.listenTo}.${trigger.name}.trigger.js`;
  let cached = _compiledTriggerScripts.get(cacheKey);
  if (!cached || cached.handler !== trigger.handler) {
    const script = new vm.Script(
      `(async function(ctx){${trigger.handler}})`,
      { filename: triggerFileName },
    );
    cached = { script, handler: trigger.handler };
    _compiledTriggerScripts.set(cacheKey, cached);
  }

  // Create sandbox context per execution
  const sandbox = vm.createContext({
    str2function,
    global: npm,
    npm,
    services: (global as any).services,
    objects: (global as any).objects,
    makeNewID: () => {
      return new ObjectId().toHexString();
    },
    db,
    console,
    require,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    setImmediate,
    clearImmediate,
    Promise,
    Buffer,
    process,
  });

  // Run compiled script in sandbox to get the trigger function
  const triggerInSandbox = cached.script.runInContext(sandbox);

  try {
    const res = await triggerInSandbox.apply(thisArg, args);
    return res;
  } catch (error) {
    const source = error.stack;
    const errorStack = source
      .substring(source.indexOf("(") + 1, source.indexOf(")"))
      .replace(
        triggerFileName,
        "对象「" + trigger.listenTo + "」的「" + trigger.name + "」触发器",
      )
      .replace(":", " 行 ")
      .replace(":", " 列 ");
    const newError = new Error(error.message);
    newError.stack = `Object Trigger Error: ${error.message}\n    at ${errorStack}`;
    if (process.env.NODE_ENV === "development") {
      newError.message = newError.stack;
    }
    console.log(error);
    console.log(newError);
    throw newError;
  }
};
