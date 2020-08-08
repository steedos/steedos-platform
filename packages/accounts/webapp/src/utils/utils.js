import store from '../stores/redux_store';
import {getCurrentLocale, getTranslations} from '../selectors/i18n';

export function localizeMessage(id, defaultMessage) {
    const state = store.getState();

    const locale = getCurrentLocale(state);
    const translations = getTranslations(state, locale);

    if (!translations || !(id in translations)) {
        return defaultMessage || id;
    }

    return translations[id];
}

export const getCookie = (name) => {
    let pattern = RegExp(name + "=.[^;]*")
    let matched = document.cookie.match(pattern)
    if(matched){
        let cookie = matched[0].split('=')
        return cookie[1]
    }
    return ''
}

// export const setLocationSearch = (location)=>{
//     let value = '';
//     if(location){
//         if(location.search){
//             value = location.search
//         }else if(location.hash && location.hash.indexOf("?") > -1){
//             value = location.hash.substring(location.hash.indexOf("?"))
//         }
//     }
//     if(!window._AccountsLocationSearch && value){
//         window._AccountsLocationSearch = value
//     }
// };

// export const getLocationSearch = ()=>{
//     return window._AccountsLocationSearch || ""
// }

export const setHistoryLength = ()=>{
    window.HistoryLength = (window.HistoryLength || 0) + 1;
}

export const canBack = ()=>{
    return window.HistoryLength > 0;
}

export const getRootUrlPathPrefix = (rootUrl) => {
    if (rootUrl) {
        var parsedUrl = require('url').parse(rootUrl);
        // Sometimes users try to pass, eg, ROOT_URL=mydomain.com.
        if (!parsedUrl.host || ['http:', 'https:'].indexOf(parsedUrl.protocol) === -1) {
            throw Error("$ROOT_URL, if specified, must be an URL");
        }
        var pathPrefix = parsedUrl.pathname;
        if (pathPrefix.slice(-1) === '/') {
            // remove trailing slash (or turn "/" into "")
            pathPrefix = pathPrefix.slice(0, -1);
        }
        return pathPrefix;
    } else {
        return "";
    }
}