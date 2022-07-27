"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDefaultBiSchema = exports.SteedosBiSchema = void 0;
const mongodb_1 = require("mongodb");
class SteedosBiSchema {
    constructor() {
        this.biSchema = new BiSchema();
    }
    append(objectConfigs, dbName) {
        for (const object of objectConfigs) {
            parseSchemaData(object.metadata, dbName, this.biSchema.schema);
        }
        return this;
    }
    toJson() {
        return this.biSchema;
    }
}
exports.SteedosBiSchema = SteedosBiSchema;
class BiSchema {
    constructor() {
        this._id = new mongodb_1.ObjectId();
        this.created = new Date();
        this.schema = new Schema();
    }
}
class Schema {
    constructor() {
        this.databases = [];
    }
}
class BiDatabase {
    constructor() {
        this.tables = [];
    }
    append(object) {
        return objectToBiTable(object, undefined, object.name, object.name, this.tables);
    }
}
class BiTable {
    constructor() {
        this.pipeline = '[]';
        this.columns = []; // 
    }
}
class BiColumn {
}
class BiPipeline {
    constructor() {
        this.$unwind = new BiPipelineUnwind();
    }
}
class BiPipelineUnwind {
    constructor() {
        this.preserveNullAndEmptyArrays = false;
    }
}
function parseSchemaData(object, dbName, schema) {
    if (object.is_deleted) {
        return;
    }
    if (!dbName) {
        throw new Error('dbName is required');
    }
    let currentDatabase;
    for (let database of schema.databases) {
        if (database.name == dbName) {
            currentDatabase = database;
            break;
        }
    }
    if (!currentDatabase) {
        currentDatabase = new BiDatabase();
        currentDatabase.name = dbName;
        schema.databases.push(currentDatabase);
    }
    let table = currentDatabase.append(object);
    table.mongo_name = object.name;
    table.sql_name = object.name;
}
class ComplexField {
    constructor() {
        this.subFields = {}; // subFields
    }
}
function storeField(field, fieldName, complexFields) {
    let found = false;
    for (let complexField of complexFields) {
        //可能有先存了子表的情况
        if (complexField.fieldName.startsWith(`${fieldName}.`)) {
            complexField.subFields[complexField.fieldName] = complexField.field;
            complexField.fieldName = fieldName;
            complexField.field = field;
            found = true;
            break;
        }
        if (fieldName.startsWith(`${complexField.fieldName}.`)) {
            complexField.subFields[fieldName] = field;
            found = true;
            break;
        }
    }
    if (!found) {
        var complexField = new ComplexField();
        complexField.fieldName = fieldName;
        complexField.field = field;
        complexFields.push(complexField);
    }
}
/**
 *
 * @param object
 * @param parentSqlTableName
 * @param sqlTableName 拆开的子表名
 * @param mongoCollectionName 最初的主表名
 * @param tables
 */
function objectToBiTable(object, parentSqlTableName, sqlTableName, mongoCollectionName, tables, count = 1) {
    var complexFields = [];
    for (let fieldName in object.fields) {
        let field = object.fields[fieldName];
        if (field.type == 'grid' || field['multiple']) { //|| field.type == 'object' 
            storeField(field, fieldName, complexFields);
            delete object.fields[fieldName]; // 先从整体中拿走
        }
    }
    //找出分表的其他属性
    for (let fieldName in object.fields) {
        for (let complexField of complexFields) {
            if (fieldName.startsWith(`${complexField.fieldName}.`)) {
                complexField.subFields[fieldName] = object.fields[fieldName];
                delete object.fields[fieldName];
            }
        }
    }
    //遍历分表，递归生成子表结构
    for (let complexField of complexFields) {
        var subObj = { fields: complexField.subFields }; //做一个类似object的结构
        if (complexField.field['multiple']) {
            delete complexField.field['multiple'];
            subObj.fields[complexField.fieldName] = complexField.field;
        }
        if (parentSqlTableName) {
            sqlTableName = `${parentSqlTableName}_${sqlTableName}`;
        }
        let table = objectToBiTable(subObj, sqlTableName, complexField.fieldName, mongoCollectionName, tables, count);
        table.mongo_name = mongoCollectionName;
        table.sql_name = `${sqlTableName}_${complexField.fieldName}`;
    }
    var table = new BiTable();
    tables.push(table);
    for (let fieldName in object.fields) {
        // if(fieldName.endsWith('.$')){
        //     continue;
        // }
        let field = object.fields[fieldName];
        fieldName = fieldName.split('.$').join('');
        var column = new BiColumn();
        column.mongo_name = fieldName;
        column.sql_name = fieldName;
        setColumnTypeByField(column, field.type, field);
        table.columns.push(column);
    }
    var column = new BiColumn();
    column.mongo_name = '_id';
    column.sql_name = '_id';
    column.mongo_type = 'string'; // 'bson.ObjectId';
    column.sql_type = 'varchar';
    table.columns.push(column);
    if (parentSqlTableName) {
        var column = new BiColumn();
        column.mongo_name = `${sqlTableName}_idx`;
        column.sql_name = `${sqlTableName}_idx`;
        column.mongo_type = 'int'; // 'bson.ObjectId';
        column.sql_type = 'int';
        table.columns.push(column);
        var pipelineItem = new BiPipeline();
        pipelineItem.$unwind.includeArrayIndex = `${sqlTableName}_idx`;
        pipelineItem.$unwind.path = `$${sqlTableName}`;
        pipelineItem.$unwind.preserveNullAndEmptyArrays = false;
        table.pipeline = JSON.stringify([pipelineItem]);
    }
    return table;
}
function setColumnTypeByField(column, fieldType, field) {
    switch (fieldType) {
        case 'currency':
        case 'percent':
        case 'number':
            column.mongo_type = 'float64';
            column.sql_type = 'numeric';
            break;
        case 'formula':
        case 'summary':
            setColumnTypeByField(column, field.data_type, field);
            break;
        case 'boolean':
            column.mongo_type = 'bool';
            column.sql_type = 'int'; // 
            break;
        case 'date':
            column.mongo_type = 'timestamp';
            column.sql_type = 'date';
            break;
        case 'datetime':
            column.mongo_type = 'timestamp';
            column.sql_type = 'timestamp'; // 
            break;
        case 'lookup':
        case 'master_detail':
        case 'image':
            column.mongo_type = 'string';
            column.sql_type = 'varchar';
            break;
        case 'textarea': // 无需使用longtext，varchar可以超过256
        case 'text':
        case 'html':
        case 'password':
        case 'url':
        case 'email':
        case 'select':
        case 'autonumber':
        default:
            column.mongo_type = 'string';
            column.sql_type = 'varchar';
            break;
    }
}
/**
 *
 * @param biSchema
 * @param mongoUrl --schemaSource,
 */
async function setDefaultBiSchema(biSchema, mongoUrl) {
    if (!mongoUrl) {
        throw new Error('mongoUrl is required');
    }
    var client = new mongodb_1.MongoClient(mongoUrl);
    await client.connect();
    await client.db().collection('schemas').insertOne(biSchema);
    var filter = {
        _id: 'defaultSchema'
    };
    var defaultSchema = await client.db().collection('names').findOne(filter);
    if (!defaultSchema) {
        await client.db().collection('names').insertOne({
            _id: 'defaultSchema',
            schema_id: biSchema._id,
        });
    }
    else {
        await client.db().collection('names').updateOne(filter, { $set: {
                schema_id: biSchema._id,
            } });
    }
}
exports.setDefaultBiSchema = setDefaultBiSchema;
//# sourceMappingURL=biSchema.js.map