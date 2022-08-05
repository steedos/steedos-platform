var updateSpaceUserSessionRolesCache = require('@steedos/auth').updateSpaceUserSessionRolesCache;
var wrapAsync = require('@steedos/objectql').wrapAsync;
const _ = require('underscore');

Meteor.startup(function () {
  var _update, server_permission_set_init = false;
  _update = function (spaceId, users) {
    if (users) {
      for (let index = 0; index < users.length; index++) {
        var updateFn = function () {
          return updateSpaceUserSessionRolesCache(spaceId, users[index]);
        }
        wrapAsync(updateFn, {});
      }
    }
  }
  Creator.getCollection("permission_set").find({}, {
    fields: {
      space: 1,
      users: 1
    }
  }).observe({
    added: function (newDocument) {
      if (server_permission_set_init) {
        return _update(newDocument.space, newDocument.users);
      }
    },
    changed: function (newDocument, oldDocument) {
      var newUsers = newDocument.users;
      var oldUsers = oldDocument.users;
      var diffUsers = _.difference(newUsers, oldUsers).concat(_.difference(oldUsers, newUsers));
      return _update(newDocument.space, diffUsers);
    },
    removed: function (oldDocument) {
      return _update(oldDocument.space, oldDocument.users);
    }
  });
  server_permission_set_init = true;
});