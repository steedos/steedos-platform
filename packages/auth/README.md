# @steedos/auth用于生成及缓存用户的session，提高验证速度
## 安装
- yarn add @steedos/auth 或者  npm install @steedos/auth

## 开放getSession方法，获取用户session
- 参数token是`X-AUTH-TOKEN`, spaceId是工作区id
- `async function getSession(token: string, spaceId: string): Promise<SteedosUserSession>;`
- 返回SteedosUserSession格式如下：
```ts
export declare type SteedosIDType = number | string;
{
    userId: SteedosIDType; // 用户id
    spaceId: string; // 工作区id
    roles: string[]; // 用户角色
    name: string; // 用户名称
    steedos_id?: string; // 用户steedosid
    email?: string; // 用户邮件
    companyId?: string; // 用户所属单位id
    companyIds?: string[]; // 用户所属所有单位id
}
```
- 如果参数spaceid没传则 `async function getSession(token: string): Promise<ResultSession>;`
- 返回ResultSession格式如下：
```ts
{
  name: string; // 用户名称
  userId: SteedosIDType; // 用户id
  steedos_id?: string; // 用户steedosid
  email?: string; // 用户邮件
}
```
## 开放auth方法，验证用户session
- `async function auth(request: Request, response: Response): Promise<any>`
- 传入request response对象，返回getSession方法返回值

## 开放setRequestUser方法，设置req.user属性
- `async function setRequestUser(request: Request, response: Response, next)`
- 示例：
```js
  let app = express();
  app.use('/', setRequestUser);
```

## 功能说明
- 此包用于解析接口用户认证信息、缓存用户基本信息