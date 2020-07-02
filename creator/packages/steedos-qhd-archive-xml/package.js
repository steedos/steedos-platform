Package.describe({
	name: 'steedos:qhd-archive-xml',
	version: '0.0.1',
	summary: 'Steedos xml',
	git: ''
});

Npm.depends({
	'express' :'4.13.4',
	'request'  : '2.81.0',
	'node-schedule' : '1.2.1',
	cookies: "0.6.1",
	mkdirp: "0.3.5",
	"xml2js": "0.4.19",
	'node-rsa': '1.0.0'
});

Package.onUse(function (api) {
	api.versionsFrom('1.0');
	api.use('reactive-var');
	api.use('reactive-dict');
	api.use('coffeescript');
	api.use('ddp');
	api.use('check');
	api.use('underscore');

	api.use(['webapp'], 'server');

	api.use('steedos:logger');

	api.use('steedos:creator');
	api.use('steedos:objects');

	api.use('steedos:app-workflow');
	// api.use('steedos:qhd-archive');

	// api.addFiles('server/lib/records_xml.coffee', 'server');
	api.addFiles('server/router.coffee', 'server');

	api.addFiles('server/lib/export_to_xml.coffee', 'server');
	
	api.addFiles('server/lib/records_xml_sync.coffee', 'server');

	api.addFiles('server/methods/start_exportxml.coffee', 'server');

	api.addFiles('client/methods/call_exportxml.coffee', 'client');	

	api.export('XMLSync');

	api.export('ExportToXML');

});

Package.onTest(function (api) {

});