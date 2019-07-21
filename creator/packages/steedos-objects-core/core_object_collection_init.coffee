db.apps = new Meteor.Collection('apps');
db.apps.isInternalApp = (url) ->
	if url and db.apps.INTERNAL_APPS
		for app_url in db.apps.INTERNAL_APPS
			if url.startsWith(app_url)
				return true
	return false

db.users = Meteor.users;
db.users.allow
# Allow user update own profile
update: (userId, doc, fields, modifier) ->
	if userId == doc._id
		return true
db.users.helpers
	spaces: ->
		spaces = []
		sus = db.space_users.find({user: this._id}, {fields: {space:1}})
		sus.forEach (su) ->
			spaces.push(su.space)
		return spaces;

	displayName: ->
		if this.name
			return this.name
		else if this.username
			return this.username
		else if this.emails and this.emails[0]
			return this.emails[0].address
db.spaces = new Meteor.Collection('spaces');
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
db.space_users = new Meteor.Collection('space_users');
db.space_users._simpleSchema = new SimpleSchema
Meteor.startup ()->
	db.space_users._simpleSchema.i18n("space_users")
	db.space_users._sortFunction = (doc1, doc2) ->
		if (doc1.sort_no == doc2.sort_no)
			return doc1.name?.localeCompare(doc2.name)
		else if (doc1.sort_no is undefined)
			return 1
		else if (doc2.sort_no is undefined)
			return -1
		else if (doc1.sort_no > doc2.sort_no)
			return -1
		else
			return 1

	db.space_users.before.find (userId, query, options)->
		if !options
			options = {}
		options.sort = db.space_users._sortFunction

	db.space_users.attachSchema(db.space_users._simpleSchema);

	db.space_users.helpers
		space_name: ->
			space = db.spaces.findOne({_id: this.space});
			return space?.name
		organization_name: ->
			if this.organizations
				organizations = SteedosDataManager.organizationRemote.find({_id: {$in: this.organizations}}, {fields: {fullname: 1}})
				return organizations?.getProperty('fullname').join('<br/>')
			return
db.organizations = new Meteor.Collection('organizations');
db.organizations._sortFunction = (doc1, doc2) ->
	if (doc1.sort_no == doc2.sort_no)
		return doc1.name?.localeCompare(doc2.name);
	else if (doc1.sort_no > doc2.sort_no)
		return -1
	else
		return 1
db.organizations.getRoot = (fields)->
	return SteedosDataManager.organizationRemote.findOne { is_company: true, parent: null }, fields: fields

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