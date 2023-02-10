/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2023-02-06 17:28:29
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2023-02-06 17:38:03
 * @Description: 
 */
import { getSteedosSchema, SteedosObjectTypeConfig } from "../../..";
import { getObjectServiceName } from "../..";
import {
    correctName,
    _getRelatedType,
} from "./utils"
import { GRAPHQL_ACTION_PREFIX, RELATED_PREFIX } from "./consts";

export async function dealWithRelatedFields(
    objectConfig: SteedosObjectTypeConfig,
    graphql
) {
    let steedosSchema = getSteedosSchema();
    let objectName = objectConfig.name;
    let obj = steedosSchema.getObject(objectName);

    const relationsInfo = await obj.getRelationsInfo();
    let detailsInfo = relationsInfo.details || [];
    let lookupsInfo = relationsInfo.lookup_details || [];

    let relatedInfos = detailsInfo.concat(lookupsInfo);
    for (const info of relatedInfos) {
        if (!info.startsWith("__")) {
            let infos = info.split(".");
            let detailObjectApiName = infos[0];
            let detailFieldName = infos[1];
            let relatedFieldName = correctName(
                `${RELATED_PREFIX}_${detailObjectApiName}_${detailFieldName}`
            );
            let relatedType = _getRelatedType(relatedFieldName, detailObjectApiName);
            if (graphql.type.indexOf(relatedType) > -1) {
                // 防止重复定义field
                continue;
            }
            graphql.type =
                graphql.type.substring(0, graphql.type.length - 1) + relatedType + "}";
            graphql.resolvers[objectName][relatedFieldName] = getRelatedResolver(
                objectName,
                detailObjectApiName,
                detailFieldName,
                ""
            );
        }
    }
}

export function getRelatedResolver(
    objectApiName,
    detailObjectApiName,
    detailFieldName,
    detailFieldReferenceToFieldName
) {
    return {
        action: `${getObjectServiceName(
            detailObjectApiName
        )}.${GRAPHQL_ACTION_PREFIX}${RELATED_PREFIX}`,
        rootParams: {
            _id: "_parentId",
        },
        params: {
            _related_params: {
                objectName: detailObjectApiName,
                parentObjectName: objectApiName,
                fieldName: detailFieldName,
                referenceToParentFieldName: detailFieldReferenceToFieldName,
            },
        },
    };
}