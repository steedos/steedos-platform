const objectql = require("@steedos/objectql");
const config = objectql.getSteedosConfig();

const objectUpdate = function (objectApiName, id, data) {
  return objectql.wrapAsync(async function () {
      return await objectql.getObject(this.objectApiName).update(this.id, this.data)
  }, { objectApiName: objectApiName, id: id, data: data })
}

if (!db.instances) {
  const core = require('@steedos/core');
  db.instances = Creator.getCollection('instances') || core.newCollection('instances');
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
  db.instances.after.update(function (userId, doc, fieldNames, modifier, options) {
    if (doc.current_step_name !== this.previous.current_step_name) {
      return uuflowManager.triggerRecordInstanceQueue(doc._id, doc.record_ids, doc.current_step_name, doc.flow, doc.state);
    }
  });
  db.instances.after.remove(function (userId, doc) {
    let recordIds = doc.record_ids;
    if (recordIds && recordIds.length == 1) {
      let recordObjName = recordIds[0].o;
      let recordId = recordIds[0].ids[0];
      if (recordObjName && recordId) {
        // let recordObj = Creator.getCollection(recordObjName);
        // if (recordObj) {
        //   recordObj.update(recordId, { $unset: { "instances": 1, "instance_state": 1, "locked": 1 } });
        // }
        objectUpdate(recordObjName, recordId, { "instances": null, "instance_state": null, "locked": null })
      }
    }
  });
}
