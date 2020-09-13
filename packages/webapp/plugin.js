const express = require('express');
const path = require('path');

exports.init = function(context){

  const router = express.Router()
  
  /* Router to webapps build */
  router.use("/", express.static(path.join(__dirname, 'build')));
  router.use("/i18n", express.static(path.join(__dirname, 'src', 'i18n')));
  router.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
  context.app.use("/accounts/a/", router);
}