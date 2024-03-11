// "use strict";

const Cookies = require("cookies");
const router = require('@steedos/router').staticRouter()
const auth = require("@steedos/auth");
const objectql = require('@steedos/objectql');
const xmlparser = require('express-xml-bodyparser');
const xml2js = require('xml2js');
const fetch = require('node-fetch');

const qywxSync = {
    write: async function (content) {
        return broker.call('@steedos/plugin-qywx.write', { content })
    }
}

router.use("/qywx", async function (req, res, next) {
    await next();
});

// 网页授权登录
router.get("/api/qiyeweixin/auth_login", async function (req, res, next) {
    const broker = objectql.getSteedosSchema().broker
    let authToken, cookies, hashedToken, user, userId, userInfo, state, redirect_url, _ref5, space, spaceId, token, qywxUser;
    cookies = new Cookies(req, res);

    userId = cookies.get("X-User-Id");
    authToken = cookies.get("X-Auth-Token");

    state = req.query.state;
    space = await broker.call('@steedos/plugin-qywx.getSpace', { corpId: null })
    // 获取access_token
    if (space.qywx_corp_id && space.qywx_secret) {
        let response = await broker.call('@steedos/plugin-qywx.getToken', { corpId: space.qywx_corp_id, secret: space.qywx_secret })
        token = response.access_token;
    }

    // 推送消息重定向url
    if (state != "")
        redirect_url = Meteor.absoluteUrl(state);

    if ((req != null ? (_ref5 = req.query) != null ? _ref5.code : void 0 : void 0) && token) {
        userInfo = await broker.call('@steedos/plugin-qywx.getUserInfo', { accessToken: token, code: req.query.code })
    } else {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        res.write(
            `<!DOCTYPE html>
            <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=yes">
                    <title>Steedos</title>
                    <link rel="stylesheet" type="text/css" href="${getAbsoluteUrl("/assets/styles/steedos-tailwind.min.css")}">
                    <script type="text/javascript" src="${getAbsoluteUrl("/lib/jquery/jquery-1.11.2.min.js")}"></script>
                    <style>
                    </style>
                </head>
                <body>
                    <div class="rounded-md bg-yellow-50 p-6 m-6">
                        <div class="flex">
                        <div class="flex-shrink-0">
                            <!-- Heroicon name: exclamation -->
                            <svg class="h-6 w-6 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                            </svg>
                        </div>
                        <div class="ml-3">
                            <h3 class="text-lg leading-5 font-bold text-yellow-700">
                            登录失败
                            </h3>
                            <div class="mt-2 text-base leading-5 text-yellow-600">
                            <p>
                            未获取企业授权码或access_token，请联系管理员配置工作区企业微信相关信息
                            </p>
                            </div>
                        </div>
                        </div>
                    </div>
                </body>
            </html>
            `
        );
        return res.end('');
    }

    user = await broker.call('@steedos/plugin-qywx.getSpaceUser', { spaceId: space._id, userInfo: userInfo })

    if (userInfo.user_ticket) {
        qywxUser = await broker.call('@steedos/plugin-qywx.getUserDetail', { accessToken: token, userTicket: userInfo.user_ticket })
    }

    // 默认工作区
    if (space)
        spaceId = space._id;

    if (!user || !space) {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        res.write(
            `<!DOCTYPE html>
            <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=yes">
                    <title>Steedos</title>
                    <link rel="stylesheet" type="text/css" href="${getAbsoluteUrl("/assets/styles/steedos-tailwind.min.css")}">
                    <script type="text/javascript" src="${getAbsoluteUrl("/lib/jquery/jquery-1.11.2.min.js")}"></script>
                    <style>
                    </style>
                </head>
                <body>
                    <div class="rounded-md bg-yellow-50 p-6 m-6">
                        <div class="flex">
                        <div class="flex-shrink-0">
                            <!-- Heroicon name: exclamation -->
                            <svg class="h-6 w-6 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                            </svg>
                        </div>
                        <div class="ml-3">
                            <h3 class="text-lg leading-5 font-bold text-yellow-700">
                            登录失败
                            </h3>
                            <div class="mt-2 text-base leading-5 text-yellow-600">
                            <p>
                            请联系管理员配置企业微信工作区ID和用户ID
                            </p>
                            </div>
                        </div>
                        </div>
                    </div>
                </body>
            </html>
            `
        );
        // res.write('<head><meta charset="utf-8"/></head>');
        // res.write('<h1>提示 Tips</h1>');
        // res.write('<h2>请联系管理员配置企业微信工作区ID和用户ID...</h2>');
        return res.end('');
    } else {
        if (qywxUser) {
            // 同步更新手机号
            let qywxMobile = qywxUser.mobile;
            let userMobile = user.mobile || "";
            if ((qywxMobile != userMobile) && (qywxMobile != "")) {
                await broker.call('@steedos/plugin-qywx.updateUserMobile', { userId: user._id, mobile: qywxUser.mobile });
            }

            // 同步更新邮箱
            let qywxEmail = qywxUser.email;
            let userEmail = user.email || "";
            if ((qywxEmail != userEmail) && (qywxEmail != "")) {
                await broker.call('@steedos/plugin-qywx.updateUserEmail', { userId: user._id, email: qywxUser.email });
            }

        }

        if (userId && authToken) {
            if (user.user != userId) {
                // console.log("userId: ",userId);
                clearAuthCookies(req, res);
                hashedToken = Accounts._hashLoginToken(authToken);
                await destroyToken(userId, hashedToken);
            } else {
                res.redirect(302, redirect_url || '/');
                return res.end('');
            }
        }
        let stampedAuthToken = auth.generateStampedLoginToken();

        console.log("========>req", req);
        console.log("========res", res);
        authtToken = stampedAuthToken.token;
        hashedToken = auth.hashStampedToken(stampedAuthToken);
        await auth.insertHashedLoginToken(user.user, hashedToken);
        auth.setAuthCookies(req, res, user.user, authtToken, spaceId);
        res.setHeader('X-Space-Token', spaceId + ',' + authtToken);
        res.redirect(302, redirect_url || '/');
        return res.end('');
    }
});

