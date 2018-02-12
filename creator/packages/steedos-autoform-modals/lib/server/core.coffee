Meteor.methods
	"af_update": (options)->
		check options, Object
		{ _ids, _object_name} = options
		check _ids, String
		check _object_name, String

		delete options._ids
		delete options._object_name
		object = Creator.getObject(_object_name)
		unless object
			throw new Meteor.Error(403, "未找到指定对象")
			return false
		collection = object.db
		console.log "af_modal_multiple_update,options2:", options
		collection.update {
			_id: {$in: _ids.split(",")}
		}, {$set: options}, {multi:true}
		return true