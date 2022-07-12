/*
 * moleculer-sentry
 * Copyright (c) 2022 LuxChan S.A R.L.-S (https://github.com/LuxChanLu/moleculer-sentry)
 * MIT Licensed
 */

'use strict'

const Sentry = require('@sentry/node')
const SentryUtils = require('@sentry/utils')
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
		  /** @type {String} DSN given by sentry. */
		  dsn: process.env.STEEDOS_SENTRY_DSN ? process.env.STEEDOS_SENTRY_DSN : 'https://dcbd110ff4d646598c0bd9751cfc8c20@o1314957.ingest.sentry.io/6566429',
		  /** @type {String} Name of event fired by "Event" exported in tracing. */
		  tracingEventName: '$tracing.spans',
		  /** @type {Object} Additional options for `Sentry.init`. */
		  options: {},
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

      this.onTracingEvent(payload)
    },
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
        scope.setTag('steedos_version', require("steedos-server/package.json").version)

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

    if (dsn) {
      this.broker.logger.warn(`Sentry Tracing enabled: ${dsn}`)
      Sentry.init({ dsn, ...options })
    }
  },

  async stopped() {
    if (this.isSentryReady()) {
      await Sentry.flush()
      SentryUtils.getGlobalObject().__SENTRY__ = undefined
    }
  }
}