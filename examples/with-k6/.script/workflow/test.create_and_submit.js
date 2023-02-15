/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2023-02-13 15:40:47
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2023-02-14 13:50:22
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
    const flowId = "ZaYsGQuHtpRGHbuBy"
    const applicantId = "6392cb5546404e5e55791ae8"
    const spaceId = "6392cb5f46404e5e55791af5"

    // 新建申请单
    const payload = JSON.stringify({
        "instance": {
            "flow": flowId,
            "applicant": applicantId,
            "space": spaceId
        }
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
        },
    };

    const draftResult = http.post(`${root_url}/api/workflow/v2/draft`, payload, params);
    /*
    {
        "instance": {
            "_id": "oroibGfnXiWRg4try",
            "space": "6392cb5f46404e5e55791af5",
            "flow": "ZaYsGQuHtpRGHbuBy",
            "flow_version": "rLsSZ6888n5h5rGHB",
            "form": "935f5ec5-1b20-4000-a834-dbfa9858",
            "form_version": "AFfz49khzcty6JaXJ"
        }
    }
    */
    check(draftResult, {
        "create instance": (r) => {
            return r.body.indexOf('instance') > 0
        }
    });
    const newIns = JSON.parse(draftResult.body).instance
    // 提交
    // 参数根据环境调整
    const submitPayload = JSON.stringify({
        "Instances": [
            {
                "_id": newIns._id,
                "flow": newIns.flow,
                "applicant": applicantId,
                "submitter": applicantId,
                "traces": [
                    {
                        "_id": "a91f3c316478c78e05360218",
                        "step": "acyX5HpszQcL4FgC4",
                        "approves": [
                            {
                                "_id": "a308f5d43fa59205ea137f9e",
                                "description": "",
                                "values": {},
                                "next_steps": [
                                    {
                                        "step": "076e16e9-cbce-4ecb-9abe-d6281ab10a74",
                                        "users": [
                                            "6392cb5546404e5e55791ae8"
                                        ]
                                    }
                                ],
                            }
                        ]
                    }
                ],
            }
        ]
    });

    const submitResult = http.post(`${root_url}/api/workflow/submit`, submitPayload, params);
    check(submitResult, { "submit instance": (r) => r.body.indexOf('result') > 0 });

    sleep(1);
};