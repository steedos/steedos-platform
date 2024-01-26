// fix warning: xxx not installed
require("@steedos/form-builder/package.json");

import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';
checkNpmVersions({
	"@steedos/form-builder": "3.6.2-patch.1"
}, 'steedos:formbuilder');
