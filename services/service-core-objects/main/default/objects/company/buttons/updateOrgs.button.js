/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-12 11:29:54
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-03-05 10:36:36
 * @Description: 
 */
module.exports = { 
    updateOrgs: function (object_name, record_id) {
        const record = this.record ? this.record.record : this.record;
        if (!record.organization) {
            toastr.warning(t("company_warning_no_associated_organization_set"));
            return;
        }

        var doUpdate = function () {
            window.$("body").addClass("loading");
            var userSession = Creator.USER_CONTEXT;
            var spaceId = userSession.spaceId;
            var authToken = userSession.authToken ? userSession.authToken : userSession.user.authToken;
            var url = "/service/api/company/updateOrgs";
            url = Steedos.absoluteUrl(url);
            try {
                var authorization = "Bearer " + spaceId + "," + authToken;
                var fetchParams = {
                    companyId: record_id
                };
                var headers = [{
                    name: 'Content-Type',
                    value: 'application/json'
                }, {
                    name: 'Authorization',
                    value: authorization
                }];
                window.$.ajax({
                    type: "POST",
                    url: url,
                    data: JSON.stringify(fetchParams),
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
                        window.$("body").removeClass("loading");
                        var logInfo = t("company_success_updata_message",{updatedOrgs:data.updatedOrgs,updatedSus:data.updatedSus});
                        console.log(logInfo);
                        toastr.success(logInfo);
                        /* 更新组织后刷新分部列表，直接显示新的关联组织、排序号等列表信息 */
                        window.$(".slds-page-header--object-home .btn-refresh").trigger("click");
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        window.$("body").removeClass("loading");
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
                window.$("body").removeClass("loading");
            }
        }

        var text = t("company_confirm_text");
        swal({
            title: t("company_confirm_title",record.name),
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