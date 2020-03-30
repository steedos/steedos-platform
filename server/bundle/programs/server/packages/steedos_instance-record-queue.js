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
            cb(error);
          });
        })(newFile, Creator, cmsFileId, objectName, newRecordId, spaceId, f);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczppbnN0YW5jZS1yZWNvcmQtcXVldWUvbGliL2NvbW1vbi9tYWluLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmluc3RhbmNlLXJlY29yZC1xdWV1ZS9saWIvY29tbW9uL2RvY3MuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6aW5zdGFuY2UtcmVjb3JkLXF1ZXVlL2xpYi9zZXJ2ZXIvYXBpLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2luc3RhbmNlLXJlY29yZC1xdWV1ZS9zZXJ2ZXIvc3RhcnR1cC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9zdGFydHVwLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczppbnN0YW5jZS1yZWNvcmQtcXVldWUvc2VydmVyL2NoZWNrTnBtLmpzIl0sIm5hbWVzIjpbIkluc3RhbmNlUmVjb3JkUXVldWUiLCJFdmVudFN0YXRlIiwiY29sbGVjdGlvbiIsImRiIiwiaW5zdGFuY2VfcmVjb3JkX3F1ZXVlIiwiTW9uZ28iLCJDb2xsZWN0aW9uIiwiX3ZhbGlkYXRlRG9jdW1lbnQiLCJkb2MiLCJjaGVjayIsImluZm8iLCJPYmplY3QiLCJzZW50IiwiTWF0Y2giLCJPcHRpb25hbCIsIkJvb2xlYW4iLCJzZW5kaW5nIiwiSW50ZWdlciIsImNyZWF0ZWRBdCIsIkRhdGUiLCJjcmVhdGVkQnkiLCJPbmVPZiIsIlN0cmluZyIsInNlbmQiLCJvcHRpb25zIiwiY3VycmVudFVzZXIiLCJNZXRlb3IiLCJpc0NsaWVudCIsInVzZXJJZCIsImlzU2VydmVyIiwiXyIsImV4dGVuZCIsInRlc3QiLCJwaWNrIiwiaW5zZXJ0IiwiX2V2YWwiLCJyZXF1aXJlIiwiaXNDb25maWd1cmVkIiwic2VuZFdvcmtlciIsInRhc2siLCJpbnRlcnZhbCIsImRlYnVnIiwiY29uc29sZSIsImxvZyIsInNldEludGVydmFsIiwiZXJyb3IiLCJtZXNzYWdlIiwiQ29uZmlndXJlIiwic2VsZiIsInNlbmRUaW1lb3V0IiwiRXJyb3IiLCJzeW5jQXR0YWNoIiwic3luY19hdHRhY2htZW50IiwiaW5zSWQiLCJzcGFjZUlkIiwibmV3UmVjb3JkSWQiLCJvYmplY3ROYW1lIiwiY2ZzIiwiaW5zdGFuY2VzIiwiZmluZCIsImZvckVhY2giLCJmIiwibmV3RmlsZSIsIkZTIiwiRmlsZSIsImNtc0ZpbGVJZCIsIkNyZWF0b3IiLCJnZXRDb2xsZWN0aW9uIiwiX21ha2VOZXdJRCIsImF0dGFjaERhdGEiLCJjcmVhdGVSZWFkU3RyZWFtIiwidHlwZSIsIm9yaWdpbmFsIiwiZXJyIiwicmVhc29uIiwibmFtZSIsInNpemUiLCJtZXRhZGF0YSIsIm93bmVyIiwib3duZXJfbmFtZSIsInNwYWNlIiwicmVjb3JkX2lkIiwib2JqZWN0X25hbWUiLCJwYXJlbnQiLCJmaWxlcyIsIndyYXBBc3luYyIsImNiIiwib25jZSIsInN0b3JlTmFtZSIsIl9pZCIsIm8iLCJpZHMiLCJleHRlbnRpb24iLCJleHRlbnNpb24iLCJ2ZXJzaW9ucyIsImNyZWF0ZWRfYnkiLCJtb2RpZmllZF9ieSIsInBhcmVudHMiLCJpbmNsdWRlcyIsInB1c2giLCJjdXJyZW50IiwidXBkYXRlIiwiJHNldCIsIiRhZGRUb1NldCIsInN5bmNJbnNGaWVsZHMiLCJzeW5jVmFsdWVzIiwiZmllbGRfbWFwX2JhY2siLCJ2YWx1ZXMiLCJpbnMiLCJvYmplY3RJbmZvIiwiZmllbGRfbWFwX2JhY2tfc2NyaXB0IiwicmVjb3JkIiwib2JqIiwidGFibGVGaWVsZENvZGVzIiwidGFibGVGaWVsZE1hcCIsInRhYmxlVG9SZWxhdGVkTWFwIiwiZm9ybSIsImZpbmRPbmUiLCJmb3JtRmllbGRzIiwiZm9ybV92ZXJzaW9uIiwiZmllbGRzIiwiZm9ybVZlcnNpb24iLCJoaXN0b3J5cyIsImgiLCJvYmplY3RGaWVsZHMiLCJvYmplY3RGaWVsZEtleXMiLCJrZXlzIiwicmVsYXRlZE9iamVjdHMiLCJnZXRSZWxhdGVkT2JqZWN0cyIsInJlbGF0ZWRPYmplY3RzS2V5cyIsInBsdWNrIiwiZm9ybVRhYmxlRmllbGRzIiwiZmlsdGVyIiwiZm9ybUZpZWxkIiwiZm9ybVRhYmxlRmllbGRzQ29kZSIsImdldFJlbGF0ZWRPYmplY3RGaWVsZCIsImtleSIsInJlbGF0ZWRPYmplY3RzS2V5Iiwic3RhcnRzV2l0aCIsImdldEZvcm1UYWJsZUZpZWxkIiwiZm9ybVRhYmxlRmllbGRDb2RlIiwiZ2V0Rm9ybUZpZWxkIiwiX2Zvcm1GaWVsZHMiLCJfZmllbGRDb2RlIiwiZWFjaCIsImZmIiwiY29kZSIsImZtIiwicmVsYXRlZE9iamVjdEZpZWxkIiwib2JqZWN0X2ZpZWxkIiwiZm9ybVRhYmxlRmllbGQiLCJ3b3JrZmxvd19maWVsZCIsIm9UYWJsZUNvZGUiLCJzcGxpdCIsIm9UYWJsZUZpZWxkQ29kZSIsInRhYmxlVG9SZWxhdGVkTWFwS2V5Iiwid1RhYmxlQ29kZSIsImluZGV4T2YiLCJoYXNPd25Qcm9wZXJ0eSIsImlzQXJyYXkiLCJKU09OIiwic3RyaW5naWZ5Iiwid29ya2Zsb3dfdGFibGVfZmllbGRfY29kZSIsIm9iamVjdF90YWJsZV9maWVsZF9jb2RlIiwid0ZpZWxkIiwib0ZpZWxkIiwiaXNfbXVsdGlzZWxlY3QiLCJtdWx0aXBsZSIsInJlZmVyZW5jZV90byIsImlzU3RyaW5nIiwib0NvbGxlY3Rpb24iLCJyZWZlck9iamVjdCIsImdldE9iamVjdCIsInJlZmVyRGF0YSIsIm5hbWVGaWVsZEtleSIsIk5BTUVfRklFTERfS0VZIiwic2VsZWN0b3IiLCJ0bXBfZmllbGRfdmFsdWUiLCJjb21wYWN0IiwiaXNFbXB0eSIsInRlbU9iakZpZWxkcyIsImxlbmd0aCIsIm9iakZpZWxkIiwicmVmZXJPYmpGaWVsZCIsInJlZmVyU2V0T2JqIiwiaW5zRmllbGQiLCJ1bmlxIiwidGZjIiwiYyIsInBhcnNlIiwidHIiLCJuZXdUciIsInYiLCJrIiwidGZtIiwib1RkQ29kZSIsInJlbGF0ZWRPYmpzIiwiZ2V0UmVsYXRlZEZpZWxkVmFsdWUiLCJ2YWx1ZUtleSIsInJlZHVjZSIsIngiLCJtYXAiLCJ0YWJsZUNvZGUiLCJfRlJPTV9UQUJMRV9DT0RFIiwid2FybiIsInJlbGF0ZWRPYmplY3ROYW1lIiwicmVsYXRlZE9iamVjdFZhbHVlcyIsInJlbGF0ZWRPYmplY3QiLCJ0YWJsZVZhbHVlSXRlbSIsInJlbGF0ZWRPYmplY3RWYWx1ZSIsImZpZWxkS2V5IiwicmVsYXRlZE9iamVjdEZpZWxkVmFsdWUiLCJmb3JtRmllbGRLZXkiLCJfY29kZSIsImV2YWxGaWVsZE1hcEJhY2tTY3JpcHQiLCJmaWx0ZXJPYmoiLCJtYWluT2JqZWN0VmFsdWUiLCJyZWxhdGVkT2JqZWN0c1ZhbHVlIiwic2NyaXB0IiwiZnVuYyIsImlzT2JqZWN0Iiwic3luY1JlbGF0ZWRPYmplY3RzVmFsdWUiLCJtYWluUmVjb3JkSWQiLCJvYmplY3RDb2xsZWN0aW9uIiwidGFibGVNYXAiLCJ0YWJsZV9pZCIsIl90YWJsZSIsInRhYmxlX2NvZGUiLCJvbGRSZWxhdGVkUmVjb3JkIiwiZm9yZWlnbl9rZXkiLCJhcHBsaWNhbnQiLCJpbnN0YW5jZV9zdGF0ZSIsInN0YXRlIiwiZmluYWxfZGVjaXNpb24iLCJ2YWxpZGF0ZSIsInRhYmxlSWRzIiwicmVtb3ZlIiwiJG5pbiIsInNlbmREb2MiLCJpbnN0YW5jZV9pZCIsInJlY29yZHMiLCJmbG93IiwidHJhY2VzIiwib3ciLCJmbG93X2lkIiwiJGluIiwic2V0T2JqIiwic3RhY2siLCJuZXdPYmoiLCJyIiwiJHB1c2giLCJyZWNvcmRfaWRzIiwiJHB1bGwiLCJfcXVlcnlTZW5kIiwic2VydmVyU2VuZCIsImlzU2VuZGluZ0RvYyIsInNlbmRJbnRlcnZhbCIsIl9lbnN1cmVJbmRleCIsIm5vdyIsInRpbWVvdXRBdCIsInJlc2VydmVkIiwiJGx0IiwicmVzdWx0Iiwia2VlcERvY3MiLCJzZW50QXQiLCJiYXRjaFNpemUiLCJzZW5kQmF0Y2hTaXplIiwicGVuZGluZ0RvY3MiLCIkYW5kIiwiZXJyTXNnIiwiJGV4aXN0cyIsInNvcnQiLCJsaW1pdCIsInN0YXJ0dXAiLCJyZWYiLCJzZXR0aW5ncyIsImNyb24iLCJpbnN0YW5jZXJlY29yZHF1ZXVlX2ludGVydmFsIiwiY2hlY2tOcG1WZXJzaW9ucyIsIm1vZHVsZSIsImxpbmsiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQUEsbUJBQW1CLEdBQUcsSUFBSUMsVUFBSixFQUF0QixDOzs7Ozs7Ozs7OztBQ0FBRCxtQkFBbUIsQ0FBQ0UsVUFBcEIsR0FBaUNDLEVBQUUsQ0FBQ0MscUJBQUgsR0FBMkIsSUFBSUMsS0FBSyxDQUFDQyxVQUFWLENBQXFCLHVCQUFyQixDQUE1RDs7QUFFQSxJQUFJQyxpQkFBaUIsR0FBRyxVQUFTQyxHQUFULEVBQWM7QUFFckNDLE9BQUssQ0FBQ0QsR0FBRCxFQUFNO0FBQ1ZFLFFBQUksRUFBRUMsTUFESTtBQUVWQyxRQUFJLEVBQUVDLEtBQUssQ0FBQ0MsUUFBTixDQUFlQyxPQUFmLENBRkk7QUFHVkMsV0FBTyxFQUFFSCxLQUFLLENBQUNDLFFBQU4sQ0FBZUQsS0FBSyxDQUFDSSxPQUFyQixDQUhDO0FBSVZDLGFBQVMsRUFBRUMsSUFKRDtBQUtWQyxhQUFTLEVBQUVQLEtBQUssQ0FBQ1EsS0FBTixDQUFZQyxNQUFaLEVBQW9CLElBQXBCO0FBTEQsR0FBTixDQUFMO0FBUUEsQ0FWRDs7QUFZQXRCLG1CQUFtQixDQUFDdUIsSUFBcEIsR0FBMkIsVUFBU0MsT0FBVCxFQUFrQjtBQUM1QyxNQUFJQyxXQUFXLEdBQUdDLE1BQU0sQ0FBQ0MsUUFBUCxJQUFtQkQsTUFBTSxDQUFDRSxNQUExQixJQUFvQ0YsTUFBTSxDQUFDRSxNQUFQLEVBQXBDLElBQXVERixNQUFNLENBQUNHLFFBQVAsS0FBb0JMLE9BQU8sQ0FBQ0osU0FBUixJQUFxQixVQUF6QyxDQUF2RCxJQUErRyxJQUFqSTs7QUFDQSxNQUFJWixHQUFHLEdBQUdzQixDQUFDLENBQUNDLE1BQUYsQ0FBUztBQUNsQmIsYUFB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QUFNLENBQUNDLElBQVAsQ0FBWSxvQ0FBWixFQUFpRDtBQUFDRixrQkFBZ0IsQ0FBQ3RGLENBQUQsRUFBRztBQUFDc0Ysb0JBQWdCLEdBQUN0RixDQUFqQjtBQUFtQjs7QUFBeEMsQ0FBakQsRUFBMkYsQ0FBM0Y7QUFDckJzRixnQkFBZ0IsQ0FBQztBQUNoQixVQUFRO0FBRFEsQ0FBRCxFQUViLCtCQUZhLENBQWhCLEMiLCJmaWxlIjoiL3BhY2thZ2VzL3N0ZWVkb3NfaW5zdGFuY2UtcmVjb3JkLXF1ZXVlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiSW5zdGFuY2VSZWNvcmRRdWV1ZSA9IG5ldyBFdmVudFN0YXRlKCk7IiwiSW5zdGFuY2VSZWNvcmRRdWV1ZS5jb2xsZWN0aW9uID0gZGIuaW5zdGFuY2VfcmVjb3JkX3F1ZXVlID0gbmV3IE1vbmdvLkNvbGxlY3Rpb24oJ2luc3RhbmNlX3JlY29yZF9xdWV1ZScpO1xyXG5cclxudmFyIF92YWxpZGF0ZURvY3VtZW50ID0gZnVuY3Rpb24oZG9jKSB7XHJcblxyXG5cdGNoZWNrKGRvYywge1xyXG5cdFx0aW5mbzogT2JqZWN0LFxyXG5cdFx0c2VudDogTWF0Y2guT3B0aW9uYWwoQm9vbGVhbiksXHJcblx0XHRzZW5kaW5nOiBNYXRjaC5PcHRpb25hbChNYXRjaC5JbnRlZ2VyKSxcclxuXHRcdGNyZWF0ZWRBdDogRGF0ZSxcclxuXHRcdGNyZWF0ZWRCeTogTWF0Y2guT25lT2YoU3RyaW5nLCBudWxsKVxyXG5cdH0pO1xyXG5cclxufTtcclxuXHJcbkluc3RhbmNlUmVjb3JkUXVldWUuc2VuZCA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuXHR2YXIgY3VycmVudFVzZXIgPSBNZXRlb3IuaXNDbGllbnQgJiYgTWV0ZW9yLnVzZXJJZCAmJiBNZXRlb3IudXNlcklkKCkgfHwgTWV0ZW9yLmlzU2VydmVyICYmIChvcHRpb25zLmNyZWF0ZWRCeSB8fCAnPFNFUlZFUj4nKSB8fCBudWxsXHJcblx0dmFyIGRvYyA9IF8uZXh0ZW5kKHtcclxuXHRcdGNyZWF0ZWRBdDogbmV3IERhdGUoKSxcclxuXHRcdGNyZWF0ZWRCeTogY3VycmVudFVzZXJcclxuXHR9KTtcclxuXHJcblx0aWYgKE1hdGNoLnRlc3Qob3B0aW9ucywgT2JqZWN0KSkge1xyXG5cdFx0ZG9jLmluZm8gPSBfLnBpY2sob3B0aW9ucywgJ2luc3RhbmNlX2lkJywgJ3JlY29yZHMnLCAnc3luY19kYXRlJywgJ2luc3RhbmNlX2ZpbmlzaF9kYXRlJywgJ3N0ZXBfbmFtZScpO1xyXG5cdH1cclxuXHJcblx0ZG9jLnNlbnQgPSBmYWxzZTtcclxuXHRkb2Muc2VuZGluZyA9IDA7XHJcblxyXG5cdF92YWxpZGF0ZURvY3VtZW50KGRvYyk7XHJcblxyXG5cdHJldHVybiBJbnN0YW5jZVJlY29yZFF1ZXVlLmNvbGxlY3Rpb24uaW5zZXJ0KGRvYyk7XHJcbn07IiwidmFyIF9ldmFsID0gcmVxdWlyZSgnZXZhbCcpO1xyXG52YXIgaXNDb25maWd1cmVkID0gZmFsc2U7XHJcbnZhciBzZW5kV29ya2VyID0gZnVuY3Rpb24gKHRhc2ssIGludGVydmFsKSB7XHJcblxyXG5cdGlmIChJbnN0YW5jZVJlY29yZFF1ZXVlLmRlYnVnKSB7XHJcblx0XHRjb25zb2xlLmxvZygnSW5zdGFuY2VSZWNvcmRRdWV1ZTogU2VuZCB3b3JrZXIgc3RhcnRlZCwgdXNpbmcgaW50ZXJ2YWw6ICcgKyBpbnRlcnZhbCk7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gTWV0ZW9yLnNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdHRhc2soKTtcclxuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKCdJbnN0YW5jZVJlY29yZFF1ZXVlOiBFcnJvciB3aGlsZSBzZW5kaW5nOiAnICsgZXJyb3IubWVzc2FnZSk7XHJcblx0XHR9XHJcblx0fSwgaW50ZXJ2YWwpO1xyXG59O1xyXG5cclxuLypcclxuXHRvcHRpb25zOiB7XHJcblx0XHQvLyBDb250cm9scyB0aGUgc2VuZGluZyBpbnRlcnZhbFxyXG5cdFx0c2VuZEludGVydmFsOiBNYXRjaC5PcHRpb25hbChOdW1iZXIpLFxyXG5cdFx0Ly8gQ29udHJvbHMgdGhlIHNlbmRpbmcgYmF0Y2ggc2l6ZSBwZXIgaW50ZXJ2YWxcclxuXHRcdHNlbmRCYXRjaFNpemU6IE1hdGNoLk9wdGlvbmFsKE51bWJlciksXHJcblx0XHQvLyBBbGxvdyBvcHRpb25hbCBrZWVwaW5nIG5vdGlmaWNhdGlvbnMgaW4gY29sbGVjdGlvblxyXG5cdFx0a2VlcERvY3M6IE1hdGNoLk9wdGlvbmFsKEJvb2xlYW4pXHJcblx0fVxyXG4qL1xyXG5JbnN0YW5jZVJlY29yZFF1ZXVlLkNvbmZpZ3VyZSA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcblx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cdG9wdGlvbnMgPSBfLmV4dGVuZCh7XHJcblx0XHRzZW5kVGltZW91dDogNjAwMDAsIC8vIFRpbWVvdXQgcGVyaW9kXHJcblx0fSwgb3B0aW9ucyk7XHJcblxyXG5cdC8vIEJsb2NrIG11bHRpcGxlIGNhbGxzXHJcblx0aWYgKGlzQ29uZmlndXJlZCkge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKCdJbnN0YW5jZVJlY29yZFF1ZXVlLkNvbmZpZ3VyZSBzaG91bGQgbm90IGJlIGNhbGxlZCBtb3JlIHRoYW4gb25jZSEnKTtcclxuXHR9XHJcblxyXG5cdGlzQ29uZmlndXJlZCA9IHRydWU7XHJcblxyXG5cdC8vIEFkZCBkZWJ1ZyBpbmZvXHJcblx0aWYgKEluc3RhbmNlUmVjb3JkUXVldWUuZGVidWcpIHtcclxuXHRcdGNvbnNvbGUubG9nKCdJbnN0YW5jZVJlY29yZFF1ZXVlLkNvbmZpZ3VyZScsIG9wdGlvbnMpO1xyXG5cdH1cclxuXHJcblx0c2VsZi5zeW5jQXR0YWNoID0gZnVuY3Rpb24gKHN5bmNfYXR0YWNobWVudCwgaW5zSWQsIHNwYWNlSWQsIG5ld1JlY29yZElkLCBvYmplY3ROYW1lKSB7XHJcblx0XHRpZiAoc3luY19hdHRhY2htZW50ID09IFwibGFzdGVzdFwiKSB7XHJcblx0XHRcdGNmcy5pbnN0YW5jZXMuZmluZCh7XHJcblx0XHRcdFx0J21ldGFkYXRhLmluc3RhbmNlJzogaW5zSWQsXHJcblx0XHRcdFx0J21ldGFkYXRhLmN1cnJlbnQnOiB0cnVlXHJcblx0XHRcdH0pLmZvckVhY2goZnVuY3Rpb24gKGYpIHtcclxuXHRcdFx0XHR2YXIgbmV3RmlsZSA9IG5ldyBGUy5GaWxlKCksXHJcblx0XHRcdFx0XHRjbXNGaWxlSWQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2Ntc19maWxlcycpLl9tYWtlTmV3SUQoKTtcclxuXHRcdFx0XHRuZXdGaWxlLmF0dGFjaERhdGEoZi5jcmVhdGVSZWFkU3RyZWFtKCdpbnN0YW5jZXMnKSwge1xyXG5cdFx0XHRcdFx0dHlwZTogZi5vcmlnaW5hbC50eXBlXHJcblx0XHRcdFx0fSwgZnVuY3Rpb24gKGVycikge1xyXG5cdFx0XHRcdFx0aWYgKGVycikge1xyXG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKGVyci5lcnJvciwgZXJyLnJlYXNvbik7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRuZXdGaWxlLm5hbWUoZi5uYW1lKCkpO1xyXG5cdFx0XHRcdFx0bmV3RmlsZS5zaXplKGYuc2l6ZSgpKTtcclxuXHRcdFx0XHRcdHZhciBtZXRhZGF0YSA9IHtcclxuXHRcdFx0XHRcdFx0b3duZXI6IGYubWV0YWRhdGEub3duZXIsXHJcblx0XHRcdFx0XHRcdG93bmVyX25hbWU6IGYubWV0YWRhdGEub3duZXJfbmFtZSxcclxuXHRcdFx0XHRcdFx0c3BhY2U6IHNwYWNlSWQsXHJcblx0XHRcdFx0XHRcdHJlY29yZF9pZDogbmV3UmVjb3JkSWQsXHJcblx0XHRcdFx0XHRcdG9iamVjdF9uYW1lOiBvYmplY3ROYW1lLFxyXG5cdFx0XHRcdFx0XHRwYXJlbnQ6IGNtc0ZpbGVJZFxyXG5cdFx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0XHRuZXdGaWxlLm1ldGFkYXRhID0gbWV0YWRhdGE7XHJcblx0XHRcdFx0XHRjZnMuZmlsZXMuaW5zZXJ0KG5ld0ZpbGUpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdE1ldGVvci53cmFwQXN5bmMoZnVuY3Rpb24gKG5ld0ZpbGUsIENyZWF0b3IsIGNtc0ZpbGVJZCwgb2JqZWN0TmFtZSwgbmV3UmVjb3JkSWQsIHNwYWNlSWQsIGYsIGNiKSB7XHJcblx0XHRcdFx0XHRuZXdGaWxlLm9uY2UoJ3N0b3JlZCcsIGZ1bmN0aW9uIChzdG9yZU5hbWUpIHtcclxuXHRcdFx0XHRcdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKCdjbXNfZmlsZXMnKS5pbnNlcnQoe1xyXG5cdFx0XHRcdFx0XHRcdF9pZDogY21zRmlsZUlkLFxyXG5cdFx0XHRcdFx0XHRcdHBhcmVudDoge1xyXG5cdFx0XHRcdFx0XHRcdFx0bzogb2JqZWN0TmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdGlkczogW25ld1JlY29yZElkXVxyXG5cdFx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdFx0c2l6ZTogbmV3RmlsZS5zaXplKCksXHJcblx0XHRcdFx0XHRcdFx0bmFtZTogbmV3RmlsZS5uYW1lKCksXHJcblx0XHRcdFx0XHRcdFx0ZXh0ZW50aW9uOiBuZXdGaWxlLmV4dGVuc2lvbigpLFxyXG5cdFx0XHRcdFx0XHRcdHNwYWNlOiBzcGFjZUlkLFxyXG5cdFx0XHRcdFx0XHRcdHZlcnNpb25zOiBbbmV3RmlsZS5faWRdLFxyXG5cdFx0XHRcdFx0XHRcdG93bmVyOiBmLm1ldGFkYXRhLm93bmVyLFxyXG5cdFx0XHRcdFx0XHRcdGNyZWF0ZWRfYnk6IGYubWV0YWRhdGEub3duZXIsXHJcblx0XHRcdFx0XHRcdFx0bW9kaWZpZWRfYnk6IGYubWV0YWRhdGEub3duZXJcclxuXHRcdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0XHRjYihudWxsKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0bmV3RmlsZS5vbmNlKCdlcnJvcicsIGZ1bmN0aW9uIChlcnJvcikge1xyXG5cdFx0XHRcdFx0XHRjYihlcnJvcik7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9KShuZXdGaWxlLCBDcmVhdG9yLCBjbXNGaWxlSWQsIG9iamVjdE5hbWUsIG5ld1JlY29yZElkLCBzcGFjZUlkLCBmKTtcclxuXHRcdFx0fSlcclxuXHRcdH0gZWxzZSBpZiAoc3luY19hdHRhY2htZW50ID09IFwiYWxsXCIpIHtcclxuXHRcdFx0dmFyIHBhcmVudHMgPSBbXTtcclxuXHRcdFx0Y2ZzLmluc3RhbmNlcy5maW5kKHtcclxuXHRcdFx0XHQnbWV0YWRhdGEuaW5zdGFuY2UnOiBpbnNJZFxyXG5cdFx0XHR9KS5mb3JFYWNoKGZ1bmN0aW9uIChmKSB7XHJcblx0XHRcdFx0dmFyIG5ld0ZpbGUgPSBuZXcgRlMuRmlsZSgpLFxyXG5cdFx0XHRcdFx0Y21zRmlsZUlkID0gZi5tZXRhZGF0YS5wYXJlbnQ7XHJcblxyXG5cdFx0XHRcdGlmICghcGFyZW50cy5pbmNsdWRlcyhjbXNGaWxlSWQpKSB7XHJcblx0XHRcdFx0XHRwYXJlbnRzLnB1c2goY21zRmlsZUlkKTtcclxuXHRcdFx0XHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbignY21zX2ZpbGVzJykuaW5zZXJ0KHtcclxuXHRcdFx0XHRcdFx0X2lkOiBjbXNGaWxlSWQsXHJcblx0XHRcdFx0XHRcdHBhcmVudDoge1xyXG5cdFx0XHRcdFx0XHRcdG86IG9iamVjdE5hbWUsXHJcblx0XHRcdFx0XHRcdFx0aWRzOiBbbmV3UmVjb3JkSWRdXHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdHNwYWNlOiBzcGFjZUlkLFxyXG5cdFx0XHRcdFx0XHR2ZXJzaW9uczogW10sXHJcblx0XHRcdFx0XHRcdG93bmVyOiBmLm1ldGFkYXRhLm93bmVyLFxyXG5cdFx0XHRcdFx0XHRjcmVhdGVkX2J5OiBmLm1ldGFkYXRhLm93bmVyLFxyXG5cdFx0XHRcdFx0XHRtb2RpZmllZF9ieTogZi5tZXRhZGF0YS5vd25lclxyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdG5ld0ZpbGUuYXR0YWNoRGF0YShmLmNyZWF0ZVJlYWRTdHJlYW0oJ2luc3RhbmNlcycpLCB7XHJcblx0XHRcdFx0XHR0eXBlOiBmLm9yaWdpbmFsLnR5cGVcclxuXHRcdFx0XHR9LCBmdW5jdGlvbiAoZXJyKSB7XHJcblx0XHRcdFx0XHRpZiAoZXJyKSB7XHJcblx0XHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoZXJyLmVycm9yLCBlcnIucmVhc29uKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdG5ld0ZpbGUubmFtZShmLm5hbWUoKSk7XHJcblx0XHRcdFx0XHRuZXdGaWxlLnNpemUoZi5zaXplKCkpO1xyXG5cdFx0XHRcdFx0dmFyIG1ldGFkYXRhID0ge1xyXG5cdFx0XHRcdFx0XHRvd25lcjogZi5tZXRhZGF0YS5vd25lcixcclxuXHRcdFx0XHRcdFx0b3duZXJfbmFtZTogZi5tZXRhZGF0YS5vd25lcl9uYW1lLFxyXG5cdFx0XHRcdFx0XHRzcGFjZTogc3BhY2VJZCxcclxuXHRcdFx0XHRcdFx0cmVjb3JkX2lkOiBuZXdSZWNvcmRJZCxcclxuXHRcdFx0XHRcdFx0b2JqZWN0X25hbWU6IG9iamVjdE5hbWUsXHJcblx0XHRcdFx0XHRcdHBhcmVudDogY21zRmlsZUlkXHJcblx0XHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHRcdG5ld0ZpbGUubWV0YWRhdGEgPSBtZXRhZGF0YTtcclxuXHRcdFx0XHRcdGNmcy5maWxlcy5pbnNlcnQobmV3RmlsZSk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0TWV0ZW9yLndyYXBBc3luYyhmdW5jdGlvbiAobmV3RmlsZSwgQ3JlYXRvciwgY21zRmlsZUlkLCBmLCBjYikge1xyXG5cdFx0XHRcdFx0bmV3RmlsZS5vbmNlKCdzdG9yZWQnLCBmdW5jdGlvbiAoc3RvcmVOYW1lKSB7XHJcblx0XHRcdFx0XHRcdGlmIChmLm1ldGFkYXRhLmN1cnJlbnQgPT0gdHJ1ZSkge1xyXG5cdFx0XHRcdFx0XHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbignY21zX2ZpbGVzJykudXBkYXRlKGNtc0ZpbGVJZCwge1xyXG5cdFx0XHRcdFx0XHRcdFx0JHNldDoge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRzaXplOiBuZXdGaWxlLnNpemUoKSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0bmFtZTogbmV3RmlsZS5uYW1lKCksXHJcblx0XHRcdFx0XHRcdFx0XHRcdGV4dGVudGlvbjogbmV3RmlsZS5leHRlbnNpb24oKSxcclxuXHRcdFx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdFx0XHQkYWRkVG9TZXQ6IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0dmVyc2lvbnM6IG5ld0ZpbGUuX2lkXHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKCdjbXNfZmlsZXMnKS51cGRhdGUoY21zRmlsZUlkLCB7XHJcblx0XHRcdFx0XHRcdFx0XHQkYWRkVG9TZXQ6IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0dmVyc2lvbnM6IG5ld0ZpbGUuX2lkXHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdGNiKG51bGwpO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRuZXdGaWxlLm9uY2UoJ2Vycm9yJywgZnVuY3Rpb24gKGVycm9yKSB7XHJcblx0XHRcdFx0XHRcdGNiKGVycm9yKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH0pKG5ld0ZpbGUsIENyZWF0b3IsIGNtc0ZpbGVJZCwgZik7XHJcblx0XHRcdH0pXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRzZWxmLnN5bmNJbnNGaWVsZHMgPSBbJ25hbWUnLCAnc3VibWl0dGVyX25hbWUnLCAnYXBwbGljYW50X25hbWUnLCAnYXBwbGljYW50X29yZ2FuaXphdGlvbl9uYW1lJywgJ2FwcGxpY2FudF9vcmdhbml6YXRpb25fZnVsbG5hbWUnLCAnc3RhdGUnLFxyXG5cdFx0J2N1cnJlbnRfc3RlcF9uYW1lJywgJ2Zsb3dfbmFtZScsICdjYXRlZ29yeV9uYW1lJywgJ3N1Ym1pdF9kYXRlJywgJ2ZpbmlzaF9kYXRlJywgJ2ZpbmFsX2RlY2lzaW9uJywgJ2FwcGxpY2FudF9vcmdhbml6YXRpb24nLCAnYXBwbGljYW50X2NvbXBhbnknXHJcblx0XTtcclxuXHRzZWxmLnN5bmNWYWx1ZXMgPSBmdW5jdGlvbiAoZmllbGRfbWFwX2JhY2ssIHZhbHVlcywgaW5zLCBvYmplY3RJbmZvLCBmaWVsZF9tYXBfYmFja19zY3JpcHQsIHJlY29yZCkge1xyXG5cdFx0dmFyXHJcblx0XHRcdG9iaiA9IHt9LFxyXG5cdFx0XHR0YWJsZUZpZWxkQ29kZXMgPSBbXSxcclxuXHRcdFx0dGFibGVGaWVsZE1hcCA9IFtdO1xyXG5cdFx0XHR0YWJsZVRvUmVsYXRlZE1hcCA9IHt9O1xyXG5cclxuXHRcdGZpZWxkX21hcF9iYWNrID0gZmllbGRfbWFwX2JhY2sgfHwgW107XHJcblxyXG5cdFx0dmFyIHNwYWNlSWQgPSBpbnMuc3BhY2U7XHJcblxyXG5cdFx0dmFyIGZvcm0gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJmb3Jtc1wiKS5maW5kT25lKGlucy5mb3JtKTtcclxuXHRcdHZhciBmb3JtRmllbGRzID0gbnVsbDtcclxuXHRcdGlmIChmb3JtLmN1cnJlbnQuX2lkID09PSBpbnMuZm9ybV92ZXJzaW9uKSB7XHJcblx0XHRcdGZvcm1GaWVsZHMgPSBmb3JtLmN1cnJlbnQuZmllbGRzIHx8IFtdO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dmFyIGZvcm1WZXJzaW9uID0gXy5maW5kKGZvcm0uaGlzdG9yeXMsIGZ1bmN0aW9uIChoKSB7XHJcblx0XHRcdFx0cmV0dXJuIGguX2lkID09PSBpbnMuZm9ybV92ZXJzaW9uO1xyXG5cdFx0XHR9KVxyXG5cdFx0XHRmb3JtRmllbGRzID0gZm9ybVZlcnNpb24gPyBmb3JtVmVyc2lvbi5maWVsZHMgOiBbXTtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgb2JqZWN0RmllbGRzID0gb2JqZWN0SW5mby5maWVsZHM7XHJcblx0XHR2YXIgb2JqZWN0RmllbGRLZXlzID0gXy5rZXlzKG9iamVjdEZpZWxkcyk7XHJcblx0XHR2YXIgcmVsYXRlZE9iamVjdHMgPSBDcmVhdG9yLmdldFJlbGF0ZWRPYmplY3RzKG9iamVjdEluZm8ubmFtZSxzcGFjZUlkKTtcclxuXHRcdHZhciByZWxhdGVkT2JqZWN0c0tleXMgPSBfLnBsdWNrKHJlbGF0ZWRPYmplY3RzLCAnb2JqZWN0X25hbWUnKTtcclxuXHRcdHZhciBmb3JtVGFibGVGaWVsZHMgPSBfLmZpbHRlcihmb3JtRmllbGRzLCBmdW5jdGlvbihmb3JtRmllbGQpe1xyXG5cdFx0XHRyZXR1cm4gZm9ybUZpZWxkLnR5cGUgPT09ICd0YWJsZSdcclxuXHRcdH0pO1xyXG5cdFx0dmFyIGZvcm1UYWJsZUZpZWxkc0NvZGUgPSAgXy5wbHVjayhmb3JtVGFibGVGaWVsZHMsICdjb2RlJyk7XHJcblxyXG5cdFx0dmFyIGdldFJlbGF0ZWRPYmplY3RGaWVsZCA9IGZ1bmN0aW9uKGtleSl7XHJcblx0XHRcdHJldHVybiBfLmZpbmQocmVsYXRlZE9iamVjdHNLZXlzLCBmdW5jdGlvbihyZWxhdGVkT2JqZWN0c0tleSl7XHJcblx0XHRcdFx0cmV0dXJuIGtleS5zdGFydHNXaXRoKHJlbGF0ZWRPYmplY3RzS2V5ICsgJy4nKTtcclxuXHRcdFx0fSlcclxuXHRcdH07XHJcblxyXG5cdFx0dmFyIGdldEZvcm1UYWJsZUZpZWxkID0gZnVuY3Rpb24gKGtleSkge1xyXG5cdFx0XHRyZXR1cm4gXy5maW5kKGZvcm1UYWJsZUZpZWxkc0NvZGUsIGZ1bmN0aW9uKGZvcm1UYWJsZUZpZWxkQ29kZSl7XHJcblx0XHRcdFx0cmV0dXJuIGtleS5zdGFydHNXaXRoKGZvcm1UYWJsZUZpZWxkQ29kZSArICcuJyk7XHJcblx0XHRcdH0pXHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBnZXRGb3JtRmllbGQgPSBmdW5jdGlvbihfZm9ybUZpZWxkcywgX2ZpZWxkQ29kZSl7XHJcblx0XHRcdHZhciBmb3JtRmllbGQgPSBudWxsO1xyXG5cdFx0XHRfLmVhY2goX2Zvcm1GaWVsZHMsIGZ1bmN0aW9uIChmZikge1xyXG5cdFx0XHRcdGlmICghZm9ybUZpZWxkKSB7XHJcblx0XHRcdFx0XHRpZiAoZmYuY29kZSA9PT0gX2ZpZWxkQ29kZSkge1xyXG5cdFx0XHRcdFx0XHRmb3JtRmllbGQgPSBmZjtcclxuXHRcdFx0XHRcdH0gZWxzZSBpZiAoZmYudHlwZSA9PT0gJ3NlY3Rpb24nKSB7XHJcblx0XHRcdFx0XHRcdF8uZWFjaChmZi5maWVsZHMsIGZ1bmN0aW9uIChmKSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKCFmb3JtRmllbGQpIHtcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChmLmNvZGUgPT09IF9maWVsZENvZGUpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0Zm9ybUZpZWxkID0gZjtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHR9ZWxzZSBpZiAoZmYudHlwZSA9PT0gJ3RhYmxlJykge1xyXG5cdFx0XHRcdFx0XHRfLmVhY2goZmYuZmllbGRzLCBmdW5jdGlvbiAoZikge1xyXG5cdFx0XHRcdFx0XHRcdGlmICghZm9ybUZpZWxkKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoZi5jb2RlID09PSBfZmllbGRDb2RlKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGZvcm1GaWVsZCA9IGY7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHRcdHJldHVybiBmb3JtRmllbGQ7XHJcblx0XHR9XHJcblxyXG5cdFx0ZmllbGRfbWFwX2JhY2suZm9yRWFjaChmdW5jdGlvbiAoZm0pIHtcclxuXHRcdFx0Ly93b3JrZmxvdyDnmoTlrZDooajliLBjcmVhdG9yIG9iamVjdCDnmoTnm7jlhbPlr7nosaFcclxuXHRcdFx0dmFyIHJlbGF0ZWRPYmplY3RGaWVsZCA9IGdldFJlbGF0ZWRPYmplY3RGaWVsZChmbS5vYmplY3RfZmllbGQpO1xyXG5cdFx0XHR2YXIgZm9ybVRhYmxlRmllbGQgPSBnZXRGb3JtVGFibGVGaWVsZChmbS53b3JrZmxvd19maWVsZCk7XHJcblx0XHRcdGlmIChyZWxhdGVkT2JqZWN0RmllbGQpe1xyXG5cdFx0XHRcdHZhciBvVGFibGVDb2RlID0gZm0ub2JqZWN0X2ZpZWxkLnNwbGl0KCcuJylbMF07XHJcblx0XHRcdFx0dmFyIG9UYWJsZUZpZWxkQ29kZSA9IGZtLm9iamVjdF9maWVsZC5zcGxpdCgnLicpWzFdO1xyXG5cdFx0XHRcdHZhciB0YWJsZVRvUmVsYXRlZE1hcEtleSA9IG9UYWJsZUNvZGU7XHJcblx0XHRcdFx0aWYoIXRhYmxlVG9SZWxhdGVkTWFwW3RhYmxlVG9SZWxhdGVkTWFwS2V5XSl7XHJcblx0XHRcdFx0XHR0YWJsZVRvUmVsYXRlZE1hcFt0YWJsZVRvUmVsYXRlZE1hcEtleV0gPSB7fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYoZm9ybVRhYmxlRmllbGQpe1xyXG5cdFx0XHRcdFx0dmFyIHdUYWJsZUNvZGUgPSBmbS53b3JrZmxvd19maWVsZC5zcGxpdCgnLicpWzBdO1xyXG5cdFx0XHRcdFx0dGFibGVUb1JlbGF0ZWRNYXBbdGFibGVUb1JlbGF0ZWRNYXBLZXldWydfRlJPTV9UQUJMRV9DT0RFJ10gPSB3VGFibGVDb2RlXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR0YWJsZVRvUmVsYXRlZE1hcFt0YWJsZVRvUmVsYXRlZE1hcEtleV1bb1RhYmxlRmllbGRDb2RlXSA9IGZtLndvcmtmbG93X2ZpZWxkXHJcblx0XHRcdH1cclxuXHRcdFx0Ly8g5Yik5pat5piv5ZCm5piv5a2Q6KGo5a2X5q61XHJcblx0XHRcdGVsc2UgaWYgKGZtLndvcmtmbG93X2ZpZWxkLmluZGV4T2YoJy4kLicpID4gMCAmJiBmbS5vYmplY3RfZmllbGQuaW5kZXhPZignLiQuJykgPiAwKSB7XHJcblx0XHRcdFx0dmFyIHdUYWJsZUNvZGUgPSBmbS53b3JrZmxvd19maWVsZC5zcGxpdCgnLiQuJylbMF07XHJcblx0XHRcdFx0dmFyIG9UYWJsZUNvZGUgPSBmbS5vYmplY3RfZmllbGQuc3BsaXQoJy4kLicpWzBdO1xyXG5cdFx0XHRcdGlmICh2YWx1ZXMuaGFzT3duUHJvcGVydHkod1RhYmxlQ29kZSkgJiYgXy5pc0FycmF5KHZhbHVlc1t3VGFibGVDb2RlXSkpIHtcclxuXHRcdFx0XHRcdHRhYmxlRmllbGRDb2Rlcy5wdXNoKEpTT04uc3RyaW5naWZ5KHtcclxuXHRcdFx0XHRcdFx0d29ya2Zsb3dfdGFibGVfZmllbGRfY29kZTogd1RhYmxlQ29kZSxcclxuXHRcdFx0XHRcdFx0b2JqZWN0X3RhYmxlX2ZpZWxkX2NvZGU6IG9UYWJsZUNvZGVcclxuXHRcdFx0XHRcdH0pKTtcclxuXHRcdFx0XHRcdHRhYmxlRmllbGRNYXAucHVzaChmbSk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmICh2YWx1ZXMuaGFzT3duUHJvcGVydHkoZm0ud29ya2Zsb3dfZmllbGQpKSB7XHJcblx0XHRcdFx0dmFyIHdGaWVsZCA9IG51bGw7XHJcblxyXG5cdFx0XHRcdF8uZWFjaChmb3JtRmllbGRzLCBmdW5jdGlvbiAoZmYpIHtcclxuXHRcdFx0XHRcdGlmICghd0ZpZWxkKSB7XHJcblx0XHRcdFx0XHRcdGlmIChmZi5jb2RlID09PSBmbS53b3JrZmxvd19maWVsZCkge1xyXG5cdFx0XHRcdFx0XHRcdHdGaWVsZCA9IGZmO1xyXG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGZmLnR5cGUgPT09ICdzZWN0aW9uJykge1xyXG5cdFx0XHRcdFx0XHRcdF8uZWFjaChmZi5maWVsZHMsIGZ1bmN0aW9uIChmKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoIXdGaWVsZCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoZi5jb2RlID09PSBmbS53b3JrZmxvd19maWVsZCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHdGaWVsZCA9IGY7XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSlcclxuXHJcblx0XHRcdFx0dmFyIG9GaWVsZCA9IG9iamVjdEZpZWxkc1tmbS5vYmplY3RfZmllbGRdO1xyXG5cclxuXHRcdFx0XHRpZiAob0ZpZWxkKSB7XHJcblx0XHRcdFx0XHRpZiAoIXdGaWVsZCkge1xyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZygnZm0ud29ya2Zsb3dfZmllbGQ6ICcsIGZtLndvcmtmbG93X2ZpZWxkKVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Ly8g6KGo5Y2V6YCJ5Lq66YCJ57uE5a2X5q61IOiHsyDlr7nosaEgbG9va3VwIG1hc3Rlcl9kZXRhaWznsbvlnovlrZfmrrXlkIzmraVcclxuXHRcdFx0XHRcdGlmICghd0ZpZWxkLmlzX211bHRpc2VsZWN0ICYmIFsndXNlcicsICdncm91cCddLmluY2x1ZGVzKHdGaWVsZC50eXBlKSAmJiAhb0ZpZWxkLm11bHRpcGxlICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhvRmllbGQudHlwZSkgJiYgWyd1c2VycycsICdvcmdhbml6YXRpb25zJ10uaW5jbHVkZXMob0ZpZWxkLnJlZmVyZW5jZV90bykpIHtcclxuXHRcdFx0XHRcdFx0b2JqW2ZtLm9iamVjdF9maWVsZF0gPSB2YWx1ZXNbZm0ud29ya2Zsb3dfZmllbGRdWydpZCddO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWxzZSBpZiAoIW9GaWVsZC5tdWx0aXBsZSAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMob0ZpZWxkLnR5cGUpICYmIF8uaXNTdHJpbmcob0ZpZWxkLnJlZmVyZW5jZV90bykgJiYgXy5pc1N0cmluZyh2YWx1ZXNbZm0ud29ya2Zsb3dfZmllbGRdKSkge1xyXG5cdFx0XHRcdFx0XHR2YXIgb0NvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob0ZpZWxkLnJlZmVyZW5jZV90bywgc3BhY2VJZClcclxuXHRcdFx0XHRcdFx0dmFyIHJlZmVyT2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob0ZpZWxkLnJlZmVyZW5jZV90bywgc3BhY2VJZClcclxuXHRcdFx0XHRcdFx0aWYgKG9Db2xsZWN0aW9uICYmIHJlZmVyT2JqZWN0KSB7XHJcblx0XHRcdFx0XHRcdFx0Ly8g5YWI6K6k5Li65q2k5YC85pivcmVmZXJPYmplY3QgX2lk5a2X5q615YC8XHJcblx0XHRcdFx0XHRcdFx0dmFyIHJlZmVyRGF0YSA9IG9Db2xsZWN0aW9uLmZpbmRPbmUodmFsdWVzW2ZtLndvcmtmbG93X2ZpZWxkXSwge1xyXG5cdFx0XHRcdFx0XHRcdFx0ZmllbGRzOiB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdF9pZDogMVxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdGlmIChyZWZlckRhdGEpIHtcclxuXHRcdFx0XHRcdFx0XHRcdG9ialtmbS5vYmplY3RfZmllbGRdID0gcmVmZXJEYXRhLl9pZDtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdC8vIOWFtuasoeiupOS4uuatpOWAvOaYr3JlZmVyT2JqZWN0IE5BTUVfRklFTERfS0VZ5YC8XHJcblx0XHRcdFx0XHRcdFx0aWYgKCFyZWZlckRhdGEpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHZhciBuYW1lRmllbGRLZXkgPSByZWZlck9iamVjdC5OQU1FX0ZJRUxEX0tFWTtcclxuXHRcdFx0XHRcdFx0XHRcdHZhciBzZWxlY3RvciA9IHt9O1xyXG5cdFx0XHRcdFx0XHRcdFx0c2VsZWN0b3JbbmFtZUZpZWxkS2V5XSA9IHZhbHVlc1tmbS53b3JrZmxvd19maWVsZF07XHJcblx0XHRcdFx0XHRcdFx0XHRyZWZlckRhdGEgPSBvQ29sbGVjdGlvbi5maW5kT25lKHNlbGVjdG9yLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGZpZWxkczoge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdF9pZDogMVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChyZWZlckRhdGEpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0b2JqW2ZtLm9iamVjdF9maWVsZF0gPSByZWZlckRhdGEuX2lkO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRpZiAob0ZpZWxkLnR5cGUgPT09IFwiYm9vbGVhblwiKSB7XHJcblx0XHRcdFx0XHRcdFx0dmFyIHRtcF9maWVsZF92YWx1ZSA9IHZhbHVlc1tmbS53b3JrZmxvd19maWVsZF07XHJcblx0XHRcdFx0XHRcdFx0aWYgKFsndHJ1ZScsICfmmK8nXS5pbmNsdWRlcyh0bXBfZmllbGRfdmFsdWUpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRvYmpbZm0ub2JqZWN0X2ZpZWxkXSA9IHRydWU7XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmIChbJ2ZhbHNlJywgJ+WQpiddLmluY2x1ZGVzKHRtcF9maWVsZF92YWx1ZSkpIHtcclxuXHRcdFx0XHRcdFx0XHRcdG9ialtmbS5vYmplY3RfZmllbGRdID0gZmFsc2U7XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdG9ialtmbS5vYmplY3RfZmllbGRdID0gdG1wX2ZpZWxkX3ZhbHVlO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRlbHNlIGlmKFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhvRmllbGQudHlwZSkgJiYgd0ZpZWxkLnR5cGUgPT09ICdvZGF0YScpe1xyXG5cdFx0XHRcdFx0XHRcdGlmKG9GaWVsZC5tdWx0aXBsZSAmJiB3RmllbGQuaXNfbXVsdGlzZWxlY3Qpe1xyXG5cdFx0XHRcdFx0XHRcdFx0b2JqW2ZtLm9iamVjdF9maWVsZF0gPSBfLmNvbXBhY3QoXy5wbHVjayh2YWx1ZXNbZm0ud29ya2Zsb3dfZmllbGRdLCAnX2lkJykpXHJcblx0XHRcdFx0XHRcdFx0fWVsc2UgaWYoIW9GaWVsZC5tdWx0aXBsZSAmJiAhd0ZpZWxkLmlzX211bHRpc2VsZWN0KXtcclxuXHRcdFx0XHRcdFx0XHRcdGlmKCFfLmlzRW1wdHkodmFsdWVzW2ZtLndvcmtmbG93X2ZpZWxkXSkpe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRvYmpbZm0ub2JqZWN0X2ZpZWxkXSA9IFx0dmFsdWVzW2ZtLndvcmtmbG93X2ZpZWxkXS5faWRcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0XHRcdG9ialtmbS5vYmplY3RfZmllbGRdID0gdmFsdWVzW2ZtLndvcmtmbG93X2ZpZWxkXTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0b2JqW2ZtLm9iamVjdF9maWVsZF0gPSB2YWx1ZXNbZm0ud29ya2Zsb3dfZmllbGRdO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGlmIChmbS5vYmplY3RfZmllbGQuaW5kZXhPZignLicpID4gLTEpIHtcclxuXHRcdFx0XHRcdFx0dmFyIHRlbU9iakZpZWxkcyA9IGZtLm9iamVjdF9maWVsZC5zcGxpdCgnLicpO1xyXG5cdFx0XHRcdFx0XHRpZiAodGVtT2JqRmllbGRzLmxlbmd0aCA9PT0gMikge1xyXG5cdFx0XHRcdFx0XHRcdHZhciBvYmpGaWVsZCA9IHRlbU9iakZpZWxkc1swXTtcclxuXHRcdFx0XHRcdFx0XHR2YXIgcmVmZXJPYmpGaWVsZCA9IHRlbU9iakZpZWxkc1sxXTtcclxuXHRcdFx0XHRcdFx0XHR2YXIgb0ZpZWxkID0gb2JqZWN0RmllbGRzW29iakZpZWxkXTtcclxuXHRcdFx0XHRcdFx0XHRpZiAoIW9GaWVsZC5tdWx0aXBsZSAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMob0ZpZWxkLnR5cGUpICYmIF8uaXNTdHJpbmcob0ZpZWxkLnJlZmVyZW5jZV90bykpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHZhciBvQ29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvRmllbGQucmVmZXJlbmNlX3RvLCBzcGFjZUlkKVxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKG9Db2xsZWN0aW9uICYmIHJlY29yZCAmJiByZWNvcmRbb2JqRmllbGRdKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHZhciByZWZlclNldE9iaiA9IHt9O1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRyZWZlclNldE9ialtyZWZlck9iakZpZWxkXSA9IHZhbHVlc1tmbS53b3JrZmxvd19maWVsZF07XHJcblx0XHRcdFx0XHRcdFx0XHRcdG9Db2xsZWN0aW9uLnVwZGF0ZShyZWNvcmRbb2JqRmllbGRdLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0JHNldDogcmVmZXJTZXRPYmpcclxuXHRcdFx0XHRcdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdC8vIGVsc2V7XHJcblx0XHRcdFx0XHQvLyBcdHZhciByZWxhdGVkT2JqZWN0ID0gXy5maW5kKHJlbGF0ZWRPYmplY3RzLCBmdW5jdGlvbihfcmVsYXRlZE9iamVjdCl7XHJcblx0XHRcdFx0XHQvLyBcdFx0cmV0dXJuIF9yZWxhdGVkT2JqZWN0Lm9iamVjdF9uYW1lID09PSBmbS5vYmplY3RfZmllbGRcclxuXHRcdFx0XHRcdC8vIFx0fSlcclxuXHRcdFx0XHRcdC8vXHJcblx0XHRcdFx0XHQvLyBcdGlmKHJlbGF0ZWRPYmplY3Qpe1xyXG5cdFx0XHRcdFx0Ly8gXHRcdG9ialtmbS5vYmplY3RfZmllbGRdID0gdmFsdWVzW2ZtLndvcmtmbG93X2ZpZWxkXTtcclxuXHRcdFx0XHRcdC8vIFx0fVxyXG5cdFx0XHRcdFx0Ly8gfVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0aWYgKGZtLndvcmtmbG93X2ZpZWxkLnN0YXJ0c1dpdGgoJ2luc3RhbmNlLicpKSB7XHJcblx0XHRcdFx0XHR2YXIgaW5zRmllbGQgPSBmbS53b3JrZmxvd19maWVsZC5zcGxpdCgnaW5zdGFuY2UuJylbMV07XHJcblx0XHRcdFx0XHRpZiAoc2VsZi5zeW5jSW5zRmllbGRzLmluY2x1ZGVzKGluc0ZpZWxkKSkge1xyXG5cdFx0XHRcdFx0XHRpZiAoZm0ub2JqZWN0X2ZpZWxkLmluZGV4T2YoJy4nKSA8IDApIHtcclxuXHRcdFx0XHRcdFx0XHRvYmpbZm0ub2JqZWN0X2ZpZWxkXSA9IGluc1tpbnNGaWVsZF07XHJcblx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0dmFyIHRlbU9iakZpZWxkcyA9IGZtLm9iamVjdF9maWVsZC5zcGxpdCgnLicpO1xyXG5cdFx0XHRcdFx0XHRcdGlmICh0ZW1PYmpGaWVsZHMubGVuZ3RoID09PSAyKSB7XHJcblx0XHRcdFx0XHRcdFx0XHR2YXIgb2JqRmllbGQgPSB0ZW1PYmpGaWVsZHNbMF07XHJcblx0XHRcdFx0XHRcdFx0XHR2YXIgcmVmZXJPYmpGaWVsZCA9IHRlbU9iakZpZWxkc1sxXTtcclxuXHRcdFx0XHRcdFx0XHRcdHZhciBvRmllbGQgPSBvYmplY3RGaWVsZHNbb2JqRmllbGRdO1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKCFvRmllbGQubXVsdGlwbGUgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKG9GaWVsZC50eXBlKSAmJiBfLmlzU3RyaW5nKG9GaWVsZC5yZWZlcmVuY2VfdG8pKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHZhciBvQ29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvRmllbGQucmVmZXJlbmNlX3RvLCBzcGFjZUlkKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAob0NvbGxlY3Rpb24gJiYgcmVjb3JkICYmIHJlY29yZFtvYmpGaWVsZF0pIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR2YXIgcmVmZXJTZXRPYmogPSB7fTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZWZlclNldE9ialtyZWZlck9iakZpZWxkXSA9IGluc1tpbnNGaWVsZF07XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0b0NvbGxlY3Rpb24udXBkYXRlKHJlY29yZFtvYmpGaWVsZF0sIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdCRzZXQ6IHJlZmVyU2V0T2JqXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0aWYgKGluc1tmbS53b3JrZmxvd19maWVsZF0pIHtcclxuXHRcdFx0XHRcdFx0b2JqW2ZtLm9iamVjdF9maWVsZF0gPSBpbnNbZm0ud29ya2Zsb3dfZmllbGRdO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHJcblx0XHRfLnVuaXEodGFibGVGaWVsZENvZGVzKS5mb3JFYWNoKGZ1bmN0aW9uICh0ZmMpIHtcclxuXHRcdFx0dmFyIGMgPSBKU09OLnBhcnNlKHRmYyk7XHJcblx0XHRcdG9ialtjLm9iamVjdF90YWJsZV9maWVsZF9jb2RlXSA9IFtdO1xyXG5cdFx0XHR2YWx1ZXNbYy53b3JrZmxvd190YWJsZV9maWVsZF9jb2RlXS5mb3JFYWNoKGZ1bmN0aW9uICh0cikge1xyXG5cdFx0XHRcdHZhciBuZXdUciA9IHt9O1xyXG5cdFx0XHRcdF8uZWFjaCh0ciwgZnVuY3Rpb24gKHYsIGspIHtcclxuXHRcdFx0XHRcdHRhYmxlRmllbGRNYXAuZm9yRWFjaChmdW5jdGlvbiAodGZtKSB7XHJcblx0XHRcdFx0XHRcdGlmICh0Zm0ud29ya2Zsb3dfZmllbGQgPT0gKGMud29ya2Zsb3dfdGFibGVfZmllbGRfY29kZSArICcuJC4nICsgaykpIHtcclxuXHRcdFx0XHRcdFx0XHR2YXIgb1RkQ29kZSA9IHRmbS5vYmplY3RfZmllbGQuc3BsaXQoJy4kLicpWzFdO1xyXG5cdFx0XHRcdFx0XHRcdG5ld1RyW29UZENvZGVdID0gdjtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHRcdGlmICghXy5pc0VtcHR5KG5ld1RyKSkge1xyXG5cdFx0XHRcdFx0b2JqW2Mub2JqZWN0X3RhYmxlX2ZpZWxkX2NvZGVdLnB1c2gobmV3VHIpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHRcdH0pO1xyXG5cdFx0dmFyIHJlbGF0ZWRPYmpzID0ge307XHJcblx0XHR2YXIgZ2V0UmVsYXRlZEZpZWxkVmFsdWUgPSBmdW5jdGlvbih2YWx1ZUtleSwgcGFyZW50KSB7XHJcblx0XHRcdHJldHVybiB2YWx1ZUtleS5zcGxpdCgnLicpLnJlZHVjZShmdW5jdGlvbihvLCB4KSB7XHJcblx0XHRcdFx0cmV0dXJuIG9beF07XHJcblx0XHRcdH0sIHBhcmVudCk7XHJcblx0XHR9O1xyXG5cdFx0Xy5lYWNoKHRhYmxlVG9SZWxhdGVkTWFwLCBmdW5jdGlvbihtYXAsIGtleSl7XHJcblx0XHRcdHZhciB0YWJsZUNvZGUgPSBtYXAuX0ZST01fVEFCTEVfQ09ERTtcclxuXHRcdFx0aWYoIXRhYmxlQ29kZSl7XHJcblx0XHRcdFx0Y29uc29sZS53YXJuKCd0YWJsZVRvUmVsYXRlZDogWycgKyBrZXkgKyAnXSBtaXNzaW5nIGNvcnJlc3BvbmRpbmcgdGFibGUuJylcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0dmFyIHJlbGF0ZWRPYmplY3ROYW1lID0ga2V5O1xyXG5cdFx0XHRcdHZhciByZWxhdGVkT2JqZWN0VmFsdWVzID0gW107XHJcblx0XHRcdFx0dmFyIHJlbGF0ZWRPYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChyZWxhdGVkT2JqZWN0TmFtZSwgc3BhY2VJZCk7XHJcblx0XHRcdFx0Xy5lYWNoKHZhbHVlc1t0YWJsZUNvZGVdLCBmdW5jdGlvbiAodGFibGVWYWx1ZUl0ZW0pIHtcclxuXHRcdFx0XHRcdHZhciByZWxhdGVkT2JqZWN0VmFsdWUgPSB7fTtcclxuXHRcdFx0XHRcdF8uZWFjaChtYXAsIGZ1bmN0aW9uKHZhbHVlS2V5LCBmaWVsZEtleSl7XHJcblx0XHRcdFx0XHRcdGlmKGZpZWxkS2V5ICE9ICdfRlJPTV9UQUJMRV9DT0RFJyl7XHJcblx0XHRcdFx0XHRcdFx0aWYodmFsdWVLZXkuc3RhcnRzV2l0aCgnaW5zdGFuY2UuJykpe1xyXG5cdFx0XHRcdFx0XHRcdFx0cmVsYXRlZE9iamVjdFZhbHVlW2ZpZWxkS2V5XSA9IGdldFJlbGF0ZWRGaWVsZFZhbHVlKHZhbHVlS2V5LCB7J2luc3RhbmNlJzogaW5zfSk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdGVsc2V7XHJcblx0XHRcdFx0XHRcdFx0XHR2YXIgcmVsYXRlZE9iamVjdEZpZWxkVmFsdWUsIGZvcm1GaWVsZEtleTtcclxuXHRcdFx0XHRcdFx0XHRcdGlmKHZhbHVlS2V5LnN0YXJ0c1dpdGgodGFibGVDb2RlICsgJy4nKSl7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGZvcm1GaWVsZEtleSA9IHZhbHVlS2V5LnNwbGl0KFwiLlwiKVsxXTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0cmVsYXRlZE9iamVjdEZpZWxkVmFsdWUgPSBnZXRSZWxhdGVkRmllbGRWYWx1ZSh2YWx1ZUtleSwge1t0YWJsZUNvZGVdOnRhYmxlVmFsdWVJdGVtfSk7XHJcblx0XHRcdFx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0XHRcdFx0Zm9ybUZpZWxkS2V5ID0gdmFsdWVLZXk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHJlbGF0ZWRPYmplY3RGaWVsZFZhbHVlID0gZ2V0UmVsYXRlZEZpZWxkVmFsdWUodmFsdWVLZXksIHZhbHVlcylcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdHZhciBmb3JtRmllbGQgPSBnZXRGb3JtRmllbGQoZm9ybUZpZWxkcywgZm9ybUZpZWxkS2V5KTtcclxuXHRcdFx0XHRcdFx0XHRcdHZhciByZWxhdGVkT2JqZWN0RmllbGQgPSByZWxhdGVkT2JqZWN0LmZpZWxkc1tmaWVsZEtleV07XHJcblx0XHRcdFx0XHRcdFx0XHRpZihmb3JtRmllbGQudHlwZSA9PSAnb2RhdGEnICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhyZWxhdGVkT2JqZWN0RmllbGQudHlwZSkpe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZighXy5pc0VtcHR5KHJlbGF0ZWRPYmplY3RGaWVsZFZhbHVlKSl7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYocmVsYXRlZE9iamVjdEZpZWxkLm11bHRpcGxlICYmIGZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCl7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZWxhdGVkT2JqZWN0RmllbGRWYWx1ZSA9IF8uY29tcGFjdChfLnBsdWNrKHJlbGF0ZWRPYmplY3RGaWVsZFZhbHVlLCAnX2lkJykpXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fWVsc2UgaWYoIXJlbGF0ZWRPYmplY3RGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KXtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJlbGF0ZWRPYmplY3RGaWVsZFZhbHVlID0gcmVsYXRlZE9iamVjdEZpZWxkVmFsdWUuX2lkXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRyZWxhdGVkT2JqZWN0VmFsdWVbZmllbGRLZXldID0gcmVsYXRlZE9iamVjdEZpZWxkVmFsdWU7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdHJlbGF0ZWRPYmplY3RWYWx1ZVsnX3RhYmxlJ10gPSB7XHJcblx0XHRcdFx0XHRcdF9pZDogdGFibGVWYWx1ZUl0ZW1bXCJfaWRcIl0sXHJcblx0XHRcdFx0XHRcdF9jb2RlOiB0YWJsZUNvZGVcclxuXHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRyZWxhdGVkT2JqZWN0VmFsdWVzLnB1c2gocmVsYXRlZE9iamVjdFZhbHVlKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRyZWxhdGVkT2Jqc1tyZWxhdGVkT2JqZWN0TmFtZV0gPSByZWxhdGVkT2JqZWN0VmFsdWVzO1xyXG5cdFx0XHR9XHJcblx0XHR9KVxyXG5cclxuXHRcdGlmIChmaWVsZF9tYXBfYmFja19zY3JpcHQpIHtcclxuXHRcdFx0Xy5leHRlbmQob2JqLCBzZWxmLmV2YWxGaWVsZE1hcEJhY2tTY3JpcHQoZmllbGRfbWFwX2JhY2tfc2NyaXB0LCBpbnMpKTtcclxuXHRcdH1cclxuXHRcdC8vIOi/h+a7pOaOiemdnuazleeahGtleVxyXG5cdFx0dmFyIGZpbHRlck9iaiA9IHt9O1xyXG5cclxuXHRcdF8uZWFjaChfLmtleXMob2JqKSwgZnVuY3Rpb24gKGspIHtcclxuXHRcdFx0aWYgKG9iamVjdEZpZWxkS2V5cy5pbmNsdWRlcyhrKSkge1xyXG5cdFx0XHRcdGZpbHRlck9ialtrXSA9IG9ialtrXTtcclxuXHRcdFx0fVxyXG5cdFx0XHQvLyBlbHNlIGlmKHJlbGF0ZWRPYmplY3RzS2V5cy5pbmNsdWRlcyhrKSAmJiBfLmlzQXJyYXkob2JqW2tdKSl7XHJcblx0XHRcdC8vIFx0aWYoXy5pc0FycmF5KHJlbGF0ZWRPYmpzW2tdKSl7XHJcblx0XHRcdC8vIFx0XHRyZWxhdGVkT2Jqc1trXSA9IHJlbGF0ZWRPYmpzW2tdLmNvbmNhdChvYmpba10pXHJcblx0XHRcdC8vIFx0fWVsc2V7XHJcblx0XHRcdC8vIFx0XHRyZWxhdGVkT2Jqc1trXSA9IG9ialtrXVxyXG5cdFx0XHQvLyBcdH1cclxuXHRcdFx0Ly8gfVxyXG5cdFx0fSlcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdG1haW5PYmplY3RWYWx1ZTogZmlsdGVyT2JqLFxyXG5cdFx0XHRyZWxhdGVkT2JqZWN0c1ZhbHVlOiByZWxhdGVkT2Jqc1xyXG5cdFx0fTtcclxuXHR9XHJcblxyXG5cdHNlbGYuZXZhbEZpZWxkTWFwQmFja1NjcmlwdCA9IGZ1bmN0aW9uIChmaWVsZF9tYXBfYmFja19zY3JpcHQsIGlucykge1xyXG5cdFx0dmFyIHNjcmlwdCA9IFwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHsgXCIgKyBmaWVsZF9tYXBfYmFja19zY3JpcHQgKyBcIiB9XCI7XHJcblx0XHR2YXIgZnVuYyA9IF9ldmFsKHNjcmlwdCwgXCJmaWVsZF9tYXBfc2NyaXB0XCIpO1xyXG5cdFx0dmFyIHZhbHVlcyA9IGZ1bmMoaW5zKTtcclxuXHRcdGlmIChfLmlzT2JqZWN0KHZhbHVlcykpIHtcclxuXHRcdFx0cmV0dXJuIHZhbHVlcztcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGNvbnNvbGUuZXJyb3IoXCJldmFsRmllbGRNYXBCYWNrU2NyaXB0OiDohJrmnKzov5Tlm57lgLznsbvlnovkuI3mmK/lr7nosaFcIik7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4ge31cclxuXHR9XHJcblxyXG5cdHNlbGYuc3luY1JlbGF0ZWRPYmplY3RzVmFsdWUgPSBmdW5jdGlvbihtYWluUmVjb3JkSWQsIHJlbGF0ZWRPYmplY3RzLCByZWxhdGVkT2JqZWN0c1ZhbHVlLCBzcGFjZUlkLCBpbnMpe1xyXG5cdFx0dmFyIGluc0lkID0gaW5zLl9pZDtcclxuXHJcblx0XHRfLmVhY2gocmVsYXRlZE9iamVjdHMsIGZ1bmN0aW9uKHJlbGF0ZWRPYmplY3Qpe1xyXG5cdFx0XHR2YXIgb2JqZWN0Q29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWxhdGVkT2JqZWN0Lm9iamVjdF9uYW1lLCBzcGFjZUlkKTtcclxuXHRcdFx0dmFyIHRhYmxlTWFwID0ge307XHJcblx0XHRcdF8uZWFjaChyZWxhdGVkT2JqZWN0c1ZhbHVlW3JlbGF0ZWRPYmplY3Qub2JqZWN0X25hbWVdLCBmdW5jdGlvbihyZWxhdGVkT2JqZWN0VmFsdWUpe1xyXG5cdFx0XHRcdHZhciB0YWJsZV9pZCA9IHJlbGF0ZWRPYmplY3RWYWx1ZS5fdGFibGUuX2lkO1xyXG5cdFx0XHRcdHZhciB0YWJsZV9jb2RlID0gcmVsYXRlZE9iamVjdFZhbHVlLl90YWJsZS5fY29kZTtcclxuXHRcdFx0XHRpZighdGFibGVNYXBbdGFibGVfY29kZV0pe1xyXG5cdFx0XHRcdFx0dGFibGVNYXBbdGFibGVfY29kZV0gPSBbXVxyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0dGFibGVNYXBbdGFibGVfY29kZV0ucHVzaCh0YWJsZV9pZCk7XHJcblx0XHRcdFx0dmFyIG9sZFJlbGF0ZWRSZWNvcmQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVsYXRlZE9iamVjdC5vYmplY3RfbmFtZSwgc3BhY2VJZCkuZmluZE9uZSh7W3JlbGF0ZWRPYmplY3QuZm9yZWlnbl9rZXldOiBtYWluUmVjb3JkSWQsIFwiaW5zdGFuY2VzLl9pZFwiOiBpbnNJZCwgX3RhYmxlOiByZWxhdGVkT2JqZWN0VmFsdWUuX3RhYmxlfSwge2ZpZWxkczoge19pZDoxfX0pXHJcblx0XHRcdFx0aWYob2xkUmVsYXRlZFJlY29yZCl7XHJcblx0XHRcdFx0XHRDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVsYXRlZE9iamVjdC5vYmplY3RfbmFtZSwgc3BhY2VJZCkudXBkYXRlKHtfaWQ6IG9sZFJlbGF0ZWRSZWNvcmQuX2lkfSwgeyRzZXQ6IHJlbGF0ZWRPYmplY3RWYWx1ZX0pXHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRyZWxhdGVkT2JqZWN0VmFsdWVbcmVsYXRlZE9iamVjdC5mb3JlaWduX2tleV0gPSBtYWluUmVjb3JkSWQ7XHJcblx0XHRcdFx0XHRyZWxhdGVkT2JqZWN0VmFsdWUuc3BhY2UgPSBzcGFjZUlkO1xyXG5cdFx0XHRcdFx0cmVsYXRlZE9iamVjdFZhbHVlLm93bmVyID0gaW5zLmFwcGxpY2FudDtcclxuXHRcdFx0XHRcdHJlbGF0ZWRPYmplY3RWYWx1ZS5jcmVhdGVkX2J5ID0gaW5zLmFwcGxpY2FudDtcclxuXHRcdFx0XHRcdHJlbGF0ZWRPYmplY3RWYWx1ZS5tb2RpZmllZF9ieSA9IGlucy5hcHBsaWNhbnQ7XHJcblx0XHRcdFx0XHRyZWxhdGVkT2JqZWN0VmFsdWUuX2lkID0gb2JqZWN0Q29sbGVjdGlvbi5fbWFrZU5ld0lEKCk7XHJcblx0XHRcdFx0XHR2YXIgaW5zdGFuY2Vfc3RhdGUgPSBpbnMuc3RhdGU7XHJcblx0XHRcdFx0XHRpZiAoaW5zLnN0YXRlID09PSAnY29tcGxldGVkJyAmJiBpbnMuZmluYWxfZGVjaXNpb24pIHtcclxuXHRcdFx0XHRcdFx0aW5zdGFuY2Vfc3RhdGUgPSBpbnMuZmluYWxfZGVjaXNpb247XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRyZWxhdGVkT2JqZWN0VmFsdWUuaW5zdGFuY2VzID0gW3tcclxuXHRcdFx0XHRcdFx0X2lkOiBpbnNJZCxcclxuXHRcdFx0XHRcdFx0c3RhdGU6IGluc3RhbmNlX3N0YXRlXHJcblx0XHRcdFx0XHR9XTtcclxuXHRcdFx0XHRcdHJlbGF0ZWRPYmplY3RWYWx1ZS5pbnN0YW5jZV9zdGF0ZSA9IGluc3RhbmNlX3N0YXRlO1xyXG5cdFx0XHRcdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlbGF0ZWRPYmplY3Qub2JqZWN0X25hbWUsIHNwYWNlSWQpLmluc2VydChyZWxhdGVkT2JqZWN0VmFsdWUsIHt2YWxpZGF0ZTogZmFsc2UsIGZpbHRlcjogZmFsc2V9KVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHRcdFx0Ly/muIXnkIbnlLPor7fljZXkuIrooqvliKDpmaTlrZDooajorrDlvZXlr7nlupTnmoTnm7jlhbPooajorrDlvZVcclxuXHRcdFx0Xy5lYWNoKHRhYmxlTWFwLCBmdW5jdGlvbih0YWJsZUlkcywgdGFibGVDb2RlKXtcclxuXHRcdFx0XHRvYmplY3RDb2xsZWN0aW9uLnJlbW92ZSh7XHJcblx0XHRcdFx0XHRbcmVsYXRlZE9iamVjdC5mb3JlaWduX2tleV06IG1haW5SZWNvcmRJZCxcclxuXHRcdFx0XHRcdFwiaW5zdGFuY2VzLl9pZFwiOiBpbnNJZCxcclxuXHRcdFx0XHRcdFwiX3RhYmxlLl9jb2RlXCI6IHRhYmxlQ29kZSxcclxuXHRcdFx0XHRcdFwiX3RhYmxlLl9pZFwiOiB7JG5pbjogdGFibGVJZHN9XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0fSlcclxuXHRcdH0pO1xyXG5cclxuXHRcdHRhYmxlSWRzID0gXy5jb21wYWN0KHRhYmxlSWRzKTtcclxuXHJcblxyXG5cdH1cclxuXHJcblx0c2VsZi5zZW5kRG9jID0gZnVuY3Rpb24gKGRvYykge1xyXG5cdFx0aWYgKEluc3RhbmNlUmVjb3JkUXVldWUuZGVidWcpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coXCJzZW5kRG9jXCIpO1xyXG5cdFx0XHRjb25zb2xlLmxvZyhkb2MpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBpbnNJZCA9IGRvYy5pbmZvLmluc3RhbmNlX2lkLFxyXG5cdFx0XHRyZWNvcmRzID0gZG9jLmluZm8ucmVjb3JkcztcclxuXHRcdHZhciBmaWVsZHMgPSB7XHJcblx0XHRcdGZsb3c6IDEsXHJcblx0XHRcdHZhbHVlczogMSxcclxuXHRcdFx0YXBwbGljYW50OiAxLFxyXG5cdFx0XHRzcGFjZTogMSxcclxuXHRcdFx0Zm9ybTogMSxcclxuXHRcdFx0Zm9ybV92ZXJzaW9uOiAxLFxyXG5cdFx0XHR0cmFjZXM6IDFcclxuXHRcdH07XHJcblx0XHRzZWxmLnN5bmNJbnNGaWVsZHMuZm9yRWFjaChmdW5jdGlvbiAoZikge1xyXG5cdFx0XHRmaWVsZHNbZl0gPSAxO1xyXG5cdFx0fSlcclxuXHRcdHZhciBpbnMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2luc3RhbmNlcycpLmZpbmRPbmUoaW5zSWQsIHtcclxuXHRcdFx0ZmllbGRzOiBmaWVsZHNcclxuXHRcdH0pO1xyXG5cdFx0dmFyIHZhbHVlcyA9IGlucy52YWx1ZXMsXHJcblx0XHRcdHNwYWNlSWQgPSBpbnMuc3BhY2U7XHJcblxyXG5cdFx0aWYgKHJlY29yZHMgJiYgIV8uaXNFbXB0eShyZWNvcmRzKSkge1xyXG5cdFx0XHQvLyDmraTmg4XlhrXlsZ7kuo7ku45jcmVhdG9y5Lit5Y+R6LW35a6h5om577yM5oiW6ICF5bey57uP5LuOQXBwc+WQjOatpeWIsOS6hmNyZWF0b3JcclxuXHRcdFx0dmFyIG9iamVjdE5hbWUgPSByZWNvcmRzWzBdLm87XHJcblx0XHRcdHZhciBvdyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignb2JqZWN0X3dvcmtmbG93cycpLmZpbmRPbmUoe1xyXG5cdFx0XHRcdG9iamVjdF9uYW1lOiBvYmplY3ROYW1lLFxyXG5cdFx0XHRcdGZsb3dfaWQ6IGlucy5mbG93XHJcblx0XHRcdH0pO1xyXG5cdFx0XHR2YXJcclxuXHRcdFx0XHRvYmplY3RDb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdE5hbWUsIHNwYWNlSWQpLFxyXG5cdFx0XHRcdHN5bmNfYXR0YWNobWVudCA9IG93LnN5bmNfYXR0YWNobWVudDtcclxuXHRcdFx0dmFyIG9iamVjdEluZm8gPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3ROYW1lLCBzcGFjZUlkKTtcclxuXHRcdFx0b2JqZWN0Q29sbGVjdGlvbi5maW5kKHtcclxuXHRcdFx0XHRfaWQ6IHtcclxuXHRcdFx0XHRcdCRpbjogcmVjb3Jkc1swXS5pZHNcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pLmZvckVhY2goZnVuY3Rpb24gKHJlY29yZCkge1xyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHR2YXIgc3luY1ZhbHVlcyA9IHNlbGYuc3luY1ZhbHVlcyhvdy5maWVsZF9tYXBfYmFjaywgdmFsdWVzLCBpbnMsIG9iamVjdEluZm8sIG93LmZpZWxkX21hcF9iYWNrX3NjcmlwdCwgcmVjb3JkKVxyXG5cdFx0XHRcdFx0dmFyIHNldE9iaiA9IHN5bmNWYWx1ZXMubWFpbk9iamVjdFZhbHVlO1xyXG5cclxuXHRcdFx0XHRcdHZhciBpbnN0YW5jZV9zdGF0ZSA9IGlucy5zdGF0ZTtcclxuXHRcdFx0XHRcdGlmIChpbnMuc3RhdGUgPT09ICdjb21wbGV0ZWQnICYmIGlucy5maW5hbF9kZWNpc2lvbikge1xyXG5cdFx0XHRcdFx0XHRpbnN0YW5jZV9zdGF0ZSA9IGlucy5maW5hbF9kZWNpc2lvbjtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHNldE9ialsnaW5zdGFuY2VzLiQuc3RhdGUnXSA9IHNldE9iai5pbnN0YW5jZV9zdGF0ZSA9IGluc3RhbmNlX3N0YXRlO1xyXG5cclxuXHRcdFx0XHRcdG9iamVjdENvbGxlY3Rpb24udXBkYXRlKHtcclxuXHRcdFx0XHRcdFx0X2lkOiByZWNvcmQuX2lkLFxyXG5cdFx0XHRcdFx0XHQnaW5zdGFuY2VzLl9pZCc6IGluc0lkXHJcblx0XHRcdFx0XHR9LCB7XHJcblx0XHRcdFx0XHRcdCRzZXQ6IHNldE9ialxyXG5cdFx0XHRcdFx0fSlcclxuXHJcblx0XHRcdFx0XHR2YXIgcmVsYXRlZE9iamVjdHMgPSBDcmVhdG9yLmdldFJlbGF0ZWRPYmplY3RzKG93Lm9iamVjdF9uYW1lLCBzcGFjZUlkKTtcclxuXHRcdFx0XHRcdHZhciByZWxhdGVkT2JqZWN0c1ZhbHVlID0gc3luY1ZhbHVlcy5yZWxhdGVkT2JqZWN0c1ZhbHVlO1xyXG5cdFx0XHRcdFx0c2VsZi5zeW5jUmVsYXRlZE9iamVjdHNWYWx1ZShyZWNvcmQuX2lkLCByZWxhdGVkT2JqZWN0cywgcmVsYXRlZE9iamVjdHNWYWx1ZSwgc3BhY2VJZCwgaW5zKTtcclxuXHJcblxyXG5cdFx0XHRcdFx0Ly8g5Lul5pyA57uI55Sz6K+35Y2V6ZmE5Lu25Li65YeG77yM5pen55qEcmVjb3Jk5Lit6ZmE5Lu25Yig6ZmkXHJcblx0XHRcdFx0XHRDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2Ntc19maWxlcycpLnJlbW92ZSh7XHJcblx0XHRcdFx0XHRcdCdwYXJlbnQnOiB7XHJcblx0XHRcdFx0XHRcdFx0bzogb2JqZWN0TmFtZSxcclxuXHRcdFx0XHRcdFx0XHRpZHM6IFtyZWNvcmQuX2lkXVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0Y2ZzLmZpbGVzLnJlbW92ZSh7XHJcblx0XHRcdFx0XHRcdCdtZXRhZGF0YS5yZWNvcmRfaWQnOiByZWNvcmQuX2lkXHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0Ly8g5ZCM5q2l5paw6ZmE5Lu2XHJcblx0XHRcdFx0XHRzZWxmLnN5bmNBdHRhY2goc3luY19hdHRhY2htZW50LCBpbnNJZCwgcmVjb3JkLnNwYWNlLCByZWNvcmQuX2lkLCBvYmplY3ROYW1lKTtcclxuXHRcdFx0XHR9IGNhdGNoIChlcnJvcikge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvcihlcnJvci5zdGFjayk7XHJcblx0XHRcdFx0XHRvYmplY3RDb2xsZWN0aW9uLnVwZGF0ZSh7XHJcblx0XHRcdFx0XHRcdF9pZDogcmVjb3JkLl9pZCxcclxuXHRcdFx0XHRcdFx0J2luc3RhbmNlcy5faWQnOiBpbnNJZFxyXG5cdFx0XHRcdFx0fSwge1xyXG5cdFx0XHRcdFx0XHQkc2V0OiB7XHJcblx0XHRcdFx0XHRcdFx0J2luc3RhbmNlcy4kLnN0YXRlJzogJ3BlbmRpbmcnLFxyXG5cdFx0XHRcdFx0XHRcdCdpbnN0YW5jZV9zdGF0ZSc6ICdwZW5kaW5nJ1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KVxyXG5cclxuXHRcdFx0XHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbignY21zX2ZpbGVzJykucmVtb3ZlKHtcclxuXHRcdFx0XHRcdFx0J3BhcmVudCc6IHtcclxuXHRcdFx0XHRcdFx0XHRvOiBvYmplY3ROYW1lLFxyXG5cdFx0XHRcdFx0XHRcdGlkczogW3JlY29yZC5faWRdXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHRjZnMuZmlsZXMucmVtb3ZlKHtcclxuXHRcdFx0XHRcdFx0J21ldGFkYXRhLnJlY29yZF9pZCc6IHJlY29yZC5faWRcclxuXHRcdFx0XHRcdH0pXHJcblxyXG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGVycm9yKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHR9KVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Ly8g5q2k5oOF5Ya15bGe5LqO5LuOYXBwc+S4reWPkei1t+WuoeaJuVxyXG5cdFx0XHRDcmVhdG9yLmdldENvbGxlY3Rpb24oJ29iamVjdF93b3JrZmxvd3MnKS5maW5kKHtcclxuXHRcdFx0XHRmbG93X2lkOiBpbnMuZmxvd1xyXG5cdFx0XHR9KS5mb3JFYWNoKGZ1bmN0aW9uIChvdykge1xyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHR2YXJcclxuXHRcdFx0XHRcdFx0b2JqZWN0Q29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvdy5vYmplY3RfbmFtZSwgc3BhY2VJZCksXHJcblx0XHRcdFx0XHRcdHN5bmNfYXR0YWNobWVudCA9IG93LnN5bmNfYXR0YWNobWVudCxcclxuXHRcdFx0XHRcdFx0bmV3UmVjb3JkSWQgPSBvYmplY3RDb2xsZWN0aW9uLl9tYWtlTmV3SUQoKSxcclxuXHRcdFx0XHRcdFx0b2JqZWN0TmFtZSA9IG93Lm9iamVjdF9uYW1lO1xyXG5cclxuXHRcdFx0XHRcdHZhciBvYmplY3RJbmZvID0gQ3JlYXRvci5nZXRPYmplY3Qob3cub2JqZWN0X25hbWUsIHNwYWNlSWQpO1xyXG5cdFx0XHRcdFx0dmFyIHN5bmNWYWx1ZXMgPSBzZWxmLnN5bmNWYWx1ZXMob3cuZmllbGRfbWFwX2JhY2ssIHZhbHVlcywgaW5zLCBvYmplY3RJbmZvLCBvdy5maWVsZF9tYXBfYmFja19zY3JpcHQpO1xyXG5cdFx0XHRcdFx0dmFyIG5ld09iaiA9IHN5bmNWYWx1ZXMubWFpbk9iamVjdFZhbHVlO1xyXG5cclxuXHRcdFx0XHRcdG5ld09iai5faWQgPSBuZXdSZWNvcmRJZDtcclxuXHRcdFx0XHRcdG5ld09iai5zcGFjZSA9IHNwYWNlSWQ7XHJcblx0XHRcdFx0XHRuZXdPYmoubmFtZSA9IG5ld09iai5uYW1lIHx8IGlucy5uYW1lO1xyXG5cclxuXHRcdFx0XHRcdHZhciBpbnN0YW5jZV9zdGF0ZSA9IGlucy5zdGF0ZTtcclxuXHRcdFx0XHRcdGlmIChpbnMuc3RhdGUgPT09ICdjb21wbGV0ZWQnICYmIGlucy5maW5hbF9kZWNpc2lvbikge1xyXG5cdFx0XHRcdFx0XHRpbnN0YW5jZV9zdGF0ZSA9IGlucy5maW5hbF9kZWNpc2lvbjtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdG5ld09iai5pbnN0YW5jZXMgPSBbe1xyXG5cdFx0XHRcdFx0XHRfaWQ6IGluc0lkLFxyXG5cdFx0XHRcdFx0XHRzdGF0ZTogaW5zdGFuY2Vfc3RhdGVcclxuXHRcdFx0XHRcdH1dO1xyXG5cdFx0XHRcdFx0bmV3T2JqLmluc3RhbmNlX3N0YXRlID0gaW5zdGFuY2Vfc3RhdGU7XHJcblxyXG5cdFx0XHRcdFx0bmV3T2JqLm93bmVyID0gaW5zLmFwcGxpY2FudDtcclxuXHRcdFx0XHRcdG5ld09iai5jcmVhdGVkX2J5ID0gaW5zLmFwcGxpY2FudDtcclxuXHRcdFx0XHRcdG5ld09iai5tb2RpZmllZF9ieSA9IGlucy5hcHBsaWNhbnQ7XHJcblx0XHRcdFx0XHR2YXIgciA9IG9iamVjdENvbGxlY3Rpb24uaW5zZXJ0KG5ld09iaik7XHJcblx0XHRcdFx0XHRpZiAocikge1xyXG5cdFx0XHRcdFx0XHRDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2luc3RhbmNlcycpLnVwZGF0ZShpbnMuX2lkLCB7XHJcblx0XHRcdFx0XHRcdFx0JHB1c2g6IHtcclxuXHRcdFx0XHRcdFx0XHRcdHJlY29yZF9pZHM6IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0bzogb2JqZWN0TmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWRzOiBbbmV3UmVjb3JkSWRdXHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0XHR2YXIgcmVsYXRlZE9iamVjdHMgPSBDcmVhdG9yLmdldFJlbGF0ZWRPYmplY3RzKG93Lm9iamVjdF9uYW1lLHNwYWNlSWQpO1xyXG5cdFx0XHRcdFx0XHR2YXIgcmVsYXRlZE9iamVjdHNWYWx1ZSA9IHN5bmNWYWx1ZXMucmVsYXRlZE9iamVjdHNWYWx1ZTtcclxuXHRcdFx0XHRcdFx0c2VsZi5zeW5jUmVsYXRlZE9iamVjdHNWYWx1ZShuZXdSZWNvcmRJZCwgcmVsYXRlZE9iamVjdHMsIHJlbGF0ZWRPYmplY3RzVmFsdWUsIHNwYWNlSWQsIGlucyk7XHJcblx0XHRcdFx0XHRcdC8vIHdvcmtmbG936YeM5Y+R6LW35a6h5om55ZCO77yM5ZCM5q2l5pe25Lmf5Y+v5Lul5L+u5pS555u45YWz6KGo55qE5a2X5q615YC8ICMxMTgzXHJcblx0XHRcdFx0XHRcdHZhciByZWNvcmQgPSBvYmplY3RDb2xsZWN0aW9uLmZpbmRPbmUobmV3UmVjb3JkSWQpO1xyXG5cdFx0XHRcdFx0XHRzZWxmLnN5bmNWYWx1ZXMob3cuZmllbGRfbWFwX2JhY2ssIHZhbHVlcywgaW5zLCBvYmplY3RJbmZvLCBvdy5maWVsZF9tYXBfYmFja19zY3JpcHQsIHJlY29yZCk7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0Ly8g6ZmE5Lu25ZCM5q2lXHJcblx0XHRcdFx0XHRzZWxmLnN5bmNBdHRhY2goc3luY19hdHRhY2htZW50LCBpbnNJZCwgc3BhY2VJZCwgbmV3UmVjb3JkSWQsIG9iamVjdE5hbWUpO1xyXG5cclxuXHRcdFx0XHR9IGNhdGNoIChlcnJvcikge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvcihlcnJvci5zdGFjayk7XHJcblxyXG5cdFx0XHRcdFx0b2JqZWN0Q29sbGVjdGlvbi5yZW1vdmUoe1xyXG5cdFx0XHRcdFx0XHRfaWQ6IG5ld1JlY29yZElkLFxyXG5cdFx0XHRcdFx0XHRzcGFjZTogc3BhY2VJZFxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2luc3RhbmNlcycpLnVwZGF0ZShpbnMuX2lkLCB7XHJcblx0XHRcdFx0XHRcdCRwdWxsOiB7XHJcblx0XHRcdFx0XHRcdFx0cmVjb3JkX2lkczoge1xyXG5cdFx0XHRcdFx0XHRcdFx0bzogb2JqZWN0TmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdGlkczogW25ld1JlY29yZElkXVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbignY21zX2ZpbGVzJykucmVtb3ZlKHtcclxuXHRcdFx0XHRcdFx0J3BhcmVudCc6IHtcclxuXHRcdFx0XHRcdFx0XHRvOiBvYmplY3ROYW1lLFxyXG5cdFx0XHRcdFx0XHRcdGlkczogW25ld1JlY29yZElkXVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0Y2ZzLmZpbGVzLnJlbW92ZSh7XHJcblx0XHRcdFx0XHRcdCdtZXRhZGF0YS5yZWNvcmRfaWQnOiBuZXdSZWNvcmRJZFxyXG5cdFx0XHRcdFx0fSlcclxuXHJcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoZXJyb3IpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH0pXHJcblx0XHR9XHJcblxyXG5cdFx0SW5zdGFuY2VSZWNvcmRRdWV1ZS5jb2xsZWN0aW9uLnVwZGF0ZShkb2MuX2lkLCB7XHJcblx0XHRcdCRzZXQ6IHtcclxuXHRcdFx0XHQnaW5mby5zeW5jX2RhdGUnOiBuZXcgRGF0ZSgpXHJcblx0XHRcdH1cclxuXHRcdH0pXHJcblxyXG5cdH1cclxuXHJcblx0Ly8gVW5pdmVyc2FsIHNlbmQgZnVuY3Rpb25cclxuXHR2YXIgX3F1ZXJ5U2VuZCA9IGZ1bmN0aW9uIChkb2MpIHtcclxuXHJcblx0XHRpZiAoc2VsZi5zZW5kRG9jKSB7XHJcblx0XHRcdHNlbGYuc2VuZERvYyhkb2MpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGRvYzogW2RvYy5faWRdXHJcblx0XHR9O1xyXG5cdH07XHJcblxyXG5cdHNlbGYuc2VydmVyU2VuZCA9IGZ1bmN0aW9uIChkb2MpIHtcclxuXHRcdGRvYyA9IGRvYyB8fCB7fTtcclxuXHRcdHJldHVybiBfcXVlcnlTZW5kKGRvYyk7XHJcblx0fTtcclxuXHJcblxyXG5cdC8vIFRoaXMgaW50ZXJ2YWwgd2lsbCBhbGxvdyBvbmx5IG9uZSBkb2MgdG8gYmUgc2VudCBhdCBhIHRpbWUsIGl0XHJcblx0Ly8gd2lsbCBjaGVjayBmb3IgbmV3IGRvY3MgYXQgZXZlcnkgYG9wdGlvbnMuc2VuZEludGVydmFsYFxyXG5cdC8vIChkZWZhdWx0IGludGVydmFsIGlzIDE1MDAwIG1zKVxyXG5cdC8vXHJcblx0Ly8gSXQgbG9va3MgaW4gZG9jcyBjb2xsZWN0aW9uIHRvIHNlZSBpZiB0aGVyZXMgYW55IHBlbmRpbmdcclxuXHQvLyBkb2NzLCBpZiBzbyBpdCB3aWxsIHRyeSB0byByZXNlcnZlIHRoZSBwZW5kaW5nIGRvYy5cclxuXHQvLyBJZiBzdWNjZXNzZnVsbHkgcmVzZXJ2ZWQgdGhlIHNlbmQgaXMgc3RhcnRlZC5cclxuXHQvL1xyXG5cdC8vIElmIGRvYy5xdWVyeSBpcyB0eXBlIHN0cmluZywgaXQncyBhc3N1bWVkIHRvIGJlIGEganNvbiBzdHJpbmdcclxuXHQvLyB2ZXJzaW9uIG9mIHRoZSBxdWVyeSBzZWxlY3Rvci4gTWFraW5nIGl0IGFibGUgdG8gY2FycnkgYCRgIHByb3BlcnRpZXMgaW5cclxuXHQvLyB0aGUgbW9uZ28gY29sbGVjdGlvbi5cclxuXHQvL1xyXG5cdC8vIFByLiBkZWZhdWx0IGRvY3MgYXJlIHJlbW92ZWQgZnJvbSB0aGUgY29sbGVjdGlvbiBhZnRlciBzZW5kIGhhdmVcclxuXHQvLyBjb21wbGV0ZWQuIFNldHRpbmcgYG9wdGlvbnMua2VlcERvY3NgIHdpbGwgdXBkYXRlIGFuZCBrZWVwIHRoZVxyXG5cdC8vIGRvYyBlZy4gaWYgbmVlZGVkIGZvciBoaXN0b3JpY2FsIHJlYXNvbnMuXHJcblx0Ly9cclxuXHQvLyBBZnRlciB0aGUgc2VuZCBoYXZlIGNvbXBsZXRlZCBhIFwic2VuZFwiIGV2ZW50IHdpbGwgYmUgZW1pdHRlZCB3aXRoIGFcclxuXHQvLyBzdGF0dXMgb2JqZWN0IGNvbnRhaW5pbmcgZG9jIGlkIGFuZCB0aGUgc2VuZCByZXN1bHQgb2JqZWN0LlxyXG5cdC8vXHJcblx0dmFyIGlzU2VuZGluZ0RvYyA9IGZhbHNlO1xyXG5cclxuXHRpZiAob3B0aW9ucy5zZW5kSW50ZXJ2YWwgIT09IG51bGwpIHtcclxuXHJcblx0XHQvLyBUaGlzIHdpbGwgcmVxdWlyZSBpbmRleCBzaW5jZSB3ZSBzb3J0IGRvY3MgYnkgY3JlYXRlZEF0XHJcblx0XHRJbnN0YW5jZVJlY29yZFF1ZXVlLmNvbGxlY3Rpb24uX2Vuc3VyZUluZGV4KHtcclxuXHRcdFx0Y3JlYXRlZEF0OiAxXHJcblx0XHR9KTtcclxuXHRcdEluc3RhbmNlUmVjb3JkUXVldWUuY29sbGVjdGlvbi5fZW5zdXJlSW5kZXgoe1xyXG5cdFx0XHRzZW50OiAxXHJcblx0XHR9KTtcclxuXHRcdEluc3RhbmNlUmVjb3JkUXVldWUuY29sbGVjdGlvbi5fZW5zdXJlSW5kZXgoe1xyXG5cdFx0XHRzZW5kaW5nOiAxXHJcblx0XHR9KTtcclxuXHJcblxyXG5cdFx0dmFyIHNlbmREb2MgPSBmdW5jdGlvbiAoZG9jKSB7XHJcblx0XHRcdC8vIFJlc2VydmUgZG9jXHJcblx0XHRcdHZhciBub3cgPSArbmV3IERhdGUoKTtcclxuXHRcdFx0dmFyIHRpbWVvdXRBdCA9IG5vdyArIG9wdGlvbnMuc2VuZFRpbWVvdXQ7XHJcblx0XHRcdHZhciByZXNlcnZlZCA9IEluc3RhbmNlUmVjb3JkUXVldWUuY29sbGVjdGlvbi51cGRhdGUoe1xyXG5cdFx0XHRcdF9pZDogZG9jLl9pZCxcclxuXHRcdFx0XHRzZW50OiBmYWxzZSwgLy8geHh4OiBuZWVkIHRvIG1ha2Ugc3VyZSB0aGlzIGlzIHNldCBvbiBjcmVhdGVcclxuXHRcdFx0XHRzZW5kaW5nOiB7XHJcblx0XHRcdFx0XHQkbHQ6IG5vd1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdCRzZXQ6IHtcclxuXHRcdFx0XHRcdHNlbmRpbmc6IHRpbWVvdXRBdCxcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0Ly8gTWFrZSBzdXJlIHdlIG9ubHkgaGFuZGxlIGRvY3MgcmVzZXJ2ZWQgYnkgdGhpc1xyXG5cdFx0XHQvLyBpbnN0YW5jZVxyXG5cdFx0XHRpZiAocmVzZXJ2ZWQpIHtcclxuXHJcblx0XHRcdFx0Ly8gU2VuZFxyXG5cdFx0XHRcdHZhciByZXN1bHQgPSBJbnN0YW5jZVJlY29yZFF1ZXVlLnNlcnZlclNlbmQoZG9jKTtcclxuXHJcblx0XHRcdFx0aWYgKCFvcHRpb25zLmtlZXBEb2NzKSB7XHJcblx0XHRcdFx0XHQvLyBQci4gRGVmYXVsdCB3ZSB3aWxsIHJlbW92ZSBkb2NzXHJcblx0XHRcdFx0XHRJbnN0YW5jZVJlY29yZFF1ZXVlLmNvbGxlY3Rpb24ucmVtb3ZlKHtcclxuXHRcdFx0XHRcdFx0X2lkOiBkb2MuX2lkXHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cclxuXHRcdFx0XHRcdC8vIFVwZGF0ZVxyXG5cdFx0XHRcdFx0SW5zdGFuY2VSZWNvcmRRdWV1ZS5jb2xsZWN0aW9uLnVwZGF0ZSh7XHJcblx0XHRcdFx0XHRcdF9pZDogZG9jLl9pZFxyXG5cdFx0XHRcdFx0fSwge1xyXG5cdFx0XHRcdFx0XHQkc2V0OiB7XHJcblx0XHRcdFx0XHRcdFx0Ly8gTWFyayBhcyBzZW50XHJcblx0XHRcdFx0XHRcdFx0c2VudDogdHJ1ZSxcclxuXHRcdFx0XHRcdFx0XHQvLyBTZXQgdGhlIHNlbnQgZGF0ZVxyXG5cdFx0XHRcdFx0XHRcdHNlbnRBdDogbmV3IERhdGUoKSxcclxuXHRcdFx0XHRcdFx0XHQvLyBOb3QgYmVpbmcgc2VudCBhbnltb3JlXHJcblx0XHRcdFx0XHRcdFx0c2VuZGluZzogMFxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHQvLyAvLyBFbWl0IHRoZSBzZW5kXHJcblx0XHRcdFx0Ly8gc2VsZi5lbWl0KCdzZW5kJywge1xyXG5cdFx0XHRcdC8vIFx0ZG9jOiBkb2MuX2lkLFxyXG5cdFx0XHRcdC8vIFx0cmVzdWx0OiByZXN1bHRcclxuXHRcdFx0XHQvLyB9KTtcclxuXHJcblx0XHRcdH0gLy8gRWxzZSBjb3VsZCBub3QgcmVzZXJ2ZVxyXG5cdFx0fTsgLy8gRU8gc2VuZERvY1xyXG5cclxuXHRcdHNlbmRXb3JrZXIoZnVuY3Rpb24gKCkge1xyXG5cclxuXHRcdFx0aWYgKGlzU2VuZGluZ0RvYykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHQvLyBTZXQgc2VuZCBmZW5jZVxyXG5cdFx0XHRpc1NlbmRpbmdEb2MgPSB0cnVlO1xyXG5cclxuXHRcdFx0dmFyIGJhdGNoU2l6ZSA9IG9wdGlvbnMuc2VuZEJhdGNoU2l6ZSB8fCAxO1xyXG5cclxuXHRcdFx0dmFyIG5vdyA9ICtuZXcgRGF0ZSgpO1xyXG5cclxuXHRcdFx0Ly8gRmluZCBkb2NzIHRoYXQgYXJlIG5vdCBiZWluZyBvciBhbHJlYWR5IHNlbnRcclxuXHRcdFx0dmFyIHBlbmRpbmdEb2NzID0gSW5zdGFuY2VSZWNvcmRRdWV1ZS5jb2xsZWN0aW9uLmZpbmQoe1xyXG5cdFx0XHRcdCRhbmQ6IFtcclxuXHRcdFx0XHRcdC8vIE1lc3NhZ2UgaXMgbm90IHNlbnRcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0c2VudDogZmFsc2VcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHQvLyBBbmQgbm90IGJlaW5nIHNlbnQgYnkgb3RoZXIgaW5zdGFuY2VzXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdHNlbmRpbmc6IHtcclxuXHRcdFx0XHRcdFx0XHQkbHQ6IG5vd1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0Ly8gQW5kIG5vIGVycm9yXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdGVyck1zZzoge1xyXG5cdFx0XHRcdFx0XHRcdCRleGlzdHM6IGZhbHNlXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRdXHJcblx0XHRcdH0sIHtcclxuXHRcdFx0XHQvLyBTb3J0IGJ5IGNyZWF0ZWQgZGF0ZVxyXG5cdFx0XHRcdHNvcnQ6IHtcclxuXHRcdFx0XHRcdGNyZWF0ZWRBdDogMVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0bGltaXQ6IGJhdGNoU2l6ZVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdHBlbmRpbmdEb2NzLmZvckVhY2goZnVuY3Rpb24gKGRvYykge1xyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHRzZW5kRG9jKGRvYyk7XHJcblx0XHRcdFx0fSBjYXRjaCAoZXJyb3IpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoZXJyb3Iuc3RhY2spO1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ0luc3RhbmNlUmVjb3JkUXVldWU6IENvdWxkIG5vdCBzZW5kIGRvYyBpZDogXCInICsgZG9jLl9pZCArICdcIiwgRXJyb3I6ICcgKyBlcnJvci5tZXNzYWdlKTtcclxuXHRcdFx0XHRcdEluc3RhbmNlUmVjb3JkUXVldWUuY29sbGVjdGlvbi51cGRhdGUoe1xyXG5cdFx0XHRcdFx0XHRfaWQ6IGRvYy5faWRcclxuXHRcdFx0XHRcdH0sIHtcclxuXHRcdFx0XHRcdFx0JHNldDoge1xyXG5cdFx0XHRcdFx0XHRcdC8vIGVycm9yIG1lc3NhZ2VcclxuXHRcdFx0XHRcdFx0XHRlcnJNc2c6IGVycm9yLm1lc3NhZ2VcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTsgLy8gRU8gZm9yRWFjaFxyXG5cclxuXHRcdFx0Ly8gUmVtb3ZlIHRoZSBzZW5kIGZlbmNlXHJcblx0XHRcdGlzU2VuZGluZ0RvYyA9IGZhbHNlO1xyXG5cdFx0fSwgb3B0aW9ucy5zZW5kSW50ZXJ2YWwgfHwgMTUwMDApOyAvLyBEZWZhdWx0IGV2ZXJ5IDE1dGggc2VjXHJcblxyXG5cdH0gZWxzZSB7XHJcblx0XHRpZiAoSW5zdGFuY2VSZWNvcmRRdWV1ZS5kZWJ1Zykge1xyXG5cdFx0XHRjb25zb2xlLmxvZygnSW5zdGFuY2VSZWNvcmRRdWV1ZTogU2VuZCBzZXJ2ZXIgaXMgZGlzYWJsZWQnKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG59OyIsIk1ldGVvci5zdGFydHVwIC0+XHJcblx0aWYgTWV0ZW9yLnNldHRpbmdzLmNyb24/Lmluc3RhbmNlcmVjb3JkcXVldWVfaW50ZXJ2YWxcclxuXHRcdEluc3RhbmNlUmVjb3JkUXVldWUuQ29uZmlndXJlXHJcblx0XHRcdHNlbmRJbnRlcnZhbDogTWV0ZW9yLnNldHRpbmdzLmNyb24uaW5zdGFuY2VyZWNvcmRxdWV1ZV9pbnRlcnZhbFxyXG5cdFx0XHRzZW5kQmF0Y2hTaXplOiAxMFxyXG5cdFx0XHRrZWVwRG9jczogdHJ1ZVxyXG4iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgdmFyIHJlZjtcbiAgaWYgKChyZWYgPSBNZXRlb3Iuc2V0dGluZ3MuY3JvbikgIT0gbnVsbCA/IHJlZi5pbnN0YW5jZXJlY29yZHF1ZXVlX2ludGVydmFsIDogdm9pZCAwKSB7XG4gICAgcmV0dXJuIEluc3RhbmNlUmVjb3JkUXVldWUuQ29uZmlndXJlKHtcbiAgICAgIHNlbmRJbnRlcnZhbDogTWV0ZW9yLnNldHRpbmdzLmNyb24uaW5zdGFuY2VyZWNvcmRxdWV1ZV9pbnRlcnZhbCxcbiAgICAgIHNlbmRCYXRjaFNpemU6IDEwLFxuICAgICAga2VlcERvY3M6IHRydWVcbiAgICB9KTtcbiAgfVxufSk7XG4iLCJpbXBvcnQgeyBjaGVja05wbVZlcnNpb25zIH0gZnJvbSAnbWV0ZW9yL3RtZWFzZGF5OmNoZWNrLW5wbS12ZXJzaW9ucyc7XHJcbmNoZWNrTnBtVmVyc2lvbnMoe1xyXG5cdFwiZXZhbFwiOiBcIl4wLjEuMlwiXHJcbn0sICdzdGVlZG9zOmluc3RhbmNlLXJlY29yZC1xdWV1ZScpO1xyXG4iXX0=
