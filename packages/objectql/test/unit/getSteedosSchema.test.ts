import { getSteedosSchema } from '../../src/types';
import { expect } from 'chai';
var path = require('path')

describe('get SteedosSchema', async () => {
    let schema = getSteedosSchema()
    
    // 添加默认数据源
    schema.addDataSource('default', {
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
        objectFiles: [path.resolve(__dirname, "./load")]
    })

    await schema.getDataSource().init()

    it('should return true', () => {
        let object = schema.getObject("post")

        let field = object.fields["title"]

        let meeting = schema.getObject('meeting')

        expect(field.name).to.equal("title") && expect(meeting.methods.test != undefined).to.equal(true)

    });

    it('test list_views', () => {
        let meeting = schema.getObject('meeting')
        expect(meeting.list_views.all != undefined).to.equal(true)
    });

    it('test actions', () => {
        let meeting = schema.getObject('meeting')
        expect(meeting.getAction('standard_query') != undefined).to.equal(true)
    });
});