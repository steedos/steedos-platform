db.cms_posts = new Meteor.Collection('cms_posts')

db.cms_posts._simpleSchema = new SimpleSchema
	site: 
		type: String,
		autoform: 
			type: "hidden",
			defaultValue: ->
				return Session.get("siteId");
	# url: 
	# 	type: String,
	# 	optional: true,
	# 	max: 500,
	# 	autoform: 
	# 		#type: "bootstrap-url",
	# 		order: 10

	title: 
		type: String,
		optional: false,
		max: 500,
		autoform: 
			order: 20

	summary: 
		type: String,
		optional: true,
		autoform: 
			omit: true

	# slug: 
	# 	type: String,
	# 	optional: true
	# 	autoform:
	# 		omit: true
	body: 
		type: String,
		optional: true
		autoform: 
			omit: true
			rows: 5,
			order: 30
 
	htmlBody: 
		type: String,
		optional: false,
		autoform:
			afFieldInput: 
				type: 'summernote'
				class: 'editor'
				settings: 
					height: 200
					dialogsInBody: true
					toolbar:  [
						['font1', ['style']],
						['font2', ['bold', 'underline', 'italic', 'clear']],
						['font3', ['fontname']],
						['color', ['color']],
						['para', ['ul', 'ol', 'paragraph']],
						['table', ['table']],
						['insert', ['link', 'picture']],
						['view', ['codeview']]
					]
					fontNames: ['Arial', 'Comic Sans MS', 'Courier New', 'Helvetica', 'Impact', '宋体','黑体','微软雅黑','仿宋','楷体','隶书','幼圆']

	image:
		type: [String]
		optional: true
		autoform:
			omit: true

	attachments:
		type: [String]
		optional: true
	"attachments.$":
		autoform:
			type: 'fileUpload'
			collection: 'posts'
			accept: 'image/*'
			# triggers: 
			# 	onBeforeInsert: (fileObj) ->
			# 		if !fileObj.metadata
			# 			fileObj.metadata = {}
			# 		fileObj.metadata.site = Session.get("siteId")
			# 		return fileObj

	category: 
		type: String,
		optional: true,
		autoform: 
			type: ()->
				if Session.get("is_create_new_post")
					return "hidden"
				if db.cms_categories.find({site:Session.get("siteId")}).count()
					return "select"
				return "hidden"
			defaultValue: ->
				return Session.get("siteCategoryId");
			options: ->
				options = []
				objs = db.cms_categories.find({site:Session.get("siteId")}, {})
				objs.forEach (obj) ->
					options.push
						label: obj.name,
						value: obj._id
				return options

	visibility: 
		type: String,
		defaultValue: "private",
		allowedValues: ["private", "space", "public"]
		autoform: 
			type: "hidden",
			defaultValue: ->
				return "private";
			options: ->
				visibilitys = [
					{label: t("cms_posts_visibility_private"), value: "private"}
					{label: t("cms_posts_visibility_space"), value: "space"}
					# {label: t("cms_posts_visibility_public"), value: "public"}
				]
				if Steedos.isSpaceAdmin()
					return visibilitys
				else	
					return [
						visibilitys[0]
					]
	members:
		type: Object,
		optional: false

	"members.users": 
		type: [String],
		optional: true,
		autoform:
			type: "selectuser"
			multiple: true
			is_within_user_organizations: ->
				if Meteor?.settings?.public?.cms?.is_needto_limit_unit
					return true
				else
					return false
			userOptions: ->
				siteId = Session.get("siteId")
				siteObj = db.cms_sites.findOne(siteId)
				if siteObj?.visibility == "private"
					return siteObj.admins.join(",")
			defaultValue: ->
				siteId = Session.get("siteId")
				siteObj = db.cms_sites.findOne(siteId)
				if siteObj?.visibility == "private"
					return siteObj.admins			


	"members.organizations": 
		type: [String],
		optional: true,
		autoform:
			type: ->
				siteId = Session.get("siteId")
				siteObj = db.cms_sites.findOne(siteId)
				if siteObj?.visibility == "private"
					return "hidden"
				return "selectorg"
			multiple: true
			is_within_user_organizations: ->
				if Meteor?.settings?.public?.cms?.is_needto_limit_unit
					return true
				else
					return false

	postDate: 
		type: Date,
		optional: false,
		autoform: 
			type:()->
				if Steedos.isMobile() or Steedos.isAndroidOrIOS()
					return "datetime-local"
				else
					return "bootstrap-datetimepicker"
			dateTimePickerOptions:()->
				if Steedos.isMobile() or Steedos.isAndroidOrIOS()
					return null
				else
					return  {
						locale: Session.get("TAPi18n::loaded_lang")
						format:"YYYY-MM-DD HH:mm"
						sideBySide:true
					}
			defaultValue: ->
				return new Date()

	tags:
		type: [String],
		optional: true,
		autoform:
			omit: true
			type: 'tags'
		
			
	# The post author's name
	author_name: 
		type: String,
		optional: true
		autoform: 
			omit: true
	# The post author's `_id`. 
	author: 
		type: String,
		optional: true,
		autoform: 
			omit: true

	viewCount: 
		type: Number,
		optional: true
		autoform:
			omit: true
	commentCount: 
		type: Number,
		optional: true
		autoform:
			omit: true
	commenters: 
		type: [String],
		optional: true
		autoform:
			omit: true
	lastCommentedAt: 
		type: Date,
		optional: true
		autoform:
			omit: true
	clickCount: 
		type: Number,
		optional: true
		autoform:
			omit: true
	baseScore: 
		type: Number,
		decimal: true,
		optional: true
		autoform:
			omit: true
	upvotes: 
		type: Number,
		optional: true
		autoform:
			omit: true
	upvoters: 
		type: [String],
		optional: true
		autoform:
			omit: true
	downvotes: 
		type: Number,
		optional: true
		autoform:
			omit: true
	downvoters: 
		type: [String],
		optional: true
		autoform:
			omit: true
	score: 
		type: Number,
		decimal: true,
		optional: true
		autoform:
			omit: true
	# The post's status. 
	status: 
		type: Number,
		optional: true,
		autoform:
			omit: true

	featured: 
		type: Boolean,
		optional: true,
		defaultValue: false,
		autoform:
			omit: true
		
	# Whether the post is inactive. Inactive posts see their score recalculated less often
	inactive: 
		type: Boolean,
		optional: true
		autoform: 
			omit: true
	
	# Save info for later spam checking on a post. We will use this for the akismet package
	userIP: 
		type: String,
		optional: true
		autoform: 
			omit: true
	userAgent: 
		type: String,
		optional: true
		autoform: 
			omit: true
	referrer: 
		type: String,
		optional: true
		autoform: 
			omit: true

	created: 
		type: Date,
		optional: true
		autoform: 
			omit: true
	created_by:
		type: String,
		optional: true
		autoform: 
			omit: true
	modified:
		type: Date,
		optional: true
		autoform: 
			omit: true
	modified_by:
		type: String,
		optional: true
		autoform: 
			omit: true

