Package.describe({
  name: 'simple:json-routes',
  version: '2.1.0',

  // Brief, one-line summary of the package.
  summary: 'The simplest way to define server-side routes that return JSON',

  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/stubailo/meteor-rest',

  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md',
});

Npm.depends({
  connect: '2.30.2',
  'connect-route': '0.1.5',
});

Package.onUse(function (api) {
  api.versionsFrom('1.0');

  api.use([
    'underscore',
    'webapp',
  ], 'server');

  api.addFiles([
    'json-routes.js',
    'middleware.js',
  ], 'server');

  api.export([
    'JsonRoutes',
    'RestMiddleware',
  ], 'server');
});

Package.onTest(function (api) {
  api.use('tinytest');
  api.use('test-helpers');
  api.use('simple:json-routes');
  api.use('http');
  api.addFiles('json-routes-tests.js');
});
