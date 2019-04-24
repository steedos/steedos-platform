import { EntitySchema, ColumnType, EntitySchemaColumnOptions, EntitySchemaRelationOptions, Repository, DatabaseType } from "typeorm";
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

export function getTableColumnType(field: SteedosFieldType, databaseType: DatabaseType): ColumnType {
    let columnType: SteedosColumnType = field.columnType;
    switch (columnType) {
        case SteedosColumnType.varchar:
            return String;
        case SteedosColumnType.text:
            if (databaseType === "oracle"){
                return "blob";
            }
            return "text";
        case SteedosColumnType.number:
            let scale = field.scale === undefined ? 0 : field.scale;
            if (scale === 0){
                return "int";
            }
            return "decimal";
        case SteedosColumnType.dateTime:
            return Date;
        case SteedosColumnType.date:
            return Date;
        case SteedosColumnType.boolean:
            return Boolean;
    }
    return String;
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

export function getTableColumns(fields: Dictionary<SteedosFieldType>, databaseType: DatabaseType): EntitySchemaColumnDictionary {
    let columns: EntitySchemaColumnDictionary = {};
    for (let fieldName in fields) {
        let field = fields[fieldName];
        let fieldType: ColumnType = getTableColumnType(field, databaseType);
        if (!fieldType){
            continue;
        }
        let nullable = field.required ? false : true;
        columns[fieldName] = {
            type: fieldType,
            nullable: nullable,
            primary: field.primary,
            generated: field.generated,
            precision: field.precision ? field.precision : (field.scale ? 18 : undefined),
            scale: field.scale
        };
    }
    return columns;
}

export function getEntity(object: SteedosObjectType, databaseType: DatabaseType): EntitySchema {
    let tableName = object.tableName;
    let fields = object.fields;
    let columns: EntitySchemaColumnDictionary = getTableColumns(fields, databaseType);
    return new EntitySchema({
        name: tableName,
        tableName: tableName,
        columns: columns
    });
}

export function getEntities(objects: Dictionary<SteedosObjectType>, databaseType: DatabaseType): Dictionary<EntitySchema> {
    let entities: Dictionary<EntitySchema> = {};
    for (let name in objects) {
        let object = objects[name];
        entities[object.tableName] = getEntity(object, databaseType);
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