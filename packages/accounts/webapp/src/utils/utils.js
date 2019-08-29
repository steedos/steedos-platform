import store from 'stores/redux_store';
import {getCurrentLocale, getTranslations} from 'selectors/i18n';

export function localizeMessage(id, defaultMessage) {
    const state = store.getState();

    const locale = getCurrentLocale(state);
    const translations = getTranslations(state, locale);

    if (!translations || !(id in translations)) {
        return defaultMessage || id;
    }

    return translations[id];
}
