# @steedos/auth用于生成及缓存用户的session，提高验证速度
## 安装
- yarn add @steedos/auth 或者  npm install @steedos/auth

## 开放getSession方法，获取用户session
- 参数token是`X-AUTH-TOKEN`, spaceId是工作区id
- `getSession(token: string, spaceId: string): Promise<SteedosUserSession>;`
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
- 如果参数spaceid没传则 `getSession(token: string): Promise<ResultSession>;`
- 返回ResultSession格式如下：
```ts
{
  name: string; // 用户名称
  userId: SteedosIDType; // 用户id
  steedos_id?: string; // 用户steedosid
  email?: string; // 用户邮件
}
```