/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2024-03-22 09:49:22
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-04-24 15:55:16
 * @Description: 
 */
const cachers = require('@steedos/cachers');
const { metadataDriver } = require('@steedos/utils')

declare var Creator;

export class MetadataCacherBase {
    supportSpace = true;
    cacher;
    metadataName;
    collectionName;
    observeHandle;
    cacherName;
    observeQuery;

    constructor(collectionName, supportSpace, observeQuery = {}) {
        this.collectionName = collectionName;
        this.supportSpace = supportSpace;
        this.cacherName = `metadata.${collectionName}`
        this.cacher = cachers.getCacher(this.cacherName);
        this.observeQuery = observeQuery;

        try {
            this.observeHandle = Creator.getCollection(collectionName).find(observeQuery).observe({
                added: (doc)=>{
                    this.onAdded(doc)
                },
                changed: (doc, oldDoc)=>{
                    this.onChanged(doc, oldDoc)
                },
                removed: (doc)=>{
                    this.onRemoved(doc)
                }
            });
        } catch (error) {
            console.error(`${collectionName} observeHandle error`, error);
        }
    }
    onAdded(doc){
        this.set(doc._id, doc);
    }

    onChanged(newDoc, oldDoc) {
        this.set(newDoc._id, newDoc);
    }

    onRemoved(doc) {
        this.delete(doc._id);
    }

    set(_id, value) {
        if(!_id){
            throw new Error('key is null')
        }
        return this.cacher.set(_id, value);
    }

    delete(_id) {
        return this.cacher.delete(_id);
    }

    get(_id) {
        return this.cacher.get(_id);
    }

    find(filters, spaceId?) {
        const records = this.cacher.values();
        if (this.supportSpace) {
            filters = [filters, ['space', '=', spaceId]]
            return metadataDriver.find(records, {filters}, spaceId);
        }
        return metadataDriver.find(records, {filters});
    }

    // 销毁
    destroy() {
        if (this.observeHandle) {
            this.observeHandle.stop();
            this.cacher.clearCacher(this.cacherName);
        }
    }
}