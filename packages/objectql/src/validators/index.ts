var util = require("../util");
// 移除 jsen 相关的导入
// var jsen = require("jsen");
var path = require("path");

// 引入 ajv
import Ajv from "ajv";
import { Dictionary, JsonMap, getString } from "@salesforce/ts-types";

// 实例化 Ajv
const ajv = new Ajv({
  allErrors: true, // 收集所有错误，而不是在第一个错误时停止
  // 其他 ajv 配置，例如：
  // removeAdditional: true,
  // useDefaults: true,
});

export const Validators: Dictionary<any> = {};

export const ValidatorManager = {
  loadFile: (filePath: string) => {
    let json: JsonMap = util.loadFile2(filePath);
    return ValidatorManager.loadJSON(json);
  },

  loadJSON(schema: JsonMap) {
    let _id = getString(schema, "id") || getString(schema, "name");

    if (_id) {
      // 确保 properties 存在
      if (!schema.properties) {
        schema.properties = {};
      }

      // 保持原逻辑：为 __filename 添加类型
      schema.properties["__filename"] = { type: "string" };

      try {
        // 使用 ajv.compile 编译 schema
        // ajv.compile 返回一个验证函数，与 jsen(schema) 的返回结果类似
        Validators[_id] = ajv.compile(schema);
      } catch (error) {
        console.error(`Error compiling schema for id: ${_id}`, error);
        // 可以选择抛出错误或跳过该验证器
      }
    }
    return schema;
  },

  remove(id: string) {
    if (Validators[id])
      // 注意：原代码中使用的是 Validators.id，应该改为 Validators[id]
      delete Validators[id];
  },
};

export const loadCoreValidators = () => {
  ValidatorManager.loadFile(
    path.resolve(
      path.dirname(require.resolve("@steedos/schemas")),
      "./object/schema.json",
    ),
  );
};
