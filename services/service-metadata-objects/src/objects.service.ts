"use strict";

import { Register } from '@steedos/metadata-registrar';

import { ActionHandlers } from './actionsHandler';
import { MasterDetailActionHandler } from './master-detail/masterDetailActionHandler'
import { FormulaActionHandler } from './formula/formulaActionHandler';
import { SummaryActionHandler } from './summary/summaryActionHandler';
import { LookupActionHandler } from './lookup/LookupActionHandler';
import { METADATA_TYPE } from '.';
import * as _ from 'lodash';

module.exports = {
    name: "objects",
    /**
     * Settings
     */
    settings: {

    },

    /**
     * Dependencies
     */
    dependencies: ['metadata'],

    events: {
        [`delete.metadata.${METADATA_TYPE}`]: {
            async handler(ctx) {
                const { objectApiName } = ctx.params;
                return await this.objetActionHandlers.handleDeleteObject(ctx, objectApiName);
            }
        },
		[`$METADATA.${METADATA_TYPE}.*`]: {
            async handler(ctx) {
                return await this.objetActionHandlers.refresh(ctx);
            }
        }
	},

    /**
     * Actions
     */
    actions: {
        /**
         * Say a 'Hello' action.
         *
         * @returns
         */
        get: {
            rest: {
                method: "GET",
                path: "/object"
            },
            async handler(ctx) {
                return await this.objetActionHandlers.get(ctx);
            }
        },
        getAll: {
            rest: {
                method: "GET",
                path: "/objects"
            },
            async handler(ctx) {
                return await this.objetActionHandlers.getAll(ctx);
            }
        },
        add: {
            async handler(ctx) {
                return await this.objetActionHandlers.add(ctx);
            }
        },
        addConfig: {
            async handler(ctx) {
                return await this.objetActionHandlers.addConfig(ctx);
            }
        },
        addConfigs: {
            async handler(ctx) {
                return await this.objetActionHandlers.addConfigs(ctx);
            }
        }, 
        removeConfig: {
            async handler(ctx) {
                return await this.objetActionHandlers.removeConfig(ctx);
            }
        },
        change: {
            async handler(ctx) {
                return await this.objetActionHandlers.change(ctx);
            }
        },
        delete: {
            async handler(ctx) {
                return await this.objetActionHandlers.delete(ctx);
            }
        },
        verify: {
            async handler(ctx) {
                return await this.objetActionHandlers.verify(ctx);
            }
        },
        getOriginalObject:{
            async handler(ctx) {
                return await this.objetActionHandlers.getOriginalObject(ctx);
            }
        },
        getObjectFieldFormulaConfigs: {
            async handler(ctx) {
                return await this.formulaActionHandler.filter(ctx);
            }
        },
        verifyObjectFieldFormulaConfig: {
            async handler(ctx) {
                return await this.formulaActionHandler.verifyObjectFieldFormulaConfig(ctx);
            }
        },
        getObjectFieldFormulaConfig: {
            async handler(ctx) {
                return await this.formulaActionHandler.get(ctx);
            }
        },
        getFormulaVarsAndQuotes: {
            async handler(ctx) {
                return await this.formulaActionHandler.getFormulaVarsAndQuotes(ctx);
            }
        },
        getObjectFieldSummaryConfigs: {
            async handler(ctx) {
                return await this.summaryActionHandler.filter(ctx);
            }
        },
        getObjectFieldSummaryConfig: {
            async handler(ctx) {
                return await this.summaryActionHandler.get(ctx);
            }
        },
        getDetails: {
            async handler(ctx) {
                const { objectApiName } = ctx.params;
                return await this.masterDetailActionHandler.getDetails(objectApiName);
            }
        },
        getDetailsInfo: {
            async handler(ctx) {
                const { objectApiName } = ctx.params;
                return await this.masterDetailActionHandler.getDetailsInfo(objectApiName);
            }
        },
        getDetailPaths: {
            async handler(ctx) {
                const { objectApiName } = ctx.params;
                return await this.masterDetailActionHandler.getDetailPaths(objectApiName);
            }
        },
        getMaxDetailsLeave: {
            async handler(ctx) {
                const { objectApiName, paths } = ctx.params;
                return await this.masterDetailActionHandler.getMaxDetailsLeave(objectApiName, paths);
            }
        },
        getMasters: {
            async handler(ctx) {
                const { objectApiName } = ctx.params;
                return await this.masterDetailActionHandler.getMasters(objectApiName);
            }
        },
        getMastersInfo: {
            async handler(ctx) {
                const { objectApiName } = ctx.params;
                return await this.masterDetailActionHandler.getMastersInfo(objectApiName);
            }
        },
        getLookupDetails: {
            async handler(ctx) {
                const { objectApiName } = ctx.params;
                return await this.lookupActionHandler.getDetails(objectApiName);
            }
        },
        getLookupDetailsInfo: {
            async handler(ctx) {
                const { objectApiName } = ctx.params;
                return await this.lookupActionHandler.getDetailsInfo(objectApiName);
            }
        },
        getRelationsInfo: {
            async handler(ctx) {
                const { objectApiName } = ctx.params;
                const detailsInfoKey = this.masterDetailActionHandler.getDetailsInfoKey(objectApiName);
                const mastersInfo = this.masterDetailActionHandler.getMastersInfoKey(objectApiName);
                const lookupDetailsInfo = this.lookupActionHandler.getDetailsInfoKey(objectApiName);

                // const results = await ctx.broker.call('metadata.mfilter', { keys: [detailsInfoKey, mastersInfo, lookupDetailsInfo] });
                const results = await Register.mfilter(ctx.broker, [detailsInfoKey, mastersInfo, lookupDetailsInfo])
                return {
                    details: _.compact(_.map(results[0], 'metadata.key')),
                    masters: _.compact(_.map(results[1], 'metadata.key')),
                    lookup_details: _.compact(_.map(results[2], 'metadata.key')),
                }
            }
        },
        getAllRelationsInfo: {
            async handler(ctx) {
                const objectApiName = "*";
                const detailsInfoKey = this.masterDetailActionHandler.getDetailsInfoKey(objectApiName);
                const mastersInfo = this.masterDetailActionHandler.getMastersInfoKey(objectApiName);
                const lookupDetailsInfo = this.lookupActionHandler.getDetailsInfoKey(objectApiName);

                // const results = await ctx.broker.call('metadata.mfilter', { keys: [detailsInfoKey, mastersInfo, lookupDetailsInfo] });
                const results = await Register.mfilter(ctx.broker, [detailsInfoKey, mastersInfo, lookupDetailsInfo])
                return {
                    details: _.compact(_.map(results[0], 'metadata')),
                    masters: _.compact(_.map(results[1], 'metadata')),
                    lookup_details: _.compact(_.map(results[2], 'metadata')),
                }
            }
        },
        getMasterPaths: {
            async handler(ctx) {
                const { objectApiName } = ctx.params;
                return await this.masterDetailActionHandler.getMasterPaths(objectApiName);
            }
        },
        getMaxMastersLeave: {
            async handler(ctx) {
                const { objectApiName, paths } = ctx.params;
                return await this.masterDetailActionHandler.getMaxMastersLeave(objectApiName, paths);
            }
        }
    },
    hooks: {
        // error: {
        //     // Global error handler
        //     "*": function(ctx, err) {
        //         // this.logger.error(`Error occurred when '${ctx.action.name}' action was called`, err);
        //         // Throw further the error
        //         throw err;
        //     }
        // }
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
        this.masterDetailActionHandler = new MasterDetailActionHandler(this.broker);
        this.formulaActionHandler = new FormulaActionHandler(this.broker);
        this.summaryActionHandler = new SummaryActionHandler(this.broker);
        this.lookupActionHandler = new LookupActionHandler(this.broker);
        this.objetActionHandlers = new ActionHandlers(async (objectConfig)=>{
            await this.masterDetailActionHandler.remove(objectConfig);
            await this.masterDetailActionHandler.add(objectConfig);
            await this.lookupActionHandler.add(objectConfig);
            await this.formulaActionHandler.add(objectConfig);
            await this.summaryActionHandler.add(objectConfig);
        }, async (objectConfig)=>{
            await this.lookupActionHandler.deleteAll(objectConfig);
            await this.masterDetailActionHandler.deleteAll(objectConfig);
            await this.formulaActionHandler.deleteAll(objectConfig);
            await this.summaryActionHandler.deleteAll(objectConfig);
        }, async (objectConfig)=>{
            /**
             * 重算公式关系链时，可能存在待重算的对象还未进入缓存(但已经过了公式关系链计算过程)。所以进行延时
             */
            setTimeout(()=>{
                this.formulaActionHandler.recalcObjectsFormulaMap(objectConfig);
            }, 5 * 1000)
        })
    },

    /**
     * Service started lifecycle event handler
     */
    async started() {

    },

    /**
     * Service stopped lifecycle event handler
     */
    async stopped() {

    }
};
