# Meteor.startup ()->

# 	if Meteor.isServer and db.space_users

# 		db.space_users.vaildateUserUsedByOther = (doc)->
# 			roleNames = []
# 			_.each db.flow_positions.find({space: doc.space, users: doc.user},{fields: {users: 1, role: 1}}).fetch(), (p)->
# 				if p.users.includes(doc.user)
# 					role = db.flow_roles.findOne({_id: p.role},{fields: {name: 1}})
# 					if role
# 						roleNames.push role.name
# 			if not _.isEmpty(roleNames)
# 				throw new Meteor.Error 400, "space_users_error_roles_used", {names: roleNames.join(',')}

# 			flowNames = []
# 			_.each db.flows.find({space: doc.space}, {fields: {name: 1, 'current.steps': 1}}).fetch(), (f)->
# 				_.each f.current.steps, (s)->
# 					if s.deal_type is 'specifyUser' and s.approver_users.includes(doc.user)
# 						flowNames.push f.name
# 			if not _.isEmpty(flowNames)
# 				throw new Meteor.Error 400, "space_users_error_flows_used", {names: _.uniq(flowNames).join(',')}

# 		db.space_users.before.update (userId, doc, fieldNames, modifier, options) ->
# 			modifier.$set = modifier.$set || {};

# 			if modifier.$set.user_accepted != undefined and !modifier.$set.user_accepted
# 				# 禁用、从工作区移除用户时，检查用户是否被指定为角色成员或者步骤指定处理人 #1288
# 				db.space_users.vaildateUserUsedByOther(doc)

# 		db.space_users.before.remove (userId, doc) ->
# 			# 禁用、从工作区移除用户时，检查用户是否被指定为角色成员或者步骤指定处理人 #1288
# 			db.space_users.vaildateUserUsedByOther(doc)
