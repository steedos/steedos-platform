module.exports = {
    show_packages_store: function () {
        let packageService = "https://www.steedos.cn";

        if(Meteor.settings.public.webservices.app_exchange && Meteor.settings.public.webservices.app_exchange.url){
            packageService = Meteor.settings.public.webservices.app_exchange.url;
        }

        return window.open(`${packageService}?client=${window.btoa(Meteor.absoluteUrl('', window.location.origin))}&install_nodes=${window.btoa(Steedos.PackageRegistry.getNodes().join(','))}`);
        // return window.open(`${packageService}/app-store?client=${window.btoa(Meteor.absoluteUrl('', window.location.origin))}&install_nodes=${window.btoa(Steedos.PackageRegistry.getNodes().join(','))}`)

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
                    url: `${packageService}/api/public/steedos_packages.json`,
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
                return result.modules || [];
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
                        const nodesSelect = Steedos.PackageRegistry.getNodesSelect();
                        swal({
                            title: `安装`,
                            text: `确定要安装 <a href="${packageService}/app-store/${record.name}" target="_blank">${record.name}</a>?${nodesSelect}`,
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
                                        nodeID: $("#steedos_package_main_node").val()
                                    }),
                                    success: function(){
                                        setTimeout(function(){
                                            toastr.clear();
                                            toastr.success('已安装');
                                            FlowRouter.reload()
                                        }, 1000 * 10)
                                    },
                                    error: function(XMLHttpRequest){
                                        toastr.clear();
                                        toastr.error(XMLHttpRequest.responseJSON.error);
                                    }
                                })
                            }
                        })
                    }
                },
                {
                    name: 'show_readme',
                    label: '查看',
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
                        window.open(`${packageService}/app-store/${record.name}`)
                    }
                }
            ], 
        })
    },
    show_packages_storeVisible: function () {
        return true
    }
}