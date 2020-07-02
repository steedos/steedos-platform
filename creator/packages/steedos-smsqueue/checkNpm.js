import {
	checkNpmVersions
} from 'meteor/tmeasday:check-npm-versions';

if (Meteor.settings && Meteor.settings.sms && Meteor.settings.sms.aliyun) {
	checkNpmVersions({
		"aliyun-sms-node": "^1.1.2"
	}, 'steedos:smsqueue');
}