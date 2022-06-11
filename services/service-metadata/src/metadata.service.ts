"use strict";
import { started, stopped } from '@steedos/metadata-registrar';
import { ActionHandlers } from './actionsHandler';
import * as _ from 'underscore';
const SERVICE_NAME = 'metadata';

let RefreshServiceMetadatasSetTimeoutId = null;

module.exports = {
	name: SERVICE_NAME,
	namespace: "steedos",
	/**
	 * Settings
	 */
	settings: {

	},
	async started() {
		await started(this.broker)
	},
	/**
	   * Methods
	   */
	methods: {
		refreshServiceMetadatas:async function (ctx) {
			return await ActionHandlers.refreshServiceMetadatas(ctx)
		},
		clearPackageServices:async function (ctx) {
			const { offlinePackageServicesName } = ctx.params;
			// console.log(`$metadata.clearPackageServices`, offlinePackageServicesName)
			await ActionHandlers.clearPackageServices(ctx, offlinePackageServicesName);
			await ActionHandlers.clearPackageServicesMetadatas(ctx, offlinePackageServicesName);
		}
	},

	events: {
		"$services.changed"(ctx) {
			if (RefreshServiceMetadatasSetTimeoutId) {
				clearTimeout(RefreshServiceMetadatasSetTimeoutId);
			}
			RefreshServiceMetadatasSetTimeoutId = setTimeout(() => {
				this.refreshServiceMetadatas(ctx);
			}, 1000 * 5)
		},
		"$metadata.clearPackageServices"(ctx) {
			this.clearPackageServices(ctx);
		}
	},
	/**
	   * Actions
	   */
	actions: {
		get: {
			async handler(ctx) {
				return await ActionHandlers.get(ctx);
			}
		},
		mget: {
			async handler(ctx) {
				return await ActionHandlers.mget(ctx);
			}
		},
		filter: {
			async handler(ctx) {
				return await ActionHandlers.filter(ctx);
			}
		},
		mfilter: {
			async handler(ctx) {
				return await ActionHandlers.mfilter(ctx);
			}
		},
		add: {
			async handler(ctx) {
				return await ActionHandlers.add(ctx);
			}
		},
		madd: {
			async handler(ctx) {
				return await ActionHandlers.madd(ctx);
			}
		},
		lpush: {
			async handler(ctx) {
				return await ActionHandlers.lpush(ctx);
			}
		},
		rpush: {
			async handler(ctx) {
				return await ActionHandlers.rpush(ctx);
			}
		},
		lrange: {
			async handler(ctx) {
				return await ActionHandlers.lrange(ctx);
			}
		},
		filterList: {
			async handler(ctx) {
				return await ActionHandlers.filterList(ctx);
			}
		},
		addServiceMetadata: {
			async handler(ctx) {
				return await ActionHandlers.addServiceMetadata(ctx);
			}
		},
		maddServiceMetadata: {
			async handler(ctx) {
				return await ActionHandlers.maddServiceMetadata(ctx);
			}
		},
		delete: {
			async handler(ctx) {
				return await ActionHandlers.delete(ctx);
			}
		},
		deleteServiceMetadata: {
			async handler(ctx) {
				return await ActionHandlers.deleteServiceMetadata(ctx);
			}
		},
		fuzzyDelete: {
			async handler(ctx) {
				return await ActionHandlers.fuzzyDelete(ctx);
			}
		},
		refreshServiceMetadatas: {
			params: {
                offlinePackageServices: { type: "array", items: "object" },
            },
			async handler(ctx) {
				return await ActionHandlers.refreshServiceMetadatas(ctx);
			}
		},
		getServiceMetadatas: {
			async handler(ctx) {
				return await ActionHandlers.getServiceMetadatas(ctx);
			}
		},
		getServiceMetadata: {
			params: {
				serviceName: { type: "string"},
				metadataType: { type: "string"},
				metadataApiName: { type: "string"},
			},
			async handler(ctx) {
				return await ActionHandlers.getServiceMetadata(ctx);
			}
		},
		removeServiceMetadata: {
			params: {
				serviceName: { type: "string" },
				metadataType: { type: "string" },
				metadataApiName: { type: "string" },
			},
			async handler(ctx) {
				return await ActionHandlers.removeServiceMetadata(ctx);
			}
		},
		clearPackageServices: {
			async handler(ctx) {
				return await this.clearPackageServices(ctx);
			}
		}
	},
	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {
		await stopped(this.broker)
	}
}
