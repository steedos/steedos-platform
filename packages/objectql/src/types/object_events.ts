import { SteedosTriggerContextConfig } from "./trigger";
import { getSteedosSchema } from "./schema";

export async function brokeEmitEvents(objectName: string, method: string, context: SteedosTriggerContextConfig) {
    if (method == 'insert' || method == 'update' || method == 'delete') {
        let schema = getSteedosSchema();
        let when = "";
        let id;
        let isInsert = false;
        let isUpdate = false;
        let isDelete = false;
        if (method == 'insert') {
            when = 'inserted';
            id = context.doc._id;
            isInsert = true;
        } else if (method == 'update') {
            when = 'updated';
            id = context.id;
            isUpdate = true;
        } else if (method == 'delete') {
            when = 'deleted';
            id = context.id;
            isDelete = true;
        }
        let payload = {
            objectApiName: objectName,
            recordId: id,
            userId: context.userId,
            spaceId: context.spaceId,
            isInsert,
            isUpdate,
            isDelete
        };
        if (schema.broker) {
            await schema.broker.emit(`#${objectName}.${when}`, payload);
        }
    }

}