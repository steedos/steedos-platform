import * as express from 'express';
import * as hbs from 'hbs';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { init } from "./src"

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

app.listen(4000, () => {
  console.log('Server listening on port 4000');
});
