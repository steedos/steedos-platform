Package.describe({
  name: 'steedos:theme',
  version: '0.0.30',
  summary: 'Steedos Theme',
  git: 'https://github.com/steedos/apps/packages/steedos-theme'
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@1.3');

  api.use('coffeescript');
  api.use('ecmascript');
  api.use('blaze-html-templates');

  api.use('flemay:less-autoprefixer@1.2.0');
  api.addFiles("client/lib/weui.css", "client");
  api.addFiles([
    'client/core.less',
    'client/bootstrap.less',
    'client/admin-lte.less',   
    'client/sidebar.less',
    'client/sidebar-light.less',
    'client/style.less',
    'client/sweetalert.less',
    'client/status.less',
    'client/jstree.less',
    'client/weui.css',
    'client/weui.less'
  ], "client");

  
});

Package.onTest(function(api) {

});