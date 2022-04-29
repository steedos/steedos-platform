const defaultValueTriggers = require('./defaultValueTriggers');

module.exports = {
    listenTo: 'core',
    beforeInsert: defaultValueTriggers.beforeInsert
}