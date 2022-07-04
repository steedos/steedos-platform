import {
	checkNpmVersions
} from 'meteor/tmeasday:check-npm-versions';
checkNpmVersions({
	busboy: "^0.2.13",
	"xml2js": "^0.4.19",
}, 'steedos:creator');

if (Meteor.settings && Meteor.settings.cfs && Meteor.settings.cfs.aliyun) {
	checkNpmVersions({
		"aliyun-sdk": "^1.11.12"
	}, 'steedos:creator');
}