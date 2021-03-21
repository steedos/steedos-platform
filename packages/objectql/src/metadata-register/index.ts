import { registerObject } from './object';
import { registerApp, getApp, getApps } from './app';
export enum MetadataType {
    Object,
    ObjectField,
    ObjectListView,
    ObjectAction,
    ObjectButton
}

export class MetadataRegister{
    private broker: any;
    
    constructor(metadataBroker){
        this.broker = metadataBroker;
    }

    async addObject(serviceName, objectConfig: any): Promise<boolean>{
        return await registerObject(this.broker, serviceName, objectConfig);
    }

    async addApp(serviceName, objectConfig: any): Promise<boolean>{
        return await registerApp(this.broker, serviceName, objectConfig);
    }

    async getApp(appApiName): Promise<any>{
        return await getApp(this.broker, appApiName);
    }
    async getApps(): Promise<any>{
        return await getApps(this.broker);
    }
    

    // register(type: MetadataType, metadata: any){
    //     switch (type) {
    //         case MetadataType.Object:
    //             registerObject(this.broker, metadata);
    //             break;
    //         default:
    //             break;
    //     }
    // }
}