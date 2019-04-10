import { QueryRunner, Table } from "typeorm";
import { Dictionary } from "@salesforce/ts-types";
import { SteedosObjectType, SteedosFieldTypeConfig } from "../types";

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


export function getTableColumnsByFields(fields: Dictionary<SteedosFieldTypeConfig>): any[] {
    let columns: any[] = [];
    for (let fieldName in fields) {
        let field = fields[fieldName];
        let fieldType: string = getTableColumnTypeByField(field);
        let nullable = field.required ? false : true;
        columns.push({
            name: fieldName,
            type: fieldType,
            nullable: nullable
        });
    }
    return columns;
}

export async function dropTable(queryRunner: QueryRunner, tableName: string) {
    await queryRunner.dropTable(tableName, true);
}

export async function dropTables(queryRunner: QueryRunner, objects: Dictionary<SteedosObjectType>) {
    for (let objectName in objects) {
        let currentObject = objects[objectName];
        let tableName = currentObject.tableName;
        await queryRunner.dropTable(tableName, true);
    }
}

export async function createTable(queryRunner: QueryRunner, object: SteedosObjectType) {
    let tableName = object.tableName;
    let fields = object.fields;
    let columns: any[] = this.getTableColumnsByFields(fields);
    await queryRunner.createTable(new Table({
        name: tableName,
        columns: columns
    }), true);
}

export async function createTables(queryRunner: QueryRunner, objects: Dictionary<SteedosObjectType>) {
    for (let objectName in objects) {
        let currentObject = objects[objectName];
        let tableName = currentObject.tableName;
        let fields = currentObject.fields;
        let columns: any[] = this.getTableColumnsByFields(fields);
        await queryRunner.createTable(new Table({
            name: tableName,
            columns: columns
        }), true);
    }
}