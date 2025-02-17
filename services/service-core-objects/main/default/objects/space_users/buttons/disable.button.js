/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-12 11:32:06
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-12-13 10:16:32
 * @Description: 
 */
module.exports = {
    disable: function (object_name, record_id) {
        $("body").addClass("loading");
        var userSession = Creator.USER_CONTEXT;
        var authorization = "Bearer " + userSession.spaceId + "," + userSession.user.authToken;
        $.ajax({
            type: "POST",
            url: Steedos.absoluteUrl("/service/api/space_users/disable"),
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
                if (data) {
                    if (data.error) {
                        $("body").removeClass("loading");
                        toastr.error(t("space_users_method_disable_error", t(data.error.reason)));
                    }
                    else {
                        // ObjectForm有缓存，修改需要刷新表单数据
                        SteedosUI.reloadRecord(Session.get("object_name"), Session.get("record_id"));
                        setTimeout(function () {
                            $("body").removeClass("loading");
                            FlowRouter.reload();
                            toastr.success(t("space_users_method_disable_success"));
                        }, 3000);
                    }
                }
                else {
                    $("body").removeClass("loading");
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $("body").removeClass("loading");
                var errorMsg = errorThrown;
                var error = XMLHttpRequest.responseJSON.error;
                if (error) {
                    console.error("Disable Space User Faild:", error);
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
                toastr.error(t("space_users_method_disable_error", errorMsg));
            }
        });
    },

    disableVisible: function (object_name, record_id, record_permissions, data) {
        var record = data && data.record;
        var canDisable = record && record.user_accepted && (record.user && record.user._id) != Steedos.userId()
        if (!canDisable) {
            return;
        }
        //以下为权限判断
        var organization = Session.get("organization");
        var allowEdit = Steedos.Object.base.actions.standard_edit.visible.apply(this, arguments);
        if (!allowEdit) {
            // permissions配置没有权限则不给权限
            return false
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