Package.describe({
  name: 'steedos:autoform-tags',
  summary: 'Tags input for aldeed:autoform',
  version: '0.3.0'
});

Package.onUse(function(api) {
  api.versionsFrom('1.3');

  api.use([
    'templating',
    'coffeescript',
    'reactive-var',
    'aldeed:autoform@5.6.0',
  ], 'client');

  api.addFiles([
    'lib/client/autoform-tags.html',
    'lib/client/autoform-tags.css',
    'lib/client/autoform-tags.coffee'
  ], 'client');
});
