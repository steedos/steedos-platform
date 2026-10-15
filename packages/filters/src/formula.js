// "{userId}"或"{user.name}"格式，整个值必须是一个公式，不支持表达式
const FORMULA_REG = /^\{\s*(\w+(?:\s*\.\s*\w+)*)\s*\}$/;
const FORBIDDEN_KEYS = ["__proto__", "prototype", "constructor"];

let checkFormula = (formula) => {
    return typeof formula === "string" && FORMULA_REG.test(formula);
};

// "{userId}"解析为["userId"],"{user.name}"解析为["user", "name"]
let prepareFormula = (formula) => {
    const match = FORMULA_REG.exec(formula);
    return match[1].split(".").map((key) => key.trim());
};

// 按路径从context中取值，不使用eval，避免执行任意代码
let evaluateFormula = (formula, context) => {
    if (checkFormula(formula)) {
        const keys = prepareFormula(formula);
        let value = context;
        for (const key of keys) {
            if (value === null || value === undefined || FORBIDDEN_KEYS.indexOf(key) > -1) {
                return undefined;
            }
            value = value[key];
        }
        return value;
    }
    else{
        return formula;
    }
};

const _evaluateFormula = evaluateFormula;
export { _evaluateFormula as evaluateFormula };
