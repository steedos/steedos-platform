const objectql = require('@steedos/objectql');

if(Meteor.isServer){

  var getPLId = function(doc){
    return `${doc.space}:${doc.code}`
  }

  Meteor.startup(function() {
    let objectName = 'picklists';
    Creator.getCollection(objectName).find({}, {
      fields: {
        _id: 1,
        code: 1,
        space: 1
      }
    }).observe({
      added: function(doc){
        objectql.addConfig(objectName, Object.assign({}, doc, {rid: doc._id, _id: getPLId(doc)}))
      },
      changed: function(doc){
        objectql.addConfig(objectName, Object.assign({}, doc, {rid: doc._id, _id: getPLId(doc)}))
      },
      removed: function(doc){
        objectql.removeConfig(objectName, Object.assign({}, doc, {rid: doc._id, _id: getPLId(doc)}))
      }
    })
  });


  Meteor.startup(function(){
    let objectName = 'picklist_options';
    Creator.getCollection(objectName).find({}, {
      fields: {
        _id: 1,
        picklist: 1,
        name: 1,
        value: 1,
        sort_no: 1,
        enable: 1,
        default: 1,
        color: 1
      }
    }).observe({
      added: function(doc){
        objectql.addConfig(objectName, doc)
      },
      changed: function(doc){
        objectql.addConfig(objectName, doc)
      },
      removed: function(doc){
        objectql.removeConfig(objectName, doc)
      }
    })
  })

  Creator.getPicklist = function(code, spaceId){
    return objectql.getConfig('picklists', getPLId({code: code, space: spaceId}))
  }

  Creator.getPickListOptions = function(picklist){
    if(picklist){
      return _.filter(objectql.getConfigs('picklist_options'), function(item){
        return item.picklist === picklist.rid
      })
    }
  }
}