/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-04-23 13:35:17
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-04-24 10:44:42
 * @Description: 
 */
const { NodeVM } = require('vm2');

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


export const runTriggerFunction = (code, thisArg, ...args)=>{
    console.log('runTriggerFunction', code);
    const vm = new NodeVM({
        sandbox: {
            str2function,
            global: {
                _: require('lodash'),
                moment: require('moment'),
                validator: require('validator'),
                // dateFNS: require('date-fns'),
                Filters: require('@steedos/filters')
            },
            services: (global as any).services,
            objects: (global as any).objects,
        },
        require: {
            external: true,
            root: './'
        }
    });
    let triggerInSandbox =  vm.run(`module.exports = async function(ctx){${code}};`);

    return triggerInSandbox.apply(thisArg, args)
}