(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var uuflowManager = Package['steedos:creator'].uuflowManager;
var permissionManager = Package['steedos:creator'].permissionManager;
var Blaze = Package.blaze.Blaze;
var UI = Package.blaze.UI;
var Handlebars = Package.blaze.Handlebars;
var ServerSession = Package['steedos:base'].ServerSession;
var Selector = Package['steedos:base'].Selector;
var Steedos = Package['steedos:base'].Steedos;
var AjaxCollection = Package['steedos:base'].AjaxCollection;
var SteedosDataManager = Package['steedos:base'].SteedosDataManager;
var SteedosOffice = Package['steedos:base'].SteedosOffice;
var billingManager = Package['steedos:base'].billingManager;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var HTML = Package.htmljs.HTML;

/* Package-scope variables */
var __coffeescriptShare;

var require = meteorInstall({"node_modules":{"meteor":{"steedos:app-chat":{"checkNpm.js":function(require,exports,module){

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

},"models":{"chat_subscriptions.coffee":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                           //
// packages/steedos_app-chat/models/chat_subscriptions.coffee                                                //
//                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                             //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"chat_messages.coffee":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                           //
// packages/steedos_app-chat/models/chat_messages.coffee                                                     //
//                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                             //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"chat_rooms.coffee":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                           //
// packages/steedos_app-chat/models/chat_rooms.coffee                                                        //
//                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                             //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"server":{"publications":{"chat_messages.coffee":function(){

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

}},"chat.socket.coffee":function(require){

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczphcHAtY2hhdC9jaGVja05wbS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hcHAtY2hhdC9zZXJ2ZXIvcHVibGljYXRpb25zL2NoYXRfbWVzc2FnZXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcHVibGljYXRpb25zL2NoYXRfbWVzc2FnZXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2FwcC1jaGF0L3NlcnZlci9jaGF0LnNvY2tldC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9jaGF0LnNvY2tldC5jb2ZmZWUiXSwibmFtZXMiOlsiY2hlY2tOcG1WZXJzaW9ucyIsIm1vZHVsZSIsImxpbmsiLCJ2IiwiTWV0ZW9yIiwicHVibGlzaENvbXBvc2l0ZSIsInNwYWNlX2lkIiwib2JqZWN0X25hbWUiLCJyZWNvcmRfaWQiLCJvcHRpb25zIiwiZGF0YSIsInF1ZXJ5Iiwic2VsZiIsInVuYmxvY2siLCJmaW5kIiwiQ3JlYXRvciIsImdldENvbGxlY3Rpb24iLCJjaGlsZHJlbiIsInB1c2giLCJwYXJlbnQiLCJlIiwib3duZXIiLCJfaWQiLCJmaWVsZHMiLCJuYW1lIiwiYXZhdGFyVXJsIiwiZXJyb3IiLCJjb25zb2xlIiwibG9nIiwicmVmZXJlbmNlX3RvIiwiRmliZXIiLCJQT1JUIiwiU09DS0VURVZFTlROQU1FUyIsIlNPQ0tFVFMiLCJjaGVja0F1dGhUb2tlbiIsImNoZWNrQXV0aFRva2VuRmliZXIiLCJnZXRSZWNlaXZlU29ja2V0S2V5IiwiaHR0cCIsInJlY2VpdmVNZXNzYWdlU29ja2V0cyIsInJlY2VpdmVTdWJzY3JpcHRpb25Tb2NrZXRzIiwic2VuZFVucmVhZEJhZGdlIiwic2VuZFVucmVhZEJhZGdlRmliZXIiLCJzb2NrZXRFbWl0Iiwic29ja2V0X2lvIiwicmVxdWlyZSIsInByb2Nlc3MiLCJlbnYiLCJTT0NLRVRfSU9fUE9SVCIsIk5FV01FU1NBR0UiLCJTVE9QTkVXTUVTU0FHRSIsIlJFQ0VJVkVNRVNTQUdFIiwiU1VCU0NSSVBUSU9OUyIsIlNUT1BORVdTVUJTQ1JJUFRJT05TIiwiUkVDRUlWRVNVQlNDUklQVElPTlMiLCJDT1VOVFVOUkVBRCIsInVzZXJJZCIsImF1dGhUb2tlbiIsImhhc2hlZFRva2VuIiwidXNlciIsIkFjY291bnRzIiwiX2hhc2hMb2dpblRva2VuIiwid3JhcEFzeW5jRmluZE9uZSIsImRiIiwidXNlcnMiLCJzb2NrZXQiLCJjb3VudFVucmVhZCIsInVucmVhZCIsIiRndCIsImZvckVhY2giLCJfciIsInJ1biIsImNoZWNrIiwiU3RlZWRvcyIsImlkIiwiZGlzY29ubmVjdCIsImV2ZW50bmFtZSIsImVtaXQiLCJzdGFydHVwIiwiY2hhdF9tZXNzYWdlc19pbml0IiwiY2hhdF9zdWJzY3JpcHRpb25zX2luaXQiLCJjb3VudGVyIiwiaW8iLCJzZW5kTmV3TWVzc2FnZSIsInNlbmRTdWJzY3JpcHRpb24iLCJzZXJ2ZXIiLCJjcmVhdGVTZXJ2ZXIiLCJvbiIsInJlcXVlc3QiLCJfcXVlcnkiLCJyZXMiLCJrZXkiLCJsaXN0ZW4iLCJtc2ciLCJwYXJ0aWNpcGFudHMiLCJyb29tIiwicmVsYXRlZF90byIsIm8iLCJpZHMiLCJsZW5ndGgiLCJmaW5kT25lIiwibWVtYmVycyIsIl8iLCJtIiwicCIsIiRndGUiLCJEYXRlIiwiY3JlYXRlZF9ieSIsIm1vZGlmaWVkIiwibW9kaWZpZWRfYnkiLCJvYnNlcnZlIiwiYWRkZWQiLCJuZXdEb2N1bWVudCIsImNoYW5nZWQiLCJvbGREb2N1bWVudCIsInJlbW92ZWQiLCJzdWIiLCJfcm9vbSIsIiRpbiIsImZldGNoIiwiJG9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUlBLGdCQUFKO0FBQXFCQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxvQ0FBWixFQUFpRDtBQUFDRixrQkFBZ0IsQ0FB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QyxXQUFPLFVBQUNDLFdBQUQ7QUFDTixVQUFHaEMsdUJBQUg7QUNnRUssZUQvREpJLGlCQUFpQjRCLFdBQWpCLENDK0RJO0FBQ0Q7QURuRUs7QUFJVkMsYUFBUyxVQUFDRCxXQUFELEVBQWNFLFdBQWQ7QUNrRUwsYURqRUg5QixpQkFBaUI0QixXQUFqQixDQ2lFRztBRHRFTTtBQU1WRyxhQUFTLFVBQUNELFdBQUQ7QUNtRUwsYURsRUg5QixpQkFBaUI4QixXQUFqQixDQ2tFRztBRHpFTTtBQUFBLEdBTlg7QUNrRkMsU0RuRURsQywwQkFBMEIsSUNtRXpCO0FEdE5GLEciLCJmaWxlIjoiL3BhY2thZ2VzL3N0ZWVkb3NfYXBwLWNoYXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjaGVja05wbVZlcnNpb25zIH0gZnJvbSAnbWV0ZW9yL3RtZWFzZGF5OmNoZWNrLW5wbS12ZXJzaW9ucyc7XHJcbmNoZWNrTnBtVmVyc2lvbnMoe1xyXG5cdCdzb2NrZXQuaW8nOiAnPj0xLjQuOCcsXHJcblx0Ly8gJ3NvY2tldC5pby1jbGllbnQnOiBcIl4xLjQuOFwiXHJcbn0sICdzdGVlZG9zOmFwcC1jaGF0Jyk7XHJcbiIsIk1ldGVvci5wdWJsaXNoQ29tcG9zaXRlICdjaGF0X21lc3NhZ2VzJywgKHNwYWNlX2lkLCBvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBvcHRpb25zKS0+XHJcblx0cXVlcnkgPSB7J3NwYWNlJzogc3BhY2VfaWQsJ3JlbGF0ZWRfdG8ubyc6IG9iamVjdF9uYW1lLCdyZWxhdGVkX3RvLmlkcyc6IHJlY29yZF9pZH1cclxuXHJcblx0c2VsZiA9IHRoaXNcclxuXHJcblx0c2VsZi51bmJsb2NrKCk7XHJcblxyXG5cdGRhdGEgPSB7XHJcblx0XHRmaW5kOiAoKS0+XHJcblx0XHRcdHNlbGYudW5ibG9jaygpO1xyXG5cclxuXHRcdFx0cmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcImNoYXRfbWVzc2FnZXNcIikuZmluZChxdWVyeSwgb3B0aW9ucyk7XHJcblx0fVxyXG5cclxuXHRkYXRhLmNoaWxkcmVuID0gW11cclxuXHJcblx0ZGF0YS5jaGlsZHJlbi5wdXNoIHtcclxuXHRcdGZpbmQ6IChwYXJlbnQpIC0+XHJcblx0XHRcdHRyeVxyXG5cdFx0XHRcdHNlbGYudW5ibG9jaygpO1xyXG5cdFx0XHRcdGlmIHBhcmVudD8ub3duZXJcclxuXHRcdFx0XHRcdHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJ1c2Vyc1wiKS5maW5kKHtfaWQ6IHBhcmVudC5vd25lcn0sIHtcclxuXHRcdFx0XHRcdFx0ZmllbGRzOiB7bmFtZTogMSwgYXZhdGFyVXJsOiAxfVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0cmV0dXJuIFtdXHJcblx0XHRcdGNhdGNoIGVcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhyZWZlcmVuY2VfdG8sIHBhcmVudCwgZSlcclxuXHRcdFx0XHRyZXR1cm4gW11cclxuXHR9XHJcblxyXG5cdHJldHVybiBkYXRhIiwiTWV0ZW9yLnB1Ymxpc2hDb21wb3NpdGUoJ2NoYXRfbWVzc2FnZXMnLCBmdW5jdGlvbihzcGFjZV9pZCwgb2JqZWN0X25hbWUsIHJlY29yZF9pZCwgb3B0aW9ucykge1xuICB2YXIgZGF0YSwgcXVlcnksIHNlbGY7XG4gIHF1ZXJ5ID0ge1xuICAgICdzcGFjZSc6IHNwYWNlX2lkLFxuICAgICdyZWxhdGVkX3RvLm8nOiBvYmplY3RfbmFtZSxcbiAgICAncmVsYXRlZF90by5pZHMnOiByZWNvcmRfaWRcbiAgfTtcbiAgc2VsZiA9IHRoaXM7XG4gIHNlbGYudW5ibG9jaygpO1xuICBkYXRhID0ge1xuICAgIGZpbmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgc2VsZi51bmJsb2NrKCk7XG4gICAgICByZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwiY2hhdF9tZXNzYWdlc1wiKS5maW5kKHF1ZXJ5LCBvcHRpb25zKTtcbiAgICB9XG4gIH07XG4gIGRhdGEuY2hpbGRyZW4gPSBbXTtcbiAgZGF0YS5jaGlsZHJlbi5wdXNoKHtcbiAgICBmaW5kOiBmdW5jdGlvbihwYXJlbnQpIHtcbiAgICAgIHZhciBlO1xuICAgICAgdHJ5IHtcbiAgICAgICAgc2VsZi51bmJsb2NrKCk7XG4gICAgICAgIGlmIChwYXJlbnQgIT0gbnVsbCA/IHBhcmVudC5vd25lciA6IHZvaWQgMCkge1xuICAgICAgICAgIHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJ1c2Vyc1wiKS5maW5kKHtcbiAgICAgICAgICAgIF9pZDogcGFyZW50Lm93bmVyXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgIG5hbWU6IDEsXG4gICAgICAgICAgICAgIGF2YXRhclVybDogMVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICBjb25zb2xlLmxvZyhyZWZlcmVuY2VfdG8sIHBhcmVudCwgZSk7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gZGF0YTtcbn0pO1xuIiwiaHR0cCA9IHJlcXVpcmUgJ2h0dHAnO1xyXG5zb2NrZXRfaW8gPSByZXF1aXJlICdzb2NrZXQuaW8nO1xyXG5GaWJlciA9IHJlcXVpcmUoJ2ZpYmVycycpO1xyXG5cclxuaWYgIXByb2Nlc3MuZW52LlNPQ0tFVF9JT19QT1JUXHJcblx0cmV0dXJuO1xyXG5cclxuUE9SVCA9IHByb2Nlc3MuZW52LlNPQ0tFVF9JT19QT1JUIHx8IDgwODA7XHJcblxyXG5TT0NLRVRTID0ge31cclxuXHJcbiPmjqXmlLbmtojmga/nmoRzb2NrZXTpm4blkIgsa2V555qE5qC85byP5Li6OiB7b2JqZWN0X25hbWV9X3tyZWNvcmRfaWR9X3t1c2VySWR9LCDlgLzkuLpzb2NrZXQg5a+56LGhLCDnm67liY3kuI3mlK/mjIHkuIDkuKrnlKjmiLflpJrkuKpzb2NrZXTmjqXlhaVcclxucmVjZWl2ZU1lc3NhZ2VTb2NrZXRzID0ge1xyXG5cclxufVxyXG5cclxucmVjZWl2ZVN1YnNjcmlwdGlvblNvY2tldHMgPSB7XHJcblxyXG59XHJcblxyXG5TT0NLRVRFVkVOVE5BTUVTID0ge1xyXG5cdE5FV01FU1NBR0U6ICduZXcgbWVzc2FnZScsXHJcblx0U1RPUE5FV01FU1NBR0U6ICdzdG9wIG1lc3NhZ2UnLFxyXG5cdFJFQ0VJVkVNRVNTQUdFOiAncmVjZWl2ZSBtZXNzYWdlJyxcclxuXHRTVUJTQ1JJUFRJT05TOiAnc3Vic2NyaXB0aW9ucycsXHJcblx0U1RPUE5FV1NVQlNDUklQVElPTlM6ICdzdG9wIHN1YnNjcmlwdGlvbnMnLFxyXG5cdFJFQ0VJVkVTVUJTQ1JJUFRJT05TOiAncmVjZWl2ZSBzdWJzY3JpcHRpb25zJyxcclxuXHRDT1VOVFVOUkVBRDogJ2NvdW50IHVucmVhZCdcclxufTtcclxuXHJcbmNoZWNrQXV0aFRva2VuID0gKHVzZXJJZCwgYXV0aFRva2VuKSAtPlxyXG5cdGlmIHVzZXJJZCBhbmQgYXV0aFRva2VuXHJcblx0XHRoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoVG9rZW4pXHJcblx0XHR1c2VyID0gd3JhcEFzeW5jRmluZE9uZShkYi51c2Vycywge1xyXG5cdFx0XHRcdF9pZDogdXNlcklkLFxyXG5cdFx0XHRcdFwic2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VuXHJcblx0XHRcdH1cclxuXHRcdClcclxuXHRcdGlmIHVzZXJcclxuXHRcdFx0cmV0dXJuIHRydWVcclxuXHRcdGVsc2VcclxuXHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0cmV0dXJuIGZhbHNlXHJcblxyXG5cclxuZ2V0UmVjZWl2ZVNvY2tldEtleSA9IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCB1c2VySWQpLT5cclxuXHRyZXR1cm4gXCIje29iamVjdF9uYW1lfV8je3JlY29yZF9pZH1fI3t1c2VySWR9XCJcclxuXHJcbnNlbmRVbnJlYWRCYWRnZSA9IChzb2NrZXQsIHNwYWNlX2lkLCBvd25lciktPlxyXG5cdGNvdW50VW5yZWFkID0gMFxyXG5cdENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcImNoYXRfc3Vic2NyaXB0aW9uc1wiKS5maW5kKHtcclxuXHRcdG93bmVyOiBvd25lcixcclxuXHRcdHVucmVhZDogeyRndDogMH1cclxuXHR9LCB7ZmllbGRzOiB7dW5yZWFkOiAxfX0pLmZvckVhY2ggKF9yKS0+XHJcblx0XHRjb3VudFVucmVhZCArPSBfci51bnJlYWRcclxuXHRzb2NrZXRFbWl0KHNvY2tldCwgU09DS0VURVZFTlROQU1FUy5DT1VOVFVOUkVBRCwgY291bnRVbnJlYWQpO1xyXG5cclxuI+S9v+eUqEZpYmVy55So5LqO5aSE55CG6ZSZ6K+vOidNZXRlb3IgY29kZSBtdXN0IGFsd2F5cyBydW4gd2l0aGluIGEgRmliZXInIC4g5bCd6K+V5LqGTWV0ZW9yIOaPkOS+m+eahE1ldGVvci5iaW5kRW52aXJvbm1lbnRcXE1ldGVvci53cmFwQXN5bmPpg73kuI3og73lpITnkIbmraTplJnor68uXHJcbnNlbmRVbnJlYWRCYWRnZUZpYmVyID0gKHNvY2tldCwgc3BhY2VfaWQsIG93bmVyKS0+XHJcblx0RmliZXIoKCktPlxyXG5cdFx0c2VuZFVucmVhZEJhZGdlKHNvY2tldCwgc3BhY2VfaWQsIG93bmVyKTtcclxuXHQpLnJ1bigpO1xyXG5cclxuI1RPRE86IEZpYmVy6L+U5Zue5YC86Zeu6aKY5aSE55CGXHJcbmNoZWNrQXV0aFRva2VuRmliZXIgPSAoc29ja2V0LCB1c2VySWQsIGF1dGhUb2tlbiktPlxyXG5cdEZpYmVyKCgpLT5cclxuXHRcdGNoZWNrID0gU3RlZWRvcy5jaGVja0F1dGhUb2tlbih1c2VySWQsIGF1dGhUb2tlbik7XHJcblx0XHRpZighY2hlY2spXHJcblx0XHRcdFNPQ0tFVFNbc29ja2V0LmlkXSA9IG51bGw7XHJcblx0XHRcdHNvY2tldC5kaXNjb25uZWN0KCk7XHJcblx0KS5ydW4oKTtcclxuXHJcbnNvY2tldEVtaXQgPSAoc29ja2V0LCBldmVudG5hbWUsIGRhdGEpIC0+XHJcblx0aWYgc29ja2V0ICYmIFNPQ0tFVFNbc29ja2V0LmlkXVxyXG5cdFx0c29ja2V0LmVtaXQoZXZlbnRuYW1lLCBkYXRhKVxyXG5cclxuTWV0ZW9yLnN0YXJ0dXAgKCktPlxyXG5cdHNlcnZlciA9IGh0dHAuY3JlYXRlU2VydmVyKCk7XHJcblxyXG5cdGlvID0gc29ja2V0X2lvKHNlcnZlcik7XHJcblxyXG5cdGNvdW50ZXIgPSAwO1xyXG5cclxuXHRpby5vbignY29ubmVjdGlvbicsIChzb2NrZXQpLT5cclxuXHRcdHF1ZXJ5ID0gc29ja2V0LnJlcXVlc3QuX3F1ZXJ5O1xyXG5cdFx0dXNlcklkID0gcXVlcnlbXCJYLVVzZXItSWRcIl1cclxuXHRcdGF1dGhUb2tlbiA9IHF1ZXJ5W1wiWC1BdXRoLVRva2VuXCJdXHJcblxyXG5cdFx0aWYgIXVzZXJJZCB8fCAhYXV0aFRva2VuXHJcblx0XHRcdHNvY2tldC5kaXNjb25uZWN0KCk7XHJcblx0XHRcdHJldHVybjtcclxuXHJcblx0XHRjaGVja0F1dGhUb2tlbkZpYmVyKHNvY2tldCwgdXNlcklkLCBhdXRoVG9rZW4pXHJcblxyXG5cdFx0U09DS0VUU1tzb2NrZXQuaWRdID0gc29ja2V0O1xyXG5cclxuXHRcdCPplIDmr4Fzb2NrZXRcclxuXHRcdHNvY2tldC5vbiAnZGlzY29ubmVjdCcsICgpLT5cclxuXHRcdFx0cXVlcnkgPSBzb2NrZXQucmVxdWVzdC5fcXVlcnk7XHJcblx0XHRcdHVzZXJJZCA9IHF1ZXJ5W1wiWC1Vc2VyLUlkXCJdXHJcblx0XHRcdFNPQ0tFVFNbc29ja2V0LmlkXSA9IG51bGw7XHJcblxyXG5cdFx0I+WBnOatouaOpeaUtua2iOaBr1xyXG5cdFx0c29ja2V0Lm9uIFNPQ0tFVEVWRU5UTkFNRVMuU1RPUE5FV01FU1NBR0UsIChyZXMpLT5cclxuXHRcdFx0a2V5ID0gZ2V0UmVjZWl2ZVNvY2tldEtleShyZXMub2JqZWN0X25hbWUsIHJlcy5yZWNvcmRfaWQsIHNvY2tldC5yZXF1ZXN0Ll9xdWVyeVtcIlgtVXNlci1JZFwiXSlcclxuXHRcdFx0cmVjZWl2ZU1lc3NhZ2VTb2NrZXRzW2tleV0gPSBudWxsO1xyXG5cclxuXHRcdCPlvIDlp4vmjqXmlLbmtojmga9cclxuXHRcdHNvY2tldC5vbiBTT0NLRVRFVkVOVE5BTUVTLlJFQ0VJVkVNRVNTQUdFLCAocmVzKS0+XHJcblx0XHRcdGtleSA9IGdldFJlY2VpdmVTb2NrZXRLZXkocmVzLm9iamVjdF9uYW1lLCByZXMucmVjb3JkX2lkLCBzb2NrZXQucmVxdWVzdC5fcXVlcnlbXCJYLVVzZXItSWRcIl0pXHJcblx0XHRcdHJlY2VpdmVNZXNzYWdlU29ja2V0c1trZXldID0gc29ja2V0O1xyXG5cclxuXHJcblx0XHQj5YGc5q2i5o6l5pS25raI5oGvXHJcblx0XHRzb2NrZXQub24gU09DS0VURVZFTlROQU1FUy5TVE9QTkVXU1VCU0NSSVBUSU9OUywgKHJlcyktPlxyXG5cdFx0XHRrZXkgPSBnZXRSZWNlaXZlU29ja2V0S2V5KHJlcy5vYmplY3RfbmFtZSwgJycsIHNvY2tldC5yZXF1ZXN0Ll9xdWVyeVtcIlgtVXNlci1JZFwiXSlcclxuXHRcdFx0cmVjZWl2ZVN1YnNjcmlwdGlvblNvY2tldHNba2V5XSA9IG51bGw7XHJcblxyXG5cdFx0I+W8gOWni+aOpeaUtua2iOaBr1xyXG5cdFx0c29ja2V0Lm9uIFNPQ0tFVEVWRU5UTkFNRVMuUkVDRUlWRVNVQlNDUklQVElPTlMsIChyZXMpLT5cclxuXHRcdFx0a2V5ID0gZ2V0UmVjZWl2ZVNvY2tldEtleShyZXMub2JqZWN0X25hbWUsICcnLCBzb2NrZXQucmVxdWVzdC5fcXVlcnlbXCJYLVVzZXItSWRcIl0pXHJcblx0XHRcdHJlY2VpdmVTdWJzY3JpcHRpb25Tb2NrZXRzW2tleV0gPSBzb2NrZXQ7XHJcblx0XHRcdHNlbmRVbnJlYWRCYWRnZUZpYmVyKHNvY2tldCwgJycsIHNvY2tldC5yZXF1ZXN0Ll9xdWVyeVtcIlgtVXNlci1JZFwiXSk7XHJcblx0KVxyXG5cclxuXHR0cnlcclxuXHRcdHNlcnZlci5saXN0ZW4oUE9SVCk7XHJcblx0XHRjb25zb2xlLmxvZygnY2hhdCBzb2NrZXQuaW8gcG9ydCcsIFBPUlQpO1xyXG5cdGNhdGNoIGVcclxuXHRcdGNvbnNvbGUuZXJyb3IoZSlcclxuXHJcblx0I+WPkemAgea2iOaBr1xyXG5cdHNlbmROZXdNZXNzYWdlID0gKG1zZykgLT5cclxuXHRcdGlmIG1zZy5yZWxhdGVkX3RvLm8gJiYgbXNnLnJlbGF0ZWRfdG8uaWRzLmxlbmd0aCA+IDBcclxuXHRcdFx0b2JqZWN0X25hbWUgPSBtc2cucmVsYXRlZF90by5vO1xyXG5cdFx0XHRyZWNvcmRfaWQgPSBtc2cucmVsYXRlZF90by5pZHNbMF07XHJcblx0XHRcdGRlbGV0ZSBtc2cucmVsYXRlZF90b1xyXG5cdFx0XHRtc2cub3duZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJ1c2Vyc1wiKS5maW5kT25lKHtfaWQ6IG1zZy5vd25lcn0sIHtcclxuXHRcdFx0XHRmaWVsZHM6IHtcclxuXHRcdFx0XHRcdF9pZDogMSxcclxuXHRcdFx0XHRcdG5hbWU6IDEsXHJcblx0XHRcdFx0XHRhdmF0YXJVcmw6IDFcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pXHJcblx0XHRcdGlmIG9iamVjdF9uYW1lID09ICdjaGF0X3Jvb21zJ1xyXG5cdFx0XHRcdHJvb20gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUpLmZpbmRPbmUoe19pZDogcmVjb3JkX2lkfSwge2ZpZWxkczoge21lbWJlcnM6IDF9fSlcclxuXHRcdFx0XHRpZiByb29tXHJcblx0XHRcdFx0XHRfLmZvckVhY2ggcm9vbT8ubWVtYmVycywgKG0pLT5cclxuXHRcdFx0XHRcdFx0a2V5ID0gZ2V0UmVjZWl2ZVNvY2tldEtleShvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBtKVxyXG5cdFx0XHRcdFx0XHRzb2NrZXRFbWl0KHJlY2VpdmVNZXNzYWdlU29ja2V0c1trZXldLCBTT0NLRVRFVkVOVE5BTUVTLk5FV01FU1NBR0UsIG1zZylcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHBhcnRpY2lwYW50cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcImNoYXRfc3Vic2NyaXB0aW9uc1wiKS5maW5kKHsncmVsYXRlZF90by5vJzogb2JqZWN0X25hbWUsICdyZWxhdGVkX3RvLmlkcyc6IFtyZWNvcmRfaWRdfSwge2ZpZWxkczoge293bmVyOiAxfX0pXHJcblx0XHRcdFx0cGFydGljaXBhbnRzLmZvckVhY2ggKHApLT5cclxuXHRcdFx0XHRcdGtleSA9IGdldFJlY2VpdmVTb2NrZXRLZXkob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgcC5vd25lcilcclxuXHRcdFx0XHRcdHNvY2tldEVtaXQocmVjZWl2ZU1lc3NhZ2VTb2NrZXRzW2tleV0sIFNPQ0tFVEVWRU5UTkFNRVMuTkVXTUVTU0FHRSwgbXNnKVxyXG5cclxuXHJcblx0I+iuoumYhWNoYXRfbWVzc2FnZXNcclxuXHRjaGF0X21lc3NhZ2VzX2luaXQgPSBmYWxzZVxyXG5cdENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcImNoYXRfbWVzc2FnZXNcIikuZmluZCh7J2NyZWF0ZWQnOiB7JGd0ZTogbmV3IERhdGUoKX19LCB7XHJcblx0XHRmaWVsZHM6IHtcclxuXHRcdFx0Y3JlYXRlZF9ieTogMCxcclxuXHRcdFx0bW9kaWZpZWQ6IDAsXHJcblx0XHRcdG1vZGlmaWVkX2J5OiAwXHJcblx0XHR9XHJcblx0fSkub2JzZXJ2ZSB7XHJcblx0XHRhZGRlZDogKG5ld0RvY3VtZW50KS0+XHJcblx0XHRcdGlmIGNoYXRfbWVzc2FnZXNfaW5pdFxyXG5cdFx0XHRcdHNlbmROZXdNZXNzYWdlIG5ld0RvY3VtZW50XHJcblx0XHRjaGFuZ2VkOiAobmV3RG9jdW1lbnQsIG9sZERvY3VtZW50KS0+XHJcblx0XHRcdHNlbmROZXdNZXNzYWdlIG5ld0RvY3VtZW50XHJcblx0XHRyZW1vdmVkOiAob2xkRG9jdW1lbnQpLT5cclxuXHRcdFx0c2VuZE5ld01lc3NhZ2Ugb2xkRG9jdW1lbnRcclxuXHR9XHJcblx0Y2hhdF9tZXNzYWdlc19pbml0ID0gdHJ1ZVxyXG5cclxuXHJcblx0c2VuZFN1YnNjcmlwdGlvbiA9IChzdWIpLT5cclxuXHRcdGlmIHN1Yi5yZWxhdGVkX3RvLm8gJiYgc3ViLnJlbGF0ZWRfdG8uaWRzLmxlbmd0aCA+IDBcclxuXHRcdFx0b2JqZWN0X25hbWUgPSBzdWIucmVsYXRlZF90by5vO1xyXG5cdFx0XHRyZWNvcmRfaWQgPSBzdWIucmVsYXRlZF90by5pZHNbMF07XHJcblx0XHRcdHN1Yi5tb2RpZmllZF9ieSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInVzZXJzXCIpLmZpbmRPbmUoe19pZDogc3ViLm1vZGlmaWVkX2J5fSwge1xyXG5cdFx0XHRcdGZpZWxkczoge1xyXG5cdFx0XHRcdFx0X2lkOiAxLFxyXG5cdFx0XHRcdFx0bmFtZTogMSxcclxuXHRcdFx0XHRcdGF2YXRhclVybDogMVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHRcdFx0a2V5ID0gZ2V0UmVjZWl2ZVNvY2tldEtleShvYmplY3RfbmFtZSwgJycsIHN1Yi5vd25lcilcclxuXHRcdFx0aWYgcmVjZWl2ZVN1YnNjcmlwdGlvblNvY2tldHNba2V5XVxyXG5cdFx0XHRcdGlmIG9iamVjdF9uYW1lID09ICdjaGF0X3Jvb21zJ1xyXG5cdFx0XHRcdFx0cm9vbSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSkuZmluZE9uZSh7X2lkOiByZWNvcmRfaWR9LCB7ZmllbGRzOiB7bWVtYmVyczogMX19KVxyXG5cdFx0XHRcdFx0aWYgcm9vbVxyXG5cdFx0XHRcdFx0XHRzdWIuX3Jvb20gPSB7XHJcblx0XHRcdFx0XHRcdFx0X2lkOiByb29tLl9pZCxcclxuXHRcdFx0XHRcdFx0XHRtZW1iZXJzOiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJ1c2Vyc1wiKS5maW5kKHtfaWQ6IHskaW46IHJvb20ubWVtYmVycyB8fCBbXX19LCB7XHJcblx0XHRcdFx0XHRcdFx0XHRmaWVsZHM6IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0X2lkOiAxLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRuYW1lOiAxLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRhdmF0YXJVcmw6IDFcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9KS5mZXRjaCgpXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRzb2NrZXRFbWl0KHJlY2VpdmVTdWJzY3JpcHRpb25Tb2NrZXRzW2tleV0sIFNPQ0tFVEVWRU5UTkFNRVMuU1VCU0NSSVBUSU9OUywgc3ViKVxyXG5cdFx0XHRcdHNlbmRVbnJlYWRCYWRnZShyZWNlaXZlU3Vic2NyaXB0aW9uU29ja2V0c1trZXldLCAnJywgc3ViLm93bmVyKTtcclxuXHJcblx0I+iuoumYhWNoYXRfc3Vic2NyaXB0aW9uc1xyXG5cdGNoYXRfc3Vic2NyaXB0aW9uc19pbml0ID0gZmFsc2VcclxuXHRDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJjaGF0X3N1YnNjcmlwdGlvbnNcIikuZmluZCh7XHJcblx0XHQkb3I6IFt7J2NyZWF0ZWQnOiB7JGd0ZTogbmV3IERhdGUoKX19LCAnbW9kaWZpZWQnOiB7JGd0ZTogbmV3IERhdGUoKX1dXHJcblx0fSwge1xyXG5cdFx0ZmllbGRzOiB7XHJcblx0XHRcdGNyZWF0ZWRfYnk6IDBcclxuXHRcdH1cclxuXHR9KS5vYnNlcnZlIHtcclxuXHRcdGFkZGVkOiAobmV3RG9jdW1lbnQpLT5cclxuXHRcdFx0aWYgY2hhdF9zdWJzY3JpcHRpb25zX2luaXRcclxuXHRcdFx0XHRzZW5kU3Vic2NyaXB0aW9uIG5ld0RvY3VtZW50XHJcblx0XHRjaGFuZ2VkOiAobmV3RG9jdW1lbnQsIG9sZERvY3VtZW50KS0+XHJcblx0XHRcdHNlbmRTdWJzY3JpcHRpb24gbmV3RG9jdW1lbnRcclxuXHRcdHJlbW92ZWQ6IChvbGREb2N1bWVudCktPlxyXG5cdFx0XHRzZW5kU3Vic2NyaXB0aW9uIG9sZERvY3VtZW50XHJcblx0fVxyXG5cdGNoYXRfc3Vic2NyaXB0aW9uc19pbml0ID0gdHJ1ZSIsInZhciBGaWJlciwgUE9SVCwgU09DS0VURVZFTlROQU1FUywgU09DS0VUUywgY2hlY2tBdXRoVG9rZW4sIGNoZWNrQXV0aFRva2VuRmliZXIsIGdldFJlY2VpdmVTb2NrZXRLZXksIGh0dHAsIHJlY2VpdmVNZXNzYWdlU29ja2V0cywgcmVjZWl2ZVN1YnNjcmlwdGlvblNvY2tldHMsIHNlbmRVbnJlYWRCYWRnZSwgc2VuZFVucmVhZEJhZGdlRmliZXIsIHNvY2tldEVtaXQsIHNvY2tldF9pbztcblxuaHR0cCA9IHJlcXVpcmUoJ2h0dHAnKTtcblxuc29ja2V0X2lvID0gcmVxdWlyZSgnc29ja2V0LmlvJyk7XG5cbkZpYmVyID0gcmVxdWlyZSgnZmliZXJzJyk7XG5cbmlmICghcHJvY2Vzcy5lbnYuU09DS0VUX0lPX1BPUlQpIHtcbiAgcmV0dXJuO1xufVxuXG5QT1JUID0gcHJvY2Vzcy5lbnYuU09DS0VUX0lPX1BPUlQgfHwgODA4MDtcblxuU09DS0VUUyA9IHt9O1xuXG5yZWNlaXZlTWVzc2FnZVNvY2tldHMgPSB7fTtcblxucmVjZWl2ZVN1YnNjcmlwdGlvblNvY2tldHMgPSB7fTtcblxuU09DS0VURVZFTlROQU1FUyA9IHtcbiAgTkVXTUVTU0FHRTogJ25ldyBtZXNzYWdlJyxcbiAgU1RPUE5FV01FU1NBR0U6ICdzdG9wIG1lc3NhZ2UnLFxuICBSRUNFSVZFTUVTU0FHRTogJ3JlY2VpdmUgbWVzc2FnZScsXG4gIFNVQlNDUklQVElPTlM6ICdzdWJzY3JpcHRpb25zJyxcbiAgU1RPUE5FV1NVQlNDUklQVElPTlM6ICdzdG9wIHN1YnNjcmlwdGlvbnMnLFxuICBSRUNFSVZFU1VCU0NSSVBUSU9OUzogJ3JlY2VpdmUgc3Vic2NyaXB0aW9ucycsXG4gIENPVU5UVU5SRUFEOiAnY291bnQgdW5yZWFkJ1xufTtcblxuY2hlY2tBdXRoVG9rZW4gPSBmdW5jdGlvbih1c2VySWQsIGF1dGhUb2tlbikge1xuICB2YXIgaGFzaGVkVG9rZW4sIHVzZXI7XG4gIGlmICh1c2VySWQgJiYgYXV0aFRva2VuKSB7XG4gICAgaGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYXV0aFRva2VuKTtcbiAgICB1c2VyID0gd3JhcEFzeW5jRmluZE9uZShkYi51c2Vycywge1xuICAgICAgX2lkOiB1c2VySWQsXG4gICAgICBcInNlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucy5oYXNoZWRUb2tlblwiOiBoYXNoZWRUb2tlblxuICAgIH0pO1xuICAgIGlmICh1c2VyKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5nZXRSZWNlaXZlU29ja2V0S2V5ID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgdXNlcklkKSB7XG4gIHJldHVybiBvYmplY3RfbmFtZSArIFwiX1wiICsgcmVjb3JkX2lkICsgXCJfXCIgKyB1c2VySWQ7XG59O1xuXG5zZW5kVW5yZWFkQmFkZ2UgPSBmdW5jdGlvbihzb2NrZXQsIHNwYWNlX2lkLCBvd25lcikge1xuICB2YXIgY291bnRVbnJlYWQ7XG4gIGNvdW50VW5yZWFkID0gMDtcbiAgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwiY2hhdF9zdWJzY3JpcHRpb25zXCIpLmZpbmQoe1xuICAgIG93bmVyOiBvd25lcixcbiAgICB1bnJlYWQ6IHtcbiAgICAgICRndDogMFxuICAgIH1cbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgdW5yZWFkOiAxXG4gICAgfVxuICB9KS5mb3JFYWNoKGZ1bmN0aW9uKF9yKSB7XG4gICAgcmV0dXJuIGNvdW50VW5yZWFkICs9IF9yLnVucmVhZDtcbiAgfSk7XG4gIHJldHVybiBzb2NrZXRFbWl0KHNvY2tldCwgU09DS0VURVZFTlROQU1FUy5DT1VOVFVOUkVBRCwgY291bnRVbnJlYWQpO1xufTtcblxuc2VuZFVucmVhZEJhZGdlRmliZXIgPSBmdW5jdGlvbihzb2NrZXQsIHNwYWNlX2lkLCBvd25lcikge1xuICByZXR1cm4gRmliZXIoZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHNlbmRVbnJlYWRCYWRnZShzb2NrZXQsIHNwYWNlX2lkLCBvd25lcik7XG4gIH0pLnJ1bigpO1xufTtcblxuY2hlY2tBdXRoVG9rZW5GaWJlciA9IGZ1bmN0aW9uKHNvY2tldCwgdXNlcklkLCBhdXRoVG9rZW4pIHtcbiAgcmV0dXJuIEZpYmVyKGZ1bmN0aW9uKCkge1xuICAgIHZhciBjaGVjaztcbiAgICBjaGVjayA9IFN0ZWVkb3MuY2hlY2tBdXRoVG9rZW4odXNlcklkLCBhdXRoVG9rZW4pO1xuICAgIGlmICghY2hlY2spIHtcbiAgICAgIFNPQ0tFVFNbc29ja2V0LmlkXSA9IG51bGw7XG4gICAgICByZXR1cm4gc29ja2V0LmRpc2Nvbm5lY3QoKTtcbiAgICB9XG4gIH0pLnJ1bigpO1xufTtcblxuc29ja2V0RW1pdCA9IGZ1bmN0aW9uKHNvY2tldCwgZXZlbnRuYW1lLCBkYXRhKSB7XG4gIGlmIChzb2NrZXQgJiYgU09DS0VUU1tzb2NrZXQuaWRdKSB7XG4gICAgcmV0dXJuIHNvY2tldC5lbWl0KGV2ZW50bmFtZSwgZGF0YSk7XG4gIH1cbn07XG5cbk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICB2YXIgY2hhdF9tZXNzYWdlc19pbml0LCBjaGF0X3N1YnNjcmlwdGlvbnNfaW5pdCwgY291bnRlciwgZSwgaW8sIHNlbmROZXdNZXNzYWdlLCBzZW5kU3Vic2NyaXB0aW9uLCBzZXJ2ZXI7XG4gIHNlcnZlciA9IGh0dHAuY3JlYXRlU2VydmVyKCk7XG4gIGlvID0gc29ja2V0X2lvKHNlcnZlcik7XG4gIGNvdW50ZXIgPSAwO1xuICBpby5vbignY29ubmVjdGlvbicsIGZ1bmN0aW9uKHNvY2tldCkge1xuICAgIHZhciBhdXRoVG9rZW4sIHF1ZXJ5LCB1c2VySWQ7XG4gICAgcXVlcnkgPSBzb2NrZXQucmVxdWVzdC5fcXVlcnk7XG4gICAgdXNlcklkID0gcXVlcnlbXCJYLVVzZXItSWRcIl07XG4gICAgYXV0aFRva2VuID0gcXVlcnlbXCJYLUF1dGgtVG9rZW5cIl07XG4gICAgaWYgKCF1c2VySWQgfHwgIWF1dGhUb2tlbikge1xuICAgICAgc29ja2V0LmRpc2Nvbm5lY3QoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY2hlY2tBdXRoVG9rZW5GaWJlcihzb2NrZXQsIHVzZXJJZCwgYXV0aFRva2VuKTtcbiAgICBTT0NLRVRTW3NvY2tldC5pZF0gPSBzb2NrZXQ7XG4gICAgc29ja2V0Lm9uKCdkaXNjb25uZWN0JywgZnVuY3Rpb24oKSB7XG4gICAgICBxdWVyeSA9IHNvY2tldC5yZXF1ZXN0Ll9xdWVyeTtcbiAgICAgIHVzZXJJZCA9IHF1ZXJ5W1wiWC1Vc2VyLUlkXCJdO1xuICAgICAgcmV0dXJuIFNPQ0tFVFNbc29ja2V0LmlkXSA9IG51bGw7XG4gICAgfSk7XG4gICAgc29ja2V0Lm9uKFNPQ0tFVEVWRU5UTkFNRVMuU1RPUE5FV01FU1NBR0UsIGZ1bmN0aW9uKHJlcykge1xuICAgICAgdmFyIGtleTtcbiAgICAgIGtleSA9IGdldFJlY2VpdmVTb2NrZXRLZXkocmVzLm9iamVjdF9uYW1lLCByZXMucmVjb3JkX2lkLCBzb2NrZXQucmVxdWVzdC5fcXVlcnlbXCJYLVVzZXItSWRcIl0pO1xuICAgICAgcmV0dXJuIHJlY2VpdmVNZXNzYWdlU29ja2V0c1trZXldID0gbnVsbDtcbiAgICB9KTtcbiAgICBzb2NrZXQub24oU09DS0VURVZFTlROQU1FUy5SRUNFSVZFTUVTU0FHRSwgZnVuY3Rpb24ocmVzKSB7XG4gICAgICB2YXIga2V5O1xuICAgICAga2V5ID0gZ2V0UmVjZWl2ZVNvY2tldEtleShyZXMub2JqZWN0X25hbWUsIHJlcy5yZWNvcmRfaWQsIHNvY2tldC5yZXF1ZXN0Ll9xdWVyeVtcIlgtVXNlci1JZFwiXSk7XG4gICAgICByZXR1cm4gcmVjZWl2ZU1lc3NhZ2VTb2NrZXRzW2tleV0gPSBzb2NrZXQ7XG4gICAgfSk7XG4gICAgc29ja2V0Lm9uKFNPQ0tFVEVWRU5UTkFNRVMuU1RPUE5FV1NVQlNDUklQVElPTlMsIGZ1bmN0aW9uKHJlcykge1xuICAgICAgdmFyIGtleTtcbiAgICAgIGtleSA9IGdldFJlY2VpdmVTb2NrZXRLZXkocmVzLm9iamVjdF9uYW1lLCAnJywgc29ja2V0LnJlcXVlc3QuX3F1ZXJ5W1wiWC1Vc2VyLUlkXCJdKTtcbiAgICAgIHJldHVybiByZWNlaXZlU3Vic2NyaXB0aW9uU29ja2V0c1trZXldID0gbnVsbDtcbiAgICB9KTtcbiAgICByZXR1cm4gc29ja2V0Lm9uKFNPQ0tFVEVWRU5UTkFNRVMuUkVDRUlWRVNVQlNDUklQVElPTlMsIGZ1bmN0aW9uKHJlcykge1xuICAgICAgdmFyIGtleTtcbiAgICAgIGtleSA9IGdldFJlY2VpdmVTb2NrZXRLZXkocmVzLm9iamVjdF9uYW1lLCAnJywgc29ja2V0LnJlcXVlc3QuX3F1ZXJ5W1wiWC1Vc2VyLUlkXCJdKTtcbiAgICAgIHJlY2VpdmVTdWJzY3JpcHRpb25Tb2NrZXRzW2tleV0gPSBzb2NrZXQ7XG4gICAgICByZXR1cm4gc2VuZFVucmVhZEJhZGdlRmliZXIoc29ja2V0LCAnJywgc29ja2V0LnJlcXVlc3QuX3F1ZXJ5W1wiWC1Vc2VyLUlkXCJdKTtcbiAgICB9KTtcbiAgfSk7XG4gIHRyeSB7XG4gICAgc2VydmVyLmxpc3RlbihQT1JUKTtcbiAgICBjb25zb2xlLmxvZygnY2hhdCBzb2NrZXQuaW8gcG9ydCcsIFBPUlQpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGUgPSBlcnJvcjtcbiAgICBjb25zb2xlLmVycm9yKGUpO1xuICB9XG4gIHNlbmROZXdNZXNzYWdlID0gZnVuY3Rpb24obXNnKSB7XG4gICAgdmFyIG9iamVjdF9uYW1lLCBwYXJ0aWNpcGFudHMsIHJlY29yZF9pZCwgcm9vbTtcbiAgICBpZiAobXNnLnJlbGF0ZWRfdG8ubyAmJiBtc2cucmVsYXRlZF90by5pZHMubGVuZ3RoID4gMCkge1xuICAgICAgb2JqZWN0X25hbWUgPSBtc2cucmVsYXRlZF90by5vO1xuICAgICAgcmVjb3JkX2lkID0gbXNnLnJlbGF0ZWRfdG8uaWRzWzBdO1xuICAgICAgZGVsZXRlIG1zZy5yZWxhdGVkX3RvO1xuICAgICAgbXNnLm93bmVyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwidXNlcnNcIikuZmluZE9uZSh7XG4gICAgICAgIF9pZDogbXNnLm93bmVyXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICBuYW1lOiAxLFxuICAgICAgICAgIGF2YXRhclVybDogMVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGlmIChvYmplY3RfbmFtZSA9PT0gJ2NoYXRfcm9vbXMnKSB7XG4gICAgICAgIHJvb20gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUpLmZpbmRPbmUoe1xuICAgICAgICAgIF9pZDogcmVjb3JkX2lkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIG1lbWJlcnM6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAocm9vbSkge1xuICAgICAgICAgIHJldHVybiBfLmZvckVhY2gocm9vbSAhPSBudWxsID8gcm9vbS5tZW1iZXJzIDogdm9pZCAwLCBmdW5jdGlvbihtKSB7XG4gICAgICAgICAgICB2YXIga2V5O1xuICAgICAgICAgICAga2V5ID0gZ2V0UmVjZWl2ZVNvY2tldEtleShvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBtKTtcbiAgICAgICAgICAgIHJldHVybiBzb2NrZXRFbWl0KHJlY2VpdmVNZXNzYWdlU29ja2V0c1trZXldLCBTT0NLRVRFVkVOVE5BTUVTLk5FV01FU1NBR0UsIG1zZyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhcnRpY2lwYW50cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcImNoYXRfc3Vic2NyaXB0aW9uc1wiKS5maW5kKHtcbiAgICAgICAgICAncmVsYXRlZF90by5vJzogb2JqZWN0X25hbWUsXG4gICAgICAgICAgJ3JlbGF0ZWRfdG8uaWRzJzogW3JlY29yZF9pZF1cbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgb3duZXI6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcGFydGljaXBhbnRzLmZvckVhY2goZnVuY3Rpb24ocCkge1xuICAgICAgICAgIHZhciBrZXk7XG4gICAgICAgICAga2V5ID0gZ2V0UmVjZWl2ZVNvY2tldEtleShvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBwLm93bmVyKTtcbiAgICAgICAgICByZXR1cm4gc29ja2V0RW1pdChyZWNlaXZlTWVzc2FnZVNvY2tldHNba2V5XSwgU09DS0VURVZFTlROQU1FUy5ORVdNRVNTQUdFLCBtc2cpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIGNoYXRfbWVzc2FnZXNfaW5pdCA9IGZhbHNlO1xuICBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJjaGF0X21lc3NhZ2VzXCIpLmZpbmQoe1xuICAgICdjcmVhdGVkJzoge1xuICAgICAgJGd0ZTogbmV3IERhdGUoKVxuICAgIH1cbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICB9XG4gIH0pLm9ic2VydmUoe1xuICAgIGFkZGVkOiBmdW5jdGlvbihuZXdEb2N1bWVudCkge1xuICAgICAgaWYgKGNoYXRfbWVzc2FnZXNfaW5pdCkge1xuICAgICAgICByZXR1cm4gc2VuZE5ld01lc3NhZ2UobmV3RG9jdW1lbnQpO1xuICAgICAgfVxuICAgIH0sXG4gICAgY2hhbmdlZDogZnVuY3Rpb24obmV3RG9jdW1lbnQsIG9sZERvY3VtZW50KSB7XG4gICAgICByZXR1cm4gc2VuZE5ld01lc3NhZ2UobmV3RG9jdW1lbnQpO1xuICAgIH0sXG4gICAgcmVtb3ZlZDogZnVuY3Rpb24ob2xkRG9jdW1lbnQpIHtcbiAgICAgIHJldHVybiBzZW5kTmV3TWVzc2FnZShvbGREb2N1bWVudCk7XG4gICAgfVxuICB9KTtcbiAgY2hhdF9tZXNzYWdlc19pbml0ID0gdHJ1ZTtcbiAgc2VuZFN1YnNjcmlwdGlvbiA9IGZ1bmN0aW9uKHN1Yikge1xuICAgIHZhciBrZXksIG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHJvb207XG4gICAgaWYgKHN1Yi5yZWxhdGVkX3RvLm8gJiYgc3ViLnJlbGF0ZWRfdG8uaWRzLmxlbmd0aCA+IDApIHtcbiAgICAgIG9iamVjdF9uYW1lID0gc3ViLnJlbGF0ZWRfdG8ubztcbiAgICAgIHJlY29yZF9pZCA9IHN1Yi5yZWxhdGVkX3RvLmlkc1swXTtcbiAgICAgIHN1Yi5tb2RpZmllZF9ieSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInVzZXJzXCIpLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHN1Yi5tb2RpZmllZF9ieVxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDEsXG4gICAgICAgICAgbmFtZTogMSxcbiAgICAgICAgICBhdmF0YXJVcmw6IDFcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBrZXkgPSBnZXRSZWNlaXZlU29ja2V0S2V5KG9iamVjdF9uYW1lLCAnJywgc3ViLm93bmVyKTtcbiAgICAgIGlmIChyZWNlaXZlU3Vic2NyaXB0aW9uU29ja2V0c1trZXldKSB7XG4gICAgICAgIGlmIChvYmplY3RfbmFtZSA9PT0gJ2NoYXRfcm9vbXMnKSB7XG4gICAgICAgICAgcm9vbSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSkuZmluZE9uZSh7XG4gICAgICAgICAgICBfaWQ6IHJlY29yZF9pZFxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICBtZW1iZXJzOiAxXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKHJvb20pIHtcbiAgICAgICAgICAgIHN1Yi5fcm9vbSA9IHtcbiAgICAgICAgICAgICAgX2lkOiByb29tLl9pZCxcbiAgICAgICAgICAgICAgbWVtYmVyczogQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwidXNlcnNcIikuZmluZCh7XG4gICAgICAgICAgICAgICAgX2lkOiB7XG4gICAgICAgICAgICAgICAgICAkaW46IHJvb20ubWVtYmVycyB8fCBbXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICAgICAgX2lkOiAxLFxuICAgICAgICAgICAgICAgICAgbmFtZTogMSxcbiAgICAgICAgICAgICAgICAgIGF2YXRhclVybDogMVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSkuZmV0Y2goKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgc29ja2V0RW1pdChyZWNlaXZlU3Vic2NyaXB0aW9uU29ja2V0c1trZXldLCBTT0NLRVRFVkVOVE5BTUVTLlNVQlNDUklQVElPTlMsIHN1Yik7XG4gICAgICAgIHJldHVybiBzZW5kVW5yZWFkQmFkZ2UocmVjZWl2ZVN1YnNjcmlwdGlvblNvY2tldHNba2V5XSwgJycsIHN1Yi5vd25lcik7XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBjaGF0X3N1YnNjcmlwdGlvbnNfaW5pdCA9IGZhbHNlO1xuICBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJjaGF0X3N1YnNjcmlwdGlvbnNcIikuZmluZCh7XG4gICAgJG9yOiBbXG4gICAgICB7XG4gICAgICAgICdjcmVhdGVkJzoge1xuICAgICAgICAgICRndGU6IG5ldyBEYXRlKClcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICAnbW9kaWZpZWQnOiB7XG4gICAgICAgICAgJGd0ZTogbmV3IERhdGUoKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgXVxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBjcmVhdGVkX2J5OiAwXG4gICAgfVxuICB9KS5vYnNlcnZlKHtcbiAgICBhZGRlZDogZnVuY3Rpb24obmV3RG9jdW1lbnQpIHtcbiAgICAgIGlmIChjaGF0X3N1YnNjcmlwdGlvbnNfaW5pdCkge1xuICAgICAgICByZXR1cm4gc2VuZFN1YnNjcmlwdGlvbihuZXdEb2N1bWVudCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBjaGFuZ2VkOiBmdW5jdGlvbihuZXdEb2N1bWVudCwgb2xkRG9jdW1lbnQpIHtcbiAgICAgIHJldHVybiBzZW5kU3Vic2NyaXB0aW9uKG5ld0RvY3VtZW50KTtcbiAgICB9LFxuICAgIHJlbW92ZWQ6IGZ1bmN0aW9uKG9sZERvY3VtZW50KSB7XG4gICAgICByZXR1cm4gc2VuZFN1YnNjcmlwdGlvbihvbGREb2N1bWVudCk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGNoYXRfc3Vic2NyaXB0aW9uc19pbml0ID0gdHJ1ZTtcbn0pO1xuIl19
