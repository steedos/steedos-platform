let dtApi = require("./dt_api");
// 网页授权url
let oauthUrl = Meteor.absoluteUrl("/sso/dingtalk?corpid=");

Meteor.startup(function () {
    Push.oldSend = Push.send;
    Push.send = function (options) {
        Push.oldSend(options);
        try {
            // console.log("options:---",options);
            if (options.from !== 'workflow')
                return;

            if (!options.payload)
                return;

            let space = Creator.getCollection('spaces').findOne({ _id: options.payload.space });

            if (!space)
                return;

            if (!space.dingtalk_corp_id || !space.dingtalk_agent_id || !space.dingtalk_key || !space.dingtalk_secret)
                return;

            let token = dtApi.accessTokenGet(space.dingtalk_key, space.dingtalk_secret);

            let space_user = Creator.getCollection('space_users').findOne({ space: space._id, user: options.query.userId });
            if (!space_user.dingtalk_id)
                return;

            let dingtalk_userId = space_user.dingtalk_id;
            let agentId = space.dingtalk_agent_id;
            let spaceId = space._id;
            let corpId = space.dingtalk_corp_id;
            let payload = options.payload;
            let url = "";
            let text = "";
            let title = "华炎魔方";

            // 审批流程
            if (payload.instance) {
                title = workflowPush(options, spaceId, corpId).text;
                text = workflowPush(options, spaceId, corpId).title;
                url = workflowPush(options, spaceId, corpId).url;
            } else {
                title = options.title;
                url = oauthUrl + corpId + "&redirect_url=" + payload.url;
            }

            if (payload.related_to) {
                text = options.text;
            }
            // url: dingtalk://dingtalkclient/action/openapp?corpid=免登企业corpId&container_type=work_platform&app_id=0_{应用agentid}&redirect_type=jump&redirect_url=跳转url
            let dintalk_url = "dingtalk://dingtalkclient/action/openapp?corpid=" + corpId + "&container_type=work_platform&app_id=0_" + space.dingtalk_agent_id + "&redirect_type=jump&redirect_url=" + encodeURIComponent(url);
            
            // 通知消息主体
            let msg = {
                "userid_list": dingtalk_userId,
                "agent_id": agentId,
                "to_all_user": "false",
                "msg": {
                    "msgtype": "oa",
                    "oa": {
                        "message_url": dintalk_url,
                        "pc_message_url": dintalk_url,
                        "head": {
                            "bgcolor": "FFBBBBBB",
                            "text": "华炎魔方"
                        },
                        "body": {
                            "title": title,
                            "author": text
                        }
                    }
                }
            }
            // 发送推送消息
            dtApi.sendMessage(msg, token.access_token);
        } catch (error) {
            console.error("Push error reason: ", error);
        }
    }
})

// 待审核推送
let workflowPush = function (options, spaceId, corpId) {
    if (!options || (options == {}))
        return false;

    let info = {};
    info.text = "";
    info.url = "";
    info.title = "审批王";
    // 获取申请单
    let instanceId = options.payload.instance;
    let instance = Creator.getCollection('instances').findOne({ _id: instanceId });

    let inboxUrl = oauthUrl + corpId + '&redirect_url=/workflow/space/' + spaceId + '/inbox/' + options.payload.instance;

    let outboxUrl = oauthUrl + corpId + '&redirect_url=/workflow/space/' + spaceId + '/outbox/' + options.payload.instance;

    info.text = '请审批 ' + options.text;
    info.url = inboxUrl;
    info.title = options.title;

    if (!instance) {
        info.text = options.text;
    } else {
        if (instance.state == "completed") {
            info.text = options.text;
            info.url = outboxUrl;
        }
    }
    return info;
}