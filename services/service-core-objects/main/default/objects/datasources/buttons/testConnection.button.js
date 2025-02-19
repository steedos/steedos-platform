/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2025-02-18 09:32:23
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2025-02-19 15:35:19
 * @FilePath: /steedos-platform-3.0/services/service-core-objects/main/default/objects/datasources/buttons/testConnection.button.js
 * @Description: 
 */
module.exports = { 
testConnection:function(object_name, record_id, fields){
        window.$("body").addClass("loading");
        var userSession = Steedos.User.get();
        var spaceId = userSession.spaceId;
        var authToken = userSession.authToken ? userSession.authToken : userSession.user.authToken;
        var url = "/api/v4/datasources/" + record_id + "/testConnection";
        url = Steedos.absoluteUrl(url);
        try {
            var authorization = "Bearer " + spaceId + "," + authToken;
            var headers = [{
                name: 'Content-Type',
                value: 'application/json'
            }, {
                name: 'Authorization',
                value: authorization
            }];
            window.$.ajax({
                type: "get",
                url: url,
                dataType: "json",
                contentType: 'application/json',
                beforeSend: function (XHR) {
                    if (headers && headers.length) {
                        return headers.forEach(function (header) {
                            return XHR.setRequestHeader(header.name, header.value);
                        });
                    }
                },
                success: function (data) {
                    window.$("body").removeClass("loading");
                    toastr.success(t('_datasources_testConnection_ok'));
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.error(XMLHttpRequest.responseJSON);
                    window.$("body").removeClass("loading");
                    if (XMLHttpRequest.responseJSON && XMLHttpRequest.responseJSON.error) {
                        toastr.error(t(XMLHttpRequest.responseJSON.error.replace(/:/g, '：')))
                    }
                    else {
                        toastr.error(XMLHttpRequest.responseJSON)
                    }
                }
            });
        } catch (err) {
            console.error(err);
            toastr.error(err);
            window.$("body").removeClass("loading");
        }
    },

 }