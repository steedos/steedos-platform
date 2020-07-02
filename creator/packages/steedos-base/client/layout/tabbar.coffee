Template.baseTabbar.helpers
	toggleIcon: (icon) ->
		if !icon
			return
		
		if icon == 'ion-ios-list-outline'
			return 'ion-ios-list'
		else if icon == 'ion-ios-keypad-outline'
			return 'ion-ios-keypad'
		else if icon == 'ion-ios-calendar-outline'
			return 'ion-ios-calendar'
		else if icon == 'ion-ios-gear-outline'
			return 'ion-ios-gear'
		else if icon == 'ion-ios-book-outline'
			return 'ion-ios-book'
		else if icon == 'ion-ios-email-outline'
			return 'ion-ios-email'
		else if icon == 'ion-ios-pie-outline'
			return 'ion-ios-pie'
		else if icon == 'ion-ios-people-outline'
			return 'ion-ios-people'
		else if icon == 'ion-ios-home-outline'
			return 'ion-ios-home'
		
		return icon

Template.baseTabbar.events
	'click .top-apps-item': (event,template) ->
		Steedos.openApp this._id