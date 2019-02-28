import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';
checkNpmVersions({
	'socket.io': '^1.4.8',
	// 'socket.io-client': "^1.4.8"
}, 'steedos:app-chat');
