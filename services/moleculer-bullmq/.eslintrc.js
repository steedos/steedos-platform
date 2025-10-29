module.exports = {
  root: true,
  env: {
    node: true,
    commonjs: true,
    es6: true,
    jquery: false,
    jest: true,
    jasmine: true
  },
  extends: ['eslint:recommended', 'plugin:jest/recommended'],
  plugins: ['jest'],
  parserOptions: {
    ecmaVersion: 10,
    sourceType: 'module'
  },
  rules: {
    indent: [
      'error',
      2
    ],
    quotes: [
      'error',
      'single'
    ],
    'no-var': [
      'error'
    ],
    'no-console': [
      'warn'
    ],
    'no-unused-vars': [
      'warn'
    ],
    'no-mixed-spaces-and-tabs': [
      'error'
    ],
    'require-atomic-updates': [
      'off'
    ]
  }
}
