/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.33.0(4b1abad427e58dbedc1215d99a0902ffc885fcd4)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
define("vs/basic-languages/dockerfile/dockerfile", ["require"],(require)=>{
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

  // src/basic-languages/dockerfile/dockerfile.ts
  var dockerfile_exports = {};
  __export(dockerfile_exports, {
    conf: () => conf,
    language: () => language
  });
  var conf = {
    brackets: [
      ["{", "}"],
      ["[", "]"],
      ["(", ")"]
    ],
    autoClosingPairs: [
      { open: "{", close: "}" },
      { open: "[", close: "]" },
      { open: "(", close: ")" },
      { open: '"', close: '"' },
      { open: "'", close: "'" }
    ],
    surroundingPairs: [
      { open: "{", close: "}" },
      { open: "[", close: "]" },
      { open: "(", close: ")" },
      { open: '"', close: '"' },
      { open: "'", close: "'" }
    ]
  };
  var language = {
    defaultToken: "",
    tokenPostfix: ".dockerfile",
    variable: /\${?[\w]+}?/,
    tokenizer: {
      root: [
        { include: "@whitespace" },
        { include: "@comment" },
        [/(ONBUILD)(\s+)/, ["keyword", ""]],
        [/(ENV)(\s+)([\w]+)/, ["keyword", "", { token: "variable", next: "@arguments" }]],
        [
          /(FROM|MAINTAINER|RUN|EXPOSE|ENV|ADD|ARG|VOLUME|LABEL|USER|WORKDIR|COPY|CMD|STOPSIGNAL|SHELL|HEALTHCHECK|ENTRYPOINT)/,
          { token: "keyword", next: "@arguments" }
        ]
      ],
      arguments: [
        { include: "@whitespace" },
        { include: "@strings" },
        [
          /(@variable)/,
          {
            cases: {
              "@eos": { token: "variable", next: "@popall" },
              "@default": "variable"
            }
          }
        ],
        [
          /\\/,
          {
            cases: {
              "@eos": "",
              "@default": ""
            }
          }
        ],
        [
          /./,
          {
            cases: {
              "@eos": { token: "", next: "@popall" },
              "@default": ""
            }
          }
        ]
      ],
      whitespace: [
        [
          /\s+/,
          {
            cases: {
              "@eos": { token: "", next: "@popall" },
              "@default": ""
            }
          }
        ]
      ],
      comment: [[/(^#.*$)/, "comment", "@popall"]],
      strings: [
        [/\\'$/, "", "@popall"],
        [/\\'/, ""],
        [/'$/, "string", "@popall"],
        [/'/, "string", "@stringBody"],
        [/"$/, "string", "@popall"],
        [/"/, "string", "@dblStringBody"]
      ],
      stringBody: [
        [
          /[^\\\$']/,
          {
            cases: {
              "@eos": { token: "string", next: "@popall" },
              "@default": "string"
            }
          }
        ],
        [/\\./, "string.escape"],
        [/'$/, "string", "@popall"],
        [/'/, "string", "@pop"],
        [/(@variable)/, "variable"],
        [/\\$/, "string"],
        [/$/, "string", "@popall"]
      ],
      dblStringBody: [
        [
          /[^\\\$"]/,
          {
            cases: {
              "@eos": { token: "string", next: "@popall" },
              "@default": "string"
            }
          }
        ],
        [/\\./, "string.escape"],
        [/"$/, "string", "@popall"],
        [/"/, "string", "@pop"],
        [/(@variable)/, "variable"],
        [/\\$/, "string"],
        [/$/, "string", "@popall"]
      ]
    }
  };
  return __toCommonJS(dockerfile_exports);
})();
return moduleExports;
});
