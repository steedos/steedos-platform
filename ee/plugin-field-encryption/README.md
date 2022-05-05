<!--
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-05-04 16:44:32
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-05-05 13:24:53
 * @Description: 
-->
# 客户端字段级加密服务

## 启用前依赖

- 运行`createMasterKey.js`生成master key，配置于`.env.local`作为`STEEDOS_CSFLE_MASTER_KEY`的值

### 环境变量

- `process.env.STEEDOS_CSFLE_MASTER_KEY`: 主密钥，运行`createMasterKey.js`生成
- `process.env.STEEDOS_CSFLE_ALT_KEY_NAME`: 主密钥别名，默认 steedos
- `process.env.STEEDOS_CSFLE_KEY_VAULT_DB`: 密钥保管库库名，默认 MONGO_URL中连接的库
- `process.env.STEEDOS_CSFLE_KEY_VAULT_COLLECTION`: 密钥保管库表名，默认 __keystore
- `process.env.STEEDOS_CSFLE_MONGO_URL`: 密钥保管库连接字符串，默认 MONGO_URL

## 参考文档

- [Client-Side Field Level Encryption](https://www.mongodb.com/docs/manual/core/security-client-side-encryption/)