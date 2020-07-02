# actions = 
# 	import:
# 		label: "导入"
# 		on: "list"
# 		visible: (object_name, record_id, record_permissions)->
# 			return Creator.isSpaceAdmin()
# 		todo: ()->
# 			if !Steedos.isPaidSpace()
# 				Steedos.spaceUpgradedModal()
# 				return;

# 			Modal.show("import_users_modal");
	
# 	export:
# 		label: "导出"
# 		on: "list"
# 		visible: (object_name, record_id, record_permissions)->
# 			return Creator.isSpaceAdmin()
# 		todo: ()->
# 			spaceId = Session.get("spaceId")
# 			orgId = Session.get("grid_sidebar_selected")?[0]
# 			if spaceId and orgId
# 				uobj = {}
# 				uobj["X-User-Id"] = Meteor.userId()
# 				uobj["X-Auth-Token"] = Accounts._storedLoginToken()
# 				uobj.space_id = spaceId
# 				uobj.org_id = orgId
# 				url = Steedos.absoluteUrl() + "api/export/space_users?" + $.param(uobj)
# 				window.open(url, '_parent', 'EnableViewPortScale=yes')
# 			else
# 				swal
# 					title: "左侧未选中任何组织"
# 					text: "请在左侧组织机构树中选中一个组织后再执行导出操作"
# 					html: true
# 					type: 'warning'
# 					confirmButtonText: TAPi18n.__('OK')


# Meteor.startup ()->
# 	unless Creator.Objects.space_users?.actions
# 		Creator.Objects.space_users.actions = {}

# 	_.extend(Creator.Objects.space_users.actions, actions);
