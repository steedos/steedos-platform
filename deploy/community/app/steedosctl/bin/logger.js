const fsPromises = require('fs/promises');
const Constants = require('./constants');

async function backup_error(err) {
  console.error(err);
  try {
    await fsPromises.access(Constants.STEEDOSCTL_LOG_PATH);
  } catch (error) {
    await fsPromises.mkdir(Constants.STEEDOSCTL_LOG_PATH);
  }
  await fsPromises.appendFile(Constants.STEEDOSCTL_LOG_PATH + '/backup.log', new Date().toISOString() + ' [ ERROR ] ' + err  + '\n');
}

async function backup_info(msg) {
  console.log(msg);
  try {
    await fsPromises.access(Constants.STEEDOSCTL_LOG_PATH);
  } catch (error) {
    await fsPromises.mkdir(Constants.STEEDOSCTL_LOG_PATH);
  }
  await fsPromises.appendFile(Constants.STEEDOSCTL_LOG_PATH + '/backup.log', new Date().toISOString() + ' [ INFO ] ' + msg + '\n');
}

module.exports = {
  backup_error,
  backup_info,
};
