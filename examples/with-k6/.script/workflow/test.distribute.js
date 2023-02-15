/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2023-02-14 11:52:15
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2023-02-14 13:35:10
 * @Description: 
 */

import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
    vus: 100,
    duration: '30s',
    // iterations: 1
};

export default () => {
    // 参数根据环境调整
    const root_url = 'http://127.0.0.1:5100';
    const authToken = '6392cb5f46404e5e55791af5,12dc2665fa930fce8f919028d55f129ad8c2ef489ecaed696733af6877c97cf183e0224c28f2e750ea1fe6'

    // 分发申请单
    const payload = JSON.stringify({
        "instance_id": "xpwcJTj7q8Y5dgF6u",
        "space_id": "6392cb5f46404e5e55791af5",
        "flow_id": "ZaYsGQuHtpRGHbuBy",
        "hasSaveInstanceToAttachment": false,
        "isForwardAttachments": true,
        "selectedUsers": [
            "6392cb5546404e5e55791ae8"
        ],
        "action_type": "distribute",
        "related": false,
        "from_approve_id": "d1ca8b802b621eeb369bc5d2"
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
        },
    };

    const distributeResult = http.post(`${root_url}/api/workflow/v2/instance/forward`, payload, params);
    /*
    {
        "new_ins_ids": [
            "GxxpQwyo8pZc7FaTL"
        ]
    }
    */
    check(distributeResult, {
        "distribute instance": (r) => {
            return r.body.indexOf('new_ins_ids') > 0
        }
    });

    sleep(1);
};