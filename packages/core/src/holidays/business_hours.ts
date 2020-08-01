export const getStringTimeValue = (str: string, digitsForHours: number = 2)=>{
    str = str.trim();
    if(!/^\d{1,2}:\d{1,2}$/.test(str)){
        throw new Error("getStringTimeValue:Time format error, please enter HH:MM this format of 24 hours time character.");
    }
    const splits = str.split(":");
    const h = parseInt(splits[0]);
    const m = parseInt(splits[1]);
    if(h > 24 || m > 60){
        throw new Error("getStringTimeValue:Time format error, please enter HH:MM this format of 24 hours time character.");
    }
    else if(h === 24 && m > 0){
        throw new Error("getStringTimeValue:Time format error, please enter HH:MM this format of 24 hours time character.");
    }

    let valueToHours: number, valueToMinutes:number;
    valueToMinutes = h * 60 + m;
    valueToHours = Number((valueToMinutes / 60).toFixed(digitsForHours));
    return { hours: h, minutes: m, valueToHours, valueToMinutes};
}


export const computeBusinessHours = (start: Date, end: Date) => {
    
}

export const computeBusinessHoursPerDay = (start:string, end: string, digitsForHours: number = 2) => {
    let startValue = getStringTimeValue(start, digitsForHours);
    let endValue = getStringTimeValue(end, digitsForHours);
    if(startValue && endValue){
        let result: number = endValue.valueToHours - startValue.valueToHours;
        result = Number(result.toFixed(digitsForHours));
        if(result <= 0){
            throw new Error("computeBusinessHoursPerDay:The end time value must be later than the start time.");
        }
        else{
            return {
                computedValue: result,
                startValue,
                endValue,
            };
        }
    }
    else{
        throw new Error("computeBusinessHoursPerDay:start or end is not valid.");
    }
}