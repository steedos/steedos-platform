import { Register } from '@steedos/metadata-registrar';
import _ = require('lodash')

// 主子表有层级限制，超过3层就报错，该函数判断当前对象作为主表对象往下的层级最多不越过3层，
// 其3层指的是A-B-C-D，它们都有父子关系，A作为最顶层，该对象上不可以再创建主表子表关系字段，但是B、C、D上可以；
// 或者如果当前对象上创建的主表子表关系字段指向的对象是D，那么也会超过3层的层级限制；
// 又或者中间加一层M先连接B再连接C，形成A-B-M-C-D，也会超过3层的层级限制；
export const MAX_MASTER_DETAIL_LEAVE = 6;

/**
 * 判断传入的paths中最大层级深度
 * @param paths 对象上getDetailPaths或getMasterPaths函数返回的当前对象向下或向上取主表子表关联对象名称列表链条
 * 比如传入下面示例中的paths，表示当前对象b向下有4条主子关系链，最大层级深度为第2条，深度为3
 * [
    [ 'b', 't1', 't2' ],
    [ 'b', 't1', 'm1', 'm2' ],
    [ 'b', 't1', 'm2' ],
    [ 'b', 'c', 'd' ]
 * ]
 */
const getMaxPathLeave = (paths: string[]) => {
    let maxLeave = 0;
    _.each(paths, (n) => {
        if (maxLeave < n.length) {
            maxLeave = n.length;
        }
    });
    // A-B-C-D这种主表子表链按3层算
    maxLeave--;
    return maxLeave;
}

/**
 * 判断传入的paths中每条path下是否有重复对象名称，返回第一个重复的对象名称
 * 有可能传入的paths有多个链条，只要其中任何一个链条上有同名对象名说明异常，返回第一个异常的同名对象名即可
 * 比如传入下面示例中的paths，表示当前对象b向下有4条主子关系链，将返回第三条链中的重复对象名b
 * @param paths 对象上getDetailPaths或getMasterPaths函数返回的当前对象向下或向上取主表子表关联对象名称列表链条
 * [
    [ 'b', 't1', 't2' ],
    [ 'b', 't1', 'm1', 'm2' ],
    [ 'b', 't1', 'm2', 'b' ],
    [ 'b', 'c', 'd' ]
 * ]
 */
export const getRepeatObjectNameFromPaths = (paths: string[]) => {
    let repeatItem: string;
    for (let p of paths) {
        if (repeatItem) {
            break;
        }
        let g = _.groupBy(p);
        for (let k in g) {
            if (g[k].length > 1) {
                repeatItem = k;
                break;
            }
        }
    }
    return repeatItem;
}


export class MasterDetailActionHandler{
    broker: any = null;
    constructor(broker) {
        this.broker = broker;
    }

    async getObjectConfig(objectApiName: string) {
        const data = await this.broker.call('objects.get', { objectApiName: objectApiName })
        return data ? data.metadata : null;
    }

    async add(objectConfig){
        try {
            await this.addObjectMasterDetails(objectConfig);
            return true
        } catch (error) {
            this.broker.logger.error(error);
        }
        return false
    }
    
    async deleteAll(objectConfig) {
        try {
            if (!objectConfig) {
                return;
            }
            await this.deleteObjectMasterDetails(objectConfig.name);
            // await this.broker.call('metadata.fuzzyDelete', {key: this.getDetailKey('*', objectConfig.name, '*')}, {meta: {}});
            await Register.fuzzyDelete(this.broker, this.getDetailKey('*', objectConfig.name, '*'));
            return true;
        } catch (error) {
            this.broker.logger.error(error);
        }
        return false;
    }
    
    async remove(objectConfig){
        try {
            await this.removeObjectMasterDetails(objectConfig);
            return true
        } catch (error) {
            this.broker.logger.error(error);
        }
        return false
    }
    
