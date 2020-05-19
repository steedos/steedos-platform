module.exports = {
    testConnection: function(object_name, record_id, fields){
        $("body").addClass("loading");
        var userSession = Creator.USER_CONTEXT;
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
            $.ajax({
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
                    $("body").removeClass("loading");
                    toastr.success(t('_datasources_testConnection_ok'));
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.error(XMLHttpRequest.responseJSON);
                    $("body").removeClass("loading");
                    if (XMLHttpRequest.responseJSON && XMLHttpRequest.responseJSON.error) {
                        toastr.error(XMLHttpRequest.responseJSON.error)
                    }
                    else {
                        toastr.error(XMLHttpRequest.responseJSON)
                    }
                }
            });
        } catch (err) {
            console.error(err);
            toastr.error(err);
            $("body").removeClass("loading");
        }
    }
  }