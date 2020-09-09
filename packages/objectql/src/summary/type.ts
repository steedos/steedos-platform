/**
 * 累计汇总字段配置结构
 * 低代码/零代码中可以配置object_name、field_name、summary_object、summary_type、summary_field属性，其他属性都是算出来的
 */
export type SteedosFieldSummaryTypeConfig = {
    // TODO:零代码_id为数据库中的_id值未处理
    _id: string, //低代码值为${objectConfig.name}.${fieldConfig.name}，零代码为数据库中的_id值
    object_name: string, //主表对象
    field_name: string, //主表上的汇总字段
    summary_object: string, //对汇总的子表对象
    summary_type: SteedosSummaryTypeValue, //要汇总的类型
    summary_field?: string, //要聚合的字段，只能是数值、金额、日期、日期时间字段类型
    summary_field_type?: string, //如果summary_field不为空，记录其字段类型，用于数据库最终保存的字段类型
    reference_to_field?: string //子表上的master_detail关联到主表对象的字段，必须能找到且只能找到一个
}

/**
 * 累计汇总字段支持的计算类型
 */
export enum SteedosSummaryTypeValue {
    COUNT = "count",
    SUM = "sum",
    MIN = "min",
    MAX = "max"
}

/**
 * 累计汇总字段支持的字段类型（特指数据库中最终保存的结果类型）
 * 注意公式也是支持的，不过最终使用的是公式字段本身的数据类型
 */
export enum SteedosSummaryFieldTypeValue {
    Number = "number",
    Currency = "currency",
    Date = "date",
    Datetime = "datetime"
}

/**
 * 各个累计汇总计算类型支持的字段类型，用于判断SteedosFieldSummaryTypeConfig中配置的summary_field所指向的字段类型是否符合规范
 */
export const SupportedSummaryFieldTypes = {
    "sum": [SteedosSummaryFieldTypeValue.Number, SteedosSummaryFieldTypeValue.Currency],
    "min": [SteedosSummaryFieldTypeValue.Number, SteedosSummaryFieldTypeValue.Currency, SteedosSummaryFieldTypeValue.Date, SteedosSummaryFieldTypeValue.Datetime],
    "max": [SteedosSummaryFieldTypeValue.Number, SteedosSummaryFieldTypeValue.Currency, SteedosSummaryFieldTypeValue.Date, SteedosSummaryFieldTypeValue.Datetime]
};

/**
 * 各个累计汇总计算类型的空值处理方式
 */
export const SteedosSummaryTypeBlankValue = {
    "count": 0,
    "sum": 0,
    "min": null,
    "max": null
};