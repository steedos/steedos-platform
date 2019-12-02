import './notifications.html';
import { pluginComponentSelector, store } from '@steedos/react';


Template.notifications.helpers({
	Component: function(){
		return pluginComponentSelector(store.getState(), "Notifications", "steedos-default-header");
	}
});
