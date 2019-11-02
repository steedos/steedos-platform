import './object_home.html';

Template.object_home.helpers({
	Component: function(){
		let object_name = Session.get("object_name")
		return ReactSteedos.pluginComponentSelector(ReactSteedos.store.getState(), "ObjectHome", object_name);
	}
});
