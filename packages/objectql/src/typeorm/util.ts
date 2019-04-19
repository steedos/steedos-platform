import { EntitySchema, ColumnType, EntitySchemaColumnOptions, EntitySchemaRelationOptions, Repository } from "typeorm";
import { Dictionary } from "@salesforce/ts-types";
import { SteedosObjectType, SteedosFieldType } from "../types";
import { SteedosColumnType } from "../driver";

export interface EntitySchemaColumnDictionary {
    [x: string]: EntitySchemaColumnOptions;
}
export interface EntitySchemaRelationDictionary {
    [x: string]: EntitySchemaRelationOptions;
}

export type RelationType = "one-to-one" | "one-to-many" | "many-to-one" | "many-to-many";

export function getTableColumnType(field: SteedosFieldType): ColumnType {
    let columnType: SteedosColumnType = field.columnType;
    switch (columnType) {
        case SteedosColumnType.varchar:
            return "varchar";
        case SteedosColumnType.text:
            return "text";
        case SteedosColumnType.number:
            let scale = field.scale === undefined ? 0 : field.scale;
            if (scale === 0){
                return "int";
            }
            return "double";
        case SteedosColumnType.dateTime:
            return "datetime";
        case SteedosColumnType.date:
            return "date";
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

export function getTableColumns(fields: Dictionary<SteedosFieldType>): EntitySchemaColumnDictionary {
    let columns: EntitySchemaColumnDictionary = {};
    for (let fieldName in fields) {
        let field = fields[fieldName];
        let fieldType: ColumnType = getTableColumnType(field);
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

export function getEntity(object: SteedosObjectType): EntitySchema {
    let tableName = object.tableName;
    let fields = object.fields;
    let columns: EntitySchemaColumnDictionary = getTableColumns(fields);
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

export function getPrimaryKey(repository: Repository<any>): string {
    let primaryColumns: any = repository.metadata.primaryColumns;
    let primaryKey: string;
    if (primaryColumns && primaryColumns.length) {
        primaryKey = primaryColumns[0].propertyPath;
    }
    return primaryKey;
}