import { requireAuthentication } from '@steedos/core'

const express = require('express');


import {submit} from './submit'


export const processExpress = express.Router();

processExpress.post('/api/v4/process/submit/:objectName/:record', requireAuthentication, submit);


