import { expect } from 'chai';
import { SteedosSchema, SteedosDatabaseDriverType } from '../../src';
var path = require('path')

describe('Test idField', () => {
    it('idField return true', async () => {
        let mySchema = new SteedosSchema({
            datasources: {
                default: {
                    driver: SteedosDatabaseDriverType.Mongo, 
                    url: 'mongodb://127.0.0.1/steedos',
                    objectFiles: [path.resolve(__dirname, "../../../standard-objects")]
                },
                sqlite: {
                    driver: SteedosDatabaseDriverType.Sqlite,
                    url: path.join(__dirname, "sqlite-test.db"),
                    objects: {
                        test: {
                            name: 'SQ1',
                            label: '关系数据库主键测试',
                            fields: {
                                id: {
                                    type: 'text',
                                    label: '主键',
                                    primary: true
                                },
                                name: {
                                    type: 'text',
                                    label: '名称'
                                }
                            }
                        }
                    }
                }
            }
        })

        let users = mySchema.getObject('users')
  
        let test = mySchema.getObject('sqlite.test');
        
        expect(users.idFieldName).to.equal('_id') && expect(test.idFieldName).to.equal('id')
    });
  });