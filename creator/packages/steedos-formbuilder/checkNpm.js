// fix warning: xxx not installed
require("formBuilder/package.json");

import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';
checkNpmVersions({
	formBuilder: "3.1.x"
}, 'steedos:formbuilder');
