const clone = require("clone")
const _ = require("underscore")
import {Util} from './util'
import { DEFAULT_LISTVIEW } from '@steedos/metadata-core';

export class PublishListViews {
    spaceId:string
    userId: string
    listViews: any
    util: any

    constructor(spaceId, userId, listViews){
        this.spaceId = spaceId
        this.userId = userId
        this.listViews = listViews
        this.util = new Util()
    }

    async run() {
        for(var listView of this.listViews){
            await this.viewToDB(listView)
        }
        console.log('publish run end...');
    }

    async viewToDB(listView) {
        let doc = this.formatListView(listView)
        let dbView:any = await this.findViewToDB(doc)
        
        if (dbView) {
            this.updateViewToDB(dbView._id, doc)
        } else {
            this.insertViewToDB(doc)
        }
    }

    async findViewToDB(doc) {
        return await this.util.dbExec(this.userId, "object_listviews", "direct.findOne", { space: doc.space, object_name: doc.object_name, api_name: doc.api_name })
    }

    async insertViewToDB(doc) {
        await this.util.dbExec(this.userId, "object_listviews", "direct.insert", doc, { filter: false, validate: false })
    }

    async updateViewToDB(_id, doc) {
        this.util.dbExec(this.userId, "object_listviews", "direct.update", { _id: _id }, { $set: doc, filter: false, validate: false })
    }

    formatListView(listView) {
        let view = clone(listView)
        view.api_name = view.name
        view.space = this.spaceId
        _.each(DEFAULT_LISTVIEW, (value: any, key: any) => {
            if (!_.has(view, key)) {
                view[key] = value;
            }
        });
        view.owner = this.userId

        _.each(view.columns, (column, i) => {
            if (_.isString(column)) {
                view.columns[i] = { field: column }
            }
        })

        if (_.isObject(view.options)) {
            view.options = JSON.stringify(view.options, function (key, val) {
                if (typeof val === 'function') {
                    return val + '';
                }
                return val;
            })
        }
        return view;
    }
}