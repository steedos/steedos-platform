'use strict'

let db = require("../db");
const initSpace = {
  "space": {
      "name": "华炎软件"
  },
  "users": [{
    "username": "admin",
    "name": "Admin",
    "password_expired": true,
    "services": {
      "password": {
        "bcrypt": "$2b$10$x/NU/hYa3OQXcF1BaUaSbOhL/.HMUtekPRXY.KhJKBifY854cT6Uy"
      }
    }
  }],
  "organizations": [{
      
  }]
}

// TODO: 初始化数据库，创建初始工作区和初始用户。
// 如果初始admin账户已存在，则跳过。
module.exports.up = async function (next) {
  console.log('db', db)
  const adminUser = await db.findOne('users',{username: 'admin'})
  console.log('adminUser', adminUser)
  if(!adminUser){
    const spaceDoc = await db.insert("spaces", initSpace.space)
    const orgDoc = await db.insert("organizations", {space: spaceDoc._id, name: spaceDoc.name, fullname: spaceDoc.name, is_company: true})
    for(let user of initSpace.users){
      const userDoc = await db.insert("users", user)
      await db.update("spaces", spaceDoc._id, {owner: userDoc._id, admins: [userDoc._id]})
      console.log("update spaces end")
      await db.insert("space_users", {user: userDoc._id, space: spaceDoc._id, username: userDoc.username, name: userDoc.name, user_accepted: true, organizations: [orgDoc._id], organizations_parents: [orgDoc._id]})
      await db.update("organizations", orgDoc._id,  {users: [userDoc._id]})
    }
    console.log('insert admin user...')
  }
}

module.exports.down = async function (next) {
}
