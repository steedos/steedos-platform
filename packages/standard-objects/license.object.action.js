module.exports = {
  apply: function (object_name, record_id, fields) {
    var licenseServer, licenseSpaceId, spaceId, spaceName;
    if (!Creator.isSpaceAdmin()) {
      return toastr.info("请联系管理员");
    }
    spaceId = Session.get("spaceId");
    spaceName = Creator.getCollection("spaces").findOne(spaceId).name;
    licenseServer = 'https://community.trial.steedos.com:8443';
    licenseSpaceId = 'LHXoSJWEtDKuHFyge';
    window.open(licenseServer + "/accounts/a/#/signup?X-Space-Id=" + licenseSpaceId + "&redirect_uri=" + encodeURIComponent(licenseServer + "/api/v4/product_license/apply/new?q=" + spaceId + "&n=" + spaceName));
    swal({
      title: TAPi18n.__('license_trial_header_swal_title'),
      type: "warning",
      showCancelButton: true,
      cancelButtonText: TAPi18n.__('license_trial_header_swal_cancelButtonText'),
      confirmButtonColor: "#DD6B55",
      confirmButtonText: TAPi18n.__('license_trial_header_swal_confirmButtonText'),
      closeOnConfirm: true
    }, function (isConfirm) {
      var authToken, authorization, headers, url, userSession;
      if (isConfirm) {
        $("body").addClass("loading");
        userSession = Creator.USER_CONTEXT;
        spaceId = userSession.spaceId;
        if (userSession.authToken) {
          authToken = userSession.authToken;
        } else {
          authToken = userSession.user.authToken;
        }
        url = "/api/v4/spaces/" + spaceId + "/clean_license";
        url = Steedos.absoluteUrl(url);
        authorization = "Bearer " + spaceId + "," + authToken;
        headers = [
          {
            name: 'Content-Type',
            value: 'application/json'
          },
          {
            name: 'Authorization',
            value: authorization
          }
        ];
        return $.ajax({
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
            if (XMLHttpRequest.responseJSON && XMLHttpRequest.responseJSON.error) {
              return toastr.error(t(XMLHttpRequest.responseJSON.error.replace(/:/g, '：')));
            } else {
              return toastr.error(XMLHttpRequest.responseJSON);
            }
          }
        });
      }
    });
  },
  sync: function (object_name, record_id, fields) {
    console.log('sync....');
  }
}