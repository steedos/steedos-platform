Creator.odata_get = (object_name, record_id)->
	url = Steedos.absoluteUrl "/api/odata/v4/#{Steedos.spaceId()}/#{object_name}/#{record_id}"
	$.ajax
		type: "get"
		url: url
		dataType: "json"
		contentType: "application/json"
		beforeSend: (request) ->
			request.setRequestHeader('X-User-Id', Meteor.userId())
			request.setRequestHeader('X-Auth-Token', Accounts._storedLoginToken())
		error: (jqXHR, textStatus, errorThrown) ->
			error = jqXHR.responseJSON
			console.error error
			if error.reason
				toastr?.error?(TAPi18n.__(error.reason))
			else if error.message
				toastr?.error?(TAPi18n.__(error.message))
			else
				toastr?.error?(error)
Creator.odata_get = (object_name, record_id,field_name)->
	url = Steedos.absoluteUrl "/api/odata/v4/#{Steedos.spaceId()}/#{object_name}/#{record_id}"
	$.ajax
		type: "get"
		url: url
		data:{'$select':field_name}
		dataType: "json"
		contentType: "application/json"
		beforeSend: (request) ->
			request.setRequestHeader('X-User-Id', Meteor.userId())
			request.setRequestHeader('X-Auth-Token', Accounts._storedLoginToken())
		error: (jqXHR, textStatus, errorThrown) ->
			error = jqXHR.responseJSON
			console.error error
			if error.reason
				toastr?.error?(TAPi18n.__(error.reason))
			else if error.message
				toastr?.error?(TAPi18n.__(error.message))
			else
				toastr?.error?(error)
Creator.odata_get = (object_name, filters, fields, sort)->
	url = Steedos.absoluteUrl "/api/odata/v4/#{Steedos.spaceId()}/#{object_name}"
	selector = {}  #Creator.odata_get('qhd_informations','(company eq \'股份办公室\')', 'content,score_point,title','modified desc')
	selector['$filter'] = filters
	selector['$select'] = fields
	selector['$orderby'] = sort
	$.ajax
		type: "get"
		url: url
		data:selector
		dataType: "json"
		contentType: "application/json"
		beforeSend: (request) ->
			request.setRequestHeader('X-User-Id', Meteor.userId())
			request.setRequestHeader('X-Auth-Token', Accounts._storedLoginToken())
		error: (jqXHR, textStatus, errorThrown) ->
			error = jqXHR.responseJSON
			console.error error
			if error.reason
				toastr?.error?(TAPi18n.__(error.reason))
			else if error.message
				toastr?.error?(TAPi18n.__(error.message))
			else
				toastr?.error?(error)				
Creator.odata_delete = (object_name,record_id,callback)->
	url = Steedos.absoluteUrl "/api/odata/v4/#{Steedos.spaceId()}/#{object_name}/#{record_id}"
	$.ajax
		type: "delete"
		url: url
		dataType: "json"
		contentType: "application/json"
		beforeSend: (request) ->
			request.setRequestHeader('X-User-Id', Meteor.userId())
			request.setRequestHeader('X-Auth-Token', Accounts._storedLoginToken())

		success: (data) ->
			if callback and typeof callback == "function"
				callback()
			else
				toastr?.success?(t("afModal_remove_suc"))

		error: (jqXHR, textStatus, errorThrown) ->
			error = jqXHR.responseJSON
			console.error error
			if error.reason
				toastr?.error?(TAPi18n.__(error.reason))
			else if error.message
				toastr?.error?(TAPi18n.__(error.message))
			else
				toastr?.error?(error)

Creator.odata_update = (object_name,record_id,doc)->
	url = Steedos.absoluteUrl "/api/odata/v4/#{Steedos.spaceId()}/#{object_name}/#{record_id}"
	data = {}
	data['$set'] = doc
	$.ajax
		type: "put"
		url: url
		data: JSON.stringify(data)
		dataType: 'json'
		contentType: "application/json"
		processData: false
		beforeSend: (request) ->
			request.setRequestHeader('X-User-Id', Meteor.userId())
			request.setRequestHeader('X-Auth-Token', Accounts._storedLoginToken())

		# success: (data) ->
		# 	if callback and typeof callback == "function"
		# 		callback()
		# 	else
		# 		toastr?.success?(t("afModal_remove_suc"))

		error: (jqXHR, textStatus, errorThrown) ->
			error = jqXHR.responseJSON
			console.error error
			if error.reason
				toastr?.error?(TAPi18n.__(error.reason))
			else if error.message
				toastr?.error?(TAPi18n.__(error.message))
			else
				toastr?.error?(error)
Creator.odata_insert = (object_name,doc)->
	url = Steedos.absoluteUrl "/api/odata/v4/#{Steedos.spaceId()}/#{object_name}"
	$.ajax
		type: "post"
		url: url
		data: JSON.stringify(doc)
		dataType: 'json'
		contentType: "application/json"
		processData: false
		beforeSend: (request) ->
			request.setRequestHeader('X-User-Id', Meteor.userId())
			request.setRequestHeader('X-Auth-Token', Accounts._storedLoginToken())

		# success: (data) ->
		# 	if callback and typeof callback == "function"
		# 		callback()
		# 	else
		# 		toastr?.success?(t("afModal_remove_suc"))

		error: (jqXHR, textStatus, errorThrown) ->
			error = jqXHR.responseJSON
			console.error error
			if error.reason
				toastr?.error?(TAPi18n.__(error.reason))
			else if error.message
				toastr?.error?(TAPi18n.__(error.message))
			else
				toastr?.error?(error)