const _ = require('underscore');
const objectql = require('@steedos/objectql');
const auth = require("@steedos/auth");


const getSourcePermissionSets = async function(type){
    switch (type) {
        case 'permission_set':
            return await objectql.getSourcePermissionsets();
        case 'profile':
            return await objectql.getSourceProfiles();
        default:
            return (await objectql.getSourceProfiles()).concat((await objectql.getSourcePermissionsets()));
    }
    
}

module.exports = {
    beforeFind: async function () {
        delete this.query.fields;
    },

    beforeAggregate: async function () {
        delete this.query.fields;
    },

    afterFind: async function(){
        let { spaceId } = this;
        if(!spaceId){
            spaceId = process.env.STEEDOS_CLOUD_SPACE_ID;
        }
        if(!spaceId){
            const spaces = await objectql.getObject('spaces').find({});
            if(spaces.length > 0 ){
                spaceId = spaces[0]._id;
            }
        }
        let dataList = await getSourcePermissionSets();
        if (!_.isEmpty(dataList)) {
            dataList.forEach((doc) => {
                if (!_.find(this.data.values, (value) => {
                    return value.name === doc.name
                })) {
                    this.data.values.push(doc);
                }
            })
            const records = objectql.getSteedosSchema().metadataDriver.find(this.data.values, this.query, spaceId);
            if (records.length > 0) {
                this.data.values = records;
            } else {
                this.data.values.length = 0;
            }
        }

    },
    afterAggregate: async function(){
        const { spaceId } = this;
        let dataList = await getSourcePermissionSets();
        if (!_.isEmpty(dataList)) {
            dataList.forEach((doc) => {
                if (!_.find(this.data.values, (value) => {
                    return value.name === doc.name
                })) {
                    this.data.values.push(doc);
                }
            })
            const records = objectql.getSteedosSchema().metadataDriver.find(this.data.values, this.query, spaceId);
            if (records.length > 0) {
                this.data.values = records;
            } else {
                this.data.values.length = 0;
            }
        }
    },
    afterCount: async function(){
        delete this.query.fields;
        let result = await objectql.getObject(this.object_name).find(this.query, await auth.getSessionByUserId(this.userId, this.spaceId))
        this.data.values = result.length;
    },
    afterFindOne: async function(){
        if(_.isEmpty(this.data.values)){
            const all = await getSourcePermissionSets();
            const id = this.id;
            this.data.values = _.find(all, function(item){
                return item._id === id
            });
        }
    }
}