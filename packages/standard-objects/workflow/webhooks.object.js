if (!db.webhooks) {
  const core = require('@steedos/core');
  db.webhooks = core.newCollection('webhooks');
}

if (Meteor.isServer) {
  db.webhooks.allow({
    insert: function (userId, doc) {
      if (!Steedos.isSpaceAdmin(doc.space, userId)) {
        return false;
      } else {
        return true;
      }
    },
    update: function (userId, doc) {
      if (!Steedos.isSpaceAdmin(doc.space, userId)) {
        return false;
      } else {
        return true;
      }
    },
    remove: function (userId, doc) {
      if (!Steedos.isSpaceAdmin(doc.space, userId)) {
        return false;
      } else {
        return true;
      }
    }
  });
}

db.webhooks.helpers({
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

new Tabular.Table({
  name: "Webhooks",
  collection: db.webhooks,
  columns: [
    {
      data: "flow",
      render: function (val,
        type,
        doc) {
        var f;
        f = db.flows.findOne({
          _id: doc.flow
        },
          {
            fields: {
              name: 1
            }
          });
        return f && f.name;
      }
    },
    {
      data: "payload_url"
    },
    {
      data: "active"
    },
    {
      data: "description"
    }
  ],
  dom: "tp",
  lengthChange: false,
  ordering: false,
  pageLength: 10,
  info: false,
  extraFields: ["space", "content_type"],
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
