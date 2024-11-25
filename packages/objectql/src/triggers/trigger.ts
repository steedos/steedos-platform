/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-04-23 13:35:17
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-11-25 10:41:20
 * @Description: 
 */
const { NodeVM } = require('vm2');
const _  = require('lodash');
import { ObjectId } from "mongodb";
import axios from 'axios';

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

const sendPost = async (url, body, options)=>{
    try {
        return await axios.post(url, body, options);
    } catch (error) {
        throw new Error(`请求失败(${error.message}): ${url}`)
    }
}



/**
 * 
 * 请求参数(body): {
       objectName,
       userId,
       spaceId,
       doc
 * } 
 * 接口返回参数结构:
        {
            "error": {
                "code": "",
                "message": "",
            },
            "data": {

            }
        }
 */
const runUrlTrigger = async (trigger, thisArg, args)=>{
    if(!trigger.url){
        throw new Error(`触发器「${trigger.name}」缺少URL`)
    }

    const headers = {
        'Content-Type': 'application/json',
    };

    if(trigger.authentication_type == 'header'){
        headers[trigger.authentication_header_key] = trigger.authentication_header_value
    }

    const { data: rsBody, status: httpStatus } = await sendPost(trigger.url, args && args.length > 0 ? args[0].params : {}, { headers });
    if(httpStatus !== 200){
        throw new Error(`请求失败: ${trigger.url}`)
    }
    let { error, data } = rsBody;

    if(error && error.message){
        throw new Error(error.message)
    }
    return data
}


export const runTriggerFunction = async (trigger, thisArg, ...args)=>{
    
    if(trigger.type === 'url'){
        return await runUrlTrigger(trigger, thisArg, args)
    }

    // ----- code trigger -----
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
        if(process.env.NODE_ENV === 'development'){
            newError.message = newError.stack
        }
        throw newError
    }
}