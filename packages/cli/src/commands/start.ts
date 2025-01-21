const {Command, flags} = require('@oclif/command')
console.log('========>')
const path = require("path");
import {ServiceBroker, Utils as utils} from "moleculer";
import fs from "fs";
import glob from "glob";
import _ from "lodash";
import os from "os";
import cluster from "cluster";
import kleur from "kleur";
import { Start } from "../start";

const stopSignals = [
	"SIGHUP",
	"SIGINT",
	"SIGQUIT",
	"SIGILL",
	"SIGTRAP",
	"SIGABRT",
	"SIGBUS",
	"SIGFPE",
	"SIGUSR1",
	"SIGSEGV",
	"SIGUSR2",
	"SIGTERM"
];

/* eslint-disable no-console */

/**
 * Logger helper
 *
 */
const logger = {
	info(message) {
		console.log(kleur.grey("[Runner]"), kleur.green().bold(message));
	},
	error(err) {
		if (err instanceof Error)
			console.error(kleur.grey("[Runner]"), kleur.red().bold(err.message), err);
		else console.error(kleur.grey("[Runner]"), kleur.red().bold(err));
	}
};

class StartCommand extends Command {

	/**
	 * Load environment variables from '.env' file
	 */
   async loadEnvFile() {
		if (this.flags.env || this.flags.envfile) {
			try {
				const dotenv = await import("dotenv");

				if (this.flags.envfile) dotenv.config({ path: this.flags.envfile });
				else dotenv.config();
			} catch (err) {
				throw new Error(
					"The 'dotenv' package is missing! Please install it with 'npm install dotenv --save' command."
				);
			}
		}
	}

	/**
	 * Fix Uppercase drive letter issue on Windows. It causes problem on custom modules detection (XY instanceof Base)
	 * Unused currently, because it causes problem: https://github.com/moleculerjs/moleculer/issues/788
	 *
	 * More info: https://github.com/nodejs/node/issues/6978
	 * @param {String} s
	 * @returns {String}
	 */
	fixDriveLetterCase(s) {
		if (s && process.platform === "win32" && s.match(/^[A-Z]:/g)) {
			return s.charAt(0).toLowerCase() + s.slice(1);
		}
		return s;
	}

	/**
	 * Load configuration file
	 *
	 * Try to load a configuration file in order to:
	 *
	 *		- load file defined in MOLECULER_CONFIG env var
	 * 		- try to load file which is defined in CLI option with --config
	 * 		- try to load the `moleculer.config.js` file if exist in the cwd
	 * 		- try to load the `moleculer.config.json` file if exist in the cwd
	 */
	async loadConfigFile() {
		let filePath;
		// Env vars have priority over the flags
		if (process.env["MOLECULER_CONFIG"]) {
			filePath = path.isAbsolute(process.env["MOLECULER_CONFIG"])
				? process.env["MOLECULER_CONFIG"]
				: path.resolve(process.cwd(), process.env["MOLECULER_CONFIG"]);
		} else if (this.flags.config) {
			filePath = path.isAbsolute(this.flags.config)
				? this.flags.config
				: path.resolve(process.cwd(), this.flags.config);
			if(!fs.existsSync(filePath)){
				filePath = null;
			}
		}
		if (!filePath && fs.existsSync(path.resolve(process.cwd(), "moleculer.config.mjs"))) {
			filePath = path.resolve(process.cwd(), "moleculer.config.mjs");
		}
		if (!filePath && fs.existsSync(path.resolve(process.cwd(), "moleculer.config.js"))) {
			filePath = path.resolve(process.cwd(), "moleculer.config.js");
		}
		if (!filePath && fs.existsSync(path.resolve(process.cwd(), "moleculer.config.json"))) {
			filePath = path.resolve(process.cwd(), "moleculer.config.json");
		}
		if (filePath) {
			if (!fs.existsSync(filePath))
				return Promise.reject(new Error(`Config file not found: ${filePath}`));

			const ext = path.extname(filePath);
			switch (ext) {
				case ".json":
				case ".js":
				case ".mjs":
				case ".ts": {
					// const mod = await import(filePath.startsWith("/") ? filePath : "/" + filePath);
					let content = require(filePath);
					// let content = mod.default;

					if (utils.isFunction(content)) content = await content.call(this);

					this.configFile = await Start.mergeConfig(content) ;
					break;
				}
				default:
					return Promise.reject(new Error(`Not supported file extension: ${ext}`));
			}
		}

    return;
	}

