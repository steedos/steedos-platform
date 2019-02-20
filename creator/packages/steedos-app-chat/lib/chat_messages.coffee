@chatMessages = {}

chatMessages.getRecordMessages = (space_id, object_name, record_id, options)->

	### Odata
	queryOptions = {
		$top: options.top || 15,
		$filter: "(related_to/o eq '#{object_name}') and (related_to/ids eq '#{record_id}')",
		$orderby: 'created desc',
		$select: 'name,type,created,owner',
		$expand: 'owner($select=name,avatarUrl)'
	};

	return Creator.odata.query('chat_messages', queryOptions, true)
	###

	return Creator.getCollection("chat_messages").find({'space': space_id,'related_to.o': object_name,'related_to.ids': record_id}, {sort: {'created': -1}})