Meteor.startup(function () {
    // if (Meteor.settings.cron && Meteor.settings.cron.dingtalk) {

    //     var schedule = require('node-schedule');
    //     // 定时执行同步
    //     var rule = Meteor.settings.cron.dingtalk;

    //     var go_next = true;

    //     schedule.scheduleJob(rule, Meteor.bindEnvironment(function () {
    //         if (!go_next)
    //             return;
    //         go_next = false;

    //         console.log('dingtalk schedule start!');
    //         console.time('dingtalk');
    //         var spaces = db.spaces.find({ "services.dingtalk.corp_id": { $exists: true }, "services.dingtalk.permanent_code": { $exists: true }, "services.dingtalk.permanent_code": { $ne: null }, "services.dingtalk.modified": { $exists: true } });
    //         var result = [];

    //         spaces.forEach(function (s) {
    //             try {
    //                 var o = ServiceConfiguration.configurations.findOne({ service: "dingtalk" });
    //                 if (o && o.suite_access_token) {
    //                     Dingtalk.debug && console.log(s.name);
    //                     var corpid = s.services.dingtalk.corp_id;
    //                     var permanent_code = s.services.dingtalk.permanent_code;
    //                     var auth_corp_info = {};
    //                     auth_corp_info.corpid = corpid;
    //                     auth_corp_info.corp_name = s.name;

    //                     var at = Dingtalk.corpTokenGet(o.suite_access_token, corpid, permanent_code);
    //                     if (at && at.access_token) {
    //                         Dingtalk.debug && console.log(at.access_token);
    //                         Dingtalk.syncCompany(at.access_token, auth_corp_info, permanent_code);
    //                     }

    //                 }
    //             }
    //             catch (err) {
    //                 e = {};
    //                 e._id = s._id;
    //                 e.name = s.name;
    //                 e.services = s.services;
    //                 e.err = err;
    //                 result.push(e);
    //                 console.error(e);
    //             }
    //         });

    //         if (result.length > 0) {
    //             try {
    //                 var Email = Package.email.Email;
    //                 Email.send({
    //                     to: 'support@steedos.com',
    //                     from: Accounts.emailTemplates.from,
    //                     subject: 'dingtalk sync result',
    //                     text: JSON.stringify({ 'result': result })
    //                 });
    //             } catch (err) {
    //                 console.error(err);
    //             }

    //         }

    //         console.timeEnd('dingtalk');

    //         go_next = true;

    //     }, function () {
    //         console.log('Failed to bind environment');
    //     }));

    // }

})