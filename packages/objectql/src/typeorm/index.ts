import { QueryRunner, Table, EntitySchema } from "typeorm";
import { Dictionary } from "@salesforce/ts-types";
import { SteedosObjectTypeConfig, SteedosFieldTypeConfig } from "../types";

export function getTableColumnTypeByField(field: SteedosFieldTypeConfig): string {
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

export function getTableColumnsByFields(fields: Dictionary<SteedosFieldTypeConfig>): any {
    let columns: any = {};
    for (let fieldName in fields) {
        let field = fields[fieldName];
        let fieldType: string = getTableColumnTypeByField(field);
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
    let columns: any = getTableColumnsByFields(fields);
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

export function getTableColumnOptions(entitySchemaOptions: any): any[]{
    let options = [];
    for (let name in entitySchemaOptions) {
        let option = entitySchemaOptions[name];
        options.push({
            name: name,
            type: option.type,
            nullable: option.nullable,
            primary: option.primary,
            generated: option.generated
        });
    }
    return options;
}

export async function dropTable(queryRunner: QueryRunner, object: EntitySchema | SteedosObjectTypeConfig | string) {
    let tableName: string;
    if (object instanceof EntitySchema) {
        tableName = object.options.name;
    }
    else if (typeof object == "string") {
        tableName = object;
    }
    else{
        tableName = object.tableName;
    }
    await queryRunner.dropTable(tableName, true);
}

export async function dropTables(queryRunner: QueryRunner, objects: Dictionary<EntitySchema> | Dictionary<SteedosObjectTypeConfig>) {
    for (let name in objects) {
        await dropTable(queryRunner, objects[name]);
    }
}

export async function createTable(queryRunner: QueryRunner, object: EntitySchema | SteedosObjectTypeConfig) {
    let entity: EntitySchema;
    if (object instanceof EntitySchema){
        entity = <EntitySchema>object;
    }
    else{
        entity = getEntity(<SteedosObjectTypeConfig>object);
    }
    const columns: any[] = getTableColumnOptions(entity.options.columns);
    await queryRunner.createTable(new Table({
        name: entity.options.name,
        columns: columns
    }), true);
}

export async function createTables(queryRunner: QueryRunner, objects: Dictionary<EntitySchema> | Dictionary<SteedosObjectTypeConfig>) {
    for (let name in objects) {
        await createTable(queryRunner, objects[name]);
    }
}