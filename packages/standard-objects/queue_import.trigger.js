module.exports = {

    listenTo: 'queue_import',

    afterFindOne: async function () {
        try {
            if (this.data.values) {
                Object.assign(this.data.values, { template_url: `[下载](${__meteor_runtime_config__.ROOT_URL_PATH_PREFIX}/api/data/download/template/${this.data.values._id})` })
            }
        } catch (error) {

        }
    },
    afterFind: async function () {
        if (this.data.values) {
            for (const value of this.data.values) {
                if (value) {
                    value.template_url = `[下载](${__meteor_runtime_config__.ROOT_URL_PATH_PREFIX}/api/data/download/template/${value._id})`
                }
            }
        }
    },
    afterAggregate: async function () {
        if (this.data.values) {
            for (const value of this.data.values) {
                if (value) {
                    value.template_url = `[下载](${__meteor_runtime_config__.ROOT_URL_PATH_PREFIX}/api/data/download/template/${value._id})`
                }
            }
        }
    }
}