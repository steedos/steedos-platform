Package.describe({
    name: 'risul:moment-timezone',
    summary: 'Timezone support for moment.js, packaged for Meteor',
    version: '0.5.7',
    git: 'https://github.com/risul/meteor-moment-timezone'
});

Package.on_use(function (api) {
    api.use('momentjs:moment@2.15.1');
    api.imply('momentjs:moment');

    api.addFiles([
        'pre.js',
        'lib/moment-timezone-with-data.js',
        'post.js'
    ], ['client', 'server']);
});