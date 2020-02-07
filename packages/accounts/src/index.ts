import * as express from 'express';
import * as path from 'path';
import * as mongoose from 'mongoose';
import * as mongodb from 'mongodb';
import { AccountsServer } from '@accounts/server';
import { AccountsPassword } from './password';
import { errors } from './password/errors';
import accountsExpress from './rest-express';
import MongoDBInterface from './database-mongo';
import accountsSamlIdp from './saml-idp';
import { userLoader } from './rest-express/user-loader';
import { db } from './db';
import { sendMail } from './mail';
import { getSteedosConfig, SteedosMongoDriver, getConnection } from '@steedos/objectql'

declare var WebApp;
declare var Meteor;

const config = getSteedosConfig();

async function getAccountsServer (context){

  let accountsConfig = config.accounts || {}
  let tokenSecret = accountsConfig.tokenSecret || "secret";
  let accessTokenExpiresIn = accountsConfig.accessTokenExpiresIn || "90d";
  let refreshTokenExpiresIn = accountsConfig.refreshTokenExpiresIn || "7d";
  
  let connection = null;

  if (db instanceof SteedosMongoDriver) {
    await getConnection().connect();
    // TODO: objectql 升级后，去掉下面一行
    await db.connect();
    connection = db._client.db();
  } else {
    connection = Meteor.users.rawDatabase();
  }
  const issuer = process.env.ROOT_URL?process.env.ROOT_URL:'http://127.0.0.1:4000';
  var emailFrom = "Steedos <noreply@message.steedos.com>";
  if(config.email && config.email.from){
    emailFrom = config.email.from;
  }
  const accountsServer = new AccountsServer(
    {
      db: new MongoDBInterface(connection, {
        convertUserIdToMongoObjectId: false,
        convertSessionIdToMongoObjectId: false,
        idProvider: () => new mongodb.ObjectId().toString(),
        // timestamps: {
        //   createdAt: 'created',
        //   updatedAt: 'modified',
        // },
      }),
      sendMail: sendMail,
      siteUrl: issuer,
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
        verifyEmail: {
          subject: () => 'Verify your account email',
          text: (user: any, url: string) =>
            `To verify your account email please click on this link: ${url}`,
          html: (user: any, url: string) =>
            `To verify your account email please <a href="${url}">click here</a>.`,
        },
        resetPassword: {
          subject: () => 'Reset your password',
          text: (user: any, url: string) => `To reset your password please click on this link: ${url}`,
          html: (user: any, url: string) =>
            `To reset your password please <a href="${url}">click here</a>.`,
        },
        enrollAccount: {
          subject: () => 'Set your password',
          text: (user: any, url: string) => `To set your password please click on this link: ${url}`,
          html: (user: any, url: string) =>
            `To set your password please <a href="${url}">click here</a>.`,
        },
        passwordChanged: {
          subject: () => 'Your password has been changed',
          text: () => `Your account password has been successfully changed`,
          html: () => `Your account password has been successfully changed.`,
        }
      }
    },
    {
      password: new AccountsPassword({
        errors: errors,
        passwordHashAlgorithm: 'sha256',
        notifyUserAfterPasswordChanged: config.password ? config.password.notifyUserAfterPasswordChanged : true,
        sendVerificationEmailAfterSignup: config.password ? config.password.sendVerificationEmailAfterSignup : false
      }),
    }
  );

  return accountsServer;
}

async function getAccountsRouter(context){

  let accountsServer = await getAccountsServer(context)

  const router = accountsExpress(accountsServer, {
    path: '/',
  });
  

  router.get('/', (req, res) => {
    res.redirect("a/");
    res.end();
  });

  /* Router to webapps build */
  router.use("/a/", express.static(path.join(__dirname, '..', 'webapp', 'build')));
  router.use("/a/i18n", express.static(path.join(__dirname, '..', 'webapp', 'src', 'i18n')));
  router.get('/a/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'webapp', 'build', 'index.html'));
  });

  /* Router to SAML-IDP */
  router.use("/saml/", userLoader(accountsServer), accountsSamlIdp);

  return router
}

export function init(context){

  if(context.settings){
    if(!context.settings.public){
        context.settings.public = {} 
    }
    if(!context.settings.public.webservices){
        context.settings.public.webservices = {}  
    }
    context.settings.public.webservices.accounts = { url: '/accounts' }
  }
  getAccountsRouter(context).then( (accountsRouter) => {
    context.app.use("/accounts", accountsRouter);
    if (typeof WebApp !== 'undefined')
      WebApp.rawConnectHandlers.use("/accounts", accountsRouter)
  })
}