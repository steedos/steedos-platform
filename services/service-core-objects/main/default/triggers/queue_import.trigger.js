
const objectql = require('@steedos/objectql');

module.exports = {
    listenTo: 'queue_import',

    afterFind: async function () {
        if (this.data.values) {
            for (const value of this.data.values) {
                if (value) {
                    value.template_url = objectql.absoluteUrl(`/api/data/download/template/${value._id}`)
                }
            }
        }
    }
}
