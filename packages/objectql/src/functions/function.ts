/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2024-05-13 10:22:58
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2024-05-13 13:37:24
 * @FilePath: /steedos-platform-2.3/packages/objectql/src/functions/function.ts
 * @Description:
 */
import * as vm from "vm";
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
const _compiledFuncScripts = new Map<
  string,
  { script: vm.Script; source: string }
>();

export const runFunction = async (func, thisArg, ...args) => {
  const db = objectql.getDataSource("default").adapter;
  const npm = getNpmModules();

  // Get or compile script (V8 compilation is cached)
  const cacheKey = `${func.objectApiName}.${func.name}`;
  const funcFileName = `${func.objectApiName}.${func.name}.function.js`;
  let cached = _compiledFuncScripts.get(cacheKey);
  if (!cached || cached.source !== func.script) {
    const script = new vm.Script(
      `(async function(ctx){${func.script}})`,
      { filename: funcFileName },
    );
    cached = { script, source: func.script };
    _compiledFuncScripts.set(cacheKey, cached);
  }

  // Create sandbox context per execution
  const sandbox = vm.createContext({
    str2function,
    global: npm,
    npm,
    objects: (global as any).objects,
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

  // Run compiled script in sandbox to get the function
  const funcInSandbox = cached.script.runInContext(sandbox);

  try {
    const res = await funcInSandbox.apply(thisArg, args);
    return res;
  } catch (error) {
    const source = error.stack;
    const errorStack = source
      .substring(source.indexOf("(") + 1, source.indexOf(")"))
      .replace(
        funcFileName,
        "对象「" + func.objectApiName + "」的「" + func.name + "」函数",
      )
      .replace(":", " 行 ")
      .replace(":", " 列 ");
    const newError = new Error(error.message);
    newError.stack = `Object Function Error: ${error.message}\n    at ${errorStack}`;
    if (process.env.NODE_ENV === "development") {
      newError.message = newError.stack;
    }
    throw newError;
  }
};
