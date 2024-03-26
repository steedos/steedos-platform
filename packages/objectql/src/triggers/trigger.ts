/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-04-23 13:35:17
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-03-26 15:10:32
 * @Description: 
 */
const { NodeVM } = require('vm2');
import { ObjectId } from "mongodb";

function str2function(
    contents,
    ...args
  ) {
    try {
      let fn = new Function(...args, contents);
      return fn;
    } catch (e) {
      console.warn(e);
      return null;
    }
}


export const runTriggerFunction = async (trigger, thisArg, ...args)=>{
    const vm = new NodeVM({
        sandbox: {
            str2function,
            global: {
                _: require('lodash'),
                moment: require('moment'),
                validator: require('validator'),
                // dateFNS: require('date-fns'),
                Filters: require('@steedos/filters'),
                filters: require('@steedos/filters')
            },
            services: (global as any).services,
            objects: (global as any).objects,
            makeNewID: ()=>{
                return new ObjectId().toHexString();
            }
        },
        require: {
            external: true,
            root: './'
        },
        env: process.env
    });
    const triggerFileName = `${trigger.listenTo}.${trigger.name}.trigger.js`;
    let triggerInSandbox =  vm.run(`module.exports = async function(ctx){${trigger.handler}};`, triggerFileName);
    try {
        const runTrigger = async function(){
            return new Promise((resolve, reject)=>{
                triggerInSandbox.apply(thisArg, args).then((res)=>{
                    resolve(res)
                }).catch((error)=>{
                    reject(error)
                })
            });
        }
        const res: any = await runTrigger();
        return res;
    } catch (error) {
        const source = error.stack;
        const errorStack = source.substring(source.indexOf("(")+1,source.indexOf(")")).replace(triggerFileName, "对象「" + trigger.listenTo + "」的「" + trigger.name +"」触发器").replace(":"," 行 ").replace(":"," 列 ");
        const newError = new Error(error.message);
        newError.stack = `Object Trigger Error: ${error.message}\n    at ${errorStack}`;
        throw newError
    }
}