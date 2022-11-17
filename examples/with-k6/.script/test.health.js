/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-11-10 17:44:26
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-11-12 10:54:47
 * @Description: 
 */
import http from "k6/http";
import { check, group, sleep } from "k6";

export const options = {
    vus: 30,
    duration: '30s',
};

export default () => {
  const loginRes = http.get(`${__ENV.ROOT_URL}/api/health`);
  check(loginRes, { "retrieved crocodiles": (obj) => obj.body.length > 0 });

  sleep(1);
};
 