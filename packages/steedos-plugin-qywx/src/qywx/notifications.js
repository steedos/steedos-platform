let Qiyeweixin = require("./qywx")
// 网页授权url
let oauthUrl = Meteor.absoluteUrl('/api/qiyeweixin/mainpage?target=');

module.exports = {
    notify: function () {
        Push.oldSend = Push.send;
        Push.send = function (options) {
            Push.oldSend(options);
            try {
                // console.log("options:---");
                if (options.from !== 'workflow')
                    return;

                if (!options.payload)
                    return;

                let space = Creator.getCollection('spaces').findOne({ _id: options.payload.space });

                if (!space)
                    return;

                if (!space.qywx_corp_id || !space.qywx_agent_id || !space.qywx_secret)
                    return;

                let access_token = Qiyeweixin.getToken(space.qywx_corp_id, space.qywx_secret);

                let space_user = Creator.getCollection('space_users').findOne({ space: space._id, user: options.query.userId });
                if (!space_user.qywx_id)
                    return;

                // console.log("Push.send");
                let qywx_userId = space_user.qywx_id;
                let agentId = space.qywx_agent_id;
                let spaceId = space._id;
                let payload = options.payload;
                let url = "";
                let text = "";
                let title = "华炎魔方";

                // 审批流程
                if (payload.instance) {
                    title = Qiyeweixin.workflowPush(options, spaceId, oauthUrl).text;
                    text = Qiyeweixin.workflowPush(options, spaceId, oauthUrl).title;
                    url = Qiyeweixin.workflowPush(options, spaceId, oauthUrl).url;
                } else {
                    title = options.title;
                    url = oauthUrl + payload.url;
                }

                if (payload.related_to) {
                    text = options.text;
                }

                let msg = {
                    "touser": qywx_userId,
                    "msgtype": "textcard",
                    "agentid": agentId,
                    "textcard": {
                        "title": title,
                        "description": text,
                        "url": url,
                        "btntxt": "详情"
                    },
                    "safe": 0,
                    "enable_id_trans": 0,
                    "enable_duplicate_check": 0,
                    "duplicate_check_interval": 1
                }
                // 发送推送消息
                Qiyeweixin.sendMessage(msg, access_token);
            } catch (error) {
                console.error("Push error reason: ", error);
            }
        }
    }
}