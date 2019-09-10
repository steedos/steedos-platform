if (!db.categories) {
  db.categories = new Meteor.Collection('categories');
}

if (Meteor.isServer) {
  db.categories.allow({
    insert: function (userId, event) {
      return false;
    },
    update: function (userId, event) {
      if (!Steedos.isSpaceAdmin(event.space, userId)) {
        return false;
      } else {
        return true;
      }
    },
    remove: function (userId, event) {
      return false;
    }
  });
  db.categories.before.insert(function (userId, doc) {
    doc.created_by = userId;
    return doc.created = new Date();
  });
  db.categories.before.update(function (userId, doc, fieldNames, modifier, options) {
    modifier.$set = modifier.$set || {};
    modifier.$set.modified_by = userId;
    return modifier.$set.modified = new Date();
  });
  db.categories.before.remove(function (userId, doc) {
    if (!Steedos.isSpaceAdmin(doc.space, userId)) {
      throw new Meteor.Error(400, "error_space_admins_only");
    }
    if (db.forms.find({
      space: doc.space,
      category: doc._id
    }).count() > 0) {
      throw new Meteor.Error(400, "categories_in_use");
    }
  });
}

new Tabular.Table({
  name: "Categories",
  collection: db.categories,
  columns: [
    {
      data: "name",
      title: "name",
      orderable: false
    },
    {
      data: "sort_no",
      title: "sort_no",
      orderable: false
    },
    {
      data: "sort_no",
      title: "sort_no",
      visible: false
    }
  ],
  dom: "tp",
  order: [2, "desc"],
  extraFields: [],
  lengthChange: false,
  pageLength: 10,
  info: false,
  searching: true,
  autoWidth: false
});
