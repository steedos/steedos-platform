
clashRemind = (_id,room,start,end)->
	console.log("start====end===",start,end)
	meetings = Creator.getCollection("meeting").find({_id:{ $ne:_id},room:room,$or: [{start:{$lte:start},end:{$gt:start}},{start:{$lt:end},end:{$gte:end}},{start:{$gte:start},end:{$lte:end}}]}).fetch()
	#console.log "meetings=================",meetings
	return meetings?.length

Creator.Objects.meeting =
	name: "meeting"
	label: "会议"
	icon: "contract"
	fields:
		room:
			label:'会议室'
			type:'lookup'
			reference_to:'meetingroom'
			is_wide:true
			required:true
			reference_sort:{name:1}
			reference_limit: 20
		start:
			label:'开始时间'
			type:'datetime'
			required:true
			defaultValue: ()->
				# 默认取值为下一个整点
				now = new Date()
				reValue = new Date(now.getTime() + 1 * 60 * 60 * 1000)
				reValue.setMinutes(0)
				reValue.setSeconds(0)
				return reValue
		end:
			label:'结束时间'
			type:'datetime'
			required:true
			defaultValue: ()->
				# 默认取值为下一个整点
				now = new Date()
				reValue = new Date(now.getTime() + 1 * 60 * 60 * 1000)
				reValue.setMinutes(0)
				reValue.setSeconds(0)
				return reValue
		name:
			label:'会议标题'
			type:'text'
			is_wide:true
			required:true
		# number:
		#     label:'编号'
		# 	type:'text'
		unit:
			label:'参会单位'
			type:'text'
			defaultValue:()->
				collection = Creator.Collections["organizations"]
				organziation = collection.findOne({users:Meteor.userId(),space:Session.get("spaceId")},{fields:{name:1}}).name
				return organziation
			required:true
		count:
			label:'参会人数'
			type:'number'
		
		# alarms:
		# 	label:'提醒时间'
		# 	type:'select'
		# 	defaultValue: '-PT1H'
		# 	options:[
		# 		{label:'不提醒',value:'null'},
		# 		{label:'活动开始时',value:'Now'},
		# 		{label:'5分钟前',value:'-PT5M'},
		# 		{label:'10分钟前',value:'-PT10M'},
		# 		{label:'15分钟前',value:'-PT15M'},
		# 		{label:'30分钟前',value:'-PT30M'},
		# 		{label:'1小时前',value:'-PT1H'},
		# 		{label:'2小时前',value:'-PT2H'},
		# 		{label:'1天前',value:'-P1D'},
		# 		{label:'2天前',value:'-P2D'}
		# 	]
		# 	group:'-'
		phone:
			label:'联系方式'
			type:'text'
			defaultValue:()->
				collection = Creator.Collections["space_users"]
				mobile = collection.findOne({user:Meteor.userId(),space:Session.get("spaceId")},{fields:{mobile:1}}).mobile
				return mobile
		features:
			label:'用品需求'
			type:'select'
			options:[
				{label:'上网',value:'surfing'},
				{label:'投影',value:'projection'},
				{label:'视频',value:'vedio'},
				{label:'会标',value:'monogram'}
				]
			multiple:true
		description:
			label:'备注'
			type:'textarea'
			is_wide:true

		# other_features:
		# 	label:'其他功能'
		# 	type:'text'
		# 	multiple:true
		owner:
			hidden:true
	calendar:
		textExpr:'name'
		startDateExpr:'start'
		endDateExpr:'end'
		groups:['room']
	list_views:
		all:
			label: "列表"
			columns: ["name", "start", "unit", "room","count","owner" ,"phone", "features"]
			filter_scope: "space"
		calendar:
			label: "日历"
			columns: ["name", "start","end"]
			filter_scope: "space"
		
	permission_set:
		user:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true
		admin:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: true
			viewAllRecords: true
		member:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true
		guest:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true

	triggers:
		"before.insert.server.event":
			on: "server"
			when: "before.insert"
			todo: (userId, doc)->
				if doc.end < doc.start
					throw new Meteor.Error 500, "开始时间不能大于结束时间"
				clashs = clashRemind(doc._id,doc.room,doc.start,doc.end)
				if clashs
					throw new Meteor.Error 500, "该时间段的此会议室已被占用"
		"before.update.server.event":
			on: "server"
			when: "before.update"
			todo: (userId, doc, fieldNames, modifier, options)->
				if modifier?.$set?.start || modifier?.$set?.end
					start = modifier?.$set?.start
					end = modifier?.$set?.end
				if !modifier?.$set?.start
					start = doc.start
				if !modifier?.$set?.end
					end = doc.end
				#console.log("start,,end======",start,end)
				if end < start
					throw new Meteor.Error 500, "开始时间不能大于结束时间"	
				if modifier?.$set?.room
					room = modifier?.$set?.room
				else
					room  = doc.room
			#	console.log("room===========",room)
				clashs = clashRemind(doc._id,room,start,end)
				if clashs
					throw new Meteor.Error 500, "该时间段的此会议室已被占用"