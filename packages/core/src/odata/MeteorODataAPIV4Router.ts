import { Response } from 'express-serve-static-core';
import steedosAuth = require("@steedos/auth");
import { getObjectList, getObjectRecent, createObjectData, getObjectData, updateObjectData, deleteObjectData, excuteObjectMethod } from './server';

var router = require('@steedos/router').staticRouter();

import * as core from "express-serve-static-core";
interface Request extends core.Request {
    user: any;
}

const checkUser = (req: Request, res: Response, next: () => void)=>{
    if (req.user) {
        next();
    }
    else {
        res.status(401).send({ status: 'error', message: 'You must be logged in to do this.' });
    }
}


/*
在odata接口中处理
  1. space级 下增，删，改，查权限
  2. company级 下增，删，改，查权限
  3. 记录级权限：
    owner(记录所有者)处理
*/

router.get('/api/v4/:objectName', steedosAuth.setRequestUser, checkUser, getObjectList);

router.get('/api/v4/:objectName/recent', steedosAuth.setRequestUser, checkUser, getObjectRecent);

router.post('/api/v4/:objectName', steedosAuth.setRequestUser, checkUser, createObjectData);

router.get('/api/v4/:objectName/:_id', steedosAuth.setRequestUser, checkUser, getObjectData);

router.put('/api/v4/:objectName/:_id', steedosAuth.setRequestUser, checkUser, updateObjectData);

router.delete('/api/v4/:objectName/:_id', steedosAuth.setRequestUser, checkUser, deleteObjectData);

router.all('/api/v4/:objectName/:_id/:methodName', steedosAuth.setRequestUser, checkUser, excuteObjectMethod);

export default router