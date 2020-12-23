module.exports = {
  disable: function (object_name, record_id) {
    $("body").addClass("loading");
    var userSession = Creator.USER_CONTEXT;
    var authorization = "Bearer " + userSession.spaceId + "," + userSession.user.authToken;
    $.ajax({
      type: "POST",
      url: Steedos.absoluteUrl("/api/odata/v4/" + userSession.spaceId + "/" + object_name + "/" + record_id + "/disable"),
      data: JSON.stringify({}),
      dataType: "json",
      contentType: 'application/json',
      beforeSend: function (XHR) {
        XHR.setRequestHeader('Content-Type', 'application/json');
        XHR.setRequestHeader('Authorization', authorization);
      },
      success: function (data) {
        $("body").removeClass("loading");
        if(data){
          if(data.error){
            toastr.error(t("space_users_method_disable_error", t(data.error.reason)));
          }
          else{
            Template.creator_view.currentInstance.onEditSuccess()
            toastr.success(t("space_users_method_disable_success"));
          }
        }
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        $("body").removeClass("loading");
        var errorMsg = errorThrown;
        var error = XMLHttpRequest.responseJSON.error;
        if(error){
          console.error("Disable Space User Faild:", error);
          if(error.reason){
            errorMsg = error.reason;
          }
          else if(error.message){
            errorMsg = error.message;
          }
          else{
            errorMsg = error;
          }
        }
        errorMsg = t(errorMsg);
        if(error.details){
          if(_.isObject(error.details)){
            errorMsg += JSON.stringify(error.details);
          }
          else{
            errorMsg += t(error.details);
          }
        }
        toastr.error(t("space_users_method_disable_error", errorMsg));
      }
    });
  },

  disableVisible: function (object_name, record_id, record_permissions, record) {
    if (!Steedos.isSpaceAdmin()){
      return;
    }
    if (record && record.user_accepted && (record.user && record.user._id) != Steedos.userId()) {
      return true
    }
  },

  enable: function (object_name, record_id) {
    $("body").addClass("loading");
    var userSession = Creator.USER_CONTEXT;
    var authorization = "Bearer " + userSession.spaceId + "," + userSession.user.authToken;
    $.ajax({
      type: "POST",
      url: Steedos.absoluteUrl("/api/odata/v4/" + userSession.spaceId + "/" + object_name + "/" + record_id + "/enable"),
      data: JSON.stringify({}),
      dataType: "json",
      contentType: 'application/json',
      beforeSend: function (XHR) {
        XHR.setRequestHeader('Content-Type', 'application/json');
        XHR.setRequestHeader('Authorization', authorization);
      },
      success: function (data) {
        $("body").removeClass("loading");
        if(data){
          if(data.error){
            toastr.error(t("space_users_method_enable_error", t(data.error.reason)));
          }
          else{
            Template.creator_view.currentInstance.onEditSuccess()
            toastr.success(t("space_users_method_enable_success"));
          }
        }
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        $("body").removeClass("loading");
        var errorMsg = errorThrown;
        var error = XMLHttpRequest.responseJSON.error;
        if(error){
          console.error("Enable Space User Faild:", error);
          if(error.reason){
            errorMsg = error.reason;
          }
          else if(error.message){
            errorMsg = error.message;
          }
          else{
            errorMsg = error;
          }
        }
        errorMsg = t(errorMsg);
        if(error.details){
          if(_.isObject(error.details)){
            errorMsg += JSON.stringify(error.details);
          }
          else{
            errorMsg += t(error.details);
          }
        }
        toastr.error(t("space_users_method_enable_error", errorMsg));
      }
    });
  },

  enableVisible: function (object_name, record_id, record_permissions, record) {
    if (!Steedos.isSpaceAdmin()) {
      return;
    }
    if (record && !record.user_accepted && (record.user && record.user._id) != Steedos.userId()){
      return true
    }
  },
  lockout: function(object_name, record_id){
    var text = "锁定的用户将无法登入系统。 是否确定？";
    swal({
      title: "锁定用户",
      text: "<div>" + text + "</div>",
      html: true,
      showCancelButton: true,
      confirmButtonText: t('YES'),
      cancelButtonText: t('NO')
    }, function (confirm) {
      if (confirm) {
        var userSession = Creator.USER_CONTEXT;
        var result = Steedos.authRequest("/api/odata/v4/" + userSession.spaceId + "/" + object_name + "/" + record_id + "/lockout", {type: 'post', async: false, data: JSON.stringify({})});
        if(result.error){
          toastr.error(t("space_users_method_lockout_error", t(data.error.reason)));
        }else{
          toastr.success(t("space_users_method_lockout_success"));
          FlowRouter.reload()
        }
      }
      sweetAlert.close();
    })
  },
  lockoutVisible: function (object_name, record_id, record_permissions, record) {
    if (!Steedos.isSpaceAdmin()) {
      return;
    }
    if (record){
      var userSession = Creator.USER_CONTEXT;
      var result = Steedos.authRequest("/api/odata/v4/" + userSession.spaceId + "/" + object_name + "/" + record_id + "/is_lockout", {type: 'get', async: false, data: JSON.stringify({})});
      if(result.error){
        toastr.error(data.error.reason);
      }else{
        return !result.lockout
      }
    }
  },
  unlock: function(object_name, record_id){
    var text = "解除锁定以便恢复用户的访问权限。 是否确定？";
    swal({
      title: "解除锁定用户",
      text: "<div>" + text + "</div>",
      html: true,
      showCancelButton: true,
      confirmButtonText: t('YES'),
      cancelButtonText: t('NO')
    }, function (confirm) {
      if (confirm) {
        var userSession = Creator.USER_CONTEXT;
        var result = Steedos.authRequest("/api/odata/v4/" + userSession.spaceId + "/" + object_name + "/" + record_id + "/unlock", {type: 'post', async: false, data: JSON.stringify({})});
        if(result.error){
          toastr.error(t("space_users_method_unlock_error", t(data.error.reason)));
        }else{
          toastr.success(t("space_users_method_unlock_success"));
          FlowRouter.reload()
        }
      }
      sweetAlert.close();
    })
  },
  unlockVisible: function (object_name, record_id, record_permissions, record) {
    if (!Steedos.isSpaceAdmin()) {
      return;
    }
    if (record){
      var userSession = Creator.USER_CONTEXT;
      var result = Steedos.authRequest("/api/odata/v4/" + userSession.spaceId + "/" + object_name + "/" + record_id + "/is_lockout", {type: 'get', async: false, data: JSON.stringify({})});
      if(result.error){
        toastr.error(data.error.reason);
      }else{
        return result.lockout
      }
    }
  }
}