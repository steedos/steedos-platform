const core = require("@steedos/core");
const objectName = "holidays";

Meteor.startup(function () {
  var _change, _remove, inited = false;
  _change = function (document) {
    core.updateHolidaysCache(document.space, document.date.getUTCFullYear());
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
      return _change(oldDocument);
    }
  });
  inited = true;
});