Package.describe({
	name: 'steedos:vip-card',
	version: '0.0.1',
	summary: 'vip card',
	git: '',
	documentation: null
});

Package.onUse(function(api) {

	api.use('coffeescript@1.11.1_4');
	api.use('steedos:creator@0.0.4');
	api.addFiles('qhd_information_app.coffee');
    api.addFiles('models/vip_card.coffee');
    api.addFiles('models/vip_billing.coffee');
    api.addFiles('models/vip_points.coffee');
    api.addFiles('models/vip_store.coffee');
})