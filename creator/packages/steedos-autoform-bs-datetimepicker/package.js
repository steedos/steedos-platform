Package.describe({
  name: 'steedos:autoform-bs-datetimepicker',
  summary: 'Custom bootstrap-datetimepicker input type with timezone support for AutoForm',
  version: '1.0.6',
  git: 'https://github.com/aldeed/meteor-autoform-bs-datetimepicker.git'
});

Package.onUse(function(api) {
  api.use('templating@1.0.0');
  api.use('blaze@2.0.0');
  api.use('aldeed:autoform@4.0.0 || 5.0.0');

  // Ensure momentjs packages load before this one if used
  api.use('momentjs:moment@2.8.4', 'client', {weak: true});
  api.use('mrt:moment-timezone@0.2.1', 'client', {weak: true});

  api.addFiles([
    'autoform-bs-datetimepicker.html',
    'autoform-bs-datetimepicker.js'
  ], 'client');
});
