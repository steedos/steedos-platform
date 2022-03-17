const objectql = require('@steedos/objectql');
const auth = require('@steedos/auth');
const _ = require('underscore');
async function getAll(){
    const schema = objectql.getSteedosSchema();
    const configs = await objectql.registerPage.getAll(schema.broker)
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
    const config = await objectql.registerPage.get(schema.broker, apiName)
    return config ? config.metadata : null;
}

module.exports = {
    listenTo: 'pages',

    afterFind: async function(){
        let spaceId = this.spaceId;
        this.data.values = this.data.values.concat(await getAll());

        this.data.values = objectql.getSteedosSchema().metadataDriver.find(this.data.values, this.query, spaceId);

    },
    afterAggregate: async function(){
        let spaceId = this.spaceId;
        this.data.values = this.data.values.concat(await getAll());

        this.data.values = objectql.getSteedosSchema().metadataDriver.find(this.data.values, this.query, spaceId);
    },
    afterCount: async function(){
        let result = await objectql.getObject(this.object_name).find(this.query, await auth.getSessionByUserId(this.userId, this.spaceId))
        this.data.values = result.length;
    },
    afterFindOne: async function(){
        if(_.isEmpty(this.data.values)){
            this.data.values = await getAll(this.id, this.userId);
        }
    }
}