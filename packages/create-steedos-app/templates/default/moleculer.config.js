require('dotenv-flow').config({});

// Moleculer Configuration
// https://moleculer.services/docs/0.14/configuration.html
module.exports = {
	// Namespace of nodes to segment your nodes on the same network.
	namespace: "steedos",
	// Default log level for built-in console logger. It can be overwritten in logger options above.
	// Available values: trace, debug, info, warn, error, fatal
	logLevel: "info",

    transporter: process.env.TRANSPORTER,

	// Called after broker started.
	started(broker) {
	},

};
