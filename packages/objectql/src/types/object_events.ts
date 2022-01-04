import { SteedosTriggerContextConfig } from "./trigger";
import { getSteedosSchema } from "./schema";
import { getObjectServiceName } from '../services/index';
import { generateActionParams } from "../util";

export async function brokeEmitEvents(objectName: string, method: string, context: SteedosTriggerContextConfig) {
    if (method == 'insert' || method == 'update' || method == 'delete') {
        let schema = getSteedosSchema();
        let when = "";
        // let id;
        // let isInsert = false;
        // let isUpdate = false;
        // let isDelete = false;
        if (method == 'insert') {
            when = 'inserted';
            // id = context.doc._id;
            // isInsert = true;
        } else if (method == 'update') {
            when = 'updated';
            // id = context.id;
            // isUpdate = true;
        } else if (method == 'delete') {
            when = 'deleted';
            // id = context.id;
            // isDelete = true;
        }
        // let payload = {
        //     objectApiName: objectName,
        //     recordId: id,
        //     userId: context.userId,
        //     spaceId: context.spaceId,
        //     isInsert,
        //     isUpdate,
        //     isDelete
        // };
        let params = generateActionParams(`after.${method}`, context)
        let payload = Object.assign({}, {objectApiName: objectName}, params)
        if (schema.broker) {
            await schema.broker.emit(`${getObjectServiceName(objectName)}.${when}`, payload);
        }
    }

}