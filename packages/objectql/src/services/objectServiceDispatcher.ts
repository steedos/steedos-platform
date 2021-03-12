import { getSteedosSchema } from '../types/schema';
class ObjectServiceDispatcher {
    _name: string;
    serviceName: string;
    broker: any;

    constructor(objectApiName) {
        this._name = objectApiName
        this.serviceName = `@${objectApiName}`;
        this.broker = getSteedosSchema().broker;
    }

    private getActionName(method: string){
        return `${this.serviceName}.${method}`
    }

    private async callAction(method: string, params?){
        const actionName = this.getActionName(method);
        if(!params){
            params = {};
        }
        const opts = {
            meta: {
                user: params.userSession
            }
        };

        delete params.userSession;
        const result = await this.broker.call(actionName, params, opts);
        return result;
    }

    async aggregate(query, externalPipeline, userSession?) {
        return await this.callAction(`aggregate`, {query, externalPipeline, userSession});
    }

    async find(query, userSession?) {
        return await this.callAction(`find`, {query, userSession});
    }

    async findOne(id, query, userSession?) {
        return await this.callAction(`findOne`, {id, query, userSession});
    }

    async insert(doc, userSession?) {
        return await this.callAction(`insert`, {doc, userSession});
    }

    async update(id, doc, userSession?) {
        return await this.callAction(`update`, {id, doc, userSession});
    }

    async updateOne(id, doc, userSession?) {
        return await this.callAction(`updateOne`, {id, doc, userSession});
    }

    async updateMany(queryFilters, doc, userSession?) {
        return await this.callAction(`updateMany`, {queryFilters, doc, userSession});
    }

    async delete(id, userSession?) {
        return await this.callAction(`delete`, {id, userSession});
    }

    async directAggregate(query, externalPipeline: any[], userSession) {
        return await this.callAction(`directAggregate`, {query, externalPipeline, userSession});
    }

    async directAggregatePrefixalPipeline(query, prefixalPipeline: any[], userSession?) {
        return await this.callAction(`directAggregatePrefixalPipeline`, {query, prefixalPipeline, userSession});
    }

    async directFind(query, userSession) {
        return await this.callAction(`directFind`, {query, userSession});
    }

    async directInsert(doc, userSession?) {
        return await this.callAction(`directInsert`, {doc, userSession});
    }

    async directUpdate(id, doc, userSession?) {
        return await this.callAction(`directUpdate`, {id, doc, userSession});
    }

    async directDelete(id, userSession) {
        return await this.callAction(`directDelete`, {id, userSession});
    }

    async count(query, userSession){
        return await this.callAction(`count`, {query, userSession});
    }

    async getField(fieldApiName: string) {
        return await this.callAction(`getField`, {fieldApiName});
    }

    async getFields(){
        return await this.callAction(`getFields`);
    }

    async getNameFieldKey(){
        return await this.callAction(`getNameFieldKey`);
    }

    async toConfig() {
        return await this.callAction(`toConfig`);
    }

    async getUserObjectPermission(userSession){
        const permission = await this.callAction(`getUserObjectPermission`, {userSession});
        return permission;
    }
}

export function getObjectDispatcher(objectApiName): any {
    return new ObjectServiceDispatcher(objectApiName);
}