    /**
     * 删除 主表子表类型字段 时，清理关联对象上masters 、details属性。
     * TODO: 解决的问题： master_detail字段删除后重建一个同名同类型字段不报错。
     * 测试过程中发现的问题： 在graphql查询数据时，如果删除一个相关的主表子表字段， 此时还能查询到相关表信息， 重启服务和刷新页面后才查询不到。
     * @param objectConfig 
     */
    async removeObjectMasterDetails(objectConfig){
        const { name: objectApiName } = objectConfig;
        let masters = await this.getMastersInfo(objectApiName);
        if(masters.length){
            for await (const item of masters){
                const fieldNameReferenceTo = item.split('.')[0];
                const fieldName = item.split('.')[1];
                const field = objectConfig.fields[fieldName];
                // 考虑以下情况： (字段删除 | 字段名改变） 、 字段类型改变、 字段引用对象改变
                if( !field || field.type !== 'master_detail' || field.reference_to !== fieldNameReferenceTo){
                    await this.removeMaster(objectApiName, fieldNameReferenceTo, fieldName);
                    await this.removeDetail(fieldNameReferenceTo, objectApiName, fieldName);
                }
            }
        }
    }

    async checkMasterDetails(objectApiName: string) {
        // 取消主表子表字段数量限制 #3697

        // const mastersCount = (await this.getMasters(objectApiName)).length;
        // const detailsCount = (await this.getDetails(objectApiName)).length;
        // if (mastersCount > 2) {
        //     throw new Error(`There are ${mastersCount} fields of type master_detail on the object '${objectApiName}', but only 2 fields are allowed at most.`);
        // }
        // else if (mastersCount > 1) {
        //     if (detailsCount > 0) {
        //         throw new Error(`There are ${mastersCount} fields of type master_detail on the object "${objectApiName}", but only 1 field are allowed at most, because this object is the master object of another object on a master-detail relationship.`);
        //     }
        // }

        const detailPaths = await this.getDetailPaths(objectApiName);

        /**
         * 去掉内核中判断主表子表层级限制判断，因为内核对象可能有需求不止要用3层，只保留零代码上触发器判断逻辑就行
         */
        // // 下面只需要写一个方向的层级if判断即可，不用向上和向下两边层级都判断，因为只要链条有问题，该链条任意一个对象都会报错，没必要让多个节点抛错
        // // 比如A-B-C-D-E这个链条超出最大层级数量，只要A对象向下取MaxDetailsLeave来判断就行，不必再判断E对象向上判断层级数量
        // const maxDetailLeave = this.getMaxDetailsLeave(detailPaths);
        // if(maxDetailLeave > MAX_MASTER_DETAIL_LEAVE){
        //     throw new Error(`It exceed the maximum depth of master-detail relationship for the detail side of the object '${this._name}', the paths is:${JSON.stringify(detailPaths)}`);
        // }

        // detailPaths中每个链条中不可以出现同名对象，理论上出现同名对象的话会死循环，上面的MAX_MASTER_DETAIL_LEAVE最大层级判断就已经会报错了
        const repeatName = getRepeatObjectNameFromPaths(detailPaths);
        if (repeatName) {
            throw new Error(`It meet one repeat object name '${repeatName}' in the master-detail relationships for the detail side of the object '${objectApiName}', the paths is:${JSON.stringify(detailPaths)}`);
        }
    }
    
    async addObjectMasterDetails(objectConfig) {
        const { name: objectApiName } = objectConfig;
        // await this.deleteObjectMasterDetails(objectApiName);
        for await (const fieldName of _.keys(objectConfig.fields)) {
            const field = objectConfig.fields[fieldName];
            field.name = fieldName;
            if (field.type === "master_detail") {
                // 加try catch是因为有错误时不应该影响下一个字段逻辑
                try {
                    if (field.reference_to && _.isString(field.reference_to)) {
                        if (field.reference_to === objectApiName) {
                            field.type = "lookup";//强行变更为最接近的类型
                            throw new Error(`load field 「${field.name}」 error: Can't set a master-detail field that reference to self on the object 「${objectApiName}」.`);
                        }
                        const addSuc = await this.addMaster(objectApiName, field.reference_to, field);

                        if (addSuc) {
                            await this.addDetail(field.reference_to, objectApiName, field);
                            // #1435 对象是作为其他对象的子表的话，owner的omit属性必须为true
                            // 因很多应用目前已经放开了子表的omit属性，这里就不限制了，影响不大，只在零代码界面配置时限制
                            // if(!this.getField("owner").omit){
                            //     throw new Error(`The omit property of the owner field on the object '${objectApiName}' must be true, because there is a master-detail field named '${field.name}' on the object.`);
                            // }
                        }
                        else {
                            // 不能选之前已经在该对象上建过的主表-子表字段上关联的相同对象
                            field.type = "lookup";//强行变更为最接近的类型
                            throw new Error(`Can't set a master-detail field that reference to the same object '${field.reference_to}' that had referenced to by other master-detail filed which named '${objectApiName}.${field.name}' on the object '${objectApiName}'.`);
                        }
                    }
                }
                catch (ex) {
                    console.error(ex);
                }
            }
        }
        await this.checkMasterDetails(objectApiName);
    }

