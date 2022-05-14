"use strict";
// @ts-check
module.exports = {
    funEval: function (funStr) {
        try {
            return eval('(' + funStr + ')')
        } catch (e) {
            console.error(e, funStr);
        }
    }
}