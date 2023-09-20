/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-02 13:17:06
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-09-20 16:10:55
 * @Description: 
 */
"use strict";
const project = require('./package.json');
const packageName = project.name;
const packageLoader = require('@steedos/service-meteor-package-loader');
const objectql = require('@steedos/objectql');
const { MongoClient } = require('mongodb');
const _ = require('lodash')

const triggers = require('./src/triggers')

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
module.exports = {
    name: packageName,
    namespace: "steedos",
    mixins: [packageLoader],
    /**
     * Settings
     */
    settings: {
        packageInfo: {
            path: __dirname,
            name: packageName,
            isPackage: false
        }
    },

    /**
     * Dependencies
     */
    dependencies: ['~packages-standard-objects'],

    /**
     * Actions
     */
    actions: {
        ...triggers,
    },

    /**
     * Events
     */
    events: {
        /**
         * [Feature]: Master-detail relationship 级联删除 #4984
         * [Feature]: Lookup relationship 级联删除 #4985
         * 考虑死循环的情况，A 主表是 B，B主表是A
         */
        "@*.deleted": {
            async handler(ctx) {
                // console.log(require('chalk').red('-------------------@*.deleted-------------------'), ctx.params)
                const params = ctx.params
                const { isDelete, isAfter, previousDoc, objectName } = params;
                if (isAfter && isDelete) {
                    const spaceId = previousDoc.space;
                    const obj = objectql.getObject(objectName);
                    const detailsInfo = await obj.getDetailsInfo(); // 查找当前哪些对象有masterDetail字段引用当前对象
                    const lookupDetailsInfo = await obj.getLookupDetailsInfo(); // 查找当前哪些对象有lookup字段引用当前对象

                    // 空的不执行
                    if (_.isEmpty(detailsInfo) && _.isEmpty(lookupDetailsInfo)) {
                        return;
                    }

                    const client = new MongoClient(process.env.MONGO_URL, {
                        useNewUrlParser: true,
                        useUnifiedTopology: true,
                    });
                    await client.connect();
                    const db = client.db();

                    // Start a session.
                    const session = client.startSession();

                    // Start a transaction
                    session.startTransaction({ readConcern: { level: "majority" }, writeConcern: { w: "majority" }, readPreference: 'primary' });

                    // Operations inside the transaction
                    try {
                        const infoMap = {}; // 防止死循环
                        const deleteDetails = async (detailsInfo, previousDoc) => {
                            for (const info of detailsInfo) {
                                if (!infoMap[info]) {
                                    infoMap[info] = 1
                                } else {
                                    continue;
                                }
                                const infos = info.split(".");
                                const detailObjectApiName = infos[0];
                                const detailFieldName = infos[1];

                                const detailObj = objectql.getObject(detailObjectApiName);
                                const detailField = detailObj.getField(detailFieldName);
                                const refFieldName = detailField.reference_to_field || '_id'

                                const detailColl = db.collection(detailObjectApiName);
                                const query = { [detailFieldName]: previousDoc[refFieldName], space: spaceId };
                                const docs = await detailColl.find(query, { session }).toArray()
                                await detailColl.deleteMany(query, { session });

                                const detailDetailsInfo = await detailObj.getDetailsInfo();
                                if (detailDetailsInfo.length > 0) {
                                    for (const doc of docs) {
                                        await deleteDetails(detailDetailsInfo, doc)
                                    }
                                }
                            }
                        }

                        await deleteDetails(detailsInfo, previousDoc)

                        for (const info of lookupDetailsInfo) {
                            const infos = info.split(".");
                            const detailObjectApiName = infos[0];
                            const detailFieldName = infos[1];
                            const detailObj = objectql.getObject(detailObjectApiName);
                            const detailField = detailObj.getField(detailFieldName);
                            if ('clear' === detailField.deleted_lookup_record_behavior || !detailField.deleted_lookup_record_behavior) { // 清除相关记录lookup字段的值，默认清除
                                const refFieldName = detailField.reference_to_field || '_id'
                                const detailColl = db.collection(detailObjectApiName);
                                await detailColl.updateMany({
                                    [detailFieldName]: previousDoc[refFieldName]
                                }, {
                                    $unset: {
                                        [detailFieldName]: 1
                                    }
                                }, { session });
                            }
                        }

                        await session.commitTransaction();
                    } catch (error) {
                        // Abort transaction on error
                        await session.abortTransaction();
                        console.error(error);
                    } finally {
                        await session.endSession();
                        await client.close();
                    }

                }
            }
        },
    },

    /**
     * Methods
     */
    methods: {

    },

    /**
     * Service created lifecycle event handler
     */
    created() {
    },

    /**
     * Service started lifecycle event handler
     */
    async started() {

    },

    /**
     * Service stopped lifecycle event handler
     */
    async stopped() {

    }
};
