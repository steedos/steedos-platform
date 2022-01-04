import {getSteedosDeveloperServer, getAuthHeader, throwError} from './auth'
import { getObject } from '@steedos/objectql';
import { SteedosMetadataTypeInfoKeys } from '@steedos/metadata-core';
import * as _ from 'underscore';
const fetch = require('node-fetch');

const getLng = (userSession)=>{
    if(userSession && userSession.locale){
        switch (userSession.locale) {
            case 'en-us':
                return 'en';
            case 'zh-cn':
                return 'zh-CN';
            default:
                return 'en';
        }
    }
    return 'en';
}

export async function getInstallingInfo(versionId, password, userSession){
    const steedosDeveloperServer = getSteedosDeveloperServer();
    const headers = Object.assign({}, {'Content-Type': 'application/json'}, await getAuthHeader(userSession.spaceId));
    const response = await fetch(`${steedosDeveloperServer}/api/store/package/installing/data`, {
        method: 'POST', headers: headers, body: JSON.stringify({
            version_id: versionId,
            password: password, 
            lng: getLng(userSession)
        })
    });
    if(response.ok){
        return await response.json();
    }else{
        return throwError(response.status);
    }
}

export async function getInstallingFile(versionId, password, userSession){
    const steedosDeveloperServer = getSteedosDeveloperServer();
    const headers = Object.assign({}, {'Content-Type': 'application/json'}, await getAuthHeader(userSession.spaceId));
    const response = await fetch(`${steedosDeveloperServer}/api/store/package/installing/file`, {
        method: 'POST', headers: headers, body: JSON.stringify({
            version_id: versionId,
            password: password
        })
    });

    if(response.ok){
        const body = await response.text();
        return Buffer.from(body, 'base64');
    }else{
        return throwError(response.status);
    }
}

export const saveImportedPackage = async (packageVersionData, userSession) => {
    let objectsCount = 0;
    if(packageVersionData.objects){
        objectsCount = packageVersionData.objects.length;
    }

    let appsCount = 0;
    if(packageVersionData.resources){
        appsCount = _.filter(packageVersionData.resources, function(resource){
            return resource.component_type == SteedosMetadataTypeInfoKeys.Application
        }).length
    }

    let components = [];

    if(packageVersionData.objects){
        components = components.concat(packageVersionData.objects)
    }

    if(packageVersionData.fields){
        components = components.concat(packageVersionData.fields)
    }

    if(packageVersionData.resources){
        components = components.concat(packageVersionData.resources)
    }

    let doc = {
        apps: appsCount,
        description: packageVersionData.description,
        first_installed_version: packageVersionData.version,
        installed_by: userSession.userId,
        installed: new Date(),
        created_by: userSession.userId,
        modified_by: userSession.userId,
        name: packageVersionData.package,
        namespace: packageVersionData.namespace,
        objects: objectsCount,
        package_type: packageVersionData.type,
        publisher: packageVersionData.owner,
        version_name: packageVersionData.name,
        version: packageVersionData.version,
        components: components,
        package_name: packageVersionData.packageAPIName,
        space: userSession.spaceId,
        owner: userSession.userId
    }

    const iPackage = await getObject('imported_package').find({filters: [['package_name','=',packageVersionData.packageAPIName]]});
    if(iPackage.length > 0){
        delete doc.first_installed_version
        return await getObject('imported_package').update(iPackage[0]._id, doc);
    }else{
        return await getObject('imported_package').insert(doc);
    }
}