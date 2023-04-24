/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2023-04-11 11:50:53
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2023-04-20 10:08:46
 * @Description: 
 */
"use strict";
import { METADATA_TYPE } from './actionsHandler';
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
     * Dependencies
     */
    dependencies: ['metadata'],

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
                                        triggers.push({
                                            "nodeID": broker.nodeID + '',
                                            "service": {
                                                "name": serviceName
                                            },
                                            "metadata": {
                                                "name": name,
                                                "listenTo": listenTo,
                                                "when": w,
                                                "action": rawName
                                            }
                                        })
                                    }

                                }

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
