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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczppbnN0YW5jZS1yZWNvcmQtcXVldWUvbGliL2NvbW1vbi9tYWluLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmluc3RhbmNlLXJlY29yZC1xdWV1ZS9saWIvY29tbW9uL2RvY3MuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6aW5zdGFuY2UtcmVjb3JkLXF1ZXVlL2xpYi9zZXJ2ZXIvYXBpLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2luc3RhbmNlLXJlY29yZC1xdWV1ZS9zZXJ2ZXIvc3RhcnR1cC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9zdGFydHVwLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczppbnN0YW5jZS1yZWNvcmQtcXVldWUvc2VydmVyL2NoZWNrTnBtLmpzIl0sIm5hbWVzIjpbIkluc3RhbmNlUmVjb3JkUXVldWUiLCJFdmVudFN0YXRlIiwiY29sbGVjdGlvbiIsImRiIiwiaW5zdGFuY2VfcmVjb3JkX3F1ZXVlIiwiTW9uZ28iLCJDb2xsZWN0aW9uIiwiX3ZhbGlkYXRlRG9jdW1lbnQiLCJkb2MiLCJjaGVjayIsImluZm8iLCJPYmplY3QiLCJzZW50IiwiTWF0Y2giLCJPcHRpb25hbCIsIkJvb2xlYW4iLCJzZW5kaW5nIiwiSW50ZWdlciIsImNyZWF0ZWRBdCIsIkRhdGUiLCJjcmVhdGVkQnkiLCJPbmVPZiIsIlN0cmluZyIsInNlbmQiLCJvcHRpb25zIiwiY3VycmVudFVzZXIiLCJNZXRlb3IiLCJpc0NsaWVudCIsInVzZXJJZCIsImlzU2VydmVyIiwiXyIsImV4dGVuZCIsInRlc3QiLCJwaWNrIiwiaW5zZXJ0IiwiX2V2YWwiLCJyZXF1aXJlIiwiaXNDb25maWd1cmVkIiwic2VuZFdvcmtlciIsInRhc2siLCJpbnRlcnZhbCIsImRlYnVnIiwiY29uc29sZSIsImxvZyIsInNldEludGVydmFsIiwiZXJyb3IiLCJtZXNzYWdlIiwiQ29uZmlndXJlIiwic2VsZiIsInNlbmRUaW1lb3V0IiwiRXJyb3IiLCJzeW5jQXR0YWNoIiwic3luY19hdHRhY2htZW50IiwiaW5zSWQiLCJzcGFjZUlkIiwibmV3UmVjb3JkSWQiLCJvYmplY3ROYW1lIiwiY2ZzIiwiaW5zdGFuY2VzIiwiZmluZCIsImZvckVhY2giLCJmIiwiaGFzU3RvcmVkIiwiX2lkIiwibmV3RmlsZSIsIkZTIiwiRmlsZSIsImNtc0ZpbGVJZCIsIkNyZWF0b3IiLCJnZXRDb2xsZWN0aW9uIiwiX21ha2VOZXdJRCIsImF0dGFjaERhdGEiLCJjcmVhdGVSZWFkU3RyZWFtIiwidHlwZSIsIm9yaWdpbmFsIiwiZXJyIiwicmVhc29uIiwibmFtZSIsInNpemUiLCJtZXRhZGF0YSIsIm93bmVyIiwib3duZXJfbmFtZSIsInNwYWNlIiwicmVjb3JkX2lkIiwib2JqZWN0X25hbWUiLCJwYXJlbnQiLCJmaWxlcyIsIndyYXBBc3luYyIsImNiIiwib25jZSIsInN0b3JlTmFtZSIsIm8iLCJpZHMiLCJleHRlbnRpb24iLCJleHRlbnNpb24iLCJ2ZXJzaW9ucyIsImNyZWF0ZWRfYnkiLCJtb2RpZmllZF9ieSIsInBhcmVudHMiLCJpbmNsdWRlcyIsInB1c2giLCJjdXJyZW50IiwidXBkYXRlIiwiJHNldCIsIiRhZGRUb1NldCIsInN5bmNJbnNGaWVsZHMiLCJzeW5jVmFsdWVzIiwiZmllbGRfbWFwX2JhY2siLCJ2YWx1ZXMiLCJpbnMiLCJvYmplY3RJbmZvIiwiZmllbGRfbWFwX2JhY2tfc2NyaXB0IiwicmVjb3JkIiwib2JqIiwidGFibGVGaWVsZENvZGVzIiwidGFibGVGaWVsZE1hcCIsInRhYmxlVG9SZWxhdGVkTWFwIiwiZm9ybSIsImZpbmRPbmUiLCJmb3JtRmllbGRzIiwiZm9ybV92ZXJzaW9uIiwiZmllbGRzIiwiZm9ybVZlcnNpb24iLCJoaXN0b3J5cyIsImgiLCJvYmplY3RGaWVsZHMiLCJvYmplY3RGaWVsZEtleXMiLCJrZXlzIiwicmVsYXRlZE9iamVjdHMiLCJnZXRSZWxhdGVkT2JqZWN0cyIsInJlbGF0ZWRPYmplY3RzS2V5cyIsInBsdWNrIiwiZm9ybVRhYmxlRmllbGRzIiwiZmlsdGVyIiwiZm9ybUZpZWxkIiwiZm9ybVRhYmxlRmllbGRzQ29kZSIsImdldFJlbGF0ZWRPYmplY3RGaWVsZCIsImtleSIsInJlbGF0ZWRPYmplY3RzS2V5Iiwic3RhcnRzV2l0aCIsImdldEZvcm1UYWJsZUZpZWxkIiwiZm9ybVRhYmxlRmllbGRDb2RlIiwiZ2V0Rm9ybUZpZWxkIiwiX2Zvcm1GaWVsZHMiLCJfZmllbGRDb2RlIiwiZWFjaCIsImZmIiwiY29kZSIsImZtIiwicmVsYXRlZE9iamVjdEZpZWxkIiwib2JqZWN0X2ZpZWxkIiwiZm9ybVRhYmxlRmllbGQiLCJ3b3JrZmxvd19maWVsZCIsIm9UYWJsZUNvZGUiLCJzcGxpdCIsIm9UYWJsZUZpZWxkQ29kZSIsInRhYmxlVG9SZWxhdGVkTWFwS2V5Iiwid1RhYmxlQ29kZSIsImluZGV4T2YiLCJoYXNPd25Qcm9wZXJ0eSIsImlzQXJyYXkiLCJKU09OIiwic3RyaW5naWZ5Iiwid29ya2Zsb3dfdGFibGVfZmllbGRfY29kZSIsIm9iamVjdF90YWJsZV9maWVsZF9jb2RlIiwid0ZpZWxkIiwib0ZpZWxkIiwiaXNfbXVsdGlzZWxlY3QiLCJtdWx0aXBsZSIsInJlZmVyZW5jZV90byIsImlzU3RyaW5nIiwib0NvbGxlY3Rpb24iLCJyZWZlck9iamVjdCIsImdldE9iamVjdCIsInJlZmVyRGF0YSIsIm5hbWVGaWVsZEtleSIsIk5BTUVfRklFTERfS0VZIiwic2VsZWN0b3IiLCJ0bXBfZmllbGRfdmFsdWUiLCJjb21wYWN0IiwiaXNFbXB0eSIsInRlbU9iakZpZWxkcyIsImxlbmd0aCIsIm9iakZpZWxkIiwicmVmZXJPYmpGaWVsZCIsInJlZmVyU2V0T2JqIiwiaW5zRmllbGQiLCJ1bmlxIiwidGZjIiwiYyIsInBhcnNlIiwidHIiLCJuZXdUciIsInYiLCJrIiwidGZtIiwib1RkQ29kZSIsInJlbGF0ZWRPYmpzIiwiZ2V0UmVsYXRlZEZpZWxkVmFsdWUiLCJ2YWx1ZUtleSIsInJlZHVjZSIsIngiLCJtYXAiLCJ0YWJsZUNvZGUiLCJfRlJPTV9UQUJMRV9DT0RFIiwid2FybiIsInJlbGF0ZWRPYmplY3ROYW1lIiwicmVsYXRlZE9iamVjdFZhbHVlcyIsInJlbGF0ZWRPYmplY3QiLCJ0YWJsZVZhbHVlSXRlbSIsInJlbGF0ZWRPYmplY3RWYWx1ZSIsImZpZWxkS2V5IiwicmVsYXRlZE9iamVjdEZpZWxkVmFsdWUiLCJmb3JtRmllbGRLZXkiLCJfY29kZSIsImV2YWxGaWVsZE1hcEJhY2tTY3JpcHQiLCJmaWx0ZXJPYmoiLCJtYWluT2JqZWN0VmFsdWUiLCJyZWxhdGVkT2JqZWN0c1ZhbHVlIiwic2NyaXB0IiwiZnVuYyIsImlzT2JqZWN0Iiwic3luY1JlbGF0ZWRPYmplY3RzVmFsdWUiLCJtYWluUmVjb3JkSWQiLCJvYmplY3RDb2xsZWN0aW9uIiwidGFibGVNYXAiLCJ0YWJsZV9pZCIsIl90YWJsZSIsInRhYmxlX2NvZGUiLCJvbGRSZWxhdGVkUmVjb3JkIiwiZm9yZWlnbl9rZXkiLCJhcHBsaWNhbnQiLCJpbnN0YW5jZV9zdGF0ZSIsInN0YXRlIiwiZmluYWxfZGVjaXNpb24iLCJ2YWxpZGF0ZSIsInRhYmxlSWRzIiwicmVtb3ZlIiwiJG5pbiIsInNlbmREb2MiLCJpbnN0YW5jZV9pZCIsInJlY29yZHMiLCJmbG93IiwidHJhY2VzIiwib3ciLCJmbG93X2lkIiwiJGluIiwic2V0T2JqIiwic3RhY2siLCJuZXdPYmoiLCJyIiwiJHB1c2giLCJyZWNvcmRfaWRzIiwiJHB1bGwiLCJfcXVlcnlTZW5kIiwic2VydmVyU2VuZCIsImlzU2VuZGluZ0RvYyIsInNlbmRJbnRlcnZhbCIsIl9lbnN1cmVJbmRleCIsIm5vdyIsInRpbWVvdXRBdCIsInJlc2VydmVkIiwiJGx0IiwicmVzdWx0Iiwia2VlcERvY3MiLCJzZW50QXQiLCJiYXRjaFNpemUiLCJzZW5kQmF0Y2hTaXplIiwicGVuZGluZ0RvY3MiLCIkYW5kIiwiZXJyTXNnIiwiJGV4aXN0cyIsInNvcnQiLCJsaW1pdCIsInN0YXJ0dXAiLCJyZWYiLCJzZXR0aW5ncyIsImNyb24iLCJpbnN0YW5jZXJlY29yZHF1ZXVlX2ludGVydmFsIiwiY2hlY2tOcG1WZXJzaW9ucyIsIm1vZHVsZSIsImxpbmsiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQUEsbUJBQW1CLEdBQUcsSUFBSUMsVUFBSixFQUF0QixDOzs7Ozs7Ozs7OztBQ0FBRCxtQkFBbUIsQ0FBQ0UsVUFBcEIsR0FBaUNDLEVBQUUsQ0FBQ0MscUJBQUgsR0FBMkIsSUFBSUMsS0FBSyxDQUFDQyxVQUFWLENBQXFCLHVCQUFyQixDQUE1RDs7QUFFQSxJQUFJQyxpQkFBaUIsR0FBRyxVQUFTQyxHQUFULEVBQWM7QUFFckNDLE9BQUssQ0FBQ0QsR0FBRCxFQUFNO0FBQ1ZFLFFBQUksRUFBRUMsTUFESTtBQUVWQyxRQUFJLEVBQUVDLEtBQUssQ0FBQ0MsUUFBTixDQUFlQyxPQUFmLENBRkk7QUFHVkMsV0FBTyxFQUFFSCxLQUFLLENBQUNDLFFBQU4sQ0FBZUQsS0FBSyxDQUFDSSxPQUFyQixDQUhDO0FBSVZDLGFBQVMsRUFBRUMsSUFKRDtBQUtWQyxhQUFTLEVBQUVQLEtBQUssQ0FBQ1EsS0FBTixDQUFZQyxNQUFaLEVBQW9CLElBQXBCO0FBTEQsR0FBTixDQUFMO0FBUUEsQ0FWRDs7QUFZQXRCLG1CQUFtQixDQUFDdUIsSUFBcEIsR0FBMkIsVUFBU0MsT0FBVCxFQUFrQjtBQUM1QyxNQUFJQyxXQUFXLEdBQUdDLE1BQU0sQ0FBQ0MsUUFBUCxJQUFtQkQsTUFBTSxDQUFDRSxNQUExQixJQUFvQ0YsTUFBTSxDQUFDRSxNQUFQLEVBQXBDLElBQXVERixNQUFNLENBQUNHLFFBQVAsS0FBb0JMLE9BQU8sQ0FBQ0osU0FBUixJQUFxQixVQUF6QyxDQUF2RCxJQUErRyxJQUFqSTs7QUFDQSxNQUFJWixHQUFHLEdBQUdzQixDQUFDLENBQUNDLE1BQUYsQ0FB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ZTtBQUNkLE1BQUFDLEdBQUE7O0FBQUEsT0FBQUEsTUFBQXpQLE9BQUEwUCxRQUFBLENBQUFDLElBQUEsWUFBQUYsSUFBeUJHLDRCQUF6QixHQUF5QixNQUF6QjtBQ0VHLFdEREZ0UixvQkFBb0IrQyxTQUFwQixDQUNDO0FBQUFrTixvQkFBY3ZPLE9BQU8wUCxRQUFQLENBQWdCQyxJQUFoQixDQUFxQkMsNEJBQW5DO0FBQ0FYLHFCQUFlLEVBRGY7QUFFQUgsZ0JBQVU7QUFGVixLQURELENDQ0U7QUFLRDtBRFJILEc7Ozs7Ozs7Ozs7O0FFQUEsSUFBSWUsZ0JBQUo7QUFBcUJDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLG9DQUFaLEVBQWlEO0FBQUNGLGtCQUFnQixDQUFDdEYsQ0FBRCxFQUFHO0FBQUNzRixvQkFBZ0IsR0FBQ3RGLENBQWpCO0FBQW1COztBQUF4QyxDQUFqRCxFQUEyRixDQUEzRjtBQUNyQnNGLGdCQUFnQixDQUFDO0FBQ2hCLFVBQVE7QUFEUSxDQUFELEVBRWIsK0JBRmEsQ0FBaEIsQyIsImZpbGUiOiIvcGFja2FnZXMvc3RlZWRvc19pbnN0YW5jZS1yZWNvcmQtcXVldWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJJbnN0YW5jZVJlY29yZFF1ZXVlID0gbmV3IEV2ZW50U3RhdGUoKTsiLCJJbnN0YW5jZVJlY29yZFF1ZXVlLmNvbGxlY3Rpb24gPSBkYi5pbnN0YW5jZV9yZWNvcmRfcXVldWUgPSBuZXcgTW9uZ28uQ29sbGVjdGlvbignaW5zdGFuY2VfcmVjb3JkX3F1ZXVlJyk7XHJcblxyXG52YXIgX3ZhbGlkYXRlRG9jdW1lbnQgPSBmdW5jdGlvbihkb2MpIHtcclxuXHJcblx0Y2hlY2soZG9jLCB7XHJcblx0XHRpbmZvOiBPYmplY3QsXHJcblx0XHRzZW50OiBNYXRjaC5PcHRpb25hbChCb29sZWFuKSxcclxuXHRcdHNlbmRpbmc6IE1hdGNoLk9wdGlvbmFsKE1hdGNoLkludGVnZXIpLFxyXG5cdFx0Y3JlYXRlZEF0OiBEYXRlLFxyXG5cdFx0Y3JlYXRlZEJ5OiBNYXRjaC5PbmVPZihTdHJpbmcsIG51bGwpXHJcblx0fSk7XHJcblxyXG59O1xyXG5cclxuSW5zdGFuY2VSZWNvcmRRdWV1ZS5zZW5kID0gZnVuY3Rpb24ob3B0aW9ucykge1xyXG5cdHZhciBjdXJyZW50VXNlciA9IE1ldGVvci5pc0NsaWVudCAmJiBNZXRlb3IudXNlcklkICYmIE1ldGVvci51c2VySWQoKSB8fCBNZXRlb3IuaXNTZXJ2ZXIgJiYgKG9wdGlvbnMuY3JlYXRlZEJ5IHx8ICc8U0VSVkVSPicpIHx8IG51bGxcclxuXHR2YXIgZG9jID0gXy5leHRlbmQoe1xyXG5cdFx0Y3JlYXRlZEF0OiBuZXcgRGF0ZSgpLFxyXG5cdFx0Y3JlYXRlZEJ5OiBjdXJyZW50VXNlclxyXG5cdH0pO1xyXG5cclxuXHRpZiAoTWF0Y2gudGVzdChvcHRpb25zLCBPYmplY3QpKSB7XHJcblx0XHRkb2MuaW5mbyA9IF8ucGljayhvcHRpb25zLCAnaW5zdGFuY2VfaWQnLCAncmVjb3JkcycsICdzeW5jX2RhdGUnLCAnaW5zdGFuY2VfZmluaXNoX2RhdGUnLCAnc3RlcF9uYW1lJyk7XHJcblx0fVxyXG5cclxuXHRkb2Muc2VudCA9IGZhbHNlO1xyXG5cdGRvYy5zZW5kaW5nID0gMDtcclxuXHJcblx0X3ZhbGlkYXRlRG9jdW1lbnQoZG9jKTtcclxuXHJcblx0cmV0dXJuIEluc3RhbmNlUmVjb3JkUXVldWUuY29sbGVjdGlvbi5pbnNlcnQoZG9jKTtcclxufTsiLCJ2YXIgX2V2YWwgPSByZXF1aXJlKCdldmFsJyk7XHJcbnZhciBpc0NvbmZpZ3VyZWQgPSBmYWxzZTtcclxudmFyIHNlbmRXb3JrZXIgPSBmdW5jdGlvbiAodGFzaywgaW50ZXJ2YWwpIHtcclxuXHJcblx0aWYgKEluc3RhbmNlUmVjb3JkUXVldWUuZGVidWcpIHtcclxuXHRcdGNvbnNvbGUubG9nKCdJbnN0YW5jZVJlY29yZFF1ZXVlOiBTZW5kIHdvcmtlciBzdGFydGVkLCB1c2luZyBpbnRlcnZhbDogJyArIGludGVydmFsKTtcclxuXHR9XHJcblxyXG5cdHJldHVybiBNZXRlb3Iuc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0dGFzaygpO1xyXG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coJ0luc3RhbmNlUmVjb3JkUXVldWU6IEVycm9yIHdoaWxlIHNlbmRpbmc6ICcgKyBlcnJvci5tZXNzYWdlKTtcclxuXHRcdH1cclxuXHR9LCBpbnRlcnZhbCk7XHJcbn07XHJcblxyXG4vKlxyXG5cdG9wdGlvbnM6IHtcclxuXHRcdC8vIENvbnRyb2xzIHRoZSBzZW5kaW5nIGludGVydmFsXHJcblx0XHRzZW5kSW50ZXJ2YWw6IE1hdGNoLk9wdGlvbmFsKE51bWJlciksXHJcblx0XHQvLyBDb250cm9scyB0aGUgc2VuZGluZyBiYXRjaCBzaXplIHBlciBpbnRlcnZhbFxyXG5cdFx0c2VuZEJhdGNoU2l6ZTogTWF0Y2guT3B0aW9uYWwoTnVtYmVyKSxcclxuXHRcdC8vIEFsbG93IG9wdGlvbmFsIGtlZXBpbmcgbm90aWZpY2F0aW9ucyBpbiBjb2xsZWN0aW9uXHJcblx0XHRrZWVwRG9jczogTWF0Y2guT3B0aW9uYWwoQm9vbGVhbilcclxuXHR9XHJcbiovXHJcbkluc3RhbmNlUmVjb3JkUXVldWUuQ29uZmlndXJlID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuXHR2YXIgc2VsZiA9IHRoaXM7XHJcblx0b3B0aW9ucyA9IF8uZXh0ZW5kKHtcclxuXHRcdHNlbmRUaW1lb3V0OiA2MDAwMCwgLy8gVGltZW91dCBwZXJpb2RcclxuXHR9LCBvcHRpb25zKTtcclxuXHJcblx0Ly8gQmxvY2sgbXVsdGlwbGUgY2FsbHNcclxuXHRpZiAoaXNDb25maWd1cmVkKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ0luc3RhbmNlUmVjb3JkUXVldWUuQ29uZmlndXJlIHNob3VsZCBub3QgYmUgY2FsbGVkIG1vcmUgdGhhbiBvbmNlIScpO1xyXG5cdH1cclxuXHJcblx0aXNDb25maWd1cmVkID0gdHJ1ZTtcclxuXHJcblx0Ly8gQWRkIGRlYnVnIGluZm9cclxuXHRpZiAoSW5zdGFuY2VSZWNvcmRRdWV1ZS5kZWJ1Zykge1xyXG5cdFx0Y29uc29sZS5sb2coJ0luc3RhbmNlUmVjb3JkUXVldWUuQ29uZmlndXJlJywgb3B0aW9ucyk7XHJcblx0fVxyXG5cclxuXHRzZWxmLnN5bmNBdHRhY2ggPSBmdW5jdGlvbiAoc3luY19hdHRhY2htZW50LCBpbnNJZCwgc3BhY2VJZCwgbmV3UmVjb3JkSWQsIG9iamVjdE5hbWUpIHtcclxuXHRcdGlmIChzeW5jX2F0dGFjaG1lbnQgPT0gXCJsYXN0ZXN0XCIpIHtcclxuXHRcdFx0Y2ZzLmluc3RhbmNlcy5maW5kKHtcclxuXHRcdFx0XHQnbWV0YWRhdGEuaW5zdGFuY2UnOiBpbnNJZCxcclxuXHRcdFx0XHQnbWV0YWRhdGEuY3VycmVudCc6IHRydWVcclxuXHRcdFx0fSkuZm9yRWFjaChmdW5jdGlvbiAoZikge1xyXG5cdFx0XHRcdGlmICghZi5oYXNTdG9yZWQoJ2luc3RhbmNlcycpKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKCdzeW5jQXR0YWNoLWZpbGUgbm90IHN0b3JlZDogJywgZi5faWQpO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR2YXIgbmV3RmlsZSA9IG5ldyBGUy5GaWxlKCksXHJcblx0XHRcdFx0XHRjbXNGaWxlSWQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2Ntc19maWxlcycpLl9tYWtlTmV3SUQoKTtcclxuXHRcdFx0XHRuZXdGaWxlLmF0dGFjaERhdGEoZi5jcmVhdGVSZWFkU3RyZWFtKCdpbnN0YW5jZXMnKSwge1xyXG5cdFx0XHRcdFx0dHlwZTogZi5vcmlnaW5hbC50eXBlXHJcblx0XHRcdFx0fSwgZnVuY3Rpb24gKGVycikge1xyXG5cdFx0XHRcdFx0aWYgKGVycikge1xyXG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKGVyci5lcnJvciwgZXJyLnJlYXNvbik7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRuZXdGaWxlLm5hbWUoZi5uYW1lKCkpO1xyXG5cdFx0XHRcdFx0bmV3RmlsZS5zaXplKGYuc2l6ZSgpKTtcclxuXHRcdFx0XHRcdHZhciBtZXRhZGF0YSA9IHtcclxuXHRcdFx0XHRcdFx0b3duZXI6IGYubWV0YWRhdGEub3duZXIsXHJcblx0XHRcdFx0XHRcdG93bmVyX25hbWU6IGYubWV0YWRhdGEub3duZXJfbmFtZSxcclxuXHRcdFx0XHRcdFx0c3BhY2U6IHNwYWNlSWQsXHJcblx0XHRcdFx0XHRcdHJlY29yZF9pZDogbmV3UmVjb3JkSWQsXHJcblx0XHRcdFx0XHRcdG9iamVjdF9uYW1lOiBvYmplY3ROYW1lLFxyXG5cdFx0XHRcdFx0XHRwYXJlbnQ6IGNtc0ZpbGVJZFxyXG5cdFx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0XHRuZXdGaWxlLm1ldGFkYXRhID0gbWV0YWRhdGE7XHJcblx0XHRcdFx0XHRjZnMuZmlsZXMuaW5zZXJ0KG5ld0ZpbGUpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdE1ldGVvci53cmFwQXN5bmMoZnVuY3Rpb24gKG5ld0ZpbGUsIENyZWF0b3IsIGNtc0ZpbGVJZCwgb2JqZWN0TmFtZSwgbmV3UmVjb3JkSWQsIHNwYWNlSWQsIGYsIGNiKSB7XHJcblx0XHRcdFx0XHRuZXdGaWxlLm9uY2UoJ3N0b3JlZCcsIGZ1bmN0aW9uIChzdG9yZU5hbWUpIHtcclxuXHRcdFx0XHRcdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKCdjbXNfZmlsZXMnKS5pbnNlcnQoe1xyXG5cdFx0XHRcdFx0XHRcdF9pZDogY21zRmlsZUlkLFxyXG5cdFx0XHRcdFx0XHRcdHBhcmVudDoge1xyXG5cdFx0XHRcdFx0XHRcdFx0bzogb2JqZWN0TmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdGlkczogW25ld1JlY29yZElkXVxyXG5cdFx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdFx0c2l6ZTogbmV3RmlsZS5zaXplKCksXHJcblx0XHRcdFx0XHRcdFx0bmFtZTogbmV3RmlsZS5uYW1lKCksXHJcblx0XHRcdFx0XHRcdFx0ZXh0ZW50aW9uOiBuZXdGaWxlLmV4dGVuc2lvbigpLFxyXG5cdFx0XHRcdFx0XHRcdHNwYWNlOiBzcGFjZUlkLFxyXG5cdFx0XHRcdFx0XHRcdHZlcnNpb25zOiBbbmV3RmlsZS5faWRdLFxyXG5cdFx0XHRcdFx0XHRcdG93bmVyOiBmLm1ldGFkYXRhLm93bmVyLFxyXG5cdFx0XHRcdFx0XHRcdGNyZWF0ZWRfYnk6IGYubWV0YWRhdGEub3duZXIsXHJcblx0XHRcdFx0XHRcdFx0bW9kaWZpZWRfYnk6IGYubWV0YWRhdGEub3duZXJcclxuXHRcdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0XHRjYihudWxsKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0bmV3RmlsZS5vbmNlKCdlcnJvcicsIGZ1bmN0aW9uIChlcnJvcikge1xyXG5cdFx0XHRcdFx0XHRjYihlcnJvcik7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9KShuZXdGaWxlLCBDcmVhdG9yLCBjbXNGaWxlSWQsIG9iamVjdE5hbWUsIG5ld1JlY29yZElkLCBzcGFjZUlkLCBmKTtcclxuXHRcdFx0fSlcclxuXHRcdH0gZWxzZSBpZiAoc3luY19hdHRhY2htZW50ID09IFwiYWxsXCIpIHtcclxuXHRcdFx0dmFyIHBhcmVudHMgPSBbXTtcclxuXHRcdFx0Y2ZzLmluc3RhbmNlcy5maW5kKHtcclxuXHRcdFx0XHQnbWV0YWRhdGEuaW5zdGFuY2UnOiBpbnNJZFxyXG5cdFx0XHR9KS5mb3JFYWNoKGZ1bmN0aW9uIChmKSB7XHJcblx0XHRcdFx0aWYgKCFmLmhhc1N0b3JlZCgnaW5zdGFuY2VzJykpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoJ3N5bmNBdHRhY2gtZmlsZSBub3Qgc3RvcmVkOiAnLCBmLl9pZCk7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHZhciBuZXdGaWxlID0gbmV3IEZTLkZpbGUoKSxcclxuXHRcdFx0XHRcdGNtc0ZpbGVJZCA9IGYubWV0YWRhdGEucGFyZW50O1xyXG5cclxuXHRcdFx0XHRpZiAoIXBhcmVudHMuaW5jbHVkZXMoY21zRmlsZUlkKSkge1xyXG5cdFx0XHRcdFx0cGFyZW50cy5wdXNoKGNtc0ZpbGVJZCk7XHJcblx0XHRcdFx0XHRDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2Ntc19maWxlcycpLmluc2VydCh7XHJcblx0XHRcdFx0XHRcdF9pZDogY21zRmlsZUlkLFxyXG5cdFx0XHRcdFx0XHRwYXJlbnQ6IHtcclxuXHRcdFx0XHRcdFx0XHRvOiBvYmplY3ROYW1lLFxyXG5cdFx0XHRcdFx0XHRcdGlkczogW25ld1JlY29yZElkXVxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHRzcGFjZTogc3BhY2VJZCxcclxuXHRcdFx0XHRcdFx0dmVyc2lvbnM6IFtdLFxyXG5cdFx0XHRcdFx0XHRvd25lcjogZi5tZXRhZGF0YS5vd25lcixcclxuXHRcdFx0XHRcdFx0Y3JlYXRlZF9ieTogZi5tZXRhZGF0YS5vd25lcixcclxuXHRcdFx0XHRcdFx0bW9kaWZpZWRfYnk6IGYubWV0YWRhdGEub3duZXJcclxuXHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRuZXdGaWxlLmF0dGFjaERhdGEoZi5jcmVhdGVSZWFkU3RyZWFtKCdpbnN0YW5jZXMnKSwge1xyXG5cdFx0XHRcdFx0dHlwZTogZi5vcmlnaW5hbC50eXBlXHJcblx0XHRcdFx0fSwgZnVuY3Rpb24gKGVycikge1xyXG5cdFx0XHRcdFx0aWYgKGVycikge1xyXG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKGVyci5lcnJvciwgZXJyLnJlYXNvbik7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRuZXdGaWxlLm5hbWUoZi5uYW1lKCkpO1xyXG5cdFx0XHRcdFx0bmV3RmlsZS5zaXplKGYuc2l6ZSgpKTtcclxuXHRcdFx0XHRcdHZhciBtZXRhZGF0YSA9IHtcclxuXHRcdFx0XHRcdFx0b3duZXI6IGYubWV0YWRhdGEub3duZXIsXHJcblx0XHRcdFx0XHRcdG93bmVyX25hbWU6IGYubWV0YWRhdGEub3duZXJfbmFtZSxcclxuXHRcdFx0XHRcdFx0c3BhY2U6IHNwYWNlSWQsXHJcblx0XHRcdFx0XHRcdHJlY29yZF9pZDogbmV3UmVjb3JkSWQsXHJcblx0XHRcdFx0XHRcdG9iamVjdF9uYW1lOiBvYmplY3ROYW1lLFxyXG5cdFx0XHRcdFx0XHRwYXJlbnQ6IGNtc0ZpbGVJZFxyXG5cdFx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0XHRuZXdGaWxlLm1ldGFkYXRhID0gbWV0YWRhdGE7XHJcblx0XHRcdFx0XHRjZnMuZmlsZXMuaW5zZXJ0KG5ld0ZpbGUpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdE1ldGVvci53cmFwQXN5bmMoZnVuY3Rpb24gKG5ld0ZpbGUsIENyZWF0b3IsIGNtc0ZpbGVJZCwgZiwgY2IpIHtcclxuXHRcdFx0XHRcdG5ld0ZpbGUub25jZSgnc3RvcmVkJywgZnVuY3Rpb24gKHN0b3JlTmFtZSkge1xyXG5cdFx0XHRcdFx0XHRpZiAoZi5tZXRhZGF0YS5jdXJyZW50ID09IHRydWUpIHtcclxuXHRcdFx0XHRcdFx0XHRDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2Ntc19maWxlcycpLnVwZGF0ZShjbXNGaWxlSWQsIHtcclxuXHRcdFx0XHRcdFx0XHRcdCRzZXQ6IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0c2l6ZTogbmV3RmlsZS5zaXplKCksXHJcblx0XHRcdFx0XHRcdFx0XHRcdG5hbWU6IG5ld0ZpbGUubmFtZSgpLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRleHRlbnRpb246IG5ld0ZpbGUuZXh0ZW5zaW9uKCksXHJcblx0XHRcdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHRcdFx0JGFkZFRvU2V0OiB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHZlcnNpb25zOiBuZXdGaWxlLl9pZFxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbignY21zX2ZpbGVzJykudXBkYXRlKGNtc0ZpbGVJZCwge1xyXG5cdFx0XHRcdFx0XHRcdFx0JGFkZFRvU2V0OiB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHZlcnNpb25zOiBuZXdGaWxlLl9pZFxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRjYihudWxsKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0bmV3RmlsZS5vbmNlKCdlcnJvcicsIGZ1bmN0aW9uIChlcnJvcikge1xyXG5cdFx0XHRcdFx0XHRjYihlcnJvcik7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9KShuZXdGaWxlLCBDcmVhdG9yLCBjbXNGaWxlSWQsIGYpO1xyXG5cdFx0XHR9KVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0c2VsZi5zeW5jSW5zRmllbGRzID0gWyduYW1lJywgJ3N1Ym1pdHRlcl9uYW1lJywgJ2FwcGxpY2FudF9uYW1lJywgJ2FwcGxpY2FudF9vcmdhbml6YXRpb25fbmFtZScsICdhcHBsaWNhbnRfb3JnYW5pemF0aW9uX2Z1bGxuYW1lJywgJ3N0YXRlJyxcclxuXHRcdCdjdXJyZW50X3N0ZXBfbmFtZScsICdmbG93X25hbWUnLCAnY2F0ZWdvcnlfbmFtZScsICdzdWJtaXRfZGF0ZScsICdmaW5pc2hfZGF0ZScsICdmaW5hbF9kZWNpc2lvbicsICdhcHBsaWNhbnRfb3JnYW5pemF0aW9uJywgJ2FwcGxpY2FudF9jb21wYW55J1xyXG5cdF07XHJcblx0c2VsZi5zeW5jVmFsdWVzID0gZnVuY3Rpb24gKGZpZWxkX21hcF9iYWNrLCB2YWx1ZXMsIGlucywgb2JqZWN0SW5mbywgZmllbGRfbWFwX2JhY2tfc2NyaXB0LCByZWNvcmQpIHtcclxuXHRcdHZhclxyXG5cdFx0XHRvYmogPSB7fSxcclxuXHRcdFx0dGFibGVGaWVsZENvZGVzID0gW10sXHJcblx0XHRcdHRhYmxlRmllbGRNYXAgPSBbXSxcclxuXHRcdFx0dGFibGVUb1JlbGF0ZWRNYXAgPSB7fTtcclxuXHJcblx0XHRmaWVsZF9tYXBfYmFjayA9IGZpZWxkX21hcF9iYWNrIHx8IFtdO1xyXG5cclxuXHRcdHZhciBzcGFjZUlkID0gaW5zLnNwYWNlO1xyXG5cclxuXHRcdHZhciBmb3JtID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwiZm9ybXNcIikuZmluZE9uZShpbnMuZm9ybSk7XHJcblx0XHR2YXIgZm9ybUZpZWxkcyA9IG51bGw7XHJcblx0XHRpZiAoZm9ybS5jdXJyZW50Ll9pZCA9PT0gaW5zLmZvcm1fdmVyc2lvbikge1xyXG5cdFx0XHRmb3JtRmllbGRzID0gZm9ybS5jdXJyZW50LmZpZWxkcyB8fCBbXTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHZhciBmb3JtVmVyc2lvbiA9IF8uZmluZChmb3JtLmhpc3RvcnlzLCBmdW5jdGlvbiAoaCkge1xyXG5cdFx0XHRcdHJldHVybiBoLl9pZCA9PT0gaW5zLmZvcm1fdmVyc2lvbjtcclxuXHRcdFx0fSlcclxuXHRcdFx0Zm9ybUZpZWxkcyA9IGZvcm1WZXJzaW9uID8gZm9ybVZlcnNpb24uZmllbGRzIDogW107XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIG9iamVjdEZpZWxkcyA9IG9iamVjdEluZm8uZmllbGRzO1xyXG5cdFx0dmFyIG9iamVjdEZpZWxkS2V5cyA9IF8ua2V5cyhvYmplY3RGaWVsZHMpO1xyXG5cdFx0dmFyIHJlbGF0ZWRPYmplY3RzID0gQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0cyhvYmplY3RJbmZvLm5hbWUsIHNwYWNlSWQpO1xyXG5cdFx0dmFyIHJlbGF0ZWRPYmplY3RzS2V5cyA9IF8ucGx1Y2socmVsYXRlZE9iamVjdHMsICdvYmplY3RfbmFtZScpO1xyXG5cdFx0dmFyIGZvcm1UYWJsZUZpZWxkcyA9IF8uZmlsdGVyKGZvcm1GaWVsZHMsIGZ1bmN0aW9uIChmb3JtRmllbGQpIHtcclxuXHRcdFx0cmV0dXJuIGZvcm1GaWVsZC50eXBlID09PSAndGFibGUnXHJcblx0XHR9KTtcclxuXHRcdHZhciBmb3JtVGFibGVGaWVsZHNDb2RlID0gXy5wbHVjayhmb3JtVGFibGVGaWVsZHMsICdjb2RlJyk7XHJcblxyXG5cdFx0dmFyIGdldFJlbGF0ZWRPYmplY3RGaWVsZCA9IGZ1bmN0aW9uIChrZXkpIHtcclxuXHRcdFx0cmV0dXJuIF8uZmluZChyZWxhdGVkT2JqZWN0c0tleXMsIGZ1bmN0aW9uIChyZWxhdGVkT2JqZWN0c0tleSkge1xyXG5cdFx0XHRcdHJldHVybiBrZXkuc3RhcnRzV2l0aChyZWxhdGVkT2JqZWN0c0tleSArICcuJyk7XHJcblx0XHRcdH0pXHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBnZXRGb3JtVGFibGVGaWVsZCA9IGZ1bmN0aW9uIChrZXkpIHtcclxuXHRcdFx0cmV0dXJuIF8uZmluZChmb3JtVGFibGVGaWVsZHNDb2RlLCBmdW5jdGlvbiAoZm9ybVRhYmxlRmllbGRDb2RlKSB7XHJcblx0XHRcdFx0cmV0dXJuIGtleS5zdGFydHNXaXRoKGZvcm1UYWJsZUZpZWxkQ29kZSArICcuJyk7XHJcblx0XHRcdH0pXHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBnZXRGb3JtRmllbGQgPSBmdW5jdGlvbiAoX2Zvcm1GaWVsZHMsIF9maWVsZENvZGUpIHtcclxuXHRcdFx0dmFyIGZvcm1GaWVsZCA9IG51bGw7XHJcblx0XHRcdF8uZWFjaChfZm9ybUZpZWxkcywgZnVuY3Rpb24gKGZmKSB7XHJcblx0XHRcdFx0aWYgKCFmb3JtRmllbGQpIHtcclxuXHRcdFx0XHRcdGlmIChmZi5jb2RlID09PSBfZmllbGRDb2RlKSB7XHJcblx0XHRcdFx0XHRcdGZvcm1GaWVsZCA9IGZmO1xyXG5cdFx0XHRcdFx0fSBlbHNlIGlmIChmZi50eXBlID09PSAnc2VjdGlvbicpIHtcclxuXHRcdFx0XHRcdFx0Xy5lYWNoKGZmLmZpZWxkcywgZnVuY3Rpb24gKGYpIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAoIWZvcm1GaWVsZCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKGYuY29kZSA9PT0gX2ZpZWxkQ29kZSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRmb3JtRmllbGQgPSBmO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdH0gZWxzZSBpZiAoZmYudHlwZSA9PT0gJ3RhYmxlJykge1xyXG5cdFx0XHRcdFx0XHRfLmVhY2goZmYuZmllbGRzLCBmdW5jdGlvbiAoZikge1xyXG5cdFx0XHRcdFx0XHRcdGlmICghZm9ybUZpZWxkKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoZi5jb2RlID09PSBfZmllbGRDb2RlKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGZvcm1GaWVsZCA9IGY7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHRcdHJldHVybiBmb3JtRmllbGQ7XHJcblx0XHR9XHJcblxyXG5cdFx0ZmllbGRfbWFwX2JhY2suZm9yRWFjaChmdW5jdGlvbiAoZm0pIHtcclxuXHRcdFx0Ly93b3JrZmxvdyDnmoTlrZDooajliLBjcmVhdG9yIG9iamVjdCDnmoTnm7jlhbPlr7nosaFcclxuXHRcdFx0dmFyIHJlbGF0ZWRPYmplY3RGaWVsZCA9IGdldFJlbGF0ZWRPYmplY3RGaWVsZChmbS5vYmplY3RfZmllbGQpO1xyXG5cdFx0XHR2YXIgZm9ybVRhYmxlRmllbGQgPSBnZXRGb3JtVGFibGVGaWVsZChmbS53b3JrZmxvd19maWVsZCk7XHJcblx0XHRcdGlmIChyZWxhdGVkT2JqZWN0RmllbGQpIHtcclxuXHRcdFx0XHR2YXIgb1RhYmxlQ29kZSA9IGZtLm9iamVjdF9maWVsZC5zcGxpdCgnLicpWzBdO1xyXG5cdFx0XHRcdHZhciBvVGFibGVGaWVsZENvZGUgPSBmbS5vYmplY3RfZmllbGQuc3BsaXQoJy4nKVsxXTtcclxuXHRcdFx0XHR2YXIgdGFibGVUb1JlbGF0ZWRNYXBLZXkgPSBvVGFibGVDb2RlO1xyXG5cdFx0XHRcdGlmICghdGFibGVUb1JlbGF0ZWRNYXBbdGFibGVUb1JlbGF0ZWRNYXBLZXldKSB7XHJcblx0XHRcdFx0XHR0YWJsZVRvUmVsYXRlZE1hcFt0YWJsZVRvUmVsYXRlZE1hcEtleV0gPSB7fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKGZvcm1UYWJsZUZpZWxkKSB7XHJcblx0XHRcdFx0XHR2YXIgd1RhYmxlQ29kZSA9IGZtLndvcmtmbG93X2ZpZWxkLnNwbGl0KCcuJylbMF07XHJcblx0XHRcdFx0XHR0YWJsZVRvUmVsYXRlZE1hcFt0YWJsZVRvUmVsYXRlZE1hcEtleV1bJ19GUk9NX1RBQkxFX0NPREUnXSA9IHdUYWJsZUNvZGVcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHRhYmxlVG9SZWxhdGVkTWFwW3RhYmxlVG9SZWxhdGVkTWFwS2V5XVtvVGFibGVGaWVsZENvZGVdID0gZm0ud29ya2Zsb3dfZmllbGRcclxuXHRcdFx0fVxyXG5cdFx0XHQvLyDliKTmlq3mmK/lkKbmmK/lrZDooajlrZfmrrVcclxuXHRcdFx0ZWxzZSBpZiAoZm0ud29ya2Zsb3dfZmllbGQuaW5kZXhPZignLiQuJykgPiAwICYmIGZtLm9iamVjdF9maWVsZC5pbmRleE9mKCcuJC4nKSA+IDApIHtcclxuXHRcdFx0XHR2YXIgd1RhYmxlQ29kZSA9IGZtLndvcmtmbG93X2ZpZWxkLnNwbGl0KCcuJC4nKVswXTtcclxuXHRcdFx0XHR2YXIgb1RhYmxlQ29kZSA9IGZtLm9iamVjdF9maWVsZC5zcGxpdCgnLiQuJylbMF07XHJcblx0XHRcdFx0aWYgKHZhbHVlcy5oYXNPd25Qcm9wZXJ0eSh3VGFibGVDb2RlKSAmJiBfLmlzQXJyYXkodmFsdWVzW3dUYWJsZUNvZGVdKSkge1xyXG5cdFx0XHRcdFx0dGFibGVGaWVsZENvZGVzLnB1c2goSlNPTi5zdHJpbmdpZnkoe1xyXG5cdFx0XHRcdFx0XHR3b3JrZmxvd190YWJsZV9maWVsZF9jb2RlOiB3VGFibGVDb2RlLFxyXG5cdFx0XHRcdFx0XHRvYmplY3RfdGFibGVfZmllbGRfY29kZTogb1RhYmxlQ29kZVxyXG5cdFx0XHRcdFx0fSkpO1xyXG5cdFx0XHRcdFx0dGFibGVGaWVsZE1hcC5wdXNoKGZtKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKHZhbHVlcy5oYXNPd25Qcm9wZXJ0eShmbS53b3JrZmxvd19maWVsZCkpIHtcclxuXHRcdFx0XHR2YXIgd0ZpZWxkID0gbnVsbDtcclxuXHJcblx0XHRcdFx0Xy5lYWNoKGZvcm1GaWVsZHMsIGZ1bmN0aW9uIChmZikge1xyXG5cdFx0XHRcdFx0aWYgKCF3RmllbGQpIHtcclxuXHRcdFx0XHRcdFx0aWYgKGZmLmNvZGUgPT09IGZtLndvcmtmbG93X2ZpZWxkKSB7XHJcblx0XHRcdFx0XHRcdFx0d0ZpZWxkID0gZmY7XHJcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoZmYudHlwZSA9PT0gJ3NlY3Rpb24nKSB7XHJcblx0XHRcdFx0XHRcdFx0Xy5lYWNoKGZmLmZpZWxkcywgZnVuY3Rpb24gKGYpIHtcclxuXHRcdFx0XHRcdFx0XHRcdGlmICghd0ZpZWxkKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChmLmNvZGUgPT09IGZtLndvcmtmbG93X2ZpZWxkKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0d0ZpZWxkID0gZjtcclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KVxyXG5cclxuXHRcdFx0XHR2YXIgb0ZpZWxkID0gb2JqZWN0RmllbGRzW2ZtLm9iamVjdF9maWVsZF07XHJcblxyXG5cdFx0XHRcdGlmIChvRmllbGQpIHtcclxuXHRcdFx0XHRcdGlmICghd0ZpZWxkKSB7XHJcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKCdmbS53b3JrZmxvd19maWVsZDogJywgZm0ud29ya2Zsb3dfZmllbGQpXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHQvLyDooajljZXpgInkurrpgInnu4TlrZfmrrUg6IezIOWvueixoSBsb29rdXAgbWFzdGVyX2RldGFpbOexu+Wei+Wtl+auteWQjOatpVxyXG5cdFx0XHRcdFx0aWYgKCF3RmllbGQuaXNfbXVsdGlzZWxlY3QgJiYgWyd1c2VyJywgJ2dyb3VwJ10uaW5jbHVkZXMod0ZpZWxkLnR5cGUpICYmICFvRmllbGQubXVsdGlwbGUgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKG9GaWVsZC50eXBlKSAmJiBbJ3VzZXJzJywgJ29yZ2FuaXphdGlvbnMnXS5pbmNsdWRlcyhvRmllbGQucmVmZXJlbmNlX3RvKSkge1xyXG5cdFx0XHRcdFx0XHRvYmpbZm0ub2JqZWN0X2ZpZWxkXSA9IHZhbHVlc1tmbS53b3JrZmxvd19maWVsZF1bJ2lkJ107XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlIGlmICghb0ZpZWxkLm11bHRpcGxlICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhvRmllbGQudHlwZSkgJiYgXy5pc1N0cmluZyhvRmllbGQucmVmZXJlbmNlX3RvKSAmJiBfLmlzU3RyaW5nKHZhbHVlc1tmbS53b3JrZmxvd19maWVsZF0pKSB7XHJcblx0XHRcdFx0XHRcdHZhciBvQ29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvRmllbGQucmVmZXJlbmNlX3RvLCBzcGFjZUlkKVxyXG5cdFx0XHRcdFx0XHR2YXIgcmVmZXJPYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvRmllbGQucmVmZXJlbmNlX3RvLCBzcGFjZUlkKVxyXG5cdFx0XHRcdFx0XHRpZiAob0NvbGxlY3Rpb24gJiYgcmVmZXJPYmplY3QpIHtcclxuXHRcdFx0XHRcdFx0XHQvLyDlhYjorqTkuLrmraTlgLzmmK9yZWZlck9iamVjdCBfaWTlrZfmrrXlgLxcclxuXHRcdFx0XHRcdFx0XHR2YXIgcmVmZXJEYXRhID0gb0NvbGxlY3Rpb24uZmluZE9uZSh2YWx1ZXNbZm0ud29ya2Zsb3dfZmllbGRdLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRmaWVsZHM6IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0X2lkOiAxXHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0aWYgKHJlZmVyRGF0YSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0b2JqW2ZtLm9iamVjdF9maWVsZF0gPSByZWZlckRhdGEuX2lkO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0Ly8g5YW25qyh6K6k5Li65q2k5YC85pivcmVmZXJPYmplY3QgTkFNRV9GSUVMRF9LRVnlgLxcclxuXHRcdFx0XHRcdFx0XHRpZiAoIXJlZmVyRGF0YSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0dmFyIG5hbWVGaWVsZEtleSA9IHJlZmVyT2JqZWN0Lk5BTUVfRklFTERfS0VZO1xyXG5cdFx0XHRcdFx0XHRcdFx0dmFyIHNlbGVjdG9yID0ge307XHJcblx0XHRcdFx0XHRcdFx0XHRzZWxlY3RvcltuYW1lRmllbGRLZXldID0gdmFsdWVzW2ZtLndvcmtmbG93X2ZpZWxkXTtcclxuXHRcdFx0XHRcdFx0XHRcdHJlZmVyRGF0YSA9IG9Db2xsZWN0aW9uLmZpbmRPbmUoc2VsZWN0b3IsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZmllbGRzOiB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0X2lkOiAxXHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKHJlZmVyRGF0YSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRvYmpbZm0ub2JqZWN0X2ZpZWxkXSA9IHJlZmVyRGF0YS5faWQ7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdGlmIChvRmllbGQudHlwZSA9PT0gXCJib29sZWFuXCIpIHtcclxuXHRcdFx0XHRcdFx0XHR2YXIgdG1wX2ZpZWxkX3ZhbHVlID0gdmFsdWVzW2ZtLndvcmtmbG93X2ZpZWxkXTtcclxuXHRcdFx0XHRcdFx0XHRpZiAoWyd0cnVlJywgJ+aYryddLmluY2x1ZGVzKHRtcF9maWVsZF92YWx1ZSkpIHtcclxuXHRcdFx0XHRcdFx0XHRcdG9ialtmbS5vYmplY3RfZmllbGRdID0gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKFsnZmFsc2UnLCAn5ZCmJ10uaW5jbHVkZXModG1wX2ZpZWxkX3ZhbHVlKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0b2JqW2ZtLm9iamVjdF9maWVsZF0gPSBmYWxzZTtcclxuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0b2JqW2ZtLm9iamVjdF9maWVsZF0gPSB0bXBfZmllbGRfdmFsdWU7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGVsc2UgaWYgKFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhvRmllbGQudHlwZSkgJiYgd0ZpZWxkLnR5cGUgPT09ICdvZGF0YScpIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAob0ZpZWxkLm11bHRpcGxlICYmIHdGaWVsZC5pc19tdWx0aXNlbGVjdCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0b2JqW2ZtLm9iamVjdF9maWVsZF0gPSBfLmNvbXBhY3QoXy5wbHVjayh2YWx1ZXNbZm0ud29ya2Zsb3dfZmllbGRdLCAnX2lkJykpXHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmICghb0ZpZWxkLm11bHRpcGxlICYmICF3RmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcclxuXHRcdFx0XHRcdFx0XHRcdGlmICghXy5pc0VtcHR5KHZhbHVlc1tmbS53b3JrZmxvd19maWVsZF0pKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdG9ialtmbS5vYmplY3RfZmllbGRdID0gdmFsdWVzW2ZtLndvcmtmbG93X2ZpZWxkXS5faWRcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0b2JqW2ZtLm9iamVjdF9maWVsZF0gPSB2YWx1ZXNbZm0ud29ya2Zsb3dfZmllbGRdO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRvYmpbZm0ub2JqZWN0X2ZpZWxkXSA9IHZhbHVlc1tmbS53b3JrZmxvd19maWVsZF07XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0aWYgKGZtLm9iamVjdF9maWVsZC5pbmRleE9mKCcuJykgPiAtMSkge1xyXG5cdFx0XHRcdFx0XHR2YXIgdGVtT2JqRmllbGRzID0gZm0ub2JqZWN0X2ZpZWxkLnNwbGl0KCcuJyk7XHJcblx0XHRcdFx0XHRcdGlmICh0ZW1PYmpGaWVsZHMubGVuZ3RoID09PSAyKSB7XHJcblx0XHRcdFx0XHRcdFx0dmFyIG9iakZpZWxkID0gdGVtT2JqRmllbGRzWzBdO1xyXG5cdFx0XHRcdFx0XHRcdHZhciByZWZlck9iakZpZWxkID0gdGVtT2JqRmllbGRzWzFdO1xyXG5cdFx0XHRcdFx0XHRcdHZhciBvRmllbGQgPSBvYmplY3RGaWVsZHNbb2JqRmllbGRdO1xyXG5cdFx0XHRcdFx0XHRcdGlmICghb0ZpZWxkLm11bHRpcGxlICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhvRmllbGQudHlwZSkgJiYgXy5pc1N0cmluZyhvRmllbGQucmVmZXJlbmNlX3RvKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0dmFyIG9Db2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9GaWVsZC5yZWZlcmVuY2VfdG8sIHNwYWNlSWQpXHJcblx0XHRcdFx0XHRcdFx0XHRpZiAob0NvbGxlY3Rpb24gJiYgcmVjb3JkICYmIHJlY29yZFtvYmpGaWVsZF0pIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0dmFyIHJlZmVyU2V0T2JqID0ge307XHJcblx0XHRcdFx0XHRcdFx0XHRcdHJlZmVyU2V0T2JqW3JlZmVyT2JqRmllbGRdID0gdmFsdWVzW2ZtLndvcmtmbG93X2ZpZWxkXTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0b0NvbGxlY3Rpb24udXBkYXRlKHJlY29yZFtvYmpGaWVsZF0sIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQkc2V0OiByZWZlclNldE9ialxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Ly8gZWxzZXtcclxuXHRcdFx0XHRcdC8vIFx0dmFyIHJlbGF0ZWRPYmplY3QgPSBfLmZpbmQocmVsYXRlZE9iamVjdHMsIGZ1bmN0aW9uKF9yZWxhdGVkT2JqZWN0KXtcclxuXHRcdFx0XHRcdC8vIFx0XHRyZXR1cm4gX3JlbGF0ZWRPYmplY3Qub2JqZWN0X25hbWUgPT09IGZtLm9iamVjdF9maWVsZFxyXG5cdFx0XHRcdFx0Ly8gXHR9KVxyXG5cdFx0XHRcdFx0Ly9cclxuXHRcdFx0XHRcdC8vIFx0aWYocmVsYXRlZE9iamVjdCl7XHJcblx0XHRcdFx0XHQvLyBcdFx0b2JqW2ZtLm9iamVjdF9maWVsZF0gPSB2YWx1ZXNbZm0ud29ya2Zsb3dfZmllbGRdO1xyXG5cdFx0XHRcdFx0Ly8gXHR9XHJcblx0XHRcdFx0XHQvLyB9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRpZiAoZm0ud29ya2Zsb3dfZmllbGQuc3RhcnRzV2l0aCgnaW5zdGFuY2UuJykpIHtcclxuXHRcdFx0XHRcdHZhciBpbnNGaWVsZCA9IGZtLndvcmtmbG93X2ZpZWxkLnNwbGl0KCdpbnN0YW5jZS4nKVsxXTtcclxuXHRcdFx0XHRcdGlmIChzZWxmLnN5bmNJbnNGaWVsZHMuaW5jbHVkZXMoaW5zRmllbGQpKSB7XHJcblx0XHRcdFx0XHRcdGlmIChmbS5vYmplY3RfZmllbGQuaW5kZXhPZignLicpIDwgMCkge1xyXG5cdFx0XHRcdFx0XHRcdG9ialtmbS5vYmplY3RfZmllbGRdID0gaW5zW2luc0ZpZWxkXTtcclxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHR2YXIgdGVtT2JqRmllbGRzID0gZm0ub2JqZWN0X2ZpZWxkLnNwbGl0KCcuJyk7XHJcblx0XHRcdFx0XHRcdFx0aWYgKHRlbU9iakZpZWxkcy5sZW5ndGggPT09IDIpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHZhciBvYmpGaWVsZCA9IHRlbU9iakZpZWxkc1swXTtcclxuXHRcdFx0XHRcdFx0XHRcdHZhciByZWZlck9iakZpZWxkID0gdGVtT2JqRmllbGRzWzFdO1xyXG5cdFx0XHRcdFx0XHRcdFx0dmFyIG9GaWVsZCA9IG9iamVjdEZpZWxkc1tvYmpGaWVsZF07XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoIW9GaWVsZC5tdWx0aXBsZSAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMob0ZpZWxkLnR5cGUpICYmIF8uaXNTdHJpbmcob0ZpZWxkLnJlZmVyZW5jZV90bykpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0dmFyIG9Db2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9GaWVsZC5yZWZlcmVuY2VfdG8sIHNwYWNlSWQpXHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChvQ29sbGVjdGlvbiAmJiByZWNvcmQgJiYgcmVjb3JkW29iakZpZWxkXSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHZhciByZWZlclNldE9iaiA9IHt9O1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJlZmVyU2V0T2JqW3JlZmVyT2JqRmllbGRdID0gaW5zW2luc0ZpZWxkXTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRvQ29sbGVjdGlvbi51cGRhdGUocmVjb3JkW29iakZpZWxkXSwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0JHNldDogcmVmZXJTZXRPYmpcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRpZiAoaW5zW2ZtLndvcmtmbG93X2ZpZWxkXSkge1xyXG5cdFx0XHRcdFx0XHRvYmpbZm0ub2JqZWN0X2ZpZWxkXSA9IGluc1tmbS53b3JrZmxvd19maWVsZF07XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KVxyXG5cclxuXHRcdF8udW5pcSh0YWJsZUZpZWxkQ29kZXMpLmZvckVhY2goZnVuY3Rpb24gKHRmYykge1xyXG5cdFx0XHR2YXIgYyA9IEpTT04ucGFyc2UodGZjKTtcclxuXHRcdFx0b2JqW2Mub2JqZWN0X3RhYmxlX2ZpZWxkX2NvZGVdID0gW107XHJcblx0XHRcdHZhbHVlc1tjLndvcmtmbG93X3RhYmxlX2ZpZWxkX2NvZGVdLmZvckVhY2goZnVuY3Rpb24gKHRyKSB7XHJcblx0XHRcdFx0dmFyIG5ld1RyID0ge307XHJcblx0XHRcdFx0Xy5lYWNoKHRyLCBmdW5jdGlvbiAodiwgaykge1xyXG5cdFx0XHRcdFx0dGFibGVGaWVsZE1hcC5mb3JFYWNoKGZ1bmN0aW9uICh0Zm0pIHtcclxuXHRcdFx0XHRcdFx0aWYgKHRmbS53b3JrZmxvd19maWVsZCA9PSAoYy53b3JrZmxvd190YWJsZV9maWVsZF9jb2RlICsgJy4kLicgKyBrKSkge1xyXG5cdFx0XHRcdFx0XHRcdHZhciBvVGRDb2RlID0gdGZtLm9iamVjdF9maWVsZC5zcGxpdCgnLiQuJylbMV07XHJcblx0XHRcdFx0XHRcdFx0bmV3VHJbb1RkQ29kZV0gPSB2O1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdH0pXHJcblx0XHRcdFx0aWYgKCFfLmlzRW1wdHkobmV3VHIpKSB7XHJcblx0XHRcdFx0XHRvYmpbYy5vYmplY3RfdGFibGVfZmllbGRfY29kZV0ucHVzaChuZXdUcik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KVxyXG5cdFx0fSk7XHJcblx0XHR2YXIgcmVsYXRlZE9ianMgPSB7fTtcclxuXHRcdHZhciBnZXRSZWxhdGVkRmllbGRWYWx1ZSA9IGZ1bmN0aW9uICh2YWx1ZUtleSwgcGFyZW50KSB7XHJcblx0XHRcdHJldHVybiB2YWx1ZUtleS5zcGxpdCgnLicpLnJlZHVjZShmdW5jdGlvbiAobywgeCkge1xyXG5cdFx0XHRcdHJldHVybiBvW3hdO1xyXG5cdFx0XHR9LCBwYXJlbnQpO1xyXG5cdFx0fTtcclxuXHRcdF8uZWFjaCh0YWJsZVRvUmVsYXRlZE1hcCwgZnVuY3Rpb24gKG1hcCwga2V5KSB7XHJcblx0XHRcdHZhciB0YWJsZUNvZGUgPSBtYXAuX0ZST01fVEFCTEVfQ09ERTtcclxuXHRcdFx0aWYgKCF0YWJsZUNvZGUpIHtcclxuXHRcdFx0XHRjb25zb2xlLndhcm4oJ3RhYmxlVG9SZWxhdGVkOiBbJyArIGtleSArICddIG1pc3NpbmcgY29ycmVzcG9uZGluZyB0YWJsZS4nKVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHZhciByZWxhdGVkT2JqZWN0TmFtZSA9IGtleTtcclxuXHRcdFx0XHR2YXIgcmVsYXRlZE9iamVjdFZhbHVlcyA9IFtdO1xyXG5cdFx0XHRcdHZhciByZWxhdGVkT2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QocmVsYXRlZE9iamVjdE5hbWUsIHNwYWNlSWQpO1xyXG5cdFx0XHRcdF8uZWFjaCh2YWx1ZXNbdGFibGVDb2RlXSwgZnVuY3Rpb24gKHRhYmxlVmFsdWVJdGVtKSB7XHJcblx0XHRcdFx0XHR2YXIgcmVsYXRlZE9iamVjdFZhbHVlID0ge307XHJcblx0XHRcdFx0XHRfLmVhY2gobWFwLCBmdW5jdGlvbiAodmFsdWVLZXksIGZpZWxkS2V5KSB7XHJcblx0XHRcdFx0XHRcdGlmIChmaWVsZEtleSAhPSAnX0ZST01fVEFCTEVfQ09ERScpIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAodmFsdWVLZXkuc3RhcnRzV2l0aCgnaW5zdGFuY2UuJykpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHJlbGF0ZWRPYmplY3RWYWx1ZVtmaWVsZEtleV0gPSBnZXRSZWxhdGVkRmllbGRWYWx1ZSh2YWx1ZUtleSwgeyAnaW5zdGFuY2UnOiBpbnMgfSk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0dmFyIHJlbGF0ZWRPYmplY3RGaWVsZFZhbHVlLCBmb3JtRmllbGRLZXk7XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAodmFsdWVLZXkuc3RhcnRzV2l0aCh0YWJsZUNvZGUgKyAnLicpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGZvcm1GaWVsZEtleSA9IHZhbHVlS2V5LnNwbGl0KFwiLlwiKVsxXTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0cmVsYXRlZE9iamVjdEZpZWxkVmFsdWUgPSBnZXRSZWxhdGVkRmllbGRWYWx1ZSh2YWx1ZUtleSwgeyBbdGFibGVDb2RlXTogdGFibGVWYWx1ZUl0ZW0gfSk7XHJcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRmb3JtRmllbGRLZXkgPSB2YWx1ZUtleTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0cmVsYXRlZE9iamVjdEZpZWxkVmFsdWUgPSBnZXRSZWxhdGVkRmllbGRWYWx1ZSh2YWx1ZUtleSwgdmFsdWVzKVxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0dmFyIGZvcm1GaWVsZCA9IGdldEZvcm1GaWVsZChmb3JtRmllbGRzLCBmb3JtRmllbGRLZXkpO1xyXG5cdFx0XHRcdFx0XHRcdFx0dmFyIHJlbGF0ZWRPYmplY3RGaWVsZCA9IHJlbGF0ZWRPYmplY3QuZmllbGRzW2ZpZWxkS2V5XTtcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChmb3JtRmllbGQudHlwZSA9PSAnb2RhdGEnICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhyZWxhdGVkT2JqZWN0RmllbGQudHlwZSkpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKCFfLmlzRW1wdHkocmVsYXRlZE9iamVjdEZpZWxkVmFsdWUpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKHJlbGF0ZWRPYmplY3RGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJlbGF0ZWRPYmplY3RGaWVsZFZhbHVlID0gXy5jb21wYWN0KF8ucGx1Y2socmVsYXRlZE9iamVjdEZpZWxkVmFsdWUsICdfaWQnKSlcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCFyZWxhdGVkT2JqZWN0RmllbGQubXVsdGlwbGUgJiYgIWZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmVsYXRlZE9iamVjdEZpZWxkVmFsdWUgPSByZWxhdGVkT2JqZWN0RmllbGRWYWx1ZS5faWRcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdHJlbGF0ZWRPYmplY3RWYWx1ZVtmaWVsZEtleV0gPSByZWxhdGVkT2JqZWN0RmllbGRWYWx1ZTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0cmVsYXRlZE9iamVjdFZhbHVlWydfdGFibGUnXSA9IHtcclxuXHRcdFx0XHRcdFx0X2lkOiB0YWJsZVZhbHVlSXRlbVtcIl9pZFwiXSxcclxuXHRcdFx0XHRcdFx0X2NvZGU6IHRhYmxlQ29kZVxyXG5cdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdHJlbGF0ZWRPYmplY3RWYWx1ZXMucHVzaChyZWxhdGVkT2JqZWN0VmFsdWUpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdHJlbGF0ZWRPYmpzW3JlbGF0ZWRPYmplY3ROYW1lXSA9IHJlbGF0ZWRPYmplY3RWYWx1ZXM7XHJcblx0XHRcdH1cclxuXHRcdH0pXHJcblxyXG5cdFx0aWYgKGZpZWxkX21hcF9iYWNrX3NjcmlwdCkge1xyXG5cdFx0XHRfLmV4dGVuZChvYmosIHNlbGYuZXZhbEZpZWxkTWFwQmFja1NjcmlwdChmaWVsZF9tYXBfYmFja19zY3JpcHQsIGlucykpO1xyXG5cdFx0fVxyXG5cdFx0Ly8g6L+H5ruk5o6J6Z2e5rOV55qEa2V5XHJcblx0XHR2YXIgZmlsdGVyT2JqID0ge307XHJcblxyXG5cdFx0Xy5lYWNoKF8ua2V5cyhvYmopLCBmdW5jdGlvbiAoaykge1xyXG5cdFx0XHRpZiAob2JqZWN0RmllbGRLZXlzLmluY2x1ZGVzKGspKSB7XHJcblx0XHRcdFx0ZmlsdGVyT2JqW2tdID0gb2JqW2tdO1xyXG5cdFx0XHR9XHJcblx0XHRcdC8vIGVsc2UgaWYocmVsYXRlZE9iamVjdHNLZXlzLmluY2x1ZGVzKGspICYmIF8uaXNBcnJheShvYmpba10pKXtcclxuXHRcdFx0Ly8gXHRpZihfLmlzQXJyYXkocmVsYXRlZE9ianNba10pKXtcclxuXHRcdFx0Ly8gXHRcdHJlbGF0ZWRPYmpzW2tdID0gcmVsYXRlZE9ianNba10uY29uY2F0KG9ialtrXSlcclxuXHRcdFx0Ly8gXHR9ZWxzZXtcclxuXHRcdFx0Ly8gXHRcdHJlbGF0ZWRPYmpzW2tdID0gb2JqW2tdXHJcblx0XHRcdC8vIFx0fVxyXG5cdFx0XHQvLyB9XHJcblx0XHR9KVxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0bWFpbk9iamVjdFZhbHVlOiBmaWx0ZXJPYmosXHJcblx0XHRcdHJlbGF0ZWRPYmplY3RzVmFsdWU6IHJlbGF0ZWRPYmpzXHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0c2VsZi5ldmFsRmllbGRNYXBCYWNrU2NyaXB0ID0gZnVuY3Rpb24gKGZpZWxkX21hcF9iYWNrX3NjcmlwdCwgaW5zKSB7XHJcblx0XHR2YXIgc2NyaXB0ID0gXCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpbnN0YW5jZSkgeyBcIiArIGZpZWxkX21hcF9iYWNrX3NjcmlwdCArIFwiIH1cIjtcclxuXHRcdHZhciBmdW5jID0gX2V2YWwoc2NyaXB0LCBcImZpZWxkX21hcF9zY3JpcHRcIik7XHJcblx0XHR2YXIgdmFsdWVzID0gZnVuYyhpbnMpO1xyXG5cdFx0aWYgKF8uaXNPYmplY3QodmFsdWVzKSkge1xyXG5cdFx0XHRyZXR1cm4gdmFsdWVzO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Y29uc29sZS5lcnJvcihcImV2YWxGaWVsZE1hcEJhY2tTY3JpcHQ6IOiEmuacrOi/lOWbnuWAvOexu+Wei+S4jeaYr+WvueixoVwiKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiB7fVxyXG5cdH1cclxuXHJcblx0c2VsZi5zeW5jUmVsYXRlZE9iamVjdHNWYWx1ZSA9IGZ1bmN0aW9uIChtYWluUmVjb3JkSWQsIHJlbGF0ZWRPYmplY3RzLCByZWxhdGVkT2JqZWN0c1ZhbHVlLCBzcGFjZUlkLCBpbnMpIHtcclxuXHRcdHZhciBpbnNJZCA9IGlucy5faWQ7XHJcblxyXG5cdFx0Xy5lYWNoKHJlbGF0ZWRPYmplY3RzLCBmdW5jdGlvbiAocmVsYXRlZE9iamVjdCkge1xyXG5cdFx0XHR2YXIgb2JqZWN0Q29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWxhdGVkT2JqZWN0Lm9iamVjdF9uYW1lLCBzcGFjZUlkKTtcclxuXHRcdFx0dmFyIHRhYmxlTWFwID0ge307XHJcblx0XHRcdF8uZWFjaChyZWxhdGVkT2JqZWN0c1ZhbHVlW3JlbGF0ZWRPYmplY3Qub2JqZWN0X25hbWVdLCBmdW5jdGlvbiAocmVsYXRlZE9iamVjdFZhbHVlKSB7XHJcblx0XHRcdFx0dmFyIHRhYmxlX2lkID0gcmVsYXRlZE9iamVjdFZhbHVlLl90YWJsZS5faWQ7XHJcblx0XHRcdFx0dmFyIHRhYmxlX2NvZGUgPSByZWxhdGVkT2JqZWN0VmFsdWUuX3RhYmxlLl9jb2RlO1xyXG5cdFx0XHRcdGlmICghdGFibGVNYXBbdGFibGVfY29kZV0pIHtcclxuXHRcdFx0XHRcdHRhYmxlTWFwW3RhYmxlX2NvZGVdID0gW11cclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdHRhYmxlTWFwW3RhYmxlX2NvZGVdLnB1c2godGFibGVfaWQpO1xyXG5cdFx0XHRcdHZhciBvbGRSZWxhdGVkUmVjb3JkID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlbGF0ZWRPYmplY3Qub2JqZWN0X25hbWUsIHNwYWNlSWQpLmZpbmRPbmUoeyBbcmVsYXRlZE9iamVjdC5mb3JlaWduX2tleV06IG1haW5SZWNvcmRJZCwgXCJpbnN0YW5jZXMuX2lkXCI6IGluc0lkLCBfdGFibGU6IHJlbGF0ZWRPYmplY3RWYWx1ZS5fdGFibGUgfSwgeyBmaWVsZHM6IHsgX2lkOiAxIH0gfSlcclxuXHRcdFx0XHRpZiAob2xkUmVsYXRlZFJlY29yZCkge1xyXG5cdFx0XHRcdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlbGF0ZWRPYmplY3Qub2JqZWN0X25hbWUsIHNwYWNlSWQpLnVwZGF0ZSh7IF9pZDogb2xkUmVsYXRlZFJlY29yZC5faWQgfSwgeyAkc2V0OiByZWxhdGVkT2JqZWN0VmFsdWUgfSlcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0cmVsYXRlZE9iamVjdFZhbHVlW3JlbGF0ZWRPYmplY3QuZm9yZWlnbl9rZXldID0gbWFpblJlY29yZElkO1xyXG5cdFx0XHRcdFx0cmVsYXRlZE9iamVjdFZhbHVlLnNwYWNlID0gc3BhY2VJZDtcclxuXHRcdFx0XHRcdHJlbGF0ZWRPYmplY3RWYWx1ZS5vd25lciA9IGlucy5hcHBsaWNhbnQ7XHJcblx0XHRcdFx0XHRyZWxhdGVkT2JqZWN0VmFsdWUuY3JlYXRlZF9ieSA9IGlucy5hcHBsaWNhbnQ7XHJcblx0XHRcdFx0XHRyZWxhdGVkT2JqZWN0VmFsdWUubW9kaWZpZWRfYnkgPSBpbnMuYXBwbGljYW50O1xyXG5cdFx0XHRcdFx0cmVsYXRlZE9iamVjdFZhbHVlLl9pZCA9IG9iamVjdENvbGxlY3Rpb24uX21ha2VOZXdJRCgpO1xyXG5cdFx0XHRcdFx0dmFyIGluc3RhbmNlX3N0YXRlID0gaW5zLnN0YXRlO1xyXG5cdFx0XHRcdFx0aWYgKGlucy5zdGF0ZSA9PT0gJ2NvbXBsZXRlZCcgJiYgaW5zLmZpbmFsX2RlY2lzaW9uKSB7XHJcblx0XHRcdFx0XHRcdGluc3RhbmNlX3N0YXRlID0gaW5zLmZpbmFsX2RlY2lzaW9uO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0cmVsYXRlZE9iamVjdFZhbHVlLmluc3RhbmNlcyA9IFt7XHJcblx0XHRcdFx0XHRcdF9pZDogaW5zSWQsXHJcblx0XHRcdFx0XHRcdHN0YXRlOiBpbnN0YW5jZV9zdGF0ZVxyXG5cdFx0XHRcdFx0fV07XHJcblx0XHRcdFx0XHRyZWxhdGVkT2JqZWN0VmFsdWUuaW5zdGFuY2Vfc3RhdGUgPSBpbnN0YW5jZV9zdGF0ZTtcclxuXHRcdFx0XHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWxhdGVkT2JqZWN0Lm9iamVjdF9uYW1lLCBzcGFjZUlkKS5pbnNlcnQocmVsYXRlZE9iamVjdFZhbHVlLCB7IHZhbGlkYXRlOiBmYWxzZSwgZmlsdGVyOiBmYWxzZSB9KVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHRcdFx0Ly/muIXnkIbnlLPor7fljZXkuIrooqvliKDpmaTlrZDooajorrDlvZXlr7nlupTnmoTnm7jlhbPooajorrDlvZVcclxuXHRcdFx0Xy5lYWNoKHRhYmxlTWFwLCBmdW5jdGlvbiAodGFibGVJZHMsIHRhYmxlQ29kZSkge1xyXG5cdFx0XHRcdG9iamVjdENvbGxlY3Rpb24ucmVtb3ZlKHtcclxuXHRcdFx0XHRcdFtyZWxhdGVkT2JqZWN0LmZvcmVpZ25fa2V5XTogbWFpblJlY29yZElkLFxyXG5cdFx0XHRcdFx0XCJpbnN0YW5jZXMuX2lkXCI6IGluc0lkLFxyXG5cdFx0XHRcdFx0XCJfdGFibGUuX2NvZGVcIjogdGFibGVDb2RlLFxyXG5cdFx0XHRcdFx0XCJfdGFibGUuX2lkXCI6IHsgJG5pbjogdGFibGVJZHMgfVxyXG5cdFx0XHRcdH0pXHJcblx0XHRcdH0pXHJcblx0XHR9KTtcclxuXHJcblx0XHR0YWJsZUlkcyA9IF8uY29tcGFjdCh0YWJsZUlkcyk7XHJcblxyXG5cclxuXHR9XHJcblxyXG5cdHNlbGYuc2VuZERvYyA9IGZ1bmN0aW9uIChkb2MpIHtcclxuXHRcdGlmIChJbnN0YW5jZVJlY29yZFF1ZXVlLmRlYnVnKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKFwic2VuZERvY1wiKTtcclxuXHRcdFx0Y29uc29sZS5sb2coZG9jKTtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgaW5zSWQgPSBkb2MuaW5mby5pbnN0YW5jZV9pZCxcclxuXHRcdFx0cmVjb3JkcyA9IGRvYy5pbmZvLnJlY29yZHM7XHJcblx0XHR2YXIgZmllbGRzID0ge1xyXG5cdFx0XHRmbG93OiAxLFxyXG5cdFx0XHR2YWx1ZXM6IDEsXHJcblx0XHRcdGFwcGxpY2FudDogMSxcclxuXHRcdFx0c3BhY2U6IDEsXHJcblx0XHRcdGZvcm06IDEsXHJcblx0XHRcdGZvcm1fdmVyc2lvbjogMSxcclxuXHRcdFx0dHJhY2VzOiAxXHJcblx0XHR9O1xyXG5cdFx0c2VsZi5zeW5jSW5zRmllbGRzLmZvckVhY2goZnVuY3Rpb24gKGYpIHtcclxuXHRcdFx0ZmllbGRzW2ZdID0gMTtcclxuXHRcdH0pXHJcblx0XHR2YXIgaW5zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdpbnN0YW5jZXMnKS5maW5kT25lKGluc0lkLCB7XHJcblx0XHRcdGZpZWxkczogZmllbGRzXHJcblx0XHR9KTtcclxuXHRcdHZhciB2YWx1ZXMgPSBpbnMudmFsdWVzLFxyXG5cdFx0XHRzcGFjZUlkID0gaW5zLnNwYWNlO1xyXG5cclxuXHRcdGlmIChyZWNvcmRzICYmICFfLmlzRW1wdHkocmVjb3JkcykpIHtcclxuXHRcdFx0Ly8g5q2k5oOF5Ya15bGe5LqO5LuOY3JlYXRvcuS4reWPkei1t+WuoeaJue+8jOaIluiAheW3sue7j+S7jkFwcHPlkIzmraXliLDkuoZjcmVhdG9yXHJcblx0XHRcdHZhciBvYmplY3ROYW1lID0gcmVjb3Jkc1swXS5vO1xyXG5cdFx0XHR2YXIgb3cgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ29iamVjdF93b3JrZmxvd3MnKS5maW5kT25lKHtcclxuXHRcdFx0XHRvYmplY3RfbmFtZTogb2JqZWN0TmFtZSxcclxuXHRcdFx0XHRmbG93X2lkOiBpbnMuZmxvd1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0dmFyXHJcblx0XHRcdFx0b2JqZWN0Q29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3ROYW1lLCBzcGFjZUlkKSxcclxuXHRcdFx0XHRzeW5jX2F0dGFjaG1lbnQgPSBvdy5zeW5jX2F0dGFjaG1lbnQ7XHJcblx0XHRcdHZhciBvYmplY3RJbmZvID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0TmFtZSwgc3BhY2VJZCk7XHJcblx0XHRcdG9iamVjdENvbGxlY3Rpb24uZmluZCh7XHJcblx0XHRcdFx0X2lkOiB7XHJcblx0XHRcdFx0XHQkaW46IHJlY29yZHNbMF0uaWRzXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KS5mb3JFYWNoKGZ1bmN0aW9uIChyZWNvcmQpIHtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0dmFyIHN5bmNWYWx1ZXMgPSBzZWxmLnN5bmNWYWx1ZXMob3cuZmllbGRfbWFwX2JhY2ssIHZhbHVlcywgaW5zLCBvYmplY3RJbmZvLCBvdy5maWVsZF9tYXBfYmFja19zY3JpcHQsIHJlY29yZClcclxuXHRcdFx0XHRcdHZhciBzZXRPYmogPSBzeW5jVmFsdWVzLm1haW5PYmplY3RWYWx1ZTtcclxuXHJcblx0XHRcdFx0XHR2YXIgaW5zdGFuY2Vfc3RhdGUgPSBpbnMuc3RhdGU7XHJcblx0XHRcdFx0XHRpZiAoaW5zLnN0YXRlID09PSAnY29tcGxldGVkJyAmJiBpbnMuZmluYWxfZGVjaXNpb24pIHtcclxuXHRcdFx0XHRcdFx0aW5zdGFuY2Vfc3RhdGUgPSBpbnMuZmluYWxfZGVjaXNpb247XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRzZXRPYmpbJ2luc3RhbmNlcy4kLnN0YXRlJ10gPSBzZXRPYmouaW5zdGFuY2Vfc3RhdGUgPSBpbnN0YW5jZV9zdGF0ZTtcclxuXHJcblx0XHRcdFx0XHRvYmplY3RDb2xsZWN0aW9uLnVwZGF0ZSh7XHJcblx0XHRcdFx0XHRcdF9pZDogcmVjb3JkLl9pZCxcclxuXHRcdFx0XHRcdFx0J2luc3RhbmNlcy5faWQnOiBpbnNJZFxyXG5cdFx0XHRcdFx0fSwge1xyXG5cdFx0XHRcdFx0XHQkc2V0OiBzZXRPYmpcclxuXHRcdFx0XHRcdH0pXHJcblxyXG5cdFx0XHRcdFx0dmFyIHJlbGF0ZWRPYmplY3RzID0gQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0cyhvdy5vYmplY3RfbmFtZSwgc3BhY2VJZCk7XHJcblx0XHRcdFx0XHR2YXIgcmVsYXRlZE9iamVjdHNWYWx1ZSA9IHN5bmNWYWx1ZXMucmVsYXRlZE9iamVjdHNWYWx1ZTtcclxuXHRcdFx0XHRcdHNlbGYuc3luY1JlbGF0ZWRPYmplY3RzVmFsdWUocmVjb3JkLl9pZCwgcmVsYXRlZE9iamVjdHMsIHJlbGF0ZWRPYmplY3RzVmFsdWUsIHNwYWNlSWQsIGlucyk7XHJcblxyXG5cclxuXHRcdFx0XHRcdC8vIOS7peacgOe7iOeUs+ivt+WNlemZhOS7tuS4uuWHhu+8jOaXp+eahHJlY29yZOS4remZhOS7tuWIoOmZpFxyXG5cdFx0XHRcdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKCdjbXNfZmlsZXMnKS5yZW1vdmUoe1xyXG5cdFx0XHRcdFx0XHQncGFyZW50Jzoge1xyXG5cdFx0XHRcdFx0XHRcdG86IG9iamVjdE5hbWUsXHJcblx0XHRcdFx0XHRcdFx0aWRzOiBbcmVjb3JkLl9pZF1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdGNmcy5maWxlcy5yZW1vdmUoe1xyXG5cdFx0XHRcdFx0XHQnbWV0YWRhdGEucmVjb3JkX2lkJzogcmVjb3JkLl9pZFxyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdC8vIOWQjOatpeaWsOmZhOS7tlxyXG5cdFx0XHRcdFx0c2VsZi5zeW5jQXR0YWNoKHN5bmNfYXR0YWNobWVudCwgaW5zSWQsIHJlY29yZC5zcGFjZSwgcmVjb3JkLl9pZCwgb2JqZWN0TmFtZSk7XHJcblx0XHRcdFx0fSBjYXRjaCAoZXJyb3IpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoZXJyb3Iuc3RhY2spO1xyXG5cdFx0XHRcdFx0b2JqZWN0Q29sbGVjdGlvbi51cGRhdGUoe1xyXG5cdFx0XHRcdFx0XHRfaWQ6IHJlY29yZC5faWQsXHJcblx0XHRcdFx0XHRcdCdpbnN0YW5jZXMuX2lkJzogaW5zSWRcclxuXHRcdFx0XHRcdH0sIHtcclxuXHRcdFx0XHRcdFx0JHNldDoge1xyXG5cdFx0XHRcdFx0XHRcdCdpbnN0YW5jZXMuJC5zdGF0ZSc6ICdwZW5kaW5nJyxcclxuXHRcdFx0XHRcdFx0XHQnaW5zdGFuY2Vfc3RhdGUnOiAncGVuZGluZydcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSlcclxuXHJcblx0XHRcdFx0XHRDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2Ntc19maWxlcycpLnJlbW92ZSh7XHJcblx0XHRcdFx0XHRcdCdwYXJlbnQnOiB7XHJcblx0XHRcdFx0XHRcdFx0bzogb2JqZWN0TmFtZSxcclxuXHRcdFx0XHRcdFx0XHRpZHM6IFtyZWNvcmQuX2lkXVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0Y2ZzLmZpbGVzLnJlbW92ZSh7XHJcblx0XHRcdFx0XHRcdCdtZXRhZGF0YS5yZWNvcmRfaWQnOiByZWNvcmQuX2lkXHJcblx0XHRcdFx0XHR9KVxyXG5cclxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihlcnJvcik7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fSlcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdC8vIOatpOaDheWGteWxnuS6juS7jmFwcHPkuK3lj5HotbflrqHmiblcclxuXHRcdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKCdvYmplY3Rfd29ya2Zsb3dzJykuZmluZCh7XHJcblx0XHRcdFx0Zmxvd19pZDogaW5zLmZsb3dcclxuXHRcdFx0fSkuZm9yRWFjaChmdW5jdGlvbiAob3cpIHtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0dmFyXHJcblx0XHRcdFx0XHRcdG9iamVjdENvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob3cub2JqZWN0X25hbWUsIHNwYWNlSWQpLFxyXG5cdFx0XHRcdFx0XHRzeW5jX2F0dGFjaG1lbnQgPSBvdy5zeW5jX2F0dGFjaG1lbnQsXHJcblx0XHRcdFx0XHRcdG5ld1JlY29yZElkID0gb2JqZWN0Q29sbGVjdGlvbi5fbWFrZU5ld0lEKCksXHJcblx0XHRcdFx0XHRcdG9iamVjdE5hbWUgPSBvdy5vYmplY3RfbmFtZTtcclxuXHJcblx0XHRcdFx0XHR2YXIgb2JqZWN0SW5mbyA9IENyZWF0b3IuZ2V0T2JqZWN0KG93Lm9iamVjdF9uYW1lLCBzcGFjZUlkKTtcclxuXHRcdFx0XHRcdHZhciBzeW5jVmFsdWVzID0gc2VsZi5zeW5jVmFsdWVzKG93LmZpZWxkX21hcF9iYWNrLCB2YWx1ZXMsIGlucywgb2JqZWN0SW5mbywgb3cuZmllbGRfbWFwX2JhY2tfc2NyaXB0KTtcclxuXHRcdFx0XHRcdHZhciBuZXdPYmogPSBzeW5jVmFsdWVzLm1haW5PYmplY3RWYWx1ZTtcclxuXHJcblx0XHRcdFx0XHRuZXdPYmouX2lkID0gbmV3UmVjb3JkSWQ7XHJcblx0XHRcdFx0XHRuZXdPYmouc3BhY2UgPSBzcGFjZUlkO1xyXG5cdFx0XHRcdFx0bmV3T2JqLm5hbWUgPSBuZXdPYmoubmFtZSB8fCBpbnMubmFtZTtcclxuXHJcblx0XHRcdFx0XHR2YXIgaW5zdGFuY2Vfc3RhdGUgPSBpbnMuc3RhdGU7XHJcblx0XHRcdFx0XHRpZiAoaW5zLnN0YXRlID09PSAnY29tcGxldGVkJyAmJiBpbnMuZmluYWxfZGVjaXNpb24pIHtcclxuXHRcdFx0XHRcdFx0aW5zdGFuY2Vfc3RhdGUgPSBpbnMuZmluYWxfZGVjaXNpb247XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRuZXdPYmouaW5zdGFuY2VzID0gW3tcclxuXHRcdFx0XHRcdFx0X2lkOiBpbnNJZCxcclxuXHRcdFx0XHRcdFx0c3RhdGU6IGluc3RhbmNlX3N0YXRlXHJcblx0XHRcdFx0XHR9XTtcclxuXHRcdFx0XHRcdG5ld09iai5pbnN0YW5jZV9zdGF0ZSA9IGluc3RhbmNlX3N0YXRlO1xyXG5cclxuXHRcdFx0XHRcdG5ld09iai5vd25lciA9IGlucy5hcHBsaWNhbnQ7XHJcblx0XHRcdFx0XHRuZXdPYmouY3JlYXRlZF9ieSA9IGlucy5hcHBsaWNhbnQ7XHJcblx0XHRcdFx0XHRuZXdPYmoubW9kaWZpZWRfYnkgPSBpbnMuYXBwbGljYW50O1xyXG5cdFx0XHRcdFx0dmFyIHIgPSBvYmplY3RDb2xsZWN0aW9uLmluc2VydChuZXdPYmopO1xyXG5cdFx0XHRcdFx0aWYgKHIpIHtcclxuXHRcdFx0XHRcdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKCdpbnN0YW5jZXMnKS51cGRhdGUoaW5zLl9pZCwge1xyXG5cdFx0XHRcdFx0XHRcdCRwdXNoOiB7XHJcblx0XHRcdFx0XHRcdFx0XHRyZWNvcmRfaWRzOiB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdG86IG9iamVjdE5hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdGlkczogW25ld1JlY29yZElkXVxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdFx0dmFyIHJlbGF0ZWRPYmplY3RzID0gQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0cyhvdy5vYmplY3RfbmFtZSwgc3BhY2VJZCk7XHJcblx0XHRcdFx0XHRcdHZhciByZWxhdGVkT2JqZWN0c1ZhbHVlID0gc3luY1ZhbHVlcy5yZWxhdGVkT2JqZWN0c1ZhbHVlO1xyXG5cdFx0XHRcdFx0XHRzZWxmLnN5bmNSZWxhdGVkT2JqZWN0c1ZhbHVlKG5ld1JlY29yZElkLCByZWxhdGVkT2JqZWN0cywgcmVsYXRlZE9iamVjdHNWYWx1ZSwgc3BhY2VJZCwgaW5zKTtcclxuXHRcdFx0XHRcdFx0Ly8gd29ya2Zsb3fph4zlj5HotbflrqHmibnlkI7vvIzlkIzmraXml7bkuZ/lj6/ku6Xkv67mlLnnm7jlhbPooajnmoTlrZfmrrXlgLwgIzExODNcclxuXHRcdFx0XHRcdFx0dmFyIHJlY29yZCA9IG9iamVjdENvbGxlY3Rpb24uZmluZE9uZShuZXdSZWNvcmRJZCk7XHJcblx0XHRcdFx0XHRcdHNlbGYuc3luY1ZhbHVlcyhvdy5maWVsZF9tYXBfYmFjaywgdmFsdWVzLCBpbnMsIG9iamVjdEluZm8sIG93LmZpZWxkX21hcF9iYWNrX3NjcmlwdCwgcmVjb3JkKTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHQvLyDpmYTku7blkIzmraVcclxuXHRcdFx0XHRcdHNlbGYuc3luY0F0dGFjaChzeW5jX2F0dGFjaG1lbnQsIGluc0lkLCBzcGFjZUlkLCBuZXdSZWNvcmRJZCwgb2JqZWN0TmFtZSk7XHJcblxyXG5cdFx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKGVycm9yLnN0YWNrKTtcclxuXHJcblx0XHRcdFx0XHRvYmplY3RDb2xsZWN0aW9uLnJlbW92ZSh7XHJcblx0XHRcdFx0XHRcdF9pZDogbmV3UmVjb3JkSWQsXHJcblx0XHRcdFx0XHRcdHNwYWNlOiBzcGFjZUlkXHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbignaW5zdGFuY2VzJykudXBkYXRlKGlucy5faWQsIHtcclxuXHRcdFx0XHRcdFx0JHB1bGw6IHtcclxuXHRcdFx0XHRcdFx0XHRyZWNvcmRfaWRzOiB7XHJcblx0XHRcdFx0XHRcdFx0XHRvOiBvYmplY3ROYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0aWRzOiBbbmV3UmVjb3JkSWRdXHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKCdjbXNfZmlsZXMnKS5yZW1vdmUoe1xyXG5cdFx0XHRcdFx0XHQncGFyZW50Jzoge1xyXG5cdFx0XHRcdFx0XHRcdG86IG9iamVjdE5hbWUsXHJcblx0XHRcdFx0XHRcdFx0aWRzOiBbbmV3UmVjb3JkSWRdXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHRjZnMuZmlsZXMucmVtb3ZlKHtcclxuXHRcdFx0XHRcdFx0J21ldGFkYXRhLnJlY29yZF9pZCc6IG5ld1JlY29yZElkXHJcblx0XHRcdFx0XHR9KVxyXG5cclxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihlcnJvcik7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fSlcclxuXHRcdH1cclxuXHJcblx0XHRJbnN0YW5jZVJlY29yZFF1ZXVlLmNvbGxlY3Rpb24udXBkYXRlKGRvYy5faWQsIHtcclxuXHRcdFx0JHNldDoge1xyXG5cdFx0XHRcdCdpbmZvLnN5bmNfZGF0ZSc6IG5ldyBEYXRlKClcclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHJcblx0fVxyXG5cclxuXHQvLyBVbml2ZXJzYWwgc2VuZCBmdW5jdGlvblxyXG5cdHZhciBfcXVlcnlTZW5kID0gZnVuY3Rpb24gKGRvYykge1xyXG5cclxuXHRcdGlmIChzZWxmLnNlbmREb2MpIHtcclxuXHRcdFx0c2VsZi5zZW5kRG9jKGRvYyk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0ZG9jOiBbZG9jLl9pZF1cclxuXHRcdH07XHJcblx0fTtcclxuXHJcblx0c2VsZi5zZXJ2ZXJTZW5kID0gZnVuY3Rpb24gKGRvYykge1xyXG5cdFx0ZG9jID0gZG9jIHx8IHt9O1xyXG5cdFx0cmV0dXJuIF9xdWVyeVNlbmQoZG9jKTtcclxuXHR9O1xyXG5cclxuXHJcblx0Ly8gVGhpcyBpbnRlcnZhbCB3aWxsIGFsbG93IG9ubHkgb25lIGRvYyB0byBiZSBzZW50IGF0IGEgdGltZSwgaXRcclxuXHQvLyB3aWxsIGNoZWNrIGZvciBuZXcgZG9jcyBhdCBldmVyeSBgb3B0aW9ucy5zZW5kSW50ZXJ2YWxgXHJcblx0Ly8gKGRlZmF1bHQgaW50ZXJ2YWwgaXMgMTUwMDAgbXMpXHJcblx0Ly9cclxuXHQvLyBJdCBsb29rcyBpbiBkb2NzIGNvbGxlY3Rpb24gdG8gc2VlIGlmIHRoZXJlcyBhbnkgcGVuZGluZ1xyXG5cdC8vIGRvY3MsIGlmIHNvIGl0IHdpbGwgdHJ5IHRvIHJlc2VydmUgdGhlIHBlbmRpbmcgZG9jLlxyXG5cdC8vIElmIHN1Y2Nlc3NmdWxseSByZXNlcnZlZCB0aGUgc2VuZCBpcyBzdGFydGVkLlxyXG5cdC8vXHJcblx0Ly8gSWYgZG9jLnF1ZXJ5IGlzIHR5cGUgc3RyaW5nLCBpdCdzIGFzc3VtZWQgdG8gYmUgYSBqc29uIHN0cmluZ1xyXG5cdC8vIHZlcnNpb24gb2YgdGhlIHF1ZXJ5IHNlbGVjdG9yLiBNYWtpbmcgaXQgYWJsZSB0byBjYXJyeSBgJGAgcHJvcGVydGllcyBpblxyXG5cdC8vIHRoZSBtb25nbyBjb2xsZWN0aW9uLlxyXG5cdC8vXHJcblx0Ly8gUHIuIGRlZmF1bHQgZG9jcyBhcmUgcmVtb3ZlZCBmcm9tIHRoZSBjb2xsZWN0aW9uIGFmdGVyIHNlbmQgaGF2ZVxyXG5cdC8vIGNvbXBsZXRlZC4gU2V0dGluZyBgb3B0aW9ucy5rZWVwRG9jc2Agd2lsbCB1cGRhdGUgYW5kIGtlZXAgdGhlXHJcblx0Ly8gZG9jIGVnLiBpZiBuZWVkZWQgZm9yIGhpc3RvcmljYWwgcmVhc29ucy5cclxuXHQvL1xyXG5cdC8vIEFmdGVyIHRoZSBzZW5kIGhhdmUgY29tcGxldGVkIGEgXCJzZW5kXCIgZXZlbnQgd2lsbCBiZSBlbWl0dGVkIHdpdGggYVxyXG5cdC8vIHN0YXR1cyBvYmplY3QgY29udGFpbmluZyBkb2MgaWQgYW5kIHRoZSBzZW5kIHJlc3VsdCBvYmplY3QuXHJcblx0Ly9cclxuXHR2YXIgaXNTZW5kaW5nRG9jID0gZmFsc2U7XHJcblxyXG5cdGlmIChvcHRpb25zLnNlbmRJbnRlcnZhbCAhPT0gbnVsbCkge1xyXG5cclxuXHRcdC8vIFRoaXMgd2lsbCByZXF1aXJlIGluZGV4IHNpbmNlIHdlIHNvcnQgZG9jcyBieSBjcmVhdGVkQXRcclxuXHRcdEluc3RhbmNlUmVjb3JkUXVldWUuY29sbGVjdGlvbi5fZW5zdXJlSW5kZXgoe1xyXG5cdFx0XHRjcmVhdGVkQXQ6IDFcclxuXHRcdH0pO1xyXG5cdFx0SW5zdGFuY2VSZWNvcmRRdWV1ZS5jb2xsZWN0aW9uLl9lbnN1cmVJbmRleCh7XHJcblx0XHRcdHNlbnQ6IDFcclxuXHRcdH0pO1xyXG5cdFx0SW5zdGFuY2VSZWNvcmRRdWV1ZS5jb2xsZWN0aW9uLl9lbnN1cmVJbmRleCh7XHJcblx0XHRcdHNlbmRpbmc6IDFcclxuXHRcdH0pO1xyXG5cclxuXHJcblx0XHR2YXIgc2VuZERvYyA9IGZ1bmN0aW9uIChkb2MpIHtcclxuXHRcdFx0Ly8gUmVzZXJ2ZSBkb2NcclxuXHRcdFx0dmFyIG5vdyA9ICtuZXcgRGF0ZSgpO1xyXG5cdFx0XHR2YXIgdGltZW91dEF0ID0gbm93ICsgb3B0aW9ucy5zZW5kVGltZW91dDtcclxuXHRcdFx0dmFyIHJlc2VydmVkID0gSW5zdGFuY2VSZWNvcmRRdWV1ZS5jb2xsZWN0aW9uLnVwZGF0ZSh7XHJcblx0XHRcdFx0X2lkOiBkb2MuX2lkLFxyXG5cdFx0XHRcdHNlbnQ6IGZhbHNlLCAvLyB4eHg6IG5lZWQgdG8gbWFrZSBzdXJlIHRoaXMgaXMgc2V0IG9uIGNyZWF0ZVxyXG5cdFx0XHRcdHNlbmRpbmc6IHtcclxuXHRcdFx0XHRcdCRsdDogbm93XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LCB7XHJcblx0XHRcdFx0JHNldDoge1xyXG5cdFx0XHRcdFx0c2VuZGluZzogdGltZW91dEF0LFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHQvLyBNYWtlIHN1cmUgd2Ugb25seSBoYW5kbGUgZG9jcyByZXNlcnZlZCBieSB0aGlzXHJcblx0XHRcdC8vIGluc3RhbmNlXHJcblx0XHRcdGlmIChyZXNlcnZlZCkge1xyXG5cclxuXHRcdFx0XHQvLyBTZW5kXHJcblx0XHRcdFx0dmFyIHJlc3VsdCA9IEluc3RhbmNlUmVjb3JkUXVldWUuc2VydmVyU2VuZChkb2MpO1xyXG5cclxuXHRcdFx0XHRpZiAoIW9wdGlvbnMua2VlcERvY3MpIHtcclxuXHRcdFx0XHRcdC8vIFByLiBEZWZhdWx0IHdlIHdpbGwgcmVtb3ZlIGRvY3NcclxuXHRcdFx0XHRcdEluc3RhbmNlUmVjb3JkUXVldWUuY29sbGVjdGlvbi5yZW1vdmUoe1xyXG5cdFx0XHRcdFx0XHRfaWQ6IGRvYy5faWRcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblxyXG5cdFx0XHRcdFx0Ly8gVXBkYXRlXHJcblx0XHRcdFx0XHRJbnN0YW5jZVJlY29yZFF1ZXVlLmNvbGxlY3Rpb24udXBkYXRlKHtcclxuXHRcdFx0XHRcdFx0X2lkOiBkb2MuX2lkXHJcblx0XHRcdFx0XHR9LCB7XHJcblx0XHRcdFx0XHRcdCRzZXQ6IHtcclxuXHRcdFx0XHRcdFx0XHQvLyBNYXJrIGFzIHNlbnRcclxuXHRcdFx0XHRcdFx0XHRzZW50OiB0cnVlLFxyXG5cdFx0XHRcdFx0XHRcdC8vIFNldCB0aGUgc2VudCBkYXRlXHJcblx0XHRcdFx0XHRcdFx0c2VudEF0OiBuZXcgRGF0ZSgpLFxyXG5cdFx0XHRcdFx0XHRcdC8vIE5vdCBiZWluZyBzZW50IGFueW1vcmVcclxuXHRcdFx0XHRcdFx0XHRzZW5kaW5nOiAwXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdC8vIC8vIEVtaXQgdGhlIHNlbmRcclxuXHRcdFx0XHQvLyBzZWxmLmVtaXQoJ3NlbmQnLCB7XHJcblx0XHRcdFx0Ly8gXHRkb2M6IGRvYy5faWQsXHJcblx0XHRcdFx0Ly8gXHRyZXN1bHQ6IHJlc3VsdFxyXG5cdFx0XHRcdC8vIH0pO1xyXG5cclxuXHRcdFx0fSAvLyBFbHNlIGNvdWxkIG5vdCByZXNlcnZlXHJcblx0XHR9OyAvLyBFTyBzZW5kRG9jXHJcblxyXG5cdFx0c2VuZFdvcmtlcihmdW5jdGlvbiAoKSB7XHJcblxyXG5cdFx0XHRpZiAoaXNTZW5kaW5nRG9jKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdC8vIFNldCBzZW5kIGZlbmNlXHJcblx0XHRcdGlzU2VuZGluZ0RvYyA9IHRydWU7XHJcblxyXG5cdFx0XHR2YXIgYmF0Y2hTaXplID0gb3B0aW9ucy5zZW5kQmF0Y2hTaXplIHx8IDE7XHJcblxyXG5cdFx0XHR2YXIgbm93ID0gK25ldyBEYXRlKCk7XHJcblxyXG5cdFx0XHQvLyBGaW5kIGRvY3MgdGhhdCBhcmUgbm90IGJlaW5nIG9yIGFscmVhZHkgc2VudFxyXG5cdFx0XHR2YXIgcGVuZGluZ0RvY3MgPSBJbnN0YW5jZVJlY29yZFF1ZXVlLmNvbGxlY3Rpb24uZmluZCh7XHJcblx0XHRcdFx0JGFuZDogW1xyXG5cdFx0XHRcdFx0Ly8gTWVzc2FnZSBpcyBub3Qgc2VudFxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRzZW50OiBmYWxzZVxyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdC8vIEFuZCBub3QgYmVpbmcgc2VudCBieSBvdGhlciBpbnN0YW5jZXNcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0c2VuZGluZzoge1xyXG5cdFx0XHRcdFx0XHRcdCRsdDogbm93XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHQvLyBBbmQgbm8gZXJyb3JcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0ZXJyTXNnOiB7XHJcblx0XHRcdFx0XHRcdFx0JGV4aXN0czogZmFsc2VcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdF1cclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdC8vIFNvcnQgYnkgY3JlYXRlZCBkYXRlXHJcblx0XHRcdFx0c29ydDoge1xyXG5cdFx0XHRcdFx0Y3JlYXRlZEF0OiAxXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRsaW1pdDogYmF0Y2hTaXplXHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0cGVuZGluZ0RvY3MuZm9yRWFjaChmdW5jdGlvbiAoZG9jKSB7XHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdHNlbmREb2MoZG9jKTtcclxuXHRcdFx0XHR9IGNhdGNoIChlcnJvcikge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvcihlcnJvci5zdGFjayk7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnSW5zdGFuY2VSZWNvcmRRdWV1ZTogQ291bGQgbm90IHNlbmQgZG9jIGlkOiBcIicgKyBkb2MuX2lkICsgJ1wiLCBFcnJvcjogJyArIGVycm9yLm1lc3NhZ2UpO1xyXG5cdFx0XHRcdFx0SW5zdGFuY2VSZWNvcmRRdWV1ZS5jb2xsZWN0aW9uLnVwZGF0ZSh7XHJcblx0XHRcdFx0XHRcdF9pZDogZG9jLl9pZFxyXG5cdFx0XHRcdFx0fSwge1xyXG5cdFx0XHRcdFx0XHQkc2V0OiB7XHJcblx0XHRcdFx0XHRcdFx0Ly8gZXJyb3IgbWVzc2FnZVxyXG5cdFx0XHRcdFx0XHRcdGVyck1zZzogZXJyb3IubWVzc2FnZVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pOyAvLyBFTyBmb3JFYWNoXHJcblxyXG5cdFx0XHQvLyBSZW1vdmUgdGhlIHNlbmQgZmVuY2VcclxuXHRcdFx0aXNTZW5kaW5nRG9jID0gZmFsc2U7XHJcblx0XHR9LCBvcHRpb25zLnNlbmRJbnRlcnZhbCB8fCAxNTAwMCk7IC8vIERlZmF1bHQgZXZlcnkgMTV0aCBzZWNcclxuXHJcblx0fSBlbHNlIHtcclxuXHRcdGlmIChJbnN0YW5jZVJlY29yZFF1ZXVlLmRlYnVnKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKCdJbnN0YW5jZVJlY29yZFF1ZXVlOiBTZW5kIHNlcnZlciBpcyBkaXNhYmxlZCcpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcbn07IiwiTWV0ZW9yLnN0YXJ0dXAgLT5cclxuXHRpZiBNZXRlb3Iuc2V0dGluZ3MuY3Jvbj8uaW5zdGFuY2VyZWNvcmRxdWV1ZV9pbnRlcnZhbFxyXG5cdFx0SW5zdGFuY2VSZWNvcmRRdWV1ZS5Db25maWd1cmVcclxuXHRcdFx0c2VuZEludGVydmFsOiBNZXRlb3Iuc2V0dGluZ3MuY3Jvbi5pbnN0YW5jZXJlY29yZHF1ZXVlX2ludGVydmFsXHJcblx0XHRcdHNlbmRCYXRjaFNpemU6IDEwXHJcblx0XHRcdGtlZXBEb2NzOiB0cnVlXHJcbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICB2YXIgcmVmO1xuICBpZiAoKHJlZiA9IE1ldGVvci5zZXR0aW5ncy5jcm9uKSAhPSBudWxsID8gcmVmLmluc3RhbmNlcmVjb3JkcXVldWVfaW50ZXJ2YWwgOiB2b2lkIDApIHtcbiAgICByZXR1cm4gSW5zdGFuY2VSZWNvcmRRdWV1ZS5Db25maWd1cmUoe1xuICAgICAgc2VuZEludGVydmFsOiBNZXRlb3Iuc2V0dGluZ3MuY3Jvbi5pbnN0YW5jZXJlY29yZHF1ZXVlX2ludGVydmFsLFxuICAgICAgc2VuZEJhdGNoU2l6ZTogMTAsXG4gICAgICBrZWVwRG9jczogdHJ1ZVxuICAgIH0pO1xuICB9XG59KTtcbiIsImltcG9ydCB7IGNoZWNrTnBtVmVyc2lvbnMgfSBmcm9tICdtZXRlb3IvdG1lYXNkYXk6Y2hlY2stbnBtLXZlcnNpb25zJztcclxuY2hlY2tOcG1WZXJzaW9ucyh7XHJcblx0XCJldmFsXCI6IFwiXjAuMS4yXCJcclxufSwgJ3N0ZWVkb3M6aW5zdGFuY2UtcmVjb3JkLXF1ZXVlJyk7XHJcbiJdfQ==