db.cms_posts.config = 
	STATUS_PENDING: 1                                                                                      // 34
	STATUS_APPROVED: 2                                                                                     // 35
	STATUS_REJECTED: 3                                                                                     // 36
	STATUS_SPAM: 4                                                                                      // 37
	STATUS_DELETED: 5 

if Meteor.isClient
	db.cms_posts._simpleSchema.i18n("cms_posts")

db.cms_posts.attachSchema(db.cms_posts._simpleSchema)



if Meteor.isServer
	db.cms_posts.allow
		insert: (userId, event) ->
			if userId
				return true

		update: (userId,event) ->
			if userId
				return true

		remove: (userId,event) ->
			if userId
				return true

	
	db.cms_posts.before.insert (userId, doc) ->
		if !userId
			throw new Meteor.Error(400, "cms_error_login_required")

		if (!doc?.members?.users) && (!doc?.members?.organizations)
			throw new Meteor.Error(400, "cms_error_required_members_value")	

		doc.created_by = userId
		doc.created = new Date()
		doc.modified_by = userId
		doc.modified = new Date()
		
		if !doc.postDate
			doc.postDate = new Date()

		# 暂时默认为已核准
		doc.status = db.cms_posts.config.STATUS_APPROVED
		doc.author = userId
		user = db.users.findOne({_id: userId})
		if user
			doc.author_name = user.name
		if doc.body
			doc.summary = doc.body.substring(0, 400)

		# pick images from attachments 
		if doc and doc.attachments
			doc.attachments = _.compact(doc.attachments)
			atts = cfs.posts.find({_id: {$in: doc.attachments}}).fetch()
			doc.images = []
			_.each atts, (att)->
				if att.isImage()
					doc.images.push att._id


	db.cms_posts.after.insert (userId, doc) ->
		# update cfs meta
		if doc and doc.attachments
			cfs.posts.update {_id: {$in: doc.attachments}}, {
				$set: 
					site: doc.site
					post: doc._id
			}, {multi: true}
			cfs.posts.remove {post: doc._id, _id: {$not: {$in: doc.attachments}}}

		members = CMS.getPostMembers doc
		siteId = doc.site
		postId = doc._id

		if members.length
			created = new Date()
			# 批量插入数据需要调用mongo的initializeUnorderedBulkOp函数优化性能
			bulk = db.cms_unreads.rawCollection().initializeUnorderedBulkOp()
			members.forEach (member)->
				bulk.insert
					user: member
					site: siteId
					post: postId
					created: created
			bulk.execute()

	db.cms_posts.before.update (userId, doc, fieldNames, modifier, options) ->
		if !userId
			throw new Meteor.Error(400, "cms_error_login_required")


		modifier.$set = modifier.$set || {};

		modifier.$set.modified_by = userId;
		modifier.$set.modified = new Date();

		# pick images from attachments 
		if modifier.$set.attachments
			modifier.$set.attachments = _.compact(modifier.$set.attachments)
			atts = cfs.posts.find({_id: {$in: modifier.$set.attachments}}).fetch()
			modifier.$set.images = []
			_.each atts, (att)->
				if att.isImage()
					modifier.$set.images.push att._id

		if modifier.$set.body 
			modifier.$set.summary = modifier.$set.body.substring(0, 400)


		oldVisibilityPrivate = doc.visibility == "private"
		newVisibilityPrivate = modifier.$set.visibility == "private"
		if oldVisibilityPrivate != newVisibilityPrivate
			isVisibilityPrivateChanged = true
		unless isVisibilityPrivateChanged
			oldMembersOrganizations = doc.members?.organizations
			oldMembersUsers = doc.members?.users
			newMembersOrganizations = modifier.$set["members.organizations"]
			newMembersUsers = modifier.$set["members.users"]

			if (!newMembersUsers) && (!newMembersOrganizations)
				throw new Meteor.Error(400, "cms_error_required_members_value")
			if newMembersOrganizations?.length != oldMembersOrganizations?.length
				isMembersChanged = true
			if !isMembersChanged and newMembersUsers?.length != oldMembersUsers?.length
				isMembersChanged = true
			if !isMembersChanged and newMembersOrganizations?.sort().join(",") != oldMembersOrganizations?.sort().join(",")
				isMembersChanged = true
			if !isMembersChanged and newMembersUsers?.sort().join(",") != oldMembersUsers?.sort().join(",")
				isMembersChanged = true

		if isVisibilityPrivateChanged || isMembersChanged
			oldMembers = CMS.getPostMembers doc
			newMembers = CMS.getPostMembers modifier.$set,true

			addMembers = _.difference newMembers,oldMembers
			subMembers = _.difference oldMembers,newMembers

			siteId = doc.site
			postId = doc._id

			if addMembers.length
				created = new Date()
				# 批量插入数据需要调用mongo的initializeUnorderedBulkOp函数优化性能
				addBulk = db.cms_unreads.rawCollection().initializeUnorderedBulkOp()
				addMembers.forEach (member)->
					addBulk.insert
						user: member
						site: siteId
						post: postId
						created: created
				addBulk.execute()
			
			if subMembers.length
				created = new Date()
				# 批量插入数据需要调用mongo的initializeUnorderedBulkOp函数优化性能
				subBulk = db.cms_unreads.rawCollection().initializeUnorderedBulkOp()
				subBulk.find({post:postId,user:{$in:subMembers}}).remove()
				subBulk.execute()

	db.cms_posts.after.update (userId, doc, fieldNames, modifier, options) ->
		self = this
		modifier.$set = modifier.$set || {}


		# update cfs meta
		if modifier.$set and modifier.$set.attachments
			cfs.posts.update {_id: {$in: modifier.$set.attachments}}, {
				$set: 
					site: doc.site
					post: doc._id
			}, {multi: true}
			cfs.posts.remove {post: doc._id, _id: {$not: {$in: modifier.$set.attachments}}}


	db.cms_posts.before.remove (userId, doc) ->
		if !userId
			throw new Meteor.Error(400, "cms_error_login_required")

		db.cms_reads.remove({post:doc._id})
		db.cms_unreads.remove({post:doc._id})

if Meteor.isServer
	db.cms_posts._ensureIndex({
		"site": 1,
		"tags": 1
	},{background: true})

	db.cms_posts._ensureIndex({
		"site": 1,
		"category": 1
	},{background: true})

	db.cms_posts._ensureIndex({
		"site": 1
	},{background: true})

	db.cms_posts._ensureIndex({
		"category": 1
	},{background: true})