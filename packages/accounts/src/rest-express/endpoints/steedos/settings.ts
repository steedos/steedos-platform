/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-03-28 09:35:34
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-04-15 15:13:49
 * @Description: 
 */
import * as express from 'express';
import * as _ from 'lodash';
import { AccountsServer } from '../../../server';
import { getSteedosConfig, getSteedosSchema } from '@steedos/objectql'
import { db } from '../../../db';
import { canSendEmail, canSendSMS, getSteedosService } from '../../../core';
const validator = require('validator');
const util = require('@steedos/utils')
const clone = require('clone');

const config = getSteedosConfig();

export const getSettings = (accountsServer: AccountsServer) => async (
    req: express.Request,
    res: express.Response
  ) => {
  let tenant: any = {
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
    enable_saas: validator.toBoolean(process.env.STEEDOS_TENANT_ENABLE_SAAS || 'false', true),
    enable_open_geetest: validator.toBoolean(process.env.STEEDOS_CAPTCHA_GEETEST_ENABLED || 'false'),
    page_login: process.env.STEEDOS_TENANT_PAGE_LOGIN,
    page_logout: process.env.STEEDOS_TENANT_PAGE_LOGOUT
  }

  if (config.tenant) {
    _.assignIn(tenant, config.tenant)
  }

  if(!tenant._id){
    tenant._id = process.env.STEEDOS_TENANT_ID
  }

  const platform = (global as any).Meteor.settings.public?.platform || {}
  

  if (tenant._id) {
    let spaceDoc = await db.findOne("spaces", tenant._id, {fields: ["name", "avatar", "avatar_dark", "background", "enable_register", "account_logo", "favicon"]})
    let steedosService = getSteedosService();
    if (steedosService && spaceDoc) {
        _.assignIn(tenant, spaceDoc);
      if (spaceDoc.account_logo) {
        tenant.logo_url = steedosService + "api/files/avatars/" + spaceDoc.account_logo
      } else if (spaceDoc.avatar_dark) {
        tenant.logo_url = steedosService + "api/files/avatars/" + spaceDoc.avatar_dark
      } else if (spaceDoc.avatar) {
        tenant.logo_url = steedosService + "api/files/avatars/" + spaceDoc.avatar
      } 
      if (spaceDoc.background) {
        tenant.background_url = steedosService + "api/files/avatars/" + spaceDoc.background
      }
      if (platform?.is_oem && spaceDoc.favicon){
        tenant.favicon_url = steedosService + "api/files/avatars/" + spaceDoc.favicon
      }
    }
  }

  let already_mail_service = canSendEmail();
  let already_sms_service = true || canSendSMS();

  //allowInit
  const broker = getSteedosSchema().broker;
  const serverInitInfo = {
    
  };

  const _tenant = clone(tenant);

  delete _tenant['tokenSecret'];
  delete _tenant['accessTokenExpiresIn']
  delete _tenant['refreshTokenExpiresIn']

  if(tenant.enable_saas){
    delete _tenant._id;
  }


  let settings = {};

  if(tenant._id){
    settings = await util.getSettings(tenant._id, true)
  }

  res.json({
    tenant: _tenant,
    password: config.password ? config.password : ( config.public?.password ? config.public?.password : {} ),
    root_url: process.env.ROOT_URL,
    already_mail_service: already_mail_service,
    already_sms_service: already_sms_service,
    serverInitInfo: serverInitInfo,
    redirect_url_whitelist: process.env.REDIRECT_URL_WHITELIST,
    platform: platform,
    public: (global as any).Meteor.settings.public || {},
    settings: settings
  })
}