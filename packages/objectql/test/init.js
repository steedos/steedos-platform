/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
const path = require('path');
process.env.TS_NODE_PROJECT = path.resolve('test/tsconfig.json');
//// SqlServer 2005单元测试连接串，test/unit/driver/sqlserver/*
// process.env.DRIVER_SQLSERVER_URL = "mssql://user:password@192.168.0.190/driver-test";
//// SqlServer 2012单元测试连接串，test/unit/driver/sqlserver/*
// process.env.DRIVER_SQLSERVER_URL = "mssql://user:password@192.168.0.78/driver-test";
//// postgresql单元测试连接串，test/unit/driver/postgres/*
// process.env.DRIVER_POSTGRESQL_URL = "postgresql://user:password@192.168.0.195/driver-test";
//// Oracle数据库单元测试连接串，test/unit/driver/oracle/*
// 同一个命令行窗口执行yarn test前需要执行一次：SET PATH=C:\oracle\instantclient_12_1;%PATH%
// 参考:test/unit/driver/oracle/README.md，如果已经正确设置了环境变量则不需要执行上面的SET PATH
// process.env.DRIVER_ORACLE_ConnectString = "192.168.0.237:1521/server_name";
// process.env.DRIVER_ORACLE_Username = "user";
// process.env.DRIVER_ORACLE_Password = "password";
// process.env.DRIVER_ORACLE_Database = "db_name";
// // mysql单元测试连接串，test/unit/driver/mysql/*
// process.env.DRIVER_MYSQL_Host = "192.168.0.195";
// process.env.DRIVER_MYSQL_Username = "user";
// process.env.DRIVER_MYSQL_Password = "password";
// process.env.DRIVER_MYSQL_Database = "driver-test";