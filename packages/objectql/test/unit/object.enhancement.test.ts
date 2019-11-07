import { addObjects, addMethod, getObject, getDataSource, SteedosSchema } from '../../src/';

import { objectDynamicLoad, addTrigger } from '../../src/types/object_dynamic_load';
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
        addObjects('D:/test/**/*', 'test');
        addMethod('test', 'test', function(res,req){})

        addTrigger('test', 'beforeInsert', ()=>{
            console.log('fasfdfasfdfasfdfasfdfasfdfasfdfasfdfasfdfasfdfasfdfasfdfasfdv爱的发声多久哦发幅度萨芬的看了觉得反馈士大夫发大水发射发生大法师');
            
        })

        addTrigger('test', 'beforeInsert', ()=>{
            console.log('fasfdfasfdfasfdfasfdfasfdfasfdfasfdfasfdfasfdfasfdfasfdfasfdv爱的发声多久哦发幅度萨芬的看了觉得反馈士大夫发大水发射发生大法师');
            console.log('fasfdfasfdfasfdfasfdfasfdfasfdfasfdfasfdfasfdfasfdfasfdfasfdv爱的发声多久哦发幅度萨芬的看了觉得反馈士大夫发大水发射发生大法师');
        })

        console.log('getObject...', getObject('post', schema));
        console.log('getDataSource...', getDataSource('default', schema));

        console.log('getObject test', objectDynamicLoad.getObjects('test'));

        console.log('getObject test222', objectDynamicLoad.getObjects('test222'));


        console.log('getTriggers test', objectDynamicLoad.getTriggers('test'));

        console.log(objectDynamicLoad.objectList, objectDynamicLoad.methodList);
        expect(true).to.equal(true)
    });

});