import { EntitySchema, ColumnType, EntitySchemaColumnOptions, EntitySchemaRelationOptions, Repository, DatabaseType } from "typeorm";
import { Dictionary } from "@salesforce/ts-types";
import { SteedosObjectType, SteedosFieldType } from "../types";
import { SteedosFieldDBType } from "../driver";

export interface EntitySchemaColumnDictionary {
    [x: string]: EntitySchemaColumnOptions;
}
export interface EntitySchemaRelationDictionary {
    [x: string]: EntitySchemaRelationOptions;
}

export type RelationType = "one-to-one" | "one-to-many" | "many-to-one" | "many-to-many";

export function getTableColumnType(field: SteedosFieldType, databaseType: DatabaseType): ColumnType {
    let columnType: SteedosFieldDBType = field.fieldDBType;
    switch (columnType) {
        case SteedosFieldDBType.varchar:
            return String;
        case SteedosFieldDBType.text:
            if (databaseType === "oracle"){
                return "blob";
            }
            return "text";
        case SteedosFieldDBType.number:
            let scale = field.scale === undefined ? 0 : field.scale;
            if (scale === 0){
                return "int";
            }
            return "decimal";
        case SteedosFieldDBType.dateTime:
            return Date;
        case SteedosFieldDBType.date:
            if (databaseType === "postgres") {
                // postgres数据库日期类型返回的最终是字符串，类似于：2019-04-30
                return "date";
            }
            return Date;
        case SteedosFieldDBType.boolean:
            return Boolean;
    }
    return columnType || String;
};

export function getTableColumns(fields: Dictionary<SteedosFieldType>, object: SteedosObjectType, databaseType: DatabaseType): EntitySchemaColumnDictionary {
    let columns: EntitySchemaColumnDictionary = {};
    let primaryColumnCount = 0;
    for (let fieldName in fields) {
        let field = fields[fieldName];
        let fieldType: ColumnType = getTableColumnType(field, databaseType);
        if (!fieldType){
            continue;
        }
        let nullable = field.required ? false : true;
        if (field.primary){
            nullable = false;
            primaryColumnCount++;
        }
        columns[fieldName] = {
            type: fieldType,
            nullable: nullable,
            primary: field.primary,
            generated: field.generated,
            precision: field.precision ? field.precision : (field.scale ? 18 : undefined),
            scale: field.scale
        };
    }
    if (!primaryColumnCount){
        console.error(`Table "${object.tableName}" does not have a primary column. Primary column is not required in DB, but is required in yml object file.`);
    }
    return columns;
}

export function getEntity(object: SteedosObjectType, databaseType: DatabaseType): EntitySchema {
    let tableName = object.tableName;
    let fields = object.fields;
    let columns: EntitySchemaColumnDictionary = getTableColumns(fields, object, databaseType);
    // typeorm支持对象类型:"regular" | "view" | "junction" | "closure" | "closure-junction" | "entity-child";
    let type: any = "regular";
    if (object.is_view){
        type = "view";
    }
    return new EntitySchema({
        name: tableName,
        tableName: tableName,
        columns: columns,
        type: type
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