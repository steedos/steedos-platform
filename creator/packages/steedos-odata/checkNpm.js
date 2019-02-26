// fix warning: xxx not installed
require("basic-auth/package.json");

import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';
checkNpmVersions({
	'basic-auth': '2.0.x',
	'odata-v4-service-metadata': "0.1.x",
	"odata-v4-service-document": "0.0.x",
	'odata-v4-mongodb': "0.1.x"
}, 'steedos:odata');
