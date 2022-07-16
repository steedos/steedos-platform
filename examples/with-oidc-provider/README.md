Steedos OIDC Provider
===

- https://github.com/panva/node-oidc-provider
- https://github.com/panva/node-oidc-provider-example


## Getting Started

### Start mongodb & redis service

```bash
docker-compose up
```

### Start steedos service

```bash
yarn
yarn start
```

Open [http://localhost:5000](http://localhost:5000) with your browser to see the result.

## View 

```bash
open '/identity/oidc/.well-known/openid-configuration' # to see your openid-configuration  
open '/identity/oidc/auth?client_id=foo&response_type=id_token&redirect_uri=https%3A%2F%2Fjwt.io&scope=openid&nonce=foobar' # to start your first Authentication Request
```