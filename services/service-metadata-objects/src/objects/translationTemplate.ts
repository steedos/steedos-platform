/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-06-17 09:57:02
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-06-18 09:48:38
 * @Description: 提取对象默认国际化模板
 */

import { getObjectMetadataTranslationTemplate } from '@steedos/i18n';

const LNG = 'zh-CN';

export const generateObjectTranslationTemplate = async (broker, objectConfig)=>{
    const template = getObjectMetadataTranslationTemplate(LNG, objectConfig.name, objectConfig, true);
    const data = [{
        lng: LNG,
        objectApiName: objectConfig.name,
        data: template,
    }];
    await broker.call('translations.addObjectTranslationTemplates', {
        data
    })
}