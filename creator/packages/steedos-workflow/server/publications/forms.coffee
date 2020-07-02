Meteor.publish 'forms', (spaceId)->
	unless this.userId
		return this.ready()

	unless spaceId
		return this.ready()


	return db.forms.find({space: spaceId}, {fields: {name: 1, category: 1, state: 1, description: 1, instance_style: 1}})


Meteor.publish 'form_version', (spaceId, formId, versionId) ->
	unless this.userId
		return this.ready()

	unless spaceId
		return this.ready()

	unless formId
		return this.ready()

	unless versionId
		return this.ready()


	self = this;

	getFormVersion = (id , versionId)->
		form = db.forms.findOne({_id : id});
		if !form
			return {}
		form_version = form.current
		form_version.latest = true
		if form_version._id != versionId
			form_version = form.historys.findPropertyByPK("_id", versionId)
			form_version.latest = false
		return form_version

	handle = db.forms.find({_id: formId}, {fields: {_id: 1, "current.modified": 1}}).observeChanges {
		changed: (id)->
			self.changed("form_versions", versionId, getFormVersion(id, versionId));
	}

	self.added("form_versions", versionId, getFormVersion(formId, versionId));
	self.ready();
	self.onStop ()->
		handle.stop()