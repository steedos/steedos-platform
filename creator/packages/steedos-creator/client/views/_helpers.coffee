Creator.helpers =

	object_name: ()->
		return Session.get("object_name")
	object: ()->
		return Creator.getObject(Session.get("object_name"))
	getOperationLabel: (operation)->
		switch operation
			when "=" then return t("creator_filter_operation_equal")
			when "<>" then return t("creator_filter_operation_unequal")
			when "<" then return t("creator_filter_operation_less_than")
			when ">" then return t("creator_filter_operation_greater_than")
			when "<=" then return t("creator_filter_operation_less_or_equal")
			when ">=" then return t("creator_filter_operation_greater_or_equal")
			when "contains" then return t("creator_filter_operation_contains")
			when "notcontains" then return t("creator_filter_operation_does_not_contain")
			when "startswith" then return t("creator_filter_operation_starts_with")
			when "between" then return t("creator_filter_operation_between")
	isMobile: ()->
		return Steedos.isMobile()
