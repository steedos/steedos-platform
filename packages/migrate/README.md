Steedos Migration Scripts
===

Migrate steedos database with [node-migrate](https://github.com/tj/node-migrate).

## Usage

### DB Connection

set database connection in steedos-config.yml

## Programmatic usage

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
migrate.up();
```

### Disable auto migrate for steedos

steedos-config.yml

```yml
datasources:
  default:
    auto_migrate: false
```

### Add migration script

```shell
yarn migrate create :script_name
```
