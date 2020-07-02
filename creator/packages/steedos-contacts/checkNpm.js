import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';
checkNpmVersions({
	cookies: "^0.6.2",
	'vcf':'^1.1.2',
	ejs: "^2.5.5",
	"ejs-lint": "^0.2.0"
}, 'steedos:contacts');