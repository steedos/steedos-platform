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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczphcHAtY2hhdC9jaGVja05wbS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hcHAtY2hhdC9zZXJ2ZXIvcHVibGljYXRpb25zL2NoYXRfbWVzc2FnZXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcHVibGljYXRpb25zL2NoYXRfbWVzc2FnZXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2FwcC1jaGF0L3NlcnZlci9jaGF0LnNvY2tldC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9jaGF0LnNvY2tldC5jb2ZmZWUiXSwibmFtZXMiOlsiY2hlY2tOcG1WZXJzaW9ucyIsIm1vZHVsZSIsImxpbmsiLCJ2IiwiTWV0ZW9yIiwicHVibGlzaENvbXBvc2l0ZSIsInNwYWNlX2lkIiwib2JqZWN0X25hbWUiLCJyZWNvcmRfaWQiLCJvcHRpb25zIiwiZGF0YSIsInF1ZXJ5Iiwic2VsZiIsInVuYmxvY2siLCJmaW5kIiwiQ3JlYXRvciIsImdldENvbGxlY3Rpb24iLCJjaGlsZHJlbiIsInB1c2giLCJwYXJlbnQiLCJlIiwib3duZXIiLCJfaWQiLCJmaWVsZHMiLCJuYW1lIiwiYXZhdGFyVXJsIiwiZXJyb3IiLCJjb25zb2xlIiwibG9nIiwicmVmZXJlbmNlX3RvIiwiRmliZXIiLCJQT1JUIiwiU09DS0VURVZFTlROQU1FUyIsIlNPQ0tFVFMiLCJjaGVja0F1dGhUb2tlbiIsImNoZWNrQXV0aFRva2VuRmliZXIiLCJnZXRSZWNlaXZlU29ja2V0S2V5IiwiaHR0cCIsInJlY2VpdmVNZXNzYWdlU29ja2V0cyIsInJlY2VpdmVTdWJzY3JpcHRpb25Tb2NrZXRzIiwic2VuZFVucmVhZEJhZGdlIiwic2VuZFVucmVhZEJhZGdlRmliZXIiLCJzb2NrZXRFbWl0Iiwic29ja2V0X2lvIiwicmVxdWlyZSIsInByb2Nlc3MiLCJlbnYiLCJTT0NLRVRfSU9fUE9SVCIsIk5FV01FU1NBR0UiLCJTVE9QTkVXTUVTU0FHRSIsIlJFQ0VJVkVNRVNTQUdFIiwiU1VCU0NSSVBUSU9OUyIsIlNUT1BORVdTVUJTQ1JJUFRJT05TIiwiUkVDRUlWRVNVQlNDUklQVElPTlMiLCJDT1VOVFVOUkVBRCIsInVzZXJJZCIsImF1dGhUb2tlbiIsImhhc2hlZFRva2VuIiwidXNlciIsIkFjY291bnRzIiwiX2hhc2hMb2dpblRva2VuIiwid3JhcEFzeW5jRmluZE9uZSIsImRiIiwidXNlcnMiLCJzb2NrZXQiLCJjb3VudFVucmVhZCIsInVucmVhZCIsIiRndCIsImZvckVhY2giLCJfciIsInJ1biIsImNoZWNrIiwiU3RlZWRvcyIsImlkIiwiZGlzY29ubmVjdCIsImV2ZW50bmFtZSIsImVtaXQiLCJzdGFydHVwIiwiY2hhdF9tZXNzYWdlc19pbml0IiwiY2hhdF9zdWJzY3JpcHRpb25zX2luaXQiLCJjb3VudGVyIiwiaW8iLCJzZW5kTmV3TWVzc2FnZSIsInNlbmRTdWJzY3JpcHRpb24iLCJzZXJ2ZXIiLCJjcmVhdGVTZXJ2ZXIiLCJvbiIsInJlcXVlc3QiLCJfcXVlcnkiLCJyZXMiLCJrZXkiLCJsaXN0ZW4iLCJtc2ciLCJwYXJ0aWNpcGFudHMiLCJyb29tIiwicmVsYXRlZF90byIsIm8iLCJpZHMiLCJsZW5ndGgiLCJmaW5kT25lIiwibWVtYmVycyIsIl8iLCJtIiwicCIsIiRndGUiLCJEYXRlIiwiY3JlYXRlZF9ieSIsIm1vZGlmaWVkIiwibW9kaWZpZWRfYnkiLCJvYnNlcnZlIiwiYWRkZWQiLCJuZXdEb2N1bWVudCIsImNoYW5nZWQiLCJvbGREb2N1bWVudCIsInJlbW92ZWQiLCJzdWIiLCJfcm9vbSIsIiRpbiIsImZldGNoIiwiJG9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxnQkFBSjtBQUFxQkMsTUFBTSxDQUFDQyxJQUFQLENBQVksb0NBQVosRUFBaUQ7QUFBQ0Ysa0JBQWdCLENBQUNH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QUNEO0FEbkVLO0FBSVZDLGFBQVMsVUFBQ0QsV0FBRCxFQUFjRSxXQUFkO0FDa0VMLGFEakVIOUIsaUJBQWlCNEIsV0FBakIsQ0NpRUc7QUR0RU07QUFNVkcsYUFBUyxVQUFDRCxXQUFEO0FDbUVMLGFEbEVIOUIsaUJBQWlCOEIsV0FBakIsQ0NrRUc7QUR6RU07QUFBQSxHQU5YO0FDa0ZDLFNEbkVEbEMsMEJBQTBCLElDbUV6QjtBRHRORixHIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX2FwcC1jaGF0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY2hlY2tOcG1WZXJzaW9ucyB9IGZyb20gJ21ldGVvci90bWVhc2RheTpjaGVjay1ucG0tdmVyc2lvbnMnO1xuIiwiTWV0ZW9yLnB1Ymxpc2hDb21wb3NpdGUgJ2NoYXRfbWVzc2FnZXMnLCAoc3BhY2VfaWQsIG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIG9wdGlvbnMpLT5cblx0cXVlcnkgPSB7J3NwYWNlJzogc3BhY2VfaWQsJ3JlbGF0ZWRfdG8ubyc6IG9iamVjdF9uYW1lLCdyZWxhdGVkX3RvLmlkcyc6IHJlY29yZF9pZH1cblxuXHRzZWxmID0gdGhpc1xuXG5cdHNlbGYudW5ibG9jaygpO1xuXG5cdGRhdGEgPSB7XG5cdFx0ZmluZDogKCktPlxuXHRcdFx0c2VsZi51bmJsb2NrKCk7XG5cblx0XHRcdHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJjaGF0X21lc3NhZ2VzXCIpLmZpbmQocXVlcnksIG9wdGlvbnMpO1xuXHR9XG5cblx0ZGF0YS5jaGlsZHJlbiA9IFtdXG5cblx0ZGF0YS5jaGlsZHJlbi5wdXNoIHtcblx0XHRmaW5kOiAocGFyZW50KSAtPlxuXHRcdFx0dHJ5XG5cdFx0XHRcdHNlbGYudW5ibG9jaygpO1xuXHRcdFx0XHRpZiBwYXJlbnQ/Lm93bmVyXG5cdFx0XHRcdFx0cmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInVzZXJzXCIpLmZpbmQoe19pZDogcGFyZW50Lm93bmVyfSwge1xuXHRcdFx0XHRcdFx0ZmllbGRzOiB7bmFtZTogMSwgYXZhdGFyVXJsOiAxfVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0cmV0dXJuIFtdXG5cdFx0XHRjYXRjaCBlXG5cdFx0XHRcdGNvbnNvbGUubG9nKHJlZmVyZW5jZV90bywgcGFyZW50LCBlKVxuXHRcdFx0XHRyZXR1cm4gW11cblx0fVxuXG5cdHJldHVybiBkYXRhIiwiTWV0ZW9yLnB1Ymxpc2hDb21wb3NpdGUoJ2NoYXRfbWVzc2FnZXMnLCBmdW5jdGlvbihzcGFjZV9pZCwgb2JqZWN0X25hbWUsIHJlY29yZF9pZCwgb3B0aW9ucykge1xuICB2YXIgZGF0YSwgcXVlcnksIHNlbGY7XG4gIHF1ZXJ5ID0ge1xuICAgICdzcGFjZSc6IHNwYWNlX2lkLFxuICAgICdyZWxhdGVkX3RvLm8nOiBvYmplY3RfbmFtZSxcbiAgICAncmVsYXRlZF90by5pZHMnOiByZWNvcmRfaWRcbiAgfTtcbiAgc2VsZiA9IHRoaXM7XG4gIHNlbGYudW5ibG9jaygpO1xuICBkYXRhID0ge1xuICAgIGZpbmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgc2VsZi51bmJsb2NrKCk7XG4gICAgICByZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwiY2hhdF9tZXNzYWdlc1wiKS5maW5kKHF1ZXJ5LCBvcHRpb25zKTtcbiAgICB9XG4gIH07XG4gIGRhdGEuY2hpbGRyZW4gPSBbXTtcbiAgZGF0YS5jaGlsZHJlbi5wdXNoKHtcbiAgICBmaW5kOiBmdW5jdGlvbihwYXJlbnQpIHtcbiAgICAgIHZhciBlO1xuICAgICAgdHJ5IHtcbiAgICAgICAgc2VsZi51bmJsb2NrKCk7XG4gICAgICAgIGlmIChwYXJlbnQgIT0gbnVsbCA/IHBhcmVudC5vd25lciA6IHZvaWQgMCkge1xuICAgICAgICAgIHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJ1c2Vyc1wiKS5maW5kKHtcbiAgICAgICAgICAgIF9pZDogcGFyZW50Lm93bmVyXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgIG5hbWU6IDEsXG4gICAgICAgICAgICAgIGF2YXRhclVybDogMVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICBjb25zb2xlLmxvZyhyZWZlcmVuY2VfdG8sIHBhcmVudCwgZSk7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gZGF0YTtcbn0pO1xuIiwiaHR0cCA9IHJlcXVpcmUgJ2h0dHAnO1xuc29ja2V0X2lvID0gcmVxdWlyZSAnc29ja2V0LmlvJztcbkZpYmVyID0gcmVxdWlyZSgnZmliZXJzJyk7XG5cbmlmICFwcm9jZXNzLmVudi5TT0NLRVRfSU9fUE9SVFxuXHRyZXR1cm47XG5cblBPUlQgPSBwcm9jZXNzLmVudi5TT0NLRVRfSU9fUE9SVCB8fCA4MDgwO1xuXG5TT0NLRVRTID0ge31cblxuI+aOpeaUtua2iOaBr+eahHNvY2tldOmbhuWQiCxrZXnnmoTmoLzlvI/kuLo6IHtvYmplY3RfbmFtZX1fe3JlY29yZF9pZH1fe3VzZXJJZH0sIOWAvOS4unNvY2tldCDlr7nosaEsIOebruWJjeS4jeaUr+aMgeS4gOS4queUqOaIt+WkmuS4qnNvY2tldOaOpeWFpVxucmVjZWl2ZU1lc3NhZ2VTb2NrZXRzID0ge1xuXG59XG5cbnJlY2VpdmVTdWJzY3JpcHRpb25Tb2NrZXRzID0ge1xuXG59XG5cblNPQ0tFVEVWRU5UTkFNRVMgPSB7XG5cdE5FV01FU1NBR0U6ICduZXcgbWVzc2FnZScsXG5cdFNUT1BORVdNRVNTQUdFOiAnc3RvcCBtZXNzYWdlJyxcblx0UkVDRUlWRU1FU1NBR0U6ICdyZWNlaXZlIG1lc3NhZ2UnLFxuXHRTVUJTQ1JJUFRJT05TOiAnc3Vic2NyaXB0aW9ucycsXG5cdFNUT1BORVdTVUJTQ1JJUFRJT05TOiAnc3RvcCBzdWJzY3JpcHRpb25zJyxcblx0UkVDRUlWRVNVQlNDUklQVElPTlM6ICdyZWNlaXZlIHN1YnNjcmlwdGlvbnMnLFxuXHRDT1VOVFVOUkVBRDogJ2NvdW50IHVucmVhZCdcbn07XG5cbmNoZWNrQXV0aFRva2VuID0gKHVzZXJJZCwgYXV0aFRva2VuKSAtPlxuXHRpZiB1c2VySWQgYW5kIGF1dGhUb2tlblxuXHRcdGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGF1dGhUb2tlbilcblx0XHR1c2VyID0gd3JhcEFzeW5jRmluZE9uZShkYi51c2Vycywge1xuXHRcdFx0XHRfaWQ6IHVzZXJJZCxcblx0XHRcdFx0XCJzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnMuaGFzaGVkVG9rZW5cIjogaGFzaGVkVG9rZW5cblx0XHRcdH1cblx0XHQpXG5cdFx0aWYgdXNlclxuXHRcdFx0cmV0dXJuIHRydWVcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gZmFsc2Vcblx0cmV0dXJuIGZhbHNlXG5cblxuZ2V0UmVjZWl2ZVNvY2tldEtleSA9IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCB1c2VySWQpLT5cblx0cmV0dXJuIFwiI3tvYmplY3RfbmFtZX1fI3tyZWNvcmRfaWR9XyN7dXNlcklkfVwiXG5cbnNlbmRVbnJlYWRCYWRnZSA9IChzb2NrZXQsIHNwYWNlX2lkLCBvd25lciktPlxuXHRjb3VudFVucmVhZCA9IDBcblx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKFwiY2hhdF9zdWJzY3JpcHRpb25zXCIpLmZpbmQoe1xuXHRcdG93bmVyOiBvd25lcixcblx0XHR1bnJlYWQ6IHskZ3Q6IDB9XG5cdH0sIHtmaWVsZHM6IHt1bnJlYWQ6IDF9fSkuZm9yRWFjaCAoX3IpLT5cblx0XHRjb3VudFVucmVhZCArPSBfci51bnJlYWRcblx0c29ja2V0RW1pdChzb2NrZXQsIFNPQ0tFVEVWRU5UTkFNRVMuQ09VTlRVTlJFQUQsIGNvdW50VW5yZWFkKTtcblxuI+S9v+eUqEZpYmVy55So5LqO5aSE55CG6ZSZ6K+vOidNZXRlb3IgY29kZSBtdXN0IGFsd2F5cyBydW4gd2l0aGluIGEgRmliZXInIC4g5bCd6K+V5LqGTWV0ZW9yIOaPkOS+m+eahE1ldGVvci5iaW5kRW52aXJvbm1lbnRcXE1ldGVvci53cmFwQXN5bmPpg73kuI3og73lpITnkIbmraTplJnor68uXG5zZW5kVW5yZWFkQmFkZ2VGaWJlciA9IChzb2NrZXQsIHNwYWNlX2lkLCBvd25lciktPlxuXHRGaWJlcigoKS0+XG5cdFx0c2VuZFVucmVhZEJhZGdlKHNvY2tldCwgc3BhY2VfaWQsIG93bmVyKTtcblx0KS5ydW4oKTtcblxuI1RPRE86IEZpYmVy6L+U5Zue5YC86Zeu6aKY5aSE55CGXG5jaGVja0F1dGhUb2tlbkZpYmVyID0gKHNvY2tldCwgdXNlcklkLCBhdXRoVG9rZW4pLT5cblx0RmliZXIoKCktPlxuXHRcdGNoZWNrID0gU3RlZWRvcy5jaGVja0F1dGhUb2tlbih1c2VySWQsIGF1dGhUb2tlbik7XG5cdFx0aWYoIWNoZWNrKVxuXHRcdFx0U09DS0VUU1tzb2NrZXQuaWRdID0gbnVsbDtcblx0XHRcdHNvY2tldC5kaXNjb25uZWN0KCk7XG5cdCkucnVuKCk7XG5cbnNvY2tldEVtaXQgPSAoc29ja2V0LCBldmVudG5hbWUsIGRhdGEpIC0+XG5cdGlmIHNvY2tldCAmJiBTT0NLRVRTW3NvY2tldC5pZF1cblx0XHRzb2NrZXQuZW1pdChldmVudG5hbWUsIGRhdGEpXG5cbk1ldGVvci5zdGFydHVwICgpLT5cblx0c2VydmVyID0gaHR0cC5jcmVhdGVTZXJ2ZXIoKTtcblxuXHRpbyA9IHNvY2tldF9pbyhzZXJ2ZXIpO1xuXG5cdGNvdW50ZXIgPSAwO1xuXG5cdGlvLm9uKCdjb25uZWN0aW9uJywgKHNvY2tldCktPlxuXHRcdHF1ZXJ5ID0gc29ja2V0LnJlcXVlc3QuX3F1ZXJ5O1xuXHRcdHVzZXJJZCA9IHF1ZXJ5W1wiWC1Vc2VyLUlkXCJdXG5cdFx0YXV0aFRva2VuID0gcXVlcnlbXCJYLUF1dGgtVG9rZW5cIl1cblxuXHRcdGlmICF1c2VySWQgfHwgIWF1dGhUb2tlblxuXHRcdFx0c29ja2V0LmRpc2Nvbm5lY3QoKTtcblx0XHRcdHJldHVybjtcblxuXHRcdGNoZWNrQXV0aFRva2VuRmliZXIoc29ja2V0LCB1c2VySWQsIGF1dGhUb2tlbilcblxuXHRcdFNPQ0tFVFNbc29ja2V0LmlkXSA9IHNvY2tldDtcblxuXHRcdCPplIDmr4Fzb2NrZXRcblx0XHRzb2NrZXQub24gJ2Rpc2Nvbm5lY3QnLCAoKS0+XG5cdFx0XHRxdWVyeSA9IHNvY2tldC5yZXF1ZXN0Ll9xdWVyeTtcblx0XHRcdHVzZXJJZCA9IHF1ZXJ5W1wiWC1Vc2VyLUlkXCJdXG5cdFx0XHRTT0NLRVRTW3NvY2tldC5pZF0gPSBudWxsO1xuXG5cdFx0I+WBnOatouaOpeaUtua2iOaBr1xuXHRcdHNvY2tldC5vbiBTT0NLRVRFVkVOVE5BTUVTLlNUT1BORVdNRVNTQUdFLCAocmVzKS0+XG5cdFx0XHRrZXkgPSBnZXRSZWNlaXZlU29ja2V0S2V5KHJlcy5vYmplY3RfbmFtZSwgcmVzLnJlY29yZF9pZCwgc29ja2V0LnJlcXVlc3QuX3F1ZXJ5W1wiWC1Vc2VyLUlkXCJdKVxuXHRcdFx0cmVjZWl2ZU1lc3NhZ2VTb2NrZXRzW2tleV0gPSBudWxsO1xuXG5cdFx0I+W8gOWni+aOpeaUtua2iOaBr1xuXHRcdHNvY2tldC5vbiBTT0NLRVRFVkVOVE5BTUVTLlJFQ0VJVkVNRVNTQUdFLCAocmVzKS0+XG5cdFx0XHRrZXkgPSBnZXRSZWNlaXZlU29ja2V0S2V5KHJlcy5vYmplY3RfbmFtZSwgcmVzLnJlY29yZF9pZCwgc29ja2V0LnJlcXVlc3QuX3F1ZXJ5W1wiWC1Vc2VyLUlkXCJdKVxuXHRcdFx0cmVjZWl2ZU1lc3NhZ2VTb2NrZXRzW2tleV0gPSBzb2NrZXQ7XG5cblxuXHRcdCPlgZzmraLmjqXmlLbmtojmga9cblx0XHRzb2NrZXQub24gU09DS0VURVZFTlROQU1FUy5TVE9QTkVXU1VCU0NSSVBUSU9OUywgKHJlcyktPlxuXHRcdFx0a2V5ID0gZ2V0UmVjZWl2ZVNvY2tldEtleShyZXMub2JqZWN0X25hbWUsICcnLCBzb2NrZXQucmVxdWVzdC5fcXVlcnlbXCJYLVVzZXItSWRcIl0pXG5cdFx0XHRyZWNlaXZlU3Vic2NyaXB0aW9uU29ja2V0c1trZXldID0gbnVsbDtcblxuXHRcdCPlvIDlp4vmjqXmlLbmtojmga9cblx0XHRzb2NrZXQub24gU09DS0VURVZFTlROQU1FUy5SRUNFSVZFU1VCU0NSSVBUSU9OUywgKHJlcyktPlxuXHRcdFx0a2V5ID0gZ2V0UmVjZWl2ZVNvY2tldEtleShyZXMub2JqZWN0X25hbWUsICcnLCBzb2NrZXQucmVxdWVzdC5fcXVlcnlbXCJYLVVzZXItSWRcIl0pXG5cdFx0XHRyZWNlaXZlU3Vic2NyaXB0aW9uU29ja2V0c1trZXldID0gc29ja2V0O1xuXHRcdFx0c2VuZFVucmVhZEJhZGdlRmliZXIoc29ja2V0LCAnJywgc29ja2V0LnJlcXVlc3QuX3F1ZXJ5W1wiWC1Vc2VyLUlkXCJdKTtcblx0KVxuXG5cdHRyeVxuXHRcdHNlcnZlci5saXN0ZW4oUE9SVCk7XG5cdFx0Y29uc29sZS5sb2coJ2NoYXQgc29ja2V0LmlvIHBvcnQnLCBQT1JUKTtcblx0Y2F0Y2ggZVxuXHRcdGNvbnNvbGUuZXJyb3IoZSlcblxuXHQj5Y+R6YCB5raI5oGvXG5cdHNlbmROZXdNZXNzYWdlID0gKG1zZykgLT5cblx0XHRpZiBtc2cucmVsYXRlZF90by5vICYmIG1zZy5yZWxhdGVkX3RvLmlkcy5sZW5ndGggPiAwXG5cdFx0XHRvYmplY3RfbmFtZSA9IG1zZy5yZWxhdGVkX3RvLm87XG5cdFx0XHRyZWNvcmRfaWQgPSBtc2cucmVsYXRlZF90by5pZHNbMF07XG5cdFx0XHRkZWxldGUgbXNnLnJlbGF0ZWRfdG9cblx0XHRcdG1zZy5vd25lciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInVzZXJzXCIpLmZpbmRPbmUoe19pZDogbXNnLm93bmVyfSwge1xuXHRcdFx0XHRmaWVsZHM6IHtcblx0XHRcdFx0XHRfaWQ6IDEsXG5cdFx0XHRcdFx0bmFtZTogMSxcblx0XHRcdFx0XHRhdmF0YXJVcmw6IDFcblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdGlmIG9iamVjdF9uYW1lID09ICdjaGF0X3Jvb21zJ1xuXHRcdFx0XHRyb29tID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lKS5maW5kT25lKHtfaWQ6IHJlY29yZF9pZH0sIHtmaWVsZHM6IHttZW1iZXJzOiAxfX0pXG5cdFx0XHRcdGlmIHJvb21cblx0XHRcdFx0XHRfLmZvckVhY2ggcm9vbT8ubWVtYmVycywgKG0pLT5cblx0XHRcdFx0XHRcdGtleSA9IGdldFJlY2VpdmVTb2NrZXRLZXkob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgbSlcblx0XHRcdFx0XHRcdHNvY2tldEVtaXQocmVjZWl2ZU1lc3NhZ2VTb2NrZXRzW2tleV0sIFNPQ0tFVEVWRU5UTkFNRVMuTkVXTUVTU0FHRSwgbXNnKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRwYXJ0aWNpcGFudHMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJjaGF0X3N1YnNjcmlwdGlvbnNcIikuZmluZCh7J3JlbGF0ZWRfdG8ubyc6IG9iamVjdF9uYW1lLCAncmVsYXRlZF90by5pZHMnOiBbcmVjb3JkX2lkXX0sIHtmaWVsZHM6IHtvd25lcjogMX19KVxuXHRcdFx0XHRwYXJ0aWNpcGFudHMuZm9yRWFjaCAocCktPlxuXHRcdFx0XHRcdGtleSA9IGdldFJlY2VpdmVTb2NrZXRLZXkob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgcC5vd25lcilcblx0XHRcdFx0XHRzb2NrZXRFbWl0KHJlY2VpdmVNZXNzYWdlU29ja2V0c1trZXldLCBTT0NLRVRFVkVOVE5BTUVTLk5FV01FU1NBR0UsIG1zZylcblxuXG5cdCPorqLpmIVjaGF0X21lc3NhZ2VzXG5cdGNoYXRfbWVzc2FnZXNfaW5pdCA9IGZhbHNlXG5cdENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcImNoYXRfbWVzc2FnZXNcIikuZmluZCh7J2NyZWF0ZWQnOiB7JGd0ZTogbmV3IERhdGUoKX19LCB7XG5cdFx0ZmllbGRzOiB7XG5cdFx0XHRjcmVhdGVkX2J5OiAwLFxuXHRcdFx0bW9kaWZpZWQ6IDAsXG5cdFx0XHRtb2RpZmllZF9ieTogMFxuXHRcdH1cblx0fSkub2JzZXJ2ZSB7XG5cdFx0YWRkZWQ6IChuZXdEb2N1bWVudCktPlxuXHRcdFx0aWYgY2hhdF9tZXNzYWdlc19pbml0XG5cdFx0XHRcdHNlbmROZXdNZXNzYWdlIG5ld0RvY3VtZW50XG5cdFx0Y2hhbmdlZDogKG5ld0RvY3VtZW50LCBvbGREb2N1bWVudCktPlxuXHRcdFx0c2VuZE5ld01lc3NhZ2UgbmV3RG9jdW1lbnRcblx0XHRyZW1vdmVkOiAob2xkRG9jdW1lbnQpLT5cblx0XHRcdHNlbmROZXdNZXNzYWdlIG9sZERvY3VtZW50XG5cdH1cblx0Y2hhdF9tZXNzYWdlc19pbml0ID0gdHJ1ZVxuXG5cblx0c2VuZFN1YnNjcmlwdGlvbiA9IChzdWIpLT5cblx0XHRpZiBzdWIucmVsYXRlZF90by5vICYmIHN1Yi5yZWxhdGVkX3RvLmlkcy5sZW5ndGggPiAwXG5cdFx0XHRvYmplY3RfbmFtZSA9IHN1Yi5yZWxhdGVkX3RvLm87XG5cdFx0XHRyZWNvcmRfaWQgPSBzdWIucmVsYXRlZF90by5pZHNbMF07XG5cdFx0XHRzdWIubW9kaWZpZWRfYnkgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJ1c2Vyc1wiKS5maW5kT25lKHtfaWQ6IHN1Yi5tb2RpZmllZF9ieX0sIHtcblx0XHRcdFx0ZmllbGRzOiB7XG5cdFx0XHRcdFx0X2lkOiAxLFxuXHRcdFx0XHRcdG5hbWU6IDEsXG5cdFx0XHRcdFx0YXZhdGFyVXJsOiAxXG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHRrZXkgPSBnZXRSZWNlaXZlU29ja2V0S2V5KG9iamVjdF9uYW1lLCAnJywgc3ViLm93bmVyKVxuXHRcdFx0aWYgcmVjZWl2ZVN1YnNjcmlwdGlvblNvY2tldHNba2V5XVxuXHRcdFx0XHRpZiBvYmplY3RfbmFtZSA9PSAnY2hhdF9yb29tcydcblx0XHRcdFx0XHRyb29tID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lKS5maW5kT25lKHtfaWQ6IHJlY29yZF9pZH0sIHtmaWVsZHM6IHttZW1iZXJzOiAxfX0pXG5cdFx0XHRcdFx0aWYgcm9vbVxuXHRcdFx0XHRcdFx0c3ViLl9yb29tID0ge1xuXHRcdFx0XHRcdFx0XHRfaWQ6IHJvb20uX2lkLFxuXHRcdFx0XHRcdFx0XHRtZW1iZXJzOiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJ1c2Vyc1wiKS5maW5kKHtfaWQ6IHskaW46IHJvb20ubWVtYmVycyB8fCBbXX19LCB7XG5cdFx0XHRcdFx0XHRcdFx0ZmllbGRzOiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRfaWQ6IDEsXG5cdFx0XHRcdFx0XHRcdFx0XHRuYW1lOiAxLFxuXHRcdFx0XHRcdFx0XHRcdFx0YXZhdGFyVXJsOiAxXG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9KS5mZXRjaCgpXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdHNvY2tldEVtaXQocmVjZWl2ZVN1YnNjcmlwdGlvblNvY2tldHNba2V5XSwgU09DS0VURVZFTlROQU1FUy5TVUJTQ1JJUFRJT05TLCBzdWIpXG5cdFx0XHRcdHNlbmRVbnJlYWRCYWRnZShyZWNlaXZlU3Vic2NyaXB0aW9uU29ja2V0c1trZXldLCAnJywgc3ViLm93bmVyKTtcblxuXHQj6K6i6ZiFY2hhdF9zdWJzY3JpcHRpb25zXG5cdGNoYXRfc3Vic2NyaXB0aW9uc19pbml0ID0gZmFsc2Vcblx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKFwiY2hhdF9zdWJzY3JpcHRpb25zXCIpLmZpbmQoe1xuXHRcdCRvcjogW3snY3JlYXRlZCc6IHskZ3RlOiBuZXcgRGF0ZSgpfX0sICdtb2RpZmllZCc6IHskZ3RlOiBuZXcgRGF0ZSgpfV1cblx0fSwge1xuXHRcdGZpZWxkczoge1xuXHRcdFx0Y3JlYXRlZF9ieTogMFxuXHRcdH1cblx0fSkub2JzZXJ2ZSB7XG5cdFx0YWRkZWQ6IChuZXdEb2N1bWVudCktPlxuXHRcdFx0aWYgY2hhdF9zdWJzY3JpcHRpb25zX2luaXRcblx0XHRcdFx0c2VuZFN1YnNjcmlwdGlvbiBuZXdEb2N1bWVudFxuXHRcdGNoYW5nZWQ6IChuZXdEb2N1bWVudCwgb2xkRG9jdW1lbnQpLT5cblx0XHRcdHNlbmRTdWJzY3JpcHRpb24gbmV3RG9jdW1lbnRcblx0XHRyZW1vdmVkOiAob2xkRG9jdW1lbnQpLT5cblx0XHRcdHNlbmRTdWJzY3JpcHRpb24gb2xkRG9jdW1lbnRcblx0fVxuXHRjaGF0X3N1YnNjcmlwdGlvbnNfaW5pdCA9IHRydWUiLCJ2YXIgRmliZXIsIFBPUlQsIFNPQ0tFVEVWRU5UTkFNRVMsIFNPQ0tFVFMsIGNoZWNrQXV0aFRva2VuLCBjaGVja0F1dGhUb2tlbkZpYmVyLCBnZXRSZWNlaXZlU29ja2V0S2V5LCBodHRwLCByZWNlaXZlTWVzc2FnZVNvY2tldHMsIHJlY2VpdmVTdWJzY3JpcHRpb25Tb2NrZXRzLCBzZW5kVW5yZWFkQmFkZ2UsIHNlbmRVbnJlYWRCYWRnZUZpYmVyLCBzb2NrZXRFbWl0LCBzb2NrZXRfaW87XG5cbmh0dHAgPSByZXF1aXJlKCdodHRwJyk7XG5cbnNvY2tldF9pbyA9IHJlcXVpcmUoJ3NvY2tldC5pbycpO1xuXG5GaWJlciA9IHJlcXVpcmUoJ2ZpYmVycycpO1xuXG5pZiAoIXByb2Nlc3MuZW52LlNPQ0tFVF9JT19QT1JUKSB7XG4gIHJldHVybjtcbn1cblxuUE9SVCA9IHByb2Nlc3MuZW52LlNPQ0tFVF9JT19QT1JUIHx8IDgwODA7XG5cblNPQ0tFVFMgPSB7fTtcblxucmVjZWl2ZU1lc3NhZ2VTb2NrZXRzID0ge307XG5cbnJlY2VpdmVTdWJzY3JpcHRpb25Tb2NrZXRzID0ge307XG5cblNPQ0tFVEVWRU5UTkFNRVMgPSB7XG4gIE5FV01FU1NBR0U6ICduZXcgbWVzc2FnZScsXG4gIFNUT1BORVdNRVNTQUdFOiAnc3RvcCBtZXNzYWdlJyxcbiAgUkVDRUlWRU1FU1NBR0U6ICdyZWNlaXZlIG1lc3NhZ2UnLFxuICBTVUJTQ1JJUFRJT05TOiAnc3Vic2NyaXB0aW9ucycsXG4gIFNUT1BORVdTVUJTQ1JJUFRJT05TOiAnc3RvcCBzdWJzY3JpcHRpb25zJyxcbiAgUkVDRUlWRVNVQlNDUklQVElPTlM6ICdyZWNlaXZlIHN1YnNjcmlwdGlvbnMnLFxuICBDT1VOVFVOUkVBRDogJ2NvdW50IHVucmVhZCdcbn07XG5cbmNoZWNrQXV0aFRva2VuID0gZnVuY3Rpb24odXNlcklkLCBhdXRoVG9rZW4pIHtcbiAgdmFyIGhhc2hlZFRva2VuLCB1c2VyO1xuICBpZiAodXNlcklkICYmIGF1dGhUb2tlbikge1xuICAgIGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGF1dGhUb2tlbik7XG4gICAgdXNlciA9IHdyYXBBc3luY0ZpbmRPbmUoZGIudXNlcnMsIHtcbiAgICAgIF9pZDogdXNlcklkLFxuICAgICAgXCJzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnMuaGFzaGVkVG9rZW5cIjogaGFzaGVkVG9rZW5cbiAgICB9KTtcbiAgICBpZiAodXNlcikge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuZ2V0UmVjZWl2ZVNvY2tldEtleSA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHVzZXJJZCkge1xuICByZXR1cm4gb2JqZWN0X25hbWUgKyBcIl9cIiArIHJlY29yZF9pZCArIFwiX1wiICsgdXNlcklkO1xufTtcblxuc2VuZFVucmVhZEJhZGdlID0gZnVuY3Rpb24oc29ja2V0LCBzcGFjZV9pZCwgb3duZXIpIHtcbiAgdmFyIGNvdW50VW5yZWFkO1xuICBjb3VudFVucmVhZCA9IDA7XG4gIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcImNoYXRfc3Vic2NyaXB0aW9uc1wiKS5maW5kKHtcbiAgICBvd25lcjogb3duZXIsXG4gICAgdW5yZWFkOiB7XG4gICAgICAkZ3Q6IDBcbiAgICB9XG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIHVucmVhZDogMVxuICAgIH1cbiAgfSkuZm9yRWFjaChmdW5jdGlvbihfcikge1xuICAgIHJldHVybiBjb3VudFVucmVhZCArPSBfci51bnJlYWQ7XG4gIH0pO1xuICByZXR1cm4gc29ja2V0RW1pdChzb2NrZXQsIFNPQ0tFVEVWRU5UTkFNRVMuQ09VTlRVTlJFQUQsIGNvdW50VW5yZWFkKTtcbn07XG5cbnNlbmRVbnJlYWRCYWRnZUZpYmVyID0gZnVuY3Rpb24oc29ja2V0LCBzcGFjZV9pZCwgb3duZXIpIHtcbiAgcmV0dXJuIEZpYmVyKGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBzZW5kVW5yZWFkQmFkZ2Uoc29ja2V0LCBzcGFjZV9pZCwgb3duZXIpO1xuICB9KS5ydW4oKTtcbn07XG5cbmNoZWNrQXV0aFRva2VuRmliZXIgPSBmdW5jdGlvbihzb2NrZXQsIHVzZXJJZCwgYXV0aFRva2VuKSB7XG4gIHJldHVybiBGaWJlcihmdW5jdGlvbigpIHtcbiAgICB2YXIgY2hlY2s7XG4gICAgY2hlY2sgPSBTdGVlZG9zLmNoZWNrQXV0aFRva2VuKHVzZXJJZCwgYXV0aFRva2VuKTtcbiAgICBpZiAoIWNoZWNrKSB7XG4gICAgICBTT0NLRVRTW3NvY2tldC5pZF0gPSBudWxsO1xuICAgICAgcmV0dXJuIHNvY2tldC5kaXNjb25uZWN0KCk7XG4gICAgfVxuICB9KS5ydW4oKTtcbn07XG5cbnNvY2tldEVtaXQgPSBmdW5jdGlvbihzb2NrZXQsIGV2ZW50bmFtZSwgZGF0YSkge1xuICBpZiAoc29ja2V0ICYmIFNPQ0tFVFNbc29ja2V0LmlkXSkge1xuICAgIHJldHVybiBzb2NrZXQuZW1pdChldmVudG5hbWUsIGRhdGEpO1xuICB9XG59O1xuXG5NZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgdmFyIGNoYXRfbWVzc2FnZXNfaW5pdCwgY2hhdF9zdWJzY3JpcHRpb25zX2luaXQsIGNvdW50ZXIsIGUsIGlvLCBzZW5kTmV3TWVzc2FnZSwgc2VuZFN1YnNjcmlwdGlvbiwgc2VydmVyO1xuICBzZXJ2ZXIgPSBodHRwLmNyZWF0ZVNlcnZlcigpO1xuICBpbyA9IHNvY2tldF9pbyhzZXJ2ZXIpO1xuICBjb3VudGVyID0gMDtcbiAgaW8ub24oJ2Nvbm5lY3Rpb24nLCBmdW5jdGlvbihzb2NrZXQpIHtcbiAgICB2YXIgYXV0aFRva2VuLCBxdWVyeSwgdXNlcklkO1xuICAgIHF1ZXJ5ID0gc29ja2V0LnJlcXVlc3QuX3F1ZXJ5O1xuICAgIHVzZXJJZCA9IHF1ZXJ5W1wiWC1Vc2VyLUlkXCJdO1xuICAgIGF1dGhUb2tlbiA9IHF1ZXJ5W1wiWC1BdXRoLVRva2VuXCJdO1xuICAgIGlmICghdXNlcklkIHx8ICFhdXRoVG9rZW4pIHtcbiAgICAgIHNvY2tldC5kaXNjb25uZWN0KCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNoZWNrQXV0aFRva2VuRmliZXIoc29ja2V0LCB1c2VySWQsIGF1dGhUb2tlbik7XG4gICAgU09DS0VUU1tzb2NrZXQuaWRdID0gc29ja2V0O1xuICAgIHNvY2tldC5vbignZGlzY29ubmVjdCcsIGZ1bmN0aW9uKCkge1xuICAgICAgcXVlcnkgPSBzb2NrZXQucmVxdWVzdC5fcXVlcnk7XG4gICAgICB1c2VySWQgPSBxdWVyeVtcIlgtVXNlci1JZFwiXTtcbiAgICAgIHJldHVybiBTT0NLRVRTW3NvY2tldC5pZF0gPSBudWxsO1xuICAgIH0pO1xuICAgIHNvY2tldC5vbihTT0NLRVRFVkVOVE5BTUVTLlNUT1BORVdNRVNTQUdFLCBmdW5jdGlvbihyZXMpIHtcbiAgICAgIHZhciBrZXk7XG4gICAgICBrZXkgPSBnZXRSZWNlaXZlU29ja2V0S2V5KHJlcy5vYmplY3RfbmFtZSwgcmVzLnJlY29yZF9pZCwgc29ja2V0LnJlcXVlc3QuX3F1ZXJ5W1wiWC1Vc2VyLUlkXCJdKTtcbiAgICAgIHJldHVybiByZWNlaXZlTWVzc2FnZVNvY2tldHNba2V5XSA9IG51bGw7XG4gICAgfSk7XG4gICAgc29ja2V0Lm9uKFNPQ0tFVEVWRU5UTkFNRVMuUkVDRUlWRU1FU1NBR0UsIGZ1bmN0aW9uKHJlcykge1xuICAgICAgdmFyIGtleTtcbiAgICAgIGtleSA9IGdldFJlY2VpdmVTb2NrZXRLZXkocmVzLm9iamVjdF9uYW1lLCByZXMucmVjb3JkX2lkLCBzb2NrZXQucmVxdWVzdC5fcXVlcnlbXCJYLVVzZXItSWRcIl0pO1xuICAgICAgcmV0dXJuIHJlY2VpdmVNZXNzYWdlU29ja2V0c1trZXldID0gc29ja2V0O1xuICAgIH0pO1xuICAgIHNvY2tldC5vbihTT0NLRVRFVkVOVE5BTUVTLlNUT1BORVdTVUJTQ1JJUFRJT05TLCBmdW5jdGlvbihyZXMpIHtcbiAgICAgIHZhciBrZXk7XG4gICAgICBrZXkgPSBnZXRSZWNlaXZlU29ja2V0S2V5KHJlcy5vYmplY3RfbmFtZSwgJycsIHNvY2tldC5yZXF1ZXN0Ll9xdWVyeVtcIlgtVXNlci1JZFwiXSk7XG4gICAgICByZXR1cm4gcmVjZWl2ZVN1YnNjcmlwdGlvblNvY2tldHNba2V5XSA9IG51bGw7XG4gICAgfSk7XG4gICAgcmV0dXJuIHNvY2tldC5vbihTT0NLRVRFVkVOVE5BTUVTLlJFQ0VJVkVTVUJTQ1JJUFRJT05TLCBmdW5jdGlvbihyZXMpIHtcbiAgICAgIHZhciBrZXk7XG4gICAgICBrZXkgPSBnZXRSZWNlaXZlU29ja2V0S2V5KHJlcy5vYmplY3RfbmFtZSwgJycsIHNvY2tldC5yZXF1ZXN0Ll9xdWVyeVtcIlgtVXNlci1JZFwiXSk7XG4gICAgICByZWNlaXZlU3Vic2NyaXB0aW9uU29ja2V0c1trZXldID0gc29ja2V0O1xuICAgICAgcmV0dXJuIHNlbmRVbnJlYWRCYWRnZUZpYmVyKHNvY2tldCwgJycsIHNvY2tldC5yZXF1ZXN0Ll9xdWVyeVtcIlgtVXNlci1JZFwiXSk7XG4gICAgfSk7XG4gIH0pO1xuICB0cnkge1xuICAgIHNlcnZlci5saXN0ZW4oUE9SVCk7XG4gICAgY29uc29sZS5sb2coJ2NoYXQgc29ja2V0LmlvIHBvcnQnLCBQT1JUKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlID0gZXJyb3I7XG4gICAgY29uc29sZS5lcnJvcihlKTtcbiAgfVxuICBzZW5kTmV3TWVzc2FnZSA9IGZ1bmN0aW9uKG1zZykge1xuICAgIHZhciBvYmplY3RfbmFtZSwgcGFydGljaXBhbnRzLCByZWNvcmRfaWQsIHJvb207XG4gICAgaWYgKG1zZy5yZWxhdGVkX3RvLm8gJiYgbXNnLnJlbGF0ZWRfdG8uaWRzLmxlbmd0aCA+IDApIHtcbiAgICAgIG9iamVjdF9uYW1lID0gbXNnLnJlbGF0ZWRfdG8ubztcbiAgICAgIHJlY29yZF9pZCA9IG1zZy5yZWxhdGVkX3RvLmlkc1swXTtcbiAgICAgIGRlbGV0ZSBtc2cucmVsYXRlZF90bztcbiAgICAgIG1zZy5vd25lciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInVzZXJzXCIpLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IG1zZy5vd25lclxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDEsXG4gICAgICAgICAgbmFtZTogMSxcbiAgICAgICAgICBhdmF0YXJVcmw6IDFcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBpZiAob2JqZWN0X25hbWUgPT09ICdjaGF0X3Jvb21zJykge1xuICAgICAgICByb29tID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lKS5maW5kT25lKHtcbiAgICAgICAgICBfaWQ6IHJlY29yZF9pZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBtZW1iZXJzOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHJvb20pIHtcbiAgICAgICAgICByZXR1cm4gXy5mb3JFYWNoKHJvb20gIT0gbnVsbCA/IHJvb20ubWVtYmVycyA6IHZvaWQgMCwgZnVuY3Rpb24obSkge1xuICAgICAgICAgICAgdmFyIGtleTtcbiAgICAgICAgICAgIGtleSA9IGdldFJlY2VpdmVTb2NrZXRLZXkob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgbSk7XG4gICAgICAgICAgICByZXR1cm4gc29ja2V0RW1pdChyZWNlaXZlTWVzc2FnZVNvY2tldHNba2V5XSwgU09DS0VURVZFTlROQU1FUy5ORVdNRVNTQUdFLCBtc2cpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYXJ0aWNpcGFudHMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJjaGF0X3N1YnNjcmlwdGlvbnNcIikuZmluZCh7XG4gICAgICAgICAgJ3JlbGF0ZWRfdG8ubyc6IG9iamVjdF9uYW1lLFxuICAgICAgICAgICdyZWxhdGVkX3RvLmlkcyc6IFtyZWNvcmRfaWRdXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIG93bmVyOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHBhcnRpY2lwYW50cy5mb3JFYWNoKGZ1bmN0aW9uKHApIHtcbiAgICAgICAgICB2YXIga2V5O1xuICAgICAgICAgIGtleSA9IGdldFJlY2VpdmVTb2NrZXRLZXkob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgcC5vd25lcik7XG4gICAgICAgICAgcmV0dXJuIHNvY2tldEVtaXQocmVjZWl2ZU1lc3NhZ2VTb2NrZXRzW2tleV0sIFNPQ0tFVEVWRU5UTkFNRVMuTkVXTUVTU0FHRSwgbXNnKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBjaGF0X21lc3NhZ2VzX2luaXQgPSBmYWxzZTtcbiAgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwiY2hhdF9tZXNzYWdlc1wiKS5maW5kKHtcbiAgICAnY3JlYXRlZCc6IHtcbiAgICAgICRndGU6IG5ldyBEYXRlKClcbiAgICB9XG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICBtb2RpZmllZDogMCxcbiAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgfVxuICB9KS5vYnNlcnZlKHtcbiAgICBhZGRlZDogZnVuY3Rpb24obmV3RG9jdW1lbnQpIHtcbiAgICAgIGlmIChjaGF0X21lc3NhZ2VzX2luaXQpIHtcbiAgICAgICAgcmV0dXJuIHNlbmROZXdNZXNzYWdlKG5ld0RvY3VtZW50KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGNoYW5nZWQ6IGZ1bmN0aW9uKG5ld0RvY3VtZW50LCBvbGREb2N1bWVudCkge1xuICAgICAgcmV0dXJuIHNlbmROZXdNZXNzYWdlKG5ld0RvY3VtZW50KTtcbiAgICB9LFxuICAgIHJlbW92ZWQ6IGZ1bmN0aW9uKG9sZERvY3VtZW50KSB7XG4gICAgICByZXR1cm4gc2VuZE5ld01lc3NhZ2Uob2xkRG9jdW1lbnQpO1xuICAgIH1cbiAgfSk7XG4gIGNoYXRfbWVzc2FnZXNfaW5pdCA9IHRydWU7XG4gIHNlbmRTdWJzY3JpcHRpb24gPSBmdW5jdGlvbihzdWIpIHtcbiAgICB2YXIga2V5LCBvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCByb29tO1xuICAgIGlmIChzdWIucmVsYXRlZF90by5vICYmIHN1Yi5yZWxhdGVkX3RvLmlkcy5sZW5ndGggPiAwKSB7XG4gICAgICBvYmplY3RfbmFtZSA9IHN1Yi5yZWxhdGVkX3RvLm87XG4gICAgICByZWNvcmRfaWQgPSBzdWIucmVsYXRlZF90by5pZHNbMF07XG4gICAgICBzdWIubW9kaWZpZWRfYnkgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJ1c2Vyc1wiKS5maW5kT25lKHtcbiAgICAgICAgX2lkOiBzdWIubW9kaWZpZWRfYnlcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgX2lkOiAxLFxuICAgICAgICAgIG5hbWU6IDEsXG4gICAgICAgICAgYXZhdGFyVXJsOiAxXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAga2V5ID0gZ2V0UmVjZWl2ZVNvY2tldEtleShvYmplY3RfbmFtZSwgJycsIHN1Yi5vd25lcik7XG4gICAgICBpZiAocmVjZWl2ZVN1YnNjcmlwdGlvblNvY2tldHNba2V5XSkge1xuICAgICAgICBpZiAob2JqZWN0X25hbWUgPT09ICdjaGF0X3Jvb21zJykge1xuICAgICAgICAgIHJvb20gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUpLmZpbmRPbmUoe1xuICAgICAgICAgICAgX2lkOiByZWNvcmRfaWRcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgbWVtYmVyczogMVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmIChyb29tKSB7XG4gICAgICAgICAgICBzdWIuX3Jvb20gPSB7XG4gICAgICAgICAgICAgIF9pZDogcm9vbS5faWQsXG4gICAgICAgICAgICAgIG1lbWJlcnM6IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInVzZXJzXCIpLmZpbmQoe1xuICAgICAgICAgICAgICAgIF9pZDoge1xuICAgICAgICAgICAgICAgICAgJGluOiByb29tLm1lbWJlcnMgfHwgW11cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICAgICAgICAgIG5hbWU6IDEsXG4gICAgICAgICAgICAgICAgICBhdmF0YXJVcmw6IDFcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pLmZldGNoKClcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHNvY2tldEVtaXQocmVjZWl2ZVN1YnNjcmlwdGlvblNvY2tldHNba2V5XSwgU09DS0VURVZFTlROQU1FUy5TVUJTQ1JJUFRJT05TLCBzdWIpO1xuICAgICAgICByZXR1cm4gc2VuZFVucmVhZEJhZGdlKHJlY2VpdmVTdWJzY3JpcHRpb25Tb2NrZXRzW2tleV0sICcnLCBzdWIub3duZXIpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgY2hhdF9zdWJzY3JpcHRpb25zX2luaXQgPSBmYWxzZTtcbiAgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwiY2hhdF9zdWJzY3JpcHRpb25zXCIpLmZpbmQoe1xuICAgICRvcjogW1xuICAgICAge1xuICAgICAgICAnY3JlYXRlZCc6IHtcbiAgICAgICAgICAkZ3RlOiBuZXcgRGF0ZSgpXG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAgJ21vZGlmaWVkJzoge1xuICAgICAgICAgICRndGU6IG5ldyBEYXRlKClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIF1cbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgY3JlYXRlZF9ieTogMFxuICAgIH1cbiAgfSkub2JzZXJ2ZSh7XG4gICAgYWRkZWQ6IGZ1bmN0aW9uKG5ld0RvY3VtZW50KSB7XG4gICAgICBpZiAoY2hhdF9zdWJzY3JpcHRpb25zX2luaXQpIHtcbiAgICAgICAgcmV0dXJuIHNlbmRTdWJzY3JpcHRpb24obmV3RG9jdW1lbnQpO1xuICAgICAgfVxuICAgIH0sXG4gICAgY2hhbmdlZDogZnVuY3Rpb24obmV3RG9jdW1lbnQsIG9sZERvY3VtZW50KSB7XG4gICAgICByZXR1cm4gc2VuZFN1YnNjcmlwdGlvbihuZXdEb2N1bWVudCk7XG4gICAgfSxcbiAgICByZW1vdmVkOiBmdW5jdGlvbihvbGREb2N1bWVudCkge1xuICAgICAgcmV0dXJuIHNlbmRTdWJzY3JpcHRpb24ob2xkRG9jdW1lbnQpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBjaGF0X3N1YnNjcmlwdGlvbnNfaW5pdCA9IHRydWU7XG59KTtcbiJdfQ==
