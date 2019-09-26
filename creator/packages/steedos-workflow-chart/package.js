Package.describe({
	name: 'steedos:workflow-chart',
	version: '0.0.1',
	summary: 'Steedos workflow chart for instance,flowversion...',
	git: ''
});


Package.onUse(function(api) { 
	api.versionsFrom("1.2.1");

	api.use('coffeescript');

	api.use('simple:json-routes@2.1.0');
	api.use('steedos:workflow');


	api.addFiles('core.coffee');

	api.addFiles('routes/chart.coffee', 'server');

	api.addAssets("assets/mermaid/dist/mermaid.css", "client");
	api.addAssets("assets/mermaid/dist/mermaid.dark.css", "client");
	api.addAssets("assets/mermaid/dist/mermaid.forest.css", "client");
	api.addAssets("assets/mermaid/dist/mermaid.min.js", "client");

	api.addAssets("assets/index.html", "client");
    api.addAssets("assets/index.js", "client");
    api.addAssets("assets/index.css", "client");
});

Package.onTest(function(api) {

});
