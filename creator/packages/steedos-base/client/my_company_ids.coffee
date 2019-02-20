Meteor.startup ->
	Tracker.autorun ->
		spaceId = Session.get("spaceId")
		userId = Meteor.userId()
		if spaceId and userId
			options =
				$filter: "user eq '#{userId}'",
				$select:'company_id,company_ids'
			Creator.odata.query 'space_users', options, true, (result, error)->
				if result and result.length
					Session.set "user_company_id", result[0].company_id
					Session.set "user_company_ids", result[0].company_ids
				else
					# 为兼容老数据，当user_company_ids为空时，抓取根组织_id作为user_company_ids
					options =
						$filter: "parent eq null",
						$select:'_id'
					Creator.odata.query 'organizations', options, true, (result, error)->
						if result and result.length
							Session.set "user_company_id", result[0]._id
							Session.set "user_company_ids", [result[0]._id]

