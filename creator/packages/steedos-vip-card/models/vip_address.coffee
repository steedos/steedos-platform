Creator.Objects.vip_address =
	name: "vip_address"
	label: "收货地址"
	icon: "address"
	fields:
		name:
			label:'收货人'
			type:'text'
			required:true
			index:true
		address:
			label:'地址'
			type:'location'
			required:true
			index:true
		door:
			label:'门牌号'
			type:'text'
		gender:
			label:'性别'
			type:'select'
			options:[{label:"先生",value:'man'},{label:"女士",value:'woman'}]
		phone:
			label:'手机号'
			type:'text'
			required:true
		is_default:
			type:'boolean'
			label:'默认地址'
	list_views:
		all:
			label: "所有"
			columns: ["name", "address", "door", "phone", "is_default"]
			filter_scope: "space"
	triggers:
		"after.insert.server.vip_address":
			on: "server"
			when: "after.insert"
			todo: (userId, doc)->
				if doc?.is_default
					Creator.getCollection('vip_address').direct.update({_id: {$ne: doc._id}, owner: userId}, {$set: {is_default: false}}, {multi: true})
		"after.update.server.vip_address":
			on: "server"
			when: "after.update"
			todo: (userId, doc, fieldNames, modifier, options)->
				if modifier?.$set?.is_default
					Creator.getCollection('vip_address').direct.update({_id: {$ne: doc._id}, owner: userId}, {$set: {is_default: false}}, {multi: true})
					
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
		member:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: false
		guest:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: false