import {
	checkNpmVersions
} from 'meteor/tmeasday:check-npm-versions';
checkNpmVersions({
	mkdirp: "^0.3.5",
	eval: ">=0.1.2",
}, 'steedos:app-workflow');