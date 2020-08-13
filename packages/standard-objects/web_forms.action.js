module.exports = {
  copyHtmlCode: function (object_name, record_id, target) {
    var htmlCode = this.record.generated_html;
    var clipboard = new Clipboard(".record-action-custom-copyHtmlCode");
    $(".record-action-custom-copyHtmlCode").attr("data-clipboard-text", htmlCode);
    clipboard.on('success', function (e) {
      toastr.success(t("web_forms_aciton_copyHtmlCode_success"));
      e.clearSelection();
      clipboard.destroy();
    });

    clipboard.on('error', function (e) {
      toastr.error(t("web_forms_aciton_copyHtmlCode_error"));
      console.error('Action:', e.action);
      console.error('Trigger:', e.trigger);
      console.log('address', address);
      console.log('clipboard error', e)
      clipboard.destroy();
    });
  },

  copyHtmlCodeVisible: function () {
    return true
  }
}