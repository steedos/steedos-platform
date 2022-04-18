
## 检索内置对象的扩展属性

### 方式1: 使用package.yml
1 新增package.yml
```
# 例如同步部门的自定义字段、按钮. 新增`steedos-app/package.yml`
CustomAction:
  - organizations.*
CustomActionScript:
  - organizations.*
CustomField:
  - organizations.*
```

2 在项目跟路径下执行命令
```
steedos source:retrieve -y ./steedos-app/package.yml
```
### 方式2: retrieve -m 命令
示例1: 同步部门的自定义按钮`btn1`
```
steedos source:retrieve -m CustomAction:organizations.btn1
```
示例1: 同步部门所有自定义按钮
```
steedos source:retrieve -m CustomAction:organizations.*
```