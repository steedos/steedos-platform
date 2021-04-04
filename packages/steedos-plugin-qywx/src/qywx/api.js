let newCrypt, _ref, _ref2, _ref3, _ref4;
const Cookies = require("cookies");
let express = require('express');
const jsdom = require("jsdom");
const JSDOM = jsdom.JSDOM;
let router = express.Router();
// let parser = require('xml2json');
let Qiyeweixin = require('./qywx');
let WXBizMsgCrypt = require('wechat-crypto');
let objectql = require('@steedos/objectql');
const auth = require("@steedos/auth");
const steedosConfig = objectql.getSteedosConfig();
let qywx_api = require('./router.js');
let push = require('./notifications');

// let config = ServiceConfiguration.configurations.findOne({
//     service: "qiyeweixin"
// });

// if (config) {
//     newCrypt = new WXBizMsgCrypt(config != null ? (_ref = config.secret) != null ? _ref.token : void 0 : void 0, config != null ? (_ref2 = config.secret) != null ? _ref2.encodingAESKey : void 0 : void 0, config != null ? (_ref3 = config.secret) != null ? _ref3.corpid : void 0 : void 0);
// }
// let TICKET_EXPIRES_IN = (config != null ? (_ref4 = config.secret) != null ? _ref4.ticket_expires_in : void 0 : void 0) || 1000 * 60 * 20;


router.use("/qywx", async function (req, res, next) {
    await next();
});

// 工作台首页
router.get("/api/qiyeweixin/mainpage", async function (req, res, next) {
    let authorize_uri, o, redirect_uri, url, _ref5, _ref6, _ref7;
    let target = "";
    let appid = "";
    o = Qiyeweixin.getSpace();
    
    let signature = Qiyeweixin.getSignature();

    // 推送消息重定向url
    if (req.query.target)
        target = req.query.target;
    
    if (o) {
        redirect_uri = encodeURIComponent(Meteor.absoluteUrl('api/qiyeweixin/auth_login'));
        // console.log("redirect_uri----: ",redirect_uri);
        authorize_uri = qywx_api.authorize_uri;
        
        if (!authorize_uri)
            return;
        if (o.qywx_corp_id)
            appid = o.qywx_corp_id;
        
        url = authorize_uri + '?appid=' + appid + '&redirect_uri=' + redirect_uri + `&response_type=code&scope=snsapi_base&state=${target}#wechat_redirect`;
        res.writeHead(302, {
            'Location': url
        });
        return res.end('');
    }
});

// 网页授权登录
router.get("/api/qiyeweixin/auth_login", async function (req, res, next) {
    let authToken, cookies, hashedToken, user, userId, userInfo, state, redirect_url, _ref5, space, spaceId, token;
    cookies = new Cookies(req, res);
    
    userId = cookies.get("X-User-Id");
    authToken = cookies.get("X-Auth-Token");
    state = req.query.state;
    space = Qiyeweixin.getSpace();
    // 获取access_token
    if(space.qywx_corp_id && space.qywx_secret)
        token = Qiyeweixin.getToken(space.qywx_corp_id,space.qywx_secret)
    
    // 推送消息重定向url
    if (state != "")
        redirect_url = Meteor.absoluteUrl(state);

    // console.log("redirect_url: ",redirect_url);
    if ((req != null ? (_ref5 = req.query) != null ? _ref5.code : void 0 : void 0) && token) {
        userInfo = Qiyeweixin.getUserInfo(token, req.query.code);
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

    // console.log("userInfo: ",userInfo);
    user = Creator.getCollection("space_users").findOne({
        'qywx_id': userInfo != null ? userInfo.UserId : void 0
    });
    
    
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
    }
    if (userId && authToken) {
        if (user.user != userId) {
            Qiyeweixin.clearAuthCookies(req, res);
            hashedToken = Accounts._hashLoginToken(authToken);
            Accounts.destroyToken(userId, hashedToken);
        } else {
            res.redirect(302, redirect_url || '/');
            return res.end('');
        }
    }
    let stampedAuthToken = auth.generateStampedLoginToken();
    authtToken = stampedAuthToken.token;
    hashedToken = auth.hashStampedToken(stampedAuthToken);
    await auth.insertHashedLoginToken(user.user, hashedToken);
    auth.setAuthCookies(req, res, user.user, authtToken, spaceId);
    res.setHeader('X-Space-Token', spaceId + ',' + authtToken);
    res.redirect(302, redirect_url || '/');
    return res.end('');
});

