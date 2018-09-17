Meteor.startup ()->
	_changeServerObjects = (document)->
		if _.size(document.fields) > 0
#
#			all_viewlist = Creator.getCollection("object_listviews").findOne({space: document.space, object_name: document.name, shared: true, name: "all"})
#
#			if all_viewlist
#
#				if !document.list_views
#					document.list_views = {}
#
#				if !document.list_views.all
#					document.list_views.all = all_viewlist

			_.each document.fields, (f, k) ->
				if _.size(f.fields) > 0
					_.each f.fields, (_f, _k)->
						document.fields[k + ".$." + _k] = _f

					delete f.fields

			object_name = document.name
			if document.space
				object_name = 'c_' + document.space + '_' + document.name

			Creator.Objects[object_name] = document
			Creator.loadObjects document

	_removeServerObjects = (document)->
		Creator.removeObject(document.name)
	server_objects_init = false
	Creator.getCollection("objects").find({}, {
		fields: {
			created: 0,
			created_by: 0,
			modified: 0,
			modified_by: 0
		}
	}).observe {
		added: (newDocument)->
			if !server_objects_init
				_changeServerObjects newDocument
		changed: (newDocument, oldDocument)->
			_changeServerObjects newDocument
		removed: (oldDocument)->
			_removeServerObjects oldDocument
	}
	server_objects_init = true
