import { getSteedosConfig } from '@steedos/objectql'
import { db } from '../db';
import * as _ from 'lodash';
import chalk from 'chalk';

declare var MailQueue;
declare var SMSQueue;

const config = getSteedosConfig();

export const getSettings = async ()=>{
    let tenant = {
        name: "Steedos",
        logo_url: undefined,
        background_url: undefined,
        enable_create_tenant: true,
        enable_register: true,
        enable_forget_password: true,
        enable_password_login: true,
        enable_mobile_code_login: false,
        enable_email_code_login: false,
        enable_bind_mobile: false,
        enable_bind_email: false,
      }

      if (config.tenant) {
          _.assignIn(tenant, config.tenant)
      }
      
      if (config.tenant && config.tenant._id) {
        let spaceDoc = await db.findOne("spaces", config.tenant._id, {fields: ["name", "avatar", "avatar_dark", "background", "enable_register"]})
        let steedosService = getSteedosService();
        if (steedosService) {
            _.assignIn(tenant, spaceDoc);
          if (spaceDoc.avatar_dark) {
            tenant.logo_url = steedosService + "api/files/avatars/" + spaceDoc.avatar_dark
          } else if (spaceDoc.avatar) {
            tenant.logo_url = steedosService + "api/files/avatars/" + spaceDoc.avatar
          } 
          if (spaceDoc.background) {
            tenant.background_url = steedosService + "api/files/avatars/" + spaceDoc.background
          }
        }
      }

      return {
        tenant: tenant,
        password: config.password?config.password:{},
        root_url: process.env.ROOT_URL
      }
}

export const getTenant = async (spaceId)=>{
    if (!spaceId){
        return {};
    }
    
    const spaceDoc = await db.findOne("spaces", spaceId, {fields: ["name", "avatar", "avatar_dark", "background", "enable_register"]})

    if(!spaceDoc){
      return {}
    }
    let steedosService = getSteedosService();
    if (steedosService) {
      if (spaceDoc.avatar_dark) {
        spaceDoc.logo_url = steedosService + "api/files/avatars/" + spaceDoc.avatar_dark
      } else if (spaceDoc.avatar) {
        spaceDoc.logo_url = steedosService + "api/files/avatars/" + spaceDoc.avatar
      } 
      if (spaceDoc.background) {
        spaceDoc.background_url = steedosService + "api/files/avatars/" + spaceDoc.background
      }
    }

    return spaceDoc;
}

export const spaceExists = async(spaceId)=>{
  const spaceDoc = await db.findOne("spaces", spaceId, {fields: ["name", "avatar", "avatar_dark", "background", "enable_register"]})
  if(spaceDoc){
    return true;
  }
  return false;
}

export const getMergedTenant = async (spaceId?)=>{
    const settings: any = await getSettings();
    const tenant: any = await getTenant(spaceId);
    return Object.assign({}, settings.tenant, tenant);
}

export const canRegister = async (spaceId, action)=>{
    const tenant: any = await getMergedTenant(spaceId);
    if(action === 'emailSignupAccount' && !tenant.enable_email_code_login){
      return false
    }else if(action === 'mobileSignupAccount' && !tenant.enable_mobile_code_login){
      return false
    }else if(action === 'withPassword'){
      return tenant.enable_register && tenant.enable_password_login
    }
    return tenant.enable_register;
}

export const canPasswordLogin = async ()=>{
  const tenant: any = await getMergedTenant();
  return tenant.enable_password_login;
}

function isEmpty(str){
  if(!str){
    return true;
  }

  if(str === 'undefined'){
    return true;
  }

  if(_.isString(str) && str.startsWith("${")){
    return true;
  }

  return false;
}

export const canSendEmail = ()=>{
  const config = getSteedosConfig().email || {};
  let canSend = true;
  if (!config) {
    canSend = false;
  }else if (isEmpty(config.from)) {
    canSend = false;
  }else if (isEmpty(config.url) && (isEmpty(config.host) || isEmpty(config.port) || isEmpty(config.username) || isEmpty(config.password))) {
    canSend = false;
  }
  return canSend;
}

//TODO twilio
export const canSendSMS = ()=>{
  const config = (getSteedosConfig().sms || {}).qcloud || {};
  let canSend = true;
  if (!config) {
    canSend = false;
  }else if (isEmpty(config.sdkappid) || isEmpty(config.appkey) || isEmpty(config.signname)) {
    canSend = false;
  }
  return canSend;
}

export const getRootUrlPathPrefix = (rootUrl) => {
  if (rootUrl) {
      var parsedUrl = require('url').parse(rootUrl);
      if (!parsedUrl.host || ['http:', 'https:'].indexOf(parsedUrl.protocol) === -1) {
          throw Error("$ROOT_URL, if specified, must be an URL");
      }
      var pathPrefix = parsedUrl.pathname;
      if (pathPrefix.slice(-1) === '/') {
          pathPrefix = pathPrefix.slice(0, -1);
      }
      return pathPrefix;
  } else {
      return "";
  }
}

export const getSteedosService = ()=>{
  let steedosService = getRootUrlPathPrefix(process.env.ROOT_URL);
  if (config.webservices && config.webservices.steedos) {
    if (!config.webservices.steedos.endsWith("/"))
      config.webservices.steedos += "/"
    steedosService = config.webservices.steedos;
  }
  if (!steedosService.endsWith("/"))
    steedosService += "/" ;
  return steedosService;
}

export const sendMail = async (mail: any): Promise<void> => {
  const {to, subject, html} = mail;
  const config = getSteedosConfig().email || {};
  let canSend = canSendEmail();
  //如果没有配置发送邮件服务，则打印log
  console.log(chalk.green(`MAIL: ${to}, ${subject}`))
  if(!canSend){
      console.log(chalk.red("ERROR sending mail, please set email configs in steedos-config.yml"));
      return;
  }else{
      MailQueue.send({
          to: to,
          from: config.from || "华炎魔方",
          subject: subject,
          html: html
      });
  }
};

export const sendSMS = async (sms: any): Promise<void> => {
  const {mobile, message, spaceId} = sms;
  let canSend = canSendSMS();
  console.log(chalk.green(`SMS: ${mobile}, ${message}`))
  if(!canSend){
      console.log(chalk.red("ERROR sending sms, Please set sms configs in steedos-config.yml"))
      return;
  }else{
      SMSQueue.send({
          RecNum: mobile,
          msg: message
      }, spaceId)
  }
}
