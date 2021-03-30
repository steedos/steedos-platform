import _ = require('lodash')

export class LookupActionHandler {
    broker: any = null;
    constructor(broker) {
        this.broker = broker;
    }

    async add(ctx) {
        const { data } = ctx.params;
        try {
            await this.addObjectLookups(data);
            return true
        } catch (error) {
            this.broker.logger.error(error);
        }
        return false
    }

    async addObjectLookups(objectConfig) {
        const { name: objectApiName } = objectConfig;
        await this.deleteObjectLookups(objectApiName);
        for await (const field of _.values(objectConfig.fields)) {
            if (field.type === "lookup") {
                try {
                    if (field.reference_to && _.isString(field.reference_to)) {
                        await this.addDetail(field.reference_to, objectApiName, field);
                    }
                }
                catch (ex) {
                    console.error(ex);
                }
            }
        }
    }

    getDetailKey(objectApiName) {
        return `$steedos.$lookup.#${objectApiName}.detail`
    }

    async getDetails(objectApiName: string) {
        let { metadata } = (await this.broker.call('metadata.get', { key: this.getDetailKey(objectApiName) }, { meta: {} })) || {};
        return metadata || [];
    }

    async addDetail(objectApiName: any, detailObjectApiName: string, detailField: any) {
        let detail = await this.getDetails(objectApiName);
        let maps = [];
        if (detail) {
            maps = detail;
        }

        let index = maps.indexOf(detailObjectApiName);
        if (index < 0) {
            maps.push(detailObjectApiName);
            await this.broker.call('metadata.add', { key: this.getDetailKey(objectApiName), data: maps }, { meta: {} })
            this.broker.emit(`@${objectApiName}.detailsChanged`, { objectApiName, detailObjectApiName, detailFieldName: detailField.name, detailFieldReferenceToFieldName: detailField.reference_to_field });
            return true;
        }
        return false;
    }


    async removeDetail(objectApiName: any, detailObjectApiName: string) {
        let detail = await this.getDetails(objectApiName);
        let index = detail.indexOf(detailObjectApiName);
        if (index >= 0) {
            detail.splice(index, 1);
        }
        await this.broker.call('metadata.add', { key: this.getDetailKey(objectApiName), data: detail }, { meta: {} })
    }

    async deleteObjectLookups(objectApiName: string) {
        await this.broker.call('metadata.delete', { key: this.getDetailKey(objectApiName) }, { meta: {} });
        return true;
    }
}