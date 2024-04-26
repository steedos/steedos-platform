// 审批单同步到台账

const objectql = require('@steedos/objectql');
const Future = require('fibers/future');
var runQuoted = function (objectName, recordId) {
    objectql.runQuotedByObjectFieldFormulas(objectName, recordId);
    objectql.runQuotedByObjectFieldSummaries(objectName, recordId);
}

const getObjectFields = function (objectApiName) {
    return objectql.wrapAsync(async function () {
        return await objectql.getObject(this.objectApiName).getFields()
    }, { objectApiName: objectApiName })
}

const getObjectNameFieldKey = function (objectApiName) {
    return objectql.wrapAsync(async function () {
        return await objectql.getObject(this.objectApiName).getNameFieldKey()
    }, { objectApiName: objectApiName })
}

const getObjectConfig = function (objectApiName) {
    return objectql.wrapAsync(async function () {
        return await objectql.getObject(this.objectApiName).toConfig()
    }, { objectApiName: objectApiName })
}

const makeNewID = function (objectApiName) {
    return objectql.wrapAsync(async function () {
        return await objectql.getObject(this.objectApiName)._makeNewID()
    }, { objectApiName: objectApiName })
}

const objectInsert = function (objectApiName, data) {
    return objectql.wrapAsync(async function () {
        return await objectql.getObject(this.objectApiName).insert(this.data)
    }, { objectApiName: objectApiName, data: data })
}

const objectUpdate = function (objectApiName, id, data) {
    return objectql.wrapAsync(async function () {
        return await objectql.getObject(this.objectApiName).update(this.id, this.data)
    }, { objectApiName: objectApiName, id: id, data: data })
}

const objectUpdateMany = function (objectApiName, filters, data) {
    return objectql.wrapAsync(async function () {
        return await objectql.getObject(this.objectApiName).updateMany(this.filters, this.data)
    }, { objectApiName: objectApiName, filters: filters, data: data })
}

const objectRemove = function (objectApiName, id) {
    return objectql.wrapAsync(async function () {
        return await objectql.getObject(this.objectApiName).delete(this.id)
    }, { objectApiName: objectApiName, id: id })
}

const getRelateds = function (objectApiName) {
    return objectql.wrapAsync(async function () {
        return await objectql.getObject(this.objectApiName).getRelateds()
    }, { objectApiName: objectApiName })
}

const objectFindOne = function (objectApiName, query) {
    return objectql.wrapAsync(async function () {
        const result = await objectql.getObject(this.objectApiName).find(this.query);
        if (result && result.length > 0) {
            return result[0];
        }
        return null;
    }, { objectApiName: objectApiName, query })
}

const objectFind = function (objectApiName, query) {
    return objectql.wrapAsync(async function () {
        const result = await objectql.getObject(this.objectApiName).find(this.query);
        return result;
    }, { objectApiName: objectApiName, query })
}

Steedos.objectFind = objectFind;

Steedos.getObjectNameFieldKey = getObjectNameFieldKey;

var _eval = require('eval');
var isConfigured = false;
var sendWorker = function (task, interval) {

    if (InstanceRecordQueue.debug) {
        console.log('InstanceRecordQueue: Send worker started, using interval: ' + interval);
    }

    return Meteor.setInterval(function () {
        try {
            Future.task(() => {
                try {
                    task();
                } catch (error) {
                    console.error(error)
                }
            }).promise();

        } catch (error) {
            console.log('InstanceRecordQueue: Error while sending: ' + error.message);
        }
    }, interval);
};

const getRelatedObjectField = function (relatedObjectsKeys, key) {
    return _.find(relatedObjectsKeys, function (relatedObjectsKey) {
        return key.startsWith(relatedObjectsKey + '.');
    })
};

const getFormTableField = function (formTableFieldsCode, key) {
    return _.find(formTableFieldsCode, function (formTableFieldCode) {
        return key.startsWith(formTableFieldCode + '.');
    })
};

const getFormField = function (_formFields, _fieldCode) {
    var formField = null;
    _.each(_formFields, function (ff) {
        if (!formField) {
            if (ff.code === _fieldCode) {
                formField = ff;
            } else if (ff.type === 'section') {
                _.each(ff.fields, function (f) {
                    if (!formField) {
                        if (f.code === _fieldCode) {
                            formField = f;
                        }
                    }
                })
            } else if (ff.type === 'table') {
                _.each(ff.fields, function (f) {
                    if (!formField) {
                        if (f.code === _fieldCode) {
                            formField = f;
                        }
                    }
                })
            }
        }
    });
    return formField;
}

