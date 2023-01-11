'use strict'

let db = require("../db");

// 空值表示以下脚本应用到所有工作区
let limited_space_ids = [];

let upBySpace = async function (spaceId) {
    // console.log(`SPACEID: ${spaceId}`);
    let companys = await db.find("company", {
        filters: [["space", "=", spaceId]],
        fields: ["_id"]
    }).catch((ex) => {
        console.error(ex);
        return [];
    });
    if (companys.length) {
        //console.log("脚本已跳过：已经有companys记录");
        return
    }

    // ["is_group", "=", null]查的是is_group未定义的情况，对应到mongo语法`is_group: null`，它包含了`is_group: { $exists: false }`的情况
    let orgs = await db.find("organizations", {
        filters: [["space", "=", spaceId], [[["is_company", "=", true], ["is_group", "=", null]], "or", ["parent", "=", null]]],
        fields: ["name", "space", "owner", "created_by", "created", "modified_by", "modified"]
    }).catch((ex) => {
        console.error(ex);
        return [];
    });

    for (let org of orgs) {
        let companyDoc = {
            _id: org._id,
            name: org.name,
            organization: org._id,
            space: org.space,
            company_id: org._id,
            created_by: org.created_by,
            created: org.created,
            modified_by: org.modified_by,
            modified: org.modified
        };
        if (org.owner) {
            companyDoc.owner = org.owner;
        }
        let insertedDoc = await db.insert("company", companyDoc).catch((ex) => {
            console.error(ex);
            return null;
        });
        console.log("INSERTED company:", insertedDoc.name);
        let orgDoc = {
            company_id: org._id
        };
        // 设置关联组织的company_id值，特别是落地版根组织可能没有company_id值，需要加上
        let updatedDoc = await db.updateOne("organizations", org._id, orgDoc).catch((ex) => {
            console.error(ex);
            return {};
        });
        console.log("UPDATED organizations:", updatedDoc.name);
    }

    if (orgs.length === 1){
        // 工作区只有一个分部时，应该自动把 space_users.company_id, company_ids, organizations.company_id 都设置为分部的ID值
        let rootOrgId = orgs[0]._id;
        console.log("ONLYONE COMPANY:", rootOrgId);
        let updatedDoc = await db.updateMany("organizations", [["space", "=", spaceId]], {
            company_id: rootOrgId
        }).catch((ex) => {
            console.error(ex);
            return {};
        });
        console.log("UPDATED organizations count:", updatedDoc.result ? updatedDoc.result.nModified : 'error');
        updatedDoc = await db.updateMany("space_users", [["space", "=", spaceId]], {
            company_id: rootOrgId,
            company_ids: [rootOrgId]
        }).catch((ex) => {
            console.error(ex);
            return {};
        });
        console.log("UPDATED space_users count:", updatedDoc.result ? updatedDoc.result.nModified : 'error');
    }

    // 因为is_group属性作废，所以需要把is_group为true及is_company为true的organizations应该更新is_company为false
    // 否则会留下原来is_group为true的组织为"分部级组织"，但其实它们不是分部级的
    // is_group值保持不变，方便执行migrate down
    let groupOrgs = await db.find("organizations", {
        filters: [["space", "=", spaceId], ["is_company", "=", true], ["is_group", "=", true]],
        fields: ["_id"]
    }).catch((ex) => {
        console.error(ex);
        return [];
    });
    console.log("CANCEL GROUP COMPANY:", groupOrgs);
    for (let org of groupOrgs) {
        let updatedDoc = await db.updateOne("organizations", org._id, {
            is_company: false
        }).catch((ex) => {
            console.error(ex);
            return {};
        });
        console.log("UPDATED organizations:", updatedDoc.name);
    }

    let rootOrgs = await db.find("organizations", {
        filters: [["space", "=", spaceId], ["parent", "=", null]],
        fields: ["_id"]
    }).catch((ex) => {
        console.error(ex);
        return [];
    });
    let rootOrgId = rootOrgs[0] ? rootOrgs[0]._id : null;

    if (rootOrgId) {
        // workflow: 出一个脚本更新所有未设置company_id值的flow的company_id值为根组织 #1944
        let updatedDoc = await db.updateMany("flows", [["space", "=", spaceId], ["company_id", "=", null]], {
            company_id: rootOrgId
        }).catch((ex) => {
            console.error(ex);
            return {};
        });
        console.log("UPDATED flows count:", updatedDoc.result ? updatedDoc.result.nModified : 'error');
    }
}

let downBySpace = async function (spaceId) {
    // console.log(`SPACEID: ${spaceId}`);
    let companys = await db.find("company", {
        filters: [["space", "=", spaceId]],
        fields: ["_id", "name"]
    }).catch((ex) => {
        console.error(ex);
        return [];
    });
    for (let item of companys) {
        await db.delete("company", item._id).catch((ex) => {
            console.error(ex);
            return false;
        });
        console.log("DELETED company:", item.name);
    }

    // 还原is_group对应的is_company为true
    let groupOrgs = await db.find("organizations", {
        filters: [["space", "=", spaceId], ["is_company", "=", false], ["is_group", "=", true]],
        fields: ["_id"]
    }).catch((ex) => {
        console.error(ex);
        return [];
    });
    console.log("CANCEL GROUP COMPANY:", groupOrgs);
    for (let org of groupOrgs) {
        let updatedDoc = await db.updateOne("organizations", org._id, {
            is_company: true
        }).catch((ex) => {
            console.error(ex);
            return {};
        });
        console.log("UPDATED organizations:", updatedDoc.name);
    }
}

// 判断 company 表为空，执行 company_id 升级
module.exports.up = async function (next) {
    if (limited_space_ids.length){
    }
    else {
        // limited_space_ids为空，则不限制工作区，查出所有工作区ID值循环
        let spaces = await db.find("spaces", {
            fields: ["_id"]
        }).catch((ex) => {
            console.error(ex);
            return [];
        });
        limited_space_ids = spaces.map((n)=>{ return n._id; });
        console.log(`SPACES count: ${limited_space_ids.length}`);
    }
    for (let spaceId of limited_space_ids) {
        await upBySpace(spaceId);
    }
}

module.exports.down = async function (next) {
    if (limited_space_ids.length) {
    }
    else {
        // limited_space_ids为空，则不限制工作区，查出所有工作区ID值循环
        let spaces = await db.find("spaces", {
            fields: ["_id"]
        }).catch((ex) => {
            console.error(ex);
            return [];
        });
        limited_space_ids = spaces.map((n) => { return n._id; });
        console.log(`SPACES count: ${limited_space_ids.length}`);
    }
    for (let spaceId of limited_space_ids) {
        await downBySpace(spaceId);
    }
}
