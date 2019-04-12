import { SteedosSchema } from '../../src/types';
import { expect } from 'chai';
var path = require('path')

describe('自动生成字段名', () => {
  it('should return true', () => {
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
                                optionsFunction: function(){
                                    console.log('22222222222222222');
                                }
                            }
                        },
                        listeners: {
                            'default': {
                                beforeInsert: function(){
                                   console.log('beforeInsert......................');
                                },
                                beforeUpdate: function(){
                                    console.log('beforeUpdate......................');
                                }
                            }
                        }
                    }
                }, 
                objectFiles: [path.resolve(__dirname, "./load")]
            }
        }
    })

    let object = schema.getObject("post")
    // console.log(object)

    // let f1 = object.getField('title');
    // console.log(f1.type);

    let field = object.fields["title"]
    // console.log(field)

    let meeting = schema.getObject('meeting')
    
    expect(field.name).to.equal("title") && expect(meeting.methods.test != undefined).to.equal(true)

  });
});