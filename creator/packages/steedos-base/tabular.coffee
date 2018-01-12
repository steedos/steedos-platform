Meteor.startup ()->
	new Tabular.Table
		name: "customize_apps",
		collection: db.apps,
		columns: [
			{
				data: "name"
				orderable: false
			}
		]
		dom: "tp"
		extraFields: ["_id", "space"]
		lengthChange: false
		ordering: false
		pageLength: 10
		info: false
		searching: true
		autoWidth: true
		changeSelector: (selector, userId) ->
			unless userId
				return {_id: -1}
			space = selector.space
			unless space
				if selector?.$and?.length > 0
					space = selector.$and.getProperty('space')[0]
			unless space
				return {_id: -1}
			return selector