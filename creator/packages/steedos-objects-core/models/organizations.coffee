db.organizations = new Meteor.Collection('organizations')

#db.organizations._simpleSchema = new SimpleSchema
###
Creator.Objects.organizations =
	name: "organizations"
	label: "部门"
	icon: "team_member"
	enable_search: true
	enable_tree: true
	fields:
		name:
			label: "名称"
			type: "text"
			required: true
			searchable:true
			index:true
			sortable: true

		fullname:
			label: "部门全称"
			type: "text"
			omit: true
			hidden: true
			is_name: true

		parent:
			label: "上级部门"
			type: "lookup"
			reference_to: "organizations"
			sortable: true
			index:true
			blackbox: true

		parents:
			label: "上级部门"
			type: "lookup"
			reference_to: "organizations"
			multiple: true
			omit: true
			group: "系统"
			blackbox: true

		children:
			label: "下级部门"
			type: "lookup"
			reference_to: "organizations"
			multiple: true
			omit: true
			group: "系统"

		sort_no:
			label: "排序号"
			type: "number"
			defaultValue: 100
			sortable: true

		admins:
			label: "部门管理员"
			type: "lookup"
			reference_to: "users"
			multiple: true

		users:
			label: "成员"
			type: "lookup"
			reference_to: "users"
			multiple: true
			is_wide: true

		company_id:
			label: "所属单位"
			group: "系统"

		is_company:
			label: "公司级"
			type: "boolean"
			index:true

		is_group:
			label: "群组级"
			type: "boolean"
			index:true

		hidden:
			label: "隐藏"
			type: "boolean"

	list_views:

		all:
			columns: ["name", "sort_no", "is_company", "is_group", "admins", "hidden"]
			label: "所有"
			filter_scope: "space"
			sort : [
				{"field_name":"sort_no", "order":"desc"}
				{"field_name":"name", "order":"asc"}
			]

	actions:
		standard_query:
			label: "查找"
			visible: false
			on: "list"
			todo: "standard_query"
		addSubOrganization:
			label: "添加子部门"
			visible: ()->
				permissions = Creator.getPermissions()
				if permissions
					return permissions["allowCreate"]
			on: "record"
			todo: (object_name, record_id)->
				if record_id
					if Steedos.isMobile()
						record = Creator.getObjectRecord(object_name, record_id)
						Session.set 'cmDoc', {parent: record._id}
						Session.set 'reload_dxlist', false
						Meteor.defer ()->
							$(".btn.creator-add").click()
					else
						if this.record
							Session.set 'cmDoc', {parent: this.record._id}
							Meteor.defer ()->
								$(".btn.creator-add").click()

	permission_set:
		user:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true
		admin:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: true
			viewAllRecords: true
		organization_admin:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyCompanyRecords: true
			viewAllRecords: true
###

if Meteor.isServer
	Meteor.publish "subCompany", (space_id)->
		return Creator.Collections.organizations.find({space: space_id, is_company: true}, {fields: {_id: 1, name: 1, parent: 1, parents: 1, space: 1, is_company: 1}})

if Meteor.isClient
#	db.organizations._simpleSchema.i18n("organizations")
	db.organizations._sortFunction = (doc1, doc2) ->
		if (doc1.sort_no == doc2.sort_no)
			return doc1.name?.localeCompare(doc2.name);
		else if (doc1.sort_no > doc2.sort_no)
			return -1
		else
			return 1
	db.organizations.getRoot = (fields)->
		return SteedosDataManager.organizationRemote.findOne { is_company: true, parent: null }, fields: fields

#db.organizations.attachSchema db.organizations._simpleSchema;


