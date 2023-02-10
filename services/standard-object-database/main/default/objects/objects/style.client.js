(function () {
    try {
        var styleCss = $(`<style>
            .steedos .object-detail-page .object-detail-tabs > .antd-Tabs-linksWrapper{
                background-color: #fff;
                border-right: solid 1px;
                --tw-border-opacity: 0.6;
                border-color: rgb(203 213 225 / var(--tw-border-opacity));
            }
        </style>`);
        $("head").append(styleCss);
    } catch (error) {
        console.log(error);
    }
})();