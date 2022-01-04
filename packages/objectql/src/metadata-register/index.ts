import { registerObject, removeObject, addObjectConfig, getObjectsConfig, getObjectConfig } from './object';
import { registerApp, getApp, getApps, removeApp } from './app';
import { getProfile, getProfiles, registerProfile } from './profile';
import { registerLayout, getLayout, getLayouts, removeLayout, filterLayouts } from './layout';
import { getPermissionset, getPermissionsets, registerPermissionset } from './permissionset';
import { getTab, getTabs, registerTab, removeTab } from './tabs';

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

    async addObjectConfig(serviceName, objectConfig: any): Promise<boolean>{
        return await addObjectConfig(this.broker, serviceName, objectConfig);
    }
    async getObjectsConfig(datasourceName: string): Promise<any>{
        return await getObjectsConfig(this.broker, datasourceName);
    }

    async getObjectConfig(objectApiName): Promise<any>{
        return await getObjectConfig(this.broker, objectApiName);
    }

    async addObject(serviceName, objectConfig: any): Promise<boolean>{
        return await registerObject(this.broker, serviceName, objectConfig);
    }

    async removeObject(objectApiName: any): Promise<boolean>{
        return await removeObject(this.broker, objectApiName);
    } 

    async addApp(serviceName, appConfig: any): Promise<boolean>{
        return await registerApp(this.broker, serviceName, appConfig);
    }

    async removeApp(appApiName: any): Promise<boolean>{
        return await removeApp(this.broker, appApiName);
    }

    async getApp(appApiName): Promise<any>{
        return await getApp(this.broker, appApiName);
    }

    async getApps(): Promise<any>{
        return await getApps(this.broker);
    }

    async addTab(serviceName, tabConfig: any): Promise<boolean>{
        return await registerTab(this.broker, serviceName, tabConfig);
    }

    async removeTab(tabApiName: any): Promise<boolean>{
        return await removeTab(this.broker, tabApiName);
    }

    async getTab(tabApiName): Promise<any>{
        return await getTab(this.broker, tabApiName);
    }

    async getTabs(): Promise<any>{
        return await getTabs(this.broker);
    }

    async addLayout(serviceName, config: any): Promise<boolean>{
        return await registerLayout(this.broker, serviceName, config);
    }

    async removeLayout(objectLayoutFullName: any): Promise<boolean>{
        return await removeLayout(this.broker, objectLayoutFullName);
    }

    async getLayout(objectLayoutFullName): Promise<any>{
        return await getLayout(this.broker, objectLayoutFullName);
    }

    async getLayouts(): Promise<any>{
        return await getLayouts(this.broker);
    }

    async filterLayouts(profileApiName, spaceId, objectApiName?):Promise<any>{
        return await filterLayouts(this.broker, profileApiName, spaceId, objectApiName);
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