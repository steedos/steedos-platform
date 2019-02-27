import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';
checkNpmVersions({
	"connect": "3.6.6",
	"connect-route": "0.1.5",
	"qs": "6.6.0",
	"body-parser": "1.18.3"
}, 'simple:json-routes');
