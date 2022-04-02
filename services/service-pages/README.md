<!--
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-03-28 09:35:35
 * @Description: 
-->
## 功能说明
- 报表中的面板服务

## 使用 Builder

Builder是异步加载, 加载完成后会给window下写变量Builder, 如果直接在client中调用Builder可能会出现error:`Builder is not defined`. 请使用`waitForThing(window, 'Builder')` 等待Builder加载后,再调用Builder相关函数.
例如:
```
waitForThing(window, 'Builder').then(()=>{
    Builder.registerComponent(xxx,xxxx);
})
```

## 环境变量

- STEEDOS_PAGE_RENDER: 页面渲染引擎, 如果配置了次值, 则需要提供同名的service且提供action:`getDefaultSchema`, 且通过Builder注册同名组件. 默认为空

- STEEDOS_PUBLIC_PAGE_ASSETURLS: 资产包的url地址,多个用逗号分隔.如果未配置,则不加载

- STEEDOS_PUBLIC_PAGE_UNPKGURL: unpkg cdn配置, 默认为 https://npm.elemecdn.com

## 自定义渲染器
- 使用`client.js`调用`Builder.registerComponent`注册渲染器

## getDefaultSchema 
- 如果配置了`STEEDOS_PAGE_RENDER`环境变量, 则需要提供此action
- 返回值需要根据type 返回 记录页面、列表页面、表单 3种的schema
示例
```
getDefaultSchema: {
    async handler(ctx) {
        const userSession = ctx.meta.user; 
        const { type, app, objectApiName, recordId, formFactor } = ctx.params;
        return ...
    }
}
```