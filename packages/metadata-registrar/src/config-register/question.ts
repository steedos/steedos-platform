/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-05-27 11:55:55
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-08-01 10:43:12
 * @Description: 
 */
import { LoadQuestionFile } from '@steedos/metadata-core';
import { registerQuestion } from '../metadata-register/question';
const loadQuestion = new LoadQuestionFile();

export const registerPackageQuestion = async (packagePath: string, packageServiceName: string) => {
    const metadata = loadQuestion.load(packagePath);
    const data = [];
    for (const apiName in metadata) {
        const item = metadata[apiName];
        data.push(Object.assign(item, {
            is_system: true, record_permissions: {
                allowEdit: false,
                allowDelete: false,
                allowRead: true,
            }
        }))
    }
    if (data.length > 0) {
        await registerQuestion.mregister(broker, packageServiceName, data)
    }
}