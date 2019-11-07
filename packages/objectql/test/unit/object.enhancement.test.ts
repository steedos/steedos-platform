import { addObjectConfigFiles, addObjectMethod, getObject, getDataSource, SteedosSchema } from '../../src/';

import { getObjectConfigs, addTrigger } from '../../src/types/object_dynamic_load';
import { expect } from 'chai';

describe('new SteedosSchema', async () => {
  
    it('test actions', async() => {
        let schema = new SteedosSchema({
            datasources: {
                default: {
                    driver: "mongo",
                    url: 'mongodb://127.0.0.1:27017/steedos',
                    objects: {
                        post: {
                            fields: {
                                title: {
                                    type: "text",
                                    inlineHelpText: "fsdafas",
                                    optionsFunction: function () {
                                        console.log('22222222222222222');
                                    }
                                }
                            },
                            listeners: {
                                'default': {
                                    beforeInsert: function () {
                                        console.log('beforeInsert......................');
                                    },
                                    beforeUpdate: function () {
                                        console.log('beforeUpdate......................');
                                    }
                                }
                            }
                        }
                    },
                }
            }
        })
        await schema.getDataSource().init()
        addObjectConfigFiles('D:/test/**/*', 'test');
        addObjectMethod('test', 'test', function(res,req){})


        console.log('getObject...', getObject('post', schema));
        console.log('getDataSource...', getDataSource('default', schema));

        console.log('getObjectConfigs test', getObjectConfigs('test'));

        expect(true).to.equal(true)
    });

});