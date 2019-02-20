import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';
checkNpmVersions({
	"node-schedule": "1.3.x",
	cookies: "0.6.x",
	"weixin-pay": "1.1.x",
	"xml2js": "0.4.x",
	mkdirp: "0.3.x",
	"sprintf-js": "1.1.2",
}, 'steedos:base');
