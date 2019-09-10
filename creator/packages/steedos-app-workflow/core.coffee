@WorkflowCore = {}

if Meteor.isClient
	WorkflowCore.openFlowDesign = (locale, space, flow, companyId)->
		url = "/applications/designer/current/?locale=#{locale}&space=#{space}"
		if flow
			url = url + "&flow=#{flow}"
		if companyId && !Creator.isSpaceAdmin(space, Meteor.userId())
			url = url + "&companyId=#{companyId}"
		Steedos.openWindow Steedos.absoluteUrl(url)
	WorkflowCore.openFormDesign = (locale, space, form, companyId)->
		Modal.show('formDesign', {formId: form}, {keyboard:false, backdrop: "static"})

	Meteor.startup ->
		$(document).keydown (e) ->
			if e.keyCode == "13" or e.key == "Enter"
				if $(".flow-modal").length != 1
					return;
				if e.target.tagName != "TEXTAREA" or $(e.target).closest("div").hasClass("bootstrap-tagsinput")
					if $(".flow-modal").length == 1
						$(".flow-modal .btn-confirm").click()

if Meteor.isServer
	WorkflowCore.checkCreatePermissions = (spaceId, uid, company_id)->
#		permissions = Creator.getObjectPermissions(spaceId, uid, 'flows')
#
#		if !permissions.allowCreate
#			return false
#
#		# 如果不是工作区管理员, 则必须要指定company_id
#		if !Steedos.isSpaceAdmin(spaceId, uid)
#			userCompanyId = Creator.getUserCompanyId(uid, spaceId)
#			if !company_id || !userCompanyId || company_id != userCompanyId
#				return false

		if company_id
			if db.organizations.find({ _id: company_id, space: spaceId }).count() == 0
				return false

		return true