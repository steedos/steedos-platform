module.exports = {

    name: 'baseTrigger',
  
    listenTo: 'base',
  
    beforeInsert: function(userId, doc) {
        doc.created = new Date();
        doc.modified = new Date();
        if (userId) {
            if (!doc.owner) {
            doc.owner = userId;
            }
            if (doc.owner === '{userId}') {
            doc.owner = userId;
            }
            doc.created_by = userId;
            return doc.modified_by = userId;
        }
    },
    beforeUpdate:  function(userId, doc, fieldNames, modifier, options) {
        modifier.$set = modifier.$set || {};
        modifier.$set.modified = new Date();
        if (userId) {
            return modifier.$set.modified_by = userId;
        }
    }
    //TODO 完善Triggers
  }