'use strict'

let db = require("../db");

// TODO: 创建云管理工作区
// https://github.com/steedos/creator/issues/233
module.exports.up = async function (next) {
  let space_users = await db.findOne("space_users");
}

module.exports.down = async function (next) {
}
