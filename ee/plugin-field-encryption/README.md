<!--
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-05-04 16:44:32
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-05-11 11:24:41
 * @Description: 
-->
# 客户端字段级加密服务

## 启用前依赖

- 安装软件包 `@steedos/ee_plugin-field-encryption`
- 运行软件包中 `createMasterKey.js` 生成master key，配置于`.env.local`作为`STEEDOS_CSFLE_MASTER_KEY`的值
- 请妥善保存master key，若丢失数据加密密钥会使使用该密钥加密的所有字段永久不可读

### 环境变量

- `process.env.STEEDOS_CSFLE_MASTER_KEY`: 主密钥，运行`createMasterKey.js`生成
- `process.env.STEEDOS_CSFLE_ALT_KEY_NAME`: 主密钥别名（可选），默认 steedos
- `process.env.STEEDOS_CSFLE_KEY_VAULT_DB`: 密钥保管库库名（可选），默认 MONGO_URL中连接的库
- `process.env.STEEDOS_CSFLE_KEY_VAULT_COLLECTION`: 密钥保管库表名（可选），默认 __keystore
- `process.env.STEEDOS_CSFLE_MONGO_URL`: 密钥保管库连接字符串（可选），默认 MONGO_URL

## 如何启用字段加密

- 管理员在设置-对象详情页新增字段选择字段类型为文本/密码时会出现 `加密` 勾选框，勾选之后新增的对象记录中加密字段的内容会被加密后保存至数据库中
- 或者开发人员在字段`.field.yml`配置文件中添加 `enable_encryption: true`

## 参考文档

- [Client-Side Field Level Encryption](https://www.mongodb.com/docs/manual/core/security-client-side-encryption/)