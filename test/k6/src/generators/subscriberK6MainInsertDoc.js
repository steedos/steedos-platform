/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2024-03-27 15:42:20
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-03-28 11:36:11
 * @Description: 
 */

import * as faker from 'faker/locale/zh_CN'; 

export const generateSubscriberK6MainInsertDoc = () => ({
    title: faker.name.jobTitle(),
    company: faker.company.companyName(),
    email: faker.internet.email(),
    country: faker.address.country(),
    name: `K6_TEST - ${faker.name.firstName()} ${faker.name.lastName()}`,
    text: faker.commerce.product(),
    textarea: faker.lorem.paragraphs(),
    html: faker.lorem.paragraphs(),
    code: faker.lorem.paragraphs(),
    markdown: faker.lorem.paragraphs(),
    number: faker.datatype.float(),
    currency: faker.datatype.float(),
    percent: faker.datatype.float(),
    password: faker.random.words(8),
    url: faker.internet.url(),
    lookup: faker.datatype.uuid(),
    select: '值1',
    color: faker.commerce.color(),
    checkout: faker.datatype.boolean(),
    toggle: faker.datatype.boolean(),
    date: faker.datatype.datetime(),
    dateTime: faker.datatype.datetime(),
    time: '1970-01-01:09:00'
});

export const generateName = ()=>{
    return `K6_TEST - ${faker.name.firstName()} ${faker.name.lastName()}`
}