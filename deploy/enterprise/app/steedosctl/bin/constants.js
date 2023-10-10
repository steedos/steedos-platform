
const BACKUP_PATH = "/steedos-storage/data/backup"

const RESTORE_PATH = "/steedos-storage/data/restore"

const DUMP_FILE_NAME = "steedos-data.archive"

const STEEDOSCTL_LOG_PATH = "/steedos-storage/logs/steedosctl"

const LAST_ERROR_MAIL_TS = "/steedos-storage/data/backup/last-error-mail-ts"

const MIN_REQUIRED_DISK_SPACE_IN_BYTES = 2147483648 // 2GB

const DURATION_BETWEEN_BACKUP_ERROR_MAILS_IN_MILLI_SEC = 21600000 // 6 hrs

const STEEDOS_DEFAULT_BACKUP_ARCHIVE_LIMIT = 4 // 4 backup archives

module.exports = {
    BACKUP_PATH,
    RESTORE_PATH,
    DUMP_FILE_NAME,
    LAST_ERROR_MAIL_TS,
    STEEDOSCTL_LOG_PATH,
    MIN_REQUIRED_DISK_SPACE_IN_BYTES,
    DURATION_BETWEEN_BACKUP_ERROR_MAILS_IN_MILLI_SEC,
    STEEDOS_DEFAULT_BACKUP_ARCHIVE_LIMIT
}
