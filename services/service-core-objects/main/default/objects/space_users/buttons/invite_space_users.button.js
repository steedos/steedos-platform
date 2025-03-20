/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-12 11:32:06
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-03-16 18:05:10
 * @Description: 
 */
module.exports = {
    invite_space_users: function (object_name, record_id) {
        // var address = window.location.origin + "/signup?redirect_uri=" + encodeURIComponent(window.location.origin + __meteor_runtime_config__.ROOT_URL_PATH_PREFIX) + "&X-Space-Id=" + Steedos.getSpaceId();
        var inviteToken = Steedos.getInviteToken();
        let address = window.location.origin + "/signup?invite_token=" + inviteToken;

        var clipboard = new Clipboard('.button_invite_space_users');

        $(".button_invite_space_users").attr("data-clipboard-text", address);

        clipboard.on('success', function (e) {
            toastr.success(t("space_users_aciton_invite_space_users_success"));
            e.clearSelection();
            clipboard.destroy();
        });

        clipboard.on('error', function (e) {
            toastr.error(t("space_users_aciton_invite_space_users_error"));
            console.error('Action:', e.action);
            console.error('Trigger:', e.trigger);
            console.log('address', address);
            console.log('clipboard error', e)
            clipboard.destroy();
        });
    },
    invite_space_usersVisible: function () {
        if (Steedos.isSpaceAdmin() && Steedos.Account.disabledAccountRegister() != true) {
            let space = Steedos.Space.get();
            if (space && space.enable_register) {
                return true;
            }
        }
    }
}