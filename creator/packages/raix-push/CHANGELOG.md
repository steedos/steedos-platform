# Changelog

## vCurrent

- support lookup by userid to prevent duplicate records for same user

- add-support-to-title-in-ios

- allow-apn-category-field

## [v2.6.0] (https://github.com/raix/push/tree/v2.6.0)
#### 28/01/15 by Morten Henriksen
- Respect resume - if paused wait until resume before triggering start up events

- make startup event stable

- enabled "alert" should not force alert - use message event instead

- make sure set badge runs when device is ready

- Use updated pushplugin

- add raix:cordova as a weak dependency

- Allow the client create doc with id instead of throwing error

## [master-workpop-pr] (https://github.com/raix/push/tree/master-workpop-pr)
#### 27/01/15 by Morten Henriksen
## [master-foo] (https://github.com/raix/push/tree/master-foo)
#### 27/01/15 by Morten Henriksen
- check that token is not undefined

- *Merged pull-request:* "raix:push-update -> server generates record id rather than client" [#32](https://github.com/raix/push/issues/32) ([alexcorre](https://github.com/alexcorre))

- fix readme italics markdown

- update to 2.6.0 for breaking change + change name back to raix:push

- bump to 2.5.4

- Make push-update return 404 if ID is included that does not yet exist

- remove another extra comma

- Add meteor method docs to README.md

- Merge branch 'master' of github.com:raix/push

- *Merged pull-request:* "Docupdates" [#29](https://github.com/raix/push/issues/29) ([funkyeah](https://github.com/funkyeah))

- remove extra comma

- bump version to 2.5.3

- fix issue with push-update

- .idea to gitignore and update version

- raix:push-update no longer requires id, generates if none included

- raix:push-update remove required but unused metadata field from options

- grammar and formatting changes to Push.send

- more details on the flexibility of Push.send

- Push.send advanced documentation updates

- Gi-Software push logo size

- add logo

- Add Gi-Software logo

Patches by GitHub users [@alexcorre](https://github.com/alexcorre), [@funkyeah](https://github.com/funkyeah).

## [v2.5.1] (https://github.com/raix/push/tree/v2.5.1)
#### 04/01/15 by Morten Henriksen
- Add updated iframe code for consistency

- Add iOS startup workaround for stable events

- Change payload behaviour - Modify payload when sending instead of storing

## [v2.5.0] (https://github.com/raix/push/tree/v2.5.0)
#### 03/01/15 by Morten Henriksen
- Improve the payload object, this is now the same on both iOS and Android and will preserve types via ejson

- add doc about open

- wrap in device ready - dont trust Meteor.startup

- Add a new `open` flag marking if the note triggered the app to open

- add more test alerts

- exclude aps from the payload

## [v2.4.1] (https://github.com/raix/push/tree/v2.4.1)
#### 03/01/15 by Morten Henriksen
- Fixed getting userId on the server throws error

## [v2.4.0] (https://github.com/raix/push/tree/v2.4.0)
#### 03/01/15 by Morten Henriksen
- Refactor Push.init to Push.Configure and add call once check

## [v2.3.3] (https://github.com/raix/push/tree/v2.3.3)
#### 03/01/15 by Morten Henriksen
- just sound location

- Add better Push.debug verbosity

## [v2.3.2] (https://github.com/raix/push/tree/v2.3.2)
#### 29/12/14 by Morten Henriksen
- Dont try to play empty sound file names

- only prefix sound if text found

## [v2.3.1] (https://github.com/raix/push/tree/v2.3.1)
#### 29/12/14 by Morten Henriksen
- 2.3.1 - added payload option

- fix default calback settings

- add payload in event

- add commented alerts for debugging

- clean up foreground code and keep coldstart

- document payload

- check and add payload

## [v2.3.0] (https://github.com/raix/push/tree/v2.3.0)
#### 29/12/14 by Morten Henriksen
- add type in events

- 2.3.0 Added vibrate and better support for sound/alerts and a unified api

- refactoring of the server send api

- add limited documentation for default event listeners

- add vibrate

- have badge and sound added only if actually set

- add badge and sound

- correct default alert and add vibrate

- only emit alert events when in foreground

- Unify the notification message object and event model

- Add basis code for apn to know about app status

- Dont emit badge event when user sets badge


## [v2.2.1] (https://github.com/raix/push/tree/v2.2.1)
#### 29/12/14 by Morten Henriksen
- Add the passphrase... ups

- use meteor startup

- Remove unused reference

- *Fixed bug:* "Sending Push Message From Browser Console Requires Logged In User" [#11](https://github.com/raix/push/issues/11)

- added more debug details

- update change log

## [v2.2.0] (https://github.com/raix/push/tree/v2.2.0)
#### 28/12/14 by Morten Henriksen
- Add support for config file

- Refactor files into folders

- Update change log

## [v2.1.3] (https://github.com/raix/push/tree/v2.1.3)
#### 27/12/14 by Morten Henriksen
- Use the matchToken in common

- Correct createdBy match - allow null

- Added a basic example

## [v2.1.2] (https://github.com/raix/push/tree/v2.1.2)
#### 27/12/14 by Morten Henriksen
- Thanks to @adam-hanna

## [v2.1.1] (https://github.com/raix/push/tree/v2.1.1)
#### 26/12/14 by Morten Henriksen
- Add more debug verbosity

- Fix android sends - convert string to array of strings

## [v2.1.0] (https://github.com/raix/push/tree/v2.1.0)
#### 26/12/14 by Morten Henriksen
- Correct documentation

- Add allow and deny rules to documentation

- Ignore setBadge on the server for now

- Add the throttled send

- Add secure client send push notification

- Refactor appId to appName

- add more credits

- fix docs

- Add more documentation - all for free

- Correct details about client send

- move setBadge to client code for now

## [v2.0.11] (https://github.com/raix/push/tree/v2.0.11)
#### 26/12/14 by Morten Henriksen
- Clean up docs and hide more advanced features

- pushId in options is now deprecated - use gcm.projectNumber, gcm.apiKey, websitePushId instead - Breaking change!

- have a general production option for Push.init

- We init apn feedback pr. default

- add more debug verbosity

- Add security warnings about exposing keys/certificates or passphrase on client

## [v2.0.10] (https://github.com/raix/push/tree/v2.0.10)
#### 26/12/14 by Morten Henriksen
- 2.0.10 - Added userId and metadata to the appCollection

- Actually set and check the userId

- For now send will return array of app id's that was sent to - This will likely change back to a simple counter in the future

- Comment on meteor startup

- refactor and added the store user id feature

- use the stored scope

- Store data in the stored scope

- use a general save to storage function

- use a general load from storage function

- Add additional checks

- The server can register what user is using the app

- namespace methods to the package raix:push-method

- Detect if the user installed accounts package

- Fix missing ios7 badge updates

- clean up code

- we don't need namescpacing in localstorage

- Add Push scope to common code

## [v2.0.9] (https://github.com/raix/push/tree/v2.0.9)
#### 23/12/14 by Morten Henriksen
- Add details about apn initFeedback

- Implement the update and invalidation of tokens - use the Push.initFeedback()

- Change priority - id first then token, then create

- Actually update the token

## [v2.0.8] (https://github.com/raix/push/tree/v2.0.8)
#### 23/12/14 by Morten Henriksen
- Fix by @adamgins - data wiped on update #2

## [v2.0.7] (https://github.com/raix/push/tree/v2.0.7)
#### 20/12/14 by Morten Henriksen
- Bump to version 2.0.7

- Add example of send

- Added createdAt and updatedAt to the app collection

- Created new api for the send method it now takes options instead of positioned arguments

- remove wip

- have send return send status object { apn: 0, gcm: 0 }

## [v2.0.6] (https://github.com/raix/push/tree/v2.0.6)
#### 17/12/14 by Morten Henriksen
- Bump to version 2.0.6

- mbr update, remove versions.json

## [v2.0.5] (https://github.com/raix/push/tree/v2.0.5)
#### 17/12/14 by Morten Henriksen
## [v2.0.4] (https://github.com/raix/push/tree/v2.0.4)
#### 17/12/14 by Morten Henriksen
- mbr update versions and fix warnings

## [v2.0.3] (https://github.com/raix/push/tree/v2.0.3)
#### 16/12/14 by Morten Henriksen
- have the value be null instead of undefined

## [v2.0.2] (https://github.com/raix/push/tree/v2.0.2)
#### 16/12/14 by Morten Henriksen
- Fix options extend

- warn about missing pushId on android

- make sure options.gcm is set

- add github page

## [v2.0.1] (https://github.com/raix/push/tree/v2.0.1)
#### 15/12/14 by Morten Henriksen
- add setBadge

- remove console

- add docs

- working on apn and cgm

- initial commit - WIP

