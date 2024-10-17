// 公式内容中表示userSession变量的占位符
export const FormulaUserKey = "$user";

/**
 * 记录公式字段中引用的本对象或其他对象上的字段
 * 用于相关引用字段值变更时，能找到哪些公式字段需要级联变更
 * is_formula指field_name是否是公式字段
 * is_own指field_name是否引用的是本对象自身的字段（字段属于对象本身，且所对应的公式变量只有唯一一层引用，即直接引用当前对象自身上的字段）
 */
export type SteedosFieldFormulaQuoteTypeConfig = {
    object_name: string,
    field_name: string,
    is_formula?: boolean
    is_own?: boolean
}

/**
 * 公式中的{}括起来的单个变量中的执行路径
 * {}中第一个reference_from肯定是指向当前对象
 * is_formula指field_name是否是公式字段
 */
export type SteedosFormulaVarPathTypeConfig = {
    field_name: string,
    reference_from: string,
    reference_to_field?: string,//lookup字段上配置的reference_to_field
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
export type SteedosFormulaParamTypeConfig = {
    key: string,
    path?: any,
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
export type SteedosFormulaVarTypeConfig = {
    key: string,
    paths?: Array<SteedosFormulaVarPathTypeConfig>,
    is_user_var?: boolean,
    is_user_session_var?: boolean,
    is_simple_var?: boolean //当不传入objectApiName时变量上设置该属性表示一个普通的变量，此时paths为空
}

export type SteedosFieldFormulaTypeConfig = {
    _id: string, //低代码值为${objectConfig.name}.${fieldConfig.name}，零代码为数据库中的_id值
    object_name: string,
    field_name: string,
    data_type: string,
    formula_blank_value: SteedosFormulaBlankValue,
    formula: string,
    quotes: Array<SteedosFieldFormulaQuoteTypeConfig>,
    vars: Array<SteedosFormulaVarTypeConfig>
}

/**
 * 获取对象在哪些字段公式中被引用时的返回结果
 * ownConfigs为引用关系为当前对象上的自身引用自身（即引用关系is_own为true）
 * otherConfigs为引用关系中排除ownConfigs后的其他引用关系（包括当前对象上is_own为false的引用关系）
 * allConfigs = ownConfigs + otherConfigs
 */
export type SteedosQuotedByFieldFormulasTypeConfig = {
    ownConfigs: Array<SteedosFieldFormulaTypeConfig>,
    otherConfigs: Array<SteedosFieldFormulaTypeConfig>,
    allConfigs: Array<SteedosFieldFormulaTypeConfig>
}

/**
 * 空白字段处理，只在公式类型返回值为number和currency类型时有效，默认为zeroes
 */
export enum SteedosFormulaBlankValue {
    zeroes = "zeroes",
    blanks = "blanks"
}

/**
 * 内核函数runFormula的额外参数
 */
export type SteedosFormulaOptions = {
    returnType?: string,
    blankValue?: SteedosFormulaBlankValue,
    record?: any,
    userSession?: any
}