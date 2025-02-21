db.instances_statistic = Creator.getCollection('instances_statistic') || new Mongo.Collection("instances_statistic")


// instances_stat.coffee
var InstancesStat, logger, ref, schedule;

schedule = require('node-schedule');

logger = new Logger('Instances_Statistics');

InstancesStat = {};

//	*    *    *    *    *    *
//	┬    ┬    ┬    ┬    ┬    ┬
//	│    │    │    │    │    |
//	│    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
//	│    │    │    │    └───── month (1 - 12)
//	│    │    │    └────────── day of month (1 - 31)
//	│    │    └─────────────── hour (0 - 23)
//	│    └──────────────────── minute (0 - 59)
//	└───────────────────────── second (0 - 59, OPTIONAL)
InstancesStat.rule = (ref = Steedos.settings) != null ? ref.instances_stat : void 0;

InstancesStat.costTime = function (space) {
  var userCostTime;
  logger.info(`[${new Date()}] start run InstancesStat.costTime`);
  console.log(`[${new Date()}] start run InstancesStat.costTime`);
  userCostTime = new UserCostTime(space);
  userCostTime.startStat();
  logger.info(`[${new Date()}] end run InstancesStat.costTime`);
};

InstancesStat.run = function () {
  try {
    // space = InstancesStat.rule.space;
    // 效率统计，定时任务只扫描企业版
    Creator.getCollection('spaces').find({features: 'workflow_statistics'}).forEach(function (space) {
      return InstancesStat.costTime(space._id);
    });
  } catch (e) {
    return logger.error("InstancesStat.costTime", e);
  }
};

Meteor.startup(function () {
  if (InstancesStat.rule && InstancesStat.rule.schedule) {
    // 开始同步任务，同步任务的schedule
    schedule.scheduleJob(InstancesStat.rule.schedule, Meteor.bindEnvironment(InstancesStat.run));
  }
});

// ==================================================================

// InstancesStat.init('h8BomfvK7cZhyg9ub', 2018, 4)
// InstancesStat.init('Af8eM6mAHo7wMDqD3', 2018, 1)
InstancesStat.init = function (space, year, month) {
  var userCostTime;
  userCostTime = new UserCostTime(space, year, month);
  userCostTime.startStat();
};


// InstancesStat.test('Af8eM6mAHo7wMDqD3')
InstancesStat.test = function (space) {
  return InstancesStat.run(space);
};

// init_statistics.coffee
Meteor.methods({
  init_statistics: function (space, year, month) {
    var e, error, userCostTime;
    try {
      userCostTime = new UserCostTime(space, year, month);
      userCostTime.startStat();
      return result;
    } catch (error1) {
      e = error1;
      error = e;
      return error;
    }
  }
});

// user_cost_time.coffee
var UserCostTime, logger;

logger = new Logger('Instances_Statistics -> UserCostTime');

// space: 工作区ID
UserCostTime = function (space, year, month) {
  this.space = space;
  this.year = year || null;
  this.month = month || null;
};