	normalizeEnvValue(value) {
		if (value.toLowerCase() === "true" || value.toLowerCase() === "false") {
			// Convert to boolean
			value = value === "true";
		} else if (!isNaN(value)) {
			// Convert to number
			value = Number(value);
		}
		return value;
	}

	overwriteFromEnv(obj, prefix?) {
		Object.keys(obj).forEach(key => {
			const envName = ((prefix ? prefix + "_" : "") + key).toUpperCase();

			if (process.env[envName]) {
				obj[key] = this.normalizeEnvValue(process.env[envName]);
			}

			if (utils.isPlainObject(obj[key]))
				obj[key] = this.overwriteFromEnv(obj[key], (prefix ? prefix + "_" : "") + key);
		});

		// Process MOL_ env vars only the root level
		if (prefix == null) {
			const moleculerPrefix = "MOL_";
			Object.keys(process.env)
				.filter(key => key.startsWith(moleculerPrefix))
				.map(key => ({
					key,
					withoutPrefix: key.substring(moleculerPrefix.length)
				}))
				.forEach(variable => {
					const dotted = variable.withoutPrefix
						.split("__")
						.map(level => level.toLocaleLowerCase())
						.map(level =>
							level
								.split("_")
								.map((value, index) => {
									if (index == 0) {
										return value;
									} else {
										return value[0].toUpperCase() + value.substring(1);
									}
								})
								.join("")
						)
						.join(".");
					obj = utils.dotSet(
						obj,
						dotted,
						this.normalizeEnvValue(process.env[variable.key])
					);
				});
		}

		return obj;
	}

	/**
	 * Merge broker options
	 *
	 * Merge options from environment variables and config file. First
	 * load the config file if exists. After it overwrite the vars from
	 * the environment values.
	 *
	 * Example options:
	 *
	 * 	Original broker option: `logLevel`
	 *  Config file property: 	`logLevel`
	 *  Env variable:			`LOGLEVEL`
	 *
	 * 	Original broker option: `circuitBreaker.enabled`
	 *  Config file property: 	`circuitBreaker.enabled`
	 *  Env variable:			`CIRCUITBREAKER_ENABLED`
	 *
	 */
	mergeOptions() {
		this.config = _.defaultsDeep(this.configFile, ServiceBroker.defaultOptions);

		this.config = this.overwriteFromEnv(this.config);

		if (this.flags.silent) this.config.logger = false;

		// if (this.flags.hot) this.config.hotReload = true;

		if (this.flags.hot) this.config.steedosHotReload = true;

		// console.log("Merged configuration", this.config);
	}

	/**
	 * Check the given path whether directory or not
	 *
	 * @param {String} p
	 * @returns {Boolean}
	 */
	isDirectory(p) {
		try {
			return fs.lstatSync(p).isDirectory();
		} catch (_) {
			// ignore
		}
		return false;
	}

	/**
	 * Check the given path whether a file or not
	 *
	 * @param {String} p
	 * @returns {Boolean}
	 */
	isServiceFile(p) {
		try {
			return !fs.lstatSync(p).isDirectory();
		} catch (_) {
			// ignore
		}
		return false;
	}

