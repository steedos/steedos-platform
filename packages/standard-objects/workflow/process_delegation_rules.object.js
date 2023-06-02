/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-02-28 09:25:02
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-05-08 17:21:10
 * @Description: 
 */
if (!db.process_delegation_rules) {
  const core = require('@steedos/core');
  db.process_delegation_rules = core.newCollection('process_delegation_rules');
}

db.process_delegation_rules.helpers({
  flow_name: function () {
    var f;
    f = db.flows.findOne({
      _id: this.flow
    }, {
        fields: {
          name: 1
        }
      });
    return f && f.name;
  }
});

if (Meteor.isServer) {
  db.process_delegation_rules.allow({
    insert: function (userId, doc) {
      return userId && db.space_users.find({
        space: doc.space,
        user: userId
      }).count() > 0 && db.process_delegation_rules.find({
        space: doc.space,
        from: userId
      }).count() === 0;
    },
    update: function (userId, doc, fieldNames, modifier) {
      return userId && doc.from === userId;
    },
    remove: function (userId, doc) {
      return userId && doc.from === userId;
    },
    fetch: ['from']
  });
  db.process_delegation_rules.before.insert(function (userId, doc) {
    var ref;
    if (doc.start_time >= doc.end_time) {
      throw new Error("process_delegation_rules_start_must_lt_end");
    }
    if (db.process_delegation_rules.find({
      from: userId
    }).count() > 0) {
      throw new Error("process_delegation_rules_only_one");
    }
    if (doc.to) {
      var pdr = db.process_delegation_rules.findOne({ from: doc.to, to: userId, enabled: true, $or: [{ start_time: { $lte: doc.start_time }, end_time: { $gte: doc.start_time } }, { start_time: { $gte: doc.start_time }, end_time: { $lte: doc.end_time } }, { start_time: { $lte: doc.end_time }, end_time: { $gte: doc.end_time } }] });
      if (pdr) {
        throw new Error("process_delegation_rules_cannot_deltegation_eachother");
      }
    }


    doc.created_by = userId;
    doc.created = new Date();
    doc.from = userId;
  });
  db.process_delegation_rules.before.update(function (userId, doc, fieldNames, modifier, options) {
    var ref, ref1;
    modifier.$set = modifier.$set || {};
    var mergeDoc = _.extend({}, doc, modifier.$set);
    if (mergeDoc.start_time >= mergeDoc.end_time) {
      throw new Meteor.Error(400, "process_delegation_rules_start_must_lt_end");
    }

    var pdr = db.process_delegation_rules.findOne({ from: mergeDoc.to, to: userId, enabled: true, $or: [{ start_time: { $lte: mergeDoc.start_time }, end_time: { $gte: mergeDoc.start_time } }, { start_time: { $gte: mergeDoc.start_time }, end_time: { $lte: mergeDoc.end_time } }, { start_time: { $lte: mergeDoc.end_time }, end_time: { $gte: mergeDoc.end_time } }] });
    if (pdr && mergeDoc.enabled) {
      throw new Meteor.Error(400, "process_delegation_rules_cannot_deltegation_eachother");
    }

    modifier.$set.modified = new Date();
    if (userId) {
      modifier.$set.modified_by = userId;
    }
  });
  db.process_delegation_rules.after.update(function (userId, doc, fieldNames, modifier, options) {
    // 撤销委托
    if ((this.previous.enabled === true && doc.enabled === false) || doc.end_time <= new Date()) {
      return uuflowManager.cancelProcessDelegation(this.previous.space, this.previous.to);
    }
  });
  db.process_delegation_rules.after.remove(function (userId, doc) {
    if (doc.enabled) {
      return uuflowManager.cancelProcessDelegation(doc.space, doc.to);
    }
  });
}

