(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Assets = factory());
}(this, (function () { 'use strict';

  var assets = {
      packages: [
          // {
          //   "package": "react",
          //   "urls": [
          //     "https://g.alicdn.com/code/lib/react/17.0.2/umd/react.development.js"
          //   ],
          //   "library": "React"
          // },
          // {
          //   "package": "react-dom",
          //   "urls": [
          //     "https://g.alicdn.com/code/lib/react-dom/17.0.2/umd/react-dom.development.js"
          //   ],
          //   "library": "ReactDOM"
          // },
          {
              "package": "prop-types",
              "library": "PropTypes",
              "urls": [
                  "https://g.alicdn.com/code/lib/prop-types/15.7.2/prop-types.js"
              ]
          },
          {
              "package": "lodash",
              "library": "_",
              "urls": [
                  "https://unpkg.com/lodash@4.17.10/lodash.js"
              ]
          },
          {
              "package": "moment",
              "library": "moment",
              "urls": [
                  "https://g.alicdn.com/mylib/moment/2.24.0/min/moment.min.js"
              ]
          },
      ],
      components: [
      // {
      //   exportName: "BuilderReactMeta",
      //   npm: {
      //     package: "@steedos-builder/react"
      //   },
      //   url: "https://unpkg.com/@steedos-builder/react/dist/meta.js",
      //   urls: {
      //     default: "https://unpkg.com/@steedos-builder/react/dist/meta.js",
      //     design: "https://unpkg.com/@steedos-builder/react/dist/meta.js"
      //   }
      // }
      ]
  };

  return assets;

})));
