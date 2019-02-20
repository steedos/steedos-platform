Meteor.publishComposite 'chat_messages', (space_id, object_name, record_id, options)->
	query = {'space': space_id,'related_to.o': object_name,'related_to.ids': record_id}

	self = this

	self.unblock();

	data = {
		find: ()->
			self.unblock();

			return Creator.getCollection("chat_messages").find(query, options);
	}

	data.children = []

	data.children.push {
		find: (parent) ->
			try
				self.unblock();
				if parent?.owner
					return Creator.getCollection("users").find({_id: parent.owner}, {
						fields: {name: 1, avatarUrl: 1}
					});
				else
					return []
			catch e
				console.log(reference_to, parent, e)
				return []
	}

	return data