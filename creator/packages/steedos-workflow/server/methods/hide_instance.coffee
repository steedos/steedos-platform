Meteor.methods

	hide_instance: (insId, is_hidden) ->
		if !this.userId
			return

		check(insId, String)
		check(is_hidden, Boolean)

		userId = this.userId

		instance = db.instances.findOne(insId, { fields: { state: 1, flow: 1, space: 1 } })

		if not instance
			throw new Meteor.Error('error!', "未找到申请单")

		if instance.state isnt 'completed'
			throw new Meteor.Error('error!', "申请单状态不是已结束")

		# 验证login user_id对该流程有管理申请单的权限
		permissions = permissionManager.getFlowPermissions(instance.flow, userId)
		space = db.spaces.findOne(instance.space, { fields: { admins: 1 } })
		if (not permissions.includes("admin")) and (not space.admins.includes(userId))
			throw new Meteor.Error('error!', "用户没有对当前流程的管理权限")

		db.instances.update(insId, { $set: { is_hidden: is_hidden } })

		return true;
