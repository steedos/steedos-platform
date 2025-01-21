const path = require("path");
import { getFullName } from '../index';

export function checkNameEquals(json, name, filepath, metadataName){
    var fullName = getFullName(metadataName ,json);

    if(fullName != name){
        throw new Error('The attribute "name" in the file does not match its filename.\nName:"'+json['name']+'" Filename:"'+path.basename(filepath)+'"')
    }
}