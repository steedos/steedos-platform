import * as express from 'express';
import * as hbs from 'hbs';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { init } from "./src";
import { config as dotenvConfig } from "dotenv-flow";

dotenvConfig();

const app = express();
app.engine('handlebars', hbs.__express);
app.set('views', __dirname + '/src/saml-idp/views');
app.set('view engine', 'hbs');
app.set('view options', { layout: 'layout' })
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({origin: true, credentials: true}));

app.get('/', (req, res) => {
  res.redirect("/accounts/a");
  res.end();
});

init({app});

const port = process.env.PORT ? process.env.PORT : 4000;

app.listen(port, () => {
  console.log('Server listening on port ' + port);
});
