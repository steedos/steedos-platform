import store from '../stores/redux_store';
import {getCurrentLocale, getTranslations} from '../selectors/i18n';

export const getCookie = (name) => {
    let pattern = RegExp(name + "=.[^;]*")
    let matched = document.cookie.match(pattern)
    if(matched){
        let cookie = matched[0].split('=')
        return cookie[1]
    }
    return ''
}

export const getBrowserLng = function () {
  var l, lng;
  var navigator = window.navigator;
  l = navigator.userLanguage || navigator.language || 'en';
  if (l.indexOf("zh") >= 0) {
    lng = "zh-CN";
  } else {
    lng = "en";
  }
  return lng;
};

export const getBrowserLocale = function(){
  var l, locale;
    var navigator = window.navigator;
    l = navigator.userLanguage || navigator.language || 'en';
    if (l.indexOf("zh") >= 0) {
      locale = "zh-cn";
    } else {
      locale = "en-us";
    }
    return locale;
}

export function localizeMessage(id, defaultMessage) {
    const state = store.getState();

    const locale = getCurrentLocale(state);
    const translations = getTranslations(state, locale);

    if (!translations || !(id in translations)) {
        return defaultMessage || id;
    }

    return translations[id];
}

export function isEmptyObject(object) {
    if (!object) {
        return true;
    }

    if (Object.keys(object).length === 0) {
        return true;
    }

    return false;
}

export function listToMap(recordsList) {
    const recordsMap = {};
    for (let i = 0; i < recordsList.length; i++) {
        recordsMap[recordsList[i]._id] = recordsList[i];
    }
    return recordsMap;
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


export const fixRootUrl = (rootUrl) => {

    if (process.env.NODE_ENV == 'development')
        return rootUrl;

    if (rootUrl) {
        var parsedUrl = new URL(rootUrl);
        
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