// 从企业微信端单点登录:从浏览器后台管理页面"前往服务商后台"进入的网址
router.get("/api/qiyeweixin/sso_steedos", async function (req, res, next) {
    let at, authToken, hashedToken, loginInfo, o, user, _ref5, _ref6, _ref7;
    o = ServiceConfiguration.configurations.findOne({
        service: "qiyeweixin"
    });
    at = await broker.call('@steedos/plugin-qywx.getProviderToken', { corpId: o != null ? (_ref5 = o.secret) != null ? _ref5.corpid : void 0 : void 0, providerSecret: o != null ? (_ref6 = o.secret) != null ? _ref6.provider_secret : void 0 : void 0 })
    if (at && at.provider_access_token) {
        console.log("at.provider_access_token: ", at.provider_access_token);
        loginInfo = await broker.call('@steedos/plugin-qywx.getLoginInfo', { accessToken: at.provider_access_token, authCode: req.query.auth_code })
        if (loginInfo != null ? (_ref7 = loginInfo.user_info) != null ? _ref7.userid : void 0 : void 0) {
            console.log("loginInfo.user_info.userid: ", loginInfo.user_info.userid);
            user = db.space_users.findOne({
                'qywx_id': loginInfo.user_info.userid
            });
            if (user) {
                let stampedAuthToken = auth.generateStampedLoginToken();
                authtToken = stampedAuthToken.token;
                hashedToken = auth.hashStampedToken(stampedAuthToken);
                await auth.insertHashedLoginToken(user.user, hashedToken);
                auth.setAuthCookies(req, res, user.user, authtToken);
                res.redirect(302, '/');
                return res.end('');
            } else {
                res.writeHead(200, {
                    'Content-Type': 'text/html'
                });
                res.write(
                    `<!DOCTYPE html>
                <html>
                    <head>
                        <meta charset="utf-8">
                        <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=yes">
                        <title>Steedos</title>
                        <link rel="stylesheet" type="text/css" href="${getAbsoluteUrl("/assets/styles/steedos-tailwind.min.css")}">
                        <script type="text/javascript" src="${getAbsoluteUrl("/lib/jquery/jquery-1.11.2.min.js")}"></script>
                        <style>
                        </style>
                    </head>
                    <body>
                        <div class="rounded-md bg-yellow-50 p-6 m-6">
                            <div class="flex">
                            <div class="flex-shrink-0">
                                <!-- Heroicon name: exclamation -->
                                <svg class="h-6 w-6 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                                </svg>
                            </div>
                            <div class="ml-3">
                                <h3 class="text-lg leading-5 font-bold text-yellow-700">
                                登录失败
                                </h3>
                                <div class="mt-2 text-base leading-5 text-yellow-600">
                                <p>
                                请联系管理员配置企业微信工作区ID和用户ID
                                </p>
                                </div>
                            </div>
                            </div>
                        </div>
                    </body>
                </html>
                `
                );
                return res.end('');
            }
        } else {
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            res.write('<head><meta charset="utf-8"/></head>');
            res.write('<h1>提示 Tips</h1>');
            res.write('<h2>未从企业微信获取到用户信息！</h2>');
            return res.end('');
        }
    } else {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        res.write('<head><meta charset="utf-8"/></head>');
        res.write('<h1>提示 Tips</h1>');
        res.write('<h2>未从企业微信获取到服务商的Token</h2>');
        return res.end('');
    }
});

