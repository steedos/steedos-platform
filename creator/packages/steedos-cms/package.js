Package.describe({
    name: 'steedos:cms',
    version: '0.0.8',
    summary: 'Steedos CMS',
    git: ''
});

Npm.depends({
    cookies: "0.6.1",
    mkdirp: "0.3.5"
});

Package.onUse(function(api) {
    api.versionsFrom("1.2.1");

    api.use('reactive-var');
    api.use('reactive-dict');
    api.use('coffeescript');
    api.use('random');
    api.use('ddp');
    api.use('check');
    api.use('ddp-rate-limiter');
    api.use('underscore');
    api.use('tracker');
    api.use('session');
    api.use('blaze');
    api.use('templating');
    api.use('webapp', 'server');

    api.use('flemay:less-autoprefixer@1.2.0');
    api.use('simple:json-routes@2.1.0');
    api.use('nimble:restivus@0.8.7');
    api.use('meteorhacks:unblock@1.1.0');
    api.use('aldeed:simple-schema@1.3.3');
    api.use('aldeed:collection2@2.5.0');
    api.use('aldeed:tabular@1.6.1');
    api.use('aldeed:autoform@5.8.0');
    api.use('matb33:collection-hooks@0.8.1');
    api.use('steedos:cfs-standard-packages@0.5.10');
    api.use('steedos:cfs-aliyun@0.1.0');
    api.use('steedos:cfs-s3@0.1.4');
    api.use('kadira:blaze-layout@2.3.0');
    api.use('kadira:flow-router@2.10.1');

    api.use('meteorhacks:ssr@2.2.0');
    api.use('steedos:base@0.0.73');
    // api.use('tap:i18n@1.7.0');
    api.use('meteorhacks:subs-manager@1.6.4');

    // api.use('iyyang:cfs-aliyun@0.1.0');
    // api.use('cfs:s3@0.1.3');

    api.use('summernote:summernote@0.8.1');
    api.use('mpowaga:autoform-summernote@0.4.3');

    api.use('steedos:autoform@0.0.7');
    api.use('steedos:autoform-modals@0.3.9_9');
    api.use('vazco:universe-selectize@0.1.22');
    api.use('steedos:autoform-file@0.4.2_1');
    api.use('perak:markdown@1.0.5');
    api.use('q42:autoform-markdown@1.0.0');

    //api.add_files("package-tap.i18n", ["client", "server"]);
	api.use('universe:i18n@1.13.0');
    tapi18nFiles = ['i18n/en.i18n.json', 'i18n/zh-CN.i18n.json'];
    api.addFiles(tapi18nFiles, ['client', 'server']);

    // api.addFiles('lib/core.coffee');
    // api.addFiles('lib/modals/categories.coffee');
    // api.addFiles('lib/modals/cfs_posts.coffee');
    // api.addFiles('lib/modals/comments.coffee');
    // api.addFiles('lib/modals/pages.coffee');
    // api.addFiles('lib/modals/posts.coffee');
    // api.addFiles('lib/modals/sites.coffee');
    // api.addFiles('lib/modals/tags.coffee');
    // api.addFiles('lib/modals/themes.coffee');
    // api.addFiles('lib/modals/reads.coffee');
    // api.addFiles('lib/modals/unreads.coffee');
    // api.addFiles('lib/admin.coffee');
    // api.addFiles('lib/tabular.coffee');

    // api.addFiles('client/views/_helpers.coffee', 'client');

    // api.addFiles('client/layout/master.html', 'client');
    // api.addFiles('client/layout/master.coffee', 'client');
    // api.addFiles('client/layout/master.less', 'client');
    // api.addFiles('client/layout/sidebar.html', 'client');
    // api.addFiles('client/layout/sidebar.coffee', 'client');
    // api.addFiles('client/layout/sidebar.less', 'client');

    // api.addFiles('client/views/home_mobile.html', 'client');
    // api.addFiles('client/views/home_mobile.coffee', 'client');
    // api.addFiles('client/views/home_mobile.less', 'client');
    // api.addFiles('client/views/home_post_list.html', 'client');
    // api.addFiles('client/views/home_post_list.coffee', 'client');
    // api.addFiles('client/views/home.html', 'client');
    // api.addFiles('client/views/home.coffee', 'client');
    // api.addFiles('client/views/home.less', 'client');
    // api.addFiles('client/views/site_tagged.html', 'client');
    // api.addFiles('client/views/site_tagged.coffee', 'client');
    // api.addFiles('client/views/main.html', 'client');
    // api.addFiles('client/views/main.coffee', 'client');
    // api.addFiles('client/views/main.less', 'client');
    // api.addFiles('client/views/list/post_list.html', 'client');
    // api.addFiles('client/views/list/post_list.coffee', 'client');
    // api.addFiles('client/views/list/post_list.less', 'client');
    // api.addFiles('client/views/post/post_buttons.html', 'client');
    // api.addFiles('client/views/post/post_buttons.coffee', 'client');
    // api.addFiles('client/views/post/post_detail.html', 'client');
    // api.addFiles('client/views/post/post_detail.coffee', 'client');
    // api.addFiles('client/views/post/post_detail.less', 'client');

    // api.addFiles('client/router.coffee', 'client');
    // api.addFiles('client/subscribe.coffee', 'client');

    // api.addFiles('server/methods/cms_init.coffee', 'server');
    // api.addFiles('server/methods/cms_site_build.coffee', 'server');
    // api.addFiles('server/methods/cms_post_add_viewers.coffee', 'server');
    // api.addFiles('server/methods/cms_find_organizations_name.coffee', 'server');

    // api.addFiles('server/publications/cfs_posts.coffee', 'server');
    // api.addFiles('server/publications/cms_categories.coffee', 'server');
    // api.addFiles('server/publications/cms_post.coffee', 'server');
    // api.addFiles('server/publications/cms_posts.coffee', 'server');
    // api.addFiles('server/publications/cms_sites.coffee', 'server');
    // api.addFiles('server/publications/cms_tags.coffee', 'server');
    // api.addFiles('server/publications/cms_themes.coffee', 'server');
    // api.addFiles('server/publications/cms_unreads.coffee', 'server');
    // api.addFiles('server/publications/cms_posts_home.coffee', 'server');
    // api.addFiles('server/publications/get_posts_members_names.coffee', 'server');

    api.addFiles('server/routes/site.coffee', 'server');
    api.addFiles('server/routes/avatar.coffee', 'server');
    // api.addFiles('server/routes/unread_posts.coffee', 'server');
    api.addAssets('themes/default.html', 'server');

    // // EXPORT 
    // api.export('CMS');
});

Package.onTest(function(api) {

});