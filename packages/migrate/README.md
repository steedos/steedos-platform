Steedos Migration Scripts
===

Migrate steedos database with [node-migrate](https://github.com/tj/node-migrate).

## Console usage

### DB Connection

set database connection in steedos-config.yml

### Migrate up

```shell
yarn migrate up
```

### Migrate down

```shell
yarn migrate down
```

### Add migration script

```shell
yarn migrate create :script_name
```

## Programmatic usage

### Migrate up

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