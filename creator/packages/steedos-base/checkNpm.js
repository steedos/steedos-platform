import {
	checkNpmVersions
} from 'meteor/tmeasday:check-npm-versions';
checkNpmVersions({
	"node-schedule": "^1.3.1",
	"xml2js": "^0.4.19",
}, 'steedos:base');
