Meteor.methods
	"af_multiple_update": (options)->
		check options, Object
		{ _ids, _object_name} = options['$set']
		check _ids, String
		check _object_name, String

		delete options['$set']._ids
		delete options['$set']._object_name
		object = Creator.getObject(_object_name)
		unless object
			throw new Meteor.Error(403, "未找到指定对象")
			return false
		collection = object.db
		# console.log "af_modal_multiple_update,options2:", options
		collection.update {
			_id: {$in: _ids.split(",")}
		}, options, {multi:true}
		return true

	"af_update": (options, id)->
		_object_name = options["$set"]._object_name

		check options, Object
		check _object_name, String
		delete options["$set"]._ids
		delete options["$set"]._object_name
		object = Creator.getObject(_object_name)
		unless object
			throw new Meteor.Error(403, "未找到指定对象")
			return false
		collection = object.db
		collection.update {_id: id}, options
		return true

	"af_insert": (options)->
		{_object_name} = options
		check options, Object
		check _object_name, String
		delete options._ids
		delete options._object_name
		object = Creator.getObject(_object_name)
		unless object
			throw new Meteor.Error(403, "未找到指定对象")
			return false
		collection = object.db
		_id = collection.insert options
		return collection.findOne(_id)