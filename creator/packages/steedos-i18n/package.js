Package.describe({
  name: 'steedos:i18n',
  version: '0.0.13',
  summary: 'i18n for Steedos',
  git: 'https://github.com/steedos/framework/packages/steedos-i18n'
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@1.3');

  api.use('coffeescript');
  api.use('blaze-html-templates');
  api.use('underscore');
  api.use('reactive-var');
  api.use('tracker');
  api.use('templating', 'client');

  api.use('tap:i18n@1.8.2');
  api.use('universe:i18n@1.13.0');
  tapi18nFiles = ['i18n/en.i18n.json', 'i18n/zh-CN.i18n.json'];
  api.addFiles(tapi18nFiles, ['client', 'server']);

});

Package.onTest(function(api) {

});