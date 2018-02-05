if Meteor.isDevelopment
	Creator.Objects.steedosUsersOrgs =
		name: "steedosUsersOrgs"
		label: "选人选组"
		icon: "forecasts"
		enable_api: false
		fields:
			name:
				label: "名称"
				type: "text"
				defaultValue: ""
				description: ""
				inlineHelpText: ""
				required: true
			user:
				label: "选人-单选"
				type: "lookup"
				reference_to: "users"
			users:
				label: "选人-多选"
				type: "lookup"
				reference_to: "users"
				multiple: true
			org:
				label: "选组-单选"
				type: "lookup"
				reference_to: "organizations"
			orgs:
				label: "选组-多选"
				type: "lookup"
				reference_to: "organizations"
				multiple: true


		list_views:
			default:
				columns: ["name", "user", "users", "org", "orgs"]
			recent:
				filter_scope: "space"
			all:
				filter_scope: "space"
				columns: ["name", "user", "users", "org", "orgs"]
			mine:
				filter_scope: "mine"