UserCostTime.prototype.startStat = function () {
  var aggregate, async_aggregate, cursor, def_date, def_month, def_year, end_date, finished_approves, inbox_approves, ins_approves, ins_approves_group, now_date, now_day, now_month, now_year, pipeline, query, spaceId, space_user_ids, space_users, start_date, sumTime;
  logger.info('UserCostTime.startStat()');
  spaceId = this.space;
  ins_approves = new Array();
  now_date = new Date();
  if (this.year && this.month) {
    logger.info("指定" + this.year + "年" + this.month + "月");
    console.log("指定" + this.year + "年" + this.month + "月");
    def_date = new Date(this.year + "-" + this.month);
    def_year = def_date.getFullYear();
    def_month = def_date.getMonth() + 1;
    start_date = new Date(def_year + "-" + def_month);
    end_date = new Date(def_year + "-" + def_month);
    end_date.setMonth(end_date.getMonth() + 1);
  } else {
    // 开始日期是当月的一号
    now_year = now_date.getFullYear();
    now_month = now_date.getMonth() + 1;
    now_day = now_date.getDate();
    logger.info("不指定年月，默认是" + now_year + "年" + now_month + "月");
    console.log("不指定年月，默认是" + now_year + "年" + now_month + "月");
    start_date = new Date(now_year + "-" + now_month);
    // 如果统计日期是当月的1号，开始日期 = 统计日期 - 1个月 = 上月1号
    // 每月的1号统计上个月的审批效率
    if (now_day === 1) {
      start_date.setMonth(start_date.getMonth());
    }
    // 结束日期是当月统计的当天
    end_date = now_date;
  }
  logger.info("start_date", start_date);
  logger.info("end_date", end_date);
  console.log("start_date", start_date);
  console.log("end_date", end_date);
  space_users = db.space_users.find({
    space: spaceId
  }, {
    fields: {
      user: 1
    }
  }).fetch();
  space_user_ids = space_users.map(function (m) {
    return m.user;
  });
  query = {
    // 筛选出当前工作区
    "space": spaceId,
    // 去掉 已删除 的表单
    "is_deleted": false,
    // 排除 取消申请 的表单
    "final_decision": {
      $ne: "terminated"
    },
    // 申请人必须是当前工作区
    "submitter": {
      $in: space_user_ids
    },
    // state判断，进行中和已完成的表单
    $or: [
      {
        // 进行中的申请单，全部查出来
        // 在pipeline中会再次筛选，筛选出步骤的开始日期比统计结束日期大的表单
        "state": "pending"
      },
      {
        // 审批结束的申请单，且最后的修改时间是在[开始，结束]区间
        // 例如，统计2017年12月的申请单，则找12月1号-31号之间处理完成的申请单
        $and: [
          {
            "state": "completed"
          },
          {
            "modified": {
              $gt: start_date
            }
          },
          {
            "modified": {
              $lt: end_date
            }
          }
        ]
      }
    ]
  };
  aggregate = function (pipeline, ins_approves, cb) {
    var cursor;
    // aggregate聚合
    cursor = Creator.Collections["instances"].rawCollection().aggregate(pipeline, {
      cursor: {}
    });
    cursor.on('data', function (doc) {
      doc.is_finished = doc._id.is_finished || false;
      return ins_approves.push(doc);
    });
    return cursor.once('end', function () {
      return cb();
    });
  };
  async_aggregate = Meteor.wrapAsync(aggregate);
  pipeline = [
    {
      // 根据query的条件查询所有的intances
      $match: query
    },
    {
      // $project:修改输入文档的结构。可以用来重命名、增加或删除域，也可以用于创建计算结果以及嵌套文档。
      // 将查询到的instances取traces字段的approves属性存为_approve
      $project: {
        "_approve": '$traces.approves'
      }
    },
    {
      // $unwind:将数组拆分，每条包含数组中的一个值。
      // 取_approve[0]
      $unwind: "$_approve"
    },
    {
      // $unwind:将数组拆分，每条包含数组中的一个值。
      // 两次unwind
      $unwind: "$_approve"
    },
    {
      // 再次过滤，此时结构为approve list
      // $match:过滤   draft:表示草稿
      $match: {
        // 不包括 草稿、分发和转发
        "_approve.type": {
          $nin: ["draft",
            "distribute",
            "forward"]
        },
        // 查找当前工作区用户的申请单
        "_approve.handler": {
          $in: space_user_ids
        },
        // 或：
        $or: [
          {
            // 审批未结束的申请单,开始日期 小于 统计结束日期
            // 例如统计17年11月份的数据（end_date为12月1号凌晨0点）
            // 某申请单11月创建，到12月份仍正在进行，则排除其approve
            $and: [
              {
                "_approve.is_finished": false
              },
              {
                "_approve.start_date": {
                  $lt: end_date
                }
              }
            ]
          },
          {
            // 审批结束的申请单，且结束日期是在[开始，结束]区间
            $and: [
              {
                "_approve.finish_date": {
                  $gt: start_date
                }
              },
              {
                "_approve.finish_date": {
                  $lt: end_date
                }
              }
            ]
          }
        ]
      }
    },
    {
      // $group:将集合中的文档分组，可用于统计结果。
      $group: {
        _id: {
          "handler": "$_approve.handler",
          "is_finished": "$_approve.is_finished"
        },
        // 当月已处理总耗时
        month_finished_time: {
          $sum: "$_approve.cost_time"
        },
        // 当月已处理总数
        month_finished_count: {
          $sum: 1
        },
        // 待审核表单的ID
        inbox_instances: {
          $addToSet: "$_approve.instance"
        },
        // 待审批开始时间
        itemsSold: {
          $push: {
            instance: "$_approve.instance",
            start_date: "$_approve.start_date"
          }
        }
      }
    }
  ];
  console.time("async_aggregate_cost_time");
  // 管道在Unix和Linux中一般用于将当前命令的输出结果作为下一个命令的参数。
  cursor = async_aggregate(pipeline, ins_approves);
  // console.log "====================",ins_approves?.length
  if ((ins_approves != null ? ins_approves.length : void 0) > 0) {
    // console.log "========================"

    // console.log ins_approves

    // 将查询到的approve分两个组，一组是已完成，一组是正在进行的
    ins_approves_group = _.groupBy(ins_approves, "is_finished");
    // 审批完成的步骤
    finished_approves = ins_approves_group[true] || [];
    // 待审批的步骤
    inbox_approves = ins_approves_group[false] || [];
    // 遍历已处理的列表
    if ((finished_approves != null ? finished_approves.length : void 0) > 0) {
      finished_approves.forEach(function (finished_approve) {
        var inbox_approve;
        inbox_approve = _.find(inbox_approves, function (item, index) {
          var ref, ref1;
          // 待审批步骤里面的人员和审批完成步骤里面的人员一致
          if (((ref = item._id) != null ? ref.handler : void 0) === ((ref1 = finished_approve._id) != null ? ref1.handler : void 0)) {
            // 从待审核数组中将该user去掉
            inbox_approves.splice(index, 1);
            return item;
          }
        });
        // 本月待处理文件的数量
        // inbox_approve数组中，itemsSold的instance去掉重复的ID后的数量
        if ((inbox_approve != null ? inbox_approve.inbox_instances : void 0) && (inbox_approve != null ? inbox_approve.inbox_instances.length : void 0) > 0) {
          finished_approve.inbox_count = inbox_approve != null ? inbox_approve.inbox_instances.length : void 0;
        } else {
          finished_approve.inbox_count = 0;
        }
        // 待审核的表单ID
        finished_approve.inbox_instances = inbox_approve != null ? inbox_approve.inbox_instances : void 0;
        delete finished_approve.is_finished; // 本来就是已完成

        // delete finished_approve.inbox_instances # 删除已处理的ID，不用统计
        return finished_approve.itemsSold = inbox_approve != null ? inbox_approve.itemsSold : void 0;
      });
    }
    // 遍历剩余未处理的列表
    if ((inbox_approves != null ? inbox_approves.length : void 0) > 0) {
      if (inbox_approves != null) {
        inbox_approves.forEach(function (inbox_approve) {
          var count, itemsSold, ref;
          count = (inbox_approve != null ? (ref = inbox_approve.inbox_instances) != null ? ref.length : void 0 : void 0) || 0;
          return itemsSold = finished_approves.push({
            _id: inbox_approve._id,
            month_finished_time: 0, //当月已处理总耗时
            month_finished_count: 0, //当月已完成的处理，本来就是0
            inbox_count: count, //未完成数量
            inbox_instances: inbox_approve.inbox_instances, // 待审核的表单ID
            itemsSold: inbox_approve.itemsSold //所有未审批的开始时间
          });
        });
      }
    }
  } else {
    finished_approves = [];
  }
  // 整理存入数据库中
  if ((finished_approves != null ? finished_approves.length : void 0) > 0) {
    // 未处理文件总耗时，已 end_date 为判断
    sumTime = function (inbox_instances, itemsSold) {
      var sum;
      // console.log "==========待审核步骤信息============="
      // console.log itemsSold
      // console.log "==========待审核表单ID============="
      // console.log inbox_instances
      sum = 0;
      if ((inbox_instances != null ? inbox_instances.length : void 0) > 0) {
        inbox_instances.forEach(function (inbox_instance) {
          var items, minus, ref;
          // 传阅的情况下，一个文件会有多个待处理步骤，取最早的待处理步骤
          items = itemsSold.filter(function (m) {
            return m.instance === inbox_instance;
          });
          items.sort(function (a, b) {
            return Date.parse(a.time) - Date.parse(b.time);
          });
          // console.log "==========排序步骤=========="
          // console.log items[0]
          minus = (end_date - ((ref = items[0]) != null ? ref.start_date : void 0)) / (1000 * 60 * 60) || 0;
          return sum += minus;
        });
      }
      return sum;
    };
    // console.log 'finished_approves',finished_approves.length

    // 循环已处理的审批步骤
    finished_approves.forEach(function (approve) {
      var avg_time, exist_obj, inbox_avg, inbox_time, month_finished_avg, month_finished_time, ref, result, setObj, space_user, statCollection, userId;
      // console.log "=================================="

      // console.log "approve", approve

      // 当月待处理的总耗时(如果一个待处理文件当前有多个步骤，取最早的步骤时间节点)
      inbox_time = sumTime(approve != null ? approve.inbox_instances : void 0, approve != null ? approve.itemsSold : void 0);
      // 当月待处理的平均耗时
      if ((approve != null ? approve.inbox_count : void 0) > 0) {
        inbox_avg = inbox_time / (approve != null ? approve.inbox_count : void 0);
      } else {
        inbox_avg = 0;
      }
      // 当月已处理的总耗时
      month_finished_time = (approve != null ? approve.month_finished_time : void 0) / (1000 * 60 * 60) || 0;
      // 当月已处理的平均耗时
      if ((approve != null ? approve.month_finished_count : void 0) > 0) {
        month_finished_avg = month_finished_time / (approve != null ? approve.month_finished_count : void 0) || 0;
      } else {
        month_finished_avg = 0;
      }
      // 总平均耗时
      if (((approve != null ? approve.month_finished_count : void 0) + (approve != null ? approve.inbox_count : void 0)) > 0) {
        avg_time = (month_finished_time + inbox_time) / ((approve != null ? approve.month_finished_count : void 0) + (approve != null ? approve.inbox_count : void 0)) || 0;
      } else {
        avg_time = 0;
      }
      // double-保留2位
      approve.inbox_time = Math.round(inbox_time * 100) / 100 || 0;
      approve.month_finished_time = Math.round(month_finished_time * 100) / 100 || 0;
      approve.inbox_avg = Math.round(inbox_avg * 100) / 100 || 0;
      approve.month_finished_avg = Math.round(month_finished_avg * 100) / 100 || 0;
      approve.avg_time = Math.round(avg_time * 100) / 100 || 0;
      userId = approve != null ? (ref = approve._id) != null ? ref.handler : void 0 : void 0;
      approve.user = userId;
      approve.year = start_date.getFullYear();
      approve.month = start_date.getMonth() + 1;
      approve.space = spaceId;
      approve.created = now_date;
      space_user = db.space_users.findOne({
        'space': spaceId,
        'user': userId
      });
      if (space_user) {
        approve.owner_organization = space_user != null ? space_user.organization : void 0;
        approve.owner_organizations = (space_user != null ? space_user.organizations : void 0) || [];
        if (space_user.company_id) {
          approve.company_id = space_user.company_id;
        }
      }
      delete approve.itemsSold;
      delete approve._id;
      approve.owner = userId;
      statCollection = Creator.Collections["instances_statistic"];
      exist_obj = statCollection.findOne({
        'year': approve.year,
        'month': approve.month,
        'user': approve.user
      });
      if (exist_obj) {
        setObj = {
          inbox_time: approve.inbox_time,
          inbox_count: approve.inbox_count,
          inbox_avg: approve.inbox_avg,
          month_finished_time: approve.month_finished_time,
          month_finished_count: approve.month_finished_count,
          month_finished_avg: approve.month_finished_avg,
          avg_time: approve.avg_time,
          owner_organization: approve.owner_organization,
          owner_organizations: approve.owner_organizations,
          modified: now_date
        };
        if (approve.company_id) {
          setObj.company_id = approve.company_id;
        }
        return result = statCollection.update(exist_obj._id, {
          $set: setObj
        });
      } else {
        return result = statCollection.insert(approve);
      }
    });
  }
};
