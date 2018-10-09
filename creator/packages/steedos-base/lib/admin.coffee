Selector = {}

# Filter data on server by space field
Selector.selectorCheckSpaceAdmin = (userId) ->
	if Meteor.isClient
		userId = Meteor.userId()
		unless userId
			return {_id: -1}
		if Steedos.isSpaceAdmin()
			return {space: Session.get("spaceId")}
		else
			return {_id: -1}

	if Meteor.isServer
		unless userId
			return {_id: -1}
		user = db.users.findOne(userId, {fields: {is_cloudadmin: 1}})
		if !user
			return {_id: -1}
		selector = {}
		if !user.is_cloudadmin
			spaces = db.spaces.find({admins:{$in:[userId]}}, {fields: {_id: 1}}).fetch()
			spaces = spaces.map (n) -> return n._id
			selector.space = {$in: spaces}
		return selector

# Filter data on server by space field
Selector.selectorCheckSpace = (userId) ->
	if Meteor.isClient
		userId = Meteor.userId()
		unless userId
			return {_id: -1}
		spaceId = Session.get("spaceId");
		if spaceId
			if db.space_users.findOne({user: userId,space: spaceId}, {fields: {_id: 1}})
				return {space: spaceId}
			else
				return {_id: -1}
		else
			return {_id: -1}

	if Meteor.isServer
		unless userId
			return {_id: -1}
		user = db.users.findOne(userId, {fields: {_id: 1}})
		if !user
			return {_id: -1}
		selector = {}
		space_users = db.space_users.find({user: userId}, {fields: {space: 1}}).fetch()
		spaces = []
		_.each space_users, (u)->
			spaces.push(u.space)
		selector.space = {$in: spaces}
		return selector

db.billing_pay_records.adminConfig =
	icon: "globe"
	color: "blue"
	tableColumns: [
		{name: "order_created()"},
		{name: "modules"},
		{name: "user_count"},
		{name: "end_date"},
		{name: "order_total_fee()"},
		{name: "order_paid()"}
	]
	extraFields: ["space", "created", "paid", "total_fee"]
	routerAdmin: "/admin"
	selector: (userId) ->
		if Meteor.isClient
			if Steedos.isSpaceAdmin()
				return {space: Session.get("spaceId"), paid: true}
			else
				return {_id: -1}

		if Meteor.isServer
			return {}
	showEditColumn: false
	showDelColumn: false
	disableAdd: true
	pageLength: 100
	order: [[0, "desc"]]

Meteor.startup ->
	@space_user_signs = db.space_user_signs
	@billing_pay_records = db.billing_pay_records
	AdminConfig?.collections_add
		space_user_signs: db.space_user_signs.adminConfig
		billing_pay_records: db.billing_pay_records.adminConfig