	/**
	 * Load services from files or directories
	 *
	 * 1. If find `SERVICEDIR` env var and not find `SERVICES` env var, load all services from the `SERVICEDIR` directory
	 * 2. If find `SERVICEDIR` env var and `SERVICES` env var, load the specified services from the `SERVICEDIR` directory
	 * 3. If not find `SERVICEDIR` env var but find `SERVICES` env var, load the specified services from the current directory
	 * 4. check the CLI arguments. If it find filename(s), load it/them
	 * 5. If find directory(ies), load it/them
	 *
	 * Please note: you can use shorthand names for `SERVICES` env var.
	 * 	E.g.
	 * 		SERVICES=posts,users
	 *
	 * 		It will be load the `posts.service.js` and `users.service.js` files
	 *
	 *
	 */
	async loadServices() {
		this.watchFolders.length = 0;
		const fileMask = this.flags.mask || "**/*.service.js";

		const serviceDir = process.env.SERVICEDIR || "";
		const svcDir = path.isAbsolute(serviceDir)
			? serviceDir
			: path.resolve(process.cwd(), serviceDir);

		let patterns = this.servicePaths;

		if (process.env.SERVICES || process.env.SERVICEDIR) {
			if (this.isDirectory(svcDir) && !process.env.SERVICES) {
				// Load all services from directory (from subfolders too)
				this.broker.loadServices(svcDir, fileMask);

				if (this.config.hotReload) {
					this.watchFolders.push(svcDir);
				}
			} else if (process.env.SERVICES) {
				// Load services from env list
				patterns = Array.isArray(process.env.SERVICES)
					? process.env.SERVICES
					: process.env.SERVICES.split(",");
			}
		}

		if (patterns.length > 0) {
			let serviceFiles:any[] = [];

			patterns
				.map(s => s.trim())
				.forEach(p => {
					const skipping = p[0] == "!";
					if (skipping) p = p.slice(1);
					if (p.startsWith("npm:")) {
						// Load NPM module
						this.loadNpmModule(p.slice(4));
					} else {
						let files;
						const svcPath = path.isAbsolute(p) ? p : path.resolve(svcDir, p);
						// Check is it a directory?
						if (this.isDirectory(svcPath)) {
							if (this.config.hotReload) {
								this.watchFolders.push(svcPath);
							}
							files = glob.sync(svcPath + "/" + fileMask, { absolute: true });
							if (files.length == 0)
								return this.broker.logger.warn(
									kleur
										.yellow()
										.bold(
											`There is no service files in directory: '${svcPath}'`
										)
								);
						} else if (this.isServiceFile(svcPath)) {
							files = [svcPath.replace(/\\/g, "/")];
						} else if (this.isServiceFile(svcPath + ".service.js")) {
							files = [svcPath.replace(/\\/g, "/") + ".service.js"];
						} else {
							// Load with glob
							files = glob.sync(p, { cwd: svcDir, absolute: true });
							if (files.length == 0)
								this.broker.logger.warn(
									kleur
										.yellow()
										.bold(`There is no matched file for pattern: '${p}'`)
								);
						}

						if (files && files.length > 0) {
							if (skipping)
								serviceFiles = serviceFiles.filter(f => files.indexOf(f) === -1);
							else serviceFiles.push(...files);
						}
					}
				});

			await Promise.all(_.uniq(serviceFiles).map(async f => {
				// const mod = await import(f.startsWith("/") ? f : "/" + f);
				// const content = mod.default;
				const content = require(f)

				const svc = this.broker.createService(content);
				svc.__filename = f;
			}));
		}
	}

	/**
	 * Start cluster workers
	 */
	startWorkers(instances) {
		let stopping = false;

		cluster.on("exit", function (worker, code) {
			if (!stopping) {
				// only restart the worker if the exit was by an error
				if (process.env.NODE_ENV === "production" && code !== 0) {
					logger.info(`The worker #${worker.id} has disconnected`);
					logger.info(`Worker #${worker.id} restarting...`);
					cluster.fork();
					logger.info(`Worker #${worker.id} restarted`);
				} else {
					process.exit(code);
				}
			}
		});

		const workerCount =
			Number.isInteger(instances) && instances > 0 ? instances : os.cpus().length;

		logger.info(`Starting ${workerCount} workers...`);

		for (let i = 0; i < workerCount; i++) {
			cluster.fork();
		}

		stopSignals.forEach(function (signal) {
			process.on(signal as any, () => {
				logger.info(`Got ${signal}, stopping workers...`);
				stopping = true;
				cluster.disconnect(function () {
					logger.info("All workers stopped, exiting.");
					process.exit(0);
				});
			});
		});
	}

