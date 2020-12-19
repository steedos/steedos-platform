import { addObjectFieldConfig } from './field'
import { addObjectButtonsConfig } from './button'
var Fiber = require('fibers');

declare var Creator: any;
declare var DDP: any;
declare var DDPCommon: any;

const hasCreator = function(){
    return (typeof Creator != "undefined");
}

async function meteorFind(name, query?, options?){
    if(!hasCreator()){
        return [];
    }

    Creator.Collections[name] = Creator.createCollection({name: name});
    return await new Promise((resolve, reject) => {
        Fiber(function () {
            try {
                let invocation = new DDPCommon.MethodInvocation({
                    isSimulation: true,
                    connection: null,
                    randomSeed: DDPCommon.makeRpcSeed()
                })
                let result = DDP._CurrentInvocation.withValue(invocation, function () {
                    return Creator.Collections[name].find(query, options).fetch();
                })
                resolve(result);
            } catch (error) {
                reject(error)
            }
        }).run()
    });
}

export const preloadDBObjectFields = async function(){
    let fields: any = await meteorFind("object_fields", {});
    fields.forEach(element => {
        addObjectFieldConfig(element.object, element);
    });
}

export const preloadDBObjectButtons = async function(){
    let buttons: any = await meteorFind("object_actions", {is_enable: true});
    buttons.forEach(element => {
        addObjectButtonsConfig(element.object, element);
    });
}

