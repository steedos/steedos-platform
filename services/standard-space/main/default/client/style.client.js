/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2023-07-04 14:30:22
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2023-07-04 14:38:07
 */
(function () {
    try {
        // 人员列表左侧组织树最大高度太小，TODO:amis 3.1应该好了，可以去除此代码
        var styleCss = $(`<style>
            .space-users-list .antd-Tree{
                max-height: 80vh !important;
                overflow: visible !important;
            }
        </style>`);
        $("head").append(styleCss);
    } catch (error) {
        console.log(error);
    }
})();