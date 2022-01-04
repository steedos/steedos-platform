const objectql = require('@steedos/objectql');
const metadata = require('@steedos/metadata-api');
const metadataCore = require('@steedos/metadata-core');
const auth = require('@steedos/auth');
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
            parent: componentMember.component_parent_object_id,
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

async function getMemberCollectionName(member){
    let tableName = member.o
    let info = await objectql.getObject(tableName).findOne(member.ids[0], {});
    if(info && tableName == 'permission_set'){
        if(info.type == 'profile'){
            tableName = 'profiles';
        }
    }
    return tableName;
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
        const collectionName = await getMemberCollectionName(doc.member);
        doc.type = metadataCore.getMetadataName(collectionName);
    },
    afterInsert: async function(){
        if(this.doc.member.o === 'objects'){
            const userSession = await auth.getSessionByUserId(this.userId, this.spaceId);
            const components = await metadata.getPackageMemberComponents(this.doc._id, userSession);
            for (const metadataName in components) {
                if (components.hasOwnProperty(metadataName)) {
                    const members = components[metadataName];
                    for (const member of members) {
                        await saveRelatedMember(this.doc._id, member, this.doc.package, this.userId, this.spaceId);
                    }
                }
            }
        }
    },
    beforeUpdate: async function () {
        let doc = this.doc;
        doc.parent = await getParent(doc.member);
        doc.type = doc.member.o;
    },
    afterDelete: async function(){
        const memberId = this.id;
        if(memberId){
            const relatedMembers = await objectql.getObject('package_type_members').find({filters:['_relatedFrom', '=', memberId]});
            for (const member of relatedMembers) {
                await objectql.getObject('package_type_members').directDelete(member._id);
            }
            
        }
    }
}