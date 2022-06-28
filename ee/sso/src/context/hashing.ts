/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-06-26 16:30:53
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-06-27 14:29:50
 * @Description: 
 */
const bcrypt = require("bcrypt")
const env = require("./environment")
const { v4 } = require("uuid")

const SALT_ROUNDS = env.SALT_ROUNDS || 10

export const hash = async data => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS)
  return bcrypt.hash(data, salt)
}

export const compare = async (data, encrypted) => {
  return bcrypt.compare(data, encrypted)
}

export const newid = function () {
  return v4().replace(/-/g, "")
}
