import { requireAuthentication } from '@steedos/auth';

import { submit } from './submit';
import { approve } from './approve';
import { reject } from './reject';
import { reassign } from './reassign';
import { recall } from './recall';
import { allowObjectSubmit, allowRecallByProcessInstance, allowApproverByInstanceHistoryId } from './permission'

export const processExpress = require('@steedos/router').staticRouter();

processExpress.post('/api/v4/process/submit/:objectName/:record', requireAuthentication, submit);

processExpress.post('/api/v4/process/approve/:objectName/:record', requireAuthentication, approve);

processExpress.post('/api/v4/process/reject/:objectName/:record', requireAuthentication, reject);

processExpress.post('/api/v4/process/reassign/:objectName/:record', requireAuthentication, reassign);

// processExpress.post('/api/v4/process/recall/:objectName/:record', requireAuthentication, recall);

processExpress.post('/api/v4/process/recall/:objectName/:record', requireAuthentication, recall);

processExpress.get('/api/v4/process/permission/recall/:objectName/:record', requireAuthentication, allowRecallByProcessInstance);

processExpress.get('/api/v4/process/permission/approver/:objectName/:record', requireAuthentication, allowApproverByInstanceHistoryId);

processExpress.get('/api/v4/process/permission/submit/:objectName/:record', requireAuthentication, allowObjectSubmit);
