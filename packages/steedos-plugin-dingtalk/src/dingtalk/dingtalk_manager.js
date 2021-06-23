exports.dd_init_mobile = function(_config) {
    console.log("dd.env.platform：", dd.env.platform);
    dd.config({
        agentId: _config.agentId,
        corpId: _config.corpId,
        timeStamp: _config.timeStamp,
        nonceStr: _config.nonceStr,
        signature: _config.signature,
        jsApiList: [
            'runtime.info',
            'biz.contact.choose',
            'device.notification.confirm',
            'device.notification.alert',
            'device.notification.prompt',
            'biz.ding.post',
            'biz.util.openLink',
            'runtime.permission.requestAuthCode'
        ]
    });

    dd.ready(function() {

        dd.runtime.info({
            onSuccess: function(info) {
                console.log('runtime info: ' + JSON.stringify(info));
            },
            onFail: function(err) {
                console.log('fail: ' + JSON.stringify(err));
            }
        });

        dd.runtime.permission.requestAuthCode({
            corpId: _config.corpId, //企业id
            onSuccess: function(info) {
                var data = {
                    'access_token': _config.access_token,
                    'code': info.code
                }
                var data = JSON.stringify(data);
                $.ajax({
                    url: Meteor.absoluteUrl('api/dingtalk/sso_steedos'),
                    type: 'POST',
                    async: false,
                    data: data,
                    dataType: 'json',
                    processData: false,
                    contentType: "application/json",
                    success: function(responseText, status) {
                        if (responseText == 'success') {
                            Steedos.loginWithCookie(function() {
                                FlowRouter.go('/');
                            })

                        } else {
                            toastr.error(responseText);
                            return;
                        }
                    },
                    error: function(xhr, msg, ex) {
                        toastr.error(msg);
                    }
                });

            },
            onFail: function(err) {
                console.log('requestAuthCode fail: ' + JSON.stringify(err));
            }
        });
    });

    dd.error(function(err) {
        alert('dd error: ' + JSON.stringify(err));
    });
}



exports.dd_init_pc = function(_config) {

    console.log(_config);
    
    dd.config({
        agentId: _config.agentId,
        corpId: _config.corpId,
        timeStamp: _config.timeStamp,
        nonceStr: _config.nonceStr,
        signature: _config.signature,
        jsApiList: [
            'device.notification.confirm',
            'device.notification.alert',
            'runtime.permission.requestAuthCode'
        ]
    });

    console.log("dd.env.platform：", dd.env.platform);
    dd.ready(function() {

        dd.runtime.permission.requestAuthCode({
            corpId: _config.corpId, //企业id
            onSuccess: function(info) {
                let data = {
                    'access_token': _config.access_token,
                    'code': info.code
                }
                data = JSON.stringify(data);
                console.log("data----: ",data);
                
            },
            onFail: function(err) {
                console.log('requestAuthCode fail: ' + JSON.stringify(err));
            }
        });
    });

    dd.error(function(err) {
        console.error('dd error: ' + JSON.stringify(err));
    });
}