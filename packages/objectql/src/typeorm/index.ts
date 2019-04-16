import { EntitySchema } from "typeorm";
import { Dictionary } from "@salesforce/ts-types";
import { SteedosObjectType, SteedosFieldType } from "../types";
import { SteedosColumnType } from "../driver";

export function getTableColumnType(field: SteedosFieldType): string {
    let fieldType: SteedosColumnType = field.columnType;
    switch (fieldType) {
        case SteedosColumnType.text:
            return "varchar";
        case SteedosColumnType.number:
            let scale = field.scale === undefined ? 0 : field.scale;
            if (scale === 0){
                return "int";
            }
            return "double";
        case SteedosColumnType.varchar:
            return "varchar";
    }
    return null;
};

export function getTableColumns(fields: Dictionary<SteedosFieldType>): any {
    let columns: any = {};
    for (let fieldName in fields) {
        let field = fields[fieldName];
        let fieldType: string = getTableColumnType(field);
        let nullable = field.required ? false : true;
        columns[fieldName] = {
            type: fieldType,
            nullable: nullable,
            primary: field.primary,
            generated: field.generated
        };
    }
    return columns;
}

export function getEntity(object: SteedosObjectType): EntitySchema {
    let tableName = object.tableName;
    let fields = object.fields;
    let columns: any = getTableColumns(fields);
    return new EntitySchema({
        name: tableName,
        tableName: tableName,
        columns: columns
    });
}

export function getEntities(objects: Dictionary<SteedosObjectType>): Dictionary<EntitySchema> {
    let entities: Dictionary<EntitySchema> = {};
    for (let name in objects) {
        let object = objects[name];
        entities[object.tableName] = getEntity(object);
    }
    return entities;
}