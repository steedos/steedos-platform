const _ = require("underscore");
const lodash = require("lodash");
var objectql = require('@steedos/objectql');
var schema = objectql.getSteedosSchema();
const datasourceCore = require('./datasources.core');
const defaultDatasourceName = 'default';
const defaultDatasourcesName = ['default','meteor'];

Meteor.publish("datasources", function (spaceId) {
    var userId = this.userId
    if (!userId)
        throw new Meteor.Error("401", "Authentication is required and has not been provided.")

    if (db.space_users.findOne({ user: userId, space: spaceId })) {
        return Creator.Collections["datasources"].find({ space: spaceId }, { fields: { _id: 1, space: 1, name: 1, label:1 } })
    }
    return [];
});

Creator.Objects['datasources'].methods = {
    testConnection: async function (req, res) {
        var userSession = req.user
            var recordId = req.params._id;
            if(lodash.includes(defaultDatasourceName, recordId)){
                return res.send({ok: 1});
            }
            var spaceId = userSession.spaceId
            let doc = await objectql.getObject('datasources').findOne(recordId, {filters: `(space eq \'${spaceId}\')`});
            if(doc){
                var datasource;
                try {
                    datasourceCore.checkDriver(doc.driver);
                    let datasourceName =  `${recordId}_${spaceId}_${doc.name}__test`
                    doc.name = datasourceName
                    if (doc.mssql_options) {
                        doc.options = JSON.parse(doc.mssql_options)
                        delete doc.mssql_options
                    }
                    datasource = schema.addDataSource(doc.name, doc, true); 
                    if(doc.driver === 'mongo'){
                        await datasource._adapter.connect();
                    }else{
                        await datasource._adapter.init({});
                    }
                    await datasource.close();
                    schema.removeDataSource(datasourceName);
                    return res.send({ok: 1});
                } catch (error) {
                    if(datasource){
                        await datasource.close();
                    }
                    return res.status(500).send({error: error.message || error.toString()});
                }
            }
            return res.status(404).send({error: 'not find'});
    }
}

function checkName(name){
    var reg = new RegExp('^[a-z]([a-z0-9]|_(?!_))*[a-z0-9]$');
    if(!reg.test(name)){
        throw new Error("datasources__error_name_invalid_format");
    }
    if(name.length > 50){
        throw new Error("API 名称长度不能大于50个字符");
    }
    return true
}

function getConfigDatasources(){
    var config = objectql.getSteedosConfig() || {};
    return _.keys(config.datasources);
}

function isRepeatedName(id, name) {
    if(name === defaultDatasourceName){
        return true;
    }

    if(_.include(defaultDatasourcesName, name)){
        return true;
    }

    if(_.include(getConfigDatasources(), name)){
        return true;
    }

    var other;
    other = Creator.getCollection("datasources").find({
        _id: {
            $ne: id
        },
        name: name
    }, {
        fields: {
            _id: 1
        }
    });
    if (other.count() > 0) {
        return true;
    }
    return false;
};

function allowChangeDatasource(){
    var config = objectql.getSteedosConfig();
    if(config.tenant && config.tenant.saas){
        return false
    }else{
        return true;
    }
}

Creator.Objects.datasources.triggers = {
    "before.insert.server.datasources": {
        on: "server",
        when: "before.insert",
        todo: function (userId, doc) {
            if(!allowChangeDatasource()){
                throw new Meteor.Error(500, "华炎云服务不包含自定义数据源的功能，请部署私有云版本");
            }
            checkName(doc.name);
            if (isRepeatedName(doc._id, doc.name)) {
                throw new Meteor.Error(500, "数据源名称不能重复");
            }

            if(doc.is_enable){
                datasourceCore.checkDriver(doc.driver)
            }

            doc.custom = true;
        }
    },
    "before.update.server.datasources": {
        on: "server",
        when: "before.update",
        todo: function (userId, doc, fieldNames, modifier, options) {
            modifier.$set = modifier.$set || {}
            if(!allowChangeDatasource()){
                throw new Meteor.Error(500, "华炎云服务不包含自定义数据源的功能，请部署私有云版本");
            }

            if(_.has(modifier.$set, "name") && modifier.$set.name != doc.name){
                checkName(modifier.$set.name);
                if (isRepeatedName(doc._id, modifier.$set.name)) {
                    throw new Meteor.Error(500, "数据源名称不能重复");
                }
            }

            if(_.has(modifier.$set, "is_enable") && modifier.$set.is_enable || _.has(modifier.$set, "driver")){
                datasourceCore.checkDriver(doc.driver)
            }
        }
    },
    "before.remove.server.datasources": {
        on: "server",
        when: "before.remove",
        todo: function (userId, doc) {
            if(!allowChangeDatasource()){
                throw new Meteor.Error(500, "华炎云服务不包含自定义数据源的功能，请部署私有云版本");
            }
            var documents = Creator.getCollection("objects").find({datasource: doc._id}, {
                fields: {
                    _id: 1
                }
            });
            if (documents.count() > 0) {
                throw new Meteor.Error(500, `数据源(${doc.label})中已经有对象记录，请先删除对象`);
            }
        }
    },
}