/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2023-04-11 11:50:53
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-01-17 14:19:27
 * @Description: 
 */
"use strict";
import { METADATA_TYPE, isPatternTrigger } from './actionsHandler';
import _ = require('lodash');
import { TRIGGERKEYS } from "./constants";

module.exports = {
    name: "triggers",
    namespace: "steedos",
    /**
     * Settings
     */
    settings: {

    },

    metadata: {
        triggers: []
    },

    /**
     * Actions
     */
    actions: {

        getAll: {
            async handler(ctx) {
                return this.metadata.triggers;
            }
        },

    },

    events: {
        /**
         * 监听 $services.changed 事件，扫描services下的actions，对于其中定义的trigger参数进行解析，统一给this.metadata赋值。
         */
        "$services.changed": {
            async handler(ctx) {
                const { broker } = ctx
                const logger = this.logger
                const triggers = []
                const services = broker.registry.getServiceList({ skipInternal: true, withActions: true })
                for (const service of services) {
                    const { name: serviceName, actions } = service
                    /**
                    actions 结构
                    {
                        'test.triggerSpaceUsers': {
                            trigger: { listenTo: 'test__c', when: [Array] },
                            rawName: 'triggerSpaceUsers',
                            name: 'test.triggerSpaceUsers'
                        }
                    }
                     */
                    for (const key in actions) {
                        if (Object.prototype.hasOwnProperty.call(actions, key)) {
                            const action = actions[key];
                            if (action.trigger) {
                                const { trigger, rawName, name } = action
                                const { listenTo, when } = trigger

                                if (listenTo && when && _.isArray(when)) {
                                    for (const w of when) {
                                        if (!TRIGGERKEYS.includes(w)) {
                                            logger.warn(`trigger when '${w}' is not supported.`)
                                            continue
                                        }
                                    }
                                }

                                triggers.push({
                                    "nodeID": broker.nodeID + '',
                                    "service": {
                                        "name": serviceName
                                    },
                                    "metadata": {
                                        "name": name,
                                        "listenTo": listenTo,
                                        "when": when,
                                        "action": rawName,
                                        "isPattern": isPatternTrigger(trigger)
                                    }
                                })

                            }
                        }
                    }
                }
                this.metadata.triggers = triggers
                broker.emit(`${METADATA_TYPE}.change`, {});
            }
        },
    },

    /**
     * Methods
     */
    methods: {

    },

    /**
     * Service created lifecycle event handler
     */
    async created() {
        console.log('triggers created....')
    },

    /**
     * Service started lifecycle event handler
     */
    async started() {
        console.log('triggers started....')
    },

    /**
     * Service stopped lifecycle event handler
     */
    async stopped() {

    }
};