    getMasterKey(objectApiName, masterApiName){
        return `$steedos.$masterDetail.#${objectApiName}.$master.${masterApiName}`
    }

    async getMasters(objectApiName: string){
        let mastersInfo = await this.getMastersInfo(objectApiName);
        let mastersName = [];
        _.each(mastersInfo, function(item){
            if(item && _.isString(item)){
                const foo = item.split('.');
                if(foo.length > 0){
                    mastersName.push(foo[0]);
                }
            }
        })
        return _.uniq(mastersName);
    }

    getMastersInfoKey(objectApiName: string) {
        return this.getMasterKey(objectApiName, "*");
    }
    async getMastersInfo(objectApiName: string){
        const mastersInfo = [];
        // let records = (await this.broker.call('metadata.filter', { key: this.getMasterKey(objectApiName, "*") }, { meta: {} })) || {};
        let records: any = (await Register.filter(this.broker, this.getMasterKey(objectApiName, "*"))) || {};
        for await (const item of records) {
            const metadata = item?.metadata;
            if(metadata){
                mastersInfo.push(metadata.key);
            }
        }
        return mastersInfo;
    }

    async addMaster(objectApiName: any, masterObjectApiName: string, field: any){
        const masterFullName = `${masterObjectApiName}.${field.name}`
        // await this.broker.call('metadata.add', {key: this.getMasterKey(objectApiName, masterFullName), data: {type: 'master', objectName: objectApiName, key: masterFullName}}, {meta: {}})
        await Register.add(this.broker, {key: this.getMasterKey(objectApiName, masterFullName), data: {type: 'master', objectName: objectApiName, key: masterFullName}}, {})
        return true;
    }

    async removeMaster(objectApiName: any, masterObjectApiName: string, masterFieldName: any){
        const masterFullName = `${masterObjectApiName}.${masterFieldName}`
        // await this.broker.call('metadata.delete', { key: this.getMasterKey(objectApiName, masterFullName) }, { meta: {} })
        await Register.delete(this.broker, this.getMasterKey(objectApiName, masterFullName))
        return true;
    }

    getDetailKey(objectApiName, detailObjectApiName, detailFieldName){
        return `$steedos.$masterDetail.#${objectApiName}.$detail.${detailObjectApiName}.${detailFieldName}`
    }

    async getDetails(objectApiName: string){
        let detailsInfo = await this.getDetailsInfo(objectApiName);
        let detailsName = [];
        _.each(detailsInfo, function(item){
            if(item && _.isString(item)){
                const foo = item.split('.');
                if(foo.length > 0){
                    detailsName.push(foo[0]);
                }
            }
        })
        return _.uniq(detailsName);
    }

    getDetailsInfoKey(objectApiName: string) {
        return this.getDetailKey(objectApiName, "*", "*");
    }

    async getDetailsInfo(objectApiName: string){
        const detailsInfo = [];
        // let records = (await this.broker.call('metadata.filter', { key: this.getDetailKey(objectApiName, "*", "*") }, { meta: {} })) || {};
        let records: any = (await Register.filter(this.broker, this.getDetailKey(objectApiName, "*", "*"))) || {}
        for await (const item of records) {
            const metadata = item?.metadata;
            if(metadata){
                detailsInfo.push(metadata.key);
            }
        }
        return detailsInfo;
    }

