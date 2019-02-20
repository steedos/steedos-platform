import {
	checkNpmVersions
} from 'meteor/tmeasday:check-npm-versions';
checkNpmVersions({
			cookies: "0.6.x",
			mkdirp: "0.3.x",
}, 'steedos:app-workflow');