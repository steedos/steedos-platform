const _ = require("underscore");


const getLng = function(userId){
  return Steedos.locale(userId, true);
}

const getEmptyNodeTitle = function(userId){
  let lng = getLng(userId);
  return TAPi18n.__('process_approval_empty_node_title', {}, lng);
}

module.exports = {
  afterFindOne: async function () {
    let userId = this.userId;
    if(this.data.values && !this.data.values.step_node){
      this.data.values.name = getEmptyNodeTitle(userId);
    }
  },
  afterFind: async function () {
    let userId = this.userId;
    _.each(this.data.values, function(value){
      if(!value.step_node){
        value.name = getEmptyNodeTitle(userId);
      }
    })
  },
  afterAggregate: async function () {
    let userId = this.userId;
    _.each(this.data.values, function(value){
      if(!value.step_node){
        value.name = getEmptyNodeTitle(userId);
      }
    })
  },
}