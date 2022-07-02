# Steedos
Develop and run your enterprise apps in miniutes

### install from npm
```
npm i steedos-cli -g
```

### install from src
```
cd cli
npm i -g
```

### build creator bundle
```
meteor build --directory C:\srv\creator-build
```

### run bundle
```
steedos run -s C:\srv\creator-build
```

### develop app
- create project folder
- write main.js
- steedos run will load main.js on bootstrap
```
steedos run -s C:\srv\creator-build
```

### help
```
steedos run --help
```

### i18n
- 生成项目下对象的国际化文件
- 语法 `steedos i18n ${lng} [-s]`
- lng: 需要生成国际化的语言, 必填 (en | zh-CN)
- -s: 项目所在路径, 默认为当前目录, 选填
- -p: 需要国际化的项目文件夹
- 示例: `steedos i18n zh-CN -s D:\GitHub\steedos-project-saas`
- 示例：`steedos i18n zh-CN -s . -p ./steedos-app`

- 开发环境运行方式: 进行cli项目, 执行 `yarn build` 后， 再进入**bin**文件夹下执行（示例）: `.\run i18n zh-CN -s D:\GitHub\steedos-project-saas`

### source
- 需要配置环境变量: METADATA_SERVER、METADATA_APIKEY，可以通过项目的env文件进行配置。
- config: 创建.env.local并写入METADATA_SERVER、METADATA_APIKEY。 比如 `steedos source:config`
- retrieve: 从服务器获取数据生成本地文件。 比如 `steedos source:retrieve -m Object:Accounts`
- deploy: 将本地文件部署到服务器。 比如 `steedos source:deploy -p steedos-app\main\default`

### data
- 需要配置环境变量: METADATA_SERVER、METADATA_APIKEY，可以通过项目的env文件进行配置。
- export: 从服务器获取数据生成本地文件。 比如 `steedos data:export -o accounts`或`steedos data:export -o accounts -p`
- import: 将本地文件部署到服务器。 比如 `steedos data:import -f accounts.json`或`steedos data:import -p account-plan.json`


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
示例2: 同步部门所有自定义按钮
```
steedos source:retrieve -m CustomAction:organizations.*
```
