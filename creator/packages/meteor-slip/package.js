Package.describe({
  name: 'steedos:slipjs',
  summary: 'UI library for manipulating lists via swipe and drag gestures',
  version: '2.1.0',
  git: 'https://github.com/pornel/slip'
});

Package.onUse(function(api) {

  api.addFiles([
    'src/slip.js',
  ], 'client');

  api.addFiles([
    'src/slip.css',
  ], 'client');

});
