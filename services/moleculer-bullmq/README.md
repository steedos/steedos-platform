# moleculer-bullmq

[![Coverage Status](https://coveralls.io/repos/github/LuxChanLu/moleculer-bullmq/badge.svg?branch=master)](https://coveralls.io/github/LuxChanLu/moleculer-bullmq?branch=master)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/24c78365441a4e5e99dde311cfa72f18)](https://www.codacy.com/app/LuxChanLu/moleculer-bullmq?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=LuxChanLu/moleculer-bullmq&amp;utm_campaign=Badge_Grade)
[![Maintainability](https://api.codeclimate.com/v1/badges/e7d4fa4fbe1032b51c77/maintainability)](https://codeclimate.com/github/LuxChanLu/moleculer-bullmq/maintainability)
![Libraries.io dependency status for latest release](https://img.shields.io/librariesio/release/npm/moleculer-bullmq)
[![Downloads](https://img.shields.io/npm/dm/moleculer-bullmq.svg)](https://www.npmjs.com/package/moleculer-bullmq)

## How to create job
You just need to add the `BullMqMixin` and add a `queue` attribute to you action.  
This action will be call with the params & meta of the scheduler.  
The return of the action will be the job result.  
The mixin will add the BullMq `job` into `locals`  
```js
module.exports = {
  name: 'jobs',
  mixins: [BullMqMixin],
  settings: {
    bullmq: {
      worker: { concurrency: 50 }
    }
  },
  actions: {
    resize: {
      queue: true,
      params: { width: 'number', height: 'number' },
      async handler(ctx) {
        const { width, height } = ctx.params
        const { user } = ctx.meta
        ctx.locals.job.updateProgress(100)
        return { user, size: width * height, job: ctx.locals.job.id }
      }
    }
  }
}
```
By default it use the redis cacher, but you can specify a custom client :
```js
module.exports = {
  name: 'jobs',
  mixins: [BullMqMixin],
  settings: {
    bullmq: {
      client: 'redis://:authpassword@127.0.0.1:6380/4'
    }
  }
}
The `client` option goes to the `IORedis` constructor.
```
## How to queue job
You can use the `queue` method, with five parameters : Current context, Queue name, Action name, Parameters, Job options
```js
module.exports = {
  name: 'my.service',
  mixins: [BullMqMixin],
  actions: {
    'resize.async': {
      async handler(ctx) {
        ctx.meta.user = 'Bob de glace'
        const job = await this.queue(ctx, 'jobs', 'resize', { width: 42, height: 42 }, { priority: 10 })
      }
    }
  }
}
```
If your in the same service as your scheduling action, you can omit the queue name with the `localQueue` method
```js
module.exports = {
  name: 'my.service',
  mixins: [BullMqMixin],
  actions: {
    resize: {
      queue: true,
      params: { width: 'number', height: 'number' },
      async handler(ctx) {
        const { width, height } = ctx.params
        const { user } = ctx.meta
        ctx.locals.job.updateProgress(100)
        return { user, size: width * height, job: ctx.locals.job.id }
      }
    },
    'resize.async': {
      async handler(ctx) {
        ctx.meta.user = 'Bob de glace'
        const job = await this.localQueue(ctx, 'resize', { width: 42, height: 42 }, { priority: 10 })
      }
    }
  }
}
```
