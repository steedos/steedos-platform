module.exports = {
  disable: function (object_name, record_id) {
    $("body").addClass("loading");
    var userSession = Creator.USER_CONTEXT;
    var authorization = "Bearer " + userSession.spaceId + "," + userSession.user.authToken;
    $.ajax({
      type: "POST",
      url: Meteor.absoluteUrl("/api/odata/v4/" + userSession.spaceId + "/" + object_name + "/" + record_id + "/disable"),
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
      url: Meteor.absoluteUrl("/api/odata/v4/" + userSession.spaceId + "/" + object_name + "/" + record_id + "/enable"),
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
    if (record && !record.user_accepted && (record.user && record.user._id) != Steedos.userId()){
      return true
    }
  }
}