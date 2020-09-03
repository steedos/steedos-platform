import { requireAuthentication } from '@steedos/core';

import { submit } from './submit';
import { approve } from './approve';

const express = require('express');


export const processExpress = express.Router();

processExpress.post('/api/v4/process/submit/:objectName/:record', requireAuthentication, submit);

processExpress.post('/api/v4/process/approve/:objectName/:record', requireAuthentication, approve);

processExpress.post('/api/v4/process/reject/:objectName/:record', requireAuthentication, submit);

processExpress.post('/api/v4/process/reassign/:objectName/:record', requireAuthentication, submit);

processExpress.post('/api/v4/process/recall/:objectName/:record', requireAuthentication, submit);


