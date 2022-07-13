/*
 * @Author: yinlianghui@steedos.com
 * @Date: 2022-07-12 22:59:48
 * @LastEditors: yinlianghui@steedos.com
 * @LastEditTime: 2022-07-13 09:29:19
 * @Description: 
 */
const external = [
  "moment",
  'lodash'
];

const globals = { 
  'moment': 'moment',
  'lodash': '_'
}

export default {
  input: 'src/index.js',
  external,
  watch: {
    include: 'src/**',
  },
  output: {
    file: "dist/steedos-filters.umd.js",
    format: "umd",
    name: "SteedosFilters",
    sourcemap: false,
    strict: false,
    globals,
  }
};