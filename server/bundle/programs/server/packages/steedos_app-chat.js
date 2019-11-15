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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczphcHAtY2hhdC9jaGVja05wbS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hcHAtY2hhdC9zZXJ2ZXIvcHVibGljYXRpb25zL2NoYXRfbWVzc2FnZXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcHVibGljYXRpb25zL2NoYXRfbWVzc2FnZXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2FwcC1jaGF0L3NlcnZlci9jaGF0LnNvY2tldC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9jaGF0LnNvY2tldC5jb2ZmZWUiXSwibmFtZXMiOlsiY2hlY2tOcG1WZXJzaW9ucyIsIm1vZHVsZSIsImxpbmsiLCJ2IiwiTWV0ZW9yIiwicHVibGlzaENvbXBvc2l0ZSIsInNwYWNlX2lkIiwib2JqZWN0X25hbWUiLCJyZWNvcmRfaWQiLCJvcHRpb25zIiwiZGF0YSIsInF1ZXJ5Iiwic2VsZiIsInVuYmxvY2siLCJmaW5kIiwiQ3JlYXRvciIsImdldENvbGxlY3Rpb24iLCJjaGlsZHJlbiIsInB1c2giLCJwYXJlbnQiLCJlIiwib3duZXIiLCJfaWQiLCJmaWVsZHMiLCJuYW1lIiwiYXZhdGFyVXJsIiwiZXJyb3IiLCJjb25zb2xlIiwibG9nIiwicmVmZXJlbmNlX3RvIiwiRmliZXIiLCJQT1JUIiwiU09DS0VURVZFTlROQU1FUyIsIlNPQ0tFVFMiLCJjaGVja0F1dGhUb2tlbiIsImNoZWNrQXV0aFRva2VuRmliZXIiLCJnZXRSZWNlaXZlU29ja2V0S2V5IiwiaHR0cCIsInJlY2VpdmVNZXNzYWdlU29ja2V0cyIsInJlY2VpdmVTdWJzY3JpcHRpb25Tb2NrZXRzIiwic2VuZFVucmVhZEJhZGdlIiwic2VuZFVucmVhZEJhZGdlRmliZXIiLCJzb2NrZXRFbWl0Iiwic29ja2V0X2lvIiwicmVxdWlyZSIsInByb2Nlc3MiLCJlbnYiLCJTT0NLRVRfSU9fUE9SVCIsIk5FV01FU1NBR0UiLCJTVE9QTkVXTUVTU0FHRSIsIlJFQ0VJVkVNRVNTQUdFIiwiU1VCU0NSSVBUSU9OUyIsIlNUT1BORVdTVUJTQ1JJUFRJT05TIiwiUkVDRUlWRVNVQlNDUklQVElPTlMiLCJDT1VOVFVOUkVBRCIsInVzZXJJZCIsImF1dGhUb2tlbiIsImhhc2hlZFRva2VuIiwidXNlciIsIkFjY291bnRzIiwiX2hhc2hMb2dpblRva2VuIiwid3JhcEFzeW5jRmluZE9uZSIsImRiIiwidXNlcnMiLCJzb2NrZXQiLCJjb3VudFVucmVhZCIsInVucmVhZCIsIiRndCIsImZvckVhY2giLCJfciIsInJ1biIsImNoZWNrIiwiU3RlZWRvcyIsImlkIiwiZGlzY29ubmVjdCIsImV2ZW50bmFtZSIsImVtaXQiLCJzdGFydHVwIiwiY2hhdF9tZXNzYWdlc19pbml0IiwiY2hhdF9zdWJzY3JpcHRpb25zX2luaXQiLCJjb3VudGVyIiwiaW8iLCJzZW5kTmV3TWVzc2FnZSIsInNlbmRTdWJzY3JpcHRpb24iLCJzZXJ2ZXIiLCJjcmVhdGVTZXJ2ZXIiLCJvbiIsInJlcXVlc3QiLCJfcXVlcnkiLCJyZXMiLCJrZXkiLCJsaXN0ZW4iLCJtc2ciLCJwYXJ0aWNpcGFudHMiLCJyb29tIiwicmVsYXRlZF90byIsIm8iLCJpZHMiLCJsZW5ndGgiLCJmaW5kT25lIiwibWVtYmVycyIsIl8iLCJtIiwicCIsIiRndGUiLCJEYXRlIiwiY3JlYXRlZF9ieSIsIm1vZGlmaWVkIiwibW9kaWZpZWRfYnkiLCJvYnNlcnZlIiwiYWRkZWQiLCJuZXdEb2N1bWVudCIsImNoYW5nZWQiLCJvbGREb2N1bWVudCIsInJlbW92ZWQiLCJzdWIiLCJfcm9vbSIsIiRpbiIsImZldGNoIiwiJG9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUlBLGdCQUFKO0FBQXFCQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxvQ0FBWixFQUFpRDtBQUFDRixrQkFBZ0IsQ0FB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QyxXQUFPLFVBQUNDLFdBQUQ7QUFDTixVQUFHaEMsdUJBQUg7QUNnRUssZUQvREpJLGlCQUFpQjRCLFdBQWpCLENDK0RJO0FBQ0Q7QURuRUs7QUFJVkMsYUFBUyxVQUFDRCxXQUFELEVBQWNFLFdBQWQ7QUNrRUwsYURqRUg5QixpQkFBaUI0QixXQUFqQixDQ2lFRztBRHRFTTtBQU1WRyxhQUFTLFVBQUNELFdBQUQ7QUNtRUwsYURsRUg5QixpQkFBaUI4QixXQUFqQixDQ2tFRztBRHpFTTtBQUFBLEdBTlg7QUNrRkMsU0RuRURsQywwQkFBMEIsSUNtRXpCO0FEdE5GLEciLCJmaWxlIjoiL3BhY2thZ2VzL3N0ZWVkb3NfYXBwLWNoYXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjaGVja05wbVZlcnNpb25zIH0gZnJvbSAnbWV0ZW9yL3RtZWFzZGF5OmNoZWNrLW5wbS12ZXJzaW9ucyc7XG5jaGVja05wbVZlcnNpb25zKHtcblx0J3NvY2tldC5pbyc6ICc+PTEuNC44Jyxcblx0Ly8gJ3NvY2tldC5pby1jbGllbnQnOiBcIl4xLjQuOFwiXG59LCAnc3RlZWRvczphcHAtY2hhdCcpO1xuIiwiTWV0ZW9yLnB1Ymxpc2hDb21wb3NpdGUgJ2NoYXRfbWVzc2FnZXMnLCAoc3BhY2VfaWQsIG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIG9wdGlvbnMpLT5cclxuXHRxdWVyeSA9IHsnc3BhY2UnOiBzcGFjZV9pZCwncmVsYXRlZF90by5vJzogb2JqZWN0X25hbWUsJ3JlbGF0ZWRfdG8uaWRzJzogcmVjb3JkX2lkfVxyXG5cclxuXHRzZWxmID0gdGhpc1xyXG5cclxuXHRzZWxmLnVuYmxvY2soKTtcclxuXHJcblx0ZGF0YSA9IHtcclxuXHRcdGZpbmQ6ICgpLT5cclxuXHRcdFx0c2VsZi51bmJsb2NrKCk7XHJcblxyXG5cdFx0XHRyZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwiY2hhdF9tZXNzYWdlc1wiKS5maW5kKHF1ZXJ5LCBvcHRpb25zKTtcclxuXHR9XHJcblxyXG5cdGRhdGEuY2hpbGRyZW4gPSBbXVxyXG5cclxuXHRkYXRhLmNoaWxkcmVuLnB1c2gge1xyXG5cdFx0ZmluZDogKHBhcmVudCkgLT5cclxuXHRcdFx0dHJ5XHJcblx0XHRcdFx0c2VsZi51bmJsb2NrKCk7XHJcblx0XHRcdFx0aWYgcGFyZW50Py5vd25lclxyXG5cdFx0XHRcdFx0cmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInVzZXJzXCIpLmZpbmQoe19pZDogcGFyZW50Lm93bmVyfSwge1xyXG5cdFx0XHRcdFx0XHRmaWVsZHM6IHtuYW1lOiAxLCBhdmF0YXJVcmw6IDF9XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRyZXR1cm4gW11cclxuXHRcdFx0Y2F0Y2ggZVxyXG5cdFx0XHRcdGNvbnNvbGUubG9nKHJlZmVyZW5jZV90bywgcGFyZW50LCBlKVxyXG5cdFx0XHRcdHJldHVybiBbXVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIGRhdGEiLCJNZXRlb3IucHVibGlzaENvbXBvc2l0ZSgnY2hhdF9tZXNzYWdlcycsIGZ1bmN0aW9uKHNwYWNlX2lkLCBvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBvcHRpb25zKSB7XG4gIHZhciBkYXRhLCBxdWVyeSwgc2VsZjtcbiAgcXVlcnkgPSB7XG4gICAgJ3NwYWNlJzogc3BhY2VfaWQsXG4gICAgJ3JlbGF0ZWRfdG8ubyc6IG9iamVjdF9uYW1lLFxuICAgICdyZWxhdGVkX3RvLmlkcyc6IHJlY29yZF9pZFxuICB9O1xuICBzZWxmID0gdGhpcztcbiAgc2VsZi51bmJsb2NrKCk7XG4gIGRhdGEgPSB7XG4gICAgZmluZDogZnVuY3Rpb24oKSB7XG4gICAgICBzZWxmLnVuYmxvY2soKTtcbiAgICAgIHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJjaGF0X21lc3NhZ2VzXCIpLmZpbmQocXVlcnksIG9wdGlvbnMpO1xuICAgIH1cbiAgfTtcbiAgZGF0YS5jaGlsZHJlbiA9IFtdO1xuICBkYXRhLmNoaWxkcmVuLnB1c2goe1xuICAgIGZpbmQ6IGZ1bmN0aW9uKHBhcmVudCkge1xuICAgICAgdmFyIGU7XG4gICAgICB0cnkge1xuICAgICAgICBzZWxmLnVuYmxvY2soKTtcbiAgICAgICAgaWYgKHBhcmVudCAhPSBudWxsID8gcGFyZW50Lm93bmVyIDogdm9pZCAwKSB7XG4gICAgICAgICAgcmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInVzZXJzXCIpLmZpbmQoe1xuICAgICAgICAgICAgX2lkOiBwYXJlbnQub3duZXJcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgbmFtZTogMSxcbiAgICAgICAgICAgICAgYXZhdGFyVXJsOiAxXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgIGNvbnNvbGUubG9nKHJlZmVyZW5jZV90bywgcGFyZW50LCBlKTtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBkYXRhO1xufSk7XG4iLCJodHRwID0gcmVxdWlyZSAnaHR0cCc7XHJcbnNvY2tldF9pbyA9IHJlcXVpcmUgJ3NvY2tldC5pbyc7XHJcbkZpYmVyID0gcmVxdWlyZSgnZmliZXJzJyk7XHJcblxyXG5pZiAhcHJvY2Vzcy5lbnYuU09DS0VUX0lPX1BPUlRcclxuXHRyZXR1cm47XHJcblxyXG5QT1JUID0gcHJvY2Vzcy5lbnYuU09DS0VUX0lPX1BPUlQgfHwgODA4MDtcclxuXHJcblNPQ0tFVFMgPSB7fVxyXG5cclxuI+aOpeaUtua2iOaBr+eahHNvY2tldOmbhuWQiCxrZXnnmoTmoLzlvI/kuLo6IHtvYmplY3RfbmFtZX1fe3JlY29yZF9pZH1fe3VzZXJJZH0sIOWAvOS4unNvY2tldCDlr7nosaEsIOebruWJjeS4jeaUr+aMgeS4gOS4queUqOaIt+WkmuS4qnNvY2tldOaOpeWFpVxyXG5yZWNlaXZlTWVzc2FnZVNvY2tldHMgPSB7XHJcblxyXG59XHJcblxyXG5yZWNlaXZlU3Vic2NyaXB0aW9uU29ja2V0cyA9IHtcclxuXHJcbn1cclxuXHJcblNPQ0tFVEVWRU5UTkFNRVMgPSB7XHJcblx0TkVXTUVTU0FHRTogJ25ldyBtZXNzYWdlJyxcclxuXHRTVE9QTkVXTUVTU0FHRTogJ3N0b3AgbWVzc2FnZScsXHJcblx0UkVDRUlWRU1FU1NBR0U6ICdyZWNlaXZlIG1lc3NhZ2UnLFxyXG5cdFNVQlNDUklQVElPTlM6ICdzdWJzY3JpcHRpb25zJyxcclxuXHRTVE9QTkVXU1VCU0NSSVBUSU9OUzogJ3N0b3Agc3Vic2NyaXB0aW9ucycsXHJcblx0UkVDRUlWRVNVQlNDUklQVElPTlM6ICdyZWNlaXZlIHN1YnNjcmlwdGlvbnMnLFxyXG5cdENPVU5UVU5SRUFEOiAnY291bnQgdW5yZWFkJ1xyXG59O1xyXG5cclxuY2hlY2tBdXRoVG9rZW4gPSAodXNlcklkLCBhdXRoVG9rZW4pIC0+XHJcblx0aWYgdXNlcklkIGFuZCBhdXRoVG9rZW5cclxuXHRcdGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGF1dGhUb2tlbilcclxuXHRcdHVzZXIgPSB3cmFwQXN5bmNGaW5kT25lKGRiLnVzZXJzLCB7XHJcblx0XHRcdFx0X2lkOiB1c2VySWQsXHJcblx0XHRcdFx0XCJzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnMuaGFzaGVkVG9rZW5cIjogaGFzaGVkVG9rZW5cclxuXHRcdFx0fVxyXG5cdFx0KVxyXG5cdFx0aWYgdXNlclxyXG5cdFx0XHRyZXR1cm4gdHJ1ZVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRyZXR1cm4gZmFsc2VcclxuXHJcblxyXG5nZXRSZWNlaXZlU29ja2V0S2V5ID0gKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHVzZXJJZCktPlxyXG5cdHJldHVybiBcIiN7b2JqZWN0X25hbWV9XyN7cmVjb3JkX2lkfV8je3VzZXJJZH1cIlxyXG5cclxuc2VuZFVucmVhZEJhZGdlID0gKHNvY2tldCwgc3BhY2VfaWQsIG93bmVyKS0+XHJcblx0Y291bnRVbnJlYWQgPSAwXHJcblx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKFwiY2hhdF9zdWJzY3JpcHRpb25zXCIpLmZpbmQoe1xyXG5cdFx0b3duZXI6IG93bmVyLFxyXG5cdFx0dW5yZWFkOiB7JGd0OiAwfVxyXG5cdH0sIHtmaWVsZHM6IHt1bnJlYWQ6IDF9fSkuZm9yRWFjaCAoX3IpLT5cclxuXHRcdGNvdW50VW5yZWFkICs9IF9yLnVucmVhZFxyXG5cdHNvY2tldEVtaXQoc29ja2V0LCBTT0NLRVRFVkVOVE5BTUVTLkNPVU5UVU5SRUFELCBjb3VudFVucmVhZCk7XHJcblxyXG4j5L2/55SoRmliZXLnlKjkuo7lpITnkIbplJnor686J01ldGVvciBjb2RlIG11c3QgYWx3YXlzIHJ1biB3aXRoaW4gYSBGaWJlcicgLiDlsJ3or5XkuoZNZXRlb3Ig5o+Q5L6b55qETWV0ZW9yLmJpbmRFbnZpcm9ubWVudFxcTWV0ZW9yLndyYXBBc3luY+mDveS4jeiDveWkhOeQhuatpOmUmeivry5cclxuc2VuZFVucmVhZEJhZGdlRmliZXIgPSAoc29ja2V0LCBzcGFjZV9pZCwgb3duZXIpLT5cclxuXHRGaWJlcigoKS0+XHJcblx0XHRzZW5kVW5yZWFkQmFkZ2Uoc29ja2V0LCBzcGFjZV9pZCwgb3duZXIpO1xyXG5cdCkucnVuKCk7XHJcblxyXG4jVE9ETzogRmliZXLov5Tlm57lgLzpl67popjlpITnkIZcclxuY2hlY2tBdXRoVG9rZW5GaWJlciA9IChzb2NrZXQsIHVzZXJJZCwgYXV0aFRva2VuKS0+XHJcblx0RmliZXIoKCktPlxyXG5cdFx0Y2hlY2sgPSBTdGVlZG9zLmNoZWNrQXV0aFRva2VuKHVzZXJJZCwgYXV0aFRva2VuKTtcclxuXHRcdGlmKCFjaGVjaylcclxuXHRcdFx0U09DS0VUU1tzb2NrZXQuaWRdID0gbnVsbDtcclxuXHRcdFx0c29ja2V0LmRpc2Nvbm5lY3QoKTtcclxuXHQpLnJ1bigpO1xyXG5cclxuc29ja2V0RW1pdCA9IChzb2NrZXQsIGV2ZW50bmFtZSwgZGF0YSkgLT5cclxuXHRpZiBzb2NrZXQgJiYgU09DS0VUU1tzb2NrZXQuaWRdXHJcblx0XHRzb2NrZXQuZW1pdChldmVudG5hbWUsIGRhdGEpXHJcblxyXG5NZXRlb3Iuc3RhcnR1cCAoKS0+XHJcblx0c2VydmVyID0gaHR0cC5jcmVhdGVTZXJ2ZXIoKTtcclxuXHJcblx0aW8gPSBzb2NrZXRfaW8oc2VydmVyKTtcclxuXHJcblx0Y291bnRlciA9IDA7XHJcblxyXG5cdGlvLm9uKCdjb25uZWN0aW9uJywgKHNvY2tldCktPlxyXG5cdFx0cXVlcnkgPSBzb2NrZXQucmVxdWVzdC5fcXVlcnk7XHJcblx0XHR1c2VySWQgPSBxdWVyeVtcIlgtVXNlci1JZFwiXVxyXG5cdFx0YXV0aFRva2VuID0gcXVlcnlbXCJYLUF1dGgtVG9rZW5cIl1cclxuXHJcblx0XHRpZiAhdXNlcklkIHx8ICFhdXRoVG9rZW5cclxuXHRcdFx0c29ja2V0LmRpc2Nvbm5lY3QoKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cclxuXHRcdGNoZWNrQXV0aFRva2VuRmliZXIoc29ja2V0LCB1c2VySWQsIGF1dGhUb2tlbilcclxuXHJcblx0XHRTT0NLRVRTW3NvY2tldC5pZF0gPSBzb2NrZXQ7XHJcblxyXG5cdFx0I+mUgOavgXNvY2tldFxyXG5cdFx0c29ja2V0Lm9uICdkaXNjb25uZWN0JywgKCktPlxyXG5cdFx0XHRxdWVyeSA9IHNvY2tldC5yZXF1ZXN0Ll9xdWVyeTtcclxuXHRcdFx0dXNlcklkID0gcXVlcnlbXCJYLVVzZXItSWRcIl1cclxuXHRcdFx0U09DS0VUU1tzb2NrZXQuaWRdID0gbnVsbDtcclxuXHJcblx0XHQj5YGc5q2i5o6l5pS25raI5oGvXHJcblx0XHRzb2NrZXQub24gU09DS0VURVZFTlROQU1FUy5TVE9QTkVXTUVTU0FHRSwgKHJlcyktPlxyXG5cdFx0XHRrZXkgPSBnZXRSZWNlaXZlU29ja2V0S2V5KHJlcy5vYmplY3RfbmFtZSwgcmVzLnJlY29yZF9pZCwgc29ja2V0LnJlcXVlc3QuX3F1ZXJ5W1wiWC1Vc2VyLUlkXCJdKVxyXG5cdFx0XHRyZWNlaXZlTWVzc2FnZVNvY2tldHNba2V5XSA9IG51bGw7XHJcblxyXG5cdFx0I+W8gOWni+aOpeaUtua2iOaBr1xyXG5cdFx0c29ja2V0Lm9uIFNPQ0tFVEVWRU5UTkFNRVMuUkVDRUlWRU1FU1NBR0UsIChyZXMpLT5cclxuXHRcdFx0a2V5ID0gZ2V0UmVjZWl2ZVNvY2tldEtleShyZXMub2JqZWN0X25hbWUsIHJlcy5yZWNvcmRfaWQsIHNvY2tldC5yZXF1ZXN0Ll9xdWVyeVtcIlgtVXNlci1JZFwiXSlcclxuXHRcdFx0cmVjZWl2ZU1lc3NhZ2VTb2NrZXRzW2tleV0gPSBzb2NrZXQ7XHJcblxyXG5cclxuXHRcdCPlgZzmraLmjqXmlLbmtojmga9cclxuXHRcdHNvY2tldC5vbiBTT0NLRVRFVkVOVE5BTUVTLlNUT1BORVdTVUJTQ1JJUFRJT05TLCAocmVzKS0+XHJcblx0XHRcdGtleSA9IGdldFJlY2VpdmVTb2NrZXRLZXkocmVzLm9iamVjdF9uYW1lLCAnJywgc29ja2V0LnJlcXVlc3QuX3F1ZXJ5W1wiWC1Vc2VyLUlkXCJdKVxyXG5cdFx0XHRyZWNlaXZlU3Vic2NyaXB0aW9uU29ja2V0c1trZXldID0gbnVsbDtcclxuXHJcblx0XHQj5byA5aeL5o6l5pS25raI5oGvXHJcblx0XHRzb2NrZXQub24gU09DS0VURVZFTlROQU1FUy5SRUNFSVZFU1VCU0NSSVBUSU9OUywgKHJlcyktPlxyXG5cdFx0XHRrZXkgPSBnZXRSZWNlaXZlU29ja2V0S2V5KHJlcy5vYmplY3RfbmFtZSwgJycsIHNvY2tldC5yZXF1ZXN0Ll9xdWVyeVtcIlgtVXNlci1JZFwiXSlcclxuXHRcdFx0cmVjZWl2ZVN1YnNjcmlwdGlvblNvY2tldHNba2V5XSA9IHNvY2tldDtcclxuXHRcdFx0c2VuZFVucmVhZEJhZGdlRmliZXIoc29ja2V0LCAnJywgc29ja2V0LnJlcXVlc3QuX3F1ZXJ5W1wiWC1Vc2VyLUlkXCJdKTtcclxuXHQpXHJcblxyXG5cdHRyeVxyXG5cdFx0c2VydmVyLmxpc3RlbihQT1JUKTtcclxuXHRcdGNvbnNvbGUubG9nKCdjaGF0IHNvY2tldC5pbyBwb3J0JywgUE9SVCk7XHJcblx0Y2F0Y2ggZVxyXG5cdFx0Y29uc29sZS5lcnJvcihlKVxyXG5cclxuXHQj5Y+R6YCB5raI5oGvXHJcblx0c2VuZE5ld01lc3NhZ2UgPSAobXNnKSAtPlxyXG5cdFx0aWYgbXNnLnJlbGF0ZWRfdG8ubyAmJiBtc2cucmVsYXRlZF90by5pZHMubGVuZ3RoID4gMFxyXG5cdFx0XHRvYmplY3RfbmFtZSA9IG1zZy5yZWxhdGVkX3RvLm87XHJcblx0XHRcdHJlY29yZF9pZCA9IG1zZy5yZWxhdGVkX3RvLmlkc1swXTtcclxuXHRcdFx0ZGVsZXRlIG1zZy5yZWxhdGVkX3RvXHJcblx0XHRcdG1zZy5vd25lciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInVzZXJzXCIpLmZpbmRPbmUoe19pZDogbXNnLm93bmVyfSwge1xyXG5cdFx0XHRcdGZpZWxkczoge1xyXG5cdFx0XHRcdFx0X2lkOiAxLFxyXG5cdFx0XHRcdFx0bmFtZTogMSxcclxuXHRcdFx0XHRcdGF2YXRhclVybDogMVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHRcdFx0aWYgb2JqZWN0X25hbWUgPT0gJ2NoYXRfcm9vbXMnXHJcblx0XHRcdFx0cm9vbSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSkuZmluZE9uZSh7X2lkOiByZWNvcmRfaWR9LCB7ZmllbGRzOiB7bWVtYmVyczogMX19KVxyXG5cdFx0XHRcdGlmIHJvb21cclxuXHRcdFx0XHRcdF8uZm9yRWFjaCByb29tPy5tZW1iZXJzLCAobSktPlxyXG5cdFx0XHRcdFx0XHRrZXkgPSBnZXRSZWNlaXZlU29ja2V0S2V5KG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIG0pXHJcblx0XHRcdFx0XHRcdHNvY2tldEVtaXQocmVjZWl2ZU1lc3NhZ2VTb2NrZXRzW2tleV0sIFNPQ0tFVEVWRU5UTkFNRVMuTkVXTUVTU0FHRSwgbXNnKVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0cGFydGljaXBhbnRzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwiY2hhdF9zdWJzY3JpcHRpb25zXCIpLmZpbmQoeydyZWxhdGVkX3RvLm8nOiBvYmplY3RfbmFtZSwgJ3JlbGF0ZWRfdG8uaWRzJzogW3JlY29yZF9pZF19LCB7ZmllbGRzOiB7b3duZXI6IDF9fSlcclxuXHRcdFx0XHRwYXJ0aWNpcGFudHMuZm9yRWFjaCAocCktPlxyXG5cdFx0XHRcdFx0a2V5ID0gZ2V0UmVjZWl2ZVNvY2tldEtleShvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBwLm93bmVyKVxyXG5cdFx0XHRcdFx0c29ja2V0RW1pdChyZWNlaXZlTWVzc2FnZVNvY2tldHNba2V5XSwgU09DS0VURVZFTlROQU1FUy5ORVdNRVNTQUdFLCBtc2cpXHJcblxyXG5cclxuXHQj6K6i6ZiFY2hhdF9tZXNzYWdlc1xyXG5cdGNoYXRfbWVzc2FnZXNfaW5pdCA9IGZhbHNlXHJcblx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKFwiY2hhdF9tZXNzYWdlc1wiKS5maW5kKHsnY3JlYXRlZCc6IHskZ3RlOiBuZXcgRGF0ZSgpfX0sIHtcclxuXHRcdGZpZWxkczoge1xyXG5cdFx0XHRjcmVhdGVkX2J5OiAwLFxyXG5cdFx0XHRtb2RpZmllZDogMCxcclxuXHRcdFx0bW9kaWZpZWRfYnk6IDBcclxuXHRcdH1cclxuXHR9KS5vYnNlcnZlIHtcclxuXHRcdGFkZGVkOiAobmV3RG9jdW1lbnQpLT5cclxuXHRcdFx0aWYgY2hhdF9tZXNzYWdlc19pbml0XHJcblx0XHRcdFx0c2VuZE5ld01lc3NhZ2UgbmV3RG9jdW1lbnRcclxuXHRcdGNoYW5nZWQ6IChuZXdEb2N1bWVudCwgb2xkRG9jdW1lbnQpLT5cclxuXHRcdFx0c2VuZE5ld01lc3NhZ2UgbmV3RG9jdW1lbnRcclxuXHRcdHJlbW92ZWQ6IChvbGREb2N1bWVudCktPlxyXG5cdFx0XHRzZW5kTmV3TWVzc2FnZSBvbGREb2N1bWVudFxyXG5cdH1cclxuXHRjaGF0X21lc3NhZ2VzX2luaXQgPSB0cnVlXHJcblxyXG5cclxuXHRzZW5kU3Vic2NyaXB0aW9uID0gKHN1YiktPlxyXG5cdFx0aWYgc3ViLnJlbGF0ZWRfdG8ubyAmJiBzdWIucmVsYXRlZF90by5pZHMubGVuZ3RoID4gMFxyXG5cdFx0XHRvYmplY3RfbmFtZSA9IHN1Yi5yZWxhdGVkX3RvLm87XHJcblx0XHRcdHJlY29yZF9pZCA9IHN1Yi5yZWxhdGVkX3RvLmlkc1swXTtcclxuXHRcdFx0c3ViLm1vZGlmaWVkX2J5ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwidXNlcnNcIikuZmluZE9uZSh7X2lkOiBzdWIubW9kaWZpZWRfYnl9LCB7XHJcblx0XHRcdFx0ZmllbGRzOiB7XHJcblx0XHRcdFx0XHRfaWQ6IDEsXHJcblx0XHRcdFx0XHRuYW1lOiAxLFxyXG5cdFx0XHRcdFx0YXZhdGFyVXJsOiAxXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KVxyXG5cdFx0XHRrZXkgPSBnZXRSZWNlaXZlU29ja2V0S2V5KG9iamVjdF9uYW1lLCAnJywgc3ViLm93bmVyKVxyXG5cdFx0XHRpZiByZWNlaXZlU3Vic2NyaXB0aW9uU29ja2V0c1trZXldXHJcblx0XHRcdFx0aWYgb2JqZWN0X25hbWUgPT0gJ2NoYXRfcm9vbXMnXHJcblx0XHRcdFx0XHRyb29tID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lKS5maW5kT25lKHtfaWQ6IHJlY29yZF9pZH0sIHtmaWVsZHM6IHttZW1iZXJzOiAxfX0pXHJcblx0XHRcdFx0XHRpZiByb29tXHJcblx0XHRcdFx0XHRcdHN1Yi5fcm9vbSA9IHtcclxuXHRcdFx0XHRcdFx0XHRfaWQ6IHJvb20uX2lkLFxyXG5cdFx0XHRcdFx0XHRcdG1lbWJlcnM6IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInVzZXJzXCIpLmZpbmQoe19pZDogeyRpbjogcm9vbS5tZW1iZXJzIHx8IFtdfX0sIHtcclxuXHRcdFx0XHRcdFx0XHRcdGZpZWxkczoge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRfaWQ6IDEsXHJcblx0XHRcdFx0XHRcdFx0XHRcdG5hbWU6IDEsXHJcblx0XHRcdFx0XHRcdFx0XHRcdGF2YXRhclVybDogMVxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH0pLmZldGNoKClcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdHNvY2tldEVtaXQocmVjZWl2ZVN1YnNjcmlwdGlvblNvY2tldHNba2V5XSwgU09DS0VURVZFTlROQU1FUy5TVUJTQ1JJUFRJT05TLCBzdWIpXHJcblx0XHRcdFx0c2VuZFVucmVhZEJhZGdlKHJlY2VpdmVTdWJzY3JpcHRpb25Tb2NrZXRzW2tleV0sICcnLCBzdWIub3duZXIpO1xyXG5cclxuXHQj6K6i6ZiFY2hhdF9zdWJzY3JpcHRpb25zXHJcblx0Y2hhdF9zdWJzY3JpcHRpb25zX2luaXQgPSBmYWxzZVxyXG5cdENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcImNoYXRfc3Vic2NyaXB0aW9uc1wiKS5maW5kKHtcclxuXHRcdCRvcjogW3snY3JlYXRlZCc6IHskZ3RlOiBuZXcgRGF0ZSgpfX0sICdtb2RpZmllZCc6IHskZ3RlOiBuZXcgRGF0ZSgpfV1cclxuXHR9LCB7XHJcblx0XHRmaWVsZHM6IHtcclxuXHRcdFx0Y3JlYXRlZF9ieTogMFxyXG5cdFx0fVxyXG5cdH0pLm9ic2VydmUge1xyXG5cdFx0YWRkZWQ6IChuZXdEb2N1bWVudCktPlxyXG5cdFx0XHRpZiBjaGF0X3N1YnNjcmlwdGlvbnNfaW5pdFxyXG5cdFx0XHRcdHNlbmRTdWJzY3JpcHRpb24gbmV3RG9jdW1lbnRcclxuXHRcdGNoYW5nZWQ6IChuZXdEb2N1bWVudCwgb2xkRG9jdW1lbnQpLT5cclxuXHRcdFx0c2VuZFN1YnNjcmlwdGlvbiBuZXdEb2N1bWVudFxyXG5cdFx0cmVtb3ZlZDogKG9sZERvY3VtZW50KS0+XHJcblx0XHRcdHNlbmRTdWJzY3JpcHRpb24gb2xkRG9jdW1lbnRcclxuXHR9XHJcblx0Y2hhdF9zdWJzY3JpcHRpb25zX2luaXQgPSB0cnVlIiwidmFyIEZpYmVyLCBQT1JULCBTT0NLRVRFVkVOVE5BTUVTLCBTT0NLRVRTLCBjaGVja0F1dGhUb2tlbiwgY2hlY2tBdXRoVG9rZW5GaWJlciwgZ2V0UmVjZWl2ZVNvY2tldEtleSwgaHR0cCwgcmVjZWl2ZU1lc3NhZ2VTb2NrZXRzLCByZWNlaXZlU3Vic2NyaXB0aW9uU29ja2V0cywgc2VuZFVucmVhZEJhZGdlLCBzZW5kVW5yZWFkQmFkZ2VGaWJlciwgc29ja2V0RW1pdCwgc29ja2V0X2lvO1xuXG5odHRwID0gcmVxdWlyZSgnaHR0cCcpO1xuXG5zb2NrZXRfaW8gPSByZXF1aXJlKCdzb2NrZXQuaW8nKTtcblxuRmliZXIgPSByZXF1aXJlKCdmaWJlcnMnKTtcblxuaWYgKCFwcm9jZXNzLmVudi5TT0NLRVRfSU9fUE9SVCkge1xuICByZXR1cm47XG59XG5cblBPUlQgPSBwcm9jZXNzLmVudi5TT0NLRVRfSU9fUE9SVCB8fCA4MDgwO1xuXG5TT0NLRVRTID0ge307XG5cbnJlY2VpdmVNZXNzYWdlU29ja2V0cyA9IHt9O1xuXG5yZWNlaXZlU3Vic2NyaXB0aW9uU29ja2V0cyA9IHt9O1xuXG5TT0NLRVRFVkVOVE5BTUVTID0ge1xuICBORVdNRVNTQUdFOiAnbmV3IG1lc3NhZ2UnLFxuICBTVE9QTkVXTUVTU0FHRTogJ3N0b3AgbWVzc2FnZScsXG4gIFJFQ0VJVkVNRVNTQUdFOiAncmVjZWl2ZSBtZXNzYWdlJyxcbiAgU1VCU0NSSVBUSU9OUzogJ3N1YnNjcmlwdGlvbnMnLFxuICBTVE9QTkVXU1VCU0NSSVBUSU9OUzogJ3N0b3Agc3Vic2NyaXB0aW9ucycsXG4gIFJFQ0VJVkVTVUJTQ1JJUFRJT05TOiAncmVjZWl2ZSBzdWJzY3JpcHRpb25zJyxcbiAgQ09VTlRVTlJFQUQ6ICdjb3VudCB1bnJlYWQnXG59O1xuXG5jaGVja0F1dGhUb2tlbiA9IGZ1bmN0aW9uKHVzZXJJZCwgYXV0aFRva2VuKSB7XG4gIHZhciBoYXNoZWRUb2tlbiwgdXNlcjtcbiAgaWYgKHVzZXJJZCAmJiBhdXRoVG9rZW4pIHtcbiAgICBoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoVG9rZW4pO1xuICAgIHVzZXIgPSB3cmFwQXN5bmNGaW5kT25lKGRiLnVzZXJzLCB7XG4gICAgICBfaWQ6IHVzZXJJZCxcbiAgICAgIFwic2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VuXG4gICAgfSk7XG4gICAgaWYgKHVzZXIpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbmdldFJlY2VpdmVTb2NrZXRLZXkgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCB1c2VySWQpIHtcbiAgcmV0dXJuIG9iamVjdF9uYW1lICsgXCJfXCIgKyByZWNvcmRfaWQgKyBcIl9cIiArIHVzZXJJZDtcbn07XG5cbnNlbmRVbnJlYWRCYWRnZSA9IGZ1bmN0aW9uKHNvY2tldCwgc3BhY2VfaWQsIG93bmVyKSB7XG4gIHZhciBjb3VudFVucmVhZDtcbiAgY291bnRVbnJlYWQgPSAwO1xuICBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJjaGF0X3N1YnNjcmlwdGlvbnNcIikuZmluZCh7XG4gICAgb3duZXI6IG93bmVyLFxuICAgIHVucmVhZDoge1xuICAgICAgJGd0OiAwXG4gICAgfVxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICB1bnJlYWQ6IDFcbiAgICB9XG4gIH0pLmZvckVhY2goZnVuY3Rpb24oX3IpIHtcbiAgICByZXR1cm4gY291bnRVbnJlYWQgKz0gX3IudW5yZWFkO1xuICB9KTtcbiAgcmV0dXJuIHNvY2tldEVtaXQoc29ja2V0LCBTT0NLRVRFVkVOVE5BTUVTLkNPVU5UVU5SRUFELCBjb3VudFVucmVhZCk7XG59O1xuXG5zZW5kVW5yZWFkQmFkZ2VGaWJlciA9IGZ1bmN0aW9uKHNvY2tldCwgc3BhY2VfaWQsIG93bmVyKSB7XG4gIHJldHVybiBGaWJlcihmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gc2VuZFVucmVhZEJhZGdlKHNvY2tldCwgc3BhY2VfaWQsIG93bmVyKTtcbiAgfSkucnVuKCk7XG59O1xuXG5jaGVja0F1dGhUb2tlbkZpYmVyID0gZnVuY3Rpb24oc29ja2V0LCB1c2VySWQsIGF1dGhUb2tlbikge1xuICByZXR1cm4gRmliZXIoZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNoZWNrO1xuICAgIGNoZWNrID0gU3RlZWRvcy5jaGVja0F1dGhUb2tlbih1c2VySWQsIGF1dGhUb2tlbik7XG4gICAgaWYgKCFjaGVjaykge1xuICAgICAgU09DS0VUU1tzb2NrZXQuaWRdID0gbnVsbDtcbiAgICAgIHJldHVybiBzb2NrZXQuZGlzY29ubmVjdCgpO1xuICAgIH1cbiAgfSkucnVuKCk7XG59O1xuXG5zb2NrZXRFbWl0ID0gZnVuY3Rpb24oc29ja2V0LCBldmVudG5hbWUsIGRhdGEpIHtcbiAgaWYgKHNvY2tldCAmJiBTT0NLRVRTW3NvY2tldC5pZF0pIHtcbiAgICByZXR1cm4gc29ja2V0LmVtaXQoZXZlbnRuYW1lLCBkYXRhKTtcbiAgfVxufTtcblxuTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHZhciBjaGF0X21lc3NhZ2VzX2luaXQsIGNoYXRfc3Vic2NyaXB0aW9uc19pbml0LCBjb3VudGVyLCBlLCBpbywgc2VuZE5ld01lc3NhZ2UsIHNlbmRTdWJzY3JpcHRpb24sIHNlcnZlcjtcbiAgc2VydmVyID0gaHR0cC5jcmVhdGVTZXJ2ZXIoKTtcbiAgaW8gPSBzb2NrZXRfaW8oc2VydmVyKTtcbiAgY291bnRlciA9IDA7XG4gIGlvLm9uKCdjb25uZWN0aW9uJywgZnVuY3Rpb24oc29ja2V0KSB7XG4gICAgdmFyIGF1dGhUb2tlbiwgcXVlcnksIHVzZXJJZDtcbiAgICBxdWVyeSA9IHNvY2tldC5yZXF1ZXN0Ll9xdWVyeTtcbiAgICB1c2VySWQgPSBxdWVyeVtcIlgtVXNlci1JZFwiXTtcbiAgICBhdXRoVG9rZW4gPSBxdWVyeVtcIlgtQXV0aC1Ub2tlblwiXTtcbiAgICBpZiAoIXVzZXJJZCB8fCAhYXV0aFRva2VuKSB7XG4gICAgICBzb2NrZXQuZGlzY29ubmVjdCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjaGVja0F1dGhUb2tlbkZpYmVyKHNvY2tldCwgdXNlcklkLCBhdXRoVG9rZW4pO1xuICAgIFNPQ0tFVFNbc29ja2V0LmlkXSA9IHNvY2tldDtcbiAgICBzb2NrZXQub24oJ2Rpc2Nvbm5lY3QnLCBmdW5jdGlvbigpIHtcbiAgICAgIHF1ZXJ5ID0gc29ja2V0LnJlcXVlc3QuX3F1ZXJ5O1xuICAgICAgdXNlcklkID0gcXVlcnlbXCJYLVVzZXItSWRcIl07XG4gICAgICByZXR1cm4gU09DS0VUU1tzb2NrZXQuaWRdID0gbnVsbDtcbiAgICB9KTtcbiAgICBzb2NrZXQub24oU09DS0VURVZFTlROQU1FUy5TVE9QTkVXTUVTU0FHRSwgZnVuY3Rpb24ocmVzKSB7XG4gICAgICB2YXIga2V5O1xuICAgICAga2V5ID0gZ2V0UmVjZWl2ZVNvY2tldEtleShyZXMub2JqZWN0X25hbWUsIHJlcy5yZWNvcmRfaWQsIHNvY2tldC5yZXF1ZXN0Ll9xdWVyeVtcIlgtVXNlci1JZFwiXSk7XG4gICAgICByZXR1cm4gcmVjZWl2ZU1lc3NhZ2VTb2NrZXRzW2tleV0gPSBudWxsO1xuICAgIH0pO1xuICAgIHNvY2tldC5vbihTT0NLRVRFVkVOVE5BTUVTLlJFQ0VJVkVNRVNTQUdFLCBmdW5jdGlvbihyZXMpIHtcbiAgICAgIHZhciBrZXk7XG4gICAgICBrZXkgPSBnZXRSZWNlaXZlU29ja2V0S2V5KHJlcy5vYmplY3RfbmFtZSwgcmVzLnJlY29yZF9pZCwgc29ja2V0LnJlcXVlc3QuX3F1ZXJ5W1wiWC1Vc2VyLUlkXCJdKTtcbiAgICAgIHJldHVybiByZWNlaXZlTWVzc2FnZVNvY2tldHNba2V5XSA9IHNvY2tldDtcbiAgICB9KTtcbiAgICBzb2NrZXQub24oU09DS0VURVZFTlROQU1FUy5TVE9QTkVXU1VCU0NSSVBUSU9OUywgZnVuY3Rpb24ocmVzKSB7XG4gICAgICB2YXIga2V5O1xuICAgICAga2V5ID0gZ2V0UmVjZWl2ZVNvY2tldEtleShyZXMub2JqZWN0X25hbWUsICcnLCBzb2NrZXQucmVxdWVzdC5fcXVlcnlbXCJYLVVzZXItSWRcIl0pO1xuICAgICAgcmV0dXJuIHJlY2VpdmVTdWJzY3JpcHRpb25Tb2NrZXRzW2tleV0gPSBudWxsO1xuICAgIH0pO1xuICAgIHJldHVybiBzb2NrZXQub24oU09DS0VURVZFTlROQU1FUy5SRUNFSVZFU1VCU0NSSVBUSU9OUywgZnVuY3Rpb24ocmVzKSB7XG4gICAgICB2YXIga2V5O1xuICAgICAga2V5ID0gZ2V0UmVjZWl2ZVNvY2tldEtleShyZXMub2JqZWN0X25hbWUsICcnLCBzb2NrZXQucmVxdWVzdC5fcXVlcnlbXCJYLVVzZXItSWRcIl0pO1xuICAgICAgcmVjZWl2ZVN1YnNjcmlwdGlvblNvY2tldHNba2V5XSA9IHNvY2tldDtcbiAgICAgIHJldHVybiBzZW5kVW5yZWFkQmFkZ2VGaWJlcihzb2NrZXQsICcnLCBzb2NrZXQucmVxdWVzdC5fcXVlcnlbXCJYLVVzZXItSWRcIl0pO1xuICAgIH0pO1xuICB9KTtcbiAgdHJ5IHtcbiAgICBzZXJ2ZXIubGlzdGVuKFBPUlQpO1xuICAgIGNvbnNvbGUubG9nKCdjaGF0IHNvY2tldC5pbyBwb3J0JywgUE9SVCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZSA9IGVycm9yO1xuICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gIH1cbiAgc2VuZE5ld01lc3NhZ2UgPSBmdW5jdGlvbihtc2cpIHtcbiAgICB2YXIgb2JqZWN0X25hbWUsIHBhcnRpY2lwYW50cywgcmVjb3JkX2lkLCByb29tO1xuICAgIGlmIChtc2cucmVsYXRlZF90by5vICYmIG1zZy5yZWxhdGVkX3RvLmlkcy5sZW5ndGggPiAwKSB7XG4gICAgICBvYmplY3RfbmFtZSA9IG1zZy5yZWxhdGVkX3RvLm87XG4gICAgICByZWNvcmRfaWQgPSBtc2cucmVsYXRlZF90by5pZHNbMF07XG4gICAgICBkZWxldGUgbXNnLnJlbGF0ZWRfdG87XG4gICAgICBtc2cub3duZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJ1c2Vyc1wiKS5maW5kT25lKHtcbiAgICAgICAgX2lkOiBtc2cub3duZXJcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgX2lkOiAxLFxuICAgICAgICAgIG5hbWU6IDEsXG4gICAgICAgICAgYXZhdGFyVXJsOiAxXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgaWYgKG9iamVjdF9uYW1lID09PSAnY2hhdF9yb29tcycpIHtcbiAgICAgICAgcm9vbSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSkuZmluZE9uZSh7XG4gICAgICAgICAgX2lkOiByZWNvcmRfaWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgbWVtYmVyczogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChyb29tKSB7XG4gICAgICAgICAgcmV0dXJuIF8uZm9yRWFjaChyb29tICE9IG51bGwgPyByb29tLm1lbWJlcnMgOiB2b2lkIDAsIGZ1bmN0aW9uKG0pIHtcbiAgICAgICAgICAgIHZhciBrZXk7XG4gICAgICAgICAgICBrZXkgPSBnZXRSZWNlaXZlU29ja2V0S2V5KG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIG0pO1xuICAgICAgICAgICAgcmV0dXJuIHNvY2tldEVtaXQocmVjZWl2ZU1lc3NhZ2VTb2NrZXRzW2tleV0sIFNPQ0tFVEVWRU5UTkFNRVMuTkVXTUVTU0FHRSwgbXNnKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGFydGljaXBhbnRzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwiY2hhdF9zdWJzY3JpcHRpb25zXCIpLmZpbmQoe1xuICAgICAgICAgICdyZWxhdGVkX3RvLm8nOiBvYmplY3RfbmFtZSxcbiAgICAgICAgICAncmVsYXRlZF90by5pZHMnOiBbcmVjb3JkX2lkXVxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBvd25lcjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwYXJ0aWNpcGFudHMuZm9yRWFjaChmdW5jdGlvbihwKSB7XG4gICAgICAgICAgdmFyIGtleTtcbiAgICAgICAgICBrZXkgPSBnZXRSZWNlaXZlU29ja2V0S2V5KG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHAub3duZXIpO1xuICAgICAgICAgIHJldHVybiBzb2NrZXRFbWl0KHJlY2VpdmVNZXNzYWdlU29ja2V0c1trZXldLCBTT0NLRVRFVkVOVE5BTUVTLk5FV01FU1NBR0UsIG1zZyk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgY2hhdF9tZXNzYWdlc19pbml0ID0gZmFsc2U7XG4gIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcImNoYXRfbWVzc2FnZXNcIikuZmluZCh7XG4gICAgJ2NyZWF0ZWQnOiB7XG4gICAgICAkZ3RlOiBuZXcgRGF0ZSgpXG4gICAgfVxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICBtb2RpZmllZF9ieTogMFxuICAgIH1cbiAgfSkub2JzZXJ2ZSh7XG4gICAgYWRkZWQ6IGZ1bmN0aW9uKG5ld0RvY3VtZW50KSB7XG4gICAgICBpZiAoY2hhdF9tZXNzYWdlc19pbml0KSB7XG4gICAgICAgIHJldHVybiBzZW5kTmV3TWVzc2FnZShuZXdEb2N1bWVudCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBjaGFuZ2VkOiBmdW5jdGlvbihuZXdEb2N1bWVudCwgb2xkRG9jdW1lbnQpIHtcbiAgICAgIHJldHVybiBzZW5kTmV3TWVzc2FnZShuZXdEb2N1bWVudCk7XG4gICAgfSxcbiAgICByZW1vdmVkOiBmdW5jdGlvbihvbGREb2N1bWVudCkge1xuICAgICAgcmV0dXJuIHNlbmROZXdNZXNzYWdlKG9sZERvY3VtZW50KTtcbiAgICB9XG4gIH0pO1xuICBjaGF0X21lc3NhZ2VzX2luaXQgPSB0cnVlO1xuICBzZW5kU3Vic2NyaXB0aW9uID0gZnVuY3Rpb24oc3ViKSB7XG4gICAgdmFyIGtleSwgb2JqZWN0X25hbWUsIHJlY29yZF9pZCwgcm9vbTtcbiAgICBpZiAoc3ViLnJlbGF0ZWRfdG8ubyAmJiBzdWIucmVsYXRlZF90by5pZHMubGVuZ3RoID4gMCkge1xuICAgICAgb2JqZWN0X25hbWUgPSBzdWIucmVsYXRlZF90by5vO1xuICAgICAgcmVjb3JkX2lkID0gc3ViLnJlbGF0ZWRfdG8uaWRzWzBdO1xuICAgICAgc3ViLm1vZGlmaWVkX2J5ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwidXNlcnNcIikuZmluZE9uZSh7XG4gICAgICAgIF9pZDogc3ViLm1vZGlmaWVkX2J5XG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICBuYW1lOiAxLFxuICAgICAgICAgIGF2YXRhclVybDogMVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGtleSA9IGdldFJlY2VpdmVTb2NrZXRLZXkob2JqZWN0X25hbWUsICcnLCBzdWIub3duZXIpO1xuICAgICAgaWYgKHJlY2VpdmVTdWJzY3JpcHRpb25Tb2NrZXRzW2tleV0pIHtcbiAgICAgICAgaWYgKG9iamVjdF9uYW1lID09PSAnY2hhdF9yb29tcycpIHtcbiAgICAgICAgICByb29tID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lKS5maW5kT25lKHtcbiAgICAgICAgICAgIF9pZDogcmVjb3JkX2lkXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgIG1lbWJlcnM6IDFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAocm9vbSkge1xuICAgICAgICAgICAgc3ViLl9yb29tID0ge1xuICAgICAgICAgICAgICBfaWQ6IHJvb20uX2lkLFxuICAgICAgICAgICAgICBtZW1iZXJzOiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJ1c2Vyc1wiKS5maW5kKHtcbiAgICAgICAgICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAgICAgICAgICRpbjogcm9vbS5tZW1iZXJzIHx8IFtdXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgICAgICBfaWQ6IDEsXG4gICAgICAgICAgICAgICAgICBuYW1lOiAxLFxuICAgICAgICAgICAgICAgICAgYXZhdGFyVXJsOiAxXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KS5mZXRjaCgpXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzb2NrZXRFbWl0KHJlY2VpdmVTdWJzY3JpcHRpb25Tb2NrZXRzW2tleV0sIFNPQ0tFVEVWRU5UTkFNRVMuU1VCU0NSSVBUSU9OUywgc3ViKTtcbiAgICAgICAgcmV0dXJuIHNlbmRVbnJlYWRCYWRnZShyZWNlaXZlU3Vic2NyaXB0aW9uU29ja2V0c1trZXldLCAnJywgc3ViLm93bmVyKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIGNoYXRfc3Vic2NyaXB0aW9uc19pbml0ID0gZmFsc2U7XG4gIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcImNoYXRfc3Vic2NyaXB0aW9uc1wiKS5maW5kKHtcbiAgICAkb3I6IFtcbiAgICAgIHtcbiAgICAgICAgJ2NyZWF0ZWQnOiB7XG4gICAgICAgICAgJGd0ZTogbmV3IERhdGUoKVxuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgICdtb2RpZmllZCc6IHtcbiAgICAgICAgICAkZ3RlOiBuZXcgRGF0ZSgpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBdXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIGNyZWF0ZWRfYnk6IDBcbiAgICB9XG4gIH0pLm9ic2VydmUoe1xuICAgIGFkZGVkOiBmdW5jdGlvbihuZXdEb2N1bWVudCkge1xuICAgICAgaWYgKGNoYXRfc3Vic2NyaXB0aW9uc19pbml0KSB7XG4gICAgICAgIHJldHVybiBzZW5kU3Vic2NyaXB0aW9uKG5ld0RvY3VtZW50KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGNoYW5nZWQ6IGZ1bmN0aW9uKG5ld0RvY3VtZW50LCBvbGREb2N1bWVudCkge1xuICAgICAgcmV0dXJuIHNlbmRTdWJzY3JpcHRpb24obmV3RG9jdW1lbnQpO1xuICAgIH0sXG4gICAgcmVtb3ZlZDogZnVuY3Rpb24ob2xkRG9jdW1lbnQpIHtcbiAgICAgIHJldHVybiBzZW5kU3Vic2NyaXB0aW9uKG9sZERvY3VtZW50KTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gY2hhdF9zdWJzY3JpcHRpb25zX2luaXQgPSB0cnVlO1xufSk7XG4iXX0=
