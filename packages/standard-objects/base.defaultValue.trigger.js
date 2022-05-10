const defaultValueTriggers = require('./defaultValueTriggers');

module.exports = {
    listenTo: 'base',
    beforeInsert: async function(){
        return await defaultValueTriggers.beforeInsert.apply(this, arguments)
    }
}