module.exports = {
    setPassword: function (object_name, record_id) {
        var isAdmin = Steedos.isSpaceAdmin();
        const username = this.record.username;
        var userSession = Steedos.User.get();
        if (!isAdmin || (userSession.spaceUserId == this.record._id)) {
            var isPasswordEmpty = false;
            var result = Steedos.authRequest("/service/api/space_users/is_password_empty", {
                type: 'post', async: false, data: JSON.stringify({
                    suId: record_id
                })
            });
            if (!result.error) {
                isPasswordEmpty = result.empty;
            }
            if (!isPasswordEmpty) {
                // Modal.show("reset_password_modal");
                Steedos.openWindow(Steedos.absoluteUrl("/accounts/a/#/update-password"))
                return;
            }
        }

        var doUpdate = function (inputValue) {
            window.$("body").addClass("loading");
            try {
                var result = Steedos.authRequest("/api/user/setSpaceUserPassword", {
                    type: 'post', async: false, data: JSON.stringify({
                        space_user_id: record_id, 
                        space_id: userSession.spaceId, 
                        password: CryptoJS.SHA256(inputValue).toString()
                    })
                });
                window.$("body").removeClass("loading");
                if (result.error) {
                    toastr.error(result.error);;
                }else{
                    swal.close();
                    return toastr.success(t("Change password successfully"));
                }
                if (!isPasswordEmpty) {
                    // Modal.show("reset_password_modal");
                    Steedos.openWindow(Steedos.absoluteUrl("/accounts/a/#/update-password"))
                    return;
                }
            } catch (err) {
                console.error(err);
                toastr.error(err);
                window.$("body").removeClass("loading");
            }
        }

        const inputRef = React.createRef();

        // 监听到debug模式修改密码字段的type时自动清空密码框
        const mutationObserver = (() => {
            try {
                return new MutationObserver(function (mutations) {
                    mutations.forEach(function (mutation) {
                        if (mutation.type === 'attributes' && mutation.attributeName === 'type') {
                            mutation.target.remove();
                        }
                    });
                });
            }
            catch (ex) {
                console.warn("MutationObserver Not Found:", ex);
            }
        })();
        const reactInput = React.createElement("input", {
            type: 'password',
            placeholder: t("new_password_placeholder"),
            autoComplete: "new-password",
            className: "ant-input",
            ref: inputRef,
            onKeyDown: (event) => {
                // 禁用ctrlKey/metaKey+c/v/a，复制、剪切、粘贴、全选，其中metaKey是mac系统中相关操作的辅助键
                if ((event.ctrlKey || event.metaKey) && [67, 88, 86, 65].indexOf(event.keyCode) > -1) {
                    event.preventDefault();
                    return false;
                }
            },
            onContextMenu: (event) => {
                // 禁用鼠标右键菜单
                event.preventDefault();
                return false;
            }
        });
        let observered = false;
        const modalName = "modal-setPassword";
        const modal = SteedosUI.Modal({
            title: t("Change Password"),
            width: "100px",
            name: modalName,
            children: reactInput,
            okText: t('OK'),
            cancelText: t('Cancel'),
            destroyOnClose: true,
            modalRender: function (node) {
                if (!observered) {
                    let input = inputRef.current;
                    if (input) {
                        mutationObserver && mutationObserver.observe(input, { attributes: true });
                        observered = true;
                    }
                }
                return node;
            },
            onOk: function () {
                let inputValue = inputRef.current && inputRef.current.value;
                let result = Steedos.validatePassword(inputValue);
                if (username && inputValue) {
                    if (window.lodash.includes(inputValue, username)) {
                        return SteedosUI.message.error('密码不能包含用户名');
                    }
                }
                if (result.error) {
                    return SteedosUI.message.error(result.error.reason);
                }
                doUpdate(inputValue);
                SteedosUI.refs[modalName].close();
            },
            afterClose: function () {
                mutationObserver && mutationObserver.disconnect();
                delete SteedosUI.refs[modalName];
            }
        });
        modal && modal.show();
    },
    setPasswordVisible: function (object_name, record_id, record_permissions) {
        var organization = Session.get("organization");
        var allowEdit = Steedos.Object.base.actions.standard_edit.visible.apply(this, arguments);
        if (!allowEdit) {
            // permissions配置没有权限则不给权限
            return false
        }
        if (Session.get("app_id") === 'admin') {
            var space_userId = db.space_users.findOne({ user: Steedos.User.get().userId, space: Steedos.spaceId() })._id
            if (space_userId === record_id) {
                return true
            }
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