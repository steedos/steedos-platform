Creator.Objects.vip_event =
	name: "vip_event"
	label: "活动"
	icon: "event"
	fields:
		name:
			label:'活动名称'
			type:'text'
			is_wide:true
		start:
			label:'时间'
			type:'datetime'
			defaultValue: ()->
				# 默认取值为下一个整点
				now = new Date()
				reValue = new Date(now.getTime() + 1 * 60 * 60 * 1000)
				reValue.setMinutes(0)
				reValue.setSeconds(0)
				return reValue
		# end:
		# 	label:'结束时间'
		# 	type:'datetime'
		# allDay:
		# 	label:"全天活动"
		# 	type:'boolean'
		# 	defaultValue:false
		location:
			label:'地点'
			type:'location'
			required:true
		alarms:
			label:'提醒时间'
			type:'select'
			defaultValue: '-PT1H'
			options:[
				{label:'不提醒',value:'null'},
				{label:'活动开始时',value:'Now'},
				{label:'5分钟前',value:'-PT5M'},
				{label:'10分钟前',value:'-PT10M'},
				{label:'15分钟前',value:'-PT15M'},
				{label:'30分钟前',value:'-PT30M'},
				{label:'1小时前',value:'-PT1H'},
				{label:'2小时前',value:'-PT2H'},
				{label:'1天前',value:'-P1D'},
				{label:'2天前',value:'-P2D'}
			]
			group:'-'
		description:
			label:'备注'
			type:'textarea'
			is_wide:true
		accepted_count:
			label:"报名人数"
			type:'number'
			omit:true
		pending_count:
			label:'观望人数'
			type:'number'
			omit:true
		rejected_count:
			label:'拒绝人数'
			type:'number'
			omit:true
		featured:
			label:'发布到首页'
			type:'boolean'
			group:'-'
		cover:
			label:'封面照片'
			type:'image'
		related_to:
			label: "相关项"
			type: "lookup"
			reference_to: ()->
				o = []
				_.each Creator.Objects, (object, object_name)->
					if object.enable_tasks
						o.push object_name
				return o
			omit:'true'
	list_views:
		all:
			label: "所有"
			columns: ["name", "start", "end","location","accepted_count","pending_count"]
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
			modifyAllRecords: false
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
				console.log("before.insert.server.event=======doc=====", doc);
				fields = Creator.getObject("vip_event")?.fields
				unless fields
					return
				if !doc.start
					console.log("before.insert.server.event=======start===isEmpty==", doc.start);
					doc.start = fields.start?.defaultValue()
				if !doc.alarms
					console.log("before.insert.server.event=======alarms===isEmpty==", doc.alarms);
					doc.alarms = fields.alarms?.defaultValue