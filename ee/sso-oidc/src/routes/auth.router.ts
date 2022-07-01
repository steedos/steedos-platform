/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-06-24 17:15:52
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-06-28 16:19:51
 * @Description: 
 */
import * as express from "express";
const ejs = require('ejs');
const authController = require("./auth");
const path = require("path");
const router = express.Router();

router
  .get("/api/global/auth/oidc/config", //"/api/global/auth/oidc/configs/:configId",
    authController.oidcPreAuth
  )
  .get("/api/global/auth/oidc/callback", authController.oidcAuth)
  .get("/api/global/auth/oidc/error-callback", async function(req, res){
      const filename = path.join(__dirname, '..', '..', '..', 'ejs', 'error-callback.ejs')
      const data = {}
      const options = {}
      ejs.renderFile(filename, data, options, function(err, str){
          // str => Rendered HTML string
          res.send(str);
      });
  })
  .post('/api/global/auth/oidc/login', authController.oidcLogin)

exports.default = router;
