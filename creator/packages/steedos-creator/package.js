Package.describe({
    name: 'steedos:creator',
    version: '0.0.1',
    summary: 'Steedos Creator',
    git: ''
});

Npm.depends({
    'icalendar': '0.7.1',
    'ical.js': '1.2.2',
    'MD5': '1.3.0',
    'moment-timezone': '0.5.13',
    busboy: "0.2.13",
    mkdirp: "0.3.5"
});

Package.onUse(function(api) {
    api.versionsFrom('1.0');

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
    api.use('blaze@2.1.9');
    api.use('templating@1.2.15');
    // api.use('modules');  //此package 不能移除，否则会导致eval执行异常
    api.use('flemay:less-autoprefixer@1.2.0');
    api.use('simple:json-routes@2.1.0');
    api.use('nimble:restivus@0.8.7');
    api.use('aldeed:simple-schema@1.3.3');
    api.use('aldeed:schema-index@1.1.1');
    api.use('aldeed:collection2@2.5.0');
    api.use('aldeed:tabular@1.6.1');
	api.use('meteorhacks:unblock@1.1.0');
    api.use('aldeed:autoform@5.8.0');
    api.use('matb33:collection-hooks@0.8.1');

    api.use('kadira:blaze-layout@2.3.0');
    api.use('kadira:flow-router@2.10.1');

    api.use('aldeed:autoform-bs-datetimepicker');
    api.use('tsega:bootstrap3-datetimepicker@=3.1.3_3');
    api.use('steedos:autoform-bs-minicolors@1.0.0');

    api.use('meteorhacks:ssr@2.2.0');
    api.use('tap:i18n@1.7.0');
    api.use('meteorhacks:subs-manager@1.6.4');

    api.use(['webapp@1.3.11'], 'server');

    api.use('momentjs:moment@2.14.1', 'client');


    api.use('es5-shim@4.6.15');
    api.use('simple:json-routes@2.1.0');
    api.use('steedos:fullcalendar@3.4.0_1');
	api.use('steedos:autoform-lookup@0.3.10');

    api.use('natestrauser:select2');
    api.use('aldeed:autoform-select2');

    api.use('steedos:cfs-standard-packages');
    api.use('steedos:cfs-s3');    
    api.use('steedos:cfs-aliyun');
    api.use('steedos:autoform-file');


    api.use('steedos:sso@0.0.4');
    api.use('steedos:adminlte@2.3.12_3');
    api.use('steedos:base');
    api.use('steedos:accounts@0.0.27');
    api.use('steedos:theme@0.0.29');
    api.use('steedos:i18n@0.0.11');
    api.use('steedos:autoform@0.0.1');
    api.use('steedos:autoform-modals@0.3.9_6');
    api.use('raix:push@3.0.2');

    // api.use('steedos:autoform-bs-datetimepicker');

    api.use('steedos:lightning-design-system@0.0.1');
    api.use('steedos:datatables-extensions');

    api.use('tap:i18n@1.7.0');
    
    tapi18nFiles = ['i18n/en.i18n.json', 'i18n/zh-CN.i18n.json']
    api.addFiles(tapi18nFiles, ['client', 'server']);


    api.addFiles('core.coffee');

    api.addFiles('lib/object.coffee');
    api.addFiles('lib/fields.coffee');
    api.addFiles('lib/triggers.coffee');
    api.addFiles('lib/actions.coffee');
    api.addFiles('lib/permission_sets.coffee');
    api.addFiles('lib/listviews.coffee');
    api.addFiles('lib/apps.coffee');
    api.addFiles('lib/eval.js');
	api.addFiles('lib/formula_engine.coffee');

    api.addFiles('models/base.coffee');
    api.addFiles('models/object.coffee');
    api.addFiles('models/object_recent_viewed.coffee');
    api.addFiles('models/object_listviews.coffee');
    api.addFiles('models/permission_set.coffee');
    api.addFiles('models/permission_objects.coffee');
    api.addFiles('models/permission_fields.coffee');

    api.addFiles('models/app.coffee');
    api.addFiles('models/space.coffee');
    api.addFiles('models/user.coffee');
    api.addFiles('models/organization.coffee');
    api.addFiles('models/space_user.coffee');
    
    api.addFiles('models/cms_files.coffee');
    api.addFiles('models/cms_files_cfs.coffee');
    api.addFiles('models/cfs_files.coffee');

    api.addFiles('models/reports.coffee');
    api.addFiles('models/tasks.coffee');

    api.addFiles('server/methods/object_options.coffee', 'server');
    api.addFiles('server/methods/object_permissions.coffee', 'server');
    api.addFiles('server/methods/object_recent_viewed.coffee', 'server');
    api.addFiles('server/methods/object_recent_record.coffee', 'server');
    api.addFiles('server/methods/report_data.coffee', 'server');

    api.addFiles('server/publications/object.coffee', 'server');
    api.addFiles('server/publications/related_object.coffee', 'server');
    api.addFiles('server/publications/object_tabular.coffee', 'server');

    api.addFiles('server/routes/s3.coffee', 'server');

    api.addFiles('client/layout/layout.html', 'client');
    api.addFiles('client/layout/layout.less', 'client');
    api.addFiles('client/layout/layout.coffee', 'client');
	api.addFiles('client/layout/header_search.html', 'client');
	api.addFiles('client/layout/header_search.less', 'client');
	api.addFiles('client/layout/header_search.coffee', 'client');
    api.addFiles('client/layout/header.html', 'client');
    api.addFiles('client/layout/navigation.html', 'client');
    api.addFiles('client/layout/navigation.coffee', 'client');
    api.addFiles('client/layout/sidebar.html', 'client');
    api.addFiles('client/layout/sidebar.coffee', 'client');
    api.addFiles('client/layout/sidebar.less', 'client');

    api.addFiles('client/layout/creator_app_list_modal.html', 'client');
    api.addFiles('client/layout/creator_app_list_modal.coffee', 'client');
    api.addFiles('client/layout/creator_app_list_modal.less', 'client');

    api.addFiles('client/core.coffee', 'client');
    api.addFiles('client/router.coffee', 'client');
    api.addFiles('client/subscribe.coffee', 'client');

    api.addFiles('client/colResizable-1.6.js', 'client');
    api.addFiles('client/jquery.ba-resize.js', 'client');

    api.addFiles('client/views/_helpers.coffee', 'client');
    api.addFiles('client/views/list.html', 'client');
    api.addFiles('client/views/list.coffee', 'client');
    api.addFiles('client/views/list.less', 'client');
    api.addFiles('client/views/view.html', 'client');
    api.addFiles('client/views/view.coffee', 'client');
    api.addFiles('client/views/view.less', 'client');
    api.addFiles('client/views/app_home.html', 'client');

    api.addFiles('client/views/report.html', 'client');
    api.addFiles('client/views/report.coffee', 'client');
    api.addFiles('client/views/report.less', 'client');

    api.addFiles('client/views/table_cell.html', 'client');
    api.addFiles('client/views/table_cell.coffee', 'client');
	api.addFiles('client/views/table_cell.less', 'client');
    api.addFiles('client/views/table_actions.html', 'client');
    api.addFiles('client/views/table_actions.coffee', 'client');
    api.addFiles('client/views/table_actions.less', 'client');
    api.addFiles('client/views/table_checkbox.html', 'client');
    api.addFiles('client/views/table_checkbox.coffee', 'client');
    api.addFiles('client/views/table_checkbox.less', 'client');
});