const getFileFieldValue = function (recordFieldId, fType) {
    var collection, files, query, value;
    if (_.isEmpty(recordFieldId)) {
        return;
    }
    if (fType === 'image') {
        collection = 'images';
    } else if (fType === 'file') {
        collection = 'files';
    }
    if (_.isString(recordFieldId)) {
        query = {
            _id: {
                $in: [recordFieldId]
            }
        };
    } else {
        query = {
            _id: {
                $in: recordFieldId
            }
        };
    }
    files = Creator.Collections["cfs." + collection + ".filerecord"].find(query);
    value = [];
    files.forEach(function (f) {
        var newFile;
        newFile = new FS.File();
        return newFile.attachData(f.createReadStream('files'), {
            type: f.original.type
        }, function (err) {
            var metadata;
            if (err) {
                throw new Meteor.Error(err.error, err.reason);
            }
            newFile.name(f.name());
            newFile.size(f.size());
            metadata = {
                owner: f.metadata.owner
            };
            newFile.metadata = metadata;
            newFile._id = Creator.Collections.instances._makeNewID();
            cfs[collection].insert(newFile);
            return value.push(newFile._id);
        });
    });
    if (value.length > 0) {
        if (_.isString(recordFieldId)) {
            return value[0];
        } else {
            return value;
        }
    }
};

const getRecordFieldValue = function (oField, wField, ofValue, wfValue, spaceId, enableAmisform) {
    if (enableAmisform && wField.steedos_field) {
        return wfValue
    }
    let value;
    var oFieldType = oField.data_type || oField.type;
    // 表单选人选组字段 至 对象 lookup master_detail类型字段同步
    if (['user', 'group'].includes(wField.type) && ['lookup', 'master_detail'].includes(oFieldType)
        && (['users', 'organizations'].includes(oField.reference_to) || ('space_users' == oField.reference_to && 'user' == oField.reference_to_field))) {
        if (!_.isEmpty(wfValue)) {
            if (oField.multiple && wField.is_multiselect) {
                value = _.compact(_.pluck(wfValue, 'id'))
            } else if (!oField.multiple && !wField.is_multiselect) {
                value = wfValue.id
            }
        }
    }
    else if (!oField.multiple && ['lookup', 'master_detail'].includes(oFieldType) && _.isString(oField.reference_to) && _.isString(wfValue)) {
        var oCollection = objectql.getObject(oField.reference_to)
        var referObjectNameFieldKey = getObjectNameFieldKey(oField.reference_to);
        if (oCollection && referObjectNameFieldKey) {
            // 先认为此值是referObject _id字段值
            let referToField = oField.reference_to_field || '_id'
            var referData = objectFindOne(oField.reference_to, { filters: [[referToField, '=', wfValue]], fields: [referToField] });
            if (referData) {
                value = referData[referToField];
            }

            // 其次认为此值是referObject NAME_FIELD_KEY值
            if (!referData) {
                var nameFieldKey = referObjectNameFieldKey;
                var referData = objectFindOne(oField.reference_to, { filters: [['space', '=', spaceId], [nameFieldKey, '=', wfValue]], fields: ['_id'] });
                if (referData) {
                    value = referData._id;
                }
            }

        }
    }
    else if (oFieldType === "boolean") {
        var tmp_field_value = wfValue;
        if (['true', '是'].includes(tmp_field_value)) {
            value = true;
        } else if (['false', '否'].includes(tmp_field_value)) {
            value = false;
        } else {
            value = tmp_field_value;
        }
    }
    else if (oFieldType === 'number' || oFieldType === 'currency' || oFieldType === 'percent') {
        if (typeof (Number(wfValue)) === 'number' && !isNaN(Number(wfValue))) {
            value = Number(wfValue);
        }
    }
    else if (['lookup', 'master_detail'].includes(oFieldType) && wField.type === 'odata') {
        let referToField = oField.reference_to_field || '_id'
        if (oField.multiple && wField.is_multiselect) {
            value = _.compact(_.pluck(wfValue, referToField))
        } else if (!oField.multiple && !wField.is_multiselect) {
            if (!_.isEmpty(wfValue)) {
                value = wfValue[referToField]
            }
        } else {
            value = wfValue;
        }
    } else if (oFieldType == 'image' && wField.type == 'image') {
        var ids = ofValue;
        if (_.isString(ids)) {
            ids = [ids];
        }
        if (ids) {
            var removeOldFiles = function (cb) {
                return cfs.images.remove({
                    '_id': { $in: ids }
                }, cb);
            };
            Meteor.wrapAsync(removeOldFiles)();
        }

        value = getFileFieldValue(wfValue, 'image')

    } else if (oFieldType == 'file' && wField.type == 'file') {
        var ids = ofValue;
        if (_.isString(ids)) {
            ids = [ids];
        }
        if (ids) {
            var removeOldFiles = function (cb) {
                return cfs.files.remove({
                    '_id': { $in: ids }
                }, cb);
            };
            Meteor.wrapAsync(removeOldFiles)();
        }
        value = getFileFieldValue(wfValue, 'file')
    } else if (['lookup', 'master_detail'].includes(oFieldType) && wField.type == 'lookup') {
        value = wfValue ? wfValue : null
    }
    // 日期、日期时间
    else if (oFieldType === 'date' || oFieldType === 'datetime' || oFieldType === 'time') {
        if (wfValue && _.isDate(new Date(wfValue))) {
            value = new Date(wfValue);
        }
    }
    else if (oField.multiple && oFieldType == 'select' && wField.type == 'multiSelect') {
        value = wfValue ? wfValue.split(',') : null;
    }
    else {
        value = wfValue;
    }
    return value;
};

