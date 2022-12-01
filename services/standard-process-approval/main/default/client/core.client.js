Steedos.authRequest = function (url, options) {
    var userSession = Creator.USER_CONTEXT;
    var spaceId = userSession.spaceId;
    var authToken = userSession.authToken ? userSession.authToken : userSession.user.authToken;
    var result = null;
    url = Steedos.absoluteUrl(url);
    try {
        var authorization = "Bearer " + spaceId + "," + authToken;
        var headers = [{
            name: 'Content-Type',
            value: 'application/json'
        }, {
            name: 'Authorization',
            value: authorization
        }];

        var defOptions = {
            type: "get",
            url: url,
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
                result = data;
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.error(XMLHttpRequest.responseJSON);
                if (XMLHttpRequest.responseJSON && XMLHttpRequest.responseJSON.error) {
                    const errorInfo = XMLHttpRequest.responseJSON.error;
                    result = { error: errorInfo }
                    let errorMsg;
                    if (errorInfo.reason) {
                        errorMsg = errorInfo.reason;
                    }
                    else if (errorInfo.message) {
                        errorMsg = errorInfo.message;
                    }
                    else {
                        errorMsg = errorInfo;
                    }
                    toastr.error(t(errorMsg.replace(/:/g, '：')))
                }
                else {
                    toastr.error(XMLHttpRequest.responseJSON)
                }
            }
        }
        $.ajax(Object.assign({}, defOptions, options));
        return result;
    } catch (err) {
        console.error(err);
        toastr.error(err);
    }
}

Steedos.getObjectsOptions = function (filterFunction) {
    var options = [];
    _.each(Steedos.getDisplayObjects(filterFunction), function (v, k) {
        options.push({ label: v.label, value: v.name, icon: v.icon })
    })
    return options;
}

Steedos.getDisplayObjects = function(filterFunction){
    var objects = [];
    _.each(Creator.objectsByName, function (object, k) {
        var filterReturn = true;
        if (filterFunction && _.isFunction(filterFunction)) {
            filterReturn = filterFunction(object);
        }
        if (filterReturn && !object.hidden && !_.includes(['cfs_instances_filerecord'], object.name)) {
            objects.push(object)
        }
    })
    objects.sort(Creator.sortingMethod.bind({key:"label"}))
    return objects;
}

Steedos.getFieldDataTypes = function (field) {
    if(field.type === "select"){
        return [
            {
              "label": window.t("CustomField.object_fields.data_type.options.boolean"),
              "value": "boolean"
            },
            {
              "label": window.t("CustomField.object_fields.data_type.options.number"),
              "value": "number"
            },
            {
              "label": window.t("CustomField.object_fields.data_type.options.text"),
              "value": "text"
            }
        ];
    }
    else{
        return [
            {
              "label": window.t("CustomField.object_fields.data_type.options.boolean"),
              "value": "boolean"
            },
            {
              "label": window.t("CustomField.object_fields.data_type.options.number"),
              "value": "number"
            },
            {
              "label": window.t("CustomField.object_fields.data_type.options.currency"),
              "value": "currency"
            },
            {
              "label": window.t("CustomField.object_fields.data_type.options.percent"),
              "value": "percent"
            },
            {
              "label": window.t("CustomField.object_fields.data_type.options.text"),
              "value": "text"
            },
            {
              "label": window.t("CustomField.object_fields.data_type.options.date"),
              "value": "date"
            },
            {
              "label": window.t("CustomField.object_fields.data_type.options.datetime"),
              "value": "datetime"
            }
        ];
    }
}