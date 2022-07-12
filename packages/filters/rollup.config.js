const globals = { 
  'moment': 'moment',
  'underscore': '_'
}

export default {
  input: 'src/index.js',
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