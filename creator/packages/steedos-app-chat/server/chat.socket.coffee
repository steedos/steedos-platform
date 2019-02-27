http = require 'http';
socket_io = require 'socket.io';
Fiber = require('fibers');

if !process.env.SOCKET_IO_PORT
	return;

PORT = process.env.SOCKET_IO_PORT || 8080;

SOCKETS = {}

#接收消息的socket集合,key的格式为: {object_name}_{record_id}_{userId}, 值为socket 对象, 目前不支持一个用户多个socket接入
receiveMessageSockets = {

}

receiveSubscriptionSockets = {

}

SOCKETEVENTNAMES = {
	NEWMESSAGE: 'new message',
	STOPNEWMESSAGE: 'stop message',
	RECEIVEMESSAGE: 'receive message',
	SUBSCRIPTIONS: 'subscriptions',
	STOPNEWSUBSCRIPTIONS: 'stop subscriptions',
	RECEIVESUBSCRIPTIONS: 'receive subscriptions',
	COUNTUNREAD: 'count unread'
};

checkAuthToken = (userId, authToken) ->
	if userId and authToken
		hashedToken = Accounts._hashLoginToken(authToken)
		user = wrapAsyncFindOne(db.users, {
				_id: userId,
				"services.resume.loginTokens.hashedToken": hashedToken
			}
		)
		if user
			return true
		else
			return false
	return false


getReceiveSocketKey = (object_name, record_id, userId)->
	return "#{object_name}_#{record_id}_#{userId}"

sendUnreadBadge = (socket, space_id, owner)->
	countUnread = 0
	Creator.getCollection("chat_subscriptions").find({
		owner: owner,
		unread: {$gt: 0}
	}, {fields: {unread: 1}}).forEach (_r)->
		countUnread += _r.unread
	socketEmit(socket, SOCKETEVENTNAMES.COUNTUNREAD, countUnread);

#使用Fiber用于处理错误:'Meteor code must always run within a Fiber' . 尝试了Meteor 提供的Meteor.bindEnvironment\Meteor.wrapAsync都不能处理此错误.
sendUnreadBadgeFiber = (socket, space_id, owner)->
	Fiber(()->
		sendUnreadBadge(socket, space_id, owner);
	).run();

#TODO: Fiber返回值问题处理
checkAuthTokenFiber = (socket, userId, authToken)->
	Fiber(()->
		check = Steedos.checkAuthToken(userId, authToken);
		if(!check)
			SOCKETS[socket.id] = null;
			socket.disconnect();
	).run();

socketEmit = (socket, eventname, data) ->
	if socket && SOCKETS[socket.id]
		socket.emit(eventname, data)

