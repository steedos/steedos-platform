module.exports = {
    copy: function (object_name, record_id) {
        var item_element = $('.record-action-custom-copy');
        item_element.attr('data-clipboard-text', this.record.api_key);
        if (!item_element.attr('data-clipboard-new')) {
        var clipboard = new Clipboard(item_element[0]);
        item_element.attr('data-clipboard-new', true);
        clipboard.on('success', function (e) {
            return toastr.success(TAPi18n.__('复制成功'));
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
    copyVisible: function () {
        return true
    }
}