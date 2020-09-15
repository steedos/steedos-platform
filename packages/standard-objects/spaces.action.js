module.exports = {
    invite_space_users: function(object_name, record_id, fields){
        var inviteToken = Steedos.getInviteToken();
        let address = window.location.origin + "/accounts/a/#/signup?invite_token=" + inviteToken;
        if(_.isFunction(Steedos.isCordova) && Steedos.isCordova()){
            address = Meteor.absoluteUrl("accounts/a/#/signup?invite_token=" + inviteToken)
        }
        
        var clipboard = new Clipboard('.record-action-custom-invite_space_users');

        $(".record-action-custom-invite_space_users").attr("data-clipboard-text", address);

        clipboard.on('success', function(e) {
            toastr.success(t("space_users_aciton_invite_space_users_success"));
            e.clearSelection();
            clipboard.destroy();
        });
        
        clipboard.on('error', function(e) {
            toastr.error(t("space_users_aciton_invite_space_users_error"));
            console.error('Action:', e.action);
            console.error('Trigger:', e.trigger);
            console.log('address', address);
            console.log('clipboard error', e)
            clipboard.destroy();
        });
    },
    invite_space_usersVisible: function(){
        if (Creator.isSpaceAdmin()){
            let space = Creator.odata.get("spaces", Session.get("spaceId"), "enable_register");
            if(space && space.enable_register){
                return true;
            }
        }
    },
    // initSpaceData: function (object_name, record_id, fileds) {
    //     $("body").addClass("loading");
    //     var userSession = Creator.USER_CONTEXT;
    //     var spaceId = userSession.spaceId;
    //     var authToken = userSession.authToken ? userSession.authToken : userSession.user.authToken;
    //     var url = "/api/v4/spaces/" + spaceId + "/initSpaceData";
    //     url = Steedos.absoluteUrl(url);
    //     try {
    //         var authorization = "Bearer " + spaceId + "," + authToken;
    //         var fetchParams = {};
    //         var headers = [{
    //             name: 'Content-Type',
    //             value: 'application/json'
    //         }, {
    //             name: 'Authorization',
    //             value: authorization
    //         }];
    //         $.ajax({
    //             type: "POST",
    //             url: url,
    //             data: fetchParams,
    //             dataType: "json",
    //             contentType: 'application/json',
    //             beforeSend: function (XHR) {
    //                 if (headers && headers.length) {
    //                     return headers.forEach(function (header) {
    //                         return XHR.setRequestHeader(header.name, header.value);
    //                     });
    //                 }
    //             },
    //             success: function (data) {
    //                 $("body").removeClass("loading");
    //             },
    //             error: function (XMLHttpRequest, textStatus, errorThrown) {
    //                 $("body").removeClass("loading");
    //                 console.error(XMLHttpRequest.responseJSON);
    //                 if (XMLHttpRequest.responseJSON && XMLHttpRequest.responseJSON.error) {
    //                     toastr.error(XMLHttpRequest.responseJSON.error.message)
    //                 }
    //                 else {
    //                     toastr.error(XMLHttpRequest.responseJSON)
    //                 }
    //             }
    //         });
    //     } catch (err) {
    //         console.error(err);
    //         toastr.error(err);
    //         $("body").removeClass("loading");
    //     }
    // }
  }