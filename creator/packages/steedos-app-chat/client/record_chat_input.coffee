Template.steedos_record_chat_input.helpers


Template.steedos_record_chat_input.events
	'click .send-comment': (e, t)->
		msg = $('#comment-text-input', t.firstNode).val();
		if !msg
			return
		Creator.odata.insert('chat_messages', {related_to: {o: this.object_name, ids: [this.record_id]}, name: msg, type: 'text'})
		$('#comment-text-input', t.firstNode).val('')
