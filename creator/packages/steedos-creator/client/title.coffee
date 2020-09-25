# 切换路由时，更改网页标题 #1290
# 对象列表页：全部合同 | 合同 | Steedos
# 对象详情页：河北港口集团开发合同 | 合同 | Steedos
# 其他 Steedos

if Meteor.isClient
	Meteor.startup ->
		Tracker.autorun (c)->
			if Session.get("steedos-locale") && Creator.bootstrapLoaded?.get()
				titleTags = []
				object = Creator.getObject()
				unless object
					return
				record = Creator.getObjectRecord()
				listView = Creator.getListView()
				record_name = Session.get('record_name')
				if record_name
					label = record_name
					titleTags.push label
				else if record
					if object.name == "cfs.files.filerecord"
						label = record?.original?.name
					else
						nameField = object.NAME_FIELD_KEY || "name"
						label = record[nameField]
					titleTags.push label
				else if listView
					titleTags.push listView.label
				if object
					titleTags.push object.label
				titleTags.push "Steedos"
				Steedos.setAppTitle(titleTags.join(" | "));
