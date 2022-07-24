/*
 * moleculer-sentry
 * Copyright (c) 2022 LuxChan S.A R.L.-S (https://github.com/LuxChanLu/moleculer-sentry)
 * MIT Licensed
 */

'use strict'

const Sentry = require('@sentry/node')
const SentryUtils = require('@sentry/utils')
const Tracing = require("@sentry/tracing");
const project = require('./package.json');
const serviceName = project.name;

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 * 软件包服务启动后也需要抛出事件。
 */
module.exports = {
  name: serviceName,
  namespace: "steedos",

  /**
   * Dependencies
   */
  dependencies: [
    'steedos-server'
  ],

  /**
   * Settings
   */
  settings: {
    packageInfo: {
      path: __dirname,
      name: serviceName,
      isPackage: false
    },
    /** @type {Object?} Sentry configuration wrapper. */
    sentry: {
      enabled: process.env.STEEDOS_SENTRY_ENABLED != 'false',
      /** @type {String} DSN given by sentry. */
      dsn: process.env.STEEDOS_SENTRY_DSN ? process.env.STEEDOS_SENTRY_DSN : 'https://f87268cdc3cd4b58a25852c46b79d6b8@sentry.steedos.cn/3',
      /** @type {String} Name of event fired by "Event" exported in tracing. */
      tracingEventName: '$tracing.spans',
      /** @type {Object} Additional options for `Sentry.init`. */
      options: {
        // Set tracesSampleRate to 1.0 to capture 100%
        // of transactions for performance monitoring.
        // We recommend adjusting this value in production
        tracesSampleRate: 1.0,
        maxBreadcrumbs: 100,
        debug: process.env.NODE_ENV !== 'production',
        environment: process.env.NODE_ENV || "development",
        release: project.version,
        autoSessionTracking: true
      },
      /** @type {String?} Name of the meta containing user infos. */
      userMetaKey: null,
    },
  },


  /**
   * Events
   */
  events: {
    // bind event listeners
    '**'(payload, sender, event) {
      // only listen to specifig tracing event
      if (event !== this.settings.sentry.tracingEventName) {
        return
      }

      if (!this.settings.sentry.dsn)
        return
      this.onTracingEvent(payload)
    },

    '$metrics.snapshot': {
      handler(ctx) {
        // console.log("Payload:", ctx.params);
        // console.log("Sender:", ctx.nodeID);
        // console.log("Metadata:", ctx.meta);
        // console.log("The called event name:", ctx.eventName);
        if (this.isSentryReady()) {
          const payload = ctx.params
          Sentry.withScope((scope) => {
            scope.setTag('sender', ctx.nodeID)
            scope.setTag('span', ctx.eventName)
            scope.setTag('root_url', process.env.ROOT_URL)

            scope.setExtra('data', JSON.stringify(payload))

            Sentry.captureEvent({
              message: ctx.eventName,
              level: 'info'
            })
          })
        }

      }
    }
  },

  /**
   * Methods
   */
  methods: {
    /**
     * Get service name from metric event (Imported from moleculer-jaeger)
     *
     * @param {Object} metric
     * @returns {String}
     */
    getServiceName(metric) {
      if (!metric.service && metric.action) {
        const parts = metric.action.name.split('.')
        parts.pop()
        return parts.join('.')
      }
      return metric.service && metric.service.name ? metric.service.name : metric.service
    },

    /**
     * Get span name from metric event. By default it returns the action name (Imported from moleculer-jaeger)
     *
     * @param {Object} metric
     * @returns  {String}
     */
    getSpanName(metric) {
      return metric.action ? metric.action.name : metric.name
    },

    /**
     * Get object key under which user is stored in service meta
     *
     * @returns  {String}
     */
    getUserMetaKey() {
      // prefer new approach
      if (this.settings.sentry.userMetaKey) {
        return this.settings.sentry.userMetaKey
      }

      return null
    },

    /**
     * We need to normalize the stack trace, since Sentry will throw an error unless it's a valid raw stack trace
     *
     * @param stack
     * @returns {null|*[]|*}
     */
    getNormalizedStackTrace(stack) {
      // empty stack trace is not parseable by sentry,
      if (!stack) {
        return null
      }

      // if stacktrace is present as a string, wrap it into an array
      if (!Array.isArray(stack)) {
        return [stack];
      }

      return stack;
    },

    /**
     * Send error to sentry, based on the metric error
     *
     * @param {Object} metric
     */
    sendSentryError(metric) {
      Sentry.withScope((scope) => {
        scope.setTag('id', metric.requestID)
        scope.setTag('service', this.getServiceName(metric))
        scope.setTag('span', this.getSpanName(metric))
        scope.setTag('type', metric.error.type)
        scope.setTag('code', metric.error.code)
        scope.setTag('root_url', process.env.ROOT_URL)
        scope.setTag('version', project.version)

        if (metric.error.data) {
          scope.setExtra('data', metric.error.data)
        }

        const userMetaKey = this.getUserMetaKey()

        if (userMetaKey && metric.meta && metric.meta[userMetaKey]) {
          scope.setUser(metric.meta[userMetaKey])
        }

        Sentry.captureEvent({
          message: metric.error.message,
          stacktrace: this.getNormalizedStackTrace(metric.error.stack)
        })
      })
    },

    /**
     * Check if sentry is configured or not
     */
    isSentryReady() {
      return Sentry.getCurrentHub().getClient() !== undefined
    },

    /**
     * Tracing event handler
     *
     * @param metrics
     * @return void
     */
    onTracingEvent(metrics) {
      metrics.forEach((metric) => {
        if (metric.error && this.isSentryReady() && (!this.shouldReport || this.shouldReport(metric) == true)) {
          this.sendSentryError(metric)
        }
      })
    }
  },

  started() {
    // ToDo: remove deprecated dsn and options from settings with next version
    const dsn = this.settings.sentry.dsn
    const options = this.settings.sentry.options

    if (this.settings.sentry.enabled && dsn) {
      this.broker.logger.warn(`Sentry Tracing enabled: ${dsn}`)
      Sentry.init({
        dsn,
        ...options,
        integrations: [
          // enable HTTP calls tracing
          new Sentry.Integrations.Http({ tracing: true }),
          // enable Express.js middleware tracing
          new Tracing.Integrations.Express({
            // to trace all requests to the default router
            app: WebApp.connectHandlers,
            // alternatively, you can specify the routes you want to trace:
            // router: someRouter,
          }),
        ],
      })
      Sentry.setTag('spaceId', process.env.STEEDOS_CLOUD_SPACE_ID)
    }
  },

  async stopped() {
    if (this.isSentryReady()) {
      await Sentry.flush()
      SentryUtils.getGlobalObject().__SENTRY__ = undefined
    }
  }
}