Meteor.startup(function () {

  if (Meteor.settings.cron && Meteor.settings.cron.statistics) {

    var schedule = Npm.require('node-schedule');
    // 定时执行统计
    var rule = Meteor.settings.cron.statistics;

    var go_next = true;

    schedule.scheduleJob(rule, Meteor.bindEnvironment(function () {
      if (!go_next)
        return;
      go_next = false;

      console.time('statistics');
      // 日期格式化 
      var dateFormat = function (date) {
        var datekey = ""+date.getFullYear()+"-"+(date.getMonth()+1)+"-"+(date.getDate());
        return datekey;
      };
      // 计算前一天时间
      var yesterDay = function () {
        var dNow = new Date();   //当前时间
        var dBefore = new Date(dNow.getTime() - 24*3600*1000);   //得到前一天的时间
        return dBefore;
      };
      // 统计当日数据
      var dailyStaticsCount = function (collection, space) {
        var statics = collection.find({"space":space["_id"],"created":{$gt: yesterDay()}});
        return statics.count();
      };
      // 查询总数
      var staticsCount = function (collection, space) {
        var statics = collection.find({"space": space["_id"]});
        return statics.count();
      };
      // 查询拥有者名字
      var ownerName = function (collection, space) {
        var owner = collection.findOne({"_id": space["owner"]});
        var name = owner.name;
        return name;
      };
      // 最近登录日期
      var lastLogon = function (collection, space) {
        var lastLogon = 0;
        var sUsers = db.space_users.find({"space": space["_id"]}, {fields: {user: 1}}); 
        sUsers.forEach(function (sUser) {
          var user = collection.findOne({"_id":sUser["user"]});
          if(user && (lastLogon < user.last_logon)){
            lastLogon = user.last_logon;
          }
        })
        return lastLogon;
      };
      // 最近修改日期
      var lastModified = function (collection, space) {
        var obj = collection.find({"space": space["_id"]}, {sort: {modified: -1}, limit: 1});
        var objArr = obj.fetch();
        if(objArr.length > 0)
          var mod = objArr[0].modified;
          return mod;
      };
      // 文章附件大小
      var postsAttachments = function (collection, space) {
        var attSize = 0;
        var sizeSum = 0;
        var posts = collection.find({"space": space["_id"]});
        posts.forEach(function (post) {
          var atts = cfs.posts.find({"post":post["_id"]});
          atts.forEach(function (att) {
            attSize = att.original.size;
            sizeSum += attSize;
          })  
        })
        return sizeSum;
      };
      // 当日新增附件大小
      var dailyPostsAttachments = function (collection, space) {
        var attSize = 0;
        var sizeSum = 0;
        var posts = collection.find({"space": space["_id"]});
        posts.forEach(function (post) {
          var atts = cfs.posts.find({"post": post["_id"], "uploadedAt": {$gt: yesterDay()}});
          atts.forEach(function (att) {
            attSize = att.original.size;
            sizeSum += attSize;
          })
        })
        return sizeSum;
      };
      // 插入数据
      db.spaces.find({"is_paid":true}).forEach(function (space) {
        db.steedos_statistics.insert({
          space: space["_id"],
          space_name: space["name"],
          balance: space["balance"],
          owner_name: ownerName(db.users, space),
          created: new Date(),
          steedos:{
            users: staticsCount(db.space_users, space),
            organizations: staticsCount(db.organizations, space),
            last_logon: lastLogon(db.users, space)
          },
          workflow:{
            flows: staticsCount(db.flows, space),
            forms: staticsCount(db.forms, space),
            flow_roles: staticsCount(db.flow_roles, space),
            flow_positions: staticsCount(db.flow_positions, space),
            instances: staticsCount(db.instances, space),
            instances_last_modified: lastModified(db.instances, space),
            daily_flows: dailyStaticsCount(db.flows, space),
            daily_forms: dailyStaticsCount(db.forms, space),
            daily_instances: dailyStaticsCount(db.instances, space)
          },
          cms: {
            sites: staticsCount(db.cms_sites, space),
            posts: staticsCount(db.cms_posts, space),
            posts_last_modified: lastModified(db.cms_posts, space),
            posts_attachments_size: postsAttachments(db.cms_posts, space),
            comments: staticsCount(db.cms_comments, space),
            daily_sites: dailyStaticsCount(db.cms_sites, space),
            daily_posts: dailyStaticsCount(db.cms_posts, space),
            daily_comments: dailyStaticsCount(db.cms_comments, space),
            daily_posts_attachments_size: dailyPostsAttachments(db.cms_posts, space)
          }
        });
      });
      
      console.timeEnd('statistics');

      go_next = true;

    }, function () {
      console.log('Failed to bind environment');
    }));

  }

})




