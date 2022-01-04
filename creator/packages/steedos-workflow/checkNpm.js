import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';
checkNpmVersions({
	"node-schedule": "^1.3.1",
	cookies: "^0.6.2",
	"xml2js": "^0.4.19",
	mkdirp: "^0.3.5",
	"ejs": "^2.5.5",
	"ejs-lint": "^0.2.0"
}, 'steedos:workflow');