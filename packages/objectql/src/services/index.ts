export * from './objectServiceDispatcher';
export * from './objectService';

export function getObjectServiceName(objectApiName: string){
    return `@${objectApiName}`;
}