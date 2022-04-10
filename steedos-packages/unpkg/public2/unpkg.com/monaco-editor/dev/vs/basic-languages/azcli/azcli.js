/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.33.0(4b1abad427e58dbedc1215d99a0902ffc885fcd4)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
define("vs/basic-languages/azcli/azcli", ["require"],(require)=>{
var moduleExports = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __reExport = (target, module, copyDefault, desc) => {
    if (module && typeof module === "object" || typeof module === "function") {
      for (let key of __getOwnPropNames(module))
        if (!__hasOwnProp.call(target, key) && (copyDefault || key !== "default"))
          __defProp(target, key, { get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable });
    }
    return target;
  };
  var __toCommonJS = /* @__PURE__ */ ((cache) => {
    return (module, temp) => {
      return cache && cache.get(module) || (temp = __reExport(__markAsModule({}), module, 1), cache && cache.set(module, temp), temp);
    };
  })(typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : 0);

  // src/basic-languages/azcli/azcli.ts
  var azcli_exports = {};
  __export(azcli_exports, {
    conf: () => conf,
    language: () => language
  });
  var conf = {
    comments: {
      lineComment: "#"
    }
  };
  var language = {
    defaultToken: "keyword",
    ignoreCase: true,
    tokenPostfix: ".azcli",
    str: /[^#\s]/,
    tokenizer: {
      root: [
        { include: "@comment" },
        [
          /\s-+@str*\s*/,
          {
            cases: {
              "@eos": { token: "key.identifier", next: "@popall" },
              "@default": { token: "key.identifier", next: "@type" }
            }
          }
        ],
        [
          /^-+@str*\s*/,
          {
            cases: {
              "@eos": { token: "key.identifier", next: "@popall" },
              "@default": { token: "key.identifier", next: "@type" }
            }
          }
        ]
      ],
      type: [
        { include: "@comment" },
        [
          /-+@str*\s*/,
          {
            cases: {
              "@eos": { token: "key.identifier", next: "@popall" },
              "@default": "key.identifier"
            }
          }
        ],
        [
          /@str+\s*/,
          {
            cases: {
              "@eos": { token: "string", next: "@popall" },
              "@default": "string"
            }
          }
        ]
      ],
      comment: [
        [
          /#.*$/,
          {
            cases: {
              "@eos": { token: "comment", next: "@popall" }
            }
          }
        ]
      ]
    }
  };
  return __toCommonJS(azcli_exports);
})();
return moduleExports;
});
