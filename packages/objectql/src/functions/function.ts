/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2024-05-13 10:22:58
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2024-05-13 13:37:24
 * @FilePath: /steedos-platform-2.3/packages/objectql/src/functions/function.ts
 * @Description:
 */
const { NodeVM } = require("vm2");
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

export const runFunction = async (func, thisArg, ...args) => {
  const _t0 = Date.now();
  const db = objectql.getDataSource("default").adapter;
  const npm = {
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

  const _t1 = Date.now();
  const vm = new NodeVM({
    sandbox: {
      str2function,
      global: npm,
      npm,
      objects: (global as any).objects,
      db,
    },
    require: {
      external: true,
      root: "./",
    },
    env: process.env,
  });
  process.stdout.write(`[PerfLog] [function.ts] NodeVM init done | func=${func.objectApiName}.${func.name} | cost=${Date.now()-_t1}ms\n`);
  const funcFileName = `${func.objectApiName}.${func.name}.function.js`;
  const _t2 = Date.now();
  let funcInSandbox = vm.run(
    `module.exports = async function(ctx){${func.script}};`,
    funcFileName,
  );
  process.stdout.write(`[PerfLog] [function.ts] vm.run compile done | func=${func.objectApiName}.${func.name} | cost=${Date.now()-_t2}ms\n`);
  try {
    const run = async function () {
      return new Promise((resolve, reject) => {
        const _t3 = Date.now();
        funcInSandbox
          .apply(thisArg, args)
          .then((res) => {
            process.stdout.write(`[PerfLog] [function.ts] script execute done | func=${func.objectApiName}.${func.name} | cost=${Date.now()-_t3}ms\n`);
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    };
    const res: any = await run();
    process.stdout.write(`[PerfLog] [function.ts] await run() returned | func=${func.objectApiName}.${func.name} | cost=${Date.now()-_t0}ms\n`);
    process.stdout.write(`[PerfLog] [function.ts] total done | func=${func.objectApiName}.${func.name} | cost=${Date.now()-_t0}ms\n`);
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
