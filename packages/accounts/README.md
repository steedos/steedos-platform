# Steedos Accounts

Fullstack authentication and accounts-management for steedos.

## Connect to mongodb

```bash
export MONGO_URL=mongodb://127.0.0.1/steedos
```

## process.ENV
```bash
export ROOT_URL=http://127.0.0.1:4000/
```

## Start Server at 4000

```bash
yarn
yarn start
```

Server apis runs on https://127.0.0.1:4000/accounts/

## Debug Webapp at 3000

```bash
cd webapp
yarn
yarn start
```

Navigate to https://127.0.0.1:3000/ to view react webapp.

## Build Webapp to 4000

```bash
cd webapp
yarn
yarn build
```

Build webapp to /webapps/build folder, will mount to https://127.0.0.1:4000/accounts/a/

Navigate to https://127.0.0.1:4000/ , will redirect to build webapp at https://127.0.0.1:4000/accounts/a/