    async addDetail(objectApiName: any, detailObjectApiName: string, detailField: any){
        const detailFullName = `${detailObjectApiName}.${detailField.name}`
        // await this.broker.call('metadata.add', {key: this.getDetailKey(objectApiName, detailObjectApiName, detailField.name), data: {type: 'detail', objectName: objectApiName, key: detailFullName}}, {meta: {}})
        await Register.add(this.broker, {key: this.getDetailKey(objectApiName, detailObjectApiName, detailField.name), data: {type: 'detail', objectName: objectApiName, key: detailFullName}}, {})
        this.broker.broadcast(`@${objectApiName}.detailsChanged`, { objectApiName, detailObjectApiName, detailFieldName: detailField.name, detailFieldReferenceToFieldName: detailField.reference_to_field });
        return true;
    }
    
    async removeDetail(objectApiName: any, detailObjectApiName: string, detailFieldName: any){
        // await this.broker.call('metadata.delete', { key: this.getDetailKey(objectApiName, detailObjectApiName, detailFieldName)}, { meta: {} })
        await Register.delete(this.broker, this.getDetailKey(objectApiName, detailObjectApiName, detailFieldName))
        return true;
    }

    async getDetailPaths(objectApiName: string){
        let results = [];
        let objectDetails = await this.getDetails(objectApiName);
        let loop = async (master: string, details: string[], paths: string[], leave: number) => {
            paths.push(master);
            if (!details.length) {
                results.push(paths);
                return;
            }
            leave++;
            if (leave > MAX_MASTER_DETAIL_LEAVE + 3) {
                // 加这段逻辑是避免死循环，results最多只输出MAX_MASTER_DETAIL_LEAVE+3层
                console.error(`Meet max loop for the detail paths of ${objectApiName}`);
                return;
            }
            for await (const n of details) {
                const objectDetail = await this.getDetails(n);
                await loop(n, objectDetail, _.clone(paths), leave);
            }
           
        }
        // console.log("==getDetailPaths======", objectApiName);
        await loop(objectApiName, objectDetails, [], 0);
        // console.log("==getDetailPaths=", JSON.stringify(results));
        return results;
    }

    async getMasterPaths(objectApiName: string){
        let results = [];
        let objectMasters = await this.getMasters(objectApiName);
        let loop = async (detail: string, masters: string[], paths: string[], leave: number) => {
            paths.push(detail);
            if (!masters.length) {
                results.push(paths);
                return;
            }
            leave++;
            if (leave > MAX_MASTER_DETAIL_LEAVE + 3) {
                // 加这段逻辑是避免死循环，results最多只输出MAX_MASTER_DETAIL_LEAVE+3层
                console.error(`Meet max loop for the detail paths of ${objectApiName}`);
                return;
            }
            for await (const n of masters) {
                const objectMaster = await this.getMasters(n);
                await loop(n, objectMaster, _.clone(paths), leave);
            }
        }
        await loop(objectApiName, objectMasters, [], 0);
        return results;
    }

    async getMaxDetailsLeave(objectApiName: string, paths?: string[]){
        if (!paths) {
            paths = await this.getDetailPaths(objectApiName);
        }
        return getMaxPathLeave(paths);
    }

    async getMaxMastersLeave(objectApiName: string, paths?: string[]) {
        if (!paths) {
            paths = await this.getMasterPaths(objectApiName);
        }
        return getMaxPathLeave(paths);
    }

    async deleteObjectMasterDetails(objectApiName: string){
        // await this.broker.call('metadata.fuzzyDelete', {key: this.getMasterKey(objectApiName, '*')}, {meta: {}});
        await Register.fuzzyDelete(this.broker, this.getMasterKey(objectApiName, '*'));
        // await this.broker.call('metadata.fuzzyDelete', {key: this.getDetailKey(objectApiName, '*', '*')}, {meta: {}});
        await Register.fuzzyDelete(this.broker, this.getDetailKey(objectApiName, '*', '*'));
        return true;
    }
}