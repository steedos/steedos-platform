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

		_.keys(_fields).forEach (key)->

			reference_field = _fields[key]

			if !_.isEmpty(reference_field.reference_to)
				data.children.push {
					find: (parent) ->
						self.unblock();
						return Creator.Collections[reference_field.reference_to].find({_id: parent[key]}, {fields: {_id: 1, name: 1, space: 1}});
				}

		return data
	else
		return {
			find: ()->
				self.unblock();
				return _table.collection.find({_id: {$in: ids}}, {fields: fields})
		};

