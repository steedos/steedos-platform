import { SteedosSchema } from '../../src/types';
import { expect } from 'chai';

describe('自动生成字段名', () => {
  it('should return true', () => {
    let schema = new SteedosSchema({
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
        datasource: {
            driver: "mongo",
            url: "mongodb://127.0.0.1/steedos"
        }
    })

    let object = schema.objects["post"]
    // console.log(object)

    // let f1 = object.getField('title');
    // console.log(f1.type);

    let field = object.fields["title"]
    // console.log(field)
    
    expect(field.name).to.equal("title");

  });
});