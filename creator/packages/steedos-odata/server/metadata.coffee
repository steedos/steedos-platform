Meteor.startup ->
	ServiceMetadata = require('odata-v4-service-metadata').ServiceMetadata;
	ServiceDocument = require('odata-v4-service-document').ServiceDocument;
	_NUMBER_TYPES = ["number", "currency"]

	_BOOLEAN_TYPES = ["boolean"]

	_DATETIME_OFFSET_TYPES = ['datetime']

	_NAMESPACE = "CreatorEntities"

	getObjectsOdataSchema = (spaceId)->
		schema = {version: SteedosOData.VERSION, dataServices: {schema: []}}

		entities_schema = {}

		entities_schema.namespace = _NAMESPACE

		entities_schema.entityType = []

		entities_schema.annotations = []

		_.each Creator.Collections, (value, key, list)->
			_object = Creator.getObject(key, spaceId)
			if not _object?.enable_api
				return

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

				_property = {name: field_name, type: "Edm.String"}

				if _.contains _NUMBER_TYPES, field.type
					_property.type = "Edm.Double"
				else if _.contains _BOOLEAN_TYPES, field.type
					_property.type = "Edm.Boolean"
				else if _.contains _DATETIME_OFFSET_TYPES, field.type
					_property.type = "Edm.DateTimeOffset"
					_property.precision = "8"

				if field.required
					_property.nullable = false

				property.push _property

				reference_to = field.reference_to

				if reference_to
					if !_.isArray(reference_to)
						reference_to = [reference_to]

					reference_to.forEach (r)->
						reference_obj = Creator.getObject(r, spaceId)
						if reference_obj
							_name = field_name + SteedosOData.EXPAND_FIELD_SUFFIX
							if _.isArray(field.reference_to)
								_name = field_name + SteedosOData.EXPAND_FIELD_SUFFIX + "." + reference_obj.name
							navigationProperty.push {
								name: _name,
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
						else
							console.warn "reference to '#{r}' invalid."

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
			context = SteedosOData.getMetaDataPath(@urlParams?.spaceId)
			serviceDocument  = ServiceDocument.processMetadataJson(getObjectsOdataSchema(@urlParams?.spaceId), {context: context});
			body = serviceDocument.document()
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
			serviceMetadata = ServiceMetadata.processMetadataJson(getObjectsOdataSchema(@urlParams?.spaceId))
			body = serviceMetadata.document()
			return {
				headers: {
					'Content-Type': 'application/xml; charset=utf-8',
					'OData-Version': SteedosOData.VERSION
				},
				body: body
			};
	})