<!--
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-11-15 08:55:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-11-15 14:08:34
 * @Description: 
-->
This is a [Steedos](https://www.steedos.com/) project bootstrapped with [`create-steedos-app`](https://github.com/steedos/steedos-platform/tree/master/packages/create-steedos-app).

## Getting Started

- 注册 Datadog 账户。
- 创建 .env.local 文件，并配置环境变量。

```
DATADOG_API_KEY=xxx
```

- 运行开发服务器:

```bash
docker-compose up
yarn
yarn start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

To learn more about Steedos Platform, take a look at the following resources:

- [Steedos Documentation](https://www.steedos.com/docs) - learn about Steedos features and API.

You can check out [the Steedos GitHub repository](https://github.com/steedos/steedos-platform/) - your feedback and contributions are welcome!

## Deploy your project

The easiest way to deploy your Steedos app is to use the [Docker Template](https://github.com/steedos/docker).

Check out our [Steedos deployment documentation](https://www.steedos.com/docs/deploy/getting-started) for more details.



env:

STEEDOS_TENANT_ENABLE_SAAS: 启用SaaS
STEEDOS_TENANT_MASTER_ID: 主工作区的id, 此工作区的管理员可以安装软件包、维护对象、对象字段、对象按钮等