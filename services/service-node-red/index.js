"use strict";

const express = require('express');
const http = require('http');
const path = require('path');
var RED = require("node-red");

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
	name: "node-red",

	/**
	 * Settings
	 */
	settings: {
        port: 3100,
        disableEditor: false,
        credentialSecret: "3b905ca2dbb6921f3c98a21eeb0e3ef1bWs",
        httpAdminRoot:"/",
        httpNodeRoot: "/",
        httpRoot: '/',
        userDir: path.join(process.cwd(), "steedos-app", "main", "node-red"),
        flowFile: "flows.json",
        functionGlobalContext: {
        },    // enables global context
        editorTheme: {
            page: {
                title: "Steedos Flow Builder",
                // favicon: "/absolute/path/to/theme/icon",
                // css: "/absolute/path/to/custom/css/file",
                // scripts: [ "/absolute/path/to/custom/script/file", "/another/script/file"]
            },
            header: {
                title: "Steedos Flow Builder",
                image: "/images/logo.png", // or null to remove image
                url: "/" // optional url to make the header text/image a link to this url
            },
            projects: {
                enabled: false // Enable the projects feature
            }
        },
	},

	/**
	 * Dependencies
	 */
	dependencies: [],

	/**
	 * Actions
	 */
	actions: {

	},

	/**
	 * Events
	 */
	events: {

	},

	/**
	 * Methods
	 */
	methods: {

	},

	/**
	 * Service created lifecycle event handler
	 */
	created() {

	},

	/**
	 * Service started lifecycle event handler
	 */
	async started() {


        // Create an Express app
        this.app = express();

        // Add a simple route for static content served from 'public'
        // app.use("/",express.static("public"));

        // Create a server
        this.server = http.createServer(this.app);


        this.settings.functionGlobalContext = {
            broker: this.broker
        }

        // Initialise the runtime with a server and settings
        RED.init(this.server,this.settings);

        // Serve the editor UI from /red
        this.app.use(this.settings.httpAdminRoot, RED.httpAdmin);

        // Serve the http nodes UI from /api
        this.app.use(this.settings.httpNodeRoot, RED.httpNode);

        this.server.listen(this.settings.port);

        // Start the runtime
        await RED.start();

        this.logger.info(`Node Red Server is listening on port: ${this.settings.port}`)
	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {
        this.server.stop;
        this.logger.info(`Node Red Server stopped.`)
	}
};
