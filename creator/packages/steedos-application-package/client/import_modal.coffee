Template.APPackageImportModal.events
	'click #import_ok': (event, template) ->
#		files = event.currentTarget.files;

		files = $("#importFile")[0].files

		if files.length < 1
			return ;
		reader = new FileReader();
		reader.onload = (ev) ->
			data = ev.target.result
			console.log("data", data)
			$.ajax
				type:"POST"
				url: Steedos.absoluteUrl("api/creator/app_package/import/#{Session.get('spaceId')}")
				dataType: "json",
				processData: false,
				contentType: "application/json",
				data: data
				success: ()->
					toastr.success("导入完成")

				error: (e)->
					if e.status == 500
						toastr.error(e.responseJSON.errors.errorMessage);
					else
						toastr.error(e.responseText);
					console.log e

		reader.readAsBinaryString(files[0]);