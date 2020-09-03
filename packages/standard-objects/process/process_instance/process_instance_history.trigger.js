const _ = require("underscore");
module.exports = {
  afterFindOne: async function () {
    if(this.data.values && this.data.values.step_status === 'started'){
      this.data.values.name = 'Approval Request Submitted';
    }
  },
  afterFind: async function () {
    _.each(this.data.values, function(value){
      if(value.step_status === 'started'){
        value.name = 'Approval Request Submitted';
      }
    })
  },
  afterAggregate: async function () {
    _.each(this.data.values, function(value){
      if(value.step_status === 'started'){
        value.name = 'Approval Request Submitted';
      }
    })
  },
}