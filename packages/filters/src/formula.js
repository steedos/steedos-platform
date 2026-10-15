// "{userId}"或"{user.name}"格式，整个值必须是一个公式，不支持表达式
// 兼容原eval实现下也能取值的"{{userId}}"、"{{user.name}}"写法
const FORMULA_REG = /^(?:\{(\w+)(?:\.(\w+))?\}|\{\{(\w+)(?:\.(\w+))?\}\})$/;
// 原eval实现判断是否为公式的规则，含有"{xxx}"但不是上面格式的值以前会被当作JS表达式执行
const LEGACY_FORMULA_REG = /\{\w+(\.\w+)?\}/;
const FORBIDDEN_KEYS = ["__proto__", "prototype", "constructor"];

let checkFormula = (formula) => {
    // 与原eval实现保持一致：忽略首尾空白
    return typeof formula === "string" && FORMULA_REG.test(formula.trim());
};

// "{userId}"解析为["userId"],"{user.name}"解析为["user", "name"]
let prepareFormula = (formula) => {
    const match = FORMULA_REG.exec(formula.trim());
    const key = match[1] || match[3];
    const subKey = match[2] || match[4];
    return subKey ? [key, subKey] : [key];
};

// 按路径从context中取值，不使用eval，避免执行任意代码
let evaluateFormula = (formula, context) => {
    if (checkFormula(formula)) {
        const keys = prepareFormula(formula);
        let value = context;
        for (const key of keys) {
            if (FORBIDDEN_KEYS.indexOf(key) > -1) {
                return undefined;
            }
            // 与原eval实现保持一致：中间值为空时抛出异常
            value = value[key];
        }
        return value;
    }
    else if (typeof formula === "string" && LEGACY_FORMULA_REG.test(formula)) {
        // 出于安全考虑不再执行JS表达式，与原实现中表达式无法解析时一样抛出异常，由调用方按原有逻辑处理
        throw new Error(`Unsupported filter formula: ${formula}`);
    }
    else{
        return formula;
    }
};

const _evaluateFormula = evaluateFormula;
export { _evaluateFormula as evaluateFormula };
