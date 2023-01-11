'use strict'

let db = require("../db");


// 判断 organizations.parent=“”或不存在，更新为null
module.exports.up = async function (next) {
    let updatedDoc = await db.updateMany("organizations", [["parent", "=", ""]], {parent: null}).catch((ex) => {
        console.error(ex);
        return null;
    });
    console.log("UPDATE organization.parent: " + updatedDoc)
}

module.exports.down = async function (next) {
    let updatedDoc = await db.updateMany("organizations", [["parent", "=", null]], {parent: ""}).catch((ex) => {
        console.error(ex);
        return null;
    });
    console.log("UPDATE organization.parent: " + updatedDoc)
}
