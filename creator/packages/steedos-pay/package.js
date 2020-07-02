Package.describe({
    name: 'steedos:pay',
    version: '0.0.1',
    summary: 'pay',
    git: ''
});

Npm.depends({
    "xml2js": "0.4.17",
    "MD5": "1.2.1",
    "cookies": "0.6.1",
    "request": "2.87.0"
});

Package.onUse(function (api) {

    api.use('ecmascript');
    api.use('coffeescript@1.11.1_4');
    api.use('simple:json-routes@2.1.0');
    api.use('underscore@1.0.10');
    api.use('steedos:creator@0.0.4');
    api.use('steedos:vip-card@0.0.1');

    api.addFiles('models/billing_record.coffee');
    api.addFiles('server/lib/util.js', 'server');
    api.addFiles('server/lib/wxpay.js', 'server');
    api.addFiles('server/lib/pay_manager.coffee', 'server');
    api.addFiles('server/routes/api_steedos_weixin_card_recharge.coffee', 'server');
    api.addFiles('server/routes/api_steedos_weixin_card_recharge_notify.coffee', 'server');
    api.addFiles('server/routes/api_steedos_payway_balance.coffee', 'server');

    api.export(['payManager'], ['server']);
})