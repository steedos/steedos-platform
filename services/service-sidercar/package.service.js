/*
 * @moleculer/sidecar
 * Copyright (c) 2020 MoleculerJS (https://github.com/moleculerjs/sidecar)
 * MIT Licensed
 */

"use strict";

const _ = require("lodash");
const kleur = require("kleur");
const fetch = require("node-fetch");
const { MoleculerError, MoleculerClientError } = require("moleculer").Errors;
const pkg = require("./package.json");

module.exports = {
	name: pkg.name,

	mixins: [],

	metadata: {
		$category: "gateway",
		$description: "Sidecar service",
		$official: true,
		$package: {
			name: pkg.name,
			version: pkg.version,
			repo: pkg.repository ? pkg.repository.url : null
		}
	},

	settings: {

	},

	created() {
		this.services = new Map();
	},

	actions: {
		addRoute: false,
		removeRoute: false,

		/**
		 * $node.list
		 */
		nodes: {
			rest: {
				method: "GET",
				path: "/registry/nodes"
			},
			params: {
			},
			async handler(ctx) {
				try {
					await this.checkIsAdmin(ctx);
					return await ctx.call('$node.list');
				} catch (error) {
					return this.onError(ctx, error);
				}
			}
		},
		/**
		 * $node.services
		 */
		services: {
			rest: {
				method: "GET",
				path: "/registry/services"
			},
			params: {
			},
			async handler(ctx) {
				try {
					await this.checkIsAdmin(ctx);
					return await ctx.call('$node.services');
				} catch (error) {
					return this.onError(ctx, error);
				}
			}
		},
		/**
		 * $node.actions
		 */
		actions: {
			rest: {
				method: "GET",
				path: "/registry/actions"
			},
			params: {
			},
			async handler(ctx) {
				try {
					await this.checkIsAdmin(ctx);
					return await ctx.call('$node.actions');
				} catch (error) {
					return this.onError(ctx, error);
				}
			}
		},
		/**
		 * $node.events
		 */
		events: {
			rest: {
				method: "GET",
				path: "/registry/events"
			},
			params: {
			},
			async handler(ctx) {
				try {
					await this.checkIsAdmin(ctx);
					return await ctx.call('$node.events');
				} catch (error) {
					return this.onError(ctx, error);
				}
			}
		},

		/**
		 * Register an external service
		 */
		registerService: {
			rest: {
				method: "POST",
				path: "/registry/services"
			},
			params: {
				name: "string|no-empty"
			},
			async handler(ctx) {
				try {
					await this.checkIsAdmin(ctx);
					const schema = _.cloneDeep(ctx.params);

					// 1. Check the service is exist
					let svc = this.broker.getLocalService({
						name: schema.name,
						version: schema.version
					});

					// 2.   If yes, destroy
					if (svc) {
						this.logger.info(`Destroy previous '${schema.name}' service...`);
						await this.broker.destroyService(svc);
					}

					// 3. Convert the schema, fulfill the action/event handlers
					this.logger.info(kleur.yellow().bold(`Create new '${schema.name}' service...`));

					if (schema.actions) {
						Object.entries(schema.actions).forEach(([name, action]) => {
							// Handle shorthand action def
							if (typeof action == "string") {
								schema.actions[name] = { handler: action };
								action = schema.actions[name];
							}

							if (typeof action.handler != "string") {
								throw new MoleculerClientError(
									"Invalid action handler",
									400,
									"INVALID_HANDLER",
									{ action }
								);
							}

							action.handler = this.generateActionHandler(action, schema);
						});
					}

					if (schema.events) {
						Object.entries(schema.events).forEach(([name, event]) => {
							// Handle shorthand event def
							if (typeof event == "string") {
								schema.events[name] = { handler: event };
								event = schema.events[name];
							}
							if (typeof event.handler != "string") {
								throw new MoleculerClientError(
									"Invalid event handler",
									400,
									"INVALID_HANDLER",
									{ event }
								);
							}

							event.handler = this.generateEventHandler(event, schema);
						});
					}

					svc = this.broker.createService(schema);

					return { status: "OK" };
				} catch (error) {
					return this.onError(ctx, error);
				}
			}
		},

		/**
		 * Unregister a loaded external service
		 */
		unregisterService: {
			rest: {
				method: "DELETE",
				path: "/registry/services/:serviceName"
			},
			params: {
				serviceName: "string|no-empty|trim"
			},
			async handler(ctx) {
				try {
					await this.checkIsAdmin(ctx);
					// 1. Check the service is exist
					const svc = this.broker.getLocalService(ctx.params.serviceName);

					// 2.   If yes, destroy
					if (!svc) {
						throw new MoleculerClientError(
							"Service not found",
							404,
							"NOT_FOUND",
							ctx.params
						);
					}
					this.logger.info(kleur.yellow().bold(`Destroy '${svc.fullName}' service...`));
					await this.broker.destroyService(svc);

					return { status: "OK" };
				} catch (error) {
					return this.onError(ctx, error);
				}
			}
		},

		/**
		 * Call an action
		 */
		callAction: {
			rest: {
				method: "POST",
				path: "/call/:action"
			},
			params: {
				action: "string|no-empty|trim",
				params: "any|optional",
				meta: "object|optional",
				options: "object|optional|default:{}"
			},
			async handler(ctx) {
				try {
					await this.checkIsAdmin(ctx);
					const payload = ctx.params;
					try {
						const response = await ctx.call(
							payload.action,
							payload.params != null ? payload.params : {},
							{
								meta: payload.meta,
								timeout: payload.options.timeout,
								retries: payload.options.retries
							}
						);

						return {
							response,
							meta: ctx.meta
						};
					} catch (err) {
						ctx.meta.$statusCode = err.code || 500;

						return {
							error: _.pick(err, [
								"name",
								"message",
								"code",
								"type",
								"stack",
								"data",
								"nodeID"
							]),
							meta: ctx.meta
						};
					}
				} catch (error) {
					return this.onError(ctx, error);
				}

			}
		},

		/**
		 * Emit an event
		 */
		emitEvent: {
			rest: {
				method: "POST",
				path: "/emit/:event"
			},
			params: {
				event: "string|no-empty|trim",
				params: "any|optional",
				meta: "object|optional",
				options: "object|optional|default:{}"
			},
			async handler(ctx) {
				try {
					await this.checkIsAdmin(ctx);
					const payload = ctx.params;
					try {
						await ctx.emit(payload.event, payload.params != null ? payload.params : {}, {
							meta: payload.meta,
							groups: payload.options.groups
						});
					} catch (err) {
						this.logger.error("Unable to emit event", err);
					}
				} catch (error) {
					return this.onError(ctx, error);
				}
			}
		},

		/**
		 * Broadcast an event
		 */
		broadcastEvent: {
			rest: {
				method: "POST",
				path: "/broadcast/:event"
			},
			params: {
				event: "string|no-empty|trim",
				params: "any|optional",
				meta: "object|optional",
				options: "object|optional|default:{}"
			},
			async handler(ctx) {
				try {
					await this.checkIsAdmin(ctx);
					const payload = ctx.params;
					try {
						await ctx.broadcast(payload.event, payload.params, {
							meta: payload.meta,
							groups: payload.options.groups
						});
					} catch (err) {
						this.logger.error("Unable to broadcast event", err);
					}
				} catch (error) {
					return this.onError(ctx, error);
				}
			}
		}
	},

	methods: {
		/**
		 * Generate REST handler for action
		 *
		 * @param {*} action
		 * @param {*} schema
		 */
		generateActionHandler(action, schema) {
			//console.log("generateActionHandler", action);
			const fullUrl =
				(schema.settings && schema.settings.baseUrl ? schema.settings.baseUrl : "") +
				action.handler;

			return async ctx => {
				const res = await this.postRequest(fullUrl, {
					action: ctx.action.name,
					nodeID: ctx.nodeID,
					params: ctx.params,
					meta: ctx.meta,
					options: {
						timeout: ctx.timeout
					}
				});

				if (res.meta) {
					// Merge the received meta into "ctx.meta"
					Object.assign(ctx.meta, res.meta);
				}

				return res.response;
			};
		},

		/**
		 * Generate REST handler for event
		 * @param {*} event
		 * @param {*} schema
		 */
		generateEventHandler(event, schema) {
			//console.log("generateActionHandler", action);
			const fullUrl =
				(schema.settings && schema.settings.baseUrl ? schema.settings.baseUrl : "") +
				event.handler;

			return async ctx => {
				try {
					await this.postRequest(fullUrl, {
						event: ctx.eventName,
						eventType: ctx.eventType,
						eventGroups: ctx.eventGroups,
						nodeID: ctx.nodeID,
						params: ctx.params,
						meta: ctx.meta
					});
				} catch (err) {
					this.logger.error("Unable to call sidecar event subscription handler", err);
				}
			};
		},

		/**
		 * POST request for external services.
		 * @param {String} url
		 * @param {any?} payload
		 */
		postRequest(url, payload) {
			return fetch(url, {
				method: "POST",
				cache: "no-cache",
				headers: {
					"Content-Type": "application/json"
				},
				body: payload ? JSON.stringify(payload) : undefined
			}).then(async res => {
				let payload;
				const contentType = res.headers.get("content-type");
				if (contentType && contentType.startsWith("application/json"))
					payload = await res.json();
				else payload = await res.text();

				if (!res.ok) {
					let err;
					if (payload && payload.error) {
						err = new MoleculerError(res.statusText);
						Object.assign(err, payload.error);
					} else {
						err = new MoleculerError("Something happened", res.status, res.statusText);
					}

					throw err;
				}

				return payload;
			});
		},

		async checkIsAdmin(ctx) {
			const user = ctx.meta.user;
			if (!user || !user.is_space_admin) {
				let err = new Error('NO_RIGHTS');
				err.code = 401;
				throw err;
			}
		},

		onError(ctx, error) {
			const msg = error.message;
			ctx.meta.$statusCode = error.code || 500;
			return msg
		}
	},

	started() {
	},

	stopped() {
		//
	}
};
