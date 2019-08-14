# Creator.Objects.chat_rooms = {
# 	name: 'chat_rooms'
# 	label: '房间'
# 	fields:
# 		name:
# 			is_name: true
# 			label: '内容'
# 			type: 'text'
# 		members: #包含房主，第一个就是房主
# 			label: "成员"
# 			type: "lookup"
# 			reference_to: 'users'
# 			multiple: true
# 		owner:
# 			label: '房主'

# 		type:
# 			label: "类型"
# 			type: 'select'
# 			options: 'private, protected, public'

# 	list_views:
# 		all:
# 			label: "所有"
# 			columns: ["name", "owner"]
# 			filter_scope: "space"

# 	permission_set:
# 		user:
# 			allowCreate: true
# 			allowDelete: false
# 			allowEdit: false
# 			allowRead: true
# 			modifyAllRecords: true
# 			viewAllRecords: true
# 		admin:
# 			allowCreate: true
# 			allowDelete: false
# 			allowEdit: false
# 			allowRead: true
# 			modifyAllRecords: true
# 			viewAllRecords: false
# 		guest:
# 			allowCreate: true
# 			allowDelete: false
# 			allowEdit: false
# 			allowRead: true
# 			modifyAllRecords: true
# 			viewAllRecords: true
# 	triggers:
# 		"after.insert.server.rooms":
# 			on: "server"
# 			when: "after.insert"
# 			todo: (userId, doc)->
# 				_.forEach doc.members, (m)->
# 					Creator.getCollection("chat_subscriptions").insert({related_to: {o: 'chat_rooms', ids: [doc._id]}, name: '', last_message_text: '', unread: 0, owner: m, space: doc.space})
# }