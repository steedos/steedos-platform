Creator.Objects.object_recent_viewed = 
	name: "object_recent_viewed"
	label: "最近查看"
	icon: "forecasts"
	fields: 
#		record_id:
#			type: "text"
#		object_name:
#			type: "text"
#			searchable:true
#			index:true
		record:
			type: "lookup"
			label:"记录"
			omit: true
			is_name: true
			reference_to: ()->
				return _.keys(Creator.Objects)
		space:
			type: "text"
			omit: true
		count:
			type: "number"
			defaultValue: 1

	permission_set:
		user:
			allowCreate: true
			allowDelete: false
			allowEdit: false
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: false 
		admin:
			allowCreate: true
			allowDelete: false
			allowEdit: false
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true
		guest:
			allowCreate: true
			allowDelete: false
			allowEdit: true
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true

	list_views:
		all:
			columns: ["record", "space", "modified"]
	
	methods:
		# 可通过this获取到object_name, record_id, space_id, user_id; params为request的body
		inc: (params) ->
			collection_recent_viewed = Creator.getCollection(this.object_name)
			filters = { owner: this.user_id, space: this.space_id, 'record.o': params.object_name, 'record.ids': [params.record_id]}
			current_recent_viewed = collection_recent_viewed.findOne(filters)
			if current_recent_viewed
				collection_recent_viewed.update(
					current_recent_viewed._id,
					{
						$inc: {
							count: 1
						},
						$set: {
							modified: new Date()
							modified_by: this.user_id
						}
					}
				)
			else
				collection_recent_viewed.insert(
					{
						_id: collection_recent_viewed._makeNewID()
						owner: this.user_id
						space: this.space_id
						record: {o: params.object_name,ids: [params.record_id]}
						count: 1
						created: new Date()
						created_by: this.user_id
						modified: new Date()
						modified_by: this.user_id
					}
				)
			return true

if Meteor.isServer
	Meteor.publish "object_recent_viewed", (object_name)->
		collection = Creator.Collections["object_recent_viewed"]
		return collection.find({object_name: object_name, created_by: this.userId}, {fields: {record_id: 1, object_name: 1}, sort: {modified: -1}, limit: 20})

