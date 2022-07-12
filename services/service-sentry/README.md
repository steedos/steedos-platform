## sentry

This package uses Moleculer's tracing function to catch errors and send them to sentry. In oder for it to function
properly, you need to enable tracing and use the "Event" exporter. To see how to set up tracing, please refer to
the [moleculer documentation](https://moleculer.services/docs/0.14/tracing.html#Event).

```js
const SentryMixin = require('moleculer-sentry')

module.exports = {
  mixins: [SentryMixin],

  settings: {
    /** @type {Object?} Sentry configuration wrapper. */
    sentry: {
      /** @type {String} DSN given by sentry. */
      dsn: null,
      /** @type {String} Name of event fired by "Event" exported in tracing. */
      tracingEventName: '$tracing.spans',
      /** @type {Object} Additional options for `Sentry.init`. */
      options: {},
      /** @type {String?} Name of the meta containing user infos. */
      userMetaKey: null,
    },
  }
}
```
