//TODO client trigger
module.exports = {

    name: 'baseClientTrigger',
  
    listenTo: 'base',

    on: 'client',
  
    beforeInsert: function(userId, doc) {
        return doc.space = Session.get("spaceId");
    }
  }