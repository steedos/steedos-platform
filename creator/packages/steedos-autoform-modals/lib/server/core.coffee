Meteor.methods
	"af_modal_multiple_update": (options)->
		check options, Object
		{ target_ids, doc, object_name} = options
		check target_ids, Array
		check doc, Object
		check object_name, String

		object = Creator.getObject(object_name)
		unless object
			throw new Meteor.Error(403, "未找到指定对象")
			return false
		collection = object.db
		collection.update {
			_id: {$in: target_ids}
		}, doc, {multi:true}
		return true;