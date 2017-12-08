Package.describe({
	name: 'steedos:creator-i18n',
	version: '0.0.1',
	summary: 'Steedos Creator',
	git: '',
	documentation: null
});

Package.onUse(function(api) {

	api.use('tap:i18n@1.7.0');
	
	tapi18nFiles = ['i18n/en.i18n.json', 'i18n/zh-CN.i18n.json']
    api.addFiles(tapi18nFiles, ['client', 'server']);

});