const updateLookupOrMasterDetailFieldValues = function (field_map_back, values, ins, objectInfo, record) {
    var field_map_back = field_map_back || [];
    var objectFields = objectInfo.fields;

    field_map_back.forEach(function (fm) {
        if (values.hasOwnProperty(fm.workflow_field)) {
            if (fm.object_field.indexOf('.') > -1) {
                var temObjFields = fm.object_field.split('.');
                if (temObjFields.length === 2) {
                    var objField = temObjFields[0];
                    var referObjField = temObjFields[1];
                    var oField = objectFields[objField];
                    if (!oField.multiple && ['lookup', 'master_detail'].includes(oField.type) && _.isString(oField.reference_to)) {
                        var oCollection = objectql.getObject(oField.reference_to)
                        if (oCollection && record && record[objField]) {
                            var referSetObj = {};
                            referSetObj[referObjField] = values[fm.workflow_field];
                            objectUpdate(oField.reference_to, record[objField], referSetObj)
                        }
                    }
                }
            }
        } else if (fm.workflow_field.startsWith('instance.')) {
            var insField = fm.workflow_field.split('instance.')[1];
            if (InstanceRecordQueue.syncInsFields.includes(insField)) {
                if (fm.object_field.indexOf('.') > -1) {
                    var temObjFields = fm.object_field.split('.');
                    if (temObjFields.length === 2) {
                        var objField = temObjFields[0];
                        var referObjField = temObjFields[1];
                        var oField = objectFields[objField];
                        if (!oField.multiple && ['lookup', 'master_detail'].includes(oField.type) && _.isString(oField.reference_to)) {
                            var oCollection = objectql.getObject(oField.reference_to)
                            if (oCollection && record && record[objField]) {
                                var referSetObj = {};
                                referSetObj[referObjField] = ins[insField];
                                objectUpdate(oField.reference_to, record[objField], referSetObj)
                            }
                        }
                    }
                }
            }
        }
    })
}

/*
    options: {
        // Controls the sending interval
        sendInterval: Match.Optional(Number),
        // Controls the sending batch size per interval
        sendBatchSize: Match.Optional(Number),
        // Allow optional keeping notifications in collection
        keepDocs: Match.Optional(Boolean)
    }
*/
InstanceRecordQueue.Configure = function (options) {
    var self = this;
    options = _.extend({
        sendTimeout: 60000, // Timeout period
    }, options);

    // Block multiple calls
    if (isConfigured) {
        throw new Error('InstanceRecordQueue.Configure should not be called more than once!');
    }

    isConfigured = true;

    // Add debug info
    if (InstanceRecordQueue.debug) {
        console.log('InstanceRecordQueue.Configure', options);
    }



    // Universal send function
    var _querySend = function (doc) {

        if (InstanceRecordQueue.sendDoc) {
            InstanceRecordQueue.sendDoc(doc);
        }

        return {
            doc: [doc._id]
        };
    };

    self.serverSend = function (doc) {
        doc = doc || {};
        return _querySend(doc);
    };


    // This interval will allow only one doc to be sent at a time, it
    // will check for new docs at every `options.sendInterval`
    // (default interval is 15000 ms)
    //
    // It looks in docs collection to see if theres any pending
    // docs, if so it will try to reserve the pending doc.
    // If successfully reserved the send is started.
    //
    // If doc.query is type string, it's assumed to be a json string
    // version of the query selector. Making it able to carry `$` properties in
    // the mongo collection.
    //
    // Pr. default docs are removed from the collection after send have
    // completed. Setting `options.keepDocs` will update and keep the
    // doc eg. if needed for historical reasons.
    //
    // After the send have completed a "send" event will be emitted with a
    // status object containing doc id and the send result object.
    //
    var isSendingDoc = false;

    if (options.sendInterval !== null) {

        var sendDoc = function (doc) {
            // Reserve doc
            var now = +new Date();
            var timeoutAt = now + options.sendTimeout;
            var reserved = InstanceRecordQueue.collection.update({
                _id: doc._id,
                sent: false, // xxx: need to make sure this is set on create
                sending: {
                    $lt: now
                }
            }, {
                $set: {
                    sending: timeoutAt,
                }
            });

            // Make sure we only handle docs reserved by this
            // instance
            if (reserved) {

                // Send
                var result = self.serverSend(doc);

                if (!options.keepDocs) {
                    // Pr. Default we will remove docs
                    InstanceRecordQueue.collection.remove({
                        _id: doc._id
                    });
                } else {

                    // Update
                    InstanceRecordQueue.collection.update({
                        _id: doc._id
                    }, {
                        $set: {
                            // Mark as sent
                            sent: true,
                            // Set the sent date
                            sentAt: new Date(),
                            // Not being sent anymore
                            sending: 0
                        }
                    });

                }

                // // Emit the send
                // InstanceRecordQueue.emit('send', {
                // 	doc: doc._id,
                // 	result: result
                // });

            } // Else could not reserve
        }; // EO sendDoc

        sendWorker(function () {

            if (isSendingDoc) {
                return;
            }
            // Set send fence
            isSendingDoc = true;

            var batchSize = options.sendBatchSize || 1;

            var now = +new Date();

            // Find docs that are not being or already sent
            var pendingDocs = InstanceRecordQueue.collection.find({
                $and: [
                    // Message is not sent
                    {
                        sent: false
                    },
                    // And not being sent by other instances
                    {
                        sending: {
                            $lt: now
                        }
                    },
                    // And no error
                    {
                        errMsg: {
                            $exists: false
                        }
                    }
                ]
            }, {
                // Sort by created date
                sort: {
                    createdAt: 1
                },
                limit: batchSize
            });

            pendingDocs.forEach(function (doc) {
                try {
                    sendDoc(doc);
                } catch (error) {
                    console.error(error.stack);
                    console.log('InstanceRecordQueue: Could not send doc id: "' + doc._id + '", Error: ' + error.message);
                    InstanceRecordQueue.collection.update({
                        _id: doc._id
                    }, {
                        $set: {
                            // error message
                            errMsg: error.message
                        }
                    });
                }
            }); // EO forEach

            // Remove the send fence
            isSendingDoc = false;
        }, options.sendInterval || 15000); // Default every 15th sec

    } else {
        if (InstanceRecordQueue.debug) {
            console.log('InstanceRecordQueue: Send server is disabled');
        }
    }

};

