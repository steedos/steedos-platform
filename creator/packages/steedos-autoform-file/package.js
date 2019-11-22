Package.describe({
  name: "steedos:autoform-file",
  summary: "File upload for AutoForm",
  description: "File upload for AutoForm",
  version: "0.4.2_3",
  git: "https://github.com/yogiben/autoform-file.git"
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@1.1');

  api.use([
    'check',
    'coffeescript',
    'underscore',
    'reactive-var',
    'templating',
    'less@1.0.0 || 2.5.1',
    'aldeed:autoform@5.5.1',
    'fortawesome:fontawesome@4.5.0',
    'steedos:cfs-ui@0.1.4',
    'mpowaga:jquery-fileupload@9.11.2'
  ]);

	api.use('universe:i18n');
  tapi18nFiles = ['i18n/en.i18n.json', 'i18n/zh-CN.i18n.json']
  api.addFiles(tapi18nFiles);

  api.addFiles('lib/client/autoform-file.html', 'client');
  api.addFiles('lib/client/autoform-file.less', 'client');
  api.addFiles('lib/client/autoform-file.coffee', 'client');
  api.addFiles('lib/server/publish.coffee', 'server');
});
