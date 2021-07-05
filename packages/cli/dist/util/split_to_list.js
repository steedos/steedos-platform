"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitToList = void 0;
const _ = require("underscore");
function splitToList(input) {
    var output;
    if (!input) {
        output = [];
    }
    else if (_.contains(input, ',')) {
        output = input.split(",");
    }
    else {
        output = input.split(" ");
    }
    return output;
}
exports.splitToList = splitToList;
//# sourceMappingURL=split_to_list.js.map