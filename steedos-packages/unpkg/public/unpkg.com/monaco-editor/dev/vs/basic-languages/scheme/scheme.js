/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.33.0(4b1abad427e58dbedc1215d99a0902ffc885fcd4)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
define("vs/basic-languages/scheme/scheme", ["require"],(require)=>{
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

  // src/basic-languages/scheme/scheme.ts
  var scheme_exports = {};
  __export(scheme_exports, {
    conf: () => conf,
    language: () => language
  });
  var conf = {
    comments: {
      lineComment: ";",
      blockComment: ["#|", "|#"]
    },
    brackets: [
      ["(", ")"],
      ["{", "}"],
      ["[", "]"]
    ],
    autoClosingPairs: [
      { open: "{", close: "}" },
      { open: "[", close: "]" },
      { open: "(", close: ")" },
      { open: '"', close: '"' }
    ],
    surroundingPairs: [
      { open: "{", close: "}" },
      { open: "[", close: "]" },
      { open: "(", close: ")" },
      { open: '"', close: '"' }
    ]
  };
  var language = {
    defaultToken: "",
    ignoreCase: true,
    tokenPostfix: ".scheme",
    brackets: [
      { open: "(", close: ")", token: "delimiter.parenthesis" },
      { open: "{", close: "}", token: "delimiter.curly" },
      { open: "[", close: "]", token: "delimiter.square" }
    ],
    keywords: [
      "case",
      "do",
      "let",
      "loop",
      "if",
      "else",
      "when",
      "cons",
      "car",
      "cdr",
      "cond",
      "lambda",
      "lambda*",
      "syntax-rules",
      "format",
      "set!",
      "quote",
      "eval",
      "append",
      "list",
      "list?",
      "member?",
      "load"
    ],
    constants: ["#t", "#f"],
    operators: ["eq?", "eqv?", "equal?", "and", "or", "not", "null?"],
    tokenizer: {
      root: [
        [/#[xXoObB][0-9a-fA-F]+/, "number.hex"],
        [/[+-]?\d+(?:(?:\.\d*)?(?:[eE][+-]?\d+)?)?/, "number.float"],
        [
          /(?:\b(?:(define|define-syntax|define-macro))\b)(\s+)((?:\w|\-|\!|\?)*)/,
          ["keyword", "white", "variable"]
        ],
        { include: "@whitespace" },
        { include: "@strings" },
        [
          /[a-zA-Z_#][a-zA-Z0-9_\-\?\!\*]*/,
          {
            cases: {
              "@keywords": "keyword",
              "@constants": "constant",
              "@operators": "operators",
              "@default": "identifier"
            }
          }
        ]
      ],
      comment: [
        [/[^\|#]+/, "comment"],
        [/#\|/, "comment", "@push"],
        [/\|#/, "comment", "@pop"],
        [/[\|#]/, "comment"]
      ],
      whitespace: [
        [/[ \t\r\n]+/, "white"],
        [/#\|/, "comment", "@comment"],
        [/;.*$/, "comment"]
      ],
      strings: [
        [/"$/, "string", "@popall"],
        [/"(?=.)/, "string", "@multiLineString"]
      ],
      multiLineString: [
        [/[^\\"]+$/, "string", "@popall"],
        [/[^\\"]+/, "string"],
        [/\\./, "string.escape"],
        [/"/, "string", "@popall"],
        [/\\$/, "string"]
      ]
    }
  };
  return __toCommonJS(scheme_exports);
})();
return moduleExports;
});
