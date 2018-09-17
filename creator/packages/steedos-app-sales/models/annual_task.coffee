Creator._TEMPLATE.Objects.annualTask = {
	name: "annualTask"
	label: "年总任务"
	icon: "annualTask"
	enable_files: true
	enable_api: true
	icon: 'channel_programs'
	fields:
		name:
			label: "年度"
			type: "text"
			required: true

		annualAmount:
			label: "金额"
			type: "currency"
			required: true

		addF2:
			label: '添加第2个字段'
			type: 'text'

	list_views:
		all:
			filter_scope: "space"
			columns: ["name", "annualAmount"]
		v2:
			lable: '第一个视图'
			filter_scope: "space"
			columns: ["name", "annualAmount"]

	triggers:
		"before.insert.server.annualTask":
			on: "server"
			when: "before.insert"
			todo: (userId, doc)->
				console.log('insert annualTask.....');
#
#		"before.update.server.annualTask":
#			on: "server"
#			when: "before.update"
#			todo: (userId, doc)->
#				console.log('update annualTask.....');

	actions:
		export:
			label: "导出"
			on: "record"
			visible: true
			todo: ()->
				console.log('export....')
#		print:
#			label: "打印"
#			on: "record"
#			visible: true
#			only_detail: true
#			todo: ()->
#				console.log("you clicked on print button")
}