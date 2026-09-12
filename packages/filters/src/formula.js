// "{userId}"或"{user.name}"格式的占位符，针对 context 对象求值。
let checkFormula = (formula) => {
    return typeof formula === "string" && /\{\w+(\.\w+)?\}/.test(formula);
};

// 安全的路径取值："user.name" -> context["user"]["name"]，纯属性读取，绝不执行任何代码。
// 修复(A1)：原实现把占位符替换后整体 eval，导致过滤条件值中可注入任意 JS 代码
// (例如 filters=[["name","=","{userId}+require('child_process').execSync('id')"]] 造成已认证 RCE)。
// 现改为占位符纯路径取值 + 字符串替换，不再有任何动态代码执行。
let getByPath = (context, path) => {
    if (context == null || typeof path !== "string") {
        return undefined;
    }
    let parts = path.split(".");
    let cur = context;
    for (let i = 0; i < parts.length; i++) {
        if (cur == null) {
            return undefined;
        }
        cur = cur[parts[i].trim()];
    }
    return cur;
};

let evaluateFormula = (formula, context) => {
    if (!checkFormula(formula)) {
        return formula;
    }
    // 整个字符串恰好是单个占位符时，返回原始值(保留类型，如数组/数字/日期)。
    let full = formula.match(/^\s*\{([^{}]*)\}\s*$/);
    if (full) {
        return getByPath(context, full[1].trim());
    }
    // 否则把每个占位符替换为其字符串化的值(模板场景)，不做任何求值。
    return formula.replace(/\{([^{}]*)\}/g, function (m, path) {
        let value = getByPath(context, path.trim());
        return value == null ? "" : String(value);
    });
};

const _evaluateFormula = evaluateFormula;
export { _evaluateFormula as evaluateFormula };
