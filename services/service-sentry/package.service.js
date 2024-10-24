/*
 * moleculer-sentry
 * Copyright (c) 2022 LuxChan S.A R.L.-S (https://github.com/LuxChanLu/moleculer-sentry)
 * MIT Licensed
 */

'use strict'


const _ = require('lodash');
const Sentry = require('@sentry/node')
const SentryUtils = require('@sentry/utils')
const packageLoader = require('@steedos/service-package-loader');
const project = require('./package.json');
const serviceName = project.name;

const DEFAULT_DSN = {
  'development': 'https://460c67b9796e47d0952bccdff25fb934@sentry.steedos.cn/3',
  'production': 'https://8a195c563c2a4997926387058cddedd2@sentry.steedos.cn/4'
}
const DEFAULT_DSN_JS = {
  'development': 'https://7c2b864b83bf4361a030a7df9d2ace0c@sentry.steedos.cn/7',
  'production': 'https://8f3f63d02e8140718a6123b10d49ae2f@sentry.steedos.cn/6'
}
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 * 软件包服务启动后也需要抛出事件。
 */
module.exports = {
  name: serviceName,
  namespace: "steedos",
	mixins: [packageLoader],

  /**
   * Dependencies
   */
  dependencies: [],

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
      enabled: process.env.STEEDOS_SENTRY_ENABLED == 'true',
      /** @type {String} DSN given by sentry. */
      dsn: process.env.STEEDOS_SENTRY_DSN,
      /** @type {String} Name of event fired by "Event" exported in tracing. */
      tracingEventName: '$tracing.spans',
      /** @type {Object} Additional options for `Sentry.init`. */
      options: {
        // Set tracesSampleRate to 1.0 to capture 100%
        // of transactions for performance monitoring.
        // We recommend adjusting this value in production
        tracesSampleRate: 0.2,
        maxBreadcrumbs: 100,
        debug: process.env.NODE_ENV == 'development',
        environment: process.env.NODE_ENV || "development",
        release: project.version,
        initialScope: {
          tags: { "root_url": process.env.ROOT_URL },
        },
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
    '$tracing.spans'(ctx) {
      // only listen to specifig tracing event
      if (ctx.eventName !== this.settings.sentry.tracingEventName) {
        return
      }

      if (!this.settings.sentry.enabled)
        return

      this.onTracingEvent(ctx.params)
    },

    async 'steedos-server.started'(ctx) {
      Sentry.setTag('masterSpaceId', __meteor_runtime_config__.masterSpaceId)
      if (this.dsnJS) {
        this.broker.call('steedos-server.setSettings', {
          PUBLIC_SETTINGS: {
            sentry: {dsn: this.dsnJS}
          }
        })
      }
    },
    async 'service-cloud-init.succeeded'(ctx) {
      Sentry.setTag('masterSpaceId', __meteor_runtime_config__.masterSpaceId)
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
      // console.log(metric)
      Sentry.withScope((scope) => {
        scope.setTag('id', metric.id)
        scope.setTag('service', this.getServiceName(metric))
        scope.setTag('span', this.getSpanName(metric))
        scope.setTag('type', metric.error.type)
        scope.setTag('code', metric.error.code)
        scope.setTag('nodeId', metric.tags.nodeID)
        scope.setTag('callerNodeID', metric.tags.callerNodeID)
        if (metric.tags.meta && metric.tags.meta.user && metric.tags.meta.user.userId && metric.tags.meta.user.spaceId) {
          scope.setUser({ 'id': metric.tags.meta.user.userId })
          scope.setTag('spaceId', metric.tags.meta.user.spaceId)
        }

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
    let { enabled, dsn, options } = this.settings.sentry
    if (enabled) {
      // 如果配置了dsn则使用配置的dsn，如未配置则根据NODE_ENV和isPlatformEnterPrise指定
      this.dsn = dsn;
      this.dsnJS = dsn;
      if (!this.dsn) {
        const nodeEnv = process.env.NODE_ENV || 'development'
        this.dsn = DEFAULT_DSN[nodeEnv]
        this.dsnJS = DEFAULT_DSN_JS[nodeEnv]
      }
      if (this.dsn) {
        this.broker.logger.info(`Sentry Tracing enabled: ${this.dsn}`)
        Sentry.init({
          dsn: this.dsn,
          ...options,
        })
      }
    }

  },

  async stopped() {
    if (this.isSentryReady()) {
      await Sentry.flush()
      SentryUtils.getGlobalObject().__SENTRY__ = undefined
    }
  }
}