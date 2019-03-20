import DataSource from "./DataSource";
import { JsonMap } from '@salesforce/ts-types';

export default class ObjectResolver {

    object_name: string;
    datasource: DataSource;
    
    constructor(object_name: string){
        this.object_name = object_name;
    }

    getDataSource(){
        if (!this.datasource)
            this.datasource = DataSource.getDefaultDataSource();
        return this.datasource;
    }

    find(filters: [[String]], fields: [String], options: JsonMap){

    }

    insert(doc: JsonMap){

    }

    update(id:string|number, doc: JsonMap){

    }

    delete(id:string|number){

    }

}
