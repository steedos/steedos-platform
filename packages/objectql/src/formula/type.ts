// 公式内容中表示userSession变量的占位符
export const FormulaUserKey = "$user";

/**
 * 记录公式字段中引用的其他对象上的字段或者引用的本对象上的公式字段
 * 用于相关引用字段值变更时，能找到哪些公式字段需要级联变更
 * is_formula指field_name是否是公式字段
 */
export type SteedosFieldFormulaQuoteTypeConfig = {
    object_name: string,
    field_name: string,
    is_formula?: boolean
}

/**
 * 公式中的{}括起来的单个变量中的执行路径
 * {}中第一个reference_from肯定是指向当前对象
 * is_formula指field_name是否是公式字段
 */
export type SteedosFieldFormulaVarPathTypeConfig = {
    field_name: string,
    reference_from: string,
    is_formula?: boolean
}

/**
 * 运行公式时，要注入的参数，经过计算每个SteedosFieldFormulaVarTypeConfig最终会转换为该结构作为参数注入公式中
 * 比如contacts对象中有公式{account.website}
 * 解析后的SteedosFieldFormulaVarTypeConfig为：
 * {
 *  key: "account.website",
 *  paths: [
 *   {field_name: "account", reference_from:"contacts"},
 *   {field_name: "website", reference_from:"accounts"},
 *  ]
 * }
 * 最终转换成的SteedosFieldFormulaParamTypeConfig为：
 * {
 *  key: "account.website",
 *  value: "www.abc.com"
 * }
 */
export type SteedosFieldFormulaParamTypeConfig = {
    key: string,
    value: any
}

/**
 * 公式中的{}括起来的单个变量
 * 比如contacts对象中有公式{account.website}
 * 则解析为：
 * {
 *  key: "account.website",
 *  paths: [
 *   {field_name: "account", reference_from:"contacts"},
 *   {field_name: "website", reference_from:"accounts"},
 *  ]
 * }
 */
export type SteedosFieldFormulaVarTypeConfig = {
    key: string,
    paths: Array<SteedosFieldFormulaVarPathTypeConfig>,
    is_user_var?: boolean
}

export type SteedosFieldFormulaTypeConfig = {
    // TODO:零代码_id为数据库中的_id值未处理
    _id: string, //低代码值为${objectConfig.name}.${fieldConfig.name}，零代码为数据库中的_id值
    object_name: string,
    field_name: string,
    formula_type: string,
    formula_blank_value: FormulaBlankValue,
    formula: string,
    quotes: Array<SteedosFieldFormulaQuoteTypeConfig>,
    vars: Array<SteedosFieldFormulaVarTypeConfig>
}

/**
 * 空白字段处理，只在公式类型返回值为number和currency类型时有效，默认为zeroes
 */
export enum FormulaBlankValue {
    zeroes = "zeroes",
    blanks = "blanks"
}