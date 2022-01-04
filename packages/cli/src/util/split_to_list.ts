const _ = require("underscore");

export function splitToList(input:string){
    var output;
    if(!input){
        output = [];
    }else if(_.contains(input, ',')){
        output = input.split(",");
    }else{
        output = input.split(" ");
    }
    return output;
}