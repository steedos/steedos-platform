/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
const path = require('path');
process.env.TS_NODE_PROJECT = path.resolve('test/tsconfig.json');
// process.env.DRIVER_SQLSERVER_URL = "mssql://user:password@192.168.0.190/driver-test";
// process.env.DRIVER_SQLSERVER_URL = "mssql://user:password@192.168.0.78/driver-test";
// process.env.DRIVER_SQLSERVER_TDS = "7_2";//7_2为2005,7_4为2012+,默认为7_4
// process.env.DRIVER_POSTGRESQL_URL = "postgresql://user:password@192.168.0.195/driver-test";


