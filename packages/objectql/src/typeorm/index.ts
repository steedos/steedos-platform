import { EntitySchema, ColumnType, EntitySchemaColumnOptions, EntitySchemaRelationOptions } from "typeorm";
import { Dictionary } from "@salesforce/ts-types";
import { SteedosObjectType, SteedosFieldType, SteedosSchema } from "../types";
import { SteedosColumnType } from "../driver";

export interface EntitySchemaColumnDictionary {
    [x: string]: EntitySchemaColumnOptions;
}
export interface EntitySchemaRelationDictionary {
    [x: string]: EntitySchemaRelationOptions;
}

export type RelationType = "one-to-one" | "one-to-many" | "many-to-one" | "many-to-many";

export function getTableColumnType(field: SteedosFieldType, schema: SteedosSchema): ColumnType {
    let columnType: SteedosColumnType = field.columnType;
    switch (columnType) {
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
        case SteedosColumnType.oneToOne:
            let referenceTo = <string>field.reference_to;
            let referenceToObject = schema.getObject(referenceTo);
            if (!referenceToObject){
                throw new Error(`Can not find the object reference to ${referenceTo}`);
            }
            let referenceToPrimaryField = referenceToObject.primaryField;
            if (referenceToPrimaryField){
                if (referenceToPrimaryField.type === "number"){
                    return "int";
                }
                return "varchar";
            }
            else{
                throw new Error(`Can not find the primaryField of the object reference to ${referenceTo}`);
            }
        case SteedosColumnType.oneToMany:
            return null;
        case SteedosColumnType.manyToOne:
            return null;
        case SteedosColumnType.manyToMany:
            return null;
    }
    return "varchar";
};


export function getTableRelationType(field: SteedosFieldType): RelationType {
    let columnType: SteedosColumnType = field.columnType;
    switch (columnType) {
        case SteedosColumnType.oneToOne:
            return "one-to-one";
        // case SteedosColumnType.oneToMany:
        //     return "one-to-many";
        // case SteedosColumnType.manyToOne:
        //     return "many-to-one";
        // case SteedosColumnType.manyToMany:
        //     return "many-to-many";
    }
    return null;
};

export function getTableColumns(fields: Dictionary<SteedosFieldType>, schema: SteedosSchema): EntitySchemaColumnDictionary {
    let columns: EntitySchemaColumnDictionary = {};
    for (let fieldName in fields) {
        let field = fields[fieldName];
        let fieldType: ColumnType = getTableColumnType(field, schema);
        if (!fieldType){
            continue;
        }
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

export function getEntity(object: SteedosObjectType, schema: SteedosSchema): EntitySchema {
    let tableName = object.tableName;
    let fields = object.fields;
    let columns: EntitySchemaColumnDictionary = getTableColumns(fields, schema);
    return new EntitySchema({
        name: tableName,
        tableName: tableName,
        columns: columns
    });
}

export function getEntities(objects: Dictionary<SteedosObjectType>, schema: SteedosSchema): Dictionary<EntitySchema> {
    let entities: Dictionary<EntitySchema> = {};
    for (let name in objects) {
        let object = objects[name];
        entities[object.tableName] = getEntity(object, schema);
    }
    return entities;
}