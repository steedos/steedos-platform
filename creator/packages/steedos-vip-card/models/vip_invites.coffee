Creator.Objects.vip_invites =
	name: "vip_invites"
	label: "邀请"
	icon: "record"
	fields:
		name:
			label: '名称'
			type: 'text'
		
		owner:
			label: '邀请对象'
			type: 'lookup'
			reference_to: 'users'
		
		from:
			label: '转发人'
			type: 'lookup'
			reference_to: 'users'

		open_group_id:
			label: "群"
			type: "text"
	
	list_views:
		all:
			label: "所有"
			columns: ["name", "owner", 'from']
			filter_scope: "space"

	permission_set:
		user:
			allowCreate: true
			allowDelete: false
			allowEdit: false
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
			allowDelete: false
			allowEdit: false
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true
		guest:
			allowCreate: true
			allowDelete: false
			allowEdit: false
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true

	triggers:
		"before.insert.server.vip_invites":
			on: "server"
			when: "before.insert"
			todo: (userId, doc)->
				owner = doc?.owner
				from = doc?.from
				invite = Creator.getCollection("vip_invites").findOne({owner: userId, from: from});
				if invite
					throw new Meteor.Error 405, "该invite信息已存在"