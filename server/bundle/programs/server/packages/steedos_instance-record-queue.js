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

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/steedos_instance-record-queue/lib/common/main.js                                                         //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
InstanceRecordQueue = new EventState();
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"docs.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/steedos_instance-record-queue/lib/common/docs.js                                                         //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"server":{"api.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/steedos_instance-record-queue/lib/server/api.js                                                          //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
const objectql = require('@steedos/objectql');

var runQuoted = function (objectName, recordId) {
  objectql.runQuotedByObjectFieldFormulas(objectName, recordId);
  objectql.runQuotedByObjectFieldSummaries(objectName, recordId);
};

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
  } // Universal send function


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
        } // // Emit the send
        // InstanceRecordQueue.emit('send', {
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

InstanceRecordQueue.syncInsFields = ['name', 'submitter_name', 'applicant_name', 'applicant_organization_name', 'applicant_organization_fullname', 'state', 'current_step_name', 'flow_name', 'category_name', 'submit_date', 'finish_date', 'final_decision', 'applicant_organization', 'applicant_company'];

InstanceRecordQueue.syncValues = function (field_map_back, values, ins, objectInfo, field_map_back_script, record) {
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
    _.extend(obj, InstanceRecordQueue.evalFieldMapBackScript(field_map_back_script, ins));
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

InstanceRecordQueue.evalFieldMapBackScript = function (field_map_back_script, ins) {
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

InstanceRecordQueue.syncRelatedObjectsValue = function (mainRecordId, relatedObjects, relatedObjectsValue, spaceId, ins) {
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
        var syncValues = InstanceRecordQueue.syncValues(ow.field_map_back, values, ins, objectInfo, ow.field_map_back_script, record);
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
        InstanceRecordQueue.syncRelatedObjectsValue(record._id, relatedObjects, relatedObjectsValue, spaceId, ins); // 以最终申请单附件为准，旧的record中附件删除

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

        InstanceRecordQueue.syncAttach(sync_attachment, insId, record.space, record._id, objectName); // 执行公式

        runQuoted(objectName, record._id);
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
        var syncValues = InstanceRecordQueue.syncValues(ow.field_map_back, values, ins, objectInfo, ow.field_map_back_script);
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
          InstanceRecordQueue.syncRelatedObjectsValue(newRecordId, relatedObjects, relatedObjectsValue, spaceId, ins); // workflow里发起审批后，同步时也可以修改相关表的字段值 #1183

          var record = objectCollection.findOne(newRecordId);
          InstanceRecordQueue.syncValues(ow.field_map_back, values, ins, objectInfo, ow.field_map_back_script, record);
        } // 附件同步


        InstanceRecordQueue.syncAttach(sync_attachment, insId, spaceId, newRecordId, objectName); // 执行公式

        runQuoted(objectName, newRecordId);
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

  if (doc._id) {
    InstanceRecordQueue.collection.update(doc._id, {
      $set: {
        'info.sync_date': new Date()
      }
    });
  }
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"server":{"startup.coffee":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/steedos_instance-record-queue/server/startup.coffee                                                      //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"checkNpm.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/steedos_instance-record-queue/server/checkNpm.js                                                         //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczppbnN0YW5jZS1yZWNvcmQtcXVldWUvbGliL2NvbW1vbi9tYWluLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmluc3RhbmNlLXJlY29yZC1xdWV1ZS9saWIvY29tbW9uL2RvY3MuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6aW5zdGFuY2UtcmVjb3JkLXF1ZXVlL2xpYi9zZXJ2ZXIvYXBpLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2luc3RhbmNlLXJlY29yZC1xdWV1ZS9zZXJ2ZXIvc3RhcnR1cC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9zdGFydHVwLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczppbnN0YW5jZS1yZWNvcmQtcXVldWUvc2VydmVyL2NoZWNrTnBtLmpzIl0sIm5hbWVzIjpbIkluc3RhbmNlUmVjb3JkUXVldWUiLCJFdmVudFN0YXRlIiwiY29sbGVjdGlvbiIsImRiIiwiaW5zdGFuY2VfcmVjb3JkX3F1ZXVlIiwiTW9uZ28iLCJDb2xsZWN0aW9uIiwiX3ZhbGlkYXRlRG9jdW1lbnQiLCJkb2MiLCJjaGVjayIsImluZm8iLCJPYmplY3QiLCJzZW50IiwiTWF0Y2giLCJPcHRpb25hbCIsIkJvb2xlYW4iLCJzZW5kaW5nIiwiSW50ZWdlciIsImNyZWF0ZWRBdCIsIkRhdGUiLCJjcmVhdGVkQnkiLCJPbmVPZiIsIlN0cmluZyIsInNlbmQiLCJvcHRpb25zIiwiY3VycmVudFVzZXIiLCJNZXRlb3IiLCJpc0NsaWVudCIsInVzZXJJZCIsImlzU2VydmVyIiwiXyIsImV4dGVuZCIsInRlc3QiLCJwaWNrIiwiaW5zZXJ0Iiwib2JqZWN0cWwiLCJyZXF1aXJlIiwicnVuUXVvdGVkIiwib2JqZWN0TmFtZSIsInJlY29yZElkIiwicnVuUXVvdGVkQnlPYmplY3RGaWVsZEZvcm11bGFzIiwicnVuUXVvdGVkQnlPYmplY3RGaWVsZFN1bW1hcmllcyIsIl9ldmFsIiwiaXNDb25maWd1cmVkIiwic2VuZFdvcmtlciIsInRhc2siLCJpbnRlcnZhbCIsImRlYnVnIiwiY29uc29sZSIsImxvZyIsInNldEludGVydmFsIiwiZXJyb3IiLCJtZXNzYWdlIiwiQ29uZmlndXJlIiwic2VsZiIsInNlbmRUaW1lb3V0IiwiRXJyb3IiLCJfcXVlcnlTZW5kIiwic2VuZERvYyIsIl9pZCIsInNlcnZlclNlbmQiLCJpc1NlbmRpbmdEb2MiLCJzZW5kSW50ZXJ2YWwiLCJfZW5zdXJlSW5kZXgiLCJub3ciLCJ0aW1lb3V0QXQiLCJyZXNlcnZlZCIsInVwZGF0ZSIsIiRsdCIsIiRzZXQiLCJyZXN1bHQiLCJrZWVwRG9jcyIsInJlbW92ZSIsInNlbnRBdCIsImJhdGNoU2l6ZSIsInNlbmRCYXRjaFNpemUiLCJwZW5kaW5nRG9jcyIsImZpbmQiLCIkYW5kIiwiZXJyTXNnIiwiJGV4aXN0cyIsInNvcnQiLCJsaW1pdCIsImZvckVhY2giLCJzdGFjayIsInN5bmNBdHRhY2giLCJzeW5jX2F0dGFjaG1lbnQiLCJpbnNJZCIsInNwYWNlSWQiLCJuZXdSZWNvcmRJZCIsImNmcyIsImluc3RhbmNlcyIsImYiLCJoYXNTdG9yZWQiLCJuZXdGaWxlIiwiRlMiLCJGaWxlIiwiY21zRmlsZUlkIiwiQ3JlYXRvciIsImdldENvbGxlY3Rpb24iLCJfbWFrZU5ld0lEIiwiYXR0YWNoRGF0YSIsImNyZWF0ZVJlYWRTdHJlYW0iLCJ0eXBlIiwib3JpZ2luYWwiLCJlcnIiLCJyZWFzb24iLCJuYW1lIiwic2l6ZSIsIm1ldGFkYXRhIiwib3duZXIiLCJvd25lcl9uYW1lIiwic3BhY2UiLCJyZWNvcmRfaWQiLCJvYmplY3RfbmFtZSIsInBhcmVudCIsImZpbGVzIiwid3JhcEFzeW5jIiwiY2IiLCJvbmNlIiwic3RvcmVOYW1lIiwibyIsImlkcyIsImV4dGVudGlvbiIsImV4dGVuc2lvbiIsInZlcnNpb25zIiwiY3JlYXRlZF9ieSIsIm1vZGlmaWVkX2J5IiwicGFyZW50cyIsImluY2x1ZGVzIiwicHVzaCIsImN1cnJlbnQiLCIkYWRkVG9TZXQiLCJzeW5jSW5zRmllbGRzIiwic3luY1ZhbHVlcyIsImZpZWxkX21hcF9iYWNrIiwidmFsdWVzIiwiaW5zIiwib2JqZWN0SW5mbyIsImZpZWxkX21hcF9iYWNrX3NjcmlwdCIsInJlY29yZCIsIm9iaiIsInRhYmxlRmllbGRDb2RlcyIsInRhYmxlRmllbGRNYXAiLCJ0YWJsZVRvUmVsYXRlZE1hcCIsImZvcm0iLCJmaW5kT25lIiwiZm9ybUZpZWxkcyIsImZvcm1fdmVyc2lvbiIsImZpZWxkcyIsImZvcm1WZXJzaW9uIiwiaGlzdG9yeXMiLCJoIiwib2JqZWN0RmllbGRzIiwib2JqZWN0RmllbGRLZXlzIiwia2V5cyIsInJlbGF0ZWRPYmplY3RzIiwiZ2V0UmVsYXRlZE9iamVjdHMiLCJyZWxhdGVkT2JqZWN0c0tleXMiLCJwbHVjayIsImZvcm1UYWJsZUZpZWxkcyIsImZpbHRlciIsImZvcm1GaWVsZCIsImZvcm1UYWJsZUZpZWxkc0NvZGUiLCJnZXRSZWxhdGVkT2JqZWN0RmllbGQiLCJrZXkiLCJyZWxhdGVkT2JqZWN0c0tleSIsInN0YXJ0c1dpdGgiLCJnZXRGb3JtVGFibGVGaWVsZCIsImZvcm1UYWJsZUZpZWxkQ29kZSIsImdldEZvcm1GaWVsZCIsIl9mb3JtRmllbGRzIiwiX2ZpZWxkQ29kZSIsImVhY2giLCJmZiIsImNvZGUiLCJmbSIsInJlbGF0ZWRPYmplY3RGaWVsZCIsIm9iamVjdF9maWVsZCIsImZvcm1UYWJsZUZpZWxkIiwid29ya2Zsb3dfZmllbGQiLCJvVGFibGVDb2RlIiwic3BsaXQiLCJvVGFibGVGaWVsZENvZGUiLCJ0YWJsZVRvUmVsYXRlZE1hcEtleSIsIndUYWJsZUNvZGUiLCJpbmRleE9mIiwiaGFzT3duUHJvcGVydHkiLCJpc0FycmF5IiwiSlNPTiIsInN0cmluZ2lmeSIsIndvcmtmbG93X3RhYmxlX2ZpZWxkX2NvZGUiLCJvYmplY3RfdGFibGVfZmllbGRfY29kZSIsIndGaWVsZCIsIm9GaWVsZCIsInJlZmVyZW5jZV90byIsImlzRW1wdHkiLCJtdWx0aXBsZSIsImlzX211bHRpc2VsZWN0IiwiY29tcGFjdCIsImlkIiwiaXNTdHJpbmciLCJvQ29sbGVjdGlvbiIsInJlZmVyT2JqZWN0IiwiZ2V0T2JqZWN0IiwicmVmZXJEYXRhIiwibmFtZUZpZWxkS2V5IiwiTkFNRV9GSUVMRF9LRVkiLCJzZWxlY3RvciIsInRtcF9maWVsZF92YWx1ZSIsInRlbU9iakZpZWxkcyIsImxlbmd0aCIsIm9iakZpZWxkIiwicmVmZXJPYmpGaWVsZCIsInJlZmVyU2V0T2JqIiwiaW5zRmllbGQiLCJ1bmlxIiwidGZjIiwiYyIsInBhcnNlIiwidHIiLCJuZXdUciIsInYiLCJrIiwidGZtIiwib1RkQ29kZSIsInJlbGF0ZWRPYmpzIiwiZ2V0UmVsYXRlZEZpZWxkVmFsdWUiLCJ2YWx1ZUtleSIsInJlZHVjZSIsIngiLCJtYXAiLCJ0YWJsZUNvZGUiLCJfRlJPTV9UQUJMRV9DT0RFIiwid2FybiIsInJlbGF0ZWRPYmplY3ROYW1lIiwicmVsYXRlZE9iamVjdFZhbHVlcyIsInJlbGF0ZWRPYmplY3QiLCJ0YWJsZVZhbHVlSXRlbSIsInJlbGF0ZWRPYmplY3RWYWx1ZSIsImZpZWxkS2V5IiwicmVsYXRlZE9iamVjdEZpZWxkVmFsdWUiLCJmb3JtRmllbGRLZXkiLCJfY29kZSIsImV2YWxGaWVsZE1hcEJhY2tTY3JpcHQiLCJmaWx0ZXJPYmoiLCJtYWluT2JqZWN0VmFsdWUiLCJyZWxhdGVkT2JqZWN0c1ZhbHVlIiwic2NyaXB0IiwiZnVuYyIsImlzT2JqZWN0Iiwic3luY1JlbGF0ZWRPYmplY3RzVmFsdWUiLCJtYWluUmVjb3JkSWQiLCJvYmplY3RDb2xsZWN0aW9uIiwidGFibGVNYXAiLCJ0YWJsZV9pZCIsIl90YWJsZSIsInRhYmxlX2NvZGUiLCJvbGRSZWxhdGVkUmVjb3JkIiwiZm9yZWlnbl9rZXkiLCJhcHBsaWNhbnQiLCJpbnN0YW5jZV9zdGF0ZSIsInN0YXRlIiwiZmluYWxfZGVjaXNpb24iLCJ2YWxpZGF0ZSIsInRhYmxlSWRzIiwiJG5pbiIsImluc3RhbmNlX2lkIiwicmVjb3JkcyIsImZsb3ciLCJ0cmFjZXMiLCJvdyIsImZsb3dfaWQiLCIkaW4iLCJzZXRPYmoiLCJyZW1vdmVPbGRGaWxlcyIsIm5ld09iaiIsInIiLCIkcHVzaCIsInJlY29yZF9pZHMiLCIkcHVsbCIsInN0YXJ0dXAiLCJyZWYiLCJzZXR0aW5ncyIsImNyb24iLCJpbnN0YW5jZXJlY29yZHF1ZXVlX2ludGVydmFsIiwiY2hlY2tOcG1WZXJzaW9ucyIsIm1vZHVsZSIsImxpbmsiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQUEsbUJBQW1CLEdBQUcsSUFBSUMsVUFBSixFQUF0QixDOzs7Ozs7Ozs7OztBQ0FBRCxtQkFBbUIsQ0FBQ0UsVUFBcEIsR0FBaUNDLEVBQUUsQ0FBQ0MscUJBQUgsR0FBMkIsSUFBSUMsS0FBSyxDQUFDQyxVQUFWLENBQXFCLHVCQUFyQixDQUE1RDs7QUFFQSxJQUFJQyxpQkFBaUIsR0FBRyxVQUFTQyxHQUFULEVBQWM7QUFFckNDLE9BQUssQ0FBQ0QsR0FBRCxFQUFNO0FBQ1ZFLFFBQUksRUFBRUMsTUFESTtBQUVWQyxRQUFJLEVBQUVDLEtBQUssQ0FBQ0MsUUFBTixDQUFlQyxPQUFmLENBRkk7QUFHVkMsV0FBTyxFQUFFSCxLQUFLLENBQUNDLFFBQU4sQ0FBZUQsS0FBSyxDQUFDSSxPQUFyQixDQUhDO0FBSVZDLGFBQVMsRUFBRUMsSUFKRDtBQUtWQyxhQUFTLEVBQUVQLEtBQUssQ0FBQ1EsS0FBTixDQUFZQyxNQUFaLEVBQW9CLElBQXBCO0FBTEQsR0FBTixDQUFMO0FBUUEsQ0FWRDs7QUFZQXRCLG1CQUFtQixDQUFDdUIsSUFBcEIsR0FBMkIsVUFBU0MsT0FBVCxFQUFrQjtBQUM1QyxNQUFJQyxXQUFXLEdBQUdDLE1BQU0sQ0FBQ0MsUUFBUCxJQUFtQkQsTUFBTSxDQUFDRSxNQUExQixJQUFvQ0YsTUFBTSxDQUFDRSxNQUFQLEVB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LE9BQU9pUSxRQUFQLENBQWdCQyxJQUFoQixDQUFxQkMsNEJBQW5DO0FBQ0FsTixxQkFBZSxFQURmO0FBRUFKLGdCQUFVO0FBRlYsS0FERCxDQ0NFO0FBS0Q7QURSSCxHOzs7Ozs7Ozs7OztBRUFBLElBQUl1TixnQkFBSjtBQUFxQkMsTUFBTSxDQUFDQyxJQUFQLENBQVksb0NBQVosRUFBaUQ7QUFBQ0Ysa0JBQWdCLENBQUNoRSxDQUFELEVBQUc7QUFBQ2dFLG9CQUFnQixHQUFDaEUsQ0FBakI7QUFBbUI7O0FBQXhDLENBQWpELEVBQTJGLENBQTNGO0FBQ3JCZ0UsZ0JBQWdCLENBQUM7QUFDaEIsVUFBUTtBQURRLENBQUQsRUFFYiwrQkFGYSxDQUFoQixDIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX2luc3RhbmNlLXJlY29yZC1xdWV1ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIkluc3RhbmNlUmVjb3JkUXVldWUgPSBuZXcgRXZlbnRTdGF0ZSgpOyIsIkluc3RhbmNlUmVjb3JkUXVldWUuY29sbGVjdGlvbiA9IGRiLmluc3RhbmNlX3JlY29yZF9xdWV1ZSA9IG5ldyBNb25nby5Db2xsZWN0aW9uKCdpbnN0YW5jZV9yZWNvcmRfcXVldWUnKTtcclxuXHJcbnZhciBfdmFsaWRhdGVEb2N1bWVudCA9IGZ1bmN0aW9uKGRvYykge1xyXG5cclxuXHRjaGVjayhkb2MsIHtcclxuXHRcdGluZm86IE9iamVjdCxcclxuXHRcdHNlbnQ6IE1hdGNoLk9wdGlvbmFsKEJvb2xlYW4pLFxyXG5cdFx0c2VuZGluZzogTWF0Y2guT3B0aW9uYWwoTWF0Y2guSW50ZWdlciksXHJcblx0XHRjcmVhdGVkQXQ6IERhdGUsXHJcblx0XHRjcmVhdGVkQnk6IE1hdGNoLk9uZU9mKFN0cmluZywgbnVsbClcclxuXHR9KTtcclxuXHJcbn07XHJcblxyXG5JbnN0YW5jZVJlY29yZFF1ZXVlLnNlbmQgPSBmdW5jdGlvbihvcHRpb25zKSB7XHJcblx0dmFyIGN1cnJlbnRVc2VyID0gTWV0ZW9yLmlzQ2xpZW50ICYmIE1ldGVvci51c2VySWQgJiYgTWV0ZW9yLnVzZXJJZCgpIHx8IE1ldGVvci5pc1NlcnZlciAmJiAob3B0aW9ucy5jcmVhdGVkQnkgfHwgJzxTRVJWRVI+JykgfHwgbnVsbFxyXG5cdHZhciBkb2MgPSBfLmV4dGVuZCh7XHJcblx0XHRjcmVhdGVkQXQ6IG5ldyBEYXRlKCksXHJcblx0XHRjcmVhdGVkQnk6IGN1cnJlbnRVc2VyXHJcblx0fSk7XHJcblxyXG5cdGlmIChNYXRjaC50ZXN0KG9wdGlvbnMsIE9iamVjdCkpIHtcclxuXHRcdGRvYy5pbmZvID0gXy5waWNrKG9wdGlvbnMsICdpbnN0YW5jZV9pZCcsICdyZWNvcmRzJywgJ3N5bmNfZGF0ZScsICdpbnN0YW5jZV9maW5pc2hfZGF0ZScsICdzdGVwX25hbWUnKTtcclxuXHR9XHJcblxyXG5cdGRvYy5zZW50ID0gZmFsc2U7XHJcblx0ZG9jLnNlbmRpbmcgPSAwO1xyXG5cclxuXHRfdmFsaWRhdGVEb2N1bWVudChkb2MpO1xyXG5cclxuXHRyZXR1cm4gSW5zdGFuY2VSZWNvcmRRdWV1ZS5jb2xsZWN0aW9uLmluc2VydChkb2MpO1xyXG59OyIsImNvbnN0IG9iamVjdHFsID0gcmVxdWlyZSgnQHN0ZWVkb3Mvb2JqZWN0cWwnKTtcclxudmFyIHJ1blF1b3RlZCA9IGZ1bmN0aW9uIChvYmplY3ROYW1lLCByZWNvcmRJZCkge1xyXG5cdG9iamVjdHFsLnJ1blF1b3RlZEJ5T2JqZWN0RmllbGRGb3JtdWxhcyhvYmplY3ROYW1lLCByZWNvcmRJZCk7XHJcblx0b2JqZWN0cWwucnVuUXVvdGVkQnlPYmplY3RGaWVsZFN1bW1hcmllcyhvYmplY3ROYW1lLCByZWNvcmRJZCk7XHJcbn1cclxuXHJcbnZhciBfZXZhbCA9IHJlcXVpcmUoJ2V2YWwnKTtcclxudmFyIGlzQ29uZmlndXJlZCA9IGZhbHNlO1xyXG52YXIgc2VuZFdvcmtlciA9IGZ1bmN0aW9uICh0YXNrLCBpbnRlcnZhbCkge1xyXG5cclxuXHRpZiAoSW5zdGFuY2VSZWNvcmRRdWV1ZS5kZWJ1Zykge1xyXG5cdFx0Y29uc29sZS5sb2coJ0luc3RhbmNlUmVjb3JkUXVldWU6IFNlbmQgd29ya2VyIHN0YXJ0ZWQsIHVzaW5nIGludGVydmFsOiAnICsgaW50ZXJ2YWwpO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIE1ldGVvci5zZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHR0YXNrKCk7XHJcblx0XHR9IGNhdGNoIChlcnJvcikge1xyXG5cdFx0XHRjb25zb2xlLmxvZygnSW5zdGFuY2VSZWNvcmRRdWV1ZTogRXJyb3Igd2hpbGUgc2VuZGluZzogJyArIGVycm9yLm1lc3NhZ2UpO1xyXG5cdFx0fVxyXG5cdH0sIGludGVydmFsKTtcclxufTtcclxuXHJcbi8qXHJcblx0b3B0aW9uczoge1xyXG5cdFx0Ly8gQ29udHJvbHMgdGhlIHNlbmRpbmcgaW50ZXJ2YWxcclxuXHRcdHNlbmRJbnRlcnZhbDogTWF0Y2guT3B0aW9uYWwoTnVtYmVyKSxcclxuXHRcdC8vIENvbnRyb2xzIHRoZSBzZW5kaW5nIGJhdGNoIHNpemUgcGVyIGludGVydmFsXHJcblx0XHRzZW5kQmF0Y2hTaXplOiBNYXRjaC5PcHRpb25hbChOdW1iZXIpLFxyXG5cdFx0Ly8gQWxsb3cgb3B0aW9uYWwga2VlcGluZyBub3RpZmljYXRpb25zIGluIGNvbGxlY3Rpb25cclxuXHRcdGtlZXBEb2NzOiBNYXRjaC5PcHRpb25hbChCb29sZWFuKVxyXG5cdH1cclxuKi9cclxuSW5zdGFuY2VSZWNvcmRRdWV1ZS5Db25maWd1cmUgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG5cdHZhciBzZWxmID0gdGhpcztcclxuXHRvcHRpb25zID0gXy5leHRlbmQoe1xyXG5cdFx0c2VuZFRpbWVvdXQ6IDYwMDAwLCAvLyBUaW1lb3V0IHBlcmlvZFxyXG5cdH0sIG9wdGlvbnMpO1xyXG5cclxuXHQvLyBCbG9jayBtdWx0aXBsZSBjYWxsc1xyXG5cdGlmIChpc0NvbmZpZ3VyZWQpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcignSW5zdGFuY2VSZWNvcmRRdWV1ZS5Db25maWd1cmUgc2hvdWxkIG5vdCBiZSBjYWxsZWQgbW9yZSB0aGFuIG9uY2UhJyk7XHJcblx0fVxyXG5cclxuXHRpc0NvbmZpZ3VyZWQgPSB0cnVlO1xyXG5cclxuXHQvLyBBZGQgZGVidWcgaW5mb1xyXG5cdGlmIChJbnN0YW5jZVJlY29yZFF1ZXVlLmRlYnVnKSB7XHJcblx0XHRjb25zb2xlLmxvZygnSW5zdGFuY2VSZWNvcmRRdWV1ZS5Db25maWd1cmUnLCBvcHRpb25zKTtcclxuXHR9XHJcblxyXG5cclxuXHJcblx0Ly8gVW5pdmVyc2FsIHNlbmQgZnVuY3Rpb25cclxuXHR2YXIgX3F1ZXJ5U2VuZCA9IGZ1bmN0aW9uIChkb2MpIHtcclxuXHJcblx0XHRpZiAoSW5zdGFuY2VSZWNvcmRRdWV1ZS5zZW5kRG9jKSB7XHJcblx0XHRcdEluc3RhbmNlUmVjb3JkUXVldWUuc2VuZERvYyhkb2MpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGRvYzogW2RvYy5faWRdXHJcblx0XHR9O1xyXG5cdH07XHJcblxyXG5cdHNlbGYuc2VydmVyU2VuZCA9IGZ1bmN0aW9uIChkb2MpIHtcclxuXHRcdGRvYyA9IGRvYyB8fCB7fTtcclxuXHRcdHJldHVybiBfcXVlcnlTZW5kKGRvYyk7XHJcblx0fTtcclxuXHJcblxyXG5cdC8vIFRoaXMgaW50ZXJ2YWwgd2lsbCBhbGxvdyBvbmx5IG9uZSBkb2MgdG8gYmUgc2VudCBhdCBhIHRpbWUsIGl0XHJcblx0Ly8gd2lsbCBjaGVjayBmb3IgbmV3IGRvY3MgYXQgZXZlcnkgYG9wdGlvbnMuc2VuZEludGVydmFsYFxyXG5cdC8vIChkZWZhdWx0IGludGVydmFsIGlzIDE1MDAwIG1zKVxyXG5cdC8vXHJcblx0Ly8gSXQgbG9va3MgaW4gZG9jcyBjb2xsZWN0aW9uIHRvIHNlZSBpZiB0aGVyZXMgYW55IHBlbmRpbmdcclxuXHQvLyBkb2NzLCBpZiBzbyBpdCB3aWxsIHRyeSB0byByZXNlcnZlIHRoZSBwZW5kaW5nIGRvYy5cclxuXHQvLyBJZiBzdWNjZXNzZnVsbHkgcmVzZXJ2ZWQgdGhlIHNlbmQgaXMgc3RhcnRlZC5cclxuXHQvL1xyXG5cdC8vIElmIGRvYy5xdWVyeSBpcyB0eXBlIHN0cmluZywgaXQncyBhc3N1bWVkIHRvIGJlIGEganNvbiBzdHJpbmdcclxuXHQvLyB2ZXJzaW9uIG9mIHRoZSBxdWVyeSBzZWxlY3Rvci4gTWFraW5nIGl0IGFibGUgdG8gY2FycnkgYCRgIHByb3BlcnRpZXMgaW5cclxuXHQvLyB0aGUgbW9uZ28gY29sbGVjdGlvbi5cclxuXHQvL1xyXG5cdC8vIFByLiBkZWZhdWx0IGRvY3MgYXJlIHJlbW92ZWQgZnJvbSB0aGUgY29sbGVjdGlvbiBhZnRlciBzZW5kIGhhdmVcclxuXHQvLyBjb21wbGV0ZWQuIFNldHRpbmcgYG9wdGlvbnMua2VlcERvY3NgIHdpbGwgdXBkYXRlIGFuZCBrZWVwIHRoZVxyXG5cdC8vIGRvYyBlZy4gaWYgbmVlZGVkIGZvciBoaXN0b3JpY2FsIHJlYXNvbnMuXHJcblx0Ly9cclxuXHQvLyBBZnRlciB0aGUgc2VuZCBoYXZlIGNvbXBsZXRlZCBhIFwic2VuZFwiIGV2ZW50IHdpbGwgYmUgZW1pdHRlZCB3aXRoIGFcclxuXHQvLyBzdGF0dXMgb2JqZWN0IGNvbnRhaW5pbmcgZG9jIGlkIGFuZCB0aGUgc2VuZCByZXN1bHQgb2JqZWN0LlxyXG5cdC8vXHJcblx0dmFyIGlzU2VuZGluZ0RvYyA9IGZhbHNlO1xyXG5cclxuXHRpZiAob3B0aW9ucy5zZW5kSW50ZXJ2YWwgIT09IG51bGwpIHtcclxuXHJcblx0XHQvLyBUaGlzIHdpbGwgcmVxdWlyZSBpbmRleCBzaW5jZSB3ZSBzb3J0IGRvY3MgYnkgY3JlYXRlZEF0XHJcblx0XHRJbnN0YW5jZVJlY29yZFF1ZXVlLmNvbGxlY3Rpb24uX2Vuc3VyZUluZGV4KHtcclxuXHRcdFx0Y3JlYXRlZEF0OiAxXHJcblx0XHR9KTtcclxuXHRcdEluc3RhbmNlUmVjb3JkUXVldWUuY29sbGVjdGlvbi5fZW5zdXJlSW5kZXgoe1xyXG5cdFx0XHRzZW50OiAxXHJcblx0XHR9KTtcclxuXHRcdEluc3RhbmNlUmVjb3JkUXVldWUuY29sbGVjdGlvbi5fZW5zdXJlSW5kZXgoe1xyXG5cdFx0XHRzZW5kaW5nOiAxXHJcblx0XHR9KTtcclxuXHJcblxyXG5cdFx0dmFyIHNlbmREb2MgPSBmdW5jdGlvbiAoZG9jKSB7XHJcblx0XHRcdC8vIFJlc2VydmUgZG9jXHJcblx0XHRcdHZhciBub3cgPSArbmV3IERhdGUoKTtcclxuXHRcdFx0dmFyIHRpbWVvdXRBdCA9IG5vdyArIG9wdGlvbnMuc2VuZFRpbWVvdXQ7XHJcblx0XHRcdHZhciByZXNlcnZlZCA9IEluc3RhbmNlUmVjb3JkUXVldWUuY29sbGVjdGlvbi51cGRhdGUoe1xyXG5cdFx0XHRcdF9pZDogZG9jLl9pZCxcclxuXHRcdFx0XHRzZW50OiBmYWxzZSwgLy8geHh4OiBuZWVkIHRvIG1ha2Ugc3VyZSB0aGlzIGlzIHNldCBvbiBjcmVhdGVcclxuXHRcdFx0XHRzZW5kaW5nOiB7XHJcblx0XHRcdFx0XHQkbHQ6IG5vd1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdCRzZXQ6IHtcclxuXHRcdFx0XHRcdHNlbmRpbmc6IHRpbWVvdXRBdCxcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0Ly8gTWFrZSBzdXJlIHdlIG9ubHkgaGFuZGxlIGRvY3MgcmVzZXJ2ZWQgYnkgdGhpc1xyXG5cdFx0XHQvLyBpbnN0YW5jZVxyXG5cdFx0XHRpZiAocmVzZXJ2ZWQpIHtcclxuXHJcblx0XHRcdFx0Ly8gU2VuZFxyXG5cdFx0XHRcdHZhciByZXN1bHQgPSBzZWxmLnNlcnZlclNlbmQoZG9jKTtcclxuXHJcblx0XHRcdFx0aWYgKCFvcHRpb25zLmtlZXBEb2NzKSB7XHJcblx0XHRcdFx0XHQvLyBQci4gRGVmYXVsdCB3ZSB3aWxsIHJlbW92ZSBkb2NzXHJcblx0XHRcdFx0XHRJbnN0YW5jZVJlY29yZFF1ZXVlLmNvbGxlY3Rpb24ucmVtb3ZlKHtcclxuXHRcdFx0XHRcdFx0X2lkOiBkb2MuX2lkXHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cclxuXHRcdFx0XHRcdC8vIFVwZGF0ZVxyXG5cdFx0XHRcdFx0SW5zdGFuY2VSZWNvcmRRdWV1ZS5jb2xsZWN0aW9uLnVwZGF0ZSh7XHJcblx0XHRcdFx0XHRcdF9pZDogZG9jLl9pZFxyXG5cdFx0XHRcdFx0fSwge1xyXG5cdFx0XHRcdFx0XHQkc2V0OiB7XHJcblx0XHRcdFx0XHRcdFx0Ly8gTWFyayBhcyBzZW50XHJcblx0XHRcdFx0XHRcdFx0c2VudDogdHJ1ZSxcclxuXHRcdFx0XHRcdFx0XHQvLyBTZXQgdGhlIHNlbnQgZGF0ZVxyXG5cdFx0XHRcdFx0XHRcdHNlbnRBdDogbmV3IERhdGUoKSxcclxuXHRcdFx0XHRcdFx0XHQvLyBOb3QgYmVpbmcgc2VudCBhbnltb3JlXHJcblx0XHRcdFx0XHRcdFx0c2VuZGluZzogMFxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHQvLyAvLyBFbWl0IHRoZSBzZW5kXHJcblx0XHRcdFx0Ly8gSW5zdGFuY2VSZWNvcmRRdWV1ZS5lbWl0KCdzZW5kJywge1xyXG5cdFx0XHRcdC8vIFx0ZG9jOiBkb2MuX2lkLFxyXG5cdFx0XHRcdC8vIFx0cmVzdWx0OiByZXN1bHRcclxuXHRcdFx0XHQvLyB9KTtcclxuXHJcblx0XHRcdH0gLy8gRWxzZSBjb3VsZCBub3QgcmVzZXJ2ZVxyXG5cdFx0fTsgLy8gRU8gc2VuZERvY1xyXG5cclxuXHRcdHNlbmRXb3JrZXIoZnVuY3Rpb24gKCkge1xyXG5cclxuXHRcdFx0aWYgKGlzU2VuZGluZ0RvYykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHQvLyBTZXQgc2VuZCBmZW5jZVxyXG5cdFx0XHRpc1NlbmRpbmdEb2MgPSB0cnVlO1xyXG5cclxuXHRcdFx0dmFyIGJhdGNoU2l6ZSA9IG9wdGlvbnMuc2VuZEJhdGNoU2l6ZSB8fCAxO1xyXG5cclxuXHRcdFx0dmFyIG5vdyA9ICtuZXcgRGF0ZSgpO1xyXG5cclxuXHRcdFx0Ly8gRmluZCBkb2NzIHRoYXQgYXJlIG5vdCBiZWluZyBvciBhbHJlYWR5IHNlbnRcclxuXHRcdFx0dmFyIHBlbmRpbmdEb2NzID0gSW5zdGFuY2VSZWNvcmRRdWV1ZS5jb2xsZWN0aW9uLmZpbmQoe1xyXG5cdFx0XHRcdCRhbmQ6IFtcclxuXHRcdFx0XHRcdC8vIE1lc3NhZ2UgaXMgbm90IHNlbnRcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0c2VudDogZmFsc2VcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHQvLyBBbmQgbm90IGJlaW5nIHNlbnQgYnkgb3RoZXIgaW5zdGFuY2VzXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdHNlbmRpbmc6IHtcclxuXHRcdFx0XHRcdFx0XHQkbHQ6IG5vd1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0Ly8gQW5kIG5vIGVycm9yXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdGVyck1zZzoge1xyXG5cdFx0XHRcdFx0XHRcdCRleGlzdHM6IGZhbHNlXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRdXHJcblx0XHRcdH0sIHtcclxuXHRcdFx0XHQvLyBTb3J0IGJ5IGNyZWF0ZWQgZGF0ZVxyXG5cdFx0XHRcdHNvcnQ6IHtcclxuXHRcdFx0XHRcdGNyZWF0ZWRBdDogMVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0bGltaXQ6IGJhdGNoU2l6ZVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdHBlbmRpbmdEb2NzLmZvckVhY2goZnVuY3Rpb24gKGRvYykge1xyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHRzZW5kRG9jKGRvYyk7XHJcblx0XHRcdFx0fSBjYXRjaCAoZXJyb3IpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoZXJyb3Iuc3RhY2spO1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ0luc3RhbmNlUmVjb3JkUXVldWU6IENvdWxkIG5vdCBzZW5kIGRvYyBpZDogXCInICsgZG9jLl9pZCArICdcIiwgRXJyb3I6ICcgKyBlcnJvci5tZXNzYWdlKTtcclxuXHRcdFx0XHRcdEluc3RhbmNlUmVjb3JkUXVldWUuY29sbGVjdGlvbi51cGRhdGUoe1xyXG5cdFx0XHRcdFx0XHRfaWQ6IGRvYy5faWRcclxuXHRcdFx0XHRcdH0sIHtcclxuXHRcdFx0XHRcdFx0JHNldDoge1xyXG5cdFx0XHRcdFx0XHRcdC8vIGVycm9yIG1lc3NhZ2VcclxuXHRcdFx0XHRcdFx0XHRlcnJNc2c6IGVycm9yLm1lc3NhZ2VcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTsgLy8gRU8gZm9yRWFjaFxyXG5cclxuXHRcdFx0Ly8gUmVtb3ZlIHRoZSBzZW5kIGZlbmNlXHJcblx0XHRcdGlzU2VuZGluZ0RvYyA9IGZhbHNlO1xyXG5cdFx0fSwgb3B0aW9ucy5zZW5kSW50ZXJ2YWwgfHwgMTUwMDApOyAvLyBEZWZhdWx0IGV2ZXJ5IDE1dGggc2VjXHJcblxyXG5cdH0gZWxzZSB7XHJcblx0XHRpZiAoSW5zdGFuY2VSZWNvcmRRdWV1ZS5kZWJ1Zykge1xyXG5cdFx0XHRjb25zb2xlLmxvZygnSW5zdGFuY2VSZWNvcmRRdWV1ZTogU2VuZCBzZXJ2ZXIgaXMgZGlzYWJsZWQnKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG59O1xyXG5cclxuSW5zdGFuY2VSZWNvcmRRdWV1ZS5zeW5jQXR0YWNoID0gZnVuY3Rpb24gKHN5bmNfYXR0YWNobWVudCwgaW5zSWQsIHNwYWNlSWQsIG5ld1JlY29yZElkLCBvYmplY3ROYW1lKSB7XHJcblx0aWYgKHN5bmNfYXR0YWNobWVudCA9PSBcImxhc3Rlc3RcIikge1xyXG5cdFx0Y2ZzLmluc3RhbmNlcy5maW5kKHtcclxuXHRcdFx0J21ldGFkYXRhLmluc3RhbmNlJzogaW5zSWQsXHJcblx0XHRcdCdtZXRhZGF0YS5jdXJyZW50JzogdHJ1ZVxyXG5cdFx0fSkuZm9yRWFjaChmdW5jdGlvbiAoZikge1xyXG5cdFx0XHRpZiAoIWYuaGFzU3RvcmVkKCdpbnN0YW5jZXMnKSkge1xyXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoJ3N5bmNBdHRhY2gtZmlsZSBub3Qgc3RvcmVkOiAnLCBmLl9pZCk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdHZhciBuZXdGaWxlID0gbmV3IEZTLkZpbGUoKSxcclxuXHRcdFx0XHRjbXNGaWxlSWQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2Ntc19maWxlcycpLl9tYWtlTmV3SUQoKTtcclxuXHRcdFx0bmV3RmlsZS5hdHRhY2hEYXRhKGYuY3JlYXRlUmVhZFN0cmVhbSgnaW5zdGFuY2VzJyksIHtcclxuXHRcdFx0XHR0eXBlOiBmLm9yaWdpbmFsLnR5cGVcclxuXHRcdFx0fSwgZnVuY3Rpb24gKGVycikge1xyXG5cdFx0XHRcdGlmIChlcnIpIHtcclxuXHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoZXJyLmVycm9yLCBlcnIucmVhc29uKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bmV3RmlsZS5uYW1lKGYubmFtZSgpKTtcclxuXHRcdFx0XHRuZXdGaWxlLnNpemUoZi5zaXplKCkpO1xyXG5cdFx0XHRcdHZhciBtZXRhZGF0YSA9IHtcclxuXHRcdFx0XHRcdG93bmVyOiBmLm1ldGFkYXRhLm93bmVyLFxyXG5cdFx0XHRcdFx0b3duZXJfbmFtZTogZi5tZXRhZGF0YS5vd25lcl9uYW1lLFxyXG5cdFx0XHRcdFx0c3BhY2U6IHNwYWNlSWQsXHJcblx0XHRcdFx0XHRyZWNvcmRfaWQ6IG5ld1JlY29yZElkLFxyXG5cdFx0XHRcdFx0b2JqZWN0X25hbWU6IG9iamVjdE5hbWUsXHJcblx0XHRcdFx0XHRwYXJlbnQ6IGNtc0ZpbGVJZFxyXG5cdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdG5ld0ZpbGUubWV0YWRhdGEgPSBtZXRhZGF0YTtcclxuXHRcdFx0XHRjZnMuZmlsZXMuaW5zZXJ0KG5ld0ZpbGUpO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0TWV0ZW9yLndyYXBBc3luYyhmdW5jdGlvbiAobmV3RmlsZSwgQ3JlYXRvciwgY21zRmlsZUlkLCBvYmplY3ROYW1lLCBuZXdSZWNvcmRJZCwgc3BhY2VJZCwgZiwgY2IpIHtcclxuXHRcdFx0XHRuZXdGaWxlLm9uY2UoJ3N0b3JlZCcsIGZ1bmN0aW9uIChzdG9yZU5hbWUpIHtcclxuXHRcdFx0XHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbignY21zX2ZpbGVzJykuaW5zZXJ0KHtcclxuXHRcdFx0XHRcdFx0X2lkOiBjbXNGaWxlSWQsXHJcblx0XHRcdFx0XHRcdHBhcmVudDoge1xyXG5cdFx0XHRcdFx0XHRcdG86IG9iamVjdE5hbWUsXHJcblx0XHRcdFx0XHRcdFx0aWRzOiBbbmV3UmVjb3JkSWRdXHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdHNpemU6IG5ld0ZpbGUuc2l6ZSgpLFxyXG5cdFx0XHRcdFx0XHRuYW1lOiBuZXdGaWxlLm5hbWUoKSxcclxuXHRcdFx0XHRcdFx0ZXh0ZW50aW9uOiBuZXdGaWxlLmV4dGVuc2lvbigpLFxyXG5cdFx0XHRcdFx0XHRzcGFjZTogc3BhY2VJZCxcclxuXHRcdFx0XHRcdFx0dmVyc2lvbnM6IFtuZXdGaWxlLl9pZF0sXHJcblx0XHRcdFx0XHRcdG93bmVyOiBmLm1ldGFkYXRhLm93bmVyLFxyXG5cdFx0XHRcdFx0XHRjcmVhdGVkX2J5OiBmLm1ldGFkYXRhLm93bmVyLFxyXG5cdFx0XHRcdFx0XHRtb2RpZmllZF9ieTogZi5tZXRhZGF0YS5vd25lclxyXG5cdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0Y2IobnVsbCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0bmV3RmlsZS5vbmNlKCdlcnJvcicsIGZ1bmN0aW9uIChlcnJvcikge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvcignc3luY0F0dGFjaC1lcnJvcjogJywgZXJyb3IpO1xyXG5cdFx0XHRcdFx0Y2IoZXJyb3IpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9KShuZXdGaWxlLCBDcmVhdG9yLCBjbXNGaWxlSWQsIG9iamVjdE5hbWUsIG5ld1JlY29yZElkLCBzcGFjZUlkLCBmKTtcclxuXHRcdH0pXHJcblx0fSBlbHNlIGlmIChzeW5jX2F0dGFjaG1lbnQgPT0gXCJhbGxcIikge1xyXG5cdFx0dmFyIHBhcmVudHMgPSBbXTtcclxuXHRcdGNmcy5pbnN0YW5jZXMuZmluZCh7XHJcblx0XHRcdCdtZXRhZGF0YS5pbnN0YW5jZSc6IGluc0lkXHJcblx0XHR9KS5mb3JFYWNoKGZ1bmN0aW9uIChmKSB7XHJcblx0XHRcdGlmICghZi5oYXNTdG9yZWQoJ2luc3RhbmNlcycpKSB7XHJcblx0XHRcdFx0Y29uc29sZS5lcnJvcignc3luY0F0dGFjaC1maWxlIG5vdCBzdG9yZWQ6ICcsIGYuX2lkKTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0dmFyIG5ld0ZpbGUgPSBuZXcgRlMuRmlsZSgpLFxyXG5cdFx0XHRcdGNtc0ZpbGVJZCA9IGYubWV0YWRhdGEucGFyZW50O1xyXG5cclxuXHRcdFx0aWYgKCFwYXJlbnRzLmluY2x1ZGVzKGNtc0ZpbGVJZCkpIHtcclxuXHRcdFx0XHRwYXJlbnRzLnB1c2goY21zRmlsZUlkKTtcclxuXHRcdFx0XHRDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2Ntc19maWxlcycpLmluc2VydCh7XHJcblx0XHRcdFx0XHRfaWQ6IGNtc0ZpbGVJZCxcclxuXHRcdFx0XHRcdHBhcmVudDoge1xyXG5cdFx0XHRcdFx0XHRvOiBvYmplY3ROYW1lLFxyXG5cdFx0XHRcdFx0XHRpZHM6IFtuZXdSZWNvcmRJZF1cclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRzcGFjZTogc3BhY2VJZCxcclxuXHRcdFx0XHRcdHZlcnNpb25zOiBbXSxcclxuXHRcdFx0XHRcdG93bmVyOiBmLm1ldGFkYXRhLm93bmVyLFxyXG5cdFx0XHRcdFx0Y3JlYXRlZF9ieTogZi5tZXRhZGF0YS5vd25lcixcclxuXHRcdFx0XHRcdG1vZGlmaWVkX2J5OiBmLm1ldGFkYXRhLm93bmVyXHJcblx0XHRcdFx0fSlcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0bmV3RmlsZS5hdHRhY2hEYXRhKGYuY3JlYXRlUmVhZFN0cmVhbSgnaW5zdGFuY2VzJyksIHtcclxuXHRcdFx0XHR0eXBlOiBmLm9yaWdpbmFsLnR5cGVcclxuXHRcdFx0fSwgZnVuY3Rpb24gKGVycikge1xyXG5cdFx0XHRcdGlmIChlcnIpIHtcclxuXHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoZXJyLmVycm9yLCBlcnIucmVhc29uKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bmV3RmlsZS5uYW1lKGYubmFtZSgpKTtcclxuXHRcdFx0XHRuZXdGaWxlLnNpemUoZi5zaXplKCkpO1xyXG5cdFx0XHRcdHZhciBtZXRhZGF0YSA9IHtcclxuXHRcdFx0XHRcdG93bmVyOiBmLm1ldGFkYXRhLm93bmVyLFxyXG5cdFx0XHRcdFx0b3duZXJfbmFtZTogZi5tZXRhZGF0YS5vd25lcl9uYW1lLFxyXG5cdFx0XHRcdFx0c3BhY2U6IHNwYWNlSWQsXHJcblx0XHRcdFx0XHRyZWNvcmRfaWQ6IG5ld1JlY29yZElkLFxyXG5cdFx0XHRcdFx0b2JqZWN0X25hbWU6IG9iamVjdE5hbWUsXHJcblx0XHRcdFx0XHRwYXJlbnQ6IGNtc0ZpbGVJZFxyXG5cdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdG5ld0ZpbGUubWV0YWRhdGEgPSBtZXRhZGF0YTtcclxuXHRcdFx0XHRjZnMuZmlsZXMuaW5zZXJ0KG5ld0ZpbGUpO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0TWV0ZW9yLndyYXBBc3luYyhmdW5jdGlvbiAobmV3RmlsZSwgQ3JlYXRvciwgY21zRmlsZUlkLCBmLCBjYikge1xyXG5cdFx0XHRcdG5ld0ZpbGUub25jZSgnc3RvcmVkJywgZnVuY3Rpb24gKHN0b3JlTmFtZSkge1xyXG5cdFx0XHRcdFx0aWYgKGYubWV0YWRhdGEuY3VycmVudCA9PSB0cnVlKSB7XHJcblx0XHRcdFx0XHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbignY21zX2ZpbGVzJykudXBkYXRlKGNtc0ZpbGVJZCwge1xyXG5cdFx0XHRcdFx0XHRcdCRzZXQ6IHtcclxuXHRcdFx0XHRcdFx0XHRcdHNpemU6IG5ld0ZpbGUuc2l6ZSgpLFxyXG5cdFx0XHRcdFx0XHRcdFx0bmFtZTogbmV3RmlsZS5uYW1lKCksXHJcblx0XHRcdFx0XHRcdFx0XHRleHRlbnRpb246IG5ld0ZpbGUuZXh0ZW5zaW9uKCksXHJcblx0XHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0XHQkYWRkVG9TZXQ6IHtcclxuXHRcdFx0XHRcdFx0XHRcdHZlcnNpb25zOiBuZXdGaWxlLl9pZFxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2Ntc19maWxlcycpLnVwZGF0ZShjbXNGaWxlSWQsIHtcclxuXHRcdFx0XHRcdFx0XHQkYWRkVG9TZXQ6IHtcclxuXHRcdFx0XHRcdFx0XHRcdHZlcnNpb25zOiBuZXdGaWxlLl9pZFxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0Y2IobnVsbCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0bmV3RmlsZS5vbmNlKCdlcnJvcicsIGZ1bmN0aW9uIChlcnJvcikge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvcignc3luY0F0dGFjaC1lcnJvcjogJywgZXJyb3IpO1xyXG5cdFx0XHRcdFx0Y2IoZXJyb3IpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9KShuZXdGaWxlLCBDcmVhdG9yLCBjbXNGaWxlSWQsIGYpO1xyXG5cdFx0fSlcclxuXHR9XHJcbn1cclxuXHJcbkluc3RhbmNlUmVjb3JkUXVldWUuc3luY0luc0ZpZWxkcyA9IFsnbmFtZScsICdzdWJtaXR0ZXJfbmFtZScsICdhcHBsaWNhbnRfbmFtZScsICdhcHBsaWNhbnRfb3JnYW5pemF0aW9uX25hbWUnLCAnYXBwbGljYW50X29yZ2FuaXphdGlvbl9mdWxsbmFtZScsICdzdGF0ZScsXHJcblx0J2N1cnJlbnRfc3RlcF9uYW1lJywgJ2Zsb3dfbmFtZScsICdjYXRlZ29yeV9uYW1lJywgJ3N1Ym1pdF9kYXRlJywgJ2ZpbmlzaF9kYXRlJywgJ2ZpbmFsX2RlY2lzaW9uJywgJ2FwcGxpY2FudF9vcmdhbml6YXRpb24nLCAnYXBwbGljYW50X2NvbXBhbnknXHJcbl07XHJcbkluc3RhbmNlUmVjb3JkUXVldWUuc3luY1ZhbHVlcyA9IGZ1bmN0aW9uIChmaWVsZF9tYXBfYmFjaywgdmFsdWVzLCBpbnMsIG9iamVjdEluZm8sIGZpZWxkX21hcF9iYWNrX3NjcmlwdCwgcmVjb3JkKSB7XHJcblx0dmFyXHJcblx0XHRvYmogPSB7fSxcclxuXHRcdHRhYmxlRmllbGRDb2RlcyA9IFtdLFxyXG5cdFx0dGFibGVGaWVsZE1hcCA9IFtdLFxyXG5cdFx0dGFibGVUb1JlbGF0ZWRNYXAgPSB7fTtcclxuXHJcblx0ZmllbGRfbWFwX2JhY2sgPSBmaWVsZF9tYXBfYmFjayB8fCBbXTtcclxuXHJcblx0dmFyIHNwYWNlSWQgPSBpbnMuc3BhY2U7XHJcblxyXG5cdHZhciBmb3JtID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwiZm9ybXNcIikuZmluZE9uZShpbnMuZm9ybSk7XHJcblx0dmFyIGZvcm1GaWVsZHMgPSBudWxsO1xyXG5cdGlmIChmb3JtLmN1cnJlbnQuX2lkID09PSBpbnMuZm9ybV92ZXJzaW9uKSB7XHJcblx0XHRmb3JtRmllbGRzID0gZm9ybS5jdXJyZW50LmZpZWxkcyB8fCBbXTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0dmFyIGZvcm1WZXJzaW9uID0gXy5maW5kKGZvcm0uaGlzdG9yeXMsIGZ1bmN0aW9uIChoKSB7XHJcblx0XHRcdHJldHVybiBoLl9pZCA9PT0gaW5zLmZvcm1fdmVyc2lvbjtcclxuXHRcdH0pXHJcblx0XHRmb3JtRmllbGRzID0gZm9ybVZlcnNpb24gPyBmb3JtVmVyc2lvbi5maWVsZHMgOiBbXTtcclxuXHR9XHJcblxyXG5cdHZhciBvYmplY3RGaWVsZHMgPSBvYmplY3RJbmZvLmZpZWxkcztcclxuXHR2YXIgb2JqZWN0RmllbGRLZXlzID0gXy5rZXlzKG9iamVjdEZpZWxkcyk7XHJcblx0dmFyIHJlbGF0ZWRPYmplY3RzID0gQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0cyhvYmplY3RJbmZvLm5hbWUsIHNwYWNlSWQpO1xyXG5cdHZhciByZWxhdGVkT2JqZWN0c0tleXMgPSBfLnBsdWNrKHJlbGF0ZWRPYmplY3RzLCAnb2JqZWN0X25hbWUnKTtcclxuXHR2YXIgZm9ybVRhYmxlRmllbGRzID0gXy5maWx0ZXIoZm9ybUZpZWxkcywgZnVuY3Rpb24gKGZvcm1GaWVsZCkge1xyXG5cdFx0cmV0dXJuIGZvcm1GaWVsZC50eXBlID09PSAndGFibGUnXHJcblx0fSk7XHJcblx0dmFyIGZvcm1UYWJsZUZpZWxkc0NvZGUgPSBfLnBsdWNrKGZvcm1UYWJsZUZpZWxkcywgJ2NvZGUnKTtcclxuXHJcblx0dmFyIGdldFJlbGF0ZWRPYmplY3RGaWVsZCA9IGZ1bmN0aW9uIChrZXkpIHtcclxuXHRcdHJldHVybiBfLmZpbmQocmVsYXRlZE9iamVjdHNLZXlzLCBmdW5jdGlvbiAocmVsYXRlZE9iamVjdHNLZXkpIHtcclxuXHRcdFx0cmV0dXJuIGtleS5zdGFydHNXaXRoKHJlbGF0ZWRPYmplY3RzS2V5ICsgJy4nKTtcclxuXHRcdH0pXHJcblx0fTtcclxuXHJcblx0dmFyIGdldEZvcm1UYWJsZUZpZWxkID0gZnVuY3Rpb24gKGtleSkge1xyXG5cdFx0cmV0dXJuIF8uZmluZChmb3JtVGFibGVGaWVsZHNDb2RlLCBmdW5jdGlvbiAoZm9ybVRhYmxlRmllbGRDb2RlKSB7XHJcblx0XHRcdHJldHVybiBrZXkuc3RhcnRzV2l0aChmb3JtVGFibGVGaWVsZENvZGUgKyAnLicpO1xyXG5cdFx0fSlcclxuXHR9O1xyXG5cclxuXHR2YXIgZ2V0Rm9ybUZpZWxkID0gZnVuY3Rpb24gKF9mb3JtRmllbGRzLCBfZmllbGRDb2RlKSB7XHJcblx0XHR2YXIgZm9ybUZpZWxkID0gbnVsbDtcclxuXHRcdF8uZWFjaChfZm9ybUZpZWxkcywgZnVuY3Rpb24gKGZmKSB7XHJcblx0XHRcdGlmICghZm9ybUZpZWxkKSB7XHJcblx0XHRcdFx0aWYgKGZmLmNvZGUgPT09IF9maWVsZENvZGUpIHtcclxuXHRcdFx0XHRcdGZvcm1GaWVsZCA9IGZmO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAoZmYudHlwZSA9PT0gJ3NlY3Rpb24nKSB7XHJcblx0XHRcdFx0XHRfLmVhY2goZmYuZmllbGRzLCBmdW5jdGlvbiAoZikge1xyXG5cdFx0XHRcdFx0XHRpZiAoIWZvcm1GaWVsZCkge1xyXG5cdFx0XHRcdFx0XHRcdGlmIChmLmNvZGUgPT09IF9maWVsZENvZGUpIHtcclxuXHRcdFx0XHRcdFx0XHRcdGZvcm1GaWVsZCA9IGY7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdH0gZWxzZSBpZiAoZmYudHlwZSA9PT0gJ3RhYmxlJykge1xyXG5cdFx0XHRcdFx0Xy5lYWNoKGZmLmZpZWxkcywgZnVuY3Rpb24gKGYpIHtcclxuXHRcdFx0XHRcdFx0aWYgKCFmb3JtRmllbGQpIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAoZi5jb2RlID09PSBfZmllbGRDb2RlKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRmb3JtRmllbGQgPSBmO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIGZvcm1GaWVsZDtcclxuXHR9XHJcblxyXG5cdGZpZWxkX21hcF9iYWNrLmZvckVhY2goZnVuY3Rpb24gKGZtKSB7XHJcblx0XHQvL3dvcmtmbG93IOeahOWtkOihqOWIsGNyZWF0b3Igb2JqZWN0IOeahOebuOWFs+WvueixoVxyXG5cdFx0dmFyIHJlbGF0ZWRPYmplY3RGaWVsZCA9IGdldFJlbGF0ZWRPYmplY3RGaWVsZChmbS5vYmplY3RfZmllbGQpO1xyXG5cdFx0dmFyIGZvcm1UYWJsZUZpZWxkID0gZ2V0Rm9ybVRhYmxlRmllbGQoZm0ud29ya2Zsb3dfZmllbGQpO1xyXG5cdFx0aWYgKHJlbGF0ZWRPYmplY3RGaWVsZCkge1xyXG5cdFx0XHR2YXIgb1RhYmxlQ29kZSA9IGZtLm9iamVjdF9maWVsZC5zcGxpdCgnLicpWzBdO1xyXG5cdFx0XHR2YXIgb1RhYmxlRmllbGRDb2RlID0gZm0ub2JqZWN0X2ZpZWxkLnNwbGl0KCcuJylbMV07XHJcblx0XHRcdHZhciB0YWJsZVRvUmVsYXRlZE1hcEtleSA9IG9UYWJsZUNvZGU7XHJcblx0XHRcdGlmICghdGFibGVUb1JlbGF0ZWRNYXBbdGFibGVUb1JlbGF0ZWRNYXBLZXldKSB7XHJcblx0XHRcdFx0dGFibGVUb1JlbGF0ZWRNYXBbdGFibGVUb1JlbGF0ZWRNYXBLZXldID0ge31cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKGZvcm1UYWJsZUZpZWxkKSB7XHJcblx0XHRcdFx0dmFyIHdUYWJsZUNvZGUgPSBmbS53b3JrZmxvd19maWVsZC5zcGxpdCgnLicpWzBdO1xyXG5cdFx0XHRcdHRhYmxlVG9SZWxhdGVkTWFwW3RhYmxlVG9SZWxhdGVkTWFwS2V5XVsnX0ZST01fVEFCTEVfQ09ERSddID0gd1RhYmxlQ29kZVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0YWJsZVRvUmVsYXRlZE1hcFt0YWJsZVRvUmVsYXRlZE1hcEtleV1bb1RhYmxlRmllbGRDb2RlXSA9IGZtLndvcmtmbG93X2ZpZWxkXHJcblx0XHR9XHJcblx0XHQvLyDliKTmlq3mmK/lkKbmmK/lrZDooajlrZfmrrVcclxuXHRcdGVsc2UgaWYgKGZtLndvcmtmbG93X2ZpZWxkLmluZGV4T2YoJy4kLicpID4gMCAmJiBmbS5vYmplY3RfZmllbGQuaW5kZXhPZignLiQuJykgPiAwKSB7XHJcblx0XHRcdHZhciB3VGFibGVDb2RlID0gZm0ud29ya2Zsb3dfZmllbGQuc3BsaXQoJy4kLicpWzBdO1xyXG5cdFx0XHR2YXIgb1RhYmxlQ29kZSA9IGZtLm9iamVjdF9maWVsZC5zcGxpdCgnLiQuJylbMF07XHJcblx0XHRcdGlmICh2YWx1ZXMuaGFzT3duUHJvcGVydHkod1RhYmxlQ29kZSkgJiYgXy5pc0FycmF5KHZhbHVlc1t3VGFibGVDb2RlXSkpIHtcclxuXHRcdFx0XHR0YWJsZUZpZWxkQ29kZXMucHVzaChKU09OLnN0cmluZ2lmeSh7XHJcblx0XHRcdFx0XHR3b3JrZmxvd190YWJsZV9maWVsZF9jb2RlOiB3VGFibGVDb2RlLFxyXG5cdFx0XHRcdFx0b2JqZWN0X3RhYmxlX2ZpZWxkX2NvZGU6IG9UYWJsZUNvZGVcclxuXHRcdFx0XHR9KSk7XHJcblx0XHRcdFx0dGFibGVGaWVsZE1hcC5wdXNoKGZtKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKHZhbHVlcy5oYXNPd25Qcm9wZXJ0eShmbS53b3JrZmxvd19maWVsZCkpIHtcclxuXHRcdFx0dmFyIHdGaWVsZCA9IG51bGw7XHJcblxyXG5cdFx0XHRfLmVhY2goZm9ybUZpZWxkcywgZnVuY3Rpb24gKGZmKSB7XHJcblx0XHRcdFx0aWYgKCF3RmllbGQpIHtcclxuXHRcdFx0XHRcdGlmIChmZi5jb2RlID09PSBmbS53b3JrZmxvd19maWVsZCkge1xyXG5cdFx0XHRcdFx0XHR3RmllbGQgPSBmZjtcclxuXHRcdFx0XHRcdH0gZWxzZSBpZiAoZmYudHlwZSA9PT0gJ3NlY3Rpb24nKSB7XHJcblx0XHRcdFx0XHRcdF8uZWFjaChmZi5maWVsZHMsIGZ1bmN0aW9uIChmKSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKCF3RmllbGQpIHtcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChmLmNvZGUgPT09IGZtLndvcmtmbG93X2ZpZWxkKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHdGaWVsZCA9IGY7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHJcblx0XHRcdHZhciBvRmllbGQgPSBvYmplY3RGaWVsZHNbZm0ub2JqZWN0X2ZpZWxkXTtcclxuXHJcblx0XHRcdGlmIChvRmllbGQpIHtcclxuXHRcdFx0XHRpZiAoIXdGaWVsZCkge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ2ZtLndvcmtmbG93X2ZpZWxkOiAnLCBmbS53b3JrZmxvd19maWVsZClcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Ly8g6KGo5Y2V6YCJ5Lq66YCJ57uE5a2X5q61IOiHsyDlr7nosaEgbG9va3VwIG1hc3Rlcl9kZXRhaWznsbvlnovlrZfmrrXlkIzmraVcclxuXHRcdFx0XHRpZiAoWyd1c2VyJywgJ2dyb3VwJ10uaW5jbHVkZXMod0ZpZWxkLnR5cGUpICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhvRmllbGQudHlwZSkgJiYgWyd1c2VycycsICdvcmdhbml6YXRpb25zJ10uaW5jbHVkZXMob0ZpZWxkLnJlZmVyZW5jZV90bykpIHtcclxuXHRcdFx0XHRcdGlmICghXy5pc0VtcHR5KHZhbHVlc1tmbS53b3JrZmxvd19maWVsZF0pKSB7XHJcblx0XHRcdFx0XHRcdGlmIChvRmllbGQubXVsdGlwbGUgJiYgd0ZpZWxkLmlzX211bHRpc2VsZWN0KSB7XHJcblx0XHRcdFx0XHRcdFx0b2JqW2ZtLm9iamVjdF9maWVsZF0gPSBfLmNvbXBhY3QoXy5wbHVjayh2YWx1ZXNbZm0ud29ya2Zsb3dfZmllbGRdLCAnaWQnKSlcclxuXHRcdFx0XHRcdFx0fSBlbHNlIGlmICghb0ZpZWxkLm11bHRpcGxlICYmICF3RmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcclxuXHRcdFx0XHRcdFx0XHRvYmpbZm0ub2JqZWN0X2ZpZWxkXSA9IHZhbHVlc1tmbS53b3JrZmxvd19maWVsZF0uaWRcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIGlmICghb0ZpZWxkLm11bHRpcGxlICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhvRmllbGQudHlwZSkgJiYgXy5pc1N0cmluZyhvRmllbGQucmVmZXJlbmNlX3RvKSAmJiBfLmlzU3RyaW5nKHZhbHVlc1tmbS53b3JrZmxvd19maWVsZF0pKSB7XHJcblx0XHRcdFx0XHR2YXIgb0NvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob0ZpZWxkLnJlZmVyZW5jZV90bywgc3BhY2VJZClcclxuXHRcdFx0XHRcdHZhciByZWZlck9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9GaWVsZC5yZWZlcmVuY2VfdG8sIHNwYWNlSWQpXHJcblx0XHRcdFx0XHRpZiAob0NvbGxlY3Rpb24gJiYgcmVmZXJPYmplY3QpIHtcclxuXHRcdFx0XHRcdFx0Ly8g5YWI6K6k5Li65q2k5YC85pivcmVmZXJPYmplY3QgX2lk5a2X5q615YC8XHJcblx0XHRcdFx0XHRcdHZhciByZWZlckRhdGEgPSBvQ29sbGVjdGlvbi5maW5kT25lKHZhbHVlc1tmbS53b3JrZmxvd19maWVsZF0sIHtcclxuXHRcdFx0XHRcdFx0XHRmaWVsZHM6IHtcclxuXHRcdFx0XHRcdFx0XHRcdF9pZDogMVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdGlmIChyZWZlckRhdGEpIHtcclxuXHRcdFx0XHRcdFx0XHRvYmpbZm0ub2JqZWN0X2ZpZWxkXSA9IHJlZmVyRGF0YS5faWQ7XHJcblx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdC8vIOWFtuasoeiupOS4uuatpOWAvOaYr3JlZmVyT2JqZWN0IE5BTUVfRklFTERfS0VZ5YC8XHJcblx0XHRcdFx0XHRcdGlmICghcmVmZXJEYXRhKSB7XHJcblx0XHRcdFx0XHRcdFx0dmFyIG5hbWVGaWVsZEtleSA9IHJlZmVyT2JqZWN0Lk5BTUVfRklFTERfS0VZO1xyXG5cdFx0XHRcdFx0XHRcdHZhciBzZWxlY3RvciA9IHt9O1xyXG5cdFx0XHRcdFx0XHRcdHNlbGVjdG9yW25hbWVGaWVsZEtleV0gPSB2YWx1ZXNbZm0ud29ya2Zsb3dfZmllbGRdO1xyXG5cdFx0XHRcdFx0XHRcdHJlZmVyRGF0YSA9IG9Db2xsZWN0aW9uLmZpbmRPbmUoc2VsZWN0b3IsIHtcclxuXHRcdFx0XHRcdFx0XHRcdGZpZWxkczoge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRfaWQ6IDFcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRpZiAocmVmZXJEYXRhKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRvYmpbZm0ub2JqZWN0X2ZpZWxkXSA9IHJlZmVyRGF0YS5faWQ7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdGlmIChvRmllbGQudHlwZSA9PT0gXCJib29sZWFuXCIpIHtcclxuXHRcdFx0XHRcdFx0dmFyIHRtcF9maWVsZF92YWx1ZSA9IHZhbHVlc1tmbS53b3JrZmxvd19maWVsZF07XHJcblx0XHRcdFx0XHRcdGlmIChbJ3RydWUnLCAn5pivJ10uaW5jbHVkZXModG1wX2ZpZWxkX3ZhbHVlKSkge1xyXG5cdFx0XHRcdFx0XHRcdG9ialtmbS5vYmplY3RfZmllbGRdID0gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChbJ2ZhbHNlJywgJ+WQpiddLmluY2x1ZGVzKHRtcF9maWVsZF92YWx1ZSkpIHtcclxuXHRcdFx0XHRcdFx0XHRvYmpbZm0ub2JqZWN0X2ZpZWxkXSA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdG9ialtmbS5vYmplY3RfZmllbGRdID0gdG1wX2ZpZWxkX3ZhbHVlO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlIGlmIChbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMob0ZpZWxkLnR5cGUpICYmIHdGaWVsZC50eXBlID09PSAnb2RhdGEnKSB7XHJcblx0XHRcdFx0XHRcdGlmIChvRmllbGQubXVsdGlwbGUgJiYgd0ZpZWxkLmlzX211bHRpc2VsZWN0KSB7XHJcblx0XHRcdFx0XHRcdFx0b2JqW2ZtLm9iamVjdF9maWVsZF0gPSBfLmNvbXBhY3QoXy5wbHVjayh2YWx1ZXNbZm0ud29ya2Zsb3dfZmllbGRdLCAnX2lkJykpXHJcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoIW9GaWVsZC5tdWx0aXBsZSAmJiAhd0ZpZWxkLmlzX211bHRpc2VsZWN0KSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKCFfLmlzRW1wdHkodmFsdWVzW2ZtLndvcmtmbG93X2ZpZWxkXSkpIHtcclxuXHRcdFx0XHRcdFx0XHRcdG9ialtmbS5vYmplY3RfZmllbGRdID0gdmFsdWVzW2ZtLndvcmtmbG93X2ZpZWxkXS5faWRcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0b2JqW2ZtLm9iamVjdF9maWVsZF0gPSB2YWx1ZXNbZm0ud29ya2Zsb3dfZmllbGRdO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdFx0b2JqW2ZtLm9iamVjdF9maWVsZF0gPSB2YWx1ZXNbZm0ud29ya2Zsb3dfZmllbGRdO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRpZiAoZm0ub2JqZWN0X2ZpZWxkLmluZGV4T2YoJy4nKSA+IC0xKSB7XHJcblx0XHRcdFx0XHR2YXIgdGVtT2JqRmllbGRzID0gZm0ub2JqZWN0X2ZpZWxkLnNwbGl0KCcuJyk7XHJcblx0XHRcdFx0XHRpZiAodGVtT2JqRmllbGRzLmxlbmd0aCA9PT0gMikge1xyXG5cdFx0XHRcdFx0XHR2YXIgb2JqRmllbGQgPSB0ZW1PYmpGaWVsZHNbMF07XHJcblx0XHRcdFx0XHRcdHZhciByZWZlck9iakZpZWxkID0gdGVtT2JqRmllbGRzWzFdO1xyXG5cdFx0XHRcdFx0XHR2YXIgb0ZpZWxkID0gb2JqZWN0RmllbGRzW29iakZpZWxkXTtcclxuXHRcdFx0XHRcdFx0aWYgKCFvRmllbGQubXVsdGlwbGUgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKG9GaWVsZC50eXBlKSAmJiBfLmlzU3RyaW5nKG9GaWVsZC5yZWZlcmVuY2VfdG8pKSB7XHJcblx0XHRcdFx0XHRcdFx0dmFyIG9Db2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9GaWVsZC5yZWZlcmVuY2VfdG8sIHNwYWNlSWQpXHJcblx0XHRcdFx0XHRcdFx0aWYgKG9Db2xsZWN0aW9uICYmIHJlY29yZCAmJiByZWNvcmRbb2JqRmllbGRdKSB7XHJcblx0XHRcdFx0XHRcdFx0XHR2YXIgcmVmZXJTZXRPYmogPSB7fTtcclxuXHRcdFx0XHRcdFx0XHRcdHJlZmVyU2V0T2JqW3JlZmVyT2JqRmllbGRdID0gdmFsdWVzW2ZtLndvcmtmbG93X2ZpZWxkXTtcclxuXHRcdFx0XHRcdFx0XHRcdG9Db2xsZWN0aW9uLnVwZGF0ZShyZWNvcmRbb2JqRmllbGRdLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdCRzZXQ6IHJlZmVyU2V0T2JqXHJcblx0XHRcdFx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQvLyBlbHNle1xyXG5cdFx0XHRcdC8vIFx0dmFyIHJlbGF0ZWRPYmplY3QgPSBfLmZpbmQocmVsYXRlZE9iamVjdHMsIGZ1bmN0aW9uKF9yZWxhdGVkT2JqZWN0KXtcclxuXHRcdFx0XHQvLyBcdFx0cmV0dXJuIF9yZWxhdGVkT2JqZWN0Lm9iamVjdF9uYW1lID09PSBmbS5vYmplY3RfZmllbGRcclxuXHRcdFx0XHQvLyBcdH0pXHJcblx0XHRcdFx0Ly9cclxuXHRcdFx0XHQvLyBcdGlmKHJlbGF0ZWRPYmplY3Qpe1xyXG5cdFx0XHRcdC8vIFx0XHRvYmpbZm0ub2JqZWN0X2ZpZWxkXSA9IHZhbHVlc1tmbS53b3JrZmxvd19maWVsZF07XHJcblx0XHRcdFx0Ly8gXHR9XHJcblx0XHRcdFx0Ly8gfVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdGlmIChmbS53b3JrZmxvd19maWVsZC5zdGFydHNXaXRoKCdpbnN0YW5jZS4nKSkge1xyXG5cdFx0XHRcdHZhciBpbnNGaWVsZCA9IGZtLndvcmtmbG93X2ZpZWxkLnNwbGl0KCdpbnN0YW5jZS4nKVsxXTtcclxuXHRcdFx0XHRpZiAoSW5zdGFuY2VSZWNvcmRRdWV1ZS5zeW5jSW5zRmllbGRzLmluY2x1ZGVzKGluc0ZpZWxkKSkge1xyXG5cdFx0XHRcdFx0aWYgKGZtLm9iamVjdF9maWVsZC5pbmRleE9mKCcuJykgPCAwKSB7XHJcblx0XHRcdFx0XHRcdG9ialtmbS5vYmplY3RfZmllbGRdID0gaW5zW2luc0ZpZWxkXTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdHZhciB0ZW1PYmpGaWVsZHMgPSBmbS5vYmplY3RfZmllbGQuc3BsaXQoJy4nKTtcclxuXHRcdFx0XHRcdFx0aWYgKHRlbU9iakZpZWxkcy5sZW5ndGggPT09IDIpIHtcclxuXHRcdFx0XHRcdFx0XHR2YXIgb2JqRmllbGQgPSB0ZW1PYmpGaWVsZHNbMF07XHJcblx0XHRcdFx0XHRcdFx0dmFyIHJlZmVyT2JqRmllbGQgPSB0ZW1PYmpGaWVsZHNbMV07XHJcblx0XHRcdFx0XHRcdFx0dmFyIG9GaWVsZCA9IG9iamVjdEZpZWxkc1tvYmpGaWVsZF07XHJcblx0XHRcdFx0XHRcdFx0aWYgKCFvRmllbGQubXVsdGlwbGUgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKG9GaWVsZC50eXBlKSAmJiBfLmlzU3RyaW5nKG9GaWVsZC5yZWZlcmVuY2VfdG8pKSB7XHJcblx0XHRcdFx0XHRcdFx0XHR2YXIgb0NvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob0ZpZWxkLnJlZmVyZW5jZV90bywgc3BhY2VJZClcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChvQ29sbGVjdGlvbiAmJiByZWNvcmQgJiYgcmVjb3JkW29iakZpZWxkXSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR2YXIgcmVmZXJTZXRPYmogPSB7fTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0cmVmZXJTZXRPYmpbcmVmZXJPYmpGaWVsZF0gPSBpbnNbaW5zRmllbGRdO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRvQ29sbGVjdGlvbi51cGRhdGUocmVjb3JkW29iakZpZWxkXSwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCRzZXQ6IHJlZmVyU2V0T2JqXHJcblx0XHRcdFx0XHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRpZiAoaW5zW2ZtLndvcmtmbG93X2ZpZWxkXSkge1xyXG5cdFx0XHRcdFx0b2JqW2ZtLm9iamVjdF9maWVsZF0gPSBpbnNbZm0ud29ya2Zsb3dfZmllbGRdO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0pXHJcblxyXG5cdF8udW5pcSh0YWJsZUZpZWxkQ29kZXMpLmZvckVhY2goZnVuY3Rpb24gKHRmYykge1xyXG5cdFx0dmFyIGMgPSBKU09OLnBhcnNlKHRmYyk7XHJcblx0XHRvYmpbYy5vYmplY3RfdGFibGVfZmllbGRfY29kZV0gPSBbXTtcclxuXHRcdHZhbHVlc1tjLndvcmtmbG93X3RhYmxlX2ZpZWxkX2NvZGVdLmZvckVhY2goZnVuY3Rpb24gKHRyKSB7XHJcblx0XHRcdHZhciBuZXdUciA9IHt9O1xyXG5cdFx0XHRfLmVhY2godHIsIGZ1bmN0aW9uICh2LCBrKSB7XHJcblx0XHRcdFx0dGFibGVGaWVsZE1hcC5mb3JFYWNoKGZ1bmN0aW9uICh0Zm0pIHtcclxuXHRcdFx0XHRcdGlmICh0Zm0ud29ya2Zsb3dfZmllbGQgPT0gKGMud29ya2Zsb3dfdGFibGVfZmllbGRfY29kZSArICcuJC4nICsgaykpIHtcclxuXHRcdFx0XHRcdFx0dmFyIG9UZENvZGUgPSB0Zm0ub2JqZWN0X2ZpZWxkLnNwbGl0KCcuJC4nKVsxXTtcclxuXHRcdFx0XHRcdFx0bmV3VHJbb1RkQ29kZV0gPSB2O1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pXHJcblx0XHRcdH0pXHJcblx0XHRcdGlmICghXy5pc0VtcHR5KG5ld1RyKSkge1xyXG5cdFx0XHRcdG9ialtjLm9iamVjdF90YWJsZV9maWVsZF9jb2RlXS5wdXNoKG5ld1RyKTtcclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHR9KTtcclxuXHR2YXIgcmVsYXRlZE9ianMgPSB7fTtcclxuXHR2YXIgZ2V0UmVsYXRlZEZpZWxkVmFsdWUgPSBmdW5jdGlvbiAodmFsdWVLZXksIHBhcmVudCkge1xyXG5cdFx0cmV0dXJuIHZhbHVlS2V5LnNwbGl0KCcuJykucmVkdWNlKGZ1bmN0aW9uIChvLCB4KSB7XHJcblx0XHRcdHJldHVybiBvW3hdO1xyXG5cdFx0fSwgcGFyZW50KTtcclxuXHR9O1xyXG5cdF8uZWFjaCh0YWJsZVRvUmVsYXRlZE1hcCwgZnVuY3Rpb24gKG1hcCwga2V5KSB7XHJcblx0XHR2YXIgdGFibGVDb2RlID0gbWFwLl9GUk9NX1RBQkxFX0NPREU7XHJcblx0XHRpZiAoIXRhYmxlQ29kZSkge1xyXG5cdFx0XHRjb25zb2xlLndhcm4oJ3RhYmxlVG9SZWxhdGVkOiBbJyArIGtleSArICddIG1pc3NpbmcgY29ycmVzcG9uZGluZyB0YWJsZS4nKVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dmFyIHJlbGF0ZWRPYmplY3ROYW1lID0ga2V5O1xyXG5cdFx0XHR2YXIgcmVsYXRlZE9iamVjdFZhbHVlcyA9IFtdO1xyXG5cdFx0XHR2YXIgcmVsYXRlZE9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlbGF0ZWRPYmplY3ROYW1lLCBzcGFjZUlkKTtcclxuXHRcdFx0Xy5lYWNoKHZhbHVlc1t0YWJsZUNvZGVdLCBmdW5jdGlvbiAodGFibGVWYWx1ZUl0ZW0pIHtcclxuXHRcdFx0XHR2YXIgcmVsYXRlZE9iamVjdFZhbHVlID0ge307XHJcblx0XHRcdFx0Xy5lYWNoKG1hcCwgZnVuY3Rpb24gKHZhbHVlS2V5LCBmaWVsZEtleSkge1xyXG5cdFx0XHRcdFx0aWYgKGZpZWxkS2V5ICE9ICdfRlJPTV9UQUJMRV9DT0RFJykge1xyXG5cdFx0XHRcdFx0XHRpZiAodmFsdWVLZXkuc3RhcnRzV2l0aCgnaW5zdGFuY2UuJykpIHtcclxuXHRcdFx0XHRcdFx0XHRyZWxhdGVkT2JqZWN0VmFsdWVbZmllbGRLZXldID0gZ2V0UmVsYXRlZEZpZWxkVmFsdWUodmFsdWVLZXksIHsgJ2luc3RhbmNlJzogaW5zIH0pO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdHZhciByZWxhdGVkT2JqZWN0RmllbGRWYWx1ZSwgZm9ybUZpZWxkS2V5O1xyXG5cdFx0XHRcdFx0XHRcdGlmICh2YWx1ZUtleS5zdGFydHNXaXRoKHRhYmxlQ29kZSArICcuJykpIHtcclxuXHRcdFx0XHRcdFx0XHRcdGZvcm1GaWVsZEtleSA9IHZhbHVlS2V5LnNwbGl0KFwiLlwiKVsxXTtcclxuXHRcdFx0XHRcdFx0XHRcdHJlbGF0ZWRPYmplY3RGaWVsZFZhbHVlID0gZ2V0UmVsYXRlZEZpZWxkVmFsdWUodmFsdWVLZXksIHsgW3RhYmxlQ29kZV06IHRhYmxlVmFsdWVJdGVtIH0pO1xyXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRmb3JtRmllbGRLZXkgPSB2YWx1ZUtleTtcclxuXHRcdFx0XHRcdFx0XHRcdHJlbGF0ZWRPYmplY3RGaWVsZFZhbHVlID0gZ2V0UmVsYXRlZEZpZWxkVmFsdWUodmFsdWVLZXksIHZhbHVlcylcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0dmFyIGZvcm1GaWVsZCA9IGdldEZvcm1GaWVsZChmb3JtRmllbGRzLCBmb3JtRmllbGRLZXkpO1xyXG5cdFx0XHRcdFx0XHRcdHZhciByZWxhdGVkT2JqZWN0RmllbGQgPSByZWxhdGVkT2JqZWN0LmZpZWxkc1tmaWVsZEtleV07XHJcblx0XHRcdFx0XHRcdFx0aWYgKCFyZWxhdGVkT2JqZWN0RmllbGQgfHwgIWZvcm1GaWVsZCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuXHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdGlmIChmb3JtRmllbGQudHlwZSA9PSAnb2RhdGEnICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhyZWxhdGVkT2JqZWN0RmllbGQudHlwZSkpIHtcclxuXHRcdFx0XHRcdFx0XHRcdGlmICghXy5pc0VtcHR5KHJlbGF0ZWRPYmplY3RGaWVsZFZhbHVlKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAocmVsYXRlZE9iamVjdEZpZWxkLm11bHRpcGxlICYmIGZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJlbGF0ZWRPYmplY3RGaWVsZFZhbHVlID0gXy5jb21wYWN0KF8ucGx1Y2socmVsYXRlZE9iamVjdEZpZWxkVmFsdWUsICdfaWQnKSlcclxuXHRcdFx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmICghcmVsYXRlZE9iamVjdEZpZWxkLm11bHRpcGxlICYmICFmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZWxhdGVkT2JqZWN0RmllbGRWYWx1ZSA9IHJlbGF0ZWRPYmplY3RGaWVsZFZhbHVlLl9pZFxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdC8vIOihqOWNlemAieS6uumAiee7hOWtl+autSDoh7Mg5a+56LGhIGxvb2t1cCBtYXN0ZXJfZGV0YWls57G75Z6L5a2X5q615ZCM5q2lXHJcblx0XHRcdFx0XHRcdFx0aWYgKFsndXNlcicsICdncm91cCddLmluY2x1ZGVzKGZvcm1GaWVsZC50eXBlKSAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMocmVsYXRlZE9iamVjdEZpZWxkLnR5cGUpICYmIFsndXNlcnMnLCAnb3JnYW5pemF0aW9ucyddLmluY2x1ZGVzKHJlbGF0ZWRPYmplY3RGaWVsZC5yZWZlcmVuY2VfdG8pKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoIV8uaXNFbXB0eShyZWxhdGVkT2JqZWN0RmllbGRWYWx1ZSkpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKHJlbGF0ZWRPYmplY3RGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZWxhdGVkT2JqZWN0RmllbGRWYWx1ZSA9IF8uY29tcGFjdChfLnBsdWNrKHJlbGF0ZWRPYmplY3RGaWVsZFZhbHVlLCAnaWQnKSlcclxuXHRcdFx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmICghcmVsYXRlZE9iamVjdEZpZWxkLm11bHRpcGxlICYmICFmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZWxhdGVkT2JqZWN0RmllbGRWYWx1ZSA9IHJlbGF0ZWRPYmplY3RGaWVsZFZhbHVlLmlkXHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0cmVsYXRlZE9iamVjdFZhbHVlW2ZpZWxkS2V5XSA9IHJlbGF0ZWRPYmplY3RGaWVsZFZhbHVlO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0cmVsYXRlZE9iamVjdFZhbHVlWydfdGFibGUnXSA9IHtcclxuXHRcdFx0XHRcdF9pZDogdGFibGVWYWx1ZUl0ZW1bXCJfaWRcIl0sXHJcblx0XHRcdFx0XHRfY29kZTogdGFibGVDb2RlXHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHRyZWxhdGVkT2JqZWN0VmFsdWVzLnB1c2gocmVsYXRlZE9iamVjdFZhbHVlKTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdHJlbGF0ZWRPYmpzW3JlbGF0ZWRPYmplY3ROYW1lXSA9IHJlbGF0ZWRPYmplY3RWYWx1ZXM7XHJcblx0XHR9XHJcblx0fSlcclxuXHJcblx0aWYgKGZpZWxkX21hcF9iYWNrX3NjcmlwdCkge1xyXG5cdFx0Xy5leHRlbmQob2JqLCBJbnN0YW5jZVJlY29yZFF1ZXVlLmV2YWxGaWVsZE1hcEJhY2tTY3JpcHQoZmllbGRfbWFwX2JhY2tfc2NyaXB0LCBpbnMpKTtcclxuXHR9XHJcblx0Ly8g6L+H5ruk5o6J6Z2e5rOV55qEa2V5XHJcblx0dmFyIGZpbHRlck9iaiA9IHt9O1xyXG5cclxuXHRfLmVhY2goXy5rZXlzKG9iaiksIGZ1bmN0aW9uIChrKSB7XHJcblx0XHRpZiAob2JqZWN0RmllbGRLZXlzLmluY2x1ZGVzKGspKSB7XHJcblx0XHRcdGZpbHRlck9ialtrXSA9IG9ialtrXTtcclxuXHRcdH1cclxuXHRcdC8vIGVsc2UgaWYocmVsYXRlZE9iamVjdHNLZXlzLmluY2x1ZGVzKGspICYmIF8uaXNBcnJheShvYmpba10pKXtcclxuXHRcdC8vIFx0aWYoXy5pc0FycmF5KHJlbGF0ZWRPYmpzW2tdKSl7XHJcblx0XHQvLyBcdFx0cmVsYXRlZE9ianNba10gPSByZWxhdGVkT2Jqc1trXS5jb25jYXQob2JqW2tdKVxyXG5cdFx0Ly8gXHR9ZWxzZXtcclxuXHRcdC8vIFx0XHRyZWxhdGVkT2Jqc1trXSA9IG9ialtrXVxyXG5cdFx0Ly8gXHR9XHJcblx0XHQvLyB9XHJcblx0fSlcclxuXHRyZXR1cm4ge1xyXG5cdFx0bWFpbk9iamVjdFZhbHVlOiBmaWx0ZXJPYmosXHJcblx0XHRyZWxhdGVkT2JqZWN0c1ZhbHVlOiByZWxhdGVkT2Jqc1xyXG5cdH07XHJcbn1cclxuXHJcbkluc3RhbmNlUmVjb3JkUXVldWUuZXZhbEZpZWxkTWFwQmFja1NjcmlwdCA9IGZ1bmN0aW9uIChmaWVsZF9tYXBfYmFja19zY3JpcHQsIGlucykge1xyXG5cdHZhciBzY3JpcHQgPSBcIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7IFwiICsgZmllbGRfbWFwX2JhY2tfc2NyaXB0ICsgXCIgfVwiO1xyXG5cdHZhciBmdW5jID0gX2V2YWwoc2NyaXB0LCBcImZpZWxkX21hcF9zY3JpcHRcIik7XHJcblx0dmFyIHZhbHVlcyA9IGZ1bmMoaW5zKTtcclxuXHRpZiAoXy5pc09iamVjdCh2YWx1ZXMpKSB7XHJcblx0XHRyZXR1cm4gdmFsdWVzO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRjb25zb2xlLmVycm9yKFwiZXZhbEZpZWxkTWFwQmFja1NjcmlwdDog6ISa5pys6L+U5Zue5YC857G75Z6L5LiN5piv5a+56LGhXCIpO1xyXG5cdH1cclxuXHRyZXR1cm4ge31cclxufVxyXG5cclxuSW5zdGFuY2VSZWNvcmRRdWV1ZS5zeW5jUmVsYXRlZE9iamVjdHNWYWx1ZSA9IGZ1bmN0aW9uIChtYWluUmVjb3JkSWQsIHJlbGF0ZWRPYmplY3RzLCByZWxhdGVkT2JqZWN0c1ZhbHVlLCBzcGFjZUlkLCBpbnMpIHtcclxuXHR2YXIgaW5zSWQgPSBpbnMuX2lkO1xyXG5cclxuXHRfLmVhY2gocmVsYXRlZE9iamVjdHMsIGZ1bmN0aW9uIChyZWxhdGVkT2JqZWN0KSB7XHJcblx0XHR2YXIgb2JqZWN0Q29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWxhdGVkT2JqZWN0Lm9iamVjdF9uYW1lLCBzcGFjZUlkKTtcclxuXHRcdHZhciB0YWJsZU1hcCA9IHt9O1xyXG5cdFx0Xy5lYWNoKHJlbGF0ZWRPYmplY3RzVmFsdWVbcmVsYXRlZE9iamVjdC5vYmplY3RfbmFtZV0sIGZ1bmN0aW9uIChyZWxhdGVkT2JqZWN0VmFsdWUpIHtcclxuXHRcdFx0dmFyIHRhYmxlX2lkID0gcmVsYXRlZE9iamVjdFZhbHVlLl90YWJsZS5faWQ7XHJcblx0XHRcdHZhciB0YWJsZV9jb2RlID0gcmVsYXRlZE9iamVjdFZhbHVlLl90YWJsZS5fY29kZTtcclxuXHRcdFx0aWYgKCF0YWJsZU1hcFt0YWJsZV9jb2RlXSkge1xyXG5cdFx0XHRcdHRhYmxlTWFwW3RhYmxlX2NvZGVdID0gW11cclxuXHRcdFx0fTtcclxuXHRcdFx0dGFibGVNYXBbdGFibGVfY29kZV0ucHVzaCh0YWJsZV9pZCk7XHJcblx0XHRcdHZhciBvbGRSZWxhdGVkUmVjb3JkID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlbGF0ZWRPYmplY3Qub2JqZWN0X25hbWUsIHNwYWNlSWQpLmZpbmRPbmUoeyBbcmVsYXRlZE9iamVjdC5mb3JlaWduX2tleV06IG1haW5SZWNvcmRJZCwgXCJpbnN0YW5jZXMuX2lkXCI6IGluc0lkLCBfdGFibGU6IHJlbGF0ZWRPYmplY3RWYWx1ZS5fdGFibGUgfSwgeyBmaWVsZHM6IHsgX2lkOiAxIH0gfSlcclxuXHRcdFx0aWYgKG9sZFJlbGF0ZWRSZWNvcmQpIHtcclxuXHRcdFx0XHRDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVsYXRlZE9iamVjdC5vYmplY3RfbmFtZSwgc3BhY2VJZCkudXBkYXRlKHsgX2lkOiBvbGRSZWxhdGVkUmVjb3JkLl9pZCB9LCB7ICRzZXQ6IHJlbGF0ZWRPYmplY3RWYWx1ZSB9KVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJlbGF0ZWRPYmplY3RWYWx1ZVtyZWxhdGVkT2JqZWN0LmZvcmVpZ25fa2V5XSA9IG1haW5SZWNvcmRJZDtcclxuXHRcdFx0XHRyZWxhdGVkT2JqZWN0VmFsdWUuc3BhY2UgPSBzcGFjZUlkO1xyXG5cdFx0XHRcdHJlbGF0ZWRPYmplY3RWYWx1ZS5vd25lciA9IGlucy5hcHBsaWNhbnQ7XHJcblx0XHRcdFx0cmVsYXRlZE9iamVjdFZhbHVlLmNyZWF0ZWRfYnkgPSBpbnMuYXBwbGljYW50O1xyXG5cdFx0XHRcdHJlbGF0ZWRPYmplY3RWYWx1ZS5tb2RpZmllZF9ieSA9IGlucy5hcHBsaWNhbnQ7XHJcblx0XHRcdFx0cmVsYXRlZE9iamVjdFZhbHVlLl9pZCA9IG9iamVjdENvbGxlY3Rpb24uX21ha2VOZXdJRCgpO1xyXG5cdFx0XHRcdHZhciBpbnN0YW5jZV9zdGF0ZSA9IGlucy5zdGF0ZTtcclxuXHRcdFx0XHRpZiAoaW5zLnN0YXRlID09PSAnY29tcGxldGVkJyAmJiBpbnMuZmluYWxfZGVjaXNpb24pIHtcclxuXHRcdFx0XHRcdGluc3RhbmNlX3N0YXRlID0gaW5zLmZpbmFsX2RlY2lzaW9uO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZWxhdGVkT2JqZWN0VmFsdWUuaW5zdGFuY2VzID0gW3tcclxuXHRcdFx0XHRcdF9pZDogaW5zSWQsXHJcblx0XHRcdFx0XHRzdGF0ZTogaW5zdGFuY2Vfc3RhdGVcclxuXHRcdFx0XHR9XTtcclxuXHRcdFx0XHRyZWxhdGVkT2JqZWN0VmFsdWUuaW5zdGFuY2Vfc3RhdGUgPSBpbnN0YW5jZV9zdGF0ZTtcclxuXHRcdFx0XHRDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVsYXRlZE9iamVjdC5vYmplY3RfbmFtZSwgc3BhY2VJZCkuaW5zZXJ0KHJlbGF0ZWRPYmplY3RWYWx1ZSwgeyB2YWxpZGF0ZTogZmFsc2UsIGZpbHRlcjogZmFsc2UgfSlcclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHRcdC8v5riF55CG55Sz6K+35Y2V5LiK6KKr5Yig6Zmk5a2Q6KGo6K6w5b2V5a+55bqU55qE55u45YWz6KGo6K6w5b2VXHJcblx0XHRfLmVhY2godGFibGVNYXAsIGZ1bmN0aW9uICh0YWJsZUlkcywgdGFibGVDb2RlKSB7XHJcblx0XHRcdG9iamVjdENvbGxlY3Rpb24ucmVtb3ZlKHtcclxuXHRcdFx0XHRbcmVsYXRlZE9iamVjdC5mb3JlaWduX2tleV06IG1haW5SZWNvcmRJZCxcclxuXHRcdFx0XHRcImluc3RhbmNlcy5faWRcIjogaW5zSWQsXHJcblx0XHRcdFx0XCJfdGFibGUuX2NvZGVcIjogdGFibGVDb2RlLFxyXG5cdFx0XHRcdFwiX3RhYmxlLl9pZFwiOiB7ICRuaW46IHRhYmxlSWRzIH1cclxuXHRcdFx0fSlcclxuXHRcdH0pXHJcblx0fSk7XHJcblxyXG5cdHRhYmxlSWRzID0gXy5jb21wYWN0KHRhYmxlSWRzKTtcclxuXHJcblxyXG59XHJcblxyXG5JbnN0YW5jZVJlY29yZFF1ZXVlLnNlbmREb2MgPSBmdW5jdGlvbiAoZG9jKSB7XHJcblx0aWYgKEluc3RhbmNlUmVjb3JkUXVldWUuZGVidWcpIHtcclxuXHRcdGNvbnNvbGUubG9nKFwic2VuZERvY1wiKTtcclxuXHRcdGNvbnNvbGUubG9nKGRvYyk7XHJcblx0fVxyXG5cclxuXHR2YXIgaW5zSWQgPSBkb2MuaW5mby5pbnN0YW5jZV9pZCxcclxuXHRcdHJlY29yZHMgPSBkb2MuaW5mby5yZWNvcmRzO1xyXG5cdHZhciBmaWVsZHMgPSB7XHJcblx0XHRmbG93OiAxLFxyXG5cdFx0dmFsdWVzOiAxLFxyXG5cdFx0YXBwbGljYW50OiAxLFxyXG5cdFx0c3BhY2U6IDEsXHJcblx0XHRmb3JtOiAxLFxyXG5cdFx0Zm9ybV92ZXJzaW9uOiAxLFxyXG5cdFx0dHJhY2VzOiAxXHJcblx0fTtcclxuXHRJbnN0YW5jZVJlY29yZFF1ZXVlLnN5bmNJbnNGaWVsZHMuZm9yRWFjaChmdW5jdGlvbiAoZikge1xyXG5cdFx0ZmllbGRzW2ZdID0gMTtcclxuXHR9KVxyXG5cdHZhciBpbnMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2luc3RhbmNlcycpLmZpbmRPbmUoaW5zSWQsIHtcclxuXHRcdGZpZWxkczogZmllbGRzXHJcblx0fSk7XHJcblx0dmFyIHZhbHVlcyA9IGlucy52YWx1ZXMsXHJcblx0XHRzcGFjZUlkID0gaW5zLnNwYWNlO1xyXG5cclxuXHRpZiAocmVjb3JkcyAmJiAhXy5pc0VtcHR5KHJlY29yZHMpKSB7XHJcblx0XHQvLyDmraTmg4XlhrXlsZ7kuo7ku45jcmVhdG9y5Lit5Y+R6LW35a6h5om577yM5oiW6ICF5bey57uP5LuOQXBwc+WQjOatpeWIsOS6hmNyZWF0b3JcclxuXHRcdHZhciBvYmplY3ROYW1lID0gcmVjb3Jkc1swXS5vO1xyXG5cdFx0dmFyIG93ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdvYmplY3Rfd29ya2Zsb3dzJykuZmluZE9uZSh7XHJcblx0XHRcdG9iamVjdF9uYW1lOiBvYmplY3ROYW1lLFxyXG5cdFx0XHRmbG93X2lkOiBpbnMuZmxvd1xyXG5cdFx0fSk7XHJcblx0XHR2YXJcclxuXHRcdFx0b2JqZWN0Q29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3ROYW1lLCBzcGFjZUlkKSxcclxuXHRcdFx0c3luY19hdHRhY2htZW50ID0gb3cuc3luY19hdHRhY2htZW50O1xyXG5cdFx0dmFyIG9iamVjdEluZm8gPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3ROYW1lLCBzcGFjZUlkKTtcclxuXHRcdG9iamVjdENvbGxlY3Rpb24uZmluZCh7XHJcblx0XHRcdF9pZDoge1xyXG5cdFx0XHRcdCRpbjogcmVjb3Jkc1swXS5pZHNcclxuXHRcdFx0fVxyXG5cdFx0fSkuZm9yRWFjaChmdW5jdGlvbiAocmVjb3JkKSB7XHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0dmFyIHN5bmNWYWx1ZXMgPSBJbnN0YW5jZVJlY29yZFF1ZXVlLnN5bmNWYWx1ZXMob3cuZmllbGRfbWFwX2JhY2ssIHZhbHVlcywgaW5zLCBvYmplY3RJbmZvLCBvdy5maWVsZF9tYXBfYmFja19zY3JpcHQsIHJlY29yZClcclxuXHRcdFx0XHR2YXIgc2V0T2JqID0gc3luY1ZhbHVlcy5tYWluT2JqZWN0VmFsdWU7XHJcblxyXG5cdFx0XHRcdHZhciBpbnN0YW5jZV9zdGF0ZSA9IGlucy5zdGF0ZTtcclxuXHRcdFx0XHRpZiAoaW5zLnN0YXRlID09PSAnY29tcGxldGVkJyAmJiBpbnMuZmluYWxfZGVjaXNpb24pIHtcclxuXHRcdFx0XHRcdGluc3RhbmNlX3N0YXRlID0gaW5zLmZpbmFsX2RlY2lzaW9uO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRzZXRPYmpbJ2luc3RhbmNlcy4kLnN0YXRlJ10gPSBzZXRPYmouaW5zdGFuY2Vfc3RhdGUgPSBpbnN0YW5jZV9zdGF0ZTtcclxuXHJcblx0XHRcdFx0b2JqZWN0Q29sbGVjdGlvbi51cGRhdGUoe1xyXG5cdFx0XHRcdFx0X2lkOiByZWNvcmQuX2lkLFxyXG5cdFx0XHRcdFx0J2luc3RhbmNlcy5faWQnOiBpbnNJZFxyXG5cdFx0XHRcdH0sIHtcclxuXHRcdFx0XHRcdCRzZXQ6IHNldE9ialxyXG5cdFx0XHRcdH0pXHJcblxyXG5cdFx0XHRcdHZhciByZWxhdGVkT2JqZWN0cyA9IENyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdHMob3cub2JqZWN0X25hbWUsIHNwYWNlSWQpO1xyXG5cdFx0XHRcdHZhciByZWxhdGVkT2JqZWN0c1ZhbHVlID0gc3luY1ZhbHVlcy5yZWxhdGVkT2JqZWN0c1ZhbHVlO1xyXG5cdFx0XHRcdEluc3RhbmNlUmVjb3JkUXVldWUuc3luY1JlbGF0ZWRPYmplY3RzVmFsdWUocmVjb3JkLl9pZCwgcmVsYXRlZE9iamVjdHMsIHJlbGF0ZWRPYmplY3RzVmFsdWUsIHNwYWNlSWQsIGlucyk7XHJcblxyXG5cclxuXHRcdFx0XHQvLyDku6XmnIDnu4jnlLPor7fljZXpmYTku7bkuLrlh4bvvIzml6fnmoRyZWNvcmTkuK3pmYTku7bliKDpmaRcclxuXHRcdFx0XHRDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2Ntc19maWxlcycpLnJlbW92ZSh7XHJcblx0XHRcdFx0XHQncGFyZW50Jzoge1xyXG5cdFx0XHRcdFx0XHRvOiBvYmplY3ROYW1lLFxyXG5cdFx0XHRcdFx0XHRpZHM6IFtyZWNvcmQuX2lkXVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pXHJcblx0XHRcdFx0dmFyIHJlbW92ZU9sZEZpbGVzID0gZnVuY3Rpb24gKGNiKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gY2ZzLmZpbGVzLnJlbW92ZSh7XHJcblx0XHRcdFx0XHRcdCdtZXRhZGF0YS5yZWNvcmRfaWQnOiByZWNvcmQuX2lkXHJcblx0XHRcdFx0XHR9LCBjYik7XHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHRNZXRlb3Iud3JhcEFzeW5jKHJlbW92ZU9sZEZpbGVzKSgpO1xyXG5cdFx0XHRcdC8vIOWQjOatpeaWsOmZhOS7tlxyXG5cdFx0XHRcdEluc3RhbmNlUmVjb3JkUXVldWUuc3luY0F0dGFjaChzeW5jX2F0dGFjaG1lbnQsIGluc0lkLCByZWNvcmQuc3BhY2UsIHJlY29yZC5faWQsIG9iamVjdE5hbWUpO1xyXG5cclxuXHRcdFx0XHQvLyDmiafooYzlhazlvI9cclxuXHRcdFx0XHRydW5RdW90ZWQob2JqZWN0TmFtZSwgcmVjb3JkLl9pZCk7XHJcblx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XHJcblx0XHRcdFx0Y29uc29sZS5lcnJvcihlcnJvci5zdGFjayk7XHJcblx0XHRcdFx0b2JqZWN0Q29sbGVjdGlvbi51cGRhdGUoe1xyXG5cdFx0XHRcdFx0X2lkOiByZWNvcmQuX2lkLFxyXG5cdFx0XHRcdFx0J2luc3RhbmNlcy5faWQnOiBpbnNJZFxyXG5cdFx0XHRcdH0sIHtcclxuXHRcdFx0XHRcdCRzZXQ6IHtcclxuXHRcdFx0XHRcdFx0J2luc3RhbmNlcy4kLnN0YXRlJzogJ3BlbmRpbmcnLFxyXG5cdFx0XHRcdFx0XHQnaW5zdGFuY2Vfc3RhdGUnOiAncGVuZGluZydcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KVxyXG5cclxuXHRcdFx0XHRDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2Ntc19maWxlcycpLnJlbW92ZSh7XHJcblx0XHRcdFx0XHQncGFyZW50Jzoge1xyXG5cdFx0XHRcdFx0XHRvOiBvYmplY3ROYW1lLFxyXG5cdFx0XHRcdFx0XHRpZHM6IFtyZWNvcmQuX2lkXVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pXHJcblx0XHRcdFx0Y2ZzLmZpbGVzLnJlbW92ZSh7XHJcblx0XHRcdFx0XHQnbWV0YWRhdGEucmVjb3JkX2lkJzogcmVjb3JkLl9pZFxyXG5cdFx0XHRcdH0pXHJcblxyXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihlcnJvcik7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9KVxyXG5cdH0gZWxzZSB7XHJcblx0XHQvLyDmraTmg4XlhrXlsZ7kuo7ku45hcHBz5Lit5Y+R6LW35a6h5om5XHJcblx0XHRDcmVhdG9yLmdldENvbGxlY3Rpb24oJ29iamVjdF93b3JrZmxvd3MnKS5maW5kKHtcclxuXHRcdFx0Zmxvd19pZDogaW5zLmZsb3dcclxuXHRcdH0pLmZvckVhY2goZnVuY3Rpb24gKG93KSB7XHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0dmFyXHJcblx0XHRcdFx0XHRvYmplY3RDb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG93Lm9iamVjdF9uYW1lLCBzcGFjZUlkKSxcclxuXHRcdFx0XHRcdHN5bmNfYXR0YWNobWVudCA9IG93LnN5bmNfYXR0YWNobWVudCxcclxuXHRcdFx0XHRcdG5ld1JlY29yZElkID0gb2JqZWN0Q29sbGVjdGlvbi5fbWFrZU5ld0lEKCksXHJcblx0XHRcdFx0XHRvYmplY3ROYW1lID0gb3cub2JqZWN0X25hbWU7XHJcblxyXG5cdFx0XHRcdHZhciBvYmplY3RJbmZvID0gQ3JlYXRvci5nZXRPYmplY3Qob3cub2JqZWN0X25hbWUsIHNwYWNlSWQpO1xyXG5cdFx0XHRcdHZhciBzeW5jVmFsdWVzID0gSW5zdGFuY2VSZWNvcmRRdWV1ZS5zeW5jVmFsdWVzKG93LmZpZWxkX21hcF9iYWNrLCB2YWx1ZXMsIGlucywgb2JqZWN0SW5mbywgb3cuZmllbGRfbWFwX2JhY2tfc2NyaXB0KTtcclxuXHRcdFx0XHR2YXIgbmV3T2JqID0gc3luY1ZhbHVlcy5tYWluT2JqZWN0VmFsdWU7XHJcblxyXG5cdFx0XHRcdG5ld09iai5faWQgPSBuZXdSZWNvcmRJZDtcclxuXHRcdFx0XHRuZXdPYmouc3BhY2UgPSBzcGFjZUlkO1xyXG5cdFx0XHRcdG5ld09iai5uYW1lID0gbmV3T2JqLm5hbWUgfHwgaW5zLm5hbWU7XHJcblxyXG5cdFx0XHRcdHZhciBpbnN0YW5jZV9zdGF0ZSA9IGlucy5zdGF0ZTtcclxuXHRcdFx0XHRpZiAoaW5zLnN0YXRlID09PSAnY29tcGxldGVkJyAmJiBpbnMuZmluYWxfZGVjaXNpb24pIHtcclxuXHRcdFx0XHRcdGluc3RhbmNlX3N0YXRlID0gaW5zLmZpbmFsX2RlY2lzaW9uO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRuZXdPYmouaW5zdGFuY2VzID0gW3tcclxuXHRcdFx0XHRcdF9pZDogaW5zSWQsXHJcblx0XHRcdFx0XHRzdGF0ZTogaW5zdGFuY2Vfc3RhdGVcclxuXHRcdFx0XHR9XTtcclxuXHRcdFx0XHRuZXdPYmouaW5zdGFuY2Vfc3RhdGUgPSBpbnN0YW5jZV9zdGF0ZTtcclxuXHJcblx0XHRcdFx0bmV3T2JqLm93bmVyID0gaW5zLmFwcGxpY2FudDtcclxuXHRcdFx0XHRuZXdPYmouY3JlYXRlZF9ieSA9IGlucy5hcHBsaWNhbnQ7XHJcblx0XHRcdFx0bmV3T2JqLm1vZGlmaWVkX2J5ID0gaW5zLmFwcGxpY2FudDtcclxuXHRcdFx0XHR2YXIgciA9IG9iamVjdENvbGxlY3Rpb24uaW5zZXJ0KG5ld09iaik7XHJcblx0XHRcdFx0aWYgKHIpIHtcclxuXHRcdFx0XHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbignaW5zdGFuY2VzJykudXBkYXRlKGlucy5faWQsIHtcclxuXHRcdFx0XHRcdFx0JHB1c2g6IHtcclxuXHRcdFx0XHRcdFx0XHRyZWNvcmRfaWRzOiB7XHJcblx0XHRcdFx0XHRcdFx0XHRvOiBvYmplY3ROYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0aWRzOiBbbmV3UmVjb3JkSWRdXHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0dmFyIHJlbGF0ZWRPYmplY3RzID0gQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0cyhvdy5vYmplY3RfbmFtZSwgc3BhY2VJZCk7XHJcblx0XHRcdFx0XHR2YXIgcmVsYXRlZE9iamVjdHNWYWx1ZSA9IHN5bmNWYWx1ZXMucmVsYXRlZE9iamVjdHNWYWx1ZTtcclxuXHRcdFx0XHRcdEluc3RhbmNlUmVjb3JkUXVldWUuc3luY1JlbGF0ZWRPYmplY3RzVmFsdWUobmV3UmVjb3JkSWQsIHJlbGF0ZWRPYmplY3RzLCByZWxhdGVkT2JqZWN0c1ZhbHVlLCBzcGFjZUlkLCBpbnMpO1xyXG5cdFx0XHRcdFx0Ly8gd29ya2Zsb3fph4zlj5HotbflrqHmibnlkI7vvIzlkIzmraXml7bkuZ/lj6/ku6Xkv67mlLnnm7jlhbPooajnmoTlrZfmrrXlgLwgIzExODNcclxuXHRcdFx0XHRcdHZhciByZWNvcmQgPSBvYmplY3RDb2xsZWN0aW9uLmZpbmRPbmUobmV3UmVjb3JkSWQpO1xyXG5cdFx0XHRcdFx0SW5zdGFuY2VSZWNvcmRRdWV1ZS5zeW5jVmFsdWVzKG93LmZpZWxkX21hcF9iYWNrLCB2YWx1ZXMsIGlucywgb2JqZWN0SW5mbywgb3cuZmllbGRfbWFwX2JhY2tfc2NyaXB0LCByZWNvcmQpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Ly8g6ZmE5Lu25ZCM5q2lXHJcblx0XHRcdFx0SW5zdGFuY2VSZWNvcmRRdWV1ZS5zeW5jQXR0YWNoKHN5bmNfYXR0YWNobWVudCwgaW5zSWQsIHNwYWNlSWQsIG5ld1JlY29yZElkLCBvYmplY3ROYW1lKTtcclxuXHJcblx0XHRcdFx0Ly8g5omn6KGM5YWs5byPXHJcblx0XHRcdFx0cnVuUXVvdGVkKG9iamVjdE5hbWUsIG5ld1JlY29yZElkKTtcclxuXHRcdFx0fSBjYXRjaCAoZXJyb3IpIHtcclxuXHRcdFx0XHRjb25zb2xlLmVycm9yKGVycm9yLnN0YWNrKTtcclxuXHJcblx0XHRcdFx0b2JqZWN0Q29sbGVjdGlvbi5yZW1vdmUoe1xyXG5cdFx0XHRcdFx0X2lkOiBuZXdSZWNvcmRJZCxcclxuXHRcdFx0XHRcdHNwYWNlOiBzcGFjZUlkXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKCdpbnN0YW5jZXMnKS51cGRhdGUoaW5zLl9pZCwge1xyXG5cdFx0XHRcdFx0JHB1bGw6IHtcclxuXHRcdFx0XHRcdFx0cmVjb3JkX2lkczoge1xyXG5cdFx0XHRcdFx0XHRcdG86IG9iamVjdE5hbWUsXHJcblx0XHRcdFx0XHRcdFx0aWRzOiBbbmV3UmVjb3JkSWRdXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KVxyXG5cdFx0XHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbignY21zX2ZpbGVzJykucmVtb3ZlKHtcclxuXHRcdFx0XHRcdCdwYXJlbnQnOiB7XHJcblx0XHRcdFx0XHRcdG86IG9iamVjdE5hbWUsXHJcblx0XHRcdFx0XHRcdGlkczogW25ld1JlY29yZElkXVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pXHJcblx0XHRcdFx0Y2ZzLmZpbGVzLnJlbW92ZSh7XHJcblx0XHRcdFx0XHQnbWV0YWRhdGEucmVjb3JkX2lkJzogbmV3UmVjb3JkSWRcclxuXHRcdFx0XHR9KVxyXG5cclxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoZXJyb3IpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fSlcclxuXHR9XHJcblxyXG5cdGlmIChkb2MuX2lkKSB7XHJcblx0XHRJbnN0YW5jZVJlY29yZFF1ZXVlLmNvbGxlY3Rpb24udXBkYXRlKGRvYy5faWQsIHtcclxuXHRcdFx0JHNldDoge1xyXG5cdFx0XHRcdCdpbmZvLnN5bmNfZGF0ZSc6IG5ldyBEYXRlKClcclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHR9XHJcblxyXG59IiwiTWV0ZW9yLnN0YXJ0dXAgLT5cclxuXHRpZiBNZXRlb3Iuc2V0dGluZ3MuY3Jvbj8uaW5zdGFuY2VyZWNvcmRxdWV1ZV9pbnRlcnZhbFxyXG5cdFx0SW5zdGFuY2VSZWNvcmRRdWV1ZS5Db25maWd1cmVcclxuXHRcdFx0c2VuZEludGVydmFsOiBNZXRlb3Iuc2V0dGluZ3MuY3Jvbi5pbnN0YW5jZXJlY29yZHF1ZXVlX2ludGVydmFsXHJcblx0XHRcdHNlbmRCYXRjaFNpemU6IDEwXHJcblx0XHRcdGtlZXBEb2NzOiB0cnVlXHJcbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICB2YXIgcmVmO1xuICBpZiAoKHJlZiA9IE1ldGVvci5zZXR0aW5ncy5jcm9uKSAhPSBudWxsID8gcmVmLmluc3RhbmNlcmVjb3JkcXVldWVfaW50ZXJ2YWwgOiB2b2lkIDApIHtcbiAgICByZXR1cm4gSW5zdGFuY2VSZWNvcmRRdWV1ZS5Db25maWd1cmUoe1xuICAgICAgc2VuZEludGVydmFsOiBNZXRlb3Iuc2V0dGluZ3MuY3Jvbi5pbnN0YW5jZXJlY29yZHF1ZXVlX2ludGVydmFsLFxuICAgICAgc2VuZEJhdGNoU2l6ZTogMTAsXG4gICAgICBrZWVwRG9jczogdHJ1ZVxuICAgIH0pO1xuICB9XG59KTtcbiIsImltcG9ydCB7IGNoZWNrTnBtVmVyc2lvbnMgfSBmcm9tICdtZXRlb3IvdG1lYXNkYXk6Y2hlY2stbnBtLXZlcnNpb25zJztcclxuY2hlY2tOcG1WZXJzaW9ucyh7XHJcblx0XCJldmFsXCI6IFwiXjAuMS4yXCJcclxufSwgJ3N0ZWVkb3M6aW5zdGFuY2UtcmVjb3JkLXF1ZXVlJyk7XHJcbiJdfQ==
