import { SteedosTriggerContextConfig } from "./trigger";
import { getSteedosSchema } from "./schema";

export async function brokeEmitEvents(objectName: string, method: string, context: SteedosTriggerContextConfig) {
    if (method == 'insert' || method == 'update' || method == 'delete') {
        let schema = getSteedosSchema();
        let when = "";
        let id;
        if (method == 'insert') {
            when = 'created';
            id = context.doc._id;
        } else if (method == 'update') {
            when = 'updated';
            id = context.id;
        } else if (method == 'delete') {
            when = 'deleted';
            id = context.id;
        }
        let payload = {
            objectApiName: objectName,
            recordId: id,
            userId: context.userId,
            spaceId: context.spaceId
        };
        if (schema.broker) {
            await schema.broker.emit(`#${objectName}.${when}`, payload);
        }
    }

}