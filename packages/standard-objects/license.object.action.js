module.exports = {
  apply: function (object_name, record_id, fields) {
    var licenseServer, spaceId, spaceName;
    if (!Creator.isSpaceAdmin()) {
      return toastr.info("请联系管理员");
    }
    spaceId = Session.get("spaceId");
    spaceName = Creator.getCollection("spaces").findOne(spaceId).name;
    licenseServer = 'https://huayan.my.steedos.com:8443';
    toastr.info("升级完成后，请点击同步按钮");
    var uri = new URL(window.location.href);
    window.open(licenseServer + "/accounts/a/#/signup?redirect_uri=" + encodeURIComponent(Meteor.absoluteUrl('/api/v4/license_auth_token/my_token/sync', {rootUrl: Meteor.absoluteUrl(__meteor_runtime_config__.ROOT_URL_PATH_PREFIX, {rootUrl: uri.origin})})));
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
          return toastr.warning('您尚未购买许可证。')
        }
        if (XMLHttpRequest.responseJSON && XMLHttpRequest.responseJSON.error) {
          return toastr.error(t(XMLHttpRequest.responseJSON.error.replace(/:/g, '：')));
        } else {
          return toastr.error(XMLHttpRequest.responseJSON);
        }
      }
    });
  },
  copySpaceId: function(object_name, record_id){
    console.log('copySpaceId');
    var item_element = $('.list-action-custom-copySpaceId')
    item_element.attr('data-clipboard-text', Session.get("spaceId"));
    if (!item_element.attr('data-clipboard-new')) {
      // item_element.attr('data-clipboard-text', Session.get("spaceId"));
      var clipboard = new Clipboard(item_element[0]);
      item_element.attr('data-clipboard-new', true);
      clipboard.on('success', function (e) {
          return toastr.success('复制成功');
      });
      clipboard.on('error', function (e) {
          toastr.error('复制失败');
          return console.error("e");
      });
      if (item_element[0].tagName === 'LI' || item_element.hasClass('view-action')) {
        return item_element.trigger("click");
      }
    }
  }
}