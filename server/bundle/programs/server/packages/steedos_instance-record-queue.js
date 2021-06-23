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
var Promise = Package.promise.Promise;
var meteorInstall = Package.modules.meteorInstall;

/* Package-scope variables */
var InstanceRecordQueue, tableIds, __coffeescriptShare;

var require = meteorInstall({"node_modules":{"meteor":{"steedos:instance-record-queue":{"lib":{"common":{"main.js":function module(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_instance-record-queue/lib/common/main.js                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
InstanceRecordQueue = new EventState();
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"docs.js":function module(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_instance-record-queue/lib/common/docs.js                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"server":{"api.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_instance-record-queue/lib/server/api.js                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
!function (module1) {
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
}.call(this, module);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"server":{"startup.coffee":function module(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_instance-record-queue/server/startup.coffee                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"checkNpm.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_instance-record-queue/server/checkNpm.js                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczppbnN0YW5jZS1yZWNvcmQtcXVldWUvbGliL2NvbW1vbi9tYWluLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmluc3RhbmNlLXJlY29yZC1xdWV1ZS9saWIvY29tbW9uL2RvY3MuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6aW5zdGFuY2UtcmVjb3JkLXF1ZXVlL2xpYi9zZXJ2ZXIvYXBpLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2luc3RhbmNlLXJlY29yZC1xdWV1ZS9zZXJ2ZXIvc3RhcnR1cC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9zdGFydHVwLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczppbnN0YW5jZS1yZWNvcmQtcXVldWUvc2VydmVyL2NoZWNrTnBtLmpzIl0sIm5hbWVzIjpbIkluc3RhbmNlUmVjb3JkUXVldWUiLCJFdmVudFN0YXRlIiwiY29sbGVjdGlvbiIsImRiIiwiaW5zdGFuY2VfcmVjb3JkX3F1ZXVlIiwiTW9uZ28iLCJDb2xsZWN0aW9uIiwiX3ZhbGlkYXRlRG9jdW1lbnQiLCJkb2MiLCJjaGVjayIsImluZm8iLCJPYmplY3QiLCJzZW50IiwiTWF0Y2giLCJPcHRpb25hbCIsIkJvb2xlYW4iLCJzZW5kaW5nIiwiSW50ZWdlciIsImNyZWF0ZWRBdCIsIkRhdGUiLCJjcmVhdGVkQnkiLCJPbmVPZiIsIlN0cmluZyIsInNlbmQiLCJvcHRpb25zIiwiY3VycmVudFVzZXIiLCJNZXRlb3IiLCJpc0NsaWVudCIsInVzZXJJZCIsImlzU2VydmVyIiwiXyIsImV4dGVuZCIsInRlc3QiLCJwaWNrIiwiaW5zZXJ0Iiwib2JqZWN0cWwiLCJyZXF1aXJlIiwicnVuUXVvdGVkIiwib2JqZWN0TmFtZSIsInJlY29yZElkIiwicnVuUXVvdGVkQnlPYmplY3RGaWVsZEZvcm11bGFzIiwicnVuUXVvdGVkQnlPYmplY3RGaWVsZFN1bW1hcmllcyIsIl9ldmFsIiwiaXNDb25maWd1cmVkIiwic2VuZFdvcmtlciIsInRhc2siLCJpbnRlcnZhbCIsImRlYnVnIiwiY29uc29sZSIsImxvZyIsInNldEludGVydmFsIiwiZXJyb3IiLCJtZXNzYWdlIiwiQ29uZmlndXJlIiwic2VsZiIsInNlbmRUaW1lb3V0IiwiRXJyb3IiLCJfcXVlcnlTZW5kIiwic2VuZERvYyIsIl9pZCIsInNlcnZlclNlbmQiLCJpc1NlbmRpbmdEb2MiLCJzZW5kSW50ZXJ2YWwiLCJfZW5zdXJlSW5kZXgiLCJub3ciLCJ0aW1lb3V0QXQiLCJyZXNlcnZlZCIsInVwZGF0ZSIsIiRsdCIsIiRzZXQiLCJyZXN1bHQiLCJrZWVwRG9jcyIsInJlbW92ZSIsInNlbnRBdCIsImJhdGNoU2l6ZSIsInNlbmRCYXRjaFNpemUiLCJwZW5kaW5nRG9jcyIsImZpbmQiLCIkYW5kIiwiZXJyTXNnIiwiJGV4aXN0cyIsInNvcnQiLCJsaW1pdCIsImZvckVhY2giLCJzdGFjayIsInN5bmNBdHRhY2giLCJzeW5jX2F0dGFjaG1lbnQiLCJpbnNJZCIsInNwYWNlSWQiLCJuZXdSZWNvcmRJZCIsImNmcyIsImluc3RhbmNlcyIsImYiLCJoYXNTdG9yZWQiLCJuZXdGaWxlIiwiRlMiLCJGaWxlIiwiY21zRmlsZUlkIiwiQ3JlYXRvciIsImdldENvbGxlY3Rpb24iLCJfbWFrZU5ld0lEIiwiYXR0YWNoRGF0YSIsImNyZWF0ZVJlYWRTdHJlYW0iLCJ0eXBlIiwib3JpZ2luYWwiLCJlcnIiLCJyZWFzb24iLCJuYW1lIiwic2l6ZSIsIm1ldGFkYXRhIiwib3duZXIiLCJvd25lcl9uYW1lIiwic3BhY2UiLCJyZWNvcmRfaWQiLCJvYmplY3RfbmFtZSIsInBhcmVudCIsImZpbGVzIiwid3JhcEFzeW5jIiwiY2IiLCJvbmNlIiwic3RvcmVOYW1lIiwibyIsImlkcyIsImV4dGVudGlvbiIsImV4dGVuc2lvbiIsInZlcnNpb25zIiwiY3JlYXRlZF9ieSIsIm1vZGlmaWVkX2J5IiwicGFyZW50cyIsImluY2x1ZGVzIiwicHVzaCIsImN1cnJlbnQiLCIkYWRkVG9TZXQiLCJzeW5jSW5zRmllbGRzIiwic3luY1ZhbHVlcyIsImZpZWxkX21hcF9iYWNrIiwidmFsdWVzIiwiaW5zIiwib2JqZWN0SW5mbyIsImZpZWxkX21hcF9iYWNrX3NjcmlwdCIsInJlY29yZCIsIm9iaiIsInRhYmxlRmllbGRDb2RlcyIsInRhYmxlRmllbGRNYXAiLCJ0YWJsZVRvUmVsYXRlZE1hcCIsImZvcm0iLCJmaW5kT25lIiwiZm9ybUZpZWxkcyIsImZvcm1fdmVyc2lvbiIsImZpZWxkcyIsImZvcm1WZXJzaW9uIiwiaGlzdG9yeXMiLCJoIiwib2JqZWN0RmllbGRzIiwib2JqZWN0RmllbGRLZXlzIiwia2V5cyIsInJlbGF0ZWRPYmplY3RzIiwiZ2V0UmVsYXRlZE9iamVjdHMiLCJyZWxhdGVkT2JqZWN0c0tleXMiLCJwbHVjayIsImZvcm1UYWJsZUZpZWxkcyIsImZpbHRlciIsImZvcm1GaWVsZCIsImZvcm1UYWJsZUZpZWxkc0NvZGUiLCJnZXRSZWxhdGVkT2JqZWN0RmllbGQiLCJrZXkiLCJyZWxhdGVkT2JqZWN0c0tleSIsInN0YXJ0c1dpdGgiLCJnZXRGb3JtVGFibGVGaWVsZCIsImZvcm1UYWJsZUZpZWxkQ29kZSIsImdldEZvcm1GaWVsZCIsIl9mb3JtRmllbGRzIiwiX2ZpZWxkQ29kZSIsImVhY2giLCJmZiIsImNvZGUiLCJmbSIsInJlbGF0ZWRPYmplY3RGaWVsZCIsIm9iamVjdF9maWVsZCIsImZvcm1UYWJsZUZpZWxkIiwid29ya2Zsb3dfZmllbGQiLCJvVGFibGVDb2RlIiwic3BsaXQiLCJvVGFibGVGaWVsZENvZGUiLCJ0YWJsZVRvUmVsYXRlZE1hcEtleSIsIndUYWJsZUNvZGUiLCJpbmRleE9mIiwiaGFzT3duUHJvcGVydHkiLCJpc0FycmF5IiwiSlNPTiIsInN0cmluZ2lmeSIsIndvcmtmbG93X3RhYmxlX2ZpZWxkX2NvZGUiLCJvYmplY3RfdGFibGVfZmllbGRfY29kZSIsIndGaWVsZCIsIm9GaWVsZCIsInJlZmVyZW5jZV90byIsImlzRW1wdHkiLCJtdWx0aXBsZSIsImlzX211bHRpc2VsZWN0IiwiY29tcGFjdCIsImlkIiwiaXNTdHJpbmciLCJvQ29sbGVjdGlvbiIsInJlZmVyT2JqZWN0IiwiZ2V0T2JqZWN0IiwicmVmZXJEYXRhIiwibmFtZUZpZWxkS2V5IiwiTkFNRV9GSUVMRF9LRVkiLCJzZWxlY3RvciIsInRtcF9maWVsZF92YWx1ZSIsInRlbU9iakZpZWxkcyIsImxlbmd0aCIsIm9iakZpZWxkIiwicmVmZXJPYmpGaWVsZCIsInJlZmVyU2V0T2JqIiwiaW5zRmllbGQiLCJ1bmlxIiwidGZjIiwiYyIsInBhcnNlIiwidHIiLCJuZXdUciIsInYiLCJrIiwidGZtIiwib1RkQ29kZSIsInJlbGF0ZWRPYmpzIiwiZ2V0UmVsYXRlZEZpZWxkVmFsdWUiLCJ2YWx1ZUtleSIsInJlZHVjZSIsIngiLCJtYXAiLCJ0YWJsZUNvZGUiLCJfRlJPTV9UQUJMRV9DT0RFIiwid2FybiIsInJlbGF0ZWRPYmplY3ROYW1lIiwicmVsYXRlZE9iamVjdFZhbHVlcyIsInJlbGF0ZWRPYmplY3QiLCJ0YWJsZVZhbHVlSXRlbSIsInJlbGF0ZWRPYmplY3RWYWx1ZSIsImZpZWxkS2V5IiwicmVsYXRlZE9iamVjdEZpZWxkVmFsdWUiLCJmb3JtRmllbGRLZXkiLCJfY29kZSIsImV2YWxGaWVsZE1hcEJhY2tTY3JpcHQiLCJmaWx0ZXJPYmoiLCJtYWluT2JqZWN0VmFsdWUiLCJyZWxhdGVkT2JqZWN0c1ZhbHVlIiwic2NyaXB0IiwiZnVuYyIsImlzT2JqZWN0Iiwic3luY1JlbGF0ZWRPYmplY3RzVmFsdWUiLCJtYWluUmVjb3JkSWQiLCJvYmplY3RDb2xsZWN0aW9uIiwidGFibGVNYXAiLCJ0YWJsZV9pZCIsIl90YWJsZSIsInRhYmxlX2NvZGUiLCJvbGRSZWxhdGVkUmVjb3JkIiwiZm9yZWlnbl9rZXkiLCJhcHBsaWNhbnQiLCJpbnN0YW5jZV9zdGF0ZSIsInN0YXRlIiwiZmluYWxfZGVjaXNpb24iLCJ2YWxpZGF0ZSIsInRhYmxlSWRzIiwiJG5pbiIsImluc3RhbmNlX2lkIiwicmVjb3JkcyIsImZsb3ciLCJ0cmFjZXMiLCJvdyIsImZsb3dfaWQiLCIkaW4iLCJzZXRPYmoiLCJyZW1vdmVPbGRGaWxlcyIsIm5ld09iaiIsInIiLCIkcHVzaCIsInJlY29yZF9pZHMiLCIkcHVsbCIsInN0YXJ0dXAiLCJyZWYiLCJzZXR0aW5ncyIsImNyb24iLCJpbnN0YW5jZXJlY29yZHF1ZXVlX2ludGVydmFsIiwiY2hlY2tOcG1WZXJzaW9ucyIsIm1vZHVsZSIsImxpbmsiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBQSxtQkFBbUIsR0FBRyxJQUFJQyxVQUFKLEVBQXRCLEM7Ozs7Ozs7Ozs7O0FDQUFELG1CQUFtQixDQUFDRSxVQUFwQixHQUFpQ0MsRUFBRSxDQUFDQyxxQkFBSCxHQUEyQixJQUFJQyxLQUFLLENBQUNDLFVBQVYsQ0FBcUIsdUJBQXJCLENBQTVEOztBQUVBLElBQUlDLGlCQUFpQixHQUFHLFVBQVNDLEdBQVQsRUFBYztBQUVyQ0MsT0FBSyxDQUFDRCxHQUFELEVBQU07QUFDVkUsUUFBSSxFQUFFQyxNQURJO0FBRVZDLFFBQUksRUFBRUMsS0FBSyxDQUFDQyxRQUFOLENBQWVDLE9BQWYsQ0FGSTtBQUdWQyxXQUFPLEVBQUVILEtBQUssQ0FBQ0MsUUFBTixDQUFlRCxLQUFLLENBQUNJLE9BQXJCLENBSEM7QUFJVkMsYUFBUyxFQUFFQyxJQUpEO0FBS1ZDLGFBQVMsRUFBRVAsS0FBSyxDQUFDUSxLQUFOLENBQVlDLE1BQVosRUFBb0IsSUFBcEI7QUFMRCxHQUFOLENBQUw7QUFRQSxDQVZEOztBQVlBdEIsbUJBQW1CLENBQUN1QixJQUFwQixHQUEyQixVQUFTQyxPQUFULEVBQWtCO0FBQzVDLE1BQUlDLFdBQVcsR0FBR0MsTUFBTSxDQUFDQyxRQUFQLElBQW1CRCxNQUFNLENBQUNFLE1BQTFCLElBQW9DRixNQUFNLENBQUNFLE1BQVAsRUFB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QUFpUSxRQUFBLENBQUFDLElBQUEsWUFBQUYsSUFBeUJHLDRCQUF6QixHQUF5QixNQUF6QjtBQ0VHLFdEREY3UixvQkFBb0JxRCxTQUFwQixDQUNDO0FBQUFTLG9CQUFjcEMsT0FBT2lRLFFBQVAsQ0FBZ0JDLElBQWhCLENBQXFCQyw0QkFBbkM7QUFDQWxOLHFCQUFlLEVBRGY7QUFFQUosZ0JBQVU7QUFGVixLQURELENDQ0U7QUFLRDtBRFJILEc7Ozs7Ozs7Ozs7O0FFQUEsSUFBSXVOLGdCQUFKO0FBQXFCQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxvQ0FBWixFQUFpRDtBQUFDRixrQkFBZ0IsQ0FBQ2hFLENBQUQsRUFBRztBQUFDZ0Usb0JBQWdCLEdBQUNoRSxDQUFqQjtBQUFtQjs7QUFBeEMsQ0FBakQsRUFBMkYsQ0FBM0Y7QUFDckJnRSxnQkFBZ0IsQ0FBQztBQUNoQixVQUFRO0FBRFEsQ0FBRCxFQUViLCtCQUZhLENBQWhCLEMiLCJmaWxlIjoiL3BhY2thZ2VzL3N0ZWVkb3NfaW5zdGFuY2UtcmVjb3JkLXF1ZXVlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiSW5zdGFuY2VSZWNvcmRRdWV1ZSA9IG5ldyBFdmVudFN0YXRlKCk7IiwiSW5zdGFuY2VSZWNvcmRRdWV1ZS5jb2xsZWN0aW9uID0gZGIuaW5zdGFuY2VfcmVjb3JkX3F1ZXVlID0gbmV3IE1vbmdvLkNvbGxlY3Rpb24oJ2luc3RhbmNlX3JlY29yZF9xdWV1ZScpO1xyXG5cclxudmFyIF92YWxpZGF0ZURvY3VtZW50ID0gZnVuY3Rpb24oZG9jKSB7XHJcblxyXG5cdGNoZWNrKGRvYywge1xyXG5cdFx0aW5mbzogT2JqZWN0LFxyXG5cdFx0c2VudDogTWF0Y2guT3B0aW9uYWwoQm9vbGVhbiksXHJcblx0XHRzZW5kaW5nOiBNYXRjaC5PcHRpb25hbChNYXRjaC5JbnRlZ2VyKSxcclxuXHRcdGNyZWF0ZWRBdDogRGF0ZSxcclxuXHRcdGNyZWF0ZWRCeTogTWF0Y2guT25lT2YoU3RyaW5nLCBudWxsKVxyXG5cdH0pO1xyXG5cclxufTtcclxuXHJcbkluc3RhbmNlUmVjb3JkUXVldWUuc2VuZCA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuXHR2YXIgY3VycmVudFVzZXIgPSBNZXRlb3IuaXNDbGllbnQgJiYgTWV0ZW9yLnVzZXJJZCAmJiBNZXRlb3IudXNlcklkKCkgfHwgTWV0ZW9yLmlzU2VydmVyICYmIChvcHRpb25zLmNyZWF0ZWRCeSB8fCAnPFNFUlZFUj4nKSB8fCBudWxsXHJcblx0dmFyIGRvYyA9IF8uZXh0ZW5kKHtcclxuXHRcdGNyZWF0ZWRBdDogbmV3IERhdGUoKSxcclxuXHRcdGNyZWF0ZWRCeTogY3VycmVudFVzZXJcclxuXHR9KTtcclxuXHJcblx0aWYgKE1hdGNoLnRlc3Qob3B0aW9ucywgT2JqZWN0KSkge1xyXG5cdFx0ZG9jLmluZm8gPSBfLnBpY2sob3B0aW9ucywgJ2luc3RhbmNlX2lkJywgJ3JlY29yZHMnLCAnc3luY19kYXRlJywgJ2luc3RhbmNlX2ZpbmlzaF9kYXRlJywgJ3N0ZXBfbmFtZScpO1xyXG5cdH1cclxuXHJcblx0ZG9jLnNlbnQgPSBmYWxzZTtcclxuXHRkb2Muc2VuZGluZyA9IDA7XHJcblxyXG5cdF92YWxpZGF0ZURvY3VtZW50KGRvYyk7XHJcblxyXG5cdHJldHVybiBJbnN0YW5jZVJlY29yZFF1ZXVlLmNvbGxlY3Rpb24uaW5zZXJ0KGRvYyk7XHJcbn07IiwiY29uc3Qgb2JqZWN0cWwgPSByZXF1aXJlKCdAc3RlZWRvcy9vYmplY3RxbCcpO1xyXG52YXIgcnVuUXVvdGVkID0gZnVuY3Rpb24gKG9iamVjdE5hbWUsIHJlY29yZElkKSB7XHJcblx0b2JqZWN0cWwucnVuUXVvdGVkQnlPYmplY3RGaWVsZEZvcm11bGFzKG9iamVjdE5hbWUsIHJlY29yZElkKTtcclxuXHRvYmplY3RxbC5ydW5RdW90ZWRCeU9iamVjdEZpZWxkU3VtbWFyaWVzKG9iamVjdE5hbWUsIHJlY29yZElkKTtcclxufVxyXG5cclxudmFyIF9ldmFsID0gcmVxdWlyZSgnZXZhbCcpO1xyXG52YXIgaXNDb25maWd1cmVkID0gZmFsc2U7XHJcbnZhciBzZW5kV29ya2VyID0gZnVuY3Rpb24gKHRhc2ssIGludGVydmFsKSB7XHJcblxyXG5cdGlmIChJbnN0YW5jZVJlY29yZFF1ZXVlLmRlYnVnKSB7XHJcblx0XHRjb25zb2xlLmxvZygnSW5zdGFuY2VSZWNvcmRRdWV1ZTogU2VuZCB3b3JrZXIgc3RhcnRlZCwgdXNpbmcgaW50ZXJ2YWw6ICcgKyBpbnRlcnZhbCk7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gTWV0ZW9yLnNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdHRhc2soKTtcclxuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKCdJbnN0YW5jZVJlY29yZFF1ZXVlOiBFcnJvciB3aGlsZSBzZW5kaW5nOiAnICsgZXJyb3IubWVzc2FnZSk7XHJcblx0XHR9XHJcblx0fSwgaW50ZXJ2YWwpO1xyXG59O1xyXG5cclxuLypcclxuXHRvcHRpb25zOiB7XHJcblx0XHQvLyBDb250cm9scyB0aGUgc2VuZGluZyBpbnRlcnZhbFxyXG5cdFx0c2VuZEludGVydmFsOiBNYXRjaC5PcHRpb25hbChOdW1iZXIpLFxyXG5cdFx0Ly8gQ29udHJvbHMgdGhlIHNlbmRpbmcgYmF0Y2ggc2l6ZSBwZXIgaW50ZXJ2YWxcclxuXHRcdHNlbmRCYXRjaFNpemU6IE1hdGNoLk9wdGlvbmFsKE51bWJlciksXHJcblx0XHQvLyBBbGxvdyBvcHRpb25hbCBrZWVwaW5nIG5vdGlmaWNhdGlvbnMgaW4gY29sbGVjdGlvblxyXG5cdFx0a2VlcERvY3M6IE1hdGNoLk9wdGlvbmFsKEJvb2xlYW4pXHJcblx0fVxyXG4qL1xyXG5JbnN0YW5jZVJlY29yZFF1ZXVlLkNvbmZpZ3VyZSA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcblx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cdG9wdGlvbnMgPSBfLmV4dGVuZCh7XHJcblx0XHRzZW5kVGltZW91dDogNjAwMDAsIC8vIFRpbWVvdXQgcGVyaW9kXHJcblx0fSwgb3B0aW9ucyk7XHJcblxyXG5cdC8vIEJsb2NrIG11bHRpcGxlIGNhbGxzXHJcblx0aWYgKGlzQ29uZmlndXJlZCkge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKCdJbnN0YW5jZVJlY29yZFF1ZXVlLkNvbmZpZ3VyZSBzaG91bGQgbm90IGJlIGNhbGxlZCBtb3JlIHRoYW4gb25jZSEnKTtcclxuXHR9XHJcblxyXG5cdGlzQ29uZmlndXJlZCA9IHRydWU7XHJcblxyXG5cdC8vIEFkZCBkZWJ1ZyBpbmZvXHJcblx0aWYgKEluc3RhbmNlUmVjb3JkUXVldWUuZGVidWcpIHtcclxuXHRcdGNvbnNvbGUubG9nKCdJbnN0YW5jZVJlY29yZFF1ZXVlLkNvbmZpZ3VyZScsIG9wdGlvbnMpO1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHQvLyBVbml2ZXJzYWwgc2VuZCBmdW5jdGlvblxyXG5cdHZhciBfcXVlcnlTZW5kID0gZnVuY3Rpb24gKGRvYykge1xyXG5cclxuXHRcdGlmIChJbnN0YW5jZVJlY29yZFF1ZXVlLnNlbmREb2MpIHtcclxuXHRcdFx0SW5zdGFuY2VSZWNvcmRRdWV1ZS5zZW5kRG9jKGRvYyk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0ZG9jOiBbZG9jLl9pZF1cclxuXHRcdH07XHJcblx0fTtcclxuXHJcblx0c2VsZi5zZXJ2ZXJTZW5kID0gZnVuY3Rpb24gKGRvYykge1xyXG5cdFx0ZG9jID0gZG9jIHx8IHt9O1xyXG5cdFx0cmV0dXJuIF9xdWVyeVNlbmQoZG9jKTtcclxuXHR9O1xyXG5cclxuXHJcblx0Ly8gVGhpcyBpbnRlcnZhbCB3aWxsIGFsbG93IG9ubHkgb25lIGRvYyB0byBiZSBzZW50IGF0IGEgdGltZSwgaXRcclxuXHQvLyB3aWxsIGNoZWNrIGZvciBuZXcgZG9jcyBhdCBldmVyeSBgb3B0aW9ucy5zZW5kSW50ZXJ2YWxgXHJcblx0Ly8gKGRlZmF1bHQgaW50ZXJ2YWwgaXMgMTUwMDAgbXMpXHJcblx0Ly9cclxuXHQvLyBJdCBsb29rcyBpbiBkb2NzIGNvbGxlY3Rpb24gdG8gc2VlIGlmIHRoZXJlcyBhbnkgcGVuZGluZ1xyXG5cdC8vIGRvY3MsIGlmIHNvIGl0IHdpbGwgdHJ5IHRvIHJlc2VydmUgdGhlIHBlbmRpbmcgZG9jLlxyXG5cdC8vIElmIHN1Y2Nlc3NmdWxseSByZXNlcnZlZCB0aGUgc2VuZCBpcyBzdGFydGVkLlxyXG5cdC8vXHJcblx0Ly8gSWYgZG9jLnF1ZXJ5IGlzIHR5cGUgc3RyaW5nLCBpdCdzIGFzc3VtZWQgdG8gYmUgYSBqc29uIHN0cmluZ1xyXG5cdC8vIHZlcnNpb24gb2YgdGhlIHF1ZXJ5IHNlbGVjdG9yLiBNYWtpbmcgaXQgYWJsZSB0byBjYXJyeSBgJGAgcHJvcGVydGllcyBpblxyXG5cdC8vIHRoZSBtb25nbyBjb2xsZWN0aW9uLlxyXG5cdC8vXHJcblx0Ly8gUHIuIGRlZmF1bHQgZG9jcyBhcmUgcmVtb3ZlZCBmcm9tIHRoZSBjb2xsZWN0aW9uIGFmdGVyIHNlbmQgaGF2ZVxyXG5cdC8vIGNvbXBsZXRlZC4gU2V0dGluZyBgb3B0aW9ucy5rZWVwRG9jc2Agd2lsbCB1cGRhdGUgYW5kIGtlZXAgdGhlXHJcblx0Ly8gZG9jIGVnLiBpZiBuZWVkZWQgZm9yIGhpc3RvcmljYWwgcmVhc29ucy5cclxuXHQvL1xyXG5cdC8vIEFmdGVyIHRoZSBzZW5kIGhhdmUgY29tcGxldGVkIGEgXCJzZW5kXCIgZXZlbnQgd2lsbCBiZSBlbWl0dGVkIHdpdGggYVxyXG5cdC8vIHN0YXR1cyBvYmplY3QgY29udGFpbmluZyBkb2MgaWQgYW5kIHRoZSBzZW5kIHJlc3VsdCBvYmplY3QuXHJcblx0Ly9cclxuXHR2YXIgaXNTZW5kaW5nRG9jID0gZmFsc2U7XHJcblxyXG5cdGlmIChvcHRpb25zLnNlbmRJbnRlcnZhbCAhPT0gbnVsbCkge1xyXG5cclxuXHRcdC8vIFRoaXMgd2lsbCByZXF1aXJlIGluZGV4IHNpbmNlIHdlIHNvcnQgZG9jcyBieSBjcmVhdGVkQXRcclxuXHRcdEluc3RhbmNlUmVjb3JkUXVldWUuY29sbGVjdGlvbi5fZW5zdXJlSW5kZXgoe1xyXG5cdFx0XHRjcmVhdGVkQXQ6IDFcclxuXHRcdH0pO1xyXG5cdFx0SW5zdGFuY2VSZWNvcmRRdWV1ZS5jb2xsZWN0aW9uLl9lbnN1cmVJbmRleCh7XHJcblx0XHRcdHNlbnQ6IDFcclxuXHRcdH0pO1xyXG5cdFx0SW5zdGFuY2VSZWNvcmRRdWV1ZS5jb2xsZWN0aW9uLl9lbnN1cmVJbmRleCh7XHJcblx0XHRcdHNlbmRpbmc6IDFcclxuXHRcdH0pO1xyXG5cclxuXHJcblx0XHR2YXIgc2VuZERvYyA9IGZ1bmN0aW9uIChkb2MpIHtcclxuXHRcdFx0Ly8gUmVzZXJ2ZSBkb2NcclxuXHRcdFx0dmFyIG5vdyA9ICtuZXcgRGF0ZSgpO1xyXG5cdFx0XHR2YXIgdGltZW91dEF0ID0gbm93ICsgb3B0aW9ucy5zZW5kVGltZW91dDtcclxuXHRcdFx0dmFyIHJlc2VydmVkID0gSW5zdGFuY2VSZWNvcmRRdWV1ZS5jb2xsZWN0aW9uLnVwZGF0ZSh7XHJcblx0XHRcdFx0X2lkOiBkb2MuX2lkLFxyXG5cdFx0XHRcdHNlbnQ6IGZhbHNlLCAvLyB4eHg6IG5lZWQgdG8gbWFrZSBzdXJlIHRoaXMgaXMgc2V0IG9uIGNyZWF0ZVxyXG5cdFx0XHRcdHNlbmRpbmc6IHtcclxuXHRcdFx0XHRcdCRsdDogbm93XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LCB7XHJcblx0XHRcdFx0JHNldDoge1xyXG5cdFx0XHRcdFx0c2VuZGluZzogdGltZW91dEF0LFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHQvLyBNYWtlIHN1cmUgd2Ugb25seSBoYW5kbGUgZG9jcyByZXNlcnZlZCBieSB0aGlzXHJcblx0XHRcdC8vIGluc3RhbmNlXHJcblx0XHRcdGlmIChyZXNlcnZlZCkge1xyXG5cclxuXHRcdFx0XHQvLyBTZW5kXHJcblx0XHRcdFx0dmFyIHJlc3VsdCA9IHNlbGYuc2VydmVyU2VuZChkb2MpO1xyXG5cclxuXHRcdFx0XHRpZiAoIW9wdGlvbnMua2VlcERvY3MpIHtcclxuXHRcdFx0XHRcdC8vIFByLiBEZWZhdWx0IHdlIHdpbGwgcmVtb3ZlIGRvY3NcclxuXHRcdFx0XHRcdEluc3RhbmNlUmVjb3JkUXVldWUuY29sbGVjdGlvbi5yZW1vdmUoe1xyXG5cdFx0XHRcdFx0XHRfaWQ6IGRvYy5faWRcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblxyXG5cdFx0XHRcdFx0Ly8gVXBkYXRlXHJcblx0XHRcdFx0XHRJbnN0YW5jZVJlY29yZFF1ZXVlLmNvbGxlY3Rpb24udXBkYXRlKHtcclxuXHRcdFx0XHRcdFx0X2lkOiBkb2MuX2lkXHJcblx0XHRcdFx0XHR9LCB7XHJcblx0XHRcdFx0XHRcdCRzZXQ6IHtcclxuXHRcdFx0XHRcdFx0XHQvLyBNYXJrIGFzIHNlbnRcclxuXHRcdFx0XHRcdFx0XHRzZW50OiB0cnVlLFxyXG5cdFx0XHRcdFx0XHRcdC8vIFNldCB0aGUgc2VudCBkYXRlXHJcblx0XHRcdFx0XHRcdFx0c2VudEF0OiBuZXcgRGF0ZSgpLFxyXG5cdFx0XHRcdFx0XHRcdC8vIE5vdCBiZWluZyBzZW50IGFueW1vcmVcclxuXHRcdFx0XHRcdFx0XHRzZW5kaW5nOiAwXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdC8vIC8vIEVtaXQgdGhlIHNlbmRcclxuXHRcdFx0XHQvLyBJbnN0YW5jZVJlY29yZFF1ZXVlLmVtaXQoJ3NlbmQnLCB7XHJcblx0XHRcdFx0Ly8gXHRkb2M6IGRvYy5faWQsXHJcblx0XHRcdFx0Ly8gXHRyZXN1bHQ6IHJlc3VsdFxyXG5cdFx0XHRcdC8vIH0pO1xyXG5cclxuXHRcdFx0fSAvLyBFbHNlIGNvdWxkIG5vdCByZXNlcnZlXHJcblx0XHR9OyAvLyBFTyBzZW5kRG9jXHJcblxyXG5cdFx0c2VuZFdvcmtlcihmdW5jdGlvbiAoKSB7XHJcblxyXG5cdFx0XHRpZiAoaXNTZW5kaW5nRG9jKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdC8vIFNldCBzZW5kIGZlbmNlXHJcblx0XHRcdGlzU2VuZGluZ0RvYyA9IHRydWU7XHJcblxyXG5cdFx0XHR2YXIgYmF0Y2hTaXplID0gb3B0aW9ucy5zZW5kQmF0Y2hTaXplIHx8IDE7XHJcblxyXG5cdFx0XHR2YXIgbm93ID0gK25ldyBEYXRlKCk7XHJcblxyXG5cdFx0XHQvLyBGaW5kIGRvY3MgdGhhdCBhcmUgbm90IGJlaW5nIG9yIGFscmVhZHkgc2VudFxyXG5cdFx0XHR2YXIgcGVuZGluZ0RvY3MgPSBJbnN0YW5jZVJlY29yZFF1ZXVlLmNvbGxlY3Rpb24uZmluZCh7XHJcblx0XHRcdFx0JGFuZDogW1xyXG5cdFx0XHRcdFx0Ly8gTWVzc2FnZSBpcyBub3Qgc2VudFxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRzZW50OiBmYWxzZVxyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdC8vIEFuZCBub3QgYmVpbmcgc2VudCBieSBvdGhlciBpbnN0YW5jZXNcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0c2VuZGluZzoge1xyXG5cdFx0XHRcdFx0XHRcdCRsdDogbm93XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHQvLyBBbmQgbm8gZXJyb3JcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0ZXJyTXNnOiB7XHJcblx0XHRcdFx0XHRcdFx0JGV4aXN0czogZmFsc2VcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdF1cclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdC8vIFNvcnQgYnkgY3JlYXRlZCBkYXRlXHJcblx0XHRcdFx0c29ydDoge1xyXG5cdFx0XHRcdFx0Y3JlYXRlZEF0OiAxXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRsaW1pdDogYmF0Y2hTaXplXHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0cGVuZGluZ0RvY3MuZm9yRWFjaChmdW5jdGlvbiAoZG9jKSB7XHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdHNlbmREb2MoZG9jKTtcclxuXHRcdFx0XHR9IGNhdGNoIChlcnJvcikge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvcihlcnJvci5zdGFjayk7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnSW5zdGFuY2VSZWNvcmRRdWV1ZTogQ291bGQgbm90IHNlbmQgZG9jIGlkOiBcIicgKyBkb2MuX2lkICsgJ1wiLCBFcnJvcjogJyArIGVycm9yLm1lc3NhZ2UpO1xyXG5cdFx0XHRcdFx0SW5zdGFuY2VSZWNvcmRRdWV1ZS5jb2xsZWN0aW9uLnVwZGF0ZSh7XHJcblx0XHRcdFx0XHRcdF9pZDogZG9jLl9pZFxyXG5cdFx0XHRcdFx0fSwge1xyXG5cdFx0XHRcdFx0XHQkc2V0OiB7XHJcblx0XHRcdFx0XHRcdFx0Ly8gZXJyb3IgbWVzc2FnZVxyXG5cdFx0XHRcdFx0XHRcdGVyck1zZzogZXJyb3IubWVzc2FnZVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pOyAvLyBFTyBmb3JFYWNoXHJcblxyXG5cdFx0XHQvLyBSZW1vdmUgdGhlIHNlbmQgZmVuY2VcclxuXHRcdFx0aXNTZW5kaW5nRG9jID0gZmFsc2U7XHJcblx0XHR9LCBvcHRpb25zLnNlbmRJbnRlcnZhbCB8fCAxNTAwMCk7IC8vIERlZmF1bHQgZXZlcnkgMTV0aCBzZWNcclxuXHJcblx0fSBlbHNlIHtcclxuXHRcdGlmIChJbnN0YW5jZVJlY29yZFF1ZXVlLmRlYnVnKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKCdJbnN0YW5jZVJlY29yZFF1ZXVlOiBTZW5kIHNlcnZlciBpcyBkaXNhYmxlZCcpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcbn07XHJcblxyXG5JbnN0YW5jZVJlY29yZFF1ZXVlLnN5bmNBdHRhY2ggPSBmdW5jdGlvbiAoc3luY19hdHRhY2htZW50LCBpbnNJZCwgc3BhY2VJZCwgbmV3UmVjb3JkSWQsIG9iamVjdE5hbWUpIHtcclxuXHRpZiAoc3luY19hdHRhY2htZW50ID09IFwibGFzdGVzdFwiKSB7XHJcblx0XHRjZnMuaW5zdGFuY2VzLmZpbmQoe1xyXG5cdFx0XHQnbWV0YWRhdGEuaW5zdGFuY2UnOiBpbnNJZCxcclxuXHRcdFx0J21ldGFkYXRhLmN1cnJlbnQnOiB0cnVlXHJcblx0XHR9KS5mb3JFYWNoKGZ1bmN0aW9uIChmKSB7XHJcblx0XHRcdGlmICghZi5oYXNTdG9yZWQoJ2luc3RhbmNlcycpKSB7XHJcblx0XHRcdFx0Y29uc29sZS5lcnJvcignc3luY0F0dGFjaC1maWxlIG5vdCBzdG9yZWQ6ICcsIGYuX2lkKTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0dmFyIG5ld0ZpbGUgPSBuZXcgRlMuRmlsZSgpLFxyXG5cdFx0XHRcdGNtc0ZpbGVJZCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignY21zX2ZpbGVzJykuX21ha2VOZXdJRCgpO1xyXG5cdFx0XHRuZXdGaWxlLmF0dGFjaERhdGEoZi5jcmVhdGVSZWFkU3RyZWFtKCdpbnN0YW5jZXMnKSwge1xyXG5cdFx0XHRcdHR5cGU6IGYub3JpZ2luYWwudHlwZVxyXG5cdFx0XHR9LCBmdW5jdGlvbiAoZXJyKSB7XHJcblx0XHRcdFx0aWYgKGVycikge1xyXG5cdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcihlcnIuZXJyb3IsIGVyci5yZWFzb24pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRuZXdGaWxlLm5hbWUoZi5uYW1lKCkpO1xyXG5cdFx0XHRcdG5ld0ZpbGUuc2l6ZShmLnNpemUoKSk7XHJcblx0XHRcdFx0dmFyIG1ldGFkYXRhID0ge1xyXG5cdFx0XHRcdFx0b3duZXI6IGYubWV0YWRhdGEub3duZXIsXHJcblx0XHRcdFx0XHRvd25lcl9uYW1lOiBmLm1ldGFkYXRhLm93bmVyX25hbWUsXHJcblx0XHRcdFx0XHRzcGFjZTogc3BhY2VJZCxcclxuXHRcdFx0XHRcdHJlY29yZF9pZDogbmV3UmVjb3JkSWQsXHJcblx0XHRcdFx0XHRvYmplY3RfbmFtZTogb2JqZWN0TmFtZSxcclxuXHRcdFx0XHRcdHBhcmVudDogY21zRmlsZUlkXHJcblx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0bmV3RmlsZS5tZXRhZGF0YSA9IG1ldGFkYXRhO1xyXG5cdFx0XHRcdGNmcy5maWxlcy5pbnNlcnQobmV3RmlsZSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRNZXRlb3Iud3JhcEFzeW5jKGZ1bmN0aW9uIChuZXdGaWxlLCBDcmVhdG9yLCBjbXNGaWxlSWQsIG9iamVjdE5hbWUsIG5ld1JlY29yZElkLCBzcGFjZUlkLCBmLCBjYikge1xyXG5cdFx0XHRcdG5ld0ZpbGUub25jZSgnc3RvcmVkJywgZnVuY3Rpb24gKHN0b3JlTmFtZSkge1xyXG5cdFx0XHRcdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKCdjbXNfZmlsZXMnKS5pbnNlcnQoe1xyXG5cdFx0XHRcdFx0XHRfaWQ6IGNtc0ZpbGVJZCxcclxuXHRcdFx0XHRcdFx0cGFyZW50OiB7XHJcblx0XHRcdFx0XHRcdFx0bzogb2JqZWN0TmFtZSxcclxuXHRcdFx0XHRcdFx0XHRpZHM6IFtuZXdSZWNvcmRJZF1cclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0c2l6ZTogbmV3RmlsZS5zaXplKCksXHJcblx0XHRcdFx0XHRcdG5hbWU6IG5ld0ZpbGUubmFtZSgpLFxyXG5cdFx0XHRcdFx0XHRleHRlbnRpb246IG5ld0ZpbGUuZXh0ZW5zaW9uKCksXHJcblx0XHRcdFx0XHRcdHNwYWNlOiBzcGFjZUlkLFxyXG5cdFx0XHRcdFx0XHR2ZXJzaW9uczogW25ld0ZpbGUuX2lkXSxcclxuXHRcdFx0XHRcdFx0b3duZXI6IGYubWV0YWRhdGEub3duZXIsXHJcblx0XHRcdFx0XHRcdGNyZWF0ZWRfYnk6IGYubWV0YWRhdGEub3duZXIsXHJcblx0XHRcdFx0XHRcdG1vZGlmaWVkX2J5OiBmLm1ldGFkYXRhLm93bmVyXHJcblx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRjYihudWxsKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRuZXdGaWxlLm9uY2UoJ2Vycm9yJywgZnVuY3Rpb24gKGVycm9yKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKCdzeW5jQXR0YWNoLWVycm9yOiAnLCBlcnJvcik7XHJcblx0XHRcdFx0XHRjYihlcnJvcik7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0pKG5ld0ZpbGUsIENyZWF0b3IsIGNtc0ZpbGVJZCwgb2JqZWN0TmFtZSwgbmV3UmVjb3JkSWQsIHNwYWNlSWQsIGYpO1xyXG5cdFx0fSlcclxuXHR9IGVsc2UgaWYgKHN5bmNfYXR0YWNobWVudCA9PSBcImFsbFwiKSB7XHJcblx0XHR2YXIgcGFyZW50cyA9IFtdO1xyXG5cdFx0Y2ZzLmluc3RhbmNlcy5maW5kKHtcclxuXHRcdFx0J21ldGFkYXRhLmluc3RhbmNlJzogaW5zSWRcclxuXHRcdH0pLmZvckVhY2goZnVuY3Rpb24gKGYpIHtcclxuXHRcdFx0aWYgKCFmLmhhc1N0b3JlZCgnaW5zdGFuY2VzJykpIHtcclxuXHRcdFx0XHRjb25zb2xlLmVycm9yKCdzeW5jQXR0YWNoLWZpbGUgbm90IHN0b3JlZDogJywgZi5faWQpO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHR2YXIgbmV3RmlsZSA9IG5ldyBGUy5GaWxlKCksXHJcblx0XHRcdFx0Y21zRmlsZUlkID0gZi5tZXRhZGF0YS5wYXJlbnQ7XHJcblxyXG5cdFx0XHRpZiAoIXBhcmVudHMuaW5jbHVkZXMoY21zRmlsZUlkKSkge1xyXG5cdFx0XHRcdHBhcmVudHMucHVzaChjbXNGaWxlSWQpO1xyXG5cdFx0XHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbignY21zX2ZpbGVzJykuaW5zZXJ0KHtcclxuXHRcdFx0XHRcdF9pZDogY21zRmlsZUlkLFxyXG5cdFx0XHRcdFx0cGFyZW50OiB7XHJcblx0XHRcdFx0XHRcdG86IG9iamVjdE5hbWUsXHJcblx0XHRcdFx0XHRcdGlkczogW25ld1JlY29yZElkXVxyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdHNwYWNlOiBzcGFjZUlkLFxyXG5cdFx0XHRcdFx0dmVyc2lvbnM6IFtdLFxyXG5cdFx0XHRcdFx0b3duZXI6IGYubWV0YWRhdGEub3duZXIsXHJcblx0XHRcdFx0XHRjcmVhdGVkX2J5OiBmLm1ldGFkYXRhLm93bmVyLFxyXG5cdFx0XHRcdFx0bW9kaWZpZWRfYnk6IGYubWV0YWRhdGEub3duZXJcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRuZXdGaWxlLmF0dGFjaERhdGEoZi5jcmVhdGVSZWFkU3RyZWFtKCdpbnN0YW5jZXMnKSwge1xyXG5cdFx0XHRcdHR5cGU6IGYub3JpZ2luYWwudHlwZVxyXG5cdFx0XHR9LCBmdW5jdGlvbiAoZXJyKSB7XHJcblx0XHRcdFx0aWYgKGVycikge1xyXG5cdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcihlcnIuZXJyb3IsIGVyci5yZWFzb24pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRuZXdGaWxlLm5hbWUoZi5uYW1lKCkpO1xyXG5cdFx0XHRcdG5ld0ZpbGUuc2l6ZShmLnNpemUoKSk7XHJcblx0XHRcdFx0dmFyIG1ldGFkYXRhID0ge1xyXG5cdFx0XHRcdFx0b3duZXI6IGYubWV0YWRhdGEub3duZXIsXHJcblx0XHRcdFx0XHRvd25lcl9uYW1lOiBmLm1ldGFkYXRhLm93bmVyX25hbWUsXHJcblx0XHRcdFx0XHRzcGFjZTogc3BhY2VJZCxcclxuXHRcdFx0XHRcdHJlY29yZF9pZDogbmV3UmVjb3JkSWQsXHJcblx0XHRcdFx0XHRvYmplY3RfbmFtZTogb2JqZWN0TmFtZSxcclxuXHRcdFx0XHRcdHBhcmVudDogY21zRmlsZUlkXHJcblx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0bmV3RmlsZS5tZXRhZGF0YSA9IG1ldGFkYXRhO1xyXG5cdFx0XHRcdGNmcy5maWxlcy5pbnNlcnQobmV3RmlsZSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRNZXRlb3Iud3JhcEFzeW5jKGZ1bmN0aW9uIChuZXdGaWxlLCBDcmVhdG9yLCBjbXNGaWxlSWQsIGYsIGNiKSB7XHJcblx0XHRcdFx0bmV3RmlsZS5vbmNlKCdzdG9yZWQnLCBmdW5jdGlvbiAoc3RvcmVOYW1lKSB7XHJcblx0XHRcdFx0XHRpZiAoZi5tZXRhZGF0YS5jdXJyZW50ID09IHRydWUpIHtcclxuXHRcdFx0XHRcdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKCdjbXNfZmlsZXMnKS51cGRhdGUoY21zRmlsZUlkLCB7XHJcblx0XHRcdFx0XHRcdFx0JHNldDoge1xyXG5cdFx0XHRcdFx0XHRcdFx0c2l6ZTogbmV3RmlsZS5zaXplKCksXHJcblx0XHRcdFx0XHRcdFx0XHRuYW1lOiBuZXdGaWxlLm5hbWUoKSxcclxuXHRcdFx0XHRcdFx0XHRcdGV4dGVudGlvbjogbmV3RmlsZS5leHRlbnNpb24oKSxcclxuXHRcdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHRcdCRhZGRUb1NldDoge1xyXG5cdFx0XHRcdFx0XHRcdFx0dmVyc2lvbnM6IG5ld0ZpbGUuX2lkXHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbignY21zX2ZpbGVzJykudXBkYXRlKGNtc0ZpbGVJZCwge1xyXG5cdFx0XHRcdFx0XHRcdCRhZGRUb1NldDoge1xyXG5cdFx0XHRcdFx0XHRcdFx0dmVyc2lvbnM6IG5ld0ZpbGUuX2lkXHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRjYihudWxsKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRuZXdGaWxlLm9uY2UoJ2Vycm9yJywgZnVuY3Rpb24gKGVycm9yKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKCdzeW5jQXR0YWNoLWVycm9yOiAnLCBlcnJvcik7XHJcblx0XHRcdFx0XHRjYihlcnJvcik7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0pKG5ld0ZpbGUsIENyZWF0b3IsIGNtc0ZpbGVJZCwgZik7XHJcblx0XHR9KVxyXG5cdH1cclxufVxyXG5cclxuSW5zdGFuY2VSZWNvcmRRdWV1ZS5zeW5jSW5zRmllbGRzID0gWyduYW1lJywgJ3N1Ym1pdHRlcl9uYW1lJywgJ2FwcGxpY2FudF9uYW1lJywgJ2FwcGxpY2FudF9vcmdhbml6YXRpb25fbmFtZScsICdhcHBsaWNhbnRfb3JnYW5pemF0aW9uX2Z1bGxuYW1lJywgJ3N0YXRlJyxcclxuXHQnY3VycmVudF9zdGVwX25hbWUnLCAnZmxvd19uYW1lJywgJ2NhdGVnb3J5X25hbWUnLCAnc3VibWl0X2RhdGUnLCAnZmluaXNoX2RhdGUnLCAnZmluYWxfZGVjaXNpb24nLCAnYXBwbGljYW50X29yZ2FuaXphdGlvbicsICdhcHBsaWNhbnRfY29tcGFueSdcclxuXTtcclxuSW5zdGFuY2VSZWNvcmRRdWV1ZS5zeW5jVmFsdWVzID0gZnVuY3Rpb24gKGZpZWxkX21hcF9iYWNrLCB2YWx1ZXMsIGlucywgb2JqZWN0SW5mbywgZmllbGRfbWFwX2JhY2tfc2NyaXB0LCByZWNvcmQpIHtcclxuXHR2YXJcclxuXHRcdG9iaiA9IHt9LFxyXG5cdFx0dGFibGVGaWVsZENvZGVzID0gW10sXHJcblx0XHR0YWJsZUZpZWxkTWFwID0gW10sXHJcblx0XHR0YWJsZVRvUmVsYXRlZE1hcCA9IHt9O1xyXG5cclxuXHRmaWVsZF9tYXBfYmFjayA9IGZpZWxkX21hcF9iYWNrIHx8IFtdO1xyXG5cclxuXHR2YXIgc3BhY2VJZCA9IGlucy5zcGFjZTtcclxuXHJcblx0dmFyIGZvcm0gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJmb3Jtc1wiKS5maW5kT25lKGlucy5mb3JtKTtcclxuXHR2YXIgZm9ybUZpZWxkcyA9IG51bGw7XHJcblx0aWYgKGZvcm0uY3VycmVudC5faWQgPT09IGlucy5mb3JtX3ZlcnNpb24pIHtcclxuXHRcdGZvcm1GaWVsZHMgPSBmb3JtLmN1cnJlbnQuZmllbGRzIHx8IFtdO1xyXG5cdH0gZWxzZSB7XHJcblx0XHR2YXIgZm9ybVZlcnNpb24gPSBfLmZpbmQoZm9ybS5oaXN0b3J5cywgZnVuY3Rpb24gKGgpIHtcclxuXHRcdFx0cmV0dXJuIGguX2lkID09PSBpbnMuZm9ybV92ZXJzaW9uO1xyXG5cdFx0fSlcclxuXHRcdGZvcm1GaWVsZHMgPSBmb3JtVmVyc2lvbiA/IGZvcm1WZXJzaW9uLmZpZWxkcyA6IFtdO1xyXG5cdH1cclxuXHJcblx0dmFyIG9iamVjdEZpZWxkcyA9IG9iamVjdEluZm8uZmllbGRzO1xyXG5cdHZhciBvYmplY3RGaWVsZEtleXMgPSBfLmtleXMob2JqZWN0RmllbGRzKTtcclxuXHR2YXIgcmVsYXRlZE9iamVjdHMgPSBDcmVhdG9yLmdldFJlbGF0ZWRPYmplY3RzKG9iamVjdEluZm8ubmFtZSwgc3BhY2VJZCk7XHJcblx0dmFyIHJlbGF0ZWRPYmplY3RzS2V5cyA9IF8ucGx1Y2socmVsYXRlZE9iamVjdHMsICdvYmplY3RfbmFtZScpO1xyXG5cdHZhciBmb3JtVGFibGVGaWVsZHMgPSBfLmZpbHRlcihmb3JtRmllbGRzLCBmdW5jdGlvbiAoZm9ybUZpZWxkKSB7XHJcblx0XHRyZXR1cm4gZm9ybUZpZWxkLnR5cGUgPT09ICd0YWJsZSdcclxuXHR9KTtcclxuXHR2YXIgZm9ybVRhYmxlRmllbGRzQ29kZSA9IF8ucGx1Y2soZm9ybVRhYmxlRmllbGRzLCAnY29kZScpO1xyXG5cclxuXHR2YXIgZ2V0UmVsYXRlZE9iamVjdEZpZWxkID0gZnVuY3Rpb24gKGtleSkge1xyXG5cdFx0cmV0dXJuIF8uZmluZChyZWxhdGVkT2JqZWN0c0tleXMsIGZ1bmN0aW9uIChyZWxhdGVkT2JqZWN0c0tleSkge1xyXG5cdFx0XHRyZXR1cm4ga2V5LnN0YXJ0c1dpdGgocmVsYXRlZE9iamVjdHNLZXkgKyAnLicpO1xyXG5cdFx0fSlcclxuXHR9O1xyXG5cclxuXHR2YXIgZ2V0Rm9ybVRhYmxlRmllbGQgPSBmdW5jdGlvbiAoa2V5KSB7XHJcblx0XHRyZXR1cm4gXy5maW5kKGZvcm1UYWJsZUZpZWxkc0NvZGUsIGZ1bmN0aW9uIChmb3JtVGFibGVGaWVsZENvZGUpIHtcclxuXHRcdFx0cmV0dXJuIGtleS5zdGFydHNXaXRoKGZvcm1UYWJsZUZpZWxkQ29kZSArICcuJyk7XHJcblx0XHR9KVxyXG5cdH07XHJcblxyXG5cdHZhciBnZXRGb3JtRmllbGQgPSBmdW5jdGlvbiAoX2Zvcm1GaWVsZHMsIF9maWVsZENvZGUpIHtcclxuXHRcdHZhciBmb3JtRmllbGQgPSBudWxsO1xyXG5cdFx0Xy5lYWNoKF9mb3JtRmllbGRzLCBmdW5jdGlvbiAoZmYpIHtcclxuXHRcdFx0aWYgKCFmb3JtRmllbGQpIHtcclxuXHRcdFx0XHRpZiAoZmYuY29kZSA9PT0gX2ZpZWxkQ29kZSkge1xyXG5cdFx0XHRcdFx0Zm9ybUZpZWxkID0gZmY7XHJcblx0XHRcdFx0fSBlbHNlIGlmIChmZi50eXBlID09PSAnc2VjdGlvbicpIHtcclxuXHRcdFx0XHRcdF8uZWFjaChmZi5maWVsZHMsIGZ1bmN0aW9uIChmKSB7XHJcblx0XHRcdFx0XHRcdGlmICghZm9ybUZpZWxkKSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKGYuY29kZSA9PT0gX2ZpZWxkQ29kZSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0Zm9ybUZpZWxkID0gZjtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0fSBlbHNlIGlmIChmZi50eXBlID09PSAndGFibGUnKSB7XHJcblx0XHRcdFx0XHRfLmVhY2goZmYuZmllbGRzLCBmdW5jdGlvbiAoZikge1xyXG5cdFx0XHRcdFx0XHRpZiAoIWZvcm1GaWVsZCkge1xyXG5cdFx0XHRcdFx0XHRcdGlmIChmLmNvZGUgPT09IF9maWVsZENvZGUpIHtcclxuXHRcdFx0XHRcdFx0XHRcdGZvcm1GaWVsZCA9IGY7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gZm9ybUZpZWxkO1xyXG5cdH1cclxuXHJcblx0ZmllbGRfbWFwX2JhY2suZm9yRWFjaChmdW5jdGlvbiAoZm0pIHtcclxuXHRcdC8vd29ya2Zsb3cg55qE5a2Q6KGo5YiwY3JlYXRvciBvYmplY3Qg55qE55u45YWz5a+56LGhXHJcblx0XHR2YXIgcmVsYXRlZE9iamVjdEZpZWxkID0gZ2V0UmVsYXRlZE9iamVjdEZpZWxkKGZtLm9iamVjdF9maWVsZCk7XHJcblx0XHR2YXIgZm9ybVRhYmxlRmllbGQgPSBnZXRGb3JtVGFibGVGaWVsZChmbS53b3JrZmxvd19maWVsZCk7XHJcblx0XHRpZiAocmVsYXRlZE9iamVjdEZpZWxkKSB7XHJcblx0XHRcdHZhciBvVGFibGVDb2RlID0gZm0ub2JqZWN0X2ZpZWxkLnNwbGl0KCcuJylbMF07XHJcblx0XHRcdHZhciBvVGFibGVGaWVsZENvZGUgPSBmbS5vYmplY3RfZmllbGQuc3BsaXQoJy4nKVsxXTtcclxuXHRcdFx0dmFyIHRhYmxlVG9SZWxhdGVkTWFwS2V5ID0gb1RhYmxlQ29kZTtcclxuXHRcdFx0aWYgKCF0YWJsZVRvUmVsYXRlZE1hcFt0YWJsZVRvUmVsYXRlZE1hcEtleV0pIHtcclxuXHRcdFx0XHR0YWJsZVRvUmVsYXRlZE1hcFt0YWJsZVRvUmVsYXRlZE1hcEtleV0gPSB7fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoZm9ybVRhYmxlRmllbGQpIHtcclxuXHRcdFx0XHR2YXIgd1RhYmxlQ29kZSA9IGZtLndvcmtmbG93X2ZpZWxkLnNwbGl0KCcuJylbMF07XHJcblx0XHRcdFx0dGFibGVUb1JlbGF0ZWRNYXBbdGFibGVUb1JlbGF0ZWRNYXBLZXldWydfRlJPTV9UQUJMRV9DT0RFJ10gPSB3VGFibGVDb2RlXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRhYmxlVG9SZWxhdGVkTWFwW3RhYmxlVG9SZWxhdGVkTWFwS2V5XVtvVGFibGVGaWVsZENvZGVdID0gZm0ud29ya2Zsb3dfZmllbGRcclxuXHRcdH1cclxuXHRcdC8vIOWIpOaWreaYr+WQpuaYr+WtkOihqOWtl+autVxyXG5cdFx0ZWxzZSBpZiAoZm0ud29ya2Zsb3dfZmllbGQuaW5kZXhPZignLiQuJykgPiAwICYmIGZtLm9iamVjdF9maWVsZC5pbmRleE9mKCcuJC4nKSA+IDApIHtcclxuXHRcdFx0dmFyIHdUYWJsZUNvZGUgPSBmbS53b3JrZmxvd19maWVsZC5zcGxpdCgnLiQuJylbMF07XHJcblx0XHRcdHZhciBvVGFibGVDb2RlID0gZm0ub2JqZWN0X2ZpZWxkLnNwbGl0KCcuJC4nKVswXTtcclxuXHRcdFx0aWYgKHZhbHVlcy5oYXNPd25Qcm9wZXJ0eSh3VGFibGVDb2RlKSAmJiBfLmlzQXJyYXkodmFsdWVzW3dUYWJsZUNvZGVdKSkge1xyXG5cdFx0XHRcdHRhYmxlRmllbGRDb2Rlcy5wdXNoKEpTT04uc3RyaW5naWZ5KHtcclxuXHRcdFx0XHRcdHdvcmtmbG93X3RhYmxlX2ZpZWxkX2NvZGU6IHdUYWJsZUNvZGUsXHJcblx0XHRcdFx0XHRvYmplY3RfdGFibGVfZmllbGRfY29kZTogb1RhYmxlQ29kZVxyXG5cdFx0XHRcdH0pKTtcclxuXHRcdFx0XHR0YWJsZUZpZWxkTWFwLnB1c2goZm0pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAodmFsdWVzLmhhc093blByb3BlcnR5KGZtLndvcmtmbG93X2ZpZWxkKSkge1xyXG5cdFx0XHR2YXIgd0ZpZWxkID0gbnVsbDtcclxuXHJcblx0XHRcdF8uZWFjaChmb3JtRmllbGRzLCBmdW5jdGlvbiAoZmYpIHtcclxuXHRcdFx0XHRpZiAoIXdGaWVsZCkge1xyXG5cdFx0XHRcdFx0aWYgKGZmLmNvZGUgPT09IGZtLndvcmtmbG93X2ZpZWxkKSB7XHJcblx0XHRcdFx0XHRcdHdGaWVsZCA9IGZmO1xyXG5cdFx0XHRcdFx0fSBlbHNlIGlmIChmZi50eXBlID09PSAnc2VjdGlvbicpIHtcclxuXHRcdFx0XHRcdFx0Xy5lYWNoKGZmLmZpZWxkcywgZnVuY3Rpb24gKGYpIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAoIXdGaWVsZCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKGYuY29kZSA9PT0gZm0ud29ya2Zsb3dfZmllbGQpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0d0ZpZWxkID0gZjtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KVxyXG5cclxuXHRcdFx0dmFyIG9GaWVsZCA9IG9iamVjdEZpZWxkc1tmbS5vYmplY3RfZmllbGRdO1xyXG5cclxuXHRcdFx0aWYgKG9GaWVsZCkge1xyXG5cdFx0XHRcdGlmICghd0ZpZWxkKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnZm0ud29ya2Zsb3dfZmllbGQ6ICcsIGZtLndvcmtmbG93X2ZpZWxkKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQvLyDooajljZXpgInkurrpgInnu4TlrZfmrrUg6IezIOWvueixoSBsb29rdXAgbWFzdGVyX2RldGFpbOexu+Wei+Wtl+auteWQjOatpVxyXG5cdFx0XHRcdGlmIChbJ3VzZXInLCAnZ3JvdXAnXS5pbmNsdWRlcyh3RmllbGQudHlwZSkgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKG9GaWVsZC50eXBlKSAmJiBbJ3VzZXJzJywgJ29yZ2FuaXphdGlvbnMnXS5pbmNsdWRlcyhvRmllbGQucmVmZXJlbmNlX3RvKSkge1xyXG5cdFx0XHRcdFx0aWYgKCFfLmlzRW1wdHkodmFsdWVzW2ZtLndvcmtmbG93X2ZpZWxkXSkpIHtcclxuXHRcdFx0XHRcdFx0aWYgKG9GaWVsZC5tdWx0aXBsZSAmJiB3RmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcclxuXHRcdFx0XHRcdFx0XHRvYmpbZm0ub2JqZWN0X2ZpZWxkXSA9IF8uY29tcGFjdChfLnBsdWNrKHZhbHVlc1tmbS53b3JrZmxvd19maWVsZF0sICdpZCcpKVxyXG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCFvRmllbGQubXVsdGlwbGUgJiYgIXdGaWVsZC5pc19tdWx0aXNlbGVjdCkge1xyXG5cdFx0XHRcdFx0XHRcdG9ialtmbS5vYmplY3RfZmllbGRdID0gdmFsdWVzW2ZtLndvcmtmbG93X2ZpZWxkXS5pZFxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2UgaWYgKCFvRmllbGQubXVsdGlwbGUgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKG9GaWVsZC50eXBlKSAmJiBfLmlzU3RyaW5nKG9GaWVsZC5yZWZlcmVuY2VfdG8pICYmIF8uaXNTdHJpbmcodmFsdWVzW2ZtLndvcmtmbG93X2ZpZWxkXSkpIHtcclxuXHRcdFx0XHRcdHZhciBvQ29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvRmllbGQucmVmZXJlbmNlX3RvLCBzcGFjZUlkKVxyXG5cdFx0XHRcdFx0dmFyIHJlZmVyT2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob0ZpZWxkLnJlZmVyZW5jZV90bywgc3BhY2VJZClcclxuXHRcdFx0XHRcdGlmIChvQ29sbGVjdGlvbiAmJiByZWZlck9iamVjdCkge1xyXG5cdFx0XHRcdFx0XHQvLyDlhYjorqTkuLrmraTlgLzmmK9yZWZlck9iamVjdCBfaWTlrZfmrrXlgLxcclxuXHRcdFx0XHRcdFx0dmFyIHJlZmVyRGF0YSA9IG9Db2xsZWN0aW9uLmZpbmRPbmUodmFsdWVzW2ZtLndvcmtmbG93X2ZpZWxkXSwge1xyXG5cdFx0XHRcdFx0XHRcdGZpZWxkczoge1xyXG5cdFx0XHRcdFx0XHRcdFx0X2lkOiAxXHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0aWYgKHJlZmVyRGF0YSkge1xyXG5cdFx0XHRcdFx0XHRcdG9ialtmbS5vYmplY3RfZmllbGRdID0gcmVmZXJEYXRhLl9pZDtcclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0Ly8g5YW25qyh6K6k5Li65q2k5YC85pivcmVmZXJPYmplY3QgTkFNRV9GSUVMRF9LRVnlgLxcclxuXHRcdFx0XHRcdFx0aWYgKCFyZWZlckRhdGEpIHtcclxuXHRcdFx0XHRcdFx0XHR2YXIgbmFtZUZpZWxkS2V5ID0gcmVmZXJPYmplY3QuTkFNRV9GSUVMRF9LRVk7XHJcblx0XHRcdFx0XHRcdFx0dmFyIHNlbGVjdG9yID0ge307XHJcblx0XHRcdFx0XHRcdFx0c2VsZWN0b3JbbmFtZUZpZWxkS2V5XSA9IHZhbHVlc1tmbS53b3JrZmxvd19maWVsZF07XHJcblx0XHRcdFx0XHRcdFx0cmVmZXJEYXRhID0gb0NvbGxlY3Rpb24uZmluZE9uZShzZWxlY3Rvciwge1xyXG5cdFx0XHRcdFx0XHRcdFx0ZmllbGRzOiB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdF9pZDogMVxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdGlmIChyZWZlckRhdGEpIHtcclxuXHRcdFx0XHRcdFx0XHRcdG9ialtmbS5vYmplY3RfZmllbGRdID0gcmVmZXJEYXRhLl9pZDtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0aWYgKG9GaWVsZC50eXBlID09PSBcImJvb2xlYW5cIikge1xyXG5cdFx0XHRcdFx0XHR2YXIgdG1wX2ZpZWxkX3ZhbHVlID0gdmFsdWVzW2ZtLndvcmtmbG93X2ZpZWxkXTtcclxuXHRcdFx0XHRcdFx0aWYgKFsndHJ1ZScsICfmmK8nXS5pbmNsdWRlcyh0bXBfZmllbGRfdmFsdWUpKSB7XHJcblx0XHRcdFx0XHRcdFx0b2JqW2ZtLm9iamVjdF9maWVsZF0gPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKFsnZmFsc2UnLCAn5ZCmJ10uaW5jbHVkZXModG1wX2ZpZWxkX3ZhbHVlKSkge1xyXG5cdFx0XHRcdFx0XHRcdG9ialtmbS5vYmplY3RfZmllbGRdID0gZmFsc2U7XHJcblx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0b2JqW2ZtLm9iamVjdF9maWVsZF0gPSB0bXBfZmllbGRfdmFsdWU7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVsc2UgaWYgKFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhvRmllbGQudHlwZSkgJiYgd0ZpZWxkLnR5cGUgPT09ICdvZGF0YScpIHtcclxuXHRcdFx0XHRcdFx0aWYgKG9GaWVsZC5tdWx0aXBsZSAmJiB3RmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcclxuXHRcdFx0XHRcdFx0XHRvYmpbZm0ub2JqZWN0X2ZpZWxkXSA9IF8uY29tcGFjdChfLnBsdWNrKHZhbHVlc1tmbS53b3JrZmxvd19maWVsZF0sICdfaWQnKSlcclxuXHRcdFx0XHRcdFx0fSBlbHNlIGlmICghb0ZpZWxkLm11bHRpcGxlICYmICF3RmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAoIV8uaXNFbXB0eSh2YWx1ZXNbZm0ud29ya2Zsb3dfZmllbGRdKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0b2JqW2ZtLm9iamVjdF9maWVsZF0gPSB2YWx1ZXNbZm0ud29ya2Zsb3dfZmllbGRdLl9pZFxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRvYmpbZm0ub2JqZWN0X2ZpZWxkXSA9IHZhbHVlc1tmbS53b3JrZmxvd19maWVsZF07XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRvYmpbZm0ub2JqZWN0X2ZpZWxkXSA9IHZhbHVlc1tmbS53b3JrZmxvd19maWVsZF07XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGlmIChmbS5vYmplY3RfZmllbGQuaW5kZXhPZignLicpID4gLTEpIHtcclxuXHRcdFx0XHRcdHZhciB0ZW1PYmpGaWVsZHMgPSBmbS5vYmplY3RfZmllbGQuc3BsaXQoJy4nKTtcclxuXHRcdFx0XHRcdGlmICh0ZW1PYmpGaWVsZHMubGVuZ3RoID09PSAyKSB7XHJcblx0XHRcdFx0XHRcdHZhciBvYmpGaWVsZCA9IHRlbU9iakZpZWxkc1swXTtcclxuXHRcdFx0XHRcdFx0dmFyIHJlZmVyT2JqRmllbGQgPSB0ZW1PYmpGaWVsZHNbMV07XHJcblx0XHRcdFx0XHRcdHZhciBvRmllbGQgPSBvYmplY3RGaWVsZHNbb2JqRmllbGRdO1xyXG5cdFx0XHRcdFx0XHRpZiAoIW9GaWVsZC5tdWx0aXBsZSAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMob0ZpZWxkLnR5cGUpICYmIF8uaXNTdHJpbmcob0ZpZWxkLnJlZmVyZW5jZV90bykpIHtcclxuXHRcdFx0XHRcdFx0XHR2YXIgb0NvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob0ZpZWxkLnJlZmVyZW5jZV90bywgc3BhY2VJZClcclxuXHRcdFx0XHRcdFx0XHRpZiAob0NvbGxlY3Rpb24gJiYgcmVjb3JkICYmIHJlY29yZFtvYmpGaWVsZF0pIHtcclxuXHRcdFx0XHRcdFx0XHRcdHZhciByZWZlclNldE9iaiA9IHt9O1xyXG5cdFx0XHRcdFx0XHRcdFx0cmVmZXJTZXRPYmpbcmVmZXJPYmpGaWVsZF0gPSB2YWx1ZXNbZm0ud29ya2Zsb3dfZmllbGRdO1xyXG5cdFx0XHRcdFx0XHRcdFx0b0NvbGxlY3Rpb24udXBkYXRlKHJlY29yZFtvYmpGaWVsZF0sIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0JHNldDogcmVmZXJTZXRPYmpcclxuXHRcdFx0XHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdC8vIGVsc2V7XHJcblx0XHRcdFx0Ly8gXHR2YXIgcmVsYXRlZE9iamVjdCA9IF8uZmluZChyZWxhdGVkT2JqZWN0cywgZnVuY3Rpb24oX3JlbGF0ZWRPYmplY3Qpe1xyXG5cdFx0XHRcdC8vIFx0XHRyZXR1cm4gX3JlbGF0ZWRPYmplY3Qub2JqZWN0X25hbWUgPT09IGZtLm9iamVjdF9maWVsZFxyXG5cdFx0XHRcdC8vIFx0fSlcclxuXHRcdFx0XHQvL1xyXG5cdFx0XHRcdC8vIFx0aWYocmVsYXRlZE9iamVjdCl7XHJcblx0XHRcdFx0Ly8gXHRcdG9ialtmbS5vYmplY3RfZmllbGRdID0gdmFsdWVzW2ZtLndvcmtmbG93X2ZpZWxkXTtcclxuXHRcdFx0XHQvLyBcdH1cclxuXHRcdFx0XHQvLyB9XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0aWYgKGZtLndvcmtmbG93X2ZpZWxkLnN0YXJ0c1dpdGgoJ2luc3RhbmNlLicpKSB7XHJcblx0XHRcdFx0dmFyIGluc0ZpZWxkID0gZm0ud29ya2Zsb3dfZmllbGQuc3BsaXQoJ2luc3RhbmNlLicpWzFdO1xyXG5cdFx0XHRcdGlmIChJbnN0YW5jZVJlY29yZFF1ZXVlLnN5bmNJbnNGaWVsZHMuaW5jbHVkZXMoaW5zRmllbGQpKSB7XHJcblx0XHRcdFx0XHRpZiAoZm0ub2JqZWN0X2ZpZWxkLmluZGV4T2YoJy4nKSA8IDApIHtcclxuXHRcdFx0XHRcdFx0b2JqW2ZtLm9iamVjdF9maWVsZF0gPSBpbnNbaW5zRmllbGRdO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0dmFyIHRlbU9iakZpZWxkcyA9IGZtLm9iamVjdF9maWVsZC5zcGxpdCgnLicpO1xyXG5cdFx0XHRcdFx0XHRpZiAodGVtT2JqRmllbGRzLmxlbmd0aCA9PT0gMikge1xyXG5cdFx0XHRcdFx0XHRcdHZhciBvYmpGaWVsZCA9IHRlbU9iakZpZWxkc1swXTtcclxuXHRcdFx0XHRcdFx0XHR2YXIgcmVmZXJPYmpGaWVsZCA9IHRlbU9iakZpZWxkc1sxXTtcclxuXHRcdFx0XHRcdFx0XHR2YXIgb0ZpZWxkID0gb2JqZWN0RmllbGRzW29iakZpZWxkXTtcclxuXHRcdFx0XHRcdFx0XHRpZiAoIW9GaWVsZC5tdWx0aXBsZSAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMob0ZpZWxkLnR5cGUpICYmIF8uaXNTdHJpbmcob0ZpZWxkLnJlZmVyZW5jZV90bykpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHZhciBvQ29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvRmllbGQucmVmZXJlbmNlX3RvLCBzcGFjZUlkKVxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKG9Db2xsZWN0aW9uICYmIHJlY29yZCAmJiByZWNvcmRbb2JqRmllbGRdKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHZhciByZWZlclNldE9iaiA9IHt9O1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRyZWZlclNldE9ialtyZWZlck9iakZpZWxkXSA9IGluc1tpbnNGaWVsZF07XHJcblx0XHRcdFx0XHRcdFx0XHRcdG9Db2xsZWN0aW9uLnVwZGF0ZShyZWNvcmRbb2JqRmllbGRdLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0JHNldDogcmVmZXJTZXRPYmpcclxuXHRcdFx0XHRcdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGlmIChpbnNbZm0ud29ya2Zsb3dfZmllbGRdKSB7XHJcblx0XHRcdFx0XHRvYmpbZm0ub2JqZWN0X2ZpZWxkXSA9IGluc1tmbS53b3JrZmxvd19maWVsZF07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSlcclxuXHJcblx0Xy51bmlxKHRhYmxlRmllbGRDb2RlcykuZm9yRWFjaChmdW5jdGlvbiAodGZjKSB7XHJcblx0XHR2YXIgYyA9IEpTT04ucGFyc2UodGZjKTtcclxuXHRcdG9ialtjLm9iamVjdF90YWJsZV9maWVsZF9jb2RlXSA9IFtdO1xyXG5cdFx0dmFsdWVzW2Mud29ya2Zsb3dfdGFibGVfZmllbGRfY29kZV0uZm9yRWFjaChmdW5jdGlvbiAodHIpIHtcclxuXHRcdFx0dmFyIG5ld1RyID0ge307XHJcblx0XHRcdF8uZWFjaCh0ciwgZnVuY3Rpb24gKHYsIGspIHtcclxuXHRcdFx0XHR0YWJsZUZpZWxkTWFwLmZvckVhY2goZnVuY3Rpb24gKHRmbSkge1xyXG5cdFx0XHRcdFx0aWYgKHRmbS53b3JrZmxvd19maWVsZCA9PSAoYy53b3JrZmxvd190YWJsZV9maWVsZF9jb2RlICsgJy4kLicgKyBrKSkge1xyXG5cdFx0XHRcdFx0XHR2YXIgb1RkQ29kZSA9IHRmbS5vYmplY3RfZmllbGQuc3BsaXQoJy4kLicpWzFdO1xyXG5cdFx0XHRcdFx0XHRuZXdUcltvVGRDb2RlXSA9IHY7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0fSlcclxuXHRcdFx0aWYgKCFfLmlzRW1wdHkobmV3VHIpKSB7XHJcblx0XHRcdFx0b2JqW2Mub2JqZWN0X3RhYmxlX2ZpZWxkX2NvZGVdLnB1c2gobmV3VHIpO1xyXG5cdFx0XHR9XHJcblx0XHR9KVxyXG5cdH0pO1xyXG5cdHZhciByZWxhdGVkT2JqcyA9IHt9O1xyXG5cdHZhciBnZXRSZWxhdGVkRmllbGRWYWx1ZSA9IGZ1bmN0aW9uICh2YWx1ZUtleSwgcGFyZW50KSB7XHJcblx0XHRyZXR1cm4gdmFsdWVLZXkuc3BsaXQoJy4nKS5yZWR1Y2UoZnVuY3Rpb24gKG8sIHgpIHtcclxuXHRcdFx0cmV0dXJuIG9beF07XHJcblx0XHR9LCBwYXJlbnQpO1xyXG5cdH07XHJcblx0Xy5lYWNoKHRhYmxlVG9SZWxhdGVkTWFwLCBmdW5jdGlvbiAobWFwLCBrZXkpIHtcclxuXHRcdHZhciB0YWJsZUNvZGUgPSBtYXAuX0ZST01fVEFCTEVfQ09ERTtcclxuXHRcdGlmICghdGFibGVDb2RlKSB7XHJcblx0XHRcdGNvbnNvbGUud2FybigndGFibGVUb1JlbGF0ZWQ6IFsnICsga2V5ICsgJ10gbWlzc2luZyBjb3JyZXNwb25kaW5nIHRhYmxlLicpXHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR2YXIgcmVsYXRlZE9iamVjdE5hbWUgPSBrZXk7XHJcblx0XHRcdHZhciByZWxhdGVkT2JqZWN0VmFsdWVzID0gW107XHJcblx0XHRcdHZhciByZWxhdGVkT2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QocmVsYXRlZE9iamVjdE5hbWUsIHNwYWNlSWQpO1xyXG5cdFx0XHRfLmVhY2godmFsdWVzW3RhYmxlQ29kZV0sIGZ1bmN0aW9uICh0YWJsZVZhbHVlSXRlbSkge1xyXG5cdFx0XHRcdHZhciByZWxhdGVkT2JqZWN0VmFsdWUgPSB7fTtcclxuXHRcdFx0XHRfLmVhY2gobWFwLCBmdW5jdGlvbiAodmFsdWVLZXksIGZpZWxkS2V5KSB7XHJcblx0XHRcdFx0XHRpZiAoZmllbGRLZXkgIT0gJ19GUk9NX1RBQkxFX0NPREUnKSB7XHJcblx0XHRcdFx0XHRcdGlmICh2YWx1ZUtleS5zdGFydHNXaXRoKCdpbnN0YW5jZS4nKSkge1xyXG5cdFx0XHRcdFx0XHRcdHJlbGF0ZWRPYmplY3RWYWx1ZVtmaWVsZEtleV0gPSBnZXRSZWxhdGVkRmllbGRWYWx1ZSh2YWx1ZUtleSwgeyAnaW5zdGFuY2UnOiBpbnMgfSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0dmFyIHJlbGF0ZWRPYmplY3RGaWVsZFZhbHVlLCBmb3JtRmllbGRLZXk7XHJcblx0XHRcdFx0XHRcdFx0aWYgKHZhbHVlS2V5LnN0YXJ0c1dpdGgodGFibGVDb2RlICsgJy4nKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0Zm9ybUZpZWxkS2V5ID0gdmFsdWVLZXkuc3BsaXQoXCIuXCIpWzFdO1xyXG5cdFx0XHRcdFx0XHRcdFx0cmVsYXRlZE9iamVjdEZpZWxkVmFsdWUgPSBnZXRSZWxhdGVkRmllbGRWYWx1ZSh2YWx1ZUtleSwgeyBbdGFibGVDb2RlXTogdGFibGVWYWx1ZUl0ZW0gfSk7XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdGZvcm1GaWVsZEtleSA9IHZhbHVlS2V5O1xyXG5cdFx0XHRcdFx0XHRcdFx0cmVsYXRlZE9iamVjdEZpZWxkVmFsdWUgPSBnZXRSZWxhdGVkRmllbGRWYWx1ZSh2YWx1ZUtleSwgdmFsdWVzKVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR2YXIgZm9ybUZpZWxkID0gZ2V0Rm9ybUZpZWxkKGZvcm1GaWVsZHMsIGZvcm1GaWVsZEtleSk7XHJcblx0XHRcdFx0XHRcdFx0dmFyIHJlbGF0ZWRPYmplY3RGaWVsZCA9IHJlbGF0ZWRPYmplY3QuZmllbGRzW2ZpZWxkS2V5XTtcclxuXHRcdFx0XHRcdFx0XHRpZiAoIXJlbGF0ZWRPYmplY3RGaWVsZCB8fCAhZm9ybUZpZWxkKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm5cclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0aWYgKGZvcm1GaWVsZC50eXBlID09ICdvZGF0YScgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKHJlbGF0ZWRPYmplY3RGaWVsZC50eXBlKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKCFfLmlzRW1wdHkocmVsYXRlZE9iamVjdEZpZWxkVmFsdWUpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChyZWxhdGVkT2JqZWN0RmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmVsYXRlZE9iamVjdEZpZWxkVmFsdWUgPSBfLmNvbXBhY3QoXy5wbHVjayhyZWxhdGVkT2JqZWN0RmllbGRWYWx1ZSwgJ19pZCcpKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCFyZWxhdGVkT2JqZWN0RmllbGQubXVsdGlwbGUgJiYgIWZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJlbGF0ZWRPYmplY3RGaWVsZFZhbHVlID0gcmVsYXRlZE9iamVjdEZpZWxkVmFsdWUuX2lkXHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0Ly8g6KGo5Y2V6YCJ5Lq66YCJ57uE5a2X5q61IOiHsyDlr7nosaEgbG9va3VwIG1hc3Rlcl9kZXRhaWznsbvlnovlrZfmrrXlkIzmraVcclxuXHRcdFx0XHRcdFx0XHRpZiAoWyd1c2VyJywgJ2dyb3VwJ10uaW5jbHVkZXMoZm9ybUZpZWxkLnR5cGUpICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhyZWxhdGVkT2JqZWN0RmllbGQudHlwZSkgJiYgWyd1c2VycycsICdvcmdhbml6YXRpb25zJ10uaW5jbHVkZXMocmVsYXRlZE9iamVjdEZpZWxkLnJlZmVyZW5jZV90bykpIHtcclxuXHRcdFx0XHRcdFx0XHRcdGlmICghXy5pc0VtcHR5KHJlbGF0ZWRPYmplY3RGaWVsZFZhbHVlKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAocmVsYXRlZE9iamVjdEZpZWxkLm11bHRpcGxlICYmIGZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJlbGF0ZWRPYmplY3RGaWVsZFZhbHVlID0gXy5jb21wYWN0KF8ucGx1Y2socmVsYXRlZE9iamVjdEZpZWxkVmFsdWUsICdpZCcpKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCFyZWxhdGVkT2JqZWN0RmllbGQubXVsdGlwbGUgJiYgIWZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJlbGF0ZWRPYmplY3RGaWVsZFZhbHVlID0gcmVsYXRlZE9iamVjdEZpZWxkVmFsdWUuaWRcclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRyZWxhdGVkT2JqZWN0VmFsdWVbZmllbGRLZXldID0gcmVsYXRlZE9iamVjdEZpZWxkVmFsdWU7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRyZWxhdGVkT2JqZWN0VmFsdWVbJ190YWJsZSddID0ge1xyXG5cdFx0XHRcdFx0X2lkOiB0YWJsZVZhbHVlSXRlbVtcIl9pZFwiXSxcclxuXHRcdFx0XHRcdF9jb2RlOiB0YWJsZUNvZGVcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdHJlbGF0ZWRPYmplY3RWYWx1ZXMucHVzaChyZWxhdGVkT2JqZWN0VmFsdWUpO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0cmVsYXRlZE9ianNbcmVsYXRlZE9iamVjdE5hbWVdID0gcmVsYXRlZE9iamVjdFZhbHVlcztcclxuXHRcdH1cclxuXHR9KVxyXG5cclxuXHRpZiAoZmllbGRfbWFwX2JhY2tfc2NyaXB0KSB7XHJcblx0XHRfLmV4dGVuZChvYmosIEluc3RhbmNlUmVjb3JkUXVldWUuZXZhbEZpZWxkTWFwQmFja1NjcmlwdChmaWVsZF9tYXBfYmFja19zY3JpcHQsIGlucykpO1xyXG5cdH1cclxuXHQvLyDov4fmu6TmjonpnZ7ms5XnmoRrZXlcclxuXHR2YXIgZmlsdGVyT2JqID0ge307XHJcblxyXG5cdF8uZWFjaChfLmtleXMob2JqKSwgZnVuY3Rpb24gKGspIHtcclxuXHRcdGlmIChvYmplY3RGaWVsZEtleXMuaW5jbHVkZXMoaykpIHtcclxuXHRcdFx0ZmlsdGVyT2JqW2tdID0gb2JqW2tdO1xyXG5cdFx0fVxyXG5cdFx0Ly8gZWxzZSBpZihyZWxhdGVkT2JqZWN0c0tleXMuaW5jbHVkZXMoaykgJiYgXy5pc0FycmF5KG9ialtrXSkpe1xyXG5cdFx0Ly8gXHRpZihfLmlzQXJyYXkocmVsYXRlZE9ianNba10pKXtcclxuXHRcdC8vIFx0XHRyZWxhdGVkT2Jqc1trXSA9IHJlbGF0ZWRPYmpzW2tdLmNvbmNhdChvYmpba10pXHJcblx0XHQvLyBcdH1lbHNle1xyXG5cdFx0Ly8gXHRcdHJlbGF0ZWRPYmpzW2tdID0gb2JqW2tdXHJcblx0XHQvLyBcdH1cclxuXHRcdC8vIH1cclxuXHR9KVxyXG5cdHJldHVybiB7XHJcblx0XHRtYWluT2JqZWN0VmFsdWU6IGZpbHRlck9iaixcclxuXHRcdHJlbGF0ZWRPYmplY3RzVmFsdWU6IHJlbGF0ZWRPYmpzXHJcblx0fTtcclxufVxyXG5cclxuSW5zdGFuY2VSZWNvcmRRdWV1ZS5ldmFsRmllbGRNYXBCYWNrU2NyaXB0ID0gZnVuY3Rpb24gKGZpZWxkX21hcF9iYWNrX3NjcmlwdCwgaW5zKSB7XHJcblx0dmFyIHNjcmlwdCA9IFwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHsgXCIgKyBmaWVsZF9tYXBfYmFja19zY3JpcHQgKyBcIiB9XCI7XHJcblx0dmFyIGZ1bmMgPSBfZXZhbChzY3JpcHQsIFwiZmllbGRfbWFwX3NjcmlwdFwiKTtcclxuXHR2YXIgdmFsdWVzID0gZnVuYyhpbnMpO1xyXG5cdGlmIChfLmlzT2JqZWN0KHZhbHVlcykpIHtcclxuXHRcdHJldHVybiB2YWx1ZXM7XHJcblx0fSBlbHNlIHtcclxuXHRcdGNvbnNvbGUuZXJyb3IoXCJldmFsRmllbGRNYXBCYWNrU2NyaXB0OiDohJrmnKzov5Tlm57lgLznsbvlnovkuI3mmK/lr7nosaFcIik7XHJcblx0fVxyXG5cdHJldHVybiB7fVxyXG59XHJcblxyXG5JbnN0YW5jZVJlY29yZFF1ZXVlLnN5bmNSZWxhdGVkT2JqZWN0c1ZhbHVlID0gZnVuY3Rpb24gKG1haW5SZWNvcmRJZCwgcmVsYXRlZE9iamVjdHMsIHJlbGF0ZWRPYmplY3RzVmFsdWUsIHNwYWNlSWQsIGlucykge1xyXG5cdHZhciBpbnNJZCA9IGlucy5faWQ7XHJcblxyXG5cdF8uZWFjaChyZWxhdGVkT2JqZWN0cywgZnVuY3Rpb24gKHJlbGF0ZWRPYmplY3QpIHtcclxuXHRcdHZhciBvYmplY3RDb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKHJlbGF0ZWRPYmplY3Qub2JqZWN0X25hbWUsIHNwYWNlSWQpO1xyXG5cdFx0dmFyIHRhYmxlTWFwID0ge307XHJcblx0XHRfLmVhY2gocmVsYXRlZE9iamVjdHNWYWx1ZVtyZWxhdGVkT2JqZWN0Lm9iamVjdF9uYW1lXSwgZnVuY3Rpb24gKHJlbGF0ZWRPYmplY3RWYWx1ZSkge1xyXG5cdFx0XHR2YXIgdGFibGVfaWQgPSByZWxhdGVkT2JqZWN0VmFsdWUuX3RhYmxlLl9pZDtcclxuXHRcdFx0dmFyIHRhYmxlX2NvZGUgPSByZWxhdGVkT2JqZWN0VmFsdWUuX3RhYmxlLl9jb2RlO1xyXG5cdFx0XHRpZiAoIXRhYmxlTWFwW3RhYmxlX2NvZGVdKSB7XHJcblx0XHRcdFx0dGFibGVNYXBbdGFibGVfY29kZV0gPSBbXVxyXG5cdFx0XHR9O1xyXG5cdFx0XHR0YWJsZU1hcFt0YWJsZV9jb2RlXS5wdXNoKHRhYmxlX2lkKTtcclxuXHRcdFx0dmFyIG9sZFJlbGF0ZWRSZWNvcmQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVsYXRlZE9iamVjdC5vYmplY3RfbmFtZSwgc3BhY2VJZCkuZmluZE9uZSh7IFtyZWxhdGVkT2JqZWN0LmZvcmVpZ25fa2V5XTogbWFpblJlY29yZElkLCBcImluc3RhbmNlcy5faWRcIjogaW5zSWQsIF90YWJsZTogcmVsYXRlZE9iamVjdFZhbHVlLl90YWJsZSB9LCB7IGZpZWxkczogeyBfaWQ6IDEgfSB9KVxyXG5cdFx0XHRpZiAob2xkUmVsYXRlZFJlY29yZCkge1xyXG5cdFx0XHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWxhdGVkT2JqZWN0Lm9iamVjdF9uYW1lLCBzcGFjZUlkKS51cGRhdGUoeyBfaWQ6IG9sZFJlbGF0ZWRSZWNvcmQuX2lkIH0sIHsgJHNldDogcmVsYXRlZE9iamVjdFZhbHVlIH0pXHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cmVsYXRlZE9iamVjdFZhbHVlW3JlbGF0ZWRPYmplY3QuZm9yZWlnbl9rZXldID0gbWFpblJlY29yZElkO1xyXG5cdFx0XHRcdHJlbGF0ZWRPYmplY3RWYWx1ZS5zcGFjZSA9IHNwYWNlSWQ7XHJcblx0XHRcdFx0cmVsYXRlZE9iamVjdFZhbHVlLm93bmVyID0gaW5zLmFwcGxpY2FudDtcclxuXHRcdFx0XHRyZWxhdGVkT2JqZWN0VmFsdWUuY3JlYXRlZF9ieSA9IGlucy5hcHBsaWNhbnQ7XHJcblx0XHRcdFx0cmVsYXRlZE9iamVjdFZhbHVlLm1vZGlmaWVkX2J5ID0gaW5zLmFwcGxpY2FudDtcclxuXHRcdFx0XHRyZWxhdGVkT2JqZWN0VmFsdWUuX2lkID0gb2JqZWN0Q29sbGVjdGlvbi5fbWFrZU5ld0lEKCk7XHJcblx0XHRcdFx0dmFyIGluc3RhbmNlX3N0YXRlID0gaW5zLnN0YXRlO1xyXG5cdFx0XHRcdGlmIChpbnMuc3RhdGUgPT09ICdjb21wbGV0ZWQnICYmIGlucy5maW5hbF9kZWNpc2lvbikge1xyXG5cdFx0XHRcdFx0aW5zdGFuY2Vfc3RhdGUgPSBpbnMuZmluYWxfZGVjaXNpb247XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJlbGF0ZWRPYmplY3RWYWx1ZS5pbnN0YW5jZXMgPSBbe1xyXG5cdFx0XHRcdFx0X2lkOiBpbnNJZCxcclxuXHRcdFx0XHRcdHN0YXRlOiBpbnN0YW5jZV9zdGF0ZVxyXG5cdFx0XHRcdH1dO1xyXG5cdFx0XHRcdHJlbGF0ZWRPYmplY3RWYWx1ZS5pbnN0YW5jZV9zdGF0ZSA9IGluc3RhbmNlX3N0YXRlO1xyXG5cdFx0XHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWxhdGVkT2JqZWN0Lm9iamVjdF9uYW1lLCBzcGFjZUlkKS5pbnNlcnQocmVsYXRlZE9iamVjdFZhbHVlLCB7IHZhbGlkYXRlOiBmYWxzZSwgZmlsdGVyOiBmYWxzZSB9KVxyXG5cdFx0XHR9XHJcblx0XHR9KVxyXG5cdFx0Ly/muIXnkIbnlLPor7fljZXkuIrooqvliKDpmaTlrZDooajorrDlvZXlr7nlupTnmoTnm7jlhbPooajorrDlvZVcclxuXHRcdF8uZWFjaCh0YWJsZU1hcCwgZnVuY3Rpb24gKHRhYmxlSWRzLCB0YWJsZUNvZGUpIHtcclxuXHRcdFx0b2JqZWN0Q29sbGVjdGlvbi5yZW1vdmUoe1xyXG5cdFx0XHRcdFtyZWxhdGVkT2JqZWN0LmZvcmVpZ25fa2V5XTogbWFpblJlY29yZElkLFxyXG5cdFx0XHRcdFwiaW5zdGFuY2VzLl9pZFwiOiBpbnNJZCxcclxuXHRcdFx0XHRcIl90YWJsZS5fY29kZVwiOiB0YWJsZUNvZGUsXHJcblx0XHRcdFx0XCJfdGFibGUuX2lkXCI6IHsgJG5pbjogdGFibGVJZHMgfVxyXG5cdFx0XHR9KVxyXG5cdFx0fSlcclxuXHR9KTtcclxuXHJcblx0dGFibGVJZHMgPSBfLmNvbXBhY3QodGFibGVJZHMpO1xyXG5cclxuXHJcbn1cclxuXHJcbkluc3RhbmNlUmVjb3JkUXVldWUuc2VuZERvYyA9IGZ1bmN0aW9uIChkb2MpIHtcclxuXHRpZiAoSW5zdGFuY2VSZWNvcmRRdWV1ZS5kZWJ1Zykge1xyXG5cdFx0Y29uc29sZS5sb2coXCJzZW5kRG9jXCIpO1xyXG5cdFx0Y29uc29sZS5sb2coZG9jKTtcclxuXHR9XHJcblxyXG5cdHZhciBpbnNJZCA9IGRvYy5pbmZvLmluc3RhbmNlX2lkLFxyXG5cdFx0cmVjb3JkcyA9IGRvYy5pbmZvLnJlY29yZHM7XHJcblx0dmFyIGZpZWxkcyA9IHtcclxuXHRcdGZsb3c6IDEsXHJcblx0XHR2YWx1ZXM6IDEsXHJcblx0XHRhcHBsaWNhbnQ6IDEsXHJcblx0XHRzcGFjZTogMSxcclxuXHRcdGZvcm06IDEsXHJcblx0XHRmb3JtX3ZlcnNpb246IDEsXHJcblx0XHR0cmFjZXM6IDFcclxuXHR9O1xyXG5cdEluc3RhbmNlUmVjb3JkUXVldWUuc3luY0luc0ZpZWxkcy5mb3JFYWNoKGZ1bmN0aW9uIChmKSB7XHJcblx0XHRmaWVsZHNbZl0gPSAxO1xyXG5cdH0pXHJcblx0dmFyIGlucyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignaW5zdGFuY2VzJykuZmluZE9uZShpbnNJZCwge1xyXG5cdFx0ZmllbGRzOiBmaWVsZHNcclxuXHR9KTtcclxuXHR2YXIgdmFsdWVzID0gaW5zLnZhbHVlcyxcclxuXHRcdHNwYWNlSWQgPSBpbnMuc3BhY2U7XHJcblxyXG5cdGlmIChyZWNvcmRzICYmICFfLmlzRW1wdHkocmVjb3JkcykpIHtcclxuXHRcdC8vIOatpOaDheWGteWxnuS6juS7jmNyZWF0b3LkuK3lj5HotbflrqHmibnvvIzmiJbogIXlt7Lnu4/ku45BcHBz5ZCM5q2l5Yiw5LqGY3JlYXRvclxyXG5cdFx0dmFyIG9iamVjdE5hbWUgPSByZWNvcmRzWzBdLm87XHJcblx0XHR2YXIgb3cgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ29iamVjdF93b3JrZmxvd3MnKS5maW5kT25lKHtcclxuXHRcdFx0b2JqZWN0X25hbWU6IG9iamVjdE5hbWUsXHJcblx0XHRcdGZsb3dfaWQ6IGlucy5mbG93XHJcblx0XHR9KTtcclxuXHRcdHZhclxyXG5cdFx0XHRvYmplY3RDb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdE5hbWUsIHNwYWNlSWQpLFxyXG5cdFx0XHRzeW5jX2F0dGFjaG1lbnQgPSBvdy5zeW5jX2F0dGFjaG1lbnQ7XHJcblx0XHR2YXIgb2JqZWN0SW5mbyA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdE5hbWUsIHNwYWNlSWQpO1xyXG5cdFx0b2JqZWN0Q29sbGVjdGlvbi5maW5kKHtcclxuXHRcdFx0X2lkOiB7XHJcblx0XHRcdFx0JGluOiByZWNvcmRzWzBdLmlkc1xyXG5cdFx0XHR9XHJcblx0XHR9KS5mb3JFYWNoKGZ1bmN0aW9uIChyZWNvcmQpIHtcclxuXHRcdFx0dHJ5IHtcclxuXHRcdFx0XHR2YXIgc3luY1ZhbHVlcyA9IEluc3RhbmNlUmVjb3JkUXVldWUuc3luY1ZhbHVlcyhvdy5maWVsZF9tYXBfYmFjaywgdmFsdWVzLCBpbnMsIG9iamVjdEluZm8sIG93LmZpZWxkX21hcF9iYWNrX3NjcmlwdCwgcmVjb3JkKVxyXG5cdFx0XHRcdHZhciBzZXRPYmogPSBzeW5jVmFsdWVzLm1haW5PYmplY3RWYWx1ZTtcclxuXHJcblx0XHRcdFx0dmFyIGluc3RhbmNlX3N0YXRlID0gaW5zLnN0YXRlO1xyXG5cdFx0XHRcdGlmIChpbnMuc3RhdGUgPT09ICdjb21wbGV0ZWQnICYmIGlucy5maW5hbF9kZWNpc2lvbikge1xyXG5cdFx0XHRcdFx0aW5zdGFuY2Vfc3RhdGUgPSBpbnMuZmluYWxfZGVjaXNpb247XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHNldE9ialsnaW5zdGFuY2VzLiQuc3RhdGUnXSA9IHNldE9iai5pbnN0YW5jZV9zdGF0ZSA9IGluc3RhbmNlX3N0YXRlO1xyXG5cclxuXHRcdFx0XHRvYmplY3RDb2xsZWN0aW9uLnVwZGF0ZSh7XHJcblx0XHRcdFx0XHRfaWQ6IHJlY29yZC5faWQsXHJcblx0XHRcdFx0XHQnaW5zdGFuY2VzLl9pZCc6IGluc0lkXHJcblx0XHRcdFx0fSwge1xyXG5cdFx0XHRcdFx0JHNldDogc2V0T2JqXHJcblx0XHRcdFx0fSlcclxuXHJcblx0XHRcdFx0dmFyIHJlbGF0ZWRPYmplY3RzID0gQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0cyhvdy5vYmplY3RfbmFtZSwgc3BhY2VJZCk7XHJcblx0XHRcdFx0dmFyIHJlbGF0ZWRPYmplY3RzVmFsdWUgPSBzeW5jVmFsdWVzLnJlbGF0ZWRPYmplY3RzVmFsdWU7XHJcblx0XHRcdFx0SW5zdGFuY2VSZWNvcmRRdWV1ZS5zeW5jUmVsYXRlZE9iamVjdHNWYWx1ZShyZWNvcmQuX2lkLCByZWxhdGVkT2JqZWN0cywgcmVsYXRlZE9iamVjdHNWYWx1ZSwgc3BhY2VJZCwgaW5zKTtcclxuXHJcblxyXG5cdFx0XHRcdC8vIOS7peacgOe7iOeUs+ivt+WNlemZhOS7tuS4uuWHhu+8jOaXp+eahHJlY29yZOS4remZhOS7tuWIoOmZpFxyXG5cdFx0XHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbignY21zX2ZpbGVzJykucmVtb3ZlKHtcclxuXHRcdFx0XHRcdCdwYXJlbnQnOiB7XHJcblx0XHRcdFx0XHRcdG86IG9iamVjdE5hbWUsXHJcblx0XHRcdFx0XHRcdGlkczogW3JlY29yZC5faWRdXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0XHR2YXIgcmVtb3ZlT2xkRmlsZXMgPSBmdW5jdGlvbiAoY2IpIHtcclxuXHRcdFx0XHRcdHJldHVybiBjZnMuZmlsZXMucmVtb3ZlKHtcclxuXHRcdFx0XHRcdFx0J21ldGFkYXRhLnJlY29yZF9pZCc6IHJlY29yZC5faWRcclxuXHRcdFx0XHRcdH0sIGNiKTtcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdE1ldGVvci53cmFwQXN5bmMocmVtb3ZlT2xkRmlsZXMpKCk7XHJcblx0XHRcdFx0Ly8g5ZCM5q2l5paw6ZmE5Lu2XHJcblx0XHRcdFx0SW5zdGFuY2VSZWNvcmRRdWV1ZS5zeW5jQXR0YWNoKHN5bmNfYXR0YWNobWVudCwgaW5zSWQsIHJlY29yZC5zcGFjZSwgcmVjb3JkLl9pZCwgb2JqZWN0TmFtZSk7XHJcblxyXG5cdFx0XHRcdC8vIOaJp+ihjOWFrOW8j1xyXG5cdFx0XHRcdHJ1blF1b3RlZChvYmplY3ROYW1lLCByZWNvcmQuX2lkKTtcclxuXHRcdFx0fSBjYXRjaCAoZXJyb3IpIHtcclxuXHRcdFx0XHRjb25zb2xlLmVycm9yKGVycm9yLnN0YWNrKTtcclxuXHRcdFx0XHRvYmplY3RDb2xsZWN0aW9uLnVwZGF0ZSh7XHJcblx0XHRcdFx0XHRfaWQ6IHJlY29yZC5faWQsXHJcblx0XHRcdFx0XHQnaW5zdGFuY2VzLl9pZCc6IGluc0lkXHJcblx0XHRcdFx0fSwge1xyXG5cdFx0XHRcdFx0JHNldDoge1xyXG5cdFx0XHRcdFx0XHQnaW5zdGFuY2VzLiQuc3RhdGUnOiAncGVuZGluZycsXHJcblx0XHRcdFx0XHRcdCdpbnN0YW5jZV9zdGF0ZSc6ICdwZW5kaW5nJ1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pXHJcblxyXG5cdFx0XHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbignY21zX2ZpbGVzJykucmVtb3ZlKHtcclxuXHRcdFx0XHRcdCdwYXJlbnQnOiB7XHJcblx0XHRcdFx0XHRcdG86IG9iamVjdE5hbWUsXHJcblx0XHRcdFx0XHRcdGlkczogW3JlY29yZC5faWRdXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0XHRjZnMuZmlsZXMucmVtb3ZlKHtcclxuXHRcdFx0XHRcdCdtZXRhZGF0YS5yZWNvcmRfaWQnOiByZWNvcmQuX2lkXHJcblx0XHRcdFx0fSlcclxuXHJcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGVycm9yKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH0pXHJcblx0fSBlbHNlIHtcclxuXHRcdC8vIOatpOaDheWGteWxnuS6juS7jmFwcHPkuK3lj5HotbflrqHmiblcclxuXHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbignb2JqZWN0X3dvcmtmbG93cycpLmZpbmQoe1xyXG5cdFx0XHRmbG93X2lkOiBpbnMuZmxvd1xyXG5cdFx0fSkuZm9yRWFjaChmdW5jdGlvbiAob3cpIHtcclxuXHRcdFx0dHJ5IHtcclxuXHRcdFx0XHR2YXJcclxuXHRcdFx0XHRcdG9iamVjdENvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob3cub2JqZWN0X25hbWUsIHNwYWNlSWQpLFxyXG5cdFx0XHRcdFx0c3luY19hdHRhY2htZW50ID0gb3cuc3luY19hdHRhY2htZW50LFxyXG5cdFx0XHRcdFx0bmV3UmVjb3JkSWQgPSBvYmplY3RDb2xsZWN0aW9uLl9tYWtlTmV3SUQoKSxcclxuXHRcdFx0XHRcdG9iamVjdE5hbWUgPSBvdy5vYmplY3RfbmFtZTtcclxuXHJcblx0XHRcdFx0dmFyIG9iamVjdEluZm8gPSBDcmVhdG9yLmdldE9iamVjdChvdy5vYmplY3RfbmFtZSwgc3BhY2VJZCk7XHJcblx0XHRcdFx0dmFyIHN5bmNWYWx1ZXMgPSBJbnN0YW5jZVJlY29yZFF1ZXVlLnN5bmNWYWx1ZXMob3cuZmllbGRfbWFwX2JhY2ssIHZhbHVlcywgaW5zLCBvYmplY3RJbmZvLCBvdy5maWVsZF9tYXBfYmFja19zY3JpcHQpO1xyXG5cdFx0XHRcdHZhciBuZXdPYmogPSBzeW5jVmFsdWVzLm1haW5PYmplY3RWYWx1ZTtcclxuXHJcblx0XHRcdFx0bmV3T2JqLl9pZCA9IG5ld1JlY29yZElkO1xyXG5cdFx0XHRcdG5ld09iai5zcGFjZSA9IHNwYWNlSWQ7XHJcblx0XHRcdFx0bmV3T2JqLm5hbWUgPSBuZXdPYmoubmFtZSB8fCBpbnMubmFtZTtcclxuXHJcblx0XHRcdFx0dmFyIGluc3RhbmNlX3N0YXRlID0gaW5zLnN0YXRlO1xyXG5cdFx0XHRcdGlmIChpbnMuc3RhdGUgPT09ICdjb21wbGV0ZWQnICYmIGlucy5maW5hbF9kZWNpc2lvbikge1xyXG5cdFx0XHRcdFx0aW5zdGFuY2Vfc3RhdGUgPSBpbnMuZmluYWxfZGVjaXNpb247XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdG5ld09iai5pbnN0YW5jZXMgPSBbe1xyXG5cdFx0XHRcdFx0X2lkOiBpbnNJZCxcclxuXHRcdFx0XHRcdHN0YXRlOiBpbnN0YW5jZV9zdGF0ZVxyXG5cdFx0XHRcdH1dO1xyXG5cdFx0XHRcdG5ld09iai5pbnN0YW5jZV9zdGF0ZSA9IGluc3RhbmNlX3N0YXRlO1xyXG5cclxuXHRcdFx0XHRuZXdPYmoub3duZXIgPSBpbnMuYXBwbGljYW50O1xyXG5cdFx0XHRcdG5ld09iai5jcmVhdGVkX2J5ID0gaW5zLmFwcGxpY2FudDtcclxuXHRcdFx0XHRuZXdPYmoubW9kaWZpZWRfYnkgPSBpbnMuYXBwbGljYW50O1xyXG5cdFx0XHRcdHZhciByID0gb2JqZWN0Q29sbGVjdGlvbi5pbnNlcnQobmV3T2JqKTtcclxuXHRcdFx0XHRpZiAocikge1xyXG5cdFx0XHRcdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKCdpbnN0YW5jZXMnKS51cGRhdGUoaW5zLl9pZCwge1xyXG5cdFx0XHRcdFx0XHQkcHVzaDoge1xyXG5cdFx0XHRcdFx0XHRcdHJlY29yZF9pZHM6IHtcclxuXHRcdFx0XHRcdFx0XHRcdG86IG9iamVjdE5hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRpZHM6IFtuZXdSZWNvcmRJZF1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHR2YXIgcmVsYXRlZE9iamVjdHMgPSBDcmVhdG9yLmdldFJlbGF0ZWRPYmplY3RzKG93Lm9iamVjdF9uYW1lLCBzcGFjZUlkKTtcclxuXHRcdFx0XHRcdHZhciByZWxhdGVkT2JqZWN0c1ZhbHVlID0gc3luY1ZhbHVlcy5yZWxhdGVkT2JqZWN0c1ZhbHVlO1xyXG5cdFx0XHRcdFx0SW5zdGFuY2VSZWNvcmRRdWV1ZS5zeW5jUmVsYXRlZE9iamVjdHNWYWx1ZShuZXdSZWNvcmRJZCwgcmVsYXRlZE9iamVjdHMsIHJlbGF0ZWRPYmplY3RzVmFsdWUsIHNwYWNlSWQsIGlucyk7XHJcblx0XHRcdFx0XHQvLyB3b3JrZmxvd+mHjOWPkei1t+WuoeaJueWQju+8jOWQjOatpeaXtuS5n+WPr+S7peS/ruaUueebuOWFs+ihqOeahOWtl+auteWAvCAjMTE4M1xyXG5cdFx0XHRcdFx0dmFyIHJlY29yZCA9IG9iamVjdENvbGxlY3Rpb24uZmluZE9uZShuZXdSZWNvcmRJZCk7XHJcblx0XHRcdFx0XHRJbnN0YW5jZVJlY29yZFF1ZXVlLnN5bmNWYWx1ZXMob3cuZmllbGRfbWFwX2JhY2ssIHZhbHVlcywgaW5zLCBvYmplY3RJbmZvLCBvdy5maWVsZF9tYXBfYmFja19zY3JpcHQsIHJlY29yZCk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHQvLyDpmYTku7blkIzmraVcclxuXHRcdFx0XHRJbnN0YW5jZVJlY29yZFF1ZXVlLnN5bmNBdHRhY2goc3luY19hdHRhY2htZW50LCBpbnNJZCwgc3BhY2VJZCwgbmV3UmVjb3JkSWQsIG9iamVjdE5hbWUpO1xyXG5cclxuXHRcdFx0XHQvLyDmiafooYzlhazlvI9cclxuXHRcdFx0XHRydW5RdW90ZWQob2JqZWN0TmFtZSwgbmV3UmVjb3JkSWQpO1xyXG5cdFx0XHR9IGNhdGNoIChlcnJvcikge1xyXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoZXJyb3Iuc3RhY2spO1xyXG5cclxuXHRcdFx0XHRvYmplY3RDb2xsZWN0aW9uLnJlbW92ZSh7XHJcblx0XHRcdFx0XHRfaWQ6IG5ld1JlY29yZElkLFxyXG5cdFx0XHRcdFx0c3BhY2U6IHNwYWNlSWRcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2luc3RhbmNlcycpLnVwZGF0ZShpbnMuX2lkLCB7XHJcblx0XHRcdFx0XHQkcHVsbDoge1xyXG5cdFx0XHRcdFx0XHRyZWNvcmRfaWRzOiB7XHJcblx0XHRcdFx0XHRcdFx0bzogb2JqZWN0TmFtZSxcclxuXHRcdFx0XHRcdFx0XHRpZHM6IFtuZXdSZWNvcmRJZF1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pXHJcblx0XHRcdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKCdjbXNfZmlsZXMnKS5yZW1vdmUoe1xyXG5cdFx0XHRcdFx0J3BhcmVudCc6IHtcclxuXHRcdFx0XHRcdFx0bzogb2JqZWN0TmFtZSxcclxuXHRcdFx0XHRcdFx0aWRzOiBbbmV3UmVjb3JkSWRdXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0XHRjZnMuZmlsZXMucmVtb3ZlKHtcclxuXHRcdFx0XHRcdCdtZXRhZGF0YS5yZWNvcmRfaWQnOiBuZXdSZWNvcmRJZFxyXG5cdFx0XHRcdH0pXHJcblxyXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihlcnJvcik7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9KVxyXG5cdH1cclxuXHJcblx0aWYgKGRvYy5faWQpIHtcclxuXHRcdEluc3RhbmNlUmVjb3JkUXVldWUuY29sbGVjdGlvbi51cGRhdGUoZG9jLl9pZCwge1xyXG5cdFx0XHQkc2V0OiB7XHJcblx0XHRcdFx0J2luZm8uc3luY19kYXRlJzogbmV3IERhdGUoKVxyXG5cdFx0XHR9XHJcblx0XHR9KVxyXG5cdH1cclxuXHJcbn0iLCJNZXRlb3Iuc3RhcnR1cCAtPlxyXG5cdGlmIE1ldGVvci5zZXR0aW5ncy5jcm9uPy5pbnN0YW5jZXJlY29yZHF1ZXVlX2ludGVydmFsXHJcblx0XHRJbnN0YW5jZVJlY29yZFF1ZXVlLkNvbmZpZ3VyZVxyXG5cdFx0XHRzZW5kSW50ZXJ2YWw6IE1ldGVvci5zZXR0aW5ncy5jcm9uLmluc3RhbmNlcmVjb3JkcXVldWVfaW50ZXJ2YWxcclxuXHRcdFx0c2VuZEJhdGNoU2l6ZTogMTBcclxuXHRcdFx0a2VlcERvY3M6IHRydWVcclxuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHZhciByZWY7XG4gIGlmICgocmVmID0gTWV0ZW9yLnNldHRpbmdzLmNyb24pICE9IG51bGwgPyByZWYuaW5zdGFuY2VyZWNvcmRxdWV1ZV9pbnRlcnZhbCA6IHZvaWQgMCkge1xuICAgIHJldHVybiBJbnN0YW5jZVJlY29yZFF1ZXVlLkNvbmZpZ3VyZSh7XG4gICAgICBzZW5kSW50ZXJ2YWw6IE1ldGVvci5zZXR0aW5ncy5jcm9uLmluc3RhbmNlcmVjb3JkcXVldWVfaW50ZXJ2YWwsXG4gICAgICBzZW5kQmF0Y2hTaXplOiAxMCxcbiAgICAgIGtlZXBEb2NzOiB0cnVlXG4gICAgfSk7XG4gIH1cbn0pO1xuIiwiaW1wb3J0IHsgY2hlY2tOcG1WZXJzaW9ucyB9IGZyb20gJ21ldGVvci90bWVhc2RheTpjaGVjay1ucG0tdmVyc2lvbnMnO1xyXG5jaGVja05wbVZlcnNpb25zKHtcclxuXHRcImV2YWxcIjogXCJeMC4xLjJcIlxyXG59LCAnc3RlZWRvczppbnN0YW5jZS1yZWNvcmQtcXVldWUnKTtcclxuIl19
