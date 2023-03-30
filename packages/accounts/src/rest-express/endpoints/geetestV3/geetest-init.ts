import * as express from 'express';
const axios = require("axios");
const GeetestConfig = require('./sdk/geetest_config')
const GeetestLib = require('./sdk/geetest_lib')
const validator = require('validator');

let geetest_status = null

//初始化
export const geetest_init = (data: any) => async (
    req: express.Request,
    res: express.Response
) => {
    try {
        /*
   必传参数
       digestmod 此版本sdk可支持md5、sha256、hmac-sha256，md5之外的算法需特殊配置的账号，联系极验客服
   自定义参数,可选择添加
       user_id 客户端用户的唯一标识，确定用户的唯一性；作用于提供进阶数据分析服务，可在register和validate接口传入，不传入也不影响验证服务的使用；若担心用户信息风险，可作预处理(如哈希处理)再提供到极验
       client_type 客户端类型，web：电脑上的浏览器；h5：手机上的浏览器，包括移动应用内完全内置的web_view；native：通过原生sdk植入app应用的方式；unknown：未知
       ip_address 客户端请求sdk服务器的ip地址
    */
        const gtLib = new GeetestLib(GeetestConfig.GEETEST_ID, GeetestConfig.GEETEST_KEY);
        const digestmod = "md5";
        const userId = "test";
        const params = { "digestmod": digestmod, "user_id": userId, "client_type": "web", "ip_address": "127.0.0.1" }
        const bypasscache = geetest_status
        let result;
        if (bypasscache === "success") {
            result = await gtLib.register(digestmod, params);
        } else {
            result = await gtLib.localRegister();
        }
        res.set('Content-Type', 'application/json;charset=UTF-8')
        res.send(result.data)
    } catch (err) {
        console.log('err', err)
    }
    return
};

// 二次验证接口，POST请求
export const geetest_validate = async function (req, res, next) {
    if (validator.toBoolean(process.env.STEEDOS_CAPTCHA_GEETEST_ENABLED) === true) {
        const gtLib = new GeetestLib(GeetestConfig.GEETEST_ID, GeetestConfig.GEETEST_KEY);
        if (req.body.geetest) {
            const challenge = req.body.geetest[GeetestLib.GEETEST_CHALLENGE];
            const validate = req.body.geetest[GeetestLib.GEETEST_VALIDATE];
            const seccode = req.body.geetest[GeetestLib.GEETEST_SECCODE];
            const bypasscache = geetest_status;
            let result;
            var params = new Array();
            if (bypasscache === "success") {
                result = await gtLib.successValidate(challenge, validate, seccode, params);
            } else {
                result = gtLib.failValidate(challenge, validate, seccode);
            }
            // 注意，不要更改返回的结构和值类型
            if (result.status === 1) {
                next()
            } else {
                return res.json({ "result": "fail", "version": GeetestLib.VERSION, "msg": result.msg });
            }
        } else {
            return res.json({ "result": "fail", "version": GeetestLib.VERSION, "msg": '无验证信息' });
        }
    } else {
        next()
    }

}


async function sendRequest(params) {
    const request_url = GeetestConfig.BYPASS_URL;
    let bypass_res;
    try {
        const res = await axios({
            url: request_url,
            method: "GET",
            timeout: 5000,
            params: params
        });
        const resBody = (res.status === 200) ? res.data : "";
        bypass_res = resBody["status"];
    } catch (e) {
        bypass_res = "";
    }
    return bypass_res;
}

function sleep() {
    return new Promise((resolve) => {
        setTimeout(resolve, GeetestConfig.CYCLE_TIME * 1000);
    })
}
let bypass_status = 'success';
async function checkBypassStatus() {
    while (true) {
        bypass_status = await sendRequest({ "gt": GeetestConfig.GEETEST_ID });
        if (bypass_status === "success") {
            geetest_status = bypass_status
        }
        else {
            bypass_status = "fail"
            geetest_status = 'fail'
        }
        await sleep();
    }
}
if (process.env.STEEDOS_CAPTCHA_GEETEST_ENABLED === 'true') {
    checkBypassStatus()
}







