const objectql = require('@steedos/objectql');

module.exports = {
    listenTo: 'widgets',

    afterInsert: async function(){
        if(this.doc.type === 'charts'){
            if(this.doc.visualization){
                const chart = await objectql.getObject('charts').findOne(this.doc.visualization)
                const query = await objectql.getObject('queries').findOne(chart.query)
                if(!query.options){
                    query.options = {}
                }
                this.doc.visualization = {
                    _id: chart._id,
                    description: chart.description,
                    query: query,
                    type: chart.type,
                    options: chart.options,
                    name: chart.name,
                }
            }
        }
    },

    afterUpdate: async function(){
        if(this.doc.type === 'charts'){
            if(this.doc.visualization){
                const chart = await objectql.getObject('charts').findOne(this.doc.visualization)
                const query = await objectql.getObject('queries').findOne(chart.query)
                if(!query.options){
                    query.options = {}
                }
                this.doc.visualization = {
                    _id: chart._id,
                    description: chart.description,
                    query: query,
                    type: chart.type,
                    options: chart.options,
                    name: chart.name,
                }
            }
        }
    },

}