Meteor.startup ()->
	server = http.createServer();

	io = socket_io(server);

	counter = 0;

	io.on('connection', (socket)->
		query = socket.request._query;
		userId = query["X-User-Id"]
		authToken = query["X-Auth-Token"]

		if !userId || !authToken
			socket.disconnect();
			return;

		checkAuthTokenFiber(socket, userId, authToken)

		SOCKETS[socket.id] = socket;

		#销毁socket
		socket.on 'disconnect', ()->
			query = socket.request._query;
			userId = query["X-User-Id"]
			SOCKETS[socket.id] = null;

		#停止接收消息
		socket.on SOCKETEVENTNAMES.STOPNEWMESSAGE, (res)->
			key = getReceiveSocketKey(res.object_name, res.record_id, socket.request._query["X-User-Id"])
			receiveMessageSockets[key] = null;

		#开始接收消息
		socket.on SOCKETEVENTNAMES.RECEIVEMESSAGE, (res)->
			key = getReceiveSocketKey(res.object_name, res.record_id, socket.request._query["X-User-Id"])
			receiveMessageSockets[key] = socket;


		#停止接收消息
		socket.on SOCKETEVENTNAMES.STOPNEWSUBSCRIPTIONS, (res)->
			key = getReceiveSocketKey(res.object_name, '', socket.request._query["X-User-Id"])
			receiveSubscriptionSockets[key] = null;

		#开始接收消息
		socket.on SOCKETEVENTNAMES.RECEIVESUBSCRIPTIONS, (res)->
			key = getReceiveSocketKey(res.object_name, '', socket.request._query["X-User-Id"])
			receiveSubscriptionSockets[key] = socket;
			sendUnreadBadgeFiber(socket, '', socket.request._query["X-User-Id"]);
	)

	try
		server.listen(PORT);
		console.log('chat socket.io port', PORT);
	catch e
		console.error(e)

	#发送消息
	sendNewMessage = (msg) ->
		if msg.related_to.o && msg.related_to.ids.length > 0
			object_name = msg.related_to.o;
			record_id = msg.related_to.ids[0];
			delete msg.related_to
			msg.owner = Creator.getCollection("users").findOne({_id: msg.owner}, {
				fields: {
					_id: 1,
					name: 1,
					avatarUrl: 1
				}
			})
			if object_name == 'chat_rooms'
				room = Creator.getCollection(object_name).findOne({_id: record_id}, {fields: {members: 1}})
				if room
					_.forEach room?.members, (m)->
						key = getReceiveSocketKey(object_name, record_id, m)
						socketEmit(receiveMessageSockets[key], SOCKETEVENTNAMES.NEWMESSAGE, msg)
			else
				participants = Creator.getCollection("chat_subscriptions").find({'related_to.o': object_name, 'related_to.ids': [record_id]}, {fields: {owner: 1}})
				participants.forEach (p)->
					key = getReceiveSocketKey(object_name, record_id, p.owner)
					socketEmit(receiveMessageSockets[key], SOCKETEVENTNAMES.NEWMESSAGE, msg)


	#订阅chat_messages
	chat_messages_init = false
	Creator.getCollection("chat_messages").find({'created': {$gte: new Date()}}, {
		fields: {
			created_by: 0,
			modified: 0,
			modified_by: 0
		}
	}).observe {
		added: (newDocument)->
			if chat_messages_init
				sendNewMessage newDocument
		changed: (newDocument, oldDocument)->
			sendNewMessage newDocument
		removed: (oldDocument)->
			sendNewMessage oldDocument
	}
	chat_messages_init = true


	sendSubscription = (sub)->
		if sub.related_to.o && sub.related_to.ids.length > 0
			object_name = sub.related_to.o;
			record_id = sub.related_to.ids[0];
			sub.modified_by = Creator.getCollection("users").findOne({_id: sub.modified_by}, {
				fields: {
					_id: 1,
					name: 1,
					avatarUrl: 1
				}
			})
			key = getReceiveSocketKey(object_name, '', sub.owner)
			if receiveSubscriptionSockets[key]
				if object_name == 'chat_rooms'
					room = Creator.getCollection(object_name).findOne({_id: record_id}, {fields: {members: 1}})
					if room
						sub._room = {
							_id: room._id,
							members: Creator.getCollection("users").find({_id: {$in: room.members || []}}, {
								fields: {
									_id: 1,
									name: 1,
									avatarUrl: 1
								}
							}).fetch()
						}
				socketEmit(receiveSubscriptionSockets[key], SOCKETEVENTNAMES.SUBSCRIPTIONS, sub)
				sendUnreadBadge(receiveSubscriptionSockets[key], '', sub.owner);

	#订阅chat_subscriptions
	chat_subscriptions_init = false
	Creator.getCollection("chat_subscriptions").find({
		$or: [{'created': {$gte: new Date()}}, 'modified': {$gte: new Date()}]
	}, {
		fields: {
			created_by: 0
		}
	}).observe {
		added: (newDocument)->
			if chat_subscriptions_init
				sendSubscription newDocument
		changed: (newDocument, oldDocument)->
			sendSubscription newDocument
		removed: (oldDocument)->
			sendSubscription oldDocument
	}
	chat_subscriptions_init = true