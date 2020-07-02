if Meteor.isCordova
        Meteor.startup ->
                Push.Configure
                        android:
                                senderID: window.ANDROID_SENDER_ID
                                sound: true
                                vibrate: true
                        ios:
                                badge: true
                                clearBadge: true
                                sound: true
                                alert: true
                        appName: "workflow"
