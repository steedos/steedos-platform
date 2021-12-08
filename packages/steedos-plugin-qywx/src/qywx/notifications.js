const objectql = require('@steedos/objectql');
const steedosSchema = objectql.getSteedosSchema();
const Qiyeweixin = require("./qywx");

module.exports = {
    notify: async function () {
        // 网页授权url
        let oauthUrl = Meteor.absoluteUrl('/api/qiyeweixin/mainpage?target=');
        
        Push.oldQywxSend = Push.send;
        Push.send = async function (options) {
            Push.oldQywxSend(options);
            try {
                // console.log("options:---",options);
                if (options.from !== 'workflow')
                    return;

                if (!options.payload)
                    return;

                let spaceObj = steedosSchema.getObject('spaces');
                let space = await spaceObj.find({ filters: [["_id", "=",options.payload.space]] });

                if (!space[0])
                    return;

                if (!space[0].qywx_corp_id || !space[0].qywx_agent_id || !space[0].qywx_secret)
                    return;

                let response = await Qiyeweixin.getToken(space[0].qywx_corp_id, space[0].qywx_secret);
                let access_token = response.access_token;

                let spaceUserObj = steedosSchema.getObject('space_users');
                let userId = options.query.userId;
                let space_user = await spaceUserObj.find({ filters: [["space", "=", space[0]._id], ["user", "=", userId]]});
                
                if (!space_user[0].qywx_id)
                    return;

                // console.log("Push.send: ",space_user[0]);
                let qywx_userId = space_user[0].qywx_id;
                let agentId = space[0].qywx_agent_id;
                let spaceId = space[0]._id;
                let payload = options.payload;
                let url = "";
                let text = "";
                let title = "华炎魔方";

                // 审批流程
                if (payload.instance) {
                    let pushInfo = await Qiyeweixin.workflowPush(options, spaceId, oauthUrl);
                    title = pushInfo.text;
                    text = pushInfo.title;
                    url = pushInfo.url;
                } else {
                    title = options.title;
                    url = oauthUrl + payload.url;
                }

                if (payload.related_to) {
                    text = options.text;
                }
                // 替换&#x2F为'/'
                let rg = new RegExp("&#x2F;","g")
                
                let msg = {
                    "touser": qywx_userId,
                    "msgtype": "textcard",
                    "agentid": agentId,
                    "textcard": {
                        "title": title.replace(rg,'/'),
                        "description": text.replace(rg,'/'),
                        "url": url,
                        "btntxt": "详情"
                    },
                    "safe": 0,
                    "enable_id_trans": 0,
                    "enable_duplicate_check": 0,
                    "duplicate_check_interval": 1
                }
                // 发送推送消息
                // console.log("msg: ",msg);
                await Qiyeweixin.sendMessage(msg, access_token);
            } catch (error) {
                console.error("Push error reason: ", error);
            }
        }
    }
}