db.organizations.helpers

	calculateParents: ->
		parents = [];
		if (!this.parent)
			return parents
		parentId = this.parent;
		while (parentId)
			parents.push(parentId)
			parentOrg = db.organizations.findOne({_id: parentId}, {parent: 1, name: 1});
			if (parentOrg)
				parentId = parentOrg.parent
			else
				parentId = null
		return parents


	calculateFullname: ->
		fullname = this.name;
		if (!this.parent)
			return fullname;
		parentId = this.parent;
		while (parentId)
			parentOrg = db.organizations.findOne({_id: parentId}, {parent: 1, name: 1});
			if (parentOrg)
				parentId = parentOrg.parent
			else
				parentId = null

			if parentId
				fullname = parentOrg?.name + "/" + fullname

		return fullname


	calculateChildren: ->
		children = []
		childrenObjs = db.organizations.find({parent: this._id}, {fields: {_id:1}});
		childrenObjs.forEach (child) ->
			children.push(child._id);
		return children;

	updateUsers: ->
		users = []
		spaceUsers = db.space_users.find({organizations: this._id}, {fields: {user:1}});
		spaceUsers.forEach (user) ->
			users.push(user.user);
		db.organizations.direct.update({_id: this._id}, {$set: {users: users}})

	space_name: ->
		space = db.spaces.findOne({_id: this.space});
		return space?.name

	users_count: ->
		if this.users
			return this.users.length
		else
			return 0

	calculateAllChildren: ->
		children = []
		childrenObjs = db.organizations.find({parents: {$in:[this._id]}}, {fields: {_id:1}})
		childrenObjs.forEach (child) ->
			children.push(child._id);
		return _.uniq children

	calculateUsers: (isIncludeParents)->
		orgs = if isIncludeParents then this.calculateAllChildren() else this.calculateChildren()
		orgs.push(this._id)
		users = []
		userOrgs = db.organizations.find({_id:{$in:orgs}}, {fields: {users:1}})
		userOrgs.forEach (org)->
			if org?.users?.length
				users = users.concat org.users
		return _.uniq users


