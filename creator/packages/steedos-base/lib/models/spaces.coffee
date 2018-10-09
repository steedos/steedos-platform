db.spaces = new Meteor.Collection('spaces')

db.spaces.allow
	update: (userId, doc, fields, modifier) ->
		return doc.owner == userId;
 

db.spaces._simpleSchema = new SimpleSchema
	name: 
		type: String,
		# unique: true,
		max: 200
	owner: 
		type: String,
		optional: true,
		autoform:
			type: "selectuser"
			defaultValue: ->
				return Meteor.userId()

	admins: 
		type: [String],
		optional: true,
		autoform:
			type: "selectuser"
			multiple: true

	cover:
		type: String,
		optional: true,
		autoform:
			type: 'fileUpload'
			collection: 'avatars'
			accept: 'image/*'
	avatar:
		type: String,
		optional: true,
		autoform:
			type: 'fileUpload'
			collection: 'avatars'
			accept: 'image/*'
			
	# apps_enabled:
	# 	type: [String],
	# 	optional: true,
	# 	autoform:
	# 		omit: true
	# 		type: "select-checkbox"
	# 		options: ()->
	# 			options = []
	# 			objs = db.apps.find({})
	# 			objs.forEach (obj) ->
	# 				options.push
	# 					label: t(obj.name),
	# 					value: obj._id
	# 			return options

	apps_paid:
		type: [String],
		optional: true,
		autoform:
			omit: true

	hostname: 
		type: String,
		optional: true,

	balance: 
		type: Number,
		decimal: true
		optional: true,
		autoform:
			omit: true
	is_paid: 
		type: Boolean,
		label: t("Spaces_isPaid"),
		optional: true,
		autoform:
			omit: true
			readonly: true

	created:
		type: Date,
		optional: true
	created_by:
		type: String,
		optional: true
	modified:
		type: Date,
		optional: true
	modified_by:
		type: String,
		optional: true
	services:
		type: Object
		optional: true,
		blackbox: true
		autoform:
			omit: true
	is_deleted:
		type: Boolean
		optional: true,
		autoform:
			omit: true

	"billing.remaining_months":
		type: Number
		optional: true
		autoform:
			omit: true

	user_limit:
		type: Number
		optional: true
		autoform:
			omit: true

	end_date:
		type: Date
		optional: true
		autoform:
			omit: true

	start_date:
		type: Date
		optional: true
		autoform:
			omit: true

	modules:
		type: [String]
		optional: true
		autoform:
			omit: true
	enable_register:
		type: Boolean,
		defaultValue:false,
		optional: true
	
if Meteor.isClient
	db.spaces._simpleSchema.i18n("spaces")

db.spaces.attachSchema(db.spaces._simpleSchema)


db.spaces.helpers

	owner_name: ->
		owner = db.space_users.findOne({user: this.owner});
		return owner && owner.name;
	
	admins_name: ->
		if (!this.admins)
			return ""
		admins = db.space_users.find({user: {$in: this.admins}}, {fields: {name:1}});
		adminNames = []
		admins.forEach (admin) ->
			adminNames.push(admin.name)
		return adminNames.toString();



