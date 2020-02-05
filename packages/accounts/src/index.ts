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
import { mongoUrl } from './db';
import { sendMail } from './mail';
import { getSteedosConfig } from '@steedos/objectql'

declare var WebApp;

const config = getSteedosConfig();

function getAccountsServer (context){

  let accountsConfig = config.accounts || {}
  let tokenSecret = accountsConfig.tokenSecret || "secret";
  let accessTokenExpiresIn = accountsConfig.accessTokenExpiresIn || "90d";
  let refreshTokenExpiresIn = accountsConfig.refreshTokenExpiresIn || "7d";
  
  mongoose.connect(mongoUrl, { useNewUrlParser: true });
  const db = mongoose.connection;
  
  const accountsServer = new AccountsServer(
    {
      db: new MongoDBInterface(db, {
        convertUserIdToMongoObjectId: false,
        convertSessionIdToMongoObjectId: false,
        idProvider: () => new mongodb.ObjectId().toString(),
        // timestamps: {
        //   createdAt: 'created',
        //   updatedAt: 'modified',
        // },
      }),
      sendMail: sendMail,
      tokenSecret: tokenSecret,
      tokenConfigs: {
        accessToken: {
          expiresIn: accessTokenExpiresIn,
        },
        refreshToken: {
          expiresIn: refreshTokenExpiresIn,
        },
      }
    },
    {
      password: new AccountsPassword({
        errors: errors,
        passwordHashAlgorithm: 'sha256',
        notifyUserAfterPasswordChanged: config.password ? config.password.notifyUserAfterPasswordChanged : true
      }),
    }
  );

  return accountsServer;
}

function getAccountsRouter(context){

  let accountsServer = getAccountsServer(context)

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
  let accountsRouter = getAccountsRouter(context);
  context.app.use("/accounts", accountsRouter);
  if (typeof WebApp !== 'undefined')
    WebApp.rawConnectHandlers.use("/accounts", accountsRouter)
}