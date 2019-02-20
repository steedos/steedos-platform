Template.steedos_record_chat_messages.onCreated ()->
	options =
		sort: {'created': -1}
		limit: 50
		fields: {
			_id: 1,
			space: 1,
			owner: 1,
			created: 1,
			related_to: 1,
			name: 1,
	#		type: 1
		}
	console.log('this.data', this.data);
	self = this
	this.autorun ()->
		self.subscribe "chat_messages", Session.get("spaceId"), self.data.object_name, self.data.record_id, options


Template.steedos_record_chat_messages.helpers
	messageList: ()->
		data = chatMessages.getRecordMessages(Session.get("spaceId"), this.object_name, this.record_id);
		return data;

	fromNow: (date)->
		return moment(date).fromNow()

	ownerName: (owner)->
		return Creator.getCollection("users").findOne(owner)?.name

	ownerAvatarUrl: (owner)->
		avatarUrl = Creator.getCollection("users").findOne(owner)?.avatarUrl
		if !avatarUrl
			return Creator.getRelativeUrl("/packages/steedos_lightning-design-system/client/images/themes/oneSalesforce/lightning_lite_profile_avatar_96.png")
		return Steedos.absoluteUrl avatarUrl

	permissions: ()->
		permissions = Creator.getRecordPermissions('chat_messages', this, Meteor.userId())
		permissions._record = this
		return permissions

	showAction: ()->
		permissions = this
		return permissions.allowDelete or permissions.allowEdit

	message: ()->
		if this.name
			return Spacebars.SafeString(marked(this.name))

Template.steedos_record_chat_messages.events
#	'click .chat-message-actions': (e, t)->
#		permissions = Creator.getRecordPermissions('chat_messages', this, Meteor.userId())
#		console.log('click .chat-message-actions', permissions);

	'click .remove-action': (e, t)->
		Creator.executeAction('chat_messages', {todo: 'standard_delete'}, this._record._id)

	'click .update-action': (e, t)->
		Session.set("cmFullScreen", false)
		Session.set 'cmDoc', this._record
		Session.set("action_fields", 'name')
		Session.set("action_collection", "Creator.Collections.chat_messages")
		Session.set("action_collection_name", Creator.getObject("chat_messages")?.label)
		Session.set("action_save_and_insert", false)
		Session.set 'cmIsMultipleUpdate', true
		Session.set 'cmTargetIds', Creator.TabularSelectedIds?.chat_messages
		Meteor.defer ()->
			$(".btn.creator-cell-edit").click()

	'click a': (e, t)->
		e.preventDefault()
		if e.target?.href && !e.target.href.startsWith("javascript")
			Steedos.openWindow(e.target.href)