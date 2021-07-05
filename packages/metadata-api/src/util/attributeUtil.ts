import * as _ from 'underscore';
const clone = require('clone');

export function deleteCommonAttribute(obj: any){
    // delete obj._id;
    delete obj.space;
    delete obj.owner;
    delete obj.created;
    delete obj.modified;
    delete obj.created_by;
    delete obj.modified_by;
    delete obj.company_id;
    delete obj.company_ids;
    
    deleteNullAttribute(obj);
}

export function deleteNullAttribute(obj: any){
    for(var key in obj){

        if(obj[key] == null){

            delete obj[key]
        }
    }
}

export function sortAttribute(obj: any, debug=false){

    if(typeof obj == 'undefined' || obj == null){
        return
    }

    var temp = clone(obj);

    for(var key in obj){
        delete obj[key]
    }

    if(debug) console.log(obj);

    var keys = _.keys(temp).sort();

    if(typeof temp['name'] != 'undefined'){
        obj['name'] = temp['name'] 
    }

    if(debug) console.log(obj);
    
    for(var i=0; i<keys.length; i++){
        var k = keys[i]
        obj[k] = temp[k]
    }
    
    if(debug) console.log(obj);
}