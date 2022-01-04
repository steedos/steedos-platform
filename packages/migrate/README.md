Steedos Migration Scripts
===

Migrate steedos database with [node-migrate](https://github.com/tj/node-migrate).

## Usage

### DB Connection

set database connection in steedos-config.yml

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

### Enable auto migrate for steedos

steedos-config.yml

```yml
datasources:
  default:
    auto_migrate: true
```

### Add migration script

```shell
yarn migrate create :script_name
```
## 功能说明
- 此包用于执行升级脚本文件