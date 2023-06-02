// let WXBizMsgCrypt = require('wechat-crypto');
const router =require('@steedos/router').staticRouter()
const Cookies = require("cookies");
const objectql = require('@steedos/objectql');
const fs = require('fs');
const steedosConfig = objectql.getSteedosConfig();
const steedosSchema = objectql.getSteedosSchema();
const auth = require("@steedos/auth");

//钉钉文档：http://ddtalk.github.io/dingTalkDoc/?spm=a3140.7785475.0.0.p5bAUd#2-回调接口（分为五个回调类型）

//suite4xxxxxxxxxxxxxxx 是钉钉默认测试suiteid 
// let newCrypt = new WXBizMsgCrypt(config.token, config.encodingAESKey, config.suiteKey || 'suite4xxxxxxxxxxxxxxx');
// let TICKET_EXPIRES_IN = config.ticket_expires_in || 1000 * 60 * 20 //20分钟


clearAuthCookies = function(req, res) {
    let cookies, uri;
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

// Accounts.destroyToken
destroyToken = async function (userId, loginToken) {
    try {
        let user = await steedosSchema.getObject('users').findOne(userId);
        let tokens = user.services.resume.loginTokens;
        tokens.splice(tokens.findIndex(e => e.hashedToken === loginToken), 1)
        await steedosSchema.getObject('users').update(userId,{"services.resume.loginTokens": tokens});
    } catch (error) {
        console.error(error);
        console.log("Failed to destroyToken with error: " + error);
    }
}

const Dingtalk = {};

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

// dingtalk免登给用户设置cookies
router.post("/api/dingtalk/sso_steedos", async function (req, res, next) {
    const broker = steedosSchema.broker;
    let authtToken, hashedToken, userId, authToken, cookies, corpId, code, user_info, space_user;
    cookies = new Cookies(req, res);
    userId = cookies.get("X-User-Id");
    authToken = cookies.get("X-Auth-Token");
    corpId = req.body.corpId;
    code = req.body.code;

    let space = await broker.call('dingtalk.spaceGet', { corpId: corpId })
    if (!space)
        return res.end("缺少参数 corpId!");

    let response = await broker.call('dingtalk.accessTokenGet', { key: space.dingtalk_key, secret: space.dingtalk_secret });

    let access_token = response.access_token;

    if (!code || !access_token)
        return res.end("缺少参数!");

    user_info = await broker.call('dingtalk.userInfoGet', { accessToken: access_token, code: code });

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
                clearAuthCookies(req, res);
                hashedToken = Accounts._hashLoginToken(authToken);
                await destroyToken(userId, hashedToken);
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

// 同步数据
router.get('/api/dingtalk/stockData', async function (req, res) {
    const broker = steedosSchema.broker;
    let space = await broker.call('dingtalk.spaceGet', {})
    if (!space)
        return;

    let response = await broker.call('dingtalk.accessTokenGet', { key: space.dingtalk_key, secret: space.dingtalk_secret });
    access_token = response.access_token;

    Dingtalk.write("================存量数据开始===================")
    Dingtalk.write("access_token:" + access_token)
    deptListRes = await broker.call('dingtalk.departmentListGet', { accessToken: access_token })

    for (let i = 0; i < deptListRes.length; i++) {
        Dingtalk.write("部门ID:" + deptListRes[i]['id'])
        await broker.call('dingtalk.deptinfoPush', { deptId: deptListRes[i]['id'] })
        userListRes = await broker.call('dingtalk.userListGet', { accessToken: access_token, departmentId: deptListRes[i]['id'] })
        for (let ui = 0; ui < userListRes.length; ui++) {
            Dingtalk.write("用户ID:" + userListRes[ui]['userid'])
            await broker.call('dingtalk.userinfoPush', { userId: userListRes[ui]['userid'] })
        }

    }


    for (let i = 0; i < deptListRes.length; i++) {
        userListRes = await broker.call('dingtalk.userListGet', { accessToken: access_token, departmentId: deptListRes[i].id })
        for (let ui = 0; ui < userListRes.length; ui++) {
            await broker.call('dingtalk.userinfoPush', { userId: userListRes[ui]['userid'] })
        }

    }
    Dingtalk.write("================存量数据结束===================")
    Dingtalk.write("\n")

    res.status(200).send({ message: "dsa" });
});

// 订阅事件
router.post('/api/dingtalk/listen', async function (req, res) {
    const broker = steedosSchema.broker;
    var params = req.body
    var query = req.query
    // 获取工作区相关信息
    let dtSpace = await broker.call('dingtalk.spaceGet', {})
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



    data = await broker.call('dingtalk.decrypt', {data: {
        signature: signature,
        nonce: nonce,
        timeStamp: timeStamp,
        suiteKey: suiteKey,
        token: token,
        aesKey: aesKey,
        encrypt: encrypt
    }})
    
    try {
        // console.log(data.data.EventType)
        switch (data.data.EventType) {
            //通讯录用户增加。
            case 'user_add_org':
                break;
            case 'user_leave_org':
                data.data.UserId.forEach(async element => {
                    await broker.call('dingtalk.userinfoPush', { userId: element, status: 2 })
                });
                break;
            //通讯录用户更改
            case 'user_modify_org':
                data.data.UserId.forEach(async element => {
                    await broker.call('dingtalk.userinfoPush', { userId: element })
                });
                // for(let i=0;i<data.data.UserId.length;i++){
                //     
                // }
                break;
            case 'org_dept_modify':
                data.data.DeptId.forEach(async element => {
                    await broker.call('dingtalk.deptinfoPush', { deptId: element })
                });
                break;
            case 'org_dept_create':
                data.data.DeptId.forEach(async element => {
                    await broker.call('dingtalk.deptinfoPush', { deptId: element, status: 1 })
                });
                break;
            case 'org_dept_remove':
                data.data.DeptId.forEach(async element => {
                    await broker.call('dingtalk.deptinfoPush', { deptId: element, status: 2 })
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
        const broker = steedosSchema.broker;
        let space = await broker.call('dingtalk.spaceGet', {})
        let spaceUsers = await broker.call('dingtalk.spaceUsersGet', {})
        if ((spaceUsers.length == 0) || !space)
            return;

        let response = await broker.call('dingtalk.accessTokenGet', { key: space.dingtalk_key, secret: space.dingtalk_secret });
        access_token = response.access_token;

        Dingtalk.write("================同步钉钉id开始===================")

        for (let ui = 0; ui < spaceUsers.length; ui++) {
            // console.log("spaceUsers[ui]: ", spaceUsers[ui]);
            Dingtalk.write("姓名:" + spaceUsers[ui]['name'])
            Dingtalk.write("手机:" + spaceUsers[ui]['mobile'])
            if (!spaceUsers[ui]['mobile'] || (spaceUsers[ui]['mobile'] == ""))
                return;
            await broker.call('dingtalk.useridPush', { accessToken: access_token, mobile: spaceUsers[ui]['mobile'] })
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