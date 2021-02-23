import { registerObject } from './object';
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

    object(objectConfig: any): Promise<boolean>{
        return registerObject(this.broker, objectConfig);
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