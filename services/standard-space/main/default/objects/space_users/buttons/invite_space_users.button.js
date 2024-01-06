/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-12 11:32:06
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-01-06 16:23:46
 * @Description: 
 */
module.exports = {
    invite_space_users: function (object_name, record_id) {
        // var address = window.location.origin + "/accounts/a/#/signup?redirect_uri=" + encodeURIComponent(window.location.origin + __meteor_runtime_config__.ROOT_URL_PATH_PREFIX) + "&X-Space-Id=" + Steedos.getSpaceId();
        var inviteToken = Steedos.getInviteToken();
        let address = window.location.origin + "/accounts/a/#/signup?invite_token=" + inviteToken;
        if (_.isFunction(Steedos.isCordova) && Steedos.isCordova()) {
            address = Meteor.absoluteUrl("accounts/a/#/signup?invite_token=" + inviteToken)
        }

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
        if (Creator.isSpaceAdmin() && Meteor.settings.public.accounts.disabled_account_register != true) {
            let space = Creator.odata.get("spaces", Session.get("spaceId"), "enable_register");
            if (space && space.enable_register) {
                return true;
            }
        }
    }
}