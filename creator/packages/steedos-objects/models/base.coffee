Creator.baseObject =
	fields:
		owner:
			label:"所有者"
			type: "lookup"
			reference_to: "users"
			sortable: true
			index: true
			defaultValue: "{userId}"
			omit: true
			hidden: true
		space:
			type: "text"
			label:"所属工作区"
			reference_to: "spaces"
#			omit: true
			index: true
			hidden: true
			defaultValue: "{spaceId}"
#			defaultValue: ()->
#				if Meteor.isClient
#					return Session.get("spaceId")
		created:
			type: "datetime"
			label:"创建时间"
			readonly: true
			sortable: true
			omit: true
		created_by:
			label:"创建人"
			type: "lookup"
			readonly: true
			reference_to: "users"
			disabled: true
			index: true
			omit: true
		modified:
			label:"修改时间"
			type: "datetime"
			readonly: true
			sortable: true
			index: true
			omit: true
		modified_by:
			label:"修改人"
			type: "lookup"
			readonly: true
			reference_to: "users"
			disabled: true
			omit: true
		is_deleted:
			type: "boolean"
			label:"已删除"
			omit: true
			index: true
			hidden: true
		deleted:
			label:"删除时间"
			type: "datetime"
			readonly: true
			sortable: true
			index: true
			omit: true
			hidden: true
		deleted_by:
			label:"删除人"
			type: "lookup"
			readonly: true
			reference_to: "users"
			disabled: true
			omit: true
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
			hidden: true
		locked:
			label:'已锁定'
			type:'boolean'
			omit:true
			hidden: true

		# 新增基本字段，类似子管理员作分级权限
		company_id:
			label: "所属单位"
			type: "lookup"
			reference_to: "organizations"
			sortable: true
			index: true
			is_company_only: true
			defaultValue: ()->
				if Meteor.isClient
					return Session.get("user_company_id")
			omit: true
			hidden: true

		# 值范围为 draft, pending, completed, approved, rejected, terminated
		instance_state:
			label:'审批状态'
			type:'select'
			options: [
				{label:"草稿", value:"draft"},
				{label:"进行中", value:"pending"},
				{label: "已完成", value:"completed"}
				{label:"已核准", value:"approved"},
				{label:"已驳回", value:"rejected"},
				{label:"已取消", value:"terminated"}
			]
			omit: true
			hidden: true

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
		"after.update.server.audit":
			"on": "server"
			when: "after.update"
			todo: (userId, doc, fieldNames, modifier, options)->
				object_name = this.object_name
				obj = Creator.getObject(object_name)
				if obj.enable_audit
					Creator.AuditRecords?.add('update', userId, this.object_name, doc, this.previous, modifier)
		"after.insert.server.audit":
			"on": "server"
			when: "after.insert"
			todo: (userId, doc)->
				object_name = this.object_name
				obj = Creator.getObject(object_name)
				if obj.enable_audit
					Creator.AuditRecords?.add('insert', userId, this.object_name, doc)

		"after.insert.server.objectwebhooks":
			"on": "server"
			when: "after.insert"
			todo: (userId, doc)->
				Creator.objectWebhooksPreSend(userId, doc, this.object_name, 'create')

		"after.update.server.objectwebhooks":
			"on": "server"
			when: "after.update"
			todo: (userId, doc, fieldNames, modifier, options)->
				Creator.objectWebhooksPreSend(userId, doc, this.object_name, 'update')

		"after.delete.server.objectwebhooks":
			"on": "server"
			when: "after.remove"
			todo: (userId, doc)->
				Creator.objectWebhooksPreSend(userId, doc, this.object_name, 'delete')

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
				# 记录权限统一走Creator.getRecordPermissions函数，所以record_permissions参数值都应该是这个函数的结果
				perms = {}
				if record_permissions
					perms = record_permissions
				else
					record = Creator.getObjectRecord(object_name, record_id)
					record_permissions = Creator.getRecordPermissions object_name, record, Meteor.userId()
					if record_permissions
						perms = record_permissions

				return perms["allowEdit"]

			on: "record"
			todo: "standard_edit"

		standard_delete:
			label: "删除"
			visible: (object_name, record_id, record_permissions)->
				# 记录权限统一走Creator.getRecordPermissions函数，所以record_permissions参数值都应该是这个函数的结果
				perms = {}
				if record_permissions
					perms = record_permissions
				else
					record = Creator.getObjectRecord(object_name, record_id)
					record_permissions = Creator.getRecordPermissions object_name, record, Meteor.userId()
					if record_permissions
						perms = record_permissions

				return perms["allowDelete"]

			on: "record_more"
			todo: "standard_delete"

		standard_approve:
			label: "发起审批"
			visible: (object_name, record_id, record_permissions) ->
				if record_permissions && !record_permissions["allowEdit"]
					return false

				record = Creator.getObjectRecord(object_name, record_id)
				record_permissions = Creator.getRecordPermissions object_name, record, Meteor.userId()
				if record_permissions && !record_permissions["allowEdit"]
					return false

				object_workflow = _.find Creator.object_workflows, (ow) ->
					return ow.object_name is object_name

				if not object_workflow
					return false

				if record and record.instances and record.instances.length > 0
					return false

				return false
			on: "record"
			todo: ()->
				Modal.show('initiate_approval', { object_name: this.object_name, record_id: this.record_id })

		standard_view_instance:
			label: "查看审批单"
			visible: (object_name, record_id, record_permissions) ->
				record = Creator.getObjectRecord(object_name, record_id)
				if record && !_.isEmpty(record.instances)
					return true

				return false
			on: "record"
			todo: ()->
				instanceId = this.record.instances[0]._id
				if !instanceId
					console.error 'instanceId not exists'
					return

				uobj = {}
				uobj['X-User-Id'] = Meteor.userId()
				uobj['X-Auth-Token'] = Accounts._storedLoginToken()

				data = { object_name: this.object_name, record_id: this.record_id, space_id: Session.get("spaceId") }

				url = Meteor.absoluteUrl() + "api/workflow/view/#{instanceId}?" + $.param(uobj)
				data = JSON.stringify(data)
				$(document.body).addClass 'loading'
				$.ajax
					url: url
					type: 'POST'
					async: true
					data: data
					dataType: 'json'
					processData: false
					contentType: 'application/json'
					success: (responseText, status) ->
						$(document.body).removeClass 'loading'
						if responseText.errors
							responseText.errors.forEach (e) ->
								toastr.error e.errorMessage
								return
							return
						else if responseText.redirect_url
							Steedos.openWindow(responseText.redirect_url)

						return
					error: (xhr, msg, ex) ->
						$(document.body).removeClass 'loading'
						toastr.error msg
						return

		# "export":
		# 	label: "Export"
		# 	visible: false
		# 	on: "list"
		# 	todo: (object_name, record_id, fields)->
		# 		alert("please write code in baseObject to export data for " + this.object_name)



