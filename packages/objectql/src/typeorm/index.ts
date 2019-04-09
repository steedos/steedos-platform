import { createConnection, QueryRunner, Table } from "typeorm";
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


//TODO:引用typeorm，使用queryRunner.createTable函数，根据传入的objects，生成各个表结构
export default async function buildDatabase(options: any, objects: Dictionary<SteedosObjectType>) {
    const connection = await createConnection(options);
    const queryRunner: QueryRunner = await connection.driver.createQueryRunner("master");
    for (let objectName in objects){
        let currentObject = objects[objectName];
        let tableName = currentObject.tableName;
        let fields = currentObject.fields;
        let columns: any[] = this.getTableColumnsByFields(fields);
        await queryRunner.dropTable(tableName, true);
        await queryRunner.createTable(new Table({
            name: tableName,
            columns: columns
        }), true);
    }
}