InstanceRecordQueue.syncAttach = function (sync_attachment, insId, spaceId, newRecordId, objectName) {
    if (sync_attachment == "lastest") {
        cfs.instances.find({
            'metadata.instance': insId,
            'metadata.current': true
        }).forEach(function (f) {
            if (!f.hasStored('instances')) {
                console.error('syncAttach-file not stored: ', f._id);
                return;
            }
            var newFile = new FS.File(),
                cmsFileId = Creator.getCollection('cms_files')._makeNewID();
            newFile.attachData(f.createReadStream('instances'), {
                type: f.original.type
            }, function (err) {
                if (err) {
                    throw new Meteor.Error(err.error, err.reason);
                }
                newFile.name(f.name());
                newFile.size(f.size());
                var metadata = {
                    owner: f.metadata.owner,
                    owner_name: f.metadata.owner_name,
                    space: spaceId,
                    record_id: newRecordId,
                    object_name: objectName,
                    parent: cmsFileId
                };

                newFile.metadata = metadata;
                cfs.files.insert(newFile);
            });
            Meteor.wrapAsync(function (newFile, Creator, cmsFileId, objectName, newRecordId, spaceId, f, cb) {
                newFile.once('stored', function (storeName) {
                    Creator.getCollection('cms_files').insert({
                        _id: cmsFileId,
                        parent: {
                            o: objectName,
                            ids: [newRecordId]
                        },
                        size: newFile.size(),
                        name: newFile.name(),
                        extention: newFile.extension(),
                        space: spaceId,
                        versions: [newFile._id],
                        owner: f.metadata.owner,
                        created_by: f.metadata.owner,
                        modified_by: f.metadata.owner
                    });

                    cb(null);
                });
                newFile.once('error', function (error) {
                    console.error('syncAttach-error: ', error);
                    cb(error);
                });
            })(newFile, Creator, cmsFileId, objectName, newRecordId, spaceId, f);
        })
    } else if (sync_attachment == "all") {
        var parents = [];
        cfs.instances.find({
            'metadata.instance': insId
        }).forEach(function (f) {
            if (!f.hasStored('instances')) {
                console.error('syncAttach-file not stored: ', f._id);
                return;
            }
            var newFile = new FS.File(),
                cmsFileId = f.metadata.parent;

            if (!parents.includes(cmsFileId)) {
                parents.push(cmsFileId);
                Creator.getCollection('cms_files').insert({
                    _id: cmsFileId,
                    parent: {
                        o: objectName,
                        ids: [newRecordId]
                    },
                    space: spaceId,
                    versions: [],
                    owner: f.metadata.owner,
                    created_by: f.metadata.owner,
                    modified_by: f.metadata.owner
                })
            }

            newFile.attachData(f.createReadStream('instances'), {
                type: f.original.type
            }, function (err) {
                if (err) {
                    throw new Meteor.Error(err.error, err.reason);
                }
                newFile.name(f.name());
                newFile.size(f.size());
                var metadata = {
                    owner: f.metadata.owner,
                    owner_name: f.metadata.owner_name,
                    space: spaceId,
                    record_id: newRecordId,
                    object_name: objectName,
                    parent: cmsFileId
                };

                newFile.metadata = metadata;
                cfs.files.insert(newFile);
            });
            Meteor.wrapAsync(function (newFile, Creator, cmsFileId, f, cb) {
                newFile.once('stored', function (storeName) {
                    if (f.metadata.current == true) {
                        Creator.getCollection('cms_files').update(cmsFileId, {
                            $set: {
                                size: newFile.size(),
                                name: newFile.name(),
                                extention: newFile.extension(),
                            },
                            $addToSet: {
                                versions: newFile._id
                            }
                        });
                    } else {
                        Creator.getCollection('cms_files').update(cmsFileId, {
                            $addToSet: {
                                versions: newFile._id
                            },
                            $set: {
                                modified: new Date()
                            }
                        });
                    }

                    cb(null);
                });
                newFile.once('error', function (error) {
                    console.error('syncAttach-error: ', error);
                    cb(error);
                });
            })(newFile, Creator, cmsFileId, f);
        })
    }
}

