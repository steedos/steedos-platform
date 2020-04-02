import { exportObjectI18n } from './export_object_i18n'
import { locales } from './locales'

export const initExportObjectI18nTemplateRouter = function({ app }){
    app.use("/locales/export/:lng/:objectName", exportObjectI18n);
}

export const initLocalesRouter = function({ app }){
    app.use("/locales/:lng/:ns", locales);
}