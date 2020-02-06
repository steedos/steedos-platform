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
var InstanceRecordQueue, tableToRelatedMap, tableIds, __coffeescriptShare;

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
          var fileObj = cfs.files.insert(newFile);

          if (fileObj) {
            Creator.getCollection('cms_files').insert({
              _id: cmsFileId,
              parent: {
                o: objectName,
                ids: [newRecordId]
              },
              size: fileObj.size(),
              name: fileObj.name(),
              extention: fileObj.extension(),
              space: spaceId,
              versions: [fileObj._id],
              owner: f.metadata.owner,
              created_by: f.metadata.owner,
              modified_by: f.metadata.owner
            });
          }
        });
      });
    } else if (sync_attachment == "all") {
      var parents = [];
      cfs.instances.find({
        'metadata.instance': insId
      }).forEach(function (f) {
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
          var fileObj = cfs.files.insert(newFile);

          if (fileObj) {
            if (f.metadata.current == true) {
              Creator.getCollection('cms_files').update(cmsFileId, {
                $set: {
                  size: fileObj.size(),
                  name: fileObj.name(),
                  extention: fileObj.extension()
                },
                $addToSet: {
                  versions: fileObj._id
                }
              });
            } else {
              Creator.getCollection('cms_files').update(cmsFileId, {
                $addToSet: {
                  versions: fileObj._id
                }
              });
            }
          }
        });
      });
    }
  };

  self.syncInsFields = ['name', 'submitter_name', 'applicant_name', 'applicant_organization_name', 'applicant_organization_fullname', 'state', 'current_step_name', 'flow_name', 'category_name', 'submit_date', 'finish_date', 'final_decision', 'applicant_organization', 'applicant_company'];

  self.syncValues = function (field_map_back, values, ins, objectInfo, field_map_back_script, record) {
    var obj = {},
        tableFieldCodes = [],
        tableFieldMap = [];
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


            if (!wField.is_multiselect && ['user', 'group'].includes(wField.type) && !oField.multiple && ['lookup', 'master_detail'].includes(oField.type) && ['users', 'organizations'].includes(oField.reference_to)) {
              obj[fm.object_field] = values[fm.workflow_field]['id'];
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

                if (formField.type == 'odata' && ['lookup', 'master_detail'].includes(relatedObjectField.type)) {
                  if (!_.isEmpty(relatedObjectFieldValue)) {
                    if (relatedObjectField.multiple && formField.is_multiselect) {
                      relatedObjectFieldValue = _.compact(_.pluck(relatedObjectFieldValue, '_id'));
                    } else if (!relatedObjectField.multiple && !formField.is_multiselect) {
                      relatedObjectFieldValue = relatedObjectFieldValue._id;
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
          setObj.locked = false;
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
          cfs.files.remove({
            'metadata.record_id': record._id
          }); // 同步新附件

          self.syncAttach(sync_attachment, insId, record.space, record._id, objectName);
        } catch (error) {
          console.error(error.stack);
          objectCollection.update({
            _id: record._id,
            'instances._id': insId
          }, {
            $set: {
              'instances.$.state': 'pending',
              'locked': true,
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczppbnN0YW5jZS1yZWNvcmQtcXVldWUvbGliL2NvbW1vbi9tYWluLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmluc3RhbmNlLXJlY29yZC1xdWV1ZS9saWIvY29tbW9uL2RvY3MuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6aW5zdGFuY2UtcmVjb3JkLXF1ZXVlL2xpYi9zZXJ2ZXIvYXBpLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2luc3RhbmNlLXJlY29yZC1xdWV1ZS9zZXJ2ZXIvc3RhcnR1cC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9zdGFydHVwLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczppbnN0YW5jZS1yZWNvcmQtcXVldWUvc2VydmVyL2NoZWNrTnBtLmpzIl0sIm5hbWVzIjpbIkluc3RhbmNlUmVjb3JkUXVldWUiLCJFdmVudFN0YXRlIiwiY29sbGVjdGlvbiIsImRiIiwiaW5zdGFuY2VfcmVjb3JkX3F1ZXVlIiwiTW9uZ28iLCJDb2xsZWN0aW9uIiwiX3ZhbGlkYXRlRG9jdW1lbnQiLCJkb2MiLCJjaGVjayIsImluZm8iLCJPYmplY3QiLCJzZW50IiwiTWF0Y2giLCJPcHRpb25hbCIsIkJvb2xlYW4iLCJzZW5kaW5nIiwiSW50ZWdlciIsImNyZWF0ZWRBdCIsIkRhdGUiLCJjcmVhdGVkQnkiLCJPbmVPZiIsIlN0cmluZyIsInNlbmQiLCJvcHRpb25zIiwiY3VycmVudFVzZXIiLCJNZXRlb3IiLCJpc0NsaWVudCIsInVzZXJJZCIsImlzU2VydmVyIiwiXyIsImV4dGVuZCIsInRlc3QiLCJwaWNrIiwiaW5zZXJ0IiwiX2V2YWwiLCJyZXF1aXJlIiwiaXNDb25maWd1cmVkIiwic2VuZFdvcmtlciIsInRhc2siLCJpbnRlcnZhbCIsImRlYnVnIiwiY29uc29sZSIsImxvZyIsInNldEludGVydmFsIiwiZXJyb3IiLCJtZXNzYWdlIiwiQ29uZmlndXJlIiwic2VsZiIsInNlbmRUaW1lb3V0IiwiRXJyb3IiLCJzeW5jQXR0YWNoIiwic3luY19hdHRhY2htZW50IiwiaW5zSWQiLCJzcGFjZUlkIiwibmV3UmVjb3JkSWQiLCJvYmplY3ROYW1lIiwiY2ZzIiwiaW5zdGFuY2VzIiwiZmluZCIsImZvckVhY2giLCJmIiwibmV3RmlsZSIsIkZTIiwiRmlsZSIsImNtc0ZpbGVJZCIsIkNyZWF0b3IiLCJnZXRDb2xsZWN0aW9uIiwiX21ha2VOZXdJRCIsImF0dGFjaERhdGEiLCJjcmVhdGVSZWFkU3RyZWFtIiwidHlwZSIsIm9yaWdpbmFsIiwiZXJyIiwicmVhc29uIiwibmFtZSIsInNpemUiLCJtZXRhZGF0YSIsIm93bmVyIiwib3duZXJfbmFtZSIsInNwYWNlIiwicmVjb3JkX2lkIiwib2JqZWN0X25hbWUiLCJwYXJlbnQiLCJmaWxlT2JqIiwiZmlsZXMiLCJfaWQiLCJvIiwiaWRzIiwiZXh0ZW50aW9uIiwiZXh0ZW5zaW9uIiwidmVyc2lvbnMiLCJjcmVhdGVkX2J5IiwibW9kaWZpZWRfYnkiLCJwYXJlbnRzIiwiaW5jbHVkZXMiLCJwdXNoIiwiY3VycmVudCIsInVwZGF0ZSIsIiRzZXQiLCIkYWRkVG9TZXQiLCJzeW5jSW5zRmllbGRzIiwic3luY1ZhbHVlcyIsImZpZWxkX21hcF9iYWNrIiwidmFsdWVzIiwiaW5zIiwib2JqZWN0SW5mbyIsImZpZWxkX21hcF9iYWNrX3NjcmlwdCIsInJlY29yZCIsIm9iaiIsInRhYmxlRmllbGRDb2RlcyIsInRhYmxlRmllbGRNYXAiLCJ0YWJsZVRvUmVsYXRlZE1hcCIsImZvcm0iLCJmaW5kT25lIiwiZm9ybUZpZWxkcyIsImZvcm1fdmVyc2lvbiIsImZpZWxkcyIsImZvcm1WZXJzaW9uIiwiaGlzdG9yeXMiLCJoIiwib2JqZWN0RmllbGRzIiwib2JqZWN0RmllbGRLZXlzIiwia2V5cyIsInJlbGF0ZWRPYmplY3RzIiwiZ2V0UmVsYXRlZE9iamVjdHMiLCJyZWxhdGVkT2JqZWN0c0tleXMiLCJwbHVjayIsImZvcm1UYWJsZUZpZWxkcyIsImZpbHRlciIsImZvcm1GaWVsZCIsImZvcm1UYWJsZUZpZWxkc0NvZGUiLCJnZXRSZWxhdGVkT2JqZWN0RmllbGQiLCJrZXkiLCJyZWxhdGVkT2JqZWN0c0tleSIsInN0YXJ0c1dpdGgiLCJnZXRGb3JtVGFibGVGaWVsZCIsImZvcm1UYWJsZUZpZWxkQ29kZSIsImdldEZvcm1GaWVsZCIsIl9mb3JtRmllbGRzIiwiX2ZpZWxkQ29kZSIsImVhY2giLCJmZiIsImNvZGUiLCJmbSIsInJlbGF0ZWRPYmplY3RGaWVsZCIsIm9iamVjdF9maWVsZCIsImZvcm1UYWJsZUZpZWxkIiwid29ya2Zsb3dfZmllbGQiLCJvVGFibGVDb2RlIiwic3BsaXQiLCJvVGFibGVGaWVsZENvZGUiLCJ0YWJsZVRvUmVsYXRlZE1hcEtleSIsIndUYWJsZUNvZGUiLCJpbmRleE9mIiwiaGFzT3duUHJvcGVydHkiLCJpc0FycmF5IiwiSlNPTiIsInN0cmluZ2lmeSIsIndvcmtmbG93X3RhYmxlX2ZpZWxkX2NvZGUiLCJvYmplY3RfdGFibGVfZmllbGRfY29kZSIsIndGaWVsZCIsIm9GaWVsZCIsImlzX211bHRpc2VsZWN0IiwibXVsdGlwbGUiLCJyZWZlcmVuY2VfdG8iLCJpc1N0cmluZyIsIm9Db2xsZWN0aW9uIiwicmVmZXJPYmplY3QiLCJnZXRPYmplY3QiLCJyZWZlckRhdGEiLCJuYW1lRmllbGRLZXkiLCJOQU1FX0ZJRUxEX0tFWSIsInNlbGVjdG9yIiwidG1wX2ZpZWxkX3ZhbHVlIiwiY29tcGFjdCIsImlzRW1wdHkiLCJ0ZW1PYmpGaWVsZHMiLCJsZW5ndGgiLCJvYmpGaWVsZCIsInJlZmVyT2JqRmllbGQiLCJyZWZlclNldE9iaiIsImluc0ZpZWxkIiwidW5pcSIsInRmYyIsImMiLCJwYXJzZSIsInRyIiwibmV3VHIiLCJ2IiwiayIsInRmbSIsIm9UZENvZGUiLCJyZWxhdGVkT2JqcyIsImdldFJlbGF0ZWRGaWVsZFZhbHVlIiwidmFsdWVLZXkiLCJyZWR1Y2UiLCJ4IiwibWFwIiwidGFibGVDb2RlIiwiX0ZST01fVEFCTEVfQ09ERSIsIndhcm4iLCJyZWxhdGVkT2JqZWN0TmFtZSIsInJlbGF0ZWRPYmplY3RWYWx1ZXMiLCJyZWxhdGVkT2JqZWN0IiwidGFibGVWYWx1ZUl0ZW0iLCJyZWxhdGVkT2JqZWN0VmFsdWUiLCJmaWVsZEtleSIsInJlbGF0ZWRPYmplY3RGaWVsZFZhbHVlIiwiZm9ybUZpZWxkS2V5IiwiX2NvZGUiLCJldmFsRmllbGRNYXBCYWNrU2NyaXB0IiwiZmlsdGVyT2JqIiwibWFpbk9iamVjdFZhbHVlIiwicmVsYXRlZE9iamVjdHNWYWx1ZSIsInNjcmlwdCIsImZ1bmMiLCJpc09iamVjdCIsInN5bmNSZWxhdGVkT2JqZWN0c1ZhbHVlIiwibWFpblJlY29yZElkIiwib2JqZWN0Q29sbGVjdGlvbiIsInRhYmxlTWFwIiwidGFibGVfaWQiLCJfdGFibGUiLCJ0YWJsZV9jb2RlIiwib2xkUmVsYXRlZFJlY29yZCIsImZvcmVpZ25fa2V5IiwiYXBwbGljYW50IiwiaW5zdGFuY2Vfc3RhdGUiLCJzdGF0ZSIsImZpbmFsX2RlY2lzaW9uIiwidmFsaWRhdGUiLCJ0YWJsZUlkcyIsInJlbW92ZSIsIiRuaW4iLCJzZW5kRG9jIiwiaW5zdGFuY2VfaWQiLCJyZWNvcmRzIiwiZmxvdyIsInRyYWNlcyIsIm93IiwiZmxvd19pZCIsIiRpbiIsInNldE9iaiIsImxvY2tlZCIsInN0YWNrIiwibmV3T2JqIiwiciIsIiRwdXNoIiwicmVjb3JkX2lkcyIsIiRwdWxsIiwiX3F1ZXJ5U2VuZCIsInNlcnZlclNlbmQiLCJpc1NlbmRpbmdEb2MiLCJzZW5kSW50ZXJ2YWwiLCJfZW5zdXJlSW5kZXgiLCJub3ciLCJ0aW1lb3V0QXQiLCJyZXNlcnZlZCIsIiRsdCIsInJlc3VsdCIsImtlZXBEb2NzIiwic2VudEF0IiwiYmF0Y2hTaXplIiwic2VuZEJhdGNoU2l6ZSIsInBlbmRpbmdEb2NzIiwiJGFuZCIsImVyck1zZyIsIiRleGlzdHMiLCJzb3J0IiwibGltaXQiLCJzdGFydHVwIiwicmVmIiwic2V0dGluZ3MiLCJjcm9uIiwiaW5zdGFuY2VyZWNvcmRxdWV1ZV9pbnRlcnZhbCIsImNoZWNrTnBtVmVyc2lvbnMiLCJtb2R1bGUiLCJsaW5rIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUFBLG1CQUFtQixHQUFHLElBQUlDLFVBQUosRUFBdEIsQzs7Ozs7Ozs7Ozs7QUNBQUQsbUJBQW1CLENBQUNFLFVBQXBCLEdBQWlDQyxFQUFFLENBQUNDLHFCQUFILEdBQTJCLElBQUlDLEtBQUssQ0FBQ0MsVUFBVixDQUFxQix1QkFBckIsQ0FBNUQ7O0FBRUEsSUFBSUMsaUJBQWlCLEdBQUcsVUFBU0MsR0FBVCxFQUFjO0FBRXJDQyxPQUFLLENBQUNELEdBQUQsRUFBTTtBQUNWRSxRQUFJLEVBQUVDLE1BREk7QUFFVkMsUUFBSSxFQUFFQyxLQUFLLENBQUNDLFFBQU4sQ0FBZUMsT0FBZixDQUZJO0FBR1ZDLFdBQU8sRUFBRUgsS0FBSyxDQUFDQyxRQUFOLENBQWVELEtBQUssQ0FBQ0ksT0FBckIsQ0FIQztBQUlWQyxhQUFTLEVBQUVDLElBSkQ7QUFLVkMsYUFBUyxFQUFFUCxLQUFLLENBQUNRLEtBQU4sQ0FBWUMsTUFBWixFQUFvQixJQUFwQjtBQUxELEdBQU4sQ0FBTDtBQVFBLENBVkQ7O0FBWUF0QixtQkFBbUIsQ0FBQ3VCLElBQXBCLEdBQTJCLFVBQVNDLE9BQVQsRUFBa0I7QUFDNUMsTUFBSUMsV0FBVyxHQUFHQyxNQUFNLENBQUNDLFFBQVAsSUFBbUJELE1BQU0sQ0FBQ0UsTUFBMUIsSUFBb0NGLE1BQU0sQ0FBQ0UsTUFBUCxFQUFwQyxJQUF1REYsTUFBTSxDQUFDRyxRQUFQLEtBQW9CTCxPQUFPLENBQUNKLFNBQVIsSUFBcUIsVUFBekMsQ0FBdkQsSUFBK0csSUFBakk7O0FBQ0EsTUFBSVosR0FBRyxHQUFHc0IsQ0FBQyxDQUFDQyxNQUFGLENBQVM7QUFDbEJiLGFBQVMsRUFBRSxJQUFJQyxJQUFK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eUJHLDRCQUF6QixHQUF5QixNQUF6QjtBQ0VHLFdEREZuUixvQkFBb0IrQyxTQUFwQixDQUNDO0FBQUErTSxvQkFBY3BPLE9BQU91UCxRQUFQLENBQWdCQyxJQUFoQixDQUFxQkMsNEJBQW5DO0FBQ0FYLHFCQUFlLEVBRGY7QUFFQUgsZ0JBQVU7QUFGVixLQURELENDQ0U7QUFLRDtBRFJILEc7Ozs7Ozs7Ozs7O0FFQUEsSUFBSWUsZ0JBQUo7QUFBcUJDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLG9DQUFaLEVBQWlEO0FBQUNGLGtCQUFnQixDQUFDdkYsQ0FBRCxFQUFHO0FBQUN1RixvQkFBZ0IsR0FBQ3ZGLENBQWpCO0FBQW1COztBQUF4QyxDQUFqRCxFQUEyRixDQUEzRjtBQUNyQnVGLGdCQUFnQixDQUFDO0FBQ2hCLFVBQVE7QUFEUSxDQUFELEVBRWIsK0JBRmEsQ0FBaEIsQyIsImZpbGUiOiIvcGFja2FnZXMvc3RlZWRvc19pbnN0YW5jZS1yZWNvcmQtcXVldWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJJbnN0YW5jZVJlY29yZFF1ZXVlID0gbmV3IEV2ZW50U3RhdGUoKTsiLCJJbnN0YW5jZVJlY29yZFF1ZXVlLmNvbGxlY3Rpb24gPSBkYi5pbnN0YW5jZV9yZWNvcmRfcXVldWUgPSBuZXcgTW9uZ28uQ29sbGVjdGlvbignaW5zdGFuY2VfcmVjb3JkX3F1ZXVlJyk7XHJcblxyXG52YXIgX3ZhbGlkYXRlRG9jdW1lbnQgPSBmdW5jdGlvbihkb2MpIHtcclxuXHJcblx0Y2hlY2soZG9jLCB7XHJcblx0XHRpbmZvOiBPYmplY3QsXHJcblx0XHRzZW50OiBNYXRjaC5PcHRpb25hbChCb29sZWFuKSxcclxuXHRcdHNlbmRpbmc6IE1hdGNoLk9wdGlvbmFsKE1hdGNoLkludGVnZXIpLFxyXG5cdFx0Y3JlYXRlZEF0OiBEYXRlLFxyXG5cdFx0Y3JlYXRlZEJ5OiBNYXRjaC5PbmVPZihTdHJpbmcsIG51bGwpXHJcblx0fSk7XHJcblxyXG59O1xyXG5cclxuSW5zdGFuY2VSZWNvcmRRdWV1ZS5zZW5kID0gZnVuY3Rpb24ob3B0aW9ucykge1xyXG5cdHZhciBjdXJyZW50VXNlciA9IE1ldGVvci5pc0NsaWVudCAmJiBNZXRlb3IudXNlcklkICYmIE1ldGVvci51c2VySWQoKSB8fCBNZXRlb3IuaXNTZXJ2ZXIgJiYgKG9wdGlvbnMuY3JlYXRlZEJ5IHx8ICc8U0VSVkVSPicpIHx8IG51bGxcclxuXHR2YXIgZG9jID0gXy5leHRlbmQoe1xyXG5cdFx0Y3JlYXRlZEF0OiBuZXcgRGF0ZSgpLFxyXG5cdFx0Y3JlYXRlZEJ5OiBjdXJyZW50VXNlclxyXG5cdH0pO1xyXG5cclxuXHRpZiAoTWF0Y2gudGVzdChvcHRpb25zLCBPYmplY3QpKSB7XHJcblx0XHRkb2MuaW5mbyA9IF8ucGljayhvcHRpb25zLCAnaW5zdGFuY2VfaWQnLCAncmVjb3JkcycsICdzeW5jX2RhdGUnLCAnaW5zdGFuY2VfZmluaXNoX2RhdGUnLCAnc3RlcF9uYW1lJyk7XHJcblx0fVxyXG5cclxuXHRkb2Muc2VudCA9IGZhbHNlO1xyXG5cdGRvYy5zZW5kaW5nID0gMDtcclxuXHJcblx0X3ZhbGlkYXRlRG9jdW1lbnQoZG9jKTtcclxuXHJcblx0cmV0dXJuIEluc3RhbmNlUmVjb3JkUXVldWUuY29sbGVjdGlvbi5pbnNlcnQoZG9jKTtcclxufTsiLCJ2YXIgX2V2YWwgPSByZXF1aXJlKCdldmFsJyk7XHJcbnZhciBpc0NvbmZpZ3VyZWQgPSBmYWxzZTtcclxudmFyIHNlbmRXb3JrZXIgPSBmdW5jdGlvbiAodGFzaywgaW50ZXJ2YWwpIHtcclxuXHJcblx0aWYgKEluc3RhbmNlUmVjb3JkUXVldWUuZGVidWcpIHtcclxuXHRcdGNvbnNvbGUubG9nKCdJbnN0YW5jZVJlY29yZFF1ZXVlOiBTZW5kIHdvcmtlciBzdGFydGVkLCB1c2luZyBpbnRlcnZhbDogJyArIGludGVydmFsKTtcclxuXHR9XHJcblxyXG5cdHJldHVybiBNZXRlb3Iuc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0dGFzaygpO1xyXG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coJ0luc3RhbmNlUmVjb3JkUXVldWU6IEVycm9yIHdoaWxlIHNlbmRpbmc6ICcgKyBlcnJvci5tZXNzYWdlKTtcclxuXHRcdH1cclxuXHR9LCBpbnRlcnZhbCk7XHJcbn07XHJcblxyXG4vKlxyXG5cdG9wdGlvbnM6IHtcclxuXHRcdC8vIENvbnRyb2xzIHRoZSBzZW5kaW5nIGludGVydmFsXHJcblx0XHRzZW5kSW50ZXJ2YWw6IE1hdGNoLk9wdGlvbmFsKE51bWJlciksXHJcblx0XHQvLyBDb250cm9scyB0aGUgc2VuZGluZyBiYXRjaCBzaXplIHBlciBpbnRlcnZhbFxyXG5cdFx0c2VuZEJhdGNoU2l6ZTogTWF0Y2guT3B0aW9uYWwoTnVtYmVyKSxcclxuXHRcdC8vIEFsbG93IG9wdGlvbmFsIGtlZXBpbmcgbm90aWZpY2F0aW9ucyBpbiBjb2xsZWN0aW9uXHJcblx0XHRrZWVwRG9jczogTWF0Y2guT3B0aW9uYWwoQm9vbGVhbilcclxuXHR9XHJcbiovXHJcbkluc3RhbmNlUmVjb3JkUXVldWUuQ29uZmlndXJlID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuXHR2YXIgc2VsZiA9IHRoaXM7XHJcblx0b3B0aW9ucyA9IF8uZXh0ZW5kKHtcclxuXHRcdHNlbmRUaW1lb3V0OiA2MDAwMCwgLy8gVGltZW91dCBwZXJpb2RcclxuXHR9LCBvcHRpb25zKTtcclxuXHJcblx0Ly8gQmxvY2sgbXVsdGlwbGUgY2FsbHNcclxuXHRpZiAoaXNDb25maWd1cmVkKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ0luc3RhbmNlUmVjb3JkUXVldWUuQ29uZmlndXJlIHNob3VsZCBub3QgYmUgY2FsbGVkIG1vcmUgdGhhbiBvbmNlIScpO1xyXG5cdH1cclxuXHJcblx0aXNDb25maWd1cmVkID0gdHJ1ZTtcclxuXHJcblx0Ly8gQWRkIGRlYnVnIGluZm9cclxuXHRpZiAoSW5zdGFuY2VSZWNvcmRRdWV1ZS5kZWJ1Zykge1xyXG5cdFx0Y29uc29sZS5sb2coJ0luc3RhbmNlUmVjb3JkUXVldWUuQ29uZmlndXJlJywgb3B0aW9ucyk7XHJcblx0fVxyXG5cclxuXHRzZWxmLnN5bmNBdHRhY2ggPSBmdW5jdGlvbiAoc3luY19hdHRhY2htZW50LCBpbnNJZCwgc3BhY2VJZCwgbmV3UmVjb3JkSWQsIG9iamVjdE5hbWUpIHtcclxuXHRcdGlmIChzeW5jX2F0dGFjaG1lbnQgPT0gXCJsYXN0ZXN0XCIpIHtcclxuXHRcdFx0Y2ZzLmluc3RhbmNlcy5maW5kKHtcclxuXHRcdFx0XHQnbWV0YWRhdGEuaW5zdGFuY2UnOiBpbnNJZCxcclxuXHRcdFx0XHQnbWV0YWRhdGEuY3VycmVudCc6IHRydWVcclxuXHRcdFx0fSkuZm9yRWFjaChmdW5jdGlvbiAoZikge1xyXG5cdFx0XHRcdHZhciBuZXdGaWxlID0gbmV3IEZTLkZpbGUoKSxcclxuXHRcdFx0XHRcdGNtc0ZpbGVJZCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignY21zX2ZpbGVzJykuX21ha2VOZXdJRCgpO1xyXG5cclxuXHRcdFx0XHRuZXdGaWxlLmF0dGFjaERhdGEoZi5jcmVhdGVSZWFkU3RyZWFtKCdpbnN0YW5jZXMnKSwge1xyXG5cdFx0XHRcdFx0dHlwZTogZi5vcmlnaW5hbC50eXBlXHJcblx0XHRcdFx0fSwgZnVuY3Rpb24gKGVycikge1xyXG5cdFx0XHRcdFx0aWYgKGVycikge1xyXG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKGVyci5lcnJvciwgZXJyLnJlYXNvbik7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRuZXdGaWxlLm5hbWUoZi5uYW1lKCkpO1xyXG5cdFx0XHRcdFx0bmV3RmlsZS5zaXplKGYuc2l6ZSgpKTtcclxuXHRcdFx0XHRcdHZhciBtZXRhZGF0YSA9IHtcclxuXHRcdFx0XHRcdFx0b3duZXI6IGYubWV0YWRhdGEub3duZXIsXHJcblx0XHRcdFx0XHRcdG93bmVyX25hbWU6IGYubWV0YWRhdGEub3duZXJfbmFtZSxcclxuXHRcdFx0XHRcdFx0c3BhY2U6IHNwYWNlSWQsXHJcblx0XHRcdFx0XHRcdHJlY29yZF9pZDogbmV3UmVjb3JkSWQsXHJcblx0XHRcdFx0XHRcdG9iamVjdF9uYW1lOiBvYmplY3ROYW1lLFxyXG5cdFx0XHRcdFx0XHRwYXJlbnQ6IGNtc0ZpbGVJZFxyXG5cdFx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0XHRuZXdGaWxlLm1ldGFkYXRhID0gbWV0YWRhdGE7XHJcblx0XHRcdFx0XHR2YXIgZmlsZU9iaiA9IGNmcy5maWxlcy5pbnNlcnQobmV3RmlsZSk7XHJcblx0XHRcdFx0XHRpZiAoZmlsZU9iaikge1xyXG5cdFx0XHRcdFx0XHRDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2Ntc19maWxlcycpLmluc2VydCh7XHJcblx0XHRcdFx0XHRcdFx0X2lkOiBjbXNGaWxlSWQsXHJcblx0XHRcdFx0XHRcdFx0cGFyZW50OiB7XHJcblx0XHRcdFx0XHRcdFx0XHRvOiBvYmplY3ROYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0aWRzOiBbbmV3UmVjb3JkSWRdXHJcblx0XHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0XHRzaXplOiBmaWxlT2JqLnNpemUoKSxcclxuXHRcdFx0XHRcdFx0XHRuYW1lOiBmaWxlT2JqLm5hbWUoKSxcclxuXHRcdFx0XHRcdFx0XHRleHRlbnRpb246IGZpbGVPYmouZXh0ZW5zaW9uKCksXHJcblx0XHRcdFx0XHRcdFx0c3BhY2U6IHNwYWNlSWQsXHJcblx0XHRcdFx0XHRcdFx0dmVyc2lvbnM6IFtmaWxlT2JqLl9pZF0sXHJcblx0XHRcdFx0XHRcdFx0b3duZXI6IGYubWV0YWRhdGEub3duZXIsXHJcblx0XHRcdFx0XHRcdFx0Y3JlYXRlZF9ieTogZi5tZXRhZGF0YS5vd25lcixcclxuXHRcdFx0XHRcdFx0XHRtb2RpZmllZF9ieTogZi5tZXRhZGF0YS5vd25lclxyXG5cdFx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pXHJcblx0XHRcdH0pXHJcblx0XHR9IGVsc2UgaWYgKHN5bmNfYXR0YWNobWVudCA9PSBcImFsbFwiKSB7XHJcblx0XHRcdHZhciBwYXJlbnRzID0gW107XHJcblx0XHRcdGNmcy5pbnN0YW5jZXMuZmluZCh7XHJcblx0XHRcdFx0J21ldGFkYXRhLmluc3RhbmNlJzogaW5zSWRcclxuXHRcdFx0fSkuZm9yRWFjaChmdW5jdGlvbiAoZikge1xyXG5cdFx0XHRcdHZhciBuZXdGaWxlID0gbmV3IEZTLkZpbGUoKSxcclxuXHRcdFx0XHRcdGNtc0ZpbGVJZCA9IGYubWV0YWRhdGEucGFyZW50O1xyXG5cclxuXHRcdFx0XHRpZiAoIXBhcmVudHMuaW5jbHVkZXMoY21zRmlsZUlkKSkge1xyXG5cdFx0XHRcdFx0cGFyZW50cy5wdXNoKGNtc0ZpbGVJZCk7XHJcblx0XHRcdFx0XHRDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2Ntc19maWxlcycpLmluc2VydCh7XHJcblx0XHRcdFx0XHRcdF9pZDogY21zRmlsZUlkLFxyXG5cdFx0XHRcdFx0XHRwYXJlbnQ6IHtcclxuXHRcdFx0XHRcdFx0XHRvOiBvYmplY3ROYW1lLFxyXG5cdFx0XHRcdFx0XHRcdGlkczogW25ld1JlY29yZElkXVxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHRzcGFjZTogc3BhY2VJZCxcclxuXHRcdFx0XHRcdFx0dmVyc2lvbnM6IFtdLFxyXG5cdFx0XHRcdFx0XHRvd25lcjogZi5tZXRhZGF0YS5vd25lcixcclxuXHRcdFx0XHRcdFx0Y3JlYXRlZF9ieTogZi5tZXRhZGF0YS5vd25lcixcclxuXHRcdFx0XHRcdFx0bW9kaWZpZWRfYnk6IGYubWV0YWRhdGEub3duZXJcclxuXHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRuZXdGaWxlLmF0dGFjaERhdGEoZi5jcmVhdGVSZWFkU3RyZWFtKCdpbnN0YW5jZXMnKSwge1xyXG5cdFx0XHRcdFx0dHlwZTogZi5vcmlnaW5hbC50eXBlXHJcblx0XHRcdFx0fSwgZnVuY3Rpb24gKGVycikge1xyXG5cdFx0XHRcdFx0aWYgKGVycikge1xyXG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKGVyci5lcnJvciwgZXJyLnJlYXNvbik7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRuZXdGaWxlLm5hbWUoZi5uYW1lKCkpO1xyXG5cdFx0XHRcdFx0bmV3RmlsZS5zaXplKGYuc2l6ZSgpKTtcclxuXHRcdFx0XHRcdHZhciBtZXRhZGF0YSA9IHtcclxuXHRcdFx0XHRcdFx0b3duZXI6IGYubWV0YWRhdGEub3duZXIsXHJcblx0XHRcdFx0XHRcdG93bmVyX25hbWU6IGYubWV0YWRhdGEub3duZXJfbmFtZSxcclxuXHRcdFx0XHRcdFx0c3BhY2U6IHNwYWNlSWQsXHJcblx0XHRcdFx0XHRcdHJlY29yZF9pZDogbmV3UmVjb3JkSWQsXHJcblx0XHRcdFx0XHRcdG9iamVjdF9uYW1lOiBvYmplY3ROYW1lLFxyXG5cdFx0XHRcdFx0XHRwYXJlbnQ6IGNtc0ZpbGVJZFxyXG5cdFx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0XHRuZXdGaWxlLm1ldGFkYXRhID0gbWV0YWRhdGE7XHJcblx0XHRcdFx0XHR2YXIgZmlsZU9iaiA9IGNmcy5maWxlcy5pbnNlcnQobmV3RmlsZSk7XHJcblx0XHRcdFx0XHRpZiAoZmlsZU9iaikge1xyXG5cclxuXHRcdFx0XHRcdFx0aWYgKGYubWV0YWRhdGEuY3VycmVudCA9PSB0cnVlKSB7XHJcblx0XHRcdFx0XHRcdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKCdjbXNfZmlsZXMnKS51cGRhdGUoY21zRmlsZUlkLCB7XHJcblx0XHRcdFx0XHRcdFx0XHQkc2V0OiB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHNpemU6IGZpbGVPYmouc2l6ZSgpLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRuYW1lOiBmaWxlT2JqLm5hbWUoKSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZXh0ZW50aW9uOiBmaWxlT2JqLmV4dGVuc2lvbigpLFxyXG5cdFx0XHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0XHRcdCRhZGRUb1NldDoge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR2ZXJzaW9uczogZmlsZU9iai5faWRcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbignY21zX2ZpbGVzJykudXBkYXRlKGNtc0ZpbGVJZCwge1xyXG5cdFx0XHRcdFx0XHRcdFx0JGFkZFRvU2V0OiB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHZlcnNpb25zOiBmaWxlT2JqLl9pZFxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KVxyXG5cdFx0XHR9KVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0c2VsZi5zeW5jSW5zRmllbGRzID0gWyduYW1lJywgJ3N1Ym1pdHRlcl9uYW1lJywgJ2FwcGxpY2FudF9uYW1lJywgJ2FwcGxpY2FudF9vcmdhbml6YXRpb25fbmFtZScsICdhcHBsaWNhbnRfb3JnYW5pemF0aW9uX2Z1bGxuYW1lJywgJ3N0YXRlJyxcclxuXHRcdCdjdXJyZW50X3N0ZXBfbmFtZScsICdmbG93X25hbWUnLCAnY2F0ZWdvcnlfbmFtZScsICdzdWJtaXRfZGF0ZScsICdmaW5pc2hfZGF0ZScsICdmaW5hbF9kZWNpc2lvbicsICdhcHBsaWNhbnRfb3JnYW5pemF0aW9uJywgJ2FwcGxpY2FudF9jb21wYW55J1xyXG5cdF07XHJcblx0c2VsZi5zeW5jVmFsdWVzID0gZnVuY3Rpb24gKGZpZWxkX21hcF9iYWNrLCB2YWx1ZXMsIGlucywgb2JqZWN0SW5mbywgZmllbGRfbWFwX2JhY2tfc2NyaXB0LCByZWNvcmQpIHtcclxuXHRcdHZhclxyXG5cdFx0XHRvYmogPSB7fSxcclxuXHRcdFx0dGFibGVGaWVsZENvZGVzID0gW10sXHJcblx0XHRcdHRhYmxlRmllbGRNYXAgPSBbXTtcclxuXHRcdFx0dGFibGVUb1JlbGF0ZWRNYXAgPSB7fTtcclxuXHJcblx0XHRmaWVsZF9tYXBfYmFjayA9IGZpZWxkX21hcF9iYWNrIHx8IFtdO1xyXG5cclxuXHRcdHZhciBzcGFjZUlkID0gaW5zLnNwYWNlO1xyXG5cclxuXHRcdHZhciBmb3JtID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwiZm9ybXNcIikuZmluZE9uZShpbnMuZm9ybSk7XHJcblx0XHR2YXIgZm9ybUZpZWxkcyA9IG51bGw7XHJcblx0XHRpZiAoZm9ybS5jdXJyZW50Ll9pZCA9PT0gaW5zLmZvcm1fdmVyc2lvbikge1xyXG5cdFx0XHRmb3JtRmllbGRzID0gZm9ybS5jdXJyZW50LmZpZWxkcyB8fCBbXTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHZhciBmb3JtVmVyc2lvbiA9IF8uZmluZChmb3JtLmhpc3RvcnlzLCBmdW5jdGlvbiAoaCkge1xyXG5cdFx0XHRcdHJldHVybiBoLl9pZCA9PT0gaW5zLmZvcm1fdmVyc2lvbjtcclxuXHRcdFx0fSlcclxuXHRcdFx0Zm9ybUZpZWxkcyA9IGZvcm1WZXJzaW9uID8gZm9ybVZlcnNpb24uZmllbGRzIDogW107XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIG9iamVjdEZpZWxkcyA9IG9iamVjdEluZm8uZmllbGRzO1xyXG5cdFx0dmFyIG9iamVjdEZpZWxkS2V5cyA9IF8ua2V5cyhvYmplY3RGaWVsZHMpO1xyXG5cdFx0dmFyIHJlbGF0ZWRPYmplY3RzID0gQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0cyhvYmplY3RJbmZvLm5hbWUsc3BhY2VJZCk7XHJcblx0XHR2YXIgcmVsYXRlZE9iamVjdHNLZXlzID0gXy5wbHVjayhyZWxhdGVkT2JqZWN0cywgJ29iamVjdF9uYW1lJyk7XHJcblx0XHR2YXIgZm9ybVRhYmxlRmllbGRzID0gXy5maWx0ZXIoZm9ybUZpZWxkcywgZnVuY3Rpb24oZm9ybUZpZWxkKXtcclxuXHRcdFx0cmV0dXJuIGZvcm1GaWVsZC50eXBlID09PSAndGFibGUnXHJcblx0XHR9KTtcclxuXHRcdHZhciBmb3JtVGFibGVGaWVsZHNDb2RlID0gIF8ucGx1Y2soZm9ybVRhYmxlRmllbGRzLCAnY29kZScpO1xyXG5cclxuXHRcdHZhciBnZXRSZWxhdGVkT2JqZWN0RmllbGQgPSBmdW5jdGlvbihrZXkpe1xyXG5cdFx0XHRyZXR1cm4gXy5maW5kKHJlbGF0ZWRPYmplY3RzS2V5cywgZnVuY3Rpb24ocmVsYXRlZE9iamVjdHNLZXkpe1xyXG5cdFx0XHRcdHJldHVybiBrZXkuc3RhcnRzV2l0aChyZWxhdGVkT2JqZWN0c0tleSArICcuJyk7XHJcblx0XHRcdH0pXHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBnZXRGb3JtVGFibGVGaWVsZCA9IGZ1bmN0aW9uIChrZXkpIHtcclxuXHRcdFx0cmV0dXJuIF8uZmluZChmb3JtVGFibGVGaWVsZHNDb2RlLCBmdW5jdGlvbihmb3JtVGFibGVGaWVsZENvZGUpe1xyXG5cdFx0XHRcdHJldHVybiBrZXkuc3RhcnRzV2l0aChmb3JtVGFibGVGaWVsZENvZGUgKyAnLicpO1xyXG5cdFx0XHR9KVxyXG5cdFx0fTtcclxuXHJcblx0XHR2YXIgZ2V0Rm9ybUZpZWxkID0gZnVuY3Rpb24oX2Zvcm1GaWVsZHMsIF9maWVsZENvZGUpe1xyXG5cdFx0XHR2YXIgZm9ybUZpZWxkID0gbnVsbDtcclxuXHRcdFx0Xy5lYWNoKF9mb3JtRmllbGRzLCBmdW5jdGlvbiAoZmYpIHtcclxuXHRcdFx0XHRpZiAoIWZvcm1GaWVsZCkge1xyXG5cdFx0XHRcdFx0aWYgKGZmLmNvZGUgPT09IF9maWVsZENvZGUpIHtcclxuXHRcdFx0XHRcdFx0Zm9ybUZpZWxkID0gZmY7XHJcblx0XHRcdFx0XHR9IGVsc2UgaWYgKGZmLnR5cGUgPT09ICdzZWN0aW9uJykge1xyXG5cdFx0XHRcdFx0XHRfLmVhY2goZmYuZmllbGRzLCBmdW5jdGlvbiAoZikge1xyXG5cdFx0XHRcdFx0XHRcdGlmICghZm9ybUZpZWxkKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoZi5jb2RlID09PSBfZmllbGRDb2RlKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGZvcm1GaWVsZCA9IGY7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0fWVsc2UgaWYgKGZmLnR5cGUgPT09ICd0YWJsZScpIHtcclxuXHRcdFx0XHRcdFx0Xy5lYWNoKGZmLmZpZWxkcywgZnVuY3Rpb24gKGYpIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAoIWZvcm1GaWVsZCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKGYuY29kZSA9PT0gX2ZpZWxkQ29kZSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRmb3JtRmllbGQgPSBmO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRyZXR1cm4gZm9ybUZpZWxkO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZpZWxkX21hcF9iYWNrLmZvckVhY2goZnVuY3Rpb24gKGZtKSB7XHJcblx0XHRcdC8vd29ya2Zsb3cg55qE5a2Q6KGo5YiwY3JlYXRvciBvYmplY3Qg55qE55u45YWz5a+56LGhXHJcblx0XHRcdHZhciByZWxhdGVkT2JqZWN0RmllbGQgPSBnZXRSZWxhdGVkT2JqZWN0RmllbGQoZm0ub2JqZWN0X2ZpZWxkKTtcclxuXHRcdFx0dmFyIGZvcm1UYWJsZUZpZWxkID0gZ2V0Rm9ybVRhYmxlRmllbGQoZm0ud29ya2Zsb3dfZmllbGQpO1xyXG5cdFx0XHRpZiAocmVsYXRlZE9iamVjdEZpZWxkKXtcclxuXHRcdFx0XHR2YXIgb1RhYmxlQ29kZSA9IGZtLm9iamVjdF9maWVsZC5zcGxpdCgnLicpWzBdO1xyXG5cdFx0XHRcdHZhciBvVGFibGVGaWVsZENvZGUgPSBmbS5vYmplY3RfZmllbGQuc3BsaXQoJy4nKVsxXTtcclxuXHRcdFx0XHR2YXIgdGFibGVUb1JlbGF0ZWRNYXBLZXkgPSBvVGFibGVDb2RlO1xyXG5cdFx0XHRcdGlmKCF0YWJsZVRvUmVsYXRlZE1hcFt0YWJsZVRvUmVsYXRlZE1hcEtleV0pe1xyXG5cdFx0XHRcdFx0dGFibGVUb1JlbGF0ZWRNYXBbdGFibGVUb1JlbGF0ZWRNYXBLZXldID0ge31cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmKGZvcm1UYWJsZUZpZWxkKXtcclxuXHRcdFx0XHRcdHZhciB3VGFibGVDb2RlID0gZm0ud29ya2Zsb3dfZmllbGQuc3BsaXQoJy4nKVswXTtcclxuXHRcdFx0XHRcdHRhYmxlVG9SZWxhdGVkTWFwW3RhYmxlVG9SZWxhdGVkTWFwS2V5XVsnX0ZST01fVEFCTEVfQ09ERSddID0gd1RhYmxlQ29kZVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0dGFibGVUb1JlbGF0ZWRNYXBbdGFibGVUb1JlbGF0ZWRNYXBLZXldW29UYWJsZUZpZWxkQ29kZV0gPSBmbS53b3JrZmxvd19maWVsZFxyXG5cdFx0XHR9XHJcblx0XHRcdC8vIOWIpOaWreaYr+WQpuaYr+WtkOihqOWtl+autVxyXG5cdFx0XHRlbHNlIGlmIChmbS53b3JrZmxvd19maWVsZC5pbmRleE9mKCcuJC4nKSA+IDAgJiYgZm0ub2JqZWN0X2ZpZWxkLmluZGV4T2YoJy4kLicpID4gMCkge1xyXG5cdFx0XHRcdHZhciB3VGFibGVDb2RlID0gZm0ud29ya2Zsb3dfZmllbGQuc3BsaXQoJy4kLicpWzBdO1xyXG5cdFx0XHRcdHZhciBvVGFibGVDb2RlID0gZm0ub2JqZWN0X2ZpZWxkLnNwbGl0KCcuJC4nKVswXTtcclxuXHRcdFx0XHRpZiAodmFsdWVzLmhhc093blByb3BlcnR5KHdUYWJsZUNvZGUpICYmIF8uaXNBcnJheSh2YWx1ZXNbd1RhYmxlQ29kZV0pKSB7XHJcblx0XHRcdFx0XHR0YWJsZUZpZWxkQ29kZXMucHVzaChKU09OLnN0cmluZ2lmeSh7XHJcblx0XHRcdFx0XHRcdHdvcmtmbG93X3RhYmxlX2ZpZWxkX2NvZGU6IHdUYWJsZUNvZGUsXHJcblx0XHRcdFx0XHRcdG9iamVjdF90YWJsZV9maWVsZF9jb2RlOiBvVGFibGVDb2RlXHJcblx0XHRcdFx0XHR9KSk7XHJcblx0XHRcdFx0XHR0YWJsZUZpZWxkTWFwLnB1c2goZm0pO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAodmFsdWVzLmhhc093blByb3BlcnR5KGZtLndvcmtmbG93X2ZpZWxkKSkge1xyXG5cdFx0XHRcdHZhciB3RmllbGQgPSBudWxsO1xyXG5cclxuXHRcdFx0XHRfLmVhY2goZm9ybUZpZWxkcywgZnVuY3Rpb24gKGZmKSB7XHJcblx0XHRcdFx0XHRpZiAoIXdGaWVsZCkge1xyXG5cdFx0XHRcdFx0XHRpZiAoZmYuY29kZSA9PT0gZm0ud29ya2Zsb3dfZmllbGQpIHtcclxuXHRcdFx0XHRcdFx0XHR3RmllbGQgPSBmZjtcclxuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChmZi50eXBlID09PSAnc2VjdGlvbicpIHtcclxuXHRcdFx0XHRcdFx0XHRfLmVhY2goZmYuZmllbGRzLCBmdW5jdGlvbiAoZikge1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKCF3RmllbGQpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKGYuY29kZSA9PT0gZm0ud29ya2Zsb3dfZmllbGQpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR3RmllbGQgPSBmO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pXHJcblxyXG5cdFx0XHRcdHZhciBvRmllbGQgPSBvYmplY3RGaWVsZHNbZm0ub2JqZWN0X2ZpZWxkXTtcclxuXHJcblx0XHRcdFx0aWYgKG9GaWVsZCkge1xyXG5cdFx0XHRcdFx0aWYgKCF3RmllbGQpIHtcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coJ2ZtLndvcmtmbG93X2ZpZWxkOiAnLCBmbS53b3JrZmxvd19maWVsZClcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdC8vIOihqOWNlemAieS6uumAiee7hOWtl+autSDoh7Mg5a+56LGhIGxvb2t1cCBtYXN0ZXJfZGV0YWls57G75Z6L5a2X5q615ZCM5q2lXHJcblx0XHRcdFx0XHRpZiAoIXdGaWVsZC5pc19tdWx0aXNlbGVjdCAmJiBbJ3VzZXInLCAnZ3JvdXAnXS5pbmNsdWRlcyh3RmllbGQudHlwZSkgJiYgIW9GaWVsZC5tdWx0aXBsZSAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMob0ZpZWxkLnR5cGUpICYmIFsndXNlcnMnLCAnb3JnYW5pemF0aW9ucyddLmluY2x1ZGVzKG9GaWVsZC5yZWZlcmVuY2VfdG8pKSB7XHJcblx0XHRcdFx0XHRcdG9ialtmbS5vYmplY3RfZmllbGRdID0gdmFsdWVzW2ZtLndvcmtmbG93X2ZpZWxkXVsnaWQnXTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVsc2UgaWYgKCFvRmllbGQubXVsdGlwbGUgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKG9GaWVsZC50eXBlKSAmJiBfLmlzU3RyaW5nKG9GaWVsZC5yZWZlcmVuY2VfdG8pICYmIF8uaXNTdHJpbmcodmFsdWVzW2ZtLndvcmtmbG93X2ZpZWxkXSkpIHtcclxuXHRcdFx0XHRcdFx0dmFyIG9Db2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9GaWVsZC5yZWZlcmVuY2VfdG8sIHNwYWNlSWQpXHJcblx0XHRcdFx0XHRcdHZhciByZWZlck9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9GaWVsZC5yZWZlcmVuY2VfdG8sIHNwYWNlSWQpXHJcblx0XHRcdFx0XHRcdGlmIChvQ29sbGVjdGlvbiAmJiByZWZlck9iamVjdCkge1xyXG5cdFx0XHRcdFx0XHRcdC8vIOWFiOiupOS4uuatpOWAvOaYr3JlZmVyT2JqZWN0IF9pZOWtl+auteWAvFxyXG5cdFx0XHRcdFx0XHRcdHZhciByZWZlckRhdGEgPSBvQ29sbGVjdGlvbi5maW5kT25lKHZhbHVlc1tmbS53b3JrZmxvd19maWVsZF0sIHtcclxuXHRcdFx0XHRcdFx0XHRcdGZpZWxkczoge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRfaWQ6IDFcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRpZiAocmVmZXJEYXRhKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRvYmpbZm0ub2JqZWN0X2ZpZWxkXSA9IHJlZmVyRGF0YS5faWQ7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHQvLyDlhbbmrKHorqTkuLrmraTlgLzmmK9yZWZlck9iamVjdCBOQU1FX0ZJRUxEX0tFWeWAvFxyXG5cdFx0XHRcdFx0XHRcdGlmICghcmVmZXJEYXRhKSB7XHJcblx0XHRcdFx0XHRcdFx0XHR2YXIgbmFtZUZpZWxkS2V5ID0gcmVmZXJPYmplY3QuTkFNRV9GSUVMRF9LRVk7XHJcblx0XHRcdFx0XHRcdFx0XHR2YXIgc2VsZWN0b3IgPSB7fTtcclxuXHRcdFx0XHRcdFx0XHRcdHNlbGVjdG9yW25hbWVGaWVsZEtleV0gPSB2YWx1ZXNbZm0ud29ya2Zsb3dfZmllbGRdO1xyXG5cdFx0XHRcdFx0XHRcdFx0cmVmZXJEYXRhID0gb0NvbGxlY3Rpb24uZmluZE9uZShzZWxlY3Rvciwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRmaWVsZHM6IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRfaWQ6IDFcclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAocmVmZXJEYXRhKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdG9ialtmbS5vYmplY3RfZmllbGRdID0gcmVmZXJEYXRhLl9pZDtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdFx0aWYgKG9GaWVsZC50eXBlID09PSBcImJvb2xlYW5cIikge1xyXG5cdFx0XHRcdFx0XHRcdHZhciB0bXBfZmllbGRfdmFsdWUgPSB2YWx1ZXNbZm0ud29ya2Zsb3dfZmllbGRdO1xyXG5cdFx0XHRcdFx0XHRcdGlmIChbJ3RydWUnLCAn5pivJ10uaW5jbHVkZXModG1wX2ZpZWxkX3ZhbHVlKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0b2JqW2ZtLm9iamVjdF9maWVsZF0gPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoWydmYWxzZScsICflkKYnXS5pbmNsdWRlcyh0bXBfZmllbGRfdmFsdWUpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRvYmpbZm0ub2JqZWN0X2ZpZWxkXSA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRvYmpbZm0ub2JqZWN0X2ZpZWxkXSA9IHRtcF9maWVsZF92YWx1ZTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0ZWxzZSBpZihbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMob0ZpZWxkLnR5cGUpICYmIHdGaWVsZC50eXBlID09PSAnb2RhdGEnKXtcclxuXHRcdFx0XHRcdFx0XHRpZihvRmllbGQubXVsdGlwbGUgJiYgd0ZpZWxkLmlzX211bHRpc2VsZWN0KXtcclxuXHRcdFx0XHRcdFx0XHRcdG9ialtmbS5vYmplY3RfZmllbGRdID0gXy5jb21wYWN0KF8ucGx1Y2sodmFsdWVzW2ZtLndvcmtmbG93X2ZpZWxkXSwgJ19pZCcpKVxyXG5cdFx0XHRcdFx0XHRcdH1lbHNlIGlmKCFvRmllbGQubXVsdGlwbGUgJiYgIXdGaWVsZC5pc19tdWx0aXNlbGVjdCl7XHJcblx0XHRcdFx0XHRcdFx0XHRpZighXy5pc0VtcHR5KHZhbHVlc1tmbS53b3JrZmxvd19maWVsZF0pKXtcclxuXHRcdFx0XHRcdFx0XHRcdFx0b2JqW2ZtLm9iamVjdF9maWVsZF0gPSBcdHZhbHVlc1tmbS53b3JrZmxvd19maWVsZF0uX2lkXHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdFx0XHRvYmpbZm0ub2JqZWN0X2ZpZWxkXSA9IHZhbHVlc1tmbS53b3JrZmxvd19maWVsZF07XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdG9ialtmbS5vYmplY3RfZmllbGRdID0gdmFsdWVzW2ZtLndvcmtmbG93X2ZpZWxkXTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRpZiAoZm0ub2JqZWN0X2ZpZWxkLmluZGV4T2YoJy4nKSA+IC0xKSB7XHJcblx0XHRcdFx0XHRcdHZhciB0ZW1PYmpGaWVsZHMgPSBmbS5vYmplY3RfZmllbGQuc3BsaXQoJy4nKTtcclxuXHRcdFx0XHRcdFx0aWYgKHRlbU9iakZpZWxkcy5sZW5ndGggPT09IDIpIHtcclxuXHRcdFx0XHRcdFx0XHR2YXIgb2JqRmllbGQgPSB0ZW1PYmpGaWVsZHNbMF07XHJcblx0XHRcdFx0XHRcdFx0dmFyIHJlZmVyT2JqRmllbGQgPSB0ZW1PYmpGaWVsZHNbMV07XHJcblx0XHRcdFx0XHRcdFx0dmFyIG9GaWVsZCA9IG9iamVjdEZpZWxkc1tvYmpGaWVsZF07XHJcblx0XHRcdFx0XHRcdFx0aWYgKCFvRmllbGQubXVsdGlwbGUgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKG9GaWVsZC50eXBlKSAmJiBfLmlzU3RyaW5nKG9GaWVsZC5yZWZlcmVuY2VfdG8pKSB7XHJcblx0XHRcdFx0XHRcdFx0XHR2YXIgb0NvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob0ZpZWxkLnJlZmVyZW5jZV90bywgc3BhY2VJZClcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChvQ29sbGVjdGlvbiAmJiByZWNvcmQgJiYgcmVjb3JkW29iakZpZWxkXSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR2YXIgcmVmZXJTZXRPYmogPSB7fTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0cmVmZXJTZXRPYmpbcmVmZXJPYmpGaWVsZF0gPSB2YWx1ZXNbZm0ud29ya2Zsb3dfZmllbGRdO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRvQ29sbGVjdGlvbi51cGRhdGUocmVjb3JkW29iakZpZWxkXSwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCRzZXQ6IHJlZmVyU2V0T2JqXHJcblx0XHRcdFx0XHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHQvLyBlbHNle1xyXG5cdFx0XHRcdFx0Ly8gXHR2YXIgcmVsYXRlZE9iamVjdCA9IF8uZmluZChyZWxhdGVkT2JqZWN0cywgZnVuY3Rpb24oX3JlbGF0ZWRPYmplY3Qpe1xyXG5cdFx0XHRcdFx0Ly8gXHRcdHJldHVybiBfcmVsYXRlZE9iamVjdC5vYmplY3RfbmFtZSA9PT0gZm0ub2JqZWN0X2ZpZWxkXHJcblx0XHRcdFx0XHQvLyBcdH0pXHJcblx0XHRcdFx0XHQvL1xyXG5cdFx0XHRcdFx0Ly8gXHRpZihyZWxhdGVkT2JqZWN0KXtcclxuXHRcdFx0XHRcdC8vIFx0XHRvYmpbZm0ub2JqZWN0X2ZpZWxkXSA9IHZhbHVlc1tmbS53b3JrZmxvd19maWVsZF07XHJcblx0XHRcdFx0XHQvLyBcdH1cclxuXHRcdFx0XHRcdC8vIH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdGlmIChmbS53b3JrZmxvd19maWVsZC5zdGFydHNXaXRoKCdpbnN0YW5jZS4nKSkge1xyXG5cdFx0XHRcdFx0dmFyIGluc0ZpZWxkID0gZm0ud29ya2Zsb3dfZmllbGQuc3BsaXQoJ2luc3RhbmNlLicpWzFdO1xyXG5cdFx0XHRcdFx0aWYgKHNlbGYuc3luY0luc0ZpZWxkcy5pbmNsdWRlcyhpbnNGaWVsZCkpIHtcclxuXHRcdFx0XHRcdFx0aWYgKGZtLm9iamVjdF9maWVsZC5pbmRleE9mKCcuJykgPCAwKSB7XHJcblx0XHRcdFx0XHRcdFx0b2JqW2ZtLm9iamVjdF9maWVsZF0gPSBpbnNbaW5zRmllbGRdO1xyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdHZhciB0ZW1PYmpGaWVsZHMgPSBmbS5vYmplY3RfZmllbGQuc3BsaXQoJy4nKTtcclxuXHRcdFx0XHRcdFx0XHRpZiAodGVtT2JqRmllbGRzLmxlbmd0aCA9PT0gMikge1xyXG5cdFx0XHRcdFx0XHRcdFx0dmFyIG9iakZpZWxkID0gdGVtT2JqRmllbGRzWzBdO1xyXG5cdFx0XHRcdFx0XHRcdFx0dmFyIHJlZmVyT2JqRmllbGQgPSB0ZW1PYmpGaWVsZHNbMV07XHJcblx0XHRcdFx0XHRcdFx0XHR2YXIgb0ZpZWxkID0gb2JqZWN0RmllbGRzW29iakZpZWxkXTtcclxuXHRcdFx0XHRcdFx0XHRcdGlmICghb0ZpZWxkLm11bHRpcGxlICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhvRmllbGQudHlwZSkgJiYgXy5pc1N0cmluZyhvRmllbGQucmVmZXJlbmNlX3RvKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR2YXIgb0NvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob0ZpZWxkLnJlZmVyZW5jZV90bywgc3BhY2VJZClcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKG9Db2xsZWN0aW9uICYmIHJlY29yZCAmJiByZWNvcmRbb2JqRmllbGRdKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0dmFyIHJlZmVyU2V0T2JqID0ge307XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmVmZXJTZXRPYmpbcmVmZXJPYmpGaWVsZF0gPSBpbnNbaW5zRmllbGRdO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdG9Db2xsZWN0aW9uLnVwZGF0ZShyZWNvcmRbb2JqRmllbGRdLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQkc2V0OiByZWZlclNldE9ialxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGlmIChpbnNbZm0ud29ya2Zsb3dfZmllbGRdKSB7XHJcblx0XHRcdFx0XHRcdG9ialtmbS5vYmplY3RfZmllbGRdID0gaW5zW2ZtLndvcmtmbG93X2ZpZWxkXTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pXHJcblxyXG5cdFx0Xy51bmlxKHRhYmxlRmllbGRDb2RlcykuZm9yRWFjaChmdW5jdGlvbiAodGZjKSB7XHJcblx0XHRcdHZhciBjID0gSlNPTi5wYXJzZSh0ZmMpO1xyXG5cdFx0XHRvYmpbYy5vYmplY3RfdGFibGVfZmllbGRfY29kZV0gPSBbXTtcclxuXHRcdFx0dmFsdWVzW2Mud29ya2Zsb3dfdGFibGVfZmllbGRfY29kZV0uZm9yRWFjaChmdW5jdGlvbiAodHIpIHtcclxuXHRcdFx0XHR2YXIgbmV3VHIgPSB7fTtcclxuXHRcdFx0XHRfLmVhY2godHIsIGZ1bmN0aW9uICh2LCBrKSB7XHJcblx0XHRcdFx0XHR0YWJsZUZpZWxkTWFwLmZvckVhY2goZnVuY3Rpb24gKHRmbSkge1xyXG5cdFx0XHRcdFx0XHRpZiAodGZtLndvcmtmbG93X2ZpZWxkID09IChjLndvcmtmbG93X3RhYmxlX2ZpZWxkX2NvZGUgKyAnLiQuJyArIGspKSB7XHJcblx0XHRcdFx0XHRcdFx0dmFyIG9UZENvZGUgPSB0Zm0ub2JqZWN0X2ZpZWxkLnNwbGl0KCcuJC4nKVsxXTtcclxuXHRcdFx0XHRcdFx0XHRuZXdUcltvVGRDb2RlXSA9IHY7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0fSlcclxuXHRcdFx0XHRpZiAoIV8uaXNFbXB0eShuZXdUcikpIHtcclxuXHRcdFx0XHRcdG9ialtjLm9iamVjdF90YWJsZV9maWVsZF9jb2RlXS5wdXNoKG5ld1RyKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pXHJcblx0XHR9KTtcclxuXHRcdHZhciByZWxhdGVkT2JqcyA9IHt9O1xyXG5cdFx0dmFyIGdldFJlbGF0ZWRGaWVsZFZhbHVlID0gZnVuY3Rpb24odmFsdWVLZXksIHBhcmVudCkge1xyXG5cdFx0XHRyZXR1cm4gdmFsdWVLZXkuc3BsaXQoJy4nKS5yZWR1Y2UoZnVuY3Rpb24obywgeCkge1xyXG5cdFx0XHRcdHJldHVybiBvW3hdO1xyXG5cdFx0XHR9LCBwYXJlbnQpO1xyXG5cdFx0fTtcclxuXHRcdF8uZWFjaCh0YWJsZVRvUmVsYXRlZE1hcCwgZnVuY3Rpb24obWFwLCBrZXkpe1xyXG5cdFx0XHR2YXIgdGFibGVDb2RlID0gbWFwLl9GUk9NX1RBQkxFX0NPREU7XHJcblx0XHRcdGlmKCF0YWJsZUNvZGUpe1xyXG5cdFx0XHRcdGNvbnNvbGUud2FybigndGFibGVUb1JlbGF0ZWQ6IFsnICsga2V5ICsgJ10gbWlzc2luZyBjb3JyZXNwb25kaW5nIHRhYmxlLicpXHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdHZhciByZWxhdGVkT2JqZWN0TmFtZSA9IGtleTtcclxuXHRcdFx0XHR2YXIgcmVsYXRlZE9iamVjdFZhbHVlcyA9IFtdO1xyXG5cdFx0XHRcdHZhciByZWxhdGVkT2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QocmVsYXRlZE9iamVjdE5hbWUsIHNwYWNlSWQpO1xyXG5cdFx0XHRcdF8uZWFjaCh2YWx1ZXNbdGFibGVDb2RlXSwgZnVuY3Rpb24gKHRhYmxlVmFsdWVJdGVtKSB7XHJcblx0XHRcdFx0XHR2YXIgcmVsYXRlZE9iamVjdFZhbHVlID0ge307XHJcblx0XHRcdFx0XHRfLmVhY2gobWFwLCBmdW5jdGlvbih2YWx1ZUtleSwgZmllbGRLZXkpe1xyXG5cdFx0XHRcdFx0XHRpZihmaWVsZEtleSAhPSAnX0ZST01fVEFCTEVfQ09ERScpe1xyXG5cdFx0XHRcdFx0XHRcdGlmKHZhbHVlS2V5LnN0YXJ0c1dpdGgoJ2luc3RhbmNlLicpKXtcclxuXHRcdFx0XHRcdFx0XHRcdHJlbGF0ZWRPYmplY3RWYWx1ZVtmaWVsZEtleV0gPSBnZXRSZWxhdGVkRmllbGRWYWx1ZSh2YWx1ZUtleSwgeydpbnN0YW5jZSc6IGluc30pO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRlbHNle1xyXG5cdFx0XHRcdFx0XHRcdFx0dmFyIHJlbGF0ZWRPYmplY3RGaWVsZFZhbHVlLCBmb3JtRmllbGRLZXk7XHJcblx0XHRcdFx0XHRcdFx0XHRpZih2YWx1ZUtleS5zdGFydHNXaXRoKHRhYmxlQ29kZSArICcuJykpe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRmb3JtRmllbGRLZXkgPSB2YWx1ZUtleS5zcGxpdChcIi5cIilbMV07XHJcblx0XHRcdFx0XHRcdFx0XHRcdHJlbGF0ZWRPYmplY3RGaWVsZFZhbHVlID0gZ2V0UmVsYXRlZEZpZWxkVmFsdWUodmFsdWVLZXksIHtbdGFibGVDb2RlXTp0YWJsZVZhbHVlSXRlbX0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGZvcm1GaWVsZEtleSA9IHZhbHVlS2V5O1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRyZWxhdGVkT2JqZWN0RmllbGRWYWx1ZSA9IGdldFJlbGF0ZWRGaWVsZFZhbHVlKHZhbHVlS2V5LCB2YWx1ZXMpXHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHR2YXIgZm9ybUZpZWxkID0gZ2V0Rm9ybUZpZWxkKGZvcm1GaWVsZHMsIGZvcm1GaWVsZEtleSk7XHJcblx0XHRcdFx0XHRcdFx0XHR2YXIgcmVsYXRlZE9iamVjdEZpZWxkID0gcmVsYXRlZE9iamVjdC5maWVsZHNbZmllbGRLZXldO1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYoZm9ybUZpZWxkLnR5cGUgPT0gJ29kYXRhJyAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMocmVsYXRlZE9iamVjdEZpZWxkLnR5cGUpKXtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYoIV8uaXNFbXB0eShyZWxhdGVkT2JqZWN0RmllbGRWYWx1ZSkpe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmKHJlbGF0ZWRPYmplY3RGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3Qpe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmVsYXRlZE9iamVjdEZpZWxkVmFsdWUgPSBfLmNvbXBhY3QoXy5wbHVjayhyZWxhdGVkT2JqZWN0RmllbGRWYWx1ZSwgJ19pZCcpKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1lbHNlIGlmKCFyZWxhdGVkT2JqZWN0RmllbGQubXVsdGlwbGUgJiYgIWZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCl7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZWxhdGVkT2JqZWN0RmllbGRWYWx1ZSA9IHJlbGF0ZWRPYmplY3RGaWVsZFZhbHVlLl9pZFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0cmVsYXRlZE9iamVjdFZhbHVlW2ZpZWxkS2V5XSA9IHJlbGF0ZWRPYmplY3RGaWVsZFZhbHVlO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRyZWxhdGVkT2JqZWN0VmFsdWVbJ190YWJsZSddID0ge1xyXG5cdFx0XHRcdFx0XHRfaWQ6IHRhYmxlVmFsdWVJdGVtW1wiX2lkXCJdLFxyXG5cdFx0XHRcdFx0XHRfY29kZTogdGFibGVDb2RlXHJcblx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0cmVsYXRlZE9iamVjdFZhbHVlcy5wdXNoKHJlbGF0ZWRPYmplY3RWYWx1ZSk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0cmVsYXRlZE9ianNbcmVsYXRlZE9iamVjdE5hbWVdID0gcmVsYXRlZE9iamVjdFZhbHVlcztcclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHJcblx0XHRpZiAoZmllbGRfbWFwX2JhY2tfc2NyaXB0KSB7XHJcblx0XHRcdF8uZXh0ZW5kKG9iaiwgc2VsZi5ldmFsRmllbGRNYXBCYWNrU2NyaXB0KGZpZWxkX21hcF9iYWNrX3NjcmlwdCwgaW5zKSk7XHJcblx0XHR9XHJcblx0XHQvLyDov4fmu6TmjonpnZ7ms5XnmoRrZXlcclxuXHRcdHZhciBmaWx0ZXJPYmogPSB7fTtcclxuXHJcblx0XHRfLmVhY2goXy5rZXlzKG9iaiksIGZ1bmN0aW9uIChrKSB7XHJcblx0XHRcdGlmIChvYmplY3RGaWVsZEtleXMuaW5jbHVkZXMoaykpIHtcclxuXHRcdFx0XHRmaWx0ZXJPYmpba10gPSBvYmpba107XHJcblx0XHRcdH1cclxuXHRcdFx0Ly8gZWxzZSBpZihyZWxhdGVkT2JqZWN0c0tleXMuaW5jbHVkZXMoaykgJiYgXy5pc0FycmF5KG9ialtrXSkpe1xyXG5cdFx0XHQvLyBcdGlmKF8uaXNBcnJheShyZWxhdGVkT2Jqc1trXSkpe1xyXG5cdFx0XHQvLyBcdFx0cmVsYXRlZE9ianNba10gPSByZWxhdGVkT2Jqc1trXS5jb25jYXQob2JqW2tdKVxyXG5cdFx0XHQvLyBcdH1lbHNle1xyXG5cdFx0XHQvLyBcdFx0cmVsYXRlZE9ianNba10gPSBvYmpba11cclxuXHRcdFx0Ly8gXHR9XHJcblx0XHRcdC8vIH1cclxuXHRcdH0pXHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRtYWluT2JqZWN0VmFsdWU6IGZpbHRlck9iaixcclxuXHRcdFx0cmVsYXRlZE9iamVjdHNWYWx1ZTogcmVsYXRlZE9ianNcclxuXHRcdH07XHJcblx0fVxyXG5cclxuXHRzZWxmLmV2YWxGaWVsZE1hcEJhY2tTY3JpcHQgPSBmdW5jdGlvbiAoZmllbGRfbWFwX2JhY2tfc2NyaXB0LCBpbnMpIHtcclxuXHRcdHZhciBzY3JpcHQgPSBcIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7IFwiICsgZmllbGRfbWFwX2JhY2tfc2NyaXB0ICsgXCIgfVwiO1xyXG5cdFx0dmFyIGZ1bmMgPSBfZXZhbChzY3JpcHQsIFwiZmllbGRfbWFwX3NjcmlwdFwiKTtcclxuXHRcdHZhciB2YWx1ZXMgPSBmdW5jKGlucyk7XHJcblx0XHRpZiAoXy5pc09iamVjdCh2YWx1ZXMpKSB7XHJcblx0XHRcdHJldHVybiB2YWx1ZXM7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRjb25zb2xlLmVycm9yKFwiZXZhbEZpZWxkTWFwQmFja1NjcmlwdDog6ISa5pys6L+U5Zue5YC857G75Z6L5LiN5piv5a+56LGhXCIpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHt9XHJcblx0fVxyXG5cclxuXHRzZWxmLnN5bmNSZWxhdGVkT2JqZWN0c1ZhbHVlID0gZnVuY3Rpb24obWFpblJlY29yZElkLCByZWxhdGVkT2JqZWN0cywgcmVsYXRlZE9iamVjdHNWYWx1ZSwgc3BhY2VJZCwgaW5zKXtcclxuXHRcdHZhciBpbnNJZCA9IGlucy5faWQ7XHJcblxyXG5cdFx0Xy5lYWNoKHJlbGF0ZWRPYmplY3RzLCBmdW5jdGlvbihyZWxhdGVkT2JqZWN0KXtcclxuXHRcdFx0dmFyIG9iamVjdENvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVsYXRlZE9iamVjdC5vYmplY3RfbmFtZSwgc3BhY2VJZCk7XHJcblx0XHRcdHZhciB0YWJsZU1hcCA9IHt9O1xyXG5cdFx0XHRfLmVhY2gocmVsYXRlZE9iamVjdHNWYWx1ZVtyZWxhdGVkT2JqZWN0Lm9iamVjdF9uYW1lXSwgZnVuY3Rpb24ocmVsYXRlZE9iamVjdFZhbHVlKXtcclxuXHRcdFx0XHR2YXIgdGFibGVfaWQgPSByZWxhdGVkT2JqZWN0VmFsdWUuX3RhYmxlLl9pZDtcclxuXHRcdFx0XHR2YXIgdGFibGVfY29kZSA9IHJlbGF0ZWRPYmplY3RWYWx1ZS5fdGFibGUuX2NvZGU7XHJcblx0XHRcdFx0aWYoIXRhYmxlTWFwW3RhYmxlX2NvZGVdKXtcclxuXHRcdFx0XHRcdHRhYmxlTWFwW3RhYmxlX2NvZGVdID0gW11cclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdHRhYmxlTWFwW3RhYmxlX2NvZGVdLnB1c2godGFibGVfaWQpO1xyXG5cdFx0XHRcdHZhciBvbGRSZWxhdGVkUmVjb3JkID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlbGF0ZWRPYmplY3Qub2JqZWN0X25hbWUsIHNwYWNlSWQpLmZpbmRPbmUoe1tyZWxhdGVkT2JqZWN0LmZvcmVpZ25fa2V5XTogbWFpblJlY29yZElkLCBcImluc3RhbmNlcy5faWRcIjogaW5zSWQsIF90YWJsZTogcmVsYXRlZE9iamVjdFZhbHVlLl90YWJsZX0sIHtmaWVsZHM6IHtfaWQ6MX19KVxyXG5cdFx0XHRcdGlmKG9sZFJlbGF0ZWRSZWNvcmQpe1xyXG5cdFx0XHRcdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlbGF0ZWRPYmplY3Qub2JqZWN0X25hbWUsIHNwYWNlSWQpLnVwZGF0ZSh7X2lkOiBvbGRSZWxhdGVkUmVjb3JkLl9pZH0sIHskc2V0OiByZWxhdGVkT2JqZWN0VmFsdWV9KVxyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0cmVsYXRlZE9iamVjdFZhbHVlW3JlbGF0ZWRPYmplY3QuZm9yZWlnbl9rZXldID0gbWFpblJlY29yZElkO1xyXG5cdFx0XHRcdFx0cmVsYXRlZE9iamVjdFZhbHVlLnNwYWNlID0gc3BhY2VJZDtcclxuXHRcdFx0XHRcdHJlbGF0ZWRPYmplY3RWYWx1ZS5vd25lciA9IGlucy5hcHBsaWNhbnQ7XHJcblx0XHRcdFx0XHRyZWxhdGVkT2JqZWN0VmFsdWUuY3JlYXRlZF9ieSA9IGlucy5hcHBsaWNhbnQ7XHJcblx0XHRcdFx0XHRyZWxhdGVkT2JqZWN0VmFsdWUubW9kaWZpZWRfYnkgPSBpbnMuYXBwbGljYW50O1xyXG5cdFx0XHRcdFx0cmVsYXRlZE9iamVjdFZhbHVlLl9pZCA9IG9iamVjdENvbGxlY3Rpb24uX21ha2VOZXdJRCgpO1xyXG5cdFx0XHRcdFx0dmFyIGluc3RhbmNlX3N0YXRlID0gaW5zLnN0YXRlO1xyXG5cdFx0XHRcdFx0aWYgKGlucy5zdGF0ZSA9PT0gJ2NvbXBsZXRlZCcgJiYgaW5zLmZpbmFsX2RlY2lzaW9uKSB7XHJcblx0XHRcdFx0XHRcdGluc3RhbmNlX3N0YXRlID0gaW5zLmZpbmFsX2RlY2lzaW9uO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0cmVsYXRlZE9iamVjdFZhbHVlLmluc3RhbmNlcyA9IFt7XHJcblx0XHRcdFx0XHRcdF9pZDogaW5zSWQsXHJcblx0XHRcdFx0XHRcdHN0YXRlOiBpbnN0YW5jZV9zdGF0ZVxyXG5cdFx0XHRcdFx0fV07XHJcblx0XHRcdFx0XHRyZWxhdGVkT2JqZWN0VmFsdWUuaW5zdGFuY2Vfc3RhdGUgPSBpbnN0YW5jZV9zdGF0ZTtcclxuXHRcdFx0XHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWxhdGVkT2JqZWN0Lm9iamVjdF9uYW1lLCBzcGFjZUlkKS5pbnNlcnQocmVsYXRlZE9iamVjdFZhbHVlLCB7dmFsaWRhdGU6IGZhbHNlLCBmaWx0ZXI6IGZhbHNlfSlcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pXHJcblx0XHRcdC8v5riF55CG55Sz6K+35Y2V5LiK6KKr5Yig6Zmk5a2Q6KGo6K6w5b2V5a+55bqU55qE55u45YWz6KGo6K6w5b2VXHJcblx0XHRcdF8uZWFjaCh0YWJsZU1hcCwgZnVuY3Rpb24odGFibGVJZHMsIHRhYmxlQ29kZSl7XHJcblx0XHRcdFx0b2JqZWN0Q29sbGVjdGlvbi5yZW1vdmUoe1xyXG5cdFx0XHRcdFx0W3JlbGF0ZWRPYmplY3QuZm9yZWlnbl9rZXldOiBtYWluUmVjb3JkSWQsXHJcblx0XHRcdFx0XHRcImluc3RhbmNlcy5faWRcIjogaW5zSWQsXHJcblx0XHRcdFx0XHRcIl90YWJsZS5fY29kZVwiOiB0YWJsZUNvZGUsXHJcblx0XHRcdFx0XHRcIl90YWJsZS5faWRcIjogeyRuaW46IHRhYmxlSWRzfVxyXG5cdFx0XHRcdH0pXHJcblx0XHRcdH0pXHJcblx0XHR9KTtcclxuXHJcblx0XHR0YWJsZUlkcyA9IF8uY29tcGFjdCh0YWJsZUlkcyk7XHJcblxyXG5cclxuXHR9XHJcblxyXG5cdHNlbGYuc2VuZERvYyA9IGZ1bmN0aW9uIChkb2MpIHtcclxuXHRcdGlmIChJbnN0YW5jZVJlY29yZFF1ZXVlLmRlYnVnKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKFwic2VuZERvY1wiKTtcclxuXHRcdFx0Y29uc29sZS5sb2coZG9jKTtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgaW5zSWQgPSBkb2MuaW5mby5pbnN0YW5jZV9pZCxcclxuXHRcdFx0cmVjb3JkcyA9IGRvYy5pbmZvLnJlY29yZHM7XHJcblx0XHR2YXIgZmllbGRzID0ge1xyXG5cdFx0XHRmbG93OiAxLFxyXG5cdFx0XHR2YWx1ZXM6IDEsXHJcblx0XHRcdGFwcGxpY2FudDogMSxcclxuXHRcdFx0c3BhY2U6IDEsXHJcblx0XHRcdGZvcm06IDEsXHJcblx0XHRcdGZvcm1fdmVyc2lvbjogMSxcclxuXHRcdFx0dHJhY2VzOiAxXHJcblx0XHR9O1xyXG5cdFx0c2VsZi5zeW5jSW5zRmllbGRzLmZvckVhY2goZnVuY3Rpb24gKGYpIHtcclxuXHRcdFx0ZmllbGRzW2ZdID0gMTtcclxuXHRcdH0pXHJcblx0XHR2YXIgaW5zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdpbnN0YW5jZXMnKS5maW5kT25lKGluc0lkLCB7XHJcblx0XHRcdGZpZWxkczogZmllbGRzXHJcblx0XHR9KTtcclxuXHRcdHZhciB2YWx1ZXMgPSBpbnMudmFsdWVzLFxyXG5cdFx0XHRzcGFjZUlkID0gaW5zLnNwYWNlO1xyXG5cclxuXHRcdGlmIChyZWNvcmRzICYmICFfLmlzRW1wdHkocmVjb3JkcykpIHtcclxuXHRcdFx0Ly8g5q2k5oOF5Ya15bGe5LqO5LuOY3JlYXRvcuS4reWPkei1t+WuoeaJue+8jOaIluiAheW3sue7j+S7jkFwcHPlkIzmraXliLDkuoZjcmVhdG9yXHJcblx0XHRcdHZhciBvYmplY3ROYW1lID0gcmVjb3Jkc1swXS5vO1xyXG5cdFx0XHR2YXIgb3cgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ29iamVjdF93b3JrZmxvd3MnKS5maW5kT25lKHtcclxuXHRcdFx0XHRvYmplY3RfbmFtZTogb2JqZWN0TmFtZSxcclxuXHRcdFx0XHRmbG93X2lkOiBpbnMuZmxvd1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0dmFyXHJcblx0XHRcdFx0b2JqZWN0Q29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3ROYW1lLCBzcGFjZUlkKSxcclxuXHRcdFx0XHRzeW5jX2F0dGFjaG1lbnQgPSBvdy5zeW5jX2F0dGFjaG1lbnQ7XHJcblx0XHRcdHZhciBvYmplY3RJbmZvID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0TmFtZSwgc3BhY2VJZCk7XHJcblx0XHRcdG9iamVjdENvbGxlY3Rpb24uZmluZCh7XHJcblx0XHRcdFx0X2lkOiB7XHJcblx0XHRcdFx0XHQkaW46IHJlY29yZHNbMF0uaWRzXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KS5mb3JFYWNoKGZ1bmN0aW9uIChyZWNvcmQpIHtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0dmFyIHN5bmNWYWx1ZXMgPSBzZWxmLnN5bmNWYWx1ZXMob3cuZmllbGRfbWFwX2JhY2ssIHZhbHVlcywgaW5zLCBvYmplY3RJbmZvLCBvdy5maWVsZF9tYXBfYmFja19zY3JpcHQsIHJlY29yZClcclxuXHRcdFx0XHRcdHZhciBzZXRPYmogPSBzeW5jVmFsdWVzLm1haW5PYmplY3RWYWx1ZTtcclxuXHRcdFx0XHRcdHNldE9iai5sb2NrZWQgPSBmYWxzZTtcclxuXHJcblx0XHRcdFx0XHR2YXIgaW5zdGFuY2Vfc3RhdGUgPSBpbnMuc3RhdGU7XHJcblx0XHRcdFx0XHRpZiAoaW5zLnN0YXRlID09PSAnY29tcGxldGVkJyAmJiBpbnMuZmluYWxfZGVjaXNpb24pIHtcclxuXHRcdFx0XHRcdFx0aW5zdGFuY2Vfc3RhdGUgPSBpbnMuZmluYWxfZGVjaXNpb247XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRzZXRPYmpbJ2luc3RhbmNlcy4kLnN0YXRlJ10gPSBzZXRPYmouaW5zdGFuY2Vfc3RhdGUgPSBpbnN0YW5jZV9zdGF0ZTtcclxuXHJcblx0XHRcdFx0XHRvYmplY3RDb2xsZWN0aW9uLnVwZGF0ZSh7XHJcblx0XHRcdFx0XHRcdF9pZDogcmVjb3JkLl9pZCxcclxuXHRcdFx0XHRcdFx0J2luc3RhbmNlcy5faWQnOiBpbnNJZFxyXG5cdFx0XHRcdFx0fSwge1xyXG5cdFx0XHRcdFx0XHQkc2V0OiBzZXRPYmpcclxuXHRcdFx0XHRcdH0pXHJcblxyXG5cdFx0XHRcdFx0dmFyIHJlbGF0ZWRPYmplY3RzID0gQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0cyhvdy5vYmplY3RfbmFtZSwgc3BhY2VJZCk7XHJcblx0XHRcdFx0XHR2YXIgcmVsYXRlZE9iamVjdHNWYWx1ZSA9IHN5bmNWYWx1ZXMucmVsYXRlZE9iamVjdHNWYWx1ZTtcclxuXHRcdFx0XHRcdHNlbGYuc3luY1JlbGF0ZWRPYmplY3RzVmFsdWUocmVjb3JkLl9pZCwgcmVsYXRlZE9iamVjdHMsIHJlbGF0ZWRPYmplY3RzVmFsdWUsIHNwYWNlSWQsIGlucyk7XHJcblxyXG5cclxuXHRcdFx0XHRcdC8vIOS7peacgOe7iOeUs+ivt+WNlemZhOS7tuS4uuWHhu+8jOaXp+eahHJlY29yZOS4remZhOS7tuWIoOmZpFxyXG5cdFx0XHRcdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKCdjbXNfZmlsZXMnKS5yZW1vdmUoe1xyXG5cdFx0XHRcdFx0XHQncGFyZW50Jzoge1xyXG5cdFx0XHRcdFx0XHRcdG86IG9iamVjdE5hbWUsXHJcblx0XHRcdFx0XHRcdFx0aWRzOiBbcmVjb3JkLl9pZF1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdGNmcy5maWxlcy5yZW1vdmUoe1xyXG5cdFx0XHRcdFx0XHQnbWV0YWRhdGEucmVjb3JkX2lkJzogcmVjb3JkLl9pZFxyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdC8vIOWQjOatpeaWsOmZhOS7tlxyXG5cdFx0XHRcdFx0c2VsZi5zeW5jQXR0YWNoKHN5bmNfYXR0YWNobWVudCwgaW5zSWQsIHJlY29yZC5zcGFjZSwgcmVjb3JkLl9pZCwgb2JqZWN0TmFtZSk7XHJcblx0XHRcdFx0fSBjYXRjaCAoZXJyb3IpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoZXJyb3Iuc3RhY2spO1xyXG5cdFx0XHRcdFx0b2JqZWN0Q29sbGVjdGlvbi51cGRhdGUoe1xyXG5cdFx0XHRcdFx0XHRfaWQ6IHJlY29yZC5faWQsXHJcblx0XHRcdFx0XHRcdCdpbnN0YW5jZXMuX2lkJzogaW5zSWRcclxuXHRcdFx0XHRcdH0sIHtcclxuXHRcdFx0XHRcdFx0JHNldDoge1xyXG5cdFx0XHRcdFx0XHRcdCdpbnN0YW5jZXMuJC5zdGF0ZSc6ICdwZW5kaW5nJyxcclxuXHRcdFx0XHRcdFx0XHQnbG9ja2VkJzogdHJ1ZSxcclxuXHRcdFx0XHRcdFx0XHQnaW5zdGFuY2Vfc3RhdGUnOiAncGVuZGluZydcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSlcclxuXHJcblx0XHRcdFx0XHRDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2Ntc19maWxlcycpLnJlbW92ZSh7XHJcblx0XHRcdFx0XHRcdCdwYXJlbnQnOiB7XHJcblx0XHRcdFx0XHRcdFx0bzogb2JqZWN0TmFtZSxcclxuXHRcdFx0XHRcdFx0XHRpZHM6IFtyZWNvcmQuX2lkXVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0Y2ZzLmZpbGVzLnJlbW92ZSh7XHJcblx0XHRcdFx0XHRcdCdtZXRhZGF0YS5yZWNvcmRfaWQnOiByZWNvcmQuX2lkXHJcblx0XHRcdFx0XHR9KVxyXG5cclxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihlcnJvcik7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fSlcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdC8vIOatpOaDheWGteWxnuS6juS7jmFwcHPkuK3lj5HotbflrqHmiblcclxuXHRcdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKCdvYmplY3Rfd29ya2Zsb3dzJykuZmluZCh7XHJcblx0XHRcdFx0Zmxvd19pZDogaW5zLmZsb3dcclxuXHRcdFx0fSkuZm9yRWFjaChmdW5jdGlvbiAob3cpIHtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0dmFyXHJcblx0XHRcdFx0XHRcdG9iamVjdENvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob3cub2JqZWN0X25hbWUsIHNwYWNlSWQpLFxyXG5cdFx0XHRcdFx0XHRzeW5jX2F0dGFjaG1lbnQgPSBvdy5zeW5jX2F0dGFjaG1lbnQsXHJcblx0XHRcdFx0XHRcdG5ld1JlY29yZElkID0gb2JqZWN0Q29sbGVjdGlvbi5fbWFrZU5ld0lEKCksXHJcblx0XHRcdFx0XHRcdG9iamVjdE5hbWUgPSBvdy5vYmplY3RfbmFtZTtcclxuXHJcblx0XHRcdFx0XHR2YXIgb2JqZWN0SW5mbyA9IENyZWF0b3IuZ2V0T2JqZWN0KG93Lm9iamVjdF9uYW1lLCBzcGFjZUlkKTtcclxuXHRcdFx0XHRcdHZhciBzeW5jVmFsdWVzID0gc2VsZi5zeW5jVmFsdWVzKG93LmZpZWxkX21hcF9iYWNrLCB2YWx1ZXMsIGlucywgb2JqZWN0SW5mbywgb3cuZmllbGRfbWFwX2JhY2tfc2NyaXB0KTtcclxuXHRcdFx0XHRcdHZhciBuZXdPYmogPSBzeW5jVmFsdWVzLm1haW5PYmplY3RWYWx1ZTtcclxuXHJcblx0XHRcdFx0XHRuZXdPYmouX2lkID0gbmV3UmVjb3JkSWQ7XHJcblx0XHRcdFx0XHRuZXdPYmouc3BhY2UgPSBzcGFjZUlkO1xyXG5cdFx0XHRcdFx0bmV3T2JqLm5hbWUgPSBuZXdPYmoubmFtZSB8fCBpbnMubmFtZTtcclxuXHJcblx0XHRcdFx0XHR2YXIgaW5zdGFuY2Vfc3RhdGUgPSBpbnMuc3RhdGU7XHJcblx0XHRcdFx0XHRpZiAoaW5zLnN0YXRlID09PSAnY29tcGxldGVkJyAmJiBpbnMuZmluYWxfZGVjaXNpb24pIHtcclxuXHRcdFx0XHRcdFx0aW5zdGFuY2Vfc3RhdGUgPSBpbnMuZmluYWxfZGVjaXNpb247XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRuZXdPYmouaW5zdGFuY2VzID0gW3tcclxuXHRcdFx0XHRcdFx0X2lkOiBpbnNJZCxcclxuXHRcdFx0XHRcdFx0c3RhdGU6IGluc3RhbmNlX3N0YXRlXHJcblx0XHRcdFx0XHR9XTtcclxuXHRcdFx0XHRcdG5ld09iai5pbnN0YW5jZV9zdGF0ZSA9IGluc3RhbmNlX3N0YXRlO1xyXG5cclxuXHRcdFx0XHRcdG5ld09iai5vd25lciA9IGlucy5hcHBsaWNhbnQ7XHJcblx0XHRcdFx0XHRuZXdPYmouY3JlYXRlZF9ieSA9IGlucy5hcHBsaWNhbnQ7XHJcblx0XHRcdFx0XHRuZXdPYmoubW9kaWZpZWRfYnkgPSBpbnMuYXBwbGljYW50O1xyXG5cdFx0XHRcdFx0dmFyIHIgPSBvYmplY3RDb2xsZWN0aW9uLmluc2VydChuZXdPYmopO1xyXG5cdFx0XHRcdFx0aWYgKHIpIHtcclxuXHRcdFx0XHRcdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKCdpbnN0YW5jZXMnKS51cGRhdGUoaW5zLl9pZCwge1xyXG5cdFx0XHRcdFx0XHRcdCRwdXNoOiB7XHJcblx0XHRcdFx0XHRcdFx0XHRyZWNvcmRfaWRzOiB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdG86IG9iamVjdE5hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdGlkczogW25ld1JlY29yZElkXVxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdFx0dmFyIHJlbGF0ZWRPYmplY3RzID0gQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0cyhvdy5vYmplY3RfbmFtZSxzcGFjZUlkKTtcclxuXHRcdFx0XHRcdFx0dmFyIHJlbGF0ZWRPYmplY3RzVmFsdWUgPSBzeW5jVmFsdWVzLnJlbGF0ZWRPYmplY3RzVmFsdWU7XHJcblx0XHRcdFx0XHRcdHNlbGYuc3luY1JlbGF0ZWRPYmplY3RzVmFsdWUobmV3UmVjb3JkSWQsIHJlbGF0ZWRPYmplY3RzLCByZWxhdGVkT2JqZWN0c1ZhbHVlLCBzcGFjZUlkLCBpbnMpO1xyXG5cdFx0XHRcdFx0XHQvLyB3b3JrZmxvd+mHjOWPkei1t+WuoeaJueWQju+8jOWQjOatpeaXtuS5n+WPr+S7peS/ruaUueebuOWFs+ihqOeahOWtl+auteWAvCAjMTE4M1xyXG5cdFx0XHRcdFx0XHR2YXIgcmVjb3JkID0gb2JqZWN0Q29sbGVjdGlvbi5maW5kT25lKG5ld1JlY29yZElkKTtcclxuXHRcdFx0XHRcdFx0c2VsZi5zeW5jVmFsdWVzKG93LmZpZWxkX21hcF9iYWNrLCB2YWx1ZXMsIGlucywgb2JqZWN0SW5mbywgb3cuZmllbGRfbWFwX2JhY2tfc2NyaXB0LCByZWNvcmQpO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdC8vIOmZhOS7tuWQjOatpVxyXG5cdFx0XHRcdFx0c2VsZi5zeW5jQXR0YWNoKHN5bmNfYXR0YWNobWVudCwgaW5zSWQsIHNwYWNlSWQsIG5ld1JlY29yZElkLCBvYmplY3ROYW1lKTtcclxuXHJcblx0XHRcdFx0fSBjYXRjaCAoZXJyb3IpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoZXJyb3Iuc3RhY2spO1xyXG5cclxuXHRcdFx0XHRcdG9iamVjdENvbGxlY3Rpb24ucmVtb3ZlKHtcclxuXHRcdFx0XHRcdFx0X2lkOiBuZXdSZWNvcmRJZCxcclxuXHRcdFx0XHRcdFx0c3BhY2U6IHNwYWNlSWRcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKCdpbnN0YW5jZXMnKS51cGRhdGUoaW5zLl9pZCwge1xyXG5cdFx0XHRcdFx0XHQkcHVsbDoge1xyXG5cdFx0XHRcdFx0XHRcdHJlY29yZF9pZHM6IHtcclxuXHRcdFx0XHRcdFx0XHRcdG86IG9iamVjdE5hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRpZHM6IFtuZXdSZWNvcmRJZF1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHRDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2Ntc19maWxlcycpLnJlbW92ZSh7XHJcblx0XHRcdFx0XHRcdCdwYXJlbnQnOiB7XHJcblx0XHRcdFx0XHRcdFx0bzogb2JqZWN0TmFtZSxcclxuXHRcdFx0XHRcdFx0XHRpZHM6IFtuZXdSZWNvcmRJZF1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdGNmcy5maWxlcy5yZW1vdmUoe1xyXG5cdFx0XHRcdFx0XHQnbWV0YWRhdGEucmVjb3JkX2lkJzogbmV3UmVjb3JkSWRcclxuXHRcdFx0XHRcdH0pXHJcblxyXG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGVycm9yKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHR9KVxyXG5cdFx0fVxyXG5cclxuXHRcdEluc3RhbmNlUmVjb3JkUXVldWUuY29sbGVjdGlvbi51cGRhdGUoZG9jLl9pZCwge1xyXG5cdFx0XHQkc2V0OiB7XHJcblx0XHRcdFx0J2luZm8uc3luY19kYXRlJzogbmV3IERhdGUoKVxyXG5cdFx0XHR9XHJcblx0XHR9KVxyXG5cclxuXHR9XHJcblxyXG5cdC8vIFVuaXZlcnNhbCBzZW5kIGZ1bmN0aW9uXHJcblx0dmFyIF9xdWVyeVNlbmQgPSBmdW5jdGlvbiAoZG9jKSB7XHJcblxyXG5cdFx0aWYgKHNlbGYuc2VuZERvYykge1xyXG5cdFx0XHRzZWxmLnNlbmREb2MoZG9jKTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRkb2M6IFtkb2MuX2lkXVxyXG5cdFx0fTtcclxuXHR9O1xyXG5cclxuXHRzZWxmLnNlcnZlclNlbmQgPSBmdW5jdGlvbiAoZG9jKSB7XHJcblx0XHRkb2MgPSBkb2MgfHwge307XHJcblx0XHRyZXR1cm4gX3F1ZXJ5U2VuZChkb2MpO1xyXG5cdH07XHJcblxyXG5cclxuXHQvLyBUaGlzIGludGVydmFsIHdpbGwgYWxsb3cgb25seSBvbmUgZG9jIHRvIGJlIHNlbnQgYXQgYSB0aW1lLCBpdFxyXG5cdC8vIHdpbGwgY2hlY2sgZm9yIG5ldyBkb2NzIGF0IGV2ZXJ5IGBvcHRpb25zLnNlbmRJbnRlcnZhbGBcclxuXHQvLyAoZGVmYXVsdCBpbnRlcnZhbCBpcyAxNTAwMCBtcylcclxuXHQvL1xyXG5cdC8vIEl0IGxvb2tzIGluIGRvY3MgY29sbGVjdGlvbiB0byBzZWUgaWYgdGhlcmVzIGFueSBwZW5kaW5nXHJcblx0Ly8gZG9jcywgaWYgc28gaXQgd2lsbCB0cnkgdG8gcmVzZXJ2ZSB0aGUgcGVuZGluZyBkb2MuXHJcblx0Ly8gSWYgc3VjY2Vzc2Z1bGx5IHJlc2VydmVkIHRoZSBzZW5kIGlzIHN0YXJ0ZWQuXHJcblx0Ly9cclxuXHQvLyBJZiBkb2MucXVlcnkgaXMgdHlwZSBzdHJpbmcsIGl0J3MgYXNzdW1lZCB0byBiZSBhIGpzb24gc3RyaW5nXHJcblx0Ly8gdmVyc2lvbiBvZiB0aGUgcXVlcnkgc2VsZWN0b3IuIE1ha2luZyBpdCBhYmxlIHRvIGNhcnJ5IGAkYCBwcm9wZXJ0aWVzIGluXHJcblx0Ly8gdGhlIG1vbmdvIGNvbGxlY3Rpb24uXHJcblx0Ly9cclxuXHQvLyBQci4gZGVmYXVsdCBkb2NzIGFyZSByZW1vdmVkIGZyb20gdGhlIGNvbGxlY3Rpb24gYWZ0ZXIgc2VuZCBoYXZlXHJcblx0Ly8gY29tcGxldGVkLiBTZXR0aW5nIGBvcHRpb25zLmtlZXBEb2NzYCB3aWxsIHVwZGF0ZSBhbmQga2VlcCB0aGVcclxuXHQvLyBkb2MgZWcuIGlmIG5lZWRlZCBmb3IgaGlzdG9yaWNhbCByZWFzb25zLlxyXG5cdC8vXHJcblx0Ly8gQWZ0ZXIgdGhlIHNlbmQgaGF2ZSBjb21wbGV0ZWQgYSBcInNlbmRcIiBldmVudCB3aWxsIGJlIGVtaXR0ZWQgd2l0aCBhXHJcblx0Ly8gc3RhdHVzIG9iamVjdCBjb250YWluaW5nIGRvYyBpZCBhbmQgdGhlIHNlbmQgcmVzdWx0IG9iamVjdC5cclxuXHQvL1xyXG5cdHZhciBpc1NlbmRpbmdEb2MgPSBmYWxzZTtcclxuXHJcblx0aWYgKG9wdGlvbnMuc2VuZEludGVydmFsICE9PSBudWxsKSB7XHJcblxyXG5cdFx0Ly8gVGhpcyB3aWxsIHJlcXVpcmUgaW5kZXggc2luY2Ugd2Ugc29ydCBkb2NzIGJ5IGNyZWF0ZWRBdFxyXG5cdFx0SW5zdGFuY2VSZWNvcmRRdWV1ZS5jb2xsZWN0aW9uLl9lbnN1cmVJbmRleCh7XHJcblx0XHRcdGNyZWF0ZWRBdDogMVxyXG5cdFx0fSk7XHJcblx0XHRJbnN0YW5jZVJlY29yZFF1ZXVlLmNvbGxlY3Rpb24uX2Vuc3VyZUluZGV4KHtcclxuXHRcdFx0c2VudDogMVxyXG5cdFx0fSk7XHJcblx0XHRJbnN0YW5jZVJlY29yZFF1ZXVlLmNvbGxlY3Rpb24uX2Vuc3VyZUluZGV4KHtcclxuXHRcdFx0c2VuZGluZzogMVxyXG5cdFx0fSk7XHJcblxyXG5cclxuXHRcdHZhciBzZW5kRG9jID0gZnVuY3Rpb24gKGRvYykge1xyXG5cdFx0XHQvLyBSZXNlcnZlIGRvY1xyXG5cdFx0XHR2YXIgbm93ID0gK25ldyBEYXRlKCk7XHJcblx0XHRcdHZhciB0aW1lb3V0QXQgPSBub3cgKyBvcHRpb25zLnNlbmRUaW1lb3V0O1xyXG5cdFx0XHR2YXIgcmVzZXJ2ZWQgPSBJbnN0YW5jZVJlY29yZFF1ZXVlLmNvbGxlY3Rpb24udXBkYXRlKHtcclxuXHRcdFx0XHRfaWQ6IGRvYy5faWQsXHJcblx0XHRcdFx0c2VudDogZmFsc2UsIC8vIHh4eDogbmVlZCB0byBtYWtlIHN1cmUgdGhpcyBpcyBzZXQgb24gY3JlYXRlXHJcblx0XHRcdFx0c2VuZGluZzoge1xyXG5cdFx0XHRcdFx0JGx0OiBub3dcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sIHtcclxuXHRcdFx0XHQkc2V0OiB7XHJcblx0XHRcdFx0XHRzZW5kaW5nOiB0aW1lb3V0QXQsXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdC8vIE1ha2Ugc3VyZSB3ZSBvbmx5IGhhbmRsZSBkb2NzIHJlc2VydmVkIGJ5IHRoaXNcclxuXHRcdFx0Ly8gaW5zdGFuY2VcclxuXHRcdFx0aWYgKHJlc2VydmVkKSB7XHJcblxyXG5cdFx0XHRcdC8vIFNlbmRcclxuXHRcdFx0XHR2YXIgcmVzdWx0ID0gSW5zdGFuY2VSZWNvcmRRdWV1ZS5zZXJ2ZXJTZW5kKGRvYyk7XHJcblxyXG5cdFx0XHRcdGlmICghb3B0aW9ucy5rZWVwRG9jcykge1xyXG5cdFx0XHRcdFx0Ly8gUHIuIERlZmF1bHQgd2Ugd2lsbCByZW1vdmUgZG9jc1xyXG5cdFx0XHRcdFx0SW5zdGFuY2VSZWNvcmRRdWV1ZS5jb2xsZWN0aW9uLnJlbW92ZSh7XHJcblx0XHRcdFx0XHRcdF9pZDogZG9jLl9pZFxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHJcblx0XHRcdFx0XHQvLyBVcGRhdGVcclxuXHRcdFx0XHRcdEluc3RhbmNlUmVjb3JkUXVldWUuY29sbGVjdGlvbi51cGRhdGUoe1xyXG5cdFx0XHRcdFx0XHRfaWQ6IGRvYy5faWRcclxuXHRcdFx0XHRcdH0sIHtcclxuXHRcdFx0XHRcdFx0JHNldDoge1xyXG5cdFx0XHRcdFx0XHRcdC8vIE1hcmsgYXMgc2VudFxyXG5cdFx0XHRcdFx0XHRcdHNlbnQ6IHRydWUsXHJcblx0XHRcdFx0XHRcdFx0Ly8gU2V0IHRoZSBzZW50IGRhdGVcclxuXHRcdFx0XHRcdFx0XHRzZW50QXQ6IG5ldyBEYXRlKCksXHJcblx0XHRcdFx0XHRcdFx0Ly8gTm90IGJlaW5nIHNlbnQgYW55bW9yZVxyXG5cdFx0XHRcdFx0XHRcdHNlbmRpbmc6IDBcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Ly8gLy8gRW1pdCB0aGUgc2VuZFxyXG5cdFx0XHRcdC8vIHNlbGYuZW1pdCgnc2VuZCcsIHtcclxuXHRcdFx0XHQvLyBcdGRvYzogZG9jLl9pZCxcclxuXHRcdFx0XHQvLyBcdHJlc3VsdDogcmVzdWx0XHJcblx0XHRcdFx0Ly8gfSk7XHJcblxyXG5cdFx0XHR9IC8vIEVsc2UgY291bGQgbm90IHJlc2VydmVcclxuXHRcdH07IC8vIEVPIHNlbmREb2NcclxuXHJcblx0XHRzZW5kV29ya2VyKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHRcdGlmIChpc1NlbmRpbmdEb2MpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0Ly8gU2V0IHNlbmQgZmVuY2VcclxuXHRcdFx0aXNTZW5kaW5nRG9jID0gdHJ1ZTtcclxuXHJcblx0XHRcdHZhciBiYXRjaFNpemUgPSBvcHRpb25zLnNlbmRCYXRjaFNpemUgfHwgMTtcclxuXHJcblx0XHRcdHZhciBub3cgPSArbmV3IERhdGUoKTtcclxuXHJcblx0XHRcdC8vIEZpbmQgZG9jcyB0aGF0IGFyZSBub3QgYmVpbmcgb3IgYWxyZWFkeSBzZW50XHJcblx0XHRcdHZhciBwZW5kaW5nRG9jcyA9IEluc3RhbmNlUmVjb3JkUXVldWUuY29sbGVjdGlvbi5maW5kKHtcclxuXHRcdFx0XHQkYW5kOiBbXHJcblx0XHRcdFx0XHQvLyBNZXNzYWdlIGlzIG5vdCBzZW50XHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdHNlbnQ6IGZhbHNlXHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0Ly8gQW5kIG5vdCBiZWluZyBzZW50IGJ5IG90aGVyIGluc3RhbmNlc1xyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRzZW5kaW5nOiB7XHJcblx0XHRcdFx0XHRcdFx0JGx0OiBub3dcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdC8vIEFuZCBubyBlcnJvclxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRlcnJNc2c6IHtcclxuXHRcdFx0XHRcdFx0XHQkZXhpc3RzOiBmYWxzZVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XVxyXG5cdFx0XHR9LCB7XHJcblx0XHRcdFx0Ly8gU29ydCBieSBjcmVhdGVkIGRhdGVcclxuXHRcdFx0XHRzb3J0OiB7XHJcblx0XHRcdFx0XHRjcmVhdGVkQXQ6IDFcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdGxpbWl0OiBiYXRjaFNpemVcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRwZW5kaW5nRG9jcy5mb3JFYWNoKGZ1bmN0aW9uIChkb2MpIHtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0c2VuZERvYyhkb2MpO1xyXG5cdFx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKGVycm9yLnN0YWNrKTtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdJbnN0YW5jZVJlY29yZFF1ZXVlOiBDb3VsZCBub3Qgc2VuZCBkb2MgaWQ6IFwiJyArIGRvYy5faWQgKyAnXCIsIEVycm9yOiAnICsgZXJyb3IubWVzc2FnZSk7XHJcblx0XHRcdFx0XHRJbnN0YW5jZVJlY29yZFF1ZXVlLmNvbGxlY3Rpb24udXBkYXRlKHtcclxuXHRcdFx0XHRcdFx0X2lkOiBkb2MuX2lkXHJcblx0XHRcdFx0XHR9LCB7XHJcblx0XHRcdFx0XHRcdCRzZXQ6IHtcclxuXHRcdFx0XHRcdFx0XHQvLyBlcnJvciBtZXNzYWdlXHJcblx0XHRcdFx0XHRcdFx0ZXJyTXNnOiBlcnJvci5tZXNzYWdlXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7IC8vIEVPIGZvckVhY2hcclxuXHJcblx0XHRcdC8vIFJlbW92ZSB0aGUgc2VuZCBmZW5jZVxyXG5cdFx0XHRpc1NlbmRpbmdEb2MgPSBmYWxzZTtcclxuXHRcdH0sIG9wdGlvbnMuc2VuZEludGVydmFsIHx8IDE1MDAwKTsgLy8gRGVmYXVsdCBldmVyeSAxNXRoIHNlY1xyXG5cclxuXHR9IGVsc2Uge1xyXG5cdFx0aWYgKEluc3RhbmNlUmVjb3JkUXVldWUuZGVidWcpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coJ0luc3RhbmNlUmVjb3JkUXVldWU6IFNlbmQgc2VydmVyIGlzIGRpc2FibGVkJyk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxufTsiLCJNZXRlb3Iuc3RhcnR1cCAtPlxyXG5cdGlmIE1ldGVvci5zZXR0aW5ncy5jcm9uPy5pbnN0YW5jZXJlY29yZHF1ZXVlX2ludGVydmFsXHJcblx0XHRJbnN0YW5jZVJlY29yZFF1ZXVlLkNvbmZpZ3VyZVxyXG5cdFx0XHRzZW5kSW50ZXJ2YWw6IE1ldGVvci5zZXR0aW5ncy5jcm9uLmluc3RhbmNlcmVjb3JkcXVldWVfaW50ZXJ2YWxcclxuXHRcdFx0c2VuZEJhdGNoU2l6ZTogMTBcclxuXHRcdFx0a2VlcERvY3M6IHRydWVcclxuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHZhciByZWY7XG4gIGlmICgocmVmID0gTWV0ZW9yLnNldHRpbmdzLmNyb24pICE9IG51bGwgPyByZWYuaW5zdGFuY2VyZWNvcmRxdWV1ZV9pbnRlcnZhbCA6IHZvaWQgMCkge1xuICAgIHJldHVybiBJbnN0YW5jZVJlY29yZFF1ZXVlLkNvbmZpZ3VyZSh7XG4gICAgICBzZW5kSW50ZXJ2YWw6IE1ldGVvci5zZXR0aW5ncy5jcm9uLmluc3RhbmNlcmVjb3JkcXVldWVfaW50ZXJ2YWwsXG4gICAgICBzZW5kQmF0Y2hTaXplOiAxMCxcbiAgICAgIGtlZXBEb2NzOiB0cnVlXG4gICAgfSk7XG4gIH1cbn0pO1xuIiwiaW1wb3J0IHsgY2hlY2tOcG1WZXJzaW9ucyB9IGZyb20gJ21ldGVvci90bWVhc2RheTpjaGVjay1ucG0tdmVyc2lvbnMnO1xyXG5jaGVja05wbVZlcnNpb25zKHtcclxuXHRcImV2YWxcIjogXCJeMC4xLjJcIlxyXG59LCAnc3RlZWRvczppbnN0YW5jZS1yZWNvcmQtcXVldWUnKTtcclxuIl19
