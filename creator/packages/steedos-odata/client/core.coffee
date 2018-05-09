Creator.odata = {}
# Creator.odata.get = (object_name, record_id)->
# 	if object_name and record_id
# 		url = Steedos.absoluteUrl "/api/odata/v4/#{Steedos.spaceId()}/#{object_name}/#{record_id}"
# 		$.ajax
# 			type: "get"
# 			url: url
# 			dataType: "json"
# 			contentType: "application/json"
# 			beforeSend: (request) ->
# 				request.setRequestHeader('X-User-Id', Meteor.userId())
# 				request.setRequestHeader('X-Auth-Token', Accounts._storedLoginToken())
# 			error: (jqXHR, textStatus, errorThrown) ->
# 				error = jqXHR.responseJSON
# 				console.error error
# 				if error.reason
# 					toastr?.error?(TAPi18n.__(error.reason))
# 				else if error.message
# 					toastr?.error?(TAPi18n.__(error.message))
# 				else
# 					toastr?.error?(error)
# 	else
# 		toastr.error("未找到记录")
Creator.odata.get = (object_name, record_id,field_name)->
	if object_name and record_id
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
				error = jqXHR.responseJSON.error
				console.error error
				if error?.reason
					toastr?.error?(TAPi18n.__(error.reason))
				else if error?.message
					toastr?.error?(TAPi18n.__(error.message))
				else
					toastr?.error?("未找到记录")
	else
		toastr.error("未找到记录")
Creator.odata.query = (object_name, options)->
	if object_name
		url = Steedos.absoluteUrl "/api/odata/v4/#{Steedos.spaceId()}/#{object_name}"
		store = new DevExpress.data.ODataStore({
			type: "odata"
			version: 4
			url: url
			beforeSend: (request) ->
				request.headers['X-User-Id'] = Meteor.userId()
				request.headers['X-Space-Id'] = Steedos.spaceId()
				request.headers['X-Auth-Token'] = Accounts._storedLoginToken()
		})
		options.store = store
		datasource = new DevExpress.data.DataSource(options)
		datasource.load()
			.done((result) ->
				console.log result
			)
			.fail((error) ->
				console.log error
				if error.reason
					toastr?.error?(TAPi18n.__(error.reason))
				else if error.message
					toastr?.error?(TAPi18n.__(error.message))
				else
					toastr?.error?(error)
			)
	# 	$.ajax
	# 		type: "get"
	# 		url: url
	# 		data:selector
	# 		dataType: "json"
	# 		contentType: "application/json"
	# 		beforeSend: (request) ->
	# 			request.setRequestHeader('X-User-Id', Meteor.userId())
	# 			request.setRequestHeader('X-Auth-Token', Accounts._storedLoginToken())
	# 		error: (jqXHR, textStatus, errorThrown) ->
	# 			error = jqXHR.responseJSON
	# 			console.error error
	# 			if error.reason
	# 				toastr?.error?(TAPi18n.__(error.reason))
	# 			else if error.message
	# 				toastr?.error?(TAPi18n.__(error.message))
	# 			else
	# 				toastr?.error?(error)
	# else
	# 	toastr.error("未找到记录")				
Creator.odata.delete = (object_name,record_id,callback)->
	if object_name and record_id
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
				error = jqXHR.responseJSON.error
				console.error error
				if error.reason
		 			toastr?.error?(TAPi18n.__(error.reason))
				else if error.message
					toastr?.error?(TAPi18n.__(error.message))
				else
					toastr?.error?(error)

Creator.odata.update = (object_name,record_id,doc)->
	if object_name and record_id
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
				error = jqXHR.responseJSON.error
				console.error error
				if error.reason
					toastr?.error?(TAPi18n.__(error.reason))
				else if error.message
					toastr?.error?(TAPi18n.__(error.message))
				else
					toastr?.error?(error)
Creator.odata.insert = (object_name,doc)->
	if object_name
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
				error = jqXHR.responseJSON.error
				console.error error
				if error.reason
					toastr?.error?(TAPi18n.__(error.reason))
				else if error.message
					toastr?.error?(TAPi18n.__(error.message))
				else
					toastr?.error?(error)