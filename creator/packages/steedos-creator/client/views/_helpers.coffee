Creator.helpers =

	object_name: ()->
		return Session.get("object_name")
	object: ()->
		return Creator.getObject(Session.get("object_name"))
	filterItems: ()->
		filters = Session.get("filter_items")
		fields = Creator.getObject().fields
		filters?.forEach (filter) ->
			filter.fieldlabel = fields[filter.field]?.label
			switch filter.operation
				when "=" then filter.operationlabel = t("creator_filter_operation_equal")
				when "<>" then filter.operationlabel = t("creator_filter_operation_unequal")
				when "<" then filter.operationlabel = t("creator_filter_operation_less_than")
				when ">" then filter.operationlabel = t("creator_filter_operation_greater_than")
				when "<=" then filter.operationlabel = t("creator_filter_operation_less_or_equal")
				when ">=" then filter.operationlabel = t("creator_filter_operation_greater_or_equal")
				when "contains" then filter.operationlabel = t("creator_filter_operation_contains")
				when "notcontains" then filter.operationlabel = t("creator_filter_operation_does_not_contain")
				when "startswith" then filter.operationlabel = t("creator_filter_operation_starts_with")	
		Session.set("filter_items",filters)
		return Session.get("filter_items")
