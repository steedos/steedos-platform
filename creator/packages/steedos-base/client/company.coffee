###
	Creator.USER_CONTEXT中主要相关格式为：
	{
		...
		"company": {
			"_id": "LrTvKo36ECCfyxStZ",
			"name": "二公司",
			"organization": "xxx"
		},
		"companies": [{
			"_id": "LrTvKo36ECCfyxStZ",
			"name": "二公司",
			"organization": "xxx"
		}],
		...
	}
###

# 根据Creator.USER_CONTEXT.companies值返回对应的ids
Steedos.getUserCompanyIds = ()->
	unless Creator.USER_CONTEXT
		return []
	if Creator.USER_CONTEXT.companies
		return Creator.USER_CONTEXT.companies.map((c)-> return c._id)
	else
		return []

# 根据Creator.USER_CONTEXT.company值返回对应的id
Steedos.getUserCompanyId = ()->
	unless Creator.USER_CONTEXT
		return ""
	return Creator.USER_CONTEXT.company?._id

# 根据Creator.USER_CONTEXT.companies值返回对应的company.organization
Steedos.getUserCompanyOrganizationIds = ()->
	unless Creator.USER_CONTEXT
		return []
	if Creator.USER_CONTEXT.companies
		return Creator.USER_CONTEXT.companies.map((c)-> return c.organization)
	else
		return []

# 根据Creator.USER_CONTEXT.company值返回对应的company.organization
Steedos.getUserCompanyOrganizationId = ()->
	unless Creator.USER_CONTEXT
		return ""
	return Creator.USER_CONTEXT.company?.organization





