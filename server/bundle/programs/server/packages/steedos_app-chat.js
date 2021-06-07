(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var permissionManagerForInitApproval = Package['steedos:creator'].permissionManagerForInitApproval;
var uuflowManagerForInitApproval = Package['steedos:creator'].uuflowManagerForInitApproval;
var Blaze = Package.blaze.Blaze;
var UI = Package.blaze.UI;
var Handlebars = Package.blaze.Handlebars;
var Selector = Package['steedos:base'].Selector;
var Steedos = Package['steedos:base'].Steedos;
var AjaxCollection = Package['steedos:base'].AjaxCollection;
var SteedosDataManager = Package['steedos:base'].SteedosDataManager;
var SteedosOffice = Package['steedos:base'].SteedosOffice;
var billingManager = Package['steedos:base'].billingManager;
var meteorInstall = Package.modules.meteorInstall;
var Promise = Package.promise.Promise;
var HTML = Package.htmljs.HTML;

/* Package-scope variables */
var __coffeescriptShare;

var require = meteorInstall({"node_modules":{"meteor":{"steedos:app-chat":{"checkNpm.js":function module(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                           //
// packages/steedos_app-chat/checkNpm.js                                                                     //
//                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                             //
let checkNpmVersions;
module.link("meteor/tmeasday:check-npm-versions", {
  checkNpmVersions(v) {
    checkNpmVersions = v;
  }

}, 0);
checkNpmVersions({
  'socket.io': '>=1.4.8' // 'socket.io-client': "^1.4.8"

}, 'steedos:app-chat');
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"models":{"chat_subscriptions.coffee":function module(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                           //
// packages/steedos_app-chat/models/chat_subscriptions.coffee                                                //
//                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                             //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"chat_messages.coffee":function module(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                           //
// packages/steedos_app-chat/models/chat_messages.coffee                                                     //
//                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                             //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"chat_rooms.coffee":function module(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                           //
// packages/steedos_app-chat/models/chat_rooms.coffee                                                        //
//                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                             //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"server":{"publications":{"chat_messages.coffee":function module(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                           //
// packages/steedos_app-chat/server/publications/chat_messages.coffee                                        //
//                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                             //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.publishComposite('chat_messages', function (space_id, object_name, record_id, options) {
  var data, query, self;
  query = {
    'space': space_id,
    'related_to.o': object_name,
    'related_to.ids': record_id
  };
  self = this;
  self.unblock();
  data = {
    find: function () {
      self.unblock();
      return Creator.getCollection("chat_messages").find(query, options);
    }
  };
  data.children = [];
  data.children.push({
    find: function (parent) {
      var e;

      try {
        self.unblock();

        if (parent != null ? parent.owner : void 0) {
          return Creator.getCollection("users").find({
            _id: parent.owner
          }, {
            fields: {
              name: 1,
              avatarUrl: 1
            }
          });
        } else {
          return [];
        }
      } catch (error) {
        e = error;
        console.log(reference_to, parent, e);
        return [];
      }
    }
  });
  return data;
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"chat.socket.coffee":function module(require){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                           //
// packages/steedos_app-chat/server/chat.socket.coffee                                                       //
//                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                             //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var Fiber, PORT, SOCKETEVENTNAMES, SOCKETS, checkAuthToken, checkAuthTokenFiber, getReceiveSocketKey, http, receiveMessageSockets, receiveSubscriptionSockets, sendUnreadBadge, sendUnreadBadgeFiber, socketEmit, socket_io;
http = require('http');
socket_io = require('socket.io');
Fiber = require('fibers');

if (!process.env.SOCKET_IO_PORT) {
  return;
}

PORT = process.env.SOCKET_IO_PORT || 8080;
SOCKETS = {};
receiveMessageSockets = {};
receiveSubscriptionSockets = {};
SOCKETEVENTNAMES = {
  NEWMESSAGE: 'new message',
  STOPNEWMESSAGE: 'stop message',
  RECEIVEMESSAGE: 'receive message',
  SUBSCRIPTIONS: 'subscriptions',
  STOPNEWSUBSCRIPTIONS: 'stop subscriptions',
  RECEIVESUBSCRIPTIONS: 'receive subscriptions',
  COUNTUNREAD: 'count unread'
};

checkAuthToken = function (userId, authToken) {
  var hashedToken, user;

  if (userId && authToken) {
    hashedToken = Accounts._hashLoginToken(authToken);
    user = wrapAsyncFindOne(db.users, {
      _id: userId,
      "services.resume.loginTokens.hashedToken": hashedToken
    });

    if (user) {
      return true;
    } else {
      return false;
    }
  }

  return false;
};

getReceiveSocketKey = function (object_name, record_id, userId) {
  return object_name + "_" + record_id + "_" + userId;
};

sendUnreadBadge = function (socket, space_id, owner) {
  var countUnread;
  countUnread = 0;
  Creator.getCollection("chat_subscriptions").find({
    owner: owner,
    unread: {
      $gt: 0
    }
  }, {
    fields: {
      unread: 1
    }
  }).forEach(function (_r) {
    return countUnread += _r.unread;
  });
  return socketEmit(socket, SOCKETEVENTNAMES.COUNTUNREAD, countUnread);
};

sendUnreadBadgeFiber = function (socket, space_id, owner) {
  return Fiber(function () {
    return sendUnreadBadge(socket, space_id, owner);
  }).run();
};

checkAuthTokenFiber = function (socket, userId, authToken) {
  return Fiber(function () {
    var check;
    check = Steedos.checkAuthToken(userId, authToken);

    if (!check) {
      SOCKETS[socket.id] = null;
      return socket.disconnect();
    }
  }).run();
};

socketEmit = function (socket, eventname, data) {
  if (socket && SOCKETS[socket.id]) {
    return socket.emit(eventname, data);
  }
};

Meteor.startup(function () {
  var chat_messages_init, chat_subscriptions_init, counter, e, io, sendNewMessage, sendSubscription, server;
  server = http.createServer();
  io = socket_io(server);
  counter = 0;
  io.on('connection', function (socket) {
    var authToken, query, userId;
    query = socket.request._query;
    userId = query["X-User-Id"];
    authToken = query["X-Auth-Token"];

    if (!userId || !authToken) {
      socket.disconnect();
      return;
    }

    checkAuthTokenFiber(socket, userId, authToken);
    SOCKETS[socket.id] = socket;
    socket.on('disconnect', function () {
      query = socket.request._query;
      userId = query["X-User-Id"];
      return SOCKETS[socket.id] = null;
    });
    socket.on(SOCKETEVENTNAMES.STOPNEWMESSAGE, function (res) {
      var key;
      key = getReceiveSocketKey(res.object_name, res.record_id, socket.request._query["X-User-Id"]);
      return receiveMessageSockets[key] = null;
    });
    socket.on(SOCKETEVENTNAMES.RECEIVEMESSAGE, function (res) {
      var key;
      key = getReceiveSocketKey(res.object_name, res.record_id, socket.request._query["X-User-Id"]);
      return receiveMessageSockets[key] = socket;
    });
    socket.on(SOCKETEVENTNAMES.STOPNEWSUBSCRIPTIONS, function (res) {
      var key;
      key = getReceiveSocketKey(res.object_name, '', socket.request._query["X-User-Id"]);
      return receiveSubscriptionSockets[key] = null;
    });
    return socket.on(SOCKETEVENTNAMES.RECEIVESUBSCRIPTIONS, function (res) {
      var key;
      key = getReceiveSocketKey(res.object_name, '', socket.request._query["X-User-Id"]);
      receiveSubscriptionSockets[key] = socket;
      return sendUnreadBadgeFiber(socket, '', socket.request._query["X-User-Id"]);
    });
  });

  try {
    server.listen(PORT);
    console.log('chat socket.io port', PORT);
  } catch (error) {
    e = error;
    console.error(e);
  }

  sendNewMessage = function (msg) {
    var object_name, participants, record_id, room;

    if (msg.related_to.o && msg.related_to.ids.length > 0) {
      object_name = msg.related_to.o;
      record_id = msg.related_to.ids[0];
      delete msg.related_to;
      msg.owner = Creator.getCollection("users").findOne({
        _id: msg.owner
      }, {
        fields: {
          _id: 1,
          name: 1,
          avatarUrl: 1
        }
      });

      if (object_name === 'chat_rooms') {
        room = Creator.getCollection(object_name).findOne({
          _id: record_id
        }, {
          fields: {
            members: 1
          }
        });

        if (room) {
          return _.forEach(room != null ? room.members : void 0, function (m) {
            var key;
            key = getReceiveSocketKey(object_name, record_id, m);
            return socketEmit(receiveMessageSockets[key], SOCKETEVENTNAMES.NEWMESSAGE, msg);
          });
        }
      } else {
        participants = Creator.getCollection("chat_subscriptions").find({
          'related_to.o': object_name,
          'related_to.ids': [record_id]
        }, {
          fields: {
            owner: 1
          }
        });
        return participants.forEach(function (p) {
          var key;
          key = getReceiveSocketKey(object_name, record_id, p.owner);
          return socketEmit(receiveMessageSockets[key], SOCKETEVENTNAMES.NEWMESSAGE, msg);
        });
      }
    }
  };

  chat_messages_init = false;
  Creator.getCollection("chat_messages").find({
    'created': {
      $gte: new Date()
    }
  }, {
    fields: {
      created_by: 0,
      modified: 0,
      modified_by: 0
    }
  }).observe({
    added: function (newDocument) {
      if (chat_messages_init) {
        return sendNewMessage(newDocument);
      }
    },
    changed: function (newDocument, oldDocument) {
      return sendNewMessage(newDocument);
    },
    removed: function (oldDocument) {
      return sendNewMessage(oldDocument);
    }
  });
  chat_messages_init = true;

  sendSubscription = function (sub) {
    var key, object_name, record_id, room;

    if (sub.related_to.o && sub.related_to.ids.length > 0) {
      object_name = sub.related_to.o;
      record_id = sub.related_to.ids[0];
      sub.modified_by = Creator.getCollection("users").findOne({
        _id: sub.modified_by
      }, {
        fields: {
          _id: 1,
          name: 1,
          avatarUrl: 1
        }
      });
      key = getReceiveSocketKey(object_name, '', sub.owner);

      if (receiveSubscriptionSockets[key]) {
        if (object_name === 'chat_rooms') {
          room = Creator.getCollection(object_name).findOne({
            _id: record_id
          }, {
            fields: {
              members: 1
            }
          });

          if (room) {
            sub._room = {
              _id: room._id,
              members: Creator.getCollection("users").find({
                _id: {
                  $in: room.members || []
                }
              }, {
                fields: {
                  _id: 1,
                  name: 1,
                  avatarUrl: 1
                }
              }).fetch()
            };
          }
        }

        socketEmit(receiveSubscriptionSockets[key], SOCKETEVENTNAMES.SUBSCRIPTIONS, sub);
        return sendUnreadBadge(receiveSubscriptionSockets[key], '', sub.owner);
      }
    }
  };

  chat_subscriptions_init = false;
  Creator.getCollection("chat_subscriptions").find({
    $or: [{
      'created': {
        $gte: new Date()
      }
    }, {
      'modified': {
        $gte: new Date()
      }
    }]
  }, {
    fields: {
      created_by: 0
    }
  }).observe({
    added: function (newDocument) {
      if (chat_subscriptions_init) {
        return sendSubscription(newDocument);
      }
    },
    changed: function (newDocument, oldDocument) {
      return sendSubscription(newDocument);
    },
    removed: function (oldDocument) {
      return sendSubscription(oldDocument);
    }
  });
  return chat_subscriptions_init = true;
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}},{
  "extensions": [
    ".js",
    ".json",
    ".coffee"
  ]
});

require("/node_modules/meteor/steedos:app-chat/checkNpm.js");
require("/node_modules/meteor/steedos:app-chat/models/chat_subscriptions.coffee");
require("/node_modules/meteor/steedos:app-chat/models/chat_messages.coffee");
require("/node_modules/meteor/steedos:app-chat/models/chat_rooms.coffee");
require("/node_modules/meteor/steedos:app-chat/server/publications/chat_messages.coffee");
require("/node_modules/meteor/steedos:app-chat/server/chat.socket.coffee");

/* Exports */
Package._define("steedos:app-chat");

})();

//# sourceURL=meteor://💻app/packages/steedos_app-chat.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczphcHAtY2hhdC9jaGVja05wbS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hcHAtY2hhdC9zZXJ2ZXIvcHVibGljYXRpb25zL2NoYXRfbWVzc2FnZXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcHVibGljYXRpb25zL2NoYXRfbWVzc2FnZXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2FwcC1jaGF0L3NlcnZlci9jaGF0LnNvY2tldC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9jaGF0LnNvY2tldC5jb2ZmZWUiXSwibmFtZXMiOlsiY2hlY2tOcG1WZXJzaW9ucyIsIm1vZHVsZSIsImxpbmsiLCJ2IiwiTWV0ZW9yIiwicHVibGlzaENvbXBvc2l0ZSIsInNwYWNlX2lkIiwib2JqZWN0X25hbWUiLCJyZWNvcmRfaWQiLCJvcHRpb25zIiwiZGF0YSIsInF1ZXJ5Iiwic2VsZiIsInVuYmxvY2siLCJmaW5kIiwiQ3JlYXRvciIsImdldENvbGxlY3Rpb24iLCJjaGlsZHJlbiIsInB1c2giLCJwYXJlbnQiLCJlIiwib3duZXIiLCJfaWQiLCJmaWVsZHMiLCJuYW1lIiwiYXZhdGFyVXJsIiwiZXJyb3IiLCJjb25zb2xlIiwibG9nIiwicmVmZXJlbmNlX3RvIiwiRmliZXIiLCJQT1JUIiwiU09DS0VURVZFTlROQU1FUyIsIlNPQ0tFVFMiLCJjaGVja0F1dGhUb2tlbiIsImNoZWNrQXV0aFRva2VuRmliZXIiLCJnZXRSZWNlaXZlU29ja2V0S2V5IiwiaHR0cCIsInJlY2VpdmVNZXNzYWdlU29ja2V0cyIsInJlY2VpdmVTdWJzY3JpcHRpb25Tb2NrZXRzIiwic2VuZFVucmVhZEJhZGdlIiwic2VuZFVucmVhZEJhZGdlRmliZXIiLCJzb2NrZXRFbWl0Iiwic29ja2V0X2lvIiwicmVxdWlyZSIsInByb2Nlc3MiLCJlbnYiLCJTT0NLRVRfSU9fUE9SVCIsIk5FV01FU1NBR0UiLCJTVE9QTkVXTUVTU0FHRSIsIlJFQ0VJVkVNRVNTQUdFIiwiU1VCU0NSSVBUSU9OUyIsIlNUT1BORVdTVUJTQ1JJUFRJT05TIiwiUkVDRUlWRVNVQlNDUklQVElPTlMiLCJDT1VOVFVOUkVBRCIsInVzZXJJZCIsImF1dGhUb2tlbiIsImhhc2hlZFRva2VuIiwidXNlciIsIkFjY291bnRzIiwiX2hhc2hMb2dpblRva2VuIiwid3JhcEFzeW5jRmluZE9uZSIsImRiIiwidXNlcnMiLCJzb2NrZXQiLCJjb3VudFVucmVhZCIsInVucmVhZCIsIiRndCIsImZvckVhY2giLCJfciIsInJ1biIsImNoZWNrIiwiU3RlZWRvcyIsImlkIiwiZGlzY29ubmVjdCIsImV2ZW50bmFtZSIsImVtaXQiLCJzdGFydHVwIiwiY2hhdF9tZXNzYWdlc19pbml0IiwiY2hhdF9zdWJzY3JpcHRpb25zX2luaXQiLCJjb3VudGVyIiwiaW8iLCJzZW5kTmV3TWVzc2FnZSIsInNlbmRTdWJzY3JpcHRpb24iLCJzZXJ2ZXIiLCJjcmVhdGVTZXJ2ZXIiLCJvbiIsInJlcXVlc3QiLCJfcXVlcnkiLCJyZXMiLCJrZXkiLCJsaXN0ZW4iLCJtc2ciLCJwYXJ0aWNpcGFudHMiLCJyb29tIiwicmVsYXRlZF90byIsIm8iLCJpZHMiLCJsZW5ndGgiLCJmaW5kT25lIiwibWVtYmVycyIsIl8iLCJtIiwicCIsIiRndGUiLCJEYXRlIiwiY3JlYXRlZF9ieSIsIm1vZGlmaWVkIiwibW9kaWZpZWRfYnkiLCJvYnNlcnZlIiwiYWRkZWQiLCJuZXdEb2N1bWVudCIsImNoYW5nZWQiLCJvbGREb2N1bWVudCIsInJlbW92ZWQiLCJzdWIiLCJfcm9vbSIsIiRpbiIsImZldGNoIiwiJG9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxnQkFBSjtBQUFxQkMsTUFBTSxDQUFDQyxJQUFQLENBQVksb0NBQVosRUFBaUQ7QUFBQ0Ysa0JBQWdCLENBQUNH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V0FBTyxVQUFDQyxXQUFEO0FBQ04sVUFBR2hDLHVCQUFIO0FDZ0VLLGVEL0RKSSxpQkFBaUI0QixXQUFqQixDQytESTtBQUNEO0FEbkVLO0FBSVZDLGFBQVMsVUFBQ0QsV0FBRCxFQUFjRSxXQUFkO0FDa0VMLGFEakVIOUIsaUJBQWlCNEIsV0FBakIsQ0NpRUc7QUR0RU07QUFNVkcsYUFBUyxVQUFDRCxXQUFEO0FDbUVMLGFEbEVIOUIsaUJBQWlCOEIsV0FBakIsQ0NrRUc7QUR6RU07QUFBQSxHQU5YO0FDa0ZDLFNEbkVEbEMsMEJBQTBCLElDbUV6QjtBRHRORixHIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX2FwcC1jaGF0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY2hlY2tOcG1WZXJzaW9ucyB9IGZyb20gJ21ldGVvci90bWVhc2RheTpjaGVjay1ucG0tdmVyc2lvbnMnO1xuY2hlY2tOcG1WZXJzaW9ucyh7XG5cdCdzb2NrZXQuaW8nOiAnPj0xLjQuOCcsXG5cdC8vICdzb2NrZXQuaW8tY2xpZW50JzogXCJeMS40LjhcIlxufSwgJ3N0ZWVkb3M6YXBwLWNoYXQnKTtcbiIsIk1ldGVvci5wdWJsaXNoQ29tcG9zaXRlICdjaGF0X21lc3NhZ2VzJywgKHNwYWNlX2lkLCBvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBvcHRpb25zKS0+XG5cdHF1ZXJ5ID0geydzcGFjZSc6IHNwYWNlX2lkLCdyZWxhdGVkX3RvLm8nOiBvYmplY3RfbmFtZSwncmVsYXRlZF90by5pZHMnOiByZWNvcmRfaWR9XG5cblx0c2VsZiA9IHRoaXNcblxuXHRzZWxmLnVuYmxvY2soKTtcblxuXHRkYXRhID0ge1xuXHRcdGZpbmQ6ICgpLT5cblx0XHRcdHNlbGYudW5ibG9jaygpO1xuXG5cdFx0XHRyZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwiY2hhdF9tZXNzYWdlc1wiKS5maW5kKHF1ZXJ5LCBvcHRpb25zKTtcblx0fVxuXG5cdGRhdGEuY2hpbGRyZW4gPSBbXVxuXG5cdGRhdGEuY2hpbGRyZW4ucHVzaCB7XG5cdFx0ZmluZDogKHBhcmVudCkgLT5cblx0XHRcdHRyeVxuXHRcdFx0XHRzZWxmLnVuYmxvY2soKTtcblx0XHRcdFx0aWYgcGFyZW50Py5vd25lclxuXHRcdFx0XHRcdHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJ1c2Vyc1wiKS5maW5kKHtfaWQ6IHBhcmVudC5vd25lcn0sIHtcblx0XHRcdFx0XHRcdGZpZWxkczoge25hbWU6IDEsIGF2YXRhclVybDogMX1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHJldHVybiBbXVxuXHRcdFx0Y2F0Y2ggZVxuXHRcdFx0XHRjb25zb2xlLmxvZyhyZWZlcmVuY2VfdG8sIHBhcmVudCwgZSlcblx0XHRcdFx0cmV0dXJuIFtdXG5cdH1cblxuXHRyZXR1cm4gZGF0YSIsIk1ldGVvci5wdWJsaXNoQ29tcG9zaXRlKCdjaGF0X21lc3NhZ2VzJywgZnVuY3Rpb24oc3BhY2VfaWQsIG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIG9wdGlvbnMpIHtcbiAgdmFyIGRhdGEsIHF1ZXJ5LCBzZWxmO1xuICBxdWVyeSA9IHtcbiAgICAnc3BhY2UnOiBzcGFjZV9pZCxcbiAgICAncmVsYXRlZF90by5vJzogb2JqZWN0X25hbWUsXG4gICAgJ3JlbGF0ZWRfdG8uaWRzJzogcmVjb3JkX2lkXG4gIH07XG4gIHNlbGYgPSB0aGlzO1xuICBzZWxmLnVuYmxvY2soKTtcbiAgZGF0YSA9IHtcbiAgICBmaW5kOiBmdW5jdGlvbigpIHtcbiAgICAgIHNlbGYudW5ibG9jaygpO1xuICAgICAgcmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcImNoYXRfbWVzc2FnZXNcIikuZmluZChxdWVyeSwgb3B0aW9ucyk7XG4gICAgfVxuICB9O1xuICBkYXRhLmNoaWxkcmVuID0gW107XG4gIGRhdGEuY2hpbGRyZW4ucHVzaCh7XG4gICAgZmluZDogZnVuY3Rpb24ocGFyZW50KSB7XG4gICAgICB2YXIgZTtcbiAgICAgIHRyeSB7XG4gICAgICAgIHNlbGYudW5ibG9jaygpO1xuICAgICAgICBpZiAocGFyZW50ICE9IG51bGwgPyBwYXJlbnQub3duZXIgOiB2b2lkIDApIHtcbiAgICAgICAgICByZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwidXNlcnNcIikuZmluZCh7XG4gICAgICAgICAgICBfaWQ6IHBhcmVudC5vd25lclxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICBuYW1lOiAxLFxuICAgICAgICAgICAgICBhdmF0YXJVcmw6IDFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgY29uc29sZS5sb2cocmVmZXJlbmNlX3RvLCBwYXJlbnQsIGUpO1xuICAgICAgICByZXR1cm4gW107XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGRhdGE7XG59KTtcbiIsImh0dHAgPSByZXF1aXJlICdodHRwJztcbnNvY2tldF9pbyA9IHJlcXVpcmUgJ3NvY2tldC5pbyc7XG5GaWJlciA9IHJlcXVpcmUoJ2ZpYmVycycpO1xuXG5pZiAhcHJvY2Vzcy5lbnYuU09DS0VUX0lPX1BPUlRcblx0cmV0dXJuO1xuXG5QT1JUID0gcHJvY2Vzcy5lbnYuU09DS0VUX0lPX1BPUlQgfHwgODA4MDtcblxuU09DS0VUUyA9IHt9XG5cbiPmjqXmlLbmtojmga/nmoRzb2NrZXTpm4blkIgsa2V555qE5qC85byP5Li6OiB7b2JqZWN0X25hbWV9X3tyZWNvcmRfaWR9X3t1c2VySWR9LCDlgLzkuLpzb2NrZXQg5a+56LGhLCDnm67liY3kuI3mlK/mjIHkuIDkuKrnlKjmiLflpJrkuKpzb2NrZXTmjqXlhaVcbnJlY2VpdmVNZXNzYWdlU29ja2V0cyA9IHtcblxufVxuXG5yZWNlaXZlU3Vic2NyaXB0aW9uU29ja2V0cyA9IHtcblxufVxuXG5TT0NLRVRFVkVOVE5BTUVTID0ge1xuXHRORVdNRVNTQUdFOiAnbmV3IG1lc3NhZ2UnLFxuXHRTVE9QTkVXTUVTU0FHRTogJ3N0b3AgbWVzc2FnZScsXG5cdFJFQ0VJVkVNRVNTQUdFOiAncmVjZWl2ZSBtZXNzYWdlJyxcblx0U1VCU0NSSVBUSU9OUzogJ3N1YnNjcmlwdGlvbnMnLFxuXHRTVE9QTkVXU1VCU0NSSVBUSU9OUzogJ3N0b3Agc3Vic2NyaXB0aW9ucycsXG5cdFJFQ0VJVkVTVUJTQ1JJUFRJT05TOiAncmVjZWl2ZSBzdWJzY3JpcHRpb25zJyxcblx0Q09VTlRVTlJFQUQ6ICdjb3VudCB1bnJlYWQnXG59O1xuXG5jaGVja0F1dGhUb2tlbiA9ICh1c2VySWQsIGF1dGhUb2tlbikgLT5cblx0aWYgdXNlcklkIGFuZCBhdXRoVG9rZW5cblx0XHRoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoVG9rZW4pXG5cdFx0dXNlciA9IHdyYXBBc3luY0ZpbmRPbmUoZGIudXNlcnMsIHtcblx0XHRcdFx0X2lkOiB1c2VySWQsXG5cdFx0XHRcdFwic2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VuXG5cdFx0XHR9XG5cdFx0KVxuXHRcdGlmIHVzZXJcblx0XHRcdHJldHVybiB0cnVlXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIGZhbHNlXG5cdHJldHVybiBmYWxzZVxuXG5cbmdldFJlY2VpdmVTb2NrZXRLZXkgPSAob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgdXNlcklkKS0+XG5cdHJldHVybiBcIiN7b2JqZWN0X25hbWV9XyN7cmVjb3JkX2lkfV8je3VzZXJJZH1cIlxuXG5zZW5kVW5yZWFkQmFkZ2UgPSAoc29ja2V0LCBzcGFjZV9pZCwgb3duZXIpLT5cblx0Y291bnRVbnJlYWQgPSAwXG5cdENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcImNoYXRfc3Vic2NyaXB0aW9uc1wiKS5maW5kKHtcblx0XHRvd25lcjogb3duZXIsXG5cdFx0dW5yZWFkOiB7JGd0OiAwfVxuXHR9LCB7ZmllbGRzOiB7dW5yZWFkOiAxfX0pLmZvckVhY2ggKF9yKS0+XG5cdFx0Y291bnRVbnJlYWQgKz0gX3IudW5yZWFkXG5cdHNvY2tldEVtaXQoc29ja2V0LCBTT0NLRVRFVkVOVE5BTUVTLkNPVU5UVU5SRUFELCBjb3VudFVucmVhZCk7XG5cbiPkvb/nlKhGaWJlcueUqOS6juWkhOeQhumUmeivrzonTWV0ZW9yIGNvZGUgbXVzdCBhbHdheXMgcnVuIHdpdGhpbiBhIEZpYmVyJyAuIOWwneivleS6hk1ldGVvciDmj5DkvpvnmoRNZXRlb3IuYmluZEVudmlyb25tZW50XFxNZXRlb3Iud3JhcEFzeW5j6YO95LiN6IO95aSE55CG5q2k6ZSZ6K+vLlxuc2VuZFVucmVhZEJhZGdlRmliZXIgPSAoc29ja2V0LCBzcGFjZV9pZCwgb3duZXIpLT5cblx0RmliZXIoKCktPlxuXHRcdHNlbmRVbnJlYWRCYWRnZShzb2NrZXQsIHNwYWNlX2lkLCBvd25lcik7XG5cdCkucnVuKCk7XG5cbiNUT0RPOiBGaWJlcui/lOWbnuWAvOmXrumimOWkhOeQhlxuY2hlY2tBdXRoVG9rZW5GaWJlciA9IChzb2NrZXQsIHVzZXJJZCwgYXV0aFRva2VuKS0+XG5cdEZpYmVyKCgpLT5cblx0XHRjaGVjayA9IFN0ZWVkb3MuY2hlY2tBdXRoVG9rZW4odXNlcklkLCBhdXRoVG9rZW4pO1xuXHRcdGlmKCFjaGVjaylcblx0XHRcdFNPQ0tFVFNbc29ja2V0LmlkXSA9IG51bGw7XG5cdFx0XHRzb2NrZXQuZGlzY29ubmVjdCgpO1xuXHQpLnJ1bigpO1xuXG5zb2NrZXRFbWl0ID0gKHNvY2tldCwgZXZlbnRuYW1lLCBkYXRhKSAtPlxuXHRpZiBzb2NrZXQgJiYgU09DS0VUU1tzb2NrZXQuaWRdXG5cdFx0c29ja2V0LmVtaXQoZXZlbnRuYW1lLCBkYXRhKVxuXG5NZXRlb3Iuc3RhcnR1cCAoKS0+XG5cdHNlcnZlciA9IGh0dHAuY3JlYXRlU2VydmVyKCk7XG5cblx0aW8gPSBzb2NrZXRfaW8oc2VydmVyKTtcblxuXHRjb3VudGVyID0gMDtcblxuXHRpby5vbignY29ubmVjdGlvbicsIChzb2NrZXQpLT5cblx0XHRxdWVyeSA9IHNvY2tldC5yZXF1ZXN0Ll9xdWVyeTtcblx0XHR1c2VySWQgPSBxdWVyeVtcIlgtVXNlci1JZFwiXVxuXHRcdGF1dGhUb2tlbiA9IHF1ZXJ5W1wiWC1BdXRoLVRva2VuXCJdXG5cblx0XHRpZiAhdXNlcklkIHx8ICFhdXRoVG9rZW5cblx0XHRcdHNvY2tldC5kaXNjb25uZWN0KCk7XG5cdFx0XHRyZXR1cm47XG5cblx0XHRjaGVja0F1dGhUb2tlbkZpYmVyKHNvY2tldCwgdXNlcklkLCBhdXRoVG9rZW4pXG5cblx0XHRTT0NLRVRTW3NvY2tldC5pZF0gPSBzb2NrZXQ7XG5cblx0XHQj6ZSA5q+Bc29ja2V0XG5cdFx0c29ja2V0Lm9uICdkaXNjb25uZWN0JywgKCktPlxuXHRcdFx0cXVlcnkgPSBzb2NrZXQucmVxdWVzdC5fcXVlcnk7XG5cdFx0XHR1c2VySWQgPSBxdWVyeVtcIlgtVXNlci1JZFwiXVxuXHRcdFx0U09DS0VUU1tzb2NrZXQuaWRdID0gbnVsbDtcblxuXHRcdCPlgZzmraLmjqXmlLbmtojmga9cblx0XHRzb2NrZXQub24gU09DS0VURVZFTlROQU1FUy5TVE9QTkVXTUVTU0FHRSwgKHJlcyktPlxuXHRcdFx0a2V5ID0gZ2V0UmVjZWl2ZVNvY2tldEtleShyZXMub2JqZWN0X25hbWUsIHJlcy5yZWNvcmRfaWQsIHNvY2tldC5yZXF1ZXN0Ll9xdWVyeVtcIlgtVXNlci1JZFwiXSlcblx0XHRcdHJlY2VpdmVNZXNzYWdlU29ja2V0c1trZXldID0gbnVsbDtcblxuXHRcdCPlvIDlp4vmjqXmlLbmtojmga9cblx0XHRzb2NrZXQub24gU09DS0VURVZFTlROQU1FUy5SRUNFSVZFTUVTU0FHRSwgKHJlcyktPlxuXHRcdFx0a2V5ID0gZ2V0UmVjZWl2ZVNvY2tldEtleShyZXMub2JqZWN0X25hbWUsIHJlcy5yZWNvcmRfaWQsIHNvY2tldC5yZXF1ZXN0Ll9xdWVyeVtcIlgtVXNlci1JZFwiXSlcblx0XHRcdHJlY2VpdmVNZXNzYWdlU29ja2V0c1trZXldID0gc29ja2V0O1xuXG5cblx0XHQj5YGc5q2i5o6l5pS25raI5oGvXG5cdFx0c29ja2V0Lm9uIFNPQ0tFVEVWRU5UTkFNRVMuU1RPUE5FV1NVQlNDUklQVElPTlMsIChyZXMpLT5cblx0XHRcdGtleSA9IGdldFJlY2VpdmVTb2NrZXRLZXkocmVzLm9iamVjdF9uYW1lLCAnJywgc29ja2V0LnJlcXVlc3QuX3F1ZXJ5W1wiWC1Vc2VyLUlkXCJdKVxuXHRcdFx0cmVjZWl2ZVN1YnNjcmlwdGlvblNvY2tldHNba2V5XSA9IG51bGw7XG5cblx0XHQj5byA5aeL5o6l5pS25raI5oGvXG5cdFx0c29ja2V0Lm9uIFNPQ0tFVEVWRU5UTkFNRVMuUkVDRUlWRVNVQlNDUklQVElPTlMsIChyZXMpLT5cblx0XHRcdGtleSA9IGdldFJlY2VpdmVTb2NrZXRLZXkocmVzLm9iamVjdF9uYW1lLCAnJywgc29ja2V0LnJlcXVlc3QuX3F1ZXJ5W1wiWC1Vc2VyLUlkXCJdKVxuXHRcdFx0cmVjZWl2ZVN1YnNjcmlwdGlvblNvY2tldHNba2V5XSA9IHNvY2tldDtcblx0XHRcdHNlbmRVbnJlYWRCYWRnZUZpYmVyKHNvY2tldCwgJycsIHNvY2tldC5yZXF1ZXN0Ll9xdWVyeVtcIlgtVXNlci1JZFwiXSk7XG5cdClcblxuXHR0cnlcblx0XHRzZXJ2ZXIubGlzdGVuKFBPUlQpO1xuXHRcdGNvbnNvbGUubG9nKCdjaGF0IHNvY2tldC5pbyBwb3J0JywgUE9SVCk7XG5cdGNhdGNoIGVcblx0XHRjb25zb2xlLmVycm9yKGUpXG5cblx0I+WPkemAgea2iOaBr1xuXHRzZW5kTmV3TWVzc2FnZSA9IChtc2cpIC0+XG5cdFx0aWYgbXNnLnJlbGF0ZWRfdG8ubyAmJiBtc2cucmVsYXRlZF90by5pZHMubGVuZ3RoID4gMFxuXHRcdFx0b2JqZWN0X25hbWUgPSBtc2cucmVsYXRlZF90by5vO1xuXHRcdFx0cmVjb3JkX2lkID0gbXNnLnJlbGF0ZWRfdG8uaWRzWzBdO1xuXHRcdFx0ZGVsZXRlIG1zZy5yZWxhdGVkX3RvXG5cdFx0XHRtc2cub3duZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJ1c2Vyc1wiKS5maW5kT25lKHtfaWQ6IG1zZy5vd25lcn0sIHtcblx0XHRcdFx0ZmllbGRzOiB7XG5cdFx0XHRcdFx0X2lkOiAxLFxuXHRcdFx0XHRcdG5hbWU6IDEsXG5cdFx0XHRcdFx0YXZhdGFyVXJsOiAxXG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHRpZiBvYmplY3RfbmFtZSA9PSAnY2hhdF9yb29tcydcblx0XHRcdFx0cm9vbSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSkuZmluZE9uZSh7X2lkOiByZWNvcmRfaWR9LCB7ZmllbGRzOiB7bWVtYmVyczogMX19KVxuXHRcdFx0XHRpZiByb29tXG5cdFx0XHRcdFx0Xy5mb3JFYWNoIHJvb20/Lm1lbWJlcnMsIChtKS0+XG5cdFx0XHRcdFx0XHRrZXkgPSBnZXRSZWNlaXZlU29ja2V0S2V5KG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIG0pXG5cdFx0XHRcdFx0XHRzb2NrZXRFbWl0KHJlY2VpdmVNZXNzYWdlU29ja2V0c1trZXldLCBTT0NLRVRFVkVOVE5BTUVTLk5FV01FU1NBR0UsIG1zZylcblx0XHRcdGVsc2Vcblx0XHRcdFx0cGFydGljaXBhbnRzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwiY2hhdF9zdWJzY3JpcHRpb25zXCIpLmZpbmQoeydyZWxhdGVkX3RvLm8nOiBvYmplY3RfbmFtZSwgJ3JlbGF0ZWRfdG8uaWRzJzogW3JlY29yZF9pZF19LCB7ZmllbGRzOiB7b3duZXI6IDF9fSlcblx0XHRcdFx0cGFydGljaXBhbnRzLmZvckVhY2ggKHApLT5cblx0XHRcdFx0XHRrZXkgPSBnZXRSZWNlaXZlU29ja2V0S2V5KG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHAub3duZXIpXG5cdFx0XHRcdFx0c29ja2V0RW1pdChyZWNlaXZlTWVzc2FnZVNvY2tldHNba2V5XSwgU09DS0VURVZFTlROQU1FUy5ORVdNRVNTQUdFLCBtc2cpXG5cblxuXHQj6K6i6ZiFY2hhdF9tZXNzYWdlc1xuXHRjaGF0X21lc3NhZ2VzX2luaXQgPSBmYWxzZVxuXHRDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJjaGF0X21lc3NhZ2VzXCIpLmZpbmQoeydjcmVhdGVkJzogeyRndGU6IG5ldyBEYXRlKCl9fSwge1xuXHRcdGZpZWxkczoge1xuXHRcdFx0Y3JlYXRlZF9ieTogMCxcblx0XHRcdG1vZGlmaWVkOiAwLFxuXHRcdFx0bW9kaWZpZWRfYnk6IDBcblx0XHR9XG5cdH0pLm9ic2VydmUge1xuXHRcdGFkZGVkOiAobmV3RG9jdW1lbnQpLT5cblx0XHRcdGlmIGNoYXRfbWVzc2FnZXNfaW5pdFxuXHRcdFx0XHRzZW5kTmV3TWVzc2FnZSBuZXdEb2N1bWVudFxuXHRcdGNoYW5nZWQ6IChuZXdEb2N1bWVudCwgb2xkRG9jdW1lbnQpLT5cblx0XHRcdHNlbmROZXdNZXNzYWdlIG5ld0RvY3VtZW50XG5cdFx0cmVtb3ZlZDogKG9sZERvY3VtZW50KS0+XG5cdFx0XHRzZW5kTmV3TWVzc2FnZSBvbGREb2N1bWVudFxuXHR9XG5cdGNoYXRfbWVzc2FnZXNfaW5pdCA9IHRydWVcblxuXG5cdHNlbmRTdWJzY3JpcHRpb24gPSAoc3ViKS0+XG5cdFx0aWYgc3ViLnJlbGF0ZWRfdG8ubyAmJiBzdWIucmVsYXRlZF90by5pZHMubGVuZ3RoID4gMFxuXHRcdFx0b2JqZWN0X25hbWUgPSBzdWIucmVsYXRlZF90by5vO1xuXHRcdFx0cmVjb3JkX2lkID0gc3ViLnJlbGF0ZWRfdG8uaWRzWzBdO1xuXHRcdFx0c3ViLm1vZGlmaWVkX2J5ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwidXNlcnNcIikuZmluZE9uZSh7X2lkOiBzdWIubW9kaWZpZWRfYnl9LCB7XG5cdFx0XHRcdGZpZWxkczoge1xuXHRcdFx0XHRcdF9pZDogMSxcblx0XHRcdFx0XHRuYW1lOiAxLFxuXHRcdFx0XHRcdGF2YXRhclVybDogMVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0a2V5ID0gZ2V0UmVjZWl2ZVNvY2tldEtleShvYmplY3RfbmFtZSwgJycsIHN1Yi5vd25lcilcblx0XHRcdGlmIHJlY2VpdmVTdWJzY3JpcHRpb25Tb2NrZXRzW2tleV1cblx0XHRcdFx0aWYgb2JqZWN0X25hbWUgPT0gJ2NoYXRfcm9vbXMnXG5cdFx0XHRcdFx0cm9vbSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSkuZmluZE9uZSh7X2lkOiByZWNvcmRfaWR9LCB7ZmllbGRzOiB7bWVtYmVyczogMX19KVxuXHRcdFx0XHRcdGlmIHJvb21cblx0XHRcdFx0XHRcdHN1Yi5fcm9vbSA9IHtcblx0XHRcdFx0XHRcdFx0X2lkOiByb29tLl9pZCxcblx0XHRcdFx0XHRcdFx0bWVtYmVyczogQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwidXNlcnNcIikuZmluZCh7X2lkOiB7JGluOiByb29tLm1lbWJlcnMgfHwgW119fSwge1xuXHRcdFx0XHRcdFx0XHRcdGZpZWxkczoge1xuXHRcdFx0XHRcdFx0XHRcdFx0X2lkOiAxLFxuXHRcdFx0XHRcdFx0XHRcdFx0bmFtZTogMSxcblx0XHRcdFx0XHRcdFx0XHRcdGF2YXRhclVybDogMVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fSkuZmV0Y2goKVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRzb2NrZXRFbWl0KHJlY2VpdmVTdWJzY3JpcHRpb25Tb2NrZXRzW2tleV0sIFNPQ0tFVEVWRU5UTkFNRVMuU1VCU0NSSVBUSU9OUywgc3ViKVxuXHRcdFx0XHRzZW5kVW5yZWFkQmFkZ2UocmVjZWl2ZVN1YnNjcmlwdGlvblNvY2tldHNba2V5XSwgJycsIHN1Yi5vd25lcik7XG5cblx0I+iuoumYhWNoYXRfc3Vic2NyaXB0aW9uc1xuXHRjaGF0X3N1YnNjcmlwdGlvbnNfaW5pdCA9IGZhbHNlXG5cdENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcImNoYXRfc3Vic2NyaXB0aW9uc1wiKS5maW5kKHtcblx0XHQkb3I6IFt7J2NyZWF0ZWQnOiB7JGd0ZTogbmV3IERhdGUoKX19LCAnbW9kaWZpZWQnOiB7JGd0ZTogbmV3IERhdGUoKX1dXG5cdH0sIHtcblx0XHRmaWVsZHM6IHtcblx0XHRcdGNyZWF0ZWRfYnk6IDBcblx0XHR9XG5cdH0pLm9ic2VydmUge1xuXHRcdGFkZGVkOiAobmV3RG9jdW1lbnQpLT5cblx0XHRcdGlmIGNoYXRfc3Vic2NyaXB0aW9uc19pbml0XG5cdFx0XHRcdHNlbmRTdWJzY3JpcHRpb24gbmV3RG9jdW1lbnRcblx0XHRjaGFuZ2VkOiAobmV3RG9jdW1lbnQsIG9sZERvY3VtZW50KS0+XG5cdFx0XHRzZW5kU3Vic2NyaXB0aW9uIG5ld0RvY3VtZW50XG5cdFx0cmVtb3ZlZDogKG9sZERvY3VtZW50KS0+XG5cdFx0XHRzZW5kU3Vic2NyaXB0aW9uIG9sZERvY3VtZW50XG5cdH1cblx0Y2hhdF9zdWJzY3JpcHRpb25zX2luaXQgPSB0cnVlIiwidmFyIEZpYmVyLCBQT1JULCBTT0NLRVRFVkVOVE5BTUVTLCBTT0NLRVRTLCBjaGVja0F1dGhUb2tlbiwgY2hlY2tBdXRoVG9rZW5GaWJlciwgZ2V0UmVjZWl2ZVNvY2tldEtleSwgaHR0cCwgcmVjZWl2ZU1lc3NhZ2VTb2NrZXRzLCByZWNlaXZlU3Vic2NyaXB0aW9uU29ja2V0cywgc2VuZFVucmVhZEJhZGdlLCBzZW5kVW5yZWFkQmFkZ2VGaWJlciwgc29ja2V0RW1pdCwgc29ja2V0X2lvO1xuXG5odHRwID0gcmVxdWlyZSgnaHR0cCcpO1xuXG5zb2NrZXRfaW8gPSByZXF1aXJlKCdzb2NrZXQuaW8nKTtcblxuRmliZXIgPSByZXF1aXJlKCdmaWJlcnMnKTtcblxuaWYgKCFwcm9jZXNzLmVudi5TT0NLRVRfSU9fUE9SVCkge1xuICByZXR1cm47XG59XG5cblBPUlQgPSBwcm9jZXNzLmVudi5TT0NLRVRfSU9fUE9SVCB8fCA4MDgwO1xuXG5TT0NLRVRTID0ge307XG5cbnJlY2VpdmVNZXNzYWdlU29ja2V0cyA9IHt9O1xuXG5yZWNlaXZlU3Vic2NyaXB0aW9uU29ja2V0cyA9IHt9O1xuXG5TT0NLRVRFVkVOVE5BTUVTID0ge1xuICBORVdNRVNTQUdFOiAnbmV3IG1lc3NhZ2UnLFxuICBTVE9QTkVXTUVTU0FHRTogJ3N0b3AgbWVzc2FnZScsXG4gIFJFQ0VJVkVNRVNTQUdFOiAncmVjZWl2ZSBtZXNzYWdlJyxcbiAgU1VCU0NSSVBUSU9OUzogJ3N1YnNjcmlwdGlvbnMnLFxuICBTVE9QTkVXU1VCU0NSSVBUSU9OUzogJ3N0b3Agc3Vic2NyaXB0aW9ucycsXG4gIFJFQ0VJVkVTVUJTQ1JJUFRJT05TOiAncmVjZWl2ZSBzdWJzY3JpcHRpb25zJyxcbiAgQ09VTlRVTlJFQUQ6ICdjb3VudCB1bnJlYWQnXG59O1xuXG5jaGVja0F1dGhUb2tlbiA9IGZ1bmN0aW9uKHVzZXJJZCwgYXV0aFRva2VuKSB7XG4gIHZhciBoYXNoZWRUb2tlbiwgdXNlcjtcbiAgaWYgKHVzZXJJZCAmJiBhdXRoVG9rZW4pIHtcbiAgICBoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoVG9rZW4pO1xuICAgIHVzZXIgPSB3cmFwQXN5bmNGaW5kT25lKGRiLnVzZXJzLCB7XG4gICAgICBfaWQ6IHVzZXJJZCxcbiAgICAgIFwic2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VuXG4gICAgfSk7XG4gICAgaWYgKHVzZXIpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbmdldFJlY2VpdmVTb2NrZXRLZXkgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCB1c2VySWQpIHtcbiAgcmV0dXJuIG9iamVjdF9uYW1lICsgXCJfXCIgKyByZWNvcmRfaWQgKyBcIl9cIiArIHVzZXJJZDtcbn07XG5cbnNlbmRVbnJlYWRCYWRnZSA9IGZ1bmN0aW9uKHNvY2tldCwgc3BhY2VfaWQsIG93bmVyKSB7XG4gIHZhciBjb3VudFVucmVhZDtcbiAgY291bnRVbnJlYWQgPSAwO1xuICBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJjaGF0X3N1YnNjcmlwdGlvbnNcIikuZmluZCh7XG4gICAgb3duZXI6IG93bmVyLFxuICAgIHVucmVhZDoge1xuICAgICAgJGd0OiAwXG4gICAgfVxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICB1bnJlYWQ6IDFcbiAgICB9XG4gIH0pLmZvckVhY2goZnVuY3Rpb24oX3IpIHtcbiAgICByZXR1cm4gY291bnRVbnJlYWQgKz0gX3IudW5yZWFkO1xuICB9KTtcbiAgcmV0dXJuIHNvY2tldEVtaXQoc29ja2V0LCBTT0NLRVRFVkVOVE5BTUVTLkNPVU5UVU5SRUFELCBjb3VudFVucmVhZCk7XG59O1xuXG5zZW5kVW5yZWFkQmFkZ2VGaWJlciA9IGZ1bmN0aW9uKHNvY2tldCwgc3BhY2VfaWQsIG93bmVyKSB7XG4gIHJldHVybiBGaWJlcihmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gc2VuZFVucmVhZEJhZGdlKHNvY2tldCwgc3BhY2VfaWQsIG93bmVyKTtcbiAgfSkucnVuKCk7XG59O1xuXG5jaGVja0F1dGhUb2tlbkZpYmVyID0gZnVuY3Rpb24oc29ja2V0LCB1c2VySWQsIGF1dGhUb2tlbikge1xuICByZXR1cm4gRmliZXIoZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNoZWNrO1xuICAgIGNoZWNrID0gU3RlZWRvcy5jaGVja0F1dGhUb2tlbih1c2VySWQsIGF1dGhUb2tlbik7XG4gICAgaWYgKCFjaGVjaykge1xuICAgICAgU09DS0VUU1tzb2NrZXQuaWRdID0gbnVsbDtcbiAgICAgIHJldHVybiBzb2NrZXQuZGlzY29ubmVjdCgpO1xuICAgIH1cbiAgfSkucnVuKCk7XG59O1xuXG5zb2NrZXRFbWl0ID0gZnVuY3Rpb24oc29ja2V0LCBldmVudG5hbWUsIGRhdGEpIHtcbiAgaWYgKHNvY2tldCAmJiBTT0NLRVRTW3NvY2tldC5pZF0pIHtcbiAgICByZXR1cm4gc29ja2V0LmVtaXQoZXZlbnRuYW1lLCBkYXRhKTtcbiAgfVxufTtcblxuTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHZhciBjaGF0X21lc3NhZ2VzX2luaXQsIGNoYXRfc3Vic2NyaXB0aW9uc19pbml0LCBjb3VudGVyLCBlLCBpbywgc2VuZE5ld01lc3NhZ2UsIHNlbmRTdWJzY3JpcHRpb24sIHNlcnZlcjtcbiAgc2VydmVyID0gaHR0cC5jcmVhdGVTZXJ2ZXIoKTtcbiAgaW8gPSBzb2NrZXRfaW8oc2VydmVyKTtcbiAgY291bnRlciA9IDA7XG4gIGlvLm9uKCdjb25uZWN0aW9uJywgZnVuY3Rpb24oc29ja2V0KSB7XG4gICAgdmFyIGF1dGhUb2tlbiwgcXVlcnksIHVzZXJJZDtcbiAgICBxdWVyeSA9IHNvY2tldC5yZXF1ZXN0Ll9xdWVyeTtcbiAgICB1c2VySWQgPSBxdWVyeVtcIlgtVXNlci1JZFwiXTtcbiAgICBhdXRoVG9rZW4gPSBxdWVyeVtcIlgtQXV0aC1Ub2tlblwiXTtcbiAgICBpZiAoIXVzZXJJZCB8fCAhYXV0aFRva2VuKSB7XG4gICAgICBzb2NrZXQuZGlzY29ubmVjdCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjaGVja0F1dGhUb2tlbkZpYmVyKHNvY2tldCwgdXNlcklkLCBhdXRoVG9rZW4pO1xuICAgIFNPQ0tFVFNbc29ja2V0LmlkXSA9IHNvY2tldDtcbiAgICBzb2NrZXQub24oJ2Rpc2Nvbm5lY3QnLCBmdW5jdGlvbigpIHtcbiAgICAgIHF1ZXJ5ID0gc29ja2V0LnJlcXVlc3QuX3F1ZXJ5O1xuICAgICAgdXNlcklkID0gcXVlcnlbXCJYLVVzZXItSWRcIl07XG4gICAgICByZXR1cm4gU09DS0VUU1tzb2NrZXQuaWRdID0gbnVsbDtcbiAgICB9KTtcbiAgICBzb2NrZXQub24oU09DS0VURVZFTlROQU1FUy5TVE9QTkVXTUVTU0FHRSwgZnVuY3Rpb24ocmVzKSB7XG4gICAgICB2YXIga2V5O1xuICAgICAga2V5ID0gZ2V0UmVjZWl2ZVNvY2tldEtleShyZXMub2JqZWN0X25hbWUsIHJlcy5yZWNvcmRfaWQsIHNvY2tldC5yZXF1ZXN0Ll9xdWVyeVtcIlgtVXNlci1JZFwiXSk7XG4gICAgICByZXR1cm4gcmVjZWl2ZU1lc3NhZ2VTb2NrZXRzW2tleV0gPSBudWxsO1xuICAgIH0pO1xuICAgIHNvY2tldC5vbihTT0NLRVRFVkVOVE5BTUVTLlJFQ0VJVkVNRVNTQUdFLCBmdW5jdGlvbihyZXMpIHtcbiAgICAgIHZhciBrZXk7XG4gICAgICBrZXkgPSBnZXRSZWNlaXZlU29ja2V0S2V5KHJlcy5vYmplY3RfbmFtZSwgcmVzLnJlY29yZF9pZCwgc29ja2V0LnJlcXVlc3QuX3F1ZXJ5W1wiWC1Vc2VyLUlkXCJdKTtcbiAgICAgIHJldHVybiByZWNlaXZlTWVzc2FnZVNvY2tldHNba2V5XSA9IHNvY2tldDtcbiAgICB9KTtcbiAgICBzb2NrZXQub24oU09DS0VURVZFTlROQU1FUy5TVE9QTkVXU1VCU0NSSVBUSU9OUywgZnVuY3Rpb24ocmVzKSB7XG4gICAgICB2YXIga2V5O1xuICAgICAga2V5ID0gZ2V0UmVjZWl2ZVNvY2tldEtleShyZXMub2JqZWN0X25hbWUsICcnLCBzb2NrZXQucmVxdWVzdC5fcXVlcnlbXCJYLVVzZXItSWRcIl0pO1xuICAgICAgcmV0dXJuIHJlY2VpdmVTdWJzY3JpcHRpb25Tb2NrZXRzW2tleV0gPSBudWxsO1xuICAgIH0pO1xuICAgIHJldHVybiBzb2NrZXQub24oU09DS0VURVZFTlROQU1FUy5SRUNFSVZFU1VCU0NSSVBUSU9OUywgZnVuY3Rpb24ocmVzKSB7XG4gICAgICB2YXIga2V5O1xuICAgICAga2V5ID0gZ2V0UmVjZWl2ZVNvY2tldEtleShyZXMub2JqZWN0X25hbWUsICcnLCBzb2NrZXQucmVxdWVzdC5fcXVlcnlbXCJYLVVzZXItSWRcIl0pO1xuICAgICAgcmVjZWl2ZVN1YnNjcmlwdGlvblNvY2tldHNba2V5XSA9IHNvY2tldDtcbiAgICAgIHJldHVybiBzZW5kVW5yZWFkQmFkZ2VGaWJlcihzb2NrZXQsICcnLCBzb2NrZXQucmVxdWVzdC5fcXVlcnlbXCJYLVVzZXItSWRcIl0pO1xuICAgIH0pO1xuICB9KTtcbiAgdHJ5IHtcbiAgICBzZXJ2ZXIubGlzdGVuKFBPUlQpO1xuICAgIGNvbnNvbGUubG9nKCdjaGF0IHNvY2tldC5pbyBwb3J0JywgUE9SVCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZSA9IGVycm9yO1xuICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gIH1cbiAgc2VuZE5ld01lc3NhZ2UgPSBmdW5jdGlvbihtc2cpIHtcbiAgICB2YXIgb2JqZWN0X25hbWUsIHBhcnRpY2lwYW50cywgcmVjb3JkX2lkLCByb29tO1xuICAgIGlmIChtc2cucmVsYXRlZF90by5vICYmIG1zZy5yZWxhdGVkX3RvLmlkcy5sZW5ndGggPiAwKSB7XG4gICAgICBvYmplY3RfbmFtZSA9IG1zZy5yZWxhdGVkX3RvLm87XG4gICAgICByZWNvcmRfaWQgPSBtc2cucmVsYXRlZF90by5pZHNbMF07XG4gICAgICBkZWxldGUgbXNnLnJlbGF0ZWRfdG87XG4gICAgICBtc2cub3duZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJ1c2Vyc1wiKS5maW5kT25lKHtcbiAgICAgICAgX2lkOiBtc2cub3duZXJcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgX2lkOiAxLFxuICAgICAgICAgIG5hbWU6IDEsXG4gICAgICAgICAgYXZhdGFyVXJsOiAxXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgaWYgKG9iamVjdF9uYW1lID09PSAnY2hhdF9yb29tcycpIHtcbiAgICAgICAgcm9vbSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSkuZmluZE9uZSh7XG4gICAgICAgICAgX2lkOiByZWNvcmRfaWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgbWVtYmVyczogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChyb29tKSB7XG4gICAgICAgICAgcmV0dXJuIF8uZm9yRWFjaChyb29tICE9IG51bGwgPyByb29tLm1lbWJlcnMgOiB2b2lkIDAsIGZ1bmN0aW9uKG0pIHtcbiAgICAgICAgICAgIHZhciBrZXk7XG4gICAgICAgICAgICBrZXkgPSBnZXRSZWNlaXZlU29ja2V0S2V5KG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIG0pO1xuICAgICAgICAgICAgcmV0dXJuIHNvY2tldEVtaXQocmVjZWl2ZU1lc3NhZ2VTb2NrZXRzW2tleV0sIFNPQ0tFVEVWRU5UTkFNRVMuTkVXTUVTU0FHRSwgbXNnKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGFydGljaXBhbnRzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwiY2hhdF9zdWJzY3JpcHRpb25zXCIpLmZpbmQoe1xuICAgICAgICAgICdyZWxhdGVkX3RvLm8nOiBvYmplY3RfbmFtZSxcbiAgICAgICAgICAncmVsYXRlZF90by5pZHMnOiBbcmVjb3JkX2lkXVxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBvd25lcjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwYXJ0aWNpcGFudHMuZm9yRWFjaChmdW5jdGlvbihwKSB7XG4gICAgICAgICAgdmFyIGtleTtcbiAgICAgICAgICBrZXkgPSBnZXRSZWNlaXZlU29ja2V0S2V5KG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHAub3duZXIpO1xuICAgICAgICAgIHJldHVybiBzb2NrZXRFbWl0KHJlY2VpdmVNZXNzYWdlU29ja2V0c1trZXldLCBTT0NLRVRFVkVOVE5BTUVTLk5FV01FU1NBR0UsIG1zZyk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgY2hhdF9tZXNzYWdlc19pbml0ID0gZmFsc2U7XG4gIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcImNoYXRfbWVzc2FnZXNcIikuZmluZCh7XG4gICAgJ2NyZWF0ZWQnOiB7XG4gICAgICAkZ3RlOiBuZXcgRGF0ZSgpXG4gICAgfVxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICBtb2RpZmllZF9ieTogMFxuICAgIH1cbiAgfSkub2JzZXJ2ZSh7XG4gICAgYWRkZWQ6IGZ1bmN0aW9uKG5ld0RvY3VtZW50KSB7XG4gICAgICBpZiAoY2hhdF9tZXNzYWdlc19pbml0KSB7XG4gICAgICAgIHJldHVybiBzZW5kTmV3TWVzc2FnZShuZXdEb2N1bWVudCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBjaGFuZ2VkOiBmdW5jdGlvbihuZXdEb2N1bWVudCwgb2xkRG9jdW1lbnQpIHtcbiAgICAgIHJldHVybiBzZW5kTmV3TWVzc2FnZShuZXdEb2N1bWVudCk7XG4gICAgfSxcbiAgICByZW1vdmVkOiBmdW5jdGlvbihvbGREb2N1bWVudCkge1xuICAgICAgcmV0dXJuIHNlbmROZXdNZXNzYWdlKG9sZERvY3VtZW50KTtcbiAgICB9XG4gIH0pO1xuICBjaGF0X21lc3NhZ2VzX2luaXQgPSB0cnVlO1xuICBzZW5kU3Vic2NyaXB0aW9uID0gZnVuY3Rpb24oc3ViKSB7XG4gICAgdmFyIGtleSwgb2JqZWN0X25hbWUsIHJlY29yZF9pZCwgcm9vbTtcbiAgICBpZiAoc3ViLnJlbGF0ZWRfdG8ubyAmJiBzdWIucmVsYXRlZF90by5pZHMubGVuZ3RoID4gMCkge1xuICAgICAgb2JqZWN0X25hbWUgPSBzdWIucmVsYXRlZF90by5vO1xuICAgICAgcmVjb3JkX2lkID0gc3ViLnJlbGF0ZWRfdG8uaWRzWzBdO1xuICAgICAgc3ViLm1vZGlmaWVkX2J5ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwidXNlcnNcIikuZmluZE9uZSh7XG4gICAgICAgIF9pZDogc3ViLm1vZGlmaWVkX2J5XG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICBuYW1lOiAxLFxuICAgICAgICAgIGF2YXRhclVybDogMVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGtleSA9IGdldFJlY2VpdmVTb2NrZXRLZXkob2JqZWN0X25hbWUsICcnLCBzdWIub3duZXIpO1xuICAgICAgaWYgKHJlY2VpdmVTdWJzY3JpcHRpb25Tb2NrZXRzW2tleV0pIHtcbiAgICAgICAgaWYgKG9iamVjdF9uYW1lID09PSAnY2hhdF9yb29tcycpIHtcbiAgICAgICAgICByb29tID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lKS5maW5kT25lKHtcbiAgICAgICAgICAgIF9pZDogcmVjb3JkX2lkXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgIG1lbWJlcnM6IDFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAocm9vbSkge1xuICAgICAgICAgICAgc3ViLl9yb29tID0ge1xuICAgICAgICAgICAgICBfaWQ6IHJvb20uX2lkLFxuICAgICAgICAgICAgICBtZW1iZXJzOiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJ1c2Vyc1wiKS5maW5kKHtcbiAgICAgICAgICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAgICAgICAgICRpbjogcm9vbS5tZW1iZXJzIHx8IFtdXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgICAgICBfaWQ6IDEsXG4gICAgICAgICAgICAgICAgICBuYW1lOiAxLFxuICAgICAgICAgICAgICAgICAgYXZhdGFyVXJsOiAxXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KS5mZXRjaCgpXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzb2NrZXRFbWl0KHJlY2VpdmVTdWJzY3JpcHRpb25Tb2NrZXRzW2tleV0sIFNPQ0tFVEVWRU5UTkFNRVMuU1VCU0NSSVBUSU9OUywgc3ViKTtcbiAgICAgICAgcmV0dXJuIHNlbmRVbnJlYWRCYWRnZShyZWNlaXZlU3Vic2NyaXB0aW9uU29ja2V0c1trZXldLCAnJywgc3ViLm93bmVyKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIGNoYXRfc3Vic2NyaXB0aW9uc19pbml0ID0gZmFsc2U7XG4gIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcImNoYXRfc3Vic2NyaXB0aW9uc1wiKS5maW5kKHtcbiAgICAkb3I6IFtcbiAgICAgIHtcbiAgICAgICAgJ2NyZWF0ZWQnOiB7XG4gICAgICAgICAgJGd0ZTogbmV3IERhdGUoKVxuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgICdtb2RpZmllZCc6IHtcbiAgICAgICAgICAkZ3RlOiBuZXcgRGF0ZSgpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBdXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIGNyZWF0ZWRfYnk6IDBcbiAgICB9XG4gIH0pLm9ic2VydmUoe1xuICAgIGFkZGVkOiBmdW5jdGlvbihuZXdEb2N1bWVudCkge1xuICAgICAgaWYgKGNoYXRfc3Vic2NyaXB0aW9uc19pbml0KSB7XG4gICAgICAgIHJldHVybiBzZW5kU3Vic2NyaXB0aW9uKG5ld0RvY3VtZW50KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGNoYW5nZWQ6IGZ1bmN0aW9uKG5ld0RvY3VtZW50LCBvbGREb2N1bWVudCkge1xuICAgICAgcmV0dXJuIHNlbmRTdWJzY3JpcHRpb24obmV3RG9jdW1lbnQpO1xuICAgIH0sXG4gICAgcmVtb3ZlZDogZnVuY3Rpb24ob2xkRG9jdW1lbnQpIHtcbiAgICAgIHJldHVybiBzZW5kU3Vic2NyaXB0aW9uKG9sZERvY3VtZW50KTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gY2hhdF9zdWJzY3JpcHRpb25zX2luaXQgPSB0cnVlO1xufSk7XG4iXX0=
