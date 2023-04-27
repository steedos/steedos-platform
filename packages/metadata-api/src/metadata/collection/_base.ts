import { deleteCommonAttribute, sortAttribute } from '../../util/attributeUtil'
import { SteedosMetadataTypeInfoKeys as TypeInfoKeys, getFullName, getMetadataTypeInfo } from '@steedos/metadata-core';
import _ from 'underscore';

export class MetadataBaseCollection{
    metadataName: string;
    collectionName: string;
    relatedProperties: Array<string>;

    formatDataOnRetrieve(metadata){
        return metadata;
    }

    formatDataOnDeploy(metadata){
        return metadata;
    }
    
    constructor(metadataName, relatedProperties: Array<string> = []){
        this.metadataName = metadataName;
        this.collectionName = getMetadataTypeInfo(metadataName).tableName;
        this.relatedProperties = relatedProperties;
    }

    async retrieve(dbManager, metadataApiNames, steedosPackage){
        steedosPackage[this.metadataName] = {}
        var packageMetadata = steedosPackage[this.metadataName]

        if(metadataApiNames.length == 1 && metadataApiNames[0] == '*'){
            var metadataList = await this.getAll(dbManager);
            for(var i=0; i<metadataList.length; i++){
                var metadataItem = metadataList[i]
                var metadataFullName = getFullName(this.metadataName, metadataItem)
                packageMetadata[metadataFullName] = this.formatDataOnRetrieve(metadataItem)
            }
        }else{
    
            for(var i=0; i<metadataApiNames.length; i++){
        
                var metadataApiName = metadataApiNames[i];
           
                var metadataItem = await this.get(dbManager, metadataApiName);
                var metadataFullName = getFullName(this.metadataName, metadataItem)
                packageMetadata[metadataFullName] = this.formatDataOnRetrieve(metadataItem);
            }
        }
    }

    async deploy(dbManager, metadataList){
        for(const metadataName in metadataList){
            var metadata = this.formatDataOnDeploy(metadataList[metadataName]);
            // await checkComponentsExist(dbManager, layout);
            delete metadata.__filename
            await this.save(dbManager, metadata);
        }
    }

    private async getAll(dbManager) {
        var records = await this.find(dbManager);
        for(var i=0; i<records.length; i++){
            let record = records[i]
            this.formatRelatedProperties(record)
            deleteCommonAttribute(record);
            sortAttribute(record);
        }
        return records;
    }

    private async get(dbManager, metadataApiName) {
        var record = await this.findOne(dbManager, metadataApiName);
        this.formatRelatedProperties(record)
        deleteCommonAttribute(record);
        sortAttribute(record);
        return record;
    }

    protected async find(dbManager){
       return await dbManager.find(this.collectionName, {});
    }

    protected async findOne(dbManager, metadataApiName){
        return await dbManager.findOne(this.collectionName, {name: metadataApiName});
    }

    protected async save(dbManager, data){
        var filter = {name: data.name};
        var record = await dbManager.findOne(this.collectionName, filter);
    
        if(record == null){
            record = await dbManager.findOne(this.collectionName, filter, false)
            if(record) {
                throw new Error(`process api_name already exists: ${data.name}`); 
            }
            return await dbManager.insert(this.collectionName, data);
        }else{
            return await dbManager.update(this.collectionName, filter, data);
        }
    }

    private formatRelatedProperties(metadata){
        _.each(this.relatedProperties, (properName)=>{
            this.formatRelatedPropertie(metadata[properName])
        })
    }
    
    private formatRelatedPropertie(list){
        if(!list){
            return
        }
        for(let item of list){
            if(item){
                deleteCommonAttribute(item);
                sortAttribute(item);
                delete item._id
            }
        }
    }
}