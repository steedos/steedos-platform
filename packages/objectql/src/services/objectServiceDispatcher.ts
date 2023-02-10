class ObjectServiceDispatcher {
    objectApiName: string;
    serviceName: string;
    broker: any;
    metadataBroker: any;

    constructor(objectApiName) {
        const schema = require('../types/schema');
        this.objectApiName = objectApiName
        this.serviceName = `@${objectApiName}`;
        this.broker = schema.getSteedosSchema().broker;
        this.metadataBroker = schema.getSteedosSchema().metadataBroker;
    }

    private async callMetadataObjectServiceAction(action, params?){
        const actionFullName = `objects.${action}`
        const result = await this.metadataBroker.call(actionFullName, params);
        return result;
    }

    private getActionFullName(method: string){
        return `${this.serviceName}.${method}`
    }

    private async callAction(method: string, params?){
        const actionFullName = this.getActionFullName(method);
        if(!params){
            params = {};
        }
        const opts = {
            meta: {
                user: params.userSession
            }
        };

        delete params.userSession;
        const result = await this.broker.call(actionFullName, params, opts);
        return result;
    }

    async aggregate(query, externalPipeline, userSession?) {
        return await this.callAction(`aggregate`, {query, externalPipeline, userSession});
    }

    async find(query, userSession?) {
        return await this.callAction(`find`, {...query, userSession});
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
        return await this.callAction(`directFind`, {...query, userSession});
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
        return await this.callAction(`count`, {...query, userSession});
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

    async getConfig() {
        return await this.callAction(`getConfig`);
    }

    async getUserObjectPermission(userSession){
        const permission = await this.callAction(`getUserObjectPermission`, {userSession});
        return permission;
    }

    async isEnableAudit(){
        return await this.callAction(`isEnableAudit`);
    }

    async _makeNewID(){
        return await this.callAction(`_makeNewID`);
    }

    async getRecordAbsoluteUrl(){
        return await this.callAction(`getRecordAbsoluteUrl`)
    }

    async getGridAbsoluteUrl(){
        return await this.callAction(`getRecordAbsoluteUrl`)
    }

    async getDetails(){
        return await this.callMetadataObjectServiceAction(`getDetails`, {objectApiName: this.objectApiName});
    }

    async getMasters(){
        return await this.callMetadataObjectServiceAction(`getMasters`, {objectApiName: this.objectApiName});
    }

    async getLookupDetails(){
        return await this.callMetadataObjectServiceAction(`getLookupDetails`, {objectApiName: this.objectApiName});
    }

    async getDetailsInfo(){
        return await this.callMetadataObjectServiceAction(`getDetailsInfo`, {objectApiName: this.objectApiName});
    }

    async getMastersInfo(){
        return await this.callMetadataObjectServiceAction(`getMastersInfo`, {objectApiName: this.objectApiName});
    }

    async getLookupDetailsInfo(){
        return await this.callMetadataObjectServiceAction(`getLookupDetailsInfo`, {objectApiName: this.objectApiName});
    }

    async getRelationsInfo() {
        return await this.callMetadataObjectServiceAction(`getRelationsInfo`, { objectApiName: this.objectApiName });
    }

    async getDetailPaths(){
        return await this.callMetadataObjectServiceAction(`getDetailPaths`, {objectApiName: this.objectApiName});
    }

    async getMasterPaths(){
        return await this.callMetadataObjectServiceAction(`getMasterPaths`, {objectApiName: this.objectApiName});
    }

    async getMaxDetailsLeave(paths?){
        return await this.callMetadataObjectServiceAction(`getMaxDetailsLeave`, {objectApiName: this.objectApiName, paths});
    }

    async getMaxMastersLeave(paths?){
        return await this.callMetadataObjectServiceAction(`getMaxMastersLeave`, {objectApiName: this.objectApiName, paths});
    }

    async getRecordPermissions(record, userSession){
        return await this.callAction(`getRecordPermissions`, {record, userSession});
    }

    async getRecordView(userSession, context?) {
        return await this.callAction(`getRecordView`, { userSession, context });
    }

    async createDefaultRecordView(userSession){
        return await this.callAction(`createDefaultRecordView`, {userSession});
    }

    async getDefaultRecordView(userSession){
        return await this.callAction(`getDefaultRecordView`, {userSession});
    }

    async getRelateds(){
        return await this.callAction(`getRelateds`)
    }

    async refreshIndexes(){
        return await this.callAction(`refreshIndexes`)
    }
}

export function getObjectDispatcher(objectApiName): any {
    return new ObjectServiceDispatcher(objectApiName);
}