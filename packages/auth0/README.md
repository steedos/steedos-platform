Steedos Auth Server for Auth0
===

### Login

- [Signup](https://github.com/auth0/docs/blob/master/articles/api/authentication/_sign-up.md)
```
POST https://${account.namespace}/dbconnections/signup
Content-Type: application/json
{
  "client_id": "${account.clientId}",
  "email": "EMAIL",
  "password": "PASSWORD",
  "connection": "CONNECTION",
  "user_metadata": { plan: 'silver', team_id: 'a111' }
}
```