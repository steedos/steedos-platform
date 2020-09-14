const express = require('express');
const path = require('path');

exports.init = function(context) {

  const router = express.Router()
  
  /* Router to webapps build */
  router.use("/", express.static(path.join(__dirname, 'public')));
  // router.use("/i18n", express.static(path.join(__dirname, 'src', 'i18n')));
  router.get('/accounts/a/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'accounts', 'a', 'index.html'));
  });
  context.app.use("/", router);
  
}