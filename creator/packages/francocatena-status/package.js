Package.describe({
  name:    'francocatena:status',
  git:     'https://github.com/francocatena/meteor-status',
  summary: 'Displays the connection status between browser and server',
  version: '1.5.3'
})

Package.onUse(function (api) {
  var client = 'client'
  var both   = ['client', 'server']

  api.versionsFrom('1.0')

  api.use('deps',         client)
  api.use('templating',   client)
  api.use('underscore',   client)
  api.use('reactive-var', client)

  api.use('tap:i18n@1.7.0', both)
  api.imply('tap:i18n')

  api.addFiles('lib/status.html',            client)
  api.addFiles('templates/bootstrap3.html',  client)
  api.addFiles('templates/semantic_ui.html', client)
  api.addFiles('templates/materialize.html', client)
  api.addFiles('templates/uikit.html',       client)
  api.addFiles('templates/foundation.html',  client)

  // Always after templates
  // api.addFiles('i18n/cn.i18n.json',    both)
  // api.addFiles('i18n/cs.i18n.json',    both)
  // api.addFiles('i18n/da.i18n.json',    both)
  // api.addFiles('i18n/de.i18n.json',    both)
  // api.addFiles('i18n/en.i18n.json',    both)
  // api.addFiles('i18n/es.i18n.json',    both)
  // api.addFiles('i18n/et.i18n.json',    both)
  // api.addFiles('i18n/fr.i18n.json',    both)
  // api.addFiles('i18n/id.i18n.json',    both)
  // api.addFiles('i18n/it.i18n.json',    both)
  // api.addFiles('i18n/ms.i18n.json',    both)
  // api.addFiles('i18n/nl.i18n.json',    both)
  // api.addFiles('i18n/pt.i18n.json',    both)
  // api.addFiles('i18n/ru.i18n.json',    both)
  // api.addFiles('i18n/tr.i18n.json',    both)
  // api.addFiles('i18n/vi.i18n.json',    both)
  // api.addFiles('i18n/zh.i18n.json',    both)
  // api.addFiles('i18n/zh-TW.i18n.json', both)

  api.addFiles('status.js',     client)
  api.addFiles('lib/status.js', client)

  api.export('Status', client)
})

Package.onTest(function (api) {
  var client = 'client'

  api.use('francocatena:status', client)
  api.use('tinytest',            client)
  api.use('test-helpers',        client)

  api.addFiles('test/status_tests.js', client)
})
