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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczppbnN0YW5jZS1yZWNvcmQtcXVldWUvbGliL2NvbW1vbi9tYWluLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmluc3RhbmNlLXJlY29yZC1xdWV1ZS9saWIvY29tbW9uL2RvY3MuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6aW5zdGFuY2UtcmVjb3JkLXF1ZXVlL2xpYi9zZXJ2ZXIvYXBpLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2luc3RhbmNlLXJlY29yZC1xdWV1ZS9zZXJ2ZXIvc3RhcnR1cC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9zdGFydHVwLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczppbnN0YW5jZS1yZWNvcmQtcXVldWUvc2VydmVyL2NoZWNrTnBtLmpzIl0sIm5hbWVzIjpbIkluc3RhbmNlUmVjb3JkUXVldWUiLCJFdmVudFN0YXRlIiwiY29sbGVjdGlvbiIsImRiIiwiaW5zdGFuY2VfcmVjb3JkX3F1ZXVlIiwiTW9uZ28iLCJDb2xsZWN0aW9uIiwiX3ZhbGlkYXRlRG9jdW1lbnQiLCJkb2MiLCJjaGVjayIsImluZm8iLCJPYmplY3QiLCJzZW50IiwiTWF0Y2giLCJPcHRpb25hbCIsIkJvb2xlYW4iLCJzZW5kaW5nIiwiSW50ZWdlciIsImNyZWF0ZWRBdCIsIkRhdGUiLCJjcmVhdGVkQnkiLCJPbmVPZiIsIlN0cmluZyIsInNlbmQiLCJvcHRpb25zIiwiY3VycmVudFVzZXIiLCJNZXRlb3IiLCJpc0NsaWVudCIsInVzZXJJZCIsImlzU2VydmVyIiwiXyIsImV4dGVuZCIsInRlc3QiLCJwaWNrIiwiaW5zZXJ0Iiwib2JqZWN0cWwiLCJyZXF1aXJlIiwicnVuUXVvdGVkIiwib2JqZWN0TmFtZSIsInJlY29yZElkIiwicnVuUXVvdGVkQnlPYmplY3RGaWVsZEZvcm11bGFzIiwicnVuUXVvdGVkQnlPYmplY3RGaWVsZFN1bW1hcmllcyIsIl9ldmFsIiwiaXNDb25maWd1cmVkIiwic2VuZFdvcmtlciIsInRhc2siLCJpbnRlcnZhbCIsImRlYnVnIiwiY29uc29sZSIsImxvZyIsInNldEludGVydmFsIiwiZXJyb3IiLCJtZXNzYWdlIiwiQ29uZmlndXJlIiwic2VsZiIsInNlbmRUaW1lb3V0IiwiRXJyb3IiLCJfcXVlcnlTZW5kIiwic2VuZERvYyIsIl9pZCIsInNlcnZlclNlbmQiLCJpc1NlbmRpbmdEb2MiLCJzZW5kSW50ZXJ2YWwiLCJfZW5zdXJlSW5kZXgiLCJub3ciLCJ0aW1lb3V0QXQiLCJyZXNlcnZlZCIsInVwZGF0ZSIsIiRsdCIsIiRzZXQiLCJyZXN1bHQiLCJrZWVwRG9jcyIsInJlbW92ZSIsInNlbnRBdCIsImJhdGNoU2l6ZSIsInNlbmRCYXRjaFNpemUiLCJwZW5kaW5nRG9jcyIsImZpbmQiLCIkYW5kIiwiZXJyTXNnIiwiJGV4aXN0cyIsInNvcnQiLCJsaW1pdCIsImZvckVhY2giLCJzdGFjayIsInN5bmNBdHRhY2giLCJzeW5jX2F0dGFjaG1lbnQiLCJpbnNJZCIsInNwYWNlSWQiLCJuZXdSZWNvcmRJZCIsImNmcyIsImluc3RhbmNlcyIsImYiLCJoYXNTdG9yZWQiLCJuZXdGaWxlIiwiRlMiLCJGaWxlIiwiY21zRmlsZUlkIiwiQ3JlYXRvciIsImdldENvbGxlY3Rpb24iLCJfbWFrZU5ld0lEIiwiYXR0YWNoRGF0YSIsImNyZWF0ZVJlYWRTdHJlYW0iLCJ0eXBlIiwib3JpZ2luYWwiLCJlcnIiLCJyZWFzb24iLCJuYW1lIiwic2l6ZSIsIm1ldGFkYXRhIiwib3duZXIiLCJvd25lcl9uYW1lIiwic3BhY2UiLCJyZWNvcmRfaWQiLCJvYmplY3RfbmFtZSIsInBhcmVudCIsImZpbGVzIiwid3JhcEFzeW5jIiwiY2IiLCJvbmNlIiwic3RvcmVOYW1lIiwibyIsImlkcyIsImV4dGVudGlvbiIsImV4dGVuc2lvbiIsInZlcnNpb25zIiwiY3JlYXRlZF9ieSIsIm1vZGlmaWVkX2J5IiwicGFyZW50cyIsImluY2x1ZGVzIiwicHVzaCIsImN1cnJlbnQiLCIkYWRkVG9TZXQiLCJzeW5jSW5zRmllbGRzIiwic3luY1ZhbHVlcyIsImZpZWxkX21hcF9iYWNrIiwidmFsdWVzIiwiaW5zIiwib2JqZWN0SW5mbyIsImZpZWxkX21hcF9iYWNrX3NjcmlwdCIsInJlY29yZCIsIm9iaiIsInRhYmxlRmllbGRDb2RlcyIsInRhYmxlRmllbGRNYXAiLCJ0YWJsZVRvUmVsYXRlZE1hcCIsImZvcm0iLCJmaW5kT25lIiwiZm9ybUZpZWxkcyIsImZvcm1fdmVyc2lvbiIsImZpZWxkcyIsImZvcm1WZXJzaW9uIiwiaGlzdG9yeXMiLCJoIiwib2JqZWN0RmllbGRzIiwib2JqZWN0RmllbGRLZXlzIiwia2V5cyIsInJlbGF0ZWRPYmplY3RzIiwiZ2V0UmVsYXRlZE9iamVjdHMiLCJyZWxhdGVkT2JqZWN0c0tleXMiLCJwbHVjayIsImZvcm1UYWJsZUZpZWxkcyIsImZpbHRlciIsImZvcm1GaWVsZCIsImZvcm1UYWJsZUZpZWxkc0NvZGUiLCJnZXRSZWxhdGVkT2JqZWN0RmllbGQiLCJrZXkiLCJyZWxhdGVkT2JqZWN0c0tleSIsInN0YXJ0c1dpdGgiLCJnZXRGb3JtVGFibGVGaWVsZCIsImZvcm1UYWJsZUZpZWxkQ29kZSIsImdldEZvcm1GaWVsZCIsIl9mb3JtRmllbGRzIiwiX2ZpZWxkQ29kZSIsImVhY2giLCJmZiIsImNvZGUiLCJmbSIsInJlbGF0ZWRPYmplY3RGaWVsZCIsIm9iamVjdF9maWVsZCIsImZvcm1UYWJsZUZpZWxkIiwid29ya2Zsb3dfZmllbGQiLCJvVGFibGVDb2RlIiwic3BsaXQiLCJvVGFibGVGaWVsZENvZGUiLCJ0YWJsZVRvUmVsYXRlZE1hcEtleSIsIndUYWJsZUNvZGUiLCJpbmRleE9mIiwiaGFzT3duUHJvcGVydHkiLCJpc0FycmF5IiwiSlNPTiIsInN0cmluZ2lmeSIsIndvcmtmbG93X3RhYmxlX2ZpZWxkX2NvZGUiLCJvYmplY3RfdGFibGVfZmllbGRfY29kZSIsIndGaWVsZCIsIm9GaWVsZCIsInJlZmVyZW5jZV90byIsImlzRW1wdHkiLCJtdWx0aXBsZSIsImlzX211bHRpc2VsZWN0IiwiY29tcGFjdCIsImlkIiwiaXNTdHJpbmciLCJvQ29sbGVjdGlvbiIsInJlZmVyT2JqZWN0IiwiZ2V0T2JqZWN0IiwicmVmZXJEYXRhIiwibmFtZUZpZWxkS2V5IiwiTkFNRV9GSUVMRF9LRVkiLCJzZWxlY3RvciIsInRtcF9maWVsZF92YWx1ZSIsInRlbU9iakZpZWxkcyIsImxlbmd0aCIsIm9iakZpZWxkIiwicmVmZXJPYmpGaWVsZCIsInJlZmVyU2V0T2JqIiwiaW5zRmllbGQiLCJ1bmlxIiwidGZjIiwiYyIsInBhcnNlIiwidHIiLCJuZXdUciIsInYiLCJrIiwidGZtIiwib1RkQ29kZSIsInJlbGF0ZWRPYmpzIiwiZ2V0UmVsYXRlZEZpZWxkVmFsdWUiLCJ2YWx1ZUtleSIsInJlZHVjZSIsIngiLCJtYXAiLCJ0YWJsZUNvZGUiLCJfRlJPTV9UQUJMRV9DT0RFIiwid2FybiIsInJlbGF0ZWRPYmplY3ROYW1lIiwicmVsYXRlZE9iamVjdFZhbHVlcyIsInJlbGF0ZWRPYmplY3QiLCJ0YWJsZVZhbHVlSXRlbSIsInJlbGF0ZWRPYmplY3RWYWx1ZSIsImZpZWxkS2V5IiwicmVsYXRlZE9iamVjdEZpZWxkVmFsdWUiLCJmb3JtRmllbGRLZXkiLCJfY29kZSIsImV2YWxGaWVsZE1hcEJhY2tTY3JpcHQiLCJmaWx0ZXJPYmoiLCJtYWluT2JqZWN0VmFsdWUiLCJyZWxhdGVkT2JqZWN0c1ZhbHVlIiwic2NyaXB0IiwiZnVuYyIsImlzT2JqZWN0Iiwic3luY1JlbGF0ZWRPYmplY3RzVmFsdWUiLCJtYWluUmVjb3JkSWQiLCJvYmplY3RDb2xsZWN0aW9uIiwidGFibGVNYXAiLCJ0YWJsZV9pZCIsIl90YWJsZSIsInRhYmxlX2NvZGUiLCJvbGRSZWxhdGVkUmVjb3JkIiwiZm9yZWlnbl9rZXkiLCJhcHBsaWNhbnQiLCJpbnN0YW5jZV9zdGF0ZSIsInN0YXRlIiwiZmluYWxfZGVjaXNpb24iLCJ2YWxpZGF0ZSIsInRhYmxlSWRzIiwiJG5pbiIsImluc3RhbmNlX2lkIiwicmVjb3JkcyIsImZsb3ciLCJ0cmFjZXMiLCJvdyIsImZsb3dfaWQiLCIkaW4iLCJzZXRPYmoiLCJyZW1vdmVPbGRGaWxlcyIsIm5ld09iaiIsInIiLCIkcHVzaCIsInJlY29yZF9pZHMiLCIkcHVsbCIsInN0YXJ0dXAiLCJyZWYiLCJzZXR0aW5ncyIsImNyb24iLCJpbnN0YW5jZXJlY29yZHF1ZXVlX2ludGVydmFsIiwiY2hlY2tOcG1WZXJzaW9ucyIsIm1vZHVsZSIsImxpbmsiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBQSxtQkFBbUIsR0FBRyxJQUFJQyxVQUFKLEVBQXRCLEM7Ozs7Ozs7Ozs7O0FDQUFELG1CQUFtQixDQUFDRSxVQUFwQixHQUFpQ0MsRUFBRSxDQUFDQyxxQkFBSCxHQUEyQixJQUFJQyxLQUFLLENBQUNDLFVBQVYsQ0FBcUIsdUJBQXJCLENBQTVEOztBQUVBLElBQUlDLGlCQUFpQixHQUFHLFVBQVNDLEdBQVQsRUFBYztBQUVyQ0MsT0FBSyxDQUFDRCxHQUFELEVBQU07QUFDVkUsUUFBSSxFQUFFQyxNQURJO0FBRVZDLFFBQUksRUFBRUMsS0FBSyxDQUFDQyxRQUFOLENBQWVDLE9BQWYsQ0FGSTtBQUdWQyxXQUFPLEVBQUVILEtBQUssQ0FBQ0MsUUFBTixDQUFlRCxLQUFLLENBQUNJLE9BQXJCLENBSEM7QUFJVkMsYUFBUyxFQUFFQyxJQUpEO0FBS1ZDLGFBQVMsRUFBRVAsS0FBSyxDQUFDUSxLQUFOLENBQVlDLE1BQVosRUFBb0IsSUFBcEI7QUFMRCxHQUFOLENBQUw7QUFRQSxDQVZEOztBQVlBdEIsbUJBQW1CLENBQUN1QixJQUFwQixHQUEyQixVQUFTQyxPQUFULEVBQWtCO0FBQzVDLE1BQUlDLFdBQVcsR0FBR0MsTUFBTSxDQUFDQyxRQUFQLElBQW1CRCxNQUFNLENBQUNFLE1BQTFCLElBQW9DRixNQUFNLENBQUNFLE1BQVAsRUFB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QUFpUSxRQUFBLENBQUFDLElBQUEsWUFBQUYsSUFBeUJHLDRCQUF6QixHQUF5QixNQUF6QjtBQ0VHLFdEREY3UixvQkFBb0JxRCxTQUFwQixDQUNDO0FBQUFTLG9CQUFjcEMsT0FBT2lRLFFBQVAsQ0FBZ0JDLElBQWhCLENBQXFCQyw0QkFBbkM7QUFDQWxOLHFCQUFlLEVBRGY7QUFFQUosZ0JBQVU7QUFGVixLQURELENDQ0U7QUFLRDtBRFJILEc7Ozs7Ozs7Ozs7O0FFQUEsSUFBSXVOLGdCQUFKO0FBQXFCQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxvQ0FBWixFQUFpRDtBQUFDRixrQkFBZ0IsQ0FBQ2hFLENBQUQsRUFBRztBQUFDZ0Usb0JBQWdCLEdBQUNoRSxDQUFqQjtBQUFtQjs7QUFBeEMsQ0FBakQsRUFBMkYsQ0FBM0Y7QUFDckJnRSxnQkFBZ0IsQ0FBQztBQUNoQixVQUFRO0FBRFEsQ0FBRCxFQUViLCtCQUZhLENBQWhCLEMiLCJmaWxlIjoiL3BhY2thZ2VzL3N0ZWVkb3NfaW5zdGFuY2UtcmVjb3JkLXF1ZXVlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiSW5zdGFuY2VSZWNvcmRRdWV1ZSA9IG5ldyBFdmVudFN0YXRlKCk7IiwiSW5zdGFuY2VSZWNvcmRRdWV1ZS5jb2xsZWN0aW9uID0gZGIuaW5zdGFuY2VfcmVjb3JkX3F1ZXVlID0gbmV3IE1vbmdvLkNvbGxlY3Rpb24oJ2luc3RhbmNlX3JlY29yZF9xdWV1ZScpO1xuXG52YXIgX3ZhbGlkYXRlRG9jdW1lbnQgPSBmdW5jdGlvbihkb2MpIHtcblxuXHRjaGVjayhkb2MsIHtcblx0XHRpbmZvOiBPYmplY3QsXG5cdFx0c2VudDogTWF0Y2guT3B0aW9uYWwoQm9vbGVhbiksXG5cdFx0c2VuZGluZzogTWF0Y2guT3B0aW9uYWwoTWF0Y2guSW50ZWdlciksXG5cdFx0Y3JlYXRlZEF0OiBEYXRlLFxuXHRcdGNyZWF0ZWRCeTogTWF0Y2guT25lT2YoU3RyaW5nLCBudWxsKVxuXHR9KTtcblxufTtcblxuSW5zdGFuY2VSZWNvcmRRdWV1ZS5zZW5kID0gZnVuY3Rpb24ob3B0aW9ucykge1xuXHR2YXIgY3VycmVudFVzZXIgPSBNZXRlb3IuaXNDbGllbnQgJiYgTWV0ZW9yLnVzZXJJZCAmJiBNZXRlb3IudXNlcklkKCkgfHwgTWV0ZW9yLmlzU2VydmVyICYmIChvcHRpb25zLmNyZWF0ZWRCeSB8fCAnPFNFUlZFUj4nKSB8fCBudWxsXG5cdHZhciBkb2MgPSBfLmV4dGVuZCh7XG5cdFx0Y3JlYXRlZEF0OiBuZXcgRGF0ZSgpLFxuXHRcdGNyZWF0ZWRCeTogY3VycmVudFVzZXJcblx0fSk7XG5cblx0aWYgKE1hdGNoLnRlc3Qob3B0aW9ucywgT2JqZWN0KSkge1xuXHRcdGRvYy5pbmZvID0gXy5waWNrKG9wdGlvbnMsICdpbnN0YW5jZV9pZCcsICdyZWNvcmRzJywgJ3N5bmNfZGF0ZScsICdpbnN0YW5jZV9maW5pc2hfZGF0ZScsICdzdGVwX25hbWUnKTtcblx0fVxuXG5cdGRvYy5zZW50ID0gZmFsc2U7XG5cdGRvYy5zZW5kaW5nID0gMDtcblxuXHRfdmFsaWRhdGVEb2N1bWVudChkb2MpO1xuXG5cdHJldHVybiBJbnN0YW5jZVJlY29yZFF1ZXVlLmNvbGxlY3Rpb24uaW5zZXJ0KGRvYyk7XG59OyIsImNvbnN0IG9iamVjdHFsID0gcmVxdWlyZSgnQHN0ZWVkb3Mvb2JqZWN0cWwnKTtcbnZhciBydW5RdW90ZWQgPSBmdW5jdGlvbiAob2JqZWN0TmFtZSwgcmVjb3JkSWQpIHtcblx0b2JqZWN0cWwucnVuUXVvdGVkQnlPYmplY3RGaWVsZEZvcm11bGFzKG9iamVjdE5hbWUsIHJlY29yZElkKTtcblx0b2JqZWN0cWwucnVuUXVvdGVkQnlPYmplY3RGaWVsZFN1bW1hcmllcyhvYmplY3ROYW1lLCByZWNvcmRJZCk7XG59XG5cbnZhciBfZXZhbCA9IHJlcXVpcmUoJ2V2YWwnKTtcbnZhciBpc0NvbmZpZ3VyZWQgPSBmYWxzZTtcbnZhciBzZW5kV29ya2VyID0gZnVuY3Rpb24gKHRhc2ssIGludGVydmFsKSB7XG5cblx0aWYgKEluc3RhbmNlUmVjb3JkUXVldWUuZGVidWcpIHtcblx0XHRjb25zb2xlLmxvZygnSW5zdGFuY2VSZWNvcmRRdWV1ZTogU2VuZCB3b3JrZXIgc3RhcnRlZCwgdXNpbmcgaW50ZXJ2YWw6ICcgKyBpbnRlcnZhbCk7XG5cdH1cblxuXHRyZXR1cm4gTWV0ZW9yLnNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcblx0XHR0cnkge1xuXHRcdFx0dGFzaygpO1xuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRjb25zb2xlLmxvZygnSW5zdGFuY2VSZWNvcmRRdWV1ZTogRXJyb3Igd2hpbGUgc2VuZGluZzogJyArIGVycm9yLm1lc3NhZ2UpO1xuXHRcdH1cblx0fSwgaW50ZXJ2YWwpO1xufTtcblxuLypcblx0b3B0aW9uczoge1xuXHRcdC8vIENvbnRyb2xzIHRoZSBzZW5kaW5nIGludGVydmFsXG5cdFx0c2VuZEludGVydmFsOiBNYXRjaC5PcHRpb25hbChOdW1iZXIpLFxuXHRcdC8vIENvbnRyb2xzIHRoZSBzZW5kaW5nIGJhdGNoIHNpemUgcGVyIGludGVydmFsXG5cdFx0c2VuZEJhdGNoU2l6ZTogTWF0Y2guT3B0aW9uYWwoTnVtYmVyKSxcblx0XHQvLyBBbGxvdyBvcHRpb25hbCBrZWVwaW5nIG5vdGlmaWNhdGlvbnMgaW4gY29sbGVjdGlvblxuXHRcdGtlZXBEb2NzOiBNYXRjaC5PcHRpb25hbChCb29sZWFuKVxuXHR9XG4qL1xuSW5zdGFuY2VSZWNvcmRRdWV1ZS5Db25maWd1cmUgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuXHR2YXIgc2VsZiA9IHRoaXM7XG5cdG9wdGlvbnMgPSBfLmV4dGVuZCh7XG5cdFx0c2VuZFRpbWVvdXQ6IDYwMDAwLCAvLyBUaW1lb3V0IHBlcmlvZFxuXHR9LCBvcHRpb25zKTtcblxuXHQvLyBCbG9jayBtdWx0aXBsZSBjYWxsc1xuXHRpZiAoaXNDb25maWd1cmVkKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdJbnN0YW5jZVJlY29yZFF1ZXVlLkNvbmZpZ3VyZSBzaG91bGQgbm90IGJlIGNhbGxlZCBtb3JlIHRoYW4gb25jZSEnKTtcblx0fVxuXG5cdGlzQ29uZmlndXJlZCA9IHRydWU7XG5cblx0Ly8gQWRkIGRlYnVnIGluZm9cblx0aWYgKEluc3RhbmNlUmVjb3JkUXVldWUuZGVidWcpIHtcblx0XHRjb25zb2xlLmxvZygnSW5zdGFuY2VSZWNvcmRRdWV1ZS5Db25maWd1cmUnLCBvcHRpb25zKTtcblx0fVxuXG5cblxuXHQvLyBVbml2ZXJzYWwgc2VuZCBmdW5jdGlvblxuXHR2YXIgX3F1ZXJ5U2VuZCA9IGZ1bmN0aW9uIChkb2MpIHtcblxuXHRcdGlmIChJbnN0YW5jZVJlY29yZFF1ZXVlLnNlbmREb2MpIHtcblx0XHRcdEluc3RhbmNlUmVjb3JkUXVldWUuc2VuZERvYyhkb2MpO1xuXHRcdH1cblxuXHRcdHJldHVybiB7XG5cdFx0XHRkb2M6IFtkb2MuX2lkXVxuXHRcdH07XG5cdH07XG5cblx0c2VsZi5zZXJ2ZXJTZW5kID0gZnVuY3Rpb24gKGRvYykge1xuXHRcdGRvYyA9IGRvYyB8fCB7fTtcblx0XHRyZXR1cm4gX3F1ZXJ5U2VuZChkb2MpO1xuXHR9O1xuXG5cblx0Ly8gVGhpcyBpbnRlcnZhbCB3aWxsIGFsbG93IG9ubHkgb25lIGRvYyB0byBiZSBzZW50IGF0IGEgdGltZSwgaXRcblx0Ly8gd2lsbCBjaGVjayBmb3IgbmV3IGRvY3MgYXQgZXZlcnkgYG9wdGlvbnMuc2VuZEludGVydmFsYFxuXHQvLyAoZGVmYXVsdCBpbnRlcnZhbCBpcyAxNTAwMCBtcylcblx0Ly9cblx0Ly8gSXQgbG9va3MgaW4gZG9jcyBjb2xsZWN0aW9uIHRvIHNlZSBpZiB0aGVyZXMgYW55IHBlbmRpbmdcblx0Ly8gZG9jcywgaWYgc28gaXQgd2lsbCB0cnkgdG8gcmVzZXJ2ZSB0aGUgcGVuZGluZyBkb2MuXG5cdC8vIElmIHN1Y2Nlc3NmdWxseSByZXNlcnZlZCB0aGUgc2VuZCBpcyBzdGFydGVkLlxuXHQvL1xuXHQvLyBJZiBkb2MucXVlcnkgaXMgdHlwZSBzdHJpbmcsIGl0J3MgYXNzdW1lZCB0byBiZSBhIGpzb24gc3RyaW5nXG5cdC8vIHZlcnNpb24gb2YgdGhlIHF1ZXJ5IHNlbGVjdG9yLiBNYWtpbmcgaXQgYWJsZSB0byBjYXJyeSBgJGAgcHJvcGVydGllcyBpblxuXHQvLyB0aGUgbW9uZ28gY29sbGVjdGlvbi5cblx0Ly9cblx0Ly8gUHIuIGRlZmF1bHQgZG9jcyBhcmUgcmVtb3ZlZCBmcm9tIHRoZSBjb2xsZWN0aW9uIGFmdGVyIHNlbmQgaGF2ZVxuXHQvLyBjb21wbGV0ZWQuIFNldHRpbmcgYG9wdGlvbnMua2VlcERvY3NgIHdpbGwgdXBkYXRlIGFuZCBrZWVwIHRoZVxuXHQvLyBkb2MgZWcuIGlmIG5lZWRlZCBmb3IgaGlzdG9yaWNhbCByZWFzb25zLlxuXHQvL1xuXHQvLyBBZnRlciB0aGUgc2VuZCBoYXZlIGNvbXBsZXRlZCBhIFwic2VuZFwiIGV2ZW50IHdpbGwgYmUgZW1pdHRlZCB3aXRoIGFcblx0Ly8gc3RhdHVzIG9iamVjdCBjb250YWluaW5nIGRvYyBpZCBhbmQgdGhlIHNlbmQgcmVzdWx0IG9iamVjdC5cblx0Ly9cblx0dmFyIGlzU2VuZGluZ0RvYyA9IGZhbHNlO1xuXG5cdGlmIChvcHRpb25zLnNlbmRJbnRlcnZhbCAhPT0gbnVsbCkge1xuXG5cdFx0Ly8gVGhpcyB3aWxsIHJlcXVpcmUgaW5kZXggc2luY2Ugd2Ugc29ydCBkb2NzIGJ5IGNyZWF0ZWRBdFxuXHRcdEluc3RhbmNlUmVjb3JkUXVldWUuY29sbGVjdGlvbi5fZW5zdXJlSW5kZXgoe1xuXHRcdFx0Y3JlYXRlZEF0OiAxXG5cdFx0fSk7XG5cdFx0SW5zdGFuY2VSZWNvcmRRdWV1ZS5jb2xsZWN0aW9uLl9lbnN1cmVJbmRleCh7XG5cdFx0XHRzZW50OiAxXG5cdFx0fSk7XG5cdFx0SW5zdGFuY2VSZWNvcmRRdWV1ZS5jb2xsZWN0aW9uLl9lbnN1cmVJbmRleCh7XG5cdFx0XHRzZW5kaW5nOiAxXG5cdFx0fSk7XG5cblxuXHRcdHZhciBzZW5kRG9jID0gZnVuY3Rpb24gKGRvYykge1xuXHRcdFx0Ly8gUmVzZXJ2ZSBkb2Ncblx0XHRcdHZhciBub3cgPSArbmV3IERhdGUoKTtcblx0XHRcdHZhciB0aW1lb3V0QXQgPSBub3cgKyBvcHRpb25zLnNlbmRUaW1lb3V0O1xuXHRcdFx0dmFyIHJlc2VydmVkID0gSW5zdGFuY2VSZWNvcmRRdWV1ZS5jb2xsZWN0aW9uLnVwZGF0ZSh7XG5cdFx0XHRcdF9pZDogZG9jLl9pZCxcblx0XHRcdFx0c2VudDogZmFsc2UsIC8vIHh4eDogbmVlZCB0byBtYWtlIHN1cmUgdGhpcyBpcyBzZXQgb24gY3JlYXRlXG5cdFx0XHRcdHNlbmRpbmc6IHtcblx0XHRcdFx0XHQkbHQ6IG5vd1xuXHRcdFx0XHR9XG5cdFx0XHR9LCB7XG5cdFx0XHRcdCRzZXQ6IHtcblx0XHRcdFx0XHRzZW5kaW5nOiB0aW1lb3V0QXQsXG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHQvLyBNYWtlIHN1cmUgd2Ugb25seSBoYW5kbGUgZG9jcyByZXNlcnZlZCBieSB0aGlzXG5cdFx0XHQvLyBpbnN0YW5jZVxuXHRcdFx0aWYgKHJlc2VydmVkKSB7XG5cblx0XHRcdFx0Ly8gU2VuZFxuXHRcdFx0XHR2YXIgcmVzdWx0ID0gc2VsZi5zZXJ2ZXJTZW5kKGRvYyk7XG5cblx0XHRcdFx0aWYgKCFvcHRpb25zLmtlZXBEb2NzKSB7XG5cdFx0XHRcdFx0Ly8gUHIuIERlZmF1bHQgd2Ugd2lsbCByZW1vdmUgZG9jc1xuXHRcdFx0XHRcdEluc3RhbmNlUmVjb3JkUXVldWUuY29sbGVjdGlvbi5yZW1vdmUoe1xuXHRcdFx0XHRcdFx0X2lkOiBkb2MuX2lkXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHQvLyBVcGRhdGVcblx0XHRcdFx0XHRJbnN0YW5jZVJlY29yZFF1ZXVlLmNvbGxlY3Rpb24udXBkYXRlKHtcblx0XHRcdFx0XHRcdF9pZDogZG9jLl9pZFxuXHRcdFx0XHRcdH0sIHtcblx0XHRcdFx0XHRcdCRzZXQ6IHtcblx0XHRcdFx0XHRcdFx0Ly8gTWFyayBhcyBzZW50XG5cdFx0XHRcdFx0XHRcdHNlbnQ6IHRydWUsXG5cdFx0XHRcdFx0XHRcdC8vIFNldCB0aGUgc2VudCBkYXRlXG5cdFx0XHRcdFx0XHRcdHNlbnRBdDogbmV3IERhdGUoKSxcblx0XHRcdFx0XHRcdFx0Ly8gTm90IGJlaW5nIHNlbnQgYW55bW9yZVxuXHRcdFx0XHRcdFx0XHRzZW5kaW5nOiAwXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIC8vIEVtaXQgdGhlIHNlbmRcblx0XHRcdFx0Ly8gSW5zdGFuY2VSZWNvcmRRdWV1ZS5lbWl0KCdzZW5kJywge1xuXHRcdFx0XHQvLyBcdGRvYzogZG9jLl9pZCxcblx0XHRcdFx0Ly8gXHRyZXN1bHQ6IHJlc3VsdFxuXHRcdFx0XHQvLyB9KTtcblxuXHRcdFx0fSAvLyBFbHNlIGNvdWxkIG5vdCByZXNlcnZlXG5cdFx0fTsgLy8gRU8gc2VuZERvY1xuXG5cdFx0c2VuZFdvcmtlcihmdW5jdGlvbiAoKSB7XG5cblx0XHRcdGlmIChpc1NlbmRpbmdEb2MpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0Ly8gU2V0IHNlbmQgZmVuY2Vcblx0XHRcdGlzU2VuZGluZ0RvYyA9IHRydWU7XG5cblx0XHRcdHZhciBiYXRjaFNpemUgPSBvcHRpb25zLnNlbmRCYXRjaFNpemUgfHwgMTtcblxuXHRcdFx0dmFyIG5vdyA9ICtuZXcgRGF0ZSgpO1xuXG5cdFx0XHQvLyBGaW5kIGRvY3MgdGhhdCBhcmUgbm90IGJlaW5nIG9yIGFscmVhZHkgc2VudFxuXHRcdFx0dmFyIHBlbmRpbmdEb2NzID0gSW5zdGFuY2VSZWNvcmRRdWV1ZS5jb2xsZWN0aW9uLmZpbmQoe1xuXHRcdFx0XHQkYW5kOiBbXG5cdFx0XHRcdFx0Ly8gTWVzc2FnZSBpcyBub3Qgc2VudFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHNlbnQ6IGZhbHNlXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHQvLyBBbmQgbm90IGJlaW5nIHNlbnQgYnkgb3RoZXIgaW5zdGFuY2VzXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0c2VuZGluZzoge1xuXHRcdFx0XHRcdFx0XHQkbHQ6IG5vd1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0Ly8gQW5kIG5vIGVycm9yXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0ZXJyTXNnOiB7XG5cdFx0XHRcdFx0XHRcdCRleGlzdHM6IGZhbHNlXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRdXG5cdFx0XHR9LCB7XG5cdFx0XHRcdC8vIFNvcnQgYnkgY3JlYXRlZCBkYXRlXG5cdFx0XHRcdHNvcnQ6IHtcblx0XHRcdFx0XHRjcmVhdGVkQXQ6IDFcblx0XHRcdFx0fSxcblx0XHRcdFx0bGltaXQ6IGJhdGNoU2l6ZVxuXHRcdFx0fSk7XG5cblx0XHRcdHBlbmRpbmdEb2NzLmZvckVhY2goZnVuY3Rpb24gKGRvYykge1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdHNlbmREb2MoZG9jKTtcblx0XHRcdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKGVycm9yLnN0YWNrKTtcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnSW5zdGFuY2VSZWNvcmRRdWV1ZTogQ291bGQgbm90IHNlbmQgZG9jIGlkOiBcIicgKyBkb2MuX2lkICsgJ1wiLCBFcnJvcjogJyArIGVycm9yLm1lc3NhZ2UpO1xuXHRcdFx0XHRcdEluc3RhbmNlUmVjb3JkUXVldWUuY29sbGVjdGlvbi51cGRhdGUoe1xuXHRcdFx0XHRcdFx0X2lkOiBkb2MuX2lkXG5cdFx0XHRcdFx0fSwge1xuXHRcdFx0XHRcdFx0JHNldDoge1xuXHRcdFx0XHRcdFx0XHQvLyBlcnJvciBtZXNzYWdlXG5cdFx0XHRcdFx0XHRcdGVyck1zZzogZXJyb3IubWVzc2FnZVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTsgLy8gRU8gZm9yRWFjaFxuXG5cdFx0XHQvLyBSZW1vdmUgdGhlIHNlbmQgZmVuY2Vcblx0XHRcdGlzU2VuZGluZ0RvYyA9IGZhbHNlO1xuXHRcdH0sIG9wdGlvbnMuc2VuZEludGVydmFsIHx8IDE1MDAwKTsgLy8gRGVmYXVsdCBldmVyeSAxNXRoIHNlY1xuXG5cdH0gZWxzZSB7XG5cdFx0aWYgKEluc3RhbmNlUmVjb3JkUXVldWUuZGVidWcpIHtcblx0XHRcdGNvbnNvbGUubG9nKCdJbnN0YW5jZVJlY29yZFF1ZXVlOiBTZW5kIHNlcnZlciBpcyBkaXNhYmxlZCcpO1xuXHRcdH1cblx0fVxuXG59O1xuXG5JbnN0YW5jZVJlY29yZFF1ZXVlLnN5bmNBdHRhY2ggPSBmdW5jdGlvbiAoc3luY19hdHRhY2htZW50LCBpbnNJZCwgc3BhY2VJZCwgbmV3UmVjb3JkSWQsIG9iamVjdE5hbWUpIHtcblx0aWYgKHN5bmNfYXR0YWNobWVudCA9PSBcImxhc3Rlc3RcIikge1xuXHRcdGNmcy5pbnN0YW5jZXMuZmluZCh7XG5cdFx0XHQnbWV0YWRhdGEuaW5zdGFuY2UnOiBpbnNJZCxcblx0XHRcdCdtZXRhZGF0YS5jdXJyZW50JzogdHJ1ZVxuXHRcdH0pLmZvckVhY2goZnVuY3Rpb24gKGYpIHtcblx0XHRcdGlmICghZi5oYXNTdG9yZWQoJ2luc3RhbmNlcycpKSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoJ3N5bmNBdHRhY2gtZmlsZSBub3Qgc3RvcmVkOiAnLCBmLl9pZCk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdHZhciBuZXdGaWxlID0gbmV3IEZTLkZpbGUoKSxcblx0XHRcdFx0Y21zRmlsZUlkID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdjbXNfZmlsZXMnKS5fbWFrZU5ld0lEKCk7XG5cdFx0XHRuZXdGaWxlLmF0dGFjaERhdGEoZi5jcmVhdGVSZWFkU3RyZWFtKCdpbnN0YW5jZXMnKSwge1xuXHRcdFx0XHR0eXBlOiBmLm9yaWdpbmFsLnR5cGVcblx0XHRcdH0sIGZ1bmN0aW9uIChlcnIpIHtcblx0XHRcdFx0aWYgKGVycikge1xuXHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoZXJyLmVycm9yLCBlcnIucmVhc29uKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRuZXdGaWxlLm5hbWUoZi5uYW1lKCkpO1xuXHRcdFx0XHRuZXdGaWxlLnNpemUoZi5zaXplKCkpO1xuXHRcdFx0XHR2YXIgbWV0YWRhdGEgPSB7XG5cdFx0XHRcdFx0b3duZXI6IGYubWV0YWRhdGEub3duZXIsXG5cdFx0XHRcdFx0b3duZXJfbmFtZTogZi5tZXRhZGF0YS5vd25lcl9uYW1lLFxuXHRcdFx0XHRcdHNwYWNlOiBzcGFjZUlkLFxuXHRcdFx0XHRcdHJlY29yZF9pZDogbmV3UmVjb3JkSWQsXG5cdFx0XHRcdFx0b2JqZWN0X25hbWU6IG9iamVjdE5hbWUsXG5cdFx0XHRcdFx0cGFyZW50OiBjbXNGaWxlSWRcblx0XHRcdFx0fTtcblxuXHRcdFx0XHRuZXdGaWxlLm1ldGFkYXRhID0gbWV0YWRhdGE7XG5cdFx0XHRcdGNmcy5maWxlcy5pbnNlcnQobmV3RmlsZSk7XG5cdFx0XHR9KTtcblx0XHRcdE1ldGVvci53cmFwQXN5bmMoZnVuY3Rpb24gKG5ld0ZpbGUsIENyZWF0b3IsIGNtc0ZpbGVJZCwgb2JqZWN0TmFtZSwgbmV3UmVjb3JkSWQsIHNwYWNlSWQsIGYsIGNiKSB7XG5cdFx0XHRcdG5ld0ZpbGUub25jZSgnc3RvcmVkJywgZnVuY3Rpb24gKHN0b3JlTmFtZSkge1xuXHRcdFx0XHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbignY21zX2ZpbGVzJykuaW5zZXJ0KHtcblx0XHRcdFx0XHRcdF9pZDogY21zRmlsZUlkLFxuXHRcdFx0XHRcdFx0cGFyZW50OiB7XG5cdFx0XHRcdFx0XHRcdG86IG9iamVjdE5hbWUsXG5cdFx0XHRcdFx0XHRcdGlkczogW25ld1JlY29yZElkXVxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdHNpemU6IG5ld0ZpbGUuc2l6ZSgpLFxuXHRcdFx0XHRcdFx0bmFtZTogbmV3RmlsZS5uYW1lKCksXG5cdFx0XHRcdFx0XHRleHRlbnRpb246IG5ld0ZpbGUuZXh0ZW5zaW9uKCksXG5cdFx0XHRcdFx0XHRzcGFjZTogc3BhY2VJZCxcblx0XHRcdFx0XHRcdHZlcnNpb25zOiBbbmV3RmlsZS5faWRdLFxuXHRcdFx0XHRcdFx0b3duZXI6IGYubWV0YWRhdGEub3duZXIsXG5cdFx0XHRcdFx0XHRjcmVhdGVkX2J5OiBmLm1ldGFkYXRhLm93bmVyLFxuXHRcdFx0XHRcdFx0bW9kaWZpZWRfYnk6IGYubWV0YWRhdGEub3duZXJcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdGNiKG51bGwpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0bmV3RmlsZS5vbmNlKCdlcnJvcicsIGZ1bmN0aW9uIChlcnJvcikge1xuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoJ3N5bmNBdHRhY2gtZXJyb3I6ICcsIGVycm9yKTtcblx0XHRcdFx0XHRjYihlcnJvcik7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSkobmV3RmlsZSwgQ3JlYXRvciwgY21zRmlsZUlkLCBvYmplY3ROYW1lLCBuZXdSZWNvcmRJZCwgc3BhY2VJZCwgZik7XG5cdFx0fSlcblx0fSBlbHNlIGlmIChzeW5jX2F0dGFjaG1lbnQgPT0gXCJhbGxcIikge1xuXHRcdHZhciBwYXJlbnRzID0gW107XG5cdFx0Y2ZzLmluc3RhbmNlcy5maW5kKHtcblx0XHRcdCdtZXRhZGF0YS5pbnN0YW5jZSc6IGluc0lkXG5cdFx0fSkuZm9yRWFjaChmdW5jdGlvbiAoZikge1xuXHRcdFx0aWYgKCFmLmhhc1N0b3JlZCgnaW5zdGFuY2VzJykpIHtcblx0XHRcdFx0Y29uc29sZS5lcnJvcignc3luY0F0dGFjaC1maWxlIG5vdCBzdG9yZWQ6ICcsIGYuX2lkKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0dmFyIG5ld0ZpbGUgPSBuZXcgRlMuRmlsZSgpLFxuXHRcdFx0XHRjbXNGaWxlSWQgPSBmLm1ldGFkYXRhLnBhcmVudDtcblxuXHRcdFx0aWYgKCFwYXJlbnRzLmluY2x1ZGVzKGNtc0ZpbGVJZCkpIHtcblx0XHRcdFx0cGFyZW50cy5wdXNoKGNtc0ZpbGVJZCk7XG5cdFx0XHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbignY21zX2ZpbGVzJykuaW5zZXJ0KHtcblx0XHRcdFx0XHRfaWQ6IGNtc0ZpbGVJZCxcblx0XHRcdFx0XHRwYXJlbnQ6IHtcblx0XHRcdFx0XHRcdG86IG9iamVjdE5hbWUsXG5cdFx0XHRcdFx0XHRpZHM6IFtuZXdSZWNvcmRJZF1cblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHNwYWNlOiBzcGFjZUlkLFxuXHRcdFx0XHRcdHZlcnNpb25zOiBbXSxcblx0XHRcdFx0XHRvd25lcjogZi5tZXRhZGF0YS5vd25lcixcblx0XHRcdFx0XHRjcmVhdGVkX2J5OiBmLm1ldGFkYXRhLm93bmVyLFxuXHRcdFx0XHRcdG1vZGlmaWVkX2J5OiBmLm1ldGFkYXRhLm93bmVyXG5cdFx0XHRcdH0pXG5cdFx0XHR9XG5cblx0XHRcdG5ld0ZpbGUuYXR0YWNoRGF0YShmLmNyZWF0ZVJlYWRTdHJlYW0oJ2luc3RhbmNlcycpLCB7XG5cdFx0XHRcdHR5cGU6IGYub3JpZ2luYWwudHlwZVxuXHRcdFx0fSwgZnVuY3Rpb24gKGVycikge1xuXHRcdFx0XHRpZiAoZXJyKSB7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcihlcnIuZXJyb3IsIGVyci5yZWFzb24pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdG5ld0ZpbGUubmFtZShmLm5hbWUoKSk7XG5cdFx0XHRcdG5ld0ZpbGUuc2l6ZShmLnNpemUoKSk7XG5cdFx0XHRcdHZhciBtZXRhZGF0YSA9IHtcblx0XHRcdFx0XHRvd25lcjogZi5tZXRhZGF0YS5vd25lcixcblx0XHRcdFx0XHRvd25lcl9uYW1lOiBmLm1ldGFkYXRhLm93bmVyX25hbWUsXG5cdFx0XHRcdFx0c3BhY2U6IHNwYWNlSWQsXG5cdFx0XHRcdFx0cmVjb3JkX2lkOiBuZXdSZWNvcmRJZCxcblx0XHRcdFx0XHRvYmplY3RfbmFtZTogb2JqZWN0TmFtZSxcblx0XHRcdFx0XHRwYXJlbnQ6IGNtc0ZpbGVJZFxuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdG5ld0ZpbGUubWV0YWRhdGEgPSBtZXRhZGF0YTtcblx0XHRcdFx0Y2ZzLmZpbGVzLmluc2VydChuZXdGaWxlKTtcblx0XHRcdH0pO1xuXHRcdFx0TWV0ZW9yLndyYXBBc3luYyhmdW5jdGlvbiAobmV3RmlsZSwgQ3JlYXRvciwgY21zRmlsZUlkLCBmLCBjYikge1xuXHRcdFx0XHRuZXdGaWxlLm9uY2UoJ3N0b3JlZCcsIGZ1bmN0aW9uIChzdG9yZU5hbWUpIHtcblx0XHRcdFx0XHRpZiAoZi5tZXRhZGF0YS5jdXJyZW50ID09IHRydWUpIHtcblx0XHRcdFx0XHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbignY21zX2ZpbGVzJykudXBkYXRlKGNtc0ZpbGVJZCwge1xuXHRcdFx0XHRcdFx0XHQkc2V0OiB7XG5cdFx0XHRcdFx0XHRcdFx0c2l6ZTogbmV3RmlsZS5zaXplKCksXG5cdFx0XHRcdFx0XHRcdFx0bmFtZTogbmV3RmlsZS5uYW1lKCksXG5cdFx0XHRcdFx0XHRcdFx0ZXh0ZW50aW9uOiBuZXdGaWxlLmV4dGVuc2lvbigpLFxuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHQkYWRkVG9TZXQ6IHtcblx0XHRcdFx0XHRcdFx0XHR2ZXJzaW9uczogbmV3RmlsZS5faWRcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbignY21zX2ZpbGVzJykudXBkYXRlKGNtc0ZpbGVJZCwge1xuXHRcdFx0XHRcdFx0XHQkYWRkVG9TZXQ6IHtcblx0XHRcdFx0XHRcdFx0XHR2ZXJzaW9uczogbmV3RmlsZS5faWRcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Y2IobnVsbCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRuZXdGaWxlLm9uY2UoJ2Vycm9yJywgZnVuY3Rpb24gKGVycm9yKSB7XG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvcignc3luY0F0dGFjaC1lcnJvcjogJywgZXJyb3IpO1xuXHRcdFx0XHRcdGNiKGVycm9yKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9KShuZXdGaWxlLCBDcmVhdG9yLCBjbXNGaWxlSWQsIGYpO1xuXHRcdH0pXG5cdH1cbn1cblxuSW5zdGFuY2VSZWNvcmRRdWV1ZS5zeW5jSW5zRmllbGRzID0gWyduYW1lJywgJ3N1Ym1pdHRlcl9uYW1lJywgJ2FwcGxpY2FudF9uYW1lJywgJ2FwcGxpY2FudF9vcmdhbml6YXRpb25fbmFtZScsICdhcHBsaWNhbnRfb3JnYW5pemF0aW9uX2Z1bGxuYW1lJywgJ3N0YXRlJyxcblx0J2N1cnJlbnRfc3RlcF9uYW1lJywgJ2Zsb3dfbmFtZScsICdjYXRlZ29yeV9uYW1lJywgJ3N1Ym1pdF9kYXRlJywgJ2ZpbmlzaF9kYXRlJywgJ2ZpbmFsX2RlY2lzaW9uJywgJ2FwcGxpY2FudF9vcmdhbml6YXRpb24nLCAnYXBwbGljYW50X2NvbXBhbnknXG5dO1xuSW5zdGFuY2VSZWNvcmRRdWV1ZS5zeW5jVmFsdWVzID0gZnVuY3Rpb24gKGZpZWxkX21hcF9iYWNrLCB2YWx1ZXMsIGlucywgb2JqZWN0SW5mbywgZmllbGRfbWFwX2JhY2tfc2NyaXB0LCByZWNvcmQpIHtcblx0dmFyXG5cdFx0b2JqID0ge30sXG5cdFx0dGFibGVGaWVsZENvZGVzID0gW10sXG5cdFx0dGFibGVGaWVsZE1hcCA9IFtdLFxuXHRcdHRhYmxlVG9SZWxhdGVkTWFwID0ge307XG5cblx0ZmllbGRfbWFwX2JhY2sgPSBmaWVsZF9tYXBfYmFjayB8fCBbXTtcblxuXHR2YXIgc3BhY2VJZCA9IGlucy5zcGFjZTtcblxuXHR2YXIgZm9ybSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcImZvcm1zXCIpLmZpbmRPbmUoaW5zLmZvcm0pO1xuXHR2YXIgZm9ybUZpZWxkcyA9IG51bGw7XG5cdGlmIChmb3JtLmN1cnJlbnQuX2lkID09PSBpbnMuZm9ybV92ZXJzaW9uKSB7XG5cdFx0Zm9ybUZpZWxkcyA9IGZvcm0uY3VycmVudC5maWVsZHMgfHwgW107XG5cdH0gZWxzZSB7XG5cdFx0dmFyIGZvcm1WZXJzaW9uID0gXy5maW5kKGZvcm0uaGlzdG9yeXMsIGZ1bmN0aW9uIChoKSB7XG5cdFx0XHRyZXR1cm4gaC5faWQgPT09IGlucy5mb3JtX3ZlcnNpb247XG5cdFx0fSlcblx0XHRmb3JtRmllbGRzID0gZm9ybVZlcnNpb24gPyBmb3JtVmVyc2lvbi5maWVsZHMgOiBbXTtcblx0fVxuXG5cdHZhciBvYmplY3RGaWVsZHMgPSBvYmplY3RJbmZvLmZpZWxkcztcblx0dmFyIG9iamVjdEZpZWxkS2V5cyA9IF8ua2V5cyhvYmplY3RGaWVsZHMpO1xuXHR2YXIgcmVsYXRlZE9iamVjdHMgPSBDcmVhdG9yLmdldFJlbGF0ZWRPYmplY3RzKG9iamVjdEluZm8ubmFtZSwgc3BhY2VJZCk7XG5cdHZhciByZWxhdGVkT2JqZWN0c0tleXMgPSBfLnBsdWNrKHJlbGF0ZWRPYmplY3RzLCAnb2JqZWN0X25hbWUnKTtcblx0dmFyIGZvcm1UYWJsZUZpZWxkcyA9IF8uZmlsdGVyKGZvcm1GaWVsZHMsIGZ1bmN0aW9uIChmb3JtRmllbGQpIHtcblx0XHRyZXR1cm4gZm9ybUZpZWxkLnR5cGUgPT09ICd0YWJsZSdcblx0fSk7XG5cdHZhciBmb3JtVGFibGVGaWVsZHNDb2RlID0gXy5wbHVjayhmb3JtVGFibGVGaWVsZHMsICdjb2RlJyk7XG5cblx0dmFyIGdldFJlbGF0ZWRPYmplY3RGaWVsZCA9IGZ1bmN0aW9uIChrZXkpIHtcblx0XHRyZXR1cm4gXy5maW5kKHJlbGF0ZWRPYmplY3RzS2V5cywgZnVuY3Rpb24gKHJlbGF0ZWRPYmplY3RzS2V5KSB7XG5cdFx0XHRyZXR1cm4ga2V5LnN0YXJ0c1dpdGgocmVsYXRlZE9iamVjdHNLZXkgKyAnLicpO1xuXHRcdH0pXG5cdH07XG5cblx0dmFyIGdldEZvcm1UYWJsZUZpZWxkID0gZnVuY3Rpb24gKGtleSkge1xuXHRcdHJldHVybiBfLmZpbmQoZm9ybVRhYmxlRmllbGRzQ29kZSwgZnVuY3Rpb24gKGZvcm1UYWJsZUZpZWxkQ29kZSkge1xuXHRcdFx0cmV0dXJuIGtleS5zdGFydHNXaXRoKGZvcm1UYWJsZUZpZWxkQ29kZSArICcuJyk7XG5cdFx0fSlcblx0fTtcblxuXHR2YXIgZ2V0Rm9ybUZpZWxkID0gZnVuY3Rpb24gKF9mb3JtRmllbGRzLCBfZmllbGRDb2RlKSB7XG5cdFx0dmFyIGZvcm1GaWVsZCA9IG51bGw7XG5cdFx0Xy5lYWNoKF9mb3JtRmllbGRzLCBmdW5jdGlvbiAoZmYpIHtcblx0XHRcdGlmICghZm9ybUZpZWxkKSB7XG5cdFx0XHRcdGlmIChmZi5jb2RlID09PSBfZmllbGRDb2RlKSB7XG5cdFx0XHRcdFx0Zm9ybUZpZWxkID0gZmY7XG5cdFx0XHRcdH0gZWxzZSBpZiAoZmYudHlwZSA9PT0gJ3NlY3Rpb24nKSB7XG5cdFx0XHRcdFx0Xy5lYWNoKGZmLmZpZWxkcywgZnVuY3Rpb24gKGYpIHtcblx0XHRcdFx0XHRcdGlmICghZm9ybUZpZWxkKSB7XG5cdFx0XHRcdFx0XHRcdGlmIChmLmNvZGUgPT09IF9maWVsZENvZGUpIHtcblx0XHRcdFx0XHRcdFx0XHRmb3JtRmllbGQgPSBmO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0fSBlbHNlIGlmIChmZi50eXBlID09PSAndGFibGUnKSB7XG5cdFx0XHRcdFx0Xy5lYWNoKGZmLmZpZWxkcywgZnVuY3Rpb24gKGYpIHtcblx0XHRcdFx0XHRcdGlmICghZm9ybUZpZWxkKSB7XG5cdFx0XHRcdFx0XHRcdGlmIChmLmNvZGUgPT09IF9maWVsZENvZGUpIHtcblx0XHRcdFx0XHRcdFx0XHRmb3JtRmllbGQgPSBmO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHJldHVybiBmb3JtRmllbGQ7XG5cdH1cblxuXHRmaWVsZF9tYXBfYmFjay5mb3JFYWNoKGZ1bmN0aW9uIChmbSkge1xuXHRcdC8vd29ya2Zsb3cg55qE5a2Q6KGo5YiwY3JlYXRvciBvYmplY3Qg55qE55u45YWz5a+56LGhXG5cdFx0dmFyIHJlbGF0ZWRPYmplY3RGaWVsZCA9IGdldFJlbGF0ZWRPYmplY3RGaWVsZChmbS5vYmplY3RfZmllbGQpO1xuXHRcdHZhciBmb3JtVGFibGVGaWVsZCA9IGdldEZvcm1UYWJsZUZpZWxkKGZtLndvcmtmbG93X2ZpZWxkKTtcblx0XHRpZiAocmVsYXRlZE9iamVjdEZpZWxkKSB7XG5cdFx0XHR2YXIgb1RhYmxlQ29kZSA9IGZtLm9iamVjdF9maWVsZC5zcGxpdCgnLicpWzBdO1xuXHRcdFx0dmFyIG9UYWJsZUZpZWxkQ29kZSA9IGZtLm9iamVjdF9maWVsZC5zcGxpdCgnLicpWzFdO1xuXHRcdFx0dmFyIHRhYmxlVG9SZWxhdGVkTWFwS2V5ID0gb1RhYmxlQ29kZTtcblx0XHRcdGlmICghdGFibGVUb1JlbGF0ZWRNYXBbdGFibGVUb1JlbGF0ZWRNYXBLZXldKSB7XG5cdFx0XHRcdHRhYmxlVG9SZWxhdGVkTWFwW3RhYmxlVG9SZWxhdGVkTWFwS2V5XSA9IHt9XG5cdFx0XHR9XG5cblx0XHRcdGlmIChmb3JtVGFibGVGaWVsZCkge1xuXHRcdFx0XHR2YXIgd1RhYmxlQ29kZSA9IGZtLndvcmtmbG93X2ZpZWxkLnNwbGl0KCcuJylbMF07XG5cdFx0XHRcdHRhYmxlVG9SZWxhdGVkTWFwW3RhYmxlVG9SZWxhdGVkTWFwS2V5XVsnX0ZST01fVEFCTEVfQ09ERSddID0gd1RhYmxlQ29kZVxuXHRcdFx0fVxuXG5cdFx0XHR0YWJsZVRvUmVsYXRlZE1hcFt0YWJsZVRvUmVsYXRlZE1hcEtleV1bb1RhYmxlRmllbGRDb2RlXSA9IGZtLndvcmtmbG93X2ZpZWxkXG5cdFx0fVxuXHRcdC8vIOWIpOaWreaYr+WQpuaYr+WtkOihqOWtl+autVxuXHRcdGVsc2UgaWYgKGZtLndvcmtmbG93X2ZpZWxkLmluZGV4T2YoJy4kLicpID4gMCAmJiBmbS5vYmplY3RfZmllbGQuaW5kZXhPZignLiQuJykgPiAwKSB7XG5cdFx0XHR2YXIgd1RhYmxlQ29kZSA9IGZtLndvcmtmbG93X2ZpZWxkLnNwbGl0KCcuJC4nKVswXTtcblx0XHRcdHZhciBvVGFibGVDb2RlID0gZm0ub2JqZWN0X2ZpZWxkLnNwbGl0KCcuJC4nKVswXTtcblx0XHRcdGlmICh2YWx1ZXMuaGFzT3duUHJvcGVydHkod1RhYmxlQ29kZSkgJiYgXy5pc0FycmF5KHZhbHVlc1t3VGFibGVDb2RlXSkpIHtcblx0XHRcdFx0dGFibGVGaWVsZENvZGVzLnB1c2goSlNPTi5zdHJpbmdpZnkoe1xuXHRcdFx0XHRcdHdvcmtmbG93X3RhYmxlX2ZpZWxkX2NvZGU6IHdUYWJsZUNvZGUsXG5cdFx0XHRcdFx0b2JqZWN0X3RhYmxlX2ZpZWxkX2NvZGU6IG9UYWJsZUNvZGVcblx0XHRcdFx0fSkpO1xuXHRcdFx0XHR0YWJsZUZpZWxkTWFwLnB1c2goZm0pO1xuXHRcdFx0fVxuXG5cdFx0fVxuXHRcdGVsc2UgaWYgKHZhbHVlcy5oYXNPd25Qcm9wZXJ0eShmbS53b3JrZmxvd19maWVsZCkpIHtcblx0XHRcdHZhciB3RmllbGQgPSBudWxsO1xuXG5cdFx0XHRfLmVhY2goZm9ybUZpZWxkcywgZnVuY3Rpb24gKGZmKSB7XG5cdFx0XHRcdGlmICghd0ZpZWxkKSB7XG5cdFx0XHRcdFx0aWYgKGZmLmNvZGUgPT09IGZtLndvcmtmbG93X2ZpZWxkKSB7XG5cdFx0XHRcdFx0XHR3RmllbGQgPSBmZjtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKGZmLnR5cGUgPT09ICdzZWN0aW9uJykge1xuXHRcdFx0XHRcdFx0Xy5lYWNoKGZmLmZpZWxkcywgZnVuY3Rpb24gKGYpIHtcblx0XHRcdFx0XHRcdFx0aWYgKCF3RmllbGQpIHtcblx0XHRcdFx0XHRcdFx0XHRpZiAoZi5jb2RlID09PSBmbS53b3JrZmxvd19maWVsZCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0d0ZpZWxkID0gZjtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXG5cdFx0XHR2YXIgb0ZpZWxkID0gb2JqZWN0RmllbGRzW2ZtLm9iamVjdF9maWVsZF07XG5cblx0XHRcdGlmIChvRmllbGQpIHtcblx0XHRcdFx0aWYgKCF3RmllbGQpIHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnZm0ud29ya2Zsb3dfZmllbGQ6ICcsIGZtLndvcmtmbG93X2ZpZWxkKVxuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIOihqOWNlemAieS6uumAiee7hOWtl+autSDoh7Mg5a+56LGhIGxvb2t1cCBtYXN0ZXJfZGV0YWls57G75Z6L5a2X5q615ZCM5q2lXG5cdFx0XHRcdGlmIChbJ3VzZXInLCAnZ3JvdXAnXS5pbmNsdWRlcyh3RmllbGQudHlwZSkgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKG9GaWVsZC50eXBlKSAmJiBbJ3VzZXJzJywgJ29yZ2FuaXphdGlvbnMnXS5pbmNsdWRlcyhvRmllbGQucmVmZXJlbmNlX3RvKSkge1xuXHRcdFx0XHRcdGlmICghXy5pc0VtcHR5KHZhbHVlc1tmbS53b3JrZmxvd19maWVsZF0pKSB7XG5cdFx0XHRcdFx0XHRpZiAob0ZpZWxkLm11bHRpcGxlICYmIHdGaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuXHRcdFx0XHRcdFx0XHRvYmpbZm0ub2JqZWN0X2ZpZWxkXSA9IF8uY29tcGFjdChfLnBsdWNrKHZhbHVlc1tmbS53b3JrZmxvd19maWVsZF0sICdpZCcpKVxuXHRcdFx0XHRcdFx0fSBlbHNlIGlmICghb0ZpZWxkLm11bHRpcGxlICYmICF3RmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcblx0XHRcdFx0XHRcdFx0b2JqW2ZtLm9iamVjdF9maWVsZF0gPSB2YWx1ZXNbZm0ud29ya2Zsb3dfZmllbGRdLmlkXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYgKCFvRmllbGQubXVsdGlwbGUgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKG9GaWVsZC50eXBlKSAmJiBfLmlzU3RyaW5nKG9GaWVsZC5yZWZlcmVuY2VfdG8pICYmIF8uaXNTdHJpbmcodmFsdWVzW2ZtLndvcmtmbG93X2ZpZWxkXSkpIHtcblx0XHRcdFx0XHR2YXIgb0NvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob0ZpZWxkLnJlZmVyZW5jZV90bywgc3BhY2VJZClcblx0XHRcdFx0XHR2YXIgcmVmZXJPYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvRmllbGQucmVmZXJlbmNlX3RvLCBzcGFjZUlkKVxuXHRcdFx0XHRcdGlmIChvQ29sbGVjdGlvbiAmJiByZWZlck9iamVjdCkge1xuXHRcdFx0XHRcdFx0Ly8g5YWI6K6k5Li65q2k5YC85pivcmVmZXJPYmplY3QgX2lk5a2X5q615YC8XG5cdFx0XHRcdFx0XHR2YXIgcmVmZXJEYXRhID0gb0NvbGxlY3Rpb24uZmluZE9uZSh2YWx1ZXNbZm0ud29ya2Zsb3dfZmllbGRdLCB7XG5cdFx0XHRcdFx0XHRcdGZpZWxkczoge1xuXHRcdFx0XHRcdFx0XHRcdF9pZDogMVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdGlmIChyZWZlckRhdGEpIHtcblx0XHRcdFx0XHRcdFx0b2JqW2ZtLm9iamVjdF9maWVsZF0gPSByZWZlckRhdGEuX2lkO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHQvLyDlhbbmrKHorqTkuLrmraTlgLzmmK9yZWZlck9iamVjdCBOQU1FX0ZJRUxEX0tFWeWAvFxuXHRcdFx0XHRcdFx0aWYgKCFyZWZlckRhdGEpIHtcblx0XHRcdFx0XHRcdFx0dmFyIG5hbWVGaWVsZEtleSA9IHJlZmVyT2JqZWN0Lk5BTUVfRklFTERfS0VZO1xuXHRcdFx0XHRcdFx0XHR2YXIgc2VsZWN0b3IgPSB7fTtcblx0XHRcdFx0XHRcdFx0c2VsZWN0b3JbbmFtZUZpZWxkS2V5XSA9IHZhbHVlc1tmbS53b3JrZmxvd19maWVsZF07XG5cdFx0XHRcdFx0XHRcdHJlZmVyRGF0YSA9IG9Db2xsZWN0aW9uLmZpbmRPbmUoc2VsZWN0b3IsIHtcblx0XHRcdFx0XHRcdFx0XHRmaWVsZHM6IHtcblx0XHRcdFx0XHRcdFx0XHRcdF9pZDogMVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdGlmIChyZWZlckRhdGEpIHtcblx0XHRcdFx0XHRcdFx0XHRvYmpbZm0ub2JqZWN0X2ZpZWxkXSA9IHJlZmVyRGF0YS5faWQ7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRpZiAob0ZpZWxkLnR5cGUgPT09IFwiYm9vbGVhblwiKSB7XG5cdFx0XHRcdFx0XHR2YXIgdG1wX2ZpZWxkX3ZhbHVlID0gdmFsdWVzW2ZtLndvcmtmbG93X2ZpZWxkXTtcblx0XHRcdFx0XHRcdGlmIChbJ3RydWUnLCAn5pivJ10uaW5jbHVkZXModG1wX2ZpZWxkX3ZhbHVlKSkge1xuXHRcdFx0XHRcdFx0XHRvYmpbZm0ub2JqZWN0X2ZpZWxkXSA9IHRydWU7XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKFsnZmFsc2UnLCAn5ZCmJ10uaW5jbHVkZXModG1wX2ZpZWxkX3ZhbHVlKSkge1xuXHRcdFx0XHRcdFx0XHRvYmpbZm0ub2JqZWN0X2ZpZWxkXSA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0b2JqW2ZtLm9iamVjdF9maWVsZF0gPSB0bXBfZmllbGRfdmFsdWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2UgaWYgKFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhvRmllbGQudHlwZSkgJiYgd0ZpZWxkLnR5cGUgPT09ICdvZGF0YScpIHtcblx0XHRcdFx0XHRcdGlmIChvRmllbGQubXVsdGlwbGUgJiYgd0ZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG5cdFx0XHRcdFx0XHRcdG9ialtmbS5vYmplY3RfZmllbGRdID0gXy5jb21wYWN0KF8ucGx1Y2sodmFsdWVzW2ZtLndvcmtmbG93X2ZpZWxkXSwgJ19pZCcpKVxuXHRcdFx0XHRcdFx0fSBlbHNlIGlmICghb0ZpZWxkLm11bHRpcGxlICYmICF3RmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcblx0XHRcdFx0XHRcdFx0aWYgKCFfLmlzRW1wdHkodmFsdWVzW2ZtLndvcmtmbG93X2ZpZWxkXSkpIHtcblx0XHRcdFx0XHRcdFx0XHRvYmpbZm0ub2JqZWN0X2ZpZWxkXSA9IHZhbHVlc1tmbS53b3JrZmxvd19maWVsZF0uX2lkXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdG9ialtmbS5vYmplY3RfZmllbGRdID0gdmFsdWVzW2ZtLndvcmtmbG93X2ZpZWxkXTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRvYmpbZm0ub2JqZWN0X2ZpZWxkXSA9IHZhbHVlc1tmbS53b3JrZmxvd19maWVsZF07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpZiAoZm0ub2JqZWN0X2ZpZWxkLmluZGV4T2YoJy4nKSA+IC0xKSB7XG5cdFx0XHRcdFx0dmFyIHRlbU9iakZpZWxkcyA9IGZtLm9iamVjdF9maWVsZC5zcGxpdCgnLicpO1xuXHRcdFx0XHRcdGlmICh0ZW1PYmpGaWVsZHMubGVuZ3RoID09PSAyKSB7XG5cdFx0XHRcdFx0XHR2YXIgb2JqRmllbGQgPSB0ZW1PYmpGaWVsZHNbMF07XG5cdFx0XHRcdFx0XHR2YXIgcmVmZXJPYmpGaWVsZCA9IHRlbU9iakZpZWxkc1sxXTtcblx0XHRcdFx0XHRcdHZhciBvRmllbGQgPSBvYmplY3RGaWVsZHNbb2JqRmllbGRdO1xuXHRcdFx0XHRcdFx0aWYgKCFvRmllbGQubXVsdGlwbGUgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKG9GaWVsZC50eXBlKSAmJiBfLmlzU3RyaW5nKG9GaWVsZC5yZWZlcmVuY2VfdG8pKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBvQ29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvRmllbGQucmVmZXJlbmNlX3RvLCBzcGFjZUlkKVxuXHRcdFx0XHRcdFx0XHRpZiAob0NvbGxlY3Rpb24gJiYgcmVjb3JkICYmIHJlY29yZFtvYmpGaWVsZF0pIHtcblx0XHRcdFx0XHRcdFx0XHR2YXIgcmVmZXJTZXRPYmogPSB7fTtcblx0XHRcdFx0XHRcdFx0XHRyZWZlclNldE9ialtyZWZlck9iakZpZWxkXSA9IHZhbHVlc1tmbS53b3JrZmxvd19maWVsZF07XG5cdFx0XHRcdFx0XHRcdFx0b0NvbGxlY3Rpb24udXBkYXRlKHJlY29yZFtvYmpGaWVsZF0sIHtcblx0XHRcdFx0XHRcdFx0XHRcdCRzZXQ6IHJlZmVyU2V0T2JqXG5cdFx0XHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHQvLyBlbHNle1xuXHRcdFx0XHQvLyBcdHZhciByZWxhdGVkT2JqZWN0ID0gXy5maW5kKHJlbGF0ZWRPYmplY3RzLCBmdW5jdGlvbihfcmVsYXRlZE9iamVjdCl7XG5cdFx0XHRcdC8vIFx0XHRyZXR1cm4gX3JlbGF0ZWRPYmplY3Qub2JqZWN0X25hbWUgPT09IGZtLm9iamVjdF9maWVsZFxuXHRcdFx0XHQvLyBcdH0pXG5cdFx0XHRcdC8vXG5cdFx0XHRcdC8vIFx0aWYocmVsYXRlZE9iamVjdCl7XG5cdFx0XHRcdC8vIFx0XHRvYmpbZm0ub2JqZWN0X2ZpZWxkXSA9IHZhbHVlc1tmbS53b3JrZmxvd19maWVsZF07XG5cdFx0XHRcdC8vIFx0fVxuXHRcdFx0XHQvLyB9XG5cdFx0XHR9XG5cblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRpZiAoZm0ud29ya2Zsb3dfZmllbGQuc3RhcnRzV2l0aCgnaW5zdGFuY2UuJykpIHtcblx0XHRcdFx0dmFyIGluc0ZpZWxkID0gZm0ud29ya2Zsb3dfZmllbGQuc3BsaXQoJ2luc3RhbmNlLicpWzFdO1xuXHRcdFx0XHRpZiAoSW5zdGFuY2VSZWNvcmRRdWV1ZS5zeW5jSW5zRmllbGRzLmluY2x1ZGVzKGluc0ZpZWxkKSkge1xuXHRcdFx0XHRcdGlmIChmbS5vYmplY3RfZmllbGQuaW5kZXhPZignLicpIDwgMCkge1xuXHRcdFx0XHRcdFx0b2JqW2ZtLm9iamVjdF9maWVsZF0gPSBpbnNbaW5zRmllbGRdO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHR2YXIgdGVtT2JqRmllbGRzID0gZm0ub2JqZWN0X2ZpZWxkLnNwbGl0KCcuJyk7XG5cdFx0XHRcdFx0XHRpZiAodGVtT2JqRmllbGRzLmxlbmd0aCA9PT0gMikge1xuXHRcdFx0XHRcdFx0XHR2YXIgb2JqRmllbGQgPSB0ZW1PYmpGaWVsZHNbMF07XG5cdFx0XHRcdFx0XHRcdHZhciByZWZlck9iakZpZWxkID0gdGVtT2JqRmllbGRzWzFdO1xuXHRcdFx0XHRcdFx0XHR2YXIgb0ZpZWxkID0gb2JqZWN0RmllbGRzW29iakZpZWxkXTtcblx0XHRcdFx0XHRcdFx0aWYgKCFvRmllbGQubXVsdGlwbGUgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKG9GaWVsZC50eXBlKSAmJiBfLmlzU3RyaW5nKG9GaWVsZC5yZWZlcmVuY2VfdG8pKSB7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIG9Db2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9GaWVsZC5yZWZlcmVuY2VfdG8sIHNwYWNlSWQpXG5cdFx0XHRcdFx0XHRcdFx0aWYgKG9Db2xsZWN0aW9uICYmIHJlY29yZCAmJiByZWNvcmRbb2JqRmllbGRdKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR2YXIgcmVmZXJTZXRPYmogPSB7fTtcblx0XHRcdFx0XHRcdFx0XHRcdHJlZmVyU2V0T2JqW3JlZmVyT2JqRmllbGRdID0gaW5zW2luc0ZpZWxkXTtcblx0XHRcdFx0XHRcdFx0XHRcdG9Db2xsZWN0aW9uLnVwZGF0ZShyZWNvcmRbb2JqRmllbGRdLCB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdCRzZXQ6IHJlZmVyU2V0T2JqXG5cdFx0XHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpZiAoaW5zW2ZtLndvcmtmbG93X2ZpZWxkXSkge1xuXHRcdFx0XHRcdG9ialtmbS5vYmplY3RfZmllbGRdID0gaW5zW2ZtLndvcmtmbG93X2ZpZWxkXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fSlcblxuXHRfLnVuaXEodGFibGVGaWVsZENvZGVzKS5mb3JFYWNoKGZ1bmN0aW9uICh0ZmMpIHtcblx0XHR2YXIgYyA9IEpTT04ucGFyc2UodGZjKTtcblx0XHRvYmpbYy5vYmplY3RfdGFibGVfZmllbGRfY29kZV0gPSBbXTtcblx0XHR2YWx1ZXNbYy53b3JrZmxvd190YWJsZV9maWVsZF9jb2RlXS5mb3JFYWNoKGZ1bmN0aW9uICh0cikge1xuXHRcdFx0dmFyIG5ld1RyID0ge307XG5cdFx0XHRfLmVhY2godHIsIGZ1bmN0aW9uICh2LCBrKSB7XG5cdFx0XHRcdHRhYmxlRmllbGRNYXAuZm9yRWFjaChmdW5jdGlvbiAodGZtKSB7XG5cdFx0XHRcdFx0aWYgKHRmbS53b3JrZmxvd19maWVsZCA9PSAoYy53b3JrZmxvd190YWJsZV9maWVsZF9jb2RlICsgJy4kLicgKyBrKSkge1xuXHRcdFx0XHRcdFx0dmFyIG9UZENvZGUgPSB0Zm0ub2JqZWN0X2ZpZWxkLnNwbGl0KCcuJC4nKVsxXTtcblx0XHRcdFx0XHRcdG5ld1RyW29UZENvZGVdID0gdjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pXG5cdFx0XHR9KVxuXHRcdFx0aWYgKCFfLmlzRW1wdHkobmV3VHIpKSB7XG5cdFx0XHRcdG9ialtjLm9iamVjdF90YWJsZV9maWVsZF9jb2RlXS5wdXNoKG5ld1RyKTtcblx0XHRcdH1cblx0XHR9KVxuXHR9KTtcblx0dmFyIHJlbGF0ZWRPYmpzID0ge307XG5cdHZhciBnZXRSZWxhdGVkRmllbGRWYWx1ZSA9IGZ1bmN0aW9uICh2YWx1ZUtleSwgcGFyZW50KSB7XG5cdFx0cmV0dXJuIHZhbHVlS2V5LnNwbGl0KCcuJykucmVkdWNlKGZ1bmN0aW9uIChvLCB4KSB7XG5cdFx0XHRyZXR1cm4gb1t4XTtcblx0XHR9LCBwYXJlbnQpO1xuXHR9O1xuXHRfLmVhY2godGFibGVUb1JlbGF0ZWRNYXAsIGZ1bmN0aW9uIChtYXAsIGtleSkge1xuXHRcdHZhciB0YWJsZUNvZGUgPSBtYXAuX0ZST01fVEFCTEVfQ09ERTtcblx0XHRpZiAoIXRhYmxlQ29kZSkge1xuXHRcdFx0Y29uc29sZS53YXJuKCd0YWJsZVRvUmVsYXRlZDogWycgKyBrZXkgKyAnXSBtaXNzaW5nIGNvcnJlc3BvbmRpbmcgdGFibGUuJylcblx0XHR9IGVsc2Uge1xuXHRcdFx0dmFyIHJlbGF0ZWRPYmplY3ROYW1lID0ga2V5O1xuXHRcdFx0dmFyIHJlbGF0ZWRPYmplY3RWYWx1ZXMgPSBbXTtcblx0XHRcdHZhciByZWxhdGVkT2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QocmVsYXRlZE9iamVjdE5hbWUsIHNwYWNlSWQpO1xuXHRcdFx0Xy5lYWNoKHZhbHVlc1t0YWJsZUNvZGVdLCBmdW5jdGlvbiAodGFibGVWYWx1ZUl0ZW0pIHtcblx0XHRcdFx0dmFyIHJlbGF0ZWRPYmplY3RWYWx1ZSA9IHt9O1xuXHRcdFx0XHRfLmVhY2gobWFwLCBmdW5jdGlvbiAodmFsdWVLZXksIGZpZWxkS2V5KSB7XG5cdFx0XHRcdFx0aWYgKGZpZWxkS2V5ICE9ICdfRlJPTV9UQUJMRV9DT0RFJykge1xuXHRcdFx0XHRcdFx0aWYgKHZhbHVlS2V5LnN0YXJ0c1dpdGgoJ2luc3RhbmNlLicpKSB7XG5cdFx0XHRcdFx0XHRcdHJlbGF0ZWRPYmplY3RWYWx1ZVtmaWVsZEtleV0gPSBnZXRSZWxhdGVkRmllbGRWYWx1ZSh2YWx1ZUtleSwgeyAnaW5zdGFuY2UnOiBpbnMgfSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdFx0dmFyIHJlbGF0ZWRPYmplY3RGaWVsZFZhbHVlLCBmb3JtRmllbGRLZXk7XG5cdFx0XHRcdFx0XHRcdGlmICh2YWx1ZUtleS5zdGFydHNXaXRoKHRhYmxlQ29kZSArICcuJykpIHtcblx0XHRcdFx0XHRcdFx0XHRmb3JtRmllbGRLZXkgPSB2YWx1ZUtleS5zcGxpdChcIi5cIilbMV07XG5cdFx0XHRcdFx0XHRcdFx0cmVsYXRlZE9iamVjdEZpZWxkVmFsdWUgPSBnZXRSZWxhdGVkRmllbGRWYWx1ZSh2YWx1ZUtleSwgeyBbdGFibGVDb2RlXTogdGFibGVWYWx1ZUl0ZW0gfSk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0Zm9ybUZpZWxkS2V5ID0gdmFsdWVLZXk7XG5cdFx0XHRcdFx0XHRcdFx0cmVsYXRlZE9iamVjdEZpZWxkVmFsdWUgPSBnZXRSZWxhdGVkRmllbGRWYWx1ZSh2YWx1ZUtleSwgdmFsdWVzKVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdHZhciBmb3JtRmllbGQgPSBnZXRGb3JtRmllbGQoZm9ybUZpZWxkcywgZm9ybUZpZWxkS2V5KTtcblx0XHRcdFx0XHRcdFx0dmFyIHJlbGF0ZWRPYmplY3RGaWVsZCA9IHJlbGF0ZWRPYmplY3QuZmllbGRzW2ZpZWxkS2V5XTtcblx0XHRcdFx0XHRcdFx0aWYgKCFyZWxhdGVkT2JqZWN0RmllbGQgfHwgIWZvcm1GaWVsZCkge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVyblxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGlmIChmb3JtRmllbGQudHlwZSA9PSAnb2RhdGEnICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhyZWxhdGVkT2JqZWN0RmllbGQudHlwZSkpIHtcblx0XHRcdFx0XHRcdFx0XHRpZiAoIV8uaXNFbXB0eShyZWxhdGVkT2JqZWN0RmllbGRWYWx1ZSkpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChyZWxhdGVkT2JqZWN0RmllbGQubXVsdGlwbGUgJiYgZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJlbGF0ZWRPYmplY3RGaWVsZFZhbHVlID0gXy5jb21wYWN0KF8ucGx1Y2socmVsYXRlZE9iamVjdEZpZWxkVmFsdWUsICdfaWQnKSlcblx0XHRcdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoIXJlbGF0ZWRPYmplY3RGaWVsZC5tdWx0aXBsZSAmJiAhZm9ybUZpZWxkLmlzX211bHRpc2VsZWN0KSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJlbGF0ZWRPYmplY3RGaWVsZFZhbHVlID0gcmVsYXRlZE9iamVjdEZpZWxkVmFsdWUuX2lkXG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdC8vIOihqOWNlemAieS6uumAiee7hOWtl+autSDoh7Mg5a+56LGhIGxvb2t1cCBtYXN0ZXJfZGV0YWls57G75Z6L5a2X5q615ZCM5q2lXG5cdFx0XHRcdFx0XHRcdGlmIChbJ3VzZXInLCAnZ3JvdXAnXS5pbmNsdWRlcyhmb3JtRmllbGQudHlwZSkgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKHJlbGF0ZWRPYmplY3RGaWVsZC50eXBlKSAmJiBbJ3VzZXJzJywgJ29yZ2FuaXphdGlvbnMnXS5pbmNsdWRlcyhyZWxhdGVkT2JqZWN0RmllbGQucmVmZXJlbmNlX3RvKSkge1xuXHRcdFx0XHRcdFx0XHRcdGlmICghXy5pc0VtcHR5KHJlbGF0ZWRPYmplY3RGaWVsZFZhbHVlKSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKHJlbGF0ZWRPYmplY3RGaWVsZC5tdWx0aXBsZSAmJiBmb3JtRmllbGQuaXNfbXVsdGlzZWxlY3QpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmVsYXRlZE9iamVjdEZpZWxkVmFsdWUgPSBfLmNvbXBhY3QoXy5wbHVjayhyZWxhdGVkT2JqZWN0RmllbGRWYWx1ZSwgJ2lkJykpXG5cdFx0XHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCFyZWxhdGVkT2JqZWN0RmllbGQubXVsdGlwbGUgJiYgIWZvcm1GaWVsZC5pc19tdWx0aXNlbGVjdCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZWxhdGVkT2JqZWN0RmllbGRWYWx1ZSA9IHJlbGF0ZWRPYmplY3RGaWVsZFZhbHVlLmlkXG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdHJlbGF0ZWRPYmplY3RWYWx1ZVtmaWVsZEtleV0gPSByZWxhdGVkT2JqZWN0RmllbGRWYWx1ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRyZWxhdGVkT2JqZWN0VmFsdWVbJ190YWJsZSddID0ge1xuXHRcdFx0XHRcdF9pZDogdGFibGVWYWx1ZUl0ZW1bXCJfaWRcIl0sXG5cdFx0XHRcdFx0X2NvZGU6IHRhYmxlQ29kZVxuXHRcdFx0XHR9O1xuXHRcdFx0XHRyZWxhdGVkT2JqZWN0VmFsdWVzLnB1c2gocmVsYXRlZE9iamVjdFZhbHVlKTtcblx0XHRcdH0pO1xuXHRcdFx0cmVsYXRlZE9ianNbcmVsYXRlZE9iamVjdE5hbWVdID0gcmVsYXRlZE9iamVjdFZhbHVlcztcblx0XHR9XG5cdH0pXG5cblx0aWYgKGZpZWxkX21hcF9iYWNrX3NjcmlwdCkge1xuXHRcdF8uZXh0ZW5kKG9iaiwgSW5zdGFuY2VSZWNvcmRRdWV1ZS5ldmFsRmllbGRNYXBCYWNrU2NyaXB0KGZpZWxkX21hcF9iYWNrX3NjcmlwdCwgaW5zKSk7XG5cdH1cblx0Ly8g6L+H5ruk5o6J6Z2e5rOV55qEa2V5XG5cdHZhciBmaWx0ZXJPYmogPSB7fTtcblxuXHRfLmVhY2goXy5rZXlzKG9iaiksIGZ1bmN0aW9uIChrKSB7XG5cdFx0aWYgKG9iamVjdEZpZWxkS2V5cy5pbmNsdWRlcyhrKSkge1xuXHRcdFx0ZmlsdGVyT2JqW2tdID0gb2JqW2tdO1xuXHRcdH1cblx0XHQvLyBlbHNlIGlmKHJlbGF0ZWRPYmplY3RzS2V5cy5pbmNsdWRlcyhrKSAmJiBfLmlzQXJyYXkob2JqW2tdKSl7XG5cdFx0Ly8gXHRpZihfLmlzQXJyYXkocmVsYXRlZE9ianNba10pKXtcblx0XHQvLyBcdFx0cmVsYXRlZE9ianNba10gPSByZWxhdGVkT2Jqc1trXS5jb25jYXQob2JqW2tdKVxuXHRcdC8vIFx0fWVsc2V7XG5cdFx0Ly8gXHRcdHJlbGF0ZWRPYmpzW2tdID0gb2JqW2tdXG5cdFx0Ly8gXHR9XG5cdFx0Ly8gfVxuXHR9KVxuXHRyZXR1cm4ge1xuXHRcdG1haW5PYmplY3RWYWx1ZTogZmlsdGVyT2JqLFxuXHRcdHJlbGF0ZWRPYmplY3RzVmFsdWU6IHJlbGF0ZWRPYmpzXG5cdH07XG59XG5cbkluc3RhbmNlUmVjb3JkUXVldWUuZXZhbEZpZWxkTWFwQmFja1NjcmlwdCA9IGZ1bmN0aW9uIChmaWVsZF9tYXBfYmFja19zY3JpcHQsIGlucykge1xuXHR2YXIgc2NyaXB0ID0gXCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpbnN0YW5jZSkgeyBcIiArIGZpZWxkX21hcF9iYWNrX3NjcmlwdCArIFwiIH1cIjtcblx0dmFyIGZ1bmMgPSBfZXZhbChzY3JpcHQsIFwiZmllbGRfbWFwX3NjcmlwdFwiKTtcblx0dmFyIHZhbHVlcyA9IGZ1bmMoaW5zKTtcblx0aWYgKF8uaXNPYmplY3QodmFsdWVzKSkge1xuXHRcdHJldHVybiB2YWx1ZXM7XG5cdH0gZWxzZSB7XG5cdFx0Y29uc29sZS5lcnJvcihcImV2YWxGaWVsZE1hcEJhY2tTY3JpcHQ6IOiEmuacrOi/lOWbnuWAvOexu+Wei+S4jeaYr+WvueixoVwiKTtcblx0fVxuXHRyZXR1cm4ge31cbn1cblxuSW5zdGFuY2VSZWNvcmRRdWV1ZS5zeW5jUmVsYXRlZE9iamVjdHNWYWx1ZSA9IGZ1bmN0aW9uIChtYWluUmVjb3JkSWQsIHJlbGF0ZWRPYmplY3RzLCByZWxhdGVkT2JqZWN0c1ZhbHVlLCBzcGFjZUlkLCBpbnMpIHtcblx0dmFyIGluc0lkID0gaW5zLl9pZDtcblxuXHRfLmVhY2gocmVsYXRlZE9iamVjdHMsIGZ1bmN0aW9uIChyZWxhdGVkT2JqZWN0KSB7XG5cdFx0dmFyIG9iamVjdENvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVsYXRlZE9iamVjdC5vYmplY3RfbmFtZSwgc3BhY2VJZCk7XG5cdFx0dmFyIHRhYmxlTWFwID0ge307XG5cdFx0Xy5lYWNoKHJlbGF0ZWRPYmplY3RzVmFsdWVbcmVsYXRlZE9iamVjdC5vYmplY3RfbmFtZV0sIGZ1bmN0aW9uIChyZWxhdGVkT2JqZWN0VmFsdWUpIHtcblx0XHRcdHZhciB0YWJsZV9pZCA9IHJlbGF0ZWRPYmplY3RWYWx1ZS5fdGFibGUuX2lkO1xuXHRcdFx0dmFyIHRhYmxlX2NvZGUgPSByZWxhdGVkT2JqZWN0VmFsdWUuX3RhYmxlLl9jb2RlO1xuXHRcdFx0aWYgKCF0YWJsZU1hcFt0YWJsZV9jb2RlXSkge1xuXHRcdFx0XHR0YWJsZU1hcFt0YWJsZV9jb2RlXSA9IFtdXG5cdFx0XHR9O1xuXHRcdFx0dGFibGVNYXBbdGFibGVfY29kZV0ucHVzaCh0YWJsZV9pZCk7XG5cdFx0XHR2YXIgb2xkUmVsYXRlZFJlY29yZCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWxhdGVkT2JqZWN0Lm9iamVjdF9uYW1lLCBzcGFjZUlkKS5maW5kT25lKHsgW3JlbGF0ZWRPYmplY3QuZm9yZWlnbl9rZXldOiBtYWluUmVjb3JkSWQsIFwiaW5zdGFuY2VzLl9pZFwiOiBpbnNJZCwgX3RhYmxlOiByZWxhdGVkT2JqZWN0VmFsdWUuX3RhYmxlIH0sIHsgZmllbGRzOiB7IF9pZDogMSB9IH0pXG5cdFx0XHRpZiAob2xkUmVsYXRlZFJlY29yZCkge1xuXHRcdFx0XHRDcmVhdG9yLmdldENvbGxlY3Rpb24ocmVsYXRlZE9iamVjdC5vYmplY3RfbmFtZSwgc3BhY2VJZCkudXBkYXRlKHsgX2lkOiBvbGRSZWxhdGVkUmVjb3JkLl9pZCB9LCB7ICRzZXQ6IHJlbGF0ZWRPYmplY3RWYWx1ZSB9KVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmVsYXRlZE9iamVjdFZhbHVlW3JlbGF0ZWRPYmplY3QuZm9yZWlnbl9rZXldID0gbWFpblJlY29yZElkO1xuXHRcdFx0XHRyZWxhdGVkT2JqZWN0VmFsdWUuc3BhY2UgPSBzcGFjZUlkO1xuXHRcdFx0XHRyZWxhdGVkT2JqZWN0VmFsdWUub3duZXIgPSBpbnMuYXBwbGljYW50O1xuXHRcdFx0XHRyZWxhdGVkT2JqZWN0VmFsdWUuY3JlYXRlZF9ieSA9IGlucy5hcHBsaWNhbnQ7XG5cdFx0XHRcdHJlbGF0ZWRPYmplY3RWYWx1ZS5tb2RpZmllZF9ieSA9IGlucy5hcHBsaWNhbnQ7XG5cdFx0XHRcdHJlbGF0ZWRPYmplY3RWYWx1ZS5faWQgPSBvYmplY3RDb2xsZWN0aW9uLl9tYWtlTmV3SUQoKTtcblx0XHRcdFx0dmFyIGluc3RhbmNlX3N0YXRlID0gaW5zLnN0YXRlO1xuXHRcdFx0XHRpZiAoaW5zLnN0YXRlID09PSAnY29tcGxldGVkJyAmJiBpbnMuZmluYWxfZGVjaXNpb24pIHtcblx0XHRcdFx0XHRpbnN0YW5jZV9zdGF0ZSA9IGlucy5maW5hbF9kZWNpc2lvbjtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZWxhdGVkT2JqZWN0VmFsdWUuaW5zdGFuY2VzID0gW3tcblx0XHRcdFx0XHRfaWQ6IGluc0lkLFxuXHRcdFx0XHRcdHN0YXRlOiBpbnN0YW5jZV9zdGF0ZVxuXHRcdFx0XHR9XTtcblx0XHRcdFx0cmVsYXRlZE9iamVjdFZhbHVlLmluc3RhbmNlX3N0YXRlID0gaW5zdGFuY2Vfc3RhdGU7XG5cdFx0XHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbihyZWxhdGVkT2JqZWN0Lm9iamVjdF9uYW1lLCBzcGFjZUlkKS5pbnNlcnQocmVsYXRlZE9iamVjdFZhbHVlLCB7IHZhbGlkYXRlOiBmYWxzZSwgZmlsdGVyOiBmYWxzZSB9KVxuXHRcdFx0fVxuXHRcdH0pXG5cdFx0Ly/muIXnkIbnlLPor7fljZXkuIrooqvliKDpmaTlrZDooajorrDlvZXlr7nlupTnmoTnm7jlhbPooajorrDlvZVcblx0XHRfLmVhY2godGFibGVNYXAsIGZ1bmN0aW9uICh0YWJsZUlkcywgdGFibGVDb2RlKSB7XG5cdFx0XHRvYmplY3RDb2xsZWN0aW9uLnJlbW92ZSh7XG5cdFx0XHRcdFtyZWxhdGVkT2JqZWN0LmZvcmVpZ25fa2V5XTogbWFpblJlY29yZElkLFxuXHRcdFx0XHRcImluc3RhbmNlcy5faWRcIjogaW5zSWQsXG5cdFx0XHRcdFwiX3RhYmxlLl9jb2RlXCI6IHRhYmxlQ29kZSxcblx0XHRcdFx0XCJfdGFibGUuX2lkXCI6IHsgJG5pbjogdGFibGVJZHMgfVxuXHRcdFx0fSlcblx0XHR9KVxuXHR9KTtcblxuXHR0YWJsZUlkcyA9IF8uY29tcGFjdCh0YWJsZUlkcyk7XG5cblxufVxuXG5JbnN0YW5jZVJlY29yZFF1ZXVlLnNlbmREb2MgPSBmdW5jdGlvbiAoZG9jKSB7XG5cdGlmIChJbnN0YW5jZVJlY29yZFF1ZXVlLmRlYnVnKSB7XG5cdFx0Y29uc29sZS5sb2coXCJzZW5kRG9jXCIpO1xuXHRcdGNvbnNvbGUubG9nKGRvYyk7XG5cdH1cblxuXHR2YXIgaW5zSWQgPSBkb2MuaW5mby5pbnN0YW5jZV9pZCxcblx0XHRyZWNvcmRzID0gZG9jLmluZm8ucmVjb3Jkcztcblx0dmFyIGZpZWxkcyA9IHtcblx0XHRmbG93OiAxLFxuXHRcdHZhbHVlczogMSxcblx0XHRhcHBsaWNhbnQ6IDEsXG5cdFx0c3BhY2U6IDEsXG5cdFx0Zm9ybTogMSxcblx0XHRmb3JtX3ZlcnNpb246IDEsXG5cdFx0dHJhY2VzOiAxXG5cdH07XG5cdEluc3RhbmNlUmVjb3JkUXVldWUuc3luY0luc0ZpZWxkcy5mb3JFYWNoKGZ1bmN0aW9uIChmKSB7XG5cdFx0ZmllbGRzW2ZdID0gMTtcblx0fSlcblx0dmFyIGlucyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignaW5zdGFuY2VzJykuZmluZE9uZShpbnNJZCwge1xuXHRcdGZpZWxkczogZmllbGRzXG5cdH0pO1xuXHR2YXIgdmFsdWVzID0gaW5zLnZhbHVlcyxcblx0XHRzcGFjZUlkID0gaW5zLnNwYWNlO1xuXG5cdGlmIChyZWNvcmRzICYmICFfLmlzRW1wdHkocmVjb3JkcykpIHtcblx0XHQvLyDmraTmg4XlhrXlsZ7kuo7ku45jcmVhdG9y5Lit5Y+R6LW35a6h5om577yM5oiW6ICF5bey57uP5LuOQXBwc+WQjOatpeWIsOS6hmNyZWF0b3Jcblx0XHR2YXIgb2JqZWN0TmFtZSA9IHJlY29yZHNbMF0ubztcblx0XHR2YXIgb3cgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ29iamVjdF93b3JrZmxvd3MnKS5maW5kT25lKHtcblx0XHRcdG9iamVjdF9uYW1lOiBvYmplY3ROYW1lLFxuXHRcdFx0Zmxvd19pZDogaW5zLmZsb3dcblx0XHR9KTtcblx0XHR2YXJcblx0XHRcdG9iamVjdENvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0TmFtZSwgc3BhY2VJZCksXG5cdFx0XHRzeW5jX2F0dGFjaG1lbnQgPSBvdy5zeW5jX2F0dGFjaG1lbnQ7XG5cdFx0dmFyIG9iamVjdEluZm8gPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3ROYW1lLCBzcGFjZUlkKTtcblx0XHRvYmplY3RDb2xsZWN0aW9uLmZpbmQoe1xuXHRcdFx0X2lkOiB7XG5cdFx0XHRcdCRpbjogcmVjb3Jkc1swXS5pZHNcblx0XHRcdH1cblx0XHR9KS5mb3JFYWNoKGZ1bmN0aW9uIChyZWNvcmQpIHtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdHZhciBzeW5jVmFsdWVzID0gSW5zdGFuY2VSZWNvcmRRdWV1ZS5zeW5jVmFsdWVzKG93LmZpZWxkX21hcF9iYWNrLCB2YWx1ZXMsIGlucywgb2JqZWN0SW5mbywgb3cuZmllbGRfbWFwX2JhY2tfc2NyaXB0LCByZWNvcmQpXG5cdFx0XHRcdHZhciBzZXRPYmogPSBzeW5jVmFsdWVzLm1haW5PYmplY3RWYWx1ZTtcblxuXHRcdFx0XHR2YXIgaW5zdGFuY2Vfc3RhdGUgPSBpbnMuc3RhdGU7XG5cdFx0XHRcdGlmIChpbnMuc3RhdGUgPT09ICdjb21wbGV0ZWQnICYmIGlucy5maW5hbF9kZWNpc2lvbikge1xuXHRcdFx0XHRcdGluc3RhbmNlX3N0YXRlID0gaW5zLmZpbmFsX2RlY2lzaW9uO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHNldE9ialsnaW5zdGFuY2VzLiQuc3RhdGUnXSA9IHNldE9iai5pbnN0YW5jZV9zdGF0ZSA9IGluc3RhbmNlX3N0YXRlO1xuXG5cdFx0XHRcdG9iamVjdENvbGxlY3Rpb24udXBkYXRlKHtcblx0XHRcdFx0XHRfaWQ6IHJlY29yZC5faWQsXG5cdFx0XHRcdFx0J2luc3RhbmNlcy5faWQnOiBpbnNJZFxuXHRcdFx0XHR9LCB7XG5cdFx0XHRcdFx0JHNldDogc2V0T2JqXG5cdFx0XHRcdH0pXG5cblx0XHRcdFx0dmFyIHJlbGF0ZWRPYmplY3RzID0gQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0cyhvdy5vYmplY3RfbmFtZSwgc3BhY2VJZCk7XG5cdFx0XHRcdHZhciByZWxhdGVkT2JqZWN0c1ZhbHVlID0gc3luY1ZhbHVlcy5yZWxhdGVkT2JqZWN0c1ZhbHVlO1xuXHRcdFx0XHRJbnN0YW5jZVJlY29yZFF1ZXVlLnN5bmNSZWxhdGVkT2JqZWN0c1ZhbHVlKHJlY29yZC5faWQsIHJlbGF0ZWRPYmplY3RzLCByZWxhdGVkT2JqZWN0c1ZhbHVlLCBzcGFjZUlkLCBpbnMpO1xuXG5cblx0XHRcdFx0Ly8g5Lul5pyA57uI55Sz6K+35Y2V6ZmE5Lu25Li65YeG77yM5pen55qEcmVjb3Jk5Lit6ZmE5Lu25Yig6ZmkXG5cdFx0XHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbignY21zX2ZpbGVzJykucmVtb3ZlKHtcblx0XHRcdFx0XHQncGFyZW50Jzoge1xuXHRcdFx0XHRcdFx0bzogb2JqZWN0TmFtZSxcblx0XHRcdFx0XHRcdGlkczogW3JlY29yZC5faWRdXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KVxuXHRcdFx0XHR2YXIgcmVtb3ZlT2xkRmlsZXMgPSBmdW5jdGlvbiAoY2IpIHtcblx0XHRcdFx0XHRyZXR1cm4gY2ZzLmZpbGVzLnJlbW92ZSh7XG5cdFx0XHRcdFx0XHQnbWV0YWRhdGEucmVjb3JkX2lkJzogcmVjb3JkLl9pZFxuXHRcdFx0XHRcdH0sIGNiKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0TWV0ZW9yLndyYXBBc3luYyhyZW1vdmVPbGRGaWxlcykoKTtcblx0XHRcdFx0Ly8g5ZCM5q2l5paw6ZmE5Lu2XG5cdFx0XHRcdEluc3RhbmNlUmVjb3JkUXVldWUuc3luY0F0dGFjaChzeW5jX2F0dGFjaG1lbnQsIGluc0lkLCByZWNvcmQuc3BhY2UsIHJlY29yZC5faWQsIG9iamVjdE5hbWUpO1xuXG5cdFx0XHRcdC8vIOaJp+ihjOWFrOW8j1xuXHRcdFx0XHRydW5RdW90ZWQob2JqZWN0TmFtZSwgcmVjb3JkLl9pZCk7XG5cdFx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKGVycm9yLnN0YWNrKTtcblx0XHRcdFx0b2JqZWN0Q29sbGVjdGlvbi51cGRhdGUoe1xuXHRcdFx0XHRcdF9pZDogcmVjb3JkLl9pZCxcblx0XHRcdFx0XHQnaW5zdGFuY2VzLl9pZCc6IGluc0lkXG5cdFx0XHRcdH0sIHtcblx0XHRcdFx0XHQkc2V0OiB7XG5cdFx0XHRcdFx0XHQnaW5zdGFuY2VzLiQuc3RhdGUnOiAncGVuZGluZycsXG5cdFx0XHRcdFx0XHQnaW5zdGFuY2Vfc3RhdGUnOiAncGVuZGluZydcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pXG5cblx0XHRcdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKCdjbXNfZmlsZXMnKS5yZW1vdmUoe1xuXHRcdFx0XHRcdCdwYXJlbnQnOiB7XG5cdFx0XHRcdFx0XHRvOiBvYmplY3ROYW1lLFxuXHRcdFx0XHRcdFx0aWRzOiBbcmVjb3JkLl9pZF1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pXG5cdFx0XHRcdGNmcy5maWxlcy5yZW1vdmUoe1xuXHRcdFx0XHRcdCdtZXRhZGF0YS5yZWNvcmRfaWQnOiByZWNvcmQuX2lkXG5cdFx0XHRcdH0pXG5cblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGVycm9yKTtcblx0XHRcdH1cblxuXHRcdH0pXG5cdH0gZWxzZSB7XG5cdFx0Ly8g5q2k5oOF5Ya15bGe5LqO5LuOYXBwc+S4reWPkei1t+WuoeaJuVxuXHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbignb2JqZWN0X3dvcmtmbG93cycpLmZpbmQoe1xuXHRcdFx0Zmxvd19pZDogaW5zLmZsb3dcblx0XHR9KS5mb3JFYWNoKGZ1bmN0aW9uIChvdykge1xuXHRcdFx0dHJ5IHtcblx0XHRcdFx0dmFyXG5cdFx0XHRcdFx0b2JqZWN0Q29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvdy5vYmplY3RfbmFtZSwgc3BhY2VJZCksXG5cdFx0XHRcdFx0c3luY19hdHRhY2htZW50ID0gb3cuc3luY19hdHRhY2htZW50LFxuXHRcdFx0XHRcdG5ld1JlY29yZElkID0gb2JqZWN0Q29sbGVjdGlvbi5fbWFrZU5ld0lEKCksXG5cdFx0XHRcdFx0b2JqZWN0TmFtZSA9IG93Lm9iamVjdF9uYW1lO1xuXG5cdFx0XHRcdHZhciBvYmplY3RJbmZvID0gQ3JlYXRvci5nZXRPYmplY3Qob3cub2JqZWN0X25hbWUsIHNwYWNlSWQpO1xuXHRcdFx0XHR2YXIgc3luY1ZhbHVlcyA9IEluc3RhbmNlUmVjb3JkUXVldWUuc3luY1ZhbHVlcyhvdy5maWVsZF9tYXBfYmFjaywgdmFsdWVzLCBpbnMsIG9iamVjdEluZm8sIG93LmZpZWxkX21hcF9iYWNrX3NjcmlwdCk7XG5cdFx0XHRcdHZhciBuZXdPYmogPSBzeW5jVmFsdWVzLm1haW5PYmplY3RWYWx1ZTtcblxuXHRcdFx0XHRuZXdPYmouX2lkID0gbmV3UmVjb3JkSWQ7XG5cdFx0XHRcdG5ld09iai5zcGFjZSA9IHNwYWNlSWQ7XG5cdFx0XHRcdG5ld09iai5uYW1lID0gbmV3T2JqLm5hbWUgfHwgaW5zLm5hbWU7XG5cblx0XHRcdFx0dmFyIGluc3RhbmNlX3N0YXRlID0gaW5zLnN0YXRlO1xuXHRcdFx0XHRpZiAoaW5zLnN0YXRlID09PSAnY29tcGxldGVkJyAmJiBpbnMuZmluYWxfZGVjaXNpb24pIHtcblx0XHRcdFx0XHRpbnN0YW5jZV9zdGF0ZSA9IGlucy5maW5hbF9kZWNpc2lvbjtcblx0XHRcdFx0fVxuXHRcdFx0XHRuZXdPYmouaW5zdGFuY2VzID0gW3tcblx0XHRcdFx0XHRfaWQ6IGluc0lkLFxuXHRcdFx0XHRcdHN0YXRlOiBpbnN0YW5jZV9zdGF0ZVxuXHRcdFx0XHR9XTtcblx0XHRcdFx0bmV3T2JqLmluc3RhbmNlX3N0YXRlID0gaW5zdGFuY2Vfc3RhdGU7XG5cblx0XHRcdFx0bmV3T2JqLm93bmVyID0gaW5zLmFwcGxpY2FudDtcblx0XHRcdFx0bmV3T2JqLmNyZWF0ZWRfYnkgPSBpbnMuYXBwbGljYW50O1xuXHRcdFx0XHRuZXdPYmoubW9kaWZpZWRfYnkgPSBpbnMuYXBwbGljYW50O1xuXHRcdFx0XHR2YXIgciA9IG9iamVjdENvbGxlY3Rpb24uaW5zZXJ0KG5ld09iaik7XG5cdFx0XHRcdGlmIChyKSB7XG5cdFx0XHRcdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKCdpbnN0YW5jZXMnKS51cGRhdGUoaW5zLl9pZCwge1xuXHRcdFx0XHRcdFx0JHB1c2g6IHtcblx0XHRcdFx0XHRcdFx0cmVjb3JkX2lkczoge1xuXHRcdFx0XHRcdFx0XHRcdG86IG9iamVjdE5hbWUsXG5cdFx0XHRcdFx0XHRcdFx0aWRzOiBbbmV3UmVjb3JkSWRdXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdHZhciByZWxhdGVkT2JqZWN0cyA9IENyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdHMob3cub2JqZWN0X25hbWUsIHNwYWNlSWQpO1xuXHRcdFx0XHRcdHZhciByZWxhdGVkT2JqZWN0c1ZhbHVlID0gc3luY1ZhbHVlcy5yZWxhdGVkT2JqZWN0c1ZhbHVlO1xuXHRcdFx0XHRcdEluc3RhbmNlUmVjb3JkUXVldWUuc3luY1JlbGF0ZWRPYmplY3RzVmFsdWUobmV3UmVjb3JkSWQsIHJlbGF0ZWRPYmplY3RzLCByZWxhdGVkT2JqZWN0c1ZhbHVlLCBzcGFjZUlkLCBpbnMpO1xuXHRcdFx0XHRcdC8vIHdvcmtmbG936YeM5Y+R6LW35a6h5om55ZCO77yM5ZCM5q2l5pe25Lmf5Y+v5Lul5L+u5pS555u45YWz6KGo55qE5a2X5q615YC8ICMxMTgzXG5cdFx0XHRcdFx0dmFyIHJlY29yZCA9IG9iamVjdENvbGxlY3Rpb24uZmluZE9uZShuZXdSZWNvcmRJZCk7XG5cdFx0XHRcdFx0SW5zdGFuY2VSZWNvcmRRdWV1ZS5zeW5jVmFsdWVzKG93LmZpZWxkX21hcF9iYWNrLCB2YWx1ZXMsIGlucywgb2JqZWN0SW5mbywgb3cuZmllbGRfbWFwX2JhY2tfc2NyaXB0LCByZWNvcmQpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8g6ZmE5Lu25ZCM5q2lXG5cdFx0XHRcdEluc3RhbmNlUmVjb3JkUXVldWUuc3luY0F0dGFjaChzeW5jX2F0dGFjaG1lbnQsIGluc0lkLCBzcGFjZUlkLCBuZXdSZWNvcmRJZCwgb2JqZWN0TmFtZSk7XG5cblx0XHRcdFx0Ly8g5omn6KGM5YWs5byPXG5cdFx0XHRcdHJ1blF1b3RlZChvYmplY3ROYW1lLCBuZXdSZWNvcmRJZCk7XG5cdFx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKGVycm9yLnN0YWNrKTtcblxuXHRcdFx0XHRvYmplY3RDb2xsZWN0aW9uLnJlbW92ZSh7XG5cdFx0XHRcdFx0X2lkOiBuZXdSZWNvcmRJZCxcblx0XHRcdFx0XHRzcGFjZTogc3BhY2VJZFxuXHRcdFx0XHR9KTtcblx0XHRcdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKCdpbnN0YW5jZXMnKS51cGRhdGUoaW5zLl9pZCwge1xuXHRcdFx0XHRcdCRwdWxsOiB7XG5cdFx0XHRcdFx0XHRyZWNvcmRfaWRzOiB7XG5cdFx0XHRcdFx0XHRcdG86IG9iamVjdE5hbWUsXG5cdFx0XHRcdFx0XHRcdGlkczogW25ld1JlY29yZElkXVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSlcblx0XHRcdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKCdjbXNfZmlsZXMnKS5yZW1vdmUoe1xuXHRcdFx0XHRcdCdwYXJlbnQnOiB7XG5cdFx0XHRcdFx0XHRvOiBvYmplY3ROYW1lLFxuXHRcdFx0XHRcdFx0aWRzOiBbbmV3UmVjb3JkSWRdXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KVxuXHRcdFx0XHRjZnMuZmlsZXMucmVtb3ZlKHtcblx0XHRcdFx0XHQnbWV0YWRhdGEucmVjb3JkX2lkJzogbmV3UmVjb3JkSWRcblx0XHRcdFx0fSlcblxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoZXJyb3IpO1xuXHRcdFx0fVxuXG5cdFx0fSlcblx0fVxuXG5cdGlmIChkb2MuX2lkKSB7XG5cdFx0SW5zdGFuY2VSZWNvcmRRdWV1ZS5jb2xsZWN0aW9uLnVwZGF0ZShkb2MuX2lkLCB7XG5cdFx0XHQkc2V0OiB7XG5cdFx0XHRcdCdpbmZvLnN5bmNfZGF0ZSc6IG5ldyBEYXRlKClcblx0XHRcdH1cblx0XHR9KVxuXHR9XG5cbn0iLCJNZXRlb3Iuc3RhcnR1cCAtPlxuXHRpZiBNZXRlb3Iuc2V0dGluZ3MuY3Jvbj8uaW5zdGFuY2VyZWNvcmRxdWV1ZV9pbnRlcnZhbFxuXHRcdEluc3RhbmNlUmVjb3JkUXVldWUuQ29uZmlndXJlXG5cdFx0XHRzZW5kSW50ZXJ2YWw6IE1ldGVvci5zZXR0aW5ncy5jcm9uLmluc3RhbmNlcmVjb3JkcXVldWVfaW50ZXJ2YWxcblx0XHRcdHNlbmRCYXRjaFNpemU6IDEwXG5cdFx0XHRrZWVwRG9jczogdHJ1ZVxuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHZhciByZWY7XG4gIGlmICgocmVmID0gTWV0ZW9yLnNldHRpbmdzLmNyb24pICE9IG51bGwgPyByZWYuaW5zdGFuY2VyZWNvcmRxdWV1ZV9pbnRlcnZhbCA6IHZvaWQgMCkge1xuICAgIHJldHVybiBJbnN0YW5jZVJlY29yZFF1ZXVlLkNvbmZpZ3VyZSh7XG4gICAgICBzZW5kSW50ZXJ2YWw6IE1ldGVvci5zZXR0aW5ncy5jcm9uLmluc3RhbmNlcmVjb3JkcXVldWVfaW50ZXJ2YWwsXG4gICAgICBzZW5kQmF0Y2hTaXplOiAxMCxcbiAgICAgIGtlZXBEb2NzOiB0cnVlXG4gICAgfSk7XG4gIH1cbn0pO1xuIiwiaW1wb3J0IHsgY2hlY2tOcG1WZXJzaW9ucyB9IGZyb20gJ21ldGVvci90bWVhc2RheTpjaGVjay1ucG0tdmVyc2lvbnMnO1xuY2hlY2tOcG1WZXJzaW9ucyh7XG5cdFwiZXZhbFwiOiBcIl4wLjEuMlwiXG59LCAnc3RlZWRvczppbnN0YW5jZS1yZWNvcmQtcXVldWUnKTtcbiJdfQ==
