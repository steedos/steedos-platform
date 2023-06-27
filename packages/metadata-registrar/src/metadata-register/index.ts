import { registerObject, removeObject, addObjectConfig, addObjectConfigs, getObjectsConfig, getObjectConfig } from './object';
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

    static async addObjectConfig(serviceName, objectConfig: any): Promise<boolean>{
        return await addObjectConfig(broker, serviceName, objectConfig);
    }

    static async addObjectConfigs(serviceName, objectConfigs: any): Promise<boolean>{
        return await addObjectConfigs(broker, serviceName, objectConfigs);
    }

    static async getObjectsConfig(datasourceName: string): Promise<any>{
        return await getObjectsConfig(broker, datasourceName);
    }

    static async getObjectConfig(objectApiName): Promise<any>{
        return await getObjectConfig(broker, objectApiName);
    }

    static async addObject(serviceName, objectConfig: any): Promise<boolean>{
        return await registerObject(broker, serviceName, objectConfig);
    }

    static async removeObject(objectApiName: any): Promise<boolean>{
        return await removeObject(broker, objectApiName);
    } 

    static async addApp(serviceName, appConfig: any): Promise<boolean>{
        return await registerApp(broker, serviceName, appConfig);
    }

    static async removeApp(appApiName: any): Promise<boolean>{
        return await removeApp(broker, appApiName);
    }

    static async getApp(appApiName): Promise<any>{
        return await getApp(broker, appApiName);
    }

    static async getApps(): Promise<any>{
        return await getApps(broker);
    }

    static async addTab(serviceName, tabConfig: any): Promise<boolean>{
        return await registerTab(broker, serviceName, tabConfig);
    }

    static async removeTab(tabApiName: any): Promise<boolean>{
        return await removeTab(broker, tabApiName);
    }

    static async getTab(tabApiName): Promise<any>{
        return await getTab(broker, tabApiName);
    }

    static async getTabs(): Promise<any>{
        return await getTabs(broker);
    }

    static async addLayout(serviceName, config: any): Promise<boolean>{
        return await registerLayout(broker, serviceName, config);
    }

    static async removeLayout(objectLayoutFullName: any): Promise<boolean>{
        return await removeLayout(broker, objectLayoutFullName);
    }

    static async getLayout(objectLayoutFullName): Promise<any>{
        return await getLayout(broker, objectLayoutFullName);
    }

    static async getLayouts(): Promise<any>{
        return await getLayouts(broker);
    }

    static async filterLayouts(profileApiName, spaceId, objectApiName?):Promise<any>{
        return await filterLayouts(broker, profileApiName, spaceId, objectApiName);
    }

    static async addProfile(serviceName, profileConfig): Promise<boolean>{
        return await registerProfile(broker, serviceName, profileConfig);
    }
    static async getProfile(profileApiName): Promise<any>{
        return await getProfile(broker, profileApiName);
    }
    static async getProfiles(): Promise<any>{
        return await getProfiles(broker);
    }

    static async addPermissionset(serviceName, permissionsetConfig): Promise<boolean>{
        return await registerPermissionset(broker, serviceName, permissionsetConfig);
    }
    static async getPermissionset(permissionsetApiName): Promise<any>{
        return await getPermissionset(broker, permissionsetApiName);
    }
    static async getPermissionsets(): Promise<any>{
        return await getPermissionsets(broker);
    }

    // register(type: MetadataType, metadata: any){
    //     switch (type) {
    //         case MetadataType.Object:
    //             registerObject(broker, metadata);
    //             break;
    //         default:
    //             break;
    //     }
    // }
}