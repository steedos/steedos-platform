import _ = require('lodash')

export class LookupActionHandler {
    broker: any = null;
    constructor(broker) {
        this.broker = broker;
    }

    async add(objectConfig) {
        try {
            await this.addObjectLookups(objectConfig);
            return true
        } catch (error) {
            this.broker.logger.error(error);
        }
        return false
    }

    async deleteAll(objectConfig){
        try {
            if (!objectConfig) {
                return;
            }
            await this.deleteAllLookups(objectConfig);
            return true
        } catch (error) {
            this.broker.logger.error(error);
        }
        return false
    }

    async deleteAllLookups(objectConfig){
        const { name: objectApiName } = objectConfig;
        for await (const fieldName of _.keys(objectConfig.fields)) {
            const field = objectConfig.fields[fieldName];
            field.name = fieldName;
            if (field.type === "lookup") {
                try {
                    if (field.reference_to && _.isString(field.reference_to)) {
                        await this.removeDetail(field.reference_to, objectApiName, field);
                    }
                }
                catch (ex) {
                    console.error(ex);
                }
            }
        }
    }

    async addObjectLookups(objectConfig) {
        const { name: objectApiName } = objectConfig;
        // await this.deleteObjectLookups(objectApiName);
        for await (const fieldName of _.keys(objectConfig.fields)) {
            const field = objectConfig.fields[fieldName];
            field.name = fieldName;
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
        let detailName = [];
        _.each(metadata, function(item){
            if(item && _.isString(item)){
                const foo = item.split('.');
                if(foo.length > 0){
                    detailName.push(foo[0]);
                }
            }
        })
        return _.uniq(detailName);
    }
    async getDetailsInfo(objectApiName: string){
        let { metadata } = (await this.broker.call('metadata.get', { key: this.getDetailKey(objectApiName) }, { meta: {} })) || {};
        return metadata || [];
    }

    async removeDetail(objectApiName: any, detailObjectApiName: string, detailField: any) {
        let detail = await this.getDetailsInfo(objectApiName);
        let maps = [];
        if (detail) {
            maps = detail;
        }
        const detailFullName = `${detailObjectApiName}.${detailField.name}`
        maps = _.difference(maps, [detailFullName]);
        await this.broker.call('metadata.add', { key: this.getDetailKey(objectApiName), data: maps }, { meta: {} })
        // this.broker.emit(`@${objectApiName}.detailsChanged`, { objectApiName, detailObjectApiName, detailFieldName: detailField.name, detailFieldReferenceToFieldName: detailField.reference_to_field });
        return true;
    }

    async addDetail(objectApiName: any, detailObjectApiName: string, detailField: any) {
        let detail = await this.getDetailsInfo(objectApiName);
        let maps = [];
        if (detail) {
            maps = detail;
        }
        const detailFullName = `${detailObjectApiName}.${detailField.name}`
        let count = _.filter(maps, function(o) { return o.startsWith(`${detailObjectApiName}.`) && o != detailFullName});
        if (count.length < 1) {
            maps.push(detailFullName);
            maps = _.uniq(maps);
            await this.broker.call('metadata.add', { key: this.getDetailKey(objectApiName), data: maps }, { meta: {} })
            this.broker.emit(`@${objectApiName}.detailsChanged`, { objectApiName, detailObjectApiName, detailFieldName: detailField.name, detailFieldReferenceToFieldName: detailField.reference_to_field });
            return true;
        }
        return false;
    }

    // async removeDetail(objectApiName: any, detailObjectApiName: string) {
    //     let detail = await this.getDetails(objectApiName);
    //     let index = detail.indexOf(detailObjectApiName);
    //     if (index >= 0) {
    //         detail.splice(index, 1);
    //     }
    //     await this.broker.call('metadata.add', { key: this.getDetailKey(objectApiName), data: detail }, { meta: {} })
    // }

    async deleteObjectLookups(objectApiName: string) {
        await this.broker.call('metadata.delete', { key: this.getDetailKey(objectApiName) }, { meta: {} });
        return true;
    }
}