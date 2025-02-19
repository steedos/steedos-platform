/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-12 11:32:06
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2025-02-19 14:59:42
 * @Description: 
 */
module.exports = {
    unlock: function (object_name, record_id) {
        var text = t('space_users_unlock_button_confirm_text');
        swal({
            title: t('space_users_unlock_button_confirm_title'),
            text: "<div>" + text + "</div>",
            html: true,
            showCancelButton: true,
            confirmButtonText: t('YES'),
            cancelButtonText: t('NO')
        }, function (confirm) {
            if (confirm) {
                var userSession = Creator.USER_CONTEXT;
                var result = Steedos.authRequest("/service/api/space_users/unlock", {
                    type: 'post', async: false, data: JSON.stringify({
                        suId: record_id
                    })
                });
                if (result.error) {
                    // 报错信息重复
                    // toastr.error(t("space_users_method_unlock_error", t(result.error.reason)));
                } else {
                    toastr.success(t("space_users_method_unlock_success"));
                    FlowRouter.reload()
                }
            }
            sweetAlert.close();
        })
    },
    unlockVisible: function (object_name, record_id, record_permissions, data) {
        var record = data && data.record;
        if ((record.user && record.user._id) === Steedos.User.get().userId) {
            return;
        }
        var organization = Session.get("organization");
        var allowEdit = Steedos.Object.base.actions.standard_edit.visible.apply(this, arguments);
        if (!allowEdit) {
            // permissions配置没有权限则不给权限
            return false
        }
        var isAdmin = Steedos.isSpaceAdmin();
        if (!isAdmin) {
            // 组织管理员要单独判断，只给到有对应分部的组织管理员权限
            isAdmin = SpaceUsersCore.isCompanyAdmin(record_id, organization);
        }
        if (!isAdmin) {
            return;
        }
        //以上为权限判断

        if (record) {
            var userSession = Creator.USER_CONTEXT;
            var result = Steedos.authRequest("/service/api/space_users/is_lockout", {
                type: 'post', async: false, data: JSON.stringify({
                    suId: record_id
                })
            });
            if (result.error) {
                toastr.error(result.error.reason);
            } else {
                return result.lockout
            }
        }
    },
}