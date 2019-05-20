import { SteedosSchema, SteedosMySqlDriver, SteedosDatabaseDriverType } from '../../../../src';
import { expect } from 'chai';

const host = process.env.DRIVER_MYSQL_Host;//不提供host值时不运行单元测试
const username = process.env.DRIVER_MYSQL_Username;
const password = process.env.DRIVER_MYSQL_Password;
const database = process.env.DRIVER_MYSQL_Database;
let tableName = "TestFieldTypesForMySql";
let driver: SteedosMySqlDriver;

describe('basic field types for mysql database', () => {
    if (!host) {
        return true;
    }
    try {
        require("mysql");
    }
    catch (ex) {
        return true;
    }
    let result: any;
    let expected: any;
    let testIndex: number = 0;

    let tests = [
        {
            title: "create one record",
            method: "insert",
            data: { text: "text", textarea: "textarea", int: 10, floatnumber: 46.25, datefield: new Date('2019-04-30T00:00:00.000Z'), datetimefield: new Date('2019-04-30T09:00:00.000Z'), timestampfield: new Date('2019-04-30T09:00:00.000Z'), bool: true },
            expected: {
                returnRecord: { text: "text", textarea: "textarea", int: 10, floatnumber: '46.2500', datefield: new Date('2019-04-30T00:00:00.000Z'), datetimefield: new Date('2019-04-30T09:00:00.000Z'), timestampfield: new Date('2019-04-30T09:00:00.000Z'), bool: true }
            }
        }
    ];

    before(async () => {
        let mySchema = new SteedosSchema({
            datasources: {
                default: {
                    host: host,
                    username: username,
                    password: password,
                    database: database,
                    driver: SteedosDatabaseDriverType.MySql,
                    objects: {
                        test: {
                            label: 'MySql Schema',
                            tableName: tableName,
                            fields: {
                                id: {
                                    label: '主键',
                                    type: 'number',
                                    primary: true,
                                    generated: true
                                },
                                text: {
                                    label: '文本',
                                    type: 'text'
                                },
                                textarea: {
                                    label: '长文本',
                                    type: 'textarea'
                                },
                                int: {
                                    label: '数量',
                                    type: 'number'
                                },
                                floatnumber: {
                                    label: '小数',
                                    type: 'number',
                                    scale: 4
                                },
                                datefield: {
                                    label: '日期',
                                    type: 'date'
                                },
                                datetimefield: {
                                    label: '创建时间',
                                    type: 'datetime'
                                },
                                timestampfield: {
                                    label: '时间戳',
                                    type: 'datetime'
                                },
                                bool: {
                                    label: '是否',
                                    type: 'boolean'
                                }
                            }
                        }
                    }
                }
            }
        });
        const datasource = mySchema.getDataSource("default");
        await datasource.init();
        driver = <SteedosMySqlDriver>datasource.adapter;
    });

    beforeEach(async () => {
        let data = tests[testIndex].data;
        expected = tests[testIndex].expected;
        let method = tests[testIndex].method;
        result = await driver[method](tableName, data).catch((ex: any) => { console.error(ex); return false; });
    });

    tests.forEach(async (test) => {
        it(`${test.title}`, async () => {
            testIndex++;
            if (expected.error !== undefined) {
                expect(result.message).to.be.eq(expected.error);
            }
            if (expected.length !== undefined) {
                expect(result).to.be.length(expected.length);
            }
            if (expected.gt !== undefined) {
                expect(result).to.be.gt(expected.gt);
            }
            if (expected.eq !== undefined) {
                expect(result).to.be.eq(expected.eq);
            }
            if (expected.returnRecord !== undefined) {
                Object.keys(expected.returnRecord).forEach((key) => {
                    expect(result).to.be.not.eq(undefined);
                    if (result) {
                        // mysql中未设置时区的情况下，日期字段类型返回值有时差
                        if (result[key] instanceof Date) {
                            if (key === "datefield"){
                                var offset = new Date().getTimezoneOffset() * 60 * 1000;
                                //算出现在的时间：
                                var expectedDate = expected.returnRecord[key].getTime();
                                //算出对应的格林位置时间
                                var gmtExpectedDate = new Date(expectedDate + offset);
                                expect(result[key].getTime()).to.be.eq(gmtExpectedDate.getTime());
                            }else{
                                expect(result[key].getTime()).to.be.eq(expected.returnRecord[key].getTime());
                            }
                        }
                        else {
                            expect(result[key]).to.be.eq(expected.returnRecord[key]);
                        }
                    }
                });
            }
        });
    });
});
