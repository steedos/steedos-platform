// "{userId}"或"{user.name}"格式
let checkFormula = (formula) => {
    return typeof formula === "string" && /\{\w+(\.\w+)?\}/.test(formula);
};

// "{userId}"转换为"this['userId']","{user.name}"转换为"this['user'].['name']"
let prepareFormula = (formula, prefix = "this") => {
    var reg, rev;
    reg = /(\{[^{}]*\})/g;
    rev = formula.replace(reg, function (m, $1) {
        return prefix + $1.replace(/\{\s*/, "[\"").replace(/\s*\}/, "\"]").replace(/\s*\.\s*/g, "\"][\"");
    });
    return rev;
};

let evaluateFormula = (formula, context) => {
    if (checkFormula(formula)) {
        formula = prepareFormula(formula);
        return function () {
            return eval(formula);
        }.call(context);
    }
    else{
        return formula;
    }
};

const _evaluateFormula = evaluateFormula;
export { _evaluateFormula as evaluateFormula };