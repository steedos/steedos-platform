const ROOT_URL = process.env.NEXT_PUBLIC_STEEDOS_ROOT_URL

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


export function getAuthorization(){
    try {
        let spaceId = localStorage.getItem('steedos:spaceId');
        let token = localStorage.getItem('steedos:token');

        if (window.location.search && !spaceId && !token) {
            var searchParams = new URLSearchParams(window.location.search);
            spaceId = searchParams.get('X-Space-Id');
            token = searchParams.get('X-Auth-Token');
        }
        if (!spaceId || !token) {
            return null;
        }
        return `Bearer ${spaceId},${token}`;
    } catch (error) {
        console.error(error)
    }
}