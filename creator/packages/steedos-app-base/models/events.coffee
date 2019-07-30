Creator.Objects.events = 
	name: "events"
	label: "事件"
	icon: "event"
	fields:
		name: 
			label: "主题"
			type: "text"
			required: true
			is_wide: true
			searchable:true
			index:true
	
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
			sortable:true
			
		end:
			label:'结束时间'
			type:'datetime'
			required:true
			defaultValue: ()->
				# 默认取值为下一个整点
				now = new Date()
				reValue = new Date(now.getTime() + 2 * 60 * 60 * 1000)
				reValue.setMinutes(0)
				reValue.setSeconds(0)
				return reValue

		assignees:
			label: "分派给"
			type: "lookup"
			reference_to: "users"
			multiple: true

		related_to:
			label: "相关项"
			type: "lookup"
			index: true
			reference_to: ()->
				o = []
				_.each Creator.Objects, (object, object_name)->
					if object.enable_events
						o.push object.name
				return o 

		is_all_day:
			label: "全天事件"
			type: "boolean"
			
		location:
			label: "地址"
			type: "text"

		description: 
			label: "描述"
			type: "textarea"
			is_wide: true

	list_views:
		calendar_view:
			type: 'calendar',
			label: '日历视图',
			filter_scope: "space",
			options:
				startDateExpr: 'start',
				endDateExpr: 'end',
				textExpr: 'name',
				title: ['name', "start", "end", 'assignees', 'related_to'],
				currentView: 'month'
				startDayHour: 8
				endDayHour: 18
#				groups: ['state']
#				resources: [{
#					fieldExpr: "state"
#					dataSource: [{
#						text : "未开始",
#						id: 'not_started',
#						color: "rgb(118, 118, 118)"
#					},{
#						text : "进行中",
#						id: 'in_progress',
#						color: "rgb(29, 186, 174)"
#					},{
#						text : "已完成",
#						id: 'completed',
#						color: "rgb(32, 194, 46)"
#					},{
#						text : "暂停",
#						id: 'paused',
#						color: "rgb(118, 118, 118)"
#					}]
#				}]


		all:
			label: "全部"
			filter_scope: "space"
			columns: ["name", "start", "end", "assignees", "related_to"]


	permission_set:
		user:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: false 
		admin:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: true
			viewAllRecords: true 