# @steedos/standard-space

### 服务名称 `~packages-@steedos/standard-space`

## actions

### 全量同步组织

名称: `upsetOrganizations`

参数(JSON)
- `organizations`: 需要同步的数据, `idFieldName` 指定的key不可以为空
- `spaceInfo`: 同步到此工作区
- `idFieldName`: 需要同步的数据中唯一键的字段名称
- `parentFieldName`: 需要同步的数据中父级ID的字段名称

示例
```
this.broker.call('~packages-@steedos/standard-space.upsetOrganizations', {
    organizations: [{
        qywx_id: "1",
        name: "组织1"
    },{
        qywx_id: "2",
        name: "组织1",
        qywx_pid: "1"
    }],
    spaceInfo: {
        _id: "spaceId",
        name: "spaceName"
    },
    idFieldName: "qywx_id",
    parentFieldName: "qywx_pid"
})
```

### 全量同步用户

名称: `upsetSpaceUsers`

参数(JSON)
- `spaceUsers`: 需要同步的数据, `idFieldName` 指定的key不可以为空, `organizations` 不可为空
- `spaceInfo`: 同步到此工作区
- `idFieldName`: 需要同步的数据中唯一键的字段名称
- `orgIdFieldName`: organizations 数据中id的字段名称, 如上例中的 `qywx_id`

示例
```
this.broker.call('~packages-@steedos/standard-space.upsetSpaceUsers', {
    spaceUsers: [{
        name: "user1",
        organizations: ['1']
    },{
        name: "user2",
        organizations: ['2']
    }],
    spaceInfo: {
        _id: "spaceId",
        name: "spaceName"
    },
    idFieldName: "qywx_id",
    orgIdFieldName: "qywx_id"
})
```