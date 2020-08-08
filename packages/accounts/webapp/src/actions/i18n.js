import * as I18n from '../i18n/i18n';
import { accountsRest } from '../accounts';

export function loadTranslations(locale, url) {
    // console.log('loadTranslations', locale,url);
    const translations = {};
    // No need to go to the server for EN
    if (locale === 'en') { 
        const en = I18n.getAllLanguages()[locale].translations;
        Object.assign(translations, en);
        debugger
        return {
                type: "RECEIVED_TRANSLATIONS",
                data: {
                    locale,
                    translations
                },
        }
    }
    
    return (dispatch) => {
        accountsRest.fetch(url.startsWith("/") ? url.replace("/","") : url).then((translations) => {
            dispatch({
                type:"RECEIVED_TRANSLATIONS",
                data: {
                    locale,
                    translations,
                },
            });
        }).catch((error) => {
            console.warn('Actions - loadTranslations - recreived error: ', error)
        }); // eslint-disable-line no-empty-function
    }
}