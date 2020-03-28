export const i18next = require("i18next");

i18next.init({
    lng: 'en',
    debug: true,
    resources: {
        en: {
            translation: {
                "key": "hello world"
            }
        },
        'zh-CN': {
            translation: {
                "key": "你好"
            }
        }
    }
}, function (err: any, t: any) {
    // initialized and ready to go!
    console.log('i18next key', i18next.t('key'));
});

export const t = function(key: any, options: any){
    return i18next.t(key, options)
}

export const getFixedT = function(lng: any, ns: any){
    return i18next.getFixedT(lng, ns)
}