import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';
checkNpmVersions({
	"connect": "3.6.6",
	"connect-route": "^0.1.5",
	"fibers": "^3.1.1",
	"connect-query": "1.0.0",
	"body-parser": "1.18.3"
}, 'simple:json-routes');
