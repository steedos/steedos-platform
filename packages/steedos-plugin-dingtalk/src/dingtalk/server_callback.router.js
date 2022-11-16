// let WXBizMsgCrypt = require('wechat-crypto');
const router =require('@steedos/router').staticRouter()
const Cookies = require("cookies");
const objectql = require('@steedos/objectql');
const fs = require('fs');
const steedosConfig = objectql.getSteedosConfig();
const steedosSchema = objectql.getSteedosSchema();
const dtApi = require('./dt_api');
const dtSync = require('./dt_sync.js');
const DingtalkManager = require('./dingtalk_manager');
const push = require('./notifications');
const auth = require("@steedos/auth");
const fetch = require('node-fetch');
// let jsapi = require('./jsapi');

//钉钉文档：http://ddtalk.github.io/dingTalkDoc/?spm=a3140.7785475.0.0.p5bAUd#2-回调接口（分为五个回调类型）

//suite4xxxxxxxxxxxxxxx 是钉钉默认测试suiteid 
// let newCrypt = new WXBizMsgCrypt(config.token, config.encodingAESKey, config.suiteKey || 'suite4xxxxxxxxxxxxxxx');
// let TICKET_EXPIRES_IN = config.ticket_expires_in || 1000 * 60 * 20 //20分钟

const Dingtalk = {};

router.get("/steedos/dingtalk/sso_mobile", async function (req, res, next) {
    let space = dtApi.spaceGet();
    let cookies = new Cookies(req, res);
    let userId = cookies.get("X-User-Id");
    let authToken = cookies.get("X-Auth-Token");
    if (!userId && space.dingtalk_corp_id) {
        Meteor.call('dingtalk_sso', space.dingtalk_corp_id, Meteor.absoluteUrl(), function (error, result) {
            if (error) {
                throw _.extend(new Error("Error!" + error.message));
            }
            if (result) {
                DingtalkManager.dd_init_mobile(result);
            }
        });
    } else {
        FlowRouter.go('/');
    }
});

router.get('/steedos/dingtalk/sso_pc', async function (req, res, next) {
    let space = dtApi.spaceGet();
    let cookies = new Cookies(req, res);
    let userId = cookies.get("X-User-Id");
    let authToken = cookies.get("X-Auth-Token");

    if (!userId && space.dingtalk_corp_id) {
        Meteor.call('dingtalk_sso', space.dingtalk_corp_id, Meteor.absoluteUrl(), function (error, result) {
            if (error) {
                throw _.extend(new Error("Error!" + error.message));
            }
            if (result) {
                DingtalkManager.dd_init_pc(result);
            }
        });
    } else {
        FlowRouter.go('/');
    }
});

