'use strict'

let db = require("../db");
//creator: space_user 添加 organizations_parents 属性, 值为 space_users.organizations + organizations的parents #827

// 空值表示以下脚本应用到所有工作区
let limited_space_ids = [];

let upBySpace = async function (spaceId) {
  // console.log(`SPACEID: ${spaceId}`);
  let sus = await db.find("space_users", {
    filters: [["space", "=", spaceId]],
    // filters: [["space", "=", spaceId], ["organizations_parents", "=", null]],
    fields: ["organizations"]
  }).catch((ex) => {
    console.error(ex);
    return [];
  });
  for (let su of sus) {
    let orgs = await db.find("organizations", {
      filters: [["space", "=", spaceId], ["_id", "in", su.organizations]],
      fields: ["parents"]
    }).catch((ex) => {
      console.error(ex);
      return [];
    });
    let organizations_parents = su.organizations || [];
    orgs.forEach(function (org) {
      let org_parents = org.parents || [];
      org_parents.forEach(function (parent_id) {
        if (organizations_parents.indexOf(parent_id) < 0) {
          organizations_parents.push(parent_id);
        }
      });
    });
    await db.updateOne("space_users", su._id, {
      organizations_parents: organizations_parents
    }).catch((ex) => {
      console.error(ex);
      return {};
    });
  }
  console.log("UPDATED space_users count:", sus.length);
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
