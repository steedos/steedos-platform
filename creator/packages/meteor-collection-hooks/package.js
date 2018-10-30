/* global Package */

Package.describe({
  name: 'matb33:collection-hooks',
  summary: 'Extends Mongo.Collection with before/after hooks for insert/update/remove/find/findOne',
  version: '0.9.0-rc.4',
  git: 'https://github.com/matb33/meteor-collection-hooks.git'
})

Package.onUse = Package.onUse || Package.on_use    // backwards-compat
Package.onTest = Package.onTest || Package.on_test // backwards-compat

Package.onUse(function (api, where) {
  api.addFiles = api.addFiles || api.add_files     // backwards-compat

  if (api.versionsFrom) { // 0.9.0+ litmus test
    api.versionsFrom('1.3.5.1')

    api.use([
      'mongo',
      'tracker'
    ])
  } else {
    api.use([
      'mongo-livedata',
      'deps'
    ])
  }

  api.use([
    'underscore',
    'ejson',
    'minimongo'
  ])

  api.use(['accounts-base'], ['client', 'server'], {weak: true})

  api.addFiles([
    'collection-hooks.js',
    'insert.js',
    'update.js',
    'remove.js',
    'upsert.js',
    'find.js',
    'findone.js'
  ])

  // Load after all advices have been defined
  api.addFiles('users-compat.js')

  api.export('CollectionHooks')
})

Package.onTest(function (api) {
  // var isTravisCI = process && process.env && process.env.TRAVIS

  api.addFiles = api.addFiles || api.add_files     // backwards-compat

  if (api.versionsFrom) { // 0.9.0+ litmus test
    api.versionsFrom('1.3.5.1')
    api.use('mongo')
  }

  api.use([
    'matb33:collection-hooks',
    'underscore',
    'accounts-base',
    'accounts-password',
    'tinytest',
    'test-helpers'
  ])

  api.addFiles('tests/insecure_login.js')

  // local = minimongo (on server and client)
  // both = minimongo on client and server, mongo on server, with mutator methods
  // allow = same as both but with an allow rule test
  api.addFiles('tests/insert_local.js')
  api.addFiles('tests/insert_both.js')
  api.addFiles('tests/insert_allow.js')
  api.addFiles('tests/insert_user.js', 'server')

  api.addFiles('tests/update_local.js')
  api.addFiles('tests/update_both.js')
  api.addFiles('tests/update_allow.js')
  api.addFiles('tests/update_user.js', 'server')
  api.addFiles('tests/update_without_id.js', 'server')

  api.addFiles('tests/remove_local.js')
  api.addFiles('tests/remove_both.js')
  api.addFiles('tests/remove_allow.js')

  api.addFiles('tests/find.js')
  api.addFiles('tests/findone.js')
  api.addFiles('tests/find_users.js')
  api.addFiles('tests/find_findone_userid.js')

  api.addFiles('tests/multiple_hooks.js')
  api.addFiles('tests/transform.js')
  api.addFiles('tests/direct.js')
  api.addFiles('tests/optional_previous.js')
  api.addFiles('tests/compat.js')
  api.addFiles('tests/hooks_in_loop.js')
  api.addFiles('tests/upsert.js')
  api.addFiles('tests/trycatch.js')
  api.addFiles('tests/meteor_1_4_id_object.js')

  // NOTE: not testing against CollectionFS anymore, getting weird warning:
  // https://github.com/CollectionFS/Meteor-CollectionFS/issues/688
  // if (!isTravisCI) {
  //   api.use([
  //     'cfs:standard-packages',
  //     'cfs:filesystem'
  //   ])

  //   api.addFiles('tests/collectionfs.js')
  // }

  // NOTE: not supporting fetch for the time being.
  // NOTE: fetch can only work server-side because find's 'fields' option is
  // limited to only working on the server
  // api.addFiles('tests/fetch.js', 'server')
})
