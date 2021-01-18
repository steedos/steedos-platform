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
                    toastr.error(t(XMLHttpRequest.responseJSON.error.replace(/:/g, '：')))
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
        if (filterReturn && !object.hidden && !_.include(['cfs_instances_filerecord'], object.name)) {
            objects.push(object)
        }
    })
    objects.sort(Creator.sortingMethod.bind({key:"label"}))
    return objects;
}