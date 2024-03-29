/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2024-03-26 19:08:54
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-03-28 16:02:14
 * @Description: 一条主表 + 50条 子表汇总
 */
import http from "k6/http";
import { check, group, sleep } from "k6";

import { generateSubscriberK6MainInsertDoc, generateName, generateID } from "./generators/subscriberK6MainInsertDoc";

import { generateSubscriberK6ChildInsertDoc } from "./generators/subscriberK6ChildInsertDoc";

export const options = {
    vus: __ENV.VUS,
    duration: __ENV.DURATION,
};

export default () => {

    let k6MainNewId = "";

    group('k6主表 新增', function(){
        const doc = generateSubscriberK6MainInsertDoc();
        const params = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${__ENV.API_KEY}`,
            },
        };
        const res = http.post(
            `${__ENV.ROOT_URL}/api/v1/k6_test_main`,
            JSON.stringify({
                doc: doc
            }),
            params
        );
        k6MainNewId = JSON.parse(res.body).data._id;

        check(res, {
            "k6主表 新增": (obj) => {
                return obj.body.length > 0;
            },
        });
        sleep(1);
    });

    group('k6子表 新增', function(){
        for(let i = 0; i < 50; i++){
            const doc = generateSubscriberK6ChildInsertDoc();
            doc.master = k6MainNewId;
            const params = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${__ENV.API_KEY}`,
                },
            };
            http.post(
                `${__ENV.ROOT_URL}/api/v1/k6_test_child`,
                JSON.stringify({
                    doc: doc
                }),
                params
            );
        }   
        sleep(1);
    })
};
