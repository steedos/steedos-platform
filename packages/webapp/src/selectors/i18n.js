
import * as I18n from '../i18n/i18n';

import { getSettings } from '../selectors';
import { getBrowserLng } from '../utils/utils';

export function getCurrentUserLocale(state) {
    return getBrowserLng();
}

// This is a placeholder for if we ever implement browser-locale detection
export function getCurrentLocale(state) {
    return getCurrentUserLocale(state, getSettings(state).DefaultClientLocale);
}

export function getTranslations(state, locale) {
    const localeInfo = I18n.getLanguageInfo(locale);

    let translations;
    if (localeInfo) {
        translations = state.i18n.translations[locale];
    } else {
        // Default to English if an unsupported locale is specified
        translations = state.i18n.translations.en;
    }

    return translations;
}
