const nodemailer = require('nodemailer');
const shell = require('shelljs');


const Constants = require('./constants');
const utils = require('./utils');
const logger = require('./logger');

const mailEnabled = process.env.STEEDOS_MAIL_ENABLED;
const mailFrom = process.env.STEEDOS_MAIL_FROM;
const mailHost = process.env.STEEDOS_MAIL_HOST;
const mailPort = process.env.STEEDOS_MAIL_PORT;
const mailUser = process.env.STEEDOS_MAIL_USERNAME;
const mailPass = process.env.STEEDOS_MAIL_PASSWORD;
const mailTo = process.env.STEEDOS_ADMIN_EMAILS;

async function sendBackupErrorToAdmins(err, backupTimestamp) {
  console.log('Sending Error mail to admins.');
  try {
    if (!mailEnabled || !mailFrom || !mailHost || !mailPort || !mailUser || !mailPass) {
      throw new Error('Failed to send error mail. Email provider is not configured, please refer to https://docs.appsmith.com/setup/instance-configuration/email to configure it.');
    }
    else if (!mailTo) {
      throw new Error('Failed to send error mail. Admin email(s) not configured, please refer to https://docs.appsmith.com/setup/instance-configuration/disable-user-signup#administrator-emails to configure it.');
    }
    else if (!mailEnabled) {
      throw new Error('Mail not sent! STEEDOS_MAIL_ENABLED env val is disabled, please refer to https://docs.appsmith.com/setup/instance-configuration/email to enable it.');
    }
    else {
      const backupFiles = await utils.listLocalBackupFiles();
      const lastBackupfile = backupFiles.pop();
      const lastBackupTimestamp = lastBackupfile.match(/steedos-backup-(.*)\.tar.gz/)[1];
      const lastBackupPath = Constants.BACKUP_PATH + '/' + lastBackupfile;

      const domainName = process.env.STEEDOS_CUSTOM_DOMAIN;
      const instanceName = process.env.STEEDOS_INSTANCE_NAME;

      let text = 'Steedos backup did not complete successfully.\n\n ' +
        'Backup timestamp: ' + backupTimestamp + '\n\n' +
        'Last Successful Backup timestamp: ' + lastBackupTimestamp + '\n' +
        'Last Successful Backup location: ' + lastBackupPath + '\n\n';

      if (instanceName) {
        text = text + 'Steedos instance name: ' + instanceName + '\n';
      }
      if (domainName) {
        text = text + 'Link to Steedos admin settings: ' + 'http://' + domainName + '/settings/general' + '\n';
      }
      text = text + '\n' + err.stack;

      const transporter = nodemailer.createTransport({
        host: mailHost,
        port: mailPort,
        auth: {
          user: mailUser,
          pass: mailPass
        }
      });

      await transporter.sendMail({
        from: mailFrom,
        to: mailTo,
        subject: '[Steedos] ERROR: Backup Failed',
        text: text
      });
    }
  } catch (err) {
    await logger.backup_error(err.stack);
    return;
  }
}

module.exports = {
  sendBackupErrorToAdmins,
};