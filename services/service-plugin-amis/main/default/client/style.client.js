(function () {
    try {
        var styleCss = $(`<style>
            .steedos .creator-content-wrapper .steedos-page .page-header-wrapper{
                display: none;
            }
            .ant-modal.absolute .ant-modal-content{
                /*使用绝对定位显示弹出窗口时，内层content最大高度不用限制*/
                max-height: unset;
            }
            .page-form-object_layouts .steedos-amis-form .antd-Collapse .antd-Table-table .antd-Form--normal{
                /*格式内的单元格空白太多*/
                display: block!important;
            }
        </style>`);
        $("head").append(styleCss);
    } catch (error) {
        console.log(error);
    }
})();