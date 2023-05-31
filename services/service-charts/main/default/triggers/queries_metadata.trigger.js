const objectql = require('@steedos/objectql');
const register = require('@steedos/metadata-registrar')
const auth = require('@steedos/auth');
const _ = require('underscore');
const clone = require('clone');
async function getAll(){
    const schema = objectql.getSteedosSchema();
    const configs = await register.registerQuery.getAll(schema.broker)
    const dataList = _.pluck(configs, 'metadata');

    _.each(dataList, function(item){
        if(!item._id){
            item._id = `${item.name}`
        }
    })
    return dataList;
}

async function get(apiName){
    const schema =objectql.getSteedosSchema();
    const config = await register.registerQuery.get(schema.broker, apiName)
    return config ? config.metadata : null;
}

module.exports = {
    listenTo: 'queries',
    beforeFind: async function () {
        delete this.query.fields;
    },

    beforeAggregate: async function () {
        delete this.query.fields;
    },
    afterFind: async function(){
        let spaceId = this.spaceId;
        let dataList = await getAll();
        const values = clone(this.data.values);
        _.each(dataList, (item) => {
            if (!_.find(this.data.values, (value) => {
                return value._id === item._id || item.name === value.name
            })) {
                values.push(item)
            }
        })
        this.data.values = objectql.getSteedosSchema().metadataDriver.find(values, this.query, spaceId);

    },
    afterAggregate: async function(){
        let spaceId = this.spaceId;
        let dataList = await getAll();
        const values = clone(this.data.values);
        _.each(dataList, (item) => {
            if (!_.find(this.data.values, (value) => {
                return value._id === item._id || item.name === value.name
            })) {
                values.push(item)
            }
        })
        this.data.values = objectql.getSteedosSchema().metadataDriver.find(values, this.query, spaceId);

    },
    afterCount: async function(){
        try {
            this.query.fields.push('name');
        } catch (error) {

        }
        let result = await objectql.getObject(this.object_name).find(this.query, await auth.getSessionByUserId(this.userId, this.spaceId))
        this.data.values = result.length;
    },
    afterFindOne: async function(){
        if(_.isEmpty(this.data.values)){
            let id = this.id
            let data = await get(id);
            if(data){
                this.data.values = data;
            }
        }
    }
}