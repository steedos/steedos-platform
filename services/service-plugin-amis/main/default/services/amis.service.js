/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-05-19 11:38:30
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-05-23 10:01:02
 * @Description: 
 */
const AmisSchema = require('./utils/amis-schema');

module.exports = {
    name: "amis",
    mixins: [],
    /**
     * Settings
     */
    settings: {

    },

    /**
     * Dependencies
     */
    dependencies: [],

    /**
     * Actions
     */
    actions: {
        getDefaultSchema: {
            async handler(ctx) {
                const userSession = ctx.meta.user;
                const { type, app, objectApiName, recordId, formFactor } = ctx.params;
                return this.getDefaultSchema({type, app, objectApiName, recordId, formFactor, userSession});
            }
        },
        getInitSchema: {
            async handler(ctx) {
                const userSession = ctx.meta.user;
                const { type, objectApiName, formFactor } = ctx.params;
                return this.getInitSchema({type, objectApiName, formFactor, userSession} );
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
        getDefaultSchema: {
            handler({type, app, objectApiName, recordId, formFactor, userSession}) {
                // if(type === 'list'){
                //     return {
                //         type: 'page',
                //         body: [{"type":"tpl","tpl":"${rootUrl}","inline":false,"id":"u:6ed8d90b5f25","style":{}}]
                //     }
                // }
                // if(type === 'form'){
                //     return {
                //         "title": "系统提示",
                //         "body": [
                //           {
                //             "type": "tpl",
                //             "tpl": "对你点击了",
                //             "inline": false
                //           },
                //           {
                //             "type": "tpl",
                //             "tpl": "${objectApiName}\n${objectName}",
                //             "inline": false,
                //             "id": "u:4253372a0780",
                //             "closeOnEsc": false,
                //             "closeOnOutside": false,
                //             "showCloseButton": true,
                //             "style": {
                //             }
                //           }
                //         ],
                //         "type": "dialog"
                //       }
                // }
            }
        },
        getInitSchema: {
            handler({type, objectApiName, formFactor, userSession}) {
                if(type === 'form' && objectApiName){
                   return AmisSchema.getRecordSchema(objectApiName, '${recordId}', false, userSession); 
                }
            }
        }
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
