Creator.Objects.qhd_informations = 
	name: "qhd_informations"
	icon: "contact"
	label: "信息上报"
	enable_search: true
	fields:
		title: 
			type: "text"
			label:"文件标题"
			defaultValue: ""
			is_wide:true
			is_name:true
			required: true
			searchable:true
			index:true
		company:
			type: "text",
			label:"报送公司"
			required: true
			is_wide:true
			searchable:true
			index:true
			defaultValue:()->
				collection = Creator.Collections["space_users"]
				company = collection.findOne({user:Meteor.userId(),space:Session.get("spaceId")},{fields:{company:1}}).company
				return company
		content:
			type:"textarea",
			rows: 8
			label:"内容"
			searchable:true
			required: true
			is_wide:true
		score:
			type:"number"
			label:"分数"
			omit:true
		score_point:
			type:"checkbox"
			label:"得分点",
			multiple:true
			is_wide:true
			options: [
				{label: "上级采用", value: "上级采用"},
				{label: "领导批示", value: "领导批示"},
				{label: "正常使用", value: "正常使用"},
				{label: "月度好信息", value: "月度好信息"},
				{label:"专报信息",value:"专报信息"}
			]

		# isuse:
		# 	type:"boolean"
		# 	label:"是否采用"
		# 	defaultValue:"否"
	list_views:
		all:
			label: "所有上报信息"
			columns: ["title", "content", "company","score_point","created"]
			filter_scope: "space"
		recent:
			label: "最近查看"
			filter_scope: "space"
		mine:
			label: "我的上报信息"
			filter_scope: "mine"
		company:
			label:"本公司上报信息"
			filter_scope: "space"
			filters: [["company", "=", "{user.company}"]]
	permission_set:
		user:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: false
			modifyAllRecords: false
			viewAllRecords: false
			# editable_fields:["title","company","content"]
			# list_views:["mine","company"] 
			# readable_fields:["title","company","content",
			# 	'owner',
			# 	'created',
			# 	'created_by',
			# 	'modified',
			# 	'modified_by',
			# 	'space',
			# 	'is_deleted' ]
		admin:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: false
			modifyAllRecords: false
			viewAllRecords: false
			# list_views:["mine","company"] 
	triggers:
		"before.insert.server.calculateScore": 
			on: "server"
			when: "before.insert"
			todo: (userId, doc)->
				doc.score = 0
				if doc.score_point
					doc.score_point.forEach (point)->
						if point == "上级采用"
							doc.score = doc.score + 10
						else if point == '领导批示'
							doc.score = doc.score + 10
						else if point== '正常使用'
							doc.score = doc.score + 5
						else if point == '月度好信息'
							doc.score = doc.score + 5
						else if point == '专报信息'
							doc.score = doc.score + 10
				#Creator.baseObject.triggers['before.insert.server.default'].todo(userId,doc)			
					
		"after.update.server.calculateScore": 
			on: "server"
			when: "after.update"
			todo: (userId, doc)->
				score = 0
				if doc.score_point
					doc.score_point.forEach (point)->
						if point == "上级采用"
							score = score + 10
						else if point == '领导批示'
							score = score + 10
						else if point== '正常使用'
							score = score + 5
						else if point == '月度好信息'
							score = score + 5
						else if point == '专报信息'
							score = score + 10
				Creator.Collections['qhd_informations'].direct.update({_id:doc._id},{$set:{score:score}})
