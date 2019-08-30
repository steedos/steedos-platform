import * as express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { init } from "./src"

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get('/', (req, res) => {
  res.redirect("/accounts");
  res.end();
});

init({app});

app.listen(4000, () => {
  console.log('Server listening on port 4000');
});
