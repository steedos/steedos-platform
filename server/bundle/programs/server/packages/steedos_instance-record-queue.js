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
var InstanceRecordQueue, __coffeescriptShare;

var require = meteorInstall({"node_modules":{"meteor":{"steedos:instance-record-queue":{"lib":{"common":{"main.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_instance-record-queue/lib/common/main.js                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
InstanceRecordQueue = new EventState();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"docs.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_instance-record-queue/lib/common/docs.js                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
InstanceRecordQueue.collection = new Mongo.Collection('instance_record_queue');

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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"server":{"api.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_instance-record-queue/lib/server/api.js                                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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

    field_map_back.forEach(function (fm) {
      // 判断是否是子表字段
      if (fm.workflow_field.indexOf('.$.') > 0 && fm.object_field.indexOf('.$.') > 0) {
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
          }
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

    if (field_map_back_script) {
      _.extend(obj, self.evalFieldMapBackScript(field_map_back_script, ins));
    } // 过滤掉非法的key


    var filterObj = {};

    _.each(_.keys(obj), function (k) {
      if (objectFieldKeys.includes(k)) {
        filterObj[k] = obj[k];
      }
    });

    return filterObj;
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
      form_version: 1
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
      // 此情况属于从creator中发起审批
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
        // 附件同步
        try {
          var setObj = self.syncValues(ow.field_map_back, values, ins, objectInfo, ow.field_map_back_script, record);
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
          }); // 以最终申请单附件为准，旧的record中附件删除

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
          var newObj = self.syncValues(ow.field_map_back, values, ins, objectInfo, ow.field_map_back_script);
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
            }); // workflow里发起审批后，同步时也可以修改相关表的字段值 #1183

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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"server":{"startup.coffee":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_instance-record-queue/server/startup.coffee                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"checkNpm.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_instance-record-queue/server/checkNpm.js                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczppbnN0YW5jZS1yZWNvcmQtcXVldWUvbGliL2NvbW1vbi9tYWluLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmluc3RhbmNlLXJlY29yZC1xdWV1ZS9saWIvY29tbW9uL2RvY3MuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6aW5zdGFuY2UtcmVjb3JkLXF1ZXVlL2xpYi9zZXJ2ZXIvYXBpLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2luc3RhbmNlLXJlY29yZC1xdWV1ZS9zZXJ2ZXIvc3RhcnR1cC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9zdGFydHVwLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczppbnN0YW5jZS1yZWNvcmQtcXVldWUvc2VydmVyL2NoZWNrTnBtLmpzIl0sIm5hbWVzIjpbIkluc3RhbmNlUmVjb3JkUXVldWUiLCJFdmVudFN0YXRlIiwiY29sbGVjdGlvbiIsIk1vbmdvIiwiQ29sbGVjdGlvbiIsIl92YWxpZGF0ZURvY3VtZW50IiwiZG9jIiwiY2hlY2siLCJpbmZvIiwiT2JqZWN0Iiwic2VudCIsIk1hdGNoIiwiT3B0aW9uYWwiLCJCb29sZWFuIiwic2VuZGluZyIsIkludGVnZXIiLCJjcmVhdGVkQXQiLCJEYXRlIiwiY3JlYXRlZEJ5IiwiT25lT2YiLCJTdHJpbmciLCJzZW5kIiwib3B0aW9ucyIsImN1cnJlbnRVc2VyIiwiTWV0ZW9yIiwiaXNDbGllbnQiLCJ1c2VySWQiLCJpc1NlcnZlciIsIl8iLCJleHRlbmQiLCJ0ZXN0IiwicGljayIsImluc2VydCIsIl9ldmFsIiwicmVxdWlyZSIsImlzQ29uZmlndXJlZCIsInNlbmRXb3JrZXIiLCJ0YXNrIiwiaW50ZXJ2YWwiLCJkZWJ1ZyIsImNvbnNvbGUiLCJsb2ciLCJzZXRJbnRlcnZhbCIsImVycm9yIiwibWVzc2FnZSIsIkNvbmZpZ3VyZSIsInNlbGYiLCJzZW5kVGltZW91dCIsIkVycm9yIiwic3luY0F0dGFjaCIsInN5bmNfYXR0YWNobWVudCIsImluc0lkIiwic3BhY2VJZCIsIm5ld1JlY29yZElkIiwib2JqZWN0TmFtZSIsImNmcyIsImluc3RhbmNlcyIsImZpbmQiLCJmb3JFYWNoIiwiZiIsIm5ld0ZpbGUiLCJGUyIsIkZpbGUiLCJjbXNGaWxlSWQiLCJDcmVhdG9yIiwiZ2V0Q29sbGVjdGlvbiIsIl9tYWtlTmV3SUQiLCJhdHRhY2hEYXRhIiwiY3JlYXRlUmVhZFN0cmVhbSIsInR5cGUiLCJvcmlnaW5hbCIsImVyciIsInJlYXNvbiIsIm5hbWUiLCJzaXplIiwibWV0YWRhdGEiLCJvd25lciIsIm93bmVyX25hbWUiLCJzcGFjZSIsInJlY29yZF9pZCIsIm9iamVjdF9uYW1lIiwicGFyZW50IiwiZmlsZU9iaiIsImZpbGVzIiwiX2lkIiwibyIsImlkcyIsImV4dGVudGlvbiIsImV4dGVuc2lvbiIsInZlcnNpb25zIiwiY3JlYXRlZF9ieSIsIm1vZGlmaWVkX2J5IiwicGFyZW50cyIsImluY2x1ZGVzIiwicHVzaCIsImN1cnJlbnQiLCJ1cGRhdGUiLCIkc2V0IiwiJGFkZFRvU2V0Iiwic3luY0luc0ZpZWxkcyIsInN5bmNWYWx1ZXMiLCJmaWVsZF9tYXBfYmFjayIsInZhbHVlcyIsImlucyIsIm9iamVjdEluZm8iLCJmaWVsZF9tYXBfYmFja19zY3JpcHQiLCJyZWNvcmQiLCJvYmoiLCJ0YWJsZUZpZWxkQ29kZXMiLCJ0YWJsZUZpZWxkTWFwIiwiZm9ybSIsImZpbmRPbmUiLCJmb3JtRmllbGRzIiwiZm9ybV92ZXJzaW9uIiwiZmllbGRzIiwiZm9ybVZlcnNpb24iLCJoaXN0b3J5cyIsImgiLCJvYmplY3RGaWVsZHMiLCJvYmplY3RGaWVsZEtleXMiLCJrZXlzIiwiZm0iLCJ3b3JrZmxvd19maWVsZCIsImluZGV4T2YiLCJvYmplY3RfZmllbGQiLCJ3VGFibGVDb2RlIiwic3BsaXQiLCJvVGFibGVDb2RlIiwiaGFzT3duUHJvcGVydHkiLCJpc0FycmF5IiwiSlNPTiIsInN0cmluZ2lmeSIsIndvcmtmbG93X3RhYmxlX2ZpZWxkX2NvZGUiLCJvYmplY3RfdGFibGVfZmllbGRfY29kZSIsIndGaWVsZCIsImVhY2giLCJmZiIsImNvZGUiLCJvRmllbGQiLCJpc19tdWx0aXNlbGVjdCIsIm11bHRpcGxlIiwicmVmZXJlbmNlX3RvIiwiaXNTdHJpbmciLCJvQ29sbGVjdGlvbiIsInJlZmVyT2JqZWN0IiwiZ2V0T2JqZWN0IiwicmVmZXJEYXRhIiwibmFtZUZpZWxkS2V5IiwiTkFNRV9GSUVMRF9LRVkiLCJzZWxlY3RvciIsInRtcF9maWVsZF92YWx1ZSIsInRlbU9iakZpZWxkcyIsImxlbmd0aCIsIm9iakZpZWxkIiwicmVmZXJPYmpGaWVsZCIsInJlZmVyU2V0T2JqIiwic3RhcnRzV2l0aCIsImluc0ZpZWxkIiwidW5pcSIsInRmYyIsImMiLCJwYXJzZSIsInRyIiwibmV3VHIiLCJ2IiwiayIsInRmbSIsIm9UZENvZGUiLCJpc0VtcHR5IiwiZXZhbEZpZWxkTWFwQmFja1NjcmlwdCIsImZpbHRlck9iaiIsInNjcmlwdCIsImZ1bmMiLCJpc09iamVjdCIsInNlbmREb2MiLCJpbnN0YW5jZV9pZCIsInJlY29yZHMiLCJmbG93IiwiYXBwbGljYW50Iiwib3ciLCJmbG93X2lkIiwib2JqZWN0Q29sbGVjdGlvbiIsIiRpbiIsInNldE9iaiIsImxvY2tlZCIsImluc3RhbmNlX3N0YXRlIiwic3RhdGUiLCJmaW5hbF9kZWNpc2lvbiIsInJlbW92ZSIsInN0YWNrIiwibmV3T2JqIiwiciIsIiRwdXNoIiwicmVjb3JkX2lkcyIsIiRwdWxsIiwiX3F1ZXJ5U2VuZCIsInNlcnZlclNlbmQiLCJpc1NlbmRpbmdEb2MiLCJzZW5kSW50ZXJ2YWwiLCJfZW5zdXJlSW5kZXgiLCJub3ciLCJ0aW1lb3V0QXQiLCJyZXNlcnZlZCIsIiRsdCIsInJlc3VsdCIsImtlZXBEb2NzIiwic2VudEF0IiwiYmF0Y2hTaXplIiwic2VuZEJhdGNoU2l6ZSIsInBlbmRpbmdEb2NzIiwiJGFuZCIsImVyck1zZyIsIiRleGlzdHMiLCJzb3J0IiwibGltaXQiLCJzdGFydHVwIiwicmVmIiwic2V0dGluZ3MiLCJjcm9uIiwiaW5zdGFuY2VyZWNvcmRxdWV1ZV9pbnRlcnZhbCIsImNoZWNrTnBtVmVyc2lvbnMiLCJtb2R1bGUiLCJsaW5rIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUFBLG1CQUFtQixHQUFHLElBQUlDLFVBQUosRUFBdEIsQzs7Ozs7Ozs7Ozs7QUNBQUQsbUJBQW1CLENBQUNFLFVBQXBCLEdBQWlDLElBQUlDLEtBQUssQ0FBQ0MsVUFBVixDQUFxQix1QkFBckIsQ0FBakM7O0FBRUEsSUFBSUMsaUJBQWlCLEdBQUcsVUFBU0MsR0FBVCxFQUFjO0FBRXJDQyxPQUFLLENBQUNELEdBQUQsRUFBTTtBQUNWRSxRQUFJLEVBQUVDLE1BREk7QUFFVkMsUUFBSSxFQUFFQyxLQUFLLENBQUNDLFFBQU4sQ0FBZUMsT0FBZixDQUZJO0FBR1ZDLFdBQU8sRUFBRUgsS0FBSyxDQUFDQyxRQUFOLENBQWVELEtBQUssQ0FBQ0ksT0FBckIsQ0FIQztBQUlWQyxhQUFTLEVBQUVDLElBSkQ7QUFLVkMsYUFBUyxFQUFFUCxLQUFLLENBQUNRLEtBQU4sQ0FBWUMsTUFBWixFQUFvQixJQUFwQjtBQUxELEdBQU4sQ0FBTDtBQVFBLENBVkQ7O0FBWUFwQixtQkFBbUIsQ0FBQ3FCLElBQXBCLEdBQTJCLFVBQVNDLE9BQVQsRUFBa0I7QUFDNUMsTUFBSUMsV0FBVyxHQUFHQyxNQUFNLENBQUNDLFFBQVAsSUFBbUJELE1BQU0sQ0FBQ0UsTUFBMUIsSUFBb0NGLE1BQU0sQ0FBQ0UsTUFBUCxFQUFwQyxJQUF1REYsTUFBTSxDQUFDRyxRQUFQLEtBQW9CTCxPQUFPLENBQUNKLFNBQVIsSUFBcUIsVUFBekMsQ0FBdkQsSUFBK0csSUFBakk7O0FBQ0EsTUFBSVosR0FBRyxHQUFHc0IsQ0FBQyxDQUFDQyxNQUFGLENBQVM7QUFDbEJi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NEJBQW5DO0FBQ0FYLHFCQUFlLEVBRGY7QUFFQUgsZ0JBQVU7QUFGVixLQURELENDQ0U7QUFLRDtBRFJILEc7Ozs7Ozs7Ozs7O0FFQUEsSUFBSWUsZ0JBQUo7QUFBcUJDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLG9DQUFaLEVBQWlEO0FBQUNGLGtCQUFnQixDQUFDeEQsQ0FBRCxFQUFHO0FBQUN3RCxvQkFBZ0IsR0FBQ3hELENBQWpCO0FBQW1COztBQUF4QyxDQUFqRCxFQUEyRixDQUEzRjtBQUNyQndELGdCQUFnQixDQUFDO0FBQ2hCLFVBQVE7QUFEUSxDQUFELEVBRWIsK0JBRmEsQ0FBaEIsQyIsImZpbGUiOiIvcGFja2FnZXMvc3RlZWRvc19pbnN0YW5jZS1yZWNvcmQtcXVldWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJJbnN0YW5jZVJlY29yZFF1ZXVlID0gbmV3IEV2ZW50U3RhdGUoKTsiLCJJbnN0YW5jZVJlY29yZFF1ZXVlLmNvbGxlY3Rpb24gPSBuZXcgTW9uZ28uQ29sbGVjdGlvbignaW5zdGFuY2VfcmVjb3JkX3F1ZXVlJyk7XHJcblxyXG52YXIgX3ZhbGlkYXRlRG9jdW1lbnQgPSBmdW5jdGlvbihkb2MpIHtcclxuXHJcblx0Y2hlY2soZG9jLCB7XHJcblx0XHRpbmZvOiBPYmplY3QsXHJcblx0XHRzZW50OiBNYXRjaC5PcHRpb25hbChCb29sZWFuKSxcclxuXHRcdHNlbmRpbmc6IE1hdGNoLk9wdGlvbmFsKE1hdGNoLkludGVnZXIpLFxyXG5cdFx0Y3JlYXRlZEF0OiBEYXRlLFxyXG5cdFx0Y3JlYXRlZEJ5OiBNYXRjaC5PbmVPZihTdHJpbmcsIG51bGwpXHJcblx0fSk7XHJcblxyXG59O1xyXG5cclxuSW5zdGFuY2VSZWNvcmRRdWV1ZS5zZW5kID0gZnVuY3Rpb24ob3B0aW9ucykge1xyXG5cdHZhciBjdXJyZW50VXNlciA9IE1ldGVvci5pc0NsaWVudCAmJiBNZXRlb3IudXNlcklkICYmIE1ldGVvci51c2VySWQoKSB8fCBNZXRlb3IuaXNTZXJ2ZXIgJiYgKG9wdGlvbnMuY3JlYXRlZEJ5IHx8ICc8U0VSVkVSPicpIHx8IG51bGxcclxuXHR2YXIgZG9jID0gXy5leHRlbmQoe1xyXG5cdFx0Y3JlYXRlZEF0OiBuZXcgRGF0ZSgpLFxyXG5cdFx0Y3JlYXRlZEJ5OiBjdXJyZW50VXNlclxyXG5cdH0pO1xyXG5cclxuXHRpZiAoTWF0Y2gudGVzdChvcHRpb25zLCBPYmplY3QpKSB7XHJcblx0XHRkb2MuaW5mbyA9IF8ucGljayhvcHRpb25zLCAnaW5zdGFuY2VfaWQnLCAncmVjb3JkcycsICdzeW5jX2RhdGUnLCAnaW5zdGFuY2VfZmluaXNoX2RhdGUnLCAnc3RlcF9uYW1lJyk7XHJcblx0fVxyXG5cclxuXHRkb2Muc2VudCA9IGZhbHNlO1xyXG5cdGRvYy5zZW5kaW5nID0gMDtcclxuXHJcblx0X3ZhbGlkYXRlRG9jdW1lbnQoZG9jKTtcclxuXHJcblx0cmV0dXJuIEluc3RhbmNlUmVjb3JkUXVldWUuY29sbGVjdGlvbi5pbnNlcnQoZG9jKTtcclxufTsiLCJ2YXIgX2V2YWwgPSByZXF1aXJlKCdldmFsJyk7XHJcbnZhciBpc0NvbmZpZ3VyZWQgPSBmYWxzZTtcclxudmFyIHNlbmRXb3JrZXIgPSBmdW5jdGlvbiAodGFzaywgaW50ZXJ2YWwpIHtcclxuXHJcblx0aWYgKEluc3RhbmNlUmVjb3JkUXVldWUuZGVidWcpIHtcclxuXHRcdGNvbnNvbGUubG9nKCdJbnN0YW5jZVJlY29yZFF1ZXVlOiBTZW5kIHdvcmtlciBzdGFydGVkLCB1c2luZyBpbnRlcnZhbDogJyArIGludGVydmFsKTtcclxuXHR9XHJcblxyXG5cdHJldHVybiBNZXRlb3Iuc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0dGFzaygpO1xyXG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coJ0luc3RhbmNlUmVjb3JkUXVldWU6IEVycm9yIHdoaWxlIHNlbmRpbmc6ICcgKyBlcnJvci5tZXNzYWdlKTtcclxuXHRcdH1cclxuXHR9LCBpbnRlcnZhbCk7XHJcbn07XHJcblxyXG4vKlxyXG5cdG9wdGlvbnM6IHtcclxuXHRcdC8vIENvbnRyb2xzIHRoZSBzZW5kaW5nIGludGVydmFsXHJcblx0XHRzZW5kSW50ZXJ2YWw6IE1hdGNoLk9wdGlvbmFsKE51bWJlciksXHJcblx0XHQvLyBDb250cm9scyB0aGUgc2VuZGluZyBiYXRjaCBzaXplIHBlciBpbnRlcnZhbFxyXG5cdFx0c2VuZEJhdGNoU2l6ZTogTWF0Y2guT3B0aW9uYWwoTnVtYmVyKSxcclxuXHRcdC8vIEFsbG93IG9wdGlvbmFsIGtlZXBpbmcgbm90aWZpY2F0aW9ucyBpbiBjb2xsZWN0aW9uXHJcblx0XHRrZWVwRG9jczogTWF0Y2guT3B0aW9uYWwoQm9vbGVhbilcclxuXHR9XHJcbiovXHJcbkluc3RhbmNlUmVjb3JkUXVldWUuQ29uZmlndXJlID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuXHR2YXIgc2VsZiA9IHRoaXM7XHJcblx0b3B0aW9ucyA9IF8uZXh0ZW5kKHtcclxuXHRcdHNlbmRUaW1lb3V0OiA2MDAwMCwgLy8gVGltZW91dCBwZXJpb2RcclxuXHR9LCBvcHRpb25zKTtcclxuXHJcblx0Ly8gQmxvY2sgbXVsdGlwbGUgY2FsbHNcclxuXHRpZiAoaXNDb25maWd1cmVkKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ0luc3RhbmNlUmVjb3JkUXVldWUuQ29uZmlndXJlIHNob3VsZCBub3QgYmUgY2FsbGVkIG1vcmUgdGhhbiBvbmNlIScpO1xyXG5cdH1cclxuXHJcblx0aXNDb25maWd1cmVkID0gdHJ1ZTtcclxuXHJcblx0Ly8gQWRkIGRlYnVnIGluZm9cclxuXHRpZiAoSW5zdGFuY2VSZWNvcmRRdWV1ZS5kZWJ1Zykge1xyXG5cdFx0Y29uc29sZS5sb2coJ0luc3RhbmNlUmVjb3JkUXVldWUuQ29uZmlndXJlJywgb3B0aW9ucyk7XHJcblx0fVxyXG5cclxuXHRzZWxmLnN5bmNBdHRhY2ggPSBmdW5jdGlvbiAoc3luY19hdHRhY2htZW50LCBpbnNJZCwgc3BhY2VJZCwgbmV3UmVjb3JkSWQsIG9iamVjdE5hbWUpIHtcclxuXHRcdGlmIChzeW5jX2F0dGFjaG1lbnQgPT0gXCJsYXN0ZXN0XCIpIHtcclxuXHRcdFx0Y2ZzLmluc3RhbmNlcy5maW5kKHtcclxuXHRcdFx0XHQnbWV0YWRhdGEuaW5zdGFuY2UnOiBpbnNJZCxcclxuXHRcdFx0XHQnbWV0YWRhdGEuY3VycmVudCc6IHRydWVcclxuXHRcdFx0fSkuZm9yRWFjaChmdW5jdGlvbiAoZikge1xyXG5cdFx0XHRcdHZhciBuZXdGaWxlID0gbmV3IEZTLkZpbGUoKSxcclxuXHRcdFx0XHRcdGNtc0ZpbGVJZCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignY21zX2ZpbGVzJykuX21ha2VOZXdJRCgpO1xyXG5cclxuXHRcdFx0XHRuZXdGaWxlLmF0dGFjaERhdGEoZi5jcmVhdGVSZWFkU3RyZWFtKCdpbnN0YW5jZXMnKSwge1xyXG5cdFx0XHRcdFx0dHlwZTogZi5vcmlnaW5hbC50eXBlXHJcblx0XHRcdFx0fSwgZnVuY3Rpb24gKGVycikge1xyXG5cdFx0XHRcdFx0aWYgKGVycikge1xyXG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKGVyci5lcnJvciwgZXJyLnJlYXNvbik7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRuZXdGaWxlLm5hbWUoZi5uYW1lKCkpO1xyXG5cdFx0XHRcdFx0bmV3RmlsZS5zaXplKGYuc2l6ZSgpKTtcclxuXHRcdFx0XHRcdHZhciBtZXRhZGF0YSA9IHtcclxuXHRcdFx0XHRcdFx0b3duZXI6IGYubWV0YWRhdGEub3duZXIsXHJcblx0XHRcdFx0XHRcdG93bmVyX25hbWU6IGYubWV0YWRhdGEub3duZXJfbmFtZSxcclxuXHRcdFx0XHRcdFx0c3BhY2U6IHNwYWNlSWQsXHJcblx0XHRcdFx0XHRcdHJlY29yZF9pZDogbmV3UmVjb3JkSWQsXHJcblx0XHRcdFx0XHRcdG9iamVjdF9uYW1lOiBvYmplY3ROYW1lLFxyXG5cdFx0XHRcdFx0XHRwYXJlbnQ6IGNtc0ZpbGVJZFxyXG5cdFx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0XHRuZXdGaWxlLm1ldGFkYXRhID0gbWV0YWRhdGE7XHJcblx0XHRcdFx0XHR2YXIgZmlsZU9iaiA9IGNmcy5maWxlcy5pbnNlcnQobmV3RmlsZSk7XHJcblx0XHRcdFx0XHRpZiAoZmlsZU9iaikge1xyXG5cdFx0XHRcdFx0XHRDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2Ntc19maWxlcycpLmluc2VydCh7XHJcblx0XHRcdFx0XHRcdFx0X2lkOiBjbXNGaWxlSWQsXHJcblx0XHRcdFx0XHRcdFx0cGFyZW50OiB7XHJcblx0XHRcdFx0XHRcdFx0XHRvOiBvYmplY3ROYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0aWRzOiBbbmV3UmVjb3JkSWRdXHJcblx0XHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0XHRzaXplOiBmaWxlT2JqLnNpemUoKSxcclxuXHRcdFx0XHRcdFx0XHRuYW1lOiBmaWxlT2JqLm5hbWUoKSxcclxuXHRcdFx0XHRcdFx0XHRleHRlbnRpb246IGZpbGVPYmouZXh0ZW5zaW9uKCksXHJcblx0XHRcdFx0XHRcdFx0c3BhY2U6IHNwYWNlSWQsXHJcblx0XHRcdFx0XHRcdFx0dmVyc2lvbnM6IFtmaWxlT2JqLl9pZF0sXHJcblx0XHRcdFx0XHRcdFx0b3duZXI6IGYubWV0YWRhdGEub3duZXIsXHJcblx0XHRcdFx0XHRcdFx0Y3JlYXRlZF9ieTogZi5tZXRhZGF0YS5vd25lcixcclxuXHRcdFx0XHRcdFx0XHRtb2RpZmllZF9ieTogZi5tZXRhZGF0YS5vd25lclxyXG5cdFx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pXHJcblx0XHRcdH0pXHJcblx0XHR9IGVsc2UgaWYgKHN5bmNfYXR0YWNobWVudCA9PSBcImFsbFwiKSB7XHJcblx0XHRcdHZhciBwYXJlbnRzID0gW107XHJcblx0XHRcdGNmcy5pbnN0YW5jZXMuZmluZCh7XHJcblx0XHRcdFx0J21ldGFkYXRhLmluc3RhbmNlJzogaW5zSWRcclxuXHRcdFx0fSkuZm9yRWFjaChmdW5jdGlvbiAoZikge1xyXG5cdFx0XHRcdHZhciBuZXdGaWxlID0gbmV3IEZTLkZpbGUoKSxcclxuXHRcdFx0XHRcdGNtc0ZpbGVJZCA9IGYubWV0YWRhdGEucGFyZW50O1xyXG5cclxuXHRcdFx0XHRpZiAoIXBhcmVudHMuaW5jbHVkZXMoY21zRmlsZUlkKSkge1xyXG5cdFx0XHRcdFx0cGFyZW50cy5wdXNoKGNtc0ZpbGVJZCk7XHJcblx0XHRcdFx0XHRDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2Ntc19maWxlcycpLmluc2VydCh7XHJcblx0XHRcdFx0XHRcdF9pZDogY21zRmlsZUlkLFxyXG5cdFx0XHRcdFx0XHRwYXJlbnQ6IHtcclxuXHRcdFx0XHRcdFx0XHRvOiBvYmplY3ROYW1lLFxyXG5cdFx0XHRcdFx0XHRcdGlkczogW25ld1JlY29yZElkXVxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHRzcGFjZTogc3BhY2VJZCxcclxuXHRcdFx0XHRcdFx0dmVyc2lvbnM6IFtdLFxyXG5cdFx0XHRcdFx0XHRvd25lcjogZi5tZXRhZGF0YS5vd25lcixcclxuXHRcdFx0XHRcdFx0Y3JlYXRlZF9ieTogZi5tZXRhZGF0YS5vd25lcixcclxuXHRcdFx0XHRcdFx0bW9kaWZpZWRfYnk6IGYubWV0YWRhdGEub3duZXJcclxuXHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRuZXdGaWxlLmF0dGFjaERhdGEoZi5jcmVhdGVSZWFkU3RyZWFtKCdpbnN0YW5jZXMnKSwge1xyXG5cdFx0XHRcdFx0dHlwZTogZi5vcmlnaW5hbC50eXBlXHJcblx0XHRcdFx0fSwgZnVuY3Rpb24gKGVycikge1xyXG5cdFx0XHRcdFx0aWYgKGVycikge1xyXG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKGVyci5lcnJvciwgZXJyLnJlYXNvbik7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRuZXdGaWxlLm5hbWUoZi5uYW1lKCkpO1xyXG5cdFx0XHRcdFx0bmV3RmlsZS5zaXplKGYuc2l6ZSgpKTtcclxuXHRcdFx0XHRcdHZhciBtZXRhZGF0YSA9IHtcclxuXHRcdFx0XHRcdFx0b3duZXI6IGYubWV0YWRhdGEub3duZXIsXHJcblx0XHRcdFx0XHRcdG93bmVyX25hbWU6IGYubWV0YWRhdGEub3duZXJfbmFtZSxcclxuXHRcdFx0XHRcdFx0c3BhY2U6IHNwYWNlSWQsXHJcblx0XHRcdFx0XHRcdHJlY29yZF9pZDogbmV3UmVjb3JkSWQsXHJcblx0XHRcdFx0XHRcdG9iamVjdF9uYW1lOiBvYmplY3ROYW1lLFxyXG5cdFx0XHRcdFx0XHRwYXJlbnQ6IGNtc0ZpbGVJZFxyXG5cdFx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0XHRuZXdGaWxlLm1ldGFkYXRhID0gbWV0YWRhdGE7XHJcblx0XHRcdFx0XHR2YXIgZmlsZU9iaiA9IGNmcy5maWxlcy5pbnNlcnQobmV3RmlsZSk7XHJcblx0XHRcdFx0XHRpZiAoZmlsZU9iaikge1xyXG5cclxuXHRcdFx0XHRcdFx0aWYgKGYubWV0YWRhdGEuY3VycmVudCA9PSB0cnVlKSB7XHJcblx0XHRcdFx0XHRcdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKCdjbXNfZmlsZXMnKS51cGRhdGUoY21zRmlsZUlkLCB7XHJcblx0XHRcdFx0XHRcdFx0XHQkc2V0OiB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHNpemU6IGZpbGVPYmouc2l6ZSgpLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRuYW1lOiBmaWxlT2JqLm5hbWUoKSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZXh0ZW50aW9uOiBmaWxlT2JqLmV4dGVuc2lvbigpLFxyXG5cdFx0XHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0XHRcdCRhZGRUb1NldDoge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR2ZXJzaW9uczogZmlsZU9iai5faWRcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbignY21zX2ZpbGVzJykudXBkYXRlKGNtc0ZpbGVJZCwge1xyXG5cdFx0XHRcdFx0XHRcdFx0JGFkZFRvU2V0OiB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHZlcnNpb25zOiBmaWxlT2JqLl9pZFxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KVxyXG5cdFx0XHR9KVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0c2VsZi5zeW5jSW5zRmllbGRzID0gWyduYW1lJywgJ3N1Ym1pdHRlcl9uYW1lJywgJ2FwcGxpY2FudF9uYW1lJywgJ2FwcGxpY2FudF9vcmdhbml6YXRpb25fbmFtZScsICdhcHBsaWNhbnRfb3JnYW5pemF0aW9uX2Z1bGxuYW1lJywgJ3N0YXRlJyxcclxuXHRcdCdjdXJyZW50X3N0ZXBfbmFtZScsICdmbG93X25hbWUnLCAnY2F0ZWdvcnlfbmFtZScsICdzdWJtaXRfZGF0ZScsICdmaW5pc2hfZGF0ZScsICdmaW5hbF9kZWNpc2lvbicsICdhcHBsaWNhbnRfb3JnYW5pemF0aW9uJywgJ2FwcGxpY2FudF9jb21wYW55J1xyXG5cdF07XHJcblx0c2VsZi5zeW5jVmFsdWVzID0gZnVuY3Rpb24gKGZpZWxkX21hcF9iYWNrLCB2YWx1ZXMsIGlucywgb2JqZWN0SW5mbywgZmllbGRfbWFwX2JhY2tfc2NyaXB0LCByZWNvcmQpIHtcclxuXHRcdHZhclxyXG5cdFx0XHRvYmogPSB7fSxcclxuXHRcdFx0dGFibGVGaWVsZENvZGVzID0gW10sXHJcblx0XHRcdHRhYmxlRmllbGRNYXAgPSBbXTtcclxuXHJcblx0XHRmaWVsZF9tYXBfYmFjayA9IGZpZWxkX21hcF9iYWNrIHx8IFtdO1xyXG5cclxuXHRcdHZhciBzcGFjZUlkID0gaW5zLnNwYWNlO1xyXG5cclxuXHRcdHZhciBmb3JtID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwiZm9ybXNcIikuZmluZE9uZShpbnMuZm9ybSk7XHJcblx0XHR2YXIgZm9ybUZpZWxkcyA9IG51bGw7XHJcblx0XHRpZiAoZm9ybS5jdXJyZW50Ll9pZCA9PT0gaW5zLmZvcm1fdmVyc2lvbikge1xyXG5cdFx0XHRmb3JtRmllbGRzID0gZm9ybS5jdXJyZW50LmZpZWxkcyB8fCBbXTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHZhciBmb3JtVmVyc2lvbiA9IF8uZmluZChmb3JtLmhpc3RvcnlzLCBmdW5jdGlvbiAoaCkge1xyXG5cdFx0XHRcdHJldHVybiBoLl9pZCA9PT0gaW5zLmZvcm1fdmVyc2lvbjtcclxuXHRcdFx0fSlcclxuXHRcdFx0Zm9ybUZpZWxkcyA9IGZvcm1WZXJzaW9uID8gZm9ybVZlcnNpb24uZmllbGRzIDogW107XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIG9iamVjdEZpZWxkcyA9IG9iamVjdEluZm8uZmllbGRzO1xyXG5cdFx0dmFyIG9iamVjdEZpZWxkS2V5cyA9IF8ua2V5cyhvYmplY3RGaWVsZHMpO1xyXG5cclxuXHRcdGZpZWxkX21hcF9iYWNrLmZvckVhY2goZnVuY3Rpb24gKGZtKSB7XHJcblx0XHRcdC8vIOWIpOaWreaYr+WQpuaYr+WtkOihqOWtl+autVxyXG5cdFx0XHRpZiAoZm0ud29ya2Zsb3dfZmllbGQuaW5kZXhPZignLiQuJykgPiAwICYmIGZtLm9iamVjdF9maWVsZC5pbmRleE9mKCcuJC4nKSA+IDApIHtcclxuXHRcdFx0XHR2YXIgd1RhYmxlQ29kZSA9IGZtLndvcmtmbG93X2ZpZWxkLnNwbGl0KCcuJC4nKVswXTtcclxuXHRcdFx0XHR2YXIgb1RhYmxlQ29kZSA9IGZtLm9iamVjdF9maWVsZC5zcGxpdCgnLiQuJylbMF07XHJcblx0XHRcdFx0aWYgKHZhbHVlcy5oYXNPd25Qcm9wZXJ0eSh3VGFibGVDb2RlKSAmJiBfLmlzQXJyYXkodmFsdWVzW3dUYWJsZUNvZGVdKSkge1xyXG5cdFx0XHRcdFx0dGFibGVGaWVsZENvZGVzLnB1c2goSlNPTi5zdHJpbmdpZnkoe1xyXG5cdFx0XHRcdFx0XHR3b3JrZmxvd190YWJsZV9maWVsZF9jb2RlOiB3VGFibGVDb2RlLFxyXG5cdFx0XHRcdFx0XHRvYmplY3RfdGFibGVfZmllbGRfY29kZTogb1RhYmxlQ29kZVxyXG5cdFx0XHRcdFx0fSkpO1xyXG5cdFx0XHRcdFx0dGFibGVGaWVsZE1hcC5wdXNoKGZtKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHR9IGVsc2UgaWYgKHZhbHVlcy5oYXNPd25Qcm9wZXJ0eShmbS53b3JrZmxvd19maWVsZCkpIHtcclxuXHRcdFx0XHR2YXIgd0ZpZWxkID0gbnVsbDtcclxuXHJcblx0XHRcdFx0Xy5lYWNoKGZvcm1GaWVsZHMsIGZ1bmN0aW9uIChmZikge1xyXG5cdFx0XHRcdFx0aWYgKCF3RmllbGQpIHtcclxuXHRcdFx0XHRcdFx0aWYgKGZmLmNvZGUgPT09IGZtLndvcmtmbG93X2ZpZWxkKSB7XHJcblx0XHRcdFx0XHRcdFx0d0ZpZWxkID0gZmY7XHJcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoZmYudHlwZSA9PT0gJ3NlY3Rpb24nKSB7XHJcblx0XHRcdFx0XHRcdFx0Xy5lYWNoKGZmLmZpZWxkcywgZnVuY3Rpb24gKGYpIHtcclxuXHRcdFx0XHRcdFx0XHRcdGlmICghd0ZpZWxkKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChmLmNvZGUgPT09IGZtLndvcmtmbG93X2ZpZWxkKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0d0ZpZWxkID0gZjtcclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KVxyXG5cclxuXHRcdFx0XHR2YXIgb0ZpZWxkID0gb2JqZWN0RmllbGRzW2ZtLm9iamVjdF9maWVsZF07XHJcblxyXG5cdFx0XHRcdGlmIChvRmllbGQpIHtcclxuXHRcdFx0XHRcdGlmICghd0ZpZWxkKSB7XHJcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKCdmbS53b3JrZmxvd19maWVsZDogJywgZm0ud29ya2Zsb3dfZmllbGQpXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHQvLyDooajljZXpgInkurrpgInnu4TlrZfmrrUg6IezIOWvueixoSBsb29rdXAgbWFzdGVyX2RldGFpbOexu+Wei+Wtl+auteWQjOatpVxyXG5cdFx0XHRcdFx0aWYgKCF3RmllbGQuaXNfbXVsdGlzZWxlY3QgJiYgWyd1c2VyJywgJ2dyb3VwJ10uaW5jbHVkZXMod0ZpZWxkLnR5cGUpICYmICFvRmllbGQubXVsdGlwbGUgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKG9GaWVsZC50eXBlKSAmJiBbJ3VzZXJzJywgJ29yZ2FuaXphdGlvbnMnXS5pbmNsdWRlcyhvRmllbGQucmVmZXJlbmNlX3RvKSkge1xyXG5cdFx0XHRcdFx0XHRvYmpbZm0ub2JqZWN0X2ZpZWxkXSA9IHZhbHVlc1tmbS53b3JrZmxvd19maWVsZF1bJ2lkJ107XHJcblx0XHRcdFx0XHR9IGVsc2UgaWYgKCFvRmllbGQubXVsdGlwbGUgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKG9GaWVsZC50eXBlKSAmJiBfLmlzU3RyaW5nKG9GaWVsZC5yZWZlcmVuY2VfdG8pICYmIF8uaXNTdHJpbmcodmFsdWVzW2ZtLndvcmtmbG93X2ZpZWxkXSkpIHtcclxuXHRcdFx0XHRcdFx0dmFyIG9Db2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9GaWVsZC5yZWZlcmVuY2VfdG8sIHNwYWNlSWQpXHJcblx0XHRcdFx0XHRcdHZhciByZWZlck9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9GaWVsZC5yZWZlcmVuY2VfdG8sIHNwYWNlSWQpXHJcblx0XHRcdFx0XHRcdGlmIChvQ29sbGVjdGlvbiAmJiByZWZlck9iamVjdCkge1xyXG5cdFx0XHRcdFx0XHRcdC8vIOWFiOiupOS4uuatpOWAvOaYr3JlZmVyT2JqZWN0IF9pZOWtl+auteWAvFxyXG5cdFx0XHRcdFx0XHRcdHZhciByZWZlckRhdGEgPSBvQ29sbGVjdGlvbi5maW5kT25lKHZhbHVlc1tmbS53b3JrZmxvd19maWVsZF0sIHtcclxuXHRcdFx0XHRcdFx0XHRcdGZpZWxkczoge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRfaWQ6IDFcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRpZiAocmVmZXJEYXRhKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRvYmpbZm0ub2JqZWN0X2ZpZWxkXSA9IHJlZmVyRGF0YS5faWQ7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHQvLyDlhbbmrKHorqTkuLrmraTlgLzmmK9yZWZlck9iamVjdCBOQU1FX0ZJRUxEX0tFWeWAvFxyXG5cdFx0XHRcdFx0XHRcdGlmICghcmVmZXJEYXRhKSB7XHJcblx0XHRcdFx0XHRcdFx0XHR2YXIgbmFtZUZpZWxkS2V5ID0gcmVmZXJPYmplY3QuTkFNRV9GSUVMRF9LRVk7XHJcblx0XHRcdFx0XHRcdFx0XHR2YXIgc2VsZWN0b3IgPSB7fTtcclxuXHRcdFx0XHRcdFx0XHRcdHNlbGVjdG9yW25hbWVGaWVsZEtleV0gPSB2YWx1ZXNbZm0ud29ya2Zsb3dfZmllbGRdO1xyXG5cdFx0XHRcdFx0XHRcdFx0cmVmZXJEYXRhID0gb0NvbGxlY3Rpb24uZmluZE9uZShzZWxlY3Rvciwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRmaWVsZHM6IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRfaWQ6IDFcclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAocmVmZXJEYXRhKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdG9ialtmbS5vYmplY3RfZmllbGRdID0gcmVmZXJEYXRhLl9pZDtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRpZiAob0ZpZWxkLnR5cGUgPT09IFwiYm9vbGVhblwiKSB7XHJcblx0XHRcdFx0XHRcdFx0dmFyIHRtcF9maWVsZF92YWx1ZSA9IHZhbHVlc1tmbS53b3JrZmxvd19maWVsZF07XHJcblx0XHRcdFx0XHRcdFx0aWYgKFsndHJ1ZScsICfmmK8nXS5pbmNsdWRlcyh0bXBfZmllbGRfdmFsdWUpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRvYmpbZm0ub2JqZWN0X2ZpZWxkXSA9IHRydWU7XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmIChbJ2ZhbHNlJywgJ+WQpiddLmluY2x1ZGVzKHRtcF9maWVsZF92YWx1ZSkpIHtcclxuXHRcdFx0XHRcdFx0XHRcdG9ialtmbS5vYmplY3RfZmllbGRdID0gZmFsc2U7XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdG9ialtmbS5vYmplY3RfZmllbGRdID0gdG1wX2ZpZWxkX3ZhbHVlO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRvYmpbZm0ub2JqZWN0X2ZpZWxkXSA9IHZhbHVlc1tmbS53b3JrZmxvd19maWVsZF07XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0aWYgKGZtLm9iamVjdF9maWVsZC5pbmRleE9mKCcuJykgPiAtMSkge1xyXG5cdFx0XHRcdFx0XHR2YXIgdGVtT2JqRmllbGRzID0gZm0ub2JqZWN0X2ZpZWxkLnNwbGl0KCcuJyk7XHJcblx0XHRcdFx0XHRcdGlmICh0ZW1PYmpGaWVsZHMubGVuZ3RoID09PSAyKSB7XHJcblx0XHRcdFx0XHRcdFx0dmFyIG9iakZpZWxkID0gdGVtT2JqRmllbGRzWzBdO1xyXG5cdFx0XHRcdFx0XHRcdHZhciByZWZlck9iakZpZWxkID0gdGVtT2JqRmllbGRzWzFdO1xyXG5cdFx0XHRcdFx0XHRcdHZhciBvRmllbGQgPSBvYmplY3RGaWVsZHNbb2JqRmllbGRdO1xyXG5cdFx0XHRcdFx0XHRcdGlmICghb0ZpZWxkLm11bHRpcGxlICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhvRmllbGQudHlwZSkgJiYgXy5pc1N0cmluZyhvRmllbGQucmVmZXJlbmNlX3RvKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0dmFyIG9Db2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9GaWVsZC5yZWZlcmVuY2VfdG8sIHNwYWNlSWQpXHJcblx0XHRcdFx0XHRcdFx0XHRpZiAob0NvbGxlY3Rpb24gJiYgcmVjb3JkICYmIHJlY29yZFtvYmpGaWVsZF0pIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0dmFyIHJlZmVyU2V0T2JqID0ge307XHJcblx0XHRcdFx0XHRcdFx0XHRcdHJlZmVyU2V0T2JqW3JlZmVyT2JqRmllbGRdID0gdmFsdWVzW2ZtLndvcmtmbG93X2ZpZWxkXTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0b0NvbGxlY3Rpb24udXBkYXRlKHJlY29yZFtvYmpGaWVsZF0sIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQkc2V0OiByZWZlclNldE9ialxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0aWYgKGZtLndvcmtmbG93X2ZpZWxkLnN0YXJ0c1dpdGgoJ2luc3RhbmNlLicpKSB7XHJcblx0XHRcdFx0XHR2YXIgaW5zRmllbGQgPSBmbS53b3JrZmxvd19maWVsZC5zcGxpdCgnaW5zdGFuY2UuJylbMV07XHJcblx0XHRcdFx0XHRpZiAoc2VsZi5zeW5jSW5zRmllbGRzLmluY2x1ZGVzKGluc0ZpZWxkKSkge1xyXG5cdFx0XHRcdFx0XHRpZiAoZm0ub2JqZWN0X2ZpZWxkLmluZGV4T2YoJy4nKSA8IDApIHtcclxuXHRcdFx0XHRcdFx0XHRvYmpbZm0ub2JqZWN0X2ZpZWxkXSA9IGluc1tpbnNGaWVsZF07XHJcblx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0dmFyIHRlbU9iakZpZWxkcyA9IGZtLm9iamVjdF9maWVsZC5zcGxpdCgnLicpO1xyXG5cdFx0XHRcdFx0XHRcdGlmICh0ZW1PYmpGaWVsZHMubGVuZ3RoID09PSAyKSB7XHJcblx0XHRcdFx0XHRcdFx0XHR2YXIgb2JqRmllbGQgPSB0ZW1PYmpGaWVsZHNbMF07XHJcblx0XHRcdFx0XHRcdFx0XHR2YXIgcmVmZXJPYmpGaWVsZCA9IHRlbU9iakZpZWxkc1sxXTtcclxuXHRcdFx0XHRcdFx0XHRcdHZhciBvRmllbGQgPSBvYmplY3RGaWVsZHNbb2JqRmllbGRdO1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKCFvRmllbGQubXVsdGlwbGUgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKG9GaWVsZC50eXBlKSAmJiBfLmlzU3RyaW5nKG9GaWVsZC5yZWZlcmVuY2VfdG8pKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHZhciBvQ29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvRmllbGQucmVmZXJlbmNlX3RvLCBzcGFjZUlkKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAob0NvbGxlY3Rpb24gJiYgcmVjb3JkICYmIHJlY29yZFtvYmpGaWVsZF0pIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR2YXIgcmVmZXJTZXRPYmogPSB7fTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZWZlclNldE9ialtyZWZlck9iakZpZWxkXSA9IGluc1tpbnNGaWVsZF07XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0b0NvbGxlY3Rpb24udXBkYXRlKHJlY29yZFtvYmpGaWVsZF0sIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdCRzZXQ6IHJlZmVyU2V0T2JqXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0aWYgKGluc1tmbS53b3JrZmxvd19maWVsZF0pIHtcclxuXHRcdFx0XHRcdFx0b2JqW2ZtLm9iamVjdF9maWVsZF0gPSBpbnNbZm0ud29ya2Zsb3dfZmllbGRdO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHJcblx0XHRfLnVuaXEodGFibGVGaWVsZENvZGVzKS5mb3JFYWNoKGZ1bmN0aW9uICh0ZmMpIHtcclxuXHRcdFx0dmFyIGMgPSBKU09OLnBhcnNlKHRmYyk7XHJcblx0XHRcdG9ialtjLm9iamVjdF90YWJsZV9maWVsZF9jb2RlXSA9IFtdO1xyXG5cdFx0XHR2YWx1ZXNbYy53b3JrZmxvd190YWJsZV9maWVsZF9jb2RlXS5mb3JFYWNoKGZ1bmN0aW9uICh0cikge1xyXG5cdFx0XHRcdHZhciBuZXdUciA9IHt9O1xyXG5cdFx0XHRcdF8uZWFjaCh0ciwgZnVuY3Rpb24gKHYsIGspIHtcclxuXHRcdFx0XHRcdHRhYmxlRmllbGRNYXAuZm9yRWFjaChmdW5jdGlvbiAodGZtKSB7XHJcblx0XHRcdFx0XHRcdGlmICh0Zm0ud29ya2Zsb3dfZmllbGQgPT0gKGMud29ya2Zsb3dfdGFibGVfZmllbGRfY29kZSArICcuJC4nICsgaykpIHtcclxuXHRcdFx0XHRcdFx0XHR2YXIgb1RkQ29kZSA9IHRmbS5vYmplY3RfZmllbGQuc3BsaXQoJy4kLicpWzFdO1xyXG5cdFx0XHRcdFx0XHRcdG5ld1RyW29UZENvZGVdID0gdjtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHRcdGlmICghXy5pc0VtcHR5KG5ld1RyKSkge1xyXG5cdFx0XHRcdFx0b2JqW2Mub2JqZWN0X3RhYmxlX2ZpZWxkX2NvZGVdLnB1c2gobmV3VHIpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHRcdH0pXHJcblxyXG5cclxuXHJcblx0XHRpZiAoZmllbGRfbWFwX2JhY2tfc2NyaXB0KSB7XHJcblx0XHRcdF8uZXh0ZW5kKG9iaiwgc2VsZi5ldmFsRmllbGRNYXBCYWNrU2NyaXB0KGZpZWxkX21hcF9iYWNrX3NjcmlwdCwgaW5zKSk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8g6L+H5ruk5o6J6Z2e5rOV55qEa2V5XHJcblx0XHR2YXIgZmlsdGVyT2JqID0ge307XHJcblx0XHRfLmVhY2goXy5rZXlzKG9iaiksIGZ1bmN0aW9uIChrKSB7XHJcblx0XHRcdGlmIChvYmplY3RGaWVsZEtleXMuaW5jbHVkZXMoaykpIHtcclxuXHRcdFx0XHRmaWx0ZXJPYmpba10gPSBvYmpba107XHJcblx0XHRcdH1cclxuXHRcdH0pXHJcblxyXG5cdFx0cmV0dXJuIGZpbHRlck9iajtcclxuXHR9XHJcblxyXG5cdHNlbGYuZXZhbEZpZWxkTWFwQmFja1NjcmlwdCA9IGZ1bmN0aW9uIChmaWVsZF9tYXBfYmFja19zY3JpcHQsIGlucykge1xyXG5cdFx0dmFyIHNjcmlwdCA9IFwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHsgXCIgKyBmaWVsZF9tYXBfYmFja19zY3JpcHQgKyBcIiB9XCI7XHJcblx0XHR2YXIgZnVuYyA9IF9ldmFsKHNjcmlwdCwgXCJmaWVsZF9tYXBfc2NyaXB0XCIpO1xyXG5cdFx0dmFyIHZhbHVlcyA9IGZ1bmMoaW5zKTtcclxuXHRcdGlmIChfLmlzT2JqZWN0KHZhbHVlcykpIHtcclxuXHRcdFx0cmV0dXJuIHZhbHVlcztcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGNvbnNvbGUuZXJyb3IoXCJldmFsRmllbGRNYXBCYWNrU2NyaXB0OiDohJrmnKzov5Tlm57lgLznsbvlnovkuI3mmK/lr7nosaFcIik7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4ge31cclxuXHR9XHJcblxyXG5cdHNlbGYuc2VuZERvYyA9IGZ1bmN0aW9uIChkb2MpIHtcclxuXHRcdGlmIChJbnN0YW5jZVJlY29yZFF1ZXVlLmRlYnVnKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKFwic2VuZERvY1wiKTtcclxuXHRcdFx0Y29uc29sZS5sb2coZG9jKTtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgaW5zSWQgPSBkb2MuaW5mby5pbnN0YW5jZV9pZCxcclxuXHRcdFx0cmVjb3JkcyA9IGRvYy5pbmZvLnJlY29yZHM7XHJcblx0XHR2YXIgZmllbGRzID0ge1xyXG5cdFx0XHRmbG93OiAxLFxyXG5cdFx0XHR2YWx1ZXM6IDEsXHJcblx0XHRcdGFwcGxpY2FudDogMSxcclxuXHRcdFx0c3BhY2U6IDEsXHJcblx0XHRcdGZvcm06IDEsXHJcblx0XHRcdGZvcm1fdmVyc2lvbjogMVxyXG5cdFx0fTtcclxuXHRcdHNlbGYuc3luY0luc0ZpZWxkcy5mb3JFYWNoKGZ1bmN0aW9uIChmKSB7XHJcblx0XHRcdGZpZWxkc1tmXSA9IDE7XHJcblx0XHR9KVxyXG5cdFx0dmFyIGlucyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignaW5zdGFuY2VzJykuZmluZE9uZShpbnNJZCwge1xyXG5cdFx0XHRmaWVsZHM6IGZpZWxkc1xyXG5cdFx0fSk7XHJcblx0XHR2YXIgdmFsdWVzID0gaW5zLnZhbHVlcyxcclxuXHRcdFx0c3BhY2VJZCA9IGlucy5zcGFjZTtcclxuXHJcblx0XHRpZiAocmVjb3JkcyAmJiAhXy5pc0VtcHR5KHJlY29yZHMpKSB7XHJcblx0XHRcdC8vIOatpOaDheWGteWxnuS6juS7jmNyZWF0b3LkuK3lj5HotbflrqHmiblcclxuXHRcdFx0dmFyIG9iamVjdE5hbWUgPSByZWNvcmRzWzBdLm87XHJcblx0XHRcdHZhciBvdyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignb2JqZWN0X3dvcmtmbG93cycpLmZpbmRPbmUoe1xyXG5cdFx0XHRcdG9iamVjdF9uYW1lOiBvYmplY3ROYW1lLFxyXG5cdFx0XHRcdGZsb3dfaWQ6IGlucy5mbG93XHJcblx0XHRcdH0pO1xyXG5cdFx0XHR2YXJcclxuXHRcdFx0XHRvYmplY3RDb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdE5hbWUsIHNwYWNlSWQpLFxyXG5cdFx0XHRcdHN5bmNfYXR0YWNobWVudCA9IG93LnN5bmNfYXR0YWNobWVudDtcclxuXHRcdFx0dmFyIG9iamVjdEluZm8gPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3ROYW1lLCBzcGFjZUlkKTtcclxuXHRcdFx0b2JqZWN0Q29sbGVjdGlvbi5maW5kKHtcclxuXHRcdFx0XHRfaWQ6IHtcclxuXHRcdFx0XHRcdCRpbjogcmVjb3Jkc1swXS5pZHNcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pLmZvckVhY2goZnVuY3Rpb24gKHJlY29yZCkge1xyXG5cdFx0XHRcdC8vIOmZhOS7tuWQjOatpVxyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHR2YXIgc2V0T2JqID0gc2VsZi5zeW5jVmFsdWVzKG93LmZpZWxkX21hcF9iYWNrLCB2YWx1ZXMsIGlucywgb2JqZWN0SW5mbywgb3cuZmllbGRfbWFwX2JhY2tfc2NyaXB0LCByZWNvcmQpO1xyXG5cdFx0XHRcdFx0c2V0T2JqLmxvY2tlZCA9IGZhbHNlO1xyXG5cclxuXHRcdFx0XHRcdHZhciBpbnN0YW5jZV9zdGF0ZSA9IGlucy5zdGF0ZTtcclxuXHRcdFx0XHRcdGlmIChpbnMuc3RhdGUgPT09ICdjb21wbGV0ZWQnICYmIGlucy5maW5hbF9kZWNpc2lvbikge1xyXG5cdFx0XHRcdFx0XHRpbnN0YW5jZV9zdGF0ZSA9IGlucy5maW5hbF9kZWNpc2lvbjtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHNldE9ialsnaW5zdGFuY2VzLiQuc3RhdGUnXSA9IHNldE9iai5pbnN0YW5jZV9zdGF0ZSA9IGluc3RhbmNlX3N0YXRlO1xyXG5cclxuXHRcdFx0XHRcdG9iamVjdENvbGxlY3Rpb24udXBkYXRlKHtcclxuXHRcdFx0XHRcdFx0X2lkOiByZWNvcmQuX2lkLFxyXG5cdFx0XHRcdFx0XHQnaW5zdGFuY2VzLl9pZCc6IGluc0lkXHJcblx0XHRcdFx0XHR9LCB7XHJcblx0XHRcdFx0XHRcdCRzZXQ6IHNldE9ialxyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdC8vIOS7peacgOe7iOeUs+ivt+WNlemZhOS7tuS4uuWHhu+8jOaXp+eahHJlY29yZOS4remZhOS7tuWIoOmZpFxyXG5cdFx0XHRcdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKCdjbXNfZmlsZXMnKS5yZW1vdmUoe1xyXG5cdFx0XHRcdFx0XHQncGFyZW50Jzoge1xyXG5cdFx0XHRcdFx0XHRcdG86IG9iamVjdE5hbWUsXHJcblx0XHRcdFx0XHRcdFx0aWRzOiBbcmVjb3JkLl9pZF1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdGNmcy5maWxlcy5yZW1vdmUoe1xyXG5cdFx0XHRcdFx0XHQnbWV0YWRhdGEucmVjb3JkX2lkJzogcmVjb3JkLl9pZFxyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdC8vIOWQjOatpeaWsOmZhOS7tlxyXG5cdFx0XHRcdFx0c2VsZi5zeW5jQXR0YWNoKHN5bmNfYXR0YWNobWVudCwgaW5zSWQsIHJlY29yZC5zcGFjZSwgcmVjb3JkLl9pZCwgb2JqZWN0TmFtZSk7XHJcblx0XHRcdFx0fSBjYXRjaCAoZXJyb3IpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoZXJyb3Iuc3RhY2spO1xyXG5cdFx0XHRcdFx0b2JqZWN0Q29sbGVjdGlvbi51cGRhdGUoe1xyXG5cdFx0XHRcdFx0XHRfaWQ6IHJlY29yZC5faWQsXHJcblx0XHRcdFx0XHRcdCdpbnN0YW5jZXMuX2lkJzogaW5zSWRcclxuXHRcdFx0XHRcdH0sIHtcclxuXHRcdFx0XHRcdFx0JHNldDoge1xyXG5cdFx0XHRcdFx0XHRcdCdpbnN0YW5jZXMuJC5zdGF0ZSc6ICdwZW5kaW5nJyxcclxuXHRcdFx0XHRcdFx0XHQnbG9ja2VkJzogdHJ1ZSxcclxuXHRcdFx0XHRcdFx0XHQnaW5zdGFuY2Vfc3RhdGUnOiAncGVuZGluZydcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSlcclxuXHJcblx0XHRcdFx0XHRDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2Ntc19maWxlcycpLnJlbW92ZSh7XHJcblx0XHRcdFx0XHRcdCdwYXJlbnQnOiB7XHJcblx0XHRcdFx0XHRcdFx0bzogb2JqZWN0TmFtZSxcclxuXHRcdFx0XHRcdFx0XHRpZHM6IFtyZWNvcmQuX2lkXVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0Y2ZzLmZpbGVzLnJlbW92ZSh7XHJcblx0XHRcdFx0XHRcdCdtZXRhZGF0YS5yZWNvcmRfaWQnOiByZWNvcmQuX2lkXHJcblx0XHRcdFx0XHR9KVxyXG5cclxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihlcnJvcik7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fSlcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdC8vIOatpOaDheWGteWxnuS6juS7jmFwcHPkuK3lj5HotbflrqHmiblcclxuXHRcdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKCdvYmplY3Rfd29ya2Zsb3dzJykuZmluZCh7XHJcblx0XHRcdFx0Zmxvd19pZDogaW5zLmZsb3dcclxuXHRcdFx0fSkuZm9yRWFjaChmdW5jdGlvbiAob3cpIHtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0dmFyXHJcblx0XHRcdFx0XHRcdG9iamVjdENvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob3cub2JqZWN0X25hbWUsIHNwYWNlSWQpLFxyXG5cdFx0XHRcdFx0XHRzeW5jX2F0dGFjaG1lbnQgPSBvdy5zeW5jX2F0dGFjaG1lbnQsXHJcblx0XHRcdFx0XHRcdG5ld1JlY29yZElkID0gb2JqZWN0Q29sbGVjdGlvbi5fbWFrZU5ld0lEKCksXHJcblx0XHRcdFx0XHRcdG9iamVjdE5hbWUgPSBvdy5vYmplY3RfbmFtZTtcclxuXHJcblx0XHRcdFx0XHR2YXIgb2JqZWN0SW5mbyA9IENyZWF0b3IuZ2V0T2JqZWN0KG93Lm9iamVjdF9uYW1lLCBzcGFjZUlkKTtcclxuXHJcblx0XHRcdFx0XHR2YXIgbmV3T2JqID0gc2VsZi5zeW5jVmFsdWVzKG93LmZpZWxkX21hcF9iYWNrLCB2YWx1ZXMsIGlucywgb2JqZWN0SW5mbywgb3cuZmllbGRfbWFwX2JhY2tfc2NyaXB0KTtcclxuXHJcblx0XHRcdFx0XHRuZXdPYmouX2lkID0gbmV3UmVjb3JkSWQ7XHJcblx0XHRcdFx0XHRuZXdPYmouc3BhY2UgPSBzcGFjZUlkO1xyXG5cdFx0XHRcdFx0bmV3T2JqLm5hbWUgPSBuZXdPYmoubmFtZSB8fCBpbnMubmFtZTtcclxuXHJcblx0XHRcdFx0XHR2YXIgaW5zdGFuY2Vfc3RhdGUgPSBpbnMuc3RhdGU7XHJcblx0XHRcdFx0XHRpZiAoaW5zLnN0YXRlID09PSAnY29tcGxldGVkJyAmJiBpbnMuZmluYWxfZGVjaXNpb24pIHtcclxuXHRcdFx0XHRcdFx0aW5zdGFuY2Vfc3RhdGUgPSBpbnMuZmluYWxfZGVjaXNpb247XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRuZXdPYmouaW5zdGFuY2VzID0gW3tcclxuXHRcdFx0XHRcdFx0X2lkOiBpbnNJZCxcclxuXHRcdFx0XHRcdFx0c3RhdGU6IGluc3RhbmNlX3N0YXRlXHJcblx0XHRcdFx0XHR9XTtcclxuXHRcdFx0XHRcdG5ld09iai5pbnN0YW5jZV9zdGF0ZSA9IGluc3RhbmNlX3N0YXRlO1xyXG5cclxuXHRcdFx0XHRcdG5ld09iai5vd25lciA9IGlucy5hcHBsaWNhbnQ7XHJcblx0XHRcdFx0XHRuZXdPYmouY3JlYXRlZF9ieSA9IGlucy5hcHBsaWNhbnQ7XHJcblx0XHRcdFx0XHRuZXdPYmoubW9kaWZpZWRfYnkgPSBpbnMuYXBwbGljYW50O1xyXG5cdFx0XHRcdFx0dmFyIHIgPSBvYmplY3RDb2xsZWN0aW9uLmluc2VydChuZXdPYmopO1xyXG5cdFx0XHRcdFx0aWYgKHIpIHtcclxuXHRcdFx0XHRcdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKCdpbnN0YW5jZXMnKS51cGRhdGUoaW5zLl9pZCwge1xyXG5cdFx0XHRcdFx0XHRcdCRwdXNoOiB7XHJcblx0XHRcdFx0XHRcdFx0XHRyZWNvcmRfaWRzOiB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdG86IG9iamVjdE5hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdGlkczogW25ld1JlY29yZElkXVxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdFx0Ly8gd29ya2Zsb3fph4zlj5HotbflrqHmibnlkI7vvIzlkIzmraXml7bkuZ/lj6/ku6Xkv67mlLnnm7jlhbPooajnmoTlrZfmrrXlgLwgIzExODNcclxuXHRcdFx0XHRcdFx0dmFyIHJlY29yZCA9IG9iamVjdENvbGxlY3Rpb24uZmluZE9uZShuZXdSZWNvcmRJZCk7XHJcblx0XHRcdFx0XHRcdHNlbGYuc3luY1ZhbHVlcyhvdy5maWVsZF9tYXBfYmFjaywgdmFsdWVzLCBpbnMsIG9iamVjdEluZm8sIG93LmZpZWxkX21hcF9iYWNrX3NjcmlwdCwgcmVjb3JkKTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHQvLyDpmYTku7blkIzmraVcclxuXHRcdFx0XHRcdHNlbGYuc3luY0F0dGFjaChzeW5jX2F0dGFjaG1lbnQsIGluc0lkLCBzcGFjZUlkLCBuZXdSZWNvcmRJZCwgb2JqZWN0TmFtZSk7XHJcblxyXG5cdFx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKGVycm9yLnN0YWNrKTtcclxuXHJcblx0XHRcdFx0XHRvYmplY3RDb2xsZWN0aW9uLnJlbW92ZSh7XHJcblx0XHRcdFx0XHRcdF9pZDogbmV3UmVjb3JkSWQsXHJcblx0XHRcdFx0XHRcdHNwYWNlOiBzcGFjZUlkXHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbignaW5zdGFuY2VzJykudXBkYXRlKGlucy5faWQsIHtcclxuXHRcdFx0XHRcdFx0JHB1bGw6IHtcclxuXHRcdFx0XHRcdFx0XHRyZWNvcmRfaWRzOiB7XHJcblx0XHRcdFx0XHRcdFx0XHRvOiBvYmplY3ROYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0aWRzOiBbbmV3UmVjb3JkSWRdXHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKCdjbXNfZmlsZXMnKS5yZW1vdmUoe1xyXG5cdFx0XHRcdFx0XHQncGFyZW50Jzoge1xyXG5cdFx0XHRcdFx0XHRcdG86IG9iamVjdE5hbWUsXHJcblx0XHRcdFx0XHRcdFx0aWRzOiBbbmV3UmVjb3JkSWRdXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHRjZnMuZmlsZXMucmVtb3ZlKHtcclxuXHRcdFx0XHRcdFx0J21ldGFkYXRhLnJlY29yZF9pZCc6IG5ld1JlY29yZElkXHJcblx0XHRcdFx0XHR9KVxyXG5cclxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihlcnJvcik7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fSlcclxuXHRcdH1cclxuXHJcblx0XHRJbnN0YW5jZVJlY29yZFF1ZXVlLmNvbGxlY3Rpb24udXBkYXRlKGRvYy5faWQsIHtcclxuXHRcdFx0JHNldDoge1xyXG5cdFx0XHRcdCdpbmZvLnN5bmNfZGF0ZSc6IG5ldyBEYXRlKClcclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHJcblx0fVxyXG5cclxuXHQvLyBVbml2ZXJzYWwgc2VuZCBmdW5jdGlvblxyXG5cdHZhciBfcXVlcnlTZW5kID0gZnVuY3Rpb24gKGRvYykge1xyXG5cclxuXHRcdGlmIChzZWxmLnNlbmREb2MpIHtcclxuXHRcdFx0c2VsZi5zZW5kRG9jKGRvYyk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0ZG9jOiBbZG9jLl9pZF1cclxuXHRcdH07XHJcblx0fTtcclxuXHJcblx0c2VsZi5zZXJ2ZXJTZW5kID0gZnVuY3Rpb24gKGRvYykge1xyXG5cdFx0ZG9jID0gZG9jIHx8IHt9O1xyXG5cdFx0cmV0dXJuIF9xdWVyeVNlbmQoZG9jKTtcclxuXHR9O1xyXG5cclxuXHJcblx0Ly8gVGhpcyBpbnRlcnZhbCB3aWxsIGFsbG93IG9ubHkgb25lIGRvYyB0byBiZSBzZW50IGF0IGEgdGltZSwgaXRcclxuXHQvLyB3aWxsIGNoZWNrIGZvciBuZXcgZG9jcyBhdCBldmVyeSBgb3B0aW9ucy5zZW5kSW50ZXJ2YWxgXHJcblx0Ly8gKGRlZmF1bHQgaW50ZXJ2YWwgaXMgMTUwMDAgbXMpXHJcblx0Ly9cclxuXHQvLyBJdCBsb29rcyBpbiBkb2NzIGNvbGxlY3Rpb24gdG8gc2VlIGlmIHRoZXJlcyBhbnkgcGVuZGluZ1xyXG5cdC8vIGRvY3MsIGlmIHNvIGl0IHdpbGwgdHJ5IHRvIHJlc2VydmUgdGhlIHBlbmRpbmcgZG9jLlxyXG5cdC8vIElmIHN1Y2Nlc3NmdWxseSByZXNlcnZlZCB0aGUgc2VuZCBpcyBzdGFydGVkLlxyXG5cdC8vXHJcblx0Ly8gSWYgZG9jLnF1ZXJ5IGlzIHR5cGUgc3RyaW5nLCBpdCdzIGFzc3VtZWQgdG8gYmUgYSBqc29uIHN0cmluZ1xyXG5cdC8vIHZlcnNpb24gb2YgdGhlIHF1ZXJ5IHNlbGVjdG9yLiBNYWtpbmcgaXQgYWJsZSB0byBjYXJyeSBgJGAgcHJvcGVydGllcyBpblxyXG5cdC8vIHRoZSBtb25nbyBjb2xsZWN0aW9uLlxyXG5cdC8vXHJcblx0Ly8gUHIuIGRlZmF1bHQgZG9jcyBhcmUgcmVtb3ZlZCBmcm9tIHRoZSBjb2xsZWN0aW9uIGFmdGVyIHNlbmQgaGF2ZVxyXG5cdC8vIGNvbXBsZXRlZC4gU2V0dGluZyBgb3B0aW9ucy5rZWVwRG9jc2Agd2lsbCB1cGRhdGUgYW5kIGtlZXAgdGhlXHJcblx0Ly8gZG9jIGVnLiBpZiBuZWVkZWQgZm9yIGhpc3RvcmljYWwgcmVhc29ucy5cclxuXHQvL1xyXG5cdC8vIEFmdGVyIHRoZSBzZW5kIGhhdmUgY29tcGxldGVkIGEgXCJzZW5kXCIgZXZlbnQgd2lsbCBiZSBlbWl0dGVkIHdpdGggYVxyXG5cdC8vIHN0YXR1cyBvYmplY3QgY29udGFpbmluZyBkb2MgaWQgYW5kIHRoZSBzZW5kIHJlc3VsdCBvYmplY3QuXHJcblx0Ly9cclxuXHR2YXIgaXNTZW5kaW5nRG9jID0gZmFsc2U7XHJcblxyXG5cdGlmIChvcHRpb25zLnNlbmRJbnRlcnZhbCAhPT0gbnVsbCkge1xyXG5cclxuXHRcdC8vIFRoaXMgd2lsbCByZXF1aXJlIGluZGV4IHNpbmNlIHdlIHNvcnQgZG9jcyBieSBjcmVhdGVkQXRcclxuXHRcdEluc3RhbmNlUmVjb3JkUXVldWUuY29sbGVjdGlvbi5fZW5zdXJlSW5kZXgoe1xyXG5cdFx0XHRjcmVhdGVkQXQ6IDFcclxuXHRcdH0pO1xyXG5cdFx0SW5zdGFuY2VSZWNvcmRRdWV1ZS5jb2xsZWN0aW9uLl9lbnN1cmVJbmRleCh7XHJcblx0XHRcdHNlbnQ6IDFcclxuXHRcdH0pO1xyXG5cdFx0SW5zdGFuY2VSZWNvcmRRdWV1ZS5jb2xsZWN0aW9uLl9lbnN1cmVJbmRleCh7XHJcblx0XHRcdHNlbmRpbmc6IDFcclxuXHRcdH0pO1xyXG5cclxuXHJcblx0XHR2YXIgc2VuZERvYyA9IGZ1bmN0aW9uIChkb2MpIHtcclxuXHRcdFx0Ly8gUmVzZXJ2ZSBkb2NcclxuXHRcdFx0dmFyIG5vdyA9ICtuZXcgRGF0ZSgpO1xyXG5cdFx0XHR2YXIgdGltZW91dEF0ID0gbm93ICsgb3B0aW9ucy5zZW5kVGltZW91dDtcclxuXHRcdFx0dmFyIHJlc2VydmVkID0gSW5zdGFuY2VSZWNvcmRRdWV1ZS5jb2xsZWN0aW9uLnVwZGF0ZSh7XHJcblx0XHRcdFx0X2lkOiBkb2MuX2lkLFxyXG5cdFx0XHRcdHNlbnQ6IGZhbHNlLCAvLyB4eHg6IG5lZWQgdG8gbWFrZSBzdXJlIHRoaXMgaXMgc2V0IG9uIGNyZWF0ZVxyXG5cdFx0XHRcdHNlbmRpbmc6IHtcclxuXHRcdFx0XHRcdCRsdDogbm93XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LCB7XHJcblx0XHRcdFx0JHNldDoge1xyXG5cdFx0XHRcdFx0c2VuZGluZzogdGltZW91dEF0LFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHQvLyBNYWtlIHN1cmUgd2Ugb25seSBoYW5kbGUgZG9jcyByZXNlcnZlZCBieSB0aGlzXHJcblx0XHRcdC8vIGluc3RhbmNlXHJcblx0XHRcdGlmIChyZXNlcnZlZCkge1xyXG5cclxuXHRcdFx0XHQvLyBTZW5kXHJcblx0XHRcdFx0dmFyIHJlc3VsdCA9IEluc3RhbmNlUmVjb3JkUXVldWUuc2VydmVyU2VuZChkb2MpO1xyXG5cclxuXHRcdFx0XHRpZiAoIW9wdGlvbnMua2VlcERvY3MpIHtcclxuXHRcdFx0XHRcdC8vIFByLiBEZWZhdWx0IHdlIHdpbGwgcmVtb3ZlIGRvY3NcclxuXHRcdFx0XHRcdEluc3RhbmNlUmVjb3JkUXVldWUuY29sbGVjdGlvbi5yZW1vdmUoe1xyXG5cdFx0XHRcdFx0XHRfaWQ6IGRvYy5faWRcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblxyXG5cdFx0XHRcdFx0Ly8gVXBkYXRlXHJcblx0XHRcdFx0XHRJbnN0YW5jZVJlY29yZFF1ZXVlLmNvbGxlY3Rpb24udXBkYXRlKHtcclxuXHRcdFx0XHRcdFx0X2lkOiBkb2MuX2lkXHJcblx0XHRcdFx0XHR9LCB7XHJcblx0XHRcdFx0XHRcdCRzZXQ6IHtcclxuXHRcdFx0XHRcdFx0XHQvLyBNYXJrIGFzIHNlbnRcclxuXHRcdFx0XHRcdFx0XHRzZW50OiB0cnVlLFxyXG5cdFx0XHRcdFx0XHRcdC8vIFNldCB0aGUgc2VudCBkYXRlXHJcblx0XHRcdFx0XHRcdFx0c2VudEF0OiBuZXcgRGF0ZSgpLFxyXG5cdFx0XHRcdFx0XHRcdC8vIE5vdCBiZWluZyBzZW50IGFueW1vcmVcclxuXHRcdFx0XHRcdFx0XHRzZW5kaW5nOiAwXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdC8vIC8vIEVtaXQgdGhlIHNlbmRcclxuXHRcdFx0XHQvLyBzZWxmLmVtaXQoJ3NlbmQnLCB7XHJcblx0XHRcdFx0Ly8gXHRkb2M6IGRvYy5faWQsXHJcblx0XHRcdFx0Ly8gXHRyZXN1bHQ6IHJlc3VsdFxyXG5cdFx0XHRcdC8vIH0pO1xyXG5cclxuXHRcdFx0fSAvLyBFbHNlIGNvdWxkIG5vdCByZXNlcnZlXHJcblx0XHR9OyAvLyBFTyBzZW5kRG9jXHJcblxyXG5cdFx0c2VuZFdvcmtlcihmdW5jdGlvbiAoKSB7XHJcblxyXG5cdFx0XHRpZiAoaXNTZW5kaW5nRG9jKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdC8vIFNldCBzZW5kIGZlbmNlXHJcblx0XHRcdGlzU2VuZGluZ0RvYyA9IHRydWU7XHJcblxyXG5cdFx0XHR2YXIgYmF0Y2hTaXplID0gb3B0aW9ucy5zZW5kQmF0Y2hTaXplIHx8IDE7XHJcblxyXG5cdFx0XHR2YXIgbm93ID0gK25ldyBEYXRlKCk7XHJcblxyXG5cdFx0XHQvLyBGaW5kIGRvY3MgdGhhdCBhcmUgbm90IGJlaW5nIG9yIGFscmVhZHkgc2VudFxyXG5cdFx0XHR2YXIgcGVuZGluZ0RvY3MgPSBJbnN0YW5jZVJlY29yZFF1ZXVlLmNvbGxlY3Rpb24uZmluZCh7XHJcblx0XHRcdFx0JGFuZDogW1xyXG5cdFx0XHRcdFx0Ly8gTWVzc2FnZSBpcyBub3Qgc2VudFxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRzZW50OiBmYWxzZVxyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdC8vIEFuZCBub3QgYmVpbmcgc2VudCBieSBvdGhlciBpbnN0YW5jZXNcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0c2VuZGluZzoge1xyXG5cdFx0XHRcdFx0XHRcdCRsdDogbm93XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHQvLyBBbmQgbm8gZXJyb3JcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0ZXJyTXNnOiB7XHJcblx0XHRcdFx0XHRcdFx0JGV4aXN0czogZmFsc2VcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdF1cclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdC8vIFNvcnQgYnkgY3JlYXRlZCBkYXRlXHJcblx0XHRcdFx0c29ydDoge1xyXG5cdFx0XHRcdFx0Y3JlYXRlZEF0OiAxXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRsaW1pdDogYmF0Y2hTaXplXHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0cGVuZGluZ0RvY3MuZm9yRWFjaChmdW5jdGlvbiAoZG9jKSB7XHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdHNlbmREb2MoZG9jKTtcclxuXHRcdFx0XHR9IGNhdGNoIChlcnJvcikge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvcihlcnJvci5zdGFjayk7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnSW5zdGFuY2VSZWNvcmRRdWV1ZTogQ291bGQgbm90IHNlbmQgZG9jIGlkOiBcIicgKyBkb2MuX2lkICsgJ1wiLCBFcnJvcjogJyArIGVycm9yLm1lc3NhZ2UpO1xyXG5cdFx0XHRcdFx0SW5zdGFuY2VSZWNvcmRRdWV1ZS5jb2xsZWN0aW9uLnVwZGF0ZSh7XHJcblx0XHRcdFx0XHRcdF9pZDogZG9jLl9pZFxyXG5cdFx0XHRcdFx0fSwge1xyXG5cdFx0XHRcdFx0XHQkc2V0OiB7XHJcblx0XHRcdFx0XHRcdFx0Ly8gZXJyb3IgbWVzc2FnZVxyXG5cdFx0XHRcdFx0XHRcdGVyck1zZzogZXJyb3IubWVzc2FnZVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pOyAvLyBFTyBmb3JFYWNoXHJcblxyXG5cdFx0XHQvLyBSZW1vdmUgdGhlIHNlbmQgZmVuY2VcclxuXHRcdFx0aXNTZW5kaW5nRG9jID0gZmFsc2U7XHJcblx0XHR9LCBvcHRpb25zLnNlbmRJbnRlcnZhbCB8fCAxNTAwMCk7IC8vIERlZmF1bHQgZXZlcnkgMTV0aCBzZWNcclxuXHJcblx0fSBlbHNlIHtcclxuXHRcdGlmIChJbnN0YW5jZVJlY29yZFF1ZXVlLmRlYnVnKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKCdJbnN0YW5jZVJlY29yZFF1ZXVlOiBTZW5kIHNlcnZlciBpcyBkaXNhYmxlZCcpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcbn07IiwiTWV0ZW9yLnN0YXJ0dXAgLT5cclxuXHRpZiBNZXRlb3Iuc2V0dGluZ3MuY3Jvbj8uaW5zdGFuY2VyZWNvcmRxdWV1ZV9pbnRlcnZhbFxyXG5cdFx0SW5zdGFuY2VSZWNvcmRRdWV1ZS5Db25maWd1cmVcclxuXHRcdFx0c2VuZEludGVydmFsOiBNZXRlb3Iuc2V0dGluZ3MuY3Jvbi5pbnN0YW5jZXJlY29yZHF1ZXVlX2ludGVydmFsXHJcblx0XHRcdHNlbmRCYXRjaFNpemU6IDEwXHJcblx0XHRcdGtlZXBEb2NzOiB0cnVlXHJcbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICB2YXIgcmVmO1xuICBpZiAoKHJlZiA9IE1ldGVvci5zZXR0aW5ncy5jcm9uKSAhPSBudWxsID8gcmVmLmluc3RhbmNlcmVjb3JkcXVldWVfaW50ZXJ2YWwgOiB2b2lkIDApIHtcbiAgICByZXR1cm4gSW5zdGFuY2VSZWNvcmRRdWV1ZS5Db25maWd1cmUoe1xuICAgICAgc2VuZEludGVydmFsOiBNZXRlb3Iuc2V0dGluZ3MuY3Jvbi5pbnN0YW5jZXJlY29yZHF1ZXVlX2ludGVydmFsLFxuICAgICAgc2VuZEJhdGNoU2l6ZTogMTAsXG4gICAgICBrZWVwRG9jczogdHJ1ZVxuICAgIH0pO1xuICB9XG59KTtcbiIsImltcG9ydCB7IGNoZWNrTnBtVmVyc2lvbnMgfSBmcm9tICdtZXRlb3IvdG1lYXNkYXk6Y2hlY2stbnBtLXZlcnNpb25zJztcclxuY2hlY2tOcG1WZXJzaW9ucyh7XHJcblx0XCJldmFsXCI6IFwiXjAuMS4yXCJcclxufSwgJ3N0ZWVkb3M6aW5zdGFuY2UtcmVjb3JkLXF1ZXVlJyk7XHJcbiJdfQ==
