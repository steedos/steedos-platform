Package.describe({
	name: 'steedos:app-projects',
	version: '0.0.1',
	summary: 'Project App',
	git: '',
	documentation: null
});

Package.onUse(function(api) {

	api.use('coffeescript@1.11.1_4');
    api.use('steedos:objects@0.0.7');

    // app
    api.addFiles('issues-app.coffee', "server");
    
    // models 
    api.addFiles('models/projects.coffee');
    api.addFiles('models/project_issues.coffee');
    api.addFiles('models/project_tags.coffee');

})