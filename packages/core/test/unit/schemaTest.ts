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
    expect(schema._objects.post._fields.title._name).to.equal("title");

  });
});