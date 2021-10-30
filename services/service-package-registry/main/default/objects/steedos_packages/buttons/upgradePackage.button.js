module.exports = {
    upgradePackage: function (object_name, record_id) {
        const record = Creator.odata.get(object_name, record_id);
        console.log(`upgradePackage record`, record)
        $("body").addClass('loading')
        SteedosUI.showModal(stores.ComponentRegistry.components.ObjectTable, {
            title: `请选择升级 ${record.label || record.name} 的版本`,
            listSchema:{
                columns: [
                    {field: "version"},
                    {field: "tag"},
                ],
            },
            objectSchema: {
                fields: {
                    version: {
                        type: 'text',
                        label: '版本号'
                    },
                    tag: {
                        type: 'select',
                        label: '标签',
                        options: [
                            {label: '正式版', value: 'latest', color:"3df53d"},
                            {label: '测试版', value: 'next', color: "f89406"}
                        ]
                    },
                }
            },
            rows: function(){
                var versions = []
                try {
                    versions = Steedos.authRequest(`/api/nodes/versions?module=${record.name}`, { type: 'get', async: false});
                } catch (error) {
                    toastr.error(error.message);
                }
                $("body").removeClass("loading")
                return versions;
            }(),
            rowSelection: 'single',
            rowKey: 'version',
            onFinish: async (selectedRowKeys, selectedRows) => {
                if(selectedRowKeys.length < 1){
                    throw new Error(`请选择要升级的版本`);
                }
                const installVersion = selectedRowKeys[0];
                if(record.version == installVersion ){
                    toastr.info(`您已安装版本${installVersion}`);
                    return false;
                }

                swal({
                    title: `升级`,
                    text: `确定要升级到 ${installVersion}?`,
                    html: true,
                    showCancelButton: true,
                    confirmButtonText: '升级',
                    cancelButtonText: TAPi18n.__('Cancel')
                }, function (option) {
                    if (option) {
                        toastr.info('升级中，请稍后...', null, {timeOut: false});
                        Steedos.authRequest(Steedos.absoluteUrl('/api/nodes/upgrade'), {type: 'post', async: false, data: JSON.stringify({
                                module: record.name,
                                version: installVersion
                            }),
                            success: function(){
                                setTimeout(function(){
                                    toastr.clear();
                                    toastr.success('升级成功');
                                    if (FlowRouter.current().params.record_id) {
                                        SteedosUI.reloadRecord(object_name, record_id)
                                    }
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

                return true;
            }
        })
    },
    upgradePackageVisible: function (object_name, record_id) {
        const record = Creator.odata.get(object_name, record_id);
        if (record.status === 'enable' && !record.local) {
            return true;
        }
        return false
    }
}