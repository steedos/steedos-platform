/*
 * @Author: baozhoutao@hotoa.com
 * @Date: 2022-05-28 11:07:57
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-06-22 14:21:04
 * @Description: 
 */
module.exports = {
  apply: function (object_name, record_id, fields) {
    var licenseServer = 'https://huayan.my.steedos.com:8443';
    if (!Steedos.isSpaceAdmin()) {
      return toastr.info("请联系管理员");
    }
    window.open(licenseServer + "/accounts/a/");
  },
  copySpaceId: function (object_name, record_id) {
    var item_element = $('.list-action-custom-copySpaceId')
    item_element.attr('data-clipboard-text', Session.get("spaceId"));
    if (!item_element.attr('data-clipboard-new')) {
      // item_element.attr('data-clipboard-text', Session.get("spaceId"));
      var clipboard = new Clipboard(item_element[0]);
      item_element.attr('data-clipboard-new', true);
      clipboard.on('success', function (e) {
        return toastr.success('复制成功');
      });
      clipboard.on('error', function (e) {
        toastr.error('复制失败');
        return console.error("e");
      });
      if (item_element[0].tagName === 'LI' || item_element.hasClass('view-action')) {
        return item_element.trigger("click");
      }
    }
  },
  changeSpaceLicense: function () {
    Modal.show("quickFormModal", {
      schema: Creator.getObjectSchema({ fields: { license: { type: 'textarea', label: "许可证", rows: 8, required: true } } }),
      formId: 'changeSpaceLicense',
      title: TAPi18n.__('license_action_changeSpaceLicense'),
      confirmBtnText: TAPi18n.__('license_action_changeSpaceLicense_confirmBtnText'),
      onConfirm: function (formValues, e, t) {
        var license = formValues.insertDoc.license;
        var licenseInfo = license.split(',');
        var data = { licenses: [{ license: licenseInfo[0], key: licenseInfo[1] }] };
        var result = Steedos.authRequest("/api/v4/license/" + Session.get("spaceId") + "/sync", { type: 'post', async: false, data: JSON.stringify(data) });
        if (result.error) {
          toastr.error(TAPi18n.__(result.error));
        } else {
          Modal.hide(t);
          window.location.reload();
        }
      }
    }, {
      backdrop: 'static',
      keyboard: true
    })
  },
  upgrade: function () {
    window.open(`https://www.steedos.com/pricing/platform`);
  }
}