/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-06-26 09:44:42
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-06-27 15:17:35
 * @Description: 
 */
const passport = require("passport");
const { oidc } = require("./middleware");

export const auth = {
  passport: passport,
  oidc: oidc,
}