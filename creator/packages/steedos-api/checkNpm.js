import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';
checkNpmVersions({
	'aliyun-sdk': '^1.9.2',
	busboy: "^0.2.13",
	cookies: "^0.6.2",
	'csv': "^5.1.2",
	'url': '^0.11.0',
	'request': '^2.81.0',
	'xinge': '^1.1.3',
	'huawei-push': '^0.0.6-0',
	'xiaomi-push': '^0.4.5'
}, 'steedos:api');