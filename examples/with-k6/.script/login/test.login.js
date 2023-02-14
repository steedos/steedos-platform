/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2023-02-13 10:12:49
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2023-02-13 15:11:19
 * @Description: 
 */
import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 10,
  duration: '30s',
};

export default () => {
  const url = 'http://127.0.0.1:5100/accounts/password/login';
  // payload根据环境调整
  const payload = JSON.stringify({
    "device_id": "",
    "locale": "zh-cn",
    "password": "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
    "token": "",
    "user": {
      "email": "s32@s.com",
      "mobile": "",
      "username": "",
      "spaceId": "6392cb5f46404e5e55791af5"
    }
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const loginRes = http.post(url, payload, params);
  // console.log(loginRes)
  check(loginRes, { "retrieved crocodiles": (obj) => obj.body.length > 0 });

  sleep(1);
};