InstanceRecordQueue.syncInsFields = ['name', 'submitter_name', 'applicant_name', 'applicant_organization_name', 'applicant_organization_fullname', 'state',
    'current_step_name', 'flow_name', 'category_name', 'submit_date', 'finish_date', 'final_decision', 'applicant_organization', 'applicant_company'
];
InstanceRecordQueue.syncValues = function (field_map_back, values, ins, objectInfo, field_map_back_script, record, enableAmisform) {
    var
        obj = {},
        tableFieldCodes = [],
        tableFieldMap = [],
        tableToRelatedMap = {};

    field_map_back = field_map_back || [];

    var spaceId = ins.space;

    var form = Creator.getCollection("forms").findOne(ins.form);
    var formFields = null;
    if (form.current._id === ins.form_version) {
        formFields = form.current.fields || [];
    } else {
        var formVersion = _.find(form.historys, function (h) {
            return h._id === ins.form_version;
        })
        formFields = formVersion ? formVersion.fields : [];
    }

    var objectFields = objectInfo.fields;
    var objectFieldKeys = _.keys(objectFields);
    var relatedObjects = getRelateds(objectInfo.name);
    var relatedObjectsKeys = _.pluck(relatedObjects, 'object_name');
    var formTableFields = _.filter(formFields, function (formField) {
        return formField.type === 'table'
    });
    var formTableFieldsCode = _.pluck(formTableFields, 'code');

    field_map_back.forEach(function (fm) {
        //workflow 的子表到creator object 的相关对象
        var relatedObjectField = getRelatedObjectField(relatedObjectsKeys, fm.object_field);
        var formTableField = getFormTableField(formTableFieldsCode, fm.workflow_field);
        if (relatedObjectField) {
            var oTableCode = fm.object_field.split('.')[0];
            var oTableFieldCode = fm.object_field.split('.')[1];
            var tableToRelatedMapKey = oTableCode;
            if (!tableToRelatedMap[tableToRelatedMapKey]) {
                tableToRelatedMap[tableToRelatedMapKey] = {}
            }

            if (formTableField) {
                var wTableCode = fm.workflow_field.split('.')[0];
                tableToRelatedMap[tableToRelatedMapKey]['_FROM_TABLE_CODE'] = wTableCode
            }

            tableToRelatedMap[tableToRelatedMapKey][oTableFieldCode] = fm.workflow_field
        }
        // 判断是否是子表字段
        else if (fm.workflow_field.indexOf('.$.') > 0 && fm.object_field.indexOf('.$.') > 0) {
            var wTableCode = fm.workflow_field.split('.$.')[0];
            var oTableCode = fm.object_field.split('.$.')[0];
            if (values.hasOwnProperty(wTableCode) && _.isArray(values[wTableCode])) {
                tableFieldCodes.push(JSON.stringify({
                    workflow_table_field_code: wTableCode,
                    object_table_field_code: oTableCode
                }));
                tableFieldMap.push(fm);
            }

        }
        else if (values.hasOwnProperty(fm.workflow_field)) {
            var wField = null;

            _.each(formFields, function (ff) {
                if (!wField) {
                    if (ff.code === fm.workflow_field) {
                        wField = ff;
                    } else if (ff.type === 'section') {
                        _.each(ff.fields, function (f) {
                            if (!wField) {
                                if (f.code === fm.workflow_field) {
                                    wField = f;
                                }
                            }
                        })
                    }
                }
            })

            var oField = objectFields[fm.object_field];

            if (oField) {
                if (!wField) {
                    console.log('fm.workflow_field: ', fm.workflow_field)
                }
                const ofValue = record ? record[fm.object_field] : null
                const wfValue = values[fm.workflow_field]
                obj[fm.object_field] = getRecordFieldValue(oField, wField, ofValue, wfValue, spaceId, enableAmisform)
            } else {
                if (fm.object_field.indexOf('.') > -1) {
                    var temObjFields = fm.object_field.split('.');
                    if (temObjFields.length === 2) {
                        var objField = temObjFields[0];
                        var referObjField = temObjFields[1];
                        var oField = objectFields[objField];
                        if (!oField.multiple && ['lookup', 'master_detail'].includes(oField.type) && _.isString(oField.reference_to)) {
                            // var oCollection = Creator.getCollection(oField.reference_to, spaceId)
                            var oCollection = objectql.getObject(oField.reference_to)
                            if (oCollection && record && record[objField]) {
                                var referSetObj = {};
                                referSetObj[referObjField] = values[fm.workflow_field];
                                objectUpdate(oField.reference_to, record[objField], referSetObj)
                            }
                        }
                    }
                }

            }

        }
        else {
            if (fm.workflow_field.startsWith('instance.')) {
                var insField = fm.workflow_field.split('instance.')[1];
                if (InstanceRecordQueue.syncInsFields.includes(insField)) {
                    if (fm.object_field.indexOf('.') < 0) {
                        obj[fm.object_field] = ins[insField];
                    } else {
                        var temObjFields = fm.object_field.split('.');
                        if (temObjFields.length === 2) {
                            var objField = temObjFields[0];
                            var referObjField = temObjFields[1];
                            var oField = objectFields[objField];
                            if (!oField.multiple && ['lookup', 'master_detail'].includes(oField.type) && _.isString(oField.reference_to)) {
                                var oCollection = objectql.getObject(oField.reference_to)
                                if (oCollection && record && record[objField]) {
                                    var referSetObj = {};
                                    referSetObj[referObjField] = ins[insField];
                                    objectUpdate(oField.reference_to, record[objField], referSetObj)
                                }
                            }
                        }
                    }
                }

            } else {
                if (ins[fm.workflow_field]) {
                    obj[fm.object_field] = ins[fm.workflow_field];
                }
            }
        }
    })

    _.uniq(tableFieldCodes).forEach(function (tfc) {
        var c = JSON.parse(tfc);
        obj[c.object_table_field_code] = [];
        values[c.workflow_table_field_code].forEach(function (tr) {
            var newTr = {};
            _.each(tr, function (v, k) {
                tableFieldMap.forEach(function (tfm) {
                    if (tfm.workflow_field == (c.workflow_table_field_code + '.$.' + k)) {
                        var oTdCode = tfm.object_field.split('.$.')[1];
                        newTr[oTdCode] = v;
                    }
                })
            })
            if (!_.isEmpty(newTr)) {
                obj[c.object_table_field_code].push(newTr);
            }
        })
    });
    var relatedObjs = {};
    var getRelatedFieldValue = function (valueKey, parent) {
        return valueKey.split('.').reduce(function (o, x) {
            return o[x];
        }, parent);
    };
    _.each(tableToRelatedMap, function (map, key) {
        var tableCode = map._FROM_TABLE_CODE;
        if (!tableCode) {
            console.warn('tableToRelated: [' + key + '] missing corresponding table.')
        } else {
            var relatedObjectName = key;
            var relatedObjectValues = [];
            var relatedObjectFields = getObjectFields(relatedObjectName)
            _.each(values[tableCode], function (tableValueItem) {
                let relateRecord;
                if (tableValueItem._id) {
                    relateRecord = objectFindOne(relatedObjectName, { filters: [['_id', '=', tableValueItem._id]] });
                }
                var relatedObjectValue = {};
                _.each(map, function (valueKey, fieldKey) {
                    if (fieldKey != '_FROM_TABLE_CODE') {
                        if (valueKey.startsWith('instance.')) {
                            relatedObjectValue[fieldKey] = getRelatedFieldValue(valueKey, { 'instance': ins });
                        }
                        else {
                            var relatedObjectFieldValue, formFieldKey;
                            if (valueKey.startsWith(tableCode + '.')) {
                                formFieldKey = valueKey.split(".")[1];
                                relatedObjectFieldValue = getRelatedFieldValue(valueKey, { [tableCode]: tableValueItem });
                            } else {
                                formFieldKey = valueKey;
                                relatedObjectFieldValue = getRelatedFieldValue(valueKey, values)
                            }
                            var formField = getFormField(formFields, formFieldKey);
                            var relatedObjectField = relatedObjectFields[fieldKey];
                            if (!relatedObjectField || !formField) {
                                return
                            }
                            const ofValue = relateRecord ? relateRecord[fieldKey] : null;
                            relatedObjectValue[fieldKey] = getRecordFieldValue(relatedObjectField, formField, ofValue, relatedObjectFieldValue, spaceId, enableAmisform);
                        }
                    }
                });
                relatedObjectValue['_table'] = {
                    _id: tableValueItem["_id"],
                    _code: tableCode
                };
                relatedObjectValues.push(relatedObjectValue);
            });
            relatedObjs[relatedObjectName] = relatedObjectValues;
        }
    })

    if (field_map_back_script) {
        _.extend(obj, InstanceRecordQueue.evalFieldMapBackScript(field_map_back_script, ins));
    }
    // 过滤掉非法的key
    var filterObj = {};

    _.each(_.keys(obj), function (k) {
        if (objectFieldKeys.includes(k)) {
            filterObj[k] = obj[k];
        }
        // else if(relatedObjectsKeys.includes(k) && _.isArray(obj[k])){
        // 	if(_.isArray(relatedObjs[k])){
        // 		relatedObjs[k] = relatedObjs[k].concat(obj[k])
        // 	}else{
        // 		relatedObjs[k] = obj[k]
        // 	}
        // }
    })
    return {
        mainObjectValue: filterObj,
        relatedObjectsValue: relatedObjs
    };
}

