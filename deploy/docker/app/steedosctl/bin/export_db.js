// Init function export mongodb
const shell = require('shelljs');
const Constants = require('./constants');

function export_database() {
  console.log('export_database  ....');
  shell.mkdir('-p', [Constants.BACKUP_PATH]);
  const cmd = `mongodump --uri='${process.env.STEEDOS_MONGODB_URI}' --archive='${Constants.BACKUP_PATH}/${Constants.DUMP_FILE_NAME}' --gzip`;
  shell.exec(cmd);
  console.log('export_database done');
}

function stop_application() {
  console.log('stop_application  ....');
  shell.exec('/usr/bin/supervisorctl stop steedos');
  console.log('stop_application done');
}

function start_application() {
  console.log('start_application  ....');
  shell.exec('/usr/bin/supervisorctl start steedos');
  console.log('start_application done');
}

// Main application workflow
function run() {
  let errorCode = 0;
  try {
    check_supervisord_status_cmd = '/usr/bin/supervisorctl >/dev/null 2>&1 ';
    shell.exec(check_supervisord_status_cmd, function (code) {
      if (code > 0) {
        shell.echo('application is not running, starting supervisord');
        shell.exec('/usr/bin/supervisord');
      }
    });

    shell.echo('stop steedos application before export database');
    stop_application();
    export_database();
    shell.echo('start steedos application after export database');
    shell.echo();
    shell.echo('\033[0;33m++++++++++++++++++++ NOTE ++++++++++++++++++++');
    shell.echo();
    shell.echo(
      'Please remember to also copy STEEDOS_ENCRYPTION_SALT and STEEDOS_ENCRYPTION_PASSWORD variables from the docker.env file to the target instance where you intend to import this database dump.',
    );
    shell.echo();
    shell.echo('++++++++++++++++++++++++++++++++++++++++++++++\033[0m');
    shell.echo();
  } catch (err) {
    shell.echo(err);
    errorCode = 1;
  } finally {
    start_application();
    process.exit(errorCode);
  }
}

module.exports = {
  run,
  exportDatabase: export_database,
  stopApplication: stop_application,
  startApplication: start_application,
};
