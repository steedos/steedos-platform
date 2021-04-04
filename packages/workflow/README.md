# steedos-plugin-workflow 流程设计器服务端接口
## 接口返回数据格式
- 初始化数据格式
```JSON
{
    "Categories": [{}],
    "Clouds": [{}],
    "Flows": [{}],
    "Forms": [{}],
    "Modules": [{}],
    "Organizations": [{}],
    "Positions": [{}],
    "Roles": [{}],
    "SpaceUsers": [{}],
    "Spaces": [{}],
    "Users": [{}],
    "sync_token": 1564109179.74439
}
```
- changeSet数据格式
```JSON
{
    "ChangeSet": {
        "sync_token": 1564111514.69613,
        "inserts": {
            "Spaces": [],
            "Users": [],
            "SpaceUsers": [],
            "Organizations": [],
            "Roles": [],
            "Positions": [],
            "Forms": [],
            "Flows": [],
            "Categories": []
        },
        "updates": {
            "Spaces": [],
            "Users": [],
            "SpaceUsers": [],
            "Organizations": [],
            "Roles": [],
            "Positions": [],
            "Forms": [],
            "Flows": [],
            "Categories": []
        },
        "deletes": {
            "Spaces": [],
            "Users": [],
            "SpaceUsers": [],
            "Organizations": [],
            "Roles": [],
            "Positions": [],
            "Forms": [],
            "Flows": [],
            "Categories": []
        }
    }
}
```
## 初始化
- startup `GET /am/designer/startup?companyId=xxx`
- 返回初始化数据格式

## 分类
- 新建 `POST /am/categories?sync_token=1564108243.99516`
    - 传入body
    ```JSON
    {
        "Categories": [
            {
                "id": "77CBE571-A289-4EC1-904F-96B4AAE6F7AA",
                "name": "1",
                "space": "519f004e8e296a1c5f00001d"
            }
        ]
    }
    ```
    - 返回changeSet数据格式

- 修改 `POST /am/categories?methodOverride=PUT&sync_token=undefined`
    - 传入body
    ```JSON
    {
        "Categories": [
            {
                "id": "5d3a6adf29a1770044000015",
                "name": "1111"
            }
        ]
    }
    ```
    - 返回changeSet数据格式

- 删除 `POST /am/categories?methodOverride=DELETE&sync_token=1564108501.36039`
    - 传入body
    ```JSON
    {
        "Categories": [
            {
                "id": "5d3a6adf29a1770044000015"
            }
        ]
    }
    ```
    - 返回changeSet数据格式

## 表单
- 新建 `POST /am/forms?sync_token=1564108585.93979`
    - 传入body
    ```JSON
    {
        "Forms": [
            {
                "id": "508E8C86-2F8F-4D27-A311-8FFBBBC38E45",
                "name": "111",
                "space": "519f004e8e296a1c5f00001d",
                "is_valid": true,
                "app": "workflow",
                "current": {
                    "id": "C5A488B3-E5EF-4174-A2E7-AEAE10BFFC1B"
                },
                "category": "55a7366e527eca7e9d000004"
            }
        ]
    }
    ```
    - 返回changeSet数据格式

- 修改 `POST /am/forms?methodOverride=PUT&sync_token=1564111514.69613`
    - 传入body
    ```JSON
    {
        "Forms": [
            {}
        ]
    }
    ```
    - 返回changeSet数据格式

- 删除 `POST /am/forms?methodOverride=DELETE&sync_token=1564112892.41282`
    - 传入body
    ```JSON
    {
        "Forms": [
            {
                "id": "3D0CBF46-9D5D-49A5-8495-12F55F654B3E"
            }
        ]
    }
    ```
    - 返回changeSet数据格式

## 流程
- 修改 `POST /am/flows?methodOverride=PUT&sync_token=1564112892.27197`
    - 传入body
    ```JSON
    {
        "Flows": [
            {}
        ]
    }
    ```
    - 返回changeSet数据格式
- 启用禁用 `POST /am/flows/state?methodOverride=PUT&sync_token=1564218587.82764`
    - 传入body
    ```JSON
    {
        "Flows": [
            {}
        ]
    }
    ```
    - 返回changeSet数据格式
