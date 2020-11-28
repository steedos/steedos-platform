import { expect } from 'chai';
import { JsonMap } from '@salesforce/ts-types';

var util = require('../../src/util')

describe('test util.extend', () => {
    it('test util.extend', async () => {
        let config: JsonMap = {}
        let objectConfig = {
            fields: {
                company_id: {
                    required: true,
                    type: 'lookup',
                    omit: false,
                    hidden: false,
                }
            }
        }

        let base = {
            fields: {
                company_id:{
                    label: "所属分部",
                    type: "lookup",
                    reference_to: "organizations",
                    sortable: true,
                    index: true,
                    defaultValue: function(){
                        
                    },
                    omit: true,
                    hidden: true
                }
            }
        }
        config = util.extend({}, objectConfig, base, objectConfig)

        expect(config.fields["company_id"].required).to.equal(true) 
        && expect(config.fields["company_id"].omit).to.equal(false) 
        && expect(config.fields["company_id"].sortable).to.equal(true)
    });

  });