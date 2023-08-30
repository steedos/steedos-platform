import * as express from 'express';
import * as path from 'path';
import * as mongodb from 'mongodb';
import { AccountsServer, generateRandomToken } from './server';
import { AccountsPassword } from './password';
import { errors } from './password/errors';
import accountsExpress from './rest-express';
import MongoDBInterface from './database-mongo';
// import accountsSamlIdp from './saml-idp';
import { userLoader } from './rest-express/user-loader';
import { mongoUrl } from './db';
import { getSteedosConfig, getDataSource } from '@steedos/objectql'
import { URL } from 'url';
import * as bodyParser from 'body-parser';
import { sendMail, sendSMS } from './core';

export { setAuthCookies, clearAuthCookies } from './rest-express/utils/steedos-auth';
export { getMergedTenant } from './core';

declare var WebApp;

const config = getSteedosConfig();
let accountsServer;

export function getAccountsServer() {
  return accountsServer;
}

export async function createAccountsServer() {
  let accountsConfig = config.tenant || {};
  let emailConfig = config.email || {};
  let tokenSecret = accountsConfig.tokenSecret || generateRandomToken();
  let accessTokenExpiresIn = accountsConfig.accessTokenExpiresIn || "90d";
  let refreshTokenExpiresIn = accountsConfig.refreshTokenExpiresIn || "7d";
  let mailSignname = emailConfig.signname || "华炎魔方";

  const driver = getDataSource('default').adapter as any;
  await driver.connect();
  const client = driver.getClient();

  const connection = client.db();

  const rootUrl = process.env.ROOT_URL
    ? process.env.ROOT_URL
    : "http://127.0.0.1:4000";
  const rootUrlInstance = new URL(rootUrl);
  const siteUrl = rootUrlInstance.origin;
  var emailFrom = "";
  if (config.email && config.email.from) {
    emailFrom = config.email.from;
  }
  const accountsServer = new AccountsServer(
    {
      ambiguousErrorMessages: true,
      db: new MongoDBInterface(connection, {
        convertUserIdToMongoObjectId: false,
        convertSessionIdToMongoObjectId: false,
        idProvider: () => new mongodb.ObjectId().toString(),
        timestamps: {
          createdAt: "created",
          updatedAt: "modified",
        },
        dateProvider: (date?: Date) => {
          return date ? date : new Date();
        },
      }),
      sendMail: sendMail,
      sendSMS: sendSMS,
      siteUrl: siteUrl,
      tokenSecret: tokenSecret,
      tokenConfigs: {
        accessToken: {
          expiresIn: accessTokenExpiresIn,
        },
        refreshToken: {
          expiresIn: refreshTokenExpiresIn,
        },
      },
      emailTemplates: {
        from: emailFrom,
        verificationCode: {
          subject: (user, token) => `【${mailSignname}】验证码：${token}`,
          text: (user: any, url: string, token) =>
            `您的验证码是: ${token}，请不要泄露给他人。`,
          html: (user: any, url: string, token: string) =>
            `您的验证码是: ${token}，请不要泄露给他人。`,
        },
        verifyEmail: {
          subject: (user, params) => "验证您的帐户电子邮件",
          text: (user: any, url: string) =>
            `请点击此链接来验证您的帐户电子邮件: ${url}`,
          html: (user: any, url: string) =>
            `请点击<a href="${url}">此链接</a>来验证您的帐户电子邮件。`,
        },
        resetPassword: {
          subject: () => "重置您的账户密码",
          text: (user: any, url: string) =>
            `请点击此链接来重置您的账户密码: ${url}`,
          html: (user: any, url: string) =>
            `请点击<a href="${url}">此链接</a>来重置您的账户密码。`,
        },
        enrollAccount: {
          subject: () => "设置您的账户密码",
          text: (user: any, url: string) =>
            `请点击此链接来设置您的账户密码: ${url}`,
          html: (user: any, url: string) =>
            `请点击<a href="${url}">此链接</a>来设置您的账户密码。`,
        },
        passwordChanged: {
          subject: () => "您的账户密码已被更改",
          text: () => `您的帐户密码已更改成功。`,
          html: () => `您的帐户密码已更改成功。`,
        },
      },
    },
    {
      password: new AccountsPassword({
        errors: errors,
        passwordHashAlgorithm: "sha256",
        notifyUserAfterPasswordChanged: config.password
          ? config.password.notifyUserAfterPasswordChanged
          : true,
        sendVerificationEmailAfterSignup: config.password
          ? config.password.sendVerificationEmailAfterSignup
          : false,
      }),
    }
  );

  return accountsServer;
}


export async function getAccountsRouter(context) {
  accountsServer = await createAccountsServer();
  const router = accountsExpress(accountsServer, {
    path: '/accounts',
  });

  router.get('/accounts', (req, res) => {
    res.redirect("a/");
    res.end();
  });

  /* Router to SAML-IDP */
  // router.use("/saml/", userLoader(accountsServer), accountsSamlIdp);

  return router
}

export function init(context) {

  if (context.settings) {
    if (!context.settings.public) {
      context.settings.public = {}
    }
    if (!context.settings.public.webservices) {
      context.settings.public.webservices = {}
    }
    context.settings.public.webservices.accounts = { url: '/accounts' }
  }
  getAccountsRouter(context).then((accountsRouter) => {
    require('./rest-express/endpoints/initServer')
  })
}