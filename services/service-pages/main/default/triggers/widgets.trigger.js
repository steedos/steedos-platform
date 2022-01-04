const objectql = require('@steedos/objectql');
const getCharts = async(apiName)=>{
	const charts = await objectql.getObject('charts').find({ filters: [['name', '=', apiName]] });
	if(charts.length > 0){
		return charts[0]
	}
}

const getQueries = async(apiName)=>{
	const queries = await objectql.getObject('queries').find({ filters: [['name', '=', apiName]] });
	if(queries.length > 0){
		return queries[0]
	}
}
module.exports = {
    listenTo: 'widgets',
    beforeInsert: async function(){
        if(!this.doc.name){
            this.doc.name = await objectql.getObject(this.object_name)._makeNewID()
        }
    },
    afterInsert: async function(){
        if(this.doc.type === 'charts'){
            if(this.doc.visualization){
                const chart = await getCharts(this.doc.visualization)
                const query = await getQueries(chart.query)
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
                const chart = await getCharts(this.doc.visualization)
                const query = await getQueries(chart.query)
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