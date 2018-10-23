Creator.baseObject =
	fields:
		owner:
			label:"所有者"
			type: "lookup"
			reference_to: "users"
			sortable: true
			index: true
			defaultValue: "{userId}"
			group:"记录"
		space:
			type: "lookup"
			label:"所属工作区"
			reference_to: "spaces"
			omit: true
			index: true
			hidden: true
		created:
			type: "datetime"
			label:"创建日期"
			readonly: true
			sortable: true
			omit: true
			group:"记录"
		created_by:
			label:"创建人"
			type: "lookup"
			readonly: true
			reference_to: "users"
			disabled: true
			index: true
			omit: true
			group:"记录"
		modified:
			label:"修改时间"
			type: "datetime"
			readonly: true
			sortable: true
			searchable: true
			index: true
			omit: true
			group:"记录"
		modified_by:
			label:"修改人"
			type: "lookup"
			readonly: true
			reference_to: "users"
			disabled: true
			omit: true
			group:"记录"
		is_deleted:
			type: "boolean"
			label:"已删除"
			omit: true
			index: true
			hidden: true
		instances:
			label:"申请单"
			type: "grid"
			omit: true
			hidden: true
		"instances.$._id":
			label:"申请单ID"
			type: "text"
			omit:true
			hidden: true
		"instances.$.state":
			label:"申请单状态"
			type: "text"
			omit:true
			hidden: true
		sharing:
			label: "记录级权限"
			type: "grid"
			omit: true
			hidden: true
			blackbox: true
		"sharing.$":
			label: "授权条件"
			blackbox: true
			omit: true
			hidden: true
		"sharing.$.u":
			label: "授权用户"
			type: "[text]"
			omit:true
			hidden: true
		"sharing.$.o":
			label: "授权组织"
			type: "[text]"
			omit:true
			hidden:true
		"sharing.$.r":
			label: "来自规则"
			type: "text"
			omit:true
			hidden: true
		# chat_messages的related_to表统一记录消息数量
		message_count:
			label:'评论数'
			type:'number'
			omit:true
	permission_set:
		none:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: false
			modifyAllRecords: false
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

	triggers:

		"before.insert.server.default":
			on: "server"
			when: "before.insert"
			todo: (userId, doc)->
				doc.created = new Date();
				doc.modified = new Date();
				if userId
					unless doc.owner
						doc.owner = userId
					if doc.owner == '{userId}'
						doc.owner = userId

					doc.created_by = userId;
					doc.modified_by = userId;

		"before.update.server.default":
			on: "server"
			when: "before.update"
			todo: (userId, doc, fieldNames, modifier, options)->
				modifier.$set = modifier.$set || {}
				modifier.$set.modified = new Date()
				if userId
					modifier.$set.modified_by = userId

		"before.insert.client.default":
			on: "client"
			when: "before.insert"
			todo: (userId, doc)->
				doc.space = Session.get("spaceId")

		"after.insert.server.sharing":
			on: "server"
			when: "after.insert"
			todo: (userId, doc, fieldNames, modifier, options)->
				object_name = this.object_name
				obj = Creator.getObject(object_name)
				if obj.enable_share
					collection = Creator.getCollection(object_name)
					psCollection = Creator.getCollection("permission_shares")
					selector = { space: doc.space, object_name: object_name }
					psRecords = psCollection.find(selector, fields: { _id:1, filters: 1, organizations: 1, users: 1 })
					psRecords.forEach (ps)->
						filters = Creator.formatFiltersToMongo(ps.filters, { extend: false })
						selector = { space: doc.space, _id: doc._id, $and: filters }
						count = collection.find(selector).count()
						if count
							# 如果当前新增的记录有满足条件的共享规则存在，则把共享规则配置保存起来
							push = { sharing: { "u": ps.users, "o": ps.organizations, "r": ps._id } }
							collection.direct.update({ _id: doc._id }, {$push: push})

		"after.update.server.sharing":
			on: "server"
			when: "after.update"
			todo: (userId, doc, fieldNames, modifier, options)->
				object_name = this.object_name
				obj = Creator.getObject(object_name)
				if obj.enable_share
					collection = Creator.getCollection(object_name)
					psCollection = Creator.getCollection("permission_shares")
					selector = { space: doc.space, object_name: object_name }
					psRecords = psCollection.find(selector, fields: { _id:1, filters: 1, organizations: 1, users: 1 })
					collection.direct.update({ _id: doc._id }, { $unset: { "sharing" : 1 } })
					psRecords.forEach (ps)->
						filters = Creator.formatFiltersToMongo(ps.filters, { extend: false })
						selector = { space: doc.space, _id: doc._id, $and: filters }
						count = collection.find(selector).count()
						if count
							# 如果当前修改的记录有满足条件的共享规则存在，则把共享规则配置保存起来
							push = { sharing: { "u": ps.users, "o": ps.organizations, "r": ps._id } }
							collection.direct.update({ _id: doc._id }, {$push: push})

	actions:

		standard_query:
			label: "查找"
			visible: true
			on: "list"
			todo: "standard_query"

		standard_new:
			label: "新建"
			visible: ()->
				permissions = Creator.getPermissions()
				if permissions
					return permissions["allowCreate"]
			on: "list"
			todo: "standard_new"

		standard_edit:
			label: "编辑"
			sort: 0
			visible: (object_name, record_id, record_permissions)->
				if record_permissions
					return record_permissions["allowEdit"]
				else
					record = Creator.Collections[object_name].findOne record_id
					record_permissions = Creator.getRecordPermissions object_name, record, Meteor.userId()
					if record_permissions
						return record_permissions["allowEdit"]
			on: "record"
			todo: "standard_edit"

		standard_delete:
			label: "删除"
			visible: (object_name, record_id, record_permissions)->
				if record_permissions
					return record_permissions["allowDelete"]
				else
					record = Creator.Collections[object_name].findOne record_id
					record_permissions = Creator.getRecordPermissions object_name, record, Meteor.userId()
					if record_permissions
						return record_permissions["allowDelete"]
			on: "record_more"
			todo: "standard_delete"

		standard_approve:
			label: "发起审批"
			visible: (object_name, record_id, record_permissions) ->
				#TODO 权限判断
				object_workflow = _.find Creator.object_workflows, (ow) ->
					return ow.object_name is object_name

				if not object_workflow
					return false

				r = Creator.getObjectRecord object_name, record_id
				if r and ( (r.instances and r.instances[0].state is 'completed') or (not r.instances) )
					return true

				return false
			on: "record"
			todo: ()->
				Modal.show('initiate_approval', { object_name: this.object_name, record_id: this.record_id })

		# "export":
		# 	label: "Export"
		# 	visible: false
		# 	on: "list"
		# 	todo: (object_name, record_id, fields)->
		# 		alert("please write code in baseObject to export data for " + this.object_name)



