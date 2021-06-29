import { getObject } from '@steedos/objectql';
import { makePackageManifest, PackageRecord, getFullName, getMetadataName } from '@steedos/metadata-core'
import { SteedosMetadataTypeInfoKeys as TypeInfoKeys, hasChild, getChildMetadataNames, getCollectionNameByMetadata } from '@steedos/metadata-core';
import {getSteedosDeveloperServer, getAuthHeader, throwError} from './auth'
import { getSteedosPackageData } from '../../util/steedos_package_data';
const fetch = require('node-fetch');
const FormData = require('form-data');
const _ = require('underscore');

declare var cfs;

const getMemberInfo = async function(member){
    let info = await getObject(member.o).findOne(member.ids[0], {});
    if(member.o === 'permission_objects'){
        let ps = await getObject("permission_set").findOne(info.permission_set_id, {});
        if(ps){
            info.permission_set_id = ps.name; 
        }
    }
    return info;
}

export async function getPackageInfo(packageId){
    return await getObject('package').findOne(packageId, {});
}

async function getMemberPackageData(packageTypeMember){
    let memberInfo = await getMemberInfo(packageTypeMember.member);
    let metaDataType = packageTypeMember.type;
    let tableName = packageTypeMember.member.o
    if(tableName === 'permission_set'){
        if(memberInfo.type === 'profile'){
            tableName = 'profiles';
        }
    }
    let record: PackageRecord = {
        tableName: tableName, 
        memberName: getFullName(metaDataType, memberInfo), 
        parentTableName: '', 
        parentMemberName: packageTypeMember.parent
    };
    //TODO：待优化，支持对象权限等，对象权限的parnet应该为permissionsets
    if(packageTypeMember.parent){
        record.parentTableName = 'objects'
    }
    return record;
}

export async function getPackageMemberComponents(packageTypeMemberId, userSession){
    const packageManifest = await getPackageManifestByMember(packageTypeMemberId);
    const steedosPackageData = await getSteedosPackageData(packageManifest, userSession);
    return getPackageComponents(steedosPackageData);
}

export async function getPackageManifestByMember(packageTypeMemberId){
    const packageTypeMembers = await getObject('package_type_members').find({filters: ['_id', '=', packageTypeMemberId]});
    const records: Array<PackageRecord> = [];
    for (const packageTypeMember of packageTypeMembers) {
        let record: PackageRecord = await getMemberPackageData(packageTypeMember);
        records.push(record)
    }
    return makePackageManifest(records);
}

export async function getPackageManifest(packageId){
    const packageRecord = await getPackageInfo(packageId);
    if(!packageRecord){
        throw new Error('无效的package id');
    }
    const packageTypeMembers = await getObject('package_type_members').find({filters: ['package', '=', packageId]});
    const records: Array<PackageRecord> = [];
    for (const packageTypeMember of packageTypeMembers) {
        let record: PackageRecord = await getMemberPackageData(packageTypeMember);
        records.push(record)
    }
    return makePackageManifest(records);
}

export async function uploadInfo(package_info, package_version_info, userSession){
    const steedosDeveloperServer = getSteedosDeveloperServer();
    const headers = Object.assign({}, {'Content-Type': 'application/json'}, await getAuthHeader(userSession.spaceId));
    const response = await fetch(`${steedosDeveloperServer}/api/store/package/upload`, {
        method: 'POST', headers: headers, body: JSON.stringify({
            package_info: package_info,
            package_version_info: package_version_info
        })
    });
    if(response.ok){
        return await response.json();
    }else{
        return throwError(response.status);
    }
}

export async function uploadFile(fileName, file, options){
    const form = new FormData();
    form.append('Content-Type', cfs.getContentType(fileName));
    form.append('file', file, {filename: fileName});
    form.append('record_id', options.record_id);
    form.append('object_name', options.object_name);
    form.append('space', options.spaceId);
    form.append('owner', options.owner);
    form.append('owner_name', options.owner_name);
    if(options.parent){
        form.append('parent', options.parent);
    }
    const steedosDeveloperServer = getSteedosDeveloperServer();
    const response = await fetch(`${steedosDeveloperServer}/s3/`, {method: 'POST', body: form});
    return await response.json();
}

export type packageMemberType = {
    component_name: string,
    component_id: string,
    component_parent_object?: string,
    component_type: string,
    component_tablename: string,
}

function getMemberLabel(member){
    return member.label ? member.label : member.name;
}

export function getPackageComponents(steedosPackage){
    const data = {};
    function setData(metadataName, members, parentName?, parentLabel?, assistRecords?){
        if(assistRecords){
            console.log('TODO assistRecords', assistRecords);
        }
        if(!_.has(data, metadataName)){
            data[metadataName] = [];
        }
        _.each(members, function(member, k){
            let componentName = getMemberLabel(member);
            let componentDBId = member._id;
            data[metadataName].push({component_id: componentDBId, component_name: componentName, component_parent_object_id: parentName, component_parent_object: parentLabel, component_type: metadataName, component_tablename: getCollectionNameByMetadata(metadataName)}) //TODO 处理parent ，应该直接取显示名称
        })
    }
    for(const metadataName in steedosPackage){
        var metatdataRecords = steedosPackage[metadataName];
        if(hasChild(metadataName)){
            for(const metatdataRecordName in metatdataRecords){ // accounts,agreement
                var metatdataRecord = metatdataRecords[metatdataRecordName];
                let metatdataRecordLabel = getMemberLabel(metatdataRecord);
                const childMetadataNames = getChildMetadataNames(metadataName);
                for(const childMetadataName of childMetadataNames){
                    var childMetadataRecords = metatdataRecord[childMetadataName];
                    if(!_.isEmpty(childMetadataRecords)){
                        if(childMetadataName == TypeInfoKeys.Permission){
                            var assistRecords = steedosPackage[TypeInfoKeys.Permissionset]
                            setData(childMetadataName, childMetadataRecords, metatdataRecordName, metatdataRecordLabel, assistRecords);
                        }else{
                            setData(childMetadataName, childMetadataRecords, metatdataRecordName, metatdataRecordLabel);
                        }
                    }
                    delete metatdataRecord[childMetadataName];
                }
            }
        }
        setData(metadataName, metatdataRecords)
    }
    return data;
}

export function groupPackageComponents(steedosPackage){
    const packageMembers = getPackageComponents(steedosPackage);
    let fields: Array<packageMemberType> = [];
    let objects: Array<packageMemberType> = [];
    let resources: Array<packageMemberType> = [];
    _.each(packageMembers, function(members, metadataName){
        switch (metadataName) {
            case TypeInfoKeys.Field:
                fields = fields.concat(members);
                break;
            case TypeInfoKeys.Object:
                objects = objects.concat(members);
                break;
            default:
                resources = resources.concat(members);
                break;
        }
    });
    return {
        fields, objects, resources
    }
}

export async function savePackageVersionInfo(packageId, passwordProtected, packageVersionInfo, packageComponents, userSession){
    const {fields, objects, resources} = packageComponents;
    return await getObject("package_version").insert({
        created_by: userSession.userId,
        description: packageVersionInfo.description,
        name: packageVersionInfo.name,
        owner: userSession.userId,
        status: 'uploaded',
        password_protected: passwordProtected,
        version: packageVersionInfo.version,
        package: packageId,
        installation_id: packageVersionInfo._id,
        space: userSession.spaceId,
        resources: resources,
        objects: objects,
        fields: fields,
    });
}