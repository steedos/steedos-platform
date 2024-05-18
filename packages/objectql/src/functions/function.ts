/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2024-05-13 10:22:58
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2024-05-13 13:37:24
 * @FilePath: /steedos-platform-2.3/packages/objectql/src/functions/function.ts
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


export const runFunction = async (func, thisArg, ...args) => {
    const vm = new NodeVM({
        sandbox: {
            str2function,
            global: {
                _: require('lodash'),
                moment: require('moment'),
                validator: require('validator'),
                filters: require('@steedos/filters')
            },
            objects: (global as any).objects,
        },
        require: {
            external: true,
            root: './'
        },
        env: process.env
    });
    const funcFileName = `${func.objectApiName}.${func.name}.function.js`;
    let funcInSandbox = vm.run(`module.exports = async function(ctx){${func.script}};`, funcFileName);
    try {
        const run = async function () {
            return new Promise((resolve, reject) => {
                funcInSandbox.apply(thisArg, args).then((res) => {
                    resolve(res)
                }).catch((error) => {
                    reject(error)
                })
            });
        }
        const res: any = await run();
        return res;
    } catch (error) {
        const source = error.stack;
        const errorStack = source.substring(source.indexOf("(") + 1, source.indexOf(")")).replace(funcFileName, "对象「" + func.objectApiName + "」的「" + func.name + "」函数").replace(":", " 行 ").replace(":", " 列 ");
        const newError = new Error(error.message);
        newError.stack = `Object Function Error: ${error.message}\n    at ${errorStack}`;
        if (process.env.NODE_ENV === 'development') {
            newError.message = newError.stack
        }
        throw newError
    }
}