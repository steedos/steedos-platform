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

const validateStartEnd = (start, end, lunch_start, lunch_end)=>{
    if(!start || !end || !lunch_start || !lunch_end){
        return;
    }
    // 验证start, end为HH:MM格式，结束时间必须晚于开始时间，午休时间必须在开始结束时间范围内
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

    lunch_start = lunch_start.trim();
    lunch_end = lunch_end.trim();
    const timeValueLunchStart = getTimeValue(lunch_start)
    if(!timeValueLunchStart){
        throw new Error("business_hours_error_lunch_start_format");
    }
    const timeValueLunchEnd = getTimeValue(lunch_end)
    if(!timeValueLunchEnd){
        throw new Error("business_hours_error_lunch_end_format");
    }
    if(timeValueLunchStart.value >= parseInt(timeValueLunchEnd.value)){
        throw new Error("business_hours_error_lunch_start_lt_lunch_end");
    }

    if(timeValueStart.value >= parseInt(timeValueLunchStart.value) || timeValueEnd.value <= parseInt(timeValueLunchEnd.value)){
        throw new Error("business_hours_error_lunch_start_end_overflow");
    }
}

module.exports = {

    listenTo: 'business_hours',

    beforeInsert: async function () {
        var doc = this.doc;
        validateStartEnd(doc.start, doc.end, doc.lunch_start, doc.lunch_end);
        if (doc.is_default) {
            const repeats = await objectql.getObject("business_hours").find({
                filters: [["space", "=", this.spaceId], ["is_default", "=", true]],
                fields: ["_id"]
            });
            if(repeats && repeats.length){
                throw new Error("business_hours_error_is_default_repeated");
            }
        }
        let curUser = await this.getObject('users').findOne(this.userId, {fields:["utcOffset"]});
        this.doc.utc_offset = curUser.utcOffset;
    },

    beforeUpdate: async function () {
        // 因为afterUpdate中没有this.doc._id，所以把this.id集成过去
        const doc = Object.assign({}, this.doc, {_id: this.id});
        validateStartEnd(doc.start, doc.end, doc.lunch_start, doc.lunch_end);
        if (doc.is_default) {
            const repeats = await objectql.getObject("business_hours").find({
                filters: [["space", "=", this.spaceId], ["is_default", "=", true], ["_id", "!=", doc._id]],
                fields: ["_id"]
            });
            if(repeats && repeats.length){
                throw new Error("business_hours_error_is_default_repeated");
            }
        }
        let curUser = await this.getObject('users').findOne(this.userId, {fields:["utcOffset"]});
        this.doc.utc_offset = curUser.utcOffset;
    }
}