router.post("/api/dingtalk/callback", async function (req, res, next) {

    let signature = req.query.signature;
    let timestamp = req.query.timestamp;
    let nonce = req.query.nonce;
    let encrypt = req.body.encrypt;

    if (signature !== newCrypt.getSignature(timestamp, nonce, encrypt)) {
        res.writeHead(401);
        res.end('Invalid signature');
        return;
    }

    let result = newCrypt.decrypt(encrypt);
    let message = JSON.parse(result.message);
    let eventType = message.EventType;
    if (eventType === 'check_update_suite_url' || eventType === 'check_create_suite_url') { //创建套件第一步，验证有效性。
        let Random = message.Random;
        result = Dingtalk._jsonWrapper(timestamp, nonce, Random);
        JsonRoutes.sendResult(res, {
            data: result
        });

    } else {
        res.reply = function () { //返回加密后的success
            result = Dingtalk._jsonWrapper(timestamp, nonce, 'success');
            JsonRoutes.sendResult(res, {
                data: result
            });
        }
        // 通讯录事件回调
        let address_call_back_tag = ['user_add_org', 'user_modify_org', 'user_leave_org', 'org_admin_add', 'org_admin_remove', 'org_dept_create', 'org_dept_modify', 'org_dept_remove', 'org_remove'];

        if (eventType === 'suite_ticket') {
            // let data = {
            //   value: message.SuiteTicket,
            //   expires: Number(message.TimeStamp) + TICKET_EXPIRES_IN
            // }
            // config.saveTicket(data, function(err) {
            //   if (err) {
            //     return next(err);
            //   } else {
            //     res.reply();
            //   }
            // });
            let o = ServiceConfiguration.configurations.findOne({
                service: "dingtalk"
            });
            if (o) {
                r = Dingtalk.suiteAccessTokenGet(o.suite_key, o.suite_secret, message.SuiteTicket);
                if (r && r.suite_access_token) {
                    ServiceConfiguration.configurations.update(o._id, {
                        $set: {
                            "suite_ticket": message.SuiteTicket,
                            "suite_access_token": r.suite_access_token
                        }
                    });
                }

            }
            res.reply();
        }
        // 回调向ISV推送临时授权码
        else if (eventType === 'tmp_auth_code') {
            let tmp_auth_code = message.AuthCode;
            // let suiteKey = message.SuiteKey;
            let o = ServiceConfiguration.configurations.findOne({
                service: "dingtalk"
            });
            if (o && o.suite_access_token) {

                r = Dingtalk.permanentCodeGet(o.suite_access_token, tmp_auth_code);
                if (r && r.permanent_code) {

                    // 同步
                    let permanent_code = r.permanent_code;
                    let auth_corp_info = r.auth_corp_info;

                    let at = Dingtalk.corpTokenGet(o.suite_access_token, auth_corp_info.corpid, permanent_code);
                    if (at && at.access_token) {
                        Dingtalk.syncCompany(at.access_token, auth_corp_info, permanent_code);
                    }

                    // 激活授权套件
                    Dingtalk.activateSuitePost(o.suite_access_token, o.suite_key, auth_corp_info.corpid, permanent_code);
                }

            }

            res.reply();
        }
        // “解除授权”事件
        else if (eventType === 'suite_relieve') {
            let corp_id = message.AuthCorpId;
            let space = db.spaces.findOne({
                'services.dingtalk.corp_id': corp_id
            });
            if (space) {
                let s_dt = space.services.dingtalk;
                s_dt.permanent_code = undefined;
                db.spaces.direct.update({
                    _id: space._id
                }, {
                    $set: {
                        'services.dingtalk': s_dt
                    }
                });
            }
            res.reply();
        }
        // 通讯录事件回调
        else if (address_call_back_tag.includes(eventType)) {
            let corp_id = message.CorpId;
            // 企业被解散
            if (eventType === 'org_remove') {
                let space = db.spaces.findOne({
                    'services.dingtalk.corp_id': corp_id
                });
                if (space) {
                    let s_dt = space.services.dingtalk;
                    s_dt.permanent_code = undefined;
                    db.spaces.direct.update({
                        _id: space._id
                    }, {
                        $set: {
                            'services.dingtalk': s_dt
                        }
                    });
                }
            } else {
                db.spaces.direct.update({
                    'services.dingtalk.corp_id': corp_id
                }, {
                    $set: {
                        'services.dingtalk.modified': new Date()
                    }
                });
            }

            res.reply();
        } else {
            Dingtalk.processCallback(message, req, res, next);
        }

    };
});

Dingtalk.processCallback = function (message, req, res, next) {

    res.reply();
}

Dingtalk._jsonWrapper = function (timestamp, nonce, text) {
    let encrypt = newCrypt.encrypt(text);
    let msg_signature = newCrypt.getSignature(timestamp, nonce, encrypt); //新签名
    return {
        msg_signature: msg_signature,
        encrypt: encrypt,
        timeStamp: timestamp,
        nonce: nonce
    };
}

Dingtalk.write = function (content) {
    let LOG_PATH = steedosConfig.dingtalk.log_path || './ding_server.log';

    try {
        content = JSON.stringify(content);
    } catch (Exception) {

    }
    content = content + "\n"
    fs.appendFileSync(LOG_PATH, content, (err) => {
        if (err) {
            console.error(err)
            return
        }
        //file written successfully
    })
}

// 手动初始化
router.post("/api/dingtalk/init", async function (req, res, next) {

    res.reply = function (result) {
        JsonRoutes.sendResult(res, {
            data: result
        });
    }

    let corpid = req.query.corpid;
    let corpsecret = req.query.corpsecret;
    let corp_name = req.query.corp_name;

    if (!corpid)
        res.reply("need corpid!");

    if (!corpsecret)
        res.reply("need corpsecret!");

    if (!corp_name)
        res.reply("need corp_name!");


    let access_token = Dingtalk.getToken(corpid, corpsecret);

    if (access_token) {
        let auth_corp_info = {};
        auth_corp_info.corpid = corpid;
        auth_corp_info.corp_name = corp_name;
        Dingtalk.syncCompany(access_token, auth_corp_info, undefined);
    }

    JsonRoutes.sendResult(res, {
        data: "success"
    });

});

