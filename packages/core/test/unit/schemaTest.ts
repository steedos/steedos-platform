import { SteedosSchema } from '../../src/types';
import { expect } from 'chai';


describe('自动生成字段名', () => {
  it('should return true', () => {
    let schema = new SteedosSchema({
        objects: {
            post: {
                fields: {
                    title: {
                        type: "string"
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

    let field = object.fields["title"]
    // console.log(field)
    
    expect(field.name).to.equal("title");

  });
});