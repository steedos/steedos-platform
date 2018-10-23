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

  //api.use('steedos:adminlte@2.3.12');

  api.addFiles("client/lib/weui.css", "client");

  api.addFiles([
    'client/core.coffee',
    'client/core.less',
    'client/bootstrap.less',
    'client/weui.less' , 
    'client/weui.css',
    'client/admin-lte.less',   
    'client/sidebar.less',
    'client/sidebar-light.less',
    'client/style.less',
    'client/zoom.less',
    'client/sweetalert.less',
    'client/status.less',
    'client/jstree.less'
  ], "client");

  api.addAssets("client/background/beach.jpg", "client");
  api.addAssets("client/background/books.jpg", "client");
  api.addAssets("client/background/birds.jpg", "client");
  api.addAssets("client/background/cloud.jpg", "client");
  api.addAssets("client/background/sea.jpg", "client");
  api.addAssets("client/background/flower.jpg", "client");
  api.addAssets("client/background/fish.jpg", "client");

  api.addAssets("client/images/icon.png", "client");
  api.addAssets("client/images/icon_en.png", "client");
  api.addAssets("client/images/icon_blue.png", "client");
  api.addAssets("client/images/logo.png", "client");
  api.addAssets("client/images/logo_en.png", "client");
  api.addAssets("client/images/logo_login_custome.png", "client");
  api.addAssets("client/images/logo_main_custome.png", "client");
  
  api.export('Theme');

});

Package.onTest(function(api) {

});