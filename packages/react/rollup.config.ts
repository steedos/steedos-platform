import resolve from "rollup-plugin-node-resolve";
import sourceMaps from "rollup-plugin-sourcemaps";
import typescript from "rollup-plugin-typescript2";
import replace from "rollup-plugin-replace";
import json from "rollup-plugin-json";
import { terser } from "rollup-plugin-terser";
import uglify from "@lopatnov/rollup-plugin-uglify";
import { babel } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';

import pkg from "./package.json";

const libraryName = "steedos-react";

const resolvePlugin = resolve();


const external = [
  "react",
  "react-dom",
  'lodash',
  "@steedos-builder/sdk",
  "@steedos-builder/react",
  "@steedos-widgets/design-system",
  // "@salesforce-ux/design-system",
  // "@salesforce/design-system-react",
  // "@ag-grid-community/react",
  // "@ag-grid-community/all-modules",
  // "@ag-grid-enterprise/all-modules",
  // "@chakra-ui/react",
  // "antd",
]

const globals = { 
 'react': 'React',
 'react-dom': 'ReactDOM',
 'lodash': '_',
  '@steedos-builder/sdk': 'BuilderSDK',
  '@steedos-builder/react': 'BuilderReact',
  "@steedos-widgets/design-system": 'DesignSystem',
 }

const options = {
  input: `src/${libraryName}.ts`,
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: external,
  watch: {
    include: "../**"
  },
  plugins: [
    builtins(),
    typescript({
      include: ["*.ts+(|x)", "**/*.ts+(|x)"],
      tsconfigOverride: {
        compilerOptions: {
          // No need to type check and gen over and over, we do once at beggingn of builder with `tsc`
          declaration: false,
          checkJs: false,
          allowJs: true,
        }
      }
    }),
    replace({
      "process.env.NODE_ENV": JSON.stringify("production")
    }),
    // Allow json resolution
    json(),
    // Compile TypeScript files
    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs({
    }),
    babel({
      babelHelpers: 'runtime',
      presets: [
        "@babel/preset-react", 
        ["@babel/preset-env", {
          "useBuiltIns": false,
        }]
      ],
      "plugins": [
        // ["@babel/plugin-proposal-class-properties", { loose: true }],
        // [
        // '@babel/plugin-proposal-object-rest-spread',
        '@babel/plugin-proposal-export-default-from',
        '@babel/plugin-proposal-export-namespace-from',
        // ],
        ["@babel/plugin-transform-runtime", {
          "regenerator": true,
          "corejs": false,
        }]
      ],
    }),
    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    // resolve({}),
    resolvePlugin,

    // Resolve source maps to the original source
    sourceMaps(),

    // terser(),

    // uglify()
  ]
};

export default [
  // UMD browser build
  {
    ...options,
    output: {
      file: `dist/${libraryName}.umd.js`,
      name: "ReactSteedos",
      format: "umd",
      globals,
      intro: 'const global = window;',
      sourcemap: false
      // amd: {
      //   id: "@steedos-builder/react"
      // }
    }
  },
  // Main ES and CJS builds
  // {
  //   ...options,
  //   output: [
  //     { file: pkg.module, format: "es", sourcemap: true },
  //     { file: pkg.main, format: "cjs", sourcemap: true }
  //   ],
  //   external: externalDependencies,
  //   plugins: options.plugins
  //     .filter(plugin => plugin !== resolvePlugin)
  //     .concat([
  //       resolve({
  //         only: [/^\.{0,2}\//]
  //       })
  //     ])
  // },
 
  // iife build
  {
    ...options,
    output: {
      file: `dist/${libraryName}.browser.js`,
      format: "iife",
      name: "ReactSteedos",
      globals,
      sourcemap: false
    }
  },
 
];
