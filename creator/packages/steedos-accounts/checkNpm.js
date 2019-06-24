import {
	checkNpmVersions
} from 'meteor/tmeasday:check-npm-versions';
checkNpmVersions({
	cookies: "^0.6.2",
	phone: "^1.0.12",
	sha256: "^0.2.0"
}, 'steedos:creator');