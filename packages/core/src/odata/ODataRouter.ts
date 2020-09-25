
import { Response } from 'express';
import steedosAuth = require("@steedos/auth");
import { getObjectList, getObjectRecent, createObjectData, getObjectData, updateObjectData, deleteObjectData, excuteObjectMethod } from './server';


var express = require('express');
var router = express.Router();

import * as core from "express-serve-static-core";
interface Request extends core.Request {
  user: any;
}

router.use('/:spaceId', steedosAuth.setRequestUser);

// middleware that is specific to this router
router.use('/:spaceId', function (req: Request, res: Response, next: () => void) {
  if (req.user) {
    next();
  }
  else {
    res.status(401).send({ status: 'error', message: 'You must be logged in to do this.' });
  }
})

router.get('/:spaceId/:objectName', getObjectList)

router.get('/:spaceId/:objectName/recent', getObjectRecent)
router.post('/:spaceId/:objectName', createObjectData)
router.get('/:spaceId/:objectName/:_id', getObjectData)
router.put('/:spaceId/:objectName/:_id', updateObjectData)
router.delete('/:spaceId/:objectName/:_id', deleteObjectData)
router.all('/:spaceId/:objectName/:_id/:methodName', excuteObjectMethod);
export default router