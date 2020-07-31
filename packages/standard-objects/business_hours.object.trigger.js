const objectql = require("@steedos/objectql");

module.exports = {

    listenTo: 'business_hours',

    beforeInsert: async function () {
        var doc = this.doc;
        if (doc.is_default) {
            const repeats = await objectql.getObject("business_hours").find({
                filters: [["space", "=", doc.space], ["is_default", "=", true]],
                fields: ["_id"]
            });
            if(repeats && repeats.length){
                throw new Error("business_hours_error_is_default_repeated");
            }
        }
    },

    beforeUpdate: async function () {
        // 因为afterUpdate中没有this.doc._id，所以把this.id集成过去
        const doc = Object.assign({}, this.doc, {_id: this.id});
        if (doc.is_default) {
            const repeats = await objectql.getObject("business_hours").find({
                filters: [["space", "=", doc.space], ["is_default", "=", true], ["_id", "!=", doc._id]],
                fields: ["_id"]
            });
            if(repeats && repeats.length){
                throw new Error("business_hours_error_is_default_repeated");
            }
        }
    }
}