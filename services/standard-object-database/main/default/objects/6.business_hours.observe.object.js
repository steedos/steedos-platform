const objectql = require("@steedos/objectql");
const objectName = "business_hours";

Meteor.startup(function () {
  var _change, _remove, inited = false;
  _change = function (document) {
    objectql.addConfig(objectName, document);
  };
  _remove = function (document) {
    objectql.removeConfig(objectName, document);
  };
  Creator.getCollection(objectName).find({ is_default: true }, {
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