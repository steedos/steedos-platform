#TODO object的name不能重复，需要考虑到系统表
isRepeatedName = (doc)->
	other = Creator.getCollection("objects").find({_id: {$ne: doc._id}, name: doc.name}, {fields:{_id: 1}})
	if other.count() > 0
		return true
	return false

Creator.Objects.objects =
	name: "objects"
	icon: "orders"
	label: "对象"
	fields:
		name:
			type: "text"
			searchable:true
			index:true
			required: true
			regEx: SimpleSchema.RegEx.code
		label:
			type: "text"
		icon:
			type: "lookup"
			optionsFunction: ()->
				options = []
				_.forEach Creator.resources.sldsIcons.standard, (svg)->
					options.push {value: svg, label: svg, icon: svg}
				return options
		is_enable:
			type: "boolean"
			defaultValue: true
		enable_search:
			type: "boolean"
		enable_files:
			type: "boolean"
		enable_tasks:
			type: "boolean"
		enable_notes:
			type: "boolean"
		enable_api:
			type: "boolean"
			defaultValue: true
			hidden: true
		enable_share:
			type: "boolean"
			defaultValue: false
		enable_instances:
			type: "boolean"
		is_view:
			type: 'boolean'
			defaultValue: false
			omit: true
		hidden:
			label: "隐藏"
			type: "boolean"
			omit: true
		description:
			label: "Description"
			type: "textarea"
			is_wide: true
		fields:
			type: "object"
			label: "字段"
			blackbox: true
			omit: true
			hidden: true
		list_views:
			type: "object"
			label: "列表视图"
			blackbox: true
			omit: true
			hidden: true
		actions:
			type: "object"
			label: "操作"
			blackbox: true
			omit: true
			hidden: true
		permission_set:
			type: "object"
			label: "权限设置"
			blackbox: true
			omit: true
			hidden: true
		triggers:
			type: "object"
			label: "触发器"
			blackbox: true
			omit: true
			hidden: true
		custom:
			label: "规则"
			type: "boolean"
			omit: true
		owner:
			type: "lookup"
			hidden: true

	list_views:
		all:
			columns: ["name", "label", "is_enable", "modified"]
			label:"所有对象"
			filter_scope: "space"

	permission_set:
		user:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: false
			modifyAllRecords: false
			viewAllRecords: false
		admin:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: true
			viewAllRecords: true

	actions:
		copy_odata:
			label: "复制OData网址"
			visible: true
			on: "record"
			todo: (object_name, record_id, item_element)->
				record = Creator.getObjectById(record_id)
				#enable_api 属性未开放
				if record?.enable_api || true
					o_name = record?.name
					path = SteedosOData.getODataPath(Session.get("spaceId"), o_name)
					item_element.attr('data-clipboard-text', path);
					if !item_element.attr('data-clipboard-new')
						clipboard = new Clipboard(item_element[0]);
						item_element.attr('data-clipboard-new', true)

						clipboard.on('success',  (e) ->
							toastr.success('复制成功');
						)
						clipboard.on('error',  (e) ->
							toastr.error('复制失败');
							console.error "e"
						);
						#fix 详细页面(网页LI 手机版view-action)第一次点击复制不执行
						if item_element[0].tagName == 'LI' || item_element.hasClass('view-action')
							item_element.trigger("click");
				else
					toastr.error('复制失败: 未启用API');


	triggers:
		"before.insert.server.objects":
			on: "server"
			when: "before.insert"
			todo: (userId, doc)->
				if isRepeatedName(doc)
					throw new Meteor.Error 500, "对象名称不能重复"
				doc.custom = true

		"before.update.server.objects":
			on: "server"
			when: "before.update"
			todo: (userId, doc, fieldNames, modifier, options)->
				if modifier?.$set?.name && doc.name != modifier.$set.name
					console.log "不能修改name"
					throw new Meteor.Error 500, "不能修改对象名"
				if modifier.$set
					modifier.$set.custom = true

				if modifier.$unset && modifier.$unset.custom
					delete modifier.$unset.custom


		"after.insert.server.objects":
			on: "server"
			when: "after.insert"
			todo: (userId, doc)->
				#新增object时，默认新建一个name字段
				Creator.getCollection("object_fields").insert({object: doc.name, owner: userId, name: "name", space: doc.space, type: "text", required: true, index: true, searchable: true})
				Creator.getCollection("object_listviews").insert({name: "all", space: doc.space, owner: userId, object_name: doc.name, shared: true, filter_scope: "space", columns: ["name"]})
				Creator.getCollection("object_listviews").insert({name: "recent", space: doc.space, owner: userId, object_name: doc.name, shared: true, filter_scope: "space", columns: ["name"]})

		"before.remove.server.objects":
			on: "server"
			when: "before.remove"
			todo: (userId, doc)->
				object_collections = Creator.getCollection(doc.name)

				documents = object_collections.find({},{fields: {_id: 1}})

				if documents.count() > 0
					throw new Meteor.Error 500, "对象(#{doc.name})中已经有记录，请先删除记录后， 再删除此对象"

		"after.remove.server.objects":
			on: "server"
			when: "after.remove"
			todo: (userId, doc)->
				#删除object 后，自动删除fields、actions、triggers、permission_objects
				Creator.getCollection("object_fields").direct.remove({object: doc.name})

				Creator.getCollection("object_actions").direct.remove({object: doc.name})

				Creator.getCollection("object_triggers").direct.remove({object: doc.name})

				Creator.getCollection("permission_objects").direct.remove({object_name: doc.name})

				Creator.getCollection("object_listviews").direct.remove({object_name: doc.name})

				#drop collection
				console.log "drop collection", doc.name
				try
					Creator.getCollection(doc.name)._collection.dropCollection()
				catch e
					console.error("#{e.stack}")
					throw new Meteor.Error 500, "对象(#{doc.name})不存在或已被删除"