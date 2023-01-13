/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-11-12 11:33:10
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2023-01-13 15:04:41
 * @Description: 
 */
import http from "k6/http";
import { check, group, sleep } from "k6";

export const options = {
    vus: 1,
    duration: '30s',
};

export default () => {
  const params = {
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${__ENV.API_KEY}`,
    },
  };

  const loginRes = http.get(`${__ENV.ROOT_URL}/service/api/apps/admin/menus`, params);
  check(loginRes, { "retrieved crocodiles": (obj) => obj.body.length > 0 });

  sleep(1);
};
