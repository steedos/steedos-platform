// import { SteedosSchema, SteedosSqlite3Driver, SteedosDatabaseDriverType } from '../../../../src';
// import { expect } from 'chai';
// import path = require("path");

// let databaseUrl = path.join(__dirname, "sqlite-test.db");
// // let databaseUrl = ':memory:';
// let tableNamePost = "TestOneToOnePostForSqlite3";
// let tableNameCategory = "TestOneToOneCategoryForSqlite3";
// let driver: SteedosSqlite3Driver;

// describe('one to one for sqlite3 database', () => {
//     try {
//         require("sqlite3");
//     }
//     catch (ex) {
//         return true;
//     }
//     let result: any;
//     let expected: any;
//     let testIndex: number = 0;

//     let tests = [
//         {
//             title: "create one post",
//             table: tableNamePost,
//             method: "insert",
//             data: { id: 1, name: "PTR", category: 1 },
//             expected: {
//                 returnRecord: { id: 1, name: "PTR", category: 1 }
//             }
//         },
//         {
//             title: "create one category",
//             table: tableNameCategory,
//             method: "insert",
//             data: { id: 1, name: "C1" },
//             expected: {
//                 returnRecord: { id: 1, name: "C1" }
//             }
//         },
//         {
//             title: "create the second category",
//             table: tableNameCategory,
//             method: "insert",
//             data: { id: 2, name: "C2" },
//             expected: {
//                 returnRecord: { id: 2, name: "C2" }
//             }
//         },
//         {
//             title: "update the post's category",
//             table: tableNamePost,
//             method: "update",
//             id: 1,
//             data: { category: 2 },
//             expected: {
//                 returnRecord: { id: 1, category: 2 }
//             }
//         },
//         {
//             title: "read the post record",
//             table: tableNamePost,
//             method: "findOne",
//             id: 1,
//             queryOptions: {
//                 fields: ["name", "category"]
//             },
//             expected: {
//                 returnRecord: { category: 2 }
//             }
//         },
//         {
//             title: "read the category record",
//             table: tableNameCategory,
//             method: "findOne",
//             id: 1,
//             queryOptions: {
//                 fields: ["name"]
//             },
//             expected: {
//                 returnRecord: { name: "C1" }
//             }
//         },
//         {
//             title: "delete one record",
//             table: tableNamePost,
//             method: "delete",
//             id: 1,
//             expected: {
//                 eq: undefined
//             }
//         }
//     ];

//     before(async () => {
//         let mySchema = new SteedosSchema({
//             datasources: {
//                 default: {
//                     driver: SteedosDatabaseDriverType.Sqlite,
//                     url: databaseUrl,
//                     objects: {
//                         post: {
//                             label: '文章',
//                             tableName: tableNamePost,
//                             fields: {
//                                 id: {
//                                     label: '主键',
//                                     type: 'number',
//                                     primary: true
//                                 },
//                                 name: {
//                                     label: '标题',
//                                     type: 'text',
//                                     required: true
//                                 },
//                                 category: {
//                                     label: '所属分类',
//                                     type: 'lookup',
//                                     reference_to: "category"
//                                 }
//                             }
//                         },
//                         category: {
//                             label: '分类',
//                             tableName: tableNameCategory,
//                             fields: {
//                                 id: {
//                                     label: '主键',
//                                     type: 'number',
//                                     primary: true
//                                 },
//                                 name: {
//                                     label: '名称',
//                                     type: 'text'
//                                 }
//                             }
//                         }
//                     }
//                 }
//             }
//         });
//         const datasource = mySchema.getDataSource("default");
//         await datasource.dropEntities();
//         await datasource.createTables();
//         driver = <SteedosSqlite3Driver>datasource.adapter;
//     });

//     beforeEach(async () => {
//         let tableName = tests[testIndex].table;
//         let data = tests[testIndex].data;
//         let method = tests[testIndex].method;
//         let id = tests[testIndex].id;
//         let queryOptions = tests[testIndex].queryOptions;
//         expected = tests[testIndex].expected;
//         if (id) {
//             result = await driver[method](tableName, id, data || queryOptions).catch((ex: any) => { console.error(ex); return false; });
//         }
//         else {
//             result = await driver[method](tableName, data).catch((ex: any) => { console.error(ex); return false; });
//         }
//     });

//     tests.forEach(async (test) => {
//         it(`arguments:${JSON.stringify(test)}`, async () => {
//             testIndex++;
//             if (expected.error !== undefined) {
//                 expect(result.message).to.be.eq(expected.error);
//             }
//             if (expected.length !== undefined) {
//                 expect(result).to.be.length(expected.length);
//             }
//             if (expected.gt !== undefined) {
//                 expect(result).to.be.gt(expected.gt);
//             }
//             if (expected.eq !== undefined) {
//                 expect(result).to.be.eq(expected.eq);
//             }
//             if (expected.returnRecord !== undefined) {
//                 Object.keys(expected.returnRecord).forEach((key) => {
//                     expect(result).to.be.not.eq(undefined);
//                     if (result){
//                         expect(result[key]).to.be.eq(expected.returnRecord[key]);
//                     }
//                 });
//             }
//         });
//     });
// });
