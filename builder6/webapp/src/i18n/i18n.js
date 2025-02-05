// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

/* eslint-disable import/order */

// import {addLocaleData} from 'react-intl';

// import enLocaleData from 'react-intl/locale-data/en';
// import zhLocaleData from 'react-intl/locale-data/zh';

import store from '../stores/redux_store';
import { getSettings } from '../selectors';

import en from './en.json';
import zhCN from './zh-CN.json';


// should match the values in model/config.go
const languages = {
    en: {
        value: 'en',
        name: 'English',
        order: 1,
        translations: en
    },
    'zh-CN': {
        value: 'zh-CN',
        name: '中文 (简体)',
        order: 13,
        translations: zhCN
    },
};

export function getAllLanguages() {
    return languages;
}

export function getLanguages() {
    const config = getSettings(store.getState());
    if (!config.AvailableLocales) {
        return getAllLanguages();
    }
    return config.AvailableLocales.split(',').reduce((result, l) => {
        if (languages[l]) {
            result[l] = languages[l];
        }
        return result;
    }, {});
}

export function getLanguageInfo(locale) {
    return getAllLanguages()[locale];
}

export function isLanguageAvailable(locale) {
    return Boolean(getLanguages()[locale]);
}

export function doAddLocaleData() {
    // addLocaleData(enLocaleData);
    // addLocaleData(zhLocaleData);
}
