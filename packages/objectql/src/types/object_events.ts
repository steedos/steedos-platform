import { SteedosTriggerContextConfig } from "./trigger";
import { getSteedosSchema } from "./schema";
import _ = require("underscore");

export async function brokeEmitTriggers(objectName: string, method: string, context: SteedosTriggerContextConfig) {
    let schema = getSteedosSchema();
    let obj = schema.getObject(objectName);
    let when = `before${method.charAt(0).toLocaleUpperCase()}${_.rest([...method]).join('')}`;
    let payload = {
        ...context,
        object_name: objectName,
        datasource_name: obj.datasource.name,
        getObject: (object_name: string) => {
            return schema.getObject(object_name)
        }
    };
    if (schema.broker) {
        await schema.broker.emit(`#${objectName}.${when}`, payload);
    }
}