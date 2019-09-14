'use strict'

let db = require("../db");

// TODO: 如果 space_users.username 不存在，自动更新为对应的 user.username。
// https://github.com/steedos/creator/issues/864
module.exports.up = async function (next) {
  let space_users = await db.findOne("space_users");
}

module.exports.down = async function (next) {
}
