module.exports = {
    enable: function (object_name, record_id) {
        $(document.body).addClass('loading');
        let url = `/service/api/@steedos/standard-process/enable`;
        let options = {
            type: 'post',
            async: true,
            data: JSON.stringify({ _id: record_id }),
            success: function (data) {
                toastr.success('流程已启用。');
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
    enableVisible: function (object_name, record_id, permission, record) {
        return record && !record.is_active
    }
}