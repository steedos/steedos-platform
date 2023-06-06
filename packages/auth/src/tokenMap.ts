/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-03-28 09:35:34
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-05-30 10:59:53
 * @Description: 
 */
import crypto = require('crypto');
import {
  getSteedosSchema,
} from "@steedos/objectql";
import { addConfig, getConfig, removeManyConfigs } from '@steedos/metadata-registrar';
const TOKENMAPCACHENAME = "token_map_cache";

function getTokenMapCache(token) {
  return getConfig(TOKENMAPCACHENAME, token);
}

function setTokenMapCache(token, tokenMap) {
  tokenMap._id = token;
  addConfig(TOKENMAPCACHENAME, tokenMap);
}

function _hashLoginToken(token: string) {
  const hash = crypto.createHash("sha256");
  hash.update(token);
  return hash.digest("base64");
}

async function getUser(token: string) {
  let hashedToken = _hashLoginToken(token).replace(/\//g, "%2F");
  let filters = `(services/resume/loginTokens/hashedToken eq '${hashedToken}')`;
  let users = await getSteedosSchema()
    .getObject("users")
    .find({ filters: filters, fields: ["_id"] });
  return users[0];
}

export async function getUserIdByToken(token, clientInfos = {}) {
  let tokenMap = getTokenMapCache(token);
  if (!tokenMap) {
    let user = await getUser(token);
    if (user) {
      let userId = user._id;
      setTokenMapCache(
        token,
        Object.assign({}, clientInfos, { userId: userId })
      );
      return userId;
    } else {
      return;
    }
  }
  return tokenMap.userId;
}

export function removeUserTokens(userId, is_phone) {
  removeManyConfigs(TOKENMAPCACHENAME, { userId: userId, is_phone });
}