Meteor.startup ->
	SteedosOdataAPI.addRoute(':collectionInfo/:fieldName', {authRequired: SteedosOData.AUTHREQUIRED}, {
		get: ()->
			console.log '===:collectionInfo/:fieldName'
			console.log '@queryParams: ', @queryParams
			console.log '@urlParams: ', @urlParams
			console.log '@bodyParams: ', @bodyParams

			body = {}
			headers = {}
			
			collectionInfo = @urlParams.collectionInfo
			fieldName = @urlParams.fieldName.toLowerCase()
			collectionInfoSplit = collectionInfo.split('(')
			collectionName = collectionInfoSplit[0]
			id = collectionInfoSplit[1].split('\'')[1]
			console.log 'collectionName: ', collectionName
			console.log 'id: ', id
			collection = Creator.Collections[collectionName]
			fieldsOptions = {}
			fieldsOptions[fieldName] = 1
			entity = collection.findOne({_id: id}, {fields: fieldsOptions})
			console.log 'entity: ', entity
			fieldValue = null
			if entity
				fieldValue = entity[fieldName]

			obj = Creator.objectsByName[collectionName]
			field = obj.fields[fieldName]

			if field and field.type is 'lookup' and fieldValue
				lookupCollection = Creator.Collections[field.reference_to]
				lookupObj = Creator.objectsByName[field.reference_to]
				queryOptions = {fields: {}}
				_.each lookupObj.fields, (v, k)->
					queryOptions.fields[k] = 1
				console.log 'queryOptions: ', queryOptions
				if field.multiple
					body['value'] = lookupCollection.find({_id: {$in: fieldValue}}, queryOptions).fetch()
					body['@odata.context'] = SteedosOData.getMetaDataPath(@urlParams.spaceId) + "##{collectionInfo}/#{@urlParams.fieldName}"
				else
					body = lookupCollection.findOne({_id: fieldValue}, queryOptions) || {}
					body['@odata.context'] = SteedosOData.getMetaDataPath(@urlParams.spaceId) + "##{field.reference_to}/$entity"

			else
				body['@odata.context'] = SteedosOData.getMetaDataPath(@urlParams.spaceId) + "##{collectionInfo}/#{@urlParams.fieldName}"
				body['value'] = fieldValue
			
			headers['Content-type'] = 'application/json;odata.metadata=minimal;charset=utf-8'
			headers['OData-Version'] = SteedosOData.VERSION
			console.log {body: body, headers: headers}
			{body: body, headers: headers}
	})

	# TODO 暂时未用到
	SteedosOdataAPI.addRoute(':collectionInfo', {authRequired: SteedosOData.AUTHREQUIRED}, {
		get: ()->
			console.log '===:collectionInfo'

			body = {}
			headers = {}
			body['@odata.context'] = SteedosOData.getODataContextPath(@urlParams.spaceId, key)
			body['value'] = entities
			headers['Content-type'] = 'application/json;odata.metadata=minimal;charset=utf-8'
			headers['OData-Version'] = SteedosOData.VERSION
			{body: body, headers: headers}
	})
