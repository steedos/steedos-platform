const express = require('express');

import { postObjectWebForm } from "./endpoints/web_forms";

export const coreExpress = express.Router();

coreExpress.post('/api/v4/:object_name/web_forms', postObjectWebForm)