InstanceRecordQueue.evalFieldMapBackScript = function (field_map_back_script, ins) {
    var script = "module.exports = function (instance) { " + field_map_back_script + " }";
    var func = _eval(script, "field_map_script");
    var values = func(ins);
    if (_.isObject(values)) {
        return values;
    } else {
        console.error("evalFieldMapBackScript: 脚本返回值类型不是对象");
    }
    return {}
}

InstanceRecordQueue.syncRelatedObjectsValue = function (mainRecordId, relatedObjects, relatedObjectsValue, spaceId, ins, locked = false) {
    var insId = ins._id;

    _.each(relatedObjects, function (relatedObject) {
        // var objectCollection = Creator.getCollection(relatedObject.object_name, spaceId);
        var tableMap = {};
        _.each(relatedObjectsValue[relatedObject.object_name], function (relatedObjectValue) {
            var table_id = relatedObjectValue._table._id;
            var table_code = relatedObjectValue._table._code;
            if (!tableMap[table_code]) {
                tableMap[table_code] = []
            };
            tableMap[table_code].push(table_id);
            var oldRelatedRecord = objectFindOne(relatedObject.object_name, {
                filters: [[relatedObject.foreign_key, '=', mainRecordId], [['_id', '=', relatedObjectValue._table._id], 'or', [['_table._id', '=', relatedObjectValue._table._id], ['_table._code', '=', relatedObjectValue._table._code]]]]
            })
            if (oldRelatedRecord) {
                objectUpdate(relatedObject.object_name, oldRelatedRecord._id, relatedObjectValue)
                // Creator.getCollection(relatedObject.object_name, spaceId).update({ _id: oldRelatedRecord._id }, { $set: relatedObjectValue })
            } else {
                relatedObjectValue[relatedObject.foreign_key] = mainRecordId;
                relatedObjectValue.space = spaceId;
                relatedObjectValue.owner = relatedObjectValue.owner || ins.applicant;
                relatedObjectValue.created_by = ins.applicant;
                relatedObjectValue.modified_by = ins.applicant;
                // relatedObjectValue._id = objectCollection._makeNewID();
                relatedObjectValue._id = makeNewID(relatedObject.object_name);
                // var instance_state = ins.state;
                // if (ins.state === 'completed' && ins.final_decision) {
                //     instance_state = ins.final_decision;
                // }
                // relatedObjectValue.instances = [{
                //     _id: insId,
                //     state: instance_state
                // }];
                // relatedObjectValue.instance_state = instance_state;
                relatedObjectValue.locked = locked
                if (Creator.Objects[relatedObject.object_name]) {
                    Creator.getCollection(relatedObject.object_name, spaceId).insert(relatedObjectValue, { validate: false, filter: false })
                } else {
                    objectInsert(relatedObject.object_name, relatedObjectValue)
                }
            }
        })
        //清理申请单上被删除子表记录对应的相关表记录
        _.each(tableMap, function (tableIds, tableCode) {
            tableIds = _.compact(tableIds);
            // objectCollection.remove({
            //     [relatedObject.foreign_key]: mainRecordId,
            //     // "instances._id": insId,
            //     "_table._code": tableCode,
            //     "_table._id": { $nin: tableIds }
            // })
            var docsForRemove = objectFind(relatedObject.object_name, { filters: [[relatedObject.foreign_key, '=', mainRecordId], ['_table._code', '=', tableCode]] });
            for (const doc of docsForRemove) {
                if (!tableIds.includes(doc._table._id)) {
                    objectRemove(relatedObject.object_name, doc._id)
                }
            }
        })
    });

}

