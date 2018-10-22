Creator.Objects.chat_messages = 
	name: 'chat_messages'
	label: '消息'
	fields:
		related_to: #相关记录，聊天模式指向rooms，否则指向对应的记录
			label: '相关'
			type: 'lookup'
			reference_to: ()->
				return _.keys(Creator.Objects)
		name:
			is_name: true
			label: '内容'
			type: 'text'
		type:
			label: '消息类型'
			type: 'select'
			options: 'text,image,video,href,system'

	list_views:
		all:
			label: "所有"
			columns: ["related_to", "name", "type"]
			filter_scope: "space"

	triggers:
		"after.insert.server.chatMessages":
			on: "server"
			when: "after.insert"
			todo: (userId, doc)->

				Creator.getCollection("chat_subscriptions").upsert({space: doc.space, owner: doc.owner, 'related_to.o': doc.related_to.o, 'related_to.ids': doc.related_to.ids}, {$set: {unread: 0, last_message_text: doc.name, last_message_date: new Date(), modified: new Date(), modified_by: userId}}, {multi: true})

				Creator.getCollection("chat_subscriptions").update({space: doc.space, owner: {$ne: doc.owner}, 'related_to.o': doc.related_to.o, 'related_to.ids': doc.related_to.ids}, {$inc: {unread: 1}, $set: {last_message_text: doc.name, last_message_date: new Date(), modified: new Date(), modified_by: userId}}, {multi: true})
				# 更新chat_messages的related_to表，统一记录消息数量
				object_name = doc.related_to?.o
				_id = doc.related_to?.ids[0]
				if object_name and _id
					Creator.getCollection(object_name, doc.space).direct.update({_id: _id}, {$inc: {message_count: 1}})

	permission_set:
		user:
			allowCreate: true
			allowDelete: false
			allowEdit: false
			allowRead: true
			modifyAllRecords: true
			viewAllRecords: true
		admin:
			allowCreate: true
			allowDelete: false
			allowEdit: false
			allowRead: true
			modifyAllRecords: true
			viewAllRecords: false
		guest:
			allowCreate: true
			allowDelete: false
			allowEdit: false
			allowRead: true
			modifyAllRecords: true
			viewAllRecords: true
