import * as express from 'express';
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

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

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

const router = accountsExpress(accountsServer);
router.get('/user', userLoader(accountsServer), (req, res) => {
  res.json({ user: (req as any).user });
});

app.use("/api/v4", router);

app.use(express.static('./webapp/build'));

app.listen(4000, () => {
  console.log('Server listening on port 4000');
});