InstanceRecordQueue.sendDoc = function (doc) {
    if (InstanceRecordQueue.debug) {
        console.log("sendDoc");
        console.log(doc);
    }

    var insId = doc.info.instance_id,
        records = doc.info.records;
    var fields = {
        flow: 1,
        values: 1,
        applicant: 1,
        space: 1,
        form: 1,
        form_version: 1,
        traces: 1
    };
    InstanceRecordQueue.syncInsFields.forEach(function (f) {
        fields[f] = 1;
    })
    var ins = Creator.getCollection('instances').findOne(insId, {
        fields: fields
    });
    var values = ins.values,
        spaceId = ins.space;

    const flowId = ins.flow
    const flow = Creator.getCollection('flows').findOne(flowId, { fields: { enable_amisform: 1 } });
    const enableAmisform = flow.enable_amisform

    if (records && !_.isEmpty(records)) {
        // 此情况属于从creator中发起审批，或者已经从Apps同步到了creator
        var objectName = records[0].o;
        var ow = Creator.getCollection('object_workflows').findOne({
            object_name: objectName,
            flow_id: ins.flow
        });
        var
            // objectCollection = Creator.getCollection(objectName, spaceId),
            objectCollection = objectql.getObject(objectName),
            sync_attachment = ow.sync_attachment;
        syncDirection = ow.sync_direction || 'both';
        var objectInfo = getObjectConfig(objectName);
        // objectCollection.find({
        //     _id: {
        //         $in: records[0].ids
        //     }
        // })
        objectFind(objectName, { filters: [['_id', 'in', records[0].ids]] }).forEach(function (record) {
            try {
                if (!['both', 'ins_to_obj'].includes(syncDirection)) {
                    return;
                }
                var lock_record_after_approval = ow.lock_record_after_approval || false;
                var syncValues = InstanceRecordQueue.syncValues(ow.field_map_back, values, ins, objectInfo, ow.field_map_back_script, record, enableAmisform)
                var setObj = syncValues.mainObjectValue;

                var instance_state = ins.state;
                if (ins.state === 'completed') {
                    setObj.locked = lock_record_after_approval
                    if (ins.final_decision) {
                        instance_state = ins.final_decision;
                    }
                }
                setObj['instances.0.state'] = setObj.instance_state = instance_state;
                // objectUpdateMany(objectName, [['_id', '=', record._id], ['instances._id', '=', insId]], setObj)
                objectUpdate(objectName, record._id, setObj);
                // objectCollection.update({
                //     _id: record._id,
                //     'instances._id': insId
                // }, {
                //     $set: setObj
                // })

                var relatedObjects = getRelateds(ow.object_name);
                var relatedObjectsValue = syncValues.relatedObjectsValue;
                InstanceRecordQueue.syncRelatedObjectsValue(record._id, relatedObjects, relatedObjectsValue, spaceId, ins);


                // 以最终申请单附件为准，旧的record中附件删除
                Creator.getCollection('cms_files').remove({
                    'parent': {
                        o: objectName,
                        ids: [record._id]
                    }
                })
                var removeOldFiles = function (cb) {
                    return cfs.files.remove({
                        'metadata.record_id': record._id
                    }, cb);
                };
                Meteor.wrapAsync(removeOldFiles)();
                // 同步新附件
                InstanceRecordQueue.syncAttach(sync_attachment, insId, record.space, record._id, objectName);

                // 执行公式
                runQuoted(objectName, record._id);
            } catch (error) {
                console.error(error.stack);

                objectUpdateMany(objectName, [['_id', '=', record._id], ['instances._id', '=', insId]], {
                    'instances.$.state': 'pending',
                    'instance_state': 'pending'
                })
                // objectCollection.update({
                //     _id: record._id,
                //     'instances._id': insId
                // }, {
                //     $set: {
                //         'instances.$.state': 'pending',
                //         'instance_state': 'pending'
                //     }
                // })

                Creator.getCollection('cms_files').remove({
                    'parent': {
                        o: objectName,
                        ids: [record._id]
                    }
                })
                cfs.files.remove({
                    'metadata.record_id': record._id
                })

                throw new Error(error);
            }

        })
    } else {
        // 此情况属于从apps中发起审批
        Creator.getCollection('object_workflows').find({
            flow_id: ins.flow
        }).forEach(function (ow) {
            try {
                var
                    // objectCollection = Creator.getCollection(ow.object_name, spaceId),
                    sync_attachment = ow.sync_attachment,
                    newRecordId = makeNewID(ow.object_name),
                    objectName = ow.object_name,
                    syncDirection = ow.sync_direction || 'both';
                lock_record_after_approval = ow.lock_record_after_approval || false;

                if (!['both', 'ins_to_obj'].includes(syncDirection)) {
                    return;
                }

                var objectInfo = getObjectConfig(ow.object_name);
                var syncValues = InstanceRecordQueue.syncValues(ow.field_map_back, values, ins, objectInfo, ow.field_map_back_script, null, enableAmisform);
                var newObj = syncValues.mainObjectValue;

                newObj._id = newRecordId;
                newObj.space = spaceId;
                newObj.name = newObj.name || ins.name;

                newObj.locked = true;

                var instance_state = ins.state;
                if (ins.state === 'completed' && ins.final_decision) {
                    instance_state = ins.final_decision;
                    newObj.locked = lock_record_after_approval;
                }
                newObj.instances = [{
                    _id: insId,
                    state: instance_state
                }];
                newObj.instance_state = instance_state;

                newObj.owner = newObj.owner || ins.applicant;
                newObj.created_by = ins.applicant;
                newObj.modified_by = ins.applicant;
                // var r = objectCollection.insert(newObj);
                var r = objectInsert(ow.object_name, newObj);
                if (r) {
                    Creator.getCollection('instances').update(ins._id, {
                        $push: {
                            record_ids: {
                                o: objectName,
                                ids: [newRecordId]
                            }
                        },
                        $set: {
                            modified: new Date()
                        }
                    })
                    var relatedObjects = getRelateds(ow.object_name);
                    var relatedObjectsValue = syncValues.relatedObjectsValue;
                    InstanceRecordQueue.syncRelatedObjectsValue(newRecordId, relatedObjects, relatedObjectsValue, spaceId, ins, newObj.locked);
                    // workflow里发起审批后，同步时也可以修改相关表的字段值 #1183
                    var record = objectFindOne(objectName, { filters: [['_id', '=', newRecordId]] });
                    updateLookupOrMasterDetailFieldValues(ow.field_map_back, values, ins, objectInfo, record)
                }

                // 附件同步
                InstanceRecordQueue.syncAttach(sync_attachment, insId, spaceId, newRecordId, objectName);

                // 执行公式
                runQuoted(objectName, newRecordId);
            } catch (error) {
                console.error(error.stack);

                // objectCollection.remove({
                //     _id: newRecordId,
                //     space: spaceId
                // });
                objectRemove(ow.object_name, newRecordId);

                Creator.getCollection('instances').update(ins._id, {
                    $pull: {
                        record_ids: {
                            o: objectName,
                            ids: [newRecordId]
                        }
                    },
                    $set: {
                        modified: new Date()
                    }
                })
                Creator.getCollection('cms_files').remove({
                    'parent': {
                        o: objectName,
                        ids: [newRecordId]
                    }
                })
                cfs.files.remove({
                    'metadata.record_id': newRecordId
                })

                throw new Error(error);
            }

        })
    }

    if (doc._id) {
        InstanceRecordQueue.collection.update(doc._id, {
            $set: {
                'info.sync_date': new Date()
            }
        })
    }

}