if Meteor.isServer
	
	db.spaces.before.insert (userId, doc) ->
		if !userId and doc.owner
			userId = doc.owner

		doc.created_by = userId
		doc.created = new Date()
		doc.modified_by = userId
		doc.modified = new Date()
		doc.is_deleted = false;
		
		if !userId
			throw new Meteor.Error(400, "spaces_error_login_required");

		doc.owner = userId
		doc.admins = [userId]

		# 必须启用 admin app
		# if doc.apps_enabled
		# 	if _.indexOf(doc.apps_enabled, "admin")<0
		# 		doc.apps_enabled.push("admin")

	db.spaces.after.insert (userId, doc) ->
		db.spaces.createTemplateOrganizations(doc._id)
		_.each doc.admins, (admin) ->
			db.spaces.space_add_user(doc._id, admin, true)
			

	db.spaces.before.update (userId, doc, fieldNames, modifier, options) ->
		modifier.$set = modifier.$set || {}; 
		if doc.owner != userId
			throw new Meteor.Error(400, "spaces_error_space_owner_only");
		if (!Steedos.isLegalVersion(doc._id,"workflow.professional")) and modifier.$set.avatar
			throw new Meteor.Error(400, "space_paid_info_title");	
		modifier.$set.modified_by = userId;
		modifier.$set.modified = new Date();

		# Add owner as admins
		if modifier.$set.owner
			if (!modifier.$set.admins)
				modifier.$set.admins = doc.admins
				if modifier.$unset
					delete modifier.$set.admins
			else if (modifier.$set.admins.indexOf(modifier.$set.owner) <0)
				modifier.$set.admins.push(modifier.$set.owner)
		
		# 管理员不能为空
		if (!modifier.$set.admins)
			throw new Meteor.Error(400, "spaces_error_space_admins_required");

		# 必须启用 admin app
		# if modifier.$set.apps_enabled
		# 	if _.indexOf(modifier.$set.apps_enabled, "admin")<0
		# 		modifier.$set.apps_enabled.push("admin")

	db.spaces.after.update (userId, doc, fieldNames, modifier, options) ->
		self = this
		modifier.$set = modifier.$set || {}
		# 工作区修改后，该工作区的根部门的name也要修改，根部门和子部门的fullname也要修改
		if modifier.$set.name
			# 直接修改根部门名字，跳过验证
			db.organizations.direct.update({space: doc._id,is_company: true},{$set:{name: doc.name,fullname:doc.name}})
			rootOrg = db.organizations.findOne({space: doc._id,is_company: true})
			children = db.organizations.find({parents: rootOrg._id});
			children.forEach (child) ->
		    db.organizations.direct.update(child._id, {$set: {fullname: child.calculateFullname()}})


	db.spaces.before.remove (userId, doc) ->
		throw new Meteor.Error(400, "spaces_error_space_readonly");


	Meteor.methods
		setSpaceId: (spaceId) ->
			this.connection["spaceId"] = spaceId
			return this.connection["spaceId"]
		getSpaceId: ()->
			return this.connection["spaceId"]


	db.spaces.space_add_user = (spaceId, userId, user_accepted) ->
		spaceUserObj = db.space_users.direct.findOne({user: userId, space: spaceId})
		userObj = db.users.direct.findOne(userId);
		if (!userObj)
			return;
		now = new Date
		if (spaceUserObj)
			db.space_users.direct.update spaceUserObj._id, 
				$set:
					name: userObj.name
					email: userObj.emails?[0]?.address
					space: spaceId
					user: userObj._id
					user_accepted: user_accepted
					invite_state: "accepted"
					modified: now
					modified_by: userId
		else 
			root_org = db.organizations.findOne({space: spaceId, is_company:true})
			db.space_users.direct.insert
				name: userObj.name
				email: userObj.emails?[0]?.address
				space: spaceId
				organization: root_org._id
				organizations: [root_org._id]
				user: userObj._id
				user_accepted: user_accepted
				invite_state: "accepted"
				created: now
				created_by: userId
			root_org.updateUsers()
		
	db.spaces.createTemplateOrganizations = (space_id)->
		space = db.spaces.findOne(space_id)
		if !space
			return false;
		user = db.users.findOne(space.owner)
		if !user
			return false

		if db.organizations.find({space: space_id}).count()>0
			return;

		# 新建organization
		org = {}
		org.space = space_id
		org.name = space.name
		org.fullname = space.name
		org.is_company = true
		org_id = db.organizations.insert(org)
		if !org_id
			return false

		# 初始化 space owner 的 orgnization
		# db.space_users.direct.update({space: space_id, user: space.owner}, {$set: {organization: org_id}})

		_create_org = (orgName,sortNo)->
			_org = {}
			_org.space = space_id
			_org.name = orgName
			_org.fullname = org.name + '/' + _org.name
			_org.parents = [org_id]
			_org.parent = org_id
			if sortNo
				_org.sort_no=sortNo
			db.organizations.insert(_org)
		# 新建5个部门
		if user.locale == "zh-cn"
			_create_org("销售部")
			_create_org("财务部")
			_create_org("行政部")
			_create_org("人事部")
			_create_org("公司领导",101)
		else
			_create_org("Sales Department")
			_create_org("Finance Department")
			_create_org("Administrative Department")
			_create_org("Human Resources Department")
			_create_org("Company Leader",101)

		return true

if Meteor.isServer
	db.spaces._ensureIndex({
		"is_deleted": 1
	},{background: true})

	db.spaces._ensureIndex({
		"is_paid": 1
	},{background: true})

	db.spaces._ensureIndex({
		"name": 1,
		"is_paid": 1
	},{background: true})

	db.spaces._ensureIndex({
		"_id": 1,
		"created": 1
	},{background: true})

	db.spaces._ensureIndex({
		"_id": 1,
		"created": 1,
		"modified": 1
	},{background: true})