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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczppbnN0YW5jZS1yZWNvcmQtcXVldWUvbGliL2NvbW1vbi9tYWluLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmluc3RhbmNlLXJlY29yZC1xdWV1ZS9saWIvY29tbW9uL2RvY3MuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6aW5zdGFuY2UtcmVjb3JkLXF1ZXVlL2xpYi9zZXJ2ZXIvYXBpLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2luc3RhbmNlLXJlY29yZC1xdWV1ZS9zZXJ2ZXIvc3RhcnR1cC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9zdGFydHVwLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczppbnN0YW5jZS1yZWNvcmQtcXVldWUvc2VydmVyL2NoZWNrTnBtLmpzIl0sIm5hbWVzIjpbIkluc3RhbmNlUmVjb3JkUXVldWUiLCJFdmVudFN0YXRlIiwiY29sbGVjdGlvbiIsImRiIiwiaW5zdGFuY2VfcmVjb3JkX3F1ZXVlIiwiTW9uZ28iLCJDb2xsZWN0aW9uIiwiX3ZhbGlkYXRlRG9jdW1lbnQiLCJkb2MiLCJjaGVjayIsImluZm8iLCJPYmplY3QiLCJzZW50IiwiTWF0Y2giLCJPcHRpb25hbCIsIkJvb2xlYW4iLCJzZW5kaW5nIiwiSW50ZWdlciIsImNyZWF0ZWRBdCIsIkRhdGUiLCJjcmVhdGVkQnkiLCJPbmVPZiIsIlN0cmluZyIsInNlbmQiLCJvcHRpb25zIiwiY3VycmVudFVzZXIiLCJNZXRlb3IiLCJpc0NsaWVudCIsInVzZXJJZCIsImlzU2VydmVyIiwiXyIsImV4dGVuZCIsInRlc3QiLCJwaWNrIiwiaW5zZXJ0IiwiX2V2YWwiLCJyZXF1aXJlIiwiaXNDb25maWd1cmVkIiwic2VuZFdvcmtlciIsInRhc2siLCJpbnRlcnZhbCIsImRlYnVnIiwiY29uc29sZSIsImxvZyIsInNldEludGVydmFsIiwiZXJyb3IiLCJtZXNzYWdlIiwiQ29uZmlndXJlIiwic2VsZiIsInNlbmRUaW1lb3V0IiwiRXJyb3IiLCJzeW5jQXR0YWNoIiwic3luY19hdHRhY2htZW50IiwiaW5zSWQiLCJzcGFjZUlkIiwibmV3UmVjb3JkSWQiLCJvYmplY3ROYW1lIiwiY2ZzIiwiaW5zdGFuY2VzIiwiZmluZCIsImZvckVhY2giLCJmIiwibmV3RmlsZSIsIkZTIiwiRmlsZSIsImNtc0ZpbGVJZCIsIkNyZWF0b3IiLCJnZXRDb2xsZWN0aW9uIiwiX21ha2VOZXdJRCIsImF0dGFjaERhdGEiLCJjcmVhdGVSZWFkU3RyZWFtIiwidHlwZSIsIm9yaWdpbmFsIiwiZXJyIiwicmVhc29uIiwibmFtZSIsInNpemUiLCJtZXRhZGF0YSIsIm93bmVyIiwib3duZXJfbmFtZSIsInNwYWNlIiwicmVjb3JkX2lkIiwib2JqZWN0X25hbWUiLCJwYXJlbnQiLCJmaWxlT2JqIiwiZmlsZXMiLCJfaWQiLCJvIiwiaWRzIiwiZXh0ZW50aW9uIiwiZXh0ZW5zaW9uIiwidmVyc2lvbnMiLCJjcmVhdGVkX2J5IiwibW9kaWZpZWRfYnkiLCJwYXJlbnRzIiwiaW5jbHVkZXMiLCJwdXNoIiwiY3VycmVudCIsInVwZGF0ZSIsIiRzZXQiLCIkYWRkVG9TZXQiLCJzeW5jSW5zRmllbGRzIiwic3luY1ZhbHVlcyIsImZpZWxkX21hcF9iYWNrIiwidmFsdWVzIiwiaW5zIiwib2JqZWN0SW5mbyIsImZpZWxkX21hcF9iYWNrX3NjcmlwdCIsInJlY29yZCIsIm9iaiIsInRhYmxlRmllbGRDb2RlcyIsInRhYmxlRmllbGRNYXAiLCJmb3JtIiwiZmluZE9uZSIsImZvcm1GaWVsZHMiLCJmb3JtX3ZlcnNpb24iLCJmaWVsZHMiLCJmb3JtVmVyc2lvbiIsImhpc3RvcnlzIiwiaCIsIm9iamVjdEZpZWxkcyIsIm9iamVjdEZpZWxkS2V5cyIsImtleXMiLCJmbSIsIndvcmtmbG93X2ZpZWxkIiwiaW5kZXhPZiIsIm9iamVjdF9maWVsZCIsIndUYWJsZUNvZGUiLCJzcGxpdCIsIm9UYWJsZUNvZGUiLCJoYXNPd25Qcm9wZXJ0eSIsImlzQXJyYXkiLCJKU09OIiwic3RyaW5naWZ5Iiwid29ya2Zsb3dfdGFibGVfZmllbGRfY29kZSIsIm9iamVjdF90YWJsZV9maWVsZF9jb2RlIiwid0ZpZWxkIiwiZWFjaCIsImZmIiwiY29kZSIsIm9GaWVsZCIsImlzX211bHRpc2VsZWN0IiwibXVsdGlwbGUiLCJyZWZlcmVuY2VfdG8iLCJpc1N0cmluZyIsIm9Db2xsZWN0aW9uIiwicmVmZXJPYmplY3QiLCJnZXRPYmplY3QiLCJyZWZlckRhdGEiLCJuYW1lRmllbGRLZXkiLCJOQU1FX0ZJRUxEX0tFWSIsInNlbGVjdG9yIiwidG1wX2ZpZWxkX3ZhbHVlIiwidGVtT2JqRmllbGRzIiwibGVuZ3RoIiwib2JqRmllbGQiLCJyZWZlck9iakZpZWxkIiwicmVmZXJTZXRPYmoiLCJzdGFydHNXaXRoIiwiaW5zRmllbGQiLCJ1bmlxIiwidGZjIiwiYyIsInBhcnNlIiwidHIiLCJuZXdUciIsInYiLCJrIiwidGZtIiwib1RkQ29kZSIsImlzRW1wdHkiLCJldmFsRmllbGRNYXBCYWNrU2NyaXB0IiwiZmlsdGVyT2JqIiwic2NyaXB0IiwiZnVuYyIsImlzT2JqZWN0Iiwic2VuZERvYyIsImluc3RhbmNlX2lkIiwicmVjb3JkcyIsImZsb3ciLCJhcHBsaWNhbnQiLCJvdyIsImZsb3dfaWQiLCJvYmplY3RDb2xsZWN0aW9uIiwiJGluIiwic2V0T2JqIiwibG9ja2VkIiwiaW5zdGFuY2Vfc3RhdGUiLCJzdGF0ZSIsImZpbmFsX2RlY2lzaW9uIiwicmVtb3ZlIiwic3RhY2siLCJuZXdPYmoiLCJyIiwiJHB1c2giLCJyZWNvcmRfaWRzIiwiJHB1bGwiLCJfcXVlcnlTZW5kIiwic2VydmVyU2VuZCIsImlzU2VuZGluZ0RvYyIsInNlbmRJbnRlcnZhbCIsIl9lbnN1cmVJbmRleCIsIm5vdyIsInRpbWVvdXRBdCIsInJlc2VydmVkIiwiJGx0IiwicmVzdWx0Iiwia2VlcERvY3MiLCJzZW50QXQiLCJiYXRjaFNpemUiLCJzZW5kQmF0Y2hTaXplIiwicGVuZGluZ0RvY3MiLCIkYW5kIiwiZXJyTXNnIiwiJGV4aXN0cyIsInNvcnQiLCJsaW1pdCIsInN0YXJ0dXAiLCJyZWYiLCJzZXR0aW5ncyIsImNyb24iLCJpbnN0YW5jZXJlY29yZHF1ZXVlX2ludGVydmFsIiwiY2hlY2tOcG1WZXJzaW9ucyIsIm1vZHVsZSIsImxpbmsiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQUEsbUJBQW1CLEdBQUcsSUFBSUMsVUFBSixFQUF0QixDOzs7Ozs7Ozs7OztBQ0FBRCxtQkFBbUIsQ0FBQ0UsVUFBcEIsR0FBaUNDLEVBQUUsQ0FBQ0MscUJBQUgsR0FBMkIsSUFBSUMsS0FBSyxDQUFDQyxVQUFWLENBQXFCLHVCQUFyQixDQUE1RDs7QUFFQSxJQUFJQyxpQkFBaUIsR0FBRyxVQUFTQyxHQUFULEVBQWM7QUFFckNDLE9BQUssQ0FBQ0QsR0FBRCxFQUFNO0FBQ1ZFLFFBQUksRUFBRUMsTUFESTtBQUVWQyxRQUFJLEVBQUVDLEtBQUssQ0FBQ0MsUUFBTixDQUFlQyxPQUFmLENBRkk7QUFHVkMsV0FBTyxFQUFFSCxLQUFLLENBQUNDLFFBQU4sQ0FBZUQsS0FBSyxDQUFDSSxPQUFyQixDQUhDO0FBSVZDLGFBQVMsRUFBRUMsSUFKRDtBQUtWQyxhQUFTLEVBQUVQLEtBQUssQ0FBQ1EsS0FBTixDQUFZQyxNQUFaLEVBQW9CLElBQXBCO0FBTEQsR0FBTixDQUFMO0FBUUEsQ0FWRDs7QUFZQXRCLG1CQUFtQixDQUFDdUIsSUFBcEIsR0FBMkIsVUFBU0MsT0FBVCxFQUFrQjtBQUM1QyxNQUFJQyxXQUFXLEdBQUdDLE1BQU0sQ0FBQ0MsUUFBUCxJQUFtQkQsTUFBTSxDQUFDRSxNQUExQixJQUFvQ0YsTUFBTSxDQUFDRSxNQUFQLEVBQXBDLElBQXVERixNQUFNLENBQUNHLFFBQVAsS0FBb0JMLE9BQU8sQ0FBQ0osU0FBUixJQUFxQixVQUF6QyxDQUF2RCxJQUErRyxJQUFq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LENBQ0M7QUFBQXlKLG9CQUFjOUssT0FBT2lNLFFBQVAsQ0FBZ0JDLElBQWhCLENBQXFCQyw0QkFBbkM7QUFDQVgscUJBQWUsRUFEZjtBQUVBSCxnQkFBVTtBQUZWLEtBREQsQ0NDRTtBQUtEO0FEUkgsRzs7Ozs7Ozs7Ozs7QUVBQSxJQUFJZSxnQkFBSjtBQUFxQkMsTUFBTSxDQUFDQyxJQUFQLENBQVksb0NBQVosRUFBaUQ7QUFBQ0Ysa0JBQWdCLENBQUN4RCxDQUFELEVBQUc7QUFBQ3dELG9CQUFnQixHQUFDeEQsQ0FBakI7QUFBbUI7O0FBQXhDLENBQWpELEVBQTJGLENBQTNGO0FBQ3JCd0QsZ0JBQWdCLENBQUM7QUFDaEIsVUFBUTtBQURRLENBQUQsRUFFYiwrQkFGYSxDQUFoQixDIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX2luc3RhbmNlLXJlY29yZC1xdWV1ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIkluc3RhbmNlUmVjb3JkUXVldWUgPSBuZXcgRXZlbnRTdGF0ZSgpOyIsIkluc3RhbmNlUmVjb3JkUXVldWUuY29sbGVjdGlvbiA9IGRiLmluc3RhbmNlX3JlY29yZF9xdWV1ZSA9IG5ldyBNb25nby5Db2xsZWN0aW9uKCdpbnN0YW5jZV9yZWNvcmRfcXVldWUnKTtcblxudmFyIF92YWxpZGF0ZURvY3VtZW50ID0gZnVuY3Rpb24oZG9jKSB7XG5cblx0Y2hlY2soZG9jLCB7XG5cdFx0aW5mbzogT2JqZWN0LFxuXHRcdHNlbnQ6IE1hdGNoLk9wdGlvbmFsKEJvb2xlYW4pLFxuXHRcdHNlbmRpbmc6IE1hdGNoLk9wdGlvbmFsKE1hdGNoLkludGVnZXIpLFxuXHRcdGNyZWF0ZWRBdDogRGF0ZSxcblx0XHRjcmVhdGVkQnk6IE1hdGNoLk9uZU9mKFN0cmluZywgbnVsbClcblx0fSk7XG5cbn07XG5cbkluc3RhbmNlUmVjb3JkUXVldWUuc2VuZCA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcblx0dmFyIGN1cnJlbnRVc2VyID0gTWV0ZW9yLmlzQ2xpZW50ICYmIE1ldGVvci51c2VySWQgJiYgTWV0ZW9yLnVzZXJJZCgpIHx8IE1ldGVvci5pc1NlcnZlciAmJiAob3B0aW9ucy5jcmVhdGVkQnkgfHwgJzxTRVJWRVI+JykgfHwgbnVsbFxuXHR2YXIgZG9jID0gXy5leHRlbmQoe1xuXHRcdGNyZWF0ZWRBdDogbmV3IERhdGUoKSxcblx0XHRjcmVhdGVkQnk6IGN1cnJlbnRVc2VyXG5cdH0pO1xuXG5cdGlmIChNYXRjaC50ZXN0KG9wdGlvbnMsIE9iamVjdCkpIHtcblx0XHRkb2MuaW5mbyA9IF8ucGljayhvcHRpb25zLCAnaW5zdGFuY2VfaWQnLCAncmVjb3JkcycsICdzeW5jX2RhdGUnLCAnaW5zdGFuY2VfZmluaXNoX2RhdGUnLCAnc3RlcF9uYW1lJyk7XG5cdH1cblxuXHRkb2Muc2VudCA9IGZhbHNlO1xuXHRkb2Muc2VuZGluZyA9IDA7XG5cblx0X3ZhbGlkYXRlRG9jdW1lbnQoZG9jKTtcblxuXHRyZXR1cm4gSW5zdGFuY2VSZWNvcmRRdWV1ZS5jb2xsZWN0aW9uLmluc2VydChkb2MpO1xufTsiLCJ2YXIgX2V2YWwgPSByZXF1aXJlKCdldmFsJyk7XG52YXIgaXNDb25maWd1cmVkID0gZmFsc2U7XG52YXIgc2VuZFdvcmtlciA9IGZ1bmN0aW9uICh0YXNrLCBpbnRlcnZhbCkge1xuXG5cdGlmIChJbnN0YW5jZVJlY29yZFF1ZXVlLmRlYnVnKSB7XG5cdFx0Y29uc29sZS5sb2coJ0luc3RhbmNlUmVjb3JkUXVldWU6IFNlbmQgd29ya2VyIHN0YXJ0ZWQsIHVzaW5nIGludGVydmFsOiAnICsgaW50ZXJ2YWwpO1xuXHR9XG5cblx0cmV0dXJuIE1ldGVvci5zZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG5cdFx0dHJ5IHtcblx0XHRcdHRhc2soKTtcblx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0Y29uc29sZS5sb2coJ0luc3RhbmNlUmVjb3JkUXVldWU6IEVycm9yIHdoaWxlIHNlbmRpbmc6ICcgKyBlcnJvci5tZXNzYWdlKTtcblx0XHR9XG5cdH0sIGludGVydmFsKTtcbn07XG5cbi8qXG5cdG9wdGlvbnM6IHtcblx0XHQvLyBDb250cm9scyB0aGUgc2VuZGluZyBpbnRlcnZhbFxuXHRcdHNlbmRJbnRlcnZhbDogTWF0Y2guT3B0aW9uYWwoTnVtYmVyKSxcblx0XHQvLyBDb250cm9scyB0aGUgc2VuZGluZyBiYXRjaCBzaXplIHBlciBpbnRlcnZhbFxuXHRcdHNlbmRCYXRjaFNpemU6IE1hdGNoLk9wdGlvbmFsKE51bWJlciksXG5cdFx0Ly8gQWxsb3cgb3B0aW9uYWwga2VlcGluZyBub3RpZmljYXRpb25zIGluIGNvbGxlY3Rpb25cblx0XHRrZWVwRG9jczogTWF0Y2guT3B0aW9uYWwoQm9vbGVhbilcblx0fVxuKi9cbkluc3RhbmNlUmVjb3JkUXVldWUuQ29uZmlndXJlID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcblx0dmFyIHNlbGYgPSB0aGlzO1xuXHRvcHRpb25zID0gXy5leHRlbmQoe1xuXHRcdHNlbmRUaW1lb3V0OiA2MDAwMCwgLy8gVGltZW91dCBwZXJpb2Rcblx0fSwgb3B0aW9ucyk7XG5cblx0Ly8gQmxvY2sgbXVsdGlwbGUgY2FsbHNcblx0aWYgKGlzQ29uZmlndXJlZCkge1xuXHRcdHRocm93IG5ldyBFcnJvcignSW5zdGFuY2VSZWNvcmRRdWV1ZS5Db25maWd1cmUgc2hvdWxkIG5vdCBiZSBjYWxsZWQgbW9yZSB0aGFuIG9uY2UhJyk7XG5cdH1cblxuXHRpc0NvbmZpZ3VyZWQgPSB0cnVlO1xuXG5cdC8vIEFkZCBkZWJ1ZyBpbmZvXG5cdGlmIChJbnN0YW5jZVJlY29yZFF1ZXVlLmRlYnVnKSB7XG5cdFx0Y29uc29sZS5sb2coJ0luc3RhbmNlUmVjb3JkUXVldWUuQ29uZmlndXJlJywgb3B0aW9ucyk7XG5cdH1cblxuXHRzZWxmLnN5bmNBdHRhY2ggPSBmdW5jdGlvbiAoc3luY19hdHRhY2htZW50LCBpbnNJZCwgc3BhY2VJZCwgbmV3UmVjb3JkSWQsIG9iamVjdE5hbWUpIHtcblx0XHRpZiAoc3luY19hdHRhY2htZW50ID09IFwibGFzdGVzdFwiKSB7XG5cdFx0XHRjZnMuaW5zdGFuY2VzLmZpbmQoe1xuXHRcdFx0XHQnbWV0YWRhdGEuaW5zdGFuY2UnOiBpbnNJZCxcblx0XHRcdFx0J21ldGFkYXRhLmN1cnJlbnQnOiB0cnVlXG5cdFx0XHR9KS5mb3JFYWNoKGZ1bmN0aW9uIChmKSB7XG5cdFx0XHRcdHZhciBuZXdGaWxlID0gbmV3IEZTLkZpbGUoKSxcblx0XHRcdFx0XHRjbXNGaWxlSWQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2Ntc19maWxlcycpLl9tYWtlTmV3SUQoKTtcblxuXHRcdFx0XHRuZXdGaWxlLmF0dGFjaERhdGEoZi5jcmVhdGVSZWFkU3RyZWFtKCdpbnN0YW5jZXMnKSwge1xuXHRcdFx0XHRcdHR5cGU6IGYub3JpZ2luYWwudHlwZVxuXHRcdFx0XHR9LCBmdW5jdGlvbiAoZXJyKSB7XG5cdFx0XHRcdFx0aWYgKGVycikge1xuXHRcdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcihlcnIuZXJyb3IsIGVyci5yZWFzb24pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRuZXdGaWxlLm5hbWUoZi5uYW1lKCkpO1xuXHRcdFx0XHRcdG5ld0ZpbGUuc2l6ZShmLnNpemUoKSk7XG5cdFx0XHRcdFx0dmFyIG1ldGFkYXRhID0ge1xuXHRcdFx0XHRcdFx0b3duZXI6IGYubWV0YWRhdGEub3duZXIsXG5cdFx0XHRcdFx0XHRvd25lcl9uYW1lOiBmLm1ldGFkYXRhLm93bmVyX25hbWUsXG5cdFx0XHRcdFx0XHRzcGFjZTogc3BhY2VJZCxcblx0XHRcdFx0XHRcdHJlY29yZF9pZDogbmV3UmVjb3JkSWQsXG5cdFx0XHRcdFx0XHRvYmplY3RfbmFtZTogb2JqZWN0TmFtZSxcblx0XHRcdFx0XHRcdHBhcmVudDogY21zRmlsZUlkXG5cdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdG5ld0ZpbGUubWV0YWRhdGEgPSBtZXRhZGF0YTtcblx0XHRcdFx0XHR2YXIgZmlsZU9iaiA9IGNmcy5maWxlcy5pbnNlcnQobmV3RmlsZSk7XG5cdFx0XHRcdFx0aWYgKGZpbGVPYmopIHtcblx0XHRcdFx0XHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbignY21zX2ZpbGVzJykuaW5zZXJ0KHtcblx0XHRcdFx0XHRcdFx0X2lkOiBjbXNGaWxlSWQsXG5cdFx0XHRcdFx0XHRcdHBhcmVudDoge1xuXHRcdFx0XHRcdFx0XHRcdG86IG9iamVjdE5hbWUsXG5cdFx0XHRcdFx0XHRcdFx0aWRzOiBbbmV3UmVjb3JkSWRdXG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdHNpemU6IGZpbGVPYmouc2l6ZSgpLFxuXHRcdFx0XHRcdFx0XHRuYW1lOiBmaWxlT2JqLm5hbWUoKSxcblx0XHRcdFx0XHRcdFx0ZXh0ZW50aW9uOiBmaWxlT2JqLmV4dGVuc2lvbigpLFxuXHRcdFx0XHRcdFx0XHRzcGFjZTogc3BhY2VJZCxcblx0XHRcdFx0XHRcdFx0dmVyc2lvbnM6IFtmaWxlT2JqLl9pZF0sXG5cdFx0XHRcdFx0XHRcdG93bmVyOiBmLm1ldGFkYXRhLm93bmVyLFxuXHRcdFx0XHRcdFx0XHRjcmVhdGVkX2J5OiBmLm1ldGFkYXRhLm93bmVyLFxuXHRcdFx0XHRcdFx0XHRtb2RpZmllZF9ieTogZi5tZXRhZGF0YS5vd25lclxuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pXG5cdFx0XHR9KVxuXHRcdH0gZWxzZSBpZiAoc3luY19hdHRhY2htZW50ID09IFwiYWxsXCIpIHtcblx0XHRcdHZhciBwYXJlbnRzID0gW107XG5cdFx0XHRjZnMuaW5zdGFuY2VzLmZpbmQoe1xuXHRcdFx0XHQnbWV0YWRhdGEuaW5zdGFuY2UnOiBpbnNJZFxuXHRcdFx0fSkuZm9yRWFjaChmdW5jdGlvbiAoZikge1xuXHRcdFx0XHR2YXIgbmV3RmlsZSA9IG5ldyBGUy5GaWxlKCksXG5cdFx0XHRcdFx0Y21zRmlsZUlkID0gZi5tZXRhZGF0YS5wYXJlbnQ7XG5cblx0XHRcdFx0aWYgKCFwYXJlbnRzLmluY2x1ZGVzKGNtc0ZpbGVJZCkpIHtcblx0XHRcdFx0XHRwYXJlbnRzLnB1c2goY21zRmlsZUlkKTtcblx0XHRcdFx0XHRDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2Ntc19maWxlcycpLmluc2VydCh7XG5cdFx0XHRcdFx0XHRfaWQ6IGNtc0ZpbGVJZCxcblx0XHRcdFx0XHRcdHBhcmVudDoge1xuXHRcdFx0XHRcdFx0XHRvOiBvYmplY3ROYW1lLFxuXHRcdFx0XHRcdFx0XHRpZHM6IFtuZXdSZWNvcmRJZF1cblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRzcGFjZTogc3BhY2VJZCxcblx0XHRcdFx0XHRcdHZlcnNpb25zOiBbXSxcblx0XHRcdFx0XHRcdG93bmVyOiBmLm1ldGFkYXRhLm93bmVyLFxuXHRcdFx0XHRcdFx0Y3JlYXRlZF9ieTogZi5tZXRhZGF0YS5vd25lcixcblx0XHRcdFx0XHRcdG1vZGlmaWVkX2J5OiBmLm1ldGFkYXRhLm93bmVyXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0fVxuXG5cdFx0XHRcdG5ld0ZpbGUuYXR0YWNoRGF0YShmLmNyZWF0ZVJlYWRTdHJlYW0oJ2luc3RhbmNlcycpLCB7XG5cdFx0XHRcdFx0dHlwZTogZi5vcmlnaW5hbC50eXBlXG5cdFx0XHRcdH0sIGZ1bmN0aW9uIChlcnIpIHtcblx0XHRcdFx0XHRpZiAoZXJyKSB7XG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKGVyci5lcnJvciwgZXJyLnJlYXNvbik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdG5ld0ZpbGUubmFtZShmLm5hbWUoKSk7XG5cdFx0XHRcdFx0bmV3RmlsZS5zaXplKGYuc2l6ZSgpKTtcblx0XHRcdFx0XHR2YXIgbWV0YWRhdGEgPSB7XG5cdFx0XHRcdFx0XHRvd25lcjogZi5tZXRhZGF0YS5vd25lcixcblx0XHRcdFx0XHRcdG93bmVyX25hbWU6IGYubWV0YWRhdGEub3duZXJfbmFtZSxcblx0XHRcdFx0XHRcdHNwYWNlOiBzcGFjZUlkLFxuXHRcdFx0XHRcdFx0cmVjb3JkX2lkOiBuZXdSZWNvcmRJZCxcblx0XHRcdFx0XHRcdG9iamVjdF9uYW1lOiBvYmplY3ROYW1lLFxuXHRcdFx0XHRcdFx0cGFyZW50OiBjbXNGaWxlSWRcblx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0bmV3RmlsZS5tZXRhZGF0YSA9IG1ldGFkYXRhO1xuXHRcdFx0XHRcdHZhciBmaWxlT2JqID0gY2ZzLmZpbGVzLmluc2VydChuZXdGaWxlKTtcblx0XHRcdFx0XHRpZiAoZmlsZU9iaikge1xuXG5cdFx0XHRcdFx0XHRpZiAoZi5tZXRhZGF0YS5jdXJyZW50ID09IHRydWUpIHtcblx0XHRcdFx0XHRcdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKCdjbXNfZmlsZXMnKS51cGRhdGUoY21zRmlsZUlkLCB7XG5cdFx0XHRcdFx0XHRcdFx0JHNldDoge1xuXHRcdFx0XHRcdFx0XHRcdFx0c2l6ZTogZmlsZU9iai5zaXplKCksXG5cdFx0XHRcdFx0XHRcdFx0XHRuYW1lOiBmaWxlT2JqLm5hbWUoKSxcblx0XHRcdFx0XHRcdFx0XHRcdGV4dGVudGlvbjogZmlsZU9iai5leHRlbnNpb24oKSxcblx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdCRhZGRUb1NldDoge1xuXHRcdFx0XHRcdFx0XHRcdFx0dmVyc2lvbnM6IGZpbGVPYmouX2lkXG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKCdjbXNfZmlsZXMnKS51cGRhdGUoY21zRmlsZUlkLCB7XG5cdFx0XHRcdFx0XHRcdFx0JGFkZFRvU2V0OiB7XG5cdFx0XHRcdFx0XHRcdFx0XHR2ZXJzaW9uczogZmlsZU9iai5faWRcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KVxuXHRcdFx0fSlcblx0XHR9XG5cdH1cblxuXHRzZWxmLnN5bmNJbnNGaWVsZHMgPSBbJ25hbWUnLCAnc3VibWl0dGVyX25hbWUnLCAnYXBwbGljYW50X25hbWUnLCAnYXBwbGljYW50X29yZ2FuaXphdGlvbl9uYW1lJywgJ2FwcGxpY2FudF9vcmdhbml6YXRpb25fZnVsbG5hbWUnLCAnc3RhdGUnLFxuXHRcdCdjdXJyZW50X3N0ZXBfbmFtZScsICdmbG93X25hbWUnLCAnY2F0ZWdvcnlfbmFtZScsICdzdWJtaXRfZGF0ZScsICdmaW5pc2hfZGF0ZScsICdmaW5hbF9kZWNpc2lvbicsICdhcHBsaWNhbnRfb3JnYW5pemF0aW9uJywgJ2FwcGxpY2FudF9jb21wYW55J1xuXHRdO1xuXHRzZWxmLnN5bmNWYWx1ZXMgPSBmdW5jdGlvbiAoZmllbGRfbWFwX2JhY2ssIHZhbHVlcywgaW5zLCBvYmplY3RJbmZvLCBmaWVsZF9tYXBfYmFja19zY3JpcHQsIHJlY29yZCkge1xuXHRcdHZhclxuXHRcdFx0b2JqID0ge30sXG5cdFx0XHR0YWJsZUZpZWxkQ29kZXMgPSBbXSxcblx0XHRcdHRhYmxlRmllbGRNYXAgPSBbXTtcblxuXHRcdGZpZWxkX21hcF9iYWNrID0gZmllbGRfbWFwX2JhY2sgfHwgW107XG5cblx0XHR2YXIgc3BhY2VJZCA9IGlucy5zcGFjZTtcblxuXHRcdHZhciBmb3JtID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwiZm9ybXNcIikuZmluZE9uZShpbnMuZm9ybSk7XG5cdFx0dmFyIGZvcm1GaWVsZHMgPSBudWxsO1xuXHRcdGlmIChmb3JtLmN1cnJlbnQuX2lkID09PSBpbnMuZm9ybV92ZXJzaW9uKSB7XG5cdFx0XHRmb3JtRmllbGRzID0gZm9ybS5jdXJyZW50LmZpZWxkcyB8fCBbXTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dmFyIGZvcm1WZXJzaW9uID0gXy5maW5kKGZvcm0uaGlzdG9yeXMsIGZ1bmN0aW9uIChoKSB7XG5cdFx0XHRcdHJldHVybiBoLl9pZCA9PT0gaW5zLmZvcm1fdmVyc2lvbjtcblx0XHRcdH0pXG5cdFx0XHRmb3JtRmllbGRzID0gZm9ybVZlcnNpb24gPyBmb3JtVmVyc2lvbi5maWVsZHMgOiBbXTtcblx0XHR9XG5cblx0XHR2YXIgb2JqZWN0RmllbGRzID0gb2JqZWN0SW5mby5maWVsZHM7XG5cdFx0dmFyIG9iamVjdEZpZWxkS2V5cyA9IF8ua2V5cyhvYmplY3RGaWVsZHMpO1xuXG5cdFx0ZmllbGRfbWFwX2JhY2suZm9yRWFjaChmdW5jdGlvbiAoZm0pIHtcblx0XHRcdC8vIOWIpOaWreaYr+WQpuaYr+WtkOihqOWtl+autVxuXHRcdFx0aWYgKGZtLndvcmtmbG93X2ZpZWxkLmluZGV4T2YoJy4kLicpID4gMCAmJiBmbS5vYmplY3RfZmllbGQuaW5kZXhPZignLiQuJykgPiAwKSB7XG5cdFx0XHRcdHZhciB3VGFibGVDb2RlID0gZm0ud29ya2Zsb3dfZmllbGQuc3BsaXQoJy4kLicpWzBdO1xuXHRcdFx0XHR2YXIgb1RhYmxlQ29kZSA9IGZtLm9iamVjdF9maWVsZC5zcGxpdCgnLiQuJylbMF07XG5cdFx0XHRcdGlmICh2YWx1ZXMuaGFzT3duUHJvcGVydHkod1RhYmxlQ29kZSkgJiYgXy5pc0FycmF5KHZhbHVlc1t3VGFibGVDb2RlXSkpIHtcblx0XHRcdFx0XHR0YWJsZUZpZWxkQ29kZXMucHVzaChKU09OLnN0cmluZ2lmeSh7XG5cdFx0XHRcdFx0XHR3b3JrZmxvd190YWJsZV9maWVsZF9jb2RlOiB3VGFibGVDb2RlLFxuXHRcdFx0XHRcdFx0b2JqZWN0X3RhYmxlX2ZpZWxkX2NvZGU6IG9UYWJsZUNvZGVcblx0XHRcdFx0XHR9KSk7XG5cdFx0XHRcdFx0dGFibGVGaWVsZE1hcC5wdXNoKGZtKTtcblx0XHRcdFx0fVxuXG5cdFx0XHR9IGVsc2UgaWYgKHZhbHVlcy5oYXNPd25Qcm9wZXJ0eShmbS53b3JrZmxvd19maWVsZCkpIHtcblx0XHRcdFx0dmFyIHdGaWVsZCA9IG51bGw7XG5cblx0XHRcdFx0Xy5lYWNoKGZvcm1GaWVsZHMsIGZ1bmN0aW9uIChmZikge1xuXHRcdFx0XHRcdGlmICghd0ZpZWxkKSB7XG5cdFx0XHRcdFx0XHRpZiAoZmYuY29kZSA9PT0gZm0ud29ya2Zsb3dfZmllbGQpIHtcblx0XHRcdFx0XHRcdFx0d0ZpZWxkID0gZmY7XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGZmLnR5cGUgPT09ICdzZWN0aW9uJykge1xuXHRcdFx0XHRcdFx0XHRfLmVhY2goZmYuZmllbGRzLCBmdW5jdGlvbiAoZikge1xuXHRcdFx0XHRcdFx0XHRcdGlmICghd0ZpZWxkKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoZi5jb2RlID09PSBmbS53b3JrZmxvd19maWVsZCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR3RmllbGQgPSBmO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pXG5cblx0XHRcdFx0dmFyIG9GaWVsZCA9IG9iamVjdEZpZWxkc1tmbS5vYmplY3RfZmllbGRdO1xuXG5cdFx0XHRcdGlmIChvRmllbGQpIHtcblx0XHRcdFx0XHRpZiAoIXdGaWVsZCkge1xuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coJ2ZtLndvcmtmbG93X2ZpZWxkOiAnLCBmbS53b3JrZmxvd19maWVsZClcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Ly8g6KGo5Y2V6YCJ5Lq66YCJ57uE5a2X5q61IOiHsyDlr7nosaEgbG9va3VwIG1hc3Rlcl9kZXRhaWznsbvlnovlrZfmrrXlkIzmraVcblx0XHRcdFx0XHRpZiAoIXdGaWVsZC5pc19tdWx0aXNlbGVjdCAmJiBbJ3VzZXInLCAnZ3JvdXAnXS5pbmNsdWRlcyh3RmllbGQudHlwZSkgJiYgIW9GaWVsZC5tdWx0aXBsZSAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMob0ZpZWxkLnR5cGUpICYmIFsndXNlcnMnLCAnb3JnYW5pemF0aW9ucyddLmluY2x1ZGVzKG9GaWVsZC5yZWZlcmVuY2VfdG8pKSB7XG5cdFx0XHRcdFx0XHRvYmpbZm0ub2JqZWN0X2ZpZWxkXSA9IHZhbHVlc1tmbS53b3JrZmxvd19maWVsZF1bJ2lkJ107XG5cdFx0XHRcdFx0fSBlbHNlIGlmICghb0ZpZWxkLm11bHRpcGxlICYmIFsnbG9va3VwJywgJ21hc3Rlcl9kZXRhaWwnXS5pbmNsdWRlcyhvRmllbGQudHlwZSkgJiYgXy5pc1N0cmluZyhvRmllbGQucmVmZXJlbmNlX3RvKSAmJiBfLmlzU3RyaW5nKHZhbHVlc1tmbS53b3JrZmxvd19maWVsZF0pKSB7XG5cdFx0XHRcdFx0XHR2YXIgb0NvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob0ZpZWxkLnJlZmVyZW5jZV90bywgc3BhY2VJZClcblx0XHRcdFx0XHRcdHZhciByZWZlck9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9GaWVsZC5yZWZlcmVuY2VfdG8sIHNwYWNlSWQpXG5cdFx0XHRcdFx0XHRpZiAob0NvbGxlY3Rpb24gJiYgcmVmZXJPYmplY3QpIHtcblx0XHRcdFx0XHRcdFx0Ly8g5YWI6K6k5Li65q2k5YC85pivcmVmZXJPYmplY3QgX2lk5a2X5q615YC8XG5cdFx0XHRcdFx0XHRcdHZhciByZWZlckRhdGEgPSBvQ29sbGVjdGlvbi5maW5kT25lKHZhbHVlc1tmbS53b3JrZmxvd19maWVsZF0sIHtcblx0XHRcdFx0XHRcdFx0XHRmaWVsZHM6IHtcblx0XHRcdFx0XHRcdFx0XHRcdF9pZDogMVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdGlmIChyZWZlckRhdGEpIHtcblx0XHRcdFx0XHRcdFx0XHRvYmpbZm0ub2JqZWN0X2ZpZWxkXSA9IHJlZmVyRGF0YS5faWQ7XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHQvLyDlhbbmrKHorqTkuLrmraTlgLzmmK9yZWZlck9iamVjdCBOQU1FX0ZJRUxEX0tFWeWAvFxuXHRcdFx0XHRcdFx0XHRpZiAoIXJlZmVyRGF0YSkge1xuXHRcdFx0XHRcdFx0XHRcdHZhciBuYW1lRmllbGRLZXkgPSByZWZlck9iamVjdC5OQU1FX0ZJRUxEX0tFWTtcblx0XHRcdFx0XHRcdFx0XHR2YXIgc2VsZWN0b3IgPSB7fTtcblx0XHRcdFx0XHRcdFx0XHRzZWxlY3RvcltuYW1lRmllbGRLZXldID0gdmFsdWVzW2ZtLndvcmtmbG93X2ZpZWxkXTtcblx0XHRcdFx0XHRcdFx0XHRyZWZlckRhdGEgPSBvQ29sbGVjdGlvbi5maW5kT25lKHNlbGVjdG9yLCB7XG5cdFx0XHRcdFx0XHRcdFx0XHRmaWVsZHM6IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0X2lkOiAxXG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKHJlZmVyRGF0YSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0b2JqW2ZtLm9iamVjdF9maWVsZF0gPSByZWZlckRhdGEuX2lkO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGlmIChvRmllbGQudHlwZSA9PT0gXCJib29sZWFuXCIpIHtcblx0XHRcdFx0XHRcdFx0dmFyIHRtcF9maWVsZF92YWx1ZSA9IHZhbHVlc1tmbS53b3JrZmxvd19maWVsZF07XG5cdFx0XHRcdFx0XHRcdGlmIChbJ3RydWUnLCAn5pivJ10uaW5jbHVkZXModG1wX2ZpZWxkX3ZhbHVlKSkge1xuXHRcdFx0XHRcdFx0XHRcdG9ialtmbS5vYmplY3RfZmllbGRdID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmIChbJ2ZhbHNlJywgJ+WQpiddLmluY2x1ZGVzKHRtcF9maWVsZF92YWx1ZSkpIHtcblx0XHRcdFx0XHRcdFx0XHRvYmpbZm0ub2JqZWN0X2ZpZWxkXSA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdG9ialtmbS5vYmplY3RfZmllbGRdID0gdG1wX2ZpZWxkX3ZhbHVlO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRvYmpbZm0ub2JqZWN0X2ZpZWxkXSA9IHZhbHVlc1tmbS53b3JrZmxvd19maWVsZF07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGlmIChmbS5vYmplY3RfZmllbGQuaW5kZXhPZignLicpID4gLTEpIHtcblx0XHRcdFx0XHRcdHZhciB0ZW1PYmpGaWVsZHMgPSBmbS5vYmplY3RfZmllbGQuc3BsaXQoJy4nKTtcblx0XHRcdFx0XHRcdGlmICh0ZW1PYmpGaWVsZHMubGVuZ3RoID09PSAyKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBvYmpGaWVsZCA9IHRlbU9iakZpZWxkc1swXTtcblx0XHRcdFx0XHRcdFx0dmFyIHJlZmVyT2JqRmllbGQgPSB0ZW1PYmpGaWVsZHNbMV07XG5cdFx0XHRcdFx0XHRcdHZhciBvRmllbGQgPSBvYmplY3RGaWVsZHNbb2JqRmllbGRdO1xuXHRcdFx0XHRcdFx0XHRpZiAoIW9GaWVsZC5tdWx0aXBsZSAmJiBbJ2xvb2t1cCcsICdtYXN0ZXJfZGV0YWlsJ10uaW5jbHVkZXMob0ZpZWxkLnR5cGUpICYmIF8uaXNTdHJpbmcob0ZpZWxkLnJlZmVyZW5jZV90bykpIHtcblx0XHRcdFx0XHRcdFx0XHR2YXIgb0NvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob0ZpZWxkLnJlZmVyZW5jZV90bywgc3BhY2VJZClcblx0XHRcdFx0XHRcdFx0XHRpZiAob0NvbGxlY3Rpb24gJiYgcmVjb3JkICYmIHJlY29yZFtvYmpGaWVsZF0pIHtcblx0XHRcdFx0XHRcdFx0XHRcdHZhciByZWZlclNldE9iaiA9IHt9O1xuXHRcdFx0XHRcdFx0XHRcdFx0cmVmZXJTZXRPYmpbcmVmZXJPYmpGaWVsZF0gPSB2YWx1ZXNbZm0ud29ya2Zsb3dfZmllbGRdO1xuXHRcdFx0XHRcdFx0XHRcdFx0b0NvbGxlY3Rpb24udXBkYXRlKHJlY29yZFtvYmpGaWVsZF0sIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0JHNldDogcmVmZXJTZXRPYmpcblx0XHRcdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlmIChmbS53b3JrZmxvd19maWVsZC5zdGFydHNXaXRoKCdpbnN0YW5jZS4nKSkge1xuXHRcdFx0XHRcdHZhciBpbnNGaWVsZCA9IGZtLndvcmtmbG93X2ZpZWxkLnNwbGl0KCdpbnN0YW5jZS4nKVsxXTtcblx0XHRcdFx0XHRpZiAoc2VsZi5zeW5jSW5zRmllbGRzLmluY2x1ZGVzKGluc0ZpZWxkKSkge1xuXHRcdFx0XHRcdFx0aWYgKGZtLm9iamVjdF9maWVsZC5pbmRleE9mKCcuJykgPCAwKSB7XG5cdFx0XHRcdFx0XHRcdG9ialtmbS5vYmplY3RfZmllbGRdID0gaW5zW2luc0ZpZWxkXTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHZhciB0ZW1PYmpGaWVsZHMgPSBmbS5vYmplY3RfZmllbGQuc3BsaXQoJy4nKTtcblx0XHRcdFx0XHRcdFx0aWYgKHRlbU9iakZpZWxkcy5sZW5ndGggPT09IDIpIHtcblx0XHRcdFx0XHRcdFx0XHR2YXIgb2JqRmllbGQgPSB0ZW1PYmpGaWVsZHNbMF07XG5cdFx0XHRcdFx0XHRcdFx0dmFyIHJlZmVyT2JqRmllbGQgPSB0ZW1PYmpGaWVsZHNbMV07XG5cdFx0XHRcdFx0XHRcdFx0dmFyIG9GaWVsZCA9IG9iamVjdEZpZWxkc1tvYmpGaWVsZF07XG5cdFx0XHRcdFx0XHRcdFx0aWYgKCFvRmllbGQubXVsdGlwbGUgJiYgWydsb29rdXAnLCAnbWFzdGVyX2RldGFpbCddLmluY2x1ZGVzKG9GaWVsZC50eXBlKSAmJiBfLmlzU3RyaW5nKG9GaWVsZC5yZWZlcmVuY2VfdG8pKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR2YXIgb0NvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob0ZpZWxkLnJlZmVyZW5jZV90bywgc3BhY2VJZClcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChvQ29sbGVjdGlvbiAmJiByZWNvcmQgJiYgcmVjb3JkW29iakZpZWxkXSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR2YXIgcmVmZXJTZXRPYmogPSB7fTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmVmZXJTZXRPYmpbcmVmZXJPYmpGaWVsZF0gPSBpbnNbaW5zRmllbGRdO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRvQ29sbGVjdGlvbi51cGRhdGUocmVjb3JkW29iakZpZWxkXSwge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdCRzZXQ6IHJlZmVyU2V0T2JqXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0aWYgKGluc1tmbS53b3JrZmxvd19maWVsZF0pIHtcblx0XHRcdFx0XHRcdG9ialtmbS5vYmplY3RfZmllbGRdID0gaW5zW2ZtLndvcmtmbG93X2ZpZWxkXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KVxuXG5cdFx0Xy51bmlxKHRhYmxlRmllbGRDb2RlcykuZm9yRWFjaChmdW5jdGlvbiAodGZjKSB7XG5cdFx0XHR2YXIgYyA9IEpTT04ucGFyc2UodGZjKTtcblx0XHRcdG9ialtjLm9iamVjdF90YWJsZV9maWVsZF9jb2RlXSA9IFtdO1xuXHRcdFx0dmFsdWVzW2Mud29ya2Zsb3dfdGFibGVfZmllbGRfY29kZV0uZm9yRWFjaChmdW5jdGlvbiAodHIpIHtcblx0XHRcdFx0dmFyIG5ld1RyID0ge307XG5cdFx0XHRcdF8uZWFjaCh0ciwgZnVuY3Rpb24gKHYsIGspIHtcblx0XHRcdFx0XHR0YWJsZUZpZWxkTWFwLmZvckVhY2goZnVuY3Rpb24gKHRmbSkge1xuXHRcdFx0XHRcdFx0aWYgKHRmbS53b3JrZmxvd19maWVsZCA9PSAoYy53b3JrZmxvd190YWJsZV9maWVsZF9jb2RlICsgJy4kLicgKyBrKSkge1xuXHRcdFx0XHRcdFx0XHR2YXIgb1RkQ29kZSA9IHRmbS5vYmplY3RfZmllbGQuc3BsaXQoJy4kLicpWzFdO1xuXHRcdFx0XHRcdFx0XHRuZXdUcltvVGRDb2RlXSA9IHY7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0fSlcblx0XHRcdFx0aWYgKCFfLmlzRW1wdHkobmV3VHIpKSB7XG5cdFx0XHRcdFx0b2JqW2Mub2JqZWN0X3RhYmxlX2ZpZWxkX2NvZGVdLnB1c2gobmV3VHIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdH0pXG5cblxuXG5cdFx0aWYgKGZpZWxkX21hcF9iYWNrX3NjcmlwdCkge1xuXHRcdFx0Xy5leHRlbmQob2JqLCBzZWxmLmV2YWxGaWVsZE1hcEJhY2tTY3JpcHQoZmllbGRfbWFwX2JhY2tfc2NyaXB0LCBpbnMpKTtcblx0XHR9XG5cblx0XHQvLyDov4fmu6TmjonpnZ7ms5XnmoRrZXlcblx0XHR2YXIgZmlsdGVyT2JqID0ge307XG5cdFx0Xy5lYWNoKF8ua2V5cyhvYmopLCBmdW5jdGlvbiAoaykge1xuXHRcdFx0aWYgKG9iamVjdEZpZWxkS2V5cy5pbmNsdWRlcyhrKSkge1xuXHRcdFx0XHRmaWx0ZXJPYmpba10gPSBvYmpba107XG5cdFx0XHR9XG5cdFx0fSlcblxuXHRcdHJldHVybiBmaWx0ZXJPYmo7XG5cdH1cblxuXHRzZWxmLmV2YWxGaWVsZE1hcEJhY2tTY3JpcHQgPSBmdW5jdGlvbiAoZmllbGRfbWFwX2JhY2tfc2NyaXB0LCBpbnMpIHtcblx0XHR2YXIgc2NyaXB0ID0gXCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpbnN0YW5jZSkgeyBcIiArIGZpZWxkX21hcF9iYWNrX3NjcmlwdCArIFwiIH1cIjtcblx0XHR2YXIgZnVuYyA9IF9ldmFsKHNjcmlwdCwgXCJmaWVsZF9tYXBfc2NyaXB0XCIpO1xuXHRcdHZhciB2YWx1ZXMgPSBmdW5jKGlucyk7XG5cdFx0aWYgKF8uaXNPYmplY3QodmFsdWVzKSkge1xuXHRcdFx0cmV0dXJuIHZhbHVlcztcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc29sZS5lcnJvcihcImV2YWxGaWVsZE1hcEJhY2tTY3JpcHQ6IOiEmuacrOi/lOWbnuWAvOexu+Wei+S4jeaYr+WvueixoVwiKTtcblx0XHR9XG5cdFx0cmV0dXJuIHt9XG5cdH1cblxuXHRzZWxmLnNlbmREb2MgPSBmdW5jdGlvbiAoZG9jKSB7XG5cdFx0aWYgKEluc3RhbmNlUmVjb3JkUXVldWUuZGVidWcpIHtcblx0XHRcdGNvbnNvbGUubG9nKFwic2VuZERvY1wiKTtcblx0XHRcdGNvbnNvbGUubG9nKGRvYyk7XG5cdFx0fVxuXG5cdFx0dmFyIGluc0lkID0gZG9jLmluZm8uaW5zdGFuY2VfaWQsXG5cdFx0XHRyZWNvcmRzID0gZG9jLmluZm8ucmVjb3Jkcztcblx0XHR2YXIgZmllbGRzID0ge1xuXHRcdFx0ZmxvdzogMSxcblx0XHRcdHZhbHVlczogMSxcblx0XHRcdGFwcGxpY2FudDogMSxcblx0XHRcdHNwYWNlOiAxLFxuXHRcdFx0Zm9ybTogMSxcblx0XHRcdGZvcm1fdmVyc2lvbjogMVxuXHRcdH07XG5cdFx0c2VsZi5zeW5jSW5zRmllbGRzLmZvckVhY2goZnVuY3Rpb24gKGYpIHtcblx0XHRcdGZpZWxkc1tmXSA9IDE7XG5cdFx0fSlcblx0XHR2YXIgaW5zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdpbnN0YW5jZXMnKS5maW5kT25lKGluc0lkLCB7XG5cdFx0XHRmaWVsZHM6IGZpZWxkc1xuXHRcdH0pO1xuXHRcdHZhciB2YWx1ZXMgPSBpbnMudmFsdWVzLFxuXHRcdFx0c3BhY2VJZCA9IGlucy5zcGFjZTtcblxuXHRcdGlmIChyZWNvcmRzICYmICFfLmlzRW1wdHkocmVjb3JkcykpIHtcblx0XHRcdC8vIOatpOaDheWGteWxnuS6juS7jmNyZWF0b3LkuK3lj5HotbflrqHmiblcblx0XHRcdHZhciBvYmplY3ROYW1lID0gcmVjb3Jkc1swXS5vO1xuXHRcdFx0dmFyIG93ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdvYmplY3Rfd29ya2Zsb3dzJykuZmluZE9uZSh7XG5cdFx0XHRcdG9iamVjdF9uYW1lOiBvYmplY3ROYW1lLFxuXHRcdFx0XHRmbG93X2lkOiBpbnMuZmxvd1xuXHRcdFx0fSk7XG5cdFx0XHR2YXJcblx0XHRcdFx0b2JqZWN0Q29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3ROYW1lLCBzcGFjZUlkKSxcblx0XHRcdFx0c3luY19hdHRhY2htZW50ID0gb3cuc3luY19hdHRhY2htZW50O1xuXHRcdFx0dmFyIG9iamVjdEluZm8gPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3ROYW1lLCBzcGFjZUlkKTtcblx0XHRcdG9iamVjdENvbGxlY3Rpb24uZmluZCh7XG5cdFx0XHRcdF9pZDoge1xuXHRcdFx0XHRcdCRpbjogcmVjb3Jkc1swXS5pZHNcblx0XHRcdFx0fVxuXHRcdFx0fSkuZm9yRWFjaChmdW5jdGlvbiAocmVjb3JkKSB7XG5cdFx0XHRcdC8vIOmZhOS7tuWQjOatpVxuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdHZhciBzZXRPYmogPSBzZWxmLnN5bmNWYWx1ZXMob3cuZmllbGRfbWFwX2JhY2ssIHZhbHVlcywgaW5zLCBvYmplY3RJbmZvLCBvdy5maWVsZF9tYXBfYmFja19zY3JpcHQsIHJlY29yZCk7XG5cdFx0XHRcdFx0c2V0T2JqLmxvY2tlZCA9IGZhbHNlO1xuXG5cdFx0XHRcdFx0dmFyIGluc3RhbmNlX3N0YXRlID0gaW5zLnN0YXRlO1xuXHRcdFx0XHRcdGlmIChpbnMuc3RhdGUgPT09ICdjb21wbGV0ZWQnICYmIGlucy5maW5hbF9kZWNpc2lvbikge1xuXHRcdFx0XHRcdFx0aW5zdGFuY2Vfc3RhdGUgPSBpbnMuZmluYWxfZGVjaXNpb247XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHNldE9ialsnaW5zdGFuY2VzLiQuc3RhdGUnXSA9IHNldE9iai5pbnN0YW5jZV9zdGF0ZSA9IGluc3RhbmNlX3N0YXRlO1xuXG5cdFx0XHRcdFx0b2JqZWN0Q29sbGVjdGlvbi51cGRhdGUoe1xuXHRcdFx0XHRcdFx0X2lkOiByZWNvcmQuX2lkLFxuXHRcdFx0XHRcdFx0J2luc3RhbmNlcy5faWQnOiBpbnNJZFxuXHRcdFx0XHRcdH0sIHtcblx0XHRcdFx0XHRcdCRzZXQ6IHNldE9ialxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0Ly8g5Lul5pyA57uI55Sz6K+35Y2V6ZmE5Lu25Li65YeG77yM5pen55qEcmVjb3Jk5Lit6ZmE5Lu25Yig6ZmkXG5cdFx0XHRcdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKCdjbXNfZmlsZXMnKS5yZW1vdmUoe1xuXHRcdFx0XHRcdFx0J3BhcmVudCc6IHtcblx0XHRcdFx0XHRcdFx0bzogb2JqZWN0TmFtZSxcblx0XHRcdFx0XHRcdFx0aWRzOiBbcmVjb3JkLl9pZF1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdGNmcy5maWxlcy5yZW1vdmUoe1xuXHRcdFx0XHRcdFx0J21ldGFkYXRhLnJlY29yZF9pZCc6IHJlY29yZC5faWRcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC8vIOWQjOatpeaWsOmZhOS7tlxuXHRcdFx0XHRcdHNlbGYuc3luY0F0dGFjaChzeW5jX2F0dGFjaG1lbnQsIGluc0lkLCByZWNvcmQuc3BhY2UsIHJlY29yZC5faWQsIG9iamVjdE5hbWUpO1xuXHRcdFx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoZXJyb3Iuc3RhY2spO1xuXHRcdFx0XHRcdG9iamVjdENvbGxlY3Rpb24udXBkYXRlKHtcblx0XHRcdFx0XHRcdF9pZDogcmVjb3JkLl9pZCxcblx0XHRcdFx0XHRcdCdpbnN0YW5jZXMuX2lkJzogaW5zSWRcblx0XHRcdFx0XHR9LCB7XG5cdFx0XHRcdFx0XHQkc2V0OiB7XG5cdFx0XHRcdFx0XHRcdCdpbnN0YW5jZXMuJC5zdGF0ZSc6ICdwZW5kaW5nJyxcblx0XHRcdFx0XHRcdFx0J2xvY2tlZCc6IHRydWUsXG5cdFx0XHRcdFx0XHRcdCdpbnN0YW5jZV9zdGF0ZSc6ICdwZW5kaW5nJ1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pXG5cblx0XHRcdFx0XHRDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2Ntc19maWxlcycpLnJlbW92ZSh7XG5cdFx0XHRcdFx0XHQncGFyZW50Jzoge1xuXHRcdFx0XHRcdFx0XHRvOiBvYmplY3ROYW1lLFxuXHRcdFx0XHRcdFx0XHRpZHM6IFtyZWNvcmQuX2lkXVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0Y2ZzLmZpbGVzLnJlbW92ZSh7XG5cdFx0XHRcdFx0XHQnbWV0YWRhdGEucmVjb3JkX2lkJzogcmVjb3JkLl9pZFxuXHRcdFx0XHRcdH0pXG5cblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoZXJyb3IpO1xuXHRcdFx0XHR9XG5cblx0XHRcdH0pXG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIOatpOaDheWGteWxnuS6juS7jmFwcHPkuK3lj5HotbflrqHmiblcblx0XHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbignb2JqZWN0X3dvcmtmbG93cycpLmZpbmQoe1xuXHRcdFx0XHRmbG93X2lkOiBpbnMuZmxvd1xuXHRcdFx0fSkuZm9yRWFjaChmdW5jdGlvbiAob3cpIHtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHR2YXJcblx0XHRcdFx0XHRcdG9iamVjdENvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob3cub2JqZWN0X25hbWUsIHNwYWNlSWQpLFxuXHRcdFx0XHRcdFx0c3luY19hdHRhY2htZW50ID0gb3cuc3luY19hdHRhY2htZW50LFxuXHRcdFx0XHRcdFx0bmV3UmVjb3JkSWQgPSBvYmplY3RDb2xsZWN0aW9uLl9tYWtlTmV3SUQoKSxcblx0XHRcdFx0XHRcdG9iamVjdE5hbWUgPSBvdy5vYmplY3RfbmFtZTtcblxuXHRcdFx0XHRcdHZhciBvYmplY3RJbmZvID0gQ3JlYXRvci5nZXRPYmplY3Qob3cub2JqZWN0X25hbWUsIHNwYWNlSWQpO1xuXG5cdFx0XHRcdFx0dmFyIG5ld09iaiA9IHNlbGYuc3luY1ZhbHVlcyhvdy5maWVsZF9tYXBfYmFjaywgdmFsdWVzLCBpbnMsIG9iamVjdEluZm8sIG93LmZpZWxkX21hcF9iYWNrX3NjcmlwdCk7XG5cblx0XHRcdFx0XHRuZXdPYmouX2lkID0gbmV3UmVjb3JkSWQ7XG5cdFx0XHRcdFx0bmV3T2JqLnNwYWNlID0gc3BhY2VJZDtcblx0XHRcdFx0XHRuZXdPYmoubmFtZSA9IG5ld09iai5uYW1lIHx8IGlucy5uYW1lO1xuXG5cdFx0XHRcdFx0dmFyIGluc3RhbmNlX3N0YXRlID0gaW5zLnN0YXRlO1xuXHRcdFx0XHRcdGlmIChpbnMuc3RhdGUgPT09ICdjb21wbGV0ZWQnICYmIGlucy5maW5hbF9kZWNpc2lvbikge1xuXHRcdFx0XHRcdFx0aW5zdGFuY2Vfc3RhdGUgPSBpbnMuZmluYWxfZGVjaXNpb247XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdG5ld09iai5pbnN0YW5jZXMgPSBbe1xuXHRcdFx0XHRcdFx0X2lkOiBpbnNJZCxcblx0XHRcdFx0XHRcdHN0YXRlOiBpbnN0YW5jZV9zdGF0ZVxuXHRcdFx0XHRcdH1dO1xuXHRcdFx0XHRcdG5ld09iai5pbnN0YW5jZV9zdGF0ZSA9IGluc3RhbmNlX3N0YXRlO1xuXG5cdFx0XHRcdFx0bmV3T2JqLm93bmVyID0gaW5zLmFwcGxpY2FudDtcblx0XHRcdFx0XHRuZXdPYmouY3JlYXRlZF9ieSA9IGlucy5hcHBsaWNhbnQ7XG5cdFx0XHRcdFx0bmV3T2JqLm1vZGlmaWVkX2J5ID0gaW5zLmFwcGxpY2FudDtcblx0XHRcdFx0XHR2YXIgciA9IG9iamVjdENvbGxlY3Rpb24uaW5zZXJ0KG5ld09iaik7XG5cdFx0XHRcdFx0aWYgKHIpIHtcblx0XHRcdFx0XHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbignaW5zdGFuY2VzJykudXBkYXRlKGlucy5faWQsIHtcblx0XHRcdFx0XHRcdFx0JHB1c2g6IHtcblx0XHRcdFx0XHRcdFx0XHRyZWNvcmRfaWRzOiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRvOiBvYmplY3ROYW1lLFxuXHRcdFx0XHRcdFx0XHRcdFx0aWRzOiBbbmV3UmVjb3JkSWRdXG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0Ly8gd29ya2Zsb3fph4zlj5HotbflrqHmibnlkI7vvIzlkIzmraXml7bkuZ/lj6/ku6Xkv67mlLnnm7jlhbPooajnmoTlrZfmrrXlgLwgIzExODNcblx0XHRcdFx0XHRcdHZhciByZWNvcmQgPSBvYmplY3RDb2xsZWN0aW9uLmZpbmRPbmUobmV3UmVjb3JkSWQpO1xuXHRcdFx0XHRcdFx0c2VsZi5zeW5jVmFsdWVzKG93LmZpZWxkX21hcF9iYWNrLCB2YWx1ZXMsIGlucywgb2JqZWN0SW5mbywgb3cuZmllbGRfbWFwX2JhY2tfc2NyaXB0LCByZWNvcmQpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIOmZhOS7tuWQjOatpVxuXHRcdFx0XHRcdHNlbGYuc3luY0F0dGFjaChzeW5jX2F0dGFjaG1lbnQsIGluc0lkLCBzcGFjZUlkLCBuZXdSZWNvcmRJZCwgb2JqZWN0TmFtZSk7XG5cblx0XHRcdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKGVycm9yLnN0YWNrKTtcblxuXHRcdFx0XHRcdG9iamVjdENvbGxlY3Rpb24ucmVtb3ZlKHtcblx0XHRcdFx0XHRcdF9pZDogbmV3UmVjb3JkSWQsXG5cdFx0XHRcdFx0XHRzcGFjZTogc3BhY2VJZFxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbignaW5zdGFuY2VzJykudXBkYXRlKGlucy5faWQsIHtcblx0XHRcdFx0XHRcdCRwdWxsOiB7XG5cdFx0XHRcdFx0XHRcdHJlY29yZF9pZHM6IHtcblx0XHRcdFx0XHRcdFx0XHRvOiBvYmplY3ROYW1lLFxuXHRcdFx0XHRcdFx0XHRcdGlkczogW25ld1JlY29yZElkXVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2Ntc19maWxlcycpLnJlbW92ZSh7XG5cdFx0XHRcdFx0XHQncGFyZW50Jzoge1xuXHRcdFx0XHRcdFx0XHRvOiBvYmplY3ROYW1lLFxuXHRcdFx0XHRcdFx0XHRpZHM6IFtuZXdSZWNvcmRJZF1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdGNmcy5maWxlcy5yZW1vdmUoe1xuXHRcdFx0XHRcdFx0J21ldGFkYXRhLnJlY29yZF9pZCc6IG5ld1JlY29yZElkXG5cdFx0XHRcdFx0fSlcblxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihlcnJvcik7XG5cdFx0XHRcdH1cblxuXHRcdFx0fSlcblx0XHR9XG5cblx0XHRJbnN0YW5jZVJlY29yZFF1ZXVlLmNvbGxlY3Rpb24udXBkYXRlKGRvYy5faWQsIHtcblx0XHRcdCRzZXQ6IHtcblx0XHRcdFx0J2luZm8uc3luY19kYXRlJzogbmV3IERhdGUoKVxuXHRcdFx0fVxuXHRcdH0pXG5cblx0fVxuXG5cdC8vIFVuaXZlcnNhbCBzZW5kIGZ1bmN0aW9uXG5cdHZhciBfcXVlcnlTZW5kID0gZnVuY3Rpb24gKGRvYykge1xuXG5cdFx0aWYgKHNlbGYuc2VuZERvYykge1xuXHRcdFx0c2VsZi5zZW5kRG9jKGRvYyk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHtcblx0XHRcdGRvYzogW2RvYy5faWRdXG5cdFx0fTtcblx0fTtcblxuXHRzZWxmLnNlcnZlclNlbmQgPSBmdW5jdGlvbiAoZG9jKSB7XG5cdFx0ZG9jID0gZG9jIHx8IHt9O1xuXHRcdHJldHVybiBfcXVlcnlTZW5kKGRvYyk7XG5cdH07XG5cblxuXHQvLyBUaGlzIGludGVydmFsIHdpbGwgYWxsb3cgb25seSBvbmUgZG9jIHRvIGJlIHNlbnQgYXQgYSB0aW1lLCBpdFxuXHQvLyB3aWxsIGNoZWNrIGZvciBuZXcgZG9jcyBhdCBldmVyeSBgb3B0aW9ucy5zZW5kSW50ZXJ2YWxgXG5cdC8vIChkZWZhdWx0IGludGVydmFsIGlzIDE1MDAwIG1zKVxuXHQvL1xuXHQvLyBJdCBsb29rcyBpbiBkb2NzIGNvbGxlY3Rpb24gdG8gc2VlIGlmIHRoZXJlcyBhbnkgcGVuZGluZ1xuXHQvLyBkb2NzLCBpZiBzbyBpdCB3aWxsIHRyeSB0byByZXNlcnZlIHRoZSBwZW5kaW5nIGRvYy5cblx0Ly8gSWYgc3VjY2Vzc2Z1bGx5IHJlc2VydmVkIHRoZSBzZW5kIGlzIHN0YXJ0ZWQuXG5cdC8vXG5cdC8vIElmIGRvYy5xdWVyeSBpcyB0eXBlIHN0cmluZywgaXQncyBhc3N1bWVkIHRvIGJlIGEganNvbiBzdHJpbmdcblx0Ly8gdmVyc2lvbiBvZiB0aGUgcXVlcnkgc2VsZWN0b3IuIE1ha2luZyBpdCBhYmxlIHRvIGNhcnJ5IGAkYCBwcm9wZXJ0aWVzIGluXG5cdC8vIHRoZSBtb25nbyBjb2xsZWN0aW9uLlxuXHQvL1xuXHQvLyBQci4gZGVmYXVsdCBkb2NzIGFyZSByZW1vdmVkIGZyb20gdGhlIGNvbGxlY3Rpb24gYWZ0ZXIgc2VuZCBoYXZlXG5cdC8vIGNvbXBsZXRlZC4gU2V0dGluZyBgb3B0aW9ucy5rZWVwRG9jc2Agd2lsbCB1cGRhdGUgYW5kIGtlZXAgdGhlXG5cdC8vIGRvYyBlZy4gaWYgbmVlZGVkIGZvciBoaXN0b3JpY2FsIHJlYXNvbnMuXG5cdC8vXG5cdC8vIEFmdGVyIHRoZSBzZW5kIGhhdmUgY29tcGxldGVkIGEgXCJzZW5kXCIgZXZlbnQgd2lsbCBiZSBlbWl0dGVkIHdpdGggYVxuXHQvLyBzdGF0dXMgb2JqZWN0IGNvbnRhaW5pbmcgZG9jIGlkIGFuZCB0aGUgc2VuZCByZXN1bHQgb2JqZWN0LlxuXHQvL1xuXHR2YXIgaXNTZW5kaW5nRG9jID0gZmFsc2U7XG5cblx0aWYgKG9wdGlvbnMuc2VuZEludGVydmFsICE9PSBudWxsKSB7XG5cblx0XHQvLyBUaGlzIHdpbGwgcmVxdWlyZSBpbmRleCBzaW5jZSB3ZSBzb3J0IGRvY3MgYnkgY3JlYXRlZEF0XG5cdFx0SW5zdGFuY2VSZWNvcmRRdWV1ZS5jb2xsZWN0aW9uLl9lbnN1cmVJbmRleCh7XG5cdFx0XHRjcmVhdGVkQXQ6IDFcblx0XHR9KTtcblx0XHRJbnN0YW5jZVJlY29yZFF1ZXVlLmNvbGxlY3Rpb24uX2Vuc3VyZUluZGV4KHtcblx0XHRcdHNlbnQ6IDFcblx0XHR9KTtcblx0XHRJbnN0YW5jZVJlY29yZFF1ZXVlLmNvbGxlY3Rpb24uX2Vuc3VyZUluZGV4KHtcblx0XHRcdHNlbmRpbmc6IDFcblx0XHR9KTtcblxuXG5cdFx0dmFyIHNlbmREb2MgPSBmdW5jdGlvbiAoZG9jKSB7XG5cdFx0XHQvLyBSZXNlcnZlIGRvY1xuXHRcdFx0dmFyIG5vdyA9ICtuZXcgRGF0ZSgpO1xuXHRcdFx0dmFyIHRpbWVvdXRBdCA9IG5vdyArIG9wdGlvbnMuc2VuZFRpbWVvdXQ7XG5cdFx0XHR2YXIgcmVzZXJ2ZWQgPSBJbnN0YW5jZVJlY29yZFF1ZXVlLmNvbGxlY3Rpb24udXBkYXRlKHtcblx0XHRcdFx0X2lkOiBkb2MuX2lkLFxuXHRcdFx0XHRzZW50OiBmYWxzZSwgLy8geHh4OiBuZWVkIHRvIG1ha2Ugc3VyZSB0aGlzIGlzIHNldCBvbiBjcmVhdGVcblx0XHRcdFx0c2VuZGluZzoge1xuXHRcdFx0XHRcdCRsdDogbm93XG5cdFx0XHRcdH1cblx0XHRcdH0sIHtcblx0XHRcdFx0JHNldDoge1xuXHRcdFx0XHRcdHNlbmRpbmc6IHRpbWVvdXRBdCxcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdC8vIE1ha2Ugc3VyZSB3ZSBvbmx5IGhhbmRsZSBkb2NzIHJlc2VydmVkIGJ5IHRoaXNcblx0XHRcdC8vIGluc3RhbmNlXG5cdFx0XHRpZiAocmVzZXJ2ZWQpIHtcblxuXHRcdFx0XHQvLyBTZW5kXG5cdFx0XHRcdHZhciByZXN1bHQgPSBJbnN0YW5jZVJlY29yZFF1ZXVlLnNlcnZlclNlbmQoZG9jKTtcblxuXHRcdFx0XHRpZiAoIW9wdGlvbnMua2VlcERvY3MpIHtcblx0XHRcdFx0XHQvLyBQci4gRGVmYXVsdCB3ZSB3aWxsIHJlbW92ZSBkb2NzXG5cdFx0XHRcdFx0SW5zdGFuY2VSZWNvcmRRdWV1ZS5jb2xsZWN0aW9uLnJlbW92ZSh7XG5cdFx0XHRcdFx0XHRfaWQ6IGRvYy5faWRcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRcdC8vIFVwZGF0ZVxuXHRcdFx0XHRcdEluc3RhbmNlUmVjb3JkUXVldWUuY29sbGVjdGlvbi51cGRhdGUoe1xuXHRcdFx0XHRcdFx0X2lkOiBkb2MuX2lkXG5cdFx0XHRcdFx0fSwge1xuXHRcdFx0XHRcdFx0JHNldDoge1xuXHRcdFx0XHRcdFx0XHQvLyBNYXJrIGFzIHNlbnRcblx0XHRcdFx0XHRcdFx0c2VudDogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0Ly8gU2V0IHRoZSBzZW50IGRhdGVcblx0XHRcdFx0XHRcdFx0c2VudEF0OiBuZXcgRGF0ZSgpLFxuXHRcdFx0XHRcdFx0XHQvLyBOb3QgYmVpbmcgc2VudCBhbnltb3JlXG5cdFx0XHRcdFx0XHRcdHNlbmRpbmc6IDBcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gLy8gRW1pdCB0aGUgc2VuZFxuXHRcdFx0XHQvLyBzZWxmLmVtaXQoJ3NlbmQnLCB7XG5cdFx0XHRcdC8vIFx0ZG9jOiBkb2MuX2lkLFxuXHRcdFx0XHQvLyBcdHJlc3VsdDogcmVzdWx0XG5cdFx0XHRcdC8vIH0pO1xuXG5cdFx0XHR9IC8vIEVsc2UgY291bGQgbm90IHJlc2VydmVcblx0XHR9OyAvLyBFTyBzZW5kRG9jXG5cblx0XHRzZW5kV29ya2VyKGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0aWYgKGlzU2VuZGluZ0RvYykge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHQvLyBTZXQgc2VuZCBmZW5jZVxuXHRcdFx0aXNTZW5kaW5nRG9jID0gdHJ1ZTtcblxuXHRcdFx0dmFyIGJhdGNoU2l6ZSA9IG9wdGlvbnMuc2VuZEJhdGNoU2l6ZSB8fCAxO1xuXG5cdFx0XHR2YXIgbm93ID0gK25ldyBEYXRlKCk7XG5cblx0XHRcdC8vIEZpbmQgZG9jcyB0aGF0IGFyZSBub3QgYmVpbmcgb3IgYWxyZWFkeSBzZW50XG5cdFx0XHR2YXIgcGVuZGluZ0RvY3MgPSBJbnN0YW5jZVJlY29yZFF1ZXVlLmNvbGxlY3Rpb24uZmluZCh7XG5cdFx0XHRcdCRhbmQ6IFtcblx0XHRcdFx0XHQvLyBNZXNzYWdlIGlzIG5vdCBzZW50XG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0c2VudDogZmFsc2Vcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdC8vIEFuZCBub3QgYmVpbmcgc2VudCBieSBvdGhlciBpbnN0YW5jZXNcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRzZW5kaW5nOiB7XG5cdFx0XHRcdFx0XHRcdCRsdDogbm93XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHQvLyBBbmQgbm8gZXJyb3Jcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRlcnJNc2c6IHtcblx0XHRcdFx0XHRcdFx0JGV4aXN0czogZmFsc2Vcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdF1cblx0XHRcdH0sIHtcblx0XHRcdFx0Ly8gU29ydCBieSBjcmVhdGVkIGRhdGVcblx0XHRcdFx0c29ydDoge1xuXHRcdFx0XHRcdGNyZWF0ZWRBdDogMVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRsaW1pdDogYmF0Y2hTaXplXG5cdFx0XHR9KTtcblxuXHRcdFx0cGVuZGluZ0RvY3MuZm9yRWFjaChmdW5jdGlvbiAoZG9jKSB7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0c2VuZERvYyhkb2MpO1xuXHRcdFx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoZXJyb3Iuc3RhY2spO1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdJbnN0YW5jZVJlY29yZFF1ZXVlOiBDb3VsZCBub3Qgc2VuZCBkb2MgaWQ6IFwiJyArIGRvYy5faWQgKyAnXCIsIEVycm9yOiAnICsgZXJyb3IubWVzc2FnZSk7XG5cdFx0XHRcdFx0SW5zdGFuY2VSZWNvcmRRdWV1ZS5jb2xsZWN0aW9uLnVwZGF0ZSh7XG5cdFx0XHRcdFx0XHRfaWQ6IGRvYy5faWRcblx0XHRcdFx0XHR9LCB7XG5cdFx0XHRcdFx0XHQkc2V0OiB7XG5cdFx0XHRcdFx0XHRcdC8vIGVycm9yIG1lc3NhZ2Vcblx0XHRcdFx0XHRcdFx0ZXJyTXNnOiBlcnJvci5tZXNzYWdlXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pOyAvLyBFTyBmb3JFYWNoXG5cblx0XHRcdC8vIFJlbW92ZSB0aGUgc2VuZCBmZW5jZVxuXHRcdFx0aXNTZW5kaW5nRG9jID0gZmFsc2U7XG5cdFx0fSwgb3B0aW9ucy5zZW5kSW50ZXJ2YWwgfHwgMTUwMDApOyAvLyBEZWZhdWx0IGV2ZXJ5IDE1dGggc2VjXG5cblx0fSBlbHNlIHtcblx0XHRpZiAoSW5zdGFuY2VSZWNvcmRRdWV1ZS5kZWJ1Zykge1xuXHRcdFx0Y29uc29sZS5sb2coJ0luc3RhbmNlUmVjb3JkUXVldWU6IFNlbmQgc2VydmVyIGlzIGRpc2FibGVkJyk7XG5cdFx0fVxuXHR9XG5cbn07IiwiTWV0ZW9yLnN0YXJ0dXAgLT5cblx0aWYgTWV0ZW9yLnNldHRpbmdzLmNyb24/Lmluc3RhbmNlcmVjb3JkcXVldWVfaW50ZXJ2YWxcblx0XHRJbnN0YW5jZVJlY29yZFF1ZXVlLkNvbmZpZ3VyZVxuXHRcdFx0c2VuZEludGVydmFsOiBNZXRlb3Iuc2V0dGluZ3MuY3Jvbi5pbnN0YW5jZXJlY29yZHF1ZXVlX2ludGVydmFsXG5cdFx0XHRzZW5kQmF0Y2hTaXplOiAxMFxuXHRcdFx0a2VlcERvY3M6IHRydWVcbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICB2YXIgcmVmO1xuICBpZiAoKHJlZiA9IE1ldGVvci5zZXR0aW5ncy5jcm9uKSAhPSBudWxsID8gcmVmLmluc3RhbmNlcmVjb3JkcXVldWVfaW50ZXJ2YWwgOiB2b2lkIDApIHtcbiAgICByZXR1cm4gSW5zdGFuY2VSZWNvcmRRdWV1ZS5Db25maWd1cmUoe1xuICAgICAgc2VuZEludGVydmFsOiBNZXRlb3Iuc2V0dGluZ3MuY3Jvbi5pbnN0YW5jZXJlY29yZHF1ZXVlX2ludGVydmFsLFxuICAgICAgc2VuZEJhdGNoU2l6ZTogMTAsXG4gICAgICBrZWVwRG9jczogdHJ1ZVxuICAgIH0pO1xuICB9XG59KTtcbiIsImltcG9ydCB7IGNoZWNrTnBtVmVyc2lvbnMgfSBmcm9tICdtZXRlb3IvdG1lYXNkYXk6Y2hlY2stbnBtLXZlcnNpb25zJztcbmNoZWNrTnBtVmVyc2lvbnMoe1xuXHRcImV2YWxcIjogXCJeMC4xLjJcIlxufSwgJ3N0ZWVkb3M6aW5zdGFuY2UtcmVjb3JkLXF1ZXVlJyk7XG4iXX0=
