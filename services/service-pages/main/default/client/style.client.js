(function () {
    try {
        var styleCss = $(`<style>
            .steedos .creator-content-wrapper .steedos-page .page-header-wrapper{
                display: none;
            }
        </style>`);
        $("head").append(styleCss);
    } catch (error) {
        console.log(error);
    }
})();