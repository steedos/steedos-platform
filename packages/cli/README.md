# Steedos
Develop and run your enterprise apps in miniutes

### install from npm
```
npm i steedos-cli -g
```

### install from src
```
git clone https://github/steedos/cli
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
- lng: 需要生成国际化的语言, 必填
- -s: 项目所在路径, 默认为当前目录, 选填
- 示例: `steedos i18n zh-CN -s D:\GitHub\steedos-project-saas`

- 开发环境运行方式: 进行cli项目, 执行 `yarn prepare` 后， 再进入**bin**文件夹下执行（示例）: `.\run i18n zh-CN -s D:\GitHub\steedos-project-saas`
