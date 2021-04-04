let Qiyeweixin = require("./qywx")
// 网页授权url
let oauthUrl = Meteor.absoluteUrl('/api/qiyeweixin/mainpage?target=');

Meteor.startup(function(){
    Push.oldSend = Push.send;
    Push.send = function(options){
        Push.oldSend(options);
        try {
            // console.log("options:---",options);
            if (options.from !== 'workflow')
                return;
            
            if (!options.payload)
                return;
            
            let space = Creator.getCollection('spaces').findOne({_id: options.payload.space});
            
            if (!space)
                return;
            
            if (!space.qywx_corp_id || !space.qywx_agent_id || !space.qywx_secret)
                return;

            let access_token = Qiyeweixin.getToken(space.qywx_corp_id, space.qywx_secret);

            let space_user = Creator.getCollection('space_users').findOne({space:space._id, user:options.query.userId});
            if (!space_user.qywx_id)
                return;
            
            console.log("Push.send");
            let qywx_userId = space_user.qywx_id;
            let agentId = space.qywx_agent_id;
            let spaceId = space._id;
            let payload = options.payload;
            let url = "";
            let text = "";
            let title = "华炎魔方";
            
            // 审批流程
            if (payload.instance){
                title = workflowPush(options,spaceId).text;
                text = workflowPush(options,spaceId).title;
                url = workflowPush(options,spaceId).url;
            }else{
                title = options.title;
                url = oauthUrl + payload.url;
            }
            
            if (payload.related_to){
                text = options.text;
            }

            let msg = {
                "touser" : qywx_userId,
                "msgtype" : "textcard",
                "agentid" : agentId,
                "textcard" : {
                    "title" : title,
                    "description" : text,
                    "url" : url,
                    "btntxt": "详情"
                },
                "safe":0,
                "enable_id_trans": 0,
                "enable_duplicate_check": 0,
                "duplicate_check_interval": 1
            }
            // 发送推送消息
            Qiyeweixin.sendMessage(msg, access_token);
        } catch (error) {
            console.error("Push error reason: ",error);
        }
    }
})

// 待审核推送
let workflowPush = function(options,spaceId){
    if (!options || (options == {}))
        return false;
    
    let info = {};
    info.text = "";
    info.url = "";
    info.title = "审批王";
    // 获取申请单
    let instanceId = options.payload.instance;
    let instance = Creator.getCollection('instances').findOne({_id:instanceId});
    
    let inboxUrl =  oauthUrl + '/workflow/space/' + spaceId + '/inbox/' + options.payload.instance;

    let outboxUrl = oauthUrl + '/workflow/space/' + spaceId + '/outbox/' + options.payload.instance;
    
    info.text = '请审批 ' + options.text;
    info.url = inboxUrl;
    info.title = options.title;
    
    if (!instance){
        info.text = options.text;
    }else{
        if (instance.state == "completed"){
            info.text = options.text;
            info.url = outboxUrl;
        }
    }
    return info;
}