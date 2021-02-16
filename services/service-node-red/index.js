"use strict";

const express = require('express');
const http = require('http');
const path = require('path');
const _ = require('lodash');
const RED = require("node-red");

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
	name: "node-red",

	/**
	 * Settings
	 */
	settings: {
        httpServer: null,
        app: null,
        port: 3100,
        disableEditor: false,
        credentialSecret: "3b905ca2dbb6921f3c98a21eeb0e3ef1bWs",
        httpAdminRoot:"/",
        httpNodeRoot: "/",
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
        this.RED = RED;
	},

	/**
	 * Service started lifecycle event handler
	 */
	async started() {
        this.logger.info(RED)

        if (this.settings.httpServer && this.settings.app) {
            this.app = this.settings.app;
            this.httpServer = this.settings.httpServer;
            this.port = null;
        } else {
            this.app = express();
            this.httpServer = http.createServer(this.app);
            this.port = this.settings.port;
        }

        this.settings.functionGlobalContext = {
            broker: this.broker
        }

        // Initialise the runtime with a server and settings
        this.RED.init(this.httpServer,this.settings);

        // Add a simple route for static content served from 'public'
        // app.use("/",express.static("public"));

        // Serve the editor UI from /red
        this.app.use(this.settings.httpAdminRoot, this.RED.httpAdmin);

        // Serve the http nodes UI from /api
        this.app.use(this.settings.httpNodeRoot, this.RED.httpNode);

        if (this.port) {
            this.httpServer.listen(this.port);
            this.logger.info(`Node Red Server is listening on port: ${this.settings.port}`)
        }

        // Start the runtime
        await this.RED.start();

	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {
        if (this.port) {
            this.httpServer.stop;
            this.logger.info(`Node Red Server stopped.`)
        }
	}
};
