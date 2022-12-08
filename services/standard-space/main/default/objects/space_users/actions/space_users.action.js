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
        if(data){
          if(data.error){
            $("body").removeClass("loading");
            toastr.error(t("space_users_method_disable_error", t(data.error.reason)));
          }
          else{
            // ObjectForm有缓存，修改需要刷新表单数据
            SteedosUI.reloadRecord(Session.get("object_name"), Session.get("record_id"));
            setTimeout(function(){
              $("body").removeClass("loading");
              FlowRouter.reload();
              toastr.success(t("space_users_method_disable_success"));
            },3000);
          }
        }
        else{
          $("body").removeClass("loading");
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
    var canDisable = record && record.user_accepted && (record.user && record.user._id) != Steedos.userId()
    if(!canDisable){
      return;
    }
    //以下为权限判断
    var organization = Session.get("organization");
    var allowEdit = Creator.baseObject.actions.standard_edit.visible.apply(this, arguments);
    if(!allowEdit){
        // permissions配置没有权限则不给权限
        return false
    }

    // 组织管理员要单独判断，只给到有对应分部的组织管理员权限
    if(Steedos.isSpaceAdmin()){
        return true;
    }
    else{
        return SpaceUsersCore.isCompanyAdmin(record_id, organization);
    }
  },
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
    var canEnable = record && !record.user_accepted && (record.user && record.user._id) != Steedos.userId()
    if(!canEnable){
      return;
    }
    //以下为权限判断
    var organization = Session.get("organization");
    var allowEdit = Creator.baseObject.actions.standard_edit.visible.apply(this, arguments);
    if(!allowEdit){
        // permissions配置没有权限则不给权限
        return false
    }

    // 组织管理员要单独判断，只给到有对应分部的组织管理员权限
    if(Steedos.isSpaceAdmin()){
        return true;
    }
    else{
        return SpaceUsersCore.isCompanyAdmin(record_id, organization);
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
        var result = Steedos.authRequest("/service/api/space_users/lockout", {type: 'post', async: false, data: JSON.stringify({
          suId: record_id
        })});
        if(result.error){
          // 报错信息重复
          // toastr.error(t("space_users_method_lockout_error", t(result.error.reason)));
        }else{
          toastr.success(t("space_users_method_lockout_success"));
          FlowRouter.reload()
        }
      }
      sweetAlert.close();
    })
  },
  lockoutVisible: function (object_name, record_id, record_permissions, record) {
    if((record.user && record.user._id) === Steedos.userId()){
      return;
    }
    var organization = Session.get("organization");
    var allowEdit = Creator.baseObject.actions.standard_edit.visible.apply(this, arguments);
    if(!allowEdit){
        // permissions配置没有权限则不给权限
        return false
    }
    var isAdmin = Steedos.isSpaceAdmin();
    if(!isAdmin){
      // 组织管理员要单独判断，只给到有对应分部的组织管理员权限
      isAdmin = SpaceUsersCore.isCompanyAdmin(record_id, organization);
    }
    if (!isAdmin) {
      return;
    }
    //以上为权限判断

    if (record){
      var userSession = Creator.USER_CONTEXT;
      var result = Steedos.authRequest("/service/api/space_users/is_lockout", {type: 'post', async: false, data: JSON.stringify({
        suId: record_id
      })});
      if(result.error){
        toastr.error(result.error.reason);
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
        var result = Steedos.authRequest("/service/api/space_users/unlock", {type: 'post', async: false, data: JSON.stringify({
          suId: record_id
        })});
        if(result.error){
          // 报错信息重复
          // toastr.error(t("space_users_method_unlock_error", t(result.error.reason)));
        }else{
          toastr.success(t("space_users_method_unlock_success"));
          FlowRouter.reload()
        }
      }
      sweetAlert.close();
    })
  },
  unlockVisible: function (object_name, record_id, record_permissions, record) {
    if((record.user && record.user._id) === Steedos.userId()){
      return;
    }
    var organization = Session.get("organization");
    var allowEdit = Creator.baseObject.actions.standard_edit.visible.apply(this, arguments);
    if(!allowEdit){
        // permissions配置没有权限则不给权限
        return false
    }
    var isAdmin = Steedos.isSpaceAdmin();
    if(!isAdmin){
      // 组织管理员要单独判断，只给到有对应分部的组织管理员权限
      isAdmin = SpaceUsersCore.isCompanyAdmin(record_id, organization);
    }
    if (!isAdmin) {
      return;
    }
    //以上为权限判断
    
    if (record){
      var userSession = Creator.USER_CONTEXT;
      var result = Steedos.authRequest("/service/api/space_users/is_lockout", {type: 'post', async: false, data: JSON.stringify({
        suId: record_id
      })});
      if(result.error){
        toastr.error(result.error.reason);
      }else{
        return result.lockout
      }
    }
  },

  import: function (object_name, record_id) {
    return Modal.show('import_users_modal');
  },
  importVisible: function (object_name, record_id, record_permissions, record) {
    return false;
  },
  setPassword: function (object_name, record_id) {
    var organization = Session.get("organization");
    var isAdmin = Creator.isSpaceAdmin();
    if (!isAdmin) {
      isAdmin = SpaceUsersCore.isCompanyAdmin(record_id, organization);
    }
    const username = this.record.username;
    var userSession = Creator.USER_CONTEXT;
    var currentSpaceUser = db.space_users.findOne({user: Creator.USER_CONTEXT.userId});
    if (!isAdmin || (currentSpaceUser._id == this.record._id)) {
      var isPasswordEmpty = false;
      var result = Steedos.authRequest("/service/api/space_users/is_password_empty", { type: 'post', async: false, data: JSON.stringify({
        suId: record_id
      })});
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
        Meteor.call("setSpaceUserPassword", record_id, userSession.spaceId, CryptoJS.SHA256(inputValue).toString(), function (error, result) {
          window.$("body").removeClass("loading");
          if (error) {
            return toastr.error(error.reason);
          } else {
            swal.close();
            return toastr.success(t("Change password successfully"));
          }
        });
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
        if((event.ctrlKey || event.metaKey) && [67, 88, 86, 65].indexOf(event.keyCode) > -1){
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
      width:"100px", 
      name: modalName, 
      children: reactInput, 
      okText: t('OK'),
      cancelText: t('Cancel'),
      destroyOnClose:true,
      modalRender: function(node){
        if(!observered){
          let input = inputRef.current;
          if(input){
            mutationObserver && mutationObserver.observe(input, {attributes: true});
            observered = true;
          }
        }
        return node;
      },
      onOk: function(){
        let inputValue = inputRef.current && inputRef.current.value;
        let result = Steedos.validatePassword(inputValue);
        if(username && inputValue){
          if(window.lodash.includes(inputValue, username)){
            return SteedosUI.message.error('密码不能包含用户名');
          }
        }
        if (result.error) {
          return SteedosUI.message.error(result.error.reason);
        }
        doUpdate(inputValue);
        SteedosUI.refs[modalName].close();
      },
      afterClose: function(){
        mutationObserver && mutationObserver.disconnect();
        delete SteedosUI.refs[modalName];
      }
    });
    modal && modal.show();
  },
  setPasswordVisible: function (object_name, record_id, record_permissions) {
    var organization = Session.get("organization");
    var allowEdit = Creator.baseObject.actions.standard_edit.visible.apply(this, arguments);
    if (!allowEdit) {
      // permissions配置没有权限则不给权限
      return false
    }
    if (Session.get("app_id") === 'admin') {
      var space_userId = db.space_users.findOne({ user: Steedos.userId(), space: Steedos.spaceId() })._id
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
  standard_newVisible: function (object_name, record_id, record_permissions, record) {
    var organization = Session.get("organization");
    var allowCreate = Creator.baseObject.actions.standard_new.visible.apply(this, arguments);
    if (!allowCreate) {
      // permissions配置没有权限则不给权限
      return false
    }
    // 组织管理员要单独判断，只给到有对应分部的组织管理员权限
    if (Steedos.isSpaceAdmin()) {
      return true;
    }
    else {
      var userId = Steedos.userId();
      //当前选中组织所属分部的管理员才有权限
      if (organization && organization.company_id && organization.company_id.admins) {
        return organization.company_id.admins.indexOf(userId) > -1;
      }
    }
  },
  standard_editVisible: function (object_name, record_id, record_permissions, record) {
    var organization = Session.get("organization");
    var allowEdit = Creator.baseObject.actions.standard_edit.visible.apply(this, arguments);
    if (!allowEdit) {
      // permissions配置没有权限则不给权限
      return false
    }
    if (Session.get("app_id") === 'admin') {
      var space_userId = db.space_users.findOne({ user: Steedos.userId(), space: Steedos.spaceId() })._id
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
  standard_deleteVisible: function (object_name, record_id, record_permissions, record) {
    return false;
  },
  invite_space_users: function (object_name, record_id) {
    // var address = window.location.origin + "/accounts/a/#/signup?redirect_uri=" + encodeURIComponent(window.location.origin + __meteor_runtime_config__.ROOT_URL_PATH_PREFIX) + "&X-Space-Id=" + Steedos.getSpaceId();
    var inviteToken = Steedos.getInviteToken();
    let address = window.location.origin + "/accounts/a/#/signup?invite_token=" + inviteToken;
    if(_.isFunction(Steedos.isCordova) && Steedos.isCordova()){
        address = Meteor.absoluteUrl("accounts/a/#/signup?invite_token=" + inviteToken)
    }
    
    var clipboard = new Clipboard('.list-action-custom-invite_space_users');

    $(".list-action-custom-invite_space_users").attr("data-clipboard-text", address);

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
  invite_space_usersVisible: function () {
    if (Creator.isSpaceAdmin()) {
      let space = Creator.odata.get("spaces", Session.get("spaceId"), "enable_register");
      if (space && space.enable_register) {
        return true;
      }
    }
  }
}