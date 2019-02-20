Template.account_personal.onCreated ->

Template.account_personal.onRendered ->

Template.account_personal.helpers Creator.helpers

Template.account_personal.helpers

	schema: ->
		return db.users._simpleSchema;

	user: ->
		return Meteor.user()
	
	btn_save_i18n: () ->
		return TAPi18n.__ 'Submit'

Template.account_personal.events
