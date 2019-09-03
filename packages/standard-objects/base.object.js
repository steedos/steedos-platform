Creator.baseObject.actions = {
    standard_query: {
        label: "查找",
        visible: true,
        on: "list",
        todo: "standard_query"
    },
    standard_new: {
        label: "新建",
        visible: function () {
            var permissions;
            permissions = Creator.getPermissions();
            if (permissions) {
                return permissions["allowCreate"];
            }
        },
        on: "list",
        todo: "standard_new"
    },
    standard_open_view: {
        label: "查看",
        visible: false,
        on: "list_item",
        todo: "standard_open_view"
    },
    standard_edit: {
        label: "编辑",
        sort: 0,
        visible: function (object_name, record_id, record_permissions) {
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
        on: "record",
        todo: "standard_edit"
    },
    standard_delete: {
        label: "删除",
        visible: function (object_name, record_id, record_permissions) {
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
            return perms["allowDelete"];
        },
        on: "record_more",
        todo: "standard_delete"
    },
    standard_approve: {
        label: "发起审批",
        visible: function (object_name, record_id, record_permissions) {
            var object_workflow, record;
            if (record_permissions && !record_permissions["allowEdit"]) {
                return false;
            }
            record = Creator.getObjectRecord(object_name, record_id);
            record_permissions = Creator.getRecordPermissions(object_name, record, Meteor.userId());
            if (record_permissions && !record_permissions["allowEdit"]) {
                return false;
            }
            object_workflow = _.find(Creator.object_workflows, function (ow) {
                return ow.object_name === object_name;
            });
            if (!object_workflow) {
                return false;
            }
            if (record && record.instances && record.instances.length > 0) {
                return false;
            }
            return true;
        },
        on: "record",
        todo: function () {
            return Modal.show('initiate_approval', {
                object_name: this.object_name,
                record_id: this.record_id
            });
        }
    },
    standard_view_instance: {
        label: "查看审批单",
        visible: function (object_name, record_id, record_permissions) {
            var record;
            record = Creator.getObjectRecord(object_name, record_id);
            if (record && !_.isEmpty(record.instances)) {
                return true;
            }
            return false;
        },
        on: "record",
        todo: function () {
            var data, instanceId, uobj, url;
            instanceId = this.record.instances[0]._id;
            if (!instanceId) {
                console.error('instanceId not exists');
                return;
            }
            uobj = {};
            uobj['X-User-Id'] = Meteor.userId();
            uobj['X-Auth-Token'] = Accounts._storedLoginToken();
            data = {
                object_name: this.object_name,
                record_id: this.record_id,
                space_id: Session.get("spaceId")
            };
            url = Meteor.absoluteUrl() + ("api/workflow/view/" + instanceId + "?") + $.param(uobj);
            data = JSON.stringify(data);
            $(document.body).addClass('loading');
            return $.ajax({
                url: url,
                type: 'POST',
                async: true,
                data: data,
                dataType: 'json',
                processData: false,
                contentType: 'application/json',
                success: function (responseText, status) {
                    $(document.body).removeClass('loading');
                    if (responseText.errors) {
                        responseText.errors.forEach(function (e) {
                            toastr.error(e.errorMessage);
                        });
                        return;
                    } else if (responseText.redirect_url) {
                        Steedos.openWindow(responseText.redirect_url);
                    }
                },
                error: function (xhr, msg, ex) {
                    $(document.body).removeClass('loading');
                    toastr.error(msg);
                }
            });
        }
    }
}

Creator.baseObject.triggers = {
    "before.insert.server.default": {
        on: "server",
        when: "before.insert",
        todo: function (userId, doc) {
            doc.created = new Date();
            doc.modified = new Date();
            if (userId) {
                if (!doc.owner) {
                    doc.owner = userId;
                }
                if (doc.owner === '{userId}') {
                    doc.owner = userId;
                }
                doc.created_by = userId;
                return doc.modified_by = userId;
            }
        }
    },
    "before.update.server.default": {
        on: "server",
        when: "before.update",
        todo: function (userId, doc, fieldNames, modifier, options) {
            modifier.$set = modifier.$set || {};
            modifier.$set.modified = new Date();
            if (userId) {
                return modifier.$set.modified_by = userId;
            }
        }
    },
    "before.insert.client.default": {
        on: "client",
        when: "before.insert",
        todo: function (userId, doc) {
            return doc.space = Session.get("spaceId");
        }
    },
    "after.insert.server.sharing": {
        on: "server",
        when: "after.insert",
        todo: function (userId, doc, fieldNames, modifier, options) {
            var collection, obj, object_name, psCollection, psRecords, selector;
            object_name = this.object_name;
            obj = Creator.getObject(object_name);
            if (obj.enable_share) {
                collection = Creator.getCollection(object_name);
                psCollection = Creator.getCollection("permission_shares");
                selector = {
                    space: doc.space,
                    object_name: object_name
                };
                psRecords = psCollection.find(selector, {
                    fields: {
                        _id: 1,
                        filters: 1,
                        organizations: 1,
                        users: 1
                    }
                });
                return psRecords.forEach(function (ps) {
                    var count, filters, push;
                    filters = Creator.formatFiltersToMongo(ps.filters, {
                        extend: false
                    });
                    selector = {
                        space: doc.space,
                        _id: doc._id,
                        $and: filters
                    };
                    count = collection.find(selector).count();
                    if (count) {
                        push = {
                            sharing: {
                                "u": ps.users,
                                "o": ps.organizations,
                                "r": ps._id
                            }
                        };
                        return collection.direct.update({
                            _id: doc._id
                        }, {
                                $push: push
                            });
                    }
                });
            }
        }
    },
    "after.update.server.sharing": {
        on: "server",
        when: "after.update",
        todo: function (userId, doc, fieldNames, modifier, options) {
            var collection, obj, object_name, psCollection, psRecords, selector;
            object_name = this.object_name;
            obj = Creator.getObject(object_name);
            if (obj.enable_share) {
                collection = Creator.getCollection(object_name);
                psCollection = Creator.getCollection("permission_shares");
                selector = {
                    space: doc.space,
                    object_name: object_name
                };
                psRecords = psCollection.find(selector, {
                    fields: {
                        _id: 1,
                        filters: 1,
                        organizations: 1,
                        users: 1
                    }
                });
                collection.direct.update({
                    _id: doc._id
                }, {
                        $unset: {
                            "sharing": 1
                        }
                    });
                return psRecords.forEach(function (ps) {
                    var count, filters, push;
                    filters = Creator.formatFiltersToMongo(ps.filters, {
                        extend: false
                    });
                    selector = {
                        space: doc.space,
                        _id: doc._id,
                        $and: filters
                    };
                    count = collection.find(selector).count();
                    if (count) {
                        push = {
                            sharing: {
                                "u": ps.users,
                                "o": ps.organizations,
                                "r": ps._id
                            }
                        };
                        return collection.direct.update({
                            _id: doc._id
                        }, {
                                $push: push
                            });
                    }
                });
            }
        }
    },
    "after.update.server.audit": {
        "on": "server",
        when: "after.update",
        todo: function (userId, doc, fieldNames, modifier, options) {
            var obj, object_name, ref;
            object_name = this.object_name;
            obj = Creator.getObject(object_name);
            if (obj.enable_audit) {
                return (ref = Creator.AuditRecords) != null ? ref.add('update', userId, this.object_name, doc, this.previous, modifier) : void 0;
            }
        }
    },
    "after.insert.server.audit": {
        "on": "server",
        when: "after.insert",
        todo: function (userId, doc) {
            var obj, object_name, ref;
            object_name = this.object_name;
            obj = Creator.getObject(object_name);
            if (obj.enable_audit) {
                return (ref = Creator.AuditRecords) != null ? ref.add('insert', userId, this.object_name, doc) : void 0;
            }
        }
    },
    "after.insert.server.objectwebhooks": {
        "on": "server",
        when: "after.insert",
        todo: function (userId, doc) {
            return Creator.objectWebhooksPreSend(userId, doc, this.object_name, 'create');
        }
    },
    "after.update.server.objectwebhooks": {
        "on": "server",
        when: "after.update",
        todo: function (userId, doc, fieldNames, modifier, options) {
            return Creator.objectWebhooksPreSend(userId, doc, this.object_name, 'update');
        }
    },
    "after.delete.server.objectwebhooks": {
        "on": "server",
        when: "after.remove",
        todo: function (userId, doc) {
            return Creator.objectWebhooksPreSend(userId, doc, this.object_name, 'delete');
        }
    }
}

if (Meteor.isServer) {
    Creator.objectWebhooksPreSend = function (userId, doc, object_name, action) {
        var actionUserInfo, obj, owCollection, redirectUrl;
        if (!ObjectWebhooksQueue) {
            console.error('not found ObjectWebhooksQueue');
            return;
        }
        owCollection = Creator.getCollection('object_webhooks');
        if (!owCollection) {
            console.error('not found collection object_webhooks');
            return;
        }
        obj = Creator.getObject(object_name);
        actionUserInfo = Creator.getCollection('users').findOne(userId, {
            fields: {
                name: 1
            }
        });
        redirectUrl = Steedos.absoluteUrl(Creator.getObjectUrl(object_name, doc._id, object_name));
        owCollection.find({
            object_name: object_name,
            active: true,
            events: action
        }).forEach(function (oh) {
            var data;
            data = {};
            if (_.isEmpty(oh.fields)) {
                data = doc;
            } else {
                _.each(oh.fields, function (fieldName) {
                    var objField, refCollection, refFilterFields, refNameFieldKey, refObj, refRecord;
                    objField = obj.fields[fieldName];
                    if (objField.type === 'lookup' && _.isString(objField.reference_to) && !objField.multiple) {
                        refCollection = Creator.getCollection(objField.reference_to);
                        refObj = Creator.getObject(objField.reference_to);
                        if (refCollection && refObj) {
                            refNameFieldKey = refObj.NAME_FIELD_KEY;
                            refFilterFields = {};
                            refFilterFields[refNameFieldKey] = 1;
                            refRecord = refCollection.findOne(doc[fieldName], refFilterFields);
                            if (refRecord) {
                                return data[fieldName] = refRecord[refNameFieldKey];
                            }
                        }
                    } else {
                        return data[fieldName] = doc[fieldName];
                    }
                });
            }
            return ObjectWebhooksQueue.send({
                data: data,
                payload_url: oh.payload_url,
                content_type: oh.content_type,
                action: action,
                actionUserInfo: actionUserInfo,
                objectName: object_name,
                objectDisplayName: obj.label,
                nameFieldKey: obj.NAME_FIELD_KEY,
                redirectUrl: redirectUrl
            });
        });
    };
}