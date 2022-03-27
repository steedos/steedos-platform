module.exports = {
    deploy: function (object_name, record_id) {
        $(document.body).addClass('loading');
        let url = `/service/api/@steedos/standard-process/deploy`;
        let options = {
            type: 'post',
            async: true,
            data: JSON.stringify({ _id: record_id }),
            success: function (data) {
                toastr.success('流程已发布。');
                SteedosUI.reloadRecord(object_name, record_id);
                FlowRouter.reload();
                $(document.body).removeClass('loading');
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                toastr.error(t(XMLHttpRequest.responseJSON.error))
                $(document.body).removeClass('loading');
            }
        };
        Steedos.authRequest(url, options);
    },
    deployVisible: function () {
        return true
    }
}