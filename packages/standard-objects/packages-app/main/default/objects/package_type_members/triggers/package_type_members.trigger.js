const objectql = require('@steedos/objectql');
const metadata = require('@steedos/metadata-api');
const metadataCore = require('@steedos/metadata-core');
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

async function saveRelatedMember(parent, componentMember, packageId, userId, spaceId){
    const isExist = await isMemberExist(packageId, {
        o: componentMember.component_tablename,
        id: componentMember.component_id
    })
    if(!isExist){
        await objectql.getObject('package_type_members').directInsert({
            member: {
                o: componentMember.component_tablename,
                ids: [componentMember.component_id]
            },
            owner: userId,
            package: packageId,
            parent: componentMember.component_parent_object,
            type: componentMember.component_type,
            space: spaceId,
            _relatedFrom: parent
        })
    }
}

async function isMemberExist(packageId, member){
    const existRecords = await objectql.getObject('package_type_members').directFind({filters: [['package', '=', packageId],['member/o', '=', member.o],['member/ids', '=', member.id]]})
    return existRecords.length > 0;
}

module.exports = {
    beforeInsert: async function () {
        let doc = this.doc;
        const isExist = await isMemberExist(doc.package, {
            o: doc.member.o,
            id: doc.member.ids[0]
        })
        if(isExist){
            throw new Error('组件已存在');
        }
        doc.parent = await getParent(doc.member);
        doc.type = metadataCore.getMetadataName(doc.member.o);
    },
    afterInsert: async function(){
        const components = await metadata.getPackageMemberComponents(this.doc._id, this.spaceId);
        for (const metadataName in components) {
            if (components.hasOwnProperty(metadataName)) {
                const members = components[metadataName];
                for (const member of members) {
                    await saveRelatedMember(this.doc._id, member, this.doc.package, this.userId, this.spaceId);
                }
            }
        }
    },
    beforeUpdate: async function () {
        let doc = this.doc;
        doc.parent = await getParent(doc.member);
        doc.type = doc.member.o;
    }
}