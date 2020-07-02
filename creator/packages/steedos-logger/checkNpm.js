// fix warning: xxx not installed
require("chalk/package.json");

import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';
checkNpmVersions({
	'chalk': '^2.4.2'
}, 'steedos:logger');