router.post('/api/qiyeweixin/listen', xmlparser({ trim: false, explicitArray: false }), async function (req, res) {
    const broker = objectql.getSteedosSchema().broker
    var query = req.query
    var params = req.body

    // console.log(params)

    var dtSpace = await broker.call('@steedos/plugin-qywx.getSpace');
    // console.log("dtSpace: ",dtSpace);
    // var APP_KEY = dtSpace.qywx_key;
    var APP_SECRET = dtSpace.qywx_secret;
    var AES_KEY = dtSpace.qywx_aes_key;
    var TOKEN = dtSpace.qywx_token;
    var CORPID = dtSpace.qywx_corp_id;

    var signature = query['msg_signature'];
    var timeStamp = query['timestamp'];
    var nonce = query['nonce'];
    var encrypt = req.body.xml.encrypt;

    var token = TOKEN;    //必须和在注册是一样
    var aesKey = AES_KEY;
    var suiteKey = CORPID;

    data = await broker.call('@steedos/plugin-qywx.decrypt', {
        signature: signature,
        nonce: nonce,
        timeStamp: timeStamp,
        suiteKey: suiteKey,
        token: token,
        aesKey: aesKey,
        encrypt: encrypt
    });

    data = await parseXML(data.data);
    // console.log(data)
    console.log(data.UserID)
    if (data.ChangeType == "create_user" || data.ChangeType == "update_user") {
        await broker.call('@steedos/plugin-qywx.userinfoPush', { userId: data.UserID })
    } else if (data.ChangeType == "create_party" || data.ChangeType == "update_party") {
        await broker.call('@steedos/plugin-qywx.deptinfoPush', { deptId: data.Id, name: data.name, parentId: data.ParentId })
    } else if (data.ChangeType == "delete_user") {
        await broker.call('@steedos/plugin-qywx.userinfoPush', { userId: data.UserID, status: 2 })
    } else if (data.ChangeType == "delete_party") {
        await broker.call('@steedos/plugin-qywx.deptinfoPush', { deptId: data.Id, name: "", parentId: "", status: 2 })
    }


    res.writeHead(200, { 'Content-Type': 'html' });
    res.write(data.data + "")
    res.end();

})


