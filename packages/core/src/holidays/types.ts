/**
 * HH:MM这种格式的字符串解析为时间值后的格式
 */
export type StringTimeValue = {
    hours: number;//小时部分值
    minutes: number;//分钟部分值
    valueToHours: number;//小时和分钟相加得到的数值，按小时为单位，用于计算多个字符串代表的时间差值
    valueToMinutes: number;//小时和分钟相加得到的数值，按分钟为单位，用于计算多个字符串代表的时间差值
}

/**
 * 把09:00到18:00这种格式的字符串解析为时间值后的格式
 */
export type BusinessHoursPerDay = {
    computedHours: number;//每天工作时间长度，小时为单位，去除了午休时间
    computedMinutes: number;//每天工作时间长度，分钟为单位
    computedLunchHours: number;//每天午休时间长度，小时为单位
    computedLunchMinutes: number;//每天午休时间长度，分钟为单位
    startValue: StringTimeValue;//开始时间返回的getStringTimeValue函数得到的对应解析值
    endValue: StringTimeValue;//结束时间返回的getStringTimeValue函数得到的对应解析值
    lunchStartValue: StringTimeValue;//午休开始时间返回的getStringTimeValue函数得到的对应解析值
    lunchEndValue: StringTimeValue;//午休结束时间返回的getStringTimeValue函数得到的对应解析值
}

export type Holiday = {
    name: string,
    type: string,//public,adjusted_working_day,adjusted_holiday
    date: Date,
    [propName: string]: any
}

export type BusinessHours = {
    name: string,
    start: string,//HH:MM，每天上班时间
    end: string,//HH:MM，每天下班时间
    lunch_start: string,//HH:MM，每天午休开始时间
    lunch_end: string,//HH:MM，每天午休结束时间
    working_days: Array<string>
    computedPerDay?: BusinessHoursPerDay //优化性能，计算过的可以缓存下来就不用重复计算了,
    [propName: string]: any
}

export type BusinessHoursValue = {
    computedHours: number;//计算得到的工作时间长度，小时为单位
    computedMinutes: number;//计算得到的工作时间长度，分钟为单位
}

export type NextBusinessDate = {
    start: Date;//计算得到的下一个工作日的开始时间
    end: Date;//计算得到的下一个工作日的结束时间
}