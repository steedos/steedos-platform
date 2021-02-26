const _ = require("underscore");
const path = require("path");
const objectql = require("@steedos/objectql");
const { getMD5 } = require("@steedos/objectql");
module.exports = {
    /**
     * load trigger.js
     * @param {*} broker 
     * @param {*} packagePath 
     * @param {*} packageServiceName 
     */
    load: async function (broker, packagePath, packageServiceName) {
        console.log("packagePath : " + packagePath);
        let actions = {};

        let filePath = path.join(packagePath, "**");
        objectql.loadObjectTriggers(filePath);

        let objListeners = objectql.getLazyLoadListeners();
        console.log(objListeners);
        _.each(objListeners, (listeners, objectName) => {
            _.forEach(listeners, (l) => {
                let action = generateAction(l);
                actions[action.name] = action;
            });
        });
        console.log(actions);
        let service = {
            name: `${packageServiceName}-triggers`,
            actions: actions,
        };
        broker.createService(service);

        await regist(broker, actions);
    },
};

/**
 * transform listener to action
 * @param {*} listener 
 */
function generateAction(listener) {
    let action = {};
    let name = listener.name || getMD5(JSON.stringify(listener));
    action.name = `$trigger.${listener.listenTo}.${name}`;
    action.handler = function (ctx) {
        listener.handler.call({}, ctx);
    };
    //
    action.when = listener.when; // TODO check when value
    return action;
}

/**
 * regist action to metadata service
 * @param {*} broker 
 * @param {*} actions 
 */
async function regist(broker, actions) {
    for (const key in actions) {
        if (Object.hasOwnProperty.call(actions, key)) {
            await broker.call('triggers.add', { data: actions[key] });
        }
    }
}
