const objectql = require("@steedos/objectql");
const _ = require("underscore");
const globby = require("globby");
const path = require("path");

export class LoadFiles {

    static run() {
        this.loadStandardFiles();
        this.loadDefaultDatasourcesFiles();
    }

    private static loadStandardFiles() {
        let standardObjectsDir = path.dirname(require.resolve("@steedos/standard-objects"))
        if (standardObjectsDir) {
            this.loadObjectToCreator(standardObjectsDir);
            this.loadAppToCreator(standardObjectsDir);
        }
    }

    //加载default数据源下的object, app文件，默认路径为src文件夹
    private static loadDefaultDatasourcesFiles() {
        let datasourcesConfig = Meteor.settings.datasources

        if(!datasourcesConfig){
            return ;
        }

        let defaultPaths = ["./src/**"];

        //如果有多个数据源， 不默认加载src下定义的object，app文件
        if (_.keys(Meteor.settings.datasources).length > 1) {
            defaultPaths = []
        }

        if (datasourcesConfig && datasourcesConfig.default) {
            let objectFilesPath = datasourcesConfig.default.objectFiles || defaultPaths
            _.each(objectFilesPath, (objectFilePath) => {
                this.loadObjectToCreator(objectFilePath)
            })
            let appFilesPath = datasourcesConfig.default.appFiles || defaultPaths
            _.each(appFilesPath, (appFilePath) => {
                this.loadAppToCreator(appFilePath)
            })
        }
    }

    private static loadObjectToCreator(filePath: string) {

        if (!path.isAbsolute(filePath)) {
            filePath = path.resolve(objectql.getBaseDirectory(), filePath);
        }

        //load .object.yml
        let objects = objectql.loadObjectFiles(filePath)
        _.each(objects, (object) => {
            if (object.name != 'core') {
                Creator.Objects[object.name] = object
            }
        })

        //load .object.js
        const filePatten = [
            path.join(filePath, "*.object.js")
        ]

        const matchedPaths: [string] = globby.sync(filePatten);
        _.each(matchedPaths, (matchedPath) => {
            require(matchedPath);
        })

    }

    private static loadAppToCreator(filePath: string) {

        if (!path.isAbsolute(filePath)) {
            filePath = path.resolve(objectql.getBaseDirectory(), filePath);
        }

        //load .app.js
        let apps = objectql.loadApps(filePath)
        _.each(apps, (app) => {
            Creator.Apps[app._id] = app
        })

    }
}

