import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';
checkNpmVersions({
	busboy: "0.2.x",
	mkdirp: "0.3.x",
	"xml2js": "0.4.x",
	"node-xlsx": "0.12.x",
	"aliyun-sdk": "1.11.x"
}, 'steedos:creator');
