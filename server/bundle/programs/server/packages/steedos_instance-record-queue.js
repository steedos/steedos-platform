(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var EventState = Package['raix:eventstate'].EventState;
var check = Package.check.check;
var Match = Package.check.Match;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var _ = Package.underscore._;
var ECMAScript = Package.ecmascript.ECMAScript;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var meteorInstall = Package.modules.meteorInstall;

/* Package-scope variables */
var InstanceRecordQueue, tableIds, __coffeescriptShare;

var require = meteorInstall({"node_modules":{"meteor":{"steedos:instance-record-queue":{"lib":{"common":{"main.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/steedos_instance-record-queue/lib/common/main.js                                                      //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
InstanceRecordQueue = new EventState();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"docs.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/steedos_instance-record-queue/lib/common/docs.js                                                      //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
InstanceRecordQueue.collection = db.instance_record_queue = new Mongo.Collection('instance_record_queue');

var _validateDocument = function (doc) {
  check(doc, {
    info: Object,
    sent: Match.Optional(Boolean),
    sending: Match.Optional(Match.Integer),
    createdAt: Date,
    createdBy: Match.OneOf(String, null)
  });
};

InstanceRecordQueue.send = function (options) {
  var currentUser = Meteor.isClient && Meteor.userId && Meteor.userId() || Meteor.isServer && (options.createdBy || '<SERVER>') || null;

  var doc = _.extend({
    createdAt: new Date(),
    createdBy: currentUser
  });

  if (Match.test(options, Object)) {
    doc.info = _.pick(options, 'instance_id', 'records', 'sync_date', 'instance_finish_date', 'step_name');
  }

  doc.sent = false;
  doc.sending = 0;

  _validateDocument(doc);

  return InstanceRecordQueue.collection.insert(doc);
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"server":{"api.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/steedos_instance-record-queue/lib/server/api.js                                                       //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
var _eval = require('eval');

var isConfigured = false;

var sendWorker = function (task, interval) {
  if (InstanceRecordQueue.debug) {
    console.log('InstanceRecordQueue: Send worker started, using interval: ' + interval);
  }

  return Meteor.setInterval(function () {
    try {
      task();
    } catch (error) {
      console.log('InstanceRecordQueue: Error while sending: ' + error.message);
    }
  }, interval);
};
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
    sendTimeout: 60000 // Timeout period

  }, options); // Block multiple calls

  if (isConfigured) {
    throw new Error('InstanceRecordQueue.Configure should not be called more than once!');
  }

  isConfigured = true; // Add debug info

  if (InstanceRecordQueue.debug) {
    console.log('InstanceRecordQueue.Configure', options);
  }

  self.syncAttach = function (sync_attachment, insId, spaceId, newRecordId, objectName) {
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
      });
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
          });
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
                  extention: newFile.extension()
                },
                $addToSet: {
                  versions: newFile._id
                }
              });
            } else {
              Creator.getCollection('cms_files').update(cmsFileId, {
                $addToSet: {
                  versions: newFile._id
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
      });
    }
  };

  self.syncInsFields = ['name', 'submitter_name', 'applicant_name', 'applicant_organization_name', 'applicant_organization_fullname', 'state', 'current_step_name', 'flow_name', 'category_name', 'submit_date', 'finish_date', 'final_decision', 'applicant_organization', 'applicant_company'];

  self.syncValues = function (field_map_back, values, ins, objectInfo, field_map_back_script, record) {
    var obj = {},
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
      });

      formFields = formVersion ? formVersion.fields : [];
    }

    var objectFields = objectInfo.fields;

    var objectFieldKeys = _.keys(objectFields);

    var relatedObjects = Creator.getRelatedObjects(objectInfo.name, spaceId);

    var relatedObjectsKeys = _.pluck(relatedObjects, 'object_name');

    var formTableFields = _.filter(formFields, function (formField) {
      return formField.type === 'table';
    });

    var formTableFieldsCode = _.pluck(formTableFields, 'code');

    var getRelatedObjectField = function (key) {
      return _.find(relatedObjectsKeys, function (relatedObjectsKey) {
        return key.startsWith(relatedObjectsKey + '.');
      });
    };

    var getFormTableField = function (key) {
      return _.find(formTableFieldsCode, function (formTableFieldCode) {
        return key.startsWith(formTableFieldCode + '.');
      });
    };

    var getFormField = function (_formFields, _fieldCode) {
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
            });
          } else if (ff.type === 'table') {
            _.each(ff.fields, function (f) {
              if (!formField) {
                if (f.code === _fieldCode) {
                  formField = f;
                }
              }
            });
          }
        }
      });

      return formField;
    };

    field_map_back.forEach(function (fm) {
      //workflow 的子表到creator object 的相关对象
      var relatedObjectField = getRelatedObjectField(fm.object_field);
      var formTableField = getFormTableField(fm.workflow_field);

      if (relatedObjectField) {
        var oTableCode = fm.object_field.split('.')[0];
        var oTableFieldCode = fm.object_field.split('.')[1];
        var tableToRelatedMapKey = oTableCode;

        if (!tableToRelatedMap[tableToRelatedMapKey]) {
          tableToRelatedMap[tableToRelatedMapKey] = {};
        }

        if (formTableField) {
          var wTableCode = fm.workflow_field.split('.')[0];
          tableToRelatedMap[tableToRelatedMapKey]['_FROM_TABLE_CODE'] = wTableCode;
        }

        tableToRelatedMap[tableToRelatedMapKey][oTableFieldCode] = fm.workflow_field;
      } // 判断是否是子表字段
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
        } else if (values.hasOwnProperty(fm.workflow_field)) {
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
                });
              }
            }
          });

          var oField = objectFields[fm.object_field];

          if (oField) {
            if (!wField) {
              console.log('fm.workflow_field: ', fm.workflow_field);
            } // 表单选人选组字段 至 对象 lookup master_detail类型字段同步


            if (['user', 'group'].includes(wField.type) && ['lookup', 'master_detail'].includes(oField.type) && ['users', 'organizations'].includes(oField.reference_to)) {
              if (!_.isEmpty(values[fm.workflow_field])) {
                if (oField.multiple && wField.is_multiselect) {
                  obj[fm.object_field] = _.compact(_.pluck(values[fm.workflow_field], 'id'));
                } else if (!oField.multiple && !wField.is_multiselect) {
                  obj[fm.object_field] = values[fm.workflow_field].id;
                }
              }
            } else if (!oField.multiple && ['lookup', 'master_detail'].includes(oField.type) && _.isString(oField.reference_to) && _.isString(values[fm.workflow_field])) {
              var oCollection = Creator.getCollection(oField.reference_to, spaceId);
              var referObject = Creator.getObject(oField.reference_to, spaceId);

              if (oCollection && referObject) {
                // 先认为此值是referObject _id字段值
                var referData = oCollection.findOne(values[fm.workflow_field], {
                  fields: {
                    _id: 1
                  }
                });

                if (referData) {
                  obj[fm.object_field] = referData._id;
                } // 其次认为此值是referObject NAME_FIELD_KEY值


                if (!referData) {
                  var nameFieldKey = referObject.NAME_FIELD_KEY;
                  var selector = {};
                  selector[nameFieldKey] = values[fm.workflow_field];
                  referData = oCollection.findOne(selector, {
                    fields: {
                      _id: 1
                    }
                  });

                  if (referData) {
                    obj[fm.object_field] = referData._id;
                  }
                }
              }
            } else {
              if (oField.type === "boolean") {
                var tmp_field_value = values[fm.workflow_field];

                if (['true', '是'].includes(tmp_field_value)) {
                  obj[fm.object_field] = true;
                } else if (['false', '否'].includes(tmp_field_value)) {
                  obj[fm.object_field] = false;
                } else {
                  obj[fm.object_field] = tmp_field_value;
                }
              } else if (['lookup', 'master_detail'].includes(oField.type) && wField.type === 'odata') {
                if (oField.multiple && wField.is_multiselect) {
                  obj[fm.object_field] = _.compact(_.pluck(values[fm.workflow_field], '_id'));
                } else if (!oField.multiple && !wField.is_multiselect) {
                  if (!_.isEmpty(values[fm.workflow_field])) {
                    obj[fm.object_field] = values[fm.workflow_field]._id;
                  }
                } else {
                  obj[fm.object_field] = values[fm.workflow_field];
                }
              } else {
                obj[fm.object_field] = values[fm.workflow_field];
              }
            }
          } else {
            if (fm.object_field.indexOf('.') > -1) {
              var temObjFields = fm.object_field.split('.');

              if (temObjFields.length === 2) {
                var objField = temObjFields[0];
                var referObjField = temObjFields[1];
                var oField = objectFields[objField];

                if (!oField.multiple && ['lookup', 'master_detail'].includes(oField.type) && _.isString(oField.reference_to)) {
                  var oCollection = Creator.getCollection(oField.reference_to, spaceId);

                  if (oCollection && record && record[objField]) {
                    var referSetObj = {};
                    referSetObj[referObjField] = values[fm.workflow_field];
                    oCollection.update(record[objField], {
                      $set: referSetObj
                    });
                  }
                }
              }
            } // else{
            // 	var relatedObject = _.find(relatedObjects, function(_relatedObject){
            // 		return _relatedObject.object_name === fm.object_field
            // 	})
            //
            // 	if(relatedObject){
            // 		obj[fm.object_field] = values[fm.workflow_field];
            // 	}
            // }

          }
        } else {
          if (fm.workflow_field.startsWith('instance.')) {
            var insField = fm.workflow_field.split('instance.')[1];

            if (self.syncInsFields.includes(insField)) {
              if (fm.object_field.indexOf('.') < 0) {
                obj[fm.object_field] = ins[insField];
              } else {
                var temObjFields = fm.object_field.split('.');

                if (temObjFields.length === 2) {
                  var objField = temObjFields[0];
                  var referObjField = temObjFields[1];
                  var oField = objectFields[objField];

                  if (!oField.multiple && ['lookup', 'master_detail'].includes(oField.type) && _.isString(oField.reference_to)) {
                    var oCollection = Creator.getCollection(oField.reference_to, spaceId);

                    if (oCollection && record && record[objField]) {
                      var referSetObj = {};
                      referSetObj[referObjField] = ins[insField];
                      oCollection.update(record[objField], {
                        $set: referSetObj
                      });
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
    });

    _.uniq(tableFieldCodes).forEach(function (tfc) {
      var c = JSON.parse(tfc);
      obj[c.object_table_field_code] = [];
      values[c.workflow_table_field_code].forEach(function (tr) {
        var newTr = {};

        _.each(tr, function (v, k) {
          tableFieldMap.forEach(function (tfm) {
            if (tfm.workflow_field == c.workflow_table_field_code + '.$.' + k) {
              var oTdCode = tfm.object_field.split('.$.')[1];
              newTr[oTdCode] = v;
            }
          });
        });

        if (!_.isEmpty(newTr)) {
          obj[c.object_table_field_code].push(newTr);
        }
      });
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
        console.warn('tableToRelated: [' + key + '] missing corresponding table.');
      } else {
        var relatedObjectName = key;
        var relatedObjectValues = [];
        var relatedObject = Creator.getObject(relatedObjectName, spaceId);

        _.each(values[tableCode], function (tableValueItem) {
          var relatedObjectValue = {};

          _.each(map, function (valueKey, fieldKey) {
            if (fieldKey != '_FROM_TABLE_CODE') {
              if (valueKey.startsWith('instance.')) {
                relatedObjectValue[fieldKey] = getRelatedFieldValue(valueKey, {
                  'instance': ins
                });
              } else {
                var relatedObjectFieldValue, formFieldKey;

                if (valueKey.startsWith(tableCode + '.')) {
                  formFieldKey = valueKey.split(".")[1];
                  relatedObjectFieldValue = getRelatedFieldValue(valueKey, {
                    [tableCode]: tableValueItem
                  });
                } else {
                  formFieldKey = valueKey;
                  relatedObjectFieldValue = getRelatedFieldValue(valueKey, values);
                }

                var formField = getFormField(formFields, formFieldKey);
                var relatedObjectField = relatedObject.fields[fieldKey];

                if (!relatedObjectField || !formField) {
                  return;
                }

                if (formField.type == 'odata' && ['lookup', 'master_detail'].includes(relatedObjectField.type)) {
                  if (!_.isEmpty(relatedObjectFieldValue)) {
                    if (relatedObjectField.multiple && formField.is_multiselect) {
                      relatedObjectFieldValue = _.compact(_.pluck(relatedObjectFieldValue, '_id'));
                    } else if (!relatedObjectField.multiple && !formField.is_multiselect) {
                      relatedObjectFieldValue = relatedObjectFieldValue._id;
                    }
                  }
                } // 表单选人选组字段 至 对象 lookup master_detail类型字段同步


                if (['user', 'group'].includes(formField.type) && ['lookup', 'master_detail'].includes(relatedObjectField.type) && ['users', 'organizations'].includes(relatedObjectField.reference_to)) {
                  if (!_.isEmpty(relatedObjectFieldValue)) {
                    if (relatedObjectField.multiple && formField.is_multiselect) {
                      relatedObjectFieldValue = _.compact(_.pluck(relatedObjectFieldValue, 'id'));
                    } else if (!relatedObjectField.multiple && !formField.is_multiselect) {
                      relatedObjectFieldValue = relatedObjectFieldValue.id;
                    }
                  }
                }

                relatedObjectValue[fieldKey] = relatedObjectFieldValue;
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
    });

    if (field_map_back_script) {
      _.extend(obj, self.evalFieldMapBackScript(field_map_back_script, ins));
    } // 过滤掉非法的key


    var filterObj = {};

    _.each(_.keys(obj), function (k) {
      if (objectFieldKeys.includes(k)) {
        filterObj[k] = obj[k];
      } // else if(relatedObjectsKeys.includes(k) && _.isArray(obj[k])){
      // 	if(_.isArray(relatedObjs[k])){
      // 		relatedObjs[k] = relatedObjs[k].concat(obj[k])
      // 	}else{
      // 		relatedObjs[k] = obj[k]
      // 	}
      // }

    });

    return {
      mainObjectValue: filterObj,
      relatedObjectsValue: relatedObjs
    };
  };

  self.evalFieldMapBackScript = function (field_map_back_script, ins) {
    var script = "module.exports = function (instance) { " + field_map_back_script + " }";

    var func = _eval(script, "field_map_script");

    var values = func(ins);

    if (_.isObject(values)) {
      return values;
    } else {
      console.error("evalFieldMapBackScript: 脚本返回值类型不是对象");
    }

    return {};
  };

  self.syncRelatedObjectsValue = function (mainRecordId, relatedObjects, relatedObjectsValue, spaceId, ins) {
    var insId = ins._id;

    _.each(relatedObjects, function (relatedObject) {
      var objectCollection = Creator.getCollection(relatedObject.object_name, spaceId);
      var tableMap = {};

      _.each(relatedObjectsValue[relatedObject.object_name], function (relatedObjectValue) {
        var table_id = relatedObjectValue._table._id;
        var table_code = relatedObjectValue._table._code;

        if (!tableMap[table_code]) {
          tableMap[table_code] = [];
        }

        ;
        tableMap[table_code].push(table_id);
        var oldRelatedRecord = Creator.getCollection(relatedObject.object_name, spaceId).findOne({
          [relatedObject.foreign_key]: mainRecordId,
          "instances._id": insId,
          _table: relatedObjectValue._table
        }, {
          fields: {
            _id: 1
          }
        });

        if (oldRelatedRecord) {
          Creator.getCollection(relatedObject.object_name, spaceId).update({
            _id: oldRelatedRecord._id
          }, {
            $set: relatedObjectValue
          });
        } else {
          relatedObjectValue[relatedObject.foreign_key] = mainRecordId;
          relatedObjectValue.space = spaceId;
          relatedObjectValue.owner = ins.applicant;
          relatedObjectValue.created_by = ins.applicant;
          relatedObjectValue.modified_by = ins.applicant;
          relatedObjectValue._id = objectCollection._makeNewID();
          var instance_state = ins.state;

          if (ins.state === 'completed' && ins.final_decision) {
            instance_state = ins.final_decision;
          }

          relatedObjectValue.instances = [{
            _id: insId,
            state: instance_state
          }];
          relatedObjectValue.instance_state = instance_state;
          Creator.getCollection(relatedObject.object_name, spaceId).insert(relatedObjectValue, {
            validate: false,
            filter: false
          });
        }
      }); //清理申请单上被删除子表记录对应的相关表记录


      _.each(tableMap, function (tableIds, tableCode) {
        objectCollection.remove({
          [relatedObject.foreign_key]: mainRecordId,
          "instances._id": insId,
          "_table._code": tableCode,
          "_table._id": {
            $nin: tableIds
          }
        });
      });
    });

    tableIds = _.compact(tableIds);
  };

  self.sendDoc = function (doc) {
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
    self.syncInsFields.forEach(function (f) {
      fields[f] = 1;
    });
    var ins = Creator.getCollection('instances').findOne(insId, {
      fields: fields
    });
    var values = ins.values,
        spaceId = ins.space;

    if (records && !_.isEmpty(records)) {
      // 此情况属于从creator中发起审批，或者已经从Apps同步到了creator
      var objectName = records[0].o;
      var ow = Creator.getCollection('object_workflows').findOne({
        object_name: objectName,
        flow_id: ins.flow
      });
      var objectCollection = Creator.getCollection(objectName, spaceId),
          sync_attachment = ow.sync_attachment;
      var objectInfo = Creator.getObject(objectName, spaceId);
      objectCollection.find({
        _id: {
          $in: records[0].ids
        }
      }).forEach(function (record) {
        try {
          var syncValues = self.syncValues(ow.field_map_back, values, ins, objectInfo, ow.field_map_back_script, record);
          var setObj = syncValues.mainObjectValue;
          var instance_state = ins.state;

          if (ins.state === 'completed' && ins.final_decision) {
            instance_state = ins.final_decision;
          }

          setObj['instances.$.state'] = setObj.instance_state = instance_state;
          objectCollection.update({
            _id: record._id,
            'instances._id': insId
          }, {
            $set: setObj
          });
          var relatedObjects = Creator.getRelatedObjects(ow.object_name, spaceId);
          var relatedObjectsValue = syncValues.relatedObjectsValue;
          self.syncRelatedObjectsValue(record._id, relatedObjects, relatedObjectsValue, spaceId, ins); // 以最终申请单附件为准，旧的record中附件删除

          Creator.getCollection('cms_files').remove({
            'parent': {
              o: objectName,
              ids: [record._id]
            }
          });

          var removeOldFiles = function (cb) {
            return cfs.files.remove({
              'metadata.record_id': record._id
            }, cb);
          };

          Meteor.wrapAsync(removeOldFiles)(); // 同步新附件

          self.syncAttach(sync_attachment, insId, record.space, record._id, objectName);
        } catch (error) {
          console.error(error.stack);
          objectCollection.update({
            _id: record._id,
            'instances._id': insId
          }, {
            $set: {
              'instances.$.state': 'pending',
              'instance_state': 'pending'
            }
          });
          Creator.getCollection('cms_files').remove({
            'parent': {
              o: objectName,
              ids: [record._id]
            }
          });
          cfs.files.remove({
            'metadata.record_id': record._id
          });
          throw new Error(error);
        }
      });
    } else {
      // 此情况属于从apps中发起审批
      Creator.getCollection('object_workflows').find({
        flow_id: ins.flow
      }).forEach(function (ow) {
        try {
          var objectCollection = Creator.getCollection(ow.object_name, spaceId),
              sync_attachment = ow.sync_attachment,
              newRecordId = objectCollection._makeNewID(),
              objectName = ow.object_name;

          var objectInfo = Creator.getObject(ow.object_name, spaceId);
          var syncValues = self.syncValues(ow.field_map_back, values, ins, objectInfo, ow.field_map_back_script);
          var newObj = syncValues.mainObjectValue;
          newObj._id = newRecordId;
          newObj.space = spaceId;
          newObj.name = newObj.name || ins.name;
          var instance_state = ins.state;

          if (ins.state === 'completed' && ins.final_decision) {
            instance_state = ins.final_decision;
          }

          newObj.instances = [{
            _id: insId,
            state: instance_state
          }];
          newObj.instance_state = instance_state;
          newObj.owner = ins.applicant;
          newObj.created_by = ins.applicant;
          newObj.modified_by = ins.applicant;
          var r = objectCollection.insert(newObj);

          if (r) {
            Creator.getCollection('instances').update(ins._id, {
              $push: {
                record_ids: {
                  o: objectName,
                  ids: [newRecordId]
                }
              }
            });
            var relatedObjects = Creator.getRelatedObjects(ow.object_name, spaceId);
            var relatedObjectsValue = syncValues.relatedObjectsValue;
            self.syncRelatedObjectsValue(newRecordId, relatedObjects, relatedObjectsValue, spaceId, ins); // workflow里发起审批后，同步时也可以修改相关表的字段值 #1183

            var record = objectCollection.findOne(newRecordId);
            self.syncValues(ow.field_map_back, values, ins, objectInfo, ow.field_map_back_script, record);
          } // 附件同步


          self.syncAttach(sync_attachment, insId, spaceId, newRecordId, objectName);
        } catch (error) {
          console.error(error.stack);
          objectCollection.remove({
            _id: newRecordId,
            space: spaceId
          });
          Creator.getCollection('instances').update(ins._id, {
            $pull: {
              record_ids: {
                o: objectName,
                ids: [newRecordId]
              }
            }
          });
          Creator.getCollection('cms_files').remove({
            'parent': {
              o: objectName,
              ids: [newRecordId]
            }
          });
          cfs.files.remove({
            'metadata.record_id': newRecordId
          });
          throw new Error(error);
        }
      });
    }

    InstanceRecordQueue.collection.update(doc._id, {
      $set: {
        'info.sync_date': new Date()
      }
    });
  }; // Universal send function


  var _querySend = function (doc) {
    if (self.sendDoc) {
      self.sendDoc(doc);
    }

    return {
      doc: [doc._id]
    };
  };

  self.serverSend = function (doc) {
    doc = doc || {};
    return _querySend(doc);
  }; // This interval will allow only one doc to be sent at a time, it
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
    // This will require index since we sort docs by createdAt
    InstanceRecordQueue.collection._ensureIndex({
      createdAt: 1
    });

    InstanceRecordQueue.collection._ensureIndex({
      sent: 1
    });

    InstanceRecordQueue.collection._ensureIndex({
      sending: 1
    });

    var sendDoc = function (doc) {
      // Reserve doc
      var now = +new Date();
      var timeoutAt = now + options.sendTimeout;
      var reserved = InstanceRecordQueue.collection.update({
        _id: doc._id,
        sent: false,
        // xxx: need to make sure this is set on create
        sending: {
          $lt: now
        }
      }, {
        $set: {
          sending: timeoutAt
        }
      }); // Make sure we only handle docs reserved by this
      // instance

      if (reserved) {
        // Send
        var result = InstanceRecordQueue.serverSend(doc);

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
        } // // Emit the send
        // self.emit('send', {
        // 	doc: doc._id,
        // 	result: result
        // });

      } // Else could not reserve

    }; // EO sendDoc


    sendWorker(function () {
      if (isSendingDoc) {
        return;
      } // Set send fence


      isSendingDoc = true;
      var batchSize = options.sendBatchSize || 1;
      var now = +new Date(); // Find docs that are not being or already sent

      var pendingDocs = InstanceRecordQueue.collection.find({
        $and: [// Message is not sent
        {
          sent: false
        }, // And not being sent by other instances
        {
          sending: {
            $lt: now
          }
        }, // And no error
        {
          errMsg: {
            $exists: false
          }
        }]
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"server":{"startup.coffee":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/steedos_instance-record-queue/server/startup.coffee                                                   //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function () {
  var ref;

  if ((ref = Meteor.settings.cron) != null ? ref.instancerecordqueue_interval : void 0) {
    return InstanceRecordQueue.Configure({
      sendInterval: Meteor.settings.cron.instancerecordqueue_interval,
      sendBatchSize: 10,
      keepDocs: true
    });
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"checkNpm.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/steedos_instance-record-queue/server/checkNpm.js                                                      //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
let checkNpmVersions;
module.link("meteor/tmeasday:check-npm-versions", {
  checkNpmVersions(v) {
    checkNpmVersions = v;
  }

}, 0);
checkNpmVersions({
  "eval": "^0.1.2"
}, 'steedos:instance-record-queue');
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}},{
  "extensions": [
    ".js",
    ".json",
    ".coffee"
  ]
});

require("/node_modules/meteor/steedos:instance-record-queue/lib/common/main.js");
require("/node_modules/meteor/steedos:instance-record-queue/lib/common/docs.js");
require("/node_modules/meteor/steedos:instance-record-queue/lib/server/api.js");
require("/node_modules/meteor/steedos:instance-record-queue/server/startup.coffee");
require("/node_modules/meteor/steedos:instance-record-queue/server/checkNpm.js");

/* Exports */
Package._define("steedos:instance-record-queue", {
  InstanceRecordQueue: InstanceRecordQueue
});

})();

//# sourceURL=meteor://💻app/packages/steedos_instance-record-queue.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczppbnN0YW5jZS1yZWNvcmQtcXVldWUvbGliL2NvbW1vbi9tYWluLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmluc3RhbmNlLXJlY29yZC1xdWV1ZS9saWIvY29tbW9uL2RvY3MuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6aW5zdGFuY2UtcmVjb3JkLXF1ZXVlL2xpYi9zZXJ2ZXIvYXBpLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2luc3RhbmNlLXJlY29yZC1xdWV1ZS9zZXJ2ZXIvc3RhcnR1cC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9zdGFydHVwLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczppbnN0YW5jZS1yZWNvcmQtcXVldWUvc2VydmVyL2NoZWNrTnBtLmpzIl0sIm5hbWVzIjpbIkluc3RhbmNlUmVjb3JkUXVldWUiLCJFdmVudFN0YXRlIiwiY29sbGVjdGlvbiIsImRiIiwiaW5zdGFuY2VfcmVjb3JkX3F1ZXVlIiwiTW9uZ28iLCJDb2xsZWN0aW9uIiwiX3ZhbGlkYXRlRG9jdW1lbnQiLCJkb2MiLCJjaGVjayIsImluZm8iLCJPYmplY3QiLCJzZW50IiwiTWF0Y2giLCJPcHRpb25hbCIsIkJvb2xlYW4iLCJzZW5kaW5nIiwiSW50ZWdlciIsImNyZWF0ZWRBdCIsIkRhdGUiLCJjcmVhdGVkQnkiLCJPbmVPZiIsIlN0cmluZyIsInNlbmQiLCJvcHRpb25zIiwiY3VycmVudFVzZXIiLCJNZXRlb3IiLCJpc0NsaWVudCIsInVzZXJJZCIsImlzU2VydmVyIiwiXyIsImV4dGVuZCIsInRlc3QiLCJwaWNrIiwiaW5zZXJ0IiwiX2V2YWwiLCJyZXF1aXJlIiwiaXNDb25maWd1cmVkIiwic2VuZFdvcmtlciIsInRhc2siLCJpbnRlcnZhbCIsImRlYnVnIiwiY29uc29sZSIsImxvZyIsInNldEludGVydmFsIiwiZXJyb3IiLCJtZXNzYWdlIiwiQ29uZmlndXJlIiwic2VsZiIsInNlbmRUaW1lb3V0IiwiRXJyb3IiLCJzeW5jQXR0YWNoIiwic3luY19hdHRhY2htZW50IiwiaW5zSWQiLCJzcGFjZUlkIiwibmV3UmVjb3JkSWQiLCJvYmplY3ROYW1lIiwiY2ZzIiwiaW5zdGFuY2VzIiwiZmluZCIsImZvckVhY2giLCJmIiwiaGFzU3RvcmVkIiwiX2lkIiwibmV3RmlsZSIsIkZTIiwiRmlsZSIsImNtc0ZpbGVJZCIsIkNyZWF0b3IiLCJnZXRDb2xsZWN0aW9uIiwiX21ha2VOZXdJRCIsImF0dGFjaERhdGEiLCJjcmVhdGVSZWFkU3RyZWFtIiwidHlwZSIsIm9yaWdpbmFsIiwiZXJyIiwicmVhc29uIiwibmFtZSIsInNpemUiLCJtZXRhZGF0YSIsIm93bmVyIiwib3duZXJfbmFtZSIsInNwYWNlIiwicmVjb3JkX2lkIiwib2JqZWN0X25hbWUiLCJwYXJlbnQiLCJmaWxlcyIsIndyYXBBc3luYyIsImNiIiwib25jZSIsInN0b3JlTmFtZSIsIm8iLCJpZHMiLCJleHRlbnRpb24iLCJleHRlbnNpb24iLCJ2ZXJzaW9ucyIsImNyZWF0ZWRfYnkiLCJtb2RpZmllZF9ieSIsInBhcmVudHMiLCJpbmNsdWRlcyIsInB1c2giLCJjdXJyZW50IiwidXBkYXRlIiwiJHNldCIsIiRhZGRUb1NldCIsInN5bmNJbnNGaWVsZHMiLCJzeW5jVmFsdWVzIiwiZmllbGRfbWFwX2JhY2siLCJ2YWx1ZXMiLCJpbnMiLCJvYmplY3RJbmZvIiwiZmllbGRfbWFwX2JhY2tfc2NyaXB0IiwicmVjb3JkIiwib2JqIiwidGFibGVGaWVsZENvZGVzIiwidGFibGVGaWVsZE1hcCIsInRhYmxlVG9SZWxhdGVkTWFwIiwiZm9ybSIsImZpbmRPbmUiLCJmb3JtRmllbGRzIiwiZm9ybV92ZXJzaW9uIiwiZmllbGRzIiwiZm9ybVZlcnNpb24iLCJoaXN0b3J5cyIsImgiLCJvYmplY3RGaWVsZHMiLCJvYmplY3RGaWVsZEtleXMiLCJrZXlzIiwicmVsYXRlZE9iamVjdHMiLCJnZXRSZWxhdGVkT2JqZWN0cyIsInJlbGF0ZWRPYmplY3RzS2V5cyIsInBsdWNrIiwiZm9ybVRhYmxlRmllbGRzIiwiZmlsdGVyIiwiZm9ybUZpZWxkIiwiZm9ybVRhYmxlRmllbGRzQ29kZSIsImdldFJlbGF0ZWRPYmplY3RGaWVsZCIsImtleSIsInJlbGF0ZWRPYmplY3RzS2V5Iiwic3RhcnRzV2l0aCIsImdldEZvcm1UYWJsZUZpZWxkIiwiZm9ybVRhYmxlRmllbGRDb2RlIiwiZ2V0Rm9ybUZpZWxkIiwiX2Zvcm1GaWVsZHMiLCJfZmllbGRDb2RlIiwiZWFjaCIsImZmIiwiY29kZSIsImZtIiwicmVsYXRlZE9iamVjdEZpZWxkIiwib2JqZWN0X2ZpZWxkIiwiZm9ybVRhYmxlRmllbGQiLCJ3b3JrZmxvd19maWVsZCIsIm9UYWJsZUNvZGUiLCJzcGxpdCIsIm9UYWJsZUZpZWxkQ29kZSIsInRhYmxlVG9SZWxhdGVkTWFwS2V5Iiwid1RhYmxlQ29kZSIsImluZGV4T2YiLCJoYXNPd25Qcm9wZXJ0eSIsImlzQXJyYXkiLCJKU09OIiwic3RyaW5naWZ5Iiwid29ya2Zsb3dfdGFibGVfZmllbGRfY29kZSIsIm9iamVjdF90YWJsZV9maWVsZF9jb2RlIiwid0ZpZWxkIiwib0ZpZWxkIiwicmVmZXJlbmNlX3RvIiwiaXNFbXB0eSIsIm11bHRpcGxlIiwiaXNfbXVsdGlzZWxlY3QiLCJjb21wYWN0IiwiaWQiLCJpc1N0cmluZyIsIm9Db2xsZWN0aW9uIiwicmVmZXJPYmplY3QiLCJnZXRPYmplY3QiLCJyZWZlckRhdGEiLCJuYW1lRmllbGRLZXkiLCJOQU1FX0ZJRUxEX0tFWSIsInNlbGVjdG9yIiwidG1wX2ZpZWxkX3ZhbHVlIiwidGVtT2JqRmllbGRzIiwibGVuZ3RoIiwib2JqRmllbGQiLCJyZWZlck9iakZpZWxkIiwicmVmZXJTZXRPYmoiLCJpbnNGaWVsZCIsInVuaXEiLCJ0ZmMiLCJjIiwicGFyc2UiLCJ0ciIsIm5ld1RyIiwidiIsImsiLCJ0Zm0iLCJvVGRDb2RlIiwicmVsYXRlZE9ianMiLCJnZXRSZWxhdGVkRmllbGRWYWx1ZSIsInZhbHVlS2V5IiwicmVkdWNlIiwieCIsIm1hcCIsInRhYmxlQ29kZSIsIl9GUk9NX1RBQkxFX0NPREUiLCJ3YXJuIiwicmVsYXRlZE9iamVjdE5hbWUiLCJyZWxhdGVkT2JqZWN0VmFsdWVzIiwicmVsYXRlZE9iamVjdCIsInRhYmxlVmFsdWVJdGVtIiwicmVsYXRlZE9iamVjdFZhbHVlIiwiZmllbGRLZXkiLCJyZWxhdGVkT2JqZWN0RmllbGRWYWx1ZSIsImZvcm1GaWVsZEtleSIsIl9jb2RlIiwiZXZhbEZpZWxkTWFwQmFja1NjcmlwdCIsImZpbHRlck9iaiIsIm1haW5PYmplY3RWYWx1ZSIsInJlbGF0ZWRPYmplY3RzVmFsdWUiLCJzY3JpcHQiLCJmdW5jIiwiaXNPYmplY3QiLCJzeW5jUmVsYXRlZE9iamVjdHNWYWx1ZSIsIm1haW5SZWNvcmRJZCIsIm9iamVjdENvbGxlY3Rpb24iLCJ0YWJsZU1hcCIsInRhYmxlX2lkIiwiX3RhYmxlIiwidGFibGVfY29kZSIsIm9sZFJlbGF0ZWRSZWNvcmQiLCJmb3JlaWduX2tleSIsImFwcGxpY2FudCIsImluc3RhbmNlX3N0YXRlIiwic3RhdGUiLCJmaW5hbF9kZWNpc2lvbiIsInZhbGlkYXRlIiwidGFibGVJZHMiLCJyZW1vdmUiLCIkbmluIiwic2VuZERvYyIsImluc3RhbmNlX2lkIiwicmVjb3JkcyIsImZsb3ciLCJ0cmFjZXMiLCJvdyIsImZsb3dfaWQiLCIkaW4iLCJzZXRPYmoiLCJyZW1vdmVPbGRGaWxlcyIsInN0YWNrIiwibmV3T2JqIiwiciIsIiRwdXNoIiwicmVjb3JkX2lkcyIsIiRwdWxsIiwiX3F1ZXJ5U2VuZCIsInNlcnZlclNlbmQiLCJpc1NlbmRpbmdEb2MiLCJzZW5kSW50ZXJ2YWwiLCJfZW5zdXJlSW5kZXgiLCJub3ciLCJ0aW1lb3V0QXQiLCJyZXNlcnZlZCIsIiRsdCIsInJlc3VsdCIsImtlZXBEb2NzIiwic2VudEF0IiwiYmF0Y2hTaXplIiwic2VuZEJhdGNoU2l6ZSIsInBlbmRpbmdEb2NzIiwiJGFuZCIsImVyck1zZyIsIiRleGlzdHMiLCJzb3J0IiwibGltaXQiLCJzdGFydHVwIiwicmVmIiwic2V0dGluZ3MiLCJjcm9uIiwiaW5zdGFuY2VyZWNvcmRxdWV1ZV9pbnRlcnZhbCIsImNoZWNrTnBtVmVyc2lvbnMiLCJtb2R1bGUiLCJsaW5rIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUFBLG1CQUFtQixHQUFHLElBQUlDLFVBQUosRUFBdEIsQzs7Ozs7Ozs7Ozs7QUNBQUQsbUJBQW1CLENBQUNFLFVBQXBCLEdBQWlDQyxFQUFFLENBQUNDLHFCQUFILEdBQTJCLElBQUlDLEtBQUssQ0FBQ0MsVUFBVixDQUFxQix1QkFBckIsQ0FBNUQ7O0FBRUEsSUFBSUMsaUJBQWlCLEdBQUcsVUFBU0MsR0FBVCxFQUFjO0FBRXJDQyxPQUFLLENBQUNELEdBQUQsRUFBTTtBQUNWRSxRQUFJLEVBQUVDLE1BREk7QUFFVkMsUUFBSSxFQUFFQyxLQUFLLENBQUNDLFFBQU4sQ0FBZUMsT0FBZixDQUZJO0FBR1ZDLFdBQU8sRUFBRUgsS0FBSyxDQUFDQyxRQUFOLENBQWVELEtBQUssQ0FBQ0ksT0FBckIsQ0FIQztBQUlWQyxhQUFTLEVBQUVDLElBSkQ7QUFLVkMsYUFBUyxFQUFFUCxLQUFLLENBQUNRLEtBQU4sQ0FBWUMsTUFBWixFQUFvQixJQUFwQjtBQUxELEdBQU4sQ0FBTDtBQVFBLENBVkQ7O0FBWUF0QixtQkFBbUIsQ0FBQ3VCLElBQXBCLEdBQTJCLFVBQVNDLE9BQVQsRUFBa0I7QUFDNUMsTUFBSUMsV0FBVyxHQUFHQyxNQUFNLENBQUNDLFFBQVAsSUFBbUJELE1BQU0sQ0FBQ0UsTUFBMUIsSUFBb0NGLE1BQU0sQ0FBQ0UsTUFBUCxFQUFwQyxJQUF1REYsTUFBTSxDQUFDRyxRQUFQLEtBQW9CTCxPQUFPLENBQUNKLFNBQVIsSUFBcUIsVUFBekMsQ0FBdkQsSUFBK0csSUFBakk7O0FBQ0EsTUFBSVosR0FBRyxHQUFH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Q0w7QUFDQXlLLG9CQUFNLEVBQUVuTyxLQUFLLENBQUNDO0FBRlQ7QUFESixXQUZIO0FBUUE7QUFDRCxPQWZELEVBeENzQixDQXVEbEI7QUFFSjs7QUFDQW9OLGtCQUFZLEdBQUcsS0FBZjtBQUNBLEtBM0RTLEVBMkRQMU8sT0FBTyxDQUFDMk8sWUFBUixJQUF3QixLQTNEakIsQ0FBVixDQXJFa0MsQ0FnSUM7QUFFbkMsR0FsSUQsTUFrSU87QUFDTixRQUFJblEsbUJBQW1CLENBQUN5QyxLQUF4QixFQUErQjtBQUM5QkMsYUFBTyxDQUFDQyxHQUFSLENBQVksOENBQVo7QUFDQTtBQUNEO0FBRUQsQ0FyOEJELEM7Ozs7Ozs7Ozs7OztBQzNCQWpCLE9BQU8wUCxPQUFQLENBQWU7QUFDZCxNQUFBQyxHQUFBOztBQUFBLE9BQUFBLE1BQUEzUCxPQUFBNFAsUUFBQSxDQUFBQyxJQUFBLFlBQUFGLElBQXlCRyw0QkFBekIsR0FBeUIsTUFBekI7QUNFRyxXRERGeFIsb0JBQW9CK0MsU0FBcEIsQ0FDQztBQUFBb04sb0JBQWN6TyxPQUFPNFAsUUFBUCxDQUFnQkMsSUFBaEIsQ0FBcUJDLDRCQUFuQztBQUNBWCxxQkFBZSxFQURmO0FBRUFILGdCQUFVO0FBRlYsS0FERCxDQ0NFO0FBS0Q7QURSSCxHOzs7Ozs7Ozs7OztBRUFBLElBQUllLGdCQUFKO0FBQXFCQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxvQ0FBWixFQUFpRDtBQUFDRixrQkFBZ0IsQ0FBQ3ZGLENBQUQsRUFBRztBQUFDdUYsb0JBQWdCLEdBQUN2RixDQUFqQjtBQUFtQjs7QUFBeEMsQ0FBakQsRUFBMkYsQ0FBM0Y7QUFDckJ1RixnQkFBZ0IsQ0FBQztBQUNoQixVQUFRO0FBRFEsQ0FBRCxFQUViLCtCQUZhLENBQWhCLEMiLCJmaWxlIjoiL3BhY2thZ2VzL3N0ZWVkb3NfaW5zdGFuY2UtcmVjb3JkLXF1ZXVlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiSW5zdGFuY2VSZWNvcmRRdWV1ZSA9IG5ldyBFdmVudFN0YXRlKCk7IiwiSW5zdGFuY2VSZWNvcmRRdWV1ZS5jb2xsZWN0aW9uID0gZGIuaW5zdGFuY2VfcmVjb3JkX3F1ZXVlID0gbmV3IE1vbmdvLkNvbGxlY3Rpb24oJ2luc3RhbmNlX3JlY29yZF9xdWV1ZScpO1xyXG5cclxudmFyIF92YWxpZGF0ZURvY3VtZW50ID0gZnVuY3Rpb24oZG9jKSB7XHJcblxyXG5cdGNoZWNrKGRvYywge1xyXG5cdFx0aW5mbzogT2JqZWN0LFxyXG5cdFx0c2VudDogTWF0Y2guT3B0aW9uYWwoQm9vbGVhbiksXHJcblx0XHRzZW5kaW5nOiBNYXRjaC5PcHRpb25hbChNYXRjaC5JbnRlZ2VyKSxcclxuXHRcdGNyZWF0ZWRBdDogRGF0ZSxcclxuXHRcdGNyZWF0ZWRCeTogTWF0Y2guT25lT2YoU3RyaW5nLCBudWxsKVxyXG5cdH0pO1xyXG5cclxufTtcclxuXHJcbkluc3RhbmNlUmVjb3JkUXVldWUuc2VuZCA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuXHR2YXIgY3VycmVudFVzZXIgPSBNZXRlb3IuaXNDbGllbnQgJiYgTWV0ZW9yLnVzZXJJZCAmJiBNZXRlb3IudXNlcklkKCkgfHwgTWV0ZW9yLmlzU2VydmVyICYmIChvcHRpb25zLmNyZWF0ZWRCeSB8fCAnPFNFUlZFUj4nKSB8fCBudWxsXHJcblx0dmFyIGRvYyA9IF8uZXh0ZW5kKHtcclxuXHRcdGNyZWF0ZWRBdDogbmV3IERhdGUoKSxcclxuXHRcdGNyZWF0ZWRCeTogY3VycmVudFVzZXJcclxuXHR9KTtcclxuXHJcblx0aWYgKE1hdGNoLnRlc3Qob3B0aW9ucywgT2JqZWN0KSkge1xyXG5cdFx0ZG9jLmluZm8gPSBfLnBpY2sob3B0aW9ucywgJ2luc3RhbmNlX2lkJywgJ3JlY29yZHMnLCAnc3luY19kYXRlJywgJ2luc3RhbmNlX2ZpbmlzaF9kYXRlJywgJ3N0ZXBfbmFtZScpO1xyXG5cdH1cclxuXHJcblx0ZG9jLnNlbnQgPSBmYWxzZTtcclxuXHRkb2Muc2VuZGluZyA9IDA7XHJcblxyXG5cdF92YWxpZGF0ZURvY3VtZW50KGRvYyk7XHJcblxyXG5cdHJldHVybiBJbnN0YW5jZVJlY29yZFF1ZXVlLmNvbGxlY3Rpb24uaW5zZXJ0KGRvYyk7XHJcbn07IiwidmFyIF9ldmFsID0gcmVxdWlyZSgnZXZhbCcpO1xyXG52YXIgaXNDb25maWd1cmVkID0gZmFsc2U7XHJcbnZhciBzZW5kV29ya2VyID0gZnVuY3Rpb24gKHRhc2ssIGludGVydmFsKSB7XHJcblxyXG5cdGlmIChJbnN0YW5jZVJlY29yZFF1ZXVlLmRlYnVnKSB7XHJcblx0XHRjb25zb2xlLmxvZygnSW5zdGFuY2VSZWNvcmRRdWV1ZTogU2VuZCB3b3JrZXIgc3RhcnRlZCwgdXNpbmcgaW50ZXJ2YWw6ICcgKyBpbnRlcnZhbCk7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gTWV0ZW9yLnNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdHRhc2soKTtcclxuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKCdJbnN0YW5jZVJlY29yZFF1ZXVlOiBFcnJvciB3aGlsZSBzZW5kaW5nOiAnICsgZXJyb3IubWVzc2FnZSk7XHJcblx0XHR9XHJcblx0fSwgaW50ZXJ2YWwpO1xyXG59O1xyXG5cclxuLypcclxuXHRvcHRpb25zOiB7XHJcblx0XHQvLyBDb250cm9scyB0aGUgc2VuZGluZyBpbnRlcnZhbFxyXG5cdFx0c2VuZEludGVydmFsOiBNYXRjaC5PcHRpb25hbChOdW1iZXIpLFxyXG5cdFx0Ly8gQ29udHJvbHMgdGhlIHNlbmRpbmcgYmF0Y2ggc2l6ZSBwZXIgaW50ZXJ2YWxcclxuXHRcdHNlbmRCYXRjaFNpemU6IE1hdGNoLk9wdGlvbmFsKE51bWJlciksXHJcblx0XHQvLyBBbGxvdyBvcHRpb25hbCBrZWVwaW5nIG5vdGlmaWNhdGlvbnMgaW4gY29sbGVjdGlvblxyXG5cdFx0a2VlcERvY3M6IE1hdGNoLk9wdGlvbmFsKEJvb2xlYW4pXHJcblx0fVxyXG4qL1xyXG5JbnN0YW5jZVJlY29yZFF1ZXVlLkNvbmZpZ3VyZSA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcblx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cdG9wdGlvbnMgPSBfLmV4dGVuZCh7XHJcblx0XHRzZW5kVGltZW91dDogNjAwMDAsIC8vIFRpbWVvdXQgcGVyaW9kXHJcblx0fSwgb3B0aW9ucyk7XHJcblxyXG5cdC8vIEJsb2NrIG11bHRpcGxlIGNhbGxzXHJcblx0aWYgKGlzQ29uZmlndXJlZCkge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKCdJbnN0YW5jZVJlY29yZFF1ZXVlLkNvbmZpZ3VyZSBzaG91bGQgbm90IGJlIGNhbGxlZCBtb3JlIHRoYW4gb25jZSEnKTtcclxuXHR9XHJcblxyXG5cdGlzQ29uZmlndXJlZCA9IHRydWU7XHJcblxyXG5cdC8vIEFkZCBkZWJ1ZyBpbmZvXHJcblx0aWYgKEluc3RhbmNlUmVjb3JkUXVldWUuZGVidWcpIHtcclxuXHRcdGNvbnNvbGUubG9nKCdJbnN0YW5jZVJlY29yZFF1ZXVlLkNvbmZpZ3VyZScsIG9wdGlvbnMpO1xyXG5cdH1cclxuXHJcblx0c2VsZi5zeW5jQXR0YWNoID0gZnVuY3Rpb24gKHN5bmNfYXR0YWNobWVudCwgaW5zSWQsIHNwYWNlSWQsIG5ld1JlY29yZElkLCBvYmplY3ROYW1lKSB7XHJcblx0XHRpZiAoc3luY19hdHRhY2htZW50ID09IFwibGFzdGVzdFwiKSB7XHJcblx0XHRcdGNmcy5pbnN0YW5jZXMuZmluZCh7XHJcblx0XHRcdFx0J21ldGFkYXRhLmluc3RhbmNlJzogaW5zSWQsXHJcblx0XHRcdFx0J21ldGFkYXRhLmN1cnJlbnQnOiB0cnVlXHJcblx0XHRcdH0pLmZvckVhY2goZnVuY3Rpb24gKGYpIHtcclxuXHRcdFx0XHRpZiAoIWYuaGFzU3RvcmVkKCdpbnN0YW5jZXMnKSkge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvcignc3luY0F0dGFjaC1maWxlIG5vdCBzdG9yZWQ6ICcsIGYuX2lkKTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dmFyIG5ld0ZpbGUgPSBuZXcgRlMuRmlsZSgpLFxyXG5cdFx0XHRcdFx0Y21zRmlsZUlkID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdjbXNfZmlsZXMnKS5fbWFrZU5ld0lEKCk7XHJcblx0XHRcdFx0bmV3RmlsZS5hdHRhY2hEYXRhKGYuY3JlYXRlUmVhZFN0cmVhbSgnaW5zdGFuY2VzJyksIHtcclxuXHRcdFx0XHRcdHR5cGU6IGYub3JpZ2luYWwudHlwZVxyXG5cdFx0XHRcdH0sIGZ1bmN0aW9uIChlcnIpIHtcclxuXHRcdFx0XHRcdGlmIChlcnIpIHtcclxuXHRcdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcihlcnIuZXJyb3IsIGVyci5yZWFzb24pO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0bmV3RmlsZS5uYW1lKGYubmFtZSgpKTtcclxuXHRcdFx0XHRcdG5ld0ZpbGUuc2l6ZShmLnNpemUoKSk7XHJcblx0XHRcdFx0XHR2YXIgbWV0YWRhdGEgPSB7XHJcblx0XHRcdFx0XHRcdG93bmVyOiBmLm1ldGFkYXRhLm93bmVyLFxyXG5cdFx0XHRcdFx0XHRvd25lcl9uYW1lOiBmLm1ldGFkYXRhLm93bmVyX25hbWUsXHJcblx0XHRcdFx0XHRcdHNwYWNlOiBzcGFjZUlkLFxyXG5cdFx0XHRcdFx0XHRyZWNvcmRfaWQ6IG5ld1JlY29yZElkLFxyXG5cdFx0XHRcdFx0XHRvYmplY3RfbmFtZTogb2JqZWN0TmFtZSxcclxuXHRcdFx0XHRcdFx0cGFyZW50OiBjbXNGaWxlSWRcclxuXHRcdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdFx0bmV3RmlsZS5tZXRhZGF0YSA9IG1ldGFkYXRhO1xyXG5cdFx0XHRcdFx0Y2ZzLmZpbGVzLmluc2VydChuZXdGaWxlKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRNZXRlb3Iud3JhcEFzeW5jKGZ1bmN0aW9uIChuZXdGaWxlLCBDcmVhdG9yLCBjbXNGaWxlSWQsIG9iamVjdE5hbWUsIG5ld1JlY29yZElkLCBzcGFjZUlkLCBmLCBjYikge1xyXG5cdFx0XHRcdFx0bmV3RmlsZS5vbmNlKCdzdG9yZWQnLCBmdW5jdGlvbiAoc3RvcmVOYW1lKSB7XHJcblx0XHRcdFx0XHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbignY21zX2ZpbGVzJykuaW5zZXJ0KHtcclxuXHRcdFx0XHRcdFx0XHRfaWQ6IGNtc0ZpbGVJZCxcclxuXHRcdFx0XHRcdFx0XHRwYXJlbnQ6IHtcclxuXHRcdFx0XHRcdFx0XHRcdG86IG9iamVjdE5hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRpZHM6IFtuZXdSZWNvcmRJZF1cclxuXHRcdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHRcdHNpemU6IG5ld0ZpbGUuc2l6ZSgpLFxyXG5cdFx0XHRcdFx0XHRcdG5hbWU6IG5ld0ZpbGUubmFtZSgpLFxyXG5cdFx0XHRcdFx0XHRcdGV4dGVudGlvbjogbmV3RmlsZS5leHRlbnNpb24oKSxcclxuXHRcdFx0XHRcdFx0XHRzcGFjZTogc3BhY2VJZCxcclxuXHRcdFx0XHRcdFx0XHR2ZXJzaW9uczogW25ld0ZpbGUuX2lkXSxcclxuXHRcdFx0XHRcdFx0XHRvd25lcjogZi5tZXRhZGF0YS5vd25lcixcclxuXHRcdFx0XHRcdFx0XHRjcmVhdGVkX2J5OiBmLm1ldGFkYXRhLm93bmVyLFxyXG5cdFx0XHRcdFx0XHRcdG1vZGlmaWVkX2J5OiBmLm1ldGFkYXRhLm93bmVyXHJcblx0XHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdFx0Y2IobnVsbCk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdG5ld0ZpbGUub25jZSgnZXJyb3InLCBmdW5jdGlvbiAoZXJyb3IpIHtcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvcignc3luY0F0dGFjaC1lcnJvcjogJywgZXJyb3IpO1xyXG5cdFx0XHRcdFx0XHRjYihlcnJvcik7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9KShuZXdGaWxlLCBDcmVhdG9yLCBjbXNGaWxlSWQsIG9iamVjdE5hbWUsIG5ld1JlY29yZElkLCBzcGFjZUlkLCBmKTtcclxuXHRcdFx0fSlcclxuXHRcdH0gZWxzZSBpZiAoc3luY19hdHRhY2htZW50ID09IFwiYWxsXCIpIHtcclxuXHRcdFx0dmFyIHBhcmVudHMgPSBbXTtcclxuXHRcdFx0Y2ZzLmluc3RhbmNlcy5maW5kKHtcclxuXHRcdFx0XHQnbWV0YWRhdGEuaW5zdGFuY2UnOiBpbnNJZFxyXG5cdFx0XHR9KS5mb3JFYWNoKGZ1bmN0aW9uIChmKSB7XHJcblx0XHRcdFx0aWYgKCFmLmhhc1N0b3JlZCgnaW5zdGFuY2VzJykpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoJ3N5bmNBdHRhY2gtZmlsZSBub3Qgc3RvcmVkOiAnLCBmLl9pZCk7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHZhciBuZXdGaWxlID0gbmV3IEZTLkZpbGUoKSxcclxuXHRcdFx0XHRcdGNtc0ZpbGVJZCA9IGYubWV0YWRhdGEucGFyZW50O1xyXG5cclxuXHRcdFx0XHRpZiAoIXBhcmVudHMuaW5jbHVkZXMoY21zRmlsZUlkKSkge1xyXG5cdFx0XHRcdFx0cGFyZW50cy5wdXNoKGNtc0ZpbGVJZCk7XHJcblx0XHRcdFx0XHRDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2Ntc19maWxlcycpLmluc2VydCh7XHJcblx0XHRcdFx0XHRcdF9pZDogY21zRmlsZUlkLFxyXG5cdFx0XHRcdFx0XHRwYXJlbnQ6IHtcclxuXHRcdFx0XHRcdFx0XHRvOiBvYmplY3ROYW1lLFxyXG5cdFx0XHRcdFx0XHRcdGlkczogW25ld1JlY29yZElkXVxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHRzcGFjZTogc3BhY2VJZCxcclxuXHRcdFx0XHRcdFx0dmVyc2lvbnM6IFtdLFxyXG5cdFx0XHRcdFx0XHRvd25lcjogZi5tZXRhZGF0YS5vd25lcixcclxuXHRcdFx0XHRcdFx0Y3JlYXRlZF9ieTogZi5tZXRhZGF0YS5vd25lcixcclxuXHRcdFx0XHRcdFx0bW9kaWZpZWRfYnk6IGYubWV0YWRhdGEub3duZXJcclxuXHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRuZXdGaWxlLmF0dGFjaERhdGEoZi5jcmVhdGVSZWFkU3RyZWFtKCdpbnN0YW5jZXMnKSwge1xyXG5cdFx0XHRcdFx0dHlwZTogZi5vcmlnaW5hbC50eXBlXHJcblx0XHRcdFx0fSwgZnVuY3Rpb24gKGVycikge1xyXG5cdFx0XHRcdFx0aWYgKGVycikge1xyXG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKGVyci5lcnJvciwgZXJyLnJlYXNvbik7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRuZXdGaWxlLm5hbWUoZi5uYW1lKCkpO1xyXG5cdFx0XHRcdFx0bmV3RmlsZS5zaXplKGYuc2l6ZSgpKTtcclxuXHRcdFx0XHRcdHZhciBtZXRhZGF0YSA9IHtcclxuXHRcdFx0XHRcdFx0b3duZXI6IGYubWV0YWRhdGEub3duZXIsXHJcblx0XHRcdFx0XHRcdG93bmVyX25hbWU6IGYubWV0YWRhdGEub3duZXJfbmFtZSxcclxuXHRcdFx0XHRcdFx0c3BhY2U6IHNwYWNlSWQsXHJcblx0XHRcdFx0XHRcdHJlY29yZF9pZDogbmV3UmVjb3JkSWQsXHJcblx0XHRcdFx0XHRcdG9iamVjdF9uYW1lOiBvYmplY3ROYW1lLFxyXG5cdFx0XHRcdFx0XHRwYXJlbnQ6IGNtc0ZpbGVJZFxyXG5cdFx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0XHRuZXdGaWxlLm1ldGFkYXRhID0gbWV0YWRhdGE7XHJcblx0XHRcdFx0XHRjZnMuZmlsZXMuaW5zZXJ0KG5ld0ZpbGUpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdE1ldGVvci53cmFwQXN5bmMoZnVuY3Rpb24gKG5ld0ZpbGUsIENyZWF0b3IsIGNtc0ZpbGVJZCwgZiwgY2IpIHtcclxuXHRcdFx0XHRcdG5ld0ZpbGUub25jZSgnc3RvcmVkJywgZnVuY3Rpb24gKHN0b3JlTmFtZSkge1xyXG5cdFx0XHRcdFx0XHRpZiAoZi5tZXRhZGF0YS5jdXJyZW50ID09IHRydWUpIHtcclxuXHRcdFx0XHRcdFx0XHRDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2Ntc19maWxlcycpLnVwZGF0ZShjbXNGaWxlSWQsIHtcclxuXHRcdFx0XHRcdFx0XHRcdCRzZXQ6IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0c2l6ZTogbmV3RmlsZS5zaXplKCksXHJcblx0XHRcdFx0XHRcdFx0XHRcdG5hbWU6IG5ld0ZpbGUubmFtZSgpLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRleHRlbnRpb246IG5ld0ZpbGUuZXh0ZW5zaW9uKCksXHJcblx0XHRcdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHRcdFx0JGFkZFRvU2V0OiB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHZlcnNpb25zOiBuZXdGaWxlLl9pZFxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbignY21zX2ZpbGVzJykudXBkYXRlKGNtc0ZpbGVJZCwge1xyXG5cdFx0XHRcdFx0XHRcdFx0JGFkZFRvU2V0OiB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHZlcnNpb25zOiBuZXdGaWxlLl9pZFxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRjYihudWxsKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0bmV3RmlsZS5vbmNlKCdlcnJvcicsIGZ1bmN0aW9uIChlcnJvcikge1xyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yKCdzeW5jQXR0YWNoLWVycm9yOiAnLCBlcnJvcik7XHJcblx0XHRcdFx0XHRcdGNiKGVycm9yKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH0pKG5ld0ZpbGUsIENyZWF0b3IsIGNtc0ZpbGVJZCwgZik7XHJcblx0XHRcdH0pXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRzZWxmLnN5bmNJbnNGaWVsZHMgPSBbJ25hbWUnLCAnc3VibWl0dGVyX25hbWUnLCAnYXBwbGljYW50X25hbWUnLCAnYXBwbGljYW50X29yZ2FuaXphdGlvbl9uYW1lJywgJ2FwcGxpY2FudF9vcmdhbml6YXRpb25fZnVsbG5hbWUnLCAnc3RhdGUnLFxyXG5cdFx0J2N1cnJlbnRfc3RlcF9uYW1lJywgJ2Zsb3dfbmFtZScsICdjYXRlZ29yeV9uYW1lJywgJ3N1Ym1pdF9kYXRlJywgJ2ZpbmlzaF9kYXRlJywgJ2ZpbmFsX2RlY2lzaW9uJywgJ2FwcGxpY2FudF9vcmdhbml6YXRpb24nLCAnYXBwbGljYW50X2NvbXBhbnknXHJcblx0XTtcclxuXHRzZWxmLnN5bmNWYWx1ZXMgPSBmdW5jdGlvbiAoZmllbGRfbWFwX2JhY2ssIHZhbHVlcywgaW5zLCBvYmplY3RJbmZvLCBmaWVsZF9tYXBfYmFja19zY3JpcHQsIHJlY29yZCkge1xyXG5cdFx0dmFyXHJcblx0XHRcdG9iaiA9IHt9LFxyXG5cdFx0XHR0YWJsZUZpZWxkQ29kZXMgPSBbXSxcclxuXHRcdFx0dGFibGVGaWVsZE1hcCA9IFtdLFxyXG5cdFx0XHR0YWJsZVRvUmVsYXRlZE1hcCA9IHt9O1xyXG5cclxuXHRcdGZpZWxkX21hcF9iYWNrID0gZmllbGRfbWFwX2JhY2sgfHwgW107XHJcblxyXG5cdFx0dmFyIHNwYWNlSWQgPSBpbnMuc3BhY2U7XHJcblxyXG5cdFx0dmFyIGZvcm0gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJmb3Jtc1wiKS5maW5kT25lKGlucy5mb3JtKTtcclxuXHRcdHZhciBmb3JtRmllbGRzID0gbnVsbDtcclxuXHRcdGlmIChmb3JtLmN1cnJlbnQuX2lkID09PSBpbnMuZm9ybV92ZXJzaW9uKSB7XHJcblx0XHRcdGZvcm1GaWVsZHMgPSBmb3JtLmN1cnJlbnQuZmllbGRzIHx8IFtdO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dmFyIGZvcm1WZXJzaW9uID0gXy5maW5kKGZvcm0uaGlzdG9yeXMsIGZ1bmN0aW9uIChoKSB7XHJcblx0XHRcdFx0cmV0dXJuIGguX2lkID09PSBpbnMuZm9ybV92ZXJzaW9uO1xyXG5cdFx0XHR9KVxyXG5cdFx0XHRmb3JtRmllbGRzID0gZm9ybVZlcnNpb24gPyBmb3JtVmVyc2lvbi5maWVsZHMgOiBbXTtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgb2JqZWN0RmllbGRzID0gb2JqZWN0SW5mby5maWVsZHM7XHJcblx0XHR2YXIgb2JqZWN0RmllbGRLZXlzID0gXy5rZXlzKG9iamVjdEZpZWxkcyk7XHJcblx0XHR2YXIgcmVsYXRlZE9iamVjdHMgPSBDcmVhdG9yLmdldFJlbGF0ZWRPYmplY3RzKG9iamVjdEluZm8ubmFtZSwgc3BhY2VJZCk7XHJcblx0XHR2YXIgcmVsYXRlZE9iamVjdHNLZXlzID0gXy5wbHVjayhyZWxhdGVkT2JqZWN0cywgJ29iamVjdF9uYW1lJyk7XHJcblx0XHR2YXIgZm9ybVRhYmxlRmllbGRzID0gXy5maWx0ZXIoZm9ybUZpZWxkcywgZnVuY3Rpb24gKGZvcm1GaWVsZCkge1xyXG5cdFx0XHRyZXR1cm4gZm9ybUZpZWxkLnR5cGUgPT09ICd0YWJsZSdcclxuXHRcdH0pO1xyXG5cdFx0dmFyIGZvcm1UYWJsZUZpZWxkc0NvZGUgPSBfLnBsdWNrKGZvcm1UYWJsZUZpZWxkcywgJ2NvZGUnKTtcclxuXHJcblx0XHR2YXIgZ2V0UmVsYXRlZE9iamVjdEZpZWxkID0gZnVuY3Rpb24gKGtleSkge1xyXG5cdFx0XHRyZXR1cm4gXy5maW5kKHJlbGF0ZWRPYmplY3RzS2V5cywgZnVuY3Rpb24gKHJlbGF0ZWRPYmplY3RzS2V5KSB7XHJcblx0XHRcdFx0cmV0dXJuIGtleS5zdGFydHNXaXRoKHJlbGF0ZWRPYmplY3RzS2V5ICsgJy4nKTtcclxuXHRcdFx0fSlcclxuXHRcdH07XHJcblxyXG5cdFx0dmFyIGdldEZvcm1UYWJsZUZpZWxkID0gZnVuY3Rpb24gKGtleSkge1xyXG5cdFx0XHRyZXR1cm4gXy5maW5kKGZvcm1UYWJsZUZpZWxkc0NvZGUsIGZ1bmN0aW9uIChmb3JtVGFibGVGaWVsZENvZGUpIHtcclxuXHRcdFx0XHRyZXR1cm4ga2V5LnN0YXJ0c1dpdGgoZm9ybVRhYmxlRmllbGRDb2RlICsgJy4nKTtcclxuXHRcdFx0fSlcclxuXHRcdH07XHJcblxyXG5cdFx0dmFyIGdldEZvcm1GaWVsZCA9IGZ1bmN0aW9uIChfZm9ybUZpZWxkcywgX2ZpZWxkQ29kZSkge1xyXG5cdFx0XHR2YXIgZm9ybUZpZWxkID0gbnVsbDtcclxuXHRcdFx0Xy5lYWNoKF9mb3JtRmllbGRzLCBmdW5jdGlvbiAoZmYpIHtcclxuXHRcdFx0XHRpZiAoIWZvcm1GaWVsZCkge1xyXG5cdFx0XHRcdFx0aWYgKGZmLmNvZGUgPT09IF9maWVsZENvZGUpIHtcclxuXHRcdFx0XHRcdFx0Zm9ybUZpZWxkID0gZmY7XHJcblx0XHRcdFx0XHR9IGVsc2UgaWYgKGZmLnR5cGUgPT09ICdzZWN0aW9uJykge1xyXG5cdFx0XHRcdFx0XHRfLmVhY2goZmYuZmllbGRzLCBmdW5jdGlvbiAoZikge1xyXG5cdFx0XHRcdFx0XHRcdGlmICghZm9ybUZpZWxkKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoZi5jb2RlID09PSBfZmllbGRDb2RlKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGZvcm1GaWVsZCA9IGY7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0fSBlbHNlIGlmIChmZi50eXBlID09PSAndGFibGUnKSB7XHJcblx0XHRcdFx0XHRcdF8uZWFjaChmZi5maWVsZHMsIGZ1bmN0aW9uIChmKSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKCFmb3JtRmllbGQpIHtcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChmLmNvZGUgPT09IF9maWVsZENvZGUpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0Zm9ybUZpZWxkID0gZjtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0cmV0dXJuIGZvcm1GaWVsZDtcclxuXHRcdH1cclxuXHJcblx0XHRmaWVsZF9tYXBfYmFjay5mb3JFYWNoKGZ1bmN0aW9uIChmbSkge1xyXG5cdFx0XHQvL3dvcmtmbG93IOeahOWtkOihqOWIsGNyZWF0b3Igb2JqZWN0IOeahOebuOWFs+WvueixoVxyXG5cdFx0XHR2YXIgcmVsYXRlZE9iamVjdEZpZWxkID0gZ2V0UmVsYXRlZE9iamVjdEZpZWxkKGZtLm9iamVjdF9maWVsZCk7XHJcblx0XHRcdHZhciBmb3JtVGFibGVGaWVsZCA9IGdldEZvcm1UYWJsZUZpZWxkKGZtLndvcmtmbG93X2ZpZWxkKTtcclxuXHRcdFx0aWYgKHJlbGF0ZWRPYmplY3RGaWVsZCkge1xyXG5cdFx0XHRcdHZhciBvVGFibGVDb2RlID0gZm0ub2JqZWN0X2ZpZWxkLnNwbGl0KCcuJylbMF07XHJcblx0XHRcdFx0dmFyIG9UYWJsZUZpZWxkQ29kZSA9IGZtLm9iamVjdF9maWVsZC5zcGxpdCgnLicpWzFdO1xyXG5cdFx0XHRcdHZhciB0YWJsZVRvUmVsYXRlZE1hcEtleSA9IG9UYWJsZUNvZGU7XHJcblx0XHRcdFx0aWYgKCF0YWJsZVRvUmVsYXRlZE1hcFt0YWJsZVRvUmVsYXRlZE1hcEtleV0pIHtcclxuXHRcdFx0XHRcdHRhYmxlVG9SZWxhdGVkTWFwW3RhYmxlVG9SZWxhdGVkTWFwS2V5XSA9IHt9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAoZm9ybVRhYmxlRmllbGQpIHtcclxuXHRcdFx0XHRcdHZhciB3VGFibGVDb2RlID0gZm0ud29ya2Zsb3dfZmllbGQuc3BsaXQoJy4nKVswXTtcclxuXHRcdFx0XHRcdHRhYmxlVG9SZWxhdGVkTWFwW3RhYmxlVG9SZWxhdGVkTWFwS2V5XVsnX0ZST01fVEFCTEVfQ09ERSddID0gd1RhYmxlQ29kZVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0dGFibGVUb1JlbGF0ZWRNYXBbdGFibGVUb1JlbGF0ZWRNYXBLZXldW29UYWJsZUZpZWxkQ29kZV0gPSBmbS53b3JrZmxvd19maWVsZFxyXG5cdFx0XHR9XHJcblx0XHRcdC8vIOWIpOaWreaYr+WQpuaYr+WtkOihqOWtl+autVxyXG5cdFx0XHRlbHNlIGlmIChmbS53b3JrZmxvd19maWVsZC5pbmRleE9mKCcuJC4nKSA+IDAgJiYgZm0ub2JqZWN0X2ZpZWxkLmluZGV4T2YoJy4kLicpID4gMCkge1xyXG5cdFx0XHRcdHZhciB3VGFibGVDb2RlID0gZm0ud29ya2Zsb3dfZmllbGQuc3BsaXQoJy4kLicpWzBdO1xyXG5cdFx0XHRcdHZhciBvVGFibGVDb2RlID0gZm0ub2JqZWN0X2ZpZWxkLnNwbGl0KCcuJC4nKVswXTtcclxuXHRcdFx0XHRpZiAodmFsdWVzLmhhc093blByb3BlcnR5KHdUYWJsZUNvZGUpICYmIF8uaXNBcnJheSh2YWx1ZXNbd1RhYmxlQ29kZV0pKSB7XHJcblx0XHRcdFx0XHR0YWJsZUZpZWxkQ29kZXMucHVzaChKU09OLnN0cmluZ2lmeSh7XHJcblx0XHRcdFx0XHRcdHdvcmtmbG93X3RhYmxlX2ZpZWxkX2NvZGU6IHdUYWJsZUNvZGUsXHJcblx0XHRcdFx0XHRcdG9iamVjdF90YWJsZV9maWVsZF9jb2RlOiBvVGFibGVDb2RlXHJcblx0XHRcdFx0XHR9KSk7XHJcblx0XHRcdFx0XHR0YWJsZUZpZWxkTWFwLnB1c2goZm0pO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAodmFsdWVzLmhhc093blByb3BlcnR5KGZtLndvcmtmbG93X2ZpZWxkKSkge1xyXG5cdFx0XHRcdHZhciB3RmllbGQgPSBudWxsO1xyXG5cclxuXHRcdFx0XHRfLmVhY2goZm9ybUZpZWxkcywgZnVuY3Rpb24gKGZmKSB7XHJcblx0XHRcdFx0XHRpZiAoIXdGaWVsZCkge1xyXG5cdFx0XHRcdFx0XHRpZiAoZmYuY29kZSA9PT0gZm0ud29ya2Zsb3dfZmllbGQpIHtcclxuXHRcdFx0XHRcdFx0XHR3RmllbGQgPSBmZjtcclxuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChmZi50eXBlID09PSAnc2VjdGlvbicpIHtcclxuXHRcdFx0XHRcdFx0XHRfLmVhY2goZmYuZmllbGRzLCBmdW5jdGlvbiAoZikge1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKCF3RmllbGQpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKGYuY29kZSA9PT0gZm0ud29ya2Zsb3dfZmllbGQpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR3RmllbGQgPSBmO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pXHJcblxyXG5cdFx0XHRcdHZhciBvRmllbGQgPSBvYmplY3RGaWVsZHNbZm0ub2JqZWN0X2ZpZWxkXTtcclxuXHJcblx0XHRcdFx0aWYgKG9GaWVsZCkge1xyXG5cdFx0XHRcdFx0aWYgKCF3RmllbGQpIHtcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coJ2ZtLndvcmtmbG93X2ZpZWxkOiAnLCBmbS53b3JrZmxvd19maWVsZClcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdC8vIOihqOWNlemAieS6uumAiee7hOWtl+autSDoh7Mg5a+56LGhIGxvb2t1cCBtYXN0ZXJfZGV0YWls57G75Z6L5a2X5q615ZCM5q2lXHJcblx0XHRcdFx0XHRpZiAoWyd1c2VyJywgJ2dyb3VwJ10uaW5jbHVkZXMod0ZpZWxkLnR5cGUpICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhvRmllbGQudHlwZSkgJiYgWyd1c2VycycsICdvcmdhbml6YXRpb25zJ10uaW5jbHVkZXMob0ZpZWxkLnJlZmVyZW5jZV90bykpIHtcclxuXHRcdFx0XHRcdFx0aWYgKCFfLmlzRW1wdHkodmFsdWVzW2ZtLndvcmtmbG93X2ZpZWxkXSkpIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAob0ZpZWxkLm11bHRpcGxlICYmIHdGaWVsZC5pc19tdWx0aXNlbGVjdCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0b2JqW2ZtLm9iamVjdF9maWVsZF0gPSBfLmNvbXBhY3QoXy5wbHVjayh2YWx1ZXNbZm0ud29ya2Zsb3dfZmllbGRdLCAnaWQnKSlcclxuXHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCFvRmllbGQubXVsdGlwbGUgJiYgIXdGaWVsZC5pc19tdWx0aXNlbGVjdCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0b2JqW2ZtLm9iamVjdF9maWVsZF0gPSB2YWx1ZXNbZm0ud29ya2Zsb3dfZmllbGRdLmlkXHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlIGlmICghb0ZpZWxkLm11bHRpcGxlICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhvRmllbGQudHlwZSkgJiYgXy5pc1N0cmluZyhvRmllbGQucmVmZXJlbmNlX3RvKSAmJiBfLmlzU3RyaW5nKHZhbHVlc1tmbS53b3JrZmxvd19maWVsZF0pKSB7XHJcblx0XHRcdFx0XHRcdHZhciBvQ29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvRmllbGQucmVmZXJlbmNlX3RvLCBzcGFjZUlkKVxyXG5cdFx0XHRcdFx0XHR2YXIgcmVmZXJPYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvRmllbGQucmVmZXJlbmNlX3RvLCBzcGFjZUlkKVxyXG5cdFx0XHRcdFx0XHRpZiAob0NvbGxlY3Rpb24gJiYgcmVmZXJPYmplY3QpIHtcclxuXHRcdFx0XHRcdFx0XHQvLyDlhYjorqTkuLrmraTlgLzmmK9yZWZlck9iamVjdCBfaWTlrZfmrrXlgLxcclxuXHRcdFx0XHRcdFx0XHR2YXIgcmVmZXJEYXRhID0gb0NvbGxlY3Rpb24uZmluZE9uZSh2YWx1ZXNbZm0ud29ya2Zsb3dfZmllbGRdLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRmaWVsZHM6IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0X2lkOiAxXHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0aWYgKHJlZmVyRGF0YSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0b2JqW2ZtLm9iamVjdF9maWVsZF0gPSByZWZlckRhdGEuX2lkO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0Ly8g5YW25qyh6K6k5Li65q2k5YC85pivcmVmZXJPYmplY3QgTkFNRV9GSUVMRF9LRVnlgLxcclxuXHRcdFx0XHRcdFx0XHRpZiAoIXJlZmVyRGF0YSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0dmFyIG5hbWVGaWVsZEtleSA9IHJlZmVyT2JqZWN0Lk5BTUVfRklFTERfS0VZO1xyXG5cdFx0XHRcdFx0XHRcdFx0dmFyIHNlbGVjdG9yID0ge307XHJcblx0XHRcdFx0XHRcdFx0XHRzZWxlY3RvcltuYW1lRmllbGRLZXldID0gdmFsdWVzW2ZtLndvcmtmbG93X2ZpZWxkXTtcclxuXHRcdFx0XHRcdFx0XHRcdHJlZmVyRGF0YSA9IG9Db2xsZWN0aW9uLmZpbmRPbmUoc2VsZWN0b3IsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZmllbGRzOiB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0X2lkOiAxXHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKHJlZmVyRGF0YSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRvYmpbZm0ub2JqZWN0X2ZpZWxkXSA9IHJlZmVyRGF0YS5faWQ7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdGlmIChvRmllbGQudHlwZSA9PT0gXCJib29sZWFuXCIpIHtcclxuXHRcdFx0XHRcdFx0XHR2YXIgdG1wX2ZpZWxkX3ZhbHVlID0gdmFsdWVzW2ZtLndvcmtmbG93X2ZpZWxkXTtcclxuXHRcdFx0XHRcdFx0XHRpZiAoWyd0cnVlJywgJ+aYryddLmluY2x1ZGVzKHRtcF9maWVsZF92YWx1ZSkpIHtcclxuXHRcdFx0XHRcdFx0XHRcdG9ialtmbS5vYmplY3RfZmllbGRdID0gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKFsnZmFsc2UnLCAn5ZCmJ10uaW5jbHVkZXModG1wX2ZpZWxkX3ZhbHVlKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0b2JqW2ZtLm9iamVjdF9maWVsZF0gPSBmYWxzZTtcclxuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0b2JqW2ZtLm9iamVjdF9maWVsZF0gPSB0bXBfZmllbGRfdmFsdWU7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGVsc2UgaWYgKFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhvRmllbGQudHlwZSkgJiYgd0ZpZWxkLnR5cGUgPT09ICdvZGF0YScpIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAob0ZpZWxkLm11bHRpcGxlICYmIHdGaWVsZC5pc19tdWx0aXNlbGVjdCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0b2JqW2ZtLm9iamVjdF9maWVsZF0gPSBfLmNvbXBhY3QoXy5wbHVjayh2YWx1ZXNbZm0ud29ya2Zsb3dfZmllbGRdLCAnX2lkJykpXHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmICghb0ZpZWxkLm11bHRpcGxlICYmICF3RmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcclxuXHRcdFx0XHRcdFx0XHRcdGlmICghXy5pc0VtcHR5KHZhbHVlc1tmbS53b3JrZmxvd19maWVsZF0pKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdG9ialtmbS5vYmplY3RfZmllbGRdID0gdmFsdWVzW2ZtLndvcmtmbG93X2ZpZWxkXS5faWRcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0b2JqW2ZtLm9iamVjdF9maWVsZF0gPSB2YWx1ZXNbZm0ud29ya2Zsb3dfZmllbGRdO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRvYmpbZm0ub2JqZWN0X2ZpZWxkXSA9IHZhbHVlc1tmbS53b3JrZmxvd19maWVsZF07XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0aWYgKGZtLm9iamVjdF9maWVsZC5pbmRleE9mKCcuJykgPiAtMSkge1xyXG5cdFx0XHRcdFx0XHR2YXIgdGVtT2JqRmllbGRzID0gZm0ub2JqZWN0X2ZpZWxkLnNwbGl0KCcuJyk7XHJcblx0XHRcdFx0XHRcdGlmICh0ZW1PYmpGaWVsZHMubGVuZ3RoID09PSAyKSB7XHJcblx0XHRcdFx0XHRcdFx0dmFyIG9iakZpZWxkID0gdGVtT2JqRmllbGRzWzBdO1xyXG5cdFx0XHRcdFx0XHRcdHZhciByZWZlck9iakZpZWxkID0gdGVtT2JqRmllbGRzWzFdO1xyXG5cdFx0XHRcdFx0XHRcdHZhciBvRmllbGQgPSBvYmplY3RGaWVsZHNbb2JqRmllbGRdO1xyXG5cdFx0XHRcdFx0XHRcdGlmICghb0ZpZWxkLm11bHRpcGxlICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhvRmllbGQudHlwZSkgJiYgXy5pc1N0cmluZyhvRmllbGQucmVmZXJlbmNlX3RvKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0dmFyIG9Db2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9GaWVsZC5yZWZlcmVuY2VfdG8sIHNwYWNlSWQpXHJcblx0XHRcdFx0XHRcdFx0XHRpZiAob0NvbGxlY3Rpb24gJiYgcmVjb3JkICYmIHJlY29yZFtvYmpGaWVsZF0pIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0dmFyIHJlZmVyU2V0T2JqID0ge307XHJcblx0XHRcdFx0XHRcdFx0XHRcdHJlZmVyU2V0T2JqW3JlZmVyT2JqRmllbGRdID0gdmFsdWVzW2ZtLndvcmtmbG93X2ZpZWxkXTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0b0NvbGxlY3Rpb24udXBkYXRlKHJlY29yZFtvYmpGaWVsZF0sIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQkc2V0OiByZWZlclNldE9ialxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Ly8gZWxzZXtcclxuXHRcdFx0XHRcdC8vIFx0dmFyIHJlbGF0ZWRPYmplY3QgPSBfLmZpbmQocmVsYXRlZE9iamVjdHMsIGZ1bmN0aW9uKF9yZWxhdGVkT2JqZWN0KXtcclxuXHRcdFx0XHRcdC8vIFx0XHRyZXR1cm4gX3JlbGF0ZWRPYmplY3Qub2JqZWN0X25hbWUgPT09IGZtLm9iamVjdF9maWVsZFxyXG5cdFx0XHRcdFx0Ly8gXHR9KVxyXG5cdFx0XHRcdFx0Ly9cclxuXHRcdFx0XHRcdC8vIFx0aWYocmVsYXRlZE9iamVjdCl7XHJcblx0XHRcdFx0XHQvLyBcdFx0b2JqW2ZtLm9iamVjdF9maWVsZF0gPSB2YWx1ZXNbZm0ud29ya2Zsb3dfZmllbGRdO1xyXG5cdFx0XHRcdFx0Ly8gXHR9XHJcblx0XHRcdFx0XHQvLyB9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRpZiAoZm0ud29ya2Zsb3dfZmllbGQuc3RhcnRzV2l0aCgnaW5zdGFuY2UuJykpIHtcclxuXHRcdFx0XHRcdHZhciBpbnNGaWVsZCA9IGZtLndvcmtmbG93X2ZpZWxkLnNwbGl0KCdpbnN0YW5jZS4nKVsxXTtcclxuXHRcdFx0XHRcdGlmIChzZWxmLnN5bmNJbnNGaWVsZHMuaW5jbHVkZXMoaW5zRmllbGQpKSB7XHJcblx0XHRcdFx0XHRcdGlmIChmbS5vYmplY3RfZmllbGQuaW5kZXhPZignLicpIDwgMCkge1xyXG5cdFx0XHRcdFx0XHRcdG9ialtmbS5vYmplY3RfZmllbGRdID0gaW5zW2luc0ZpZWxkXTtcclxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHR2YXIgdGVtT2JqRmllbGRzID0gZm0ub2JqZWN0X2ZpZWxkLnNwbGl0KCcuJyk7XHJcblx0XHRcdFx0XHRcdFx0aWYgKHRlbU9iakZpZWxkcy5sZW5ndGggPT09IDIpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHZhciBvYmpGaWVsZCA9IHRlbU9iakZpZWxkc1swXTtcclxuXHRcdFx0XHRcdFx0XHRcdHZhciByZWZlck9iakZpZWxkID0gdGVtT2JqRmllbGRzWzFdO1xyXG5cdFx0XHRcdFx0XHRcdFx0dmFyIG9GaWVsZCA9IG9iamVjdEZpZWxkc1tvYmpGaWVsZF07XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoIW9GaWVsZC5tdWx0aXBsZSAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMob0ZpZWxkLnR5cGUpICYmIF8uaXNTdHJpbmcob0ZpZWxkLnJlZmVyZW5jZV90bykpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0dmFyIG9Db2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9GaWVsZC5yZWZlcmVuY2VfdG8sIHNwYWNlSWQpXHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChvQ29sbGVjdGlvbiAmJiByZWNvcmQgJiYgcmVjb3JkW29iakZpZWxkXSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHZhciByZWZlclNldE9iaiA9IHt9O1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJlZmVyU2V0T2JqW3JlZmVyT2JqRmllbGRdID0gaW5zW2luc0ZpZWxkXTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRvQ29sbGVjdGlvbi51cGRhdGUocmVjb3JkW29iakZpZWxkXSwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0JHNldDogcmVmZXJTZXRPYmpcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRpZiAoaW5zW2ZtLndvcmtmbG93X2ZpZWxkXSkge1xyXG5cdFx0XHRcdFx0XHRvYmpbZm0ub2JqZWN0X2ZpZWxkXSA9IGluc1tmbS53b3JrZmxvd19maWVsZF07XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KVxyXG5cclxuXHRcdF8udW5pcSh0YWJsZUZpZWxkQ29kZXMpLmZvckVhY2goZnVuY3Rpb24gKHRmYykge1xyXG5cdFx0XHR2YXIgYyA9IEpTT04ucGFyc2UodGZjKTtcclxuXHRcdFx0b2JqW2Mub2JqZWN0X3RhYmxlX2ZpZWxkX2NvZGVdID0gW107XHJcblx0XHRcdHZhbHVlc1tjLndvcmtmbG93X3RhYmxlX2ZpZWxkX2NvZGVdLmZvckVhY2goZnVuY3Rpb24gKHRyKSB7XHJcblx0XHRcdFx0dmFyIG5ld1RyID0ge307XHJcblx0XHRcdFx0Xy5lYWNoKHRyLCBmdW5jdGlvbiAodiwgaykge1xyXG5cdFx0XHRcdFx0dGFibGVGaWVsZE1hcC5mb3JFYWNoKGZ1bmN0aW9uICh0Zm0pIHtcclxuXHRcdFx0XHRcdFx0aWYgKHRmbS53b3JrZmxvd19maWVsZCA9PSAoYy53b3JrZmxvd190YWJsZV9maWVsZF9jb2RlICsgJy4kLicgKyBrKSkge1xyXG5cdFx0XHRcdFx0XHRcdHZhciBvVGRDb2RlID0gdGZtLm9iamVjdF9maWVsZC5zcGxpdCgnLiQuJylbMV07XHJcblx0XHRcdFx0XHRcdFx0bmV3VHJbb1RkQ29kZV0gPSB2O1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdH0pXHJcblx0XHRcdFx0aWYgKCFfLmlzRW1wdHkobmV3VHIpKSB7XHJcblx0XHRcdFx0XHRvYmpbYy5vYmplY3RfdGFibGVfZmllbGRfY29kZV0ucHVzaChuZXdUcik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KVxyXG5cdFx0fSk7XHJcblx0XHR2YXIgcmVsYXRlZE9ianMgPSB7fTtcclxuXHRcdHZhciBnZXRSZWxhdGVkRmllbGRWYWx1ZSA9IGZ1bmN0aW9uICh2YWx1ZUtleSwgcGFyZW50KSB7XHJcblx0XHRcdHJldHVybiB2YWx1ZUtleS5zcGxpdCgnLicpLnJlZHVjZShmdW5jdGlvbiAobywgeCkge1xyXG5cdFx0XHRcdHJldHVybiBvW3hdO1xyXG5cdFx0XHR9LCBwYXJlbnQpO1xyXG5cdFx0fTtcclxuXHRcdF8uZWFjaCh0YWJsZVRvUmVsYXRlZE1hcCwgZnVuY3Rpb24gKG1hcCwga2V5KSB7XHJcblx0XHRcdHZhciB0YWJsZUNvZGUgPSBtYXAuX0ZST01fVEFCTEVfQ09ERTtcclxuXHRcdFx0aWYgKCF0YWJsZUNvZGUpIHtcclxuXHRcdFx0XHRjb25zb2xlLndhcm4oJ3RhYmxlVG9SZWxhdGVkOiBbJyArIGtleSArICddIG1pc3NpbmcgY29ycmVzcG9uZGluZyB0YWJsZS4nKVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHZhciByZWxhdGVkT2JqZWN0TmFtZSA9IGtleTtcclxuXHRcdFx0XHR2YXIgcmVsYXRlZE9iamVjdFZhbHVlcyA9IFtdO1xyXG5cdFx0XHRcdHZhciByZWxhdGVkT2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QocmVsYXRlZE9iamVjdE5hbWUsIHNwYWNlSWQpO1xyXG5cdFx0XHRcdF8uZWFjaCh2YWx1ZXNbdGFibGVDb2RlXSwgZnVuY3Rpb24gKHRhYmxlVmFsdWVJdGVtKSB7XHJcblx0XHRcdFx0XHR2YXIgcmVsYXRlZE9iamVjdFZhbHVlID0ge307XHJcblx0XHRcdFx0XHRfLmVhY2gobWFwLCBmdW5jdGlvbiAodmFsdWVLZXksIGZpZWxkS2V5KSB7XHJcblx0XHRcdFx0XHRcdGlmIChmaWVsZEtleSAhPSAnX0ZST01fVEFCTEVfQ09ERScpIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAodmFsdWVLZXkuc3RhcnRzV2l0aCgnaW5zdGFuY2UuJykpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHJlbGF0ZWRPYmplY3RWYWx1ZVtmaWVsZEtleV0gPSBnZXRSZWxhdGVkRmllbGRWYWx1ZSh2YWx1ZUtleSwgeyAnaW5zdGFuY2UnOiBpbnMgfSk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0dmFyIHJlbGF0ZWRPYmplY3RGaWVsZFZhbHVlLCBmb3JtRmllbGRLZXk7XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAodmFsdWVLZXkuc3RhcnRzV2l0aCh0YWJsZUNvZGUgKyAnLicpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGZvcm1GaWVsZEtleSA9IHZhbHVlS2V5LnNwbGl0KFwiLlwiKVsxXTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0cmVsYXRlZE9iamVjdEZpZWxkVmFsdWUgPSBnZXRSZWxhdGVkRmllbGRWYWx1ZSh2YWx1ZUtleSwgeyBbdGFibGVDb2RlXTogdGFibGVWYWx1ZUl0ZW0gfSk7XHJcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRmb3JtRmllbGRLZXkgPSB2YWx1ZUtleTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0cmVsYXRlZE9iamVjdEZpZWxkVmFsdWUgPSBnZXRSZWxhdGVkRmllbGRWYWx1ZSh2YWx1ZUtleSwgdmFsdWVzKVxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0dmFyIGZvcm1GaWVsZCA9IGdldEZvcm1GaWVsZChmb3JtRmllbGRzLCBmb3JtRmllbGRLZXkpO1xyXG5cdFx0XHRcdFx0XHRcdFx0dmFyIHJlbGF0ZWRPYmplY3RGaWVsZCA9IHJlbGF0ZWRPYmplY3QuZmllbGRzW2ZpZWxkS2V5XTtcclxuXHRcdFx0XHRcdFx0XHRcdGlmICghcmVsYXRlZE9iamVjdEZpZWxkIHx8ICFmb3JtRmllbGQpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuXHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoZm9ybUZpZWxkLnR5cGUgPT0gJ29kYXRhJyAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMocmVsYXRlZE9iamVjdEZpZWxkLnR5cGUpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmICghXy5pc0VtcHR5KHJlbGF0ZWRPYmplY3RGaWVsZFZhbHVlKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChyZWxhdGVkT2JqZWN0RmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZWxhdGVkT2JqZWN0RmllbGRWYWx1ZSA9IF8uY29tcGFjdChfLnBsdWNrKHJlbGF0ZWRPYmplY3RGaWVsZFZhbHVlLCAnX2lkJykpXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmICghcmVsYXRlZE9iamVjdEZpZWxkLm11bHRpcGxlICYmICFmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJlbGF0ZWRPYmplY3RGaWVsZFZhbHVlID0gcmVsYXRlZE9iamVjdEZpZWxkVmFsdWUuX2lkXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHQvLyDooajljZXpgInkurrpgInnu4TlrZfmrrUg6IezIOWvueixoSBsb29rdXAgbWFzdGVyX2RldGFpbOexu+Wei+Wtl+auteWQjOatpVxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKFsndXNlcicsICdncm91cCddLmluY2x1ZGVzKGZvcm1GaWVsZC50eXBlKSAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMocmVsYXRlZE9iamVjdEZpZWxkLnR5cGUpICYmIFsndXNlcnMnLCAnb3JnYW5pemF0aW9ucyddLmluY2x1ZGVzKHJlbGF0ZWRPYmplY3RGaWVsZC5yZWZlcmVuY2VfdG8pKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmICghXy5pc0VtcHR5KHJlbGF0ZWRPYmplY3RGaWVsZFZhbHVlKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChyZWxhdGVkT2JqZWN0RmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZWxhdGVkT2JqZWN0RmllbGRWYWx1ZSA9IF8uY29tcGFjdChfLnBsdWNrKHJlbGF0ZWRPYmplY3RGaWVsZFZhbHVlLCAnaWQnKSlcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCFyZWxhdGVkT2JqZWN0RmllbGQubXVsdGlwbGUgJiYgIWZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmVsYXRlZE9iamVjdEZpZWxkVmFsdWUgPSByZWxhdGVkT2JqZWN0RmllbGRWYWx1ZS5pZFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0cmVsYXRlZE9iamVjdFZhbHVlW2ZpZWxkS2V5XSA9IHJlbGF0ZWRPYmplY3RGaWVsZFZhbHVlO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRyZWxhdGVkT2JqZWN0VmFsdWVbJ190YWJsZSddID0ge1xyXG5cdFx0XHRcdFx0XHRfaWQ6IHRhYmxlVmFsdWVJdGVtW1wiX2lkXCJdLFxyXG5cdFx0XHRcdFx0XHRfY29kZTogdGFibGVDb2RlXHJcblx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0cmVsYXRlZE9iamVjdFZhbHVlcy5wdXNoKHJlbGF0ZWRPYmplY3RWYWx1ZSk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0cmVsYXRlZE9ianNbcmVsYXRlZE9iamVjdE5hbWVdID0gcmVsYXRlZE9iamVjdFZhbHVlcztcclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHJcblx0XHRpZiAoZmllbGRfbWFwX2JhY2tfc2NyaXB0KSB7XHJcblx0XHRcdF8uZXh0ZW5kKG9iaiwgc2VsZi5ldmFsRmllbGRNYXBCYWNrU2NyaXB0KGZpZWxkX21hcF9iYWNrX3NjcmlwdCwgaW5zKSk7XHJcblx0XHR9XHJcblx0XHQvLyDov4fmu6TmjonpnZ7ms5XnmoRrZXlcclxuXHRcdHZhciBmaWx0ZXJPYmogPSB7fTtcclxuXHJcblx0XHRfLmVhY2goXy5rZXlzKG9iaiksIGZ1bmN0aW9uIChrKSB7XHJcblx0XHRcdGlmIChvYmplY3RGaWVsZEtleXMuaW5jbHVkZXMoaykpIHtcclxuXHRcdFx0XHRmaWx0ZXJPYmpba10gPSBvYmpba107XHJcblx0XHRcdH1cclxuXHRcdFx0Ly8gZWxzZSBpZihyZWxhdGVkT2JqZWN0c0tleXMuaW5jbHVkZXMoaykgJiYgXy5pc0FycmF5KG9ialtrXSkpe1xyXG5cdFx0XHQvLyBcdGlmKF8uaXNBcnJheShyZWxhdGVkT2Jqc1trXSkpe1xyXG5cdFx0XHQvLyBcdFx0cmVsYXRlZE9ianNba10gPSByZWxhdGVkT2Jqc1trXS5jb25jYXQob2JqW2tdKVxyXG5cdFx0XHQvLyBcdH1lbHNle1xyXG5cdFx0XHQvLyBcdFx0cmVsYXRlZE9ianNba10gPSBvYmpba11cclxuXHRcdFx0Ly8gXHR9XHJcblx0XHRcdC8vIH1cclxuXHRcdH0pXHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRtYWluT2JqZWN0VmFsdWU6IGZpbHRlck9iaixcclxuXHRcdFx0cmVsYXRlZE9iamVjdHNWYWx1ZTogcmVsYXRlZE9ianNcclxuXHRcdH07XHJcblx0fVxyXG5cclxuXHRzZWxmLmV2YWxGaWVsZE1hcEJhY2tTY3JpcHQgPSBmdW5jdGlvbiAoZmllbGRfbWFwX2JhY2tfc2NyaXB0LCBpbnMpIHtcclxuXHRcdHZhciBzY3JpcHQgPSBcIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7IFwiICsgZmllbGRfbWFwX2JhY2tfc2NyaXB0ICsgXCIgfVwiO1xyXG5cdFx0dmFyIGZ1bmMgPSBfZXZhbChzY3JpcHQsIFwiZmllbGRfbWFwX3NjcmlwdFwiKTtcclxuXHRcdHZhciB2YWx1ZXMgPSBmdW5jKGlucyk7XHJcblx0XHRpZiAoXy5pc09iamVjdCh2YWx1ZXMpKSB7XHJcblx0XHRcdHJldHVybiB2YWx1ZXM7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRjb25zb2xlLmVycm9yKFwiZXZhbEZpZWxkTWFwQmFja1NjcmlwdDog6ISa5pys6L+U5Zue5YC857G75Z6L5LiN5piv5a+56LGhXCIpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHt9XHJcblx0fVxyXG5cclxuXHRzZWxmLnN5bmNSZWxhdGVkT2JqZWN0c1ZhbHVlID0gZnVuY3Rpb24gKG1haW5SZWNvcmRJZCwgcmVsYXRlZE9iamVjdHMsIHJlbGF0ZWRPYmplY3RzVmFsdWUsIHNwYWNlSWQsIGlucykge1xyXG5cdFx0dmFyIGluc0lkID0gaW5zLl9pZDtcclxuXHJcblx0XHRfLmVhY2gocmVsYXRlZE9iamVjdHMsIGZ1bmN0aW9uIChyZWxhdGVkT2JqZWN0KSB7XHJcblx0XHRcdHZhciBvYmplY3RDb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlbGF0ZWRPYmplY3Qub2JqZWN0X25hbWUsIHNwYWNlSWQpO1xyXG5cdFx0XHR2YXIgdGFibGVNYXAgPSB7fTtcclxuXHRcdFx0Xy5lYWNoKHJlbGF0ZWRPYmplY3RzVmFsdWVbcmVsYXRlZE9iamVjdC5vYmplY3RfbmFtZV0sIGZ1bmN0aW9uIChyZWxhdGVkT2JqZWN0VmFsdWUpIHtcclxuXHRcdFx0XHR2YXIgdGFibGVfaWQgPSByZWxhdGVkT2JqZWN0VmFsdWUuX3RhYmxlLl9pZDtcclxuXHRcdFx0XHR2YXIgdGFibGVfY29kZSA9IHJlbGF0ZWRPYmplY3RWYWx1ZS5fdGFibGUuX2NvZGU7XHJcblx0XHRcdFx0aWYgKCF0YWJsZU1hcFt0YWJsZV9jb2RlXSkge1xyXG5cdFx0XHRcdFx0dGFibGVNYXBbdGFibGVfY29kZV0gPSBbXVxyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0dGFibGVNYXBbdGFibGVfY29kZV0ucHVzaCh0YWJsZV9pZCk7XHJcblx0XHRcdFx0dmFyIG9sZFJlbGF0ZWRSZWNvcmQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVsYXRlZE9iamVjdC5vYmplY3RfbmFtZSwgc3BhY2VJZCkuZmluZE9uZSh7IFtyZWxhdGVkT2JqZWN0LmZvcmVpZ25fa2V5XTogbWFpblJlY29yZElkLCBcImluc3RhbmNlcy5faWRcIjogaW5zSWQsIF90YWJsZTogcmVsYXRlZE9iamVjdFZhbHVlLl90YWJsZSB9LCB7IGZpZWxkczogeyBfaWQ6IDEgfSB9KVxyXG5cdFx0XHRcdGlmIChvbGRSZWxhdGVkUmVjb3JkKSB7XHJcblx0XHRcdFx0XHRDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVsYXRlZE9iamVjdC5vYmplY3RfbmFtZSwgc3BhY2VJZCkudXBkYXRlKHsgX2lkOiBvbGRSZWxhdGVkUmVjb3JkLl9pZCB9LCB7ICRzZXQ6IHJlbGF0ZWRPYmplY3RWYWx1ZSB9KVxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRyZWxhdGVkT2JqZWN0VmFsdWVbcmVsYXRlZE9iamVjdC5mb3JlaWduX2tleV0gPSBtYWluUmVjb3JkSWQ7XHJcblx0XHRcdFx0XHRyZWxhdGVkT2JqZWN0VmFsdWUuc3BhY2UgPSBzcGFjZUlkO1xyXG5cdFx0XHRcdFx0cmVsYXRlZE9iamVjdFZhbHVlLm93bmVyID0gaW5zLmFwcGxpY2FudDtcclxuXHRcdFx0XHRcdHJlbGF0ZWRPYmplY3RWYWx1ZS5jcmVhdGVkX2J5ID0gaW5zLmFwcGxpY2FudDtcclxuXHRcdFx0XHRcdHJlbGF0ZWRPYmplY3RWYWx1ZS5tb2RpZmllZF9ieSA9IGlucy5hcHBsaWNhbnQ7XHJcblx0XHRcdFx0XHRyZWxhdGVkT2JqZWN0VmFsdWUuX2lkID0gb2JqZWN0Q29sbGVjdGlvbi5fbWFrZU5ld0lEKCk7XHJcblx0XHRcdFx0XHR2YXIgaW5zdGFuY2Vfc3RhdGUgPSBpbnMuc3RhdGU7XHJcblx0XHRcdFx0XHRpZiAoaW5zLnN0YXRlID09PSAnY29tcGxldGVkJyAmJiBpbnMuZmluYWxfZGVjaXNpb24pIHtcclxuXHRcdFx0XHRcdFx0aW5zdGFuY2Vfc3RhdGUgPSBpbnMuZmluYWxfZGVjaXNpb247XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRyZWxhdGVkT2JqZWN0VmFsdWUuaW5zdGFuY2VzID0gW3tcclxuXHRcdFx0XHRcdFx0X2lkOiBpbnNJZCxcclxuXHRcdFx0XHRcdFx0c3RhdGU6IGluc3RhbmNlX3N0YXRlXHJcblx0XHRcdFx0XHR9XTtcclxuXHRcdFx0XHRcdHJlbGF0ZWRPYmplY3RWYWx1ZS5pbnN0YW5jZV9zdGF0ZSA9IGluc3RhbmNlX3N0YXRlO1xyXG5cdFx0XHRcdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlbGF0ZWRPYmplY3Qub2JqZWN0X25hbWUsIHNwYWNlSWQpLmluc2VydChyZWxhdGVkT2JqZWN0VmFsdWUsIHsgdmFsaWRhdGU6IGZhbHNlLCBmaWx0ZXI6IGZhbHNlIH0pXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KVxyXG5cdFx0XHQvL+a4heeQhueUs+ivt+WNleS4iuiiq+WIoOmZpOWtkOihqOiusOW9leWvueW6lOeahOebuOWFs+ihqOiusOW9lVxyXG5cdFx0XHRfLmVhY2godGFibGVNYXAsIGZ1bmN0aW9uICh0YWJsZUlkcywgdGFibGVDb2RlKSB7XHJcblx0XHRcdFx0b2JqZWN0Q29sbGVjdGlvbi5yZW1vdmUoe1xyXG5cdFx0XHRcdFx0W3JlbGF0ZWRPYmplY3QuZm9yZWlnbl9rZXldOiBtYWluUmVjb3JkSWQsXHJcblx0XHRcdFx0XHRcImluc3RhbmNlcy5faWRcIjogaW5zSWQsXHJcblx0XHRcdFx0XHRcIl90YWJsZS5fY29kZVwiOiB0YWJsZUNvZGUsXHJcblx0XHRcdFx0XHRcIl90YWJsZS5faWRcIjogeyAkbmluOiB0YWJsZUlkcyB9XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0fSlcclxuXHRcdH0pO1xyXG5cclxuXHRcdHRhYmxlSWRzID0gXy5jb21wYWN0KHRhYmxlSWRzKTtcclxuXHJcblxyXG5cdH1cclxuXHJcblx0c2VsZi5zZW5kRG9jID0gZnVuY3Rpb24gKGRvYykge1xyXG5cdFx0aWYgKEluc3RhbmNlUmVjb3JkUXVldWUuZGVidWcpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coXCJzZW5kRG9jXCIpO1xyXG5cdFx0XHRjb25zb2xlLmxvZyhkb2MpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBpbnNJZCA9IGRvYy5pbmZvLmluc3RhbmNlX2lkLFxyXG5cdFx0XHRyZWNvcmRzID0gZG9jLmluZm8ucmVjb3JkcztcclxuXHRcdHZhciBmaWVsZHMgPSB7XHJcblx0XHRcdGZsb3c6IDEsXHJcblx0XHRcdHZhbHVlczogMSxcclxuXHRcdFx0YXBwbGljYW50OiAxLFxyXG5cdFx0XHRzcGFjZTogMSxcclxuXHRcdFx0Zm9ybTogMSxcclxuXHRcdFx0Zm9ybV92ZXJzaW9uOiAxLFxyXG5cdFx0XHR0cmFjZXM6IDFcclxuXHRcdH07XHJcblx0XHRzZWxmLnN5bmNJbnNGaWVsZHMuZm9yRWFjaChmdW5jdGlvbiAoZikge1xyXG5cdFx0XHRmaWVsZHNbZl0gPSAxO1xyXG5cdFx0fSlcclxuXHRcdHZhciBpbnMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2luc3RhbmNlcycpLmZpbmRPbmUoaW5zSWQsIHtcclxuXHRcdFx0ZmllbGRzOiBmaWVsZHNcclxuXHRcdH0pO1xyXG5cdFx0dmFyIHZhbHVlcyA9IGlucy52YWx1ZXMsXHJcblx0XHRcdHNwYWNlSWQgPSBpbnMuc3BhY2U7XHJcblxyXG5cdFx0aWYgKHJlY29yZHMgJiYgIV8uaXNFbXB0eShyZWNvcmRzKSkge1xyXG5cdFx0XHQvLyDmraTmg4XlhrXlsZ7kuo7ku45jcmVhdG9y5Lit5Y+R6LW35a6h5om577yM5oiW6ICF5bey57uP5LuOQXBwc+WQjOatpeWIsOS6hmNyZWF0b3JcclxuXHRcdFx0dmFyIG9iamVjdE5hbWUgPSByZWNvcmRzWzBdLm87XHJcblx0XHRcdHZhciBvdyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignb2JqZWN0X3dvcmtmbG93cycpLmZpbmRPbmUoe1xyXG5cdFx0XHRcdG9iamVjdF9uYW1lOiBvYmplY3ROYW1lLFxyXG5cdFx0XHRcdGZsb3dfaWQ6IGlucy5mbG93XHJcblx0XHRcdH0pO1xyXG5cdFx0XHR2YXJcclxuXHRcdFx0XHRvYmplY3RDb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdE5hbWUsIHNwYWNlSWQpLFxyXG5cdFx0XHRcdHN5bmNfYXR0YWNobWVudCA9IG93LnN5bmNfYXR0YWNobWVudDtcclxuXHRcdFx0dmFyIG9iamVjdEluZm8gPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3ROYW1lLCBzcGFjZUlkKTtcclxuXHRcdFx0b2JqZWN0Q29sbGVjdGlvbi5maW5kKHtcclxuXHRcdFx0XHRfaWQ6IHtcclxuXHRcdFx0XHRcdCRpbjogcmVjb3Jkc1swXS5pZHNcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pLmZvckVhY2goZnVuY3Rpb24gKHJlY29yZCkge1xyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHR2YXIgc3luY1ZhbHVlcyA9IHNlbGYuc3luY1ZhbHVlcyhvdy5maWVsZF9tYXBfYmFjaywgdmFsdWVzLCBpbnMsIG9iamVjdEluZm8sIG93LmZpZWxkX21hcF9iYWNrX3NjcmlwdCwgcmVjb3JkKVxyXG5cdFx0XHRcdFx0dmFyIHNldE9iaiA9IHN5bmNWYWx1ZXMubWFpbk9iamVjdFZhbHVlO1xyXG5cclxuXHRcdFx0XHRcdHZhciBpbnN0YW5jZV9zdGF0ZSA9IGlucy5zdGF0ZTtcclxuXHRcdFx0XHRcdGlmIChpbnMuc3RhdGUgPT09ICdjb21wbGV0ZWQnICYmIGlucy5maW5hbF9kZWNpc2lvbikge1xyXG5cdFx0XHRcdFx0XHRpbnN0YW5jZV9zdGF0ZSA9IGlucy5maW5hbF9kZWNpc2lvbjtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHNldE9ialsnaW5zdGFuY2VzLiQuc3RhdGUnXSA9IHNldE9iai5pbnN0YW5jZV9zdGF0ZSA9IGluc3RhbmNlX3N0YXRlO1xyXG5cclxuXHRcdFx0XHRcdG9iamVjdENvbGxlY3Rpb24udXBkYXRlKHtcclxuXHRcdFx0XHRcdFx0X2lkOiByZWNvcmQuX2lkLFxyXG5cdFx0XHRcdFx0XHQnaW5zdGFuY2VzLl9pZCc6IGluc0lkXHJcblx0XHRcdFx0XHR9LCB7XHJcblx0XHRcdFx0XHRcdCRzZXQ6IHNldE9ialxyXG5cdFx0XHRcdFx0fSlcclxuXHJcblx0XHRcdFx0XHR2YXIgcmVsYXRlZE9iamVjdHMgPSBDcmVhdG9yLmdldFJlbGF0ZWRPYmplY3RzKG93Lm9iamVjdF9uYW1lLCBzcGFjZUlkKTtcclxuXHRcdFx0XHRcdHZhciByZWxhdGVkT2JqZWN0c1ZhbHVlID0gc3luY1ZhbHVlcy5yZWxhdGVkT2JqZWN0c1ZhbHVlO1xyXG5cdFx0XHRcdFx0c2VsZi5zeW5jUmVsYXRlZE9iamVjdHNWYWx1ZShyZWNvcmQuX2lkLCByZWxhdGVkT2JqZWN0cywgcmVsYXRlZE9iamVjdHNWYWx1ZSwgc3BhY2VJZCwgaW5zKTtcclxuXHJcblxyXG5cdFx0XHRcdFx0Ly8g5Lul5pyA57uI55Sz6K+35Y2V6ZmE5Lu25Li65YeG77yM5pen55qEcmVjb3Jk5Lit6ZmE5Lu25Yig6ZmkXHJcblx0XHRcdFx0XHRDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2Ntc19maWxlcycpLnJlbW92ZSh7XHJcblx0XHRcdFx0XHRcdCdwYXJlbnQnOiB7XHJcblx0XHRcdFx0XHRcdFx0bzogb2JqZWN0TmFtZSxcclxuXHRcdFx0XHRcdFx0XHRpZHM6IFtyZWNvcmQuX2lkXVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0dmFyIHJlbW92ZU9sZEZpbGVzID0gZnVuY3Rpb24gKGNiKSB7XHJcblx0XHRcdFx0XHRcdHJldHVybiBjZnMuZmlsZXMucmVtb3ZlKHtcclxuXHRcdFx0XHRcdFx0XHQnbWV0YWRhdGEucmVjb3JkX2lkJzogcmVjb3JkLl9pZFxyXG5cdFx0XHRcdFx0XHR9LCBjYik7XHJcblx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0TWV0ZW9yLndyYXBBc3luYyhyZW1vdmVPbGRGaWxlcykoKTtcclxuXHRcdFx0XHRcdC8vIOWQjOatpeaWsOmZhOS7tlxyXG5cdFx0XHRcdFx0c2VsZi5zeW5jQXR0YWNoKHN5bmNfYXR0YWNobWVudCwgaW5zSWQsIHJlY29yZC5zcGFjZSwgcmVjb3JkLl9pZCwgb2JqZWN0TmFtZSk7XHJcblx0XHRcdFx0fSBjYXRjaCAoZXJyb3IpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoZXJyb3Iuc3RhY2spO1xyXG5cdFx0XHRcdFx0b2JqZWN0Q29sbGVjdGlvbi51cGRhdGUoe1xyXG5cdFx0XHRcdFx0XHRfaWQ6IHJlY29yZC5faWQsXHJcblx0XHRcdFx0XHRcdCdpbnN0YW5jZXMuX2lkJzogaW5zSWRcclxuXHRcdFx0XHRcdH0sIHtcclxuXHRcdFx0XHRcdFx0JHNldDoge1xyXG5cdFx0XHRcdFx0XHRcdCdpbnN0YW5jZXMuJC5zdGF0ZSc6ICdwZW5kaW5nJyxcclxuXHRcdFx0XHRcdFx0XHQnaW5zdGFuY2Vfc3RhdGUnOiAncGVuZGluZydcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSlcclxuXHJcblx0XHRcdFx0XHRDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2Ntc19maWxlcycpLnJlbW92ZSh7XHJcblx0XHRcdFx0XHRcdCdwYXJlbnQnOiB7XHJcblx0XHRcdFx0XHRcdFx0bzogb2JqZWN0TmFtZSxcclxuXHRcdFx0XHRcdFx0XHRpZHM6IFtyZWNvcmQuX2lkXVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0Y2ZzLmZpbGVzLnJlbW92ZSh7XHJcblx0XHRcdFx0XHRcdCdtZXRhZGF0YS5yZWNvcmRfaWQnOiByZWNvcmQuX2lkXHJcblx0XHRcdFx0XHR9KVxyXG5cclxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihlcnJvcik7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fSlcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdC8vIOatpOaDheWGteWxnuS6juS7jmFwcHPkuK3lj5HotbflrqHmiblcclxuXHRcdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKCdvYmplY3Rfd29ya2Zsb3dzJykuZmluZCh7XHJcblx0XHRcdFx0Zmxvd19pZDogaW5zLmZsb3dcclxuXHRcdFx0fSkuZm9yRWFjaChmdW5jdGlvbiAob3cpIHtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0dmFyXHJcblx0XHRcdFx0XHRcdG9iamVjdENvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob3cub2JqZWN0X25hbWUsIHNwYWNlSWQpLFxyXG5cdFx0XHRcdFx0XHRzeW5jX2F0dGFjaG1lbnQgPSBvdy5zeW5jX2F0dGFjaG1lbnQsXHJcblx0XHRcdFx0XHRcdG5ld1JlY29yZElkID0gb2JqZWN0Q29sbGVjdGlvbi5fbWFrZU5ld0lEKCksXHJcblx0XHRcdFx0XHRcdG9iamVjdE5hbWUgPSBvdy5vYmplY3RfbmFtZTtcclxuXHJcblx0XHRcdFx0XHR2YXIgb2JqZWN0SW5mbyA9IENyZWF0b3IuZ2V0T2JqZWN0KG93Lm9iamVjdF9uYW1lLCBzcGFjZUlkKTtcclxuXHRcdFx0XHRcdHZhciBzeW5jVmFsdWVzID0gc2VsZi5zeW5jVmFsdWVzKG93LmZpZWxkX21hcF9iYWNrLCB2YWx1ZXMsIGlucywgb2JqZWN0SW5mbywgb3cuZmllbGRfbWFwX2JhY2tfc2NyaXB0KTtcclxuXHRcdFx0XHRcdHZhciBuZXdPYmogPSBzeW5jVmFsdWVzLm1haW5PYmplY3RWYWx1ZTtcclxuXHJcblx0XHRcdFx0XHRuZXdPYmouX2lkID0gbmV3UmVjb3JkSWQ7XHJcblx0XHRcdFx0XHRuZXdPYmouc3BhY2UgPSBzcGFjZUlkO1xyXG5cdFx0XHRcdFx0bmV3T2JqLm5hbWUgPSBuZXdPYmoubmFtZSB8fCBpbnMubmFtZTtcclxuXHJcblx0XHRcdFx0XHR2YXIgaW5zdGFuY2Vfc3RhdGUgPSBpbnMuc3RhdGU7XHJcblx0XHRcdFx0XHRpZiAoaW5zLnN0YXRlID09PSAnY29tcGxldGVkJyAmJiBpbnMuZmluYWxfZGVjaXNpb24pIHtcclxuXHRcdFx0XHRcdFx0aW5zdGFuY2Vfc3RhdGUgPSBpbnMuZmluYWxfZGVjaXNpb247XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRuZXdPYmouaW5zdGFuY2VzID0gW3tcclxuXHRcdFx0XHRcdFx0X2lkOiBpbnNJZCxcclxuXHRcdFx0XHRcdFx0c3RhdGU6IGluc3RhbmNlX3N0YXRlXHJcblx0XHRcdFx0XHR9XTtcclxuXHRcdFx0XHRcdG5ld09iai5pbnN0YW5jZV9zdGF0ZSA9IGluc3RhbmNlX3N0YXRlO1xyXG5cclxuXHRcdFx0XHRcdG5ld09iai5vd25lciA9IGlucy5hcHBsaWNhbnQ7XHJcblx0XHRcdFx0XHRuZXdPYmouY3JlYXRlZF9ieSA9IGlucy5hcHBsaWNhbnQ7XHJcblx0XHRcdFx0XHRuZXdPYmoubW9kaWZpZWRfYnkgPSBpbnMuYXBwbGljYW50O1xyXG5cdFx0XHRcdFx0dmFyIHIgPSBvYmplY3RDb2xsZWN0aW9uLmluc2VydChuZXdPYmopO1xyXG5cdFx0XHRcdFx0aWYgKHIpIHtcclxuXHRcdFx0XHRcdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKCdpbnN0YW5jZXMnKS51cGRhdGUoaW5zLl9pZCwge1xyXG5cdFx0XHRcdFx0XHRcdCRwdXNoOiB7XHJcblx0XHRcdFx0XHRcdFx0XHRyZWNvcmRfaWRzOiB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdG86IG9iamVjdE5hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdGlkczogW25ld1JlY29yZElkXVxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdFx0dmFyIHJlbGF0ZWRPYmplY3RzID0gQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0cyhvdy5vYmplY3RfbmFtZSwgc3BhY2VJZCk7XHJcblx0XHRcdFx0XHRcdHZhciByZWxhdGVkT2JqZWN0c1ZhbHVlID0gc3luY1ZhbHVlcy5yZWxhdGVkT2JqZWN0c1ZhbHVlO1xyXG5cdFx0XHRcdFx0XHRzZWxmLnN5bmNSZWxhdGVkT2JqZWN0c1ZhbHVlKG5ld1JlY29yZElkLCByZWxhdGVkT2JqZWN0cywgcmVsYXRlZE9iamVjdHNWYWx1ZSwgc3BhY2VJZCwgaW5zKTtcclxuXHRcdFx0XHRcdFx0Ly8gd29ya2Zsb3fph4zlj5HotbflrqHmibnlkI7vvIzlkIzmraXml7bkuZ/lj6/ku6Xkv67mlLnnm7jlhbPooajnmoTlrZfmrrXlgLwgIzExODNcclxuXHRcdFx0XHRcdFx0dmFyIHJlY29yZCA9IG9iamVjdENvbGxlY3Rpb24uZmluZE9uZShuZXdSZWNvcmRJZCk7XHJcblx0XHRcdFx0XHRcdHNlbGYuc3luY1ZhbHVlcyhvdy5maWVsZF9tYXBfYmFjaywgdmFsdWVzLCBpbnMsIG9iamVjdEluZm8sIG93LmZpZWxkX21hcF9iYWNrX3NjcmlwdCwgcmVjb3JkKTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHQvLyDpmYTku7blkIzmraVcclxuXHRcdFx0XHRcdHNlbGYuc3luY0F0dGFjaChzeW5jX2F0dGFjaG1lbnQsIGluc0lkLCBzcGFjZUlkLCBuZXdSZWNvcmRJZCwgb2JqZWN0TmFtZSk7XHJcblxyXG5cdFx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKGVycm9yLnN0YWNrKTtcclxuXHJcblx0XHRcdFx0XHRvYmplY3RDb2xsZWN0aW9uLnJlbW92ZSh7XHJcblx0XHRcdFx0XHRcdF9pZDogbmV3UmVjb3JkSWQsXHJcblx0XHRcdFx0XHRcdHNwYWNlOiBzcGFjZUlkXHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbignaW5zdGFuY2VzJykudXBkYXRlKGlucy5faWQsIHtcclxuXHRcdFx0XHRcdFx0JHB1bGw6IHtcclxuXHRcdFx0XHRcdFx0XHRyZWNvcmRfaWRzOiB7XHJcblx0XHRcdFx0XHRcdFx0XHRvOiBvYmplY3ROYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0aWRzOiBbbmV3UmVjb3JkSWRdXHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKCdjbXNfZmlsZXMnKS5yZW1vdmUoe1xyXG5cdFx0XHRcdFx0XHQncGFyZW50Jzoge1xyXG5cdFx0XHRcdFx0XHRcdG86IG9iamVjdE5hbWUsXHJcblx0XHRcdFx0XHRcdFx0aWRzOiBbbmV3UmVjb3JkSWRdXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHRjZnMuZmlsZXMucmVtb3ZlKHtcclxuXHRcdFx0XHRcdFx0J21ldGFkYXRhLnJlY29yZF9pZCc6IG5ld1JlY29yZElkXHJcblx0XHRcdFx0XHR9KVxyXG5cclxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihlcnJvcik7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fSlcclxuXHRcdH1cclxuXHJcblx0XHRJbnN0YW5jZVJlY29yZFF1ZXVlLmNvbGxlY3Rpb24udXBkYXRlKGRvYy5faWQsIHtcclxuXHRcdFx0JHNldDoge1xyXG5cdFx0XHRcdCdpbmZvLnN5bmNfZGF0ZSc6IG5ldyBEYXRlKClcclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHJcblx0fVxyXG5cclxuXHQvLyBVbml2ZXJzYWwgc2VuZCBmdW5jdGlvblxyXG5cdHZhciBfcXVlcnlTZW5kID0gZnVuY3Rpb24gKGRvYykge1xyXG5cclxuXHRcdGlmIChzZWxmLnNlbmREb2MpIHtcclxuXHRcdFx0c2VsZi5zZW5kRG9jKGRvYyk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0ZG9jOiBbZG9jLl9pZF1cclxuXHRcdH07XHJcblx0fTtcclxuXHJcblx0c2VsZi5zZXJ2ZXJTZW5kID0gZnVuY3Rpb24gKGRvYykge1xyXG5cdFx0ZG9jID0gZG9jIHx8IHt9O1xyXG5cdFx0cmV0dXJuIF9xdWVyeVNlbmQoZG9jKTtcclxuXHR9O1xyXG5cclxuXHJcblx0Ly8gVGhpcyBpbnRlcnZhbCB3aWxsIGFsbG93IG9ubHkgb25lIGRvYyB0byBiZSBzZW50IGF0IGEgdGltZSwgaXRcclxuXHQvLyB3aWxsIGNoZWNrIGZvciBuZXcgZG9jcyBhdCBldmVyeSBgb3B0aW9ucy5zZW5kSW50ZXJ2YWxgXHJcblx0Ly8gKGRlZmF1bHQgaW50ZXJ2YWwgaXMgMTUwMDAgbXMpXHJcblx0Ly9cclxuXHQvLyBJdCBsb29rcyBpbiBkb2NzIGNvbGxlY3Rpb24gdG8gc2VlIGlmIHRoZXJlcyBhbnkgcGVuZGluZ1xyXG5cdC8vIGRvY3MsIGlmIHNvIGl0IHdpbGwgdHJ5IHRvIHJlc2VydmUgdGhlIHBlbmRpbmcgZG9jLlxyXG5cdC8vIElmIHN1Y2Nlc3NmdWxseSByZXNlcnZlZCB0aGUgc2VuZCBpcyBzdGFydGVkLlxyXG5cdC8vXHJcblx0Ly8gSWYgZG9jLnF1ZXJ5IGlzIHR5cGUgc3RyaW5nLCBpdCdzIGFzc3VtZWQgdG8gYmUgYSBqc29uIHN0cmluZ1xyXG5cdC8vIHZlcnNpb24gb2YgdGhlIHF1ZXJ5IHNlbGVjdG9yLiBNYWtpbmcgaXQgYWJsZSB0byBjYXJyeSBgJGAgcHJvcGVydGllcyBpblxyXG5cdC8vIHRoZSBtb25nbyBjb2xsZWN0aW9uLlxyXG5cdC8vXHJcblx0Ly8gUHIuIGRlZmF1bHQgZG9jcyBhcmUgcmVtb3ZlZCBmcm9tIHRoZSBjb2xsZWN0aW9uIGFmdGVyIHNlbmQgaGF2ZVxyXG5cdC8vIGNvbXBsZXRlZC4gU2V0dGluZyBgb3B0aW9ucy5rZWVwRG9jc2Agd2lsbCB1cGRhdGUgYW5kIGtlZXAgdGhlXHJcblx0Ly8gZG9jIGVnLiBpZiBuZWVkZWQgZm9yIGhpc3RvcmljYWwgcmVhc29ucy5cclxuXHQvL1xyXG5cdC8vIEFmdGVyIHRoZSBzZW5kIGhhdmUgY29tcGxldGVkIGEgXCJzZW5kXCIgZXZlbnQgd2lsbCBiZSBlbWl0dGVkIHdpdGggYVxyXG5cdC8vIHN0YXR1cyBvYmplY3QgY29udGFpbmluZyBkb2MgaWQgYW5kIHRoZSBzZW5kIHJlc3VsdCBvYmplY3QuXHJcblx0Ly9cclxuXHR2YXIgaXNTZW5kaW5nRG9jID0gZmFsc2U7XHJcblxyXG5cdGlmIChvcHRpb25zLnNlbmRJbnRlcnZhbCAhPT0gbnVsbCkge1xyXG5cclxuXHRcdC8vIFRoaXMgd2lsbCByZXF1aXJlIGluZGV4IHNpbmNlIHdlIHNvcnQgZG9jcyBieSBjcmVhdGVkQXRcclxuXHRcdEluc3RhbmNlUmVjb3JkUXVldWUuY29sbGVjdGlvbi5fZW5zdXJlSW5kZXgoe1xyXG5cdFx0XHRjcmVhdGVkQXQ6IDFcclxuXHRcdH0pO1xyXG5cdFx0SW5zdGFuY2VSZWNvcmRRdWV1ZS5jb2xsZWN0aW9uLl9lbnN1cmVJbmRleCh7XHJcblx0XHRcdHNlbnQ6IDFcclxuXHRcdH0pO1xyXG5cdFx0SW5zdGFuY2VSZWNvcmRRdWV1ZS5jb2xsZWN0aW9uLl9lbnN1cmVJbmRleCh7XHJcblx0XHRcdHNlbmRpbmc6IDFcclxuXHRcdH0pO1xyXG5cclxuXHJcblx0XHR2YXIgc2VuZERvYyA9IGZ1bmN0aW9uIChkb2MpIHtcclxuXHRcdFx0Ly8gUmVzZXJ2ZSBkb2NcclxuXHRcdFx0dmFyIG5vdyA9ICtuZXcgRGF0ZSgpO1xyXG5cdFx0XHR2YXIgdGltZW91dEF0ID0gbm93ICsgb3B0aW9ucy5zZW5kVGltZW91dDtcclxuXHRcdFx0dmFyIHJlc2VydmVkID0gSW5zdGFuY2VSZWNvcmRRdWV1ZS5jb2xsZWN0aW9uLnVwZGF0ZSh7XHJcblx0XHRcdFx0X2lkOiBkb2MuX2lkLFxyXG5cdFx0XHRcdHNlbnQ6IGZhbHNlLCAvLyB4eHg6IG5lZWQgdG8gbWFrZSBzdXJlIHRoaXMgaXMgc2V0IG9uIGNyZWF0ZVxyXG5cdFx0XHRcdHNlbmRpbmc6IHtcclxuXHRcdFx0XHRcdCRsdDogbm93XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LCB7XHJcblx0XHRcdFx0JHNldDoge1xyXG5cdFx0XHRcdFx0c2VuZGluZzogdGltZW91dEF0LFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHQvLyBNYWtlIHN1cmUgd2Ugb25seSBoYW5kbGUgZG9jcyByZXNlcnZlZCBieSB0aGlzXHJcblx0XHRcdC8vIGluc3RhbmNlXHJcblx0XHRcdGlmIChyZXNlcnZlZCkge1xyXG5cclxuXHRcdFx0XHQvLyBTZW5kXHJcblx0XHRcdFx0dmFyIHJlc3VsdCA9IEluc3RhbmNlUmVjb3JkUXVldWUuc2VydmVyU2VuZChkb2MpO1xyXG5cclxuXHRcdFx0XHRpZiAoIW9wdGlvbnMua2VlcERvY3MpIHtcclxuXHRcdFx0XHRcdC8vIFByLiBEZWZhdWx0IHdlIHdpbGwgcmVtb3ZlIGRvY3NcclxuXHRcdFx0XHRcdEluc3RhbmNlUmVjb3JkUXVldWUuY29sbGVjdGlvbi5yZW1vdmUoe1xyXG5cdFx0XHRcdFx0XHRfaWQ6IGRvYy5faWRcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblxyXG5cdFx0XHRcdFx0Ly8gVXBkYXRlXHJcblx0XHRcdFx0XHRJbnN0YW5jZVJlY29yZFF1ZXVlLmNvbGxlY3Rpb24udXBkYXRlKHtcclxuXHRcdFx0XHRcdFx0X2lkOiBkb2MuX2lkXHJcblx0XHRcdFx0XHR9LCB7XHJcblx0XHRcdFx0XHRcdCRzZXQ6IHtcclxuXHRcdFx0XHRcdFx0XHQvLyBNYXJrIGFzIHNlbnRcclxuXHRcdFx0XHRcdFx0XHRzZW50OiB0cnVlLFxyXG5cdFx0XHRcdFx0XHRcdC8vIFNldCB0aGUgc2VudCBkYXRlXHJcblx0XHRcdFx0XHRcdFx0c2VudEF0OiBuZXcgRGF0ZSgpLFxyXG5cdFx0XHRcdFx0XHRcdC8vIE5vdCBiZWluZyBzZW50IGFueW1vcmVcclxuXHRcdFx0XHRcdFx0XHRzZW5kaW5nOiAwXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdC8vIC8vIEVtaXQgdGhlIHNlbmRcclxuXHRcdFx0XHQvLyBzZWxmLmVtaXQoJ3NlbmQnLCB7XHJcblx0XHRcdFx0Ly8gXHRkb2M6IGRvYy5faWQsXHJcblx0XHRcdFx0Ly8gXHRyZXN1bHQ6IHJlc3VsdFxyXG5cdFx0XHRcdC8vIH0pO1xyXG5cclxuXHRcdFx0fSAvLyBFbHNlIGNvdWxkIG5vdCByZXNlcnZlXHJcblx0XHR9OyAvLyBFTyBzZW5kRG9jXHJcblxyXG5cdFx0c2VuZFdvcmtlcihmdW5jdGlvbiAoKSB7XHJcblxyXG5cdFx0XHRpZiAoaXNTZW5kaW5nRG9jKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdC8vIFNldCBzZW5kIGZlbmNlXHJcblx0XHRcdGlzU2VuZGluZ0RvYyA9IHRydWU7XHJcblxyXG5cdFx0XHR2YXIgYmF0Y2hTaXplID0gb3B0aW9ucy5zZW5kQmF0Y2hTaXplIHx8IDE7XHJcblxyXG5cdFx0XHR2YXIgbm93ID0gK25ldyBEYXRlKCk7XHJcblxyXG5cdFx0XHQvLyBGaW5kIGRvY3MgdGhhdCBhcmUgbm90IGJlaW5nIG9yIGFscmVhZHkgc2VudFxyXG5cdFx0XHR2YXIgcGVuZGluZ0RvY3MgPSBJbnN0YW5jZVJlY29yZFF1ZXVlLmNvbGxlY3Rpb24uZmluZCh7XHJcblx0XHRcdFx0JGFuZDogW1xyXG5cdFx0XHRcdFx0Ly8gTWVzc2FnZSBpcyBub3Qgc2VudFxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRzZW50OiBmYWxzZVxyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdC8vIEFuZCBub3QgYmVpbmcgc2VudCBieSBvdGhlciBpbnN0YW5jZXNcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0c2VuZGluZzoge1xyXG5cdFx0XHRcdFx0XHRcdCRsdDogbm93XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHQvLyBBbmQgbm8gZXJyb3JcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0ZXJyTXNnOiB7XHJcblx0XHRcdFx0XHRcdFx0JGV4aXN0czogZmFsc2VcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdF1cclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdC8vIFNvcnQgYnkgY3JlYXRlZCBkYXRlXHJcblx0XHRcdFx0c29ydDoge1xyXG5cdFx0XHRcdFx0Y3JlYXRlZEF0OiAxXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRsaW1pdDogYmF0Y2hTaXplXHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0cGVuZGluZ0RvY3MuZm9yRWFjaChmdW5jdGlvbiAoZG9jKSB7XHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdHNlbmREb2MoZG9jKTtcclxuXHRcdFx0XHR9IGNhdGNoIChlcnJvcikge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvcihlcnJvci5zdGFjayk7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnSW5zdGFuY2VSZWNvcmRRdWV1ZTogQ291bGQgbm90IHNlbmQgZG9jIGlkOiBcIicgKyBkb2MuX2lkICsgJ1wiLCBFcnJvcjogJyArIGVycm9yLm1lc3NhZ2UpO1xyXG5cdFx0XHRcdFx0SW5zdGFuY2VSZWNvcmRRdWV1ZS5jb2xsZWN0aW9uLnVwZGF0ZSh7XHJcblx0XHRcdFx0XHRcdF9pZDogZG9jLl9pZFxyXG5cdFx0XHRcdFx0fSwge1xyXG5cdFx0XHRcdFx0XHQkc2V0OiB7XHJcblx0XHRcdFx0XHRcdFx0Ly8gZXJyb3IgbWVzc2FnZVxyXG5cdFx0XHRcdFx0XHRcdGVyck1zZzogZXJyb3IubWVzc2FnZVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pOyAvLyBFTyBmb3JFYWNoXHJcblxyXG5cdFx0XHQvLyBSZW1vdmUgdGhlIHNlbmQgZmVuY2VcclxuXHRcdFx0aXNTZW5kaW5nRG9jID0gZmFsc2U7XHJcblx0XHR9LCBvcHRpb25zLnNlbmRJbnRlcnZhbCB8fCAxNTAwMCk7IC8vIERlZmF1bHQgZXZlcnkgMTV0aCBzZWNcclxuXHJcblx0fSBlbHNlIHtcclxuXHRcdGlmIChJbnN0YW5jZVJlY29yZFF1ZXVlLmRlYnVnKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKCdJbnN0YW5jZVJlY29yZFF1ZXVlOiBTZW5kIHNlcnZlciBpcyBkaXNhYmxlZCcpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcbn07IiwiTWV0ZW9yLnN0YXJ0dXAgLT5cclxuXHRpZiBNZXRlb3Iuc2V0dGluZ3MuY3Jvbj8uaW5zdGFuY2VyZWNvcmRxdWV1ZV9pbnRlcnZhbFxyXG5cdFx0SW5zdGFuY2VSZWNvcmRRdWV1ZS5Db25maWd1cmVcclxuXHRcdFx0c2VuZEludGVydmFsOiBNZXRlb3Iuc2V0dGluZ3MuY3Jvbi5pbnN0YW5jZXJlY29yZHF1ZXVlX2ludGVydmFsXHJcblx0XHRcdHNlbmRCYXRjaFNpemU6IDEwXHJcblx0XHRcdGtlZXBEb2NzOiB0cnVlXHJcbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICB2YXIgcmVmO1xuICBpZiAoKHJlZiA9IE1ldGVvci5zZXR0aW5ncy5jcm9uKSAhPSBudWxsID8gcmVmLmluc3RhbmNlcmVjb3JkcXVldWVfaW50ZXJ2YWwgOiB2b2lkIDApIHtcbiAgICByZXR1cm4gSW5zdGFuY2VSZWNvcmRRdWV1ZS5Db25maWd1cmUoe1xuICAgICAgc2VuZEludGVydmFsOiBNZXRlb3Iuc2V0dGluZ3MuY3Jvbi5pbnN0YW5jZXJlY29yZHF1ZXVlX2ludGVydmFsLFxuICAgICAgc2VuZEJhdGNoU2l6ZTogMTAsXG4gICAgICBrZWVwRG9jczogdHJ1ZVxuICAgIH0pO1xuICB9XG59KTtcbiIsImltcG9ydCB7IGNoZWNrTnBtVmVyc2lvbnMgfSBmcm9tICdtZXRlb3IvdG1lYXNkYXk6Y2hlY2stbnBtLXZlcnNpb25zJztcclxuY2hlY2tOcG1WZXJzaW9ucyh7XHJcblx0XCJldmFsXCI6IFwiXjAuMS4yXCJcclxufSwgJ3N0ZWVkb3M6aW5zdGFuY2UtcmVjb3JkLXF1ZXVlJyk7XHJcbiJdfQ==
