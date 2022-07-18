/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-07-18 13:38:31
 * @Description: 
 */
const ROOT_URL = process.env.NEXT_PUBLIC_STEEDOS_ROOT_URL

const STEEDOS_AUTH = {};

export const setSteedosAuth = (space, token) => {
    STEEDOS_AUTH.space = space;
    STEEDOS_AUTH.token = token;
}

export async function fetchAPI(api, options = { credentials: 'include' }) {
    const headers = { 'Content-Type': 'application/json' }
    const AUTHORIZATION = getAuthorization()
    if (AUTHORIZATION) {
        headers[
            'Authorization'
        ] = AUTHORIZATION
    } else {
        throw new Error(401)
    }

    options.headers = Object.assign({}, headers, options.headers);

    const res = await fetch(`${ROOT_URL}${api}`, options)
    
    if(res.status === 401){
        throw new Error(401)
    }

    const json = await res.json()
    if (json.errors) {
        console.error(json.errors)
        throw new Error('Failed to fetch API')
    }
    return json
}

export function getFileSrc(fileId){
    return `${ROOT_URL}/api/files/files/${fileId}`
}

export function getImageSrc(fileId){
    return `${ROOT_URL}/api/files/images/${fileId}`
}


export function getTenantId(){
    try {
        let spaceId = localStorage.getItem('steedos:spaceId');

        if (window.location.search && !spaceId) {
            var searchParams = new URLSearchParams(window.location.search);
            spaceId = searchParams.get('X-Space-Id');
        }
        if (!spaceId) {
            return null;
        }
        return spaceId;
    } catch (error) {
        console.error(error)
    }
}

export function getAuthToken(){
    try {
        let token = STEEDOS_AUTH.token;
        if (!token) {
            return null;
        }
        return token;
    } catch (error) {
        console.error(error)
    }
}

export function getAuthorization(){
    try {
        let spaceId = STEEDOS_AUTH.space;
        let token = STEEDOS_AUTH.token;
        
        if (!spaceId || !token) {
            return null;
        }
        return `Bearer ${spaceId},${token}`;
    } catch (error) {
        console.error(error)
    }
}

export function absoluteUrl(url){
    return `${ROOT_URL}${url}`
}