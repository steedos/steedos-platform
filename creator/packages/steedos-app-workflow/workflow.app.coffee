# Creator.Apps.workflow =
# 	name: "审批王"
# 	sort: 100
# 	is_creator: false

# 	# Menu 支持两种类型的参数
# 	# - template_name 指向 Meteor Template, url=/app/admin/page/{template_name}/
# 	# - object_name 指向对象, url=/app/admin/{object_name}/grid/all/	
# 	admin_menus: [
# 		# 单位管理员可以创建和设置流程及相关参数。
# 		{ _id: 'menu_workflow', name: '审批', permission_sets: ["user"], expanded: false },
# 		{ _id: 'flows', name: '流程', permission_sets: ["admin", "workflow_admin"], object_name: "flows", parent: 'menu_workflow' },
# 		{ _id: 'flow_roles', name: '审批岗位', permission_sets: ["admin", "workflow_admin"], object_name: "flow_roles", parent: 'menu_workflow' },
# 		{ _id: 'flow_positions', name: '岗位成员', permission_sets: ["admin", "workflow_admin"], object_name: "flow_positions", parent: 'menu_workflow' },
# 		{ _id: 'categories', name: '流程分类', permission_sets: ["admin", "workflow_admin"], object_name: "categories", parent: 'menu_workflow' },
# 		{ _id: 'instance_number_rules', name: '流程编号', permission_sets: ["admin", "workflow_admin"], object_name: "instance_number_rules", parent: 'menu_workflow' },
# 		{ _id: 'space_user_signs', name: '图片签名', permission_sets: ["admin", "workflow_admin"], object_name: "space_user_signs", parent: 'menu_workflow' },
# 		{ _id: 'instances_statistic', name: '效率统计', permission_sets: ["admin", "workflow_admin"], object_name: "instances_statistic", parent: 'menu_workflow' },
# 		{ _id: 'webhooks', name: 'Webhooks', permission_sets: ["admin"], object_name: "webhooks", parent: 'menu_workflow' },
# 		{ _id: 'process_delegation_rules', name: '流程委托', permission_sets: ["user"], object_name: "process_delegation_rules", parent: 'menu_workflow' },
# 	]

