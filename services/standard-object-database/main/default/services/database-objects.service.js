/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-04-21 16:25:07
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-03-06 13:43:12
 * @Description: 
 */
var packageServiceName = '~database-objects'

const { getObject } = require('@steedos/objectql');

const sleep = async (ms) => new Promise(resolve => setTimeout(resolve, ms));

function isPatternTrigger(data){
    const {listenTo} = data;
    if(listenTo === '*'){
        return true;
    }else if(_.isArray(listenTo)){
        return true;
    }else if(_.isRegExp(listenTo)){
        return true;
    }else if(_.isString(listenTo) && listenTo.startsWith("/")){
        try {
            if(_.isRegExp(eval(listenTo))){
                return true;
            }
        } catch (error) {
            return false
        }
        return false;
    }
    return false;
}
module.exports = {
    name: packageServiceName,
    namespace: "steedos",

    dependencies: ['@steedos/standard-objects'],
    
    /**
	 * Actions
	 */
	actions: {
        resetObject: {
            rest: {
                method: "POST",
                path: "/reset"
            },
            async handler(ctx) {
                const userSession = ctx.meta.user;
                // 安全修复：原 handler 无任何鉴权(不校验 is_space_admin、不读 userSession)，
                // 且 directDelete 按 name 过滤不带 space，任意登录用户可跨租户删除任意对象及其字段定义。
                // 现要求空间管理员，且删除范围限定在调用者所在 space。
                if (!userSession || !userSession.is_space_admin) {
                    throw new Error('no permission');
                }
                const { objectName } = ctx.params;
                await getObject('objects').directDelete({filters: [['name','=', objectName], ['space','=', userSession.spaceId]]});
                await getObject('object_fields').directDelete({filters: [['object','=', objectName], ['space','=', userSession.spaceId]]});
                await sleep(2 * 1000)
                return true;
            }
        }
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
        changeTriggerMetadata: {
            async handler(trigger){
                if(isPatternTrigger(trigger)){
                    trigger.isPattern = true
                }
                await this.broker.call(`object_triggers.add`, { apiName: `${trigger.listenTo}.${trigger.name}`, data: trigger }, {
                    meta: {
                    metadataServiceName: packageServiceName,
                    caller: {
                        nodeID: this.broker.nodeID,
                        service: {
                            name: packageServiceName,
                        }
                    }
                }});
                this.broker.broadcast('metadata.object_triggers.change', {apiName: `${trigger.listenTo}.${trigger.name}`, listenTo: trigger.listenTo})
            }
        },
        removeTriggerMetadata: {
            async handler(trigger){
                await this.broker.call(`object_triggers.delete`, { apiName: `${trigger.listenTo}.${trigger.name}`}, {
                    meta: {
                    metadataServiceName: packageServiceName,
                    caller: {
                        nodeID: this.broker.nodeID,
                        service: {
                            name: packageServiceName,
                        }
                    }
                }});
                this.broker.broadcast('metadata.object_triggers.change', {apiName: `${trigger.listenTo}.${trigger.name}`, listenTo: trigger.listenTo})
            }
        },
        // subTriggers: {
        //     async handler(){
        //         return Creator.getCollection("object_triggers").find({}, {
        //             fields: {
        //                 created: 0,
        //                 created_by: 0,
        //                 modified: 0,
        //                 modified_by: 0
        //             }
        //         }).observe({
        //             added: (newDocument)=>{
        //                 return this.changeTriggerMetadata(newDocument);
        //             },
        //             changed: (newDocument, oldDocument) => {
        //                 if(newDocument.name != oldDocument.name){
        //                     this.removeTriggerMetadata(oldDocument);
        //                 }
        //                 return this.changeTriggerMetadata(newDocument);
        //             },
        //             removed: (oldDocument) => {
        //                 return this.removeTriggerMetadata(oldDocument);
        //             }
        //         });
        //     }
        // }
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
        // Meteor.startup(async ()=>{
        //     this.subTriggers = await this.subTriggers();
        // })
	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {
        // TODO 停止服务时, 需要执行以下操作
        // 1 stop订阅
        // 2 清理元数据
	}
}