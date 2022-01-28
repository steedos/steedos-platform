if (!db.instance_number_rules) {
  const core = require('@steedos/core');
  db.instance_number_rules = Creator.getCollection('instance_number_rules') || core.newCollection('instance_number_rules');
}

if (Meteor.isServer) {
  db.instance_number_rules.allow({
    insert: function (userId, event) {
      if (!Steedos.isSpaceAdmin(event.space, userId)) {
        return false;
      } else {
        return true;
      }
    },
    update: function (userId, event) {
      if (!Steedos.isSpaceAdmin(event.space, userId)) {
        return false;
      } else {
        return true;
      }
    },
    remove: function (userId, event) {
      if (!Steedos.isSpaceAdmin(event.space, userId)) {
        return false;
      } else {
        return true;
      }
    }
  });
  db.instance_number_rules.before.insert(function (userId, doc) {
    var rules;
    doc.created_by = userId;
    doc.created = new Date();
    rules = db.instance_number_rules.findOne({
      space: doc.space,
      "name": doc.name
    });
    if (rules) {
      throw new Meteor.Error(400, "instance_number_rules_name_only");
    }
    return console.log(userId + "; insert instance_number_rules", doc);
  });
  db.instance_number_rules.before.update(function (userId, doc, fieldNames, modifier, options) {
    modifier.$set = modifier.$set || {};
    modifier.$set.modified_by = userId;
    modifier.$set.modified = new Date();
    return console.log(userId + "; update instance_number_rules", doc);
  });
  db.instance_number_rules.before.remove(function (userId, doc) {
    // if (!Steedos.isSpaceAdmin(doc.space, userId))
    // 	throw new Meteor.Error(400, "error_space_admins_only");
    return console.log(userId + "; remove instance_number_rules", doc);
  });
}

new Tabular.Table({
  name: "instance_number_rules",
  collection: db.instance_number_rules,
  columns: [
    {
      data: "name",
      title: "name"
    },
    {
      data: "year",
      title: "year"
    },
    {
      data: "first_number",
      title: "first_number"
    },
    {
      data: "number",
      title: "number"
    },
    {
      data: "rules",
      title: "rules"
    }
  ],
  dom: "tp",
  extraFields: ["space"],
  lengthChange: false,
  ordering: false,
  pageLength: 10,
  info: false,
  searching: true,
  autoWidth: false
});

