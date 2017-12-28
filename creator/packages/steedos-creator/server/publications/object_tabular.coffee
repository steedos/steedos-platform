Meteor.publishComposite "steedos_object_tabular", (tableName, ids, fields)->
	unless this.userId
		return this.ready()

	check(tableName, String);
	check(ids, Array);
	check(fields, Match.Optional(Object));

	_table = Tabular.tablesByName[tableName];

	_fields = Creator.Objects[_table.collection._name]?.fields

	if !_fields || !_table
		return this.ready()

	reference_fields = _.filter _fields, (f)->
		return !_.isEmpty(f.reference_to)

	self = this

	self.unblock();

	if reference_fields.length > 0
		data = {
			find: ()->
				self.unblock();
				return _table.collection.find({_id: {$in: ids}}, {fields: fields});
		}

		data.children = []

		keys = _.keys(fields)

		if keys.length < 1
			keys = _.keys(_fields)

		keys.forEach (key)->
			reference_field = _fields[key]

			if !_.isEmpty(reference_field?.reference_to)  # and Creator.Collections[reference_field.reference_to]
				data.children.push {
					find: (parent) ->
						self.unblock();

						query = {}

						reference_ids = parent[key]

						reference_to = reference_field.reference_to

						if _.isArray(reference_to)
							if _.isObject(reference_ids) && !_.isArray(reference_ids)
								reference_to = reference_ids.o
								reference_ids = reference_ids.ids || []
							else
								return []

						if _.isArray(reference_ids)
							query._id = {$in: reference_ids}
						else
							query._id = reference_ids

						return Creator.Collections[reference_to].find(query, {
							fields: {
								_id: 1,
								name: 1,
								space: 1
							}
						});
				}

		return data
	else
		return {
			find: ()->
				self.unblock();
				return _table.collection.find({_id: {$in: ids}}, {fields: fields})
		};

