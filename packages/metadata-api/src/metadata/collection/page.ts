/*
 * @Author: baozhoutao@hotoa.com
 * @Date: 2021-08-30 12:06:41
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-04-11 15:34:46
 * @Description: 
 */
import { SteedosMetadataTypeInfoKeys as TypeInfoKeys } from '@steedos/metadata-core';
import _ from 'underscore';
import { MetadataBaseCollection } from './_base'
import { deleteCommonAttribute, sortAttribute } from '../../util/attributeUtil'

const metadataName = TypeInfoKeys.Page;
const WIGETS_TABLE_NAME = "widgets";
const ASSIGNMENTS_TABLE_NAME = "page_assignments";
const PAGE_VERSION_TABLE_NAME = "page_versions";
export class PageCollection extends MetadataBaseCollection{
    constructor(){
        super(metadataName, [WIGETS_TABLE_NAME]);
    }

    async find(dbManager){
        const pages = await dbManager.find(this.collectionName, {});
        for (const page of pages) {
            page.widgets = await this.getPageWidgets(dbManager, page.name);
            // 获取page_assignments和page_versions最新的一条记录的schema
            page.pageAssignments = await this.getPageAssignments(dbManager, page._id);
            page.schema = await this.getLatestPageVersionSchema(dbManager, page._id);
        }
        return pages;
    }

    async findOne(dbManager, metadataApiName){
        const page = await dbManager.findOne(this.collectionName, {name: metadataApiName});
        page[WIGETS_TABLE_NAME] = await this.getPageWidgets(dbManager, page.name);
        // 获取page_assignments和page_versions最新的一条记录的schema
        page.pageAssignments = await this.getPageAssignments(dbManager, page._id);
        page.schema = await this.getLatestPageVersionSchema(dbManager, page._id);
        return page;
    }

    async save(dbManager, data){
        var filter = {name: data.name};
        var record = await dbManager.findOne(this.collectionName, filter);
        const pageWidgets = data[WIGETS_TABLE_NAME];
        await this.savePageWidgets(dbManager, data.name, pageWidgets)
        if(record == null){
            return await dbManager.insert(this.collectionName, data);
        }else{
            return await dbManager.update(this.collectionName, filter, data);
        }
    }

    private async savePageWidgets(dbManager, pageApiName, pageWidgets){
        if(pageWidgets && _.isArray(pageWidgets)){
            for await (let widget of pageWidgets) {
                if(!widget.name){
                    throw new Error('not find widget.name');
                }
                const widgetRecord = await this.getPageWidget(dbManager, pageApiName, widget.name);
                widget.page = pageApiName;
                if(widgetRecord){
                    await dbManager.update(WIGETS_TABLE_NAME, {_id: widgetRecord._id}, widget);
                }else{
                    await dbManager.insert(WIGETS_TABLE_NAME, widget);
                }
            }
        }
    }

    private async getPageWidget(dbManager, pageApiName, widgetApiName){
        const widgets = await dbManager.find(WIGETS_TABLE_NAME, {page: pageApiName, name: widgetApiName});
        if(widgets && widgets.length > 0){
            return widgets[0]
        }
    }

    private async getPageWidgets(dbManager, pageApiName){
        const widgets = await dbManager.find(WIGETS_TABLE_NAME, {page: pageApiName});
        _.map(widgets, (widget)=>{
            delete widget.page;
            delete widget.id;
        })
        return widgets
    }

    // 获取page_assignments返回必要属性
    private async getPageAssignments(dbManager, pageId){
        const pageAssignments = await dbManager.find(ASSIGNMENTS_TABLE_NAME, {page: pageId});
        if(pageAssignments && pageAssignments.length > 0){
            for (const assignment of pageAssignments) {
                deleteCommonAttribute(assignment);
            }
        }
        return pageAssignments;
    }

    // 获取page_versions最新版的schema
    private async getLatestPageVersionSchema(dbManager, pageId){
        const pageVersions = await dbManager.find(PAGE_VERSION_TABLE_NAME, {page: pageId}, {sort: {version: -1}});
        if(pageVersions && pageVersions.length > 0){
            return pageVersions[0].schema;
        }
        return '';
    }
}
