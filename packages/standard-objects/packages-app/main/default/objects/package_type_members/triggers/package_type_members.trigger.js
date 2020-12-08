const objectql = require('@steedos/objectql');
//TODO 待优化
async function getParent(member){
    let memberId = member.ids[0];
    switch (member.o) {
        case 'objects':
            return ''
        case 'object_fields':
            return (await objectql.getObject("object_fields").findOne(memberId)).object
        default:
            return (await objectql.getObject(member.o).findOne(memberId)).object_name
    }
}

module.exports = {
    beforeInsert: async function () {
        let doc = this.doc;
        doc.parent = await getParent(doc.member);
        doc.type = doc.member.o;
    },
    beforeUpdate: async function () {
        let doc = this.doc;
        doc.parent = await getParent(doc.member);
        doc.type = doc.member.o;
    }
}