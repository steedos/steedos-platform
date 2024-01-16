"use strict";
module.exports = {
    // 因为删除流程需要输入流程名称进行二次确认，故这里不显示列表批量删除按钮
    standard_delete_manyVisible: function () {
        return false;
    }
}