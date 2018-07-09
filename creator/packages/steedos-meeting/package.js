Package.describe({
	name: 'steedos:meeting',
	version: '0.0.1',
	summary: 'meeting',
	git: '',
	documentation: null
});

Package.onUse(function(api) {
	api.use('coffeescript@1.11.1_4');
    api.use('steedos:creator@0.0.4');
    api.addFiles('meeting-app.coffee');
    api.addFiles('models/meeting.coffee');
	api.addFiles('models/meetingroom.coffee');
})