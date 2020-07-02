@TabularTables = {};


Meteor.startup ->
	SimpleSchema.extendOptions({beforeOpenFunction: Match.Optional(Match.OneOf(Function, String))})