

	# publish users spaces
	# we only publish spaces current user joined.
	Meteor.publish 'my_spaces', ->
		unless this.userId
			return this.ready()


		self = this;
		userSpaces = []
		sus = db.space_users.find({user: this.userId, user_accepted: true}, {fields: {space:1}})
		sus.forEach (su) ->
			userSpaces.push(su.space)

		handle2 = null

		# only return user joined spaces, and observes when user join or leave a space
		handle = db.space_users.find({user: this.userId, user_accepted: true}).observe
			added: (doc) ->
				if doc.space
					if userSpaces.indexOf(doc.space) < 0
						userSpaces.push(doc.space)
						observeSpaces()
			removed: (oldDoc) ->
				if oldDoc.space
					self.removed "spaces", oldDoc.space
					userSpaces = _.without(userSpaces, oldDoc.space)

		observeSpaces = ->
			if handle2
				handle2.stop();
			handle2 = db.spaces.find({_id: {$in: userSpaces}}).observe
				added: (doc) ->
					self.added "spaces", doc._id, doc;
					userSpaces.push(doc._id)
				changed: (newDoc, oldDoc) ->
					self.changed "spaces", newDoc._id, newDoc;
				removed: (oldDoc) ->
					self.removed "spaces", oldDoc._id
					userSpaces = _.without(userSpaces, oldDoc._id)

		observeSpaces();

		self.ready();

		self.onStop ->
			handle.stop();
			if handle2
				handle2.stop();
