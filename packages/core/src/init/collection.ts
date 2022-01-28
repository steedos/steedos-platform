import { getSteedosConfig, SteedosMongoDriver } from "@steedos/objectql";
import { includes } from 'lodash'
let mongodrivers = {};

const mongodriversCollectionNames = {};

export function newCollection(tableName: string, datasourceName?: string, options?: object) {
    if (!datasourceName) {
        datasourceName = 'meteor'
    }
    const config = getSteedosConfig();
    let datasourceConfig = config.datasources[datasourceName] || config.datasources['default'];
    let locale = datasourceConfig.locale || 'zh';
    let documentDB = datasourceConfig.documentDB || false;
    let driver = mongodrivers[datasourceName];
    if (!driver) {
        driver = new SteedosMongoDriver(datasourceConfig.connection);
        mongodrivers[datasourceName] = driver;
    }

    if (locale && !includes(mongodriversCollectionNames[datasourceName], tableName)) {
        Meteor.wrapAsync(function (driver, tableName, locale, cb) {
            driver.connect().then(function () {
                let collation = {};
                let db = driver._client.db();
                if (!mongodriversCollectionNames[datasourceName]) {
                    mongodriversCollectionNames[datasourceName] = [];
                    db.listCollections().forEach((results) => {
                        mongodriversCollectionNames[datasourceName].push(results.name);
                    });
                }
                // documentDB不支持collation
                if (!documentDB) {
                    collation = {
                        'collation': { 'locale': locale },
                    };
                }
                db.createCollection(tableName, collation,
                    function (err, results) {
                        if (err) {
                            if (err.code != 48) {
                                console.error(err);
                            }
                        }
                        mongodriversCollectionNames[datasourceName].push(tableName)
                        cb();
                    }
                );
            });

        })(driver, tableName, locale);

    }

    if (tableName === 'object_webhooks_queue') {
        if (ObjectWebhooksQueue && ObjectWebhooksQueue.collection) {
            return ObjectWebhooksQueue.collection
        }
    }
    if (options) {
        return new Meteor.Collection(tableName, options)
    } else {
        const _collection = Creator.getCollection(tableName)
        if(_collection){
            return _collection
        }
        return new Meteor.Collection(tableName)
    }

}
