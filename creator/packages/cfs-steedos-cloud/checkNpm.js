/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2021-08-13 22:02:02
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-08-24 16:29:49
 * @Description: 
 */
import {
  checkNpmVersions
} from 'meteor/tmeasday:check-npm-versions';

const fs = require('fs');
const path = require('path')

if (Meteor.settings && Meteor.settings.public && Meteor.settings.public.cfs && Meteor.settings.public.cfs.store === 'STEEDOSCLOUD') {
  checkNpmVersions({
    'aws-sdk': "^2.0.23"
  }, 'steedos:cfs-steedos-cloud');

  // // 修改s3-2006-03-01.min.json 将 SteedosApiKey添加进members用于请求时aws-sdk发送此header
  // var base = process.cwd();
  // console.log('process.cwd(): ', process.cwd());
  // if (process.env.CREATOR_NODE_ENV == 'development') {
  //   base = path.resolve('.').split('.meteor')[0];
  // }
  // console.log('base: ', base);
  // var sdkPath = path.join(base, require.resolve('aws-sdk/package.json', {
  //   paths: [base]
  // }));
  // console.log('sdkPath: ', sdkPath);
  // var sdkVersionMinJsonPath = path.join(sdkPath, '../apis/s3-2006-03-01.min.json');
  // console.log('sdkVersionMinJsonPath: ', sdkVersionMinJsonPath);
  // var minJson = JSON.parse(fs.readFileSync(sdkVersionMinJsonPath));
  // console.log(minJson);
  // var operations = minJson.operations;
  // for (const key in operations) {
  //   if (Object.hasOwnProperty.call(operations, key)) {
  //     const element = operations[key];
  //     if (element.input) {
  //       element.input.members.SteedosApiKey = { "location": "header", "locationName": "apikey" }
  //     }
  //   }
  // }

  // fs.writeFileSync(sdkVersionMinJsonPath, JSON.stringify(minJson)); 

  CLOUDAWS = require('aws-sdk');
}
