# 提供接口


## 总览
---

| 方法 | 地址 | 用途 |
| :--- | :--- | :--- |
| GET | /service/api/$sidecar/registry/nodes | 获取nodes |
| GET | /service/api/$sidecar/registry/services | 获取services |
| GET | /service/api/$sidecar/registry/actions | 获取actions |
| GET | /service/api/$sidecar/registry/events | 获取events |
| POST | /service/api/$sidecar/registry/services | 注册service |
| DELETE | /service/api/$sidecar/registry/services/:serviceName | 注销service |
| POST | /service/api/$sidecar/call/:action | 调用action |
| POST | /service/api/$sidecar/emit/:event | 触发event |
| POST | /service/api/$sidecar/broadcast/:event | 广播event |

## 说明
---

### 接口认证

- 添加请求头 `Authorization: Bearer apikey,{apiKey}`, {apiKey}值从`华炎魔方平台-高级设置-API Key`菜单获取
  
### 注册service

请求正文格式为 MoleculerJS Service，需要注意的是sidecar会使用POST方式调用action或event接口，示例：
```
POST /service/api/$sidecar/registry/services
```

**请求体** 
```js
{
    name: "posts",
    version: 1,

    settings: {
        // It means, your HTTP server running on port 5000 and sidecar can reach it on `localhost`
        // The URLs in action/event handlers contains relative URL.
        baseUrl: "http://localhost:5000"
    },

    actions: {
        list: {
            params: {
                limit: "number",
                offset: "number"
            },
            // Shorthand handler URL what will be called by sidecar
            handler: "/actions/posts/list"
        }
    },

    events: {
        "user.created": {
            // Shorthand handler URL what will be called by sidecar
            handler: "/events/user.created"
        }
    }
}
```

### 调用action

调用service的action，示例：
```
POST /service/api/$sidecar/call/comments.create
```

**请求体**
```js
{
    // Context params
    params: {
        title: "Lorem ipsum",
        content: "Lorem ipsum dolor sit amet..."
    },
    // Context meta
    meta: {
        user: {
            id: 12345
        }
    },
    // Calling options
    options: {
        timeout: 3000
    }
}
```

**响应体** 
```js
{
    // Response data
    response: {
        id: 1,
        title: "Lorem ipsum",
        content: "Lorem ipsum dolor sit amet..."
    },
    // Optional: Context meta if you changed the content.
    meta: {
        user: {
            id: 12345
        }
    }
}
```

**报错响应**
```js
{
    error: {
        name: "MoleculerClientError",
        code: 422,
        type: "VALIDATION_ERROR",
        message: "Title is required",
        data: {
            action: "comments.create",
            params: {
                title: null
            }
        }
    }
}
```

### 触发event

触发某个服务的事件，示例：
```
POST /service/api/$sidecar/emit/post.created
```

广播则使用如下URL，示例:
```
POST /service/api/$sidecar/broadcast/post.created
```

**Request body**
```js
{
    // Context params
    params: {
        id: 1,
        title: "First post",
        content: "Post content",
        author: 12345
    },
    // Context meta
    meta: {
        user: {
            id: 12345
        }
    },
    // Emit options
    options: {
        groups: "users"
    }
}
```

### 接受action请求
如果注册的service定义了action，其他服务调用action时sidecar会使用POST方法调用action中定义的handler地址，请求正文如下:

**请求体**
```js
{
    // Action name
    action: "posts.list",

    // Caller NodeID
    nodeID: "node-123",

    // Context params
    params: {
        limit: 10,
        offset: 50
    },

    // Context meta
    meta: {
        user: {
            id: 12345
        }
    },

    // Calling options
    options: {
        timeout: 3000
    }
}
```

action中定义的handler地址，返回值应是如下格式:

**响应体** 
```js
{
    // Response data
    response: [
        { id: 1, title: "First post" },
        { id: 2, title: "Second post" },
        { id: 3, title: "Third post" }
    ],
    // Optional: Context meta if you changed the content.
    meta: {
        user: {
            id: 12345
        }
    }
}
```

如果执行过程中报错，sidecar会返回如下格式响应正文:

**报错响应** 
```js
{
    // Error data
    error: {
        name: "MoleculerClientError",
        code: 400,
        type: "INVALID_INPUT",
        message: "Some user input is not valid",
        data: {
            // Any useful data
            action: "posts.list",
            params: {
                limit: "asd"
            }
        }
    }
}
```

### 接受event请求
如果注册的service定义了event，其他服务调用event时sidecar会使用POST方法调用event中定义的handler地址，请求正文如下:

**请求体**
```js
{
    // Event name
    event: "user.created",

    // Type of event (emit, broadcast)
    eventType: "emit",

    eventGroups: "posts",

    // Caller NodeID
    nodeID: "node-123",

    // Context params
    params: {
        limit: 10,
        offset: 50
    },

    // Context meta
    meta: {
        user: {
            id: 12345
        }
    }
}
```
响应和报错与action一样。
