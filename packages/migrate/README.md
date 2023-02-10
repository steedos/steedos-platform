<!--
 * @Author: sunhaolin@hotoa.com
 * @Date: 2021-05-24 12:32:57
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2023-01-11 16:54:20
 * @Description: 
-->
Steedos Migration Scripts
===

Migrate steedos database with [node-migrate](https://github.com/tj/node-migrate).

## Usage

### DB Connection

项目根目录下执行 node 进入node控制台

在node控制台执行 `require('dotenv-flow').config(); ` 目的是为了读取.env.local设置 `process.env.MONGO_URL`
### Migrate up

open nodejs console.

```js
var migrate = require("@steedos/migrate");
migrate.up();
```

### Migrate down

open nodejs console.

```js
var migrate = require("@steedos/migrate");
migrate.down();
```

### Default auto migrate for steedos

config STEEDOS_DB_AUTO_MIGRATE=false in .env.local to disable auto migrate

### Add migration script

```shell
yarn migrate create :script_name
```
## 功能说明
- 此包用于执行升级脚本文件