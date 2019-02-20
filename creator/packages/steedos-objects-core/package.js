Package.describe({
	name: 'steedos:objects-core',
	version: '0.0.8',
	summary: 'Creator core objects',
	git: '',
	documentation: null
});

Package.onUse(function(api) {
	api.versionsFrom('METEOR@1.3');
	
	api.use('ecmascript');
	api.use('reactive-var@1.0.10');
	api.use('reactive-dict@1.1.8');
	api.use('coffeescript@1.11.1_4');
	api.use('random@1.0.10');
	api.use('ddp@1.2.5');
	api.use('check@1.2.3');
	api.use('ddp-rate-limiter@1.0.5');
	api.use('underscore@1.0.10');
	api.use('tracker@1.1.0');
	api.use('session@1.1.6');
	api.use('templating@1.2.15');

	api.use('aldeed:simple-schema@1.3.3');
	api.use('steedos:cfs-standard-packages@0.5.10');
	api.use('steedos:cfs-s3@0.1.4');
	api.use('steedos:cfs-aliyun@0.1.0');
	api.use('momentjs:moment@2.14.1');
	api.use('tap:i18n@1.8.2');
	api.use('universe:i18n@1.13.0');
	
	api.use('steedos:objects@0.0.10');

	api.addFiles('i18n.coffee');

	api.addFiles('i18n/en.i18n.json');
	api.addFiles('i18n/zh-CN.i18n.json');
	
	api.addFiles('models/apps.coffee');
	api.addFiles('models/users.coffee');
	api.addFiles('models/spaces.coffee');
	api.addFiles('models/space_users.coffee');
	api.addFiles('models/organizations.coffee');
	api.addFiles('models/steedos_keyvalue.coffee');
	api.addFiles('models/audit_logs.coffee');
	api.addFiles('models/space_settings.coffee');
	api.addFiles('models/permission_set.coffee');
	api.addFiles('models/permission_objects.coffee');
	api.addFiles('models/permission_share.coffee');


	api.addFiles('models/object_recent_viewed.coffee');
	api.addFiles('models/object_listviews.coffee');

	api.addFiles('models/cms_files.coffee');

	api.addFiles('models/reports.coffee');
	api.addFiles('models/queue_import.coffee');
	api.addFiles('models/settings.coffee');
	// api.addFiles('models/user_star.coffee');

	api.addFiles('models/object_workflows.coffee');

	
	api.addFiles('cfs/cfs.coffee');
	api.addFiles('cfs/cfs_fix.coffee');
	api.addFiles('cfs/cms_files_cfs.coffee');
	api.addFiles('cfs/cfs_files.coffee');

	api.addFiles('cfs/cfs_images.coffee');
	api.addFiles('cfs/cfs_audios.coffee');
	api.addFiles('cfs/cfs_videos.coffee');
	api.addFiles('cfs/cfs_avatars.coffee');
	
});