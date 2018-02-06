Meteor.startup ->
	ServiceMetadata = Npm.require('odata-v4-service-metadata').ServiceMetadata;
	ServiceDocument = Npm.require('odata-v4-service-document').ServiceDocument;
	_NUMBERTYPES = ["number", "currency"]

	_BOOLEANTYPES = ["boolean"]

	_NAMESPACE = "CreatorEntities"

	getObjectsOdataSchema = ()->
		schema = {version: SteedosOData.VERSION, dataServices: {schema: []}}

		entities_schema = {}

		entities_schema.namespace = _NAMESPACE

		entities_schema.entityType = []

		entities_schema.annotations = []

		_.each Creator.Collections, (value, key, list)->
			if not Creator.Objects[key]?.enable_api
				return

			_object = Creator.objectsByName[key]

			# 主键
			keys = [{propertyRef: {name: "_id", computedKey: true}}]

			entitie = {
				name: _object.name
				key:keys
			}

			keys.forEach (_key)->
				entities_schema.annotations.push {
					target: _NAMESPACE + "." + _object.name + "/" + _key.propertyRef.name,
					annotation: [{
						"term": "Org.OData.Core.V1.Computed",
						"bool": "true"
					}]
				}

			# EntityType
			property = []
			property.push {name: "_id", type: "Edm.String", nullable: false}

			navigationProperty = []

			_.forEach _object.fields, (field, field_name)->

				_type = "Edm.String"

				if _.contains _NUMBERTYPES, field.type
					_type = "Edm.Int32"
				if _.contains _BOOLEANTYPES, field.type
					_type = "Edm.Boolean"

				property.push {name: field_name, type: _type, nullable: !field.required}

				reference_to = field.reference_to

				if reference_to
					if !_.isArray(reference_to)
						reference_to = [reference_to]

					reference_to.forEach (r)->
						reference_obj = Creator.objectsByName[r]
						navigationProperty.push {
							name: field_name.toUpperCase(),
#							type: "Collection(" + _NAMESPACE + "." + reference_obj.name + ")",
							type: _NAMESPACE + "." + reference_obj.name
							partner: _object.name #TODO
							_re_name: reference_obj.name
							referentialConstraint: [
								{
									property: field_name,
									referencedProperty: "_id"
								}
							]
						}

			entitie.property = property
			entitie.navigationProperty = navigationProperty

			entities_schema.entityType.push entitie

		schema.dataServices.schema.push entities_schema


		container_schema = {}
		container_schema.entityContainer = {name: "container"}
		container_schema.entityContainer.entitySet = []

		_.forEach entities_schema.entityType, (_et, k)->
			container_schema.entityContainer.entitySet.push {
				"name": _et.name,
				"entityType": _NAMESPACE + "." + _et.name,
				"navigationPropertyBinding": []
			}

		# TODO ServiceMetadata不支持navigationPropertyBinding属性
#		_.forEach entities_schema.entityType, (_et, k)->
#			_.forEach _et.navigationProperty, (_et_np, np_k)->
#				_es = _.find container_schema.entityContainer.entitySet, (_es)->
#							return _es.name == _et_np.partner
#
#				_es?.navigationPropertyBinding.push {"path": _et_np._re_name, "target": _et_np._re_name}
#				console.log("_es", _es)
#
#		console.log("container_schema", JSON.stringify(container_schema))

		schema.dataServices.schema.push container_schema

		return schema

	SteedosOdataAPI.addRoute('', {authRequired: SteedosOData.AUTHREQUIRED}, {
		get: ()->
			console.log("****************************///////atomPub.svc///////********************")
			console.log @request.headers
			context = SteedosOData.getMetaDataPath(@urlParams?.spaceId)
			serviceDocument  = ServiceDocument.processMetadataJson(getObjectsOdataSchema(), {context: context});
			body = serviceDocument.document()
			console.log(body)
			return {
				headers: {
					'Content-Type': 'application/json; charset=utf-8',
					'OData-Version': SteedosOData.VERSION
				},
				body: serviceDocument.document()
			};
	})

	SteedosOdataAPI.addRoute(SteedosOData.METADATA_PATH, {authRequired: SteedosOData.AUTHREQUIRED}, {
		get: ()->
			console.log("****************************//////atomPub.svc/$metadata////////********************")
			serviceMetadata = ServiceMetadata.processMetadataJson(getObjectsOdataSchema())
			body = serviceMetadata.document()
			return {
				headers: {
					'Content-Type': 'application/xml; charset=utf-8',
					'OData-Version': SteedosOData.VERSION
				},
				body: body
			};
	})