// 从企业微信端单点登录:从浏览器后台管理页面"前往服务商后台"进入的网址
router.get("/api/qiyeweixin/sso_steedos", async function (req, res, next) {
    let at, authToken, hashedToken, loginInfo, o, user, _ref5, _ref6, _ref7;
    o = ServiceConfiguration.configurations.findOne({
        service: "qiyeweixin"
    });
    at = Qiyeweixin.getProviderToken(o != null ? (_ref5 = o.secret) != null ? _ref5.corpid : void 0 : void 0, o != null ? (_ref6 = o.secret) != null ? _ref6.provider_secret : void 0 : void 0);
    if (at && at.provider_access_token) {
        console.log("at.provider_access_token: ",at.provider_access_token);
        loginInfo = Qiyeweixin.getLoginInfo(at.provider_access_token, req.query.auth_code);
        if (loginInfo != null ? (_ref7 = loginInfo.user_info) != null ? _ref7.userid : void 0 : void 0) {
            console.log("loginInfo.user_info.userid: ",loginInfo.user_info.userid);
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

// 推送消息
router.post("/api/qiyeweixin/push", async function (req, res, next) {
    let qywx_userId = req.body.qywx_userId;
    let agentId = req.body.agentid;
    let spaceId = req.body.spaceId;
    let text = req.body.text;
    let url = req.body.url;
    let title = req.body.title;
    let space = Creator.getCollection('spaces').findOne({_id: spaceId});
    let service = space.services.qiyeweixin;
    let o = ServiceConfiguration.configurations.findOne({
        service: "qiyeweixin"
    });
    at = Qiyeweixin.getCorpToken(service.corp_id, service.permanent_code, o.suite_access_token);
    if (at && at.access_token) {
        service.access_token = at.access_token;
    }
    let msg = {
        "touser" : qywx_userId,
        "msgtype" : "textcard",
        "agentid" : agentId,
        "textcard" : {
            "title" : title,
            "description" : text,
            "url" : url,
            "btntxt":"详情"
        },
        "safe":0,
        "enable_id_trans": 0,
        "enable_duplicate_check": 0,
        "duplicate_check_interval": 1
    }

    Qiyeweixin.sendMessage(msg,service.access_token);
    return res.end("success");
});

// 通讯录变更，更新space表=============
let ChangeContact = function (corp_id) {
    let s_qywx, space;
    space = Creator.getCollection("spaces").findOne({
        'qywx_corp_id': corp_id
    });
    if (space) {
        s_qywx = space.services.qiyeweixin;
        s_qywx.remote_modified = new Date;
        // s_qywx.need_sync = true;
        return Creator.getCollection("spaces").direct.update({
            _id: space._id
        }, {
            $set: {
                qywx_need_sync: true,
                'services.qiyeweixin': s_qywx
            }
        });
    }
    return;
};

// 取消授权，更新space表=============OK
let CancelAuth = function (message) {
    let corp_id, s_qywx, space;
    corp_id = message.AuthCorpId;
    space = Creator.getCollection("spaces").findOne({
        'qywx_corp_id': corp_id
    });
    if (space) {
        try {
            if (!space.services)
                return;
        
            if (!space.services.qiyeweixin)
                return;
            
            s_qywx = space.services.qiyeweixin;
            s_qywx.permanent_code = void 0;
            // s_qywx.need_sync = false;
            return Creator.getCollection("spaces").direct.update({
                _id: space._id
            }, {
                $set: {
                    qywx_need_sync: false,
                    is_deleted: true,
                    'services.qiyeweixin': s_qywx
                }
            });
        } catch (error) {
            console.error("CancelAuth Error: ",error);
            return;
        }
    }
    return;
};

// 根据推送过来的临时授权码，获取永久授权码
let CreateAuth = function (message) {
    let auth_corp_info, auth_info, auth_user_info, o, permanent_code, r, service, _ref5;
    o = ServiceConfiguration.configurations.findOne({
        service: "qiyeweixin"
    });
    if (o) {
        r = Qiyeweixin.getPermanentCode(message != null ? message.SuiteId : void 0, message != null ? message.AuthCode : void 0, o != null ? (_ref5 = o) != null ? _ref5.suite_access_token : void 0 : void 0);
        if (r && (r != null ? r.permanent_code : void 0)) {
            permanent_code = r.permanent_code;
            auth_corp_info = r.auth_corp_info;
            auth_info = r.auth_info;
            auth_user_info = r.auth_user_info;
            service = {};
            service.corp_id = auth_corp_info.corpid;
            service.permanent_code = permanent_code;
            service.auth_user_id = auth_user_info.userid;
            service.agentid = auth_info.agent[0].agentid;
            return initSpace(service, auth_corp_info.corp_name);
        }
    }
};

let initSpace = function (service, name) {
    let doc, modified, newSpace, space;
    space = Creator.getCollection("spaces").findOne({
        "qywx_corp_id": service.corp_id
    });
    if (space) {
        service.remote_modified = new Date;
        // service.need_sync = true;
        modified = new Date;
        newSpace = Creator.getCollection("spaces").direct.update({
            _id: space._id
        }, {
            $set: {
                modified: modified,
                name: name,
                is_deleted: false,
                'services.qiyeweixin': service
            }
        });
    }
    return;
    // else {
    //     doc = {};
    //     doc.qywx_corp_id = service.corp_id;
    //     doc.name = name;
    //     doc.is_deleted = false;
    //     doc.created = new Date;
    //     doc.qywx_need_sync = true;
    //     service.remote_modified = new Date;
    //     doc.services = {
    //         qiyeweixin: service
    //     };
    //     newSpace = Creator.getCollection("spaces").direct.insert(doc);
    // }
    // newSpace = Creator.getCollection("spaces").findOne({
    //     "qywx_corp_id": service.corp_id
    // });
    // if (newSpace) {
    //     return _sync.syncCompany(newSpace);
    // }
};

// 根据suite_ticket，获取suite_access_token
let SuiteTicket = function (message) {
    let o, r, _ref5, _ref6;
    o = ServiceConfiguration.configurations.findOne({
        service: "qiyeweixin"
    });
    if (o) {
        r = Qiyeweixin.getSuiteAccessToken(o.suite_id, o.suite_secret, message.SuiteTicket);
        if (r && (r != null ? r.suite_access_token : void 0)) {
            return ServiceConfiguration.configurations.update(o._id, {
                $set: {
                    "suite_ticket": message.SuiteTicket,
                    "suite_access_token": r.suite_access_token
                },
                $currentDate: {
                    "modified": true
                }
            });
        }
    }
};

let getAbsoluteUrl = function (url) {
    var rootUrl;
    rootUrl = __meteor_runtime_config__ ? __meteor_runtime_config__.ROOT_URL_PATH_PREFIX : "";
    if (rootUrl) {
      url = rootUrl + url;
    }
    return url;
};


exports.router = router;