import { exportObjectI18n } from './export_object_i18n'
import { locales } from './locales'

export const initExportObjectI18nTemplateRouter = function({ app }){
    console.log('initExportObjectI18nTemplateRouter.....');
    app.use("/locales/export/:lng/:objectName", exportObjectI18n);
}

export const initLocalesRouter = function({ app }){
    console.log('initLocalesRouter.....');
    app.use("/locales/:lng/:ns", locales);
}