// dingtalk免登给用户设置cookies
router.post("/api/dingtalk/sso_steedos", async function (req, res, next) {
    let authtToken, hashedToken, userId, authToken, cookies, corpId, code, user_info, space_user;
    cookies = new Cookies(req, res);
    userId = cookies.get("X-User-Id");
    authToken = cookies.get("X-Auth-Token");
    corpId = req.body.corpId;
    code = req.body.code;

    let space = await dtApi.spaceGet(corpId);
    if (!space)
        return res.end("缺少参数 corpId!");

    let response = await dtApi.accessTokenGet(space.dingtalk_key, space.dingtalk_secret);

    let access_token = response.access_token;

    if (!code || !access_token)
        return res.end("缺少参数!");

    user_info = await dtApi.userInfoGet(access_token, code);

    let userObj = steedosSchema.getObject('space_users');
    // console.log("user_info: ",user_info);
    if (user_info && user_info.userid) {
        space_user = await userObj.findOne({
            filters: [['dingtalk_id', '=', user_info.userid]]
        });

        if (!space_user) {
            return res.end('no_space_user');
        }

        if (space_user && authToken) {
            if (space_user.user != userId) {
                dtApi.clearAuthCookies(req, res);
                hashedToken = Accounts._hashLoginToken(authToken);
                await dtApi.destroyToken(userId, hashedToken);
            } else {
                return res.end('login');
            }
        }

        let stampedAuthToken = auth.generateStampedLoginToken();
        let space_user_id = space_user.user;

        authtToken = stampedAuthToken.token;
        hashedToken = auth.hashStampedToken(stampedAuthToken);
        await auth.insertHashedLoginToken(space_user_id, hashedToken);
        auth.setAuthCookies(req, res, space_user_id, authtToken, space._id);
        res.setHeader('X-Space-Token', space._id + ',' + authtToken);
        return res.end('user_exists');
    } else {
        return res.end("用户不存在!");
    }

});

// 钉钉新窗口免登
router.get('/api/dingtalk/auth_login', async function (req, res) {
    try {
        let authtToken, hashedToken, userId, authToken, cookies, corpId, code, params, user_info, space_user;
        cookies = new Cookies(req, res);
        userId = cookies.get("X-User-Id");
        authToken = cookies.get("X-Auth-Token");
        params = req.query;

        corpId = params.corpId;
        code = params.code;

        let space = await dtApi.spaceGet(corpId);
        if (!space)
            return res.end("缺少参数 corpId!");

        let response = await dtApi.accessTokenGet(space.dingtalk_key, space.dingtalk_secret);

        let access_token = response.access_token;

        if (!code || !access_token)
            return res.end("缺少参数!");

        user_info = await dtApi.userInfoGet(access_token, code);

        let userObj = steedosSchema.getObject('space_users');
        // console.log("user_info: ",user_info);
        if (user_info && user_info.userid) {
            space_user = await userObj.findOne({
                filters: [['dingtalk_id', '=', user_info.userid]]
            });

            if (!space_user) {
                return res.end('no_space_user');
            }

            if (space_user && authToken) {
                if (space_user.user != userId) {
                    dtApi.clearAuthCookies(req, res);
                    hashedToken = Accounts._hashLoginToken(authToken);
                    await dtApi.destroyToken(userId, hashedToken);
                } else {
                    res.redirect(302, '/');
                    return res.end('');
                }
            }

            let stampedAuthToken = auth.generateStampedLoginToken();
            let space_user_id = space_user.user;

            authtToken = stampedAuthToken.token;
            hashedToken = auth.hashStampedToken(stampedAuthToken);
            await auth.insertHashedLoginToken(space_user_id, hashedToken);
            auth.setAuthCookies(req, res, space_user_id, authtToken, space._id);
            res.setHeader('X-Space-Token', space._id + ',' + authtToken);
            res.redirect(302, '/');
            return res.end('');
        }
    } catch (error) {
        Dingtalk.write("SSO ERROR:")
        Dingtalk.write(error);
        return res.end("");
    }

});

