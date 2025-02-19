/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-12 11:32:06
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2025-02-19 14:42:37
 * @Description: 
 */
module.exports = {
    enable: function (object_name, record_id) {
        $("body").addClass("loading");
        var userSession = Creator.USER_CONTEXT;
        var authorization = "Bearer " + userSession.spaceId + "," + userSession.user.authToken;
        $.ajax({
            type: "POST",
            url: Steedos.absoluteUrl("/service/api/space_users/enable"),
            data: JSON.stringify({
                suId: record_id
            }),
            dataType: "json",
            contentType: 'application/json',
            beforeSend: function (XHR) {
                XHR.setRequestHeader('Content-Type', 'application/json');
                XHR.setRequestHeader('Authorization', authorization);
            },
            success: function (data) {
                $("body").removeClass("loading");
                if (data) {
                    if (data.error) {
                        toastr.error(t("space_users_method_enable_error", t(data.error.reason)));
                    }
                    else {
                        FlowRouter.reload();
                        toastr.success(t("space_users_method_enable_success"));
                    }
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $("body").removeClass("loading");
                var errorMsg = errorThrown;
                var error = XMLHttpRequest.responseJSON.error;
                if (error) {
                    console.error("Enable Space User Faild:", error);
                    if (error.reason) {
                        errorMsg = error.reason;
                    }
                    else if (error.message) {
                        errorMsg = error.message;
                    }
                    else {
                        errorMsg = error;
                    }
                }
                errorMsg = t(errorMsg);
                if (error.details) {
                    if (_.isObject(error.details)) {
                        errorMsg += JSON.stringify(error.details);
                    }
                    else {
                        errorMsg += t(error.details);
                    }
                }
                toastr.error(t("space_users_method_enable_error", errorMsg));
            }
        });
    },

    enableVisible: function (object_name, record_id, record_permissions, data) {
        var record = data && data.record;
        var canEnable = record && !record.user_accepted && (record.user && record.user._id) != Steedos.User.get().userId
        if (!canEnable) {
            return;
        }
        //以下为权限判断
        var organization = Session.get("organization");
        var allowEdit = Steedos.Object.base.actions.standard_edit.visible.apply(this, arguments);
        if (!allowEdit) {
            // permissions配置没有权限则不给权限
            return false
        }

        if(record.invite_state == 'refused' || record.invite_state == 'pending'){
            return false;
        }

        // 组织管理员要单独判断，只给到有对应分部的组织管理员权限
        if (Steedos.isSpaceAdmin()) {
            return true;
        }
        else {
            return SpaceUsersCore.isCompanyAdmin(record_id, organization);
        }
    },
}