if (Meteor.isServer)

	db.organizations.before.insert (userId, doc) ->
		if !userId and doc.owner
			userId = doc.owner
		doc.created_by = userId;
		doc.created = new Date();
		doc.modified_by = userId;
		doc.modified = new Date();
		#doc.is_company = !doc.parent;
		if (!doc.space)
			throw new Meteor.Error(400, "organizations_error_space_required");
		# check space exists
		space = db.spaces.findOne(doc.space)
		if !space
			throw new Meteor.Error(400, "organizations_error_space_not_found");

		isSpaceAdmin = space.admins.indexOf(userId) >= 0

		if doc.is_company and !isSpaceAdmin
			throw new Meteor.Error(400, "organizations_error_space_admins_only_for_is_company")

		# only space admin or org admin can insert organizations
		unless isSpaceAdmin
			isOrgAdmin = false
			if doc.parent
				parentOrg = db.organizations.findOne(doc.parent)
				if !parentOrg
					throw new Meteor.Error(400, "organizations_error_parent_is_not_found");
				parents = parentOrg?.parents
				if parents
					parents.push(doc.parent)
				else
					parents = [doc.parent]
				if db.organizations.findOne({_id:{$in:parents}, admins:userId})
					isOrgAdmin = true
			else
				# 注册用户的时候会触发"before.insert"，且其userId为underfined，所以这里需要通过parent为空来判断是否是新注册用户时进该函数。
				isOrgAdmin = true
			unless isOrgAdmin
				throw new Meteor.Error(400, "organizations_error_org_admins_only")

		# if doc.users
		# 	throw new Meteor.Error(400, "organizations_error_users_readonly");

		# 同一个space中不能有同名的organization，parent 不能有同名的 child
		if doc.parent
			parentOrg = if parentOrg then parentOrg else db.organizations.findOne(doc.parent)
			if !parentOrg
				throw new Meteor.Error(400, "organizations_error_parent_is_not_found");
			if parentOrg.children
				nameOrg = db.organizations.find({_id: {$in: parentOrg.children}, name: doc.name}).count()
				if nameOrg>0
					throw new Meteor.Error(400, "organizations_error_organizations_name_exists")

			# 公司级的部门的父部门必须也是公司级的部门
			if doc.is_company and !parentOrg.is_company
				throw new Meteor.Error(400, "organizations_error_parent_is_company_false_for_current_company");

			# 如果是新建组织不是根组织，则应该设置其company_id值为其最近一个父组织的company_id值，除非其is_company为true
			if doc.is_company and !doc.is_group
				doc.company_id = doc._id
			else
				# parentOrg正好是根组织的情况通过脚本修正，保证默认情况下每个根组织company_id有正确的值
				doc.company_id = parentOrg.company_id
		else
			# 新增部门时不允许创建根部门
			broexisted = db.organizations.find({space:doc.space}).count()
			if broexisted > 0
				throw new Meteor.Error(400, "organizations_error_organizations_parent_required")

			orgexisted = db.organizations.find({name: doc.name, space: doc.space,fullname:doc.name}).count()
			if orgexisted > 0
				throw new Meteor.Error(400, "organizations_error_organizations_name_exists")

			# 根组织的is_company值必须是true
			doc.is_company = true
			# 如果是新建根组织则应该设置其company_id值为根组织本身的_id值，因默认is_group也是false
			doc.company_id = doc._id


		# only space admin can update organization.admins
		unless isSpaceAdmin
			if (doc.admins)
				throw new Meteor.Error(400, "organizations_error_space_admins_only_for_org_admins");


	db.organizations.after.insert (userId, doc) ->
		updateFields = {}
		obj = db.organizations.findOne(doc._id)

		updateFields.parents = obj.calculateParents();
		updateFields.fullname = obj.calculateFullname()

		if !_.isEmpty(updateFields)
			db.organizations.direct.update(obj._id, {$set: updateFields})

		if doc.parent
			parent = db.organizations.findOne(doc.parent)
			db.organizations.direct.update(parent._id, {$set: {children: parent.calculateChildren()}});
		unless rootOrg
			rootOrg = db.organizations.findOne({space: doc.space, parent: null, is_company: true},fields:{_id:1})
		if doc.users
			space_users = db.space_users.find(
				{space: doc.space, user: {$in: doc.users}}, 
				{fields: {organizations: 1, company_id: 1, space: 1}})
			space_users.forEach (su)->
				orgs = su.organizations
				orgs.push(doc._id)
				db.space_users.direct.update({_id: su._id}, {$set: {organizations: orgs}})
				db.space_users.update_organizations_parents(su._id, orgs)
				db.space_users.update_company_ids(su._id, su)

		# 新增部门后在audit_logs表中添加一条记录
		insertedDoc = db.organizations.findOne({_id: doc._id})
		sUser = db.space_users.findOne({space: doc.space, user: userId},{fields: {name: 1}})
		if sUser
			db.audit_logs.insert
				c_name: "organizations",
				c_action: "add",
				object_id: doc._id,
				object_name: doc.name,
				value_previous: null,
				value: JSON.parse(JSON.stringify(insertedDoc)),
				created_by: userId,
				created_by_name: sUser.name,
				created: new Date()


	db.organizations.before.update (userId, doc, fieldNames, modifier, options) ->
		modifier.$set = modifier.$set || {};
		# check space exists
		space = db.spaces.findOne(doc.space)
		if !space
			throw new Meteor.Error(400, "organizations_error_space_not_found");

		isSpaceAdmin = space.admins.indexOf(userId) >= 0
		if modifier.$set.is_company != undefined and modifier.$set.is_company != doc.is_company and !isSpaceAdmin
			throw new Meteor.Error(400, "organizations_error_space_admins_only_for_is_company")

		###
			非工作区管理员修改部门，需要以下权限：
			1.需要有原组织或原组织的父组织的管理员权限
			2.需要有改动后的父组织的权限
		###
		unless isSpaceAdmin
			isOrgAdmin = Steedos.isOrgAdminByAllOrgIds [doc._id], userId
			unless isOrgAdmin
				throw new Meteor.Error(400, "organizations_error_org_admins_only")

			if modifier.$set?.parent and modifier.$set?.parent != doc.parent
				isParentOrgAdmin = Steedos.isOrgAdminByAllOrgIds [modifier.$set.parent], userId
				unless isParentOrgAdmin
					throw new Meteor.Error(400, "您没有该上级部门的权限")

		if (modifier.$set.space and doc.space!=modifier.$set.space)
			throw new Meteor.Error(400, "organizations_error_space_readonly");

		if (modifier.$set.parents)
			throw new Meteor.Error(400, "organizations_error_parents_readonly");

		if (modifier.$set.children)
			throw new Meteor.Error(400, "organizations_error_children_readonly");

		if (modifier.$set.fullname)
			throw new Meteor.Error(400, "organizations_error_fullname_readonly");

		# only space admin can update organization.admins
		unless isSpaceAdmin
			if (typeof doc.admins != typeof modifier.$set.admins or doc.admins?.sort().join(",") != modifier.$set.admins?.sort().join(","))
				throw new Meteor.Error(400, "organizations_error_space_admins_only_for_org_admins");

		if doc.parent
			# 公司级的部门的父部门必须也是公司级的部门
			parent = modifier.$set.parent or doc.parent
			is_company = if modifier.$set.is_company == undefined then doc.is_company else modifier.$set.is_company
			parentOrg = db.organizations.findOne(parent)
			if !parentOrg
				throw new Meteor.Error(400, "organizations_error_parent_is_not_found");
			if is_company and !parentOrg.is_company
				throw new Meteor.Error(400, "organizations_error_parent_is_company_false_for_current_company");

			# 部门的子部门中存在公司级的部门时，不能直接把该部门设置为非公司级
			if modifier.$set.is_company != undefined
				unless is_company
					childrenCompany = db.organizations.findOne({_id: {$in: doc.children},is_company: true})
					if childrenCompany
						throw new Meteor.Error(400, "organizations_error_children_is_company_true_for_current_company");

			is_group = if modifier.$set.is_group == undefined then doc.is_group else modifier.$set.is_group
			# 当变更parent、is_company或is_group属性时，重新计算其company_id值
			if modifier.$set.parent or modifier.$set.is_company != undefined or modifier.$set.is_group != undefined
				if is_company and !is_group
					company_id = doc._id
				else
					company_id = parentOrg.company_id
				if company_id
					modifier.$set.company_id = company_id
				else
					# 需求上是需要向上一层一层查找，直到找到 is_group=false and is_company = true 的节点，并设置company_id为其_id的
					# 但实际上parentOrg本身的company_id值是一层一层算下来的，有值就有值，没值就没值，所以技术上不需要一层一层去找。
					modifier.$unset = modifier.$unset || {}
					modifier.$unset.company_id = 1

		else
			# 根组织的is_company不能为false
			if modifier.$set.is_company != undefined
				if !modifier.$set.is_company
					throw new Meteor.Error(400, "organizations_error_is_company_false_in_root");
			# 不能修改根组织的父组织属性
			if modifier.$set.parent
				throw new Meteor.Error(400, "organizations_error_root_parent_can_not_set");
			
			if modifier.$set.is_group != undefined
				if modifier.$set.is_group
					modifier.$unset = modifier.$unset || {}
					modifier.$unset.company_id = 1
				else
					modifier.$set.company_id = doc._id

		modifier.$set.modified_by = userId;
		modifier.$set.modified = new Date();

		# if modifier.$set.users
		# 	throw new Meteor.Error(400, "organizations_error_users_readonly");

		if (modifier.$set.parent)
			# parent 不能等于自己或者 children
			parentOrg = if parentOrg then parentOrg else db.organizations.findOne(modifier.$set.parent)
			if !parentOrg
				throw new Meteor.Error(400, "organizations_error_parent_is_not_found");
			if (doc._id == parentOrg._id || parentOrg.parents.indexOf(doc._id)>=0)
				throw new Meteor.Error(400, "organizations_error_parent_is_self")
			# 同一个 parent 不能有同名的 child
			if parentOrg.children && modifier.$set.name
				nameOrg = db.organizations.find({_id: {$in: parentOrg.children}, name: modifier.$set.name}).count()
				if (nameOrg > 0 ) && (modifier.$set.name != doc.name)
					throw new Meteor.Error(400, "organizations_error_organizations_name_exists")

		# else if (modifier.$set.name != doc.name)
		# 	existed = db.organizations.find({name: modifier.$set.name, space: doc.space,fullname:modifier.$set.name}).count()
		# 	if existed > 0
		# 		throw new Meteor.Error(400, "organizations_error.organizations_name_exists"))

		if modifier.$unset?.name
			throw new Meteor.Error(400, "organizations_error_organization_name_required")

	db.organizations.after.update (userId, doc, fieldNames, modifier, options) ->
		modifier.$set = modifier.$set || {};
		modifier.$unset = modifier.$unset || {};
		updateFields = {}
		obj = db.organizations.findOne(doc._id)
		if obj.parent
			updateFields.parents = obj.calculateParents();
		# 更新上级部门的children
		if (modifier.$set.parent)
			newParent = db.organizations.findOne(doc.parent)
			db.organizations.direct.update(newParent._id, {$set: {children: newParent.calculateChildren()}});
			# 如果更改 parent，更改前的对象需要重新生成children
			oldParent = db.organizations.find({children:doc._id});
			oldParent.forEach (organization) ->
				existed = db.organizations.find({_id:doc._id,parent:organization._id}).count()
				if (existed == 0)
					db.organizations.direct.update({_id:organization._id},{$pull:{children:doc._id}})


		# 如果更改 parent 或 name, 需要更新 自己和孩子们的 fullname
		if (modifier.$set.parent || modifier.$set.name)
			updateFields.fullname = obj.calculateFullname()
			children = db.organizations.find({parents: doc._id});
			children.forEach (child) ->
				childSet = {fullname: child.calculateFullname()}
				if modifier.$set.parent
					childSet.parents = child.calculateParents()
				db.organizations.direct.update(child._id, {$set: childSet})

		if !_.isEmpty(updateFields)
			db.organizations.direct.update(obj._id, {$set: updateFields})

		old_users = this.previous.users || []
		new_users = modifier.$set.users || []

		# 只修改单个字段时，modifier.$set.users可能是undefined
		unless rootOrg
			rootOrg = db.organizations.findOne({space: doc.space, parent: null, is_company: true},fields:{_id:1})
		if modifier.$set.users or modifier.$unset.users != undefined
			added_users = _.difference(new_users, old_users)
			removed_users = _.difference(old_users, new_users)
			if added_users.length > 0
				added_space_users = db.space_users.find(
					{space: doc.space, user: {$in: added_users}}, 
					{fields: {organizations: 1, company_id: 1, space: 1}})
				added_space_users.forEach (su)->
					orgs = su.organizations
					orgs.push(doc._id)
					db.space_users.direct.update({_id: su._id}, {$set: {organizations: orgs}})
					db.space_users.update_organizations_parents(su._id, orgs)
					db.space_users.update_company_ids(su._id, su)
			if removed_users.length > 0
				removed_space_users = db.space_users.find(
					{space: doc.space, user: {$in: removed_users}},
					{fields: {organization: 1,organizations: 1, company_id: 1, space: 1}})
				removed_space_users.forEach (su)->
					# 删除部门成员时，如果修改了其organization，则其company_id值应该同步改为其对应的organization.company_id值
					orgs = su.organizations
					if orgs.length is 1
						db.space_users.direct.update({_id: su._id}, {$set: {organizations: [rootOrg._id], organization: rootOrg._id, company_id: rootOrg._id}})
						db.space_users.update_organizations_parents(su._id, [rootOrg._id])
						db.space_users.update_company_ids(su._id, su)
						db.space_users.update_company(su._id,rootOrg._id)
					else if orgs.length > 1
						new_orgs = _.filter(orgs, (org_id)->
							return org_id isnt doc._id
						)
						if su.organization is doc._id
							top_organization = db.organizations.findOne(new_orgs[0],fields:{company_id:1})
							db.space_users.direct.update({_id: su._id}, {$set: {organizations: new_orgs, organization: new_orgs[0], company_id: top_organization.company_id}})
							db.space_users.update_company(su._id,top_organization.company_id)
						else
							db.space_users.direct.update({_id: su._id}, {$set: {organizations: new_orgs}})
						db.space_users.update_organizations_parents(su._id, new_orgs)
						db.space_users.update_company_ids(su._id, su)

		old_company_id = this.previous.company_id
		new_company_id = doc.company_id
		# unset_company_id不可以通过modifier.$unset?.company_id来获取，因为before.update中给$unset赋值这里拿不到
		unset_company_id = !new_company_id and old_company_id
		if unset_company_id or (new_company_id and (new_company_id != old_company_id))
			# 当前部门的company_id值变化时，把其子部门全部设置为相同的company_id值
			setOptions = {}
			if unset_company_id
				setOptions = {$unset: {company_id: 1}}
			else
				setOptions = {$set: {company_id: new_company_id}}
			if doc.children and doc.children.length
				# 这里不能用direct.update，因为要触发级联操作
				# 设置子部门company_id时，只能设置非公司级的部门，或者虽然是公司级，但是设置了is_group忽略公司级的部门
				queryOptions = {
					_id: {$in: doc.children}, 
					$or: [{is_company: {$ne: true}},{is_company: true, is_group: true}]
				}
				db.organizations.update(queryOptions, 
					setOptions,
					{multi: true}
				)
			# 当前部门的company_id值变化时，同步主部门为当前部门的space_users的company_id值
			queryOptions = {}
			if unset_company_id
				queryOptions = {space: doc.space, company_id: doc._id }
			else
				queryOptions = {space: doc.space, organization: doc._id }
			db.space_users.direct.update(queryOptions, setOptions, {multi: true})
			# 当前部门的company_id值变化时，同步company_ids包含当前部门的space_users，
			# 以及organizations包含当前部门的space_users的company_ids值
			queryOptions = {
				space: doc.space, 
				$or:[
					{company_ids: doc._id},
					{organizations: doc._id}
				]
			}
			db.space_users.find(queryOptions,{fields: {organizations: 1, company_id: 1, space: 1}}).forEach (su)->
				db.space_users.update_company_ids(su._id, su)

		#修改部门的parent时, 需要其space_user的organizations_parents
		if modifier.$set.parent
			children = db.organizations.find({parents: doc._id}, {fields: {_id: 1}});
			children.forEach (child) ->
				childUsers = db.space_users.find({organizations: child._id}, {fields: {_id: 1, organizations: 1}})
				childUsers.forEach (su)->
					db.space_users.update_organizations_parents(su._id, su.organizations)
		
		if modifier.$set.name != this.previous.name && (doc.is_company == true) && !doc.parent
			# 根组织名称变更时同步更新工作区名称
			db.spaces.direct.update({_id: doc.space}, {$set: {name: modifier.$set.name}})

		# 更新部门后在audit_logs表中添加一条记录
		updatedDoc = db.organizations.findOne({_id: doc._id})
		sUser = db.space_users.findOne({space: doc.space, user: userId},{fields:{name:1}})
		if sUser
			db.audit_logs.insert
				c_name: "organizations",
				c_action: "edit",
				object_id: doc._id,
				object_name: doc.name,
				value_previous: this.previous,
				value: JSON.parse(JSON.stringify(updatedDoc)),
				created_by: userId,
				created_by_name: sUser.name,
				created: new Date()


	db.organizations.before.remove (userId, doc) ->
		# check space exists
		space = db.spaces.findOne(doc.space)
		if !space
			throw new Meteor.Error(400, "organizations_error_space_not_found");

		isSpaceAdmin = space.admins.indexOf(userId) >= 0

		if doc.is_company and !isSpaceAdmin
			throw new Meteor.Error(400, "organizations_error_space_admins_only_for_is_company")

		# only space admin or org admin can remove organizations
		unless isSpaceAdmin
			isOrgAdmin = false
			if doc.admins?.includes userId
				isOrgAdmin = true
			else if doc.parent
				parents = doc.parents
				if db.organizations.findOne({_id:{$in:parents}, admins:userId})
					isOrgAdmin = true
			unless isOrgAdmin
				throw new Meteor.Error(400, "organizations_error_org_admins_only")

		# can not delete organization with children
		if (doc.children && doc.children.length>0)
			throw new Meteor.Error(400, "organizations_error_organization_has_children");

		# can not delete organization with users
		if (doc.users && doc.users.length > 0)
			throw new Meteor.Error(400, "organizations_error_organization_has_users");

		if (doc.is_company && !doc.parent)
			throw new Meteor.Error(400, "organizations_error_can_not_remove_root_organization");


	db.organizations.after.remove (userId, doc) ->
		if (doc.parent)
			parent = db.organizations.findOne(doc.parent)
			db.organizations.direct.update(parent._id, {$set: {children: parent.calculateChildren()}});

		# !!! If delete organization, a lot of data need delete.
		# if doc.users
		#	_.each doc.users, (userId) ->
		#		db.space_users.direct.update({user: userId}, {$unset: {organization: 1}})

		# 删除部门后在audit_logs表中添加一条记录
		sUser = db.space_users.findOne({space: doc.space, user: userId},{fields:{name:1}})
		if sUser
			db.audit_logs.insert
				c_name: "organizations",
				c_action: "delete",
				object_id: doc._id,
				object_name: doc.name,
				value_previous: doc,
				value: null,
				created_by: userId,
				created_by_name: sUser.name,
				created: new Date()

	Meteor.publish 'organizations', (spaceId)->

		unless this.userId
			return this.ready()

		unless spaceId
			return this.ready()

		selector =
			space: spaceId

		return db.organizations.find(selector)

	Meteor.publish 'organization', (orgId)->

		unless this.userId
			return this.ready()

		unless orgId
			return this.ready()

		selector =
			_id: orgId

		return db.organizations.find(selector)

	Meteor.publish 'root_organization', (spaceId)->

		unless this.userId
			return this.ready()

		unless spaceId
			return this.ready()

		selector =
			space: spaceId
			is_company: true
			parent: null

		return db.organizations.find(selector)

	Meteor.publish 'my_organizations', (spaceId)->

		unless this.userId
			return this.ready()

		unless spaceId
			return this.ready()

		return db.organizations.find({space: spaceId, users: this.userId})

if Meteor.isServer
	db.organizations._ensureIndex({
		"space": 1
	},{background: true})

	db.organizations._ensureIndex({
		"space": 1,
		"users": 1
	},{background: true})

	db.organizations._ensureIndex({
		"_id": 1,
		"space": 1
	},{background: true})

	db.organizations._ensureIndex({
		"name": 1,
		"space": 1,
		"_id": 1,
		"parent": 1
	},{background: true})

	db.organizations._ensureIndex({
		"space": 1,
		"is_deleted": 1
	},{background: true})

	db.organizations._ensureIndex({
		"parents": 1
	},{background: true})

	db.organizations._ensureIndex({
		"parents": 1,
		"is_deleted": 1
	},{background: true})

	db.organizations._ensureIndex({
		"space": 1,
		"created": 1
	},{background: true})

	db.organizations._ensureIndex({
		"space": 1,
		"created": 1,
		"modified": 1
	},{background: true})