// 同步数据
router.get('/api/dingtalk/stockData', async function (req, res) {

    let space = await dtApi.spaceGet();
    if (!space)
        return;

    let response = await dtApi.accessTokenGet(space.dingtalk_key, space.dingtalk_secret);
    access_token = response.access_token;

    Dingtalk.write("================存量数据开始===================")
    Dingtalk.write("access_token:" + access_token)
    deptListRes = await dtApi.departmentListGet(access_token)

    for (let i = 0; i < deptListRes.length; i++) {
        Dingtalk.write("部门ID:" + deptListRes[i]['id'])
        await dtSync.deptinfoPush(deptListRes[i]['id'])
        userListRes = await dtApi.userListGet(access_token, deptListRes[i].id)
        for (let ui = 0; ui < userListRes.length; ui++) {
            Dingtalk.write("用户ID:" + userListRes[ui]['userid'])
            await dtSync.userinfoPush(userListRes[ui]['userid'])
        }

    }


    for (let i = 0; i < deptListRes.length; i++) {
        userListRes = await dtApi.userListGet(access_token, deptListRes[i].id)
        for (let ui = 0; ui < userListRes.length; ui++) {
            await dtSync.userinfoPush(userListRes[ui]['userid'])
        }

    }
    Dingtalk.write("================存量数据结束===================")
    Dingtalk.write("\n")

    res.status(200).send({ message: "dsa" });
});

// 订阅事件
router.post('/api/dingtalk/listen', async function (req, res) {
    var params = req.body
    var query = req.query
    // 获取工作区相关信息
    var dtSpace = await dtApi.spaceGet();
    // console.log("dtSpace: ",dtSpace);
    var APP_KEY = dtSpace.dingtalk_key;
    var APP_SECRET = dtSpace.dingtalk_secret;
    var AES_KEY = dtSpace.dingtalk_aes_key;
    var TOKEN = dtSpace.dingtalk_token;

    var signature = query['signature'];
    var nonce = query['nonce'];
    var timeStamp = query['timestamp'];
    var suiteKey = APP_KEY;//必填，企业ID
    var token = TOKEN;    //必须和在注册是一样
    var aesKey = AES_KEY;

    var encrypt = params['encrypt'];



    data = dtSync.decrypt({
        signature: signature,
        nonce: nonce,
        timeStamp: timeStamp,
        suiteKey: suiteKey,
        token: token,
        aesKey: aesKey,
        encrypt: encrypt
    });
    try {
        // console.log(data.data.EventType)
        switch (data.data.EventType) {
            //通讯录用户增加。
            case 'user_add_org':
                break;
            case 'user_leave_org':
                data.data.UserId.forEach(async element => {
                    await dtSync.userinfoPush(element, 2)
                });
                break;
            //通讯录用户更改
            case 'user_modify_org':
                data.data.UserId.forEach(async element => {
                    await dtSync.userinfoPush(element)
                });
                // for(let i=0;i<data.data.UserId.length;i++){
                //     
                // }
                break;
            case 'org_dept_modify':
                data.data.DeptId.forEach(async element => {
                    await dtSync.deptinfoPush(element)
                });
                break;
            case 'org_dept_create':
                data.data.DeptId.forEach(async element => {
                    await dtSync.deptinfoPush(element, 1)
                });
                break;
            case 'org_dept_remove':
                data.data.DeptId.forEach(async element => {
                    await dtSync.deptinfoPush(element, 2)
                });
                break;
            default:

                break;

        }
    } catch (e) {
        Dingtalk.write("ERROR:")
        Dingtalk.write(data.data.EventType)
        Dingtalk.write(e)
    }




    // var decrypt = decode(aesKey_decode,aesKey_decode.substring(0,16),text)
    res.status(200).send(data.res);

})

// 同步钉钉id
router.get('/api/sync/dingtalkId', async function (req, res) {
    try {
        let space = await dtApi.spaceGet();
        let spaceUsers = await dtApi.spaceUsersGet();
        if ((spaceUsers.length == 0) || !space)
            return;

        let response = await dtApi.accessTokenGet(space.dingtalk_key, space.dingtalk_secret);
        access_token = response.access_token;

        Dingtalk.write("================同步钉钉id开始===================")

        for (let ui = 0; ui < spaceUsers.length; ui++) {
            // console.log("spaceUsers[ui]: ", spaceUsers[ui]);
            Dingtalk.write("姓名:" + spaceUsers[ui]['name'])
            Dingtalk.write("手机:" + spaceUsers[ui]['mobile'])
            if (!spaceUsers[ui]['mobile'] || (spaceUsers[ui]['mobile'] == ""))
                return;

            await dtSync.useridPush(access_token, spaceUsers[ui]['mobile'])
        }
        Dingtalk.write("================同步数据结束===================")
        Dingtalk.write("\n")

        res.status(200).send({ message: "ok" });
    } catch (error) {
        Dingtalk.write("ERROR:")
        Dingtalk.write(error)
    }

});

exports.default = router;