module.exports = {
    show_packages_store: function () {
        const packageService = 'http://192.168.3.2:5300';
        SteedosUI.showModal(stores.ComponentRegistry.components.ObjectTable, {
            title: '安装软件包',
            listSchema:{
                columns: [
                    {field: "name"},
                    {field: "module"},
                    {field: "version"},
                    {field: "description"},
                ],
            },
            objectSchema: {
                fields: {
                    name: {
                        type: 'text'
                    },
                    module: {
                        type: 'text'
                    },
                    version: {
                        type: 'text'
                    },
                    description: {
                        type: 'textare'
                    },
                }
            },
            rows: function(){
                let result = []
                var defOptions = {
                    type: "get",
                    url: `${packageService}/api/public/steedos_packages`,
                    dataType: "json",
                    contentType: 'application/json',
                    async: false,
                    success: function (data) {
                        result = data;
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        console.error(XMLHttpRequest.responseJSON);
                        if (XMLHttpRequest.responseJSON && XMLHttpRequest.responseJSON.error) {
                            toastr.error(t(XMLHttpRequest.responseJSON.error.replace(/:/g, '：')))
                        }
                        else {
                            toastr.error(XMLHttpRequest.responseJSON)
                        }
                    }
                }
                $.ajax(Object.assign({}, defOptions));
                return result;
            }(),
            checkboxSelection: false,
            rowButtons: [
                {
                    name: 'install',
                    label: '安装',
                    visible: true,
                    todo: function (object_name, record_id) {
                        let result = {}
                        var defOptions = {
                            type: "get",
                            url: `${packageService}/api/public/steedos_packages/${record_id}`,
                            dataType: "json",
                            contentType: 'application/json',
                            async: false,
                            success: function (data) {
                                result = data;
                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                console.error(XMLHttpRequest.responseJSON);
                                if (XMLHttpRequest.responseJSON && XMLHttpRequest.responseJSON.error) {
                                    toastr.error(t(XMLHttpRequest.responseJSON.error.replace(/:/g, '：')))
                                }
                                else {
                                    toastr.error(XMLHttpRequest.responseJSON)
                                }
                            }
                        }
                        $.ajax(Object.assign({}, defOptions));
                        const record = result;
                        swal({
                            title: `安装`,
                            text: `确定要安装${record.name}?`,
                            html: true,
                            showCancelButton: true,
                            confirmButtonText: '安装',
                            cancelButtonText: TAPi18n.__('Cancel')
                        }, function (option) {
                            if (option) {
                                toastr.info('安装中，请稍后...', null, {timeOut: false});
                                Steedos.authRequest(Steedos.absoluteUrl('/api/nodes/install'), {type: 'post', async: false, data: JSON.stringify({
                                    module: record.name,
                                    version: record.version,
                                    label: record.label,
                                    description: record.description,
                                })})
                                setTimeout(function(){
                                    toastr.clear();
                                    toastr.success('已安装');
                                    FlowRouter.reload()
                                }, 1000 * 10)
                            }
                        })
                    }
                },
                {
                    name: 'show_readme',
                    label: '查看 readme',
                    visible: true,
                    todo: function (object_name, record_id) {
                        window.open(`${packageService}/api/public/steedos_packages/${record_id}/readme`)
                    }
                }
            ], 
        })
    },
    show_packages_storeVisible: function () {
        return true
    }
}