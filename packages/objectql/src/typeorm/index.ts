import { EntitySchema } from "typeorm";
import { Dictionary } from "@salesforce/ts-types";
import { SteedosObjectTypeConfig, SteedosFieldTypeConfig } from "../types";

export function getTableColumnType(field: SteedosFieldTypeConfig): string {
    let fieldType: string = field.type;
    switch (fieldType) {
        case "text":
            return "varchar";
        case "number":
            let scale = field.scale === undefined ? 0 : field.scale;
            if (scale === 0){
                return "int";
            }
            return "double";
    }
    return "varchar";
};

export function getTableColumns(fields: Dictionary<SteedosFieldTypeConfig>): any {
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

export function getEntity(object: SteedosObjectTypeConfig): EntitySchema {
    let tableName = object.tableName;
    let fields = object.fields;
    let columns: any = getTableColumns(fields);
    return new EntitySchema({
        name: tableName,
        tableName: tableName,
        columns: columns
    });
}

export function getEntities(objects: Dictionary<SteedosObjectTypeConfig>): Dictionary<EntitySchema> {
    let entities: Dictionary<EntitySchema> = {};
    for (let name in objects) {
        let object = objects[name];
        entities[object.tableName] = getEntity(object);
    }
    return entities;
}