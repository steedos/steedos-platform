import { postObjectWebForm } from "./endpoints/web_forms";

export const coreExpress = require('@steedos/router').staticRouter();

coreExpress.post('/api/v4/:object_name/web_forms', postObjectWebForm)
