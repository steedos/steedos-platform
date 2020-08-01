const objectql = require("@steedos/objectql");

const getTimeValue = (str)=>{
    str = str.trim();
    if(!/^\d{1,2}:\d{1,2}$/.test(str)){
        return false;
    }
    const splits = str.split(":");
    const h = parseInt(splits[0]);
    const m = parseInt(splits[1]);
    if(h > 24 || m > 60){
        return false;
    }
    else if(h === 24 && m > 0){
        return false;
    }
    let strH = splits[0];
    let strM = splits[1];
    if(strH.length < 2){
        strH = 0 + strH;
    }
    if(strM.length < 2){
        strM = 0 + strM;
    }
    let value = parseInt(`${strH}${strM}`);
    return { h, m, value};
}

const validateStartEnd = (start, end)=>{
    // 验证start, end为HH:MM格式，且结束时间必须晚于开始时间
    start = start.trim();
    end = end.trim();
    const timeValueStart = getTimeValue(start)
    if(!timeValueStart){
        throw new Error("business_hours_error_start_format");
    }
    const timeValueEnd = getTimeValue(end)
    if(!timeValueEnd){
        throw new Error("business_hours_error_end_format");
    }
    if(timeValueStart.value >= parseInt(timeValueEnd.value)){
        throw new Error("business_hours_error_start_lt_end");
    }
}

module.exports = {

    listenTo: 'business_hours',

    beforeInsert: async function () {
        var doc = this.doc;
        validateStartEnd(doc.start, doc.end);
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
        validateStartEnd(doc.start, doc.end);
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