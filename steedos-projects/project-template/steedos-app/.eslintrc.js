// 主要是一些变量声明和使用的错误提示
module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es2021": true
    },
    "parserOptions": {
        "ecmaVersion": 12
    },
    "rules": {
        "no-undef": 2, // 禁用未声明的变量，除非它们在 /*global */ 注释中被提到
        "no-use-before-define": 2, // 禁止在变量定义之前使用它们
    }
};
