# 切换路由时，更改网页标题 #1290
# 对象列表页：全部合同 | 合同 | Steedos
# 对象详情页：河北港口集团开发合同 | 合同 | Steedos
# 其他 Steedos
Meteor.startup ->
	Tracker.autorun (c)->
		debugger;
		titleTags = []
		object = Creator.getObject()
		record = Creator.getObjectRecord()
		listView = Creator.getListView()
		if record
			titleTags.push record.name
		else if listView
			titleTags.push listView.label
		if object
			titleTags.push object.label
		titleTags.push "Steedos"
		Steedos.setAppTitle(titleTags.join(" | "));
