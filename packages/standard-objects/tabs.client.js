// Steedos.TabsManager = {};

// Steedos.TabsManager.__lastDoc = null;

// Steedos.TabsManager.changeSchema = function (doc, schema, when) {
//     const baseFieldsName = [
//         { "name": "label", "required": true }, 
//         { "name": "name", "required": true }, 
//         { "name": "icon", "required": true }, 
//         { "name": "parent"}, 
//         { "name": "mobile"}, 
//         { "name": "desktop"},
//         { "name": "type"},
//         { "name": "description" }
//     ];
    
//     function getFieldsByType(doc, type) {
//         let fields = [];
//         switch (type) {
//           case 'object':{
//             fields.push({ name: 'object', required: true });
//             break;
//           }
//           case 'url':{
//             fields.push({ name: 'url', required: true });
//             fields.push({ name: 'is_new_window'});
//             break;
//           }
//           case 'page':{
//             fields.push({ name: 'page', required: true });
//             break;
//           }
//           default:
//             break;
//         }
//         return fields;
//       }
//   var clone = require('clone');
//   var fields = clone(Creator.getObject("tabs").fields);
//   var showFields = baseFieldsName.concat(getFieldsByType(doc, doc.type));
  
//   _.map(fields, function(field, fname){
//     var showField = _.find(showFields, function(item){
//       return item && item.name === fname;
//     })
//     if(showField){
//       Object.assign(field, showField)
//     }else{
//       Object.assign(field, {omit: true, hidden: true})
//     }
//   })

//   var objectSchema = Creator.getObjectSchema({fields: fields});
//   Object.assign(schema, new SimpleSchema(objectSchema)) 
// }