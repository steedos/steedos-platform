/*
 * @Author: baozhoutao@hotoa.com
 * @Date: 2021-09-10 16:44:24
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-10-27 09:27:35
 * @Description: 
 */
import { SteedosMetadataTypeInfoKeys as TypeInfoKeys } from '@steedos/metadata-core';
import _ from 'underscore';
import { MetadataBaseCollection } from './_base'
const clone = require('clone')

const metadataName = TypeInfoKeys.Tab;
const PERMISSION_TABS_TABLE_NAME = "permission_tabs"
const RELATED_PROPERTY_NAME_OF_PERMISSION_TABS = "permissions"
export class TabCollection extends MetadataBaseCollection {
    constructor() {
        super(metadataName, [RELATED_PROPERTY_NAME_OF_PERMISSION_TABS]);
    }

    async find(dbManager) {
        const tabs = await dbManager.find(this.collectionName, {});
        for (const tab of tabs) {
            tab[RELATED_PROPERTY_NAME_OF_PERMISSION_TABS] = await this.getPermissionTabs(dbManager, tab.name);
        }
        return tabs;
    }

    async findOne(dbManager, metadataApiName) {
        const tab = await dbManager.findOne(this.collectionName, { name: metadataApiName });
        tab[RELATED_PROPERTY_NAME_OF_PERMISSION_TABS] = await this.getPermissionTabs(dbManager, tab.name);
        return tab;
    }

    async save(dbManager, data) {
        const clonedData = clone(data)
        delete data.permissions
        const tabApiName = data.name
        var filter = { name: tabApiName };
        var record = await dbManager.findOne(this.collectionName, filter);

        let result: any = null;

        if (record == null) {
            result = await dbManager.insert(this.collectionName, data);
        } else {
            result = await dbManager.update(this.collectionName, filter, data);
        }

        // 保存permission_tabs
        await this.savePermissionTabs(dbManager, tabApiName, clonedData.permissions);

        return result;
    }

    private async getPermissionTabs(dbManager, tabApiName) {
        const permissionTabs = await dbManager.find(PERMISSION_TABS_TABLE_NAME, { tab: tabApiName });
        _.map(permissionTabs, (pTab) => {
            delete pTab.tab;
        })
        return permissionTabs
    }

    private async savePermissionTabs(dbManager, tabApiName, permissionTabs) {
        if (permissionTabs && _.isArray(permissionTabs)) {
            for await (let pTab of permissionTabs) {
                const pTabRecord = await this.getPermissionTab(dbManager, tabApiName, pTab.permission_set);
                pTab.tab = tabApiName;
                if (pTabRecord) {
                    await dbManager.update(PERMISSION_TABS_TABLE_NAME, { _id: pTabRecord._id }, pTab);
                } else {
                    await dbManager.insert(PERMISSION_TABS_TABLE_NAME, pTab);
                }
            }
        }
    }

    private async getPermissionTab(dbManager, tabApiName, permissionSetApiName) {
        const permissionTabs = await dbManager.find(PERMISSION_TABS_TABLE_NAME, { tab: tabApiName, permission_set: permissionSetApiName });
        if (permissionTabs && permissionTabs.length > 0) {
            return permissionTabs[0]
        }
    }
}
