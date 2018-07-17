Package.describe({
	name: 'steedos:vip-card',
	version: '0.0.1',
	summary: 'vip card',
	git: '',
	documentation: null
});

Package.onUse(function (api) {

	api.use('coffeescript@1.11.1_4');
	api.use('steedos:creator@0.0.4');
	api.addFiles('models/vip_card.coffee');
	api.addFiles('models/vip_points.coffee');
	api.addFiles('models/vip_store.coffee');
	api.addFiles('models/vip_order.coffee');
	api.addFiles('models/vip_card_rule.coffee');
	api.addFiles('models/vip_event.coffee');
	api.addFiles('models/vip_event_attendees.coffee');
	api.addFiles('models/vip_menu.coffee');
	api.addFiles('models/vip_portlet.coffee');
	api.addFiles('vip_app.coffee');
	api.addFiles('site_app.coffee');
	api.addFiles('models/vip_coupon.coffee');
	api.addFiles('models/vip_wifi.coffee');
	api.addFiles('models/vip_apps.coffee');
	api.addFiles('models/vip_address.coffee');
	api.addFiles('models/vip_invoice_info.coffee');
	api.addFiles('models/vip_product.coffee');
	api.addFiles('models/vip_product_category.coffee');
	api.addFiles('models/vip_share.coffee');
	api.addFiles('models/vip_share_gift.coffee');
	api.addFiles('models/vip_customers.coffee');
})