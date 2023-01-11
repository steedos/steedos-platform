'use strict'

let db = require("../db");

// 更新一下数据库中space_users，全部接受邀请

// 空值表示以下脚本应用到所有工作区
let limited_space_ids = [];

let upBySpace = async function (spaceId) {
  // console.log(`SPACEID: ${spaceId}`);
  let updatedDoc = await db.updateMany("space_users", [["space", "=", spaceId], ["invite_state", "=", "pending"]], {
    user_accepted: true,
    invite_state: 'accepted'
  }).catch((ex) => {
    console.error(ex);
    return {};
  });
  console.log("UPDATED space_users count:", updatedDoc.result ? updatedDoc.result.nModified : 'error');
}

let downBySpace = async function (spaceId) {
  // console.log(`SPACEID: ${spaceId}`);
}

// 判断 company 表为空，执行 company_id 升级
module.exports.up = async function (next) {
  if (limited_space_ids.length) {
  }
  else {
    // limited_space_ids为空，则不限制工作区，查出所有工作区ID值循环
    let spaces = await db.find("spaces", {
      fields: ["_id"]
    }).catch((ex) => {
      console.error(ex);
      return [];
    });
    limited_space_ids = spaces.map((n) => { return n._id; });
    console.log(`SPACES count: ${limited_space_ids.length}`);
  }
  for (let spaceId of limited_space_ids) {
    await upBySpace(spaceId);
  }
}

module.exports.down = async function (next) {
  if (limited_space_ids.length) {
  }
  else {
    // limited_space_ids为空，则不限制工作区，查出所有工作区ID值循环
    let spaces = await db.find("spaces", {
      fields: ["_id"]
    }).catch((ex) => {
      console.error(ex);
      return [];
    });
    limited_space_ids = spaces.map((n) => { return n._id; });
    console.log(`SPACES count: ${limited_space_ids.length}`);
  }
  for (let spaceId of limited_space_ids) {
    await downBySpace(spaceId);
  }
}
