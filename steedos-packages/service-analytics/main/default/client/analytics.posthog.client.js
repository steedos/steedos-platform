/*
 * @Author: yinlianghui@steedos.com
 * @Date: 2022-07-22 09:50:56
 * @LastEditors: yinlianghui@steedos.com
 * @LastEditTime: 2022-07-23 15:15:17
 * @Description: 
 */
(function () {
  try {
    var analyticsConfig = Meteor.settings.public.analytics;
    var defaultId = "phc_Hs5rJpeE5JK3GdR3NWOf75TvjEcnYShmBxNU2Y942HB";
    var defaultApiHost = "https://posthog.steedos.cn";
    var posthogConfig = analyticsConfig && analyticsConfig.posthog || { id: defaultId, api_host: defaultApiHost };
    if (!posthogConfig) {
      return;
    }
    var posthogId = posthogConfig.id || defaultId;
    var posthogHost = posthogConfig.api_host || defaultApiHost;
    var scriptPosthog = $(`<script>
        !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
        posthog.init('${posthogId}',{api_host:'${posthogHost}'})
      </script>`);
    $("head").append(scriptPosthog);
  } catch (error) {
    console.log(error);
  }
  try {
    Meteor.startup(function () {
      if (!window.posthog.capture) {
        return;
      }
      Tracker.autorun(function () {
        if (Creator.bootstrapLoaded.get()) {
          var user = Creator.USER_CONTEXT.user;
          window.posthog.identify(user.userId);
          // 分组统计需要升级付费
          window.posthog.group('space', 'id:' + user.space._id, {
            name: user.space.name
          });
          window.posthog.people.set({
            id: user.userId,
            spaceId: user.space._id
          });
        }
      });
      Tracker.autorun(function () {
        FlowRouter.watchPathChange();
        if (FlowRouter.current().path) {
          window.posthog.capture('_trackPageview', {
            path: FlowRouter.current().path
          })
        }
      });
    })
  } catch (error) {
    console.log(error);
  }
})();