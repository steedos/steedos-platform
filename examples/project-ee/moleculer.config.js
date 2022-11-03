"use strict";
const _ = require("lodash")

require('dotenv-flow').config(
	{
		path: process.cwd(),
		silent: true
	});

module.exports = {
	// Namespace of nodes to segment your nodes on the same network.
	namespace: "steedos",
	// Unique node identifier. Must be unique in a namespace.
	nodeID: 'repl',
	

	// Define transporter.
	// More info: https://moleculer.services/docs/0.14/networking.html
	// Note: During the development, you don't need to define it because all services will be loaded locally.
	// In production you can set it via `TRANSPORTER=nats://localhost:4222` environment variable.
	transporter: process.env.STEEDOS_TRANSPORTER
};
