db.cms_comments = new Meteor.Collection('cms_comments')

db.cms_comments._simpleSchema = new SimpleSchema
	site: 
		type: String,
		autoform: 
			type: "hidden",
			defaultValue: ->
				return Session.get("siteId");
	# The post's `_id`
	post: 
		type: String,
		optional: true,
		max: 500,
		autoform: 
			omit: true
	
	created: 
		type: Date,
		optional: true

	postDate: 
		type: Date,
		optional: true

	body: 
		type: String,
		max: 3000,
		autoform: 
			rows: 5,
			afFormGroup:
				'formgroup-class': 'hide-label'
		 
	# The HTML version of the comment body
	htmlBody: 
		type: String,
		optional: true

	# The comment's base score (doesn't factor in comment age)
	baseScore: 
		type: Number,
		decimal: true,
		optional: true

	# The comment's current score (factors in comment age)
	score: 
		type: Number,
		decimal: true,
		optional: true
	
	# The number of upvotes the comment has received
	upvotes: 
		type: Number,
		optional: true
	
	#  An array containing the `_id`s of upvoters
	upvoters: 
		type: [String],
		optional: true
	
	# The number of downvotes the comment has received
	downvotes: 
		type: Number,
		optional: true
	
	# An array containing the `_id`s of downvoters
	downvoters: 
		type: [String],
		optional: true

	# The comment author's name
	author_name: 
		type: String,
		optional: true

	# The comment author's `_id`
	author: 
		type: String,
		optional: true

	# Whether the comment is inactive. Inactive comments' scores gets recalculated less often
	inactive: 
		type: Boolean,
		optional: true
	
	# Whether the comment is deleted. Delete comments' content doesn't appear on the site. 
	is_deleted: 
		type: Boolean,
		optional: true


if Meteor.isClient
	db.cms_comments._simpleSchema.i18n("cms_comments")

db.cms_comments.attachSchema(db.cms_comments._simpleSchema)

