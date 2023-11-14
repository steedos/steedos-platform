<!--
 * @Author: sunhaolin@hotoa.com
 * @Date: 2021-10-21 09:57:01
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-11-14 11:13:54
 * @Description: 
-->
## 功能说明
- 此包是系统设置中的数据导入功能，可通过excel导入对象数据

### 提供importData action 支持导入{objectname}.data.json、{objectname}.data.csv数据

- 比如在自定义的软件包package.service.js中监听系统初始化事件调用importData导入软件包中的数据：

```js

module.exports = {
    /**
     * Events
     */
    events: {
        // 系统初始化成功
        'service-cloud-init.succeeded': async function (ctx) {
            await this.broker.call("@steedos/data-import.importData", {
                data: {
                    "csv": csvData,
                    "json": jsonData,
                },
                spaceId,
                onlyInsert: true,
            })
        }
    },
};
```

- importData action 参数说明
```js
/**
 * 参数示例：
{
    data: {
        "csv": [{ objectName: 'warehouse', records: [ [Object] ]],
        "json": [{ objectName: 'house', records: [ [Object] ]],
    },
    spaceId,
    onlyInsert: true,
}
    */
"importData": {
    params: {
        data: {
            type: "object",
            props: {
                csv: {
                    type: "array",
                    items: {
                        type: "object",
                        props: {
                            objectName: { type: "string" },
                            records: { type: "array", items: "object" },
                        }
                    },
                    optional: true,
                },
                json: {
                    type: "array",
                    items: {
                        type: "object",
                        props: {
                            objectName: { type: "string" },
                            records: { type: "array", items: "object" },
                        }
                    },
                    optional: true,
                },
            }
        },
        spaceId: { type: "string" },
        onlyInsert: { type: "boolean", optional: true, default: true }, // 仅新增，在导入数据之前先检查，如果存在任意一条记录，则不执行导入，默认true，如果是false, 则如果存在则执行更新操作。
    },
    async handler(ctx) {
        
    }
}
```
## 使用mongodb cli 导出演示数据
- json: 使用命令导出。例如: `mongoexport --uri="mongodb://192.168.3.31:27017/steedos-apps"  --jsonArray --collection=contract_types  --out=contract_types.data.json`
- csv: 使用命令导出。例如: `mongoexport --uri="mongodb://192.168.3.31:27017/steedos-apps"  --collection=contract_types --type=csv --fields=name,code --out=contract_types.data.csv`

## 编码要求
json、csv中文件请使用`utf-8`编码

## 示例，导出合同模块数据， 进入`main\default\data`文件夹后执行以下命令
```
mongoexport --uri="mongodb://192.168.3.31:27017/steedos-apps"  --collection=contract_types --type=csv --fields=name,code --out=contract_types.data.csv

mongoexport --uri="mongodb://192.168.3.31:27017/steedos-apps" --jsonArray --collection=contracts  --out=contracts.data.json
```
