if Meteor.isServer

	APPS_CORE = 
		workflow:
			_id: "workflow"
			url: "/workflow"
			name: "Steedos Workflow"
			icon: "ion-ios-list-outline"
			internal: true
			menu: true
			mobile: true
			sort: 100
		cms: 
			_id: "cms"
			url: "/cms"
			name: "Steedos CMS"
			icon: "ion-ios-book-outline"
			menu: true
			mobile: true
			internal: true
			sort: 200
		calendar:
			_id: "calendar"
			url: "/calendar"
			name: "Steedos Calendar"
			icon: "ion-ios-calendar-outline"
			menu: true
			mobile: true
			sort: 300
		# designer:
		# 	_id: "designer"
		# 	url: "/applications/designer"
		# 	name: "Flow Designer"
		# 	icon: "ion-ios-shuffle"
		# 	menu: false
		# 	sort: 9900
		admin:
			_id: "admin"
			url: "/admin"
			name: "Steedos Admin"
			icon: "ion-ios-gear-outline"
			internal: true
			menu: true
			mobile: true
			sort: 10000

	APPS_EXTERNAL = 
		drive: 
			_id: "drive"
			url: "/drive"
			name: "Steedos Drive"
			secret: "8762-fcb369b2e85"
			icon: "ion-ios-folder-outline"
			menu: true
			mobile: true
			sort: 400
		calendar: 
			_id: "calendar"
			url: "/drive/index.php/apps/calendar/"
			name: "Steedos Calendar"
			secret: "8762-fcb369b2e85"
			icon: "ion-ios-calendar-outline"
			menu: true
			mobile: true
			sort: 500
		mail:
			_id: "mail"
			url: "https://mail.steedos.com"
			name: "Steedos Mail"
			icon: "ion-ios-email-outline"
			menu: true
			sort: 600


	Meteor.methods
		core_apps_init: ()->
			_.each APPS_CORE, (v, k)->
				if db.apps.findOne(k)
					db.apps.update({_id: k}, {$set: v})
				else
					db.apps.insert(v)

		external_apps_init: ()->
			_.each APPS_EXTERNAL, (v, k)->
				if db.apps.findOne(k)
					db.apps.update({_id: k}, {$set: v})
				else
					db.apps.insert(v)

	Meteor.startup ->
		if db.apps.find().count() == 0
			Meteor.call "core_apps_init"