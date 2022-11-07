/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-11-04 11:59:19
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-11-04 17:36:17
 * @Description: 
 */


// process.env.DEBUG = "http"
console.log(`process.env.DEBUG`, process.env.DEBUG)
var debug = require('debug')('http')
  , http = require('http')
  , name = 'My App';

// fake app
debug('booting %o', name);

console.log("====")