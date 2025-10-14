/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-04-04 16:34:28
 * @Description: 
 */
const express = require('express');
const router = express.Router();
const auth = require('@steedos/auth');

router.get('/test/redirect', auth.requireAuthentication, async function (req, res) {
  const userSession = req.user;
  const redirect_url = "/app/admin?uid=" + userSession.userId;
   res.redirect(302, redirect_url || '/');
});
exports.default = router;