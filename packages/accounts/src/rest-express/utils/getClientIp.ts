/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2025-09-12 14:05:36
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2025-09-12 14:08:08
 * @FilePath: /steedos-platform-3.0/packages/accounts/src/rest-express/utils/getClientIp.ts
 * @Description:
 */

import * as requestIp from "request-ip";

export const getClientIp = (req) => {
  let ip = requestIp.getClientIp(req);
  // 去掉 IPv6 前缀 ::ffff:
  if (ip && ip.startsWith("::ffff:")) {
    ip = ip.substring(7);
  }

  // IPv6 localhost 映射
  if (ip === "::1") {
    ip = "127.0.0.1";
  }

  return ip;
};
