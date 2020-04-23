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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczppbnN0YW5jZS1yZWNvcmQtcXVldWUvbGliL2NvbW1vbi9tYWluLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmluc3RhbmNlLXJlY29yZC1xdWV1ZS9saWIvY29tbW9uL2RvY3MuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6aW5zdGFuY2UtcmVjb3JkLXF1ZXVlL2xpYi9zZXJ2ZXIvYXBpLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2luc3RhbmNlLXJlY29yZC1xdWV1ZS9zZXJ2ZXIvc3RhcnR1cC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9zdGFydHVwLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczppbnN0YW5jZS1yZWNvcmQtcXVldWUvc2VydmVyL2NoZWNrTnBtLmpzIl0sIm5hbWVzIjpbIkluc3RhbmNlUmVjb3JkUXVldWUiLCJFdmVudFN0YXRlIiwiY29sbGVjdGlvbiIsImRiIiwiaW5zdGFuY2VfcmVjb3JkX3F1ZXVlIiwiTW9uZ28iLCJDb2xsZWN0aW9uIiwiX3ZhbGlkYXRlRG9jdW1lbnQiLCJkb2MiLCJjaGVjayIsImluZm8iLCJPYmplY3QiLCJzZW50IiwiTWF0Y2giLCJPcHRpb25hbCIsIkJvb2xlYW4iLCJzZW5kaW5nIiwiSW50ZWdlciIsImNyZWF0ZWRBdCIsIkRhdGUiLCJjcmVhdGVkQnkiLCJPbmVPZiIsIlN0cmluZyIsInNlbmQiLCJvcHRpb25zIiwiY3VycmVudFVzZXIiLCJNZXRlb3IiLCJpc0NsaWVudCIsInVzZXJJZCIsImlzU2VydmVyIiwiXyIsImV4dGVuZCIsInRlc3QiLCJwaWNrIiwiaW5zZXJ0IiwiX2V2YWwiLCJyZXF1aXJlIiwiaXNDb25maWd1cmVkIiwic2VuZFdvcmtlciIsInRhc2siLCJpbnRlcnZhbCIsImRlYnVnIiwiY29uc29sZSIsImxvZyIsInNldEludGVydmFsIiwiZXJyb3IiLCJtZXNzYWdlIiwiQ29uZmlndXJlIiwic2VsZiIsInNlbmRUaW1lb3V0IiwiRXJyb3IiLCJzeW5jQXR0YWNoIiwic3luY19hdHRhY2htZW50IiwiaW5zSWQiLCJzcGFjZUlkIiwibmV3UmVjb3JkSWQiLCJvYmplY3ROYW1lIiwiY2ZzIiwiaW5zdGFuY2VzIiwiZmluZCIsImZvckVhY2giLCJmIiwiaGFzU3RvcmVkIiwiX2lkIiwibmV3RmlsZSIsIkZTIiwiRmlsZSIsImNtc0ZpbGVJZCIsIkNyZWF0b3IiLCJnZXRDb2xsZWN0aW9uIiwiX21ha2VOZXdJRCIsImF0dGFjaERhdGEiLCJjcmVhdGVSZWFkU3RyZWFtIiwidHlwZSIsIm9yaWdpbmFsIiwiZXJyIiwicmVhc29uIiwibmFtZSIsInNpemUiLCJtZXRhZGF0YSIsIm93bmVyIiwib3duZXJfbmFtZSIsInNwYWNlIiwicmVjb3JkX2lkIiwib2JqZWN0X25hbWUiLCJwYXJlbnQiLCJmaWxlcyIsIndyYXBBc3luYyIsImNiIiwib25jZSIsInN0b3JlTmFtZSIsIm8iLCJpZHMiLCJleHRlbnRpb24iLCJleHRlbnNpb24iLCJ2ZXJzaW9ucyIsImNyZWF0ZWRfYnkiLCJtb2RpZmllZF9ieSIsInBhcmVudHMiLCJpbmNsdWRlcyIsInB1c2giLCJjdXJyZW50IiwidXBkYXRlIiwiJHNldCIsIiRhZGRUb1NldCIsInN5bmNJbnNGaWVsZHMiLCJzeW5jVmFsdWVzIiwiZmllbGRfbWFwX2JhY2siLCJ2YWx1ZXMiLCJpbnMiLCJvYmplY3RJbmZvIiwiZmllbGRfbWFwX2JhY2tfc2NyaXB0IiwicmVjb3JkIiwib2JqIiwidGFibGVGaWVsZENvZGVzIiwidGFibGVGaWVsZE1hcCIsInRhYmxlVG9SZWxhdGVkTWFwIiwiZm9ybSIsImZpbmRPbmUiLCJmb3JtRmllbGRzIiwiZm9ybV92ZXJzaW9uIiwiZmllbGRzIiwiZm9ybVZlcnNpb24iLCJoaXN0b3J5cyIsImgiLCJvYmplY3RGaWVsZHMiLCJvYmplY3RGaWVsZEtleXMiLCJrZXlzIiwicmVsYXRlZE9iamVjdHMiLCJnZXRSZWxhdGVkT2JqZWN0cyIsInJlbGF0ZWRPYmplY3RzS2V5cyIsInBsdWNrIiwiZm9ybVRhYmxlRmllbGRzIiwiZmlsdGVyIiwiZm9ybUZpZWxkIiwiZm9ybVRhYmxlRmllbGRzQ29kZSIsImdldFJlbGF0ZWRPYmplY3RGaWVsZCIsImtleSIsInJlbGF0ZWRPYmplY3RzS2V5Iiwic3RhcnRzV2l0aCIsImdldEZvcm1UYWJsZUZpZWxkIiwiZm9ybVRhYmxlRmllbGRDb2RlIiwiZ2V0Rm9ybUZpZWxkIiwiX2Zvcm1GaWVsZHMiLCJfZmllbGRDb2RlIiwiZWFjaCIsImZmIiwiY29kZSIsImZtIiwicmVsYXRlZE9iamVjdEZpZWxkIiwib2JqZWN0X2ZpZWxkIiwiZm9ybVRhYmxlRmllbGQiLCJ3b3JrZmxvd19maWVsZCIsIm9UYWJsZUNvZGUiLCJzcGxpdCIsIm9UYWJsZUZpZWxkQ29kZSIsInRhYmxlVG9SZWxhdGVkTWFwS2V5Iiwid1RhYmxlQ29kZSIsImluZGV4T2YiLCJoYXNPd25Qcm9wZXJ0eSIsImlzQXJyYXkiLCJKU09OIiwic3RyaW5naWZ5Iiwid29ya2Zsb3dfdGFibGVfZmllbGRfY29kZSIsIm9iamVjdF90YWJsZV9maWVsZF9jb2RlIiwid0ZpZWxkIiwib0ZpZWxkIiwiaXNfbXVsdGlzZWxlY3QiLCJtdWx0aXBsZSIsInJlZmVyZW5jZV90byIsImlzU3RyaW5nIiwib0NvbGxlY3Rpb24iLCJyZWZlck9iamVjdCIsImdldE9iamVjdCIsInJlZmVyRGF0YSIsIm5hbWVGaWVsZEtleSIsIk5BTUVfRklFTERfS0VZIiwic2VsZWN0b3IiLCJ0bXBfZmllbGRfdmFsdWUiLCJjb21wYWN0IiwiaXNFbXB0eSIsInRlbU9iakZpZWxkcyIsImxlbmd0aCIsIm9iakZpZWxkIiwicmVmZXJPYmpGaWVsZCIsInJlZmVyU2V0T2JqIiwiaW5zRmllbGQiLCJ1bmlxIiwidGZjIiwiYyIsInBhcnNlIiwidHIiLCJuZXdUciIsInYiLCJrIiwidGZtIiwib1RkQ29kZSIsInJlbGF0ZWRPYmpzIiwiZ2V0UmVsYXRlZEZpZWxkVmFsdWUiLCJ2YWx1ZUtleSIsInJlZHVjZSIsIngiLCJtYXAiLCJ0YWJsZUNvZGUiLCJfRlJPTV9UQUJMRV9DT0RFIiwid2FybiIsInJlbGF0ZWRPYmplY3ROYW1lIiwicmVsYXRlZE9iamVjdFZhbHVlcyIsInJlbGF0ZWRPYmplY3QiLCJ0YWJsZVZhbHVlSXRlbSIsInJlbGF0ZWRPYmplY3RWYWx1ZSIsImZpZWxkS2V5IiwicmVsYXRlZE9iamVjdEZpZWxkVmFsdWUiLCJmb3JtRmllbGRLZXkiLCJfY29kZSIsImV2YWxGaWVsZE1hcEJhY2tTY3JpcHQiLCJmaWx0ZXJPYmoiLCJtYWluT2JqZWN0VmFsdWUiLCJyZWxhdGVkT2JqZWN0c1ZhbHVlIiwic2NyaXB0IiwiZnVuYyIsImlzT2JqZWN0Iiwic3luY1JlbGF0ZWRPYmplY3RzVmFsdWUiLCJtYWluUmVjb3JkSWQiLCJvYmplY3RDb2xsZWN0aW9uIiwidGFibGVNYXAiLCJ0YWJsZV9pZCIsIl90YWJsZSIsInRhYmxlX2NvZGUiLCJvbGRSZWxhdGVkUmVjb3JkIiwiZm9yZWlnbl9rZXkiLCJhcHBsaWNhbnQiLCJpbnN0YW5jZV9zdGF0ZSIsInN0YXRlIiwiZmluYWxfZGVjaXNpb24iLCJ2YWxpZGF0ZSIsInRhYmxlSWRzIiwicmVtb3ZlIiwiJG5pbiIsInNlbmREb2MiLCJpbnN0YW5jZV9pZCIsInJlY29yZHMiLCJmbG93IiwidHJhY2VzIiwib3ciLCJmbG93X2lkIiwiJGluIiwic2V0T2JqIiwicmVtb3ZlT2xkRmlsZXMiLCJzdGFjayIsIm5ld09iaiIsInIiLCIkcHVzaCIsInJlY29yZF9pZHMiLCIkcHVsbCIsIl9xdWVyeVNlbmQiLCJzZXJ2ZXJTZW5kIiwiaXNTZW5kaW5nRG9jIiwic2VuZEludGVydmFsIiwiX2Vuc3VyZUluZGV4Iiwibm93IiwidGltZW91dEF0IiwicmVzZXJ2ZWQiLCIkbHQiLCJyZXN1bHQiLCJrZWVwRG9jcyIsInNlbnRBdCIsImJhdGNoU2l6ZSIsInNlbmRCYXRjaFNpemUiLCJwZW5kaW5nRG9jcyIsIiRhbmQiLCJlcnJNc2ciLCIkZXhpc3RzIiwic29ydCIsImxpbWl0Iiwic3RhcnR1cCIsInJlZiIsInNldHRpbmdzIiwiY3JvbiIsImluc3RhbmNlcmVjb3JkcXVldWVfaW50ZXJ2YWwiLCJjaGVja05wbVZlcnNpb25zIiwibW9kdWxlIiwibGluayJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBQSxtQkFBbUIsR0FBRyxJQUFJQyxVQUFKLEVBQXRCLEM7Ozs7Ozs7Ozs7O0FDQUFELG1CQUFtQixDQUFDRSxVQUFwQixHQUFpQ0MsRUFBRSxDQUFDQyxxQkFBSCxHQUEyQixJQUFJQyxLQUFLLENBQUNDLFVBQVYsQ0FBcUIsdUJBQXJCLENBQTVEOztBQUVBLElBQUlDLGlCQUFpQixHQUFHLFVBQVNDLEdBQVQsRUFBYztBQUVyQ0MsT0FBSyxDQUFDRCxHQUFELEVBQU07QUFDVkUsUUFBSSxFQUFFQyxNQURJO0FBRVZDLFFBQUksRUFBRUMsS0FBSyxDQUFDQyxRQUFOLENBQWVDLE9BQWYsQ0FGSTtBQUdWQyxXQUFPLEVBQUVILEtBQUssQ0FBQ0MsUUFBTixDQUFlRCxLQUFLLENBQUNJLE9BQXJCLENBSEM7QUFJVkMsYUFBUyxFQUFFQyxJQUpEO0FBS1ZDLGFBQVMsRUFBRVAsS0FBSyxDQUFDUSxLQUFOLENBQVlDLE1BQVosRUFBb0IsSUFBcEI7QUFMRCxHQUFOLENBQUw7QUFRQSxDQVZEOztBQVlBdEIsbUJBQW1CLENBQUN1QixJQUFwQixHQUEyQixVQUFTQyxPQUFULEVBQWtCO0FBQzVDLE1BQUlDLFdBQVcsR0FBR0MsTUFBTSxDQUFDQyxRQUFQLElBQW1CRCxNQUFNLENBQUNFLE1BQTFCLElBQW9DRixNQUFNLENBQUNFLE1BQVAsRUFBcEMsSUFBdURGLE1BQU0sQ0FBQ0csUUFBUCxLQUFvQkwsT0FBTyxDQUFDSixTQUFSLElBQXFCLFVBQXpDLENBQXZELElBQStHLElBQWpJOztBQUNBLE1BQUlaLEdBQUcsR0FBR3NCLENB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QVksR0FBRyxLQUFmO0FBQ0EsS0EzRFMsRUEyRFB6TyxPQUFPLENBQUMwTyxZQUFSLElBQXdCLEtBM0RqQixDQUFWLENBckVrQyxDQWdJQztBQUVuQyxHQWxJRCxNQWtJTztBQUNOLFFBQUlsUSxtQkFBbUIsQ0FBQ3lDLEtBQXhCLEVBQStCO0FBQzlCQyxhQUFPLENBQUNDLEdBQVIsQ0FBWSw4Q0FBWjtBQUNBO0FBQ0Q7QUFFRCxDQWw3QkQsQzs7Ozs7Ozs7Ozs7O0FDM0JBakIsT0FBT3lQLE9BQVAsQ0FBZTtBQUNkLE1BQUFDLEdBQUE7O0FBQUEsT0FBQUEsTUFBQTFQLE9BQUEyUCxRQUFBLENBQUFDLElBQUEsWUFBQUYsSUFBeUJHLDRCQUF6QixHQUF5QixNQUF6QjtBQ0VHLFdEREZ2UixvQkFBb0IrQyxTQUFwQixDQUNDO0FBQUFtTixvQkFBY3hPLE9BQU8yUCxRQUFQLENBQWdCQyxJQUFoQixDQUFxQkMsNEJBQW5DO0FBQ0FYLHFCQUFlLEVBRGY7QUFFQUgsZ0JBQVU7QUFGVixLQURELENDQ0U7QUFLRDtBRFJILEc7Ozs7Ozs7Ozs7O0FFQUEsSUFBSWUsZ0JBQUo7QUFBcUJDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLG9DQUFaLEVBQWlEO0FBQUNGLGtCQUFnQixDQUFDdkYsQ0FBRCxFQUFHO0FBQUN1RixvQkFBZ0IsR0FBQ3ZGLENBQWpCO0FBQW1COztBQUF4QyxDQUFqRCxFQUEyRixDQUEzRjtBQUNyQnVGLGdCQUFnQixDQUFDO0FBQ2hCLFVBQVE7QUFEUSxDQUFELEVBRWIsK0JBRmEsQ0FBaEIsQyIsImZpbGUiOiIvcGFja2FnZXMvc3RlZWRvc19pbnN0YW5jZS1yZWNvcmQtcXVldWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJJbnN0YW5jZVJlY29yZFF1ZXVlID0gbmV3IEV2ZW50U3RhdGUoKTsiLCJJbnN0YW5jZVJlY29yZFF1ZXVlLmNvbGxlY3Rpb24gPSBkYi5pbnN0YW5jZV9yZWNvcmRfcXVldWUgPSBuZXcgTW9uZ28uQ29sbGVjdGlvbignaW5zdGFuY2VfcmVjb3JkX3F1ZXVlJyk7XHJcblxyXG52YXIgX3ZhbGlkYXRlRG9jdW1lbnQgPSBmdW5jdGlvbihkb2MpIHtcclxuXHJcblx0Y2hlY2soZG9jLCB7XHJcblx0XHRpbmZvOiBPYmplY3QsXHJcblx0XHRzZW50OiBNYXRjaC5PcHRpb25hbChCb29sZWFuKSxcclxuXHRcdHNlbmRpbmc6IE1hdGNoLk9wdGlvbmFsKE1hdGNoLkludGVnZXIpLFxyXG5cdFx0Y3JlYXRlZEF0OiBEYXRlLFxyXG5cdFx0Y3JlYXRlZEJ5OiBNYXRjaC5PbmVPZihTdHJpbmcsIG51bGwpXHJcblx0fSk7XHJcblxyXG59O1xyXG5cclxuSW5zdGFuY2VSZWNvcmRRdWV1ZS5zZW5kID0gZnVuY3Rpb24ob3B0aW9ucykge1xyXG5cdHZhciBjdXJyZW50VXNlciA9IE1ldGVvci5pc0NsaWVudCAmJiBNZXRlb3IudXNlcklkICYmIE1ldGVvci51c2VySWQoKSB8fCBNZXRlb3IuaXNTZXJ2ZXIgJiYgKG9wdGlvbnMuY3JlYXRlZEJ5IHx8ICc8U0VSVkVSPicpIHx8IG51bGxcclxuXHR2YXIgZG9jID0gXy5leHRlbmQoe1xyXG5cdFx0Y3JlYXRlZEF0OiBuZXcgRGF0ZSgpLFxyXG5cdFx0Y3JlYXRlZEJ5OiBjdXJyZW50VXNlclxyXG5cdH0pO1xyXG5cclxuXHRpZiAoTWF0Y2gudGVzdChvcHRpb25zLCBPYmplY3QpKSB7XHJcblx0XHRkb2MuaW5mbyA9IF8ucGljayhvcHRpb25zLCAnaW5zdGFuY2VfaWQnLCAncmVjb3JkcycsICdzeW5jX2RhdGUnLCAnaW5zdGFuY2VfZmluaXNoX2RhdGUnLCAnc3RlcF9uYW1lJyk7XHJcblx0fVxyXG5cclxuXHRkb2Muc2VudCA9IGZhbHNlO1xyXG5cdGRvYy5zZW5kaW5nID0gMDtcclxuXHJcblx0X3ZhbGlkYXRlRG9jdW1lbnQoZG9jKTtcclxuXHJcblx0cmV0dXJuIEluc3RhbmNlUmVjb3JkUXVldWUuY29sbGVjdGlvbi5pbnNlcnQoZG9jKTtcclxufTsiLCJ2YXIgX2V2YWwgPSByZXF1aXJlKCdldmFsJyk7XHJcbnZhciBpc0NvbmZpZ3VyZWQgPSBmYWxzZTtcclxudmFyIHNlbmRXb3JrZXIgPSBmdW5jdGlvbiAodGFzaywgaW50ZXJ2YWwpIHtcclxuXHJcblx0aWYgKEluc3RhbmNlUmVjb3JkUXVldWUuZGVidWcpIHtcclxuXHRcdGNvbnNvbGUubG9nKCdJbnN0YW5jZVJlY29yZFF1ZXVlOiBTZW5kIHdvcmtlciBzdGFydGVkLCB1c2luZyBpbnRlcnZhbDogJyArIGludGVydmFsKTtcclxuXHR9XHJcblxyXG5cdHJldHVybiBNZXRlb3Iuc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0dGFzaygpO1xyXG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coJ0luc3RhbmNlUmVjb3JkUXVldWU6IEVycm9yIHdoaWxlIHNlbmRpbmc6ICcgKyBlcnJvci5tZXNzYWdlKTtcclxuXHRcdH1cclxuXHR9LCBpbnRlcnZhbCk7XHJcbn07XHJcblxyXG4vKlxyXG5cdG9wdGlvbnM6IHtcclxuXHRcdC8vIENvbnRyb2xzIHRoZSBzZW5kaW5nIGludGVydmFsXHJcblx0XHRzZW5kSW50ZXJ2YWw6IE1hdGNoLk9wdGlvbmFsKE51bWJlciksXHJcblx0XHQvLyBDb250cm9scyB0aGUgc2VuZGluZyBiYXRjaCBzaXplIHBlciBpbnRlcnZhbFxyXG5cdFx0c2VuZEJhdGNoU2l6ZTogTWF0Y2guT3B0aW9uYWwoTnVtYmVyKSxcclxuXHRcdC8vIEFsbG93IG9wdGlvbmFsIGtlZXBpbmcgbm90aWZpY2F0aW9ucyBpbiBjb2xsZWN0aW9uXHJcblx0XHRrZWVwRG9jczogTWF0Y2guT3B0aW9uYWwoQm9vbGVhbilcclxuXHR9XHJcbiovXHJcbkluc3RhbmNlUmVjb3JkUXVldWUuQ29uZmlndXJlID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuXHR2YXIgc2VsZiA9IHRoaXM7XHJcblx0b3B0aW9ucyA9IF8uZXh0ZW5kKHtcclxuXHRcdHNlbmRUaW1lb3V0OiA2MDAwMCwgLy8gVGltZW91dCBwZXJpb2RcclxuXHR9LCBvcHRpb25zKTtcclxuXHJcblx0Ly8gQmxvY2sgbXVsdGlwbGUgY2FsbHNcclxuXHRpZiAoaXNDb25maWd1cmVkKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ0luc3RhbmNlUmVjb3JkUXVldWUuQ29uZmlndXJlIHNob3VsZCBub3QgYmUgY2FsbGVkIG1vcmUgdGhhbiBvbmNlIScpO1xyXG5cdH1cclxuXHJcblx0aXNDb25maWd1cmVkID0gdHJ1ZTtcclxuXHJcblx0Ly8gQWRkIGRlYnVnIGluZm9cclxuXHRpZiAoSW5zdGFuY2VSZWNvcmRRdWV1ZS5kZWJ1Zykge1xyXG5cdFx0Y29uc29sZS5sb2coJ0luc3RhbmNlUmVjb3JkUXVldWUuQ29uZmlndXJlJywgb3B0aW9ucyk7XHJcblx0fVxyXG5cclxuXHRzZWxmLnN5bmNBdHRhY2ggPSBmdW5jdGlvbiAoc3luY19hdHRhY2htZW50LCBpbnNJZCwgc3BhY2VJZCwgbmV3UmVjb3JkSWQsIG9iamVjdE5hbWUpIHtcclxuXHRcdGlmIChzeW5jX2F0dGFjaG1lbnQgPT0gXCJsYXN0ZXN0XCIpIHtcclxuXHRcdFx0Y2ZzLmluc3RhbmNlcy5maW5kKHtcclxuXHRcdFx0XHQnbWV0YWRhdGEuaW5zdGFuY2UnOiBpbnNJZCxcclxuXHRcdFx0XHQnbWV0YWRhdGEuY3VycmVudCc6IHRydWVcclxuXHRcdFx0fSkuZm9yRWFjaChmdW5jdGlvbiAoZikge1xyXG5cdFx0XHRcdGlmICghZi5oYXNTdG9yZWQoJ2luc3RhbmNlcycpKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKCdzeW5jQXR0YWNoLWZpbGUgbm90IHN0b3JlZDogJywgZi5faWQpO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR2YXIgbmV3RmlsZSA9IG5ldyBGUy5GaWxlKCksXHJcblx0XHRcdFx0XHRjbXNGaWxlSWQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2Ntc19maWxlcycpLl9tYWtlTmV3SUQoKTtcclxuXHRcdFx0XHRuZXdGaWxlLmF0dGFjaERhdGEoZi5jcmVhdGVSZWFkU3RyZWFtKCdpbnN0YW5jZXMnKSwge1xyXG5cdFx0XHRcdFx0dHlwZTogZi5vcmlnaW5hbC50eXBlXHJcblx0XHRcdFx0fSwgZnVuY3Rpb24gKGVycikge1xyXG5cdFx0XHRcdFx0aWYgKGVycikge1xyXG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKGVyci5lcnJvciwgZXJyLnJlYXNvbik7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRuZXdGaWxlLm5hbWUoZi5uYW1lKCkpO1xyXG5cdFx0XHRcdFx0bmV3RmlsZS5zaXplKGYuc2l6ZSgpKTtcclxuXHRcdFx0XHRcdHZhciBtZXRhZGF0YSA9IHtcclxuXHRcdFx0XHRcdFx0b3duZXI6IGYubWV0YWRhdGEub3duZXIsXHJcblx0XHRcdFx0XHRcdG93bmVyX25hbWU6IGYubWV0YWRhdGEub3duZXJfbmFtZSxcclxuXHRcdFx0XHRcdFx0c3BhY2U6IHNwYWNlSWQsXHJcblx0XHRcdFx0XHRcdHJlY29yZF9pZDogbmV3UmVjb3JkSWQsXHJcblx0XHRcdFx0XHRcdG9iamVjdF9uYW1lOiBvYmplY3ROYW1lLFxyXG5cdFx0XHRcdFx0XHRwYXJlbnQ6IGNtc0ZpbGVJZFxyXG5cdFx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0XHRuZXdGaWxlLm1ldGFkYXRhID0gbWV0YWRhdGE7XHJcblx0XHRcdFx0XHRjZnMuZmlsZXMuaW5zZXJ0KG5ld0ZpbGUpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdE1ldGVvci53cmFwQXN5bmMoZnVuY3Rpb24gKG5ld0ZpbGUsIENyZWF0b3IsIGNtc0ZpbGVJZCwgb2JqZWN0TmFtZSwgbmV3UmVjb3JkSWQsIHNwYWNlSWQsIGYsIGNiKSB7XHJcblx0XHRcdFx0XHRuZXdGaWxlLm9uY2UoJ3N0b3JlZCcsIGZ1bmN0aW9uIChzdG9yZU5hbWUpIHtcclxuXHRcdFx0XHRcdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKCdjbXNfZmlsZXMnKS5pbnNlcnQoe1xyXG5cdFx0XHRcdFx0XHRcdF9pZDogY21zRmlsZUlkLFxyXG5cdFx0XHRcdFx0XHRcdHBhcmVudDoge1xyXG5cdFx0XHRcdFx0XHRcdFx0bzogb2JqZWN0TmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdGlkczogW25ld1JlY29yZElkXVxyXG5cdFx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdFx0c2l6ZTogbmV3RmlsZS5zaXplKCksXHJcblx0XHRcdFx0XHRcdFx0bmFtZTogbmV3RmlsZS5uYW1lKCksXHJcblx0XHRcdFx0XHRcdFx0ZXh0ZW50aW9uOiBuZXdGaWxlLmV4dGVuc2lvbigpLFxyXG5cdFx0XHRcdFx0XHRcdHNwYWNlOiBzcGFjZUlkLFxyXG5cdFx0XHRcdFx0XHRcdHZlcnNpb25zOiBbbmV3RmlsZS5faWRdLFxyXG5cdFx0XHRcdFx0XHRcdG93bmVyOiBmLm1ldGFkYXRhLm93bmVyLFxyXG5cdFx0XHRcdFx0XHRcdGNyZWF0ZWRfYnk6IGYubWV0YWRhdGEub3duZXIsXHJcblx0XHRcdFx0XHRcdFx0bW9kaWZpZWRfYnk6IGYubWV0YWRhdGEub3duZXJcclxuXHRcdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0XHRjYihudWxsKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0bmV3RmlsZS5vbmNlKCdlcnJvcicsIGZ1bmN0aW9uIChlcnJvcikge1xyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yKCdzeW5jQXR0YWNoLWVycm9yOiAnLCBlcnJvcik7XHJcblx0XHRcdFx0XHRcdGNiKGVycm9yKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH0pKG5ld0ZpbGUsIENyZWF0b3IsIGNtc0ZpbGVJZCwgb2JqZWN0TmFtZSwgbmV3UmVjb3JkSWQsIHNwYWNlSWQsIGYpO1xyXG5cdFx0XHR9KVxyXG5cdFx0fSBlbHNlIGlmIChzeW5jX2F0dGFjaG1lbnQgPT0gXCJhbGxcIikge1xyXG5cdFx0XHR2YXIgcGFyZW50cyA9IFtdO1xyXG5cdFx0XHRjZnMuaW5zdGFuY2VzLmZpbmQoe1xyXG5cdFx0XHRcdCdtZXRhZGF0YS5pbnN0YW5jZSc6IGluc0lkXHJcblx0XHRcdH0pLmZvckVhY2goZnVuY3Rpb24gKGYpIHtcclxuXHRcdFx0XHRpZiAoIWYuaGFzU3RvcmVkKCdpbnN0YW5jZXMnKSkge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvcignc3luY0F0dGFjaC1maWxlIG5vdCBzdG9yZWQ6ICcsIGYuX2lkKTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dmFyIG5ld0ZpbGUgPSBuZXcgRlMuRmlsZSgpLFxyXG5cdFx0XHRcdFx0Y21zRmlsZUlkID0gZi5tZXRhZGF0YS5wYXJlbnQ7XHJcblxyXG5cdFx0XHRcdGlmICghcGFyZW50cy5pbmNsdWRlcyhjbXNGaWxlSWQpKSB7XHJcblx0XHRcdFx0XHRwYXJlbnRzLnB1c2goY21zRmlsZUlkKTtcclxuXHRcdFx0XHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbignY21zX2ZpbGVzJykuaW5zZXJ0KHtcclxuXHRcdFx0XHRcdFx0X2lkOiBjbXNGaWxlSWQsXHJcblx0XHRcdFx0XHRcdHBhcmVudDoge1xyXG5cdFx0XHRcdFx0XHRcdG86IG9iamVjdE5hbWUsXHJcblx0XHRcdFx0XHRcdFx0aWRzOiBbbmV3UmVjb3JkSWRdXHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdHNwYWNlOiBzcGFjZUlkLFxyXG5cdFx0XHRcdFx0XHR2ZXJzaW9uczogW10sXHJcblx0XHRcdFx0XHRcdG93bmVyOiBmLm1ldGFkYXRhLm93bmVyLFxyXG5cdFx0XHRcdFx0XHRjcmVhdGVkX2J5OiBmLm1ldGFkYXRhLm93bmVyLFxyXG5cdFx0XHRcdFx0XHRtb2RpZmllZF9ieTogZi5tZXRhZGF0YS5vd25lclxyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdG5ld0ZpbGUuYXR0YWNoRGF0YShmLmNyZWF0ZVJlYWRTdHJlYW0oJ2luc3RhbmNlcycpLCB7XHJcblx0XHRcdFx0XHR0eXBlOiBmLm9yaWdpbmFsLnR5cGVcclxuXHRcdFx0XHR9LCBmdW5jdGlvbiAoZXJyKSB7XHJcblx0XHRcdFx0XHRpZiAoZXJyKSB7XHJcblx0XHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoZXJyLmVycm9yLCBlcnIucmVhc29uKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdG5ld0ZpbGUubmFtZShmLm5hbWUoKSk7XHJcblx0XHRcdFx0XHRuZXdGaWxlLnNpemUoZi5zaXplKCkpO1xyXG5cdFx0XHRcdFx0dmFyIG1ldGFkYXRhID0ge1xyXG5cdFx0XHRcdFx0XHRvd25lcjogZi5tZXRhZGF0YS5vd25lcixcclxuXHRcdFx0XHRcdFx0b3duZXJfbmFtZTogZi5tZXRhZGF0YS5vd25lcl9uYW1lLFxyXG5cdFx0XHRcdFx0XHRzcGFjZTogc3BhY2VJZCxcclxuXHRcdFx0XHRcdFx0cmVjb3JkX2lkOiBuZXdSZWNvcmRJZCxcclxuXHRcdFx0XHRcdFx0b2JqZWN0X25hbWU6IG9iamVjdE5hbWUsXHJcblx0XHRcdFx0XHRcdHBhcmVudDogY21zRmlsZUlkXHJcblx0XHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHRcdG5ld0ZpbGUubWV0YWRhdGEgPSBtZXRhZGF0YTtcclxuXHRcdFx0XHRcdGNmcy5maWxlcy5pbnNlcnQobmV3RmlsZSk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0TWV0ZW9yLndyYXBBc3luYyhmdW5jdGlvbiAobmV3RmlsZSwgQ3JlYXRvciwgY21zRmlsZUlkLCBmLCBjYikge1xyXG5cdFx0XHRcdFx0bmV3RmlsZS5vbmNlKCdzdG9yZWQnLCBmdW5jdGlvbiAoc3RvcmVOYW1lKSB7XHJcblx0XHRcdFx0XHRcdGlmIChmLm1ldGFkYXRhLmN1cnJlbnQgPT0gdHJ1ZSkge1xyXG5cdFx0XHRcdFx0XHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbignY21zX2ZpbGVzJykudXBkYXRlKGNtc0ZpbGVJZCwge1xyXG5cdFx0XHRcdFx0XHRcdFx0JHNldDoge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRzaXplOiBuZXdGaWxlLnNpemUoKSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0bmFtZTogbmV3RmlsZS5uYW1lKCksXHJcblx0XHRcdFx0XHRcdFx0XHRcdGV4dGVudGlvbjogbmV3RmlsZS5leHRlbnNpb24oKSxcclxuXHRcdFx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdFx0XHQkYWRkVG9TZXQ6IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0dmVyc2lvbnM6IG5ld0ZpbGUuX2lkXHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKCdjbXNfZmlsZXMnKS51cGRhdGUoY21zRmlsZUlkLCB7XHJcblx0XHRcdFx0XHRcdFx0XHQkYWRkVG9TZXQ6IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0dmVyc2lvbnM6IG5ld0ZpbGUuX2lkXHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdGNiKG51bGwpO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRuZXdGaWxlLm9uY2UoJ2Vycm9yJywgZnVuY3Rpb24gKGVycm9yKSB7XHJcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoJ3N5bmNBdHRhY2gtZXJyb3I6ICcsIGVycm9yKTtcclxuXHRcdFx0XHRcdFx0Y2IoZXJyb3IpO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fSkobmV3RmlsZSwgQ3JlYXRvciwgY21zRmlsZUlkLCBmKTtcclxuXHRcdFx0fSlcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHNlbGYuc3luY0luc0ZpZWxkcyA9IFsnbmFtZScsICdzdWJtaXR0ZXJfbmFtZScsICdhcHBsaWNhbnRfbmFtZScsICdhcHBsaWNhbnRfb3JnYW5pemF0aW9uX25hbWUnLCAnYXBwbGljYW50X29yZ2FuaXphdGlvbl9mdWxsbmFtZScsICdzdGF0ZScsXHJcblx0XHQnY3VycmVudF9zdGVwX25hbWUnLCAnZmxvd19uYW1lJywgJ2NhdGVnb3J5X25hbWUnLCAnc3VibWl0X2RhdGUnLCAnZmluaXNoX2RhdGUnLCAnZmluYWxfZGVjaXNpb24nLCAnYXBwbGljYW50X29yZ2FuaXphdGlvbicsICdhcHBsaWNhbnRfY29tcGFueSdcclxuXHRdO1xyXG5cdHNlbGYuc3luY1ZhbHVlcyA9IGZ1bmN0aW9uIChmaWVsZF9tYXBfYmFjaywgdmFsdWVzLCBpbnMsIG9iamVjdEluZm8sIGZpZWxkX21hcF9iYWNrX3NjcmlwdCwgcmVjb3JkKSB7XHJcblx0XHR2YXJcclxuXHRcdFx0b2JqID0ge30sXHJcblx0XHRcdHRhYmxlRmllbGRDb2RlcyA9IFtdLFxyXG5cdFx0XHR0YWJsZUZpZWxkTWFwID0gW10sXHJcblx0XHRcdHRhYmxlVG9SZWxhdGVkTWFwID0ge307XHJcblxyXG5cdFx0ZmllbGRfbWFwX2JhY2sgPSBmaWVsZF9tYXBfYmFjayB8fCBbXTtcclxuXHJcblx0XHR2YXIgc3BhY2VJZCA9IGlucy5zcGFjZTtcclxuXHJcblx0XHR2YXIgZm9ybSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcImZvcm1zXCIpLmZpbmRPbmUoaW5zLmZvcm0pO1xyXG5cdFx0dmFyIGZvcm1GaWVsZHMgPSBudWxsO1xyXG5cdFx0aWYgKGZvcm0uY3VycmVudC5faWQgPT09IGlucy5mb3JtX3ZlcnNpb24pIHtcclxuXHRcdFx0Zm9ybUZpZWxkcyA9IGZvcm0uY3VycmVudC5maWVsZHMgfHwgW107XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR2YXIgZm9ybVZlcnNpb24gPSBfLmZpbmQoZm9ybS5oaXN0b3J5cywgZnVuY3Rpb24gKGgpIHtcclxuXHRcdFx0XHRyZXR1cm4gaC5faWQgPT09IGlucy5mb3JtX3ZlcnNpb247XHJcblx0XHRcdH0pXHJcblx0XHRcdGZvcm1GaWVsZHMgPSBmb3JtVmVyc2lvbiA/IGZvcm1WZXJzaW9uLmZpZWxkcyA6IFtdO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBvYmplY3RGaWVsZHMgPSBvYmplY3RJbmZvLmZpZWxkcztcclxuXHRcdHZhciBvYmplY3RGaWVsZEtleXMgPSBfLmtleXMob2JqZWN0RmllbGRzKTtcclxuXHRcdHZhciByZWxhdGVkT2JqZWN0cyA9IENyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdHMob2JqZWN0SW5mby5uYW1lLCBzcGFjZUlkKTtcclxuXHRcdHZhciByZWxhdGVkT2JqZWN0c0tleXMgPSBfLnBsdWNrKHJlbGF0ZWRPYmplY3RzLCAnb2JqZWN0X25hbWUnKTtcclxuXHRcdHZhciBmb3JtVGFibGVGaWVsZHMgPSBfLmZpbHRlcihmb3JtRmllbGRzLCBmdW5jdGlvbiAoZm9ybUZpZWxkKSB7XHJcblx0XHRcdHJldHVybiBmb3JtRmllbGQudHlwZSA9PT0gJ3RhYmxlJ1xyXG5cdFx0fSk7XHJcblx0XHR2YXIgZm9ybVRhYmxlRmllbGRzQ29kZSA9IF8ucGx1Y2soZm9ybVRhYmxlRmllbGRzLCAnY29kZScpO1xyXG5cclxuXHRcdHZhciBnZXRSZWxhdGVkT2JqZWN0RmllbGQgPSBmdW5jdGlvbiAoa2V5KSB7XHJcblx0XHRcdHJldHVybiBfLmZpbmQocmVsYXRlZE9iamVjdHNLZXlzLCBmdW5jdGlvbiAocmVsYXRlZE9iamVjdHNLZXkpIHtcclxuXHRcdFx0XHRyZXR1cm4ga2V5LnN0YXJ0c1dpdGgocmVsYXRlZE9iamVjdHNLZXkgKyAnLicpO1xyXG5cdFx0XHR9KVxyXG5cdFx0fTtcclxuXHJcblx0XHR2YXIgZ2V0Rm9ybVRhYmxlRmllbGQgPSBmdW5jdGlvbiAoa2V5KSB7XHJcblx0XHRcdHJldHVybiBfLmZpbmQoZm9ybVRhYmxlRmllbGRzQ29kZSwgZnVuY3Rpb24gKGZvcm1UYWJsZUZpZWxkQ29kZSkge1xyXG5cdFx0XHRcdHJldHVybiBrZXkuc3RhcnRzV2l0aChmb3JtVGFibGVGaWVsZENvZGUgKyAnLicpO1xyXG5cdFx0XHR9KVxyXG5cdFx0fTtcclxuXHJcblx0XHR2YXIgZ2V0Rm9ybUZpZWxkID0gZnVuY3Rpb24gKF9mb3JtRmllbGRzLCBfZmllbGRDb2RlKSB7XHJcblx0XHRcdHZhciBmb3JtRmllbGQgPSBudWxsO1xyXG5cdFx0XHRfLmVhY2goX2Zvcm1GaWVsZHMsIGZ1bmN0aW9uIChmZikge1xyXG5cdFx0XHRcdGlmICghZm9ybUZpZWxkKSB7XHJcblx0XHRcdFx0XHRpZiAoZmYuY29kZSA9PT0gX2ZpZWxkQ29kZSkge1xyXG5cdFx0XHRcdFx0XHRmb3JtRmllbGQgPSBmZjtcclxuXHRcdFx0XHRcdH0gZWxzZSBpZiAoZmYudHlwZSA9PT0gJ3NlY3Rpb24nKSB7XHJcblx0XHRcdFx0XHRcdF8uZWFjaChmZi5maWVsZHMsIGZ1bmN0aW9uIChmKSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKCFmb3JtRmllbGQpIHtcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChmLmNvZGUgPT09IF9maWVsZENvZGUpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0Zm9ybUZpZWxkID0gZjtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHR9IGVsc2UgaWYgKGZmLnR5cGUgPT09ICd0YWJsZScpIHtcclxuXHRcdFx0XHRcdFx0Xy5lYWNoKGZmLmZpZWxkcywgZnVuY3Rpb24gKGYpIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAoIWZvcm1GaWVsZCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKGYuY29kZSA9PT0gX2ZpZWxkQ29kZSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRmb3JtRmllbGQgPSBmO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRyZXR1cm4gZm9ybUZpZWxkO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZpZWxkX21hcF9iYWNrLmZvckVhY2goZnVuY3Rpb24gKGZtKSB7XHJcblx0XHRcdC8vd29ya2Zsb3cg55qE5a2Q6KGo5YiwY3JlYXRvciBvYmplY3Qg55qE55u45YWz5a+56LGhXHJcblx0XHRcdHZhciByZWxhdGVkT2JqZWN0RmllbGQgPSBnZXRSZWxhdGVkT2JqZWN0RmllbGQoZm0ub2JqZWN0X2ZpZWxkKTtcclxuXHRcdFx0dmFyIGZvcm1UYWJsZUZpZWxkID0gZ2V0Rm9ybVRhYmxlRmllbGQoZm0ud29ya2Zsb3dfZmllbGQpO1xyXG5cdFx0XHRpZiAocmVsYXRlZE9iamVjdEZpZWxkKSB7XHJcblx0XHRcdFx0dmFyIG9UYWJsZUNvZGUgPSBmbS5vYmplY3RfZmllbGQuc3BsaXQoJy4nKVswXTtcclxuXHRcdFx0XHR2YXIgb1RhYmxlRmllbGRDb2RlID0gZm0ub2JqZWN0X2ZpZWxkLnNwbGl0KCcuJylbMV07XHJcblx0XHRcdFx0dmFyIHRhYmxlVG9SZWxhdGVkTWFwS2V5ID0gb1RhYmxlQ29kZTtcclxuXHRcdFx0XHRpZiAoIXRhYmxlVG9SZWxhdGVkTWFwW3RhYmxlVG9SZWxhdGVkTWFwS2V5XSkge1xyXG5cdFx0XHRcdFx0dGFibGVUb1JlbGF0ZWRNYXBbdGFibGVUb1JlbGF0ZWRNYXBLZXldID0ge31cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmIChmb3JtVGFibGVGaWVsZCkge1xyXG5cdFx0XHRcdFx0dmFyIHdUYWJsZUNvZGUgPSBmbS53b3JrZmxvd19maWVsZC5zcGxpdCgnLicpWzBdO1xyXG5cdFx0XHRcdFx0dGFibGVUb1JlbGF0ZWRNYXBbdGFibGVUb1JlbGF0ZWRNYXBLZXldWydfRlJPTV9UQUJMRV9DT0RFJ10gPSB3VGFibGVDb2RlXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR0YWJsZVRvUmVsYXRlZE1hcFt0YWJsZVRvUmVsYXRlZE1hcEtleV1bb1RhYmxlRmllbGRDb2RlXSA9IGZtLndvcmtmbG93X2ZpZWxkXHJcblx0XHRcdH1cclxuXHRcdFx0Ly8g5Yik5pat5piv5ZCm5piv5a2Q6KGo5a2X5q61XHJcblx0XHRcdGVsc2UgaWYgKGZtLndvcmtmbG93X2ZpZWxkLmluZGV4T2YoJy4kLicpID4gMCAmJiBmbS5vYmplY3RfZmllbGQuaW5kZXhPZignLiQuJykgPiAwKSB7XHJcblx0XHRcdFx0dmFyIHdUYWJsZUNvZGUgPSBmbS53b3JrZmxvd19maWVsZC5zcGxpdCgnLiQuJylbMF07XHJcblx0XHRcdFx0dmFyIG9UYWJsZUNvZGUgPSBmbS5vYmplY3RfZmllbGQuc3BsaXQoJy4kLicpWzBdO1xyXG5cdFx0XHRcdGlmICh2YWx1ZXMuaGFzT3duUHJvcGVydHkod1RhYmxlQ29kZSkgJiYgXy5pc0FycmF5KHZhbHVlc1t3VGFibGVDb2RlXSkpIHtcclxuXHRcdFx0XHRcdHRhYmxlRmllbGRDb2Rlcy5wdXNoKEpTT04uc3RyaW5naWZ5KHtcclxuXHRcdFx0XHRcdFx0d29ya2Zsb3dfdGFibGVfZmllbGRfY29kZTogd1RhYmxlQ29kZSxcclxuXHRcdFx0XHRcdFx0b2JqZWN0X3RhYmxlX2ZpZWxkX2NvZGU6IG9UYWJsZUNvZGVcclxuXHRcdFx0XHRcdH0pKTtcclxuXHRcdFx0XHRcdHRhYmxlRmllbGRNYXAucHVzaChmbSk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmICh2YWx1ZXMuaGFzT3duUHJvcGVydHkoZm0ud29ya2Zsb3dfZmllbGQpKSB7XHJcblx0XHRcdFx0dmFyIHdGaWVsZCA9IG51bGw7XHJcblxyXG5cdFx0XHRcdF8uZWFjaChmb3JtRmllbGRzLCBmdW5jdGlvbiAoZmYpIHtcclxuXHRcdFx0XHRcdGlmICghd0ZpZWxkKSB7XHJcblx0XHRcdFx0XHRcdGlmIChmZi5jb2RlID09PSBmbS53b3JrZmxvd19maWVsZCkge1xyXG5cdFx0XHRcdFx0XHRcdHdGaWVsZCA9IGZmO1xyXG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGZmLnR5cGUgPT09ICdzZWN0aW9uJykge1xyXG5cdFx0XHRcdFx0XHRcdF8uZWFjaChmZi5maWVsZHMsIGZ1bmN0aW9uIChmKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoIXdGaWVsZCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoZi5jb2RlID09PSBmbS53b3JrZmxvd19maWVsZCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHdGaWVsZCA9IGY7XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSlcclxuXHJcblx0XHRcdFx0dmFyIG9GaWVsZCA9IG9iamVjdEZpZWxkc1tmbS5vYmplY3RfZmllbGRdO1xyXG5cclxuXHRcdFx0XHRpZiAob0ZpZWxkKSB7XHJcblx0XHRcdFx0XHRpZiAoIXdGaWVsZCkge1xyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZygnZm0ud29ya2Zsb3dfZmllbGQ6ICcsIGZtLndvcmtmbG93X2ZpZWxkKVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Ly8g6KGo5Y2V6YCJ5Lq66YCJ57uE5a2X5q61IOiHsyDlr7nosaEgbG9va3VwIG1hc3Rlcl9kZXRhaWznsbvlnovlrZfmrrXlkIzmraVcclxuXHRcdFx0XHRcdGlmICghd0ZpZWxkLmlzX211bHRpc2VsZWN0ICYmIFsndXNlcicsICdncm91cCddLmluY2x1ZGVzKHdGaWVsZC50eXBlKSAmJiAhb0ZpZWxkLm11bHRpcGxlICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhvRmllbGQudHlwZSkgJiYgWyd1c2VycycsICdvcmdhbml6YXRpb25zJ10uaW5jbHVkZXMob0ZpZWxkLnJlZmVyZW5jZV90bykpIHtcclxuXHRcdFx0XHRcdFx0b2JqW2ZtLm9iamVjdF9maWVsZF0gPSB2YWx1ZXNbZm0ud29ya2Zsb3dfZmllbGRdWydpZCddO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWxzZSBpZiAoIW9GaWVsZC5tdWx0aXBsZSAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMob0ZpZWxkLnR5cGUpICYmIF8uaXNTdHJpbmcob0ZpZWxkLnJlZmVyZW5jZV90bykgJiYgXy5pc1N0cmluZyh2YWx1ZXNbZm0ud29ya2Zsb3dfZmllbGRdKSkge1xyXG5cdFx0XHRcdFx0XHR2YXIgb0NvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob0ZpZWxkLnJlZmVyZW5jZV90bywgc3BhY2VJZClcclxuXHRcdFx0XHRcdFx0dmFyIHJlZmVyT2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob0ZpZWxkLnJlZmVyZW5jZV90bywgc3BhY2VJZClcclxuXHRcdFx0XHRcdFx0aWYgKG9Db2xsZWN0aW9uICYmIHJlZmVyT2JqZWN0KSB7XHJcblx0XHRcdFx0XHRcdFx0Ly8g5YWI6K6k5Li65q2k5YC85pivcmVmZXJPYmplY3QgX2lk5a2X5q615YC8XHJcblx0XHRcdFx0XHRcdFx0dmFyIHJlZmVyRGF0YSA9IG9Db2xsZWN0aW9uLmZpbmRPbmUodmFsdWVzW2ZtLndvcmtmbG93X2ZpZWxkXSwge1xyXG5cdFx0XHRcdFx0XHRcdFx0ZmllbGRzOiB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdF9pZDogMVxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdGlmIChyZWZlckRhdGEpIHtcclxuXHRcdFx0XHRcdFx0XHRcdG9ialtmbS5vYmplY3RfZmllbGRdID0gcmVmZXJEYXRhLl9pZDtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdC8vIOWFtuasoeiupOS4uuatpOWAvOaYr3JlZmVyT2JqZWN0IE5BTUVfRklFTERfS0VZ5YC8XHJcblx0XHRcdFx0XHRcdFx0aWYgKCFyZWZlckRhdGEpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHZhciBuYW1lRmllbGRLZXkgPSByZWZlck9iamVjdC5OQU1FX0ZJRUxEX0tFWTtcclxuXHRcdFx0XHRcdFx0XHRcdHZhciBzZWxlY3RvciA9IHt9O1xyXG5cdFx0XHRcdFx0XHRcdFx0c2VsZWN0b3JbbmFtZUZpZWxkS2V5XSA9IHZhbHVlc1tmbS53b3JrZmxvd19maWVsZF07XHJcblx0XHRcdFx0XHRcdFx0XHRyZWZlckRhdGEgPSBvQ29sbGVjdGlvbi5maW5kT25lKHNlbGVjdG9yLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGZpZWxkczoge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdF9pZDogMVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChyZWZlckRhdGEpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0b2JqW2ZtLm9iamVjdF9maWVsZF0gPSByZWZlckRhdGEuX2lkO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRpZiAob0ZpZWxkLnR5cGUgPT09IFwiYm9vbGVhblwiKSB7XHJcblx0XHRcdFx0XHRcdFx0dmFyIHRtcF9maWVsZF92YWx1ZSA9IHZhbHVlc1tmbS53b3JrZmxvd19maWVsZF07XHJcblx0XHRcdFx0XHRcdFx0aWYgKFsndHJ1ZScsICfmmK8nXS5pbmNsdWRlcyh0bXBfZmllbGRfdmFsdWUpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRvYmpbZm0ub2JqZWN0X2ZpZWxkXSA9IHRydWU7XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmIChbJ2ZhbHNlJywgJ+WQpiddLmluY2x1ZGVzKHRtcF9maWVsZF92YWx1ZSkpIHtcclxuXHRcdFx0XHRcdFx0XHRcdG9ialtmbS5vYmplY3RfZmllbGRdID0gZmFsc2U7XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdG9ialtmbS5vYmplY3RfZmllbGRdID0gdG1wX2ZpZWxkX3ZhbHVlO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRlbHNlIGlmIChbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMob0ZpZWxkLnR5cGUpICYmIHdGaWVsZC50eXBlID09PSAnb2RhdGEnKSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKG9GaWVsZC5tdWx0aXBsZSAmJiB3RmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcclxuXHRcdFx0XHRcdFx0XHRcdG9ialtmbS5vYmplY3RfZmllbGRdID0gXy5jb21wYWN0KF8ucGx1Y2sodmFsdWVzW2ZtLndvcmtmbG93X2ZpZWxkXSwgJ19pZCcpKVxyXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoIW9GaWVsZC5tdWx0aXBsZSAmJiAhd0ZpZWxkLmlzX211bHRpc2VsZWN0KSB7XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoIV8uaXNFbXB0eSh2YWx1ZXNbZm0ud29ya2Zsb3dfZmllbGRdKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRvYmpbZm0ub2JqZWN0X2ZpZWxkXSA9IHZhbHVlc1tmbS53b3JrZmxvd19maWVsZF0uX2lkXHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdG9ialtmbS5vYmplY3RfZmllbGRdID0gdmFsdWVzW2ZtLndvcmtmbG93X2ZpZWxkXTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0b2JqW2ZtLm9iamVjdF9maWVsZF0gPSB2YWx1ZXNbZm0ud29ya2Zsb3dfZmllbGRdO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGlmIChmbS5vYmplY3RfZmllbGQuaW5kZXhPZignLicpID4gLTEpIHtcclxuXHRcdFx0XHRcdFx0dmFyIHRlbU9iakZpZWxkcyA9IGZtLm9iamVjdF9maWVsZC5zcGxpdCgnLicpO1xyXG5cdFx0XHRcdFx0XHRpZiAodGVtT2JqRmllbGRzLmxlbmd0aCA9PT0gMikge1xyXG5cdFx0XHRcdFx0XHRcdHZhciBvYmpGaWVsZCA9IHRlbU9iakZpZWxkc1swXTtcclxuXHRcdFx0XHRcdFx0XHR2YXIgcmVmZXJPYmpGaWVsZCA9IHRlbU9iakZpZWxkc1sxXTtcclxuXHRcdFx0XHRcdFx0XHR2YXIgb0ZpZWxkID0gb2JqZWN0RmllbGRzW29iakZpZWxkXTtcclxuXHRcdFx0XHRcdFx0XHRpZiAoIW9GaWVsZC5tdWx0aXBsZSAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMob0ZpZWxkLnR5cGUpICYmIF8uaXNTdHJpbmcob0ZpZWxkLnJlZmVyZW5jZV90bykpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHZhciBvQ29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvRmllbGQucmVmZXJlbmNlX3RvLCBzcGFjZUlkKVxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKG9Db2xsZWN0aW9uICYmIHJlY29yZCAmJiByZWNvcmRbb2JqRmllbGRdKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHZhciByZWZlclNldE9iaiA9IHt9O1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRyZWZlclNldE9ialtyZWZlck9iakZpZWxkXSA9IHZhbHVlc1tmbS53b3JrZmxvd19maWVsZF07XHJcblx0XHRcdFx0XHRcdFx0XHRcdG9Db2xsZWN0aW9uLnVwZGF0ZShyZWNvcmRbb2JqRmllbGRdLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0JHNldDogcmVmZXJTZXRPYmpcclxuXHRcdFx0XHRcdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdC8vIGVsc2V7XHJcblx0XHRcdFx0XHQvLyBcdHZhciByZWxhdGVkT2JqZWN0ID0gXy5maW5kKHJlbGF0ZWRPYmplY3RzLCBmdW5jdGlvbihfcmVsYXRlZE9iamVjdCl7XHJcblx0XHRcdFx0XHQvLyBcdFx0cmV0dXJuIF9yZWxhdGVkT2JqZWN0Lm9iamVjdF9uYW1lID09PSBmbS5vYmplY3RfZmllbGRcclxuXHRcdFx0XHRcdC8vIFx0fSlcclxuXHRcdFx0XHRcdC8vXHJcblx0XHRcdFx0XHQvLyBcdGlmKHJlbGF0ZWRPYmplY3Qpe1xyXG5cdFx0XHRcdFx0Ly8gXHRcdG9ialtmbS5vYmplY3RfZmllbGRdID0gdmFsdWVzW2ZtLndvcmtmbG93X2ZpZWxkXTtcclxuXHRcdFx0XHRcdC8vIFx0fVxyXG5cdFx0XHRcdFx0Ly8gfVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0aWYgKGZtLndvcmtmbG93X2ZpZWxkLnN0YXJ0c1dpdGgoJ2luc3RhbmNlLicpKSB7XHJcblx0XHRcdFx0XHR2YXIgaW5zRmllbGQgPSBmbS53b3JrZmxvd19maWVsZC5zcGxpdCgnaW5zdGFuY2UuJylbMV07XHJcblx0XHRcdFx0XHRpZiAoc2VsZi5zeW5jSW5zRmllbGRzLmluY2x1ZGVzKGluc0ZpZWxkKSkge1xyXG5cdFx0XHRcdFx0XHRpZiAoZm0ub2JqZWN0X2ZpZWxkLmluZGV4T2YoJy4nKSA8IDApIHtcclxuXHRcdFx0XHRcdFx0XHRvYmpbZm0ub2JqZWN0X2ZpZWxkXSA9IGluc1tpbnNGaWVsZF07XHJcblx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0dmFyIHRlbU9iakZpZWxkcyA9IGZtLm9iamVjdF9maWVsZC5zcGxpdCgnLicpO1xyXG5cdFx0XHRcdFx0XHRcdGlmICh0ZW1PYmpGaWVsZHMubGVuZ3RoID09PSAyKSB7XHJcblx0XHRcdFx0XHRcdFx0XHR2YXIgb2JqRmllbGQgPSB0ZW1PYmpGaWVsZHNbMF07XHJcblx0XHRcdFx0XHRcdFx0XHR2YXIgcmVmZXJPYmpGaWVsZCA9IHRlbU9iakZpZWxkc1sxXTtcclxuXHRcdFx0XHRcdFx0XHRcdHZhciBvRmllbGQgPSBvYmplY3RGaWVsZHNbb2JqRmllbGRdO1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKCFvRmllbGQubXVsdGlwbGUgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKG9GaWVsZC50eXBlKSAmJiBfLmlzU3RyaW5nKG9GaWVsZC5yZWZlcmVuY2VfdG8pKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHZhciBvQ29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvRmllbGQucmVmZXJlbmNlX3RvLCBzcGFjZUlkKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAob0NvbGxlY3Rpb24gJiYgcmVjb3JkICYmIHJlY29yZFtvYmpGaWVsZF0pIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR2YXIgcmVmZXJTZXRPYmogPSB7fTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZWZlclNldE9ialtyZWZlck9iakZpZWxkXSA9IGluc1tpbnNGaWVsZF07XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0b0NvbGxlY3Rpb24udXBkYXRlKHJlY29yZFtvYmpGaWVsZF0sIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdCRzZXQ6IHJlZmVyU2V0T2JqXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0aWYgKGluc1tmbS53b3JrZmxvd19maWVsZF0pIHtcclxuXHRcdFx0XHRcdFx0b2JqW2ZtLm9iamVjdF9maWVsZF0gPSBpbnNbZm0ud29ya2Zsb3dfZmllbGRdO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHJcblx0XHRfLnVuaXEodGFibGVGaWVsZENvZGVzKS5mb3JFYWNoKGZ1bmN0aW9uICh0ZmMpIHtcclxuXHRcdFx0dmFyIGMgPSBKU09OLnBhcnNlKHRmYyk7XHJcblx0XHRcdG9ialtjLm9iamVjdF90YWJsZV9maWVsZF9jb2RlXSA9IFtdO1xyXG5cdFx0XHR2YWx1ZXNbYy53b3JrZmxvd190YWJsZV9maWVsZF9jb2RlXS5mb3JFYWNoKGZ1bmN0aW9uICh0cikge1xyXG5cdFx0XHRcdHZhciBuZXdUciA9IHt9O1xyXG5cdFx0XHRcdF8uZWFjaCh0ciwgZnVuY3Rpb24gKHYsIGspIHtcclxuXHRcdFx0XHRcdHRhYmxlRmllbGRNYXAuZm9yRWFjaChmdW5jdGlvbiAodGZtKSB7XHJcblx0XHRcdFx0XHRcdGlmICh0Zm0ud29ya2Zsb3dfZmllbGQgPT0gKGMud29ya2Zsb3dfdGFibGVfZmllbGRfY29kZSArICcuJC4nICsgaykpIHtcclxuXHRcdFx0XHRcdFx0XHR2YXIgb1RkQ29kZSA9IHRmbS5vYmplY3RfZmllbGQuc3BsaXQoJy4kLicpWzFdO1xyXG5cdFx0XHRcdFx0XHRcdG5ld1RyW29UZENvZGVdID0gdjtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHRcdGlmICghXy5pc0VtcHR5KG5ld1RyKSkge1xyXG5cdFx0XHRcdFx0b2JqW2Mub2JqZWN0X3RhYmxlX2ZpZWxkX2NvZGVdLnB1c2gobmV3VHIpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHRcdH0pO1xyXG5cdFx0dmFyIHJlbGF0ZWRPYmpzID0ge307XHJcblx0XHR2YXIgZ2V0UmVsYXRlZEZpZWxkVmFsdWUgPSBmdW5jdGlvbiAodmFsdWVLZXksIHBhcmVudCkge1xyXG5cdFx0XHRyZXR1cm4gdmFsdWVLZXkuc3BsaXQoJy4nKS5yZWR1Y2UoZnVuY3Rpb24gKG8sIHgpIHtcclxuXHRcdFx0XHRyZXR1cm4gb1t4XTtcclxuXHRcdFx0fSwgcGFyZW50KTtcclxuXHRcdH07XHJcblx0XHRfLmVhY2godGFibGVUb1JlbGF0ZWRNYXAsIGZ1bmN0aW9uIChtYXAsIGtleSkge1xyXG5cdFx0XHR2YXIgdGFibGVDb2RlID0gbWFwLl9GUk9NX1RBQkxFX0NPREU7XHJcblx0XHRcdGlmICghdGFibGVDb2RlKSB7XHJcblx0XHRcdFx0Y29uc29sZS53YXJuKCd0YWJsZVRvUmVsYXRlZDogWycgKyBrZXkgKyAnXSBtaXNzaW5nIGNvcnJlc3BvbmRpbmcgdGFibGUuJylcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR2YXIgcmVsYXRlZE9iamVjdE5hbWUgPSBrZXk7XHJcblx0XHRcdFx0dmFyIHJlbGF0ZWRPYmplY3RWYWx1ZXMgPSBbXTtcclxuXHRcdFx0XHR2YXIgcmVsYXRlZE9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlbGF0ZWRPYmplY3ROYW1lLCBzcGFjZUlkKTtcclxuXHRcdFx0XHRfLmVhY2godmFsdWVzW3RhYmxlQ29kZV0sIGZ1bmN0aW9uICh0YWJsZVZhbHVlSXRlbSkge1xyXG5cdFx0XHRcdFx0dmFyIHJlbGF0ZWRPYmplY3RWYWx1ZSA9IHt9O1xyXG5cdFx0XHRcdFx0Xy5lYWNoKG1hcCwgZnVuY3Rpb24gKHZhbHVlS2V5LCBmaWVsZEtleSkge1xyXG5cdFx0XHRcdFx0XHRpZiAoZmllbGRLZXkgIT0gJ19GUk9NX1RBQkxFX0NPREUnKSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKHZhbHVlS2V5LnN0YXJ0c1dpdGgoJ2luc3RhbmNlLicpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRyZWxhdGVkT2JqZWN0VmFsdWVbZmllbGRLZXldID0gZ2V0UmVsYXRlZEZpZWxkVmFsdWUodmFsdWVLZXksIHsgJ2luc3RhbmNlJzogaW5zIH0pO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdHZhciByZWxhdGVkT2JqZWN0RmllbGRWYWx1ZSwgZm9ybUZpZWxkS2V5O1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKHZhbHVlS2V5LnN0YXJ0c1dpdGgodGFibGVDb2RlICsgJy4nKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRmb3JtRmllbGRLZXkgPSB2YWx1ZUtleS5zcGxpdChcIi5cIilbMV07XHJcblx0XHRcdFx0XHRcdFx0XHRcdHJlbGF0ZWRPYmplY3RGaWVsZFZhbHVlID0gZ2V0UmVsYXRlZEZpZWxkVmFsdWUodmFsdWVLZXksIHsgW3RhYmxlQ29kZV06IHRhYmxlVmFsdWVJdGVtIH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0Zm9ybUZpZWxkS2V5ID0gdmFsdWVLZXk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHJlbGF0ZWRPYmplY3RGaWVsZFZhbHVlID0gZ2V0UmVsYXRlZEZpZWxkVmFsdWUodmFsdWVLZXksIHZhbHVlcylcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdHZhciBmb3JtRmllbGQgPSBnZXRGb3JtRmllbGQoZm9ybUZpZWxkcywgZm9ybUZpZWxkS2V5KTtcclxuXHRcdFx0XHRcdFx0XHRcdHZhciByZWxhdGVkT2JqZWN0RmllbGQgPSByZWxhdGVkT2JqZWN0LmZpZWxkc1tmaWVsZEtleV07XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoZm9ybUZpZWxkLnR5cGUgPT0gJ29kYXRhJyAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMocmVsYXRlZE9iamVjdEZpZWxkLnR5cGUpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmICghXy5pc0VtcHR5KHJlbGF0ZWRPYmplY3RGaWVsZFZhbHVlKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChyZWxhdGVkT2JqZWN0RmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZWxhdGVkT2JqZWN0RmllbGRWYWx1ZSA9IF8uY29tcGFjdChfLnBsdWNrKHJlbGF0ZWRPYmplY3RGaWVsZFZhbHVlLCAnX2lkJykpXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmICghcmVsYXRlZE9iamVjdEZpZWxkLm11bHRpcGxlICYmICFmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJlbGF0ZWRPYmplY3RGaWVsZFZhbHVlID0gcmVsYXRlZE9iamVjdEZpZWxkVmFsdWUuX2lkXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRyZWxhdGVkT2JqZWN0VmFsdWVbZmllbGRLZXldID0gcmVsYXRlZE9iamVjdEZpZWxkVmFsdWU7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdHJlbGF0ZWRPYmplY3RWYWx1ZVsnX3RhYmxlJ10gPSB7XHJcblx0XHRcdFx0XHRcdF9pZDogdGFibGVWYWx1ZUl0ZW1bXCJfaWRcIl0sXHJcblx0XHRcdFx0XHRcdF9jb2RlOiB0YWJsZUNvZGVcclxuXHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRyZWxhdGVkT2JqZWN0VmFsdWVzLnB1c2gocmVsYXRlZE9iamVjdFZhbHVlKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRyZWxhdGVkT2Jqc1tyZWxhdGVkT2JqZWN0TmFtZV0gPSByZWxhdGVkT2JqZWN0VmFsdWVzO1xyXG5cdFx0XHR9XHJcblx0XHR9KVxyXG5cclxuXHRcdGlmIChmaWVsZF9tYXBfYmFja19zY3JpcHQpIHtcclxuXHRcdFx0Xy5leHRlbmQob2JqLCBzZWxmLmV2YWxGaWVsZE1hcEJhY2tTY3JpcHQoZmllbGRfbWFwX2JhY2tfc2NyaXB0LCBpbnMpKTtcclxuXHRcdH1cclxuXHRcdC8vIOi/h+a7pOaOiemdnuazleeahGtleVxyXG5cdFx0dmFyIGZpbHRlck9iaiA9IHt9O1xyXG5cclxuXHRcdF8uZWFjaChfLmtleXMob2JqKSwgZnVuY3Rpb24gKGspIHtcclxuXHRcdFx0aWYgKG9iamVjdEZpZWxkS2V5cy5pbmNsdWRlcyhrKSkge1xyXG5cdFx0XHRcdGZpbHRlck9ialtrXSA9IG9ialtrXTtcclxuXHRcdFx0fVxyXG5cdFx0XHQvLyBlbHNlIGlmKHJlbGF0ZWRPYmplY3RzS2V5cy5pbmNsdWRlcyhrKSAmJiBfLmlzQXJyYXkob2JqW2tdKSl7XHJcblx0XHRcdC8vIFx0aWYoXy5pc0FycmF5KHJlbGF0ZWRPYmpzW2tdKSl7XHJcblx0XHRcdC8vIFx0XHRyZWxhdGVkT2Jqc1trXSA9IHJlbGF0ZWRPYmpzW2tdLmNvbmNhdChvYmpba10pXHJcblx0XHRcdC8vIFx0fWVsc2V7XHJcblx0XHRcdC8vIFx0XHRyZWxhdGVkT2Jqc1trXSA9IG9ialtrXVxyXG5cdFx0XHQvLyBcdH1cclxuXHRcdFx0Ly8gfVxyXG5cdFx0fSlcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdG1haW5PYmplY3RWYWx1ZTogZmlsdGVyT2JqLFxyXG5cdFx0XHRyZWxhdGVkT2JqZWN0c1ZhbHVlOiByZWxhdGVkT2Jqc1xyXG5cdFx0fTtcclxuXHR9XHJcblxyXG5cdHNlbGYuZXZhbEZpZWxkTWFwQmFja1NjcmlwdCA9IGZ1bmN0aW9uIChmaWVsZF9tYXBfYmFja19zY3JpcHQsIGlucykge1xyXG5cdFx0dmFyIHNjcmlwdCA9IFwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHsgXCIgKyBmaWVsZF9tYXBfYmFja19zY3JpcHQgKyBcIiB9XCI7XHJcblx0XHR2YXIgZnVuYyA9IF9ldmFsKHNjcmlwdCwgXCJmaWVsZF9tYXBfc2NyaXB0XCIpO1xyXG5cdFx0dmFyIHZhbHVlcyA9IGZ1bmMoaW5zKTtcclxuXHRcdGlmIChfLmlzT2JqZWN0KHZhbHVlcykpIHtcclxuXHRcdFx0cmV0dXJuIHZhbHVlcztcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGNvbnNvbGUuZXJyb3IoXCJldmFsRmllbGRNYXBCYWNrU2NyaXB0OiDohJrmnKzov5Tlm57lgLznsbvlnovkuI3mmK/lr7nosaFcIik7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4ge31cclxuXHR9XHJcblxyXG5cdHNlbGYuc3luY1JlbGF0ZWRPYmplY3RzVmFsdWUgPSBmdW5jdGlvbiAobWFpblJlY29yZElkLCByZWxhdGVkT2JqZWN0cywgcmVsYXRlZE9iamVjdHNWYWx1ZSwgc3BhY2VJZCwgaW5zKSB7XHJcblx0XHR2YXIgaW5zSWQgPSBpbnMuX2lkO1xyXG5cclxuXHRcdF8uZWFjaChyZWxhdGVkT2JqZWN0cywgZnVuY3Rpb24gKHJlbGF0ZWRPYmplY3QpIHtcclxuXHRcdFx0dmFyIG9iamVjdENvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVsYXRlZE9iamVjdC5vYmplY3RfbmFtZSwgc3BhY2VJZCk7XHJcblx0XHRcdHZhciB0YWJsZU1hcCA9IHt9O1xyXG5cdFx0XHRfLmVhY2gocmVsYXRlZE9iamVjdHNWYWx1ZVtyZWxhdGVkT2JqZWN0Lm9iamVjdF9uYW1lXSwgZnVuY3Rpb24gKHJlbGF0ZWRPYmplY3RWYWx1ZSkge1xyXG5cdFx0XHRcdHZhciB0YWJsZV9pZCA9IHJlbGF0ZWRPYmplY3RWYWx1ZS5fdGFibGUuX2lkO1xyXG5cdFx0XHRcdHZhciB0YWJsZV9jb2RlID0gcmVsYXRlZE9iamVjdFZhbHVlLl90YWJsZS5fY29kZTtcclxuXHRcdFx0XHRpZiAoIXRhYmxlTWFwW3RhYmxlX2NvZGVdKSB7XHJcblx0XHRcdFx0XHR0YWJsZU1hcFt0YWJsZV9jb2RlXSA9IFtdXHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHR0YWJsZU1hcFt0YWJsZV9jb2RlXS5wdXNoKHRhYmxlX2lkKTtcclxuXHRcdFx0XHR2YXIgb2xkUmVsYXRlZFJlY29yZCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWxhdGVkT2JqZWN0Lm9iamVjdF9uYW1lLCBzcGFjZUlkKS5maW5kT25lKHsgW3JlbGF0ZWRPYmplY3QuZm9yZWlnbl9rZXldOiBtYWluUmVjb3JkSWQsIFwiaW5zdGFuY2VzLl9pZFwiOiBpbnNJZCwgX3RhYmxlOiByZWxhdGVkT2JqZWN0VmFsdWUuX3RhYmxlIH0sIHsgZmllbGRzOiB7IF9pZDogMSB9IH0pXHJcblx0XHRcdFx0aWYgKG9sZFJlbGF0ZWRSZWNvcmQpIHtcclxuXHRcdFx0XHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWxhdGVkT2JqZWN0Lm9iamVjdF9uYW1lLCBzcGFjZUlkKS51cGRhdGUoeyBfaWQ6IG9sZFJlbGF0ZWRSZWNvcmQuX2lkIH0sIHsgJHNldDogcmVsYXRlZE9iamVjdFZhbHVlIH0pXHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHJlbGF0ZWRPYmplY3RWYWx1ZVtyZWxhdGVkT2JqZWN0LmZvcmVpZ25fa2V5XSA9IG1haW5SZWNvcmRJZDtcclxuXHRcdFx0XHRcdHJlbGF0ZWRPYmplY3RWYWx1ZS5zcGFjZSA9IHNwYWNlSWQ7XHJcblx0XHRcdFx0XHRyZWxhdGVkT2JqZWN0VmFsdWUub3duZXIgPSBpbnMuYXBwbGljYW50O1xyXG5cdFx0XHRcdFx0cmVsYXRlZE9iamVjdFZhbHVlLmNyZWF0ZWRfYnkgPSBpbnMuYXBwbGljYW50O1xyXG5cdFx0XHRcdFx0cmVsYXRlZE9iamVjdFZhbHVlLm1vZGlmaWVkX2J5ID0gaW5zLmFwcGxpY2FudDtcclxuXHRcdFx0XHRcdHJlbGF0ZWRPYmplY3RWYWx1ZS5faWQgPSBvYmplY3RDb2xsZWN0aW9uLl9tYWtlTmV3SUQoKTtcclxuXHRcdFx0XHRcdHZhciBpbnN0YW5jZV9zdGF0ZSA9IGlucy5zdGF0ZTtcclxuXHRcdFx0XHRcdGlmIChpbnMuc3RhdGUgPT09ICdjb21wbGV0ZWQnICYmIGlucy5maW5hbF9kZWNpc2lvbikge1xyXG5cdFx0XHRcdFx0XHRpbnN0YW5jZV9zdGF0ZSA9IGlucy5maW5hbF9kZWNpc2lvbjtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHJlbGF0ZWRPYmplY3RWYWx1ZS5pbnN0YW5jZXMgPSBbe1xyXG5cdFx0XHRcdFx0XHRfaWQ6IGluc0lkLFxyXG5cdFx0XHRcdFx0XHRzdGF0ZTogaW5zdGFuY2Vfc3RhdGVcclxuXHRcdFx0XHRcdH1dO1xyXG5cdFx0XHRcdFx0cmVsYXRlZE9iamVjdFZhbHVlLmluc3RhbmNlX3N0YXRlID0gaW5zdGFuY2Vfc3RhdGU7XHJcblx0XHRcdFx0XHRDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVsYXRlZE9iamVjdC5vYmplY3RfbmFtZSwgc3BhY2VJZCkuaW5zZXJ0KHJlbGF0ZWRPYmplY3RWYWx1ZSwgeyB2YWxpZGF0ZTogZmFsc2UsIGZpbHRlcjogZmFsc2UgfSlcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pXHJcblx0XHRcdC8v5riF55CG55Sz6K+35Y2V5LiK6KKr5Yig6Zmk5a2Q6KGo6K6w5b2V5a+55bqU55qE55u45YWz6KGo6K6w5b2VXHJcblx0XHRcdF8uZWFjaCh0YWJsZU1hcCwgZnVuY3Rpb24gKHRhYmxlSWRzLCB0YWJsZUNvZGUpIHtcclxuXHRcdFx0XHRvYmplY3RDb2xsZWN0aW9uLnJlbW92ZSh7XHJcblx0XHRcdFx0XHRbcmVsYXRlZE9iamVjdC5mb3JlaWduX2tleV06IG1haW5SZWNvcmRJZCxcclxuXHRcdFx0XHRcdFwiaW5zdGFuY2VzLl9pZFwiOiBpbnNJZCxcclxuXHRcdFx0XHRcdFwiX3RhYmxlLl9jb2RlXCI6IHRhYmxlQ29kZSxcclxuXHRcdFx0XHRcdFwiX3RhYmxlLl9pZFwiOiB7ICRuaW46IHRhYmxlSWRzIH1cclxuXHRcdFx0XHR9KVxyXG5cdFx0XHR9KVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0dGFibGVJZHMgPSBfLmNvbXBhY3QodGFibGVJZHMpO1xyXG5cclxuXHJcblx0fVxyXG5cclxuXHRzZWxmLnNlbmREb2MgPSBmdW5jdGlvbiAoZG9jKSB7XHJcblx0XHRpZiAoSW5zdGFuY2VSZWNvcmRRdWV1ZS5kZWJ1Zykge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhcInNlbmREb2NcIik7XHJcblx0XHRcdGNvbnNvbGUubG9nKGRvYyk7XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIGluc0lkID0gZG9jLmluZm8uaW5zdGFuY2VfaWQsXHJcblx0XHRcdHJlY29yZHMgPSBkb2MuaW5mby5yZWNvcmRzO1xyXG5cdFx0dmFyIGZpZWxkcyA9IHtcclxuXHRcdFx0ZmxvdzogMSxcclxuXHRcdFx0dmFsdWVzOiAxLFxyXG5cdFx0XHRhcHBsaWNhbnQ6IDEsXHJcblx0XHRcdHNwYWNlOiAxLFxyXG5cdFx0XHRmb3JtOiAxLFxyXG5cdFx0XHRmb3JtX3ZlcnNpb246IDEsXHJcblx0XHRcdHRyYWNlczogMVxyXG5cdFx0fTtcclxuXHRcdHNlbGYuc3luY0luc0ZpZWxkcy5mb3JFYWNoKGZ1bmN0aW9uIChmKSB7XHJcblx0XHRcdGZpZWxkc1tmXSA9IDE7XHJcblx0XHR9KVxyXG5cdFx0dmFyIGlucyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignaW5zdGFuY2VzJykuZmluZE9uZShpbnNJZCwge1xyXG5cdFx0XHRmaWVsZHM6IGZpZWxkc1xyXG5cdFx0fSk7XHJcblx0XHR2YXIgdmFsdWVzID0gaW5zLnZhbHVlcyxcclxuXHRcdFx0c3BhY2VJZCA9IGlucy5zcGFjZTtcclxuXHJcblx0XHRpZiAocmVjb3JkcyAmJiAhXy5pc0VtcHR5KHJlY29yZHMpKSB7XHJcblx0XHRcdC8vIOatpOaDheWGteWxnuS6juS7jmNyZWF0b3LkuK3lj5HotbflrqHmibnvvIzmiJbogIXlt7Lnu4/ku45BcHBz5ZCM5q2l5Yiw5LqGY3JlYXRvclxyXG5cdFx0XHR2YXIgb2JqZWN0TmFtZSA9IHJlY29yZHNbMF0ubztcclxuXHRcdFx0dmFyIG93ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdvYmplY3Rfd29ya2Zsb3dzJykuZmluZE9uZSh7XHJcblx0XHRcdFx0b2JqZWN0X25hbWU6IG9iamVjdE5hbWUsXHJcblx0XHRcdFx0Zmxvd19pZDogaW5zLmZsb3dcclxuXHRcdFx0fSk7XHJcblx0XHRcdHZhclxyXG5cdFx0XHRcdG9iamVjdENvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0TmFtZSwgc3BhY2VJZCksXHJcblx0XHRcdFx0c3luY19hdHRhY2htZW50ID0gb3cuc3luY19hdHRhY2htZW50O1xyXG5cdFx0XHR2YXIgb2JqZWN0SW5mbyA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdE5hbWUsIHNwYWNlSWQpO1xyXG5cdFx0XHRvYmplY3RDb2xsZWN0aW9uLmZpbmQoe1xyXG5cdFx0XHRcdF9pZDoge1xyXG5cdFx0XHRcdFx0JGluOiByZWNvcmRzWzBdLmlkc1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSkuZm9yRWFjaChmdW5jdGlvbiAocmVjb3JkKSB7XHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdHZhciBzeW5jVmFsdWVzID0gc2VsZi5zeW5jVmFsdWVzKG93LmZpZWxkX21hcF9iYWNrLCB2YWx1ZXMsIGlucywgb2JqZWN0SW5mbywgb3cuZmllbGRfbWFwX2JhY2tfc2NyaXB0LCByZWNvcmQpXHJcblx0XHRcdFx0XHR2YXIgc2V0T2JqID0gc3luY1ZhbHVlcy5tYWluT2JqZWN0VmFsdWU7XHJcblxyXG5cdFx0XHRcdFx0dmFyIGluc3RhbmNlX3N0YXRlID0gaW5zLnN0YXRlO1xyXG5cdFx0XHRcdFx0aWYgKGlucy5zdGF0ZSA9PT0gJ2NvbXBsZXRlZCcgJiYgaW5zLmZpbmFsX2RlY2lzaW9uKSB7XHJcblx0XHRcdFx0XHRcdGluc3RhbmNlX3N0YXRlID0gaW5zLmZpbmFsX2RlY2lzaW9uO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0c2V0T2JqWydpbnN0YW5jZXMuJC5zdGF0ZSddID0gc2V0T2JqLmluc3RhbmNlX3N0YXRlID0gaW5zdGFuY2Vfc3RhdGU7XHJcblxyXG5cdFx0XHRcdFx0b2JqZWN0Q29sbGVjdGlvbi51cGRhdGUoe1xyXG5cdFx0XHRcdFx0XHRfaWQ6IHJlY29yZC5faWQsXHJcblx0XHRcdFx0XHRcdCdpbnN0YW5jZXMuX2lkJzogaW5zSWRcclxuXHRcdFx0XHRcdH0sIHtcclxuXHRcdFx0XHRcdFx0JHNldDogc2V0T2JqXHJcblx0XHRcdFx0XHR9KVxyXG5cclxuXHRcdFx0XHRcdHZhciByZWxhdGVkT2JqZWN0cyA9IENyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdHMob3cub2JqZWN0X25hbWUsIHNwYWNlSWQpO1xyXG5cdFx0XHRcdFx0dmFyIHJlbGF0ZWRPYmplY3RzVmFsdWUgPSBzeW5jVmFsdWVzLnJlbGF0ZWRPYmplY3RzVmFsdWU7XHJcblx0XHRcdFx0XHRzZWxmLnN5bmNSZWxhdGVkT2JqZWN0c1ZhbHVlKHJlY29yZC5faWQsIHJlbGF0ZWRPYmplY3RzLCByZWxhdGVkT2JqZWN0c1ZhbHVlLCBzcGFjZUlkLCBpbnMpO1xyXG5cclxuXHJcblx0XHRcdFx0XHQvLyDku6XmnIDnu4jnlLPor7fljZXpmYTku7bkuLrlh4bvvIzml6fnmoRyZWNvcmTkuK3pmYTku7bliKDpmaRcclxuXHRcdFx0XHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbignY21zX2ZpbGVzJykucmVtb3ZlKHtcclxuXHRcdFx0XHRcdFx0J3BhcmVudCc6IHtcclxuXHRcdFx0XHRcdFx0XHRvOiBvYmplY3ROYW1lLFxyXG5cdFx0XHRcdFx0XHRcdGlkczogW3JlY29yZC5faWRdXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHR2YXIgcmVtb3ZlT2xkRmlsZXMgPSBmdW5jdGlvbiAoY2IpIHtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIGNmcy5maWxlcy5yZW1vdmUoe1xyXG5cdFx0XHRcdFx0XHRcdCdtZXRhZGF0YS5yZWNvcmRfaWQnOiByZWNvcmQuX2lkXHJcblx0XHRcdFx0XHRcdH0sIGNiKTtcclxuXHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRNZXRlb3Iud3JhcEFzeW5jKHJlbW92ZU9sZEZpbGVzKSgpO1xyXG5cdFx0XHRcdFx0Ly8g5ZCM5q2l5paw6ZmE5Lu2XHJcblx0XHRcdFx0XHRzZWxmLnN5bmNBdHRhY2goc3luY19hdHRhY2htZW50LCBpbnNJZCwgcmVjb3JkLnNwYWNlLCByZWNvcmQuX2lkLCBvYmplY3ROYW1lKTtcclxuXHRcdFx0XHR9IGNhdGNoIChlcnJvcikge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvcihlcnJvci5zdGFjayk7XHJcblx0XHRcdFx0XHRvYmplY3RDb2xsZWN0aW9uLnVwZGF0ZSh7XHJcblx0XHRcdFx0XHRcdF9pZDogcmVjb3JkLl9pZCxcclxuXHRcdFx0XHRcdFx0J2luc3RhbmNlcy5faWQnOiBpbnNJZFxyXG5cdFx0XHRcdFx0fSwge1xyXG5cdFx0XHRcdFx0XHQkc2V0OiB7XHJcblx0XHRcdFx0XHRcdFx0J2luc3RhbmNlcy4kLnN0YXRlJzogJ3BlbmRpbmcnLFxyXG5cdFx0XHRcdFx0XHRcdCdpbnN0YW5jZV9zdGF0ZSc6ICdwZW5kaW5nJ1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KVxyXG5cclxuXHRcdFx0XHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbignY21zX2ZpbGVzJykucmVtb3ZlKHtcclxuXHRcdFx0XHRcdFx0J3BhcmVudCc6IHtcclxuXHRcdFx0XHRcdFx0XHRvOiBvYmplY3ROYW1lLFxyXG5cdFx0XHRcdFx0XHRcdGlkczogW3JlY29yZC5faWRdXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHRjZnMuZmlsZXMucmVtb3ZlKHtcclxuXHRcdFx0XHRcdFx0J21ldGFkYXRhLnJlY29yZF9pZCc6IHJlY29yZC5faWRcclxuXHRcdFx0XHRcdH0pXHJcblxyXG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGVycm9yKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHR9KVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Ly8g5q2k5oOF5Ya15bGe5LqO5LuOYXBwc+S4reWPkei1t+WuoeaJuVxyXG5cdFx0XHRDcmVhdG9yLmdldENvbGxlY3Rpb24oJ29iamVjdF93b3JrZmxvd3MnKS5maW5kKHtcclxuXHRcdFx0XHRmbG93X2lkOiBpbnMuZmxvd1xyXG5cdFx0XHR9KS5mb3JFYWNoKGZ1bmN0aW9uIChvdykge1xyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHR2YXJcclxuXHRcdFx0XHRcdFx0b2JqZWN0Q29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvdy5vYmplY3RfbmFtZSwgc3BhY2VJZCksXHJcblx0XHRcdFx0XHRcdHN5bmNfYXR0YWNobWVudCA9IG93LnN5bmNfYXR0YWNobWVudCxcclxuXHRcdFx0XHRcdFx0bmV3UmVjb3JkSWQgPSBvYmplY3RDb2xsZWN0aW9uLl9tYWtlTmV3SUQoKSxcclxuXHRcdFx0XHRcdFx0b2JqZWN0TmFtZSA9IG93Lm9iamVjdF9uYW1lO1xyXG5cclxuXHRcdFx0XHRcdHZhciBvYmplY3RJbmZvID0gQ3JlYXRvci5nZXRPYmplY3Qob3cub2JqZWN0X25hbWUsIHNwYWNlSWQpO1xyXG5cdFx0XHRcdFx0dmFyIHN5bmNWYWx1ZXMgPSBzZWxmLnN5bmNWYWx1ZXMob3cuZmllbGRfbWFwX2JhY2ssIHZhbHVlcywgaW5zLCBvYmplY3RJbmZvLCBvdy5maWVsZF9tYXBfYmFja19zY3JpcHQpO1xyXG5cdFx0XHRcdFx0dmFyIG5ld09iaiA9IHN5bmNWYWx1ZXMubWFpbk9iamVjdFZhbHVlO1xyXG5cclxuXHRcdFx0XHRcdG5ld09iai5faWQgPSBuZXdSZWNvcmRJZDtcclxuXHRcdFx0XHRcdG5ld09iai5zcGFjZSA9IHNwYWNlSWQ7XHJcblx0XHRcdFx0XHRuZXdPYmoubmFtZSA9IG5ld09iai5uYW1lIHx8IGlucy5uYW1lO1xyXG5cclxuXHRcdFx0XHRcdHZhciBpbnN0YW5jZV9zdGF0ZSA9IGlucy5zdGF0ZTtcclxuXHRcdFx0XHRcdGlmIChpbnMuc3RhdGUgPT09ICdjb21wbGV0ZWQnICYmIGlucy5maW5hbF9kZWNpc2lvbikge1xyXG5cdFx0XHRcdFx0XHRpbnN0YW5jZV9zdGF0ZSA9IGlucy5maW5hbF9kZWNpc2lvbjtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdG5ld09iai5pbnN0YW5jZXMgPSBbe1xyXG5cdFx0XHRcdFx0XHRfaWQ6IGluc0lkLFxyXG5cdFx0XHRcdFx0XHRzdGF0ZTogaW5zdGFuY2Vfc3RhdGVcclxuXHRcdFx0XHRcdH1dO1xyXG5cdFx0XHRcdFx0bmV3T2JqLmluc3RhbmNlX3N0YXRlID0gaW5zdGFuY2Vfc3RhdGU7XHJcblxyXG5cdFx0XHRcdFx0bmV3T2JqLm93bmVyID0gaW5zLmFwcGxpY2FudDtcclxuXHRcdFx0XHRcdG5ld09iai5jcmVhdGVkX2J5ID0gaW5zLmFwcGxpY2FudDtcclxuXHRcdFx0XHRcdG5ld09iai5tb2RpZmllZF9ieSA9IGlucy5hcHBsaWNhbnQ7XHJcblx0XHRcdFx0XHR2YXIgciA9IG9iamVjdENvbGxlY3Rpb24uaW5zZXJ0KG5ld09iaik7XHJcblx0XHRcdFx0XHRpZiAocikge1xyXG5cdFx0XHRcdFx0XHRDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2luc3RhbmNlcycpLnVwZGF0ZShpbnMuX2lkLCB7XHJcblx0XHRcdFx0XHRcdFx0JHB1c2g6IHtcclxuXHRcdFx0XHRcdFx0XHRcdHJlY29yZF9pZHM6IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0bzogb2JqZWN0TmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWRzOiBbbmV3UmVjb3JkSWRdXHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0XHR2YXIgcmVsYXRlZE9iamVjdHMgPSBDcmVhdG9yLmdldFJlbGF0ZWRPYmplY3RzKG93Lm9iamVjdF9uYW1lLCBzcGFjZUlkKTtcclxuXHRcdFx0XHRcdFx0dmFyIHJlbGF0ZWRPYmplY3RzVmFsdWUgPSBzeW5jVmFsdWVzLnJlbGF0ZWRPYmplY3RzVmFsdWU7XHJcblx0XHRcdFx0XHRcdHNlbGYuc3luY1JlbGF0ZWRPYmplY3RzVmFsdWUobmV3UmVjb3JkSWQsIHJlbGF0ZWRPYmplY3RzLCByZWxhdGVkT2JqZWN0c1ZhbHVlLCBzcGFjZUlkLCBpbnMpO1xyXG5cdFx0XHRcdFx0XHQvLyB3b3JrZmxvd+mHjOWPkei1t+WuoeaJueWQju+8jOWQjOatpeaXtuS5n+WPr+S7peS/ruaUueebuOWFs+ihqOeahOWtl+auteWAvCAjMTE4M1xyXG5cdFx0XHRcdFx0XHR2YXIgcmVjb3JkID0gb2JqZWN0Q29sbGVjdGlvbi5maW5kT25lKG5ld1JlY29yZElkKTtcclxuXHRcdFx0XHRcdFx0c2VsZi5zeW5jVmFsdWVzKG93LmZpZWxkX21hcF9iYWNrLCB2YWx1ZXMsIGlucywgb2JqZWN0SW5mbywgb3cuZmllbGRfbWFwX2JhY2tfc2NyaXB0LCByZWNvcmQpO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdC8vIOmZhOS7tuWQjOatpVxyXG5cdFx0XHRcdFx0c2VsZi5zeW5jQXR0YWNoKHN5bmNfYXR0YWNobWVudCwgaW5zSWQsIHNwYWNlSWQsIG5ld1JlY29yZElkLCBvYmplY3ROYW1lKTtcclxuXHJcblx0XHRcdFx0fSBjYXRjaCAoZXJyb3IpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoZXJyb3Iuc3RhY2spO1xyXG5cclxuXHRcdFx0XHRcdG9iamVjdENvbGxlY3Rpb24ucmVtb3ZlKHtcclxuXHRcdFx0XHRcdFx0X2lkOiBuZXdSZWNvcmRJZCxcclxuXHRcdFx0XHRcdFx0c3BhY2U6IHNwYWNlSWRcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKCdpbnN0YW5jZXMnKS51cGRhdGUoaW5zLl9pZCwge1xyXG5cdFx0XHRcdFx0XHQkcHVsbDoge1xyXG5cdFx0XHRcdFx0XHRcdHJlY29yZF9pZHM6IHtcclxuXHRcdFx0XHRcdFx0XHRcdG86IG9iamVjdE5hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRpZHM6IFtuZXdSZWNvcmRJZF1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHRDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2Ntc19maWxlcycpLnJlbW92ZSh7XHJcblx0XHRcdFx0XHRcdCdwYXJlbnQnOiB7XHJcblx0XHRcdFx0XHRcdFx0bzogb2JqZWN0TmFtZSxcclxuXHRcdFx0XHRcdFx0XHRpZHM6IFtuZXdSZWNvcmRJZF1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdGNmcy5maWxlcy5yZW1vdmUoe1xyXG5cdFx0XHRcdFx0XHQnbWV0YWRhdGEucmVjb3JkX2lkJzogbmV3UmVjb3JkSWRcclxuXHRcdFx0XHRcdH0pXHJcblxyXG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGVycm9yKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHR9KVxyXG5cdFx0fVxyXG5cclxuXHRcdEluc3RhbmNlUmVjb3JkUXVldWUuY29sbGVjdGlvbi51cGRhdGUoZG9jLl9pZCwge1xyXG5cdFx0XHQkc2V0OiB7XHJcblx0XHRcdFx0J2luZm8uc3luY19kYXRlJzogbmV3IERhdGUoKVxyXG5cdFx0XHR9XHJcblx0XHR9KVxyXG5cclxuXHR9XHJcblxyXG5cdC8vIFVuaXZlcnNhbCBzZW5kIGZ1bmN0aW9uXHJcblx0dmFyIF9xdWVyeVNlbmQgPSBmdW5jdGlvbiAoZG9jKSB7XHJcblxyXG5cdFx0aWYgKHNlbGYuc2VuZERvYykge1xyXG5cdFx0XHRzZWxmLnNlbmREb2MoZG9jKTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRkb2M6IFtkb2MuX2lkXVxyXG5cdFx0fTtcclxuXHR9O1xyXG5cclxuXHRzZWxmLnNlcnZlclNlbmQgPSBmdW5jdGlvbiAoZG9jKSB7XHJcblx0XHRkb2MgPSBkb2MgfHwge307XHJcblx0XHRyZXR1cm4gX3F1ZXJ5U2VuZChkb2MpO1xyXG5cdH07XHJcblxyXG5cclxuXHQvLyBUaGlzIGludGVydmFsIHdpbGwgYWxsb3cgb25seSBvbmUgZG9jIHRvIGJlIHNlbnQgYXQgYSB0aW1lLCBpdFxyXG5cdC8vIHdpbGwgY2hlY2sgZm9yIG5ldyBkb2NzIGF0IGV2ZXJ5IGBvcHRpb25zLnNlbmRJbnRlcnZhbGBcclxuXHQvLyAoZGVmYXVsdCBpbnRlcnZhbCBpcyAxNTAwMCBtcylcclxuXHQvL1xyXG5cdC8vIEl0IGxvb2tzIGluIGRvY3MgY29sbGVjdGlvbiB0byBzZWUgaWYgdGhlcmVzIGFueSBwZW5kaW5nXHJcblx0Ly8gZG9jcywgaWYgc28gaXQgd2lsbCB0cnkgdG8gcmVzZXJ2ZSB0aGUgcGVuZGluZyBkb2MuXHJcblx0Ly8gSWYgc3VjY2Vzc2Z1bGx5IHJlc2VydmVkIHRoZSBzZW5kIGlzIHN0YXJ0ZWQuXHJcblx0Ly9cclxuXHQvLyBJZiBkb2MucXVlcnkgaXMgdHlwZSBzdHJpbmcsIGl0J3MgYXNzdW1lZCB0byBiZSBhIGpzb24gc3RyaW5nXHJcblx0Ly8gdmVyc2lvbiBvZiB0aGUgcXVlcnkgc2VsZWN0b3IuIE1ha2luZyBpdCBhYmxlIHRvIGNhcnJ5IGAkYCBwcm9wZXJ0aWVzIGluXHJcblx0Ly8gdGhlIG1vbmdvIGNvbGxlY3Rpb24uXHJcblx0Ly9cclxuXHQvLyBQci4gZGVmYXVsdCBkb2NzIGFyZSByZW1vdmVkIGZyb20gdGhlIGNvbGxlY3Rpb24gYWZ0ZXIgc2VuZCBoYXZlXHJcblx0Ly8gY29tcGxldGVkLiBTZXR0aW5nIGBvcHRpb25zLmtlZXBEb2NzYCB3aWxsIHVwZGF0ZSBhbmQga2VlcCB0aGVcclxuXHQvLyBkb2MgZWcuIGlmIG5lZWRlZCBmb3IgaGlzdG9yaWNhbCByZWFzb25zLlxyXG5cdC8vXHJcblx0Ly8gQWZ0ZXIgdGhlIHNlbmQgaGF2ZSBjb21wbGV0ZWQgYSBcInNlbmRcIiBldmVudCB3aWxsIGJlIGVtaXR0ZWQgd2l0aCBhXHJcblx0Ly8gc3RhdHVzIG9iamVjdCBjb250YWluaW5nIGRvYyBpZCBhbmQgdGhlIHNlbmQgcmVzdWx0IG9iamVjdC5cclxuXHQvL1xyXG5cdHZhciBpc1NlbmRpbmdEb2MgPSBmYWxzZTtcclxuXHJcblx0aWYgKG9wdGlvbnMuc2VuZEludGVydmFsICE9PSBudWxsKSB7XHJcblxyXG5cdFx0Ly8gVGhpcyB3aWxsIHJlcXVpcmUgaW5kZXggc2luY2Ugd2Ugc29ydCBkb2NzIGJ5IGNyZWF0ZWRBdFxyXG5cdFx0SW5zdGFuY2VSZWNvcmRRdWV1ZS5jb2xsZWN0aW9uLl9lbnN1cmVJbmRleCh7XHJcblx0XHRcdGNyZWF0ZWRBdDogMVxyXG5cdFx0fSk7XHJcblx0XHRJbnN0YW5jZVJlY29yZFF1ZXVlLmNvbGxlY3Rpb24uX2Vuc3VyZUluZGV4KHtcclxuXHRcdFx0c2VudDogMVxyXG5cdFx0fSk7XHJcblx0XHRJbnN0YW5jZVJlY29yZFF1ZXVlLmNvbGxlY3Rpb24uX2Vuc3VyZUluZGV4KHtcclxuXHRcdFx0c2VuZGluZzogMVxyXG5cdFx0fSk7XHJcblxyXG5cclxuXHRcdHZhciBzZW5kRG9jID0gZnVuY3Rpb24gKGRvYykge1xyXG5cdFx0XHQvLyBSZXNlcnZlIGRvY1xyXG5cdFx0XHR2YXIgbm93ID0gK25ldyBEYXRlKCk7XHJcblx0XHRcdHZhciB0aW1lb3V0QXQgPSBub3cgKyBvcHRpb25zLnNlbmRUaW1lb3V0O1xyXG5cdFx0XHR2YXIgcmVzZXJ2ZWQgPSBJbnN0YW5jZVJlY29yZFF1ZXVlLmNvbGxlY3Rpb24udXBkYXRlKHtcclxuXHRcdFx0XHRfaWQ6IGRvYy5faWQsXHJcblx0XHRcdFx0c2VudDogZmFsc2UsIC8vIHh4eDogbmVlZCB0byBtYWtlIHN1cmUgdGhpcyBpcyBzZXQgb24gY3JlYXRlXHJcblx0XHRcdFx0c2VuZGluZzoge1xyXG5cdFx0XHRcdFx0JGx0OiBub3dcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sIHtcclxuXHRcdFx0XHQkc2V0OiB7XHJcblx0XHRcdFx0XHRzZW5kaW5nOiB0aW1lb3V0QXQsXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdC8vIE1ha2Ugc3VyZSB3ZSBvbmx5IGhhbmRsZSBkb2NzIHJlc2VydmVkIGJ5IHRoaXNcclxuXHRcdFx0Ly8gaW5zdGFuY2VcclxuXHRcdFx0aWYgKHJlc2VydmVkKSB7XHJcblxyXG5cdFx0XHRcdC8vIFNlbmRcclxuXHRcdFx0XHR2YXIgcmVzdWx0ID0gSW5zdGFuY2VSZWNvcmRRdWV1ZS5zZXJ2ZXJTZW5kKGRvYyk7XHJcblxyXG5cdFx0XHRcdGlmICghb3B0aW9ucy5rZWVwRG9jcykge1xyXG5cdFx0XHRcdFx0Ly8gUHIuIERlZmF1bHQgd2Ugd2lsbCByZW1vdmUgZG9jc1xyXG5cdFx0XHRcdFx0SW5zdGFuY2VSZWNvcmRRdWV1ZS5jb2xsZWN0aW9uLnJlbW92ZSh7XHJcblx0XHRcdFx0XHRcdF9pZDogZG9jLl9pZFxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHJcblx0XHRcdFx0XHQvLyBVcGRhdGVcclxuXHRcdFx0XHRcdEluc3RhbmNlUmVjb3JkUXVldWUuY29sbGVjdGlvbi51cGRhdGUoe1xyXG5cdFx0XHRcdFx0XHRfaWQ6IGRvYy5faWRcclxuXHRcdFx0XHRcdH0sIHtcclxuXHRcdFx0XHRcdFx0JHNldDoge1xyXG5cdFx0XHRcdFx0XHRcdC8vIE1hcmsgYXMgc2VudFxyXG5cdFx0XHRcdFx0XHRcdHNlbnQ6IHRydWUsXHJcblx0XHRcdFx0XHRcdFx0Ly8gU2V0IHRoZSBzZW50IGRhdGVcclxuXHRcdFx0XHRcdFx0XHRzZW50QXQ6IG5ldyBEYXRlKCksXHJcblx0XHRcdFx0XHRcdFx0Ly8gTm90IGJlaW5nIHNlbnQgYW55bW9yZVxyXG5cdFx0XHRcdFx0XHRcdHNlbmRpbmc6IDBcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Ly8gLy8gRW1pdCB0aGUgc2VuZFxyXG5cdFx0XHRcdC8vIHNlbGYuZW1pdCgnc2VuZCcsIHtcclxuXHRcdFx0XHQvLyBcdGRvYzogZG9jLl9pZCxcclxuXHRcdFx0XHQvLyBcdHJlc3VsdDogcmVzdWx0XHJcblx0XHRcdFx0Ly8gfSk7XHJcblxyXG5cdFx0XHR9IC8vIEVsc2UgY291bGQgbm90IHJlc2VydmVcclxuXHRcdH07IC8vIEVPIHNlbmREb2NcclxuXHJcblx0XHRzZW5kV29ya2VyKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHRcdGlmIChpc1NlbmRpbmdEb2MpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0Ly8gU2V0IHNlbmQgZmVuY2VcclxuXHRcdFx0aXNTZW5kaW5nRG9jID0gdHJ1ZTtcclxuXHJcblx0XHRcdHZhciBiYXRjaFNpemUgPSBvcHRpb25zLnNlbmRCYXRjaFNpemUgfHwgMTtcclxuXHJcblx0XHRcdHZhciBub3cgPSArbmV3IERhdGUoKTtcclxuXHJcblx0XHRcdC8vIEZpbmQgZG9jcyB0aGF0IGFyZSBub3QgYmVpbmcgb3IgYWxyZWFkeSBzZW50XHJcblx0XHRcdHZhciBwZW5kaW5nRG9jcyA9IEluc3RhbmNlUmVjb3JkUXVldWUuY29sbGVjdGlvbi5maW5kKHtcclxuXHRcdFx0XHQkYW5kOiBbXHJcblx0XHRcdFx0XHQvLyBNZXNzYWdlIGlzIG5vdCBzZW50XHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdHNlbnQ6IGZhbHNlXHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0Ly8gQW5kIG5vdCBiZWluZyBzZW50IGJ5IG90aGVyIGluc3RhbmNlc1xyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRzZW5kaW5nOiB7XHJcblx0XHRcdFx0XHRcdFx0JGx0OiBub3dcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdC8vIEFuZCBubyBlcnJvclxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRlcnJNc2c6IHtcclxuXHRcdFx0XHRcdFx0XHQkZXhpc3RzOiBmYWxzZVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XVxyXG5cdFx0XHR9LCB7XHJcblx0XHRcdFx0Ly8gU29ydCBieSBjcmVhdGVkIGRhdGVcclxuXHRcdFx0XHRzb3J0OiB7XHJcblx0XHRcdFx0XHRjcmVhdGVkQXQ6IDFcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdGxpbWl0OiBiYXRjaFNpemVcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRwZW5kaW5nRG9jcy5mb3JFYWNoKGZ1bmN0aW9uIChkb2MpIHtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0c2VuZERvYyhkb2MpO1xyXG5cdFx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKGVycm9yLnN0YWNrKTtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdJbnN0YW5jZVJlY29yZFF1ZXVlOiBDb3VsZCBub3Qgc2VuZCBkb2MgaWQ6IFwiJyArIGRvYy5faWQgKyAnXCIsIEVycm9yOiAnICsgZXJyb3IubWVzc2FnZSk7XHJcblx0XHRcdFx0XHRJbnN0YW5jZVJlY29yZFF1ZXVlLmNvbGxlY3Rpb24udXBkYXRlKHtcclxuXHRcdFx0XHRcdFx0X2lkOiBkb2MuX2lkXHJcblx0XHRcdFx0XHR9LCB7XHJcblx0XHRcdFx0XHRcdCRzZXQ6IHtcclxuXHRcdFx0XHRcdFx0XHQvLyBlcnJvciBtZXNzYWdlXHJcblx0XHRcdFx0XHRcdFx0ZXJyTXNnOiBlcnJvci5tZXNzYWdlXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7IC8vIEVPIGZvckVhY2hcclxuXHJcblx0XHRcdC8vIFJlbW92ZSB0aGUgc2VuZCBmZW5jZVxyXG5cdFx0XHRpc1NlbmRpbmdEb2MgPSBmYWxzZTtcclxuXHRcdH0sIG9wdGlvbnMuc2VuZEludGVydmFsIHx8IDE1MDAwKTsgLy8gRGVmYXVsdCBldmVyeSAxNXRoIHNlY1xyXG5cclxuXHR9IGVsc2Uge1xyXG5cdFx0aWYgKEluc3RhbmNlUmVjb3JkUXVldWUuZGVidWcpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coJ0luc3RhbmNlUmVjb3JkUXVldWU6IFNlbmQgc2VydmVyIGlzIGRpc2FibGVkJyk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxufTsiLCJNZXRlb3Iuc3RhcnR1cCAtPlxyXG5cdGlmIE1ldGVvci5zZXR0aW5ncy5jcm9uPy5pbnN0YW5jZXJlY29yZHF1ZXVlX2ludGVydmFsXHJcblx0XHRJbnN0YW5jZVJlY29yZFF1ZXVlLkNvbmZpZ3VyZVxyXG5cdFx0XHRzZW5kSW50ZXJ2YWw6IE1ldGVvci5zZXR0aW5ncy5jcm9uLmluc3RhbmNlcmVjb3JkcXVldWVfaW50ZXJ2YWxcclxuXHRcdFx0c2VuZEJhdGNoU2l6ZTogMTBcclxuXHRcdFx0a2VlcERvY3M6IHRydWVcclxuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHZhciByZWY7XG4gIGlmICgocmVmID0gTWV0ZW9yLnNldHRpbmdzLmNyb24pICE9IG51bGwgPyByZWYuaW5zdGFuY2VyZWNvcmRxdWV1ZV9pbnRlcnZhbCA6IHZvaWQgMCkge1xuICAgIHJldHVybiBJbnN0YW5jZVJlY29yZFF1ZXVlLkNvbmZpZ3VyZSh7XG4gICAgICBzZW5kSW50ZXJ2YWw6IE1ldGVvci5zZXR0aW5ncy5jcm9uLmluc3RhbmNlcmVjb3JkcXVldWVfaW50ZXJ2YWwsXG4gICAgICBzZW5kQmF0Y2hTaXplOiAxMCxcbiAgICAgIGtlZXBEb2NzOiB0cnVlXG4gICAgfSk7XG4gIH1cbn0pO1xuIiwiaW1wb3J0IHsgY2hlY2tOcG1WZXJzaW9ucyB9IGZyb20gJ21ldGVvci90bWVhc2RheTpjaGVjay1ucG0tdmVyc2lvbnMnO1xyXG5jaGVja05wbVZlcnNpb25zKHtcclxuXHRcImV2YWxcIjogXCJeMC4xLjJcIlxyXG59LCAnc3RlZWRvczppbnN0YW5jZS1yZWNvcmQtcXVldWUnKTtcclxuIl19
