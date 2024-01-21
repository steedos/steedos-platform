
const _ = (lodash = require("lodash"));

// steedos form schema
const getSteedosFormSchema = (steedosFields) => {
    const formFieldsSchema = getSections(steedosFields);
    return {
        type: "form",
        wrapWithPanel: false,
        debug: false,
        name: "instanceForm",
        id: "instanceForm",
        body: formFieldsSchema,
        className: 'steedos-amis-form'
    };
};

const getFieldSchemaArray = (formFields) => {
    let fieldSchemaArray = [];
    fieldSchemaArray.length = 0;

    lodash.forEach(formFields, (field) => {
        if (!field.group || field.group == "null" || field.group == "-")
            field.group = "通用";
        const fieldName = field.name;
        let isObjectField = /\w+\.\w+/.test(fieldName);
        if (
            field.type == "grid" ||
            field.type == "object" ||
            field.type == "table"
        ) {
            // field.group = field.label
            field.is_wide = true;
        }

        let forceHidden = false;

        if (!isObjectField) {
            if (!field.hidden && !forceHidden) {
                fieldSchemaArray.push(
                    Object.assign({ name: fieldName }, field, {
                        permission: { allowEdit: true },
                    })
                );
            }
        }
    });
    return fieldSchemaArray;
};

const getSection = (fieldSchemaArray, sectionName, ctx = {}) => {
    const sectionFields = lodash.filter(fieldSchemaArray, { group: sectionName });
    if (
        sectionFields.length ==
        lodash.filter(sectionFields, ["hidden", true]).length
    ) {
        return;
    }

    const fieldSetBody = [];

    for (let perField of sectionFields) {
        if(perField.type === "table"){
            let tableAmis = {};
            tableAmis.fieldPrefix = perField.name + "_";
            tableAmis.autoGeneratePrimaryKeyValue = true;
            if(perField.amis){
                tableAmis = Object.assign({}, tableAmis, perField.amis);
            }
            perField = Object.assign({}, perField, { amis: tableAmis });
        }

        if(perField.type === 'formula' || perField.type === 'summary'){
            perField = Object.assign({} , perField, {static: true});
        }

        fieldSetBody.push({
            type: "steedos-field",
            id: `field:${perField.name}`,
            name: perField.name,
            field: perField,
            static: perField.static
        });
    }

    // fieldSet 已支持显隐控制
    const sectionFieldsVisibleOn = lodash.map(
        lodash.compact(lodash.map(sectionFields, "visibleOn")),
        (visibleOn) => {
            let visible = visibleOn;
            if (visible.indexOf("${") > -1) {
                visible = visible.substring(
                    visible.indexOf("{") + 1,
                    visible.indexOf("}")
                );
            }
            return visible ? "(" + visible + ")" : visible;
        }
    );

    let section = {
        type: "fieldSet",
        title: sectionName,
        collapsable: true,
        body: fieldSetBody,
    };

    if (ctx.enableTabs) {
        section = {
            title: sectionName,
            body: fieldSetBody,
        };
    }

    if (
        sectionFieldsVisibleOn.length > 0 &&
        fieldSetBody.length === sectionFieldsVisibleOn.length
    ) {
        section.visibleOn = `${sectionFieldsVisibleOn.join(" || ")}`;
    }

    const fieldGroups = ctx.fieldGroups;
    const group =
        fieldGroups &&
        fieldGroups.find(function (groupItem) {
            return groupItem.group_name == sectionName;
        });
    let groupVisibleOn = group && group.visible_on;
    if (groupVisibleOn) {
        if (groupVisibleOn.startsWith("{{")) {
            groupVisibleOn = `${groupVisibleOn
                .substring(2, groupVisibleOn.length - 2)
                .replace(/formData./g, "data.")}`;
        } else {
            groupVisibleOn = `${groupVisibleOn.replace(/formData./g, "data.")}`;
        }
        if (section.visibleOn) {
            section.visibleOn = `${section.visibleOn + " && " + groupVisibleOn}`;
        } else {
            section.visibleOn = groupVisibleOn;
        }
    }
    return section;
};

const getSections = (formFields, ctx = {}) => {
    const fieldSchemaArray = getFieldSchemaArray(formFields);
    const _sections = lodash.groupBy(fieldSchemaArray, "group");
    const sections = [];
    var sectionVisibleOns = [];
    for (const key in _sections) {
        const section = getSection(fieldSchemaArray, key, ctx);
        if (section.body.length > 0) {
            if (section.visibleOn) {
                sectionVisibleOns.push("(" + section.visibleOn + ")");
            } else {
                sectionVisibleOns.push("true");
            }
            sections.push(section);
        }
    }
    /*
    为了实现只有一个分组时隐藏该分组标题，需要分三种情况(分组如果没有visibleon属性就代表一定显示，有visibleon需要进行判断)
    1 当前分组为隐藏时，标题就设置为隐藏
    2 当前分组为显示时，其他分组只要有一个是显示，就显示该分组标题
    3 当前分组为显示时，其他分组都隐藏，就隐藏该分组标题
    */
    sections.forEach((section, index) => {
        var tempSectionVisibleOns = sectionVisibleOns.slice();
        tempSectionVisibleOns.splice(index, 1);
        section.headingClassName = {
            hidden: `!((${tempSectionVisibleOns.join(" || ") || "false"}) && ${sectionVisibleOns[index]
                })`,
        };
    });

    if (ctx.enableTabs) {
        // TODO: 以下sectionHeaderVisibleOn代码逻辑是为实现只有一个选项卡时给选项卡添加sectionHeaderVisibleOn样式类来把选项卡顶部卡头隐藏
        // 但是 amis filter过滤器有两个bug造成此功能不好实现：
        // 1.filter过滤器只支持对象数组，并不支持boolean或字符串数组，见： https://github.com/baidu/amis/issues/7078
        // 2.filter过滤器的返回结果无法进一步获取最终过滤后的数组长度，见：https://github.com/baidu/amis/issues/7077
        // let sectionHeaderVisibleOn = "false";
        // if(sectionVisibleOns.length){
        //   sectionHeaderVisibleOn = "[" + sectionVisibleOns.join(",") + "]" + "|filter:equals:true.length > 1";
        // }
        // console.log("===sectionHeaderVisibleOn===", sectionHeaderVisibleOn);
        // sectionHeaderVisibleOn = "[true]|filter:equals:true.length > 1";
        // sectionHeaderVisibleOn = "false";
        // sectionHeaderVisibleOn = "[1,1,1]|filter:equals:1.length > 1";
        return [
            {
                type: "tabs",
                tabs: sections,
                tabsMode: ctx.tabsMode,
            },
        ];
    }

    return sections;
};


module.exports = {
    getSteedosFormSchema
}