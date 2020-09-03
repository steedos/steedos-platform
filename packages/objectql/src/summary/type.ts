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

export enum SteedosSummaryTypeValue {
    COUNT = "count",
    SUM = "sum",
    MIN = "min",
    MAX = "max"
}