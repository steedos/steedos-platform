const express = require('express');

import { read } from "./endpoints/notifications";

export const coreExpress = express.Router();

coreExpress.get('/api/v4/notifications/:id/read', read);
