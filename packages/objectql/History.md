1.5.0-beta.0 / 2019-08-30
===================

  * 把所属单位表 company 从 organizations 中独立出来 #124
1.0.10 / 2019-08-28
===================

  * [graphql api 的url 取消 datasource_name 部分](https://github.com/steedos/object-server/issues/125)
1.0.9 / 2019-08-21
===================

  * app 新增mobile_objects属性，用于指定在手机上显示应用的对象
1.0.7 / 2019-08-21
===================

  * object 禁止重名; object.tableName 属性调整为 table_name
1.0.5 / 2019-08-17
===================

  * 支持对象继承
1.0.2 / 2019-08-14
===================

  * 引用@steedos/filters 1.0,fix 版本冲突
1.0.1 / 2019-08-14
===================

  * 调整datasource init
0.2.3 / 2019-08-10
===================

  * 调整type SteedosUserSession结构
0.2.2 / 2019-08-06
===================

  * 引用最新的@steedos/filters包，所有yarn test通过
0.2.1 / 2019-08-02
===================

  * 提供schema.getSteedosConfig() 函数
0.1.9 / 2019-07-30
===================

  * 加载*.object.yml和*.object.json文件时校验（validateObject）用户定义的对象，如字段命名规范，可定义属性范围，值范围等
0.1.5 / 2019-07-21
===================

  * fix bug
0.1.4 / 2019-07-21
===================

  * object.js 不是对象的定义文件，而是对象的扩展文件
0.1.3 / 2019-07-19
===================

  * object.find findOne count方法内跟据usersession判断并处理用户获取数据权限
0.1.2 / 2019-07-18
===================

  * graphql 支持数据源类型meteor-mongo和mongo按工作区查询数据
0.0.19 / 2019-06-22
===================

  * fix `Class 'SteedosDataSourceType' incorrectly implements interface 'Dictionary<unknown>'.`

0.0.16 / 2019-06-13
===================

  * 非meteor-mongo对象则继承coreObject

0.0.12 / 2019-06-04
===================

  * meteormongodriver中update 的data参数格式不要带$set 与mongodriver保持一致 #82