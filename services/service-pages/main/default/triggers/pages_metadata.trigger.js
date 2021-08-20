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
        let filters = objectql.parserFilters(this.query.filters)
        let dataList = []
        if(filters._id && !filters._id.$ne){
            let id = filters._id
            id = id.replace(/\\/g, '');
            let data = await get(id);
            if(data){
                dataList = [data]
            }
        }else{
            dataList = await getAll();
            if(filters.name){
                dataList = _.filter(dataList, (item)=>{
                    return item.name == filters.name
                })
            }
        }

        if(dataList){
            const dbRecrodsName = _.pluck(this.data.values, 'name');
            this.data.values = this.data.values.concat(_.filter(dataList, function(data){return data._id == data.name && !_.include(dbRecrodsName, data.name) }))
        }
    },
    afterAggregate: async function(){
        let filters = objectql.parserFilters(this.query.filters)
        let dataList = []
        if(filters._id && !filters._id.$ne){
            let id = filters._id
            id = id.replace(/\\/g, '');
            let data = await get(id);
            if(data){
                dataList = [data]
            }
        }else{
            dataList = await getAll();
            if(filters.name){
                dataList = _.filter(dataList, (item)=>{
                    return item.name == filters.name
                })
            }
        }

        if(dataList){
            const dbRecrodsName = _.pluck(this.data.values, 'name');
            this.data.values = this.data.values.concat(_.filter(dataList, function(data){return data._id == data.name && !_.include(dbRecrodsName, data.name) }))
        }
    },
    afterCount: async function(){
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