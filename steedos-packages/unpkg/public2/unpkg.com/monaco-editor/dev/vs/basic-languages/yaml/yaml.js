/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.33.0(4b1abad427e58dbedc1215d99a0902ffc885fcd4)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
define("vs/basic-languages/yaml/yaml", ["require"],(require)=>{
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

  // src/basic-languages/yaml/yaml.ts
  var yaml_exports = {};
  __export(yaml_exports, {
    conf: () => conf,
    language: () => language
  });
  var conf = {
    comments: {
      lineComment: "#"
    },
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
    ],
    folding: {
      offSide: true
    }
  };
  var language = {
    tokenPostfix: ".yaml",
    brackets: [
      { token: "delimiter.bracket", open: "{", close: "}" },
      { token: "delimiter.square", open: "[", close: "]" }
    ],
    keywords: ["true", "True", "TRUE", "false", "False", "FALSE", "null", "Null", "Null", "~"],
    numberInteger: /(?:0|[+-]?[0-9]+)/,
    numberFloat: /(?:0|[+-]?[0-9]+)(?:\.[0-9]+)?(?:e[-+][1-9][0-9]*)?/,
    numberOctal: /0o[0-7]+/,
    numberHex: /0x[0-9a-fA-F]+/,
    numberInfinity: /[+-]?\.(?:inf|Inf|INF)/,
    numberNaN: /\.(?:nan|Nan|NAN)/,
    numberDate: /\d{4}-\d\d-\d\d([Tt ]\d\d:\d\d:\d\d(\.\d+)?(( ?[+-]\d\d?(:\d\d)?)|Z)?)?/,
    escapes: /\\(?:[btnfr\\"']|[0-7][0-7]?|[0-3][0-7]{2})/,
    tokenizer: {
      root: [
        { include: "@whitespace" },
        { include: "@comment" },
        [/%[^ ]+.*$/, "meta.directive"],
        [/---/, "operators.directivesEnd"],
        [/\.{3}/, "operators.documentEnd"],
        [/[-?:](?= )/, "operators"],
        { include: "@anchor" },
        { include: "@tagHandle" },
        { include: "@flowCollections" },
        { include: "@blockStyle" },
        [/@numberInteger(?![ \t]*\S+)/, "number"],
        [/@numberFloat(?![ \t]*\S+)/, "number.float"],
        [/@numberOctal(?![ \t]*\S+)/, "number.octal"],
        [/@numberHex(?![ \t]*\S+)/, "number.hex"],
        [/@numberInfinity(?![ \t]*\S+)/, "number.infinity"],
        [/@numberNaN(?![ \t]*\S+)/, "number.nan"],
        [/@numberDate(?![ \t]*\S+)/, "number.date"],
        [/(".*?"|'.*?'|.*?)([ \t]*)(:)( |$)/, ["type", "white", "operators", "white"]],
        { include: "@flowScalars" },
        [
          /[^#]+/,
          {
            cases: {
              "@keywords": "keyword",
              "@default": "string"
            }
          }
        ]
      ],
      object: [
        { include: "@whitespace" },
        { include: "@comment" },
        [/\}/, "@brackets", "@pop"],
        [/,/, "delimiter.comma"],
        [/:(?= )/, "operators"],
        [/(?:".*?"|'.*?'|[^,\{\[]+?)(?=: )/, "type"],
        { include: "@flowCollections" },
        { include: "@flowScalars" },
        { include: "@tagHandle" },
        { include: "@anchor" },
        { include: "@flowNumber" },
        [
          /[^\},]+/,
          {
            cases: {
              "@keywords": "keyword",
              "@default": "string"
            }
          }
        ]
      ],
      array: [
        { include: "@whitespace" },
        { include: "@comment" },
        [/\]/, "@brackets", "@pop"],
        [/,/, "delimiter.comma"],
        { include: "@flowCollections" },
        { include: "@flowScalars" },
        { include: "@tagHandle" },
        { include: "@anchor" },
        { include: "@flowNumber" },
        [
          /[^\],]+/,
          {
            cases: {
              "@keywords": "keyword",
              "@default": "string"
            }
          }
        ]
      ],
      multiString: [[/^( +).+$/, "string", "@multiStringContinued.$1"]],
      multiStringContinued: [
        [
          /^( *).+$/,
          {
            cases: {
              "$1==$S2": "string",
              "@default": { token: "@rematch", next: "@popall" }
            }
          }
        ]
      ],
      whitespace: [[/[ \t\r\n]+/, "white"]],
      comment: [[/#.*$/, "comment"]],
      flowCollections: [
        [/\[/, "@brackets", "@array"],
        [/\{/, "@brackets", "@object"]
      ],
      flowScalars: [
        [/"([^"\\]|\\.)*$/, "string.invalid"],
        [/'([^'\\]|\\.)*$/, "string.invalid"],
        [/'[^']*'/, "string"],
        [/"/, "string", "@doubleQuotedString"]
      ],
      doubleQuotedString: [
        [/[^\\"]+/, "string"],
        [/@escapes/, "string.escape"],
        [/\\./, "string.escape.invalid"],
        [/"/, "string", "@pop"]
      ],
      blockStyle: [[/[>|][0-9]*[+-]?$/, "operators", "@multiString"]],
      flowNumber: [
        [/@numberInteger(?=[ \t]*[,\]\}])/, "number"],
        [/@numberFloat(?=[ \t]*[,\]\}])/, "number.float"],
        [/@numberOctal(?=[ \t]*[,\]\}])/, "number.octal"],
        [/@numberHex(?=[ \t]*[,\]\}])/, "number.hex"],
        [/@numberInfinity(?=[ \t]*[,\]\}])/, "number.infinity"],
        [/@numberNaN(?=[ \t]*[,\]\}])/, "number.nan"],
        [/@numberDate(?=[ \t]*[,\]\}])/, "number.date"]
      ],
      tagHandle: [[/\![^ ]*/, "tag"]],
      anchor: [[/[&*][^ ]+/, "namespace"]]
    }
  };
  return __toCommonJS(yaml_exports);
})();
return moduleExports;
});
