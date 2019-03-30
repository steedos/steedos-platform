
let express = require('express');
let path = require('path');
let app = express();

app.use('/',express.static(path.join(__dirname, "public")));

app.listen(process.env.PORT || 3001)
