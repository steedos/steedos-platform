# Creator.Objects.chat_subscriptions = {
# 	name: 'chat_subscriptions'
# 	label: '订阅'
# 	fields:
# 		name: #房间名称，注意私信时房间名称应该显示对方的姓名
# 			label: '名称'
# 			type: 'text'
# 		related_to: #相关记录，聊天模式指向rooms，否则指向对应的记录
# 			label: '相关'
# 			type: 'lookup'
# 			reference_to: ()->
# 				return _.keys(Creator.Objects)

# 		last_message_text:
# 			label: '最新消息预览(文本)'
# 			type: 'text'

# 		last_message_date:
# 			label: '最新消息发送时间'
# 			type: 'datetime'

# 		unread:
# 			label: '未读数'
# 			type: 'number'

# 	list_views:
# 		all:
# 			label: "所有"
# 			columns: ["name", "related_to", "last_message_text", "unread"]
# 			filter_scope: "space"

# 	permission_set:
# 		user:
# 			allowCreate: true
# 			allowDelete: false
# 			allowEdit: true
# 			allowRead: true
# 			modifyAllRecords: false
# 			viewAllRecords: false
# 		admin:
# 			allowCreate: true
# 			allowDelete: false
# 			allowEdit: true
# 			allowRead: true
# 			modifyAllRecords: true
# 			viewAllRecords: false
# 		guest:
# 			allowCreate: true
# 			allowDelete: false
# 			allowEdit: true
# 			allowRead: true
# 			modifyAllRecords: false
# 			viewAllRecords: false
# }