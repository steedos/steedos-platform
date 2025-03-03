Steedos.getInviteToken = function(){
    var userSession = Steedos.User.get();
    var spaceId = userSession.spaceId;
    var authToken = userSession.authToken ? userSession.authToken : userSession.user.authToken;
    var authorization = "Bearer " + spaceId + "," + authToken;
    var headers = [{
        name: 'Content-Type',
        value: 'application/json'
    }, {
        name: 'Authorization',
        value: authorization
    }];
    let url = Steedos.absoluteUrl("api/v4/space_users_invite/get/invite_token")
    let result = $.ajax({
        type: "get",
        url: url,
        dataType: "json",
        async: false,
        contentType: 'application/json',
        beforeSend: function (XHR) {
          if (headers && headers.length) {
            return headers.forEach(function (header) {
              return XHR.setRequestHeader(header.name, header.value);
            });
          }
        }
      }).responseJSON;
    console.log('result', result);
    if(result.error){
        throw new Error(result.error);
    }
    return result.token
}