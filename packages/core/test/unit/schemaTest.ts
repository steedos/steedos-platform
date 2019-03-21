import { SteedosSchema, SteedosObjectType } from '../../src/types';
import { expect } from 'chai';


describe('自动生成字段名', () => {
  it('should return true', () => {
    let schema = new SteedosSchema({
        objects: {
            post: new SteedosObjectType({
                name: "post",
                fields: {
                    title: {
                        type: "string"
                    }
                }
            })
        },
    })
    
    let object = schema._objects["post"]
    //console.log(object)
    
    let field = object._fields["title"]
    //console.log(field)
    
    expect(field._name).to.equal("title");

  });
});