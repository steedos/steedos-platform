

/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-11-10 17:44:26
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-11-16 10:53:26
 * @Description: 
 */
import http from "k6/http";
import { check, group, sleep } from "k6";

export const options = {
    vus: 60,
    duration: '30s',
};

export default () => {
  const loginRes = http.get(`http://127.0.0.1:5301/locales/zh-CN/translation`);
  check(loginRes, { "retrieved crocodiles": (obj) => obj.body.length > 0 });
  sleep(1);
};
 