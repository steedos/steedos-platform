import { getFromContainer } from "../container";
import { Field } from './Field'
import { getCreator } from '../index';

import { getObjectSchemaManager } from '..';

var util = require("../util");

class FieldManager{
    public loadFile(filePath: string): void{
        let field: Field = util.loadFile(filePath);
        console.log('field', field);
        this.loadField(field);
    }

    private loadField(field: Field){
        
        if(!field.name){
            throw new Error('Missing name attribute');
        }

        if(!field.object_name){
            throw new Error('Missing object_name attribute');
        }
        
        let Creator = getCreator();

        if(!Creator.getObject(field.object_name)){
            throw new Error(`not find object ${field.object_name}`);
        }

        let objectSchemaManager = getObjectSchemaManager()
        let obj = {
            name: field.object_name,
            extend: field.object_name,
            fields: {}
        }

        obj.fields[field.name] = field
        
        objectSchemaManager.create(obj)
    }
}

export default getFromContainer(FieldManager)