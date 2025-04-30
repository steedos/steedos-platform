if (!Meteor.settings.cron?.push_interval)
    return

var apn = require('apn');

const keyData = Meteor.settings.push?.apn?.keyData;
if (!keyData) {
    console.error("【Push】need to config keyData!")
    return;
}

const certData = Meteor.settings.push?.apn?.certData;
if (!certData) {
    console.error("【Push】need to config certData!")
    return;
}

const STEEDOS_PUSH_APP_BUNDLE_ID = process.env.STEEDOS_PUSH_APP_BUNDLE_ID;
if (!STEEDOS_PUSH_APP_BUNDLE_ID) {
    console.error("【Push】need to config env STEEDOS_PUSH_APP_BUNDLE_ID!")
    return;
}
// console.log("STEEDOS_PUSH_APP_BUNDLE_ID:", STEEDOS_PUSH_APP_BUNDLE_ID)

// console.log('process.env.NODE_ENV === "production"', process.env.NODE_ENV === "production");

let service = new apn.Provider({
    cert: keyData,
    key: certData,
    production: (process.env.NODE_ENV === "production"),
});

Push.sendAPN = function (userToken, notification) {
    // console.log("====1", userToken, notification)
    var e, noti;

    try {
        if (notification.title && notification.text) {
            noti = _.clone(notification);
            noti.text = noti.title + " " + noti.text;
            noti.title = "";
            return _sendAPN(userToken, noti);
        } else {
            return _sendAPN(userToken, notification);
        }
    } catch (error) {
        e = error;
        return console.error(e);
    }
};

function _sendAPN(userToken, notification) {
    // console.log("=====", "_sendAPN");
    // console.log("=====", userToken, notification);
    if (Match.test(notification.apn, Object)) {
        notification = _.extend({}, notification, notification.apn);
    }

    var priority = notification.priority || notification.priority === 0 ? notification.priority : 10;

    var note = new apn.Notification();
    note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.

    if (typeof notification.badge !== 'undefined') {
        note.badge = notification.badge;
    }

    if (typeof notification.sound !== 'undefined') {
        note.sound = notification.sound;
    }

    if (typeof notification.category !== 'undefined') {
        note.category = notification.category;
    }

    note.alert = notification.text;

    // console.log("note:", note);

    note.payload = notification.payload ? {
        ejson: EJSON.stringify(notification.payload)
    } : {};
    note.payload.messageFrom = notification.from;
    note.priority = priority; // Store the token on the note so we can reference it if there was an error

    // The topic is usually the bundle identifier of your application.
    note.topic = STEEDOS_PUSH_APP_BUNDLE_ID;

    // console.log(`Sending: ${note.compile()} to ${userToken}`);

    service.send(note, userToken).then(result => {
        // console.log("【Push】sent:", result.sent.length);
        if (result.failed.length) {
            console.log("【Push】failed:", result.failed.length);
            console.log(result.failed);
        }
    });


};