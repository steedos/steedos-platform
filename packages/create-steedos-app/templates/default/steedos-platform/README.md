# Steedos Platform

Steedos Low-code PaaS platform is an open-source alternative to Salesforce Platform. It provides a powerful and flexible platform for building enterprise applications quickly and easily. With Steedos, you can create custom applications without writing a single line of code.

## Starting Steedos

Instructions for initializing the Steedos Platform, a powerful low-code solution, using different methods.

### 1. Launching Steedos with Docker

It is recommended to use Docker for launching the Steedos platform as it automatically initializes all dependent services.

```bash
docker-compose up
```

### 2. Launching Steedos with Node.js

Alternatively, the Steedos platform can be started using Node.js. This method requires you to first install MongoDB, Redis, and NATS locally, or initiate these dependent services with Docker.

1. Start Mongodb & Redis

```bash
docker-compose up redis mongodb mongodb-init
```

2. Start Steedos

```bash
yarn
yarn start
```
