let crypto = require('crypto');
let dtApi = require('../dingtalk/dt_api');

let sign = function(ticket, nonceStr, timeStamp, url) {
    let plain = 'jsapi_ticket=' + ticket +
        '&noncestr=' + nonceStr +
        '&timestamp=' + timeStamp +
        '&url=' + url;

    let sha1 = crypto.createHash('sha1');
    sha1.update(plain, 'utf8');
    let signature = sha1.digest('hex');
    return signature;
}

Meteor.methods({
    dingtalk_sso: function(corpid, url, code) {
        check(corpid, String);
        
        console.log("dingtalk_sso----");
        console.log("code: ",code);
        let _config;

        let s = db.spaces.findOne({
            'dingtalk_corp_id': corpid
        });

        if (!s)
            throw new Meteor.Error('params error!', 'record not exists!');

        let access_token = dtApi.accessTokenGet(s.dingtalk_key, s.dingtalk_secret).access_token;
        
        let user_info = dtApi.userInfoGet(access_token, code);

        if (user_info){
            console.log("user:",user_info.userid);
            let user = db.space_users.findOne({
                'dingtalk_id': user_info.userid
            })
            if (user){
                
            }
        }

        if (access_token && s.dingtalk_agent_id){
            // Dingtalk.debug && console.log(s.name);
            console.log("access_token: ",access_token);
            let jsapi_ticket = dtApi.jsapiTicketGet(access_token);
            let ticket = jsapi_ticket.ticket;
            let nonceStr = 'steedos';
            let timeStamp = new Date().getTime();

            let signature = sign(ticket, nonceStr, timeStamp, url);

            console.log("signature: ",signature);

            _config = {
                signature: signature,
                nonceStr: nonceStr,
                timeStamp: timeStamp,
                url: url,
                corpId: corpid,
                agentId: s.dingtalk_agent_id,
                access_token: access_token
            };

            return _config;
        }
        
    },
    dingtalk_space: function(){
        let space = dtApi.spaceGet();
        if (space){
            return space.dingtalk_corp_id;
        }
    }

})