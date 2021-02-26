const _ = require("underscore");
const path = require("path");
const objectql = require("@steedos/objectql");
const { getMD5 } = require("@steedos/objectql");
module.exports = {
  load: function(broker, packagePath, packageServiceName) {
    console.log("packagePath : " + packagePath);
    let actions = {};

    let filePath = path.join(packagePath, "**");
    objectql.loadObjectTriggers(filePath);

    let objListeners = objectql.getLazyLoadListeners();
    console.log(objListeners);
    _.each(objListeners, (listeners, objectName) => {
      _.forEach(listeners, (l) => {
        let action = createAction(l);
        actions[action.name] = action;
      });
    });
    console.log(actions);
    let service = {
      name: `${packageServiceName}-triggers`,
      actions: actions,
    };
    broker.createService(service);
  },
};

function createAction(listener) {
  let action = {};
  let name = listener.name || getMD5(JSON.stringify(listener));
  action.name = `$trigger.${listener.listenTo}.${name}`;
  action.handler = function(ctx) {
    listener.handler.call({}, ctx);
  };
  //
  action.when = listener.when; // TODO check when value
  return action;
}
