@instanceBatch = {};

instanceBatch.submit = (approves, cb)->

	uobj = {};
	uobj.methodOverride = "POST";
	uobj["X-User-Id"] = Meteor.userId();
	uobj["X-Auth-Token"] = Accounts._storedLoginToken();

	url = Steedos.absoluteUrl() + "api/workflow/engine?" + $.param(uobj);

	data = {
		"Approvals": approves
	};

	$.ajax
		url: url
		type: 'POST'
		async: true
		data: JSON.stringify(data)
		dataType: 'json'
		processData: false
		contentType: 'application/json'
		success: (responseText, status) ->
			cb()
			return
		error: (xhr, msg, ex) ->
			cb(msg)
			return