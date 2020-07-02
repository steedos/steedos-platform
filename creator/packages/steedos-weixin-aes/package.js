Package.describe({
	name: 'steedos:weixin-aes',
	version: '0.0.1',
	summary: 'Steedos weixin Decryption data',
	git: ''
});


Package.onUse(function(api) {
	api.versionsFrom("1.2.1");
	api.addFiles('WXBizDataCrypt.js', 'server');
});

Package.onTest(function(api) {

});
