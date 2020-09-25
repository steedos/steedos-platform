if (!db.instances) {
  const core = require('@steedos/core');
  db.instances = core.newCollection('instances');
}

if (Meteor.isServer) {
  db.instances.allow({
    insert: function (userId, event) {
      return false;
    },
    update: function (userId, event) {
      if (event.state === "draft" && (event.applicant === userId || event.submitter === userId)) {
        return true;
      } else {
        return false;
      }
    },
    remove: function (userId, event) {
      return false;
    }
  });
  try {
    Meteor.methods({
      getRelatedInstancesOptions: function (options) {
        var instance, instanceId, instances, pinyin, query, searchText, selectedOPtions, uid, values;
        uid = this.userId;
        searchText = options.searchText;
        values = options.values;
        instanceId = options.params;
        selectedOPtions = [];
        //			Meteor.wrapAsync((callback) ->
        //				Meteor.setTimeout (->
        //					callback()
        //					return
        //				), 1000
        //				return
        //			)()
        options = new Array();
        instances = new Array();
        if (instanceId) {
          instance = db.instances.findOne(instanceId, {
            fields: {
              related_instances: 1
            }
          });
          if (instance) {
            selectedOPtions = instance.related_instances;
          }
        }
        if (searchText) {
          pinyin = /^[a-zA-Z\']*$/.test(searchText);
          if ((pinyin && searchText.length > 8) || (!pinyin && searchText.length > 1)) {
            //					console.log "searchText is #{searchText}"
            query = {
              state: {
                $in: ["pending", "completed"]
              },
              name: {
                $regex: searchText
              },
              $or: [
                {
                  submitter: uid
                },
                {
                  applicant: uid
                },
                {
                  inbox_users: uid
                },
                {
                  outbox_users: uid
                },
                {
                  cc_users: uid
                }
              ]
            };
            if (selectedOPtions && _.isArray(selectedOPtions)) {
              query._id = {
                $nin: selectedOPtions
              };
            }
            instances = db.instances.find(query, {
              limit: 10,
              fields: {
                name: 1,
                flow: 1,
                applicant_name: 1
              }
            }).fetch();
          }
        } else if (values.length) {
          instances = db.instances.find({
            _id: {
              $in: values
            }
          }, {
            fields: {
              name: 1,
              flow: 1,
              applicant_name: 1
            }
          }).fetch();
        }
        instances.forEach(function (instance) {
          var flow;
          flow = db.flows.findOne({
            _id: instance.flow
          }, {
            fields: {
              name: 1
            }
          });
          return options.push({
            label: "[" + (flow != null ? flow.name : void 0) + "]" + instance.name + ", " + instance.applicant_name,
            value: instance._id
          });
        });
        return options;
      }
    });
  } catch (error) {
    console.log(error.message);
  }
  db.instances.before.update(function (userId, doc, fieldNames, modifier, options) {
    modifier.$unset = modifier.$unset || {};
    return modifier.$unset.is_recorded = 1;
  });
  db.instances.after.update(function (userId, doc, fieldNames, modifier, options) {
    if (doc.state === "pending" && this.previous.state === "draft") {
      return uuflowManager.triggerRecordInstanceQueue(doc._id, doc.record_ids, doc.current_step_name, doc.flow);
    } else if (!_.isEmpty(doc.record_ids) && doc.current_step_name !== this.previous.current_step_name) {
      return uuflowManager.triggerRecordInstanceQueue(doc._id, doc.record_ids, doc.current_step_name, doc.flow);
    }
  });
  db.instances._ensureIndex({
    "space": 1
  }, {
    background: true
  });
  db.instances._ensureIndex({
    "is_deleted": 1
  }, {
    background: true
  });
  db.instances._ensureIndex({
    "submitter": 1
  }, {
    background: true
  });
  db.instances._ensureIndex({
    "applicant": 1
  }, {
    background: true
  });
  db.instances._ensureIndex({
    "outbox_users": 1
  }, {
    background: true
  });
  db.instances._ensureIndex({
    "inbox_users": 1
  }, {
    background: true
  });
  db.instances._ensureIndex({
    "space": 1,
    "is_deleted": 1
  }, {
    background: true
  });
  db.instances._ensureIndex({
    "state": 1
  }, {
    background: true
  });
  db.instances._ensureIndex({
    "is_archived": 1
  }, {
    background: true
  });
  db.instances._ensureIndex({
    "created": 1
  }, {
    background: true
  });
  db.instances._ensureIndex({
    "_id": 1,
    "submit_date": 1
  }, {
    background: true
  });
  db.instances._ensureIndex({
    "space": 1,
    "flow": 1,
    "state": 1,
    "submit_date": 1
  }, {
    background: true
  });
  db.instances._ensureIndex({
    "created": 1,
    "modified": 1
  }, {
    background: true
  });
  db.instances._ensureIndex({
    "is_deleted": 1,
    "state": 1,
    "space": 1,
    "final_decision": 1,
    "submitter": 1,
    "applicant": 1
  }, {
    background: true
  });
  db.instances._ensureIndex({
    "is_deleted": 1,
    "space": 1,
    "modified": 1,
    "outbox_users": 1
  }, {
    background: true
  });
  db.instances._ensureIndex({
    "is_deleted": 1,
    "state": 1,
    "space": 1,
    "modified": 1,
    "final_decision": 1,
    "submitter": 1,
    "applicant": 1
  }, {
    background: true
  });
  db.instances._ensureIndex({
    "is_deleted": 1,
    "space": 1,
    "outbox_users": 1
  }, {
    background: true
  });
  db.instances._ensureIndex({
    "is_deleted": 1,
    "space": 1,
    "modified": 1,
    "submit_date": 1,
    "outbox_users": 1
  }, {
    background: true
  });
  db.instances._ensureIndex({
    "is_deleted": 1,
    "space": 1,
    "submit_date": 1,
    "outbox_users": 1
  }, {
    background: true
  });
  db.instances._ensureIndex({
    "is_deleted": 1,
    "state": 1,
    "space": 1,
    "flow": 1,
    "modified": 1
  }, {
    background: true
  });
  db.instances._ensureIndex({
    "is_deleted": 1,
    "state": 1,
    "space": 1,
    "flow": 1
  }, {
    background: true
  });
  db.instances._ensureIndex({
    "is_deleted": 1,
    "state": 1,
    "space": 1,
    "flow": 1,
    "submit_date": 1,
    "modified": 1
  }, {
    background: true
  });
  db.instances._ensureIndex({
    "is_deleted": 1,
    "state": 1,
    "space": 1,
    "flow": 1,
    "submit_date": 1
  }, {
    background: true
  });
  db.instances._ensureIndex({
    "is_deleted": 1,
    "state": 1,
    "space": 1,
    "submitter": 1,
    "applicant": 1,
    "inbox_users": 1
  }, {
    background: true
  });
  db.instances._ensureIndex({
    "is_deleted": 1,
    "state": 1,
    "space": 1,
    "is_archive": 1,
    "submitter": 1,
    "applicant": 1
  }, {
    background: true
  });
  db.instances._ensureIndex({
    "modified": 1
  }, {
    background: true
  });
  db.instances._ensureIndex({
    "modified": 1
  }, {
    background: true
  });
  db.instances._ensureIndex({
    "cc_users": 1
  }, {
    background: true
  });
  db.instances._ensureIndex({
    "space": 1,
    "state": 1,
    "is_deleted": 1
  }, {
    background: true
  });
  db.instances._ensureIndex({
    "keywords": "hashed"
  }, {
    background: true
  });
  db.instances._ensureIndex({
    "space": 1,
    "submit_date": 1,
    "is_deleted": 1,
    "final_decision": 1,
    "state": 1
  }, {
    background: true
  });
  db.instances._ensureIndex({
    "traces.approves.type": 1,
    "traces.approves.handler": 1
  }, {
    background: true
  });
  // 全文检索同步字段
  db.instances._ensureIndex({
    "is_recorded": 1
  }, {
    background: true
  });
  db.instances._ensureIndex({
    "category": 1
  }, {
    background: true
  });
  db.instances._ensureIndex({
    "record_ids.o": 1,
    "record_ids.ids": 1
  }, {
    background: true
  });
  db.instances._ensureIndex({
    "traces.approves.auto_submitted": 1
  }, {
    background: true
  });
}
