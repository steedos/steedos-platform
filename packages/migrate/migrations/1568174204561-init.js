'use strict'

let db = require("../db");

// TODO: 初始化数据库，创建初始工作区和初始用户。
// 如果初始admin账户已存在，则跳过。
module.exports.up = async function (next) {
  let users = await db.findOne("users");
}

module.exports.down = async function (next) {
}
