import { getUserId, getAuthToken, getSpaceId } from '../utils';
import { fetch } from "whatwg-fetch";

export async function request(url: string, opts: any = {}) {
    let options = Object.assign({ method: "GET", compress: false }, opts)
    let authToken = getAuthToken();
    let userId = getUserId();
    let authHeaders = {
        'X-Auth-Token': authToken,
        'X-User-Id': userId
    };
    let spaceId = options.spaceId || getSpaceId()
    if(spaceId){
        authHeaders['X-Space-Id'] = spaceId
    }
    options.headers = { ...options.headers, ...authHeaders};
    const response = await fetch(url, options);
    if (response.ok){
        return await response.json()
    }
    throw new Error(JSON.stringify(await response.json()));
}