	/**
	 * 如果有--hot, 则自动启动热更新服务
	 */
	async loadHotReloadService() {
		if (this.config.steedosHotReload) {
			const content = require('../start/hotReload');
			this.broker.createService(content);
		}
	}

	/**
	 * Load service from NPM module
	 *
	 * @param {String} name
	 * @returns {Service}
	 */
	loadNpmModule(name) {
		let svc = require(name);
		return this.broker.createService(svc);
	}

	/**
	 * Start Moleculer broker
	 */
	async startBroker() {
		this.worker = cluster.worker;

		if (this.worker) {
			Object.assign(this.config, {
				nodeID: (this.config.nodeID || utils.getNodeID()) + "-" + this.worker.id
			});
		}

		// Create service broker
		this.broker = new ServiceBroker(Object.assign({}, this.config));
		this.broker.runner = this;
		global.broker = this.broker;

		await this.loadServices();

		await this.loadHotReloadService();

		if (this.watchFolders.length > 0) this.broker.runner.folders = this.watchFolders;

		return this.broker.start().then(() => {
			if (this.flags.repl && (!this.worker || this.worker.id === 1)) this.broker.repl();

			return this.broker;
		});
	}

	/**
	 * Running
	 */
	_runMoleculer() {
		return Promise.resolve()
			// .then(() => this.loadEnvFile())
			.then(() => this.loadConfigFile())
			.then(() => this.mergeOptions())
			.then(() => this.startBroker())
			.catch(err => {
				logger.error(err);
				process.exit(1);
			});
	}

	restartBroker() {
		if (this.broker && this.broker.started) {
			return this.broker
				.stop()
				.catch(err => {
					logger.error("Error while stopping ServiceBroker.");
					logger.error(err);
				})
				.then(() => this._runMoleculer());
		} else {
			return this._runMoleculer();
		}
	}

  async run() {
    const { args, flags} = this.parse(StartCommand);

	this.watchFolders = [];
	this.flags = null;
	this.configFile = null;
	this.config = null;
	this.servicePaths = null;
	this.broker = null;
	this.worker = null;

    this.flags = flags;
    this.servicePaths = _.compact(Object.values(args))

    if (this.flags.instances !== undefined && cluster.isMaster) {
      this.instances = Number.parseInt(this.flags.instances) ? Number.parseInt(this.flags.instances):'max'
      return this.startWorkers(this.instances);
    }

    return this._runMoleculer();
  }
}

StartCommand.args = [
	{
		name:        'servicePaths',
		required:    false,
		default:     '', //services
		description: 'service files or directories or glob masks',
	}
];

StartCommand.description = `run steedos projects`

StartCommand.flags = {
    repl: flags.boolean({char: 'r', default: false, description: 'If true, it switches to REPL mode after broker started.'}),
    silent: flags.boolean({char: 's', default: false, description: 'Disable the broker logger. It prints nothing to the console.'}),
    hot: flags.boolean({char:'h', default: false, description: 'Hot reload services when they change.'}),
    config: flags.string({char:'c', default: 'steedos.config.js', description:'Load configuration file from a different path or a different filename.'}),
    env: flags.boolean({char: 'e', default: false, description: 'Load environment variables from the ‘.env’ file from the current folder.'}),
    envfile: flags.string({char: 'E', description: 'Load environment variables from the specified file.'}),
    instances: flags.string({char: 'i', description: 'Launch [number] node instances or max for all cpu cores (with cluster module)'})
} 

module.exports = StartCommand
