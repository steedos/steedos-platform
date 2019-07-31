---
title: 身份验证
---

有多种方式可以和 Steedos API 进行身份验证。

以下示例需确认 Steedos服务 运行于 http://localhost:5000 。

## Session Token

Make an HTTP POST to `your-steedos-url.com/api/v4/users/login` with a JSON body indicating the user’s `username`, `password` and optionally the Space Id `space_id` for SAAS version of Steedos. The `username` can be an email, username or an mobile phone number depending on the system's configuration.

```
curl -i -d '{"username":"someone@nowhere.com","password":"thisisabadpassword"}' http://localhost:8065/api/v4/users/login
```

NOTE: If you're running cURL on windows, you will have to change the single quotes to double quotes, and escape the inner double quotes with backslash, like below:

```
curl -i -d "{\"username\":\"someone@nowhere.com\",\"password\":\"thisisabadpassword\"}" http://localhost:8065/api/v4/users/login
```

If successful, the response will contain a `Token` header and a user object in the body.

```
HTTP/1.1 200 OK
Set-Cookie: X-User-ID=fdsfdfsfgghdsfds; Path=/; Max-Age=2592000; HttpOnly
Token: hyr5dmb1mbb49c44qmx4whniso
X-Ratelimit-Limit: 10
X-Ratelimit-Remaining: 9
X-Ratelimit-Reset: 1
X-Request-Id: smda55ckcfy89b6tia58shk5fh
X-Version-Id: developer
X-User-Id: fdsfdfsfgghdsfds
X-Space-Id: dasdsaffdsafgdsf
X-Auth-Token: dfasfgfsdajlkrwq
Date: Fri, 11 Sep 2015 13:21:14 GMT
Content-Length: 657
Content-Type: application/json; charset=utf-8

{{user object as json}}
```

Include the `Token` as part of the `Authorization` header on your future API requests with the `Bearer` method.

```
curl -i -H 'Authorization: Bearer hyr5dmb1mbb49c44qmx4whniso' http://localhost:8065/api/v4/users/me
```

You should now be able to access the API as the user you logged in as.
