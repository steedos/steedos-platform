import './object_home.html';
import { pluginComponentSelector, store } from '@steedos/react';

Template.object_home.helpers({
	Component: function(){
		let object_name = Session.get("object_name")
		return pluginComponentSelector(store.getState(), "ObjectHome", object_name);
	}
});
