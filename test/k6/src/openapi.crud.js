/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2024-03-26 19:08:54
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-03-28 14:56:14
 * @Description:
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
        // check(res, {
        //     "k6主表 新增": (obj) => {
        //         return obj.body.length > 0;
        //     },
        // });
        sleep(1);
    })

    group('k6主表 列表查询(top=20)', function(){
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
    });

    group('k6主表 修改记录', function(){
        const params = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${__ENV.API_KEY}`,
            },
            tags: { name: 'k6主表-修改记录' },
        };
        const res = http.put(
            `${__ENV.ROOT_URL}/api/v1/k6_test_main/${k6MainNewId}`,
            JSON.stringify({
                doc:{
                    name: `修改 - ${generateName()}`
                }
            }),
            params
        );
        check(res, {
            "k6主表 修改记录": (obj) => {
                return obj.body.length > 0;
            },
        });
        sleep(1);
    });

    group('k6主表 删除记录', function(){
        const params = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${__ENV.API_KEY}`,
            },
            tags: { name: 'k6主表-删除记录' },
        };
        const res = http.del(
            `${__ENV.ROOT_URL}/api/v1/k6_test_main/${newId}`, null,
            params
        );
        check(res, {
            "k6主表 删除记录": (obj) => {
                return obj.body.length > 0;
            },
        });
        sleep(1);
    });
};
