# db.categories = new Meteor.Collection('categories')

# Creator.Objects.categories =
# 	name: "categories"
# 	icon: "metrics"
# 	label: "流程分类"
# 	fields:
# 		name:
# 			type: "text"
# 			label: "名称"

# 		sort_no:
# 			label: "排序号"
# 			type: "number"

# 		app:
# 			label: "所属应用"
# 			type: "lookup"
# 			reference_to: "apps"
# 			optionsFunction: ()->
# 				_options = []
# 				_.forEach Creator.Apps, (o, k)->
# 					_options.push {label: o.name, value: k, icon: o.icon_slds}
# 				return _options

# 	list_views:
# 		all:
# 			label: "所有"
# 			filter_scope: "space"
# 			columns: ["name", "sort_no", "app"]

# 	permission_set:
# 		user:
# 			allowCreate: false
# 			allowDelete: false
# 			allowEdit: false
# 			allowRead: true
# 			modifyAllRecords: false
# 			viewAllRecords: true
# 		admin:
# 			allowCreate: true
# 			allowDelete: true
# 			allowEdit: true
# 			allowRead: true
# 			modifyAllRecords: true
# 			viewAllRecords: true

# if Meteor.isServer

# 	db.categories.allow
# 		insert: (userId, event) ->
# 			return false

# 		update: (userId, event) ->
# 			if (!Steedos.isSpaceAdmin(event.space, userId))
# 				return false
# 			else
# 				return true

# 		remove: (userId, event) ->
# 			return false

# 	db.categories.before.insert (userId, doc) ->
# 		doc.created_by = userId;
# 		doc.created = new Date();
# #
# #		if (!Steedos.isSpaceAdmin(doc.space, userId))
# #			throw new Meteor.Error(400, "error_space_admins_only");

# 	db.categories.before.update (userId, doc, fieldNames, modifier, options) ->

# 		modifier.$set = modifier.$set || {};

# 		modifier.$set.modified_by = userId;
# 		modifier.$set.modified = new Date();
# #
# #		if (!Steedos.isSpaceAdmin(doc.space, userId))
# #			throw new Meteor.Error(400, "error_space_admins_only");

# 	db.categories.before.remove (userId, doc) ->
# 		if (!Steedos.isSpaceAdmin(doc.space, userId))
# 			throw new Meteor.Error(400, "error_space_admins_only");

# 		if db.forms.find({space: doc.space, category: doc._id}).count()>0
# 			throw new Meteor.Error(400, "categories_in_use")

# new Tabular.Table
# 	name: "Categories",
# 	collection: db.categories,
# 	columns: [
# 		{data: "name", title: "name", orderable: false},
# 		{data: "sort_no", title: "sort_no",orderable: false},
# 		{data: "sort_no", title: "sort_no", visible: false}
# 	]
# 	dom: "tp"
# 	order: [2, "desc"]
# 	extraFields: []
# 	lengthChange: false
# 	pageLength: 10
# 	info: false
# 	searching: true
# 	autoWidth: false
