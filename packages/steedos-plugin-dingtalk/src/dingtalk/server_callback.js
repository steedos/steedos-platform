// let WXBizMsgCrypt = require('wechat-crypto');
let express = require('express');
let router = express.Router();
let Cookies = require("cookies");
let objectql = require('@steedos/objectql');
let steedosConfig = objectql.getSteedosConfig();
let dtApi = require('./dt_api');
let DingtalkManager = require('./dingtalk_manager');
let push = require('./notifications');
const auth = require("@steedos/auth");
// let jsapi = require('./jsapi');

//钉钉文档：http://ddtalk.github.io/dingTalkDoc/?spm=a3140.7785475.0.0.p5bAUd#2-回调接口（分为五个回调类型）

let config = {
    token: "steedos",
    encodingAESKey: "vr8r85bhgaruo482zilcyf6uezqwpxpf88w77t70dow",
    suiteKey: "suitedjcpb8olmececers"
}

//suite4xxxxxxxxxxxxxxx 是钉钉默认测试suiteid 
// let newCrypt = new WXBizMsgCrypt(config.token, config.encodingAESKey, config.suiteKey || 'suite4xxxxxxxxxxxxxxx');
// let TICKET_EXPIRES_IN = config.ticket_expires_in || 1000 * 60 * 20 //20分钟

const Dingtalk = {};

router.get("/steedos/dingtalk/sso_mobile", async function (req, res, next){
    let space = dtApi.spaceGet();
    let cookies = new Cookies(req, res);
    let userId = cookies.get("X-User-Id");
    let authToken = cookies.get("X-Auth-Token");
    if (!userId && space.dingtalk_corp_id) {
        Meteor.call('dingtalk_sso', space.dingtalk_corp_id, Meteor.absoluteUrl(), function(error, result) {
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

router.get('/steedos/dingtalk/sso_pc', async function (req, res, next){
    let space = dtApi.spaceGet();
    let cookies = new Cookies(req, res);
    let userId = cookies.get("X-User-Id");
    let authToken = cookies.get("X-Auth-Token");

    if (!userId && space.dingtalk_corp_id) {
        Meteor.call('dingtalk_sso', space.dingtalk_corp_id, Meteor.absoluteUrl(), function(error, result) {
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
    let authtToken,hashedToken,userId,cookies;
    cookies = new Cookies(req, res);
    userId = cookies.get("X-User-Id");
    authToken = cookies.get("X-Auth-Token");
    
    res.reply = function (result) {
        JsonRoutes.sendResult(res, {
            data: result
        });
    }

    let space = dtApi.spaceGet(req.body.corpId);
    if (!space)
        res.reply("缺少参数 corpId!");
    
    let access_token = dtApi.accessTokenGet(space.dingtalk_key, space.dingtalk_secret).access_token;
    let code = req.body.code;

    if (!code || !access_token)
        res.reply("缺少参数!");

    let user_info, space_user;
    user_info = dtApi.userInfoGet(access_token, code);

    if (user_info && user_info.userid) {
        space_user = db.space_users.findOne({
            'dingtalk_id': user_info.userid
        });

        if (!space_user){
            return res.end('no_space_user');
        }

        if (space_user && authToken) {
            if (space_user.user != userId) {
                dtApi.clearAuthCookies(req, res);
                hashedToken = Accounts._hashLoginToken(authToken);
                Accounts.destroyToken(userId, hashedToken);
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
        res.reply("用户不存在!");
    }

});

exports.router = router;