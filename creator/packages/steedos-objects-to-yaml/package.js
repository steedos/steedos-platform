Package.describe({
    name: 'steedos:objects-to-yaml',
    version: '0.0.1',
    summary: 'convert creator objects to yaml file.',
    git: ''
});

Package.onUse(function (api) {

    api.use('ecmascript');
    api.use('coffeescript@1.11.1_4');
    api.use('underscore@1.0.10');

    api.addFiles('checkNpm.js', 'server');

    api.addFiles('yaml.coffee', 'server');
})