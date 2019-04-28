// import { SteedosSchema, SteedosDatabaseDriverType } from '../../../src';

// let url = "mssql://sa:hotoainc.@192.168.0.190/hotoa_main_stock";//不提供url值时不运行单元测试
// let tdsVersion = "7_2";//不提供TDS值时默认取7_4表示2012+
// let tableName = "SimulateStockInfo";

// describe(`temp test for ${tableName} on url:${url}`, () => {

//     it('test1', async () => {
//         let mySchema = new SteedosSchema({
//             datasources: {
//                 default: {
//                     url: url,
//                     driver: SteedosDatabaseDriverType.SqlServer,
//                     options: {
//                         tdsVersion: tdsVersion
//                     },
//                     logging: false,
//                     objects: {
//                         test: {
//                             label: 'SqlServer Schema',
//                             tableName: tableName,
//                             fields: {
//                                 stockCode: {
//                                     type: "text",
//                                     primary: true
//                                 },
//                                 stockName: {
//                                     type: "text",
//                                     label: "名称"
//                                 },
//                                 jysmc: {
//                                     type: "text",
//                                     label: "交易所名称"
//                                 }
//                             }
//                         }
//                     }
//                 }
//             }
//         });
//         const datasource = mySchema.getDataSource("default");
//         await datasource.createTables();
//         let reault = await mySchema.getObject("test").find({
//             // filters: "((contains(tolower(stockCode),'000521'))) or ((contains(tolower(stockName),'000521'))) or ((contains(tolower(jysmc),'000521')))",
//             filters: "((contains(stockCode,'000521'))) or ((contains(stockName,'000521'))) or ((contains(jysmc,'000521')))",
//             fields: ["stockCode", "stockName", "jysmc"],
//             top: 5,
//             sort: "stockName"
//         });
//         console.log("reault:", reault);
//         let count = await mySchema.getObject("test").count({
//             // filters: "((contains(tolower(stockCode),'000521'))) or ((contains(tolower(stockName),'000521'))) or ((contains(tolower(jysmc),'000521')))",
//             filters: "((contains(stockCode,'000521'))) or ((contains(stockName,'000521'))) or ((contains(jysmc,'000521')))",
//             fields: ["stockCode", "stockName", "jysmc"],
//             top: 5,
//             sort: "stockName"
//         });
//         console.log("count:", count);
//     });
// });
