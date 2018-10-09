Meteor.startup(function () {
	SimpleSchema.extendOptions({foreign_key: Match.Optional(Boolean), references: Match.Optional(Object)});
})