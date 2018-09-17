Meteor.methods
	installAppTemplate: (space_id, unique_id, appVersion)->
		userId = this.userId

		if !userId
			throw new Meteor.Error("401", "Authentication is required and has not been provided.")

		if !Creator.isSpaceAdmin(space_id, userId)
			throw new Meteor.Error("401", "Permission denied.")

		app = _.find Creator._TEMPLATE.Apps, (app)->
					return app.unique_id == unique_id && app.version.toString() == appVersion.toString()

		if app

			app_objects = app.objects

			export_data = {}

			export_data.apps = []

			export_data.objects = []

			export_data.apps.push app

			_.each app_objects, (object_name)->
				object = Creator.AppTemplate.getAppObject(object_name)
				object.app_unique_id = unique_id
				object.app_version = appVersion
				if object
					export_data.objects.push APTransform.exportObject(object)

			console.log('export--->', JSON.stringify(export_data))


			result = Creator.import_app_package userId, space_id, export_data, true

			console.log('result', result)

		else
			throw new Meteor.Error('无效的应用标识')