if Meteor.isServer
	Creator.objectWebhooksPreSend = (userId, doc, object_name, action)->
		if !ObjectWebhooksQueue
			console.error('not found ObjectWebhooksQueue')
			return

		owCollection = Creator.getCollection('object_webhooks')
		if !owCollection
			console.error('not found collection object_webhooks')
			return

		obj = Creator.getObject(object_name)
		actionUserInfo = Creator.getCollection('users').findOne(userId, { fields: { name: 1 } })


		redirectUrl = Steedos.absoluteUrl(Creator.getObjectUrl(object_name, doc._id, object_name))

		owCollection.find({
			object_name: object_name,
			active: true,
			events: action
		}).forEach (oh)->
			data = {}
			if _.isEmpty(oh.fields)
				data = doc
			else
				_.each oh.fields, (fieldName)->
					objField = obj.fields[fieldName]
					if objField.type == 'lookup' && _.isString(objField.reference_to) && !objField.multiple
						refCollection = Creator.getCollection(objField.reference_to)
						refObj = Creator.getObject(objField.reference_to)
						if refCollection && refObj
							refNameFieldKey = refObj.NAME_FIELD_KEY
							refFilterFields = {}
							refFilterFields[refNameFieldKey] = 1
							refRecord = refCollection.findOne(doc[fieldName], refFilterFields)
							if refRecord
								data[fieldName] = refRecord[refNameFieldKey]
					else
						data[fieldName] = doc[fieldName]
			ObjectWebhooksQueue.send({
				data: data,
				payload_url: oh.payload_url,
				content_type: oh.content_type,
				action: action,
				actionUserInfo: actionUserInfo,
				objectName: object_name,
				objectDisplayName: obj.label,
				nameFieldKey: obj.NAME_FIELD_KEY,
				redirectUrl: redirectUrl
			});

		return