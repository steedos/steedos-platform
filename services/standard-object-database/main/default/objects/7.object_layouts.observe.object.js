const objectql = require("@steedos/objectql");
const objectName = "object_layouts";

Meteor.startup(function () {
  var _change, _remove, inited = false;
  _change = function (document) {
    objectql.loadObjectLayoutMetadata(document, `~database-${objectName}`)
  };
  _remove = function (document) {
    objectql.getSteedosSchema().metadataRegister.removeLayout(`${document.object_name}.${document._id}`)
  };
  Creator.getCollection(objectName).find({}, {
    fields: {
      created: 0,
      created_by: 0,
      modified: 0,
      modified_by: 0
    }
  }).observe({
    added: function (newDocument) {
      if (inited) {
        return _change(newDocument);
      }
    },
    changed: function (newDocument, oldDocument) {
      return _change(newDocument);
    },
    removed: function (oldDocument) {
      return _remove(oldDocument);
    }
  });
  inited = true;
});