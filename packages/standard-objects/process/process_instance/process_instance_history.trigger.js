const _ = require("underscore");
const auth = require("@steedos/auth");

const getLng = async function(userId){
  const userSession = await auth.getSessionByUserId(userId);
  return userSession ? userSession.language : null;
}

const getEmptyNodeTitle = async function(userId){
  let lng = await getLng(userId);
  return TAPi18n.__('process_approval_empty_node_title', {}, lng);
}

module.exports = {
  afterFindOne: async function () {
    let userId = this.userId;
    if(this.data.values && !this.data.values.step_node){
      this.data.values.name = await getEmptyNodeTitle(userId);
    }
  },
  afterFind: async function () {
    let userId = this.userId;
    if(this.data.values){
      for (const value of this.data.values) {
        if(!value.step_node){
          value.name = await getEmptyNodeTitle(userId);
        }
      }
    }
    
  },
  afterAggregate: async function () {
    let userId = this.userId;
    if(this.data.values){
      for (const value of this.data.values) {
        if(!value.step_node){
          value.name = await getEmptyNodeTitle(userId);
        }
      }
    }
  },
}