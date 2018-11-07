import { Mongo } from 'meteor/mongo'       

// Revert change from Meteor 1.6.1 who set ignoreUndefined: true
// more information https://github.com/meteor/meteor/pull/9444
if (Meteor.isServer) {

	let mongoOptions = {
		ignoreUndefined: false,
	};

	const mongoOptionStr = process.env.MONGO_OPTIONS;
	if (typeof mongoOptionStr !== 'undefined') {
		const jsonMongoOptions = JSON.parse(mongoOptionStr);

		mongoOptions = Object.assign({}, mongoOptions, jsonMongoOptions);
	}

	Mongo.setConnectionOptions(mongoOptions);
}


Meteor.autorun = Tracker.autorun

if (Meteor.isServer) {
	Meteor.startup(function(){
		Accounts._bcryptRounds = function () {		return Accounts._options.bcryptRounds || 10; }
	})
}