import { SteedosObjectType } from '../types/object';
import { getDataSource } from '../types/datasource';
import { getObjectConfig } from '../types/object_dynamic_load';

function getObjectServiceMethodsSchema(){
    const methods: any = {};
    methods.find = {
        async handler(query, userSession) {
            return await this.object.find(query, userSession)
        }
    }
    return methods;
}

function getObjectServiceActionsSchema(){
    const actions: any = {};
    actions.find = {
        async handler(ctx) {
            const userSession = null;  //TODO userSession
            return this.find(ctx.params.query, userSession)
        }
    }
    return actions;
}

export function getObjectServiceSchema(serviceName, objectConfig){
    return {
        name: serviceName,
        actions: getObjectServiceActionsSchema(),
        methods: getObjectServiceMethodsSchema(),
        created(){
            this.object = new SteedosObjectType(objectConfig.name, getDataSource(objectConfig.datasource), objectConfig);
        }
    }
}

module.exports = {
    name: '#_objectBaseService', //TODO
    settings: {
        // objectApiName:  //TODO
        // objectConfig
    },
    actions: getObjectServiceActionsSchema(),
    methods: getObjectServiceMethodsSchema(),
    created(broker) {
        // console.log('this.settings', this.settings);
        if(!this.settings.objectApiName && !this.settings.objectConfig){
            throw new Error('Please set the settings.objectApiName.')
        }
        const objectConfig: any = this.settings.objectConfig || getObjectConfig(this.settings.objectApiName);
        if(!objectConfig){
            throw new Error('Not found object config by objectApiName.')
        }
        this.object = new SteedosObjectType(objectConfig.name, getDataSource(objectConfig.datasource), objectConfig);
	}
}