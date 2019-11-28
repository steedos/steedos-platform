import './notifications.html';

Template.notifications.helpers({
	Component: function(){
		return ReactSteedos.pluginComponentSelector(ReactSteedos.store.getState(), "Notifications", "steedos-default-header");
	}
});
