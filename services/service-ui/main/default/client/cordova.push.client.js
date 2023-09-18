if (Meteor.isCordova) {
  Meteor.startup(function () {
    const hasRegister = function () {
      let has = false;
      if (Push.push.handlers.notification && Push.push.handlers.notification.length > 0) {
        Push.push.handlers.notification.forEach(function (handler) {
          if (handler.toString().indexOf('push.setApplicationIconBadgeNumber') > 0) {
            has = true
          }
        })
      }
      return has;
    }
    document.addEventListener("deviceready", function () {
      return window.setTimeout(function () {
        var ref, ref1;

        if (hasRegister() == true) {
          return;
        }
        console.log('app注册push失败, 由client js注册push')
        Push.push.on("notification", function (data) {
          var host, path;
          if (data.additionalData.foreground === true) {
            if (data.count > -1) {
              push.setApplicationIconBadgeNumber(
                function () { },
                function () { },
                data.count
              );
            }
            return;
          }
          if (typeof data.additionalData.ejson === "string") {
            data.additionalData.ejson = JSON.parse(data.additionalData.ejson);
          }
          host = data.additionalData.ejson.host;
          if (host == null) {
            return;
          }
          host = host.replace(/\/$/, "");
          if (Servers.serverExists(host) !== true) {
            return;
          }
          window.AUTOLOAD = false;
          if (data.additionalData.ejson.url) {
            return FlowRouter.go(data.additionalData.ejson.url);
          } else {
            path = "";
            if (
              data.additionalData.ejson.space &&
              data.additionalData.ejson.instance
            ) {
              path =
                "workflow/space/" +
                data.additionalData.ejson.space +
                "/inbox/" +
                data.additionalData.ejson.instance;
            }
            navigator.splashscreen.hide();
            if (window.Session && window.Session.get("spaceId")) {
              return FlowRouter.go("/" + path);
            } else {
              return Servers.startServer(host, path, function (err, url) {
                if (err != null) {
                  return console.log(err);
                }
              });
            }
          }
        });
        if (
          ((ref = device.manufacturer) != null ? ref.toLowerCase() : void 0) ===
          "huawei" &&
          cordova.plugins.huaweipush
        ) {
          cordova.plugins.huaweipush.init();
          return document.addEventListener(
            "huaweipush.receiveRegisterResult",
            function (event) {
              var registrationId;
              console.log(event);
              registrationId = "huawei:" + event.token;
              Push.push.emit("registration", {
                registrationId: registrationId,
              });
            }.bind(this),
            false
          );
        } else if (
          ((ref1 = device.manufacturer) != null ? ref1.toLowerCase() : void 0) ===
          "xiaomi" &&
          window.plugins.MiPushPlugin
        ) {
          window.plugins.MiPushPlugin.init();
          return document.addEventListener(
            "mipush.receiveRegisterResult",
            function (data) {
              var registrationId;
              console.log(data);
              registrationId = "mi:" + data.regId;
              Push.push.emit("registration", {
                registrationId: registrationId,
              });
            },
            false
          );
        }
      }, 1000);
    });
  })
}