// 同步企业微信id
router.get('/api/sync/qywxId', async function (req, res) {
    const broker = objectql.getSteedosSchema().broker
    let space = await broker.call('@steedos/plugin-qywx.getSpace');

    if (!space)
        return;

    let spaceUsers = await broker.call('@steedos/plugin-qywx.getSpaceUsers', { corpId: space._id })
    let response = await broker.call('@steedos/plugin-qywx.getToken', { corpId: space.qywx_corp_id, secret: space.qywx_secret })
    let access_token = response.access_token;

    qywxSync.write("================同步企业微信id开始===================")
    qywxSync.write("access_token:" + access_token)

    let url = "https://qyapi.weixin.qq.com/cgi-bin/user/getuserid?access_token=" + access_token;

    for (let ui = 0; ui < spaceUsers.length; ui++) {
        if (!spaceUsers[ui].mobile)
            continue;

        let data = {
            "mobile": spaceUsers[ui].mobile
        }

        let userListRes = await fetch(url, {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json());

        qywxSync.write("用户ID:" + userListRes.userid);
        await broker.call('@steedos/plugin-qywx.useridPush', { accessToken: access_token, userId: userListRes.userid, mobile: spaceUsers[ui].mobile })
    }
    qywxSync.write("================同步数据结束===================")
    qywxSync.write("\n")

    res.status(200).send({ message: "ok" });
});

// 企业微信第三方服务商回调验证
router.post('/api/qiyeweixin/callback', xmlparser({ trim: false, explicitArray: false }), async function (req, res) {
    const broker = objectql.getSteedosSchema().broker
    var query = req.query;
    // 配置企业微信第三方应用验证参数
    var AES_KEY = process.env.STEEDOS_QYWX_SAAS_ENCODINGAESKEY || "";
    var TOKEN = process.env.STEEDOS_QYWX_SAAS_TOKEN || "";
    var suite_id = process.env.STEEDOS_QYWX_SAAS_SUITEID || "";
    var suite_secret = process.env.STEEDOS_QYWX_SAAS_SUITE_SECRET || "";

    var signature = query['msg_signature'];
    var timeStamp = query['timestamp'];
    var nonce = query['nonce'];
    var encrypt = req.body.xml.encrypt;

    var token = TOKEN;
    var aesKey = AES_KEY;
    var suiteKey = suite_id;

    data = await broker.call('@steedos/plugin-qywx.decrypt', {
        signature: signature,
        nonce: nonce,
        timeStamp: timeStamp,
        suiteKey: suiteKey,
        token: token,
        aesKey: aesKey,
        encrypt: encrypt
    });

    // console.log("data: ", data);
    var message = await parseXML(data.data);

    console.log("message: ", message);

    if (!message.InfoType){
        if (message.Event == "enter_agent"){
            res.writeHead(200, {
                "Content-Type": "text/plain"
            });
            res.end("success");
            return res.end("success");
        }
    }else{
        switch (message != null ? message.InfoType : void 0) {
            case 'suite_ticket':
                await broker.call('@steedos/plugin-qywx.storeSuiteTicket', {suite_id, suite_secret, message});
                res.writeHead(200, {
                    "Content-Type": "text/plain"
                });
                return res.end("success");
            case 'create_auth':
                console.log("message create-auth ",message);
                
                res.writeHead(200, {
                    "Content-Type": "text/plain"
                });
                res.end("success");
                return await broker.call('@steedos/plugin-qywx.InitializeSpace', { "auth_code": message.AuthCode});
            case 'batch_job_result':
                let corpid = message.ServiceCorpId;
                let provider_secret = process.env.STEEDOS_QYWX_SAAS_PROVIDER_SECRET;
                let batchJob = message.BatchJob;
                // await broker.call('@steedos/plugin-qywx.contactIdTranslate', { "corpid": message.AuthCode});
                
                let providerTokenInfo = await broker.call('@steedos/plugin-qywx.getProviderToken', {
                    "corpid": corpid,
                    "provider_secret": provider_secret
                }); 
                let getResultInfo = await broker.call('@steedos/plugin-qywx.getResult', {
                    "provider_access_token": providerTokenInfo.provider_access_token,
                    "jobid": batchJob.JobId
                });
                
                console.log("getResultInfo: ",getResultInfo);
                if (getResultInfo.contact_id_translate.url){
                    console.log("update spaces-----")
                    let space = await broker.call('objectql.find',{objectName: 'spaces', query: {filters: [["qywx_corp_id", "=",message.AuthCorpId]]}});
                    console.log("find space: ",space[0]);
                    await broker.call('objectql.directUpdate', {objectName: "spaces", id: space[0]._id, doc: {"qywx_contact_id_translate_url": getResultInfo.contact_id_translate.url}})
                    
                }
                res.end("success");
                return;
            // case 'cancel_auth':
            //     res.writeHead(200, {
            //         "Content-Type": "text/plain"
            //     });
            //     res.end(result != null ? result.message : void 0);
            //     return CancelAuth(message);
            // case 'change_auth':
            //     return ChangeContact(message.AuthCorpId);
            case 'change_contact':
                await broker.call('@steedos/plugin-qywx.changeContact', { "message": message });
                res.end("success");
                return;
        }
    }
});


// 企业微信第三方应用单点登录
router.get('/api/qiyeweixin/feikongwang/auth_login', async function (req, res, next) {
    const broker = objectql.getSteedosSchema().broker;
    var { code,state } = req.query;
    console.log("企业微信第三方应用单点登录",req.query)
    let suite_id = process.env.STEEDOS_QYWX_SAAS_SUITEID;
    let suite_secret = process.env.STEEDOS_QYWX_SAAS_SUITE_SECRET;

    // getconfigurations
    const configurations = await broker.call('@steedos/plugin-qywx.getConfigurations', {
        "_id": suite_id
    });

    console.log("configurations", configurations)
    let suite_ticket = configurations.suite_ticket;
    // const auth_code = configurations.auth_code;
    // 获取第三方应用凭证
    const suiteAccessToken = await broker.call('@steedos/plugin-qywx.getSuiteAccessToken', {
        "suite_id": suite_id,
        "suite_secret": suite_secret,
        "suite_ticket": suite_ticket
    });
    console.log("第三方应用凭证===1", suiteAccessToken)
    // 获取访问用户身份
    const userData = await broker.call('@steedos/plugin-qywx.getUserInfo3rd', {
        "code": code,
        "suite_access_token": suiteAccessToken.suite_access_token
    });
    console.log("===userData", userData);
    // 获取访问用户敏感信息
    const userDetailData = await broker.call('@steedos/plugin-qywx.getUserDetailInfo3rd', {
        "suite_access_token": suiteAccessToken.suite_access_token,
        "user_ticket": userData.user_ticket
    });
    console.log("访问用户敏感信息", userDetailData);


    // 创建人员信息
    const userInfo = await broker.call('@steedos/plugin-qywx.createSpaceUser', {
        "user": userDetailData
    });
    console.log("userInfo======", userInfo);

    //let redirect_url = process.env.ROOT_URL
    // 
    // 设置cookies,重定向
    let stampedAuthToken = auth.generateStampedLoginToken();
    let authtToken = stampedAuthToken.token;
    let hashedToken = auth.hashStampedToken(stampedAuthToken);
    await auth.insertHashedLoginToken(userInfo.userId, hashedToken);
    auth.setAuthCookies(req, res, userInfo.userId, authtToken, userInfo.spaceId);
    res.setHeader('X-Space-Token', userInfo.spaceId + ',' + authtToken);
    res.redirect(302, state || '/');
    return res.end('');
})




module.exports = {
    rest: {
        method: "POST",
        fullPath: "/api/qiyeweixin/tofkw/auth_login",
        authorization: false,
        authentication: false
    },
    async handler(ctx) {
        const { name } = ctx.params;
        console.log("===name", name)

    }
}

let getAbsoluteUrl = function (url) {
    var rootUrl;
    rootUrl = __meteor_runtime_config__ ? __meteor_runtime_config__.ROOT_URL_PATH_PREFIX : "";
    if (rootUrl) {
        url = rootUrl + url;
    }
    return url;
};

let clearAuthCookies = function (req, res) {
    var cookies, uri;
    cookies = new Cookies(req, res);
    cookies.set("X-User-Id");
    cookies.set("X-Auth-Token");
    if (req.headers.origin) {
        uri = new URI(req.headers.origin);
    } else if (req.headers.referer) {
        uri = new URI(req.headers.referer);
    }
    cookies.set("X-User-Id", "", {
        domain: uri != null ? uri.domain() : void 0,
        overwrite: true
    });
    return cookies.set("X-Auth-Token", "", {
        domain: uri != null ? uri.domain() : void 0,
        overwrite: true
    });
};

destroyToken = async function (userId, loginToken) {
    try {
        let user = await steedosSchema.getObject('users').findOne(userId);
        let tokens = user.services.resume.loginTokens;
        tokens.splice(tokens.findIndex(e => e.hashedToken === loginToken), 1)
        await steedosSchema.getObject('users').update(userId, { "services.resume.loginTokens": tokens });
    } catch (error) {
        console.error(error);
        console.log("Failed to destroyToken with error: " + error);
    }
}

const parseXML = (xml) => new Promise((resolve, reject) => {
    const opt = { trim: true, explicitArray: false, explicitRoot: false };
    xml2js.parseString(xml, opt, (err, res) => err ? reject(new Error('XMLDataError')) : resolve(res || {}));
});


exports.default = router;