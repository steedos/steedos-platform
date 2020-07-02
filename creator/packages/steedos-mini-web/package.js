Package.describe({
	name: 'steedos:mini-web',
	version: '0.0.1',
	summary: 'mini web',
	git: '',
	documentation: null
});

Npm.depends({
	"markdown-it": '8.4.1'
})

Package.onUse(function(api) {
	api.use('coffeescript@1.11.1_4');
	api.use('simple:json-routes@2.1.0');
	api.use('meteorhacks:ssr@2.2.0');

	api.use('tap:i18n@1.7.0');
	api.use('steedos:objects');

	api.addAssets('themes/casper/partials/icons/point.hbs', 'server');
	api.addAssets('themes/casper/partials/icons/weichat.hbs', 'server');
	api.addAssets('themes/casper/partials/icons/avatar.hbs', 'server');

	api.addAssets('themes/casper/default.hbs', 'server');
	api.addAssets('themes/casper/index.hbs', 'server');
	api.addAssets('themes/casper/post.hbs', 'server');
	api.addAssets('themes/casper/tag.hbs', 'server');

	api.addAssets('themes/casper/partials/floating-header.hbs', 'server');
	api.addAssets('themes/casper/partials/primary_tag.hbs', 'server');
	api.addAssets('themes/casper/partials/navigation.hbs', 'server');
	api.addAssets('themes/casper/partials/site-nav.hbs', 'server');
	api.addAssets('themes/casper/partials/post-card.hbs', 'server');
	api.addAssets('themes/casper/partials/byline-multiple.hbs', 'server');
	api.addAssets('themes/casper/partials/byline-single.hbs', 'server');

	api.addFiles('lib/webHelpers.coffee', 'server');
	api.addFiles('lib/globalSettings.coffee', 'server');
	api.addFiles('server/routes/view.coffee', 'server');

	api.addFiles('server/core.coffee', 'server');

})