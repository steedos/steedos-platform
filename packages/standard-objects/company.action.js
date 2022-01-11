module.exports = {
    updateOrgs: function (object_name, record_id) {
        if (!this.record.organization) {
            toastr.warning("该分部的关联组织未设置，未更新任何数据");
            return;
        }

        var doUpdate = function () {
            $("body").addClass("loading");
            var userSession = Creator.USER_CONTEXT;
            var spaceId = userSession.spaceId;
            var authToken = userSession.authToken ? userSession.authToken : userSession.user.authToken;
            var url = "/api/v4/company/" + record_id + "/updateOrgs";
            url = Steedos.absoluteUrl(url);
            try {
                var authorization = "Bearer " + spaceId + "," + authToken;
                var fetchParams = {};
                var headers = [{
                    name: 'Content-Type',
                    value: 'application/json'
                }, {
                    name: 'Authorization',
                    value: authorization
                }];
                $.ajax({
                    type: "POST",
                    url: url,
                    data: fetchParams,
                    dataType: "json",
                    contentType: 'application/json',
                    beforeSend: function (XHR) {
                        if (headers && headers.length) {
                            return headers.forEach(function (header) {
                                return XHR.setRequestHeader(header.name, header.value);
                            });
                        }
                    },
                    success: function (data) {
                        console.log(data);
                        $("body").removeClass("loading");
                        var logInfo = "已成功更新" + data.updatedOrgs + "条组织信息及" + data.updatedSus + "条用户信息";
                        console.log(logInfo);
                        toastr.success(logInfo);
                        /* 更新组织后刷新分部列表，直接显示新的关联组织、排序号等列表信息 */
                        $(".slds-page-header--object-home .btn-refresh").trigger("click");
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        $("body").removeClass("loading");
                        console.error(XMLHttpRequest.responseJSON);
                        if (XMLHttpRequest.responseJSON && XMLHttpRequest.responseJSON.error) {
                            toastr.error(XMLHttpRequest.responseJSON.error.message)
                        }
                        else {
                            toastr.error(XMLHttpRequest.responseJSON)
                        }
                    }
                });
            } catch (err) {
                console.error(err);
                toastr.error(err);
                $("body").removeClass("loading");
            }
        }

        var text = "此操作将把组织结构中对应节点（及所有下属节点）的组织所属分部更新为本分部，组织中的人员所属分部也都更新为本分部。是否继续";
        swal({
            title: "更新“" + this.record.name + "”组织信息",
            text: "<div>" + text + "？</div>",
            html: true,
            showCancelButton: true,
            confirmButtonText: t('YES'),
            cancelButtonText: t('NO')
        }, function (option) {
            if (option) {
                doUpdate();
            }
        });
    },

    updateOrgsVisible: function (object_name, record_id, record_permissions) {
        var perms, record;
        perms = {};
        if (record_permissions) {
            perms = record_permissions;
        } else {
            record = Creator.getObjectRecord(object_name, record_id);
            record_permissions = Creator.getRecordPermissions(object_name, record, Meteor.userId());
            if (record_permissions) {
                perms = record_permissions;
            }
        }
        return perms["allowEdit"];
    },
}