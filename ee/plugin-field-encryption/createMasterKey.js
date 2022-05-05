/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-05-04 19:41:58
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-05-04 19:46:41
 * @Description: 
 */
const fs = require('fs');
const crypto = require('crypto');

try {
  fs.writeFileSync('master-key.txt', crypto.randomBytes(96).toString('base64'));
} catch (err) {
  console.error(err);
}