import { getSteedosConfig, SteedosMongoDriver } from "@steedos/objectql";

let mongodrivers = {};

export function newCollection(tableName: string, datasourceName?: string, options?: object) {
    if (!datasourceName) {
        datasourceName = 'meteor'
    }
    const config = getSteedosConfig();
    let datasourceConfig = config.datasources[datasourceName] || config.datasources['default'];
    let locale = datasourceConfig.locale || 'zh';
    let driver = mongodrivers[datasourceName];
    if (!driver) {
        driver = new SteedosMongoDriver(datasourceConfig.connection);
        mongodrivers[datasourceName] = driver;
    }

    if (locale) {
        Meteor.wrapAsync(function (driver, tableName, locale, cb) {
            driver.connect().then(function () {
                let db = driver._client.db();
                db.createCollection(tableName,
                    {
                        'collation': { 'locale': locale },
                    },
                    function (err, results) {
                        if (err) {
                            if (err.code != 48) {
                                console.error(err);
                            }
                        }
                        cb();
                    }
                );
            });

        })(driver, tableName, locale);

    }

    if(tableName === 'object_webhooks_queue'){
        if(ObjectWebhooksQueue && ObjectWebhooksQueue.collection){
            return ObjectWebhooksQueue.collection
        }
    }

    if (options) {
        return new Meteor.Collection(tableName, options)
    } else {
        return new Meteor.Collection(tableName)
    }

}
