/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2024-03-27 15:59:45
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-03-28 16:06:14
 * @Description: 
 */

module.exports = {
    mode: 'production',
    entry: './src/openapi.insert.child.js',
    externals: {
        "__ENV": "__ENV"
    },
    output: {
        path: __dirname + '/dist',
        filename: 'openapi.insert.child.js',
        libraryTarget: 'commonjs'
    },
    module: {
        rules: [
            { test: /\.js$/, use: 'babel-loader' },
        ]
    },
    stats: {
        colors: true,
        warnings: false
    },
    target: "web",
    externals: /k6(\/.*)?/,
    devtool: 'source-map',
}