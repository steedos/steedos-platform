## 功能说明
- 提供软件包许可证校验


## actions
- hasProduct(packageName, spaceId): 是否有软件包的许可证
- getProduct(packageName, spaceId): 获取软件包的许可证详细信息

- hasFeature(packageFeatureName, spaceId): 许可证中是否有指定的功能点
- getFeature(packageFeatureName, spaceId): 获取许可证中功能点详细信息

## 示例: xxx.trigger.js
```
{
    listenTo: 'contracts',
    beforeInsert: async function () {
        const allow = await objectql.getSteedosSchema().broker.call(`@steedos/service-package-license.hasProduct`, { key: '@steedos-labs/contract', spaceId: this.spaceId })
        if (!allow) {
            throw new Error(`请购买许可证`);
        }
    },
    beforeUpdate: async function () {
        if(this.doc.payment){
            const allow = await objectql.getSteedosSchema().broker.call(`@steedos/service-package-license.hasFeature`, { key: '@steedos-labs/contract#payment', spaceId: this.spaceId })
            if (!allow) {
                throw new Error(`创建付款合同失败，请购买升级许可证`);
            }
        }
        
    }
}
```
## client js 中判断软件包许可证及软件包功能点:
- Steedos.hasProduct(packageName, spaceId): 是否有软件包的许可证
- Steedos.getProduct(packageName, spaceId): 获取软件包的许可证详细信息

- Steedos.hasFeature(packageFeatureName, spaceId): 许可证中是否有指定的功能点
- Steedos.getFeature(packageFeatureName, spaceId): 获取许可证中功能点详细信息

