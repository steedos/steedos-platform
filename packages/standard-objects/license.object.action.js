module.exports = {
  apply: function (object_name, record_id, fields) {
    var licenseServer, spaceId, spaceName;
    if (!Creator.isSpaceAdmin()) {
      return toastr.info("请联系管理员");
    }
    spaceId = Session.get("spaceId");
    spaceName = Creator.getCollection("spaces").findOne(spaceId).name;
    licenseServer = 'https://community.trial.steedos.com:8443';
    toastr.info("升级完成后，请点击同步按钮");
    window.open(licenseServer + "/accounts/a/#/signup?redirect_uri=" + encodeURIComponent(Meteor.absoluteUrl('/api/v4/license_auth_token/my_token/sync')));
  },
  sync: function (object_name, record_id, fields) {
    let userSession = Creator.USER_CONTEXT;
    let spaceId = userSession.spaceId;
    if (userSession.authToken) {
      authToken = userSession.authToken;
    } else {
      authToken = userSession.user.authToken;
    }
    let authorization = "Bearer " + spaceId + "," + authToken;
    let headers = [
      {
        name: 'Content-Type',
        value: 'application/json'
      },
      {
        name: 'Authorization',
        value: authorization
      }
    ];
    let url = "/api/v4/license/" + spaceId + "/sync";
    url = Steedos.absoluteUrl(url);
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
        return window.location.reload();
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        $("body").removeClass("loading");
        if(XMLHttpRequest.status === 403){
          return toastr.warning('请先点击升级企业版')
        }
        if (XMLHttpRequest.responseJSON && XMLHttpRequest.responseJSON.error) {
          return toastr.error(t(XMLHttpRequest.responseJSON.error.replace(/:/g, '：')));
        } else {
          return toastr.error(XMLHttpRequest.responseJSON);
        }
      }
    });
  }
}