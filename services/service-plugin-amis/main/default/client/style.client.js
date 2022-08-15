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
        </style>`);
        $("head").append(styleCss);
    } catch (error) {
        console.log(error);
    }
})();