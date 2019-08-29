import {Client4} from '../../client';
import * as I18n from '../../i18n/i18n';

export function loadTranslations(locale, url) {
    // return (dispatch) => {
    //     Client4.getTranslations(url).then((translations) => {
    //         dispatch({
    //             type:"RECEIVED_TRANSLATIONS",
    //             data: {
    //                 locale,
    //                 translations,
    //             },
    //         });
    //     }).catch(() => {}); // eslint-disable-line no-empty-function
    // };
    const translations = I18n.getAllLanguages()[locale].translations;
    return {
            type:"RECEIVED_TRANSLATIONS",
            data: {
                locale,
                translations,
            },
    };
}