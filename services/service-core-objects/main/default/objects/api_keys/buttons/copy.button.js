/*
 * @Author: 廖大雪 2291335922@qq.com
 * @Date: 2023-01-31 09:59:17
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-03-28 10:08:54
 * @FilePath: /project-ee/Users/troysu/Documents/GitHub/platform2.4/packages/standard-objects/api_keys-app/main/default/objects/api_keys/buttons/copy.button.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
module.exports = {
    copy: function (object_name, record_id) {
        var item_element = $('.button_copy');
        item_element.attr('data-clipboard-text', this.record.record.api_key);
        if (!item_element.attr('data-clipboard-new')) {
        var clipboard = new Clipboard(item_element[0]);
        item_element.attr('data-clipboard-new', true);
        clipboard.on('success', function (e) {
            return toastr.success(TAPi18n.__('copy_success'));
        });
        clipboard.on('error', function (e) {
            toastr.error('copy_failed');
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