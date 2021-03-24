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
        port: 3100,
        disableEditor: false,
        credentialSecret: "3b905ca2dbb6921f3c98a21eeb0e3ef1bWs",
        httpAdminRoot:"/flows/",
        httpNodeRoot: "/flows/",
        userDir: path.join(process.cwd(), "node-red"),
        flowFile: "flows.json",
        flowFilePretty: true,
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
        if (typeof(WebApp) !== 'undefined')
            this.WebApp = WebApp;
	},

	/**
	 * Service started lifecycle event handler
	 */
	async started() {

        if (this.WebApp && !this.settings.port) {
            // 使用 meteor 内置 web 服务
            this.app = express();
            this.httpServer = this.WebApp.httpServer;
            this.WebApp.connectHandlers.use('/', this.app);
        } else {
            this.app = express();
            this.httpServer = http.createServer(this.app);
            this.httpServer.listen(this.settings.port);
            this.logger.info(`Node Red port: ${this.settings.port}`)
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

        if (this.WebApp && !this.settings.port) {
        }

        // Start the runtime
        await this.RED.start();


	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {
        if (this.WebApp && !this.settings.port) {
            this.httpServer.stop;
            this.logger.info(`Node Red Server stopped.`)
        }
	}
};
