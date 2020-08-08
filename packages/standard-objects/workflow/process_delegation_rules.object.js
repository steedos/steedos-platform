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
  db.process_delegation_rules._ensureIndex({
    "enabled": 1,
    "end_time": 1
  }, {
      background: true
    });
}

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
      throw new Meteor.Error(400, "process_delegation_rules_start_must_lt_end");
    }
    if (db.process_delegation_rules.find({
      from: userId
    }).count() > 0) {
      throw new Meteor.Error(400, "process_delegation_rules_only_one");
    }
    if (doc.to) {
      var pdr = db.process_delegation_rules.findOne({ from: doc.to, to: userId, enabled: true, $or: [{ start_time: { $lte: doc.start_time }, end_time: { $gte: doc.start_time } }, { start_time: { $gte: doc.start_time }, end_time: { $lte: doc.end_time } }, { start_time: { $lte: doc.end_time }, end_time: { $gte: doc.end_time } }] });
      if (pdr) {
        throw new Meteor.Error(400, "process_delegation_rules_cannot_deltegation_eachother");
      }
    }


    doc.created_by = userId;
    doc.created = new Date();
    doc.from = userId;
    return doc.to_name = (ref = db.space_users.findOne({
      space: doc.space,
      user: doc.to
    }, {
        fields: {
          name: 1
        }
      })) != null ? ref.name : void 0;
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
      modifier.$set.from_name = (ref = db.space_users.findOne({
        space: doc.space,
        user: userId
      }, {
          fields: {
            name: 1
          }
        })) != null ? ref.name : void 0;
    }
    if (modifier.$set.to) {
      return modifier.$set.to_name = (ref1 = db.space_users.findOne({
        space: doc.space,
        user: modifier.$set.to
      }, {
          fields: {
            name: 1
          }
        })) != null ? ref1.name : void 0;
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

new Tabular.Table({
  name: "process_delegation_rules",
  collection: db.process_delegation_rules,
  columns: [
    {
      data: "from_name"
    },
    {
      data: "to_name"
    },
    {
      data: "enabled",
      render: function (val,
        type,
        doc) {
        if (doc.enabled) {
          return TAPi18n.__("instance_approve_read_yes");
        } else {
          return TAPi18n.__("instance_approve_read_no");
        }
      }
    },
    {
      data: "start_time",
      render: function (val,
        type,
        doc) {
        return moment(doc.start_time).format('YYYY-MM-DD HH');
      }
    },
    {
      data: "end_time",
      render: function (val,
        type,
        doc) {
        return moment(doc.end_time).format('YYYY-MM-DD HH');
      }
    }
  ],
  dom: "tp",
  lengthChange: false,
  ordering: false,
  pageLength: 10,
  info: false,
  extraFields: ["space", "from", "to"],
  searching: true,
  autoWidth: false,
  changeSelector: function (selector, userId) {
    if (!userId) {
      return {
        _id: -1
      };
    }
    return selector;
  }
});
