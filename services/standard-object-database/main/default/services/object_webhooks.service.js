/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2024-04-23 14:35:03
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2024-09-14 11:24:08
 * @Description: 
 */

const BullMqMixin = require('moleculer-bullmq');
const axios = require('axios');
const { evaluate } = require("amis-formula")
const serviceObjectMixin = require('@steedos/service-object-mixin');
const _ = require("lodash");

module.exports = {
    name: "object_webhooks",
    mixins: [serviceObjectMixin, BullMqMixin],
    settings: {
      bullmq: {
        client: process.env.QUEUE_BACKEND,
        worker: { concurrency: 50 }
      }
    },
    events: {
      "*.inserted": async function(ctx){
        const { objectApiName, id, spaceId, userId  } = ctx.params;
        if(ctx.eventName != `@${objectApiName}.inserted`){
          return
        }
        if(objectApiName && id && spaceId){
          await this.addQueue(ctx, objectApiName, "create", id, spaceId, userId)
        }
      },
      "*.updated": async function(ctx){
        const { objectApiName, id, spaceId, userId, previousDoc } = ctx.params;
        if(ctx.eventName != `@${objectApiName}.updated`){
          return
        }
        if(objectApiName && id && spaceId){
          await this.addQueue(ctx, objectApiName, "update", id, spaceId, userId, previousDoc)
        }
      },
      "*.deleted": async function(ctx){
        const { objectApiName, id, spaceId, userId, previousDoc } = ctx.params;
        if(ctx.eventName != `@${objectApiName}.deleted`){
          return
        }
        if(objectApiName && id){
          await this.addQueue(ctx, objectApiName, "delete", id, spaceId, userId, previousDoc)
        }
      }
    },
    actions: {
      send: {
        queue: true,
        async handler(ctx) {
          const { url, data } = ctx.params
          const result = await axios.post(url, data);
          ctx.locals.job.updateProgress(100)
          return result.data;
        }
      }
    },
    methods: {

      async addQueue(ctx, objectName, actionName, recordId, spaceId, userId, previousDoc){
        const hooks = await this.getObjectWebhooks(objectName, spaceId)
        if(hooks.length === 0) return

        let newDoc;
        if(recordId && (actionName === 'update' || actionName === 'create')){
          newDoc = await this.getObject(objectName).findOne(recordId)
        }
        let sender;
        let space;
        if(userId && spaceId){
          const userSession  = await ctx.call('@steedos/service-accounts.getUserSession', {userId, spaceId})
          if(userSession){
            sender = {
              _id: userSession.userId,
              username: userSession.username,
              name: userSession.name,
              email: userSession.email
            }

            space = {
              _id: userSession.space._id,
              name: userSession.space.name
            }
          }
        }

        for (const hook of hooks) {

          if(hook.event != 'createAndUpdate' && hook.event != actionName){
            continue;
          }

          if(hook.event == 'createAndUpdate' && actionName != 'create' && actionName != 'update'){
            continue;
          }

          const { execute_when, condition } = hook;

          if(hook.event == 'createAndUpdate' && actionName == 'create' && execute_when == 'trueOnChangeOnly'){
            continue;
          }

          if(condition){

            if(actionName == 'update' && execute_when === 'trueOnChangeOnly'){
              const oldResult = evaluate(condition, previousDoc);
              if(oldResult){
                continue;
              }
            }

            const result = evaluate(condition, newDoc);
            if(!result){
              continue;
            }
          }
          let data  = newDoc || previousDoc;
          if(hook.fields && hook.fields.length > 0){
            data = _.map(data, hook.fields)
          }
          await this.queue(ctx, 'object_webhooks', 'send', { url: hook.payload_url, data: {
            action: actionName,
            object_name: objectName,
            doc: data,
            sender: sender,
            space: space
          }, space: spaceId, user: userId }, { priority: 10 })
        }
      },
      async getObjectWebhooks(objectName, spaceId){
        const SERVICE_NAME = 'metadata-cachers-service'
        const hooks = await global.broker.call(`${SERVICE_NAME}.find`, {metadataName: 'object_webhooks', filters: ['object_name', '=', objectName], spaceId});
        return hooks;
      }
    }
}