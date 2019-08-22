import * as express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as mongoose from 'mongoose';
import { AccountsServer } from '@accounts/server';
import { AccountsPassword } from '@accounts/password';
import accountsExpress, { userLoader } from './rest-express';
import MongoDBInterface from './database-mongo';

let MONGO_URL = process.env.MONGO_URL;
if (!MONGO_URL)
  MONGO_URL = "mongodb://127.0.0.1/steedos"

mongoose.connect(MONGO_URL, { useNewUrlParser: true });
const db = mongoose.connection;

const accountsServer = new AccountsServer(
  {
    db: new MongoDBInterface(db, {
      convertUserIdToMongoObjectId: false,
      convertSessionIdToMongoObjectId: false,
      timestamps: {
        createdAt: 'created',
        updatedAt: 'modified',
      },
    }),
    tokenSecret: 'secret',
  },
  {
    password: new AccountsPassword(),
  }
);

const router = accountsExpress(accountsServer, {
  path: '/api',
});

router.use("/", express.static(path.join(__dirname, '..', 'webapp', 'build')));
router.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'webapp', 'build', 'index.html'));
});

export default router;