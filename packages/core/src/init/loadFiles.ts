const objectql = require("@steedos/objectql");
const _ = require("underscore");
const globby = require("globby");
const path = require("path");
const fs = require("fs");
const clone = require("clone");
export class LoadFiles {

    static _extendObjectsConfig = []

    static initStandardObjects(){
        this.loadStandardFiles();
    }

    static initProjectObjects() {
        this.loadDefaultDatasourcesFiles();
        this.initProjectExtendObjects();
        this.loadDatasourcesStaticJs();
    }

    private static initProjectExtendObjects(){
        _.each(this._extendObjectsConfig, (objectConfig)=>{
            let parentObjectConfig = clone(Creator.Objects[objectConfig.extend]);
            if(_.isEmpty(parentObjectConfig)){
                throw new Error(`not find extend object: ${objectConfig.extend}`);
            }
            let config = objectql.extend(parentObjectConfig, objectConfig);
            delete config.extend
            Creator.Objects[objectConfig.extend] = config
        })
    }

    private static loadDatasourcesStaticJs(){
        let datasourcesConfig = Meteor.settings.datasources

        if(!datasourcesConfig){
            return ;
        }
        _.each(datasourcesConfig, (datasource, key)=>{
            if(datasource.objectFiles){
                _.each(datasource.objectFiles, (filePath)=>{
                    this.addStaticJs(filePath);
                })
            }
        })
    }

    private static loadStandardFiles() {
        let standardObjectsDir = path.dirname(require.resolve("@steedos/standard-objects"))
        if (standardObjectsDir) {
            standardObjectsDir = path.posix.join(standardObjectsDir, '/**');
            this.loadObjectToCreator(standardObjectsDir);
            this.loadAppToCreator(standardObjectsDir);
            this.addStaticJs(standardObjectsDir);
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

    static loadObjectToCreator(filePath: string) {

        if (!path.isAbsolute(filePath)) {
            filePath = path.resolve(objectql.getBaseDirectory(), filePath);
        }

        //load .object.yml
        let objects = objectql.loadObjectFiles(filePath)
        _.each(objects, (object) => {
            if(object.extend){
                this._extendObjectsConfig.push(object)
            }else{
                if (object.name != 'core') {
                    Creator.Objects[object.name] = object
                }
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

    static loadAppToCreator(filePath: string) {

        if (!path.isAbsolute(filePath)) {
            filePath = path.resolve(objectql.getBaseDirectory(), filePath);
        }

        //load .app.js
        let apps = objectql.loadApps(filePath)
        _.each(apps, (app) => {
            Creator.Apps[app._id] = app
        })

    }

    private static getText(filePath: string, encoding: string){
        return fs.readFileSync(filePath, encoding);
    }

    static addStaticJs(filePath: string){
        const filePatten = [
            path.join(filePath, "*.client.js")
        ]
        let matchedPaths: [string] = globby.sync(filePatten);
        matchedPaths = _.sortBy(matchedPaths)
        _.each(matchedPaths, (matchedPath) => {
            let minifyJs = this.getText(matchedPath, "utf8")
            WebAppInternals.addStaticJs(minifyJs)
        })
    }
}

