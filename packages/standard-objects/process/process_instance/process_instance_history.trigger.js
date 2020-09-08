const _ = require("underscore");
module.exports = {
  afterFindOne: async function () {
    if(this.data.values && !this.data.values.step_node){
      this.data.values.name = 'Approval Request Submitted';
    }
  },
  afterFind: async function () {
    _.each(this.data.values, function(value){
      if(!value.step_node){
        value.name = 'Approval Request Submitted';
      }
    })
  },
  afterAggregate: async function () {
    _.each(this.data.values, function(value){
      if(!value.step_node){
        value.name = 'Approval Request Submitted';
      }
    })
  },
}