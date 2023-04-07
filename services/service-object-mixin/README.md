### Summary 摘要

为微服务提供一个 this.getObject 函数，返回一个对象，其中包括 objectql 中的所有函数。

例如
```
    methods: {
		getObject: (objectName)=> {
			return {
				find: async (params) => {
					return await this.broker.call('objectql.find', {objectName, ...params})
				}
			}
		}
    }

```

### Why should this be worked on? 此需求的应用场景？

解决在微服务中用简化语法调用 objectql 的问题。