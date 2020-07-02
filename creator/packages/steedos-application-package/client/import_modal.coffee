Template.APPackageImportModal.events
	'click #import_ok': (event, template) ->
#		files = event.currentTarget.files;

		files = $("#importFile")[0].files

		if files.length < 1
			return ;
		reader = new FileReader();
		reader.onload = (ev) ->
			data = reader.result
			###
    		由于使用接口方式会导致collection的after、before中获取不到userId，再此问题未解决之前，还是使用Method
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
			###

			Meteor.call "import_app_package", Session.get('spaceId'), JSON.parse(data), (error, result)->
				if error
					toastr.error(error.reason)
				else
					toastr.success("导入完成")
					Modal.hide(template)

		reader.readAsText(files[0], "utf-8");