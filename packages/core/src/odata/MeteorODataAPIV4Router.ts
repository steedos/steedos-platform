import { Response } from 'express';
import steedosAuth = require("@steedos/auth");
import { meteorODataExpressMiddleware } from './MeteorODataExpressMiddleware';
var express = require('express');
var router = express.Router();

import * as core from "express-serve-static-core";
interface Request extends core.Request {
    user: any;
}

router.use('/', steedosAuth.setRequestUser);

// middleware that is specific to this router
router.use('/', function (req: Request, res: Response, next: () => void) {
    if (req.user) {
        next();
    }
    else {
        res.status(401).send({ status: 'error', message: 'You must be logged in to do this.' });
    }
})

/*
在odata接口中处理
  1. space级 下增，删，改，查权限
  2. company级 下增，删，改，查权限
  3. 记录级权限：
    owner(记录所有者)处理
*/

router.get('/:objectName', meteorODataExpressMiddleware.getObjectList);

router.get('/:objectName/recent', meteorODataExpressMiddleware.getObjectRecent);

router.post('/:objectName', meteorODataExpressMiddleware.createObjectData);

router.get('/:objectName/:_id', meteorODataExpressMiddleware.getObjectData);

router.put('/:objectName/:_id', meteorODataExpressMiddleware.updateObjectData);

router.delete('/:objectName/:_id', meteorODataExpressMiddleware.deleteObjectData);

router.post('/:objectName/:_id/:methodName', meteorODataExpressMiddleware.excuteObjectMethod);

export default router