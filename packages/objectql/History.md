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