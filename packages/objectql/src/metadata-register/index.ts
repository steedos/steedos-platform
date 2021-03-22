import { registerObject } from './object';
import { registerApp, getApp, getApps } from './app';
import { getProfile, getProfiles, registerProfile } from './profile';
import { getPermissionset, getPermissionsets, registerPermissionset } from './permissionset';
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

    async addApp(serviceName, appConfig: any): Promise<boolean>{
        return await registerApp(this.broker, serviceName, appConfig);
    }

    async getApp(appApiName): Promise<any>{
        return await getApp(this.broker, appApiName);
    }

    async getApps(): Promise<any>{
        return await getApps(this.broker);
    }

    async addProfile(serviceName, profileConfig): Promise<boolean>{
        return await registerProfile(this.broker, serviceName, profileConfig);
    }
    async getProfile(profileApiName): Promise<any>{
        return await getProfile(this.broker, profileApiName);
    }
    async getProfiles(): Promise<any>{
        return await getProfiles(this.broker);
    }

    async addPermissionset(serviceName, permissionsetConfig): Promise<boolean>{
        return await registerPermissionset(this.broker, serviceName, permissionsetConfig);
    }
    async getPermissionset(permissionsetApiName): Promise<any>{
        return await getPermissionset(this.broker, permissionsetApiName);
    }
    async getPermissionsets(): Promise<any>{
        return await getPermissionsets(this.broker);
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