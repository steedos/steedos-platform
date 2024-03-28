/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2024-03-26 19:08:54
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-03-28 15:54:40
 * @Description:
 */
import http from "k6/http";
import { check, group, sleep } from "k6";

export const options = {
    vus: __ENV.VUS,
    duration: __ENV.DURATION,
};

export default () => {
    const params = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${__ENV.API_KEY}`,
        },
    };
    const res = http.get(
        `${__ENV.ROOT_URL}/api/v1/k6_test_main?top=20`,
        params
    );
    check(res, {
        "k6主表 列表查询(top=20)": (obj) => {
            return obj.body.length > 0;
        },
    });
    sleep(1);
};
